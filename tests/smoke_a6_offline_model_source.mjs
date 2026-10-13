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

  // ── Modell von einem anderen eigenen Server (window.SBKIM_MODEL_ROOT, 2026-10-13) ──
  const ROOT = "https://family-projekt.de/models/";
  const CFG = (root) => root + "Xenova/multilingual-e5-small/config.json";
  function urlFetch(map, log) {
    return async function (url) {
      log.push(url);
      const spec = map[url];
      if (!spec) return { ok: false, headers: { get: () => "" }, text: async () => "" };
      if (spec === "throw") throw new Error("down");
      return { ok: true, headers: { get: (k) => (k.toLowerCase() === "content-type" ? spec.ct : "") }, text: async () => spec.body };
    };
  }
  const JSONOK = { ct: "application/json", body: '{"model_type":"bert"}' };
  const HTML = { ct: "text/html", body: "<!doctype html>" };
  let log = [];

  // 7) ohne Einstellung: genau EINE Probe, auf /models/ (Verhalten unverändert)
  delete globalThis.SBKIM_MODEL_ROOT;
  globalThis.fetch = urlFetch({}, log);
  r = await E._detectModelSource();
  record("ohne SBKIM_MODEL_ROOT: nur /models/ geprobt", CFG("/models/"), log.join(","), r === "remote" && log.length === 1 && log[0] === CFG("/models/"));

  // 8) eigener Server liefert JSON → local, Wurzel = eigener Server, /models/ gar nicht gefragt
  globalThis.SBKIM_MODEL_ROOT = ROOT; log = [];
  globalThis.fetch = urlFetch({ [CFG(ROOT)]: JSONOK }, log);
  r = await E._detectModelSource();
  record("SBKIM_MODEL_ROOT mit JSON → local von dort", ROOT, E._modelRoot(), r === "local" && E._modelRoot() === ROOT && log.length === 1 && log[0] === CFG(ROOT));

  // 9) eigener Server liefert die Startseite (SPA-Falle), /models/ hat das Modell → local von /models/
  log = [];
  globalThis.fetch = urlFetch({ [CFG(ROOT)]: HTML, [CFG("/models/")]: JSONOK }, log);
  r = await E._detectModelSource();
  record("eigener Server HTML → Rückfall /models/", "/models/", E._modelRoot(), r === "local" && E._modelRoot() === "/models/" && log.length === 2);

  // 10) eigener Server nicht erreichbar, /models/ leer → remote (HuggingFace), kein Throw.
  //     Vorher einmal ERFOLGREICH vom eigenen Server — sonst stünde die Wurzel schon auf /models/
  //     und ein Riegel, der sie nicht zurücksetzt, bliebe unsichtbar (Gegenprobe 2026-10-13).
  globalThis.fetch = urlFetch({ [CFG(ROOT)]: JSONOK }, []);
  await E._detectModelSource();
  log = [];
  globalThis.fetch = urlFetch({ [CFG(ROOT)]: "throw" }, log);
  r = await E._detectModelSource();
  record("eigener Server wirft → remote, Wurzel zurück auf /models/", "remote", r, r === "remote" && E._modelRoot() === "/models/" && log.length === 2);

  // 11) ohne Schrägstrich am Ende wird er ergänzt; Leerzeichen weg
  globalThis.SBKIM_MODEL_ROOT = "  https://family-projekt.de/models  ";
  record("Wurzel ohne / wird ergänzt", ROOT, E._configuredModelRoot(), E._configuredModelRoot() === ROOT);

  // 12) unsichere oder fremde Formen werden NICHT angenommen
  const boese = ["http://family-projekt.de/models/", "//family-projekt.de/models/", "javascript:alert(1)", "https://", "https://x.example/a b/", 42, ""];
  const angenommen = boese.filter((v) => { globalThis.SBKIM_MODEL_ROOT = v; return E._configuredModelRoot() !== null; });
  record("http, //, javascript:, leer, Zahl → nicht angenommen", "[]", JSON.stringify(angenommen), angenommen.length === 0);

  // 13) abgelehnte Einstellung → nur /models/ geprobt (fällt auf das alte Verhalten)
  globalThis.SBKIM_MODEL_ROOT = "http://family-projekt.de/models/"; log = [];
  globalThis.fetch = urlFetch({ [CFG("http://family-projekt.de/models/")]: JSONOK }, log);
  r = await E._detectModelSource();
  record("http-Wurzel wird nie gefragt", CFG("/models/"), log.join(","), r === "remote" && log.length === 1 && log[0] === CFG("/models/"));

  // 14) Pfad ab / ist erlaubt (eigene Adresse, anderer Ordner)
  globalThis.SBKIM_MODEL_ROOT = "/modelle"; log = [];
  globalThis.fetch = urlFetch({ [CFG("/modelle/")]: JSONOK }, log);
  r = await E._detectModelSource();
  record("Pfad /modelle → local von dort", "/modelle/", E._modelRoot(), r === "local" && E._modelRoot() === "/modelle/");
  delete globalThis.SBKIM_MODEL_ROOT;

  record("_meta.modelRootSetting = SBKIM_MODEL_ROOT", "SBKIM_MODEL_ROOT", E._meta.modelRootSetting, E._meta.modelRootSetting === "SBKIM_MODEL_ROOT");
  record("getModelRoot exportiert, vor init null", "null", String(E.getModelRoot && E.getModelRoot()), typeof E.getModelRoot === "function" && E.getModelRoot() === null);

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
