// Headless smoke test for Pflege Modul 01 init() versions-fail-soft.
// Run with `node tests/smoke_pflege_01_init_fail_soft.mjs` after
// `npm install --no-save fake-indexeddb`. Drei Proben:
//
//  1. Frische DB → init() resolves mit db.version === 4, alle Pflicht-
//     Stores vorhanden.
//  2. Existing v=10-DB (synthetisch via roher indexedDB.open + manuelle
//     onupgradeneeded-Loop mit allen Pflicht-Stores aus
//     STORES_V1/V2/V3) → init() resolves mit db.version === 10, KEIN
//     VersionError, KEIN Bump.
//  3. Existing v=10-DB OHNE Identitäts-Store (sbkim_keys weg) → Selbst-
//     Heilung: init() baut die nachweislich identitäts-leere DB neu auf
//     (db.version === 4, alle Pflicht-Stores), KEIN Throw (Härtung 2026-07-11).
//  4. Existing v=10-DB MIT sbkim_keys, aber anderem fehlenden Pflicht-Store →
//     fail-fast StorageOpenError (Identität könnte da sein, kein stiller
//     Neu-Aufbau — Grenze der Härtung).
//
// Build-time check, kein Unit-Test-Framework — analog smoke_bau02y.mjs.

import "fake-indexeddb/auto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// Pro Probe einen frischen Modul-Scope laden, damit das interne
// dbPromise-/currentDb-/KNOWN_STORES-State zwischen Proben isoliert
// bleibt. fake-indexeddb behält den DB-Inhalt zwischen Loads bei
// (in-memory IndexedDB im Test-Prozess) — das ist genau was wir wollen.
function loadStorageModule() {
  // Lösche existing Export, damit der IIFE ihn neu setzen muss.
  delete globalThis.SbkimStorage;
  const src = readFileSync(resolve(repoRoot, "src/modules/01_storage.js"), "utf8");
  new Function("global", "window", "globalThis", "console", "indexedDB", "navigator", src)(
    globalThis, globalThis, globalThis, console, globalThis.indexedDB, globalThis.navigator || {}
  );
  return globalThis.SbkimStorage;
}

// Synth-Helper: legt eine DB mit gegebener Version + Liste von Stores
// an, schließt sie wieder. Erlaubt Proben mit „existing high-version
// DB" ohne den Modul-01-init-Pfad zu durchlaufen.
function synthDb(name, version, stores) {
  return new Promise((res, rej) => {
    const req = globalThis.indexedDB.open(name, version);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of stores) {
        if (!db.objectStoreNames.contains(s)) {
          db.createObjectStore(s);
        }
      }
    };
    req.onsuccess = () => { req.result.close(); res(); };
    req.onerror = () => rej(req.error);
  });
}

function deleteDb(name) {
  return new Promise((res) => {
    const req = globalThis.indexedDB.deleteDatabase(name);
    req.onsuccess = () => res();
    req.onerror = () => res();  // fail-soft
    req.onblocked = () => res();
  });
}

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

