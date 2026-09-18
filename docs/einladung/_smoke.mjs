// Headless-Smoke-Test für docs/einladung/index.html.
// Prüft: lädt die Seite ohne JS-Konsolen-Fehler, sind die WebGL-Canvases
// präsent, sind alle Sektionen im DOM, schaltet die Sprachenwahl um?
//
// Run: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
//      node docs/einladung/_smoke.mjs

import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Mini-HTTP-Server, damit ES-Modules sauber laden (file:// schlägt an CORS).
const mime = {
  '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css',   '.svg':'image/svg+xml',  '.woff2':'font/woff2',
  '.json':'application/json', '.md':'text/markdown'
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const full = resolve(__dirname, '.' + p);
  if (!full.startsWith(__dirname)) { res.writeHead(403); return res.end(); }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    const ext = full.slice(full.lastIndexOf('.'));
    res.writeHead(200, { 'content-type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const fileUrl = `http://127.0.0.1:${port}/index.html`;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl']
});
const ctx  = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  ignoreHTTPSErrors: true
});
const page = await ctx.newPage();

const errs = [];
const warns = [];
page.on('pageerror', e => errs.push('PAGE ERR: ' + e.message));
page.on('console', m => {
  if (m.type() === 'error')   errs.push('CONSOLE ERR: ' + m.text());
  if (m.type() === 'warning') warns.push('CONSOLE WARN: ' + m.text());
});

await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
// kleine Wartezeit für Module-Imports + ScrollTrigger-Setup
await page.waitForTimeout(1500);

// Browser-Lang ist im Headless en-US, daher zuerst auf DE schalten,
// um den DE-Text zu prüfen.
await page.locator('.lang-switch button[data-lang="de"]').click();
await page.waitForTimeout(300);

// 1. Sechs Sektionen im DOM
const sectionCount = await page.locator('section.scene').count();
const lederText    = await page.locator('#scene-1 .lede').textContent();
const cnv          = await page.evaluate(() => {
  const c = document.getElementById('stage-canvas');
  return c ? { w: c.width, h: c.height } : null;
});
// Karten in Sektion 3 sind seit 2026-05-28 Bilder (KI-Bilder von Klaus)
// statt prozeduraler WebGL-Mini-Szenen.
const fruitingCanvasCount = await page.locator('#scene-3 .fruiting-image').count();
// Sektion 6 nutzt seit 2026-05-27 ein Foto + scene6-drift-Anim statt
// Mesh-Gradient-Canvas. Stattdessen prüfen wir das Hintergrund-Foto.
const scene6Photo = await page.evaluate(() => {
  const s6 = document.getElementById('scene-6');
  const bg = getComputedStyle(s6, '::before').background;
  return bg && bg.includes('scene-6-lichtung.webp');
});

// 2. Sprach-Wechsel testet
await page.locator('.lang-switch button[data-lang="en"]').click();
await page.waitForTimeout(300);
const enLede = await page.locator('#scene-1 .lede').textContent();

await page.locator('.lang-switch button[data-lang="fr"]').click();
await page.waitForTimeout(300);
const frEyebrow = await page.locator('#scene-1 .eyebrow').textContent();

