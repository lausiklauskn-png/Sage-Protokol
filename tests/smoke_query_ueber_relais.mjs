// Headless smoke test — Frage→Antwort über das Nostr-Brett (Bau Query-über-
// Relais, 2026-06-28). Run with:
//   node tests/smoke_query_ueber_relais.mjs
// (nach `npm install --no-save fake-indexeddb`).
//
// WAS BEWIESEN WIRD: die fehlende VERDRAHTUNG der zwei Hälften — eine Frage
// geht als solche über das server-lose Relais-Medium an einen anderen Knoten,
// und eine BEDEUTUNGS-sortierte Antwort aus dessen AKTUELLEM Inhalt kommt
// zurück (Modul 05 queryNostr/listenNostr-Query-Zweig + Modul 04.C queryLocal).
//
// EHRLICHE GRENZEN (nicht geschönt):
//  - Das ECHTE Relais (wss://relay.family-projekt.de) ist aus der Sandbox NICHT
//    erreichbar. Getestet wird die MODUL-LOGIK gegen ein IN-MEMORY-MOCK-RELAIS
//    (kein WebSocket, kein Netz). Der echte WebSocket-Client (Modul 05b) ist
//    browser-only und hier NICHT getestet — Live-Sichttest wartet auf Klaus.
//  - Das semantische Embedding ist hier ein DETERMINISTISCHER Stub
//    (SbkimEmbedding.embedQuery). Das echte e5-small-Modell ist anderweitig
//    bewiesen; dieser Test prüft die VERDRAHTUNG, nicht das Modell.
//  - Das Brett trägt öffentliche Zettel ohne Haltbarkeit/Spam-Schutz — das
//    Medium ist bewiesen, nicht gehärtet (eigene Folge-Sitzung).
//
// Proben:
//  1) Oberfläche — queryNostr exportiert; _meta nostrTagQuery/QueryReply.
//  2) Empfänger-Pfad — fremder Frager publiziert Frage über das Relais, der
//     lauschende Knoten antwortet mit bedeutungs-sortierten Treffern; oberster
//     Treffer ist der semantisch nächste, Scores absteigend, Schwelle greift.
//  3) Sender-Pfad — queryNostr() publiziert die Frage + empfängt die Antwort.
//  4) Replay (doppelte nonce) am Empfänger → genau EINE Antwort.
//  5) Frage an FREMDE nodeId → ignoriert (keine Antwort).
//  6) queryNostr ohne Relay-Client → sauberes rejected, KEIN Throw.

import "fake-indexeddb/auto";
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

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob",
                "TextEncoder", "TextDecoder", "indexedDB", "fetch", "AbortController", "BroadcastChannel",
                "navigator", src
    )(globalThis, globalThis, globalThis, webcrypto, console, globalThis.btoa, globalThis.atob,
      globalThis.TextEncoder, globalThis.TextDecoder, globalThis.indexedDB,
      globalThis.fetch, globalThis.AbortController,
      typeof globalThis.BroadcastChannel === "function" ? globalThis.BroadcastChannel : undefined,
      typeof globalThis.navigator !== "undefined" ? globalThis.navigator : undefined);
}

loadModule("src/modules/01_storage.js");
loadModule("src/modules/02_spore.js");
loadModule("src/modules/04_match.js");
loadModule("src/modules/05_anastomose.js");

const SbkimSpore = globalThis.SbkimSpore;
const SbkimMatch = globalThis.SbkimMatch;
const SbkimAnastomose = globalThis.SbkimAnastomose;

const EMBEDDING_DIM = 384;
const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

// ---- Vektor-Helfer (deterministisch, aus smoke_bau04c übernommen) ----
function makeNormalizedVector(seed) {
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return (state / 0xFFFFFFFF) * 2 - 1;
  };
  const v = new Float32Array(EMBEDDING_DIM);
  let sumSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) { v[i] = next(); sumSq += v[i] * v[i]; }
  const norm = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) v[i] /= norm;
  return v;
}
function mixedVec(reference, target, noiseSeed) {
  const noise = makeNormalizedVector(noiseSeed);
  const a = target, b = Math.sqrt(Math.max(0, 1 - target * target));
  const out = new Float32Array(EMBEDDING_DIM);
  let sumSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) { out[i] = a * reference[i] + b * noise[i]; sumSq += out[i] * out[i]; }
  const n = Math.sqrt(sumSq);
  for (let i = 0; i < EMBEDDING_DIM; i++) out[i] /= n;
  return out;
}

