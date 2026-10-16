// Gegenprobe S5b Teil 2 „Die Empfehlung kommt von selbst an" — jeder Riegel
// in einer WEGWERF-KOPIE einzeln weggenommen; die Probe muss rot werden, die
// erste rote Zeile mit dem Namen der Zusicherung. Der echte Baum bleibt unberührt.
import { readFileSync, writeFileSync, mkdtempSync, cpSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const M23 = "src/modules/23_rendezvous.js";
const FAELLE = [
  { name: "Empfehlung kommt nicht in den Ausgestellt-Vorrat",
    alt: "if (x && x.ok) { try { await issuedMerken(x.zettel); }", neu: "if (false) { try { await issuedMerken(x.zettel); }", rot: "E1" },
  { name: "Karte trägt `issued` nicht",
    alt: "    if (aus.length) card.issued = aus;\n", neu: "", rot: "E2" },
  { name: "discover liest `issued` nicht",
    alt: "            if (Array.isArray(card.issued)) vouchZettel = vouchZettel.concat(card.issued.slice(0, RDV_ISSUED_PER_CARD_MAX));   // S5b Teil 2\n", neu: "", rot: "E3" },
  { name: "Empfänger holt nicht ab",
    alt: "try { abgeholt = await empfehlungenAbholen(ownId, cards, vouchZettel); }", neu: "try { abgeholt = 0; }", rot: "E3" },
  { name: "doppelt abgeholt",
    alt: "      if (o.carried.some(function (x) { return x.sig === z.sig; })) continue;\n", neu: "", rot: "E4" },
  { name: "Unbekannte Aussteller zählen",
    alt: "      if (!zaehlt) continue;\n", neu: "", rot: "E6" },
  { name: "Widerruf lässt die Empfehlung auf der Karte",
    alt: "if (x && x.ok) { try { issuedEntfernen(subjectId); }", neu: "if (false) { try { issuedEntfernen(subjectId); }", rot: "E8" },
  { name: "Karte ohne Höchstzahl",
    alt: ".sort(function (a, b) { return b.ts - a.ts; }).slice(0, RDV_ISSUED_PER_CARD_MAX);", neu: ".sort(function (a, b) { return b.ts - a.ts; });", rot: "E9" },
  { name: "Vorrat auch ohne dbSuffix",
    alt: "    var o = buergenLesen();\n    if (!buergenSchluessel()) return;\n    var jetzt = nowSec();", neu: "    var o = buergenLesen();\n    var jetzt = nowSec(); ausOhne.push(z);", rot: "E10" },
  { name: "Unterschrift beim Abholen nicht geprüft",
    alt: "      if ((await vouchPruefen(z, jetzt)) !== \"gueltig\") continue;\n", neu: "", rot: "E11" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
const quelle = readFileSync(join(root, M23), "utf8");
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gps5be-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  let neu = quelle.replace(f.alt, f.neu);
  if (f.neu.includes("ausOhne")) neu = neu.replace("var empfehlungenAbgeholt = 0;   // _meta", "var empfehlungenAbgeholt = 0; var ausOhne = [];   // _meta").replace("return buergenLesen().issued.filter(", "return (buergenSchluessel() ? buergenLesen().issued : ausOhne).filter(");
  writeFileSync(join(kopie, M23), neu);
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_s5b_empfehlung_ankommt.mjs")], { encoding: "utf8", timeout: 240000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot + " ")) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n").slice(0, 3).join(" | "))); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
