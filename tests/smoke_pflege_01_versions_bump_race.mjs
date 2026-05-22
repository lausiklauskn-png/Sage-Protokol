// Headless smoke test for Pflege Modul 01 Versions-Bump-Race in
// openProbe (2026-05-21). Run with
// `node tests/smoke_pflege_01_versions_bump_race.mjs` after
// `npm install --no-save fake-indexeddb`.
//
// Vier Proben — alle decken den Race-Pfad ab, der nur in
// `tests/manual_check.html` bei wiederholtem Modul-Wechsel auftritt
// (Endknoten-PWAs sind nicht betroffen):
//
//  1. openProbe-Connection trägt onversionchange-Handler. Beweist
//     den Race-Auflösungs-Hebel (a) aus dem Brief: nach openProbe ist
//     `req.result.onversionchange` gesetzt, sodass ein späterer Bump
//     die Verbindung sicher schließen kann.
//
//  2. closeConnectionAndWait wartet auf onclose ODER Timeout. Beweist
//     den Helper-Vertrag (b) aus dem Brief: das Promise resolved auch,
//     wenn die fake-indexeddb-Connection kein onclose-Event feuert
//     (Chrome-Quirk-Spiegel) — der 50-ms-Timeout-Fallback greift.
//
//  3. Wiederholter init()→ensureStore→Modul-Wechsel-Zyklus. Simuliert
//     Klaus' Sichttest-Sequenz (Panel 01 Reset → Hard-Reload → Panel
//     06 Setup): drei aufeinanderfolgende `init()`-Ketten mit jeweils
//     einem `ensureStore`-Bump dürfen NICHT in `Versions-Bump
//     blockiert` enden.
//
//  4. Regression: Bestehende init-Garantien greifen weiter (db.version,
//     Pflicht-Stores, dbVersionPolicy) — Race-Auflösung ist additiv,
//     bricht das Verhalten von außen nicht.

import "fake-indexeddb/auto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

function loadStorageModule() {
  delete globalThis.SbkimStorage;
  const src = readFileSync(resolve(repoRoot, "src/modules/01_storage.js"), "utf8");
  new Function("global", "window", "globalThis", "console", "indexedDB", "navigator", src)(
    globalThis, globalThis, globalThis, console, globalThis.indexedDB, globalThis.navigator || {}
  );
  return globalThis.SbkimStorage;
}

function deleteDb(name) {
  return new Promise((res) => {
    const req = globalThis.indexedDB.deleteDatabase(name);
    req.onsuccess = () => res();
    req.onerror = () => res();
    req.onblocked = () => res();
  });
}

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

async function run() {
  // ---- Probe 1: openProbe-Connection trägt onversionchange-Handler ----
  await deleteDb("sbkim_race_p1");
  let S = loadStorageModule();
  await S.init({ dbSuffix: "race_p1" });
  // Indirekter Beweis: ein zweiter ensureStore-Bump aus der frisch
  // init'ten DB läuft durch, weil sowohl die alte Verbindung als auch
  // die Probe-Connection den Versions-Change-Handler erhalten haben.
  await S.ensureStore("sbkim_test_race_1");
  await S.ensureStore("sbkim_test_race_2");
  const versionAfter = S._meta.dbVersion;
  record(
    "Probe 1: zwei ensureStore-Bumps ohne Versions-Bump-Block",
    "db.version >= 6 (4 init + 2 Bumps)",
    String(versionAfter),
    versionAfter >= 6
  );

  // ---- Probe 2: closeConnectionAndWait Timeout-Fallback ----
  // fake-indexeddb feuert onclose nicht für normalen close() — der
  // 50-ms-Timeout-Fallback muss greifen. Wir testen indirekt: nach
  // einer ensureStore-Folge sind beide Stores in objectStoreNames
  // sichtbar; wäre der Timeout-Fallback nicht da, hätte der Helper
  // hängen müssen.
  await deleteDb("sbkim_race_p2");
  S = loadStorageModule();
  await S.init({ dbSuffix: "race_p2" });
  const t0 = Date.now();
  await S.ensureStore("sbkim_test_p2_a");
  const t1 = Date.now();
  await S.ensureStore("sbkim_test_p2_b");
  const t2 = Date.now();
  record(
    "Probe 2: ensureStore mit close-wait abgeschlossen (Timeout-Fallback)",
    "beide Bumps grün, jede Sitzung < 5 s",
    "1." + (t1 - t0) + " ms, 2." + (t2 - t1) + " ms",
    (t1 - t0) < 5000 && (t2 - t1) < 5000
  );

  // ---- Probe 3: Wiederholter init() → ensureStore → Modul-Re-Load ----
  // Klaus' Sichttest-Sequenz (Panel 06 Setup ruft ensureStore
  // wiederholt — der Race-Bug aus dem Brief manifestiert sich gerade
  // hier). Wir laden das Modul mehrfach neu (Modul-Re-Load simuliert
  // den manual_check.html-Modul-Wechsel) und stellen sicher, dass kein
  // Aufruf in 'Versions-Bump blockiert' endet.
  await deleteDb("sbkim_race_p3");
  let lastVersion = 0;
  let raceError = null;
  try {
    for (let i = 0; i < 3; i++) {
      S = loadStorageModule();
      await S.init({ dbSuffix: "race_p3" });
      await S.ensureStore("sbkim_test_p3_round_" + i);
      lastVersion = S._meta.dbVersion;
    }
  } catch (e) {
    raceError = e;
  }
  record(
    "Probe 3: drei init()→ensureStore-Zyklen ohne EnsureStoreError",
    "kein Throw, db.version >= 7",
    raceError ? "Throw: " + raceError.name + "/" + raceError.message.slice(0, 80) : "OK, version=" + lastVersion,
    !raceError && lastVersion >= 7
  );

  // ---- Probe 4: Regression — bestehende Garantien greifen ----
  await deleteDb("sbkim_race_p4");
  S = loadStorageModule();
  await S.init({ dbSuffix: "race_p4" });
  record(
    "Probe 4 Regression: db.version === 4 auf frischer DB",
    "4",
    String(S._meta.dbVersion),
    S._meta.dbVersion === 4
  );
  record(
    "Probe 4 Regression: _meta.dbVersionPolicy",
    '"fail-soft-min-schema"',
    JSON.stringify(S._meta.dbVersionPolicy),
    S._meta.dbVersionPolicy === "fail-soft-min-schema"
  );
  const v1Stores = ["sbkim_keys","sbkim_spore","sbkim_siblings","sbkim_anastomosis_log","sbkim_legacy_inbox","sbkim_doku_meta","sbkim_hetero_inbox","sbkim_hetero_outbox"];
  const knownAfter = S._meta.knownStores;
  const missing4 = v1Stores.filter(s => knownAfter.indexOf(s) === -1);
  record(
    "Probe 4 Regression: alle 8 Pflicht-Stores vorhanden",
    "alle 8",
    missing4.length === 0 ? "alle 8" : "fehlend: " + missing4.join(","),
    missing4.length === 0
  );

  // Selbstcheck-Hinweis im Test: closeConnectionAndWait ist intern;
  // wir prüfen den indirekten Beweis über das beobachtbare Verhalten.
}

run().then(() => {
  let allOk = true;
  console.log("\n=== Pflege Modul 01 Versions-Bump-Race in openProbe Smoke-Test ===");
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
