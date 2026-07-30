// Headless smoke test — Stufe 0b: die Identität REPARIERBAR machen.
//   node tests/smoke_bau23_0b_identitaet.mjs
//
// Beweist die drei Teile aus BRIEF_STUFE0B_IDENTITAET_HALTBAR.md an der
// UI-Schicht (Modul 23 UI), gegen einen Mock von Modul 02:
//   1. SICHERUNG      — Hinweis „noch keine Sicherung", Datei wird erzeugt,
//                       Passwort-Prüfungen greifen, Vermerk wandert in den Hinweis.
//   2. WIEDERHERSTELLEN — Gegenprobe: einspielen → die ALTE Kennung ist zurück
//                       (auch wenn schon eine neue im Fach liegt: erst Warnung,
//                       dann ausdrückliches „Ja, ersetzen").
//   3. KEINE STUMME NEU-ANLAGE — leere Schublade → FRAGE statt wortloser
//                       Identität; volle Schublade → unverändert ein Klick.
//   + Aufräumen: Mehrfach-Fächer entfernbar, aktives Fach bleibt.
//   + EINE Identität, zwei Türen: wird die Kennung anderswo erzeugt (Siegel-
//     Wizard, dieselbe Schublade), zieht die Anzeige im Panel sofort nach.
//   + Arbeitsteilung: Panel = Alltagsansicht mit Weg zur Werkstatt (Siegel);
//     ohne Siegel bleibt der Weg weg statt als toter Knopf dazustehen.
//   + Die zwei Aufräum-Knöpfe (Alt-Speicher vs. Kennungs-Fächer) sind
//     unverwechselbar benannt; der Fächer-Knopf erscheint nur bei mehreren.
//
// GEGENPROBE (Klaus-Standard dieser Sitzungsreihe): mit SBKIM_0B_SABOTAGE=1
// wird das Identitäts-Tor in onConnect ausgehebelt, mit SBKIM_0B_SABOTAGE_WATCH=1
// der sbkim:alive-Horcher, mit SBKIM_0B_SABOTAGE_HALF=1 die Erkennung der
// halben Kennung (der Quelltext wird jeweils vor dem Laden zurückgebogen).
// Der Test MUSS dann jeweils rot werden — sonst beweist er nichts.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const SABOTAGE = process.env.SBKIM_0B_SABOTAGE === "1";
const SABOTAGE_WATCH = process.env.SBKIM_0B_SABOTAGE_WATCH === "1";
const SABOTAGE_HALF = process.env.SBKIM_0B_SABOTAGE_HALF === "1";

// ---- Minimal-DOM-Stub (wie smoke_bau23_rendezvous_ui.mjs) ----
function makeEl(tag) {
  const e = {
    tagName: String(tag).toUpperCase(), nodeType: 1, id: "", textContent: "", type: "", title: "",
    accept: "", files: null, value: "", disabled: false, children: [], parentNode: null, _listeners: {},
  };
  const _style = {};
  Object.defineProperty(_style, "cssText", {
    get() { return _style._raw || ""; },
    set(v) {
      _style._raw = String(v);
      String(v).split(";").forEach((decl) => {
        const i = decl.indexOf(":");
        if (i < 0) return;
        const prop = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (prop && prop !== "_raw") _style[prop] = decl.slice(i + 1).trim();
      });
    },
  });
  e.style = _style;
  e.appendChild = (c) => {
    if (c.parentNode) { const i = c.parentNode.children.indexOf(c); if (i >= 0) c.parentNode.children.splice(i, 1); }
    e.children.push(c); c.parentNode = e; return c;
  };
  e.removeChild = (c) => { const i = e.children.indexOf(c); if (i >= 0) { e.children.splice(i, 1); c.parentNode = null; } return c; };
  Object.defineProperty(e, "firstChild", { get: () => e.children[0] || null });
  e.addEventListener = (t, cb) => { (e._listeners[t] = e._listeners[t] || []).push(cb); };
  e.click = () => (e._listeners.click || []).slice().forEach((cb) => cb({ type: "click" }));
  e.querySelector = (sel) => find(e, sel);
  e.getElementsByTagName = (t) => {
    const out = [];
    (function walk(n) { for (const c of n.children) { if (c.tagName === String(t).toUpperCase()) out.push(c); walk(c); } })(e);
    return out;
  };
  e.scrollIntoView = () => {};
  Object.defineProperty(e, "textContent", {
    get() {
      if (e._own !== undefined && e.children.length === 0) return e._own;
      let s = e._own !== undefined ? e._own : "";
      for (const c of e.children) s += c.textContent;
      return s;
    },
    set(v) { e._own = String(v); e.children.length = 0; },
  });
  e._own = "";
  return e;
}
function find(root, sel) {
  let out = null;
  (function walk(n) { if (out) return; for (const c of n.children) { if (matches(c, sel)) { out = c; return; } walk(c); } })(root);
  return out;
}
function matches(el, sel) {
  if (sel.startsWith("#")) return el.id === sel.slice(1);
  return el.tagName === sel.toUpperCase();
}
function makeDoc() {
  const doc = { nodeType: 9, readyState: "complete" };
  doc.createElement = (t) => makeEl(t);
  doc.body = makeEl("body");
  doc.head = makeEl("head");
  doc.addEventListener = () => {};
  doc.querySelector = (sel) => find(doc.body, sel);
  doc.getElementById = (id) => find(doc.body, "#" + id);
  return doc;
}

