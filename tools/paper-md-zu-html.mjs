/* paper-md-zu-html.mjs — baut aus einem Paper-Markdown die HTML-Fassung.
 *
 * Aufruf:  node tools/paper-md-zu-html.mjs docs/papers/PAPER_A_regeln-und-grundsaetze.md
 *          … --ziel docs/papers/paper-a-regeln-und-grundsaetze.html
 *          … --doi 10.5281/zenodo.NNNNNN
 *
 * ── WARUM ERZEUGT UND NICHT VON HAND GESCHRIEBEN ──────────────────────────
 *
 * `docs/papers/README.md` traegt den teuersten Befund dieses Ordners: bis zum
 * 2026-09-02 gab es jedes SBKIM-Paper ZWEIMAL, und die beiden Fassungen waren
 * nicht gleich — sie trugen sogar verschiedene Titel. „Zwei Texte mit derselben
 * Ueberschrift und verschiedenem Inhalt lassen sich nicht mehr reparieren,
 * sobald jemand einen davon zitiert hat."
 *
 * Paper A liegt als Markdown vor. Haette diese Sitzung daneben eine HTML von
 * Hand gesetzt, waere genau diese Lage wiederhergestellt — nur diesmal mit
 * Ansage. Deshalb: das Markdown ist die Quelle, die HTML ist ein Erzeugnis,
 * und `tests/smoke_paper_a.mjs` faellt um, sobald sie auseinanderlaufen.
 *
 * ── DER DOI IST PFLICHT, UND ZWAR SICHTBAR ────────────────────────────────
 *
 * Zenodo vergibt den DOI VOR dem Hochladen (reservieren), damit er in der
 * Datei stehen kann. Wer ohne ihn baut, bekommt hier eine Warnung und im
 * Dokument einen Platzhalter, der als solcher zu lesen ist. Ein leeres Feld
 * saehe aus wie ein Dokument ohne DOI; ein stiller Platzhalter saehe aus wie
 * einer mit. Beides waere schlechter als die Warnung.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const roh = process.argv.slice(2);
const wert = (n, v) => { const i = roh.indexOf(n); return i > -1 ? roh[i + 1] : v; };
const frei = roh.filter((a, i) => !a.startsWith('--') && !(i > 0 && roh[i - 1].startsWith('--')));

if (frei.length !== 1) {
  console.error('Aufruf: node tools/paper-md-zu-html.mjs <paper.md> [--ziel <datei.html>] [--doi <doi>]');
  process.exit(2);
}
const QUELLE = resolve(WURZEL, frei[0]);
if (!existsSync(QUELLE)) { console.error('FEHLT: ' + frei[0]); process.exit(2); }
const ZIEL = resolve(wert('--ziel', QUELLE.replace(/\.md$/, '.html')));
const DOI = wert('--doi', '');
const SPRACHE = wert('--sprache', 'de');

/* ---- Welche Abschnitte eine eigene Seite beginnen ------------------------ */

/* ⚠ DIESE ENTSCHEIDUNG STEHT HIER UND NICHT IM MARKDOWN.
 *
 * Der erste Anlauf am 2026-09-03 setzte eine Marke `<!-- eigene-seite -->` in
 * das Markdown. Das war falsch, und der Beleg kam sofort: dasselbe Markdown
 * wird auch von `tools/antragsmappe-bauen.mjs` gelesen, und dort erschien die
 * Marke als SICHTBARER TEXT mitten im Dokument — zweimal.
 *
 * Ein Seitenumbruch ist keine Aussage des Textes, sondern eine des Drucks.
 * Wer ihn in die Quelle schreibt, zwingt ihn jedem Leser dieser Quelle auf.
 * Dieselbe Bauart wie ERWARTUNG in `paper-zu-pdf.mjs`: je Papier eine Angabe,
 * an einer Stelle.
 */
