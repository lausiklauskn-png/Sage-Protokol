// Smoke-Test S3 „Rechenaufwand je Zettel" (2026-10-16, docs/PLAN_MYCEL_SCHICHTEN.md).
//
// Klaus 2026-10-16: 12 Stufen, Karten + Fragen, „Vorrang bei Enge". Der Sender
// rechnet eine Nonce, sodass sha256("sbkim-pow-v1|" + sha256(Zettel ohne
// pow/sig/spore) + "|" + pow) mindestens 12 führende Null-Bits hat. Der
// Empfänger weist nie ab: ein voller Raum lässt eine Karte MIT Aufwand eine
// ohne verdrängen; Fragen ohne Aufwand bekommen höchstens 4 der 6 Antworten
// je Minute. Nachgerechnet wird hier mit Node-crypto, NICHT mit der
// Rechnung des Moduls — sonst prüfte das Modul sich selbst.
// Gegenprobe: tests/gegenprobe_s3_aufwand.mjs.

import "fake-indexeddb/auto";
import { webcrypto, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = globalThis;
const still = { info() {}, warn() {}, error() {}, log() {} };
function load(rel) {
  new Function("global", "window", "globalThis", "crypto", "console", "btoa", "atob", "TextEncoder", "TextDecoder", "indexedDB",
    readFileSync(resolve(root, rel), "utf8"))(globalThis, globalThis, globalThis, webcrypto, still, btoa, atob, TextEncoder, TextDecoder, indexedDB);
}
load("src/modules/01_storage.js");
load("src/modules/02_spore.js");
const Sp = globalThis.SbkimSpore;
const m23 = readFileSync(resolve(root, "src/modules/23_rendezvous.js"), "utf8");

let gruen = 0, rot = 0;
function t(name, ok, extra) {
  if (ok) { gruen++; console.log("✓ " + name); }
  else { rot++; console.log("✗ ROT: " + name + (extra ? " — " + extra : "")); }
}
function relay() {
  const subs = [], st = [];
  const hit = (f, e) => (!f["#t"] || f["#t"].some(x => e.tags.some(tg => tg[1] === x))) && (typeof f.since !== "number" || e.created_at >= f.since);
  return {
    st,
    async publish(b) { const e = { pubkey: "p" + st.length, ...b }; st.push(e); setTimeout(() => subs.slice().forEach(s => hit(s.f, e) && s.cb(e)), 0); return e; },
    subscribe(f, cb) { const s = { f, cb }; subs.push(s); setTimeout(() => st.forEach(e => hit(f, e) && cb(e)), 0); return () => { const i = subs.indexOf(s); if (i >= 0) subs.splice(i, 1); }; },
  };
}
function knoten(ctxName) {
  const c = { console: still, setTimeout, clearTimeout, Date, Math, JSON, Promise, TextEncoder, TextDecoder, crypto: webcrypto, btoa, atob };
  c.globalThis = c; vm.createContext(c); vm.runInContext(m23, c, { filename: ctxName + "/23_rendezvous.js" }); return c.SbkimRendezvous;
}
function gesicht(slot) {
  return { async getOwnSpore() { return Sp.getOwnSpore(slot); }, verifyForeignSpore: Sp.verifyForeignSpore,
           verifyDetached: Sp.verifyDetached, signDetached: (o) => Sp.signDetached(o, slot) };
}
async function spore(slot, meta) { await Sp.getOrCreateIdentity(slot); return Sp.generateOwnSpore({ domain: "Test", endpoint: "https://" + slot + ".example/", nodeType: "hybrid", ...meta }, slot); }
const now = () => Math.floor(Date.now() / 1000);
const warte = (ms) => new Promise(r => setTimeout(r, ms));
const ohneSig = ({ sig, ...x }) => x;
const inhalte = (R, kind) => R.st.map(e => { try { return JSON.parse(e.content); } catch { return null; } }).filter(z => z && z.kind === kind);

// Unabhängige Rechnung (Node-crypto)
const sha = (s) => createHash("sha256").update(s).digest("hex");
function basis(z) { const o = {}; for (const k of Object.keys(z)) if (k !== "pow" && k !== "sig" && k !== "spore") o[k] = z[k]; return "sbkim-pow-v1|" + sha(JSON.stringify(o)) + "|"; }
function nullBits(hex) { let b = 0; for (const ch of hex) { const v = parseInt(ch, 16); if (v === 0) { b += 4; continue; } return b + Math.clz32(v) - 28; } return b; }
const bits = (z) => typeof z.pow === "string" ? nullBits(sha(basis(z) + z.pow)) : -1;
function rechnen(z, ziel = 12) { const b = basis(z); for (let i = 0; ; i++) { if (nullBits(sha(b + i)) >= ziel) { z.pow = String(i); return z; } } }
function zuWenig(z) { const b = basis(z); for (let i = 0; ; i++) { const n = nullBits(sha(b + i)); if (n >= 4 && n < 12) { z.pow = String(i); return z; } } }

const sA = await spore("a", { nodeName: "Frager" });
const sB = await spore("b", { nodeName: "Kimboard" });

// ═══ P · der Sender rechnet ═══
{
  const R = relay();
  const A = knoten("A"), B = knoten("B");
  await A.init({ nodeName: "Frager", relayClient: R, spore: gesicht("a") });
  await B.init({ nodeName: "Kimboard", relayClient: R, spore: gesicht("b"),
    match: { relatedness() { return 0; }, async queryLocal() { return [{ label: "Treffer", score: 0.9 }]; } } });
  await A.announce();
  const karte = inhalte(R, "sbkim-presence").find(c => c.nodeId === sA.id);
  t("P1 Karte trägt pow mit mindestens 12 Null-Bits (nachgerechnet)", !!karte && bits(karte) >= 12, "bits=" + (karte && bits(karte)));
  await B.enableAnswering(); await warte(50);
  const r = await A.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 4000 });
  const q = inhalte(R, "sbkim-query").find(z => z.qid === r.qid);
  t("P2 Frage-Zettel trägt pow mit mindestens 12 Null-Bits", !!q && bits(q) >= 12, "bits=" + (q && bits(q)));
  t("P3 Unterschrift der Frage deckt pow mit (verifyDetached echt)", !!q && typeof q.sig === "string" && await Sp.verifyDetached(ohneSig(q), q.sig, sA.publicKey) === true);
  const geaendert = q ? { ...q, text: "anders" } : {};
  t("P4 Aufwand ist an den Inhalt gebunden (geänderter Text → ungültig)", !!q && bits(geaendert) < 12, "bits=" + bits(geaendert));
  t("P5 Antwort-Zettel trägt keinen Aufwand (Klaus: nur Karten + Fragen)", inhalte(R, "sbkim-query-res").every(a => a.pow === undefined));
  t("P6 _meta nennt 12 Stufen und 4 von 6", B._meta.powBits === 12 && B._meta.queryNoPowMaxPerMin === 4 && B._meta.queryMaxPerMin === 6);
}

