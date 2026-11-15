#!/usr/bin/env node
/* smoke_startseite_bedienung.mjs — Startseite: Sonne und Schwarzes Loch sind Knöpfe (kein Verweis,
 * der Browser zeigt keine Adresse), keine Klick-Sätze, der Theater-Text ist eingeklappt; im
 * Vollbild des Schwarzen Lochs lässt sich die Auflösung von Hand stellen und die Regler-Leiste
 * einklappen (Klaus 2026-11-15).
 *
 *   node tests/smoke_startseite_bedienung.mjs
 *   TOPO_WURZEL=/pfad node tests/…          # prüft eine Kopie (für die Gegenprobe)
 *
 * Braucht `playwright-core`. Fehlt es: nicht lauffähig, nicht rot. Ohne WebGL2 im Browser werden
 * die Prüfungen am Vollbild als nicht messbar gemeldet, nicht als grün.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = process.env.TOPO_WURZEL || resolve(dirname(fileURLToPath(import.meta.url)), '..');
let gruen = 0, rot = 0;
const t = (name, ok, detail = '') => {
  if (ok) { gruen++; console.log('  ✓ ' + name); }
  else { rot++; console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
};
const ARTEN = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };

let chromium;
try { ({ chromium } = await import('playwright-core')); }
catch { console.log('⊘ nicht lauffähig: playwright-core fehlt (npm install)'); process.exit(0); }

const server = createServer((req, res) => {
  const p = join(WURZEL, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(WURZEL) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': ARTEN[extname(p)] || 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port;
const pfad = existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
const browser = await chromium.launch(pfad);

try {
  for (const [breite, hoehe] of [[1280, 800], [390, 844]]) {
    const seite = await browser.newPage({ viewport: { width: breite, height: hoehe } });
    const fehler = [];
    seite.on('pageerror', (e) => fehler.push(e.message));
    await seite.goto(`http://127.0.0.1:${PORT}/index.html?sl=live`, { waitUntil: 'load' });
    await seite.waitForFunction(() => document.querySelectorAll('#topology-svg .topo-node').length > 5, null, { timeout: 20000 });

    const lage = await seite.evaluate(() => {
      const eins = (q) => { const e = document.querySelector(q); return e ? { tag: e.tagName, href: e.getAttribute('href'), rolle: e.getAttribute('role'), tab: e.tabIndex } : null; };
      const sichtbar = (e) => !!e && e.getClientRects().length > 0 && e.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true });
      const d = document.querySelector('details.mehr-text');
      return {
        sonne: eins('.sun-stage'), loch: eins('.blackhole-stage'),
        // every text a visitor can read on the start page, including what is folded away
        text: document.body.textContent,
        // the lamp hint this page writes itself (status texts from status.json are not meant)
        titel: (document.getElementById('lamp-fremd') || { getAttribute: () => 'FEHLT' }).getAttribute('title') || '',
        details: d ? { offen: d.open, absatz: sichtbar(d.querySelector('p')), knopf: sichtbar(d.querySelector('summary')), laenge: d.querySelector('p').textContent.length } : null,
        ring: sichtbar(document.getElementById('ring-wrap')),
        zustand: (document.querySelector('.blackhole-scene').__sl || {}).zustand,
      };
    });
    const b = `${breite} breit: `;
    t(b + 'die Sonne ist ein Knopf, kein Verweis', !!lage.sonne && lage.sonne.tag !== 'A' && lage.sonne.href === null && lage.sonne.rolle === 'button' && lage.sonne.tab === 0, JSON.stringify(lage.sonne));
    t(b + 'das Schwarze Loch ist ein Knopf, kein Verweis', !!lage.loch && lage.loch.tag !== 'A' && lage.loch.href === null && lage.loch.rolle === 'button' && lage.loch.tab === 0, JSON.stringify(lage.loch));
    const saetze = (lage.text.match(/Klick auf [^.<]*|Klick aufs [^.<]*|tippe an[^.<]*|einzeln anklicken|Ziehen dreht die Ansicht/g) || []);
    t(b + 'kein Klick-Satz im Text der Seite', saetze.length === 0, saetze.slice(0, 3).join(' · '));
    t(b + 'der Kurzhinweis der Fremd-Lampe ist da und trägt keinen Klick-Satz', lage.titel.length > 10 && lage.titel !== 'FEHLT' && !/Klick/.test(lage.titel), lage.titel);
    t(b + 'der Theater-Text steht hinter einem Knopf (Text ist da, ' + (lage.details ? lage.details.laenge : 0) + ' Zeichen)', !!lage.details && lage.details.laenge > 200 && lage.details.knopf);
    t(b + 'der Theater-Text ist beim Laden eingeklappt', !!lage.details && !lage.details.offen && !lage.details.absatz);
    t(b + 'der Ring daneben bleibt sichtbar', lage.ring);

    // the stage opens the gallery: a click changes the screen
    await seite.evaluate(() => document.querySelector('.sun-stage').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
    const galerie = await seite.waitForFunction(() => { const s = document.getElementById('sonnen-stage'); return !!s && s.getClientRects().length > 0; }, null, { timeout: 5000 }).then(() => true, () => false);
    t(b + 'die Eingabetaste auf der Sonne öffnet die Galerie', galerie);
    await seite.close();

    // ---- full screen of the black hole ----
    const voll = await browser.newPage({ viewport: { width: breite, height: hoehe } });
    await voll.goto(`http://127.0.0.1:${PORT}/index.html?sl=live`, { waitUntil: 'load' });
    await voll.waitForFunction(() => { const z = document.querySelector('.blackhole-scene'); return !!z && !!z.__sl; }, null, { timeout: 20000 });
    if (lage.zustand !== 'live') { console.log('  ⊘ ' + b + 'Vollbild nicht messbar: kein WebGL2 in diesem Browser (Zustand „' + lage.zustand + '")'); await voll.close(); continue; }
    await voll.evaluate(() => document.querySelector('.blackhole-scene').__sl.oeffnen());
    const bild = () => voll.evaluate(() => { const a = document.querySelector('.blackhole-scene').__sl; return a.letzte ? { ...a.letzte, fest: !!a.st.fest } : null; });
    const warte = (bedingung) => voll.waitForFunction(bedingung, null, { timeout: 8000 }).then(() => true, () => false);
    await warte(() => !!document.querySelector('.sl-buehne.sl-da') && !!document.querySelector('.blackhole-scene').__sl.letzte);
    const tafel = await voll.evaluate(() => {
      const t = document.querySelector('.sl-tafel'), k = document.querySelector('.sl-tafel-kopf');
      return { da: !!t && !!k, zu: !!t && t.classList.contains('sl-eingeklappt'), hoehe: t ? t.getBoundingClientRect().height : 0,
               erweitert: k ? k.getAttribute('aria-expanded') : null, hilfe: !!document.querySelector('.sl-hilfe'),
               namen: [...document.querySelectorAll('.sl-tafel label span')].map((e) => e.textContent) };
    });
    t(b + 'Vollbild: kein Bedien-Hinweis über dem Bild', !tafel.hilfe);
    t(b + 'Vollbild: die Regler-Leiste hat einen Kopf zum Einklappen', tafel.da);
    if (breite <= 560) t(b + 'Vollbild: am schmalen Schirm startet die Leiste eingeklappt (' + Math.round(tafel.hoehe) + ' px hoch)', tafel.zu && tafel.erweitert === 'false' && tafel.hoehe < 80);
    else t(b + 'Vollbild: am breiten Schirm startet die Leiste offen', !tafel.zu && tafel.erweitert === 'true');
    const druck = () => voll.evaluate(() => { const k = document.querySelector('.sl-tafel-kopf'); if (k) k.click(); });
    await druck();
    const danach = await voll.evaluate(() => { const t = document.querySelector('.sl-tafel'); const l = t && t.querySelector('label'); return { zu: !!t && t.classList.contains('sl-eingeklappt'), regler: !!l && l.getClientRects().length > 0 }; });
    t(b + 'Vollbild: ein Druck auf den Kopf schaltet die Leiste um', tafel.da && danach.zu === !tafel.zu && danach.regler === tafel.zu);
    if (danach.zu) await druck();

    t(b + 'Vollbild: es gibt einen Regler „Auflösung"', tafel.namen.includes('Auflösung'), tafel.namen.join(', '));
    const stelle = (wert) => voll.evaluate((w) => {
      const l = [...document.querySelectorAll('.sl-tafel label')].find((e) => e.querySelector('span').textContent === 'Auflösung');
      if (!l) return false; const r = l.querySelector('input'); r.value = w; r.dispatchEvent(new Event('input', { bubbles: true })); return true;
    }, wert);
    await stelle(100);
    await warte(() => { const a = document.querySelector('.blackhole-scene').__sl; return !!a.st.fest && !!a.letzte && a.letzte.w === a.letzte.W; });
    const hundert = await bild();
    t(b + 'Vollbild: Auflösung 100 % rechnet jeden Gerätepixel', !!hundert && hundert.fest && hundert.w === hundert.W && hundert.h === hundert.H, JSON.stringify(hundert));
    await stelle(50);
    await warte(() => { const a = document.querySelector('.blackhole-scene').__sl; return !!a.letzte && Math.abs(a.letzte.w - a.letzte.W / 2) <= 1; });
    const halb = await bild();
    t(b + 'Vollbild: Auflösung 50 % rechnet die halbe Breite', !!halb && halb.fest && Math.abs(halb.w - halb.W / 2) <= 1, JSON.stringify(halb));
    await stelle(15);
    const auto = await bild();
    t(b + 'Vollbild: der unterste Anschlag gibt die Auflösung an die Messung zurück', !!auto && !auto.fest, JSON.stringify(auto));
    await stelle(100);
    await voll.evaluate(() => document.querySelector('.blackhole-scene').__sl.schliessen());
    const zu = await voll.evaluate(() => ({ fest: !!document.querySelector('.blackhole-scene').__sl.st.fest, buehne: !!document.querySelector('.sl-buehne') }));
    t(b + 'Vollbild: nach dem Schließen regelt die kleine Ansicht wieder selbst', !zu.fest && !zu.buehne);
    await voll.close();
    t(b + 'kein Seitenfehler', fehler.length === 0, fehler.slice(0, 2).join(' · '));
  }
  // ---- invitation: the door stands once, and the star scene carries no tap sentence ----
  const ein = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await ein.goto(`http://127.0.0.1:${PORT}/docs/einladung/index.html`, { waitUntil: 'domcontentloaded' });
  const tuer = await ein.evaluate(() => {
    const e = document.querySelector('section.scene-doorway .doorway-image'); const c = e ? getComputedStyle(e) : null;
    const cta = document.querySelector('.stars-cta');
    return { da: !!e, wiederholung: c ? c.backgroundRepeat : '', groesse: c ? c.backgroundSize : '', cta: cta ? cta.textContent : '', i18n: document.documentElement.innerHTML };
  });
  t('Einladung, 390 breit: das Türbild ist da und füllt den Rahmen mit „contain"', tuer.da && tuer.groesse === 'contain', tuer.groesse);
  t('Einladung, 390 breit: das Türbild steht einmal (keine Wiederholung)', tuer.wiederholung === 'no-repeat', tuer.wiederholung);
  t('Einladung: die Sternen-Szene trägt keinen Tipp-Satz', tuer.cta.length > 10 && !/Tippen|Tap:|Toucher|Toca:/.test(tuer.i18n), tuer.cta);
  await ein.close();
} finally {
  await browser.close();
  server.close();
}

console.log(`\n  ${gruen} grün · ${rot} rot`);
process.exit(rot ? 1 : 0);
