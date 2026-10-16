// Smoke-Test S5b Teil 2 „Die Empfehlung kommt von selbst an" (2026-10-16,
// Klaus: „Von selbst über den Raum"; INTERFACES § Modul 23 S5b Teil 2).
// Echtes Modul 01/02/23, echt signierte Sporen; nur das Relais ist gestellt.
// Gegenprobe: tests/gegenprobe_s5b_empfehlung_ankommt.mjs.
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


const TAG = 24 * 3600;
const sK = await spore("ek", { nodeName: "Klaus" });     // Netzadmin des eigenen Netzes
const sM = await spore("em", { nodeName: "Markt" });
const sA = await spore("ea", { nodeName: "AppA" });
const sX = await spore("ex", { nodeName: "Fremd" });     // unbekannter Aussteller
const sL = await spore("el", { nodeName: "Leser" });
async function imNetz(name, slot, R, extra) {
  const N = knoten(name, extra && extra.ls);
  await N.init({ nodeName: name, relayClient: R, spore: gesicht(slot), dbSuffix: (extra && extra.suffix) || ("s5e" + name) });
  const ne = await N.setNetwork({ code: CODE, admin: sK.id });
  if (!ne.ok) throw new Error("setNetwork: " + JSON.stringify(ne));
  return N;
}
const getragen = (N, ls, suffix) => JSON.parse(ls.getItem("sbkim_buergen_" + suffix) || "{}");

