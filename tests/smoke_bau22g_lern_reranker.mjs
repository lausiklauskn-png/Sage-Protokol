// Headless smoke test für A16 — den „Lernenden Sortierer“ in Modul 22 (Such-Widget).
// Run:  node tests/smoke_bau22g_lern_reranker.mjs
//
// Geprüft werden die REINEN Funktionen SbkimSearchWidget.computeRerankerModel()
// + .learnedRerank() (display-only Re-Ranker, on-device, aus der 📌-Merkliste):
//   1. Surface + Kalt-Start = Identität (leeres/kein Modell → Eingabe-Reihenfolge).
//   2. Nach einem 📌-Pin wird ein passender Kandidat sichtbar HOCHGENUDGED.
//   3. Nudge, kein Umbruch: begrenzter Aufstieg; entfernt NICHTS (gleiche Menge).
//   4. Fail-soft bei kaputten/fehlenden Gewichten → Identität, kein Throw.
//   5. Quell-Signal (source) wirkt zusätzlich zum Token-Signal.
//
// Modul 04/05 + 0.80-Riegel werden NICHT berührt (reine Anzeige). Modul 22 ist für
// diese Funktionen DOM-frei → kein DOM-Stub, keine localStorage nötig (Modell wird
// via opts.model direkt übergeben).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;

// Nur Modul 22 nötig (learnedRerank/computeRerankerModel sind eigenständig).
const src = readFileSync(resolve(repoRoot, "src/modules/22_such_widget.js"), "utf8");
new Function("global", "window", "globalThis", "console", src)(
  globalThis, globalThis, globalThis, console,
);
const W = globalThis.SbkimSearchWidget;

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log("  ✓ " + msg); }
  else { fail++; console.log("  ✗ " + msg); }
}
const ids = (list) => list.map((t) => t.label).join(",");

console.log("A16 Lern-Reranker-Smoke\n");

// ---- Probe 0 — Surface ----
console.log("Probe 0 — Surface");
ok(typeof W.learnedRerank === "function", "learnedRerank ist eine Funktion");
ok(typeof W.computeRerankerModel === "function", "computeRerankerModel ist eine Funktion");
ok(typeof W.trainReranker === "function", "trainReranker ist eine Funktion");
ok(typeof W.getRerankerModel === "function", "getRerankerModel ist eine Funktion");
ok("rerankerReady" in W._meta, "_meta.rerankerReady vorhanden");
ok(W._meta.rerankerTrained === 0, "Kalt: rerankerTrained === 0 (kein Modell in LS)");

// Kandidatenliste (roh, in Cosinus-Reihenfolge). „erfrischend“ — der Fall aus dem Brief.
function candidates() {
  return [
    { label: "Melya",              text: "warmer Honig-Kaffee",            source: "app", score: 0.83 },
    { label: "Kräuter-Nektar",     text: "süßer Kräuteraufguss",           source: "app", score: 0.82 },
    { label: "Minz-Limonade",      text: "erfrischende kühle Minze Zitrone", source: "app", score: 0.81 },
    { label: "Gurken-Cooler",      text: "erfrischend kühl mit Gurke",     source: "app", score: 0.81 },
    { label: "Ingwer-Shot",        text: "scharfer Ingwer pur",            source: "app", score: 0.80 },
  ];
}

// ---- Probe 1 — Kalt-Start = Identität ----
console.log("\nProbe 1 — Kalt-Start = Identität");
const cold = candidates();
const coldEmpty = W.learnedRerank(cold, { model: { v: 1, tokens: {}, sources: {}, n: 0 } });
ok(ids(coldEmpty) === ids(cold), "leeres Modell → Reihenfolge unverändert");
ok(coldEmpty[0] === cold[0] && coldEmpty[2] === cold[2], "leeres Modell → gleiche Objekte (Identität)");
const coldNull = W.learnedRerank(cold, { model: null });
ok(ids(coldNull) === ids(cold), "model=null → Reihenfolge unverändert");
const coldOne = W.learnedRerank([cold[0]], { model: { tokens: { minze: 9 }, sources: {} } });
ok(coldOne.length === 1 && coldOne[0] === cold[0], "Einzel-Element → unverändert (nichts zu sortieren)");

// ---- Probe 2 — Nach 📌-Pin: passender Kandidat wird hochgenudged ----
console.log("\nProbe 2 — gelerntes Modell nudged passenden Kandidaten hoch");
// Merkliste: der Nutzer hat früher „Minz-Limonade“ (erfrischend/Minze) gemerkt.
const merk = {
  "erfrischendes getränk": [
    { titel: "Minz-Limonade", text: "erfrischende kühle Minze Zitrone", source: "app" },
  ],
};
const model = W.computeRerankerModel(merk);
ok(model.n === 1, "computeRerankerModel: n === 1 (ein gemerktes Beispiel)");
ok((model.tokens.minze || 0) >= 1, "Modell hat Token 'minze' gelernt");
ok((model.tokens.erfrischende || 0) >= 1, "Modell hat Token 'erfrischende' gelernt");
ok(!("und" in model.tokens) && !("mit" in model.tokens), "Stoppwörter nicht gelernt");

