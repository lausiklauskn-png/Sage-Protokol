/* smoke_forschungsaufgaben.mjs, bewacht das Blatt der Forschungsaufgaben.
 *
 * Lauf:  node tests/smoke_forschungsaufgaben.mjs
 *
 * ── DIE ZUSICHERUNG, DIE HIER AM MEISTEN WIEGT ────────────────────────────
 *
 * **Der Stand einer Aufgabe wird gemessen, nicht hingeschrieben.** Der Anlass
 * war ein Blatt, das eine Sache als „existiert nicht" führte, die es seit
 * demselben Tag gab. Klaus las eine heruntergeladene Fassung und fragte nach.
 *
 * Und die zweite, die genauso wiegt: **ein Beleg heißt nicht erledigt.** Drei
 * der sieben Aufgaben haben eine Datei im Depot und sind trotzdem offen, zwei
 * könnten ihr Ergebnis dort gar nicht zeigen. Ein Blatt, das „liegt vor" sagt
 * und damit „fertig" meinen lässt, ist schlimmer als eines, das nichts sagt.
 *
 * ── WIE HIER GEPRÜFT WIRD ─────────────────────────────────────────────────
 *
 *   A · Die Zuordnung Aufgabe zu Zeichen wird an ERFUNDENEN Lagen gemessen.
 *   B · Das Blatt wird gegen den echten Dateibestand gehalten: was es als
 *       vorhanden führt, muss da sein, und was es als fehlend führt, darf
 *       nicht da sein. Beide Richtungen, denn nur zusammen taugen sie.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);
const BLATT = P('docs/unterlagen/06_FORSCHUNGSAUFGABEN.md');

let rot = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

if (!existsSync(BLATT)) {
  gut(false, 'das Blatt liegt vor', 'fehlt: docs/unterlagen/06_FORSCHUNGSAUFGABEN.md');
  console.log('\nsmoke_forschungsaufgaben: 1 ROT');
  process.exit(1);
}
const blatt = readFileSync(BLATT, 'utf-8');

/* ═══ A · Die Zeilen der Tabelle, gegen den echten Dateibestand ══════════ */

const zeilen = blatt.split('\n').filter((z) => /^\| \*\*\d+\*\* \|/.test(z));
gut(zeilen.length >= 5, 'die Tabelle führt mindestens fünf Aufgaben',
  'gezählt: ' + zeilen.length);

/* BEIDE RICHTUNGEN. Ein Wächter, der nur prüft, ob das Behauptete da ist,
   bliebe grün, wenn das Blatt ALLES als vorhanden führte. */
const falschVorhanden = [];
const falschFehlend = [];
for (const z of zeilen) {
  const spalten = z.split('|').map((s) => s.trim());
  const ergebnis = spalten[4] || '';
  const beleg = spalten[5] || '';
  const pfade = [...beleg.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  if (/Ergebnis liegt vor/.test(ergebnis)) {
    for (const p of pfade) if (!existsSync(P(p))) falschVorhanden.push(p);
    if (!pfade.length) falschVorhanden.push('(Zeile ohne Pfad: ' + spalten[2] + ')');
  }
  if (/Ergebnis fehlt/.test(ergebnis)) {
    if (pfade.length) falschFehlend.push(spalten[2] + ': nennt trotzdem ' + pfade.join(' '));
  }
}
gut(falschVorhanden.length === 0,
  'jede Aufgabe, die ein Ergebnis meldet, nennt eine Datei, die es gibt',
  'behauptet, aber nicht da: ' + falschVorhanden.join(' · '));
gut(falschFehlend.length === 0,
  'jede Aufgabe, die kein Ergebnis meldet, nennt auch keine Datei',
  falschFehlend.join('\n       '));

/* ═══ B · Die drei Sätze, die keine Zahl falsch machen ═══════════════════ */

const kopf = blatt.slice(0, blatt.indexOf('## 2'));

gut(/keine einzige erledigt/.test(kopf),
  'das Blatt sagt im Kopf, dass keine Aufgabe erledigt ist');

gut(/[Ee]in Beleg sagt, dass eine Datei da ist/.test(kopf),
  'und sagt, dass ein Beleg nicht „erledigt" bedeutet');

gut(/nicht als Datei sichtbar/.test(blatt),
  'und kennt den Fall, dessen Ergebnis im Depot gar nicht stehen kann');

/* ⚠ DIESER WAECHTER IST AM 2026-09-03 UMGEDREHT WORDEN, und der alte Wortlaut
   bleibt darueber stehen, weil er zeigt, warum er richtig war:

     „Wer ihn als ‚liegt vor' fuehrte, meldete eine Veroeffentlichung,
      die nie stattgefunden hat."

   Sie hat inzwischen stattgefunden. Am 2026-09-03 sind beide Papers bei
   Zenodo erschienen, und Klaus hat im Browser geprueft, dass der Verweis
   auflöst. Der Waechter verlangt jetzt das Gegenteil: die Zeile MUSS einen
   DOI nennen. Ohne diese Umkehr haette die Probe eine Behauptung
   festgehalten, die einen Tag alt und falsch ist -- und genau das ist der
   Fall, in dem ein gruener Haken schadet.

   Bewacht wird weiterhin die ZUSICHERUNG, nicht die Wortwahl: dass die Zeile
   sagt, WO das Ergebnis liegt, statt es zu behaupten. */
const zenodo = zeilen.find((z) => /Zenodo/.test(z)) || '';
gut(/10\.5281\/zenodo\.\d+/.test(zenodo),
  'die Zenodo-Aufgabe nennt den DOI, unter dem das Ergebnis liegt',
  'Zeile: ' + zenodo.slice(0, 110));

/* ═══ C · Die drei Stränge und die Abhängigkeiten ════════════════════════ */

gut((blatt.match(/^### Strang \d/gm) || []).length === 3,
  'alle drei Forschungsstränge sind aufgeführt',
  'gezählt: ' + (blatt.match(/^### Strang \d/gm) || []).length);

const abhaengig = (blatt.match(/\| Hängt ab von \|/g) || []).length;
gut(abhaengig === zeilen.length,
  'jede Aufgabe nennt, wovon sie abhängt (' + zeilen.length + ')',
  'gezählt: ' + abhaengig);

const wasFehlt = (blatt.match(/\| Was noch fehlt \|/g) || []).length;
gut(wasFehlt >= zeilen.length,
  'jede Aufgabe nennt, was ihr noch fehlt',
  'gezählt: ' + wasFehlt + ' bei ' + zeilen.length + ' Aufgaben');

/* ═══ D · Das Blatt sagt, was es nicht kann ══════════════════════════════ */

gut(/misst, \*\*ob\*\* eine Datei da ist, nicht ob sie taugt/.test(blatt),
  'das Blatt sagt, dass es die Güte nicht messen kann');
gut(/außerhalb des Depots/.test(blatt),
  'und dass es Arbeit außerhalb des Depots nicht sieht');

console.log('\nsmoke_forschungsaufgaben: ' + (rot === 0 ? 'alles grün' : rot + ' ROT'));
process.exit(rot === 0 ? 0 : 1);
