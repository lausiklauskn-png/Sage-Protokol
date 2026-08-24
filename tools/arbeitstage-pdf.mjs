/* arbeitstage-pdf.mjs — druckt die tägliche Dokumentation in ein PDF.
 *
 * Aufruf:   node tools/arbeitstage-pdf.mjs
 * Liest:    docs/historie/arbeitstage.html
 * Schreibt: docs/historie/arbeitstage.pdf
 *
 * Braucht `playwright-core` und den Chromium im Environment. Fehlt eines von
 * beiden, bricht das Werkzeug mit einer Ansage ab und schreibt KEIN PDF.
 * Ein halb erzeugtes oder leeres PDF wäre schlimmer als keines: es sieht wie
 * ein Nachweis aus.
 *
 * ── WARUM DER UMWEG ÜBER DEN BROWSER ──────────────────────────────────────
 *
 * Das Blatt trägt bereits ein Druck-Stylesheet: wiederholte Tabellenköpfe auf
 * jeder Seite, keine Zeile, die über einen Seitenumbruch zerrissen wird, kein
 * Tageseintrag, der auseinanderfällt. Ein eigener PDF-Erzeuger müsste all das
 * ein zweites Mal können, und die zwei Fassungen liefen auseinander. Der
 * Browser druckt genau das, was auch auf Papier käme.
 *
 * Fuß- und Kopfzeile tragen die Seitenzahl, weil eine Aufstellung für eine
 * Behörde ohne Seitenzahlen nicht prüfbar ist.
 */

import { existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SAGE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(SAGE, 'docs/historie/arbeitstage.html');
const ZIEL = resolve(SAGE, 'docs/historie/arbeitstage.pdf');

if (!existsSync(QUELLE)) {
  console.error('FEHLT: docs/historie/arbeitstage.html');
  console.error('Zuerst: node tools/arbeitstage-bauen.mjs');
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
/* Auf die Tabelle warten, nicht auf die Uhr: ein PDF von einer halb
   gezeichneten Seite fiele nicht auf, es wäre nur unvollständig. */
await seite.waitForSelector('tfoot [data-summe="spanne"]');

await seite.pdf({
  path: ZIEL,
  format: 'A4',
  printBackground: false,
  margin: { top: '16mm', bottom: '16mm', left: '12mm', right: '12mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div style="font:8pt Georgia,serif;width:100%;padding:0 12mm;'
    + 'color:#555">Tägliche Dokumentation der Arbeitstage</div>',
  footerTemplate: '<div style="font:8pt Georgia,serif;width:100%;padding:0 12mm;'
    + 'color:#555;text-align:right">Seite <span class="pageNumber"></span>'
    + ' von <span class="totalPages"></span></div>',
});

await browser.close();

const kb = Math.round(statSync(ZIEL).size / 1024);
console.log('geschrieben: docs/historie/arbeitstage.pdf (' + kb + ' KB)');
if (kb < 20) {
  console.error('VERDÄCHTIG KLEIN. Bitte ansehen, bevor es weitergegeben wird.');
  process.exit(1);
}
