/*
 * Probe zu `tools/aufraeumen.sh`.
 *
 * Was hier wirklich bewacht wird, ist EINE Zusicherung: ein Klon, der Arbeit
 * trägt, die nicht auf GitHub liegt, wird NIE zum Löschen vorgeschlagen. Alles
 * andere am Werkzeug ist Bequemlichkeit; dieser eine Punkt ist der Grund,
 * warum Klaus es benutzen kann, ohne Angst zu haben.
 *
 * Geprüft wird an echten Git-Repos, nicht an nachgebauten Ausgaben: die Probe
 * legt ein Testverzeichnis mit einem lokalen „Remote" an und stellt vier Fälle
 * her — sauber, geänderte Dateien, ungepushter Commit, weggelegte Arbeit.
 * Eine Prüfung gegen erfundene Textzeilen würde genau das nicht messen.
 *
 * Lauf: node tests/smoke_aufraeumen.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
// Die Gegenprobe schiebt hier eine absichtlich kaputte Kopie unter. Ohne diese
// Möglichkeit müsste sie die echte Datei anfassen und wieder zurückschreiben —
// und ein abgebrochener Lauf ließe ein sabotiertes Werkzeug im Repo liegen.
const SKRIPT = process.env.AUFRAEUMEN_SKRIPT || join(WURZEL, "tools", "aufraeumen.sh");

let gruen = 0, rot = 0;
function ok(was, bedingung) {
  if (bedingung) { gruen++; console.log("  ✓ " + was); }
  else { rot++; console.log("  ✗ ROT: " + was); }
}

const git = (cwd, ...args) =>
  execFileSync("git", args, { cwd, stdio: "pipe", encoding: "utf8" });

/** Legt ein Repo an, das an einem lokalen bare-Repo als „Remote" hängt. */
function repoAnlegen(wurzel, name) {
  const bare = join(wurzel, "_remotes", name + ".git");
  mkdirSync(bare, { recursive: true });
  execFileSync("git", ["init", "--bare", "--quiet", "-b", "main", bare], { stdio: "pipe" });

  const d = join(wurzel, name);
  mkdirSync(d, { recursive: true });
  git(d, "init", "--quiet", "-b", "main");
  git(d, "config", "user.email", "probe@example.invalid");
  git(d, "config", "user.name", "Probe");
  writeFileSync(join(d, "datei.txt"), "erste Zeile\n");
  git(d, "add", "-A");
  git(d, "commit", "--quiet", "-m", "erster Commit");
  git(d, "remote", "add", "origin", bare);
  git(d, "push", "--quiet", "origin", "main");
  return d;
}

function lauf(wurzel, umgebung = {}) {
  return execFileSync("bash", [SKRIPT], {
    env: { ...process.env, WURZEL: wurzel, ...umgebung },
    encoding: "utf8", stdio: "pipe",
  });
}

