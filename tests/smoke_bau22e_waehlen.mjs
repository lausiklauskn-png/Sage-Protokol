// Headless smoke test für die „Wählen"-UI in Modul 22 (Such-Widget):
// der Umschalter „verbunden" (grob) ↔ „verwandt" (genau). Run:
//   node tests/smoke_bau22e_waehlen.mjs
//
// Geprüft wird die REINE Sortier-/Filter-Funktion SbkimSearchWidget.rankView()
// an den ECHTEN committeten Knoten-Domänen-Vektoren (gleiche Quelle wie
// smoke_bau04e_relatedness.mjs):
//  1. mode "verbunden" → Liste UNVERÄNDERT (gewohnte rohe Reihenfolge).
//  2. mode "verwandt"  → echte Verwandte (Schwestern / Essen-Trinken) nach oben,
//     fremde Domänen (Sage↔BLP) nach unten; relatednessOnly blendet sie ganz aus.
//  3. Fail-soft: ohne queryVec / ohne Treffer-passageVec → degradiert sauber.
//  4. Andock-Pfad UNBERÜHRT: match()/PROVIDER_MIN_MATCH bleiben, was sie waren.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;

// Modul 04 (real) + Modul 22 laden. rankView ist DOM-frei → kein DOM-Stub nötig.
for (const f of ["src/modules/04_match.js", "src/modules/22_such_widget.js"]) {
  const src = readFileSync(resolve(repoRoot, f), "utf8");
  new Function("global", "window", "globalThis", "console", src)(
    globalThis, globalThis, globalThis, console,
  );
}
const M = globalThis.SbkimMatch;
const W = globalThis.SbkimSearchWidget;

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log("  ✓ " + msg); }
  else { fail++; console.log("  ✗ " + msg); }
}

// Echte Knoten-Domänen-Vektoren (gleiche Quelle wie smoke_bau04e).
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
console.log("Wählen-UI-Smoke — " + have.length + " echte Vektoren: " + have.join(", ") + "\n");

// Surface da?
console.log("Probe 0 — Surface");
ok(typeof W.rankView === "function", "rankView ist eine Funktion");
ok(typeof W.setViewMode === "function", "setViewMode ist eine Funktion");
ok(typeof W.getViewMode === "function", "getViewMode ist eine Funktion");
ok(typeof W.setRelatedOnly === "function", "setRelatedOnly ist eine Funktion");
ok(W._meta.viewMode === "verbunden", "Default-Sicht = 'verbunden' (grob)");
ok(W._meta.relatedOnly === false, "Default relatedOnly = false");

// Treffer mit Inhalts-Vektor. Query = Mixarium (Getränke). Erwartung im
// "verwandt"-Modus: Rezeptbuch (Schwester, Essen↔Trinken) oben + isRelated;
// Sage (Hub) + BookLedger (Buchhaltung) unverwandt → unten / ausgeblendet.
function makeTreffer(name, score) {
  return { label: name, score: score, anchorId: "n:" + name, source: "knoten", passageVec: V[name] };
}

