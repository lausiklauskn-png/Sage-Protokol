/*
 * Probe: wie SBKIM aufgelöst wird — EINE Lesart, und die steht in den Papieren.
 *
 * ── WARUM ES DIESE PROBE GIBT (Befund 2026-09-10) ───────────────────────────
 *
 * `status.json` trug im Feld `fullName` eine DRITTE Auflösung des Namens:
 * „Semantisch-Empfangendes Bidirektionales KI-Matching". Sie stammt aus
 * `docs/PAPER_NUTZEN_UND_INTEGRATION.md`, das sie im Abstract führte —
 * das Register hatte sie von dort übernommen. Verbindlich ist seit dem
 * 2026-09-03 etwas anderes: `docs/papers/README.md` nennt ausdrücklich die
 * Lesart „Semantisches Bidirektionales KI-Matching" als die gültige.
 *
 * Damit standen im selben Depot drei Namen für dasselbe Protokoll, und der
 * eine davon, den die meisten lesen, war der falsche: das Register ist die
 * Datei, aus der zwanzig Geschwister-Apps ihre Angaben ziehen.
 *
 * ⚠ DER MASSSTAB WIRD GELESEN, NICHT ABGESCHRIEBEN. Stünde die gültige Lesart
 * hier noch einmal als Zeichenkette, wäre das die vierte Stelle, an der sie
 * auseinanderlaufen kann — genau der Fehler, den diese Probe bewacht. Sie
 * kommt deshalb aus `docs/papers/README.md`, und wenn sie dort nicht mehr
 * steht, ist DAS der Befund.
 *
 * ⚠ BENANNTE GRENZE — WAS DIESE PROBE NICHT MISST:
 *
 *   · `sbkim/spore.json` und die drei Wege zur Spore tragen die verkürzte
 *     Form „Semantisch Bidirektionales KI-Matching" (ohne Endung) als
 *     Stichwort und im Schnipsel. Jedes Feld einer Spore steht UNTER der
 *     Signatur — eine Berichtigung dort kostet ein neues Signieren durch
 *     Klaus und rechnet alle zwanzig `matchScore`-Werte neu. Das ist seine
 *     Entscheidung, nicht die einer Sitzung. Deshalb wird hier nur die
 *     DRITTE Auflösung gejagt, nicht die verkürzte.
 *   · `docs/sessions/archiv/` und `docs/PULS.md` sind Aufzeichnungen. Dort
 *     STEHT die dritte Auflösung, und sie soll dort stehen bleiben: die
 *     Einträge halten fest, dass es sie gab. Eine Probe, die sie tilgt,
 *     verlangt Geschichtsfälschung.
 *
 * Lauf: node tests/smoke_sbkim_name.mjs
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const lies = (p) => readFileSync(join(WURZEL, p), "utf8");

let gruen = 0, rot = 0;
const ok = (was, bedingung) => {
  if (bedingung) { gruen++; console.log(`  ✓ ${was}`); }
  else { rot++; console.log(`  ✗ ROT — ${was}`); }
};

console.log("\n── SBKIM wird überall gleich aufgelöst ──\n");

/* ── 1 · Der Maßstab steht in den Papieren und ist dort zu finden ─────────── */
const papiere = lies("docs/papers/README.md");
const treffer = papiere.match(
  /Gültig ist die Lesart [„"]([^"“”„]+?)\.?[""]/);
const GUELTIG = treffer ? treffer[1].replace(/\.$/, "") : "";

ok("docs/papers/README.md nennt die gültige Lesart ausdrücklich",
  GUELTIG.length > 0);

/* Ohne diese Zeile misst alles Folgende gegen eine leere Zeichenkette und
   wäre trivial grün — die fünfte Art, wie eine Prüfung nichts misst. */
ok("… und sie ist eine SBKIM-Auflösung, keine beliebige Fundstelle",
  /^Semantisch\w*\s+Bidirektionales\s+KI-Matching$/.test(GUELTIG));

console.log(`     gelesen: „${GUELTIG}"`);

/* ── 2 · Das Register trägt genau sie ─────────────────────────────────────── */
const status = JSON.parse(lies("status.json"));
ok("status.json führt SBKIM in der gültigen Lesart",
  typeof status.fullName === "string" && status.fullName.startsWith(GUELTIG));

