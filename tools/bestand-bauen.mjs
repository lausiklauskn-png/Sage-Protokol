/* bestand-bauen.mjs, schreibt die Bestandsaufnahme und das April-Blatt.
 *
 *   docs/unterlagen/04_BESTAND.md   was es gibt, wo, welcher Zeitraum, welche Lücke
 *   docs/unterlagen/05_APRIL.md     der April, aus den Einträgen rekonstruiert
 *
 * Beide werden ERZEUGT. Der Bestand ändert sich, und eine Liste von Hand ist
 * am Tag nach dem Schreiben falsch. Zeitraum und Umfang kommen aus `git log`
 * und aus der Datei selbst, nicht aus dem Gedächtnis.
 *
 * Aufruf:  node tools/bestand-bauen.mjs
 */

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  kennzahlen, deckungJeMonat, arbeitJeDepot, protokollBeginn, protokollTage,
} from './bestand-rechnen.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...t) => join(WURZEL, ...t);
const heute = new Date().toISOString().slice(0, 10);

const historie = JSON.parse(readFileSync(P('docs/historie/historie.json'), 'utf-8'));
const archivNamen = readdirSync(P('docs/sessions/archiv'));

/* ── EIN FLACHER KLON LIEFERT DATEN, DIE WIE MESSUNGEN AUSSEHEN ───────────
   Am 2026-08-26 stand im ersten Lauf „LEHREN.md: 2026-08-22 bis 2026-08-22".
   Die Datei gibt es seit Monaten. Der Container-Klon war flach und trug nur
   die letzten fünfzig Einträge, und jeder Zeitraum darin war am Klon
   abgeschnitten statt an der Wirklichkeit. Nichts daran sah falsch aus.

   Dieselbe Falle steht schon in der Historie: achtzehn der dreiunddreißig
   Klone waren flach und wurden vor dem Auslesen vervollständigt. Hier hatte
   niemand daran gedacht. Deshalb bricht das Werkzeug jetzt ab, statt eine
   abgeschnittene Zahl auszugeben. */
if (existsSync(P('.git/shallow'))) {
  console.error('ABBRUCH: der Klon ist flach. Jeder Zeitraum wäre am Klon');
  console.error('abgeschnitten statt an der Wirklichkeit, und sähe richtig aus.');
  console.error('Erst  git fetch --unshallow  ausführen, dann neu bauen.');
  process.exit(2);
}

/* ── Was aus Git zu holen ist ──────────────────────────────────────────────
   Ein Zeitraum, den man aus `git log` liest, veraltet nicht. Einer, den man
   hinschreibt, veraltet am nächsten Tag und sieht dabei genauso aus. */
function zeitraum(pfade) {
  const vorhanden = pfade.filter((p) => existsSync(P(p)));
  if (!vorhanden.length) return null;
  try {
    /* `--follow` verträgt genau EINEN Pfad und bricht sonst ab. Der Abbruch
       lief in den catch und machte aus jedem mehrteiligen Posten ein
       „nicht ermittelt", das wie eine echte Auskunft aussah. */
    const folgen = vorhanden.length === 1 ? ['--follow'] : [];
    const roh = execFileSync('git',
      ['log', ...folgen, '--format=%ad', '--date=short', '--', ...vorhanden],
      { cwd: WURZEL, encoding: 'utf-8' }).trim();
    if (!roh) return null;
    const z = roh.split('\n');
    return { von: z[z.length - 1], bis: z[0], staende: z.length };
  } catch { return null; }
}

function umfang(pfade) {
  let bytes = 0, zeilen = 0, da = 0;
  for (const p of pfade) {
    if (!existsSync(P(p))) continue;
    da++;
    bytes += statSync(P(p)).size;
    if (/\.(md|html|csv|json)$/.test(p)) {
      try { zeilen += readFileSync(P(p), 'utf-8').split('\n').length; } catch { /* binär */ }
    }
  }
  return { bytes, zeilen, da, von: pfade.length };
}

