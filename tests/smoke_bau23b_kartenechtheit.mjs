// Headless smoke test für Bau 23b — ECHTHEIT DER KARTEN im Rendezvous-Raum.
// Aufruf: node tests/smoke_bau23b_kartenechtheit.mjs
//
// WARUM DIESER EIGENE TEST EXISTIERT
// ----------------------------------
// `smoke_bau23_rendezvous.mjs` fährt eine Mock-Spore, die NUR `getOwnSpore`
// kann. Damit läuft `discover()` dort bewusst am fail-soft-Pfad entlang und
// meldet die Karten ehrlich als UNGEPRÜFT (`cardsVerified: false`) — die neue
// Prüfung wird von jenen 59 Proben also gar nicht ausgeführt. Dieser Test
// bringt einen Prüfer mit (`verifyForeignSpore`) und weist die Schutz-Wirkung
// wirklich nach.
//
// Proben:
//   1) Prüfer vorhanden → cardsVerified:true; echte Karte kommt durch.
//   2) Untergeschobene Spore (spore.id ≠ nodeId) → verworfen, gezählt.
//   3) verifyForeignSpore === false → verworfen.
//   4) verifyForeignSpore wirft → verworfen (kein Throw nach außen).
//   5) Kein Prüfer (Modul 02 ohne verifyForeignSpore) → App läuft weiter,
//      meldet aber ehrlich cardsVerified:false statt still durchzuwinken.
//   6) Deckel je Absender: ein Nostr-Absender bekommt höchstens 3 Identitäten.
//   7) Gesamt-Deckel: mehr als 200 Karten je Durchlauf werden abgeschnitten.
//   8) _meta nennt die Grenzen und den Prüf-Zustand.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

globalThis.window = globalThis;

function loadModule(relPath) {
  const src = readFileSync(resolve(repoRoot, relPath), "utf8");
  new Function("window", "globalThis", "console", src)(globalThis, globalThis, console);
}

loadModule("src/modules/23_rendezvous.js");
const SbkimRendezvous = globalThis.SbkimRendezvous;

const results = [];
function record(probe, expected, actual, ok) {
  results.push({ probe, expected, actual, ok });
}

const NOSTR_KIND = 1;
const RDV_TAG = "sbkim-rdv";

