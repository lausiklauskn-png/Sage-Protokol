/* smoke_23b_netzverwaltung_ui.mjs — Modul 23b im echten Browser (2026-10-16).
 *
 * Lauf:  node tests/smoke_23b_netzverwaltung_ui.mjs
 * Braucht `playwright-core`. Fehlt es: nicht lauffähig, nicht rot.
 *
 * Gemessen wird die Oberfläche über einem gestellten Modul 23 (der Kern ist in
 * smoke_23b_netzverwaltung.mjs mit echtem Modul 01/02/23 geprüft):
 *   U1 vier Listen, je mit Suche · U2 ein fremder Name mit HTML bleibt Text ·
 *   U3 die Suche filtert · U4 Sperren nur für den Netzadmin · U5 Widerrufen
 *   verlangt einen Grund · U6 beim Öffnen kein Netz (kein discover, kein fetch) ·
 *   U7 Sage: langer Druck auf das © öffnet netz-verwaltung.html, kurzer nicht ·
 *   U9 die eigene Seite (page) zeigt die Netz-Verwaltung mit Erklärkasten ·
 *   U8 englische Seite → englische Überschrift.
 */
import { mkdtempSync, writeFileSync, copyFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let gruen = 0, rot = 0;
function t(name, ok, extra) {
  if (ok) { gruen++; console.log('✓ ' + name); }
  else { rot++; console.log('✗ ROT: ' + name + (extra ? ' — ' + String(extra).slice(0, 240) : '')); }
}

const BOESE = '<img src=x onerror="window.__xss=1">Böse';
const STUB = (admin) => `<script>
window.__calls = { discover: 0, revoke: [], block: [] };
var ICH = "MARKTMARKTMARKTMARKT01", ADMIN = ${admin ? 'ICH' : '"SAGESAGESAGESAGESAGE01"'};
window.SbkimSpore = { getOwnSpore: async function () { return { id: ICH }; }, verifyForeignSpore: async function () { return { valid: true }; } };
window.SbkimRendezvous = {
  currentNetAdmin: function () { return ADMIN; },
  vouchTrust: async function (cards) { return cards.map(function (c) { return Object.assign({}, c, { vouch: { status: "unverbuergt", by: [] } }); }); },
  loadSeenRevocations: function () { return [{ kind: "sbkim-vouch-revoke", voucher: "FREMDFREMDFREMDFREMD01", subject: "APPAAPPAAPPAAPPAAPPA01", ts: 1790000000, reason: ${JSON.stringify(BOESE)}, sig: "s1" }]; },
  currentBlocklist: async function () { return { stand: "gueltig", admin: ADMIN, ts: 1790000000, ids: ["SPERRSPERRSPERRSPERR01"] }; },
  isBlocked: function (id) { return id === "SPERRSPERRSPERRSPERR01"; },
  discover: async function () { window.__calls.discover++; return { ok: true, cards: [{ nodeId: "RAUMRAUMRAUMRAUMRAUM01", nodeName: "Im Raum", vouch: { status: "unverbuergt", by: [] } }] }; },
  createVouch: async function (id) { return { ok: true, zettel: { kind: "sbkim-vouch", v: 1, voucher: ICH, subject: id, ts: 1, exp: 2, sig: "v" } }; },
  vouchPassOn: function (z) { return [z]; },
  createRevocation: async function (id, g) { window.__calls.revoke.push(g); return (g && g.trim()) ? { ok: true, zettel: { kind: "sbkim-vouch-revoke", voucher: ICH, subject: id, ts: 3, reason: g, sig: "r" } } : { ok: false, reason: "Grund fehlt" }; },
  addCarried: async function () { return { ok: true }; },
  blockId: async function (id) { window.__calls.block.push(id); return { ok: true, zettel: {} }; },
  createBlocklist: async function () { return { ok: true }; },
};
window.SBKIM_DB_SUFFIX = "probe";
</script>`;
const SEITE = (lang, admin) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>NV</title></head><body style="background:#000">
${STUB(admin)}
<div id="box"></div>
<script src="src/modules/23b_netzverwaltung.js"></script>
<script>
window.__fertig = SbkimNetzVerwaltung.mount(document.getElementById("box"), {
  entries: [{ label: ${JSON.stringify(BOESE)}, nodeId: "APPAAPPAAPPAAPPAAPPA01" }, { label: "Rezeptbuch", nodeId: "APPBAPPBAPPBAPPBAPPB01" }, { label: "Ohne Kennung" }]
}).ready.then(function () { window.__bereit = 1; });
</script></body></html>`;
const SAGE = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Sage</title></head><body>
${STUB(true)}
<main style="height:400px">Inhalt</main><p class="legal-line" style="padding:20px">© 2026 Klaus Nitzsche · <a href="impressum.html">Impressum</a></p>
<script src="assets/studio-sage.js"></script></body></html>`;

async function lauf() {
  let chromium;
  try { ({ chromium } = await import('playwright-core')); }
  catch { console.log('⊘ nicht lauffähig: playwright-core fehlt (npm install)'); process.exit(0); }
  const basis = mkdtempSync(join(tmpdir(), 'nv23b-'));
  mkdirSync(join(basis, 'src/modules'), { recursive: true });
  mkdirSync(join(basis, 'assets'), { recursive: true });
  copyFileSync(resolve(WURZEL, 'src/modules/23b_netzverwaltung.js'), join(basis, 'src/modules/23b_netzverwaltung.js'));
  copyFileSync(resolve(WURZEL, 'assets/studio-sage.js'), join(basis, 'assets/studio-sage.js'));
  writeFileSync(join(basis, 'markt.html'), SEITE('de', false));
  writeFileSync(join(basis, 'admin.html'), SEITE('de', true));
  writeFileSync(join(basis, 'en.html'), SEITE('en', false));
  writeFileSync(join(basis, 'sage.html'), SAGE);
  writeFileSync(join(basis, 'netz-verwaltung.html'), `<!doctype html><html lang="de"><head><meta charset="utf-8"></head><body>${STUB(true)}<div id="sbkim-netzverwaltung"></div><script src="src/modules/23b_netzverwaltung.js"></script><script>SbkimNetzVerwaltung.page({ nodeName: 'Sage', dbSuffix: 'probe' });</script></body></html>`);
  const PORT = 9300 + (process.pid % 50);
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: basis, stdio: 'ignore' });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] })
    .catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
  try {
    const url = (f) => `http://127.0.0.1:${PORT}/${f}`;
    for (let i = 0; i < 50; i++) { try { const r = await fetch(url('markt.html')); if (r.ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    const fremd = [];
    p.on('request', (r) => { if (!r.url().startsWith(url(''))) fremd.push(r.url()); });
    await p.goto(url('markt.html'));
    await p.waitForFunction(() => window.__bereit === 1, null, { timeout: 15000 });
    const listen = await p.$$eval('[data-nv-suche]', (xs) => xs.map(x => x.getAttribute('data-nv-suche')));
    t('U1 vier Listen, je mit Suche', JSON.stringify(listen) === JSON.stringify(['apps', 'buergschaften', 'widerrufe', 'sperrliste']), JSON.stringify(listen));
    const xss = await p.evaluate(() => ({ x: window.__xss || 0, img: document.querySelectorAll('#box img').length, text: document.getElementById('box').textContent }));
    t('U2 ein fremder Name (Eintrag und Widerrufs-Grund) mit HTML bleibt Text', xss.x === 0 && xss.img === 0 && xss.text.includes('<img src=x'), JSON.stringify(xss).slice(0, 200));
    await p.fill('[data-nv-suche=apps]', 'rezept');
    const sicht = await p.$$eval('[data-nv-liste=apps] > [data-nv-zeile]', (xs) => xs.filter(x => x.style.display !== 'none').map(x => x.textContent.slice(0, 20)));
    t('U3 die Suche filtert Liste (a)', sicht.length === 1 && sicht[0].startsWith('Rezeptbuch'), JSON.stringify(sicht));
    await p.fill('[data-nv-suche=apps]', '');
    const knoepfeMarkt = await p.$$eval('[data-nv-liste=apps] button', (xs) => xs.map(x => x.textContent));
    t('U4a der Markt sieht Empfehlen, aber kein Sperren/Lösen', knoepfeMarkt.includes('Empfehlen') && !knoepfeMarkt.includes('Sperren') && !knoepfeMarkt.includes('Lösen'), JSON.stringify(knoepfeMarkt));
    const ohne = await p.$eval('[data-nv-zeile=""]', (x) => x.textContent);
    t('U4b ein Eintrag ohne Kennung bleibt sichtbar, ohne Knöpfe', /keine Kennung hinterlegt/.test(ohne) && !/Empfehlen/.test(ohne), ohne);
    t('U6 beim Öffnen kein Netz: kein discover, keine fremde Adresse', (await p.evaluate(() => window.__calls.discover)) === 0 && fremd.length === 0, JSON.stringify(fremd));
    await p.click('[data-nv=raum]');
    await p.waitForFunction(() => !!document.querySelector('[data-nv-zeile=RAUMRAUMRAUMRAUMRAUM01]'), null, { timeout: 5000 }).catch(() => {});
    t('U6b erst der Knopf liest den Raum; die Karte kommt in Liste (a)', (await p.evaluate(() => window.__calls.discover)) === 1 && !!(await p.$('[data-nv-zeile=RAUMRAUMRAUMRAUMRAUM01]')));
    // Bürgen → Text zum Weitergeben
    await p.click('[data-nv-zeile=APPBAPPBAPPBAPPBAPPB01] button');
    await p.waitForSelector('[data-nv=zettel]', { timeout: 5000 }).catch(() => {});
    const zettel = await p.$eval('[data-nv=zettel]', (x) => x.value).catch(() => '');
    t('U5a Bürgen zeigt den unterschriebenen Text zum Kopieren', /sbkim-vouch/.test(zettel), zettel.slice(0, 80));
    await ctx.close();

    // Netzadmin: Sperren da; Widerrufen braucht Grund
    const c2 = await browser.newContext(); const a = await c2.newPage();
    await a.goto(url('admin.html'));
    await a.waitForFunction(() => window.__bereit === 1, null, { timeout: 15000 });
    const knoepfeAdmin = await a.$$eval('[data-nv-liste=apps] button', (xs) => xs.map(x => x.textContent));
    const loesen = await a.$$eval('[data-nv-liste=sperrliste] button', (xs) => xs.map(x => x.textContent));
    t('U4c der Netzadmin sieht Sperren und in der Sperrliste Lösen', knoepfeAdmin.includes('Sperren') && loesen.includes('Lösen'), JSON.stringify([knoepfeAdmin, loesen]));
    // Widerrufen ist nur bei eigener Bürgschaft da — der Stub liefert keine; Grund-Feld über Sperren einer verbürgten fehlt hier,
    // darum direkt: Kern-Funktion revoke ohne Grund → kein Erfolg
    const r = await a.evaluate(async () => (await SbkimNetzVerwaltung.revoke('APPAAPPAAPPAAPPAAPPA01', '  ')).ok);
    t('U5b Widerrufen ohne Grund schlägt fehl', r === false);
    await c2.close();

    // Englisch
    const c3 = await browser.newContext(); const e = await c3.newPage();
    await e.goto(url('en.html'));
    await e.waitForFunction(() => window.__bereit === 1, null, { timeout: 15000 });
    const titel = await e.$eval('[data-sbkim-netzverwaltung] > div', (x) => x.textContent);
    t('U8 englische Seite → englische Überschrift', titel === '🕸 Network admin', titel);
    await c3.close();

    // Sage-Studio: langer Druck öffnet, kurzer nicht
    const c4 = await browser.newContext({ hasTouch: false }); const s = await c4.newPage();
    await s.goto(url('sage.html'));
    const box = await (await s.$('.legal-line')).boundingBox();
    await s.mouse.move(box.x + 10, box.y + 10);
    await s.mouse.down(); await s.waitForTimeout(300); await s.mouse.up();
    await s.waitForTimeout(400);
    const kurz = !!(await s.$('[data-sbkim-studio]'));
    await s.mouse.down();
    await s.waitForURL(/netz-verwaltung\.html$/, { timeout: 5000 }).catch(() => {});
    await s.mouse.up().catch(() => {});
    const lang = /netz-verwaltung\.html$/.test(s.url());
    t('U7 Sage: langer Druck (1,5 s) auf das © öffnet die eigene Seite netz-verwaltung.html, ein kurzer nicht', !kurz && lang, JSON.stringify({ kurz, url: s.url() }));
    const seite = await s.evaluate(() => !!document.querySelector('#sbkim-netzverwaltung [data-sbkim-netzverwaltung] [data-nv=hilfe]')).catch(() => false);
    t('U9 die eigene Seite zeigt die Netz-Verwaltung mit dem Kasten „So bürgst du aus deiner App“', seite);
    await c4.close();
  } finally {
    await browser.close(); server.kill(); rmSync(basis, { recursive: true, force: true });
  }
  console.log('\n' + gruen + ' grün · ' + rot + ' rot');
  process.exitCode = rot ? 1 : 0;
}
lauf().catch((e) => { console.log('✗ ROT: Lauf abgebrochen — ' + (e && e.stack || e)); process.exitCode = 1; });
