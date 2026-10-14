// Probe: Die Antwort des Relais (Modul 05b + 23 + 23-UI, 2026-10-14).
//   node tests/smoke_relais_ok.mjs
//
// Brief docs/sessions (2026-10-15): 05b wertete nur EVENT aus; ein
// ["OK", id, false, "grund"] des Relais ging verloren, und „✓ Du bist im Raum"
// bewies nur einen offenen Socket. Gemessen wird gegen ein GESTELLTES Relais in
// drei Lagen: OK true · OK false mit Grund · kein OK (Frist abgelaufen).
// Dazu die Ränder: fremde Kennung, zweite Antwort, Verbindung bricht ab,
// ungültige Frist. Dann 23 (doAnnounce) und die Oberfläche (welcher Satz steht da).
//
// Die Frist von 5 s ist GEWÄHLT, NICHT GEMESSEN. Die Probe setzt 100 ms, damit
// „kein OK" nicht fünf Sekunden kostet; dass die Vorgabe 5000 ist, wird eigens geprüft.

import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, join } from "node:path";
import { tmpdir } from "node:os";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LIES = (p) => readFileSync(join(WURZEL, p), "utf8");

let gruen = 0, rot = 0;
const sage = (ok, t, ist) => {
  ok ? gruen++ : rot++;
  console.log(`${ok ? "  ✓" : "  ✗ ROT"} ${t}${ok || ist === undefined ? "" : `\n        ist: ${ist}`}`);
};
const kopf = (t) => console.log(`\n── ${t}`);
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

// ── gestelltes Relais: jede WebSocket wird sofort (Mikroaufgabe) offen ──────
const SOCKETS = {};
class FalschesRelais {
  constructor(url) {
    this.url = url; this.readyState = 0; this.gesendet = [];
    SOCKETS[url] = this;
    queueMicrotask(() => { this.readyState = 1; if (this.onopen) this.onopen(); });
  }
  send(m) { this.gesendet.push(JSON.parse(m)); }
  close() { this.readyState = 3; }
  antworte(arr) { if (this.onmessage) this.onmessage({ data: JSON.stringify(arr) }); }
  brichAb() { this.readyState = 3; if (this.onclose) this.onclose(); }
  letztesEvent() { const e = this.gesendet.filter((m) => m[0] === "EVENT").pop(); return e && e[1]; }
}

