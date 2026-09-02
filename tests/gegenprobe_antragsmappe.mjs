/*
 * ⚠ ZWEI FÄLLE SIND AM 2026-09-02 ENTFALLEN, und der Grund gehört
 * hierhergeschrieben statt in eine Commit-Zeile:
 *
 *   · „Nur die erste Abteilung bekommt einen Druck-Riegel"
 *   · „Der Druck-Knopf blendet die andere Abteilung nicht mehr aus"
 *
 * Beide zielten auf eine ZWEITE Abteilung. Seit die Mappe nur noch eine hat,
 * ändert ihre Sabotage nichts — sie meldeten „DURCHGERUTSCHT", obwohl der
 * Prüfer in Ordnung war.
 *
 * LIEBER KEIN FALL ALS EINER, DER NICHTS MESSEN KANN. Ein Fall, der immer
 * durchrutscht, sieht wie eine Lücke aus und ist keine; ein Fall, der immer
 * fängt, sieht wie Deckung aus und ist keine. Beide kosten Vertrauen in die
 * Zahl darunter.
 *
 * Kommt eine zweite Abteilung zurück, kommen die zwei Fälle mit.
 */
/* gegenprobe_antragsmappe.mjs — Gegenprobe zu `smoke_antragsmappe.mjs`.
 *
 * Lauf:  node tests/gegenprobe_antragsmappe.mjs
 *
 * Baut nacheinander zweiunddreissig Fehler ein. **Jeder einzelne MUSS die Probe
 * umwerfen.** Wirft er sie nicht um, ist der Wächter an dieser Stelle blind —
 * und ein blinder Wächter ist schlimmer als keiner, weil sein Grün beruhigt.
 *
 * Sabotiert wird der WEG, nicht die Ausgabe: die Fälle greifen in den Leser
 * (`tools/markdown-mini.mjs`) und in den Bauer (`tools/antragsmappe-bauen.mjs`)
 * ein und lassen die Mappe danach neu entstehen. Nur so misst die Gegenprobe
 * echte Defekte statt einer von Hand verbogenen Datei — bis auf den einen
 * Fall, der genau das Gegenteil prüft: eine Mappe, die NICHT neu gebaut wurde.
 *
 * Alle angefassten Dateien werden gesichert und am Ende zurückgeschrieben,
 * auch wenn der Lauf abbricht (finally) — und die Mappe wird zum Schluss
 * einmal sauber neu gebaut.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const P = (r) => resolve(WURZEL, r);

const ANGEFASST = [
  'tools/markdown-mini.mjs',
  'tools/antragsmappe-bauen.mjs',
  'tools/antragsmappe-markieren.mjs',
  'docs/antragsmappe-einreichbar.html',
    'docs/papers/ENTSTEHUNG.md',
  'docs/ABGRENZUNG.md',
];
const SICHER = new Map(ANGEFASST.map((r) => [r, readFileSync(P(r), 'utf-8')]));

const lies = (r) => readFileSync(P(r), 'utf-8');
const schreib = (r, t) => writeFileSync(P(r), t, 'utf-8');
const zurueck = () => { for (const [r, t] of SICHER) schreib(r, t); };

/* Ein Eingriff, der NICHTS ändert, misst nichts — und meldet sich trotzdem
   als bestandener Fall. Deshalb wird jede Ersetzung nachgezählt. */
function ersetze(datei, alt, neu) {
  const vorher = lies(datei);
  const nachher = vorher.replace(alt, neu);
  if (nachher === vorher) throw new Error('ANKER GREIFT NICHT in ' + datei);
  schreib(datei, nachher);
}

function bauen() {
  execFileSync(process.execPath, [P('tools/antragsmappe-bauen.mjs'), '--datum=2026-08-23'],
    { cwd: WURZEL, stdio: 'pipe' });
}

function probeLaeuftDurch(welche = 'tests/smoke_antragsmappe.mjs') {
  try {
    execFileSync(process.execPath, [P(welche)], { cwd: WURZEL, stdio: 'pipe' });
    return true;    // Rückgabewert 0 = Probe war zufrieden
  } catch {
    return false;   // Rückgabewert ≠ 0 = Probe hat angeschlagen
  }
}

/* Die Browser-Probe braucht playwright-core. Fehlt es, sind ihre Fälle
   **nicht lauffähig, nicht bestanden** — sie werden getrennt gezählt und
   benannt. Ein fehlendes Paket als "gefangen" zu verbuchen wäre genau die
   Sorte stilles Grün, gegen die diese Datei geschrieben ist. */
