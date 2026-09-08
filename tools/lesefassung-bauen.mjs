/*
 * ⚠ GEKÜRZT AM 2026-09-02. Dieses Werkzeug legte einmal zehn Blätter ab; sieben
 * davon gehören nicht in ein öffentliches Depot und liegen seitdem woanders.
 * Was hier bleibt, ist das Fachliche.
 *
 * Wer ein Blatt vermisst: es fehlt nicht, es ist nicht hier.
 */
/* lesefassung-bauen.mjs, dieselben Unterlagen zum Lesen.
 *
 * Aufruf:  node tools/lesefassung-bauen.mjs
 *
 * ── WARUM ES EINE ZWEITE FASSUNG GIBT UND SIE TROTZDEM KEINE DRIFT IST ────
 *
 * `docs/unterlagen.html` ist die ARBEITS-Mappe: alle Abteilungen in einer
 * Datei, mit Download- und Druck-Knoepfen und der Markier-Schicht, die eine
 * Auslese-Liste fuer die naechste Sitzung schreibt.
 *
 * Die Lesefassung ist etwas anderes: EIN Blatt je Datei, ruhig gesetzt, mit
 * einem Markier-Werkzeug, das auf dem Tablet nicht mit dem Kopier-Menue
 * kaempft. Klaus 2026-08-26: „einfach nur, damit das Lesen mehr Spass macht."
 *
 * ⚠ ZWEI FASSUNGEN DESSELBEN TEXTES WAEREN EINE DRIFT-QUELLE MIT ANSAGE.
 *   Deshalb kommt der Inhalt hier aus DENSELBEN `.md`-Dateien und durch
 *   DENSELBEN Wandler (`markdown-mini.mjs`) wie die Mappe. Unterschiedlich
 *   ist nur die Huelle: Stil, Kopf, Fuss, Werkzeug. Wer den Text aendert,
 *   aendert ihn an einer Stelle, und beide Fassungen ziehen nach.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdown, escape } from './markdown-mini.mjs';
import { LESE_STIL } from './lesefassung-stil.mjs';
import { MARKER_STIL, MARKER_HTML, MARKER_SKRIPT } from './lesefassung-marker.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...t) => join(WURZEL, ...t);
const ZIEL = P('docs', 'lesen');
const heute = new Date().toISOString().slice(0, 10);

/* Dieselben Nummern wie in `docs/ausgabe/`: nach Namen sortiert stehen die
   Blaetter von selbst in der Reihenfolge des Vorgehens. */
const BLAETTER = [
  { nr: 70, kennung: 'forschungsaufgaben', titel: 'Forschungsaufgaben',
    unter: 'Was ansteht, in welcher Reihenfolge',
    quelle: 'docs/unterlagen/06_FORSCHUNGSAUFGABEN.md' },
  { nr: 75, kennung: 'abgrenzung', titel: 'Stand der Technik und Abgrenzung',
    unter: 'Die Frage, die eine Gutachterin zuerst stellt',
    quelle: 'docs/ABGRENZUNG.md' },
  { nr: 80, kennung: 'entstehung', titel: 'Woher das kommt',
    unter: 'Klaus’ eigene Darstellung',
    quelle: 'docs/papers/ENTSTEHUNG.md' },
];

/* Verweise auf andere `.md`-Dateien zeigen in der Lesefassung auf das
   entsprechende Blatt, wenn es eines gibt. Sonst bleiben sie stehen und
   fuehren ins Depot: ein Verweis, der ins Leere zeigt, sieht aus wie eine
   Auskunft. */
