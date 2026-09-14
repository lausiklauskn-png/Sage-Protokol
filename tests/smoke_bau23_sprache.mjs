/* Modul 23 UI — Sprache (Klaus 2026-09-14).
 *   node tests/smoke_bau23_sprache.mjs
 *
 * WARUM ES DIESE PROBE GIBT. Klaus' Apps haben einen DE/EN-Schalter, dieses
 * Fenster hatte keinen: wer die Seite auf Englisch stellte, bekam mitten in
 * einer englischen Seite ein deutsches Verbinden-Fenster. Gemessen am
 * 2026-09-14 an family-projekt.de: 164 deutsche Texte in drei Modulen, und
 * dieses hier trug den Löwenanteil.
 *
 * Das Modul liegt byte-1:1 in sechzehn Apps. Daraus folgt die wichtigste
 * Zusicherung dieser Probe: OHNE EINSTELLUNG ÄNDERT SICH NICHTS. Wer nichts
 * tut, bekommt Deutsch wie bisher.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATEI = resolve(wurzel, "src/modules/23_rendezvous_ui.js");
const src = readFileSync(DATEI, "utf8");
let pass = 0, fail = 0;
const ok = (b, m, d = "") => { if (b) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m, d ? "— " + d : ""); } };

console.log("Modul 23 UI — Sprache");

/* ── 1. Das Wörterbuch gegen den Code, in BEIDE Richtungen ────────────────
 *
 * Der Preis des schlüssellosen Ansatzes (der deutsche Satz IST der Schlüssel)
 * ist, dass eine Textänderung die Übersetzung still auf Deutsch zurückfallen
 * lässt. Genau davor steht dieser Wächter — ohne ihn wäre das Wörterbuch eine
 * Sammlung von Sätzen, die niemand mehr sieht.
 */
