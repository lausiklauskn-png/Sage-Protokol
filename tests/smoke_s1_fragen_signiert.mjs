// Smoke-Test S1 „Fragen unterschreiben" (2026-10-15, docs/PLAN_MYCEL_SCHICHTEN.md).
//
// Der Frage-Zettel trägt spore + sig wie der Antwort-Zettel seit Bau 23.R. Der
// Antworter prüft die Frage: bestätigt → beantwortet · unbestätigt (alte Fassung)
// → beantwortet, aber höchstens 2 der 6 Antworten je Minute (Klaus 2026-10-15) ·
// falsch → nicht beantwortet. Echtes Modul 01/02, echt signierte Sporen; nur das
// Relais ist gestellt (In-Memory). Gegenprobe: tests/gegenprobe_s1_fragen.mjs.

import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";
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
function gesicht(slot, mitSign = true) {
  const g = { async getOwnSpore() { return Sp.getOwnSpore(slot); }, verifyForeignSpore: Sp.verifyForeignSpore, verifyDetached: Sp.verifyDetached };
  if (mitSign) g.signDetached = (o) => Sp.signDetached(o, slot);
  return g;
}
async function spore(slot, meta) { await Sp.getOrCreateIdentity(slot); return Sp.generateOwnSpore({ domain: "Test", endpoint: "https://" + slot + ".example/", nodeType: "hybrid", ...meta }, slot); }
const now = () => Math.floor(Date.now() / 1000);
const warte = (ms) => new Promise(r => setTimeout(r, ms));
const ohneSig = ({ sig, ...x }) => x;
const inhalte = (R, kind) => R.st.map(e => { try { return JSON.parse(e.content); } catch { return null; } }).filter(z => z && z.kind === kind);

const sA = await spore("a", { nodeName: "Frager" });
const sB = await spore("b", { nodeName: "Kimboard" });
const sM = await spore("m", { nodeName: "Mithörer" });

const R = relay();
const A = knoten("A"), Alt = knoten("Alt"), B = knoten("B");
await A.init({ nodeName: "Frager", relayClient: R, spore: gesicht("a") });
await Alt.init({ nodeName: "Alt", relayClient: R, spore: gesicht("a", false) });   // alte Fassung: fragt unsigniert
await B.init({ nodeName: "Kimboard", relayClient: R, spore: gesicht("b"),
  match: { relatedness() { return 0; }, async queryLocal() { return [{ label: "Treffer", score: 0.9 }]; } } });
await B.enableAnswering();
await warte(50);
const beantwortet = (qid) => inhalte(R, "sbkim-query-res").some(a => a.qid === qid);
let qn = 0;
async function frageEinwerfen(z) {
  await R.publish({ kind: 1, created_at: now(), tags: [["t", "sbkim-qry"]], content: JSON.stringify(z) });
}
const frage = (extra) => ({ kind: "sbkim-query", qid: "qs1-" + (++qn), toNodeId: sB.id, fromNodeId: sA.id, fromName: "Frager", text: "Brett", k: 3, ts: now(), ...extra });
async function signiert(z, slot, sp) { z.spore = sp; z.sig = await Sp.signDetached(ohneSig(z), slot); return z; }

// ═══ E · der Frager unterschreibt, der Antworter prüft ═══
{
  const r = await A.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 4000 });
  const q = inhalte(R, "sbkim-query").find(z => z.qid === r.qid);
  t("E1 Frage-Zettel trägt spore + sig des Fragers", !!q && typeof q.sig === "string" && q.spore && q.spore.id === sA.id,
    JSON.stringify(q && { sig: typeof q.sig, sp: q.spore && q.spore.id === sA.id }));
  t("E2 Frage-Unterschrift ist echt (verifyDetached)", !!q && await Sp.verifyDetached(ohneSig(q), q.sig, sA.publicKey) === true);
  t("E3 unterschriebene Frage wird als bestätigt beantwortet", r.ok && B._meta.fragenBestaetigt === 1 && B._meta.fragenUnbestaetigt === 0,
    JSON.stringify({ ok: r.ok, b: B._meta.fragenBestaetigt, u: B._meta.fragenUnbestaetigt, reason: r.reason }));
}

