// Headless smoke test for Bau 15.B — Modul 15 Membran Sub (a) read() +
// Sub (b) postMessage-Brücke. Run with `node tests/smoke_bau15b_membran.mjs`.
//
// Stubs: DOM (window/document/addEventListener), navigator.storage, crypto.
// Modul 15 ist Browser-Only — wir liefern alle benötigten Globals als
// Minimal-Stubs nach.

import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- Stubs ----

function makeStubGlobal() {
  const stub = {};
  const listeners = { message: [] };
  stub.location = { origin: "https://eigene-zelle.example" };
  stub.addEventListener = function (type, cb) {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(cb);
  };
  stub.removeEventListener = function (type, cb) {
    if (!listeners[type]) return;
    const i = listeners[type].indexOf(cb);
    if (i >= 0) listeners[type].splice(i, 1);
  };
  stub.__dispatchMessageEvent = function (event) {
    const arr = listeners.message.slice();
    for (const cb of arr) {
      try { cb(event); } catch (err) { console.error("listener threw", err); }
    }
  };
  stub.document = null; // kein DOM für Sub-(a)+(b) — Lampe/Modal optional
  stub.navigator = {
    userAgent: "SmokeTest/1.0 (Node)",
    storage: {
      estimate: async () => ({ usage: 1_000_000, quota: 100_000_000 }),
    },
  };
  stub.crypto = webcrypto;
  stub.btoa = (s) => Buffer.from(s, "binary").toString("base64");
  stub.atob = (s) => Buffer.from(s, "base64").toString("binary");
  stub.console = console;
  stub.setTimeout = setTimeout;
  stub.clearTimeout = clearTimeout;
  stub.BroadcastChannel = undefined; // optional — Sub (e) tolerant
  stub.TextEncoder = TextEncoder;
  stub.TextDecoder = TextDecoder;
  stub.Date = Date;
  stub.JSON = JSON;
  stub.Math = Math;
  stub.Promise = Promise;
  stub.Map = Map;
  stub.Array = Array;
  stub.Object = Object;
  stub.MessageEvent = function MessageEvent(type, init) {
    // Minimal stub — wir benötigen origin/data/source als Felder.
    this.type = type;
    this.origin = (init && init.origin) || "";
    this.data = init && init.data;
    this.source = (init && init.source) || null;
  };
  return { stub, listeners };
}

function loadModuleInto(stubGlobal, relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  // Wir packen den Code in eine Funktion, die alle relevanten Bindings
  // aus dem Stub injiziert. window === globalThis-Konvention (Zeile am
  // Modul-Ende: `(typeof window !== "undefined" ? window : globalThis)`).
  const wrapped = new Function(
    "window", "globalThis", "self", "console",
    "crypto", "btoa", "atob", "TextEncoder", "TextDecoder",
    "navigator", "document", "addEventListener", "removeEventListener",
    "setTimeout", "clearTimeout", "BroadcastChannel", "MessageEvent",
    "Date", "JSON", "Math", "Promise", "Map", "Array", "Object",
    src
  );
  wrapped(
    stubGlobal, stubGlobal, stubGlobal, console,
    stubGlobal.crypto, stubGlobal.btoa, stubGlobal.atob,
    stubGlobal.TextEncoder, stubGlobal.TextDecoder,
    stubGlobal.navigator, stubGlobal.document,
    stubGlobal.addEventListener.bind(stubGlobal),
    stubGlobal.removeEventListener.bind(stubGlobal),
    stubGlobal.setTimeout, stubGlobal.clearTimeout,
    stubGlobal.BroadcastChannel, stubGlobal.MessageEvent,
    stubGlobal.Date, stubGlobal.JSON, stubGlobal.Math, stubGlobal.Promise,
    stubGlobal.Map, stubGlobal.Array, stubGlobal.Object
  );
}

// ---- Test-Harness ----

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

function eq(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return a === b;
  return JSON.stringify(a) === JSON.stringify(b);
}

// ---- Test-Suite ----

