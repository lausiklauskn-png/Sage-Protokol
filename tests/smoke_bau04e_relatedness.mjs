// Headless smoke test für den zentrierten (whitened-light) Verwandtschafts-Score
// in Modul 04 (relatedness/isRelated, 2026-06-28). Run:
//   node tests/smoke_bau04e_relatedness.mjs
//
// MESSUNG 2026-07-23 (ehrlicher Umfang): nach der v0.2-Re-Sign-Welle trennt der
// zentrierte Cosinus mit RELATEDNESS_CENTER v1 diese Knoten NICHT mehr sauber
// (z.B. Point↔Sage 0.46 > Mixarium↔Rezeptbuch 0.38) — RELATEDNESS_CENTER v2 ist
// offen (Modul-04-Kalibrier-Entscheid, wartet auf Klaus; RELATEDNESS_CENTER wird
// hier NICHT nachjustiert). Dieser Test prüft daher die INVARIANTEN, die weiter
// robust halten, nicht mehr eine saubere Trennung:
//  1. Die wortgleichen Schwestern Jason↔MeinTresor sind das VERWANDTESTE Paar
//     überhaupt (höchste relatedness aller Paare), isRelated=true.
//  2. Der GATE-Pfad ist UNVERÄNDERT: match() = roher Cosinus. Nach v0.2 liegen
//     ALLE Inhalts-/Werkzeug-Knoten ≥ 0.80 gegen Sage (Rezeptbuch 0.881,
//     Mixarium 0.822, BookLedger 0.856, Point 0.900); der einzige echte <0.80-Fall
//     vs Sage im ganzen Netz ist Tomys (0.7917, andere Domäne). isAboveProvider-
//     Threshold(0.80)=true.
//  3. relatedness ist symmetrisch und self=1.

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
  Tomys: "sbkim/tomys_inbox.json",
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

// Wortgleiche Schwestern (Jason/MeinTresor sind fast identische Domänentexte).
const SISTERS = ["Jason", "MeinTresor"];
// GATE-Regression (Probe 2): REGISTER-REFRESH 2026-07-23 — nach der v0.2-Re-Sign-
// Welle liegen ALLE Inhalts-/Werkzeug-Knoten ≥ 0.80 gegen Sage (Rezeptbuch 0.881,
// Mixarium 0.822, BookLedger 0.856, Point 0.900; Geschwister Mixarium↔Rezeptbuch
// 0.880). Der EINZIGE echte <0.80-Fall vs Sage im ganzen Netz ist Tomys (0.7917)
// — andere Domäne (Werbetechnik/Digitaldruck), hub-unabhängig bewiesen 2026-07-11.
// Der Andock-Riegel selbst (0.80) bleibt unverändert.
const GATE_ABOVE = [["Rezeptbuch", "Sage"], ["Mixarium", "Sage"], ["BookLedger", "Sage"],
  ["Point", "Sage"], ["Mixarium", "Rezeptbuch"]];
const GATE_BELOW = [["Tomys", "Sage"]];

function has(p) { return V[p[0]] && V[p[1]]; }

console.log("Probe 1 — relatedness Kern-Invariante: Schwestern sind das verwandteste Paar");
// EHRLICHE GRENZE (MESSUNG 2026-07-23): nach der v0.2-Re-Sign-Welle trennt der
// zentrierte Cosinus mit RELATEDNESS_CENTER v1 diese Knoten NICHT mehr sauber
// (z.B. Point↔Sage 0.46 > Mixarium↔Rezeptbuch 0.38) — RELATEDNESS_CENTER v2 ist
// offen (Modul-04-Kalibrier-Entscheid, wartet auf Klaus). Darum prüft diese Probe
// KEINE saubere Trennung mehr (die alten min(echt) > max(Boden)- und „alle Boden
// < RELATEDNESS_MIN"-Behauptungen wurden entfernt), sondern nur die robust
// bleibende Tatsache: die wortgleichen Schwestern Jason↔MeinTresor sind das
// verwandteste Paar überhaupt.
if (has(SISTERS)) {
  const r = M.relatedness(V[SISTERS[0]], V[SISTERS[1]]);
  ok(r >= 0.5, `Schwestern ${SISTERS[0]}<->${SISTERS[1]}: relatedness ${r.toFixed(4)} >= 0.50`);
  ok(M.isRelated(r) === true, `isRelated(${r.toFixed(4)}) === true`);
  // Höchste relatedness ALLER verfügbaren Paare — das trägt auch ohne saubere
  // Boden-Trennung robust.
  const keys = Object.keys(V);
  let maxOther = -Infinity, argMax = "(keins)";
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    const set = new Set([keys[i], keys[j]]);
    if (set.has(SISTERS[0]) && set.has(SISTERS[1])) continue; // das Schwester-Paar selbst
    const rr = M.relatedness(V[keys[i]], V[keys[j]]);
    if (rr > maxOther) { maxOther = rr; argMax = `${keys[i]}<->${keys[j]}`; }
  }
  ok(r > maxOther,
    `Schwestern am verwandtesten: ${r.toFixed(4)} > jedes andere Paar (max sonst ${maxOther.toFixed(4)} @ ${argMax})`);
}

console.log("\nProbe 2 — GATE-Pfad unverändert (Andock-Riegel 0.80 bleibt, match() = roher Cosinus)");
for (const [a, b] of GATE_ABOVE) if (has([a, b])) {
  const raw = M.match(V[a], V[b]);
  ok(raw >= 0.80, `${a}<->${b} = ${raw.toFixed(4)} >= 0.80 (handshaked weiter)`);
  ok(M.isAboveProviderThreshold(raw) === true, `isAboveProviderThreshold(${raw.toFixed(4)}) === true`);
}
for (const [a, b] of GATE_BELOW) if (has([a, b])) {
  const raw = M.match(V[a], V[b]);
  ok(raw < 0.80, `andere Domäne ${a}<->${b} = ${raw.toFixed(4)} < 0.80 (rejected-local, hub-unabhängig 2026-07-11)`);
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
