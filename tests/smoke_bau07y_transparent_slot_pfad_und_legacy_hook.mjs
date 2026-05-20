// Headless smoke test for Bau 07.Y — transparenter Slot-Pfad in
// Modul 07 (Apoptose) + _sendLegacyForIdentity-Hook. Run with
// `node tests/smoke_bau07y_transparent_slot_pfad_und_legacy_hook.mjs`
// after `npm install --no-save fake-indexeddb`.

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

// Mock fetch so dispatchLegacyOnce can resolve without a real network.
// We accept any URL and return a generic accepted Response, signed via
// a stub spore. For the smoke test we don't verify the response chain
// (Modul 07's confirmSelfApoptose treats receiver responses as
// recipientsNotified/recipientsFailed; we just count). To keep the
// fetch mock simple, return a malformed response so dispatchLegacyOnce
// resolves with outcome:"rejected" (which moves the sibling to
// recipientsFailed). That's fine — the test doesn't depend on
// "accepted" status, just on the call path being exercised.
globalThis.fetch = async function fakeFetch(_url) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    async json() { return { outcome: "rejected", reason: "smoke-mock" }; },
  };
};
globalThis.AbortController = class { constructor() { this.signal = {}; } abort() {} };

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob",
                "TextEncoder", "TextDecoder", "indexedDB", "fetch", "AbortController",
                "BroadcastChannel", "navigator", "setTimeout", "clearTimeout", src
    )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB,
      globalThis.fetch, globalThis.AbortController,
      typeof globalThis.BroadcastChannel === "function" ? globalThis.BroadcastChannel : undefined,
      typeof globalThis.navigator !== "undefined" ? globalThis.navigator : undefined,
      globalThis.setTimeout, globalThis.clearTimeout);
}

function reloadModul07() {
  delete globalThis.SbkimApoptose;
  loadModule("src/modules/07_apoptose.js");
}

loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");
loadModule("src/modules/07_apoptose.js");

const SbkimStorage = globalThis.SbkimStorage;
const SbkimSpore = globalThis.SbkimSpore;

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

async function bakeSender(domain) {
  const SbkimApoptose = globalThis.SbkimApoptose;
  const subtle = webcrypto.subtle;
  const keyPair = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const publicKeyJwk = await subtle.exportKey("jwk", keyPair.publicKey);
  const rawPub = await subtle.exportKey("raw", keyPair.publicKey);
  const hash = await subtle.digest("SHA-256", rawPub);
  const nodeId = SbkimApoptose._base64urlEncode(new Uint8Array(hash));
  const sporeMeta = {
    createdAt: new Date().toISOString(),
    domain: domain,
    embeddingModel: "Xenova/multilingual-e5-small",
    endpoint: "https://" + domain + "/",
    id: nodeId,
    nodeType: "hybrid",
    protocolVersion: "0.1",
    publicKey: publicKeyJwk,
  };
  const sig = await SbkimApoptose._signEnvelope(sporeMeta, keyPair.privateKey);
  const signed = SbkimApoptose._canonicalize(Object.assign({}, sporeMeta, { signature: sig }));
  return { privateKey: keyPair.privateKey, spore: signed, nodeId: nodeId };
}

async function buildLegacyFromPseudo(sender, reason, toNodeId) {
  const SbkimApoptose = globalThis.SbkimApoptose;
  const nonceBytes = new Uint8Array(16);
  webcrypto.getRandomValues(nonceBytes);
  const nonce = SbkimApoptose._base64urlEncode(nonceBytes);
  const unsigned = {
    fromNodeId: sender.nodeId,
    nonce: nonce,
    protocolVersion: "0.1",
    reason: reason,
    senderSpore: sender.spore,
    timestamp: new Date().toISOString(),
  };
  if (typeof toNodeId === "string" && toNodeId.length > 0) unsigned.toNodeId = toNodeId;
  const sig = await SbkimApoptose._signEnvelope(unsigned, sender.privateKey);
  return SbkimApoptose._canonicalize(Object.assign({}, unsigned, { signature: sig }));
}