const kb = (b) => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB';

/* ── Der Bestand ───────────────────────────────────────────────────────────
   `schritt` ist die Vorgehens-Reihenfolge: was man zuerst in die Hand nimmt.
   `beginn` ist die chronologische, also wann die Unterlage entstanden ist.
   Beide Ordnungen zeigen dieselbe Liste, und deshalb steht sie hier EINMAL. */
const BESTAND = [
  { name: 'Sitzungsprotokolle',
    pfade: ['docs/sessions/archiv'],
    schritt: 5, rolle: 'Arbeitsspur',
    luecke: null },
  { name: 'Fahrplan Forschungsgelder',
    pfade: ['docs/FORSCHUNGSFOERDERUNG.md'],
    schritt: 1, rolle: 'Wegbeschreibung, privat',
    luecke: null },
  { name: 'Die Schritte, abhakbar',
    pfade: ['docs/unterlagen/01_SCHRITTE.md'],
    schritt: 2, rolle: 'Reihenfolge, privat',
    luecke: null },
  { name: 'Frageblatt Steuerberater',
    pfade: ['docs/STEUERBERATER_FRAGEN.md', 'docs/frageblatt.html', 'docs/frageblatt.pdf'],
    schritt: 3, rolle: 'zum Mitnehmen',
    luecke: 'Die Kleinunternehmerregelung steht nur als Aufzählungspunkt unter Frage 7. '
      + 'Der Fragebogen zur steuerlichen Erfassung verlangt dafür ein Kreuz.' },
  { name: 'Vorbereitung Finanzamt',
    pfade: ['docs/unterlagen/03_FINANZAMT.md'],
    schritt: 4, rolle: 'zum Danebenlegen',
    luecke: 'Ohne ELSTER-Zertifikat geht der Fragebogen nicht ab. Das Zertifikat '
      + 'kommt per Brief und hat als einziger Schritt eine Vorlaufzeit.' },
  { name: 'Arbeitszeitnachweis, Tag für Tag',
    pfade: ['docs/historie/arbeitstage.html', 'docs/historie/arbeitstage-tage.csv',
            'docs/historie/arbeitstage-taetigkeiten.csv', 'docs/historie/arbeitstage.pdf'],
    schritt: 6, rolle: 'Nachweis gegenüber dem Finanzamt',
    luecke: 'Gemessen wird die Spanne zwischen dem ersten und dem letzten Eintrag '
      + 'eines Tages, nicht die geleistete Arbeit. Was vor dem ersten Eintrag '
      + 'geschah, ist nicht erfasst.' },
  { name: 'Historie der Zusammenarbeit',
    pfade: ['docs/historie/historie.html', 'docs/historie/historie.json'],
    schritt: 7, rolle: 'Gesamtbild',
    luecke: 'Die Einordnung eines Eintrags geschieht an seinen Wörtern. Alle Zahlen '
      + 'zu den Marken sind deshalb Untergrenzen, keine Vollerhebung.' },
  { name: 'Entstehung, Klaus’ Darstellung',
    pfade: ['docs/papers/ENTSTEHUNG.md'],
    schritt: 8, rolle: 'Rohstoff für den Antrag',
    luecke: 'Eine Schilderung aus dem Gedächtnis, aufgezeichnet am 2026-08-23. '
      + 'Wo sie gegen die Einträge prüfbar ist, hält sie; der Rest ist Darstellung.' },
  { name: 'Paper A, Regeln und Grundsätze',
    pfade: ['docs/papers/PAPER_A_regeln-und-grundsaetze.md'],
    schritt: 9, rolle: 'einreichbar',
    luecke: 'Der Werkzeug-Widerspruch ist offen und gehört vor die Zenodo-Nummer.' },
  { name: 'Forschungskorpus',
    pfade: ['docs/FORSCHUNGSKORPUS.md'],
    schritt: 10, rolle: 'einreichbar',
    luecke: null },
  { name: 'Werkstatt-Material aus Kimhub',
    pfade: ['docs/werkstatt'],
    schritt: 11, rolle: 'einreichbar, Momentaufnahme',
    luecke: 'Byte-Kopien mit Prüfsummen. Sie laufen still vom Original weg, '
      + 'sobald dort etwas geändert und hier nicht neu kopiert wird.' },
  { name: 'Die beiden SBKIM-Papers, DE und EN',
    pfade: ['docs/papers/sbkim-paper-de.html', 'docs/papers/sbkim-paper-en.html'],
    schritt: 12, rolle: 'Vorabveröffentlichung v0.1',
    luecke: 'Datiert auf Mai 2026 und in `INTERFACES.md` mit Paragraphennummern '
      + 'zitiert. Eine Änderung daran braucht eine v0.2, keine stille Nachbesserung.' },
  { name: 'Meilensteine mit Bild',
    pfade: ['docs/meilenstein', 'docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md',
            'docs/MEILENSTEIN_VON_DER_HUELLE_ZUM_INHALT.md'],
    schritt: 13, rolle: 'datierter Beleg',
    luecke: null },
  { name: 'Die Lehren',
    pfade: ['docs/LEHREN.md'],
    schritt: 14, rolle: 'Arbeitsweise, belegt',
    /* Die Datei ist jünger als ihr Inhalt: sie wurde am 2026-08-22 aus
       `CLAUDE.md` herausgelöst (#897, 1291 auf 330 Zeilen). Ohne diese
       Angabe liest sich „2026-08-22 bis 2026-08-22" wie „drei Tage alt". */
    vorlaeufer: 'am 2026-08-22 aus `CLAUDE.md` herausgelöst; der Inhalt reicht bis 2026-05 zurück',
    luecke: null },
];

