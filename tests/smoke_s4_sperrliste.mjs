// Smoke-Test S4 „Signierte Sperrliste im Mycel" (2026-10-16, docs/PLAN_MYCEL_SCHICHTEN.md,
// INTERFACES § Modul 23 S4).
//
// Klaus 2026-10-16: öffentlich, signiert, Sage-Protokol unterschreibt (im eigenen
// Netz dessen Netzadmin). Die Liste reist auf den Karten im Raum mit. Anders als
// S5 GATET S4: gesperrte Karten fallen heraus, Fragen gesperrter Kennungen werden
// nicht beantwortet, ihre Antworten verworfen.
// Geprüft wird in einem EIGENEN Netz mit Netzadmin „Klaus" (Sage-Protokols
// Schlüssel liegt nicht hier), dazu, dass im offenen Mycel nur Sage-Protokol zählt.
// Die Unterschrift wird mit Modul 02 (echt, Ed25519) nachgeprüft.
// Gegenprobe: tests/gegenprobe_s4_sperrliste.mjs.

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
function speicher() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m };
}
function knoten(ctxName, ls) {
  const c = { console: still, setTimeout, clearTimeout, Date, Math, JSON, Promise, TextEncoder, TextDecoder, crypto: webcrypto, btoa, atob, localStorage: ls || speicher() };
  c.globalThis = c; vm.createContext(c); vm.runInContext(m23, c, { filename: ctxName + "/23_rendezvous.js" }); return c.SbkimRendezvous;
}
function gesicht(slot) {
  return { async getOwnSpore() { return slot ? Sp.getOwnSpore(slot) : null; }, verifyForeignSpore: Sp.verifyForeignSpore,
           verifyDetached: Sp.verifyDetached, signDetached: (o) => Sp.signDetached(o, slot) };
}
async function spore(slot, meta) { await Sp.getOrCreateIdentity(slot); return Sp.generateOwnSpore({ domain: "Test", endpoint: "https://" + slot + ".example/", nodeType: "hybrid", ...meta }, slot); }
const warte = (ms) => new Promise(r => setTimeout(r, ms));
const ohneSig = ({ sig, ...x }) => x;
const CODE = "ABCDEFGHJKLMNP";
const SAGE = "BgjXhSApoOrJD6zFJ4uuEpAliGWPokpKn7UMWRm94PA";
const matchMit = (label) => ({ relatedness() { return 0; }, async queryLocal() { return [{ label, score: 0.9 }]; } });

const sK = await spore("k", { nodeName: "Klaus" });
const sX = await spore("x", { nodeName: "Stoerer" });
const sY = await spore("y", { nodeName: "Gast" });
const sB = await spore("b", { nodeName: "Kimboard" });
const sL = await spore("l", { nodeName: "Leser" });

async function imNetz(name, slot, R, extra) {
  const N = knoten(name, extra && extra.ls);
  await N.init({ nodeName: name, relayClient: R, spore: gesicht(slot), dbSuffix: (extra && extra.suffix) || ("s4" + name), ...(extra && extra.init) });
  const ne = await N.setNetwork({ code: CODE, admin: sK.id });
  if (!ne.ok) throw new Error("setNetwork: " + JSON.stringify(ne));
  return N;
}

