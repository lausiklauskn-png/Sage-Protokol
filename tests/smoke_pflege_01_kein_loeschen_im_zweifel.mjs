// Headless smoke test — Modul 01 Härtung „Löschen nur bei zweifelsfreier Leere".
// Run: `npm install --no-save fake-indexeddb` dann
//   node tests/smoke_pflege_01_kein_loeschen_im_zweifel.mjs
//
// Reproduziert Klaus' Über-Nacht-Identitätsverlust (2026-07-29 → 07-30):
// Die Selbst-Heilung von Modul 01 löscht eine DB, die sie für „identitäts-leeren
// Schrott" hält (fehlender Store sbkim_keys). Fährt ein ANDERES Fenster derselben
// Origin gleichzeitig einen Schema-Umbau, ist `objectStoreNames` transient
// UNVOLLSTÄNDIG — die Prüfung urteilt dann fälschlich „leer" und löscht eine DB,
// in der die Identität sehr wohl liegt.
//
// Das ist NICHT harmlos: `indexedDB.deleteDatabase()` ist unumkehrbar und wirkt
// bei `onblocked` sogar VERZÖGERT — die Löschung bleibt vorgemerkt und greift,
// sobald die letzte Verbindung fällt (Tab schläft über Nacht ein). Genau so
// verschwand die Identität, ohne dass ein Fehler sichtbar wurde.
//
// Härtung: eine ZWEITE, unabhängige Gegenprobe muss das Urteil bestätigen.
// Widerspricht sie → NICHT löschen, ehrlich ablehnen.
//
// Vier Proben:
//  1. Gegenprobe widerspricht → init() lehnt ehrlich ab (kein stiller Erfolg).
//  2. Die Identität ist NACH dem abgelehnten init NOCH DA (der Kern: kein
//     Datenverlust). Ohne die Härtung wäre die DB hier gelöscht.
//  3. Der Store sbkim_keys existiert weiterhin (DB nicht neu aufgebaut).
//  4. Gegenprobe (Ehrlichkeit der Härtung): ist die DB WIRKLICH identitäts-leer,
//     heilt sie sich weiterhin selbst — die Härtung blockiert den guten Fall nicht.

import "fake-indexeddb/auto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const IDENTITY_STORE = "sbkim_keys";

function loadStorageModule() {
  delete globalThis.SbkimStorage;
  const src = readFileSync(resolve(repoRoot, "src/modules/01_storage.js"), "utf8");
  new Function("global", "window", "globalThis", "console", "indexedDB", "navigator", src)(
    globalThis, globalThis, globalThis, console, globalThis.indexedDB, globalThis.navigator || {},
  );
  return globalThis.SbkimStorage;
}

// --- Race-Sabotage: die ERSTE Frage nach sbkim_keys lügt („fehlt"), danach
// wird die Wahrheit gesagt. Genau das Bild eines parallelen Schema-Umbaus:
// checkRequiredStores sieht den Store nicht, die Gegenprobe sieht ihn.
let lieOnceAboutIdentityStore = false;
function installRaceLie(listProto) {
  const orig = listProto.contains;
  listProto.contains = function (name) {
    if (lieOnceAboutIdentityStore && name === IDENTITY_STORE) {
      lieOnceAboutIdentityStore = false;   // nur EINMAL lügen
      return false;
    }
    return orig.call(this, name);
  };
  return () => { listProto.contains = orig; };
}

// Rohes Lesen ohne Modul 01 — beweist den DB-Zustand unabhängig.
function rawInspect(name) {
  return new Promise((res) => {
    const req = globalThis.indexedDB.open(name);
    req.onsuccess = () => {
      const db = req.result;
      const hasStore = db.objectStoreNames.contains(IDENTITY_STORE);
      if (!hasStore) { db.close(); return res({ hasStore: false, value: null }); }
      const tx = db.transaction(IDENTITY_STORE, "readonly");
      const g = tx.objectStore(IDENTITY_STORE).get("probe");
      g.onsuccess = () => { const v = g.result; db.close(); res({ hasStore: true, value: v || null }); };
      g.onerror = () => { db.close(); res({ hasStore: true, value: null }); };
    };
    req.onerror = () => res({ hasStore: false, value: null });
  });
}

