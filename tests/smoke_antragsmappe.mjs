/* smoke_antragsmappe.mjs — bewacht `docs/antragsmappe.html`.
 *
 * Lauf:  node tests/smoke_antragsmappe.mjs
 *
 * ── WAS HIER WIRKLICH BEWACHT WIRD ─────────────────────────────────────────
 *
 * Die Mappe ist eine ANSICHT auf neun Markdown-Dateien, keine zweite Fassung.
 * Der Fehler, der genau daraus wird, ist ein Leser, der etwas VERSCHLUCKT —
 * dann steht auf dem Schirm weniger als in der Datei, und niemand merkt es,
 * weil das Fehlende ja nichts anzeigt. Deshalb ist der erste und wichtigste
 * Wächter unten kein Blick auf die Optik, sondern eine Nachzählung:
 *
 *     JEDE nicht-leere Quellzeile muss mit ihrem Klartext in der Ausgabe
 *     wiederauftauchen.
 *
 * Drei getrennte Zusicherungen statt einer, weil sie verschieden brechen
 * (Lehre aus PWA-Toolpoint, 2026-08-23):
 *   1 · nichts verschluckt            — jede Zeile ist da
 *   2 · keine Auszeichnung sichtbar   — kein rohes Markdown auf dem Schirm
 *   3 · die Abteilungen trennen sich  — Druck und Download je einzeln
 *
 * Dazu die Falle, die auf Klaus' Tablet zuschnappt:
 *   4 · KEIN relativer Verweis. Eine heruntergeladene Datei liegt unter
 *       `content://…`; dort gibt es kein Verzeichnis, gegen das sich ein
 *       relativer Pfad auflösen ließe — der Browser meldet
 *       ERR_FILE_NOT_FOUND. Jeder `href` muss `#`, `http(s)://` oder
 *       `mailto:` sein.
 *
 * Und schließlich:
 *   5 · die abgelegte Datei ist der aktuelle Bau. Sonst zeigt die Mappe
 *       einen Stand, den es im Depot nicht mehr gibt — die schlimmste Sorte,
 *       weil sie richtig aussieht.
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAPPE = resolve(WURZEL, 'docs/antragsmappe.html');

let rot = 0;
const gut = (bedingung, was, dazu) => {
  if (bedingung) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

const html = readFileSync(MAPPE, 'utf-8');

import { entziffern, ohneTags, norm, klartext, vollstaendigkeit }
  from './_mappen-teile.mjs';

/* Die Messwerkzeuge stehen in `_mappen-teile.mjs`, weil seit dem
   2026-08-26 ZWEI Mappen geprueft werden. Eine zweite Fassung dieser
   Nachzaehlung wuerde irgendwann etwas anderes messen als die erste,
   und beide Proben waeren gruen. */

const SICHT = norm(entziffern(ohneTags(html)));
/* Für die Frage „steht rohes Markdown auf dem Schirm?" müssen die
   Code-Blöcke draußen bleiben. In ihnen sind Sternchen und Rauten INHALT —
   ein Wächter, der sie anklagt, verbietet das Zitieren von Shell-Befehlen. */
const FLIESS = norm(entziffern(ohneTags(html, false)));

/* ── 1 · Nichts verschluckt ───────────────────────────────────────────── */

/* NUR echte Artikel zaehlen. Ein blosses Muster auf data-quelle fing auch
   die Waehler-Zeichenketten im Markier-Skript mit — die Probe suchte
   danach eine Datei, deren Name aus einem Stueck JavaScript bestand. Ein
   Waechter, der den Quelltext seines eigenen Werkzeugs fuer Daten haelt,
   misst irgendwann etwas anderes als das, was er zu messen glaubt. */
const { quellen: QUELLEN, geprueft, fehlend } = vollstaendigkeit(html, WURZEL);
gut(QUELLEN.length === 9, 'neun Quelldateien in der Mappe',
  'gefunden: ' + QUELLEN.length);
gut(fehlend.length === 0,
  'jede der ' + geprueft + ' Quellzeilen steht in der Ansicht',
  fehlend.slice(0, 6).join('\n       ')
  + (fehlend.length > 6 ? '\n       … und ' + (fehlend.length - 6) + ' weitere' : ''));

