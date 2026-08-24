/* smoke_historie.mjs — bewacht die Historien-Dokumentation.
 *
 * Lauf:  node tests/smoke_historie.mjs
 * Der Browser-Teil braucht `playwright-core`. Fehlt es, laeuft der Rest
 * trotzdem, und was ungeprueft blieb, wird benannt statt uebergangen.
 *
 * ── DIE ZUSICHERUNG, DIE HIER AM MEISTEN WIEGT ─────────────────────────────
 *
 * Nicht „die Seite sieht gut aus", sondern: **der Bericht erfindet keine
 * Zahl.** Er soll einem Gutachter vorgelegt werden. Ein Bericht ueber die
 * eigene Arbeit, der seine Zahlen selbst erfindet, ist wertlos, und zwar auch
 * dann, wenn sie zufaellig stimmen.
 *
 * Geprueft wird deshalb jede Zahl der Kopfkacheln GEGEN die ausgelesenen
 * Daten, und die Summe der Depot-Zahlen gegen die Gesamtzahl. Eine Zahl, die
 * nur im Bericht steht und nirgendwo sonst, faellt auf.
 *
 * Dazu die drei EHRLICHKEITS-SAETZE. Sie sind kein Beiwerk:
 *   · die Marken-Zahlen sind Untergrenzen, keine Vollerhebung,
 *   · die Tages-Spanne ist keine Arbeitszeit,
 *   · achtzehn Klone waren flach und mussten vervollstaendigt werden.
 * Ohne sie liest sich der Bericht genauer, als er ist. Ein Dokument, das
 * seine eigenen Grenzen verschweigt, ist im Antragswesen gefaehrlicher als
 * eines, das eine Zahl weniger nennt.
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
/* DIESELBE Einordnung wie der Bericht. Eine zweite Fassung hier wuerde
   irgendwann etwas anderes zaehlen als der Bericht zeigt, und beide waeren
   gruen. */
import { markenFuer } from '../tools/historie-marken.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const JSON_PFAD = resolve(WURZEL, 'docs/historie/historie.json');
const HTML_PFAD = resolve(WURZEL, 'docs/historie/historie.html');

let rot = 0, ungeprueft = 0;
const gut = (b, was, dazu) => {
  if (b) { console.log('  ok   ' + was); return true; }
  rot++;
  console.log('  ROT  ' + was + (dazu ? '\n       ' + dazu : ''));
  return false;
};

gut(existsSync(JSON_PFAD), 'die ausgelesenen Daten liegen vor');
gut(existsSync(HTML_PFAD), 'der Bericht liegt vor');

const d = JSON.parse(readFileSync(JSON_PFAD, 'utf-8'));
const html = readFileSync(HTML_PFAD, 'utf-8');
const s = d.summe;

/* ── 1 · Die Daten sind in sich stimmig ───────────────────────────────── */

gut(d.commits.length === s.commits,
  'die Commit-Liste ist so lang wie die genannte Summe',
  d.commits.length + ' gegen ' + s.commits);
gut(d.depots.reduce((n, r) => n + r.commits, 0) === s.commits,
  'die Depot-Zahlen addieren sich zur Gesamtzahl');
gut(d.depots.reduce((n, r) => n + r.zweige, 0) === s.zweige,
  'dasselbe fuer die Zweige');
gut(d.commits.every((c) => /^[0-9a-f]{9}$/.test(c.sha)),
  'jeder Commit traegt eine echte Kennung, kein Bruchstueck einer Statistik-Zeile',
  (d.commits.find((c) => !/^[0-9a-f]{9}$/.test(c.sha)) || {}).sha);
gut(d.commits.every((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.datum) && /^\d{2}:\d{2}$/.test(c.zeit)),
  'jeder Commit traegt Datum und Uhrzeit');
gut(s.zeilenPlus > 0 && s.zeilenMinus > 0,
  'die Zeilenzahlen sind gelesen worden, nicht null geblieben',
  '+' + s.zeilenPlus + ' / -' + s.zeilenMinus);

/* Die Spanne muss die genannte sein, nicht eine gerundete. */
const tage = [...new Set(d.commits.map((c) => c.datum))].sort();
gut(tage.length === s.arbeitstage && tage[0] === s.erster
  && tage[tage.length - 1] === s.letzter,
  'erster Tag, letzter Tag und Anzahl der Arbeitstage stimmen mit den Daten ueberein');

/* ── 2 · Der Bericht erfindet keine Zahl ──────────────────────────────── */

const deutsch = (n) => Number(n).toLocaleString('de-DE');
const kacheln = [
  [s.commits, 'Commits'], [s.depots, 'Depots'], [s.zweige, 'Zweige'],
  [s.arbeitstage, 'Tage mit Arbeit'], [s.zeilenPlus, 'Zeilen dazu'],
  [s.zeilenMinus, 'Zeilen entfernt'], [s.nurImZweig, 'Commits nie auf main'],
  [s.merges, 'Merges'],
];
for (const [wert, text] of kacheln) {
  gut(html.includes('<b>' + deutsch(wert) + '</b><span>' + text + '</span>'),
    'die Kachel „' + text + '" nennt die gemessene Zahl ' + deutsch(wert));
}

/* Jeder Commit steht wirklich darin. Ein Bericht, der 5.823 behauptet und
   5.000 zeigt, ist die schlimmste Sorte: er sieht vollstaendig aus. */
const imBericht = (html.match(/<li class="c"/g) || []).length;
gut(imBericht === s.commits,
  'alle ' + deutsch(s.commits) + ' Commits stehen wirklich im Bericht',
  'gezaehlt: ' + imBericht);

