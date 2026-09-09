#!/usr/bin/env node
/*
 * kanon-nachmessen.mjs — „Trägt die Kopie noch das, was hier im Kanon steht?"
 *
 * WARUM ES DIESES SKRIPT GIBT
 *
 * Ein Drift-Guard sagt „unverändert", nicht „aktuell". Er vergleicht eine
 * Kopie mit seinem EIGENEN Fingerabdruck — und der wandert mit, sobald jemand
 * ihn nachzieht. Reift ein Modul hier in Sage, bleibt der Guard drüben grün,
 * obwohl die Kopie eine Generation zurückhängt. Er kann es gar nicht sehen:
 * er kennt die Quelle nicht.
 *
 * Der Satz hat innerhalb einer Woche DREIMAL zugeschlagen:
 *   2026-09-08  PWA-Toolpoint/sbkim/15_membran.js  — eine Generation zurück
 *   2026-09-09  kim-hub-company/ansicht.js         — eine Generation zurück
 *   2026-09-09  netzweit (dieses Skript)           — siehe unten
 * Keiner der drei Funde kam von einer Probe. Alle drei kamen davon, dass
 * jemand von Hand gegen die Quelle nachgerechnet hat.
 *
 * Dieses Skript rechnet dieselbe Frage für ALLE Nachbar-Depots auf einmal —
 * und es braucht dafür KEIN Netz: der Kanon liegt hier in `src/modules/`, die
 * Kopien liegen in den Nachbar-Klonen. Beides lokal.
 *
 * ── WAS ES MISST UND WAS ES NICHT MISST ────────────────────────────────────
 *
 * Es misst die DATEIEN, nicht die Pins. Damit ist es blind gegen die
 * verschiedenen Wächter-Formate im Netz (`{datei, sha}` in kim-hub-company,
 * `'pfad': 'sha'` in PWA-Toolpoint, gar keiner anderswo) — und es findet auch
 * Kopien, über die überhaupt kein Wächter wacht.
 *
 * Es sagt „weicht ab", NICHT „ist veraltet". Den Unterschied kann es nicht
 * kennen: eine Abweichung kann eine zurückhängende Generation sein ODER eine
 * gewollte App-Fassung. Wer das entscheiden will, liest den Unterschied.
 * Eine Zahl, die sich als Urteil ausgibt, wäre eine geratene Zahl.
 *
 * ── DREI BENANNTE GRENZEN ──────────────────────────────────────────────────
 *
 * 1. Es sieht nur Depots, die im selben Container liegen. Ein Depot, das
 *    niemand geklont hat, kommt in keiner Zahl vor — auch nicht als Lücke.
 *    Deshalb steht am Ende, WIE VIELE Depots angesehen wurden.
 * 2. Es misst gegen `origin/main` der Nachbarn, nicht gegen deren
 *    Arbeitsbaum. Wer nicht frisch gefetcht hat, misst einen alten Stand —
 *    das Skript sagt das Alter des jeweiligen `origin/main` dazu.
 * 3. Es misst NUR Kopien aus Sages Kanon. Eine Kopie, deren Quelle woanders
 *    liegt (kim-hub-companys `ansicht.js` kommt aus Kimhub), sieht es nicht.
 *    Das ist ausgerechnet der Fall, der am 2026-09-09 schiefging. Für ihn
 *    gibt es hier keine Deckung, und ein grüner Haken wäre eine Lüge.
 *    Über das Netz ginge es auch nicht: Kimhub und PWA-Toolpoint stehen
 *    privat, `raw.githubusercontent.com` antwortet dort ohne Anmeldung mit
 *    404 (gemessen 2026-09-09).
 *
 * Aufruf (aus dem Sage-Depot):
 *   node tools/kanon-nachmessen.mjs                 # alle Nachbar-Depots
 *   node tools/kanon-nachmessen.mjs 23_rendezvous_ui.js   # nur ein Modul
 *   node tools/kanon-nachmessen.mjs --streng        # Rückgabewert 1 bei Abweichung
 *
 * Rückgabewert: 0, auch wenn Abweichungen gefunden wurden — sie sind eine
 * AUSKUNFT, kein Fehlschlag. Ein Werkzeug, das bei jedem Lauf rot ist, lernt
 * man zu übersehen; dieselbe Lehre wie bei PWA-Toolpoints `markt-abgleich`.
 * Mit `--streng` wird daraus ein Riegel (für einen künftigen Nachtlauf).
 * 1 auch dann, wenn der Kanon selbst nicht zu lesen war — dann hat das
 * Skript nichts gemessen und darf nicht wie „alles gut" aussehen.
 * Achtung: nicht hinter eine Pipe hängen — `| tail` liefert den Rückgabewert
 * von `tail`, nicht diesen hier.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const NACHBARSCHAFT = join(WURZEL, "..");
const SELBST = basename(WURZEL);

/* Kopien liegen unter diesen Ordnern. `such-tool/modules` in
   SB-KIMTool-Point ist der Grund, warum hier ein Teilpfad und kein
   Anfangsanker steht. */
const KOPIE_PFAD = /(^|\/)(modules|sbkim)\/([A-Za-z0-9_.-]+\.js)$/;

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

function git(repo, ...args) {
  return execFileSync("git", ["-C", repo, ...args], {
    encoding: "buffer", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"],
  });
}

