/* Modul 16 (Siegel) + Modul 17 (Lampen) — Sprache (Klaus 2026-09-14).
 *   node tests/smoke_bau1617_sprache.mjs
 *
 * WARUM ES DIESE PROBE GIBT. Am 2026-09-14 lief der Sprach-Haken für Modul 23
 * UI netzweit aus. Klaus' Seite stand danach auf Englisch — und das
 * Verbinden-Fenster folgte, die Lampen-Leiste darüber nicht: „lebt · verkehr ·
 * fremd · siegel", und dahinter ein vollständig deutsches Siegel-Modal. Ein
 * Voll-Knoten war damit gemischtsprachig.
 *
 * Die Lampen-Leiste ist dabei die sichtbarste deutsche Stelle des ganzen
 * Netzes: sie steht auf JEDER Seite dauerhaft da, noch bevor jemand ein
 * Fenster öffnet.
 *
 * Beide Module liegen byte-1:1 in neunzehn Apps. Daraus folgt die wichtigste
 * Zusicherung dieser Probe: OHNE EINSTELLUNG ÄNDERT SICH NICHTS. Wer nichts
 * tut, bekommt Deutsch wie bisher.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const ok = (b, m, d = "") => { if (b) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m, d ? "— " + d : ""); } };

/* Blockkommentare und Zeilenkommentare heraus — grob, aber für diesen Zweck
 * genau genug: gemessen wird, was das Modul TUT, nicht was daneben steht. */
