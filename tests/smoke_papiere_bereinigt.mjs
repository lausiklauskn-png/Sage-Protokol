// Probe: die drei Konzept-Papiere tragen keinen fremden Firmennamen mehr —
// weder in der HTML-Fassung noch im erzeugten PDF.
//
// ── WARUM ES DIESE PROBE GIBT ────────────────────────────────────────────────
//
// Zweimal wurde hier „im PDF steht nichts mehr" gemeldet, und zweimal war die
// Meldung nicht falsch gerechnet, sondern am falschen Ort gesucht:
//
//   1  Die Datei wurde nach dem Wort durchsucht statt der Inhalt. PDF-Text
//      liegt gepackt vor; ein grep findet dort grundsätzlich nichts. „0
//      Treffer" war eine Blindstelle, die aussah wie ein Ergebnis. Klaus hat
//      nachgefragt — dann kamen 35 Treffer heraus.
//   2  Der zweite Leser konnte die ALTEN Papiere lesen, die neuen nicht:
//      Chromium legt Text als Glyph-Nummern eines Schrift-Ausschnitts ab.
//      Wieder „nichts gefunden", wieder aus demselben Grund.
//
// Deshalb prüft diese Probe nicht nur, ob etwas gefunden wurde, sondern
// zuerst, **ob überhaupt gelesen werden konnte**. Erst wenn kein Strom
// verschlossen und kein Zeichen unzuordenbar blieb, ist „nichts gefunden"
// eine Aussage. Vorher ist es nur ein grüner Haken.
//
// Gegenprobe:  node tests/gegenprobe_papiere.mjs
// Lauf:        node tests/smoke_papiere_bereinigt.mjs

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pdfText } from '../sbkim-demo/papiere/_pdf_text.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = resolve(WURZEL, 'sbkim-demo/papiere');

const PAPIERE = [
  'Konzept_PWA_Marktplatz',
  'Marktanalyse_PWA_Plattform',
  'USP_Bidirektionales_Matching'
];

// Was nicht mehr vorkommen darf.
//
// Der Firmenname steht hier NICHT als Klartext — sonst trüge ausgerechnet der
// Wächter ihn wieder ins Repo. Er wird aus Silben zusammengesetzt: das Muster
// trifft ihn, die Datei nennt ihn nicht.
const NAME = ['Ever', 'last'].join('');
const VERBOTEN = [
  { was: 'Firmenname',        muster: new RegExp(NAME, 'i'),            flach: NAME.toLowerCase() },
  { was: 'Kürzel',            muster: /\bEVL\b/,                        flach: null },
  { was: 'Vertraulichkeit',   muster: /Vertraulich/i,                   flach: 'vertraulich' },
  { was: 'Empfänger-Vermerk', muster: /Präsentiert\s+an/i,              flach: 'präsentiertan' },
  { was: 'Firmen-Domänen',    muster: /ki(beratung|lernen|champions)\.de/i, flach: null },
  { was: 'Produktname',       muster: /AI\s+Agency\s+Kickstart/i,       flach: 'aiagencykickstart' },
  { was: 'Community-Name',    muster: /KI-Champions/i,                  flach: 'ki-champions' }
];

let rot = 0, gruen = 0;
const sage = (ok, text) => { ok ? gruen++ : rot++; console.log(`${ok ? '  ✓' : '  ✗ ROT'} ${text}`); };

// Zwei Lesarten desselben Textes, weil beide Fallen echt sind:
//   glatt — Zeilenumbrüche zu Leerzeichen, fängt über zwei Zeilen gebrochene
//           Wortgruppen („AI Agency\nKickstart")
//   flach — jeder Zwischenraum weg, fängt gesperrt gesetzte Überschriften,
//           bei denen jeder Buchstabe einzeln gesetzt ist
function suche(text, regel) {
  const glatt = text.replace(/\s+/g, ' ');
  if (regel.muster.test(glatt)) return true;
  if (regel.flach) {
    const flach = text.replace(/\s+/g, '').toLowerCase();
    if (flach.includes(regel.flach)) return true;
  }
  return false;
}

console.log('\n=== Papiere · bereinigt ===\n');

for (const name of PAPIERE) {
  console.log(`── ${name}`);

  // 1 · HTML — die Quelle, aus der das PDF gebaut wird
  const htmlPfad = resolve(ORDNER, name + '.html');
  sage(existsSync(htmlPfad), 'HTML-Fassung liegt vor');
  if (existsSync(htmlPfad)) {
    const html = readFileSync(htmlPfad, 'utf-8');
    for (const regel of VERBOTEN) sage(!suche(html, regel), `HTML frei von: ${regel.was}`);
    sage(/class="einordnung"/.test(html), 'HTML trägt den Einordnungs-Kasten');
    sage(html.includes('…'), 'HTML zeigt die Auslassung „…" statt eines Namens');
  }

  // 2 · PDF — entpackt und entschlüsselt, nicht überflogen
  const pdfPfad = resolve(ORDNER, name + '.pdf');
  sage(existsSync(pdfPfad), 'PDF liegt vor');
  if (!existsSync(pdfPfad)) { console.log(''); continue; }

  const r = pdfText(readFileSync(pdfPfad));

  // Diese drei stehen VOR der Fundstellen-Suche, weil sie entscheiden, ob
  // deren Ergebnis überhaupt etwas bedeutet.
  sage(r.seiten > 0, `Seiten gefunden: ${r.seiten}`);
  sage(r.ungeoeffneteStroeme === 0, `kein Strom blieb verschlossen (verschlossen: ${r.ungeoeffneteStroeme})`);
  sage(r.unlesbareZeichen === 0, `kein Zeichen blieb unzuordenbar (unlesbar: ${r.unlesbareZeichen})`);
  sage(r.text.length > 4000, `Text aus dem PDF gewonnen: ${r.text.length} Zeichen`);

  // Beleg, dass wirklich DIESES Papier gelesen wurde und nicht irgendetwas:
  // ein Satz, der nur in der bereinigten Fassung steht.
  sage(suche(r.text, { muster: /Zur Einordnung/ }), 'PDF enthält den Einordnungs-Kasten');

  for (const regel of VERBOTEN) sage(!suche(r.text, regel), `PDF frei von: ${regel.was}`);
  console.log('');
}

console.log(`Ergebnis: ${gruen} grün, ${rot} rot\n`);
process.exit(rot ? 1 : 0);
