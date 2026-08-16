// Headless smoke test for Bau 16 Sub (e) Bronze/Gold-Stufung — Modul 16.
// Run with `node tests/smoke_bau16_sub_e_bronze.mjs`.
//
// Stubs: DOM (Element/classList/querySelector/addEventListener +
// dispatchEvent + CustomEvent), Pflicht-Module 01/02/03/04/05/07/15
// als typeof-Surface-Mocks (damit Modul 16 isCertified()===true liefert),
// minimaler window-Event-Bus. Modul 16 wird via Function-Constructor
// in einen Stub-Global injiziert (analog Smoke 17 Pattern).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- Minimal-DOM-Stub (übernommen aus Smoke 17, leicht reduziert) ----

function makeStubElement(tagName, doc) {
  const el = {
    tagName: tagName.toUpperCase(),
    nodeType: 1,
    id: "",
    _textContent: "",
    title: "",
    type: "",
    children: [],
    parentNode: null,
    _attributes: {},
    _classes: new Set(),
    _listeners: {},
    style: {},
    _ownerDoc: doc,
  };
  Object.defineProperty(el, "textContent", {
    get: () => {
      // Wenn children, sammle deren textContent (rekursiv). Sonst _textContent.
      if (el.children.length === 0) return el._textContent || "";
      let out = "";
      for (const c of el.children) {
        if (c.nodeType === 3) out += c.nodeValue;
        else if (c.nodeType === 1) out += c.textContent;
      }
      return out;
    },
    set: (v) => {
      // textContent="..." leert children und setzt direkten Text.
      el.children = [];
      el._textContent = String(v == null ? "" : v);
    },
  });
  el.classList = {
    add: (...names) => names.forEach(n => el._classes.add(n)),
    remove: (...names) => names.forEach(n => el._classes.delete(n)),
    contains: (n) => el._classes.has(n),
    toggle: (n) => { if (el._classes.has(n)) el._classes.delete(n); else el._classes.add(n); },
    get length() { return el._classes.size; },
  };
  Object.defineProperty(el, "className", {
    get: () => Array.from(el._classes).join(" "),
    set: (v) => { el._classes.clear(); if (typeof v === "string") v.split(/\s+/).filter(Boolean).forEach(c => el._classes.add(c)); },
  });
  el.setAttribute = (k, v) => { el._attributes[k] = String(v); if (k === "id") el.id = String(v); };
  el.getAttribute = (k) => Object.prototype.hasOwnProperty.call(el._attributes, k) ? el._attributes[k] : null;
  el.removeAttribute = (k) => { delete el._attributes[k]; };
  el.appendChild = (child) => {
    if (child.parentNode) {
      const idx = child.parentNode.children.indexOf(child);
      if (idx >= 0) child.parentNode.children.splice(idx, 1);
    }
    el.children.push(child);
    child.parentNode = el;
    return child;
  };
  el.removeChild = (child) => {
    const idx = el.children.indexOf(child);
    if (idx >= 0) { el.children.splice(idx, 1); child.parentNode = null; }
    return child;
  };
  el.addEventListener = (type, cb) => {
    if (!el._listeners[type]) el._listeners[type] = [];
    el._listeners[type].push(cb);
  };
  el.removeEventListener = (type, cb) => {
    if (!el._listeners[type]) return;
    const i = el._listeners[type].indexOf(cb);
    if (i >= 0) el._listeners[type].splice(i, 1);
  };
  el.dispatchEvent = (ev) => {
    const arr = (el._listeners[ev.type] || []).slice();
    for (const cb of arr) { try { cb(ev); } catch (err) { console.error("listener threw", err); } }
    return true;
  };
  el.click = () => {
    el.dispatchEvent({ type: "click", target: el, stopPropagation: () => {}, preventDefault: () => {} });
  };
  el.querySelector = (sel) => queryFirst(el, sel);
  el.querySelectorAll = (sel) => queryAll(el, sel);
  el.contains = (other) => {
    if (!other) return false;
    let p = other;
    while (p) { if (p === el) return true; p = p.parentNode; }
    return false;
  };
  Object.defineProperty(el, "innerHTML", {
    get: () => "",
    set: (_v) => { /* no-op stub */ },
  });
  Object.defineProperty(el, "firstChild", {
    get: () => el.children[0] || null,
  });
  return el;
}

