/*
 * Gegenprobe zu `smoke_sbkim_name.mjs`.
 *
 * Jeder Fall baut GENAU EINEN Fehler ein, und jeder MUSS die Probe umwerfen.
 * Ein Wächter ohne Gegenprobe ist nur ein grüner Haken — und dieser hier hat
 * beim allerersten Lauf seinen eigenen Autor erwischt: die Notiz, die ich ins
 * Register geschrieben hatte, ZITIERTE die falsche Auflösung im Wortlaut, und
 * eine Prüfung kann ein Zitat nicht von einer Behauptung unterscheiden.
 *
 * ⚠ ZWEI RIEGEL, DIE EINANDER DECKEN, MESSEN EINZELN NICHTS. Das Register auf
 * die dritte Auflösung zurückzudrehen wirft ZWEI Wächter um (den auf die
 * gültige Lesart und den auf die Fundstellen) — der Fall bewiese dann über
 * keinen von beiden etwas. Fall 3 setzt deshalb eine ANDERE falsche Auflösung
 * ein, und die Fundstellen-Wächter werden getrennt am Begleit-Dokument
 * sabotiert.
 *
 * ⚠ DIE KOPIE BEKOMMT IHR EIGENES git-VERZEICHNIS. Die Probe fragt `git
 * ls-files`; ein Verweis auf das echte `.git` liesse sie den Index des
 * ORIGINALS lesen, während ihre Auskunft von der Kopie handelte — in Kimhub
 * am 2026-09-05 gemessen und dort genau deshalb verworfen.
 *
 * Lauf: node tests/gegenprobe_sbkim_name.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROBE = "tests/smoke_sbkim_name.mjs";
const PAPIERE = "docs/papers/README.md";
const BEGLEIT = "docs/PAPER_NUTZEN_UND_INTEGRATION.md";
const DRITTE = "Semantisch-Empfangendes Bidirektionales KI-Matching";

const FAELLE = [
  { was: "die Papiere nennen die gueltige Lesart nicht mehr",
    datei: PAPIERE,
    alt: "**Gültig ist die Lesart", neu: "**Vermutlich gemeint ist" },

  { was: "die Papiere erklaeren etwas Beliebiges fuer gueltig",
    datei: PAPIERE,
    regex: /Gültig ist die Lesart [„"][^"“”„]+?[""]/,
    ersatz: 'Gültig ist die Lesart „Das Sage-Protokoll."' },

  { was: "das Register loest SBKIM anders auf (Biologisch statt Bidirektional)",
    datei: "status.json",
    alt: '"fullName": "Semantisches Bidirektionales KI-Matching',
    neu: '"fullName": "Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel' },

  { was: "die dritte Aufloesung kehrt ins Begleit-Dokument zurueck",
    datei: BEGLEIT,
    alt: "(Semantisches Bidirektionales KI-Matching)",
    neu: "(" + DRITTE + ")" },

  /* Derselbe Fehler, nur ueber eine Zeilengrenze gebrochen — so stand er dort
     wirklich. Ein Waechter, der nur einzeilig sucht, faende ihn genau hier
     nicht. */
  { was: "… und dasselbe ueber einen Zeilenumbruch hinweg",
    datei: BEGLEIT,
    alt: "(Semantisches Bidirektionales KI-Matching)",
    neu: "(Semantisch-Empfangendes Bidirektionales\nKI-Matching)" },

  /* ⚠ IN DER AUFZEICHNUNG STEHT DER NAME UEBER ZWEI ZEILEN. Der erste Anlauf
     nahm ihn einzeilig und meldete sich als „ANKER NICHT GEFUNDEN" — ein Fall
     mit totem Anker misst nichts und sieht dabei aus wie eine bestandene
     Pruefung. */
  { was: "die Aufzeichnung des Befundes wird getilgt",
    datei: "docs/PULS.md",
    alt: "\"Semantisch-Empfangendes Bidirektionales\n  KI-Matching\"",
    neu: "\"Semantisches Bidirektionales KI-Matching\"" },

  /* ⚠ DIESER FALL HIESS ZUERST „git fuehrt fast nichts mehr" und nahm
     docs+assets+src+tests aus dem Index. Er war gefangen — aber vom Waechter
     auf die Selbst-Ausnahme, weil `tests` mitwegfiel. Ueber den Waechter, den
     er treffen sollte, bewies er nichts. Er nimmt jetzt GENAU EINE Datei
     heraus, und zwar die, aus der die dritte Aufloesung kam. */
  { was: "eine Herkunfts-Datei faellt aus dem Index, die Suche waere dort blind",
    git: ["rm", "--cached", "-q", "--", BEGLEIT] },
];

