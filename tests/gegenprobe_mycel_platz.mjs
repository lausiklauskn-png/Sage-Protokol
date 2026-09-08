/* gegenprobe_mycel_platz.mjs — Gegenprobe zu `smoke_bau23_mycel_platz.mjs`.
 *
 * Lauf:  node tests/gegenprobe_mycel_platz.mjs
 *
 * Baut nacheinander Fehler in `src/modules/23_rendezvous_ui.js` ein. **Jeder
 * einzelne MUSS die Probe umwerfen.** Wirft er sie nicht um, ist der Wächter
 * an dieser Stelle blind — und ein blinder Wächter ist schlimmer als keiner,
 * weil sein Grün beruhigt.
 *
 * ⚠ DIE PROBE BRAUCHT EINEN BROWSER. Fehlt er, meldet sie „nicht lauffähig"
 * und käme mit 0 zurück — jeder Fall sähe dann aus wie durchgerutscht. Genau
 * das ist in PWA Toolpoint am 2026-09-08 passiert: 24 Fälle galten als blind,
 * weil `playwright-core` fehlte und die Unterprobe „übersprungen" meldete.
 * Die Gegenprobe wertet nur den Rückgabewert und kann übersprungen nicht von
 * bestanden unterscheiden. Deshalb wird hier VORHER geprüft, ob die Probe
 * ohne Eingriff überhaupt etwas misst.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = resolve(WURZEL, 'src/modules/23_rendezvous_ui.js');
const PROBE = resolve(WURZEL, 'tests/smoke_bau23_mycel_platz.mjs');
const SICHER = ZIEL + '.gegenprobe-bak';

function ersetze(alt, neu) {
  const s = readFileSync(ZIEL, 'utf8');
  if (!s.includes(alt)) throw new Error('ANKER NICHT GEFUNDEN: ' + alt.slice(0, 70));
  const t = s.replace(alt, neu);
  if (t === s) throw new Error('SABOTAGE ÄNDERT NICHTS: ' + alt.slice(0, 70));
  writeFileSync(ZIEL, t);
}
function zurueck() { if (existsSync(SICHER)) { copyFileSync(SICHER, ZIEL); unlinkSync(SICHER); } }
function probeLaeuftDurch() {
  try { execFileSync(process.execPath, [PROBE], { stdio: 'pipe' }); return true; }
  catch { return false; }
}

const FAELLE = [
  { was: 'die Blase sucht den Platz gar nicht mehr — sie bleibt in der Ecke',
    bauen: () => ersetze('      andocken();\n    }',
                         '      /* sabotiert */\n    }') },
  { was: 'sie hängt sich hinein, bleibt aber position:fixed (liegt weiter darüber)',
    bauen: () => ersetze('      btnEl.style.position = "static";',
                         '      btnEl.style.position = "fixed";') },
  /* ⚠ HIER STAND EIN FALL, DER NICHTS MESSEN KANN, und die Grenze gehört
     benannt statt versteckt: „die alten Ecken-Werte bleiben stehen". Nimmt man
     in `andocken()` das Leeren von `left`/`top` heraus, ändert sich nichts —
     ein `position:static`-Element ignoriert beide ohnehin, und beim nächsten
     Lösen werden sie neu gesetzt. Die Zeile ist Hygiene, kein Riegel.
     LIEBER KEIN FALL ALS EINER, DER IMMER DURCHRUTSCHT: er sähe wie eine
     Lücke aus und wäre keine. */
  { was: 'die Marke data-sbkim-angedockt fehlt',
    bauen: () => ersetze('      btnEl.setAttribute("data-sbkim-angedockt", "1");',
                         '      /* sabotiert */') },
  /* ⚠ ZWEI RIEGEL DECKEN EINANDER — ein Eingriff in nur einen beweist nichts.
     Das Lösen steht an ZWEI Stellen: in `applyPos` (jede Stelle, die eine
     freie Lage setzt) und in `makeDraggable` (beim ersten echten Schritt,
     wo danach der Capture erneuert wird). Der Fall traf zuerst nur die erste
     und rutschte durch, obwohl der Code an der zweiten weiter griff.
     Sabotiert wird deshalb die ZUSICHERUNG, nicht die Zeile. */
  { was: 'ein Zug löst sie NICHT aus der Leiste (sie klebt fest)',
    bauen: () => {
      ersetze('    if (node === btnEl && angedockt) abdocken();', '    /* sabotiert */');
      ersetze('          abdocken();\n          try { handle.setPointerCapture', '          try { handle.setPointerCapture');
    } },
  /* ⚠ DER TEUERSTE FALL. Ohne die Capture-Erneuerung bricht das Ziehen nach
     dem ersten Schritt ab, `end()` läuft nie, und die Lage wird NIE gemerkt —
     ein stiller Fehlschlag, der beim ersten Blick wie ein Erfolg aussieht. */
  { was: 'der Pointer-Capture wird nach dem Lösen nicht erneuert',
    bauen: () => ersetze('          try { handle.setPointerCapture(ev.pointerId); } catch (_e) {}\n        }',
                         '          /* sabotiert */\n        }') },
  { was: 'die gezogene Lage wird nicht gemerkt',
    bauen: () => ersetze('        savePos(c.x, c.y);', '        /* sabotiert */') },
  { was: 'die gemerkte Lage verliert gegen den Platz (der Zug wird folgenlos)',
    bauen: () => ersetze('    var savedPos = loadPos();\n    if (savedPos) {',
                         '    var savedPos = null;\n    if (savedPos) {') },
  { was: 'es gibt keinen Weg zurück in die Leiste',
    bauen: () => ersetze('    headBtns.appendChild(dockBtn);', '    /* sabotiert */') },
  { was: 'der Rückweg dockt nicht wirklich an',
    bauen: () => ersetze('      if (!andocken() && btnEl) {', '      if (true) {') },
  { was: 'der Rückweg löscht die gemerkte Lage nicht — sie kommt beim Laden zurück',
    bauen: () => ersetze('      try { global.localStorage.removeItem(POS_KEY); } catch (_e) {}',
                         '      /* sabotiert */') },
  /* Die Gegenrichtung: ohne sie wäre „steht in der Leiste" auch grün, wenn
     eine App OHNE Leiste gar keine Blase mehr bekäme. */
  { was: 'der Zurück-Knopf steht auch ohne Platz da (toter Knopf)',
    bauen: () => ersetze('      try { dockBtn.hidden = !(findeAnker() && !angedockt); } catch (_e) {}',
                         '      try { dockBtn.hidden = false; } catch (_e) {}') },
];

