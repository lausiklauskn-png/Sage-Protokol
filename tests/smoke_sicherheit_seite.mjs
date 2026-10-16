/* smoke_sicherheit_seite.mjs — sicherheit.html, der Überblick zu Mycel, Siegel und Schutz (2026-10-17).
 *
 * Lauf:  node tests/smoke_sicherheit_seite.mjs [pfad/zur/sicherheit.html] [--traeger]
 * Teil A liest die Datei (ohne Browser). Teil B braucht `playwright-core`;
 * fehlt es, ist Teil B nicht lauffähig (⊘), nicht rot.
 *
 * A1 noindex · A2 kein fremder Abruf (kein src/stylesheet von außen) · A3 kein App-Name
 * in der neutralen Vorlage · A4 jeder Sprung (#…) hat ein Ziel, und zwar in SEINER Sprache
 * · A5 jede deutsche Stelle hat ihr englisches Gegenstück · A6 die Pflicht-Abschnitte
 * (auch „Warum es Schutz braucht“ und S1–S5b) · A7 Verweise auf Paper S und das SBKIM-Paper
 * · A8 kein Gedankenstrich als Trenner im sichtbaren Text · A9 keine doppelte id.
 * B1 Deutsch steht da, Englisch nicht · B2 Wort-Link springt, Ziel markiert, „↩ zurück“
 * schwebt und steht am Ziel · B3 „↩ zurück“ führt an die Herkunft · B4 zweiter Tipp auf
 * dasselbe Wort führt zurück · B5 Tipp auf das erklärte Wort führt zurück · B6 ?lang=en ·
 * B7 eingebettet: Sprache der Seite drumherum, Rückweg ausgeblendet · B8 Sprachknopf ·
 * B9 data-sprache-schluessel · B10 ohne Skript: Deutsch, Sprünge gehen · B11 kein Abruf
 * nach außen, kein Konsolenfehler · B12 360 px ohne Querlauf.
 */