// ---- Mock-Relais, das FREMDE Absender einspielen kann ----------------------
// Anders als im Basis-Test brauchen wir hier Kontrolle über `ev.pubkey`, denn
// genau daran hängt der Deckel „je Absender".
function makeInjectableRelay() {
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
    async publish() { /* dieser Test liest nur */ },
    // Eine Präsenz-Karte eines beliebigen Nostr-Absenders ins Brett hängen.
    inject(senderPub, card) {
      const ev = {
        id: "inj-" + (++seq),
        pubkey: senderPub,
        kind: NOSTR_KIND,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["t", RDV_TAG]],
        content: JSON.stringify(card),
        sig: "mocksig",
      };
      store.push(ev);
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

// ---- Sporen + Prüfer ------------------------------------------------------
// Verdikt steckt im Spore-Feld `_verdict`, damit der Prüfer deterministisch und
// ohne echte Krypto entscheiden kann: "ok" | "bad" | "boom".
function makeSpore(id, verdict) {
  return { id: id, domain: id + ".example.org", publicKey: { x: "stub" }, signature: "stub", _verdict: verdict || "ok" };
}
function makeCard(nodeId, nodeName, spore) {
  return { kind: "sbkim-presence", nodeId: nodeId, nodeName: nodeName, spore: spore, ts: Math.floor(Date.now() / 1000) };
}

// Spore-Modul MIT Prüfer (der echte Fall, den Modul 02 im Browser abdeckt).
function makeSporeWithVerifier(own) {
  return {
    async getOwnSpore() { return own; },
    async verifyForeignSpore(spore) {
      if (!spore || spore._verdict === "bad") return false;
      if (spore._verdict === "boom") throw new Error("Signatur ungültig");
      return true;
    },
  };
}
// Spore-Modul OHNE Prüfer (Forker mit älterem Modul 02 / eigener Implementierung).
function makeSporeWithoutVerifier(own) {
  return { async getOwnSpore() { return own; } };
}

const OWN = makeSpore("own-node", "ok");

async function discoverWith(relay, sporeMod, injections) {
  SbkimRendezvous.init({ relayClient: relay, spore: sporeMod, anastomose: { async handshake() { return { outcome: "established" }; } } });
  for (const [sender, card] of injections) relay.inject(sender, card);
  return await SbkimRendezvous.discover({ listenMs: 40 });
}

async function run() {
  // ── Probe 1 + 2 + 3 + 4: ein Durchlauf mit vier Karten, eine gute, drei faule ──
  {
    const relay = makeInjectableRelay();
    const r = await discoverWith(relay, makeSporeWithVerifier(OWN), [
      ["senderA", makeCard("gut-1", "Ehrlicher Knoten", makeSpore("gut-1", "ok"))],
      // Untergeschoben: die Karte behauptet nodeId "falsch-1", trägt aber eine
      // fremde Spore. Genau das war vor Stufe 2b möglich.
      ["senderB", makeCard("falsch-1", "Hochstapler", makeSpore("jemand-anders", "ok"))],
      ["senderC", makeCard("unecht-1", "Ungueltige Signatur", makeSpore("unecht-1", "bad"))],
      ["senderD", makeCard("wirft-1", "Prueffehler", makeSpore("wirft-1", "boom"))],
    ]);
    const ids = r.cards.map((c) => c.nodeId).sort();
    record("Probe 1 — ok:true", true, r.ok, r.ok === true);
    record("Probe 1 — cardsVerified (Prüfer da)", true, r.cardsVerified, r.cardsVerified === true);
    record("Probe 1 — nur die echte Karte bleibt", "gut-1", ids.join(","), ids.join(",") === "gut-1");
    record("Probe 2 — untergeschobene Spore raus", false, ids.indexOf("falsch-1") !== -1, ids.indexOf("falsch-1") === -1);
    record("Probe 3 — verifyForeignSpore:false raus", false, ids.indexOf("unecht-1") !== -1, ids.indexOf("unecht-1") === -1);
    record("Probe 4 — werfender Prüfer raus, kein Throw", false, ids.indexOf("wirft-1") !== -1, ids.indexOf("wirft-1") === -1);
    record("Probe 4 — Verworfene ehrlich gezählt", 3, r.rejected, r.rejected === 3);
  }

  // ── Probe 5: kein Prüfer → fail-soft, aber ehrlich gemeldet ──
  {
    const relay = makeInjectableRelay();
    const r = await discoverWith(relay, makeSporeWithoutVerifier(OWN), [
      ["senderA", makeCard("gut-1", "Ehrlicher Knoten", makeSpore("gut-1", "ok"))],
      ["senderC", makeCard("unecht-1", "Ungueltige Signatur", makeSpore("unecht-1", "bad"))],
    ]);
    record("Probe 5 — App läuft ohne Prüfer weiter", true, r.ok, r.ok === true);
    record("Probe 5 — cardsVerified ehrlich false", false, r.cardsVerified, r.cardsVerified === false);
    record("Probe 5 — Karten bleiben sichtbar (nicht still verschluckt)", 2, r.cards.length, r.cards.length === 2);
    // Die Bindungs-Prüfung (spore.id === nodeId) läuft auch OHNE Modul 02 —
    // sie braucht keine Krypto.
    const relay2 = makeInjectableRelay();
    const r2 = await discoverWith(relay2, makeSporeWithoutVerifier(OWN), [
      ["senderB", makeCard("falsch-1", "Hochstapler", makeSpore("jemand-anders", "ok"))],
    ]);
    record("Probe 5 — Bindungs-Prüfung wirkt auch ohne Modul 02", 0, r2.cards.length, r2.cards.length === 0);
  }

  // ── Probe 6: Deckel je Absender (3 Identitäten) ──
  {
    const relay = makeInjectableRelay();
    const inj = [];
    for (let i = 0; i < 10; i++) {
      inj.push(["fluter", makeCard("flut-" + i, "Fluter " + i, makeSpore("flut-" + i, "ok"))]);
    }
    const r = await discoverWith(relay, makeSporeWithVerifier(OWN), inj);
    record("Probe 6 — ein Absender höchstens 3 Identitäten", 3, r.cards.length, r.cards.length === 3);
  }

  // ── Probe 7: Gesamt-Deckel je Durchlauf (200) ──
  {
    const relay = makeInjectableRelay();
    const inj = [];
    // 210 Karten von 70 verschiedenen Absendern (je 3 → Absender-Deckel greift nicht).
    for (let s = 0; s < 70; s++) {
      for (let k = 0; k < 3; k++) {
        const id = "n-" + s + "-" + k;
        inj.push(["sender-" + s, makeCard(id, "Knoten " + s + "-" + k, makeSpore(id, "ok"))]);
      }
    }
    const r = await discoverWith(relay, makeSporeWithVerifier(OWN), inj);
    record("Probe 7 — 210 Karten werden auf 200 gedeckelt", 200, r.cards.length, r.cards.length === 200);
  }

  // ── Probe 8: _meta nennt Grenzen + Prüf-Zustand ──
  {
    const m = SbkimRendezvous._meta;
    record("Probe 8 — _meta.cardsMax", 200, m.cardsMax, m.cardsMax === 200);
    record("Probe 8 — _meta.cardsPerSenderMax", 3, m.cardsPerSenderMax, m.cardsPerSenderMax === 3);
    record("Probe 8 — _meta.cardsVerified spiegelt den Prüfer", true, m.cardsVerified, m.cardsVerified === true);
  }
}

run().then(() => {
  let gruen = 0, rot = 0;
  for (const r of results) {
    const mark = r.ok ? "  ok  " : "  FAIL";
    if (r.ok) gruen++; else rot++;
    console.log(mark + "  " + r.probe + (r.ok ? "" : "   (erwartet " + JSON.stringify(r.expected) + ", war " + JSON.stringify(r.actual) + ")"));
  }
  console.log("\n== Ergebnis: " + gruen + " grün, " + rot + " rot ==");
  process.exit(rot === 0 ? 0 : 1);
}).catch((e) => {
  console.error("Unerwarteter Fehler:", e);
  process.exit(1);
});
