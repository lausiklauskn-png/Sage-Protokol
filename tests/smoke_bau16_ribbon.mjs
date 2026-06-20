#!/usr/bin/env node
/*
 * Smoke — Modul 16 Siegel: konfigurierbarer Band-Text (ribbonText).
 *
 * Befund 2026-06-19: Rezeptbuch/Mixarium trugen statisch "MEIN-TRESOR"
 * im Siegel-Band, weil die SVG-Datei kopiert + nie angepasst wurde.
 * Design-Fix: init({ribbonText}) setzt das Band zur Render-Zeit, Default
 * bleibt "SAGE OBSERVATORIUM" (für Sage byte-identisch).
 *
 * Headless mit minimalem DOM-Stub, damit der echte Render-Pfad
 * (buildBadgeElement → renderWappenSvg) läuft.
 *
 * Aufruf:  node tests/smoke_bau16_ribbon.mjs
 * Exit:    0 = alle grün, 1 = Fehler.
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

// ---- minimaler DOM-Stub ----
function makeEl(tag) {
  return {
    tagName: tag, id: "", innerHTML: "", firstChild: null,
    children: [], parentNode: null, attributes: {}, style: {},
    classList: { _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); } },
    setAttribute(k, v) { this.attributes[k] = String(v); if (k === "id") this.id = String(v); },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    removeAttribute(k) { delete this.attributes[k]; },
    appendChild(c) { this.children.push(c); c.parentNode = this; this.firstChild = this.children[0]; return c; },
    addEventListener() {}, removeEventListener() {},
    querySelector() { return null; },
    focus() {},
  };
}

const lamps = makeEl("div");
const body = makeEl("body");
const documentStub = {
  body,
  createElement: (t) => makeEl(t),
  querySelector: (sel) => (sel === ".lamps" ? lamps : null),
  getElementById: () => null,
  addEventListener() {},
};

globalThis.document = documentStub;
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.location = { pathname: "/", href: "https://example.test/" };

// 7 Pflicht-Module stubben, damit deriveCertified() certified => true.
globalThis.SbkimStorage    = { init() {} };
globalThis.SbkimSpore      = { getOwnSpore() { return {}; } };
globalThis.SbkimEmbedding  = { embedPassage() {} };
globalThis.SbkimMatch      = { match() {} };
globalThis.SbkimAnastomose = { handshake() {} };
globalThis.SbkimApoptose   = { prepareSelfApoptose() {} };
globalThis.SbkimMembrane   = { init() {} };

const require = createRequire(import.meta.url);
require(resolve(repoRoot, "src/modules/16_siegel.js"));
const SbkimSiegel = globalThis.SbkimSiegel;

async function main() {
  ok(!!SbkimSiegel, "Modul 16 geladen");
  ok(SbkimSiegel._meta.ribbonText === "", "Default: Band offen (leer), kein Auto-Label");

  await SbkimSiegel.init({ ribbonText: "MEIN-REZEPTBUCH" });

  ok(SbkimSiegel.isCertified() === true, "certified (7 Pflicht-Module gestubbt)");
  ok(SbkimSiegel._meta.ribbonText === "MEIN-REZEPTBUCH", "_meta.ribbonText übernommen");
  ok(SbkimSiegel._meta.badgeMounted === true, "Badge gemountet");

  const html = lamps.children.length ? lamps.children[0].innerHTML : "";
  ok(html.indexOf(">MEIN-REZEPTBUCH</textPath>") !== -1, "Band zeigt MEIN-REZEPTBUCH");
  ok(html.indexOf(">SAGE OBSERVATORIUM</textPath>") === -1, "altes Band SAGE OBSERVATORIUM ersetzt");
  ok(html.indexOf("SBKIM") !== -1 && html.indexOf("OFFIZIELLE BEST") !== -1, "Wappen-Grundtext intakt");

  // Idempotenz: zweiter init() ändert nichts (ready-Guard).
  await SbkimSiegel.init({ ribbonText: "ÜBERSCHRIEBEN?" });
  ok(SbkimSiegel._meta.ribbonText === "MEIN-REZEPTBUCH", "init idempotent (ribbonText bleibt)");

  console.log("\n  " + pass + "/" + (pass + fail) + " grün" + (fail ? " — " + fail + " FEHLER" : ""));
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