function matchSelector(el, sel) {
  if (sel.startsWith("#")) return el.id === sel.slice(1);
  if (sel.startsWith(".")) return el._classes.has(sel.slice(1));
  if (sel.startsWith("[")) {
    const m = sel.match(/^\[([^=\]]+)(?:=["']?([^"'\]]*)["']?)?\]$/);
    if (!m) return false;
    const key = m[1];
    const val = m[2];
    if (val === undefined) return Object.prototype.hasOwnProperty.call(el._attributes, key);
    return el._attributes[key] === val;
  }
  const tagMatch = sel.match(/^([a-zA-Z][a-zA-Z0-9-]*)?(.*)/);
  if (!tagMatch) return false;
  const tag = tagMatch[1];
  const rest = tagMatch[2];
  if (tag && el.tagName !== tag.toUpperCase()) return false;
  let r = rest;
  while (r.length > 0) {
    if (r.startsWith(".")) {
      const m = r.match(/^\.([\w-]+)/);
      if (!m) return false;
      if (!el._classes.has(m[1])) return false;
      r = r.slice(m[0].length);
    } else if (r.startsWith("#")) {
      const m = r.match(/^#([\w-]+)/);
      if (!m) return false;
      if (el.id !== m[1]) return false;
      r = r.slice(m[0].length);
    } else if (r.startsWith("[")) {
      const m = r.match(/^\[([^\]]+)\]/);
      if (!m) return false;
      r = r.slice(m[0].length);
    } else {
      return false;
    }
  }
  return true;
}

function walkAll(el, cb) {
  if (!el || el.nodeType !== 1) return;     // nur Element-Nodes
  if (cb(el) === false) return;
  for (const c of el.children) walkAll(c, cb);
}

// Split selector on whitespace (Descendant-Combinator) — wir matchen
// dann jeden Selektor-Teil von der Wurzel weiter nach innen.
function splitSelector(sel) {
  return sel.trim().split(/\s+/).filter(Boolean);
}

function queryFirst(root, sel) {
  const parts = splitSelector(sel);
  let candidates = [root];
  for (const p of parts) {
    const next = [];
    for (const c of candidates) {
      walkAll(c, (el) => {
        if (el !== c && matchSelector(el, p)) next.push(el);
      });
    }
    candidates = next;
    if (candidates.length === 0) return null;
  }
  return candidates[0] || null;
}

function queryAll(root, sel) {
  const parts = splitSelector(sel);
  let candidates = [root];
  for (const p of parts) {
    const next = [];
    for (const c of candidates) {
      walkAll(c, (el) => {
        if (el !== c && matchSelector(el, p)) next.push(el);
      });
    }
    candidates = next;
    if (candidates.length === 0) return [];
  }
  return candidates;
}

function makeStubDocument() {
  const doc = {};
  doc.nodeType = 9;
  doc.createElement = (tag) => makeStubElement(tag, doc);
  doc.createTextNode = (text) => ({
    nodeType: 3,
    nodeValue: String(text),
    textContent: String(text),
    parentNode: null,
    children: [],            // walker skip via nodeType-Check
    _classes: new Set(),
    _attributes: {},
  });
  doc.body = makeStubElement("body", doc);
  doc.head = makeStubElement("head", doc);
  doc.documentElement = makeStubElement("html", doc);
  doc.documentElement.appendChild(doc.head);
  doc.documentElement.appendChild(doc.body);
  doc.body._ownerDoc = doc;
  doc.head._ownerDoc = doc;
  doc.querySelector = (sel) => queryFirst(doc.documentElement, sel);
  doc.querySelectorAll = (sel) => queryAll(doc.documentElement, sel);
  doc.getElementById = (id) => queryFirst(doc.documentElement, "#" + id);
  const docListeners = {};
  doc.addEventListener = (type, cb) => {
    if (!docListeners[type]) docListeners[type] = [];
    docListeners[type].push(cb);
  };
  doc.removeEventListener = (type, cb) => {
    if (!docListeners[type]) return;
    const i = docListeners[type].indexOf(cb);
    if (i >= 0) docListeners[type].splice(i, 1);
  };
  doc.dispatchEvent = (ev) => {
    const arr = (docListeners[ev.type] || []).slice();
    for (const cb of arr) { try { cb(ev); } catch (err) { console.error("doc listener threw", err); } }
    return true;
  };
  doc.readyState = "complete";
  return doc;
}

