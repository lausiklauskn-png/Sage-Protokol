// Headless smoke — Spore v0.2 in Modul 02 (Spec-Sitzung 2026-07-14, A6+A10).
// Run with `node tests/smoke_bau02_spore_v02.mjs`
// (nach `npm install --no-save fake-indexeddb`). WebCrypto = node:crypto.
//
// Beweist:
//   A) PROTOCOL_VERSION im Code ist "0.2" (A6-Schließung + Bump).
//   B) snippetVectors werden additiv aufgenommen, kanonisch SIGNIERT und
//      wieder VERIFIZIERT (Ed25519 über den ganzen Umschlag inkl. Schnipsel).
//   C) Harte Kürzung auf SPORE_SNIPPET_MAX (20) — kein Throw, überzählige weg.
//   D) Defensiver Schema-Check: vec-Länge ≠ 384 → InvalidSporeMetaError.
//   E) Sanfter Übergang: 0.1↔0.2 gegenseitig verifizierbar (major-tolerant).
//   F) Manipulation an einem Schnipsel bricht die Signatur (Integritäts-Beweis).
//   G) Ohne snippetVectors bleibt der Umschlag frei davon (0.1-kompatibel).

import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, writable: false, configurable: true });
}

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob",
                "TextEncoder", "TextDecoder", "indexedDB", src
    )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB);
}

loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");

const SbkimSpore = globalThis.SbkimSpore;

const results = [];
const record = (probe, expected, actual, ok) => results.push({ probe, expected, actual, ok });

// Deterministischer L2-normalisierter 384-Vektor aus einem Seed-Text.
function fakeVec(seedText) {
  const dim = 384;
  let h = 2166136261; const s = String(seedText);
  for (let c = 0; c < s.length; c++) { h ^= s.charCodeAt(c); h = Math.imul(h, 16777619); }
  let seed = h >>> 0; const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const v = new Array(dim); let n = 0;
  for (let d = 0; d < dim; d++) { const x = rnd() - 0.5; v[d] = x; n += x * x; }
  n = Math.sqrt(n) || 1;
  for (let d = 0; d < dim; d++) v[d] = v[d] / n;
  return v;
}

