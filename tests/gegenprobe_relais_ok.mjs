/*
 * Gegenprobe zu `smoke_relais_ok.mjs` (Relais-Antwort in 05b und 23, 2026-10-14).
 *
 * Jeder Fall baut GENAU EINEN Fehler ein. Er zählt nur als gefangen, wenn die
 * Probe rot wird UND eine rote Zeile den Namen seiner Zusicherung trägt
 * (`trifft`). Ein Anker, der nicht genau einmal trifft, ist ein toter Anker,
 * kein blinder Wächter.
 *
 * Gearbeitet wird in einer Wegwerf-Kopie (Module + Probe), nie im echten Baum.
 *
 * Lauf: node tests/gegenprobe_relais_ok.mjs   ·   NUR_ANKER=1 prüft nur die Anker.
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const M05B = "src/modules/05b_nostr_relay.js";
const M23 = "src/modules/23_rendezvous.js";
const UI = "src/modules/23_rendezvous_ui.js";
const NOBLE = "src/modules/noble-secp256k1.js";
const PROBE = "tests/smoke_relais_ok.mjs";

const FAELLE = [
  // ── die zwei, die der Brief verlangt
  { datei: M05B, was: "die Auswertung der OK-Zeile ist entfernt", trifft: "beide Relais: angenommen",
    alt: "okEmpfangen(url, m[1], m[2], m[3]);", neu: "/* weg */" },
  { datei: M05B, was: "eine fehlende Antwort zählt als angenommen", trifft: "NIE angenommen",
    alt: 'var liste = [], z = { angenommen: 0, abgelehnt: 0, unbekannt: 0 };',
    neu: 'var liste = [], z = { angenommen: 0, abgelehnt: 0, unbekannt: 0 };\n          for (var q = 0; q < gesendet.length; q++) if (eintrag.relais[gesendet[q]].ergebnis === "unbekannt") eintrag.relais[gesendet[q]] = { ergebnis: "angenommen", grund: "" };' },
  // ── 05b, weitere Riegel
  { datei: M05B, was: "jede Antwort außer true… nein: alles gilt als angenommen", trifft: '("true" nicht)',
    alt: "e.relais[url] = ok === true", neu: "e.relais[url] = !!ok" },
  { datei: M05B, was: "der Grund des Relais wird verworfen", trifft: "der Grund des Relais steht wörtlich da",
    alt: ': { ergebnis: "abgelehnt", grund: String(nachricht == null ? "" : nachricht).slice(0, 200) };',
    neu: ': { ergebnis: "abgelehnt", grund: "" };' },
  { datei: M05B, was: "ein OK zu einer fremden Kennung zählt", trifft: "FREMDEN Kennung",
    alt: "function okEmpfangen(url, id, ok, nachricht) {\n      var e = offen[id];", neu: "function okEmpfangen(url, id, ok, nachricht) {\n      var e = offen[id] || offen[Object.keys(offen)[0]];" },
  { datei: M05B, was: "eine zweite Antwort überschreibt die erste", trifft: "nur die ERSTE Antwort",
    alt: 'if (!e || !e.relais[url] || e.relais[url].ergebnis !== "unbekannt") return;',
    neu: "if (!e || !e.relais[url]) return;" },
  { datei: M05B, was: "ein Abbruch der Verbindung wird nicht gemeldet", trifft: "der Grund nennt den Abbruch",
    alt: "verbindungZu(url);", neu: "/* weg */" },
  { datei: M05B, was: "publish wartet auf ein Relais, das nie aufgeht", trifft: "ohne offenes Relais",
    // Zwei Riegel decken einander (onclose UND die 6-s-Frist) — der Fall nimmt beide.
    alt: "if (!aufgegangen) { aufgegangen = true; pending = Math.max(0, pending - 1); maybeResolve(); }", neu: "",
    auch: [["setTimeout(function () { pending = 0; maybeResolve(); }, 6000);", "setTimeout(maybeResolve, 6000);"]] },
  // ── Modul 23
  { datei: M23, was: "23 meldet eine Ablehnung als Erfolg", trifft: "abgelehnt: stand „nein“, ok false",
    alt: 'if (best.stand === "nein") {', neu: "if (false) {" },
  { datei: M23, was: "23 zählt „keine Antwort“ als „ja“", trifft: "keine Antwort: stand „unbekannt“",
    alt: 'return { stand: ja ? "ja" : (alleNein ? "nein" : "unbekannt"), relais: liste };',
    neu: 'return { stand: ja ? "ja" : (alleNein ? "nein" : "ja"), relais: liste };' },
  // ── Oberfläche
  { datei: UI, was: "die Oberfläche zeigt ✓ ohne Bestätigung", trifft: "keine Antwort: „Bestätigung fehlt“, kein ✓",
    alt: 'function imRaum(res) { return !!(res && res.bestaetigung && res.bestaetigung.stand === "ja"); }',
    neu: "function imRaum(res) { return !!res; }" },
  { datei: UI, was: "die Oberfläche verschweigt das ablehnende Relais", trifft: "gemischt: ✓ und die Ablehnung",
    alt: 'if (r.ergebnis === "abgelehnt") z += T', neu: 'if (false) z += T' },
];