// ═══ F · Fälschungen werden nicht beantwortet ═══
{
  const v0 = B._meta.frageVerworfen;
  const f1 = await signiert(frage(), "m", sM);                         // M unterschreibt im Namen von A
  await frageEinwerfen(f1); await warte(300);
  t("F1 echte Unterschrift, aber fremde fromNodeId → nicht beantwortet", !beantwortet(f1.qid) && B._meta.frageVerworfen === v0 + 1,
    "verworfen=" + B._meta.frageVerworfen);

  const f2 = await signiert(frage(), "a", sA); f2.text = "nachträglich geändert";
  await frageEinwerfen(f2); await warte(300);
  t("F2 nach dem Unterschreiben veränderter Text → nicht beantwortet", !beantwortet(f2.qid) && B._meta.frageVerworfen === v0 + 2);

  const f3 = frage({ sig: "AAAA" });
  await frageEinwerfen(f3); await warte(300);
  t("F3 sig ohne spore → nicht beantwortet", !beantwortet(f3.qid) && B._meta.frageVerworfen === v0 + 3);

  const kaputt = JSON.parse(JSON.stringify(sA)); kaputt.signature = "AAAA";
  const f4 = await signiert(frage(), "a", kaputt);
  await frageEinwerfen(f4); await warte(300);
  t("F4 Spore mit kaputter Signatur → nicht beantwortet", !beantwortet(f4.qid) && B._meta.frageVerworfen === v0 + 4);

  // Eine Fälschung zuerst, die echte Frage gleicher qid danach: die echte wird beantwortet.
  const echt = await signiert(frage(), "a", sA);
  const vorab = await signiert({ ...ohneSig(echt), spore: undefined }, "m", sM);
  vorab.fromNodeId = sA.id;
  await frageEinwerfen(vorab); await warte(300);
  await frageEinwerfen(echt); await warte(300);
  t("F5 eine Fälschung sperrt die qid der echten Frage nicht", beantwortet(echt.qid) && inhalte(R, "sbkim-query-res").filter(a => a.qid === echt.qid).length === 1);
}

// ═══ G · unsignierte Fragen: beantwortet, aber höchstens 2 der 6 je Minute ═══
{
  const u0 = B._meta.fragenUnbestaetigt;
  const r = await Alt.askNode({ nodeId: sB.id }, "alt", { timeoutMs: 3000 });
  const q = inhalte(R, "sbkim-query").find(z => z.qid === r.qid);
  t("G1 alte Fassung fragt ohne spore/sig", !!q && q.sig === undefined && q.spore === undefined);
  t("G2 unsignierte Frage wird weiter beantwortet, als unbestätigt gezählt", r.ok && B._meta.fragenUnbestaetigt === u0 + 1,
    JSON.stringify({ ok: r.ok, u: B._meta.fragenUnbestaetigt, reason: r.reason }));
  const us = [frage(), frage(), frage()];
  for (const z of us) await frageEinwerfen(z);
  await warte(400);
  const n = us.filter(z => beantwortet(z.qid)).length;
  t("G3 höchstens 2 unsignierte Antworten je Minute", n === 1 && B._meta.fragenUnbestaetigt === u0 + 2,
    "von 3 weiteren beantwortet: " + n + ", unbestätigt gesamt " + (B._meta.fragenUnbestaetigt - u0));
  const s = await signiert(frage(), "a", sA);
  await frageEinwerfen(s); await warte(400);
  t("G4 eine unterschriebene Frage kommt trotz erschöpfter Unsigniert-Grenze durch", beantwortet(s.qid));
  t("G5 _meta nennt die Grenze", B._meta.queryUnsignedMaxPerMin === 2 && B._meta.queryMaxPerMin === 6);
}

console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exitCode = rot ? 1 : 0;
