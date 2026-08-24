/* arbeitstage-bauen.mjs — die Arbeitstage einzeln, als tägliche Dokumentation.
 *
 * Aufruf:   node tools/arbeitstage-bauen.mjs
 * Liest:    docs/historie/historie.json   (aus tools/historie-auslesen.mjs)
 * Schreibt: docs/historie/arbeitstage.html
 *           docs/historie/arbeitstage-tage.csv          (eine Zeile je Tag)
 *           docs/historie/arbeitstage-taetigkeiten.csv  (eine Zeile je Eintrag)
 *
 * ── WOZU ───────────────────────────────────────────────────────────────────
 *
 * Klaus am 2026-08-24: „Kannst Du diese Tage einzeln auflisten, sodass wenn das
 * Finanzamt mal nachfragen sollte, ob ich wirklich so lange an den einzelnen
 * Tagen gearbeitet habe?" Dazu: „im Stil einer täglichen Dokumentation."
 *
 * Das Blatt geht also möglicherweise an eine Behörde. Daraus folgt alles Weitere.
 *
 * ── DIE ENTSCHEIDUNG, AUF DER DAS GANZE BLATT STEHT ────────────────────────
 *
 * **Die Spalten sagen, was sie messen.** Keine Spalte heißt „gearbeitet".
 * Sie heißen „erster Eintrag", „letzter Eintrag", „Spanne", „aktive Zeit".
 *
 * Das ist kein Zögern, sondern der einzige Weg, auf dem die Zahlen tragen. Eine
 * Spalte mit der Überschrift „gearbeitet: 19,9 h" wäre eine Behauptung, die bei
 * der ersten Rückfrage zusammenfällt. Eine Spalte „Spanne vom ersten bis zum
 * letzten Eintrag: 19,9 h" ist eine Tatsache, die aus fremden Zeitstempeln
 * nachprüfbar ist. Die Überschrift trägt die Ehrlichkeit, damit darunter kein
 * Absatz voller Einschränkungen stehen muss.
 *
 * ── DIE AUTOMATIK FLIEGT RAUS, UND WARUM DAS DER WICHTIGSTE SCHRITT IST ────
 *
 * Achtundvierzig Einträge stammen von `github-actions[bot]`, zweiunddreißig
 * davon nachts um drei. Das sind zeitgesteuerte Läufe, kein Mensch war dabei.
 *
 * Ließe man sie stehen, wiese das Blatt **64,9 Stunden zu viel** aus, und zwar
 * an genau der Stelle, an der eine Prüfung zuerst hinsieht: eine Zeile „erster
 * Eintrag 03:04" an einem Tag, an dem in Wahrheit ab neun gearbeitet wurde.
 * Ein einziger solcher Fund macht die ganze Aufstellung wertlos, auch die
 * richtigen Zeilen darin.
 *
 * Sie werden deshalb aus der Zeitrechnung genommen, und das Blatt schreibt
 * hin, dass es das tut. **Eine Zahl, die man selbst nach unten korrigiert
 * hat, trägt weiter als eine, die jemand anders nach unten korrigieren muss.**
 *
 * ── WARUM DIE ZAHLEN TROTZDEM EHER ZU NIEDRIG SIND ─────────────────────────
 *
 * Ein Eintrag entsteht, wenn ein Arbeitsstand gespeichert wird. Lesen, Denken,
 * Prüfen, Besprechen und jeder Versuch, der verworfen wurde, hinterlassen
 * keinen. Vor dem ersten und nach dem letzten Eintrag eines Tages ist ebenfalls
 * gearbeitet worden.
 *
 * Belegbar an einem Tag, an dem die Antwort unabhängig bekannt ist: für den
 * Samstag, den 22.08.2026, misst dieses Werkzeug 19,9 Stunden Spanne. Klaus hat
 * denselben Tag unabhängig davon mit „zwanzig Stunden" angegeben.
 *
 * ── DIE ZEITSTEMPEL SIND NICHT VON HAND GESETZT ────────────────────────────
 *
 * Sie stammen aus Git und werden beim Speichern vom System vergeben. Genau das
 * macht sie als Nachweis brauchbar: sie sind nicht nachträglich eingetragen.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LUECKE_MIN, VORLAUF_MIN, rechneTage } from './arbeitstage-rechnen.mjs';

const SAGE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(SAGE, 'docs/historie/historie.json');
const ZIEL_HTML = resolve(SAGE, 'docs/historie/arbeitstage.html');
const ZIEL_TAGE = resolve(SAGE, 'docs/historie/arbeitstage-tage.csv');
const ZIEL_TAET = resolve(SAGE, 'docs/historie/arbeitstage-taetigkeiten.csv');

/* Die Regeln der Rechnung stehen in `tools/arbeitstage-rechnen.mjs`, damit
   Blatt, Bericht und Probe dieselbe benutzen. Das Blatt nennt die Zahlen
   DARAUS und kann deshalb nicht danebenliegen. */

