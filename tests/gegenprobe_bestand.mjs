/* gegenprobe_bestand.mjs, Gegenprobe zu `smoke_bestand.mjs`.
 *
 * Lauf:  node tests/gegenprobe_bestand.mjs
 *
 * Baut Fehler ein. **Jeder einzelne MUSS die Probe umwerfen.**
 *
 * ── FÜNF ARTEN, WIE EIN FALL NICHTS MISST ────────────────────────────────
 *
 * Er ändert nichts (toter Anker) · er erstickt die Probe · er macht das
 * Programm unlauffähig · der Läufer verdaut den Befund nicht · der Wächter
 * läuft gar nicht. Gegen die erste hilft `ersetze()`: es misst, ob sich die
 * Datei wirklich geändert hat, statt zu prüfen, ob ein `grep` etwas findet.
 *
 * ── SECHS FÄLLE ZIELEN AUF SÄTZE, NICHT AUF ZAHLEN ───────────────────────
 *
 * Das ist Absicht. Eine Rekonstruktion, die aufhört zu sagen, dass sie eine
 * ist, hat keine einzige falsche Zahl darin und ist trotzdem der teuerste
 * Fehler, den dieses Blatt machen kann. Dasselbe gilt für die Kennzahlen ohne
 * Definition und für die vier Posten außerhalb der Depots.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const ANGEFASST = [
  'tools/bestand-rechnen.mjs',
  'tools/bestand-bauen.mjs',
  'docs/unterlagen/04_BESTAND.md',
  'docs/unterlagen/05_APRIL.md',
];
const SICHER = new Map(ANGEFASST.map((r) => [r, readFileSync(P(r), 'utf-8')]));
const zurueck = () => { for (const [r, t] of SICHER) writeFileSync(P(r), t, 'utf-8'); };

/* GEMESSEN, ob sich die Datei wirklich geändert hat. */
function ersetze(datei, alt, neu) {
  const vorher = readFileSync(P(datei), 'utf-8');
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) throw new Error('ANKER GREIFT NICHT in ' + datei);
  writeFileSync(P(datei), nachher, 'utf-8');
}

const bauen = () => execFileSync(process.execPath, [P('tools/bestand-bauen.mjs')],
  { cwd: WURZEL, stdio: 'pipe' });

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P('tests/smoke_bestand.mjs')],
      { cwd: WURZEL, stdio: 'pipe' });
    return true;
  } catch { return false; }
}

const R = 'tools/bestand-rechnen.mjs';
const B = 'tools/bestand-bauen.mjs';
const BL = 'docs/unterlagen/04_BESTAND.md';
const AL = 'docs/unterlagen/05_APRIL.md';