// ═══ K · Karten: Vorrang nur bei Enge ═══
const fakeSpore = (id) => ({ id });
function karte(id, mitPow) { const c = { kind: "sbkim-presence", nodeId: id, nodeName: "K-" + id, spore: fakeSpore(id), ts: now() }; return mitPow ? rechnen(c) : c; }
async function einwerfen(R, c, pubkey) { await R.publish({ kind: 1, created_at: now(), tags: [["t", "sbkim-rdv"]], content: JSON.stringify(c), ...(pubkey ? { pubkey } : {}) }); }
async function leser(R) {
  const D = knoten("D-" + Math.random());
  await D.init({ nodeName: "Leser", relayClient: R, spore: { async getOwnSpore() { return sA; } } });   // ohne Prüfer: Karten ungeprüft, hier gewollt
  return D;
}
async function lesen(D) { return D.discover({ listenMs: 400, checkMeaning: false, collapseByName: false, vouchTrust: false }); }
{
  const R = relay();
  await einwerfen(R, karte("ohne-1", false));
  await einwerfen(R, karte("mit-1", true));
  const D = await leser(R); const r = await lesen(D);
  const ids = r.cards.map(c => c.nodeId);
  t("K1 Raum nicht voll: Karte ohne Aufwand bleibt drin", ids.includes("ohne-1") && ids.includes("mit-1") && r.verdraengt === 0, JSON.stringify({ ids, v: r.verdraengt }));
}
{
  const R = relay();
  for (let i = 0; i < 200; i++) await einwerfen(R, karte("flut-" + i, false));
  await einwerfen(R, karte("echt-mit", true));
  await einwerfen(R, karte("spaet-ohne", false));
  const D = await leser(R); const r = await lesen(D);
  const ids = r.cards.map(c => c.nodeId);
  t("K2 voller Raum: Karte MIT Aufwand kommt hinein", ids.includes("echt-mit"), "Karten=" + ids.length);
  t("K3 … und verdrängt genau eine ohne Aufwand (Deckel bleibt 200)", ids.length === 200 && r.verdraengt === 1 && ids.filter(x => x.startsWith("flut-")).length === 199,
    JSON.stringify({ n: ids.length, v: r.verdraengt }));
  t("K4 voller Raum: weitere Karte OHNE Aufwand kommt nicht hinein", !ids.includes("spaet-ohne"));
  t("K5 _meta zählt die Verdrängung", D._meta.kartenVerdraengt === 1, "kartenVerdraengt=" + D._meta.kartenVerdraengt);
}
{
  const R = relay();
  for (let i = 0; i < 199; i++) await einwerfen(R, karte("flut-" + i, false));
  await einwerfen(R, karte("alt-mit", true));
  const nachrechner = karte("schwach", false); zuWenig(nachrechner);
  await einwerfen(R, nachrechner);
  const falschGebunden = karte("geklaut", false); falschGebunden.pow = R.st.map(e => JSON.parse(e.content)).find(c => c.nodeId === "alt-mit").pow;
  await einwerfen(R, falschGebunden);
  const D = await leser(R); const r = await lesen(D);
  const ids = r.cards.map(c => c.nodeId);
  t("K6 zu wenig Null-Bits zählt als ohne Aufwand (verdrängt nichts)", !ids.includes("schwach") && r.verdraengt === 0, JSON.stringify({ v: r.verdraengt }));
  t("K7 fremdes pow (andere Karte) zählt als ohne Aufwand", !ids.includes("geklaut"));
}
{
  const R = relay();
  for (let i = 0; i < 200; i++) await einwerfen(R, karte("voll-mit-" + i, true));
  await einwerfen(R, karte("neu-mit", true));
  const D = await leser(R); const r = await lesen(D);
  const ids = r.cards.map(c => c.nodeId);
  t("K8 Raum voll mit Aufwand-Karten: eine weitere verdrängt keine davon", !ids.includes("neu-mit") && ids.length === 200 && r.verdraengt === 0);
}
{
  const R = relay();
  for (let i = 0; i < 200; i++) await einwerfen(R, karte("flut-" + i, false));
  for (let i = 0; i < 5; i++) await einwerfen(R, karte("ein-sender-" + i, true), "derselbe");
  const D = await leser(R); const r = await lesen(D);
  const ids = r.cards.map(c => c.nodeId);
  t("K9 Aufwand hebt die Grenze je Absender (3) nicht auf", ids.filter(x => x.startsWith("ein-sender-")).length === 3 && r.verdraengt === 3,
    JSON.stringify({ n: ids.filter(x => x.startsWith("ein-sender-")).length, v: r.verdraengt }));
}

