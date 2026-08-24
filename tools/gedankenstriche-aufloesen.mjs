/* gedankenstriche-aufloesen.mjs — loest Gedankenstriche in Saetze auf.
 *
 * Aufruf:  node tools/gedankenstriche-aufloesen.mjs [--schreiben] <datei…>
 *          ohne --schreiben wird nur gezeigt, was geschehen wuerde.
 *
 * ── WARUM ──────────────────────────────────────────────────────────────────
 *
 * Klaus am 2026-08-24: „Nimm bitte alle Gedankenstriche von dir heraus, die
 * sind vollkommen ueberfluessig. Gedankenstriche sind nicht passend. Es gibt
 * Saetze."
 *
 * Er hat recht, und der Skill `menschlich-schreiben` sagt dasselbe seit
 * laengerem: die Gedankenstrich-Flut ist einer der typischen Verraeter dafuer,
 * dass ein Text von einer Maschine stammt. Ein Mensch schreibt Saetze.
 *
 * ── DREI DINGE BLEIBEN UNANGETASTET ────────────────────────────────────────
 *
 * 1 · CODE-BLOECKE. Was zwischen ``` steht, ist Befehl oder Ausgabe. Ein
 *     Zeichen darin zu tauschen macht aus einer Anleitung eine Falle.
 *
 * 2 · ZITATE VON KLAUS. Was in „…" steht, sind seine Worte. An der
 *     Zeichensetzung eines Zitats zu drehen heisst, das Zitat zu faelschen.
 *     Das gilt auch dann, wenn der Auftrag „ueberall" lautet: der Auftrag
 *     betrifft MEIN Schreiben, nicht seines.
 *
 * 3 · GEDANKENSTRICHE IN TABELLEN-TRENNZEILEN und anderen Markdown-Zeichen.
 *
 * ── WAS AUS DEM STRICH WIRD ────────────────────────────────────────────────
 *
 * Entschieden wird an dem, was RECHTS steht, nicht links:
 *
 *   folgt eine Konjunktion (und, aber, denn, …)   ->  Komma
 *   folgt ein Grossbuchstabe im Fliesstext        ->  Punkt, zwei Saetze
 *   folgt ein Grossbuchstabe in Tabelle/Ueberschrift -> Komma
 *   folgt Kleinschreibung                         ->  Komma
 *   der Strich steht am Zeilenende                ->  wie oben, an das Wort
 *                                                     davor gehaengt
 *
 * Ein Punkt in einer Tabellenzelle oder einer Ueberschrift waere falsch, auch
 * wenn rechts ein Grossbuchstabe steht. Deshalb die Unterscheidung.
 *
 * ── DIE PRUEFUNG, DIE WIRKLICH ETWAS BEWEIST ───────────────────────────────
 *
 * Nicht „es steht kein Strich mehr da" (das waere auch wahr, wenn der halbe
 * Satz mit verschwunden ist), sondern: **die Wortfolge ist unveraendert.**
 * Verglichen wird die Liste aller Woerter vorher und nachher. Weicht sie ab,
 * bricht das Werkzeug ab und schreibt nichts.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const KONJUNKTION = new Set([
  'und', 'aber', 'denn', 'oder', 'also', 'sondern', 'doch', 'nicht',
  'sowie', 'bzw', 'beziehungsweise', 'jedoch', 'allerdings',
]);

/* Woerter, die einen HAUPTSATZ eroeffnen. Steht rechts eines davon, ist der
   Punkt das bessere Deutsch als das Komma. Ein Komma waere zwar erlaubt
   (zwei Hauptsaetze duerfen im Deutschen mit Komma stehen), liest sich aber
   flach: „ist nicht neu, sie ist in fuenf Feldern" gegen „ist nicht neu.
   Sie ist in fuenf Feldern". Genau das meint Klaus mit „es gibt Saetze". */
const SATZANFANG = new Set([
  'sie', 'er', 'es', 'das', 'man', 'dies', 'dieser', 'diese', 'dieses',
  'dort', 'hier', 'wer', 'ich', 'wir', 'du', 'ihr', 'damit', 'dabei',
  'deshalb', 'darum', 'dann', 'daraus', 'davon', 'dafuer', 'dafür',
  'sichtbar', 'gemeint', 'gemessen', 'entschieden', 'geprüft', 'gebaut',
  'jeder', 'jede', 'jedes', 'keiner', 'keine', 'keines', 'beides', 'beide',
  'niemand', 'nichts', 'alles', 'was', 'wo', 'wann', 'warum', 'wie',
]);

