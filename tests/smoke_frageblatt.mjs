/* smoke_frageblatt.mjs — bewacht das Frageblatt für den Steuerberater.
 *
 * Lauf:  node tests/smoke_frageblatt.mjs
 *
 * ── WAS HIER SCHIEFGING, UND WARUM ES DIESE PROBE GIBT (2026-08-25) ───────
 *
 * Es gab eine von Hand geschriebene HTML-Fassung neben der Markdown-Datei.
 * Auf Klaus' Tablet hat sie sich **zerlegt**: aus einem Satz wurden einzelne
 * Wörter, eines je Zeile. Ursache war `display:grid` auf dem Listenpunkt.
 * **Jedes Kind eines Grid-Containers wird zu einem Grid-Element**, auch ein
 * `<strong>` mitten im Satz. Aus einem Satz mit drei fetten Stellen wurden
 * sechs Kästen, umgebrochen auf zwei Spalten.
 *
 * Zwei Lehren, und die Probe bewacht beide:
 *
 * 1. **Ein Layout, das den Inhalt eines Absatzes zerlegen KANN, ist falsch.**
 *    Deshalb: kein `display:grid` und kein `display:flex` auf `li` oder `p`.
 * 2. **Zwei Fassungen desselben Textes laufen auseinander.** Deshalb wird das
 *    Blatt aus der Markdown-Datei erzeugt, und die Probe zählt nach, dass
 *    nichts verschluckt wurde. Nicht „sieht gut aus" — nachgezählt.
 *
 * Die Klartext-Rechnung ist aus `smoke_antragsmappe.mjs` übernommen,
 * einschließlich ihrer beiden teuer bezahlten Feinheiten (Auszeichnungs-Tags
 * ersatzlos statt als Leerzeichen; Unterstriche NICHT entfernen).
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(WURZEL, 'docs/STEUERBERATER_FRAGEN.md');
const BLATT = resolve(WURZEL, 'docs/frageblatt.html');

let rot = 0;
const gut = (b, was, dazu) => {
  console.log((b ? '  ok   ' : '  ROT  ') + was + (b || !dazu ? '' : '\n       ' + dazu));
  if (!b) rot++;
  return b;
};

const html = readFileSync(BLATT, 'utf-8');
const md = readFileSync(QUELLE, 'utf-8');

const ENTITAET = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  middot: '·', mdash: '—', ndash: '–', auml: 'ä', ouml: 'ö', uuml: 'ü',
  Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß', bdquo: '„', ldquo: '“' };
const entziffern = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&([a-zA-Z]+);/g, (_, n) => (n in ENTITAET ? ENTITAET[n] : '&' + n + ';'));

const INLINE = /<\/?(a|strong|em|code|span|sup|sub)\b[^>]*>/gi;
const ohneTags = (s) => s
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(INLINE, '')
  .replace(/<[^>]+>/g, ' ');
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const SICHT = norm(entziffern(ohneTags(html)));

function klartext(zeile) {
  let s = zeile;
  s = s.replace(/^\s{0,8}>\s?/, '');
  s = s.replace(/^\s*(#{1,6})\s+/, '');
  s = s.replace(/^(\s*)([-*+]|\d+\.)\s+/, '');
  s = s.replace(/\[([^\]]*)\]\([^)\s]+(?:\s+"[^)]*")?\)/g, '$1');
  s = s.replace(/<(https?:\/\/[^>\s]+)>/g, '$1');
  s = s.replace(/\|/g, ' ');
  /* CODE ZUERST HERAUSNEHMEN, dieselbe Reihenfolge wie im Markdown-Leser.
     In Backticks ist ein Sternchen INHALT, keine Auszeichnung: `arbeitstage.*`
     meint drei Dateien. Wer es global entfernt, sucht danach nach
     „arbeitstage." und meldet eine Zeile als fehlend, die dasteht. Genau das
     ist beim Bau dieser Probe passiert. */
  const code = [];
  s = s.replace(/`([^`]*)`/g, (_, inhalt) => {
    code.push(inhalt);
    return '\u0000' + (code.length - 1) + '\u0000';
  });
  s = s.replace(/\*/g, '');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => code[+i]);
  s = s.replace(/`/g, '');
  return norm(s);
}

/* ── 1 · Nichts verschluckt ───────────────────────────────────────────── */

let geprueft = 0;
const fehlend = [];
for (const zeile of md.split('\n')) {
  if (!zeile.trim()) continue;
  if (/^\s*\|?[\s|:-]+\|?\s*$/.test(zeile)) continue;   // Tabellen-Trennzeile
  const k = klartext(zeile);
  if (k.length < 4) continue;
  geprueft++;
  if (!SICHT.includes(k)) fehlend.push(k.slice(0, 64));
}
gut(fehlend.length === 0,
  'jede der ' + geprueft + ' Quellzeilen steht im Blatt',
  fehlend.length + ' fehlen, u.a.: ' + fehlend.slice(0, 3).join(' · '));

