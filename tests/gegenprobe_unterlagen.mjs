/* gegenprobe_unterlagen.mjs — Gegenprobe zu `smoke_unterlagen.mjs`.
 *
 * Lauf:  node tests/gegenprobe_unterlagen.mjs
 *
 * Baut Fehler ein. **Jeder einzelne MUSS die Probe umwerfen.**
 *
 * ── WARUM ES DIESE GEGENPROBE BRAUCHT, OBWOHL ES SCHON EINE GIBT ──────────
 *
 * `gegenprobe_antragsmappe.mjs` meldete am 2026-08-26 „32 von 32 gefangen",
 * während die zweite Mappe **von keiner Probe angesehen wurde**. Ihre Fälle
 * sabotieren die eine Mappe, und die eine Probe sah nur die eine Datei.
 * **Eine Gegenprobe kann nur so weit sehen wie die Probe, die sie prüft.**
 *
 * VIER FÄLLE ZIELEN AUF SÄTZE, NICHT AUF FUNKTION. Das ist Absicht: zwei der
 * vier Abteilungen gehen aus dem Haus, eine zum Steuerberater und eine neben
 * ein Behörden-Formular. Ein Blatt, das nicht mehr sagt, dass es keine
 * Abschrift des Formulars und keine Beratung ist, sieht genauer aus, als es
 * ist, ohne dass eine einzige Zahl falsch wäre.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const ANGEFASST = [
  'tools/antragsmappe-bauen.mjs',
  'tools/antragsmappe-markieren.mjs',
  'docs/unterlagen/00_UEBERSICHT.md',
  'docs/STEUERBERATER_FRAGEN.md',
  'docs/unterlagen/03_FINANZAMT.md',
  'docs/unterlagen.html',
  'docs/antragsmappe.html',
];
const SICHER = new Map(ANGEFASST.map((r) => [r, readFileSync(P(r), 'utf-8')]));
const zurueck = () => { for (const [r, t] of SICHER) writeFileSync(P(r), t, 'utf-8'); };

/* GEMESSEN, ob sich die Datei wirklich geändert hat. Ein Anker, der nicht
   greift, meldet sich damit selbst, statt stumm nichts zu sabotieren. */
function ersetze(datei, alt, neu) {
  const vorher = readFileSync(P(datei), 'utf-8');
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) throw new Error('ANKER GREIFT NICHT in ' + datei);
  writeFileSync(P(datei), nachher, 'utf-8');
}

const stand = (readFileSync(P('docs/unterlagen.html'), 'utf-8')
  .match(/data-stand="([^"]+)"/) || [])[1];
const bauen = () => execFileSync(process.execPath,
  [P('tools/antragsmappe-bauen.mjs'), '--datum=' + stand],
  { cwd: WURZEL, stdio: 'pipe' });

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P('tests/smoke_unterlagen.mjs')],
      { cwd: WURZEL, stdio: 'pipe' });
    return true;
  } catch { return false; }
}

const B = 'tools/antragsmappe-bauen.mjs';
const M = 'tools/antragsmappe-markieren.mjs';

