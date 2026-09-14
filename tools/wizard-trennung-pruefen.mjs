#!/usr/bin/env node
/*
 * wizard-trennung-pruefen.mjs — misst in einem Nachbar-Klon, ob die A18-Trennung
 * WIRKLICH traegt: die Konfiguration der App + der Kanon ergeben zusammen ein
 * vollstaendiges Andock-Werkzeug.
 *
 * ⚠ GEMESSEN WIRD IM BROWSER, NICHT IM QUELLTEXT. Ein Waechter, der zwei Dateien
 * LIEST, misst nicht, ob sie zusammen LAUFEN — und genau das ist die Frage nach
 * einem Umbau, der zwei Dateien aus einer macht. Geladen werden die ECHTEN
 * Dateien der App in ihrer echten Reihenfolge.
 *
 * ⚠ ES WIRD NICHT DIE index.html DER APP GEOEFFNET. Die braucht ihre ganze
 * Modul-Kette, IndexedDB und ein Netz; was hier gemessen werden soll, ist das
 * Zusammenspiel der ZWEI Dateien — alles andere waere Rauschen, und ein Rot aus
 * fremdem Grund ist schlimmer als kein Lauf.
 *
 * Aufruf: node tools/wizard-trennung-pruefen.mjs ../Kim-Bell
 */
import { readFileSync, existsSync, mkdtempSync, writeFileSync, copyFileSync, rmSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, relative } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const KANON = readFileSync(join(WURZEL, "src/modules/16b_andock_wizard.js"), "utf8");
const ZIEL = process.argv[2];
if (!ZIEL || !existsSync(join(ZIEL, ".git"))) { console.error("Aufruf: node tools/wizard-trennung-pruefen.mjs <repo>"); process.exit(1); }

const UEBER = new Set(["node_modules", ".git", "docs", "archiv"]);
function finde(w, muster, tiefe = 0) {
  const aus = [];
  if (tiefe > 4) return aus;
  let e; try { e = readdirSync(w); } catch { return aus; }
  for (const n of e) {
    if (UEBER.has(n)) continue;
    const p = join(w, n);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) aus.push(...finde(p, muster, tiefe + 1));
    else if (muster.test(n)) aus.push(p);
  }
  return aus;
}

const ergebnisse = [];
const ok = (was, wahr) => { ergebnisse.push(!!wahr); console.log(`  ${wahr ? "✓" : "✗ ROT:"} ${was}`); };

function chrom() {
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  try {
    const o = readdirSync(heim).filter((n) => /^chromium-\d+$/.test(n))
      .sort((x, y) => Number(y.split("-")[1]) - Number(x.split("-")[1]));
    for (const n of o) { const w = join(heim, n, "chrome-linux", "chrome"); if (existsSync(w)) return w; }
  } catch { /* kein Browser-Heim */ }
  return join(heim, "chromium", "chrome-linux", "chrome");
}

const paare = finde(ZIEL, /^(pruefer-)?siegel-inhalt\.js$/).map((k) => {
  const wiz = join(dirname(k), basename(k).replace("siegel-inhalt.js", "sbkim-andock-wizard.js"));
  return { konfig: k, wizard: wiz };
});

console.log(`\n▶ ${basename(ZIEL)} — traegt die Trennung?\n`);
if (!paare.length) { console.log("  — keine siegel-inhalt.js gefunden"); process.exit(0); }

