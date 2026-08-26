/* bestand-rechnen.mjs, die EINE Quelle für die Bestandsaufnahme.
 *
 * Benutzt von `tools/bestand-bauen.mjs` (das Blatt) und
 * `tests/smoke_bestand.mjs` (die Probe).
 *
 * ── WARUM SIE HIER STEHT UND NICHT ZWEIMAL ────────────────────────────────
 *
 * Dieselbe Lehre wie bei `arbeitstage-rechnen.mjs` und `historie-marken.mjs`:
 * eine zweite Fassung der Rechnung zählte irgendwann etwas anderes als das
 * Blatt zeigt, und beide wären grün. Eine Probe, die ihre eigene Rechnung
 * mitbringt, prüft ihre Rechnung, nicht die des Werkzeugs. Teil A der Probe
 * misst deshalb die Regeln hier an erfundenen Daten mit bekannter Antwort,
 * Teil B misst, ob das Blatt wiedergibt, was dieses Modul rechnet.
 *
 * ── DIE DREI BEGRIFFE, DIE HIER AUSEINANDERGEHALTEN WERDEN ────────────────
 *
 * Am 2026-08-26 standen in derselben Mappe 5.823 und 5.775, beide „Einträge"
 * genannt. Beide waren richtig: die eine Zahl zählt alles, die andere lässt
 * die 48 zeitgesteuerten Läufe weg. Wer sie nebeneinander liest, sieht einen
 * Widerspruch von 48 ohne Erklärung. Deshalb trägt jede Kennzahl hier ihre
 * Definition mit, und das Blatt schreibt sie DARAUS.
 *
 * ── WAS DIESES MODUL NICHT KANN ───────────────────────────────────────────
 *
 * Es sieht nur, was in einem Git-Depot liegt. Chat-Verläufe, Bildschirmfotos
 * auf Klaus' Gerät und die Belege, die absichtlich nicht im Depot stehen,
 * kennt es nicht. Sie werden im Blatt von Hand geführt und sind dort als
 * „nicht aus den Daten" gekennzeichnet.
 */

import { istAutomatik } from './arbeitstage-rechnen.mjs';

/** Ein Datum `YYYY-MM-DD` auf seinen Monat `YYYY-MM` kürzen. */
export const monatVon = (datum) => String(datum).slice(0, 7);

/** Alle Tage, an denen von Hand gearbeitet wurde, als sortierte Liste. */
export function arbeitsTage(commits) {
  const t = new Set();
  for (const c of commits) if (!istAutomatik(c)) t.add(c.datum);
  return [...t].sort();
}

/** Die Tage, für die ein Sitzungsprotokoll vorliegt.
 *
 *  Erwartet Dateinamen. Gezählt wird NUR, was ein Datum im Namen trägt:
 *  `2026-05-14_bau-01-storage.md`. Dateien wie `2026-08_puls-auslagerung.md`
 *  nennen einen Monat, keinen Tag, und können deshalb keinen Tag decken. */
export function protokollTage(dateinamen) {
  const t = new Set();
  for (const n of dateinamen) {
    const m = String(n).match(/(\d{4}-\d{2}-\d{2})_/);
    if (m) t.add(m[1]);
  }
  return [...t].sort();
}

/** Deckung je Monat: wie viele Arbeitstage haben ein Protokoll, wie viele nicht.
 *
 *  Das ist die Frage, mit der der Brief vom 2026-08-26 anfängt. Sie ist
 *  beantwortbar, und sie ist etwas anderes als „Commits je Protokoll":
 *  ein Protokoll je Sitzung ergibt bei längeren Sitzungen dieselbe fallende
 *  Kurve, ohne dass etwas fehlte. Tage lassen sich dagegen zählen. */
export function deckungJeMonat(commits, dateinamen) {
  const prot = new Set(protokollTage(dateinamen));
  const je = new Map();
  for (const tag of arbeitsTage(commits)) {
    const m = monatVon(tag);
    if (!je.has(m)) je.set(m, { monat: m, tage: 0, mit: 0, ohne: 0 });
    const o = je.get(m);
    o.tage++;
    if (prot.has(tag)) o.mit++; else o.ohne++;
  }
  return [...je.values()].sort((a, b) => a.monat.localeCompare(b.monat));
}

/** Wo die Arbeit eines Monats lag: Einträge je Depot, absteigend.
 *
 *  Braucht man, um eine Lücke einem Depot zuzuordnen statt dem Kalender.
 *  Der April sah nach einer Dokumentationslücke aus, bis diese Zahl dastand. */
