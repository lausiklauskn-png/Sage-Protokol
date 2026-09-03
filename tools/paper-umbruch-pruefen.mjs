/* paper-umbruch-pruefen.mjs — misst, ob im Druck ein Block über eine
 * Seitengrenze zerrissen wird.
 *
 * Aufruf:  node tools/paper-umbruch-pruefen.mjs docs/papers/sbkim-paper-de.html
 *
 * ── WARUM GEOMETRIE UND NICHT TEXT ────────────────────────────────────────
 *
 * Der erste Anlauf am 2026-09-03 suchte im ausgelesenen PDF-Text nach Seiten,
 * die mit einer Großbuchstaben-Zeile beginnen, und nannte das „zerrissen".
 * Er konnte damit den FEHLER (Tabelle bricht um, Rest steht oben auf der
 * nächsten Seite) nicht vom RICHTIGEN Fall unterscheiden (Tabelle beginnt
 * sauber oben auf einer neuen Seite). Beide sehen im Text gleich aus. Er
 * meldete fünf CSS-Varianten als wirkungslos, darunter eine, die wirkte.
 *
 * Gemessen wird deshalb die LAGE: Oberkante und Unterkante jedes Blocks im
 * Druck-Layout, gegen die Seitengrenzen gerechnet. Liegen sie in
 * verschiedenen Seiten, ist der Block zerrissen — das ist eine Tatsache über
 * die Geometrie, nicht über die Wortwahl.
 *
 * ── DIE GRENZE, DIE DABEISTEHT ────────────────────────────────────────────
 *
 * Das ist das Druck-Layout des Browsers, nicht das fertige PDF. Chromium
 * verschiebt beim eigentlichen Druck noch (Witwen, Waisen, Umbruch-Regeln).
 * Ein Befund hier ist ein starker Hinweis und ein Fund am fertigen PDF ist
 * der Beweis. Wer „grün" meldet, hat das PDF angesehen.
 */

import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argumente = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (argumente.length !== 1) {
  console.error('Aufruf: node tools/paper-umbruch-pruefen.mjs <paper.html>');
  process.exit(2);
}
const QUELLE = resolve(WURZEL, argumente[0]);
if (!existsSync(QUELLE)) { console.error('FEHLT: ' + argumente[0]); process.exit(2); }

/* A4 abzüglich der Ränder, die tools/paper-zu-pdf.mjs setzt (18 mm ringsum).
   Steht an EINER Stelle je Werkzeug; laufen sie auseinander, misst der Prüfer
   eine Seite, die so nie gedruckt wird. */
const MM = 96 / 25.4;
const RAND_MM = 18;
const SEITE_H = (297 - 2 * RAND_MM) * MM;
const SEITE_B = (210 - 2 * RAND_MM) * MM;

const { chromium } = await import('playwright-core');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const seite = await browser.newPage({ viewport: { width: Math.round(SEITE_B), height: Math.round(SEITE_H) } });
await seite.emulateMedia({ media: 'print' });
await seite.goto(pathToFileURL(QUELLE).href, { waitUntil: 'load' });
await seite.evaluate(() => document.fonts.ready);

const befund = await seite.evaluate((H) => {
  const oben = document.body.getBoundingClientRect().top + window.scrollY;
  const messe = (el) => {
    const r = el.getBoundingClientRect();
    const o = r.top + window.scrollY - oben;
    const u = r.bottom + window.scrollY - oben;
    return { seiteOben: Math.floor(o / H) + 1, seiteUnten: Math.floor((u - 1) / H) + 1,
             hoehe: Math.round(r.height), restAufSeite: Math.round(H - (o % H)) };
  };
  const raus = [];
  document.querySelectorAll('table, .protocol-box, .abstract, .layer-diagram, .dim-grid').forEach((el) => {
    const m = messe(el);
    const kopf = el.querySelector('th');
    raus.push({ art: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
                text: (kopf ? kopf.innerText : (el.innerText || '')).replace(/\s+/g, ' ').trim().slice(0, 42),
                ...m });
  });
  const h2 = Array.from(document.querySelectorAll('h2')).map((el) => {
    const m = messe(el);
    return { titel: el.innerText.replace(/\s+/g, ' ').trim().slice(0, 44), seite: m.seiteOben,
             restAufSeite: m.restAufSeite };
  });
  return { bloecke: raus, abschnitte: h2, gesamt: Math.ceil(document.body.scrollHeight / H) };
}, SEITE_H);

console.log('Druck-Layout: rund ' + befund.gesamt + ' Seiten (A4, ' + RAND_MM + ' mm Rand)\n');

const zerrissen = befund.bloecke.filter(b => b.seiteOben !== b.seiteUnten);
if (zerrissen.length === 0) {
  console.log('✓ Kein Block über eine Seitengrenze.');
} else {
  console.log('✗ ' + zerrissen.length + ' Block/Blöcke über eine Seitengrenze:');
  for (const b of zerrissen) {
    console.log('   · ' + b.art + ' „' + b.text + '" — Seite ' + b.seiteOben + ' → ' + b.seiteUnten +
                ' (' + b.hoehe + ' px hoch, nur noch ' + b.restAufSeite + ' px Platz)');
  }
}

console.log('\nHauptabschnitte:');
for (const a of befund.abschnitte) {
  const eng = a.restAufSeite < 140 ? '  ⚠ steht dicht am Seitenfuß' : '';
  console.log('   S' + String(a.seite).padStart(2) + '  ' + a.titel + eng);
}

await browser.close();
process.exit(zerrissen.length ? 1 : 0);