// ═══ Q · Fragen: ohne Aufwand höchstens 4 der 6 je Minute ═══
{
  const R = relay();
  const B = knoten("B2");
  await B.init({ nodeName: "Kimboard", relayClient: R, spore: gesicht("b"),
    match: { relatedness() { return 0; }, async queryLocal() { return [{ label: "Treffer", score: 0.9 }]; } } });
  await B.enableAnswering(); await warte(50);
  let qn = 0;
  const frage = () => ({ kind: "sbkim-query", qid: "qs3-" + (++qn), toNodeId: sB.id, fromNodeId: sA.id, fromName: "Frager", text: "Brett", k: 3, ts: now() });
  async function signiert(z) { z.spore = sA; z.sig = await Sp.signDetached(ohneSig(z), "a"); return z; }
  const werfen = (z) => R.publish({ kind: 1, created_at: now(), tags: [["t", "sbkim-qry"]], content: JSON.stringify(z) });
  const beantwortet = (qid) => inhalte(R, "sbkim-query-res").some(a => a.qid === qid);
  const ohne = [];
  for (let i = 0; i < 5; i++) { const z = await signiert(frage()); ohne.push(z); await werfen(z); }
  await warte(500);
  const n = ohne.filter(z => beantwortet(z.qid)).length;
  t("Q1 Fragen ohne Aufwand werden weiter beantwortet, aber höchstens 4 je Minute", n === 4 && B._meta.fragenOhneAufwand === 4,
    "beantwortet " + n + " von 5, fragenOhneAufwand=" + B._meta.fragenOhneAufwand);
  const mit = await signiert(rechnen(frage()));
  await werfen(mit); await warte(400);
  t("Q2 eine Frage MIT Aufwand kommt trotz erschöpfter Ohne-Grenze durch", beantwortet(mit.qid));
  const schwach = await signiert(zuWenig(frage()));
  await werfen(schwach); await warte(400);
  t("Q3 zu wenig Null-Bits zählt als ohne Aufwand (nicht beantwortet)", !beantwortet(schwach.qid));
  const mit2 = await signiert(rechnen(frage()));
  await werfen(mit2); await warte(400);
  const mit3 = await signiert(rechnen(frage()));
  await werfen(mit3); await warte(400);
  t("Q4 die Gesamtgrenze (6/min) gilt auch für Fragen mit Aufwand", beantwortet(mit2.qid) && !beantwortet(mit3.qid));
}

console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exitCode = rot ? 1 : 0;
