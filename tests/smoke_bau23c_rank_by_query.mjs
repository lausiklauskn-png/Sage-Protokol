// Headless smoke test für Bau 23.C / A11 — rankCardsByQuery (Auto-Knoten-Auswahl).
// Run: `node tests/smoke_bau23c_rank_by_query.mjs`.
//
// Klaus' Befund 2026-07-11: bei vielen Knoten kann der Nutzer nicht wissen, wen
// er fragen soll. `rankCardsByQuery(cards, queryVec)` rankt die Raum-Karten nach
// Passung des (bereits eingebetteten) QUERY-Vektors zu jedem Karten-domainVector
// (Modul 04 `relatedness`, zentriert). REINE Anzeige/Auswahl — gatet nichts, der
// 0.80-Andock-Riegel bleibt unberührt; fail-soft ohne Vektor → Eingabe-Reihenfolge.
//
// Kein Framework — druckt eine Tabelle, exit non-zero bei Fehler. Echte
// Knoten-Domänen-Vektoren (wie smoke_bau23_rendezvous): Query ≈ Mixarium (Getränke)
// → Schwester Rezeptbuch (Essen) rankt über Hub Sage / BookLedger (unverwandt).
//
// Proben:
//   1) Surface: rankCardsByQuery exportiert + _meta.rankByQueryNote da.
//   2) Ranking: Query≈Mixarium → bester Knoten = Rezeptbuch; queryFit absteigend.
//   3) Eingabe NICHT mutiert (neue Liste; Original-Reihenfolge unverändert).
//   4) Fail-soft ohne Query-Vektor → Eingabe-Reihenfolge, queryFit:null, NICHT sortiert.
//   5) Karte ohne domainVector → queryFit:null, ans Ende sortiert (aber vorhanden).
//   6) Display-only: gatet nichts (schwacher Treffer bleibt in der Liste),
//      PROVIDER_MIN_MATCH (0.80) unberührt.
//   7) opts.raw nutzt rohes match() (Zahl geliefert).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
globalThis.window = globalThis;

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("window", "globalThis", "console", src)(globalThis, globalThis, console);
}
loadModule("src/modules/04_match.js");
loadModule("src/modules/23_rendezvous.js");
const R = globalThis.SbkimRendezvous;
const M = globalThis.SbkimMatch;

// Echte Domänen-Vektoren (gleiche Quellen wie smoke_bau23_rendezvous).
const VEC_SOURCES = {
  Sage: "sbkim/spore.json",
  Rezeptbuch: "sbkim/rezeptbuch_inbox.json",
  Mixarium: "sbkim/mixarium_inbox.json",
  BookLedger: "sbkim/bookledgerpro_inbox.json",
};
const VEC = {};
for (const [k, f] of Object.entries(VEC_SOURCES)) {
  try {
    const j = JSON.parse(readFileSync(join(repoRoot, f), "utf8"));
    if (Array.isArray(j.domainVector) && j.domainVector.length === 384) VEC[k] = j.domainVector;
  } catch { /* fehlt → Probe überspringt */ }
}

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra !== undefined ? "  →  " + extra : "")); }
}
function card(name, vec) { return { nodeId: "id-" + name, nodeName: name, spore: (vec ? { domainVector: vec } : {}) }; }

// ---- Probe 1: Surface ----
console.log("Probe 1: Surface");
ok("rankCardsByQuery exportiert", typeof R.rankCardsByQuery === "function");
ok("_meta.rankByQueryNote da", typeof R._meta.rankByQueryNote === "string" && R._meta.rankByQueryNote.length > 0);

const haveVecs = VEC.Mixarium && VEC.Rezeptbuch && VEC.Sage && VEC.BookLedger;
if (!haveVecs) {
  console.log("  · Domänen-Vektoren fehlen — Ranking-Proben übersprungen (Umgebung ohne inbox-JSONs).");
} else {
  // ---- Probe 2: Ranking (Query≈Mixarium → Rezeptbuch oben) ----
  console.log("Probe 2: Ranking nach Frage-Passung");
  const cards = [card("Sage", VEC.Sage), card("BookLedger", VEC.BookLedger), card("Rezeptbuch", VEC.Rezeptbuch)];
  const ranked = R.rankCardsByQuery(cards, VEC.Mixarium);
  ok("bester Knoten = Rezeptbuch (Schwester)", ranked[0].nodeName === "Rezeptbuch", ranked.map((c) => c.nodeName).join(","));
  ok("alle tragen numerischen queryFit", ranked.every((c) => typeof c.queryFit === "number"));
  ok("queryFit absteigend sortiert", ranked[0].queryFit >= ranked[1].queryFit && ranked[1].queryFit >= ranked[2].queryFit,
    ranked.map((c) => c.queryFit.toFixed(3)).join(","));

  // ---- Probe 3: Eingabe nicht mutiert ----
  console.log("Probe 3: Eingabe nicht mutiert");
  const inp = [card("Sage", VEC.Sage), card("Rezeptbuch", VEC.Rezeptbuch)];
  const before = inp.map((c) => c.nodeName).join(",");
  R.rankCardsByQuery(inp, VEC.Mixarium);
  ok("Original-Reihenfolge unverändert", inp.map((c) => c.nodeName).join(",") === before, before);
  ok("Original-Karte ohne queryFit-Feld", inp[0].queryFit === undefined);

  // ---- Probe 6: display-only, gatet nichts ----
  console.log("Probe 6: display-only — gatet nichts, 0.80 unberührt");
  ok("alle Karten bleiben in der Ausgabe (kein Filtern)", ranked.length === 3);
  ok("PROVIDER_MIN_MATCH bleibt 0.80", M._meta.providerMinMatch === 0.8, String(M._meta.providerMinMatch));

  // ---- Probe 7: opts.raw ----
  console.log("Probe 7: opts.raw (rohes match)");
  const rawRanked = R.rankCardsByQuery(cards, VEC.Mixarium, { raw: true });
  ok("raw liefert numerischen queryFit", rawRanked.every((c) => typeof c.queryFit === "number"));
}

// ---- Probe 4: fail-soft ohne Query-Vektor ----
console.log("Probe 4: fail-soft ohne Query-Vektor");
{
  const cards = [card("A", VEC.Sage || [1, 2, 3]), card("B", VEC.Rezeptbuch || [4, 5, 6])];
  const out = R.rankCardsByQuery(cards, null);
  ok("Eingabe-Reihenfolge erhalten (A,B)", out.map((c) => c.nodeName).join(",") === "A,B", out.map((c) => c.nodeName).join(","));
  ok("queryFit:null", out.every((c) => c.queryFit === null));
}

// ---- Probe 5: Karte ohne domainVector → null, ans Ende ----
if (haveVecs) {
  console.log("Probe 5: Karte ohne domainVector");
  const cards = [card("Ohne", null), card("Rezeptbuch", VEC.Rezeptbuch), card("Sage", VEC.Sage)];
  const out = R.rankCardsByQuery(cards, VEC.Mixarium);
  ok("Karte ohne Vektor hat queryFit:null", out.find((c) => c.nodeName === "Ohne").queryFit === null);
  ok("Karte ohne Vektor steht zuletzt", out[out.length - 1].nodeName === "Ohne", out.map((c) => c.nodeName).join(","));
  ok("bleibt in der Liste (nicht entfernt)", out.length === 3);
}

console.log("\nTotal: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
process.exit(fail === 0 ? 0 : 1);
