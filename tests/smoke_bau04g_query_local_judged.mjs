// Headless smoke test für Bau 04.G — queryLocalJudged (Strang A2).
// Run: `node tests/smoke_bau04g_query_local_judged.mjs`.
// Komponiert Vorfilter (queryLocal, SbkimEmbedding gemockt) + Richter
// (hybridMatch, window.fetch gemockt). KEIN Modell-Lade, KEIN Netz.
//
// Proben:
//   1. Export-Anker: queryLocalJudged exportiert + _meta-Note + Selbstcheck.
//   2. Opt-in AUS (kein apiKey) → judged:false, candidates == reiner Vorfilter,
//      judgment:null, KEIN fetch-Call.
//   3. Leerer Vorfilter (alle unter Boden) → judged:false, [], KEIN fetch-Call.
//   4. Richter Happy-Path: verdicts sortieren um (passt zuerst, dann Score);
//      judged:true, candidates tragen passt/judgeScore/begruendung; attestation da.
//   5. Fail-soft (Netz-Fehler) → judged:false, Vorfilter-Reihenfolge gilt,
//      judgment.available===false + reason.
//   6. Richter-Text kommt aus corpus.text (Prompt enthält den Passage-Text).
//   7. Hybrid durchgereicht: options.hybrid nimmt Unter-Boden-Lexik-Treffer auf,
//      danach urteilt der Richter darüber.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;
const src = readFileSync(resolve(repoRoot, "src/modules/04_match.js"), "utf8");
new Function("global", "window", "globalThis", "console", src)(
  globalThis, globalThis, globalThis, console,
);
const M = globalThis.SbkimMatch;
const EMBEDDING_DIM = 384;

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra !== undefined ? "  →  " + extra : "")); }
}

// ---- Vektoren (bekannter Cosinus zum Query-Vektor) ----
function makeNormalizedVector(seed) {
  let state = seed >>> 0;
  const next = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return (state / 0xFFFFFFFF) * 2 - 1; };
  const v = new Float32Array(EMBEDDING_DIM); let s = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) { v[i] = next(); s += v[i] * v[i]; }
  const n = Math.sqrt(s); for (let i = 0; i < EMBEDDING_DIM; i++) v[i] /= n; return v;
}
function mixedVec(ref, target, seed) {
  const noise = makeNormalizedVector(seed);
  const a = target, b = Math.sqrt(Math.max(0, 1 - target * target));
  const out = new Float32Array(EMBEDDING_DIM); let s = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) { out[i] = a * ref[i] + b * noise[i]; s += out[i] * out[i]; }
  const n = Math.sqrt(s); for (let i = 0; i < EMBEDDING_DIM; i++) out[i] /= n; return out;
}
const Q = makeNormalizedVector(7);
globalThis.SbkimEmbedding = { embedQuery: async () => Q };

// ---- fetch-Mock (Anthropic-Form) ----
let stubBehavior = "ok";
let stubVerdicts = null;
let fetchCalls = 0;
let lastBody = null;
globalThis.fetch = async (url, init) => {
  fetchCalls++;
  lastBody = init && init.body ? String(init.body) : "";
  if (stubBehavior === "network-error") throw new Error("getaddrinfo ENOTFOUND (Mock)");
  const text = JSON.stringify({ verdicts: stubVerdicts });
  return {
    ok: true, status: 200, statusText: "",
    json: async () => ({ content: [{ type: "text", text }], usage: { input_tokens: 100, output_tokens: 30 } }),
  };
};
function resetFetch() { stubBehavior = "ok"; stubVerdicts = null; fetchCalls = 0; lastBody = null; }

// Korpus: drei Items über dem 0.80-Boden (Vorfilter-Reihenfolge = Cosinus desc: X,Y,Z).
function corpus3() {
  return [
    { label: "X", anchorId: "x", text: "wein tannin speisebegleitung", passageVec: mixedVec(Q, 0.95, 101) },
    { label: "Y", anchorId: "y", text: "kaese reifung aromen hauptgang", passageVec: mixedVec(Q, 0.88, 102) },
    { label: "Z", anchorId: "z", text: "auspuff schweissen endrohr", passageVec: mixedVec(Q, 0.82, 103) },
  ];
}

// ---- Probe 1 ----
console.log("Probe 1: Export-Anker");
ok("queryLocalJudged exportiert", typeof M.queryLocalJudged === "function");
ok("_meta.queryLocalJudgedNote da", typeof M._meta.queryLocalJudgedNote === "string" && M._meta.queryLocalJudgedNote.length > 0);

