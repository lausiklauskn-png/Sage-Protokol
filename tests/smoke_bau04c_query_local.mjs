// Headless smoke test für Bau 04.C queryLocal (lokales Such-Feld-Backend).
// Run mit `node tests/smoke_bau04c_query_local.mjs`. KEIN fake-indexeddb
// nötig — queryLocal ist async (wegen Modul-03-Lazy), aber der Test
// mockt SbkimEmbedding mit einer deterministischen Funktion. Kein
// echtes Embedding-Modell wird geladen.
//
// Proben:
//   1. Setup-Anker: setLocalCorpus / queryLocal exportiert, Selbstcheck-Hinweis.
//   2. Happy-Path mit Mini-Korpus (3 Items, deterministische LCG-Vektoren).
//   3. Schwelle: ein Item knapp über, eines knapp unter PROVIDER_MIN_MATCH.
//   4. Top-k-Cut: 5 Items, k=2 → genau 2 Treffer (höchste Scores zuerst).
//   5. Default k=5: 7 Items mit Score >= 0.80 → 5 Treffer.
//   6. Leerer Korpus → leere Liste, KEIN Throw.
//   7. Provider-Pfad: setLocalCorpus(fn) + queryLocal ohne options.corpus.
//   8. Provider-Vorrang: options.corpus überschreibt registrierten Provider.
//   9. Sync-Throws: EmptyQueryError, QueryTooLongError, InvalidKError,
//      EmbeddingNotAvailableError, InvalidCorpusError.
//  10. Embedding-Fail: embedQuery wirft → EmbeddingFailedError (async).
//  11. setLocalCorpus(null) entfernt Provider.

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

function makeNormalizedVector(seed) {
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return (state / 0xFFFFFFFF) * 2 - 1;
  };
  const v = new Float32Array(EMBEDDING_DIM);
  let sumSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    v[i] = next();
    sumSq += v[i] * v[i];
  }
  const norm = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) v[i] = v[i] / norm;
  return v;
}

// Erzeugt einen Vektor, der zum Referenz-Vektor mit Ziel-Cosinus ~target
// liegt. Mischt referenz-Vektor + orthogonaler Rauschvektor und normalisiert.
function mixedVec(reference, target, noiseSeed) {
  const noise = makeNormalizedVector(noiseSeed);
  // Score nach Mischung sollte ~ target sein. weighted sum:
  // result = a*ref + b*noise. cos(result, ref) ≈ a / |result|. Wir
  // wählen a = target, b = sqrt(1 - target^2) und normalisieren.
  const a = target;
  const b = Math.sqrt(Math.max(0, 1 - target * target));
  const out = new Float32Array(EMBEDDING_DIM);
  let sumSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    out[i] = a * reference[i] + b * noise[i];
    sumSq += out[i] * out[i];
  }
  const n = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) out[i] = out[i] / n;
  return out;
}

const queryVec = makeNormalizedVector(42);

// Mock SbkimEmbedding mit deterministischer Antwort. Default-Pfad:
// jede embedQuery liefert denselben queryVec (deterministischer Test).
function setMockEmbedding(behavior) {
  if (behavior === "missing") {
    delete globalThis.SbkimEmbedding;
    return;
  }
  globalThis.SbkimEmbedding = {
    embedQuery: async (text) => {
      if (behavior === "throw") {
        throw new Error("embedQuery-Mock-Fehler");
      }
      if (behavior === "bad-shape") {
        return new Float32Array(128);  // falsche Länge
      }
      return queryVec;
    },
  };
}

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

// ---- Probe 1: Setup-Anker ----
record("Probe 1: queryLocal exportiert", "function",
       typeof M.queryLocal, typeof M.queryLocal === "function");
record("Probe 1: setLocalCorpus exportiert", "function",
       typeof M.setLocalCorpus, typeof M.setLocalCorpus === "function");
record("Probe 1: EmptyQueryError exportiert", "function",
       typeof M.EmptyQueryError, typeof M.EmptyQueryError === "function");
record("Probe 1: QueryTooLongError exportiert", "function",
       typeof M.QueryTooLongError, typeof M.QueryTooLongError === "function");
record("Probe 1: InvalidKError exportiert", "function",
       typeof M.InvalidKError, typeof M.InvalidKError === "function");
record("Probe 1: EmbeddingNotAvailableError exportiert", "function",
       typeof M.EmbeddingNotAvailableError, typeof M.EmbeddingNotAvailableError === "function");
record("Probe 1: InvalidCorpusError exportiert", "function",
       typeof M.InvalidCorpusError, typeof M.InvalidCorpusError === "function");
