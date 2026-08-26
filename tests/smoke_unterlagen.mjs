/* smoke_unterlagen.mjs — bewacht die Unterlagen-Mappe (`docs/unterlagen.html`).
 *
 * Lauf:  node tests/smoke_unterlagen.mjs
 * Der Browser-Teil braucht `playwright-core`. Fehlt es, läuft der Rest
 * trotzdem, und was ungeprüft blieb, wird benannt statt übergangen.
 *
 * ── WARUM ES DIESE PROBE ÜBERHAUPT GIBT ───────────────────────────────────
 *
 * Am 2026-08-26 kam eine zweite Mappe dazu, und `smoke_antragsmappe.mjs` war
 * **blind für sie**: es prüft eine feste Datei. Die Gegenprobe meldete
 * trotzdem 32 von 32 gefangen, weil ihre Fälle die alte Mappe sabotierten.
 * **Eine Gegenprobe kann nur so weit sehen wie die Probe, die sie prüft.**
 *
 * ── DIE ZUSICHERUNG, DIE HIER AM MEISTEN WIEGT ────────────────────────────
 *
 * **Jede Abteilung ist allein vollständig und allein zu haben.** Das Blatt für
 * den Steuerberater geht in einen Termin, das für das Finanzamt neben ein
 * Formular. Wenn der Einzel-Download die anderen Abteilungen mitnimmt, wandern
 * private Abwägungen in eine fremde Hand. Wenn der Einzel-Druck sie mitnimmt,
 * dasselbe auf Papier.
 *
 * Deshalb wird nicht geprüft, ob der Knopf da ist, sondern ob die Regel
 * existiert, die beim Drucken wirklich ausblendet, und im Browser, ob der
 * Download wirklich nur eine Abteilung enthält.
 *
 * ── DIE MESSWERKZEUGE SIND GETEILT ────────────────────────────────────────
 *
 * `_mappen-teile.mjs`, dieselben wie in `smoke_antragsmappe.mjs`. Sie tragen
 * drei reparierte Messfehler; eine zweite Fassung hätte sie wieder oder würde
 * etwas anderes messen, und beide Proben wären grün.
 */

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { entziffern, ohneTags, norm, vollstaendigkeit } from './_mappen-teile.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAPPE = resolve(WURZEL, 'docs/unterlagen.html');

let rot = 0, ungeprueft = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

if (!existsSync(MAPPE)) {
  console.log('  ROT  die Unterlagen-Mappe fehlt (node tools/antragsmappe-bauen.mjs)');
  process.exit(1);
}

const html = readFileSync(MAPPE, 'utf-8');
const bytes = readFileSync(MAPPE);
const SICHT = norm(entziffern(ohneTags(html)));
const FLIESS = norm(entziffern(ohneTags(html, false)));

/* Die Abteilungen, und die Reihenfolge ist die Reihenfolge des Vorgehens.
   Wer eine ergänzt, trägt sie hier nach; die Zahl darunter wird DARAUS
   gerechnet. Bis zum 2026-08-26 stand sie zweimal da, einmal als Liste und
   einmal als Zahl `4`, und die Zahl wurde beim Ergänzen der Abteilungen 5
   und 6 zu Recht rot. Zwei Stellen für dieselbe Angabe sind eine zu viel. */
const ABTEILUNGEN = ['uebersicht', 'schritte', 'steuerberater', 'finanzamt',
  'bestand', 'april'];

/* ── 1 · Der BOM ──────────────────────────────────────────────────────── */

gut(bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF,
  'die Mappe beginnt mit einem BOM (sonst rät Android beim Herunterladen Latin-1)');

/* ── 2 · Nichts verschluckt ───────────────────────────────────────────── */

const { quellen, geprueft, fehlend } = vollstaendigkeit(html, WURZEL);
gut(quellen.length === ABTEILUNGEN.length,
  ABTEILUNGEN.length + ' Quelldateien in der Mappe, eine je Abteilung',
  'gefunden: ' + quellen.length);
gut(fehlend.length === 0,
  'jede der ' + geprueft + ' Quellzeilen steht in der Ansicht',
  fehlend.slice(0, 6).join('\n       ')
  + (fehlend.length > 6 ? '\n       … und ' + (fehlend.length - 6) + ' weitere' : ''));

