#!/usr/bin/env node
/*
 * SBKIM — Remote-Spore-Verifizierer (Andock-Werkzeug)
 *
 * Zweck: die ECHTE Produktiv-Verifikation aus Modul 02
 * (window.SbkimSpore.verifyForeignSpore) headless gegen eine
 * fremde, übers Netz veröffentlichte spore.json laufen lassen —
 * ohne Browser, ohne Storage, ohne Code-Drift. Lädt
 * src/modules/02_spore.js direkt (der IIFE hängt sich an globalThis,
 * verifyForeignSpore braucht nur WebCrypto, keinen IndexedDB).
 *
 * So wird aus „wir KÖNNEN eure Signatur prüfen" ein Ein-Befehl-Beweis,
 * sobald die Gegenseite ihre spore.json live stellt. Empfangsmodus-
 * konform: EINE bewusste Eigenanfrage auf eine genannte URL, kein
 * Crawler, kein Dauerlauf.
 *
 * Aufruf:
 *   node tools/verify_remote_spore.mjs <url-oder-pfad>
 *   node tools/verify_remote_spore.mjs            # Selbsttest: eigene Spore
 *
 * Beispiele:
 *   node tools/verify_remote_spore.mjs https://lausiklauskn-png.github.io/SB-KIMTool-Point/sbkim/spore.json
 *   node tools/verify_remote_spore.mjs sbkim/spore.json
 *
 * Exit-Code: 0 = valid, 1 = invalid/Fehler.
 */

import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, isAbsolute } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// Modul 02 ist ein Browser-IIFE ohne module.exports; require() führt es
// aus und es hängt SbkimSpore an globalThis (siehe Datei-Ende).
const require = createRequire(import.meta.url);
require(resolve(repoRoot, "src/modules/02_spore.js"));
const SbkimSpore = globalThis.SbkimSpore;

if (!SbkimSpore || typeof SbkimSpore.verifyForeignSpore !== "function") {
  console.error("FEHLER: SbkimSpore.verifyForeignSpore nicht geladen.");
  process.exit(1);
}

const REQUIRED = [
  "createdAt", "domain", "embeddingModel", "endpoint", "id",
  "nodeType", "protocolVersion", "publicKey", "signature",
];

async function loadSource(arg) {
  if (/^https?:\/\//i.test(arg)) {
    const res = await fetch(arg, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status} beim Abruf von ${arg}`);
    return { kind: "url", where: arg, json: await res.json() };
  }
  const path = isAbsolute(arg) ? arg : resolve(repoRoot, arg);
  const text = await readFile(path, "utf8");
  return { kind: "file", where: path, json: JSON.parse(text) };
}

function reportFields(spore) {
  const present = REQUIRED.filter((f) => spore[f] !== undefined && spore[f] !== null);
  const missing = REQUIRED.filter((f) => spore[f] === undefined || spore[f] === null);
  console.log("  Pflichtfelder vorhanden:", present.length + "/" + REQUIRED.length);
  if (missing.length) console.log("  FEHLENDE Pflichtfelder:", missing.join(", "));
  if (Array.isArray(spore.domainVector)) {
    console.log("  domainVector: " + spore.domainVector.length + " Floats" +
      (Array.isArray(spore._demo) && spore._demo.includes("domainVector") ? " (als _demo markiert)" : ""));
  }
}

async function main() {
  const arg = process.argv[2] || "sbkim/spore.json";
  const selfTest = !process.argv[2];
  console.log("SBKIM Remote-Spore-Verifizierer (Produktiv-Modul-02-Pfad)");
  console.log("Quelle:", arg, selfTest ? "(Selbsttest — eigene Spore)" : "");
  console.log("");

  let src;
  try {
    src = await loadSource(arg);
  } catch (err) {
    console.error("ABRUF FEHLGESCHLAGEN:", err.message);
    console.error("(Noch nicht live? Empfangsmodus: keine Wiederholung, kein Crawler.)");
    process.exit(1);
  }

  const spore = src.json;
  console.log("Gelesen aus", src.kind + ":", src.where);
  console.log("  nodeName:", spore.nodeName ?? "(keiner)", "| nodeType:", spore.nodeType,
    "| domain:", spore.domain ?? "(keine)");
  console.log("  id:", spore.id);
  reportFields(spore);
  console.log("");

  const result = await SbkimSpore.verifyForeignSpore(spore);
  if (result.valid) {
    console.log("ERGEBNIS: ✔ VALID — Signatur + nodeId verifiziert gegen den eigenen publicKey.");
    process.exit(0);
  } else {
    console.log("ERGEBNIS: ✗ INVALID — " + result.reason);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("UNERWARTETER FEHLER:", err && err.stack ? err.stack : err);
  process.exit(1);
});
