/* gegenprobe_forschungsaufgaben.mjs, Gegenprobe zu `smoke_forschungsaufgaben.mjs`.
 *
 * Lauf:  node tests/gegenprobe_forschungsaufgaben.mjs
 *
 * Baut Fehler ein. **Jeder einzelne MUSS die Probe umwerfen.**
 *
 * Die ersten beiden Fälle sind der Anlass des ganzen Blattes: eine Aufgabe,
 * die vorgibt fertig zu sein, und eine, die als fehlend geführt wird, obwohl
 * ihr Ergebnis dasteht. Beide haben keine falsche Zahl darin.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const ANGEFASST = [
  'tools/forschungsaufgaben-bauen.mjs',
  'docs/unterlagen/06_FORSCHUNGSAUFGABEN.md',
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
  [P('tools/forschungsaufgaben-bauen.mjs')], { cwd: WURZEL, stdio: 'pipe' });

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P('tests/smoke_forschungsaufgaben.mjs')],
      { cwd: WURZEL, stdio: 'pipe' });
    return true;
  } catch { return false; }
}

const B = 'tools/forschungsaufgaben-bauen.mjs';

const FAELLE = [
  /* ── Der Anlass des Blattes ───────────────────────────────────────────── */
  {
    was: 'Eine Aufgabe ohne Datei meldet trotzdem ein Ergebnis',
    bauen: () => {
      ersetze(B, "  : (a.s.da ? '**Ergebnis liegt vor**' : '**Ergebnis fehlt**');",
        "  : '**Ergebnis liegt vor**';");
      bauen();
    },
  },
  {
    was: 'Eine Aufgabe mit Datei meldet trotzdem, das Ergebnis fehle',
    bauen: () => {
      ersetze(B, "  : (a.s.da ? '**Ergebnis liegt vor**' : '**Ergebnis fehlt**');",
        "  : '**Ergebnis fehlt**';");
      bauen();
    },
  },
  {
    /* Der Zenodo-Fall. Wer ihn als vorhanden führt, meldet eine
       Veröffentlichung, die nie stattgefunden hat. */
    was: 'Der Zenodo-Upload wird als vorhandenes Ergebnis geführt',
    bauen: () => {
      ersetze(B,
        "  { nr: 3, titel: 'Die zwei vorhandenen Papers auf Zenodo', strang: 'alle drei',\n    sichtbar: false,",
        "  { nr: 3, titel: 'Die zwei vorhandenen Papers auf Zenodo', strang: 'alle drei',\n    sichtbar: true,");
      bauen();
    },
  },
  {
    was: 'Das Blatt behauptet im Kopf, Aufgaben seien erledigt',
    bauen: () => {
      ersetze(B, '**Von ${mitStand.length} Aufgaben ist keine einzige erledigt.**',
        '**Von ${mitStand.length} Aufgaben sind ${angefangen.length} erledigt.**');
      bauen();
    },
  },
  {
    was: 'Das Blatt verschweigt, dass ein Beleg nicht „erledigt" bedeutet',
    bauen: () => {
      ersetze(B, 'Ein Beleg sagt, dass eine Datei da ist. Er sagt nicht, dass die Aufgabe fertig\nist.',
        'Ein Beleg zeigt den Fortschritt.');
      bauen();
    },
  },
  /* ── Die Vollständigkeit ──────────────────────────────────────────────── */
  {
    was: 'Ein Forschungsstrang fällt heraus',
    bauen: () => {
      ersetze(B, '${straengeMitStand.map((s) =>', '${straengeMitStand.slice(1).map((s) =>');
      bauen();
    },
  },
  {
    was: 'Eine Aufgabe verliert die Angabe, wovon sie abhängt',
    bauen: () => {
      ersetze(B, '| Hängt ab von | ${a.haengtAn || ', '| ${a.haengtAn || ');
      bauen();
    },
  },
  {
    was: 'Eine Aufgabe verliert die Angabe, was ihr noch fehlt',
    bauen: () => {
      ersetze(B, '| Was noch fehlt | ${a.fehlt} |', '| ${a.fehlt} |');
      bauen();
    },
  },
  {
    was: 'Die Tabelle führt nur noch die Hälfte der Aufgaben',
    bauen: () => {
      ersetze(B, '${mitStand.map((a) => \'| **\' + a.nr', '${mitStand.slice(0, 3).map((a) => \'| **\' + a.nr');
      bauen();
    },
  },
  /* ── Die Sätze über die eigenen Grenzen ───────────────────────────────── */
  {
    was: 'Das Blatt verschweigt, dass es die Güte nicht messen kann',
    bauen: () => {
      ersetze(B, 'Es misst, **ob** eine Datei da ist, nicht ob sie taugt.',
        'Es zeigt den Stand jeder Aufgabe zuverlässig.');
      bauen();
    },
  },
  {
    was: 'Das Blatt verschweigt, dass es Arbeit außerhalb des Depots nicht sieht',
    bauen: () => {
      ersetze(B, '**Und es kennt keine Arbeit, die außerhalb des Depots geschieht.**',
        '**Und es erfasst jede Arbeit an diesen Aufgaben.**');
      ersetze(B, 'hinterlassen hier keine Spur, bis jemand sie einträgt.',
        'werden hier ebenfalls geführt.');
      bauen();
    },
  },
];

let durch = 0;
console.log('gegenprobe_forschungsaufgaben: ' + FAELLE.length + ' eingebaute Fehler\n');
try {
  for (let n = 0; n < FAELLE.length; n++) {
    const fall = FAELLE[n];
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
} finally { zurueck(); bauen(); }

console.log(durch === 0
  ? '\ngegenprobe_forschungsaufgaben: alle ' + FAELLE.length + ' Fehler gefangen'
  : '\ngegenprobe_forschungsaufgaben: ' + durch + ' DURCHGERUTSCHT');
process.exit(durch === 0 ? 0 : 1);
