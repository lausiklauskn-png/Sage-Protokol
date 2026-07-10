// Smoke-Test Bau 23.B-Härtung — Korpus-Kopplung gegen die „Korpus-leer-Falle".
//
// Der Riss (PULS.md 2026-07-02 / Brief A1 2026-07-10): enableAnswering() ruft
// beim Fragen queryLocal — ECHTE Treffer gibt es aber nur, wenn Modul 04 vorher
// einen lokalen Korpus registriert bekam (setLocalCorpus). Bisher tat das
// AUSSCHLIESSLICH das Such-Widget (Modul 22) LAZY bei der ersten Widget-Suche.
// Wer „💬 Antworten" AN-schaltete, aber nie selbst suchte, antwortete mit LEERER
// Liste trotz vorhandener Daten. Diese Sitzung koppelt den Korpus beim
// Einschalten des Antwortrechts AKTIV (cfg.prepareCorpus → setLocalCorpus).
//
// Dieser Test beweist HEADLESS die Kopplungs-Logik von Modul 23 mit dem ECHTEN
// Sage-Such-Korpus (sbkim/sage-suchkorpus.js) und einem VERTRAGSTREUEN Mock-
// Modul-04 (setLocalCorpus speichert; queryLocal filtert lexikalisch über den
// gespeicherten Korpus — kein 30-MB-Modell nötig, aber die Treffer sind ECHTE
// SAGE_SUCHKORPUS-Einträge, nicht hartcodiert). Zwei getrennte Modul-23-
// Instanzen (vm-Kontexte = zwei „Browser") + ein In-Memory-Mock-Relais wie in
// smoke_bau23b_query.mjs. KEIN WebSocket, KEIN Netz, KEIN DOM.
//
// Proben:
//   1) Setup: echter SAGE_SUCHKORPUS geladen, Surface + _meta-Felder vorhanden.
//   2) DIE FALLE: Antworter B mit prepareCorpus, aber VOR enableAnswering hat
//      Modul 04 keinen Korpus → queryLocal leer, answerCorpusEnsured=false.
//   3) init() allein koppelt NICHT (Empfangsmodus — erst das bewusste AN).
//   4) enableAnswering() koppelt AKTIV → answerCorpusEnsured=true, queryLocal
//      liefert jetzt ECHTE SAGE-Treffer (Kopplung geheilt).
//   5) End-to-end A→B über das Relais: askNode liefert echte SAGE-Treffer
//      (label + anchorId durchgereicht) AUCH OHNE vorherige Widget-Suche.
//   6) Fail-soft: prepareCorpus WIRFT → enableAnswering trotzdem ok, kein
//      answerCorpusEnsured, kein Throw, Antwort ehrlich leer.
//   7) Fail-soft: match OHNE setLocalCorpus → enableAnswering ok, kein Bruch.
//   8) Opt-in: OHNE prepareCorpus fasst enableAnswering den Korpus nicht an
//      (App koppelt anders, z.B. übers Widget) → answerCorpusEnsured=false.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const moduleCode = readFileSync(join(repoRoot, "src/modules/23_rendezvous.js"), "utf8");
const korpusCode = readFileSync(join(repoRoot, "sbkim/sage-suchkorpus.js"), "utf8");

let ok = 0, fail = 0;
function t(name, cond, extra) {
  if (cond) { ok++; console.log("✓ " + name); }
  else { fail++; console.log("✗ FAIL: " + name + (extra ? " — " + extra : "")); }
}

// ---- Echten SAGE_SUCHKORPUS laden (reine {label,text,anchorId}-Einträge) ----
const korpusCtx = { console: { info() {} } };
korpusCtx.globalThis = korpusCtx;
vm.createContext(korpusCtx);
vm.runInContext(korpusCode, korpusCtx, { filename: "sage-suchkorpus.js" });
const SAGE = korpusCtx.SAGE_SUCHKORPUS;

// prepareCorpus-Provider wie in der App: hängt je Eintrag einen (hier
// unbenutzten) passageVec an — der Mock-Richter unten arbeitet lexikalisch,
// aber die durchgereichten Daten sind die ECHTEN Korpus-Einträge.
async function buildSageCorpus() {
  return SAGE.map(function (e) {
    return { label: e.label, text: e.text, anchorId: e.anchorId, passageVec: null };
  });
}

