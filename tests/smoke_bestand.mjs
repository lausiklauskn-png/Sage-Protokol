/* smoke_bestand.mjs, bewacht die Bestandsaufnahme und das April-Blatt.
 *
 * Lauf:  node tests/smoke_bestand.mjs
 *
 * ── DIE ZUSICHERUNGEN, DIE HIER AM MEISTEN WIEGEN ─────────────────────────
 *
 *   1. **Keine Zahl ohne Definition.** Am 2026-08-26 standen 5.823 und 5.775
 *      in derselben Mappe, beide „Einträge" genannt. Beide richtig, und für
 *      jeden, der sie nebeneinander liest, ein Widerspruch von 48.
 *   2. **Die Rekonstruktion sieht nie wie ein Protokoll aus.** Eine, die als
 *      solche gekennzeichnet ist, trägt in einem Antrag. Eine, die es
 *      verschweigt, kostet die Glaubwürdigkeit aller echten.
 *   3. **Was außerhalb der Depots liegt, steht drin.** Ein Werkzeug findet nur,
 *      was da ist. Eine Aufstellung, die verschweigt, wonach es gar nicht
 *      suchen kann, behauptet eine Vollständigkeit, die sie nicht hat.
 *   4. **Ein flacher Klon liefert keine Zeiträume.** Der erste Lauf am
 *      2026-08-26 meldete „LEHREN.md: 2026-08-22 bis 2026-08-22" für eine
 *      Datei mit Monaten an Geschichte. Nichts daran sah falsch aus.
 *
 * ── WIE HIER GEPRÜFT WIRD, UND WARUM NICHT ANDERS ─────────────────────────
 *
 * Wie bei `smoke_arbeitstage.mjs` zwei getrennte Teile. Eine Probe, die die
 * Rechnung NACHBAUT, prüft ihre eigene Rechnung und wäre grün, wenn beide
 * denselben Denkfehler machen.
 *
 *   A · Das Rechen-Modul an **erfundenen** Daten mit bekannter Antwort.
 *   B · Die Blätter gegen **dasselbe Modul**, an den echten Daten.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  monatVon, arbeitsTage, protokollTage, deckungJeMonat, arbeitJeDepot,
  protokollBeginn, kennzahlen,
} from '../tools/bestand-rechnen.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);
const BESTAND = P('docs/unterlagen/04_BESTAND.md');
const APRIL = P('docs/unterlagen/05_APRIL.md');

let rot = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

/* ═══ A · Die Regeln, an erfundenen Daten mit bekannter Antwort ═══════════ */

const c = (datum, zeit = '09:00', autor = 'Klaus', repo = 'X') =>
  ({ datum, zeit, autor, repo, betreff: 'Probe', plus: 1, minus: 0 });
const bot = (datum) => c(datum, '03:04', 'github-actions[bot]');

