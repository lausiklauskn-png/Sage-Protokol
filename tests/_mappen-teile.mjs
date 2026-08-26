/* _mappen-teile.mjs — die geteilten Messwerkzeuge der Mappen-Proben.
 *
 * KEINE eigene Probe. Der Läufer nimmt nur `smoke_*`, deshalb der Unterstrich.
 *
 * ── WARUM DAS HIER STEHT UND NICHT ZWEIMAL ────────────────────────────────
 *
 * Seit dem 2026-08-26 gibt es zwei Mappen (`antragsmappe.html` und
 * `unterlagen.html`) und damit zwei Proben. Die Nachzählung „steht jede
 * Quellzeile wirklich in der Ansicht?" trägt DREI reparierte Messfehler, jeder
 * davon hat einmal Stunden gekostet:
 *
 *   · Auszeichnungs-Tags mitten im Wort durch ein Leerzeichen zu ersetzen
 *     meldete 320 Zeilen als fehlend, die alle dastanden.
 *   · den Unterstrich als Auszeichnung zu entfernen zerriss Dateinamen wie
 *     `MEILENSTEIN_SEMANTISCHE_SUCHE.md` und ergab 70 weitere Fehlalarme.
 *   · Code-Blöcke mitzuzählen klagte Sternchen und Rauten an, die dort
 *     INHALT sind.
 *
 * Eine zweite Fassung dieser Logik hätte alle drei Fehler wieder, oder
 * schlimmer: sie hätte sie NICHT und würde deshalb etwas anderes messen als
 * die erste. Beide Proben wären grün, und eine von beiden läge falsch.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/* ── Klartext der Ansicht ──────────────────────────────────────────────────
   Skript und Stil fliegen raus — sie sind kein Text, den jemand liest, und
   ihre Zeichen würden die Nachzählung verwässern. */
const ENTITAET = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  middot: '·', mdash: '—', ndash: '–', auml: 'ä',
  ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö',
  Uuml: 'Ü', szlig: 'ß',
};
export const entziffern = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&([a-zA-Z]+);/g, (_, n) => (n in ENTITAET ? ENTITAET[n] : '&' + n + ';'));

/* EIN UNTERSCHIED, DER HIER ENTSCHEIDET: Auszeichnungs-Tags mitten im Wort
   (fett, kursiv, Verweis, Code) werden ERSATZLOS entfernt, alles andere durch
   ein Leerzeichen. Die erste Fassung machte aus jedem Tag ein Leerzeichen —
   aus "keine KIs<\/strong>." wurde "keine KIs ." mit Lücke, und die
   Nachzählung meldete 320 Zeilen als fehlend, die alle dastanden. Ein
   Wächter, der aus dem eigenen Messfehler heraus rot wird, ist genauso
   wertlos wie einer, der blind grün ist. */
const INLINE = /<\/?(a|strong|em|code|span|sup|sub)\b[^>]*>/gi;

export const ohneTags = (s, mitCode = true) => {
  let t = s
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  if (!mitCode) t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ' ');
  return t
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(INLINE, '')
    .replace(/<[^>]+>/g, ' ');
};

export const norm = (s) => s.replace(/\s+/g, ' ').trim();

/* Eine Quellzeile auf das reduzieren, was ein Leser davon sieht. Alles,
   was hier abgeschnitten wird, ist Auszeichnung — nie Inhalt. */
export function klartext(zeile) {
  let s = zeile;
  s = s.replace(/^\s{0,8}>\s?/, '');                     // Zitatzeichen
  s = s.replace(/^\s*(#{1,6})\s+/, '');                  // Überschrift
  s = s.replace(/^(\s*)([-*+]|\d+\.)\s+/, '');           // Listenpunkt
  s = s.replace(/^\[( |x|X)\]\s+/, '');                  // Häkchen
  s = s.replace(/\[([^\]]*)\]\([^)\s]+(?:\s+"[^)]*")?\)/g, '$1');  // Verweis
  s = s.replace(/<(https?:\/\/[^>\s]+)>/g, '$1');        // nackte Adresse
  s = s.replace(/\|/g, ' ');                             // Tabellen-Striche
  // NUR Sternchen und Backtick. Der Unterstrich sieht wie eine Auszeichnung
  // aus, ist in diesen Quellen aber Teil von Dateinamen
  // (MEILENSTEIN_SEMANTISCHE_SUCHE.md, __20k.html). Ihn mitzuentfernen
  // liess 70 Zeilen als fehlend erscheinen, die alle dastanden.
  /* CODE-ABSCHNITTE ZUERST BEISEITE. Sonst fällt auch das Sternchen INNERHALB
     eines Code-Abschnitts weg, und die Erwartung wird kürzer als die Ansicht.
     Gefunden am 2026-08-26 an `docs/historie/arbeitstage.*` im Frageblatt: der
     Wächter suchte „arbeitstage." und fand „arbeitstage.*", und meldete eine
     Zeile als fehlend, die vollständig dastand. Dieselbe Sorte Fehler wie beim
     Unterstrich in Dateinamen, nur ein Zeichen weiter. */
  const code = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    code.push(c);
    return '\u0000' + (code.length - 1) + '\u0000';
  });
  s = s.replace(/\*/g, '');                               // fett/kursiv
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => code[+i]);
  s = s.replace(/`/g, '');                                // übrige Backticks
  return norm(s);
}


/** Zählt nach, ob jede Quellzeile in der Ansicht steht.
 *  Gibt { quellen, geprueft, fehlend } zurück. */
export function vollstaendigkeit(html, wurzel) {
  const SICHT = norm(entziffern(ohneTags(html)));
  const quellen = [...html.matchAll(/<article[^>]*\sdata-quelle="([^"]+)"/g)]
    .map((m) => m[1]);

  let geprueft = 0;
  const fehlend = [];
  for (const pfad of quellen) {
    const zeilen = readFileSync(resolve(wurzel, pfad), 'utf-8').split('\n');
    let imCode = false;
    for (let n = 0; n < zeilen.length; n++) {
      const roh = zeilen[n];
      if (/^\s*```/.test(roh)) { imCode = !imCode; continue; }
      if (imCode) continue;
      if (!roh.trim()) continue;
      if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(roh)) continue;
      if (/^\s*\|[\s:|-]+\|?\s*$/.test(roh)) continue;
      const soll = entziffern(klartext(roh));
      if (!soll) continue;
      geprueft++;
      if (!SICHT.includes(soll)) {
        fehlend.push(pfad + ':' + (n + 1) + '  ' + soll.slice(0, 90));
      }
    }
  }
  return { quellen, geprueft, fehlend };
}