const tageImBericht = (html.match(/<div class="tag">/g) || []).length;
gut(tageImBericht === s.arbeitstage,
  'jeder der ' + s.arbeitstage + ' Arbeitstage hat einen eigenen Abschnitt',
  'gezaehlt: ' + tageImBericht);

/* ── 3 · Die Ehrlichkeits-Saetze ──────────────────────────────────────── */

for (const [was, muster] of [
  ['die Marken-Zahlen sind Untergrenzen', /Untergrenzen, keine\s*\n?\s*Vollerhebung/],
  ['die Tages-Spanne ist keine Arbeitszeit', /Spanne und keine\s*\n?\s*Arbeitszeit/],
  ['achtzehn Klone waren flach', /flach<\/em> und trugen nur die/],
  ['die Einordnung geschieht an Woertern', /Einordnung eines Commits geschieht an/],
]) {
  gut(muster.test(html), 'der Bericht sagt selbst: ' + was);
}

/* ── 4 · Die Sackgassen sind benannt ──────────────────────────────────── */

gut(html.includes('id="sackgassen"') && html.includes(deutsch(s.nurImZweig)),
  'die Sackgassen haben einen eigenen Abschnitt mit der gemessenen Zahl');
/* GEZAEHLT, nicht gefunden. Die erste Fassung fragte nur, ob irgendwo
   `data-main="nein"` steht. Das steht auch in der CSS-Regel
   `li.c[data-main="nein"]{…}` und war deshalb wahr, selbst als KEIN einziger
   Commit mehr so gekennzeichnet war. Die Gegenprobe hat es gefangen: ein
   Waechter, der seinen eigenen Stylesheet fuer Daten haelt.
   Gezaehlt wird jetzt gegen die gemessene Zahl. */
const gekennzeichnet = (html.match(/<li class="c"[^>]*data-main="nein"/g) || []).length;
gut(gekennzeichnet === s.nurImZweig,
  'alle ' + deutsch(s.nurImZweig) + ' Commits ohne main sind einzeln gekennzeichnet',
  'gezaehlt: ' + gekennzeichnet);

/* ── 5 · Die Rollen ───────────────────────────────────────────────────── */

for (const r of ['Klaus, der Betreiber', 'Die Sitzung, also ich',
  'Die Wächter', 'Die Werkstatt-Agenten']) {
  gut(html.includes(r), 'die Rolle „' + r + '" ist beschrieben');
}
gut((html.match(/<strong>Aufgabe\.<\/strong>/g) || []).length === 4
  && (html.match(/<strong>Gemessen:<\/strong>/g) || []).length === 4,
  'jede Rolle nennt Aufgabe, Erfuellung und eine gemessene Zahl');

/* ── 6 · Der Bericht laeuft wirklich ──────────────────────────────────── */

let chromium = null;
try { ({ chromium } = await import('playwright-core')); } catch { chromium = null; }

if (!chromium) {
  console.log('  ⊘    der Browser-Teil ist NICHT GEPRUEFT (playwright-core fehlt)');
  ungeprueft++;
} else {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await browser.newPage();
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(String(e)));
  await p.goto(pathToFileURL(HTML_PFAD).href);
  await p.waitForSelector('li.c');
  gut(fehler.length === 0, 'der Bericht laedt ohne Skriptfehler', fehler[0]);

  /* Der Filter wird WIRKLICH gedrueckt, und gemessen wird die SICHTBARKEIT,
     nicht ein Attribut. Ein Waechter auf „die Klasse steht dran" waere gruen,
     waehrend die Seite alles zeigt. */
  const vorher = await p.evaluate(() =>
    [...document.querySelectorAll('li.c')].filter((n) => n.offsetHeight > 0).length);
  gut(vorher === s.commits, 'ohne Filter sind alle Commits sichtbar',
    'sichtbar: ' + vorher);

  await p.click('[data-filter="selbstkorrektur"]');
  await p.waitForTimeout(400);
  const gefiltert = await p.evaluate(() => {
    const sicht = [...document.querySelectorAll('li.c')].filter((n) => n.offsetHeight > 0);
    return {
      anzahl: sicht.length,
      alleMitMarke: sicht.every((n) =>
        (n.getAttribute('data-marken') || '').split(' ').includes('selbstkorrektur')),
    };
  });
  const sollte = d.commits.filter((c) => markenFuer(c).includes('selbstkorrektur')).length;
  gut(gefiltert.anzahl === sollte,
    'der Filter zeigt genau die ' + sollte + ' passenden Commits',
    'sichtbar: ' + gefiltert.anzahl);
  gut(gefiltert.alleMitMarke,
    'und jeder sichtbare traegt die Marke wirklich');
  gut(gefiltert.anzahl < vorher,
    'es wird also gefiltert und nicht nur eine Klasse gesetzt');

  await p.click('[data-filter="alle"]');
  await p.waitForTimeout(400);
  const zurueck = await p.evaluate(() =>
    [...document.querySelectorAll('li.c')].filter((n) => n.offsetHeight > 0).length);
  gut(zurueck === s.commits, '„alles zeigen" bringt alle zurueck',
    'sichtbar: ' + zurueck);

  await browser.close();
}

console.log('\nsmoke_historie: ' + (rot === 0 ? 'alles gruen' : rot + ' ROT')
  + (ungeprueft ? ' · ' + ungeprueft + ' ungeprueft' : '')
  + ' · Datei ' + Math.round(statSync(HTML_PFAD).size / 1024) + ' KB');
process.exit(rot === 0 ? 0 : 1);
