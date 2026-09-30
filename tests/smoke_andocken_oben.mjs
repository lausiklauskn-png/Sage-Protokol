/* smoke_andocken_oben.mjs — Siegel-Widget (17) und Mycel-Knopf (23) rasten
 * oben an der Leiste ein und bleiben dort, bei jeder Fenstergröße.
 *
 * Lauf:  node tests/smoke_andocken_oben.mjs
 * Braucht `playwright-core`. Fehlt es: nicht lauffähig, nicht rot.
 *
 * Klaus 2026-09-30: „Lässt sich das so machen, dass es sich automatisch
 * verankert, wenn ich das oben an die Navi-Leiste hänge, egal welche, egal
 * welches Betriebssystem, so dass ich das dann auch wieder abnehmen kann."
 * Sein Befund davor: „Dann ist es mal da, mal da und mal da, wenn ich es jetzt
 * größer, mal kleiner mache."
 *
 * Gemessen wird deshalb nicht „es gibt ein Attribut", sondern: nach dem
 * Loslassen steht es IN der Leiste, und nach Größenänderung und Neuladen
 * immer noch — mit gleichem Abstand zum rechten Rand. Und die Gegenrichtung:
 * weiter unten losgelassen rastet nichts ein, und wegziehen nimmt es ab.
 */
