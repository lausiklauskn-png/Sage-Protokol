// Smoke-Test S5 „Bürgen" — Teil 1: Format, Prüfung, Anzeige (2026-10-15,
// docs/PLAN_MYCEL_SCHICHTEN.md, INTERFACES § Modul 23 S5).
//
// Klaus' Werte (2026-10-15): Kette höchstens 2 Schritte · Anker „Klaus + eigene
// Kontakte" · Ablauf 1 Jahr. Echtes Modul 01/02, echt signierte Sporen; nur das
// Relais ist gestellt. Gegenprobe: tests/gegenprobe_s5_buergen.mjs.

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
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
function knoten(name) {
  const c = { console: still, setTimeout, clearTimeout, Date, Math, JSON, Promise, TextEncoder, TextDecoder, crypto: webcrypto, btoa, atob,
    localStorage: speicher() };
  c.globalThis = c; vm.createContext(c); vm.runInContext(m23, c, { filename: name + "/23_rendezvous.js" }); return c.SbkimRendezvous;
}
function gesicht(slot, { mitSign = true, mitPruef = true } = {}) {
  const g = { async getOwnSpore() { return slot ? Sp.getOwnSpore(slot) : null; } };
  if (mitPruef) { g.verifyForeignSpore = Sp.verifyForeignSpore; g.verifyDetached = Sp.verifyDetached; }
  if (mitSign && slot) g.signDetached = (o) => Sp.signDetached(o, slot);
  return g;
}
async function spore(slot, name) {
  await Sp.getOrCreateIdentity(slot);
  return Sp.generateOwnSpore({ domain: "Test", endpoint: "https://" + slot + ".example/", nodeType: "hybrid", nodeName: name }, slot);
}
const now = () => Math.floor(Date.now() / 1000);
const JAHR = 365 * 24 * 3600;
const ohneSig = ({ sig, ...x }) => x;
async function zettel(slot, sp, felder) {
  const z = { kind: "sbkim-vouch", v: 1, voucher: sp.id, ts: now(), spore: sp, ...felder };
  if (z.kind === "sbkim-vouch" && z.exp === undefined) z.exp = z.ts + JAHR;
  z.sig = await Sp.signDetached(ohneSig(z), slot);
  return z;
}
const karte = (s, extra) => ({ nodeId: s.id, nodeName: s.nodeName, spore: s, ts: now(), ...extra });

const sK = await spore("k", "Klaus");
const sA = await spore("a", "Anna");
const sB = await spore("b", "Bert");
const sC = await spore("c", "Carl");
const sF = await spore("f", "Fälscher");
const sX = await spore("x", "Sybil-X");
const sY = await spore("y", "Sybil-Y");

// Leser: eigener Knoten ohne eigene Bürgschaften, Anker = Klaus
const L = knoten("Leser");
await L.init({ nodeName: "Leser", spore: gesicht(null), vouchAnchors: [sK.id], dbSuffix: "leser" });
const status = async (cards, opts) => Object.fromEntries((await L.vouchTrust(cards, opts)).map(c => [c.nodeName, c.vouch]));

// ═══ A · Ausstellen ═══
{
  const K = knoten("K");
  await K.init({ nodeName: "Klaus", spore: gesicht("k"), dbSuffix: "k" });
  const r = await K.createVouch(sA.id);
  t("A1 createVouch: signiert, Frist genau 1 Jahr, an die Kennung gebunden",
    r.ok && r.zettel.kind === "sbkim-vouch" && r.zettel.voucher === sK.id && r.zettel.subject === sA.id &&
    r.zettel.exp - r.zettel.ts === JAHR && await Sp.verifyDetached(ohneSig(r.zettel), r.zettel.sig, sK.publicKey), JSON.stringify(r).slice(0, 160));
  const selbst = await K.createVouch(sK.id);
  t("A2 für sich selbst bürgt man nicht", selbst.ok === false, JSON.stringify(selbst));
  const lang = await K.createVouch(sA.id, { days: 900 });
  t("A3 längere Frist wird auf 1 Jahr begrenzt", lang.ok && lang.zettel.exp - lang.zettel.ts === JAHR, String(lang.zettel && lang.zettel.exp - lang.zettel.ts));
  const W = knoten("W");
  await W.init({ nodeName: "Ohne", spore: gesicht(null), dbSuffix: "w" });
  const ohne = await W.createVouch(sA.id);
  t("A4 ohne Identität: ok:false, kein Wurf", ohne.ok === false, JSON.stringify(ohne));
}