// ═══ F · die Liste selbst: wer unterschreibt, was gilt ═══
let liste1 = null;
{
  const K = await imNetz("K", "k", relay());
  const r = await K.blockId(sX.id);
  liste1 = r.zettel;
  t("F1 der Netzadmin sperrt eine Kennung: signierte Liste mit genau ihr",
    r.ok && liste1 && liste1.kind === "sbkim-blocklist" && liste1.v === 1 && liste1.admin === sK.id &&
    JSON.stringify(liste1.ids) === JSON.stringify([sX.id]) && liste1.spore && liste1.spore.id === sK.id, JSON.stringify(r).slice(0, 200));
  t("F2 die Unterschrift ist echt (Modul 02 verifyDetached, Schlüssel des Netzadmins)",
    !!liste1 && await Sp.verifyDetached(ohneSig(liste1), liste1.sig, sK.publicKey) === true);
  const st = await K.currentBlocklist();
  t("F3 eigener Stand: gültig, eine Kennung, isBlocked", st.stand === "gueltig" && st.ids.length === 1 && K.isBlocked(sX.id) && !K.isBlocked(sY.id),
    JSON.stringify({ stand: st.stand, n: st.ids.length }));
  const r2 = await K.blockId(sY.id);
  t("F4 nur nach oben: die zweite Sperre behält die erste", r2.ok && r2.zettel.ids.length === 2 && r2.zettel.ids.includes(sX.id) && r2.zettel.ts > liste1.ts,
    JSON.stringify(r2.zettel && r2.zettel.ids));
  const selbst = await K.createBlocklist([sK.id]);
  const doppelt = await K.createBlocklist([sX.id, sX.id]);
  const zuViel = await K.createBlocklist(Array.from({ length: 257 }, (_, i) => "kennung-" + String(i).padStart(10, "0")));
  const unsinn = await K.createBlocklist(["<b>x</b>"]);
  t("F5 ungültige Listen werden nicht unterschrieben (Netzadmin selbst, Doppelte, > 256, Unsinn)",
    !selbst.ok && !doppelt.ok && !zuViel.ok && !unsinn.ok, JSON.stringify([selbst.ok, doppelt.ok, zuViel.ok, unsinn.ok]));
  t("F6 _meta nennt Stand und Deckel", K._meta.blockMax === 256 && K._meta.blocklist.stand === "gueltig" && K._meta.blocklist.count === 2 && K._meta.blocklist.admin === sK.id,
    JSON.stringify(K._meta.blocklist));
}
{
  const A = await imNetz("A", "y", relay());
  const r = await A.blockId(sX.id);
  t("F7 wer nicht Netzadmin ist, kann nicht sperren", !r.ok && /nur der Netzadmin/.test(r.reason || ""), JSON.stringify(r));
  // eine Liste, die Yannick (nicht Netzadmin) unterschreibt und als Klaus' ausgibt
  const falsch1 = { kind: "sbkim-blocklist", v: 1, admin: sK.id, ts: Math.floor(Date.now() / 1000), ids: [sB.id], spore: sY };
  falsch1.sig = await Sp.signDetached(falsch1, "y");
  const falsch2 = { kind: "sbkim-blocklist", v: 1, admin: sY.id, ts: Math.floor(Date.now() / 1000), ids: [sB.id], spore: sY };
  falsch2.sig = await Sp.signDetached(falsch2, "y");
  const geaendert = { ...liste1, ids: [sB.id] };
  const zukunft = { kind: "sbkim-blocklist", v: 1, admin: sK.id, ts: Math.floor(Date.now() / 1000) + 3600, ids: [sB.id], spore: sK };
  zukunft.sig = await Sp.signDetached(zukunft, "k");
  const a1 = await A.addBlocklist(falsch1), a2 = await A.addBlocklist(falsch2), a3 = await A.addBlocklist(geaendert), a4 = await A.addBlocklist(zukunft);
  t("F8 fremde Unterschrift unter Klaus' Namen gilt nicht", !a1.ok, JSON.stringify(a1));
  t("F9 eine Liste von jemandem, der nicht Netzadmin ist, gilt nicht", !a2.ok, JSON.stringify(a2));
  t("F10 nach dem Unterschreiben geänderte Kennungen gelten nicht", !a3.ok, JSON.stringify(a3));
  t("F11 eine Liste aus der Zukunft gilt nicht", !a4.ok, JSON.stringify(a4));
  t("F12 nach all dem ist bei A niemand gesperrt", !A.isBlocked(sB.id) && A._meta.blocklist.stand !== "gueltig", JSON.stringify(A._meta.blocklist));
  const ok1 = await A.addBlocklist(liste1);
  t("F13 Klaus' echte Liste wird übernommen", ok1.ok && A.isBlocked(sX.id), JSON.stringify(ok1));
}
{
  // Neuer schlägt älter, älter verdrängt nicht.
  const K = await imNetz("K2", "k", relay(), { suffix: "s4k2" });
  const alt = (await K.blockId(sX.id)).zettel;
  const neu = (await K.createBlocklist([sY.id])).zettel;   // Lösen: neue, andere Liste
  const L = await imNetz("L0", "l", relay());
  await L.addBlocklist(neu);
  const r = await L.addBlocklist(alt);
  t("F14 eine ältere Liste verdrängt die neuere nicht (Lösen bleibt gelöst)", r.ok && r.newer === false && L.isBlocked(sY.id) && !L.isBlocked(sX.id),
    JSON.stringify({ r, x: L.isBlocked(sX.id), y: L.isBlocked(sY.id) }));
}
{
  // Offenes Mycel: nur Sage-Protokol zählt.
  const O = knoten("O");
  await O.init({ nodeName: "Offen", relayClient: relay(), spore: gesicht("l"), dbSuffix: "s4offen" });
  const r = await O.addBlocklist(liste1);
  t("F15 offenes Mycel: Klaus' Netz-Liste gilt dort nicht (Netzadmin ist Sage-Protokol)", !r.ok && O.currentNetAdmin() === SAGE && !O.isBlocked(sX.id), JSON.stringify(r));
  const b = await O.blockId(sX.id);
  t("F16 offenes Mycel: ein anderer Knoten kann nicht sperren", !b.ok, JSON.stringify(b));
}