const d = JSON.parse(readFileSync(QUELLE, 'utf-8'));

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const zahl = (n) => Number(n).toLocaleString('de-DE');
const std = (n) => n.toFixed(1).replace('.', ',');
const minuten = (z) => { const [h, m] = z.split(':').map(Number); return h * 60 + m; };
const deutsch = (datum) => datum.split('-').reverse().join('.');

const WOCHENTAG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
  'Donnerstag', 'Freitag', 'Samstag'];
const MONATSNAME = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember'];
const wochentag = (datum) => WOCHENTAG[new Date(datum + 'T00:00:00Z').getUTCDay()];
const monatName = (m) => MONATSNAME[Number(m.slice(5, 7)) - 1] + ' ' + m.slice(0, 4);

/* ── Je Tag rechnen: EINE Quelle, siehe arbeitstage-rechnen.mjs ──────────── */

const { tage, summe: g } = rechneTage(d.commits);

/* Was das Blatt ohne die Bereinigung auswiese. Gerechnet, nicht behauptet. */
const mitAutomatik = rechneTage(d.commits, { automatikZaehlt: true }).summe;

const WOCHENTAG_NR = (datum) => new Date(datum + 'T00:00:00Z').getUTCDay();
for (const t of tage) t.wochentag = WOCHENTAG[WOCHENTAG_NR(t.datum)];

const gesSpanne = g.spanne;
const gesAktiv = g.aktiv;
const gesEintraege = g.eintraege;
const gesAutomatik = g.automatik;
const arbeitstage = g.arbeitstage;

const monate = new Map();
for (const t of tage) {
  const m = t.datum.slice(0, 7);
  if (!monate.has(m)) monate.set(m, []);
  monate.get(m).push(t);
}

/* ── Die zwei Tabellenblätter ─────────────────────────────────────────────── */

/* Semikolon und Komma als Dezimalzeichen: so öffnet ein deutsches Excel die
   Datei ohne Import-Dialog. Der BOM sorgt dafür, dass es UTF-8 erkennt und
   die Umlaute nicht als Fragezeichen erscheinen. */
