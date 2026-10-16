// Smoke-Test Modul 23b „Netz-Verwaltung" — S5b Teil 2 (2026-10-16,
// docs/PLAN_MYCEL_SCHICHTEN.md § S5b, INTERFACES § Modul 23b).
//
// Echtes Modul 01/02/23, echt signierte Sporen; nur das Relais und fetch sind
// gestellt. Geprüft wird der Kern (ohne DOM); die Oberfläche prüft
// tests/smoke_23b_netzverwaltung_ui.mjs im echten Browser.
// Gegenprobe: tests/gegenprobe_23b_netzverwaltung.mjs.

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
const m23b = readFileSync(resolve(root, "src/modules/23b_netzverwaltung.js"), "utf8");

let gruen = 0, rot = 0;
function t(name, ok, extra) {
  if (ok) { gruen++; console.log("✓ " + name); }
  else { rot++; console.log("✗ ROT: " + name + (extra ? " — " + String(extra).slice(0, 240) : "")); }
}
function speicher() {
  const m = new Map();
  return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
function gesicht(slot) {
  const g = { async getOwnSpore() { return slot ? Sp.getOwnSpore(slot) : null; }, verifyForeignSpore: Sp.verifyForeignSpore, verifyDetached: Sp.verifyDetached };
  if (slot) g.signDetached = (o) => Sp.signDetached(o, slot);
  return g;
}
const CODE = "ABCDEFGHJKLMNP";
// Ein Knoten = eine Seite: Modul 23 + 23b im selben Fenster, SbkimSpore = eigene Identität.
async function seite(name, slot, extra) {
  const ex = extra || {};
  const c = { console: still, setTimeout, clearTimeout, Date, Math, JSON, Promise, TextEncoder, TextDecoder, crypto: webcrypto, btoa, atob,
    localStorage: ex.ls || speicher(), SbkimSpore: gesicht(slot), fetch: ex.fetch };
  if (ex.suffix !== null) c.SBKIM_DB_SUFFIX = ex.suffix || ("nv" + name.toLowerCase());
  c.globalThis = c; vm.createContext(c);
  vm.runInContext(m23, c, { filename: name + "/23_rendezvous.js" });
  vm.runInContext(m23b, c, { filename: name + "/23b_netzverwaltung.js" });
  const R = c.SbkimRendezvous;
  await R.init({ nodeName: name, spore: gesicht(slot), dbSuffix: ex.suffix === null ? undefined : (ex.suffix || ("nv" + name.toLowerCase())) });
  if (ex.admin) { const ne = await R.setNetwork({ code: CODE, admin: ex.admin }); if (!ne.ok) throw new Error("setNetwork " + JSON.stringify(ne)); }
  return { R, N: c.SbkimNetzVerwaltung, c };
}
async function spore(slot, name) {
  await Sp.getOrCreateIdentity(slot);
  return Sp.generateOwnSpore({ domain: "Test", endpoint: "https://" + slot + ".example/", nodeType: "hybrid", nodeName: name }, slot);
}
const now = () => Math.floor(Date.now() / 1000);
const TAG = 24 * 3600;
const ohneSig = ({ sig, ...x }) => x;

// Rollen: K = Netzadmin des eigenen Netzes, M = Markt, A/B/C = Apps, X = Fremder
const sK = await spore("nk", "Klaus");
const sM = await spore("nm", "Markt");
const sA = await spore("na", "AppA");
const sB = await spore("nb", "AppB");
const sC = await spore("nc", "AppC");
const sX = await spore("nx", "Fremd");

// ═══ R · Rolle: was die Seite darf, hängt an ihrer Identität ═══
{
  const { N } = await seite("RM", "nm", { admin: sK.id });
  const { N: NK } = await seite("RK", "nk", { admin: sK.id });
  const rm = await N.role(), rk = await NK.role();
  t("R1 der Markt ist nicht Netzadmin, Klaus im eigenen Netz schon",
    rm.ownId === sM.id && rm.isAdmin === false && rk.isAdmin === true && rk.admin === sK.id, JSON.stringify([rm, rk]));
}

// ═══ V · Bürgen: ausstellen, ablegen, neu prüfen ═══
{
  const { N, R, c } = await seite("VM", "nm", { admin: sK.id });
  const x = await N.vouch(sA.id);
  const liste = JSON.parse(x.text || "[]");
  t("V1 Bürgen unterschreibt mit der eigenen Identität und gibt den Text zum Weitergeben",
    x.ok && x.zettel.voucher === sM.id && x.zettel.subject === sA.id && liste[0] && liste[0].sig === x.zettel.sig, JSON.stringify(x).slice(0, 200));
  const meine = await N.issued();
  t("V2 die Bürgschaft steht unter „Meine Bürgschaften“ mit Ablauf in 180 Tagen",
    meine.length === 1 && meine[0].subject === sA.id && meine[0].exp - meine[0].ts === 180 * TAG && meine[0].bald === false, JSON.stringify(meine));
  const kurz = await N.vouch(sB.id, { days: 10 });
  const m2 = await N.issued();
  const b = m2.find(z => z.subject === sB.id);
  t("V3 eine Bürgschaft, die in ≤ 30 Tagen abläuft, ist als „läuft bald ab“ markiert", kurz.ok && b && b.bald === true, JSON.stringify(m2));
  await N.vouch(sX.id, { days: 100 });                // jüngster Eintrag, späterer Ablauf
  const m2b = await N.issued();
  t("V4 die bald ablaufende steht zuerst (nach Ablauf sortiert)", m2b[0].subject === sB.id && m2b.length === 3, JSON.stringify(m2b.map(z => z.subject)));
  const ext = await N.extend(sB.id);
  const m3 = await N.issued();
  const b3 = m3.find(z => z.subject === sB.id);
  t("V5 Verlängern unterschreibt neu mit voller Frist; der Hinweis verschwindet", ext.ok && b3 && b3.bald === false && b3.exp - b3.ts === 180 * TAG, JSON.stringify(b3));
  // Die Ablage-Reihenfolge ist nicht verlässlich (Geschwister-App, Handarbeit): umgedreht muss es dasselbe ergeben.
  const ab0 = JSON.parse(c.localStorage.getItem("sbkim_ausgestellt_nvvm"));
  ab0.zettel.reverse(); c.localStorage.setItem("sbkim_ausgestellt_nvvm", JSON.stringify(ab0));
  const b3r = (await N.issued()).find(z => z.subject === sB.id);
  t("V5b auch bei umgedrehter Ablage gilt die neueste Bürgschaft je App", b3r && b3r.bald === false, JSON.stringify(b3r));
  // Untergeschoben: Zettel mit falscher Unterschrift / von einem anderen Bürgen
  const key = "sbkim_ausgestellt_nvvm";
  const ablage = JSON.parse(c.localStorage.getItem(key));
  const falsch = { kind: "sbkim-vouch", v: 1, voucher: sM.id, subject: sC.id, ts: now(), exp: now() + 100 * TAG, spore: sM, sig: "AAAA" };
  const fremdZ = { kind: "sbkim-vouch", v: 1, voucher: sX.id, subject: sC.id, ts: now(), exp: now() + 100 * TAG, spore: sX };
  fremdZ.sig = await Sp.signDetached(ohneSig(fremdZ), "nx");
  ablage.zettel.unshift(falsch, fremdZ);
  c.localStorage.setItem(key, JSON.stringify(ablage));
  const m4 = await N.issued();
  t("V6 ein untergeschobener Zettel ohne gültige Unterschrift zählt nicht", !m4.some(z => z.subject === sC.id && z.zettel.sig === "AAAA"), JSON.stringify(m4.map(z => z.subject)));
  t("V7 ein echt unterschriebener Zettel eines ANDEREN Bürgen zählt nicht als eigene Bürgschaft", !m4.some(z => z.subject === sC.id), JSON.stringify(m4.map(z => z.subject)));
  // Eigene kurze Bürgschaft für C + eine NEUERE, längere vom Netzadmin K für C in der Ablage:
  // angezeigt wird der eigene Ablauf, nicht der fremde.
  await N.vouch(sC.id, { days: 5 });
  const kc = { kind: "sbkim-vouch", v: 1, voucher: sK.id, subject: sC.id, ts: now() + 5, exp: now() + 170 * TAG, spore: sK };
  kc.sig = await Sp.signDetached(ohneSig(kc), "nk");
  const ab1 = JSON.parse(c.localStorage.getItem(key)); ab1.zettel.unshift(kc); c.localStorage.setItem(key, JSON.stringify(ab1));
  const c5 = (await N.issued()).find(z => z.subject === sC.id);
  t("V7b neben einer fremden Bürgschaft für dieselbe App zeigt „Meine Bürgschaften“ den eigenen Ablauf", c5 && c5.bald === true && c5.zettel.voucher === sM.id, JSON.stringify(c5 && c5.zettel.voucher));
  const bad = await N.vouch("kurz");
  t("V8 eine ungültige Kennung wird nicht unterschrieben", !bad.ok);
  const selbst = await N.vouch(sM.id);
  t("V9 für sich selbst bürgt man nicht", !selbst.ok);
  const { N: N0 } = await seite("V0", "nm", { suffix: null });
  const y = await N0.vouch(sA.id);
  t("V10 ohne dbSuffix wird unterschrieben, aber nicht abgelegt (geteilte Adresse)", y.ok && y.stored === false && (await N0.issued()).length === 0, JSON.stringify(y.stored));
}

// ═══ W · Widerrufen: nur mit Grund, die eigene Karte trägt ihn mit ═══
{
  const { N, R, c } = await seite("WM", "nm", { admin: sK.id });
  await N.vouch(sA.id);
  const ohne = await N.revoke(sA.id, "  ");
  t("W1 ohne Grund wird nicht widerrufen", !ohne.ok && (await N.issued()).length === 1, JSON.stringify(ohne));
  const mit = await N.revoke(sA.id, "Fehlerhafte Rezepte");
  const wl = await N.revocations();                   // VOR issued(): das liest den Vorrat und legt ihn als „gesehen“ ab
  t("W2 mit Grund: widerrufen, die Bürgschaft fällt aus „Meine Bürgschaften“", mit.ok && (await N.issued()).length === 0);
  t("W3 der Widerruf steht in der Widerrufsliste mit Grund, Datum und „eigener“",
    wl.length === 1 && wl[0].reason === "Fehlerhafte Rezepte" && wl[0].eigen === true && wl[0].subject === sA.id && typeof wl[0].ts === "number", JSON.stringify(wl));
  const vorrat = JSON.parse(c.localStorage.getItem("sbkim_buergen_nvwm") || "{}");
  t("W4 die eigene Karte trägt den Widerruf mit (Modul 23 Vorrat, addCarried)",
    Array.isArray(vorrat.carried) && vorrat.carried.some(z => z.kind === "sbkim-vouch-revoke" && z.subject === sA.id && z.reason === "Fehlerhafte Rezepte"), JSON.stringify(vorrat).slice(0, 200));
  const zw = await N.rows([{ label: "App A", nodeId: sA.id }], []);
  t("W6 nach dem Widerruf steht die App in Liste (a) als „von mir widerrufen“ mit Grund",
    zw[0].status === "widerrufen-eigen" && zw[0].reason === "Fehlerhafte Rezepte", JSON.stringify(zw));
  const zurueck = await N.unrevoke(sA.id);
  const zw2 = await N.rows([{ label: "App A", nodeId: sA.id }], []);
  t("W7 Widerruf zurücknehmen = neu bürgen: danach wieder „verbürgt von mir“ (neuere Bürgschaft schlägt den Widerruf)",
    zurueck.ok && zurueck.zettel.ts > mit.zettel.ts && zw2[0].status === "verbuergt-eigen" && (await N.issued()).some(b => b.subject === sA.id), JSON.stringify(zw2));
  // Gesehene Widerrufe (Modul 23 Speicher) erscheinen ebenfalls, je Unterschrift einmal.
  const { N: NL, R: RL } = await seite("WL", "nb", { admin: sK.id });
  await RL.vouchTrust([{ nodeId: sA.id, vouches: [], revocations: [mit.zettel] }]);
  const wl2 = await NL.revocations();
  t("W5 ein gesehener Widerruf eines anderen steht in der Liste, nicht als „eigener“",
    wl2.length === 1 && wl2[0].eigen === false && wl2[0].voucher === sM.id, JSON.stringify(wl2));
}
// ═══ Z · Liste (a): Einträge + Raum → Zeilen mit Status ═══
{
  const { N } = await seite("ZM", "nm", { admin: sK.id });
  await N.vouch(sA.id);
  const kb = { kind: "sbkim-vouch", v: 1, voucher: sK.id, subject: sB.id, ts: now(), exp: now() + 100 * TAG, spore: sK };
  kb.sig = await Sp.signDetached(ohneSig(kb), "nk");
  const raum = [
    { nodeId: sB.id, nodeName: "AppB", vouch: { status: "verbuergt", by: [sK.id], depth: 1 } },
    { nodeId: sX.id, nodeName: "Fremd", vouch: { status: "unverbuergt", by: [] } },
  ];
  const z = await N.rows([{ label: "App A", nodeId: sA.id }, { label: "Ohne", nodeId: "" }, { label: "Klaus", nodeId: sK.id }], raum);
  const st = Object.fromEntries(z.map(r => [r.label || r.nodeId, r.status]));
  t("Z1 ein Eintrag, für den ich bürge: „verbürgt von mir“ mit Ablaufdatum",
    st["App A"] === "verbuergt-eigen" && z.find(r => r.label === "App A").exp > now(), JSON.stringify(z));
  t("Z2 ein Eintrag ohne Kennung bleibt sichtbar als „keine Kennung hinterlegt“", st["Ohne"] === "ohne-kennung", JSON.stringify(st));
  t("Z3 der Netzadmin ist als Netzadmin markiert", st["Klaus"] === "netzadmin", JSON.stringify(st));
  const b = z.find(r => r.nodeId === sB.id), x = z.find(r => r.nodeId === sX.id);
  t("Z4 wer im Raum ist, kommt dazu: verbürgt von … (Kette aus dem Raum) bzw. unverbürgt",
    b && b.status === "verbuergt" && b.by[0] === sK.id && b.imRaum && x && x.status === "unverbuergt" && x.imRaum, JSON.stringify([b, x]));
  t("Z5 ein Eintrag, der nicht im Raum ist, ist als „nicht im Raum“ markiert", z.find(r => r.label === "App A").imRaum === false);
  const z2 = await N.rows([{ label: "doppelt", nodeId: sA.id }, { label: "nochmal", nodeId: sA.id }], []);
  t("Z6 dieselbe Kennung erscheint nur einmal", z2.filter(r => r.nodeId === sA.id).length === 1, JSON.stringify(z2));
}

// ═══ S · Sperren: nur der Netzadmin; widerruft zuerst, bricht bei Fehler ab ═══
{
  const { N: NM } = await seite("SM", "nm", { admin: sK.id });
  await NM.vouch(sA.id);
  const r1 = await NM.block(sA.id, "Grund");
  t("S1 wer nicht Netzadmin ist, kann nicht sperren — und widerruft dabei nichts",
    !r1.ok && /Netzadmin/.test(r1.reason || "") && (await NM.issued()).length === 1 && (await NM.revocations()).length === 0, JSON.stringify(r1));
  const { N: NK, R: RK } = await seite("SK", "nk", { admin: sK.id });
  await NK.vouch(sC.id);
  const r2 = await NK.block(sC.id, "");
  t("S2 Sperren einer Kennung, für die ich bürge, ohne Grund: Widerruf schlägt fehl → nicht gesperrt",
    !r2.ok && /Widerruf/.test(r2.reason || "") && !RK.isBlocked(sC.id) && (await NK.issued()).length === 1, JSON.stringify(r2));
  const r3 = await NK.block(sC.id, "Schadcode gemeldet");
  const wl = await NK.revocations();
  t("S3 mit Grund: erst widerrufen, dann gesperrt",
    r3.ok && r3.revoked && r3.revoked.reason === "Schadcode gemeldet" && RK.isBlocked(sC.id) && (await NK.issued()).length === 0 &&
    wl.some(w => w.subject === sC.id), JSON.stringify(r3).slice(0, 200));
  const z = await NK.rows([{ label: "C", nodeId: sC.id }], []);
  t("S4 die gesperrte Kennung steht in Liste (a) als „gesperrt“ und in der Sperrliste", z[0].status === "gesperrt" && (await NK.blocklist()).ids.includes(sC.id), JSON.stringify(z));
  const r4 = await NK.block(sX.id, "");
  t("S5 eine Kennung ohne eigene Bürgschaft wird ohne Widerruf gesperrt", r4.ok && !r4.revoked && RK.isBlocked(sX.id), JSON.stringify(r4).slice(0, 160));
  const r5 = await NK.unblock(sC.id);
  t("S6 Lösen unterschreibt eine kürzere Liste; die übrigen bleiben gesperrt",
    r5.ok && !RK.isBlocked(sC.id) && RK.isBlocked(sX.id), JSON.stringify(r5).slice(0, 160));
  const r6 = await NM.unblock(sX.id);
  t("S7 der Markt kann nicht lösen", !r6.ok, JSON.stringify(r6).slice(0, 160));
}

// ═══ F · Freigabe: Spore prüfen (Unterschrift, Kennung passt) ═══
{
  let abgerufen = 0;
  const fetch = async (url) => { abgerufen++; return { ok: true, status: 200, async text() { return JSON.stringify(url.includes("a.example") ? sA : sB); } }; };
  const { N } = await seite("FM", "nm", { admin: sK.id, fetch });
  const f1 = await N.checkSpore(sA, sA.id);
  t("F1 echte Spore mit passender Kennung: gültig", f1.ok && f1.id === sA.id, JSON.stringify(f1));
  const f2 = await N.checkSpore(sA, sB.id);
  t("F2 echte Spore, aber andere Kennung als der Eintrag: abgelehnt", !f2.ok && f2.status === "andere-kennung", JSON.stringify(f2));
  const f3 = await N.checkSpore({ ...sA, nodeName: "Gefälscht" }, sA.id);
  t("F3 veränderte Spore: Unterschrift ungültig", !f3.ok && f3.status === "falsch", JSON.stringify(f3));
  const f4 = await N.fetchSpore("http://a.example/spore.json", sA.id);
  t("F4 nur https: http wird gar nicht erst abgerufen", !f4.ok && abgerufen === 0, JSON.stringify(f4));
  const f5 = await N.fetchSpore("https://a.example/sbkim/spore.json", sA.id);
  t("F5 https: geholt, geprüft, Kennung passt", f5.ok && abgerufen === 1 && f5.id === sA.id, JSON.stringify(f5));
  const { N: N2 } = await seite("FM2", "nm", { admin: sK.id });
  t("F6 beim Laden kein Netz: ohne Knopfdruck wird nichts abgerufen", abgerufen === 1);
  void N2;
}

// ═══ L · Sprache, Oberfläche ohne DOM ═══
{
  const { N } = await seite("LM", "nm", { admin: sK.id });
  t("L1 ohne DOM baut mount nichts und wirft nicht", N.mount(null) === null);
  const src = m23b;
  t("L2 kein innerHTML im Baustein (fremde Namen nur als Text)", !/\.innerHTML\s*=/.test(src) && !/insertAdjacentHTML/.test(src));
  t("L3 die Marke im Kopf: „SBKIM — Modul 23b —“ (kanon-verteilen erkennt am Inhalt)", /SBKIM\s+—\s+Modul\s+23b\s+—/.test(src.slice(0, 400)));
}

console.log("\n" + gruen + " grün · " + rot + " rot");
process.exitCode = rot ? 1 : 0;
