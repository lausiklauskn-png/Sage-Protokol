// Headless smoke test for Bau 23 UI — Rendezvous-Floating-Knopf. Run with
//   node tests/smoke_bau23_rendezvous_ui.mjs
// Minimal-DOM-Stub (analog smoke_bau22) + Mock-SbkimRendezvous. Beweist die
// UI-Logik: Mount, Toggle, Verdrahtung der drei Gesten an Modul 23, Karten-
// Render mit 🤝-Andocken, fail-soft ohne Modul 23. Kein echtes DOM/Netz.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// ---- Minimal-DOM-Stub (createElement-basiert, parst KEIN innerHTML) ----
function makeEl(tag, doc) {
  const e = {
    tagName: String(tag).toUpperCase(), nodeType: 1, id: "", textContent: "", type: "", title: "",
    children: [], parentNode: null, _listeners: {},
  };
  // style mit cssText-Parsing (setzt einzelne Eigenschaften wie ein echter Browser).
  const _style = {};
  Object.defineProperty(_style, "cssText", {
    get() { return _style._raw || ""; },
    set(v) {
      _style._raw = String(v);
      String(v).split(";").forEach((decl) => {
        const i = decl.indexOf(":");
        if (i < 0) return;
        const prop = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        if (prop && prop !== "_raw") _style[prop] = decl.slice(i + 1).trim();
      });
    },
  });
  e.style = _style;
  e.appendChild = (c) => { if (c.parentNode) { const i = c.parentNode.children.indexOf(c); if (i >= 0) c.parentNode.children.splice(i, 1); } e.children.push(c); c.parentNode = e; return c; };
  e.removeChild = (c) => { const i = e.children.indexOf(c); if (i >= 0) { e.children.splice(i, 1); c.parentNode = null; } return c; };
  Object.defineProperty(e, "firstChild", { get: () => e.children[0] || null });
  e.addEventListener = (t, cb) => { (e._listeners[t] = e._listeners[t] || []).push(cb); };
  e.click = () => (e._listeners.click || []).slice().forEach((cb) => cb({ type: "click" }));
  e.querySelector = (sel) => find(e, sel);
  return e;
}
function find(root, sel) {
  let out = null;
  (function walk(n) { if (out) return; for (const c of n.children) { if (matches(c, sel)) { out = c; return; } walk(c); } })(root);
  return out;
}
function matches(el, sel) {
  if (sel.startsWith("#")) return el.id === sel.slice(1);
  return el.tagName === sel.toUpperCase();
}
function makeDoc() {
  const doc = { nodeType: 9, readyState: "complete" };
  doc.createElement = (t) => makeEl(t, doc);
  doc.body = makeEl("body", doc);
  doc.head = makeEl("head", doc);
  doc.addEventListener = () => {};
  doc.querySelector = (sel) => find(doc.body, sel);
  return doc;
}

// ---- Mock-SbkimRendezvous ----
function makeMockRdv() {
  const calls = { configure: [], announce: 0, connect: 0, discover: 0, handshake: [], ask: [], fetch: [] };
  let discoverCards = [];
  let connectImpl = async () => ({ ok: true, created: false, nodeId: "OWN" });
  let askResult = { ok: false, pending: true, qid: "q-mock-1", reason: "Noch keine Antwort." };
  let fetchResult = { ok: true, answers: [] };
  return {
    configure(o) { calls.configure.push(o); },
    announce: async () => { calls.announce++; return { ok: true, nodeId: "OWN" }; },
    connectAndAnnounce: async (o) => { calls.connect++; calls._lastConnectOpts = o; return connectImpl(o); },
    discover: async () => { calls.discover++; return { ok: true, cards: discoverCards }; },
    handshakeCard: async (card) => { calls.handshake.push(card); return { outcome: "established", score: 0.9 }; },
    // A11: nach Frage-Passung ranken — Mock sortiert nach dem je-Karte gesetzten
    // `_fit` (absteigend) und hängt queryFit an (wie der echte rankCardsByQuery).
    rankCardsByQuery: (cards, qv) => {
      calls.rank = (calls.rank || 0) + 1; calls.lastRankQv = qv;
      const list = (Array.isArray(cards) ? cards : []).map((c) => Object.assign({}, c, { queryFit: (typeof c._fit === "number" ? c._fit : null) }));
      list.sort((a, b) => (b.queryFit == null ? -Infinity : b.queryFit) - (a.queryFit == null ? -Infinity : a.queryFit));
      return list;
    },
    askNode: async (card, text) => { calls.ask.push({ card, text }); return askResult; },
    fetchAnswers: async (qids) => { calls.fetch.push(qids); return fetchResult; },
    _calls: calls,
    _setDiscover(cards) { discoverCards = cards; },
    _setConnect(fn) { connectImpl = fn; },
    _setAsk(r) { askResult = r; },
    _setFetch(r) { fetchResult = r; },
  };
}

