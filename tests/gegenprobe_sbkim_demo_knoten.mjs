/*
 * Gegenprobe zur Knoten-Probe der SBKIM-Demo — jede Zusicherung wird in einer
 * WEGWERF-KOPIE einzeln weggenommen; tests/smoke_sbkim_demo_knoten.mjs muss
 * dann rot werden, und die erste rote Zeile muss den Namen der Zusicherung tragen.
 * ⚠ Arbeitet nur in Kopien unter dem System-Temp — der echte Baum bleibt unberührt.
 * NUR_ANKER=1 → nur prüfen, ob jeder Anker genau einmal trifft.
 */
import { readFileSync, writeFileSync, mkdtempSync, cpSync, symlinkSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FAELLE = [
  { name: "Schublade fehlt im <head>", datei: "sbkim-demo/index.html",
    alt: '<script>window.SBKIM_DB_SUFFIX = "sbkimdemo";</script>\n', neu: "", rot: "K1" },
  { name: "Klebstoff greift in Sages Schublade", datei: "sbkim-demo/sbkim-init.js",
    alt: 'dbSuffix: "sbkimdemo",', neu: 'dbSuffix: "sage",', rot: "K2" },
  { name: "Siegel fehlt in der Kette", datei: "sbkim-demo/sbkim-init.js",
    alt: '    ["",       "../src/modules/16_siegel.js" + V],\n', neu: "", rot: "K4" },
  { name: "Kette zeigt auf eine Kopie statt auf den Kanon", datei: "sbkim-demo/sbkim-init.js",
    alt: '"../src/modules/23_rendezvous.js" + V', neu: '"modules/23_rendezvous.js" + V', rot: "K4" },
  { name: "05b fehlt als eigene Zeile", datei: "sbkim-demo/index.html",
    alt: '<script type="module" src="../src/modules/05b_nostr_relay.js"></script>\n', neu: "", rot: "K7" },
  { name: "Identität beim Start erzwungen", datei: "sbkim-demo/sbkim-init.js",
    alt: "      geraetenameFeldEinhaengen();\n", neu: "      geraetenameFeldEinhaengen(); window.SbkimRendezvous.ensureIdentity();\n", rot: "K11" },
  { name: "Beschreibung trägt eine Mailadresse", datei: "sbkim-demo/siegel-inhalt.js",
    alt: "FÜR WEN: für alle", neu: "FÜR WEN: info@beispiel.example für alle", rot: "K16" },
  { name: "Knoten baut beim Laden eine Verbindung auf", datei: "sbkim-demo/sbkim-init.js",
    alt: "    try {\n      if (!window.SbkimStorage) return;", neu: "    try { new WebSocket(\"ws://127.0.0.1:9\"); } catch (_e) {}\n    try {\n      if (!window.SbkimStorage) return;", rot: "B8" },
  { name: "Siegel-Platz fehlt im Kopf", datei: "sbkim-demo/index.html",
    alt: '<span class="siegel-platz" id="siegel-platz"></span>', neu: "", rot: "K13" },
];
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "demo-gp-"));
  cpSync(join(root, "sbkim-demo"), join(kopie, "sbkim-demo"), { recursive: true });
  mkdirSync(join(kopie, "src"), { recursive: true });
  cpSync(join(root, "src/modules"), join(kopie, "src/modules"), { recursive: true });
  mkdirSync(join(kopie, "tests"), { recursive: true });
  cpSync(join(root, "tests/smoke_sbkim_demo_knoten.mjs"), join(kopie, "tests/smoke_sbkim_demo_knoten.mjs"));
  if (existsSync(join(root, "node_modules"))) symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_sbkim_demo_knoten.mjs")], { encoding: "utf8", timeout: 240000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find((z) => z.includes("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(" " + f.rot + " ")) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.trim().slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