async function lauf() {
  let chromium;
  try { ({ chromium } = await import("playwright-core")); }
  catch { console.log("⊘ nicht lauffaehig: playwright-core fehlt — UNGEPRUEFT, nicht gruen."); process.exit(0); }
  if (!existsSync(chrom())) { console.log("⊘ nicht lauffaehig: kein Chromium — UNGEPRUEFT, nicht gruen."); process.exit(0); }

  const basis = mkdtempSync(join(tmpdir(), "wiztrenn-"));
  const PORT = 8760 + (process.pid % 30);
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: basis, stdio: "ignore" });
  const browser = await chromium.launch({ executablePath: chrom() });
  try {
    for (const p of paare) {
      const name = relative(ZIEL, p.konfig).replace(/\\/g, "/");
      console.log(`  ── ${name}`);
      ok(`die Kanon-Datei liegt daneben (${relative(ZIEL, p.wizard)})`, existsSync(p.wizard));
      if (!existsSync(p.wizard)) continue;
      ok("… und ist byte-gleich mit dem Kanon", readFileSync(p.wizard, "utf8") === KANON);
      const konf = readFileSync(p.konfig, "utf8");
      ok("die Konfiguration setzt window.SBKIM_SIEGEL_WIZ", konf.includes("window.SBKIM_SIEGEL_WIZ"));
      ok("… und traegt keinen Wizard-Code mehr", !konf.includes("buildWizardDialog"));

      const kurz = name.replace(/[^\w]/g, "_");
      copyFileSync(p.konfig, join(basis, kurz + "-konf.js"));
      copyFileSync(p.wizard, join(basis, kurz + "-wiz.js"));
      const ZU = "</" + "script>";
      writeFileSync(join(basis, kurz + ".html"),
        '<!doctype html><html lang="de"><head><meta charset="utf-8"></head><body>'
        + '<div id="sbkim-siegel-modal"><div role="dialog"></div></div>'
        + '<script src="' + kurz + '-konf.js">' + ZU
        + '<script src="' + kurz + '-wiz.js">' + ZU
        + "</body></html>");

      for (let i = 0; i < 160; i++) {
        try { const a = await fetch(`http://127.0.0.1:${PORT}/${kurz}.html`); if (a.ok) break; } catch { /* noch nicht oben */ }
        await new Promise((r) => setTimeout(r, 50));
      }
      const s = await browser.newPage();
      const fehler = [];
      s.on("pageerror", (e) => fehler.push(String(e).slice(0, 120)));
      await s.goto(`http://127.0.0.1:${PORT}/${kurz}.html`, { waitUntil: "load" });
      await s.waitForFunction(() => !!document.querySelector("#sbkim-si-open, #sbkim-si-ohne-konfig"), { timeout: 8000 })
        .catch(() => { /* das Ergebnis wird gemessen, nicht die Frist */ });
      const r = await s.evaluate(() => {
        const dlg = document.getElementById("sbkim-si-wizard");
        const feld = document.getElementById("sbkim-si-semantik-text");
        return {
          knopf: !!document.getElementById("sbkim-si-open"),
          ohne: !!document.getElementById("sbkim-si-ohne-konfig"),
          schritte: dlg ? [1, 2, 3, 4].filter((n) => dlg.querySelector("#sbwiz-s" + n)).length : 0,
          wechsler: !!(dlg && dlg.querySelector("#sbwiz-idsel")),
          name: (window.SBKIM_SIEGEL_WIZ || {}).nodeName || null,
          beschreibung: feld ? feld.value.length : 0,
          stichworte: ((window.SBKIM_SIEGEL_WIZ || {}).domainKeywords || []).length,
        };
      });
      await s.close();
      ok(`der Knopf steht da (Knoten „${r.name}")`, r.knopf === true && r.ohne === false);
      ok("der Wizard hat alle vier Knopf-Bausteine + den Wechsler", r.schritte === 4 && r.wechsler);
      ok(`das Feld traegt die Beschreibung DIESER App (${r.beschreibung} Zeichen, ${r.stichworte} Stichworte)`,
        r.beschreibung > 60 && r.stichworte > 0);
      ok(`kein Skript-Fehler${fehler.length ? " — " + fehler[0] : ""}`, fehler.length === 0);
    }
  } finally { await browser.close(); server.kill(); rmSync(basis, { recursive: true, force: true }); }
}

lauf().then(() => {
  const gruen = ergebnisse.filter(Boolean).length, rot = ergebnisse.length - gruen;
  console.log(`\n  ═══ ${gruen} gruen · ${rot} ROT ═══\n`);
  process.exit(rot ? 1 : 0);
}).catch((e) => { console.error("✗ abgestuerzt:", e); process.exit(1); });