async function run() {
  const { stub: g, listeners } = makeStubGlobal();
  loadModuleInto(g, "src/modules/15_membran.js");
  const SbkimMembrane = g.SbkimMembrane;
  if (!SbkimMembrane) throw new Error("SbkimMembrane wurde nicht registriert");

  // -------- Setup --------
  await SbkimMembrane.init({
    lampSelector: null,                                  // kein DOM
    mountModal: false,                                   // kein DOM
    allowedOrigins: ["https://peer-a.example", "https://peer-b.example"],
  });
  record("init ready", true, SbkimMembrane._meta.ready, SbkimMembrane._meta.ready === true);
  SbkimMembrane.fremdzugriff.clear();

  // -------- Sub (a) read() — Schema --------
  const snap1 = await SbkimMembrane.read();
  record("Sub (a) Schema-Pflichtfelder",
    ["protocolVersion","nodeId","domain","sporeUrl","domainKeywords","stammCategories","guestCategories","siblings","storage","siegel"].join(","),
    Object.keys(snap1).sort().join(","),
    snap1.protocolVersion === "0.1" &&
    "nodeId" in snap1 && "domain" in snap1 && "sporeUrl" in snap1 &&
    Array.isArray(snap1.domainKeywords) && Array.isArray(snap1.stammCategories) &&
    Array.isArray(snap1.guestCategories) && Array.isArray(snap1.siblings) &&
    snap1.storage && "quotaWarningLevel" in snap1.storage && "storagePersisted" in snap1.storage &&
    ("siegel" in snap1));

  record("Sub (a) protocolVersion = §0 '0.1'", "0.1", snap1.protocolVersion, snap1.protocolVersion === "0.1");
  record("Sub (a) siegel = null wenn Modul 16 fehlt", null, snap1.siegel, snap1.siegel === null);

  // Anti-PII: kein sbkim_keys, kein Klartext-nodeId der Geschwister.
  const json1 = JSON.stringify(snap1);
  record("Sub (a) Anti-PII — kein sbkim_keys-Marker",
    "kein sbkim_keys im JSON", json1.includes("sbkim_keys") ? "FOUND" : "OK",
    !json1.includes("sbkim_keys"));

  // Sub-(e)-Hook nach read mit snapshotByteLen
  const fzList1 = SbkimMembrane.fremdzugriff.list();
  const readEntry = fzList1[fzList1.length - 1];
  record("Sub (a) Sub-(e)-Hook geschrieben",
    "kind=membrane-read, decision=accepted, snapshotByteLen>0",
    readEntry && readEntry.kind + "/" + readEntry.decision + "/byteLen=" + (readEntry.details && readEntry.details.snapshotByteLen),
    readEntry && readEntry.kind === "membrane-read" && readEntry.decision === "accepted" &&
    readEntry.details && typeof readEntry.details.snapshotByteLen === "number" &&
    readEntry.details.snapshotByteLen > 0 &&
    readEntry.details.fieldsRequested === null);

  // -------- Sub (a) siegel — voll mit Modul 16 als Stub --------
  g.SbkimSiegel = {
    isCertified: () => true,
    getExplanation: () => ({
      certifiedAt: "2026-05-24T00:00:00.000Z",
      isCertified: true,
      repoUrl: "https://lausiklauskn-png.github.io/Sage-Protokol/",
      modules: [
        { id:"01", name:"Storage", surfaceFn:"init", lazy:false, status:"ok" },
        { id:"02", name:"Spore", surfaceFn:"getOwnSpore", lazy:false, status:"ok" },
      ],
      certifiedModules: ["01","02"],
      aspects: [],
    }),
    _meta: { ready: true },
  };
  SbkimMembrane.fremdzugriff.clear();
  const snap2 = await SbkimMembrane.read();
  record("Sub (a) siegel voll bei ready Modul 16",
    "{isCertified:true, repoUrl:'…Sage-Protokol/', certifiedModules.len=2}",
    snap2.siegel && (snap2.siegel.isCertified + "/" + (snap2.siegel.repoUrl || "").endsWith("Sage-Protokol/") + "/len=" + snap2.siegel.certifiedModules.length),
    snap2.siegel && snap2.siegel.isCertified === true &&
    snap2.siegel.repoUrl === "https://lausiklauskn-png.github.io/Sage-Protokol/" &&
    Array.isArray(snap2.siegel.certifiedModules) && snap2.siegel.certifiedModules.length === 2);

  record("Sub (a) siegelAvailable _meta-Getter", true, SbkimMembrane._meta.siegelAvailable, SbkimMembrane._meta.siegelAvailable === true);

  // Reset Modul 16 für die nächsten Tests
  g.SbkimSiegel = undefined;
  record("Sub (a) siegel null nach Reset", null, (await SbkimMembrane.read()).siegel, (await SbkimMembrane.read()).siegel === null);

  // -------- Sub (a) Anti-PII auch bei vorhandenen Geschwistern --------
  g.SbkimAnastomose = {
    listSiblings: async () => [
      { nodeId: "SECRET_PEER_NODEID_AAA", since: "2026-05-20", status: "established" },
      { nodeId: "SECRET_PEER_NODEID_BBB", since: "2026-05-21", status: "established" },
    ],
  };
  SbkimMembrane.fremdzugriff.clear();
  const snap3 = await SbkimMembrane.read();
  const json3 = JSON.stringify(snap3);
  record("Sub (a) Anti-PII — Geschwister-nodeId NICHT im Klartext",
    "SECRET_PEER_NODEID_* nicht im JSON",
    json3.includes("SECRET_PEER_NODEID_") ? "LEAK" : "OK",
    !json3.includes("SECRET_PEER_NODEID_"));
  record("Sub (a) siblings anonymisiert (nodeIdHash)",
    "[{nodeIdHash,since,status}] × 2",
    snap3.siblings.map(s => Object.keys(s).sort().join(",")).join("|"),
    snap3.siblings.length === 2 &&
    snap3.siblings.every(s => "nodeIdHash" in s && "since" in s && "status" in s && !("nodeId" in s) && !("score" in s) && !("lastSeen" in s)));
  g.SbkimAnastomose = undefined;

  // -------- Sub (b) Allowlist fail-soft --------
  // Re-Init mit gemischter Liste. Wir fangen warnings ab.
  const warnings = [];
  const origWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(" "));
  try {
    await SbkimMembrane.init({
      lampSelector: null,
      mountModal: false,
      allowedOrigins: ["https://gut.example", 42, null, "ohne-präfix.example", "https://auch-gut.example"],
    });
  } finally {
    console.warn = origWarn;
  }
  record("Sub (b) Allowlist fail-soft — 3 warns",
    3, warnings.filter(w => w.includes("Allowlist-Eintrag verworfen")).length,
    warnings.filter(w => w.includes("Allowlist-Eintrag verworfen")).length === 3);
  record("Sub (b) Allowlist nach Filter",
    ["https://gut.example", "https://auch-gut.example"].join(","),
    SbkimMembrane._meta.allowedOrigins.join(","),
    SbkimMembrane._meta.allowedOrigins.length === 2);

  // -------- Sub (b) sporeRef Schema-OK --------
  await SbkimMembrane.init({ lampSelector: null, mountModal: false,
    allowedOrigins: ["https://peer-a.example", "https://peer-b.example"] });
  SbkimMembrane.fremdzugriff.clear();
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "sporeRef", fromOrigin: "https://peer-a.example",
            nonce: "n-spr-1",
            payload: { nodeId: "peer-a-id", sporeUrl: "https://peer-a.example/sbkim/spore.json", domain: "Drinks" } },
  }));
  // dispatchOp ist async — bei sporeRef sync (kein await nötig).
  await new Promise(r => setImmediate(r));
  const sprList = SbkimMembrane.fremdzugriff.list();
  const sprEntry = sprList[sprList.length - 1];
  record("Sub (b) sporeRef OK → accepted",
    "kind=membrane-postmessage decision=accepted op=sporeRef",
    sprEntry && (sprEntry.kind + "/" + sprEntry.decision + "/" + (sprEntry.details && sprEntry.details.op)),
    sprEntry && sprEntry.kind === "membrane-postmessage" &&
    sprEntry.decision === "accepted" && sprEntry.details.op === "sporeRef");
  record("Sub (b) sporeRef im RAM-Cache", 1, SbkimMembrane._meta.recentSporeRefsCount, SbkimMembrane._meta.recentSporeRefsCount === 1);
  const cache = SbkimMembrane._meta.recentSporeRefsSnapshot;
  record("Sub (b) sporeRef-Cache Inhalt",
    "peer-a-id @ https://peer-a.example",
    cache["https://peer-a.example"] && cache["https://peer-a.example"].nodeId,
    cache["https://peer-a.example"] && cache["https://peer-a.example"].nodeId === "peer-a-id");

  // -------- Sub (b) sporeRef Schema-Fehler --------
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "sporeRef", fromOrigin: "https://peer-a.example",
            nonce: "n-spr-bad-1",
            payload: { nodeId: "peer-x", sporeUrl: 42 /* fehler */, domain: "Drinks" } },
  }));
  await new Promise(r => setImmediate(r));
  const badList = SbkimMembrane.fremdzugriff.list();
  const badEntry = badList[badList.length - 1];
  record("Sub (b) sporeRef Schema-Fehler → ignored",
    "decision=ignored", badEntry && badEntry.decision,
    badEntry && badEntry.decision === "ignored" && badEntry.details.op === "sporeRef");

  // -------- Sub (b) query Schema-OK + Modul-04.C fehlt --------
  let lastReply = null;
  const source = { postMessage: function (msg, targetOrigin) { lastReply = { msg, targetOrigin }; } };
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "query", fromOrigin: "https://peer-a.example",
            nonce: "n-q-1", payload: { text: "frage", k: 3 } },
    source: source,
  }));
  await new Promise(r => setImmediate(r));
  record("Sub (b) query Modul-04.C fehlt → fail-soft reply",
    "module-04c-not-available + decision=ignored",
    lastReply && lastReply.msg && lastReply.msg.payload && lastReply.msg.payload.error,
    lastReply && lastReply.msg && lastReply.msg.op === "queryResult" &&
    lastReply.msg.inReplyTo === "n-q-1" && lastReply.msg.payload.error === "module-04c-not-available" &&
    Array.isArray(lastReply.msg.payload.results) && lastReply.msg.payload.results.length === 0);
  const qEntry = SbkimMembrane.fremdzugriff.list().slice(-1)[0];
  record("Sub (b) query → Sub-(e) ignored", "ignored", qEntry && qEntry.decision, qEntry && qEntry.decision === "ignored");

  // -------- Sub (b) query Schema-OK + Modul 04.C vorhanden --------
  g.SbkimMatch = { queryLocal: async (text, k) => [{ label: "treffer", score: 0.9, sporeUrl: "https://x" }] };
  lastReply = null;
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "query", fromOrigin: "https://peer-a.example",
            nonce: "n-q-2", payload: { text: "frage2", k: 2 } },
    source: source,
  }));
  await new Promise(r => setImmediate(r));
  await new Promise(r => setTimeout(r, 5)); // queryLocal ist async
  record("Sub (b) query Modul 04.C vorhanden → accepted",
    "results.len=1 + decision=accepted",
    lastReply && lastReply.msg && (lastReply.msg.payload.results.length + "/" + lastReply.msg.payload.error),
    lastReply && lastReply.msg.payload.results.length === 1 && lastReply.msg.payload.error === null);
  g.SbkimMatch = undefined;

  // -------- Sub (b) query mit KI-Richter (Strang A2, Bau 04.G-Folge) --------
  // Opt-in: setQueryJudge(cfg) → der Empfänger ruft queryLocalJudged statt
  // queryLocal. Stub liefert eine erkennbar andere Trefferliste ("JUDGED"),
  // damit die Probe beweist, dass der Richter-Pfad genommen wurde.
  g.SbkimMatch = {
    queryLocal: async () => [{ label: "VORFILTER", score: 0.9, anchorId: "v1" }],
    queryLocalJudged: async (text, k, cfg) => ({
      judged: true,
      candidates: [{ label: "JUDGED", score: 0.72, anchorId: "j1", passt: true, judgeScore: 0.95 }],
      judgment: { available: true },
    }),
  };
  SbkimMembrane.setQueryJudge({ apiKey: "sk-test", provider: "claude" });
  record("Strang A2: queryJudge konfiguriert (Flag, KEIN Schlüssel-Leak)",
    true, SbkimMembrane._meta.queryJudgeConfigured, SbkimMembrane._meta.queryJudgeConfigured === true);
  lastReply = null;
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "query", fromOrigin: "https://peer-a.example",
            nonce: "n-qj-1", payload: { text: "frage-richter", k: 2 } },
    source: source,
  }));
  await new Promise(r => setImmediate(r));
  await new Promise(r => setTimeout(r, 5));
  record("Strang A2: Richter-Pfad genutzt → JUDGED-Treffer",
    "JUDGED + error=null",
    lastReply && lastReply.msg && (lastReply.msg.payload.results[0] && lastReply.msg.payload.results[0].label) + "/" + lastReply.msg.payload.error,
    lastReply && lastReply.msg.payload.error === null &&
    lastReply.msg.payload.results.length === 1 &&
    lastReply.msg.payload.results[0].label === "JUDGED" &&
    lastReply.msg.payload.results[0].passt === true);

  // setQueryJudge(null) → zurück zum rohen Vorfilter (queryLocal).
  SbkimMembrane.setQueryJudge(null);
  record("Strang A2: setQueryJudge(null) → Flag aus",
    false, SbkimMembrane._meta.queryJudgeConfigured, SbkimMembrane._meta.queryJudgeConfigured === false);
  lastReply = null;
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "query", fromOrigin: "https://peer-a.example",
            nonce: "n-qj-2", payload: { text: "frage-vorfilter", k: 2 } },
    source: source,
  }));
  await new Promise(r => setImmediate(r));
  await new Promise(r => setTimeout(r, 5));
  record("Strang A2: ohne Richter → roher Vorfilter (VORFILTER-Treffer)",
    "VORFILTER",
    lastReply && lastReply.msg && lastReply.msg.payload.results[0] && lastReply.msg.payload.results[0].label,
    lastReply && lastReply.msg.payload.results.length === 1 &&
    lastReply.msg.payload.results[0].label === "VORFILTER" &&
    lastReply.msg.payload.error === null);
  g.SbkimMatch = undefined;

  // -------- Sub (b) query mit Inklusions-Pfad (2026-08-14) --------
  // Aus BookLedgerPro in den Kanon gehoben: eine App kann ihre eigenen
  // Fachworte mitgeben, damit eine anders formulierte Frage trotzdem trifft.
  // Der Kanon kennt die Worte nicht — die App gibt sie.
  //
  // Die WICHTIGSTE Probe hier ist die erste: OHNE Konfig darf sich nichts
  // ändern. Alle anderen Knoten im Netz setzen nichts, und für sie muss der
  // Pfad exakt der alte bleiben.
  let gerufen = null;
  g.SbkimMatch = {
    queryLocal: async (text, k, opts) => {
      gerufen = { fn: "queryLocal", text, k, opts };
      return [{ label: "EINFACH", score: 0.9 }];
    },
    queryLocalMulti: async (variants, k, opts) => {
      gerufen = { fn: "queryLocalMulti", variants, k, opts };
      return [{ label: "MULTI", score: 0.8 }];
    },
    expandQuerySimple: (text, o) => [text, text + "+variante:" + Object.keys(o.synonyms).length],
  };

  async function frageStellen(nonce, text) {
    lastReply = null; gerufen = null;
    g.__dispatchMessageEvent(new g.MessageEvent("message", {
      origin: "https://peer-a.example",
      data: { type: "sbkim/membrane/v1", op: "query", fromOrigin: "https://peer-a.example",
              nonce: nonce, payload: { text: text, k: 3 } },
      source: source,
    }));
    await new Promise(r => setImmediate(r));
    await new Promise(r => setTimeout(r, 5));
  }

  record("Inklusion: Flag ist anfangs AUS",
    false, SbkimMembrane._meta.queryInclusionConfigured,
    SbkimMembrane._meta.queryInclusionConfigured === false);

  await frageStellen("n-qi-0", "ohne konfig");
  record("Inklusion AUS → unveränderter Pfad: queryLocal(text, k) OHNE Optionen",
    "queryLocal + opts=undefined",
    gerufen && gerufen.fn + " + opts=" + String(gerufen.opts),
    gerufen && gerufen.fn === "queryLocal" && gerufen.opts === undefined &&
    lastReply.msg.payload.results[0].label === "EINFACH");

  SbkimMembrane.setQueryInclusion({ synonyms: { rechnung: ["faktura"], beleg: ["quittung"] } });
  record("Inklusion: Flag an + Fachwort-Zahl sichtbar (Karte selbst bleibt drin)",
    "true/2",
    SbkimMembrane._meta.queryInclusionConfigured + "/" + SbkimMembrane._meta.queryInclusionSynonymCount,
    SbkimMembrane._meta.queryInclusionConfigured === true &&
    SbkimMembrane._meta.queryInclusionSynonymCount === 2);

  await frageStellen("n-qi-1", "faktura");
  record("Inklusion AN → A4+A1: queryLocalMulti mit Varianten + hybrid",
    "queryLocalMulti, 2 Varianten, hybrid=true",
    gerufen && gerufen.fn + ", " + (gerufen.variants || []).length + " Varianten, hybrid=" + (gerufen.opts && gerufen.opts.hybrid),
    gerufen && gerufen.fn === "queryLocalMulti" && gerufen.variants.length === 2 &&
    gerufen.opts.hybrid === true && lastReply.msg.payload.results[0].label === "MULTI");

  // Ohne Synonym-Karte, aber hybrid: A4 entfällt, A1 greift.
  SbkimMembrane.setQueryInclusion({ hybrid: true });
  await frageStellen("n-qi-2", "nur hybrid");
  record("Inklusion ohne Fachworte → A1 allein: queryLocal(text, k, {hybrid:true})",
    "queryLocal + hybrid=true",
    gerufen && gerufen.fn + " + hybrid=" + (gerufen.opts && gerufen.opts.hybrid),
    gerufen && gerufen.fn === "queryLocal" && gerufen.opts && gerufen.opts.hybrid === true);

  // Fail-soft: wirft der Multi-Pfad, fällt es auf den Hybrid-Pfad durch —
  // NICHT auf eine Fehlerantwort. Das ist der Grund, warum die Kaskade
  // überhaupt eine Kaskade ist.
  g.SbkimMatch.queryLocalMulti = async () => { throw new Error("kaputt"); };
  SbkimMembrane.setQueryInclusion({ synonyms: { a: ["b"] } });
  await frageStellen("n-qi-3", "multi kaputt");
  record("Inklusion fail-soft: Multi wirft → Rückfall auf Hybrid, KEINE Fehlerantwort",
    "queryLocal + error=null",
    gerufen && gerufen.fn + " + error=" + lastReply.msg.payload.error,
    gerufen && gerufen.fn === "queryLocal" && lastReply.msg.payload.error === null &&
    lastReply.msg.payload.results[0].label === "EINFACH");

  SbkimMembrane.setQueryInclusion(null);
  record("Inklusion: setQueryInclusion(null) → Flag wieder aus",
    false, SbkimMembrane._meta.queryInclusionConfigured,
    SbkimMembrane._meta.queryInclusionConfigured === false);
  await frageStellen("n-qi-4", "wieder aus");
  record("Inklusion aus → wieder der unveränderte Pfad",
    "queryLocal + opts=undefined",
    gerufen && gerufen.fn + " + opts=" + String(gerufen.opts),
    gerufen && gerufen.fn === "queryLocal" && gerufen.opts === undefined);
  g.SbkimMatch = undefined;

  // -------- Sub (b) hint Schema-Fehler + OK ohne Modul 14 --------
  // Schema-Fehler: vector falsche Länge.
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "hint", fromOrigin: "https://peer-a.example",
            nonce: "n-h-bad", payload: { vector: [1,2,3], label: "x", ttlMs: 1000 } },
  }));
  await new Promise(r => setImmediate(r));
  const hBadEntry = SbkimMembrane.fremdzugriff.list().slice(-1)[0];
  record("Sub (b) hint Schema-Fehler → ignored", "ignored", hBadEntry && hBadEntry.decision,
    hBadEntry && hBadEntry.decision === "ignored" && hBadEntry.details.op === "hint");

  // OK Schema, Modul 14 fehlt — console.info + ignored.
  const okVector = new Array(384).fill(0.1);
  let infoCount = 0;
  const origInfo = console.info;
  console.info = (...args) => { if (args.join(" ").includes("Modul 14")) infoCount++; };
  try {
    g.__dispatchMessageEvent(new g.MessageEvent("message", {
      origin: "https://peer-a.example",
      data: { type: "sbkim/membrane/v1", op: "hint", fromOrigin: "https://peer-a.example",
              nonce: "n-h-ok-1", payload: { vector: okVector, label: "test", ttlMs: 5000 } },
    }));
    await new Promise(r => setImmediate(r));
    // Zweiter hint — info darf NICHT erneut feuern (Drossel).
    g.__dispatchMessageEvent(new g.MessageEvent("message", {
      origin: "https://peer-a.example",
      data: { type: "sbkim/membrane/v1", op: "hint", fromOrigin: "https://peer-a.example",
              nonce: "n-h-ok-2", payload: { vector: okVector, label: "test2", ttlMs: 5000 } },
    }));
    await new Promise(r => setImmediate(r));
  } finally {
    console.info = origInfo;
  }
  record("Sub (b) hint Modul-14-fehlt-Info einmal pro Sitzung", 1, infoCount, infoCount === 1);

  // -------- Sub (b) hint mit Modul 14 vorhanden → accepted --------
  let recordLeadCalls = [];
  g.SbkimDiffusion = { recordLead: (lead) => { recordLeadCalls.push(lead); } };
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-b.example",
    data: { type: "sbkim/membrane/v1", op: "hint", fromOrigin: "https://peer-b.example",
            nonce: "n-h-m14", payload: { vector: okVector, label: "lead-1", ttlMs: 5000 } },
  }));
  await new Promise(r => setImmediate(r));
  record("Sub (b) hint Modul 14 vorhanden → accepted + recordLead aufgerufen",
    "1 Aufruf, sourceOrigin=peer-b",
    recordLeadCalls.length + "/" + (recordLeadCalls[0] && recordLeadCalls[0].sourceOrigin),
    recordLeadCalls.length === 1 && recordLeadCalls[0].sourceOrigin === "https://peer-b.example" &&
    recordLeadCalls[0].label === "lead-1");
  g.SbkimDiffusion = undefined;

  // -------- Sub (b) queryResult Match + no-Match --------
  // Match-Pfad via Test-Brücke
  const pendingP = SbkimMembrane._meta._registerPendingQueryForTest("pq-1", "https://peer-a.example");
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "queryResult", fromOrigin: "https://peer-a.example",
            nonce: "n-qr-1", inReplyTo: "pq-1",
            payload: { results: [{ label:"a", score:0.5, sporeUrl:"https://x" }], error: null } },
  }));
  await new Promise(r => setImmediate(r));
  const resolved = await pendingP;
  record("Sub (b) queryResult Match → resolved",
    "results.len=1, error=null",
    resolved && (resolved.results.length + "/" + resolved.error),
    resolved && resolved.results.length === 1 && resolved.error === null);

  // no-Match: unbekannter inReplyTo → ignored.
  SbkimMembrane.fremdzugriff.clear();
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "queryResult", fromOrigin: "https://peer-a.example",
            nonce: "n-qr-unmatched", inReplyTo: "kein-bekannter-nonce",
            payload: { results: [], error: null } },
  }));
  await new Promise(r => setImmediate(r));
  const qrUnmatchEntry = SbkimMembrane.fremdzugriff.list().slice(-1)[0];
  record("Sub (b) queryResult no-Match → ignored",
    "decision=ignored", qrUnmatchEntry && qrUnmatchEntry.decision,
    qrUnmatchEntry && qrUnmatchEntry.decision === "ignored");

  // -------- Sub (b) Replay-Dedupe --------
  SbkimMembrane.fremdzugriff.clear();
  const replayMsg = {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "sporeRef", fromOrigin: "https://peer-a.example",
            nonce: "n-replay",
            payload: { nodeId: "n1", sporeUrl: "https://x/sbkim/spore.json", domain: "T" } },
  };
  g.__dispatchMessageEvent(new g.MessageEvent("message", replayMsg));
  await new Promise(r => setImmediate(r));
  const lenAfterFirst = SbkimMembrane.fremdzugriff.list().length;
  g.__dispatchMessageEvent(new g.MessageEvent("message", replayMsg));
  await new Promise(r => setImmediate(r));
  const lenAfterReplay = SbkimMembrane.fremdzugriff.list().length;
  record("Sub (b) Replay-Dedupe — zweiter Nonce-Aufruf still verworfen",
    "1 Eintrag (kein Doppel)", lenAfterFirst + " → " + lenAfterReplay,
    lenAfterFirst === 1 && lenAfterReplay === 1);

  // -------- Sub (b) handshake-Tabu (unbekannte op) --------
  SbkimMembrane.fremdzugriff.clear();
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "handshake", fromOrigin: "https://peer-a.example",
            nonce: "n-hs-tabu", payload: { foo: "bar" } },
  }));
  await new Promise(r => setImmediate(r));
  const hsEntry = SbkimMembrane.fremdzugriff.list().slice(-1)[0];
  record("Sub (b) handshake-Tabu → unbekannte op → ignored",
    "decision=ignored op=handshake",
    hsEntry && (hsEntry.decision + "/" + hsEntry.details.op),
    hsEntry && hsEntry.decision === "ignored" && hsEntry.details.op === "handshake");

  // -------- Sub (b) Rate-Limit-Hook fail-soft + Throttle --------
  // Fail-soft: kein Modul 11 vorhanden → läuft normal weiter (oben schon
  // implizit getestet — alle accepted-Tests bewiesen das).
  // Throttle-Pfad: SbkimRateLimit liefert "throttled".
  SbkimMembrane.fremdzugriff.clear();
  g.SbkimRateLimit = { checkOrigin: () => "throttled" };
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "sporeRef", fromOrigin: "https://peer-a.example",
            nonce: "n-throttle",
            payload: { nodeId: "x", sporeUrl: "https://x/sbkim/spore.json", domain: "T" } },
  }));
  await new Promise(r => setImmediate(r));
  const thEntry = SbkimMembrane.fremdzugriff.list().slice(-1)[0];
  record("Sub (b) Rate-Limit throttled → ignored + throttled:true",
    "decision=ignored throttled=true",
    thEntry && (thEntry.decision + "/" + (thEntry.details && thEntry.details.throttled)),
    thEntry && thEntry.decision === "ignored" && thEntry.details.throttled === true);
  g.SbkimRateLimit = undefined;

  // -------- Sub (b) Nonce fehlend → ignored --------
  SbkimMembrane.fremdzugriff.clear();
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://peer-a.example",
    data: { type: "sbkim/membrane/v1", op: "sporeRef", fromOrigin: "https://peer-a.example",
            payload: { nodeId: "x", sporeUrl: "https://x/sbkim/spore.json", domain: "T" } },
  }));
  await new Promise(r => setImmediate(r));
  const noNonceEntry = SbkimMembrane.fremdzugriff.list().slice(-1)[0];
  record("Sub (b) Nonce fehlend → ignored",
    "decision=ignored nonce=null",
    noNonceEntry && (noNonceEntry.decision + "/" + noNonceEntry.details.nonce),
    noNonceEntry && noNonceEntry.decision === "ignored" && noNonceEntry.details.nonce === null);

  // -------- Sub (b) Allowlist-Reject --------
  SbkimMembrane.fremdzugriff.clear();
  g.__dispatchMessageEvent(new g.MessageEvent("message", {
    origin: "https://unbekannt.example",
    data: { type: "sbkim/membrane/v1", op: "sporeRef", fromOrigin: "https://unbekannt.example",
            nonce: "n-allowlist-rejected",
            payload: { nodeId: "x", sporeUrl: "https://x/sbkim/spore.json", domain: "T" } },
  }));
  await new Promise(r => setImmediate(r));
  const allowEntry = SbkimMembrane.fremdzugriff.list().slice(-1)[0];
  record("Sub (b) Origin nicht in Allowlist → rejected-allowlist",
    "decision=rejected-allowlist",
    allowEntry && allowEntry.decision,
    allowEntry && allowEntry.decision === "rejected-allowlist");

  // -------- Sub (b) recentSporeRefs FIFO-Eviction bei 17. Eintrag --------
  // Buffer-Reset: clear() leert FZ-Buffer, aber recentSporeRefs ist
  // separat. Wir nutzen 17 verschiedene Origins.
  await SbkimMembrane.init({ lampSelector: null, mountModal: false,
    allowedOrigins: Array.from({length: 17}, (_, i) => "https://fifo-peer-" + i + ".example") });
  // Spore-Refs leeren — wir nutzen den Test-Brücken-Pfad nicht, also
  // direkter Reset über mehrere init (init löscht nicht). Wir tun's manuell:
  // Es gibt keinen public reset; aber wir können einfach 17 frische
  // sporeRefs senden und dann prüfen, dass die Größe nicht 17 überschreitet.
  // Vorbereitung: aktuelle Größe notieren.
  const sizeBefore = SbkimMembrane._meta.recentSporeRefsCount;
  for (let i = 0; i < 17; i++) {
    g.__dispatchMessageEvent(new g.MessageEvent("message", {
      origin: "https://fifo-peer-" + i + ".example",
      data: { type: "sbkim/membrane/v1", op: "sporeRef",
              fromOrigin: "https://fifo-peer-" + i + ".example",
              nonce: "n-fifo-" + i,
              payload: { nodeId: "p-" + i, sporeUrl: "https://x", domain: "D" } },
    }));
    await new Promise(r => setImmediate(r));
  }
  const sizeAfter = SbkimMembrane._meta.recentSporeRefsCount;
  record("Sub (b) recentSporeRefs FIFO bei 17. Eintrag (max 16)",
    "16 (nicht 17)", sizeAfter, sizeAfter === 16);

  // ---- Ergebnis ----
  const ok = results.filter(r => r.ok).length;
  const total = results.length;
  for (const r of results) {
    const tag = r.ok ? "  OK" : "FAIL";
    console.log(tag + "  " + r.probe + "  →  " + (r.ok ? "" : "expected=" + JSON.stringify(r.expected) + " actual=" + JSON.stringify(r.actual)));
  }
  console.log("\n" + ok + "/" + total + " grün");
  if (ok !== total) {
    process.exitCode = 1;
  }
}

run().catch(err => { console.error("smoke crashed", err); process.exit(2); });