// 3b. KEIN RAND RECHTS (Klaus 2026-09-18) ----------------------------------
// Drei Wächter, und jeder misst etwas anderes.
const rand = await page.evaluate(() => {
  const el = document.documentElement;
  const r = {};

  // (1) Die Rinne ist weg — auch dann, wenn die Seite ausdrücklich einen
  //     senkrechten Rollbalken verlangt. Ohne das `overflow-y: scroll` misst
  //     der Wächter in einer Umgebung mit Überlagerungs-Rollbalken gar nichts.
  const vorher = el.style.overflowY;
  el.style.overflowY = 'scroll';
  el.getBoundingClientRect();
  r.rinne = window.innerWidth - el.clientWidth;
  el.style.overflowY = vorher;
  // ⚠ `rinne` allein ist in einer Umgebung mit ÜBERLAGERUNGS-Rollbalken
  //    immer 0 — auch ohne die Regel. Der Wert misst dort nichts. Gemessen
  //    wird deshalb zusätzlich die Regel selbst; sie ist der Griff, der die
  //    Rinne bei Klaus wegnimmt, und sie lässt sich hier umwerfen.
  r.rollbalkenBreite = getComputedStyle(el).scrollbarWidth;
  r.webkitNull = [...document.styleSheets].some(bl => {
    try { return [...bl.cssRules].some(rg =>
      /::-webkit-scrollbar\b/.test(rg.selectorText || '') && /(^|[^\d])0(px)?$/.test((rg.style||{}).width || 'x'));
    } catch (e) { return false; }
  });

  // (2) Die Voll-Schichten reichen bis an den Fensterrand — gemessen an einer
  //     gestellten Lage, in der der umgebende Kasten SCHMALER ist als das
  //     Fenster. Genau das tut eine stehende Rinne; ohne die Stellung wäre
  //     `100% === 100vw` und der Wächter bliebe blind.
  const st = document.createElement('style');
  st.textContent = 'body { width: calc(100vw - 15px) !important; }';
  document.head.appendChild(st);
  el.getBoundingClientRect();
  const w = window.innerWidth;
  r.gestellt = {};
  r.gestellt.bodyBreite = document.body.getBoundingClientRect().width;
  for (const [name, sel, pseudo] of [
    ['vignette',   '.vignette',            null],
    ['korn',       '.korn',                null],
    ['scene1vor',  '#scene-1',             '::before'],
    ['scene1nach', '#scene-1',             '::after'],
    ['scene5vor',  '#scene-5',             '::before'],
    ['scene6vor',  '#scene-6',             '::before'],
    ['papier',     '#scene-4 .paper-bg',   null],
    ['fadeOben',   '#scene-1 .scene-fade-top', null]
  ]) {
    const node = document.querySelector(sel);
    if (!node) { r.gestellt[name] = 'fehlt'; continue; }
    if (pseudo) {
      // Pseudo-Elemente haben keine Kiste zum Messen — der aufgelöste
      // `right`-Wert ist der Beleg. -15px = es reicht über den Kasten hinaus.
      r.gestellt[name] = getComputedStyle(node, pseudo).right;
    } else {
      r.gestellt[name] = (node.getBoundingClientRect().right - w).toFixed(1);
    }
  }
  st.remove();
  el.getBoundingClientRect();

  // (3) Die Tür-Bühne trägt ihre Breite selbst (sticky, da greift `right` nicht).
  const st2 = document.createElement('style');
  st2.textContent = 'body { width: calc(100vw - 15px) !important; }';
  document.head.appendChild(st2);
  const stage = document.querySelector('section.scene-doorway .doorway-stage');
  r.buehneBreite = stage ? (stage.getBoundingClientRect().width - window.innerWidth).toFixed(1) : 'fehlt';
  st2.remove();
  return r;
});

// 3c. ÜBERHANG DER KAMERAFAHRTEN ------------------------------------------
// Aus den Keyframes gerechnet, nicht aus dem Bild geraten: wie weit steht
// das Foto an seiner knappsten Stelle über den Kasten hinaus? Ein Überhang
// nahe 0 ist ein Haarstrich, den Teilpixel-Rundung freilegt.
const ueberhang = await page.evaluate(() => {
  const gesucht = ['scene1-camera', 'scene5-breath', 'scene6-drift'];
  const raus = {};
  for (const bl of document.styleSheets) {
    let regeln; try { regeln = bl.cssRules; } catch (e) { continue; }
    for (const rg of regeln) {
      if (rg.type !== CSSRule.KEYFRAMES_RULE || !gesucht.includes(rg.name)) continue;
      let min = Infinity;
      for (const kf of rg.cssRules) {
        const t = kf.style.transform || '';
        const sc = /scale\(([\d.]+)\)/.exec(t);
        const tr = /translate\(([-\d.]+)%\s*,\s*([-\d.]+)%\)/.exec(t);
        if (!sc) continue;
        const S = parseFloat(sc[1]);
        const TX = tr ? parseFloat(tr[1]) / 100 : 0;
        const TY = tr ? parseFloat(tr[2]) / 100 : 0;
        for (const T of [TX, TY]) {
          min = Math.min(min, S * (0.5 - Math.abs(T)) - 0.5);
        }
      }
      raus[rg.name] = +(min * 100).toFixed(2);
    }
  }
  return raus;
});

// 3d. KORN GEGEN DIE STUFEN IN DEN VERLÄUFEN -------------------------------
const korn = await page.evaluate(() => {
  const k = document.querySelector('.korn');
  if (!k) return { da: false };
  const cs = getComputedStyle(k);
  const o = parseFloat(cs.opacity);
  return {
    da: true,
    ueberAllem: parseInt(cs.zIndex, 10) > 50,
    blendet: cs.mixBlendMode === 'overlay',
    // sichtbar genug, um Stufen zu brechen — leise genug, um nicht zu körnen
    staerke: o >= 0.02 && o <= 0.12,
    rauschen: /feTurbulence/.test(cs.backgroundImage),
    klickdicht: cs.pointerEvents === 'none'
  };
});
const rampeStufen = await page.evaluate(() => {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--rampe-ab');
  return (v.match(/%/g) || []).length;
});

