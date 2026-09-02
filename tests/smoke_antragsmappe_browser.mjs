/* smoke_antragsmappe_browser.mjs — die Mappe wird wirklich GEÖFFNET.
 *
 * Lauf:  node tests/smoke_antragsmappe_browser.mjs
 * Braucht `playwright-core` (npm install). Fehlt es, ist diese Probe
 * **nicht lauffähig, nicht rot** — der Läufer unterscheidet das.
 *
 * ── WARUM ES DIESE ZWEITE PROBE GIBT ───────────────────────────────────────
 *
 * `smoke_antragsmappe.mjs` LIEST die Datei. Es misst damit, was drinsteht —
 * nicht, was passiert, wenn Klaus draufdrückt. Genau diese Lücke hat in
 * Kimhub am 2026-08-23 eine ganze Werkbank stillgelegt, während alle
 * Prüfungen grün blieben: sie lasen den Quelltext, keine lud ihn.
 *
 * Hier werden deshalb die zwei Zusicherungen gemessen, an denen die ganze
 * Zwei-Abteilungen-Idee hängt:
 *
 *   1 · DRUCKEN. Im Augenblick des Druckens steht NUR die gewählte Abteilung
 *       auf dem Papier. Gemessen wird die HÖHE der anderen — nicht ein
 *       Attribut: `hidden` verliert gegen jede Klasse mit `display`, und wer
 *       das Attribut prüft, ist grün, während die Seite es zeigt.
 *
 *   2 · HERUNTERLADEN. Die heruntergeladene Datei enthält die gewählte
 *       Abteilung und die andere NICHT. Ein Download, der beide mitnimmt,
 *       sieht bis zum Öffnen genau richtig aus — und das Arbeitspapier läge
 *       dann in der Mappe, die zur Behörde geht.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAPPE = resolve(WURZEL, 'docs/antragsmappe-einreichbar.html');

let rot = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
};

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const seite = await browser.newContext({ acceptDownloads: true });
const p = await seite.newPage();

const fehlerImSkript = [];
p.on('pageerror', (e) => fehlerImSkript.push(String(e)));

await p.goto(pathToFileURL(MAPPE).href);
await p.waitForSelector('[data-abteilung="einreichbar"]');

gut(fehlerImSkript.length === 0, 'die Seite lädt ohne Skriptfehler',
  fehlerImSkript.join(' · '));

/* ── 1 · Drucken: was im Augenblick des Druckens dasteht ──────────────── */

async function druckLage(id) {
  return p.evaluate(async (welche) => {
    let gemessen = null;
    const echt = window.print;
    window.print = function () {
      gemessen = {};
      for (const abt of document.querySelectorAll('.abteilung')) {
        gemessen[abt.id] = abt.getBoundingClientRect().height;
      }
      gemessen.klasse = document.documentElement.className;
    };
    document.querySelector('[data-tun="drucken"][data-fuer="' + welche + '"]').click();
    window.print = echt;
    window.dispatchEvent(new Event('afterprint'));
    await new Promise((r) => setTimeout(r, 30));
    return { gemessen, klasseDanach: document.documentElement.className };
  }, id);
}

/* Seit dem 2026-09-02 hat die Mappe EINE Abteilung. Der Druck-Mechanismus für
   mehrere steht weiter im Werkzeug und wird hier an der vorhandenen gemessen. */
for (const [ich, andere] of [['einreichbar', null]]) {
  const { gemessen, klasseDanach } = await druckLage(ich);
  gut(gemessen !== null, 'Druck-Knopf „' + ich + '" löst wirklich einen Druck aus');
  if (gemessen) {
    gut(gemessen[ich] > 0,
      'beim Drucken von „' + ich + '" steht diese Abteilung da (' + Math.round(gemessen[ich]) + ' px)');
    if (andere) gut(gemessen[andere] === 0,
      'beim Drucken von „' + ich + '" ist „' + andere + '" WEG',
      'gemessene Höhe: ' + gemessen[andere] + ' px');
  }
  gut(!/nur-(privat|einreichbar)/.test(klasseDanach),
    'nach dem Drucken steht die Seite wieder vollständig da',
    'Klasse: ' + klasseDanach);
}

