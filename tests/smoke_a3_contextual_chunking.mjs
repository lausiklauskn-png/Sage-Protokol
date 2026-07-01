// Headless smoke — A3: Contextual Chunking in Modul 03 embedContentVector (2026-07-01).
// Run with `node tests/smoke_a3_contextual_chunking.mjs`.
//
// Beweist die Modul-Logik des additiven Contextual-Chunking-Hebels:
//   A) Rückwärts-Kompatibilität — OHNE Kontext sind die assemblierten Texte
//      byte-gleich zum bisherigen Verhalten → identische Vektoren, kein Bruch.
//   B) _assembleContentTexts (reine Text-Assemblierung) — global + pro-Schnipsel
//      Kontext, Vorspann-Format, contextUsed-Flag, Deckel, Fail-soft.
//   C) Der Kontext fließt ins Embedding — mit Fake-Modell erzeugt Kontext einen
//      ANDEREN Zentroid als ohne (der Hebel ist wirklich aktiv, deterministisch).
//   D) Ausgabe-Vertrag stabil — {vector(384, L2=1), count, source:"content",
//      contextUsed}.
//
// Das echte e5-Modell läuft nur im Browser. Hier ein DETERMINISTISCHES
// Fake-Modell (Text → reproduzierbarer Einheits-Vektor), damit die Chunking-
// Mathematik headless beweisbar ist. OB Contextual Chunking die Trennung
// zwischen Domänen real VERBESSERT, zeigt erst Klaus' Browser-Lauf
// (Panel 04 „A3-NACHMESSUNG"). Hier wird NICHTS über %-Gewinn behauptet.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;

const FAKE_MODEL = `
export function pipeline(){
  return async function(texts){
    const dim=384;const data=new Float32Array(texts.length*dim);
    for(let i=0;i<texts.length;i++){
      let h=2166136261;const s=String(texts[i]);
      for(let c=0;c<s.length;c++){h^=s.charCodeAt(c);h=Math.imul(h,16777619);}
      let seed=h>>>0;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
      let n=0;const base=i*dim;
      for(let d=0;d<dim;d++){const v=rnd()-0.5;data[base+d]=v;n+=v*v;}
      n=Math.sqrt(n)||1;for(let d=0;d<dim;d++)data[base+d]/=n;
    }
    return {data};
  };
}
export const env={};
`;
const FAKE_URL = "data:text/javascript," + encodeURIComponent(FAKE_MODEL);

function loadModule(relPath, transform) {
  let src = readFileSync(resolve(repoRoot, relPath), "utf8");
  if (transform) src = transform(src);
  new Function("global", "window", "globalThis", "console", src)(
    globalThis, globalThis, globalThis, console);
}

loadModule("src/modules/03_embedding.js", (src) =>
  src.replace(
    '"https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"',
    JSON.stringify(FAKE_URL)));

const E = globalThis.SbkimEmbedding;

const results = [];
const record = (probe, expected, actual, ok) => results.push({ probe, expected, actual, ok });

function l2(v) { let s = 0; for (let i = 0; i < v.length; i++) s += v[i] * v[i]; return Math.sqrt(s); }
function cos(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
function vecEq(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-9) return false;
  return true;
}