record("Probe 1: _meta.queryLocalDefaultK", "5",
       String(M._meta.queryLocalDefaultK), M._meta.queryLocalDefaultK === 5);
record("Probe 1: _meta.queryLocalMaxTextLen", "4096",
       String(M._meta.queryLocalMaxTextLen), M._meta.queryLocalMaxTextLen === 4096);
record("Probe 1: _meta.localCorpusRegistered (initial)", "false",
       String(M._meta.localCorpusRegistered), M._meta.localCorpusRegistered === false);

// Test-Runner: alle async-Proben sequentiell, damit Reihenfolge stabil bleibt.
async function runAsyncProbes() {
  // ---- Probe 2: Happy-Path Mini-Korpus ----
  setMockEmbedding("ok");
  const corpus3 = [
    { label: "Top-Treffer",     anchorId: "a1", passageVec: mixedVec(queryVec, 0.95, 11) },
    { label: "Mittel-Treffer",  anchorId: "a2", passageVec: mixedVec(queryVec, 0.85, 12) },
    { label: "Unter-Schwelle",  anchorId: "a3", passageVec: mixedVec(queryVec, 0.50, 13) },
  ];
  const out2 = await M.queryLocal("Test", 5, { corpus: corpus3 });
  record("Probe 2: Happy-Path Trefferzahl", "2", String(out2.length), out2.length === 2);
  record("Probe 2: Top-Treffer zuerst", "Top-Treffer",
         out2[0]?.label, out2[0]?.label === "Top-Treffer");
  record("Probe 2: zweiter Treffer Mittel", "Mittel-Treffer",
         out2[1]?.label, out2[1]?.label === "Mittel-Treffer");
  record("Probe 2: anchorId durchgereicht", "a1", out2[0]?.anchorId,
         out2[0]?.anchorId === "a1");
  record("Probe 2: alle Scores >= 0.80", "true",
         String(out2.every(r => r.score >= 0.80)),
         out2.every(r => r.score >= 0.80));
  record("Probe 2: descending sort", "true",
         String(out2[0].score >= out2[1].score),
         out2[0].score >= out2[1].score);

  // ---- Probe 3: alle unter Schwelle ----
  const lowCorpus = [
    { label: "Niedrig 1", anchorId: "x1", passageVec: mixedVec(queryVec, 0.30, 21) },
    { label: "Niedrig 2", anchorId: "x2", passageVec: mixedVec(queryVec, 0.50, 22) },
    { label: "Niedrig 3", anchorId: "x3", passageVec: mixedVec(queryVec, 0.78, 23) },  // knapp drunter
  ];
  const out3 = await M.queryLocal("Test", 5, { corpus: lowCorpus });
  record("Probe 3: alle unter 0.80 → leere Liste", "0", String(out3.length), out3.length === 0);

  // ---- Probe 4: Top-k-Cut mit k=2 ----
  const corpus5 = [
    { label: "T1", anchorId: "t1", passageVec: mixedVec(queryVec, 0.95, 31) },
    { label: "T2", anchorId: "t2", passageVec: mixedVec(queryVec, 0.92, 32) },
    { label: "T3", anchorId: "t3", passageVec: mixedVec(queryVec, 0.88, 33) },
    { label: "T4", anchorId: "t4", passageVec: mixedVec(queryVec, 0.85, 34) },
    { label: "T5", anchorId: "t5", passageVec: mixedVec(queryVec, 0.82, 35) },
  ];
  const out4 = await M.queryLocal("Test", 2, { corpus: corpus5 });
  record("Probe 4: Top-k=2 exakt 2 Treffer", "2", String(out4.length), out4.length === 2);
  record("Probe 4: Top-2 sind T1+T2", "T1,T2",
         out4.map(r => r.label).join(","),
         out4[0].label === "T1" && out4[1].label === "T2");

  // ---- Probe 5: Default k=5 mit 7 Items über Schwelle ----
  const corpus7 = [];
  for (let i = 0; i < 7; i++) {
    corpus7.push({
      label: "C" + i,
      anchorId: null,
      passageVec: mixedVec(queryVec, 0.85 + i * 0.01, 50 + i),
    });
  }
  const out5 = await M.queryLocal("Test", undefined, { corpus: corpus7 });
  record("Probe 5: Default k=5", "5", String(out5.length), out5.length === 5);

  // ---- Probe 6: Leerer Korpus ----
  const out6 = await M.queryLocal("Test", 5, { corpus: [] });
  record("Probe 6: leerer Korpus → leere Liste", "0", String(out6.length), out6.length === 0);

  // ---- Probe 7: Provider-Pfad ----
  M.setLocalCorpus(corpus3);
  record("Probe 7: localCorpusRegistered nach setLocalCorpus", "true",
         String(M._meta.localCorpusRegistered), M._meta.localCorpusRegistered === true);
  const out7 = await M.queryLocal("Test", 5);   // KEIN options.corpus
  record("Probe 7: Provider liefert Korpus", "2", String(out7.length), out7.length === 2);
  record("Probe 7: Provider-Top-Treffer", "Top-Treffer",
         out7[0]?.label, out7[0]?.label === "Top-Treffer");

  // ---- Probe 8: options.corpus hat Vorrang ----
  // Provider liefert corpus3, options.corpus liefert lowCorpus → 0 Treffer.
  const out8 = await M.queryLocal("Test", 5, { corpus: lowCorpus });
  record("Probe 8: options.corpus überschreibt Provider", "0",
         String(out8.length), out8.length === 0);

  // ---- Probe 8b: Provider als Funktion ----
  M.setLocalCorpus(() => corpus3);
  const out8b = await M.queryLocal("Test", 5);
  record("Probe 8b: Provider-Funktion liefert Korpus", "2",
         String(out8b.length), out8b.length === 2);

  // ---- Probe 8c: ASYNC-Provider (Regression Live-Bug 2026-07-02) ----
  // Endknoten-Provider bauen den Korpus faul (async — Embeddings via Modul 03).
  // Vor dem await-Fix landete der Promise in validateCorpus → "Korpus muss ein
  // Array sein, war: Promise". queryLocal MUSS den Provider awaiten.
  M.setLocalCorpus(async () => corpus3);
  let err8c = null, out8c = null;
  try { out8c = await M.queryLocal("Test", 5); } catch (e) { err8c = e; }
  record("Probe 8c: async-Provider wirft NICHT (kein Promise-in-validateCorpus)",
         "kein Fehler", err8c ? err8c.name + ": " + err8c.message : "kein Fehler", err8c === null);
  record("Probe 8c: async-Provider liefert Korpus", "2",
         String(out8c ? out8c.length : "null"), !!out8c && out8c.length === 2);

  // ---- Probe 9: Sync-Throws ----
  // 9a EmptyQueryError
  let err9a = null;
  try { await M.queryLocal("", 5, { corpus: corpus3 }); } catch (e) { err9a = e; }
  record("Probe 9a: EmptyQueryError (leerer String)", "EmptyQueryError",
         err9a?.name, err9a?.name === "EmptyQueryError");

  // 9a' kein String
  let err9aa = null;
  try { await M.queryLocal(null, 5, { corpus: corpus3 }); } catch (e) { err9aa = e; }
  record("Probe 9a': EmptyQueryError (null)", "EmptyQueryError",
         err9aa?.name, err9aa?.name === "EmptyQueryError");

  // 9b QueryTooLongError
  let err9b = null;
  const longText = "x".repeat(5000);
  try { await M.queryLocal(longText, 5, { corpus: corpus3 }); } catch (e) { err9b = e; }
  record("Probe 9b: QueryTooLongError", "QueryTooLongError",
         err9b?.name, err9b?.name === "QueryTooLongError");

  // 9c InvalidKError (k=0)
  let err9c = null;
  try { await M.queryLocal("Test", 0, { corpus: corpus3 }); } catch (e) { err9c = e; }
  record("Probe 9c: InvalidKError (k=0)", "InvalidKError",
         err9c?.name, err9c?.name === "InvalidKError");

  // 9c' InvalidKError (k=-3)
  let err9cc = null;
  try { await M.queryLocal("Test", -3, { corpus: corpus3 }); } catch (e) { err9cc = e; }
  record("Probe 9c': InvalidKError (k=-3)", "InvalidKError",
         err9cc?.name, err9cc?.name === "InvalidKError");

  // 9c'' InvalidKError (k=1.5)
  let err9ccc = null;
  try { await M.queryLocal("Test", 1.5, { corpus: corpus3 }); } catch (e) { err9ccc = e; }
  record("Probe 9c'': InvalidKError (k=1.5 nicht-Integer)", "InvalidKError",
         err9ccc?.name, err9ccc?.name === "InvalidKError");

  // 9d EmbeddingNotAvailableError
  setMockEmbedding("missing");
  let err9d = null;
  try { await M.queryLocal("Test", 5, { corpus: corpus3 }); } catch (e) { err9d = e; }
  record("Probe 9d: EmbeddingNotAvailableError", "EmbeddingNotAvailableError",
         err9d?.name, err9d?.name === "EmbeddingNotAvailableError");

  // 9e InvalidCorpusError (corpus kein Array)
  setMockEmbedding("ok");
  let err9e = null;
  try { await M.queryLocal("Test", 5, { corpus: "string" }); } catch (e) { err9e = e; }
  record("Probe 9e: InvalidCorpusError (kein Array)", "InvalidCorpusError",
         err9e?.name, err9e?.name === "InvalidCorpusError");

  // 9f InvalidCorpusError (Item ohne passageVec)
  let err9f = null;
  try {
    await M.queryLocal("Test", 5, { corpus: [{ label: "fehlt", anchorId: null }] });
  } catch (e) { err9f = e; }
  record("Probe 9f: InvalidCorpusError (passageVec fehlt)", "InvalidCorpusError",
         err9f?.name, err9f?.name === "InvalidCorpusError");

  // 9g InvalidCorpusError (passageVec falsche Länge)
  let err9g = null;
  try {
    await M.queryLocal("Test", 5, { corpus: [{ label: "kurz", passageVec: new Float32Array(128) }] });
  } catch (e) { err9g = e; }
  record("Probe 9g: InvalidCorpusError (falsche Länge)", "InvalidCorpusError",
         err9g?.name, err9g?.name === "InvalidCorpusError");

  // ---- Probe 10: Embedding-Fehler (async rethrow) ----
  setMockEmbedding("throw");
  let err10 = null;
  try { await M.queryLocal("Test", 5, { corpus: corpus3 }); } catch (e) { err10 = e; }
  record("Probe 10: EmbeddingFailedError bei Throw", "EmbeddingFailedError",
         err10?.name, err10?.name === "EmbeddingFailedError");
  record("Probe 10: cause durchgereicht", "true",
         String(err10?.cause instanceof Error),
         err10?.cause instanceof Error);

  // 10b Embedding-Bad-Shape
  setMockEmbedding("bad-shape");
  let err10b = null;
  try { await M.queryLocal("Test", 5, { corpus: corpus3 }); } catch (e) { err10b = e; }
  record("Probe 10b: EmbeddingFailedError bei Bad-Shape", "EmbeddingFailedError",
         err10b?.name, err10b?.name === "EmbeddingFailedError");

  // ---- Probe 11: setLocalCorpus(null) entfernt Provider ----
  setMockEmbedding("ok");
  M.setLocalCorpus(corpus3);
  M.setLocalCorpus(null);
  record("Probe 11: nach setLocalCorpus(null) localCorpusRegistered=false", "false",
         String(M._meta.localCorpusRegistered), M._meta.localCorpusRegistered === false);
  const out11 = await M.queryLocal("Test", 5);   // KEIN Provider → leere Liste
  record("Probe 11: ohne Provider → leere Liste", "0",
         String(out11.length), out11.length === 0);

  // 11b setLocalCorpus mit ungültigem Argument wirft InvalidCorpusError
  let err11b = null;
  try { M.setLocalCorpus(42); } catch (e) { err11b = e; }
  record("Probe 11b: setLocalCorpus(42) → InvalidCorpusError", "InvalidCorpusError",
         err11b?.name, err11b?.name === "InvalidCorpusError");

  // ---- Probe 12: defensive Array-Kopie ----
  // Nach setLocalCorpus(corpus) ändert Mutation am Original den Provider-Output nicht.
  setMockEmbedding("ok");
  const mut = [
    { label: "vor mut", anchorId: "m1", passageVec: mixedVec(queryVec, 0.95, 71) },
  ];
  M.setLocalCorpus(mut);
  mut.push({ label: "nach mut", anchorId: "m2", passageVec: mixedVec(queryVec, 0.92, 72) });
  const out12 = await M.queryLocal("Test", 5);
  record("Probe 12: defensive Kopie nach setLocalCorpus", "1",
         String(out12.length), out12.length === 1);
}

const finalize = () => {
  let allOk = true;
  console.log("\n=== Bau 04.C queryLocal Smoke-Test ===");
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} ${r.probe}\n   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
    if (!r.ok) allOk = false;
  }
  console.log(`\nTotal: ${results.length} Proben, ${results.filter(r => r.ok).length} grün, ${results.filter(r => !r.ok).length} rot.`);
  if (!allOk) process.exit(1);
};

runAsyncProbes().then(finalize).catch((err) => {
  console.error("Smoke-Test-Runner hat unerwartet geworfen:", err);
  process.exit(1);
});