// 3. Star-Field gefüllt?
const starCount = await page.locator('.stars-svg circle').count();

console.log('--- Smoke-Test Einladung ---');
console.log('Sektionen:           ', sectionCount, '(erwartet 7)');
console.log('Stage-Canvas:        ', cnv);
console.log('Fruchtkörper-Canvas: ', fruitingCanvasCount, '(erwartet 3)');
console.log('Scene 6 Foto:        ', scene6Photo, '(erwartet true)');
console.log('Star-Field Punkte:   ', starCount, '(erwartet > 100)');
console.log('Lede DE:             ', JSON.stringify((lederText||'').slice(0, 80)));
console.log('Lede EN:             ', JSON.stringify((enLede   ||'').slice(0, 80)));
console.log('Eyebrow FR:          ', JSON.stringify(frEyebrow));
console.log('--- Rand rechts ---');
console.log('Rinne (erwartet 0):  ', rand.rinne, '· scrollbar-width:', rand.rollbalkenBreite,
            '· ::-webkit-scrollbar 0:', rand.webkitNull);
console.log('  ⚠ `Rinne` misst in dieser Umgebung nichts — Überlagerungs-Rollbalken.');
console.log('    Der Wert, der hier fallen KANN, ist scrollbar-width.');
console.log('Voll-Schichten:      ', JSON.stringify(rand.gestellt));
console.log('  (Pseudo-Elemente erwartet -15px, echte Kästen Δ Fenster 0.0)');
console.log('  ⚠ benannte Grenze: .vignette und .korn stehen FEST — ihr umgebender');
console.log('    Kasten ist das Fenster selbst, die gestellte Rinne erreicht sie');
console.log('    nicht. Für sie gilt dieselbe eine Zeile, gemessen ist sie nicht.');
console.log('Tür-Bühne Δ Fenster: ', rand.buehneBreite, '(erwartet 0.0)');
console.log('Überhang der Fahrten:', JSON.stringify(ueberhang), '(erwartet je > 2 %)');
console.log('Korn:                ', JSON.stringify(korn));
console.log('Rampen-Stützstellen: ', rampeStufen, '(erwartet >= 8)');

const checks = {
  sectionCount:        sectionCount === 7,
  stageCanvas:         cnv && cnv.w > 0 && cnv.h > 0,
  fruitingCanvasCount: fruitingCanvasCount === 3,
  scene6Photo:         scene6Photo === true,
  starCount:           starCount > 100,
  langDe:              /Geflecht/.test(lederText || ''),
  langEn:              /network/.test(enLede || ''),
  langFr:              /invitation/i.test(frEyebrow || ''),
  zeroErrors:          errs.length === 0,

  // --- Rand rechts ---
  keineRinne:          rand.rinne === 0,
  rinneAbgestellt:     rand.rollbalkenBreite === 'none',
  rinneAuchAelter:     rand.webkitNull === true,
  // Pseudo-Elemente haben keine Kiste — gemessen wird der aufgelöste
  // `right`-Wert: -15px heißt, die Schicht steht um die gestellte Rinne über.
  vollbildFotos:       ['scene1vor','scene1nach','scene5vor','scene6vor']
                         .every(k => rand.gestellt[k] === '-15px'),
  // Echte Kästen: der rechte Rand liegt AUF dem Fensterrand, nicht 15px davor.
  vollbildFlaechen:    ['papier','fadeOben'].every(k => Math.abs(parseFloat(rand.gestellt[k])) < 0.6),
  tuerBuehneVoll:      Math.abs(parseFloat(rand.buehneBreite)) < 0.6,

  // --- Kamerafahrten: kein Haarstrich am Rand ---
  ueberhangDa:         Object.keys(ueberhang).length === 3,
  ueberhangGenug:      Object.values(ueberhang).every(v => v >= 2),

  // --- Verläufe: Stufen gebrochen ---
  kornDa:              korn.da === true,
  kornWirkt:           korn.ueberAllem && korn.blendet && korn.staerke && korn.rauschen && korn.klickdicht,
  rampeWeich:          rampeStufen >= 8
};
console.log('--- Checks ---');
for (const [k, v] of Object.entries(checks)) {
  console.log((v ? '✅' : '❌') + ' ' + k);
}
console.log('--- Errors ---');
errs.forEach(e => console.log(e));
console.log('--- Warns ---');
warns.forEach(w => console.log(w));

await browser.close();
server.close();
const pass = Object.values(checks).every(Boolean);
process.exit(pass ? 0 : 1);
