// Headless smoke test fuer A16 — den Lernenden Sortierer in Modul 22 (Such-Widget).
// Run:  node tests/smoke_bau22g_lern_reranker.mjs
//
// Geprueft werden die REINEN Funktionen SbkimSearchWidget.computeRerankerModel()
// + .learnedRerank() (display-only Re-Ranker, on-device, aus der Merkliste + den
// Treffer-Bewertungen):
//   1. Surface + Kalt-Start = Identitaet (leeres/kein Modell -> Eingabe-Reihenfolge).
//   2. Nach einem Pin wird ein passender Kandidat sichtbar hochgenudged.
//   3. Nudge, kein Umbruch: begrenzter Aufstieg; entfernt nichts (gleiche Menge).
//   4. Fail-soft bei kaputten/fehlenden Gewichten -> Identitaet, kein Throw.
//   5. Quell-Signal (source) wirkt zusaetzlich zum Token-Signal.
//   6/7. Phase B: Bewertung (gut/okay/nein) fliesst gestuft ins Modell.
//   8/9. Negatives Signal (nein) senkt den Treffer, begrenzt.
//
// Modul 04/05 + 0.80-Riegel werden NICHT beruehrt (reine Anzeige). Modul 22 ist fuer
// diese Funktionen DOM-frei -> kein DOM-Stub, keine localStorage noetig (Modell wird
// via opts.model direkt uebergeben; feedback als 2. Argument von computeRerankerModel).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;

const src = readFileSync(resolve(repoRoot, "src/modules/22_such_widget.js"), "utf8");
new Function("global", "window", "globalThis", "console", src)(
  globalThis, globalThis, globalThis, console,
);
const W = globalThis.SbkimSearchWidget;

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log("  OK  " + msg); }
  else { fail++; console.log("  XX  " + msg); }
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

// Kandidatenliste (roh, in Cosinus-Reihenfolge). Fall aus dem Brief: erfrischend.
function candidates() {
  return [
    { label: "Melya",          text: "warmer Honig-Kaffee",              source: "app", score: 0.83 },
    { label: "Kraeuter-Nektar", text: "suesser Kraeuteraufguss",         source: "app", score: 0.82 },
    { label: "Minz-Limonade",  text: "erfrischende kuehle Minze Zitrone", source: "app", score: 0.81 },
    { label: "Gurken-Cooler",  text: "erfrischend kuehl mit Gurke",       source: "app", score: 0.81 },
    { label: "Ingwer-Shot",    text: "scharfer Ingwer pur",              source: "app", score: 0.80 },
  ];
}

// ---- Probe 1 — Kalt-Start = Identitaet ----
console.log("\nProbe 1 — Kalt-Start = Identitaet");
const cold = candidates();
const coldEmpty = W.learnedRerank(cold, { model: { v: 1, tokens: {}, sources: {}, n: 0 } });
ok(ids(coldEmpty) === ids(cold), "leeres Modell -> Reihenfolge unveraendert");
ok(coldEmpty[0] === cold[0] && coldEmpty[2] === cold[2], "leeres Modell -> gleiche Objekte (Identitaet)");
const coldNull = W.learnedRerank(cold, { model: null });
ok(ids(coldNull) === ids(cold), "model=null -> Reihenfolge unveraendert");
const coldOne = W.learnedRerank([cold[0]], { model: { tokens: { minze: 9 }, sources: {} } });
ok(coldOne.length === 1 && coldOne[0] === cold[0], "Einzel-Element -> unveraendert (nichts zu sortieren)");

// ---- Probe 2 — Nach Pin: passender Kandidat wird hochgenudged ----
console.log("\nProbe 2 — gelerntes Modell nudged passenden Kandidaten hoch");
const merk = {
  "erfrischendes getraenk": [
    { titel: "Minz-Limonade", text: "erfrischende kuehle Minze Zitrone", source: "app" },
  ],
};
const model = W.computeRerankerModel(merk);
ok(model.n === 1, "computeRerankerModel: n === 1 (ein gemerktes Beispiel)");
ok((model.tokens.minze || 0) >= 1, "Modell hat Token minze gelernt");
ok((model.tokens.erfrischende || 0) >= 1, "Modell hat Token erfrischende gelernt");
ok(!("und" in model.tokens) && !("mit" in model.tokens), "Stoppwoerter nicht gelernt");

