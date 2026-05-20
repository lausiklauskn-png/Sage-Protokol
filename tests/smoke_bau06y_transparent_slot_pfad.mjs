// Headless smoke test for Bau 06.Y — transparenter Slot-Pfad in
// Modul 06 (Heterokaryose). Run with
// `node tests/smoke_bau06y_transparent_slot_pfad.mjs` after
// `npm install --no-save fake-indexeddb` (provides IndexedDB shim).
// WebCrypto from node:crypto. Prints a table and exits non-zero on
// any failure.
//
// Vier Proben aus dem Brief BAU_06Y:
//   1) Default-Slot „main" — receiveHeterokaryosis schreibt in
//      sbkim_hetero_inbox_main (slot-suffixed) statt sbkim_hetero_inbox.
//   2) Sekundär-Slot „beruflich" via Re-Load — receiverMap baut auf.
//   3) Empfänger-Pfad mit toNodeId der main-Persona; Inbox-Eintrag
//      landet in sbkim_hetero_inbox_main auch wenn active = beruflich.
//   4) Unbekanntes toNodeId → outcome: rejected, reason enthält
//      „toNodeId".

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
                "TextEncoder", "TextDecoder", "indexedDB", "fetch", "AbortController",
                "BroadcastChannel", "navigator", src
    )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB,
      globalThis.fetch, globalThis.AbortController,
      typeof globalThis.BroadcastChannel === "function" ? globalThis.BroadcastChannel : undefined,
      typeof globalThis.navigator !== "undefined" ? globalThis.navigator : undefined);
}

// Reload Modul 06 fresh — used by Probe 2 to re-init the module with
// a new active slot (simulates the Tab-Reload Klaus uses in the browser).
function reloadModul06() {
  delete globalThis.SbkimHeterokaryose;
  loadModule("src/modules/06_heterokaryose.js");
}

loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");
loadModule("src/modules/06_heterokaryose.js");

const SbkimStorage = globalThis.SbkimStorage;
const SbkimSpore = globalThis.SbkimSpore;

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

// Builds an in-memory pseudo-sender. Returns {privateKey, spore, nodeId}.
async function bakeSender(domain, domainVec) {
  const SbkimHeterokaryose = globalThis.SbkimHeterokaryose;
  const subtle = webcrypto.subtle;
  const keyPair = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const publicKeyJwk = await subtle.exportKey("jwk", keyPair.publicKey);
  const rawPub = await subtle.exportKey("raw", keyPair.publicKey);
  const hash = await subtle.digest("SHA-256", rawPub);
  const nodeId = SbkimHeterokaryose._base64urlEncode(new Uint8Array(hash));
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
  const sig = await SbkimHeterokaryose._signEnvelope(sporeMeta, keyPair.privateKey);
  const signed = SbkimHeterokaryose._canonicalize(Object.assign({}, sporeMeta, { signature: sig }));
  return { privateKey: keyPair.privateKey, spore: signed, nodeId: nodeId };
}

// Build a signed HeterokaryosisRequest with a pseudo-sender's key, addressed
// to a target nodeId (the receiver's persona).
async function buildSignedRequestFromPseudo(sender, toNodeId) {
  const SbkimHeterokaryose = globalThis.SbkimHeterokaryose;
  const subtle = webcrypto.subtle;
  // Generate nonce (NONCE_BYTES = 16, base64url).
  const nonceBytes = new Uint8Array(16);
  webcrypto.getRandomValues(nonceBytes);
  const nonce = SbkimHeterokaryose._base64urlEncode(nonceBytes);
  const unsigned = {
    fromNodeId: sender.nodeId,
    nonce: nonce,
    protocolVersion: "0.1",
    senderSpore: sender.spore,
    timestamp: new Date().toISOString(),
    toNodeId: toNodeId,
  };
  const sig = await SbkimHeterokaryose._signEnvelope(unsigned, sender.privateKey);
  return SbkimHeterokaryose._canonicalize(Object.assign({}, unsigned, { signature: sig }));
}

