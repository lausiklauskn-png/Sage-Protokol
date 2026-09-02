/* forschungsaufgaben-bauen.mjs, schreibt `docs/unterlagen/06_FORSCHUNGSAUFGABEN.md`.
 *
 * Klaus am 2026-08-26: *„ich möchte gern eine aktualisierte Fassung der
 * Forschungsaufgaben geklärt sehen und auch ausgearbeitet sehen. Und das
 * machen wir jetzt der Reihe nach."*
 *
 * ── WARUM ERZEUGT UND NICHT VON HAND ──────────────────────────────────────
 *
 * Der Anlass war ein Blatt, das eine Sache als „existiert nicht" führte, die
 * es seit demselben Tag gibt. Klaus las eine heruntergeladene Fassung und
 * fragte nach. Er hatte recht zu fragen: **eine Liste von Hand ist am Tag
 * nach dem Schreiben falsch und sieht dabei genauso aus wie eine richtige.**
 *
 * Deshalb steht der Stand jeder Aufgabe hier NICHT im Text. Er wird an den
 * Belegen gemessen: gibt es die Datei, seit wann, wie groß. Wer eine Aufgabe
 * erledigt, muss nichts abhaken; das Blatt sieht es beim nächsten Lauf.
 *
 * ── WAS DAS WERKZEUG NICHT KANN ───────────────────────────────────────────
 *
 * Es sieht, OB eine Datei da ist, nicht ob sie gut ist. „Beleg vorhanden"
 * heißt nicht „Aufgabe erledigt". Wo eine Aufgabe mehr braucht als eine
 * Datei, steht das in der Spalte „was noch fehlt", und die wird von Hand
 * geführt.
 *
 * Aufruf:  node tools/forschungsaufgaben-bauen.mjs
 */

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...t) => join(WURZEL, ...t);
const heute = new Date().toISOString().slice(0, 10);

/* Derselbe Riegel wie in `bestand-bauen.mjs`, aus demselben Grund. */
if (existsSync(P('.git/shallow'))) {
  console.error('ABBRUCH: der Klon ist flach. Jeder Zeitraum wäre am Klon');
  console.error('abgeschnitten statt an der Wirklichkeit, und sähe richtig aus.');
  console.error('Erst  git fetch --unshallow  ausführen, dann neu bauen.');
  process.exit(2);
}

function belegStand(pfade) {
  const da = pfade.filter((p) => existsSync(P(p)));
  if (!da.length) return { da: false, seit: null, zeilen: 0, bytes: 0, fehlt: pfade };
  let zeilen = 0, bytes = 0;
  for (const p of da) {
    const s = statSync(P(p));
    if (s.isDirectory()) {
      for (const f of readdirSync(P(p))) {
        const q = join(P(p), f);
        if (statSync(q).isFile()) { bytes += statSync(q).size; }
      }
    } else {
      bytes += s.size;
      if (/\.(md|html)$/.test(p)) zeilen += readFileSync(P(p), 'utf-8').split('\n').length;
    }
  }
  let seit = null;
  try {
    const folgen = da.length === 1 ? ['--follow'] : [];
    const roh = execFileSync('git',
      ['log', ...folgen, '--format=%ad', '--date=short', '--', ...da],
      { cwd: WURZEL, encoding: 'utf-8' }).trim();
    if (roh) seit = roh.split('\n').pop();
  } catch { /* kein Git-Stand ermittelbar */ }
  return { da: true, seit, zeilen, bytes, fehlt: pfade.filter((p) => !existsSync(P(p))) };
}

const kb = (b) => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB';

/* ── DIE DREI STRÄNGE ──────────────────────────────────────────────────────
   Sie stehen so im Forschungskorpus. Hier bekommen sie ihre Belege. */