if (V.Mixarium && V.Rezeptbuch && V.Sage && V.BookLedger) {
  const queryVec = V.Mixarium;
  // Roh-Reihenfolge bewusst „falsch" (fremde oben), damit Umsortieren sichtbar wird.
  const treffer = [
    makeTreffer("Sage", 0.84),
    makeTreffer("BookLedger", 0.83),
    makeTreffer("Rezeptbuch", 0.82),
  ];

  console.log("\nProbe 1 — 'verbunden' lässt die Liste unverändert");
  const grob = W.rankView(treffer, queryVec, { mode: "verbunden" });
  ok(grob.length === 3, "alle drei Treffer bleiben (kein Filter)");
  ok(grob[0].label === "Sage" && grob[2].label === "Rezeptbuch",
    "Reihenfolge unverändert (Sage … Rezeptbuch)");
  ok(grob[0].relatedness === undefined, "kein relatedness-Feld im grob-Modus angehängt");

  console.log("\nProbe 2 — 'verwandt' sortiert echte Verwandte nach oben");
  const genau = W.rankView(treffer, queryVec, { mode: "verwandt" });
  ok(genau.length === 3, "ohne relatedOnly bleiben alle drei (nur umsortiert)");
  ok(genau[0].label === "Rezeptbuch", "Schwester Rezeptbuch steht oben");
  ok(genau[0].isRelated === true, "Rezeptbuch ist isRelated === true");
  const others = genau.slice(1).map(t => t.label).sort();
  ok(others[0] === "BookLedger" && others[1] === "Sage", "Sage + BookLedger darunter");
  ok(genau.every((t, i) => i === 0 || t.isRelated === false),
    "die fremden Domänen sind isRelated === false");
  ok(typeof genau[0].relatedness === "number", "relatedness-Wert angehängt (Anzeige-Badge)");

  console.log("\nProbe 3 — 'nur verwandte' blendet Fremde aus");
  const nurVerwandt = W.rankView(treffer, queryVec, { mode: "verwandt", relatedOnly: true });
  ok(nurVerwandt.length === 1, "nur die echte Verwandte bleibt übrig");
  ok(nurVerwandt[0].label === "Rezeptbuch", "und das ist Rezeptbuch");

  console.log("\nProbe 4 — Roh-Treffer unangetastet (reine Anzeige, kopiert)");
  ok(treffer[0].label === "Sage" && treffer.length === 3 && treffer[0].relatedness === undefined,
    "Eingabe-Array wird NICHT mutiert");
} else {
  console.log("Proben 1-4 übersprungen (Referenz-Vektoren fehlen).");
}

console.log("\nProbe 5 — Fail-soft");
const dummy = [{ label: "A", score: 0.9, passageVec: V.Sage || new Float32Array(384) }];
const noVec = W.rankView(dummy, null, { mode: "verwandt" });
ok(noVec.length === 1 && noVec[0].label === "A", "ohne queryVec → Liste unverändert (degradiert auf grob)");
const noPassage = W.rankView([{ label: "B", score: 0.9 }], V.Sage || new Float32Array(384), { mode: "verwandt" });
ok(noPassage.length === 1 && noPassage[0].relatedness === null,
  "Treffer ohne passageVec → relatedness null, bleibt in der Liste");
const emptyRes = W.rankView([], V.Sage || new Float32Array(384), { mode: "verwandt" });
ok(Array.isArray(emptyRes) && emptyRes.length === 0, "leere Liste → leer (kein Throw)");

console.log("\nProbe 6 — Andock-Pfad UNBERÜHRT (Regression)");
ok(M.PROVIDER_MIN_MATCH === 0.80, "PROVIDER_MIN_MATCH bleibt 0.80 (Handshake-Boden)");
// Nach der v0.2-Re-Sign-Welle (A10) handshaked ein Werkzeug/Hub-naher Knoten
// weiter (BookLedger<->Sage 0.856 >= 0.80) — der Andock-Riegel ist unberührt,
// „verwandt/verbunden" gatet nichts. (Inhalts-Knoten wie Mixarium fielen KORREKT
// unter 0.80 → verified-spore, siehe Probe 1; das ist gewollt, kein Regress.)
if (V.BookLedger && V.Sage) {
  ok(M.isAboveProviderThreshold(M.match(V.BookLedger, V.Sage)) === true,
    "Werkzeug/Hub-nah match() >= 0.80 → Andock bricht NICHT (Wählen-Umschalter gatet nichts)");
}
ok(M.isAboveProviderThreshold(0.80) === true && M.isAboveProviderThreshold(0.7999) === false,
  "Schwelle unverändert (0.80 → true, 0.7999 → false)");

console.log("\nProbe 7 — setViewMode/getViewMode + Persistenz-Anker");
W.setViewMode("verwandt");
ok(W.getViewMode() === "verwandt", "setViewMode('verwandt') greift");
ok(W._meta.viewMode === "verwandt", "_meta.viewMode spiegelt es");
W.setRelatedOnly(true);
ok(W._meta.relatedOnly === true, "setRelatedOnly(true) greift");
W.setViewMode("verbunden");
W.setRelatedOnly(false);
ok(W.getViewMode() === "verbunden" && W._meta.relatedOnly === false, "zurückgesetzt auf Default");