/* ── Was NICHT in einem Depot liegt ────────────────────────────────────────
   Ein Werkzeug findet nur, was da ist. Eine Aufstellung, die verschweigt,
   wonach es gar nicht suchen kann, behauptet eine Vollständigkeit, die sie
   nicht hat. Diese vier stehen deshalb von Hand da, ausdrücklich als solche. */
const AUSSERHALB = [
  ['Belege, 75 Rechnungen', 'Kimhub, `.gitignore`, nur auf Klaus’ Gerät',
   '2026-03-13 bis 2026-08-04',
   'Zwei Währungen, Euro und Dollar, getrennt gerechnet. Neun Rechnungsnummern fehlen.'],
  ['Fahrtenbuch der Werkstatt', 'Kimhub, `.gitignore`, nur auf Klaus’ Gerät',
   'ab 2026-08-22',
   'Beginnt erst am 22.08. Für die Zeit davor gibt es keine Kostenaufzeichnung je Fahrt.'],
  ['Stechuhr der Werkstatt', 'Kimhub, Browser-Speicher',
   '2026-08-22',
   'Zweimal gedrückt, zusammen 16 Sekunden. Als Zeitquelle unbrauchbar, '
   + 'und das ist der Grund, aus dem der Nachweis aus den Einträgen gerechnet wird.'],
  ['Chat-Verläufe', 'außerhalb von Git',
   'unbekannt',
   'Umfang und Form sind nicht erhoben. Sie sind die einzige Quelle für das, '
   + 'was besprochen und verworfen wurde, und der einzige Posten dieser Liste, '
   + 'den keine Sitzung allein klären kann.'],
];

/* ── Blatt 1: die Bestandsaufnahme ────────────────────────────────────────── */

const zahlen = kennzahlen(historie);
const deckung = deckungJeMonat(historie.commits, archivNamen);
const beginn = protokollBeginn(archivNamen);
const gedeckt = deckung.reduce((a, d) => a + d.mit, 0);
const tageGesamt = deckung.reduce((a, d) => a + d.tage, 0);

const zeilen = BESTAND.map((b) => ({ ...b, z: zeitraum(b.pfade), u: umfang(b.pfade) }));

