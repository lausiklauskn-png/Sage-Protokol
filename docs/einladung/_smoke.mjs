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

const checks = {
  sectionCount:        sectionCount === 7,
  stageCanvas:         cnv && cnv.w > 0 && cnv.h > 0,
  fruitingCanvasCount: fruitingCanvasCount === 3,
  scene6Photo:         scene6Photo === true,
  starCount:           starCount > 100,
  langDe:              /Geflecht/.test(lederText || ''),
  langEn:              /network/.test(enLede || ''),
  langFr:              /invitation/i.test(frEyebrow || ''),
  zeroErrors:          errs.length === 0
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