const wurzel = mkdtempSync(join(tmpdir(), "aufraeum-probe-"));
try {
  console.log("\nAUFRÄUMEN — Probe\n");

  // ── Vier Fälle herstellen ────────────────────────────────────────────────
  const sauber = repoAnlegen(wurzel, "sauber-repo");

  const dreckig = repoAnlegen(wurzel, "dreckig-repo");
  writeFileSync(join(dreckig, "datei.txt"), "veraendert\n");

  const ungepusht = repoAnlegen(wurzel, "ungepusht-repo");
  writeFileSync(join(ungepusht, "neu.txt"), "nur lokal\n");
  git(ungepusht, "add", "-A");
  git(ungepusht, "commit", "--quiet", "-m", "liegt nur hier");

  const gestasht = repoAnlegen(wurzel, "gestasht-repo");
  writeFileSync(join(gestasht, "datei.txt"), "weggelegt\n");
  git(gestasht, "stash", "--quiet");

  // Die Falle aus Sages CLAUDE.md: `checkout -B` hängt den Upstream auf main.
  // Wer gegen @{upstream} prüft, sieht hier „sauber" — obwohl der Commit auf
  // KEINEM Remote liegt. Dieser Fall ist der eigentliche Grund für die Probe.
  const upstreamFalle = repoAnlegen(wurzel, "upstreamfalle-repo");
  git(upstreamFalle, "checkout", "--quiet", "-B", "arbeitszweig", "origin/main");
  writeFileSync(join(upstreamFalle, "arbeit.txt"), "nie gepusht\n");
  git(upstreamFalle, "add", "-A");
  git(upstreamFalle, "commit", "--quiet", "-m", "auf dem Zweig, nirgends oben");

  // Der schärfere Fall: ein Zweig, der ÜBERHAUPT KEINEN Upstream hat. Hier
  // bricht `git rev-list @{upstream}..HEAD` mit einem Fehler ab. Wer den Fehler
  // wegwirft und als „0 Commits" liest, übersieht die Arbeit eines ganzen
  // Zweiges — und der Klon landet in der Löschliste.
  const ohneUpstream = repoAnlegen(wurzel, "ohneupstream-repo");
  git(ohneUpstream, "checkout", "--quiet", "-b", "feierabend");
  writeFileSync(join(ohneUpstream, "abend.txt"), "kennt kein Remote\n");
  git(ohneUpstream, "add", "-A");
  git(ohneUpstream, "commit", "--quiet", "-m", "Zweig ohne Upstream");

  // ── Erster Gang: nachsehen ───────────────────────────────────────────────
  const bericht = lauf(wurzel);
  const zeile = (name) =>
    bericht.split("\n").find((z) => z.includes(name)) || "";

  console.log("Gang 1 — nachsehen");
  ok("sauberer Klon wird als entfernbar gelistet",
    zeile("sauber-repo").includes("kann weg"));
  ok("geänderte Dateien → BLEIBT",
    zeile("dreckig-repo").includes("BLEIBT") && zeile("dreckig-repo").includes("geänderte"));
  ok("ungepushter Commit → BLEIBT",
    zeile("ungepusht-repo").includes("BLEIBT") && zeile("ungepusht-repo").includes("nicht gepusht"));
  ok("weggelegte Arbeit (stash) → BLEIBT",
    zeile("gestasht-repo").includes("BLEIBT") && zeile("gestasht-repo").includes("stash"));
  ok("Upstream-Falle: Zweig von origin/main, Commit nirgends oben → BLEIBT",
    zeile("upstreamfalle-repo").includes("BLEIBT") &&
    zeile("upstreamfalle-repo").includes("nicht gepusht"));
  ok("Zweig ganz OHNE Upstream → BLEIBT",
    zeile("ohneupstream-repo").includes("BLEIBT") &&
    zeile("ohneupstream-repo").includes("nicht gepusht"));
  ok("der Bericht sagt, dass nichts verändert wurde",
    bericht.includes("Nichts verändert."));

  console.log("\nGang 1 — nichts angefasst");
  ok("kein Klon ist verschwunden",
    [sauber, dreckig, ungepusht, gestasht, upstreamFalle, ohneUpstream].every((d) => existsSync(d)));

  // ── GC-Gang: darf nichts entfernen ───────────────────────────────────────
  console.log("\nGang 2 — GC");
  const gcBericht = lauf(wurzel, { GC: "ja" });
  ok("der GC-Gang sagt ausdrücklich, dass nichts gelöscht wird",
    gcBericht.includes("NICHTS gelöscht"));
  ok("nach dem GC-Gang steht jeder Klon noch",
    [sauber, dreckig, ungepusht, gestasht, upstreamFalle, ohneUpstream].every((d) => existsSync(d)));
  ok("und die Arbeit im ungepushten Klon ist unversehrt",
    git(ungepusht, "log", "--oneline").includes("liegt nur hier"));

  // ── Scharfer Gang: nur der saubere geht ──────────────────────────────────
  console.log("\nGang 3 — scharf");
  lauf(wurzel, { SCHARF: "ja" });
  ok("der saubere Klon ist entfernt", !existsSync(sauber));
  ok("der Klon mit geänderten Dateien steht noch", existsSync(dreckig));
  ok("der Klon mit ungepushtem Commit steht noch", existsSync(ungepusht));
  ok("der Klon mit weggelegter Arbeit steht noch", existsSync(gestasht));
  ok("der Klon aus der Upstream-Falle steht noch", existsSync(upstreamFalle));
  ok("der Klon mit dem upstream-losen Zweig steht noch", existsSync(ohneUpstream));

  const zweiterLauf = lauf(wurzel, { SCHARF: "ja" });
  ok("ein zweiter scharfer Lauf findet nichts mehr und rührt nichts an",
    zweiterLauf.includes("Nichts zu entfernen") &&
    [dreckig, ungepusht, gestasht, upstreamFalle, ohneUpstream].every((d) => existsSync(d)));
} finally {
  rmSync(wurzel, { recursive: true, force: true });
}

// ── Der Selbstschutz: das Skript sägt nicht den Ast ab, auf dem es sitzt ────
// Eigene Wurzel, weil der scharfe Gang oben schon aufgeräumt hat. Geprüft wird
// mit einer KOPIE des Skripts INNERHALB eines Klons — nur so ist dieser Klon
// wirklich `SELBST`. Eine Prüfung, die das Skript von außen aufruft, würde den
// Riegel nie berühren und wäre ein grüner Haken über einem offenen Loch.
const wurzel2 = mkdtempSync(join(tmpdir(), "aufraeum-selbst-"));
try {
  console.log("\nSelbstschutz");
  const gastgeber = repoAnlegen(wurzel2, "gastgeber-repo");
  const daneben = repoAnlegen(wurzel2, "daneben-repo");
  mkdirSync(join(gastgeber, "tools"), { recursive: true });
  const kopie = join(gastgeber, "tools", "aufraeumen.sh");
  copyFileSync(SKRIPT, kopie);

  const bericht2 = execFileSync("bash", [kopie], {
    env: { ...process.env, WURZEL: wurzel2 }, encoding: "utf8", stdio: "pipe",
  });
  const zeile2 = (n) => bericht2.split("\n").find((z) => z.includes(n)) || "";

  ok("das eigene Repo wird nicht zum Löschen vorgeschlagen",
    zeile2("gastgeber-repo").includes("BLEIBT") &&
    zeile2("gastgeber-repo").includes("hier läuft das Skript"));
  ok("der Klon daneben schon (sonst würde der Riegel gar nichts beweisen)",
    zeile2("daneben-repo").includes("kann weg"));

  execFileSync("bash", [kopie], {
    env: { ...process.env, WURZEL: wurzel2, SCHARF: "ja" }, encoding: "utf8", stdio: "pipe",
  });
  ok("auch im scharfen Gang steht das eigene Repo noch", existsSync(gastgeber));
  ok("und der Klon daneben ist weg", !existsSync(daneben));
} finally {
  rmSync(wurzel2, { recursive: true, force: true });
}

console.log(`\n— ${gruen} bestanden, ${rot} fehlgeschlagen —\n`);
process.exit(rot > 0 ? 1 : 0);