// ---- Mock Modul 02 (Spore) — echte Slot-/Backup-Semantik, ohne Krypto ----
function makeSpore(initial) {
  const state = { slots: Object.assign({}, initial || {}), active: Object.keys(initial || {})[0] || null };
  const calls = { export: [], import: [], removed: [] };
  return {
    _state: state, _calls: calls,
    async listIdentities() { return Object.keys(state.slots).sort(); },
    async getActiveIdentityKey() { return state.active; },
    async getNodeId() { return state.active ? state.slots[state.active] : null; },
    // `noSpore` bildet den HALBEN Zustand ab: Schlüssel im Fach, aber keine
    // Visitenkarte. Genau der Zustand aus Klaus' Sichttest 2026-07-30 (Kimboard
    // 18:54/18:55) — getNodeId lieferte eine ID, getOwnSpore nichts.
    async getOwnSpore() { return (state.active && !state.noSpore) ? { id: state.slots[state.active] } : null; },
    async exportBackup(pw) {
      if (typeof pw !== "string" || pw.length < 8) {
        const e = new Error("Passwort muss mindestens 8 Zeichen lang sein."); e.name = "InvalidBackupPasswordError"; throw e;
      }
      calls.export.push(pw);
      // _pw steht hier für „mit diesem Passwort verschlüsselt" — der Mock bildet
      // nach, dass ein falsches Passwort die Datei nicht öffnet (echte AES-GCM-
      // Entschlüsselung schlägt dort mit demselben Ergebnis fehl).
      return { version: 2, kdf: { salt: "s", iterations: 600000 }, cipher: { iv: "i" }, ciphertext: "c",
               _pw: pw, _slots: Object.assign({}, state.slots), _active: state.active };
    },
    async importBackup(blob, pw, options) {
      if (typeof pw !== "string" || pw.length < 8) {
        const e = new Error("Passwort muss mindestens 8 Zeichen lang sein."); e.name = "InvalidBackupPasswordError"; throw e;
      }
      if (!blob || typeof blob !== "object" || !blob._slots) {
        const e = new Error("Backup-Pflichtfeld fehlt im Wrapper."); e.name = "BackupSchemaError"; throw e;
      }
      if (blob._pw !== pw) {
        const e = new Error("Entschlüsselung fehlgeschlagen — falsches Passwort?"); e.name = "BackupDecryptError"; throw e;
      }
      const force = !!(options && options.force);
      const collisions = Object.keys(blob._slots).filter((k) => k in state.slots);
      if (!force && collisions.length > 0) {
        const e = new Error("Bestehende Identitäten in sbkim_keys für Slot(s): " + collisions.join(", "));
        e.name = "BackupOverwriteError"; throw e;
      }
      calls.import.push({ force });
      state.slots = Object.assign({}, state.slots, blob._slots);
      state.active = blob._active;
      return { restored: true };
    },
    async removeIdentity(key) {
      if (key === state.active) { const e = new Error("aktive Identität"); e.name = "RemoveActiveIdentityError"; throw e; }
      if (!(key in state.slots)) return false;
      delete state.slots[key]; calls.removed.push(key); return true;
    },
  };
}