function ohneKommentare(txt) {
  return txt
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .split("\n")
    .map((z) => {
      const i = z.search(/(^|[^:"'\\])\/\//);
      return i >= 0 ? z.slice(0, i + 1) : z;
    })
    .join("\n");
}

const MODULE = [
  { nr: "16", datei: "src/modules/16_siegel.js",          global: "SbkimSiegel" },
  { nr: "17", datei: "src/modules/17_floating_widget.js", global: "SbkimWidget" },
];

/* ══ 1. Das Wörterbuch gegen den Code, in BEIDE Richtungen ═══════════════
 *
 * Der Preis des schlüssellosen Ansatzes (der deutsche Satz IST der Schlüssel)
 * ist, dass eine Textänderung die Übersetzung still auf Deutsch zurückfallen
 * lässt. Genau davor steht dieser Wächter.
 *
 * ⚠ ZWEI ARTEN, WIE EIN SCHLÜSSEL LEBT — und die zweite kam mit Modul 16
 * dazu. Bei 23 stand jeder Satz als Literal im Aufruf: T("…"). Modul 16
 * übersetzt zusätzlich DATEN an der Anzeige-Stelle — T(a.aspect),
 * T(a.description), T(m.name), T(statusLabel(…)), T(MODAL_TITLE). Deren
 * deutscher Wortlaut steht anderswo in der Datei (ZERTIFIKAT_ASPEKTE,
 * PFLICHT_MODULE, Konstanten), nicht im Aufruf.
 *
 * Ein Wächter, der nur T("…") sucht, hielte diese 30 Einträge für tot und
 * verböte damit genau die richtige Bauart. Er zählt einen Schlüssel deshalb
 * als lebendig, wenn sein deutscher Wortlaut IRGENDWO ausserhalb des
 * Wörterbuchs in der Datei vorkommt. Das fängt weiterhin den Fall, um den es
 * geht: wer den deutschen Satz ändert, verliert seine Fundstelle.
 */
for (const mod of MODULE) {
  console.log(`\nModul ${mod.nr} — Wörterbuch`);
  const src = readFileSync(resolve(wurzel, mod.datei), "utf8");
  const a = src.indexOf("var TEXTE = { en: {");
  const e = src.indexOf("\n  } };", a);
  ok(a > 0 && e > a, "das Wörterbuch steht im Modul");
  if (!(a > 0 && e > a)) continue;
  const block = src.slice(a, e);
  /* ⚠ OHNE KOMMENTARE. Der Erklär-Block über dem Wörterbuch zeigt selbst ein
   * `T("…")` als Beispiel — und der Wächter hat es beim ersten Lauf prompt
   * als T()-Aufruf ohne englische Fassung gemeldet. Ein Wächter, der im
   * Erklär-Kommentar fündig wird, misst nichts: er nagelt Prosa fest statt
   * Code. Dieselbe Falle wie in Kimhub, nur an einer anderen Tür. */
  const rest = ohneKommentare(src.slice(0, a) + src.slice(e));

  /* Zwei Schreibweisen im Wörterbuch, und beide sind gewollt: kurze Paare
   * stehen auf EINER Zeile ("lebt": "alive",), lange auf zweien. Ein Muster,
   * das nur eine davon liest, meldet die andere als unlesbar — und zählt sie
   * dann auch nicht als Schlüssel. Beim ersten Lauf waren das 15 Einträge,
   * die stumm aus beiden Richtungen fielen. */
  const eintraege = [...block.matchAll(/^ {6}"((?:[^"\\]|\\.)*)":/gm)].length;
  const paare = [...block.matchAll(/^ {6}"((?:[^"\\]|\\.)*)":[ \t]*\n?[ \t]*"((?:[^"\\]|\\.)*)",$/gm)];
  const schluessel = paare.map((m) => m[1]);
  ok(schluessel.length > (mod.nr === "16" ? 40 : 20),
     `das Wörterbuch ist gefüllt (${schluessel.length} Einträge)`);
  ok(paare.length === eintraege,
     `jeder Eintrag ist als Paar lesbar (${paare.length} von ${eintraege})`);

  /* Richtung A: kein toter Schlüssel. */
  const roh = (k) => k.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  const tot = schluessel.filter((k) => !rest.includes(k) && !rest.includes(roh(k)));
  ok(tot.length === 0,
     `jeder Eintrag hat eine Fundstelle im Code (${tot.length} tot)`,
     tot.slice(0, 2).map((k) => k.slice(0, 55)).join(" | "));

  /* Richtung B: kein T()-Literal ohne englische Fassung. */
  const benutzt = [...new Set([...rest.matchAll(/T\("((?:[^"\\]|\\.)*)"\)/g)].map((m) => m[1]))];
  const ohne = benutzt.filter((k) => !schluessel.includes(k));
  ok(ohne.length === 0,
     `jeder T()-Aufruf hat eine englische Fassung (${ohne.length} ohne)`,
     ohne.slice(0, 2).map((k) => k.slice(0, 55)).join(" | "));

  /* Und die Gegenrichtung zur Gegenrichtung: eine „Übersetzung“, die
   * wortgleich mit dem Deutschen ist, ist keine. Ausnahme bleibt, was in
   * beiden Sprachen wirklich dasselbe Wort ist — dort steht die Begründung
   * daneben im Code. */
  const AUSNAHMEN = new Set(["pending", "self-inscribing", "since (ISO)"]);
  const gleich = paare
    .filter((m) => m[1] === m[2] && /\p{L}/u.test(m[1]) && !AUSNAHMEN.has(m[1]))
    .map((m) => m[1]);
  ok(gleich.length === 0,
     `keine „Übersetzung“ ist nur eine Kopie des Deutschen (${gleich.length})`,
     gleich.slice(0, 2).map((k) => k.slice(0, 40)).join(" | "));

  /* ── 1b. Die DATEN-Tabellen ──────────────────────────────────────────
   *
   * ⚠ HIER SITZT DIE ZWEITE BLINDSTELLE, und sie ist die teurere. Richtung A
   * fängt einen GEÄNDERTEN deutschen Satz. Sie fängt NICHT einen NEU
   * HINZUGEFÜGTEN: ein frischer ZERTIFIKAT_ASPEKTE-Eintrag ohne englische
   * Fassung taucht in keiner der beiden Mengen auf — kein Wörterbuch-Schlüssel
   * (also nichts, was tot sein könnte), kein T("…")-Literal (also nichts, dem
   * eine Fassung fehlen könnte). Er stünde still auf Deutsch im englischen
   * Modal.
   *
   * Und genau das wird passieren: CLAUDE.md § Sicherheits-Module pflegen
   * Aspekte verpflichtet JEDE Schutz-Modul-Sitzung, hier einen Eintrag
   * anzuhängen. Ohne diesen Wächter wäre die Übersetzung ab dem nächsten
   * Sicherheits-Update wieder löchrig — und niemand sähe es.
   */
  const datenTabellen = mod.nr === "16"
    ? [{ name: "ZERTIFIKAT_ASPEKTE", von: "var ZERTIFIKAT_ASPEKTE = [", bis: "\n  ];",
         muster: /^\s+(?:aspect|description|name):\s+"((?:[^"\\]|\\.)*)",/gm }]
    : [{ name: "SLOT_TOOLTIPS", von: "var SLOT_TOOLTIPS = {", bis: "\n  };",
         muster: /^\s+\w+:\s+"((?:[^"\\]|\\.)*)",/gm },
       { name: "SLOT_LABELS",   von: "var SLOT_LABELS = {",   bis: "\n  };",
         muster: /^\s+\w+:\s+"((?:[^"\\]|\\.)*)",/gm }];
  /* Modul 16: PFLICHT_MODULE trägt die Modul-Namen. Vier davon sind deutsche
   * Wörter; Storage/Spore/Embedding/Match sind in beiden Sprachen dasselbe. */
  if (mod.nr === "16") {
    datenTabellen.push({ name: "PFLICHT_MODULE", von: "var PFLICHT_MODULE = [", bis: "\n  ];",
                         muster: /name:\s*"((?:[^"\\]|\\.)*)"/g,
                         gleich: new Set(["Storage", "Spore", "Embedding", "Match"]) });
  }
  for (const tab of datenTabellen) {
    const v = src.indexOf(tab.von), b = src.indexOf(tab.bis, v);
    ok(v > 0 && b > v, `${tab.name} steht im Modul`);
    if (!(v > 0 && b > v)) continue;
    const werte = [...src.slice(v, b).matchAll(tab.muster)]
      .map((m) => m[1]).filter((w) => !(tab.gleich && tab.gleich.has(w)));
    ok(werte.length > 0, `${tab.name} hat Einträge (${werte.length})`);
    const fehlen = werte.filter((w) => !schluessel.includes(w));
    ok(fehlen.length === 0,
       `jeder Text aus ${tab.name} hat eine englische Fassung (${fehlen.length} ohne)`,
       fehlen.slice(0, 2).map((k) => k.slice(0, 55)).join(" | "));
  }

  /* Die ZUSICHERUNG selbst, im Code festgenagelt: fehlt ein Eintrag, bleibt
   * es deutsch — und ohne Angabe gewinnt <html lang>, nicht ein hartes "de". */
  ok(/hasOwnProperty\.call\(w, de\)\) \? w\[de\] : de/.test(rest),
     "T() fällt bei fehlendem Eintrag auf Deutsch zurück");
  ok(/if \(optLang === "de" \|\| optLang === "en"\) return optLang;/.test(rest),
     "sprache(): eine ausdrückliche Angabe gewinnt");
  ok(/documentElement\.lang[\s\S]{0,180}?return "de";/.test(rest),
     "sprache(): sonst <html lang>, sonst Deutsch");
}