const stub = {};
stub.document = makeDoc();
stub.console = console;
stub.SbkimRendezvous = makeMockRdv();
// A11: Frage-Einbettung (Modul 03) — Mock liefert einen Dummy-Vektor, damit
// onAutoAsk den Rank-Pfad (canRank && qv) nimmt.
stub.SbkimEmbedding = { embedQuery: async () => [0.1, 0.2, 0.3] };
// Minimaler Event-Bus (das UI lauscht via global.addEventListener auf
// sbkim:handshake) + dispatchEvent zum Auslösen im Test.
const _bus = {};
stub.addEventListener = (t, cb) => { (_bus[t] = _bus[t] || []).push(cb); };
stub.removeEventListener = (t, cb) => { if (_bus[t]) _bus[t] = _bus[t].filter((f) => f !== cb); };
stub.dispatchEvent = (ev) => { (_bus[ev.type] || []).slice().forEach((cb) => cb(ev)); return true; };
// localStorage-Stub (A12 Briefkasten merkt offene Fragen; Panel-Position nutzt es auch).
const _ls = {};
stub.localStorage = { getItem: (k) => (k in _ls ? _ls[k] : null), setItem: (k, v) => { _ls[k] = String(v); }, removeItem: (k) => { delete _ls[k]; } };

function loadUI() {
  const src = readFileSync(resolve(repoRoot, "src/modules/23_rendezvous_ui.js"), "utf8");
  new Function("window", "globalThis", "console", "document", src)(stub, stub, console, stub.document);
}
loadUI();
const UI = stub.SbkimRendezvousUI;

