// PDF-Generator für das Vorsehungsblatt (vorsehung-suche.md → vorsehung-suche.pdf).
//
// Liest die Markdown-Quelle, rendert sie als elegantes, druckfreundliches
// Layout (cremefarbenes Papier, dunkle Tinte, Gold-Akzente) und schreibt ein
// A4-PDF via Headless-Chromium.
//
// Run (aus dem Repo-Root):
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node docs/discovery/_vorsehung_pdf.mjs

import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { marked } from '/opt/node22/lib/node_modules/marked/lib/marked.esm.js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const md = await fs.readFile(resolve(__dirname, 'vorsehung-suche.md'), 'utf-8');
const bodyHtml = marked.parse(md);

const CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #2a2420; background: #faf6ee;
    font-size: 11.2pt; line-height: 1.62;
    -webkit-font-smoothing: antialiased;
  }
  main { max-width: 100%; }
  h1 {
    font-size: 25pt; line-height: 1.1; margin: 0 0 0.1em;
    color: #5e4718; letter-spacing: -0.01em; font-weight: 700;
  }
  h2 {
    font-size: 14pt; font-style: italic; font-weight: 400;
    color: #9a7426; margin: 0 0 1.1em; line-height: 1.25;
  }
  h3 {
    font-size: 13.5pt; color: #5e4718; margin: 1.7em 0 0.5em;
    padding-bottom: 0.25em; border-bottom: 1px solid rgba(184,134,43,0.35);
    page-break-after: avoid;
  }
  p { margin: 0 0 0.75em; }
  strong { color: #5e4718; }
  em { color: #6a5230; }
  a { color: #9a7426; text-decoration: none; }
  ul { margin: 0 0 0.9em; padding-left: 1.2em; }
  li { margin: 0 0 0.4em; }
  hr { border: none; border-top: 1px solid rgba(94,71,24,0.18); margin: 1.6em 0; }
  blockquote {
    margin: 0 0 1.3em; padding: 0.7em 1.1em;
    background: rgba(184,134,43,0.07);
    border-left: 3px solid #b8862b;
    color: #4a3f30; font-size: 10.6pt; line-height: 1.55;
  }
  blockquote p { margin: 0 0 0.5em; }
  blockquote p:last-child { margin: 0; }
  blockquote strong { color: #5e4718; }
  /* der letzte Absatz (Kolophon) klein + gedämpft */
  main > p:last-of-type em, main > p:last-child em { color: #8a7656; }
`;

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${CSS}</style></head><body><main>${bodyHtml}</main></body></html>`;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--no-sandbox']
});
const page = await (await browser.newContext()).newPage();
await page.setContent(html, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(400);

const pdfPath = resolve(__dirname, 'vorsehung-suche.pdf');
await page.pdf({
  path: pdfPath, format: 'A4', printBackground: true,
  margin: { top: '18mm', bottom: '18mm', left: '22mm', right: '20mm' },
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-family:Georgia,serif;font-size:7pt;color:#9a7426;width:100%;text-align:right;padding:6mm 20mm 0;letter-spacing:0.1em;text-transform:uppercase;">Vorsehungsblatt · Discovery · Sage-Protokol</div>`,
  footerTemplate: `<div style="font-family:Georgia,serif;font-size:7pt;color:#9a7426;width:100%;text-align:center;padding:0 20mm 6mm;letter-spacing:0.06em;">— <span class="pageNumber"></span> · <span class="totalPages"></span> —</div>`
});

const stat = await fs.stat(pdfPath);
console.log(`vorsehung-suche.pdf erzeugt: ${(stat.size/1024).toFixed(1)} KB`);
await browser.close();
