// Headless smoke test for Bau 23 — Rendezvous (gemeinsamer Raum). Run with
//   node tests/smoke_bau23_rendezvous.mjs
// Kein Unit-Test-Framework — bau-sitzung-smoke-probe analog smoke_bau05_nostr,
// druckt eine Tabelle und beendet non-zero bei jedem Fehler.
//
// Modul 23 ist DOM-frei und vollständig dependency-injizierbar (init nimmt
// relayClient/anastomose/spore). Wir spielen ein IN-MEMORY-MOCK-RELAIS + eine
// Mock-Spore + eine Mock-Anastomose ein — KEIN WebSocket, KEIN Netz, KEINE
// echte Krypto. Bewiesen wird die Rendezvous-LOGIK (Visitenkarte heften,
// Raum lesen/dedupen/eigene filtern, Handshake an die lebende Karte,
// fail-soft ohne Relais). Der echte Relais-Pfad (Modul 05b) ist browser-only.
//
// Proben:
//   1) Modul lädt, Surface + _meta (tag/presenceKind/version) korrekt.
//   2) init() baut NICHTS auf (kein publish, kein listenNostr) — Empfangsmodus.
//   3) announce() ohne Relais → { ok:false }.
//   4) announce() ohne Identität → { ok:false }, Grund nennt Identität.
//   5) announce() mit Relais + Identität → Visitenkarte korrekt geheftet +
//      listenNostr gerufen.
//   6) discover() liest Karten, dedupt nach nodeId (frischeste), filtert eigene.
//   7) connectAndAnnounce() ohne Identität + createIdentity → created:true.
//   8) connectAndAnnounce() ohne Identität + ohne Callback → ok:false.
//   9) handshakeCard() established (Mock) → outcome:"established", score.
//  10) handshakeCard() Timeout (Mock wirft) → outcome:"timeout", KEIN Throw.
//  11) handshakeCard() ungültige Karte → outcome:"error".

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("window", "globalThis", "console", src)(globalThis, globalThis, console);
}

// Modul 04 (real) zuerst — Modul 23 nutzt SbkimMatch.relatedness optional für
// den Verwandtschafts-Score der Raum-Karten (reine Anzeige). Modul 23 danach.
loadModule("src/modules/04_match.js");
loadModule("src/modules/23_rendezvous.js");
const SbkimRendezvous = globalThis.SbkimRendezvous;
const SbkimMatch = globalThis.SbkimMatch;