let gefangen = 0, durch = 0;
console.log("\nGEGENPROBE — wie SBKIM aufgeloest wird\n");

const kopie = mkdtempSync(join(tmpdir(), "sage-sbkim-name-"));
try {
  /* Nur die von git gefuehrten Textdateien — die Probe sucht ohnehin nur in
     denen, und ein Klon der ganzen 73 MB machte den Lauf langsam ohne etwas
     zu messen. */
  const gefuehrt = execFileSync("git", ["ls-files", "-z"], { cwd: WURZEL })
    .toString("utf8").split("\0").filter(Boolean)
    .filter((p) => /\.(md|json|js|mjs|html|txt)$/i.test(p));
  for (const p of gefuehrt) {
    mkdirSync(join(kopie, dirname(p)), { recursive: true });
    cpSync(join(WURZEL, p), join(kopie, p));
  }
  /* ⚠ DIE PROBE SELBST WIRD AUSDRUECKLICH MITKOPIERT. Solange sie neu und
     noch nicht eingecheckt ist, fuehrt `git ls-files` sie nicht — die Kopie
     haette dann keine Probe, und der Lauf braeche mit MODULE_NOT_FOUND ab.
     Genau so ist es beim ersten Lauf passiert; es sah aus wie eine rote
     Ausgangslage und war eine fehlende Datei. */
  mkdirSync(join(kopie, "tests"), { recursive: true });
  cpSync(join(WURZEL, PROBE), join(kopie, PROBE));
  const git = (...a) => execFileSync("git", a, { cwd: kopie, stdio: "pipe" });
  git("init", "-q");
  git("add", "-A");

  const laeuft = () => {
    try { execFileSync(process.execPath, [join(kopie, PROBE)], { cwd: kopie, stdio: "pipe" }); return true; }
    catch { return false; }
  };

  /* ⚠ OHNE DIESE ZEILE MISST KEIN EINZIGER FALL ETWAS. Bei roter Ausgangslage
     gaebe jede Sabotage sich selbst recht. */
  if (!laeuft()) {
    console.log("⚠ ABBRUCH: die unversehrte Kopie ist schon ROT. Kein Fall misst etwas.\n");
    process.exit(2);
  }
  console.log("  ✓ unveraendert ist die Probe gruen\n");

  for (const f of FAELLE) {
    if (f.git) {
      git(...f.git);
      if (laeuft()) { console.log("  ✗ NICHT GEFANGEN: " + f.was); durch++; }
      else { console.log("  ✓ gefangen: " + f.was); gefangen++; }
      git("reset", "-q");
      git("add", "-A");
      continue;
    }
    const basis = readFileSync(join(kopie, f.datei), "utf8");
    let neu;
    if (f.regex) {
      if (!f.regex.test(basis)) { console.log("  ⚠ ANKER NICHT GEFUNDEN — misst nichts: " + f.was); durch++; continue; }
      neu = basis.replace(f.regex, f.ersatz);
    } else {
      if (!basis.includes(f.alt)) { console.log("  ⚠ ANKER NICHT GEFUNDEN — misst nichts: " + f.was); durch++; continue; }
      neu = basis.replace(f.alt, f.neu);
    }
    if (neu === basis) { console.log("  ⚠ OHNE WIRKUNG — misst nichts: " + f.was); durch++; continue; }
    writeFileSync(join(kopie, f.datei), neu, "utf8");
    if (laeuft()) { console.log("  ✗ NICHT GEFANGEN: " + f.was); durch++; }
    else { console.log("  ✓ gefangen: " + f.was); gefangen++; }
    writeFileSync(join(kopie, f.datei), basis, "utf8");   // sonst reicht ein Fall in den naechsten
  }
} finally { rmSync(kopie, { recursive: true, force: true }); }

console.log(`\n— ${gefangen} gefangen, ${durch} durchgerutscht —\n`);
process.exit(durch > 0 ? 1 : 0);