const before = candidates();
const idxMinzeBefore = before.findIndex((t) => t.label === "Minz-Limonade"); // 2
const ranked = W.learnedRerank(before, { model });
const idxMinzeAfter = ranked.findIndex((t) => t.label === "Minz-Limonade");
console.log("    vorher:  " + ids(before));
console.log("    nachher: " + ids(ranked));
ok(idxMinzeAfter < idxMinzeBefore, "Minz-Limonade steigt auf (Nudge nach oben)");
ok(idxMinzeAfter <= 1, "Minz-Limonade nun oben (<= Platz 2)");
const boosted = ranked.find((t) => t.label === "Minz-Limonade");
ok(typeof boosted.rerankBoost === "number" && boosted.rerankBoost > 0, "Diagnose rerankBoost > 0 am Treffer");

// ---- Probe 3 — Nudge, kein Umbruch ----
console.log("\nProbe 3 — Nudge, kein Umbruch");
ok(ranked.length === before.length, "Menge unveraendert — nichts entfernt, nichts hinzugefuegt");
const sameSet = before.every((t) => ranked.some((r) => r.label === t.label));
ok(sameSet, "alle Original-Treffer noch vorhanden (Mitgliedschaft unberuehrt)");
let maxRise = 0;
before.forEach((t, i) => {
  const j = ranked.findIndex((r) => r.label === t.label);
  if (i - j > maxRise) maxRise = i - j;
});
ok(maxRise <= 3, "kein Treffer steigt mehr als 3 Plaetze (maxRise=" + maxRise + ")");
ok(ranked[ranked.length - 1].label === "Ingwer-Shot", "nicht-passender Schluss-Treffer bleibt unten");

// ---- Probe 4 — Fail-soft bei kaputten Gewichten ----
console.log("\nProbe 4 — Fail-soft bei kaputten/fehlenden Gewichten");
const brokenModels = [
  { tokens: { minze: NaN, gurke: "x", zitrone: -3 }, sources: { app: Infinity } },
  { tokens: null, sources: null },
  { tokens: {}, sources: { app: 2 } },
  "kaputt",
  42,
  {},
];
let noThrow = true;
brokenModels.forEach((bm, i) => {
  try {
    const r = W.learnedRerank(candidates(), { model: bm });
    ok(Array.isArray(r) && r.length === 5, "kaputtes Modell #" + i + " -> valide Liste (5)");
  } catch (e) { noThrow = false; ok(false, "kaputtes Modell #" + i + " warf: " + e.message); }
});
ok(noThrow, "kein Throw bei kaputten Modellen");
const allSameSrc = W.learnedRerank(candidates(), { model: { tokens: {}, sources: { app: 5 } } });
ok(ids(allSameSrc) === ids(candidates()), "gleiche Quelle fuer alle -> Identitaet (kein relativer Boost)");

// ---- Probe 5 — Quell-Signal wirkt zusaetzlich ----
console.log("\nProbe 5 — Quell-Signal (source)");
const mixed = [
  { label: "A-App",    text: "neutraler text eins", source: "app" },
  { label: "B-Knoten", text: "neutraler text zwei", source: "knoten" },
  { label: "C-App",    text: "neutraler text drei", source: "app" },
];
const srcModel = W.computeRerankerModel({
  q: [
    { titel: "irgendein knoten-treffer", text: "x", source: "knoten" },
    { titel: "noch ein knoten-treffer",  text: "y", source: "knoten" },
  ],
});
const srcRanked = W.learnedRerank(mixed, { model: srcModel });
const idxKnotenAfter = srcRanked.findIndex((t) => t.label === "B-Knoten");
console.log("    nachher: " + ids(srcRanked));
ok(idxKnotenAfter < 1, "bevorzugte Quelle knoten wird hochgenudged");

