/* paper-seiten-messen.mjs — misst am FERTIGEN PDF, was Klaus am 2026-09-03
 * verlangt hat: keine zerrissenen Saetze, keine zerrissenen Absaetze, keine
 * halbleeren Seiten.
 *
 * Aufruf:  node tools/paper-seiten-messen.mjs <datei.pdf> [weitere.pdf ...]
 * Braucht `pdftotext` (poppler-utils).
 *
 * ── WARUM AM PDF UND NICHT IM BROWSER ─────────────────────────────────────
 *
 * `paper-umbruch-pruefen.mjs` misst die Lage im Druck-Layout des Browsers.
 * Das ist ein Hinweis und kein Beweis, und fuer Tabellen hat es am 2026-09-03
 * ACHT Fehlalarme gemeldet: im fertigen PDF war keine einzige zerrissen.
 * Wer eine CSS-Regel nach dieser Zahl einstellt, stellt sie nach einem
 * Messfehler ein. Dieses Werkzeug liest deshalb das PDF.
 *
 * ── WAS GEMESSEN WIRD ─────────────────────────────────────────────────────
 *
 * SATZ UEBER DER GRENZE. Die letzte Zeile einer Seite endet nicht auf einem
 * Satzzeichen, und die naechste Seite faengt klein an. Dann laeuft ein Satz
 * ueber den Seitenrand. Das ist der Fall, den Klaus ausdruecklich nennt.
 *
 * ABSATZ UEBER DER GRENZE. Dasselbe, aber die Seite darf auf einem Punkt
 * enden: faengt die naechste Seite klein an, gehoert sie zum selben Absatz.
 * Jeder zerrissene Satz ist auch ein zerrissener Absatz, nicht umgekehrt.
 *
 * DUENN BESETZTE SEITEN. Zeilen je Seite gegen den Median aller Seiten. Eine
 * Seite unter 60 % ist der Preis, den eine Zusammenhalte-Regel kostet, und
 * dieser Preis gehoert auf den Tisch: sonst optimiert man einen Wert und
 * verschlechtert stillschweigend den anderen.
 *
 * ⚠ ES IST EIN MESSGERAET, KEIN WAECHTER. Es gibt keinen Rueckgabewert 1 bei
 * Funden — die richtige Zahl haengt vom Text ab und ist eine Abwaegung, keine
 * Zusicherung. Wer daraus eine Probe macht, nagelt eine Zahl fest, die sich
 * mit dem naechsten Absatz aendert.
 */

import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join, basename } from 'node:path';
import { tmpdir } from 'node:os';

const dateien = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!dateien.length) {
  console.error('Aufruf: node tools/paper-seiten-messen.mjs <datei.pdf> [weitere.pdf ...]');
  process.exit(2);
}

/* Ein Satz endet auf . ! ? : oder auf einem schliessenden Anfuehrungszeichen
   dahinter. Ein Doppelpunkt zaehlt mit: was danach kommt, ist ein neuer
   Gedanke, und ein Umbruch dort tut nicht weh. */
const endetSatz = (z) => /[.!?:;]["»”„“]?\s*$/.test(z || '');

/* Faengt die Zeile klein an, ist sie eine Fortsetzung. Aufzaehlungszeichen,
   Ziffern und Grossbuchstaben gelten als Anfang. */
const istFortsetzung = (z) => /^[a-zäöüß]/.test((z || '').trim());

function miss(pfad) {
  const txt = join(tmpdir(), 'seiten-' + process.pid + '-' + Math.random().toString(36).slice(2) + '.txt');
  try {
    execFileSync('pdftotext', ['-layout', pfad, txt]);
  } catch (e) {
    console.error('✗ `pdftotext` liess sich nicht ausfuehren — NICHT lauffaehig, nicht gruen.');
    console.error('  Abhilfe: apt-get install poppler-utils');
    process.exit(2);
  }
  const seiten = readFileSync(txt, 'utf8').split('\f')
    .map((s) => s.split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l.trim()))
    .filter((s) => s.length);
  try { unlinkSync(txt); } catch (_e) { /* egal */ }

  const zeilen = seiten.map((s) => s.length);
  const sortiert = [...zeilen].sort((a, b) => a - b);
  const median = sortiert[Math.floor(sortiert.length / 2)] || 1;

  const satzRisse = [];
  const absatzRisse = [];
  for (let i = 0; i < seiten.length - 1; i++) {
    const letzte = seiten[i][seiten[i].length - 1];
    const erste = seiten[i + 1][0];
    if (!istFortsetzung(erste)) continue;          // naechste Seite faengt neu an
    const eintrag = { von: i + 1, ende: letzte.trim().slice(-46), anfang: erste.trim().slice(0, 46) };
    absatzRisse.push(eintrag);
    if (!endetSatz(letzte)) satzRisse.push(eintrag);
  }

  const duenn = zeilen
    .map((n, i) => ({ seite: i + 1, zeilen: n, anteil: n / median }))
    .filter((s) => s.anteil < 0.6);

  return { seiten: seiten.length, median, zeilen, satzRisse, absatzRisse, duenn };
}

for (const d of dateien) {
  const pfad = resolve(d);
  if (!existsSync(pfad)) { console.error('FEHLT: ' + d); process.exit(2); }
  const m = miss(pfad);

  console.log('\n═══ ' + basename(pfad) + ' ═══');
  console.log('Seiten: ' + m.seiten + '   Median Zeilen je Seite: ' + m.median);
  console.log('Sätze über der Seitengrenze:   ' + m.satzRisse.length);
  console.log('Absätze über der Seitengrenze: ' + m.absatzRisse.length);
  console.log('Dünn besetzte Seiten (<60 %):  ' + m.duenn.length +
    (m.duenn.length ? '  → ' + m.duenn.map((s) => 'S' + s.seite + ' (' + s.zeilen + ')').join(', ') : ''));

  if (m.satzRisse.length) {
    console.log('\n  Zerrissene Sätze:');
    for (const r of m.satzRisse.slice(0, 8)) {
      console.log('   · S' + r.von + ' → S' + (r.von + 1));
      console.log('     endet:   …' + r.ende);
      console.log('     beginnt: ' + r.anfang + '…');
    }
    if (m.satzRisse.length > 8) console.log('   … und ' + (m.satzRisse.length - 8) + ' weitere');
  }
}