const results = [];
const record = (probe, exp, act, ok) => results.push({ probe, exp, act, ok });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  record("Surface vorhanden", "object", typeof UI, typeof UI === "object");
  for (const fn of ["init", "show", "hide", "isOpen"]) record(fn + " ist function", "function", typeof UI[fn], typeof UI[fn] === "function");

  let createCalled = 0;
  await UI.init({ nodeName: "Mein Rezeptbuch", createIdentity: async () => { createCalled++; } });
  record("_meta.mounted nach init", "true", String(UI._meta.mounted), UI._meta.mounted === true);
  record("_meta.nodeName übernommen", "Mein Rezeptbuch", UI._meta.nodeName, UI._meta.nodeName === "Mein Rezeptbuch");
  record("Modul 23 vorkonfiguriert (configure mit nodeName)", "ja",
    stub.SbkimRendezvous._calls.configure.some((o) => o && o.nodeName === "Mein Rezeptbuch") ? "ja" : "nein",
    stub.SbkimRendezvous._calls.configure.some((o) => o && o.nodeName === "Mein Rezeptbuch"));

  const btn = stub.document.querySelector("#sbkim-rdv-btn");
  const panel = stub.document.querySelector("#sbkim-rdv-panel");
  record("Floating-Knopf gemountet", "vorhanden", btn ? "vorhanden" : "fehlt", !!btn);
  record("Panel gemountet", "vorhanden", panel ? "vorhanden" : "fehlt", !!panel);
  record("Panel initial versteckt", "none", panel && panel.style.display, panel && panel.style.display === "none");

  // Toggle über Knopf-Klick.
  btn.click();
  record("Knopf-Klick öffnet Panel", "true", String(UI.isOpen()), UI.isOpen() === true);
  btn.click();
  record("zweiter Klick schliesst Panel", "false", String(UI.isOpen()), UI.isOpen() === false);
  UI.show();

  // 🌐 Mit dem Knotennetz verbinden → connectAndAnnounce mit createIdentity.
  const connectBtn = panel.querySelector("#sbkim-rdv-cards") ? null : null; // placeholder
  // Knöpfe sind die ersten Buttons in der Zeile; finde über Reihenfolge.
  // (Stub-querySelector findet per Tag/ID; wir klicken die bekannten Handler über die row.)
  // Einfacher: rufe die internen Pfade über die gemounteten Buttons im Panel.
  const buttons = [];
  (function collect(n) { for (const c of n.children) { if (c.tagName === "BUTTON") buttons.push(c); collect(c); } })(panel);
  // buttons: [close ✕, 🌐 connect, 👥 discover, 📌 announce]
  const connectButton = buttons.find((b) => b.textContent.includes("Mit dem Knotennetz verbinden"));
  const discoverButton = buttons.find((b) => b.textContent.includes("Wer ist im Raum"));
  const announceButton = buttons.find((b) => b.textContent.includes("Nur neu anmelden"));
  record("Connect-Knopf im Panel", "ja", connectButton ? "ja" : "nein", !!connectButton);
  record("Discover-Knopf im Panel", "ja", discoverButton ? "ja" : "nein", !!discoverButton);
  record("Announce-Knopf im Panel", "ja", announceButton ? "ja" : "nein", !!announceButton);

  connectButton.click();
  await sleep(20);
  record("Connect ruft connectAndAnnounce", "1", String(stub.SbkimRendezvous._calls.connect), stub.SbkimRendezvous._calls.connect === 1);
  record("createIdentity durchgereicht", "function",
    typeof (stub.SbkimRendezvous._calls._lastConnectOpts && stub.SbkimRendezvous._calls._lastConnectOpts.createIdentity),
    typeof (stub.SbkimRendezvous._calls._lastConnectOpts && stub.SbkimRendezvous._calls._lastConnectOpts.createIdentity) === "function");

  // 📌 announce.
  announceButton.click();
  await sleep(20);
  record("Announce ruft announce", "1", String(stub.SbkimRendezvous._calls.announce), stub.SbkimRendezvous._calls.announce === 1);

  // 👥 discover → Karten rendern → 🤝 Andocken klickt handshakeCard.
  stub.SbkimRendezvous._setDiscover([{ nodeId: "PEER-1", nodeName: "Mein Mixarium", spore: { id: "PEER-1" }, ts: 100, ageSec: 30 }]);
  discoverButton.click();
  await sleep(20);
  const cards = stub.document.querySelector("#sbkim-rdv-cards");
  const andockBtn = (function () { let f = null; (function w(n) { for (const c of n.children) { if (c.tagName === "BUTTON" && c.textContent.includes("Andocken")) { f = c; return; } w(c); } })(cards); return f; })();
  record("discover rendert Karte mit 🤝-Knopf", "ja", andockBtn ? "ja" : "nein", !!andockBtn);
  if (andockBtn) {
    andockBtn.click();
    await sleep(20);
  }
  record("🤝 ruft handshakeCard mit der Karte", "PEER-1",
    stub.SbkimRendezvous._calls.handshake[0] && stub.SbkimRendezvous._calls.handshake[0].nodeId,
    stub.SbkimRendezvous._calls.handshake[0] && stub.SbkimRendezvous._calls.handshake[0].nodeId === "PEER-1");

  // ── Partner-Link „↗ App öffnen" (Klaus 2026-07-12) ──
  // Trägt die Karte einen http(s)-endpoint in der Spore, rendert die UI einen
  // Link, der die App/PWA des Knotens öffnet (Selbst-Suche ohne Warten).
  const findLink = (root, label) => { let f = null; (function w(n) { if (f) return; for (const c of n.children) { if (c.tagName === "A" && (c.textContent || "").includes(label)) { f = c; return; } w(c); } })(root); return f; };
  stub.SbkimRendezvous._setDiscover([{ nodeId: "EP-1", nodeName: "Mein Mixarium", spore: { id: "EP-1", endpoint: "https://lausiklauskn-png.github.io/Mein-Mixarium/" }, ts: 100, ageSec: 5 }]);
  discoverButton.click();
  await sleep(20);
  const cardsEp = stub.document.querySelector("#sbkim-rdv-cards");
  const openLink = findLink(cardsEp, "App öffnen");
  record("Karte mit endpoint zeigt „↗ App öffnen“-Link", "ja", openLink ? "ja" : "nein", !!openLink);
  record("Link zeigt auf den Knoten-endpoint", "…/Mein-Mixarium/",
    openLink && openLink.href, !!openLink && openLink.href === "https://lausiklauskn-png.github.io/Mein-Mixarium/");
  record("Link öffnet neuen Tab (target=_blank, rel=noopener)", "ja",
    openLink && (openLink.target + "/" + openLink.rel),
    !!openLink && openLink.target === "_blank" && /noopener/.test(openLink.rel || ""));
  // Ohne endpoint → KEIN Link (fail-soft, kein toter Knopf).
  stub.SbkimRendezvous._setDiscover([{ nodeId: "NOEP", nodeName: "Ohne Adresse", spore: { id: "NOEP" }, ts: 101, ageSec: 5 }]);
  discoverButton.click();
  await sleep(20);
  const cardsNo = stub.document.querySelector("#sbkim-rdv-cards");
  record("Karte ohne endpoint zeigt KEINEN Link", "kein Link", findLink(cardsNo, "App öffnen") ? "Link!" : "kein Link", !findLink(cardsNo, "App öffnen"));

  // ── Verwandtschafts-Badge + „nur verwandte"-Filter (REINE ANZEIGE) ──
  // Karten tragen relatedness/isRelated (von Modul 23 angereichert) — die UI
  // zeigt ein Badge je Karte und kann auf „nur verwandte" filtern.
  const txtOf = (node) => { let s = ""; (function w(n) { if (n.textContent && n.children.length === 0) s += n.textContent + " "; for (const c of n.children) w(c); })(node); return s; };
  stub.SbkimRendezvous._setDiscover([
    { nodeId: "REZ", nodeName: "Rezeptbuch", spore: { id: "REZ" }, ts: 200, ageSec: 10, relatedness: 0.72, isRelated: true },
    { nodeId: "SAGE", nodeName: "Sage", spore: { id: "SAGE" }, ts: 199, ageSec: 10, relatedness: -0.21, isRelated: false },
  ]);
  discoverButton.click();
  await sleep(20);
  const cards2 = stub.document.querySelector("#sbkim-rdv-cards");
  record("Badge 🧬 verwandt 0.72 für verwandte Karte", "ja",
    txtOf(cards2).includes("🧬 verwandt 0.72") ? "ja" : "nein", txtOf(cards2).includes("🧬 verwandt 0.72"));
  record("Badge · verbunden -0.21 für fremde Karte", "ja",
    txtOf(cards2).includes("verbunden -0.21") ? "ja" : "nein", txtOf(cards2).includes("verbunden -0.21"));
  record("ohne Filter: beide Karten sichtbar (Rezeptbuch + Sage)", "ja",
    (txtOf(cards2).includes("Rezeptbuch") && txtOf(cards2).includes("Sage")) ? "ja" : "nein",
    txtOf(cards2).includes("Rezeptbuch") && txtOf(cards2).includes("Sage"));

  // „🧬 nur verwandte" einschalten → nur Rezeptbuch bleibt.
  const allBtns = [];
  (function collect(n) { for (const c of n.children) { if (c.tagName === "BUTTON") allBtns.push(c); collect(c); } })(panel);
  const relBtn = allBtns.find((b) => b.textContent.includes("nur verwandte"));
  record("🧬 nur-verwandte-Schalter vorhanden", "ja", relBtn ? "ja" : "nein", !!relBtn);
  record("_meta.relatedOnly initial false", "false", String(UI._meta.relatedOnly), UI._meta.relatedOnly === false);
  relBtn.click();
  await sleep(5);
  record("_meta.relatedOnly nach Klick true", "true", String(UI._meta.relatedOnly), UI._meta.relatedOnly === true);
  const cards3 = stub.document.querySelector("#sbkim-rdv-cards");
  record("Filter an: Rezeptbuch bleibt", "ja", txtOf(cards3).includes("Rezeptbuch") ? "ja" : "nein", txtOf(cards3).includes("Rezeptbuch"));
  record("Filter an: Sage (fremd) ausgeblendet", "ja", !txtOf(cards3).includes("Sage") ? "ja" : "nein", !txtOf(cards3).includes("Sage"));
  relBtn.click(); // zurück auf „aus"
  await sleep(5);
  record("Filter wieder aus → _meta.relatedOnly false", "false", String(UI._meta.relatedOnly), UI._meta.relatedOnly === false);

  // ── Empfänger-Hinweis: eingehender Handshake (Klaus 2026-07-11) ──
  // Wenn ein FREMDER Knoten sich verbindet, meldet Modul 05 sbkim:handshake
  // mit direction:"incoming". Das UI soll das sichtbar machen (Klaus' Befund:
  // Antworter merkte den Handshake nicht). REINE Anzeige.
  const incoming = stub.document.querySelector("#sbkim-rdv-incoming");
  record("Empfänger-Hinweis-Zeile gemountet", "vorhanden", incoming ? "vorhanden" : "fehlt", !!incoming);
  record("Hinweis initial versteckt", "none", incoming && incoming.style.display, incoming && incoming.style.display === "none");

  stub.dispatchEvent({ type: "sbkim:handshake", detail: { direction: "incoming", outcome: "established", peerNodeId: "PEER-INCOMING-123456789" } });
  await sleep(5);
  record("eingehender Handshake macht Hinweis sichtbar", "block", incoming && incoming.style.display, incoming && incoming.style.display === "block");
  record("Hinweis nennt die (gekürzte) Knoten-ID", "ja", incoming && incoming.textContent.includes("PEER-INCO") ? "ja" : "nein", !!(incoming && incoming.textContent.includes("PEER-INCO")));
  record("Hinweis mit 🤝-Marker", "ja", incoming && incoming.textContent.includes("🤝") ? "ja" : "nein", !!(incoming && incoming.textContent.includes("🤝")));

  // zweiter, ANDERER Knoten → Zähler 2
  stub.dispatchEvent({ type: "sbkim:handshake", detail: { direction: "incoming", outcome: "established", peerNodeId: "PEER-ZWEI-987654321" } });
  await sleep(5);
  record("zweiter eingehender Knoten → „2 Knoten“", "ja", incoming && incoming.textContent.includes("2 Knoten") ? "ja" : "nein", !!(incoming && incoming.textContent.includes("2 Knoten")));

  // Dedupe: derselbe erste Knoten nochmal → bleibt 2 (nicht 3)
  stub.dispatchEvent({ type: "sbkim:handshake", detail: { direction: "incoming", outcome: "established", peerNodeId: "PEER-INCOMING-123456789" } });
  await sleep(5);
  record("Dedupe: gleicher Knoten erhöht nicht auf 3", "ja", incoming && incoming.textContent.includes("2 Knoten") ? "ja" : "nein", !!(incoming && incoming.textContent.includes("2 Knoten")));

  // OUTGOING-Handshake (eigenes Andocken) darf den Empfänger-Hinweis NICHT verändern
  stub.dispatchEvent({ type: "sbkim:handshake", detail: { direction: "outgoing", outcome: "established", peerNodeId: "PEER-DREI" } });
  await sleep(5);
  record("outgoing-Handshake ändert den Empfänger-Hinweis nicht", "ja", incoming && !incoming.textContent.includes("PEER-DRE") ? "ja" : "nein", !!(incoming && !incoming.textContent.includes("PEER-DRE")));

  // incoming aber rejected (Score zu niedrig) → kein Eintrag
  stub.dispatchEvent({ type: "sbkim:handshake", detail: { direction: "incoming", outcome: "rejected", peerNodeId: "PEER-REJECT" } });
  await sleep(5);
  record("incoming rejected wird nicht als Verbindung gezeigt", "ja", incoming && !incoming.textContent.includes("PEER-REJE") ? "ja" : "nein", !!(incoming && !incoming.textContent.includes("PEER-REJE")));

  // ── A12 Phase 2: Briefkasten — offene Frage merken + Antwort nachlesen ──
  const bubble = stub.document.querySelector("#sbkim-rdv-btn");
  const qInput = stub.document.querySelector("#sbkim-rdv-q");
  const preOf = () => { let f = null; (function w(n) { if (f) return; for (const c of n.children) { if (c.tagName === "PRE") { f = c; return; } w(c); } })(panel); return f; };
  record("Frage-Feld (#sbkim-rdv-q) vorhanden", "ja", qInput ? "ja" : "nein", !!qInput);
  const allBtnsMail = []; (function collect(n) { for (const c of n.children) { if (c.tagName === "BUTTON") allBtnsMail.push(c); collect(c); } })(panel);
  const mailButton = allBtnsMail.find((b) => b.textContent.includes("Antworten abholen"));
  record("📬-Knopf „Antworten abholen“ im Panel", "ja", mailButton ? "ja" : "nein", !!mailButton);

  // Karte rendern, an die gefragt wird
  stub.SbkimRendezvous._setDiscover([{ nodeId: "PEER-9", nodeName: "Zielknoten", spore: { id: "PEER-9" }, ts: 300, ageSec: 5 }]);
  discoverButton.click();
  await sleep(20);
  const cardsM = stub.document.querySelector("#sbkim-rdv-cards");
  const askBtn = (function () { let f = null; (function w(n) { for (const c of n.children) { if (c.tagName === "BUTTON" && c.textContent.includes("gezielt fragen")) { f = c; return; } w(c); } })(cardsM); return f; })();
  record("❓ gezielt-fragen-Knopf an der Karte", "ja", askBtn ? "ja" : "nein", !!askBtn);

  // Frage stellen, während der Antworter „zu" ist → askNode liefert pending+qid.
  if (qInput) qInput.value = "kuchen";
  stub.SbkimRendezvous._setAsk({ ok: false, pending: true, qid: "q-brief-1", reason: "Noch keine Antwort." });
  if (askBtn) askBtn.click();
  await sleep(40);
  const stored1 = JSON.parse(_ls["sbkim_rdv_pending_default"] || "[]");
  record("offene Frage im Briefkasten gemerkt (qid + status offen)", "ja",
    stored1.some((e) => e.qid === "q-brief-1" && e.status === "offen") ? "ja" : "nein",
    JSON.stringify(stored1));
  record("Blasen-Zähler zeigt ungelesene Post (📬)", "ja",
    bubble && bubble.textContent.includes("📬") ? "ja" : "nein", bubble && bubble.textContent);

  // Antwort liegt jetzt vor → 📬 Antworten abholen holt sie nach.
  stub.SbkimRendezvous._setFetch({ ok: true, answers: [{ qid: "q-brief-1", fromName: "Zielknoten", results: [{ label: "Eierschecke", score: 0.9 }, { label: "Stollen", score: 0.8 }] }] });
  if (mailButton) mailButton.click();
  await sleep(40);
  // Briefkasten rendert jetzt interaktive Karten in #sbkim-rdv-cards (mit 🗑 +
  // „↗ App öffnen“ je Eintrag) statt reinem Text in der PRE.
  const cardsMail = stub.document.querySelector("#sbkim-rdv-cards");
  const mailTxt = txtOf(cardsMail);
  record("Briefkasten zeigt die nachgelesene Antwort (Eierschecke)", "ja",
    mailTxt.includes("Eierschecke") ? "ja" : "nein", mailTxt.slice(0, 120));
  record("Frager rief fetchAnswers mit der offenen qid", "ja",
    stub.SbkimRendezvous._calls.fetch.some((qs) => Array.isArray(qs) && qs.includes("q-brief-1")) ? "ja" : "nein",
    JSON.stringify(stub.SbkimRendezvous._calls.fetch));
  const stored2 = JSON.parse(_ls["sbkim_rdv_pending_default"] || "[]");
  record("offene Frage ist jetzt beantwortet + als gesehen markiert", "ja",
    stored2.some((e) => e.qid === "q-brief-1" && e.status === "beantwortet" && e.seen === true) ? "ja" : "nein",
    JSON.stringify(stored2));
  record("Zähler nach dem Lesen wieder ohne 📬 (nichts Ungelesenes)", "ja",
    bubble && !bubble.textContent.includes("📬") ? "ja" : "nein", bubble && bubble.textContent);

  // ── A12 Lebenszyklus: Ablauf · Auto-Aufräumen · 🔄 nochmal fragen · 🗑 leeren ──
  const KEY = "sbkim_rdv_pending_default";
  const lcBtns = []; (function collect(n) { for (const c of n.children) { if (c.tagName === "BUTTON") lcBtns.push(c); collect(c); } })(panel);
  const reAskButton = lcBtns.find((b) => b.textContent.includes("nochmal fragen"));
  const clearButton = lcBtns.find((b) => b.textContent.includes("leeren"));
  record("🔄-Knopf „offene nochmal fragen“ vorhanden", "ja", reAskButton ? "ja" : "nein", !!reAskButton);
  record("🗑-Knopf „leeren“ vorhanden", "ja", clearButton ? "ja" : "nein", !!clearButton);

  // Ablauf: eine alte offene Frage (ts=1) wird beim Aufräumen „abgelaufen".
  _ls[KEY] = JSON.stringify([{ qid: "q-old", toNodeId: "NODE-Z", toName: "Z", text: "alt", ts: 1, status: "offen", seen: true }]);
  if (mailButton) mailButton.click();
  await sleep(30);
  const afterExpire = JSON.parse(_ls[KEY] || "[]");
  record("alte offene Frage wird „abgelaufen“", "ja",
    afterExpire.some((e) => e.qid === "q-old" && e.status === "abgelaufen") ? "ja" : "nein", JSON.stringify(afterExpire));
  record("abgelaufene Frage zählt NICHT im 📬-Zähler", "ja",
    bubble && !bubble.textContent.includes("📬") ? "ja" : "nein", bubble && bubble.textContent);

  // 🔄 nochmal fragen: abgelaufene/offene Frage neu stellen (askNode).
  _ls[KEY] = JSON.stringify([{ qid: "q-old", toNodeId: "NODE-Z", toName: "Z", text: "alt", ts: 1, status: "offen", seen: true }]);
  stub.SbkimRendezvous._calls.ask.length = 0;
  stub.SbkimRendezvous._setAsk({ ok: false, pending: true, qid: "q-old-2", reason: "Noch keine Antwort." });
  if (reAskButton) reAskButton.click();
  await sleep(40);
  record("🔄 stellt die offene Frage erneut (askNode mit Ziel+Text)", "ja",
    stub.SbkimRendezvous._calls.ask.some((a) => a.text === "alt" && (a.card === "NODE-Z" || (a.card && a.card.nodeId === "NODE-Z"))) ? "ja" : "nein",
    JSON.stringify(stub.SbkimRendezvous._calls.ask));
  const afterReask = JSON.parse(_ls[KEY] || "[]");
  record("Eintrag nach 🔄 wieder offen mit frischer qid", "ja",
    afterReask.some((e) => e.text === "alt" && e.status === "offen" && e.qid === "q-old-2") ? "ja" : "nein", JSON.stringify(afterReask));

  // Auto-Aufräumen: beantwortet + gesehen → beim nächsten Aufräumen weg.
  _ls[KEY] = JSON.stringify([{ qid: "q-done", toName: "Z", text: "fertig", ts: Date.now(), status: "beantwortet", seen: true, answer: { results: [] } }]);
  if (mailButton) mailButton.click();
  await sleep(30);
  record("beantwortet+gesehen wird automatisch entfernt (erledigt → weg)", "ja",
    !JSON.parse(_ls[KEY] || "[]").some((e) => e.qid === "q-done") ? "ja" : "nein", _ls[KEY]);

  // 🗑 leeren.
  _ls[KEY] = JSON.stringify([{ qid: "x", toName: "Z", text: "y", ts: Date.now(), status: "offen", seen: true }]);
  if (clearButton) clearButton.click();
  await sleep(10);
  record("🗑 leeren macht den Briefkasten leer", "ja",
    JSON.parse(_ls[KEY] || "[]").length === 0 ? "ja" : "nein", _ls[KEY]);

  // ── B) Briefkasten entdoppeln + 🗑 je Eintrag + ↗ App öffnen (Klaus 2026-07-12) ──
  const DKEY = "sbkim_rdv_pending_default";
  _ls[DKEY] = "[]";
  // Karte MIT endpoint rendern, an die gefragt wird.
  stub.SbkimRendezvous._setDiscover([{ nodeId: "DUP-1", nodeName: "Mixarium", spore: { id: "DUP-1", endpoint: "https://example.org/mix/" }, ts: 500, ageSec: 5 }]);
  discoverButton.click();
  await sleep(20);
  const cardsDup = stub.document.querySelector("#sbkim-rdv-cards");
  const dupAskBtn = (function () { let f = null; (function w(n) { for (const c of n.children) { if (c.tagName === "BUTTON" && c.textContent.includes("gezielt fragen")) { f = c; return; } w(c); } })(cardsDup); return f; })();
  const qDup = stub.document.querySelector("#sbkim-rdv-q");
  if (qDup) qDup.value = "Erfrischungsgetränk";
  // Dieselbe Frage 3× stellen — jedes Mal NEUE qid (Timeout) → EIN Eintrag, tries=3.
  for (const qid of ["dq-1", "dq-2", "dq-3"]) {
    stub.SbkimRendezvous._setAsk({ ok: false, pending: true, qid, reason: "Noch keine Antwort." });
    if (dupAskBtn) dupAskBtn.click();
    await sleep(30);
  }
  const dupStored = JSON.parse(_ls[DKEY] || "[]").filter((e) => e.toName === "Mixarium");
  record("gleiche Frage 3× → nur EIN Briefkasten-Eintrag (entdoppelt)", "1", String(dupStored.length), dupStored.length === 1);
  record("Eintrag zählt die Versuche (tries=3)", "3", String(dupStored[0] && dupStored[0].tries), !!(dupStored[0] && dupStored[0].tries === 3));
  record("Eintrag trägt die neueste qid (dq-3)", "dq-3", dupStored[0] && dupStored[0].qid, !!(dupStored[0] && dupStored[0].qid === "dq-3"));
  record("Eintrag hat den endpoint der Karte gespeichert", "https://example.org/mix/", dupStored[0] && dupStored[0].endpoint, !!(dupStored[0] && dupStored[0].endpoint === "https://example.org/mix/"));

  // Briefkasten anzeigen → „↗ App öffnen“ je Eintrag (aus gespeichertem endpoint).
  if (mailButton) mailButton.click();
  await sleep(30);
  const cardsMail2 = stub.document.querySelector("#sbkim-rdv-cards");
  const mailLink = findLink(cardsMail2, "App öffnen");
  record("Briefkasten-Eintrag zeigt „↗ App öffnen“ (endpoint)", "ja", mailLink ? "ja" : "nein", !!mailLink);
  record("Briefkasten-Link zeigt auf den gespeicherten endpoint", "https://example.org/mix/", mailLink && mailLink.href, !!mailLink && mailLink.href === "https://example.org/mix/");

  // Zwei verschiedene Gruppen → 🗑 je Eintrag entfernt NUR diese eine Gruppe.
  _ls[DKEY] = JSON.stringify([
    { qid: "g-a", toName: "A", text: "frage a", ts: Date.now(), tries: 1, status: "offen", seen: true },
    { qid: "g-b", toName: "B", text: "frage b", ts: Date.now(), tries: 1, status: "offen", seen: true },
  ]);
  if (mailButton) mailButton.click();
  await sleep(20);
  const cardsDel = stub.document.querySelector("#sbkim-rdv-cards");
  const trashBtns = [];
  (function collect(n) { for (const c of n.children) { if (c.tagName === "BUTTON" && (c.textContent || "").includes("🗑")) trashBtns.push(c); collect(c); } })(cardsDel);
  record("je Eintrag ein 🗑-Knopf (2 Gruppen → 2 Knöpfe)", "2", String(trashBtns.length), trashBtns.length === 2);
  if (trashBtns[0]) trashBtns[0].click();
  await sleep(20);
  const afterDel = JSON.parse(_ls[DKEY] || "[]");
  record("🗑 je Eintrag entfernt NUR diese Gruppe (a weg, b bleibt)", "ja",
    (!afterDel.some((e) => e.qid === "g-a") && afterDel.some((e) => e.qid === "g-b")) ? "ja" : "nein", _ls[DKEY]);
  _ls[DKEY] = "[]";

  // ---- A11: „🔎 Antwort holen" — Auto-Knoten-Auswahl nach Frage-Passung ----
  const allButtons = [];
  (function collect(n) { if (n.tagName === "BUTTON") allButtons.push(n); for (const c of n.children) collect(c); })(stub.document.body);
  const fetchBtn = allButtons.find((b) => (b.textContent || "").includes("Antwort holen"));
  record("Antwort-holen-Knopf vorhanden", "ja", fetchBtn ? "ja" : "nein", !!fetchBtn);

  // Zwei Knoten im Raum, Rezeptbuch besser passend (_fit höher) als Sage.
  stub.SbkimRendezvous._setDiscover([
    { nodeId: "S-1", nodeName: "Sage", ageSec: 5, spore: { domainVector: [1, 0, 0] }, _fit: 0.10 },
    { nodeId: "R-1", nodeName: "Rezeptbuch", ageSec: 5, spore: { domainVector: [0, 1, 0] }, _fit: 0.80 },
  ]);
  stub.SbkimRendezvous._setAsk({ ok: true, results: [{ label: "Kuchen", score: 0.9 }] });
  const qInputA11 = stub.document.querySelector("#sbkim-rdv-q");
  if (qInputA11) qInputA11.value = "etwas Süßes zum Kaffee";
  const askBefore = stub.SbkimRendezvous._calls.ask.length;
  if (fetchBtn) fetchBtn.click();
  await sleep(20);
  record("Auto-Ask bettet die Frage ein + rankt", "≥1 rank", String(stub.SbkimRendezvous._calls.rank || 0),
    (stub.SbkimRendezvous._calls.rank || 0) >= 1);
  const lastAsk = stub.SbkimRendezvous._calls.ask[stub.SbkimRendezvous._calls.ask.length - 1];
  record("fragt AUTOMATISCH den bestpassenden Knoten (Rezeptbuch)", "R-1",
    lastAsk && lastAsk.card && lastAsk.card.nodeId, lastAsk && lastAsk.card && lastAsk.card.nodeId === "R-1");
  const cardsA11 = stub.document.querySelector("#sbkim-rdv-cards");
  record("Karten nach Passung sortiert angezeigt (Überschrift)", "ja",
    txtOf(cardsA11).includes("Passung") ? "ja" : "nein", txtOf(cardsA11).includes("Passung"));
  record("Frage-Passung-Badge sichtbar", "ja",
    txtOf(cardsA11).includes("Frage-Passung") ? "ja" : "nein", txtOf(cardsA11).includes("Frage-Passung"));
  record("mindestens eine Frage abgesetzt", "true", String(stub.SbkimRendezvous._calls.ask.length > askBefore),
    stub.SbkimRendezvous._calls.ask.length > askBefore);

  // Nächstbester-Nachfass: bester Knoten stumm → nächstbester wird gefragt.
  stub.SbkimRendezvous._setAsk({ ok: false, pending: true, qid: "q-x", reason: "Noch keine Antwort." });
  const asksBeforeFallback = stub.SbkimRendezvous._calls.ask.length;
  if (qInputA11) qInputA11.value = "noch eine Frage";
  if (fetchBtn) fetchBtn.click();
  await sleep(30);
  const askedIds = stub.SbkimRendezvous._calls.ask.slice(asksBeforeFallback).map((a) => a.card && a.card.nodeId);
  record("stummer Bester → Nächstbester wird auch gefragt", "R-1 und S-1",
    askedIds.join(","), askedIds.includes("R-1") && askedIds.includes("S-1"));

  // Last-Schoner: Doppelklick stapelt NICHT (nur EINE Raum-Suche).
  stub.SbkimRendezvous._setDiscover([{ nodeId: "R-1", nodeName: "Rezeptbuch", ageSec: 5, spore: { domainVector: [0, 1, 0] }, _fit: 0.8 }]);
  stub.SbkimRendezvous._setAsk({ ok: true, tookMs: 1000, results: [{ label: "X", score: 0.8 }] });
  if (qInputA11) qInputA11.value = "last-schoner einmalig test";
  const discBefore = stub.SbkimRendezvous._calls.discover;
  if (fetchBtn) { fetchBtn.click(); fetchBtn.click(); }   // zwei Klicks sofort hintereinander
  await sleep(40);
  record("Doppelklick löst nur EINE Raum-Suche aus (Last-Schoner)", "1",
    String(stub.SbkimRendezvous._calls.discover - discBefore), (stub.SbkimRendezvous._calls.discover - discBefore) === 1);

  // ---- KI-Richter über Cross-Knoten-Antwort (B3-Fix: Titel-als-Text) ----
  // Regress: Antwort-Items tragen nur label (keine text) — der Richter darf NICHT
  // mit „candidates[0].text muss nicht-leerer String sein" scheitern.
  let richterCands = null;
  stub.SbkimMatch = {
    hybridMatch: async (q, cands) => {
      richterCands = cands;
      return { available: true, provider: "claude", region: "us",
        verdicts: cands.map((c, i) => ({ label: c.label, score: 0.9 - i * 0.1, passt: true, begruendung: "" })) };
    },
    _meta: { hybridProviders: [{ id: "claude", label: "Claude", region: "us" }] },
  };
  UI._test.setKi({ on: true, key: "sk-test", provider: "claude" });
  UI._test.renderAnswer({ nodeName: "Rezeptbuch" },
    { ok: true, tookMs: 3000, results: [{ label: "Melya", score: 0.81 }, { label: "", score: 0.4 }] }, "erfrischend ohne Alkohol");
  await sleep(40);
  const kiOut = UI._test.outText() || "";
  record("KI-Richter über Antwort: KEIN candidates.text-Fehler", "kein Fehler",
    /KI-Richter-Fehler/.test(kiOut) ? "Fehler!" : "ok", !/KI-Richter-Fehler/.test(kiOut));
  record("Richter-Kandidaten tragen Titel als text", "ja",
    (richterCands && richterCands.length && richterCands.every((c) => c.text && c.text.length)) ? "ja" : "nein",
    !!(richterCands && richterCands.length && richterCands.every((c) => c.text && c.text.length)));
  record("leerer Titel herausgefiltert (nur 1 Kandidat)", "1",
    richterCands ? String(richterCands.length) : "0", !!(richterCands && richterCands.length === 1));
  UI._test.setKi({ on: false, key: "" });

  // fail-soft: ohne Modul 23.
  const savedRdv = stub.SbkimRendezvous;
  stub.SbkimRendezvous = null;
  let threw = false;
  try { connectButton.click(); await sleep(10); } catch (e) { threw = true; }
  record("ohne Modul 23: kein Throw", "kein Throw", threw ? "geworfen!" : "kein Throw", threw === false);
  record("_meta.hasRendezvous false ohne Modul 23", "false", String(UI._meta.hasRendezvous), UI._meta.hasRendezvous === false);
  stub.SbkimRendezvous = savedRdv;

  let pass = 0, fail = 0;
  for (const r of results) {
    if (r.ok) pass++; else fail++;
    console.log(`${r.ok ? "✓" : "✗"} ${r.probe}`);
    if (!r.ok) { console.log(`   erwartet: ${r.exp}`); console.log(`   erhalten: ${r.act}`); }
  }
  console.log(`\nSumme: ${pass} grün, ${fail} rot · ${pass + fail} insgesamt`);
  process.exit(fail > 0 ? 1 : 0);
}
run().catch((e) => { console.error("Smoke gescheitert:", e); process.exit(1); });
