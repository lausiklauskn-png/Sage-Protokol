/* paper-pdf-pruefen.mjs — prueft ein FERTIGES PDF auf zerrissene Tabellen.
 *
 * Aufruf:  node tools/paper-pdf-pruefen.mjs <datei.pdf>
 * Braucht `pdftotext` (poppler-utils).
 *
 * ── WARUM ES DIESES WERKZEUG GIBT ─────────────────────────────────────────
 *
 * Am 2026-09-03 hat Klaus DREIMAL eine zerrissene Tabelle gemeldet, und
 * dreimal hat eine Pruefung von mir sie nicht gesehen:
 *
 *   1. Der erste Anlauf suchte Seiten, die mit einer Grossbuchstaben-Zeile
 *      BEGINNEN. Damit war „Tabelle zerrissen" von „Tabelle beginnt sauber
 *      oben auf einer neuen Seite" nicht zu unterscheiden.
 *   2. Der zweite prueft die Lage im Druck-LAYOUT des Browsers. Das ist ein
 *      Hinweis, kein Beweis -- der Browser verschiebt beim eigentlichen
 *      Druck noch.
 *   3. Der dritte suchte Seiten, die mit einer Tabellenzeile ENDEN. Der
 *      meldete jede Tabelle, die sauber am Seitenfuss AUFHOERT.
 *
 * ── DIE ZUSICHERUNG, UM DIE ES GEHT ───────────────────────────────────────
 *
 * Eine Tabelle ist zerrissen, wenn eine Seite IN ihr endet UND die naechste
 * IN ihr beginnt. Beides einzeln ist harmlos; erst zusammen ist es der
 * Fehler. Genau so steht es unten, und deshalb kann diese Pruefung das
 * Richtige vom Falschen unterscheiden.
 *
 * Erkannt wird eine Tabellenzeile daran, dass in ihr mindestens einmal drei
 * oder mehr Leerzeichen zwischen zwei Zeichen stehen -- so setzt
 * `pdftotext -layout` Spalten. Fliesstext hat das nicht.
 */

import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const argumente = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (argumente.length !== 1) {
  console.error('Aufruf: node tools/paper-pdf-pruefen.mjs <datei.pdf>');
  process.exit(2);
}
const PDF = resolve(argumente[0]);
if (!existsSync(PDF)) { console.error('FEHLT: ' + argumente[0]); process.exit(2); }

const txt = join(tmpdir(), 'paper-pruef-' + Date.now() + '.txt');
try {
  execFileSync('pdftotext', ['-layout', PDF, txt]);
} catch (e) {
  console.error('✗ `pdftotext` liess sich nicht ausfuehren. Ohne es kann dieses');
  console.error('  Werkzeug nichts messen — das ist NICHT lauffaehig, nicht gruen.');
  console.error('  Abhilfe: apt-get install poppler-utils');
  process.exit(2);
}

const seiten = readFileSync(txt, 'utf8').split('\f')
  .map((s) => s.split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l.trim()))
  .filter((s) => s.length);
try { unlinkSync(txt); } catch (_e) { /* egal */ }

const istTabellenzeile = (zeile) => /\S {3,}\S/.test(zeile || '');

const zerrissen = [];
for (let i = 0; i < seiten.length - 1; i++) {
  const endetInTabelle  = istTabellenzeile(seiten[i][seiten[i].length - 1]);
  const beginntInTabelle = istTabellenzeile(seiten[i + 1][0]);
  if (endetInTabelle && beginntInTabelle) {
    zerrissen.push({ von: i + 1, nach: i + 2,
                     ende: seiten[i][seiten[i].length - 1].trim().slice(0, 56),
                     anfang: seiten[i + 1][0].trim().slice(0, 56) });
  }
}

console.log(seiten.length + ' Seiten, Zeilen je Seite: ' + seiten.map((s) => s.length).join(' '));

if (zerrissen.length === 0) {
  console.log('✓ Keine Tabelle laeuft ueber eine Seitengrenze.');
  process.exit(0);
}
console.log('✗ ' + zerrissen.length + ' zerrissene Tabelle(n):');
for (const z of zerrissen) {
  console.log('   · Seite ' + z.von + ' → ' + z.nach);
  console.log('     endet:   ' + z.ende);
  console.log('     beginnt: ' + z.anfang);
}
process.exit(1);
