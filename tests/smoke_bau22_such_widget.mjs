// Headless smoke test für Bau 22 — Modul 22 Such-Widget (window.SbkimSearchWidget).
// Run mit `node tests/smoke_bau22_such_widget.mjs`. KEIN echtes DOM/Mic/Netz —
// Minimal-DOM-Stub (analog smoke_bau17), localStorage-Stub, gestubbte
// window.SbkimMatch / window.SbkimSpeech. Geprüft werden die Widget-Logik-
// Eigenschaften:
//   - Surface-Anker + _meta,
//   - Self-Mount in <body>, klein (collapsed) Default,
//   - expand/collapse/show/hide + localStorage-Persistenz,
//   - UX-Erhalt: Textfeld wird beim Treffer-Re-Render NICHT geleert,
//   - EU-Politik frei/bindend (Chip-Wechsel + euOnly an hybridMatch),
//   - komponierte Suche: alle sechs Modi (modul-04-fehlt / vorfilter-leer /
//     nur-vorfilter / richter / fail-soft-vorfilter / vorfilter-fehler),
//   - setCorpus reicht an SbkimMatch durch,
//   - Spracheingabe fail-soft (Modul 21 fehlt) + Browser-Pfad (Text anhängen),
//   - Drag persistiert Position,
//   - init() mit ungültiger euPolicy → sync Throw.

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
    textContent: "",
    value: "",
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
    el.children.push(child); child.parentNode = el; return child;
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
  el.click = () => el.dispatchEvent({ type: "click", target: el, stopPropagation: () => {} });
  el.focus = () => {};
  el.querySelector = (sel) => queryFirst(el, sel);
  el.querySelectorAll = (sel) => queryAll(el, sel);
  el.contains = (other) => { let p = other; while (p) { if (p === el) return true; p = p.parentNode; } return false; };
  el.getBoundingClientRect = () => ({ left: 100, top: 100, right: 320, bottom: 200, width: 220, height: 100, x: 100, y: 100 });
  el.setPointerCapture = () => {};
  el.releasePointerCapture = () => {};
  Object.defineProperty(el, "innerHTML", { get: () => "", set: (v) => { if (v === "") el.children.length = 0; } });
  Object.defineProperty(el, "firstChild", { get: () => el.children[0] || null });
  return el;
}

function matchSelector(el, sel) {
  if (sel.startsWith("#")) return el.id === sel.slice(1);
  if (sel.startsWith(".")) return el._classes.has(sel.slice(1));
  return el.tagName === sel.toUpperCase();
}
function walkAll(el, cb) { if (cb(el) === false) return; for (const c of el.children) walkAll(c, cb); }
function queryFirst(root, sel) {
  let found = null;
  walkAll(root, (el) => { if (found) return false; if (el !== root && matchSelector(el, sel)) { found = el; return false; } return true; });
  return found;
}
function queryAll(root, sel) { const out = []; walkAll(root, (el) => { if (el !== root && matchSelector(el, sel)) out.push(el); }); return out; }

