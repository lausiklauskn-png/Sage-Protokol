// Headless smoke test for Bau 17 — Modul 17 Floating-Widget.
// Run with `node tests/smoke_bau17_floating_widget.mjs`.
//
// Stubs: DOM (document.body/head, createElement, classList, querySelector,
// addEventListener/dispatchEvent + CustomEvent, getBoundingClientRect),
// localStorage, setTimeout/clearTimeout. Modul 17 ist Browser-Only — wir
// liefern alle benötigten Globals als Minimal-Stubs nach.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- Minimal-DOM-Stub ----

function makeStubElement(tagName, doc) {
  const el = {
    tagName: tagName.toUpperCase(),
    nodeType: 1,
    id: "",
    className: "",
    textContent: "",
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
  el.insertBefore = (child, ref) => {
    if (child.parentNode) {
      const idx = child.parentNode.children.indexOf(child);
      if (idx >= 0) child.parentNode.children.splice(idx, 1);
    }
    const i = ref ? el.children.indexOf(ref) : -1;
    if (i >= 0) el.children.splice(i, 0, child);
    else el.children.push(child);
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
    el.dispatchEvent({ type: "click", target: el, stopPropagation: () => {} });
  };
  el.querySelector = (sel) => queryFirst(el, sel);
  el.querySelectorAll = (sel) => queryAll(el, sel);
  el.contains = (other) => {
    if (!other) return false;
    let p = other;
    while (p) { if (p === el) return true; p = p.parentNode; }
    return false;
  };
  el.getBoundingClientRect = () => ({ left: 100, top: 100, right: 200, bottom: 200, width: 200, height: 48, x: 100, y: 100 });
  el.setPointerCapture = () => {};
  el.releasePointerCapture = () => {};
  Object.defineProperty(el, "innerHTML", {
    get: () => "",
    set: (v) => { /* no-op stub */ },
  });
  Object.defineProperty(el, "firstChild", {
    get: () => el.children[0] || null,
  });
  Object.defineProperty(el, "offsetWidth", {
    get: () => 200,
  });
  return el;
}

function matchSelector(el, sel) {
  // Support: "#id", ".class", "tag", and combinations like "#id.class", "tag.class"
  // Plus attribute selectors handled minimally.
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
  // tag or composite
  const tagMatch = sel.match(/^([a-zA-Z][a-zA-Z0-9-]*)?(.*)/);
  if (!tagMatch) return false;
  const tag = tagMatch[1];
  const rest = tagMatch[2];
  if (tag && el.tagName !== tag.toUpperCase()) return false;
  // parse rest for .class or #id
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
      // skip attribute matching detail
      r = r.slice(m[0].length);
    } else {
      return false;
    }
  }
  return true;
}

function walkAll(el, cb) {
  if (cb(el) === false) return;
  for (const c of el.children) walkAll(c, cb);
}

function queryFirst(root, sel) {
  let found = null;
  walkAll(root, (el) => {
    if (found) return false;
    if (el !== root && matchSelector(el, sel)) { found = el; return false; }
    return true;
  });
  return found;
}

function queryAll(root, sel) {
  const out = [];
  walkAll(root, (el) => {
    if (el !== root && matchSelector(el, sel)) out.push(el);
  });
  return out;
}

function makeStubDocument() {
  const doc = {};
  doc.nodeType = 9;
  doc.createElement = (tag) => makeStubElement(tag, doc);
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
  doc.createEvent = (type) => {
    const ev = { type: "", bubbles: false, cancelable: false };
    ev.initEvent = (t, b, c) => { ev.type = t; ev.bubbles = !!b; ev.cancelable = !!c; };
    return ev;
  };
  return doc;
}

function makeStubLocalStorage() {
  const store = new Map();
  return {
    getItem: (k) => store.has(k) ? store.get(k) : null,
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => { store.clear(); },
    _dump: () => Object.fromEntries(store),
  };
}