/* ── 3 · Keine Auszeichnung sichtbar ──────────────────────────────────── */

for (const [muster, was] of [
  [/\*\*[^*\n]{2,}\*\*/, 'rohe Sternchen für fett'],
  [/(^|\s)#{1,6}\s+\w/, 'rohe Raute als Überschrift'],
  [/\[[^\]\n]{2,}\]\([^)\s]+\)/, 'roher Markdown-Verweis'],
]) {
  gut(!muster.test(FLIESS), 'kein ' + was + ' auf dem Schirm',
    (FLIESS.match(muster) || [''])[0].slice(0, 70));
}

/* ── 4 · Keine Gedankenstriche in MEINEN Texten ───────────────────────────
   Klaus am 2026-08-24: „Es gibt Sätze." Gemessen am gezeichneten Text, nicht
   an der Quelle: ein Strich, der erst beim Bauen entsteht, stünde genauso da. */

const striche = (SICHT.match(/—/g) || []).length;
gut(striche === 0, 'kein Gedankenstrich in der Ansicht',
  striche + ' gefunden');

/* ── 5 · Vier Abteilungen, jede für sich zu haben ─────────────────────── */

for (const id of ABTEILUNGEN) {
  gut(html.includes('id="' + id + '"'), 'die Abteilung „' + id + '" ist da');
  /* NICHT der Knopf, sondern die Regel, die beim Drucken wirklich ausblendet.
     Ein Knopf ohne Regel arbeitet und zeigt trotzdem alles. */
  gut(new RegExp('html\\.nur-' + id + '\\s+\\.abteilung:not\\(#' + id
    + '\\)\\s*\\{\\s*display:\\s*none').test(html),
    'und hat ihren Druck-Riegel');
  gut(html.includes('data-tun="laden" data-fuer="' + id + '"'),
    'und einen eigenen Herunterladen-Knopf');
  gut(html.includes('data-stempel="' + id + '"'),
    'und einen eigenen Stempel mit Datum und Herkunft');
}

/* ── 6 · Kein relativer Verweis (die Tablet-Falle) ────────────────────────
   Eine heruntergeladene Datei liegt unter `content://`. Ein relativer Verweis
   führt dort ins Nichts (ERR_FILE_NOT_FOUND), und zwar stumm: der Verweis
   sieht aus wie einer. */

