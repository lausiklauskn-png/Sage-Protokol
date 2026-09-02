/*
 * ⚠ GEKÜRZT AM 2026-09-02. Dieses Werkzeug legte einmal zehn Blätter ab; sieben
 * davon gehören nicht in ein öffentliches Depot und liegen seitdem woanders.
 * Was hier bleibt, ist das Fachliche.
 *
 * Wer ein Blatt vermisst: es fehlt nicht, es ist nicht hier.
 */
/* ausgabe-bauen.mjs, legt alle Unterlagen nummeriert in `docs/ausgabe/` ab.
 *
 * Klaus 2026-08-26: „die Dateiausgabe als HTML und PDF namentlich so sortiert,
 * dass sie sich nach Namen automatisch in die richtige Reihenfolge stellt."
 *
 * ── WARUM DIE NUMMER VORNE STEHT ──────────────────────────────────────────
 *
 * Ein Dateibrowser sortiert nach Namen. `unterlagen-april.pdf` steht damit vor
 * `unterlagen-schritte.pdf`, obwohl der April zuletzt gelesen wird. Wer die
 * Reihenfolge im Kopf behalten muss, verliert sie beim Weitergeben.
 *
 * Die Nummer ist die **Vorgehens-Reihenfolge**: so nimmt man die Blätter in die
 * Hand. Die chronologische Ordnung steht IN Blatt 05, nicht in den Dateinamen.
 * Zwei Ordnungen in einem Dateinamen gingen nicht, und die Reihenfolge des
 * Vorgehens ist die, nach der gearbeitet wird.
 *
 * ── DIE NUMMERN LASSEN LÜCKEN ─────────────────────────────────────────────
 *
 * 10er-Schritte. Wer ein Blatt dazwischenschiebt, braucht dann nicht alle
 * folgenden umzubenennen, und alte Ausdrucke behalten ihre Nummer.
 *
 * Aufruf:  node tools/ausgabe-bauen.mjs
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...t) => join(WURZEL, ...t);
const ZIEL = P('docs', 'ausgabe');

/* `nr` ist die Vorgehens-Reihenfolge, `name` der sprechende Teil dahinter.
   Wer etwas ergänzt, sucht sich eine freie Zehnerstelle. */
const AUSGABE = [
  { nr: 70, name: 'Forschungsaufgaben',
    html: 'docs/unterlagen-forschungsaufgaben.html', pdf: 'docs/unterlagen-forschungsaufgaben.pdf',
    was: 'was ansteht, in welcher Reihenfolge' },
  { nr: 95, name: 'Antragsmappe-einreichbar',
    html: 'docs/antragsmappe-einreichbar.html', pdf: 'docs/antragsmappe-einreichbar.pdf',
    was: 'Entstehung, Abgrenzung, Untersuchung, Werkstatt' },
];

/* Die Lesefassung wandert mit: dieselben Nummern, eigener Ordner. Wer den
   Ausgabe-Ordner weitergibt, gibt beide Formen mit, und die Namen sortieren
   sie in beiden Ordnern gleich. */
const LESEN = P('docs', 'lesen');

if (existsSync(ZIEL)) rmSync(ZIEL, { recursive: true });
mkdirSync(ZIEL, { recursive: true });

const kb = (b) => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB';
const zeilen = [];
let fehlend = 0;

for (const a of AUSGABE) {
  for (const [art, quelle] of [['html', a.html], ['pdf', a.pdf]]) {
    if (!quelle) continue;
    if (!existsSync(P(quelle))) {
      console.error('  FEHLT: ' + quelle);
      fehlend++;
      continue;
    }
    const ziel = String(a.nr).padStart(2, '0') + '_' + a.name + '.' + art;
    copyFileSync(P(quelle), join(ZIEL, ziel));
    zeilen.push({ ziel, quelle, was: a.was, groesse: statSync(P(quelle)).size });
  }
}

/* Und die Lesefassung, unter denselben Nummern in einem eigenen Unterordner. */
let lese = 0;
if (existsSync(LESEN)) {
  mkdirSync(join(ZIEL, 'lesefassung'), { recursive: true });
  for (const n of readdirSync(LESEN)) {
    copyFileSync(join(LESEN, n), join(ZIEL, 'lesefassung', n));
    lese++;
  }
}

/* Ein Inhaltsverzeichnis daneben. Wer den Ordner weitergibt, gibt damit auch
   die Auskunft mit, was jede Datei ist und woher sie kommt. */
const heute = new Date().toISOString().slice(0, 10);
const liste = [
  '# Unterlagen, nach Vorgehen nummeriert',
  '',
  '**Erzeugt am ' + heute + '** von `tools/ausgabe-bauen.mjs`.',
  '',
  'Die Nummer ist die Reihenfolge, in der man die Blätter in die Hand nimmt.',
  'Ein Dateibrowser sortiert nach Namen und stellt sie damit von selbst richtig.',
  'Die **chronologische** Ordnung der Unterlagen steht in Blatt 50.',
  '',
  '| Datei | Was es ist | Größe |',
  '|---|---|---|',
  ...zeilen.map((z) => '| `' + z.ziel + '` | ' + z.was + ' | ' + kb(z.groesse) + ' |'),
  '',
  '',
  '## Zum Lesen am Bildschirm',
  '',
  'Unter `lesefassung/` liegen dieselben Texte noch einmal, ruhiger gesetzt und',
  'mit einem Markier-Werkzeug für Tablet und Schreibtisch. Einstieg:',
  '`lesefassung/00_index.html`.',
  '',
  '**Der Markier-Modus schaltet das Auswählen ab, solange er an ist.** Damit',
  'öffnet auf dem Tablet kein Kopier-Menü mehr, während man über den Text zieht.',
  'Ist er aus, geht Auswählen und Kopieren wie auf jeder Seite.',
  '',
  '> Jede Datei ist eine Kopie. Geändert wird an der Quelle, dann neu erzeugt.',
  '',
].join('\n');

import { writeFileSync } from 'node:fs';
writeFileSync(join(ZIEL, '00_INHALT.md'), liste, 'utf-8');

console.log('geschrieben: docs/ausgabe/');
console.log('  ' + zeilen.length + ' Dateien' + (lese ? ' · ' + lese + ' Lesefassung' : '')
  + (fehlend ? ' · ' + fehlend + ' FEHLEN' : ''));
for (const n of readdirSync(ZIEL).sort()) console.log('    ' + n);
if (fehlend) process.exit(1);