// ---- Vertragstreuer Mock von Modul 04 (setLocalCorpus + queryLocal) ----
// setLocalCorpus speichert den Korpus (genau wie das echte Modul). queryLocal
// filtert LEXIKALISCH über den gespeicherten Korpus — ohne registrierten Korpus
// gibt es NICHTS (das ist die Falle). So bildet der Mock exakt die Kopplung ab,
// die diese Sitzung härtet, ohne ein echtes Embedding-Modell zu brauchen.
function makeMatchMock(opts) {
  opts = opts || {};
  let corpus = null;
  const api = {
    relatedness() { return 0; },
    async queryLocal(text, k) {
      if (!Array.isArray(corpus) || corpus.length === 0) return []; // Korpus-leer-Falle
      const words = String(text).toLowerCase().split(/\s+/).filter(Boolean);
      const scored = corpus.map(function (c) {
        const hay = (String(c.label) + " " + String(c.text)).toLowerCase();
        let hits = 0;
        for (const w of words) if (w.length >= 3 && hay.indexOf(w) !== -1) hits++;
        return { label: c.label, score: hits / Math.max(1, words.length), anchorId: c.anchorId, hits };
      }).filter(function (r) { return r.hits > 0; });
      scored.sort(function (a, b) { return b.score - a.score; });
      return scored.slice(0, k).map(function (r) { return { label: r.label, score: r.score, anchorId: r.anchorId }; });
    },
    _corpusLen() { return Array.isArray(corpus) ? corpus.length : 0; },
  };
  if (!opts.noSetLocalCorpus) {
    api.setLocalCorpus = function (c) { corpus = Array.isArray(c) ? c.slice() : null; };
  }
  return api;
}

// ---- In-Memory-Mock-Relais (geteilt zwischen den Kontexten) ----
function makeMockRelay() {
  const subs = [];
  const stored = [];
  let seq = 0;
  function matches(filter, ev) {
    if (filter.kinds && !filter.kinds.includes(ev.kind)) return false;
    if (filter["#t"]) {
      const tags = (ev.tags || []).filter(x => x[0] === "t").map(x => x[1]);
      if (!filter["#t"].some(x => tags.includes(x))) return false;
    }
    if (typeof filter.since === "number" && ev.created_at < filter.since) return false;
    return true;
  }
  return {
    async publish(body) {
      const ev = { id: "mock-" + (++seq), pubkey: "mockpub", kind: body.kind,
        created_at: body.created_at, tags: body.tags, content: body.content, sig: "mocksig" };
      stored.push(ev);
      setTimeout(() => { for (const s of subs) if (matches(s.filter, ev)) { try { s.cb(ev); } catch (_e) {} } }, 0);
      return ev;
    },
    subscribe(filter, cb) {
      const s = { filter, cb };
      subs.push(s);
      setTimeout(() => { for (const ev of stored) if (matches(filter, ev)) { try { cb(ev); } catch (_e) {} } }, 0);
      return () => { const i = subs.indexOf(s); if (i !== -1) subs.splice(i, 1); };
    },
  };
}

// ---- Modul-23-Instanz je „Browser" ----
function makeNode(name) {
  const ctx = { console: { info() {}, warn() {}, error() {} }, setTimeout, clearTimeout, Date, Math, JSON, Promise };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(moduleCode, ctx, { filename: name + "/23_rendezvous.js" });
  return ctx.SbkimRendezvous;
}
function mockSpore(id) { return { async getOwnSpore() { return id ? { id, domainVector: null } : null; } }; }

const relay = makeMockRelay();

// Probe 1 — Setup
t("1a: echter SAGE_SUCHKORPUS geladen (>= 20 Einträge)", Array.isArray(SAGE) && SAGE.length >= 20, "len=" + (SAGE && SAGE.length));
{
  const probe = makeNode("probe");
  t("1b: Surface enableAnswering/askNode", typeof probe.enableAnswering === "function" && typeof probe.askNode === "function");
  t("1c: _meta hat neue Härtungs-Felder", probe._meta.hasPrepareCorpus === false && probe._meta.answerCorpusEnsured === false);
}

// Antworter B: echter Match-Mock + echter SAGE-Korpus-Provider
const bMatch = makeMatchMock();
const B = makeNode("B");
await B.init({ nodeName: "Knoten B", relayClient: relay, spore: mockSpore("node-B"),
  match: bMatch, prepareCorpus: buildSageCorpus });