/* ── 1 · Der Kanon, aus dem Arbeitsbaum dieses Depots ─────────────────────── */
const kanonDir = join(WURZEL, "src", "modules");
if (!existsSync(kanonDir)) {
  console.error(`✗ Kanon nicht gefunden: ${kanonDir}`);
  console.error("  Dieses Skript gehört ins Sage-Depot und wird von dort aufgerufen.");
  process.exit(1);
}
const argumente = process.argv.slice(2);
const streng = argumente.includes("--streng");
const nurModule = argumente.filter((a) => !a.startsWith("--"));

const KANON = new Map();
for (const name of readdirSync(kanonDir)) {
  if (!name.endsWith(".js")) continue;
  if (nurModule.length && !nurModule.includes(name)) continue;
  KANON.set(name, sha(readFileSync(join(kanonDir, name))));
}
if (KANON.size === 0) {
  console.error(nurModule.length
    ? `✗ Kein Kanon-Modul passt auf: ${nurModule.join(", ")}`
    : "✗ Der Kanon ist leer — hier stimmt etwas nicht.");
  process.exit(1);
}

/* ── 2 · Die Kopien in den Nachbar-Depots, von deren origin/main ──────────── */
/* fundeProModul: name -> sha -> [ "Depot/pfad", … ] */
const fundeProModul = new Map();
let depotsAngesehen = 0;
const ohneOriginMain = [];
const altersHinweis = [];

for (const eintrag of readdirSync(NACHBARSCHAFT).sort()) {
  if (eintrag === SELBST) continue;
  const repo = join(NACHBARSCHAFT, eintrag);
  let s; try { s = statSync(repo); } catch { continue; }
  if (!s.isDirectory() || !existsSync(join(repo, ".git"))) continue;

  let dateien;
  try {
    dateien = git(repo, "ls-tree", "-r", "origin/main", "--name-only").toString("utf8");
  } catch { ohneOriginMain.push(eintrag); continue; }
  depotsAngesehen++;

  /* Wie alt ist der Stand, gegen den wir messen? (Grenze 2) */
  try {
    const tage = Math.floor(
      (Date.now() - Number(git(repo, "log", "-1", "--format=%ct", "origin/main").toString().trim()) * 1000)
      / 86_400_000);
    if (tage >= 30) altersHinweis.push(`${eintrag} (${tage} Tage)`);
  } catch { /* Alter ist Beiwerk, kein Grund abzubrechen */ }

  for (const pfad of dateien.split("\n")) {
    const treffer = KOPIE_PFAD.exec(pfad);
    if (!treffer) continue;
    const name = treffer[3];
    if (!KANON.has(name)) continue;            // kein Kanon-Modul: fremde Quelle
    let inhalt;
    try { inhalt = git(repo, "show", `origin/main:${pfad}`); } catch { continue; }
    const h = sha(inhalt);
    if (!fundeProModul.has(name)) fundeProModul.set(name, new Map());
    const proSha = fundeProModul.get(name);
    if (!proSha.has(h)) proSha.set(h, []);
    proSha.get(h).push(`${eintrag}/${pfad}`);
  }
}

/* ── 3 · Auskunft ────────────────────────────────────────────────────────── */
let kopienGesamt = 0, aktuellGesamt = 0, abweichendGesamt = 0;
const mehrereGenerationen = [];

for (const [name, sollSha] of [...KANON].sort()) {
  const proSha = fundeProModul.get(name);
  if (!proSha) continue;                        // nirgends kopiert — kein Befund
  const fassungen = [...proSha].sort((a, b) => b[1].length - a[1].length);
  const aktuell = proSha.get(sollSha)?.length ?? 0;
  const gesamt = [...proSha.values()].reduce((n, l) => n + l.length, 0);
  kopienGesamt += gesamt; aktuellGesamt += aktuell; abweichendGesamt += gesamt - aktuell;
  if (fassungen.length > 1) mehrereGenerationen.push([name, fassungen.length]);

  console.log(`\n${name}  — Kanon ${sollSha.slice(0, 10)} · ${aktuell}/${gesamt} Kopien tragen ihn`);
  for (const [h, orte] of fassungen) {
    const marke = h === sollSha ? "✓ Kanon  " : "≠ ANDERS ";
    console.log(`  ${marke} ${h.slice(0, 10)}  (${String(orte.length).padStart(2)})  ${orte.map((o) => o.split("/")[0]).join(" ")}`);
  }
}

console.log("\n" + "─".repeat(72));
console.log(`${depotsAngesehen} Nachbar-Depots angesehen · ${KANON.size} Kanon-Module · ` +
            `${kopienGesamt} Kopien gefunden`);
console.log(`${aktuellGesamt} tragen den Kanon · ${abweichendGesamt} weichen ab`);
if (mehrereGenerationen.length) {
  console.log(`\n⚠ Mehr als eine Fassung im Umlauf bei ${mehrereGenerationen.length} Modul(en):`);
  for (const [name, n] of mehrereGenerationen) console.log(`   ${name} — ${n} Fassungen`);
}
if (ohneOriginMain.length) {
  console.log(`\n⊘ ohne origin/main (nicht gemessen, nicht „grün"): ${ohneOriginMain.join(" ")}`);
}
if (altersHinweis.length) {
  console.log(`\n⏳ origin/main älter als 30 Tage — erst fetchen, dann glauben: ${altersHinweis.join(" ")}`);
}
console.log(
  "\n„Weicht ab\" heißt NICHT „ist veraltet\": es kann eine zurückhängende\n" +
  "Generation sein oder eine gewollte App-Fassung. Wer es wissen will, liest\n" +
  "den Unterschied — dieses Skript rät nicht.");

process.exit(streng && abweichendGesamt > 0 ? 1 : 0);