function makeStubGlobal() {
  const stub = {};
  const windowListeners = {};
  stub.document = makeStubDocument();
  stub.localStorage = makeStubLocalStorage();
  stub.innerWidth = 1024;
  stub.innerHeight = 768;
  stub.console = console;
  stub.setTimeout = setTimeout;
  stub.clearTimeout = clearTimeout;
  stub.setInterval = setInterval;
  stub.clearInterval = clearInterval;
  stub.Date = Date;
  stub.JSON = JSON;
  stub.Math = Math;
  stub.Promise = Promise;
  stub.Map = Map;
  stub.Set = Set;
  stub.Array = Array;
  stub.Object = Object;
  stub.MutationObserver = function () {
    return {
      observe: () => {},
      disconnect: () => {},
    };
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
  return stub;
}

function loadModuleInto(stubGlobal, relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  const wrapped = new Function(
    "window", "globalThis", "self", "console",
    "document", "localStorage", "innerWidth", "innerHeight",
    "addEventListener", "removeEventListener", "dispatchEvent", "CustomEvent",
    "setTimeout", "clearTimeout", "setInterval", "clearInterval",
    "MutationObserver", "Date", "JSON", "Math", "Promise", "Map", "Set",
    "Array", "Object",
    src,
  );
  wrapped(
    stubGlobal, stubGlobal, stubGlobal, console,
    stubGlobal.document, stubGlobal.localStorage, stubGlobal.innerWidth, stubGlobal.innerHeight,
    stubGlobal.addEventListener.bind(stubGlobal),
    stubGlobal.removeEventListener.bind(stubGlobal),
    stubGlobal.dispatchEvent.bind(stubGlobal),
    stubGlobal.CustomEvent,
    stubGlobal.setTimeout, stubGlobal.clearTimeout,
    stubGlobal.setInterval, stubGlobal.clearInterval,
    stubGlobal.MutationObserver,
    stubGlobal.Date, stubGlobal.JSON, stubGlobal.Math, stubGlobal.Promise,
    stubGlobal.Map, stubGlobal.Set, stubGlobal.Array, stubGlobal.Object,
  );
}

// ---- Test-Harness ----

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

function dispatchWindowEvent(g, type, detail) {
  return g.dispatchEvent(new g.CustomEvent(type, { detail }));
}

// ---- Test-Suite ----

async function run() {
  // -------- Setup mit allen vier Slots (Default), Modul 16 NICHT certified --------
  const g = makeStubGlobal();
  loadModuleInto(g, "src/modules/17_floating_widget.js");
  const W = g.SbkimWidget;
  if (!W) throw new Error("SbkimWidget wurde nicht registriert");

  // Probe 1: Selbstcheck-Symbole sind verfügbar (init/show/hide/...).
  record("1. Public Surface verfügbar",
    "init/show/hide/isVisible/getPosition + _meta",
    Object.keys(W).sort().join(","),
    typeof W.init === "function" && typeof W.show === "function" &&
    typeof W.hide === "function" && typeof W.isVisible === "function" &&
    typeof W.getPosition === "function" && typeof W._meta === "object");

  // Probe 2: init() ist idempotent, mounted Pille in body, injiziert Style.
  await W.init({});
  const styleEl = g.document.getElementById("sbkim-widget-style");
  const widgetEl = g.document.getElementById("sbkim-widget");
  record("2. init() mountet Pille in body + Style in head",
    "widget+style+ready",
    `widget=${!!widgetEl}/style=${!!styleEl}/ready=${W._meta.ready}/mounted=${W._meta.widgetMounted}`,
    !!widgetEl && !!styleEl && W._meta.ready === true && W._meta.widgetMounted === true);

  // Probe 3: Vier Slot-Buttons, SIEGEL aber NICHT im DOM (Modul 16 fehlt).
  const lebtSlot = g.document.getElementById("sbkim-widget-slot-lebt");
  const verkehrSlot = g.document.getElementById("sbkim-widget-slot-verkehr");
  const fremdSlot = g.document.getElementById("sbkim-widget-slot-fremd");
  const siegelSlot = g.document.getElementById("sbkim-widget-slot-siegel");
  record("3. Drei Slots (LEBT/VERKEHR/FREMD) im DOM, SIEGEL NICHT (Modul 16 fehlt)",
    "lebt+verkehr+fremd vorhanden, siegel NICHT",
    `lebt=${!!lebtSlot}/verkehr=${!!verkehrSlot}/fremd=${!!fremdSlot}/siegel=${!!siegelSlot}`,
    !!lebtSlot && !!verkehrSlot && !!fremdSlot && !siegelSlot);

  // Probe 4: Proxy-Container hat #lamp-fremd + #sbkim-siegel-badge.
  const lampProxy = g.document.getElementById("lamp-fremd");
  const siegelProxy = g.document.getElementById("sbkim-siegel-badge");
  record("4. Proxy-DOM-Bridge: #lamp-fremd + #sbkim-siegel-badge im Widget",
    "beide Proxy-Spans im Widget gemountet",
    `lamp=${!!lampProxy}/siegel=${!!siegelProxy}`,
    !!lampProxy && !!siegelProxy &&
    widgetEl.contains(lampProxy) && widgetEl.contains(siegelProxy));

  // Probe 5: sbkim:alive → LEBT-Slot active + eventCounts.alive == 1.
  dispatchWindowEvent(g, "sbkim:alive", { since: "2026-05-25T12:00:00.000Z", nodeId: "test_node_id_12345_long" });
  record("5. sbkim:alive → LEBT.active + eventCounts.alive=1",
    "active=true, count=1, since gesetzt, nodeId-Präfix erste 12 Zeichen",
    `active=${lebtSlot._classes.has("active")}/count=${W._meta.eventCounts.alive}/since=${W._meta.lebtSince}/prefix=${W._meta.lebtNodeIdPrefix}`,
    lebtSlot._classes.has("active") === true && W._meta.eventCounts.alive === 1 &&
    W._meta.lebtSince === "2026-05-25T12:00:00.000Z" &&
    W._meta.lebtNodeIdPrefix === "test_node_id");

  // Probe 6: sbkim:handshake → VERKEHR.active + traffic-log+1.
  dispatchWindowEvent(g, "sbkim:handshake", { outcome: "established", peerNodeId: "peer1", direction: "outgoing" });
  record("6. sbkim:handshake → VERKEHR.active + trafficLogSize=1",
    "active=true, log=1, source=handshake",
    `active=${verkehrSlot._classes.has("active")}/size=${W._meta.trafficLogSize}`,
    verkehrSlot._classes.has("active") === true && W._meta.trafficLogSize === 1 &&
    W._meta.trafficLogSnapshot[0].source === "handshake");

  // Probe 7: sbkim:postmessage → VERKEHR + trafficLog+1.
  dispatchWindowEvent(g, "sbkim:postmessage", { op: "sporeRef", direction: "incoming", decision: "accepted" });
  record("7. sbkim:postmessage → trafficLogSize=2, neuer Eintrag source=postmessage",
    "size=2, source=postmessage",
    `size=${W._meta.trafficLogSize}/source=${W._meta.trafficLogSnapshot[1].source}`,
    W._meta.trafficLogSize === 2 && W._meta.trafficLogSnapshot[1].source === "postmessage" &&
    W._meta.eventCounts.postmessage === 1);

  // Probe 8: sbkim:fremd-alert (bufferSize:2) → FREMD active.
  dispatchWindowEvent(g, "sbkim:fremd-alert", { kind: "endpoint-probe", decision: "accepted", bufferSize: 2 });
  record("8. sbkim:fremd-alert (bufferSize:2) → FREMD.active + counts.fremdAlert=1",
    "active=true, bufferSize=2, count=1",
    `active=${fremdSlot._classes.has("active")}/buf=${W._meta.fremdBufferSize}/count=${W._meta.eventCounts.fremdAlert}`,
    fremdSlot._classes.has("active") === true && W._meta.fremdBufferSize === 2 &&
    W._meta.eventCounts.fremdAlert === 1);

  // Probe 9: sbkim:fremd-alert OHNE bufferSize-Feld → Slot bleibt aktiv-Klasse
  // unverändert (Slot bleibt im vorherigen Zustand, kein Throw). Karte 17 §
  // Fehlerverhalten: „Slot bleibt grau, kein Throw (fail-soft Schema-Check)".
  // Zähler wird trotzdem inkrementiert, weil der Event empfangen wurde.
  const fremdBufferBefore = W._meta.fremdBufferSize;
  dispatchWindowEvent(g, "sbkim:fremd-alert", { kind: "endpoint-probe", decision: "accepted" }); // bufferSize fehlt
  record("9. sbkim:fremd-alert OHNE bufferSize → fremdBufferSize UNVERÄNDERT (Schema-Reject)",
    "bufferSize UNVERÄNDERT (fail-soft, Slot-Zustand bleibt)",
    `before=${fremdBufferBefore}/after=${W._meta.fremdBufferSize}`,
    W._meta.fremdBufferSize === fremdBufferBefore);

  // Probe 10: sbkim:siegel-certified OHNE Modul 16 (isCertified missing) → kein DOM-Mount + Warn.
  const warningsBefore = [];
  const origWarn = console.warn;
  console.warn = (...args) => { warningsBefore.push(args.join(" ")); };
  try {
    dispatchWindowEvent(g, "sbkim:siegel-certified", { certifiedAt: "2026-05-25T12:00:00.000Z", repoUrl: "https://example/repo/" });
  } finally {
    console.warn = origWarn;
  }
  const siegelAfter = g.document.getElementById("sbkim-widget-slot-siegel");
  record("10. sbkim:siegel-certified OHNE Modul 16 → KEIN DOM-Mount (Anti-Greenwashing) + Warn",
    "siegel slot=null + warn-Zeile",
    `slot=${!!siegelAfter}/warns=${warningsBefore.filter(w => w.includes("Anti-Greenwashing")).length}`,
    !siegelAfter && warningsBefore.filter(w => w.includes("Anti-Greenwashing")).length >= 1 &&
    W._meta.siegelMounted === false);

  // Probe 11: Modul 16 simulieren (isCertified=true) + Event → SIEGEL ins DOM.
  g.SbkimSiegel = { isCertified: () => true };
  dispatchWindowEvent(g, "sbkim:siegel-certified", { certifiedAt: "2026-05-25T12:00:00.000Z", repoUrl: "https://example/repo/" });
  const siegelMounted = g.document.getElementById("sbkim-widget-slot-siegel");
  record("11. Modul-16-Stub + sbkim:siegel-certified → SIEGEL-Slot im DOM + firstBootShown=true",
    "slot in DOM, firstBootShown=true, counts.siegelCertified=1",
    `slot=${!!siegelMounted}/firstBoot=${W._meta.firstBootShown}/count=${W._meta.eventCounts.siegelCertified}`,
    !!siegelMounted && W._meta.firstBootShown === true &&
    W._meta.eventCounts.siegelCertified === 1 && W._meta.siegelMounted === true &&
    W._meta.siegelCertifiedAt === "2026-05-25T12:00:00.000Z");

  // Probe 12: Traffic-Log FIFO max 10.
  for (let i = 0; i < 15; i++) {
    dispatchWindowEvent(g, "sbkim:handshake", { outcome: "established", peerNodeId: "p" + i, direction: "outgoing" });
  }
  record("12. Traffic-Log FIFO max 10 — nach 15 Events bleibt size=10",
    "size=10",
    `size=${W._meta.trafficLogSize}`,
    W._meta.trafficLogSize === 10);

  // Probe 13: hide()/show()/isVisible() + localStorage-Persistierung.
  W.hide();
  const visibleAfterHide = W.isVisible();
  const lsVisAfterHide = g.localStorage.getItem("sbkim_widget_visible");
  W.show();
  const visibleAfterShow = W.isVisible();
  const lsVisAfterShow = g.localStorage.getItem("sbkim_widget_visible");
  record("13. hide/show/isVisible + localStorage-Persistierung",
    "hide→false+ls=false; show→true+ls=true",
    `hide=${visibleAfterHide}/lsHide=${lsVisAfterHide}/show=${visibleAfterShow}/lsShow=${lsVisAfterShow}`,
    visibleAfterHide === false && lsVisAfterHide === "false" &&
    visibleAfterShow === true && lsVisAfterShow === "true");

  // Probe 14: Selbstcheck-Zeile (in g.console.info → process console).
  // Wir prüfen, dass die Selbstcheck-Zeile beim Load passierte. Schwierig
  // headless — wir lesen das _meta-Feld als Beleg, dass das Modul „loaded".
  record("14. Selbstcheck-Marker via _meta (Modul wurde geladen + registriert)",
    "_meta-Objekt mit widgetId=sbkim-widget",
    `widgetId=${W._meta.widgetId}/styleId=${W._meta.styleId}`,
    W._meta.widgetId === "sbkim-widget" && W._meta.styleId === "sbkim-widget-style");

  // Probe 15: getPosition liefert defensive Kopie + Default-Werte bei Free-Drag null.
  const pos = W.getPosition();
  record("15. getPosition() liefert defensive Kopie mit Default-Corner",
    "{corner:bottom-right, offsetX:16, offsetY:16}",
    JSON.stringify(pos),
    pos && (pos.corner === "bottom-right" || pos.corner === null) &&
    typeof pos.offsetX === "number" && typeof pos.offsetY === "number");

  // Probe 16: Slot-Whitelist via 2. init() — Wegen Idempotenz ist 2. init() no-op;
  // wir verifizieren stattdessen, dass slots-Array korrekt geliefert wird.
  record("16. _meta.slots[] entspricht enabledSlots-Liste",
    "alle vier Slots (Default-Aktivierung)",
    W._meta.slots.join(","),
    Array.isArray(W._meta.slots) && W._meta.slots.length === 4 &&
    W._meta.slots.join(",") === "lebt,verkehr,fremd,siegel");

  // -------- Zweiter Test-Lauf: slots-Whitelist + localStorage-Reset --------
  // Frischer Global, weil init() idempotent ist.
  const g2 = makeStubGlobal();
  loadModuleInto(g2, "src/modules/17_floating_widget.js");
  const W2 = g2.SbkimWidget;
  await W2.init({ slots: ["lebt", "siegel"] });
  const lebt2 = g2.document.getElementById("sbkim-widget-slot-lebt");
  const verkehr2 = g2.document.getElementById("sbkim-widget-slot-verkehr");
  const fremd2 = g2.document.getElementById("sbkim-widget-slot-fremd");
  record("17. Slot-Whitelist {slots:[\"lebt\",\"siegel\"]} → VERKEHR + FREMD NICHT im DOM",
    "lebt vorhanden, verkehr+fremd NICHT",
    `lebt=${!!lebt2}/verkehr=${!!verkehr2}/fremd=${!!fremd2}`,
    !!lebt2 && !verkehr2 && !fremd2 && W2._meta.slots.join(",") === "lebt,siegel");

  // -------- Dritter Test-Lauf: defekter localStorage-Eintrag fail-soft --------
  const g3 = makeStubGlobal();
  g3.localStorage.setItem("sbkim_widget_position", "{not valid json");
  loadModuleInto(g3, "src/modules/17_floating_widget.js");
  const W3 = g3.SbkimWidget;
  await W3.init({});
  const pos3 = W3.getPosition();
  record("18. Defekter localStorage-Eintrag → fail-soft, Default-Position behält",
    "corner=bottom-right (Default)",
    JSON.stringify(pos3),
    pos3 && pos3.corner === "bottom-right");

  // -------- Vierter Test-Lauf: Modal-Bridge fail-soft ohne Modul 15 --------
  const g4 = makeStubGlobal();
  loadModuleInto(g4, "src/modules/17_floating_widget.js");
  const W4 = g4.SbkimWidget;
  await W4.init({});
  // FREMD-Slot click → sollte den Proxy-#lamp-fremd „klicken". Da Modul 15
  // nicht gemountet ist, gibt es keinen Click-Handler, also no-op. Wir
  // prüfen, dass kein Throw passiert.
  let crashed = false;
  try {
    const slot = g4.document.getElementById("sbkim-widget-slot-fremd");
    slot.click();
  } catch (err) {
    crashed = true;
  }
  record("19. FREMD-Slot-Click ohne Modul 15 → fail-soft, kein Throw",
    "kein Crash",
    crashed ? "CRASH" : "OK",
    !crashed);

  // -------- Fünfter Test-Lauf: Pflege 17 UX minimize/maximize --------
  const g5 = makeStubGlobal();
  loadModuleInto(g5, "src/modules/17_floating_widget.js");
  const W5 = g5.SbkimWidget;
  await W5.init({});
  // Pflege 17 UX: minimize/maximize/isMinimized verfügbar.
  record("20. minimize/maximize/isMinimized auf Public Surface",
    "drei Funktionen + lsKeyMinimized im _meta",
    "min=" + typeof W5.minimize + "/max=" + typeof W5.maximize + "/is=" + typeof W5.isMinimized + "/ls=" + W5._meta.lsKeyMinimized,
    typeof W5.minimize === "function" && typeof W5.maximize === "function" &&
    typeof W5.isMinimized === "function" && W5._meta.lsKeyMinimized === "sbkim_widget_minimized");

  // minimize() ohne SIEGEL → data-minimized + data-fallback="lebt" am Root.
  const widget5 = g5.document.getElementById("sbkim-widget");
  W5.minimize();
  const minState1 = {
    isMinimized: W5.isMinimized(),
    dataMinimized: widget5.getAttribute("data-minimized"),
    dataFallback: widget5.getAttribute("data-fallback"),
    lsValue: g5.localStorage.getItem("sbkim_widget_minimized"),
  };
  record("21. minimize() ohne SIEGEL → data-minimized=true + data-fallback=lebt + localStorage",
    "minimized true, fallback lebt, ls true",
    JSON.stringify(minState1),
    minState1.isMinimized === true && minState1.dataMinimized === "true" &&
    minState1.dataFallback === "lebt" && minState1.lsValue === "true");

  // SIEGEL mounten via Event + Mock → data-fallback weg.
  g5.SbkimSiegel = { isCertified: () => true };
  dispatchWindowEvent(g5, "sbkim:siegel-certified", { certifiedAt: "2026-05-25T12:00:00.000Z", repoUrl: "https://example/" });
  record("22. SIEGEL gemountet während minimiert → data-fallback entfernt (SIEGEL ist sichtbar)",
    "fallback null, minimized bleibt true",
    "minimized=" + W5.isMinimized() + "/fallback=" + widget5.getAttribute("data-fallback") + "/siegelMounted=" + W5._meta.siegelMounted,
    W5.isMinimized() === true && widget5.getAttribute("data-fallback") === null &&
    W5._meta.siegelMounted === true);

  // maximize() → data-minimized weg, localStorage false.
  W5.maximize();
  record("23. maximize() → data-minimized weg + localStorage false",
    "minimized false, attr null, ls false",
    "min=" + W5.isMinimized() + "/attr=" + widget5.getAttribute("data-minimized") + "/ls=" + g5.localStorage.getItem("sbkim_widget_minimized"),
    W5.isMinimized() === false && widget5.getAttribute("data-minimized") === null &&
    g5.localStorage.getItem("sbkim_widget_minimized") === "false");

  // localStorage-Persistierung: frische Init mit gesetztem Wert.
  const g6 = makeStubGlobal();
  g6.localStorage.setItem("sbkim_widget_minimized", "true");
  loadModuleInto(g6, "src/modules/17_floating_widget.js");
  await g6.SbkimWidget.init({});
  record("24. localStorage minimized=true wird beim init() gelesen",
    "isMinimized=true nach init",
    "isMin=" + g6.SbkimWidget.isMinimized() + "/dataAttr=" + g6.document.getElementById("sbkim-widget").getAttribute("data-minimized"),
    g6.SbkimWidget.isMinimized() === true &&
    g6.document.getElementById("sbkim-widget").getAttribute("data-minimized") === "true");

  // Slot-Buttons enthalten Label-Span (Sage-Page-Stil: Lampe + Text-Label
  // nebeneinander). SIEGEL hat zusätzlich einen ★-Glyph-Span.
  const lebtBtn5 = g5.document.getElementById("sbkim-widget-slot-lebt");
  const verkBtn5 = g5.document.getElementById("sbkim-widget-slot-verkehr");
  const fremdBtn5 = g5.document.getElementById("sbkim-widget-slot-fremd");
  const siegelBtn5 = g5.document.getElementById("sbkim-widget-slot-siegel");
  function findLabel(btn) {
    for (const c of btn.children) {
      if (c._classes && c._classes.has("sbkim-widget-label")) return c.textContent;
    }
    return null;
  }
  function findGlyph(btn) {
    for (const c of btn.children) {
      if (c._classes && c._classes.has("sbkim-widget-siegel-glyph")) return c.textContent;
    }
    return null;
  }
  record("25. Pflege UX 1:1 Sage-Page: Label-Span pro Slot (lebt/verkehr/fremd/siegel)",
    "Labels gesetzt, SIEGEL hat zusätzlich ★-Glyph",
    "lebt='" + findLabel(lebtBtn5) + "'/verkehr='" + findLabel(verkBtn5) + "'/fremd='" + findLabel(fremdBtn5) + "'/siegel='" + findLabel(siegelBtn5) + "'/star='" + findGlyph(siegelBtn5) + "'",
    findLabel(lebtBtn5) === "lebt" && findLabel(verkBtn5) === "verkehr" &&
    findLabel(fremdBtn5) === "fremd" && findLabel(siegelBtn5) === "siegel" &&
    findGlyph(siegelBtn5) === "★");

  // Pflege Tooltips 2026-05-26: Tooltip-Text liegt jetzt NUR im aria-label
  // (title-Attribut wurde entfernt wegen Doppel-Tooltip auf DeX-Chrome).
  record("26. Tooltips voll im aria-label (title entfernt — Pflege Tooltips 2026-05-26)",
    "alle aria-label enthalten 'Klick öffnet', kein title",
    "lebt aria='" + (lebtBtn5._attributes["aria-label"] || "").slice(0, 40) + "...'",
    /Klick öffnet/.test(lebtBtn5._attributes["aria-label"] || "") &&
    /Klick öffnet/.test(verkBtn5._attributes["aria-label"] || "") &&
    /Klick öffnet/.test(fremdBtn5._attributes["aria-label"] || "") &&
    /Klick öffnet/.test(siegelBtn5._attributes["aria-label"] || "") &&
    !lebtBtn5.title && !verkBtn5.title && !fremdBtn5.title && !siegelBtn5.title);

  // -------- Sechster Test-Lauf: Theme "transparent" --------
  const g7 = makeStubGlobal();
  loadModuleInto(g7, "src/modules/17_floating_widget.js");
  await g7.SbkimWidget.init({ theme: "transparent" });
  const widget7 = g7.document.getElementById("sbkim-widget");
  record("27. theme:'transparent' setzt data-theme='transparent' am Root",
    "data-theme='transparent'",
    "attr=" + widget7.getAttribute("data-theme"),
    widget7.getAttribute("data-theme") === "transparent");

  // Pflege SIEGEL-Reihenfolge: SIEGEL-Slot wird beim async Mount VOR den
  // Aktions-Knöpfen (Minimize/Close) eingefügt — DOM-Reihenfolge:
  // LEBT, VERKEHR, FREMD, SIEGEL, Minimize, Close, Proxy.
  const g9 = makeStubGlobal();
  loadModuleInto(g9, "src/modules/17_floating_widget.js");
  await g9.SbkimWidget.init({});
  g9.SbkimSiegel = { isCertified: () => true };
  dispatchWindowEvent(g9, "sbkim:siegel-certified", { certifiedAt: "2026-05-25T00:00:00.000Z", repoUrl: "https://example/" });
  const widget9 = g9.document.getElementById("sbkim-widget");
  const childIds = widget9.children.map(c => c.id || c.className).filter(Boolean);
  const siegelIdx = childIds.indexOf("sbkim-widget-slot-siegel");
  const minimizeIdx = childIds.findIndex(s => s.indexOf("sbkim-widget-minimize") >= 0);
  const closeIdx = childIds.findIndex(s => s.indexOf("sbkim-widget-close") >= 0);
  record("28b. SIEGEL-Slot steht VOR Minimize + Close im DOM (Pflege Reihenfolge)",
    "siegelIdx < minimizeIdx < closeIdx",
    "siegel=" + siegelIdx + "/minimize=" + minimizeIdx + "/close=" + closeIdx,
    siegelIdx >= 0 && minimizeIdx > siegelIdx && closeIdx > minimizeIdx);

  // Default theme:"auto" setzt KEIN data-theme-Attribut.
  const g8 = makeStubGlobal();
  loadModuleInto(g8, "src/modules/17_floating_widget.js");
  await g8.SbkimWidget.init({});
  const widget8 = g8.document.getElementById("sbkim-widget");
  record("28. theme default 'auto' setzt KEIN data-theme-Attribut (CSS-Variablen-Pfad aktiv)",
    "data-theme attr = null",
    "attr=" + widget8.getAttribute("data-theme"),
    widget8.getAttribute("data-theme") === null);

  // Pflege Tooltips 2026-05-26: title-Attribut darf NICHT mehr gesetzt sein
  // auf Slot-Buttons + Icon-Buttons. aria-label bleibt voll.
  const lebtBtn8 = g8.document.getElementById("sbkim-widget-slot-lebt");
  const fremdBtn8 = g8.document.getElementById("sbkim-widget-slot-fremd");
  function hasTitle(el) {
    return el && (el._attributes.title !== undefined || (el.title && el.title.length > 0));
  }
  record("29. Pflege Tooltips: title-Attribut NICHT auf Slot-Buttons (nur aria-label)",
    "kein title attr, aria-label gesetzt",
    "lebt: title=" + hasTitle(lebtBtn8) + " aria=" + !!lebtBtn8._attributes["aria-label"] +
    " / fremd: title=" + hasTitle(fremdBtn8) + " aria=" + !!fremdBtn8._attributes["aria-label"],
    !hasTitle(lebtBtn8) && !hasTitle(fremdBtn8) &&
    /Klick öffnet/.test(lebtBtn8._attributes["aria-label"] || "") &&
    /Klick öffnet/.test(fremdBtn8._attributes["aria-label"] || ""));

  // Pflege Heartbeat 2026-05-26: Self-Heartbeat-Fallback nach 5 s.
  // Test setzt SbkimSpore._meta.ready=true (synthetic), wartet 5.5 s, prüft
  // dass sbkim:alive dispatched + LEBT.active gesetzt wurde.
  const gH = makeStubGlobal();
  loadModuleInto(gH, "src/modules/17_floating_widget.js");
  gH.SbkimSpore = { _meta: { ready: true } };
  await gH.SbkimWidget.init({});
  const beforeAliveH = gH.SbkimWidget._meta.eventCounts.alive;
  // SELF_HEARTBEAT_DELAY_MS ist 5000 — wir warten 5500 ms.
  await new Promise(r => setTimeout(r, 5500));
  const afterAliveH = gH.SbkimWidget._meta.eventCounts.alive;
  const lebtH = gH.document.getElementById("sbkim-widget-slot-lebt");
  record("30. Self-Heartbeat-Fallback: nach 5 s ohne sbkim:alive + SbkimSpore.ready=true → synthetic dispatch + LEBT.active",
    "alive +1, LEBT.active=true, selfHeartbeatFired=true",
    "before=" + beforeAliveH + " after=" + afterAliveH +
    " active=" + (lebtH && lebtH._classes.has("active")) +
    " fired=" + gH.SbkimWidget._meta.selfHeartbeatFired,
    afterAliveH === beforeAliveH + 1 &&
    lebtH && lebtH._classes.has("active") &&
    gH.SbkimWidget._meta.selfHeartbeatFired === true);

  // Self-Heartbeat-Anti-Greenwashing: ohne SbkimSpore.ready KEIN Dispatch.
  const gH2 = makeStubGlobal();
  loadModuleInto(gH2, "src/modules/17_floating_widget.js");
  // SbkimSpore nicht setzen → ready ist nicht true → kein synthetic dispatch.
  await gH2.SbkimWidget.init({});
  await new Promise(r => setTimeout(r, 5500));
  record("31. Self-Heartbeat-Anti-Greenwashing: ohne SbkimSpore.ready KEIN synthetic dispatch",
    "alive=0, LEBT.active=false, fired=false",
    "alive=" + gH2.SbkimWidget._meta.eventCounts.alive +
    " fired=" + gH2.SbkimWidget._meta.selfHeartbeatFired,
    gH2.SbkimWidget._meta.eventCounts.alive === 0 &&
    gH2.SbkimWidget._meta.selfHeartbeatFired === false);

  // -------- Siebter Test-Lauf: Pflege 17 Stufen-Render Bronze/Gold --------
  // Pflege 17 Stufen-Render 2026-05-26 (Sub-(e)-Sichttest-Befund 1):
  // sichtbarer SIEGEL-Slot bekommt data-siegel-stufe initial aus
  // SbkimSiegel._meta.siegelStufe (Bronze fail-soft Default), wechselt
  // auf Gold beim sbkim:handshake outcome:"established".
  const gS = makeStubGlobal();
  loadModuleInto(gS, "src/modules/17_floating_widget.js");
  // Modul-16-Stub mit _meta.siegelStufe-Getter — initial "bronze".
  let mockStufe = "bronze";
  gS.SbkimSiegel = {
    isCertified: () => true,
    _meta: { get siegelStufe() { return mockStufe; } },
  };
  await gS.SbkimWidget.init({});
  // SIEGEL ist beim init() schon im DOM, weil isCertified()===true (Probe
  // 11-Pfad). data-siegel-stufe muss initial "bronze" sein.
  const siegelSlotS = gS.document.getElementById("sbkim-widget-slot-siegel");
  record("32. Pflege Stufen-Render: SIEGEL-Slot initial data-siegel-stufe='bronze'",
    "attr=bronze, _meta.siegelStufeRendered=bronze, slot im DOM",
    "slot=" + !!siegelSlotS +
    "/attr=" + (siegelSlotS && siegelSlotS.getAttribute("data-siegel-stufe")) +
    "/rendered=" + gS.SbkimWidget._meta.siegelStufeRendered,
    !!siegelSlotS &&
    siegelSlotS.getAttribute("data-siegel-stufe") === "bronze" &&
    gS.SbkimWidget._meta.siegelStufeRendered === "bronze");

  // sbkim:handshake outcome:"established" → Slot wird Gold + Animations-
  // Klasse für 600 ms gesetzt.
  mockStufe = "gold"; // Modul 16 hätte _meta.siegelStufe jetzt auch auf gold
  dispatchWindowEvent(gS, "sbkim:handshake", { outcome: "established", peerNodeId: "peer1", direction: "outgoing" });
  const hasStufenwechselClass = siegelSlotS._classes.has("sbkim-widget-siegel-stufenwechsel");
  const stufeNach = siegelSlotS.getAttribute("data-siegel-stufe");
  record("33. Pflege Stufen-Render: sbkim:handshake established → Gold + Stufenwechsel-Animations-Klasse",
    "attr=gold, _meta.rendered=gold, .sbkim-widget-siegel-stufenwechsel direkt nach Dispatch true",
    "attr=" + stufeNach +
    "/rendered=" + gS.SbkimWidget._meta.siegelStufeRendered +
    "/anim=" + hasStufenwechselClass,
    stufeNach === "gold" &&
    gS.SbkimWidget._meta.siegelStufeRendered === "gold" &&
    hasStufenwechselClass === true);

  // Stufenwechsel-Animations-Klasse wird nach 600 ms wieder entfernt.
  await new Promise(r => setTimeout(r, 700));
  const animAfter = siegelSlotS._classes.has("sbkim-widget-siegel-stufenwechsel");
  record("34. Pflege Stufen-Render: Stufenwechsel-Klasse wird nach 600 ms entfernt + Idempotenz (zweiter Handshake no-op)",
    "anim-klasse weg, Gold bleibt; zweiter dispatch ändert nichts",
    "animAfter=" + animAfter + "/attrAfter=" + siegelSlotS.getAttribute("data-siegel-stufe"),
    animAfter === false && siegelSlotS.getAttribute("data-siegel-stufe") === "gold");
  // Zweiter established-Handshake: idempotent, animiert NICHT erneut.
  dispatchWindowEvent(gS, "sbkim:handshake", { outcome: "established", peerNodeId: "peer2", direction: "incoming" });
  const animAfterSecond = siegelSlotS._classes.has("sbkim-widget-siegel-stufenwechsel");
  record("35. Pflege Stufen-Render: zweiter established-Handshake → KEIN Re-Animate (Idempotenz)",
    "anim-klasse bleibt false, Slot bleibt Gold",
    "anim=" + animAfterSecond + "/attr=" + siegelSlotS.getAttribute("data-siegel-stufe"),
    animAfterSecond === false && siegelSlotS.getAttribute("data-siegel-stufe") === "gold");

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