const FAELLE = [
  {
    was: 'Der BOM fällt weg, die Umlaute werden beim Herunterladen zu Fragezeichen',
    bauen: () => {
      ersetze(B, "const seiteBauen = (mappe) => `\\ufeff<!doctype html>",
        'const seiteBauen = (mappe) => `<!doctype html>');
      bauen();
    },
  },
  {
    was: 'Nur die erste Abteilung bekommt einen Druck-Riegel',
    bauen: () => {
      ersetze(B, 'const DRUCK_REGELN = [...new Set(MAPPEN.flatMap((m) => m.abteilungen.map((a) => a.id)))]',
        'const DRUCK_REGELN = [...new Set(MAPPEN.flatMap((m) => m.abteilungen.map((a) => a.id)))].slice(0, 1)');
      bauen();
    },
  },
  {
    /* Die Regel steht da und wirkt nicht: eine spätere, gleich spezifische
       Regel holt die Abteilung zurück. Ein Wächter, der nur den TEXT der
       Regel sucht, bliebe grün, und der Einzel-Druck brächte alles mit. */
    was: 'Der Druck-Riegel steht da, wird aber überschrieben',
    bauen: () => {
      ersetze(B, '${DRUCK_REGELN}',
        '${DRUCK_REGELN}\n.abteilung{display:block !important}');
      bauen();
    },
  },
  {
    was: 'Eine Abteilung verliert ihren Stempel, ist also nicht mehr allein vollständig',
    bauen: () => {
      ersetze(B, "'<p class=\"stempel\" data-stempel=\"' + abt.id + '\">'",
        "'<p class=\"stempel-weg\">'");
      bauen();
    },
  },
  {
    was: 'Der Einzel-Download nimmt das ganze Dokument mit',
    bauen: () => {
      ersetze(B, 'var abt = document.getElementById(id).cloneNode(true);',
        'var abt = document.body.cloneNode(true);');
      bauen();
    },
  },
  {
    was: 'Eine Quelldatei fällt aus der Mappe',
    bauen: () => {
      ersetze(B, "    dateien: ['docs/unterlagen/03_FINANZAMT.md'],",
        '    dateien: [],');
      bauen();
    },
  },
  {
    was: 'Eine Quellzeile wird beim Bauen verschluckt',
    bauen: () => {
      ersetze(B, 'const rumpf = markdown(text, (u) => verweisUmschreiben(pfad, u));',
        'const rumpf = markdown(text.split("\\n").slice(0, -12).join("\\n"),'
        + ' (u) => verweisUmschreiben(pfad, u));');
      bauen();
    },
  },
  {
    was: 'Ein Gedankenstrich kehrt in die Markier-Legende zurück',
    bauen: () => {
      ersetze(M, '<strong>bleibt</strong>, soll bleiben',
        '<strong>bleibt</strong> — soll bleiben');
      bauen();
    },
  },
  {
    was: 'Ein relativer Verweis bleibt stehen (die Tablet-Falle)',
    bauen: () => {
      ersetze(B, "  if (ANKER.has(aufgeloest)) return '#' + ANKER.get(aufgeloest);\n"
        + '  return ROH + aufgeloest',
        "  if (ANKER.has(aufgeloest)) return '#' + ANKER.get(aufgeloest);\n"
        + '  return aufgeloest');
      bauen();
    },
  },
  {
    was: 'Das Finanzamt-Blatt sagt nicht mehr, dass es keine Abschrift des Formulars ist',
    bauen: () => {
      ersetze('docs/unterlagen/03_FINANZAMT.md',
        '**Es ist keine Abschrift des Formulars.**',
        '**Es gibt das Formular vollständig wieder.**');
      bauen();
    },
  },
  {
    was: 'Das Finanzamt-Blatt sagt nicht mehr, dass es keine Beratung ist',
    bauen: () => {
      ersetze('docs/unterlagen/03_FINANZAMT.md',
        'ist eine Vorbereitung und keine\nsteuerliche Beratung',
        'ist eine verbindliche Auskunft');
      bauen();
    },
  },
  {
    /* Sabotiert wird die SUBSTANZ, nicht die Überschrift. Die erste Fassung
       benannte den Abschnitt nur um; der Wächter dagegen suchte ein Wort, das
       in derselben Abteilung noch einmal vorkam, und blieb grün. Beide waren
       falsch gebaut, und zwar am selben Punkt: eine Überschrift ist keine
       Zusicherung. Der Warnkasten zur Zenodo-Fassung ist eine. */
    was: 'Die Übersicht verschweigt, warum die Zenodo-Nummer warten muss',
    bauen: () => {
      ersetze('docs/unterlagen/00_UEBERSICHT.md',
        '**Eine Zenodo-Fassung bleibt unverändert stehen.**',
        'Zenodo ist unkritisch.');
      bauen();
    },
  },
  {
    was: 'Die Übersicht benennt nicht mehr, was es noch gar nicht gibt',
    bauen: () => {
      ersetze('docs/unterlagen/00_UEBERSICHT.md',
        /\*\*existiert nicht\*\*/g, 'in Arbeit');
      bauen();
    },
  },
  {
    was: 'Die Mappe wird nicht neu gebaut, obwohl sich die Quelle geändert hat',
    bauen: () => {
      ersetze('docs/STEUERBERATER_FRAGEN.md',
        '## 2 · Mein Ziel, in einem Satz',
        '## 2 · Mein Ziel, kurz gesagt');
      /* KEIN bauen() — genau das ist der Fehler. */
    },
  },
];

let durch = 0;
console.log('Gegenprobe Unterlagen, ' + FAELLE.length + ' eingebaute Fehler\n');

try {
  for (const [n, fall] of FAELLE.entries()) {
    zurueck();
    bauen();
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
  ? '\ngegenprobe_unterlagen: alle ' + FAELLE.length + ' Fehler gefangen'
  : '\ngegenprobe_unterlagen: ' + durch + ' DURCHGERUTSCHT');
process.exit(durch === 0 ? 0 : 1);
