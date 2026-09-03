/* smoke_paper_css.mjs — haelt `docs/papers/paper.css` und den INLINE-Stil der
 * beiden SBKIM-Papers gegeneinander.
 *
 * Lauf:  node tests/smoke_paper_css.mjs
 *
 * ── WARUM ES ZWEI FASSUNGEN GIBT ──────────────────────────────────────────
 *
 * `paper.css` wurde am 2026-09-03 byte-treu aus `sbkim-paper-de.html` gezogen,
 * damit der Erzeuger `tools/paper-md-zu-html.mjs` keine eigene Abschrift der
 * Druckregeln tragen muss. Die SBKIM-Papers behielten ihre inline-Fassung: sie
 * sind unter 10.5281/zenodo.22277738 veroeffentlicht, und ihre Datei jetzt
 * umzubauen aenderte ein zitierfaehiges Dokument, ohne dass sich am Text etwas
 * aendert.
 *
 * Das ist eine BENANNTE Doppelung, keine behobene. Genau deshalb gibt es diese
 * Probe: solange zwei Kopien derselben Entscheidungen leben, muss etwas
 * melden, wenn sie auseinanderlaufen. Ohne sie waere „ist ja byte-treu
 * kopiert" eine Aussage ueber den 3. September und ueber keinen Tag danach.
 *
 * ── WAS GEMESSEN WIRD, UND WAS NICHT ──────────────────────────────────────
 *
 * Verglichen wird der Teil von `paper.css` UNTERHALB seines eigenen
 * Kopf-Kommentars gegen den Inhalt des `<style>`-Blocks der DE-Fassung. Der
 * Kopf-Kommentar gehoert nur zur ausgelagerten Datei und darf abweichen.
 *
 * Die EN-Fassung wird NICHT byte-gleich verlangt: ein englisches Papier darf
 * eigene Regeln tragen. Gemessen wird bei ihr, dass die sechs Druck-Regeln,
 * die je eine Messung gekostet haben, ueberhaupt vorhanden sind. Eine
 * Byte-Gleichheit zu fordern, die niemand zugesichert hat, waere ein Waechter,
 * der irgendwann zu Recht rot wird und dann abgeschaltet statt gelesen wird.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = resolve(WURZEL, 'docs/papers/paper.css');
const DE = resolve(WURZEL, 'docs/papers/sbkim-paper-de.html');
const EN = resolve(WURZEL, 'docs/papers/sbkim-paper-en.html');

let gruen = 0;
const rot = [];
const pruefe = (name, bedingung, hinweis) => {
  if (bedingung) { gruen++; console.log('  ✓ ' + name); }
  else { rot.push(name); console.log('  ✗ ' + name + (hinweis ? ' — ' + hinweis : '')); }
};

console.log('Paper-Stil: ausgelagerte Datei gegen die inline-Fassungen');

for (const [name, pfad] of [['paper.css', CSS], ['sbkim-paper-de.html', DE], ['sbkim-paper-en.html', EN]]) {
  pruefe(name + ' liegt vor', existsSync(pfad));
}
if (rot.length) { console.log('\n' + gruen + ' gruen, ' + rot.length + ' ROT'); process.exit(1); }

const stilAus = (html) => {
  const a = html.indexOf('<style>');
  const e = html.indexOf('</style>');
  return a < 0 || e < 0 ? '' : html.slice(a + '<style>'.length, e);
};

const cssRoh = readFileSync(CSS, 'utf8');
/* Der eigene Kopf-Kommentar endet an seinem Abschluss-Zeichenpaar.
   (Das hier NICHT als Zeichen hinschreiben: es schliesst diesen Kommentar.) */
/* ── DER VERGLEICHSBEREICH ENDET AN DER ZUSATZ-MARKE ──────────────────────
   Unterhalb von „ZUSÄTZE" stehen Regeln, die es in den SBKIM-Fassungen NICHT
   gibt und nicht geben soll (h4, die Thema-Klammer). Verglichen wird deshalb
   nur der geteilte Teil. Ohne diese Grenze haette jede noetige Ergaenzung den
   Waechter rot gemacht — und ein Waechter, der das Richtige verbietet, wird
   abgeschaltet statt gelesen. */
