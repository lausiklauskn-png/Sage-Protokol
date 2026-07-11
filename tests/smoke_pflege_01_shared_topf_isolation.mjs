// Headless smoke — Härtung „Identitäts-Isolierung: Doppel-Laden + globales
// App-Suffix" (2026-07-11, Auslöser Klaus' Live-Sichttest, wo SB-KIMTool-Point
// und family-project sich EINE Identität über den geteilten Topf `sbkim`
// teilten). Beweist zwei Dinge:
//
//   1) DOPPEL-LADEN ist idempotent: lädt/läuft das Modul ein zweites Mal, wird
//      der bestehende State NICHT zurückgesetzt (kein Verlust des dbSuffix).
//      (Vorher: zweites Laden -> frische IIFE -> dbNameInUse zurück auf Default
//       -> App fiel auf den geteilten Topf `sbkim` zurück.)
//   2) GLOBALES APP-SUFFIX bestimmt die Default-Schublade: setzt die App früh
//      `window.SBKIM_DB_SUFFIX="<suffix>"`, landet JEDER Storage-Zugriff in
//      `sbkim_<suffix>` — auch OHNE explizites init({dbSuffix}) und
//      reihenfolge-unabhängig. So kann keine App mehr im geteilten `sbkim`
//      schreiben und die anderen „erben" die fremde Identität nicht mehr.
//
// Läuft mit echtem fake-indexeddb (in-memory). Run:
//   node tests/smoke_pflege_01_shared_topf_isolation.mjs
// (nach `npm install --no-save fake-indexeddb`).

import "fake-indexeddb/auto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const SRC = readFileSync(resolve(repoRoot, "src/modules/01_storage.js"), "utf8");

// Führt die Modul-IIFE gegen ein gegebenes `global`-Objekt aus (wie ein
// <script>-Tag im Browser). Setzt window.SbkimStorage NICHT vorher zurück —
// so testen wir das echte Doppel-Lade-Verhalten.
function runModule(global) {
  new Function("global", "window", "globalThis", "console", "indexedDB", "navigator",
    SRC + "\n//# sourceURL=01_storage.js")(
    global, global, global, console, globalThis.indexedDB, globalThis.navigator || {}
  );
}

const results = [];
function record(probe, expected, actual, ok) { results.push({ probe, expected, actual, ok }); }

// Ein Browser-„window" simulieren: ein Objekt, auf dem das Modul registriert.
function makeWindow(suffix) {
  const w = {};
  if (suffix !== undefined) w.SBKIM_DB_SUFFIX = suffix;
  return w;
}

async function run() {
  // ---- Probe 1: globales Suffix -> Default-Schublade sbkim_<suffix> ----
  const wA = makeWindow("appa");
  runModule(wA);
  record(
    "Probe 1: window.SBKIM_DB_SUFFIX='appa' -> Default-DB 'sbkim_appa'",
    "sbkim_appa",
    wA.SbkimStorage && wA.SbkimStorage._meta ? wA.SbkimStorage._meta.dbNameDefault : "(kein _meta)",
    !!(wA.SbkimStorage && wA.SbkimStorage._meta && wA.SbkimStorage._meta.dbNameDefault === "sbkim_appa")
  );

  // ---- Probe 2: init() OHNE explizites Suffix nutzt die eigene Schublade ----
  await wA.SbkimStorage.init(); // KEIN dbSuffix -> muss trotzdem sbkim_appa sein
  record(
    "Probe 2: init() ohne dbSuffix öffnet die eigene Schublade (nicht 'sbkim')",
    "sbkim_appa",
    wA.SbkimStorage._meta.dbName,
    wA.SbkimStorage._meta.dbName === "sbkim_appa"
  );

  // ---- Probe 3: Doppel-Laden ist No-Op (Guard) — State bleibt erhalten ----
  const firstApi = wA.SbkimStorage;
  const dbNameBefore = wA.SbkimStorage._meta.dbName;
  runModule(wA); // ZWEITES Laden auf demselben window
  record(
    "Probe 3: zweites Laden setzt NICHT zurück (gleiche Instanz)",
    "identische Instanz",
    wA.SbkimStorage === firstApi ? "identische Instanz" : "NEU/zurückgesetzt",
    wA.SbkimStorage === firstApi
  );
  record(
    "Probe 3: dbName nach Doppel-Laden unverändert",
    dbNameBefore,
    wA.SbkimStorage._meta.dbName,
    wA.SbkimStorage._meta.dbName === dbNameBefore
  );

  // ---- Probe 4: zwei Apps auf EINER Origin -> GETRENNTE Schubladen ----
  // App A schreibt eine „Identität" in ihre Schublade; App B (anderes Suffix)
  // darf sie NICHT sehen (kein geteilter Topf).
  await wA.SbkimStorage.init();
  await wA.SbkimStorage.ensureStore("sbkim_keys");
  await wA.SbkimStorage.put("sbkim_keys", "id", { nodeId: "APP-A-IDENTITY" });

  const wB = makeWindow("appb");
  runModule(wB);
  await wB.SbkimStorage.init(); // ohne Suffix -> sbkim_appb
  record(
    "Probe 4: App B Default-DB 'sbkim_appb' (getrennt von App A)",
    "sbkim_appb",
    wB.SbkimStorage._meta.dbName,
    wB.SbkimStorage._meta.dbName === "sbkim_appb"
  );
  let leaked = null;
  try {
    await wB.SbkimStorage.ensureStore("sbkim_keys");
    leaked = await wB.SbkimStorage.get("sbkim_keys", "id");
  } catch (_e) { leaked = "(store leer/fehlt)"; }
  record(
    "Probe 4: App B sieht App-A-Identität NICHT (keine Kollision)",
    "keine fremde Identität",
    leaked && leaked.nodeId ? ("GELEAKT: " + leaked.nodeId) : "keine fremde Identität",
    !(leaked && leaked.nodeId === "APP-A-IDENTITY")
  );

  // ---- Probe 5: ohne globales Suffix bleibt Default 'sbkim' (rückwärtskompat.) ----
  const wC = makeWindow(); // kein SBKIM_DB_SUFFIX
  runModule(wC);
  record(
    "Probe 5: ohne SBKIM_DB_SUFFIX bleibt Default 'sbkim' (rückwärtskompatibel)",
    "sbkim",
    wC.SbkimStorage._meta.dbNameDefault,
    wC.SbkimStorage._meta.dbNameDefault === "sbkim"
  );
}

run().then(() => {
  let allOk = true;
  console.log("\n=== Modul 01 Shared-Topf-Isolierung (Doppel-Laden + globales App-Suffix) ===");
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} ${r.probe}\n   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
    if (!r.ok) allOk = false;
  }
  console.log(`\nTotal: ${results.length} Proben, ${results.filter(r => r.ok).length} grün, ${results.filter(r => !r.ok).length} rot.`);
  if (!allOk) process.exit(1);
}).catch((err) => {
  console.error("Smoke-Test scheiterte mit Exception:", err);
  process.exit(2);
});