const stub = {};
stub.document = makeDoc();
stub.console = console;
stub.setTimeout = setTimeout;
stub.SbkimRendezvous = {
  configure() {},
  announce: async () => ({ ok: true, nodeId: "OWN" }),
  connectAndAnnounce: async () => { stub.SbkimRendezvous._connects++; return { ok: true, created: true, nodeId: "NEU" }; },
  discover: async () => ({ ok: true, cards: [] }),
  handshakeCard: async () => ({ outcome: "established", score: 0.9 }),
  _connects: 0,
};
const _bus = {};
stub.addEventListener = (t, cb) => { (_bus[t] = _bus[t] || []).push(cb); };
stub.removeEventListener = () => {};
stub.dispatchEvent = (ev) => { (_bus[ev.type] || []).slice().forEach((cb) => cb(ev)); return true; };
stub.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = (init || {}).detail; } };
const _ls = {};
stub.localStorage = { getItem: (k) => (k in _ls ? _ls[k] : null), setItem: (k, v) => { _ls[k] = String(v); }, removeItem: (k) => { delete _ls[k]; } };
// Datei-Download abfangen (kein echtes Blob/URL im Node-Stub → data:-Pfad).
const downloads = [];
stub.document.createElement = (t) => {
  const e = makeEl(t);
  if (String(t).toUpperCase() === "A") {
    e.click = () => downloads.push({ href: e.href, name: e.download });
  }
  return e;
};
// FileReader-Stub für den Einspiel-Pfad.
stub.FileReader = class {
  readAsText(file) { this.result = file._text; if (this.onload) this.onload(); }
};

let src = readFileSync(resolve(repoRoot, "src/modules/23_rendezvous_ui.js"), "utf8");
if (SABOTAGE) {
  // Gegenprobe: das Tor entfernen — onConnect verbindet wieder ohne zu fragen.
  const gate = 'if (!(opts && opts.skipIdentityGate)) {';
  if (src.indexOf(gate) === -1) { console.error("Sabotage-Anker nicht gefunden."); process.exit(1); }
  src = src.replace(gate, "if (false) {");
}
if (SABOTAGE_WATCH) {
  // Gegenprobe 2: den sbkim:alive-Horcher entfernen — eine anderswo (Siegel)
  // erzeugte Kennung darf dann NICHT mehr in der Anzeige ankommen.
  const anchor = 'try { global.addEventListener("sbkim:alive", _aliveHandler); } catch (_e) {}';
  if (src.indexOf(anchor) === -1) { console.error("Sabotage-Anker (watch) nicht gefunden."); process.exit(1); }
  src = src.replace(anchor, "/* sabotiert */");
}
if (SABOTAGE_HALF) {
  // Gegenprobe 3: die halbe Kennung (Schlüssel ohne Spore) wieder unsichtbar
  // machen — dann muss der Zustand erneut zu widersprüchlichen Antworten führen.
  const anchor = "hasSpore: !!(r[1] && r[1].id),";
  if (src.indexOf(anchor) === -1) { console.error("Sabotage-Anker (half) nicht gefunden."); process.exit(1); }
  src = src.replace(anchor, "hasSpore: true,");
}
new Function("window", "globalThis", "console", "document", src)(stub, stub, console, stub.document);
const UI = stub.SbkimRendezvousUI;

const results = [];
const record = (probe, exp, act, ok) => results.push({ probe, exp, act, ok });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function panelButtons(panel, label) {
  const out = [];
  (function walk(n) { for (const c of n.children) { if (c.tagName === "BUTTON") out.push(c); walk(c); } })(panel);
  return out.find((b) => b.textContent.indexOf(label) !== -1) || null;
}

