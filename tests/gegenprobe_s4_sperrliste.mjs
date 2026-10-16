// Gegenprobe S4 „Signierte Sperrliste im Mycel" — jeder Riegel wird in einer
// WEGWERF-KOPIE einzeln weggenommen; tests/smoke_s4_sperrliste.mjs muss dann rot
// werden, und die erste rote Zeile muss den Namen der Zusicherung tragen.
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
  { name: "Netzadmin des Lesers wird nicht verlangt", datei: M23,
    alt: "if (!sperreForm(z, currentNetAdmin(), jetzt)) return \"falsch\";", neu: "if (!sperreForm(z, z.admin, jetzt)) return \"falsch\";", rot: "F9" },
  { name: "Unterschrift wird nicht geprüft", datei: M23,
    alt: "if (!sperreForm(z, currentNetAdmin(), jetzt)) return \"falsch\";\n    var pr = resolveVerifier();",
    neu: "if (!sperreForm(z, currentNetAdmin(), jetzt)) return \"falsch\";\n    return \"gueltig\";\n    var pr = resolveVerifier();", rot: "F10" },
  { name: "Spore muss nicht dem Netzadmin gehören", datei: M23,
    alt: "    return z.spore.id === admin;\n  }", neu: "    return true;\n  }", rot: "F8" },
  { name: "Liste aus der Zukunft gilt", datei: M23,
    alt: "if (typeof z.ts !== \"number\" || !isFinite(z.ts) || z.ts > jetzt + RDV_VOUCH_SKEW_SEC) return false;\n    if (!Array.isArray(z.ids)",
    neu: "if (typeof z.ts !== \"number\" || !isFinite(z.ts)) return false;\n    if (!Array.isArray(z.ids)", rot: "F11" },
  { name: "Netzadmin darf sich selbst sperren", datei: M23,
    alt: "if (gesehen[id] || id === admin) return false;", neu: "if (gesehen[id]) return false;", rot: "F5" },
  { name: "ältere Liste verdrängt die neuere", datei: M23,
    alt: "var neuer = !(sperre.stand === \"gueltig\" && sperre.admin === z.admin && sperre.ts >= z.ts);", neu: "var neuer = true;", rot: "F14" },
  { name: "wer nicht Netzadmin ist, darf unterschreiben", datei: M23,
    alt: "if (!admin || own.id !== admin) return { ok: false, reason: \"Sperren kann nur der Netzadmin dieses Netzes.\" };", neu: "", rot: "F7" },
  { name: "gesperrte Karte bleibt im Raum", datei: M23,
    alt: "if (isBlocked(c.nodeId)) { gesperrtHier++; return false; }", neu: "", rot: "D1" },
  { name: "Karte trägt die Liste nicht mit", datei: M23,
    alt: "if (sperre.stand === \"gueltig\" && sperre.zettel) card.blocklist = sperre.zettel;", neu: "", rot: "D1" },
  { name: "Liste aus dem Speicher wird nicht neu geprüft", datei: M23,
    alt: "await sperreUebernehmen(z, false);", neu: "sperreSetzen(z);", rot: "D5" },
  { name: "Gesperrter zählt nicht als aufgefallen", datei: M23,
    alt: ".concat(idListe(o.flagged), sperrIds());", neu: ".concat(idListe(o.flagged));", rot: "D7" },
  { name: "Frage einer gesperrten Kennung wird beantwortet", datei: M23,
    alt: "if (isBlocked(q.fromNodeId) || (q.spore && isBlocked(q.spore.id))) { fragenGesperrt++; return; }", neu: "", rot: "A1" },
  { name: "Antwort einer gesperrten Kennung wird genommen", datei: M23,
    alt: "a.toNodeId !== ownId) return;\n            if (isBlocked(a.fromNodeId) || (a.spore && isBlocked(a.spore.id))) { antwortGesperrt++; return; }   // S4",
    neu: "a.toNodeId !== ownId) return;", rot: "A3" },
  { name: "Briefkasten nimmt Antwort einer gesperrten Kennung", datei: M23,
    alt: "// nur meine offenen Fragen\n            if (isBlocked(a.fromNodeId) || (a.spore && isBlocked(a.spore.id))) { antwortGesperrt++; return; }   // S4",
    neu: "// nur meine offenen Fragen", rot: "A4" },
  { name: "jeder sieht den Sperren-Knopf", datei: UI,
    alt: "istNetzadmin().then(function (ja) { if (ja) sb.style.display = \"\"; });", neu: "sb.style.display = \"\";", rot: "U2" },
];
const nur = process.env.NUR_FALL || "";
let gefangen = 0, durch = 0, falsch = 0, tot = 0;
for (const f of FAELLE) {
  if (nur && !f.name.includes(nur)) continue;
  const quelle = readFileSync(join(root, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== 1) { tot++; console.log("☠ TOTER ANKER (" + n + "×): " + f.name); continue; }
  if (process.env.NUR_ANKER) { console.log("· Anker lebt: " + f.name); continue; }
  const kopie = mkdtempSync(join(tmpdir(), "gps4-"));
  cpSync(join(root, "src"), join(kopie, "src"), { recursive: true });
  cpSync(join(root, "tests"), join(kopie, "tests"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(kopie, "node_modules"));
  writeFileSync(join(kopie, f.datei), quelle.replace(f.alt, f.neu));
  const r = spawnSync(process.execPath, [join(kopie, "tests/smoke_s4_sperrliste.mjs")], { encoding: "utf8", timeout: 240000 });
  rmSync(kopie, { recursive: true, force: true });
  const ersteRot = (r.stdout || "").split("\n").find(z => z.startsWith("✗ ROT"));
  if (r.status === 0) { durch++; console.log("✗ DURCHGERUTSCHT: " + f.name); }
  else if (ersteRot && ersteRot.includes(f.rot + " ")) { gefangen++; console.log("✓ gefangen: " + f.name + "  → " + ersteRot.slice(0, 90)); }
  else { falsch++; console.log("? AUS FALSCHEM GRUND: " + f.name + "  → " + (ersteRot || (r.stderr || "").split("\n")[0])); }
}
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · " + falsch + " aus falschem Grund · " + tot + " tote Anker");
process.exitCode = (durch || falsch || tot) ? 1 : 0;
