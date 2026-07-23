// Headless smoke test für den zentrierten (whitened-light) Verwandtschafts-Score
// in Modul 04 (relatedness/isRelated, 2026-06-28). Run:
//   node tests/smoke_bau04e_relatedness.mjs
//
// Beweist an den ECHTEN committeten Knoten-Domänen-Vektoren:
//  1. relatedness() trennt echte Verwandtschaft (Schwestern, Essen/Trinken)
//     SAUBER von unverwandten Hub<->Endknoten-Paaren — anders als der rohe
//     match()-Cosinus, der alles in den Anisotropie-Boden ~0.82 quetscht.
//  2. isRelated() folgt RELATEDNESS_MIN.
//  3. Der GATE-Pfad ist UNVERÄNDERT: match() = roher Cosinus (alle Hub<->Endknoten
//     bleiben >= 0.80, der Andock bricht NICHT), isAboveProviderThreshold(0.80)=true.
//  4. relatedness ist symmetrisch und self=1.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;
const src = readFileSync(resolve(repoRoot, "src/modules/04_match.js"), "utf8");
new Function("global", "window", "globalThis", "console", src)(
  globalThis, globalThis, globalThis, console,
);
const M = globalThis.SbkimMatch;

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log("  ✓ " + msg); }
  else { fail++; console.log("  ✗ " + msg); }
}
function approx(a, b, eps = 1e-4) { return Math.abs(a - b) <= eps; }

// Echte Knoten-Domänen-Vektoren (gleiche Quelle wie tools/match_baseline.mjs).
const SOURCES = {
  Sage: "sbkim/spore.json",
  Rezeptbuch: "sbkim/rezeptbuch_inbox.json",
  Mixarium: "sbkim/mixarium_inbox.json",
  Point: "sbkim/point_inbox.json",
  Jason: "sbkim/jason_inbox.json",
  MeinTresor: "sbkim/meintresor_inbox.json",
  BookLedger: "sbkim/bookledgerpro_inbox.json",
};
const V = {};
for (const [k, f] of Object.entries(SOURCES)) {
  try {
    const j = JSON.parse(readFileSync(join(repoRoot, f), "utf8"));
    if (Array.isArray(j.domainVector) && j.domainVector.length === 384) {
      V[k] = new Float32Array(j.domainVector);
    }
  } catch { /* fehlt -> überspringen */ }
}
const have = Object.keys(V);
console.log("Relatedness-Smoke — " + have.length + " echte Vektoren: " + have.join(", ") + "\n");

// Echte Verwandtschaften (Belege: Schwestern wortgleich; Essen/Trinken).
const REAL = [["Jason", "MeinTresor"], ["Mixarium", "Rezeptbuch"]];
// Unverwandte Hub<->Endknoten-Paare (Boden der relatedness, unabhängig vom
// Andock-match()). ALLE vier liegen unter RELATEDNESS_MIN — das prüft Probe 1.
const FLOOR = [["BookLedger", "Sage"], ["Rezeptbuch", "Sage"], ["Mixarium", "Sage"], ["Point", "Sage"]];
// GATE-Regression (Probe 2): nach der v0.2-Re-Sign-Welle (A10, 2026-07-14) trennt
// der rohe match() Werkzeug-/Infrastruktur-Knoten von Inhalts-Knoten NACH BEDEUTUNG:
//   • Werkzeug-/Hub-nah handshaked WEITER (>= 0.80): BookLedger 0.856, Point 0.871.
//   • Inhalts-Knoten (Koch/Getränke) fielen KORREKT unter den Boden (< 0.80,
//     „verified-spore" statt „verified-match"): Rezeptbuch 0.792, Mixarium 0.767.
// Das ist gewolltes Protokoll-Verhalten (siehe PLAN A10 / status.json), kein
// Regress — der Andock-Riegel selbst (0.80) bleibt unverändert.
const GATE_ABOVE = [["BookLedger", "Sage"], ["Point", "Sage"]];
const GATE_BELOW = [["Rezeptbuch", "Sage"], ["Mixarium", "Sage"]];

