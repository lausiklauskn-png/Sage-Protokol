// Headless smoke — A10: Schnipsel-Mittel in Modul 03 embedSnippets (Spore v0.2,
// 2026-07-14). Run with `node tests/smoke_bau03_snippets.mjs`.
//
// Beweist die Modul-Logik des neuen Satz-Schnipsel-Hebels:
//   A) _splitIntoSentences — Satz-Zerlegung (Punkt/!/?/…), Zeilenumbrüche,
//      Whitespace-Normalisierung, fail-soft (Nicht-String/leer → []).
//   B) _prepareSnippetTexts — String ODER String-Array, Deckel (Default 20 /
//      opts.max), Satz-Reihenfolge, Text-Kürzung.
//   C) embedSnippets — bis zu N L2-normalisierte Passage-Vektoren in
//      Satz-Reihenfolge, {vec(384), text}; fail-soft leer → [].
//
// Das echte e5-Modell läuft nur im Browser. Hier ein DETERMINISTISCHES
// Fake-Modell (Text → reproduzierbarer Einheits-Vektor, L2=1) wie im
// A3-Smoke, damit die Schnipsel-Mathematik headless beweisbar ist.

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

// Worker aus (kein Blob-Worker in Node) → Haupt-Faden mit Fake-Modell.
loadModule("src/modules/03_embedding.js", (src) =>
  src.replace(
    '"https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"',
    JSON.stringify(FAKE_URL)));

const E = globalThis.SbkimEmbedding;

const results = [];
const record = (probe, expected, actual, ok) => results.push({ probe, expected, actual, ok });
function l2(v) { let s = 0; for (let i = 0; i < v.length; i++) s += v[i] * v[i]; return Math.sqrt(s); }

