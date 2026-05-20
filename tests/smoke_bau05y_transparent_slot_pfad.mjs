// Headless smoke test for Bau 05.Y — transparenter Slot-Pfad in
// Modul 05 (Anastomose). Run with `node tests/smoke_bau05y_transparent_slot_pfad.mjs`
// after `npm install --no-save fake-indexeddb` (provides IndexedDB
// shim). WebCrypto comes from node:crypto. NOT a unit-test framework;
// this is the bau-sitzung-smoke-probe analog Bau 02.Y / Bau 08.Y,
// prints a table and exits non-zero on any failure.
//
// Four Proben aus dem Brief BAU_05Y:
//   1) Default-Slot „main" — init, receiverMap baut sich auf,
//      activeSlotKey gecached, slot-suffixed Stores in den Storage-
//      bekannten Stores.
//   2) Sekundär-Slot „beruflich" via Re-Load — receiverMap kennt nach
//      Re-Init beide Slots; Sender-Pfad würde in sbkim_siblings_beruflich
//      schreiben.
//   3) Empfänger-Pfad mit toNodeId der main-Persona; Sibling landet in
//      sbkim_siblings_main auch wenn active-identity = „beruflich" ist.
//   4) Empfänger-Pfad mit unbekanntem toNodeId → outcome: rejected,
//      reason enthält „toNodeId".

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
                "TextEncoder", "TextDecoder", "indexedDB", "fetch", "AbortController", "BroadcastChannel",
                "navigator", src
    )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB,
      globalThis.fetch, globalThis.AbortController,
      typeof globalThis.BroadcastChannel === "function" ? globalThis.BroadcastChannel : undefined,
      typeof globalThis.navigator !== "undefined" ? globalThis.navigator : undefined);
}

// Reload Modul 05 fresh — used by Probe 2 to re-init the module with a
// new active slot (simulates the Tab-Reload Klaus uses in the browser).
function reloadModul05() {
  delete globalThis.SbkimAnastomose;
  loadModule("src/modules/05_anastomose.js");
}

loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");
loadModule("src/modules/04_match.js");
loadModule("src/modules/05_anastomose.js");

const SbkimStorage = globalThis.SbkimStorage;
const SbkimSpore = globalThis.SbkimSpore;
const SbkimMatch = globalThis.SbkimMatch;

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

// Builds an in-memory pseudo-sender (fresh Ed25519 keypair + spore
// signed with that key + a domain vector). The pseudo-sender mimics a
// foreign peer that wants to anastomose with us.
async function bakeSender(domain, domainVec) {
  const SbkimAnastomose = globalThis.SbkimAnastomose;
  const subtle = webcrypto.subtle;
  const keyPair = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const publicKeyJwk = await subtle.exportKey("jwk", keyPair.publicKey);
  const rawPub = await subtle.exportKey("raw", keyPair.publicKey);
  const hash = await subtle.digest("SHA-256", rawPub);
  const nodeId = SbkimAnastomose._base64urlEncode(new Uint8Array(hash));
  const sporeMeta = {
    createdAt: new Date().toISOString(),
    domain: domain,
    domainVector: Array.from(domainVec),
    embeddingModel: "Xenova/multilingual-e5-small",
    endpoint: "https://" + domain + "/",
    id: nodeId,
    nodeType: "hybrid",
    protocolVersion: "0.1",
    publicKey: publicKeyJwk,
  };
  const sig = await SbkimAnastomose._signEnvelope(sporeMeta, keyPair.privateKey);
  const signed = SbkimAnastomose._canonicalize(Object.assign({}, sporeMeta, { signature: sig }));
  return { privateKey: keyPair.privateKey, spore: signed, nodeId: nodeId };
}

// L2-normalize a Float32Array in-place (Modul 04's match() assumes
// normalized inputs — it just sums element-wise products = dot product).
function l2normalize(vec) {
  let s = 0;
  for (let i = 0; i < vec.length; i++) s += vec[i] * vec[i];
  const inv = 1 / Math.sqrt(s);
  for (let i = 0; i < vec.length; i++) vec[i] *= inv;
  return vec;
}

