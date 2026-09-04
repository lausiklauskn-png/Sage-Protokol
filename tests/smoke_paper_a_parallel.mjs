/* smoke_paper_a_parallel.mjs — haelt die beiden Sprachfassungen von Paper A
 * in derselben Gestalt.
 *
 * Lauf:  node tests/smoke_paper_a_parallel.mjs
 *
 * ── DIE ZUSICHERUNG ───────────────────────────────────────────────────────
 *
 * Paper A liegt zweisprachig unter EINEM DOI. Zwei Dateien, ein Werk. Laufen
 * sie auseinander, zitiert jemand irgendwann eine Fassung, in der etwas anderes
 * steht — genau der Befund aus `docs/papers/README.md`, nur zwischen Sprachen
 * statt zwischen Ablagen.
 *
 * `smoke_paper_a.mjs` bewacht je Sprache die HTML gegen ihr Markdown. Diese
 * Probe bewacht die BEIDEN MARKDOWNS gegeneinander.
 *
 * ── WARUM STRUKTUR UND NICHT WORTLAUT ─────────────────────────────────────
 *
 * Ein Wortlaut-Wächter verbietet das Richtigstellen. Genau das ist im Netz
 * teuer bezahlt worden: Kimhubs Wächter verlangte die Zeichenfolge
 * `KEINE WERKZEUGE` in der Werkstattregel und hielt damit elf Tage lang die
 * Regel am Leben, die falsch geworden war. Er war die ganze Zeit gruen.
 *
 * Ein UEBERSETZTER Text darf und muss andere Woerter haben. Was er NICHT haben
 * darf, ist eine andere Gestalt: ein Abschnitt weniger, eine Tabellenzeile
 * mehr, ein Querverweis, der woanders hinzeigt, ein Datum, das fehlt. Gemessen
 * wird deshalb, was sprachunabhaengig ist.
 *
 * Gemessen am 2026-09-04 beim Gegenlesen: 90 Ueberschriften, 0 von 90
 * Abschnitten mit abweichender Absatz-Blockzahl, 25 Querverweise, 16 Daten.
 * Der Befund dazu steht in `docs/papers/GEGENLESEN_EN_2026-09-04.md`.
 *
 * ⚠ WAS DIESE PROBE NICHT MISST, und das gehoert dazugesagt: sie sieht die
 * Gestalt, nicht die Aussage. Ein Absatz, der an derselben Stelle steht und
 * etwas anderes behauptet, faellt hier nicht auf. Dafuer gibt es kein
 * Werkzeug — nur Lesen. Wer sie fuer eine inhaltliche Pruefung haelt, haelt
 * einen gruenen Haken fuer einen Beweis.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DE = resolve(WURZEL, 'docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.md');
const EN = resolve(WURZEL, 'docs/papers/rules-and-principles-in-ai-agent-systems.md');

let gruen = 0;
const rot = [];
const pruefe = (name, bedingung, hinweis) => {
  if (bedingung) { gruen++; console.log('  ✓ ' + name); }
  else { rot.push(name + (hinweis ? ' — ' + hinweis : '')); console.log('  ✗ ' + name + (hinweis ? ' — ' + hinweis : '')); }
};

console.log('Paper A: die beiden Sprachfassungen gegeneinander');

pruefe('Die deutsche Fassung liegt vor', existsSync(DE));
pruefe('Die englische Fassung liegt vor', existsSync(EN));
if (rot.length) { console.log('\n' + gruen + ' gruen, ' + rot.length + ' ROT'); process.exit(1); }

/* ---- Die Gestalt einer Fassung ausmessen -------------------------------- */