async function run() {
  // ---- Exports + _meta ----
  record("embedSnippets exportiert", "function", typeof E.embedSnippets,
    typeof E.embedSnippets === "function");
  record("_splitIntoSentences exportiert", "function", typeof E._splitIntoSentences,
    typeof E._splitIntoSentences === "function");
  record("_prepareSnippetTexts exportiert", "function", typeof E._prepareSnippetTexts,
    typeof E._prepareSnippetTexts === "function");
  record("_meta.sporeSnippetMax = 20", "20", String(E._meta.sporeSnippetMax),
    E._meta.sporeSnippetMax === 20);
  record("_meta.sporeSnippetGranularity = sentence", "sentence",
    String(E._meta.sporeSnippetGranularity), E._meta.sporeSnippetGranularity === "sentence");

  // ---- A) _splitIntoSentences ----
  const s1 = E._splitIntoSentences("Erster Satz. Zweiter Satz! Dritter?");
  record("A — drei Sätze getrennt", "3", String(s1.length), s1.length === 3);
  record("A — Satz 0 korrekt", "Erster Satz.", s1[0], s1[0] === "Erster Satz.");
  record("A — Satz 2 korrekt", "Dritter?", s1[2], s1[2] === "Dritter?");

  const s2 = E._splitIntoSentences("Zeile eins\nZeile zwei\r\nZeile drei");
  record("A — Zeilenumbrüche trennen", "3", String(s2.length), s2.length === 3);
  record("A — Zeile ohne Satzzeichen bleibt ein Satz", "Zeile eins",
    s2[0], s2[0] === "Zeile eins");

  const s3 = E._splitIntoSentences("  Mehrfach   Leerraum   normalisiert.  ");
  record("A — Whitespace normalisiert", "Mehrfach Leerraum normalisiert.",
    s3[0], s3[0] === "Mehrfach Leerraum normalisiert.");

  record("A — fail-soft: leerer String → []", "0",
    String(E._splitIntoSentences("").length), E._splitIntoSentences("").length === 0);
  record("A — fail-soft: nur Whitespace → []", "0",
    String(E._splitIntoSentences("   \n  ").length), E._splitIntoSentences("   \n  ").length === 0);
  record("A — fail-soft: Nicht-String → []", "0",
    String(E._splitIntoSentences(null).length), E._splitIntoSentences(null).length === 0);

  // ---- B) _prepareSnippetTexts ----
  const p1 = E._prepareSnippetTexts("A. B. C. D.");
  record("B — String zerlegt in 4 Sätze", "4", String(p1.length), p1.length === 4);
  record("B — Satz-Reihenfolge erhalten", "A.,B.,C.,D.", p1.join(","),
    p1.join(",") === "A.,B.,C.,D.");

  const arrInput = ["Ein Satz.", "Noch einer. Und ein zweiter."];
  const p2 = E._prepareSnippetTexts(arrInput);
  record("B — String-Array: Sätze über Elemente hinweg", "3",
    String(p2.length), p2.length === 3);
  record("B — Array-Reihenfolge erhalten", "Ein Satz.,Noch einer.,Und ein zweiter.",
    p2.join(","), p2.join(",") === "Ein Satz.,Noch einer.,Und ein zweiter.");

  const many = Array.from({ length: 40 }, (_, i) => "Satz Nummer " + i + ".").join(" ");
  const pDefault = E._prepareSnippetTexts(many);
  record("B — Default-Deckel 20 greift", "20", String(pDefault.length), pDefault.length === 20);
  const pMax = E._prepareSnippetTexts(many, { max: 5 });
  record("B — opts.max=5 greift", "5", String(pMax.length), pMax.length === 5);
  record("B — Deckel behält die ERSTEN Sätze (Reihenfolge)", "Satz Nummer 0.",
    pMax[0], pMax[0] === "Satz Nummer 0.");

  // Text-Kürzung auf SNIPPET_TEXT_MAX (160) + Ellipse.
  const longSentence = "x".repeat(300) + ".";
  const pLong = E._prepareSnippetTexts(longSentence);
  record("B — langer Satz auf ≤160 gekürzt", "≤160",
    String(pLong[0].length), pLong[0].length <= 160);
  record("B — Kürzung endet mit …", "true",
    String(pLong[0].endsWith("…")), pLong[0].endsWith("…"));

  // ---- C) embedSnippets ----
  const snips = await E.embedSnippets("Käsekuchen mit Quark. Apfelkuchen mit Streuseln. Marmorkuchen mit Kakao.");
  record("C — drei Schnipsel-Vektoren", "3", String(snips.length), snips.length === 3);
  record("C — Eintrag hat vec(384)", "384",
    String(snips[0].vec.length), snips[0].vec.length === 384);
  record("C — vec L2-normalisiert ≈ 1.0", "≈1.0",
    l2(snips[0].vec).toFixed(5), Math.abs(l2(snips[0].vec) - 1) < 1e-4);
  record("C — Eintrag trägt text (Quell-Satz)", "Käsekuchen mit Quark.",
    snips[0].text, snips[0].text === "Käsekuchen mit Quark.");
  record("C — Reihenfolge = Satz-Reihenfolge", "Apfelkuchen mit Streuseln.",
    snips[1].text, snips[1].text === "Apfelkuchen mit Streuseln.");

  // Verschiedene Sätze → verschiedene Vektoren (deterministisches Fake-Modell).
  let differ = false;
  for (let d = 0; d < 384; d++) { if (Math.abs(snips[0].vec[d] - snips[1].vec[d]) > 1e-9) { differ = true; break; } }
  record("C — verschiedene Sätze → verschiedene Vektoren", "true", String(differ), differ);

  // Deckel im embedSnippets-Pfad.
  const capped = await E.embedSnippets(many, { max: 4 });
  record("C — opts.max=4 im Embedding-Pfad", "4", String(capped.length), capped.length === 4);

  // Fail-soft.
  const empty = await E.embedSnippets("   ");
  record("C — fail-soft: nur Whitespace → []", "0", String(empty.length), empty.length === 0);
  const emptyArr = await E.embedSnippets([]);
  record("C — fail-soft: leeres Array → []", "0", String(emptyArr.length), emptyArr.length === 0);

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