const FAELLE = [
  /* ── Die Rechnung ─────────────────────────────────────────────────────── */
  {
    was: 'Die zeitgesteuerten Läufe zählen als Arbeitstage mit',
    bauen: () => {
      ersetze(R, 'for (const c of commits) if (!istAutomatik(c)) t.add(c.datum);',
        'for (const c of commits) t.add(c.datum);');
      bauen();
    },
  },
  {
    was: 'Ein Dateiname mit Monat statt Tag gilt als Protokoll für einen Tag',
    bauen: () => {
      ersetze(R, "const m = String(n).match(/(\\d{4}-\\d{2}-\\d{2})_/);",
        "const m = String(n).match(/(\\d{4}-\\d{2})/);");
      bauen();
    },
  },
  {
    was: 'Die Deckung zählt jeden Arbeitstag als gedeckt',
    bauen: () => {
      ersetze(R, "if (prot.has(tag)) o.mit++; else o.ohne++;", 'o.mit++;');
      bauen();
    },
  },
  {
    was: 'Der Protokoll-Beginn ist der erste Dateiname statt der früheste Tag',
    bauen: () => {
      ersetze(R, 'const t = protokollTage(dateinamen);\n  return t.length ? t[0] : null;',
        'const t = dateinamen.filter((n) => /\\d{4}-\\d{2}-\\d{2}_/.test(n));\n'
        + '  return t.length ? t[0].slice(0, 10) : null;');
      bauen();
    },
  },
  {
    was: 'Die Einträge je Depot nehmen die zeitgesteuerten Läufe mit',
    bauen: () => {
      ersetze(R, "if (istAutomatik(c) || monatVon(c.datum) !== monat) continue;",
        'if (monatVon(c.datum) !== monat) continue;');
      bauen();
    },
  },
  /* ── Die Definitionen. Ohne sie sind zwei richtige Zahlen ein Widerspruch ─ */
  {
    was: 'Eine Kennzahl verliert ihre Definition',
    bauen: () => {
      ersetze(R, "was: 'ohne die zeitgesteuerten Läufe; das ist die Zahl für die Arbeitszeit' }",
        "was: '' }");
      bauen();
    },
  },
  {
    was: 'Die Definitionen stehen im Modul, aber nicht mehr im Blatt',
    bauen: () => {
      ersetze(B, "+ ' | ' + k.was + ' |').join('\\n')}", "+ ' | |').join('\\n')}");
      bauen();
    },
  },
  {
    was: 'Beide Eintrags-Zahlen heißen wieder gleich',
    bauen: () => {
      ersetze(R, "name: 'Einträge von Hand',", "name: 'Einträge insgesamt',");
      bauen();
    },
  },
  /* ── Die Wiedergabe im Blatt ──────────────────────────────────────────── */
  {
    was: 'Das Blatt lässt einen Monat der Deckungs-Tabelle aus',
    bauen: () => {
      ersetze(B, '${deckung.map((d) =>', '${deckung.slice(1).map((d) =>');
      bauen();
    },
  },
  {
    was: 'Die Summenzeile wird eigens gezählt statt summiert',
    bauen: () => {
      ersetze(B, 'const gedeckt = deckung.reduce((a, d) => a + d.mit, 0);',
        'const gedeckt = deckung.length;');
      bauen();
    },
  },
  {
    was: 'Die chronologische Ordnung lässt Posten weg',
    bauen: () => {
      ersetze(B, '${nachZeit.map((b, i) =>', '${nachZeit.slice(2).map((b, i) =>');
      bauen();
    },
  },
  /* ── Die Sätze, die keine Zahl falsch machen und trotzdem am teuersten sind ─ */
  {
    was: 'Die Rekonstruktion sagt nicht mehr, dass sie eine ist',
    bauen: () => {
      ersetze(B, '> **Das ist eine Rekonstruktion, kein Protokoll.** Sie ist aus den',
        '> **Der April, Tag für Tag.** Zusammengestellt aus den');
      bauen();
    },
  },
  {
    was: 'Und sie verschweigt, was daraus nicht zu gewinnen ist',
    bauen: () => {
      ersetze(B, 'nirgends und lässt sich daraus nicht gewinnen.',
        'ebenfalls in den Einträgen.');
      bauen();
    },
  },
  {
    /* Der erste Anlauf hängte eine Klammer an und machte das Werkzeug
       unlauffähig. Das ist die dritte der fünf Arten, wie ein Fall nichts
       misst: die Probe fällt um, aber aus dem falschen Grund. Sabotiert wird
       deshalb der NAME des Postens, nicht die Struktur der Liste. */
    was: 'Ein Posten außerhalb der Depots verschwindet still',
    bauen: () => {
      ersetze(B, "['Chat-Verläufe', 'außerhalb von Git',",
        "['Sonstiges', 'außerhalb von Git',");
      bauen();
    },
  },
  {
    was: 'Der Abschnitt sagt nicht mehr, dass diese Posten von Hand geführt sind',
    bauen: () => {
      ersetze(B, 'deshalb **von Hand** hier, und ihre Zeiträume sind nicht gerechnet, sondern\nangegeben.',
        'ebenfalls hier, mit ihren Zeiträumen.');
      bauen();
    },
  },
  {
    was: 'Das Blatt verschweigt, dass Deckung kein Maß für die Güte ist',
    bauen: () => {
      ersetze(B, '**Deckung ist eine Untergrenze für Dokumentation, kein\nMaß für ihre Güte.**',
        'Die Deckung sagt, wie gut dokumentiert wurde.');
      bauen();
    },
  },
  /* ── Der Riegel gegen den flachen Klon ────────────────────────────────── */
  {
    /* Der Riegel selbst lässt sich nicht durch die Probe fangen: ein voller
       Klon merkt nichts davon. Sabotiert wird deshalb seine WIRKUNG, indem
       der Zeitraum aus der Datei-Änderungszeit statt aus Git kommt. Genau das
       tat der erste Lauf am 2026-08-26 unfreiwillig, und es sah richtig aus. */
    was: 'Der Zeitraum kommt aus der Datei-Änderungszeit statt aus der Git-Historie',
    bauen: () => {
      ersetze(B, "return { von: z[z.length - 1], bis: z[0], staende: z.length };",
        "return { von: '2026-08-26', bis: '2026-08-26', staende: 1 };");
      bauen();
    },
  },
];

let durch = 0;
console.log('gegenprobe_bestand: ' + FAELLE.length + ' eingebaute Fehler\n');
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
} finally {
  zurueck();
  bauen();
}

console.log(durch === 0
  ? '\ngegenprobe_bestand: alle ' + FAELLE.length + ' Fehler gefangen'
  : '\ngegenprobe_bestand: ' + durch + ' DURCHGERUTSCHT');
process.exit(durch === 0 ? 0 : 1);