// ═══ K · Kette ═══
{
  const kA = await zettel("k", sK, { subject: sA.id });
  const aB = await zettel("a", sA, { subject: sB.id });
  const bC = await zettel("b", sB, { subject: sC.id });
  const s1 = await status([karte(sK), karte(sA, { vouches: [kA] }), karte(sB, { vouches: [aB, kA] }), karte(sC, { vouches: [bC, aB] })]);
  t("K1 Anker erkennt sich als Anker", s1.Klaus?.status === "anker", JSON.stringify(s1.Klaus));
  t("K2 Anker bürgt → verbürgt, 1 Schritt", s1.Anna?.status === "verbuergt" && s1.Anna.depth === 1 && s1.Anna.by[0] === sK.id, JSON.stringify(s1.Anna));
  t("K3 Kette Anker → Anna → Bert zählt (2 Schritte)", s1.Bert?.status === "verbuergt" && s1.Bert.depth === 2 &&
    JSON.stringify(s1.Bert.by) === JSON.stringify([sK.id, sA.id]), JSON.stringify(s1.Bert));
  t("K4 dritter Schritt zählt nicht mehr", s1.Carl?.status === "unverbuergt", JSON.stringify(s1.Carl));
  const xy = await zettel("x", sX, { subject: sY.id });
  const yx = await zettel("y", sY, { subject: sX.id });
  const s2 = await status([karte(sX, { vouches: [yx] }), karte(sY, { vouches: [xy] })]);
  t("K5 Selbst-Bürgen unter Fremden zählt bei niemandem", s2["Sybil-X"]?.status === "unverbuergt" && s2["Sybil-Y"]?.status === "unverbuergt",
    JSON.stringify(s2));
  const s3 = await status([karte(sA), karte(sB, { vouches: [aB] })], { contacts: [sA.id] });
  t("K6 eigener Kontakt ist Wurzel", s3.Anna?.status === "kontakt" && s3.Bert?.status === "verbuergt" && s3.Bert.by[0] === sA.id,
    JSON.stringify(s3));
  t("K7 gespeicherter Kontakt ist Wurzel", L.saveVouchContacts([{ nodeId: sA.id, name: "Anna (mein Kontakt)" }]).ok &&
    (await status([karte(sA)])).Anna?.status === "kontakt");
  L.saveVouchContacts([]);
  const s4 = await status([karte(sA)], { vouches: [kA] });
  t("K8 Zettel aus einer anderen Karte zählen (Sammlung aus dem ganzen Raum)", s4.Anna?.status === "verbuergt", JSON.stringify(s4));
}

// ═══ G · Gültigkeit jeder Bürgschaft ═══
{
  const echt = await zettel("k", sK, { subject: sA.id });
  const umgebogen = { ...echt, subject: sB.id };
  t("G1 nachträglich umgebogene Kennung zählt nicht", (await status([karte(sB, { vouches: [umgebogen] })])).Bert?.status === "unverbuergt");
  // Fälscher unterschreibt mit SEINEM Schlüssel einen Zettel „Bürge: Klaus" —
  // die Unterschrift stimmt, nur die Bindung Spore ↔ Bürge nicht.
  const fremdeSpore = await zettel("f", sF, { voucher: sK.id, subject: sA.id });
  t("G2 Spore passt nicht zum Bürgen → zählt nicht", (await status([karte(sA, { vouches: [fremdeSpore] })])).Anna?.status === "unverbuergt");
  const falscheSpore = { ...echt, spore: sF };
  t("G3 fremde Spore unter dem Zettel → zählt nicht", (await status([karte(sA, { vouches: [falscheSpore] })])).Anna?.status === "unverbuergt");
  const abgelaufen = await zettel("k", sK, { subject: sA.id, ts: now() - JAHR - 100, exp: now() - 100 });
  t("G4 abgelaufene Bürgschaft zählt nicht", (await status([karte(sA, { vouches: [abgelaufen] })])).Anna?.status === "unverbuergt");
  const zuLang = await zettel("k", sK, { subject: sA.id, exp: now() + JAHR + 3600 });
  t("G5 Frist über 1 Jahr: ungültig, nicht still gekürzt", (await status([karte(sA, { vouches: [zuLang] })])).Anna?.status === "unverbuergt");
  const zukunft = await zettel("k", sK, { subject: sA.id, ts: now() + 3600, exp: now() + 7200 });
  t("G6 Zeitstempel in der Zukunft zählt nicht", (await status([karte(sA, { vouches: [zukunft] })])).Anna?.status === "unverbuergt");
  const ohneSigZ = ohneSig(echt);
  t("G7 ohne Unterschrift zählt nicht", (await status([karte(sA, { vouches: [ohneSigZ] })])).Anna?.status === "unverbuergt");
  t("G8 die echte zählt (Gegenstück zu G1–G7)", (await status([karte(sA, { vouches: [echt] })])).Anna?.status === "verbuergt");
}

