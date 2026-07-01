// Headless smoke test für Bau 04.F — BM25 lexikalischer Vorfilter + Hybrid-
// Fusion (Strang A1, Brief 2026-07-01). Run: `node tests/smoke_bau04f_hybrid_bm25.mjs`.
// KEIN echtes Embedding-Modell — SbkimEmbedding.embedQuery wird deterministisch
// gemockt (fixer Query-Vektor), Korpus-passageVec sind kontrollierte Vektoren
// mit bekanntem Cosinus zum Query-Vektor.
//
// Proben:
//   1. Export-Anker: bm25Scores / tokenizeBM25 exportiert, _meta bm25K1/B/rrfK.
//   2. tokenizeBM25: lowercase, unicode/Zahl-Läufe, leer → [].
//   3. bm25Scores: exakter Term > 0, kein Overlap = 0, leeres Doc-Array → [].
//   4. bm25Scores: seltenerer Term (höhere IDF) hebt Score; deterministisch.
//   5. queryLocal DEFAULT (kein hybrid) unverändert; hybrid ohne lexikalischen
//      Overlap degradiert auf denselben Treffer-Satz (Vektor-only).
//   6. queryLocal HYBRID: ein Doc UNTER dem Vektor-Boden (cos < 0.80) mit
//      exaktem lexikalischem Treffer wird AUFGENOMMEN (der Kern-Hebel).
//   7. queryLocal HYBRID: Fusion — Doc, das in BEIDEN Listen auftaucht, schlägt
//      ein reines Vektor-Doc; Ergebnis trägt bm25 + fused Felder.
//   8. queryLocal HYBRID: corpus `text`-Feld speist BM25 (Fallback label).
//   9. queryLocal HYBRID: leerer Korpus → [], kein Throw; k begrenzt.
//  10. validateCorpus: text falscher Typ → InvalidCorpusError.

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
  else { fail++; console.log("  ✗ " + name + (extra ? "  →  " + extra : "")); }
}

function makeNormalizedVector(seed) {
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return (state / 0xFFFFFFFF) * 2 - 1;
  };
  const v = new Float32Array(EMBEDDING_DIM);
  let sumSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) { v[i] = next(); sumSq += v[i] * v[i]; }
  const norm = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) v[i] /= norm;
  return v;
}
// Vektor mit Ziel-Cosinus ~target zu `reference`.
function mixedVec(reference, target, noiseSeed) {
  const noise = makeNormalizedVector(noiseSeed);
  const a = target, b = Math.sqrt(Math.max(0, 1 - target * target));
  const out = new Float32Array(EMBEDDING_DIM);
  let sumSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) { out[i] = a * reference[i] + b * noise[i]; sumSq += out[i] * out[i]; }
  const n = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) out[i] /= n;
  return out;
}

const Q = makeNormalizedVector(1);
function mockEmbedding() {
  globalThis.SbkimEmbedding = { embedQuery: async () => Q };
}

// ---- Probe 1: Export-Anker ----
console.log("Probe 1: Export-Anker");
ok("bm25Scores exportiert", typeof M.bm25Scores === "function");
ok("tokenizeBM25 exportiert", typeof M.tokenizeBM25 === "function");
ok("_meta.bm25K1 = 1.5", M._meta.bm25K1 === 1.5, String(M._meta.bm25K1));
ok("_meta.bm25B = 0.75", M._meta.bm25B === 0.75, String(M._meta.bm25B));
ok("_meta.rrfK = 60", M._meta.rrfK === 60, String(M._meta.rrfK));

// ---- Probe 2: tokenizeBM25 ----
console.log("Probe 2: tokenizeBM25");
ok("lowercase + split", JSON.stringify(M.tokenizeBM25("Wespen Hausmittel!")) === JSON.stringify(["wespen", "hausmittel"]));
ok("Zahlen + unicode (ä)", JSON.stringify(M.tokenizeBM25("Öl 3 Löffel")) === JSON.stringify(["öl", "3", "löffel"]));
ok("leer → []", JSON.stringify(M.tokenizeBM25("")) === "[]");
ok("nicht-String → []", JSON.stringify(M.tokenizeBM25(null)) === "[]");

