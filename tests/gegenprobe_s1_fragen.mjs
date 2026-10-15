// Gegenprobe S1 „Fragen unterschreiben" — jeder Riegel wird in einer WEGWERF-KOPIE
// einzeln weggenommen; tests/smoke_s1_fragen_signiert.mjs muss dann rot werden,
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
  { name: "Frager unterschreibt die Frage nicht", datei: M23,
    alt: "zettelSignieren({                       // S1: die Frage trägt spore + sig", neu: "Promise.resolve({", rot: "E1" },
  { name: "Antworter prüft die Frage nicht", datei: M23,
    alt: "var stand = await zettelPruefen(q, null);", neu: "var stand = \"bestaetigt\";", rot: "F1" },
  { name: "Fälschung sperrt die qid der echten Frage", datei: M23,
    alt: "forgetQid(q.qid);                   // eine Fälschung sperrt die echte qid nicht", neu: "", rot: "F5" },
  { name: "unsignierte Fragen ohne eigene Grenze", datei: M23,
    alt: "return answerTimestamps.filter(function (e) { return e.u; }).length < RDV_QUERY_UNSIGNED_MAX_PER_MIN;", neu: "return true;", rot: "G3" },
  { name: "unsignierte Frage zählt als bestätigt", datei: M23,
    alt: "var unsigniert = stand !== \"bestaetigt\";", neu: "var unsigniert = false;", rot: "G2" },
  { name: "unsignierte Fragen werden gar nicht mehr beantwortet", datei: M23,
    alt: "if (stand === \"falsch\") {\n              frageVerworfen++;", neu: "if (stand !== \"bestaetigt\") {\n              frageVerworfen++;", rot: "G2" },
  { name: "Unsigniert-Grenze sperrt auch unterschriebene Fragen", datei: M23,
    alt: "if (!unsigniert) return true;", neu: "", rot: "G4" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gps1-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_s1_fragen_signiert.mjs")], { encoding: "utf8", timeout: 180000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot)) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
