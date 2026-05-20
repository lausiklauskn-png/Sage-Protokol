// Headless smoke test for Bau 04.B — explainMatchLLM in Modul 04.
// Run with `node tests/smoke_bau04b_explain_match_llm.mjs`. Modul 04
// ist zustandslos, kein fake-indexeddb nötig. Wir stubben aber fetch
// für die zehn Proben (HTTP 200 mit verschiedenen Bodies, 429, 500,
// TypeError, AbortError). KEIN echter Netz-Aufruf.

import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, writable: false, configurable: true });
}

// Pluggable fetch-Stub. Jede Probe setzt globalThis.fetch neu.
function setFetch(fn) { globalThis.fetch = fn; }

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  // fetch NICHT als Parameter übergeben — Modul 04 soll auf
  // globalThis.fetch (dynamisch ersetzbar) zugreifen, damit setFetch()
  // pro Probe wirkt.
  new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob",
                "TextEncoder", "TextDecoder", src
    )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder);
}

loadModule("src/modules/04_match.js");
const SbkimMatch = globalThis.SbkimMatch;

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

// Helper: produces a valid MatchDimensionsResult-Schein (so that
// validateMatchResultShape() acceptiert ihn).
function fakeMatchResult(overall) {
  return {
    fachlich: overall,
    prozess: overall,
    skalierung: overall,
    overall: overall,
    availableLanes: 2,
    bruecke: null,
  };
}

// Helper: produces a valid LLM-Antwort-Body (Anthropic-API-Form).
function fakeAnthropicResponse(llmJsonObj, usage) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    async json() {
      return {
        content: [{ text: JSON.stringify(llmJsonObj) }],
        usage: usage || null,
      };
    },
  };
}