const STRAENGE = [
  { nr: 1, name: 'Semantische, bidirektionale Suche ohne zentralen Index',
    frage: 'Können zwei Knoten ohne gemeinsamen Hub einander nach Bedeutung beantworten?',
    belege: ['docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md', 'docs/meilenstein'],
    stand: 'belegt und datiert',
    fehlt: 'Eine Messung gegen ein Vergleichsverfahren. Belegt ist, DASS es geht, '
      + 'nicht wie gut im Vergleich zu einer zentralen Vektor-Suche.' },
  { nr: 2, name: 'Grundsatzbasiertes gegenüber regelbasiertem Lenken',
    frage: 'Was lässt sich erzwingen, was muss man fragen, und wo versagt beides?',
    belege: ['docs/papers/PAPER_A_regeln-und-grundsaetze.md', 'docs/werkstatt'],
    stand: 'Material und Paper A liegen vor',
    fehlt: 'Der Versuchsaufbau ist entworfen (drei Arme mal drei Aufgabenarten), '
      + 'aber nicht gefahren. Fallzahl bisher eins, keine Kontrollgruppe, kein Maß.' },
  { nr: 3, name: 'Was die Nutzung mit Menschen macht',
    frage: 'Gewöhnung, Übervertrauen, Verlernen, Vermenschlichung. Und die andere '
      + 'Richtung: Reichweite, Tempo, Mut.',
    belege: ['docs/historie/arbeitstage.html', 'docs/LEHREN.md'],
    stand: 'Rohdaten liegen vor, ausgewertet ist nichts',
    fehlt: 'Der schärfste Einzelbefund (das Werkzeug hört nicht auf, der Mensch '
      + 'hätte längst aufgegeben) braucht einen Vergleichspunkt, und der verlangt '
      + 'eine Aussage darüber, wann ein Mensch aufgegeben hätte. Ohne methodischen '
      + 'Partner nicht zu beziffern.' },
];

/* ── DIE AUFGABEN, IN DER REIHENFOLGE DES VORGEHENS ────────────────────────

   ZWEI DINGE, DIE NICHT DASSELBE SIND, und deren Vermischung dieses Blatt
   wertlos machte:

     `belege`   die Dateien, an denen sich MESSEN lässt, ob etwas da ist.
     `fehlt`    was die Aufgabe noch braucht. Von Hand geführt.

   Eine Datei kann dastehen und die Aufgabe trotzdem offen sein. Aufgabe 3 ist
   der deutlichste Fall: die beiden Papers liegen vor, hochgeladen ist nichts,
   und **das Ergebnis wäre eine Nummer, keine Datei**. Das Depot kann so etwas
   gar nicht sehen. Deshalb trägt jede Aufgabe zusätzlich, ob ihr Ergebnis
   überhaupt im Depot sichtbar würde. */
