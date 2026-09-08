/* smoke_werkzeuge_lauffaehig.mjs, jedes Bau-Werkzeug lässt sich LADEN.
 *
 * Lauf:  node tests/smoke_werkzeuge_lauffaehig.mjs
 *
 * ── DER ANLASS, VIERMAL AN EINEM TAG ──────────────────────────────────────
 *
 * Am 2026-08-26 haben viermal Backticks in einem Kommentar ein
 * Template-Literal geschlossen. Der Bau brach mit einem Syntaxfehler ab. Und
 * beim ersten Mal blieb dabei alles grün:
 *
 *     SyntaxError: Unexpected identifier 'smoke_unterlagen'
 *     ...
 *     93 Proben, 93 grün, 0 rot
 *
 * **Ein Werkzeug, das gar nicht läuft, hinterlässt keine Spur in einer Probe,
 * die nur sein Erzeugnis ansieht.** Das Erzeugnis war noch das alte, in sich
 * stimmige, und jede Prüfung darauf war zufrieden.
 *
 * Diese Probe fragt deshalb nichts über den Inhalt. Sie LÄDT jedes Werkzeug
 * und stellt fest, ob es das überhaupt kann.
 *
 * ── WARUM LADEN UND NICHT AUSFÜHREN ───────────────────────────────────────
 *
 * Ausführen schriebe Dateien und kostete Minuten. Ein Import führt den
 * Modulkopf aus und fällt bei einem Syntaxfehler um, und genau das ist der
 * Fehler, um den es geht. Werkzeuge mit einem Rumpf hinter einem
 * Direkt-Riegel laufen dabei nicht los.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let rot = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

/* Werkzeuge, die beim blossen Laden etwas TUN (schreiben, drucken, Browser
   starten), stehen hier. Sie werden nur auf Syntax geprüft, nicht geladen.
   Wer eines ergänzt, schreibt dazu, WARUM es nicht geladen werden darf. */
const NUR_SYNTAX = {
  'antragsmappe-bauen.mjs': 'schreibt beim Laden beide Mappen',
  'bestand-bauen.mjs': 'schreibt beim Laden zwei Blätter',
  'forschungsaufgaben-bauen.mjs': 'schreibt beim Laden das Aufgaben-Blatt',
  'arbeitstage-bauen.mjs': 'schreibt Blatt und Tabellen',
  'frageblatt-bauen.mjs': 'schreibt das Frageblatt',
  'historie-bericht-bauen.mjs': 'schreibt die Historie',
  'historie-auslesen.mjs': 'liest alle Depots aus, dauert Minuten',
  'ausgabe-bauen.mjs': 'legt den Ausgabe-Ordner neu an',
  'abteilung-html.mjs': 'startet einen Browser',
  'html-zu-pdf.mjs': 'startet einen Browser',
  'paper-md-zu-html.mjs': 'schreibt beim Laden die HTML und steigt ohne Argument mit exit(2) aus',
  'paper-zu-pdf.mjs': 'startet einen Browser, holt Schriften und steigt ohne Argument mit exit(2) aus',
  'paper-umbruch-pruefen.mjs': 'startet einen Browser und steigt ohne Argument mit exit(2) aus',
  'paper-pdf-pruefen.mjs': 'ruft pdftotext auf und steigt ohne Argument mit exit(2) aus',
  'paper-seiten-messen.mjs': 'ruft pdftotext auf und steigt ohne Argument mit exit(2) aus',
  'arbeitstage-pdf.mjs': 'startet einen Browser',
  'antragsmappe-markieren.mjs': 'schreibt in die Mappe',
  'gedankenstriche-aufloesen.mjs': 'schreibt in die Quellen',
  'zweig-pruefen.mjs': 'ruft git auf',
  'make_example_spore.mjs': 'schreibt eine Spore',
  'resign_spore_v02.mjs': 'schreibt eine Spore',
  'verify_remote_spore.mjs': 'geht ins Netz',
  'match_baseline.mjs': 'rechnet lange',
  'breite-messen.mjs': 'startet einen Browser',
  'widget-breite-messen.mjs': 'startet einen Browser',
};

