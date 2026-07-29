// Headless smoke test — Modul 01 Selbstheilung „database connection is closing".
// Run: `npm install --no-save fake-indexeddb` dann
//   node tests/smoke_pflege_01_reopen_retry.mjs
//
// Reproduziert Klaus' Befund vom 2026-07-29: ist dieselbe App/Origin in ZWEI
// Fenstern offen, feuert der Browser onversionchange -> db.close(); die gecachte
// Verbindung ist tot und db.transaction() wirft synchron InvalidStateError
// („The database connection is closing"). Vorher brach jede Operation dort ab —
// der Handshake schlug fehl UND ein fehlgeschlagener Identitäts-Lesevorgang
// konnte als „keine Identität" missverstanden werden (Identitäts-Churn).
//
// Zwei Proben:
//  1. get() heilt sich selbst: der ERSTE transaction()-Aufruf wirft einmalig
//     „connection is closing" -> beginTx öffnet frisch neu und liefert den
//     gespeicherten Wert. KEIN Throw, KEIN fälschliches null.
//  2. Gegenprobe (Ehrlichkeit): wirft transaction() DAUERHAFT, lehnt get()
//     ehrlich mit Fehler ab — NIEMALS stilles undefined (das würde als
//     „keine Identität" gelesen und die neue Kennung würfeln).

import "fake-indexeddb/auto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// --- Transaction-Sabotage: simuliert die geschlossene Verbindung ------------
// closingMode: "off" | "once" | "always". Bei "once" wirft der NÄCHSTE
// transaction()-Aufruf einmalig, danach wieder normal.
let closingMode = "off";
const IDBDatabaseCtor = globalThis.IDBDatabase;
const origTransaction = IDBDatabaseCtor.prototype.transaction;
IDBDatabaseCtor.prototype.transaction = function (...args) {
  if (closingMode === "once") {
    closingMode = "off";
    const e = new Error("Failed to execute 'transaction' on 'IDBDatabase': The database connection is closing.");
    e.name = "InvalidStateError";
    throw e;
  }
  if (closingMode === "always") {
    const e = new Error("Failed to execute 'transaction' on 'IDBDatabase': The database connection is closing.");
    e.name = "InvalidStateError";
    throw e;
  }
  return origTransaction.apply(this, args);
};

function loadStorageModule() {
  delete globalThis.SbkimStorage;
  const src = readFileSync(resolve(repoRoot, "src/modules/01_storage.js"), "utf8");
  new Function("global", "window", "globalThis", "console", "indexedDB", "navigator", src)(
    globalThis, globalThis, globalThis, console, globalThis.indexedDB, globalThis.navigator || {},
  );
  return globalThis.SbkimStorage;
}

const results = [];
const record = (probe, exp, act, ok) => results.push({ probe, exp, act, ok });

async function run() {
  const S = loadStorageModule();
  await S.init();                       // frische DB, Verbindung gecacht
  await S.put("sbkim_keys", "probe", { keyId: "probe", marker: 42 });

  // --- Probe 1: einmaliger „closing" -> Selbstheilung ---------------------
  closingMode = "once";
  let val = null, threw1 = null;
  try { val = await S.get("sbkim_keys", "probe"); } catch (e) { threw1 = e; }
  record("get() heilt sich nach einmaligem 'connection is closing'",
    "Wert {marker:42}, kein Throw",
    threw1 ? ("Throw: " + threw1.message) : JSON.stringify(val),
    !threw1 && val && val.marker === 42);
  record("closingMode nach Selbstheilung zurückgesetzt (Retry hat gegriffen)",
    "off", closingMode, closingMode === "off");

  // --- Probe 2: dauerhafter „closing" -> ehrlicher Fehler, NIE null --------
  closingMode = "always";
  let val2 = "SENTINEL", threw2 = null;
  try { val2 = await S.get("sbkim_keys", "probe"); } catch (e) { threw2 = e; }
  closingMode = "off";
  record("get() lehnt bei DAUERHAFTEM 'closing' ehrlich ab (kein stilles undefined)",
    "Throw/Reject",
    threw2 ? ("Reject: " + threw2.name) : ("still zurück: " + JSON.stringify(val2)),
    !!threw2 && val2 === "SENTINEL");

  // --- Bericht ---
  let pass = 0, fail = 0;
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.probe}`);
    if (!r.ok) { console.log(`   erwartet: ${r.exp}`); console.log(`   erhalten: ${r.act}`); }
    r.ok ? pass++ : fail++;
  }
  console.log(`\nSumme: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt`);
  if (fail > 0) process.exit(1);
}

run().catch((e) => { console.error("Testlauf-Fehler:", e); process.exit(1); });
