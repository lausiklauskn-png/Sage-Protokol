/* smoke_bau23_mycel_platz.mjs — die Mycel-Blase hat einen festen Platz.
 *
 * Lauf:  node tests/smoke_bau23_mycel_platz.mjs
 * Braucht `playwright-core` (npm install). Fehlt es, ist diese Probe
 * **nicht lauffähig, nicht rot** — der Läufer unterscheidet das.
 *
 * ── WORUM KLAUS GEBETEN HAT (2026-09-08) ───────────────────────────────────
 *
 * „Das ist dir auch schon aufgefallen, dass die Mycelkarte immer irgendwo
 *  rumliegt, wenn ich die App öffne. Setz sie bitte an eine feste Stelle in
 *  der Navileiste oben. Und wenn ich sie mit der Maus anklicke und bewegen
 *  möchte, dann kann ich die wie ein Flying Widget in den freien Raum
 *  stellen. … und das in jeder App, denn es taucht immer wieder auf, dass
 *  diese Mycelkarte irgendwo was abdeckt."
 *
 * Sein Befund war konkret: in PWA Toolpoint lag die Blase über dem
 * Markennamen, zu lesen war „…A Toolpoint".
 *
 * ── WARUM DIESE PROBE EINEN BROWSER BRAUCHT ────────────────────────────────
 *
 * Die vorhandene `smoke_bau23_rendezvous_ui.mjs` fährt einen DOM-Stub. Der
 * kennt kein Layout: `getBoundingClientRect` liefert dort nichts, und genau
 * die Frage „liegt die Blase ÜBER dem Markennamen?" ist eine Layout-Frage.
 * Ein Wächter am Stub hätte den Befund nie gesehen.
 *
 * ── DIE FALLE, DIE HIER GEMESSEN WIRD, UND SIE WAR ECHT ────────────────────
 *
 * Das Lösen aus der Leiste hängt den Knopf per `appendChild` in den <body> —
 * und ein Element, das aus dem DOM genommen und neu eingehängt wird, VERLIERT
 * seinen Pointer-Capture. Gemessen am Ereignis-Mitschnitt: nach `pointerdown`
 * kam genau EIN `pointermove`, danach nichts mehr, kein `pointerup`. Die
 * Folge war still: `end()` lief nie, die Lage wurde NIE gemerkt, und beim
 * nächsten Laden sprang der Knopf in die Leiste zurück — das Ziehen war
 * folgenlos. Deshalb misst diese Probe den ganzen Kreislauf, nicht nur den
 * Anfangszustand.
 */