// Probe 2 — DIE FALLE: vor enableAnswering ist kein Korpus gekoppelt
t("2a: hasPrepareCorpus true nach init", B._meta.hasPrepareCorpus === true);
t("2b: answerCorpusEnsured false vor AN", B._meta.answerCorpusEnsured === false);
{
  const leer = await bMatch.queryLocal("lokale suche cosinus treffer", 5);
  t("2c: queryLocal LEER solange kein Korpus gekoppelt (die Falle)", Array.isArray(leer) && leer.length === 0);
}

// Probe 3 — init allein koppelt NICHT
t("3: init hat den Korpus NICHT registriert (Empfangsmodus)", bMatch._corpusLen() === 0);

// Probe 4 — enableAnswering koppelt aktiv
{
  const r = await B.enableAnswering();
  t("4a: enableAnswering ok", r.ok === true, r.reason);
  t("4b: answerCorpusEnsured true", B._meta.answerCorpusEnsured === true);
  t("4c: Korpus jetzt in Modul 04 registriert (alle SAGE-Einträge)", bMatch._corpusLen() === SAGE.length);
  const hits = await bMatch.queryLocal("bedeutungen vergleichen lokale suche", 5);
  t("4d: queryLocal liefert jetzt ECHTE SAGE-Treffer", Array.isArray(hits) && hits.length >= 1, "n=" + hits.length);
  t("4e: Treffer sind echte SAGE-Labels + anchorId",
    hits.every(h => SAGE.some(s => s.label === h.label && s.anchorId === h.anchorId)));
}

// Probe 5 — End-to-end A→B über das Relais (ohne je zu „widget-suchen")
{
  const A = makeNode("A");
  await A.init({ nodeName: "Knoten A", relayClient: relay, spore: mockSpore("node-A") });
  const r = await A.askNode({ nodeId: "node-B" }, "identität knoten schlüssel spore", { k: 3, timeoutMs: 2000 });
  t("5a: askNode ok:true", r.ok === true, r.reason);
  t("5b: echte SAGE-Treffer aus dem Antwort-Zettel", Array.isArray(r.results) && r.results.length >= 1, JSON.stringify(r.results));
  t("5c: label + anchorId echte SAGE-Einträge",
    r.results.length >= 1 && r.results.every(h => SAGE.some(s => s.label === h.label && s.anchorId === h.anchorId)));
  t("5d: k-Cap eingehalten", r.results.length <= 3);
}

// Probe 6 — Fail-soft: prepareCorpus wirft → kein Bruch, ehrlich leer
{
  const badMatch = makeMatchMock();
  const F = makeNode("F");
  await F.init({ nodeName: "Knoten F", relayClient: relay, spore: mockSpore("node-F"),
    match: badMatch, prepareCorpus: async function () { throw new Error("Modul 03 nicht geladen"); } });
  const r = await F.enableAnswering();
  t("6a: enableAnswering trotz Provider-Fehler ok (fail-soft)", r.ok === true, r.reason);
  t("6b: answerCorpusEnsured false (nicht gekoppelt)", F._meta.answerCorpusEnsured === false);
  t("6c: kein Korpus registriert", badMatch._corpusLen() === 0);
}

// Probe 7 — Fail-soft: match ohne setLocalCorpus → kein Registrier-Pfad, kein Throw
{
  const noSet = makeMatchMock({ noSetLocalCorpus: true });
  const G = makeNode("G");
  await G.init({ nodeName: "Knoten G", relayClient: relay, spore: mockSpore("node-G"),
    match: noSet, prepareCorpus: buildSageCorpus });
  const r = await G.enableAnswering();
  t("7a: enableAnswering ok ohne setLocalCorpus (fail-soft)", r.ok === true, r.reason);
  t("7b: answerCorpusEnsured false", G._meta.answerCorpusEnsured === false);
}

// Probe 8 — Opt-in: ohne prepareCorpus wird der Korpus NICHT angefasst
{
  const wMatch = makeMatchMock();
  const W = makeNode("W");
  await W.init({ nodeName: "Knoten W", relayClient: relay, spore: mockSpore("node-W"), match: wMatch });
  const r = await W.enableAnswering();
  t("8a: enableAnswering ok ohne prepareCorpus", r.ok === true, r.reason);
  t("8b: hasPrepareCorpus false", W._meta.hasPrepareCorpus === false);
  t("8c: answerCorpusEnsured false + Korpus unangetastet", W._meta.answerCorpusEnsured === false && wMatch._corpusLen() === 0);
}

console.log("\nTotal: " + (ok + fail) + " Proben, " + ok + " grün, " + fail + " rot.");
process.exit(fail ? 1 : 0);
