// Gegenprobe Bau 23.R — jeder Riegel wird in einer WEGWERF-KOPIE einzeln
// weggenommen; tests/smoke_bau23r_echtheit_antworten.mjs muss dann rot werden,
// und die erste rote Zeile muss den Namen der Zusicherung tragen.
// NUR_ANKER=1 → nur prüfen, ob jeder Anker genau einmal trifft (Sekunden).
// NUR_FALL="…" → nur Fälle, deren Name das enthält.
import { readFileSync, writeFileSync, mkdtempSync, cpSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const M02 = "src/modules/02_spore.js", M23 = "src/modules/23_rendezvous.js";
const FAELLE = [
  { name: "Echtheit liest wieder !== false", datei: M23,
    alt: "okSpore = (vr === true) || !!(vr && typeof vr === \"object\" && vr.valid === true);", neu: "okSpore = vr !== false;", rot: "B1" },
  { name: "Namensvetter wird nicht gezählt", datei: M23,
    alt: "if (seenName[key]) { seenName[key].gleicherName = (seenName[key].gleicherName || 0) + 1; return false; }", neu: "if (seenName[key]) { return false; }", rot: "B4" },
  { name: "Antwort eines nicht gefragten Knotens wird genommen", datei: M23,
    alt: "if (erwartetVon && a.fromNodeId !== erwartetVon) return \"falsch\";", neu: "", rot: "C3" },
  { name: "Spore muss nicht zu fromNodeId passen", datei: M23,
    alt: "if (a.spore.id !== a.fromNodeId) return \"falsch\";", neu: "", rot: "C2" },
  { name: "fetchAnswers: unbestätigt darf bestätigt überschreiben", datei: M23,
    alt: "if (prev.bestaetigt && !best) return;", neu: "", rot: "C5" },
  { name: "Antworter unterschreibt nicht", datei: M23,
    alt: "if (!s || typeof s.signDetached !== \"function\") return zettel;     // fail-soft: unsigniert", neu: "return zettel;", rot: "C1" },
  { name: "askNode nimmt die erste unbestätigte sofort", datei: M23,
    alt: "graceTimer = setTimeout(function () { finish(vorlaeufig); }, RDV_UNBESTAETIGT_WARTE_MS);", neu: "finish(vorlaeufig);", rot: "C1" },
  { name: "Titel nicht gekappt", datei: M23,
    alt: "label: String((r && r.label) || \"\").slice(0, RDV_LABEL_MAX)", neu: "label: String((r && r.label) || \"\")", rot: "D2" },
  { name: "verifyDetached sagt immer ja", datei: M02,
    alt: "return await subtle.verify({ name: \"Ed25519\" }, pub, base64urlDecode(signature), canonicalJsonBytes(obj));", neu: "return true;", rot: "A3" },
  { name: "Echtheitsprüfung steht wieder nach dem Zusammenfassen", datei: M23,
    alt: "        var verifier = resolveVerifier();\n        var cardsVerified = !!verifier;\n        if (verifier) {",
    neu: "        var verifier = resolveVerifier();\n        var cardsVerified = !!verifier;\n        if (verifier && opts.collapseByName === false) {", rot: "B1" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gp23r-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_bau23r_echtheit_antworten.mjs")], { encoding: "utf8", timeout: 180000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot)) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
