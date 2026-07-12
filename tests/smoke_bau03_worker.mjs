// Headless smoke — A (Last-Schoner): Web-Worker fürs Embedding in Modul 03.
// Run with `node tests/smoke_bau03_worker.mjs`.
//
// Beweist die Modul-Logik des Worker-Pfads (der die Modell-Rechnung aus dem
// Anzeige-Faden verschiebt → gegen das Tablet-Einfrieren):
//   A) Mit vorhandenem Worker → init() nutzt ihn (_workerState.active),
//      embedQuery liefert einen L2-normalisierten 384-Vektor.
//   B) PARITÄT — derselbe Text ergibt über den Worker EXAKT denselben Vektor
//      wie über den Haupt-Faden (Rückfall). Die Verrohrung (Präfix, Slicing)
//      ist also korrekt.
//   C) Fail-soft — KEIN Worker verfügbar (Node-Normalfall) → stiller Rückfall
//      auf den Haupt-Faden, embedQuery funktioniert trotzdem.
//   D) Worker-Fehler mitten im Betrieb → failWorker → der Aufruf fällt sauber
//      auf den Haupt-Faden zurück und liefert trotzdem einen Vektor.
//   E) init({worker:false}) → Worker wird nie gebaut, auch wenn global da ist.
//
// Der echte e5-Modell-Lauf im Worker ist derselbe pipeline-Code wie im Haupt-
// Faden (schon durch smoke_a3 bewiesen). Hier wird die ORCHESTRIERUNG geprüft:
// ein DETERMINISTISCHER Fake-Worker + Fake-Modell (identische Hash-Mathematik)
// belegen, dass beide Pfade byte-gleiche Vektoren erzeugen.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

let pass = 0, fail = 0;
function ok(cond, label, got) {
  if (cond) { pass++; console.log("  ✓ " + label); }
  else { fail++; console.log("  ✗ " + label + "  | got: " + got); }
}

// Deterministische Hash→Vektor-Mathematik (identisch in Fake-Modell + Fake-Worker).
function fakeVectors(texts, dim) {
  const data = new Float32Array(texts.length * dim);
  for (let i = 0; i < texts.length; i++) {
    let h = 2166136261; const s = String(texts[i]);
    for (let c = 0; c < s.length; c++) { h ^= s.charCodeAt(c); h = Math.imul(h, 16777619); }
    let seed = h >>> 0;
    const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    let n = 0; const base = i * dim;
    for (let d = 0; d < dim; d++) { const v = rnd() - 0.5; data[base + d] = v; n += v * v; }
    n = Math.sqrt(n) || 1; for (let d = 0; d < dim; d++) data[base + d] /= n;
  }
  return data;
}

const FAKE_MODEL = `
export function pipeline(){
  return async function(texts){
    const dim=384;const data=new Float32Array(texts.length*dim);
    for(let i=0;i<texts.length;i++){
      let h=2166136261;const s=String(texts[i]);
      for(let c=0;c<s.length;c++){h^=s.charCodeAt(c);h=Math.imul(h,16777619);}
      let seed=h>>>0;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
      let n=0;const base=i*dim;
      for(let d=0;d<dim;d++){const v=rnd()-0.5;data[base+d]=v;n+=v*v;}
      n=Math.sqrt(n)||1;for(let d=0;d<dim;d++)data[base+d]/=n;
    }
    return {data};
  };
}
export const env={};
`;
const FAKE_URL = "data:text/javascript," + encodeURIComponent(FAKE_MODEL);

// Fake-Worker: implementiert das Modul-Protokoll (init/embed → ready/result/
// error) asynchron, ohne echten transformers.js-Lauf. „mode" steuert Fehler.
function makeFakeWorkerClass(mode) {
  return class FakeWorker {
    constructor(url, opts) { this.url = url; this.opts = opts; this.onmessage = null; this.onerror = null; }
    postMessage(m) {
      const send = (data) => Promise.resolve().then(() => { if (this.onmessage) this.onmessage({ data }); });
      if (m.type === "init") { send({ type: "ready", id: m.id }); return; }
      if (m.type === "embed") {
        if (mode === "embed-error") { send({ type: "error", id: m.id, error: "simulierter Worker-Fehler" }); return; }
        send({ type: "result", id: m.id, data: fakeVectors(m.texts, 384), count: m.texts.length });
      }
    }
    terminate() { this.terminated = true; }
  };
}

