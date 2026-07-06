// Smoke-Test Bau 23.B — Cross-Knoten-Frage (bidirektionale Bedeutungs-Suche).
//
// Beweist HEADLESS die Modul-Logik von enableAnswering()/askNode(): zwei
// GETRENNTE Modul-23-Instanzen (eigene vm-Kontexte = zwei "Browser"), ein
// geteiltes In-Memory-Mock-Relais. Knoten B registriert eine Mock-Suche
// (queryLocal) + schaltet das Antwortrecht AN; Knoten A stellt die Frage.
// KEIN WebSocket, KEIN Netz, KEIN DOM — der Live-Beweis über das echte
// Relais bleibt Klaus' Browser-Lauf.
//
// Proben:
//   1) Beide Instanzen geladen, getrennte Kontexte, Surface vorhanden.
//   2) enableAnswering ohne Identität → ok:false + reason.
//   3) enableAnswering mit Identität → ok:true, _meta.answering true.
//   4) askNode (A→B) → ok:true, results = Top-k von Bs queryLocal,
//      fromNodeId = B, Reihenfolge erhalten, anchorId durchgereicht.
//   5) Frage an FREMDE nodeId → B antwortet NICHT (Timeout bei A).
//   6) Dedupe: dieselbe qid zweimal → nur EINE Antwort (answeredCount 1x).
//   7) Rate-Limit 6/min: 8 Fragen → höchstens 6 Antworten.
//   8) k-Cap: Frage mit k=99 → höchstens 5 Ergebnisse.
//   9) text-Kappung: 1000-Zeichen-Frage → queryLocal sieht ≤ 300 Zeichen.
//  10) Ohne Modul 04 bei B → Antwort kommt, results:[] (ehrlich leer).
//  11) disableAnswering() → _meta.answering false, keine Antwort mehr.
//  12) askNode ohne Ziel/leerer Text → ok:false, kein Throw.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const moduleCode = readFileSync(join(here, "../src/modules/23_rendezvous.js"), "utf8");

let ok = 0, fail = 0;
function t(name, cond, extra) {
  if (cond) { ok++; console.log("✓ " + name); }
  else { fail++; console.log("✗ FAIL: " + name + (extra ? " — " + extra : "")); }
}

// ---- In-Memory-Mock-Relais (geteilt zwischen beiden Kontexten) ----
function makeMockRelay() {
  const subs = [];
  const stored = [];
  let seq = 0;
  return {
    async publish(body) {
      const ev = {
        id: "mock-" + (++seq), pubkey: "mockpub",
        kind: body.kind, created_at: body.created_at, tags: body.tags,
        content: body.content, sig: "mocksig",
      };
      stored.push(ev);
      // asynchron zustellen (wie ein echtes Relais)
      setTimeout(() => {
        for (const s of subs) {
          if (matches(s.filter, ev)) { try { s.cb(ev); } catch (_e) {} }
        }
      }, 0);
      return ev;
    },
    subscribe(filter, cb) {
      const s = { filter, cb };
      subs.push(s);
      // gespeicherte Events nachliefern (since-Filter)
      setTimeout(() => {
        for (const ev of stored) {
          if (matches(filter, ev)) { try { cb(ev); } catch (_e) {} }
        }
      }, 0);
      return () => { const i = subs.indexOf(s); if (i !== -1) subs.splice(i, 1); };
    },
  };
  function matches(filter, ev) {
    if (filter.kinds && !filter.kinds.includes(ev.kind)) return false;
    if (filter["#t"]) {
      const tags = (ev.tags || []).filter(t => t[0] === "t").map(t => t[1]);
      if (!filter["#t"].some(x => tags.includes(x))) return false;
    }
    if (typeof filter.since === "number" && ev.created_at < filter.since) return false;
    return true;
  }
}

// ---- Zwei getrennte Modul-Instanzen ("zwei Browser") ----
function makeNode(name) {
  const ctx = { console: { info() {}, warn() {}, error() {} }, setTimeout, clearTimeout, Date, Math, JSON, Promise };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(moduleCode, ctx, { filename: name + "/23_rendezvous.js" });
  return ctx.SbkimRendezvous;
}

