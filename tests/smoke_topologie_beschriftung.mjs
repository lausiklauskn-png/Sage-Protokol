#!/usr/bin/env node
/* smoke_topologie_beschriftung.mjs — in der Modul-Topologie der Startseite liegt keine
 * Zwischenzeile auf einer Knoten-Beschriftung.
 *
 * Anlass (Pflege-Liste 2026-11-15): „weitere Module" stand auf der Beschriftung von Modul 11,
 * weil die Zeile bei `maxY + rowH * 0.55` gesetzt war und die Namenszeile des Knotens darüber
 * fast auf derselben Höhe endet. Aus dem Quelltext ist das nicht zu sehen, nur am gezeichneten Bild.
 *
 *   node tests/smoke_topologie_beschriftung.mjs
 *   TOPO_WURZEL=/pfad node tests/…          # prüft eine Kopie (für die Gegenprobe)
 *
 * Seit dem 2026-11-15 misst sie auch, dass die Karte im Querformat ganz ins Fenster passt
 * (Klaus am Monitor: „dass ich alles sehe, nicht scrollen muss").
 *
 * Braucht `playwright-core`. Fehlt es: nicht lauffähig, nicht rot.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = process.env.TOPO_WURZEL || resolve(dirname(fileURLToPath(import.meta.url)), '..');
let gruen = 0, rot = 0;
const t = (name, ok, detail = '') => {
  if (ok) { gruen++; console.log('  ✓ ' + name); }
  else { rot++; console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
};

function chrom() {
  if (existsSync('/opt/pw-browsers/chromium')) return '/opt/pw-browsers/chromium';
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try {
    for (const n of readdirSync(heim).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
      for (const u of ['chrome-linux', 'chrome-linux64']) { const w = join(heim, n, u, 'chrome'); if (existsSync(w)) return w; }
    }
  } catch {}
  return join(heim, 'chromium', 'chrome-linux', 'chrome');
}

const ARTEN = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };

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

const browser = await chromium.launch({ executablePath: chrom() });
try {
  for (const [breite, hoehe] of [[1280, 800], [2000, 1050], [390, 844]]) {
    const seite = await browser.newPage({ viewport: { width: breite, height: hoehe } });
    await seite.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load' });
    // The topology is drawn once status.json has arrived; wait for drawn nodes, not for a time span.
    await seite.waitForFunction(() => document.querySelectorAll('#topology-svg .topo-node').length > 5, null, { timeout: 20000 });
    // the height is fitted one microtask after drawing; wait for that mark, not for a time span
    if (breite > 760) await seite.waitForFunction(() => !!document.getElementById('topology-svg').style.maxHeight, null, { timeout: 5000 }).catch(() => {});
    const bild = await seite.evaluate(() => {
      const kasten = (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, text: e.textContent }; };
      const svg = document.getElementById('topology-svg');
      return {
        zeilen: [...svg.querySelectorAll('.topo-cluster-label')].map(kasten),
        knoten: [...svg.querySelectorAll('.topo-node-label, .topo-node-id, .topo-node-bg')].map(kasten),
        // per node: its circle and its two text lines, to compare one node's circle with another's text
        gruppen: [...svg.querySelectorAll('.topo-node')].map((g) => ({
          kreis: kasten(g.querySelector('.topo-node-bg')),
          texte: [...g.querySelectorAll('.topo-node-id, .topo-node-label')].map(kasten),
        })),
        weitere: [...svg.querySelectorAll('.topo-cluster-label')].some((e) => e.textContent === 'weitere Module'),
        hochformat: matchMedia('(max-width: 760px)').matches,
        karteHoehe: document.querySelector('.hero-topology').getBoundingClientRect().height,
        platz: innerHeight - document.querySelector('.topbar').offsetHeight,
      };
    });
    // 0.5 px tolerance: touching boxes are not an overlap
    const schneidet = (a, b) => a.l < b.r - 0.5 && b.l < a.r - 0.5 && a.t < b.b - 0.5 && b.t < a.b - 0.5;
    const treffer = [];
    for (const z of bild.zeilen) for (const k of bild.knoten) if (schneidet(z, k)) treffer.push(`„${z.text}" auf „${k.text || 'Knoten'}"`);
    t(`${breite} breit: Knoten sind gezeichnet (${bild.knoten.length} Kästen)`, bild.knoten.length > 15);
    t(`${breite} breit: die Zeile „weitere Module" steht im Bild`, bild.weitere,
      'ohne sie misst diese Probe nichts — Anker nachziehen');
    if (!bild.hochformat) t(`${breite} breit: Zwischenzeilen sind gezeichnet (${bild.zeilen.length})`, bild.zeilen.length >= 5);
    t(`${breite} breit: keine Zwischenzeile liegt auf einem Knoten oder seiner Beschriftung`, treffer.length === 0, treffer.slice(0, 3).join(' · '));
    const aufText = [];
    bild.gruppen.forEach((g, i) => bild.gruppen.forEach((h, j) => {
      if (i !== j) for (const x of h.texte) if (schneidet(g.kreis, x)) aufText.push(`Kreis von „${g.texte[0].text}" auf „${x.text}"`);
    }));
    t(`${breite} breit: kein Knoten-Kreis liegt auf der Beschriftung eines anderen Knotens`, aufText.length === 0, aufText.slice(0, 3).join(' · '));
    if (!bild.hochformat) {
      // Klaus 2026-11-15: the whole card is visible at once, without scrolling.
      t(`${breite}×${hoehe}: die Topologie-Karte passt ganz unter die Kopfleiste`, bild.karteHoehe <= bild.platz + 0.5,
        `Karte ${Math.round(bild.karteHoehe)} px, Platz ${bild.platz} px`);
      const textAufText = [];
      bild.gruppen.forEach((g, i) => bild.gruppen.forEach((h, j) => {
        if (i < j) for (const x of g.texte) for (const y of h.texte) if (schneidet(x, y)) textAufText.push(`„${x.text}" auf „${y.text}"`);
      }));
      t(`${breite} breit: keine Beschriftung liegt auf der eines anderen Knotens`, textAufText.length === 0, textAufText.slice(0, 3).join(' · '));
    }
    await seite.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`\n  ${gruen} grün · ${rot} rot`);
process.exit(rot ? 1 : 0);
