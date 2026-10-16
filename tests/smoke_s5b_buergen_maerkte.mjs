// Smoke-Test S5b „Bürgen für fremde Apps in den Märkten" — Teil 1: Protokoll
// (2026-10-16, docs/PLAN_MYCEL_SCHICHTEN.md § S5b, INTERFACES § Modul 23 S5b).
//
// Klaus' Entscheide (2026-10-16): der Bürge haftet nur für die eine App ·
// Ablauf höchstens 180 Tage · Hinweis 30 Tage vorher · Widerruf nur mit Grund ·
// der Leser speichert gesehene Widerrufe · „antworte nur Verbürgten".
// Echtes Modul 01/02, echt signierte Sporen; nur das Relais ist gestellt.
// Gegenprobe: tests/gegenprobe_s5b_buergen_maerkte.mjs.

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
function speicher() {
  const m = new Map();
  return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
function knoten(name, ls) {
  const c = { console: still, setTimeout, clearTimeout, Date, Math, JSON, Promise, TextEncoder, TextDecoder, crypto: webcrypto, btoa, atob,
    localStorage: ls || speicher() };
  c.globalThis = c; vm.createContext(c); vm.runInContext(m23, c, { filename: name + "/23_rendezvous.js" }); return c.SbkimRendezvous;
}
function gesicht(slot) {
  const g = { async getOwnSpore() { return slot ? Sp.getOwnSpore(slot) : null; }, verifyForeignSpore: Sp.verifyForeignSpore, verifyDetached: Sp.verifyDetached };
  if (slot) g.signDetached = (o) => Sp.signDetached(o, slot);
  return g;
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
async function spore(slot, name) {
  await Sp.getOrCreateIdentity(slot);
  return Sp.generateOwnSpore({ domain: "Test", endpoint: "https://" + slot + ".example/", nodeType: "hybrid", nodeName: name }, slot);
}
const now = () => Math.floor(Date.now() / 1000);
const TAG = 24 * 3600;
const warte = (ms) => new Promise(r => setTimeout(r, ms));
const ohneSig = ({ sig, ...x }) => x;
async function zettel(slot, sp, felder) {
  const z = { kind: "sbkim-vouch", v: 1, voucher: sp.id, ts: now(), spore: sp, ...felder };
  if (z.kind === "sbkim-vouch" && z.exp === undefined) z.exp = z.ts + 180 * TAG;
  z.sig = await Sp.signDetached(ohneSig(z), slot);
  return z;
}
const karte = (s, extra) => ({ nodeId: s.id, nodeName: s.nodeName, spore: s, ts: now(), ...extra });

// Rollen: S = Netzadmin (Sage-Protokol), M = Markt, A/B = Apps im Markt, F = auffällige App, X = Fremder
const sS = await spore("s", "Sage");
const sM = await spore("m", "Markt");
const sA = await spore("a", "AppA");
const sB = await spore("b", "AppB");
const sF = await spore("f", "AppF");
const sX = await spore("x", "Fremd");

const sm = await zettel("s", sS, { subject: sM.id });
const ma = await zettel("m", sM, { subject: sA.id });
const mb = await zettel("m", sM, { subject: sB.id });
const mf = await zettel("m", sM, { subject: sF.id });

async function leser(name, extra) {
  const L = knoten(name);
  await L.init({ nodeName: name, spore: gesicht(null), vouchAnchors: [sS.id], dbSuffix: name.toLowerCase(), ...extra });
  return L;
}
const stand = (liste) => Object.fromEntries(liste.map(c => [c.nodeName, c.vouch.status + (c.vouch.reason ? ":" + c.vouch.reason : "")]));

// ═══ H · Punkt 1: der Bürge haftet nur für die eine App ═══
{
  const L = await leser("LH");
  const s = stand(await L.vouchTrust([karte(sM, { vouches: [sm] }), karte(sA, { vouches: [ma, sm] }), karte(sB, { vouches: [mb, sm] }),
    karte(sF, { vouches: [mf, sm] })], { flagged: [sF.id] }));
  t("H1 die auffällige App verliert ihre Bürgschaft", s.AppF === "unverbuergt:aufgefallen", JSON.stringify(s));
  t("H2 die übrigen Apps desselben Marktes bleiben verbürgt (Kette Netzadmin → Markt → App)", s.AppA === "verbuergt" && s.AppB === "verbuergt", JSON.stringify(s));
  t("H3 der Markt selbst bleibt verbürgt", s.Markt === "verbuergt", JSON.stringify(s));
}

// ═══ T · Punkt 2: Ablauf höchstens 180 Tage ═══
{
  const L = await leser("LT");
  const M = knoten("MT");
  await M.init({ nodeName: "Markt", spore: gesicht("m"), dbSuffix: "mt" });
  const r = await M.createVouch(sA.id);
  t("T1 ohne Angabe stellt createVouch 180 Tage aus", r.ok && r.zettel.exp - r.zettel.ts === 180 * TAG, String(r.zettel && r.zettel.exp - r.zettel.ts));
  const lang = await M.createVouch(sA.id, { days: 365 });
  t("T2 365 Tage gewünscht → auf 180 begrenzt", lang.ok && lang.zettel.exp - lang.zettel.ts === 180 * TAG);
  const jahr = await zettel("m", sM, { subject: sA.id, exp: now() + 365 * TAG });
  const genau = await zettel("m", sM, { subject: sA.id, exp: now() + 180 * TAG });
  const s1 = stand(await L.vouchTrust([karte(sA, { vouches: [jahr, sm] })]));
  const s2 = stand(await L.vouchTrust([karte(sA, { vouches: [genau, sm] })]));
  t("T3 eine Bürgschaft über 365 Tage ist ungültig, nicht still gekürzt", s1.AppA === "unverbuergt", JSON.stringify(s1));
  t("T4 genau 180 Tage gelten", s2.AppA === "verbuergt", JSON.stringify(s2));
  t("T5 _meta nennt 180 Tage und den Hinweis 30 Tage", L._meta.vouchTtlSec === 180 * TAG && L._meta.vouchWarnSec === 30 * TAG);
}

// ═══ W · Punkt 4: ein Widerruf trägt immer einen Grund ═══
{
  const M = knoten("MW");
  await M.init({ nodeName: "Markt", spore: gesicht("m"), dbSuffix: "mw" });
  const ohne = await M.createRevocation(sA.id);
  const leer = await M.createRevocation(sA.id, "   ");
  const zuLang = await M.createRevocation(sA.id, "x".repeat(201));
  t("W1 createRevocation ohne, mit leerem oder zu langem Grund: ok:false", !ohne.ok && !leer.ok && !zuLang.ok, JSON.stringify([ohne, leer, zuLang].map(x => x.reason)));
  const mit = await M.createRevocation(sA.id, "  Fehlerhafte Rezepte  ");
  t("W2 mit Grund: unterschrieben, Grund getrimmt unter der Signatur",
    mit.ok && mit.zettel.reason === "Fehlerhafte Rezepte" && await Sp.verifyDetached(ohneSig(mit.zettel), mit.zettel.sig, sM.publicKey), JSON.stringify(mit.reason || mit.zettel.reason));
  const alt = await zettel("m", sM, { subject: sA.id, ts: now() - 100 });
  const ohneGrund = await zettel("m", sM, { kind: "sbkim-vouch-revoke", subject: sA.id, ts: now() - 50 });
  const L = await leser("LW");
  const s1 = stand(await L.vouchTrust([karte(sA, { vouches: [alt, sm] }), karte(sM, { revocations: [ohneGrund] })]));
  t("W3 ein (echt unterschriebener) Widerruf ohne Grund ist ungültig", s1.AppA === "verbuergt", JSON.stringify(s1));
  const umgeschrieben = { ...mit.zettel, reason: "anderer Grund" };
  const L2 = await leser("LW2");
  const s2 = stand(await L2.vouchTrust([karte(sA, { vouches: [alt, sm] }), karte(sM, { revocations: [umgeschrieben] })]));
  t("W4 ein nachträglich geänderter Grund bricht die Unterschrift", s2.AppA === "verbuergt", JSON.stringify(s2));
  const L3 = await leser("LW3");
  const s3 = stand(await L3.vouchTrust([karte(sA, { vouches: [alt, sm] }), karte(sM, { revocations: [mit.zettel] })]));
  t("W5 der Widerruf mit Grund wirkt (Gegenstück zu W3/W4)", s3.AppA === "unverbuergt", JSON.stringify(s3));
  t("W6 _meta nennt die Grund-Länge", L3._meta.revokeReasonMax === 200);
}

// ═══ P · Punkt 5: der Leser speichert gesehene Widerrufe ═══
{
  const ls = speicher();
  const L = knoten("LP", ls);
  await L.init({ nodeName: "LP", spore: gesicht(null), vouchAnchors: [sS.id], dbSuffix: "lp" });
  const alt = await zettel("m", sM, { subject: sA.id, ts: now() - 100 });
  const w = await zettel("m", sM, { kind: "sbkim-vouch-revoke", subject: sA.id, ts: now() - 50, reason: "Probe" });
  const s1 = stand(await L.vouchTrust([karte(sA, { vouches: [alt, sm] }), karte(sM, { revocations: [w] })]));
  const s2 = stand(await L.vouchTrust([karte(sA, { vouches: [alt, sm] })]));
  t("P1 der Widerruf wirkt weiter, wenn der Bürge nicht mehr im Raum ist", s1.AppA === "unverbuergt" && s2.AppA === "unverbuergt", JSON.stringify([s1, s2]));
  t("P2 gespeichert unter sbkim_widerrufe_<dbSuffix>, mit Grund", L.loadSeenRevocations().length === 1 && ls.m.has("sbkim_widerrufe_lp") &&
    L.loadSeenRevocations()[0].reason === "Probe", JSON.stringify([...ls.m.keys()]));
  // Ein anderer Knoten liest denselben Speicher (frischer Start, geteilte Adresse)
  const L2 = knoten("LP2", ls);
  await L2.init({ nodeName: "LP2", spore: gesicht(null), vouchAnchors: [sS.id], dbSuffix: "lp" });
  t("P3 nach einem Neustart wirkt der gespeicherte Widerruf", stand(await L2.vouchTrust([karte(sA, { vouches: [alt, sm] })])).AppA === "unverbuergt");
  // Den Speicher fälschen: Widerruf auf eine andere Kennung umbiegen → beim Lesen neu geprüft
  const ls3 = speicher();
  const wB = { ...w, subject: sB.id };
  ls3.setItem("sbkim_widerrufe_lq", JSON.stringify({ v: 1, revocations: [wB] }));
  const L3 = knoten("LQ", ls3);
  await L3.init({ nodeName: "LQ", spore: gesicht(null), vouchAnchors: [sS.id], dbSuffix: "lq" });
  const mbAlt = await zettel("m", sM, { subject: sB.id, ts: now() - 100 });
  t("P4 ein im Speicher gefälschter Widerruf wird beim Lesen neu geprüft und zählt nicht",
    stand(await L3.vouchTrust([karte(sB, { vouches: [mbAlt, sm] })])).AppB === "verbuergt");
  const ls4 = speicher();
  const L4 = knoten("LR", ls4);
  await L4.init({ nodeName: "LR", spore: gesicht(null), vouchAnchors: [sS.id] });
  await L4.vouchTrust([karte(sA, { vouches: [alt, sm] }), karte(sM, { revocations: [w] })]);
  t("P5 ohne dbSuffix wird nichts gespeichert (geteilte Adresse)", ls4.m.size === 0 && L4.loadSeenRevocations().length === 0, JSON.stringify([...ls4.m.keys()]));
  const uralt = await zettel("m", sM, { kind: "sbkim-vouch-revoke", subject: sB.id, ts: now() - 181 * TAG, reason: "alt" });
  const ls5 = speicher();
  const L5 = knoten("LS", ls5);
  await L5.init({ nodeName: "LS", spore: gesicht(null), vouchAnchors: [sS.id], dbSuffix: "ls" });
  await L5.vouchTrust([karte(sM, { revocations: [uralt, w] })]);
  t("P6 ein Widerruf, der auf keine gültige Bürgschaft mehr wirken kann, wird nicht gespeichert",
    L5.loadSeenRevocations().length === 1 && L5.loadSeenRevocations()[0].sig === w.sig, String(L5.loadSeenRevocations().length));
  // Budget: 400 Fremd-Zettel im Raum verdrängen den gespeicherten Widerruf nicht
  const muell = Array.from({ length: 400 }, (_, i) => ({ kind: "sbkim-vouch", sig: "m" + i }));
  t("P7 400 fremde Zettel im Raum verdrängen den gespeicherten Widerruf nicht",
    stand(await L2.vouchTrust([karte(sA, { vouches: [alt, sm] })], { vouches: muell })).AppA === "unverbuergt");
}

// ═══ E · Punkt 3: Hinweis vor dem Ablauf ═══
{
  const A = knoten("AE");
  await A.init({ nodeName: "AppA", spore: gesicht("a"), dbSuffix: "ae" });
  const bald = await zettel("m", sM, { subject: sA.id, ts: now() - 170 * TAG, exp: now() + 10 * TAG });
  const spaet = await zettel("s", sS, { subject: sA.id, ts: now() - 100 * TAG, exp: now() + 60 * TAG });
  // Ein Bürge (X), der sonst nirgends bürgt, für eine fremde Kennung. Kam sie vom
  // selben Bürgen wie `bald` oder `spaet`, verdeckte sie die „neueste je Bürge“-Regel
  // (Gegenprobe 2026-10-16: zweimal blinder Wächter, je am Bürgen).
  const fremd = await zettel("x", sX, { subject: sB.id, ts: now() - 170 * TAG, exp: now() + 5 * TAG });
  for (const z of [bald, spaet, fremd]) await A.addCarried(z);
  const e1 = await A.vouchExpiring();
  t("E1 eigene Bürgschaft, die in 10 Tagen abläuft, wird gemeldet; 60 Tage nicht; fremde nicht",
    e1.length === 1 && e1[0].voucher === sM.id && e1[0].exp === bald.exp, JSON.stringify(e1));
  const neu = await zettel("m", sM, { subject: sA.id, ts: now() - 10, exp: now() + 170 * TAG });
  await A.addCarried(neu);
  const e2 = await A.vouchExpiring();
  t("E2 nach dem Verlängern (neue Bürgschaft desselben Bürgen) kein Hinweis mehr", e2.length === 0, JSON.stringify(e2));
  const O = knoten("OE");
  await O.init({ nodeName: "Ohne", spore: gesicht(null), dbSuffix: "oe" });
  t("E3 ohne Identität: leere Liste, kein Wurf", Array.isArray(await O.vouchExpiring()) && (await O.vouchExpiring()).length === 0);
}

// ═══ N · „antworte nur Verbürgten" ═══
{
  const R = relay();
  const match = { relatedness() { return 0; }, async queryLocal() { return [{ label: "Treffer", score: 0.9 }]; } };
  const A = knoten("AN"), X = knoten("XN");
  await A.init({ nodeName: "AppA", relayClient: R, spore: gesicht("a"), dbSuffix: "an" });
  await X.init({ nodeName: "Fremd", relayClient: R, spore: gesicht("x"), dbSuffix: "xn" });
  await A.addCarried(ma); await A.addCarried(sm);
  const B = knoten("BN");
  await B.init({ nodeName: "AppB", relayClient: R, spore: gesicht("b"), match, dbSuffix: "bn", answerOnlyVouched: true, vouchAnchors: [sS.id] });
  await B.enableAnswering();
  await warte(50);
  const rA = await A.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 1500 });
  const q = R.st.map(e => { try { return JSON.parse(e.content); } catch { return null; } }).find(z => z && z.kind === "sbkim-query" && z.qid === rA.qid);
  t("N1 die Frage trägt die eigenen Bürgschaften (≤ 4), unter der Unterschrift",
    !!q && Array.isArray(q.vouches) && q.vouches.length === 2 && q.vouches.length <= B._meta.queryVouchMax &&
    await Sp.verifyDetached(ohneSig(q), q.sig, sA.publicKey), JSON.stringify(q && q.vouches && q.vouches.length));
  t("N2 verbürgte App (Netzadmin → Markt → App, aus der Frage gelesen) bekommt eine Antwort", rA.ok === true, JSON.stringify(rA).slice(0, 160));
  const rX = await X.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 1500 });
  t("N3 unverbürgter Fremder bekommt keine Antwort, gezählt", rX.ok === false && B._meta.fragenNichtVerbuergt === 1, JSON.stringify([rX.ok, B._meta.fragenNichtVerbuergt]));
  // unsignierte Frage im Namen von A, mit A's Bürgschaften
  await R.publish({ kind: 1, created_at: now(), tags: [["t", "sbkim-qry"]], content: JSON.stringify({
    kind: "sbkim-query", qid: "qu-1", toNodeId: sB.id, fromNodeId: sA.id, fromName: "AppA", text: "Brett", k: 3, ts: now(), vouches: [ma, sm] }) });
  await warte(400);
  const beantwortet = (qid) => R.st.some(e => { try { const z = JSON.parse(e.content); return z.kind === "sbkim-query-res" && z.qid === qid; } catch { return false; } });
  t("N4 eine unsignierte Frage hat keinen geprüften Absender → keine Antwort", !beantwortet("qu-1") && B._meta.fragenNichtVerbuergt === 2, String(B._meta.fragenNichtVerbuergt));
  t("N5 _meta zeigt die Einstellung", B._meta.answerOnlyVouched === true);
  // Aus: wie bisher
  const B2 = knoten("BN2");
  await B2.init({ nodeName: "AppB", relayClient: R, spore: gesicht("b"), match, dbSuffix: "bn2" });
  t("N6 Vorgabe ist AUS", B2.answerOnlyVouched() === false && B2._meta.answerOnlyVouched === false);
  B.disableAnswering();
  await B2.enableAnswering();
  await warte(50);
  const rX2 = await X.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 1500 });
  t("N7 ausgeschaltet: der Fremde bekommt wie bisher eine Antwort", rX2.ok === true, JSON.stringify(rX2).slice(0, 160));
  B2.disableAnswering();
  // Gespeichert je Knoten
  const ls = speicher();
  const P = knoten("PN", ls);
  await P.init({ nodeName: "P", spore: gesicht(null), dbSuffix: "pn" });
  const an = P.setAnswerOnlyVouched(true);
  const P2 = knoten("PN2", ls);
  await P2.init({ nodeName: "P", spore: gesicht(null), dbSuffix: "pn" });
  t("N8 die Einstellung wird gespeichert und überlebt einen Neustart", an.ok && P2.answerOnlyVouched() === true, JSON.stringify(an));
  const Q = knoten("QN");
  await Q.init({ nodeName: "Q", spore: gesicht(null) });
  t("N9 ohne dbSuffix: nicht gespeichert, ok:false", Q.setAnswerOnlyVouched(true).ok === false && Q.answerOnlyVouched() === false);
  // Kontakt statt Kette: B3 kennt X als eigenen Kontakt
  const B3 = knoten("BN3");
  await B3.init({ nodeName: "AppB", relayClient: R, spore: gesicht("b"), match, dbSuffix: "bn3", answerOnlyVouched: true });
  B3.saveVouchContacts([{ nodeId: sX.id, name: "Fremd" }]);
  await B3.enableAnswering();
  await warte(50);
  const rX3 = await X.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 1500 });
  t("N10 ein eigener Kontakt bekommt eine Antwort", rX3.ok === true, JSON.stringify(rX3).slice(0, 160));
  B3.disableAnswering();
  // Ohne Prüf-Modul beim Antwortenden ist der Absender nicht geprüft (S1 „unbestätigt"):
  // auch eine Kennung aus den eigenen Kontakten bekommt dann keine Antwort.
  const B4 = knoten("BN4");
  await B4.init({ nodeName: "AppB", relayClient: R, match, dbSuffix: "bn4", answerOnlyVouched: true,
    spore: { async getOwnSpore() { return Sp.getOwnSpore("b"); }, signDetached: (o) => Sp.signDetached(o, "b") } });
  B4.saveVouchContacts([{ nodeId: sX.id, name: "Fremd" }]);
  await B4.enableAnswering();
  await warte(500);                                  // A12: ältere Fragen im Rückblick erst abarbeiten
  const n0 = B4._meta.fragenNichtVerbuergt;
  const rX4 = await X.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 1500 });
  t("N11 ohne Prüf-Modul wird auch ein „Kontakt“ nicht beantwortet (Absender nicht prüfbar)", rX4.ok === false && B4._meta.fragenNichtVerbuergt === n0 + 1,
    JSON.stringify([rX4.ok, n0, B4._meta.fragenNichtVerbuergt]));
  B4.disableAnswering();
}