async function run() {
  // ---------- Aufbau: leere Schublade ----------
  stub.SbkimSpore = makeSpore({});
  await UI.init({ nodeName: "Testknoten", dbSuffix: "test0b" });
  UI.show();
  await sleep(10);
  const panel = stub.document.querySelector("#sbkim-rdv-panel");
  const box = panel.querySelector("#sbkim-rdv-idbox");
  record("0b Kennung-sichern-Kasten gemountet", "ja", box ? "ja" : "nein", !!box);
  // Der Aufräum-Knopf ist hier bewusst NICHT dabei: er erscheint erst, wenn es
  // mehr als ein Kennungs-Fach gibt (Probe 0b/7 weiter unten). Zwei Knöpfe, die
  // beide „aufräumen" heißen, waren Klaus' Befund vom 2026-07-30.
  for (const lbl of ["💾 Sicherung anlegen", "📥 Sicherung einspielen"]) {
    record("0b Knopf vorhanden: " + lbl, "ja", panelButtons(panel, lbl) ? "ja" : "nein", !!panelButtons(panel, lbl));
  }
  record("0b ehrliche Grenze steht in der Oberfläche", "ja",
    /lässt sich nicht verhindern/.test(box.textContent) ? "ja" : "nein",
    /lässt sich nicht verhindern/.test(box.textContent));

  // ---------- Teil 3: keine stumme Neu-Anlage ----------
  const connectButton = panelButtons(panel, "Mit dem Knotennetz verbinden");
  const before = stub.SbkimRendezvous._connects;
  connectButton.click();
  await sleep(20);
  record("0b/3 leere Schublade: KEIN wortloses Anlegen", "0 Verbindungen",
    String(stub.SbkimRendezvous._connects - before), stub.SbkimRendezvous._connects === before);
  const frage = UI._test.idFormText() || "";
  record("0b/3 stattdessen eine Frage", "Hinweis auf fehlende Kennung",
    /noch KEINE Kennung/.test(frage) ? "gefragt" : frage.slice(0, 60), /noch KEINE Kennung/.test(frage));
  const btns = UI._test.idFormButtons();
  record("0b/3 beide Wege angeboten", "neu + Sicherung",
    btns.join(" | "),
    btns.some((b) => b.indexOf("Neue Kennung") !== -1) && btns.some((b) => b.indexOf("Sicherung einspielen") !== -1));
  record("0b/3 Warnung: neue Kennung ≠ alte", "ja",
    /NICHT dieselbe/.test(frage) ? "ja" : "nein", /NICHT dieselbe/.test(frage));

  // Ausdrücklich „neu anlegen" → jetzt DARF verbunden werden.
  UI._test.clickIdFormButton("Neue Kennung anlegen");
  await sleep(20);
  record("0b/3 nach ausdrücklichem Ja: verbunden", "1 Verbindung",
    String(stub.SbkimRendezvous._connects - before), stub.SbkimRendezvous._connects === before + 1);

  // ---------- volle Schublade: unverändert EIN Klick ----------
  stub.SbkimSpore = makeSpore({ main: "ALT-KENNUNG-AAA" });
  const before2 = stub.SbkimRendezvous._connects;
  connectButton.click();
  await sleep(20);
  record("0b/3 volle Schublade: kein Zusatz-Klick", "1 Verbindung",
    String(stub.SbkimRendezvous._connects - before2), stub.SbkimRendezvous._connects === before2 + 1);

  // ---------- Teil 1: Sicherung anlegen ----------
  UI._test.refreshIdentityBox();
  await sleep(10);
  record("0b/1 Hinweis ohne Sicherung ist eine Warnung", "KEINE Sicherung",
    UI._test.idHint(), /KEINE Sicherung/.test(UI._test.idHint() || ""));

  UI._test.openBackupForm();
  await sleep(20);   // openBackupForm prüft erst den Kennungs-Zustand (asynchron)
  const pwFields = UI._test.idFormInputs().filter((i) => i.type === "password");
  record("0b/1 zwei Passwort-Felder", "2", String(pwFields.length), pwFields.length === 2);
  // zu kurz
  pwFields[0].value = "kurz"; pwFields[1].value = "kurz";
  UI._test.clickIdFormButton("Datei erzeugen");
  await sleep(10);
  record("0b/1 zu kurzes Passwort abgelehnt", "Hinweis",
    /zu kurz/.test(UI._test.idFormText() || "") ? "abgelehnt" : "durchgelassen!",
    /zu kurz/.test(UI._test.idFormText() || ""));
  record("0b/1 keine Datei bei zu kurzem Passwort", "0", String(downloads.length), downloads.length === 0);
  // ungleich
  pwFields[0].value = "geheim12345"; pwFields[1].value = "anders12345";
  UI._test.clickIdFormButton("Datei erzeugen");
  await sleep(10);
  record("0b/1 ungleiche Passwörter abgelehnt", "Hinweis",
    /nicht gleich/.test(UI._test.idFormText() || "") ? "abgelehnt" : "durchgelassen!",
    /nicht gleich/.test(UI._test.idFormText() || ""));
  // korrekt
  pwFields[0].value = "geheim12345"; pwFields[1].value = "geheim12345";
  UI._test.clickIdFormButton("Datei erzeugen");
  await sleep(30);
  record("0b/1 Sicherung erzeugt (Datei angeboten)", "1 Download", String(downloads.length), downloads.length === 1);
  record("0b/1 Dateiname trägt Knoten + Datum", "sbkim-sicherung-test0b-…",
    downloads[0] ? downloads[0].name : "(keine)",
    !!(downloads[0] && /^sbkim-sicherung-test0b-\d{4}-\d{2}-\d{2}\.json$/.test(downloads[0].name)));
  record("0b/1 Passwort NICHT gespeichert", "kein Passwort im Speicher",
    Object.values(_ls).some((v) => String(v).indexOf("geheim12345") !== -1) ? "gefunden!" : "keins",
    !Object.values(_ls).some((v) => String(v).indexOf("geheim12345") !== -1));
  UI._test.refreshIdentityBox();
  await sleep(10);
  record("0b/1 Hinweis kennt die Sicherung jetzt", "Letzte Sicherung",
    UI._test.idHint(), /Letzte Sicherung/.test(UI._test.idHint() || ""));

  // ---------- Teil 2: Wiederherstellen (die Gegenprobe des Briefs) ----------
  const sicherung = await stub.SbkimSpore.exportBackup("geheim12345");   // enthält ALT-KENNUNG-AAA
  // Verlust simulieren: leere Schublade, dann legt die App eine NEUE an.
  stub.SbkimSpore = makeSpore({ main: "NEU-KENNUNG-ZZZ" });
  record("0b/2 Ausgangslage: neue Kennung im Fach", "NEU-KENNUNG-ZZZ",
    await stub.SbkimSpore.getNodeId(), (await stub.SbkimSpore.getNodeId()) === "NEU-KENNUNG-ZZZ");

  UI._test.openImportForm();
  const fileIn = UI._test.idFormInputs().find((i) => i.type === "file");
  const pwIn = UI._test.idFormInputs().find((i) => i.type === "password");
  record("0b/2 Datei- und Passwort-Feld da", "ja", (fileIn && pwIn) ? "ja" : "nein", !!(fileIn && pwIn));
  fileIn.files = [{ _text: JSON.stringify(sicherung) }];
  pwIn.value = "geheim12345";
  UI._test.clickIdFormButton("Einspielen");
  await sleep(30);
  record("0b/2 bestehende Kennung wird NICHT still überschrieben", "Warnung + Rückfrage",
    /ERSETZT/.test(UI._test.idFormText() || "") ? "gefragt" : "still überschrieben!",
    /ERSETZT/.test(UI._test.idFormText() || ""));
  record("0b/2 alte Kennung noch nicht zurück (erst nach Ja)", "NEU-KENNUNG-ZZZ",
    await stub.SbkimSpore.getNodeId(), (await stub.SbkimSpore.getNodeId()) === "NEU-KENNUNG-ZZZ");
  UI._test.clickIdFormButton("Ja, ersetzen");
  await sleep(30);
  record("0b/2 GEGENPROBE: ALTE Kennung ist zurück", "ALT-KENNUNG-AAA",
    await stub.SbkimSpore.getNodeId(), (await stub.SbkimSpore.getNodeId()) === "ALT-KENNUNG-AAA");
  record("0b/2 Erfolgsmeldung nennt den nächsten Schritt", "Hinweis auf Verbinden",
    /Knotennetz verbinden/.test(UI._test.idFormText() || "") ? "ja" : "nein",
    /Knotennetz verbinden/.test(UI._test.idFormText() || ""));

  // falsches Passwort bleibt ehrlich (kein stiller Erfolg)
  UI._test.openImportForm();
  const fileIn2 = UI._test.idFormInputs().find((i) => i.type === "file");
  const pwIn2 = UI._test.idFormInputs().find((i) => i.type === "password");
  fileIn2.files = [{ _text: JSON.stringify(sicherung) }];
  pwIn2.value = "falschespw1";
  UI._test.clickIdFormButton("Einspielen");
  await sleep(30);
  record("0b/2 falsches Passwort: ehrliche Fehlermeldung", "Fehlermeldung",
    /fehlgeschlagen|Passwort/.test(UI._test.idFormText() || "") ? "gemeldet" : "still!",
    /fehlgeschlagen|Passwort/.test(UI._test.idFormText() || ""));

  // ---------- Aufräumen: Mehrfach-Fächer ----------
  stub.SbkimSpore = makeSpore({ main: "AKTIV-111", alt1: "ALT-222", alt2: "ALT-333" });
  stub.SbkimSpore._state.active = "main";
  UI._test.refreshIdentityBox();
  await sleep(10);
  record("0b/4 Hinweis zeigt Mehrfach-Fächer", "3 Kennungs-Fächer",
    UI._test.idHint(), /3 Kennungs-Fächer belegt/.test(UI._test.idHint() || ""));
  UI._test.openCleanupForm();
  await sleep(20);
  record("0b/4 Aufräumen fragt vorher", "Rückfrage",
    /nicht umkehrbar/.test(UI._test.idFormText() || "") ? "gefragt" : "sofort gelöscht!",
    /nicht umkehrbar/.test(UI._test.idFormText() || ""));
  record("0b/4 aktives Fach wird benannt", "main",
    /Aktives Fach BLEIBT: main/.test(UI._test.idFormText() || "") ? "main" : "(nicht benannt)",
    /Aktives Fach BLEIBT: main/.test(UI._test.idFormText() || ""));
  UI._test.clickIdFormButton("Ja, alte Fächer entfernen");
  await sleep(40);
  const rest = await stub.SbkimSpore.listIdentities();
  record("0b/4 nur das aktive Fach bleibt", "main", rest.join(","), rest.length === 1 && rest[0] === "main");
  record("0b/4 aktive Kennung unverändert", "AKTIV-111",
    await stub.SbkimSpore.getNodeId(), (await stub.SbkimSpore.getNodeId()) === "AKTIV-111");

  // ---------- Kennung anderswo erzeugt (Siegel-Wizard) → Anzeige zieht nach ----------
  // Klaus' Frage 2026-07-30: übernimmt das Netz-Panel die im Siegel erzeugte
  // Kennung automatisch? Ja — dieselbe Schublade. Hier wird bewiesen, dass auch
  // die ANZEIGE nachzieht, ohne das Panel zu schliessen.
  record("0b/5 Identitäts-Horcher aktiv", "ja",
    UI._test.hasIdentityWatch() ? "ja" : "nein", UI._test.hasIdentityWatch() === true);
  stub.SbkimSpore = makeSpore({});          // leere Schublade, Panel offen
  UI._test.refreshIdentityBox();
  await sleep(10);
  const vorher = UI._test.idHint() || "";
  record("0b/5 Ausgangslage: Panel sieht keine Kennung", "Hinweis auf fehlende Kennung",
    vorher.slice(0, 40), /Noch keine Kennung/.test(vorher));
  // Der Siegel-Wizard legt die Identität an (dieselbe Schublade) und Modul 02
  // feuert sbkim:alive — das Panel darf nicht auf einem alten Stand stehenbleiben.
  stub.SbkimSpore = makeSpore({ main: "IM-SIEGEL-ERZEUGT" });
  stub.dispatchEvent(new stub.CustomEvent("sbkim:alive", { detail: { nodeId: "IM-SIEGEL-ERZEUGT" } }));
  await sleep(30);
  const idEl2 = stub.document.querySelector("#sbkim-rdv-myid");
  record("0b/5 Kennung aus dem Siegel steht sofort im Panel", "IM-SIEGEL-ERZEUGT",
    idEl2 && idEl2.textContent, !!(idEl2 && idEl2.textContent === "IM-SIEGEL-ERZEUGT"));
  record("0b/5 Sicherungs-Hinweis zieht mit nach", "nicht mehr „noch keine Kennung“",
    (UI._test.idHint() || "").slice(0, 40), !/Noch keine Kennung/.test(UI._test.idHint() || ""));

  // ---------- Halbe Kennung: Schlüssel da, Visitenkarte fehlt ----------
  // Klaus' Sichttest 2026-07-30 (Kimboard): oben stand „noch keine Kennung",
  // das Einspielen sagte „hier liegt schon eine", und die Sicherung scheiterte
  // erst NACH der Passwort-Eingabe. Drei Stellen, drei Antworten. Jetzt wird
  // der Zustand gelesen, benannt — und der Weg heraus gleich mitgesagt.
  stub.SbkimSpore = makeSpore({ main: "HALB" });
  stub.SbkimSpore._state.noSpore = true;
  UI._test.refreshIdentityBox();
  await sleep(20);
  record("0b/8 halbe Kennung wird benannt", "Angefangene Kennung",
    (UI._test.idHint() || "").slice(0, 45), /Angefangene Kennung/.test(UI._test.idHint() || ""));
  record("0b/8 der Weg heraus steht dabei", "Verbinden oder Siegel",
    (UI._test.idHint() || "").indexOf("Knotennetz verbinden") !== -1 ? "genannt" : "fehlt",
    /Knotennetz verbinden/.test(UI._test.idHint() || ""));
  UI._test.openBackupForm();
  await sleep(30);
  record("0b/8 Sicherung sagt es VOR der Passwort-Eingabe", "Hinweis statt Formular",
    (UI._test.idFormText() || "").slice(0, 45),
    /Noch nichts zu sichern/.test(UI._test.idFormText() || ""));
  record("0b/8 kein Passwort-Feld im halben Zustand", "0 Felder",
    String(UI._test.idFormInputs().length), UI._test.idFormInputs().length === 0);

  // ---------- Die zwei Aufräum-Knöpfe dürfen sich nicht verwechseln lassen ----------
  // Klaus' Befund 2026-07-30: „🧹 Aufräumen & neu anmelden" (Alt-Speicher dieser
  // Adresse) und „🧹 Fächer aufräumen" (Kennungs-Fächer) taten Verschiedenes,
  // hießen aber beide gleich. Im Code keine Doppelung — im Kopf des Nutzers schon.
  // Lösung: eigenes Symbol + eindeutiger Name, und der Fächer-Knopf erscheint NUR,
  // wenn es wirklich mehr als ein Fach gibt.
  stub.SbkimSpore = makeSpore({ main: "EINZIGE" });
  UI._test.refreshIdentityBox();
  await sleep(20);
  record("0b/7 ein Fach: Aufräum-Knopf steht gar nicht da", "unsichtbar",
    UI._test.slotsBtnVisible() ? "sichtbar!" : "unsichtbar", UI._test.slotsBtnVisible() === false);
  stub.SbkimSpore = makeSpore({ main: "A", alt: "B" });
  stub.SbkimSpore._state.active = "main";
  UI._test.refreshIdentityBox();
  await sleep(20);
  record("0b/7 mehrere Fächer: Knopf erscheint", "sichtbar",
    UI._test.slotsBtnVisible() ? "sichtbar" : "unsichtbar", UI._test.slotsBtnVisible() === true);
  const alleKnoepfe = (function () {
    const out = [];
    (function walk(n) { for (const c of n.children) { if (c.tagName === "BUTTON") out.push(c.textContent); walk(c); } })(panel);
    return out;
  })();
  const putzKnoepfe = alleKnoepfe.filter((t) => /aufräumen/i.test(t));
  record("0b/7 beide Aufräum-Knöpfe sagen, WAS sie aufräumen", "Alt-Speicher + Mehrfach-Kennungen",
    putzKnoepfe.join(" | "),
    putzKnoepfe.length === 2 &&
    putzKnoepfe.some((t) => /Alt-Speicher/.test(t)) &&
    putzKnoepfe.some((t) => /Mehrfach-Kennungen/.test(t)));
  record("0b/7 kein doppeltes 🧹 mehr", "je ein eigenes Symbol",
    putzKnoepfe.map((t) => t.slice(0, 2)).join(" "),
    putzKnoepfe.filter((t) => t.indexOf("🧹") === 0).length === 1);

  // ---------- Arbeitsteilung: Panel = Alltag, Siegel = Werkstatt ----------
  // Klaus 2026-07-30: „Im Mycel sehe ich täglich, was los ist. Sehe ich, dass
  // eine Identität verschwunden ist, gehe ich ins Siegel — da ist das ganze
  // Werkzeug." Also: das Panel zeigt den Weg dorthin, statt alles zu doppeln.
  record("0b/6 ohne Siegel: kein toter Knopf", "unsichtbar",
    UI._test.werkstattVisible() ? "sichtbar!" : "unsichtbar", UI._test.werkstattVisible() === false);
  // Siegel mountet sein Abzeichen (wie Modul 16 es tut) …
  const badge = stub.document.createElement("button");
  badge.id = "sbkim-siegel-badge";
  let badgeClicks = 0;
  badge.addEventListener("click", () => { badgeClicks++; });
  stub.document.body.appendChild(badge);
  UI._test.refreshIdentityBox();
  await sleep(20);
  record("0b/6 mit Siegel: Weg zur Werkstatt erscheint", "sichtbar",
    UI._test.werkstattVisible() ? "sichtbar" : "unsichtbar", UI._test.werkstattVisible() === true);
  record("0b/6 Arbeitsteilung steht dabei", "Hinweis auf das Siegel",
    (UI._test.werkstattText() || "").slice(0, 50),
    /ganze Werkzeug/.test(UI._test.werkstattText() || "") && /Siegel/.test(UI._test.werkstattText() || ""));
  record("0b/6 Knopf öffnet das Siegel", "1 Klick aufs Abzeichen",
    (UI._test.clickWerkstatt(), String(badgeClicks)), badgeClicks === 1);

  // ---------- fail-soft: ohne Modul 02 ----------
  stub.SbkimSpore = null;
  let threw = false;
  try {
    UI._test.openBackupForm(); await sleep(10);
    UI._test.openCleanupForm(); await sleep(10);
    connectButton.click(); await sleep(20);
  } catch (_e) { threw = true; }
  record("0b fail-soft ohne Modul 02: kein Throw", "kein Throw", threw ? "geworfen!" : "kein Throw", threw === false);
  record("0b fail-soft: ehrlicher Hinweis statt totem Knopf", "Hinweis",
    /nicht geladen/.test(UI._test.idFormText() || "") ? "Hinweis" : (UI._test.idFormText() || "").slice(0, 40),
    /nicht geladen/.test(UI._test.idFormText() || ""));

  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) pass++; else fail++;
    console.log(`${r.ok ? "✓" : "✗"} ${r.probe}`);
    if (!r.ok) { console.log(`   erwartet: ${r.exp}`); console.log(`   erhalten: ${r.act}`); }
  }
  console.log(`\nSumme: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt` + (SABOTAGE ? "  (GEGENPROBE-Lauf)" : ""));
  process.exit(fail > 0 ? 1 : 0);
}
run().catch((e) => { console.error("Smoke gescheitert:", e); process.exit(1); });
