/* smoke_paper_a.mjs — haelt die HTML-Fassung von Paper A an ihrem Markdown.
 *
 * Lauf:  node tests/smoke_paper_a.mjs
 *
 * ── DIE ZUSICHERUNG ───────────────────────────────────────────────────────
 *
 * `docs/papers/paper-a-regeln-und-grundsaetze.html` ist ein ERZEUGNIS aus
 * `docs/papers/PAPER_A_regeln-und-grundsaetze.md`. Diese Probe baut die HTML
 * neu und vergleicht sie mit der abgelegten. Weichen sie ab, ist eine der
 * beiden von Hand geaendert worden — und dann gibt es den Text zweimal.
 *
 * Genau das ist der teuerste Befund aus `docs/papers/README.md`: bis zum
 * 2026-09-02 gab es jedes SBKIM-Paper doppelt, mit verschiedenen Titeln.
 * „Zwei Texte mit derselben Ueberschrift und verschiedenem Inhalt lassen sich
 * nicht mehr reparieren, sobald jemand einen davon zitiert hat."
 *
 * ⚠ Gemessen wird der VERGLEICH, nicht ein Zeitstempel. Eine Probe an den
 * Aenderungsdaten waere gruen, sobald jemand die HTML nur beruehrt, und rot
 * nach einem frischen Auszug, wo alle Dateien dieselbe Zeit tragen.
 *
 * ── UND VIER AUSSAGEN UEBER DAS DOKUMENT SELBST ───────────────────────────
 *
 * Der Vergleich allein bewacht nur die Gleichheit. Er waere auch dann gruen,
 * wenn der Erzeuger beide Male denselben Unsinn baut. Deshalb zusaetzlich:
 * elf Hauptabschnitte, keine rohe Markdown-Syntax mehr im Text, die
 * Grenzen-Aussage steht drin, und der DOI ist entweder echt oder als fehlend
 * ausgewiesen — nie stillschweigend leer.
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MD = resolve(WURZEL, 'docs/papers/PAPER_A_regeln-und-grundsaetze.md');
const HTML = resolve(WURZEL, 'docs/papers/paper-a-regeln-und-grundsaetze.html');

let gruen = 0;
const rot = [];
const pruefe = (name, bedingung, hinweis) => {
  if (bedingung) { gruen++; console.log('  ✓ ' + name); }
  else { rot.push(name + (hinweis ? ' — ' + hinweis : '')); console.log('  ✗ ' + name + (hinweis ? ' — ' + hinweis : '')); }
};

console.log('Paper A: HTML gegen ihr Markdown');

pruefe('Das Markdown liegt vor', existsSync(MD));
pruefe('Die HTML-Fassung liegt vor', existsSync(HTML));

if (rot.length) {
  console.log('\n' + gruen + ' gruen, ' + rot.length + ' ROT');
  process.exit(1);
}

/* ---- 1. Neu bauen und vergleichen --------------------------------------- */

