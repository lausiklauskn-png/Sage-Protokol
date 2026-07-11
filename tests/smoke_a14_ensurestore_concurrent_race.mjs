// Headless smoke test — A14-Härtung „ensureStore-Race" (2026-07-11).
// Run with `node tests/smoke_a14_ensurestore_concurrent_race.mjs` after
// `npm install --no-save fake-indexeddb`.
//
// Deckt den vorbestehenden, sporadischen Fehler
//   NotFoundError: One of the specified object stores was not found
// ab, der auftrat, wenn ZWEI ensureStore-Aufrufe GLEICHZEITIG liefen
// (z.B. Modul 05 `ensureSlotStores` neben Modul 07 Apoptose im selben
// Tick). Beide lasen dasselbe `db.version`, errechneten beide
// `db.version + 1` und öffneten beide `indexedDB.open(name, N)`. Der
// zweite Open traf die schon auf N gehobene DB, feuerte KEIN
// `onupgradeneeded`, resolved aber trotzdem — sein Store wurde nie
// angelegt, KNOWN_STORES behauptete ihn dennoch, der nächste Zugriff warf
// NotFoundError.
//
// Die A14-Härtung serialisiert die Versions-Bump-Kette (`ensureChain` in
// Modul 01), sodass jeder ensureStore-Lauf ein frisches `db.version`
// sieht. Rein interne Serialisierung — die öffentliche Signatur
// (Promise<void>) bleibt unberührt.
//
// Vier Proben:
//  1. Zwei gleichzeitige ensureStore (Promise.all) — beide Stores real
//     angelegt, Werte round-trippen, KNOWN_STORES stimmt mit der DB überein.
//  2. Drei gleichzeitige ensureStore — härterer Andrang, alle drei da.
//  3. ensureSlotStores-Muster (zwei Stores) doppelt gleichzeitig — genau
//     der Modul-05-Pfad, der den Fehler in der Praxis auslöste.
//  4. Kette erholt sich zwischen zwei Wellen (kein Ketten-Verhängen):
//     eine zweite gleichzeitige Welle nach der ersten läuft ebenfalls durch.

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

// Prüft, dass jeder Store real in der DB liegt UND getippte Werte
// round-trippen. Wirft NIE — fängt NotFoundError ein und meldet ihn.
async function verifyStores(S, names) {
  const problems = [];
  const known = S._meta.knownStores;
  for (const n of names) {
    if (known.indexOf(n) === -1) { problems.push("KNOWN_STORES fehlt " + n); continue; }
    try {
      await S.put(n, "k", n);
      const v = await S.get(n, "k");
      if (v !== n) problems.push("Wert falsch in " + n + " (=" + v + ")");
    } catch (e) {
      problems.push(e.name + " auf " + n);
    }
  }
  return problems;
}

async function run() {
  // ---- Probe 1: zwei gleichzeitige ensureStore ----
  await deleteDb("sbkim_a14_p1");
  let S = loadStorageModule();
  await S.init({ dbSuffix: "a14_p1" });
  const p1Names = ["sbkim_a14_p1_a", "sbkim_a14_p1_b"];
  await Promise.all(p1Names.map((n) => S.ensureStore(n)));
  const p1Problems = await verifyStores(S, p1Names);
  record(
    "Probe 1: zwei gleichzeitige ensureStore → beide Stores real angelegt",
    "keine Probleme, db.version 6",
    (p1Problems.length ? p1Problems.join("; ") : "ok") + ", version=" + S._meta.dbVersion,
    p1Problems.length === 0 && S._meta.dbVersion === 6
  );

  // ---- Probe 2: drei gleichzeitige ensureStore ----
  await deleteDb("sbkim_a14_p2");
  S = loadStorageModule();
  await S.init({ dbSuffix: "a14_p2" });
  const p2Names = ["sbkim_a14_p2_a", "sbkim_a14_p2_b", "sbkim_a14_p2_c"];
  await Promise.all(p2Names.map((n) => S.ensureStore(n)));
  const p2Problems = await verifyStores(S, p2Names);
  record(
    "Probe 2: drei gleichzeitige ensureStore → alle drei real angelegt",
    "keine Probleme, db.version 7",
    (p2Problems.length ? p2Problems.join("; ") : "ok") + ", version=" + S._meta.dbVersion,
    p2Problems.length === 0 && S._meta.dbVersion === 7
  );

  // ---- Probe 3: zwei ensureSlotStores-Muster gleichzeitig ----
  // Genau der Modul-05-Pfad: `ensureSlotStores` legt zwei Stores an
  // (siblings + log). Zwei Slots gleichzeitig = vier ensureStore-Läufe,
  // die sich vor der Härtung ins Gehege kamen.
  await deleteDb("sbkim_a14_p3");
  S = loadStorageModule();
  await S.init({ dbSuffix: "a14_p3" });
  async function ensureSlotStoresLike(slot) {
    await S.ensureStore("sbkim_siblings_" + slot);
    await S.ensureStore("sbkim_anastomosis_log_" + slot);
  }
  await Promise.all([ensureSlotStoresLike("slotx"), ensureSlotStoresLike("sloty")]);
  const p3Names = [
    "sbkim_siblings_slotx", "sbkim_anastomosis_log_slotx",
    "sbkim_siblings_sloty", "sbkim_anastomosis_log_sloty",
  ];
  const p3Problems = await verifyStores(S, p3Names);
  record(
    "Probe 3: zwei ensureSlotStores gleichzeitig → alle vier Stores real",
    "keine Probleme (Modul-05-Pfad)",
    p3Problems.length ? p3Problems.join("; ") : "ok",
    p3Problems.length === 0
  );

  // ---- Probe 4: Kette erholt sich zwischen zwei Wellen ----
  await deleteDb("sbkim_a14_p4");
  S = loadStorageModule();
  await S.init({ dbSuffix: "a14_p4" });
  await Promise.all([
    S.ensureStore("sbkim_a14_p4_w1a"),
    S.ensureStore("sbkim_a14_p4_w1b"),
  ]);
  // Zweite Welle NACH der ersten — die Kette darf nicht verhängt sein.
  await Promise.all([
    S.ensureStore("sbkim_a14_p4_w2a"),
    S.ensureStore("sbkim_a14_p4_w2b"),
  ]);
  const p4Names = [
    "sbkim_a14_p4_w1a", "sbkim_a14_p4_w1b",
    "sbkim_a14_p4_w2a", "sbkim_a14_p4_w2b",
  ];
  const p4Problems = await verifyStores(S, p4Names);
  record(
    "Probe 4: zwei aufeinanderfolgende gleichzeitige Wellen → alle vier Stores",
    "keine Probleme (keine Ketten-Verhängung)",
    p4Problems.length ? p4Problems.join("; ") : "ok",
    p4Problems.length === 0
  );
}

run().then(() => {
  let allOk = true;
  console.log("\n=== A14 ensureStore-Race (gleichzeitige Aufrufe) Smoke-Test ===");
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
