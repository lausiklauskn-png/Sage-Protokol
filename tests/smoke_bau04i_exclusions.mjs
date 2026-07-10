// Headless smoke test für Bau 04.I — Ausschluss-/Negations-Filter in Modul 04.
// Run mit `node tests/smoke_bau04i_exclusions.mjs`. Kein fake-indexeddb nötig:
// parseExclusions/applyExclusions/contentExcluded sind reine Funktionen; der
// queryLocal-Pfad wird mit einem deterministischen SbkimEmbedding-Mock geprüft.
//
// Beweist Klaus' zwei Fälle (2026-07-10):
//   - „alkoholfrei" wirft Drinks mit Wodka/Rum/… raus (Klasse, nicht Zutat-Wort).
//   - „ohne Erdbeeren" (Allergie) wirft Erdbeer-Rezepte raus, obwohl semantisch nah.
// Plus: Default (ohne opts.exclude) bleibt byte-gleich (Riegel unberührt).

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
  for (let i = 0; i < EMBEDDING_DIM; i++) { v[i] = next(); sumSq += v[i] * v[i]; }
  const norm = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) v[i] = v[i] / norm;
  return v;
}
// Mischung: cos(queryVec, ergebnis) ≈ ziel (grob), damit alle über 0.80 liegen.
function mixedVec(base, target, seed) {
  const noise = makeNormalizedVector(seed);
  const v = new Float32Array(EMBEDDING_DIM);
  let sumSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    v[i] = target * base[i] + (1 - target) * noise[i];
    sumSq += v[i] * v[i];
  }
  const norm = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) v[i] = v[i] / norm;
  return v;
}
const queryVec = makeNormalizedVector(7);
globalThis.SbkimEmbedding = { embedQuery: async () => queryVec };

const results = [];
function record(probe, expected, actual, ok) { results.push({ probe, expected, actual, ok }); }
function eq(probe, expected, actual) { record(probe, JSON.stringify(expected), JSON.stringify(actual), JSON.stringify(expected) === JSON.stringify(actual)); }

// ---- Probe 1: Surface ----
record("Probe 1: parseExclusions exportiert", "function", typeof M.parseExclusions, typeof M.parseExclusions === "function");
record("Probe 1: applyExclusions exportiert", "function", typeof M.applyExclusions, typeof M.applyExclusions === "function");
record("Probe 1: contentExcluded exportiert", "function", typeof M.contentExcluded, typeof M.contentExcluded === "function");
record("Probe 1: _meta.alcoholTermCount > 0", ">0", String(M._meta.alcoholTermCount), M._meta.alcoholTermCount > 0);

// ---- Probe 2: parseExclusions — Alkohol-Klasse ----
record("Probe 2: 'alkoholfrei' → alcoholFree", "true", String(M.parseExclusions("Ein alkoholfreies Getränk").alcoholFree), M.parseExclusions("Ein alkoholfreies Getränk").alcoholFree === true);
record("Probe 2: 'ohne Alkohol' → alcoholFree", "true", String(M.parseExclusions("Erfrischung ohne Alkohol").alcoholFree), M.parseExclusions("Erfrischung ohne Alkohol").alcoholFree === true);
record("Probe 2: 'alcohol-free' → alcoholFree", "true", String(M.parseExclusions("something alcohol-free please").alcoholFree), M.parseExclusions("something alcohol-free please").alcoholFree === true);
record("Probe 2: 'virgin' → alcoholFree", "true", String(M.parseExclusions("a virgin mojito").alcoholFree), M.parseExclusions("a virgin mojito").alcoholFree === true);
record("Probe 2: normaler Text → nicht alcoholFree", "false", String(M.parseExclusions("Erdbeer Smoothie").alcoholFree), M.parseExclusions("Erdbeer Smoothie").alcoholFree === false);

