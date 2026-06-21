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
      return [
        { label: "Lasagne", score: 0.91, anchorId: "r1" },
        { label: "Tomatensuppe", score: 0.84, anchorId: "r2" },
      ];
    },
    _lastHybridOpts: null,
    async hybridMatch(query, candidates, opts) {
      this._lastHybridOpts = opts;
      if (behavior === "richter-failsoft") {
        return { available: false, reason: "API HTTP 429" };
      }
      return {
        available: true,
        verdicts: [
          { label: "Lasagne", anchorId: "r1", passt: true, score: 0.95, begruendung: "passt direkt" },
          { label: "Tomatensuppe", anchorId: "r2", passt: false, score: 0.3, begruendung: "passt nicht" },
        ],
        attestation: { kind: "sbkim-hybrid-match-judgment", version: 1 },
      };
    },
  };
}

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

  // ---- Probe 6: Suche modul-04-fehlt ----
  mountMatch("fehlt");
  let res = await W.search("lasagne");
  eq("Probe 6: ohne Modul 04 → modul-04-fehlt", "modul-04-fehlt", res.mode);
  eq("Probe 6: treffer leer", "0", String(res.treffer.length));

  // ---- Probe 7: Suche vorfilter-leer ----
  mountMatch("leer");
  res = await W.search("nichtsfindbar");
  eq("Probe 7: leerer Vorfilter → vorfilter-leer", "vorfilter-leer", res.mode);

  // ---- Probe 8: Suche nur-vorfilter (kein Key) ----
  mountMatch("treffer");
  res = await W.search("lasagne");
  eq("Probe 8: kein Key → nur-vorfilter", "nur-vorfilter", res.mode);
  eq("Probe 8: 2 Vorfilter-Treffer", "2", String(res.treffer.length));

  // ---- Probe 9: Suche richter (mit Key via init) ----
  mountMatch("treffer");
  await W.init({ apiKey: "test-key", provider: "mistral", queryLabel: "Sage" });
  eq("Probe 9: _meta.hasApiKey", "true", String(W._meta.hasApiKey));
  res = await W.search("lasagne");
  eq("Probe 9: mit Key → richter", "richter", res.mode);
  eq("Probe 9: nur passende Treffer (1)", "1", String(res.treffer.length));
  eq("Probe 9: Top-Treffer Lasagne", "Lasagne", res.treffer[0].label);
  record("Probe 9: attestation vorhanden", "true", String(!!res.attestation), !!res.attestation);

  // ---- Probe 10: euOnly an hybridMatch (frei → false, bindend → true) ----
  eq("Probe 10: euPolicy frei → euOnly false", "false", String(stub.SbkimMatch._lastHybridOpts.euOnly));
  await W.init({ euPolicy: "bindend" });
  await W.search("lasagne");
  eq("Probe 10: euPolicy bindend → euOnly true", "true", String(stub.SbkimMatch._lastHybridOpts.euOnly));
  await W.init({ euPolicy: "frei" }); // zurück

  // ---- Probe 11: Richter fail-soft → fail-soft-vorfilter ----
  mountMatch("richter-failsoft");
  await W.init({ apiKey: "test-key" });
  res = await W.search("lasagne");
  eq("Probe 11: Richter nicht verfügbar → fail-soft-vorfilter", "fail-soft-vorfilter", res.mode);
  eq("Probe 11: Vorfilter-Treffer bleiben (2)", "2", String(res.treffer.length));
  record("Probe 11: reason gesetzt", "true", String(!!res.reason), !!res.reason);

  // ---- Probe 12: queryLocal wirft → vorfilter-fehler (fail-soft, kein Throw) ----
  mountMatch("wirft");
  let threw = false;
  try { res = await W.search("lasagne"); } catch (e) { threw = true; }
  record("Probe 12: queryLocal-Throw wird gefangen", "false", String(threw), threw === false);
  eq("Probe 12: → vorfilter-fehler", "vorfilter-fehler", res.mode);

  // ---- Probe 13: setCorpus reicht an SbkimMatch durch + _meta ----
  mountMatch("treffer");
  const corpus = [
    { label: "Lasagne", text: "Nudelauflauf", passageVec: new Float32Array(384), anchorId: "r1" },
    { label: "Tomatensuppe", text: "Suppe", passageVec: new Float32Array(384), anchorId: "r2" },
  ];
  W.setCorpus(corpus);
  eq("Probe 13: _meta.corpusSize", "2", String(W._meta.corpusSize));
  record("Probe 13: an SbkimMatch durchgereicht", "true", String(stub.SbkimMatch._corpus && stub.SbkimMatch._corpus.length === 2),
    stub.SbkimMatch._corpus && stub.SbkimMatch._corpus.length === 2);

  // ---- Probe 14: UX-Erhalt — Re-Render der Treffer leert das Feld NICHT ----
  const input = queryFirst(root, ".sbkim-sw-input");
  input.value = "mein gesprochener text";
  input.dispatchEvent({ type: "input", target: input });
  // Suche rendert Treffer neu:
  await W.init({ apiKey: "test-key" });
  await W.search("lasagne");
  eq("Probe 14: Textfeld-Wert bleibt nach Treffer-Render", "mein gesprochener text", input.value);

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

  // ---- Probe 19: search() mit leerem/whitespace Text → vorfilter-leer (kein Throw) ----
  mountMatch("treffer");
  res = await W.search("   ");
  eq("Probe 19: Whitespace-Text → vorfilter-leer", "vorfilter-leer", res.mode);

  // ---- Probe 20: prepareCorpus wirft → fail-soft vorfilter-fehler (corpusReady bleibt false) ----
  mountMatch("treffer");
  await W.init({ prepareCorpus: async function () { throw new Error("Modell-Download fehlgeschlagen"); } });
  eq("Probe 20: corpusReady vor Vorbereitung false", "false", String(W._meta.corpusReady));
  let prepThrew = false;
  try { res = await W.search("lasagne"); } catch (e) { prepThrew = true; }
  record("Probe 20: werfender Preparer wird gefangen (kein Throw)", "false", String(prepThrew), prepThrew === false);
  eq("Probe 20: → vorfilter-fehler", "vorfilter-fehler", res.mode);
  eq("Probe 20: corpusReady bleibt false (Retry möglich)", "false", String(W._meta.corpusReady));

  // ---- Probe 21: prepareCorpus — lazy, einmalig, gesetzter Korpus, Treffer ----
  let prepCalls = 0;
  const preparedCorpus = [
    { label: "Lasagne", text: "Nudelauflauf", passageVec: new Float32Array(384), anchorId: "r1" },
  ];
  await W.init({ prepareCorpus: async function () { prepCalls++; return preparedCorpus; } });
  res = await W.search("lasagne");
  eq("Probe 21: prepareCorpus genau 1× gerufen", "1", String(prepCalls));
  eq("Probe 21: corpusReady nach Suche true", "true", String(W._meta.corpusReady));
  eq("Probe 21: Korpus an Widget gesetzt (corpusSize)", "1", String(W._meta.corpusSize));
  record("Probe 21: Suche nach Vorbereitung liefert Treffer", "true",
    String(res.treffer.length >= 1), res.treffer.length >= 1);

  // ---- Probe 22: zweite Suche bereitet NICHT erneut vor (Cache) ----
  res = await W.search("lasagne nochmal");
  eq("Probe 22: prepareCorpus weiterhin nur 1× (gecacht)", "1", String(prepCalls));
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
