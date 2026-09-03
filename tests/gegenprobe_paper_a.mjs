/* gegenprobe_paper_a.mjs — baut Fehler ein. JEDER MUSS eine Probe umwerfen.
 *
 * Lauf:  node tests/gegenprobe_paper_a.mjs
 *
 * Geprueft werden `smoke_paper_a.mjs` und `smoke_paper_css.mjs`. Wirft ein
 * eingebauter Fehler die zugehoerige Probe NICHT um, ist der Waechter an
 * dieser Stelle blind — und ein blinder Waechter ist schlimmer als keiner,
 * weil sein Gruen beruhigt.
 *
 * ── DREI ARTEN, WIE EIN FALL NICHTS MISST ─────────────────────────────────
 *
 * Aus Kimhubs Verfassung uebernommen, weil sie hier genauso gelten:
 *   1. die Sabotage aendert NICHTS (toter Anker) — deshalb wird nach jedem
 *      Eingriff geprueft, ob die Datei sich wirklich geaendert hat;
 *   2. sie erstickt die Probe (Absturz statt Befund) — ein Absturz zaehlt
 *      hier als „gefangen", aber der Grund wird mit ausgegeben, damit man
 *      sieht, ob die RICHTIGE Zusicherung gefallen ist;
 *   3. sie macht das Programm unlauffaehig — dasselbe.
 *
 * Alle Dateien werden vorher gesichert und am Ende zurueckgeschrieben, auch
 * wenn der Lauf abbricht (finally).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const MD = P('docs/papers/PAPER_A_regeln-und-grundsaetze.md');
const HTML = P('docs/papers/paper-a-regeln-und-grundsaetze.html');
const CSS = P('docs/papers/paper.css');

const sicher = new Map();
for (const f of [MD, HTML, CSS]) sicher.set(f, readFileSync(f, 'utf8'));
const zurueck = () => { for (const [f, inhalt] of sicher) writeFileSync(f, inhalt, 'utf8'); };

function probeLaeuft(datei) {
  try {
    execFileSync('node', [P('tests/' + datei)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { rot: false, text: '' };
  } catch (e) {
    return { rot: true, text: String(e.stdout || '') + String(e.stderr || '') };
  }
}

let gefangen = 0;
const durchgerutscht = [];
const toteAnker = [];

/* Ein Fall: Datei, Ersetzung, welche Probe ihn fangen muss, und WELCHE Zeile
   in deren Ausgabe rot werden soll. Die letzte Angabe ist der Punkt — „eine
   Probe ist rot" genuegt nicht, es muss die richtige Zusicherung sein. */
function fall(name, datei, alt, neu, probe, erwarteteZeile) {
  const vorher = readFileSync(datei, 'utf8');
  const nachher = typeof alt === 'function' ? alt(vorher) : vorher.replace(alt, neu);

  if (nachher === vorher) {
    toteAnker.push(name);
    console.log('  ⊘ ANKER NICHT GEFUNDEN: ' + name);
    return;
  }

  writeFileSync(datei, nachher, 'utf8');
  const ergebnis = probeLaeuft(probe);
  writeFileSync(datei, vorher, 'utf8');

  if (!ergebnis.rot) {
    durchgerutscht.push(name);
    console.log('  ✗ NICHT GEFANGEN: ' + name);
    return;
  }

  const richtige = erwarteteZeile && ergebnis.text.includes(erwarteteZeile);
  gefangen++;
  console.log('  ✓ gefangen: ' + name + (erwarteteZeile && !richtige
    ? '  ⚠ aber NICHT an „' + erwarteteZeile + '" — die Probe fiel aus einem anderen Grund'
    : ''));
}

console.log('Gegenprobe Paper A — jeder Fehler MUSS eine Probe umwerfen\n');