// ═══ E · die Empfehlung kommt von selbst an ═══
{
  const R = relay();
  const lsK = speicher(), lsM = speicher(), lsA = speicher(), lsX = speicher(), lsL = speicher();
  const K = await imNetz("EK", "ek", R, { ls: lsK, suffix: "ek" });
  const M = await imNetz("EM", "em", R, { ls: lsM, suffix: "em" });
  const A = await imNetz("EA", "ea", R, { ls: lsA, suffix: "ea" });
  const X = await imNetz("EX", "ex", R, { ls: lsX, suffix: "ex" });
  const km = await K.createVouch(sM.id);
  t("E1 eine neue Empfehlung kommt in den Ausgestellt-Vorrat",
    km.ok && (getragen(K, lsK, "ek").issued || []).some(z => z.sig === km.zettel.sig), JSON.stringify(getragen(K, lsK, "ek")).slice(0, 160));
  await K.announce();
  // Im eigenen Netz ist die Karte verschlüsselt (netPacke); lesbar ist sie im offenen Mycel.
  const R0 = relay();
  const K0 = knoten("EK0", speicher());
  await K0.init({ nodeName: "Klaus0", relayClient: R0, spore: gesicht("ek"), dbSuffix: "ek0" });
  const k0 = await K0.createVouch(sM.id);
  await K0.announce();
  const karte0 = (() => { for (const e of R0.st.slice().reverse()) { try { const c = JSON.parse(e.content); if (c.nodeId === sK.id) return c; } catch {} } return {}; })();
  t("E2 die Karte des Ausstellers trägt sie im Feld `issued`", Array.isArray(karte0.issued) && karte0.issued.some(z => z.sig === k0.zettel.sig), Object.keys(karte0).join(","));
  const r1 = await M.discover({ listenMs: 400, checkMeaning: false });
  const mc = getragen(M, lsM, "em").carried || [];
  t("E3 der Empfohlene holt sie beim „Wer ist im Raum?“ von selbst ab (Aussteller = Netzadmin)",
    mc.some(z => z.sig === km.zettel.sig) && r1.picked === 1 && M._meta.empfehlungenAbgeholt === 1, JSON.stringify({ picked: r1.picked, n: mc.length }));
  const r1b = await M.discover({ listenMs: 400, checkMeaning: false });
  t("E4 ein zweiter Lauf holt nichts doppelt", r1b.picked === 0 && (getragen(M, lsM, "em").carried || []).length === 1, String(r1b.picked));
  // Kette: der Markt (vom Netzadmin empfohlen) empfiehlt App A
  const ma = await M.createVouch(sA.id);
  await M.announce();
  const xa = await X.createVouch(sA.id);                       // ein Unbekannter empfiehlt A ebenfalls
  await X.announce();
  const r2 = await A.discover({ listenMs: 400, checkMeaning: false });
  const ac = getragen(A, lsA, "ea").carried || [];
  t("E5 die App holt die Empfehlung des Marktes ab — der Markt zählt bei ihr (vom Netzadmin empfohlen)",
    ac.some(z => z.sig === ma.zettel.sig), JSON.stringify(ac.map(z => z.voucher)));
  t("E6 die Empfehlung eines Unbekannten wird NICHT von selbst abgeholt (kein Fluten fremder Vorräte)",
    !ac.some(z => z.sig === xa.zettel.sig) && r2.picked === 1, JSON.stringify({ picked: r2.picked }));
  await A.announce();
  const L = await imNetz("EL", "el", R, { ls: lsL, suffix: "el" });
  const r3 = await L.discover({ listenMs: 400, checkMeaning: false });
  const a = r3.cards.find(c => c.nodeId === sA.id);
  t("E7 ein Dritter sieht A als empfohlen (Kette Netzadmin → Markt → App), ohne dass jemand Text kopiert hat",
    a && a.vouch && a.vouch.status === "verbuergt" && a.vouch.by[0] === sK.id, JSON.stringify(a && a.vouch));
  // Widerruf nimmt die Empfehlung aus dem Ausgestellt-Vorrat
  await M.createRevocation(sA.id, "Test");
  t("E8 ein Widerruf nimmt die Empfehlung aus dem Ausgestellt-Vorrat", !(getragen(M, lsM, "em").issued || []).some(z => z.subject === sA.id));
  // Höchstzahl auf der Karte
  for (let i = 0; i < 10; i++) { const q = await spore("eq" + i, { nodeName: "Q" + i }); await K0.createVouch(q.id); }
  await K0.announce();
  const k2 = (() => { for (const e of R0.st.slice().reverse()) { try { const c = JSON.parse(e.content); if (c.nodeId === sK.id) return c; } catch {} } return { issued: [] }; })();
  t("E9 die Karte trägt höchstens 8 ausgestellte Empfehlungen (die neuesten)", k2.issued.length === 8 && K0._meta.issuedPerCardMax === 8 &&
    !k2.issued.some(z => z.sig === k0.zettel.sig), String(k2.issued && k2.issued.length));
  // ohne dbSuffix: nichts gespeichert, die Karte trägt nichts
  const O = knoten("EO", speicher());
  await O.init({ nodeName: "Ohne", relayClient: R0, spore: gesicht("em") });
  const ov = await O.createVouch(sA.id);
  await O.announce();
  const ko = (() => { for (const e of R0.st.slice().reverse()) { try { const c = JSON.parse(e.content); if (c.nodeId === sM.id) return c; } catch {} } return null; })();
  t("E10 ohne dbSuffix: unterschrieben, aber kein Vorrat — die Karte trägt kein `issued` (geteilte Adresse)", ov.ok && ko && !ko.issued, JSON.stringify(ko && Object.keys(ko)));
  // gefälschte Empfehlung „vom Netzadmin" auf der Karte eines Fremden
  const R2 = relay();
  const lsX2 = speicher(), lsA2 = speicher();
  const X2 = await imNetz("EX2", "ex", R2, { ls: lsX2, suffix: "ex2" });
  const A2 = await imNetz("EA2", "ea", R2, { ls: lsA2, suffix: "ea2" });
  const falsch = { kind: "sbkim-vouch", v: 1, voucher: sK.id, subject: sA.id, ts: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 30 * TAG, spore: sK, sig: "A".repeat(86) };
  lsX2.setItem("sbkim_buergen_ex2", JSON.stringify({ v: 1, contacts: [], carried: [], issued: [falsch] }));
  await X2.announce();
  const r4 = await A2.discover({ listenMs: 400, checkMeaning: false });
  t("E11 eine gefälschte Empfehlung „vom Netzadmin“ wird nicht abgeholt (Unterschrift geprüft)",
    r4.picked === 0 && !(getragen(A2, lsA2, "ea2").carried || []).length, JSON.stringify({ picked: r4.picked }));
}

console.log("\n" + gruen + " grün · " + rot + " " + (rot ? "ROT" : "rot"));
process.exitCode = rot ? 1 : 0;
