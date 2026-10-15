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
  t("R10 ohne Frage-Vektor bleibt die Reihenfolge unverändert", rang.map(c => c.nodeName).join(",") === "Anna,Bert");
}

// ═══ T2 · Teil 2: Netzadmin je Netz, Vorrang, Sicherheitsnummer, Weitergeben ═══
const SAGE = "BgjXhSApoOrJD6zFJ4uuEpAliGWPokpKn7UMWRm94PA";
{
  const K = knoten("K3");
  await K.init({ nodeName: "Klaus", spore: gesicht("k"), dbSuffix: "k3" });
  const vKA = (await K.createVouch(sA.id)).zettel;
  const relais = { publish() {}, subscribe() { return () => {}; }, configure() { return { ok: true, relays: ["wss://x.example"] }; } };
  // öffentliches Netz
  const P = knoten("Offen");
  await P.init({ nodeName: "Offen", spore: gesicht(null), dbSuffix: "p" });
  t("N1 öffentliches Netz: Netzadmin ist Sage-Protokol", P.currentNetAdmin() === SAGE && P._meta.netAdmin === SAGE, P.currentNetAdmin());
  const pS = await P.vouchTrust([{ nodeId: SAGE, nodeName: "Sage" }, karte(sA, { vouches: [vKA] })]);
  t("N2 öffentliches Netz: Sage-Protokols Karte steht als Netzadmin da", pS[0].vouch.status === "anker", JSON.stringify(pS[0].vouch));
  t("N3 eine Bürgschaft von Klaus zählt ohne eigenen Kontakt nicht", pS[1].vouch.status === "unverbuergt", JSON.stringify(pS[1].vouch));
  // eigenes Netz mit Netzadmin Klaus
  const E = knoten("Eigen");
  await E.init({ nodeName: "Eigen", spore: gesicht(null), dbSuffix: "e" });
  const ne = await E.setNetwork({ code: "ABCDEFGHJKLMNP", admin: sK.id });
  const eS = await E.vouchTrust([{ nodeId: SAGE, nodeName: "Sage" }, karte(sA, { vouches: [vKA] })]);
  t("N4 eigenes Netz: Netzadmin aus der Einstellung", ne.ok && E.currentNetAdmin() === sK.id, JSON.stringify(ne));
  t("N5 eigenes Netz: Sage-Protokol ist dort KEIN Netzadmin", eS[0].vouch.status === "unverbuergt", JSON.stringify(eS[0].vouch));
  t("N6 eigenes Netz: Klaus' Bürgschaft zählt über den Netzadmin", eS[1].vouch.status === "verbuergt" && eS[1].vouch.by[0] === sK.id, JSON.stringify(eS[1].vouch));
  await E.setNetwork({ code: "ABCDEFGHJKLMNP" });
  t("N7 eigenes Netz ohne Netzadmin: keiner", E.currentNetAdmin() === null);
  await E.setNetwork({ code: "ABCDEFGHJKLMNP", admin: "zu-kurz" });
  t("N8 eine ungültige Kennung wird kein Netzadmin", E.currentNetAdmin() === null);
  const c1 = E.checkNetSetting({ relay: "wss://x.example", code: "ABCDEFGHJKLMNP", admin: "<b>x</b>" });
  const c2 = E.checkNetSetting({ relay: "wss://x.example", code: "ABCDEFGHJKLMNP", admin: sK.id });
  const c3 = E.checkNetSetting({ relay: "wss://x.example", code: "ABCDEFGHJKLMNP" });
  t("N9 Netz-Einstellung: ungültige Netzadmin-Kennung macht sie ungültig, gültige reist mit, fehlende fehlt",
    c1.ok === false && c2.ok && c2.setting.admin === sK.id && c3.ok && !("admin" in c3.setting), JSON.stringify([c1, c2.setting && c2.setting.admin, c3.setting]));
  const A2 = knoten("Anwenden");
  await A2.init({ nodeName: "Anwenden", spore: gesicht(null), relayClient: relais, dbSuffix: "an" });
  const ap = await A2.applyNetwork({ relay: "wss://x.example", code: "ABCDEFGHJKLMNP", admin: sK.id });
  t("N10 applyNetwork übernimmt den Netzadmin", ap.ok && A2.currentNetAdmin() === sK.id, JSON.stringify(ap));
  await A2.applyNetwork(null);
  t("N11 zurück ins öffentliche Netz: wieder Sage-Protokol", A2.currentNetAdmin() === SAGE);
  // Vorrang (Klaus: „verbürgte Karten rücken nach vorne")
  const Q = knoten("Rang");
  await Q.init({ nodeName: "Rang", spore: gesicht(null), match: { relatedness: (a, b) => a[0] * b[0], match: (a, b) => a[0] * b[0] } });
  const kk = (name, fit, st, extra) => ({ nodeId: "id-" + name, nodeName: name, spore: { id: "id-" + name, domainVector: [fit] }, vouch: st ? { status: st } : undefined, ...extra });
  const rg = Q.rankCardsByQuery([kk("gutFremd", 0.9, "unverbuergt"), kk("ohneVouch", 0.95, null), kk("schwachVerbuergt", 0.3, "verbuergt"),
    kk("kontakt", 0.5, "kontakt"), kk("admin", 0.2, "anker"), kk("passtNicht", 0.99, "verbuergt", { meaning: { status: "passt-nicht" } })], [1]);
  t("V1 Verbürgte/Kontakt/Netzadmin vorn, je Gruppe nach Passung; „passt nicht“ bleibt am Ende",
    rg.map(c => c.nodeName).join(",") === "kontakt,schwachVerbuergt,admin,ohneVouch,gutFremd,passtNicht", rg.map(c => c.nodeName).join(","));
  // Sicherheitsnummer
  const A = knoten("A3");
  await A.init({ nodeName: "Anna", spore: gesicht("a"), dbSuffix: "a3" });
  const nKA = await K.vouchSafetyNumber(sA), nAK = await A.vouchSafetyNumber(sK), nKB = await K.vouchSafetyNumber(sB);
  t("S1 Sicherheitsnummer: beide Seiten sehen dieselbe, 30 Ziffern", nKA.ok && nAK.ok && nKA.number === nAK.number && /^(\d{5} ){5}\d{5}$/.test(nKA.number), JSON.stringify([nKA, nAK]));
  t("S2 eine andere Gegenseite ergibt eine andere Nummer", nKB.ok && nKB.number !== nKA.number);
  const nOwn = await K.vouchSafetyNumber(sK), nOhne = await P.vouchSafetyNumber(sA), nLeer = await K.vouchSafetyNumber({ id: "x" });
  t("S3 eigene Karte, keine Identität, kein Schlüssel → keine Nummer", !nOwn.ok && !nOhne.ok && !nLeer.ok, JSON.stringify([nOwn, nOhne, nLeer]));
  // Weitergeben: neue Bürgschaft zuerst, dazu die eigenen mitgetragenen (Kette lesbar)
  await A.addCarried(vKA);
  const vAB = (await A.createVouch(sB.id)).zettel;
  const weiter = A.vouchPassOn(vAB);
  t("P1 Weitergeben: neue Bürgschaft zuerst, dazu Annas eigene von Klaus", weiter.length === 2 && weiter[0].sig === vAB.sig && weiter[1].sig === vKA.sig,
    JSON.stringify(weiter.map(z => z.voucher.slice(0, 4) + ">" + z.subject.slice(0, 4))));
  const Bn = knoten("B3");
  await Bn.init({ nodeName: "Bert", spore: gesicht("b"), dbSuffix: "b3" });
  for (const z of weiter) await Bn.addCarried(z);
  const Le = knoten("Leser3");
  await Le.init({ nodeName: "Leser", spore: gesicht(null), vouchAnchors: [sK.id], dbSuffix: "l3" });
  const bk = await Le.vouchTrust([karte(sB, { vouches: Bn.vouchPassOn(null) })]);
  t("P2 Berts Karte allein trägt die ganze Kette Klaus → Anna → Bert", bk[0].vouch.status === "verbuergt" && bk[0].vouch.depth === 2, JSON.stringify(bk[0].vouch));
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
  const erwartDe = ["verbuergt|🤝 verbürgt von Anna · kontakt-…", "verbuergt|🤝 verbürgt von fremd-99… (über 1 weiteren Schritt)", "anker|🤝 Netzadmin"];
  t("B1 verbürgte Karten zeigen Bürge und Kennung, unverbürgte nichts (DE)", JSON.stringify(de.b) === JSON.stringify(erwartDe), JSON.stringify(de.b));
  t("B2 englische Oberfläche: kein deutscher Satz", en.b.length === 3 && en.b.every((x) => !/verbürgt|Schritt|Anker|Netzadmin/.test(x)), JSON.stringify(en.b));
  t("B3 fremder Name nur als Text, keine Seitenfehler, kein Überlauf bei 360 px",
    de.img === 0 && en.img === 0 && !de.fehler.length && !en.fehler.length && de.sw <= 360, JSON.stringify({ img: de.img, f: de.fehler, sw: de.sw }));
}