function makeStubDocument() {
  const doc = { nodeType: 9 };
  doc.createElement = (tag) => makeStubElement(tag, doc);
  doc.createTextNode = (str) => { const t = makeStubElement("#text", doc); t.nodeType = 3; t.textContent = String(str); return t; };
  doc.body = makeStubElement("body", doc);
  doc.head = makeStubElement("head", doc);
  doc.documentElement = makeStubElement("html", doc);
  doc.documentElement.appendChild(doc.head);
  doc.documentElement.appendChild(doc.body);
  doc.querySelector = (sel) => queryFirst(doc.documentElement, sel);
  doc.getElementById = (id) => queryFirst(doc.documentElement, "#" + id);
  doc.addEventListener = () => {};
  doc.readyState = "complete";
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

// ---- Global-Stub + Modul laden ----

const stub = {};
stub.document = makeStubDocument();
stub.localStorage = makeStubLocalStorage();
stub.innerWidth = 1024;
stub.innerHeight = 768;
stub.crypto = globalThis.crypto; // Node WebCrypto (PBKDF2 + AES-GCM) für den Tresor
stub.console = console;
stub.setTimeout = setTimeout;
stub.clearTimeout = clearTimeout;
stub.MutationObserver = undefined; // body existiert sofort, Observer nicht nötig
globalThis.window = stub;

const src = readFileSync(resolve(repoRoot, "src/modules/22_such_widget.js"), "utf8");
new Function("global", "window", "globalThis", "console", src)(stub, stub, stub, console);

const W = stub.SbkimSearchWidget;

// ---- Mock Modul 04 + 21 ----

function mountMatch(behavior) {
  // behavior: "fehlt" | "leer" | "treffer" | "wirft"
  if (behavior === "fehlt") { delete stub.SbkimMatch; return; }
  stub.SbkimMatch = {
    _corpus: null,
    setLocalCorpus(c) { this._corpus = c; },
    async queryLocal(text, k, options) {
      if (behavior === "wirft") { const e = new Error("Modul 03 fehlt"); e.name = "EmbeddingNotAvailableError"; throw e; }
      if (behavior === "leer") return [];
      // Echo: Top-2 des übergebenen Korpus mit absteigenden Scores (so klappt
      // die Quellen-Rückzuordnung in queryCorpus).
      const corpus = (options && options.corpus) || [];
      return corpus.slice(0, 2).map((c, i) => ({ label: c.label, score: 0.9 - i * 0.05, anchorId: c.anchorId }));
    },
    _lastHybridOpts: null,
    async hybridMatch(query, candidates, opts) {
      this._lastHybridOpts = opts;
      if (behavior === "richter-failsoft") {
        return { available: false, reason: "API HTTP 429" };
      }
      // Erster Kandidat passt, Rest nicht — behält label/anchorId der Kandidaten.
      return {
        available: true,
        verdicts: candidates.map((c, i) => ({
          label: c.label, anchorId: c.anchorId, passt: i === 0,
          score: 0.95 - i * 0.1, begruendung: i === 0 ? "passt direkt" : "passt nicht",
        })),
        attestation: { kind: "sbkim-hybrid-match-judgment", version: 1 },
      };
    },
  };
}

const APP_CORPUS = [
  { label: "Lasagne", text: "Nudelauflauf", passageVec: new Float32Array(384), anchorId: "r1" },
  { label: "Tomatensuppe", text: "Suppe", passageVec: new Float32Array(384), anchorId: "r2" },
];
const NODE_CORPUS = [
  { label: "Mein-Mixarium", text: "Cocktails Drinks", passageVec: new Float32Array(384), anchorId: "https://mix" },
];

// ---- Test-Harness ----

const results = [];
function record(probe, expected, actual, ok) { results.push({ probe, expected: String(expected), actual: String(actual), ok }); }
function eq(probe, expected, actual) { record(probe, expected, actual, expected === actual); }

async function run() {
  // ---- Probe 1: Surface + _meta ----
  for (const fn of ["init", "show", "hide", "isVisible", "expand", "collapse",
    "isExpanded", "getPosition", "setCorpus", "search"]) {
    record("Probe 1: " + fn + " exportiert", "function", typeof W[fn], typeof W[fn] === "function");
  }
  eq("Probe 1: _meta.euPolicy Default", "frei", W._meta.euPolicy);
  eq("Probe 1: _meta.coupled Increment 1", "false", String(W._meta.coupled));
  eq("Probe 1: _meta.widgetMounted vor init", "false", String(W._meta.widgetMounted));

  // ---- Probe 2: init mountet collapsed ----
  await W.init();
  eq("Probe 2: widgetMounted nach init", "true", String(W._meta.widgetMounted));
  eq("Probe 2: Default collapsed (nicht expanded)", "false", String(W.isExpanded()));
  eq("Probe 2: sichtbar nach init", "true", String(W.isVisible()));
  const root = stub.document.getElementById("sbkim-search-widget");
  record("Probe 2: Widget-Root in body", "true", String(!!root), !!root);
  eq("Probe 2: data-state collapsed", "collapsed", root.getAttribute("data-state"));

  // ---- Probe 3: expand/collapse ----
  W.expand();
  eq("Probe 3: expand → isExpanded", "true", String(W.isExpanded()));
  eq("Probe 3: data-state expanded", "expanded", root.getAttribute("data-state"));
  eq("Probe 3: localStorage state persistiert", "expanded", stub.localStorage.getItem("sbkim_search_widget_state"));
  W.collapse();
  eq("Probe 3: collapse → isExpanded false", "false", String(W.isExpanded()));

  // ---- Probe 4: hide/show + Persistenz ----
  W.hide();
  eq("Probe 4: hide → isVisible false", "false", String(W.isVisible()));
  eq("Probe 4: localStorage visible=false", "false", stub.localStorage.getItem("sbkim_search_widget_visible"));
  W.show();
  eq("Probe 4: show → isVisible true", "true", String(W.isVisible()));

  // ---- Probe 5: EU-Politik-Chip-Wechsel ----
  const chip = queryFirst(root, ".sbkim-sw-euchip");
  record("Probe 5: EU-Chip existiert", "true", String(!!chip), !!chip);
  chip.dispatchEvent({ type: "click", target: chip, stopPropagation: () => {} });
  eq("Probe 5: Chip-Klick → bindend", "bindend", W._meta.euPolicy);
  chip.dispatchEvent({ type: "click", target: chip, stopPropagation: () => {} });
  eq("Probe 5: Chip-Klick zurück → frei", "frei", W._meta.euPolicy);

  // App-Korpus für die Such-Proben setzen (Default-Bereich = app).
  mountMatch("treffer");
  W.setCorpus(APP_CORPUS);

  // ---- Probe 6: nur App-Bereich + kein Modul 04 → modul-04-fehlt ----
  mountMatch("fehlt");
  await W.init({ areas: { app: true, knoten: false, internet: false }, richter: false });
  let res = await W.search("lasagne");
  eq("Probe 6: ohne Modul 04 → modul-04-fehlt", "modul-04-fehlt", res.mode);
  eq("Probe 6: treffer leer", "0", String(res.treffer.length));

  // ---- Probe 7: leerer Korpus-Treffer → leer ----
  mountMatch("leer");
  res = await W.search("nichtsfindbar");
  eq("Probe 7: leeres Ergebnis → leer", "leer", res.mode);

  // ---- Probe 8: App-Suche ohne Richter → semantisch, Treffer mit Quelle app ----
  mountMatch("treffer");
  res = await W.search("lasagne");
  eq("Probe 8: ohne Richter → semantisch", "semantisch", res.mode);
  eq("Probe 8: 2 semantische Treffer", "2", String(res.treffer.length));
  eq("Probe 8: Quelle app", "app", res.treffer[0].source);

  // ---- Probe 9: Richter AN + Key → richter ----
  mountMatch("treffer");
  await W.init({ apiKey: "test-key", provider: "mistral", queryLabel: "Sage", richter: true });
  eq("Probe 9: _meta.hasApiKey", "true", String(W._meta.hasApiKey));
  eq("Probe 9: _meta.richterOn", "true", String(W._meta.richterOn));
  res = await W.search("lasagne");
  eq("Probe 9: Richter an + Key → richter", "richter", res.mode);
  eq("Probe 9: nur passende Treffer (1)", "1", String(res.treffer.length));
  eq("Probe 9: Top-Treffer Lasagne", "Lasagne", res.treffer[0].label);
  eq("Probe 9: Quelle bleibt app", "app", res.treffer[0].source);
  record("Probe 9: attestation vorhanden", "true", String(!!res.attestation), !!res.attestation);

  // ---- Probe 10: Richter-Schalter AUS → trotz Key nur semantisch (gratis) ----
  await W.init({ richter: false });
  res = await W.search("lasagne");
  eq("Probe 10: Richter aus → semantisch trotz Key", "semantisch", res.mode);

  // ---- Probe 11: euOnly an hybridMatch (frei → false, bindend → true) ----
  await W.init({ richter: true });
  await W.search("lasagne");
  eq("Probe 11: euPolicy frei → euOnly false", "false", String(stub.SbkimMatch._lastHybridOpts.euOnly));
  await W.init({ euPolicy: "bindend" });
  await W.search("lasagne");
  eq("Probe 11: euPolicy bindend → euOnly true", "true", String(stub.SbkimMatch._lastHybridOpts.euOnly));
  await W.init({ euPolicy: "frei" }); // zurück

  // ---- Probe 12: Richter fail-soft → fällt auf semantisch zurück ----
  mountMatch("richter-failsoft");
  res = await W.search("lasagne");
  eq("Probe 12: Richter nicht verfügbar → semantisch (Fallback)", "semantisch", res.mode);
  eq("Probe 12: semantische Treffer bleiben (2)", "2", String(res.treffer.length));
  record("Probe 12: reason gesetzt", "true", String(!!res.reason), !!res.reason);

  // ---- Probe 13: queryLocal wirft → App-Bereich fängt ab → leer (kein Throw) ----
  mountMatch("wirft");
  await W.init({ richter: false });
  let threw = false;
  try { res = await W.search("lasagne"); } catch (e) { threw = true; }
  record("Probe 13: queryLocal-Throw wird gefangen", "false", String(threw), threw === false);
  eq("Probe 13: → leer (App-Bereich fail-soft)", "leer", res.mode);

  // ---- Probe 14: setCorpus + _meta ----
  mountMatch("treffer");
  W.setCorpus(APP_CORPUS);
  eq("Probe 14: _meta.corpusSize", "2", String(W._meta.corpusSize));
  record("Probe 14: an SbkimMatch durchgereicht", "true", String(stub.SbkimMatch._corpus && stub.SbkimMatch._corpus.length === 2),
    stub.SbkimMatch._corpus && stub.SbkimMatch._corpus.length === 2);

  // ---- Probe 14b: UX-Erhalt — Re-Render der Treffer leert das Feld NICHT ----
  const input = queryFirst(root, ".sbkim-sw-input");
  input.value = "mein gesprochener text";
  input.dispatchEvent({ type: "input", target: input });
  await W.search("lasagne");
  eq("Probe 14b: Textfeld-Wert bleibt nach Treffer-Render", "mein gesprochener text", input.value);

  // ---- Probe 15: Spracheingabe fail-soft (Modul 21 fehlt → Hinweis, kein Throw) ----
  delete stub.SbkimSpeech;
  const voiceBtn = queryFirst(root, ".sbkim-sw-voice");
  let voiceThrew = false;
  try { voiceBtn.dispatchEvent({ type: "click", target: voiceBtn, stopPropagation: () => {} }); } catch (e) { voiceThrew = true; }
  record("Probe 15: Sprach-Klick ohne Modul 21 wirft nicht", "false", String(voiceThrew), voiceThrew === false);
  const hint = queryFirst(root, ".sbkim-sw-hint");
  record("Probe 15: Hinweis gesetzt", "true", String(/Modul 21/.test(hint.textContent)), /Modul 21/.test(hint.textContent));

  // ---- Probe 16: Spracheingabe Browser-Pfad hängt Text ans Feld ----
  input.value = "anfang";
  stub.SbkimSpeech = {
    pickEngine: () => "browser",
    isBrowserSupported: () => true,
    getLanguages: () => [["de-DE", "Deutsch"]],
    speechErrorHint: (e) => "Hinweis",
    makeBrowserRecognizer: (opts) => ({
      start: () => { opts.onResult("erkannt"); },
      stop: () => {},
    }),
  };
  voiceBtn.dispatchEvent({ type: "click", target: voiceBtn, stopPropagation: () => {} });
  record("Probe 16: erkannter Text angehängt (Erhalt)", "true",
    String(input.value === "anfang erkannt"), input.value === "anfang erkannt");

  // ---- Probe 17: Drag persistiert Position ----
  stub.localStorage.removeItem("sbkim_search_widget_position");
  root.dispatchEvent({ type: "pointerdown", target: root, pointerId: 1, clientX: 100, clientY: 100 });
  root.dispatchEvent({ type: "pointermove", target: root, pointerId: 1, clientX: 180, clientY: 220 });
  root.dispatchEvent({ type: "pointerup", target: root, pointerId: 1, clientX: 180, clientY: 220 });
  const posRaw = stub.localStorage.getItem("sbkim_search_widget_position");
  record("Probe 17: Position persistiert nach Drag", "true", String(!!posRaw), !!posRaw);
  const pos = W.getPosition();
  record("Probe 17: getPosition liefert Free-Koordinaten", "true",
    String(typeof pos.x === "number" && pos.x !== null), typeof pos.x === "number" && pos.x !== null);

  // ---- Probe 18: init mit ungültiger euPolicy → sync Throw ----
  let initThrew = false;
  try { W.init({ euPolicy: "halbeu" }); } catch (e) { initThrew = e.name === "InvalidEuPolicyError"; }
  record("Probe 18: init('halbeu') wirft InvalidEuPolicyError", "true", String(initThrew), initThrew === true);

  // ---- Probe 19: Whitespace-Text → leer (kein Throw) ----
  mountMatch("treffer");
  res = await W.search("   ");
  eq("Probe 19: Whitespace-Text → leer", "leer", res.mode);

  // ---- Probe 20: kein Bereich gewählt → leer + Hinweis ----
  await W.init({ areas: { app: false, knoten: false, internet: false } });
  res = await W.search("lasagne");
  eq("Probe 20: kein Bereich → leer", "leer", res.mode);
  record("Probe 20: Hinweis gesetzt", "true", String(!!res.reason), !!res.reason);
  await W.init({ areas: { app: true } }); // app zurück an

  // ---- Probe 21: Knoten-Bereich — eigener Korpus, Quelle knoten ----
  mountMatch("treffer");
  await W.init({ areas: { app: false, knoten: true, internet: false }, nodeCorpus: NODE_CORPUS, richter: false });
  eq("Probe 21: _meta.nodeCorpusSize", "1", String(W._meta.nodeCorpusSize));
  res = await W.search("cocktail");
  eq("Probe 21: Knoten-Suche → semantisch", "semantisch", res.mode);
  eq("Probe 21: Quelle knoten", "knoten", res.treffer[0].source);

  // ---- Probe 22: Internet-Bereich ohne SearXNG-URL → webLink (neuer Tab) ----
  await W.init({ areas: { app: false, knoten: false, internet: true } });
  res = await W.search("lasagne rezept");
  record("Probe 22: webLink vorhanden", "true", String(!!(res.webLink && res.webLink.url)), !!(res.webLink && res.webLink.url));
  record("Probe 22: webLink-URL ist DuckDuckGo", "true",
    String(/duckduckgo/.test(res.webLink.url)), /duckduckgo/.test(res.webLink.url));
  eq("Probe 22: _meta.hasSearxng false", "false", String(W._meta.hasSearxng));

  // ---- Probe 23: Internet-Bereich mit SearXNG-URL → fetch + embed + Quelle internet ----
  let fetchCalled = false, embedCalled = false;
  stub.fetch = async (url) => {
    fetchCalled = true;
    return { ok: true, status: 200, json: async () => ({ results: [
      { title: "Lasagne Rezept", url: "https://ex.com/1", content: "Nudelauflauf Klassiker" },
      { title: "Tomatensuppe", url: "https://ex.com/2", content: "Suppe" },
    ] }) };
  };
  stub.SbkimEmbedding = { embedPassageBatch: async (texts) => { embedCalled = true; return texts.map(() => new Float32Array(384)); } };
  mountMatch("treffer");
  await W.init({ areas: { app: false, knoten: false, internet: true }, searxngUrl: "https://my.searxng", richter: false });
  eq("Probe 23: _meta.hasSearxng true", "true", String(W._meta.hasSearxng));
  res = await W.search("lasagne");
  record("Probe 23: fetch aufgerufen", "true", String(fetchCalled), fetchCalled);
  record("Probe 23: embed aufgerufen", "true", String(embedCalled), embedCalled);
  eq("Probe 23: Internet-Treffer → semantisch", "semantisch", res.mode);
  eq("Probe 23: Quelle internet", "internet", res.treffer[0].source);
  record("Probe 23: Treffer trägt URL", "true", String(!!res.treffer[0].url), !!res.treffer[0].url);
  delete stub.SbkimEmbedding;

  // ---- Probe 24: prepareCorpus lazy/einmalig/Cache (App-Bereich) ----
  mountMatch("treffer");
  let prepCalls = 0;
  await W.init({ areas: { app: true, knoten: false, internet: false }, richter: false,
    prepareCorpus: async function () { prepCalls++; return APP_CORPUS; } });
  res = await W.search("lasagne");
  eq("Probe 24: prepareCorpus genau 1× gerufen", "1", String(prepCalls));
  eq("Probe 24: corpusReady nach Suche true", "true", String(W._meta.corpusReady));
  res = await W.search("lasagne nochmal");
  eq("Probe 24: zweite Suche gecacht (1×)", "1", String(prepCalls));

  // ---- Probe 25: Tap auf die Blase (pointerup OHNE Move) öffnet im Ruhezustand ----
  // Regression-Schutz für Klaus' Befund 2026-06-21: setPointerCapture unterdrückte
  // auf Touch das click-Event → Blase ließ sich nicht wieder antippen. Fix: Tap im
  // pointerup behandeln.
  W.collapse();
  eq("Probe 25: collapse → isExpanded false", "false", String(W.isExpanded()));
  const root2 = stub.document.getElementById("sbkim-search-widget");
  root2.dispatchEvent({ type: "pointerdown", target: root2, pointerId: 7, clientX: 50, clientY: 50 });
  root2.dispatchEvent({ type: "pointerup", target: root2, pointerId: 7, clientX: 50, clientY: 50 });
  eq("Probe 25: Tap (pointerup ohne Move) öffnet das Panel", "true", String(W.isExpanded()));

  // ---- Probe 26: echter Drag (mit Move) öffnet NICHT (nur verschieben) ----
  W.collapse();
  root2.dispatchEvent({ type: "pointerdown", target: root2, pointerId: 8, clientX: 50, clientY: 50 });
  root2.dispatchEvent({ type: "pointermove", target: root2, pointerId: 8, clientX: 140, clientY: 160 });
  root2.dispatchEvent({ type: "pointerup", target: root2, pointerId: 8, clientX: 140, clientY: 160 });
  eq("Probe 26: Drag (mit Move) öffnet NICHT", "false", String(W.isExpanded()));

  // ---- Probe 27: Netz-Link öffnet per Klick (Touch-fest, window.open) ----
  // Regression-Schutz für Klaus' Befund 2026-06-21: Netz-Link ließ sich nicht öffnen.
  let opened = null;
  stub.open = (url) => { opened = url; return {}; };
  mountMatch("treffer");
  await W.init({ areas: { app: false, knoten: false, internet: true }, searxngUrl: "" });
  W.show(); W.expand();
  const field = queryFirst(root, ".sbkim-sw-input");
  field.value = "wetter berlin";
  const searchBtn = queryFirst(root, ".sbkim-sw-search");
  searchBtn.dispatchEvent({ type: "click", target: searchBtn, stopPropagation: () => {} });
  await new Promise((r) => setTimeout(r, 0));
  const link = queryFirst(root, ".sbkim-sw-result-link");
  record("Probe 27: Netz-Link gerendert", "true", String(!!link), !!link);
  if (link) {
    link.dispatchEvent({ type: "click", target: link, preventDefault: () => {}, stopPropagation: () => {} });
  }
  record("Probe 27: Klick öffnet URL (window.open)", "true",
    String(typeof opened === "string" && /duckduckgo/.test(opened)),
    typeof opened === "string" && /duckduckgo/.test(opened));

  // ---- Probe 28: Web-Suchmaschine frei wählbar (Default DuckDuckGo, Wahl Google) ----
  eq("Probe 28: _meta.webEngine Default", "duckduckgo", W._meta.webEngine);
  await W.init({ areas: { app: false, knoten: false, internet: true }, webSearchEngine: "google" });
  eq("Probe 28: webEngine auf google gesetzt", "google", W._meta.webEngine);
  res = await W.search("wetter berlin");
  record("Probe 28: webLink nutzt Google", "true",
    String(!!(res.webLink && /google\.com\/search/.test(res.webLink.url))),
    !!(res.webLink && /google\.com\/search/.test(res.webLink.url)));
  await W.init({ webSearchEngine: "duckduckgo" }); // zurück

  // ---- Probe 29: KI-Such-Brücke Stufe A — Prompt bauen ----
  const prompt = W.buildPrompt("Wespen am Esstisch");
  record("Probe 29: Prompt enthält Frage", "true",
    String(/Wespen am Esstisch/.test(prompt)), /Wespen am Esstisch/.test(prompt));
  record("Probe 29: Prompt verlangt Code-Block", "true",
    String(/Code-Block/.test(prompt) && /JSON/.test(prompt)), /Code-Block/.test(prompt) && /JSON/.test(prompt));
  record("Probe 29: Prompt verlangt Bedeutungs-/Absicht-Suche (Semantik)", "true",
    String(/BEDEUTUNG/.test(prompt) && /Absicht/.test(prompt) && /Nischen/.test(prompt)),
    /BEDEUTUNG/.test(prompt) && /Absicht/.test(prompt) && /Nischen/.test(prompt));
  // Agenten-Visitenkarte führt den Prompt an (Handschlag vor der Frage).
  record("Probe 29: Visitenkarten-Präambel voran", "true",
    String(/SBKIM-Such-Agent · Visitenkarte/.test(prompt) && /Gegen-Agent/.test(prompt)
      && prompt.indexOf("Visitenkarte") < prompt.indexOf("Meine Frage")),
    /SBKIM-Such-Agent · Visitenkarte/.test(prompt) && /Gegen-Agent/.test(prompt)
      && prompt.indexOf("Visitenkarte") < prompt.indexOf("Meine Frage"));
  // Schärfen: optionaler Kontext wird in den Prompt gewoben.
  const promptCtx = W.buildPrompt("Mittel gegen Zecken", "als Spray, in Deutschland kaufen");
  record("Probe 29: Schärfen-Kontext im Prompt", "true",
    String(/Kontext\): als Spray, in Deutschland kaufen/.test(promptCtx)),
    /Kontext\): als Spray, in Deutschland kaufen/.test(promptCtx));
  record("Probe 29: ohne Kontext keine Kontext-Zeile", "true",
    String(!/Kontext\)/.test(W.buildPrompt("nur frage"))), !/Kontext\)/.test(W.buildPrompt("nur frage")));

  // ---- Probe 30: parseAiAnswer — Code-Fence + URL-Müll säubern ----
  const messy = '```json\n[{"titel":"A","url":"https://a.de/x⁠�","quelle":"a.de","text":"eins"},' +
    '{"titel":"B","url":"https://b.de/y","quelle":"b.de","text":"zwei"}]\n```';
  const parsed = W.parseAiAnswer(messy);
  eq("Probe 30: zwei Einträge geparst", 2, parsed.length);
  eq("Probe 30: URL-Müll abgeschnitten", "https://a.de/x", parsed[0].url);
  eq("Probe 30: leerer Text → []", 0, W.parseAiAnswer("kein json hier").length);

  // ---- Probe 31: eingefügte KI-Antwort wird semantisch sortiert ----
  stub.SbkimEmbedding = { embedPassageBatch: async (texts) => texts.map(() => new Float32Array(384)) };
  await W.init({ areas: { app: false, knoten: false, internet: true }, richter: false });
  W.setCorpus([]); // App leer
  const ok = W.setAiAnswer('[{"titel":"Wespen vertreiben","url":"https://x.de/w","quelle":"x.de","text":"Hausmittel am Tisch"},' +
    '{"titel":"Nest entfernen","url":"https://y.de/n","quelle":"y.de","text":"Wespennest"}]');
  record("Probe 31: setAiAnswer erkennt Quellen", "true", String(ok), ok === true);
  record("Probe 31: _meta.hasPastedAi", "true", String(W._meta.hasPastedAi), W._meta.hasPastedAi === true);
  res = await W.search("Hausmittel gegen Wespen");
  const fromAi = (res.treffer || []).filter(t => t.source === "internet");
  record("Probe 31: KI-Quellen als internet-Treffer sortiert", "true",
    String(fromAi.length >= 1), fromAi.length >= 1);
  delete stub.SbkimEmbedding;

  // ---- Probe 32: KI-Anbieter — Mistral/Aleph Alpha raus (Klaus 2026-06-21) ----
  await W.init({ euPolicy: "frei" });
  const provs = W._meta.aiProviders;
  record("Probe 32: chatgpt/claude/gemini/perplexity, kein mistral/alephalpha", "true",
    String(provs.length === 4 && provs.indexOf("mistral") < 0 && provs.indexOf("alephalpha") < 0
      && provs.indexOf("chatgpt") >= 0 && provs.indexOf("claude") >= 0
      && provs.indexOf("gemini") >= 0 && provs.indexOf("perplexity") >= 0),
    provs.length === 4 && provs.indexOf("mistral") < 0 && provs.indexOf("alephalpha") < 0
      && provs.indexOf("chatgpt") >= 0 && provs.indexOf("claude") >= 0
      && provs.indexOf("gemini") >= 0 && provs.indexOf("perplexity") >= 0);
  // bindend → kein EU-Anbieter da → Fallback auf alle (kein leeres Dropdown).
  await W.init({ euPolicy: "bindend" });
  record("Probe 32: bindend → Fallback auf alle 4 (kein leeres Set)", "4", String(W._meta.aiProviders.length),
    W._meta.aiProviders.length === 4);
  await W.init({ euPolicy: "frei" }); // zurück

  // ---- Probe 33: SearXNG als Neuer-Tab-Suchmaschine wählbar ----
  await W.init({ areas: { app: false, knoten: false, internet: true }, webSearchEngine: "searxng" });
  eq("Probe 33: webEngine auf searxng", "searxng", W._meta.webEngine);
  W.setAiAnswer(""); // keine KI-Antwort → Neuer-Tab-Weg
  res = await W.search("wespen tisch");
  record("Probe 33: ohne eigene Instanz → öffentliche searx.be", "true",
    String(!!(res.webLink && /searx\.be\/search\?q=/.test(res.webLink.url))),
    !!(res.webLink && /searx\.be\/search\?q=/.test(res.webLink.url)));
  await W.init({ webSearchEngine: "duckduckgo" }); // zurück

  // ---- Probe 34: Minimieren hält das Widget im Bild (Klaus-Befund 2026-06-21) ----
  await W.init({ areas: { app: false, knoten: false, internet: true } });
  W.expand();
  const origRect = root.getBoundingClientRect;
  // Panel ragt rechts aus dem 1024er-Viewport (left 1000, width 320 → bis 1320).
  root.getBoundingClientRect = () => ({ left: 1000, top: 100, right: 1320, bottom: 300, width: 320, height: 200, x: 1000, y: 100 });
  W.collapse();
  root.getBoundingClientRect = origRect;
  const p34 = W.getPosition();
  record("Probe 34: nach Minimieren x in den Viewport geklemmt", "true",
    String(typeof p34.x === "number" && p34.x >= 8 && p34.x <= 1024 - 8),
    typeof p34.x === "number" && p34.x >= 8 && p34.x <= 1024 - 8);
  record("Probe 34: Mittelpunkt-Halten → Frei-Position (corner null)", "true",
    String(p34.corner === null), p34.corner === null);

  // ---- Probe 35: X parkt oben als Lupe statt zu verstecken (Klaus-Befund) ----
  await W.init({ areas: { app: false, knoten: false, internet: true } });
  W.expand();
  W.dockToTop();
  eq("Probe 35: dockToTop → eingeklappt (Lupe)", "false", String(W.isExpanded()));
  record("Probe 35: bleibt sichtbar (nicht versteckt)", "true", String(W.isVisible()), W.isVisible() === true);
  const p35 = W.getPosition();
  eq("Probe 35: oben rechts verankert (corner)", "top-right", p35.corner);

  // ---- Probe 36: alter „versteckt"-Zustand wird beim Laden geheilt ----
  stub.localStorage.setItem("sbkim_search_widget_visible", "false");
  await W.init({}); // re-init liest localStorage
  record("Probe 36: gestrandetes hidden=false → wieder sichtbar", "true",
    String(W.isVisible()), W.isVisible() === true);
  eq("Probe 36: localStorage geheilt auf true", "true",
    stub.localStorage.getItem("sbkim_search_widget_visible"));

  // ---- Probe 37: Treffer-Wert als Prozent + Snippet (Klaus-Wunsch) ----
  mountMatch("treffer");
  stub.SbkimEmbedding = { embedPassageBatch: async (texts) => texts.map(() => new Float32Array(384)) };
  await W.init({ areas: { app: false, knoten: false, internet: true } });
  W.setAiAnswer('[{"titel":"Alpha","url":"https://a.de","quelle":"a.de","text":"Inhalt A"},' +
    '{"titel":"Beta","url":"https://b.de","quelle":"b.de","text":"Inhalt B"}]');
  let field37 = queryFirst(root, ".sbkim-sw-input");
  field37.value = "frage";
  let btn37 = queryFirst(root, ".sbkim-sw-search");
  btn37.dispatchEvent({ type: "click", target: btn37, stopPropagation: () => {} });
  for (let _t = 0; _t < 8; _t++) await new Promise((r) => setTimeout(r, 0));
  const scoreEl = queryFirst(root, ".sbkim-sw-score");
  record("Probe 37: Wert als Prozent gerendert", "true",
    String(!!scoreEl && /%$/.test(scoreEl.textContent)), !!scoreEl && /%$/.test(scoreEl.textContent));
  const snipEl = queryFirst(root, ".sbkim-sw-snippet");
  record("Probe 37: Snippet (Inhalt) gezeigt", "true",
    String(!!snipEl && /Inhalt/.test(snipEl.textContent)), !!snipEl && /Inhalt/.test(snipEl.textContent));

  // ---- Probe 38: 10 zeigen, Rest hinter ▾-Pfeil, Klick lädt 10 nach ----
  const bigCorpus = [];
  for (let i = 0; i < 12; i++) bigCorpus.push({ label: "T" + i, score: 0.9 - i * 0.01, anchorId: "k" + i });
  const savedQL = stub.SbkimMatch.queryLocal;
  stub.SbkimMatch.queryLocal = async () => bigCorpus.map(c => ({ label: c.label, score: c.score, anchorId: c.anchorId }));
  let field38 = queryFirst(root, ".sbkim-sw-input");
  field38.value = "frage";
  let btn38 = queryFirst(root, ".sbkim-sw-search");
  btn38.dispatchEvent({ type: "click", target: btn38, stopPropagation: () => {} });
  for (let _t = 0; _t < 8; _t++) await new Promise((r) => setTimeout(r, 0));
  eq("Probe 38: zunächst 10 Treffer sichtbar", 10, queryAll(root, ".sbkim-sw-result").length);
  const moreBtn = queryFirst(root, ".sbkim-sw-more");
  record("Probe 38: ▾-Pfeil vorhanden", "true", String(!!moreBtn), !!moreBtn);
  if (moreBtn) moreBtn.dispatchEvent({ type: "click", target: moreBtn, preventDefault: () => {}, stopPropagation: () => {} });
  eq("Probe 38: nach Klick alle 12 sichtbar", 12, queryAll(root, ".sbkim-sw-result").length);
  // 🖨 Block-Kopieren: Knopf da + Text-Block enthält alle 12 Treffer als Text.
  const copyAllBtn = queryFirst(root, ".sbkim-sw-copyall");
  record("Probe 38: 🖨 Block-kopieren-Knopf da", "true", String(!!copyAllBtn), !!copyAllBtn);
  const blockText = W.resultsAsText();
  record("Probe 38: Text-Block listet alle 12 Treffer", "true",
    String(/T0/.test(blockText) && /T11/.test(blockText) && /12 Treffer/.test(blockText)),
    /T0/.test(blockText) && /T11/.test(blockText) && /12 Treffer/.test(blockText));
  stub.SbkimMatch.queryLocal = savedQL;
  delete stub.SbkimEmbedding;

  // ---- Probe 39: Widget-Tresor (Stufe B · B1) — Krypto-Roundtrip + Shamir ----
  stub.localStorage.removeItem("sbkim_search_widget_vault");
  await W.init({});
  record("Probe 39: kein Tresor vor Anlegen", "true", String(!W._meta.hasVault), !W._meta.hasVault);
  // Schwaches Passwort → Reject.
  let weakRejected = false;
  try { await W.createVault("kurz", { chatgpt: "sk-x" }); } catch (e) { weakRejected = (e.name === "WeakPasswordError"); }
  record("Probe 39: schwaches Passwort abgelehnt", "true", String(weakRejected), weakRejected);
  // Anlegen mit gutem Passwort → 3 Anteile, entsperrt, Schlüssel in optApiKey.
  const created = await W.createVault("gutes-passwort-123", { chatgpt: "sk-geheim-42" });
  eq("Probe 39: 3 Shamir-Anteile zurück", 3, created.shares.length);
  record("Probe 39: Tresor existiert + entsperrt", "true",
    String(W._meta.hasVault && W._meta.vaultUnlocked), W._meta.hasVault && W._meta.vaultUnlocked);
  record("Probe 39: Schlüssel in optApiKey gespiegelt", "true", String(W._meta.hasApiKey), W._meta.hasApiKey === true);
  // Klartext-Schlüssel NICHT in localStorage.
  const stored = stub.localStorage.getItem("sbkim_search_widget_vault");
  record("Probe 39: Klartext-Schlüssel nicht im Speicher", "true",
    String(stored.indexOf("sk-geheim-42") < 0), stored.indexOf("sk-geheim-42") < 0);
  // Sperren → entsperrt false.
  W.lockVault();
  record("Probe 39: lockVault → gesperrt", "true", String(!W._meta.vaultUnlocked), !W._meta.vaultUnlocked);
  // Falsches Passwort → false (kein Oracle).
  const badUnlock = await W.unlockVault("falsch-falsch-99");
  eq("Probe 39: falsches Passwort → false", false, badUnlock);
  // Richtiges Passwort → true.
  const goodUnlock = await W.unlockVault("gutes-passwort-123");
  eq("Probe 39: richtiges Passwort → true", true, goodUnlock);

  // ---- Probe 40: Shamir 2-von-3 Passwort-Recovery ----
  const r2 = W.recoverVaultPassword([created.shares[0], created.shares[2]]);
  eq("Probe 40: 2 Anteile rekonstruieren Passwort", "gutes-passwort-123", r2);
  const r1 = W.recoverVaultPassword([created.shares[1]]);
  eq("Probe 40: 1 Anteil reicht NICHT", null, r1);
  const r3 = W.recoverVaultPassword([created.shares[0], created.shares[1], created.shares[2]]);
  eq("Probe 40: alle 3 Anteile auch ok", "gutes-passwort-123", r3);
  stub.localStorage.removeItem("sbkim_search_widget_vault");

  // ---- Probe 41: Tresor-UI (B1b) — 🔐 öffnen, anlegen, Anteile, entsperrt ----
  W.lockVault(); // evtl. Reststand aus Probe 39 räumen
  await W.init({});
  const vBtn = queryFirst(root, ".sbkim-sw-vaultbtn");
  record("Probe 41: 🔐-Knopf im Kopf vorhanden", "true", String(!!vBtn), !!vBtn);
  const vSec = queryFirst(root, ".sbkim-sw-vault");
  record("Probe 41: Tresor-Sektion zunächst zu", "none", vSec.style.display, vSec.style.display === "none");
  vBtn.dispatchEvent({ type: "click", target: vBtn, stopPropagation: () => {} });
  record("Probe 41: Klick öffnet Tresor-Sektion", "block", vSec.style.display, vSec.style.display === "block");
  const vInputs = queryAll(root, ".sbkim-sw-vinput");
  record("Probe 41: Passwort- + Schlüssel-Feld da", "2", String(vInputs.length), vInputs.length === 2);
  vInputs[0].value = "mein-tresor-pw-1"; // Passwort
  vInputs[1].value = "sk-ui-geheim-77";  // Schlüssel
  const createBtn = queryFirst(root, ".sbkim-sw-vbtn");
  createBtn.dispatchEvent({ type: "click", target: createBtn, stopPropagation: () => {} });
  await new Promise((r) => setTimeout(r, 800)); // PBKDF2 600k braucht echte Zeit
  record("Probe 41: nach Anlegen entsperrt", "true", String(W._meta.vaultUnlocked), W._meta.vaultUnlocked === true);
  const sharesTa = queryFirst(root, ".sbkim-sw-vshares");
  record("Probe 41: Anteile-Feld gezeigt (3 Zeilen)", "true",
    String(!!sharesTa && sharesTa.value.split("\n").length === 3),
    !!sharesTa && sharesTa.value.split("\n").length === 3);
  stub.localStorage.removeItem("sbkim_search_widget_vault");
  W.lockVault();

  // ---- Probe 42: B2-Probe — automatischer Claude-Aufruf (gemockter fetch) ----
  mountMatch("treffer");
  stub.SbkimEmbedding = { embedPassageBatch: async (texts) => texts.map(() => new Float32Array(384)) };
  // ohne Schlüssel → fail-soft false, kein Throw.
  await W.init({ areas: { app: false, knoten: false, internet: true }, aiProvider: "claude" });
  const noKey = await W.autoSearch("zeckenmittel hund");
  eq("Probe 42: ohne Schlüssel → false (fail-soft)", false, noKey);
  // nicht-Claude-Anbieter → false (nur Claude unterstützt).
  await W.init({ aiProvider: "chatgpt", apiKey: "sk-test" });
  eq("Probe 42: nicht-Claude → autoSearch false", false, await W.autoSearch("x"));
  record("Probe 42: aiAutoSupported nur bei claude", "true",
    String(W.aiAutoSupported() === false), W.aiAutoSupported() === false);
  // Claude + Schlüssel + gemockter fetch → Treffer sortiert.
  let captured = null;
  stub.fetch = async (url, opts) => {
    captured = { url, opts };
    return { ok: true, status: 200, json: async () => ({
      content: [{ type: "text", text: '```json\n[{"titel":"Bravecto","url":"https://a.de","quelle":"a.de","text":"oral, katzensicher"},' +
        '{"titel":"Advantix","url":"https://b.de","quelle":"b.de","text":"Permethrin, für Katzen tödlich"}]\n```' }],
    }) };
  };
  await W.init({ aiProvider: "claude", apiKey: "sk-test-key" });
  const autoOk = await W.autoSearch("zeckenmittel hund");
  await new Promise((r) => setTimeout(r, 0));
  eq("Probe 42: Claude-Auto → true", true, autoOk);
  record("Probe 42: ruft api.anthropic.com mit Browser-Header", "true",
    String(!!captured && /api\.anthropic\.com/.test(captured.url)
      && captured.opts.headers["anthropic-dangerous-direct-browser-access"] === "true"),
    !!captured && /api\.anthropic\.com/.test(captured.url)
      && captured.opts.headers["anthropic-dangerous-direct-browser-access"] === "true");
  record("Probe 42: Web-Suche-Tool im Body", "true",
    String(!!captured && /web_search/.test(captured.opts.body)), !!captured && /web_search/.test(captured.opts.body));
  record("Probe 42: Treffer gerendert", "true",
    String(queryAll(root, ".sbkim-sw-result").length >= 1), queryAll(root, ".sbkim-sw-result").length >= 1);
  // CORS/Netzfehler → fail-soft false, kein Throw.
  stub.fetch = async () => { throw new TypeError("Failed to fetch"); };
  eq("Probe 42: CORS-Fehler → false (fail-soft)", false, await W.autoSearch("x"));
  // Antwort ohne JSON-Liste → Rohantwort landet im Einfüge-Feld (Diagnose).
  stub.fetch = async () => ({ ok: true, status: 200, json: async () => ({
    stop_reason: "end_turn",
    content: [{ type: "text", text: "Magst du es eher als Spray oder als Tablette?" }],
  }) });
  const aiPaste = queryFirst(root, ".sbkim-sw-aipaste");
  eq("Probe 42: Antwort ohne Liste → false", false, await W.autoSearch("zecken"));
  await new Promise((r) => setTimeout(r, 0));
  record("Probe 42: Rohantwort ins Einfüge-Feld gelegt", "true",
    String(!!aiPaste && /Spray oder als Tablette/.test(aiPaste.value)),
    !!aiPaste && /Spray oder als Tablette/.test(aiPaste.value));
  // Fortschrittsbalken: sichtbar WÄHREND des Aufrufs, füllt sich danach.
  const progEl = queryFirst(root, ".sbkim-sw-progress");
  record("Probe 42: Fortschrittsbalken-Element vorhanden", "true", String(!!progEl), !!progEl);
  let releaseFetch;
  stub.fetch = () => new Promise((r) => { releaseFetch = () => r({ ok: true, status: 200, json: async () => ({
    content: [{ type: "text", text: '```json\n[{"titel":"Y","url":"https://y.de","quelle":"y.de"}]\n```' }],
  }) }); });
  const pending = W.autoSearch("zecken");
  await new Promise((r) => setTimeout(r, 0));
  record("Probe 42: Balken sichtbar während des Aufrufs", "block", progEl.style.display, progEl.style.display === "block");
  releaseFetch();
  await pending;
  record("Probe 42: Balken füllt sich (done) nach Erfolg", "true",
    String(progEl._classes.has("done")), progEl._classes.has("done"));
  delete stub.fetch;
  delete stub.SbkimEmbedding;
  stub.localStorage.removeItem("sbkim_search_widget_vault");

  // ---- Probe 43: X (dockToTop) leert Inhalt, – (collapse) behält ihn ----
  mountMatch("treffer");
  await W.init({ areas: { app: true, knoten: false, internet: false } });
  W.setCorpus(APP_CORPUS);
  W.expand();
  let inp = queryFirst(root, ".sbkim-sw-input");
  // Minimieren behält den Feld-Inhalt.
  inp.value = "behalten bitte";
  W.collapse();
  inp = queryFirst(root, ".sbkim-sw-input");
  eq("Probe 43: Minimieren (–) behält Feld-Inhalt", "behalten bitte", inp.value);
  // X (dockToTop) leert Feld + Treffer + eingefügte KI-Antwort.
  W.expand();
  inp = queryFirst(root, ".sbkim-sw-input");
  inp.value = "weg damit";
  W.setAiAnswer('[{"titel":"X","url":"https://x.de","quelle":"x.de"}]');
  W.dockToTop();
  inp = queryFirst(root, ".sbkim-sw-input");
  eq("Probe 43: X leert Feld-Inhalt", "", inp.value);
  record("Probe 43: X leert eingefügte KI-Antwort", "true", String(W._meta.hasPastedAi === false), W._meta.hasPastedAi === false);
}

const finalize = () => {
  let allOk = true;
  console.log("\n=== Bau 22 Such-Widget Smoke-Test ===");
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} ${r.probe}\n   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
    if (!r.ok) allOk = false;
  }
  console.log(`\nTotal: ${results.length} Proben, ${results.filter(r => r.ok).length} grün, ${results.filter(r => !r.ok).length} rot.`);
  if (!allOk) process.exit(1);
};

run().then(finalize).catch((err) => {
  console.error("Smoke-Test-Runner hat unerwartet geworfen:", err);
  process.exit(1);
});
