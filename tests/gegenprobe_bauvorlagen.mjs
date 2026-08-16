/*
 * Gegenprobe zu `smoke_bauvorlagen.mjs`.
 *
 * Baut genau die Fehler ein, die am 2026-08-16 WIRKLICH in den Bündeln lagen —
 * jeder MUSS die Probe umwerfen. Sie lagen dort monatelang, ohne dass etwas
 * anschlug: es gab keine Prüfung. Ein Wächter, der diese Fälle nicht fängt,
 * wäre nur ein grüner Haken über demselben Loch.
 *
 * Lauf: node tests/gegenprobe_bauvorlagen.mjs
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync, renameSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = (p) => join(WURZEL, p);

function probeLaeuftDurch() {
  try {
    execFileSync(process.execPath, [P("tests/smoke_bauvorlagen.mjs")], { cwd: WURZEL, stdio: "pipe" });
    return true;
  } catch { return false; }
}

const FAELLE = [
  {
    // DER Fall vom 2026-08-16: 07 fehlte, und das Siegel blieb stumm aus.
    was: "sbkim-bundle-voll fehlt Modul 07 (Siegel-Pflicht — stummer Ausfall)",
    datei: "sbkim-bundle-voll/modules/07_apoptose.js",
    bauen: (p) => renameSync(p, p + ".weg"),
    zurueck: (p) => { if (existsSync(p + ".weg")) renameSync(p + ".weg", p); },
  },
  {
    was: "sbkim-bundle-voll fehlt Modul 15 (Siegel-Pflicht)",
    datei: "sbkim-bundle-voll/modules/15_membran.js",
    bauen: (p) => renameSync(p, p + ".weg"),
    zurueck: (p) => { if (existsSync(p + ".weg")) renameSync(p + ".weg", p); },
  },
  {
    // Die andere Richtung, und sie ist genauso wichtig: die kleine Kiste darf
    // nicht heimlich zur grossen anwachsen. Am 2026-08-16 hat eine Sitzung ihr
    // 07/15/16/17 hinzugefuegt — gut gemeint, aber damit war die Minimal-Kiste
    // weg, die Klaus bewusst angelegt hat.
    was: "Stufe 1 waechst heimlich zur Stufe 2 an",
    datei: "sbkim-bundle/modules/16_siegel.js",
    bauen: (p) => writeFileSync(p, "// hier hat es jemand gut gemeint\n", "utf-8"),
    zurueck: (p) => { if (existsSync(p)) unlinkSync(p); },
  },
  {
    was: "sbkim-bundle-voll fehlt Modul 05b (kein Raum)",
    datei: "sbkim-bundle-voll/modules/05b_nostr_relay.js",
    bauen: (p) => renameSync(p, p + ".weg"),
    zurueck: (p) => { if (existsSync(p + ".weg")) renameSync(p + ".weg", p); },
  },
  {
    was: "eine Kopie hängt eine Generation zurück",
    datei: "sbkim-bundle-voll/modules/23_rendezvous_ui.js",
    bauen: (p) => { writeFileSync(p + ".weg", readFileSync(p)); writeFileSync(p, readFileSync(p, "utf-8") + "\n// alte Fassung\n", "utf-8"); },
    zurueck: (p) => { if (existsSync(p + ".weg")) { writeFileSync(p, readFileSync(p + ".weg")); unlinkSync(p + ".weg"); } },
  },
  {
    was: "die Regel-Datei ist weg",
    datei: "docs/PFLICHT_MODULE.md",
    bauen: (p) => renameSync(p, p + ".weg"),
    zurueck: (p) => { if (existsSync(p + ".weg")) renameSync(p + ".weg", p); },
  },
  {
    was: "die Regel erklärt die Schubladen-Falle nicht mehr",
    datei: "docs/PFLICHT_MODULE.md",
    bauen: (p) => { writeFileSync(p + ".weg", readFileSync(p)); writeFileSync(p, readFileSync(p, "utf-8").replace(/SBKIM_DB_SUFFIX/g, "xxx"), "utf-8"); },
    zurueck: (p) => { if (existsSync(p + ".weg")) { writeFileSync(p, readFileSync(p + ".weg")); unlinkSync(p + ".weg"); } },
  },
];

let blind = 0;
console.log("\n=== Gegenprobe · Bauvorlagen ===\n");

try {
  if (!probeLaeuftDurch()) {
    console.error("✗ Die Probe ist schon vor der Gegenprobe rot. Erst das in Ordnung bringen.");
    process.exit(1);
  }
  console.log("  Ausgangslage: Probe grün.\n");

  for (const f of FAELLE) {
    const p = P(f.datei);
    f.bauen(p);
    const bemerkt = !probeLaeuftDurch();
    if (bemerkt) console.log(`  ✓ bemerkt: ${f.was}`);
    else { blind++; console.log(`  ✗ BLIND — nicht bemerkt: ${f.was}`); }
    f.zurueck(p);
  }
} finally {
  for (const f of FAELLE) f.zurueck(P(f.datei));
}

console.log(`\n${FAELLE.length - blind} von ${FAELLE.length} Fehlern bemerkt.` +
  (blind ? `  ${blind} BLINDE STELLE(N).\n` : "  Kein blinder Fleck.\n"));
process.exit(blind ? 1 : 0);
