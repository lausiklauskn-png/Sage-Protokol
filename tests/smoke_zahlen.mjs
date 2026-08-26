/* smoke_zahlen.mjs, hält die Zahlen in der PROSA gegen die Messung.
 *
 * Lauf:  node tests/smoke_zahlen.mjs
 *
 * ── WOFÜR DIESE PROBE DA IST ──────────────────────────────────────────────
 *
 * Erzeugte Blätter kann man gegen ihr Modul prüfen. Prosa nicht: sie wird von
 * Hand geschrieben, und niemand baut sie neu. Sie lässt sich aber
 * NACHRECHNEN, und genau das geschieht hier.
 *
 * Am 2026-08-26 standen in zwei Unterlagen, die aus dem Haus gehen, drei
 * falsche Zahlen:
 *
 *   · „27 Tage nichts"                    gemessen: 26
 *   · „140 Kalendertage"                  gemessen: 141
 *   · „genau EINE Lücke von vier Tagen"   gemessen: neun, die längste drei
 *
 * Die dritte war die gefährlichste. Neben dem Text liegt die Tages-Tabelle,
 * in der jeder die Unterbrechungen nachzählen kann, und eine Zahl, die
 * jemand anders berichtigt, nimmt die richtigen daneben mit.
 *
 * ── WAS DIESE PROBE NICHT KANN, UND WARUM DAS DASTEHT ─────────────────────
 *
 * Sie prüft die unten aufgezählten Aussagen, nicht jede Zahl in jedem Text.
 * Wer eine neue Zahl in eine Unterlage schreibt, die aus dem Haus geht,
 * trägt sie hier nach. Eine Probe, die vollständig AUSSIEHT und es nicht ist,
 * wäre schlimmer als gar keine.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kennzahlen, durchgehendAb, pauseZwischen } from '../tools/bestand-rechnen.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);
const lies = (r) => readFileSync(P(r), 'utf-8');

let rot = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

const historie = JSON.parse(lies('docs/historie/historie.json'));
const de = (n) => n.toLocaleString('de-DE');

/* Die Unterlagen, die aus dem Haus gehen oder an denen der Antrag hängt. */
const TEXTE = {
  fahrplan: lies('docs/FORSCHUNGSFOERDERUNG.md'),
  steuerberater: lies('docs/STEUERBERATER_FRAGEN.md'),
  korpus: lies('docs/FORSCHUNGSKORPUS.md'),
  entstehung: lies('docs/papers/ENTSTEHUNG.md'),
  uebersicht: lies('docs/unterlagen/00_UEBERSICHT.md'),
  schritte: lies('docs/unterlagen/01_SCHRITTE.md'),
  finanzamt: lies('docs/unterlagen/03_FINANZAMT.md'),
};

/* ── 1 · Die Kennzahlen, wo sie mit ihrem Etikett auftauchen ──────────────
   Geprüft wird das PAAR aus Zahl und Wort. Eine Prüfung nur auf die Zahl
   fände sie irgendwo; eine nur auf das Wort fände jede Zahl daneben gut. */

const k = Object.fromEntries(kennzahlen(historie).map((x) => [x.schluessel, x.wert]));

const PAARE = [
  ['Einträge insgesamt', /(\d[\d.]*)\s+(?:Einträge insgesamt|Einzelstände \(Commits\)|Commits an)/g, k.eintraegeAlle],
  ['Arbeitstage', /(\d[\d.]*)\s+Arbeitstagen? vom 10\.03/g, k.arbeitstage],
  ['Depots', /(\d[\d.]*)\s+Depots/g, k.depots],
  ['Zweige', /(\d[\d.]*)\s+Zweige/g, k.zweige],
];

for (const [name, muster, soll] of PAARE) {
  const falsch = [];
  for (const [datei, text] of Object.entries(TEXTE)) {
    for (const m of text.matchAll(muster)) {
      if (m[1].replace(/\./g, '') !== String(soll)) falsch.push(datei + ': „' + m[0] + '"');
    }
  }
  gut(falsch.length === 0,
    'überall, wo „' + name + '" steht, steht ' + de(soll),
    'abweichend: ' + falsch.join(' · '));
}

/* ── 2 · Die beiden Eintrags-Zahlen bleiben unterscheidbar ────────────────
   Sie sind beide richtig und unterscheiden sich um die zeitgesteuerten
   Läufe. Wer sie ohne Zusatz nebeneinanderstellt, erzeugt einen
   Widerspruch aus zwei richtigen Angaben. */