const verweise = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
  .filter((z) => !/^(https?:|mailto:|#)/.test(z));
gut(verweise.length === 0, 'kein relativer Verweis in der Mappe',
  verweise.slice(0, 4).join(' · '));

/* Interne Anker müssen auch wirklich ankommen. Ein Sprung ins Leere ist der
   tote Knopf in klein, und genau der ist hier einmal entstanden: die
   Anker-Karte galt über BEIDE Mappen, also zeigte ein Verweis auf eine Datei
   der Antragsmappe von hier aus auf ein Ziel, das in dieser Datei nicht
   existiert. */
const alleHrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
const ziele = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
const tot = alleHrefs.filter((z) => z.startsWith('#') && z.length > 1
  && !ziele.has(z.slice(1)));
gut(tot.length === 0, 'jeder interne Sprung findet sein Ziel',
  tot.slice(0, 4).join(' · '));

/* ── 7 · Was die Blätter über sich selbst sagen müssen ────────────────────
   Diese drei Sätze sind kein Beiwerk. Ohne sie sieht die Mappe genauer aus,
   als sie ist, und genau das wäre gegenüber einer Behörde der teure Fehler.
   Gemessen an der AUSSAGE, nicht am Wortlaut: ein Wächter, der die
   Formulierung festnagelt, verbietet das nächste Richtigstellen. */

/* IM RICHTIGEN ABSCHNITT GEMESSEN, nicht irgendwo auf dem Blatt. Die erste
   Fassung suchte im ganzen Text, und drei Gegenproben-Fälle rutschten deshalb
   durch: „keine Abschrift des Formulars" stand auch im Warnkasten, den der
   Generator selbst setzt, „keine steuerliche Beratung" auch im
   Steuerberater-Blatt, und „Was noch fehlt" auch als Querverweis im
   Schritte-Blatt. Jedes Mal fand der Wächter seinen Satz woanders und war
   zufrieden, während die Stelle, um die es ging, leer war. */
const abschnitt = (id) => {
  const i = html.indexOf('id="' + id + '"');
  const naechste = ABTEILUNGEN.map((x) => html.indexOf('id="' + x + '"'))
    .filter((j) => j > i);
  return norm(entziffern(ohneTags(
    html.slice(i, naechste.length ? Math.min(...naechste) : html.length))));
};

const FINANZAMT = abschnitt('finanzamt');
const UEBERSICHT = abschnitt('uebersicht');
const STEUERBERATER = abschnitt('steuerberater');

gut(/Es ist keine Abschrift des Formulars/i.test(FINANZAMT),
  'das Finanzamt-Blatt selbst sagt, dass es keine Abschrift des Formulars ist');
gut(/keine\s+steuerliche Beratung/i.test(FINANZAMT),
  'und dass es keine steuerliche Beratung ist');
gut(/keine\s+steuerliche\s+Beratung/i.test(STEUERBERATER),
  'das Steuerberater-Blatt sagt dasselbe über sich');
/* Die Abteilung zeigt auf das Blatt der Nachbarsitzung. Ein Wächter darauf,
   dass es WIRKLICH dieses ist und nicht wieder ein zweites daneben entsteht. */
gut(html.includes('data-quelle="docs/STEUERBERATER_FRAGEN.md"'),
  'Abteilung 3 nimmt das Frageblatt der Nachbarsitzung, kein eigenes');
gut(!html.includes('docs/unterlagen/02_STEUERBERATER.md'),
  'und es gibt kein zweites Steuerberater-Blatt mehr');
/* GEMESSEN WIRD DER INHALT, NICHT DIE ÜBERSCHRIFT. Die erste Fassung suchte
   „Was noch fehlt" mit /i und war deshalb auch dann grün, wenn die Überschrift
   weg war: die Einleitung derselben Abteilung sagt „und was noch fehlt" klein
   geschrieben. Ein Wächter, der ein Wort festnagelt, findet es irgendwann an
   der falschen Stelle wieder und verbietet nebenbei jedes Umformulieren. */
gut((UEBERSICHT.match(/existiert nicht/g) || []).length >= 2,
  'die Übersicht benennt mindestens zwei Dinge, die es noch gar nicht gibt',
  'gezählt: ' + (UEBERSICHT.match(/existiert nicht/g) || []).length);
gut(/Werkzeug-Widerspruch/.test(UEBERSICHT),
  'und die eilige offene Entscheidung, die vor die Zenodo-Nummer gehört');
gut(/Zenodo-Fassung bleibt/.test(UEBERSICHT),
  'samt dem Grund, warum sie vorher fällig ist');

/* Der berichtigte Lizenz-Punkt. Er stand bis zum 2026-08-26 in zwei
   Abschnitten derselben Datei verschieden. */
gut(/Sage-Protokol.{0,20}tr[äa]gt MIT/i.test(SICHT),
  'die Übersicht nennt das Depot, das die anerkannte Lizenz trägt');

/* ── 8 · Die abgelegte Datei ist der aktuelle Bau ─────────────────────── */

const stand = (html.match(/data-stand="([^"]+)"/) || [])[1] || '';
gut(/^\d{4}-\d{2}-\d{2}$/.test(stand), 'die Mappe trägt ein Datum', stand);
execFileSync(process.execPath,
  [resolve(WURZEL, 'tools/antragsmappe-bauen.mjs'), '--datum=' + stand],
  { cwd: WURZEL, stdio: 'pipe' });
gut(readFileSync(MAPPE, 'utf-8') === html,
  'die abgelegte Mappe entspricht dem aktuellen Bau',
  'Quelle geändert, Mappe nicht neu gebaut → node tools/antragsmappe-bauen.mjs');

/* ── 9 · Der Einzel-Download nimmt wirklich nur eine Abteilung mit ────── */

let chromium = null;
try { ({ chromium } = await import('playwright-core')); } catch { chromium = null; }

if (!chromium) {
  console.log('  ⊘    der Browser-Teil ist NICHT GEPRÜFT (playwright-core fehlt)');
  ungeprueft++;
} else {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await browser.newPage();
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(String(e)));
  await p.goto(pathToFileURL(MAPPE).href);
  await p.waitForSelector('#steuerberater');
  gut(fehler.length === 0, 'die Mappe lädt ohne Skriptfehler', fehler[0]);

  gut(!/Ã¤|Ã¼|Ã¶|�/.test(await p.evaluate(() => document.body.innerText)),
    'die Umlaute erscheinen richtig, kein Fragezeichen und kein Ã');

  /* DER KNOPF DER SEITE WIRD GEDRÜCKT, nicht nachgebaut. Die erste Fassung
     klonte die Abteilung selbst und prüfte den Klon: damit maß sie ihre EIGENE
     Funktion, und ein Fehler in `alleinBauen` fiel nicht auf. Die Gegenprobe
     hat es entlarvt, indem sie dort `document.body` einsetzte und trotzdem
     grün blieb. */
  for (const ich of ABTEILUNGEN) {
    let datei = null;
    try {
      const [dl] = await Promise.all([
        p.waitForEvent('download', { timeout: 15000 }),
        p.click('[data-tun="laden"][data-fuer="' + ich + '"]'),
      ]);
      datei = readFileSync(await dl.path(), 'utf-8');
    } catch (e) {
      gut(false, 'Download „' + ich + '" kommt an', String(e).split('\n')[0]);
    }
    if (!datei) continue;

    gut(datei.charCodeAt(0) === 0xfeff,
      'Download „' + ich + '" trägt einen BOM');
    /* Nur echte Abschnitte zählen. Ein blosses Muster auf data-abteilung
       fängt auch die CSS-Wähler im Stilblock mit. */
    const drin = [...datei.matchAll(/<section[^>]*\sid="([^"]+)"[^>]*\sdata-abteilung=/g)]
      .map((m) => m[1]);
    gut(drin.length === 1 && drin[0] === ich,
      'Download „' + ich + '" enthält genau diese eine Abteilung',
      'gefunden: ' + (drin.join(' · ') || 'keine'));
    for (const andere of ABTEILUNGEN.filter((x) => x !== ich)) {
      gut(!datei.includes('id="' + andere + '"'),
        'und trägt „' + andere + '" nicht mit');
    }
    gut(!/<button/.test(datei),
      'Download „' + ich + '" trägt keinen toten Knopf');
    gut(datei.includes('Klaus Nitzsche') && /Stand \d{4}-\d{2}-\d{2}/.test(datei),
      'Download „' + ich + '" trägt Verfasser und Datum in sich');
    const relDl = [...datei.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
      .filter((z) => !/^(https?:|mailto:|#)/.test(z));
    gut(relDl.length === 0,
      'Download „' + ich + '" hat keinen relativen Verweis (die Tablet-Falle)',
      relDl.slice(0, 3).join(' · '));
  }

  /* WAS DER EINZEL-DRUCK WIRKLICH TUT. `tools/html-zu-pdf.mjs --nur <id>`
     setzt genau diese Klasse und druckt dann. Gemessen wird die SICHTBARKEIT,
     nicht ob die CSS-Regel im Text steht: eine Regel, die von einer späteren
     überschrieben wird, steht da und wirkt nicht. */
  for (const ich of ABTEILUNGEN) {
    const sicht = await p.evaluate((id) => {
      document.documentElement.className = 'nur-' + id;
      const auf = [...document.querySelectorAll('.abteilung')]
        .filter((n) => n.offsetHeight > 0).map((n) => n.id);
      document.documentElement.className = '';
      return auf;
    }, ich);
    gut(sicht.length === 1 && sicht[0] === ich,
      'im Einzel-Druck von „' + ich + '" ist nur diese Abteilung sichtbar',
      'sichtbar: ' + (sicht.join(' · ') || 'keine'));
  }

  await browser.close();
}

console.log('\nsmoke_unterlagen: ' + (rot === 0 ? 'alles grün' : rot + ' ROT')
  + (ungeprueft ? ' · ' + ungeprueft + ' ungeprüft' : ''));
process.exit(rot === 0 ? 0 : 1);
