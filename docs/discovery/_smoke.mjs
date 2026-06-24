// Headless-Smoke-Test für docs/discovery/index.html.
// Prüft: lädt die Seite ohne (echte) JS-Konsolen-Fehler, ist das WebGL-Canvas
// präsent + dimensioniert, sind die 11 Galerie-Kacheln im DOM, steht der
// Hero-Titel, blendet die Eröffnungs-Animation sauber durch?
//
// Server-Wurzel ist die REPO-Wurzel (zwei Ebenen über dieser Datei), damit
// die relativen Pfade ../einladung/vendor/* und ../../assets/* auflösen.
//
// Erwartete, geduldete 404: assets/discovery/<pilz>.webp existieren erst,
// wenn Klaus die KI-Bilder abgelegt hat — die Galerie zeigt bis dahin
// museale Platzhalter-Kacheln. Diese 404 werden hier herausgefiltert.
//
// Run: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
//      node docs/discovery/_smoke.mjs

import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const repoRoot   = resolve(__dirname, '../../');

const mime = {
  '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css',   '.svg':'image/svg+xml',  '.woff2':'font/woff2',
  '.json':'application/json', '.md':'text/markdown', '.webp':'image/webp',
  '.png':'image/png',  '.jpg':'image/jpeg'
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/docs/discovery/index.html';
  const full = resolve(repoRoot, '.' + p);
  if (!full.startsWith(repoRoot)) { res.writeHead(403); return res.end(); }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    const ext = full.slice(full.lastIndexOf('.'));
    res.writeHead(200, { 'content-type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const fileUrl = `http://127.0.0.1:${port}/docs/discovery/index.html`;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl']
});
const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
const page = await ctx.newPage();

const errs = [];
const warns = [];
const bad404 = [];   // 404 außerhalb von assets/discovery → echter Fehler
// Resource-Gesundheit messen wir über das response-Event (URL bekannt), nicht
// über den Konsolentext: der „Failed to load resource“-Text enthält die URL
// nicht. Galerie-Bilder, die Klaus noch nicht abgelegt hat, sind geduldet.
page.on('pageerror', e => errs.push('PAGE ERR: ' + e.message));
page.on('console', m => {
  const t = m.text();
  // Browser-generierte Resource-404 als Konsolen-Error ignorieren (per
  // response-Event geprüft). Alles andere zählt als echter JS-Fehler.
  if (m.type() === 'error' && !/Failed to load resource/i.test(t)) errs.push('CONSOLE ERR: ' + t);
  if (m.type() === 'warning') warns.push('CONSOLE WARN: ' + t);
});
page.on('response', r => {
  if (r.status() === 404 && !/assets\/discovery\//.test(r.url())) bad404.push(r.url());
});
page.on('requestfailed', req => {
  const u = req.url();
  if (!/assets\/discovery\//.test(u)) errs.push('REQ FAIL: ' + u + ' — ' + (req.failure()?.errorText||''));
});

await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1800);

const canvas = await page.evaluate(() => {
  const c = document.getElementById('cosmos-canvas');
  return c ? { w: c.width, h: c.height } : null;
});
const heroTitle  = await page.locator('#hero .display').textContent();
const fungusCount = await page.locator('.fungus').count();
const figureCount = await page.locator('.fungus-figure').count();
const storyLines  = await page.locator('.storyline .line').count();
const whispers    = await page.locator('.whisper').count();
const schlussFig  = await page.locator('.schluss-figure').count();
const footerLinks = await page.locator('footer .links a').count();

// Eröffnung überspringen → Hero soll „revealed“ werden
await page.locator('#intro-skip').click();
await page.waitForTimeout(1600);
const heroRevealed = await page.evaluate(() => document.getElementById('hero').classList.contains('revealed'));

console.log('--- Smoke-Test Discovery-Expedition ---');
console.log('Cosmos-Canvas:    ', canvas);
console.log('Hero-Titel:       ', JSON.stringify((heroTitle||'').slice(0, 60)));
console.log('Pilz-Einträge:    ', fungusCount, '(erwartet 11)');
console.log('Bild-Figuren:     ', figureCount, '(erwartet 11)');
console.log('Storyboard-Zeilen:', storyLines, '(erwartet 4)');
console.log('Whisper-Zeilen:   ', whispers, '(erwartet 2)');
console.log('Schluss-Figur:    ', schlussFig, '(erwartet 1)');
console.log('Footer-Links:     ', footerLinks, '(erwartet 6)');
console.log('Hero revealed:    ', heroRevealed);

const checks = {
  cosmosCanvas: canvas && canvas.w > 0 && canvas.h > 0,
  heroTitle:    /Leben/.test(heroTitle || ''),
  fungusCount:  fungusCount === 11,
  figureCount:  figureCount === 11,
  storyLines:   storyLines === 4,
  whispers:     whispers === 2,
  schlussFig:   schlussFig === 1,
  footerLinks:  footerLinks === 6,
  heroRevealed: heroRevealed === true,
  zeroErrors:   errs.length === 0,
  noUnexpected404: bad404.length === 0
};
if (bad404.length) { console.log('--- Unerwartete 404 ---'); bad404.forEach(u => console.log(u)); }
console.log('--- Checks ---');
for (const [k, v] of Object.entries(checks)) console.log((v ? '✅' : '❌') + ' ' + k);
if (errs.length) { console.log('--- Errors ---'); errs.forEach(e => console.log(e)); }
if (warns.length) { console.log('--- Warns (' + warns.length + ') ---'); warns.slice(0,8).forEach(w => console.log(w)); }

await browser.close();
server.close();
process.exit(Object.values(checks).every(Boolean) ? 0 : 1);
