/*
 * Gegenprobe zu `smoke_bau03_rueckfall.mjs` (Modul 03, Rückfall auf
 * HuggingFace, Klaus 2026-10-15). Bauart wie `gegenprobe_bau25_pseudonym.mjs`:
 * je Fall genau EIN Fehler, gefangen nur mit der roten Zeile seiner
 * Zusicherung (`trifft`), in einer Wegwerf-Kopie.
 *
 * Lauf: node tests/gegenprobe_bau03_rueckfall.mjs   ·   NUR_ANKER=1 prüft nur die Anker.
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODUL = "src/modules/03_embedding.js";
const PROBE = "tests/smoke_bau03_rueckfall.mjs";

const FAELLE = [
  { was: "kein Rückfall", trifft: "init() gelingt trotz scheiterndem Server-Modell",
    alt: 'if (modelSource !== "local") throw err;', neu: "throw err;" },
  { was: "Zwischenspeicher wird nicht geleert", trifft: "zwei Zwischenspeicher-Einträge entfernt",
    alt: "var dropped = await dropCachedModel(from);", neu: "var dropped = 0;" },
  { was: "lokaler Pfad zeigt im Haupt-Faden weiter auf den Server", trifft: "zweiter Versuch: localModelPath",
    alt: "      env.localModelPath = LOCAL_MODEL_ROOT;\n", neu: "" },
  { was: "Rückfall auch, wenn schon HuggingFace scheiterte", trifft: "nur ein Versuch, kein Rückfall",
    alt: 'if (modelSource !== "local") throw err;', neu: "if (false) throw err;" },
  { was: "Lader werden nicht zurückgesetzt", trifft: "init() gelingt trotz scheiterndem Server-Modell",
    alt: "        resetLoaders();\n        await loadModel();", neu: "        await loadModel();" },
  { was: "ganzer Speicher statt nur der Wurzel", trifft: "HuggingFace und fremdes Modell bleiben",
    alt: "if (u.indexOf(base) === 0 && (await cache.delete(keys[i]))) n++;", neu: "if (await cache.delete(keys[i])) n++;" },
  { was: "Worker bekommt keine Standard-Wurzel", trifft: "Worker bekommt die Standard-Wurzel mit",
    alt: "      defaultRoot: LOCAL_MODEL_ROOT,\n", neu: "" },
  { was: "Selbstauskunft verschweigt den Rückfall", trifft: "Selbstauskunft nennt den Rückfall",
    alt: '(modelFallback ? " — Rückfall, " + modelFallback.from + " scheiterte" : "")', neu: '""' },
  { was: "Worker-Quelltext setzt den Pfad nicht zurück", trifft: "Worker: localModelPath",
    alt: "env.localModelPath=cfg.defaultRoot;", neu: "" },
];

const kopie = mkdtempSync(join(tmpdir(), "sage-bau03r-"));
let gefangen = 0, blind = 0, falsch = 0, tot = 0;
try {
  for (const p of [MODUL, PROBE]) { mkdirSync(join(kopie, dirname(p)), { recursive: true }); cpSync(join(WURZEL, p), join(kopie, p)); }
  const basis = readFileSync(join(kopie, MODUL), "utf8");
  const lauf = () => {
    try { execFileSync(process.execPath, [join(kopie, PROBE)], { stdio: "pipe" }); return { rot: false, aus: "" }; }
    catch (e) { return { rot: true, aus: String(e.stdout || "") + String(e.stderr || "") }; }
  };
  const nurAnker = !!process.env.NUR_ANKER;
  if (!nurAnker && lauf().rot) { console.log("⚠ ABBRUCH: die unversehrte Kopie ist schon ROT."); process.exit(2); }
  console.log("\nGEGENPROBE — Modul 03, Rückfall auf HuggingFace\n");
  for (const f of FAELLE) {
    const n = basis.split(f.alt).length - 1;
    if (n !== 1) { console.log("  ⚠ TOTER ANKER (" + n + "×): " + f.was); tot++; continue; }
    if (nurAnker) { console.log("  ✓ Anker lebt: " + f.was); continue; }
    writeFileSync(join(kopie, MODUL), basis.replace(f.alt, () => f.neu), "utf8");
    const r = lauf();
    writeFileSync(join(kopie, MODUL), basis, "utf8");
    const rote = r.aus.split("\n").filter((l) => l.includes("✗ ROT"));
    if (!r.rot) { console.log("  ✗ NICHT GEFANGEN: " + f.was); blind++; }
    else if (rote.some((l) => l.includes(f.trifft))) { console.log("  ✓ gefangen: " + f.was + "  ← " + rote.length + " rote Zeile(n)"); gefangen++; }
    else { console.log("  ✗ ROT AUS FALSCHEM GRUND: " + f.was + "\n      " + (rote[0] || r.aus.split("\n").slice(0, 3).join(" | "))); falsch++; }
  }
} finally { rmSync(kopie, { recursive: true, force: true }); }
console.log(`\n— ${gefangen} gefangen · ${blind} blind · ${falsch} aus falschem Grund · ${tot} tote Anker —\n`);
process.exit(blind + falsch + tot > 0 ? 1 : 0);
