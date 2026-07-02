// Headless-Smoke für die App-Integration A1 (Hybrid BM25+Vektor) + A4
// (Query-Expansion / Multi-Query) in Modul 22 (Such-Widget). Run:
//   node tests/smoke_bau22f_app_integration.mjs
//
// Beweist, dass die widget-interne Sortiermaschine (queryCorpus → runMultiSearch)
// jetzt den HYBRID- + MULTI-QUERY-Pfad von Modul 04 nutzt, statt des reinen
// Cosinus-queryLocal. Sichtbar gemacht als CROSS-PHRASING-RETTUNG:
//   Frage „torte" ↔ Doku „kuchen" — ohne gemeinsames Token, Cosinus unter dem
//   0.80-Boden. Reiner queryLocal SCHLIESST den Treffer AUS; A4 bildet die
//   Variante „kuchen" (app-eigene Synonym-Karte), A1s BM25 nimmt sie auf → der
//   Treffer erscheint. Reine Anzeige-/Vorfilter-Verbesserung; 0.80-Andock-Riegel
//   (Modul 05) unberührt, kein PROTOCOL_VERSION-Bump.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;

const DIM = 384;
// Deterministisches Fake-Embedding: Query = e0, alle Doku-Vektoren = e1 →
// Cosinus 0 < 0.80. So kann NUR der lexikalische (BM25-)Pfad einen Treffer
// aufnehmen — genau der Punkt, den A1 rettet.
function unit(i) { const v = new Float32Array(DIM); v[i] = 1; return v; }
globalThis.SbkimEmbedding = {
  embedQuery: async () => unit(0),
  embedPassage: async () => unit(1),
  embedPassageBatch: async (texts) => texts.map(() => unit(1)),
};

// Modul 04 (real) + Modul 22 laden.
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

// Korpus: ein Doku-Eintrag, dessen TEXT das Wort „kuchen" trägt, aber NICHT
// „torte". passageVec = e1 (orthogonal zum Query-Vektor → Cosinus 0).
const CORPUS = [
  { label: "Erdbeer-Rezept", text: "kuchen mit frischen erdbeeren", anchorId: "rez-1", passageVec: unit(1) },
  { label: "Wespen-Tipp", text: "hausmittel gegen wespen am tisch", anchorId: "tip-1", passageVec: unit(1) },
];

console.log("App-Integration-Smoke A1+A4 — Cross-Phrasing-Rettung\n");

// ---- Probe 0 — Surface / Verdrahtungs-Marker ----
console.log("Probe 0 — Surface & Marker");
ok(typeof M.queryLocalMulti === "function", "Modul 04 queryLocalMulti vorhanden");
ok(typeof M.expandQuerySimple === "function", "Modul 04 expandQuerySimple vorhanden");
ok(W._meta.hybridPrefilter === true, "_meta.hybridPrefilter === true (A1 verdrahtet)");
ok(W._meta.queryExpand === true, "_meta.queryExpand === true (A4 Default an)");
ok(W._meta.synonymCount > 0, "_meta.synonymCount > 0 (app-eigene Synonym-Karte)");

// ---- Kontrolle: reiner queryLocal (Einzel-Frage, hybrid) findet „torte" NICHT ----
console.log("\nKontrolle — reiner Einzel-queryLocal (hybrid)");
const single = await M.queryLocal("torte", 5, { corpus: CORPUS, hybrid: true });
ok(single.length === 0, "queryLocal('torte', hybrid) rettet nichts (kein Token 'torte', Cosinus < 0.80)");

// ---- Probe 1 — Spy: nutzt die Sortiermaschine queryLocalMulti + hybrid? ----
console.log("\nProbe 1 — Sortiermaschine ruft queryLocalMulti mit hybrid+Varianten");
const calls = { multi: [], single: [] };
const realMulti = M.queryLocalMulti.bind(M);
const realSingle = M.queryLocal.bind(M);
M.queryLocalMulti = function (queries, k, opts) { calls.multi.push({ queries, opts }); return realMulti(queries, k, opts); };
M.queryLocal = function (text, k, opts) { calls.single.push({ text, opts }); return realSingle(text, k, opts); };

await W.init({ areas: { app: true, knoten: false, internet: false } });
W.setCorpus(CORPUS);

const res = await W.search("torte");
ok(calls.multi.length >= 1, "queryLocalMulti wurde aufgerufen (Multi-Query-Pfad, nicht Einzel)");
const lastMulti = calls.multi[calls.multi.length - 1] || {};
ok(lastMulti.opts && lastMulti.opts.hybrid === true, "queryLocalMulti erhielt options.hybrid === true (A1)");
ok(Array.isArray(lastMulti.queries) && lastMulti.queries.indexOf("kuchen") >= 0,
   "Varianten enthalten die Synonym-Expansion 'kuchen' (A4)");
ok(Array.isArray(lastMulti.queries) && lastMulti.queries[0] === "torte",
   "Original-Frage 'torte' bleibt erste Variante");

// ---- Probe 2 — die Rettung ist im Ergebnis sichtbar ----
console.log("\nProbe 2 — Cross-Phrasing-Rettung im Suchergebnis");
const labels = (res.treffer || []).map((t) => t.label);
ok(labels.indexOf("Erdbeer-Rezept") >= 0,
   "Erdbeer-Rezept (Text 'kuchen') erscheint für Frage 'torte' — gerettet");
const rescued = (res.treffer || []).find((t) => t.label === "Erdbeer-Rezept");
ok(rescued && rescued.source === "app", "Treffer trägt Quelle 'app'");
ok(rescued && rescued.text === "kuchen mit frischen erdbeeren", "Bedeutungs-Text aus dem Korpus erhalten");
ok(rescued && rescued.passageVec instanceof Float32Array, "passageVec durchgereicht (für 'verwandt'-Sicht)");

// ---- Probe 3 — fail-soft: A4 abschaltbar, kein Regress ----
console.log("\nProbe 3 — A4 abschaltbar (queryExpand:false) → nur [query]");
calls.multi.length = 0;
await W.init({ queryExpand: false });
await W.search("torte");
const off = calls.multi[calls.multi.length - 1] || {};
ok(off.queries && off.queries.length === 1 && off.queries[0] === "torte",
   "queryExpand:false → genau eine Variante ['torte'] (kein Regress, hybrid bleibt)");
ok(off.opts && off.opts.hybrid === true, "A1 (hybrid) bleibt auch bei A4-aus aktiv");

// ---- Probe 4 — leere Frage / kein Bereich bleibt fail-soft ----
console.log("\nProbe 4 — Leer-Fälle bleiben fail-soft");
await W.init({ queryExpand: true });
const empty = await W.search("   ");
ok(empty.mode === "leer" && empty.treffer.length === 0, "Leere Frage → mode 'leer', keine Treffer, kein Wurf");

// Spy zurückbauen (Hygiene).
M.queryLocalMulti = realMulti;
M.queryLocal = realSingle;

console.log("\n" + (fail === 0 ? "ALLE GRÜN" : "FEHLER") + " — " + pass + " ok, " + fail + " fail");
if (fail > 0) process.exit(1);
