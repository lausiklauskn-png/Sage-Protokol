// Gegenprobe S3 „Rechenaufwand je Zettel" — jeder Riegel wird in einer WEGWERF-KOPIE
// einzeln weggenommen; tests/smoke_s3_aufwand.mjs muss dann rot werden,
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
  { name: "Karte wird ohne Aufwand gesendet", datei: M23,
    alt: "await powRechnen(card);", neu: "", rot: "P1" },
  { name: "Frage wird ohne Aufwand gesendet", datei: M23,
    alt: "powRechnen(frage                        // S3", neu: "Promise.resolve(frage                        // S3", rot: "P2" },
  { name: "Aufwand nach dem Unterschreiben angehängt", datei: M23,
    alt: ").then(zettelSignieren                 // S1: die Frage trägt spore + sig\n      ).then(function (zettel) {",
    neu: ").then(function (z) { var p = z.pow; delete z.pow; return zettelSignieren(z).then(function (y) { y.pow = p; return y; }); }\n      ).then(function (zettel) {", rot: "P3" },
  { name: "Aufwand nicht an den Inhalt gebunden", datei: M23,
    alt: "return RDV_POW_PREFIX + powSha256(JSON.stringify(o)) + \"|\";", neu: "return RDV_POW_PREFIX + \"|\";", rot: "P1" },
  { name: "zu milde Schwelle", datei: M23,
    alt: "var RDV_POW_BITS = 12;", neu: "var RDV_POW_BITS = 6;", rot: "P1" },
  { name: "Karte mit Aufwand verdrängt nicht", datei: M23,
    alt: "              if (!mitAufwand) return;\n", neu: "              return;\n", rot: "K2" },
  { name: "Karte ohne Aufwand verdrängt auch", datei: M23,
    alt: "              if (!mitAufwand) return;\n", neu: "", rot: "K3" },
  { name: "Verdrängung trifft auch Karten mit Aufwand", datei: M23,
    alt: "if (byId[reihe[ri].id] && !byId[reihe[ri].id].pow) {", neu: "if (byId[reihe[ri].id]) {", rot: "K8" },
  { name: "Vorrang auch ohne Enge (Raum nicht voll)", datei: M23,
    alt: "var mitAufwand = powPruefen(card);      // S3", neu: "var mitAufwand = powPruefen(card); if (!mitAufwand) return;", rot: "K1" },
  { name: "Empfänger prüft die Null-Bits nicht", datei: M23,
    alt: "return powNullBits(powSha256(powBasis(z) + z.pow)) >= RDV_POW_BITS;", neu: "return true;", rot: "K6" },
  { name: "Grenze je Absender fällt für Aufwand-Karten", datei: M23,
    alt: "if (vonDiesem >= RDV_CARDS_PER_SENDER_MAX) return;\n            if (cardCount", neu: "if (vonDiesem >= RDV_CARDS_PER_SENDER_MAX && !mitAufwand) return;\n            if (cardCount", rot: "K9" },
  { name: "Fragen ohne Aufwand ohne eigene Grenze", datei: M23,
    alt: "if (ohneAufwand && answerTimestamps.filter(function (e) { return e.p; }).length >= RDV_QUERY_NOPOW_MAX_PER_MIN) return false;", neu: "", rot: "Q1" },
  { name: "Frage ohne Aufwand zählt als mit", datei: M23,
    alt: "var ohneAufwand = !powPruefen(q);     // S3", neu: "var ohneAufwand = false;", rot: "Q1" },
  { name: "Fragen ohne Aufwand werden gar nicht mehr beantwortet", datei: M23,
    alt: "if (ohneAufwand && answerTimestamps", neu: "if (ohneAufwand) return false; if (ohneAufwand && answerTimestamps", rot: "Q1" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gps3-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_s3_aufwand.mjs")], { encoding: "utf8", timeout: 180000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot)) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
