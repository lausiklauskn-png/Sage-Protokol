/*
 * Probe: JEDER Service-Worker im Netz laesst sich parsen.
 *
 * ── WARUM ES DIESE PROBE GIBT (Befund 2026-09-15) ───────────────────────────
 *
 * Der A18-Rollout hat die Wizard-Zeile nicht nur an die Nachlade-Kette in
 * `index.html` angehaengt, sondern auch an den Offline-Vorrat in `sw.js`. In
 * Mein-WorkFloh stehen dort DREI Pfade je Zeile, und das Werkzeug spiegelte die
 * GANZE Zeile:
 *
 *   'assets/nostr-listen-init.js', 'assets/siegel-inhalt.js'         <- Komma fehlt
 *   'assets/nostr-listen-init.js', 'assets/sbkim-andock-wizard.js'   <- Doppel-Eintrag
 *
 * `SyntaxError: Unexpected string`. EIN SERVICE-WORKER, DER NICHT PARST,
 * INSTALLIERT NICHT — die App hatte einen Tag lang keinen Offline-Vorrat.
 *
 * ⚠ WARUM `wizard-laedt-pruefen.mjs` DAS NICHT FAENGT, und das ist der Punkt:
 * jener Waechter LAEDT die Seite und misst, ob Konfiguration und Kanon
 * ankommen. Ein Service-Worker ist daran nicht beteiligt — er wird
 * REGISTRIERT, nicht geladen. Die Seite war tadellos, der Vorrat tot.
 * Ein Waechter misst, was er misst, und kein Zeichen mehr.
 *
 * `node --check` kostet Millisekunden und beantwortet EINE Frage: laesst sich
 * die Datei lesen. Ob der Vorrat die richtigen Dateien nennt, misst sie nicht —
 * dafuer gibt es die Proben in den Apps selbst.
 *
 * Lauf: node tests/smoke_service_worker_parst.mjs
 */
import { readdirSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const NACHBARN = dirname(WURZEL);
const NAMEN = ["sw.js", "app-sw.js", "sbkim-sw.js", "company-sw.js"];

let gruen = 0, rot = 0;
const ok = (was, bedingung, hinweis) => {
  if (bedingung) { gruen++; console.log(`  ✓ ${was}`); }
  else { rot++; console.log(`  ✗ ROT — ${was}${hinweis ? "\n      " + hinweis : ""}`); }
};

console.log("\n── Jeder Service-Worker im Netz laesst sich parsen ──\n");

/* Die Liste wird GEFUNDEN, nicht gepflegt — dieselbe Regel wie in
   kanon-verteilen.mjs. Wer eine neue App baut, traegt sie nirgends ein. */
const gefunden = [];
let repos = [];
try {
  repos = readdirSync(NACHBARN)
    .map((n) => join(NACHBARN, n))
    .filter((p) => { try { return statSync(join(p, ".git")).isDirectory(); } catch { return false; } });
} catch { /* bleibt leer, gleich als nicht lauffaehig gemeldet */ }

for (const r of repos) for (const n of NAMEN) {
  const p = join(r, n);
  if (existsSync(p)) gefunden.push(p);
}

/* ⚠ KEINE NACHBARN HEISST NICHT LAUFFAEHIG, NICHT GRUEN. In einem Behaelter
   ohne die Geschwister-Klone gibt es nichts zu messen; das als bestanden zu
   melden waere der schlimmere Fehler. */
if (!gefunden.length) {
  console.log("⊘ NICHT LAUFFAEHIG — keine Nachbar-Depots mit Service-Worker gefunden.");
  console.log("   Ungeprüft, nicht rot.\n");
  process.exit(0);
}

ok(`es gibt Service-Worker zu pruefen (${gefunden.length})`, gefunden.length >= 10);

const kaputt = [];
for (const p of gefunden) {
  try { execFileSync(process.execPath, ["--check", p], { stdio: "pipe" }); }
  catch (e) {
    const z = String(e.stderr || e.message).split("\n").filter(Boolean).slice(0, 3).join(" | ");
    kaputt.push({ p: relative(NACHBARN, p), z });
  }
}
ok("kein Service-Worker bricht beim Parsen ab",
  kaputt.length === 0,
  kaputt.map((k) => `${k.p}\n        ${k.z}`).join("\n      "));

/* Die Gegenrichtung: ohne sie waere „0 kaputt" auch dann grün, wenn `--check`
   gar nicht liefe. Geprueft wird an einer Wegwerf-Datei, nicht am echten Baum. */
const wegwerf = join(WURZEL, "__sw_gegenprobe__.js");
let merktEsWirklich = false;
try {
  writeFileSync(wegwerf, "const A = [\n  'a', 'b'\n  'c'\n];\n", "utf8");
  try { execFileSync(process.execPath, ["--check", wegwerf], { stdio: "pipe" }); }
  catch { merktEsWirklich = true; }
} finally { try { unlinkSync(wegwerf); } catch {} }
ok("… und die Pruefung faengt genau den Komma-Fall (`'a','b'` unter `'c'`)", merktEsWirklich);

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
process.exit(rot > 0 ? 1 : 0);
