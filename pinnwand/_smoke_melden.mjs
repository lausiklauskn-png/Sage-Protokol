#!/usr/bin/env node
/*
 * Browser-Probe — Melde-Weg der Pinnwand, im echten Chromium.
 *
 * WOZU: `tests/smoke_pinnwand_melden.mjs` schneidet den Block heraus und misst
 * seine Logik. Das ist viel, aber es beantwortet eine Frage nicht: ERSCHEINT
 * das Fähnchen überhaupt an einem gezeichneten Zettel, und öffnet es wirklich
 * ein Fenster? Genau daran ist an anderer Stelle schon einmal etwas
 * vorbeigelaufen — eine Fußzeile außerhalb des Sichtfelds, auf die die Maus
 * nie traf, und niemand merkte es, weil die Logik ja stimmte.
 *
 * Hier wird die Seite deshalb wirklich geladen, ein Zettel wirklich gezeichnet
 * und das Fähnchen wirklich angeklickt.
 *
 * Run mit `node pinnwand/_smoke_melden.mjs` (wird von tests/run_alle.mjs
 * mitgesammelt, weil `pinnwand` in dessen Liste AUSSEN steht).
 */
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = dirname(fileURLToPath(import.meta.url));
const TYP = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('  FAIL ' + m); } };

const srv = createServer((q, a) => {
  let p = normalize(decodeURIComponent(q.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  if (p === '/' || p === '') p = '/index.html';
  const datei = join(WURZEL, p);
  if (!existsSync(datei)) { a.writeHead(404); a.end('nix'); return; }
  a.writeHead(200, { 'Content-Type': TYP[extname(datei)] || 'text/plain' });
  a.end(readFileSync(datei));
});
await new Promise((r) => srv.listen(8734, r));

console.log('== Pinnwand · Melde-Weg im Browser ==');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const seite = await (await browser.newContext()).newPage();
const seitenfehler = [];
seite.on('pageerror', (e) => seitenfehler.push(String(e)));

try {
  /* Die Sperr-Liste kommt sonst wirklich aus dem Netz. Hier ins Leere leiten —
     eine Probe, die still ins Netz greift, misst irgendwann etwas anderes als
     das, was sie zu messen glaubt. */
  await seite.route('**/sperrliste.json', (r) => r.fulfill({ status: 404, body: '' }));
  /* Und der Melde-Dienst erst recht nicht: hier soll niemandes Postfach klingeln. */
  let gesendet = null;
  await seite.route('**/einreichung.php', (r) => {
    gesendet = JSON.parse(r.request().postData() || '{}');
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await seite.goto('http://127.0.0.1:8734/index.html', { waitUntil: 'domcontentloaded' });
  /* Auf die BEDINGUNG warten, nie auf die Uhr: die Brücke entsteht am Ende des
     Moduls. Ein `waitForTimeout` mit einer runden Zahl ist ein Rennen, das
     irgendwann verloren geht — und verloren heißt dann nicht „falsch",
     sondern stumm. */
  await seite.waitForFunction(() => window.__pw && window.__pw.zeichneFrage, null, { timeout: 15000 });
  ok(true, 'die Seite lädt und die Prüf-Brücke steht');

  /* Einen fremden Zettel zeichnen — nicht den eigenen, sonst prüft man den
     bequemen Fall. */
  const fremd = { id: 'a1'.repeat(32), pubkey: 'b2'.repeat(32), created_at: 1755600000,
                  kind: 1, tags: [], content: 'Ein fremder Zettel zum Melden' };
  await seite.evaluate((ev) => window.__pw.zeichneFrage(ev, 'wss://test.example'), fremd);

  const flagge = seite.locator('.q-melden').first();
  ok(await flagge.count() === 1, 'am gezeichneten Zettel hängt genau ein Melde-Fähnchen');
  ok(await flagge.isVisible(), '…und es ist wirklich sichtbar');
  const kasten = await flagge.boundingBox();
  ok(kasten && kasten.width >= 24 && kasten.height >= 24,
    `…und groß genug für einen Finger (${kasten ? Math.round(kasten.width) + '×' + Math.round(kasten.height) : 'nicht messbar'})`);
  ok((await flagge.getAttribute('aria-label') || '').length > 0, '…und trägt eine Vorlese-Beschriftung');

  /* Es darf das Löschen-Kreuz nicht überdecken — sonst hätte man einen Knopf
     gebaut, der einen anderen unbenutzbar macht. */
  const kreuz = await seite.locator('.q-del').first().boundingBox();
  ok(kasten && kreuz && (kasten.x + kasten.width) <= kreuz.x + 1,
    'es liegt neben dem Löschen-Kreuz, nicht darüber');

  await flagge.click();
  const dlg = seite.locator('#melde-dialog');
  ok(await dlg.count() === 1, 'der Klick öffnet das Melde-Fenster');
  ok(await dlg.isVisible(), '…und es ist sichtbar');
  ok((await seite.locator('.pw-melde-grund').count()) === 5, '…mit fünf Melde-Gründen zur Wahl');
  ok((await dlg.textContent()).includes('nicht der beanstandete Inhalt selbst'),
    '…und dem Hinweis, was mitgeschickt wird');

  /* Wirklich absenden. Der Dienst ist umgeleitet; was ankommt, sehen wir oben. */
  await seite.locator('.pw-melde-send').click();
  await seite.waitForFunction(
    () => /Eingegangen|Nicht /.test(document.querySelector('.pw-melde-out')?.textContent || ''),
    null, { timeout: 15000 });
  const antwort = await seite.locator('.pw-melde-out').textContent();
  ok(/Eingegangen/.test(antwort), 'nach dem Absenden steht die Eingangsbestätigung da');
  ok(/Beschwerdeweg|Impressum/.test(antwort), '…mit dem Hinweis auf den Beschwerdeweg (Art. 16 Abs. 5)');
  ok(await seite.locator('.pw-melde-out a[href="impressum.html"]').count() === 1,
    '…und der Verweis führt wirklich zum Impressum');

  ok(gesendet && gesendet.zweck === 'meldung', 'der Dienst hat die Meldung wirklich bekommen');
  ok(gesendet && gesendet.eintrag_id === fremd.id, '…mit der Kennung des gemeldeten Zettels');
  ok(gesendet && !JSON.stringify(gesendet).includes('Ein fremder Zettel zum Melden'),
    'DER INHALT DES ZETTELS WURDE NICHT MITGESCHICKT');
  ok(gesendet && gesendet.fp_elapsed >= 1650,
    `die gemeldete Ausfüllzeit ist echt (${gesendet ? gesendet.fp_elapsed : '?'} ms)`);

  /* Der Haken „bei mir ausblenden" war gesetzt — der Zettel muss weg sein. */
  ok(await seite.locator('.q-melden').count() === 0, 'der gemeldete Zettel ist aus der Anzeige verschwunden');
  ok(await seite.evaluate(() => window.__pw.fragen().length) === 0, '…und aus der Ansicht der App');

  ok(seitenfehler.length === 0, 'die Seite hat dabei keinen Fehler geworfen'
    + (seitenfehler.length ? ' — ' + seitenfehler[0] : ''));
} catch (e) {
  fail++; console.log('  FAIL Ausnahme: ' + (e && e.message ? e.message : e));
} finally {
  await browser.close(); srv.close();
}

console.log(`\n== Ergebnis: ${pass} ok, ${fail} FAIL ==`);
process.exit(fail ? 1 : 0);
