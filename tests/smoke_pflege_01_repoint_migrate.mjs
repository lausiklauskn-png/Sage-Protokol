// Headless smoke — Härtung „Identitäts-Isolierung" (2026-07-11), Modul 01:
//   Teil 1 — init({dbSuffix}) Re-Point  (leer → sicher re-point,
//            mit-Identität → fail-fast, gleicher Suffix → idempotent)
//   Teil 2 — migrateIdentityFrom(oldDbName)  (kopiert, kein Überschreiben,
//            fail-soft bei fehlender/gleicher Quelle, sync-Wurf bei Bad-Arg)
//
// Läuft mit echtem fake-indexeddb (in-memory) — bewusst KEIN Mock, damit der
// echte IndexedDB-Pfad (Versions-Bump via ensureStore, count-Probe, raw-Kopie)
// getestet wird. Run: `node tests/smoke_pflege_01_repoint_migrate.mjs`
// (nach `npm install --no-save fake-indexeddb`).

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

// Seed-Helper: legt eine DB (Version 1) mit gegebenen Stores + Einträgen an.
function seedDb(name, entries) {
  const stores = Object.keys(entries);
  return new Promise((res, rej) => {
    const req = globalThis.indexedDB.open(name, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of stores) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
    };
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(stores, "readwrite");
      for (const s of stores) for (const { key, value } of entries[s]) tx.objectStore(s).put(value, key);
      tx.oncomplete = () => { db.close(); res(); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    };
    req.onerror = () => rej(req.error);
  });
}

let pass = 0, fail = 0;
function rec(name, exp, got, ok) {
  if (ok) { pass++; console.log("✓ " + name); }
  else { fail++; console.log("✗ " + name + "  (erwartet " + exp + ", bekam " + got + ")"); }
}

