// PDF-Erzeuger für die drei bereinigten Konzept-Papiere.
//
// Rendert jede der drei HTML-Fassungen mit `print.css` über Headless-Chromium
// nach PDF. Gleiches Verfahren wie `docs/einladung/_pdf.mjs` — mit zwei
// bewussten Abweichungen:
//
//   · KEIN Markdown-Schritt. Die Papiere sind von Hand gesetztes HTML
//     (Tabellen, die aus dem alten PDF rekonstruiert wurden). Ein
//     Markdown-Zwischenformat würde sie nur wieder plattdrücken — und
//     `marked` liegt unter /tmp/vendor, das nicht in jedem Container da ist.
//   · Ränder aus page.pdf(), nicht aus @page. Chromium zählt sonst doppelt;
//     `print.css` setzt deshalb ausdrücklich `@page { margin: 0 }`.
//
// Lauf (aus dem Repo-Root):
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node sbkim-demo/papiere/_pdf.mjs
//
// Fehlt Chromium, endet der Lauf mit Code 2 und einem Hinweis — die PDFs
// bleiben dann schlicht die alten, statt halb erzeugt zu werden.

import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import http from 'node:http';
import fss from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PAPIERE = [
  'Konzept_PWA_Marktplatz',
  'Marktanalyse_PWA_Plattform',
  'USP_Bidirektionales_Matching'
];

// ── 1 · Lokaler Server ────────────────────────────────────────────────────
// file:// lädt in manchen Chromium-Fassungen das Stylesheet nicht mit; über
// http:// ist das Verhalten eindeutig.
const mime = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const full = resolve(__dirname, '.' + p);
  if (!full.startsWith(__dirname)) { res.writeHead(403); return res.end(); }
  fss.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': mime[full.slice(full.lastIndexOf('.'))] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

// ── 2 · Chromium ──────────────────────────────────────────────────────────
const SHELL = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (!fss.existsSync(SHELL)) {
  console.error('Chromium-Headless nicht gefunden:', SHELL);
  console.error('PDFs NICHT erzeugt — die vorhandenen bleiben unverändert.');
  server.close();
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: SHELL, args: ['--no-sandbox'] });
const ctx = await browser.newContext();

for (const name of PAPIERE) {
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/${name}.html`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null));

  const ziel = resolve(__dirname, name + '.pdf');
  await page.pdf({
    path: ziel,
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '20mm', right: '20mm' },
    preferCSSPageSize: false
  });
  await page.close();
  console.log(`${name}.pdf · ${(fss.statSync(ziel).size / 1024).toFixed(0)} KB`);
}

await browser.close();
server.close();
console.log('Fertig. Prüfen mit: node sbkim-demo/papiere/_pdf_pruefen.mjs');
