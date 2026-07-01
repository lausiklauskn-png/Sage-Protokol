// Headless smoke — A4: Query-Expansion / Multi-Query in Modul 04 (2026-07-01).
// Run with `node tests/smoke_a4_query_expansion.mjs`.
//
// Beweist die Modul-Logik des additiven A4-Hebels:
//   A) expandQuerySimple — freie, deterministische Varianten (Synonym-Karte,
//      Original zuerst, dedupe, Deckel, Fehler bei leer).
//   B) queryLocalMulti — RRF-Fusion über Varianten: RETTET ein Ziel, das die
//      Einzel-Frage verpasst, weil eine Variante es findet (Kern-Nutzen).
//   C) Dedupe der Varianten, Fail-soft (werfende Variante übersprungen), k-Cut,
//      Fehler bei leer/ungültig.
//   D) Additiv: queryLocal (ohne Multi) unverändert.
//
// Deterministischer Hash-Embedding-Mock (Text → reproduzierbarer 384-Vektor):
// gleicher Text → cos 1.0, verschiedener Text → ~0. So ist die Fusion headless
// beweisbar. Der echte semantische Nutzen zeigt sich im Browser (Panel 04
// A4-NACHMESSUNG); hier wird die MECHANIK bewiesen, kein %-Gewinn behauptet.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
globalThis.window = globalThis;

function hashVec(text) {
  const dim = 384; const data = new Float32Array(dim);
  let h = 2166136261; const s = String(text);
  for (let c = 0; c < s.length; c++) { h ^= s.charCodeAt(c); h = Math.imul(h, 16777619); }
  let seed = h >>> 0; const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  let n = 0;
  for (let d = 0; d < dim; d++) { const v = rnd() - 0.5; data[d] = v; n += v * v; }
  n = Math.sqrt(n) || 1; for (let d = 0; d < dim; d++) data[d] /= n;
  return data;
}
// Embedding-Mock: gleicher Text → gleicher Vektor (cos 1.0), sonst ~0.
// "BOOM" wirft (für den Fail-soft-Test).
globalThis.SbkimEmbedding = {
  embedQuery: async function (t) { if (t === "BOOM") throw new Error("mock boom"); return hashVec(t); },
  embedPassage: async function (t) { return hashVec(t); },
};

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("global", "window", "globalThis", "console", src)(
    globalThis, globalThis, globalThis, console);
}
loadModule("src/modules/04_match.js");
const M = globalThis.SbkimMatch;

const results = [];
const record = (probe, expected, actual, ok) => results.push({ probe, expected, actual, ok });