async function run() {
  // ---- A) PROTOCOL_VERSION + _meta ----
  record("_meta.protocolVersion = 0.2", "0.2", String(SbkimSpore._meta.protocolVersion),
    SbkimSpore._meta.protocolVersion === "0.2");
  record("_meta.sporeSnippetMax = 20", "20", String(SbkimSpore._meta.sporeSnippetMax),
    SbkimSpore._meta.sporeSnippetMax === 20);

  await SbkimSpore.init();
  await SbkimSpore.getOrCreateIdentity();

  const baseMeta = { domain: "smoke.example.org", nodeType: "hybrid", endpoint: "https://smoke.example.org/" };

  // ---- B) snippetVectors signiert + verifiziert ----
  const snips = [
    { vec: fakeVec("Käsekuchen mit Quark."), text: "Käsekuchen mit Quark." },
    { vec: fakeVec("Apfelkuchen mit Streuseln."), text: "Apfelkuchen mit Streuseln." },
  ];
  const spore = await SbkimSpore.generateOwnSpore(Object.assign({}, baseMeta, { snippetVectors: snips }));
  record("Spore trägt protocolVersion 0.2", "0.2", String(spore.protocolVersion),
    spore.protocolVersion === "0.2");
  record("snippetVectors im Umschlag", "2",
    String(Array.isArray(spore.snippetVectors) ? spore.snippetVectors.length : "fehlt"),
    Array.isArray(spore.snippetVectors) && spore.snippetVectors.length === 2);
  record("Schnipsel-vec ist plain number[]", "384/number",
    (spore.snippetVectors[0].vec.length) + "/" + typeof spore.snippetVectors[0].vec[0],
    spore.snippetVectors[0].vec.length === 384 && typeof spore.snippetVectors[0].vec[0] === "number");
  record("Schnipsel-text erhalten", "Käsekuchen mit Quark.",
    spore.snippetVectors[0].text, spore.snippetVectors[0].text === "Käsekuchen mit Quark.");

  const v1 = await SbkimSpore.verifyForeignSpore(spore);
  record("Spore mit snippetVectors verifiziert", "valid=true",
    JSON.stringify(v1), v1.valid === true);

  // ---- C) harte Kürzung auf 20 ----
  const many = [];
  for (let i = 0; i < 30; i++) many.push({ vec: fakeVec("Satz " + i), text: "Satz " + i });
  const cappedSpore = await SbkimSpore.regenerateOwnSpore({ snippetVectors: many });
  record("harte Kürzung auf 20 (kein Throw)", "20",
    String(cappedSpore.snippetVectors.length), cappedSpore.snippetVectors.length === 20);
  record("gekürzte Spore verifiziert", "valid=true",
    String((await SbkimSpore.verifyForeignSpore(cappedSpore)).valid), true === (await SbkimSpore.verifyForeignSpore(cappedSpore)).valid);

  // ---- D) Schema-Check: vec-Länge ≠ 384 → InvalidSporeMetaError ----
  let threw = null;
  try {
    await SbkimSpore.generateOwnSpore(Object.assign({}, baseMeta, {
      snippetVectors: [{ vec: [1, 2, 3], text: "zu kurz" }],
    }));
  } catch (e) { threw = e; }
  record("vec-Länge ≠ 384 → InvalidSporeMetaError", "InvalidSporeMetaError",
    threw ? threw.name : "kein Throw", threw !== null && threw.name === "InvalidSporeMetaError");

  // ---- E) sanfter Übergang: 0.1↔0.2 ----
  // Eine 0.1-Spore (protocolVersion überschrieben) muss weiter verifizieren.
  const spore01 = await SbkimSpore.generateOwnSpore(Object.assign({}, baseMeta, { protocolVersion: "0.1" }));
  record("erzeugte 0.1-Spore trägt 0.1", "0.1", String(spore01.protocolVersion),
    spore01.protocolVersion === "0.1");
  const v01 = await SbkimSpore.verifyForeignSpore(spore01);
  record("0.1-Spore von 0.2-Code verifiziert (major-tolerant)", "valid=true",
    JSON.stringify(v01), v01.valid === true);

  // Umgekehrt: 0.2-Spore ist bereits über B verifiziert. Zusätzlich: eine
  // Fantasie-0.9-Spore (gleiche Hauptversion 0) bleibt kompatibel.
  const spore09 = await SbkimSpore.generateOwnSpore(Object.assign({}, baseMeta, { protocolVersion: "0.9" }));
  const v09 = await SbkimSpore.verifyForeignSpore(spore09);
  record("0.9-Spore (Hauptversion 0) kompatibel", "valid=true",
    String(v09.valid), v09.valid === true);

  // Andere Hauptversion bricht (Kontrast — kein still-grün).
  const spore1x = await SbkimSpore.generateOwnSpore(Object.assign({}, baseMeta, { protocolVersion: "1.0" }));
  const v1x = await SbkimSpore.verifyForeignSpore(spore1x);
  record("1.0-Spore (andere Hauptversion) abgelehnt", "valid=false",
    String(v1x.valid), v1x.valid === false);

  // ---- F) Manipulation an einem Schnipsel bricht die Signatur ----
  const tampered = JSON.parse(JSON.stringify(spore));
  tampered.snippetVectors[0].vec[0] = tampered.snippetVectors[0].vec[0] + 0.5;
  const vt = await SbkimSpore.verifyForeignSpore(tampered);
  record("manipulierter Schnipsel bricht Signatur", "valid=false",
    String(vt.valid), vt.valid === false);

  // ---- G) ohne snippetVectors bleibt das Feld weg (0.1-kompatibel) ----
  const plain = await SbkimSpore.generateOwnSpore(baseMeta);
  record("ohne snippetVectors: Feld fehlt", "undefined",
    String(plain.snippetVectors), plain.snippetVectors === undefined);
  // leeres Array → ebenfalls kein Feld (kein leeres Array im Umschlag).
  const emptyArr = await SbkimSpore.generateOwnSpore(Object.assign({}, baseMeta, { snippetVectors: [] }));
  record("leeres snippetVectors[]: Feld fehlt", "undefined",
    String(emptyArr.snippetVectors), emptyArr.snippetVectors === undefined);

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
