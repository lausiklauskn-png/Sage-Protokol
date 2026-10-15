// Headless smoke — Modul 03: Rückfall auf HuggingFace (Klaus 2026-10-15).
// Run with `node tests/smoke_bau03_rueckfall.mjs`.
//
// Anlass, gemessen an Klaus' Tablet: Apps mit window.SBKIM_MODEL_ROOT
// (family-projekt.de) meldeten „Can't create a session“, ein Inkognito-Tab
// lud dasselbe Modell, und die Datei auf dem Server trug dieselbe sha256 wie
// bei HuggingFace. Die Quelle wurde nur an der config.json entschieden;
// scheiterte danach das Modell, gab es keinen zweiten Weg.
//
// Geprüft (mit gestelltem transformers.js, gestelltem fetch und gestellter
// Cache-API — das echte Modell läuft nur im Browser):
//   A) local scheitert → genau EIN zweiter Versuch mit HuggingFace, init()
//      gelingt, getModelSource()="remote", getModelFallback() nennt Wurzel
//      und Grund, Vektoren kommen.
//   B) nur die Zwischenspeicher-Einträge DIESER Wurzel werden entfernt.
//   C) beim zweiten Versuch zeigt env.localModelPath NICHT mehr auf den
//      Server (transformers.js fragt den Cache zuerst unter diesem Pfad).
//   D) scheitert auch HuggingFace → ModelLoadError, keine Endlosschleife.
//   E) war die Quelle von Anfang an HuggingFace → kein zweiter Versuch.
//   F) local klappt → kein Rückfall, Cache unberührt.
//   G) Worker-Pfad: ein Worker, der nur an "local" scheitert, wird für
//      HuggingFace neu gebaut und ist danach aktiv.
//   H) die Selbstauskunft auf der Konsole nennt den Rückfall.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const ROOT = "https://family-projekt.de/models/";
const MODEL = "Xenova/multilingual-e5-small";

let pass = 0, fail = 0;
function ok(cond, label, got) {
  if (cond) { pass++; console.log("  ✓ " + label); }
  else { fail++; console.log("  ✗ ROT: " + label + "  | got: " + got); }
}

const FAKE_MODEL = `
export const env={};
export async function pipeline(){
  const fx=globalThis.__fx;
  fx.calls.push({local:env.allowLocalModels,remote:env.allowRemoteModels,path:env.localModelPath});
  if(fx.fail({local:env.allowLocalModels})) throw new Error("Can't create a session");
  return async function(texts){
    const d=new Float32Array(texts.length*384).fill(1/Math.sqrt(384));
    return {data:d};
  };
}`;
const FAKE_URL = "data:text/javascript," + encodeURIComponent(FAKE_MODEL);
const fakeMod = await import(FAKE_URL);

function freshFx(failFn) {
  for (const k of Object.keys(fakeMod.env)) delete fakeMod.env[k];
  globalThis.__fx = { calls: [], fail: failFn };
}

// Cache-API: Schlüssel als Request-ähnliche Objekte mit .url
function installCaches(urls) {
  const store = new Map(urls.map((u) => [u, true]));
  globalThis.caches = {
    open: async (name) => {
      globalThis.__cacheName = name;
      return {
        keys: async () => [...store.keys()].map((u) => ({ url: u })),
        delete: async (k) => store.delete(k.url),
      };
    },
  };
  return store;
}

// fetch: config.json am Server → JSON (Quelle "local"), sonst Netzfehler
function fetchLocalOk() {
  return async (url) => {
    if (String(url).startsWith(ROOT)) {
      return { ok: true, headers: { get: () => "application/json" }, text: async () => '{"model_type":"bert"}' };
    }
    throw new Error("kein Netz im Test");
  };
}
function fetchNone() { return async () => { throw new Error("kein Netz im Test"); }; }

const logs = [];
const cons = {
  info: (m) => logs.push(["info", String(m)]),
  warn: (m) => logs.push(["warn", String(m)]),
  log: console.log,
  error: console.error,
};

function loadFresh() {
  let src = readFileSync(resolve(repoRoot, "src/modules/03_embedding.js"), "utf8");
  src = src.replace('"https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"', JSON.stringify(FAKE_URL));
  delete globalThis.SbkimEmbedding;
  new Function("global", "window", "globalThis", "console", src)(globalThis, globalThis, globalThis, cons);
  return globalThis.SbkimEmbedding;
}

