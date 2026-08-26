/* gegenprobe_zahlen.mjs, Gegenprobe zu `smoke_zahlen.mjs`.
 *
 * Lauf:  node tests/gegenprobe_zahlen.mjs
 *
 * Baut Fehler ein. **Jeder einzelne MUSS die Probe umwerfen.**
 *
 * Die Fälle sind die drei Fehler, die am 2026-08-26 wirklich dastanden, plus
 * die Nachbarn, an denen dieselbe Sorte wieder auftreten kann. Sabotiert wird
 * jedes Mal der TEXT, nicht die Rechnung: der Wächter soll die Prosa gegen die
 * Messung halten, und nur ein Eingriff in die Prosa misst das.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const ANGEFASST = [
  'docs/FORSCHUNGSFOERDERUNG.md',
  'docs/STEUERBERATER_FRAGEN.md',
  'docs/FORSCHUNGSKORPUS.md',
  'docs/unterlagen/00_UEBERSICHT.md',
  'tools/bestand-rechnen.mjs',
];
const SICHER = new Map(ANGEFASST.map((r) => [r, readFileSync(P(r), 'utf-8')]));
const zurueck = () => { for (const [r, t] of SICHER) writeFileSync(P(r), t, 'utf-8'); };

function ersetze(datei, alt, neu) {
  const vorher = readFileSync(P(datei), 'utf-8');
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) throw new Error('ANKER GREIFT NICHT in ' + datei);
  writeFileSync(P(datei), nachher, 'utf-8');
}

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P('tests/smoke_zahlen.mjs')], { cwd: WURZEL, stdio: 'pipe' });
    return true;
  } catch { return false; }
}

const F = 'docs/FORSCHUNGSFOERDERUNG.md';
const S = 'docs/STEUERBERATER_FRAGEN.md';
const K = 'docs/FORSCHUNGSKORPUS.md';
const U = 'docs/unterlagen/00_UEBERSICHT.md';
const R = 'tools/bestand-rechnen.mjs';

const FAELLE = [
  /* ── Die drei Fehler, die wirklich dastanden ──────────────────────────── */
  { was: 'Die Anlaufpause steht wieder mit 27 statt 26 Tagen da',
    bauen: () => ersetze(F, '**26 Tage ohne einen einzigen**', '**27 Tage ohne einen einzigen**') },
  { was: 'Die Kalendertage stehen wieder bei 140 statt 141',
    bauen: () => ersetze(F, '127 Arbeitstage in 141 Kalendertagen', '127 Arbeitstage in 140 Kalendertagen') },
  { was: 'Der Text behauptet wieder genau EINE Lücke von vier Tagen',
    bauen: () => ersetze(F,
      'Unterbrochen wird sie **neunmal**, die längste Unterbrechung dauert **drei Tage**',
      'Unterbrochen wird sie mit genau **einer** Lücke von vier Tagen, die längste dauert **vier Tage**') },
  { was: 'Dasselbe im Blatt für den Steuerberater: 140 statt 141',
    bauen: () => ersetze(S, '127 Arbeitstage in 141 Kalendertagen', '127 Arbeitstage in 140 Kalendertagen') },
  { was: 'Und dort die längste Unterbrechung als vier statt drei Tage',
    bauen: () => ersetze(S, 'die längste Unterbrechung **drei Tage**', 'die längste Unterbrechung **vier Tage**') },
  { was: 'Und dort die Anlaufpause wieder mit 27 Tagen',
    bauen: () => ersetze(S, '**26 Tage ohne einen einzigen**', '**27 Tage ohne einen einzigen**') },

  /* ── Die Kennzahlen mit ihrem Etikett ─────────────────────────────────── */
  { was: 'Die Zahl der Arbeitstage weicht ab',
    bauen: () => ersetze(F, '128 Arbeitstage vom 10.03', '129 Arbeitstage vom 10.03') },
  { was: 'Die Zahl der Depots weicht ab',
    bauen: () => ersetze(S, '33 Depots', '32 Depots') },

  /* ── Die zwei richtigen Zahlen, die ohne Zusatz ein Widerspruch sind ──── */
  { was: 'Die grosse Eintrags-Zahl verliert ihren Zusatz „insgesamt"',
    bauen: () => ersetze(S, '5.823 Einträge insgesamt, 128 Arbeitstage', '5.823 Einträge, 128 Arbeitstage') },
  { was: 'Die kleine Eintrags-Zahl verliert ihren Zusatz „von Hand"',
    bauen: () => ersetze(U, '5.775 Einträge von Hand', '5.775 Einträge') },

  /* ── Die Demo, die beim Nachprüfen falsch aussieht ────────────────────── */
  { was: 'Der Forschungskorpus verschweigt, wann die Demo ins Depot kam',
    bauen: () => ersetze(K, 'Er kam am **2026-08-15** in dieses Depot (#855)',
      'Er liegt seit dem Anfang in diesem Depot') },

  /* ── Und die Rechnung selbst, damit der Wächter nicht nur Text vergleicht ─ */
  { was: 'Die Kalendertage werden ohne den letzten Tag gerechnet',
    bauen: () => ersetze(R, "(Date.parse(letzter) - Date.parse(stichtag)) / tag) + 1;",
      "(Date.parse(letzter) - Date.parse(stichtag)) / tag);") },
  { was: 'Eine Unterbrechung von einem Tag zählt nicht mehr als Unterbrechung',
    bauen: () => ersetze(R, 'if (ohne > 0) luecken.push', 'if (ohne > 1) luecken.push') },
];

let durch = 0;
console.log('gegenprobe_zahlen: ' + FAELLE.length + ' eingebaute Fehler\n');
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
} finally { zurueck(); }

console.log(durch === 0
  ? '\ngegenprobe_zahlen: alle ' + FAELLE.length + ' Fehler gefangen'
  : '\ngegenprobe_zahlen: ' + durch + ' DURCHGERUTSCHT');
process.exit(durch === 0 ? 0 : 1);
