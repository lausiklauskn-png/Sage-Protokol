/* gegenprobe_antragsmappe.mjs — Gegenprobe zu `smoke_antragsmappe.mjs`.
 *
 * Lauf:  node tests/gegenprobe_antragsmappe.mjs
 *
 * Baut nacheinander siebzehn Fehler ein. **Jeder einzelne MUSS die Probe
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
  'docs/antragsmappe.html',
  'docs/FORSCHUNGSKORPUS.md',
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
    was: 'Der Druck-Riegel für den Fahrplan fehlt',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        'html.nur-privat .abteilung:not(#privat){display:none}\n', '');
      bauen();
    },
  },
  {
    was: 'Der Druck-Riegel für die Unterlagen fehlt',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        'html.nur-einreichbar .abteilung:not(#einreichbar){display:none}\n', '');
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
    was: 'Der Druck-Knopf blendet die andere Abteilung nicht mehr aus',
    probe: 'tests/smoke_antragsmappe_browser.mjs',
    bauen: () => {
      ersetze('tools/antragsmappe-bauen.mjs',
        '    wurzel.classList.add(klasse);',
        '    void klasse;');
      bauen();
    },
  },
  {
    was: 'Die Quelle ändert sich, die Mappe wird nicht neu gebaut',
    bauen: () => {
      // KEIN Neubau — genau das ist der Fehler.
      ersetze('docs/FORSCHUNGSKORPUS.md', '# ', '# Ein neuer Satz, der in der Mappe fehlt. ');
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