// ---- Probe 3: parseExclusions — freie Begriffe ----
eq("Probe 3: 'ohne Erdbeeren' → Stamm erdbeer", ["erdbeer"], M.parseExclusions("Getränk ohne Erdbeeren").terms);
eq("Probe 3: 'ohne Erdbeeren und Himbeeren' → beide", ["erdbeer", "himbeer"], M.parseExclusions("ohne Erdbeeren und Himbeeren").terms);
eq("Probe 3: 'allergisch gegen Nüsse'", ["nuess"], M.parseExclusions("ich bin allergisch gegen Nüsse").terms);
eq("Probe 3: 'zuckerfrei' → zucker", ["zucker"], M.parseExclusions("bitte zuckerfrei").terms);
eq("Probe 3: 'keine Milch'", ["milch"], M.parseExclusions("keine Milch verwenden").terms);
eq("Probe 3: 'without strawberries'", ["strawberr"], M.parseExclusions("a drink without strawberries").terms);
// 'aber mit' beendet den Ausschluss-Modus — Minze wird NICHT ausgeschlossen.
eq("Probe 3: 'ohne Zucker aber mit Minze' → nur zucker", ["zucker"], M.parseExclusions("ohne Zucker aber mit Minze").terms);

// ---- Probe 4: contentExcluded ----
record("Probe 4: Wodka-Inhalt + alcoholFree → true", "true", String(M.contentExcluded("Raspberry Cooler: Wodka, Limette, Soda", { alcoholFree: true, terms: [] })), M.contentExcluded("Raspberry Cooler: Wodka, Limette, Soda", { alcoholFree: true, terms: [] }) === true);
record("Probe 4: alkoholfreier Inhalt + alcoholFree → false", "false", String(M.contentExcluded("Kokostraum: Kokosmilch, Ananas, Minze", { alcoholFree: true, terms: [] })), M.contentExcluded("Kokostraum: Kokosmilch, Ananas, Minze", { alcoholFree: true, terms: [] }) === false);
record("Probe 4: 'ginger' NICHT als 'gin' (Wortgrenze)", "false", String(M.contentExcluded("Ginger Ale mit frischem Ingwer", { alcoholFree: true, terms: [] })), M.contentExcluded("Ginger Ale mit frischem Ingwer", { alcoholFree: true, terms: [] }) === false);
record("Probe 4: Erdbeer-Inhalt + Term erdbeer → true", "true", String(M.contentExcluded("Sommer-Bowle mit Erdbeeren und Minze", { alcoholFree: false, terms: ["erdbeer"] })), M.contentExcluded("Sommer-Bowle mit Erdbeeren und Minze", { alcoholFree: false, terms: ["erdbeer"] }) === true);
record("Probe 4: erdbeerfreier Inhalt + Term erdbeer → false", "false", String(M.contentExcluded("Mango Lassi mit Joghurt", { alcoholFree: false, terms: ["erdbeer"] })), M.contentExcluded("Mango Lassi mit Joghurt", { alcoholFree: false, terms: ["erdbeer"] }) === false);
record("Probe 4: leere Ausschlüsse → false", "false", String(M.contentExcluded("egal was", { alcoholFree: false, terms: [] })), M.contentExcluded("egal was", { alcoholFree: false, terms: [] }) === false);

// ---- Probe 5: applyExclusions über Kandidaten-Liste ----
const cands = [
  { label: "Raspberry Cooler", text: "Raspberry Cooler: Wodka, Himbeere, Soda" },
  { label: "Kokostraum-Bowl", text: "Kokostraum: Kokosmilch, Ananas, Minze" },
  { label: "Erdbeer-Limo", text: "Erdbeer-Limonade: Erdbeeren, Zitrone, Wasser" },
  { label: "Sunrise Bowle", text: "Sunrise: Orangensaft, Maracuja, Grenadine" },
];
const noAlc = M.applyExclusions(cands, M.parseExclusions("alkoholfreies Getränk"));
eq("Probe 5: alkoholfrei entfernt Raspberry Cooler", ["Kokostraum-Bowl", "Erdbeer-Limo", "Sunrise Bowle"], noAlc.map(c => c.label));
const noErd = M.applyExclusions(cands, M.parseExclusions("Erfrischung ohne Erdbeeren"));
eq("Probe 5: 'ohne Erdbeeren' entfernt Erdbeer-Limo", ["Raspberry Cooler", "Kokostraum-Bowl", "Sunrise Bowle"], noErd.map(c => c.label));
const both = M.applyExclusions(cands, M.parseExclusions("alkoholfrei ohne Erdbeeren"));
eq("Probe 5: alkoholfrei + ohne Erdbeeren", ["Kokostraum-Bowl", "Sunrise Bowle"], both.map(c => c.label));
const none = M.applyExclusions(cands, M.parseExclusions("leckeres Getränk"));
record("Probe 5: keine Ausschlüsse → unveränderte Kopie", "4", String(none.length), none.length === 4 && none !== cands);

