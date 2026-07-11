// Headless smoke test für Bau 04.H / B3 — Sicherheits-/Konsequenz-Marke im Richter.
// Run: `node tests/smoke_bau04h_safety_verdict.mjs`.
//
// A4 Teil 2 (Klaus „ok 1.", 2026-07-11): der KI-Richter (hybridMatch/queryLocalJudged)
// wägt zusätzlich SICHERHEIT/KONSEQUENZ — Referenzfall Hund-und-Katze-Permethrin:
// ein thematisch ähnliches, aber schädliches Mittel wird HERABGESTUFT (passt=false +
// sicherheit='gefahr'); Relevantes-mit-Vorbehalt wird MARKIERT (sicherheit='unsicher').
// Alles additiv + fail-soft: fehlt/unbekannt → null, KEIN Verwerfen, PROVIDER_MIN_MATCH
// + Andock-Riegel unberührt. Nur Such-Flächen.
//
// Proben:
//   1. Prompt trägt die Sicherheits-/Konsequenz-Anweisung + Schema nennt sicherheit;
//      _meta-Anker (sicherheitWerte + Note).
//   2. hybridMatch direkt: verdicts tragen normalisiertes sicherheit; attestation auch.
//   3. Referenzfall (queryLocalJudged): 'gefahr'+passt:false wird herabgestuft (zuletzt),
//      Sicheres bleibt oben; Marke reist auf die Kandidaten mit.
//   4. Rückwärts-Kompat: Richter lässt sicherheit weg → judged:true, Marke = null,
//      KEIN Schema-Verwerfen.
//   5. Unbekannter Wert ('giftig') → fail-soft zu null.

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

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra !== undefined ? "  →  " + extra : "")); }
}

// ---- Vektoren (bekannter Cosinus zum Query-Vektor) ----
function makeNormalizedVector(seed) {
  let state = seed >>> 0;
  const next = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return (state / 0xFFFFFFFF) * 2 - 1; };
  const v = new Float32Array(EMBEDDING_DIM); let s = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) { v[i] = next(); s += v[i] * v[i]; }
  const n = Math.sqrt(s); for (let i = 0; i < EMBEDDING_DIM; i++) v[i] /= n; return v;
}
function mixedVec(ref, target, seed) {
  const noise = makeNormalizedVector(seed);
  const a = target, b = Math.sqrt(Math.max(0, 1 - target * target));
  const out = new Float32Array(EMBEDDING_DIM); let s = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) { out[i] = a * ref[i] + b * noise[i]; s += out[i] * out[i]; }
  const n = Math.sqrt(s); for (let i = 0; i < EMBEDDING_DIM; i++) out[i] /= n; return out;
}
const Q = makeNormalizedVector(7);
globalThis.SbkimEmbedding = { embedQuery: async () => Q };

// ---- fetch-Mock (Anthropic-Form) ----
let stubVerdicts = null;
let fetchCalls = 0;
let lastBody = null;
globalThis.fetch = async (url, init) => {
  fetchCalls++;
  lastBody = init && init.body ? String(init.body) : "";
  const text = JSON.stringify({ verdicts: stubVerdicts });
  return {
    ok: true, status: 200, statusText: "",
    json: async () => ({ content: [{ type: "text", text }], usage: { input_tokens: 100, output_tokens: 30 } }),
  };
};
function resetFetch() { stubVerdicts = null; fetchCalls = 0; lastBody = null; }

// Referenzkorpus: Frage „Zecken-/Flohmittel für Hund UND Katze". Drei Treffer
// über dem Boden — Vorfilter-Reihenfolge (Cosinus desc): PERM, SAFE, TICK.
function corpusTiere() {
  return [
    { label: "PERM", anchorId: "perm", text: "permethrin spot-on gegen zecken und floehe", passageVec: mixedVec(Q, 0.95, 401) },
    { label: "SAFE", anchorId: "safe", text: "fipronil praeparat fuer hund und katze vertraeglich", passageVec: mixedVec(Q, 0.90, 402) },
    { label: "TICK", anchorId: "tick", text: "zeckenzange mechanisch entfernen", passageVec: mixedVec(Q, 0.83, 403) },
  ];
}

// ---- Probe 1: Prompt + Schema + _meta ----
console.log("Probe 1: Prompt trägt Sicherheits-Anweisung + Schema + _meta-Anker");
{
  resetFetch();
  stubVerdicts = [
    { passt: false, score: 0.2, sicherheit: "gefahr", begruendung: "fuer Katzen giftig" },
    { passt: true, score: 0.9, sicherheit: "sicher", begruendung: "vertraeglich" },
    { passt: true, score: 0.6, sicherheit: "sicher", begruendung: "mechanisch, harmlos" },
  ];
  await M.queryLocalJudged("floh und zeckenmittel fuer hund und katze", 5, { corpus: corpusTiere(), apiKey: "sk-test" });
  ok("Prompt nennt Sicherheit/Konsequenz", lastBody.indexOf("Sicherheit und Konsequenz") !== -1);
  ok("Prompt nennt das sicherheit-Feld", lastBody.indexOf("sicherheit") !== -1);
  ok("Prompt-Schema listet gefahr/unsicher/sicher", lastBody.indexOf("gefahr") !== -1 && lastBody.indexOf("unsicher") !== -1);
  ok("_meta.sicherheitWerte = [sicher,unsicher,gefahr]", JSON.stringify(M._meta.sicherheitWerte) === JSON.stringify(["sicher", "unsicher", "gefahr"]), JSON.stringify(M._meta.sicherheitWerte));
  ok("_meta.sicherheitNote da", typeof M._meta.sicherheitNote === "string" && M._meta.sicherheitNote.length > 0);
}