// ---- Probe 6/7 — Phase B: Bewertung gestuft ins Modell ----
console.log("\nProbe 6/7 — Phase B: Bewertung gestuft ins Modell");
ok(typeof W.recordFeedback === "function", "recordFeedback ist eine Funktion");
ok(typeof W.getFeedback === "function", "getFeedback ist eine Funktion");
ok(typeof W.feedbackWeight === "function", "feedbackWeight ist eine Funktion");
ok(W.feedbackWeight("gut") === 2, "feedbackWeight(gut) === 2");
ok(W.feedbackWeight("okay") === 1, "feedbackWeight(okay) === 1");
ok(W.feedbackWeight("nein") === -2, "feedbackWeight(nein) === -2");
ok(W.feedbackWeight("xyz") === 0, "feedbackWeight(unbekannt) === 0");
ok("feedbackCount" in W._meta && "pendingFeedbackCount" in W._meta, "_meta.feedbackCount/pendingFeedbackCount vorhanden");

const fbModel = W.computeRerankerModel({}, {
  "url-a": { rating: "gut",  titel: "Gurken-Cooler", text: "erfrischend kuehl mit Gurke", source: "app" },
  "url-b": { rating: "nein", titel: "Ingwer-Shot",   text: "scharfer Ingwer pur",         source: "app" },
});
ok((fbModel.tokens.gurke || 0) === 2, "sehr gut -> Token gurke Gewicht +2");
ok((fbModel.tokens.ingwer || 0) === -2, "nein -> Token ingwer Gewicht -2 (negativ)");
ok(fbModel.n === 2, "zwei Bewertungs-Beispiele gezaehlt");

// ---- Probe 8 — Negatives Signal senkt den Treffer ----
console.log("\nProbe 8 — negatives Signal senkt den Treffer");
const neg = candidates();
const negModel = W.computeRerankerModel({}, {
  "m": { rating: "nein", titel: "Melya", text: "warmer Honig-Kaffee", source: "app" },
});
const negRanked = W.learnedRerank(neg, { model: negModel });
const idxMelyaAfter = negRanked.findIndex((t) => t.label === "Melya");
console.log("    nachher: " + ids(negRanked));
ok(idxMelyaAfter > 0, "nein-bewertetes Melya sinkt (war Platz 0)");
ok(negRanked.length === neg.length, "Menge unveraendert — nichts entfernt (auch bei Negativ)");
let maxDrop = 0;
neg.forEach((t, i) => { const j = negRanked.findIndex((r) => r.label === t.label); if (j - i > maxDrop) maxDrop = j - i; });
ok(maxDrop <= 3, "kein Treffer sinkt mehr als 3 Plaetze (maxDrop=" + maxDrop + ")");

// ---- Probe 9 — positiv + negativ zusammen ----
console.log("\nProbe 9 — Merkliste (positiv) + Bewertung (negativ) zusammen");
const mixModel = W.computeRerankerModel(
  { q: [{ titel: "Minz-Limonade", text: "erfrischende kuehle Minze Zitrone", source: "app" }] },
  { "m": { rating: "nein", titel: "Melya", text: "warmer Honig-Kaffee", source: "app" } },
);
const mixRanked = W.learnedRerank(candidates(), { model: mixModel });
console.log("    nachher: " + ids(mixRanked));
ok(mixRanked.findIndex((t) => t.label === "Minz-Limonade") < mixRanked.findIndex((t) => t.label === "Melya"),
  "gemerkte Minz-Limonade steht ueber abgewertetem Melya");

// ---- Probe 10 — recordFeedback fail-soft ohne localStorage ----
console.log("\nProbe 10 — recordFeedback/getFeedback fail-soft ohne localStorage");
let fbNoThrow = true;
try {
  W.recordFeedback({ titel: "X", text: "y", source: "app", url: "u" }, "gut");
  W.recordFeedback(null, "gut");
  W.recordFeedback({ titel: "X" }, "xyz");
} catch (e) { fbNoThrow = false; ok(false, "recordFeedback warf: " + e.message); }
ok(fbNoThrow, "recordFeedback wirft nicht ohne localStorage / bei ungueltiger Eingabe");
ok(typeof W.getFeedback() === "object", "getFeedback liefert ein Objekt (ohne LS: leer)");

// ---- Ergebnis ----
console.log("\n" + (fail === 0 ? "ALLE GRUEN" : "ROT") + " — A16 Lern-Reranker: " + pass + " ok, " + fail + " fehlgeschlagen");
process.exit(fail === 0 ? 0 : 1);
