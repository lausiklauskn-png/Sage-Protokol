// Headless smoke test für den zentrierten (whitened-light) Verwandtschafts-Score
// in Modul 04 (relatedness/isRelated, 2026-06-28). Run:
//   node tests/smoke_bau04e_relatedness.mjs
//
// RELATEDNESS_CENTER v2 (2026-07-23, Klaus' Entscheid „V2 bauen"): der Mittelpunkt
// wurde aus den 14 LIVE-v0.2-Domänen-Vektoren neu gemittelt, nachdem die v0.2-Re-
// Sign-Welle die Geometrie verschoben und der v1-Mittelpunkt nicht mehr sauber
// getrennt hatte (Point↔Sage 0.46 > Mixarium↔Rezeptbuch 0.38). Dieser Test prüft
// darum wieder eine ECHTE TRENNUNG — aber nur die, die v2 ehrlich leistet:
//  1. Die engen Schwestern (nahezu gleiche kuratierte Domäne — Jason↔MeinTresor,
//     Rezeptbuch↔Muttis) sind KLAR verwandt (isRelated=true) und die verwandtesten
//     Paare; JEDES übrige Paar liegt unter RELATEDNESS_MIN (isRelated=false), mit
//     großem Rand (Lücke ~0.19..0.78).
//  2. EHRLICHE GRENZE: isRelated==true heißt „klar dieselbe Domäne", NICHT „fach-
//     verwandt". Nachbar-Domänen (Essen↔Trinken, Rezeptbuch↔Mixarium ~0.19) fallen
//     bewusst DARUNTER — das echte Fach-Verwandt-Urteil macht der opt-in KI-Richter
//     (hybridMatch). Der zentrierte Cosinus ist eine RANGFOLGE, kein Urteil.
//  3. Der GATE-Pfad ist UNVERÄNDERT: match() = roher Cosinus. Nach v0.2 liegen
//     ALLE Inhalts-/Werkzeug-Knoten ≥ 0.80 gegen Sage (Rezeptbuch 0.881,
//     Mixarium 0.822, BookLedger 0.856, Point 0.900); der einzige echte <0.80-Fall
//     vs Sage im ganzen Netz ist Tomys (0.7917, andere Domäne). isAboveProvider-
//     Threshold(0.80)=true. RELATEDNESS_CENTER ist REINE Anzeige, gatet NICHTS.
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
  Muttis: "sbkim/muttis_inbox.json",
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
console.log("Relatedness-Smoke (v2-Center) — " + have.length + " echte Vektoren: " + have.join(", ") + "\n");

// Enge Schwestern = nahezu gleiche kuratierte Domäne (fast wortgleiche Domänentexte).
const SISTER_PAIRS = [["Jason", "MeinTresor"], ["Rezeptbuch", "Muttis"]];
function isSisterPair(a, b) {
  return SISTER_PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}
// GATE-Regression (Probe 3): REGISTER-REFRESH 2026-07-23 — nach der v0.2-Re-Sign-
// Welle liegen ALLE Inhalts-/Werkzeug-Knoten ≥ 0.80 gegen Sage (Rezeptbuch 0.881,
// Mixarium 0.822, BookLedger 0.856, Point 0.900; Geschwister Mixarium↔Rezeptbuch
// 0.880). Der EINZIGE echte <0.80-Fall vs Sage im ganzen Netz ist Tomys (0.7917)
// — andere Domäne (Werbetechnik/Digitaldruck), hub-unabhängig bewiesen 2026-07-11.
const GATE_ABOVE = [["Rezeptbuch", "Sage"], ["Mixarium", "Sage"], ["BookLedger", "Sage"],
  ["Point", "Sage"], ["Mixarium", "Rezeptbuch"]];
const GATE_BELOW = [["Tomys", "Sage"]];

function has(p) { return V[p[0]] && V[p[1]]; }

