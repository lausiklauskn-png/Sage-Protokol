/*
 * Gegenprobe zu `smoke_netz_eigen.mjs` (Eigenes Netz, Schritt 1, 2026-10-13).
 *
 * Jeder Fall baut GENAU EINEN Fehler in Modul 23 oder 05b ein. Er zählt nur als
 * gefangen, wenn die Probe rot wird UND eine rote Zeile den Namen seiner
 * Zusicherung trägt (`trifft`). Ein Anker, der nicht genau einmal trifft, ist
 * ein toter Anker, kein blinder Wächter.
 *
 * Gearbeitet wird in einer Wegwerf-Kopie (Module + Probe), nie im echten Baum.
 * Die Kopie hat kein git — die alte Fassung von Modul 23 (für „byte-gleich")
 * wird deshalb vorher aus der festen Fassung VOR dem Netz-Block (5f50263, wie in
 * der Probe) geholt und über NETZ_ALT gereicht — origin/main trüge nach dem Merge
 * die neue Fassung.
 *
 * Lauf: node tests/gegenprobe_netz_eigen.mjs   ·   NUR_ANKER=1 prüft nur die Anker.
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const M23 = "src/modules/23_rendezvous.js";
const M05B = "src/modules/05b_nostr_relay.js";
const NOBLE = "src/modules/noble-secp256k1.js";
const PROBE = "tests/smoke_netz_eigen.mjs";

const FAELLE = [
  // ── Modul 23
  { datei: M23, was: "öffentliches Netz: Karte trägt eine zusätzliche Marke", trifft: "Zeichen für Zeichen gleich",
    alt: 'tags: [["t", netRaum()]],', neu: 'tags: [["t", netRaum()], ["v", "2"]],' },
  { datei: M23, was: "im eigenen Netz wird nicht verschlüsselt", trifft: "kein Name, keine Kennung",
    alt: "if (!net.key) return klar;", neu: "return klar;" },
  { datei: M23, was: "Raum-Marke hängt nicht am Code", trifft: "ein anderer Code → eine andere Marke",
    alt: 'rdvTag: "sbkim-netz-" + h.slice(0, 32)', neu: 'rdvTag: "sbkim-netz-" + "0".repeat(32)' },
  { datei: M23, was: "Klartext-Karte im eigenen Netz wird geglaubt", trifft: "Klartext-Karte werden still verworfen",
    alt: 'if (!u || u.v !== 1 || typeof u.iv !== "string" || typeof u.ct !== "string") return;',
    neu: 'if (!u || u.v !== 1 || typeof u.iv !== "string" || typeof u.ct !== "string") { if (u && u.kind) handle(u); return; }' },
  { datei: M23, was: "ungültiger Netz-Code sendet trotzdem (öffentlich)", trifft: "antworten ok:false",
    alt: 'if (net.lage === "ungueltig" || net.lage === "wird-abgeleitet") {', neu: 'if (net.lage === "wird-abgeleitet") {' },
  { datei: M23, was: "Code ohne Mindestlänge", trifft: "zu kurzer Code ist ungültig",
    alt: "var n = netCodeNorm(code);\n    if (n.length < NETZ_CODE_MIN", neu: "var n = netCodeNorm(code);\n    if (false && n.length < NETZ_CODE_MIN" },
  { datei: M23, was: "Einstellung nimmt auch ws://", trifft: 'checkNetSetting weist ab: "ws://',
    alt: "!/^wss:\\/\\/[A-Za-z0-9.-]+", neu: "!/^wss?:\\/\\/[A-Za-z0-9.-]+" },
  { datei: M23, was: "Netzwechsel lässt den alten Antwort-Lauscher laufen", trifft: "Netzwechsel beendet",
    alt: "if (answerUnsub) { try { answerUnsub(); } catch (_e) {} answerUnsub = null; }\n    var code", neu: "var code" },
  { datei: M23, was: "Speicher ohne dbSuffix (geteilte Adresse)", trifft: "ohne dbSuffix wird nicht gespeichert",
    alt: "return cfg.dbSuffix ? NETZ_SPEICHER_PRAEFIX + cfg.dbSuffix : null;", neu: 'return NETZ_SPEICHER_PRAEFIX + (cfg.dbSuffix || "");' },
  { datei: M23, was: "ungültige Einstellung fällt still ins öffentliche Netz", trifft: "danach geht nichts hinaus",
    alt: 'net = { lage: "ungueltig", rdvTag: null, qryTag: null, key: null, pending: null, reason: chk.reason };',
    neu: 'net = { lage: "oeffentlich", rdvTag: null, qryTag: null, key: null, pending: null, reason: chk.reason };' },
  // ── Modul 05b
  { datei: M05B, was: "05b nimmt ws://", trifft: 'configure weist die ganze Liste ab: ["ws://',
    alt: "/^wss:\\/\\/[A-Za-z0-9.-]+", neu: "/^wss?:\\/\\/[A-Za-z0-9.-]+" },
  { datei: M05B, was: "05b nimmt eine halb gültige Liste", trifft: 'configure weist die ganze Liste ab: ["wss://ok.example","http',
    alt: "if (!istRelaisAdresse(opts.relays[i])) {", neu: "if (!opts.relays.some(istRelaisAdresse)) {" },
  { datei: M05B, was: "05b schließt das alte Relais nicht", trifft: "Verbindung zum alten Relais",
    alt: "try { conns[url].close(); } catch (e) {}\n          delete conns[url];", neu: "delete conns[url];" },
  { datei: M05B, was: "05b ignoriert reset", trifft: "reset:true",
    alt: "neu = DEFAULT_RELAYS.slice();", neu: "neu = null;" },
];

const kopie = mkdtempSync(join(tmpdir(), "sage-netz-"));
let gefangen = 0, blind = 0, falsch = 0, tot = 0;
try {
  for (const p of [M23, M05B, NOBLE, PROBE]) { mkdirSync(join(kopie, dirname(p)), { recursive: true }); cpSync(join(WURZEL, p), join(kopie, p)); }
  let altPfad = null;
  try {
    const alt = execFileSync("git", ["-C", WURZEL, "show", "5f5026360a52a7f1aa9ca7555d698d4c6ecb21dc:" + M23], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    altPfad = join(kopie, "alt_23.js"); writeFileSync(altPfad, alt);
  } catch (_e) { console.log("  ⊘ Fassung 5f50263 nicht lesbar — „byte-gleich“ wird in der Kopie nicht gemessen"); }
  const env = { ...process.env }; if (altPfad) env.NETZ_ALT = altPfad;
  const lauf = () => {
    try { const aus = execFileSync(process.execPath, [join(kopie, PROBE)], { stdio: "pipe", env, timeout: 120000 }); return { rot: false, aus: String(aus) }; }
    catch (e) { return { rot: true, aus: String(e.stdout || "") + String(e.stderr || "") }; }
  };
  const nurAnker = !!process.env.NUR_ANKER;
  if (!nurAnker) {
    const b = lauf();
    if (b.rot) { console.log("⚠ ABBRUCH: die unversehrte Kopie ist schon ROT.\n" + b.aus.split("\n").filter((l) => l.includes("✗")).join("\n")); process.exit(2); }
  }
  console.log("\nGEGENPROBE — Eigenes Netz (Modul 23 + 05b)\n");
  for (const f of FAELLE) {
    const basis = readFileSync(join(kopie, f.datei), "utf8");
    const n = basis.split(f.alt).length - 1;
    if (n !== 1) { console.log("  ⚠ TOTER ANKER (" + n + "×): " + f.was); tot++; continue; }
    if (nurAnker) { console.log("  ✓ Anker lebt: " + f.was); continue; }
    if (f.datei === M23 && !altPfad && f.trifft === "Zeichen für Zeichen gleich") { console.log("  ⊘ übersprungen (kein Vergleich): " + f.was); continue; }
    writeFileSync(join(kopie, f.datei), basis.replace(f.alt, () => f.neu), "utf8");
    const r = lauf();
    writeFileSync(join(kopie, f.datei), basis, "utf8");
    const rote = r.aus.split("\n").filter((l) => l.startsWith("  ✗ ROT"));
    if (!r.rot) { console.log("  ✗ NICHT GEFANGEN: " + f.was); blind++; }
    else if (rote.some((l) => l.includes(f.trifft))) { console.log("  ✓ gefangen: " + f.was + "  ← " + rote.length + " rote Zeile(n)"); gefangen++; }
    else { console.log("  ✗ ROT AUS FALSCHEM GRUND: " + f.was + "\n      " + (rote[0] || r.aus.split("\n").slice(-3).join(" | "))); falsch++; }
  }
} finally { rmSync(kopie, { recursive: true, force: true }); }
console.log(`\n— ${gefangen} gefangen · ${blind} blind · ${falsch} aus falschem Grund · ${tot} tote Anker —\n`);
process.exit(blind + falsch + tot > 0 ? 1 : 0);