function has(p) { return V[p[0]] && V[p[1]]; }

console.log("Probe 1 — relatedness() trennt echt von Boden");
let realScores = [], floorScores = [];
for (const [a, b] of REAL) if (has([a, b])) {
  const r = M.relatedness(V[a], V[b]); realScores.push(r);
  ok(r >= 0.5, `echt verwandt ${a}<->${b}: relatedness ${r.toFixed(4)} >= 0.50`);
  ok(M.isRelated(r) === true, `isRelated(${r.toFixed(4)}) === true`);
}
for (const [a, b] of FLOOR) if (has([a, b])) {
  const r = M.relatedness(V[a], V[b]); floorScores.push(r);
  ok(r < M.RELATEDNESS_MIN, `Boden ${a}<->${b}: relatedness ${r.toFixed(4)} < RELATEDNESS_MIN (${M.RELATEDNESS_MIN})`);
  ok(M.isRelated(r) === false, `isRelated(${r.toFixed(4)}) === false`);
}
if (realScores.length && floorScores.length) {
  ok(Math.min(...realScores) > Math.max(...floorScores),
    `klarer Spalt: min(echt) ${Math.min(...realScores).toFixed(4)} > max(Boden) ${Math.max(...floorScores).toFixed(4)}`);
}

console.log("\nProbe 2 — GATE-Pfad unverändert (Andock-Riegel 0.80 bleibt, match() nach Bedeutung)");
for (const [a, b] of GATE_ABOVE) if (has([a, b])) {
  const raw = M.match(V[a], V[b]);
  ok(raw >= 0.80, `Werkzeug/Hub-nah ${a}<->${b} = ${raw.toFixed(4)} >= 0.80 (handshaked weiter)`);
  ok(M.isAboveProviderThreshold(raw) === true, `isAboveProviderThreshold(${raw.toFixed(4)}) === true`);
}
for (const [a, b] of GATE_BELOW) if (has([a, b])) {
  const raw = M.match(V[a], V[b]);
  ok(raw < 0.80, `Inhalts-Knoten ${a}<->${b} = ${raw.toFixed(4)} < 0.80 (korrekt verified-spore, A10)`);
  ok(M.isAboveProviderThreshold(raw) === false, `isAboveProviderThreshold(${raw.toFixed(4)}) === false`);
}
ok(M.isAboveProviderThreshold(0.80) === true, "isAboveProviderThreshold(0.80) === true (Schwelle unverändert 0.80)");
ok(M.isAboveProviderThreshold(0.7999) === false, "isAboveProviderThreshold(0.7999) === false");
ok(M._meta.providerMinMatch === 0.80, "_meta.providerMinMatch === 0.80 (unverändert)");

console.log("\nProbe 3 — relatedness Eigenschaften (Symmetrie, self=1)");
if (V.Sage) {
  ok(approx(M.relatedness(V.Sage, V.Sage), 1.0), "self-relatedness(Sage) ≈ 1.0");
}
if (has(["BookLedger", "Sage"])) {
  ok(approx(M.relatedness(V.BookLedger, V.Sage), M.relatedness(V.Sage, V.BookLedger)),
    "relatedness symmetrisch (a,b) == (b,a)");
}
ok(typeof M.RELATEDNESS_MIN === "number" && M.RELATEDNESS_MIN > 0, "RELATEDNESS_MIN exponiert (> 0)");
ok(M._meta.relatednessCentered === true, "_meta.relatednessCentered === true");

console.log("\nProbe 4 — Validierung (falsche Eingabe wirft)");
let threw = false;
try { M.relatedness([1, 2, 3], V.Sage); } catch (e) { threw = (e.name === "InvalidVectorError"); }
ok(threw, "relatedness wirft InvalidVectorError bei Nicht-Float32Array");

console.log(`\n— ${pass} bestanden, ${fail} fehlgeschlagen —`);
process.exit(fail === 0 ? 0 : 1);
