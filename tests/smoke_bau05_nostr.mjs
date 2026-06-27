// Headless smoke test for Bau 05 — Nostr-Relais-Transport (Stufe 2,
// additiv, 2026-06-27). Run with
//   node tests/smoke_bau05_nostr.mjs
// after `npm install --no-save fake-indexeddb`. WebCrypto comes from
// node:crypto. NOT a unit-test framework — bau-sitzung-smoke-probe analog
// smoke_bau05y, prints a table and exits non-zero on any failure.
//
// WICHTIG: das ECHTE Relais (wss://relay.family-projekt.de) ist aus der
// Sandbox NICHT erreichbar. Dieser Test beweist die MODUL-05-LOGIK gegen
// ein IN-MEMORY-MOCK-RELAIS (kein WebSocket, kein Netz). Der echte
// WebSocket+schnorr-Client (Modul 05b) ist browser-only und hier NICHT
// getestet — siehe Kopf-Kommentar dort: „Browser-Sichttest wartet auf Klaus".
//
// Proben:
//   1) Vorbedingung — "nostr" in allowedTransports; auto wählt nicht nostr.
//   2) Established Handshake über Mock-Relais inkl. nonceEcho/Verify/Sibling.
//   3) Verfälschter content (Signatur kaputt) → abgelehnt (kein established).
//   4) Replay (doppelte nonce) am Empfänger → keine zweite Antwort.
//   5) Event an FREMDE nodeId → vom Empfänger ignoriert (kein Reply).
//   6) Kein Relay-Client → sauberer Fehler (Result rejected), KEIN Throw.

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

const SbkimStorage = globalThis.SbkimStorage;
const SbkimSpore = globalThis.SbkimSpore;
const SbkimAnastomose = globalThis.SbkimAnastomose;

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

// ---- In-Memory-Mock-Relais ----
// Routet publish(eventBody)->fertiges Event an alle passenden Subscriptions.
// Ein gemeinsames Relais für beide Rollen (Sender + Empfänger im selben
// Prozess). KEIN WebSocket, KEIN Netz, KEINE schnorr-Signatur nötig
// (Transport-Umschlag wird nicht verifiziert — die Sicherheit kommt aus der
// Ed25519-Signatur im content, die Modul 05 prüft).
function makeMockRelay() {
  const subs = [];     // { id, filter, onEvent }
  let counter = 0;
  let eventSeq = 0;

  function matches(filter, ev) {
    if (filter.kinds && filter.kinds.indexOf(ev.kind) === -1) return false;
    for (const key of Object.keys(filter)) {
      if (key === "kinds") continue;
      if (key.startsWith("#")) {
        const tagName = key.slice(1);
        const want = filter[key];               // array
        const have = (ev.tags || [])
          .filter((t) => t[0] === tagName)
          .map((t) => t[1]);
        const hit = have.some((v) => want.indexOf(v) !== -1);
        if (!hit) return false;
      }
    }
    return true;
  }

  return {
    publishedCount: 0,
    async publish(body) {
      this.publishedCount++;
      // Vollständiges (pseudo) Event bauen — id/pubkey/sig sind hier nur
      // Platzhalter (Transport-Umschlag, nicht verifiziert).
      const ev = {
        id: "mock-" + (++eventSeq),
        pubkey: "mockpub",
        kind: body.kind,
        created_at: body.created_at,
        tags: body.tags,
        content: body.content,
        sig: "mocksig",
      };
      // Asynchron zustellen (wie ein echtes Relais).
      for (const s of subs.slice()) {
        if (matches(s.filter, ev)) {
          Promise.resolve().then(() => { try { s.onEvent(ev); } catch (e) {} });
        }
      }
    },
    subscribe(filter, onEvent) {
      const id = "sub-" + (++counter);
      const sub = { id, filter, onEvent };
      subs.push(sub);
      return function unsubscribe() {
        const i = subs.indexOf(sub);
        if (i !== -1) subs.splice(i, 1);
      };
    },
    _subCount() { return subs.length; },
  };
}

function l2normalize(vec) {
  let s = 0;
  for (let i = 0; i < vec.length; i++) s += vec[i] * vec[i];
  const inv = 1 / Math.sqrt(s);
  for (let i = 0; i < vec.length; i++) vec[i] *= inv;
  return vec;
}

