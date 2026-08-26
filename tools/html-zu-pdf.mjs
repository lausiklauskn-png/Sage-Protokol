/* html-zu-pdf.mjs — druckt eine erzeugte HTML-Seite in ein PDF.
 *
 * Aufruf:  node tools/html-zu-pdf.mjs <datei.html> [--warte <css-auswahl>]
 *          node tools/html-zu-pdf.mjs docs/unterlagen.html
 *
 * Braucht `playwright-core` und den Chromium im Environment. Fehlt eines von
 * beiden, bricht das Werkzeug mit einer Ansage ab und schreibt KEIN PDF.
 * Ein halb erzeugtes oder leeres PDF wäre schlimmer als keines: es sieht wie
 * ein Nachweis aus.
 *
 * ── WARUM DER UMWEG ÜBER DEN BROWSER ──────────────────────────────────────
 *
 * Die Blätter tragen bereits ein Druck-Stylesheet: wiederholte Tabellenköpfe,
 * keine Zeile über einen Umbruch, keine zerrissene Überschrift. Ein eigener
 * PDF-Erzeuger müsste all das ein zweites Mal können, und die zwei Fassungen
 * liefen auseinander. Der Browser druckt genau das, was auch auf Papier käme.
 *
 * Kopf- und Fußzeile tragen Titel und Seitenzahl, weil eine Unterlage ohne
 * Seitenzahlen nicht prüfbar ist.
 *
 * ── EINE SEITE, DIE KNÖPFE HAT, WIRD OHNE SIE GEDRUCKT ────────────────────
 *
 * Das besorgt das Druck-Stylesheet der Seite selbst (`@media print`), nicht
 * dieses Werkzeug. Wer hier zusätzlich Elemente entfernte, hätte eine zweite
 * Fassung derselben Entscheidung, und die eine wüsste nichts von der anderen.
 */

import { existsSync, statSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const roh = process.argv.slice(2);
const wert = (name, vorgabe) => {
  const i = roh.indexOf(name);
  return i > -1 ? roh[i + 1] : vorgabe;
};
const argumente = roh.filter((a, i) =>
  !a.startsWith('--') && !(i > 0 && roh[i - 1].startsWith('--')));
const WARTE = wert('--warte', 'body');
/* `--nur <id>` druckt EINE Abteilung. Es setzt dieselbe Klasse am <html>, die
   auch der Knopf in der Seite setzt, statt eine zweite Auswahl-Logik zu bauen:
   zwei Fassungen derselben Entscheidung liefen auseinander, und die eine wüsste
   nichts von der anderen. */
const NUR = wert('--nur', '');

if (argumente.length !== 1) {
  console.error('Aufruf: node tools/html-zu-pdf.mjs <datei.html> [--warte <css>]');
  process.exit(2);
}

const QUELLE = resolve(WURZEL, argumente[0]);
const ZIEL = QUELLE.replace(/\.html$/, (NUR ? '-' + NUR : '') + '.pdf');

if (!existsSync(QUELLE)) {
  console.error('FEHLT: ' + argumente[0]);
  process.exit(2);
}

let chromium = null;
try { ({ chromium } = await import('playwright-core')); } catch { chromium = null; }
if (!chromium) {
  console.error('NICHT LAUFFÄHIG: playwright-core fehlt. Kein PDF geschrieben.');
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const seite = await browser.newPage();
await seite.goto(pathToFileURL(QUELLE).href, { waitUntil: 'load' });
/* Auf eine Bedingung warten, nicht auf die Uhr: ein PDF von einer halb
   gezeichneten Seite fiele nicht auf, es wäre nur unvollständig. */
await seite.waitForSelector(WARTE);

if (NUR) {
  const gefunden = await seite.evaluate((id) => {
    if (!document.getElementById(id)) return false;
    document.documentElement.className = 'nur-' + id;
    return true;
  }, NUR);
  if (!gefunden) {
    console.error('KEINE ABTEILUNG „' + NUR + '" in ' + argumente[0] + '.');
    console.error('Kein PDF geschrieben.');
    await browser.close();
    process.exit(2);
  }
}

const titel = (await seite.title()).replace(/,\s*Sage-Protokol.*$/, '')
  + (NUR ? ' · ' + NUR : '');

await seite.pdf({
  path: ZIEL,
  format: 'A4',
  printBackground: false,
  margin: { top: '16mm', bottom: '16mm', left: '12mm', right: '12mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div style="font:8pt Georgia,serif;width:100%;padding:0 12mm;'
    + 'color:#555">' + titel.replace(/[<>&]/g, '') + '</div>',
  footerTemplate: '<div style="font:8pt Georgia,serif;width:100%;padding:0 12mm;'
    + 'color:#555;text-align:right">Seite <span class="pageNumber"></span>'
    + ' von <span class="totalPages"></span></div>',
});

await browser.close();

const kb = Math.round(statSync(ZIEL).size / 1024);
console.log('geschrieben: ' + basename(ZIEL) + ' (' + kb + ' KB)');
if (kb < 10) {
  console.error('VERDÄCHTIG KLEIN. Bitte ansehen, bevor es weitergegeben wird.');
  process.exit(1);
}