/* ── 1b · Keine Gedankenstriche in MEINEN Texten ──────────────────────────
   Klaus am 2026-08-24: „Nimm bitte alle Gedankenstriche von dir heraus. […]
   Es gibt Saetze." Der Skill `menschlich-schreiben` sagt seit laengerem
   dasselbe: die Gedankenstrich-Flut ist einer der typischen Verraeter dafuer,
   dass ein Text von einer Maschine stammt.

   ZWEI AUSNAHMEN, und beide sind keine Nachsicht, sondern eine andere Regel,
   die staerker wiegt:

     · `werkstatt/WERKSTATTREGELN.md` und `werkstatt/grundsaetze.md` sind
       BYTE-KOPIEN aus Kimhub, deren Quell-Pruefsummen in
       `werkstatt/README.md` stehen. Wer sie hier anfasst, laesst die
       Momentaufnahme still vom Original weglaufen und macht die
       Pruefsummen falsch. Geaendert wird dort, dann neu kopiert.
     · Ein WOERTLICHES ZITAT folgt seiner Quelle. Wer die Zeichensetzung
       eines Zitats anpasst, faelscht es.

   Genau daran bin ich beim ersten Durchgang gescheitert: das Werkzeug lief
   ueber die Byte-Kopien mit, ehe mir die Pruefsummen wieder einfielen.
   Zurueckgenommen und hier festgenagelt. */

const NUR_DORT = [
  'docs/werkstatt/WERKSTATTREGELN.md',
  'docs/werkstatt/grundsaetze.md',
];

