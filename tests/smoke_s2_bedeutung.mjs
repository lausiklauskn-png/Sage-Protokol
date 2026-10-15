// Smoke-Test S2 „Vektor gegen Text nachrechnen" (2026-10-15, docs/PLAN_MYCEL_SCHICHTEN.md).
//
// Der Empfänger rechnet den domainVector einer Raum-Karte aus ihrer Beschreibung
// nach (Modul 23 checkMeaning). Klaus 2026-10-15: Schwelle 0.99; ein Vektor aus
// Inhalten (embeddingSource "content") ist „nicht nachprüfbar", ohne Abzug.
// Echtes Modul 01/02, echt signierte Sporen. Das Sprachmodell ist eine
// Attrappe: derselbe Text ergibt denselben Vektor, verschiedene Texte
// verschiedene. Gemessen wird die Logik, NICHT das echte Modell — dessen
// Wiederholgenauigkeit misst tools/s2-wiederholung.html im Browser.
// Gegenprobe: tests/gegenprobe_s2_bedeutung.mjs.

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
function knoten(name) {
  const c = { console: still, setTimeout, clearTimeout, Date, Math, JSON, Promise, Float32Array, TextEncoder, TextDecoder, crypto: webcrypto, btoa, atob };
  c.globalThis = c; vm.createContext(c); vm.runInContext(m23, c, { filename: name + "/23_rendezvous.js" }); return c.SbkimRendezvous;
}