let browserGeht = false;
try { await import('playwright-core'); browserGeht = true; } catch { browserGeht = false; }

const FAELLE = [
  {
    was: 'Fett wird gar nicht gelesen — rohe Sternchen auf dem Schirm',
    bauen: () => {
      ersetze('tools/markdown-mini.mjs',
        "s = s.replace(/\\*\\*((?:[^*]|\\*(?!\\*))+?)\\*\\*/g, '<strong>$1</strong>');",
        '/* sabotiert */');
      bauen();
    },
  },
  {
    was: 'Überschriften bleiben ungelesen — Rauten im Text',
    bauen: () => {
      ersetze('tools/markdown-mini.mjs',
        "    const u = z.match(/^(#{1,6})\\s+(.*)$/);",
        '    const u = null;');
      bauen();
    },
  },
  {
    was: 'Zitatblöcke werden verschluckt',
    bauen: () => {
      ersetze('tools/markdown-mini.mjs',
        "      aus.push('<blockquote>' + bloecke(innen, verweis) + '</blockquote>');",
        "      aus.push('<blockquote></blockquote>');");
      bauen();
    },
  },
  {
    was: 'Tabellen verlieren ihre Zeilen (nur der Kopf bleibt)',
    bauen: () => {
      ersetze('tools/markdown-mini.mjs',
        '  const rest = zeilen.slice(2).map(zerlegen);',
        '  const rest = [];');
      bauen();
    },
  },
  {
    was: 'Ein Absatz am Dateiende fällt heraus',
    bauen: () => {
      ersetze('tools/markdown-mini.mjs',
        "    if (abs.length) aus.push('<p>' + inline(abs.join('\\n'), verweis) + '</p>');",
        "    if (abs.length && i < zeilen.length) aus.push('<p>' + inline(abs.join('\\n'), verweis) + '</p>');");
      bauen();
    },
  },
  {
    was: 'Verweise bleiben relativ — die Tablet-Falle (ERR_FILE_NOT_FOUND)',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        'function verweisUmschreiben(quellPfad, ziel) {',
        'function verweisUmschreiben(quellPfad, ziel) {\n  return ziel;');
      bauen();
    },
  },
  {
    was: 'Eine Quelldatei fehlt in der Einreich-Abteilung',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        "      'docs/werkstatt/BEFUND.md',\n", '');
      bauen();
    },
  },
  {
    /* Das Blatt, das eine Gutachterin zuerst liest. Es stand seit dem
       2026-08-23 als fehlend in drei Unterlagen und kam am 2026-08-26 dazu.
       Fiele es wieder heraus, wäre die Mappe genau so naiv wie vorher, und
       keine einzige Zahl darin wäre falsch. */
    was: 'Das Abgrenzungs-Blatt fällt aus der Einreich-Abteilung heraus',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs', "      'docs/ABGRENZUNG.md',\n", '');
      bauen();
    },
  },
  {
    /* Ein Abgrenzungs-Blatt, das nur sagt, was die anderen NICHT können, ist
       eine Werbeschrift. Was es trägt, ist der Abschnitt, in dem es die
       eigenen geliehenen Teile benennt. */
    was: 'Das Abgrenzungs-Blatt verschweigt, was daran nicht neu ist',
    bauen: () => {
      ersetze('docs/ABGRENZUNG.md', '## 3 · Wo SBKIM nichts Neues beansprucht',
        '## 3 · Weitere Vorteile');
      ersetze('docs/ABGRENZUNG.md', '- **Der Transport ist geliehen.**',
        '- **Der Transport ist eigens gebaut.**');
      bauen();
    },
  },
  {
    was: 'Das Abgrenzungs-Blatt gibt sich als Literaturübersicht aus',
    bauen: () => {
      ersetze('docs/ABGRENZUNG.md',
        '**Diese Seite ist eine Abgrenzung, keine Literaturübersicht.**',
        'Diese Seite fasst den Stand der Forschung vollständig zusammen.');
      bauen();
    },
  },
  {
    /* Bis zum 2026-08-26 stand hier die fertige CSS-Zeile als Anker. Seit die
       Druck-Riegel AUS der Abteilungs-Liste erzeugt werden, gibt es sie im
       Quelltext nicht mehr, und der Fall meldete korrekt „Anker greift nicht"
       statt „gefangen". Sabotiert wird jetzt die Erzeugung. */
    was: 'Es wird gar kein Druck-Riegel mehr erzeugt',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        ".map((id) => 'html.nur-' + id + ' .abteilung:not(#' + id + '){display:none}')",
        ".map(() => '')");
      bauen();
    },
  },

  {
    was: 'Der Download-Knopf verschwindet',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        "    '<button type=\"button\" data-tun=\"laden\" data-fuer=\"' + abt.id + '\">'",
        "    '<span>'");
      bauen();
    },
  },
  {
    was: 'Die Einreich-Abteilung verliert ihren eigenen Kopf (Datum, Herkunft)',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        "    '<p class=\"stempel\" data-stempel=\"' + abt.id + '\">'",
        "    '<p class=\"stempel-weg\">'");
      bauen();
    },
  },
  {
    was: 'Ein interner Sprung zeigt ins Leere',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        "    '<li><a href=\"#' + ANKER.get(p) + '\">'",
        "    '<li><a href=\"#gibt-es-nicht\">'");
      bauen();
    },
  },
  {
    was: 'Der Download nimmt BEIDE Abteilungen mit',
    probe: 'tests/smoke_antragsmappe_browser.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        '      + abt.outerHTML',
        '      + document.querySelector(".abteilung").outerHTML + abt.outerHTML');
      bauen();
    },
  },
  {
    was: 'Im Download bleiben die Knöpfe stehen — tot, aber beschriftet',
    probe: 'tests/smoke_antragsmappe_browser.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        '    for (var k = 0; k < weg.length; k++) weg[k].remove();',
        '    /* sabotiert */');
      bauen();
    },
  },
  {
    was: 'Dem Download fehlt der BOM — Android rät dann Latin-1',
    probe: 'tests/smoke_antragsmappe_browser.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        'var blob = new Blob(["\\\\ufeff" + alleinBauen(id)],',
        'var blob = new Blob([alleinBauen(id)],');
      bauen();
    },
  },

  {
    was: 'Markierungen landen im Ausdruck — und damit bei der Behörde',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        '  mark.mk{background:none !important;color:inherit !important;',
        '  mark.mk{color:inherit !important;');
      bauen();
    },
  },
  {
    was: 'Die Tafel wird mitgedruckt',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        '  .mk-leiste,.mk-tafel{display:none !important}', '');
      bauen();
    },
  },
  {
    was: 'Der Download nimmt die Markierungen mit',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        'var mks = abt.querySelectorAll("mark.mk");',
        'var mks = [];');
      bauen();
    },
  },
  {
    was: 'Die Farbe setzt keine Schriftfarbe — im dunklen Thema unlesbar',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        'mark.mk{background:#b7f0c2;color:#10331a;',
        'mark.mk{background:#b7f0c2;color:inherit;');
      ersetze('tools/antragsmappe-markieren.mjs',
        'mark.mk[data-farbe="rot"]{background:#ffc4bd;color:#45120c}',
        'mark.mk[data-farbe="rot"]{background:#ffc4bd}');
      bauen();
    },
  },
  {
    was: 'Eine Markierung überlebt den Neubau nicht (Anker fällt weg)',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        '    if(!anwenden(marken[i])) verwaist.push(marken[i].id);',
        '    void i;');
      bauen();
    },
  },
  {
    was: 'Verwaiste Markierungen verschwinden stillschweigend',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        'warnN.hidden = w.length === 0;', 'warnN.hidden = true;');
      bauen();
    },
  },
  {
    was: 'Die Auslese nennt die Quelldatei nicht mehr',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        '      out.push("## " + q);', '      out.push("## (Quelle)");');
      bauen();
    },
  },
  {
    was: 'Entfernen putzt den Text gleich mit weg',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        '      while(mk.firstChild) el.insertBefore(mk.firstChild, mk);', '');
      bauen();
    },
  },
  {
    was: 'Die Knöpfe tragen wieder nur ein Symbol, kein Wort',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        '<span class="mk-tupf" data-f="gruen"></span> bleibt', '&#129001;');
      bauen();
    },
  },
  {
    was: 'Der Farbtupfen wird als Emoji geschrieben statt gezeichnet',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        '.mk-tupf{display:inline-block;', '.mk-tupf{display:none;');
      bauen();
    },
  },
  {
    was: 'Die Legende in der Tafel fehlt — Bedeutung nur noch im Tooltip',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        '    <ul class="mk-legende" data-mk-legende>', '    <ul hidden>');
      bauen();
    },
  },
  {
    was: 'Die Auslese sagt nicht mehr, was die Farben bedeuten',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    /* Die Bedeutung steht an ZWEI Stellen im Bericht: in der Tabelle oben
       und in den Abschnitts-Ueberschriften. Ein Eingriff in nur eine liess
       die Zusicherung unangetastet -- der Fall rutschte durch, und zwar
       zu Recht: er hatte nichts kaputtgemacht. Sabotiert wird die
       ZUSICHERUNG, nicht eine Zeile. */
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs', 'FARBEN[farbe].sinn', 'farbe');
      ersetze('tools/antragsmappe-markieren.mjs', 'FARBEN.gruen.sinn', '"?"');
      ersetze('tools/antragsmappe-markieren.mjs', 'FARBEN.gelb.sinn', '"?"');
      ersetze('tools/antragsmappe-markieren.mjs', 'FARBEN.rot.sinn', '"?"');
      bauen();
    },
  },
  {
    was: 'Der Grundsatz „im Zweifel bleiben" faellt aus der Auslese',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        'out.push("**" + GRUNDSATZ + "**");', '');
      bauen();
    },
  },
  {
    was: 'Die Auslese nennt nur die Anzahl, nicht wie viel Text betroffen ist',
    probe: 'tests/smoke_antragsmappe_markieren.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-markieren.mjs',
        'out.push("| Farbe | heisst | Stellen | Zeichen |");',
        'out.push("| Farbe | heisst | Stellen |");');
      ersetze('tools/antragsmappe-markieren.mjs',
        '    out.push("| gruen | " + FARBEN.gruen.sinn + " | " + z.gruen + " | " + zeichen.gruen + " |");',
        '    out.push("| gruen | " + FARBEN.gruen.sinn + " | " + z.gruen + " |");');
      bauen();
    },
  },
  {
    was: 'Ein Gedankenstrich schleicht sich in einen eigenen Text zurück',
    bauen: () => {
      ersetze('docs/papers/ENTSTEHUNG.md', '. ', ' \u2014 ');
      bauen();
    },
  },
  {
    was: 'Die Quelle ändert sich, die Mappe wird nicht neu gebaut',
    bauen: () => {
      // KEIN Neubau — genau das ist der Fehler.
      ersetze('docs/ABGRENZUNG.md', '# ', '# Ein neuer Satz, der in der Mappe fehlt. ');
    },
  },
];

