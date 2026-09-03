/* paper-zu-pdf.mjs — druckt eines der beiden SBKIM-Papers als A4-PDF.
 *
 * Aufruf:  node tools/paper-zu-pdf.mjs docs/papers/sbkim-paper-de.html
 *          node tools/paper-zu-pdf.mjs docs/papers/sbkim-paper-de.html --ziel /tmp/de.pdf
 *
 * ── WARUM ES DIESES WERKZEUG GIBT ─────────────────────────────────────────
 *
 * Am 2026-09-02 hat eine Sitzung die PDFs für Zenodo von Hand gebaut, mit einer
 * Arbeitskopie und per curl geholten Schriften. Der Weg funktionierte und wurde
 * NICHT abgelegt — die nächste Sitzung musste ihn neu finden. Das ist die
 * Familie von Fehlern aus NETZWEIT § 6b: eine Grenze, die man kennt, kostet
 * eine Zeile; eine, die man jedes Mal neu entdeckt, kostet eine Stunde.
 *
 * ── WARUM DIE SCHRIFTEN EINGEBETTET WERDEN ────────────────────────────────
 *
 * Chromium kommt aus diesem Container nicht an fonts.googleapis.com
 * (ERR_CONNECTION_RESET) und setzt dann STILL eine Ersatzschrift ein. Das PDF
 * sähe anders aus als die Seite im Browser, und niemand bekäme eine Warnung.
 * `curl` kommt durch — die Schnitte werden geholt und als data:-URI in eine
 * ARBEITSKOPIE gelegt. Das Depot bleibt unberührt.
 *
 * Geladen werden nur die lateinischen Schnitte. Die Papers sind deutsch und
 * englisch; 51 weitere Schnitte (kyrillisch, griechisch, vietnamesisch)
 * blähten das PDF auf, ohne ein Zeichen beizutragen.
 *
 * ── DER PRÜFER LÄUFT VOR DEM DRUCK, NICHT DANACH ──────────────────────────
 *
 * Ein PDF-Prüfer derselben Sitzung meldete „§ 3.5 fehlt, Kürzel nicht
 * aufgelöst" — alles falsch. Er las die eingebetteten SCHRIFTDATEN; die
 * 15.168 „Textzeichen" waren Fonttabellen. Geprüft wird deshalb im geladenen
 * Dokument, wo der Text wirklich Text ist. Schlägt eine Prüfung fehl, wird
 * KEIN PDF geschrieben: ein halb richtiges PDF sieht aus wie ein Nachweis.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const roh = process.argv.slice(2);
const wert = (name, vorgabe) => { const i = roh.indexOf(name); return i > -1 ? roh[i + 1] : vorgabe; };
const argumente = roh.filter((a, i) => !a.startsWith('--') && !(i > 0 && roh[i - 1].startsWith('--')));

if (argumente.length !== 1) {
  console.error('Aufruf: node tools/paper-zu-pdf.mjs <paper.html> [--ziel <pfad.pdf>]');
  process.exit(2);
}
const QUELLE = resolve(WURZEL, argumente[0]);
if (!existsSync(QUELLE)) { console.error('FEHLT: ' + argumente[0]); process.exit(2); }
const ZIEL = resolve(wert('--ziel', QUELLE.replace(/\.html$/, '.pdf')));

/* ---- 1. Schriften holen und einbetten ------------------------------------ */

const FONT_CSS_URL = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=Source+Code+Pro:wght@400;600&family=Inter:wght@400;500;600&display=swap';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function hole(url, binaer) {
  return execFileSync('curl', ['-sSfL', '-A', UA, url],
    { maxBuffer: 64 * 1024 * 1024, encoding: binaer ? 'buffer' : 'utf8' });
}

console.log('→ Schriften holen …');
let css;
try { css = hole(FONT_CSS_URL, false); }
catch (e) { console.error('✗ Das Schriften-Verzeichnis war nicht erreichbar: ' + (e.message || e)); process.exit(1); }

/* Nur die lateinischen Blöcke: der Kommentar VOR einem @font-face nennt die
   Schriftgruppe. `latin-ext` bringt die deutschen Anführungszeichen mit. */
