/* gegenprobe_historie.mjs — Gegenprobe zu `smoke_historie.mjs`.
 *
 * Lauf:  node tests/gegenprobe_historie.mjs
 *
 * Baut neun Fehler ein. **Jeder einzelne MUSS die Probe umwerfen.** Wirft er
 * sie nicht um, ist der Waechter an dieser Stelle blind, und ein blinder
 * Waechter ist schlimmer als keiner, weil sein Gruen beruhigt.
 *
 * Sabotiert wird der WEG (`tools/historie-bericht-bauen.mjs`) und der Bericht
 * danach neu gebaut. Nur so misst die Gegenprobe echte Defekte statt einer von
 * Hand verbogenen Datei.
 *
 * DIE AUSGELESENEN DATEN werden NICHT angefasst. `historie.json` zu erzeugen
 * dauert Minuten und braucht vollstaendige Klone, die es in einem frischen
 * Container nicht gibt; ein Fehler darin waere nicht wiederherstellbar.
 * Gesichert und zurueckgeschrieben werden nur das Werkzeug und der Bericht.
 *
 * DREI DER NEUN FAELLE ZIELEN AUF EHRLICHKEITS-SAETZE, nicht auf Funktion.
 * Das ist Absicht: ein Bericht, der seine eigenen Grenzen verschweigt, sieht
 * genauer aus, als er ist, und genau das waere im Antragswesen der teure
 * Fehler. Wer den Satz herausnimmt, muss auffallen.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const ANGEFASST = [
  'tools/historie-bericht-bauen.mjs',
  'tools/historie-marken.mjs',
  'docs/historie/historie.html',
];
const SICHER = new Map(ANGEFASST.map((r) => [r, readFileSync(P(r), 'utf-8')]));
const zurueck = () => { for (const [r, t] of SICHER) writeFileSync(P(r), t, 'utf-8'); };

function ersetze(datei, alt, neu) {
  const vorher = readFileSync(P(datei), 'utf-8');
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) throw new Error('ANKER GREIFT NICHT in ' + datei);
  writeFileSync(P(datei), nachher, 'utf-8');
}

const bauen = () => execFileSync(process.execPath,
  [P('tools/historie-bericht-bauen.mjs')], { cwd: WURZEL, stdio: 'pipe' });

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P('tests/smoke_historie.mjs')],
      { cwd: WURZEL, stdio: 'pipe' });
    return true;
  } catch { return false; }
}

const B = 'tools/historie-bericht-bauen.mjs';

const FAELLE = [
  {
    was: 'Der Bericht nennt eine Commit-Zahl, die nicht gemessen ist',
    bauen: () => {
      ersetze(B, "[zahl(s.commits), 'Commits'],", "[zahl(s.commits + 500), 'Commits'],");
      bauen();
    },
  },
  {
    was: 'Der Bericht zeigt nur die Haelfte der Commits',
    bauen: () => {
      ersetze(B, 'for (const c of liste) html += commitZeile(c)',
        'for (const c of liste.slice(0, Math.ceil(liste.length / 2))) html += commitZeile(c)');
      bauen();
    },
  },
  {
    was: 'Ein Arbeitstag faellt aus dem Verlauf',
    bauen: () => {
      ersetze(B, 'for (const [tag, liste] of tagesListe) {',
        'for (const [tag, liste] of tagesListe.slice(1)) {');
      bauen();
    },
  },
  {
    was: 'Der Satz zu den Untergrenzen verschwindet',
    bauen: () => {
      ersetze(B, 'sind deshalb Untergrenzen, keine ', 'sind vollstaendig, keine ');
      bauen();
    },
  },
  {
    was: 'Der Satz zur Tages-Spanne verschwindet',
    bauen: () => {
      ersetze(B, 'sie ist eine Spanne und keine ',
        'so lange wurde gearbeitet und keine ');
      bauen();
    },
  },
  {
    was: 'Der Hinweis auf die flachen Klone faellt weg',
    bauen: () => {
      ersetze(B, 'Klone waren <em>flach</em> und trugen nur die ',
        'Klone waren vollstaendig und trugen alle ');
      bauen();
    },
  },
  {
    was: 'Eine Rolle verliert ihre gemessene Zahl',
    bauen: () => {
      ersetze(B, '<strong>Gemessen:</strong> ', '<span>Ungefaehr: </span>');
      bauen();
    },
  },
  {
    was: 'Die Sackgassen werden nicht mehr einzeln gekennzeichnet',
    bauen: () => {
      ersetze(B, "(c.aufMain ? 'ja' : 'nein')", "'ja'");
      bauen();
    },
  },
  {
    was: 'Der Filter setzt nur eine Klasse, blendet aber nichts aus',
    bauen: () => {
      ersetze(B, 'html.f-an li.c{display:none}', 'html.f-an li.c{opacity:.99}');
      bauen();
    },
  },
];

let durch = 0;
console.log('Gegenprobe Historie, ' + FAELLE.length + ' eingebaute Fehler\n');

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
  bauen();
}

console.log(durch === 0
  ? '\ngegenprobe_historie: alle ' + FAELLE.length + ' Fehler gefangen'
  : '\ngegenprobe_historie: ' + durch + ' DURCHGERUTSCHT');
process.exit(durch === 0 ? 0 : 1);