// ═══ D · im Raum: die Liste reist mit, gesperrte Karten fallen heraus ═══
{
  const R = relay();
  const K = await imNetz("DK", "k", R);
  await K.blockId(sX.id);
  const X = await imNetz("DX", "x", R), Y = await imNetz("DY", "y", R);
  await X.announce(); await Y.announce(); await K.announce();
  const lsL = speicher();
  const L = await imNetz("DL", "l", R, { ls: lsL, suffix: "s4dl" });
  t("D0 Leser kennt vorher keine Liste", (await L.currentBlocklist()).stand === "keine");
  const r = await L.discover({ listenMs: 400, checkMeaning: false });
  const ids = r.cards.map(c => c.nodeId);
  t("D1 die gesperrte Karte fällt heraus, die anderen bleiben", r.ok && !ids.includes(sX.id) && ids.includes(sY.id) && ids.includes(sK.id), JSON.stringify(ids));
  t("D2 discover() nennt die Zahl (gesperrt: 1)", r.gesperrt === 1 && L._meta.kartenGesperrt === 1, "gesperrt=" + r.gesperrt);
  t("D3 die Liste kam über Klaus' Karte und wurde übernommen", L.isBlocked(sX.id) && L._meta.blocklist.stand === "gueltig");
  // Gedächtnis: ein neuer Lauf derselben App (gleicher Speicher), Klaus nicht im Raum.
  const R2 = relay();
  const X2 = await imNetz("DX2", "x", R2);
  await X2.announce();
  const L2 = await imNetz("DL2", "l", R2, { ls: lsL, suffix: "s4dl" });
  const r2 = await L2.discover({ listenMs: 400, checkMeaning: false });
  t("D4 die Liste bleibt im Speicher (neu geprüft) und wirkt ohne den Netzadmin im Raum", r2.ok && !r2.cards.some(c => c.nodeId === sX.id) && r2.gesperrt === 1,
    JSON.stringify(r2.cards.map(c => c.nodeId)));
  // Gefälschte Liste im Speicher (Geschwister-App auf geteilter Adresse).
  const lsF = speicher();
  const sch = "sbkim_sperre_s4df";
  lsF.setItem(sch, JSON.stringify({ [sK.id]: { ...liste1, ids: [sY.id] } }));
  const F = await imNetz("DF", "l", R2, { ls: lsF, suffix: "s4df" });
  t("D5 eine veränderte Liste im Speicher wird beim Lesen verworfen", (await F.currentBlocklist()).stand !== "gueltig" && !F.isBlocked(sY.id));
  // Weitertragen: L (kennt die Liste) meldet sich an, ein neuer Leser lernt sie von L.
  const R3 = relay();
  const L3 = await imNetz("DL3", "l", R3, { ls: lsL, suffix: "s4dl" });
  await L3.announce();
  const X3 = await imNetz("DX3", "x", R3); await X3.announce();
  const N = await imNetz("DN", "b", R3);
  const r3 = await N.discover({ listenMs: 400, checkMeaning: false });
  t("D6 jeder Knoten mit gültiger Liste trägt sie weiter", N.isBlocked(sX.id) && !r3.cards.some(c => c.nodeId === sX.id), JSON.stringify(r3.cards.map(c => c.nodeId)));
}
{
  // Bürgen: eine gesperrte Kennung zählt als aufgefallen. Seit S5b (Klaus
  // 2026-10-16) haftet der Bürge nur für diese eine: seine übrigen gelten weiter.
  const R = relay();
  const K = await imNetz("VK", "k", R);
  const sperr = (await K.blockId(sX.id)).zettel;
  const B = await imNetz("VB", "b", R);
  const vX = (await B.createVouch(sX.id)).zettel, vY = (await B.createVouch(sY.id)).zettel;
  const L = await imNetz("VL", "l", R);
  L.saveVouchContacts([{ nodeId: sB.id, name: "Bert" }]);
  const karte = (s) => ({ nodeId: s.id, nodeName: s.nodeName, spore: s });
  const vorher = await L.vouchTrust([karte(sX), karte(sY)], { vouches: [vX, vY] });
  await L.addBlocklist(sperr);
  const nachher = await L.vouchTrust([karte(sX), karte(sY)], { vouches: [vX, vY] });
  const st = (l) => l.map(c => c.vouch.status + (c.vouch.reason ? ":" + c.vouch.reason : "")).join(",");
  t("D7 eine gesperrte Kennung ist nie verbürgt; die übrigen Bürgschaften ihres Bürgen gelten weiter (S5b)",
    st(vorher) === "verbuergt,verbuergt" && st(nachher) === "unverbuergt:aufgefallen,verbuergt", JSON.stringify([st(vorher), st(nachher)]));
}

