#!/usr/bin/env node
/*
 * zweig-pruefen.mjs — „Ist meine Arbeit wirklich oben, und ist sie wirklich drin?"
 *
 * WARUM ES DIESES SKRIPT GIBT
 *
 * `git diff origin/main origin/<zweig>` meldet einen Unterschied, sagt aber
 * NICHT, in welche Richtung er zeigt. Dieselbe Meldung bedeutet zwei
 * entgegengesetzte Dinge:
 *
 *   - der Zweig hat etwas, das `main` fehlt   → ARBEIT GEHT VERLOREN
 *   - `main` hat etwas, das der Zweig nicht kennt → harmlos, Zweig ist alt;
 *     ein PR daraus würde aber FREMDE ARBEIT ZURÜCKDREHEN
 *
 * Am 2026-08-17 trat beides an einem Tag dreimal auf (Perfect Skin Beauty,
 * Kimboard, Sage). In Kimboard hätte ein PR aus dem alten Zweig 433 Zeilen
 * einer Parallel-Sitzung gelöscht.
 *
 * Das Skript rechnet die Richtung aus, statt sie zu raten: es zählt die
 * HINZUFÜGUNGEN des Zweigs gegenüber `main`. Null Hinzufügungen heißt: der
 * Zweig bringt nichts Neues, alles ist drin.
 *
 * Aufruf (aus einem beliebigen Verzeichnis):
 *   node tools/zweig-pruefen.mjs <zweig> [repo ...]
 *   node tools/zweig-pruefen.mjs claude/mein-zweig            # alle Nachbar-Repos
 *   node tools/zweig-pruefen.mjs claude/mein-zweig ../Kimboard
 *
 * Rückgabewert: 1, sobald EIN Repo rot ist. Sonst 0.
 * Achtung: nicht hinter eine Pipe hängen — `| tail` liefert den Rückgabewert
 * von `tail`, nicht diesen hier.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const ELTERN = resolve(HIER, "..", "..");

const [zweig, ...gewaehlt] = process.argv.slice(2);
if (!zweig) {
  console.error("Aufruf: node tools/zweig-pruefen.mjs <zweig> [repo ...]");
  process.exit(2);
}

const repos = gewaehlt.length
  ? gewaehlt.map((p) => resolve(p))
  : readdirSync(ELTERN)
      .map((n) => resolve(ELTERN, n))
      .filter((p) => existsSync(resolve(p, ".git")))
      .sort();

const git = (repo, args) =>
  execFileSync("git", ["-C", repo, ...args], { encoding: "utf8", maxBuffer: 1 << 28 }).trim();

/* Der Standard-Zweig heisst nicht ueberall `main` — messen, nicht annehmen. */
function hauptzweig(repo) {
  for (const k of ["main", "master"]) {
    try { git(repo, ["rev-parse", "--verify", `origin/${k}`]); return k; } catch { /* weiter */ }
  }
  return null;
}

let rot = 0, gelb = 0, gruen = 0, blind = 0;
const zeile = (zeichen, name, text) => console.log(`${zeichen} ${name.padEnd(24)} ${text}`);

