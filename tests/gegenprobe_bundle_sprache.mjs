/*
 * Gegenprobe zu den vier Sprach-Wächtern in `smoke_bundle_connect.mjs`
 * (Klaus 2026-09-14: „prüfen ob Aktualisierungen in der Geschenkbox … nötig sind").
 *
 * WARUM ES SIE GIBT. Die Kiste verspricht einem Fremden GENAU EIN init(). Bis
 * zum 2026-09-14 hat dieses init() das Feld `lang` STILL verschluckt — kein
 * Fehler, keine Warnung, nur ein deutsches Fenster. Gefunden wurde das nicht
 * von einer Probe, sondern beim Nachsehen, weil Klaus ausdrücklich nach der
 * Geschenkbox gefragt hat. Ein Wächter dagegen ist ohne Gegenprobe nur ein
 * grüner Haken über demselben Loch.
 *
 * ⚠ JEDER FALL LÄUFT AN EINER WEGWERF-KOPIE (mktemp -d). Die Nachbar-Gegenprobe
 * `gegenprobe_bauvorlagen.mjs` sabotiert den echten Baum und stellt im finally
 * zurück; bricht so ein Lauf ab, bleibt die Sabotage liegen und die nächste
 * Prüfung meldet rote Proben, die niemandem gehören. Hier kann das nicht
 * passieren.
 *
 * Lauf: node tests/gegenprobe_bundle_sprache.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = "sbkim-bundle/sbkim-connect.js";

/* Läuft die Probe in einem Baum durch? Der Rückgabewert kommt aus ihr selbst,
 * nicht aus einer Pipe — und die rote ZEILE wird mitgegeben, damit ein Fall,
 * der an einer FREMDEN Zusicherung umfällt, nicht wie ein Treffer aussieht. */
function lauf(baum) {
  try {
    execFileSync(process.execPath, [join(baum, "tests/smoke_bundle_connect.mjs")],
      { cwd: baum, stdio: "pipe" });
    return { gruen: true, rot: [] };
  } catch (e) {
    const text = String((e.stdout || "") + (e.stderr || ""));
    return { gruen: false, rot: text.split("\n").filter((z) => z.trim().startsWith("✗")) };
  }
}

function frisch() {
  const d = mkdtempSync(join(tmpdir(), "sbkim-gp-"));
  for (const teil of ["src", "sbkim-bundle", "sbkim-bundle-voll", "tests"]) {
    cpSync(join(WURZEL, teil), join(d, teil), { recursive: true });
  }
  return d;
}

const FAELLE = [
  {
    was: "die Kiste verschluckt lang wieder still (der Zustand vor dem 2026-09-14)",
    trifft: /UI lang durchgereicht/,
    bauen: (s) => s.replace(/if \(cfg\.lang === "de" \|\| cfg\.lang === "en"\) uiCfg\.lang = cfg\.lang;/,
      "/* verschluckt */"),
  },
  {
    was: "die Kiste erfindet einen Standard und überstimmt damit <html lang>",
    trifft: /OHNE Angabe/,
    bauen: (s) => s.replace(/if \(cfg\.lang === "de" \|\| cfg\.lang === "en"\) uiCfg\.lang = cfg\.lang;/,
      'uiCfg.lang = (cfg.lang === "de" || cfg.lang === "en") ? cfg.lang : "de";'),
  },
  {
    was: "nur Englisch kommt durch, Deutsch nicht (halb durchgereicht)",
    trifft: /lang durchgereicht: de/,
    bauen: (s) => s.replace(/if \(cfg\.lang === "de" \|\| cfg\.lang === "en"\) uiCfg\.lang = cfg\.lang;/,
      'if (cfg.lang === "en") uiCfg.lang = cfg.lang;'),
  },
  {
    was: "ein unbekannter Wert wird durchgereicht statt weggelassen",
    trifft: /unbekannte Sprache/,
    bauen: (s) => s.replace(/if \(cfg\.lang === "de" \|\| cfg\.lang === "en"\) uiCfg\.lang = cfg\.lang;/,
      "if (cfg.lang) uiCfg.lang = cfg.lang;"),
  },
];

console.log("\n=== Gegenprobe · Sprache in der Geschenkbox ===\n");
let blind = 0, falsch = 0;

const a = frisch();
try {
  if (!lauf(a).gruen) {
    console.error("✗ Die Probe ist schon ohne Eingriff rot. Erst das in Ordnung bringen.");
    process.exit(1);
  }
  console.log("  Ausgangslage: Probe grün.\n");
} finally { rmSync(a, { recursive: true, force: true }); }

for (const f of FAELLE) {
  const d = frisch();
  try {
    const p = join(d, ZIEL);
    const vorher = readFileSync(p, "utf-8");
    const nachher = f.bauen(vorher);
    if (nachher === vorher) {
      blind++;
      console.log(`  ✗ ANKER NICHT GEFUNDEN — die Sabotage hat nichts geändert: ${f.was}`);
      continue;
    }
    writeFileSync(p, nachher, "utf-8");
    const r = lauf(d);
    if (r.gruen) { blind++; console.log(`  ✗ BLIND — nicht bemerkt: ${f.was}`); }
    else if (!r.rot.some((z) => f.trifft.test(z))) {
      falsch++;
      console.log(`  ✗ AUS DEM FALSCHEN GRUND rot: ${f.was}`);
      console.log(`      rote Zeilen: ${r.rot.join(" | ").slice(0, 120)}`);
    } else console.log(`  ✓ bemerkt: ${f.was}`);
  } finally { rmSync(d, { recursive: true, force: true }); }
}

console.log(`\n${FAELLE.length - blind - falsch} gefangen · ${blind} durchgerutscht · ` +
  `${falsch} aus dem falschen Grund\n`);
process.exit(blind + falsch ? 1 : 0);