// ── Attrappe des Sprachmodells: Text → fester, normierter 384er-Vektor ──
const DIM = 384;
function norm(v) { const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)); return v.map(x => x / n); }
function attrappe(text) {
  let h = 2166136261;
  for (const ch of String(text)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const v = [];
  for (let i = 0; i < DIM; i++) { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; v.push((h / 4294967296) - 0.5); }
  return norm(v);
}
const cos = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
// Vektor mit genau vorgegebenem Cosinus c zu a (Gram-Schmidt gegen einen zweiten).
function mitCosinus(a, c) {
  const b0 = attrappe("orthogonal-hilfe");
  const d = cos(a, b0);
  const o = norm(b0.map((x, i) => x - d * a[i]));
  const s = Math.sqrt(1 - c * c);
  return norm(a.map((x, i) => c * x + s * o[i]));
}
function modell({ bereit = true } = {}) {
  const m = { aufrufe: 0, ladeVersuche: 0,
    isReady() { return bereit; },
    async init() { m.ladeVersuche++; },
    async embedPassage(text) { m.aufrufe++; return new Float32Array(attrappe(text)); } };
  return m;
}

const DESC = "Ein Rezeptbuch für Familienrezepte. Es sammelt Vorspeisen und Hauptgerichte.";
const KW = ["Rezepte", "Kochen", "Familie"];
const FREMD = "Eine Buchhaltung für kleine Firmen mit Rechnungen und Belegen.";
let slotN = 0;
async function spore(meta) {
  const slot = "s2x" + (++slotN);
  await Sp.getOrCreateIdentity(slot);
  return Sp.generateOwnSpore({ domain: "Test", endpoint: "https://" + slot + ".example/", nodeType: "hybrid",
    nodeName: "Knoten " + slot, domainDescription: DESC, domainKeywords: KW, ...meta }, slot);
}
async function pruefe(sp, m) {
  const R = knoten("k" + (++slotN));
  await R.init({ nodeName: "Empfänger", embedding: m || modell(), spore: { async getOwnSpore() { return null; }, verifyForeignSpore: Sp.verifyForeignSpore } });
  return R.checkMeaning(sp);
}

// ═══ M · checkMeaning ═══
{
  const R = knoten("m0");
  t("M1 checkMeaning ist ausgeliefert", typeof R.checkMeaning === "function");

  const echt = await spore({ domainVector: attrappe(DESC), embeddingSource: "description" });
  t("M0 Spore ist echt signiert", (await Sp.verifyForeignSpore(echt)).valid === true);
  const r2 = await pruefe(echt);
  t("M2 Vektor aus der Beschreibung → passt", r2.status === "passt" && r2.score > 0.9999, JSON.stringify(r2));

  const mitKw = await spore({ domainVector: attrappe(DESC + ". " + KW.join(", ")), embeddingSource: "description" });
  const r3 = await pruefe(mitKw);
  t("M3 Vektor aus Beschreibung + Stichworten (Erst-Signatur) → passt", r3.status === "passt", JSON.stringify(r3));

  const helfer = await spore({ domainVector: attrappe(DESC + " " + KW.join(", ")), embeddingSource: "description" });
  const r3b = await pruefe(helfer);
  t("M3b Vektor nach tools/embed_helper.html (Leerzeichen) → passt", r3b.status === "passt", JSON.stringify(r3b));

  const kopie = await spore({ domainVector: attrappe(FREMD), embeddingSource: "description" });
  const r4 = await pruefe(kopie);
  t("M4 abgeschriebener Vektor → passt nicht", r4.status === "passt-nicht", JSON.stringify(r4));

  const inhalt = await spore({ domainVector: attrappe(FREMD), embeddingSource: "content" });
  const r5 = await pruefe(inhalt);
  t("M5 Vektor aus Inhalten → nicht nachprüfbar, kein Abzug", r5.status === "nicht-nachpruefbar", JSON.stringify(r5));

  const altPasst = await spore({ domainVector: attrappe(DESC) });
  const altFremd = await spore({ domainVector: attrappe(FREMD) });
  const r6a = await pruefe(altPasst), r6b = await pruefe(altFremd);
  t("M6 alte Spore ohne embeddingSource: trifft → passt, sonst nicht nachprüfbar",
    r6a.status === "passt" && r6b.status === "nicht-nachpruefbar", r6a.status + " / " + r6b.status);

  const kalt = modell({ bereit: false });
  const r7 = await pruefe(echt, kalt);
  t("M7 Modell nicht geladen → nicht geprüft, und es wird NICHT geladen",
    r7.status === "nicht-geprueft" && kalt.aufrufe === 0 && kalt.ladeVersuche === 0, JSON.stringify(r7));

  const ohne = knoten("m8");
  await ohne.init({ nodeName: "x", embedding: null });
  const r8 = await ohne.checkMeaning(echt);
  t("M8 ohne Modul 03 → nicht geprüft", r8.status === "nicht-geprueft", JSON.stringify(r8));

  const schnipselFalsch = await spore({ domainVector: attrappe(FREMD), embeddingSource: "content",
    snippetVectors: [{ text: "Ein Rezeptbuch für Familienrezepte.", vec: attrappe("Rechnungen und Belege.") }] });
  const r9 = await pruefe(schnipselFalsch);
  t("M9 gefälschter Satz-Schnipsel → passt nicht, auch bei Inhalts-Vektor",
    r9.status === "passt-nicht" && r9.snippets === "passen-nicht", JSON.stringify(r9));

  const schnipselGut = await spore({ domainVector: attrappe(DESC), embeddingSource: "description",
    snippetVectors: [{ text: "Ein Rezeptbuch für Familienrezepte.", vec: attrappe("Ein Rezeptbuch für Familienrezepte.") },
                     { text: "Ein sehr langer gekürzter Satz…", vec: attrappe("ganz anders") }] });
  const r10 = await pruefe(schnipselGut);
  t("M10 echte Schnipsel passen, gekürzte (…) werden übersprungen",
    r10.status === "passt" && r10.snippets === "passen", JSON.stringify(r10));

  const knapp = await spore({ domainVector: mitCosinus(attrappe(DESC), 0.985), embeddingSource: "description" });
  const drueber = await spore({ domainVector: mitCosinus(attrappe(DESC), 0.995), embeddingSource: "description" });
  const r11a = await pruefe(knapp), r11b = await pruefe(drueber);
  t("M11 Schwelle 0.99: 0.985 passt nicht, 0.995 passt",
    r11a.status === "passt-nicht" && r11b.status === "passt", r11a.score?.toFixed(4) + " / " + r11b.score?.toFixed(4));

  const anderes = await spore({ domainVector: attrappe(DESC), embeddingSource: "description", embeddingModel: "anderes/modell" });
  const r12 = await pruefe(anderes);
  t("M12 anderes Modell → nicht geprüft", r12.status === "nicht-geprueft", JSON.stringify(r12));

  const kaputt = { ...echt, domainVector: undefined };
  const r13 = await pruefe(kaputt);
  t("M13 ohne Vektor → nicht geprüft, nie still passt", r13.status === "nicht-geprueft", JSON.stringify(r13));
}

// ═══ R · im Raum: discover, Verwandtschaft, Rangfolge ═══
{
  const RDV_TAG = "sbkim-rdv";
  function relais() {
    const store = []; let n = 0;
    return {
      async publish() {},
      inject(pub, card) { store.push({ id: "e" + (++n), pubkey: pub, kind: 1, created_at: Math.floor(Date.now() / 1000), tags: [["t", RDV_TAG]], content: JSON.stringify(card), sig: "x" }); },
      subscribe(f, cb) { for (const ev of store) Promise.resolve().then(() => cb(ev)); return () => {}; },
    };
  }
  const gut = await spore({ nodeName: "Echt", domainVector: attrappe(DESC), embeddingSource: "description" });
  const dieb = await spore({ nodeName: "Dieb", domainDescription: FREMD, domainVector: attrappe(DESC), embeddingSource: "description" });
  const karte = (s) => ({ kind: "sbkim-presence", nodeId: s.id, nodeName: s.nodeName, spore: s, ts: Math.floor(Date.now() / 1000) });
  async function raum(opts, m) {
    const R = knoten("r" + (++slotN)), rel = relais();
    await R.init({ nodeName: "Empfänger", relayClient: rel, embedding: m === undefined ? modell() : m,
      spore: { async getOwnSpore() { return { id: "selbst", domainVector: attrappe(DESC) }; }, verifyForeignSpore: Sp.verifyForeignSpore },
      match: { relatedness(a, b) { return 0.9; }, isRelated(s) { return s >= 0.3; } },
      anastomose: { async handshake() { return { outcome: "established" }; } } });
    rel.inject("p1", karte(gut)); rel.inject("p2", karte(dieb));
    return { R, r: await R.discover({ listenMs: 60, ...opts }) };
  }
  const { R, r } = await raum({});
  const kG = r.cards.find(c => c.nodeId === gut.id), kD = r.cards.find(c => c.nodeId === dieb.id);
  t("R1 discover hängt je Karte die Bedeutung an",
    kG?.meaning?.status === "passt" && kD?.meaning?.status === "passt-nicht", JSON.stringify([kG?.meaning?.status, kD?.meaning?.status]));
  t("R2 „passt nicht“ bleibt sichtbar (markieren, nicht abweisen)", !!kD && r.rejected === 0, "rejected " + r.rejected);
  t("R3 „passt nicht“ bekommt keinen Verwandtschafts-Vorrang", kG?.isRelated === true && kD?.isRelated === false,
    kG?.isRelated + " / " + kD?.isRelated);
  const rang = R.rankCardsByQuery([{ ...kD }, { ...kG }].map(c => ({ ...c })), attrappe(DESC));
  t("R4 Frage-Rangfolge: „passt nicht“ ans Ende", rang[rang.length - 1].nodeId === dieb.id, rang.map(c => c.nodeName).join(","));
  t("R5 _meta.meaningMin = 0.99", R._meta.meaningMin === 0.99, String(R._meta.meaningMin));
  const aus = await raum({ checkMeaning: false });
  t("R6 checkMeaning:false → keine Bedeutung an der Karte", aus.r.cards.every(c => c.meaning === undefined));
  const kalt = modell({ bereit: false });
  const ohneModell = await raum({}, kalt);
  t("R7 ohne geladenes Modell: alle „nicht geprüft“, kein Laden, beide sichtbar",
    ohneModell.r.cards.length === 2 && ohneModell.r.cards.every(c => c.meaning?.status === "nicht-geprueft") && kalt.ladeVersuche === 0);
}

// ═══ U · Siegel und Anzeige ═══
{
  const siegel = readFileSync(resolve(root, "src/modules/16_siegel.js"), "utf8");
  t("U1 Siegel-Aspekt S2 steht (DE + EN)", siegel.includes('aspect:      "Die Bedeutung wird nachgerechnet (S2)"') && siegel.includes('"The meaning is recomputed (S2)"'));
  const ui = readFileSync(resolve(root, "src/modules/23_rendezvous_ui.js"), "utf8");
  t("U2 Karte zeigt die Bedeutung (fester Text, data-sbkim-meaning)", ui.includes('mBadge.setAttribute("data-sbkim-meaning", mStat)'));
}

// ═══ B · im echten Browser: die Karte zeigt die Bedeutung (DE/EN), fremder Name nur als Text ═══
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
      const sp = (n, src) => ({ id: "id-" + n, embeddingSource: src });
      window.SbkimRendezvous.discover = async () => ({ ok: true, cardsVerified: true, rejected: 0, cards: [
        { nodeId: "id-a", nodeName: "<img src=x onerror=alert(1)>Echt", spore: sp("a", "description"), ts: 1, ageSec: 5, meaning: { status: "passt", score: 0.9998 } },
        { nodeId: "id-b", nodeName: "Dieb", spore: sp("b", "description"), ts: 1, ageSec: 5, meaning: { status: "passt-nicht", score: 0.5 } },
        { nodeId: "id-c", nodeName: "Inhalt", spore: sp("c", "content"), ts: 1, ageSec: 5, meaning: { status: "nicht-nachpruefbar", score: 0.6 } },
        { nodeId: "id-d", nodeName: "Alt", spore: sp("d"), ts: 1, ageSec: 5, meaning: { status: "nicht-nachpruefbar", score: 0.6 } },
        { nodeId: "id-e", nodeName: "Kalt", spore: sp("e", "description"), ts: 1, ageSec: 5, meaning: { status: "nicht-geprueft", score: null } }] });
      window.SbkimRendezvousUI.show();
    });
    await pg.locator("button", { hasText: /Wer ist im Raum|Who is in the room/ }).first().click();
    await pg.waitForFunction(() => document.querySelectorAll("[data-sbkim-meaning]").length >= 5, null, { timeout: 8000 }).catch(() => {});
    const r = await pg.evaluate(() => ({
      b: [...document.querySelectorAll("[data-sbkim-meaning]")].map((e) => e.getAttribute("data-sbkim-meaning") + "|" + e.textContent),
      img: document.querySelectorAll("img[src=x]").length, sw: document.documentElement.scrollWidth }));
    await pg.close();
    return { ...r, fehler };
  }
  const de = await zeige("de"), en = await zeige("en");
  await browser.close(); srv.close();
  const erwartDe = ["passt|✓ Bedeutung passt zur Beschreibung", "passt-nicht|⚠ Bedeutung passt nicht zur Beschreibung — kein Vorrang",
    "nicht-nachpruefbar|· Bedeutung aus Inhalten, nicht nachprüfbar", "nicht-nachpruefbar|· Herkunft der Bedeutung nicht angegeben, nicht nachprüfbar",
    "nicht-geprueft|· Bedeutung nicht geprüft"];
  t("B1 jede Karte zeigt ihren Bedeutungs-Zustand (DE)", JSON.stringify(de.b) === JSON.stringify(erwartDe), JSON.stringify(de.b));
  t("B2 englische Oberfläche: kein deutscher Satz", en.b.length === 5 && en.b.every((x) => !/Bedeutung/.test(x)), JSON.stringify(en.b));
  t("B3 fremder Name nur als Text, keine Seitenfehler, kein Überlauf bei 360 px",
    de.img === 0 && en.img === 0 && !de.fehler.length && !en.fehler.length && de.sw <= 360, JSON.stringify({ img: de.img, f: de.fehler, sw: de.sw }));
}

console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exitCode = rot ? 1 : 0;