// ---- Probe 2: Opt-in AUS ----
console.log("Probe 2: Opt-in AUS (kein apiKey)");
{
  resetFetch();
  const r = await M.queryLocalJudged("suche", 5, { corpus: corpus3() });
  ok("judged:false", r.judged === false);
  ok("judgment:null", r.judgment === null);
  ok("candidates = reiner Vorfilter (X,Y,Z)", JSON.stringify(r.candidates.map((c) => c.label)) === JSON.stringify(["X", "Y", "Z"]), JSON.stringify(r.candidates.map((c) => c.label)));
  ok("KEIN fetch-Call", fetchCalls === 0, String(fetchCalls));
  ok("Vorfilter-Treffer ohne Urteil-Felder", r.candidates[0].passt === undefined);
}

// ---- Probe 3: leerer Vorfilter ----
console.log("Probe 3: leerer Vorfilter (alle unter Boden)");
{
  resetFetch();
  const lowCorpus = [
    { label: "A", anchorId: "a", text: "x", passageVec: mixedVec(Q, 0.40, 201) },
    { label: "B", anchorId: "b", text: "y", passageVec: mixedVec(Q, 0.60, 202) },
  ];
  const r = await M.queryLocalJudged("suche", 5, { corpus: lowCorpus, apiKey: "sk-test" });
  ok("judged:false", r.judged === false);
  ok("candidates leer", Array.isArray(r.candidates) && r.candidates.length === 0);
  ok("KEIN fetch-Call (nichts zu beurteilen)", fetchCalls === 0, String(fetchCalls));
}

// ---- Probe 4: Richter Happy-Path (Umsortierung) ----
console.log("Probe 4: Richter Happy-Path (verdicts sortieren um)");
{
  resetFetch();
  // Vorfilter-Reihenfolge X(0.95),Y(0.88),Z(0.82). Richter: X passt NICHT,
  // Y passt (0.9), Z passt (0.7) → Ergebnis Y, Z, X.
  stubVerdicts = [
    { passt: false, score: 0.10, begruendung: "thematisch fremd" },
    { passt: true, score: 0.90, begruendung: "starke Passung" },
    { passt: true, score: 0.70, begruendung: "teilweise Passung" },
  ];
  const r = await M.queryLocalJudged("suche", 5, { corpus: corpus3(), apiKey: "sk-test" });
  ok("judged:true", r.judged === true);
  ok("fetch genau 1×", fetchCalls === 1, String(fetchCalls));
  ok("umsortiert zu Y,Z,X", JSON.stringify(r.candidates.map((c) => c.label)) === JSON.stringify(["Y", "Z", "X"]), JSON.stringify(r.candidates.map((c) => c.label)));
  ok("Top trägt passt:true + judgeScore 0.9", r.candidates[0].passt === true && r.candidates[0].judgeScore === 0.9);
  ok("Top trägt begruendung", r.candidates[0].begruendung === "starke Passung");
  ok("X (passt:false) zuletzt", r.candidates[2].label === "X" && r.candidates[2].passt === false);
  ok("score bleibt der Cosinus (Y ~0.88)", r.candidates[0].score > 0.85 && r.candidates[0].score < 0.91, String(r.candidates[0].score));
  ok("judgment.available:true", r.judgment && r.judgment.available === true);
  ok("attestation vorhanden (bezeugbar)", r.judgment.attestation && r.judgment.attestation.kind === "sbkim-hybrid-match-judgment");
}

// ---- Probe 5: Fail-soft ----
console.log("Probe 5: Fail-soft (Netz-Fehler → Vorfilter gilt)");
{
  resetFetch();
  stubBehavior = "network-error";
  const r = await M.queryLocalJudged("suche", 5, { corpus: corpus3(), apiKey: "sk-test" });
  ok("judged:false", r.judged === false);
  ok("Vorfilter-Reihenfolge X,Y,Z bleibt", JSON.stringify(r.candidates.map((c) => c.label)) === JSON.stringify(["X", "Y", "Z"]), JSON.stringify(r.candidates.map((c) => c.label)));
  ok("judgment.available:false + reason", r.judgment && r.judgment.available === false && typeof r.judgment.reason === "string");
}

// ---- Probe 6: Richter-Text kommt aus corpus.text ----
console.log("Probe 6: Passage-Text erreicht den Richter");
{
  resetFetch();
  stubVerdicts = [
    { passt: true, score: 0.8, begruendung: "ok" },
    { passt: true, score: 0.7, begruendung: "ok" },
    { passt: true, score: 0.6, begruendung: "ok" },
  ];
  await M.queryLocalJudged("suche", 5, { corpus: corpus3(), apiKey: "sk-test" });
  ok("Prompt enthält corpus.text 'wein tannin'", lastBody.indexOf("wein tannin speisebegleitung") !== -1);
  ok("Prompt enthält corpus.text 'kaese reifung'", lastBody.indexOf("kaese reifung aromen hauptgang") !== -1);
}

