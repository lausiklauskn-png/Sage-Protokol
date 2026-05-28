// Headless smoke test for Bau 18 Sub (a) Vorab — Modul 18 Tool-PWA Andock.
// Run with `node tests/smoke_bau18_sub_a_vorab.mjs`.
//
// Stubs: DOM (document.body/head, createElement, classList, querySelector,
// addEventListener/dispatchEvent + CustomEvent, getBoundingClientRect),
// fetch, URL, setTimeout/clearTimeout. Modul 18 ist Browser-Only.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- Minimal-DOM-Stub (analog smoke_bau17) ----

function makeStubElement(tagName, doc) {
  const el = {
    tagName: tagName.toUpperCase(),
    nodeType: 1,
    id: "",
    className: "",
    textContent: "",
    title: "",
    type: "",
    value: "",
    disabled: false,
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
    set: (v) => {
      el._classes.clear();
      if (typeof v === "string") v.split(/\s+/).filter(Boolean).forEach(c => el._classes.add(c));
    },
  });
  el.setAttribute = (k, v) => { el._attributes[k] = String(v); if (k === "id") el.id = String(v); };
  el.getAttribute = (k) =>
    Object.prototype.hasOwnProperty.call(el._attributes, k) ? el._attributes[k] : null;
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
  el.getBoundingClientRect = () =>
    ({ left: 100, top: 100, right: 200, bottom: 200, width: 200, height: 48, x: 100, y: 100 });
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
  // Support: "#id", ".class", "tag", "[attr]", "[attr=value]"
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
  walkAll(root, (el) => { if (el !== root && matchSelector(el, sel)) out.push(el); });
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
  return doc;
}