function makeStubGlobal() {
  const stub = {};
  const windowListeners = {};
  stub.document = makeStubDocument();
  stub.console = console;
  stub.setTimeout = setTimeout;
  stub.clearTimeout = clearTimeout;
  stub.Date = Date;
  stub.JSON = JSON;
  stub.Math = Math;
  stub.Promise = Promise;
  stub.MutationObserver = function () {
    return { observe: () => {}, disconnect: () => {} };
  };
  stub.CustomEvent = function CustomEvent(type, init) {
    return {
      type: type,
      detail: (init && init.detail) || undefined,
      bubbles: !!(init && init.bubbles),
      cancelable: !!(init && init.cancelable),
    };
  };
  stub.addEventListener = (type, cb) => {
    if (!windowListeners[type]) windowListeners[type] = [];
    windowListeners[type].push(cb);
  };
  stub.removeEventListener = (type, cb) => {
    if (!windowListeners[type]) return;
    const i = windowListeners[type].indexOf(cb);
    if (i >= 0) windowListeners[type].splice(i, 1);
  };
  stub.dispatchEvent = (ev) => {
    const arr = (windowListeners[ev.type] || []).slice();
    for (const cb of arr) { try { cb(ev); } catch (err) { console.error("window listener threw", err); } }
    return true;
  };
  stub.location = {
    origin: "https://example.test",
    pathname: "/sage/",
  };

  // Pflicht-Module Surface-Mocks (Karte 16 § Sub (a)): jeder
  // PFLICHT_MODULE-Eintrag braucht globalThis[globalName] mit der
  // entsprechenden surfaceFn als Funktion, damit Surface-Check „ok"
  // liefert. Modul 03 ist lazy:true — bewusst NICHT setzen, damit
  // status "deferred" auch geprüft wird.
  stub.SbkimStorage    = { init: function () {} };
  stub.SbkimSpore      = { getOwnSpore: function () { return {}; } };
  // SbkimEmbedding bewusst weggelassen (lazy:true → "deferred").
  stub.SbkimMatch      = { match: function () { return 1; } };
  stub.SbkimAnastomose = { handshake: function () {} };
  // 05b seit 2026-08-16 achtes Pflicht-Modul: ohne Relais-Client kein Raum.
  stub.SbkimNostrRelay = { subscribe: function () { return function () {}; } };
  stub.SbkimApoptose   = { prepareSelfApoptose: function () {} };
  stub.SbkimMembrane   = { init: function () {} };

  return stub;
}

function loadModuleInto(stubGlobal, relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  const wrapped = new Function(
    "window", "globalThis", "self", "console",
    "document",
    "addEventListener", "removeEventListener", "dispatchEvent", "CustomEvent",
    "setTimeout", "clearTimeout",
    "MutationObserver", "Date", "JSON", "Math", "Promise",
    src,
  );
  wrapped(
    stubGlobal, stubGlobal, stubGlobal, console,
    stubGlobal.document,
    stubGlobal.addEventListener.bind(stubGlobal),
    stubGlobal.removeEventListener.bind(stubGlobal),
    stubGlobal.dispatchEvent.bind(stubGlobal),
    stubGlobal.CustomEvent,
    stubGlobal.setTimeout, stubGlobal.clearTimeout,
    stubGlobal.MutationObserver,
    stubGlobal.Date, stubGlobal.JSON, stubGlobal.Math, stubGlobal.Promise,
  );
}

// ---- Test-Harness ----

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

function dispatchHandshake(g, detail) {
  return g.dispatchEvent(new g.CustomEvent("sbkim:handshake", { detail }));
}

// ---- Test-Suite ----

