// Headless smoke test für Bau 04.D hybridMatch (Match-Zeit-LLM-Richter).
// Run mit `node tests/smoke_bau04d_hybrid_match.mjs`. KEIN echter Netz-
// Aufruf — fetch wird mit einem Mock-LLM gestubbt (Anbieter-agnostisch:
// der Mock kann sowohl die Anthropic-Form als auch die OpenAI-kompatible
// Form liefern). Geprüft werden die drei Konzept-Eigenschaften:
//   1. Happy-Path Richter (verdicts + Bezeugung/attestation).
//   2. Fail-soft auf lokal bei LLM-/Netz-/Schema-Fehler (kein Throw).
//   3. Opt-in aus (leerer apiKey) → Vorfilter gilt (available:false).
// Plus Anbieter-Abstraktion (Claude/Mistral/OpenAI/lokal), EU-Default,
// Bidirektional-Kombinator, Sync-Konfig-Throws.

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

// ---- fetch-Stub: ein Mock-LLM, das nach gewählter Form antwortet. ----
// behavior steuert die Antwort. lastRequest hält den letzten Call fest,
// damit Proben die Anbieter-spezifische Request-Form prüfen können.
let stubBehavior = "ok-anthropic";
let lastRequest = null;
let stubVerdicts = null;

function jsonResponse(status, payload, statusText) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: statusText || "",
    json: async () => payload,
  };
}

globalThis.fetch = async (url, init) => {
  lastRequest = { url, init };
  if (stubBehavior === "network-error") {
    throw new Error("getaddrinfo ENOTFOUND");
  }
  if (stubBehavior === "abort") {
    const e = new Error("aborted");
    e.name = "AbortError";
    throw e;
  }
  if (stubBehavior === "http-500") {
    return jsonResponse(500, {}, "Internal Server Error");
  }
  if (stubBehavior === "http-429") {
    return jsonResponse(429, {}, "Too Many Requests");
  }
  if (stubBehavior === "bad-body") {
    return { ok: true, status: 200, statusText: "", json: async () => { throw new Error("not json"); } };
  }
  if (stubBehavior === "wrong-shape") {
    // weder Anthropic- noch OpenAI-Form
    return jsonResponse(200, { something: "else" });
  }
  if (stubBehavior === "non-json-text") {
    return jsonResponse(200, anthropicWrap("das ist kein JSON"));
  }
  if (stubBehavior === "schema-mismatch") {
    // verdicts-Länge passt nicht
    return jsonResponse(200, anthropicWrap(JSON.stringify({ verdicts: [] })));
  }
  // ok-anthropic / ok-openai: gültiges verdicts-JSON in der jeweiligen Form.
  const text = JSON.stringify({ verdicts: stubVerdicts });
  if (stubBehavior === "ok-openai") {
    return jsonResponse(200, openAiWrap(text));
  }
  return jsonResponse(200, anthropicWrap(text));
};

function anthropicWrap(text) {
  return {
    content: [{ type: "text", text }],
    usage: { input_tokens: 120, output_tokens: 40 },
  };
}
function openAiWrap(text) {
  return {
    choices: [{ message: { role: "assistant", content: text } }],
    usage: { prompt_tokens: 120, completion_tokens: 40, total_tokens: 160 },
  };
}

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

const candidates3 = [
  { label: "Wein-Verkostung", text: "Notizen zu Weinen, Tannin, Säure, Speisebegleitung.", cosine: 0.83, anchorId: "wein-1" },
  { label: "Auspuff-Reparatur", text: "KFZ-Werkstatt, Auspuff, Schweißen, Endrohr.", cosine: 0.81, anchorId: "kfz-1" },
  { label: "Käsekunde", text: "Hartkäse, Reifung, Aromen, Begleitung zu Hauptgang.", cosine: 0.80, anchorId: "kaese-1" },
];

