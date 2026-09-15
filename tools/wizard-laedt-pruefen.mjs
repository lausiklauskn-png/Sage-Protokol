/*
 * Misst in JEDEM Nachbar-Repo, ob die Nachlade-Kette den Andock-Wizard und die
 * App-Konfiguration WIRKLICH im Browser ankommen laesst.
 *
 * Aufruf:  node tools/wizard-laedt-pruefen.mjs
 *          node tools/wizard-laedt-pruefen.mjs ../Mein-Mixarium     (nur eins)
 *
 * ── WARUM ES DIESES WERKZEUG GIBT (Befund 2026-09-15) ───────────────────────
 *
 * Der A18-Rollout hat die Wizard-Zeile an die Nachlade-Ketten ANGEHAENGT. Stand
 * die Vorlage als LETZTES Feld-Element ohne Komma da, fehlte es danach — und
 * das hat je nach Gestalt der Kette zwei sehr verschiedene Wirkungen:
 *
 *   ["a","b"]        Kein Syntaxfehler, sondern ein ZUGRIFF. Zwei Eintraege
 *   ["c","d"]        werden still zu EINEM `undefined`; die Kette stirbt beim
 *                    letzten Schritt. Module laden, Wizard und Konfig nicht.
 *
 *   "a"              ECHTER Syntaxfehler. Der ganze Skript-Block stirbt —
 *   "b"              keine Module, keine Lampen, kein Siegel.
 *
 * Gemessen am 2026-09-15 ueber 24 Seiten: SIEBEN Apps betroffen, VIER davon
 * ohne jedes SBKIM.
 *
 * ⚠ EINE TEXTSUCHE HAETTE DAS NICHT GEFANGEN. Sie kennt die Form, die sie
 * sucht; hier gab es zwei Formen mit derselben Ursache und verschiedenem
 * Schaden. Gemessen wird deshalb, was im BROWSER ankommt — ein Waechter, der
 * eine Datei LIEST, misst nicht, ob sie LAEUFT.
 *
 * ⚠ NICHT LAUFFAEHIG IST NICHT ROT. Fehlt playwright-core oder der Browser,
 * sagt das Werkzeug das und gibt 0 zurueck. Eine ungeprüfte Sache als bestanden
 * zu melden waere der schlimmere Fehler; sie als Befund zu melden der zweite.
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const HIER = dirname(fileURLToPath(import.meta.url));
const SAGE = join(HIER, "..");
const NACHBARN = dirname(SAGE);
const WIZARD = "sbkim-andock-wizard.js";

/* ── Benannte Ausnahmen ─────────────────────────────────────────────────────
 * Jede mit GRUND. Eine Ausnahmeliste ohne Gruende waechst still und versteckt
 * genau die Rueckfaelle, gegen die das Werkzeug gebaut ist. Und sie wird in
 * BEIDE Richtungen geprueft: wird eine Ausnahme ueberfluessig, meldet das
 * Werkzeug das — sonst deckt sie irgendwann etwas zu, das laengst geht. */
const AUSNAHMEN = {
  "Kimhub/start.html":
    "Die Werkstatt wird kein Knoten. Die Modul-Dateien liegen in kim-hub-company; "
    + "die Kette zeigt hier absichtlich ins Leere und ist fail-soft (Kimhub/CLAUDE.md).",
  "Jasons-Tresor/jasons-bibliothek/index.html":
    "Spiegel-Seite in einem Unterordner ohne eigenes assets/. Vorbestehend, "
    + "nicht von A18 — vorher wie nachher gemessen.",
  "Mein-Tresor/jasons-bibliothek/index.html":
    "Dasselbe wie bei Jasons-Tresor: Spiegel ohne eigenes assets/. Vorbestehend."
};

const nurEins = process.argv[2] ? join(process.cwd(), process.argv[2]) : null;

/* ── Die Seiten finden, statt sie zu pflegen ────────────────────────────────
 * Dieselbe Regel wie in kanon-verteilen.mjs: wer eine neue App baut, traegt sie
 * nirgends ein. Sie ist dabei, sobald eine ihrer Seiten den Wizard laedt. */
function seitenVon(repo) {
  const raus = [];
  (function lauf(d, tiefe) {
    if (tiefe > 3) return;
    let e; try { e = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const x of e) {
      if (x.name === "node_modules" || x.name === ".git" || x.name === "docs" || x.name === "tests") continue;
      const p = join(d, x.name);
      if (x.isDirectory()) lauf(p, tiefe + 1);
      else if (x.name.endsWith(".html")) {
        let t; try { t = readFileSync(p, "utf8"); } catch { continue; }
        if (t.includes(WIZARD)) raus.push(relative(repo, p));
      }
    }
  })(repo, 0);
  return raus;
}