async function run() {
  // ---- B) _assembleContentTexts: reine Text-Assemblierung ----
  record("A3 — _assembleContentTexts exportiert", "function",
    typeof E._assembleContentTexts, typeof E._assembleContentTexts === "function");

  const samples = [
    "Käsekuchen mit Quark",
    { label: "Marmorkuchen", text: "Rührteig mit Kakao" },
  ];

  // Ohne Kontext = altes Verhalten.
  const plain = E._assembleContentTexts(samples);
  record("A3 — ohne Kontext: Text 0 = roher Schnipsel", "Käsekuchen mit Quark",
    plain.texts[0], plain.texts[0] === "Käsekuchen mit Quark");
  record("A3 — ohne Kontext: Objekt = label+text verkettet", "Marmorkuchen Rührteig mit Kakao",
    plain.texts[1], plain.texts[1] === "Marmorkuchen Rührteig mit Kakao");
  record("A3 — ohne Kontext: contextUsed=false", "false",
    String(plain.contextUsed), plain.contextUsed === false);

  // Globaler Kontext wird jedem Schnipsel vorangestellt.
  const glob = E._assembleContentTexts(samples, { context: "Rezeptbuch: Backen" });
  record("A3 — globaler Kontext vorangestellt (String-Schnipsel)",
    "Rezeptbuch: Backen — Käsekuchen mit Quark", glob.texts[0],
    glob.texts[0] === "Rezeptbuch: Backen — Käsekuchen mit Quark");
  record("A3 — globaler Kontext vorangestellt (Objekt-Schnipsel)",
    "Rezeptbuch: Backen — Marmorkuchen Rührteig mit Kakao", glob.texts[1],
    glob.texts[1] === "Rezeptbuch: Backen — Marmorkuchen Rührteig mit Kakao");
  record("A3 — mit Kontext: contextUsed=true", "true",
    String(glob.contextUsed), glob.contextUsed === true);

  // Pro-Schnipsel-Kontext überschreibt den globalen.
  const perCtx = E._assembleContentTexts(
    [{ label: "X", text: "Y", context: "SPEZIAL" }, "Z"],
    { context: "GLOBAL" });
  record("A3 — pro-Schnipsel-Kontext überschreibt global", "SPEZIAL — X Y",
    perCtx.texts[0], perCtx.texts[0] === "SPEZIAL — X Y");
  record("A3 — global gilt weiter für Schnipsel ohne eigenen Kontext", "GLOBAL — Z",
    perCtx.texts[1], perCtx.texts[1] === "GLOBAL — Z");

  // Leerer/Whitespace-Kontext = kein Vorspann (fail-soft).
  const emptyCtx = E._assembleContentTexts(["A"], { context: "   " });
  record("A3 — leerer Kontext fail-soft: kein Vorspann", "A",
    emptyCtx.texts[0], emptyCtx.texts[0] === "A" && emptyCtx.contextUsed === false);

  // Deckel greift auch mit Kontext.
  const many = Array.from({ length: 50 }, (_, i) => "Eintrag " + i);
  const capped = E._assembleContentTexts(many, { context: "K", max: 8 });
  record("A3 — Deckel max=8 auch mit Kontext", "8",
    String(capped.texts.length), capped.texts.length === 8);

  // Fail-soft: leere Einträge übersprungen.
  const skip = E._assembleContentTexts(["", "   ", "echt", null, { foo: 1 }], { context: "K" });
  record("A3 — leere Einträge übersprungen", "1",
    String(skip.texts.length), skip.texts.length === 1 && skip.texts[0] === "K — echt");

  // ---- A) Rückwärts-Kompatibilität auf Vektor-Ebene ----
  const cakeSamples = [
    "Käsekuchen mit Quark und Vanille",
    "Apfelkuchen mit Streuseln",
    { label: "Marmorkuchen", text: "Rührteig mit Kakao-Marmorierung" },
  ];
  const noCtx = await E.embedContentVector(cakeSamples);
  record("A3 — Ausgabe-Vertrag: Länge 384", "384",
    String(noCtx.vector.length), noCtx.vector.length === 384);
  record("A3 — Ausgabe-Vertrag: L2-Norm ≈ 1.0", "≈1.0",
    l2(noCtx.vector).toFixed(5), Math.abs(l2(noCtx.vector) - 1) < 1e-4);
  record("A3 — Ausgabe-Vertrag: source 'content'", "content",
    noCtx.source, noCtx.source === "content");
  record("A3 — Ausgabe-Vertrag: contextUsed=false ohne Kontext", "false",
    String(noCtx.contextUsed), noCtx.contextUsed === false);

  // ---- C) Kontext fließt ins Embedding: anderer Zentroid ----
  const withCtx = await E.embedContentVector(cakeSamples, { context: "Rezeptbuch: Kuchen backen" });
  record("A3 — mit Kontext: contextUsed=true", "true",
    String(withCtx.contextUsed), withCtx.contextUsed === true);
  record("A3 — Kontext verändert den Zentroid (Hebel aktiv)", "cos < 1.0",
    cos(noCtx.vector, withCtx.vector).toFixed(4), cos(noCtx.vector, withCtx.vector) < 0.9999);
  record("A3 — Kontext-Zentroid weiter L2-normalisiert", "≈1.0",
    l2(withCtx.vector).toFixed(5), Math.abs(l2(withCtx.vector) - 1) < 1e-4);

  // Determinismus: gleicher Kontext → gleicher Vektor (reproduzierbar).
  const withCtx2 = await E.embedContentVector(cakeSamples, { context: "Rezeptbuch: Kuchen backen" });
  record("A3 — deterministisch: gleicher Kontext → gleicher Vektor", "identisch",
    vecEq(withCtx.vector, withCtx2.vector) ? "identisch" : "abweichend",
    vecEq(withCtx.vector, withCtx2.vector));

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
