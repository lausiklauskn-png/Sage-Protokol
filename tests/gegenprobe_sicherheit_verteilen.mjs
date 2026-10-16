// Gegenprobe tools/sicherheit-verteilen.mjs (2026-10-17) — jeder Riegel wird in einer
// WEGWERF-KOPIE des Werkzeugs gebrochen; tests/smoke_sicherheit_verteilen.mjs muss rot werden,
// und eine rote Zeile muss den Namen der Zusicherung tragen. Der echte Baum wird nie angefasst.
// NUR_ANKER=1 → nur prüfen, ob jeder Anker genau einmal trifft.
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const QUELLE = readFileSync(join(root, "tools/sicherheit-verteilen.mjs"), "utf8");
const FAELLE = [
  { name: "Akzent wird nicht übernommen", alt: '    neu = neu.replace("--akzent: #36d6c3;", "--akzent: " + akzent + ";");\n', neu: "", rot: "V1a" },
  { name: "var(--gold) wird nicht aufgelöst", alt: '    if (v) akzent = (new RegExp("--" + v + ":\\\\s*(#[0-9a-fA-F]{3,8})").exec(alt) || [])[1];\n', neu: "", rot: "V1b" },
  { name: "Rückweg geht verloren", alt: "    if (href !== \"./\") {", neu: "    if (false) {", rot: "V2" },
  { name: "Titel-Zusatz geht verloren", alt: "  if (zusatz) { neu = neu.replace(", neu: "  if (false) { neu = neu.replace(", rot: "V3" },
  { name: "Titel nimmt „und so bist du geschützt“ mit", alt: "!/So funktioniert|und so bist|^SBKIM$/i.test(x)", neu: "!/So funktioniert/i.test(x)", rot: "V3c" },
  { name: "eigene deutsche Abschnitte gehen verloren", alt: "  if (eigenDE && eigenDE.split(\"\\n\").length > 3) {", neu: "  if (false) {", rot: "V4a" },
  { name: "eigene englische Abschnitte gehen verloren", alt: "  if (eigenEN && eigenEN.split(\"\\n\").length > 3) {", neu: "  if (false) {", rot: "V4b" },
  { name: "eigener Kopf geht verloren", alt: "  if (kopf) { neu", neu: "  if (false) { neu", rot: "V5a" },
  { name: "eigener Fuß geht verloren", alt: "  if (fuss) { neu", neu: "  if (false) { neu", rot: "V5b" },
  { name: "canonical wird nicht beachtet", alt: "  if (canon) {", neu: "  if (false) {", rot: "V6b" },
  { name: "Sprach-Schlüssel geht verloren", alt: "  if (schluessel) { neu", neu: "  if (false) { neu", rot: "V7" },
];
const nurAnker = process.env.NUR_ANKER === "1";
let gefangen = 0, blind = 0, tot = 0, falsch = 0;
for (const f of FAELLE) {
  const n = QUELLE.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log(`✗ TOTER ANKER (${n}×): ${f.name}`); continue; }
  if (nurAnker) { console.log(`✓ Anker trifft 1×: ${f.name}`); continue; }
  const dir = mkdtempSync(join(tmpdir(), "gp-sv-"));
  try {
    mkdirSync(join(dir, "tools/lib"), { recursive: true });
    copyFileSync(join(root, "tools/lib/cache-bump.mjs"), join(dir, "tools/lib/cache-bump.mjs"));
    copyFileSync(join(root, "sicherheit.html"), join(dir, "sicherheit.html"));
    writeFileSync(join(dir, "tools/sicherheit-verteilen.mjs"), QUELLE.replace(f.alt, f.neu));
    const r = spawnSync(process.execPath, [join(root, "tests/smoke_sicherheit_verteilen.mjs"), join(dir, "tools/sicherheit-verteilen.mjs")], { encoding: "utf8", timeout: 60000 });
    const rote = (r.stdout || "").split("\n").filter((z) => z.startsWith("✗ ROT:"));
    if (r.status === 0 || !rote.length) { blind++; console.log(`✗ BLIND: ${f.name}`); }
    else if (!rote.some((z) => z.startsWith("✗ ROT: " + f.rot + " "))) { falsch++; console.log(`✗ AUS FALSCHEM GRUND: ${f.name} → ${rote[0]}`); }
    else { gefangen++; console.log(`✓ schlägt an: ${f.name} → ${rote.find((z) => z.startsWith("✗ ROT: " + f.rot + " "))}`); }
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
console.log(`\n${gefangen} schlagen an · ${blind} blind · ${falsch} aus falschem Grund · ${tot} tote Anker`);
process.exit(blind || falsch || tot ? 1 : 0);