function gestalt(pfad) {
  const zeilen = readFileSync(pfad, 'utf8').split('\n');

  /* Ueberschriften: nur die EBENE zaehlt, nicht der Text — der ist uebersetzt. */
  const kopf = [];
  zeilen.forEach((z, i) => { const m = z.match(/^(#{1,4})\s/); if (m) kopf.push({ stufe: m[1].length, i }); });

  /* Je Abschnitt: Absatz-Bloecke, Tabellenzeilen, Listenpunkte.
   * Ein Block ist eine zusammenhaengende Folge nicht-leerer Zeilen. Das faengt
   * einen fehlenden Absatz UND einen fehlenden Kasten. */
  const abschnitte = kopf.map((k, n) => {
    const koerper = zeilen.slice(k.i + 1, n + 1 < kopf.length ? kopf[n + 1].i : zeilen.length);
    let bloecke = 0, drin = false;
    for (const z of koerper) {
      if (/^\s*$/.test(z)) { drin = false; continue; }
      if (!drin) { bloecke++; drin = true; }
    }
    return {
      bloecke,
      tabelle: koerper.filter(z => /^\|/.test(z)).length,
      liste: koerper.filter(z => /^\s*[-*]\s/.test(z)).length,
    };
  });

  /* Querverweise auf eigene Abschnitte (1.1 … 7.3.2) — sprachunabhaengig.
   * Ueberschriftszeilen bleiben aussen vor, sonst zaehlt die Nummerierung mit. */
  const verweise = new Map();
  zeilen.forEach(z => {
    if (/^#{1,4}\s/.test(z)) return;
    for (const t of z.match(/\b\d\.\d(?:\.\d)?\b/g) || []) verweise.set(t, (verweise.get(t) || 0) + 1);
  });

  /* Daten im ISO-Format — eine Jahreszahl ohne Tag waere sprachabhaengig
   * formatiert („10.03." gegen „10 March"), ein ISO-Datum nicht. */
  const daten = new Map();
  for (const t of readFileSync(pfad, 'utf8').match(/\b20\d\d-\d\d-\d\d\b/g) || []) {
    daten.set(t, (daten.get(t) || 0) + 1);
  }

  return { kopf, abschnitte, verweise, daten };
}

const d = gestalt(DE);
const e = gestalt(EN);

/* ---- 1. Gliederung ------------------------------------------------------ */

pruefe('Gleich viele Ueberschriften', d.kopf.length === e.kopf.length,
  d.kopf.length + ' gegen ' + e.kopf.length);

const stufenGleich = d.kopf.length === e.kopf.length &&
  d.kopf.every((k, i) => k.stufe === e.kopf[i].stufe);
pruefe('Die Ueberschriften-Ebenen kommen in derselben Reihenfolge', stufenGleich,
  'eine Fassung gliedert anders');

/* ---- 2. Je Abschnitt dieselbe Gestalt ------------------------------------ */

if (d.abschnitte.length === e.abschnitte.length) {
  const abw = (feld) => d.abschnitte
    .map((a, i) => (a[feld] !== e.abschnitte[i][feld] ? (i + 1) + ': ' + a[feld] + '/' + e.abschnitte[i][feld] : null))
    .filter(Boolean);

  const bl = abw('bloecke');
  pruefe('Jeder Abschnitt hat in beiden Fassungen gleich viele Absatz-Bloecke',
    bl.length === 0, bl.slice(0, 6).join(' · '));

  const tb = abw('tabelle');
  pruefe('Jeder Abschnitt hat gleich viele Tabellenzeilen',
    tb.length === 0, tb.slice(0, 6).join(' · '));

  const li = abw('liste');
  pruefe('Jeder Abschnitt hat gleich viele Listenpunkte',
    li.length === 0, li.slice(0, 6).join(' · '));
}

/* ---- 3. Querverweise und Daten ------------------------------------------- */

function mengenGleich(a, b) {
  const alle = new Set([...a.keys(), ...b.keys()]);
  const abw = [];
  for (const k of alle) if ((a.get(k) || 0) !== (b.get(k) || 0)) abw.push(k + ': ' + (a.get(k) || 0) + '/' + (b.get(k) || 0));
  return abw;
}

const vAbw = mengenGleich(d.verweise, e.verweise);
pruefe('Beide Fassungen verweisen gleich oft auf dieselben Abschnitte',
  vAbw.length === 0, vAbw.slice(0, 6).join(' · '));

const dAbw = mengenGleich(d.daten, e.daten);
pruefe('Beide Fassungen nennen dieselben ISO-Daten gleich oft',
  dAbw.length === 0, dAbw.slice(0, 6).join(' · '));

/* ---- 4. Ein Werk, ein DOI ------------------------------------------------ */

/* ⚠ Der DOI steht NICHT im Markdown, sondern kommt beim Bauen von aussen
 * (siehe `tools/paper-md-zu-html.mjs`). Gemessen wird er deshalb an den
 * erzeugten HTML-Fassungen — dort, wo ihn ein Leser sieht. */
const html = (p) => {
  const f = resolve(WURZEL, p);
  return existsSync(f) ? (readFileSync(f, 'utf8').match(/doi\.org\/(10\.\d+\/[^"'<\s]+)/) || [])[1] : null;
};
const doiDE = html('docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.html');
const doiEN = html('docs/papers/rules-and-principles-in-ai-agent-systems.html');

pruefe('Beide HTML-Fassungen tragen einen DOI', Boolean(doiDE) && Boolean(doiEN),
  'DE ' + doiDE + ' · EN ' + doiEN);
pruefe('Es ist derselbe DOI — zwei Dateien, ein Werk', doiDE === doiEN,
  doiDE + ' gegen ' + doiEN);

/* ---- Schluss ------------------------------------------------------------- */

console.log('\n' + gruen + ' gruen, ' + rot.length + ' ROT');
if (rot.length) { for (const r of rot) console.log('  ✗ ' + r); process.exit(1); }