/* ══ 2. Zur Laufzeit: was ein Nutzer wirklich sieht ═══════════════════════ */

function stubBauen(htmlLang) {
  const mk = (tag) => {
    const el = {
      tagName: String(tag).toUpperCase(), nodeType: 1, id: "", textContent: "", title: "",
      type: "", value: "", placeholder: "", href: "", innerHTML: "", children: [], parentNode: null,
      style: { cssText: "", display: "", setProperty() {}, removeProperty() {} },
      dataset: {}, _attr: {},
      appendChild(c) { c.parentNode = el; el.children.push(c); return c; },
      removeChild(c) { el.children = el.children.filter((x) => x !== c); return c; },
      insertBefore(c) { return el.appendChild(c); },
      setAttribute(k, v) { el._attr[k] = String(v); if (k === "id") el.id = String(v); },
      getAttribute(k) { return Object.prototype.hasOwnProperty.call(el._attr, k) ? el._attr[k] : null; },
      removeAttribute(k) { delete el._attr[k]; },
      _hoerer: {},
      addEventListener(typ, cb) { (el._hoerer[typ] = el._hoerer[typ] || []).push(cb); },
      removeEventListener(typ, cb) {
        const l = el._hoerer[typ]; if (!l) return;
        const i = l.indexOf(cb); if (i >= 0) l.splice(i, 1);
      },
      /* Ein Klick wie von einem Finger: die aufgezeichneten Hörer feuern.
       * Ohne das misst die Probe nur das Modal-GERÜST — und die Aspekte
       * entstehen erst beim Öffnen (renderModalContents). */
      click() { (el._hoerer.click || []).slice().forEach((cb) => cb({ type: "click", preventDefault() {}, stopPropagation() {} })); },
      remove() {}, focus() {},
      getBoundingClientRect() { return { top: 0, left: 0, width: 100, height: 40, bottom: 40, right: 100 }; },
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
      querySelector(sel) { return suche(el, sel); },
      querySelectorAll(sel) { return alle(el, sel); },
    };
    return el;
  };
  /* Nur die Selektor-Formen, die 16/17 wirklich benutzen: [attr], #id, .klasse. */
  const trifft = (el, sel) => {
    if (el.nodeType !== 1) return false;
    if (sel.startsWith("[") && sel.endsWith("]")) {
      return Object.prototype.hasOwnProperty.call(el._attr, sel.slice(1, -1));
    }
    if (sel.startsWith("#")) return el.id === sel.slice(1);
    if (sel.startsWith(".")) return String(el.className || "").split(/\s+/).indexOf(sel.slice(1)) >= 0;
    return false;
  };
  const alle = (root, sel) => {
    const aus = [];
    (function geh(n) {
      (n.children || []).forEach((c) => { if (trifft(c, sel)) aus.push(c); geh(c); });
    })(root);
    return aus;
  };
  const suche = (root, sel) => alle(root, sel)[0] || null;

  const body = mk("body");
  const html = mk("html");
  html.lang = htmlLang;
  const doc = {
    nodeType: 9, readyState: "complete",
    documentElement: html, body, head: mk("head"),
    createElement: mk,
    createTextNode: (t) => ({ nodeType: 3, textContent: String(t), children: [], _attr: {} }),
    getElementById: (id) => suche(html, "#" + id),
    querySelector: (sel) => suche(html, sel),
    querySelectorAll: (sel) => alle(html, sel),
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
  };
  html.appendChild(doc.head); html.appendChild(body);
  /* Der Anker, an den Modul 16 sein Badge hängt (Default-Selektor .lamps).
   * Ohne ihn wartet das Modul auf einen MutationObserver, und es gibt kein
   * Badge zum Anklicken — also auch kein gerendertes Modal zu messen. */
  const lamps = mk("div");
  lamps.className = "lamps";
  body.appendChild(lamps);

  const g = { document: doc, console, setTimeout, clearTimeout, setInterval, clearInterval,
              Date, JSON, Math, Promise };
  g.addEventListener = () => {}; g.removeEventListener = () => {}; g.dispatchEvent = () => true;
  g.MutationObserver = function () { return { observe() {}, disconnect() {} }; };
  g.CustomEvent = function (type, init) { return { type, detail: init && init.detail }; };
  g.location = { origin: "https://example.test", pathname: "/sage/" };
  const ls = {};
  g.localStorage = { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: (k) => { delete ls[k]; } };
  /* Pflicht-Module-Mocks, damit Modul 16 überhaupt zertifiziert (sonst gibt
   * es Anti-Greenwashing-konform GAR KEIN Modal zu messen). 03 ist lazy. */
  g.SbkimStorage    = { init() {} };
  g.SbkimSpore      = { getOwnSpore() { return {}; }, _meta: { ready: true } };
  g.SbkimMatch      = { match() { return 1; } };
  g.SbkimAnastomose = { handshake() {} };
  g.SbkimNostrRelay = { subscribe() { return function () {}; } };
  g.SbkimApoptose   = { prepareSelfApoptose() {} };
  g.SbkimMembrane   = { init() {} };
  return g;
}