// ═══ U · Teil 2 im echten Browser: Bürgen-Feld, Bürgschaften-Kasten, Netz-Link ═══
{
  const { chromium } = await import("playwright-core");
  const http = await import("node:http");
  const seite = (lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>
<script src="/src/modules/23_rendezvous.js"></script><script src="/src/modules/23_rendezvous_ui.js"></script></body></html>`;
  const srv = http.createServer((q, r) => {
    const m = /^\/u-(de|en)\.html/.exec(q.url);
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
    await pg.goto(`http://127.0.0.1:${port}/u-${lang}.html`);
    await pg.evaluate(async () => {
      await window.SbkimRendezvousUI.init({ nodeName: "Prüfknoten" });
      const R = window.SbkimRendezvous;
      R.configure({ dbSuffix: "uprobe" });
      window.__ruf = [];
      R.vouchSafetyNumber = async (sp) => (sp && sp.publicKey ? { ok: true, number: "12345 67890 11111 22222 33333 44444" } : { ok: false, reason: "x" });
      R.createVouch = async (id) => { window.__ruf.push("vouch:" + id); return { ok: true, zettel: { kind: "sbkim-vouch", subject: id, sig: "neu" } }; };
      R.createRevocation = async (id) => { window.__ruf.push("revoke:" + id); return { ok: true, zettel: { kind: "sbkim-vouch-revoke", subject: id, sig: "w" } }; };
      R.addCarried = async (z) => { window.__ruf.push("carry:" + (z && z.sig)); return (z && z.sig && z.kind) ? { ok: true } : { ok: false, reason: "Zettel ungültig." }; };
      R.discover = async () => ({ ok: true, cardsVerified: true, rejected: 0, cards: [
        { nodeId: "id-bert-0000000000000", nodeName: "<img src=x onerror=alert(1)>Bert", spore: { id: "id-bert", publicKey: { x: "abc" } }, ts: 1, ageSec: 5 }] });
      window.SbkimRendezvousUI.show();
    });
    await pg.locator("button", { hasText: /Wer ist im Raum|Who is in the room/ }).first().click();
    await pg.waitForSelector("[data-sbkim-buergen-knopf]", { timeout: 8000 });
    await pg.click("[data-sbkim-buergen-knopf]");
    await pg.waitForFunction(() => /\d{5}/.test((document.querySelector("[data-sbkim-sas]") || {}).textContent || ""), null, { timeout: 5000 }).catch(() => {});
    const r = {};
    r.sas = await pg.textContent("[data-sbkim-sas]");
    await pg.click("[data-sbkim-buergen-sign]");
    await pg.waitForTimeout(150);
    r.ohneHaken = { ruf: await pg.evaluate(() => window.__ruf.slice()), text: await pg.evaluate(() => getComputedStyle(document.querySelector("[data-sbkim-buergen-text]")).display),
      msg: await pg.textContent("[data-sbkim-buergen-meldung]") };
    await pg.click("[data-sbkim-kontakt-merken]");
    await pg.waitForTimeout(100);
    r.kontaktOhne = await pg.evaluate(() => window.SbkimRendezvous.loadVouchContacts().length);
    await pg.check("[data-sbkim-sas-ok]");
    await pg.click("[data-sbkim-buergen-sign]");
    await pg.waitForFunction(() => (document.querySelector("[data-sbkim-buergen-text]") || {}).value, null, { timeout: 5000 }).catch(() => {});
    r.signText = await pg.evaluate(() => document.querySelector("[data-sbkim-buergen-text]").value);
    await pg.fill("[data-sbkim-kontakt-name]", "<b>Bert</b>");
    await pg.click("[data-sbkim-kontakt-merken]");
    await pg.waitForTimeout(100);
    r.kontakte = await pg.evaluate(() => window.SbkimRendezvous.loadVouchContacts());
    await pg.click("[data-sbkim-widerruf]");
    await pg.waitForTimeout(150);
    r.ruf = await pg.evaluate(() => window.__ruf.slice());
    // Bürgschaften-Kasten
    await pg.click("[data-sbkim-buergen-box] summary");
    await pg.waitForTimeout(100);
    r.admin = await pg.getAttribute("[data-sbkim-buergen-box] [data-sbkim-netzadmin]", "data-sbkim-netzadmin");
    r.adminText = await pg.textContent("[data-sbkim-buergen-box] [data-sbkim-netzadmin]");
    r.kontaktZeilen = await pg.evaluate(() => [...document.querySelectorAll("[data-sbkim-kontakt]")].map((e) => e.textContent));
    await pg.fill("[data-sbkim-buergen-einfuegen]", "kein json");
    await pg.click("[data-sbkim-buergen-uebernehmen]");
    await pg.waitForTimeout(100);
    r.muell = await pg.textContent("[data-sbkim-buergen-box-meldung]");
    await pg.fill("[data-sbkim-buergen-einfuegen]", JSON.stringify([{ kind: "sbkim-vouch", sig: "g1" }, { kaputt: 1 }]));
    await pg.click("[data-sbkim-buergen-uebernehmen]");
    await pg.waitForTimeout(150);
    r.gemischt = await pg.textContent("[data-sbkim-buergen-box-meldung]");
    await pg.click("[data-sbkim-kontakt-weg]");
    await pg.waitForTimeout(100);
    r.nachWeg = await pg.evaluate(() => window.SbkimRendezvous.loadVouchContacts().length);
    // Netz-Link trägt den Netzadmin
    await pg.click("[data-sbkim-netz-box] summary");
    await pg.fill("[data-sbkim-netz-relais]", "wss://x.example");
    await pg.fill("[data-sbkim-netz-code]", "ABCDEFGHJKLMNP");
    await pg.fill("[data-sbkim-netz-admin]", "KlausKennung0000000000");
    await pg.click("[data-sbkim-netz-link]");
    await pg.waitForTimeout(100);
    r.link = await pg.evaluate(() => {
      const v = document.querySelector("[data-sbkim-netz-linkfeld]").value;
      const b = v.split("#sbkim-netz=")[1] || "";
      try { return JSON.parse(atob(b.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b.length + 3) % 4))); } catch (e) { return { fehler: String(e) }; }
    });
    r.feldText = await pg.evaluate(() => document.querySelector("[data-sbkim-buergen-feld]").textContent + " " + document.querySelector("[data-sbkim-buergen-box]").textContent);
    r.img = await pg.evaluate(() => document.querySelectorAll("img[src=x]").length + document.querySelectorAll("[data-sbkim-kontakt] b b").length);
    r.sw = await pg.evaluate(() => document.documentElement.scrollWidth);
    await pg.close();
    return { ...r, fehler };
  }
  const de = await lauf("de"), en = await lauf("en");
  await browser.close(); srv.close();
  t("U1 „🤝 Bürgen“ öffnet das Feld mit der Sicherheitsnummer", /12345 67890/.test(de.sas || ""), de.sas);
  t("U2 ohne Haken wird nicht unterschrieben und kein Kontakt gemerkt",
    de.ohneHaken.ruf.length === 0 && de.ohneHaken.text === "none" && /Haken/.test(de.ohneHaken.msg) && de.kontaktOhne === 0, JSON.stringify([de.ohneHaken, de.kontaktOhne]));
  let sl = null; try { sl = JSON.parse(de.signText); } catch {}
  t("U3 mit Haken: unterschrieben für genau diese Kennung, Text zum Weitergeben", Array.isArray(sl) && sl[0].subject === "id-bert-0000000000000" && de.ruf[0] === "vouch:id-bert-0000000000000", de.signText);
  t("U4 Kontakt mit Kennung gemerkt, der Name als Text", de.kontakte.length === 1 && de.kontakte[0].nodeId === "id-bert-0000000000000" && de.kontakte[0].name === "<b>Bert</b>"
    && de.kontaktZeilen.length === 1 && de.kontaktZeilen[0].includes("<b>Bert</b>"), JSON.stringify([de.kontakte, de.kontaktZeilen]));
  t("U5 widerrufen: Widerruf unterschrieben und in den eigenen Vorrat", de.ruf.includes("revoke:id-bert-0000000000000") && de.ruf.includes("carry:w"), JSON.stringify(de.ruf));
  t("U6 Kasten zeigt den Netzadmin des offenen Mycels", de.admin === SAGE && /Sage-Protokol/.test(de.adminText), JSON.stringify([de.admin, de.adminText]));
  t("U7 Einfügen: Unsinn wird keine Bürgschaft, gemischt wird gezählt", /keine Bürgschaft/.test(de.muell) && /Übernommen: 1 · ungültig: 1/.test(de.gemischt), JSON.stringify([de.muell, de.gemischt]));
  t("U8 Kontakt entfernen", de.nachWeg === 0);
  t("U9 der Netz-Link trägt den Netzadmin", de.link && de.link.a === "KlausKennung0000000000", JSON.stringify(de.link));
  t("U10 fremder Name nur als Text, keine Seitenfehler, kein Überlauf bei 360 px (DE und EN)",
    de.img === 0 && en.img === 0 && !de.fehler.length && !en.fehler.length && de.sw <= 360 && en.sw <= 360, JSON.stringify({ i: [de.img, en.img], f: de.fehler.concat(en.fehler), sw: [de.sw, en.sw] }));
  t("U11 englische Oberfläche: Feld und Kasten ohne deutschen Satz", !/Bürg|Sicherheitsnummer|Kontakt|Netzadmin|Haken|stimmt/.test(en.feldText) && /Safety number|Vouch/.test(en.feldText), en.feldText.slice(0, 200));
}

{
  const siegel = readFileSync(resolve(root, "src/modules/16_siegel.js"), "utf8");
  t("Z1 Siegel-Aspekt S5 steht (DE + EN)", siegel.includes('aspect:      "Knoten können füreinander bürgen (S5)"') && siegel.includes('"Nodes can vouch for each other (S5)"'));
}

console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exitCode = rot ? 1 : 0;
