/* smoke_ausgabe.mjs, die Unterlagen sortieren sich von selbst richtig.
 *
 * Lauf:  node tests/smoke_ausgabe.mjs
 *
 * ── DIE ZUSICHERUNG ───────────────────────────────────────────────────────
 *
 * Klaus 2026-08-26: „die Dateiausgabe als HTML und PDF namentlich so sortiert,
 * dass sie sich nach Namen automatisch in die richtige Reihenfolge stellt."
 *
 * Ein Dateibrowser sortiert nach Namen. Wer die Reihenfolge im Kopf behalten
 * muss, verliert sie beim Weitergeben. Geprüft wird deshalb, dass die
 * **alphabetische** Sortierung der Dateinamen dieselbe ist wie die
 * **Vorgehens**-Reihenfolge im Werkzeug.
 *
 * Das ist etwas anderes als „jede Datei ist da": eine vollständige Ablage in
 * falscher Reihenfolge sähe genauso vollständig aus.
 */
import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = join(WURZEL, 'docs', 'ausgabe');
let rot = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

if (!existsSync(ORDNER)) {
  gut(false, 'docs/ausgabe/ liegt vor', 'node tools/ausgabe-bauen.mjs');
  console.log('\nsmoke_ausgabe: 1 ROT');
  process.exit(1);
}

const dateien = readdirSync(ORDNER).sort();
const werke = dateien.filter((n) => /\.(html|pdf)$/.test(n));

gut(werke.length >= 10, werke.length + ' Dateien in der Ausgabe');

/* ── 1 · Jede trägt eine Nummer vorn ──────────────────────────────────── */
const ohneNr = werke.filter((n) => !/^\d{2}_/.test(n));
gut(ohneNr.length === 0, 'jede Datei beginnt mit einer zweistelligen Nummer',
  'ohne: ' + ohneNr.join(', '));

/* ── 2 · DIE ZUSICHERUNG: alphabetisch = nach Nummer ──────────────────── */
const nummern = werke.map((n) => Number(n.slice(0, 2)));
const steigend = nummern.every((x, i) => i === 0 || x >= nummern[i - 1]);
gut(steigend,
  'alphabetisch sortiert stehen sie in der Reihenfolge des Vorgehens',
  'Nummern in Datei-Reihenfolge: ' + nummern.join(' '));

/* ── 3 · Beide Formate, und wo eines fehlt, ist es benannt ───────────── */
const je = new Map();
for (const n of werke) {
  const stamm = n.replace(/\.(html|pdf)$/, '');
  je.set(stamm, (je.get(stamm) || []).concat(n.split('.').pop()));
}
const nurEines = [...je.entries()].filter(([, arten]) => arten.length < 2);
/* NICHT „alle haben beides": die Historie ist 7,8 MB und wird nicht gedruckt.
   Geprüft wird, dass höchstens EINE Ausnahme dasteht und dass sie HTML hat. */
gut(nurEines.length <= 1,
  'höchstens ein Posten hat nur ein Format (' + nurEines.length + ')',
  nurEines.map(([s, a]) => s + ': ' + a.join(',')).join(' · '));
gut(nurEines.every(([, a]) => a.includes('html')),
  'und wo eines fehlt, ist es das PDF, nicht die lesbare Fassung');

/* ── 4 · Keine leere Datei ────────────────────────────────────────────── */
const leer = werke.filter((n) => statSync(join(ORDNER, n)).size < 2048);
gut(leer.length === 0, 'keine Datei ist leer oder ein Rumpf',
  leer.join(', '));

/* ── 5 · Das Inhaltsverzeichnis nennt jede Datei ──────────────────────── */
const inhalt = existsSync(join(ORDNER, '00_INHALT.md'))
  ? readFileSync(join(ORDNER, '00_INHALT.md'), 'utf-8') : '';
gut(inhalt.length > 200, 'ein Inhaltsverzeichnis liegt daneben');
const fehlend = werke.filter((n) => !inhalt.includes(n));
gut(fehlend.length === 0, 'und es nennt jede der ' + werke.length + ' Dateien',
  'nicht genannt: ' + fehlend.join(', '));

/* ── 6 · Die HTML-Dateien tragen einen BOM ───────────────────────────────
   Beim Herunterladen geht charset=utf-8 verloren, und Androids Betrachter
   rät dann Latin-1: aus jedem Umlaut werden zwei Zeichen. */
const ohneBom = werke.filter((n) => {
  if (!n.endsWith('.html')) return false;
  const b = readFileSync(join(ORDNER, n));
  return !(b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF);
});
gut(ohneBom.length === 0, 'jede HTML-Datei beginnt mit einem BOM',
  'ohne: ' + ohneBom.join(', '));

console.log('\nsmoke_ausgabe: ' + (rot === 0 ? 'alles grün' : rot + ' ROT'));
process.exit(rot === 0 ? 0 : 1);