async function run() {
  // 0) Modul-Exports.
  record("Exports — explainMatchLLM function",
         "function", typeof SbkimMatch.explainMatchLLM,
         typeof SbkimMatch.explainMatchLLM === "function");
  record("Exports — InvalidApiKeyError factory",
         "function", typeof SbkimMatch.InvalidApiKeyError,
         typeof SbkimMatch.InvalidApiKeyError === "function");
  record("Exports — InvalidMatchResultError factory",
         "function", typeof SbkimMatch.InvalidMatchResultError,
         typeof SbkimMatch.InvalidMatchResultError === "function");
  record("_meta.anthropicApiUrl",
         "https://api.anthropic.com/v1/messages",
         SbkimMatch._meta.anthropicApiUrl,
         SbkimMatch._meta.anthropicApiUrl === "https://api.anthropic.com/v1/messages");
  record("_meta.stufeBDefaultModel",
         "claude-sonnet-4",
         SbkimMatch._meta.stufeBDefaultModel,
         SbkimMatch._meta.stufeBDefaultModel === "claude-sonnet-4");

  const validMatchResult = fakeMatchResult(0.85);

  // === Probe 1: HTTP 200 + valides JSON nach Schema ===
  setFetch(async () => fakeAnthropicResponse({
    schichten: {
      fachlich: { score: 0.9, begruendung: "Domänen überlappen stark." },
      prozess: { score: 0.7, begruendung: "Workflows ähnlich." },
      skalierung: { score: 0.4, begruendung: "Unterschiedliche Größe." },
    },
    bruecke: null,
    erklaerung: "Solider Match mit leichter Skalierungs-Differenz.",
    overrideRecommendation: "established",
  }, { input_tokens: 100, output_tokens: 321 }));
  const r1 = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Probe 1 — HTTP 200 valide JSON → available:true",
         "true", String(r1.available), r1.available === true);
  record("Probe 1 — schichten.fachlich.score",
         "0.9", String(r1.schichten.fachlich.score), r1.schichten.fachlich.score === 0.9);
  record("Probe 1 — bruecke null durchgereicht",
         "null", String(r1.bruecke), r1.bruecke === null);
  record("Probe 1 — overrideRecommendation",
         "established", String(r1.overrideRecommendation), r1.overrideRecommendation === "established");
  record("Probe 1 — fallbackScore = matchResult.overall",
         "0.85", String(r1.fallbackScore), r1.fallbackScore === 0.85);
  record("Probe 1 — tokensUsed = input + output",
         "421", String(r1.tokensUsed), r1.tokensUsed === 421);

  // === Probe 2: HTTP 200 + candidateScope:"netz" → still auf "lokal" korrigiert ===
  setFetch(async () => fakeAnthropicResponse({
    schichten: {
      fachlich: { score: 0.5, begruendung: "Teilweise." },
      prozess: { score: 0.6, begruendung: "Mittel." },
      skalierung: { score: 0.3, begruendung: "Schwach." },
    },
    bruecke: {
      needed: "Skalierungs-Pfad",
      lookingFor: "Cloud-Erfahrung",
      candidateScope: "netz",
    },
    erklaerung: "Brücke nötig für skalierung.",
    overrideRecommendation: "established-with-bridge",
  }, { input_tokens: 50, output_tokens: 150 }));
  const r2 = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Probe 2 — available:true mit Brücke",
         "true", String(r2.available), r2.available === true);
  record("Probe 2 — candidateScope:'netz' STILL auf 'lokal' korrigiert (Anti-Missbrauch § 8)",
         "lokal", r2.bruecke ? r2.bruecke.candidateScope : "kein bruecke",
         r2.bruecke && r2.bruecke.candidateScope === "lokal");
  record("Probe 2 — bruecke.needed durchgereicht",
         "Skalierungs-Pfad", r2.bruecke && r2.bruecke.needed,
         r2.bruecke && r2.bruecke.needed === "Skalierungs-Pfad");

  // === Probe 3: HTTP 429 → reason enthält "429" UND "Rate-Limit" ===
  setFetch(async () => ({
    ok: false,
    status: 429,
    statusText: "Too Many Requests",
    async json() { return {}; },
  }));
  const r3 = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Probe 3 — HTTP 429 → available:false (kein Throw)",
         "false", String(r3.available), r3.available === false);
  record("Probe 3 — reason enthält '429' UND 'Rate-Limit'",
         "ja",
         r3.reason && r3.reason.includes("429") && r3.reason.includes("Rate-Limit") ? "ja" : "nein",
         r3.reason && r3.reason.includes("429") && r3.reason.includes("Rate-Limit"));
  record("Probe 3 — fallbackScore = matchResult.overall",
         "0.85", String(r3.fallbackScore), r3.fallbackScore === 0.85);

  // === Probe 4: HTTP 500 → reason enthält "500" ===
  setFetch(async () => ({
    ok: false,
    status: 500,
    statusText: "Internal Server Error",
    async json() { return {}; },
  }));
  const r4 = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Probe 4 — HTTP 500 → available:false (kein Throw)",
         "false", String(r4.available), r4.available === false);
  record("Probe 4 — reason enthält '500'",
         "ja", r4.reason && r4.reason.includes("500") ? "ja" : "nein",
         r4.reason && r4.reason.includes("500"));

  // === Probe 5: TypeError aus fetch → reason enthält "Netz nicht erreichbar" ===
  setFetch(async () => { throw new TypeError("Failed to fetch"); });
  const r5 = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Probe 5 — TypeError fetch → available:false",
         "false", String(r5.available), r5.available === false);
  record("Probe 5 — reason enthält 'Netz nicht erreichbar'",
         "ja", r5.reason && r5.reason.includes("Netz nicht erreichbar") ? "ja" : "nein",
         r5.reason && r5.reason.includes("Netz nicht erreichbar"));

  // === Probe 6: HTTP 200 + LLM-Output kein JSON ===
  setFetch(async () => ({
    ok: true, status: 200, statusText: "OK",
    async json() {
      return {
        content: [{ text: "Das ist kein JSON sondern ein Prosa-Satz." }],
        usage: { input_tokens: 10, output_tokens: 20 },
      };
    },
  }));
  const r6 = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Probe 6 — LLM-Output kein JSON → available:false",
         "false", String(r6.available), r6.available === false);
  record("Probe 6 — reason enthält 'kein valides JSON'",
         "ja", r6.reason && r6.reason.includes("kein valides JSON") ? "ja" : "nein",
         r6.reason && r6.reason.includes("kein valides JSON"));

  // === Probe 7: HTTP 200 + LLM-JSON aber Schema-Mismatch ===
  setFetch(async () => fakeAnthropicResponse({
    schichten: {
      fachlich: { score: 0.5 /* begruendung fehlt */ },
      prozess: { score: 0.5, begruendung: "ok" },
      skalierung: { score: 0.5, begruendung: "ok" },
    },
    bruecke: null,
    erklaerung: "irgendwas",
    overrideRecommendation: null,
  }, null));
  const r7 = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Probe 7 — Schema-Mismatch → available:false",
         "false", String(r7.available), r7.available === false);
  record("Probe 7 — reason enthält 'Schema'",
         "ja", r7.reason && r7.reason.includes("Schema") ? "ja" : "nein",
         r7.reason && r7.reason.includes("Schema"));

  // === Probe 8: Sync-Throw — leerer apiKey ===
  let p8Err = null;
  try {
    await SbkimMatch.explainMatchLLM(validMatchResult, "");
  } catch (e) {
    p8Err = e;
  }
  record("Probe 8 — leerer apiKey → InvalidApiKeyError (sync vor Netz)",
         "InvalidApiKeyError",
         p8Err ? p8Err.name : "kein Throw",
         p8Err && p8Err.name === "InvalidApiKeyError");

  // === Probe 9: Sync-Throw — matchResult ist {} ===
  let p9Err = null;
  try {
    await SbkimMatch.explainMatchLLM({}, "sk-ant-test");
  } catch (e) {
    p9Err = e;
  }
  record("Probe 9 — leeres matchResult → InvalidMatchResultError (sync vor Netz)",
         "InvalidMatchResultError",
         p9Err ? p9Err.name : "kein Throw",
         p9Err && p9Err.name === "InvalidMatchResultError");

  // === Probe 10: AbortError aus fetch → durchgereicht (NICHT abgefangen) ===
  setFetch(async () => {
    const e = new Error("aborted");
    e.name = "AbortError";
    throw e;
  });
  let p10Err = null;
  try {
    await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  } catch (e) {
    p10Err = e;
  }
  record("Probe 10 — AbortError aus fetch → durchgereicht (NICHT abgefangen)",
         "AbortError",
         p10Err ? p10Err.name : "kein Throw",
         p10Err && p10Err.name === "AbortError");

  // === Bonus: Erfolg ohne usage → tokensUsed null ===
  setFetch(async () => fakeAnthropicResponse({
    schichten: {
      fachlich: { score: 0.5, begruendung: "ok" },
      prozess: { score: 0.5, begruendung: "ok" },
      skalierung: { score: 0.5, begruendung: "ok" },
    },
    bruecke: null,
    erklaerung: "ok",
    overrideRecommendation: null,
  }, null /* no usage */));
  const rBonus = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Bonus — usage fehlt → tokensUsed:null (fail-soft)",
         "null", String(rBonus.tokensUsed), rBonus.tokensUsed === null);

  // === Bonus 2: schichten.score außerhalb [-1, 1] → Schema-Mismatch ===
  setFetch(async () => fakeAnthropicResponse({
    schichten: {
      fachlich: { score: 1.5, begruendung: "ok" },
      prozess: { score: 0.5, begruendung: "ok" },
      skalierung: { score: 0.5, begruendung: "ok" },
    },
    bruecke: null,
    erklaerung: "ok",
    overrideRecommendation: null,
  }, null));
  const rBonus2 = await SbkimMatch.explainMatchLLM(validMatchResult, "sk-ant-test");
  record("Bonus 2 — schichten.score=1.5 → available:false (außerhalb [-1,1])",
         "false", String(rBonus2.available), rBonus2.available === false);

  // Print results.
  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) pass++; else fail++;
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} ${r.probe}`);
    if (!r.ok) console.log(`   erwartet: ${r.expected}`);
    if (!r.ok) console.log(`   erhalten: ${r.actual}`);
  }
  console.log("");
  console.log(`Summe: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt`);
  if (fail > 0) process.exit(1);
}

run().catch(err => {
  console.error("Smoke-Test gescheitert:", err);
  process.exit(1);
});