function mockSpore(id) {
  return { async getOwnSpore() { return id ? { id, domainVector: null } : null; } };
}

const relay = makeMockRelay();
const A = makeNode("A");
const B = makeNode("B");

// Probe 1 — getrennte Instanzen + Surface
t("1a: zwei getrennte Instanzen", A !== B);
t("1b: Surface enableAnswering/disableAnswering/askNode",
  typeof A.enableAnswering === "function" && typeof A.disableAnswering === "function" && typeof A.askNode === "function");
t("1c: _meta.answering default false + queryTag", A._meta.answering === false && A._meta.queryTag === "sbkim-qry");

// Konfig
const B_HITS = [
  { label: "Eierschecke", score: 0.91, anchorId: "r7" },
  { label: "Stollen", score: 0.88, anchorId: "r9" },
  { label: "Marmorkuchen", score: 0.85 },
];
let bQueryCalls = [];
const bMatch = {
  relatedness() { return 0; },
  async queryLocal(text, k) { bQueryCalls.push({ text, k }); return B_HITS.slice(0, k); },
};
await A.init({ nodeName: "Knoten A", relayClient: relay, spore: mockSpore("node-A") });
await B.init({ nodeName: "Knoten B", relayClient: relay, spore: mockSpore("node-B"), match: bMatch });

// Probe 2 — ohne Identität
{
  const C = makeNode("C");
  await C.init({ nodeName: "C", relayClient: relay, spore: mockSpore(null) });
  const r = await C.enableAnswering();
  t("2: enableAnswering ohne Identität → ok:false + reason", r.ok === false && typeof r.reason === "string");
}

// Probe 3 — Antwortrecht AN
{
  const r = await B.enableAnswering();
  t("3a: enableAnswering ok", r.ok === true);
  t("3b: _meta.answering true", B._meta.answering === true);
  const r2 = await B.enableAnswering();
  t("3c: idempotent", r2.ok === true);
}

// Probe 4 — die eigentliche bidirektionale Frage A→B
{
  const r = await A.askNode({ nodeId: "node-B" }, "kuchen", { timeoutMs: 2000 });
  t("4a: ok:true", r.ok === true, r.reason);
  t("4b: fromNodeId = node-B", r.fromNodeId === "node-B");
  t("4c: 3 Ergebnisse, Reihenfolge erhalten",
    Array.isArray(r.results) && r.results.length === 3 && r.results[0].label === "Eierschecke" && r.results[2].label === "Marmorkuchen");
  t("4d: score + anchorId durchgereicht", r.results[0].score === 0.91 && r.results[0].anchorId === "r7" && r.results[2].anchorId === undefined);
  t("4e: tookMs vorhanden", typeof r.tookMs === "number" && r.tookMs >= 0);
  t("4f: Bs queryLocal sah die Frage", bQueryCalls.length === 1 && bQueryCalls[0].text === "kuchen");
}

// Probe 5 — Frage an fremde nodeId → keine Antwort (kurzer Timeout)
{
  const before = bQueryCalls.length;
  const r = await A.askNode({ nodeId: "node-X" }, "kuchen", { timeoutMs: 400 });
  t("5a: Timeout ok:false + reason", r.ok === false && /Antwort/.test(r.reason));
  t("5b: B hat NICHT gesucht (toNodeId-Filter)", bQueryCalls.length === before);
}

// Probe 6 — Dedupe derselben qid (von Hand publiziert)
{
  const cntBefore = B._meta.answeredCount;
  const q = { kind: "sbkim-query", qid: "dupe-1", toNodeId: "node-B", fromNodeId: "node-A", fromName: "A", text: "torte", k: 2, ts: Math.floor(Date.now() / 1000) };
  await relay.publish({ kind: 1, created_at: Math.floor(Date.now() / 1000), tags: [["t", "sbkim-qry"]], content: JSON.stringify(q) });
  await relay.publish({ kind: 1, created_at: Math.floor(Date.now() / 1000), tags: [["t", "sbkim-qry"]], content: JSON.stringify(q) });
  await new Promise(res => setTimeout(res, 150));
  t("6: Dedupe — dieselbe qid nur EINMAL beantwortet", B._meta.answeredCount === cntBefore + 1, "answeredCount=" + B._meta.answeredCount);
}