/* Eine reine AUFZAEHLUNG hinter dem Strich ist kein Satz. Dort ist der
   Doppelpunkt richtig, nicht der Punkt: „wird mitgeschrieben: Aufrufe,
   Token, Kosten, Dauer." Mit Punkt entstuende ein Satzfragment. */
function istAufzaehlung(rest) {
  const t = rest.replace(/\*\*/g, '').trim().replace(/[.;]$/, '');
  if (!/,/.test(t)) return false;
  const teile = t.split(/\s*,\s*/);
  if (teile.length < 2) return false;
  /* jedes Glied kurz und ohne finites Verb-Signal */
  return teile.every((x) => x.split(/\s+/).length <= 3 && x.length <= 28)
    && teile.length <= 6;
}

const schreiben = process.argv.includes('--schreiben');
const dateien = process.argv.slice(2).filter((a) => !a.startsWith('--'));

/* Zerlegt eine Zeile in Stuecke und merkt sich, welche geschuetzt sind
   (Zitate in „…", Code in `…`). */
function geschuetzteBereiche(zeile) {
  const schutz = new Array(zeile.length).fill(false);
  let inZitat = false, inCode = false;
  for (let i = 0; i < zeile.length; i++) {
    const c = zeile[i];
    if (c === '`') { inCode = !inCode; schutz[i] = true; continue; }
    if (c === '„') { inZitat = true; schutz[i] = true; continue; }   // „
    /* SCHLIESSEN kann BEIDES: das typografische Zeichen und das gerade
       Anfuehrungszeichen. Der Bestand benutzt „ zum Oeffnen (71 Mal) und ein
       gerades " zum Schliessen (71 Mal) -- das typografische Schlusszeichen
       kommt KEIN einziges Mal vor. Die erste Fassung suchte nur nach ihm;
       damit ging jedes Zitat auf und nie wieder zu, und alles dahinter galt
       als geschuetzt. Elf Striche blieben so stehen, die keine Zitate waren. */
    if ((c === '\u201C' || c === '"') && inZitat) { inZitat = false; schutz[i] = true; continue; }
    schutz[i] = inZitat || inCode;
  }
  return schutz;
}

const istTabelle = (z) => /^\s*\|/.test(z);
const istUeberschrift = (z) => /^\s*#{1,6}\s/.test(z);
const istListenKopf = (z) => /^\s*([-*+]|\d+\.)\s/.test(z);