copyFileSync(ZIEL, SICHER);
let durchgerutscht = 0;
try {
  /* ⚠ ERST DIE AUSGANGSLAGE. Ist die Probe schon ohne Eingriff rot — oder
     misst sie gar nichts, weil der Browser fehlt —, gäbe jeder Fall recht. */
  if (!probeLaeuftDurch()) {
    console.log('✗ ABBRUCH: die Probe ist schon ohne Eingriff rot (oder nicht lauffähig).');
    console.log('  Ohne gültige Ausgangslage misst keine Sabotage etwas.');
    zurueck();
    process.exit(1);
  }
  for (let n = 0; n < FAELLE.length; n++) {
    const fall = FAELLE[n];
    zurueck(); copyFileSync(ZIEL, SICHER);
    let gefangen;
    try { fall.bauen(); gefangen = !probeLaeuftDurch(); }
    catch (e) {
      console.log('  ??   ' + (n + 1) + ' · ' + fall.was + '\n       ' + e.message);
      durchgerutscht++; continue;
    }
    console.log(gefangen
      ? '  ok   ' + (n + 1) + ' · gefangen: ' + fall.was
      : '  ROT  ' + (n + 1) + ' · DURCHGERUTSCHT: ' + fall.was);
    if (!gefangen) durchgerutscht++;
  }
} finally { zurueck(); }

console.log(durchgerutscht === 0
  ? '\ngegenprobe_mycel_platz: ' + FAELLE.length + ' von ' + FAELLE.length + ' Fehlern gefangen'
  : '\ngegenprobe_mycel_platz: ' + durchgerutscht + ' DURCHGERUTSCHT');
process.exit(durchgerutscht === 0 ? 0 : 1);
