// Gegenprobe S2 „Vektor gegen Text nachrechnen" — jeder Riegel wird in einer WEGWERF-KOPIE
// einzeln weggenommen; tests/smoke_s2_bedeutung.mjs muss dann rot werden,
// und die erste rote Zeile muss den Namen der Zusicherung tragen.
// NUR_ANKER=1 → nur prüfen, ob jeder Anker genau einmal trifft (Sekunden).
// NUR_FALL="…" → nur Fälle, deren Name das enthält.
import { readFileSync, writeFileSync, mkdtempSync, cpSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const M23 = "src/modules/23_rendezvous.js";
const FAELLE = [
  { name: "Schwelle zu mild (0.98 statt 0.99)", datei: M23,
    alt: "var RDV_MEANING_MIN = 0.99;", neu: "var RDV_MEANING_MIN = 0.98;", rot: "M11" },
  { name: "Inhalts-Vektor gilt als geprüft", datei: M23,
    alt: "if (src === \"content\") return out(\"nicht-nachpruefbar\"", neu: "if (src === \"content\") return out(\"passt\"", rot: "M5" },
  { name: "zweite Text-Fassung (Beschreibung + Stichworte) fehlt", datei: M23,
    alt: "if (kw) fassungen.push(desc + \". \" + kw);", neu: "", rot: "M3" },
  { name: "dritte Text-Fassung (embed_helper) fehlt", datei: M23,
    alt: "if (kw) fassungen.push(desc + \" \" + kw);", neu: "", rot: "M3b" },
  { name: "Prüfung lädt das Modell selbst (isReady übergangen)", datei: M23,
    alt: "if (!ready) return out(\"nicht-geprueft\", null, null, \"Sprachmodell nicht geladen\");", neu: "", rot: "M7" },
  { name: "falscher Satz-Schnipsel bleibt folgenlos", datei: M23,
    alt: "if (snippets === \"passen-nicht\") return out(\"passt-nicht\"", neu: "if (false) return out(\"passt-nicht\"", rot: "M9" },
  { name: "gekürzte Schnipsel werden mitgeprüft", datei: M23,
    alt: " && !/…$/.test(x.text.trim())", neu: "", rot: "M10" },
  { name: "fehlende Herkunft zählt als passt nicht", datei: M23,
    alt: "if (src === \"description\") {", neu: "if (true) {", rot: "M6" },
  { name: "anderes Modell wird durchgewinkt", datei: M23,
    alt: " && spore.embeddingModel !== RDV_MEANING_MODEL) {", neu: " && false) {", rot: "M12" },
  { name: "„passt nicht“ behält den Verwandtschafts-Vorrang", datei: M23,
    alt: "copy.isRelated = meaningFails(c) ? false : isRel;", neu: "copy.isRelated = isRel;", rot: "R3" },
  { name: "Frage-Rangfolge ignoriert „passt nicht“", datei: M23,
    alt: "if (ma !== mb) return ma ? 1 : -1;", neu: "", rot: "R4" },
  { name: "die Karte zeigt die Bedeutung nicht", datei: "src/modules/23_rendezvous_ui.js",
    alt: "        info.appendChild(mBadge);\n", neu: "", rot: "B1" },
  { name: "englische Fassung fehlt", datei: "src/modules/23_rendezvous_ui.js",
    alt: "        \"⚠ Meaning does not match the description — no priority\",\n", neu: "        \"⚠ Bedeutung passt nicht zur Beschreibung — kein Vorrang\",\n", rot: "B2" },
  { name: "der Raum rechnet nicht nach", datei: M23,
    alt: "try { cards[mi].meaning = await checkMeaning(cards[mi].spore); }", neu: "try { }", rot: "R1" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gps2-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_s2_bedeutung.mjs")], { encoding: "utf8", timeout: 180000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot)) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