console.log("\nProbe 8 — „· KI“: rankView nach KI-Urteil (kiByKey) statt Cosinus");
// Drei Treffer; das KI-Urteil dreht die Reihenfolge gegenüber dem rohen Score um
// und liefert das passt-Flag (isRelated). REINE Anzeige — gatet nichts.
const kiTreffer = [
  { label: "Alpha", score: 0.91, anchorId: "n:Alpha" },
  { label: "Beta",  score: 0.88, anchorId: "n:Beta" },
  { label: "Gamma", score: 0.85, anchorId: "n:Gamma" },
];
const kiByKey = {
  "n:Alpha|Alpha": { score: 0.20, passt: false, begruendung: "Anderes Thema." },
  "n:Beta|Beta":   { score: 0.95, passt: true,  begruendung: "Genau verwandt." },
  "n:Gamma|Gamma": { score: 0.60, passt: true },
};
const kiRanked = W.rankView(kiTreffer, null, { mode: "verwandt", kiByKey: kiByKey });
ok(kiRanked.length === 3, "alle drei bleiben (ohne relatedOnly)");
ok(kiRanked[0].label === "Beta", "höchster KI-Score (Beta) steht oben");
ok(kiRanked[2].label === "Alpha", "niedrigster KI-Score (Alpha) steht unten");
ok(kiRanked[0].kiJudged === true, "kiJudged-Flag gesetzt (Anzeige: „· KI“)");
ok(Math.abs(kiRanked[0].relatedness - 0.95) < 1e-9, "relatedness = KI-Score (nicht Cosinus)");
ok(kiRanked[0].isRelated === true && kiRanked[2].isRelated === false, "isRelated kommt aus passt-Flag");
ok(kiRanked[0].begruendung === "Genau verwandt.", "Begründung aus dem KI-Urteil übernommen");

console.log("\nProbe 9 — „· KI“ mit „nur verwandte“ filtert nach passt");
const kiOnly = W.rankView(kiTreffer, null, { mode: "verwandt", relatedOnly: true, kiByKey: kiByKey });
ok(kiOnly.length === 2, "nur die zwei passt===true bleiben");
ok(kiOnly.map(t => t.label).join(",") === "Beta,Gamma", "Beta + Gamma (Alpha ausgeblendet)");

console.log("\nProbe 10 — „· KI“ fail-soft: fehlendes Urteil → relatedness null, ans Ende");
const kiPartial = { "n:Beta|Beta": { score: 0.95, passt: true } };
const kiGap = W.rankView(kiTreffer, null, { mode: "verwandt", kiByKey: kiPartial });
ok(kiGap[0].label === "Beta", "der einzige beurteilte Treffer steht oben");
ok(kiGap[1].relatedness === null && kiGap[2].relatedness === null, "unbeurteilte → relatedness null");
ok(kiTreffer[0].relatedness === undefined, "Eingabe-Array NICHT mutiert (reine Anzeige)");

console.log("\nProbe 11 — Surface „· KI“");
ok(typeof W.setKiRelated === "function", "setKiRelated ist eine Funktion");
ok(typeof W.getKiRelated === "function", "getKiRelated ist eine Funktion");
ok(W._meta.kiRelated === false, "Default kiRelated = false (opt-in)");
W.setKiRelated(true);
ok(W.getKiRelated() === true && W._meta.kiRelated === true, "setKiRelated(true) greift + _meta spiegelt");
ok(W._meta.kiRelatedActive === false, "kiRelatedActive false ohne Schlüssel/Urteil (gatet nichts)");
W.setKiRelated(false);
ok(W.getKiRelated() === false, "zurückgesetzt auf Default (opt-in bleibt opt-in)");

console.log("\nTotal: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
process.exit(fail === 0 ? 0 : 1);