// Die Frage "Hausmittel gegen Wespen" wird auf den Referenz-Vektor abgebildet.
const queryVec = makeNormalizedVector(42);
globalThis.SbkimEmbedding = { embedQuery: async () => queryVec };

// Korpus des Antwort-Knotens — drei Einträge mit unterschiedlicher Nähe zur
// Frage. Nur Bedeutung zählt (kein Stichwort-Match): der Schoko-Eintrag liegt
// unter der Schwelle 0.80 und fällt raus, obwohl er ein "Rezept" ist.
const corpus = [
  { label: "Wespen vom Tisch fernhalten (Hausmittel)", passageVec: mixedVec(queryVec, 0.99, 7), anchorId: "a-wespe" },
  { label: "Insektenstich kühlen und behandeln",        passageVec: mixedVec(queryVec, 0.88, 11), anchorId: "a-stich" },
  { label: "Schokokuchen mit Kirschen",                 passageVec: mixedVec(queryVec, 0.20, 13), anchorId: "a-kuchen" },
];

// ---- In-Memory-Mock-Relais (aus smoke_bau05_nostr übernommen) ----
function makeMockRelay() {
  const subs = [];
  let counter = 0, eventSeq = 0;
  function matches(filter, ev) {
    if (filter.kinds && filter.kinds.indexOf(ev.kind) === -1) return false;
    for (const key of Object.keys(filter)) {
      if (key === "kinds") continue;
      if (key.startsWith("#")) {
        const tagName = key.slice(1);
        const want = filter[key];
        const have = (ev.tags || []).filter((t) => t[0] === tagName).map((t) => t[1]);
        if (!have.some((v) => want.indexOf(v) !== -1)) return false;
      }
    }
    return true;
  }
  return {
    async publish(body) {
      const ev = { id: "mock-" + (++eventSeq), pubkey: "mockpub", kind: body.kind,
        created_at: body.created_at, tags: body.tags, content: body.content, sig: "mocksig" };
      for (const s of subs.slice()) {
        if (matches(s.filter, ev)) Promise.resolve().then(() => { try { s.onEvent(ev); } catch (e) {} });
      }
    },
    subscribe(filter, onEvent) {
      const id = "sub-" + (++counter);
      const sub = { id, filter, onEvent };
      subs.push(sub);
      return function unsubscribe() { const i = subs.indexOf(sub); if (i !== -1) subs.splice(i, 1); };
    },
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FAKE_ASKER = "FRAGER-NODE-ID-AAAA0000000000000000000000000";

async function run() {
  // ── Probe 1: Oberfläche ──
  record("Probe 1 — queryNostr exportiert", "function",
         typeof SbkimAnastomose.queryNostr, typeof SbkimAnastomose.queryNostr === "function");
  record("Probe 1 — _meta.nostrTagQuery", "sbkim-query",
         SbkimAnastomose._meta.nostrTagQuery, SbkimAnastomose._meta.nostrTagQuery === "sbkim-query");
  record("Probe 1 — _meta.nostrTagQueryReply", "sbkim-query-reply",
         SbkimAnastomose._meta.nostrTagQueryReply, SbkimAnastomose._meta.nostrTagQueryReply === "sbkim-query-reply");

  // Eigene Identität + Korpus registrieren + lauschen.
  await SbkimAnastomose.init();
  const mainVec = makeNormalizedVector(1);
  await SbkimSpore.generateOwnSpore({
    domain: "sage.example.org", nodeType: "hybrid",
    endpoint: "https://sage.example.org/", domainVector: Array.from(mainVec),
  });
  const mainNodeId = await SbkimSpore.getNodeId();
  SbkimMatch.setLocalCorpus(corpus);

  const relay = makeMockRelay();
  SbkimAnastomose._setNostrRelayClient(relay);
  SbkimAnastomose._clearNostrSeen();
  await SbkimAnastomose.listenNostr();
  record("Probe 1 — nostrQueryListening nach listenNostr", "true",
         String(SbkimAnastomose._meta.nostrQueryListening), SbkimAnastomose._meta.nostrQueryListening === true);

  // ── Probe 2: Empfänger-Pfad (fremder Frager → bedeutungs-sortierte Antwort) ──
  const nonce2 = "nonce-frage-0001";
  let reply2 = null;
  const unsub2 = relay.subscribe(
    { kinds: [1], "#t": ["sbkim-query-reply"], "#d": [FAKE_ASKER] },
    (ev) => {
      if (reply2) return;
      try {
        const parsed = JSON.parse(ev.content);
        const x = (ev.tags || []).find((t) => t[0] === "x");
        if (x && x[1] === nonce2) reply2 = parsed;
      } catch (e) {}
    },
  );
  await relay.publish({
    kind: 1, created_at: Math.floor(Date.now() / 1000),
    tags: [["t", "sbkim-query"], ["d", mainNodeId], ["x", nonce2]],
    content: JSON.stringify({
      type: "sbkim-query", fromNodeId: FAKE_ASKER, toNodeId: mainNodeId,
      text: "Hausmittel gegen Wespen", k: 5, nonce: nonce2,
      protocolVersion: "0.1", timestamp: new Date().toISOString(),
    }),
  });
  await sleep(80);
  unsub2();

  record("Probe 2 — Antwort über Relais erhalten", "vorhanden",
         reply2 ? "vorhanden" : "fehlt", reply2 !== null);
  record("Probe 2 — nonceEcho = Frage-nonce", nonce2,
         reply2 ? reply2.nonceEcho : "(keine)", reply2 && reply2.nonceEcho === nonce2);
  const got = reply2 && Array.isArray(reply2.results) ? reply2.results : [];
  record("Probe 2 — Treffer vorhanden", ">=1",
         String(got.length), got.length >= 1);
  record("Probe 2 — oberster Treffer ist der semantisch nächste (Wespe)",
         "Wespen vom Tisch fernhalten (Hausmittel)",
         got[0] ? got[0].label : "(keiner)",
         got[0] && got[0].label === "Wespen vom Tisch fernhalten (Hausmittel)");
  let descending = true;
  for (let i = 1; i < got.length; i++) if (got[i].score > got[i - 1].score) descending = false;
  record("Probe 2 — Scores absteigend sortiert", "true",
         String(descending), descending === true);
  const hasKuchen = got.some((r) => r.anchorId === "a-kuchen");
  record("Probe 2 — Schoko-Eintrag (unter Schwelle 0.80) NICHT in Treffern",
         "nicht enthalten", hasKuchen ? "fälschlich da" : "korrekt raus", hasKuchen === false);

  // ── Probe 3: Sender-Pfad — queryNostr publiziert Frage + empfängt Antwort ──
  // Ziel ist ein fremder Knoten; ein manueller Responder am Relais antwortet.
  const FAKE_TARGET = "ZIEL-NODE-ID-BBBB0000000000000000000000000";
  const unsub3 = relay.subscribe(
    { kinds: [1], "#t": ["sbkim-query"], "#d": [FAKE_TARGET] },
    (ev) => {
      let q; try { q = JSON.parse(ev.content); } catch (e) { return; }
      const x = (ev.tags || []).find((t) => t[0] === "x");
      relay.publish({
        kind: 1, created_at: Math.floor(Date.now() / 1000),
        tags: [["t", "sbkim-query-reply"], ["d", q.fromNodeId], ["x", x ? x[1] : ""]],
        content: JSON.stringify({
          type: "sbkim-query-reply", nonceEcho: q.nonce, fromNodeId: FAKE_TARGET,
          toNodeId: q.fromNodeId, results: [{ label: "Antwort vom Ziel", score: 0.91, anchorId: "z-1" }],
          protocolVersion: "0.1", timestamp: new Date().toISOString(),
        }),
      });
    },
  );
  let res3 = null, threw3 = false;
  try {
    res3 = await SbkimAnastomose.queryNostr(FAKE_TARGET, "Was hast du zu Wespen?", { timeoutMs: 3000 });
  } catch (e) { threw3 = true; }
  unsub3();
  record("Probe 3 — queryNostr wirft nicht", "kein Throw",
         threw3 ? "geworfen!" : "kein Throw", threw3 === false);
  record("Probe 3 — outcome = answered", "answered",
         res3 ? res3.outcome : "(null)", res3 && res3.outcome === "answered");
  record("Probe 3 — Treffer aus der Antwort durchgereicht", "Antwort vom Ziel",
         res3 && res3.results[0] ? res3.results[0].label : "(keiner)",
         res3 && res3.results[0] && res3.results[0].label === "Antwort vom Ziel");

  // ── Probe 4: Replay (doppelte nonce) → genau EINE Antwort ──
  const nonce4 = "nonce-frage-0004";
  let count4 = 0;
  const unsub4 = relay.subscribe(
    { kinds: [1], "#t": ["sbkim-query-reply"], "#d": [FAKE_ASKER] },
    (ev) => { const x = (ev.tags || []).find((t) => t[0] === "x"); if (x && x[1] === nonce4) count4++; },
  );
  const ev4 = {
    kind: 1, created_at: Math.floor(Date.now() / 1000),
    tags: [["t", "sbkim-query"], ["d", mainNodeId], ["x", nonce4]],
    content: JSON.stringify({
      type: "sbkim-query", fromNodeId: FAKE_ASKER, toNodeId: mainNodeId,
      text: "Hausmittel gegen Wespen", k: 5, nonce: nonce4,
      protocolVersion: "0.1", timestamp: new Date().toISOString(),
    }),
  };
  await relay.publish(ev4);
  await sleep(60);
  await relay.publish(ev4);   // identischer Replay
  await sleep(60);
  unsub4();
  record("Probe 4 — Replay erzeugt genau EINE Antwort", "1", String(count4), count4 === 1);

  // ── Probe 5: Frage an FREMDE nodeId → ignoriert ──
  const nonce5 = "nonce-frage-0005";
  let replied5 = false;
  const unsub5 = relay.subscribe(
    { kinds: [1], "#t": ["sbkim-query-reply"], "#d": [FAKE_ASKER] },
    (ev) => { const x = (ev.tags || []).find((t) => t[0] === "x"); if (x && x[1] === nonce5) replied5 = true; },
  );
  await relay.publish({
    kind: 1, created_at: Math.floor(Date.now() / 1000),
    tags: [["t", "sbkim-query"], ["d", "EINE-GANZ-FREMDE-NODE-ID-999"], ["x", nonce5]],
    content: JSON.stringify({
      type: "sbkim-query", fromNodeId: FAKE_ASKER, toNodeId: "EINE-GANZ-FREMDE-NODE-ID-999",
      text: "Hausmittel gegen Wespen", k: 5, nonce: nonce5,
      protocolVersion: "0.1", timestamp: new Date().toISOString(),
    }),
  });
  await sleep(60);
  unsub5();
  record("Probe 5 — Frage an fremde nodeId → keine Antwort", "keine",
         replied5 ? "geantwortet!" : "keine", replied5 === false);

  // ── Probe 6: queryNostr ohne Relay-Client → rejected, KEIN Throw ──
  SbkimAnastomose._setNostrRelayClient(null);
  let res6 = null, threw6 = false;
  try { res6 = await SbkimAnastomose.queryNostr("IRGENDEIN-ZIEL", "Frage?"); }
  catch (e) { threw6 = true; }
  record("Probe 6 — queryNostr ohne Client wirft NICHT", "kein Throw",
         threw6 ? "geworfen!" : "kein Throw", threw6 === false);
  record("Probe 6 — outcome = rejected", "rejected",
         res6 ? res6.outcome : "(null)", res6 && res6.outcome === "rejected");
  record("Probe 6 — reason nennt 'Relay'", "ja",
         res6 && res6.reason && res6.reason.includes("Relay") ? "ja" : "nein",
         res6 && res6.reason && res6.reason.includes("Relay"));

  // Print.
  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) pass++; else fail++;
    console.log(`${r.ok ? "✓" : "✗"} ${r.probe}`);
    if (!r.ok) { console.log(`   erwartet: ${r.expected}`); console.log(`   erhalten: ${r.actual}`); }
  }
  console.log("");
  console.log(`Summe: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt`);
  try { if (SbkimAnastomose.stopListenNostr) SbkimAnastomose.stopListenNostr(); } catch (e) {}
  process.exit(fail > 0 ? 1 : 0);
}

run().catch((err) => { console.error("Smoke-Test gescheitert:", err); process.exit(1); });
