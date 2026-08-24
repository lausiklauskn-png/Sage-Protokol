/* smoke_lizenz_konsistenz.mjs — die Zahlen der Lizenz-Tafel gegen sich selbst.
 *
 * WARUM ES DAS GEBEN MUSS (Befund 2026-08-24). In `FORSCHUNGSFOERDERUNG.md` § 4
 * stand über Monate "3 MIT · 28 eigene · 2 ohne". Am 2026-08-24 nachgemessen
 * waren es 6 · 26 · 1. Beide Randzahlen waren falsch, aus zwei verschiedenen
 * Gründen: drei Depots bekamen MIT am Tag der Zählung selbst (gezählt vorher,
 * geändert danach, nachgezählt nie), und ein viertes trug längst eine Lizenz,
 * die nur im veralteten Klon fehlte.
 *
 * Diese Probe kann das Netz nicht nachmessen — sie hat keinen Zugriff auf die
 * anderen 32 Depots, und eine Probe, die still ins Netz greift, misst
 * irgendwann etwas anderes als das, was sie zu messen glaubt.
 *
 * WAS SIE STATTDESSEN BEWACHT, ist die Sorte Fehler, die wirklich passiert ist:
 * eine Tafel, die NUR ZUR HÄLFTE nachgezogen wird. Wer ein Depot nach MIT
 * verschiebt und die Gegenzahl stehen lässt, geht hier auf. Dasselbe für die
 * KIM-Familie, deren Urteil in ZWEI Dateien steht und dort auseinanderlaufen
 * kann.
 *
 * Bewacht wird die ZUSICHERUNG, nicht der Wortlaut: gezählt wird aus den
 * Tabellen, nicht nach Sätzen gesucht.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FOE = readFileSync(resolve(WURZEL, 'docs/FORSCHUNGSFOERDERUNG.md'), 'utf-8');
const KOR = readFileSync(resolve(WURZEL, 'docs/FORSCHUNGSKORPUS.md'), 'utf-8');

let rot = 0;
const gut = (bedingung, was, dazu) => {
  console.log((bedingung ? '  ok   ' : '  ROT  ') + was + (bedingung || !dazu ? '' : '\n       ' + dazu));
  if (!bedingung) rot++;
  return bedingung;
};

/* ── 1 · Die drei Zahlen müssen die Gesamtzahl ergeben ─────────────────── */

const zahl = (muster) => {
  const t = FOE.match(muster);
  return t ? Number(t[1]) : null;
};
const nMit    = zahl(/\|\s*\*\*MIT\*\*[^|]*\|\s*\*\*(\d+)\*\*/);
const nEigen  = zahl(/\|\s*eigene\s+„Nutzungslizenz[^|]*\|\s*\*\*(\d+)\*\*/);
const nOhne   = zahl(/\|\s*gar keine Lizenz-Datei\s*\|\s*\*\*(\d+)\*\*/);
const nGesamt = zahl(/gegen `origin\/main` aller (\d+) Depots/);

gut([nMit, nEigen, nOhne, nGesamt].every((n) => typeof n === 'number'),
  'die vier Zahlen der Lizenz-Tafel sind überhaupt lesbar',
  'gelesen: MIT=' + nMit + ' eigene=' + nEigen + ' ohne=' + nOhne + ' gesamt=' + nGesamt);

if (nMit !== null && nEigen !== null && nOhne !== null && nGesamt !== null) {
  const summe = nMit + nEigen + nOhne;
  gut(summe === nGesamt,
    'die Aufteilung geht auf: ' + nMit + ' + ' + nEigen + ' + ' + nOhne + ' = ' + nGesamt,
    'Summe ' + summe + ' gegen ' + nGesamt + ' Depots. Eine Zahl wurde nachgezogen, die andere nicht.');
}

/* ── 2 · So viele Depots wie behauptet müssen auch aufgezählt sein ─────── */

const mitZeile = (FOE.match(/\|\s*\*\*MIT\*\*[^|]*\|([^|]*)\|/) || [])[1] || '';
const mitNamen = [...mitZeile.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
gut(mitNamen.length === nMit,
  'die MIT-Zeile zählt so viele Depots auf, wie sie behauptet (' + nMit + ')',
  'behauptet ' + nMit + ', aufgezählt ' + mitNamen.length + ': ' + mitNamen.join(' · '));

/* ── 3 · Die sechs Korpus-Glieder sind genau die MIT-Depots ────────────── */

const glieder = [...KOR.matchAll(/^\|\s*\d+\s*\|\s*\*\*\[([^\]]+)\]/gm)]
  .map((m) => m[1].replace(/·/g, '-').replace(/\s+/g, ''));
const norm = (n) => n.toLowerCase().replace(/[^a-z]/g, '');
const fehlt = glieder.filter((g) => !mitNamen.some((m) => norm(m) === norm(g)));
const zuviel = mitNamen.filter((m) => !glieder.some((g) => norm(g) === norm(m)));
gut(fehlt.length === 0 && zuviel.length === 0,
  'Korpus-Glieder und MIT-Depots sind dieselben ' + glieder.length,
  'nur im Korpus: ' + (fehlt.join(' · ') || 'keins')
  + ' · nur in der Lizenz-Tafel: ' + (zuviel.join(' · ') || 'keins'));

/* ── 4 · Die KIM-Familie steht in zwei Dateien und muss übereinstimmen ─── */

const kimUrteile = (text) => {
  const aus = {};
  for (const m of text.matchAll(/^\|\s*\*\*(Kim[^*]*)\*\*\s*\|\s*(✅|❌)/gm)) {
    aus[m[1].trim()] = m[2];
  }
  return aus;
};
const kFoe = kimUrteile(FOE);
const kKor = kimUrteile(KOR);

gut(Object.keys(kFoe).length >= 5,
  'die KIM-Familie ist in FORSCHUNGSFOERDERUNG vollständig aufgeführt (5)',
  'gefunden: ' + Object.keys(kFoe).join(' · '));
gut(Object.keys(kKor).length >= 5,
  'die KIM-Familie ist in FORSCHUNGSKORPUS vollständig aufgeführt (5)',
  'gefunden: ' + Object.keys(kKor).join(' · '));

const uneins = Object.keys(kFoe).filter((k) => kKor[k] && kKor[k] !== kFoe[k]);
gut(uneins.length === 0,
  'beide Dateien urteilen über jedes KIM-Depot gleich',
  'uneins: ' + uneins.map((k) => k + ' (' + kFoe[k] + ' gegen ' + kKor[k] + ')').join(' · '));

/* Und wer drin steht, muss auch MIT tragen. Ein ✅ ohne MIT wäre die
   Behauptung, die dieser ganzen Probe zugrunde liegt. */
const drinOhneMit = Object.entries(kFoe)
  .filter(([k, v]) => v === '✅' && !mitNamen.some((m) => norm(m) === norm(k)))
  .map(([k]) => k);
gut(drinOhneMit.length === 0,
  'jedes KIM-Depot mit ✅ steht auch in der MIT-Zeile',
  'im Korpus, aber nicht MIT: ' + drinOhneMit.join(' · '));

/* ── Ergebnis ──────────────────────────────────────────────────────────── */

console.log(rot === 0
  ? '\nsmoke_lizenz_konsistenz: alles grün'
  : '\nsmoke_lizenz_konsistenz: ' + rot + ' ROT');
process.exit(rot === 0 ? 0 : 1);
