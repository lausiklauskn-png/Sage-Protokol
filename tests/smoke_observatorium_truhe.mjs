/* Smoke-Test — Observatoriums-Vorteilspack-Truhe (Tool-Datenbank + Symbole).
 *
 * Headless: prüft die statische Tool-Datenbank von
 * docs/observatorium/vorteilspack.js ohne Browser-DOM. Bestätigt
 * Modul-Logik (19 Modul-Tools + 2 Komplett-Werkzeuge, Tier-Verteilung,
 * Symbol-Vollständigkeit, existierende Code-/Karten-/Smoke-Pfade,
 * Vibe-Prompt-Aufbau). Klaus' Browser-Sichttest bleibt Pflicht.
 *
 * Lauf:  node tests/smoke_observatorium_truhe.mjs   (erwartet alle grün)
 */
import { createRequire } from "module";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const vp = require(join(ROOT, "docs/observatorium/vorteilspack.js"));

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra ? "  — " + extra : "")); }
}

// 19 Modul-IDs (00–19 ohne 13) + NETZ ist als Modul-ID-Liste gepflegt.
const MODULE_IDS = ["00","01","02","03","04","05","06","07","08","09","10","11","12","14","15","16","17","18","19","NETZ"];
// 2 Komplett-Werkzeuge (Ein-Datei-PWAs).
const TOOL_IDS = ["andock","knoten"];
// Featured-Tools (eigenständige Werkzeuge, nicht in der 00–19-Modul-Reihe).
const EXTRA_IDS = ["22"];
const VALID_TIERS = ["komplett","must","basic","pro"];
const VALID_STATUS = ["fertig","stub","schablone"];

console.log("Smoke: Observatoriums-Vorteilspack-Truhe");

const TOOLS = vp.TOOLS, SYM = vp.SYM;

ok("23 Tools in der Datenbank (20 Modul-Tools inkl. NETZ + 2 Komplett + 1 Featured)",
  TOOLS.length === 23, "ist " + TOOLS.length);

const ids = TOOLS.map(t => t.id);
ok("alle erwarteten IDs vorhanden (19 Module + 2 Komplett + 1 Featured)",
  MODULE_IDS.every(id => ids.includes(id)) &&
  TOOL_IDS.every(id => ids.includes(id)) &&
  EXTRA_IDS.every(id => ids.includes(id)) &&
  ids.length === MODULE_IDS.length + TOOL_IDS.length + EXTRA_IDS.length,
  ids.join(","));
ok("keine doppelten IDs", new Set(ids).size === ids.length);
ok("Modul 13 nicht enthalten (kein Modul)", !ids.includes("13"));

// Pflichtfelder + Validität
let fieldsOk = true, tierOk = true, statusOk = true, symOk = true, taskOk = true;
for (const t of TOOLS) {
  if (!t.id || !t.name || !t.task || !t.was || !t.wie || !t.karte) fieldsOk = false;
  if (!VALID_TIERS.includes(t.tier)) tierOk = false;
  if (!VALID_STATUS.includes(t.status)) statusOk = false;
  if (!SYM[t.id] || SYM[t.id].length < 10) symOk = false;
  if (t.task.length > 80) taskOk = false;
}
ok("jedes Tool hat Pflichtfelder (id/name/task/was/wie/karte)", fieldsOk);
ok("jedes Tool hat gültigen Tier (komplett/must/basic/pro)", tierOk);
ok("jedes Tool hat gültigen Status (fertig/stub/schablone)", statusOk);
ok("jedes Tool hat ein Werkzeug-Symbol (SYM)", symOk);
ok("Tasks sind knapp (≤ 80 Zeichen)", taskOk);

// Tier-Verteilung (2 Komplett / 3 Must-have / 7 Basic / 9 Pro)
const byTier = { komplett:0, must:0, basic:0, pro:0 };
TOOLS.forEach(t => byTier[t.tier]++);
ok("Tier-Verteilung 2 Komplett / 3 Must-have / 9 Basic / 9 Pro",
  byTier.komplett === 2 && byTier.must === 3 && byTier.basic === 9 && byTier.pro === 9,
  JSON.stringify(byTier));