function synthDb(name, version, stores) {
  return new Promise((res, rej) => {
    const req = globalThis.indexedDB.open(name, version);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of stores) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
    };
    req.onsuccess = () => { req.result.close(); res(); };
    req.onerror = () => rej(req.error);
  });
}

const results = [];
const record = (probe, exp, act, ok) => results.push({ probe, exp, act, ok });

async function run() {
  // ---- Aufbau: gesunde DB mit Identität ----------------------------------
  const S1 = loadStorageModule();
  await S1.init();
  await S1.put(IDENTITY_STORE, "probe", { keyId: "probe", privateKey: "GEHEIM", marker: 1 });
  const before = await rawInspect("sbkim");
  if (!before.hasStore || !before.value) {
    console.error("Aufbau fehlgeschlagen — Identität nicht geschrieben."); process.exit(1);
  }

  // ---- Probe 1+2+3: erste Probe irrt, Gegenprobe widerspricht -------------
  // objectStoreNames ist bei fake-indexeddb eine FakeDOMStringList-Instanz.
  const listProto = Object.getPrototypeOf(before ? globalThis.indexedDB : {});
  // Prototyp der konkreten Liste holen (robust gegen Implementierungsdetails).
  const probeDb = await new Promise((res) => {
    const r = globalThis.indexedDB.open("sbkim");
    r.onsuccess = () => res(r.result);
  });
  const namesProto = Object.getPrototypeOf(probeDb.objectStoreNames);
  probeDb.close();
  const restore = installRaceLie(namesProto);

  const S2 = loadStorageModule();
  lieOnceAboutIdentityStore = true;
  let threw = null;
  try { await S2.init(); } catch (e) { threw = e; }
  restore();
  lieOnceAboutIdentityStore = false;

  record("Gegenprobe widerspricht → init() lehnt ehrlich ab (kein stiller Erfolg)",
    "Reject mit 'Selbst-Heilung abgebrochen'",
    threw ? String(threw.message).slice(0, 60) + "…" : "KEIN Reject — still durchgelaufen",
    !!threw && /Selbst-Heilung abgebrochen/.test(String(threw.message)));

  const after = await rawInspect("sbkim");
  record("KERN: die Identität ist nach dem abgelehnten init NOCH DA",
    "privateKey GEHEIM vorhanden",
    after.value ? ("vorhanden: " + JSON.stringify(after.value)) : "WEG — Datenverlust!",
    !!after.value && after.value.privateKey === "GEHEIM");
  record("DB wurde NICHT neu aufgebaut (Store sbkim_keys existiert weiter)",
    "true", String(after.hasStore), after.hasStore === true);

  // ---- Probe 4: echter Leer-Fall heilt weiterhin selbst -------------------
  // v=10-DB OHNE sbkim_keys → zweifelsfrei identitäts-leer → Selbst-Heilung darf greifen.
  await new Promise((res) => { const r = globalThis.indexedDB.deleteDatabase("sbkim_leer"); r.onsuccess = res; r.onerror = res; r.onblocked = res; });
  await synthDb("sbkim_leer", 10, ["sbkim_spores", "sbkim_meta"]);   // sbkim_keys FEHLT wirklich
  const S3 = loadStorageModule();
  let healed = null, healErr = null;
  try { healed = await S3.init({ dbSuffix: "leer" }); } catch (e) { healErr = e; }
  record("echter Leer-Fall heilt weiterhin selbst (Härtung blockiert den guten Fall nicht)",
    "init resolves, sbkim_keys angelegt",
    healErr ? ("Reject: " + String(healErr.message).slice(0, 50)) : ("ok, v=" + (healed && healed.version)),
    !healErr && !!healed && healed.objectStoreNames.contains(IDENTITY_STORE));

  // ---- Bericht ----
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