function noWorker() {
  delete globalThis.Worker;
  if (globalThis.URL) delete globalThis.URL.createObjectURL;
}

globalThis.window = globalThis;
globalThis.location = { href: "https://lausiklauskn-png.github.io/Mein-In-and-Out-Book/" };
globalThis.SBKIM_MODEL_ROOT = ROOT;

const BAD = [
  ROOT + MODEL + "/onnx/model_quantized.onnx",
  ROOT + MODEL + "/config.json",
];
const KEEP = [
  "https://huggingface.co/" + MODEL + "/resolve/main/onnx/model_quantized.onnx",
  ROOT + "Xenova/anderes-modell/config.json",
];

(async function () {
  console.log("== A/B/C) local scheitert → HuggingFace ==");
  noWorker();
  globalThis.fetch = fetchLocalOk();
  let store = installCaches([...BAD, ...KEEP]);
  freshFx((e) => e.local === true);
  logs.length = 0;
  let E = loadFresh();
  let initErr = null;
  try { await E.init(); } catch (e) { initErr = e; }
  ok(initErr === null, "init() gelingt trotz scheiterndem Server-Modell", initErr && initErr.message);
  const calls = globalThis.__fx.calls;
  ok(calls.length === 2, "genau zwei Ladeversuche (local, dann HuggingFace)", calls.length);
  ok(calls[0] && calls[0].local === true && calls[0].remote === false, "erster Versuch: nur local", JSON.stringify(calls[0]));
  ok(calls[1] && calls[1].local === false && calls[1].remote === true, "zweiter Versuch: HuggingFace", JSON.stringify(calls[1]));
  ok(calls[1] && calls[1].path === "/models/", "zweiter Versuch: localModelPath zeigt NICHT mehr auf den Server", calls[1] && calls[1].path);
  ok(E.getModelSource() === "remote", "getModelSource() = remote nach Rückfall", E.getModelSource());
  ok(E.getModelRoot() === null, "getModelRoot() = null nach Rückfall", E.getModelRoot());
  const fb = E.getModelFallback();
  ok(fb && fb.from === ROOT, "getModelFallback().from nennt die Wurzel", JSON.stringify(fb));
  ok(fb && /create a session/.test(fb.reason), "getModelFallback().reason trägt den Fehler", fb && fb.reason);
  ok(fb && fb.droppedCacheEntries === 2, "zwei Zwischenspeicher-Einträge entfernt", fb && fb.droppedCacheEntries);
  ok(globalThis.__cacheName === "transformers-cache", "Speicher heißt transformers-cache", globalThis.__cacheName);
  ok(BAD.every((u) => !store.has(u)), "Einträge der Wurzel sind weg", JSON.stringify([...store.keys()]));
  ok(KEEP.every((u) => store.has(u)), "HuggingFace und fremdes Modell bleiben", JSON.stringify([...store.keys()]));
  const v = await E.embedQuery("Rückfall prüfen");
  ok(v instanceof Float32Array && v.length === 384, "embedQuery liefert nach Rückfall einen Vektor", v && v.length);
  ok(logs.some(([k, m]) => k === "warn" && /Rückfall auf HuggingFace/.test(m) && m.includes(ROOT)), "Warnung nennt Rückfall und Wurzel", JSON.stringify(logs));
  ok(logs.some(([k, m]) => k === "info" && /Quelle: HuggingFace — Rückfall/.test(m)), "Selbstauskunft nennt den Rückfall (H)", JSON.stringify(logs));

  console.log("== D) auch HuggingFace scheitert → ModelLoadError ==");
  installCaches([...BAD]);
  freshFx(() => true);
  E = loadFresh();
  initErr = null;
  try { await E.init(); } catch (e) { initErr = e; }
  ok(initErr && initErr.name === "ModelLoadError", "ModelLoadError, wenn beide scheitern", initErr && initErr.name);
  ok(globalThis.__fx.calls.length === 2, "keine Endlosschleife: genau zwei Versuche", globalThis.__fx.calls.length);

  console.log("== E) von Anfang an HuggingFace → kein zweiter Versuch ==");
  globalThis.fetch = fetchNone();
  installCaches([...BAD]);
  freshFx(() => true);
  E = loadFresh();
  initErr = null;
  try { await E.init(); } catch (e) { initErr = e; }
  ok(initErr && initErr.name === "ModelLoadError", "ModelLoadError bei scheiterndem HuggingFace", initErr && initErr.name);
  ok(globalThis.__fx.calls.length === 1, "nur ein Versuch, kein Rückfall", globalThis.__fx.calls.length);
  ok(E.getModelFallback() === null, "getModelFallback() bleibt null", JSON.stringify(E.getModelFallback()));

  console.log("== F) local klappt → kein Rückfall, Cache unberührt ==");
  globalThis.fetch = fetchLocalOk();
  store = installCaches([...BAD]);
  freshFx(() => false);
  E = loadFresh();
  await E.init();
  ok(E.getModelSource() === "local", "getModelSource() = local", E.getModelSource());
  ok(E.getModelFallback() === null, "kein Rückfall", JSON.stringify(E.getModelFallback()));
  ok(BAD.every((u) => store.has(u)), "Zwischenspeicher unberührt", JSON.stringify([...store.keys()]));
  ok(globalThis.__fx.calls.length === 1, "genau ein Ladeversuch", globalThis.__fx.calls.length);

  console.log("== G) Worker scheitert nur an local → neuer Worker für HuggingFace ==");
  const built = [];
  globalThis.Worker = class {
    constructor() { this.onmessage = null; built.push(this); }
    postMessage(m) {
      const send = (d) => Promise.resolve().then(() => this.onmessage && this.onmessage({ data: d }));
      if (m.type === "init") {
        this.cfg = m.cfg;
        if (m.cfg.source === "local") send({ type: "error", id: m.id, error: "Can't create a session" });
        else send({ type: "ready", id: m.id });
      }
    }
    terminate() { this.terminated = true; }
  };
  globalThis.Blob = globalThis.Blob || class {};
  globalThis.URL.createObjectURL = () => "blob:fake";
  installCaches([...BAD]);
  freshFx((e) => e.local === true); // auch der Haupt-Faden scheitert an local
  E = loadFresh();
  initErr = null;
  try { await E.init(); } catch (e) { initErr = e; }
  ok(initErr === null, "init() gelingt über den Worker-Rückfall", initErr && initErr.message);
  ok(built.length === 2, "zweiter Worker gebaut", built.length);
  ok(built[1] && built[1].cfg && built[1].cfg.source === "remote", "zweiter Worker lädt von HuggingFace", built[1] && JSON.stringify(built[1].cfg));
  ok(built[1] && built[1].cfg && built[1].cfg.defaultRoot === "/models/", "Worker bekommt die Standard-Wurzel mit", built[1] && JSON.stringify(built[1].cfg));
  ok(E._workerState().active === true, "Worker ist danach aktiv", JSON.stringify(E._workerState()));
  noWorker();

  console.log("== I) der ECHTE Worker-Quelltext setzt für HuggingFace den Pfad zurück ==");
  // G fährt einen gestellten Worker. Was im Worker wirklich läuft, ist der
  // Text aus workerSource() — er wird hier abgefangen und selbst ausgeführt.
  let workerText = null;
  globalThis.Blob = class { constructor(parts) { workerText = parts.join(""); } };
  globalThis.Worker = class {
    constructor() { this.onmessage = null; }
    postMessage(m) { Promise.resolve().then(() => this.onmessage && this.onmessage({ data: { type: "ready", id: m.id } })); }
    terminate() {}
  };
  globalThis.URL.createObjectURL = () => "blob:fake";
  globalThis.fetch = fetchNone();
  freshFx(() => false);
  E = loadFresh();
  await E.init();
  ok(typeof workerText === "string" && workerText.includes("onmessage"), "Worker-Quelltext abgefangen", typeof workerText);
  noWorker();
  freshFx(() => false);
  fakeMod.env.localModelPath = ROOT; // Stand nach einem gescheiterten local-Versuch
  const fakeSelf = { postMessage: () => {} };
  new Function("self", workerText)(fakeSelf);
  await fakeSelf.onmessage({ data: { type: "init", id: 1, cfg: { cdn: FAKE_URL, model: MODEL, source: "remote", localRoot: ROOT, defaultRoot: "/models/" } } });
  const wc = globalThis.__fx.calls[0];
  ok(wc && wc.remote === true && wc.local === false, "Worker lädt von HuggingFace", JSON.stringify(wc));
  ok(wc && wc.path === "/models/", "Worker: localModelPath zeigt NICHT mehr auf den Server", wc && wc.path);

  console.log("\nTotal: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
  process.exit(fail === 0 ? 0 : 1);
})();