function loadFresh() {
  let src = readFileSync(resolve(repoRoot, "src/modules/03_embedding.js"), "utf8");
  src = src.replace(
    '"https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"',
    JSON.stringify(FAKE_URL));
  // frische Modul-Instanz (eigener Closure-State)
  delete globalThis.SbkimEmbedding;
  new Function("global", "window", "globalThis", "console", src)(
    globalThis, globalThis, globalThis, console);
  return globalThis.SbkimEmbedding;
}

function installWorker(mode) {
  globalThis.window = globalThis;
  globalThis.Worker = makeFakeWorkerClass(mode);
  if (!globalThis.Blob) globalThis.Blob = class { constructor() {} };
  if (!globalThis.URL) globalThis.URL = {};
  globalThis.URL.createObjectURL = () => "blob:fake";
}
function removeWorker() {
  delete globalThis.Worker;
  if (globalThis.URL) delete globalThis.URL.createObjectURL;
}
function l2(v) { let n = 0; for (let i = 0; i < v.length; i++) n += v[i] * v[i]; return Math.sqrt(n); }
function eq(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-6) return false; return true; }

// stub fetch damit detectModelSource fail-soft "remote" liefert (kein echtes Netz)
globalThis.fetch = async () => { throw new Error("kein Netz im Test"); };

(async function () {
  console.log("== A) Worker vorhanden → init nutzt ihn ==");
  installWorker("ok");
  let E = loadFresh();
  await E.init();
  let st = E._workerState();
  ok(st.active === true, "Worker ist aktiv nach init", JSON.stringify(st));
  ok(st.hasWorker === true, "Worker-Instanz gebaut", JSON.stringify(st));
  ok(E.isReady() === true, "isReady() true über Worker", E.isReady());
  const vW = await E.embedQuery("erfrischender Sommerdrink");
  ok(vW instanceof Float32Array && vW.length === 384, "embedQuery → Float32Array(384)", vW && vW.length);
  ok(Math.abs(l2(vW) - 1) < 1e-5, "Vektor L2-normalisiert", l2(vW));

  console.log("== B) Parität Worker == Haupt-Faden ==");
  // gleiche Eingabe, Haupt-Faden (kein Worker)
  removeWorker();
  E = loadFresh();
  await E.init();
  ok(E._workerState().active === false, "ohne Worker: Haupt-Faden aktiv", JSON.stringify(E._workerState()));
  const vM = await E.embedQuery("erfrischender Sommerdrink");
  ok(eq(vW, vM), "Worker-Vektor == Haupt-Faden-Vektor (identisch)", "diff");

  console.log("== C) Fail-soft: kein Worker → Haupt-Faden ==");
  ok(vM instanceof Float32Array && vM.length === 384, "embedQuery ohne Worker liefert Vektor", vM && vM.length);
  ok(E._workerState().failed === true || E._workerState().hasWorker === false,
     "kein aktiver Worker registriert", JSON.stringify(E._workerState()));

  console.log("== D) Worker-Fehler beim Embed → Rückfall ==");
  installWorker("embed-error");
  E = loadFresh();
  await E.init(); // init (ready) klappt noch
  ok(E._workerState().active === true, "vor dem Fehler: Worker aktiv", JSON.stringify(E._workerState()));
  const vErr = await E.embedQuery("erfrischender Sommerdrink");
  ok(vErr instanceof Float32Array && vErr.length === 384, "embedQuery trotz Worker-Fehler → Vektor", vErr && vErr.length);
  ok(eq(vErr, vM), "Rückfall liefert denselben Haupt-Faden-Vektor", "diff");
  ok(E._workerState().failed === true, "Worker als gescheitert markiert", JSON.stringify(E._workerState()));

  console.log("== E) init({worker:false}) → nie ein Worker ==");
  installWorker("ok");
  E = loadFresh();
  await E.init({ worker: false });
  ok(E._workerState().hasWorker === false, "worker:false → kein Worker gebaut", JSON.stringify(E._workerState()));
  const vOff = await E.embedQuery("erfrischender Sommerdrink");
  ok(eq(vOff, vM), "worker:false liefert Haupt-Faden-Vektor", "diff");
  removeWorker();

  console.log("\nTotal: " + (pass + fail) + " Proben, " + pass + " grün, " + fail + " rot.");
  process.exit(fail === 0 ? 0 : 1);
})();