// ═══ U · im echten Browser: Grund-Feld, Ablauf-Hinweis, Schalter (DE/EN) ═══
{
  const { chromium } = await import("playwright-core");
  const http = await import("node:http");
  const seite = (lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>
<script src="/src/modules/23_rendezvous.js"></script><script src="/src/modules/23_rendezvous_ui.js"></script></body></html>`;
  const srv = http.createServer((q, r) => {
    const m = /^\/v-(de|en)\.html/.exec(q.url);
    if (m) { r.writeHead(200, { "content-type": "text/html" }); r.end(seite(m[1])); return; }
    try { const d = readFileSync(resolve(root, "." + q.url.split("?")[0])); r.writeHead(200, { "content-type": "text/javascript" }); r.end(d); }
    catch { r.writeHead(404); r.end(); }
  }).listen(0);
  const port = srv.address().port;
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  async function lauf(lang) {
    const pg = await browser.newPage({ viewport: { width: 360, height: 780 } });
    const fehler = [];
    pg.on("pageerror", (e) => fehler.push(String(e)));
    await pg.goto(`http://127.0.0.1:${port}/v-${lang}.html`);
    await pg.evaluate(async () => {
      await window.SbkimRendezvousUI.init({ nodeName: "Prüfknoten" });
      const R = window.SbkimRendezvous;
      R.configure({ dbSuffix: "vprobe" });
      R.saveVouchContacts([{ nodeId: "markt-kennung-000000", name: "<img src=x onerror=alert(1)>Markt" }]);
      window.__ruf = [];
      R.vouchSafetyNumber = async () => ({ ok: true, number: "12345 67890 11111 22222 33333 44444" });
      R.createRevocation = async (id, g) => { window.__ruf.push("revoke:" + id + ":" + g); return { ok: true, zettel: { kind: "sbkim-vouch-revoke", subject: id, sig: "w" } }; };
      R.addCarried = async () => ({ ok: true });
      R.vouchExpiring = async () => [{ voucher: "markt-kennung-000000", exp: Date.UTC(2026, 10, 1) / 1000, ts: 1 }];
      R.discover = async () => ({ ok: true, cardsVerified: true, rejected: 0, cards: [
        { nodeId: "id-bert-0000000000000", nodeName: "Bert", spore: { id: "id-bert", publicKey: { x: "abc" } }, ts: 1, ageSec: 5 }] });
      window.SbkimRendezvousUI.show();
    });
    await pg.waitForFunction(() => !!document.querySelector("[data-sbkim-ablauf]"), null, { timeout: 5000 }).catch(() => {});
    const r = {};
    r.summary = await pg.evaluate(() => document.querySelector("[data-sbkim-buergen-box] summary").textContent);
    r.ablauf = await pg.evaluate(() => [...document.querySelectorAll("[data-sbkim-ablauf]")].map((e) => e.getAttribute("data-sbkim-ablauf") + "|" + e.textContent));
    await pg.locator("button", { hasText: /Wer ist im Raum|Who is in the room/ }).first().click();
    await pg.waitForSelector("[data-sbkim-buergen-knopf]", { timeout: 8000 });
    await pg.click("[data-sbkim-buergen-knopf]");
    await pg.click("[data-sbkim-widerruf]");
    await pg.waitForTimeout(150);
    r.ohneGrund = { ruf: await pg.evaluate(() => window.__ruf.slice()), msg: await pg.textContent("[data-sbkim-buergen-meldung]") };
    await pg.fill("[data-sbkim-widerruf-grund]", "  Spam im Markt ");
    await pg.click("[data-sbkim-widerruf]");
    await pg.waitForTimeout(150);
    r.mitGrund = await pg.evaluate(() => window.__ruf.slice());
    await pg.click("[data-sbkim-buergen-box] summary");
    await pg.waitForTimeout(100);
    r.vorher = await pg.isChecked("[data-sbkim-nur-verbuergt]");
    await pg.check("[data-sbkim-nur-verbuergt]");
    await pg.waitForTimeout(50);
    r.nachher = await pg.evaluate(() => window.SbkimRendezvous.answerOnlyVouched());
    r.text = await pg.evaluate(() => document.querySelector("[data-sbkim-buergen-box]").textContent + " " + document.querySelector("[data-sbkim-buergen-feld]").outerHTML);
    r.img = await pg.evaluate(() => document.querySelectorAll("img[src=x]").length);
    r.sw = await pg.evaluate(() => document.documentElement.scrollWidth);
    await pg.close();
    return { ...r, fehler };
  }
  const de = await lauf("de"), en = await lauf("en");
  await browser.close(); srv.close();
  t("U1 Hinweis vor dem Ablauf: Bürge (Name aus den Kontakten, als Text) und Datum; Überschrift sagt es",
    de.ablauf.length === 1 && de.ablauf[0].startsWith("markt-kennung-000000|⏳ Empfehlung von <img src=x onerror=alert(1)>Markt · markt-kennun…") &&
    de.ablauf[0].includes("2026-11-01") && /läuft bald ab/.test(de.summary), JSON.stringify([de.ablauf, de.summary]));
  t("U2 ohne Grund wird nicht widerrufen", de.ohneGrund.ruf.length === 0 && /Grund/.test(de.ohneGrund.msg), JSON.stringify(de.ohneGrund));
  t("U3 mit Grund: Grund getrimmt an createRevocation", de.mitGrund[0] === "revoke:id-bert-0000000000000:Spam im Markt", JSON.stringify(de.mitGrund));
  t("U4 Schalter „Nur Verbürgten antworten“: aus → an, gespeichert", de.vorher === false && de.nachher === true, JSON.stringify([de.vorher, de.nachher]));
  t("U5 englische Oberfläche ohne deutschen S5b-Satz",
    !/Bürgschaft von|Empfehlung von|läuft|Grund des Widerrufs|Nur Verbürgten|Nur Empfohlenen|verbürgt ist|empfohlen ist/.test(en.text) && /expires|Answer only recommended|Reason for the revocation/.test(en.text) &&
    en.ablauf.length === 1 && /expires on 2026-11-01/.test(en.ablauf[0]), en.ablauf.concat([en.text.slice(0, 200)]).join(" | "));
  t("U6 fremder Name nur als Text, keine Seitenfehler, kein Überlauf bei 360 px (DE und EN)",
    de.img === 0 && en.img === 0 && !de.fehler.length && !en.fehler.length && de.sw <= 360 && en.sw <= 360, JSON.stringify({ i: [de.img, en.img], f: de.fehler.concat(en.fehler), sw: [de.sw, en.sw] }));
}

// ═══ Z · Siegel-Aspekt und Tafel ═══
{
  const siegel = readFileSync(resolve(root, "src/modules/16_siegel.js"), "utf8");
  t("Z1 Siegel-Aspekt S5b steht (DE + EN)", siegel.includes('aspect:      "Bürgen für fremde Apps: befristet, mit Grund, je App (S5b)"') &&
    siegel.includes('"Vouching for other apps: limited, with a reason, per app (S5b)"'));
  t("Z2 der S5-Aspekt verspricht nichts mehr, was S5b ersetzt hat (kein „ein Jahr“, kein Verlust aller Bürgschaften)",
    !siegel.includes("zwei Schritte weit und ein Jahr lang") && !siegel.includes("verliert das Gewicht seiner Bürgschaften"));
  const tafel = readFileSync(resolve(root, "docs/INTERFACES.md"), "utf8");
  t("Z3 INTERFACES: Widerruf mit reason, S5b-Abschnitt", tafel.includes("reason, spore, sig }      (reason: S5b, Pflicht)") && tafel.includes("S5b „Bürgen für fremde Apps in den Märkten"));
}

console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exitCode = rot ? 1 : 0;
