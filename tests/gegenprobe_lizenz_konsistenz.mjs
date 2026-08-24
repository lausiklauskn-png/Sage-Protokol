/* gegenprobe_lizenz_konsistenz.mjs — Gegenprobe zu `smoke_lizenz_konsistenz.mjs`.
 *
 * Lauf:  node tests/gegenprobe_lizenz_konsistenz.mjs
 *
 * Baut acht Fehler ein. **Jeder einzelne MUSS die Probe umwerfen.** Wirft er sie
 * nicht um, ist der Waechter an dieser Stelle blind, und ein blinder Waechter
 * ist schlimmer als keiner, weil sein Gruen beruhigt.
 *
 * SABOTIERT WIRD DIE ZUSICHERUNG, NICHT EINE ZEILE. Die Faelle bilden genau die
 * Fehler nach, die am 2026-08-24 wirklich gefunden wurden: eine Tafel, die nur
 * zur Haelfte nachgezogen wird, und ein Urteil, das in zwei Dateien
 * auseinanderlaeuft.
 *
 * ZWEI FAELLE FAHREN IN BEIDE RICHTUNGEN (Fall 1 und 2): zu viel MIT und zu
 * wenig MIT. Eine Pruefung, die nur eine Richtung faengt, waere gegen den
 * Fehler von 2026-08-24 blind gewesen, denn dort war die eine Zahl zu klein und
 * die andere zu gross.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const FOE = 'docs/FORSCHUNGSFOERDERUNG.md';
const KOR = 'docs/FORSCHUNGSKORPUS.md';
const ANGEFASST = [FOE, KOR];
const SICHER = new Map(ANGEFASST.map((r) => [r, readFileSync(P(r), 'utf-8')]));
const zurueck = () => { for (const [r, t] of SICHER) writeFileSync(P(r), t, 'utf-8'); };

/* Gemessen wird, ob sich die Datei WIRKLICH geaendert hat. Ein `grep`, das
   etwas findet, ist kein Beleg dafuer, dass der Eingriff gegriffen hat. */
function ersetze(datei, alt, neu) {
  const vorher = readFileSync(P(datei), 'utf-8');
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) throw new Error('ANKER GREIFT NICHT in ' + datei);
  writeFileSync(P(datei), nachher, 'utf-8');
}

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P('tests/smoke_lizenz_konsistenz.mjs')],
      { cwd: WURZEL, stdio: 'pipe' });
    return true;
  } catch { return false; }
}

const FAELLE = [
  {
    was: 'Ein Depot wandert nach MIT, die Gegenzahl bleibt stehen (der Fehler von 2026-08-24)',
    bauen: () => ersetze(FOE, '| **MIT** (anerkannt Open Source) | **6**,',
                              '| **MIT** (anerkannt Open Source) | **7**,'),
  },
  {
    was: 'Die MIT-Zahl wird zu klein, wie in der alten Tafel',
    bauen: () => ersetze(FOE, '| **MIT** (anerkannt Open Source) | **6**,',
                              '| **MIT** (anerkannt Open Source) | **3**,'),
  },
  {
    was: 'Die Gesamtzahl der Depots wird nachgezogen, die Aufteilung nicht',
    bauen: () => ersetze(FOE, 'gegen `origin/main` aller 33 Depots',
                              'gegen `origin/main` aller 34 Depots'),
  },
  {
    was: 'Die MIT-Zeile behauptet sechs und zaehlt nur fuenf auf',
    bauen: () => ersetze(FOE, ', `Kim-Bell`, `Kimseek`, `Kimboard` |',
                              ', `Kim-Bell`, `Kimseek` |'),
  },
  {
    was: 'Ein Korpus-Glied traegt in der Lizenz-Tafel gar kein MIT mehr',
    bauen: () => ersetze(FOE, '`mycel-karte`, `Kim-Bell`', '`Kimhub`, `Kim-Bell`'),
  },
  {
    was: 'Die zwei Dateien urteilen ueber Kimhub verschieden',
    bauen: () => ersetze(KOR, '| **Kimhub** | ❌ |', '| **Kimhub** | ✅ |'),
  },
  {
    was: 'Ein KIM-Depot bekommt ein Ja, ohne in der MIT-Zeile zu stehen',
    bauen: () => ersetze(FOE, '| **Kim-sync** | ❌ nein |', '| **Kim-sync** | ✅ ja |'),
  },
  {
    was: 'Die KIM-Familie wird in einer der beiden Dateien unvollstaendig',
    bauen: () => ersetze(KOR, '| **Kim-sync** | ❌ |', '| Kim-sync | ❌ |'),
  },
];

console.log('Gegenprobe Lizenz-Konsistenz — ' + FAELLE.length + ' eingebaute Fehler\n');

let durchgerutscht = 0;
try {
  /* Ausgangslage: ohne Sabotage MUSS die Probe durchlaufen. Sonst misst jeder
     Fall darunter nur, dass sie ohnehin rot war. */
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
}

console.log(durchgerutscht === 0
  ? '\ngegenprobe_lizenz_konsistenz: alle ' + FAELLE.length + ' Fehler gefangen'
  : '\ngegenprobe_lizenz_konsistenz: ' + durchgerutscht + ' DURCHGERUTSCHT');
process.exit(durchgerutscht === 0 ? 0 : 1);
