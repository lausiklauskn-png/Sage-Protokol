// Headless smoke — Re-Sign-Welle: tools/resign_spore_v02.mjs (Spore v0.2).
// Run with `node tests/smoke_resign_spore_v02.mjs`
// (nach `npm install --no-save fake-indexeddb`). WebCrypto = node:crypto.
//
// Beweist die Neu-Signier-Automatik (ENV-Schlüssel-Pfad):
//   A) JWK-Schlüssel + Schnipsel → gültige v0.2-Spore (protocolVersion 0.2,
//      echter domainVector übernommen, snippetVectors angehängt), vom ECHTEN
//      Verifizierer akzeptiert.
//   B) Reiner Bump ohne Schnipsel → v0.2, domainVector bleibt.
//   C) Falscher Schlüssel → Abbruch (kein Identitäts-Wechsel).
//   D) Ohne SBKIM_NODE_KEY → Abbruch.

import { webcrypto } from "node:crypto";
import { writeFile, readFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const subtle = webcrypto.subtle;
const SCRIPT = resolve(repoRoot, "tools/resign_spore_v02.mjs");

const results = [];
const record = (probe, expected, actual, ok) => results.push({ probe, expected, actual, ok });

function b64url(b) {
  const v = b instanceof Uint8Array ? b : new Uint8Array(b);
  let s = ""; for (const x of v) s += String.fromCharCode(x);
  return Buffer.from(s, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function canon(v) {
  if (v === null) return null;
  if (Array.isArray(v)) return v.map(canon);
  if (typeof v === "object") { const k = Object.keys(v).sort(); const o = {}; for (const x of k) o[x] = canon(v[x]); return o; }
  return v;
}
function fakeVec(seed) {
  let h = 2166136261; for (let c = 0; c < seed.length; c++) { h ^= seed.charCodeAt(c); h = Math.imul(h, 16777619); }
  let s = h >>> 0; const r = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const v = new Array(384); let n = 0; for (let d = 0; d < 384; d++) { const x = r() - 0.5; v[d] = x; n += x * x; }
  n = Math.sqrt(n) || 1; return v.map((x) => x / n);
}

function runScript(env, args) {
  return new Promise((res) => {
    const child = spawn(process.execPath, [SCRIPT, ...args], { cwd: repoRoot, env: { ...process.env, ...env } });
    let out = "", err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", (code) => res({ code, out, err }));
  });
}

async function run() {
  const dir = await mkdtemp(join(tmpdir(), "sbkim-resign-"));
  // Stabile Identität + Basis-Spore (0.1, echter domainVector).
  const kp = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const privJwk = await subtle.exportKey("jwk", kp.privateKey);
  const pubJwkRaw = await subtle.exportKey("jwk", kp.publicKey);
  const pub = { kty: pubJwkRaw.kty, crv: pubJwkRaw.crv, x: pubJwkRaw.x, key_ops: ["verify"], ext: true, alg: "Ed25519" };
  const raw = new Uint8Array(await subtle.exportKey("raw", kp.publicKey));
  const id = b64url(new Uint8Array(await subtle.digest("SHA-256", raw)));
  const dv = fakeVec("domain");
  const unsigned = {
    createdAt: new Date().toISOString(), domain: "test.example.org", domainVector: dv,
    embeddingModel: "Xenova/multilingual-e5-small", endpoint: "https://test.example.org/",
    id, nodeName: "TestNode", nodeType: "hybrid", protocolVersion: "0.1", publicKey: pub,
  };
  const sig = await subtle.sign({ name: "Ed25519" }, kp.privateKey, new TextEncoder().encode(JSON.stringify(canon(unsigned))));
  const baseSpore = canon(unsigned); baseSpore.signature = b64url(sig);
  const basePath = join(dir, "base.json");
  await writeFile(basePath, JSON.stringify(baseSpore, null, 2));

  const snips = [{ vec: fakeVec("s1"), text: "Satz eins." }, { vec: fakeVec("s2"), text: "Satz zwei." }];
  const snipPath = join(dir, "snips.json");
  await writeFile(snipPath, JSON.stringify(snips));

  const keyEnv = JSON.stringify(privJwk);

  // ---- A) JWK + Schnipsel → v0.2 ----
  const outA = join(dir, "outA.json");
  const rA = await runScript({ SBKIM_NODE_KEY: keyEnv }, ["--in", basePath, "--snippets", snipPath, "--out", outA]);

  /* ── EHRLICH SEIN, WENN GAR NICHT GEPRÜFT WERDEN KANN (2026-08-14) ─────────
   * Diese Probe startet `tools/resign_spore_v02.mjs` als Kind-Prozess und sah
   * bisher nur dessen Exit-Code. Fehlt dort ein Paket (`fake-indexeddb`, das
   * Sage mangels package.json nicht mitbringt), stirbt das Skript beim Import
   * — und die Probe meldete daraufhin SIEBEN gefundene Fehler, obwohl sie in
   * Wahrheit nichts prüfen konnte.
   *
   * Das ist schlimmer als ein ehrliches „geht hier nicht": es schickt jede
   * Sitzung auf die Suche nach einem Fehler in der Re-Sign-Welle, den es nicht
   * gibt. Ein Wächter, der nicht messen kann, muss das SAGEN — nicht raten und
   * nicht anklagen.
   *
   * Der Grund steht in der stderr des Kindes; erkannt wird er am Node-Fehler-
   * code, nicht am Wortlaut. `tests/run_alle.mjs` liest denselben Marker aus
   * unserer Ausgabe und zählt die Probe dann als „nicht lauffähig". */
  if (/ERR_MODULE_NOT_FOUND|Cannot find package/.test(rA.err || "")) {
    const paket = (/Cannot find package '([^']+)'/.exec(rA.err) || [, "?"])[1];
    console.log("\nNICHT LAUFFÄHIG — ungeprüft, nicht kaputt.");
    /* Die Meldung trägt den WORTLAUT von Node mit („Cannot find package '…'"),
       nicht nur eine eigene Umschreibung: `tests/run_alle.mjs` liest den
       Paketnamen genau daraus. Eine schönere eigene Formulierung liesse dort
       ein „?" stehen — und der Läufer könnte nicht sagen, WAS fehlt. */
    console.log("  tools/resign_spore_v02.mjs kann nicht starten — Cannot find package '" + paket + "'.");
    console.log("  ERR_MODULE_NOT_FOUND — Sage hat keine package.json, die es mitbrächte.");
    console.log("  Die Re-Sign-Welle ist damit hier WEDER bestätigt NOCH widerlegt.");
    process.exit(1);
  }
  record("A — Exit 0", "0", String(rA.code), rA.code === 0);
  record("A — ✔ VALID gemeldet", "true", String(rA.out.includes("✔ VALID")), rA.out.includes("✔ VALID"));
  let sporeA = null;
  try { sporeA = JSON.parse(await readFile(outA, "utf8")); } catch { /* leer */ }
  record("A — protocolVersion 0.2", "0.2", sporeA ? sporeA.protocolVersion : "—", !!sporeA && sporeA.protocolVersion === "0.2");
  record("A — snippetVectors: 2", "2", sporeA ? String((sporeA.snippetVectors || []).length) : "—",
    !!sporeA && (sporeA.snippetVectors || []).length === 2);
  record("A — domainVector erhalten (384)", "384", sporeA ? String((sporeA.domainVector || []).length) : "—",
    !!sporeA && (sporeA.domainVector || []).length === 384);
  record("A — id unverändert (Identität stabil)", id.slice(0, 8), sporeA ? String(sporeA.id).slice(0, 8) : "—",
    !!sporeA && sporeA.id === id);

  // ---- B) reiner Bump ----
  const outB = join(dir, "outB.json");
  const rB = await runScript({ SBKIM_NODE_KEY: keyEnv }, ["--in", basePath, "--out", outB]);
  const sporeB = rB.code === 0 ? JSON.parse(await readFile(outB, "utf8")) : null;
  record("B — reiner Bump v0.2, kein Schnipsel", "0.2/undefined",
    sporeB ? sporeB.protocolVersion + "/" + String(sporeB.snippetVectors) : "—",
    !!sporeB && sporeB.protocolVersion === "0.2" && sporeB.snippetVectors === undefined);

  // ---- C) falscher Schlüssel ----
  const kp2 = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const wrongEnv = JSON.stringify(await subtle.exportKey("jwk", kp2.privateKey));
  const rC = await runScript({ SBKIM_NODE_KEY: wrongEnv }, ["--in", basePath, "--out", join(dir, "nope.json")]);
  record("C — falscher Schlüssel → Abbruch (exit ≠ 0)", "≠0", String(rC.code), rC.code !== 0);
  record("C — Grund genannt (Identität)", "true",
    String(/NICHT zur Identität/.test(rC.err)), /NICHT zur Identität/.test(rC.err));

  // ---- D) kein Schlüssel ----
  const rD = await runScript({ SBKIM_NODE_KEY: "" }, ["--in", basePath]);
  record("D — ohne ENV-Schlüssel → Abbruch", "≠0", String(rD.code), rD.code !== 0);

  // Print
  let green = 0;
  for (const r of results) { if (r.ok) green++; }
  console.log("\n  Probe | erwartet | erhalten | ok");
  console.log("  ------|----------|----------|----");
  for (const r of results) {
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.probe} | ${r.expected} | ${r.actual}`);
  }
  console.log(`\nTotal: ${results.length} Proben, ${green} grün, ${results.length - green} rot.`);
  if (green !== results.length) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
