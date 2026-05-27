// PDF-Generator für die Einladung.
//
// Liest einladung.md, baut daraus eine Print-Magazin-HTML-Variante mit
// print.css, rendert sie via Headless-Chromium nach einladung.pdf.
//
// Run (aus dem Repo-Root):
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
//     node docs/einladung/_pdf.mjs
//
// Werkzeug-Lücken-Behandlung: wenn Chromium-Headless fehlt, ende mit
// Code 2 + Hinweis; der Bau-Sitzungs-Brief erlaubt, die PDF-Variante
// als „offen" zu markieren.

import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { marked } from '/tmp/vendor/node_modules/marked/lib/marked.esm.js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs/promises';
import http from 'node:http';
import fss from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ----------------------------------------------------------------
// 1. Markdown lesen + in Sprach-/Sektions-Blöcke aufteilen.
// ----------------------------------------------------------------
const mdRaw = await fs.readFile(resolve(__dirname, 'einladung.md'), 'utf-8');

// Sprach-Blöcke: jeder beginnt mit "# Einladung in das Mycel" /
// "# Invitation to the Mycelium (English)" / etc. Der Header über dem
// ersten Block ist das Vorwort.
const LANG_LABELS = [
  { code: 'DE', display: 'Deutsch',   start: /^# Einladung in das Mycel/m },
  { code: 'EN', display: 'English',   start: /^# Invitation to the Mycelium/m },
  { code: 'FR', display: 'Français',  start: /^# Invitation au mycélium/m },
  { code: 'ES', display: 'Invitación al micelio', start: /^# Invitación al micelio/m }
];

const idxs = LANG_LABELS.map(l => mdRaw.search(l.start)).map((p, i) => ({ p, i }));
const preface = mdRaw.slice(0, idxs[0].p);
const blocks  = LANG_LABELS.map((l, i) => {
  const start = idxs[i].p;
  const end   = i + 1 < idxs.length ? idxs[i + 1].p : mdRaw.length;
  return { lang: l, md: mdRaw.slice(start, end) };
});

// Jeder Block kriegt eigene HTML-Rendering. Pro `##`-Sektion bauen wir
// eine `<section class="chapter">` mit Marginalien-Spalte (Schicht-Nummer).
function renderBlock(block, idx) {
  const headerMatch = block.md.match(/^# (.+?)\n/);
  const titleLine   = headerMatch ? headerMatch[1] : block.lang.display;
  const bodyMd      = block.md.replace(/^# .+?\n/, '');

  // ## Sektion-Headers identifizieren und in einzelne Chapter zerlegen.
  // Wir splitten bei `^## `. Das erste Stück (vor dem ersten `##`) ist
  // der Lead-Block (Blockquote + Datum) — der gehört in den Sprach-
  // Trenner, nicht als eigene Sektion gerendert.
  const splits = bodyMd.split(/^## /m);
  const leadMdRaw = (splits.shift() || '').trim();
  const sections = splits.map((sec, i) => {
    const lines = sec.split('\n');
    const head  = lines.shift();
    const body  = lines.join('\n').trim();
    let anchor = '';
    const anchorMatch = body.match(/<a id="([^"]+)"><\/a>/);
    if (anchorMatch) anchor = anchorMatch[1];
    return { head, body: body.replace(/<a id="[^"]+"><\/a>\s*/g, ''), anchor, idx: i };
  });
  const leadHtml = leadMdRaw ? marked.parse(leadMdRaw) : '';

  // Marginalien-Nummern: Eröffnung = ohne Nummer, Schicht 1 = I, etc.
  // Erkennung über Pattern "Schicht 1 — …" / "Layer 1 — …" / etc.
  const numerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  function chapterNum(head) {
    const m = head.match(/(?:Schicht|Layer|Couche|Capa)\s+(\d)/);
    if (m) return numerals[parseInt(m[1], 10)];
    if (/Eröffnung|Opening|Ouverture|Apertura/.test(head)) return '·';
    if (/Akt der Einladung|act of inviting|acte d.invitation|acto de invitar/i.test(head)) return '✦';
    if (/offen|stays open|reste ouvert|queda abierto/i.test(head)) return '◇';
    return '·';
  }

  const chaptersHtml = sections.map((sec, i) => {
    const num = chapterNum(sec.head);
    const headHtml = marked.parseInline(sec.head);
    const bodyHtml = marked.parse(sec.body);
    return `
      <section class="chapter">
        <div class="marginalia">
          <div class="marg-num">${num}</div>
          <span class="marg-label">${headHtml}</span>
        </div>
        <div class="body">
          <h2>${headHtml}</h2>
          ${bodyHtml}
        </div>
      </section>
    `;
  }).join('\n');

  return `
    <div class="lang-divider">
      <span class="lang-tag">${block.lang.code}</span>
      <h1>${marked.parseInline(titleLine)}</h1>
      <div class="lang-lead">${leadHtml}</div>
    </div>
    ${chaptersHtml}
  `;
}

const today = new Date().toISOString().slice(0, 10);
const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Einladung in das Mycel — Druckfassung</title>
<link rel="stylesheet" href="print.css">
</head>
<body>
<div class="print-root">

  <article class="title-page">
    <div>
      <p class="title-eyebrow">Sage-Protokol · SBKIM</p>
      <h1 class="title-head">Einladung in das <em>Mycel</em>.</h1>
      <p class="title-sub">Eine Einladung, keine Charta. Wer sie liest, kann kommen oder gehen. Beides ist gut.</p>
    </div>
    <div>
      <div class="title-meta">
        <div><strong>Datum</strong>${today}</div>
        <div><strong>Sprachen</strong>Deutsch · English · Français · Español</div>
        <div><strong>Lizenz</strong>MIT · keine Tracker</div>
      </div>
    </div>
  </article>

  ${blocks.map(renderBlock).join('\n')}

  <section class="colophon">
    <h2>Wer sie liest, kann kommen oder gehen.</h2>
    <p>Diese Druckfassung wird automatisch aus <code>docs/einladung/einladung.md</code> erzeugt. Inhalt und Anker-IDs sind identisch zur HTML-Site unter <code>docs/einladung/index.html</code>.</p>
    <hr>
    <p>Sage-Protokol · github.com/lausiklauskn-png/Sage-Protokol</p>
    <p>Diese Einladung ist eine Möglichkeit, keine Aufforderung. Wer sie weitergibt, gibt sie weiter im selben Geist.</p>
  </section>

</div>
</body>
</html>
`;

// ----------------------------------------------------------------
// 2. Lokalen HTTP-Server starten, damit @font-face funktioniert
//    (file:// blockiert font-loading bei manchen Browsern).
// ----------------------------------------------------------------
const mime = {
  '.html':'text/html', '.css':'text/css', '.woff2':'font/woff2',
  '.svg':'image/svg+xml', '.js':'text/javascript'
};
const printHtmlPath = resolve(__dirname, '_print_render.html');
await fs.writeFile(printHtmlPath, html, 'utf-8');

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/_print_render.html';
  const full = resolve(__dirname, '.' + p);
  if (!full.startsWith(__dirname)) { res.writeHead(403); return res.end(); }
  fss.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    const ext = full.slice(full.lastIndexOf('.'));
    res.writeHead(200, { 'content-type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const url  = `http://127.0.0.1:${port}/_print_render.html`;

// ----------------------------------------------------------------
// 3. Headless-Chromium → PDF.
// ----------------------------------------------------------------
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--no-sandbox']
});
const ctx  = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
// Fonts auf jeden Fall geladen lassen
await page.evaluate(() => document.fonts ? document.fonts.ready : null);
await page.waitForTimeout(800);

const pdfPath = resolve(__dirname, 'einladung.pdf');
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-family:Inter,sans-serif;font-size:7pt;color:#8c6e2f;width:100%;text-align:right;padding:6mm 22mm 0;letter-spacing:0.12em;text-transform:uppercase;">Einladung · Sage-Protokol</div>`,
  footerTemplate: `<div style="font-family:Inter,sans-serif;font-size:7pt;color:#8c6e2f;width:100%;text-align:center;padding:0 22mm 6mm;letter-spacing:0.08em;">— <span class="pageNumber"></span> · <span class="totalPages"></span> —</div>`
});

const stat = await fs.stat(pdfPath);
console.log(`einladung.pdf erzeugt: ${(stat.size/1024).toFixed(1)} KB`);

await browser.close();
server.close();
// Render-Vorlage auf Platte lassen, damit sie reproduzierbar inspizierbar
// bleibt — aber nicht versioniert (in .gitignore).
