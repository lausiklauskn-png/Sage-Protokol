/* smoke_sicherheit_verteilen.mjs — was tools/sicherheit-verteilen.mjs von einer App erhält (2026-10-17).
 *
 * Lauf:  node tests/smoke_sicherheit_verteilen.mjs [pfad/zum/werkzeug.mjs]
 * Ohne Browser. Gefragt wird `anpassen(alt)` an gestellten alten Seiten:
 *   V1 Akzentfarbe (a{color}, var(--gold), --accent) · V2 Rückweg · V3 Titel-Zusatz
 *   · V4 eigene Abschnitte DE/EN bleiben, auch beim zweiten Lauf · V5 Kopf und Fuß bleiben
 *   · V6 canonical → indexierbar, sonst noindex · V7 Sprach-Schlüssel · V8 eine neutrale
 *   Seite bleibt die Vorlage · V9 ohne alte Seite: die Vorlage.
 */
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WERKZEUG = process.argv[2] ? resolve(process.argv[2]) : join(WURZEL, 'tools/sicherheit-verteilen.mjs');
const { anpassen } = await import(pathToFileURL(WERKZEUG).href);
const VORLAGE = readFileSync(join(WURZEL, 'sicherheit.html'), 'utf8');
let gruen = 0, rot = 0;
function t(name, ok, extra) {
  if (ok) { gruen++; console.log('✓ ' + name); }
  else { rot++; console.log('✗ ROT: ' + name + (extra ? ' — ' + String(extra).slice(0, 240) : '')); }
}

const altStandard = `<!doctype html><html lang="de"><head><title>So funktioniert das Mycel — Probe-App</title>
<style> a { color: #6ea0ff; } </style></head><body>
<a class="back" id="backLink" href="./index.html">← zurück zur Startseite</a></body></html>`;
const r1 = anpassen(altStandard, VORLAGE);
t('V1a Akzent aus a { color }', r1.neu.includes('--akzent: #6ea0ff;') && !r1.neu.includes('--akzent: #36d6c3;'));
t('V2 Rückweg: Adresse und deutscher Text bleiben, der englische folgt der Adresse',
  r1.neu.includes('<a class="back" data-zurueck href="./index.html">← zurück zur Startseite</a>') &&
  r1.neu.includes('<a class="back" data-zurueck href="./index.html">← back to the app</a>'));
t('V3 Titel-Zusatz bleibt', r1.neu.includes('<title>So funktioniert das Mycel — Probe-App</title>'));
t('V6a ohne canonical gilt noindex', r1.neu.includes('<meta name="robots" content="noindex">'));

const altVar = `<html lang="de"><head><title>So funktioniert das Mycel — und so bist du geschützt · SBKIM · Probe</title>
<style>:root{--gold:#ffd166;--accent:#38b8aa} a{color:var(--gold)}</style></head><body><a class="back" href="index.html">‹ zurück zu Probe</a></body></html>`;
const r2 = anpassen(altVar, VORLAGE);
t('V1b Akzent über var(--gold) aufgelöst', r2.neu.includes('--akzent: #ffd166;'), r2.notiz.join(' · '));
t('V3b Titel: nur der Name bleibt, nicht „und so bist du geschützt" oder „SBKIM"', r2.neu.includes('<title>So funktioniert das Mycel — Probe</title>'));
// the real case (Mein-Rezeptbuch): the title ENDS with a non-name — then there is no suffix at all
const altSbkim = `<html><head><title>So funktioniert das Mycel — und so bist du geschützt · SBKIM</title></head><body></body></html>`;
t('V3c Titel ohne Namen („… · SBKIM“): kein erfundener Zusatz', anpassen(altSbkim, VORLAGE).neu.includes('<title>So funktioniert das Mycel</title>'));
const altAcc = `<html><head><style>:root{--accent:#2dd4bf}</style></head><body></body></html>`;
t('V1c Akzent aus --accent, wenn kein a{color}', anpassen(altAcc, VORLAGE).neu.includes('--akzent: #2dd4bf;'));

// own sections, head and foot: first run from a page that already carries the markers
let mitEigen = VORLAGE
  .replace(/<!-- APP-EIGEN-DE[^\n]*\n/, '<!-- APP-EIGEN-DE: Probe -->\n  <h2 id="probe">Eigener Abschnitt</h2>\n  <p>nur hier</p>\n  <p>zweite Zeile</p>\n\n  ')
  .replace('<!-- APP-EIGEN-EN -->\n', '<!-- APP-EIGEN-EN -->\n  <h2 id="en-probe">Own section</h2>\n  <p>only here</p>\n  <p>second line</p>\n\n  ')
  .replace('<meta charset="utf-8">', '<!-- APP-EIGEN-KOPF -->\n<script>/*RIEGEL*/</script>\n<!-- /APP-EIGEN-KOPF -->\n<meta charset="utf-8">')
  .replace('</body>', '<!-- APP-EIGEN-FUSS -->\n<script>/*FUSS*/</script>\n<!-- /APP-EIGEN-FUSS -->\n</body>');
const r4 = anpassen(mitEigen, VORLAGE);
t('V4a eigener deutscher Abschnitt bleibt', r4.neu.includes('<h2 id="probe">Eigener Abschnitt</h2>'));
t('V4b eigener englischer Abschnitt bleibt', r4.neu.includes('<h2 id="en-probe">Own section</h2>'));
const r4b = anpassen(r4.neu, VORLAGE);
t('V4c ein zweiter Lauf ändert nichts (kein Abschnitt doppelt, keiner verloren)', r4b.neu === r4.neu &&
  (r4b.neu.match(/id="probe"/g) || []).length === 1);
t('V5a eigener Kopf bleibt, genau einmal, vor dem ersten Anstrich', (r4.neu.match(/\/\*RIEGEL\*\//g) || []).length === 1 &&
  r4.neu.indexOf('/*RIEGEL*/') < r4.neu.indexOf('<meta charset="utf-8">'));
t('V5b eigener Fuß bleibt, genau einmal, vor </body>', (r4.neu.match(/\/\*FUSS\*\//g) || []).length === 1 &&
  r4.neu.indexOf('/*FUSS*/') < r4.neu.indexOf('</body>'));

const altCanon = `<html lang="de" data-sprache-schluessel="app_lang"><head><meta name="description" content="Probe">
<link rel="canonical" href="https://probe.example/sicherheit.html" /></head><body></body></html>`;
const r6 = anpassen(altCanon, VORLAGE);
t('V6b mit canonical: indexierbar, canonical und Beschreibung bleiben', !r6.neu.includes('content="noindex"') &&
  r6.neu.includes('<link rel="canonical" href="https://probe.example/sicherheit.html" />') && r6.neu.includes('content="Probe"'));
t('V7 Sprach-Schlüssel der App bleibt', r6.neu.includes('<html lang="de" data-sprache-schluessel="app_lang">'));

const neutral = anpassen(VORLAGE, VORLAGE);
t('V8 die neutrale Vorlage bleibt sie selbst', neutral.neu === VORLAGE, neutral.notiz.join(' · '));
t('V9 ohne alte Seite: die Vorlage', anpassen('', VORLAGE).neu === VORLAGE);

console.log(`\n${gruen} grün · ${rot} ROT`);
process.exit(rot ? 1 : 0);