async function run() {
  // ---- Setup: Modul 16 mit grünem Surface-Check (alle Pflicht-Module
  //      gemockt, Modul 03 fehlt absichtlich → "deferred" akzeptiert) ----
  const g = makeStubGlobal();
  // Anker-Container für Option-β-Badge-Mount.
  const lampsContainer = g.document.createElement("div");
  lampsContainer._classes.add("lamps");
  g.document.body.appendChild(lampsContainer);

  loadModuleInto(g, "src/modules/16_siegel.js");
  const S = g.SbkimSiegel;
  if (!S) throw new Error("SbkimSiegel wurde nicht registriert");

  // Probe 1: Public Surface verfügbar inkl. _resetMycelConnectedForTest.
  record("1. Public Surface inkl. Test-Brücke + _meta.mycelConnected-Getter",
    "init/isCertified/getExplanation/getCertifiedModules/getAspects/_resetMycelConnectedForTest/_meta",
    Object.keys(S).sort().join(","),
    typeof S.init === "function" &&
    typeof S.isCertified === "function" &&
    typeof S.getExplanation === "function" &&
    typeof S.getCertifiedModules === "function" &&
    typeof S.getAspects === "function" &&
    typeof S._resetMycelConnectedForTest === "function" &&
    typeof S._meta === "object" &&
    typeof S._meta.mycelConnected === "boolean" &&
    "mycelConnectedAt" in S._meta &&
    typeof S._meta.siegelStufe === "string");

  // Probe 2: Vor init() — mycelConnected ist false, stufe ist bronze.
  record("2. Vor init(): _meta.mycelConnected===false, _meta.siegelStufe===\"bronze\"",
    "false/bronze",
    `connected=${S._meta.mycelConnected}/stufe=${S._meta.siegelStufe}/at=${S._meta.mycelConnectedAt}`,
    S._meta.mycelConnected === false &&
    S._meta.siegelStufe === "bronze" &&
    S._meta.mycelConnectedAt === null);

  // Probe 3: init() mit grünem Surface → isCertified=true, badge im DOM.
  await S.init({ badgeSelector: ".lamps" });
  const badge = g.document.querySelector("#sbkim-siegel-badge");
  record("3. init() grüner Surface-Check → isCertified=true + Badge im DOM",
    "certified=true, badge im DOM",
    `cert=${S.isCertified()}/badge=${!!badge}`,
    S.isCertified() === true && !!badge);

  // Probe 4: Badge Bronze-Initial — data-stufe="bronze", aria-label,
  // KEIN title-Attribut (Pflege 17 Doppel-Tooltip-Klausel).
  const stufeInitial = badge && badge.getAttribute("data-stufe");
  const ariaInitial = badge && badge.getAttribute("aria-label");
  const titleInitial = badge && badge.getAttribute("title");
  record("4. Badge Bronze-Initial: data-stufe=\"bronze\", aria-label=\"… im Mycel, ruhend\", KEIN title",
    "bronze / im Mycel, ruhend / kein title",
    `stufe=${stufeInitial}/aria="${ariaInitial}"/title=${titleInitial}`,
    stufeInitial === "bronze" &&
    ariaInitial === "SBKIM-Siegel · im Mycel, ruhend" &&
    titleInitial === null);

  // Probe 5: Der dynamische „Mycel-Aktivität"-Aspekt (since 2026-05-26,
  // module 16) ist in ZERTIFIKAT_ASPEKTE vorhanden. Er muss NICHT mehr der
  // letzte Eintrag sein (Pflege 2026-06-07 hängt einen weiteren Aspekt an),
  // wird aber über since/module identifiziert (entspricht isAspect4).
  const aspects = S.getAspects();
  const aspect4 = aspects.find(a => a.since === "2026-05-26" && a.module === "16" &&
    a.aspect.indexOf("Mycel-Aktivität") === 0);
  record("5. ZERTIFIKAT_ASPEKTE enthält Aspekt „Mycel-Aktivität\" (since 2026-05-26, module 16)",
    "Aspekt mit since=2026-05-26, module=16, aspect beginnt mit „Mycel-Aktivität\"",
    `count=${aspects.length}/gefunden=${!!aspect4}/since=${aspect4 && aspect4.since}/module=${aspect4 && aspect4.module}`,
    aspects.length >= 4 && !!aspect4);

  // Probe 6: Dispatch sbkim:handshake outcome:"established" → Gold.
  dispatchHandshake(g, { outcome: "established", peerNodeId: "peer1", direction: "outgoing" });
  const stufeNachHandshake = badge && badge.getAttribute("data-stufe");
  const ariaNachHandshake = badge && badge.getAttribute("aria-label");
  const klasseNachHandshake = badge && badge._classes.has("stufenwechsel-gold");
  record("6. sbkim:handshake outcome:\"established\" → data-stufe=\"gold\" + aria + Klasse stufenwechsel-gold",
    "gold / im Mycel, aktiv / Klasse stufenwechsel-gold gesetzt",
    `stufe=${stufeNachHandshake}/aria="${ariaNachHandshake}"/klasse=${klasseNachHandshake}`,
    stufeNachHandshake === "gold" &&
    ariaNachHandshake === "SBKIM-Siegel · im Mycel, aktiv" &&
    klasseNachHandshake === true);

  // Probe 7: _meta.mycelConnected===true + mycelConnectedAt ISO-Datum.
  const connectedAtErsteWelle = S._meta.mycelConnectedAt;
  record("7. _meta.mycelConnected===true + _meta.mycelConnectedAt ISO-Datum (ISO 8601)",
    "true + ISO-String",
    `connected=${S._meta.mycelConnected}/at=${connectedAtErsteWelle}`,
    S._meta.mycelConnected === true &&
    typeof connectedAtErsteWelle === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(connectedAtErsteWelle));

  // Probe 8: Idempotenz — zweiter Dispatch ändert mycelConnectedAt NICHT.
  await new Promise(r => setTimeout(r, 10));
  dispatchHandshake(g, { outcome: "established", peerNodeId: "peer2", direction: "incoming" });
  const connectedAtZweiteWelle = S._meta.mycelConnectedAt;
  record("8. Idempotent: zweiter Handshake → mycelConnectedAt UNVERÄNDERT",
    "Datum bleibt gleich",
    `erste=${connectedAtErsteWelle}/zweite=${connectedAtZweiteWelle}`,
    connectedAtErsteWelle === connectedAtZweiteWelle);

  // Probe 9: Dispatch outcome:"rejected" → KEIN Stufenwechsel (Reset
  // erst auf Bronze, dann rejected dispatchen).
  S._resetMycelConnectedForTest();
  const stufeNachReset = badge && badge.getAttribute("data-stufe");
  dispatchHandshake(g, { outcome: "rejected", peerNodeId: "peerX", direction: "outgoing" });
  const stufeNachRejected = badge && badge.getAttribute("data-stufe");
  record("9. outcome:\"rejected\" → no-op (Stufe bleibt Bronze)",
    "stufe bleibt bronze + mycelConnected bleibt false",
    `nachReset=${stufeNachReset}/nachRejected=${stufeNachRejected}/connected=${S._meta.mycelConnected}`,
    stufeNachReset === "bronze" &&
    stufeNachRejected === "bronze" &&
    S._meta.mycelConnected === false);

  // Probe 10: Dispatch ohne detail → no-op, kein Throw.
  let throwOhneDetail = false;
  try {
    g.dispatchEvent(new g.CustomEvent("sbkim:handshake"));
  } catch (e) {
    throwOhneDetail = true;
  }
  record("10. Dispatch sbkim:handshake ohne detail → no-op, kein Throw",
    "kein Throw, Stufe bleibt Bronze",
    `throw=${throwOhneDetail}/stufe=${badge.getAttribute("data-stufe")}/connected=${S._meta.mycelConnected}`,
    throwOhneDetail === false &&
    badge.getAttribute("data-stufe") === "bronze" &&
    S._meta.mycelConnected === false);

  // Probe 11: Dispatch mit detail:null/undefined → no-op.
  let throwMitNull = false;
  try {
    g.dispatchEvent(new g.CustomEvent("sbkim:handshake", { detail: null }));
  } catch (e) {
    throwMitNull = true;
  }
  record("11. Dispatch sbkim:handshake detail:null → no-op, kein Throw",
    "kein Throw, Stufe bleibt Bronze",
    `throw=${throwMitNull}/stufe=${badge.getAttribute("data-stufe")}`,
    throwMitNull === false &&
    badge.getAttribute("data-stufe") === "bronze" &&
    S._meta.mycelConnected === false);

  // Probe 12: _resetMycelConnectedForTest setzt Gold → Bronze zurück.
  // Zuerst auf Gold setzen, dann Reset.
  dispatchHandshake(g, { outcome: "established", peerNodeId: "peer3", direction: "outgoing" });
  const stufeVorReset = badge.getAttribute("data-stufe");
  S._resetMycelConnectedForTest();
  record("12. _resetMycelConnectedForTest: Gold → Bronze + mycelConnectedAt=null",
    "stufe wird wieder bronze, mycelConnectedAt=null",
    `vor=${stufeVorReset}/nach=${badge.getAttribute("data-stufe")}/connected=${S._meta.mycelConnected}/at=${S._meta.mycelConnectedAt}`,
    stufeVorReset === "gold" &&
    badge.getAttribute("data-stufe") === "bronze" &&
    S._meta.mycelConnected === false &&
    S._meta.mycelConnectedAt === null);

  // Probe 13: Modal-Bronze-Hinweis-Block sichtbar in Bronze, KEIN
  // [Andocken]-Knopf mehr und kein „Modul 18"-Text (Pflege 2026-06-07:
  // Modul-18-Pfad entfernt). Der „Mycel-Aktivität"-Aspekt trägt den
  // „pending"-Marker (nicht mehr zwingend der letzte Listen-Eintrag).
  badge.click();
  await new Promise(r => setTimeout(r, 20));
  const modal = g.document.querySelector("#sbkim-siegel-modal");
  const hinweisBlock = modal && modal.querySelector("[data-siegel-bronze-hinweis]");
  const hinweisDisplay = hinweisBlock && hinweisBlock.style.display;
  const andockBtn = modal && modal.querySelector("[data-siegel-andock-btn]");
  const hinweisText = hinweisBlock ? hinweisBlock.textContent : "";
  const aspectItems = modal ? Array.from(modal.querySelectorAll("[data-siegel-aspects] li")) : [];
  const mycelItem = aspectItems.find(li => /Mycel-Aktivität/.test(li.textContent));
  record("13. Modal in Bronze: Hinweis sichtbar, KEIN Andock-Knopf, kein „Modul 18\", Aspekt „pending\"",
    "Hinweis sichtbar (display!=none), kein [data-siegel-andock-btn], kein „Modul 18\", Mycel-Aspekt enthält „pending\"",
    `hinweis_da=${!!hinweisBlock}/display=${hinweisDisplay}/andock=${!!andockBtn}/modul18=${/Modul 18/.test(hinweisText)}/pending=${mycelItem && /pending/.test(mycelItem.textContent)}`,
    !!hinweisBlock && hinweisDisplay !== "none" &&
    !andockBtn && !/Modul 18/.test(hinweisText) &&
    !!mycelItem && /pending/.test(mycelItem.textContent));

  // Probe 14: Nach Gold-Wechsel: Hinweis-Block ausgeblendet, der
  // „Mycel-Aktivität"-Aspekt rendert mit Datum (statt pending).
  dispatchHandshake(g, { outcome: "established", peerNodeId: "peer4", direction: "outgoing" });
  // Modal ist noch offen — renderModalContents() wird im Handler
  // gerufen wenn modalOpen===true.
  const hinweisDisplayGold = hinweisBlock && hinweisBlock.style.display;
  const aspectItemsGold = modal ? Array.from(modal.querySelectorAll("[data-siegel-aspects] li")) : [];
  const mycelItemGold = aspectItemsGold.find(li => /Mycel-Aktivität/.test(li.textContent));
  const mycelTextGold = mycelItemGold ? mycelItemGold.textContent : "";
  record("14. Modal nach Gold: Hinweis-Block ausgeblendet, Aspekt „Mycel-Aktivität\" rendert Datum",
    "Hinweis display:none, Mycel-Aspekt enthält Datum 2026-05-26 statt „pending\"",
    `display=${hinweisDisplayGold}/datum_in_text=${/2026-05-26/.test(mycelTextGold)}/pending_weg=${!/pending/.test(mycelTextGold)}`,
    hinweisDisplayGold === "none" &&
    /2026-05-26/.test(mycelTextGold) &&
    !/pending/.test(mycelTextGold));

  // Probe 15: Pflege 2026-06-07 — sauberer Andock-/Identitäts-Pfad. Der
  // Bronze-Hinweis-Block trägt KEINEN eigenen Andock-Knopf, KEINE
  // Info-Notiz und KEINEN „Modul 18"-Verweis mehr; er weist nur auf den
  // „🔑 …"-Identitäts-Knopf hin (vom Host eingehängt).
  S._resetMycelConnectedForTest();
  const andockBtnNew = modal && modal.querySelector("[data-siegel-andock-btn]");
  const infoNotiz = modal && modal.querySelector("[data-siegel-andock-info]");
  const hinweisTextClean = hinweisBlock ? hinweisBlock.textContent : "";
  record("15. Sauberer Pfad: kein Andock-Knopf, kein „Modul 18\", Verweis auf 🔑-Knopf",
    "kein [data-siegel-andock-btn], keine Info-Notiz, kein „Modul 18\", Text nennt Identitäts-Knopf",
    `andockBtn=${!!andockBtnNew}/infoNotiz=${!!infoNotiz}/modul18=${/Modul 18/.test(hinweisTextClean)}/nennt_knopf=${/Eigene Identität & Spore/.test(hinweisTextClean)}`,
    !andockBtnNew && !infoNotiz &&
    !/Modul 18/.test(hinweisTextClean) &&
    /Eigene Identität & Spore/.test(hinweisTextClean));

  // Probe 16: Pflege Modal-Local-Time 2026-05-26 (Sub-(e)-Folge-Pflege 3/3).
  // Modal-Datum „Bezeugt seit YYYY-MM-DD, HH:MM Uhr" muss aus LOKALEN
  // Date-Methoden (getHours/getMinutes/etc.) gebaut werden, nicht aus
  // UTC-ISO-Split (toISOString().slice). Klaus' Befund DeX-Chrome: das
  // Modal zeigte vorher UTC-Zeit statt MESZ-lokal. Test: Stub-Datum +
  // Verifikation, dass dateLine.textContent KEINE UTC-Hour-Werte enthält
  // wenn lokale Zeitzone abweicht.
  // Wir setzen ein bekanntes ISO-Datum mit klarer UTC-Hour (T18:42),
  // erzeugen das Modul-16-Modal frisch und prüfen den dateLine-Text.
  // Lokale Zone hängt von der Laufumgebung ab — wir prüfen daher die
  // GEFORDERTE Konsistenz: der gerenderte Hour-Wert muss der LOKALEN
  // Stunde aus `new Date(certifiedAt).getHours()` entsprechen.
  // Modal ist nach den vorigen Proben noch offen (modal-Variable).
  // dateLine aus dem bestehenden Modal abrufen.
  const dateLineLT = modal && modal.querySelector("[data-siegel-date]");
  const certIso = S._meta.certifiedAt;
  const expectedDate = new Date(certIso);
  const expectedHH = String(expectedDate.getHours()).padStart(2, "0");
  const expectedMM = String(expectedDate.getMinutes()).padStart(2, "0");
  const expectedTimePart = expectedHH + ":" + expectedMM;
  // ISO-UTC-Hour zum Abgleich (würde verwendet werden bei dem alten
  // toISOString().slice-Bug).
  const utcHH = String(expectedDate.getUTCHours()).padStart(2, "0");
  const utcTimePart = utcHH + ":" + String(expectedDate.getUTCMinutes()).padStart(2, "0");
  const dateText = dateLineLT && dateLineLT.textContent;
  const hatLokaleZeit = dateText && dateText.includes(expectedTimePart);
  record("16. Modal-Datum lokal: Bezeugt seit … HH:MM aus lokalen Date-Methoden (Pflege Modal-Local-Time)",
    "dateLine enthält lokale getHours():getMinutes() (UTC-Pfad würde abweichen wenn TZ != UTC)",
    `dateText=\"${dateText && dateText.slice(0, 60)}\"/expectedLokal=${expectedTimePart}/utcWaere=${utcTimePart}/hatLokaleZeit=${hatLokaleZeit}`,
    !!hatLokaleZeit);

  // ---- Ergebnis ----
  const ok = results.filter(r => r.ok).length;
  const total = results.length;
  for (const r of results) {
    const tag = r.ok ? "  OK" : "FAIL";
    console.log(tag + "  " + r.probe + "  →  " + (r.ok ? "" : "expected=" + JSON.stringify(r.expected) + " actual=" + JSON.stringify(r.actual)));
  }
  console.log("\n" + ok + "/" + total + " grün");
  if (ok !== total) process.exitCode = 1;
}

run().catch(err => { console.error("smoke crashed", err); process.exit(2); });
