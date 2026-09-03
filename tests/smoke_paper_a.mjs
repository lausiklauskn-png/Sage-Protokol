/* smoke_paper_a.mjs — haelt die HTML-Fassung von Paper A an ihrem Markdown.
 *
 * Lauf:  node tests/smoke_paper_a.mjs
 *
 * ── DIE ZUSICHERUNG ───────────────────────────────────────────────────────
 *
 * `docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.html` ist ein ERZEUGNIS aus
 * `docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.md`. Diese Probe baut die HTML
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
const MD = resolve(WURZEL, 'docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.md');
const HTML = resolve(WURZEL, 'docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.html');

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

/* ⚠ DER DOI KOMMT NICHT AUS DEM MARKDOWN, SONDERN VON AUSSEN.
 *
 * Er wird bei Zenodo reserviert und dem Erzeuger per `--doi` mitgegeben. Ein
 * Neubau OHNE ihn erzeugt den Platzhalter und weicht damit zwangslaeufig ab.
 * Bis zum 2026-09-03 tat diese Probe genau das: sie baute ohne DOI und
 * verglich gegen die abgelegte Fassung. Solange keiner vergeben war, fiel es
 * nicht auf; mit der ersten echten Nummer wurde sie rot, obwohl nichts kaputt
 * war. Eine Probe, die beim Richtigen umfaellt, ist so schaedlich wie eine,
 * die beim Falschen gruen bleibt.
 *
 * Gelesen wird er deshalb aus der abgelegten Datei und beim Neubau
 * durchgereicht. Der Waechter misst weiter, was er messen soll: ob am TEXT
 * von Hand gedreht wurde. Dass der DOI selbst stimmt, misst die Pruefung
 * weiter unten. */