async function run() {
  // ---- Probe 1: Export-Anker ----
  record("Probe 1: hybridMatch exportiert", "function",
    typeof M.hybridMatch, typeof M.hybridMatch === "function");
  record("Probe 1: pickJudgeProvider exportiert", "function",
    typeof M.pickJudgeProvider, typeof M.pickJudgeProvider === "function");
  record("Probe 1: bidirectionalVerdict exportiert", "function",
    typeof M.bidirectionalVerdict, typeof M.bidirectionalVerdict === "function");
  record("Probe 1: InvalidCandidatesError exportiert", "function",
    typeof M.InvalidCandidatesError, typeof M.InvalidCandidatesError === "function");
  record("Probe 1: InvalidProviderError exportiert", "function",
    typeof M.InvalidProviderError, typeof M.InvalidProviderError === "function");
  record("Probe 1: _meta.hybridProviders (4 Anbieter)", "4",
    String(M._meta.hybridProviders.length), M._meta.hybridProviders.length === 4);
  record("Probe 1: _meta.hybridEuDefaultProvider", "mistral",
    M._meta.hybridEuDefaultProvider, M._meta.hybridEuDefaultProvider === "mistral");
  record("Probe 1: _meta.hybridBidirectionalDefault", "both",
    M._meta.hybridBidirectionalDefault, M._meta.hybridBidirectionalDefault === "both");

  // ---- Probe 2: Happy-Path Richter (Anthropic) + Bezeugung ----
  stubBehavior = "ok-anthropic";
  stubVerdicts = [
    { passt: true, score: 0.91, begruendung: "Wein passt direkt zur Speisebegleitung-Suche." },
    { passt: false, score: 0.05, begruendung: "KFZ-Auspuff hat keinen inhaltlichen Bezug." },
    { passt: true, score: 0.74, begruendung: "Käse passt teilweise zum Hauptgang-Kontext." },
  ];
  const out2 = await M.hybridMatch(
    { text: "Wein-Empfehlungen, die zum Hauptgang passen", label: "Klaus privat" },
    candidates3,
    { apiKey: "sk-test", provider: "claude" },
  );
  record("Probe 2: available true", "true", String(out2.available), out2.available === true);
  record("Probe 2: provider claude", "claude", out2.provider, out2.provider === "claude");
  record("Probe 2: region us", "us", out2.region, out2.region === "us");
  record("Probe 2: verdicts Länge 3", "3",
    String(out2.verdicts?.length), out2.verdicts?.length === 3);
  record("Probe 2: Verdict 1 passt", "true",
    String(out2.verdicts[0].passt), out2.verdicts[0].passt === true);
  record("Probe 2: Verdict 2 passt false", "false",
    String(out2.verdicts[1].passt), out2.verdicts[1].passt === false);
  record("Probe 2: label rückgemappt", "Wein-Verkostung",
    out2.verdicts[0].label, out2.verdicts[0].label === "Wein-Verkostung");
  record("Probe 2: cosine durchgereicht", "0.83",
    String(out2.verdicts[0].cosine), out2.verdicts[0].cosine === 0.83);
  record("Probe 2: anchorId durchgereicht", "wein-1",
    out2.verdicts[0].anchorId, out2.verdicts[0].anchorId === "wein-1");
  record("Probe 2: tokensUsed 160", "160",
    String(out2.tokensUsed), out2.tokensUsed === 160);
  // Bezeugung
  record("Probe 2: attestation kind", "sbkim-hybrid-match-judgment",
    out2.attestation?.kind, out2.attestation?.kind === "sbkim-hybrid-match-judgment");
  record("Probe 2: attestation judgedAt YYYY-MM-DD", "true",
    String(/^\d{4}-\d{2}-\d{2}$/.test(out2.attestation?.judgedAt || "")),
    /^\d{4}-\d{2}-\d{2}$/.test(out2.attestation?.judgedAt || ""));
  record("Probe 2: attestation provider-marker", "claude",
    out2.attestation?.provider, out2.attestation?.provider === "claude");
  record("Probe 2: attestation verdicts knapp (kein cosine)", "true",
    String(out2.attestation.verdicts[0].cosine === undefined),
    out2.attestation.verdicts[0].cosine === undefined);
  // Anthropic-Request-Form geprüft
  record("Probe 2: Request nutzt x-api-key (Anthropic)", "sk-test",
    lastRequest.init.headers["x-api-key"], lastRequest.init.headers["x-api-key"] === "sk-test");

  // ---- Probe 3: Fail-soft bei Netz-Fehler → available:false, kein Throw ----
  stubBehavior = "network-error";
  const out3 = await M.hybridMatch("Suche X", candidates3, { apiKey: "sk-test", provider: "claude" });
  record("Probe 3: Netz-Fehler available false", "false",
    String(out3.available), out3.available === false);
  record("Probe 3: Netz-Fehler kein Throw + reason", "true",
    String(typeof out3.reason === "string" && out3.reason.length > 0),
    typeof out3.reason === "string" && out3.reason.length > 0);
  record("Probe 3: fallbackCandidates erhalten (3)", "3",
    String(out3.fallbackCandidates.length), out3.fallbackCandidates.length === 3);
  record("Probe 3: verdicts null im Fail-soft", "true",
    String(out3.verdicts === null), out3.verdicts === null);
  record("Probe 3: attestation null im Fail-soft", "true",
    String(out3.attestation === null), out3.attestation === null);

  // ---- Probe 4: Opt-in aus (leerer apiKey) → Vorfilter gilt ----
  stubBehavior = "ok-anthropic";
  const out4 = await M.hybridMatch("Suche X", candidates3, { apiKey: "", provider: "claude" });
  record("Probe 4: kein apiKey available false", "false",
    String(out4.available), out4.available === false);
  record("Probe 4: reason nennt opt-in", "true",
    String(/opt-in/i.test(out4.reason || "")), /opt-in/i.test(out4.reason || ""));
  // ohne apiKey-Feld komplett
  const out4b = await M.hybridMatch("Suche X", candidates3, { provider: "claude" });
  record("Probe 4b: apiKey fehlt → available false", "false",
    String(out4b.available), out4b.available === false);

  // ---- Probe 5: Anbieter-Abstraktion OpenAI-kompatibel (Mistral) ----
  stubBehavior = "ok-openai";
  stubVerdicts = [
    { passt: true, score: 0.9, begruendung: "passt" },
    { passt: false, score: 0.1, begruendung: "passt nicht" },
    { passt: true, score: 0.6, begruendung: "teils" },
  ];
  const out5 = await M.hybridMatch("Suche Y", candidates3, { apiKey: "key-eu", provider: "mistral" });
  record("Probe 5: Mistral available true", "true", String(out5.available), out5.available === true);
  record("Probe 5: region eu", "eu", out5.region, out5.region === "eu");
  record("Probe 5: OpenAI-Request Authorization-Bearer", "Bearer key-eu",
    lastRequest.init.headers["authorization"], lastRequest.init.headers["authorization"] === "Bearer key-eu");
  record("Probe 5: Mistral default-Modell", "mistral-small-latest",
    out5.model, out5.model === "mistral-small-latest");

  // ---- Probe 6: EU-Default via euOnly, ohne provider ----
  record("Probe 6: pickJudgeProvider euOnly → mistral", "mistral",
    M.pickJudgeProvider({ euOnly: true }), M.pickJudgeProvider({ euOnly: true }) === "mistral");
  record("Probe 6: pickJudgeProvider default → claude", "claude",
    M.pickJudgeProvider({}), M.pickJudgeProvider({}) === "claude");
  // hybridMatch ohne provider + euOnly nutzt mistral
  stubBehavior = "ok-openai";
  const out6 = await M.hybridMatch("Suche Z", candidates3, { apiKey: "k", euOnly: true });
  record("Probe 6: hybridMatch euOnly nutzt mistral", "mistral",
    out6.provider, out6.provider === "mistral");

  // ---- Probe 7: lokaler Anbieter ohne Endpoint → fail-soft ----
  const out7 = await M.hybridMatch("Suche", candidates3, { apiKey: "k", provider: "local" });
  record("Probe 7: local ohne Endpoint available false", "false",
    String(out7.available), out7.available === false);
  record("Probe 7: reason nennt Endpoint", "true",
    String(/Endpoint/i.test(out7.reason || "")), /Endpoint/i.test(out7.reason || ""));
  // mit Endpoint klappt es
  stubBehavior = "ok-openai";
  const out7b = await M.hybridMatch("Suche", candidates3, { apiKey: "k", provider: "local", endpoint: "https://llm.local/v1/chat/completions" });
  record("Probe 7b: local mit Endpoint available true", "true",
    String(out7b.available), out7b.available === true);
  record("Probe 7b: lokaler Endpoint genutzt", "https://llm.local/v1/chat/completions",
    lastRequest.url, lastRequest.url === "https://llm.local/v1/chat/completions");

  // ---- Probe 8: weitere Fail-soft-Pfade ----
  stubBehavior = "http-500";
  const o8a = await M.hybridMatch("S", candidates3, { apiKey: "k" });
  record("Probe 8a: HTTP 500 fail-soft", "false", String(o8a.available), o8a.available === false);
  stubBehavior = "http-429";
  const o8b = await M.hybridMatch("S", candidates3, { apiKey: "k" });
  record("Probe 8b: HTTP 429 reason nennt Rate-Limit", "true",
    String(/429|Rate-Limit/i.test(o8b.reason || "")), /429|Rate-Limit/i.test(o8b.reason || ""));
  stubBehavior = "bad-body";
  const o8c = await M.hybridMatch("S", candidates3, { apiKey: "k" });
  record("Probe 8c: kaputter Body fail-soft", "false", String(o8c.available), o8c.available === false);
  stubBehavior = "wrong-shape";
  const o8d = await M.hybridMatch("S", candidates3, { apiKey: "k" });
  record("Probe 8d: falsche API-Form fail-soft", "false", String(o8d.available), o8d.available === false);
  stubBehavior = "non-json-text";
  const o8e = await M.hybridMatch("S", candidates3, { apiKey: "k" });
  record("Probe 8e: LLM-Text kein JSON fail-soft", "false", String(o8e.available), o8e.available === false);
  stubBehavior = "schema-mismatch";
  const o8f = await M.hybridMatch("S", candidates3, { apiKey: "k" });
  record("Probe 8f: Schema-Mismatch fail-soft", "false", String(o8f.available), o8f.available === false);

  // ---- Probe 9: AbortError wird NICHT abgefangen (durchgereicht) ----
  stubBehavior = "abort";
  let abortErr = null;
  try {
    await M.hybridMatch("S", candidates3, { apiKey: "k" });
  } catch (e) { abortErr = e; }
  record("Probe 9: AbortError durchgereicht", "AbortError",
    abortErr?.name, abortErr?.name === "AbortError");

  // ---- Probe 10: Sync-Konfig-Throws ----
  // 10a leere Query
  let e10a = null;
  try { await M.hybridMatch("", candidates3, { apiKey: "k" }); } catch (e) { e10a = e; }
  record("Probe 10a: leere Query → EmptyQueryError", "EmptyQueryError",
    e10a?.name, e10a?.name === "EmptyQueryError");
  // 10b candidates kein Array
  let e10b = null;
  try { await M.hybridMatch("S", "nope", { apiKey: "k" }); } catch (e) { e10b = e; }
  record("Probe 10b: candidates kein Array → InvalidCandidatesError", "InvalidCandidatesError",
    e10b?.name, e10b?.name === "InvalidCandidatesError");
  // 10c leeres candidates-Array
  let e10c = null;
  try { await M.hybridMatch("S", [], { apiKey: "k" }); } catch (e) { e10c = e; }
  record("Probe 10c: leeres candidates → InvalidCandidatesError", "InvalidCandidatesError",
    e10c?.name, e10c?.name === "InvalidCandidatesError");
  // 10d candidate ohne text
  let e10d = null;
  try { await M.hybridMatch("S", [{ label: "X" }], { apiKey: "k" }); } catch (e) { e10d = e; }
  record("Probe 10d: candidate ohne text → InvalidCandidatesError", "InvalidCandidatesError",
    e10d?.name, e10d?.name === "InvalidCandidatesError");
  // 10e unbekannter Anbieter
  let e10e = null;
  try { await M.hybridMatch("S", candidates3, { apiKey: "k", provider: "gemini" }); } catch (e) { e10e = e; }
  record("Probe 10e: unbekannter Anbieter → InvalidProviderError", "InvalidProviderError",
    e10e?.name, e10e?.name === "InvalidProviderError");
  // 10f zu viele Kandidaten
  const tooMany = [];
  for (let i = 0; i < 21; i++) tooMany.push({ label: "C" + i, text: "t" });
  let e10f = null;
  try { await M.hybridMatch("S", tooMany, { apiKey: "k" }); } catch (e) { e10f = e; }
  record("Probe 10f: >20 Kandidaten → InvalidCandidatesError", "InvalidCandidatesError",
    e10f?.name, e10f?.name === "InvalidCandidatesError");

  // ---- Probe 11: bidirectionalVerdict (Default streng) ----
  record("Probe 11: both true&true", "true",
    String(M.bidirectionalVerdict(true, true)), M.bidirectionalVerdict(true, true) === true);
  record("Probe 11: both true&false (Default streng)", "false",
    String(M.bidirectionalVerdict(true, false)), M.bidirectionalVerdict(true, false) === false);
  record("Probe 11: one true&false (großzügig)", "true",
    String(M.bidirectionalVerdict(true, false, "one")), M.bidirectionalVerdict(true, false, "one") === true);
  record("Probe 11: one false&false", "false",
    String(M.bidirectionalVerdict(false, false, "one")), M.bidirectionalVerdict(false, false, "one") === false);
  let e11 = null;
  try { M.bidirectionalVerdict("ja", true); } catch (e) { e11 = e; }
  record("Probe 11: nicht-Boolean → InvalidCandidatesError", "InvalidCandidatesError",
    e11?.name, e11?.name === "InvalidCandidatesError");

  // ---- Probe 12: query als reiner String (ohne label) ----
  stubBehavior = "ok-anthropic";
  stubVerdicts = [
    { passt: true, score: 0.8, begruendung: "ok" },
    { passt: true, score: 0.7, begruendung: "ok" },
    { passt: true, score: 0.6, begruendung: "ok" },
  ];
  const out12 = await M.hybridMatch("nur Text", candidates3, { apiKey: "k", provider: "claude" });
  record("Probe 12: query-String funktioniert", "true",
    String(out12.available), out12.available === true);
  record("Probe 12: queryLabel null in attestation", "true",
    String(out12.attestation.queryLabel === null), out12.attestation.queryLabel === null);
}

const finalize = () => {
  let allOk = true;
  console.log("\n=== Bau 04.D hybridMatch Smoke-Test ===");
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    console.log(`${mark} ${r.probe}\n   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
    if (!r.ok) allOk = false;
  }
  console.log(`\nTotal: ${results.length} Proben, ${results.filter(r => r.ok).length} grün, ${results.filter(r => !r.ok).length} rot.`);
  if (!allOk) process.exit(1);
};

run().then(finalize).catch((err) => {
  console.error("Smoke-Test-Runner hat unerwartet geworfen:", err);
  process.exit(1);
});
