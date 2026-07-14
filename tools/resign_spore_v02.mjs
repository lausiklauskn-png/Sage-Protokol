#!/usr/bin/env node
/*
 * SBKIM — Spore-Neu-Signierer v0.2 (Andock-Werkzeug, Re-Sign-Welle A6+A10)
 *
 * Signiert die EIGENE, bereits veröffentlichte Spore mit der BLEIBENDEN
 * Identität (privater Schlüssel aus dem Umgebungs-Secret SBKIM_NODE_KEY) neu
 * auf PROTOCOL_VERSION "0.2" — und hängt optional die A10-`snippetVectors` an.
 *
 * Zwei-Hälften-Arbeitsteilung (ehrlich, offline-fähig):
 *   - Der e5-Vektor (domainVector) + die Satz-Schnipsel (snippetVectors) werden
 *     im BROWSER gerechnet (Modul 03 embedContentVector/embedSnippets — das
 *     Modell läuft dort). tools/embed_helper.html exportiert beides als JSON.
 *   - Dieses Skript macht die KRYPTO: es übernimmt den echten domainVector aus
 *     der bestehenden spore.json (A6 bleibt echt), bumpt protocolVersion → 0.2,
 *     hängt die (browser-gerechneten) snippetVectors an und signiert kanonisch
 *     mit dem stabilen ENV-Schlüssel. Danach VERIFIZIERT es die Ausgabe mit dem
 *     ECHTEN Modul-02-Verifizierer (kein Zweitcode) → ✔ VALID.
 *
 * Der private Schlüssel verlässt das Gerät nie: nur die öffentliche spore.json
 * wird geschrieben/committet. Ohne SBKIM_NODE_KEY tut das Skript nichts.
 *
 * Aufruf:
 *   SBKIM_NODE_KEY='<jwk-json | base64/hex 32-byte seed>' \
 *     node tools/resign_spore_v02.mjs [--in sbkim/spore.json] \
 *       [--snippets <browser-export.json>] [--out sbkim/spore.json]
 *
 *   # Nur v0.2-Bump ohne Schnipsel (A6-Schließung, domainVector bleibt echt):
 *   SBKIM_NODE_KEY='…' node tools/resign_spore_v02.mjs
 *
 * SBKIM_NODE_KEY-Format (eines von):
 *   - JWK-JSON eines Ed25519-Privatschlüssels ({kty:"OKP",crv:"Ed25519",d,x,…})
 *     — genau, was der Browser via crypto.subtle.exportKey("jwk", privKey) gibt.
 *   - 32-Byte-Seed als hex ODER base64/base64url (wird in PKCS8 verpackt).
 *
 * snippets-Datei: JSON-Array [{vec:number[384], text?:string}] — die Ausgabe
 * von SbkimEmbedding.embedSnippets(...) aus dem Browser (embed_helper.html).
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, isAbsolute } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const subtle = globalThis.crypto.subtle;

const SPORE_SNIPPET_MAX = 20;
const SPORE_SNIPPET_VEC_DIM = 384;
const PROTOCOL_VERSION = "0.2";

// ---- base64url + canonicalize (deckungsgleich zu Modul 02) ----
function base64urlEncode(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < view.length; i++) bin += String.fromCharCode(view[i]);
  return Buffer.from(bin, "binary").toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function canonicalize(value) {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    const out = {};
    for (const k of keys) out[k] = canonicalize(value[k]);
    return out;
  }
  return value;
}
function canonicalJsonBytes(obj) {
  return new TextEncoder().encode(JSON.stringify(canonicalize(obj)));
}
async function sha256(bytes) {
  return new Uint8Array(await subtle.digest("SHA-256", bytes));
}

// ---- ENV-Schlüssel importieren (JWK-JSON ODER 32-Byte-Seed hex/base64) ----
function seedToPkcs8(seed32) {
  // Fixer DER-Vorspann für einen Ed25519-PKCS8-Privatschlüssel + 32-Byte-Seed.
  const prefix = Uint8Array.from([
    0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70,
    0x04, 0x22, 0x04, 0x20,
  ]);
  const out = new Uint8Array(prefix.length + 32);
  out.set(prefix, 0);
  out.set(seed32, prefix.length);
  return out;
}
function decodeMaybe(str) {
  const t = str.trim();
  if (/^[0-9a-fA-F]{64}$/.test(t)) return Uint8Array.from(Buffer.from(t, "hex"));
  const b = Buffer.from(t.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  if (b.length === 32) return new Uint8Array(b);
  return null;
}
async function importPrivateKey(raw) {
  const t = raw.trim();
  if (t.startsWith("{")) {
    const jwk = JSON.parse(t);
    if (!jwk.d) throw new Error("JWK ohne 'd' (kein privater Schlüssel).");
    const priv = await subtle.importKey("jwk", jwk, { name: "Ed25519" }, true, ["sign"]);
    return priv;
  }
  const seed = decodeMaybe(t);
  if (!seed) throw new Error("SBKIM_NODE_KEY: weder JWK noch 32-Byte-Seed (hex/base64).");
  return subtle.importKey("pkcs8", seedToPkcs8(seed), { name: "Ed25519" }, true, ["sign"]);
}
async function publicJwkFromPrivate(priv) {
  // Ed25519: privaten JWK exportieren, 'd' entfernen → öffentlicher JWK in der
  // Feld-Form, die Modul 02 publiziert (kty/crv/x/key_ops/ext/alg).
  const jwk = await subtle.exportKey("jwk", priv);
  const pub = { kty: jwk.kty, crv: jwk.crv, x: jwk.x, key_ops: ["verify"], ext: true, alg: "Ed25519" };
  return pub;
}
async function nodeIdFromPublicJwk(pubJwk) {
  const pub = await subtle.importKey("jwk", pubJwk, { name: "Ed25519" }, true, ["verify"]);
  const raw = new Uint8Array(await subtle.exportKey("raw", pub));
  return base64urlEncode(await sha256(raw));
}

// ---- snippetVectors bereinigen (spiegelt Modul 02 sanitizeSnippetVectors) ----
function sanitizeSnippetVectors(list) {
  const out = [];
  for (let i = 0; i < list.length && out.length < SPORE_SNIPPET_MAX; i++) {
    const e = list[i];
    if (!e || typeof e !== "object") throw new Error("snippetVectors[" + i + "] ist kein Objekt.");
    let arr = Array.isArray(e.vec) ? e.vec
      : (e.vec && typeof e.vec.length === "number") ? Array.prototype.slice.call(e.vec) : null;
    if (!arr || arr.length !== SPORE_SNIPPET_VEC_DIM) {
      throw new Error("snippetVectors[" + i + "].vec muss Länge " + SPORE_SNIPPET_VEC_DIM + " haben.");
    }
    const entry = { vec: arr.map(Number) };
    if (typeof e.text === "string" && e.text.length > 0) entry.text = e.text;
    out.push(entry);
  }
  return out;
}

function arg(name, def) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
function resolveIn(p) { return isAbsolute(p) ? p : resolve(repoRoot, p); }

// Der echte Modul-02-Verifizierer, headless — kein Zweitcode, keine Drift.
async function loadRealVerifier() {
  const { webcrypto } = await import("node:crypto");
  await import("fake-indexeddb/auto");
  globalThis.window = globalThis;
  if (!globalThis.crypto || !globalThis.crypto.subtle) {
    Object.defineProperty(globalThis, "crypto", { value: webcrypto, writable: false, configurable: true });
  }
  const load = async (rel) => {
    const src = await readFile(resolve(repoRoot, rel), "utf8");
    new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob",
      "TextEncoder", "TextDecoder", "indexedDB", src)(
      globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB);
  };
  await load("src/modules/01_storage.js");
  await load("src/modules/02_spore.js");
  return globalThis.SbkimSpore;
}

async function main() {
  const envKey = process.env.SBKIM_NODE_KEY;
  if (!envKey) {
    console.error("FEHLER: SBKIM_NODE_KEY nicht gesetzt. Ohne stabilen Schlüssel keine bleibende Identität.");
    console.error("  SBKIM_NODE_KEY='<jwk|seed>' node tools/resign_spore_v02.mjs");
    process.exit(2);
  }
  const inPath = resolveIn(arg("--in", "sbkim/spore.json"));
  const outPath = resolveIn(arg("--out", arg("--in", "sbkim/spore.json")));
  const snippetsPath = arg("--snippets", null);

  const base = JSON.parse(await readFile(inPath, "utf8"));

  const priv = await importPrivateKey(envKey);
  const pubJwk = await publicJwkFromPrivate(priv);
  const nodeId = await nodeIdFromPublicJwk(pubJwk);
  if (base.id && base.id !== nodeId) {
    console.error("FEHLER: SBKIM_NODE_KEY gehört NICHT zur Identität dieser Spore.");
    console.error("  spore.id: " + base.id);
    console.error("  Schlüssel-nodeId: " + nodeId);
    console.error("  (Neu-Signieren mit fremdem Schlüssel würde die Identität wechseln — abgebrochen.)");
    process.exit(3);
  }

  // Unsigned = alle bestehenden Felder (echter domainVector bleibt!) außer
  // signature, mit protocolVersion → 0.2 und öffentlichem Schlüssel aus dem
  // ENV-Key. snippetVectors additiv (browser-gerechnet).
  const unsigned = {};
  for (const k of Object.keys(base)) {
    if (k === "signature") continue;
    unsigned[k] = base[k];
  }
  unsigned.id = nodeId;
  unsigned.publicKey = pubJwk;
  unsigned.protocolVersion = PROTOCOL_VERSION;

  if (snippetsPath) {
    const raw = JSON.parse(await readFile(resolveIn(snippetsPath), "utf8"));
    const list = Array.isArray(raw) ? raw : (Array.isArray(raw.snippetVectors) ? raw.snippetVectors : null);
    if (!list) throw new Error("snippets-Datei: erwartet Array [{vec,text?}] oder {snippetVectors:[…]}.");
    const sv = sanitizeSnippetVectors(list);
    if (sv.length > 0) unsigned.snippetVectors = sv;
  } else if (Array.isArray(base.snippetVectors)) {
    // Beim reinen Bump vorhandene Schnipsel erhalten.
    const sv = sanitizeSnippetVectors(base.snippetVectors);
    if (sv.length > 0) unsigned.snippetVectors = sv;
  }

  const sigBuf = await subtle.sign({ name: "Ed25519" }, priv, canonicalJsonBytes(unsigned));
  const spore = canonicalize(unsigned);
  spore.signature = base64urlEncode(sigBuf);

  // Beweis: der ECHTE Verifizierer akzeptiert die Ausgabe.
  const SbkimSpore = await loadRealVerifier();
  const verdict = await SbkimSpore.verifyForeignSpore(spore);
  if (!verdict.valid) {
    console.error("FEHLER: Ausgabe vom echten Verifizierer ABGELEHNT: " + verdict.reason);
    process.exit(1);
  }

  await writeFile(outPath, JSON.stringify(spore, null, 2) + "\n", "utf8");
  console.log("✔ VALID — neu signierte Spore v0.2 geschrieben:", outPath);
  console.log("  nodeId:            ", nodeId);
  console.log("  protocolVersion:   ", spore.protocolVersion);
  console.log("  domainVector:      ", Array.isArray(spore.domainVector) ? spore.domainVector.length + " floats (echt, übernommen)" : "—");
  console.log("  snippetVectors:    ", Array.isArray(spore.snippetVectors) ? spore.snippetVectors.length + " Satz-Schnipsel" : "0 (kein Schnipsel-Signal)");
  console.log("  (nur die ÖFFENTLICHE spore.json committen — privater Schlüssel bleibt im ENV.)");
}

main().catch((err) => {
  console.error("FEHLER:", err && err.stack ? err.stack : err);
  process.exit(1);
});