const kopie = mkdtempSync(join(tmpdir(), "sage-relaisok-"));
let gefangen = 0, blind = 0, falsch = 0, tot = 0;
try {
  for (const p of [M05B, M23, UI, NOBLE, PROBE]) { mkdirSync(join(kopie, dirname(p)), { recursive: true }); cpSync(join(WURZEL, p), join(kopie, p)); }
  const lauf = () => {
    try { const aus = execFileSync(process.execPath, [join(kopie, PROBE)], { stdio: "pipe", timeout: 120000 }); return { rot: false, aus: String(aus) }; }
    catch (e) { return { rot: true, aus: String(e.stdout || "") + String(e.stderr || "") }; }
  };
  const nurAnker = !!process.env.NUR_ANKER;
  if (!nurAnker) {
    const b = lauf();
    if (b.rot) { console.log("⚠ ABBRUCH: die unversehrte Kopie ist schon ROT.\n" + b.aus.split("\n").filter((l) => l.includes("✗")).join("\n")); process.exit(2); }
  }
  console.log("\nGEGENPROBE — Relais-Antwort (05b + 23)\n");
  for (const f of FAELLE) {
    const basis = readFileSync(join(kopie, f.datei), "utf8");
    const n = basis.split(f.alt).length - 1;
    if (n !== 1) { console.log("  ⚠ TOTER ANKER (" + n + "×): " + f.was); tot++; continue; }
    let neu = basis.replace(f.alt, () => f.neu), totAuch = false;
    for (const [a, b] of f.auch || []) { if (neu.split(a).length - 1 !== 1) totAuch = true; neu = neu.replace(a, () => b); }
    if (totAuch) { console.log("  ⚠ TOTER ANKER (Zusatz): " + f.was); tot++; continue; }
    if (nurAnker) { console.log("  ✓ Anker lebt: " + f.was); continue; }
    writeFileSync(join(kopie, f.datei), neu, "utf8");
    const r = lauf();
    writeFileSync(join(kopie, f.datei), basis, "utf8");
    const rote = r.aus.split("\n").filter((l) => l.startsWith("  ✗ ROT"));
    if (!r.rot) { console.log("  ✗ NICHT GEFANGEN: " + f.was); blind++; }
    else if (rote.some((l) => l.includes(f.trifft))) { console.log("  ✓ gefangen: " + f.was + "  ← " + rote.length + " rote Zeile(n), erste: " + rote[0].trim()); gefangen++; }
    else { console.log("  ✗ ROT AUS FALSCHEM GRUND: " + f.was + "\n      " + (rote[0] || r.aus.split("\n").slice(-3).join(" | "))); falsch++; }
  }
} finally { rmSync(kopie, { recursive: true, force: true }); }
console.log(`\n— ${gefangen} gefangen · ${blind} blind · ${falsch} aus falschem Grund · ${tot} tote Anker —\n`);
process.exit(blind + falsch + tot > 0 ? 1 : 0);
