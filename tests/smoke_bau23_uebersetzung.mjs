/* smoke_bau23_uebersetzung.mjs — die Kopfzeilen-Knöpfe überleben eine Seiten-Übersetzung.
 *
 * Lauf:  node tests/smoke_bau23_uebersetzung.mjs
 * Braucht `playwright-core` (npm install). Fehlt es, ist diese Probe
 * **nicht lauffähig, nicht rot**.
 *
 * ── KLAUS' BEFUND (2026-09-23, Alis Moderaum) ──────────────────────────────
 *
 * „lässt sich die Mycel/Mit dem Knotennetz verbinden Karte nicht minimieren
 *  oder schließen und die Tooltips ein und aus funktioniert auch nicht"
 *
 * Die Seite war vom Browser übersetzt. Die Übersetzung wickelt jeden Text in
 * <font><font>…</font></font>. Der Zieh-Griff der Kopfzeile prüfte nur, ob das
 * ZIEL ein Knopf ist — bei einem <font> im Knopf startete er einen Zug, nahm
 * den Pointer-Capture, und der Klick landete auf der Kopfzeile.
 *
 * ── WARUM EIN BROWSER ──────────────────────────────────────────────────────
 *
 * Der Fehler lebt im Pointer-Capture: welches Element den `click` bekommt,
 * entscheidet der Browser. Ein DOM-Stub hätte ihn nie gezeigt.
 *
 * ── GEGENRICHTUNG ──────────────────────────────────────────────────────────
 *
 * Die Probe misst zuerst, dass das Ziel wirklich ein <font> ist (sonst wäre
 * „grün" auch ohne Übersetzung grün), und danach, dass Ziehen an der
 * — ebenfalls übersetzten — Überschrift weiter geht. Ein Fix, der die ganze
 * Kopfzeile vom Ziehen ausnimmt, fiele dort auf.
 */

import { mkdtempSync, writeFileSync, copyFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MODUL = resolve(WURZEL, 'src/modules/23_rendezvous_ui.js');

const ergebnisse = [];
const ok = (probe, bedingung) => ergebnisse.push({ probe, ok: !!bedingung });

const SEITE = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>Probe</title></head><body><main style="height:1200px">Inhalt</main>
<script src="23_rendezvous_ui.js"></script></body></html>`;

async function lauf() {
  let chromium;
  try { ({ chromium } = await import('playwright-core')); }
  catch { console.log('⊘ nicht lauffähig: playwright-core fehlt (npm install)'); process.exit(0); }

  const basis = mkdtempSync(join(tmpdir(), 'uebersetzung-'));
  copyFileSync(MODUL, join(basis, '23_rendezvous_ui.js'));
  writeFileSync(join(basis, 'seite.html'), SEITE);

  const PORT = 9000 + (process.pid % 25);
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'],
    { cwd: basis, stdio: 'ignore' });
  for (let i = 0; i < 120; i++) {
    try { const a = await fetch(`http://127.0.0.1:${PORT}/seite.html`); if (a.ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }

  const browser = await chromium.launch({ executablePath: chrom() });
  const fehler = [];
  try {
    const seite = await browser.newPage({ viewport: { width: 1000, height: 700 } });
    seite.on('pageerror', (e) => fehler.push(String(e).slice(0, 140)));

    const zustand = () => seite.evaluate(() => ({
      panel: document.getElementById('sbkim-rdv-panel').style.display,
      pille: document.getElementById('sbkim-rdv-btn').style.display,
      tipsAus: localStorage.getItem('sbkim_tips_off'),
      lage: localStorage.getItem('sbkim_rdv_ui_pos'),
    }));
    /* Was die Übersetzung tut: jeden Textknoten in <font><font> wickeln. */
    const uebersetzen = () => seite.evaluate(() => {
      const kopf = document.getElementById('sbkim-rdv-panel').firstElementChild;
      const w = document.createTreeWalker(kopf, NodeFilter.SHOW_TEXT);
      const t = []; while (w.nextNode()) t.push(w.currentNode);
      for (const n of t) {
        const a = document.createElement('font'), b = document.createElement('font');
        b.textContent = n.textContent; a.appendChild(b); n.parentNode.replaceChild(a, n);
      }
    });
    const knopf = (zeichen) => seite.evaluate((z) => {
      const k = [...document.querySelectorAll('#sbkim-rdv-panel button')].find((b) => b.textContent.trim() === z);
      const r = k.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      return { x, y, ziel: document.elementFromPoint(x, y).tagName };
    }, zeichen);
    const tippen = async (z) => { const k = await knopf(z); await seite.mouse.click(k.x, k.y); await seite.waitForTimeout(150); return k; };
    const oeffnen = async () => { await seite.evaluate(() => window.SbkimRendezvousUI.show()); await uebersetzen(); };

    await seite.goto(`http://127.0.0.1:${PORT}/seite.html`);
    await seite.evaluate(() => { localStorage.clear(); window.SbkimRendezvousUI.init({ corner: 'bl' }); });
    await seite.waitForTimeout(250);
    await oeffnen();

    // ── 0 · die Übersetzung ist wirklich da ───────────────────────────────
    const k0 = await knopf('–');
    ok(`unter dem Finger liegt ein <font>, nicht der Knopf (${k0.ziel})`, k0.ziel === 'FONT');

    // ── 1 · 💬 schaltet Tipps aus und wieder an ───────────────────────────
    await tippen('💬');
    ok('💬 schaltet die Tipps aus', (await zustand()).tipsAus === '1');
    await tippen('💬');
    ok('… und wieder an', (await zustand()).tipsAus === '0');

    // ── 2 · – minimiert zur Pille ─────────────────────────────────────────
    await tippen('–');
    const z2 = await zustand();
    ok('– minimiert: Panel zu, Pille da', z2.panel === 'none' && z2.pille === '');

    // ── 3 · ✕ blendet beides aus ──────────────────────────────────────────
    await oeffnen();
    await tippen('✕');
    const z3 = await zustand();
    ok('✕ blendet Panel und Pille aus', z3.panel === 'none' && z3.pille === 'none');

    // ── 4 · GEGENRICHTUNG: Ziehen an der übersetzten Überschrift geht noch
    await oeffnen();
    const h = await seite.evaluate(() => {
      const r = document.querySelector('#sbkim-rdv-panel strong').getBoundingClientRect();
      return { x: r.left + 20, y: r.top + r.height / 2 };
    });
    await seite.mouse.move(h.x, h.y); await seite.mouse.down();
    for (const s of [1, 2, 3, 4, 5]) { await seite.mouse.move(h.x + 20 * s, h.y + 15 * s); await seite.waitForTimeout(20); }
    await seite.mouse.up(); await seite.waitForTimeout(150);
    const z4 = await zustand();
    ok(`Ziehen an der Überschrift geht weiter und merkt die Lage (${z4.lage})`, z4.lage && /"x":/.test(z4.lage));
    ok('… und das Panel bleibt dabei offen', z4.panel === 'block');

    ok('kein Skript-Fehler' + (fehler.length ? ': ' + fehler[0] : ''), fehler.length === 0);
  } finally {
    await browser.close();
    server.kill();
    rmSync(basis, { recursive: true, force: true });
  }
}

function chrom() {
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try {
    const o = readdirSync(heim).filter((n) => /^chromium-\d+$/.test(n))
      .sort((x, y) => Number(y.split('-')[1]) - Number(x.split('-')[1]));
    for (const n of o) {
      const w = join(heim, n, 'chrome-linux', 'chrome');
      if (existsSync(w)) return w;
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