// Baut einen In-Memory-Pseudo-Sender (Ed25519-Keypair + signierte Spore +
// domainVector) — eine fremde Persona, die mit uns anastomosieren will.
async function bakeSender(domain, domainVec) {
  const subtle = webcrypto.subtle;
  const keyPair = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const publicKeyJwk = await subtle.exportKey("jwk", keyPair.publicKey);
  const rawPub = await subtle.exportKey("raw", keyPair.publicKey);
  const hash = await subtle.digest("SHA-256", rawPub);
  const nodeId = SbkimAnastomose._base64urlEncode(new Uint8Array(hash));
  const sporeMeta = {
    createdAt: new Date().toISOString(),
    domain: domain,
    domainVector: Array.from(domainVec),
    embeddingModel: "Xenova/multilingual-e5-small",
    endpoint: "https://" + domain + "/",
    id: nodeId,
    nodeType: "hybrid",
    protocolVersion: "0.1",
    publicKey: publicKeyJwk,
  };
  const sig = await SbkimAnastomose._signEnvelope(sporeMeta, keyPair.privateKey);
  const signed = SbkimAnastomose._canonicalize(Object.assign({}, sporeMeta, { signature: sig }));
  return { privateKey: keyPair.privateKey, spore: signed, nodeId };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  // ── Probe 1: Vorbedingung ──
  record("Probe 1 — 'nostr' in allowedTransports",
         "true",
         SbkimAnastomose._meta.allowedTransports.includes("nostr") ? "true" : "false",
         SbkimAnastomose._meta.allowedTransports.includes("nostr"));
  record("Probe 1 — listenNostr exportiert",
         "function",
         typeof SbkimAnastomose.listenNostr,
         typeof SbkimAnastomose.listenNostr === "function");
  record("Probe 1 — _setNostrRelayClient exportiert",
         "function",
         typeof SbkimAnastomose._setNostrRelayClient,
         typeof SbkimAnastomose._setNostrRelayClient === "function");

  // Eigene Identität ("main") mit domainVector erzeugen + init.
  await SbkimAnastomose.init();
  const mainVec = new Float32Array(384);
  for (let i = 0; i < 384; i++) mainVec[i] = Math.sin(i * 0.1) * 0.05;
  l2normalize(mainVec);
  await SbkimSpore.generateOwnSpore({
    domain: "main.example.org",
    nodeType: "hybrid",
    endpoint: "https://main.example.org/",
    domainVector: Array.from(mainVec),
  });
  const mainNodeId = await SbkimSpore.getNodeId();

  // Mock-Relais einspielen + Empfänger lauschen lassen.
  const relay = makeMockRelay();
  SbkimAnastomose._setNostrRelayClient(relay);
  SbkimAnastomose._clearNostrSeen();
  await SbkimAnastomose.listenNostr();
  record("Probe 1 — nostrListening nach listenNostr",
         "true",
         SbkimAnastomose._meta.nostrListening ? "true" : "false",
         SbkimAnastomose._meta.nostrListening === true);

  // ── Probe 2: Established Handshake über Mock-Relais ──
  // Sender "alt" ist eine fremde Persona. Modul 05 kann aber nur die EIGENE
  // Identität als Sender im handshake()-Pfad nutzen. Deshalb prüfen wir den
  // vollständigen Round-Trip mit der eigenen main-Identität als Sender und
  // einem zweiten lokalen Slot als Empfänger-Persona — aber das wäre
  // Self-Hit. Stattdessen: wir bauen den signierten Request für die EIGENE
  // main-Identität an einen FREMDEN Ziel-Knoten NICHT — sondern wir testen
  // den realistischen Cross-Knoten-Fall, indem der Empfänger (this node,
  // main) per listenNostr lauscht und ein FREMDER Sender (alt) eine Anfrage
  // über das Relais schickt. Den fremden Sender simulieren wir mit
  // _buildSignedRequest (Test-Brücke) + direktem relay.publish.
  const altVec = new Float32Array(384);
  for (let i = 0; i < 384; i++) altVec[i] = Math.sin(i * 0.1) * 0.05 + Math.cos(i * 0.05) * 0.001;
  l2normalize(altVec);
  const alt = await bakeSender("alt.example.org", altVec);

  // Fremder Sender baut signierten Request an main + abonniert reply.
  const reqP2 = await SbkimAnastomose._buildSignedRequest(alt.privateKey, alt.spore, altVec, mainNodeId);
  let replyP2 = null;
  const unsubP2 = relay.subscribe(
    { kinds: [1], "#t": ["sbkim-anastomosis-reply"], "#d": [alt.nodeId] },
    (ev) => {
      if (replyP2) return;
      try {
        const parsed = JSON.parse(ev.content);
        // x-Tag = request-nonce
        const xTag = (ev.tags || []).find((t) => t[0] === "x");
        if (xTag && xTag[1] === reqP2.nonce) replyP2 = parsed;
      } catch (e) {}
    },
  );
  // Fremder Sender publiziert das Request-Event (so wie sendViaNostr es täte).
  await relay.publish({
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["t", "sbkim-anastomosis"], ["d", mainNodeId], ["x", reqP2.nonce]],
    content: JSON.stringify(reqP2),
  });
  await sleep(50);   // Mock-Relais stellt asynchron zu; Empfänger antwortet
  unsubP2();

  record("Probe 2 — Empfänger hat über Relais geantwortet",
         "reply vorhanden",
         replyP2 ? "vorhanden" : "fehlt",
         replyP2 !== null);
  record("Probe 2 — reply.outcome = established",
         "established",
         replyP2 ? replyP2.outcome : "(kein reply)",
         replyP2 && replyP2.outcome === "established");
  record("Probe 2 — reply.nonceEcho = request.nonce",
         reqP2.nonce,
         replyP2 ? replyP2.nonceEcho : "(kein reply)",
         replyP2 && replyP2.nonceEcho === reqP2.nonce);
  // Verify der Antwort-Signatur gegen receiverSpore (= main).
  let sigOkP2 = false;
  if (replyP2 && replyP2.receiverSpore) {
    sigOkP2 = await SbkimAnastomose._verifyResponseSignature(replyP2, replyP2.receiverSpore.publicKey);
  }
  record("Probe 2 — Antwort-Signatur gegen receiverSpore gültig",
         "true",
         sigOkP2 ? "true" : "false",
         sigOkP2 === true);
  // Sibling alt muss in sbkim_siblings_main stehen (Empfänger-Pfad).
  const sibP2 = await SbkimStorage.get("sbkim_siblings_main", alt.nodeId);
  record("Probe 2 — Sibling (alt) in sbkim_siblings_main",
         "vorhanden",
         sibP2 ? "vorhanden" : "fehlt",
         sibP2 && sibP2.nodeId === alt.nodeId);

  // ── Probe 3: Verfälschter content → abgelehnt ──
  const alt3 = await bakeSender("alt3.example.org", altVec);
  const reqP3 = await SbkimAnastomose._buildSignedRequest(alt3.privateKey, alt3.spore, altVec, mainNodeId);
  // content manipulieren NACH dem Signieren (Signatur passt nicht mehr).
  const tampered = JSON.parse(JSON.stringify(reqP3));
  tampered.timestamp = "2099-01-01T00:00:00.000Z";   // geändertes Feld
  let replyP3 = null;
  const unsubP3 = relay.subscribe(
    { kinds: [1], "#t": ["sbkim-anastomosis-reply"], "#d": [alt3.nodeId] },
    (ev) => {
      if (replyP3) return;
      try {
        const parsed = JSON.parse(ev.content);
        const xTag = (ev.tags || []).find((t) => t[0] === "x");
        if (xTag && xTag[1] === reqP3.nonce) replyP3 = parsed;
      } catch (e) {}
    },
  );
  await relay.publish({
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["t", "sbkim-anastomosis"], ["d", mainNodeId], ["x", reqP3.nonce]],
    content: JSON.stringify(tampered),
  });
  await sleep(50);
  unsubP3();
  // Der Empfänger antwortet (receiveHandshake wirft nie), aber mit rejected
  // (Signatur ungültig) — NICHT established.
  record("Probe 3 — verfälschter content → outcome ≠ established",
         "rejected (oder kein established)",
         replyP3 ? replyP3.outcome : "(kein reply)",
         replyP3 && replyP3.outcome === "rejected");
  const sibP3 = await SbkimStorage.get("sbkim_siblings_main", alt3.nodeId);
  record("Probe 3 — KEIN Sibling für verfälschten Sender",
         "undefined",
         sibP3 === undefined ? "undefined" : "fälschlich da",
         sibP3 === undefined);

  // ── Probe 4: Replay (doppelte nonce) → keine zweite Antwort ──
  const alt4 = await bakeSender("alt4.example.org", altVec);
  const reqP4 = await SbkimAnastomose._buildSignedRequest(alt4.privateKey, alt4.spore, altVec, mainNodeId);
  let replyCountP4 = 0;
  const unsubP4 = relay.subscribe(
    { kinds: [1], "#t": ["sbkim-anastomosis-reply"], "#d": [alt4.nodeId] },
    (ev) => {
      const xTag = (ev.tags || []).find((t) => t[0] === "x");
      if (xTag && xTag[1] === reqP4.nonce) replyCountP4++;
    },
  );
  const evP4 = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["t", "sbkim-anastomosis"], ["d", mainNodeId], ["x", reqP4.nonce]],
    content: JSON.stringify(reqP4),
  };
  await relay.publish(evP4);       // erste Anfrage
  await sleep(50);
  await relay.publish(evP4);       // identischer Replay (gleiche nonce)
  await sleep(50);
  unsubP4();
  record("Probe 4 — Replay erzeugt genau EINE Antwort",
         "1",
         String(replyCountP4),
         replyCountP4 === 1);

  // ── Probe 5: Event an FREMDE nodeId → ignoriert ──
  // Empfänger-Filter ist #d=[eigene nodeId]. Ein Event mit d=fremd erreicht
  // den listenNostr-Handler über das Mock-Relais-Routing gar nicht. Test:
  // Sender schickt an eine fremde Ziel-nodeId, kein Reply.
  const fremdeZielId = "FREMD-ZIEL-NODE-ID-0000000000000000000000000000";
  const alt5 = await bakeSender("alt5.example.org", altVec);
  const reqP5 = await SbkimAnastomose._buildSignedRequest(alt5.privateKey, alt5.spore, altVec, fremdeZielId);
  let replyP5 = false;
  const unsubP5 = relay.subscribe(
    { kinds: [1], "#t": ["sbkim-anastomosis-reply"], "#d": [alt5.nodeId] },
    () => { replyP5 = true; },
  );
  await relay.publish({
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["t", "sbkim-anastomosis"], ["d", fremdeZielId], ["x", reqP5.nonce]],
    content: JSON.stringify(reqP5),
  });
  await sleep(50);
  unsubP5();
  record("Probe 5 — Event an fremde nodeId → keine Antwort",
         "keine Antwort",
         replyP5 ? "geantwortet!" : "keine",
         replyP5 === false);

  // ── Probe 6: Kein Relay-Client → sauberer Fehler, KEIN Throw ──
  // Sender-Pfad handshake({transport:"nostr"}) ohne Client → Result rejected.
  SbkimAnastomose._setNostrRelayClient(null);   // beendet auch listenNostr
  record("Probe 6 — nostrListening nach _setNostrRelayClient(null)",
         "false",
         SbkimAnastomose._meta.nostrListening ? "true" : "false",
         SbkimAnastomose._meta.nostrListening === false);

  // Ziel-Spore (fremder, valider Knoten mit überlappendem Vektor) für den
  // Sender-Pfad. handshake prüft erst die Ziel-Spore, dann sendet es.
  const targetVec = new Float32Array(384);
  for (let i = 0; i < 384; i++) targetVec[i] = Math.sin(i * 0.1) * 0.05 + 0.001;
  l2normalize(targetVec);
  const target = await bakeSender("target.example.org", targetVec);

  let threwP6 = false;
  let resP6 = null;
  try {
    resP6 = await SbkimAnastomose.handshake(target.spore, mainVec, { transport: "nostr" });
  } catch (e) {
    threwP6 = true;
  }
  record("Probe 6 — handshake nostr ohne Client wirft NICHT",
         "kein Throw",
         threwP6 ? "geworfen!" : "kein Throw",
         threwP6 === false);
  record("Probe 6 — Result outcome = rejected",
         "rejected",
         resP6 ? resP6.outcome : "(null)",
         resP6 && resP6.outcome === "rejected");
  record("Probe 6 — reason nennt 'Relay'",
         "ja",
         resP6 && resP6.reason && resP6.reason.includes("Relay") ? "ja" : "nein",
         resP6 && resP6.reason && resP6.reason.includes("Relay"));

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

run().catch((err) => {
  console.error("Smoke-Test gescheitert:", err);
  process.exit(1);
});