// Probe 7 — Rate-Limit 6/min (wir haben schon einige Antworten verbraucht)
{
  const cntBefore = B._meta.answeredCount;
  for (let i = 0; i < 8; i++) {
    const q = { kind: "sbkim-query", qid: "flood-" + i, toNodeId: "node-B", fromNodeId: "node-A", fromName: "A", text: "flut", k: 1, ts: Math.floor(Date.now() / 1000) };
    await relay.publish({ kind: 1, created_at: Math.floor(Date.now() / 1000), tags: [["t", "sbkim-qry"]], content: JSON.stringify(q) });
  }
  await new Promise(res => setTimeout(res, 250));
  const answered = B._meta.answeredCount - cntBefore;
  t("7: Rate-Limit — von 8 Flut-Fragen höchstens " + B._meta.queryMaxPerMin + " beantwortet (gesamt/min)",
    answered <= B._meta.queryMaxPerMin, "beantwortet=" + answered);
}

// Frische Antworter-Instanz für die restlichen Proben (Rate-Limit-frei)
const B2 = makeNode("B2");
let b2Calls = [];
await B2.init({
  nodeName: "Knoten B2", relayClient: relay, spore: mockSpore("node-B2"),
  match: { relatedness() { return 0; }, async queryLocal(text, k) { b2Calls.push({ text, k }); return B_HITS.slice(0, k); } },
});
await B2.enableAnswering();

// Probe 8 — k-Cap
{
  const r = await A.askNode("node-B2", "kuchen", { k: 99, timeoutMs: 2000 });
  t("8: k=99 → höchstens 5 Ergebnisse + queryLocal sah k≤5",
    r.ok === true && r.results.length <= 5 && b2Calls[b2Calls.length - 1].k <= 5, JSON.stringify(r.reason));
}

// Probe 9 — Text-Kappung (1000 Zeichen → ≤300 beim Antworter)
{
  const long = "x".repeat(1000);
  const r = await A.askNode("node-B2", long, { timeoutMs: 2000 });
  const seen = b2Calls[b2Calls.length - 1].text;
  t("9: 1000-Zeichen-Frage → Antworter sieht ≤300", r.ok === true && seen.length <= 300, "len=" + seen.length);
}

// Probe 10 — Antworter OHNE Modul 04 → results:[] (ehrlich leer)
{
  const D = makeNode("D");
  await D.init({ nodeName: "Knoten D", relayClient: relay, spore: mockSpore("node-D") }); // kein match
  await D.enableAnswering();
  const r = await A.askNode("node-D", "kuchen", { timeoutMs: 2000 });
  t("10: ohne Modul 04 → ok:true + results:[]", r.ok === true && Array.isArray(r.results) && r.results.length === 0, r.reason);
}

// Probe 11 — disableAnswering
{
  B2.disableAnswering();
  t("11a: _meta.answering false", B2._meta.answering === false);
  const r = await A.askNode("node-B2", "kuchen", { timeoutMs: 400 });
  t("11b: nach disable keine Antwort (Timeout)", r.ok === false);
}

// Probe 12 — Eingabe-Validierung ohne Throw
{
  const r1 = await A.askNode(null, "kuchen", { timeoutMs: 200 });
  const r2 = await A.askNode("node-B2", "   ", { timeoutMs: 200 });
  t("12: kein Ziel / leerer Text → ok:false, kein Throw", r1.ok === false && r2.ok === false);
}

console.log("\nTotal: " + (ok + fail) + " Proben, " + ok + " grün, " + fail + " rot.");
process.exit(fail ? 1 : 0);