async function run() {
  let SbkimApoptose = globalThis.SbkimApoptose;

  // 0) Modul-Exports
  const fns = ["init", "prepareSelfApoptose", "confirmSelfApoptose", "receiveLegacy",
               "listLegacy", "forgetExpiredSiblings"];
  const missing = fns.filter(f => typeof SbkimApoptose[f] !== "function");
  record("Exports — sechs Funktionen vorhanden",
         "alle sechs",
         missing.length === 0 ? "alle sechs" : "fehlend: " + missing.join(","),
         missing.length === 0);
  record("_sendLegacyForIdentity exportiert (Hook für Modul 02)",
         "function",
         typeof SbkimApoptose._sendLegacyForIdentity,
         typeof SbkimApoptose._sendLegacyForIdentity === "function");
  record("_meta.inboxStoreBase",
         "sbkim_legacy_inbox",
         SbkimApoptose._meta.inboxStoreBase,
         SbkimApoptose._meta.inboxStoreBase === "sbkim_legacy_inbox");
  record("_meta.activeSlotKey (vor init)",
         "null",
         String(SbkimApoptose._meta.activeSlotKey),
         SbkimApoptose._meta.activeSlotKey === null);

  // === Probe 1: Default-Slot „main" — receiveLegacy + listLegacy ===
  await SbkimApoptose.init();
  record("Probe 1 — activeSlotKey nach init", "main", String(SbkimApoptose._meta.activeSlotKey),
         SbkimApoptose._meta.activeSlotKey === "main");
  record("Probe 1 — receiverMapSize nach init", "1", String(SbkimApoptose._meta.receiverMapSize),
         SbkimApoptose._meta.receiverMapSize === 1);

  // Main-Spore erzeugen.
  await SbkimSpore.generateOwnSpore({
    domain: "main.example.org",
    nodeType: "hybrid",
    endpoint: "https://main.example.org/",
  });
  const mainNodeId = await SbkimSpore.getNodeId();

  // Pseudo-Sender, der einen Legacy an main schickt.
  const alt = await bakeSender("alt.example.org");
  const legacyP1 = await buildLegacyFromPseudo(alt, "Domain stillgelegt", mainNodeId);
  const respP1 = await SbkimApoptose._invokeReceiveLegacyDirect(legacyP1);
  record("Probe 1 — receiveLegacy outcome=accepted",
         "accepted", respP1.outcome,
         respP1.outcome === "accepted");

  // Inbox-Eintrag muss in sbkim_legacy_inbox_main sein.
  const inboxP1 = await SbkimStorage.get("sbkim_legacy_inbox_main", alt.nodeId);
  record("Probe 1 — Inbox-Eintrag in sbkim_legacy_inbox_main",
         "vorhanden", inboxP1 ? "vorhanden" : "fehlt",
         inboxP1 && inboxP1.fromNodeId === alt.nodeId);

  // listLegacy() für aktiven Slot.
  const listP1 = await SbkimApoptose.listLegacy();
  record("Probe 1 — listLegacy (aktiv main) hat alt-Eintrag",
         "1 Eintrag",
         String(listP1.length),
         listP1.length === 1 && listP1[0].fromNodeId === alt.nodeId);

  // === Probe 2: Sekundär-Slot „test_07y" — listLegacy(key) ===
  await SbkimSpore.getOrCreateIdentity("test_07y");
  await SbkimSpore.setActiveIdentity("test_07y");
  await SbkimSpore.generateOwnSpore({
    domain: "test07y.example.org",
    nodeType: "hybrid",
    endpoint: "https://test07y.example.org/",
  }, "test_07y");

  // Re-Init Modul 07 (simuliert Tab-Reload).
  reloadModul07();
  SbkimApoptose = globalThis.SbkimApoptose;
  await SbkimApoptose.init();
  record("Probe 2 — activeSlotKey nach Re-Init",
         "test_07y", String(SbkimApoptose._meta.activeSlotKey),
         SbkimApoptose._meta.activeSlotKey === "test_07y");
  record("Probe 2 — receiverMapSize nach Re-Init",
         "2", String(SbkimApoptose._meta.receiverMapSize),
         SbkimApoptose._meta.receiverMapSize === 2);

  // listLegacy('test_07y') — Sekundär-Slot, leer.
  const listP2 = await SbkimApoptose.listLegacy("test_07y");
  record("Probe 2 — listLegacy('test_07y') leer (Sekundär-Slot ohne Empfang)",
         "0 Einträge", String(listP2.length),
         listP2.length === 0);

  // listLegacy('main') — explizite Persona-Wahl trotz active = test_07y.
  const listP2Main = await SbkimApoptose.listLegacy("main");
  record("Probe 2 — listLegacy('main') liefert main-Inbox trotz active=test_07y",
         "1 Eintrag (alt)", String(listP2Main.length),
         listP2Main.length === 1 && listP2Main[0].fromNodeId === alt.nodeId);

  // === Probe 3: Empfänger-Pfad mit unbekanntem toNodeId → rejected ===
  const unbekanntNodeId = "UNBEKANNT-XYZ-1234567890123456789012345678901";
  const alt2 = await bakeSender("alt2.example.org");
  const legacyP3 = await buildLegacyFromPseudo(alt2, "Domain stillgelegt", unbekanntNodeId);
  const respP3 = await SbkimApoptose._invokeReceiveLegacyDirect(legacyP3);
  record("Probe 3 — receiveLegacy mit unbekanntem toNodeId → rejected",
         "rejected", respP3.outcome,
         respP3.outcome === "rejected");
  record("Probe 3 — reason enthält 'toNodeId'",
         "ja", respP3.reason && respP3.reason.includes("toNodeId") ? "ja" : "nein",
         respP3.reason && respP3.reason.includes("toNodeId"));

  // Kein Inbox-Eintrag für alt2.nodeId in irgendeinem Slot.
  const sibP3Main = await SbkimStorage.get("sbkim_legacy_inbox_main", alt2.nodeId);
  const sibP3Test = await SbkimStorage.get("sbkim_legacy_inbox_test_07y", alt2.nodeId);
  record("Probe 3 — KEIN Inbox-Eintrag für alt2 (Map-Miss = kein Storage)",
         "beide undefined",
         "main=" + (sibP3Main === undefined ? "und" : "DA") +
         ", test_07y=" + (sibP3Test === undefined ? "und" : "DA"),
         sibP3Main === undefined && sibP3Test === undefined);

  // === Probe 4: _sendLegacyForIdentity('main') — Hook produktiv ===
  // main hat einen Sibling (alt), wird also den Pseudo-fetch-Mock
  // einmal ansprechen. Resolve mit recipientsFailed (fake-fetch liefert
  // "rejected"), aber Hook resolved ohne Throw — das ist der Bau-07.Y-
  // Vertrag (fail-soft).

  // alt als Sibling in sbkim_siblings_main eintragen (Pseudo-Sibling
  // für den Versand-Pfad).
  await SbkimStorage.ensureStore("sbkim_siblings_main");
  await SbkimStorage.put("sbkim_siblings_main", alt.nodeId, {
    nodeId: alt.nodeId,
    domain: "alt.example.org",
    endpoint: "https://alt.example.org/",
    pubKey: null,
    since: new Date().toISOString(),
  });

  let hookResult = null, hookErr = null;
  try {
    hookResult = await SbkimApoptose._sendLegacyForIdentity("main", "test-reason");
  } catch (e) {
    hookErr = e;
  }
  record("Probe 4 — _sendLegacyForIdentity('main') resolved fail-soft",
         "kein Throw", hookErr ? hookErr.name : "kein Throw",
         hookErr === null);
  record("Probe 4 — Hook liefert recipientsFailed (mock-rejected) + recipientsNotified",
         "Arrays",
         hookResult ? "notified=" + hookResult.recipientsNotified.length +
                      ", failed=" + hookResult.recipientsFailed.length : "kein result",
         hookResult && Array.isArray(hookResult.recipientsNotified) &&
         Array.isArray(hookResult.recipientsFailed));

  // Hook MACHT KEINEN Cleanup. sbkim_keys + sbkim_spore für „main"
  // müssen weiterhin existieren.
  const mainKeyStill = await SbkimStorage.get("sbkim_keys", "main");
  const mainSporeStill = await SbkimStorage.get("sbkim_spore", "main");
  record("Probe 4 — Hook macht KEINEN Cleanup: sbkim_keys[main] bleibt",
         "vorhanden",
         mainKeyStill ? "vorhanden" : "weg",
         !!mainKeyStill);
  record("Probe 4 — Hook macht KEINEN Cleanup: sbkim_spore[main] bleibt",
         "vorhanden",
         mainSporeStill ? "vorhanden" : "weg",
         !!mainSporeStill);

  // === Probe 5: Globale confirmSelfApoptose über main + test_07y ===
  // listIdentities() hat zwei Slots. confirmSelfApoptose soll pro Slot
  // _sendLegacyForIdentity rufen + pro Slot Cleanup machen.
  await SbkimApoptose._clearPseudoSiblings();  // Sicherheit: keine override

  const prepRes = await SbkimApoptose.prepareSelfApoptose("Endgültiger Abschied");
  record("Probe 5 — prepareSelfApoptose liefert confirmationToken",
         "string",
         typeof prepRes.confirmationToken,
         typeof prepRes.confirmationToken === "string" && prepRes.confirmationToken.length > 0);

  // recipientCount = global summe (main hat 1 Sibling, test_07y 0).
  record("Probe 5 — recipientCount globale Summe (1 sibling über alle Slots)",
         "1",
         String(prepRes.recipientCount),
         prepRes.recipientCount === 1);

  const confirmRes = await SbkimApoptose.confirmSelfApoptose(prepRes.confirmationToken, "Endgültiger Abschied");
  record("Probe 5 — confirmSelfApoptose outcome=completed",
         "completed",
         confirmRes.outcome,
         confirmRes.outcome === "completed");

  // Nach confirmSelfApoptose: alle Slots gelöscht.
  const idsAfter = await SbkimSpore.listIdentities();
  record("Probe 5 — listIdentities() nach confirmSelfApoptose leer",
         "[]",
         JSON.stringify(idsAfter),
         Array.isArray(idsAfter) && idsAfter.length === 0);

  // sbkim_meta["active-identity"] gelöscht.
  let activeAfter;
  try {
    activeAfter = await SbkimStorage.get("sbkim_meta", "active-identity");
  } catch (e) {
    activeAfter = undefined;
  }
  record("Probe 5 — sbkim_meta['active-identity'] cleared",
         "undefined",
         activeAfter === undefined ? "undefined" : "noch da",
         activeAfter === undefined);

  // Per-Slot Inbox / Siblings / Keys / Spore gelöscht.
  const mainKeyAfter = await SbkimStorage.get("sbkim_keys", "main");
  const testKeyAfter = await SbkimStorage.get("sbkim_keys", "test_07y");
  const mainSporeAfter = await SbkimStorage.get("sbkim_spore", "main");
  record("Probe 5 — sbkim_keys[main] gelöscht",
         "undefined",
         mainKeyAfter === undefined ? "undefined" : "noch da",
         mainKeyAfter === undefined);
  record("Probe 5 — sbkim_keys[test_07y] gelöscht",
         "undefined",
         testKeyAfter === undefined ? "undefined" : "noch da",
         testKeyAfter === undefined);
  record("Probe 5 — sbkim_spore[main] gelöscht",
         "undefined",
         mainSporeAfter === undefined ? "undefined" : "noch da",
         mainSporeAfter === undefined);

  // Modul-02-Cache invalidiert: getNodeId muss NoIdentityError werfen.
  let nodeIdErr = null;
  try {
    await SbkimSpore.getNodeId();
  } catch (e) {
    nodeIdErr = e;
  }
  record("Probe 5 — getNodeId wirft nach Apoptose (NoIdentityError)",
         "Error",
         nodeIdErr ? nodeIdErr.name : "kein Throw",
         nodeIdErr && nodeIdErr.name === "NoIdentityError");

  // _meta.activeSlotKey wurde auch invalidiert.
  record("Probe 5 — _meta.activeSlotKey nach Apoptose null",
         "null",
         String(SbkimApoptose._meta.activeSlotKey),
         SbkimApoptose._meta.activeSlotKey === null);

  // Print results.
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