function makeStubGlobal(opts) {
  const stub = {};
  const windowListeners = {};
  stub.document = makeStubDocument();
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
  stub.URL = URL;
  stub.MutationObserver = function () {
    return { observe: () => {}, disconnect: () => {} };
  };
  stub.location = { origin: "https://test.local", pathname: "/Mein-Rezeptbuch/" };
  stub.confirm = (_msg) => true;            // default: bestätigen
  stub.fetch = opts && opts.fetch ? opts.fetch : undefined;
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
    "document", "innerWidth", "innerHeight", "location", "confirm",
    "fetch", "URL",
    "addEventListener", "removeEventListener", "dispatchEvent",
    "setTimeout", "clearTimeout", "setInterval", "clearInterval",
    "MutationObserver", "Date", "JSON", "Math", "Promise", "Map", "Set",
    "Array", "Object",
    src,
  );
  wrapped(
    stubGlobal, stubGlobal, stubGlobal, console,
    stubGlobal.document, stubGlobal.innerWidth, stubGlobal.innerHeight,
    stubGlobal.location, stubGlobal.confirm,
    stubGlobal.fetch, stubGlobal.URL,
    stubGlobal.addEventListener.bind(stubGlobal),
    stubGlobal.removeEventListener.bind(stubGlobal),
    stubGlobal.dispatchEvent.bind(stubGlobal),
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

const VALID_OPTS = {
  endpoint: "https://test.local/Mein-Rezeptbuch/",
  domain:   "rezeptbuch",
  domainKeywords: ["rezept", "kochen", "essen"],
};

// ---- Tests ----

async function run() {
  // -------- Probe 1: Public Surface + Selbstcheck-Marker --------
  const g1 = makeStubGlobal();
  loadModuleInto(g1, "src/modules/18_tool_pwa.js");
  const T = g1.SbkimToolPwa;
  if (!T) throw new Error("SbkimToolPwa wurde nicht registriert");
  record("1. Public Surface verfügbar (init/openAndockTab/close/isOpen/_meta)",
    "init/openAndockTab/close/isOpen+_meta",
    Object.keys(T).sort().join(",") + "|_meta=" + typeof T._meta,
    typeof T.init === "function" && typeof T.openAndockTab === "function" &&
    typeof T.close === "function" && typeof T.isOpen === "function" &&
    typeof T._meta === "object");

  // -------- Probe 2: init() ohne opts → console.warn + ready=false --------
  const warns = [];
  const origWarn = console.warn;
  console.warn = (...args) => { warns.push(args.join(" ")); };
  await T.init({});
  console.warn = origWarn;
  record("2. init({}) ohne Pflicht-Felder → warn + ready=false + missingFields[3]",
    "ready=false, missing=[endpoint,domain,domainKeywords], warn≥1",
    `ready=${T._meta.ready}/missing=${T._meta.missingFields.join(",")}/warns=${warns.filter(w=>w.includes("fehlen")).length}`,
    T._meta.ready === false &&
    T._meta.missingFields.length === 3 &&
    T._meta.missingFields.includes("endpoint") &&
    T._meta.missingFields.includes("domain") &&
    T._meta.missingFields.includes("domainKeywords") &&
    warns.filter(w => w.includes("fehlen")).length >= 1);

  // -------- Probe 3: init() mit Pflicht-Feldern → ready=true --------
  await T.init(VALID_OPTS);
  record("3. init({…vollständig…}) → ready=true + missingFields leer + _meta gespiegelt",
    "ready=true, endpoint+domain+domainKeywords gespiegelt",
    `ready=${T._meta.ready}/endpoint=${T._meta.endpoint}/domain=${T._meta.domain}/keywords=${T._meta.domainKeywords.join(",")}`,
    T._meta.ready === true &&
    T._meta.endpoint === VALID_OPTS.endpoint &&
    T._meta.domain === VALID_OPTS.domain &&
    T._meta.domainKeywords.length === 3 &&
    T._meta.missingFields.length === 0);

  // -------- Probe 4: openAndockTab() ohne ready → ToolPwaNotReadyError --------
  const g4 = makeStubGlobal();
  loadModuleInto(g4, "src/modules/18_tool_pwa.js");
  const T4 = g4.SbkimToolPwa;
  await T4.init({});                       // ready bleibt false
  let throwName = null;
  let throwMessage = "";
  try { T4.openAndockTab(); }
  catch (err) { throwName = err.name; throwMessage = err.message; }
  record("4. openAndockTab() ohne ready → ToolPwaNotReadyError SYNC (mit missing-Feldern in message)",
    "name=ToolPwaNotReadyError, message enthält 'endpoint, domain, domainKeywords'",
    `name=${throwName}/msg=${throwMessage}`,
    throwName === "ToolPwaNotReadyError" &&
    throwMessage.includes("endpoint") && throwMessage.includes("domain") &&
    throwMessage.includes("domainKeywords"));

  // -------- Probe 5: openAndockTab() mit ready → Modal öffnet, Schritt 1 --------
  const g5 = makeStubGlobal();
  loadModuleInto(g5, "src/modules/18_tool_pwa.js");
  const T5 = g5.SbkimToolPwa;
  await T5.init(VALID_OPTS);
  await T5.openAndockTab();
  const modal5 = g5.document.getElementById("sbkim-tool-pwa-modal");
  const styleEl5 = g5.document.getElementById("sbkim-tool-pwa-style");
  record("5. openAndockTab() mit ready → Modal in body + Style in head + Schritt 1",
    "modal+style vorhanden, currentStep=1, modalOpen=true, isOpen()=true",
    `modal=${!!modal5}/style=${!!styleEl5}/step=${T5._meta.currentStep}/open=${T5._meta.modalOpen}/isOpen=${T5.isOpen()}`,
    !!modal5 && !!styleEl5 &&
    T5._meta.currentStep === 1 && T5._meta.modalOpen === true &&
    T5.isOpen() === true);

  // -------- Probe 6: openAndockTab("https://...") → Schritt 2 direkt --------
  const g6 = makeStubGlobal({
    fetch: async (_url) => ({
      ok: false, status: 404,
      json: async () => ({}),
    }),
  });
  loadModuleInto(g6, "src/modules/18_tool_pwa.js");
  const T6 = g6.SbkimToolPwa;
  await T6.init(VALID_OPTS);
  await T6.openAndockTab("https://test.local/Mein-Mixarium/");
  record("6. openAndockTab('https://…') → springt direkt zu Schritt 2 + lastFetchUrl gesetzt",
    "currentStep=2, lastFetchUrl=https://test.local/Mein-Mixarium/",
    `step=${T6._meta.currentStep}/last=${T6._meta.lastFetchUrl}`,
    T6._meta.currentStep === 2 &&
    T6._meta.lastFetchUrl === "https://test.local/Mein-Mixarium/");

  // -------- Probe 7: openAndockTab("not-a-url") → ToolPwaInvalidUrlArgError --------
  const g7 = makeStubGlobal();
  loadModuleInto(g7, "src/modules/18_tool_pwa.js");
  const T7 = g7.SbkimToolPwa;
  await T7.init(VALID_OPTS);
  let throwName7 = null;
  try { T7.openAndockTab("not-a-url"); }
  catch (err) { throwName7 = err.name; }
  record("7. openAndockTab('not-a-url') → ToolPwaInvalidUrlArgError SYNC",
    "name=ToolPwaInvalidUrlArgError",
    `name=${throwName7}`,
    throwName7 === "ToolPwaInvalidUrlArgError");

  // -------- Probe 8: close() schließt --------
  const g8 = makeStubGlobal();
  loadModuleInto(g8, "src/modules/18_tool_pwa.js");
  const T8 = g8.SbkimToolPwa;
  await T8.init(VALID_OPTS);
  await T8.openAndockTab();
  // Schritt 1, kein User-Input → close() ohne confirm.
  const beforeClose8 = T8._meta.modalOpen;
  T8.close();
  const after8 = g8.document.getElementById("sbkim-tool-pwa-modal");
  record("8. close() schließt Modal + isOpen()=false + currentStep=0",
    "modalOpen=true→false, currentStep=0, DOM-Element weg",
    `before=${beforeClose8}/openAfter=${T8._meta.modalOpen}/step=${T8._meta.currentStep}/dom=${!!after8}/isOpen=${T8.isOpen()}`,
    beforeClose8 === true && T8._meta.modalOpen === false &&
    T8._meta.currentStep === 0 && !after8 && T8.isOpen() === false);

  // -------- Probe 9: matchThreshold > 0.80 → clamp + console.warn --------
  const g9 = makeStubGlobal();
  loadModuleInto(g9, "src/modules/18_tool_pwa.js");
  const T9 = g9.SbkimToolPwa;
  const warns9 = [];
  const oldW = console.warn;
  console.warn = (...a) => { warns9.push(a.join(" ")); };
  await T9.init(Object.assign({}, VALID_OPTS, { matchThreshold: 0.95 }));
  console.warn = oldW;
  record("9. matchThreshold > 0.80 → console.warn + clamp auf 0.80",
    "matchThreshold=0.80 (geclampt), warn enthält 'geclampt'",
    `threshold=${T9._meta.matchThreshold}/warns=${warns9.filter(w=>w.includes("geclampt")).length}`,
    T9._meta.matchThreshold === 0.80 &&
    warns9.filter(w => w.includes("geclampt")).length >= 1);

  // -------- Probe 10: externalHubUrl als string → _meta gespiegelt, KEIN Fetch --------
  let fetchCalled10 = false;
  const g10 = makeStubGlobal({
    fetch: async (_url) => { fetchCalled10 = true; return { ok: true, status: 200, json: async () => ({}) }; },
  });
  loadModuleInto(g10, "src/modules/18_tool_pwa.js");
  const T10 = g10.SbkimToolPwa;
  await T10.init(Object.assign({}, VALID_OPTS, { externalHubUrl: "https://hub.example/" }));
  record("10. externalHubUrl als string → _meta.externalHubUrl gespiegelt, KEIN Hub-Fetch (Sub a Vorab)",
    "externalHubUrl='https://hub.example/' + fetchCalled=false",
    `hub=${T10._meta.externalHubUrl}/fetch=${fetchCalled10}`,
    T10._meta.externalHubUrl === "https://hub.example/" && fetchCalled10 === false);

  // -------- Probe 11: _meta liefert defensive Kopie --------
  const g11 = makeStubGlobal();
  loadModuleInto(g11, "src/modules/18_tool_pwa.js");
  const T11 = g11.SbkimToolPwa;
  await T11.init(VALID_OPTS);
  const meta1 = T11._meta;
  meta1.domainKeywords.push("BÖSE-MUTATION");
  const meta2 = T11._meta;
  record("11. _meta liefert defensive Kopie (Array-Mutation am Snapshot beeinflusst Closure-State nicht)",
    "meta2.domainKeywords.length=3 trotz Mutation am meta1-Snapshot",
    `len1=${meta1.domainKeywords.length}/len2=${meta2.domainKeywords.length}/own=${T11._meta.domainKeywords.join(",")}`,
    meta2.domainKeywords.length === 3 &&
    !meta2.domainKeywords.includes("BÖSE-MUTATION"));

  // -------- Probe 12: modalOpen-Toggle (open → close → open) --------
  const g12 = makeStubGlobal();
  loadModuleInto(g12, "src/modules/18_tool_pwa.js");
  const T12 = g12.SbkimToolPwa;
  await T12.init(VALID_OPTS);
  const open0 = T12._meta.modalOpen;
  await T12.openAndockTab();
  const open1 = T12._meta.modalOpen;
  T12.close();
  const open2 = T12._meta.modalOpen;
  await T12.openAndockTab();
  const open3 = T12._meta.modalOpen;
  record("12. modalOpen-Toggle (init=false / open=true / close=false / open=true)",
    "false,true,false,true",
    `${open0},${open1},${open2},${open3}`,
    open0 === false && open1 === true && open2 === false && open3 === true);

  // -------- Probe 13: currentStep-Bewegung (1 nach init+open, 2 nach url-Arg) --------
  const g13 = makeStubGlobal();
  loadModuleInto(g13, "src/modules/18_tool_pwa.js");
  const T13 = g13.SbkimToolPwa;
  await T13.init(VALID_OPTS);
  await T13.openAndockTab();
  const step13a = T13._meta.currentStep;
  T13.close();
  await T13.openAndockTab("https://test.local/foo/");
  const step13b = T13._meta.currentStep;
  T13.close();
  const step13c = T13._meta.currentStep;
  record("13. currentStep-Bewegung: openOhne=1, openMitUrl=2, close=0",
    "ohne=1, mitUrl=2, close=0",
    `ohne=${step13a}/mitUrl=${step13b}/close=${step13c}`,
    step13a === 1 && step13b === 2 && step13c === 0);

  // -------- Probe 14: missingFields-Reset bei Re-Init mit vollen Feldern --------
  const g14 = makeStubGlobal();
  loadModuleInto(g14, "src/modules/18_tool_pwa.js");
  const T14 = g14.SbkimToolPwa;
  // 1. Aufruf: fail-soft mit ≥1 Feld fehlt
  await T14.init({ endpoint: "https://test.local/X/" });   // domain + domainKeywords fehlen
  const missingBefore = T14._meta.missingFields.slice();
  const readyBefore = T14._meta.ready;
  // 2. Aufruf: voll
  await T14.init(VALID_OPTS);
  const missingAfter = T14._meta.missingFields.slice();
  const readyAfter = T14._meta.ready;
  record("14. missingFields-Reset bei Re-Init mit vollen Feldern: missing→leer, ready→true",
    "vorher=2 fehlend (domain+domainKeywords), nachher=leer + ready=true",
    `vorher=${missingBefore.join(",")}/ready=${readyBefore}; nachher=${missingAfter.join(",")}/ready=${readyAfter}`,
    missingBefore.length === 2 && readyBefore === false &&
    missingAfter.length === 0 && readyAfter === true);

  // -------- Probe 15: Re-Use-Test für SbkimEmbedding._meta.ready (KEIN Lazy-Load) --------
  // Wir simulieren ein bereits-ready Modul 03 + Modul 04 mit matchDimensions.
  // Schritt 3 ruft computeAndRenderMatch direkt (kein embMod.init-Aufruf).
  let embInitCalled = false;
  let matchCalled = false;
  // Pflege 2026-05-28: Schritt 3 ruft jetzt zwingend embedQueryBatch
  // VOR matchDimensions (Float32Array-Pflicht aus Modul 04). Wir tracken
  // den Aufruf + prüfen, dass matchDimensions ausschließlich
  // Float32Array(384) bekommt — genau der Bug, den der alte Mock (Strings)
  // nicht gefangen hat.
  let embBatchCalled = false;
  let embBatchInputAllStrings = false;
  let matchGotOnlyVectors = false;
  const fakeSpore = {
    domain: "mixarium",
    id: "test_node_id_remote_a",
    domainKeywords: ["cocktail", "drink", "bar"],
    stammCategories: [],
    guestCategories: [],
  };
  const g15 = makeStubGlobal({
    fetch: async (_url) => ({
      ok: true, status: 200, json: async () => fakeSpore,
    }),
  });
  loadModuleInto(g15, "src/modules/18_tool_pwa.js");
  // Modul-Stubs für 02, 03, 04 in g15.
  g15.SbkimSpore = {
    verifyForeignSpore: async (_s) => ({ valid: true }),
  };
  g15.SbkimEmbedding = {
    _meta: { ready: true },
    init: async () => { embInitCalled = true; },
    isReady: () => true,
    embedQueryBatch: async (texts) => {
      embBatchCalled = true;
      embBatchInputAllStrings = Array.isArray(texts) && texts.length > 0 &&
        texts.every((t) => typeof t === "string");
      return texts.map(() => new Float32Array(384));
    },
  };
  g15.SbkimMatch = {
    matchDimensions: (a, b, c, d) => {
      matchCalled = true;
      // Bug-Wächter: jede nicht-null Spalte MUSS Float32Array sein.
      matchGotOnlyVectors = [a, b, c, d].every(
        (v) => v === null || v instanceof Float32Array,
      );
      return {
        overall: 0.85,
        fachlich:   { score: 0.85 },
        prozess:    { score: 0.70 },
        skalierung: { score: 0.40 },
      };
    },
  };
  const T15 = g15.SbkimToolPwa;
  await T15.init(VALID_OPTS);
  await T15.openAndockTab("https://test.local/Mein-Mixarium/");
  // Schritt 2 läuft → triggert Fetch + Verify.
  // Wir warten kurz auf die microtask-Kette.
  await new Promise(r => setTimeout(r, 30));
  // Modal sollte in Schritt 2 sein mit foreignSpore gecached.
  // Spec: "Re-Use, wenn SbkimEmbedding._meta.ready === true bereits"
  // → embeddingReady wird true gesetzt, NICHT "loading", embMod.init NICHT aufgerufen.
  // Wir simulieren den Schritt-2→3-Übergang über die Public-API: einen weiteren
  // openAndockTab-Call mit anderer URL → Reset. Stattdessen prüfen wir den
  // Vorab-Pfad via internem currentStep-Wechsel.
  // Setze currentStep=3 simuliert via openAndockTab-zu-Step-2-direkt + dann der
  // tatsächliche Match-Trigger kommt aus dem renderStepTwo "Weiter"-Klick.
  // Hier prüfen wir nur, dass embeddingReady-Pfad bei _meta.ready=true direkt
  // greift — also embeddingReady=true ohne dass init() jemals lief.
  // Trick: openAndockTab schon erfolgt, fetch durch, Modal in Schritt 2.
  // Wir simulieren manuell einen Schritt-3-Wechsel über die Internals via DOM-Klick:
  // dazu rufen wir den "Weiter zum Match-Check"-Button.
  // Aber: noch hat triggerStepTwoFetch eine ungelöste Promise — warten.
  await new Promise(r => setTimeout(r, 30));
  const nextBtn = g15.document.querySelector("[data-tool-pwa-step2-next]");
  // Knopf-Click simulieren:
  if (nextBtn) {
    nextBtn.disabled = false;          // Test-Brücke: Erfolg-Render hat ihn aktiviert
    nextBtn.click();
  }
  await new Promise(r => setTimeout(r, 30));
  const okReUse =
    T15._meta.currentStep === 3 &&
    T15._meta.embeddingReady === true &&
    embInitCalled === false &&
    embBatchCalled === true &&
    embBatchInputAllStrings === true &&
    matchCalled === true &&
    matchGotOnlyVectors === true;
  record("15. Re-Use: ready===true → KEIN init(), embedQueryBatch(Strings) VOR matchDimensions, matchDimensions bekommt nur Float32Array",
    "step=3 + embeddingReady=true + embInit=false + embBatch=true(Strings) + match=true(Vektoren)",
    `step=${T15._meta.currentStep}/embReady=${T15._meta.embeddingReady}/embInit=${embInitCalled}/embBatch=${embBatchCalled}(strings=${embBatchInputAllStrings})/match=${matchCalled}(vectors=${matchGotOnlyVectors})`,
    okReUse);

  // -------- Probe 16: Idempotenz mit identischen opts → no-op (no warn) --------
  const g16 = makeStubGlobal();
  loadModuleInto(g16, "src/modules/18_tool_pwa.js");
  const T16 = g16.SbkimToolPwa;
  await T16.init(VALID_OPTS);
  const warns16 = [];
  const oldW16 = console.warn;
  console.warn = (...a) => { warns16.push(a.join(" ")); };
  await T16.init(VALID_OPTS);             // identisch
  console.warn = oldW16;
  record("16. Idempotenz: 2. init() mit identischen opts → no-op (kein console.warn)",
    "warns mit 're-init' = 0, ready bleibt true",
    `warns=${warns16.filter(w=>w.includes("re-init")).length}/ready=${T16._meta.ready}`,
    warns16.filter(w => w.includes("re-init")).length === 0 && T16._meta.ready === true);

  // -------- Probe 17: repoUrl Auto-Erkennung (location.origin + erstes Pfad-Segment) --------
  const g17 = makeStubGlobal();
  loadModuleInto(g17, "src/modules/18_tool_pwa.js");
  const T17 = g17.SbkimToolPwa;
  await T17.init(VALID_OPTS);
  // location ist https://test.local + /Mein-Rezeptbuch/ → repoUrl auto = https://test.local/Mein-Rezeptbuch/
  record("17. repoUrl Auto-Erkennung aus location.origin + erstem Pfad-Segment",
    "repoUrl=https://test.local/Mein-Rezeptbuch/",
    `repoUrl=${T17._meta.repoUrl}`,
    T17._meta.repoUrl === "https://test.local/Mein-Rezeptbuch/");

  // -------- Probe 18: Schritt 4 delegiert ownDomainVector-Auflösung an Modul 05 --------
  // Pflege 2026-05-28 (Eigenvektor-Auflösung): triggerStepFourHandshake
  // ruft handshake(targetSpore) OHNE 2. Argument — Modul 05 löst den
  // eigenen Domain-Vektor kanonisch aus der eigenen Spore auf (single
  // source of truth). Modul 18 berechnet KEINEN eigenen Vektor mehr
  // (kein embedPassage in Schritt 4 → keine Inkonsistenz request.domain-
  // Vector vs. senderSpore). Wir treiben bis Schritt 4 und prüfen, dass
  // handshake mit genau einem Argument (foreignSpore) aufgerufen wird.
  let hsCalled = false;
  let hsArg1IsForeign = false;
  let hsArg2Undefined = false;
  let embedPassageCalledInStep4 = false;
  const g18b = makeStubGlobal({
    fetch: async (_url) => ({
      ok: true, status: 200, json: async () => ({
        domain: "mixarium", id: "test_node_id_remote_b",
        domainKeywords: ["cocktail", "drink"], stammCategories: [], guestCategories: [],
      }),
    }),
  });
  loadModuleInto(g18b, "src/modules/18_tool_pwa.js");
  g18b.SbkimSpore = { verifyForeignSpore: async (_s) => ({ valid: true }) };
  g18b.SbkimEmbedding = {
    _meta: { ready: true },
    isReady: () => true,
    embedQueryBatch: async (texts) => texts.map(() => new Float32Array(384)),
    embedPassage: async (_text) => {
      // Schritt 4 darf embedPassage NICHT (mehr) aufrufen — der Vektor
      // kommt aus Modul 05. (Schritt 3 nutzt embedQueryBatch, nicht hier.)
      embedPassageCalledInStep4 = true;
      return new Float32Array(384);
    },
  };
  g18b.SbkimMatch = {
    matchDimensions: () => ({ overall: 0.85, fachlich: { score: 0.85 }, prozess: { score: 0.85 }, skalierung: { score: 0.85 } }),
  };
  g18b.SbkimAnastomose = {
    handshake: async (targetSpore, ownDomainVector) => {
      hsCalled = true;
      hsArg1IsForeign = !!targetSpore && targetSpore.id === "test_node_id_remote_b";
      hsArg2Undefined = (ownDomainVector === undefined);
      return { outcome: "established", score: 0.85 };
    },
  };
  const T18b = g18b.SbkimToolPwa;
  await T18b.init(VALID_OPTS);
  await T18b.openAndockTab("https://test.local/Mein-Mixarium/");
  await new Promise(r => setTimeout(r, 30));
  const next2 = g18b.document.querySelector("[data-tool-pwa-step2-next]");
  if (next2) { next2.disabled = false; next2.click(); }       // → Schritt 3 Match
  await new Promise(r => setTimeout(r, 30));
  // embedPassage-Tracking erst NACH Schritt 3 scharf stellen (Schritt 3
  // nutzt embedQueryBatch, ruft embedPassage ohnehin nicht).
  embedPassageCalledInStep4 = false;
  const next3 = g18b.document.querySelector("[data-tool-pwa-step3-next]");
  if (next3) { next3.disabled = false; next3.click(); }       // → Schritt 4 Handshake
  await new Promise(r => setTimeout(r, 30));
  record("18. Schritt 4: handshake(foreignSpore) OHNE 2. Argument — Modul 05 löst Eigenvektor auf, Modul 18 embeddet nicht",
    "handshake aufgerufen + Arg1 foreignSpore + Arg2 undefined + kein embedPassage in Schritt 4",
    `hsCalled=${hsCalled}/arg1Foreign=${hsArg1IsForeign}/arg2Undefined=${hsArg2Undefined}/embedPassageStep4=${embedPassageCalledInStep4}`,
    hsCalled === true && hsArg1IsForeign === true && hsArg2Undefined === true && embedPassageCalledInStep4 === false);

  // ---- Ergebnis ----
  const ok = results.filter(r => r.ok).length;
  const total = results.length;
  for (const r of results) {
    const tag = r.ok ? "  OK" : "FAIL";
    console.log(tag + "  " + r.probe + "  →  " +
      (r.ok ? "" : "expected=" + JSON.stringify(r.expected) + " actual=" + JSON.stringify(r.actual)));
  }
  console.log("\n" + ok + "/" + total + " grün");
  if (ok !== total) process.exitCode = 1;
}

run().catch(err => { console.error("smoke crashed", err); process.exit(2); });
