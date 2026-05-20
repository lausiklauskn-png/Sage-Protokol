// Headless smoke test for Bau 08.Y — slot-spezifische Outbox in Modul 08
// (UI-Demo). Run with `node tests/smoke_bau08y_slot_spezifische_outbox.mjs`
// after `npm install --no-save fake-indexeddb` (provides IndexedDB
// shim). WebCrypto comes from node:crypto. Drei Proben:
//   1) Default-Slot — addOutboxAnchor schreibt in sbkim_hetero_outbox_main;
//      listOutbox liest aus sbkim_hetero_outbox_main.
//   2) Sekundär-Slot — getOrCreateIdentity('test_08y') + setActiveIdentity,
//      Modul 08 re-init (via Modul-Re-Load); addOutboxAnchor schreibt in
//      sbkim_hetero_outbox_test_08y.
//   3) setSiblingHeteroOptIn — Pseudo-Sibling in sbkim_siblings_main,
//      setSiblingHeteroOptIn liest + schreibt mit heterokaryosisOptIn-Flag
//      in sbkim_siblings_main (nicht im nicht-suffixed sbkim_siblings).

import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// Wire up window-likes for the IIFE modules.
globalThis.window = globalThis;
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, writable: false, configurable: true });
}

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob",
                "TextEncoder", "TextDecoder", "indexedDB", src
    )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB);
}

loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");
loadModule("src/modules/08_ui_demo.js");

const SbkimStorage = globalThis.SbkimStorage;
const SbkimSpore = globalThis.SbkimSpore;
const SbkimUiDemo = globalThis.SbkimUiDemo;

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

function makeVector(seed) {
  const v = new Array(384);
  for (let i = 0; i < 384; i++) v[i] = ((i + seed) % 13 - 6) / 13;
  return v;
}

async function reloadModule08() {
  // Bau 08.Y: Modul 08 ist storage-only, hat aber einen `ready`-Flag und
  // einen `activeSlotKey`-Cache. Wir simulieren einen Tab-Reload, indem
  // wir das Modul-Skript neu laden — das überschreibt die IIFE-Closure
  // mit frischem State (ready=false, activeSlotKey=null).
  delete globalThis.SbkimUiDemo;
  loadModule("src/modules/08_ui_demo.js");
  return globalThis.SbkimUiDemo;
}