// ═══ W · Widerruf ═══
{
  const alt = await zettel("k", sK, { subject: sA.id, ts: now() - 100 });
  const weg = await zettel("k", sK, { kind: "sbkim-vouch-revoke", subject: sA.id, ts: now() - 50 });
  t("W1 Widerruf schlägt die ältere Bürgschaft", (await status([karte(sA, { vouches: [alt] }), karte(sK, { revocations: [weg] })])).Anna?.status === "unverbuergt");
  const neu = await zettel("k", sK, { subject: sA.id, ts: now() - 10 });
  t("W2 eine neuere Bürgschaft gilt wieder", (await status([karte(sA, { vouches: [alt, neu] }), karte(sK, { revocations: [weg] })])).Anna?.status === "verbuergt");
  const fremd = await zettel("b", sB, { kind: "sbkim-vouch-revoke", subject: sA.id, ts: now() - 5 });
  t("W3 Widerruf eines anderen zählt nicht", (await status([karte(sA, { vouches: [alt] }), karte(sB, { revocations: [fremd] })])).Anna?.status === "verbuergt");
  const gefaelscht = { ...weg, subject: sB.id };
  const kB = await zettel("k", sK, { subject: sB.id, ts: now() - 100 });
  t("W4 gefälschter Widerruf nimmt nichts weg", (await status([karte(sB, { vouches: [kB] }), karte(sK, { revocations: [gefaelscht] })])).Bert?.status === "verbuergt");
}

// ═══ H · Der Bürge haftet ═══
{
  const kA = await zettel("k", sK, { subject: sA.id });
  const aB = await zettel("a", sA, { subject: sB.id });
  const aF = await zettel("a", sA, { subject: sF.id });
  const s = await status([karte(sA, { vouches: [kA] }), karte(sB, { vouches: [aB, kA] }), karte(sF, { vouches: [aF, kA] })], { flagged: [sF.id] });
  t("H1 Bürge eines Aufgefallenen verliert seine Bürgschaften", s.Bert?.status === "unverbuergt", JSON.stringify(s.Bert));
  t("H2 der Aufgefallene selbst ist nie verbürgt", s["Fälscher"]?.status === "unverbuergt" && s["Fälscher"].reason === "aufgefallen", JSON.stringify(s["Fälscher"]));
  t("H3 der Bürge selbst bleibt verbürgt (sein Bürge haftet nicht mit)", s.Anna?.status === "verbuergt", JSON.stringify(s.Anna));
  const s2 = await status([karte(sA, { vouches: [kA] }), karte(sB, { vouches: [aB, kA] })]);
  t("H4 ohne Auffälligen zählt Annas Bürgschaft (Gegenstück zu H1)", s2.Bert?.status === "verbuergt");
}

