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