/* ── 2 · Der Fehler vom 2026-08-25 kann nicht wiederkommen ────────────── */

const stil = (html.match(/<style[\s\S]*?<\/style>/i) || [''])[0];
const regeln = stil.split('}').map((r) => r.trim()).filter(Boolean);
const zerlegend = regeln.filter((r) => {
  const [wahl, rumpf = ''] = r.split('{');
  if (!/display\s*:\s*(grid|flex)/.test(rumpf)) return false;
  /* Ein Wähler, der Satz-Inhalt treffen kann: Listenpunkt oder Absatz. */
  return /(^|[\s,>+~])(li|p|blockquote|td|th)(\s*[,{]|\s*$|:)/.test(wahl);
});
gut(zerlegend.length === 0,
  'kein grid/flex auf einem Element, das Satz-Inhalt trägt',
  'ein <strong> im Satz würde dort zu einem eigenen Kasten: '
  + zerlegend.map((r) => r.split('{')[0].trim()).join(' · '));

/* Gegenrichtung: die Zusicherung ist NICHT „es gibt kein grid", sondern
   „nicht dort". Wäre der Wähler zu grob, verböte er jedes Layout. */
gut(/\bli::marker\b/.test(stil),
  'die Nummerierung hängt am ::marker, nicht an einem eigenen Kasten');

/* ── 3 · Das Blatt ist der aktuelle Bau ───────────────────────────────── */

const stand = (html.match(/data-stand="([^"]+)"/) || [])[1] || '';
gut(/^\d{4}-\d{2}-\d{2}$/.test(stand), 'das Blatt trägt ein Datum', 'gelesen: ' + stand);
execFileSync(process.execPath,
  [resolve(WURZEL, 'tools/frageblatt-bauen.mjs'), '--datum=' + stand],
  { cwd: WURZEL, stdio: 'pipe' });
gut(readFileSync(BLATT, 'utf-8') === html,
  'die abgelegte Fassung entspricht dem aktuellen Bau',
  'Quelle geändert, Blatt nicht neu gebaut → node tools/frageblatt-bauen.mjs');

/* ── 4 · Was ein Blatt für eine Behörde tragen muss ───────────────────── */

gut(/Vorbereitung, keine steuerliche Beratung/.test(SICHT),
  'die Abgrenzung „keine Beratung" steht sichtbar drin');
/* ⚠ DIESER WAECHTER MISST DERZEIT NICHTS, und das steht hier statt es zu
   verschweigen: `STEUERBERATER_FRAGEN.md` enthaelt (Stand 2026-08-25) KEINEN
   einzigen Verweis. Ein Fall, den es in der echten Umgebung nicht gibt,
   bewacht nichts. Er bleibt trotzdem stehen, weil die naechste Fassung der
   Quelle einen Verweis bekommen kann, und die Gegenprobe stellt die Lage
   selbst her (Verweis einfuegen UND den Umschreiber lahmlegen). */
const verweise = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
const relativ = verweise.filter((h) => !/^(https?:|mailto:|#)/.test(h));
gut(relativ.length === 0,
  'kein relativer Verweis (' + verweise.length + ' Adressen geprueft)',
  'auf dem Tablet liegt die Datei unter content://… und hat kein Verzeichnis, '
  + 'gegen das ein relativer Pfad aufloest: ' + relativ.slice(0, 3).join(' · '));
/* NICHT `/@media print/`: das steht auch noch da, wenn jemand eine Bedingung
   anhaengt, unter der der Block nie gilt (`@media print and (min-width:99999px)`).
   Die Gegenprobe hat genau das durchrutschen lassen. Bewacht wird die
   ZUSICHERUNG „es gilt beim Drucken, unbedingt", also ein blanker Block. */
const druckBlock = /@media\s+print\s*\{/.test(stil);
gut(druckBlock, 'ein Druck-Stylesheet gilt unbedingt beim Drucken',
  'gefunden wurde hoechstens ein bedingter @media-print-Block');
gut(/display\s*:\s*table-header-group/.test(stil),
  'Tabellenköpfe wiederholen sich im Druck auf jeder Seite');

/* ── Ergebnis ─────────────────────────────────────────────────────────── */

console.log(rot === 0 ? '\nsmoke_frageblatt: alles grün'
                      : '\nsmoke_frageblatt: ' + rot + ' ROT');
process.exit(rot === 0 ? 0 : 1);