async function run() {
  let SbkimHeterokaryose = globalThis.SbkimHeterokaryose;

  // 0) Modul-Exports + Meta
  const fns = ["init", "requestHeterokaryosis", "receiveHeterokaryosis",
               "listHeterokaryosis", "forgetHeterokaryosis"];
  const missing = fns.filter(f => typeof SbkimHeterokaryose[f] !== "function");
  record("Exports — fünf Funktionen vorhanden",
         "alle fünf",
         missing.length === 0 ? "alle fünf" : "fehlend: " + missing.join(","),
         missing.length === 0);
  record("_meta.inboxStoreBase",
         "sbkim_hetero_inbox",
         SbkimHeterokaryose._meta.inboxStoreBase,
         SbkimHeterokaryose._meta.inboxStoreBase === "sbkim_hetero_inbox");
  record("_meta.outboxStoreBase",
         "sbkim_hetero_outbox",
         SbkimHeterokaryose._meta.outboxStoreBase,
         SbkimHeterokaryose._meta.outboxStoreBase === "sbkim_hetero_outbox");
  record("_meta.activeSlotKey (vor init)",
         "null",
         String(SbkimHeterokaryose._meta.activeSlotKey),
         SbkimHeterokaryose._meta.activeSlotKey === null);

  // === Probe 1: Default-Slot „main" ===
  await SbkimHeterokaryose.init();
  record("Probe 1 — init() resolves", "void", "void", true);
  record("Probe 1 — activeSlotKey nach init",
         "main",
         String(SbkimHeterokaryose._meta.activeSlotKey),
         SbkimHeterokaryose._meta.activeSlotKey === "main");
  record("Probe 1 — receiverMapSize nach init",
         "1",
         String(SbkimHeterokaryose._meta.receiverMapSize),
         SbkimHeterokaryose._meta.receiverMapSize === 1);

  const knownStoresP1 = SbkimStorage._meta.knownStores;
  record("Probe 1 — sbkim_hetero_inbox_main in knownStores",
         "true",
         knownStoresP1.includes("sbkim_hetero_inbox_main") ? "true" : "false",
         knownStoresP1.includes("sbkim_hetero_inbox_main"));
  record("Probe 1 — sbkim_anastomosis_log_main in knownStores",
         "true",
         knownStoresP1.includes("sbkim_anastomosis_log_main") ? "true" : "false",
         knownStoresP1.includes("sbkim_anastomosis_log_main"));

  // Spore für main mit domainVector erzeugen (für Spore-Single-Anker-Fallback)
  const mainVec = new Array(384).fill(0).map((_, i) => Math.sin(i * 0.1) * 0.05);
  await SbkimSpore.generateOwnSpore({
    domain: "main.example.org",
    nodeType: "hybrid",
    endpoint: "https://main.example.org/",
    domainVector: mainVec,
  });
  const mainNodeId = await SbkimSpore.getNodeId();

  // Pseudo-Sender baut Request → main mit Opt-In aktiv.
  const altVec = new Array(384).fill(0).map((_, i) => Math.sin(i * 0.1) * 0.05);
  const alt = await bakeSender("alt.example.org", altVec);

  // Pseudo-Sibling-Eintrag in sbkim_siblings_main mit heterokaryosisOptIn:true.
  // (Modul 05 wäre nach Bau 05.Y der Schreiber; im Smoke-Test setzen wir's
  // direkt mit ensureStore.)
  await SbkimStorage.ensureStore("sbkim_siblings_main");
  await SbkimStorage.put("sbkim_siblings_main", alt.nodeId, {
    nodeId: alt.nodeId,
    domain: "alt.example.org",
    endpoint: "https://alt.example.org/",
    pubKey: null,
    since: new Date().toISOString(),
    heterokaryosisOptIn: true,
  });

  const reqP1 = await buildSignedRequestFromPseudo(alt, mainNodeId);
  const respP1 = await SbkimHeterokaryose._invokeReceiveHeterokaryosisDirect(reqP1);
  record("Probe 1 — receiveHeterokaryosis outcome=shared",
         "shared",
         respP1.outcome,
         respP1.outcome === "shared");
  record("Probe 1 — receiverSpore.id = main-nodeId",
         "main-nodeId",
         respP1.receiverSpore && respP1.receiverSpore.id === mainNodeId ? "main" : "?",
         respP1.receiverSpore && respP1.receiverSpore.id === mainNodeId);

  // Modul 06 ist Pull-Empfänger; der Inbox-Schreib-Pfad liegt im
  // Sender (consumeResponse). Hier prüfen wir nur den Receive-Pfad,
  // der eine signierte Response liefert UND einen Log-Eintrag in
  // sbkim_anastomosis_log_main schreibt.
  const logRowsP1 = await SbkimStorage.all("sbkim_anastomosis_log_main");
  record("Probe 1 — Log-Eintrag in sbkim_anastomosis_log_main",
         "≥1 Eintrag",
         String(logRowsP1.length),
         logRowsP1.length >= 1);

  // Non-suffixed sbkim_anastomosis_log darf keinen 06.Y-Eintrag haben
  // (für unsere alt-nodeId). UnknownStoreError oder leerer Lookup beides ok.
  let p1LegacyLog = null;
  try {
    const rows = await SbkimStorage.all("sbkim_anastomosis_log");
    p1LegacyLog = rows.find(r => r.value && r.value.peerId === alt.nodeId);
  } catch (e) {
    p1LegacyLog = null;
  }
  record("Probe 1 — kein Log-Eintrag für alt in non-suffixed sbkim_anastomosis_log",
         "kein Eintrag",
         p1LegacyLog ? "fälschlich da" : "kein Eintrag",
         !p1LegacyLog);

  // === Probe 2: Sekundär-Slot „beruflich" ===
  await SbkimSpore.getOrCreateIdentity("beruflich");
  await SbkimSpore.setActiveIdentity("beruflich");
  const beruflichNodeId = await SbkimSpore.getNodeId();
  record("Probe 2 — setActiveIdentity('beruflich') gesetzt",
         "beruflich nodeId ≠ main nodeId",
         beruflichNodeId === mainNodeId ? "gleich!" : "verschieden",
         beruflichNodeId !== mainNodeId);

  // Re-Init Modul 06 (simuliert Tab-Reload).
  reloadModul06();
  SbkimHeterokaryose = globalThis.SbkimHeterokaryose;
  await SbkimHeterokaryose.init();
  record("Probe 2 — activeSlotKey nach Re-Init",
         "beruflich",
         String(SbkimHeterokaryose._meta.activeSlotKey),
         SbkimHeterokaryose._meta.activeSlotKey === "beruflich");
  record("Probe 2 — receiverMapSize nach Re-Init",
         "2",
         String(SbkimHeterokaryose._meta.receiverMapSize),
         SbkimHeterokaryose._meta.receiverMapSize === 2);

  // Beruflich-Spore erzeugen + Pseudo-Sibling-Eintrag für eine alt2.
  const beruflichVec = new Array(384).fill(0).map((_, i) => Math.cos(i * 0.07) * 0.05);
  await SbkimSpore.generateOwnSpore({
    domain: "beruflich.example.org",
    nodeType: "hybrid",
    endpoint: "https://beruflich.example.org/",
    domainVector: beruflichVec,
  }, "beruflich");

  // === Probe 3: Empfänger-Pfad nutzt die getroffene Persona ===
  // active = „beruflich". Pseudo-Sender schickt mit toNodeId = main-NodeId.
  // → main-Persona dient für die Antwort + Log.
  const alt2Vec = new Array(384).fill(0).map((_, i) => Math.sin(i * 0.1) * 0.05);
  const alt2 = await bakeSender("alt2.example.org", alt2Vec);

  // Pseudo-Sibling-Eintrag für alt2 im main-Slot (Empfänger schaut dort).
  await SbkimStorage.put("sbkim_siblings_main", alt2.nodeId, {
    nodeId: alt2.nodeId,
    domain: "alt2.example.org",
    endpoint: "https://alt2.example.org/",
    pubKey: null,
    since: new Date().toISOString(),
    heterokaryosisOptIn: true,
  });

  const reqP3 = await buildSignedRequestFromPseudo(alt2, mainNodeId);
  const respP3 = await SbkimHeterokaryose._invokeReceiveHeterokaryosisDirect(reqP3);
  record("Probe 3 — Receiver mit toNodeId=main outcome=shared",
         "shared",
         respP3.outcome,
         respP3.outcome === "shared");
  record("Probe 3 — receiverSpore.id = main (getroffene Persona)",
         "main-nodeId",
         respP3.receiverSpore && respP3.receiverSpore.id === mainNodeId ? "main" :
         respP3.receiverSpore && respP3.receiverSpore.id === beruflichNodeId ? "beruflich!" : "?",
         respP3.receiverSpore && respP3.receiverSpore.id === mainNodeId);

  // Log-Eintrag muss in sbkim_anastomosis_log_main sein (nicht beruflich).
  const logsMainAfterP3 = await SbkimStorage.all("sbkim_anastomosis_log_main");
  const p3LogMain = logsMainAfterP3.find(r => r.value && r.value.peerId === alt2.nodeId);
  record("Probe 3 — Log-Eintrag in sbkim_anastomosis_log_main",
         "vorhanden",
         p3LogMain ? "vorhanden" : "fehlt",
         !!p3LogMain);

  // beruflich-Log darf keinen alt2-Eintrag haben.
  await SbkimStorage.ensureStore("sbkim_anastomosis_log_beruflich");
  const logsBeruflichP3 = await SbkimStorage.all("sbkim_anastomosis_log_beruflich");
  const p3LogBeruflich = logsBeruflichP3.find(r => r.value && r.value.peerId === alt2.nodeId);
  record("Probe 3 — KEIN Log-Eintrag für alt2 in sbkim_anastomosis_log_beruflich",
         "kein Eintrag",
         p3LogBeruflich ? "fälschlich da" : "kein Eintrag",
         !p3LogBeruflich);

  // active-identity global muss weiterhin „beruflich" sein —
  // receiveHeterokaryosis darf NICHT setActiveIdentity rufen.
  const activeNachP3 = await SbkimSpore.getActiveIdentityKey();
  record("Probe 3 — active-identity (global) unverändert",
         "beruflich",
         activeNachP3,
         activeNachP3 === "beruflich");

  // === Probe 4: Unbekanntes toNodeId → rejected ===
  const unbekanntNodeId = "UNBEKANNT-XYZ-1234567890123456789012345678901";
  const alt3Vec = new Array(384).fill(0).map((_, i) => Math.sin(i * 0.1) * 0.05);
  const alt3 = await bakeSender("alt3.example.org", alt3Vec);
  const reqP4 = await buildSignedRequestFromPseudo(alt3, unbekanntNodeId);
  const respP4 = await SbkimHeterokaryose._invokeReceiveHeterokaryosisDirect(reqP4);
  record("Probe 4 — Receiver mit unbekanntem toNodeId outcome=rejected",
         "rejected",
         respP4.outcome,
         respP4.outcome === "rejected");
  record("Probe 4 — reason enthält 'toNodeId'",
         "ja",
         respP4.reason && respP4.reason.includes("toNodeId") ? "ja" : "nein",
         respP4.reason && respP4.reason.includes("toNodeId"));

  // Kein Log-Eintrag für alt3 in IRGENDEINEM slot-Log (Map-Miss = kein Storage-Eingriff).
  // (Antwort selbst nutzt aber activeSlotKey-Default zum Signieren — das ist Ok.)
  const logsMainP4 = await SbkimStorage.all("sbkim_anastomosis_log_main");
  const logsBeruflichP4 = await SbkimStorage.all("sbkim_anastomosis_log_beruflich");
  const p4LogMain = logsMainP4.find(r => r.value && r.value.peerId === alt3.nodeId);
  const p4LogBeruflich = logsBeruflichP4.find(r => r.value && r.value.peerId === alt3.nodeId);
  record("Probe 4 — KEIN Log-Eintrag für alt3 in irgendeinem slot-Log",
         "kein Eintrag",
         (p4LogMain || p4LogBeruflich) ? "fälschlich da" : "kein Eintrag",
         !p4LogMain && !p4LogBeruflich);

  // listHeterokaryosis-Pfad (nutzt activeSlotKey = beruflich nach Probe 2)
  const inboxList = await SbkimHeterokaryose.listHeterokaryosis();
  record("Probe — listHeterokaryosis (aktiver Slot beruflich, leer)",
         "0 Einträge",
         String(inboxList.length),
         inboxList.length === 0);

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