// ═══ A · Fragen und Antworten ═══
{
  const R = relay();
  const K = await imNetz("AK", "k", R);
  const sperr = (await K.blockId(sX.id)).zettel;
  const B = await imNetz("AB", "b", R, { init: { match: matchMit("Treffer") } });
  await B.addBlocklist(sperr);
  await B.enableAnswering(); await warte(50);
  const X = await imNetz("AX", "x", R), Y = await imNetz("AY", "y", R);
  const rx = await X.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 1200 });
  const ry = await Y.askNode({ nodeId: sB.id }, "Brett", { timeoutMs: 3000 });
  t("A1 die Frage einer gesperrten Kennung wird nicht beantwortet", !rx.ok && B._meta.fragenGesperrt >= 1, JSON.stringify({ ok: rx.ok, g: B._meta.fragenGesperrt }));
  t("A2 die Frage einer anderen Kennung wird beantwortet", ry.ok && ry.results && ry.results[0] && ry.results[0].label === "Treffer", JSON.stringify(ry).slice(0, 160));
}
{
  const R = relay();
  const K = await imNetz("RK", "k", R);
  const sperr = (await K.blockId(sX.id)).zettel;
  const X = await imNetz("RX", "x", R, { init: { match: matchMit("vom Gesperrten") } });
  await X.enableAnswering(); await warte(50);
  const L = await imNetz("RL", "l", R);
  await L.addBlocklist(sperr);
  const r = await L.askNode({ nodeId: sX.id }, "Brett", { timeoutMs: 1200 });
  t("A3 die Antwort einer gesperrten Kennung wird verworfen", !r.ok && L._meta.antwortGesperrt >= 1, JSON.stringify({ ok: r.ok, g: L._meta.antwortGesperrt }));
  const f = await L.fetchAnswers([r.qid], { waitMs: 400 });
  t("A4 … auch beim Nachlesen im Briefkasten", f.ok && f.answers.length === 0 && L._meta.antwortGesperrt >= 2, JSON.stringify({ n: f.answers.length, g: L._meta.antwortGesperrt }));
}