function tabelle(liste) {
  const t = ['| Was | Wo | Stände dieser Datei | Umfang | Lücke |', '|---|---|---|---|---|'];
  for (const b of liste) {
    const wo = b.pfade.map((p) => '`' + p + '`').join(' · ');
    const zr = (b.z ? b.z.von + ' bis ' + b.z.bis : 'nicht ermittelt')
      + (b.vorlaeufer ? '<br>' + b.vorlaeufer : '');
    const um = b.u.da === 0 ? '**fehlt**'
      : kb(b.u.bytes) + (b.u.zeilen ? ', ' + b.u.zeilen.toLocaleString('de-DE') + ' Zeilen' : '');
    t.push('| **' + b.name + '** | ' + wo + ' | ' + zr + ' | ' + um + ' | '
      + (b.luecke || 'keine benannt') + ' |');
  }
  return t.join('\n');
}

const nachSchritt = [...zeilen].sort((a, b) => a.schritt - b.schritt);
const nachZeit = [...zeilen].sort((a, b) => {
  const av = a.z ? a.z.von : '9999', bv = b.z ? b.z.von : '9999';
  return av.localeCompare(bv) || a.name.localeCompare(b.name);
});

const bestandMd = `# Bestandsaufnahme: was dokumentiert ist, und wo es aufhört

**Erzeugt am ${heute}** von \`tools/bestand-bauen.mjs\`. Zeitraum und Umfang
kommen aus \`git log\` und aus den Dateien selbst. Wer diese Datei von Hand
ändert, verliert die Änderung beim nächsten Lauf.

> **Warum sie erzeugt wird.** Der Bestand ändert sich. Eine Liste von Hand ist
> am Tag nach dem Schreiben falsch und sieht dabei genauso aus wie eine richtige.

---

## 1 · Die Kennzahlen, jede mit ihrer Definition

Zwei Zahlen für dieselbe Sache sind ein Widerspruch, sobald jemand sie
nebeneinander liest. Am ${heute} standen ${zahlen[0].wert.toLocaleString('de-DE')} und
${zahlen[1].wert.toLocaleString('de-DE')} in derselben Mappe, beide „Einträge"
genannt. Beide waren richtig. Deshalb trägt hier jede Zahl, was sie zählt.

| Kennzahl | Wert | Was genau gezählt wird |
|---|---|---|
${zahlen.map((k) => '| **' + k.name + '** | ' + k.wert.toLocaleString('de-DE') + ' | ' + k.was + ' |').join('\n')}

Die Differenz zwischen den ersten beiden Zeilen sind genau die
${zahlen[2].wert} zeitgesteuerten Läufe. Wer die Arbeitszeit rechnet, nimmt die
zweite Zahl; wer den Umfang der Historie angibt, die erste.

## 2 · Die Unterlagen, nach Vorgehen geordnet

In dieser Reihenfolge nimmt man sie in die Hand.

> **Die Spalte misst die Datei, nicht den Inhalt.** Wer eine Datei aus einer
> anderen herauslöst, bekommt ein junges Datum für einen alten Text. Wo das
> vorkommt, steht es in der Zelle dabei.

${tabelle(nachSchritt)}

## 3 · Dieselben Unterlagen, chronologisch

Nach dem Tag, an dem der erste Stand davon abgelegt wurde. Dieselbe Liste,
andere Ordnung, und sie zeigt etwas anderes: woran zuerst gearbeitet wurde.

> **Hier stand bis zum 2026-08-26 eine Spalte „Stände".** Sie zählte, wie oft
> ein Posten geändert wurde, und für das Protokoll-Archiv war das die Zahl der
> Sitzungen: sie stieg mit **jedem** Commit, der dort etwas ablegte, also am
> Ende jeder Sitzung. Das Blatt war damit nach jedem Abschluss veraltet, und
> der Wächter meldete das zu Recht.
>
> **Eine Kennzahl, die sich bei jedem Abschluss selbst ungültig macht, ist
> keine.** Sie erzwang einen zusätzlichen Commit nach dem letzten, und wer ihn
> vergaß, hinterließ der nächsten Sitzung eine rote Probe ohne Fehler dahinter.
> Die Spalte ist heraus. Die Ordnung dieser Tabelle steht in den **Daten**, und
> die ändern sich nicht mehr.

| Nr. | Was | erster Stand | letzter Stand |
|---|---|---|---|
${nachZeit.map((b, i) => '| ' + (i + 1) + ' | **' + b.name + '** | '
  + (b.z ? b.z.von : 'unbekannt') + ' | ' + (b.z ? b.z.bis : 'unbekannt') + ' |').join('\n')}

## 4 · Was außerhalb der Depots liegt

Ein Werkzeug findet nur, was in einem Depot steht. Diese vier Posten stehen
deshalb **von Hand** hier, und ihre Zeiträume sind nicht gerechnet, sondern
angegeben.

| Was | Wo | Zeitraum | Was daran fehlt |
|---|---|---|---|
${AUSSERHALB.map((a) => '| **' + a[0] + '** | ' + a[1] + ' | ' + a[2] + ' | ' + a[3] + ' |').join('\n')}

## 5 · Die Protokoll-Deckung, Monat für Monat

Die Frage lautete: fällt die Dokumentation ab, oder wurden die Sitzungen nur
länger? Beides ergibt dieselbe fallende Kurve, wenn man Einträge je Protokoll
zählt. **Tage lassen sich dagegen zählen**, und das ist die Antwort.

| Monat | Arbeitstage | mit Protokoll | ohne | Deckung |
|---|---|---|---|---|
${deckung.map((d) => '| ' + d.monat + ' | ' + d.tage + ' | ' + d.mit + ' | ' + d.ohne
  + ' | ' + Math.round(d.mit / d.tage * 100) + ' % |').join('\n')}
| **zusammen** | **${tageGesamt}** | **${gedeckt}** | **${tageGesamt - gedeckt}** | **${Math.round(gedeckt / tageGesamt * 100)} %** |

Das erste Protokoll überhaupt stammt vom **${beginn}**. Vorher gab es die
Praxis nicht, in keinem Depot. Was davor liegt, ist deshalb keine Lücke in der
Ablage, sondern eine Zeit ohne diese Ablage. Der Unterschied ist wichtig: das
eine wäre ein Versäumnis, das andere ist ein Datum.

## 6 · Was dieses Blatt nicht kann

Es zählt Dateien und Einträge. Es weiß nicht, ob ein Protokoll gut ist, ob es
den Tag trifft, den es überschreibt, oder ob an einem gedeckten Tag noch drei
andere Dinge geschahen. **Deckung ist eine Untergrenze für Dokumentation, kein
Maß für ihre Güte.**
`;

