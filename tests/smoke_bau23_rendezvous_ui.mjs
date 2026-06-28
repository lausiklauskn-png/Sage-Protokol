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
  const calls = { configure: [], announce: 0, connect: 0, discover: 0, handshake: [] };
  let discoverCards = [];
  let connectImpl = async () => ({ ok: true, created: false, nodeId: "OWN" });
  return {
    configure(o) { calls.configure.push(o); },
    announce: async () => { calls.announce++; return { ok: true, nodeId: "OWN" }; },
    connectAndAnnounce: async (o) => { calls.connect++; calls._lastConnectOpts = o; return connectImpl(o); },
    discover: async () => { calls.discover++; return { ok: true, cards: discoverCards }; },
    handshakeCard: async (card) => { calls.handshake.push(card); return { outcome: "established", score: 0.9 }; },
    _calls: calls,
    _setDiscover(cards) { discoverCards = cards; },
    _setConnect(fn) { connectImpl = fn; },
  };
}

const stub = {};
stub.document = makeDoc();
stub.console = console;
stub.SbkimRendezvous = makeMockRdv();

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

  // 🌐 Mit dem Netz verbinden → connectAndAnnounce mit createIdentity.
  const connectBtn = panel.querySelector("#sbkim-rdv-cards") ? null : null; // placeholder
  // Knöpfe sind die ersten Buttons in der Zeile; finde über Reihenfolge.
  // (Stub-querySelector findet per Tag/ID; wir klicken die bekannten Handler über die row.)
  // Einfacher: rufe die internen Pfade über die gemounteten Buttons im Panel.
  const buttons = [];
  (function collect(n) { for (const c of n.children) { if (c.tagName === "BUTTON") buttons.push(c); collect(c); } })(panel);
  // buttons: [close ✕, 🌐 connect, 👥 discover, 📌 announce]
  const connectButton = buttons.find((b) => b.textContent.includes("Mit dem Netz verbinden"));
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