const before = candidates();
const idxMinzeBefore = before.findIndex((t) => t.label === "Minz-Limonade"); // 2
const ranked = W.learnedRerank(before, { model });
const idxMinzeAfter = ranked.findIndex((t) => t.label === "Minz-Limonade");
console.log("    vorher: " + ids(before));
console.log("    nachher: " + ids(ranked));
ok(idxMinzeAfter < idxMinzeBefore, "„Minz-Limonade“ steigt auf (Nudge nach oben)");
ok(idxMinzeAfter <= 1, "„Minz-Limonade“ nun oben (≤ Platz 2)");
const boosted = ranked.find((t) => t.label === "Minz-Limonade");
ok(typeof boosted.rerankBoost === "number" && boosted.rerankBoost > 0, "Diagnose rerankBoost > 0 am Treffer");

// ---- Probe 3 — Nudge, kein Umbruch (Menge unverändert, Aufstieg begrenzt) ----
console.log("\nProbe 3 — Nudge, kein Umbruch");
ok(ranked.length === before.length, "Menge unverändert — nichts entfernt, nichts hinzugefügt");
const sameSet = before.every((t) => ranked.some((r) => r.label === t.label));
ok(sameSet, "alle Original-Treffer noch vorhanden (Mitgliedschaft unberührt)");
// Aufstieg pro Treffer ≤ RERANK_NUDGE_STRENGTH (3).
let maxRise = 0;
before.forEach((t, i) => {
  const j = ranked.findIndex((r) => r.label === t.label);
  if (i - j > maxRise) maxRise = i - j;
});
ok(maxRise <= 3, "kein Treffer steigt mehr als 3 Plätze (begrenzter Nudge, maxRise=" + maxRise + ")");
// Ein ganz unten stehender, klar nicht-passender Treffer bleibt unten.
ok(ranked[ranked.length - 1].label === "Ingwer-Shot", "nicht-passender Schluss-Treffer bleibt unten");

// ---- Probe 4 — Fail-soft bei kaputten Gewichten ----
console.log("\nProbe 4 — Fail-soft bei kaputten/fehlenden Gewichten");
const brokenModels = [
  { tokens: { minze: NaN, gurke: "x", zitrone: -3 }, sources: { app: Infinity } },
  { tokens: null, sources: null },
  { tokens: {}, sources: { app: 2 } },   // nur Quelle, alle gleiche Quelle → kein relativer Vorteil
  "kaputt",
  42,
  {},
];
let noThrow = true;
brokenModels.forEach((bm, i) => {
  try {
    const r = W.learnedRerank(candidates(), { model: bm });
    ok(Array.isArray(r) && r.length === 5, "kaputtes Modell #" + i + " → valide Liste (5)");
  } catch (e) { noThrow = false; ok(false, "kaputtes Modell #" + i + " warf: " + e.message); }
});
ok(noThrow, "kein Throw bei kaputten Modellen");
// Alle gleiche Quelle + keine Token → keine Bewegung (Identität).
const allSameSrc = W.learnedRerank(candidates(), { model: { tokens: {}, sources: { app: 5 } } });
ok(ids(allSameSrc) === ids(candidates()), "gleiche Quelle für alle → Identität (kein relativer Boost)");

// ---- Probe 5 — Quell-Signal wirkt zusätzlich ----
console.log("\nProbe 5 — Quell-Signal (source)");
const mixed = [
  { label: "A-App",    text: "neutraler text eins", source: "app" },
  { label: "B-Knoten", text: "neutraler text zwei", source: "knoten" },
  { label: "C-App",    text: "neutraler text drei", source: "app" },
];
// Nutzer merkt bevorzugt Knoten-Treffer → Quelle 'knoten' bekommt Gewicht.
const srcModel = W.computeRerankerModel({
  q: [
    { titel: "irgendein knoten-treffer", text: "x", source: "knoten" },
    { titel: "noch ein knoten-treffer",  text: "y", source: "knoten" },
  ],
});
const srcRanked = W.learnedRerank(mixed, { model: srcModel });
const idxKnotenAfter = srcRanked.findIndex((t) => t.label === "B-Knoten");
console.log("    nachher: " + ids(srcRanked));
ok(idxKnotenAfter < 1, "bevorzugte Quelle 'knoten' wird hochgenudged");

// ---- Probe 6 — trainReranker/getRerankerModel ohne localStorage (fail-soft) ----
console.log("\nProbe 6 — trainReranker/getRerankerModel fail-soft ohne localStorage");
let trainNoThrow = true;
try {
  const m = W.trainReranker();          // liest leere Merkliste (kein LS) → leeres Modell
  ok(m && m.n === 0, "trainReranker liefert leeres Modell ohne LS (n=0)");
} catch (e) { trainNoThrow = false; ok(false, "trainReranker warf: " + e.message); }
ok(trainNoThrow, "trainReranker wirft nicht ohne localStorage");
ok(W.getRerankerModel() === null, "getRerankerModel === null ohne gespeichertes Modell");

// ---- Ergebnis ----
console.log("\n" + (fail === 0 ? "✅" : "❌") + " A16 Lern-Reranker: " + pass + " ok, " + fail + " fehlgeschlagen");
process.exit(fail === 0 ? 0 : 1);