// ---- Probe 2: hybridMatch direkt trägt sicherheit + attestation ----
console.log("Probe 2: hybridMatch — verdicts + attestation tragen sicherheit");
{
  resetFetch();
  stubVerdicts = [
    { passt: false, score: 0.2, sicherheit: "gefahr", begruendung: "giftig fuer Katzen" },
    { passt: true, score: 0.9, sicherheit: "unsicher", begruendung: "nur unter Vorbehalt" },
  ];
  const cands = [
    { label: "PERM", text: "permethrin spot-on", cosine: 0.95, anchorId: "perm" },
    { label: "SAFE", text: "fipronil vertraeglich", cosine: 0.90, anchorId: "safe" },
  ];
  const j = await M.hybridMatch({ text: "mittel fuer hund und katze", label: "Tierhalter" }, cands, { apiKey: "sk-test" });
  ok("available:true", j.available === true);
  ok("verdict[0].sicherheit = gefahr", j.verdicts[0].sicherheit === "gefahr", j.verdicts[0].sicherheit);
  ok("verdict[1].sicherheit = unsicher", j.verdicts[1].sicherheit === "unsicher", j.verdicts[1].sicherheit);
  ok("attestation.verdicts[0].sicherheit = gefahr", j.attestation.verdicts[0].sicherheit === "gefahr", j.attestation.verdicts[0].sicherheit);
}

// ---- Probe 3: Referenzfall — Gefahr wird herabgestuft ----
console.log("Probe 3: Permethrin-Fall — 'gefahr'+passt:false wird herabgestuft");
{
  resetFetch();
  // Richter: PERM thematisch top, aber GIFTIG für Katze → passt:false/gefahr.
  // SAFE passt (0.92/sicher). TICK passt (0.7/sicher). Erwartung: SAFE, TICK, PERM.
  stubVerdicts = [
    { passt: false, score: 0.15, sicherheit: "gefahr", begruendung: "Permethrin ist fuer Katzen toxisch" },
    { passt: true, score: 0.92, sicherheit: "sicher", begruendung: "fuer beide vertraeglich" },
    { passt: true, score: 0.70, sicherheit: "sicher", begruendung: "mechanisch, harmlos" },
  ];
  const r = await M.queryLocalJudged("floh und zeckenmittel fuer hund und katze", 5, { corpus: corpusTiere(), apiKey: "sk-test" });
  ok("judged:true", r.judged === true);
  ok("umsortiert zu SAFE, TICK, PERM", JSON.stringify(r.candidates.map((c) => c.label)) === JSON.stringify(["SAFE", "TICK", "PERM"]), JSON.stringify(r.candidates.map((c) => c.label)));
  ok("PERM (Gefahr) steht zuletzt", r.candidates[2].label === "PERM");
  ok("PERM trägt sicherheit:'gefahr' + passt:false", r.candidates[2].sicherheit === "gefahr" && r.candidates[2].passt === false, r.candidates[2].sicherheit + "/" + r.candidates[2].passt);
  ok("PERM-Begründung nennt die Gefahr", /toxisch|giftig|katz/i.test(r.candidates[2].begruendung), r.candidates[2].begruendung);
  ok("Top (SAFE) trägt sicherheit:'sicher'", r.candidates[0].sicherheit === "sicher");
}

// ---- Probe 4: Rückwärts-Kompat — Richter lässt sicherheit weg ----
console.log("Probe 4: Rückwärts-Kompat — fehlendes sicherheit → null, KEIN Verwerfen");
{
  resetFetch();
  stubVerdicts = [
    { passt: true, score: 0.9, begruendung: "passt" },   // KEIN sicherheit-Feld
    { passt: true, score: 0.8, begruendung: "passt" },
    { passt: false, score: 0.2, begruendung: "fremd" },
  ];
  const r = await M.queryLocalJudged("suche", 5, { corpus: corpusTiere(), apiKey: "sk-test" });
  ok("judged:true (Schema akzeptiert ohne sicherheit)", r.judged === true);
  ok("sicherheit auf Kandidaten = null", r.candidates.every((c) => c.sicherheit === null), JSON.stringify(r.candidates.map((c) => c.sicherheit)));
  ok("passt-Sortierung greift weiter", r.candidates[r.candidates.length - 1].passt === false);
}

// ---- Probe 5: unbekannter Wert → fail-soft null ----
console.log("Probe 5: unbekannter sicherheit-Wert → null (fail-soft)");
{
  resetFetch();
  stubVerdicts = [
    { passt: true, score: 0.9, sicherheit: "giftig", begruendung: "unbekannter Marker" },
    { passt: true, score: 0.8, sicherheit: "GEFAHR", begruendung: "Grossschreibung" },
    { passt: true, score: 0.7, sicherheit: 42, begruendung: "kein String" },
  ];
  const r = await M.queryLocalJudged("suche", 5, { corpus: corpusTiere(), apiKey: "sk-test" });
  ok("judged:true", r.judged === true);
  const byLabel = Object.fromEntries(r.candidates.map((c) => [c.label, c]));
  ok("unbekannt 'giftig' → null", byLabel.PERM.sicherheit === null, String(byLabel.PERM.sicherheit));
  ok("'GEFAHR' normalisiert → 'gefahr'", byLabel.SAFE.sicherheit === "gefahr", String(byLabel.SAFE.sicherheit));
  ok("Nicht-String (42) → null", byLabel.TICK.sicherheit === null, String(byLabel.TICK.sicherheit));
}

console.log("\nTotal: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
process.exit(fail === 0 ? 0 : 1);