async function run() {
  let SbkimAnastomose = globalThis.SbkimAnastomose;

  // 0) Modul-Exports + Selbstcheck-Zeile
  const fns = ["init", "handshake", "receiveHandshake", "listSiblings", "forgetSibling"];
  const missing = fns.filter(f => typeof SbkimAnastomose[f] !== "function");
  record("Exports — fünf Funktionen vorhanden",
         "alle fünf",
         missing.length === 0 ? "alle fünf" : "fehlend: " + missing.join(","),
         missing.length === 0);
  record("_meta.siblingsStoreBase",
         "sbkim_siblings",
         SbkimAnastomose._meta.siblingsStoreBase,
         SbkimAnastomose._meta.siblingsStoreBase === "sbkim_siblings");
  record("_meta.logStoreBase",
         "sbkim_anastomosis_log",
         SbkimAnastomose._meta.logStoreBase,
         SbkimAnastomose._meta.logStoreBase === "sbkim_anastomosis_log");
  record("_meta.activeSlotKey (vor init)",
         "null",
         String(SbkimAnastomose._meta.activeSlotKey),
         SbkimAnastomose._meta.activeSlotKey === null);

  // === Probe 1: Default-Slot „main" ===
  await SbkimAnastomose.init();
  record("Probe 1 — init() resolves", "void", "void", true);
  record("Probe 1 — activeSlotKey nach init",
         "main",
         String(SbkimAnastomose._meta.activeSlotKey),
         SbkimAnastomose._meta.activeSlotKey === "main");
  record("Probe 1 — receiverMapSize nach init",
         "1 (nur main)",
         String(SbkimAnastomose._meta.receiverMapSize),
         SbkimAnastomose._meta.receiverMapSize === 1);

  // sbkim_siblings_main + sbkim_anastomosis_log_main müssen jetzt
  // existieren (ensureSlotStores aus init).
  const knownStoresP1 = SbkimStorage._meta.knownStores;
  record("Probe 1 — sbkim_siblings_main in knownStores",
         "true",
         knownStoresP1.includes("sbkim_siblings_main") ? "true" : "false",
         knownStoresP1.includes("sbkim_siblings_main"));
  record("Probe 1 — sbkim_anastomosis_log_main in knownStores",
         "true",
         knownStoresP1.includes("sbkim_anastomosis_log_main") ? "true" : "false",
         knownStoresP1.includes("sbkim_anastomosis_log_main"));

  // Sender baut Spore mit domainVector — main-Spore braucht das, damit
  // der Empfänger einen ownVec hat. Modul 04 erwartet L2-normalisiert.
  const mainVec = new Float32Array(384);
  for (let i = 0; i < 384; i++) mainVec[i] = Math.sin(i * 0.1) * 0.05;
  l2normalize(mainVec);
  await SbkimSpore.generateOwnSpore({
    domain: "main.example.org",
    nodeType: "hybrid",
    endpoint: "https://main.example.org/",
    domainVector: Array.from(mainVec),
  });
  const mainNodeId = await SbkimSpore.getNodeId();

  // Pseudo-Peer „alt" macht handshake → main. Vektor stark mit
  // mainVec überlappend (cosine > 0.95).
  const altVec = new Float32Array(384);
  for (let i = 0; i < 384; i++) altVec[i] = Math.sin(i * 0.1) * 0.05 + Math.cos(i * 0.05) * 0.001;
  l2normalize(altVec);
  const alt = await bakeSender("alt.example.org", altVec);

  // Request signiert von alt, an main gerichtet.
  const reqP1 = await SbkimAnastomose._buildSignedRequest(
    alt.privateKey, alt.spore, altVec, mainNodeId,
  );
  const respP1 = await SbkimAnastomose._invokeDirect(reqP1);
  record("Probe 1 — receiveHandshake outcome=established",
         "established",
         respP1.outcome,
         respP1.outcome === "established");

  // Sibling-Eintrag muss in sbkim_siblings_main sein, NICHT in
  // sbkim_siblings (legacy, non-suffixed).
  const sibP1Main = await SbkimStorage.get("sbkim_siblings_main", alt.nodeId);
  record("Probe 1 — Sibling-Eintrag in sbkim_siblings_main",
         "vorhanden",
         sibP1Main ? "vorhanden" : "fehlt",
         sibP1Main && sibP1Main.nodeId === alt.nodeId);

  // Der legacy-Store sbkim_siblings (ohne Suffix) existiert weiterhin
  // als v=1-Pflicht-Store aus Modul 01 — aber Modul 05 darf nach
  // Bau 05.Y NICHT mehr dort hineinschreiben. Sicher: lookup nach
  // alt.nodeId muss `undefined` zurückgeben (kein Eintrag).
  const legacyMiss = await SbkimStorage.get("sbkim_siblings", alt.nodeId);
  record("Probe 1 — Modul 05 schreibt NICHT mehr in non-suffixed sbkim_siblings",
         "undefined",
         legacyMiss === undefined ? "undefined" : "fälschlich da",
         legacyMiss === undefined);

  // listSiblings() — liest den slot-suffixed Store.
  const siblingsP1 = await SbkimAnastomose.listSiblings();
  record("Probe 1 — listSiblings nach Handshake",
         "1 Eintrag (alt)",
         String(siblingsP1.length),
         siblingsP1.length === 1 && siblingsP1[0].nodeId === alt.nodeId);

  // Log-Eintrag muss in sbkim_anastomosis_log_main sein.
  const logRowsP1 = await SbkimStorage.all("sbkim_anastomosis_log_main");
  record("Probe 1 — Log-Eintrag in sbkim_anastomosis_log_main",
         "≥1 Eintrag",
         String(logRowsP1.length),
         logRowsP1.length >= 1);

  // === Probe 2: Sekundär-Slot „beruflich" ===
  await SbkimSpore.getOrCreateIdentity("beruflich");
  await SbkimSpore.setActiveIdentity("beruflich");
  const beruflichNodeId = await SbkimSpore.getNodeId();
  record("Probe 2 — setActiveIdentity('beruflich') gesetzt",
         "beruflich nodeId ≠ main nodeId",
         beruflichNodeId === mainNodeId ? "gleich!" : "verschieden",
         beruflichNodeId !== mainNodeId);

  // Re-init Modul 05 (simuliert Tab-Reload).
  reloadModul05();
  SbkimAnastomose = globalThis.SbkimAnastomose;
  await SbkimAnastomose.init();
  record("Probe 2 — activeSlotKey nach Re-Init",
         "beruflich",
         String(SbkimAnastomose._meta.activeSlotKey),
         SbkimAnastomose._meta.activeSlotKey === "beruflich");
  record("Probe 2 — receiverMapSize nach Re-Init",
         "2 (main + beruflich)",
         String(SbkimAnastomose._meta.receiverMapSize),
         SbkimAnastomose._meta.receiverMapSize === 2);

  // Beruflich-Spore mit domainVector erzeugen.
  const beruflichVec = new Float32Array(384);
  for (let i = 0; i < 384; i++) beruflichVec[i] = Math.cos(i * 0.07) * 0.05;
  l2normalize(beruflichVec);
  await SbkimSpore.generateOwnSpore({
    domain: "beruflich.example.org",
    nodeType: "hybrid",
    endpoint: "https://beruflich.example.org/",
    domainVector: Array.from(beruflichVec),
  }, "beruflich");

  // === Probe 3: Receiver-Pfad nutzt die getroffene Persona ===
  // active-identity = „beruflich". Pseudo-Sender schickt aber mit
  // toNodeId = main-NodeId → main-Slot muss als Persona dienen, NICHT
  // beruflich.
  const alt2Vec = new Float32Array(384);
  for (let i = 0; i < 384; i++) alt2Vec[i] = Math.sin(i * 0.1) * 0.05 + 0.002;
  l2normalize(alt2Vec);
  const alt2 = await bakeSender("alt2.example.org", alt2Vec);
  const reqP3 = await SbkimAnastomose._buildSignedRequest(
    alt2.privateKey, alt2.spore, alt2Vec, mainNodeId,
  );
  const respP3 = await SbkimAnastomose._invokeDirect(reqP3);
  record("Probe 3 — Receiver mit toNodeId=main outcome=established",
         "established",
         respP3.outcome,
         respP3.outcome === "established");

  // Wichtig: receiverSpore muss die main-Spore sein (nicht beruflich),
  // weil die getroffene Persona signiert.
  record("Probe 3 — receiverSpore.id = main-NodeId (getroffene Persona)",
         "main-NodeId",
         respP3.receiverSpore.id === mainNodeId ? "main" :
         respP3.receiverSpore.id === beruflichNodeId ? "beruflich!" : "?",
         respP3.receiverSpore.id === mainNodeId);

  // Sibling-Eintrag muss in sbkim_siblings_main sein.
  const sibP3Main = await SbkimStorage.get("sbkim_siblings_main", alt2.nodeId);
  record("Probe 3 — Sibling-Eintrag in sbkim_siblings_main (main-Slot)",
         "vorhanden",
         sibP3Main ? "vorhanden" : "fehlt",
         sibP3Main && sibP3Main.nodeId === alt2.nodeId);

  // NICHT in sbkim_siblings_beruflich.
  const sibP3Beruflich = await SbkimStorage.get("sbkim_siblings_beruflich", alt2.nodeId);
  record("Probe 3 — Sibling NICHT in sbkim_siblings_beruflich",
         "undefined",
         sibP3Beruflich === undefined ? "undefined" : "fälschlich da",
         sibP3Beruflich === undefined);

  // active-identity (global) muss weiterhin „beruflich" sein —
  // receiveHandshake darf NICHT setActiveIdentity rufen.
  const activeNachP3 = await SbkimSpore.getActiveIdentityKey();
  record("Probe 3 — active-identity (global) unverändert",
         "beruflich",
         activeNachP3,
         activeNachP3 === "beruflich");

  // === Probe 4: Unbekanntes toNodeId → rejected ===
  const unbekanntNodeId = "UNBEKANNT-XYZ-1234567890123456789012345678901";
  const alt3Vec = new Float32Array(384);
  for (let i = 0; i < 384; i++) alt3Vec[i] = Math.sin(i * 0.1) * 0.05;
  l2normalize(alt3Vec);
  const alt3 = await bakeSender("alt3.example.org", alt3Vec);
  const reqP4 = await SbkimAnastomose._buildSignedRequest(
    alt3.privateKey, alt3.spore, alt3Vec, unbekanntNodeId,
  );
  const respP4 = await SbkimAnastomose._invokeDirect(reqP4);
  record("Probe 4 — Receiver mit unbekanntem toNodeId outcome=rejected",
         "rejected",
         respP4.outcome,
         respP4.outcome === "rejected");
  record("Probe 4 — reason enthält 'toNodeId'",
         "ja",
         respP4.reason && respP4.reason.includes("toNodeId") ? "ja" : "nein",
         respP4.reason && respP4.reason.includes("toNodeId"));

  // Sibling für alt3 darf in KEINEM slot-suffixed Store gelandet sein.
  const sibP4Main = await SbkimStorage.get("sbkim_siblings_main", alt3.nodeId);
  const sibP4Beruflich = await SbkimStorage.get("sbkim_siblings_beruflich", alt3.nodeId);
  record("Probe 4 — KEIN Sibling-Eintrag (Map-Miss = kein Storage-Eingriff)",
         "beide undefined",
         "main=" + (sibP4Main === undefined ? "und" : "DA") +
         ", beruflich=" + (sibP4Beruflich === undefined ? "und" : "DA"),
         sibP4Main === undefined && sibP4Beruflich === undefined);

  // Print results table.
  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) pass++; else fail++;
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} ${r.probe}`);
    if (!r.ok) console.log(`   erwartet: ${r.expected}`);
    if (!r.ok) console.log(`   erhalten: ${r.actual}`);
  }
  console.log("");
  console.log(`Summe: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt`);
  if (fail > 0) process.exit(1);
}

run().catch(err => {
  console.error("Smoke-Test gescheitert:", err);
  process.exit(1);
});
