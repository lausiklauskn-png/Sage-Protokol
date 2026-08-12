/* Breite messen — passt eine Seite auf ein schmales Fenster, und wenn nicht: WAS
 * ragt hinaus?
 *
 *   PW_CORE=/pfad/zu/playwright-core node tools/breite-messen.mjs <ordner> [datei]
 *   BREITEN=320,360,412,768,1280 …    (Vorgabe: 360,420)
 *
 * WARUM ES DAS GIBT (Klaus' Befund 2026-08-12). Klaus meldete, dass sich mehrere
 * Apps beim Schmalerziehen „nicht sofort" anpassen — erst nach mehrmaligem
 * Ziehen oder nach dem Neuladen. Das klang nach einem Zeitproblem und war eine
 * Platz-Rechnung:
 *
 *   Eine Seite, die BREITER ist als das Fenster, bricht beim Schmalerziehen
 *   nicht sauber um. Der Browser behält die breitere Anordnung und lässt
 *   schieben; erst ein Neuladen rechnet die Breite neu aus.
 *
 * Ein einziges Element genügt dafür. Gemessen wurde: ein Auswahlfeld macht sich
 * so breit wie sein LÄNGSTER Eintrag, und ein Flex-Kind darf standardmäßig nicht
 * unter seine Inhaltsbreite schrumpfen (`min-width: auto`). Das Feld
 * „KI-Richter: aus (gratis bleibt Voreinstellung)" war damit 407 px breit und
 * zog die Pinnwand auf 442 px, Kimboard sogar auf 524 px.
 *
 * WAS DIESES WERKZEUG BESSER MACHT ALS HINSEHEN. Am Bildschirm sieht man, DASS
 * etwas nicht stimmt; hier steht, WELCHES Element es ist und um wie viel. Es
 * misst die Tat — die Rechnung des Browsers —, nicht den Quelltext. Ein Wächter,
 * der im Quelltext nach `min-width` sucht, findet auch den Kommentar daneben.
 *
 * Gemeldet wird jedes sichtbare Element, das breiter ist als das Fenster ODER
 * dessen rechter Rand darüber hinausragt. Beides zählt: das eine ist zu groß,
 * das andere sitzt zu weit rechts, und beide halten die Seite auseinander.
 *
 * FEHLALARM-KUNDE: absichtlich seitlich scrollende Streifen (die Kategorie-
 * Pillen in Rezeptbuch und Mixarium) tauchen hier auf, obwohl die SEITE passt.
 * Deshalb entscheidet die erste Zeile — „passt" oder „ragt hinaus" —, nicht die
 * Liste darunter.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2];
const DATEI = process.argv[3] || 'index.html';
if (!ROOT) {
  console.error('Aufruf: node tools/breite-messen.mjs <ordner> [datei]');
  process.exit(2);
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon'
};

const server = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]);
  if (p === '/') p = '/' + DATEI;
  const fp = path.join(ROOT, p);
  if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    r.writeHead(404); r.end('404'); return;
  }
  r.writeHead(200, { 'content-type': MIME[path.extname(fp)] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(r);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const pwPfad = process.env.PW_CORE || '/tmp/node_modules/playwright-core/index.js';
let pw;
try {
  const mod = await import(pwPfad);
  pw = mod.default || mod;
} catch (e) {
  console.error('❌ playwright-core nicht gefunden. PW_CORE=<pfad>/index.js setzen.');
  console.error('   (' + e.message + ')');
  server.close(); process.exit(2);
}

const browser = await pw.chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--use-gl=swiftshader']
});

const breiten = (process.env.BREITEN || '360,420').split(',').map(Number);
let schlecht = 0;

for (const breite of breiten) {
  const page = await browser.newPage({ viewport: { width: breite, height: 800 } });
  await page.goto(`http://127.0.0.1:${port}/${DATEI}`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const r = await page.evaluate((vw) => {
    const doc = document.documentElement;
    const ueber = [];
    document.querySelectorAll('*').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.height <= 0) return;
      if (b.width <= vw + 1 && b.right <= vw + 1) return;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return;
      ueber.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        cls: (typeof el.className === 'string' ? el.className : '').split(' ')[0] || '',
        breite: Math.round(b.width), rechts: Math.round(b.right),
        minW: s.minWidth, pos: s.position
      });
    });
    return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, ueber: ueber.slice(0, 12) };
  }, breite);

  const passt = r.scrollW <= r.clientW;
  if (!passt) schlecht++;
  console.log(`\n── ${DATEI} bei ${breite} px ──`);
  console.log(`  Seite ist ${r.scrollW} px breit, Fenster ${r.clientW} px  →  ` +
    (passt ? '✅ passt' : `❌ ragt ${r.scrollW - r.clientW} px hinaus`));
  r.ueber.forEach((u) => console.log(
    `   · <${u.tag}${u.id ? ' #' + u.id : ''}${u.cls ? ' .' + u.cls : ''}>  ` +
    `breit ${u.breite}, rechter Rand ${u.rechts}  (min-width: ${u.minW}, position: ${u.pos})`));
  await page.close();
}

await browser.close();
server.close();
process.exit(schlecht ? 1 : 0);