async function run() {
  // 0) Modul exports + self-check
  const fns = ["init","listOutbox","addOutboxAnchor","removeOutboxAnchor","setSiblingHeteroOptIn"];
  const missing = fns.filter(f => typeof SbkimUiDemo[f] !== "function");
  record("Exports — fünf Funktionen", "alle vorhanden",
         missing.length === 0 ? "alle 5 vorhanden" : "fehlend: " + missing.join(","),
         missing.length === 0);
  record("Errors — sechs Klassen exportiert", "alle function",
         ["UiDemoDependenciesError","InvalidAnchorLabelError","InvalidAnchorVectorError",
          "OutboxFullError","UnknownSiblingError","InvalidOptInArgError"]
            .map(n => typeof SbkimUiDemo[n]).join("/"),
         ["UiDemoDependenciesError","InvalidAnchorLabelError","InvalidAnchorVectorError",
          "OutboxFullError","UnknownSiblingError","InvalidOptInArgError"]
            .every(n => typeof SbkimUiDemo[n] === "function"));
  record("_meta.outboxStoreBase", "sbkim_hetero_outbox", SbkimUiDemo._meta.outboxStoreBase,
         SbkimUiDemo._meta.outboxStoreBase === "sbkim_hetero_outbox");
  record("_meta.siblingsStoreBase", "sbkim_siblings", SbkimUiDemo._meta.siblingsStoreBase,
         SbkimUiDemo._meta.siblingsStoreBase === "sbkim_siblings");
  record("_meta.activeSlotKey vor init", "null", String(SbkimUiDemo._meta.activeSlotKey),
         SbkimUiDemo._meta.activeSlotKey === null);

  // ====================================================================
  // Probe 1 — Default-Slot ("main"): addOutboxAnchor schreibt in
  // sbkim_hetero_outbox_main; listOutbox liest aus sbkim_hetero_outbox_main.
  // ====================================================================

  await SbkimUiDemo.init();
  record("Probe 1 — init() resolves", "void", "void", true);
  record("Probe 1 — activeSlotKey nach init", "main",
         String(SbkimUiDemo._meta.activeSlotKey),
         SbkimUiDemo._meta.activeSlotKey === "main");

  await SbkimUiDemo._clearOutbox();
  await SbkimUiDemo.addOutboxAnchor("Hefeteig", makeVector(1));

  // Direkter Storage-Read auf den slot-suffixed Store
  const directMainRows = await SbkimStorage.all("sbkim_hetero_outbox_main");
  record("Probe 1 — sbkim_hetero_outbox_main hat Eintrag", "1 Zeile",
         String(directMainRows.length), directMainRows.length === 1);
  record("Probe 1 — Eintrag-Label", "Hefeteig",
         directMainRows[0] && directMainRows[0].value && directMainRows[0].value.label,
         directMainRows[0] && directMainRows[0].value && directMainRows[0].value.label === "Hefeteig");

  // listOutbox muss denselben Eintrag liefern
  const list1 = await SbkimUiDemo.listOutbox();
  record("Probe 1 — listOutbox liefert Eintrag", "[Hefeteig]",
         JSON.stringify(list1.map(e => e.label)),
         list1.length === 1 && list1[0].label === "Hefeteig");

  // Verifikation: der nicht-suffixed Store darf NICHT geschrieben sein.
  // (Bau 01.Y deklariert sbkim_siblings/sbkim_hetero_outbox als
  // Pflicht-Stores in v=1/v=3 — sie existieren beim init aus dem
  // Migrations-Pfad, sind aber leer.)
  let nonSuffixedMissing = false;
  try {
    const nonSuffixedRows = await SbkimStorage.all("sbkim_hetero_outbox");
    record("Probe 1 — non-suffixed sbkim_hetero_outbox leer", "0 Zeilen",
           String(nonSuffixedRows.length), nonSuffixedRows.length === 0);
  } catch (e) {
    // Modul 01 wirft UnknownStoreError, wenn der Store gar nicht existiert —
    // das ist ein noch besserer Beleg, dass Modul 08 nichts dort
    // angelegt hat.
    nonSuffixedMissing = e && e.name === "UnknownStoreError";
    record("Probe 1 — non-suffixed sbkim_hetero_outbox leer", "0 Zeilen",
           "UnknownStoreError (Store existiert nicht)", true);
  }

  // ====================================================================
  // Probe 2 — Sekundär-Slot "test_08y": neue Persona anlegen, aktiv setzen,
  // Modul 08 re-laden (simuliert Tab-Reload), addOutboxAnchor schreibt
  // in sbkim_hetero_outbox_test_08y.
  // ====================================================================

  await SbkimSpore.getOrCreateIdentity("test_08y");
  await SbkimSpore.setActiveIdentity("test_08y");
  const activeAfterSwitch = await SbkimSpore.getActiveIdentityKey();
  record("Probe 2 — Sekundär-Persona angelegt + aktiv", "test_08y",
         activeAfterSwitch, activeAfterSwitch === "test_08y");

  // Modul 08 re-laden — frischer Closure-State, neuer init() pickt
  // den neuen activeSlotKey auf.
  const SbkimUiDemo2 = await reloadModule08();
  await SbkimUiDemo2.init();
  record("Probe 2 — activeSlotKey nach Re-Init", "test_08y",
         String(SbkimUiDemo2._meta.activeSlotKey),
         SbkimUiDemo2._meta.activeSlotKey === "test_08y");

  await SbkimUiDemo2.addOutboxAnchor("Whisky-Sour", makeVector(7));
  const directTestRows = await SbkimStorage.all("sbkim_hetero_outbox_test_08y");
  record("Probe 2 — sbkim_hetero_outbox_test_08y hat Eintrag", "1 Zeile",
         String(directTestRows.length), directTestRows.length === 1);
  record("Probe 2 — Eintrag-Label im test_08y-Slot", "Whisky-Sour",
         directTestRows[0] && directTestRows[0].value && directTestRows[0].value.label,
         directTestRows[0] && directTestRows[0].value && directTestRows[0].value.label === "Whisky-Sour");

  // Der main-Slot bleibt unangetastet — Persona-Isolation
  // (INTERFACES § 9.2).
  const mainStillThere = await SbkimStorage.all("sbkim_hetero_outbox_main");
  record("Probe 2 — main-Slot unverändert (Persona-Isolation)", "1 Zeile (Hefeteig)",
         String(mainStillThere.length) + " (" +
           (mainStillThere[0] && mainStillThere[0].value && mainStillThere[0].value.label) + ")",
         mainStillThere.length === 1 &&
         mainStillThere[0].value && mainStillThere[0].value.label === "Hefeteig");

  // listOutbox liefert NUR den Eintrag aus dem aktiven Slot
  const list2 = await SbkimUiDemo2.listOutbox();
  record("Probe 2 — listOutbox liefert nur test_08y-Eintrag", "[Whisky-Sour]",
         JSON.stringify(list2.map(e => e.label)),
         list2.length === 1 && list2[0].label === "Whisky-Sour");

  // ====================================================================
  // Probe 3 — setSiblingHeteroOptIn: Pseudo-Sibling via
  // _addPseudoSibling in sbkim_siblings_main (zurück auf main),
  // setSiblingHeteroOptIn liest + schreibt mit
  // heterokaryosisOptIn-Flag in sbkim_siblings_main.
  // ====================================================================

  // Zurück auf main-Slot, frisches Modul 08 laden. Modul 08 init in
  // Probe 1 hat "main" nur als Default-Slot-Key gecached (Modul 08
  // ruft NICHT getOrCreateIdentity — storage-only), also legen wir
  // jetzt explizit eine Identität an, damit setActiveIdentity('main')
  // den Slot kennt.
  await SbkimSpore.getOrCreateIdentity("main");
  await SbkimSpore.setActiveIdentity("main");
  const SbkimUiDemo3 = await reloadModule08();
  await SbkimUiDemo3.init();
  record("Probe 3 — activeSlotKey zurück auf main", "main",
         String(SbkimUiDemo3._meta.activeSlotKey),
         SbkimUiDemo3._meta.activeSlotKey === "main");

  const PSEUDO_ID = "PSEUDO08Y-SIB-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  await SbkimUiDemo3._addPseudoSibling({
    nodeId: PSEUDO_ID,
    domain: "pseudo-08y.invalid",
    endpoint: "http://127.0.0.1:1/pseudo-08y/",
    pubKey: null,
    since: new Date(Date.now() - 1000).toISOString(),
  });

  // _addPseudoSibling muss in sbkim_siblings_main schreiben, NICHT
  // in das nicht-suffixed sbkim_siblings.
  const sibInSlot = await SbkimStorage.get("sbkim_siblings_main", PSEUDO_ID);
  record("Probe 3 — _addPseudoSibling schreibt in sbkim_siblings_main",
         "Eintrag mit nodeId",
         sibInSlot ? "vorhanden (nodeId=" + sibInSlot.nodeId + ")" : "fehlt",
         sibInSlot && sibInSlot.nodeId === PSEUDO_ID);

  let sibInNonSuffixed = undefined;
  try {
    sibInNonSuffixed = await SbkimStorage.get("sbkim_siblings", PSEUDO_ID);
  } catch (e) { /* UnknownStoreError ist OK */ }
  record("Probe 3 — _addPseudoSibling schreibt NICHT in sbkim_siblings (non-suffixed)",
         "undefined / UnknownStoreError",
         sibInNonSuffixed === undefined ? "undefined" : "vorhanden!",
         sibInNonSuffixed === undefined);

  // setSiblingHeteroOptIn auf true
  await SbkimUiDemo3.setSiblingHeteroOptIn(PSEUDO_ID, true);
  const afterTrue = await SbkimStorage.get("sbkim_siblings_main", PSEUDO_ID);
  record("Probe 3 — setSiblingHeteroOptIn(true) → Feld in sbkim_siblings_main",
         "heterokaryosisOptIn:true, andere Felder unverändert",
         afterTrue
           ? "optIn=" + afterTrue.heterokaryosisOptIn +
             ", domain=" + afterTrue.domain
           : "fehlt",
         afterTrue && afterTrue.heterokaryosisOptIn === true &&
           afterTrue.domain === "pseudo-08y.invalid" &&
           afterTrue.endpoint === "http://127.0.0.1:1/pseudo-08y/");

  // setSiblingHeteroOptIn auf false — andere Felder unverändert
  await SbkimUiDemo3.setSiblingHeteroOptIn(PSEUDO_ID, false);
  const afterFalse = await SbkimStorage.get("sbkim_siblings_main", PSEUDO_ID);
  record("Probe 3 — setSiblingHeteroOptIn(false) → Co-Schreiber-Disziplin",
         "heterokaryosisOptIn:false, andere Felder unverändert",
         afterFalse
           ? "optIn=" + afterFalse.heterokaryosisOptIn +
             ", domain=" + afterFalse.domain
           : "fehlt",
         afterFalse && afterFalse.heterokaryosisOptIn === false &&
           afterFalse.domain === "pseudo-08y.invalid");

  // Unbekannter Sibling im aktiven Slot → UnknownSiblingError
  let unknownErr = null;
  try {
    await SbkimUiDemo3.setSiblingHeteroOptIn("UNBEKANNT-XYZ-1234567890ab", true);
  } catch (e) { unknownErr = e; }
  record("Probe 3 — setSiblingHeteroOptIn unbekannter Sibling",
         "UnknownSiblingError",
         unknownErr ? unknownErr.name : "kein Throw",
         unknownErr && unknownErr.name === "UnknownSiblingError");

  // Strikt boolean — kein truthy/falsy-Cast
  let truthyErr = null;
  try {
    await SbkimUiDemo3.setSiblingHeteroOptIn(PSEUDO_ID, 1);
  } catch (e) { truthyErr = e; }
  record("Probe 3 — setSiblingHeteroOptIn(1) → InvalidOptInArgError",
         "InvalidOptInArgError",
         truthyErr ? truthyErr.name : "kein Throw",
         truthyErr && truthyErr.name === "InvalidOptInArgError");

  // ====================================================================
  // Bonus — Slot-Isolation: addOutboxAnchor in main füllt nicht test_08y
  // ====================================================================

  await SbkimUiDemo3.addOutboxAnchor("Sauerteig", makeVector(11));
  const mainAfter = await SbkimStorage.all("sbkim_hetero_outbox_main");
  const testAfter = await SbkimStorage.all("sbkim_hetero_outbox_test_08y");
  record("Bonus — main-Outbox nach Zweitschreibung", "2 Zeilen (Hefeteig+Sauerteig)",
         String(mainAfter.length), mainAfter.length === 2);
  record("Bonus — test_08y-Outbox unverändert nach main-Schreibung",
         "1 Zeile (Whisky-Sour)", String(testAfter.length), testAfter.length === 1);
}

run().then(() => {
  let allOk = true;
  console.log("\n=== Bau 08.Y Smoke-Test Resultate ===");
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
