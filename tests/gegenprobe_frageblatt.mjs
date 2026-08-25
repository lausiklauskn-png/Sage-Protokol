/* gegenprobe_frageblatt.mjs — Gegenprobe zu `smoke_frageblatt.mjs`.
 *
 * Lauf:  node tests/gegenprobe_frageblatt.mjs
 *
 * Baut neun Fehler ein. **Jeder einzelne MUSS die Probe umwerfen.** Wirft er
 * sie nicht um, ist der Waechter an dieser Stelle blind, und ein blinder
 * Waechter ist schlimmer als keiner, weil sein Gruen beruhigt.
 *
 * Sabotiert wird die QUELLE (das Werkzeug oder die Markdown-Datei) und das
 * Blatt danach neu gebaut. Nur so misst die Gegenprobe echte Defekte statt
 * einer von Hand verbogenen Datei.
 *
 * FALL 1 IST DER, DER WIRKLICH PASSIERT IST (2026-08-25): `display:grid` auf
 * dem Listenpunkt. Auf Klaus' Tablet wurde daraus ein Wort je Zeile, weil
 * jedes `<strong>` im Satz zu einem eigenen Grid-Element wird.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const BAUER = 'tools/frageblatt-bauen.mjs';
const MD = 'docs/STEUERBERATER_FRAGEN.md';
const BLATT = 'docs/frageblatt.html';
const ANGEFASST = [BAUER, MD, BLATT];
const SICHER = new Map(ANGEFASST.map((r) => [r, readFileSync(P(r), 'utf-8')]));
const zurueck = () => { for (const [r, t] of SICHER) writeFileSync(P(r), t, 'utf-8'); };

/* Gemessen wird, ob sich die Datei WIRKLICH geaendert hat. Ein `grep`, das
   etwas findet, belegt nicht, dass der Eingriff gegriffen hat. */
function ersetze(datei, alt, neu) {
  const vorher = readFileSync(P(datei), 'utf-8');
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) throw new Error('ANKER GREIFT NICHT in ' + datei);
  writeFileSync(P(datei), nachher, 'utf-8');
}

const bauen = () => execFileSync(process.execPath, [P(BAUER)], { cwd: WURZEL, stdio: 'pipe' });

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P('tests/smoke_frageblatt.mjs')],
      { cwd: WURZEL, stdio: 'pipe' });
    return true;
  } catch { return false; }
}

const FAELLE = [
  {
    was: 'display:grid auf dem Listenpunkt (der Fehler vom 2026-08-25)',
    bauen: () => { ersetze(BAUER, 'li{margin:.42rem 0}',
      'li{margin:.42rem 0;display:grid;grid-template-columns:1.7rem 1fr}'); bauen(); },
  },
  {
    was: 'display:flex auf dem Absatz, dieselbe Falle eine Etage hoeher',
    bauen: () => { ersetze(BAUER, 'p{margin:.75rem 0}',
      'p{margin:.75rem 0;display:flex;gap:.4rem}'); bauen(); },
  },
  {
    was: 'Die Nummerierung haengt nicht mehr am ::marker',
    bauen: () => { ersetze(BAUER, 'li::marker{color:var(--akzent);font-weight:600}',
      'li{color:var(--tinte)}'); bauen(); },
  },
  {
    was: 'Der Leser verschluckt jede Zeile mit einem Doppelpunkt am Ende',
    bauen: () => { ersetze(BAUER, 'const rumpf = markdown(',
      'const rumpf = ((t) => markdown(t.split("\\n").filter((z) => !/:$/.test(z)).join("\\n"))) ('); bauen(); },
  },
  {
    was: 'Der BOM faellt weg (heruntergeladen wird daraus Buchstabensalat)',
    bauen: () => { ersetze(BAUER, '`\\uFEFF<!DOCTYPE html>', '`<!DOCTYPE html>'); bauen(); },
  },
  {
    /* Nicht loeschen, sondern WIRKUNGSLOS machen. Das Wort steht dann noch da,
       und genau daran war der Waechter beim ersten Lauf blind. */
    was: 'Das Druck-Stylesheet steht noch da, gilt aber nie',
    bauen: () => { ersetze(BAUER, '@media print{', '@media print and (min-width:99999px){'); bauen(); },
  },
  {
    was: 'Tabellenkoepfe wiederholen sich im Druck nicht mehr',
    bauen: () => { ersetze(BAUER, 'thead{display:table-header-group}', 'thead{display:table-row-group}'); bauen(); },
  },
  {
    /* ZWEI EINGRIFFE IN EINEM FALL, und das ist Absicht. Die Quelle enthaelt
       gar keinen Verweis; den Umschreiber allein lahmzulegen aendert deshalb
       nichts, und der Fall waere inert. Erst ein eingefuegter Verweis stellt
       die Lage her, die der Waechter bewacht. */
    was: 'Ein relativer Verweis rutscht durch (auf dem Tablet ein toter Link)',
    bauen: () => {
      ersetze(MD, '## 2 · Mein Ziel, in einem Satz',
        'Siehe [die Aufstellung](docs/historie/arbeitstage.html).\n\n## 2 · Mein Ziel, in einem Satz');
      ersetze(BAUER, "(/^(https?:|mailto:|#)/.test(u) ? u : ROH +", "(true ? u : ROH +");
      bauen();
    },
  },
  {
    was: 'Die Quelle aendert sich, das Blatt wird nicht neu gebaut',
    bauen: () => { ersetze(MD, '## 1 · Der Sachverhalt in sieben Sätzen',
      '## 1 · Der Sachverhalt in sieben Sätzen, nachgetragen'); },
  },
];

console.log('Gegenprobe Frageblatt — ' + FAELLE.length + ' eingebaute Fehler\n');

let durchgerutscht = 0;
try {
  bauen();
  if (!probeLaeuftDurch()) {
    console.log('  ROT  0 · AUSGANGSLAGE schon rot — die Gegenprobe misst nichts');
    durchgerutscht++;
  } else {
    console.log('  ok   0 · Ausgangslage gruen');
  }

  for (const [n, fall] of FAELLE.entries()) {
    zurueck();
    let gefangen;
    try {
      fall.bauen();
      gefangen = !probeLaeuftDurch();
    } catch (e) {
      console.log('  ??   ' + (n + 1) + ' · ' + fall.was + '\n       ' + e.message);
      durchgerutscht++;
      continue;
    }
    console.log((gefangen ? '  ok   ' : '  ROT  ') + (n + 1) + ' · '
      + (gefangen ? 'gefangen: ' : 'DURCHGERUTSCHT: ') + fall.was);
    if (!gefangen) durchgerutscht++;
  }
} finally {
  zurueck();
  try { bauen(); } catch { /* die Ausgangslage steht schon durch zurueck() */ }
}

console.log(durchgerutscht === 0
  ? '\ngegenprobe_frageblatt: alle ' + FAELLE.length + ' Fehler gefangen'
  : '\ngegenprobe_frageblatt: ' + durchgerutscht + ' DURCHGERUTSCHT');
process.exit(durchgerutscht === 0 ? 0 : 1);