// Komplett-Werkzeuge: kind:"html" + .html-Code
let htmlOk = true;
for (const id of TOOL_IDS) {
  const t = TOOLS.find(x => x.id === id);
  if (!t || t.kind !== "html" || !t.code || !t.code.endsWith(".html")) htmlOk = false;
}
ok("Komplett-Werkzeuge sind kind:'html' mit .html-Code", htmlOk);

// Symbol-Dateien auf Platte (nur Modul-Tools mit Modul-Karten-.md)
let svgFilesOk = true;
for (const id of MODULE_IDS) {
  const t = TOOLS.find(x => x.id === id);
  if (!t.karte.endsWith(".md") || !t.karte.includes("/components/")) continue; // NETZ etc.
  const name = t.karte.split("/").pop().replace(".md", ".svg");
  if (!existsSync(join(ROOT, "assets/tool-symbols", name))) { svgFilesOk = false; }
}
ok("Modul-Symbol-SVG-Dateien in assets/tool-symbols/", svgFilesOk);

// Truhe-Bild
ok("Truhe-Bild assets/observatorium-truhe.png liegt vor",
  existsSync(join(ROOT, "assets/observatorium-truhe.png")));

// Pfade existieren, wo angegeben
let codeOk = true, karteOk = true, smokeOk = true;
for (const t of TOOLS) {
  if (t.code && !existsSync(join(ROOT, t.code))) { codeOk = false; console.log("    fehlt code: " + t.code); }
  if (!existsSync(join(ROOT, t.karte))) { karteOk = false; console.log("    fehlt karte: " + t.karte); }
  if (t.smoke && !existsSync(join(ROOT, t.smoke))) { smokeOk = false; console.log("    fehlt smoke: " + t.smoke); }
}
ok("alle hinterlegten Code-Pfade existieren", codeOk);
ok("alle Karten-Pfade existieren", karteOk);
ok("alle hinterlegten Smoke-Test-Pfade existieren", smokeOk);

// Tools mit Code = 18 (14 Modul-Code inkl. 19 + 22 Such-Werkzeug + NETZ-Action + 2 Komplett)
const withCode = TOOLS.filter(t => t.code).length;
ok("18 Tools mit kopierbarem/herunterladbarem Code", withCode === 18, "ist " + withCode);

// Vibe-Prompt-Aufbau (Modul-Tool)
const m04 = TOOLS.find(t => t.id === "04");
const vibe04 = vp.buildVibe(m04);
ok("Vibe-Prompt (04) nennt Modul-ID + Quelle + Tabus",
  vibe04.includes("Modul 04") && vibe04.includes("Quelle:") && vibe04.includes("Tabus:"));
const m19 = TOOLS.find(t => t.id === "19");
ok("Vibe-Prompt (19, ohne Code) verweist auf die Karte",
  vp.buildVibe(m19).includes("Karte"));

// Vibe-Prompt + Einbau für Komplett-Werkzeug (html)
const tAndock = TOOLS.find(t => t.id === "andock");
const vibeA = vp.buildVibe(tAndock);
ok("Vibe-Prompt (Andock-Werkzeug) nennt Ein-Datei-PWA + Zielpfad + Tabus",
  vibeA.includes("Ein-Datei-PWA") && vibeA.includes("Zielpfad:") && vibeA.includes("Tabus:"));
const einbauA = vp.buildEinbau(tAndock);
ok("Einbau-Schritte (Andock-Werkzeug) nennen Herunterladen + 1:1 kopieren",
  Array.isArray(einbauA) && einbauA.join(" ").includes("herunterladen") && einbauA.join(" ").includes("1:1"));

// Einbau-Schritte (Modul)
ok("Einbau-Schritte (04) sind eine nicht-leere Liste",
  Array.isArray(vp.buildEinbau(m04)) && vp.buildEinbau(m04).length >= 3);

console.log("\nErgebnis: " + pass + "/" + (pass + fail) + " grün");
if (fail > 0) process.exit(1);