async function lade05b() {
  const tmp = mkdtempSync(join(tmpdir(), "relaisok05b-"));
  try {
    writeFileSync(join(tmp, "noble-secp256k1.mjs"), LIES("src/modules/noble-secp256k1.js"));
    writeFileSync(join(tmp, "05b.mjs"), LIES("src/modules/05b_nostr_relay.js").replace('"./noble-secp256k1.js"', '"./noble-secp256k1.mjs"'));
    globalThis.WebSocket = FalschesRelais;
    if (!("self" in globalThis)) globalThis.self = globalThis;
    const info = console.info; console.info = () => {};
    await import(pathToFileURL(join(tmp, "05b.mjs")).href);
    console.info = info;
    return globalThis.SbkimNostrRelay;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// Ein frischer Client je Fall, zwei Relais, kurze Frist.
let lauf = 0;
function client(R, n = 2) {
  lauf++;
  const urls = Array.from({ length: n }, (_, i) => `wss://r${i + 1}-${lauf}.example`);
  const c = R.makeClient();
  const k = c.configure({ relays: urls, okFristMs: 100 });
  return { c, urls, k };
}

async function teil05b(R) {
  kopf("A · Modul 05b: Frist und Schnittstelle");
  sage(R._meta.okFristVorgabe === 5000, "die Vorgabe der Frist ist 5000 ms (gewählt, nicht gemessen)", R._meta.okFristVorgabe);
  const f0 = R.makeClient();
  sage(f0._meta.okFristMs === 5000, "ein frischer Client wartet 5000 ms", f0._meta.okFristMs);
  for (const bad of [0, 99, 60001, "x", NaN, -5]) {
    const r = f0.configure({ okFristMs: bad });
    sage(r.ok === false && f0._meta.okFristMs === 5000, "configure weist die Frist ab: " + JSON.stringify(bad), JSON.stringify(r));
  }
  const gut = f0.configure({ okFristMs: 250 });
  sage(gut.ok === true && gut.okFristMs === 250 && f0._meta.okFristMs === 250, "eine Frist 100–60000 wird übernommen", JSON.stringify(gut));

  kopf("B · Lage 1: OK true");
  {
    const { c, urls } = client(R);
    const p = await c.publish({ kind: 1, tags: [["t", "x"]], content: "a" });
    sage(Array.isArray(p.gesendetAn) && p.gesendetAn.length === 2, "publish nennt die zwei Relais, an die gesendet wurde", JSON.stringify(p.gesendetAn));
    sage(p.antwort && typeof p.antwort.then === "function", "publish liefert die Antwort als Versprechen, wartet aber nicht darauf");
    const ev = SOCKETS[urls[0]].letztesEvent();
    sage(ev && ev.id === p.id, "das gesendete Ereignis trägt die gemeldete Kennung");
    SOCKETS[urls[0]].antworte(["OK", p.id, true, ""]);
    SOCKETS[urls[1]].antworte(["OK", p.id, true, "duplicate: schon da"]);
    const a = await p.antwort;
    sage(a.angenommen === 2 && a.abgelehnt === 0 && a.unbekannt === 0, "beide Relais: angenommen", JSON.stringify(a));
    sage(a.relais.every((r) => r.ergebnis === "angenommen"), "je Relais ergebnis „angenommen“");
  }

  kopf("C · Lage 2: OK false mit Grund");
  {
    const { c, urls } = client(R);
    const p = await c.publish({ kind: 1, content: "b" });
    SOCKETS[urls[0]].antworte(["OK", p.id, false, "blocked: pubkey not allowed"]);
    SOCKETS[urls[1]].antworte(["OK", p.id, false, "rate-limited: slow down"]);
    const a = await p.antwort;
    sage(a.abgelehnt === 2 && a.angenommen === 0, "beide Relais: abgelehnt", JSON.stringify(a));
    const r1 = a.relais.find((r) => r.relay === urls[0]);
    sage(r1 && r1.grund === "blocked: pubkey not allowed", "der Grund des Relais steht wörtlich da", JSON.stringify(r1));
    const lang = await c.publish({ kind: 1, content: "c" });
    SOCKETS[urls[0]].antworte(["OK", lang.id, false, "x".repeat(500)]);
    SOCKETS[urls[1]].antworte(["OK", lang.id, false, null]);
    const al = await lang.antwort;
    sage(al.relais[0].grund.length === 200, "ein langer Grund wird auf 200 Zeichen gekürzt", al.relais[0].grund.length);
    sage(al.relais[1].ergebnis === "abgelehnt" && al.relais[1].grund === "", "ohne Grund: abgelehnt, leerer Grund", JSON.stringify(al.relais[1]));
  }

  kopf("D · Lage 3: kein OK binnen der Frist");
  {
    const { c } = client(R);
    const t0 = Date.now();
    const p = await c.publish({ kind: 1, content: "d" });
    const a = await p.antwort;
    const dauer = Date.now() - t0;
    sage(a.unbekannt === 2 && a.angenommen === 0 && a.abgelehnt === 0, "keine Antwort → unbekannt, NIE angenommen", JSON.stringify(a));
    sage(a.relais.every((r) => /keine Antwort binnen 100 ms/.test(r.grund)), "der Grund nennt die Frist", JSON.stringify(a.relais));
    sage(dauer >= 90 && dauer < 2000, "die Antwort kommt nach der Frist, nicht vorher", dauer + " ms");
  }

  kopf("E · gemischt und Ränder");
  {
    const { c, urls } = client(R);
    const p = await c.publish({ kind: 1, content: "e" });
    SOCKETS[urls[0]].antworte(["OK", "fremde-kennung", true, ""]);
    SOCKETS[urls[1]].antworte(["OK", p.id, false, "invalid: bad sig"]);
    SOCKETS[urls[1]].antworte(["OK", p.id, true, ""]);
    const a = await p.antwort;
    const r1 = a.relais.find((r) => r.relay === urls[0]), r2 = a.relais.find((r) => r.relay === urls[1]);
    sage(r1.ergebnis === "unbekannt", "ein OK zu einer FREMDEN Kennung zählt nicht", JSON.stringify(r1));
    sage(r2.ergebnis === "abgelehnt" && r2.grund === "invalid: bad sig", "nur die ERSTE Antwort eines Relais zählt", JSON.stringify(r2));
  }
  {
    const { c, urls } = client(R);
    const p = await c.publish({ kind: 1, content: "f" });
    SOCKETS[urls[0]].antworte(["OK", p.id, true, ""]);
    SOCKETS[urls[1]].brichAb();
    const t0 = Date.now();
    const a = await p.antwort;
    const r2 = a.relais.find((r) => r.relay === urls[1]);
    sage(a.angenommen === 1 && r2.ergebnis === "unbekannt", "Verbindung bricht ab → unbekannt, das andere zählt", JSON.stringify(a));
    sage(/Verbindung geschlossen/.test(r2.grund), "der Grund nennt den Abbruch", r2.grund);
    sage(Date.now() - t0 < 90, "ist alles entschieden, wird nicht bis zur Frist gewartet", (Date.now() - t0) + " ms");
  }
  {
    const { c, urls } = client(R, 1);
    const p = await c.publish({ kind: 1, content: "g" });
    SOCKETS[urls[0]].antworte(["OK", p.id, "true", ""]);
    const a = await p.antwort;
    sage(a.relais[0].ergebnis === "abgelehnt", "nur der Wahrheitswert true gilt als angenommen (\"true\" nicht)", JSON.stringify(a.relais[0]));
  }
  {
    const c = R.makeClient();
    c.configure({ relays: ["wss://zu.example"] });
    globalThis.WebSocket = class { constructor(u) { this.url = u; this.readyState = 0; queueMicrotask(() => { this.readyState = 3; if (this.onclose) this.onclose(); }); } send() {} close() {} };
    let wurf = null;
    try { await Promise.race([c.publish({ kind: 1, content: "h" }), new Promise((_, nein) => setTimeout(() => nein(new Error("HÄNGT: publish kam nach 8 s nicht zurück")), 8000))]); } catch (e) { wurf = e && e.message; }
    globalThis.WebSocket = FalschesRelais;
    sage(/Kein Nostr-Relais verbunden/.test(String(wurf)), "ohne offenes Relais wirft publish wie bisher", wurf);
  }
}

// ── 23: doAnnounce wertet die Antwort aus ─────────────────────────────────────
function knoten(quelle) {
  const ctx = {
    console: { info() {}, warn() {}, error() {} },
    setTimeout, clearTimeout, JSON, Promise, Uint8Array, Object, Array, String, Number, Error,
    crypto: webcrypto, TextEncoder, TextDecoder, btoa, atob, Math, Date,
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(quelle, ctx, { filename: "23_rendezvous.js" });
  return ctx.SbkimRendezvous;
}
function relaisMit(antwort) {
  return {
    published: [],
    async publish(body) {
      this.published.push(body);
      if (antwort === "ohne") return undefined;
      return { id: "ev1", gesendetAn: ["wss://a.example"], antwort: Promise.resolve(antwort) };
    },
    subscribe() { return () => {}; },
  };
}
const spore = { async getOwnSpore() { return { id: "node-A", domain: "a.example", domainVector: null }; } };

async function teil23() {
  kopf("F · Modul 23: doAnnounce");
  const Q = LIES("src/modules/23_rendezvous.js");
  const lagen = [
    ["angenommen", { relais: [{ relay: "wss://a.example", ergebnis: "angenommen", grund: "" }] }, "ja", true],
    ["abgelehnt", { relais: [{ relay: "wss://a.example", ergebnis: "abgelehnt", grund: "blocked: nein" }, { relay: "wss://b.example", ergebnis: "abgelehnt", grund: "" }] }, "nein", false],
    ["keine Antwort", { relais: [{ relay: "wss://a.example", ergebnis: "unbekannt", grund: "keine Antwort binnen 5000 ms" }] }, "unbekannt", true],
    ["gemischt: eins ja, eins nein", { relais: [{ relay: "wss://a.example", ergebnis: "abgelehnt", grund: "x" }, { relay: "wss://b.example", ergebnis: "angenommen", grund: "" }] }, "ja", true],
    ["gemischt: eins nein, eins still", { relais: [{ relay: "wss://a.example", ergebnis: "abgelehnt", grund: "x" }, { relay: "wss://b.example", ergebnis: "unbekannt", grund: "" }] }, "unbekannt", true],
    ["ein Client ohne Antwort (alter 05b)", "ohne", "unbekannt", true],
  ];
  for (const [name, antwort, stand, ok] of lagen) {
    const A = knoten(Q);
    await A.init({ nodeName: "A", relayClient: relaisMit(antwort), spore, listenMs: 20 });
    const r = await A.announce();
    sage(r && r.bestaetigung && r.bestaetigung.stand === stand && r.ok === ok,
      `${name}: stand „${stand}“, ok ${ok}`, JSON.stringify(r));
    if (stand === "nein") {
      sage(/wss:\/\/a\.example — blocked: nein/.test(r.reason) && /wss:\/\/b\.example — ohne Grund/.test(r.reason),
        "die Ablehnung nennt jedes Relais samt Grund", r.reason);
    }
  }
  // enableAnswering wartet nicht auf die Antwort (sonst 5 s Stillstand).
  const A = knoten(Q);
  let spaet = null;
  const langsam = { async publish() { return { id: "e", gesendetAn: ["wss://a.example"], antwort: new Promise((r) => { spaet = r; }) }; }, subscribe() { return () => {}; } };
  await A.init({ nodeName: "A", relayClient: langsam, spore, listenMs: 20 });
  const t0 = Date.now();
  const fertig = await Promise.race([A.enableAnswering().then(() => "fertig"), warte(500).then(() => "hängt")]);
  sage(fertig === "fertig" && Date.now() - t0 < 500, "Antworten-Einschalten wartet nicht auf die Relais-Antwort", fertig);
  if (spaet) spaet({ relais: [] });
}

// ── 23-UI: welcher Satz steht da ──────────────────────────────────────────────
function makeEl(tag) {
  const e = { tagName: String(tag).toUpperCase(), nodeType: 1, id: "", textContent: "", type: "", title: "", children: [], parentNode: null, _listeners: {}, _attrs: {} };
  const st = {};
  Object.defineProperty(st, "cssText", { get() { return st._raw || ""; }, set(v) { st._raw = String(v); String(v).split(";").forEach((d) => { const i = d.indexOf(":"); if (i < 0) return; const p = d.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()); if (p && p !== "_raw") st[p] = d.slice(i + 1).trim(); }); } });
  e.style = st;
  e.appendChild = (c) => { if (c.parentNode) { const i = c.parentNode.children.indexOf(c); if (i >= 0) c.parentNode.children.splice(i, 1); } e.children.push(c); c.parentNode = e; return c; };
  e.removeChild = (c) => { const i = e.children.indexOf(c); if (i >= 0) { e.children.splice(i, 1); c.parentNode = null; } return c; };
  Object.defineProperty(e, "firstChild", { get: () => e.children[0] || null });
  e.addEventListener = (t, cb) => { (e._listeners[t] = e._listeners[t] || []).push(cb); };
  e.click = () => (e._listeners.click || []).slice().forEach((cb) => cb({ type: "click" }));
  e.querySelector = (s) => finde(e, s);
  e.setAttribute = (k, v) => { e._attrs[k] = String(v); };
  e.getAttribute = (k) => (k in e._attrs ? e._attrs[k] : null);
  e.removeAttribute = (k) => { delete e._attrs[k]; };
  return e;
}
function finde(root, sel) {
  let out = null;
  (function geh(n) { if (out) return; for (const c of n.children) { if (sel.startsWith("#") ? c.id === sel.slice(1) : c.tagName === sel.toUpperCase()) { out = c; return; } geh(c); } })(root);
  return out;
}

async function teilUI() {
  kopf("G · Oberfläche: „im Raum“ erst nach OK true");
  const doc = { nodeType: 9, readyState: "complete" };
  doc.createElement = (t) => makeEl(t);
  doc.body = makeEl("body"); doc.head = makeEl("head");
  doc.addEventListener = () => {};
  doc.querySelector = (s) => finde(doc.body, s);
  doc.getElementById = (id) => finde(doc.body, "#" + id) || finde(doc.head, "#" + id);
  let antwort = null;
  const rdv = {
    configure() {},
    announce: async () => antwort,
    connectAndAnnounce: async () => Object.assign({ created: false }, antwort),
    discover: async () => ({ ok: true, cards: [] }),
  };
  const ls = {};
  const stub = {
    document: doc, console, SbkimRendezvous: rdv,
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    localStorage: { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: (k) => { delete ls[k]; } },
  };
  new Function("window", "globalThis", "console", "document", LIES("src/modules/23_rendezvous_ui.js"))(stub, stub, console, doc);
  const UI = stub.SbkimRendezvousUI;
  await UI.init({ nodeName: "Probe", createIdentity: async () => {} });
  UI.show();
  const panel = doc.querySelector("#sbkim-rdv-panel");
  const knoepfe = [];
  (function sammle(n) { for (const c of n.children) { if (c.tagName === "BUTTON") knoepfe.push(c); sammle(c); } })(panel);
  const verbinden = knoepfe.find((b) => b.textContent.includes("Mit dem Knotennetz verbinden"));
  const anmelden = knoepfe.find((b) => b.textContent.includes("Nur neu anmelden"));
  const aus = doc.querySelector("#sbkim-rdv-out");
  sage(!!verbinden && !!anmelden && !!aus, "Knöpfe und Ausgabe sind da");
  if (!verbinden || !anmelden || !aus) return;

  const bJa = { stand: "ja", relais: [{ relay: "wss://a.example", ergebnis: "angenommen", grund: "" }] };
  const bNein = { stand: "nein", relais: [{ relay: "wss://a.example", ergebnis: "abgelehnt", grund: "blocked: nur Mitglieder" }] };
  const bStill = { stand: "unbekannt", relais: [{ relay: "wss://a.example", ergebnis: "unbekannt", grund: "keine Antwort binnen 5000 ms" }] };
  const bMix = { stand: "ja", relais: [{ relay: "wss://a.example", ergebnis: "angenommen", grund: "" }, { relay: "wss://b.example", ergebnis: "abgelehnt", grund: "rate-limited: langsam" }] };
  const fall = async (knopf, res) => { antwort = res; knopf.click(); await warte(30); return aus.textContent; };

  for (const [name, knopf] of [["Verbinden", verbinden], ["Nur neu anmelden", anmelden]]) {
    let t = await fall(knopf, { ok: true, nodeId: "OWN", bestaetigung: bJa });
    sage(/✓ Du bist im Raum/.test(t), `${name}, OK true: „✓ Du bist im Raum“`, t);
    t = await fall(knopf, { ok: true, nodeId: "OWN", bestaetigung: bStill });
    sage(!/✓ Du bist im Raum/.test(t) && /Bestätigung fehlt/.test(t), `${name}, keine Antwort: „Bestätigung fehlt“, kein ✓`, t);
    t = await fall(knopf, { ok: false, nodeId: "OWN", bestaetigung: bNein, reason: "Kein Relais hat die Anmeldung angenommen: wss://a.example — blocked: nur Mitglieder" });
    sage(!/✓ Du bist im Raum/.test(t) && /wss:\/\/a\.example/.test(t) && /blocked: nur Mitglieder/.test(t), `${name}, OK false: Relais und Grund stehen da, kein ✓`, t);
    t = await fall(knopf, { ok: true, nodeId: "OWN", bestaetigung: bMix });
    sage(/✓ Du bist im Raum/.test(t) && /Relais lehnt ab: wss:\/\/b\.example — rate-limited: langsam/.test(t), `${name}, gemischt: ✓ und die Ablehnung des anderen`, t);
    t = await fall(knopf, { ok: true, nodeId: "OWN" });
    sage(!/✓ Du bist im Raum/.test(t) && /Bestätigung fehlt/.test(t), `${name}, ohne Angabe (altes Modul 23): kein ✓`, t);
  }
  const uiQ = LIES("src/modules/23_rendezvous_ui.js");
  const fremd = /innerHTML\s*=\s*[^;]*(grund|ablehnungen)/.test(uiQ);
  sage(!fremd, "der Grund des Relais geht nur über textContent hinaus");
}

async function main() {
  // Endet der Lauf, ohne die Schlusszeile zu erreichen (ein Versprechen hängt),
  // ist das ROT, nicht still grün.
  process.exitCode = 1;
  let R = null;
  try { R = await lade05b(); } catch (e) { sage(false, "Modul 05b ließ sich in der Probe nicht laden", e && e.message); }
  if (R) { try { await teil05b(R); } catch (e) { sage(false, "05b-Teil stolperte", e && e.stack); } }
  try { await teil23(); } catch (e) { sage(false, "23-Teil stolperte", e && e.stack); }
  try { await teilUI(); } catch (e) { sage(false, "UI-Teil stolperte", e && e.stack); }
  console.log(`\nSumme: ${gruen} grün, ${rot} rot`);
  process.exitCode = rot ? 1 : 0;
}
main();