const NACH_BLATT = new Map(BLAETTER.map((b) => [b.quelle, dateiname(b)]));
function dateiname(b) {
  return String(b.nr).padStart(2, '0') + '_' + b.kennung + '.html';
}
function verweis(u) {
  if (/^(https?:|mailto:|#)/.test(u)) return u;
  const roh = u.split('#')[0];
  for (const [q, ziel] of NACH_BLATT) {
    if (q.endsWith('/' + roh) || q === roh || q.endsWith(roh)) return ziel;
  }
  return 'https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/'
    + roh.replace(/^\.\.\//, 'docs/').replace(/^\.\//, 'docs/');
}

function seite(b, html, nachbarn) {
  const bomZeichen = '﻿';
  return bomZeichen + [
    '<!doctype html>',
    '<html lang="de">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>' + escape(b.titel) + '</title>',
    '<meta name="robots" content="noindex">',
    '<style>' + LESE_STIL + MARKER_STIL + '</style>',
    '</head>',
    '<body data-blatt="' + b.kennung + '" data-modus="lesen" data-lm-wurzel="main">',
    '<main>',
    '<header class="kopf">',
    '<h1>' + escape(b.titel) + '</h1>',
    '<p class="unter">' + escape(b.unter) + ' &middot; Lesefassung vom ' + heute + '</p>',
    '</header>',
    html,
    '<footer class="fuss">',
    '<p><strong>Lesefassung.</strong> Derselbe Text wie in der Mappe, nur ruhiger '
      + 'gesetzt. Ge&auml;ndert wird an der Quelle <code>' + escape(b.quelle)
      + '</code>, dann ziehen beide Fassungen nach.</p>',
    '<p>' + nachbarn + '</p>',
    '<p>Markierungen liegen nur in <strong>diesem</strong> Browser und werden '
      + 'nicht gedruckt.</p>',
    '</footer>',
    '</main>',
    MARKER_HTML,
    '<script>' + MARKER_SKRIPT + '</script>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

/* ── Bauen ─────────────────────────────────────────────────────────────── */

/* ⚠ NUR BEIM DIREKTEN AUFRUF. Der Rumpf unten loescht `docs/lesen/` und baut es
 * neu — mit dem Tagesdatum im Kopf jedes Blattes. Stand er auf oberster Ebene,
 * tat ein blosser `import` dasselbe, und genau das ist passiert:
 * `tests/smoke_werkzeuge_lauffaehig.mjs` laedt jedes Werkzeug, um zu pruefen,
 * ob es sich ueberhaupt laden laesst. Ihr eigener Kopf sagt dazu „Ausfuehren
 * schriebe Dateien und kostete Minuten. Ein Import fuehrt den Modulkopf aus" —
 * bei DIESEM Werkzeug war der Modulkopf das ganze Programm.
 *
 * Die Folge sah harmlos aus und war es nicht: nach jedem `npm test` standen vier
 * geaenderte Dateien im Arbeitsbaum, die niemand angefasst hatte. Wer danach
 * `git add -A` sagte, nahm sie in einen Commit auf, dessen Nachricht von etwas
 * anderem handelte. Gefunden am 2026-09-04, beim Aufraeumen genau so eines
 * Commits.
 *
 * Und `if (fehlend) process.exit(1)` ganz unten war die zweite Haelfte: ein
 * Import haette die importierende Probe beendet und alles danach verschluckt.
 *
 * Dieselbe Bauart wie in Kimhub (`tools/forschung-bauen.mjs`, 2026-08-26): der
 * Rumpf steht hinter einem Direkt-Riegel, die Definitionen darueber sind frei
 * importierbar. */
const DIREKT = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (DIREKT) {

if (existsSync(ZIEL)) rmSync(ZIEL, { recursive: true });
mkdirSync(ZIEL, { recursive: true });

let fehlend = 0;
const gebaut = [];

for (let i = 0; i < BLAETTER.length; i++) {
  const b = BLAETTER[i];
  if (!existsSync(P(b.quelle))) {
    console.error('  FEHLT: ' + b.quelle);
    fehlend++;
    continue;
  }
  const md = readFileSync(P(b.quelle), 'utf-8');
  /* Die erste Ueberschrift faellt weg: sie steht schon im Kopf. Zweimal
     dasselbe untereinander sieht nach einem Fehler aus. */
  const ohneH1 = md.replace(/^#\s+.*\n/, '');
  const html = markdown(ohneH1, verweis)
    .replace(/<table>/g, '<div class="tabelle"><table>')
    .replace(/<\/table>/g, '</table></div>');

  const vor = BLAETTER[i - 1], nach = BLAETTER[i + 1];
  const nachbarn = [
    vor ? '&larr; <a href="' + dateiname(vor) + '">' + escape(vor.titel) + '</a>' : '',
    nach ? '<a href="' + dateiname(nach) + '">' + escape(nach.titel) + '</a> &rarr;' : '',
  ].filter(Boolean).join(' &nbsp;&middot;&nbsp; ');

  const datei = dateiname(b);
  writeFileSync(join(ZIEL, datei), seite(b, html, nachbarn), 'utf-8');
  gebaut.push({ datei, titel: b.titel, quelle: b.quelle });
}

/* Ein Eingang davor. Wer den Ordner oeffnet, soll nicht raten muessen. */
const eingang = '﻿' + [
  '<!doctype html>', '<html lang="de">', '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  '<title>Unterlagen zum Lesen</title>',
  '<meta name="robots" content="noindex">',
  '<style>' + LESE_STIL + '</style>',
  '</head>', '<body><main>',
  '<header class="kopf"><h1>Unterlagen zum Lesen</h1>',
  '<p class="unter">Lesefassung vom ' + heute + ' &middot; '
    + gebaut.length + ' Bl&auml;tter</p></header>',
  '<p>Dieselben Texte wie in der Mappe, ruhiger gesetzt, mit einem '
    + 'Markier-Werkzeug f&uuml;r Tablet und Schreibtisch. Die Nummern sind die '
    + 'Reihenfolge des Vorgehens.</p>',
  '<ol>',
  ...gebaut.map((g) => '<li><a href="' + g.datei + '">' + escape(g.titel)
    + '</a><br><span class="unter">' + escape(g.quelle) + '</span></li>'),
  '</ol>',
  '<footer class="fuss"><p>Zum Ausdrucken und Weitergeben liegen dieselben '
    + 'Bl&auml;tter als PDF in <code>docs/ausgabe/</code>.</p></footer>',
  '</main></body></html>', '',
].join('\n');
writeFileSync(join(ZIEL, '00_index.html'), eingang, 'utf-8');

console.log('geschrieben: docs/lesen/');
console.log('  ' + gebaut.length + ' Blätter' + (fehlend ? ' · ' + fehlend + ' FEHLEN' : ''));
for (const g of gebaut) console.log('    ' + g.datei);
if (fehlend) process.exit(1);

}