import { readFileSync, mkdtempSync, writeFileSync, copyFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pfadArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
const DATEI = pfadArg ? resolve(pfadArg) : join(WURZEL, 'sicherheit.html');
// --traeger: the copy in an app may carry its own name (title, own sections); A3 only holds for the neutral template
const TRAEGER = process.argv.includes('--traeger');
let gruen = 0, rot = 0, nicht = 0;
function t(name, ok, extra) {
  if (ok) { gruen++; console.log('✓ ' + name); }
  else { rot++; console.log('✗ ROT: ' + name + (extra ? ' — ' + String(extra).slice(0, 300) : '')); }
}

const html = readFileSync(DATEI, 'utf8');
const ohneKommentar = html.replace(/<!--[\s\S]*?-->/g, '');
const block = (id) => {
  const m = new RegExp('<div id="' + id + '"[^>]*data-sprache="' + id + '"[^>]*>([\\s\\S]*?)\\n</div>\\n').exec(ohneKommentar);
  return m ? m[1] : '';
};
const DE = block('de'), EN = block('en');

console.log('── A · die Datei ──');
t('A1 noindex steht im Kopf (oder, bei einem Träger, ein canonical)', /<meta name="robots" content="noindex">/.test(html) || (TRAEGER && /<link rel="canonical"/.test(html)));
const fremd = [...ohneKommentar.matchAll(/<(script|img|iframe|link|source|video|audio)\b[^>]*\b(src|href)=["']([^"']+)["']/gi)]
  .filter((m) => m[1].toLowerCase() !== 'link' || /stylesheet|preload|icon|manifest/i.test(m[0]))
  .map((m) => m[3]).filter((u) => /^(https?:)?\/\//i.test(u));   // only what comes from another host
t('A2 kein fremder Abruf (nichts wird von außen geladen)', fremd.length === 0, fremd.join(' '));
const APPS = ['Mixarium', 'Rezeptbuch', 'Kimboard', 'Kim-Bell', 'Kimseek', 'BookLedger', 'Toolpoint', 'family-projekt',
  'Küchenzettel', 'Kuechenzettel', 'Jasons', 'Tomys', 'WorkFloh', 'Workfloh', 'Company Brain', 'Privat-Brain', 'Alis',
  'Perfect Skin', 'Sende-Prüfer', 'Auslieferungsprüfer', 'In-and-Out', 'Tresor-App'];
const sichtbar = (s) => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const treffer = APPS.filter((a) => sichtbar(ohneKommentar).includes(a));
if (TRAEGER) console.log('· A3 entfällt (Kopie eines Trägers, darf ihren Namen tragen)');
else t('A3 kein App-Name in der neutralen Vorlage', treffer.length === 0, treffer.join(', '));
t('A4a beide Sprachblöcke sind da und nicht leer', DE.length > 5000 && EN.length > 5000, DE.length + ' / ' + EN.length);
const ids = (s) => new Set([...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const sprunge = (s) => [...s.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]);
const idsDE = ids(DE), idsEN = ids(EN);
const totDE = sprunge(DE).filter((x) => !idsDE.has(x));
const totEN = sprunge(EN).filter((x) => !idsEN.has(x));
t('A4b jeder Sprung im deutschen Teil landet im deutschen Teil', totDE.length === 0 && sprunge(DE).length > 40, totDE.join(' ') + ' · Sprünge ' + sprunge(DE).length);
t('A4c jeder Sprung im englischen Teil landet im englischen Teil', totEN.length === 0 && sprunge(EN).length > 40, totEN.join(' ') + ' · Sprünge ' + sprunge(EN).length);
const ohneGegen = [...idsDE].filter((x) => !/^de-bild/.test(x) && !idsEN.has('en-' + x));
t('A5a jede deutsche Stelle hat ihr englisches Gegenstück (en-…)', ohneGegen.length === 0, ohneGegen.join(' '));
t('A5b gleich viele Wort-Links in beiden Sprachen', (DE.match(/class="w"/g) || []).length === (EN.match(/class="w"/g) || []).length,
  (DE.match(/class="w"/g) || []).length + ' / ' + (EN.match(/class="w"/g) || []).length);
const PFLICHT = ['mycel', 'nutzen', 'fenster', 'karten', 'siegel', 'lampen', 'warum', 'schutz', 'eigenes-netz', 'empfehlen',
  'regel', 'offen', 'mehr', 'woerter', 's1', 's2', 's3', 's4', 's5', 's5b', 'pruefliste', 'echtheit', 'antworten'];
const fehlt = PFLICHT.filter((x) => !idsDE.has(x));
t('A6a die Pflicht-Abschnitte stehen da (auch „Warum“ und S1–S5b)', fehlt.length === 0, fehlt.join(' '));
const WOERTER = ['Bedeutung passt zur Beschreibung', 'Bedeutung aus Inhalten, nicht nachprüfbar', 'Derselbe Name noch',
  'unbestätigt (nicht unterschrieben)', 'Netzadmin', 'Empfehlung unterschreiben', 'Sicherheitsnummer', 'Sperrliste',
  'Netz-Code', 'Rechenaufwand', 'LEBT', 'VERKEHR', 'FREMD', 'Bronze', 'Gold', 'Identitäts-Wechsler',
  'Wer ist im Raum?', 'Mit dem Knotennetz verbinden', 'Kennung sichern', '180 Tage', 'Prüfliste',
  'gefälschte Visitenkarte', 'Jedes öffentliche Signal lässt sich nachahmen'];
const fehltW = WOERTER.filter((w) => !sichtbar(DE).includes(w));
t('A6b die Namen aus der Oberfläche stehen wörtlich da', fehltW.length === 0, fehltW.join(' | '));
t('A7a Verweis auf Paper S', /docs\/papers\/sicherer-umgang-im-knotennetz\.md/.test(DE) && /sicherer-umgang-im-knotennetz\.md/.test(EN));
t('A7b Verweis auf das SBKIM-Paper (DOI)', /doi\.org\/10\.5281\/zenodo\.22277738/.test(DE) && /doi\.org\/10\.5281\/zenodo\.22277738/.test(EN));
const striche = (sichtbar(DE).match(/\s[—–]\s/g) || []).length;
t('A8 kein Gedankenstrich als Trenner im deutschen Text (Klaus 2026-10-16)', striche === 0, striche + ' Stück');
const alle = [...ohneKommentar.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const doppelt = alle.filter((x, i) => alle.indexOf(x) !== i);
t('A9 keine id doppelt', doppelt.length === 0, doppelt.join(' '));

console.log('── B · im Browser ──');
let chromium;
try { ({ chromium } = await import('playwright-core')); } catch (_e) { chromium = null; }
if (!chromium) {
  nicht++; console.log('⊘ Teil B nicht lauffähig: playwright-core fehlt (npm install)');
} else {
  const basis = mkdtempSync(join(tmpdir(), 'sicherheit-'));
  copyFileSync(DATEI, join(basis, 'sicherheit.html'));
  // a carrier's own scripts (relative) come along, so the copy behaves like the real page
  for (const m of readFileSync(DATEI, 'utf8').matchAll(/<script[^>]+src="(?!https?:|\/\/)([^"?]+)/g)) {
    try { mkdirSync(dirname(join(basis, m[1])), { recursive: true }); copyFileSync(join(dirname(DATEI), m[1]), join(basis, m[1])); } catch (_e) {}
  }
  const geschluesselt = readFileSync(DATEI, 'utf8').replace(/ data-sprache-schluessel="[^"]*"/, '')
    .replace('<html lang="de"', '<html lang="de" data-sprache-schluessel="probe_lang"');
  writeFileSync(join(basis, 'mit-schluessel.html'), geschluesselt);
  const huelle = (lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>H</title></head><body>
<iframe id="f" src="sicherheit.html" style="width:800px;height:700px"></iframe></body></html>`;
  writeFileSync(join(basis, 'huelle-en.html'), huelle('en'));
  writeFileSync(join(basis, 'huelle-de.html'), huelle('de'));
  const PORT = 8000 + Math.floor(Math.random() * 900) + 300;
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: basis, stdio: 'ignore' });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] })
    .catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
  const url = (f) => `http://127.0.0.1:${PORT}/${f}`;
  try {
    // wait for the server
    for (let i = 0; i < 50; i++) { try { const r = await fetch(url('sicherheit.html')); if (r.ok) break; } catch (_e) {} await new Promise((r) => setTimeout(r, 100)); }
    const ctx = await browser.newContext({ viewport: { width: 900, height: 800 }, locale: 'de-DE', reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const aussen = [], fehler = [];
    p.on('request', (r) => { if (!r.url().startsWith(url(''))) aussen.push(r.url()); });
    p.on('pageerror', (e) => fehler.push(String(e)));
    // favicon.ico asks the browser by itself; it is not a request of the page
    p.on('response', (r) => { if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) fehler.push(r.status() + ' ' + r.url()); });
    p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) fehler.push(m.text()); });
    await p.goto(url('sicherheit.html'), { waitUntil: 'load' });
    const lage = await p.evaluate(() => ({ de: !document.getElementById('de').hidden, en: !document.getElementById('en').hidden,
      lang: document.documentElement.lang, knopf: !document.querySelector('#de [data-sprachknopf]').hidden }));
    t('B1 Deutsch steht da, Englisch nicht, lang=de, Sprachknopf sichtbar', lage.de && !lage.en && lage.lang === 'de' && lage.knopf, JSON.stringify(lage));

    // B2 jump from the "Spore" word in the short box
    const link = '#kurz a.w[href="#w-spore"]';
    await p.click(link);
    await p.waitForTimeout(150);
    const b2 = await p.evaluate(() => {
      const z = document.getElementById('w-spore'); const r = z.getBoundingClientRect();
      return { markiert: z.classList.contains('ziel'), imBild: r.top >= -2 && r.top < innerHeight / 2,
        schwebe: !document.getElementById('rueckSchwebe').hidden, hier: !!z.querySelector('[data-rueck-hier]') };
    });
    t('B2 ein Tipp auf das Wort springt zur Erklärung, markiert sie, „↩ zurück“ schwebt und steht am Ziel',
      b2.markiert && b2.imBild && b2.schwebe && b2.hier, JSON.stringify(b2));

    // B3 back via the floating button
    await p.click('#rueckSchwebe');
    await p.waitForTimeout(150);
    const b3 = await p.evaluate((sel) => {
      const a = document.querySelector(sel); const r = a.getBoundingClientRect();
      return { imBild: r.top >= 0 && r.bottom <= innerHeight, schwebe: !document.getElementById('rueckSchwebe').hidden,
        hier: !!document.querySelector('[data-rueck-hier]'), markiert: !!document.querySelector('#w-spore.ziel') };
    }, link);
    t('B3 „↩ zurück“ führt an die Stelle, von der man kam, und räumt auf', b3.imBild && !b3.schwebe && !b3.hier && !b3.markiert, JSON.stringify(b3));

    // B4 second tap on the same word goes back
    const quelle = await p.evaluate(() => {
      const a = [...document.querySelectorAll('#de a.w')].find((x) => x.getAttribute('href') === '#w-vektor');
      a.scrollIntoView({ block: 'center' }); a.setAttribute('data-probe', '1'); return !!a;
    });
    await p.click('[data-probe="1"]');
    await p.waitForTimeout(100);
    const weg = await p.evaluate(() => document.querySelector('[data-probe="1"]').getBoundingClientRect().top);
    await p.evaluate(() => document.querySelector('[data-probe="1"]').click());
    await p.waitForTimeout(150);
    const b4 = await p.evaluate(() => { const r = document.querySelector('[data-probe="1"]').getBoundingClientRect();
      return { top: r.top, imBild: r.top >= 0 && r.bottom <= innerHeight, schwebe: !document.getElementById('rueckSchwebe').hidden }; });
    t('B4 ein zweiter Tipp auf dasselbe Wort führt zurück', quelle && b4.imBild && !b4.schwebe, 'nach Sprung ' + weg + ' · ' + JSON.stringify(b4));

    // B5 tap on the explained term goes back
    await p.click('[data-probe="1"]');
    await p.waitForTimeout(100);
    await p.click('#w-vektor', { position: { x: 4, y: 6 } });
    await p.waitForTimeout(150);
    const b5 = await p.evaluate(() => { const r = document.querySelector('[data-probe="1"]').getBoundingClientRect();
      return { imBild: r.top >= 0 && r.bottom <= innerHeight, schwebe: !document.getElementById('rueckSchwebe').hidden }; });
    t('B5 ein Tipp auf das erklärte Wort selbst führt zurück', b5.imBild && !b5.schwebe, JSON.stringify(b5));

    // B8 language button
    await p.evaluate(() => scrollTo(0, 0));
    await p.click('#de [data-sprachknopf]');
    const b8 = await p.evaluate(() => ({ en: !document.getElementById('en').hidden, de: !document.getElementById('de').hidden,
      lang: document.documentElement.lang, h1: document.querySelector('#en h1').textContent }));
    t('B8 der Sprachknopf schaltet auf Englisch', b8.en && !b8.de && b8.lang === 'en' && /How the mycelium works/.test(b8.h1), JSON.stringify(b8));
    // B8b jump inside the English part works too
    await p.click('#en-kurz a.w[href="#en-w-spore"]');
    await p.waitForTimeout(120);
    const b8b = await p.evaluate(() => ({ m: document.getElementById('en-w-spore').classList.contains('ziel'),
      t: document.getElementById('rueckSchwebe').textContent }));
    t('B8b auf Englisch springt das Wort ebenso, der Knopf heißt „↩ back“', b8b.m && /back/.test(b8b.t), JSON.stringify(b8b));
    t('B11 kein Abruf nach außen, kein Konsolenfehler', aussen.length === 0 && fehler.length === 0, aussen.concat(fehler).join(' | '));
    await ctx.close();

    // B6 ?lang=en
    const c6 = await browser.newContext({ locale: 'de-DE' }); const p6 = await c6.newPage();
    await p6.goto(url('sicherheit.html?lang=en'));
    const b6 = await p6.evaluate(() => ({ en: !document.getElementById('en').hidden, lang: document.documentElement.lang }));
    t('B6 ?lang=en zeigt Englisch', b6.en && b6.lang === 'en', JSON.stringify(b6));
    await c6.close();

    // B7 embedded: follows the surrounding page, back link hidden
    for (const [huelle, soll] of [['huelle-en.html', 'en'], ['huelle-de.html', 'de']]) {
      const c7 = await browser.newContext({ locale: soll === 'en' ? 'de-DE' : 'en-US' }); const p7 = await c7.newPage();
      await p7.goto(url(huelle)); const f = p7.frame({ url: /sicherheit\.html/ }) || p7.frames()[1];
      await f.waitForLoadState('load');
      const b7 = await f.evaluate(() => ({ lang: document.documentElement.lang,
        rueckweg: [...document.querySelectorAll('[data-zurueck]')].every((a) => getComputedStyle(a).display === 'none') }));
      t(`B7 eingebettet in eine Seite mit lang=${soll}: ${soll}, Rückweg ausgeblendet`, b7.lang === soll && b7.rueckweg, JSON.stringify(b7));
      await c7.close();
    }

    // B9 a carrier's own language key
    const c9 = await browser.newContext({ locale: 'de-DE' });
    await c9.addInitScript(() => { try { localStorage.setItem('probe_lang', 'en'); } catch (_e) {} });
    const p9 = await c9.newPage(); await p9.goto(url('mit-schluessel.html'));
    t('B9 data-sprache-schluessel: die Wahl der App gilt', (await p9.evaluate(() => document.documentElement.lang)) === 'en');
    await c9.close();

    // B10 without JavaScript
    const c10 = await browser.newContext({ javaScriptEnabled: false }); const p10 = await c10.newPage();
    await p10.goto(url('sicherheit.html'));
    const b10a = await p10.evaluate(() => ({ de: document.getElementById('de').offsetHeight > 0, en: document.getElementById('en').offsetHeight === 0 }));
    await p10.click('#kurz a.w[href="#w-spore"]'); await p10.waitForTimeout(100);
    const b10b = await p10.evaluate(() => location.hash);
    t('B10 ohne Skript: Deutsch steht da, die Sprünge gehen trotzdem', b10a.de && b10a.en && b10b === '#w-spore', JSON.stringify(b10a) + ' ' + b10b);
    await c10.close();

    // B12 narrow screen
    const c12 = await browser.newContext({ viewport: { width: 360, height: 740 } }); const p12 = await c12.newPage();
    await p12.goto(url('sicherheit.html'));
    const q = await p12.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    t('B12 bei 360 px läuft die Seite nicht quer', q <= 0, q + ' px zu breit');
    await c12.close();
  } finally {
    await browser.close(); server.kill(); rmSync(basis, { recursive: true, force: true });
  }
}

console.log(`\n${gruen} grün · ${rot} ROT · ${nicht} nicht lauffähig`);
process.exit(rot ? 1 : 0);