// Echte Knoten-Domänen-Vektoren (gleiche Quelle wie smoke_bau04e/22e) — für den
// realistischen Verwandtschafts-Score-Test (Mixarium↔Rezeptbuch verwandt,
// Mixarium↔Sage/BookLedger unverwandt).
const VEC_SOURCES = {
  Sage: "sbkim/spore.json",
  Rezeptbuch: "sbkim/rezeptbuch_inbox.json",
  Mixarium: "sbkim/mixarium_inbox.json",
  BookLedger: "sbkim/bookledgerpro_inbox.json",
};
const VEC = {};
for (const [k, f] of Object.entries(VEC_SOURCES)) {
  try {
    const j = JSON.parse(readFileSync(join(repoRoot, f), "utf8"));
    if (Array.isArray(j.domainVector) && j.domainVector.length === 384) VEC[k] = j.domainVector;
  } catch { /* fehlt -> Probe überspringt */ }
}

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- In-Memory-Mock-Relais (mit gespeicherten Events + since-Filter) ----
function makeMockRelay() {
  const store = [];
  const subs = [];
  let seq = 0;
  function matches(filter, ev) {
    if (filter.kinds && filter.kinds.indexOf(ev.kind) === -1) return false;
    if (typeof filter.since === "number" && ev.created_at < filter.since) return false;
    for (const key of Object.keys(filter)) {
      if (key === "kinds" || key === "since") continue;
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
    published: [],
    async publish(body) {
      const ev = {
        id: "mock-" + (++seq), pubkey: "mockpub",
        kind: body.kind, created_at: body.created_at, tags: body.tags, content: body.content, sig: "mocksig",
      };
      store.push(ev);
      this.published.push(body);
      for (const s of subs.slice()) {
        if (matches(s.filter, ev)) Promise.resolve().then(() => { try { s.onEvent(ev); } catch (e) {} });
      }
    },
    subscribe(filter, onEvent) {
      const sub = { filter, onEvent };
      subs.push(sub);
      for (const ev of store.slice()) {
        if (matches(filter, ev)) Promise.resolve().then(() => { try { onEvent(ev); } catch (e) {} });
      }
      return function unsubscribe() {
        const i = subs.indexOf(sub);
        if (i !== -1) subs.splice(i, 1);
      };
    },
  };
}

// ---- Mock-Spore (mutable Identität) ----
function makeMockSpore(initial) {
  let own = initial || null;
  return {
    async getOwnSpore() { return own; },
    _set(s) { own = s; },
  };
}

// ---- Mock-Anastomose ----
function makeMockAnastomose() {
  const calls = { listen: 0 };
  let handshakeImpl = async () => ({ outcome: "established", score: 0.9 });
  return {
    async listenNostr() { calls.listen++; },
    handshake(spore, vec, opts) { return handshakeImpl(spore, vec, opts); },
    _setHandshake(fn) { handshakeImpl = fn; },
    _calls: calls,
  };
}

function makeSpore(id, name) {
  return { id: id, domain: name + ".example.org", publicKey: { x: "stub" }, signature: "stub" };
}
function makeSporeV(id, name, vec) {
  const s = makeSpore(id, name);
  if (vec) s.domainVector = vec;
  return s;
}

async function run() {
  // ── Probe 1: Surface + _meta ──
  record("Probe 1 — SbkimRendezvous geladen", "object", typeof SbkimRendezvous, typeof SbkimRendezvous === "object");
  for (const fn of ["init", "configure", "announce", "connectAndAnnounce", "discover", "handshakeCard"]) {
    record("Probe 1 — " + fn + " ist function", "function", typeof SbkimRendezvous[fn], typeof SbkimRendezvous[fn] === "function");
  }
  record("Probe 1 — _meta.tag", "sbkim-rdv", SbkimRendezvous._meta.tag, SbkimRendezvous._meta.tag === "sbkim-rdv");
  record("Probe 1 — _meta.presenceKind", "sbkim-presence", SbkimRendezvous._meta.presenceKind, SbkimRendezvous._meta.presenceKind === "sbkim-presence");
  record("Probe 1 — _meta.version", "0.1", SbkimRendezvous._meta.version, SbkimRendezvous._meta.version === "0.1");

  // ── Probe 2: init() baut nichts auf ──
  const relay0 = makeMockRelay();
  const ana0 = makeMockAnastomose();
  await SbkimRendezvous.init({ nodeName: "Test-Knoten", relayClient: relay0, anastomose: ana0, spore: makeMockSpore(null), listenMs: 50 });
  record("Probe 2 — init publiziert nichts", "0", String(relay0.published.length), relay0.published.length === 0);
  record("Probe 2 — init ruft listenNostr nicht", "0", String(ana0._calls.listen), ana0._calls.listen === 0);
  record("Probe 2 — _meta.nodeName übernommen", "Test-Knoten", SbkimRendezvous._meta.nodeName, SbkimRendezvous._meta.nodeName === "Test-Knoten");

  // ── Probe 3: announce ohne Relais ──
  SbkimRendezvous.configure({ relayClient: false, anastomose: ana0, spore: makeMockSpore(makeSpore("OWN-ID", "test")) });
  const r3 = await SbkimRendezvous.announce();
  record("Probe 3 — announce ohne Relais ok:false", "false", String(r3.ok), r3.ok === false);

  // ── Probe 4: announce ohne Identität ──
  SbkimRendezvous.configure({ relayClient: relay0, spore: makeMockSpore(null) });
  const r4 = await SbkimRendezvous.announce();
  record("Probe 4 — announce ohne Identität ok:false", "false", String(r4.ok), r4.ok === false);
  record("Probe 4 — Grund nennt Identität", "ja", (r4.reason && /Identit/.test(r4.reason)) ? "ja" : "nein", !!(r4.reason && /Identit/.test(r4.reason)));

  // ── Probe 5: announce mit Relais + Identität ──
  const relay5 = makeMockRelay();
  const ana5 = makeMockAnastomose();
  SbkimRendezvous.configure({ nodeName: "Mein Knoten", relayClient: relay5, anastomose: ana5, spore: makeMockSpore(makeSpore("OWN-ID-5", "mein")) });
  const r5 = await SbkimRendezvous.announce();
  record("Probe 5 — announce ok:true", "true", String(r5.ok), r5.ok === true);
  record("Probe 5 — genau eine Karte publiziert", "1", String(relay5.published.length), relay5.published.length === 1);
  let card5 = null;
  try { card5 = JSON.parse(relay5.published[0].content); } catch (e) {}
  record("Probe 5 — Karte.kind = sbkim-presence", "sbkim-presence", card5 && card5.kind, card5 && card5.kind === "sbkim-presence");
  record("Probe 5 — Karte.nodeId = OWN-ID-5", "OWN-ID-5", card5 && card5.nodeId, card5 && card5.nodeId === "OWN-ID-5");
  record("Probe 5 — Karte.nodeName = Mein Knoten", "Mein Knoten", card5 && card5.nodeName, card5 && card5.nodeName === "Mein Knoten");
  record("Probe 5 — Karte.spore vorhanden", "ja", card5 && card5.spore ? "ja" : "nein", !!(card5 && card5.spore && card5.spore.id === "OWN-ID-5"));
  const tag5 = relay5.published[0].tags && relay5.published[0].tags[0];
  record("Probe 5 — Event-Tag [t, sbkim-rdv]", "t/sbkim-rdv", tag5 ? tag5.join("/") : "(keins)", !!(tag5 && tag5[0] === "t" && tag5[1] === "sbkim-rdv"));
  record("Probe 5 — listenNostr gerufen", "1", String(ana5._calls.listen), ana5._calls.listen === 1);

  // ── Probe 6: discover (dedupe + eigene filtern) ──
  const relay6 = makeMockRelay();
  const ana6 = makeMockAnastomose();
  // Fremde Karte A (alt), dann A (frisch) → frischeste gewinnt; Karte B; eigene Karte (muss raus).
  const tNow = Math.floor(Date.now() / 1000);
  async function putCard(relay, nodeId, name, ts) {
    await relay.publish({ kind: 1, created_at: ts, tags: [["t", "sbkim-rdv"]],
      content: JSON.stringify({ kind: "sbkim-presence", nodeId, nodeName: name, spore: makeSpore(nodeId, name), ts }) });
  }
  await putCard(relay6, "PEER-A", "Peer A alt", tNow - 100);
  await putCard(relay6, "PEER-A", "Peer A frisch", tNow - 5);
  await putCard(relay6, "PEER-B", "Peer B", tNow - 50);
  await putCard(relay6, "OWN-ID-6", "Ich selbst", tNow - 10);
  SbkimRendezvous.configure({ relayClient: relay6, anastomose: ana6, spore: makeMockSpore(makeSpore("OWN-ID-6", "ich")) });
  const r6 = await SbkimRendezvous.discover({ listenMs: 60 });
  record("Probe 6 — discover ok:true", "true", String(r6.ok), r6.ok === true);
  record("Probe 6 — zwei fremde Karten (eigene gefiltert)", "2", String(r6.cards.length), r6.cards.length === 2);
  const a6 = r6.cards.find((c) => c.nodeId === "PEER-A");
  record("Probe 6 — Peer A frischeste Karte gewinnt", "Peer A frisch", a6 && a6.nodeName, !!(a6 && a6.nodeName === "Peer A frisch"));
  record("Probe 6 — eigene nodeId nicht in den Karten", "nicht da", r6.cards.some((c) => c.nodeId === "OWN-ID-6") ? "fälschlich da" : "nicht da", !r6.cards.some((c) => c.nodeId === "OWN-ID-6"));
  record("Probe 6 — ts-absteigend sortiert", "ja", (r6.cards[0].ts >= r6.cards[1].ts) ? "ja" : "nein", r6.cards[0].ts >= r6.cards[1].ts);

  // ── Probe 6b: collapse-by-name — Klaus' „immer mehr Identitäten" ──
  // Ein Knoten hinterlässt durch wiederholtes „Aufräumen" mehrere Alt-IDs mit
  // gleichem Namen; deren Kärtchen leben ~30 min weiter. Der Raum soll pro NAME
  // nur die NEUESTE Karte zeigen (so trifft „Fragen" die lauschende ID).
  const relay6b = makeMockRelay();
  const ana6b = makeMockAnastomose();
  await putCard(relay6b, "MIX-ALT", "Mein Mixarium", tNow - 600); // ~10 min alt
  await putCard(relay6b, "MIX-NEU", "Mein Mixarium", tNow - 3);   // gerade eben
  await putCard(relay6b, "SAGE-1", "Sage-Protokoll", tNow - 20);
  SbkimRendezvous.configure({ relayClient: relay6b, anastomose: ana6b, spore: makeMockSpore(makeSpore("OWN-ID-6B", "ich")) });
  const r6b = await SbkimRendezvous.discover({ listenMs: 60 });
  record("Probe 6b — Mixarium ×2 → EINE Karte (newest-per-name)", "2", String(r6b.cards.length), r6b.cards.length === 2);
  const mix6b = r6b.cards.find((c) => c.nodeName === "Mein Mixarium");
  record("Probe 6b — die frischeste Mixarium-ID gewinnt", "MIX-NEU", mix6b && mix6b.nodeId, !!(mix6b && mix6b.nodeId === "MIX-NEU"));
  const r6bOff = await SbkimRendezvous.discover({ listenMs: 60, collapseByName: false });
  record("Probe 6b — collapseByName:false zeigt beide Alt-IDs", "3", String(r6bOff.cards.length), r6bOff.cards.length === 3);

  // ── Probe 7: connectAndAnnounce ohne Identität + createIdentity ──
  const relay7 = makeMockRelay();
  const ana7 = makeMockAnastomose();
  const spore7 = makeMockSpore(null);
  SbkimRendezvous.configure({ nodeName: "Frischling", relayClient: relay7, anastomose: ana7, spore: spore7 });
  const r7 = await SbkimRendezvous.connectAndAnnounce({
    createIdentity: async () => { spore7._set(makeSpore("FRESH-ID", "frisch")); },
  });
  record("Probe 7 — connectAndAnnounce ok:true", "true", String(r7.ok), r7.ok === true);
  record("Probe 7 — created:true", "true", String(r7.created), r7.created === true);
  record("Probe 7 — nodeId = FRESH-ID", "FRESH-ID", r7.nodeId, r7.nodeId === "FRESH-ID");
  record("Probe 7 — Karte publiziert", "1", String(relay7.published.length), relay7.published.length === 1);

  // ── Probe 8: connectAndAnnounce ohne Identität + ohne Callback ──
  SbkimRendezvous.configure({ relayClient: makeMockRelay(), spore: makeMockSpore(null) });
  const r8 = await SbkimRendezvous.connectAndAnnounce();
  record("Probe 8 — ohne Callback ok:false", "false", String(r8.ok), r8.ok === false);
  record("Probe 8 — created:false", "false", String(r8.created), r8.created === false);

  // ── Probe 9: handshakeCard established ──
  const ana9 = makeMockAnastomose();
  ana9._setHandshake(async () => ({ outcome: "established", score: 0.8642 }));
  SbkimRendezvous.configure({ anastomose: ana9, relayClient: makeMockRelay(), spore: makeMockSpore(makeSpore("OWN-9", "o")) });
  const r9 = await SbkimRendezvous.handshakeCard({ nodeId: "PEER-9", spore: makeSpore("PEER-9", "p") });
  record("Probe 9 — handshakeCard outcome established", "established", r9.outcome, r9.outcome === "established");
  record("Probe 9 — score durchgereicht", "0.8642", String(r9.score), r9.score === 0.8642);

  // ── Probe 10: handshakeCard Timeout (Mock wirft) → fail-soft ──
  const ana10 = makeMockAnastomose();
  ana10._setHandshake(async () => { const e = new Error("kein Echo"); e.name = "HandshakeTimeoutError"; throw e; });
  SbkimRendezvous.configure({ anastomose: ana10 });
  let threw10 = false, r10 = null;
  try { r10 = await SbkimRendezvous.handshakeCard({ nodeId: "PEER-10", spore: makeSpore("PEER-10", "p") }); }
  catch (e) { threw10 = true; }
  record("Probe 10 — handshakeCard wirft NICHT bei Timeout", "kein Throw", threw10 ? "geworfen!" : "kein Throw", threw10 === false);
  record("Probe 10 — outcome:timeout", "timeout", r10 && r10.outcome, r10 && r10.outcome === "timeout");

  // ── Probe 11: handshakeCard ungültige Karte ──
  const r11 = await SbkimRendezvous.handshakeCard({ nodeId: "X" });
  record("Probe 11 — ungültige Karte outcome:error", "error", r11.outcome, r11.outcome === "error");

  // ── Probe 12: relatednessForCards (REINE ANZEIGE, gatet nichts) ──
  record("Probe 12 — relatednessForCards ist function", "function",
    typeof SbkimRendezvous.relatednessForCards, typeof SbkimRendezvous.relatednessForCards === "function");
  record("Probe 12 — Modul 04 vorhanden (_meta.hasMatch)", "true",
    String(SbkimRendezvous._meta.hasMatch), SbkimRendezvous._meta.hasMatch === true);
  if (VEC.Mixarium && VEC.Rezeptbuch && VEC.Sage && VEC.BookLedger) {
    const ownSpore = makeSporeV("OWN-MIX", "mixarium", VEC.Mixarium); // eigene Domäne: Getränke
    const cards = [
      { nodeId: "A", nodeName: "Rezeptbuch", spore: makeSporeV("A", "rezeptbuch", VEC.Rezeptbuch), ts: 3, ageSec: 1 },
      { nodeId: "B", nodeName: "Sage", spore: makeSporeV("B", "sage", VEC.Sage), ts: 2, ageSec: 1 },
      { nodeId: "C", nodeName: "BookLedger", spore: makeSporeV("C", "blp", VEC.BookLedger), ts: 1, ageSec: 1 },
    ];
    const enr = SbkimRendezvous.relatednessForCards(cards, ownSpore);
    const byName = (n) => enr.find((c) => c.nodeName === n);
    record("Probe 12 — Eingabe NICHT mutiert (kein relatedness-Feld am Original)", "undefined",
      String(cards[0].relatedness), cards[0].relatedness === undefined);
    record("Probe 12 — jede Karte bekommt einen relatedness-Wert (Anzeige)", "3 Zahlen",
      String(enr.filter((c) => typeof c.relatedness === "number").length),
      enr.filter((c) => typeof c.relatedness === "number").length === 3);
    record("Probe 12 — Schwester Rezeptbuch isRelated:true (Essen↔Trinken)", "true",
      String(byName("Rezeptbuch").isRelated), byName("Rezeptbuch").isRelated === true);
    record("Probe 12 — Hub Sage isRelated:false (fremde Domäne, Boden)", "false",
      String(byName("Sage").isRelated), byName("Sage").isRelated === false);
    record("Probe 12 — BookLedger isRelated:false (Buchhaltung, Boden)", "false",
      String(byName("BookLedger").isRelated), byName("BookLedger").isRelated === false);
    record("Probe 12 — Rezeptbuch verwandter als Sage (zentriert)", "true",
      String(byName("Rezeptbuch").relatedness > byName("Sage").relatedness),
      byName("Rezeptbuch").relatedness > byName("Sage").relatedness);
  } else {
    record("Probe 12 — Referenz-Vektoren vorhanden", "ja", "fehlen (übersprungen)", true);
  }

  // ── Probe 13: fail-soft Anreicherung ──
  const fsCards = [{ nodeId: "Z", nodeName: "Ohne Vektor", spore: { id: "Z" }, ts: 1, ageSec: 1 }];
  const fs1 = SbkimRendezvous.relatednessForCards(fsCards, makeSporeV("OWN", "o", VEC.Sage || null));
  record("Probe 13 — Karte ohne domainVector → relatedness null (kein Throw)", "null",
    String(fs1[0].relatedness), fs1[0].relatedness === null && fs1[0].isRelated === false);
  const fs2 = SbkimRendezvous.relatednessForCards(fsCards, null);
  record("Probe 13 — ohne eigene Spore → relatedness null", "null",
    String(fs2[0].relatedness), fs2[0].relatedness === null);
  record("Probe 13 — leere Liste → leer (kein Throw)", "0",
    String(SbkimRendezvous.relatednessForCards([], null).length),
    SbkimRendezvous.relatednessForCards([], null).length === 0);

  // ── Probe 14: discover() reicht die Anreicherung durch (end-to-end) ──
  if (VEC.Mixarium && VEC.Rezeptbuch) {
    const relay14 = makeMockRelay();
    const ana14 = makeMockAnastomose();
    const t = Math.floor(Date.now() / 1000);
    relay14.publish({ kind: 1, created_at: t, tags: [["t", "sbkim-rdv"]],
      content: JSON.stringify({ kind: "sbkim-presence", nodeId: "PEER-REZ", nodeName: "Rezeptbuch",
        spore: makeSporeV("PEER-REZ", "rezeptbuch", VEC.Rezeptbuch), ts: t }) });
    SbkimRendezvous.configure({ relayClient: relay14, anastomose: ana14,
      spore: makeMockSpore(makeSporeV("OWN-MIX2", "mixarium", VEC.Mixarium)) });
    const r14 = await SbkimRendezvous.discover({ listenMs: 60 });
    const rez = r14.cards.find((c) => c.nodeId === "PEER-REZ");
    record("Probe 14 — discover-Karte trägt relatedness (Anzeige)", "Zahl",
      typeof (rez && rez.relatedness), rez && typeof rez.relatedness === "number");
    record("Probe 14 — Schwester-Karte isRelated:true via discover", "true",
      String(rez && rez.isRelated), !!(rez && rez.isRelated === true));
  }

  // ── Probe 15: Andock-Pfad UNBERÜHRT (Regression) ──
  record("Probe 15 — PROVIDER_MIN_MATCH bleibt 0.80 (Handshake-Boden)", "0.8",
    String(SbkimMatch.PROVIDER_MIN_MATCH), SbkimMatch.PROVIDER_MIN_MATCH === 0.80);
  if (VEC.Mixarium && VEC.Sage) {
    const above = SbkimMatch.isAboveProviderThreshold(
      SbkimMatch.match(new Float32Array(VEC.Mixarium), new Float32Array(VEC.Sage)));
    record("Probe 15 — Hub↔Endknoten match() ≥ 0.80 (relatedness gatet nichts)", "true",
      String(above), above === true);
  }

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
  process.exit(fail > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Smoke-Test gescheitert:", err);
  process.exit(1);
});
