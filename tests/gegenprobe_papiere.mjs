// Gegenprobe zu `smoke_papiere_bereinigt.mjs`.
//
// Baut nacheinander sieben Fehler ein. **Jeder einzelne MUSS die Probe
// umwerfen.** Wirft er sie nicht um, ist der Wächter an dieser Stelle blind —
// und ein blinder Wächter ist schlimmer als keiner, weil sein Grün beruhigt.
//
// Der Anlass ist konkret: die Aussage „im PDF steht der Name nicht mehr" war
// hier schon zweimal grün, ohne dass jemand hineingesehen hatte. Zwei der
// sieben Fälle unten bauen den Namen deshalb wirklich in ein PDF ein — einmal
// im Fließtext, einmal gesperrt gesetzt (jeder Buchstabe einzeln). Der zweite
// Fall ist der, an dem ein naiver Leser scheitert.
//
// Lauf:  node tests/gegenprobe_papiere.mjs
//
// Alle Dateien werden vorher gesichert und am Ende zurückgeschrieben — auch
// wenn der Lauf abbricht (finally).

import { readFileSync, writeFileSync, copyFileSync, existsSync, unlinkSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = resolve(WURZEL, 'sbkim-demo/papiere');
const ZIEL = 'USP_Bidirektionales_Matching';
const HTML = resolve(ORDNER, ZIEL + '.html');
const PDF = resolve(ORDNER, ZIEL + '.pdf');
const NAME = ['Ever', 'last'].join('');

const sicher = { html: readFileSync(HTML, 'utf-8'), pdf: readFileSync(PDF) };

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [resolve(WURZEL, 'tests/smoke_papiere_bereinigt.mjs')],
      { cwd: WURZEL, stdio: 'pipe' });
    return true;             // Rückgabewert 0 = Probe zufrieden
  } catch {
    return false;            // Rückgabewert ≠ 0 = Probe hat angeschlagen
  }
}

function pdfNeu() {
  execFileSync(process.execPath, [resolve(ORDNER, '_pdf.mjs')],
    { cwd: WURZEL, stdio: 'pipe', env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: '/opt/pw-browsers' } });
}

const FAELLE = [
  {
    was: 'Name im HTML-Fließtext',
    bauen: () => writeFileSync(HTML, sicher.html.replace('Semantische Suche existiert', `Gespräch mit ${NAME} — semantische Suche existiert`))
  },
  {
    was: 'Vertraulichkeits-Vermerk im HTML',
    bauen: () => writeFileSync(HTML, sicher.html.replace('</div>\n</body>', '<p>Vertraulich — nur für den benannten Empfänger.</p></div>\n</body>'))
  },
  {
    was: 'Einordnungs-Kasten fehlt',
    bauen: () => writeFileSync(HTML, sicher.html.replace('class="einordnung"', 'class="weg"'))
  },
  {
    was: 'über zwei Zeilen gebrochener Produktname',
    bauen: () => writeFileSync(HTML, sicher.html.replace('<h2>1 · Die Kernthese', '<p>Vorbild war AI Agency\n  Kickstart.</p>\n<h2>1 · Die Kernthese'))
  },
  {
    was: 'PDF fehlt ganz',
    bauen: () => renameSync(PDF, PDF + '.weg'),
    raeumen: () => { if (existsSync(PDF + '.weg')) renameSync(PDF + '.weg', PDF); }
  },
  {
    was: 'Name im PDF-Fließtext (PDF neu gebaut)',
    bauen: () => {
      writeFileSync(HTML, sicher.html.replace('Semantische Suche existiert', `Ein Gespräch mit ${NAME} stand am Anfang. Semantische Suche existiert`));
      pdfNeu();
      writeFileSync(HTML, sicher.html);   // HTML wieder sauber: NUR das PDF trägt den Fehler
    }
  },
  {
    was: 'Name GESPERRT gesetzt im PDF (jeder Buchstabe einzeln)',
    bauen: () => {
      writeFileSync(HTML, sicher.html.replace('<h1>Bidirektionales',
        `<h1 style="letter-spacing:6pt">${NAME}</h1>\n<h1>Bidirektionales`));
      pdfNeu();
      writeFileSync(HTML, sicher.html);
    }
  }
];

let blind = 0;
console.log('\n=== Gegenprobe · Papiere ===\n');

try {
  if (!probeLaeuftDurch()) {
    console.error('✗ Die Probe ist schon vor der Gegenprobe rot. Erst das in Ordnung bringen.');
    process.exit(1);
  }
  console.log('  Ausgangslage: Probe grün.\n');

  for (const f of FAELLE) {
    f.bauen();
    const durch = probeLaeuftDurch();
    if (durch) { blind++; console.log(`  ✗ BLIND — nicht bemerkt: ${f.was}`); }
    else console.log(`  ✓ bemerkt: ${f.was}`);

    // zurücksetzen
    writeFileSync(HTML, sicher.html);
    writeFileSync(PDF, sicher.pdf);
    if (f.raeumen) f.raeumen();
  }
} finally {
  writeFileSync(HTML, sicher.html);
  writeFileSync(PDF, sicher.pdf);
  if (existsSync(PDF + '.weg')) unlinkSync(PDF + '.weg');
}

console.log(`\n${FAELLE.length - blind} von ${FAELLE.length} Fehlern bemerkt.` +
  (blind ? `  ${blind} BLINDE STELLE(N).\n` : '  Kein blinder Fleck.\n'));
process.exit(blind ? 1 : 0);