const EIGENE_SEITE = {
  'PAPER_A_regeln-und-grundsaetze.md': ['8 · Einordnung', '9 · Verfügbarkeit'],
};

const EIGENE_SEITE_HIER = EIGENE_SEITE[QUELLE.split('/').pop()] || [];

/* ---- Inline-Auszeichnung ------------------------------------------------- */

/* Die Reihenfolge ist hier nicht Geschmack:
   1. maskieren, damit kein `<` aus dem Text zu einem Tag wird;
   2. Code-Spannen HERAUSNEHMEN und durch eine Marke ersetzen — sonst frisst
      die Fett-Regel Sternchen INNERHALB von Code;
   3. Verweise, dann fett VOR kursiv, denn `**` faengt mit `*` an.
   Die Marke traegt Zeichen, die in einem Papier nicht vorkommen (U+E000 ff.
   aus dem privaten Bereich). Ein `%s` oder `@@0@@` waere im Text moeglich
   gewesen und haette dort eine Code-Spanne erfunden. */
const MARKE_AUF = '\uE000';
const MARKE_ZU  = '\uE001';

function inline(s) {
  const code = [];
  let t = String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* Die drei Backticks stehen als \u0060: `smoke_werkzeuge_lauffaehig.mjs`
     zaehlt sie ueber die ganze Datei und verlangt eine gerade Zahl — ein
     Waechter gegen den Fehler, dass ein Backtick in einem Kommentar ein
     Template-Literal schliesst (2026-08-26, viermal an einem Tag). Ein
     Code-Spannen-Muster hat drei davon und macht die Zahl ungerade. Der
     Waechter hat recht; die Schreibweise weicht aus, statt ihn zu lockern. */
  t = t.replace(/\u0060([^\u0060]+)\u0060/g, (_m, c) => {
    code.push(c);
    return MARKE_AUF + (code.length - 1) + MARKE_ZU;
  });

  t = t
    .replace(/&lt;(https?:\/\/[^&\s]+)&gt;/g, '<a href="$1">$1</a>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    /* ⚠ NICHT `[^*]+`. Der Text traegt fett MIT kursiv darin:
       „**Zu *specification gaming* und *reward hacking*:**". Eine Regel, die
       am ersten Sternchen aufgibt, laest so eine Stelle als rohes `**` stehen —
       gefunden am 2026-09-03 in der Literaturliste, eine einzige Zeile von
       1.842. Deshalb: beliebige Zeichen, aber ein `*` nur, wenn KEIN zweites
       folgt. `.+?` waere falsch gewesen: es haette beim ersten Kursiv-Ende
       geschlossen. */
    .replace(/\*\*((?:[^*]|\*(?!\*))+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  return t.replace(new RegExp(MARKE_AUF + '(\\d+)' + MARKE_ZU, 'g'),
    (_m, i) => '<code>' + code[Number(i)] + '</code>');
}

/* ---- Kopf abtrennen ------------------------------------------------------ */

const alles = readFileSync(QUELLE, 'utf8').replace(/\r\n/g, '\n');
const zeilen = alles.split('\n');

/* Der Kopf ist alles bis zum ersten waagerechten Strich: Titel, Untertitel,
   Einordnungszeile, dann die Herkunftszeilen. */
const kopfEnde = zeilen.findIndex((l) => l.trim() === '---');
if (kopfEnde < 0) { console.error('✗ Kein `---` gefunden — der Kopf ist nicht abgegrenzt.'); process.exit(1); }
const kopf = zeilen.slice(0, kopfEnde);
const rumpf = zeilen.slice(kopfEnde + 1);

const titel = (kopf.find((l) => l.startsWith('# ')) || '').slice(2).trim();
const untertitel = (kopf.find((l) => l.startsWith('## ')) || '').slice(3).trim();
const einordnung = (kopf.find((l) => /^\*\*.+\*\*$/.test(l.trim())) || '').trim().replace(/^\*\*|\*\*$/g, '');
const metaZeilen = kopf.filter((l) => l.trim() && !l.startsWith('#') && !/^\*\*.+\*\*$/.test(l.trim()));

if (!titel) { console.error('✗ Keine `# `-Zeile im Kopf — ohne Titel wird nichts gebaut.'); process.exit(1); }

/* ---- Rumpf zu HTML ------------------------------------------------------- */

const aus = [];
let i = 0;
let inAbschnitt = null;          // 'abstract' | 'footnotes' | null

const schliesseAbschnitt = () => { if (inAbschnitt) { aus.push('  </div>'); inAbschnitt = null; } };
const einzug = () => (inAbschnitt ? '      ' : '    ');

while (i < rumpf.length) {
  const t = rumpf[i].trim();

  if (!t) { i++; continue; }

  if (t === '---') { schliesseAbschnitt(); aus.push('  <hr class="divider">'); i++; continue; }

  /* Ueberschriften */
  if (/^###\s+/.test(t)) {
    aus.push(einzug() + '<h3>' + inline(t.replace(/^###\s+/, '')) + '</h3>');
    i++; continue;
  }
  if (/^##\s+/.test(t)) {
    const text = t.replace(/^##\s+/, '');
    schliesseAbschnitt();
    if (/^(Zusammenfassung|Abstract)$/i.test(text)) {
      aus.push('  <div class="abstract">');
      aus.push('    <div class="abstract-label">' + inline(text) + '</div>');
      inAbschnitt = 'abstract';
    } else if (/^(Literatur|References)$/i.test(text)) {
      aus.push('  <div class="footnotes">');
      aus.push('    <h2>' + inline(text) + '</h2>');
      inAbschnitt = 'footnotes';
    } else {
      const eigene = EIGENE_SEITE_HIER.some((a) => text.startsWith(a));
      aus.push('    <h2' + (eigene ? ' class="eigene-seite"' : '') + '>' + inline(text) + '</h2>');
    }
    i++; continue;
  }

  /* Tabelle: Kopfzeile, Trennzeile, Datenzeilen */
  if (t.startsWith('|') && /^\s*\|[\s:|-]+\|\s*$/.test(rumpf[i + 1] || '')) {
    const spalten = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    const kopfz = spalten(t);
    i += 2;
    const daten = [];
    while (i < rumpf.length && rumpf[i].trim().startsWith('|')) { daten.push(spalten(rumpf[i])); i++; }
    aus.push(einzug() + '<table>');
    aus.push(einzug() + '  <thead><tr>' + kopfz.map((c) => '<th>' + inline(c) + '</th>').join('') + '</tr></thead>');
    aus.push(einzug() + '  <tbody>');
    for (const r of daten) aus.push(einzug() + '    <tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>');
    aus.push(einzug() + '  </tbody>');
    aus.push(einzug() + '</table>');
    continue;
  }

  /* Zitat-Block: laeuft ueber alle folgenden `>`-Zeilen; eine Leerzeile
     MITTEN im Zitat trennt zwei Absaetze, beendet es aber nicht. */
  if (t.startsWith('>')) {
    const inhalt = [];
    while (i < rumpf.length &&
           (rumpf[i].trim().startsWith('>') ||
            (rumpf[i].trim() === '' && (rumpf[i + 1] || '').trim().startsWith('>')))) {
      inhalt.push(rumpf[i].trim().replace(/^>\s?/, ''));
      i++;
    }
    aus.push(einzug() + '<blockquote>');
    for (const abs of inhalt.join('\n').split(/\n\s*\n/)) {
      if (abs.trim()) aus.push(einzug() + '  <p>' + inline(abs.trim().replace(/\n/g, ' ')) + '</p>');
    }
    aus.push(einzug() + '</blockquote>');
    continue;
  }

  /* Listen: `- ` oder `1. `. Folgezeilen gehoeren zum laufenden Punkt — der
     Text ist auf 80 Zeichen umgebrochen, die Fortsetzung steht deshalb oft
     OHNE Einrueckung. */
  const listenTyp = /^[-*]\s+/.test(t) ? 'ul' : (/^\d+\.\s+/.test(t) ? 'ol' : null);
  if (listenTyp) {
    const punkte = [];
    while (i < rumpf.length) {
      const l = rumpf[i];
      const lt = l.trim();
      if (/^[-*]\s+/.test(lt) || /^\d+\.\s+/.test(lt)) {
        punkte.push(lt.replace(/^([-*]|\d+\.)\s+/, ''));
      } else if (lt && punkte.length && !/^(#{1,3}\s|\||>|---$)/.test(lt)) {
        punkte[punkte.length - 1] += ' ' + lt;
      } else break;
      i++;
    }
    aus.push(einzug() + '<' + listenTyp + '>');
    for (const p of punkte) aus.push(einzug() + '  <li>' + inline(p) + '</li>');
    aus.push(einzug() + '</' + listenTyp + '>');
    continue;
  }

  /* Absatz */
  const absatz = [];
  while (i < rumpf.length && rumpf[i].trim() &&
         !/^(#{2,3}\s|>|\||[-*]\s|\d+\.\s|---$|<!--)/.test(rumpf[i].trim())) {
    absatz.push(rumpf[i].trim()); i++;
  }
  if (absatz.length) aus.push(einzug() + '<p>' + inline(absatz.join(' ')) + '</p>');
  else i++;
}
schliesseAbschnitt();

/* ---- Zusammensetzen ------------------------------------------------------ */

const css = readFileSync(resolve(WURZEL, 'docs/papers/paper.css'), 'utf8');

const doiZeile = DOI
  ? '  <p class="paper-doi">DOI: <a href="https://doi.org/' + DOI + '">doi.org/' + DOI + '</a></p>'
  : '  <p class="paper-doi"><strong>DOI: noch nicht vergeben</strong> — wird bei der Veröffentlichung eingetragen.</p>';

if (!DOI) {
  console.warn('⚠ Ohne --doi gebaut. Im Dokument steht ein Platzhalter, der als solcher zu lesen ist.');
  console.warn('  Der DOI wird bei Zenodo RESERVIERT, bevor die Dateien hochgehen, und dann hier eingetragen.');
}

const html = '<!DOCTYPE html>\n'
  + '<html lang="' + SPRACHE + '">\n'
  + '<head>\n'
  + '<meta charset="UTF-8">\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
  + '<title>' + titel + (untertitel ? ' — ' + untertitel : '') + '</title>\n'
  + '<!-- ⚠ ERZEUGT von tools/paper-md-zu-html.mjs. NICHT von Hand aendern.\n'
  + '     Die Quelle ist ' + frei[0] + '; eine Aenderung hier ginge beim naechsten\n'
  + '     Bau verloren, und bis dahin gaebe es den Text zweimal. -->\n'
  + '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
  + '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=Source+Code+Pro:wght@400;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">\n'
  + '<style>\n' + css + '\n</style>\n'
  + '</head>\n'
  + '<body>\n\n'
  + '<div class="paper">\n\n'
  + '  <h1 class="paper-title">' + inline(titel) + '</h1>\n'
  + (untertitel ? '  <p class="paper-authors">' + inline(untertitel) + '</p>\n' : '')
  + (einordnung ? '  <p class="paper-authors">' + inline(einordnung) + '</p>\n' : '')
  + metaZeilen.map((m) => '  <p class="paper-date">' + inline(m.trim()) + '</p>').join('\n') + '\n'
  + doiZeile + '\n\n'
  + aus.join('\n') + '\n\n'
  + '</div>\n\n'
  + '</body>\n'
  + '</html>\n';

writeFileSync(ZIEL, html, 'utf8');
console.log('✓ ' + ZIEL.replace(WURZEL + '/', '') + '  (' + html.length.toLocaleString('de-DE') + ' Zeichen)');
