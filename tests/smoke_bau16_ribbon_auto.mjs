#!/usr/bin/env node
/*
 * Smoke — Modul 16 Siegel: Band bleibt OFFEN ohne ribbonText (KEIN Auto-Label).
 *
 * Klaus-Entscheidung 2026-06-20: lieber den Band-Text offen lassen als einen
 * Repo-Slug vorauszufüllen (ein Vermerk reicht). Selbst wenn die location auf
 * einen Repo-Pfad zeigt, darf OHNE init({ribbonText}) KEIN Name ins Band
 * geraten — das Band bleibt leer, und kein mitkopiertes Fremd-Label erscheint.
 *
 * Aufruf:  node tests/smoke_bau16_ribbon_auto.mjs   ·   Exit 0 = grün.
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

function makeEl(tag) {
  return {
    tagName: tag, id: "", innerHTML: "", firstChild: null,
    children: [], parentNode: null, attributes: {}, style: {},
    classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, contains(c) { return this._s.has(c); } },
    setAttribute(k, v) { this.attributes[k] = String(v); if (k === "id") this.id = String(v); },
    getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; },
    removeAttribute(k) { delete this.attributes[k]; },
    appendChild(c) { this.children.push(c); c.parentNode = this; this.firstChild = this.children[0]; return c; },
    addEventListener() {}, removeEventListener() {}, querySelector() { return null; }, focus() {},
  };
}
const lamps = makeEl("div");
const body = makeEl("body");
globalThis.document = {
  body, createElement: (t) => makeEl(t),
  querySelector: (sel) => (sel === ".lamps" ? lamps : null),
  getElementById: () => null, addEventListener() {},
};
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.MutationObserver = class { observe() {} disconnect() {} };
// location zeigt bewusst auf einen Repo-Pfad — früher hätte das ein Auto-Label
// "MEIN-REZEPTBUCH" erzeugt. Jetzt darf NICHTS geraten werden.
globalThis.location = {
  origin: "https://lausiklauskn-png.github.io",
  pathname: "/Mein-Rezeptbuch/",
  href: "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/",
};
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
  await SbkimSiegel.init({});   // KEIN ribbonText, location hat Repo-Pfad

  ok(SbkimSiegel._meta.ribbonText === "", "_meta.ribbonText = '' (offen, KEIN Auto-Label trotz Repo-Pfad)");
  const html = lamps.children.length ? lamps.children[0].innerHTML : "";
  ok(html.indexOf(">MEIN-REZEPTBUCH</textPath>") === -1, "kein geratenes MEIN-REZEPTBUCH im Band");
  ok(html.indexOf(">SAGE OBSERVATORIUM</textPath>") === -1, "kein Fremd-Label SAGE OBSERVATORIUM im Band");
  ok(html.indexOf('href="#ribbonText" startOffset="50%" text-anchor="middle"></textPath>') !== -1
     || html.indexOf("></textPath>") !== -1, "Band-textPath ist leer (offen)");
  ok(html.indexOf("SBKIM") !== -1, "Wappen-Grundtext (SBKIM) intakt");

  console.log("\n  " + pass + "/" + (pass + fail) + " grün" + (fail ? " — " + fail + " FEHLER" : ""));
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