export function arbeitJeDepot(commits, monat) {
  const je = new Map();
  for (const c of commits) {
    if (istAutomatik(c) || monatVon(c.datum) !== monat) continue;
    je.set(c.repo, (je.get(c.repo) || 0) + 1);
  }
  return [...je.entries()]
    .map(([depot, eintraege]) => ({ depot, eintraege }))
    .sort((a, b) => b.eintraege - a.eintraege || a.depot.localeCompare(b.depot));
}

/** Der erste Tag, für den überhaupt ein Protokoll vorliegt. */
export function protokollBeginn(dateinamen) {
  const t = protokollTage(dateinamen);
  return t.length ? t[0] : null;
}

/** Die Kennzahlen, jede mit ihrer Definition.
 *
 *  Die Definition ist kein Beiwerk. Zwei Zahlen, die beide „Einträge" heißen,
 *  sind für jeden, der sie nebeneinander sieht, ein Widerspruch. */
export function kennzahlen(historie) {
  const alle = historie.commits;
  const automatisch = alle.filter(istAutomatik).length;
  return [
    { schluessel: 'eintraegeAlle', wert: alle.length,
      name: 'Einträge insgesamt',
      was: 'jeder gespeicherte Stand, auch die zeitgesteuerten Läufe' },
    { schluessel: 'eintraegeHand', wert: alle.length - automatisch,
      name: 'Einträge von Hand',
      was: 'ohne die zeitgesteuerten Läufe; das ist die Zahl für die Arbeitszeit' },
    { schluessel: 'eintraegeAutomatisch', wert: automatisch,
      name: 'davon zeitgesteuert',
      was: 'Läufe des Dienstes, meist nachts; keine Arbeitszeit' },
    { schluessel: 'arbeitstage', wert: arbeitsTage(alle).length,
      name: 'Arbeitstage',
      was: 'Tage mit mindestens einem Eintrag von Hand' },
    { schluessel: 'depots', wert: historie.depots.length,
      name: 'Depots',
      was: 'ausgelesene Git-Depots, leere eingeschlossen' },
    { schluessel: 'zweige', wert: historie.summe.zweige,
      name: 'Zweige',
      was: 'alle Zweige aller Depots, die Hauptzweige mitgezählt' },
  ];
}

/** Die durchgehende Arbeit ab einem Stichtag: Arbeitstage, Kalendertage und
 *  jede Unterbrechung einzeln.
 *
 *  Diese Zahlen stehen als PROSA in `FORSCHUNGSFOERDERUNG.md` und im
 *  Frageblatt für den Steuerberater. Am 2026-08-26 waren dort drei davon
 *  falsch: 27 statt 26 Tage Anlaufpause, 140 statt 141 Kalendertage und
 *  „genau eine Lücke von vier Tagen" statt neun Unterbrechungen mit höchstens
 *  drei Tagen. Die dritte war die gefährlichste: neben dem Text liegt die
 *  Tages-Tabelle, in der jeder nachzählen kann.
 *
 *  Prosa lässt sich nicht erzeugen. Sie lässt sich aber nachrechnen, und
 *  genau das tut `smoke_zahlen.mjs` damit. */
export function durchgehendAb(commits, stichtag) {
  const tage = arbeitsTage(commits).filter((t) => t >= stichtag);
  if (!tage.length) return null;
  const letzter = tage[tage.length - 1];
  const tag = 86400000;
  const kalender = Math.round(
    (Date.parse(letzter) - Date.parse(stichtag)) / tag) + 1;   // beide mitgezählt
  const luecken = [];
  for (let i = 1; i < tage.length; i++) {
    const ohne = Math.round((Date.parse(tage[i]) - Date.parse(tage[i - 1])) / tag) - 1;
    if (ohne > 0) luecken.push({ ohne, von: tage[i - 1], bis: tage[i] });
  }
  return {
    arbeitstage: tage.length, kalendertage: kalender, erster: tage[0], letzter,
    luecken, laengste: luecken.reduce((a, l) => Math.max(a, l.ohne), 0),
  };
}

/** Die Tage ohne einen einzigen Eintrag zwischen zwei Arbeitstagen. */
export function pauseZwischen(commits, von, bis) {
  const tage = arbeitsTage(commits).filter((t) => t > von && t < bis);
  if (tage.length) return null;                    // keine Pause, es wurde gearbeitet
  return Math.round((Date.parse(bis) - Date.parse(von)) / 86400000) - 1;
}