const ZUSATZ_MARKE = 'ZUS\u00c4TZE \u2014 gelten NUR f\u00fcr die erzeugten Papers';
const zusatzAb = cssRoh.indexOf(ZUSATZ_MARKE);
const cssGeteilt = zusatzAb < 0 ? cssRoh : cssRoh.slice(0, cssRoh.lastIndexOf('/*', zusatzAb));
const cssOhneKopf = cssGeteilt.slice(cssGeteilt.indexOf('*/') + 2).replace(/^\n+/, '\n');
const deStil = stilAus(readFileSync(DE, 'utf8'));

pruefe('paper.css ist byte-gleich mit dem <style> der DE-Fassung',
  cssOhneKopf.trim() === deStil.trim(),
  'paper.css ' + cssOhneKopf.trim().length + ' Zeichen, DE-inline ' + deStil.trim().length +
  ' — eine der beiden wurde geaendert, die andere nicht nachgezogen');

/* Die sechs Regeln, die je eine Messung gekostet haben. Gemessen wird die
   REGEL, nicht ihr Kommentar: ein Waechter am Wortlaut einer Begruendung
   verbietet das naechste Richtigstellen. */
const REGELN = [
  ['A4-Format und Rand im Dokument', /@page\s*\{[^}]*size:\s*A4/],
  ['Deckblatt fuer sich', /\.abstract\s*\{\s*break-after:\s*page/],
  ['Tabellen brechen nicht um', /table\s*\{\s*break-inside:\s*avoid/],
  ['Ueberschrift bleibt bei ihrem Absatz', /orphans:\s*4/],
  ['Tabellenkopf wiederholt sich', /thead\s*\{\s*display:\s*table-header-group/],
  ['Adressen stehen im Druck hinter dem Verweis', /\.paper-links a::after/],
];

/* ⚠ GEGEN `cssOhneKopf`, NICHT GEGEN DIE GANZE DATEI. Der Kopf-Kommentar von
   paper.css ZAEHLT die Regeln auf („`orphans:4` gegen die gestrandete
   Ueberschrift …"). Gegen `cssRoh` geprueft waere dieser Waechter auch dann
   gruen gewesen, wenn die echte Regel geloescht ist und nur die Prosa
   darueber stehen bleibt — er haette meinen eigenen Kommentar bewacht.
   Gefunden am 2026-09-03 von `gegenprobe_paper_a.mjs`, die den Fall zuerst
   selbst verfehlt hat: `String.replace` mit einer Zeichenkette trifft nur die
   ERSTE Fundstelle, und die stand im Kommentar. Zwei Fehler, die einander
   gedeckt haben. */
for (const [was, muster] of REGELN) {
  pruefe('paper.css: ' + was, muster.test(cssOhneKopf));
}

/* Die Zusaetze bekommen ihren eigenen Waechter — sonst waeren sie der einzige
   Teil der Datei, den niemand misst. */
pruefe('paper.css: die Zusatz-Marke steht da', zusatzAb > 0);
const zusatz = zusatzAb > 0 ? cssRoh.slice(zusatzAb) : '';
for (const [was, muster] of [
  ['die vierte Überschriften-Ebene ist gesetzt', /^h4 \{/m],
  ['ein Absatz wird nicht gespalten', /p, li, blockquote \{ break-inside:avoid; \}/],
  ['eine h4 bleibt bei ihrem Text', /h4 \{ break-after:avoid; \}/],
]) {
  pruefe('Zusätze: ' + was, muster.test(zusatz));
}

const enStil = stilAus(readFileSync(EN, 'utf8'));
for (const [was, muster] of REGELN) {
  pruefe('EN-Fassung: ' + was, muster.test(enStil));
}

console.log('\n' + gruen + ' gruen, ' + rot.length + (rot.length ? ' ROT' : ' rot'));
process.exit(rot.length ? 1 : 0);