console.log("Probe 1 — ECHTE TRENNUNG (v2): enge Schwestern klar verwandt, alles andere darunter");
// Alle Paare rechnen, in Schwestern vs. Rest teilen.
const keys = Object.keys(V);
const sisterScores = [];
let otherMax = -Infinity, otherArg = "(keins)";
for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
  const a = keys[i], b = keys[j];
  const r = M.relatedness(V[a], V[b]);
  if (isSisterPair(a, b)) sisterScores.push([`${a}<->${b}`, r]);
  else if (r > otherMax) { otherMax = r; otherArg = `${a}<->${b}`; }
}
const sisterMin = sisterScores.length ? Math.min(...sisterScores.map((s) => s[1])) : NaN;
for (const [label, r] of sisterScores) {
  ok(M.isRelated(r) === true, `enge Schwester ${label}: relatedness ${r.toFixed(4)} >= RELATEDNESS_MIN -> isRelated=true`);
}
// Jede enge Schwester liegt über JEDEM anderen Paar (saubere Rangfolge oben).
ok(isFinite(sisterMin) && sisterMin > otherMax,
  `Trennung: schwächste Schwester ${sisterMin.toFixed(4)} > stärkstes anderes Paar ${otherMax.toFixed(4)} (@ ${otherArg})`);
// Und JEDES andere Paar ist unter der Schwelle -> isRelated=false (klare Domänen-Grenze).
ok(otherMax < M.RELATEDNESS_MIN,
  `alle Nicht-Schwester-Paare < RELATEDNESS_MIN ${M.RELATEDNESS_MIN} (max ${otherMax.toFixed(4)}) -> isRelated=false`);
// EHRLICHE GRENZE dokumentiert: die Nachbar-Domäne Essen<->Trinken ist genuin
// verwandt, fällt aber bewusst unter die Schwelle (Urteil -> KI-Richter).
if (has(["Rezeptbuch", "Mixarium"])) {
  const rm = M.relatedness(V.Rezeptbuch, V.Mixarium);
  ok(M.isRelated(rm) === false,
    `ehrliche Grenze: Nachbar-Domäne Rezeptbuch<->Mixarium ${rm.toFixed(4)} < Schwelle (Fach-Urteil = KI-Richter, nicht Cosinus)`);
}

console.log("\nProbe 2 — relatedness Kern-Invariante: engste Schwester ist das verwandteste Paar überhaupt");
if (has(["Jason", "MeinTresor"])) {
  const r = M.relatedness(V.Jason, V.MeinTresor);
  ok(r >= 0.5, `Jason<->MeinTresor: relatedness ${r.toFixed(4)} >= 0.50`);
  let maxOther = -Infinity, argMax = "(keins)";
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    const set = new Set([keys[i], keys[j]]);
    if (set.has("Jason") && set.has("MeinTresor")) continue;
    const rr = M.relatedness(V[keys[i]], V[keys[j]]);
    if (rr > maxOther) { maxOther = rr; argMax = `${keys[i]}<->${keys[j]}`; }
  }
  ok(r > maxOther,
    `Jason<->MeinTresor am verwandtesten: ${r.toFixed(4)} > jedes andere Paar (max sonst ${maxOther.toFixed(4)} @ ${argMax})`);
}

console.log("\nProbe 3 — GATE-Pfad unverändert (Andock-Riegel 0.80 bleibt, match() = roher Cosinus)");
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

console.log("\nProbe 4 — relatedness Eigenschaften (Symmetrie, self=1)");
if (V.Sage) {
  ok(approx(M.relatedness(V.Sage, V.Sage), 1.0), "self-relatedness(Sage) ≈ 1.0");
}
if (has(["BookLedger", "Sage"])) {
  ok(approx(M.relatedness(V.BookLedger, V.Sage), M.relatedness(V.Sage, V.BookLedger)),
    "relatedness symmetrisch (a,b) == (b,a)");
}
ok(typeof M.RELATEDNESS_MIN === "number" && M.RELATEDNESS_MIN > 0, "RELATEDNESS_MIN exponiert (> 0)");
ok(M._meta.relatednessCentered === true, "_meta.relatednessCentered === true");

console.log("\nProbe 5 — Validierung (falsche Eingabe wirft)");
let threw = false;
try { M.relatedness([1, 2, 3], V.Sage); } catch (e) { threw = (e.name === "InvalidVectorError"); }
ok(threw, "relatedness wirft InvalidVectorError bei Nicht-Float32Array");

console.log(`\n— ${pass} bestanden, ${fail} fehlgeschlagen —`);
process.exit(fail === 0 ? 0 : 1);