async function run() {
  // ---- Probe 1: frische DB ----
  await deleteDb("sbkim");
  let S = loadStorageModule();
  await S.init();
  record(
    "Probe 1: frische DB — db.version",
    "4",
    String(S._meta.dbVersion),
    S._meta.dbVersion === 4
  );
  const v1Stores = ["sbkim_keys","sbkim_spore","sbkim_siblings","sbkim_anastomosis_log","sbkim_legacy_inbox","sbkim_doku_meta","sbkim_hetero_inbox","sbkim_hetero_outbox"];
  const knownAfterInit = S._meta.knownStores;
  const missing1 = v1Stores.filter(s => knownAfterInit.indexOf(s) === -1);
  record(
    "Probe 1: alle Pflicht-Stores vorhanden",
    "alle 8",
    missing1.length === 0 ? "alle 8" : "fehlend: " + missing1.join(","),
    missing1.length === 0
  );
  record(
    "Probe 1: _meta.dbVersionPolicy",
    '"fail-soft-min-schema"',
    JSON.stringify(S._meta.dbVersionPolicy),
    S._meta.dbVersionPolicy === "fail-soft-min-schema"
  );

  // ---- Probe 2: existing v=10-DB mit allen Pflicht-Stores ----
  await deleteDb("sbkim_test_v10");
  // Synth v=10-DB: alle Pflicht-Stores + ein dynamischer Test-Store
  // (simuliert ensureStore-Bumps aus Bau-02.Y-Sichttest).
  await synthDb("sbkim_test_v10", 10, [
    "sbkim_keys", "sbkim_spore", "sbkim_siblings",
    "sbkim_anastomosis_log", "sbkim_legacy_inbox", "sbkim_doku_meta",
    "sbkim_hetero_inbox", "sbkim_hetero_outbox",
    "sbkim_test_dynamic"  // dynamischer Store aus früherem ensureStore
  ]);
  S = loadStorageModule();
  await S.init({ dbSuffix: "test_v10" });
  record(
    "Probe 2: existing v=10 — KEIN VersionError",
    "init resolves",
    "init resolves",
    true  // wenn wir hier sind, hat init() durchgelaufen
  );
  record(
    "Probe 2: db.version übernommen",
    "10",
    String(S._meta.dbVersion),
    S._meta.dbVersion === 10
  );
  // KNOWN_STORES sollte auch dynamische Stores enthalten (Bau-01.Y-konform)
  const knownAfterV10 = S._meta.knownStores;
  record(
    "Probe 2: dynamischer Store in knownStores",
    "sbkim_test_dynamic vorhanden",
    knownAfterV10.indexOf("sbkim_test_dynamic") !== -1 ? "vorhanden" : "fehlt: " + knownAfterV10.join(","),
    knownAfterV10.indexOf("sbkim_test_dynamic") !== -1
  );

  // ---- Probe 3: existing v=10-DB OHNE Identitäts-Store → SELBST-HEILUNG ----
  // Härtung 2026-07-11: fehlt sbkim_keys, kann die DB keine Identität tragen
  // → gefahrloser Neu-Aufbau statt Fehler. (Vorher: StorageOpenError; das
  // ließ die „Aufräumen & neu anmelden"-Rettung netzweit abbrechen.)
  await deleteDb("sbkim_test_v10_broken");
  await synthDb("sbkim_test_v10_broken", 10, [
    "sbkim_spore", "sbkim_siblings",
    "sbkim_anastomosis_log", "sbkim_legacy_inbox", "sbkim_doku_meta",
    "sbkim_hetero_inbox", "sbkim_hetero_outbox"
    // sbkim_keys FEHLT → nachweislich identitäts-leer
  ]);
  S = loadStorageModule();
  let healErr = null;
  try {
    await S.init({ dbSuffix: "test_v10_broken" });
  } catch (e) {
    healErr = e;
  }
  record(
    "Probe 3: identitäts-leere Schrott-DB → Selbst-Heilung (kein Throw)",
    "init resolves (rebuild)",
    healErr ? "Throw: " + healErr.name + " — " + (healErr.message || "").slice(0, 60) : "init resolves (rebuild)",
    !healErr
  );
  record(
    "Probe 3: nach Heilung frische DB auf DB_VERSION",
    "4",
    healErr ? "(kein resolve)" : String(S._meta.dbVersion),
    !healErr && S._meta.dbVersion === 4
  );
  const healStores = healErr ? [] : S._meta.knownStores;
  const healMissing = v1Stores.filter(s => healStores.indexOf(s) === -1);
  record(
    "Probe 3: nach Heilung alle Pflicht-Stores vorhanden",
    "alle 8",
    healErr ? "(kein resolve)" : (healMissing.length === 0 ? "alle 8" : "fehlend: " + healMissing.join(",")),
    !healErr && healMissing.length === 0
  );

  // ---- Probe 4: Identitäts-Store DA, anderer Pflicht-Store fehlt → fail-fast ----
  // Grenze der Härtung: ist sbkim_keys vorhanden, KÖNNTE eine Identität
  // existieren → NICHT stillschweigend neu aufbauen, sondern hart abbrechen
  // (Klaus' „ich repariere nicht"-Regel bleibt für den identitäts-tragenden Fall).
  await deleteDb("sbkim_test_v10_partial");
  await synthDb("sbkim_test_v10_partial", 10, [
    "sbkim_keys", "sbkim_spore", "sbkim_siblings",
    "sbkim_anastomosis_log", "sbkim_legacy_inbox", "sbkim_doku_meta",
    "sbkim_hetero_inbox"
    // sbkim_hetero_outbox FEHLT, aber sbkim_keys ist DA
  ]);
  S = loadStorageModule();
  let partialErr = null;
  try {
    await S.init({ dbSuffix: "test_v10_partial" });
  } catch (e) {
    partialErr = e;
  }
  record(
    "Probe 4: Pflicht-Store fehlt bei DA-Identität → StorageOpenError",
    "name: StorageOpenError",
    partialErr ? "name: " + partialErr.name : "kein Throw (falsch geheilt!)",
    partialErr && partialErr.name === "StorageOpenError"
  );
  record(
    "Probe 4: Error-Message benennt fehlenden Store",
    "enthält 'sbkim_hetero_outbox'",
    partialErr ? "msg: " + partialErr.message.slice(0, 100) : "(kein Error)",
    partialErr && partialErr.message.indexOf("sbkim_hetero_outbox") !== -1
  );
}

run().then(() => {
  let allOk = true;
  console.log("\n=== Pflege Modul 01 init() versions-fail-soft Smoke-Test ===");
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