async function run() {
  // ---- A) expandQuerySimple ----
  record("A4 — expandQuerySimple exportiert", "function",
    typeof M.expandQuerySimple, typeof M.expandQuerySimple === "function");

  const plain = M.expandQuerySimple("wespen abwehr");
  record("A4 — ohne Synonyme: nur Original", "[wespen abwehr]",
    JSON.stringify(plain), plain.length === 1 && plain[0] === "wespen abwehr");

  const exp = M.expandQuerySimple("wespen abwehr", { synonyms: { wespen: ["insekten", "hornissen"] } });
  record("A4 — Synonym-Varianten (Original zuerst)", "3, Original[0]",
    exp.length + ", " + exp[0],
    exp[0] === "wespen abwehr" && exp.indexOf("insekten abwehr") !== -1 && exp.indexOf("hornissen abwehr") !== -1);

  const dup = M.expandQuerySimple("wespen abwehr", { synonyms: { wespen: ["wespen", "WESPEN"] } });
  record("A4 — dedupe: keine Original-Dubletten", "1",
    String(dup.length), dup.length === 1);

  const capped = M.expandQuerySimple("a b", { synonyms: { a: ["x1", "x2", "x3", "x4", "x5"] }, maxVariants: 3 });
  record("A4 — maxVariants-Deckel greift", "3", String(capped.length), capped.length === 3);

  let threwEmpty = false;
  try { M.expandQuerySimple("  "); } catch (e) { threwEmpty = e && e.name === "EmptyQueryError"; }
  record("A4 — expandQuerySimple leer → EmptyQueryError", "true", String(threwEmpty), threwEmpty);

  // ---- B) queryLocalMulti — Fusion rettet cross-phrasing-Treffer ----
  record("A4 — queryLocalMulti exportiert", "function",
    typeof M.queryLocalMulti, typeof M.queryLocalMulti === "function");

  // Ablenker matcht die Original-Frage; Ziel matcht nur die Synonym-Variante.
  const corpus = [
    { label: "Ablenker", anchorId: "ab", text: "wespen abwehr",   passageVec: hashVec("wespen abwehr") },
    { label: "Ziel",     anchorId: "zi", text: "insekten abwehr", passageVec: hashVec("insekten abwehr") },
  ];
  const single = await M.queryLocalMulti(["wespen abwehr"], 5, { corpus });
  const singleLabels = single.map((r) => r.label);
  record("A4 — Einzel-Frage findet nur Ablenker (Ziel verpasst)", "Ablenker, kein Ziel",
    singleLabels.join(","),
    singleLabels.indexOf("Ablenker") !== -1 && singleLabels.indexOf("Ziel") === -1);

  const multi = await M.queryLocalMulti(["wespen abwehr", "insekten abwehr"], 5, { corpus });
  const multiLabels = multi.map((r) => r.label);
  record("A4 — Multi-Query RETTET Ziel (Variante findet es)", "Ablenker+Ziel",
    multiLabels.join(","),
    multiLabels.indexOf("Ablenker") !== -1 && multiLabels.indexOf("Ziel") !== -1);
  record("A4 — Treffer haben fused-Score > 0", ">0",
    String(multi[0].fused > 0), multi[0].fused > 0);

  // Variante-Dedupe: 3× dieselbe Frage → Ablenker matchedQueries = 1 (nicht 3).
  const dedup = await M.queryLocalMulti(["wespen abwehr", "WESPEN ABWEHR", " wespen abwehr "], 5, { corpus });
  const ab = dedup.find((r) => r.label === "Ablenker");
  record("A4 — Varianten-Dedupe: matchedQueries=1 trotz 3 Dubletten", "1",
    String(ab && ab.matchedQueries), ab && ab.matchedQueries === 1);

  // Fail-soft: eine werfende Variante ("BOOM") wird übersprungen, Suche läuft.
  const failsoft = await M.queryLocalMulti(["insekten abwehr", "BOOM"], 5, { corpus });
  record("A4 — Fail-soft: werfende Variante übersprungen, Ziel bleibt",
    "Ziel gefunden", failsoft.map((r) => r.label).join(","),
    failsoft.map((r) => r.label).indexOf("Ziel") !== -1);

  // k-Cut.
  const k1 = await M.queryLocalMulti(["wespen abwehr", "insekten abwehr"], 1, { corpus });
  record("A4 — k=1 schneidet auf 1 Treffer", "1", String(k1.length), k1.length === 1);

  // Fehler: leeres Array / alle leer.
  let threwArr = false;
  try { await M.queryLocalMulti([], 5, { corpus }); } catch (e) { threwArr = e && e.name === "EmptyQueryError"; }
  record("A4 — queryLocalMulti [] → EmptyQueryError", "true", String(threwArr), threwArr);
  let threwAllEmpty = false;
  try { await M.queryLocalMulti(["", "  "], 5, { corpus }); } catch (e) { threwAllEmpty = e && e.name === "EmptyQueryError"; }
  record("A4 — queryLocalMulti nur-leer → EmptyQueryError", "true", String(threwAllEmpty), threwAllEmpty);

  // ---- D) Additiv: queryLocal (Einzel) unverändert nutzbar ----
  const direct = await M.queryLocal("wespen abwehr", 5, { corpus });
  record("A4 — queryLocal (Einzel) unverändert: findet Ablenker", "Ablenker",
    direct.map((r) => r.label).join(","), direct.map((r) => r.label).indexOf("Ablenker") !== -1);

  // Print
  let green = 0;
  for (const r of results) { if (r.ok) green++; }
  console.log("\n  Probe | erwartet | erhalten | ok");
  console.log("  ------|----------|----------|----");
  for (const r of results) {
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.probe} | ${r.expected} | ${r.actual}`);
  }
  console.log(`\nTotal: ${results.length} Proben, ${green} grün, ${results.length - green} rot.`);
  if (green !== results.length) process.exit(1);
}
run().catch((e) => { console.error(e); process.exit(1); });