for (const repo of repos) {
  const name = repo.split("/").pop();

  // Ohne frischen Stand ist jede Aussage wertlos. Geht das Holen schief, wird
  // das GEMELDET — niemals still als „grün" durchgewinkt.
  try { git(repo, ["fetch", "origin", "--quiet"]); }
  catch (e) { blind++; zeile("⊘", name, `nicht prüfbar — fetch fehlgeschlagen (${String(e.message).split("\n")[0]})`); continue; }

  const haupt = hauptzweig(repo);
  if (!haupt) { blind++; zeile("⊘", name, "nicht prüfbar — weder origin/main noch origin/master"); continue; }

  let fern = true;
  try { git(repo, ["rev-parse", "--verify", `origin/${zweig}`]); }
  catch { fern = false; }

  const dreck = git(repo, ["status", "--porcelain"]);

  // NICHT gegen @{upstream} rechnen: nach `checkout -B <zweig> origin/main`
  // zeigt der Upstream auf main. Wer den fragt, vergleicht mit main und
  // bekommt „sauber", während oben ein ganz anderer Stand liegt.
  let unveroeffentlicht = "?";
  if (fern) {
    try { unveroeffentlicht = git(repo, ["rev-list", "--count", `origin/${zweig}..HEAD`]); } catch { /* bleibt ? */ }
  }

  if (!fern) {
    const s = dreck ? "und im Arbeitsverzeichnis liegt etwas" : "";
    if (dreck) { rot++; zeile("✗", name, `kein Zweig origin/${zweig} — ${s}`); }
    else { zeile("·", name, `kein Zweig origin/${zweig} (nichts zu prüfen)`); gruen++; }
    continue;
  }

  /* Die Richtung — und zwar NUR fuer die Dateien, die dieser Zweig selbst
   * angefasst hat.
   *
   * Der erste Entwurf zaehlte einfach alle Hinzufuegungen des Diffs gegen
   * main. Das war der falsche Massstab, und der erste Live-Lauf hat ihn
   * entlarvt: PWA Toolpoint meldete „+36", family-project „+152" — beides
   * kam von den NAECHTLICHEN Messlaeufen, die in main Dateien geaendert
   * haben, die der Zweig nie beruehrt hat. Eine geaenderte Zeile zaehlt im
   * Diff als ein Minus UND ein Plus; ein veralteter Zweig sieht damit aus,
   * als braechte er etwas mit.
   *
   * Richtig ist die Frage: was hat der Zweig SEIT DER ABZWEIGUNG getan, und
   * steht das inzwischen in main? Dafuer die Basis suchen, die dort
   * geaenderten Dateien auflisten und je Datei den Inhalt vergleichen.
   * Gleich = die Arbeit ist drin (auch nach einem Squash-Merge, der die
   * Commit-Kennung unbrauchbar macht). Ungleich = hinsehen. */
  const basis = git(repo, ["merge-base", `origin/${haupt}`, `origin/${zweig}`]);
  /* `-c core.quotepath=false`: ohne das liefert git Dateinamen mit Umlaut
   * MASKIERT zurueck ("Skills/00 Skills-\303\234bersicht.md"), rev-parse
   * findet sie dann nicht — und weil der Fehler auf beiden Seiten auftrat,
   * verglich sich null mit null und die Datei galt STILLSCHWEIGEND als
   * geprueft. Beim ersten Selbst-Lauf aufgefallen (Fall 7 im Skill). */
  const angefasst = git(repo, ["-c", "core.quotepath=false", "diff", "--name-only", basis, `origin/${zweig}`])
    .split("\n").filter(Boolean);
  const blob = (ref, datei) => {
    try { return { ok: true, id: git(repo, ["rev-parse", `${ref}:${datei}`]) }; }
    catch { return { ok: false, id: null }; }   // fehlt = geloescht ODER unlesbar
  };
  const offen = [], unlesbar = [];
  for (const d of angefasst) {
    const a = blob(`origin/${zweig}`, d), b = blob(`origin/${haupt}`, d);
    // Beide Seiten unlesbar heisst NICHT „gleich" — es heisst „nicht geprueft".
    if (!a.ok && !b.ok) { unlesbar.push(d); continue; }
    if (a.id !== b.id) offen.push(d);
  }
  const voraus = git(repo, ["rev-list", "--count", `origin/${zweig}..origin/${haupt}`]);

  /* Zwei Urteile, nicht drei.
   *
   * „Der Zweig ist hinter main" ist KEINE Warnung wert, solange seine Arbeit
   * drin ist — main bewegt sich staendig (Parallel-Sitzungen, naechtliche
   * Messlaeufe), und beim ersten Lauf war deshalb 31 von 31 gelb. Eine
   * Warnung, die man nie los wird, lernt man zu uebersehen; dieselbe Lehre
   * steht in PWA-Toolpoint § Der Abgleich.
   *
   * Es zaehlt nur: ist meine Arbeit angekommen? Der Rueckstand wird am Ende
   * EINMAL erwaehnt, als Hinweis fuer den Fall, dass jemand dort weiterbaut. */
  if (dreck || unveroeffentlicht !== "0" || offen.length) {
    rot++;
    const gruende = [];
    if (dreck) gruende.push(`${dreck.split("\n").length} Datei(en) unversioniert`);
    if (unveroeffentlicht !== "0") gruende.push(`${unveroeffentlicht} Commit(s) nicht gepusht`);
    if (offen.length) gruende.push(`nicht in ${haupt}: ${offen.slice(0, 4).join(", ")}${offen.length > 4 ? ` (+${offen.length - 4})` : ""}`);
    zeile("✗", name, gruende.join(" · "));
  } else if (unlesbar.length) {
    blind++;
    zeile("⊘", name, `${unlesbar.length} Datei(en) NICHT lesbar, also ungeprüft: ${unlesbar.slice(0, 3).join(", ")}`);
  } else {
    gruen++;
    if (Number(voraus) > 0) { gelb++; zeile("✓", name, `erledigt (${angefasst.length} Datei(en) geprüft) · Zweig zeigt noch ${voraus} Commit(s) hinter ${haupt}`); }
    else zeile("✓", name, `erledigt · Zweig == ${haupt}`);
  }
}

console.log(`\n${gruen} erledigt · ${rot} offen · ${blind} nicht prüfbar`);
if (gelb) console.log(`\nHinweis: ${gelb} Zweig(e) zeigen noch hinter den Hauptzweig. Das ist harmlos,\nsolange dort nichts Neues entsteht — wer weiterbaut, zweigt vorher frisch ab:\n  git checkout -B <zweig> origin/<haupt>`);
if (blind) console.log("\n⊘ „Nicht prüfbar\" ist NICHT dasselbe wie „in Ordnung\".");
process.exit(rot ? 1 : 0);