function laden(g, relPath) {
  const src = readFileSync(resolve(wurzel, relPath), "utf8");
  new Function("window", "globalThis", "console", "document", "localStorage", src)(
    g, g, console, g.document, g.localStorage);
  return g;
}

/* Alle Texte im gemounteten Baum einsammeln — gemessen wird, was DASTEHT,
 * nicht was eine Brücke behauptet. aria-label zählt mit: bei Modul 17 ist
 * es der Tooltip-Träger, seit die title-Attribute 2026-05-26 wegfielen. */
function texte(el, aus = []) {
  if (!el) return aus;
  if (el.textContent) aus.push(String(el.textContent));
  if (el.title) aus.push(String(el.title));
  if (el.innerHTML) aus.push(String(el.innerHTML));
  if (el._attr) { for (const k in el._attr) if (/^aria-label$/.test(k)) aus.push(String(el._attr[k])); }
  (el.children || []).forEach((c) => texte(c, aus));
  return aus;
}

console.log("\nModul 17 — Laufzeit");
{
  const g = laden(stubBauen(""), "src/modules/17_floating_widget.js");
  await g.SbkimWidget.init({});
  const t = texte(g.document.body).join(" | ");
  ok(g.SbkimWidget._meta.lang === "de", "ohne Angabe: Deutsch", g.SbkimWidget._meta.lang);
  ok(/verkehr/.test(t) && /Klick öffnet/.test(t), "…und die Lampen stehen auf Deutsch da");
  ok(!/traffic/.test(t), "…und nichts ist englisch");
}
{
  const g = laden(stubBauen(""), "src/modules/17_floating_widget.js");
  await g.SbkimWidget.init({ lang: "en" });
  const t = texte(g.document.body).join(" | ");
  ok(g.SbkimWidget._meta.lang === "en", "init({lang:'en'}) wirkt");
  ok(/traffic/.test(t) && /Click opens/.test(t), "…und die Lampen stehen auf Englisch da");
  ok(!/verkehr/.test(t) && !/Klick öffnet/.test(t), "…und nichts ist mehr deutsch");
}
{
  /* <html lang="en"> allein reicht — ohne dass der App-Klebstoff etwas tut.
   * Das ist der Fall, der in der Praxis zählt. */
  const g = laden(stubBauen("en"), "src/modules/17_floating_widget.js");
  await g.SbkimWidget.init({});
  const t = texte(g.document.body).join(" | ");
  ok(g.SbkimWidget._meta.lang === "en", "<html lang='en'> allein genügt");
  ok(/foreign/.test(t), "…und die Etiketten folgen ihm");
}
{
  const g = laden(stubBauen("en"), "src/modules/17_floating_widget.js");
  await g.SbkimWidget.init({ lang: "de" });
  ok(g.SbkimWidget._meta.lang === "de", "init({lang}) schlägt <html lang>");
}
{
  /* Ein unbekannter Wert darf die Seiten-Sprache NICHT schlagen. */
  const g = laden(stubBauen("en"), "src/modules/17_floating_widget.js");
  await g.SbkimWidget.init({ lang: "ru" });
  ok(g.SbkimWidget._meta.lang === "en", "lang:'ru' fällt fail-soft zurück, ohne <html lang> zu überstimmen");
}
{
  const g = laden(stubBauen("en"), "src/modules/17_floating_widget.js");
  await g.SbkimWidget.init({ lang: "en" });
  const t = texte(g.document.body).join(" | ");
  ok(!/undefined|\[object/.test(t), "kein „undefined“ in der Leiste", t.slice(0, 80));
  ok(g.SbkimWidget._meta.langKeys > 20, `_meta.langKeys ist gefüllt (${g.SbkimWidget._meta.langKeys})`);
}

console.log("\nModul 16 — Laufzeit");
async function siegelOeffnen(htmlLang, opts) {
  const g = laden(stubBauen(htmlLang), "src/modules/16_siegel.js");
  /* Das Modal mountet an .lamps; im Stub gibt es die nicht, also gibt Modul 16
   * dem Badge einen MutationObserver-Warte-Pfad. Das Modal selbst hängt
   * unabhängig davon in body — genau das messen wir. */
  await g.SbkimSiegel.init(Object.assign({ mountModal: true, ribbonText: "PROBE" }, opts || {}));
  /* Wie ein Nutzer: auf das Badge tippen. Erst dadurch läuft
   * renderModalContents und die Aspekte entstehen überhaupt. */
  const badge = g.document.querySelector("#sbkim-siegel-badge");
  if (badge) badge.click();
  g._badge = badge;
  return g;
}
function modalTexte(g) {
  const root = g.document.querySelector("#sbkim-siegel-modal");
  return root ? texte(root).join(" | ") : "";
}
{
  const g = await siegelOeffnen("", {});
  ok(g.SbkimSiegel._meta.lang === "de", "ohne Angabe: Deutsch", g.SbkimSiegel._meta.lang);
  ok(g.SbkimSiegel.isCertified() === true, "…und das Siegel ist zertifiziert (sonst gibt es kein Modal)");
  /* Ohne diese zwei Zeilen misst ALLES darunter eine leere Zeichenkette und
   * ist trivial grün — genau die Falle, die Klaus' Verfassung „eine Prüfung,
   * die dir recht gibt" nennt. */
  ok(!!g._badge, "…und das Badge hängt im DOM (sonst gibt es nichts anzuklicken)");
  ok(g.SbkimSiegel._meta.modalOpen === true, "…und der Tipp aufs Badge hat das Modal geöffnet");
  const t = modalTexte(g);
  ok(/was bedeutet das\?/.test(t), "…und der Modal-Titel steht auf Deutsch da");
  ok(!/what does it mean/.test(t), "…und nichts ist englisch");
}
{
  const g = await siegelOeffnen("", { lang: "en" });
  ok(g.SbkimSiegel._meta.lang === "en", "init({lang:'en'}) wirkt");
  const t = modalTexte(g);
  ok(/what does it mean/.test(t), "…und der Modal-Titel steht auf Englisch da");
  ok(/Required modules/.test(t), "…und die Pflicht-Modul-Überschrift folgt");
  ok(!/was bedeutet das/.test(t) && !/Pflicht-Module/.test(t), "…und nichts ist mehr deutsch");
}
{
  const g = await siegelOeffnen("en", {});
  ok(g.SbkimSiegel._meta.lang === "en", "<html lang='en'> allein genügt");
  const t = modalTexte(g);
  ok(/what does it mean/.test(t), "…und das Modal folgt ihm");
}
{
  const g = await siegelOeffnen("en", { lang: "de" });
  ok(g.SbkimSiegel._meta.lang === "de", "init({lang}) schlägt <html lang>");
}
{
  const g = await siegelOeffnen("en", { lang: "ru" });
  ok(g.SbkimSiegel._meta.lang === "en", "lang:'ru' fällt fail-soft zurück, ohne <html lang> zu überstimmen");
}
{
  /* Die ASPEKTE sind der eigentliche Prüfstein: sie kommen aus DATEN, nicht
   * aus einem Literal im Aufruf. Ginge dort kein T() dazwischen, stünden
   * dreizehn deutsche Absätze mitten im englischen Modal. */
  const g = await siegelOeffnen("", { lang: "en" });
  const t = modalTexte(g);
  ok(/Foundational seal attestation/.test(t), "die Aspekte-DATEN gehen durch T()");
  ok(/The relay client belongs to the self-check/.test(t), "…auch der jüngste Eintrag");
  ok(!/Grund-Siegel-Bezeugung/.test(t), "…und kein deutscher Aspekt bleibt stehen");
  ok(/Relay client/.test(t), "auch der Modul-NAME „Relais-Client“ geht durch T()");
  ok(!/undefined|\[object/.test(t), "kein „undefined“ im Modal", t.slice(0, 80));
  ok(g.SbkimSiegel._meta.langKeys > 40, `_meta.langKeys ist gefüllt (${g.SbkimSiegel._meta.langKeys})`);
}

/* ══ 3. Geht JEDER Anzeigetext überhaupt durch T()? ══════════════════════
 *
 * ⚠ DIESER WÄCHTER SCHLIESST EINE BLINDSTELLE DER BEIDEN OBEN, und bei Modul
 * 23 hat sie am 2026-09-14 wirklich zugeschnappt: Abschnitt 1 misst Wörterbuch
 * gegen T()-Aufrufe, tadellos in beide Richtungen — aber ein Text, der GAR
 * NICHT durch T() geht, kommt in keiner der beiden Mengen vor. Er ist für
 * diesen Wächter unsichtbar und bleibt auf Englisch trotzdem deutsch stehen.
 * Dort waren es 52 Stellen; gefunden hat sie nicht die Datei, sondern ein
 * Blick ins echte Fenster („Speicher dauerhaft: unbekannt").
 *
 * Gemessen werden ANZEIGE-STELLEN, nicht Zeichenketten schlechthin.
 *
 * ⚠ BENANNTE GRENZE: er sieht die klaren Muster (Zuweisung an textContent /
 * innerText / title / placeholder / alt / innerHTML und setAttribute(
 * "aria-label", …)). Ein Text, der über einen selbstgebauten Umweg in den DOM
 * kommt, fällt nicht auf. Zweite Verteidigungslinie, keine Vollständigkeits-
 * Garantie. Und er sieht NICHT in Daten-Tabellen (ZERTIFIKAT_ASPEKTE,
 * SLOT_TOOLTIPS) — dafür steht Abschnitt 1b.
 *
 * ⚠ ZWEITE BENANNTE GRENZE: er misst ZEILENWEISE. Eine Zuweisung, deren
 * Zeichenketten erst auf den Folgezeilen stehen (`el.innerHTML =` und darunter
 * der zusammengesetzte Ausdruck), sieht er nicht — der Tabellen-Kopf des
 * VERKEHR-Fensters in Modul 17 ist genau so gebaut. Dass er trotzdem durch
 * T() geht, misst Abschnitt 2 am gerenderten Fenster, nicht dieser hier.
 */
console.log("\nGeht jeder Anzeigetext durch T()?");
for (const mod of MODULE) {
  const src = readFileSync(resolve(wurzel, mod.datei), "utf8");
  const a = src.indexOf("var TEXTE = { en: {");
  const e = src.indexOf("\n  } };", a);
  const wbVon = src.slice(0, a).split("\n").length;
  const wbBis = src.slice(0, e).split("\n").length;

  /* Namen von Attributen und technischen Werten — kein Anzeigetext. */
  const TECHNISCH = new Set(["none","block","flex","inline","inline-block","button","div","span",
    "input","a","p","h1","h2","h3","label","select","option","textarea","img","br","hr","ul","li",
    "strong","pre","b","i","em","small","code","dt","dd","dl","table","thead","tbody","tr","td","th",
    "style","details","summary","aria-label","aria-labelledby","aria-hidden","aria-modal","title",
    "role","alt","placeholder","data-open","id","class",
    "click","change","submit","keydown","pointerdown","text","password","file","checkbox",
    "true","false","null","undefined","auto","hidden","visible","dialog","complementary",
    "pre-wrap","nowrap","absolute","relative","fixed","static","-title","bronze","gold"]);
  /* ⚠ HIER STAND EIN CSS-FILTER, und er ist am 2026-09-14 herausgeflogen.
   * Die Probe von Modul 23 UI braucht ihn: dort baut `el()` Anzeigetexte und
   * CSS-Werte auf derselben Zeile. In 16 und 17 ist das anders — CSS entsteht
   * über `style.cssText = [ … ].join(";")` und über `buildCss()`, also auf
   * Zeilen, die der Vorfilter unten gar nicht erst durchlässt.
   *
   * GEMESSEN, nicht vermutet: den Filter abgeschaltet meldet die Probe in
   * beiden Modulen weiterhin 0 offene Stellen — vorher 0, nachher 0. Ein
   * Riegel, den keine Gegenprobe von seinem Fehlen unterscheiden kann, ist
   * eine Behauptung; er wäre hier nur ein grüner Haken gewesen.
   *
   * Was die Arbeit wirklich tut, ist der VORFILTER weiter unten (nur Zeilen
   * mit einer Anzeige-Zuweisung) plus TECHNISCH. Dafür gibt es einen
   * Gegenprobe-Fall.
   */

  const zeilen = src.split("\n");
  let imBlock = false;
  const offen = [];
  zeilen.forEach((z, i) => {
    const nr = i + 1;
    if (nr > wbVon && nr <= wbBis) return;          // das Wörterbuch selbst ist deutsch, zu Recht
    let s = z;
    if (imBlock) { const k = s.indexOf("*/"); if (k < 0) return; s = s.slice(k + 2); imBlock = false; }
    const o = s.indexOf("/*");
    if (o >= 0) { const k = s.indexOf("*/", o); if (k < 0) { s = s.slice(0, o); imBlock = true; } else s = s.slice(0, o) + s.slice(k + 2); }
    if (/^\s*\*/.test(z)) return;
    const kom = s.search(/(^|[^:"'\\])\/\//); if (kom >= 0) s = s.slice(0, kom + 1);
    /* console.warn/info reden mit dem Entwickler, nicht mit dem Nutzer. */
    if (/\b(warn|console\.(warn|info|error|log))\(/.test(s)) return;
    if (!/(textContent|innerText|innerHTML|\.title\s*=|\.placeholder\s*=|\.alt\s*=|aria-label)/.test(s)) return;
    for (const m of s.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
      const w = m[1];
      if (!/\p{L}/u.test(w)) continue;
      if (/^(\\n)+$/.test(w)) continue;
      if (TECHNISCH.has(w)) continue;
      if (s.slice(Math.max(0, m.index - 2), m.index).endsWith("T(")) continue;
      offen.push(nr + ": " + w);
    }
  });
  ok(offen.length === 0,
     `Modul ${mod.nr}: jeder Anzeigetext geht durch T() (${offen.length} nicht)`,
     offen.slice(0, 3).join(" | "));
}

/* ══ 4. Das WAPPEN-SVG gegen die Tafel ═══════════════════════════════════
 *
 * ⚠ DRITTE BENANNTE GRENZE VON ABSCHNITT 3, gefunden 2026-09-14 spät beim
 * Sichttest-Vorlauf: er misst ZEILENWEISE und nur Zeilen mit einer
 * Anzeige-Zuweisung. `WAPPEN_SVG` ist eine `var`-Zuweisung mit Markup, und
 * eingesetzt wird sie später über eine VARIABLE — auf deren Zeile steht keine
 * Zeichenkette. Für beide Filter unsichtbar.
 *
 * Gemessen headless an drei echten Seiten mit <html lang="en">: im Wappen
 * standen „OFFIZIELLE BESTÄTIGUNG" und „SIEGEL" auf Deutsch, während alles
 * andere Englisch sprach. Genau das Muster, das diese Probe verhindern soll.
 *
 * ⚠ DIESER WÄCHTER ENTSCHEIDET NICHT, OB DAS FALSCH IST. Ob ein Wappen als
 * Emblem deutsch bleibt (wie die ZERTIFIKAT_ASPEKTE-Urkunde) oder mitspricht,
 * ist Klaus' Entscheidung. Gemessen wird nur, dass KEIN Text im Wappen
 * UNBENANNT bleibt: jeder muss in INTERFACES § Modul 16 SPRACHE stehen. Wer
 * einen hinzufügt, zieht die Tafel nach — und dann wird die Frage gestellt,
 * statt übersehen zu werden.
 *
 * Bauart bewusst „hinzufügen statt ändern": ein Wächter, der einen festen
 * Wortlaut festnagelt, verböte das nächste Richtigstellen.
 */
let wt, gefuehrt, wb;
console.log("\nDas Wappen-SVG gegen die Tafel:");
{
  const src = readFileSync(resolve(wurzel, "src/modules/16_siegel.js"), "utf8");
  const a = src.indexOf("var WAPPEN_SVG = '");
  ok(a >= 0, "WAPPEN_SVG ist im Modul zu finden");
  const e = src.indexOf("\n", a);
  const svg = src.slice(a, e > a ? e : undefined);

  /* Texte aus <text>/<textPath> — genau das, was ein Mensch im Wappen liest. */
  const texte = [...new Set(
    [...svg.matchAll(/>([^<>]*\p{L}[^<>]*)</gu)]
      .map(m => m[1].replace(/\\n/g, " ").trim())
      /* ⚠ ERST die \n-FOLGEN WEG, DANN auf Buchstaben pruefen: der Quelltext
       * traegt sie als ZWEI Zeichen, und das zweite ist ein „n". Ein Filter
       * auf \p{L} laesst sie sonst durch und meldet Zeilenumbrueche als
       * unbenannten Wappen-Text. Beim ersten Lauf genau so passiert. */
      .filter(t => t && /\p{L}/u.test(t))
  )];
  ok(texte.length > 0, `im Wappen stehen Texte (${texte.length} gefunden)`);

  const tafel = readFileSync(resolve(wurzel, "docs/INTERFACES.md"), "utf8");
  const tVon = tafel.indexOf("SPRACHE (2026-09-14, nach dem Modul-23-UI-Rollout). Modul 16");
  const tBis = tafel.indexOf("ExplanationSnapshot (Karte 16", tVon);
  ok(tVon >= 0 && tBis > tVon, "der SPRACHE-Abschnitt von Modul 16 ist auffindbar");
  const abschnitt = tafel.slice(tVon, tBis);

  const unbenannt = texte.filter(t => !abschnitt.includes(t));
  ok(unbenannt.length === 0,
     `jeder Wappen-Text ist in INTERFACES § Modul 16 SPRACHE benannt (${unbenannt.length} nicht)`,
     unbenannt.slice(0, 3).join(" | "));

  /* ══ Die Gegenrichtung (Klaus 2026-09-14: das Wappen spricht mit) ══
   * Ein Text in WAPPEN_TEXTE ohne Woerterbuch-Eintrag bleibt auf Englisch
   * still deutsch stehen — T() gibt ihn dann unveraendert zurueck, die
   * Ersetzung entfaellt, und NICHTS faellt auf. Genau der Fehler, den diese
   * Probe verhindern soll, nur eine Ebene tiefer. */
  wt = src.match(/var WAPPEN_TEXTE = \[([^\]]*)\]/);
  ok(!!wt, "WAPPEN_TEXTE ist im Modul zu finden");
  gefuehrt = wt ? [...wt[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => m[1]) : [];
  ok(gefuehrt.length > 0, `WAPPEN_TEXTE fuehrt Texte (${gefuehrt.length})`);

  const wbA = src.indexOf("var TEXTE = { en: {");
  const wbE = src.indexOf("\n  } };", wbA);
  wb = src.slice(wbA, wbE);
  const ohneEintrag = gefuehrt.filter(t => !wb.includes('"' + t + '"'));
  ok(ohneEintrag.length === 0,
     `jeder WAPPEN_TEXTE-Eintrag hat eine englische Fassung (${ohneEintrag.length} nicht)`,
     ohneEintrag.join(" | "));

  /* Und sie muessen wirklich IM WAPPEN stehen — als ">TEXT<", denn genau so
   * ersetzt renderWappenSvg(). Ein Eintrag, der dort nicht vorkommt, ist tot;
   * einer, der zweimal vorkommt, wuerde nur beim ersten Mal ersetzt. */
  for (const t of gefuehrt) {
    const n = svg.split(">" + t + "<").length - 1;
    ok(n === 1, `„${t}" steht GENAU EINMAL als >Text< im Wappen (${n})`);
  }

  ok(src.slice(src.indexOf("function renderWappenSvg()")).slice(0, 900).includes("WAPPEN_TEXTE"),
     "renderWappenSvg() fuehrt die Wappen-Texte wirklich durch T()");
}

/* ══ 4b. …und dasselbe am WIRKLICH GERENDERTEN Wappen ════════════════════
 *
 * ⚠ ABSCHNITT 4 OBEN LIEST NUR DEN QUELLTEXT. Er faende die Zeilen auch dann
 * tadellos, wenn renderWappenSvg() gar nicht mehr gerufen wuerde — „ein
 * Waechter, der eine Datei LIEST, misst nicht, ob sie LAEUFT" (Kimhub, an
 * einer anderen Tuer). Hier wird das Badge gebaut und sein innerHTML gemessen.
 *
 * DIE TRAGENDE ZUSICHERUNG IST DIE ERSTE: auf Deutsch byte-identisch. Faellt
 * die Abbruch-Bedingung weg, liefe jede deutsche Seite durch ein
 * String-replace — und die Zusicherung „OHNE EINSTELLUNG AENDERT SICH NICHTS"
 * waere nur noch zufaellig wahr.
 */
console.log("\nDas gerenderte Wappen:");
{
  const roh = readFileSync(resolve(wurzel, "src/modules/16_siegel.js"), "utf8");
  const wa = roh.indexOf("var WAPPEN_SVG = '");
  const rohSvg = roh.slice(wa, roh.indexOf("\n", wa));

  /* Mit dem eingebackenen Band-Text: dann ersetzt renderWappenSvg() auch das
   * Ribbon nicht, und uebrig bleibt genau die Frage nach den zwei Texten. */
  const gDe = await siegelOeffnen("de", { ribbonText: "SAGE OBSERVATORIUM" });
  const gEn = await siegelOeffnen("en", { ribbonText: "SAGE OBSERVATORIUM" });
  const svgDe = gDe._badge ? gDe._badge.innerHTML : "";
  const svgEn = gEn._badge ? gEn._badge.innerHTML : "";

  ok(svgDe.length > 500, `das Badge traegt auf Deutsch ein Wappen (${svgDe.length} Zeichen)`);

  /* Der Vergleich gegen die Konstante: im Quelltext steht sie als
   * JS-Literal mit \n-Folgen, gerendert sind es echte Umbrueche. Verglichen
   * wird deshalb ueber die Anzeigetexte, die drinstehen — genau das, was die
   * Zusicherung meint. */
  for (const t of gefuehrt) {
    ok(svgDe.includes(">" + t + "<"),
       `auf Deutsch steht „${t}" unveraendert im Wappen`);
    ok(!svgEn.includes(">" + t + "<"),
       `auf Englisch steht „${t}" NICHT mehr da`);
    const en = (wb.match(new RegExp('"' + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"\\s*:\\s*"([^"]*)"')) || [])[1];
    ok(!!en && svgEn.includes(">" + en + "<"),
       `auf Englisch steht stattdessen „${en}" im Wappen`);
  }

  /* Der Eigenname darf NICHT mitwandern — sonst uebersetzt der naechste
   * Eintrag still das Protokoll selbst. */
  ok(svgDe.includes(">SBKIM<") && svgEn.includes(">SBKIM<"),
     "der Eigenname SBKIM steht in BEIDEN Sprachen unveraendert da");
  ok(rohSvg.includes(">SBKIM<"), "…und zwar unveraendert aus der Konstante");
}

console.log(`\nErgebnis: ${pass} bestanden, ${fail} fehlgeschlagen`);
process.exit(fail ? 1 : 0);