const AUFGABEN = [
  { nr: 1, titel: 'Blatt „Stand der Technik und Abgrenzung"', strang: 'alle drei',
    sichtbar: true,
    belege: ['docs/ABGRENZUNG.md'],
    wozu: 'Wer die Untersuchung liest, braucht zuerst die Antwort auf „gibt es '
      + 'das nicht schon\u201c.',
    fehlt: 'Die Literatursuche. Das Blatt stützt sich auf die veröffentlichten '
      + 'Zwecke der genannten Verfahren, nicht auf eine systematische Recherche '
      + 'mit Zitaten. Es sagt das selbst in § 6.',
    haengtAn: null },
  { nr: 2, titel: 'Paper A · Regeln und Grundsätze', strang: '2',
    sichtbar: true,
    belege: ['docs/papers/PAPER_A_regeln-und-grundsaetze.md'],
    wozu: 'Der schreibbarste der drei Texte, das Material liegt fertig vor.',
    fehlt: 'Der Werkzeug-Widerspruch: vier Stellen sagen im Präsens, die Rollen '
      + 'hätten keine Werkzeuge. Kimhubs Verfassung sagt seit dem 2026-08-23 das '
      + 'Gegenteil. Gehört VOR die Zenodo-Nummer, weil eine Zenodo-Fassung stehen bleibt.',
    haengtAn: null },
  { nr: 3, titel: 'Die zwei vorhandenen Papers auf Zenodo', strang: 'alle drei',
    sichtbar: false,
    belege: ['docs/papers/sbkim-paper-de.html', 'docs/papers/sbkim-paper-en.html'],
    wozu: 'Zitierfähig werden geht allem voran und kostet zwei Stunden. '
      + 'Ohne DOI sind es Dateien in einem Depot, keine Quellen.',
    fehlt: 'Die Entscheidung über die Gedankenstriche darin. Es ist eine datierte '
      + 'v0.1 von Mai 2026, in `INTERFACES.md` mit Paragraphennummern zitiert. '
      + 'Ein stilles Umschreiben erzeugte zwei Fassungen mit derselben Nummer.',
    haengtAn: 'Aufgabe 2, wenn Paper A mit hochgeladen werden soll' },
  { nr: 4, titel: 'Englische Projektseite, eine Seite', strang: 'alle drei',
    sichtbar: true,
    belege: ['docs/PROJEKT_EN.md', 'docs/projekt-en.html'],
    wozu: 'Grundlage für die englischsprachige Fassung. Ohne sie ist dieser Weg zu.',
    fehlt: 'Alles. Und sie ist KEINE Übersetzung der deutschen Seite: der OTF '
      + 'fragt nach anderen Dingen. Zum Übersetzen liegt vor: `ABGRENZUNG.md`, '
      + 'das englische SBKIM-Paper, die Zahlen aus `04_BESTAND.md`.',
    haengtAn: 'Aufgabe 1, denn die Abgrenzung ist ihr Kern' },
  { nr: 5, titel: 'Paper C · KI-Kompetenz im täglichen Gebrauch', strang: '3',
    sichtbar: true,
    belege: ['docs/papers/PAPER_C_ki-kompetenz.md'],
    wozu: 'Der anwendbare der drei. Passt zu Vorträgen und Medienkompetenz-Töpfen.',
    fehlt: 'Alles. Das Gerüst steht in `PLAN_PAPERS.md` mit fünf Punkten, je einer '
      + 'mit Beispiel aus der eigenen Arbeit. Die Beispiele liegen in `LEHREN.md` '
      + 'und in den Sitzungsprotokollen.',
    haengtAn: null },
  { nr: 6, titel: 'Paper B · Wie KI auf den Menschen wirkt', strang: '3',
    sichtbar: true,
    belege: ['docs/papers/PAPER_B_wirkung.md'],
    wozu: 'Der Strang mit der größten Eigenständigkeit. Zu KI-Assistenten im '
      + 'Alltag gibt es fast nichts, und was es gibt, fragt Menschen hinterher.',
    fehlt: 'Alles, und es ist der heikelste. Vier Stellen, an denen es kippt: die '
      + 'geschützte Berufsbezeichnung, keine Diagnosen, keine Zahl ohne Messung, '
      + 'kein PII. Hängt am meisten von einem methodischen Partner ab.',
    haengtAn: 'Aufgabe 5, weil Paper C den praktischen Teil derselben Beobachtung trägt' },
  { nr: 7, titel: 'Vorleistung in Zahlen, als eigenes Blatt', strang: 'alle drei',
    sichtbar: false,
    belege: ['docs/unterlagen/04_BESTAND.md'],
    wozu: 'Der Antrag verlangt eine Angabe zur Vorleistung.',
    fehlt: 'Der Rohstoff liegt vor und ist gemessen. Was fehlt, ist die Auswahl: '
      + 'welche Zahlen in den Antrag gehören und welche nicht.',
    haengtAn: null },
];

/* ── Das Blatt ────────────────────────────────────────────────────────────── */

const mitStand = AUFGABEN.map((a) => ({ ...a, s: belegStand(a.belege) }));
const straengeMitStand = STRAENGE.map((s) => ({ ...s, s: belegStand(s.belege) }));
const offen = mitStand.filter((a) => !a.s.da);
const angefangen = mitStand.filter((a) => a.s.da);

/* Drei Werte, nicht zwei. „Nicht als Datei sichtbar" ist etwas anderes als
   „fehlt": eine Zenodo-Nummer kann nie im Depot stehen, und wer sie als
   fehlende Datei führt, wartet auf etwas, das nie kommt. */
const zeichen = (a) => !a.sichtbar
  ? 'nicht als Datei sichtbar'
  : (a.s.da ? '**Ergebnis liegt vor**' : '**Ergebnis fehlt**');

const md = `# Forschungsaufgaben: was ansteht, in welcher Reihenfolge

**Erzeugt am ${heute}** von \`tools/forschungsaufgaben-bauen.mjs\`. Der Stand
jeder Aufgabe wird **an ihren Belegen gemessen**, nicht hingeschrieben. Wer
diese Datei von Hand ändert, verliert die Änderung beim nächsten Lauf.

> **Warum sie erzeugt wird.** Ob ein Beleg im Depot liegt, sieht das Blatt bei
> jedem Lauf selbst nach. Eine von Hand geführte Liste könnte hinterherhinken,
> ohne dass man es ihr ansieht.

---

## 1 · Die Lage in einem Satz

**Von ${mitStand.length} Aufgaben ist keine einzige erledigt.** ${angefangen.length} haben einen Beleg im
Depot, ${offen.length} noch nicht, und ${mitStand.filter((a) => !a.sichtbar).length} könnten ihr Ergebnis dort gar nicht zeigen.

Ein Beleg sagt, dass eine Datei da ist. Er sagt nicht, dass die Aufgabe fertig
ist. **Aufgabe 3 ist der deutlichste Fall:** die beiden Papers liegen seit Mai
vor, hochgeladen ist nichts, und eine Zenodo-Nummer wäre ohnehin keine Datei.
Was jeder Aufgabe noch fehlt, steht bei ihr einzeln.

## 2 · Die drei Stränge, und woran sie hängen

Sie stehen so im [Forschungskorpus](../FORSCHUNGSKORPUS.md). Was sie
zusammenhält, ist die **Bidirektionalität**: die Suche fragt und antwortet, und
die Beobachtung über Mensch und KI hat dieselbe Figur. Der Mensch prägt die KI
über Grundsätze, die KI prägt den Menschen über Gewöhnung.

${straengeMitStand.map((s) => `### Strang ${s.nr} · ${s.name}

