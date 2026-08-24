/* gegenprobe_arbeitstage.mjs — Gegenprobe zu `smoke_arbeitstage.mjs`.
 *
 * Lauf:  node tests/gegenprobe_arbeitstage.mjs
 *
 * Baut Fehler ein. **Jeder einzelne MUSS die Probe umwerfen.** Wirft er sie
 * nicht um, ist der Wächter an dieser Stelle blind, und ein blinder Wächter ist
 * schlimmer als keiner, weil sein Grün beruhigt.
 *
 * Sabotiert wird der WEG (die Werkzeuge) und danach neu gebaut. Nur so misst
 * die Gegenprobe echte Defekte statt einer von Hand verbogenen Datei.
 *
 * DIE AUSGELESENEN DATEN werden NICHT angefasst: `historie.json` zu erzeugen
 * dauert Minuten und braucht vollständige Klone, die es in einem frischen
 * Container nicht gibt.
 *
 * DAS PDF WIRD NICHT NEU GEBAUT. Es hängt am Blatt, nicht an den Zahlen, und
 * ein Chromium-Lauf je Fall würde die Gegenprobe unbenutzbar langsam machen.
 * Was daran ungeprüft bleibt, steht am Ende der Ausgabe.
 *
 * VIER FÄLLE ZIELEN AUF SÄTZE, NICHT AUF FUNKTION. Das ist Absicht: das Blatt
 * kann einer Behörde vorgelegt werden. Eine Spalte, die „gearbeitet" behauptet,
 * oder ein fehlender Hinweis auf die herausgerechneten Dienste macht die
 * Aufstellung angreifbar, ohne dass eine einzige Zahl falsch wäre.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const ANGEFASST = [
  'tools/arbeitstage-bauen.mjs',
  'tools/arbeitstage-rechnen.mjs',
  'tools/historie-bericht-bauen.mjs',
  'docs/historie/arbeitstage.html',
  'docs/historie/arbeitstage-tage.csv',
  'docs/historie/arbeitstage-taetigkeiten.csv',
  'docs/historie/historie.html',
];
const SICHER = new Map(ANGEFASST.map((r) => [r, readFileSync(P(r), 'utf-8')]));
const zurueck = () => { for (const [r, t] of SICHER) writeFileSync(P(r), t, 'utf-8'); };

/* GEMESSEN, ob sich die Datei wirklich geändert hat. Ein `grep` auf einen
   mehrzeiligen Anker prüft die Zeilen einzeln und mit ODER; er meldet Erfolg,
   wo nichts ersetzt wurde. Dieser Fehler hat schon einmal vier Fälle stumm
   gemacht. */
function ersetze(datei, alt, neu) {
  const vorher = readFileSync(P(datei), 'utf-8');
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) throw new Error('ANKER GREIFT NICHT in ' + datei);
  writeFileSync(P(datei), nachher, 'utf-8');
}

const bauBlatt = () => execFileSync(process.execPath,
  [P('tools/arbeitstage-bauen.mjs')], { cwd: WURZEL, stdio: 'pipe' });
const bauHistorie = () => execFileSync(process.execPath,
  [P('tools/historie-bericht-bauen.mjs')], { cwd: WURZEL, stdio: 'pipe' });

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P('tests/smoke_arbeitstage.mjs')],
      { cwd: WURZEL, stdio: 'pipe' });
    return true;
  } catch { return false; }
}

const B = 'tools/arbeitstage-bauen.mjs';
const R = 'tools/arbeitstage-rechnen.mjs';
const H = 'tools/historie-bericht-bauen.mjs';

