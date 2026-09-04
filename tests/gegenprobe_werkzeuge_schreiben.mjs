/* gegenprobe_werkzeuge_schreiben.mjs — der Riegel gegen schreibende Importe.
 *
 * Lauf:  node tests/gegenprobe_werkzeuge_schreiben.mjs
 *
 * ── WAS HIER BEWACHT WIRD ─────────────────────────────────────────────────
 *
 * `smoke_werkzeuge_lauffaehig.mjs` laedt jedes Werkzeug aus `tools/`. Seit dem
 * 2026-09-04 misst sie zusaetzlich, ob das Laden etwas unter `docs/` geschrieben
 * hat. Diese Gegenprobe nimmt `tools/lesefassung-bauen.mjs` den Direkt-Riegel
 * weg und besteht darauf, dass die Probe das bemerkt.
 *
 * ⚠ OHNE DIESEN FALL WAERE DER WAECHTER EINE BEHAUPTUNG. Er ist gruen, solange
 * kein Werkzeug schreibt — und er waere genauso gruen, wenn er gar nichts
 * vergliche. Erst der eingebaute Fehler unterscheidet die beiden Faelle.
 *
 * ── DIE SABOTAGE SCHREIBT WIRKLICH, ALSO WIRD AUCH docs/lesen GESICHERT ────
 *
 * Ohne den Riegel baut das Werkzeug `docs/lesen/` beim Import neu. Eine
 * Gegenprobe, die den Arbeitsbaum veraendert zuruecklaesst, legt der naechsten
 * Probe die Ausgangslage um — genau der Fehler, gegen den sie hier antritt.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...t) => join(WURZEL, ...t);
const WERKZEUG = P('tools', 'lesefassung-bauen.mjs');
const LESEN = P('docs', 'lesen');

/* Alles sichern, was die Sabotage anfassen kann. */
const sicherWerkzeug = readFileSync(WERKZEUG, 'utf-8');
const sicherLesen = new Map();
if (existsSync(LESEN)) for (const n of readdirSync(LESEN)) sicherLesen.set(n, readFileSync(join(LESEN, n)));

const zurueck = () => {
  writeFileSync(WERKZEUG, sicherWerkzeug, 'utf-8');
  mkdirSync(LESEN, { recursive: true });
  for (const [n, inhalt] of sicherLesen) writeFileSync(join(LESEN, n), inhalt);
};

function probeLaeuft() {
  try {
    execFileSync('node', [P('tests', 'smoke_werkzeuge_lauffaehig.mjs')],
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { rot: false, text: '' };
  } catch (e) { return { rot: true, text: String(e.stdout || '') + String(e.stderr || '') }; }
}

let gefangen = 0;
const durchgerutscht = [];
const toteAnker = [];

function fall(name, alt, neu, erwarteteZeile) {
  const vorher = readFileSync(WERKZEUG, 'utf-8');
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) { toteAnker.push(name); console.log('  ⊘ ANKER NICHT GEFUNDEN: ' + name); return; }

  writeFileSync(WERKZEUG, nachher, 'utf-8');
  const ergebnis = probeLaeuft();
  zurueck();

  if (!ergebnis.rot) { durchgerutscht.push(name); console.log('  ✗ NICHT GEFANGEN: ' + name); return; }
  const richtig = ergebnis.text.includes('ROT  ' + erwarteteZeile);
  gefangen++;
  console.log('  ✓ gefangen: ' + name + (richtig ? ''
    : '  ⚠ aber NICHT an „' + erwarteteZeile + '" — die Probe fiel aus einem anderen Grund'));
  if (!richtig) durchgerutscht.push(name + ' (falsche Zusicherung)');
}

console.log('Gegenprobe: schreibt ein Werkzeug beim blossen Import?\n');

try {
  /* Der Riegel faellt weg — der Rumpf steht wieder auf oberster Ebene und
     laeuft beim Import mit. Genau der Zustand vom 2026-09-03. */
  fall('Der Direkt-Riegel von lesefassung-bauen.mjs faellt weg',
    'if (DIREKT) {\n\nif (existsSync(ZIEL))', 'if (true) {\n\nif (existsSync(ZIEL))',
    'das blosse Laden der Werkzeuge hat nichts unter docs/ geschrieben');
} finally {
  zurueck();
}

console.log('\n' + gefangen + ' gefangen · ' + durchgerutscht.length + ' durchgerutscht · '
  + toteAnker.length + ' tote Anker');
for (const d of durchgerutscht) console.log('  ✗ ' + d);
for (const t of toteAnker) console.log('  ⊘ ' + t);
if (durchgerutscht.length || toteAnker.length) process.exit(1);