const beideRoh = [];
for (const [datei, text] of Object.entries(TEXTE)) {
  const a = new RegExp(de(k.eintraegeAlle) + '\\s+Einträge(?!\\s+insgesamt)', 'g');
  const b = new RegExp(de(k.eintraegeHand) + '\\s+Einträge(?!\\s+von Hand)', 'g');
  for (const m of [...text.matchAll(a), ...text.matchAll(b)]) beideRoh.push(datei + ': „' + m[0] + '"');
}
gut(beideRoh.length === 0,
  'keine der beiden Eintrags-Zahlen steht ohne ihren Zusatz da',
  'ohne Zusatz: ' + beideRoh.join(' · '));

/* ── 3 · Die durchgehende Arbeit ab 06.04., Zahl für Zahl ─────────────────
   Diese vier Angaben stehen als Prosa in zwei Unterlagen, die aus dem Haus
   gehen. Genau hier lagen am 2026-08-26 drei Fehler. */

const dg = durchgehendAb(historie.commits, '2026-04-06');
const pause = pauseZwischen(historie.commits, '2026-03-10', '2026-04-06');

for (const [datei, text] of [['fahrplan', TEXTE.fahrplan], ['steuerberater', TEXTE.steuerberater]]) {
  const stelle = text.slice(Math.max(0, text.indexOf('06.04.2026') - 700),
    text.indexOf('06.04.2026') + 700);
  gut(stelle.includes(dg.arbeitstage + ' Arbeitstage'),
    datei + ': ' + dg.arbeitstage + ' Arbeitstage ab dem 06.04.');
  gut(stelle.includes(dg.kalendertage + ' Kalendertagen'),
    datei + ': ' + dg.kalendertage + ' Kalendertage (beide Enden mitgezählt)',
    'gemessen ' + dg.kalendertage + ', im Text nicht gefunden');
  gut(/drei Tage/.test(stelle) && dg.laengste === 3,
    datei + ': die längste Unterbrechung sind ' + dg.laengste + ' Tage',
    'gemessen: ' + dg.laengste);
  /* KEINE ZAHL DARF EINE EINZIGE UNTERBRECHUNG BEHAUPTEN. Es sind neun. */
  gut(!/genau \*\*einer?\*\* Lücke|mit genau \*\*einer\*\*/.test(stelle),
    datei + ': behauptet keine einzelne Lücke (gemessen: ' + dg.luecken.length + ')');
  /* UND DIE ZAHL SELBST GEHÖRT GEPRÜFT. Die Gegenprobe hat am 2026-08-26
     gezeigt, warum: lässt man Unterbrechungen von einem Tag wegfallen, sinkt
     die gemessene Zahl von neun auf vier, die längste bleibt drei, und die
     Prüfung oben bleibt grün. Ein Wächter, der nur das Falsche VERBIETET,
     misst nicht, ob das Richtige dasteht. */
  const wort = ['null', 'einmal', 'zweimal', 'dreimal', 'viermal', 'fünfmal',
    'sechsmal', 'siebenmal', 'achtmal', 'neunmal', 'zehnmal'][dg.luecken.length];
  gut(wort !== undefined
    && (stelle.includes(wort) || stelle.includes(dg.luecken.length + 'mal')),
    datei + ': nennt die gemessene Zahl der Unterbrechungen (' + dg.luecken.length + ')',
    'erwartet „' + wort + '", im Text nicht gefunden');
}

gut(TEXTE.fahrplan.includes(pause + ' Tage ohne')
  && TEXTE.steuerberater.includes(pause + ' Tage ohne'),
  'beide Texte nennen die Anlaufpause mit ' + pause + ' Tagen',
  'gemessen: ' + pause);

/* ── 4 · Die Demo trägt beide Daten ───────────────────────────────────────
   Inhalt vom März, ins Depot gekommen im August. Wahr, sieht beim Nachprüfen
   aber falsch aus, wenn nur das eine dasteht. */

gut(/sbkim-demo/.test(TEXTE.korpus) && /2026-08-15/.test(TEXTE.korpus),
  'der Forschungskorpus nennt bei der Demo auch den Tag der Aufnahme ins Depot');

console.log('\nsmoke_zahlen: ' + (rot === 0 ? 'alles grün' : rot + ' ROT'));
process.exit(rot === 0 ? 0 : 1);