function ersatzFuer(rechtsWort, zeile, rest) {
  const w = rechtsWort.replace(/^[*`_„"'(]+/, '');
  const nackt = w.replace(/[^a-zäöüß]/gi, '').toLowerCase();
  const klein = w.slice(0, 1).toLowerCase() === w.slice(0, 1) && /[a-zä-ü]/i.test(w.slice(0, 1));

  if (KONJUNKTION.has(nackt)) return ', ';

  /* In Tabellenzellen und Ueberschriften ist ein Punkt immer falsch, auch
     wenn rechts ein ganzer Satz steht. */
  const nurKomma = istTabelle(zeile) || istUeberschrift(zeile);

  /* In einer UEBERSCHRIFT trennt der Strich fast immer einen Titel von
     seiner Erlaeuterung. Dort ist der Doppelpunkt richtig, nicht das Komma:
     „docs/papers/: dokumentengestuetzte Stationen" gegen
     „docs/papers/, dokumentengestuetzte Stationen". Nur wenn rechts eine
     Konjunktion steht, bleibt es beim Komma, und das ist oben schon
     entschieden. */
  if (istUeberschrift(zeile)) return ': ';

  if (rest && istAufzaehlung(rest)) return nurKomma ? ', ' : ': ';
  if (SATZANFANG.has(nackt)) return nurKomma ? ', ' : '. ';
  if (klein) return ', ';
  if (nurKomma) return ', ';
  return '. ';
}

const woerter = (t) => (t.match(/[\p{L}\p{N}]+/gu) || []);

let gesamt = 0, geschuetztGesamt = 0;
const schau = [];

for (const datei of dateien) {
  const roh = readFileSync(datei, 'utf-8');
  const zeilen = roh.split('\n');
  let imCode = false;
  let geaendert = 0, gesch = 0, gehoben = 0;

  for (let i = 0; i < zeilen.length; i++) {
    if (/^\s*```/.test(zeilen[i])) { imCode = !imCode; continue; }
    if (imCode) continue;
    if (/^\s*\|[\s:|-]+\|?\s*$/.test(zeilen[i])) continue;   // Tabellen-Trennzeile

    let z = zeilen[i];
    if (!z.includes('—')) continue;

    /* EINE Ersetzung mit Rueckruf statt eigener Index-Buchhaltung.
       Die erste Fassung fuehrte `pos` von Hand mit und verdoppelte dabei ein
       Wort („ist Gegenstand ist Gegenstand"). Gefunden hat es die
       Wortfolge-Pruefung, nicht das Nachdenken. Wer Positionen selbst zaehlt,
       zaehlt sich irgendwann falsch; `replace` zaehlt richtig. */
    const schutz = geschuetzteBereiche(z);
    const HEBEN = '\u0001';   // Marke: das naechste Zeichen wird gross

    /* STRICH AM ZEILENANFANG. Der Satz lief in der Zeile davor und wurde nur
       umgebrochen. Das Zeichen gehoert deshalb ans ENDE der vorigen Zeile,
       nicht an den Anfang dieser. Ohne diesen Fall entstanden Zeilen, die mit
       „, und zwar…" beginnen -- richtig gezaehlt, falsch gesetzt. */
    const anfang = z.match(/^(\s*(?:[-*+]\s+|\d+\.\s+|>\s*)?)—\s*/);
    if (anfang && i > 0 && !schutz[anfang[0].indexOf('—')]) {
      const rest0 = z.slice(anfang[0].length);
      const wort0 = rest0.split(/\s/)[0] || '';
      if (wort0) {
        let e = ersatzFuer(wort0, z, rest0);
        const vorZeile = zeilen[i - 1].replace(/\s+$/, '');
        if (/[.,;:!?]$/.test(vorZeile)) e = ' ';
        else zeilen[i - 1] = vorZeile + e.replace(/\s+$/, '');
        z = anfang[1] + ((e === '. ' && /^[a-zä-ü]/.test(rest0))
          ? rest0.slice(0, 1).toUpperCase() + rest0.slice(1)
          : rest0);
        geaendert++;
        if (e === '. ' && /^[A-ZÄÖÜ]/.test(z.slice(anfang[1].length))
            && /^[a-zä-ü]/.test(rest0)) gehoben++;
      }
    }

    let neu = z.replace(/\s*—\s*/g, (treffer, idx) => {
      /* Liegt der Strich in einem Zitat oder in Code, bleibt alles stehen. */
      const strichAn = idx + treffer.indexOf('—');
      if (schutz[strichAn]) { gesch++; return treffer; }

      const links = z.slice(0, idx).replace(/\s+$/, '');
      const rest = z.slice(idx + treffer.length);
      let rechtsWort = rest.split(/\s/)[0];
      if (!rechtsWort) {
        /* Strich am Zeilenende: das erste Wort der naechsten Zeile
           entscheidet, denn dort geht der Satz weiter. */
        rechtsWort = ((zeilen[i + 1] || '').trim().split(/\s/)[0]) || '';
      }
      if (!rechtsWort) return treffer;

      /* Steht RECHTS schon ein Satzzeichen („hat —, die Wiederholbarkeit"),
         faellt der Strich ersatzlos weg. Sonst entstuende „hat., die". Das
         ist die zweite Haelfte des Paar-Strichs, dessen erste Haelfte schon
         zu einem Komma geworden ist. */
      if (/^[,;:.!?)\]}]/.test(rechtsWort)) { geaendert++; return ''; }

      let ers = ersatzFuer(rechtsWort, z, rest);

      /* Steht links schon ein Satzzeichen, kommt kein zweites dazu. */
      if (/[.,;:!?]$/.test(links)) ers = ' ';

      if (!rest) {
        geaendert++;
        return ers.replace(/\s+$/, '');   // ans Wort davor haengen
      }
      geaendert++;
      /* Nach einem neuen Punkt muss gross weitergehen. Die Marke sagt der
         zweiten Runde, wo. */
      return (ers === '. ' && /^[a-zä-ü]/.test(rest)) ? '. ' + HEBEN : ers;
    });

    neu = neu.replace(new RegExp(HEBEN + '(.)', 'g'), (_, c) => {
      gehoben++;
      return c.toUpperCase();
    });

    /* Aufraeumen: doppelte Satzzeichen und Leerzeichen, die beim Tauschen
       entstehen koennen. */
    /* DIE EINRUECKUNG BLEIBT. Die erste Fassung raeumte mit /  +/ auf und
       fraß dabei die zwei fuehrenden Leerzeichen jeder Fortsetzungszeile in
       einer Liste. Markdown liest so eine Zeile danach als eigenen Absatz,
       und der Listenpunkt bricht auseinander. Gefunden hat es die
       Vollstaendigkeits-Probe der Mappe, nicht das Nachdenken: vier Zeilen
       standen ploetzlich nicht mehr in der Ansicht. Aufgeraeumt wird deshalb
       nur, was HINTER dem ersten Wort steht. */
    const einzug = (neu.match(/^\s*/) || [''])[0];
    neu = einzug + neu.slice(einzug.length)
      .replace(/ {2,}/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
      .replace(/,\s*,/g, ',')
      .replace(/\.\s*\./g, '.')
      .replace(/,\s*\./g, '.')
      .replace(/\s+$/, '');

    if (neu !== zeilen[i]) {
      schau.push({ datei, nr: i + 1, alt: zeilen[i], neu });
      zeilen[i] = neu;
    }
  }

  const ergebnis = zeilen.join('\n');

  /* DIE PRUEFUNG: dieselbe Wortfolge, nur andere Zeichensetzung.
     Sie wird in ZWEI Schritten gefuehrt, und der zweite ist der Grund,
     warum sie etwas taugt:
       1 · die Woerter selbst muessen gleich sein (klein verglichen),
       2 · und jede Abweichung in der GROSS/KLEIN-Schreibung muss eine sein,
           die das Werkzeug bewusst vorgenommen hat: nach einem neu
           gesetzten Punkt muss gross weitergehen.
     Ohne Schritt 2 waere die Pruefung nachsichtig gegenueber jeder
     verschluckten Grossschreibung. Ein bloss klein verglichener Text ist
     kein Beweis, er ist eine Abschwaechung. */
  const a = woerter(roh), b = woerter(ergebnis);
  const kl = (l) => l.map((w) => w.toLowerCase());
  const a2 = kl(a), b2 = kl(b);
  if (a2.length !== b2.length || a2.some((w, n) => w !== b2[n])) {
    const stelle = a2.findIndex((w, n) => w !== b2[n]);
    console.error('ABBRUCH in ' + datei + ': die Wortfolge hat sich geaendert.');
    console.error('  vorher: ' + a.slice(Math.max(0, stelle - 6), stelle + 6).join(' '));
    console.error('  nachher: ' + b.slice(Math.max(0, stelle - 6), stelle + 6).join(' '));
    process.exit(1);
  }
  const anders = a.filter((w, n) => w !== b[n]);
  if (anders.length !== gehoben) {
    console.error('ABBRUCH in ' + datei + ': ' + anders.length
      + ' Woerter anders geschrieben, aber nur ' + gehoben
      + ' bewusst gehoben. Abweichung: ' + anders.slice(0, 8).join(' '));
    process.exit(1);
  }

  gesamt += geaendert;
  geschuetztGesamt += gesch;
  if (schreiben) writeFileSync(datei, ergebnis, 'utf-8');
  console.log(
    (schreiben ? 'geschrieben  ' : 'nur gezeigt  ')
    + datei + ': ' + geaendert + ' aufgeloest, ' + gehoben
    + ' danach gross geschrieben, ' + gesch + ' geschuetzt stehengelassen');
}

console.log('\nzusammen: ' + gesamt + ' aufgeloest, ' + geschuetztGesamt
  + ' in Zitaten oder Code stehengelassen');

if (process.env.SCHAU === 'ja') {
  console.log('\n── jede geaenderte Zeile ──');
  for (const s of schau) {
    console.log('\n' + s.datei + ':' + s.nr);
    console.log('  - ' + s.alt.trim());
    console.log('  + ' + s.neu.trim());
  }
}