/* ── 2 · Herunterladen: die Abteilung ist wirklich allein ─────────────── */

const KOPF = {
  einreichbar: 'Forschungsunterlagen',
};

for (const [ich, andere] of [['einreichbar', null]]) {
  let datei = null;
  try {
    const [dl] = await Promise.all([
      p.waitForEvent('download', { timeout: 15000 }),
      p.click('[data-tun="laden"][data-fuer="' + ich + '"]'),
    ]);
    const pfad = await dl.path();
    datei = { name: dl.suggestedFilename(), text: readFileSync(pfad, 'utf-8') };
  } catch (e) {
    gut(false, 'Download „' + ich + '" kommt an', String(e).split('\n')[0]);
  }

  if (datei) {
    gut(/\.html$/.test(datei.name) && datei.name.includes('2026-'),
      'Download „' + ich + '" heißt sprechend und trägt den Stand: ' + datei.name);
    gut(datei.text.charCodeAt(0) === 0xfeff,
      'Download „' + ich + '" trägt einen BOM — sonst rät Android Latin-1');
    gut(datei.text.includes(KOPF[ich]),
      'Download „' + ich + '" trägt die Überschrift seiner Abteilung');
    /* „ist allein" wird STRUKTURELL geprüft, nicht am Wortlaut. Die erste
       Fassung suchte den Titel der anderen Abteilung im Text — und wurde rot,
       sobald der Fahrplan in Abschnitt 11 die Mappe selbst beschreibt und
       dabei das Wort „Forschungsunterlagen" benutzt. Ein Wächter nagelt eine
       AUSSAGE fest, keine Wörter: es liegt genau EINE Abteilung darin, und es
       ist die richtige. */
    /* Nur echte Abschnitte zählen. Ein bloßes /data-abteilung="…"/ fängt auch
       den CSS-Wähler `[data-abteilung="privat"] .hinweis` im Stilblock mit —
       und zählte den Fahrplan doppelt, ohne dass etwas doppelt dastand. */
    const drin = [...datei.text.matchAll(/<section[^>]*\sdata-abteilung="([^"]+)"/g)]
      .map((m) => m[1]);
    gut(drin.length === 1 && drin[0] === ich,
      'Download „' + ich + '" enthält genau diese eine Abteilung',
      'gefunden: ' + (drin.join(' · ') || 'keine'));
    gut(!datei.text.includes('id="' + andere + '"'),
      'Download „' + ich + '" trägt „' + andere + '" nicht mit');
    gut(datei.text.includes('<style>') && datei.text.includes('data-abteilung'),
      'Download „' + ich + '" ist eine vollständige Seite, kein Bruchstück');
    /* In der herausgenommenen Datei liegt kein Skript. Bliebe ein Knopf
       darin stehen, wäre er ein toter Knopf MIT Beschriftung — er sähe aus
       wie Hilfe und täte nichts. */
    gut(!/<button/.test(datei.text),
      'Download „' + ich + '" trägt keinen toten Knopf');
    gut(datei.text.includes('Klaus Nitzsche') && /Stand 2026-/.test(datei.text),
      'Download „' + ich + '" trägt Verfasser und Datum in sich');
    /* Und die Tablet-Falle auch hier: in der herausgenommenen Datei darf
       kein relativer Verweis stehen. Sie liegt beim Öffnen unter
       content://… und hätte kein Verzeichnis, gegen das sie auflöst. */
    const relativ = [...datei.text.matchAll(/href="([^"]*)"/g)]
      .map((m) => m[1]).filter((h) => !/^(#|https?:\/\/|mailto:)/.test(h));
    gut(relativ.length === 0, 'Download „' + ich + '" hat keinen relativen Verweis',
      relativ.slice(0, 4).join(' · '));
  }
}

await browser.close();

console.log(rot === 0
  ? '\nsmoke_antragsmappe_browser: alles grün'
  : '\nsmoke_antragsmappe_browser: ' + rot + ' ROT');
process.exit(rot === 0 ? 0 : 1);