/* ── Der Arbeitsbaum vor dem Laden ─────────────────────────────────────────
 *
 * ⚠ DIE POSITIVLISTE OBEN IST DIE SCHWACHSTELLE. Wer ein Werkzeug ergaenzt, das
 * beim Laden schreibt, und es nicht eintraegt, bekommt keinen Fehler — er
 * bekommt eine Probe, die still Dateien aendert. Genau das war am 2026-09-04 der
 * Fall: `lesefassung-bauen.mjs` stand nicht in NUR_SYNTAX, sein Rumpf lag auf
 * oberster Ebene, und nach jedem `npm test` standen vier geaenderte Dateien in
 * `docs/lesen/` im Arbeitsbaum. Wer danach `git add -A` sagte, nahm sie in einen
 * fremden Commit auf.
 *
 * Die Liste zu ergaenzen haette DIESEN Fall geschlossen und den naechsten nicht.
 * Deshalb wird gemessen statt aufgezaehlt: `docs/` wird vor und nach dem Laden
 * abgetastet. Aendert sich etwas, hat ein Werkzeug beim blossen Import
 * geschrieben — welches, sagt die Meldung nicht, aber DASS es geschah, genuegt
 * zum Nachsehen.
 *
 * Gemessen wird Groesse UND Aenderungszeit: ein Erzeuger, der dieselbe Datei mit
 * demselben Datum neu schreibt, aendert die Groesse nicht. */
function abtasten(ordner) {
  const stand = new Map();
  const gehe = (d) => {
    let eintraege = [];
    try { eintraege = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of eintraege) {
      const voll = join(d, e.name);
      if (e.isDirectory()) { gehe(voll); continue; }
      try { const st = statSync(voll); stand.set(voll, st.size + ':' + st.mtimeMs); } catch { /* weg */ }
    }
  };
  gehe(ordner);
  return stand;
}

const DOCS = join(WURZEL, 'docs');
const vorher = abtasten(DOCS);

const werkzeuge = readdirSync(join(WURZEL, 'tools'))
  .filter((n) => n.endsWith('.mjs')).sort();

gut(werkzeuge.length > 5, werkzeuge.length + ' Werkzeuge gefunden');

for (const n of werkzeuge) {
  const pfad = join(WURZEL, 'tools', n);
  const grund = NUR_SYNTAX[n];

  if (grund) {
    /* SYNTAX OHNE AUSFÜHREN. `new Function` würde den Modul-Kopf ablehnen,
       deshalb der Umweg über den Parser von Node: ein Import mit einem
       Zusatz, der nie auflöst, prüft nur das Übersetzen. Einfacher und
       zuverlässig: den Quelltext gegen die eine Sorte Fehler prüfen, die
       hier viermal aufgetreten ist. */
    const t = readFileSync(pfad, 'utf-8');
    /* Ein Template-Literal mit ungerader Zahl von Backticks kann nicht
       aufgehen. Das ist grob, es fängt aber genau diesen Fehler. */
    const backticks = (t.match(/(?<!\\)`/g) || []).length;
    gut(backticks % 2 === 0,
      n + ': die Backticks gehen paarweise auf (' + backticks + ')',
      'ungerade Zahl: irgendwo schliesst ein Kommentar ein Template-Literal');
    continue;
  }

  let fehler = null;
  try { await import(pathToFileURL(pfad).href); }
  catch (e) { fehler = String(e.message).split('\n')[0]; }
  gut(fehler === null, n + ': lädt sich', fehler || '');
}

/* ── Und hat das Laden etwas geschrieben? ─────────────────────────────────── */

const nachher = abtasten(DOCS);
const veraendert = [];
for (const [pfad, marke] of nachher) if (vorher.get(pfad) !== marke) veraendert.push(pfad);
for (const pfad of vorher.keys()) if (!nachher.has(pfad)) veraendert.push(pfad + ' (weg)');

gut(veraendert.length === 0,
  'das blosse Laden der Werkzeuge hat nichts unter docs/ geschrieben',
  veraendert.length
    ? veraendert.length + ' Datei(en), u. a. ' + veraendert.slice(0, 4).map((p) => p.replace(WURZEL + '/', '')).join(' · ')
      + '\n       Ein Werkzeug schreibt beim Import. Entweder gehoert sein Rumpf hinter'
      + '\n       einen Direkt-Riegel (so wie tools/lesefassung-bauen.mjs) oder sein Name'
      + '\n       in die Liste NUR_SYNTAX oben — der Riegel ist der bessere Weg, weil das'
      + '\n       Werkzeug dann wirklich geladen und nicht nur ueberflogen wird.'
    : '');

console.log('\nsmoke_werkzeuge_lauffaehig: ' + (rot === 0 ? 'alles grün' : rot + ' ROT'));
process.exit(rot === 0 ? 0 : 1);