writeFileSync(P('docs/unterlagen/04_BESTAND.md'), bestandMd, 'utf-8');
console.log('geschrieben: docs/unterlagen/04_BESTAND.md');
console.log('  Posten: ' + zeilen.length + ' aus Git · ' + AUSSERHALB.length + ' von Hand');

/* ── Blatt 2: der April ───────────────────────────────────────────────────── */

const aprilDepots = arbeitJeDepot(historie.commits, '2026-04');
const aprilSumme = aprilDepots.reduce((a, d) => a + d.eintraege, 0);
const aprilTage = deckung.find((d) => d.monat === '2026-04');
const aprilCommits = historie.commits
  .filter((c) => c.datum.startsWith('2026-04'))
  .sort((a, b) => a.datum.localeCompare(b.datum) || a.zeit.localeCompare(b.zeit));

const jeTag = new Map();
for (const c of aprilCommits) {
  if (!jeTag.has(c.datum)) jeTag.set(c.datum, []);
  jeTag.get(c.datum).push(c);
}

const aprilMd = `# April 2026, aus den Einträgen rekonstruiert

> **Das ist eine Rekonstruktion, kein Protokoll.** Sie ist aus den
> ${aprilSumme} Einträgen des Monats gemacht und sagt, **was** geschah, mit Datum
> und Uhrzeit. Was besprochen, verworfen und warum entschieden wurde, steht
> nirgends und lässt sich daraus nicht gewinnen. Eine Rekonstruktion, die als
> solche gekennzeichnet ist, trägt in einem Antrag. Eine, die wie ein Protokoll
> aussieht, kostet die Glaubwürdigkeit aller echten.

**Erzeugt am ${heute}** von \`tools/bestand-bauen.mjs\`.

---

## 1 · Warum für diesen Monat kein Protokoll vorliegt

Der April hat ${aprilSumme} Einträge und kein einziges Sitzungsprotokoll. Das sah
nach der größten Lücke der ganzen Ablage aus. Die Zahl daneben löst es auf:

| Depot | Einträge im April |
|---|---|
${aprilDepots.map((d) => '| ' + (d.depot === 'Sage-Protokol' ? '**Sage-Protokol**' : d.depot)
  + ' | ' + d.eintraege + ' |').join('\n')}

**Die Arbeit lag im April nicht dort, wo die Protokollpflicht gilt.** Sie ist
eine Regel von Sage-Protokol, und Sage hatte in diesem Monat
${aprilDepots.find((d) => d.depot === 'Sage-Protokol')?.eintraege ?? 0} Eintrag. Gearbeitet
wurde an den Apps, und deren Verfassungen verlangen eine Bau-Prüfliste, kein
Sitzungsprotokoll.

Das erste Protokoll überhaupt stammt vom **${beginn}**, und in den App-Depots
beginnt die Praxis Ende Mai. **Im April gab es sie nirgends.**

> Der Befund davor verglich netzweite Einträge gegen Protokolle eines einzigen
> Depots. Beide Zahlen waren richtig, ihr Verhältnis war es nicht.
> **Eine Differenz aus zwei ungleichen Messungen ist keine Messung.**

## 2 · Was der Monat enthält

| | |
|---|---|
| Zeitraum | ${aprilCommits[0].datum} bis ${aprilCommits[aprilCommits.length - 1].datum} |
| Arbeitstage | ${aprilTage.tage} |
| Einträge | ${aprilSumme} |
| Depots | ${aprilDepots.length} |

## 3 · Tag für Tag

Je Tag der Zeitraum vom ersten bis zum letzten Eintrag, die Zahl der Einträge
und die berührten Depots. Die Betreffzeilen stehen vollständig im
Arbeitszeitnachweis; hier steht der Überblick.

| Tag | erster | letzter | Einträge | Depots |
|---|---|---|---|---|
${[...jeTag.keys()].sort().map((t) => {
  const l = jeTag.get(t);
  const d = [...new Set(l.map((c) => c.repo))].join(', ');
  return '| ' + t + ' | ' + l[0].zeit + ' | ' + l[l.length - 1].zeit + ' | ' + l.length + ' | ' + d + ' |';
}).join('\n')}

## 4 · Was hier fehlt und nicht zu beschaffen ist

Die Einträge sagen, welche Datei wann wie geändert wurde. Sie sagen nicht,
welche Wege verworfen wurden, woran eine Sitzung scheiterte und warum ein
Ansatz aufgegeben wurde. Diese Auskunft steckt in den Chat-Verläufen außerhalb
von Git, deren Umfang nicht erhoben ist.

**Das ist die eigentliche Lücke des Monats.** Sie ist nicht die fehlende Datei,
sondern die fehlende Begründung, und sie ist auch mit einer perfekten Ablage
nicht rückwirkend zu füllen.
`;

writeFileSync(P('docs/unterlagen/05_APRIL.md'), aprilMd, 'utf-8');
console.log('geschrieben: docs/unterlagen/05_APRIL.md');
console.log('  April: ' + aprilSumme + ' Einträge an ' + aprilTage.tage + ' Tagen, '
  + aprilDepots.length + ' Depots');