const probeZiel = join(tmpdir(), 'paper-a-probe-' + process.pid + '.html');
let neu = '';
try {
  execFileSync('node', [resolve(WURZEL, 'tools/paper-md-zu-html.mjs'), MD, '--ziel', probeZiel],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  neu = readFileSync(probeZiel, 'utf8');
} catch (e) {
  console.log('  ✗ Der Erzeuger lief nicht durch: ' + (e.message || e).split('\n')[0]);
  process.exit(1);
} finally {
  try { if (existsSync(probeZiel)) unlinkSync(probeZiel); } catch (_e) { /* egal */ }
}

const abgelegt = readFileSync(HTML, 'utf8');

/* Der Erzeuger schreibt den Quellpfad so in den Kopf, wie er aufgerufen wurde.
   Hier ist er absolut, im Bau-Aufruf relativ — das ist KEIN Auseinanderlaufen
   des Textes. Verglichen wird deshalb ohne diese eine Zeile. */
const ohneQuellzeile = (s) => s.replace(/^ {5}Die Quelle ist .*$/m, '     Die Quelle ist <pfad>');

pruefe('Die abgelegte HTML ist der frische Bau aus dem Markdown',
  ohneQuellzeile(neu) === ohneQuellzeile(abgelegt),
  'neu gebaut ' + neu.length + ' Zeichen, abgelegt ' + abgelegt.length +
  ' — mit `node tools/paper-md-zu-html.mjs docs/papers/PAPER_A_regeln-und-grundsaetze.md ' +
  '--ziel docs/papers/paper-a-regeln-und-grundsaetze.html` neu bauen');

/* ---- 2. Aussagen ueber das Dokument ------------------------------------- */

/* ⚠ NUR IM RUMPF ZAEHLEN. Der erste Anlauf zaehlte im ganzen Dokument und kam
   auf ZWOELF: der Stil im Kopf traegt die Zeichenfolge `<h2>` in einem
   Kommentar („Die Klasse steht am <h2>, nicht als :nth-of-type(8)"). Eine
   Suche im Quelltext misst eben den Quelltext, nicht das Dokument. Gefunden
   hat es diese Probe beim ersten Lauf — an sich selbst. */
const rumpf = abgelegt.slice(abgelegt.indexOf('<body>'));

const abschnitte = (rumpf.match(/<h2[^>]*>/g) || []).length;
pruefe('Elf Hauptabschnitte (1–9, Literatur, Zum Verfasser)', abschnitte === 11,
  'gezaehlt: ' + abschnitte);
pruefe('Keine rohe Fett-Auszeichnung mehr im Text', !/\*\*/.test(rumpf),
  'irgendwo blieb `**` stehen — meist fett MIT kursiv darin');
pruefe('Keine rohen Tabellen-Striche mehr im Text', !/^\s*\|.*\|\s*$/m.test(rumpf));

/* ⚠ VIER RAUTEN. Der Erzeuger kannte bis zum 2026-09-03 nur `##` und `###`;
   die 35 `####`-Zeilen fielen durch in den Absatz-Zweig und standen woertlich
   als „#### Zwei Richtungen, die man nicht verwechseln darf" im PDF. Gefunden
   hat es Klaus beim Lesen, keine Probe. Gemessen wird beides: keine rohe Raute
   im Text UND die vierte Ebene ist wirklich gesetzt. Nur das erste zu pruefen
   waere auch dann gruen, wenn die Zeilen ganz verschwaenden. */
const rauten = (rumpf.match(/^\s*#{1,6}\s/gm) || []).length;
pruefe('Keine rohen Rauten-Überschriften mehr im Text', rauten === 0,
  'gefunden: ' + rauten);

const h4 = (rumpf.match(/<h4>/g) || []).length;
pruefe('Die vierte Überschriften-Ebene ist gesetzt', h4 === 35,
  'gezaehlt: ' + h4 + ' (erwartet 35)');

pruefe('Die Grenzen stehen im Dokument',
  /Keine Kontrollgruppe/.test(rumpf) && /Fallzahl eins/.test(rumpf) &&
  /Nicht verblindet/.test(rumpf));

pruefe('Der Rahmen ist Feldbeobachtung, nicht Nachweis',
  /Feldbeobachtung mit Protokoll/.test(rumpf));

/* Entweder ein echter DOI oder ein als fehlend AUSGEWIESENER. Ein leeres Feld
   saehe aus wie ein Dokument ohne DOI, ein stiller Platzhalter wie einer mit. */
const hatEchtenDoi = /doi\.org\/10\.\d{4,}/.test(rumpf);
const hatFehlendVermerk = /DOI: noch nicht vergeben/.test(rumpf);
pruefe('Der DOI ist entweder echt oder ausdruecklich als fehlend vermerkt',
  hatEchtenDoi || hatFehlendVermerk);

/* Die beiden Schlussabschnitte beginnen je eine neue Seite (wie bei SBKIM). */
pruefe('Zwei Schlussabschnitte tragen die eigene Seite',
  (abgelegt.match(/class="eigene-seite"/g) || []).length === 2);

console.log('\n' + gruen + ' gruen, ' + rot.length + (rot.length ? ' ROT' : ' rot'));
process.exit(rot.length ? 1 : 0);