// ═══ U · im echten Browser: Kasten und Knopf, nur der Netzadmin sieht „⛔ Sperren“ ═══
{
  let chromium = null;
  try { ({ chromium } = await import("playwright-core")); } catch { chromium = null; }
  if (!chromium) { console.log("⊘ nicht lauffähig: playwright-core fehlt (U übersprungen)"); }
  else {
    const http = await import("node:http");
    const seite = (lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>
<script src="/src/modules/23_rendezvous.js"></script><script src="/src/modules/23_rendezvous_ui.js"></script></body></html>`;
    const srv = http.createServer((q, r) => {
      const m = /^\/s4-(de|en)\.html/.exec(q.url);
      if (m) { r.writeHead(200, { "content-type": "text/html" }); r.end(seite(m[1])); return; }
      try { const d = readFileSync(resolve(root, "." + q.url.split("?")[0])); r.writeHead(200, { "content-type": "text/javascript" }); r.end(d); }
      catch { r.writeHead(404); r.end(); }
    }).listen(0);
    const port = srv.address().port;
    const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
    async function lauf(lang, admin) {
      const pg = await browser.newPage({ viewport: { width: 360, height: 780 } });
      const fehler = [];
      pg.on("pageerror", (e) => fehler.push(String(e)));
      pg.on("dialog", (d) => d.accept());
      await pg.goto(`http://127.0.0.1:${port}/s4-${lang}.html`);
      await pg.evaluate(async (admin) => {
        window.SbkimSpore = { async getOwnSpore() { return { id: admin ? "BgjXhSApoOrJD6zFJ4uuEpAliGWPokpKn7UMWRm94PA" : "fremd-0000000000000000" }; } };
        await window.SbkimRendezvousUI.init({ nodeName: "Prüfknoten" });
        const R = window.SbkimRendezvous;
        R.configure({ dbSuffix: "s4ui" });
        window.__ruf = [];
        R.blockId = async (id) => { window.__ruf.push("block:" + id); return { ok: true, zettel: { ids: [id] } }; };
        R.currentBlocklist = async () => ({ stand: "gueltig", admin: "BgjXh", ts: 1760000000, ids: ["a", "b"], zettel: { kind: "sbkim-blocklist" } });
        R.discover = async () => ({ ok: true, cardsVerified: true, rejected: 0, gesperrt: 0, cards: [
          { nodeId: "id-stoerer-000000000000", nodeName: "<img src=x onerror=alert(1)>Störer", spore: { id: "id-stoerer-000000000000" }, ts: 1, ageSec: 5 }] });
        window.SbkimRendezvousUI.show();
      }, admin);
      await pg.locator("button", { hasText: /Wer ist im Raum|Who is in the room/ }).first().click();
      await pg.waitForSelector("[data-sbkim-sperren-knopf]", { state: "attached", timeout: 8000 });
      await pg.waitForTimeout(200);
      const r = {};
      r.sichtbar = await pg.evaluate(() => { const b = document.querySelector("[data-sbkim-sperren-knopf]"); return !!b && b.getClientRects().length > 0 && b.checkVisibility(); });
      if (r.sichtbar) {
        await pg.click("[data-sbkim-sperren-knopf]");
        await pg.waitForSelector("[data-sbkim-sperren-meldung]", { timeout: 4000 }).catch(() => {});
      }
      r.ruf = await pg.evaluate(() => window.__ruf.slice());
      r.meldung = await pg.evaluate(() => { const m = document.querySelector("[data-sbkim-sperren-meldung]"); return m ? m.textContent : null; });
      await pg.click("[data-sbkim-sperre-box] summary");
      await pg.waitForFunction(() => (document.querySelector("[data-sbkim-sperre-box] [data-sbkim-sperre-stand]") || null), null, { timeout: 4000 }).catch(() => {});
      r.stand = await pg.evaluate(() => { const e = document.querySelector("[data-sbkim-sperre-stand]"); return e ? e.getAttribute("data-sbkim-sperre-stand") + "|" + e.getAttribute("data-sbkim-sperre-zahl") + "|" + e.textContent : null; });
      r.boxText = await pg.evaluate(() => document.querySelector("[data-sbkim-sperre-box]").textContent);
      r.img = await pg.evaluate(() => document.querySelectorAll("img[src=x]").length);
      r.sw = await pg.evaluate(() => document.documentElement.scrollWidth);
      await pg.close();
      return { ...r, fehler };
    }
    const deA = await lauf("de", true), deF = await lauf("de", false), enA = await lauf("en", true);
    await browser.close(); srv.close();
    t("U1 der Netzadmin sieht „⛔ Sperren“, und ein Klick sperrt genau diese Kennung",
      deA.sichtbar && JSON.stringify(deA.ruf) === JSON.stringify(["block:id-stoerer-000000000000"]) && /Gesperrt/.test(deA.meldung || ""), JSON.stringify(deA));
    t("U2 wer nicht Netzadmin ist, sieht den Knopf nicht", !deF.sichtbar && deF.ruf.length === 0, JSON.stringify({ s: deF.sichtbar, ruf: deF.ruf }));
    t("U3 der Kasten nennt Stand und Zahl", /^gueltig\|2\|Gesperrt: 2/.test(deA.stand || ""), deA.stand);
    t("U4 englische Oberfläche: kein deutscher Satz im Kasten", /Block list/.test(enA.boxText) && !/Sperr|Gesperrt|Kennung/.test(enA.boxText) && /Blocked/.test(enA.meldung || ""),
      JSON.stringify({ box: enA.boxText.slice(0, 200), m: enA.meldung }));
    t("U5 fremder Name nur als Text, keine Seitenfehler, kein Überlauf bei 360 px",
      deA.img === 0 && enA.img === 0 && !deA.fehler.length && !deF.fehler.length && !enA.fehler.length && deA.sw <= 360,
      JSON.stringify({ img: deA.img, f: deA.fehler.concat(deF.fehler, enA.fehler), sw: deA.sw }));
  }
}

console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exitCode = rot ? 1 : 0;