// ---- Probe 3: bm25Scores Grundlagen ----
console.log("Probe 3: bm25Scores Grundlagen");
{
  const docs = ["wespen hausmittel garten", "kuchen rezept ofen", "wespen nest"];
  const sc = M.bm25Scores("wespen hausmittel", docs);
  ok("Doc0 (2 Treffer) > 0", sc[0] > 0, String(sc[0]));
  ok("Doc1 (kein Overlap) = 0", sc[1] === 0, String(sc[1]));
  ok("Doc2 (1 Treffer) > 0", sc[2] > 0, String(sc[2]));
  ok("Doc0 > Doc2 (mehr Treffer)", sc[0] > sc[2]);
  ok("leeres Doc-Array → []", JSON.stringify(M.bm25Scores("x", [])) === "[]");
  // Deterministisch: zweiter Aufruf identisch.
  const sc2 = M.bm25Scores("wespen hausmittel", docs);
  ok("deterministisch", JSON.stringify(sc) === JSON.stringify(sc2));
}

// ---- Probe 4: IDF-Effekt (seltener Term wiegt schwerer) ----
console.log("Probe 4: IDF-Effekt");
{
  // "haeufig" in allen 3 Docs (df=3, IDF niedrig); "selten" nur in Doc0 (df=1).
  const docs = ["selten haeufig", "haeufig fuellwort", "haeufig anderes"];
  const scSelten = M.bm25Scores("selten", docs);
  const scHaeufig = M.bm25Scores("haeufig", docs);
  ok("seltener Term Doc0 > häufiger Term Doc0", scSelten[0] > scHaeufig[0], scSelten[0] + " vs " + scHaeufig[0]);
}

// ---- Probe 5: DEFAULT unverändert + Hybrid ohne Overlap degradiert ----
console.log("Probe 5: DEFAULT vs Hybrid-ohne-Overlap");
{
  mockEmbedding();
  const corpus = [
    { label: "B", text: "voellig andere begriffe hier", passageVec: mixedVec(Q, 0.86, 11) },
    { label: "C", text: "noch etwas anderes ganz", passageVec: mixedVec(Q, 0.83, 12) },
    { label: "A", text: "unter der schwelle liegend", passageVec: mixedVec(Q, 0.70, 13) },
  ];
  const def = await M.queryLocal("frage ohne jeden overlap", 5, { corpus });
  const labelsDef = def.map((r) => r.label);
  ok("DEFAULT: nur cos>=0.80 (B,C)", JSON.stringify(labelsDef.slice().sort()) === JSON.stringify(["B", "C"]), JSON.stringify(labelsDef));
  ok("DEFAULT: kein bm25-Feld", def[0].bm25 === undefined);
  const hyb = await M.queryLocal("frage ohne jeden overlap", 5, { corpus, hybrid: true });
  const labelsHyb = hyb.map((r) => r.label).sort();
  // Kein lexikalischer Overlap → Aufnahme = nur Vektor-Pfad → gleicher Satz {B,C}.
  ok("HYBRID ohne Overlap → gleicher Satz {B,C}", JSON.stringify(labelsHyb) === JSON.stringify(["B", "C"]), JSON.stringify(labelsHyb));
  ok("HYBRID trägt fused-Feld", typeof hyb[0].fused === "number");
}

// ---- Probe 6: Kern-Hebel — Doc unter Vektor-Boden mit Lexik-Treffer AUFGENOMMEN ----
console.log("Probe 6: Kern-Hebel (unter-Boden-Lexik-Treffer)");
{
  mockEmbedding();
  const corpus = [
    { label: "B", text: "unrelated kitchen recipe oven", passageVec: mixedVec(Q, 0.86, 21) },
    { label: "C", text: "wespen nest dachboden", passageVec: mixedVec(Q, 0.83, 22) },
    { label: "A", text: "wespen abwehr hausmittel garten", passageVec: mixedVec(Q, 0.70, 23) },
  ];
  const def = await M.queryLocal("wespen hausmittel", 5, { corpus });
  ok("DEFAULT lässt A (cos 0.70) fallen", def.every((r) => r.label !== "A"), JSON.stringify(def.map((r) => r.label)));
  const hyb = await M.queryLocal("wespen hausmittel", 5, { corpus, hybrid: true });
  const labels = hyb.map((r) => r.label);
  ok("HYBRID nimmt A auf (Lexik-Treffer trotz cos<0.80)", labels.includes("A"), JSON.stringify(labels));
  const aRow = hyb.find((r) => r.label === "A");
  ok("A trägt bm25 > 0", aRow.bm25 > 0, String(aRow && aRow.bm25));
  ok("A.score bleibt Cosinus (~0.70)", aRow.score > 0.65 && aRow.score < 0.75, String(aRow.score));
}