**Die Frage:** ${s.frage}

| | |
|---|---|
| Stand | ${s.stand} |
| Belege im Depot | ${s.belege.map((p) => '`' + p + '`').join(' · ')}${s.s.da ? ' (vorhanden' + (s.s.seit ? ', seit ' + s.s.seit : '') + ')' : ' **fehlen**'} |
| Was noch fehlt | ${s.fehlt} |
`).join('\n')}

## 3 · Die Aufgaben, in der Reihenfolge des Vorgehens

| Nr. | Aufgabe | Strang | Ergebnis im Depot | Beleg | seit |
|---|---|---|---|---|---|
${mitStand.map((a) => '| **' + a.nr + '** | ' + a.titel + ' | ' + a.strang + ' | '
  + zeichen(a) + ' | '
  + (a.s.da
    ? a.belege.filter((p) => existsSync(P(p))).map((p) => '`' + p + '`').join(' · ')
      + (a.s.zeilen ? ', ' + a.s.zeilen.toLocaleString('de-DE') + ' Zeilen' : ', ' + kb(a.s.bytes))
    : 'noch keiner')
  + ' | ' + (a.s.seit || 'ohne') + ' |').join('\n')}

## 4 · Jede Aufgabe einzeln

${mitStand.map((a) => `### ${a.nr} · ${a.titel}

**Wozu:** ${a.wozu}

| | |
|---|---|
| Ergebnis im Depot | ${zeichen(a)}${a.sichtbar && a.s.da && a.s.seit ? ', erster Stand ' + a.s.seit : ''} |
| Beleg | ${a.belege.map((p) => '`' + p + '`' + (existsSync(P(p)) ? '' : ' (fehlt)')).join(' · ')} |
| Was noch fehlt | ${a.fehlt} |
| Hängt ab von | ${a.haengtAn || 'nichts, kann sofort beginnen'} |
`).join('\n')}

## 5 · Was zuerst dran ist, und warum

**Die drei ohne Abhängigkeit können sofort beginnen:** Aufgabe 2 (der
Werkzeug-Widerspruch, eine Entscheidung von Klaus), Aufgabe 5 (Paper C, das
Gerüst steht) und Aufgabe 7 (die Auswahl der Zahlen).

**Aufgabe 3 ist die billigste mit der größten Wirkung.** Zwei Stunden, und die
Papers werden zitierfähig. Sie wartet auf eine Entscheidung, nicht auf Arbeit.

**Aufgabe 6 kommt zuletzt.** Nicht weil sie unwichtig wäre, sondern weil sie am
meisten von einem methodischen Partner abhängt und die meisten Stellen hat, an
denen sie kippen kann.

## 6 · Was dieses Blatt nicht kann

Es misst, **ob** eine Datei da ist, nicht ob sie taugt. „Liegt vor" heißt nicht
„erledigt". Bei jeder Aufgabe steht deshalb getrennt, was noch fehlt, und diese
Spalte wird von Hand geführt.

**Und es kennt keine Arbeit, die außerhalb des Depots geschieht.** Ein Gespräch,
eine Mail an eine Hochschule, ein Zenodo-Upload
hinterlassen hier keine Spur, bis jemand sie einträgt.
`;

writeFileSync(P('docs/unterlagen/06_FORSCHUNGSAUFGABEN.md'), md, 'utf-8');
console.log('geschrieben: docs/unterlagen/06_FORSCHUNGSAUFGABEN.md');
console.log('  ' + mitStand.length + ' Aufgaben · ' + angefangen.length
  + ' mit Beleg · ' + offen.length + ' ohne');
console.log('  ohne Beleg: ' + offen.map((a) => a.nr + ' ' + a.titel).join(' · '));
