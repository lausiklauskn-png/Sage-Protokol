// Headless smoke test für Bau 04.A matchDimensions synchron in Modul 04.
// Run mit `node tests/smoke_bau04a_match_dimensions.mjs`. KEIN
// fake-indexeddb nötig — matchDimensions ist zustandslos + reine
// Funktion (kein IndexedDB-Zugriff, kein Promise).
//
// Drei Proben + Sub-Proben:
//  1. Bidirektional (alle vier 384-dim Float32Arrays L2-normalisiert):
//     deterministisches Ergebnis, alle drei Schichten in [-1, 1],
//     availableLanes: 2, overall = Schicht-Score (Stufe-A-Heuristik).
//  2. Nur-Anbieter-Modus (queryCap+queryNeeds null): alle Schichten
//     null, availableLanes: 0, kein Throw.
//  3. Alle vier null: DimensionsAllNullError SYNCHRON geworfen.

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

// L2-normalisierten 384-dim-Vektor erzeugen aus einem Seed.
// Reproduzierbar + deterministisch (linear-congruential generator).
function makeNormalizedVector(seed) {
  let state = seed >>> 0;
  const next = () => {
    // LCG: state = (a*state + c) mod 2^32
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return (state / 0xFFFFFFFF) * 2 - 1;  // [-1, 1]
  };
  const v = new Float32Array(EMBEDDING_DIM);
  let sumSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    v[i] = next();
    sumSq += v[i] * v[i];
  }
  const norm = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    v[i] = v[i] / norm;
  }
  return v;
}

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

// ---- Probe 1: bidirektional ----
const qCap = makeNormalizedVector(1);
const qNeeds = makeNormalizedVector(2);
const pCap = makeNormalizedVector(3);
const pNeeds = makeNormalizedVector(4);

const r1 = M.matchDimensions(qCap, qNeeds, pCap, pNeeds);
record("Probe 1: availableLanes", "2", String(r1.availableLanes), r1.availableLanes === 2);
record("Probe 1: fachlich nicht null", "[-1, 1]",
       typeof r1.fachlich === "number" ? r1.fachlich.toFixed(4) : "null",
       typeof r1.fachlich === "number" && r1.fachlich >= -1 && r1.fachlich <= 1);
record("Probe 1: prozess === fachlich (Stufe-A-Heuristik)", "gleich",
       String(r1.prozess === r1.fachlich), r1.prozess === r1.fachlich);
record("Probe 1: skalierung === fachlich (Stufe-A-Heuristik)", "gleich",
       String(r1.skalierung === r1.fachlich), r1.skalierung === r1.fachlich);
record("Probe 1: overall === fachlich (Stufe-A-Heuristik)", "gleich",
       String(r1.overall === r1.fachlich), r1.overall === r1.fachlich);
record("Probe 1: bruecke === null (Stufe B kommt mit Bau 04.B)", "null",
       String(r1.bruecke), r1.bruecke === null);

// ---- Probe 1b: Single-Lane (eine Lane berechenbar, andere null) ----
const r1b = M.matchDimensions(qCap, null, null, pNeeds);
// Lane 1 (qCap × pNeeds) berechenbar, Lane 2 (qNeeds × pCap) NICHT.
record("Probe 1b: Single-Lane — availableLanes", "1", String(r1b.availableLanes),
       r1b.availableLanes === 1);
const lane1Cosine = M.match(qCap, pNeeds);  // direkter Vergleich
record("Probe 1b: Schicht-Score === Lane-1-Cosinus (single-lane)",
       lane1Cosine.toFixed(6),
       typeof r1b.fachlich === "number" ? r1b.fachlich.toFixed(6) : "null",
       Math.abs(r1b.fachlich - lane1Cosine) < 1e-9);

// ---- Probe 2: Nur-Anbieter-Modus ----
const r2 = M.matchDimensions(null, null, pCap, pNeeds);
record("Probe 2: Nur-Anbieter-Modus — availableLanes", "0", String(r2.availableLanes),
       r2.availableLanes === 0);
record("Probe 2: alle Schichten null", "null/null/null/null",
       `${r2.fachlich}/${r2.prozess}/${r2.skalierung}/${r2.overall}`,
       r2.fachlich === null && r2.prozess === null && r2.skalierung === null && r2.overall === null);
record("Probe 2: bruecke null", "null", String(r2.bruecke), r2.bruecke === null);

// Auch andere Seite null
const r2b = M.matchDimensions(qCap, qNeeds, null, null);
record("Probe 2b: andere Seite null — availableLanes", "0", String(r2b.availableLanes),
       r2b.availableLanes === 0);

// ---- Probe 3: alle vier null → DimensionsAllNullError ----
let allNullErr = null;
try {
  M.matchDimensions(null, null, null, null);
} catch (e) {
  allNullErr = e;
}
record("Probe 3: alle vier null → DimensionsAllNullError",
       "name: DimensionsAllNullError",
       allNullErr ? "name: " + allNullErr.name : "kein Throw",
       allNullErr && allNullErr.name === "DimensionsAllNullError");
record("Probe 3: Error-Message ist deutsch", "enthält 'alle vier Vektoren null'",
       allNullErr ? "msg: " + allNullErr.message.slice(0, 80) : "(kein Error)",
       allNullErr && allNullErr.message.indexOf("alle vier Vektoren null") !== -1);

// ---- Probe 4: _meta-Anker ----
record("Probe 4: _meta.schichtMinMatch", "0.6", String(M._meta.schichtMinMatch),
       M._meta.schichtMinMatch === 0.6);
record("Probe 4: _meta.matchDimensionsLanes", '["fachlich","prozess","skalierung"]',
       JSON.stringify(M._meta.matchDimensionsLanes),
       JSON.stringify(M._meta.matchDimensionsLanes) === '["fachlich","prozess","skalierung"]');
record("Probe 4: SCHICHT_MIN_MATCH exportiert", "0.6", String(M.SCHICHT_MIN_MATCH),
       M.SCHICHT_MIN_MATCH === 0.6);
record("Probe 4: matchDimensions exportiert", "function",
       typeof M.matchDimensions, typeof M.matchDimensions === "function");
record("Probe 4: DimensionsAllNullError exportiert", "function",
       typeof M.DimensionsAllNullError, typeof M.DimensionsAllNullError === "function");

let allOk = true;
console.log("\n=== Bau 04.A matchDimensions Smoke-Test ===");
for (const r of results) {
  const mark = r.ok ? "✓" : "✗";
  console.log(`${mark} ${r.probe}\n   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
  if (!r.ok) allOk = false;
}
console.log(`\nTotal: ${results.length} Proben, ${results.filter(r => r.ok).length} grün, ${results.filter(r => !r.ok).length} rot.`);
if (!allOk) process.exit(1);