const csvFeld = (v) => {
  const s = String(v == null ? '' : v);
  return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const csvZeile = (felder) => felder.map(csvFeld).join(';');

let csvTage = '﻿' + csvZeile(['Datum', 'Wochentag', 'Erster Eintrag',
  'Letzter Eintrag', 'Spanne in Stunden', 'Aktive Zeit in Stunden',
  'Abschnitte', 'Eintraege', 'Depots']) + '\r\n';
for (const t of tage) {
  csvTage += csvZeile([deutsch(t.datum), t.wochentag, t.erster, t.letzter,
    std(t.spanne), std(t.aktiv), t.abschnitte, t.eintraege, t.depots]) + '\r\n';
}
csvTage += csvZeile(['Summe', arbeitstage + ' Tage', '', '',
  std(gesSpanne), std(gesAktiv), '', gesEintraege, '']) + '\r\n';
writeFileSync(ZIEL_TAGE, csvTage, 'utf-8');

let csvTaet = '﻿' + csvZeile(['Datum', 'Wochentag', 'Uhrzeit', 'Depot',
  'Taetigkeit', 'Zeilen dazu', 'Zeilen entfernt']) + '\r\n';
for (const t of tage) {
  for (const c of t.liste) {
    csvTaet += csvZeile([deutsch(t.datum), t.wochentag, c.zeit, c.repo,
      c.betreff, c.plus, c.minus]) + '\r\n';
  }
}
writeFileSync(ZIEL_TAET, csvTaet, 'utf-8');

/* ── Das Blatt ────────────────────────────────────────────────────────────── */

const stil = `
:root{color-scheme:light dark;--grund:#f7f6f3;--tinte:#1b1b1b;--matt:#5a5a5a;
--kante:#d8d5cf;--karte:#fff;--akzent:#7a4b1e;--zeile:#efece6}
@media (prefers-color-scheme:dark){:root{--grund:#14161a;--tinte:#e8e6e1;
--matt:#a4a09a;--kante:#2e3238;--karte:#1b1e23;--akzent:#e0a253;--zeile:#191c21}}
*{box-sizing:border-box}
body{margin:0;background:var(--grund);color:var(--tinte);
font:16px/1.6 Georgia,"Times New Roman",serif;padding:0 0 4rem}
.wrap{max-width:62rem;margin:0 auto;padding:0 1rem}
h1{font-size:1.8rem;line-height:1.25;margin:2rem 0 .3rem}
h2{font-size:1.25rem;margin:2.6rem 0 .6rem;border-bottom:1px solid var(--kante);
padding-bottom:.3rem}
p{margin:0 0 1rem}
.unter{color:var(--matt);font-style:italic;margin:0 0 1.6rem}
.kasten{background:var(--karte);border:1px solid var(--kante);border-radius:6px;
padding:1rem 1.2rem;margin:0 0 1.6rem}
.kasten p:last-child{margin-bottom:0}
.kopf{display:flex;flex-wrap:wrap;gap:1rem;margin:0 0 1.8rem}
.kopf div{background:var(--karte);border:1px solid var(--kante);border-radius:6px;
padding:.7rem 1rem;min-width:9rem}
.kopf b{display:block;font-size:1.45rem;font-family:system-ui,sans-serif;
line-height:1.1}
.kopf span{display:block;color:var(--matt);font-size:.78rem;
font-family:system-ui,sans-serif}
.rahmen{overflow-x:auto;margin:0 0 1.4rem}
table{border-collapse:collapse;width:100%;font-family:system-ui,sans-serif;
font-size:.85rem}
th,td{padding:.4rem .55rem;text-align:right;border-bottom:1px solid var(--kante);
white-space:nowrap}
th{font-weight:600;vertical-align:bottom;line-height:1.25;
border-bottom:2px solid var(--kante)}
th small{display:block;font-weight:400;color:var(--matt);font-size:.72rem}
td.l,th.l{text-align:left}
tbody tr:nth-child(even){background:var(--zeile)}
tfoot td{font-weight:700;border-top:2px solid var(--kante);border-bottom:none;
padding-top:.6rem}
.mon td{background:var(--karte);font-weight:600;border-top:1px solid var(--kante)}
.tag{margin:0 0 1.6rem;break-inside:avoid}
.tag h3{font-size:1.02rem;margin:1.5rem 0 .1rem;font-family:system-ui,sans-serif}
.tag .zeiten{font-family:system-ui,sans-serif;font-size:.83rem;color:var(--matt);
margin:0 0 .45rem}
.tag ol{margin:0;padding:0;list-style:none;font-family:system-ui,sans-serif;
font-size:.83rem}
.tag li{display:flex;gap:.6rem;padding:.16rem 0;border-bottom:1px dotted var(--kante);
align-items:baseline}
.tag li:last-child{border-bottom:none}
.uhr{flex:0 0 3.1rem;color:var(--matt);font-variant-numeric:tabular-nums}
.dep{flex:0 0 11rem;color:var(--akzent);overflow:hidden;text-overflow:ellipsis;
white-space:nowrap}
.was{flex:1 1 auto}
.q{color:var(--matt);font-size:.8rem;font-family:system-ui,sans-serif;
margin:2rem 0 0}
@media (max-width:40rem){
  .tag li{flex-wrap:wrap}
  .dep{flex:0 0 auto}
}
@media print{
  body{background:#fff;color:#000;font-size:10pt}
  .wrap{max-width:none;padding:0}
  thead{display:table-header-group}
  tr,.tag{break-inside:avoid}
  h2{break-after:avoid;break-before:page}
  .kopf div{border:1px solid #999}
  a{color:#000;text-decoration:none}
}
`;

let h = '﻿';   /* BOM: überstimmt jedes Raten der Zeichenkodierung */
h += '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n';
h += '<meta name="viewport" content="width=device-width,initial-scale=1">\n';
h += '<title>Tägliche Dokumentation, ' + esc(deutsch(d.summe.erster)) + ' bis '
  + esc(deutsch(d.summe.letzter)) + '</title>\n';
h += '<meta name="robots" content="noindex">\n';
h += '<!-- ERZEUGT von tools/arbeitstage-bauen.mjs aus docs/historie/historie.json.'
  + ' Nicht von Hand bearbeiten. -->\n';
h += '<style>' + stil + '</style>\n</head>\n<body>\n<div class="wrap">\n';

h += '<h1>Tägliche Dokumentation der Arbeitstage</h1>\n';
h += '<p class="unter">' + zahl(arbeitstage) + ' Tage, '
  + esc(deutsch(d.summe.erster)) + ' bis ' + esc(deutsch(d.summe.letzter)) + '. '
  + 'Erzeugt aus den Zeitstempeln von ' + zahl(gesEintraege)
  + ' gespeicherten Arbeitsständen in ' + zahl(d.summe.depots)
  + ' Quelltext-Depots.</p>\n';

h += '<div class="kopf">'
  + '<div><b>' + zahl(arbeitstage) + '</b><span>Tage mit Arbeit</span></div>'
  + '<div><b>' + std(gesSpanne) + ' h</b><span>Spanne, aufsummiert</span></div>'
  + '<div><b>' + std(gesAktiv) + ' h</b><span>aktive Zeit, aufsummiert</span></div>'
  + '<div><b>' + zahl(gesEintraege) + '</b><span>Einträge insgesamt</span></div>'
  + '</div>\n';

h += '<h2>Was in den Spalten steht</h2>\n';
h += '<div class="kasten" data-erklaerung>\n';
h += '<p><strong>Ein Eintrag</strong> ist ein gespeicherter Arbeitsstand im '
  + 'Versionsverwaltungssystem Git. Seine <strong>Uhrzeit vergibt das System '
  + 'beim Speichern selbst</strong>; sie ist nicht von Hand eingetragen und '
  + 'nicht nachträglich gesetzt worden. Alle Einträge stehen unten einzeln, '
  + 'mit Uhrzeit und Bezeichnung.</p>\n';
h += '<p><strong>Spanne</strong> ist der Abstand vom ersten bis zum letzten '
  + 'Eintrag desselben Tages. Pausen dazwischen sind darin enthalten.</p>\n';
h += '<p><strong>Aktive Zeit</strong> rechnet die Pausen heraus: Abstände bis '
  + LUECKE_MIN + ' Minuten zählen mit, längere gelten als Unterbrechung und '
  + 'beginnen einen neuen Abschnitt. Für jeden Abschnitt kommen '
  + VORLAUF_MIN + ' Minuten Vorlauf dazu, weil vor dem ersten gespeicherten '
  + 'Stand bereits gearbeitet wurde.</p>\n';
h += '<p data-automatik><strong>Zeitgesteuerte Läufe sind herausgerechnet.</strong> '
  + zahl(gesAutomatik) + ' der Einträge stammen von einem automatischen Dienst '
  + '(<code>github-actions[bot]</code>), die meisten davon nachts. Sie sind '
  + 'keine Arbeitszeit und zählen weder in der Spanne noch in der aktiven Zeit '
  + 'mit. Ohne diese Bereinigung wiese das Blatt '
  + std(mitAutomatik.spanne - gesSpanne) + ' Stunden zu viel aus.</p>\n';
h += '<p data-untergrenze><strong>Beide Werte sind eher zu niedrig als zu '
  + 'hoch.</strong> Lesen, Prüfen, Besprechen und jeder verworfene Versuch '
  + 'hinterlassen keinen Eintrag. Auch vor dem ersten und nach dem letzten '
  + 'Eintrag eines Tages ist gearbeitet worden. Gemessen wird nur, was '
  + 'gespeichert wurde.</p>\n';
h += '</div>\n';

/* ── Übersicht ────────────────────────────────────────────────────────────── */

h += '<h2>Übersicht: alle Tage</h2>\n<div class="rahmen">\n<table>\n<thead><tr>'
  + '<th class="l">Datum</th>'
  + '<th class="l">Wochentag</th>'
  + '<th data-spalte="erster">erster<small>Eintrag</small></th>'
  + '<th data-spalte="letzter">letzter<small>Eintrag</small></th>'
  + '<th data-spalte="spanne">Spanne<small>erster bis letzter</small></th>'
  + '<th data-spalte="aktiv">aktive Zeit<small>ohne Pausen</small></th>'
  + '<th data-spalte="abschnitte">Abschnitte<small>je Tag</small></th>'
  + '<th data-spalte="eintraege">Einträge<small>gespeichert</small></th>'
  + '<th data-spalte="depots">Depots<small>berührt</small></th>'
  + '</tr></thead>\n<tbody>\n';

for (const [m, liste] of monate) {
  const mS = liste.reduce((n, t) => n + t.spanne, 0);
  const mA = liste.reduce((n, t) => n + t.aktiv, 0);
  const mE = liste.reduce((n, t) => n + t.eintraege, 0);
  h += '<tr class="mon"><td class="l" colspan="4">' + esc(monatName(m))
    + '</td><td>' + std(mS) + ' h</td><td>' + std(mA) + ' h</td><td></td><td>'
    + zahl(mE) + '</td><td></td></tr>\n';
  for (const t of liste) {
    h += '<tr data-tag="' + esc(t.datum) + '">'
      + '<td class="l"><a href="#t' + esc(t.datum) + '">' + esc(deutsch(t.datum)) + '</a></td>'
      + '<td class="l">' + esc(t.wochentag) + '</td>'
      + '<td>' + esc(t.erster) + '</td>'
      + '<td>' + esc(t.letzter) + '</td>'
      + '<td>' + std(t.spanne) + '</td>'
      + '<td>' + std(t.aktiv) + '</td>'
      + '<td>' + t.abschnitte + '</td>'
      + '<td>' + zahl(t.eintraege) + '</td>'
      + '<td>' + t.depots + '</td></tr>\n';
  }
}

h += '</tbody>\n<tfoot><tr>'
  + '<td class="l" colspan="4">Summe über ' + zahl(arbeitstage) + ' Tage</td>'
  + '<td data-summe="spanne">' + std(gesSpanne) + '</td>'
  + '<td data-summe="aktiv">' + std(gesAktiv) + '</td>'
  + '<td></td>'
  + '<td data-summe="eintraege">' + zahl(gesEintraege) + '</td>'
  + '<td></td></tr></tfoot>\n</table>\n</div>\n';

/* ── Die tägliche Dokumentation ───────────────────────────────────────────── */

h += '<h2>Tag für Tag</h2>\n';
h += '<p>Jeder Eintrag mit Uhrzeit, Depot und Bezeichnung, in der Reihenfolge '
  + 'des Tages. Nichts ist gekürzt.</p>\n';

for (const t of tage) {
  h += '<div class="tag" id="t' + esc(t.datum) + '" data-block="' + esc(t.datum) + '">\n';
  h += '<h3>' + esc(t.wochentag) + ', ' + esc(deutsch(t.datum)) + '</h3>\n';
  if (t.ohneArbeit) {
    h += '<p class="zeiten">Nur zeitgesteuerte Läufe, keine Arbeitszeit.</p>\n';
  } else {
    h += '<p class="zeiten">' + esc(t.erster) + ' bis ' + esc(t.letzter)
      + ' &middot; Spanne ' + std(t.spanne) + ' h'
      + ' &middot; aktive Zeit ' + std(t.aktiv) + ' h'
      + ' &middot; ' + t.abschnitte + (t.abschnitte === 1 ? ' Abschnitt' : ' Abschnitte')
      + ' &middot; ' + zahl(t.eintraege) + (t.eintraege === 1 ? ' Eintrag' : ' Einträge')
      + ' &middot; ' + t.depots + (t.depots === 1 ? ' Depot' : ' Depots')
      + (t.automatik ? ' &middot; dazu ' + t.automatik
        + ' zeitgesteuerte, nicht gezählt' : '')
      + '</p>\n';
  }
  h += '<ol>\n';
  for (const c of t.liste) {
    h += '<li><span class="uhr">' + esc(c.zeit) + '</span>'
      + '<span class="dep">' + esc(c.repo) + '</span>'
      + '<span class="was">' + esc(c.betreff) + '</span></li>\n';
  }
  h += '</ol>\n</div>\n';
}

h += '<p class="q">Erzeugt von <code>tools/arbeitstage-bauen.mjs</code> aus '
  + '<code>docs/historie/historie.json</code>. Die Zeiten stammen aus den '
  + 'Zeitstempeln der Quelltext-Verwaltung und lassen sich dort nachprüfen. '
  + 'Als Tabellenblatt liegen <code>arbeitstage-tage.csv</code> und '
  + '<code>arbeitstage-taetigkeiten.csv</code> daneben.</p>\n';

h += '</div>\n</body>\n</html>\n';

writeFileSync(ZIEL_HTML, h, 'utf-8');

console.log('geschrieben:');
console.log('  docs/historie/arbeitstage.html               '
  + Math.round(h.length / 1024) + ' KB');
console.log('  docs/historie/arbeitstage-tage.csv           '
  + Math.round(csvTage.length / 1024) + ' KB');
console.log('  docs/historie/arbeitstage-taetigkeiten.csv   '
  + Math.round(csvTaet.length / 1024) + ' KB');
console.log('');
console.log('  ' + zahl(arbeitstage) + ' Tage mit Arbeit · Spanne ' + std(gesSpanne)
  + ' h · aktiv ' + std(gesAktiv) + ' h');
console.log('  ' + zahl(gesEintraege) + ' Einträge gezählt, '
  + zahl(gesAutomatik) + ' zeitgesteuerte herausgerechnet');
