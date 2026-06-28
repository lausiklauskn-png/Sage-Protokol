// Headless smoke for the SBKIM-Verbinden-Bundle. Run:
//   node tests/smoke_bundle_connect.mjs
// Zwei Teile:
//   A) Drift-Guard — alle sbkim-bundle/modules/* sind byte-1:1 zu src/modules/*.
//   B) SbkimConnect.init-Verdrahtung gegen Mock-Globals (Storage/Spore/
//      Anastomose/Relay/RendezvousUI/Embedding) — fail-soft, mountet den Knopf,
//      baut createIdentity aus der Konfig, ruft listenNostr.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const results = [];
const record = (probe, exp, act, ok) => results.push({ probe, exp, act, ok });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- A) Drift-Guard ----
const BUNDLE_MODULES = [
  "01_storage", "02_spore", "03_embedding", "04_match", "05_anastomose",
  "05b_nostr_relay", "noble-secp256k1", "23_rendezvous", "23_rendezvous_ui",
];
for (const m of BUNDLE_MODULES) {
  let same = false;
  try {
    const a = readFileSync(resolve(repoRoot, "src/modules/" + m + ".js"));
    const b = readFileSync(resolve(repoRoot, "sbkim-bundle/modules/" + m + ".js"));
    same = a.equals(b);
  } catch (e) { same = false; }
  record("Drift-Guard " + m + " byte-1:1 zu src/modules", "identisch", same ? "identisch" : "ABWEICHUNG/fehlt", same);
}

// ---- B) SbkimConnect-Verdrahtung gegen Mocks ----
const calls = { storageInit: [], sporeInit: 0, anaInit: 0, listen: 0, embeddingInit: 0, generate: [], uiInit: [] };

const stub = {};
stub.console = console;
stub.setTimeout = setTimeout;
stub.SbkimStorage = { init: async (o) => { calls.storageInit.push(o); } };
stub.SbkimSpore = {
  init: async () => { calls.sporeInit++; },
  generateOwnSpore: async (cfg) => { calls.generate.push(cfg); return { id: "GEN" }; },
};
stub.SbkimEmbedding = { init: async () => { calls.embeddingInit++; }, embedPassage: async () => new Float32Array(384) };
stub.SbkimAnastomose = { init: async () => { calls.anaInit++; }, listenNostr: async () => { calls.listen++; } };
stub.SbkimNostrRelay = { publish: () => {}, subscribe: () => () => {} };
let capturedUiOpts = null;
stub.SbkimRendezvousUI = { init: (o) => { calls.uiInit.push(o); capturedUiOpts = o; } };
stub.dispatchEvent = () => {};
stub.CustomEvent = function (t, d) { this.type = t; this.detail = d && d.detail; };

function loadConnect() {
  const src = readFileSync(resolve(repoRoot, "sbkim-bundle/sbkim-connect.js"), "utf8");
  new Function("window", "globalThis", "console", "setTimeout", src)(stub, stub, console, setTimeout);
}
loadConnect();
const Connect = stub.SbkimConnect;

async function run() {
  record("SbkimConnect geladen", "object", typeof Connect, typeof Connect === "object");
  record("init ist function", "function", typeof (Connect && Connect.init), Connect && typeof Connect.init === "function");

  await Connect.init({
    dbSuffix: "testapp",
    nodeName: "Test-Knoten",
    endpoint: "https://example.org/test/",
    domain: "test-domaene",
    domainDescription: "Eine Test-App.",
    domainKeywords: ["a", "b"],
  });
  await sleep(60); // Auto-Lauschen-IIFE (deferred 05b-Warteschleife) durchlaufen lassen

  record("Storage.init mit dbSuffix", "testapp",
    (calls.storageInit[0] && calls.storageInit[0].dbSuffix) || "(keins)",
    calls.storageInit[0] && calls.storageInit[0].dbSuffix === "testapp");
  record("Anastomose.init gerufen", "1", String(calls.anaInit), calls.anaInit === 1);
  record("listenNostr gerufen (Auto-Lauschen)", "1", String(calls.listen), calls.listen === 1);
  record("RendezvousUI.init gerufen", "1", String(calls.uiInit.length), calls.uiInit.length === 1);
  record("UI nodeName durchgereicht", "Test-Knoten", capturedUiOpts && capturedUiOpts.nodeName, capturedUiOpts && capturedUiOpts.nodeName === "Test-Knoten");
  record("UI createIdentity ist function", "function",
    typeof (capturedUiOpts && capturedUiOpts.createIdentity),
    capturedUiOpts && typeof capturedUiOpts.createIdentity === "function");

  // createIdentity ausführen → baut Vektor + generateOwnSpore aus der Konfig.
  await capturedUiOpts.createIdentity();
  record("createIdentity: Embedding.init gerufen", "1", String(calls.embeddingInit), calls.embeddingInit === 1);
  record("createIdentity: generateOwnSpore mit nodeName", "Test-Knoten",
    calls.generate[0] && calls.generate[0].nodeName, calls.generate[0] && calls.generate[0].nodeName === "Test-Knoten");
  record("createIdentity: domainKeywords durchgereicht", "a,b",
    calls.generate[0] && (calls.generate[0].domainKeywords || []).join(","),
    calls.generate[0] && (calls.generate[0].domainKeywords || []).join(",") === "a,b");

  // fail-soft: ohne Module kein Throw.
  const stub2 = { console: console, setTimeout: setTimeout };
  const src = readFileSync(resolve(repoRoot, "sbkim-bundle/sbkim-connect.js"), "utf8");
  new Function("window", "globalThis", "console", "setTimeout", src)(stub2, stub2, console, setTimeout);
  let threw = false;
  try { await stub2.SbkimConnect.init({ nodeName: "X" }); } catch (e) { threw = true; }
  record("fail-soft: init ohne Module wirft NICHT", "kein Throw", threw ? "geworfen!" : "kein Throw", threw === false);

  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) pass++; else fail++;
    console.log(`${r.ok ? "✓" : "✗"} ${r.probe}`);
    if (!r.ok) { console.log(`   erwartet: ${r.exp}`); console.log(`   erhalten: ${r.act}`); }
  }
  console.log(`\nSumme: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt`);
  process.exit(fail > 0 ? 1 : 0);
}
run().catch((e) => { console.error("Smoke gescheitert:", e); process.exit(1); });