let durchgerutscht = 0;
let ungeprueft = 0;
console.log('Gegenprobe Antragsmappe — ' + FAELLE.length + ' eingebaute Fehler'
  + (browserGeht ? '' : '\n(ohne playwright-core: die Browser-Fälle bleiben UNGEPRÜFT)') + '\n');

try {
  for (const [n, fall] of FAELLE.entries()) {
    zurueck();
    const probe = fall.probe || 'tests/smoke_antragsmappe.mjs';
    if (probe.includes('browser') && !browserGeht) {
      console.log('  ⊘    ' + (n + 1) + ' · nicht lauffähig: ' + fall.was);
      ungeprueft++;
      continue;
    }
    let gefangen;
    try {
      fall.bauen();
      gefangen = !probeLaeuftDurch(probe);
    } catch (e) {
      console.log('  ??   ' + (n + 1) + ' · ' + fall.was + '\n       ' + e.message);
      durchgerutscht++;
      continue;
    }
    if (gefangen) {
      console.log('  ok   ' + (n + 1) + ' · gefangen: ' + fall.was);
    } else {
      console.log('  ROT  ' + (n + 1) + ' · DURCHGERUTSCHT: ' + fall.was);
      durchgerutscht++;
    }
  }
} finally {
  zurueck();
  bauen();
}

const nachsatz = ungeprueft ? ' · ' + ungeprueft + ' ungeprüft (kein Browser)' : '';
console.log(durchgerutscht === 0
  ? '\ngegenprobe_antragsmappe: ' + (FAELLE.length - ungeprueft) + ' von '
    + FAELLE.length + ' Fehlern gefangen' + nachsatz
  : '\ngegenprobe_antragsmappe: ' + durchgerutscht + ' DURCHGERUTSCHT' + nachsatz);
process.exit(durchgerutscht === 0 ? 0 : 1);