async function run() {
  // ============ Teil 1 — Re-Point ============

  // ---- Probe 1: leere DB (`sbkim`) → sicheres Re-Point auf Suffix ----
  await deleteDb("sbkim"); await deleteDb("sbkim_appx");
  let S = loadStorageModule();
  await S.init();                       // öffnet geteilten Topf `sbkim` (leer)
  rec("P1 — nach init() dbName == sbkim", "sbkim", S._meta.dbName, S._meta.dbName === "sbkim");
  await S.init({ dbSuffix: "appx" });   // abweichender Suffix, DB ist leer → re-point
  rec("P1 — Re-Point: dbName == sbkim_appx", "sbkim_appx", S._meta.dbName, S._meta.dbName === "sbkim_appx");
  // Re-gepointete DB ist voll benutzbar
  await S.put("sbkim_keys", "main", { priv: 1 });
  const backP1 = await S.get("sbkim_keys", "main");
  rec("P1 — re-gepointete DB nutzbar (put/get)", "1", backP1 && String(backP1.priv), backP1 && backP1.priv === 1);
  rec("P1 — _meta.dbSuffixRepointPolicy Anker", "empty-safe", S._meta.dbSuffixRepointPolicy, S._meta.dbSuffixRepointPolicy === "empty-safe");

  // ---- Probe 2: DB trägt Identität → fail-fast, kein Re-Point ----
  await deleteDb("sbkim_withid"); await deleteDb("sbkim_other");
  S = loadStorageModule();
  await S.init({ dbSuffix: "withid" });
  await S.put("sbkim_keys", "main", { priv: 2 });   // Identität da
  let err = null;
  try { await S.init({ dbSuffix: "other" }); } catch (e) { err = e; }
  rec("P2 — abweichender Suffix bei Identität → InvalidDbSuffixError", "InvalidDbSuffixError", err ? err.name : "(kein Throw)", err && err.name === "InvalidDbSuffixError");
  rec("P2 — dbName UNVERÄNDERT (kein Re-Point)", "sbkim_withid", S._meta.dbName, S._meta.dbName === "sbkim_withid");

  // ---- Probe 3: gleicher Suffix → idempotent (byte-gleiches Verhalten) ----
  await deleteDb("sbkim_same");
  S = loadStorageModule();
  const p1 = S.init({ dbSuffix: "same" });
  const p2 = S.init({ dbSuffix: "same" });
  rec("P3 — zweiter init(gleicher Suffix) gibt dieselbe Promise", "identisch", p1 === p2 ? "identisch" : "verschieden", p1 === p2);
  await p2;
  rec("P3 — dbName == sbkim_same", "sbkim_same", S._meta.dbName, S._meta.dbName === "sbkim_same");

  // ---- Probe 4: kein Suffix, zweiter init() → idempotent ----
  await deleteDb("sbkim");
  S = loadStorageModule();
  await S.init();
  await S.init();   // darf NICHT werfen
  rec("P4 — init()/init() ohne Suffix idempotent", "sbkim", S._meta.dbName, S._meta.dbName === "sbkim");

  // ============ Teil 2 — migrateIdentityFrom ============

  // ---- Probe 5: kopiert Identitäts-Stores aus `sbkim` in die eigene Schublade ----
  await deleteDb("sbkim"); await deleteDb("sbkim_target");
  await seedDb("sbkim", {
    sbkim_keys: [{ key: "main", value: { keyId: "main", priv: "PK" } }],
    sbkim_spore: [{ key: "main", value: { id: "node-alt" } }],
    sbkim_siblings_main: [{ key: "peer1", value: { x: 1 } }],
  });
  S = loadStorageModule();
  await S.init({ dbSuffix: "target" });   // leere Ziel-Schublade
  const sum5 = await S.migrateIdentityFrom("sbkim");
  rec("P5 — Migration ok:true", "true", String(sum5.ok), sum5.ok === true);
  rec("P5 — copied == 3 (keys+spore+siblings)", "3", String(sum5.copied), sum5.copied === 3);
  const k5 = await S.get("sbkim_keys", "main");
  rec("P5 — sbkim_keys.main kopiert", "PK", k5 && k5.priv, k5 && k5.priv === "PK");
  const sp5 = await S.get("sbkim_spore", "main");
  rec("P5 — sbkim_spore.main kopiert", "node-alt", sp5 && sp5.id, sp5 && sp5.id === "node-alt");
  const sib5 = await S.get("sbkim_siblings_main", "peer1");
  rec("P5 — dynamischer Store sbkim_siblings_main via ensureStore kopiert", "1", sib5 && String(sib5.x), sib5 && sib5.x === 1);

  // ---- Probe 6: kein Überschreiben einer schon vorhandenen Identität ----
  await deleteDb("sbkim"); await deleteDb("sbkim_own");
  await seedDb("sbkim", { sbkim_keys: [{ key: "main", value: { priv: "ALT" } }] });
  S = loadStorageModule();
  await S.init({ dbSuffix: "own" });
  await S.put("sbkim_keys", "main", { priv: "EIGEN" });   // eigene Identität da
  const sum6 = await S.migrateIdentityFrom("sbkim");
  const k6 = await S.get("sbkim_keys", "main");
  rec("P6 — vorhandener Schlüssel NICHT überschrieben", "EIGEN", k6 && k6.priv, k6 && k6.priv === "EIGEN");
  rec("P6 — skippedExisting >= 1", ">=1", String(sum6.skippedExisting), sum6.skippedExisting >= 1);
  rec("P6 — copied == 0", "0", String(sum6.copied), sum6.copied === 0);

  // ---- Probe 7: fehlende Quell-DB → fail-soft, kein Throw ----
  await deleteDb("sbkim_target2"); await deleteDb("sbkim_nonexistent_src");
  S = loadStorageModule();
  await S.init({ dbSuffix: "target2" });
  let sum7 = null, threw7 = false;
  try { sum7 = await S.migrateIdentityFrom("sbkim_nonexistent_src"); } catch (e) { threw7 = true; }
  rec("P7 — fehlende Quelle wirft NICHT", "kein Throw", threw7 ? "geworfen" : "kein Throw", threw7 === false);
  rec("P7 — ok:true, copied 0", "ok, 0", sum7 ? sum7.ok + "," + sum7.copied : "(null)", sum7 && sum7.ok === true && sum7.copied === 0);

  // ---- Probe 8: Quelle == Ziel → nichts zu tun ----
  await deleteDb("sbkim_selftarget");
  S = loadStorageModule();
  await S.init({ dbSuffix: "selftarget" });
  const sum8 = await S.migrateIdentityFrom("sbkim_selftarget");
  rec("P8 — Quelle==Ziel: ok:true, copied 0", "ok, 0", sum8.ok + "," + sum8.copied, sum8.ok === true && sum8.copied === 0);

  // ---- Probe 9: Bad-Arg → synchroner Wurf (Programmier-Fehler) ----
  S = loadStorageModule();
  let syncThrew = null;
  try { S.migrateIdentityFrom(123); } catch (e) { syncThrew = e; }
  rec("P9 — migrateIdentityFrom(123) wirft synchron", "InvalidDbSuffixError", syncThrew ? syncThrew.name : "(kein Throw)", syncThrew && syncThrew.name === "InvalidDbSuffixError");
}

run().then(() => {
  console.log("\n=== Härtung 01 Re-Point + Migration Smoke-Test ===");
  console.log("Total: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
  if (fail > 0) process.exit(1);
}).catch((err) => {
  console.error("Smoke-Test scheiterte mit Exception:", err);
  process.exit(2);
});