try {
  /* --- Der Drift-Waechter: Markdown und HTML laufen auseinander ----------- */

  fall('HTML von Hand geaendert (ein Wort im Fliesstext)',
    HTML, 'Feldbeobachtung mit Protokoll', 'Feldbeobachtung mit Protokoll UND BEWEIS',
    'smoke_paper_a.mjs', 'Die abgelegte HTML ist der frische Bau');

  fall('Markdown geaendert, HTML nicht neu gebaut',
    MD, '## 8 · Einordnung', '## 8 · Einordnung und Ausblick',
    'smoke_paper_a.mjs', 'Die abgelegte HTML ist der frische Bau');

  /* --- Die Aussagen ueber das Dokument ------------------------------------ */

  fall('Ein Hauptabschnitt faellt weg',
    MD, '\n## 9 · Verfügbarkeit\n', '\n### 9 · Verfügbarkeit\n',
    'smoke_paper_a.mjs', 'Elf Hauptabschnitte');

  fall('Die Grenzen-Aussage „Fallzahl eins" verschwindet',
    MD, '- **Fallzahl eins.**', '- **Ein Betreiber.**',
    'smoke_paper_a.mjs', 'Die Grenzen stehen im Dokument');

  fall('Der Feldbeobachtungs-Rahmen wird zum Nachweis umgeschrieben',
    MD, 'eine Feldbeobachtung mit Protokoll, kein Nachweis',
    'ein belastbarer Nachweis',
    'smoke_paper_a.mjs', 'Der Rahmen ist Feldbeobachtung');

  fall('Der DOI-Vermerk wird still geleert',
    HTML, /<p class="paper-doi">[\s\S]*?<\/p>/, '<p class="paper-doi"></p>',
    'smoke_paper_a.mjs', 'Der DOI ist entweder echt');

  /* Der Seitenumbruch steht seit dem 2026-09-03 in EIGENE_SEITE im Erzeuger,
     nicht mehr als Marke im Markdown — die Marke erschien sonst als sichtbarer
     Text in der Antragsmappe, die dasselbe Markdown liest. */
  fall('Ein Schlussabschnitt verliert seine eigene Seite',
    P('tools/paper-md-zu-html.mjs'),
    "'8 · Einordnung', '9 · Verfügbarkeit'", "'8 · Einordnung'",
    'smoke_paper_a.mjs', 'Zwei Schlussabschnitte tragen die eigene Seite');

  /* --- Der Erzeuger selbst: fett MIT kursiv darin ------------------------- */

  /* Das ist der Fehler, den diese Sitzung am 2026-09-03 wirklich hatte: die
     Fett-Regel gab am ersten Sternchen auf und liess `**` im Text stehen. */
  fall('Die Fett-Regel gibt am ersten Kursiv-Sternchen auf',
    P('tools/paper-md-zu-html.mjs'),
    '.replace(/\\*\\*((?:[^*]|\\*(?!\\*))+)\\*\\*/g,',
    '.replace(/\\*\\*([^*]+)\\*\\*/g,',
    'smoke_paper_a.mjs', 'Keine rohe Fett-Auszeichnung');

  /* --- Die vierte Ueberschriften-Ebene -------------------------------------- */

  /* Der echte Fehler vom 2026-09-03: der Erzeuger kannte `####` nicht. */
  fall('Der Erzeuger kennt die vierte Ebene nicht mehr',
    P('tools/paper-md-zu-html.mjs'),
    "  if (/^####\\s+/.test(t)) {", "  if (/^@@@@nie@@@@/.test(t)) {",
    'smoke_paper_a.mjs', 'Keine rohen Rauten-Überschriften mehr im Text');

  /* Und die Gegenrichtung: die Zeilen verschwinden ganz. Ein Waechter nur auf
     „keine rohe Raute" waere dann gruen, obwohl 35 Ueberschriften fehlen. */
  fall('Die vierten Ueberschriften verschwinden spurlos',
    P('tools/paper-md-zu-html.mjs'),
    "    aus.push(einzug() + '<h4>' + inline(t.replace(/^####\\s+/, '')) + '</h4>');",
    "    /* nichts */",
    'smoke_paper_a.mjs', 'Die vierte Überschriften-Ebene ist gesetzt');

  /* --- Der Schluss des Dokuments -------------------------------------------- */

  fall('Der Trennstrich vor der erzwungenen Seite kommt zurueck',
    P('tools/paper-md-zu-html.mjs'),
    "        if (aus.length && aus[aus.length - 1].includes('<hr class=\"divider\">')) aus.pop();",
    "        /* Strich bleibt stehen */",
    'smoke_paper_a.mjs', 'Kein Trennstrich steht direkt vor einer erzwungenen Seite');

  fall('Der Verfasser-Block faellt weg',
    P('tools/paper-md-zu-html.mjs'),
    "    } else if (/^(Zum Verfasser|About the author)$/i.test(text)) {",
    "    } else if (/^@@@nie@@@$/.test(text)) {",
    'smoke_paper_a.mjs', 'Der Verfasser-Abschnitt steht in seinem eigenen Block');

  /* --- Der Stil-Waechter --------------------------------------------------- */

  fall('paper.css laeuft von der inline-Fassung weg',
    CSS, '@page { size:A4; margin:15mm 14mm; }', '@page { size:A4; margin:20mm 20mm; }',
    'smoke_paper_css.mjs', 'byte-gleich mit dem <style> der DE-Fassung');

  fall('Die Regel gegen umbrechende Tabellen faellt weg',
    CSS, /table \{ break-inside:avoid; \}/, 'table { break-inside:auto; }',
    'smoke_paper_css.mjs', 'Tabellen brechen nicht um');

  /* ⚠ DIE GANZE REGEL-ZEILE, NICHT NUR `orphans:4`. Der erste Anlauf ersetzte
     die Zeichenkette — und traf damit den KOPF-KOMMENTAR von paper.css, der
     die Regel zitiert. Die Datei aenderte sich (also kein toter Anker), die
     Regel blieb stehen, und der Fall meldete „NICHT GEFANGEN", obwohl gar
     nichts sabotiert war. Das ist die vierte Art, wie ein Fall nichts misst:
     er trifft eine ANDERE Fundstelle als die gemeinte. */
  fall('Die Waisen-Regel faellt weg',
    CSS, 'h2 + p, h3 + p { break-before:avoid; orphans:4; }',
    'h2 + p, h3 + p { break-before:avoid; }',
    'smoke_paper_css.mjs', 'Ueberschrift bleibt bei ihrem Absatz');

  /* Und der Fall, den die beiden Fehler oben aufgedeckt haben: steht die Regel
     NUR noch im Kommentar, muss die Probe trotzdem umfallen. */
  fall('Die Regel ist weg, der Kommentar darueber bleibt stehen',
    CSS, /  h2 \+ p, h3 \+ p \{ break-before:avoid; orphans:4; \}/,
    '  h2 + p, h3 + p { break-before:avoid; orphans:1; }',
    'smoke_paper_css.mjs', 'Ueberschrift bleibt bei ihrem Absatz');
} finally {
  zurueck();
}

/* Nach dem Zurueckschreiben muss wieder alles gruen sein — sonst hat die
   Gegenprobe etwas hinterlassen, und die naechste Messung waere wertlos. */
console.log('\nAusgangslage wiederhergestellt?');
const a = probeLaeuft('smoke_paper_a.mjs');
const b = probeLaeuft('smoke_paper_css.mjs');
const sauber = !a.rot && !b.rot;
console.log(sauber ? '  ✓ beide Proben wieder gruen' : '  ✗ NICHT sauber — die Gegenprobe hat etwas liegen lassen');

const summe = gefangen + durchgerutscht.length + toteAnker.length;
console.log('\n' + gefangen + ' von ' + summe + ' gefangen · ' +
  durchgerutscht.length + ' durchgerutscht · ' + toteAnker.length + ' tote Anker');
for (const d of durchgerutscht) console.log('  · durchgerutscht: ' + d);
for (const t of toteAnker) console.log('  · toter Anker: ' + t);

process.exit(durchgerutscht.length || toteAnker.length || !sauber ? 1 : 0);