const FAELLE = [
  {
    was: 'Eine Spaltenüberschrift behauptet „gearbeitet"',
    bauen: () => {
      ersetze(B, '<th data-spalte="spanne">Spanne<small>erster bis letzter</small></th>',
        '<th data-spalte="spanne">gearbeitet<small>Stunden</small></th>');
      bauBlatt();
    },
  },
  {
    was: 'Die zeitgesteuerten Läufe zählen wieder mit',
    bauen: () => {
      ersetze(R, "export const istAutomatik = (c) => /\\[bot\\]/i.test(c.autor || '');",
        'export const istAutomatik = () => false;');
      bauBlatt(); bauHistorie();
    },
  },
  {
    was: 'Ein Dienst wird am Betreff statt an der Kennung erkannt',
    bauen: () => {
      ersetze(R, "export const istAutomatik = (c) => /\\[bot\\]/i.test(c.autor || '');",
        "export const istAutomatik = (c) => /^Tägliche Aktualisierung/.test(c.betreff || '');");
      bauBlatt(); bauHistorie();
    },
  },
  {
    was: 'Der BOM fällt weg, die Umlaute werden zu Fragezeichen',
    bauen: () => {
      ersetze(B, "let h = '﻿';", "let h = '';");
      bauBlatt();
    },
  },
  {
    was: 'Der BOM der Historie fällt weg',
    bauen: () => {
      /* Im Bericht steht der BOM als Escape-Folge im Quelltext, im Blatt als
         Zeichen. Zwei Schreibweisen desselben Bytes: wer den Fall abschreibt
         statt nachzusehen, sabotiert nichts und meldet „nicht gefangen". */
      ersetze(H, "let html = '\\ufeff';", "let html = '';");
      bauHistorie();
    },
  },
  {
    was: 'Ein Tag fehlt in der Übersicht',
    bauen: () => {
      ersetze(B, 'for (const t of liste) {', 'for (const t of liste.slice(1)) {');
      bauBlatt();
    },
  },
  {
    was: 'Die Tätigkeiten sind auf fünf je Tag gekürzt',
    bauen: () => {
      ersetze(B, '  for (const c of t.liste) {\n    h += ',
        '  for (const c of t.liste.slice(0, 5)) {\n    h += ');
      bauBlatt();
    },
  },
  {
    was: 'Die Summe der Spanne ist um zehn Stunden zu hoch',
    bauen: () => {
      ersetze(B, "'<td data-summe=\"spanne\">' + std(gesSpanne) + '</td>'",
        "'<td data-summe=\"spanne\">' + std(gesSpanne + 10) + '</td>'");
      bauBlatt();
    },
  },
  {
    was: 'Der Hinweis auf die herausgerechneten Dienste verliert seine Zahl',
    bauen: () => {
      ersetze(B, "+ zahl(gesAutomatik) + ' der Einträge stammen von einem automatischen Dienst '",
        "+ 'Einige der Einträge stammen von einem automatischen Dienst '");
      bauBlatt();
    },
  },
  {
    was: 'Der Satz, dass die Werte eher zu niedrig sind, verschwindet',
    bauen: () => {
      ersetze(B, '<strong>Beide Werte sind eher zu niedrig als zu ',
        '<strong>Beide Werte sind genau und vollständig, nicht zu ');
      bauBlatt();
    },
  },
  {
    was: 'Die Lücken-Grenze im Text weicht von der des Moduls ab',
    bauen: () => {
      ersetze(B, "+ LUECKE_MIN + ' Minuten zählen mit, ", "+ 90 + ' Minuten zählen mit, ");
      bauBlatt();
    },
  },
  {
    was: 'Das Tabellenblatt schreibt Stunden mit Punkt statt Komma',
    bauen: () => {
      ersetze(B, "const std = (n) => n.toFixed(1).replace('.', ',');",
        'const std = (n) => n.toFixed(1);');
      bauBlatt();
    },
  },
  {
    was: 'Die Tätigkeits-Tabelle nimmt die Dienst-Einträge mit auf',
    bauen: () => {
      ersetze(B, '  for (const c of t.liste) {\n    csvTaet += csvZeile(',
        '  for (const c of t.alle) {\n    csvTaet += csvZeile(');
      bauBlatt();
    },
  },
  {
    was: 'Die Historie nennt eine andere Summe als das Blatt',
    bauen: () => {
      ersetze(H, "+ '<div><b>' + st(az.spanne) + ' h</b><span>Spanne, aufsummiert</span></div>'",
        "+ '<div><b>' + st(az.spanne * 1.1) + ' h</b><span>Spanne, aufsummiert</span></div>'");
      bauHistorie();
    },
  },
  {
    was: 'Die Historie verweist nicht mehr auf das Blatt',
    bauen: () => {
      ersetze(H, "+ '<a href=\"arbeitstage.html\">arbeitstage.html</a>. Daneben liegen '",
        "+ 'einer eigenen Datei. Daneben liegen '");
      bauHistorie();
    },
  },
  {
    was: 'Die Tagesblöcke verlieren ihren Anker, der Sprung geht ins Leere',
    bauen: () => {
      ersetze(B, '<div class="tag" id="t\' + esc(t.datum) + \'"',
        '<div class="tag" id="x\' + esc(t.datum) + \'"');
      bauBlatt();
    },
  },
];

let durch = 0;
console.log('Gegenprobe Arbeitstage, ' + FAELLE.length + ' eingebaute Fehler\n');

try {
  for (const [n, fall] of FAELLE.entries()) {
    zurueck();
    let gefangen;
    try {
      fall.bauen();
      gefangen = !probeLaeuftDurch();
    } catch (e) {
      console.log('  ??   ' + (n + 1) + ' · ' + fall.was + '\n       ' + e.message);
      durch++;
      continue;
    }
    console.log((gefangen ? '  ok   ' : '  ROT  ') + (n + 1) + ' · '
      + (gefangen ? 'gefangen: ' : 'DURCHGERUTSCHT: ') + fall.was);
    if (!gefangen) durch++;
  }
} finally {
  zurueck();
  bauBlatt();
  bauHistorie();
}

console.log('\nNicht Gegenstand dieser Gegenprobe: das PDF (hängt am Blatt, nicht');
console.log('an den Zahlen) und die Tage ohne jeden Eintrag von Hand, die es in');
console.log('den echten Daten nicht gibt. Beide sind in der Probe selbst geprüft,');
console.log('das eine an der Datei, das andere an erfundenen Tagen.');
console.log(durch === 0
  ? '\ngegenprobe_arbeitstage: alle ' + FAELLE.length + ' Fehler gefangen'
  : '\ngegenprobe_arbeitstage: ' + durch + ' DURCHGERUTSCHT');
process.exit(durch === 0 ? 0 : 1);