{
  gut(monatVon('2026-04-17') === '2026-04', 'ein Datum wird auf seinen Monat gekürzt');
}
{
  /* Drei Einträge an zwei Tagen, einer davon zeitgesteuert: zwei Arbeitstage,
     und der reine Bot-Tag zählt NICHT mit. */
  const t = arbeitsTage([c('2026-01-01'), c('2026-01-01', '10:00'), c('2026-01-02'), bot('2026-01-03')]);
  gut(t.length === 2 && t[0] === '2026-01-01' && t[1] === '2026-01-02',
    'ein Tag mit nur zeitgesteuerten Einträgen ist kein Arbeitstag',
    'gerechnet: ' + t.join(', '));
}
{
  /* Ein Dateiname mit MONAT statt Tag kann keinen Tag decken. */
  const t = protokollTage([
    '2026-05-14_bau-01-storage.md',
    '2026-08_puls-auslagerung.md',
    'BRIEFING_TEMPLATE.md',
    'screenshots',
  ]);
  gut(t.length === 1 && t[0] === '2026-05-14',
    'nur ein Dateiname mit vollem Datum zählt als Protokoll für einen Tag',
    'gerechnet: ' + JSON.stringify(t));
}
{
  /* Zwei Arbeitstage im selben Monat, einer gedeckt. */
  const d = deckungJeMonat(
    [c('2026-01-01'), c('2026-01-02'), c('2026-02-05')],
    ['2026-01-02_etwas.md']);
  const jan = d.find((x) => x.monat === '2026-01');
  gut(jan.tage === 2 && jan.mit === 1 && jan.ohne === 1,
    'die Deckung zählt Tage mit und ohne Protokoll getrennt',
    'gerechnet: ' + JSON.stringify(jan));
  gut(d.length === 2 && d[0].monat === '2026-01',
    'die Monate kommen in zeitlicher Reihenfolge');
  /* Ein Protokoll für einen Tag OHNE Arbeit erfindet keinen Arbeitstag. */
  const e = deckungJeMonat([c('2026-01-01')], ['2026-01-01_a.md', '2026-03-09_b.md']);
  gut(e.length === 1 && e[0].tage === 1,
    'ein Protokoll ohne Arbeitstag erzeugt keinen Monat');
}
{
  /* Die Zuordnung zum Depot ist die Zahl, die den April aufgelöst hat. */
  const a = arbeitJeDepot(
    [c('2026-04-06', '09:00', 'Klaus', 'App'), c('2026-04-07', '09:00', 'Klaus', 'App'),
     c('2026-04-08', '09:00', 'Klaus', 'Hub'), bot('2026-04-09'),
     c('2026-05-01', '09:00', 'Klaus', 'App')],
    '2026-04');
  gut(a.length === 2 && a[0].depot === 'App' && a[0].eintraege === 2 && a[1].eintraege === 1,
    'die Einträge eines Monats werden je Depot gezählt, absteigend',
    'gerechnet: ' + JSON.stringify(a));
  gut(!a.some((x) => x.depot === 'github-actions'),
    'zeitgesteuerte Einträge zählen auch hier nicht mit');
}
{
  gut(protokollBeginn(['2026-06-01_b.md', '2026-05-10_a.md']) === '2026-05-10',
    'der Protokoll-Beginn ist der früheste Tag, nicht der erste Dateiname');
  gut(protokollBeginn(['BRIEFING_TEMPLATE.md']) === null,
    'ohne ein einziges datiertes Protokoll gibt es keinen Beginn');
}
{
  /* Jede Kennzahl trägt ihre Definition. Das ist die Zusicherung, nicht die
     Zahl: zwei Zahlen ohne Definition sind ein Widerspruch. */
  const k = kennzahlen({
    commits: [c('2026-01-01'), c('2026-01-02'), bot('2026-01-03')],
    depots: [{ name: 'A' }], summe: { zweige: 7 },
  });
  const w = Object.fromEntries(k.map((x) => [x.schluessel, x.wert]));
  gut(w.eintraegeAlle === 3 && w.eintraegeHand === 2 && w.eintraegeAutomatisch === 1,
    'die drei Eintrags-Zahlen gehen ineinander auf (alle = Hand + zeitgesteuert)',
    'gerechnet: ' + JSON.stringify(w));
  gut(k.every((x) => x.name && x.was && x.was.length > 10),
    'jede Kennzahl trägt einen Namen UND eine Definition',
    'ohne Definition: ' + k.filter((x) => !x.was).map((x) => x.schluessel).join(', '));
  /* ZWEI KENNZAHLEN MIT DEMSELBEN NAMEN SIND GENAU DER FEHLER, GEGEN DEN
     DIESES BLATT GEBAUT IST. Die Gegenprobe hat das am 2026-08-26 gefunden:
     benennt man beide Eintrags-Zahlen „Einträge insgesamt", stehen weiter
     beide Werte im Blatt und jede Prüfung darauf bleibt grün. */
  const namen = k.map((x) => x.name);
  gut(new Set(namen).size === namen.length,
    'keine zwei Kennzahlen heißen gleich',
    'doppelt: ' + namen.filter((n, i) => namen.indexOf(n) !== i).join(', '));
}

/* ═══ B · Die Blätter gegen dasselbe Modul, an den echten Daten ═══════════ */

