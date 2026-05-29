/* Smoke-Test — Observatoriums-Vorteilspack-Truhe (Tool-Datenbank + Symbole).
 *
 * Headless: prüft die statische Tool-Datenbank von
 * docs/observatorium/vorteilspack.js ohne Browser-DOM. Bestätigt
 * Modul-Logik (19 Tools, Tier-Verteilung, Symbol-Vollständigkeit,
 * existierende Code-/Karten-/Smoke-Pfade, Vibe-Prompt-Aufbau).
 * Klaus' Browser-Sichttest bleibt Pflicht (Animation + Optik).
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

const EXPECTED_IDS = ["00","01","02","03","04","05","06","07","08","09","10","11","12","14","15","16","17","18","19"];
const VALID_TIERS = ["must","basic","pro"];
const VALID_STATUS = ["fertig","stub","schablone"];

console.log("Smoke: Observatoriums-Vorteilspack-Truhe");

const TOOLS = vp.TOOLS, SYM = vp.SYM;

ok("19 Tools in der Datenbank", TOOLS.length === 19, "ist " + TOOLS.length);

const ids = TOOLS.map(t => t.id);
ok("alle erwarteten Modul-IDs vorhanden (00–19 ohne 13)",
  EXPECTED_IDS.every(id => ids.includes(id)) && ids.length === EXPECTED_IDS.length,
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
ok("jedes Tool hat gültigen Tier (must/basic/pro)", tierOk);
ok("jedes Tool hat gültigen Status (fertig/stub/schablone)", statusOk);
ok("jedes Tool hat ein Werkzeug-Symbol (SYM)", symOk);
ok("Tasks sind knapp (≤ 80 Zeichen)", taskOk);

// Tier-Verteilung (Brief § 4)
const byTier = { must:0, basic:0, pro:0 };
TOOLS.forEach(t => byTier[t.tier]++);
ok("Tier-Verteilung 3 Must-have / 7 Basic / 9 Pro",
  byTier.must === 3 && byTier.basic === 7 && byTier.pro === 9,
  JSON.stringify(byTier));

// Symbol-Dateien auf Platte
let svgFilesOk = true;
for (const id of EXPECTED_IDS) {
  const name = TOOLS.find(t => t.id === id).karte.split("/").pop().replace(".md", ".svg");
  if (!existsSync(join(ROOT, "assets/tool-symbols", name))) { svgFilesOk = false; }
}
ok("19 Symbol-SVG-Dateien in assets/tool-symbols/", svgFilesOk);

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
ok("alle hinterlegten Modul-Code-Pfade existieren", codeOk);
ok("alle Modul-Karten-Pfade existieren", karteOk);
ok("alle hinterlegten Smoke-Test-Pfade existieren", smokeOk);

// Tools mit Code = 13 (00,01,02,03,04,05,06,07,08,15,16,17,18)
const withCode = TOOLS.filter(t => t.code).length;
ok("13 Tools mit kopierbarem Modul-Code", withCode === 13, "ist " + withCode);

// Vibe-Prompt-Aufbau
const m04 = TOOLS.find(t => t.id === "04");
const vibe04 = vp.buildVibe(m04);
ok("Vibe-Prompt (04) nennt Modul-ID + Quelle + Tabus",
  vibe04.includes("Modul 04") && vibe04.includes("Quelle:") && vibe04.includes("Tabus:"));
const m19 = TOOLS.find(t => t.id === "19");
ok("Vibe-Prompt (19, ohne Code) verweist auf die Karte",
  vp.buildVibe(m19).includes("Karte"));

// Einbau-Schritte
ok("Einbau-Schritte (04) sind eine nicht-leere Liste",
  Array.isArray(vp.buildEinbau(m04)) && vp.buildEinbau(m04).length >= 3);

console.log("\nErgebnis: " + pass + "/" + (pass + fail) + " grün");
if (fail > 0) process.exit(1);