const doiAus = (html) => (html.match(/doi\.org\/(10\.\d{4,}\/[^"<\s]+)/) || [])[1] || '';

const abgelegtRoh = readFileSync(HTML, 'utf8');
const deDoi = doiAus(abgelegtRoh);
const probeZiel = join(tmpdir(), 'paper-a-probe-' + process.pid + '.html');
let neu = '';
try {
  execFileSync('node', [resolve(WURZEL, 'tools/paper-md-zu-html.mjs'), MD, '--ziel', probeZiel,
    ...(deDoi ? ['--doi', deDoi] : [])],
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
  ' — mit `node tools/paper-md-zu-html.mjs docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.md ' +
  '--ziel docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.html` neu bauen');

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

/* ⚠ EIN TRENNSTRICH VOR EINER ERZWUNGENEN SEITE KOSTET EINE GANZE SEITE.
   Gemessen am 2026-09-03: der Strich passte nicht mehr aufs Blatt, wanderte
   auf die naechste Seite, und die Ueberschrift schob sich per
   `break-before:page` noch eine weiter. Uebrig blieb eine Seite mit einem
   Strich darauf und sonst nichts. Gefunden hat es Klaus im PDF.
   Gemessen wird die Reihenfolge im Dokument, nicht die Seitenzahl: die haengt
   vom Text davor ab und aendert sich mit jedem Absatz. */
pruefe('Kein Trennstrich steht direkt vor einer erzwungenen Seite',
  !/<hr class="divider">\s*<h2 class="eigene-seite"/.test(rumpf));

/* Der Verfasser-Block wird wie die Quellen klein gesetzt, damit der Schluss
   nicht mit vier Zeilen allein auf einer eigenen Seite endet. */
pruefe('Der Verfasser-Abschnitt steht in seinem eigenen Block',
  /<div class="verfasser">/.test(rumpf));

/* ---- 3. Die englische Fassung ------------------------------------------- */

/* ⚠ ZWEI FASSUNGEN DESSELBEN TEXTES SIND DER TEUERSTE BEFUND DIESES ORDNERS.
   `docs/papers/README.md`: bis zum 2026-09-02 gab es jedes SBKIM-Paper zweimal,
   mit verschiedenen Titeln. „Zwei Texte mit derselben Ueberschrift und
   verschiedenem Inhalt lassen sich nicht mehr reparieren, sobald jemand einen
   davon zitiert hat."

   Eine Uebersetzung laesst sich nicht Wort fuer Wort vergleichen. Ihre
   GLIEDERUNG schon: gleich viele Abschnitte, gleich viele Unterabschnitte,
   gleich viele vierte Ebenen. Weicht das ab, hat eine Seite einen Abschnitt
   bekommen oder verloren, und das ist genau der Anfang des Auseinanderlaufens.
   Es misst nicht, ob richtig uebersetzt wurde. Es misst, ob jemand nach der
   Uebersetzung nur EINE der beiden Fassungen geaendert hat. */

const EN_MD = resolve(WURZEL, 'docs/papers/rules-and-principles-in-ai-agent-systems.md');
const EN_HTML = resolve(WURZEL, 'docs/papers/rules-and-principles-in-ai-agent-systems.html');

pruefe('Die englische Fassung liegt vor', existsSync(EN_MD) && existsSync(EN_HTML));

if (existsSync(EN_MD) && existsSync(EN_HTML)) {
  const de = readFileSync(MD, 'utf8');
  const en = readFileSync(EN_MD, 'utf8');
  const zaehle = (t, m) => (t.match(m) || []).length;

  for (const [was, muster] of [
    ['Hauptabschnitte', /^## /gm],
    ['Unterabschnitte', /^### /gm],
    ['vierte Ebenen', /^#### /gm],
  ]) {
    const a = zaehle(de, muster), b = zaehle(en, muster);
    pruefe('Deutsch und Englisch haben gleich viele ' + was, a === b,
      'deutsch ' + a + ', englisch ' + b);
  }

  const enNeu = join(tmpdir(), 'paper-a-en-probe-' + process.pid + '.html');
  let frisch = '';
  try {
    execFileSync('node', [resolve(WURZEL, 'tools/paper-md-zu-html.mjs'), EN_MD,
      '--ziel', enNeu, '--sprache', 'en',
      ...(doiAus(readFileSync(EN_HTML, 'utf8')) ? ['--doi', doiAus(readFileSync(EN_HTML, 'utf8'))] : [])],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    frisch = readFileSync(enNeu, 'utf8');
  } catch (e) {
    console.log('  ✗ Der Erzeuger lief fuer die englische Fassung nicht durch');
  } finally {
    try { if (existsSync(enNeu)) unlinkSync(enNeu); } catch (_e) { /* egal */ }
  }
  const enAbgelegt = readFileSync(EN_HTML, 'utf8');
  pruefe('Die englische HTML ist der frische Bau aus ihrem Markdown',
    !!frisch && ohneQuellzeile(frisch) === ohneQuellzeile(enAbgelegt));

  const enRumpf = enAbgelegt.slice(enAbgelegt.indexOf('<body>'));
  pruefe('Englisch: keine rohen Rauten-Überschriften im Text',
    !/^\s*#{1,6}\s/m.test(enRumpf));
  pruefe('Englisch: die Seite ist als englisch ausgezeichnet',
    /<html lang="en">/.test(enAbgelegt));
  pruefe('Englisch: die Grenzen stehen im Dokument',
    /No control group/.test(enRumpf) && /Sample of one/.test(enRumpf) &&
    /Not blinded/.test(enRumpf));
  pruefe('Englisch: der Rahmen ist Feldbeobachtung, nicht Nachweis',
    /field observation with a record/.test(enRumpf));
  /* ⚠ EIN WERK, EIN DOI. Beide Sprachfassungen liegen in EINEM Zenodo-Eintrag,
     so wie beim SBKIM-Papier. Zwei verschiedene Nummern hiessen zwei Werke, und
     wer die eine zitiert, haette die andere nicht mit erfasst. Ein Tippfehler
     in einer der beiden faellt sonst niemandem auf: beide sehen fuer sich
     richtig aus. */
  const enDoi = doiAus(readFileSync(EN_HTML, 'utf8'));
  pruefe('Beide Sprachfassungen tragen DENSELBEN DOI', deDoi === enDoi,
    'deutsch „' + (deDoi || '—') + '", englisch „' + (enDoi || '—') + '"');
  pruefe('Der DOI hat die Form einer echten Nummer, oder es ist keiner da',
    !deDoi || /^10\.\d{4,}\/[\w.\-/]+$/.test(deDoi), 'gelesen: „' + deDoi + '"');

  pruefe('Englisch: alle acht Quellen stehen da',
    ['Bai', 'Gneezy', 'Kant', 'Kaplow', 'Kohlberg', 'Rebedea', 'Schuett', 'Tyler']
      .every((n) => enRumpf.includes(n)));
}

console.log('\n' + gruen + ' gruen, ' + rot.length + (rot.length ? ' ROT' : ' rot'));
process.exit(rot.length ? 1 : 0);
