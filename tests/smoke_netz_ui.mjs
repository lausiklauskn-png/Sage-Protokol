/* smoke_netz_ui.mjs — Einstellung „Netz" in Modul 23-UI (Schritt 2, 2026-10-13).
 *
 * Lauf:  node tests/smoke_netz_ui.mjs
 * Braucht `playwright-core` und Chromium. Fehlt eins: Rückgabe 2, „nicht lauffähig".
 *
 * Brief docs/BRIEF_2026-10-13_eigenes-netz-schritt2.md, Schritt 1:
 *   Lage sichtbar · Code erzeugen und weitergeben · im eigenen Netz automatisch
 *   verbinden · ein ungültiger Code fällt NIE still ins öffentliche Netz.
 * Klaus 2026-10-13: Weitergabe per Link · „jederzeit ein neues Tool hinzufügen".
 *
 * Echte Module 23 und 23-UI; das Relais (05b) ist gestellt und zeichnet nur
 * auf, welche Adressen gesetzt werden. connectAndAnnounce wird gezählt, nicht
 * ausgeführt — gemessen wird, OB verbunden wird, nicht das Netz.
 */
import { mkdtempSync, writeFileSync, copyFileSync, rmSync, readdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const M23 = resolve(WURZEL, 'src/modules/23_rendezvous.js');
const M23UI = resolve(WURZEL, 'src/modules/23_rendezvous_ui.js');
const CODE = 'K7QM-3XRA-WP9T-ZL4N-BV2H';
const RELAIS = 'wss://relay-intern.example';

let gruen = 0, rot = 0;
const ok = (b, t, ist) => { b ? gruen++ : rot++; console.log(`${b ? '  ✓' : '  ✗ ROT'} ${t}${b || ist === undefined ? '' : `\n        ist: ${JSON.stringify(ist)}`}`); };

const SEITE = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Netz</title></head><body>
<script>
  window.__relais = [];
  window.SbkimNostrRelay = {
    publish: function () { return Promise.resolve({ ok: true }); },
    subscribe: function () { return { close: function () {} }; },
    configure: function (o) { window.__relais.push(JSON.stringify(o)); return { ok: true, relays: (o && o.relays) || ['wss://relay.family-projekt.de'] }; },
  };
</script>
<script src="23.js"></script>
<script>
  window.__verbinde = 0;
  window.SbkimRendezvous.connectAndAnnounce = function () { window.__verbinde++; return Promise.resolve({ ok: true, nodeId: 'probe', created: false }); };
</script>
<script src="23ui.js"></script>
<script>window.SbkimRendezvousUI.init({ dbSuffix: 'netzprobe', nodeName: 'Probe' });</script>
</body></html>`;

function chrom() {
  if (existsSync('/opt/pw-browsers/chromium')) return '/opt/pw-browsers/chromium';
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try {
    for (const n of readdirSync(heim).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
      for (const u of ['chrome-linux', 'chrome-linux64']) { const w = join(heim, n, u, 'chrome'); if (existsSync(w)) return w; }
    }
  } catch {}
  return null;
}

async function lauf() {
  let chromium;
  try { ({ chromium } = await import('playwright-core')); }
  catch { console.log('⊘ nicht lauffähig: playwright-core fehlt (npm install)'); process.exit(2); }
  const exe = chrom();
  if (!exe) { console.log('⊘ nicht lauffähig: kein Chromium'); process.exit(2); }

  const basis = mkdtempSync(join(tmpdir(), 'netzui-'));
  copyFileSync(M23, join(basis, '23.js'));
  copyFileSync(M23UI, join(basis, '23ui.js'));
  writeFileSync(join(basis, 'index.html'), SEITE);
  const PORT = 9300 + (process.pid % 60);
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: basis, stdio: 'ignore' });
  for (let i = 0; i < 120; i++) {
    try { const a = await fetch(`http://127.0.0.1:${PORT}/index.html`); if (a.ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }
  const URL0 = `http://127.0.0.1:${PORT}/index.html`;
  const browser = await chromium.launch({ executablePath: exe });
  const fehler = [];
  try {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => fehler.push(String(e).slice(0, 160)));
    const bereit = () => p.waitForFunction(() => {
      const l = document.querySelector('[data-sbkim-netz-lage]');
      return l && l.textContent && l.getAttribute('data-lage') !== 'wird-abgeleitet';
    }, null, { timeout: 15000 }).then(() => true, () => false);
    const lage = () => p.evaluate(() => ({
      text: document.querySelector('[data-sbkim-netz-lage]')?.textContent || null,
      lage: document.querySelector('[data-sbkim-netz-lage]')?.getAttribute('data-lage') || null,
      knopf: document.querySelector('#sbkim-rdv-btn')?.getAttribute('data-sbkim-netz') ?? null,
      verbinde: window.__verbinde,
      relais: window.__relais.slice(),
      gespeichert: localStorage.getItem('sbkim_netz_netzprobe'),
      offen: window.SbkimRendezvousUI.isOpen ? window.SbkimRendezvousUI.isOpen() : null,
      meldung: document.querySelector('[data-sbkim-netz-meldung]')?.textContent || '',
      beitritt: (() => { const b = document.querySelector('[data-sbkim-netz-beitritt]'); return b && b.style.display !== 'none' ? b.textContent : null; })(),
      adresse: location.href,
    }));

    console.log('\n── A · ohne Einstellung');
    await p.goto(URL0);
    ok(await bereit(), 'die Lage-Zeile steht da');
    let z = await lage();
    ok(z.lage === 'oeffentlich' && /Öffentliches Netz/.test(z.text), 'ohne Einstellung: „Öffentliches Netz (Vorgabe)"', z);
    ok(z.knopf === 'oeffentlich', 'der Rendezvous-Knopf trägt data-sbkim-netz="oeffentlich"', z.knopf);
    ok(z.verbinde === 0, 'ohne Einstellung wird NICHT von selbst verbunden', z.verbinde);
    ok(z.relais.length === 0, 'ohne Einstellung wird die Relais-Liste nicht angefasst', z.relais);

    console.log('\n── B · Code erzeugen, übernehmen, Lage');
    await p.evaluate(() => { window.SbkimRendezvousUI.show(); document.querySelector('[data-sbkim-netz-box]').open = true; });
    await p.fill('[data-sbkim-netz-name]', 'Werkstatt');
    await p.fill('[data-sbkim-netz-relais]', 'wss://relay-intern.example');
    await p.click('[data-sbkim-netz-neu]');
    const code = await p.inputValue('[data-sbkim-netz-code]');
    ok(/^[A-Z0-9]{4}(-[A-Z0-9]{4}){4}$/.test(code), '„Code erzeugen" füllt einen Code (5×4 Zeichen)', code);
    z = await lage();
    ok(z.gespeichert === null && z.lage === 'oeffentlich', 'ein erzeugter Code gilt erst nach „Übernehmen"', z);
    await p.click('[data-sbkim-netz-ok]');
    await p.waitForFunction(() => document.querySelector('[data-sbkim-netz-lage]')?.getAttribute('data-lage') === 'eigen', null, { timeout: 15000 }).catch(() => {});
    z = await lage();
    ok(z.lage === 'eigen' && /Eigenes Netz: Werkstatt · wss:\/\/relay-intern\.example/.test(z.text), 'nach „Übernehmen": „Eigenes Netz: Werkstatt · Relais"', z.text);
    ok(z.knopf === 'eigen', 'der Knopf trägt data-sbkim-netz="eigen"', z.knopf);
    ok(z.relais.some((r) => r.includes('relay-intern.example')), 'die Relais-Adresse geht an 05b', z.relais);
    let gesp = null; try { gesp = JSON.parse(z.gespeichert); } catch {}
    ok(gesp && gesp.code === code && gesp.relay === 'wss://relay-intern.example', 'die Einstellung steht unter sbkim_netz_netzprobe', z.gespeichert);
    await p.waitForFunction(() => window.__verbinde > 0, null, { timeout: 5000 }).catch(() => {});
    z = await lage();
    ok(z.verbinde === 1, 'nach „Übernehmen" wird verbunden', z.verbinde);

    console.log('\n── C · beim nächsten Öffnen von selbst');
    await p.reload();
    ok(await bereit(), 'nach dem Neuladen steht die Lage da');
    await p.waitForFunction(() => window.__verbinde > 0, null, { timeout: 8000 }).catch(() => {});
    z = await lage();
    ok(z.lage === 'eigen', 'nach dem Neuladen: eigenes Netz', z.lage);
    ok(z.verbinde === 1, 'im eigenen Netz verbindet die App beim Öffnen von selbst', z.verbinde);
    ok(await p.inputValue('[data-sbkim-netz-code]') === code, 'die Felder zeigen die gespeicherte Einstellung', null);

    console.log('\n── D · Link zum Weitergeben');
    const link = await p.evaluate(() => window.SbkimRendezvousUI._test.netz.linkZeigen());
    ok(typeof link === 'string' && link.startsWith(URL0 + '#sbkim-netz='), 'der Link ist die Adresse + #sbkim-netz=… (Fragment, nie an einen Server)', link);
    ok(link && !link.includes(code) && !link.includes(code.replace(/-/g, '')), 'der Code steht nicht im Klartext im Link', link);
    const zurueck = await p.evaluate((h) => window.SbkimRendezvousUI._test.netz.ausLink(h), link.slice(link.indexOf('#')));
    ok(zurueck && zurueck.code === code && zurueck.relay === 'wss://relay-intern.example' && zurueck.name === 'Werkstatt', 'der Link trägt Name, Relais und Code zurück', zurueck);
    z = await lage();
    ok(/nur an eigene Geräte/.test(z.meldung), 'beim Link steht: nur an eigene Geräte weitergeben', z.meldung);
    const kaputt = await p.evaluate(() => window.SbkimRendezvousUI._test.netz.ausLink('#sbkim-netz=%%%'));
    ok(kaputt === null, 'ein kaputter Link ergibt nichts (kein Raten)', kaputt);
    const fremd = await p.evaluate(() => { const j = JSON.stringify({ v: 2, n: 'X', r: 'wss://a.example', c: 'K7QM-3XRA-WP9T-ZL4N-BV2H' }); const b = btoa(j).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); return window.SbkimRendezvousUI._test.netz.ausLink('#sbkim-netz=' + b); });
    ok(fremd === null, 'ein Link einer anderen Fassung (v:2) wird nicht geraten', fremd);

    console.log('\n── E · neues Tool tritt per Link bei (frischer Browser)');
    const ctx2 = await browser.newContext({ viewport: { width: 1100, height: 900 } });
    const q = await ctx2.newPage();
    q.on('pageerror', (e) => fehler.push(String(e).slice(0, 160)));
    await q.goto(link);
    await q.waitForFunction(() => { const b = document.querySelector('[data-sbkim-netz-beitritt]'); return b && b.style.display !== 'none'; }, null, { timeout: 15000 }).catch(() => {});
    let y = await q.evaluate(() => ({
      beitritt: (() => { const b = document.querySelector('[data-sbkim-netz-beitritt]'); return b && b.style.display !== 'none' ? b.textContent : null; })(),
      gespeichert: localStorage.getItem('sbkim_netz_netzprobe'), verbinde: window.__verbinde, adresse: location.href,
      lage: document.querySelector('[data-sbkim-netz-lage]')?.getAttribute('data-lage'),
    }));
    ok(y.beitritt && /Diesem Netz beitreten\?/.test(y.beitritt) && /Werkstatt/.test(y.beitritt), 'der Link fragt „Diesem Netz beitreten?" und nennt das Netz', y.beitritt);
    ok(y.gespeichert === null && y.verbinde === 0 && y.lage === 'oeffentlich', 'vor der Antwort wird nichts übernommen und nicht verbunden', y);
    ok(!y.adresse.includes('#sbkim-netz='), 'die Adresse ist geputzt (der Code bleibt nicht im Verlauf)', y.adresse);
    await q.click('[data-sbkim-netz-ja]');
    await q.waitForFunction(() => document.querySelector('[data-sbkim-netz-lage]')?.getAttribute('data-lage') === 'eigen' && window.__verbinde > 0, null, { timeout: 15000 }).catch(() => {});
    y = await q.evaluate(() => ({ lage: document.querySelector('[data-sbkim-netz-lage]')?.getAttribute('data-lage'), gespeichert: localStorage.getItem('sbkim_netz_netzprobe'), verbinde: window.__verbinde }));
    ok(y.lage === 'eigen' && y.verbinde === 1 && JSON.parse(y.gespeichert || '{}').code === code, '„Beitreten" übernimmt, speichert und verbindet', y);
    // Ablehnen
    const ctx3 = await browser.newContext();
    const r3 = await ctx3.newPage();
    await r3.goto(link);
    await r3.waitForFunction(() => { const b = document.querySelector('[data-sbkim-netz-beitritt]'); return b && b.style.display !== 'none'; }, null, { timeout: 15000 }).catch(() => {});
    const neinDa = await r3.$('[data-sbkim-netz-nein]');
    if (neinDa) await r3.click('[data-sbkim-netz-nein]');
    await r3.waitForTimeout(300);
    y = await r3.evaluate(() => ({ lage: document.querySelector('[data-sbkim-netz-lage]')?.getAttribute('data-lage'), gespeichert: localStorage.getItem('sbkim_netz_netzprobe'), verbinde: window.__verbinde }));
    ok(!!neinDa && y.lage === 'oeffentlich' && y.gespeichert === null && y.verbinde === 0, '„Nicht beitreten" lässt alles, wie es war', y);
    await ctx2.close(); await ctx3.close();

    console.log('\n── F · ungültige Einstellung: NIE still öffentlich');
    await p.evaluate(() => localStorage.setItem('sbkim_netz_netzprobe', JSON.stringify({ v: 1, name: 'X', relay: 'ws://unsicher.example', code: 'K7QM-3XRA-WP9T-ZL4N-BV2H', auto: true })));
    await p.evaluate(() => { window.__relais.length = 0; });
    await p.reload();
    ok(await bereit(), 'die Lage steht da');
    await p.waitForTimeout(400);
    z = await lage();
    ok(z.lage === 'ungueltig' && /ungültig — es wird nicht verbunden/.test(z.text), 'kaputte Einstellung: „ungültig — es wird nicht verbunden" samt Grund', z.text);
    ok(/Relais-Adresse ungültig/.test(z.text), '…und der Grund steht dabei', z.text);
    ok(z.knopf === 'ungueltig', 'der Knopf trägt data-sbkim-netz="ungueltig"', z.knopf);
    ok(z.verbinde === 0, 'mit ungültiger Einstellung wird NICHT verbunden', z.verbinde);
    ok(!z.relais.some((r) => r.includes('"reset":true')), 'die Relais-Liste wird NICHT auf öffentlich zurückgesetzt', z.relais);
    const meta = await p.evaluate(() => window.SbkimRendezvous._meta.network);
    ok(meta === 'ungueltig', 'Modul 23 meldet ebenfalls „ungueltig"', meta);
    await p.evaluate(() => localStorage.setItem('sbkim_netz_netzprobe', '{kaputt'));
    await p.reload(); await bereit(); await p.waitForTimeout(300);
    z = await lage();
    ok(z.lage === 'ungueltig' && z.verbinde === 0, 'unlesbare Einstellung: ebenfalls ungültig, nicht verbunden', z);

    console.log('\n── G · zurück ins öffentliche Netz');
    await p.evaluate(() => { window.__relais.length = 0; window.SbkimRendezvousUI.show(); document.querySelector('[data-sbkim-netz-box]').open = true; });
    await p.click('[data-sbkim-netz-weg]');
    await p.waitForFunction(() => document.querySelector('[data-sbkim-netz-lage]')?.getAttribute('data-lage') === 'oeffentlich', null, { timeout: 8000 }).catch(() => {});
    z = await lage();
    ok(z.lage === 'oeffentlich' && z.gespeichert === null, '„Zurück ins öffentliche Netz" löscht die Einstellung und zeigt „Öffentliches Netz"', z);
    ok(z.relais.some((r) => r.includes('"reset":true')), '…und setzt die Relais-Liste von 05b zurück', z.relais);
    ok(z.verbinde === 0, '…und verbindet nicht von selbst', z.verbinde);
    await p.reload(); await bereit(); await p.waitForTimeout(300);
    z = await lage();
    ok(z.lage === 'oeffentlich' && z.verbinde === 0, 'nach dem Neuladen: öffentlich, nicht verbunden', z);

    console.log('\n── I · nichts im Code, was nicht hingehört');
    const src = readFileSync(M23UI, 'utf8');
    const block = src.slice(src.indexOf('Eigenes Netz: Einstellung „Netz"'), src.indexOf('  function mount() {'));
    ok(block.length > 2000, 'der Netz-Block steht in 23-UI', block.length);
    ok(!/fetch\s*\(|XMLHttpRequest|sendBeacon/.test(block), 'der Netz-Block schickt nichts ins Netz (kein fetch)', null);
    ok(!/\.innerHTML\s*=/.test(block), 'der Netz-Block setzt kein innerHTML (fremder Link ist nur Text)', null);
    ok(/\.replaceState\(/.test(block), 'die Adresse wird nach dem Lesen geputzt', null);
  } finally {
    await browser.close();
    server.kill();
    rmSync(basis, { recursive: true, force: true });
  }
  ok(fehler.length === 0, 'keine Seitenfehler', fehler);
  console.log(`\n${gruen} grün · ${rot} ROT`);
  process.exit(rot ? 1 : 0);
}
lauf().catch((e) => { console.log('✗ ROT: Probe gestolpert: ' + (e && e.stack || e)); process.exit(1); });
