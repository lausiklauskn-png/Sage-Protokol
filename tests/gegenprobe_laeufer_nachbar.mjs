/*
 * Gegenprobe zu `smoke_laeufer_nachbar.mjs`.
 *
 * Jeder Fall baut GENAU EINEN Fehler ein — in einer Wegwerf-Kopie von
 * `tests/`, nie im echten Baum — und die Probe MUSS rot werden, mit der
 * Zeile, die der Fall nennt (`trifft`). Ein toter Anker wird als solcher
 * gemeldet, nicht als „nicht gefangen".
 *
 * ⚠ DIE KOPIE BRAUCHT `node_modules`. `vorrat_wirkung.mjs` importiert
 * `playwright-core` vor der Nachbar-Prüfung; ohne den Verweis wäre jeder
 * Fall „Paket fehlt" und mässe das Falsche. Verwiesen, nicht kopiert —
 * nur gelesen, nie beschrieben.
 *
 * Lauf: node tests/gegenprobe_laeufer_nachbar.mjs
 *       NUR_ANKER=1 node tests/gegenprobe_laeufer_nachbar.mjs   (nur die Anker)
 */
import { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync, symlinkSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROBE = "tests/smoke_laeufer_nachbar.mjs";
const VORRAT = "tests/vorrat_wirkung.mjs";
const LAEUFER = "tests/run_alle.mjs";

const FAELLE = [
  { was: "die Probe prüft die Nachbarn nicht vorab (wirft unterwegs)",
    datei: VORRAT, alt: "  if (fehlen.length) {", neu: "  if (false) {",
    trifft: /✗ ROT: ohne Nachbarn endet vorrat_wirkung mit 3/ },
  { was: "die Probe nennt alle Nachbarn statt der fehlenden",
    datei: VORRAT, alt: "  return NACHBARN.filter((r) =>", neu: "  return NACHBARN.filter((r) => true ||",
    trifft: /✗ ROT: mit nur einem Nachbarn nennt sie GENAU den fehlenden/ },
  { was: "der Läufer sammelt vorrat_wirkung nicht ein",
    datei: LAEUFER, alt: 'const EINZELN = ["vorrat_wirkung.mjs"];', neu: "const EINZELN = [];",
    trifft: /✗ ROT: der Läufer sammelt vorrat_wirkung ein/ },
  { was: "der Läufer kennt den Nachbar-Ausgang nicht (meldet ROT)",
    datei: LAEUFER, alt: "        if (nachbar) return", neu: "        if (false) return",
    trifft: /✗ ROT: … und zählt sie ohne Nachbarn als NICHT LAUFFÄHIG/ },
  { was: "der Läufer fragt den Rückgabewert nicht",
    datei: LAEUFER, alt: "  if (code !== 3) return null;", neu: "  if (false) return null;",
    trifft: /✗ ROT: die Zeile mit Code 1 → ROT/ },
  { was: "der Läufer sucht die Zeile irgendwo statt am Zeilenanfang",
    datei: LAEUFER, alt: "/^⊘ NACHBAR FEHLT: (.+?) —/m", neu: "/⊘ NACHBAR FEHLT: (.+?) —/m",
    trifft: /✗ ROT: die Zeile NICHT am Zeilenanfang/ },
];

let gefangen = 0, blind = 0, falsch = 0, tot = 0;

for (const f of FAELLE) {
  const quelle = readFileSync(join(WURZEL, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log(`  ⚰ TOTER ANKER (${n}×): ${f.was}`); continue; }
  if (process.env.NUR_ANKER) { console.log(`  · Anker lebt: ${f.was}`); continue; }

  const kopie = mkdtempSync(join(tmpdir(), "nachbar-gp-"));
  try {
    cpSync(join(WURZEL, "tests"), join(kopie, "tests"), { recursive: true });
    if (existsSync(join(WURZEL, "node_modules")))
      symlinkSync(join(WURZEL, "node_modules"), join(kopie, "node_modules"));
    writeFileSync(join(kopie, f.datei), quelle.split(f.alt).join(f.neu));
    let aus = "", code = 0;
    try { aus = execFileSync("node", [join(kopie, PROBE)], { encoding: "utf8" }); }
    catch (e) { aus = String(e.stdout || "") + String(e.stderr || ""); code = e.status ?? 1; }
    const erste = aus.split("\n").find((z) => /✗ ROT/.test(z)) || "";
    if (code === 0) { blind++; console.log(`  ✗ NICHT GEFANGEN: ${f.was}`); }
    /* Die ERSTE rote Zeile muss die gemeinte sein — fällt vorher eine
       fremde Zusicherung, misst der Fall den Nachbarn. */
    else if (!f.trifft.test(erste)) {
      falsch++;
      console.log(`  ✗ ROT AUS FALSCHEM GRUND: ${f.was}\n      ${erste.trim() || aus.trim().split("\n").pop()}`);
    } else {
      gefangen++;
      console.log(`  ✓ gefangen: ${f.was}\n      ${erste.trim()}`);
    }
  } finally { rmSync(kopie, { recursive: true, force: true }); }
}

console.log(`\n═══ ${gefangen} gefangen · ${blind} durchgerutscht · ${falsch} aus falschem Grund · ${tot} tote Anker ═══\n`);
process.exit(blind || falsch || tot ? 1 : 0);