// ---- Probe 7: Hybrid (A1) durchgereicht + danach Richter (A2) ----
console.log("Probe 7: options.hybrid nimmt Unter-Boden-Lexik-Treffer, dann Richter");
{
  resetFetch();
  const corpus = [
    { label: "B", anchorId: "b", text: "unrelated kitchen recipe", passageVec: mixedVec(Q, 0.86, 301) },
    { label: "A", anchorId: "a", text: "wespen hausmittel garten", passageVec: mixedVec(Q, 0.70, 302) },
  ];
  // Ohne hybrid: nur B (A unter Boden). Mit hybrid: A + B (A via Wort-Treffer).
  // Vorfilter-Hybrid-Reihenfolge (fused): A oben (Lexik+RRF), B danach.
  stubVerdicts = [
    { passt: true, score: 0.95, begruendung: "genau das" },   // Kandidat 1
    { passt: false, score: 0.1, begruendung: "fremd" },        // Kandidat 2
  ];
  const r = await M.queryLocalJudged("wespen hausmittel", 5, { corpus: corpus, hybrid: true, apiKey: "sk-test" });
  ok("judged:true", r.judged === true);
  ok("A (unter Boden) ist dabei (Hybrid durchgereicht)", r.candidates.some((c) => c.label === "A"), JSON.stringify(r.candidates.map((c) => c.label)));
  ok("A trägt bm25-Feld (aus Hybrid-Vorfilter)", r.candidates.some((c) => c.label === "A" && typeof c.bm25 === "number"));
  ok("Richter-Top passt:true", r.candidates[0].passt === true);
}

// ---- Probe 8: async Korpus-Provider (setLocalCorpus) — Regressions-Probe ----
// Spiegelt smoke_bau04c Probe 8c: der Endknoten-Provider ist async (baut den
// Korpus faul via Modul 03, Embeddings). queryLocalJudged MUSS ihn awaiten —
// sonst landet ein Promise in queryLocal → "Korpus muss ein Array sein, war:
// Promise" und der Cross-Knoten-Antwort-Pfad (Modul 15 op:query) fällt auf eine
// leere Fehler-Antwort zurück, obwohl der Richter opt-in ist. Der Fix wurde aus
// PR #533 (der queryLocal fixte) für Bau 04.G nachgezogen. Ohne options.corpus →
// der registrierte Provider ist die Korpus-Quelle.
console.log("Probe 8: async Korpus-Provider (setLocalCorpus, ohne options.corpus)");
{
  resetFetch();
  M.setLocalCorpus(async () => corpus3());   // async: gibt Promise<Array> zurück
  // 8a: Opt-in AUS → reiner Vorfilter über den Provider-Korpus, KEIN Throw.
  let threw = false, r1 = null;
  try { r1 = await M.queryLocalJudged("suche", 5, {}); } catch (e) { threw = true; }
  ok("8a async-Provider ohne Richter wirft NICHT", threw === false);
  ok("8a candidates aus Provider-Korpus (X,Y,Z)", !!r1 && JSON.stringify(r1.candidates.map((c) => c.label)) === JSON.stringify(["X", "Y", "Z"]), r1 && JSON.stringify(r1.candidates.map((c) => c.label)));
  ok("8a judged:false (kein apiKey)", !!r1 && r1.judged === false);
  ok("8a KEIN fetch-Call", fetchCalls === 0, String(fetchCalls));
  // 8b: Richter an → urteilt über den async-Provider-Korpus (Texte erreichen ihn).
  resetFetch();
  stubVerdicts = [
    { passt: false, score: 0.10, begruendung: "fremd" },
    { passt: true, score: 0.90, begruendung: "passt" },
    { passt: true, score: 0.70, begruendung: "passt" },
  ];
  let threw2 = false, r2 = null;
  try { r2 = await M.queryLocalJudged("suche", 5, { apiKey: "sk-test" }); } catch (e) { threw2 = true; }
  ok("8b async-Provider mit Richter wirft NICHT", threw2 === false);
  ok("8b judged:true über Provider-Korpus", !!r2 && r2.judged === true);
  ok("8b umsortiert zu Y,Z,X", !!r2 && JSON.stringify(r2.candidates.map((c) => c.label)) === JSON.stringify(["Y", "Z", "X"]), r2 && JSON.stringify(r2.candidates.map((c) => c.label)));
  ok("8b Passage-Text erreichte den Richter", lastBody.indexOf("kaese reifung aromen hauptgang") !== -1);
  M.setLocalCorpus(null);   // Provider zurücksetzen (Test-Hygiene)
}

console.log("\nTotal: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
process.exit(fail === 0 ? 0 : 1);
