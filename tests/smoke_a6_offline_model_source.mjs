// Headless smoke — A6/Offline-Modell: Modell-Quellen-Erkennung in Modul 03
// (2026-07-11, upstreamed aus family-project auf Klaus' Freigabe).
// Run with `node tests/smoke_a6_offline_model_source.mjs`.
//
// Beweist die additive Offline-first-Logik (`detectModelSource`), die selbst
// entscheidet, ob das Embedding-Modell lokal (eigener Server) oder von
// HuggingFace geladen wird — per Body-Probe, weil ein SPA-Server (try_files
// … /index.html) für fehlende Dateien die Startseite (200, text/html) statt
// 404 liefert. Konsequent FAIL-SOFT: jeder Fehler → "remote".
//
// Reine Quellen-Erkennung headless prüfbar über die Test-Brücke
// `_detectModelSource`. Das echte Modell-Laden läuft nur im Browser.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("global", "window", "globalThis", "console", src)(
    globalThis, globalThis, globalThis, console);
}

loadModule("src/modules/03_embedding.js");
const E = globalThis.SbkimEmbedding;

const results = [];
const record = (probe, expected, actual, ok) => results.push({ probe, expected, actual, ok });

// Fake-Response-Fabrik für global.fetch
function fakeFetch(spec) {
  return async function () {
    if (spec === "throw") throw new Error("network down");
    return {
      ok: spec.ok !== false,
      headers: { get: (k) => (k.toLowerCase() === "content-type" ? (spec.ct || "") : "") },
      text: async () => spec.body || "",
    };
  };
}

async function run() {
  // Surface + _meta
  record("_detectModelSource exportiert", "function",
    typeof E._detectModelSource, typeof E._detectModelSource === "function");
  record("getModelSource exportiert", "function",
    typeof E.getModelSource, typeof E.getModelSource === "function");
  record("getModelSource vor init = null", "null",
    String(E.getModelSource()), E.getModelSource() === null);
  record("_meta.localModelRoot gesetzt", "/models/",
    E._meta && E._meta.localModelRoot, E._meta && E._meta.localModelRoot === "/models/");
  record("_meta.localModelProbe endet auf /config.json", true,
    !!(E._meta && /\/config\.json$/.test(E._meta.localModelProbe)),
    !!(E._meta && /\/config\.json$/.test(E._meta.localModelProbe)));

  const origFetch = globalThis.fetch;

  // 1) Kein fetch verfügbar → "remote" (Node-Default, fail-soft)
  delete globalThis.fetch;
  let r = await E._detectModelSource();
  record("ohne fetch → remote", "remote", r, r === "remote");

  // 2) Echtes JSON (selbst-gehostet) → "local"
  globalThis.fetch = fakeFetch({ ok: true, ct: "application/json", body: '{"model_type":"bert"}' });
  r = await E._detectModelSource();
  record("JSON-Body → local", "local", r, r === "local");

  // 3) SPA-Falle: 200 + text/html (index.html statt 404) → "remote"
  globalThis.fetch = fakeFetch({ ok: true, ct: "text/html", body: "<!doctype html><html>" });
  r = await E._detectModelSource();
  record("SPA-HTML-Falle → remote", "remote", r, r === "remote");

  // 4) 200 aber Body ist HTML ohne content-type-Hinweis → "remote" (Body-Probe)
  globalThis.fetch = fakeFetch({ ok: true, ct: "", body: "<!doctype html>" });
  r = await E._detectModelSource();
  record("Body '<' ohne CT → remote", "remote", r, r === "remote");

  // 5) HTTP nicht ok (404/500) → "remote"
  globalThis.fetch = fakeFetch({ ok: false, ct: "application/json", body: "{}" });
  r = await E._detectModelSource();
  record("!res.ok → remote", "remote", r, r === "remote");

  // 6) fetch wirft → "remote" (kein Throw nach außen)
  globalThis.fetch = fakeFetch("throw");
  r = await E._detectModelSource();
  record("fetch wirft → remote (kein Throw)", "remote", r, r === "remote");

  if (origFetch === undefined) delete globalThis.fetch; else globalThis.fetch = origFetch;

  // Ausgabe
  let pass = 0;
  for (const t of results) {
    const ok = t.ok ? "OK  " : "FAIL";
    if (t.ok) pass++;
    console.log(`[${ok}] ${t.probe}` + (t.ok ? "" : `  (erwartet ${t.expected}, war ${t.actual})`));
  }
  console.log(`\n${pass}/${results.length} Proben grün`);
  if (pass !== results.length) process.exit(1);
}

run();