const bloecke = css.split('/*').map(s => '/*' + s).filter(s => /@font-face/.test(s));
const latein = bloecke.filter(s => /^\/\*\s*latin(-ext)?\s*\*\//.test(s.trim()));
if (latein.length === 0) { console.error('✗ Kein lateinischer Schnitt im Schriften-CSS gefunden.'); process.exit(1); }

let eingebettet = '';
let anzahl = 0;
for (const block of latein) {
  const m = block.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
  if (!m) continue;
  const daten = hole(m[1], true);
  eingebettet += block.replace(m[1], 'data:font/woff2;base64,' + daten.toString('base64'));
  anzahl++;
}
console.log('  ' + anzahl + ' lateinische Schnitte eingebettet');

/* ---- 2. Arbeitskopie bauen ------------------------------------------------ */

let html = readFileSync(QUELLE, 'utf8');
const linkZeile = /<link[^>]+fonts\.googleapis\.com[^>]*>/g;
if (!linkZeile.test(html)) { console.error('✗ Keine Google-Fonts-Zeile in der Datei — nichts zu ersetzen.'); process.exit(1); }
html = html
  .replace(/<link[^>]+rel="preconnect"[^>]*>\s*/g, '')
  .replace(linkZeile, '<style>' + eingebettet + '</style>');

const arbeitsOrdner = join(tmpdir(), 'sbkim-paper-druck');
mkdirSync(arbeitsOrdner, { recursive: true });
const arbeitsDatei = join(arbeitsOrdner, 'druck-' + Date.now() + '.html');
writeFileSync(arbeitsDatei, html, 'utf8');

/* ---- 3. Laden, PRÜFEN, drucken ------------------------------------------- */

const { chromium } = await import('playwright-core');
/* Der Chromium liegt im Environment und wird NICHT nachgeladen. Ohne den
   ausdruecklichen Pfad sucht playwright-core seine eigene Revision und
   verlangt `npx playwright install` — dasselbe Vorgehen wie in
   tools/html-zu-pdf.mjs, damit nicht zwei Werkzeuge zwei Wege kennen. */
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const seite = await browser.newPage();
await seite.goto(pathToFileURL(arbeitsDatei).href, { waitUntil: 'load' });
await seite.evaluate(() => document.fonts.ready);

const befund = await seite.evaluate(() => {
  const t = document.querySelector('.paper-title');
  const text = document.body.innerText;
  return {
    titel: t ? t.innerText.replace(/\s+/g, ' ').trim() : '',
    zeichen: text.length,
    hatKuerzelAufgeloest: /SBKIM:\s*(Ein Protokoll|A Protocol)/.test(t ? t.innerText.replace(/\s+/g,' ') : ''),
    serifeGeladen: (() => {
      try { return document.fonts.check("16px 'Source Serif 4'"); } catch (_e) { return false; }
    })(),
    abschnitte: Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim()),
  };
});

const fehler = [];
if (!befund.hatKuerzelAufgeloest) fehler.push('Der Titel löst das Kürzel SBKIM nicht auf: „' + befund.titel + '"');
if (befund.zeichen < 20000) fehler.push('Der Fließtext ist zu kurz (' + befund.zeichen + ' Zeichen) — die Seite ist wohl nicht fertig geladen.');
if (!befund.serifeGeladen) fehler.push('Die Schrift „Source Serif 4" ist NICHT geladen — das PDF bekäme eine Ersatzschrift.');
if (befund.abschnitte.length < 9) fehler.push('Nur ' + befund.abschnitte.length + ' Hauptabschnitte gefunden, erwartet sind mindestens 9.');

if (fehler.length) {
  console.error('\n✗ Vor dem Druck gestoppt — es wurde KEIN PDF geschrieben:');
  for (const f of fehler) console.error('  · ' + f);
  await browser.close();
  process.exit(1);
}
console.log('  ✓ Titel, Schrift, Umfang und ' + befund.abschnitte.length + ' Abschnitte geprüft');

await seite.pdf({
  path: ZIEL, format: 'A4', printBackground: true,
  margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' },
});
await browser.close();
console.log('✓ ' + ZIEL);