const striche = [];
for (const pfad of QUELLEN) {
  if (NUR_DORT.includes(pfad)) continue;
  const zeilen = readFileSync(resolve(WURZEL, pfad), 'utf-8').split('\n');
  let imCode2 = false;
  for (let n = 0; n < zeilen.length; n++) {
    if (/^\s*```/.test(zeilen[n])) { imCode2 = !imCode2; continue; }
    if (imCode2 || !zeilen[n].includes('\u2014')) continue;
    /* In einem Zitat darf er stehen. Gepruft wird, ob der Strich zwischen
       einem oeffnenden und einem schliessenden Anfuehrungszeichen liegt. */
    const z = zeilen[n];
    for (let k = 0; k < z.length; k++) {
      if (z[k] !== '\u2014') continue;
      const davor = z.slice(0, k);
      const auf = (davor.match(/\u201E/g) || []).length;
      const zu = (davor.match(/[\u201C"]/g) || []).length;
      if (auf > zu) continue;          // steht im Zitat
      striche.push(pfad + ':' + (n + 1) + '  ' + z.trim().slice(0, 70));
    }
  }
}
gut(striche.length === 0,
  'kein Gedankenstrich in den selbst geschriebenen Quellen',
  striche.slice(0, 5).join('\n       '));

/* ── 2 · Keine Auszeichnung sichtbar ──────────────────────────────────── */

const rohMarken = [
  ['fett-Sternchen', /\*\*/],
  ['Verweis-Klammern', /\]\(/],
  ['Tabellen-Trennzeile', /\|\s*-{3,}\s*\|/],
];
for (const [name, muster] of rohMarken) {
  gut(!muster.test(FLIESS), 'keine rohe Auszeichnung sichtbar: ' + name);
}

/* Die ungelesene Raute wird STRUKTURELL geprüft, nicht am Fließtext. Der
   Fließtext hängt Tabellenzellen aneinander — eine Spalte, die schlicht „#"
   heißt, ergab dort „# Repo" und klagte eine Überschrift an, die es nicht
   gibt. Gefragt ist: fängt ein gerenderter Block mit einer Raute an? */
const bloeckeMitRaute = [...html.matchAll(/<(p|li|td|th|h[1-6])\b[^>]*>\s*(#{1,6})\s/g)]
  .map((m) => m[0]);
gut(bloeckeMitRaute.length === 0,
  'kein Block beginnt mit einer ungelesenen Überschriften-Raute',
  bloeckeMitRaute.slice(0, 4).join(' · '));

/* ── 3 · Zwei Abteilungen, jede für sich zu haben ─────────────────────── */

for (const [id, art] of [['privat', 'privat'], ['einreichbar', 'einreichbar']]) {
  gut(html.includes('id="' + id + '" data-abteilung="' + art + '"'),
    'Abteilung „' + id + '" ist als solche ausgezeichnet');
  gut(html.includes('data-tun="laden" data-fuer="' + id + '"'),
    'Abteilung „' + id + '" hat einen eigenen Download-Knopf');
  gut(html.includes('data-tun="drucken" data-fuer="' + id + '"'),
    'Abteilung „' + id + '" hat einen eigenen Druck-Knopf');
  gut(html.includes('data-stempel="' + id + '"'),
    'Abteilung „' + id + '" trägt einen eigenen Kopf mit Datum und Herkunft');
}

/* Der Druck-Riegel. Bewacht wird die ZUSICHERUNG „nur diese Abteilung",
   nicht der Wortlaut der Regel: beide Richtungen müssen dastehen, sonst
   druckt ein Knopf das Private mit. */
gut(/html\.nur-privat\s+\.abteilung:not\(#privat\)\s*\{\s*display:\s*none/.test(html),
  'Druck-Klasse blendet beim Fahrplan alles andere aus');
gut(/html\.nur-einreichbar\s+\.abteilung:not\(#einreichbar\)\s*\{\s*display:\s*none/.test(html),
  'Druck-Klasse blendet bei den Unterlagen alles andere aus');

/* Die Einreich-Abteilung muss ALLEIN vollständig sein. Prüfbar ist das an
   ihrem eigenen Kopf: Datum, Verfasser, Herkunft — innerhalb der Sektion. */
const einreich = html.slice(html.indexOf('id="einreichbar"'),
  html.indexOf('<p class="fuss">'));
for (const stueck of ['Klaus Nitzsche', 'Hamburg', 'Stand 2026-',
  'github.com/lausiklauskn-png/Sage-Protokol', 'CC BY 4.0']) {
  gut(einreich.includes(stueck),
    'Einreich-Abteilung trägt „' + stueck + '" in sich selbst');
}

/* Und das Gegenstück: der Fahrplan sagt von sich, dass er nicht eingereicht
   wird. Ein Arbeitspapier ohne diesen Satz landet irgendwann in einer Mappe. */
const privat = html.slice(html.indexOf('id="privat"'), html.indexOf('id="einreichbar"'));
gut(/nicht zum Einreichen/i.test(privat),
  'Fahrplan sagt selbst, dass er nicht eingereicht wird');

/* ── 4 · Kein relativer Verweis (die Tablet-Falle) ────────────────────── */

const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
const relativ = hrefs.filter((h) => !/^(#|https?:\/\/|mailto:)/.test(h));
gut(relativ.length === 0,
  'kein relativer Verweis — ' + hrefs.length + ' Adressen geprüft',
  'relativ: ' + relativ.slice(0, 5).join(' · '));

/* Interne Anker müssen auch wirklich ankommen. Ein Sprung ins Leere ist der
   tote Knopf in klein. */
const anker = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
const tot = hrefs.filter((h) => h.startsWith('#') && h.length > 1 && !anker.has(h.slice(1)));
gut(tot.length === 0, 'jeder interne Sprung findet sein Ziel',
  'ins Leere: ' + tot.join(' · '));

/* ── 5 · Die abgelegte Datei ist der aktuelle Bau ─────────────────────── */

const stand = (html.match(/data-stand="([^"]+)"/) || [])[1] || '';
const neu = execFileSync(process.execPath,
  [resolve(WURZEL, 'tools/antragsmappe-bauen.mjs'), '--datum=' + stand],
  { cwd: WURZEL, stdio: 'pipe' });
const jetzt = readFileSync(MAPPE, 'utf-8');
if (!gut(jetzt === html,
  'die abgelegte Mappe entspricht dem aktuellen Bau',
  'Quelle geändert, Mappe nicht neu gebaut → node tools/antragsmappe-bauen.mjs')) {
  // Der Neubau hat die Datei überschrieben. Nicht zurückschreiben — der
  // richtige Stand ist der neue; der Befund oben sagt, dass er fehlte.
  void neu;
}

/* ── Ergebnis ─────────────────────────────────────────────────────────── */

console.log(rot === 0
  ? '\nsmoke_antragsmappe: alles grün'
  : '\nsmoke_antragsmappe: ' + rot + ' ROT');
process.exit(rot === 0 ? 0 : 1);