if (!existsSync(BESTAND) || !existsSync(APRIL)) {
  gut(false, 'die beiden Blätter liegen vor',
    'fehlt: ' + [BESTAND, APRIL].filter((p) => !existsSync(p)).join(' '));
} else {
  const bestand = readFileSync(BESTAND, 'utf-8');
  const april = readFileSync(APRIL, 'utf-8');
  const historie = JSON.parse(readFileSync(P('docs/historie/historie.json'), 'utf-8'));
  const namen = readdirSync(P('docs/sessions/archiv'));
  const de = (n) => n.toLocaleString('de-DE');

  /* 1 · Jede Kennzahl steht mit ihrem gerechneten Wert im Blatt. */
  for (const k of kennzahlen(historie)) {
    gut(bestand.includes('| **' + k.name + '** | ' + de(k.wert) + ' |'),
      'die Kennzahl „' + k.name + '" steht mit dem gerechneten Wert ' + de(k.wert) + ' im Blatt');
  }

  /* 2 · Und zwar jede MIT Definition. Eine Zahl ohne sie ist der Widerspruch,
         wegen dem dieses Blatt überhaupt entstanden ist. */
  const ohneDef = kennzahlen(historie).filter((k) => !bestand.includes(k.was));
  gut(ohneDef.length === 0,
    'jede Kennzahl trägt ihre Definition auch im Blatt',
    'ohne: ' + ohneDef.map((k) => k.name).join(', '));

  /* 3 · Die Deckung je Monat stimmt mit dem Modul überein, Zeile für Zeile. */
  const deckung = deckungJeMonat(historie.commits, namen);
  const falsch = deckung.filter((d) =>
    !bestand.includes('| ' + d.monat + ' | ' + d.tage + ' | ' + d.mit + ' | ' + d.ohne + ' |'));
  gut(falsch.length === 0,
    'alle ' + deckung.length + ' Monatszeilen geben wieder, was das Modul rechnet',
    'abweichend: ' + falsch.map((d) => d.monat).join(', '));

  /* 4 · Die Summenzeile ist wirklich die Summe, nicht eine zweite Zählung. */
  const tage = deckung.reduce((a, d) => a + d.tage, 0);
  const mit = deckung.reduce((a, d) => a + d.mit, 0);
  gut(bestand.includes('| **zusammen** | **' + tage + '** | **' + mit + '** | **' + (tage - mit) + '**'),
    'die Summenzeile ist die Summe der Monatszeilen (' + tage + ' Tage, ' + mit + ' gedeckt)');

  /* 5 · Der Protokoll-Beginn ist gerechnet, nicht hingeschrieben. */
  gut(bestand.includes(protokollBeginn(namen)) && april.includes(protokollBeginn(namen)),
    'beide Blätter nennen den gerechneten Protokoll-Beginn ' + protokollBeginn(namen));

  /* 6 · Die April-Zahlen je Depot stimmen. */
  const apr = arbeitJeDepot(historie.commits, '2026-04');
  const aprFalsch = apr.filter((d) => !april.includes('| ' + d.eintraege + ' |'));
  gut(aprFalsch.length === 0 && apr.length > 0,
    'die ' + apr.length + ' April-Depots stehen mit ihren gerechneten Zahlen im Blatt',
    'fehlend: ' + aprFalsch.map((d) => d.depot).join(', '));

  /* 7 · DIE ZUSICHERUNG, DIE AM MEISTEN WIEGT: die Rekonstruktion sagt, dass
         sie eine ist, und zwar VOR den Zahlen, nicht in einer Fußnote. */
  const kopf = april.slice(0, april.indexOf('## 1'));
  gut(/[Rr]ekonstruktion, kein Protokoll/.test(kopf),
    'das April-Blatt nennt sich im Kopf eine Rekonstruktion, kein Protokoll');
  gut(/nicht gewinnen|steht nirgends/.test(kopf),
    'und sagt im Kopf, was daraus NICHT zu gewinnen ist');

  /* 8 · Was außerhalb der Depots liegt, ist benannt und als von Hand geführt
         gekennzeichnet. Vier Posten, und keiner darf still verschwinden. */
  for (const wort of ['Rechnungen', 'Fahrtenbuch', 'Stechuhr', 'Chat-Verläufe']) {
    gut(bestand.includes(wort),
      'der Posten außerhalb der Depots „' + wort + '" ist benannt');
  }
  const draussen = bestand.slice(bestand.indexOf('## 4 · Was außerhalb'),
    bestand.indexOf('## 5 · Die Protokoll-Deckung'));
  gut(/von Hand/.test(draussen),
    'und der Abschnitt sagt, dass diese Posten von Hand geführt sind',
    'geprüft wird im Abschnitt selbst, nicht irgendwo im Blatt');

  /* 9 · Beide Ordnungen sind da, und sie zeigen DIESELBE Liste. Zwei Listen
         wären eine Drift-Quelle mit Ansage. */
  gut(/nach Vorgehen geordnet/.test(bestand) && /chronologisch/i.test(bestand),
    'das Blatt zeigt beide Ordnungen, nach Vorgehen und chronologisch');
  const zeilenIn = (abschnitt) => (abschnitt.match(/^\| \*\*/gm) || []).length;
  const aVor = bestand.indexOf('## 2 · Die Unterlagen');
  const aChr = bestand.indexOf('## 3 · Dieselben Unterlagen');
  const aDra = bestand.indexOf('## 4 · Was außerhalb');
  const nVor = zeilenIn(bestand.slice(aVor, aChr));
  const nChr = (bestand.slice(aChr, aDra).match(/^\| \d+ \| \*\*/gm) || []).length;
  gut(nVor === nChr && nVor > 0,
    'beide Ordnungen führen gleich viele Posten (' + nVor + ')',
    'nach Vorgehen: ' + nVor + ', chronologisch: ' + nChr);

  /* 10 · DER ZEITRAUM KOMMT AUS GIT, NICHT AUS DEM HEUTIGEN DATUM.
          Der erste Lauf am 2026-08-26 lief auf einem flachen Klon und gab
          für jede Datei einen abgeschnittenen Zeitraum aus. Nichts daran sah
          falsch aus. Gemessen wird deshalb unabhängig: die Probe fragt Git
          selbst nach dem ersten Stand des Protokoll-Archivs und verlangt
          genau diesen Tag im Blatt. Eine gestempelte oder am Klon
          abgeschnittene Angabe fällt damit um. */
  if (existsSync(P('.git/shallow'))) {
    gut(false, 'der Klon ist tief genug, um Zeiträume zu messen',
      'flacher Klon: jeder Zeitraum wäre am Klon abgeschnitten. '
      + 'Erst  git fetch --unshallow  ausführen.');
  } else {
    const ausGit = execFileSync('git',
      ['log', '--format=%ad', '--date=short', '--', 'docs/sessions/archiv'],
      { cwd: WURZEL, encoding: 'utf-8' }).trim().split('\n');
    const erster = ausGit[ausGit.length - 1];
    /* GEMESSEN WIRD IN DER ZEILE, ZU DER DIE AUSSAGE GEHÖRT. Die erste
       Fassung suchte den Tag irgendwo im Blatt und fand ihn beim
       Protokoll-Beginn in Abschnitt 5, der aus einer ANDEREN Rechnung kommt.
       Der Fall blieb dadurch durchgerutscht, obwohl jede Zeitraum-Angabe der
       Tabelle gestempelt war. */
    const zeile = (bestand.match(/^\| \*\*Sitzungsprotokolle\*\*.*$/m) || [''])[0];
    gut(zeile.includes(erster),
      'der erste Stand des Protokoll-Archivs steht in SEINER Zeile (' + erster + ')',
      'Git sagt ' + erster + ', in der Zeile steht: ' + (zeile.slice(0, 120) || 'keine Zeile'));
  }

  /* 11 · Das Blatt sagt, was es nicht kann. Ohne diesen Absatz liest sich
          „Deckung 38 %" wie ein Urteil über die Güte der Dokumentation. */
  gut(/Untergrenze für Dokumentation, kein\s+Maß für ihre Güte/.test(bestand),
    'das Blatt sagt, dass Deckung kein Maß für die Güte ist');
}

console.log('\nsmoke_bestand: ' + (rot === 0 ? 'alles grün' : rot + ' ROT'));
process.exit(rot === 0 ? 0 : 1);
