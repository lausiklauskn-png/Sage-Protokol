// Headless smoke test for Bau 02.Y — Multi-Identitäts-API +
// Backup-Schema-Bump in Modul 02. Run with `node tests/smoke_bau02y.mjs`
// after `npm install --no-save fake-indexeddb` (provides IndexedDB
// shim). WebCrypto comes from node:crypto. NOT a unit-test framework;
// this is the bau-sitzung-smoke-probe analog Bau 01.Y, prints a table
// and exits non-zero on any failure.
//
// This is a build-time check, not a project artifact — keep it short
// and self-contained.

import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// Wire up window-likes for the IIFE modules. They expect window.crypto
// + window.SbkimStorage + console + btoa/atob; in Node 22 globalThis
// already has most of those.
globalThis.window = globalThis;
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, writable: false, configurable: true });
}
// Modul 01/02 access "global.crypto || (typeof crypto !== 'undefined' ? crypto : null)".
// Loading the IIFE bodies via Function() keeps the closure isolated.

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob",
                "TextEncoder", "TextDecoder", "indexedDB", src
    )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB);
}

loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");

const SbkimStorage = globalThis.SbkimStorage;
const SbkimSpore = globalThis.SbkimSpore;

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

async function run() {
  // 0) Modul exports + self-check
  const fns = ["init","getOrCreateIdentity","getNodeId","getPublicKeyJwk","generateOwnSpore",
               "getOwnSpore","verifyForeignSpore","setActiveIdentity","getActiveIdentityKey",
               "listIdentities","removeIdentity","resetIdentityCache","exportBackup","importBackup"];
  const missing = fns.filter(f => typeof SbkimSpore[f] !== "function");
  record("Exports — 14 Funktionen", "alle vorhanden", missing.length === 0 ? "alle 14 vorhanden" : "fehlend: " + missing.join(","),
         missing.length === 0);
  record("Errors — UnknownIdentityError + RemoveActiveIdentityError exportiert",
         "typeof === 'function'",
         (typeof SbkimSpore.UnknownIdentityError) + "/" + (typeof SbkimSpore.RemoveActiveIdentityError),
         typeof SbkimSpore.UnknownIdentityError === "function" &&
         typeof SbkimSpore.RemoveActiveIdentityError === "function");
  record("_meta.backupFormatVersion", "2", String(SbkimSpore._meta.backupFormatVersion),
         SbkimSpore._meta.backupFormatVersion === 2);
  record("_meta.identityStoreBases.length", "5", String(SbkimSpore._meta.identityStoreBases.length),
         SbkimSpore._meta.identityStoreBases.length === 5);

  // 1) init
  await SbkimSpore.init();
  record("init() resolves", "void", "void", true);

  // 2) Multi-Identitäts-Pfad — main + test
  const mainIdent = await SbkimSpore.getOrCreateIdentity();
  record("getOrCreateIdentity() default 'main'", "nodeId string",
         typeof mainIdent.nodeId, typeof mainIdent.nodeId === "string" && mainIdent.nodeId.length === 43);

  const testIdent = await SbkimSpore.getOrCreateIdentity("test");
  record("getOrCreateIdentity('test')", "nodeId ≠ main-nodeId",
         testIdent.nodeId === mainIdent.nodeId ? "gleich!" : "verschieden",
         testIdent.nodeId !== mainIdent.nodeId);

  const slots = await SbkimSpore.listIdentities();
  record("listIdentities() lexikographisch", "[main, test]",
         JSON.stringify(slots), JSON.stringify(slots) === '["main","test"]');

  // 3) setActiveIdentity + getActiveIdentityKey + getNodeId
  await SbkimSpore.setActiveIdentity("test");
  const activeNow = await SbkimSpore.getActiveIdentityKey();
  const nodeIdActive = await SbkimSpore.getNodeId();
  record("setActiveIdentity('test') + getActiveIdentityKey()", "test", activeNow, activeNow === "test");
  record("getNodeId() nach Wechsel", "test-nodeId", nodeIdActive === testIdent.nodeId ? "test-nodeId" : "main-nodeId",
         nodeIdActive === testIdent.nodeId);

  // 4) generateOwnSpore for both slots
  const demoMeta = { domain: "smoke.example.org", nodeType: "hybrid", endpoint: "https://smoke.example.org/" };
  await SbkimSpore.setActiveIdentity("main");
  const mainSpore = await SbkimSpore.generateOwnSpore(demoMeta);
  record("generateOwnSpore default = aktiver Slot (main)", "spore.id === main-nodeId",
         mainSpore.id === mainIdent.nodeId ? "match" : "mismatch", mainSpore.id === mainIdent.nodeId);

  const testSpore = await SbkimSpore.generateOwnSpore(demoMeta, "test");
  record("generateOwnSpore(meta, 'test')", "spore.id === test-nodeId",
         testSpore.id === testIdent.nodeId ? "match" : "mismatch", testSpore.id === testIdent.nodeId);

  // 5) UnknownIdentityError on setActiveIdentity with unknown key
  let unknownErr = null;
  try { await SbkimSpore.setActiveIdentity("doesnotexist"); }
  catch (e) { unknownErr = e; }
  record("setActiveIdentity unbekannter key", "UnknownIdentityError",
         unknownErr ? unknownErr.name : "kein Throw",
         unknownErr && unknownErr.name === "UnknownIdentityError");

  // 6) RemoveActiveIdentityError on removeIdentity active without force
  await SbkimSpore.setActiveIdentity("test");
  let removeErr = null;
  try { await SbkimSpore.removeIdentity("test"); }
  catch (e) { removeErr = e; }
  record("removeIdentity aktiv ohne force", "RemoveActiveIdentityError",
         removeErr ? removeErr.name : "kein Throw",
         removeErr && removeErr.name === "RemoveActiveIdentityError");

  // 7) removeIdentity force-Fallback auf "main"
  const removed = await SbkimSpore.removeIdentity("test", { force: true });
  const activeAfter = await SbkimSpore.getActiveIdentityKey();
  const slotsAfter = await SbkimSpore.listIdentities();
  const nodeIdAfter = await SbkimSpore.getNodeId();
  record("removeIdentity('test', {force:true}) Rückgabe", "true", String(removed), removed === true);
  record("active-identity nach force-Remove", "main", activeAfter, activeAfter === "main");
  record("listIdentities nach force-Remove", "[main]", JSON.stringify(slotsAfter), JSON.stringify(slotsAfter) === '["main"]');
  record("getNodeId nach force-Remove", "main-nodeId",
         nodeIdAfter === mainIdent.nodeId ? "main-nodeId" : "anders",
         nodeIdAfter === mainIdent.nodeId);

  // Idempotenz
  const removedAgain = await SbkimSpore.removeIdentity("test", { force: true });
  record("removeIdentity idempotent (zweiter Aufruf)", "false", String(removedAgain), removedAgain === false);

  // 8) Backup-Export mit Multi-Identität — test-Slot erneut anlegen
  const testIdent2 = await SbkimSpore.getOrCreateIdentity("test");
  await SbkimSpore.generateOwnSpore(demoMeta, "test");
  const blob = await SbkimSpore.exportBackup("password-1234-xyz");
  record("exportBackup wrapper.version", "2", String(blob.version), blob.version === 2);
  record("exportBackup payload-schema-version", "2",
         String(blob["payload-schema-version"]), blob["payload-schema-version"] === 2);

  // Decrypt zum Identities-Liste-Lesen
  function b64urlDecode(s) {
    const pad = s.length % 4 === 0 ? "" : "====".slice(s.length % 4);
    const b64 = s.replace(/-/g,"+").replace(/_/g,"/") + pad;
    return Uint8Array.from(Buffer.from(b64, "base64"));
  }
  const saltB = b64urlDecode(blob.kdf.salt);
  const ivB = b64urlDecode(blob.cipher.iv);
  const ctB = b64urlDecode(blob.ciphertext);
  const baseKey = await webcrypto.subtle.importKey("raw", new TextEncoder().encode("password-1234-xyz"),
                                                    { name: "PBKDF2" }, false, ["deriveKey"]);
  const aesKey = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltB, iterations: blob.kdf.iterations, hash: "SHA-256" },
    baseKey, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const plain = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv: ivB }, aesKey, ctB);
  const payload = JSON.parse(new TextDecoder().decode(plain));
  record("payload.identities.length", "2", String(payload.identities.length),
         payload.identities.length === 2);
  const slotKeys = payload.identities.map(e => e.key).sort();
  record("payload.identities[].key Slots", "[main, test]", JSON.stringify(slotKeys),
         JSON.stringify(slotKeys) === '["main","test"]');
  record("payload[\"active-identity\"]", "Slot im Container",
         payload["active-identity"], slotKeys.indexOf(payload["active-identity"]) !== -1);

  // 9) Backup-Import in leerer PWA — wir simulieren durch resetIdentityCache
  //    + Storage-Leerschreiben via SbkimStorage.clear pro Store + del meta.
  await SbkimStorage.clear("sbkim_keys");
  await SbkimStorage.clear("sbkim_spore");
  await SbkimStorage.del("sbkim_meta", "active-identity");
  SbkimSpore.resetIdentityCache();
  const beforeImport = await SbkimSpore.listIdentities();
  record("vor Import: leere PWA", "[]", JSON.stringify(beforeImport), beforeImport.length === 0);

  const restore = await SbkimSpore.importBackup(blob, "password-1234-xyz");
  record("importBackup leere PWA", "{restored:true}", JSON.stringify(restore), restore.restored === true);
  const slotsRestored = await SbkimSpore.listIdentities();
  record("listIdentities nach Import", "[main, test]", JSON.stringify(slotsRestored),
         JSON.stringify(slotsRestored) === '["main","test"]');
  const activeRestored = await SbkimSpore.getActiveIdentityKey();
  record("active-identity nach Import", "Slot aus payload", activeRestored,
         slotsRestored.indexOf(activeRestored) !== -1);

  // 10) BackupOverwriteError pro Slot — zweiter Import ohne force
  let overwriteErr = null;
  try { await SbkimSpore.importBackup(blob, "password-1234-xyz"); }
  catch (e) { overwriteErr = e; }
  record("importBackup zweiter Lauf ohne force", "BackupOverwriteError",
         overwriteErr ? overwriteErr.name : "kein Throw",
         overwriteErr && overwriteErr.name === "BackupOverwriteError");

  // 11) Alter v=1-Backup-Import (synthetischer Blob aus 02.X-Form)
  await SbkimStorage.clear("sbkim_keys");
  await SbkimStorage.clear("sbkim_spore");
  await SbkimStorage.del("sbkim_meta", "active-identity");
  SbkimSpore.resetIdentityCache();

  // Synth v=1: encrypt payload {createdAt, nodeId, keys, spore, siblings}
  const v1Payload = {
    createdAt: new Date().toISOString(),
    nodeId: mainIdent.nodeId,
    keys: { keyId: "main", privateKey: payload.identities.find(e => e.key === "main").keys.privateKey,
            publicKey: payload.identities.find(e => e.key === "main").keys.publicKey },
    spore: payload.identities.find(e => e.key === "main").spore,
    siblings: [],
  };
  const v1Salt = webcrypto.getRandomValues(new Uint8Array(16));
  const v1Iv = webcrypto.getRandomValues(new Uint8Array(12));
  const v1BaseKey = await webcrypto.subtle.importKey("raw", new TextEncoder().encode("oldbackup-pwd"),
                                                       { name: "PBKDF2" }, false, ["deriveKey"]);
  const v1AesKey = await webcrypto.subtle.deriveKey(
    { name: "PBKDF2", salt: v1Salt, iterations: 600000, hash: "SHA-256" },
    v1BaseKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  // canonical-JSON für die kanonische Form
  function canonicalize(v) {
    if (v === null) return null;
    if (Array.isArray(v)) return v.map(canonicalize);
    if (typeof v === "object") {
      const keys = Object.keys(v).sort();
      const out = {};
      for (const k of keys) out[k] = canonicalize(v[k]);
      return out;
    }
    return v;
  }
  const v1PlainBuf = new TextEncoder().encode(JSON.stringify(canonicalize(v1Payload)));
  const v1CipherBuf = await webcrypto.subtle.encrypt({ name: "AES-GCM", iv: v1Iv }, v1AesKey, v1PlainBuf);
  function b64urlEncode(bytes) {
    return Buffer.from(bytes).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  }
  const v1Blob = {
    version: 1,
    kdf: { algorithm: "PBKDF2", hash: "SHA-256", iterations: 600000, salt: b64urlEncode(v1Salt) },
    cipher: { algorithm: "AES-GCM-256", iv: b64urlEncode(v1Iv) },
    ciphertext: b64urlEncode(new Uint8Array(v1CipherBuf)),
    "payload-schema-version": 1,
  };
  const v1Restore = await SbkimSpore.importBackup(v1Blob, "oldbackup-pwd");
  record("v=1-Backup-Import in leere PWA", "{restored:true}",
         JSON.stringify(v1Restore), v1Restore.restored === true);
  const v1Slots = await SbkimSpore.listIdentities();
  record("v=1-Backup-Import → main-Slot angelegt", "[main]",
         JSON.stringify(v1Slots), JSON.stringify(v1Slots) === '["main"]');
  const v1Active = await SbkimSpore.getActiveIdentityKey();
  record("v=1-Backup-Import → active-identity = main", "main",
         v1Active, v1Active === "main");

  // 12) Unknown wrapper version
  let badVer = null;
  try { await SbkimSpore.importBackup({ ...blob, version: 99 }, "password-1234-xyz"); }
  catch (e) { badVer = e; }
  record("importBackup unbekannte Wrapper-Version", "BackupVersionMismatchError",
         badVer ? badVer.name : "kein Throw",
         badVer && badVer.name === "BackupVersionMismatchError");
}

run().then(() => {
  let allOk = true;
  console.log("\n=== Bau 02.Y Smoke-Test Resultate ===");
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} ${r.probe}\n   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
    if (!r.ok) allOk = false;
  }
  console.log(`\nTotal: ${results.length} Proben, ${results.filter(r => r.ok).length} grün, ${results.filter(r => !r.ok).length} rot.`);
  if (!allOk) process.exit(1);
}).catch(err => {
  console.error("Smoke-Test scheiterte mit Exception:", err);
  process.exit(2);
});