// Test-Runner für die queryLocal-Proben (async).
async function runAsyncProbes() {
  // Korpus: alle vier semantisch nah (cos ~0.9, über 0.80-Boden), mit `text`.
  const corpus = [
    { label: "Raspberry Cooler", anchorId: "r1", text: "Raspberry Cooler: Wodka, Himbeere, Soda", passageVec: mixedVec(queryVec, 0.95, 101) },
    { label: "Kokostraum-Bowl",  anchorId: "r2", text: "Kokostraum: Kokosmilch, Ananas, Minze",   passageVec: mixedVec(queryVec, 0.93, 102) },
    { label: "Erdbeer-Limo",     anchorId: "r3", text: "Erdbeer-Limonade: Erdbeeren, Zitrone",     passageVec: mixedVec(queryVec, 0.91, 103) },
    { label: "Sunrise Bowle",    anchorId: "r4", text: "Sunrise: Orangensaft, Maracuja, Grenadine", passageVec: mixedVec(queryVec, 0.90, 104) },
  ];

  // ---- Probe 6: Default (ohne exclude) = byte-gleich, alle 4 über Boden ----
  const base = await M.queryLocal("Getränk", 10, { corpus });
  record("Probe 6: Default liefert alle 4 (Riegel unberührt)", "4", String(base.length), base.length === 4);

  // ---- Probe 7: exclude:true parst 'alkoholfrei' aus der Frage ----
  const q7 = await M.queryLocal("alkoholfreies Getränk", 10, { corpus, exclude: true });
  const has7 = q7.map(r => r.label);
  record("Probe 7: exclude:true entfernt Raspberry Cooler (Wodka)", "kein Raspberry Cooler", has7.join(","), has7.indexOf("Raspberry Cooler") < 0);
  record("Probe 7: exclude:true behält die 3 alkoholfreien", "3", String(q7.length), q7.length === 3);

  // ---- Probe 8: exclude:true parst 'ohne Erdbeeren' ----
  const q8 = await M.queryLocal("Erfrischung ohne Erdbeeren", 10, { corpus, exclude: true });
  const has8 = q8.map(r => r.label);
  record("Probe 8: 'ohne Erdbeeren' entfernt Erdbeer-Limo", "kein Erdbeer-Limo", has8.join(","), has8.indexOf("Erdbeer-Limo") < 0);

  // ---- Probe 9: fertige Ausschluss-Menge als Objekt ----
  const q9 = await M.queryLocal("Getränk", 10, { corpus, exclude: { alcoholFree: true, terms: ["erdbeer"] } });
  const has9 = q9.map(r => r.label);
  record("Probe 9: Objekt-Ausschluss entfernt Wodka + Erdbeere", "2 übrig", String(q9.length), q9.length === 2 && has9.indexOf("Raspberry Cooler") < 0 && has9.indexOf("Erdbeer-Limo") < 0);

  // ---- Probe 10: exclude ohne Verneinung in der Frage → nichts gefiltert ----
  const q10 = await M.queryLocal("leckeres Getränk", 10, { corpus, exclude: true });
  record("Probe 10: keine Verneinung → alle 4 bleiben", "4", String(q10.length), q10.length === 4);

  // ---- Probe 11: Hybrid-Pfad respektiert exclude ebenfalls ----
  const q11 = await M.queryLocal("alkoholfreies Getränk", 10, { corpus, exclude: true, hybrid: true });
  record("Probe 11: Hybrid + exclude entfernt Wodka-Drink", "kein Raspberry Cooler", q11.map(r => r.label).join(","), q11.map(r => r.label).indexOf("Raspberry Cooler") < 0);

  // ---- Probe 12: alle Kandidaten ausgeschlossen → leere Liste, kein Throw ----
  const q12 = await M.queryLocal("Getränk", 10, { corpus, exclude: { alcoholFree: false, terms: ["getraenk", "cooler", "bowl", "limo", "sunrise", "kokos", "raspberry", "erdbeer", "wodka", "kokostraum"] } });
  record("Probe 12: alle raus → [] (kein Throw)", "0", String(q12.length), Array.isArray(q12));
}

const finalize = () => {
  let allOk = true;
  console.log("\n=== Bau 04.I Ausschluss-Filter Smoke-Test ===");
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
