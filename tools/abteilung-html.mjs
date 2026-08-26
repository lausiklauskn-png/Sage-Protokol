/* abteilung-html.mjs, holt EINE Abteilung als eigenständige HTML-Datei heraus.
 *
 * Aufruf:  node tools/abteilung-html.mjs docs/unterlagen.html schritte
 *
 * ── WARUM ÜBER DEN BROWSER UND NICHT MIT EINEM ZWEITEN BAUER ──────────────
 *
 * Die Seite kann das längst: `alleinBauen(id)` steht in ihrem eigenen Skript
 * und hängt am Knopf „Diese Abteilung als HTML herunterladen". Es nimmt die
 * Abteilung aus DEMSELBEN DOM, wirft die Knöpfe weg (in einer Datei ohne
 * Skript wären es tote Knöpfe) und löst die Markierungen auf.
 *
 * Ein zweiter Bauer daneben wäre eine zweite Fassung derselben Auswahl. Sie
 * liefen auseinander, und dann stünde in der herausgenommenen Datei etwas
 * anderes als im Knopf. Deshalb wird hier der Browser geöffnet und **die
 * vorhandene Funktion gerufen**, genau wie beim Druck über
 * `tools/html-zu-pdf.mjs`.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const quelle = process.argv[2];
const id = process.argv[3];
if (!quelle || !id) {
  console.error('Aufruf: node tools/abteilung-html.mjs <mappe.html> <abteilungs-id>');
  process.exit(2);
}

function findeChromium() {
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  let o = [];
  try { o = readdirSync(heim).filter((n) => /^chromium-\d+$/.test(n)); } catch { return null; }
  o.sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
  for (const x of o) {
    const w = join(heim, x, 'chrome-linux', 'chrome');
    if (existsSync(w)) return w;
  }
  return null;
}

const chrom = findeChromium();
if (!chrom) {
  console.error('ABBRUCH: kein Chromium gefunden. Es wird NICHTS geschrieben.');
  console.error('Eine halb erzeugte Datei sähe aus wie ein Ergebnis.');
  process.exit(2);
}
let chromium;
try { ({ chromium } = await import('playwright-core')); }
catch { console.error('ABBRUCH: playwright-core fehlt. npm install'); process.exit(2); }

const browser = await chromium.launch({ executablePath: chrom });
try {
  const p = await browser.newPage();
  await p.goto(pathToFileURL(resolve(WURZEL, quelle)).href);
  const html = await p.evaluate((abt) => {
    if (!window.__mappe || typeof window.__mappe.alleinBauen !== 'function') return null;
    if (!document.getElementById(abt)) return '__KEINE_ABTEILUNG__';
    return window.__mappe.alleinBauen(abt);
  }, id);

  if (html === null) {
    console.error('ABBRUCH: die Seite hat keinen Haken window.__mappe.alleinBauen.');
    process.exit(1);
  }
  if (html === '__KEINE_ABTEILUNG__') {
    console.error('ABBRUCH: die Mappe hat keine Abteilung „' + id + '".');
    process.exit(1);
  }
  /* MIT BOM. Beim Herunterladen geht `charset=utf-8` verloren, und Androids
     Betrachter rät dann Latin-1: aus jedem Umlaut werden zwei Zeichen. */
  const ziel = resolve(WURZEL, dirname(quelle),
    basename(quelle, '.html') + '-' + id + '.html');
  writeFileSync(ziel, '﻿' + html, 'utf-8');
  console.log('geschrieben: ' + ziel.replace(WURZEL + '/', '')
    + ' (' + Math.round(Buffer.byteLength(html) / 1024) + ' KB)');
} finally { await browser.close(); }
