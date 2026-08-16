#!/usr/bin/env node
/*
 * Smoke — Modul 16 Siegel: optionaler Andock-Knopf (opt-in, Modul 18).
 *
 * Klaus 2026-06-19: separates Andocken als ZUSÄTZLICHE Option im Siegel,
 * KI-unabhängiger Handshake (Repo-URL → Spore → verify → match → handshake).
 * Umsetzung: init({andockTool:true}) hängt einen Knopf ins Modal, der
 * SbkimToolPwa.openAndockTab() (Modul 18) öffnet. Fail-soft wenn Modul 18
 * fehlt. Der „🔑"-Identitäts-Pfad bleibt unberührt.
 *
 * Aufruf:  node tests/smoke_bau16_andock.mjs   ·   Exit 0 = grün.
 */

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  ok   " + name); }
  else { fail++; console.log("  FAIL " + name); }
}

// ---- DOM-Stub mit Attribut-querySelector + Event-Trigger ----
function matchesSel(el, sel) {
  if (sel[0] === "[") { const n = sel.slice(1, -1).split("=")[0]; return n in el.attributes; }
  if (sel[0] === "#") return el.id === sel.slice(1);
  return el.tagName === sel;
}
function qsDeep(el, sel) {
  for (const c of el.children) {
    if (matchesSel(c, sel)) return c;
    const r = qsDeep(c, sel);
    if (r) return r;
  }
  return null;
}
function makeEl(tag) {
  return {
    tagName: tag, id: "", innerHTML: "", firstChild: null,
    children: [], parentNode: null, attributes: {}, style: {}, listeners: {},
    classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, contains(c) { return this._s.has(c); } },
    setAttribute(k, v) { this.attributes[k] = String(v); if (k === "id") this.id = String(v); },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    removeAttribute(k) { delete this.attributes[k]; },
    appendChild(c) { this.children.push(c); c.parentNode = this; this.firstChild = this.children[0]; return c; },
    addEventListener(t, fn) { (this.listeners[t] = this.listeners[t] || []).push(fn); },
    removeEventListener() {},
    _emit(t) { (this.listeners[t] || []).forEach((fn) => fn({ preventDefault() {}, stopPropagation() {} })); },
    querySelector(sel) { return qsDeep(this, sel); },
    focus() {}, createTextNode() {},
  };
}

const lamps = makeEl("div");
const body = makeEl("body");
const documentStub = {
  body,
  createElement: (t) => makeEl(t),
  createTextNode: (t) => ({ _text: String(t) }),
  querySelector: (sel) => (sel === ".lamps" ? lamps : qsDeep(body, sel)),
  getElementById: () => null,
  addEventListener() {},
};

globalThis.document = documentStub;
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.location = { pathname: "/", href: "https://example.test/" };
globalThis.SbkimStorage    = { init() {} };
globalThis.SbkimSpore      = { getOwnSpore() { return {}; } };
globalThis.SbkimEmbedding  = { embedPassage() {} };
globalThis.SbkimMatch      = { match() {} };
globalThis.SbkimAnastomose = { handshake() {} };
// 05b seit 2026-08-16 achtes Pflicht-Modul (Kanon 16_siegel.js): ohne
// Relais-Client kein Raum — geprueft wird die Flaeche subscribe.
globalThis.SbkimNostrRelay = { subscribe() { return function () {}; } };
globalThis.SbkimApoptose   = { prepareSelfApoptose() {} };
globalThis.SbkimMembrane   = { init() {} };
// Modul 18 ABSICHTLICH erst NICHT vorhanden (Fail-soft-Probe).

const require = createRequire(import.meta.url);
require(resolve(repoRoot, "src/modules/16_siegel.js"));
const SbkimSiegel = globalThis.SbkimSiegel;

async function main() {
  await SbkimSiegel.init({ andockTool: true });
  ok(SbkimSiegel._meta.andockToolEnabled === true, "_meta.andockToolEnabled = true (opt-in)");

  // Modal-Root = body.children[0]
  const modal = body.children[0] || null;
  const btn = modal && modal.querySelector("[data-siegel-andock-tool-btn]");
  const hint = modal && modal.querySelector("[data-siegel-andock-tool-hint]");
  ok(!!btn, "Andock-Knopf im Modal vorhanden ([data-siegel-andock-tool-btn])");
  ok(!!hint, "Hinweis-Element vorhanden");
  // Der alte/entfernte Andock-Pfad-Selektor bleibt leer (Sub-(e)-Kompat).
  ok(!modal.querySelector("[data-siegel-andock-btn]"), "kein altes [data-siegel-andock-btn] (Sub-(e)-Tests unberührt)");

  // Fail-soft: Modul 18 fehlt → Klick zeigt Hinweis, kein Throw.
  let threw = false;
  try { btn._emit("click"); } catch { threw = true; }
  ok(!threw, "Klick ohne Modul 18 wirft nicht");
  ok(hint.style.display === "block" && /Modul 18/.test(hint.textContent), "Fail-soft-Hinweis: Modul 18 nicht geladen");

  // Jetzt Modul 18 stubben → Klick ruft openAndockTab, Hinweis verschwindet.
  let called = false;
  globalThis.SbkimToolPwa = { openAndockTab() { called = true; return Promise.resolve(); } };
  btn._emit("click");
  ok(called === true, "Klick mit Modul 18 ruft SbkimToolPwa.openAndockTab()");
  ok(hint.style.display === "none", "Hinweis ausgeblendet, wenn Modul 18 da");

  // 🔑-Pfad unberührt: Modul rendert weiter Wappen/Modal normal.
  ok(SbkimSiegel.isCertified() === true, "isCertified weiterhin true (🔑-Pfad unberührt)");

  console.log("\n  " + pass + "/" + (pass + fail) + " grün" + (fail ? " — " + fail + " FEHLER" : ""));
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
