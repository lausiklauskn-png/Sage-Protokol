#!/usr/bin/env node
/*
 * SBKIM — Referenz-Spore-Generator (Andock-Werkzeug, Demo)
 *
 * Erzeugt eine VOLLSTÄNDIG gültige, kanonisch signierte Beispiel-Spore
 * in genau der Feld-Form, die SB·KIMTool·Point in docs/ANDOCK.md §2
 * anstrebt — ERGÄNZT um die zwei Pflichtfelder, die unser Verifizierer
 * zusätzlich verlangt (createdAt, embeddingModel). Der domainVector ist
 * ein ehrlich als _demo markierter Stub.
 *
 * Zweck: SB·KIMTool bekommt ein konkretes, nachprüfbares Ziel. Wer die
 * Ausgabe durch tools/verify_remote_spore.mjs schickt, sieht ✔ VALID —
 * das beweist, dass die kanonische Signier-Form + die Pflichtfeld-Liste
 * zusammen aufgehen.
 *
 * WICHTIG — ehrliche Grenze:
 *   - Der Schlüssel hier ist FLÜCHTIG (pro Lauf neu). Das ist KEINE
 *     bleibende Identität. SB·KIMTool hinterlegt seinen eigenen Schlüssel
 *     als Umgebungs-Secret SBKIM_NODE_KEY (siehe ANDOCK.md §3) — nur dann
 *     bleibt die nodeId über Sitzungen gleich.
 *   - Der domainVector ist Demo (deterministischer Stub), kein echtes
 *     Embedding. Echter Match-Score ≥ 0.80 folgt erst mit echtem Vektor.
 *
 * Aufruf:
 *   node tools/make_example_spore.mjs [ausgabe-pfad]
 *   (Default: sbkim/example_sbkimtool_spore.json)
 *
 * Die kanonische Form spiegelt Modul 02 (canonicalize: rekursiver
 * lexikografischer Schlüssel-Sort, JSON.stringify ohne Whitespace,
 * Feld "signature" beim Signieren ausgenommen). Korrektheits-Beweis ist
 * nicht dieser Code, sondern dass der ECHTE Verifizierer die Ausgabe
 * akzeptiert.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, isAbsolute } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const subtle = globalThis.crypto.subtle;

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

// Deterministischer Demo-Vektor: 384 Floats aus einem Seed, L2-normalisiert.
// KEIN echtes Embedding — nur korrekte Form. Mirrors ANDOCK.md §5.
function demoVector(seedStr) {
  let s = 0;
  for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
  const v = new Array(384);
  for (let i = 0; i < 384; i++) {
    s = (1103515245 * s + 12345) >>> 0;
    v[i] = (s / 0xffffffff) * 2 - 1;
  }
  let norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

async function main() {
  const out = process.argv[2] || "sbkim/example_sbkimtool_spore.json";
  const outPath = isAbsolute(out) ? out : resolve(repoRoot, out);

  const kp = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const publicKey = await subtle.exportKey("jwk", kp.publicKey);
  // JWK so wie Sage es publiziert: kty/crv/x/key_ops/ext/alg.
  publicKey.key_ops = ["verify"];
  publicKey.ext = true;
  publicKey.alg = "Ed25519";
  delete publicKey.d;

  const rawPub = new Uint8Array(await subtle.exportKey("raw", kp.publicKey));
  const id = base64urlEncode(await sha256(rawPub));

  // Unsigned spore — SB·KIMTools Zielfelder (ANDOCK §2) + die zwei von
  // Sages Verifizierer zusätzlich verlangten Pflichtfelder.
  const unsigned = {
    createdAt: new Date().toISOString(),          // <- von Sage verlangt
    domain: "SBKIM-Werkzeuge",
    domainDescription: "Werkzeug-Knoten am SBKIM-Mycel (Beispiel-Spore, Demo-Identität).",
    domainKeywords: ["SBKIM-Tools", "Andock-Werkzeug", "Observatorium-light"],
    domainVector: demoVector("SB-KIMTool-Point"),
    embeddingModel: "Xenova/multilingual-e5-small", // <- von Sage verlangt
    endpoint: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",
    id: id,
    nodeName: "SB-KIMTool-Point",
    nodeType: "hybrid",
    protocolVersion: "0.1",
    publicKey: publicKey,
    _demo: ["domainVector"],                        // ehrliche Demo-Markierung
  };

  const sigBuf = await subtle.sign({ name: "Ed25519" }, kp.privateKey, canonicalJsonBytes(unsigned));
  const spore = canonicalize(unsigned);
  spore.signature = base64urlEncode(sigBuf);

  await writeFile(outPath, JSON.stringify(spore, null, 2) + "\n", "utf8");
  console.log("Beispiel-Spore geschrieben:", outPath);
  console.log("  id:", id);
  console.log("  (FLÜCHTIGER Schlüssel — nur Demo, keine bleibende Identität)");
  console.log("");
  console.log("Jetzt prüfen mit:");
  console.log("  node tools/verify_remote_spore.mjs " + out);
}

main().catch((err) => {
  console.error("FEHLER:", err && err.stack ? err.stack : err);
  process.exit(1);
});