// ═══ R · im Raum: mittragen, sammeln, nicht verdrängen ═══
{
  function relais() {
    const st = [];
    const hit = (f, e) => (!f["#t"] || f["#t"].some(x => e.tags.some(tg => tg[1] === x))) && (typeof f.since !== "number" || e.created_at >= f.since);
    return { st,
      async publish(b) { const e = { pubkey: "p" + st.length, ...b }; st.push(e); return e; },
      subscribe(f, cb) { setTimeout(() => st.forEach(e => hit(f, e) && cb(e)), 0); return () => {}; } };
  }
  const R = relais();
  const K = knoten("K2"), A = knoten("A2"), Le = knoten("Leser2");
  await K.init({ nodeName: "Klaus", relayClient: R, spore: gesicht("k"), dbSuffix: "k2" });
  await A.init({ nodeName: "Anna", relayClient: R, spore: gesicht("a"), dbSuffix: "a2" });
  await Le.init({ nodeName: "Leser", relayClient: R, spore: gesicht(null), vouchAnchors: [sK.id], dbSuffix: "l2" });
  const v = await K.createVouch(sA.id);
  const auf = await A.addCarried(v.zettel);
  t("R1 erhaltene Bürgschaft geht in den eigenen Vorrat", auf.ok === true, JSON.stringify(auf));
  t("R2 ein kaputter Zettel geht nicht in den Vorrat", (await A.addCarried({ ...v.zettel, subject: sB.id })).ok === false);
  await A.announce();
  const karteA = JSON.parse(R.st[R.st.length - 1].content);
  t("R3 die eigene Karte trägt die Bürgschaft", Array.isArray(karteA.vouches) && karteA.vouches.length === 1 && karteA.vouches[0].sig === v.zettel.sig);
  const d1 = await Le.discover({ listenMs: 80, checkMeaning: false });
  const a1 = d1.cards.find(c => c.nodeId === sA.id);
  t("R4 discover: Anna erscheint verbürgt von Klaus", a1?.vouch?.status === "verbuergt" && a1.vouch.by[0] === sK.id, JSON.stringify(a1 && a1.vouch));
  // Klaus widerruft und meldet sich an; danach legt ein Dritter eine NEUERE Karte mit
  // Klaus' (öffentlicher) Spore aus — ohne den Widerruf.
  const w = await K.createRevocation(sA.id);
  await K.addCarried(w.zettel);
  await K.announce();
  R.st.push({ pubkey: "dritter", kind: 1, created_at: now() + 1, tags: [["t", "sbkim-rdv"]],
    content: JSON.stringify({ kind: "sbkim-presence", nodeId: sK.id, nodeName: "Klaus", spore: sK, ts: now() + 1 }) });
  const d2 = await Le.discover({ listenMs: 80, checkMeaning: false });
  const a2 = d2.cards.find(c => c.nodeId === sA.id);
  t("R5 Widerruf wirkt, auch wenn eine neuere Karte ihn nicht trägt", a2?.vouch?.status === "unverbuergt", JSON.stringify(a2 && a2.vouch));
  t("R6 unverbürgt bleibt sichtbar (markieren, nicht abweisen)", !!a2 && d2.cards.some(c => c.nodeId === sK.id));
  const d3 = await Le.discover({ listenMs: 80, checkMeaning: false, vouchTrust: false });
  t("R7 vouchTrust:false → keine Bürgschaft an der Karte", d3.cards.every(c => c.vouch === undefined));
  const O = knoten("Ohne02");
  await O.init({ nodeName: "Ohne", spore: gesicht(null, { mitPruef: false }), vouchAnchors: [sK.id] });
  const o = await O.vouchTrust([karte(sA, { vouches: [v.zettel] })]);
  t("R8 ohne Prüf-Modul: unverbürgt mit Grund, nie still verbürgt", o[0].vouch.status === "unverbuergt" && /nicht prüfbar/.test(o[0].vouch.reason || ""),
    JSON.stringify(o[0].vouch));
  t("R9 _meta: Kette 2, Frist 1 Jahr", Le._meta.vouchChainMax === 2 && Le._meta.vouchTtlSec === JAHR && Le._meta.vouchAnchors === 1,
    JSON.stringify([Le._meta.vouchChainMax, Le._meta.vouchTtlSec, Le._meta.vouchAnchors]));
  const rang = Le.rankCardsByQuery([{ ...karte(sA), vouch: { status: "unverbuergt" } }, { ...karte(sB), vouch: { status: "verbuergt" } }], null);
  t("R10 Rangfolge unverändert (Vorrang ist Klaus' offener Entscheid)", rang.map(c => c.nodeName).join(",") === "Anna,Bert");
}

