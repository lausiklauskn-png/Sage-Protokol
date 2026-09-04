/* gegenprobe_paper_a_parallel.mjs — baut Fehler ein. JEDER MUSS die Probe
 * `smoke_paper_a_parallel.mjs` umwerfen.
 *
 * Lauf:  node tests/gegenprobe_paper_a_parallel.mjs
 *
 * Ein Waechter ohne Gegenprobe ist nur ein gruener Haken. Diese Datei sabotiert
 * die ENGLISCHE Fassung an neun Stellen und besteht darauf, dass die Probe es
 * bemerkt — und zwar an der RICHTIGEN Zusicherung. „Eine Probe ist rot" genuegt
 * nicht; deshalb traegt jeder Fall die Zeile, die rot werden soll.
 *
 * Drei Arten, wie ein Fall nichts misst (aus Kimhubs Verfassung uebernommen):
 * die Sabotage aendert nichts (toter Anker) · sie erstickt die Probe · sie macht
 * das Programm unlauffaehig. Gegen die erste wird nach jedem Eingriff geprueft,
 * ob die Datei sich wirklich geaendert hat.
 *
 * Alle Dateien werden gesichert und am Ende zurueckgeschrieben, auch bei
 * Abbruch (finally).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const EN_MD = P('docs/papers/rules-and-principles-in-ai-agent-systems.md');
const EN_HTML = P('docs/papers/rules-and-principles-in-ai-agent-systems.html');

const sicher = new Map();
for (const f of [EN_MD, EN_HTML]) sicher.set(f, readFileSync(f, 'utf8'));
const zurueck = () => { for (const [f, inhalt] of sicher) writeFileSync(f, inhalt, 'utf8'); };

function probeLaeuft() {
  try {
    execFileSync('node', [P('tests/smoke_paper_a_parallel.mjs')],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { rot: false, text: '' };
  } catch (e) {
    return { rot: true, text: String(e.stdout || '') + String(e.stderr || '') };
  }
}

let gefangen = 0;
const durchgerutscht = [];
const toteAnker = [];

function fall(name, datei, alt, neu, erwarteteZeile) {
  const vorher = readFileSync(datei, 'utf8');
  const nachher = typeof alt === 'function' ? alt(vorher) : vorher.replace(alt, neu);

  if (nachher === vorher) {
    toteAnker.push(name);
    console.log('  ⊘ ANKER NICHT GEFUNDEN: ' + name);
    return;
  }

  writeFileSync(datei, nachher, 'utf8');
  const ergebnis = probeLaeuft();
  writeFileSync(datei, vorher, 'utf8');

  if (!ergebnis.rot) {
    durchgerutscht.push(name);
    console.log('  ✗ NICHT GEFANGEN: ' + name);
    return;
  }

  /* Die Zeile muss als ROT dastehen, nicht irgendwo im Text — sonst zaehlte
     ein gruener Haken mit demselben Wortlaut als Treffer. */
  const richtig = ergebnis.text.includes('✗ ' + erwarteteZeile);
  gefangen++;
  console.log('  ✓ gefangen: ' + name + (richtig ? ''
    : '  ⚠ aber NICHT an „' + erwarteteZeile + '" — die Probe fiel aus einem anderen Grund'));
  if (!richtig) durchgerutscht.push(name + ' (falsche Zusicherung)');
}

console.log('Gegenprobe: die beiden Sprachfassungen von Paper A\n');

try {
  /* --- Gliederung --------------------------------------------------------- */

  fall('Eine Ueberschrift wird zu Fliesstext',
    EN_MD, '## 9 · Availability', '**9 · Availability**',
    'Gleich viele Ueberschriften');

  fall('Eine Ueberschrift rutscht eine Ebene tiefer',
    EN_MD, '### 7.1 Three arms instead of two', '#### 7.1 Three arms instead of two',
    'Die Ueberschriften-Ebenen kommen in derselben Reihenfolge');

  /* --- Gestalt je Abschnitt ----------------------------------------------- */

  /* Zwei Absaetze werden zu einem: der Inhalt bleibt, die Gestalt nicht.
     Genau die Sorte Abweichung, die ein Wortlaut-Waechter nie sieht. */
  fall('Zwei Absaetze verschmelzen (eine Leerzeile weniger)',
    EN_MD, 'one expects of them.\n\nWhat is remarkable', 'one expects of them.\nWhat is remarkable',
    'Jeder Abschnitt hat in beiden Fassungen gleich viele Absatz-Bloecke');

  fall('Eine Tabellenzeile faellt weg',
    EN_MD, '| **R** | the rules only |\n', '',
    'Jeder Abschnitt hat gleich viele Tabellenzeilen');

  fall('Ein Listenpunkt faellt weg',
    EN_MD, (s) => s.replace(/- \*\*Sample of one\.\*\* One operator[^\n]*\n/, ''),
    null, 'Jeder Abschnitt hat gleich viele Listenpunkte');

  /* --- Querverweise und Daten --------------------------------------------- */

  fall('Ein Querverweis zeigt in der Uebersetzung woanders hin',
    EN_MD, '(7.4) this class of error', '(7.5) this class of error',
    'Beide Fassungen verweisen gleich oft auf dieselben Abschnitte');

  fall('Ein Datum verrutscht um einen Tag',
    EN_MD, 'Since 2026-08-23 **all five have tools**', 'Since 2026-08-24 **all five have tools**',
    'Beide Fassungen nennen dieselben ISO-Daten gleich oft');

  /* --- Ein Werk, ein DOI --------------------------------------------------- */

  fall('Die englische Fassung bekommt einen anderen DOI',
    EN_HTML, '10.5281/zenodo.22286072', '10.5281/zenodo.99999999',
    'Es ist derselbe DOI — zwei Dateien, ein Werk');

  fall('Der DOI verschwindet still aus der englischen Fassung',
    EN_HTML, /<p class="paper-doi">[\s\S]*?<\/p>/, '<p class="paper-doi"></p>',
    'Beide HTML-Fassungen tragen einen DOI');

} finally {
  zurueck();
}

/* ---- Schluss ------------------------------------------------------------- */

console.log('\n' + gefangen + ' gefangen · ' + durchgerutscht.length + ' durchgerutscht · '
  + toteAnker.length + ' tote Anker');
for (const d of durchgerutscht) console.log('  ✗ ' + d);
for (const t of toteAnker) console.log('  ⊘ ' + t);

/* Ein toter Anker ist kein bestandener Fall: er misst nichts und sieht aus wie
   Deckung. Beides setzt den Rueckgabewert. */
if (durchgerutscht.length || toteAnker.length) process.exit(1);
