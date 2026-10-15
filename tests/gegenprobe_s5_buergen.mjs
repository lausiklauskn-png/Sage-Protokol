// Gegenprobe S5 „Bürgen" Teil 1 — jeder Riegel wird in einer WEGWERF-KOPIE
// einzeln weggenommen; tests/smoke_s5_buergen.mjs muss dann rot werden, und die
// erste rote Zeile muss den Namen der Zusicherung tragen.
// NUR_ANKER=1 → nur prüfen, ob jeder Anker genau einmal trifft (Sekunden).
// NUR_FALL="…" → nur Fälle, deren Name das enthält.
import { readFileSync, writeFileSync, mkdtempSync, cpSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const M23 = "src/modules/23_rendezvous.js";
const UI = "src/modules/23_rendezvous_ui.js";
const FAELLE = [
  { name: "Kette länger als 2 Schritte", datei: M23,
    alt: "for (var schritt = 1; schritt <= RDV_VOUCH_CHAIN_MAX; schritt++)", neu: "for (var schritt = 1; schritt <= 3; schritt++)", rot: "K4" },
  { name: "Unterschrift der Bürgschaft nicht geprüft", datei: M23,
    alt: "return (await v.verifyDetached(antwortOhneSig(z), z.sig, z.spore.publicKey)) ? \"gueltig\" : \"falsch\";", neu: "return \"gueltig\";", rot: "G1" },
  { name: "Spore nicht an den Bürgen gebunden", datei: M23,
    alt: "if (z.spore.id !== z.voucher) return \"falsch\";", neu: "", rot: "G2" },
  { name: "abgelaufene Bürgschaft zählt", datei: M23,
    alt: "if (z.exp <= jetzt) return \"falsch\";", neu: "", rot: "G4" },
  { name: "Frist über 1 Jahr zählt", datei: M23,
    alt: "|| z.exp - z.ts > RDV_VOUCH_TTL_SEC) return \"falsch\";", neu: ") return \"falsch\";", rot: "G5" },
  { name: "Zeitstempel in der Zukunft zählt", datei: M23,
    alt: "|| z.ts > jetzt + RDV_VOUCH_SKEW_SEC) return \"falsch\";", neu: ") return \"falsch\";", rot: "G6" },
  { name: "Widerruf wirkt nicht", datei: M23,
    alt: "return !revokes.some(", neu: "return true || !revokes.some(", rot: "W1" },
  { name: "jeder Widerruf zählt, egal von wem", datei: M23,
    alt: "return w.voucher === b.voucher && w.subject === b.subject", neu: "return w.subject === b.subject", rot: "W3" },
  { name: "der Bürge haftet nicht", datei: M23,
    alt: "if (aufgefallen.indexOf(b.subject) !== -1) haftet[b.voucher] = true;", neu: "", rot: "H1" },
  { name: "Vorrat nimmt ungeprüfte Zettel", datei: M23,
    alt: "if (st !== \"gueltig\") return { ok: false, reason: st === \"nicht-pruefbar\"", neu: "if (false) return { ok: false, reason: st === \"nicht-pruefbar\"", rot: "R2" },
  { name: "Karte trägt die Bürgschaft nicht", datei: M23,
    alt: "if (mit.vouches.length) card.vouches = mit.vouches;", neu: "", rot: "R3" },
  { name: "Widerrufe nur aus der neuesten Karte", datei: M23,
    alt: "if (Array.isArray(card.revocations)) vouchZettel = vouchZettel.concat(", neu: "if (false) vouchZettel = vouchZettel.concat(", rot: "R5" },
  { name: "ohne Prüf-Modul still verbürgt", datei: M23,
    alt: "if (!v || typeof v.verifyDetached !== \"function\") return \"nicht-pruefbar\";", neu: "if (!v || typeof v.verifyDetached !== \"function\") return \"gueltig\";", rot: "R8" },
  { name: "Anzeige nennt den Namen aus der Karte statt aus den Kontakten", datei: UI,
    alt: "if (k.nodeId === vonId && k.name) vonName = k.name;", neu: "if (k.name) vonName = k.name;", rot: "B1" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gps5-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_s5_buergen.mjs")], { encoding: "utf8", timeout: 240000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot)) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