// ═══ B · im echten Browser: die Karte zeigt die Bürgschaft (DE/EN), nur als Text ═══
{
  const { chromium } = await import("playwright-core");
  const http = await import("node:http");
  const seite = (lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>
<script src="/src/modules/23_rendezvous.js"></script><script src="/src/modules/23_rendezvous_ui.js"></script></body></html>`;
  const srv = http.createServer((q, r) => {
    const m = /^\/t-(de|en)\.html/.exec(q.url);
    if (m) { r.writeHead(200, { "content-type": "text/html" }); r.end(seite(m[1])); return; }
    try { const d = readFileSync(resolve(root, "." + q.url.split("?")[0])); r.writeHead(200, { "content-type": "text/javascript" }); r.end(d); }
    catch { r.writeHead(404); r.end(); }
  }).listen(0);
  const port = srv.address().port;
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  async function zeige(lang) {
    const pg = await browser.newPage({ viewport: { width: 360, height: 780 } });
    const fehler = [];
    pg.on("pageerror", (e) => fehler.push(String(e)));
    await pg.goto(`http://127.0.0.1:${port}/t-${lang}.html`);
    await pg.evaluate(async () => {
      await window.SbkimRendezvousUI.init({ nodeName: "Prüfknoten" });
      window.SbkimRendezvous.configure({ dbSuffix: "bprobe" });
      window.SbkimRendezvous.saveVouchContacts([{ nodeId: "kontakt-anna-0000", name: "Anna" }]);
      window.SbkimRendezvous.discover = async () => ({ ok: true, cardsVerified: true, rejected: 0, cards: [
        { nodeId: "id-a", nodeName: "<img src=x onerror=alert(1)>Echt", spore: { id: "id-a" }, ts: 1, ageSec: 5, vouch: { status: "verbuergt", by: ["kontakt-anna-0000"], depth: 1 } },
        { nodeId: "id-b", nodeName: "Weit", spore: { id: "id-b" }, ts: 1, ageSec: 5, vouch: { status: "verbuergt", by: ["kontakt-anna-0000", "fremd-9999-xyz"], depth: 2 } },
        { nodeId: "id-c", nodeName: "Anker", spore: { id: "id-c" }, ts: 1, ageSec: 5, vouch: { status: "anker", by: [], depth: 0 } },
        { nodeId: "id-d", nodeName: "Offen", spore: { id: "id-d" }, ts: 1, ageSec: 5, vouch: { status: "unverbuergt", by: [], depth: null } }] });
      window.SbkimRendezvousUI.show();
    });
    await pg.locator("button", { hasText: /Wer ist im Raum|Who is in the room/ }).first().click();
    await pg.waitForFunction(() => document.querySelectorAll("[data-sbkim-vouch]").length >= 3, null, { timeout: 8000 }).catch(() => {});
    const r = await pg.evaluate(() => ({
      b: [...document.querySelectorAll("[data-sbkim-vouch]")].map((e) => e.getAttribute("data-sbkim-vouch") + "|" + e.textContent),
      img: document.querySelectorAll("img[src=x]").length, sw: document.documentElement.scrollWidth }));
    await pg.close();
    return { ...r, fehler };
  }
  const de = await zeige("de"), en = await zeige("en");
  await browser.close(); srv.close();
  const erwartDe = ["verbuergt|🤝 verbürgt von Anna · kontakt-…", "verbuergt|🤝 verbürgt von fremd-99… (über 1 weiteren Schritt)", "anker|🤝 Anker"];
  t("B1 verbürgte Karten zeigen Bürge und Kennung, unverbürgte nichts (DE)", JSON.stringify(de.b) === JSON.stringify(erwartDe), JSON.stringify(de.b));
  t("B2 englische Oberfläche: kein deutscher Satz", en.b.length === 3 && en.b.every((x) => !/verbürgt|Schritt|Anker/.test(x)), JSON.stringify(en.b));
  t("B3 fremder Name nur als Text, keine Seitenfehler, kein Überlauf bei 360 px",
    de.img === 0 && en.img === 0 && !de.fehler.length && !en.fehler.length && de.sw <= 360, JSON.stringify({ img: de.img, f: de.fehler, sw: de.sw }));
}

console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exitCode = rot ? 1 : 0;
