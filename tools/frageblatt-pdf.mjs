/* frageblatt-pdf.mjs — druckt das Frageblatt in ein PDF.
 *
 * Aufruf:   node tools/frageblatt-pdf.mjs
 * Liest:    docs/frageblatt.html
 * Schreibt: docs/frageblatt.pdf
 *
 * Braucht `playwright-core` und den Chromium im Environment. Fehlt eines von
 * beiden, bricht das Werkzeug mit einer Ansage ab und schreibt KEIN PDF.
 * Ein halb erzeugtes PDF wäre schlimmer als keines: es sieht wie ein fertiges
 * Papier aus, und man merkt es erst beim Termin.
 *
 * ── WARUM DER UMWEG ÜBER DEN BROWSER ──────────────────────────────────────
 *
 * Dasselbe wie bei `arbeitstage-pdf.mjs`: das Blatt trägt bereits ein
 * Druck-Stylesheet. Ein eigener PDF-Erzeuger müsste all das ein zweites Mal
 * können, und die zwei Fassungen liefen auseinander. Der Browser druckt genau
 * das, was auch auf Papier käme.
 *
 * Seitenzahlen, weil ein Papier, das man einem Berater hinlegt, ohne sie
 * nicht besprechbar ist („auf Seite drei, unten").
 */

import { existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SAGE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(SAGE, 'docs/frageblatt.html');
const ZIEL = resolve(SAGE, 'docs/frageblatt.pdf');

if (!existsSync(QUELLE)) {
  console.error('FEHLT: docs/frageblatt.html');
  console.error('Zuerst: node tools/frageblatt-bauen.mjs');
  process.exit(2);
}

let chromium = null;
try { ({ chromium } = await import('playwright-core')); } catch { chromium = null; }
if (!chromium) {
  console.error('NICHT LAUFFÄHIG: playwright-core fehlt.');
  console.error('Kein PDF geschrieben. npm install, dann noch einmal.');
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const seite = await browser.newPage();
await seite.goto(pathToFileURL(QUELLE).href, { waitUntil: 'load' });
/* Auf die Bedingung warten, nicht auf die Uhr: der letzte Abschnitt muss
   wirklich da sein. Ein PDF von einer halb gezeichneten Seite fiele nicht
   auf, es wäre nur unvollständig. */
await seite.waitForSelector('.fuss');

await seite.pdf({
  path: ZIEL,
  format: 'A4',
  printBackground: true,
  margin: { top: '18mm', bottom: '16mm', left: '16mm', right: '16mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div style="font:8pt Georgia,serif;width:100%;padding:0 16mm;'
    + 'color:#555">Frageblatt Steuerberater &middot; Klaus Nitzsche</div>',
  footerTemplate: '<div style="font:8pt Georgia,serif;width:100%;padding:0 16mm;'
    + 'color:#555;text-align:right">Seite <span class="pageNumber"></span>'
    + ' von <span class="totalPages"></span></div>',
});

await browser.close();

const kb = Math.round(statSync(ZIEL).size / 1024);
console.log('geschrieben: docs/frageblatt.pdf (' + kb + ' KB)');
if (kb < 20) {
  console.error('VERDÄCHTIG KLEIN. Bitte ansehen, bevor es weitergegeben wird.');
  process.exit(1);
}