const a = src.indexOf("var TEXTE = { en: {");
const e = src.indexOf("\n  } };", a);
ok(a > 0 && e > a, "das Wörterbuch steht im Modul");
const block = src.slice(a, e);
const rest = src.slice(0, a) + src.slice(e);
const schluessel = [...block.matchAll(/^ {6}"((?:[^"\\]|\\.)*)":$/gm)].map((m) => m[1]);
const benutzt = [...new Set([...rest.matchAll(/T\("((?:[^"\\]|\\.)*)"\)/g)].map((m) => m[1]))];

ok(schluessel.length > 150, `das Wörterbuch ist gefüllt (${schluessel.length} Einträge)`);
const tot = schluessel.filter((k) => !rest.includes('T("' + k + '")'));
ok(tot.length === 0,
   `jeder Eintrag hat eine Fundstelle im Code (${tot.length} tot)`,
   tot.slice(0, 2).map((k) => k.slice(0, 50)).join(" | "));
const ohne = benutzt.filter((k) => !schluessel.includes(k));
ok(ohne.length === 0,
   `jeder T()-Aufruf hat eine englische Fassung (${ohne.length} ohne)`,
   ohne.slice(0, 2).map((k) => k.slice(0, 50)).join(" | "));
// Und die Gegenrichtung zur Gegenrichtung: eine Übersetzung, die wortgleich
// mit dem Deutschen ist, ist keine.
const gleich = schluessel.filter((k) => {
  const m = block.match(new RegExp('"' + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '":\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"'));
  return m && m[1] === k && /[äöüß]|\b(der|die|das|und|nicht|ist)\b/i.test(k);
});
ok(gleich.length === 0, `keine „Übersetzung“ ist nur eine Kopie des Deutschen (${gleich.length})`,
   gleich.slice(0, 2).join(" | "));

/* ── 2. Zur Laufzeit: was ein Nutzer wirklich sieht ───────────────────────── */
function stubBauen(htmlLang) {
  const mk = (tag) => {
    const el = {
      tagName: String(tag).toUpperCase(), nodeType: 1, id: "", textContent: "", title: "",
      type: "", value: "", placeholder: "", className: "", children: [], parentNode: null,
      style: { setProperty() {}, removeProperty() {} }, dataset: {},
      appendChild(c) { c.parentNode = el; el.children.push(c); return c; },
      removeChild(c) { el.children = el.children.filter((x) => x !== c); return c; },
      insertBefore(c) { return el.appendChild(c); },
      setAttribute(k, v) { if (k === "title") el.title = v; el["_" + k] = v; },
      getAttribute(k) { return k === "title" ? el.title : (el["_" + k] ?? null); },
      addEventListener() {}, removeEventListener() {}, remove() {}, focus() {}, click() {},
      querySelector() { return null; }, querySelectorAll() { return []; },
      getBoundingClientRect() { return { top: 0, left: 0, width: 100, height: 40, bottom: 40, right: 100 }; },
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    };
    return el;
  };
  const body = mk("body");
  const doc = {
    readyState: "complete",
    documentElement: Object.assign(mk("html"), { lang: htmlLang }),
    body, head: mk("head"),
    createElement: mk, createTextNode: (t) => ({ nodeType: 3, textContent: t }),
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {},
  };
  const g = { document: doc, console };
  g.addEventListener = () => {}; g.removeEventListener = () => {}; g.dispatchEvent = () => true;
  const ls = {};
  g.localStorage = { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: (k) => { delete ls[k]; } };
  new Function("window", "globalThis", "console", "document", src)(g, g, console, doc);
  return g;
}

/* Alle Texte im gemounteten Baum einsammeln — gemessen wird, was DASTEHT,
 * nicht was eine Brücke behauptet. */
function texte(el, aus = []) {
  if (!el) return aus;
  if (el.textContent) aus.push(String(el.textContent));
  if (el.title) aus.push(String(el.title));
  if (el.placeholder) aus.push(String(el.placeholder));
  (el.children || []).forEach((c) => texte(c, aus));
  return aus;
}

{
  // OHNE alles: Deutsch wie bisher. Das ist die Zusicherung, an der sechzehn
  // Apps hängen — keine darf von dieser Änderung etwas merken.
  const g = stubBauen("");
  await g.SbkimRendezvousUI.init({ nodeName: "Probe" });
  g.SbkimRendezvousUI.show();
  const t = texte(g.document.body).join(" | ");
  ok(g.SbkimRendezvousUI._meta.lang === "de", "ohne Angabe: Deutsch", g.SbkimRendezvousUI._meta.lang);
  ok(/Mit dem Knotennetz verbinden/.test(t), "…und der Text steht auf Deutsch da");
  ok(!/Connect to the node network/.test(t), "…und nichts ist englisch");
}
{
  // init({lang:"en"}) — die App sagt es ausdrücklich.
  const g = stubBauen("");
  await g.SbkimRendezvousUI.init({ nodeName: "Probe", lang: "en" });
  g.SbkimRendezvousUI.show();
  const t = texte(g.document.body).join(" | ");
  ok(g.SbkimRendezvousUI._meta.lang === "en", "init({lang:'en'}) wirkt");
  ok(/Connect to the node network/.test(t), "…und der Text steht auf Englisch da");
  ok(!/Mit dem Knotennetz verbinden/.test(t), "…und nichts ist mehr deutsch");
}
{
  /* <html lang="en"> allein reicht — ohne dass der App-Klebstoff etwas tut.
   * Das ist der Fall, der in der Praxis zählt: die Apps setzen `lang` beim
   * Sprachwechsel ohnehin. Müsste jede von ihnen erst `init({lang})`
   * nachrüsten, bliebe das Fenster in sechzehn Apps deutsch. */
  const g = stubBauen("en");
  await g.SbkimRendezvousUI.init({ nodeName: "Probe" });
  g.SbkimRendezvousUI.show();
  const t = texte(g.document.body).join(" | ");
  ok(g.SbkimRendezvousUI._meta.lang === "en", "<html lang='en'> allein genügt");
  ok(/Connect to the node network/.test(t), "…und der Text folgt ihm");
}
{
  // init({lang}) schlägt <html lang> — eine ausdrückliche Angabe gewinnt.
  const g = stubBauen("en");
  await g.SbkimRendezvousUI.init({ nodeName: "Probe", lang: "de" });
  ok(g.SbkimRendezvousUI._meta.lang === "de", "init({lang}) schlägt <html lang>");
}
{
  // Fail-soft: ein Satz ohne Eintrag bleibt deutsch statt zu verschwinden.
  const g = stubBauen("en");
  await g.SbkimRendezvousUI.init({ nodeName: "Probe", lang: "en" });
  const t = texte(g.document.body).join(" | ");
  ok(!/undefined|\[object/.test(t), "kein „undefined“ im Fenster — fehlende Einträge fallen auf Deutsch zurück", t.slice(0, 80));
}

console.log(`\nErgebnis: ${pass} bestanden, ${fail} fehlgeschlagen`);
process.exit(fail ? 1 : 0);