const repos = nurEins ? [nurEins] : readdirSync(NACHBARN)
  .map((n) => join(NACHBARN, n))
  .filter((p) => { try { return statSync(join(p, ".git")).isDirectory(); } catch { return false; } });

const ziele = [];
for (const r of repos) for (const s of seitenVon(r)) ziele.push({ repo: r, name: r.split("/").pop(), seite: s });

if (!ziele.length) {
  console.log("Keine Seite gefunden, die den Andock-Wizard laedt — nichts zu messen.");
  process.exit(0);
}

let chromium, CHROME = null;
try {
  ({ chromium } = await import("playwright-core"));
  for (const k of readdirSync("/opt/pw-browsers")) {
    const p = join("/opt/pw-browsers", k, "chrome-linux", "chrome");
    if (existsSync(p)) { CHROME = p; break; }
  }
} catch { /* bleibt null */ }

if (!chromium || !CHROME) {
  console.log("⊘ NICHT LAUFFAEHIG — playwright-core oder Chromium fehlt.");
  console.log("   npm install   im Sage-Depot, dann erneut. Ungeprüft, nicht rot.");
  process.exit(0);
}

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: CHROME });
let port = 8760;
const kaputt = [], unnoetig = [];

console.log(`\n── Kommen Konfiguration und Kanon im Browser an? (${ziele.length} Seiten) ──\n`);
console.log("Repo".padEnd(22) + "Seite".padEnd(30) + "KONFIG  KANON");
console.log("─".repeat(74));

for (const { repo, name, seite } of ziele) {
  const schluessel = `${name}/${seite}`.replace(/\\/g, "/");
  const p = ++port;
  const srv = spawn("python3", ["-m", "http.server", String(p), "--bind", "127.0.0.1"],
    { cwd: repo, stdio: "ignore" });
  await warte(450);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  let r = { konfig: false, kanon: false };
  try {
    await page.goto(`http://127.0.0.1:${p}/${seite}`, { waitUntil: "load", timeout: 30000 });
    /* Auf die BEDINGUNG warten, nicht auf die Uhr — die Kette laeuft in
       Leerlauf-Pausen, ein Modul je Runde. Die Frist ist die Obergrenze. */
    await page.waitForFunction(
      () => !!(window.SBKIM_SIEGEL_WIZ && window.SbkimSiegelTexte), { timeout: 20000 }
    ).catch(() => {});
    r = await page.evaluate(() => ({
      konfig: !!(window.SBKIM_SIEGEL_WIZ && typeof window.SBKIM_SIEGEL_WIZ === "object"),
      kanon: !!window.SbkimSiegelTexte
    }));
  } catch { /* bleibt false, gleich als Befund gemeldet */ }
  await ctx.close(); srv.kill();

  const gut = r.konfig && r.kanon;
  const erlaubt = Object.prototype.hasOwnProperty.call(AUSNAHMEN, schluessel);
  if (!gut && !erlaubt) kaputt.push(schluessel);
  if (gut && erlaubt) unnoetig.push(schluessel);

  const marke = gut ? "✓" : (erlaubt ? "⊘" : "✗");
  console.log(name.padEnd(22) + seite.padEnd(30) +
    (r.konfig ? "✓" : "✗").padEnd(8) + (r.kanon ? "✓" : "✗") + "   " + marke);
}
await browser.close();

console.log("─".repeat(74));
for (const k of Object.keys(AUSNAHMEN)) {
  if (ziele.some((z) => `${z.name}/${z.seite}` === k)) console.log(`⊘ benannte Ausnahme · ${k}\n   ${AUSNAHMEN[k]}`);
}
if (unnoetig.length) {
  console.log(`\n⚠ ${unnoetig.length} Ausnahme(n) sind UEBERFLUESSIG geworden — sie gehen jetzt:`);
  for (const u of unnoetig) console.log(`   ${u}  → aus AUSNAHMEN nehmen, sonst deckt sie den naechsten Rueckfall zu`);
}
console.log(kaputt.length
  ? `\n✗ ${kaputt.length} Seite(n) ohne Wizard: ${kaputt.join(", ")}`
  : `\n✓ alle ${ziele.length - Object.keys(AUSNAHMEN).filter((k) => ziele.some((z) => `${z.name}/${z.seite}` === k)).length} nicht ausgenommenen Seiten liefern Konfiguration UND Kanon aus`);

process.exit(kaputt.length || unnoetig.length ? 1 : 0);