// ---- Probe 7: Fusion-Reihenfolge ----
console.log("Probe 7: Fusion-Reihenfolge");
{
  mockEmbedding();
  const corpus = [
    { label: "B", text: "unrelated kitchen recipe oven", passageVec: mixedVec(Q, 0.86, 21) }, // nur Vektor
    { label: "C", text: "wespen nest dachboden", passageVec: mixedVec(Q, 0.83, 22) },        // beide Listen
    { label: "A", text: "wespen abwehr hausmittel garten", passageVec: mixedVec(Q, 0.70, 23) }, // stark lexik
  ];
  const hyb = await M.queryLocal("wespen hausmittel", 5, { corpus, hybrid: true });
  const labels = hyb.map((r) => r.label);
  // A (in beiden, top lexik) + C (in beiden) stehen über B (nur Vektor).
  ok("A steht über B", labels.indexOf("A") < labels.indexOf("B"), JSON.stringify(labels));
  ok("C (beide Listen) steht über B (nur Vektor)", labels.indexOf("C") < labels.indexOf("B"), JSON.stringify(labels));
  // fused absteigend sortiert.
  let sorted = true;
  for (let i = 1; i < hyb.length; i++) if (hyb[i].fused > hyb[i - 1].fused + 1e-12) sorted = false;
  ok("nach fused absteigend sortiert", sorted);
}

// ---- Probe 8: text-Fallback auf label ----
console.log("Probe 8: text-Fallback auf label");
{
  mockEmbedding();
  const corpus = [
    { label: "wespen hausmittel", passageVec: mixedVec(Q, 0.70, 31) }, // KEIN text → label als BM25-Doc
    { label: "voellig anderes", passageVec: mixedVec(Q, 0.86, 32) },
  ];
  const hyb = await M.queryLocal("wespen hausmittel", 5, { corpus, hybrid: true });
  const row = hyb.find((r) => r.label === "wespen hausmittel");
  ok("label als BM25-Doc → aufgenommen trotz cos<0.80", !!row && row.bm25 > 0, JSON.stringify(hyb.map((r) => r.label)));
}

// ---- Probe 9: leerer Korpus + k-Grenze ----
console.log("Probe 9: leerer Korpus + k-Grenze");
{
  mockEmbedding();
  const empty = await M.queryLocal("egal", 5, { corpus: [], hybrid: true });
  ok("leerer Korpus → []", Array.isArray(empty) && empty.length === 0);
  const corpus = [
    { label: "A", text: "wespen a", passageVec: mixedVec(Q, 0.9, 41) },
    { label: "B", text: "wespen b", passageVec: mixedVec(Q, 0.88, 42) },
    { label: "C", text: "wespen c", passageVec: mixedVec(Q, 0.86, 43) },
  ];
  const hyb = await M.queryLocal("wespen", 2, { corpus, hybrid: true });
  ok("k=2 begrenzt auf 2 Treffer", hyb.length === 2, String(hyb.length));
}

// ---- Probe 10: validateCorpus text-Typ ----
console.log("Probe 10: validateCorpus text-Typ");
{
  mockEmbedding();
  let threw = false;
  try {
    await M.queryLocal("x", 5, { corpus: [{ label: "A", text: 123, passageVec: mixedVec(Q, 0.9, 51) }], hybrid: true });
  } catch (e) { threw = e && e.name === "InvalidCorpusError"; }
  ok("text=123 → InvalidCorpusError", threw);
  // gültiger text (string) wirft nicht.
  let okNoThrow = true;
  try {
    await M.queryLocal("x", 5, { corpus: [{ label: "A", text: "gut", passageVec: mixedVec(Q, 0.9, 52) }], hybrid: true });
  } catch (e) { okNoThrow = false; }
  ok("text=string wirft nicht", okNoThrow);
}

console.log("\nTotal: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
process.exit(fail === 0 ? 0 : 1);