import { mkdtempSync, writeFileSync, copyFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MODUL = resolve(WURZEL, 'src/modules/23_rendezvous_ui.js');

const ergebnisse = [];
const ok = (probe, bedingung, hinweis) => ergebnisse.push({ probe, ok: !!bedingung, hinweis });

/* Eine Seite MIT Platz und eine OHNE — die zweite ist die Gegenrichtung:
   eine App ohne Leiste darf von dieser Änderung nichts merken. */
const SEITE = (mitPlatz) => `<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>Probe</title></head><body>
<header style="display:flex;gap:10px;padding:10px;background:#111;color:#fff">
  <a id="marke" href="#">PWA Toolpoint</a>
  ${mitPlatz ? '<span data-sbkim-mycel-platz style="margin-left:auto"></span>' : ''}
</header><main style="height:1200px">Inhalt</main>
<script src="23_rendezvous_ui.js"></script></body></html>`;

async function lauf() {
  let chromium;
  try { ({ chromium } = await import('playwright-core')); }
  catch { console.log('⊘ nicht lauffähig: playwright-core fehlt (npm install)'); process.exit(0); }

  const basis = mkdtempSync(join(tmpdir(), 'mycelplatz-'));
  copyFileSync(MODUL, join(basis, '23_rendezvous_ui.js'));
  writeFileSync(join(basis, 'mit.html'), SEITE(true));
  writeFileSync(join(basis, 'ohne.html'), SEITE(false));

  const PORT = 8970 + (process.pid % 25);
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'],
    { cwd: basis, stdio: 'ignore' });
  for (let i = 0; i < 120; i++) {
    try { const a = await fetch(`http://127.0.0.1:${PORT}/mit.html`); if (a.ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }

  const browser = await chromium.launch({ executablePath: chrom() });
  const fehler = [];
  try {
    const seite = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    seite.on('pageerror', (e) => fehler.push(String(e).slice(0, 140)));

    const lage = () => seite.evaluate(() => {
      const b = document.getElementById('sbkim-rdv-btn');
      if (!b) return null;
      const r = b.getBoundingClientRect();
      const m = document.getElementById('marke').getBoundingClientRect();
      return {
        pos: getComputedStyle(b).position,
        imPlatz: !!b.closest('[data-sbkim-mycel-platz]'),
        angedockt: b.getAttribute('data-sbkim-angedockt') === '1',
        x: Math.round(r.left), y: Math.round(r.top),
        /* Klaus' eigentlicher Befund — gemessen, nicht als Attribut geraten. */
        ueberlapptMarke: !(r.right < m.left || r.left > m.right ||
                           r.bottom < m.top || r.top > m.bottom),
        gemerkt: (() => { try { return localStorage.getItem('sbkim_rdv_ui_pos'); }
                          catch { return 'FEHLER'; } })(),
      };
    });
    const start = async (datei) => {
      await seite.goto(`http://127.0.0.1:${PORT}/${datei}`);
      await seite.evaluate(() => window.SbkimRendezvousUI.init({ corner: 'tl' }));
      await seite.waitForTimeout(250);
    };

    // ── 1 · MIT Platz: die Blase sitzt darin und verdeckt nichts ──────────
    await start('mit.html');
    const a = await lage();
    ok('mit einem Platz in der Leiste sitzt die Blase darin', a && a.imPlatz);
    ok('… und steht im Fluss, nicht darüber (position:static)', a && a.pos === 'static');
    ok('… und trägt die Marke data-sbkim-angedockt', a && a.angedockt);
    ok('… und verdeckt den Markennamen NICHT', a && a.ueberlapptMarke === false);

    // ── 2 · ZIEHEN löst sie und MERKT die Lage ────────────────────────────
    const box = await seite.locator('#sbkim-rdv-btn').boundingBox();
    await seite.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await seite.mouse.down();
    for (const s of [1, 2, 3, 4, 5]) {
      await seite.mouse.move(box.x - 90 * s, box.y + 70 * s);
      await seite.waitForTimeout(25);
    }
    await seite.mouse.up();
    await seite.waitForTimeout(250);
    const b1 = await lage();
    ok('ein Zug löst sie aus der Leiste', b1 && !b1.imPlatz && b1.pos === 'fixed');
    ok(`… und die Lage wird gemerkt (${b1 && b1.gemerkt})`,
       b1 && b1.gemerkt && b1.gemerkt !== 'FEHLER' && /"x":/.test(b1.gemerkt));
    /* ⚠ DIE ZUSICHERUNG, DIE OHNE POINTER-CAPTURE STILL FIEL: sie ist wirklich
       dort, wo der Finger sie hingezogen hat — nicht dort, wo der erste
       Schritt sie liegen liess. */
    ok(`… und sie ist wirklich mitgewandert (${b1 && b1.x}/${b1 && b1.y})`,
       b1 && Math.abs(b1.x - a.x) > 100 && Math.abs(b1.y - a.y) > 100);

    // ── 3 · Die gemerkte Lage GEWINNT über den Platz ──────────────────────
    await start('mit.html');
    const c = await lage();
    ok('nach dem Neuladen bleibt sie, wo sie hingezogen wurde',
       c && !c.imPlatz && Math.abs(c.x - b1.x) < 3 && Math.abs(c.y - b1.y) < 3);

    // ── 4 · Der Weg ZURÜCK ────────────────────────────────────────────────
    await seite.evaluate(() => document.getElementById('sbkim-rdv-btn').click());
    await seite.waitForTimeout(250);
    const dock = await seite.evaluate(() => {
      const d = document.querySelector('[data-sbkim-andocken]');
      return { da: !!d, sichtbar: d ? !d.hidden : false };
    });
    ok('es gibt einen Weg zurück in die Leiste', dock.da && dock.sichtbar);
    await seite.evaluate(() => document.querySelector('[data-sbkim-andocken]').click());
    await seite.waitForTimeout(250);
    const d1 = await lage();
    ok('… und er dockt sie wirklich wieder an', d1 && d1.imPlatz && d1.pos === 'static');
    ok('… und löscht die gemerkte Lage, sonst käme sie beim Laden zurück',
       d1 && !d1.gemerkt);
    await start('mit.html');
    const d2 = await lage();
    ok('… und sie bleibt auch nach dem Neuladen in der Leiste', d2 && d2.imPlatz);

    // ── 5 · OHNE Platz bleibt ALLES wie bisher (fail-soft) ────────────────
    /* ⚠ DIE GEGENRICHTUNG. Ohne sie wäre „sitzt in der Leiste" auch grün,
       wenn eine App ohne Leiste gar keine Blase mehr bekäme — und dann wäre
       das Netz-Werkzeug dort schlicht weg. */
    await start('ohne.html');
    const e = await lage();
    ok('ohne Platz gibt es die Blase weiterhin', !!e);
    ok('… und sie steht wie bisher frei über der Seite (fixed)',
       e && e.pos === 'fixed' && !e.imPlatz && !e.angedockt);
    /* Und das ist der Beleg für Klaus' Befund selbst: OHNE Platz liegt sie
       wirklich über dem Markennamen. Ein Wächter ohne diese Zeile könnte
       behaupten, es habe das Problem nie gegeben. */
    ok('… und liegt dann über dem Markennamen — genau Klaus’ Befund',
       e && e.ueberlapptMarke === true);
    const dockOhne = await seite.evaluate(() => {
      const d = document.querySelector('[data-sbkim-andocken]');
      return d ? !d.hidden : null;
    });
    await seite.evaluate(() => document.getElementById('sbkim-rdv-btn').click());
    await seite.waitForTimeout(250);
    const dockOhne2 = await seite.evaluate(() => {
      const d = document.querySelector('[data-sbkim-andocken]');
      return d ? !d.hidden : null;
    });
    /* Kein toter Knopf: wo es keinen Platz gibt, steht auch kein „zurück". */
    ok(`… und der Zurück-Knopf steht dort NICHT (kein toter Knopf, ${dockOhne2})`,
       dockOhne2 === false);

    ok('kein Skript-Fehler' + (fehler.length ? ': ' + fehler[0] : ''), fehler.length === 0);
    await seite.close();
  } finally {
    await browser.close();
    server.kill();
    rmSync(basis, { recursive: true, force: true });
  }
}

/* ⚠ KEIN `require` — `package.json` traegt zwar kein `"type": "module"`, diese
   Datei ist aber `.mjs` und damit ein ES-Modul; `require` gibt es dort nicht.
   Beim ersten Lauf sofort gescheitert: „Failed to launch chromium because
   executable doesn't exist" — die Rueckfallzeile, weil der try-Block warf. */
function chrom() {
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try {
    const o = readdirSync(heim).filter((n) => /^chromium-\d+$/.test(n))
      .sort((x, y) => Number(y.split('-')[1]) - Number(x.split('-')[1]));
    for (const n of o) {
      const w = join(heim, n, 'chrome-linux', 'chrome');
      if (existsSync(w)) return w;
    }
  } catch { /* kein Browser-Heim — der Aufrufer meldet „nicht lauffaehig" */ }
  return join(heim, 'chromium', 'chrome-linux', 'chrome');
}

lauf().then(() => {
  let gruen = 0, rot = 0;
  for (const r of ergebnisse) {
    if (r.ok) gruen++; else rot++;
    console.log(`${r.ok ? '✓' : '✗'} ${r.probe}`);
  }
  console.log(`\nSumme: ${gruen} grün, ${rot} rot · ${gruen + rot} insgesamt`);
  process.exit(rot > 0 ? 1 : 0);
}).catch((e) => { console.error('Smoke gescheitert:', e); process.exit(1); });