import { mkdtempSync, writeFileSync, copyFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const M17 = resolve(WURZEL, 'src/modules/17_floating_widget.js');
const M23 = resolve(WURZEL, 'src/modules/23_rendezvous_ui.js');

const ergebnisse = [];
const ok = (probe, b) => ergebnisse.push({ probe, ok: !!b });

/* Eine Leiste, die KEIN Attribut trägt — „egal welche". `sticky`, 64 px,
   schmal 110 px: sie wird höher, ohne dass das Widget seine Größe ändert —
   nur so ist messbar, dass beim Fenster-Ändern die HÖHE nachgezogen wird. */
const SEITE = (leiste) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>P</title>
<style>body{margin:0}${leiste ? 'header{position:sticky;top:0;height:64px;background:#123;color:#fff;display:flex;align-items:center;padding:0 12px}@media(max-width:800px){header{height:110px}}' : 'header{height:64px}'}</style>
</head><body><header><b>Irgendeine App</b></header><main style="height:2000px">Inhalt</main>
<script src="17.js"></script><script src="23.js"></script></body></html>`;

async function lauf() {
  let chromium;
  try { ({ chromium } = await import('playwright-core')); }
  catch { console.log('⊘ nicht lauffähig: playwright-core fehlt (npm install)'); process.exit(0); }

  const basis = mkdtempSync(join(tmpdir(), 'oben-'));
  copyFileSync(M17, join(basis, '17.js'));
  copyFileSync(M23, join(basis, '23.js'));
  writeFileSync(join(basis, 'mit.html'), SEITE(true));
  writeFileSync(join(basis, 'ohne.html'), SEITE(false));
  const PORT = 9010 + (process.pid % 40);
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: basis, stdio: 'ignore' });
  for (let i = 0; i < 120; i++) {
    try { const a = await fetch(`http://127.0.0.1:${PORT}/mit.html`); if (a.ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }
  const browser = await chromium.launch({ executablePath: chrom() });
  const fehler = [];
  try {
    const seite = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    seite.on('pageerror', (e) => fehler.push(String(e).slice(0, 140)));
    const start = async (datei) => {
      await seite.goto(`http://127.0.0.1:${PORT}/${datei}`);
      await seite.evaluate(() => Promise.all([
        window.SbkimWidget.init({ defaultCorner: 'bottom-left' }),
        window.SbkimRendezvousUI.init({ corner: 'bl' }),
      ]));
      await seite.waitForTimeout(300);
    };
    const lage = (sel) => seite.evaluate((sel) => {
      const n = document.querySelector(sel); if (!n) return null;
      const r = n.getBoundingClientRect(), h = document.querySelector('header').getBoundingClientRect();
      return { l: r.left, r: innerWidth - r.right, t: r.top, b: r.bottom, mitte: r.top + r.height / 2,
               hTop: h.top, hBot: h.bottom, oben: n.getAttribute('data-sbkim-oben') };
    }, sel);
    /* Ziehen an einer Stelle, die KEIN Knopf ist: beim Widget der Rand. */
    const ziehe = async (sel, zx, zy, griff) => {
      const box = await seite.locator(sel).boundingBox();
      let gx = box.x + box.width / 2, gy = box.y + box.height / 2;
      /* Das Widget zieht man an seinem Rahmen, nicht an einem Knopf darin:
         gesucht wird eine Stelle, an der das Widget SELBST obenauf liegt. */
      if (griff === 'rand') {
        const pt = await seite.evaluate((sel) => {
          const w = document.querySelector(sel), r = w.getBoundingClientRect();
          for (const fy of [0.5, 0.3, 0.7]) for (let x = r.right - 2; x > r.left; x -= 2) {
            const y = r.top + r.height * fy;
            if (document.elementFromPoint(x, y) === w) return [x, y];
          }
          return null;
        }, sel);
        /* Gemeldet statt geworfen — ein Wurf nähme alles dahinter mit. */
        if (!pt) { ok(`Griff am Widget gefunden (${sel})`, false); return; }
        [gx, gy] = pt;
      }
      await seite.mouse.move(gx, gy); await seite.mouse.down();
      for (let s = 1; s <= 6; s++) {
        await seite.mouse.move(gx + (zx - gx) * s / 6, gy + (zy - gy) * s / 6);
        await seite.waitForTimeout(20);
      }
      await seite.mouse.up(); await seite.waitForTimeout(250);
    };
    /* „In der Leiste" heißt MITTIG darin (±4 px), nicht irgendwo zwischen
       Ober- und Unterkante: die lose Fassung blieb grün, als die Höhe beim
       Fenster-Ändern nicht nachgezogen wurde (Gegenprobe, 2026-09-30). */
    const inLeiste = (x) => x && Math.abs(x.mitte - (x.hTop + x.hBot) / 2) <= 4;

    for (const [name, sel, griff] of [['Siegel-Widget (17)', '#sbkim-widget', 'rand'],
                                       ['Mycel-Knopf (23)', '#sbkim-rdv-btn', 'mitte']]) {
      await seite.setViewportSize({ width: 1200, height: 800 });
      await seite.goto(`http://127.0.0.1:${PORT}/mit.html`);
      await seite.evaluate(() => localStorage.clear());
      await start('mit.html');
      const a = await lage(sel);
      ok(`${name}: steht anfangs NICHT oben (Vorbedingung)`, a && !a.oben && !inLeiste(a));

      // Gegenrichtung: mitten auf der Seite losgelassen rastet nichts ein
      await ziehe(sel, 700, 400, griff);
      const g = await lage(sel);
      ok(`${name}: mitten auf der Seite losgelassen rastet es NICHT ein`, g && !g.oben);

      // Oben rechts an die Leiste
      await ziehe(sel, 1000, 30, griff);
      const b = await lage(sel);
      ok(`${name}: oben an der Leiste losgelassen rastet es ein (rechts)`, b && b.oben === 'rechts');
      ok(`${name}: … und steht mittig IN der Leiste (${b && Math.round(b.mitte)} in ${b && b.hTop}–${b && b.hBot})`, inLeiste(b));
      const abstand = b && Math.round(b.r);

      // Fenster schmaler: gleicher Abstand zum rechten Rand, weiter in der Leiste
      for (const w of [900, 700]) {
        await seite.setViewportSize({ width: w, height: 800 });
        await seite.waitForTimeout(200);
        const c = await lage(sel);
        ok(`${name}: bei ${w} px noch in der Leiste`, inLeiste(c));
        ok(`${name}: … mit demselben Abstand zum rechten Rand (${c && Math.round(c.r)} ≈ ${abstand})`, c && Math.abs(c.r - abstand) <= 2);
      }
      // Scrollen: bleibt an der klebenden Leiste
      await seite.evaluate(() => scrollTo(0, 600)); await seite.waitForTimeout(150);
      ok(`${name}: nach dem Scrollen noch an der Leiste`, inLeiste(await lage(sel)));
      await seite.evaluate(() => scrollTo(0, 0));

      // Neuladen
      await start('mit.html');
      const d = await lage(sel);
      ok(`${name}: nach dem Neuladen noch eingerastet`, d && d.oben === 'rechts' && inLeiste(d));
      ok(`${name}: … am selben Abstand (${d && Math.round(d.r)} ≈ ${abstand})`, d && Math.abs(d.r - abstand) <= 2);

      // Abnehmen: wegziehen
      await ziehe(sel, 300, 450, griff);
      const e = await lage(sel);
      ok(`${name}: wegziehen nimmt es ab`, e && !e.oben && !inLeiste(e));
      await start('mit.html');
      const f = await lage(sel);
      ok(`${name}: … und das bleibt nach dem Neuladen so`, f && !f.oben);

      // Links einrasten
      await ziehe(sel, 60, 30, griff);
      const l = await lage(sel);
      ok(`${name}: links an der Leiste rastet es links ein`, l && l.oben === 'links' && inLeiste(l));

      // Ohne klebende Leiste: an der Fensteroberkante
      await seite.goto(`http://127.0.0.1:${PORT}/ohne.html`);
      await seite.evaluate(() => localStorage.clear());
      await start('ohne.html');
      await ziehe(sel, 900, 20, griff);
      const o = await lage(sel);
      ok(`${name}: ohne klebende Leiste rastet es an der Fensteroberkante ein`, o && o.oben === 'rechts' && o.t <= 8);
    }
    ok('kein Skript-Fehler' + (fehler.length ? ': ' + fehler[0] : ''), fehler.length === 0);
  } finally {
    await browser.close(); server.kill(); rmSync(basis, { recursive: true, force: true });
  }
}

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

lauf().then(() => {
  let gruen = 0, rot = 0;
  for (const r of ergebnisse) { if (r.ok) gruen++; else rot++; console.log(`${r.ok ? '✓' : '✗'} ${r.probe}`); }
  console.log(`\nSumme: ${gruen} grün, ${rot} rot · ${gruen + rot} insgesamt`);
  process.exit(rot > 0 ? 1 : 0);
}).catch((e) => { console.error('Smoke gescheitert:', e); process.exit(1); });