/* ── 3 · Die dritte Auflösung steht in keiner lebenden Datei mehr ─────────── */
const DRITTE = /Semantisch-Empfangendes\s+Bidirektionales/;
/* Zwei Sorten Datei tragen die dritte Aufloesung zu Recht:
     · Aufzeichnungen — sie halten fest, DASS es sie gab (siehe Kopf).
     · diese Probe und ihre Gegenprobe — ein Waechter muss nennen, wonach er
       jagt. Ausgenommen werden genau diese zwei Pfade, nicht `tests/`: sonst
       waere jede neue Datei dort ein Schlupfloch.

   ⚠ DIESE AUSNAHME IST NICHT KOSMETIK. Beim ersten Lauf war die Probe gruen,
   und zwar aus dem falschen Grund: sie war noch nicht eingecheckt, also fuehrte
   `git ls-files` sie nicht, also sah sie sich selbst nicht. Gefunden hat es die
   Gegenprobe, nicht das Nachdenken. */
const SELBST = ["tests/smoke_sbkim_name.mjs", "tests/gegenprobe_sbkim_name.mjs"];
const AUFZEICHNUNG = (p) =>
  p.startsWith("docs/sessions/archiv/") || p === "docs/PULS.md"
  || SELBST.includes(p);

const gefuehrt = execFileSync("git", ["ls-files", "-z"], { cwd: WURZEL })
  .toString("utf8").split("\0").filter(Boolean)
  .filter((p) => /\.(md|json|js|mjs|html|txt)$/i.test(p));

/* ⚠ EINE ZAHL IST HIER DER FALSCHE MASSSTAB. Der erste Anlauf verlangte
   „mehr als 50 gefuehrte Dateien" — und das ist in diesem Depot gar nicht
   isoliert zu unterlaufen: nimmt man `docs`, `assets` und `src` aus dem
   Index, bleiben immer noch 285 (gemessen). Der Gegenprobe-Fall dazu fiel
   deshalb einem NACHBAR-Waechter zur Last und bewies ueber diesen hier
   nichts — gefangen aus dem falschen Grund.
   Gemessen wird stattdessen, ob die Suche die zwei Dateien wirklich in der
   Hand hatte, aus denen die dritte Aufloesung kam. Faellt eine davon aus dem
   Index, ist die Suche darueber blind, und DAS sagt die rote Zeile. */
const HERKUNFT = ["status.json", "docs/PAPER_NUTZEN_UND_INTEGRATION.md"];
const fehlend = HERKUNFT.filter((p) => !gefuehrt.includes(p));
ok(`die Suche hat die bekannten Herkunfts-Dateien wirklich in der Hand${
  fehlend.length ? " — nicht gefunden: " + fehlend.join(", ") : ""}`,
  fehlend.length === 0);

const fundstellen = [];
for (const p of gefuehrt) {
  if (AUFZEICHNUNG(p)) continue;
  let text;
  try { text = lies(p); } catch { continue; }
  /* Der Name darf über eine Zeilengrenze gebrochen sein — das war er im
     Begleit-Dokument, und ein Wächter, der nur einzeilig sucht, hätte ihn
     genau dort nicht gefunden. */
  if (DRITTE.test(text.replace(/\s+/g, " "))) fundstellen.push(p);
}

ok(`keine lebende Datei trägt die dritte Auflösung${
  fundstellen.length ? " — gefunden in: " + fundstellen.join(", ") : ""}`,
  fundstellen.length === 0);

/* ── 4 · Und die Aufzeichnungen haben sie noch ────────────────────────────── */
/* Die Gegenrichtung. Ohne sie wäre die Prüfung darüber auch dann grün, wenn
   jemand die Einträge getilgt hätte — und das ist der Schaden, den der Kopf
   dieser Datei ausdrücklich verbietet. */
const puls = lies("docs/PULS.md");
ok("die Aufzeichnung in docs/PULS.md hält den Befund weiter fest",
  DRITTE.test(puls.replace(/\s+/g, " ")));

/* Eine Ausnahme, die auf eine Datei zeigt, die es nicht mehr gibt, ist von
   einer wirksamen nicht zu unterscheiden — sie nimmt nur nichts mehr aus. */
ok("… und die Ausnahme für Probe und Gegenprobe zeigt auf beide",
  SELBST.every((p) => gefuehrt.includes(p)));

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
process.exit(rot > 0 ? 1 : 0);
