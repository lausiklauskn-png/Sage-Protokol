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

/* ── Klartext der Ansicht ──────────────────────────────────────────────────
   Skript und Stil fliegen raus — sie sind kein Text, den jemand liest, und
   ihre Zeichen würden die Nachzählung verwässern. */
const ENTITAET = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  middot: '·', mdash: '—', ndash: '–', auml: 'ä',
  ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö',
  Uuml: 'Ü', szlig: 'ß',
};
const entziffern = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&([a-zA-Z]+);/g, (_, n) => (n in ENTITAET ? ENTITAET[n] : '&' + n + ';'));

/* EIN UNTERSCHIED, DER HIER ENTSCHEIDET: Auszeichnungs-Tags mitten im Wort
   (fett, kursiv, Verweis, Code) werden ERSATZLOS entfernt, alles andere durch
   ein Leerzeichen. Die erste Fassung machte aus jedem Tag ein Leerzeichen —
   aus "keine KIs<\/strong>." wurde "keine KIs ." mit Lücke, und die
   Nachzählung meldete 320 Zeilen als fehlend, die alle dastanden. Ein
   Wächter, der aus dem eigenen Messfehler heraus rot wird, ist genauso
   wertlos wie einer, der blind grün ist. */
const INLINE = /<\/?(a|strong|em|code|span|sup|sub)\b[^>]*>/gi;

const ohneTags = (s, mitCode = true) => {
  let t = s
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  if (!mitCode) t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ' ');
  return t
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(INLINE, '')
    .replace(/<[^>]+>/g, ' ');
};

const norm = (s) => s.replace(/\s+/g, ' ').trim();

const SICHT = norm(entziffern(ohneTags(html)));
/* Für die Frage „steht rohes Markdown auf dem Schirm?" müssen die
   Code-Blöcke draußen bleiben. In ihnen sind Sternchen und Rauten INHALT —
   ein Wächter, der sie anklagt, verbietet das Zitieren von Shell-Befehlen. */
const FLIESS = norm(entziffern(ohneTags(html, false)));

/* ── 1 · Nichts verschluckt ───────────────────────────────────────────── */

/* Eine Quellzeile auf das reduzieren, was ein Leser davon sieht. Alles,
   was hier abgeschnitten wird, ist Auszeichnung — nie Inhalt. */
function klartext(zeile) {
  let s = zeile;
  s = s.replace(/^\s{0,8}>\s?/, '');                     // Zitatzeichen
  s = s.replace(/^\s*(#{1,6})\s+/, '');                  // Überschrift
  s = s.replace(/^(\s*)([-*+]|\d+\.)\s+/, '');           // Listenpunkt
  s = s.replace(/^\[( |x|X)\]\s+/, '');                  // Häkchen
  s = s.replace(/\[([^\]]*)\]\([^)\s]+(?:\s+"[^)]*")?\)/g, '$1');  // Verweis
  s = s.replace(/<(https?:\/\/[^>\s]+)>/g, '$1');        // nackte Adresse
  s = s.replace(/\|/g, ' ');                             // Tabellen-Striche
  // NUR Sternchen und Backtick. Der Unterstrich sieht wie eine Auszeichnung
  // aus, ist in diesen Quellen aber Teil von Dateinamen
  // (MEILENSTEIN_SEMANTISCHE_SUCHE.md, __20k.html). Ihn mitzuentfernen
  // liess 70 Zeilen als fehlend erscheinen, die alle dastanden.
  s = s.replace(/[*`]/g, '');                            // fett/kursiv/Code
  return norm(s);
}

/* NUR echte Artikel zaehlen. Ein blosses Muster auf data-quelle fing auch
   die Waehler-Zeichenketten im Markier-Skript mit — die Probe suchte
   danach eine Datei, deren Name aus einem Stueck JavaScript bestand. Ein
   Waechter, der den Quelltext seines eigenen Werkzeugs fuer Daten haelt,
   misst irgendwann etwas anderes als das, was er zu messen glaubt. */
const QUELLEN = [...html.matchAll(/<article[^>]*\sdata-quelle="([^"]+)"/g)]
  .map((m) => m[1]);
gut(QUELLEN.length === 9, 'neun Quelldateien in der Mappe',
  'gefunden: ' + QUELLEN.length);

let geprueft = 0;
const fehlend = [];
for (const pfad of QUELLEN) {
  const zeilen = readFileSync(resolve(WURZEL, pfad), 'utf-8').split('\n');
  let imCode = false;
  for (let n = 0; n < zeilen.length; n++) {
    const roh = zeilen[n];
    if (/^\s*```/.test(roh)) { imCode = !imCode; continue; }
    if (imCode) continue;                                  // Codeblöcke: 1:1 übernommen
    if (!roh.trim()) continue;
    if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(roh)) continue;  // Trennlinie
    if (/^\s*\|[\s:|-]+\|?\s*$/.test(roh)) continue;        // Tabellen-Trennzeile
    const soll = entziffern(klartext(roh));
    if (!soll) continue;
    geprueft++;
    if (!SICHT.includes(soll)) fehlend.push(pfad + ':' + (n + 1) + '  ' + soll.slice(0, 90));
  }
}
gut(fehlend.length === 0,
  'jede der ' + geprueft + ' Quellzeilen steht in der Ansicht',
  fehlend.slice(0, 6).join('\n       ')
  + (fehlend.length > 6 ? '\n       … und ' + (fehlend.length - 6) + ' weitere' : ''));

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
