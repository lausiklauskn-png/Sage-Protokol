/*
 * Gegenprobe zu `smoke_sage_beschreibung.mjs`.
 *
 * Jeder Fall baut GENAU EINEN Fehler ein, und jeder MUSS die Probe umwerfen.
 * Ein Wächter ohne Gegenprobe ist nur ein grüner Haken — und die vierzehn oben
 * bewachen eine Stelle, an der schon zweimal etwas durchgerutscht ist:
 * in Kim Hub Company blieb ein Wächter grün, weil `ta.value = WIZ.…` ZWEIMAL
 * in der Datei steht, und Sage stand vier Tage lang mit 160 Zeichen im Raum.
 *
 * ⚠ GEARBEITET WIRD AN EINER KOPIE. Die echte Datei wird nie angefasst: ein
 * abgebrochener Lauf soll nichts Sabotiertes hinterlassen. In PWA Toolpoint
 * ist genau das am 2026-09-09 passiert — eine liegengebliebene Sabotage sah
 * danach aus wie ein kaputtes Depot.
 *
 * Lauf: node tests/gegenprobe_sage_beschreibung.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = "assets/siegel-inhalt.js";
/* ⚠ DREI WEGE ZUR SPORE, also drei Dateien in der Kopie. Bis zum 2026-09-10
   kopierte diese Gegenprobe nur den ersten — und der Wächter, der die anderen
   zwei misst, hätte in der Kopie gar nichts vorgefunden. */
const MIT = ["index.html", "sbkim-init.js"];

const FAELLE = [
  { was: "der Name des Knotens verschwindet aus der Beschreibung",
    alt: "Sage-Protokol ist der Spezifikations-", neu: "Dieser Knoten ist der Spezifikations-" },
  { was: "der ZWECK wird nicht mehr genannt",
    alt: "ZWECK: die Quelle der Wahrheit", neu: "Es geht um die Quelle der Wahrheit" },
  { was: "die FORSCHUNG faellt heraus",
    alt: "FORSCHUNG: SBKIM steht", neu: "Uebrigens: SBKIM steht" },
  { was: "SBKIM wird wieder falsch aufgeloest (Biologisch statt Bidirektional)",
    alt: "Semantisch Bidirektionales KI-Matching",
    neu: "Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel" },
  { was: "die Beschreibung schrumpft auf den alten Zweizeiler",
    regex: /domainDescription: "(?:[^"\\]|\\.)*"/,
    ersatz: 'domainDescription: "Sage-Protokol ist der Spezifikations- und Bau-Hub des SBKIM-Protokolls und zugleich ein eigener Endknoten im Mycel."' },
  { was: "die Stichwort-Liste faellt auf die alten sechs zurueck",
    regex: /domainKeywords: \[[^\]]*\]/,
    ersatz: 'domainKeywords: ["SBKIM-Glossar", "Mycel-Vokabular", "Protokoll-Doku", "Heilige Tafeln", "Karten", "Schwesternetz-Beobachtungen"]' },

  /* ⚠ DER FALL, DER IN KIM HUB COMPANY DURCHGERUTSCHT IST. Nimmt man die
     VORBELEGUNG heraus, findet ein Waechter, der frei in der Datei sucht,
     dieselbe Zeile im Knopf und bleibt gruen. */
  { was: "das Feld zeigt nicht mehr den Vorschlag der App",
    alt: "    ta.value = WIZ.domainDescription;\n    /* ⚠ WELCHER TEXT",
    neu: "    /* ⚠ WELCHER TEXT" },

  { was: "die gespeicherte Spore ueberschreibt den Vorschlag wieder von selbst",
    alt: "          if (!abweichend) return;",
    neu: "          ta.value = eigener; autoGrow(ta);\n          if (!abweichend) return;" },
  { was: "die Zeile sagt nicht mehr, WELCHER Text im Feld steht",
    alt: 'herkunft.setAttribute("data-woher", "spore");',
    neu: 'herkunft.setAttribute("data-herkunft", "spore");' },
  { was: "der Knopf steht auch dann da, wenn die Texte gleich sind",
    alt: "          if (!abweichend) return;", neu: "          if (false) return;" },
  { was: "die Herkunfts-Zeile wird gebaut, aber nie eingehaengt",
    alt: "wrap.appendChild(herkunft); ", neu: "" },
  /* ── Die zwei Wege, die beim ersten Bau ungeprüft danebenlagen ────────── */
  { was: "die Seite selbst faellt auf ihren alten Kurztext zurueck",
    datei: "index.html",
    regex: /    defaultDomainDescription: "(?:[^"\\]|\\.)*",/,
    ersatz: `    defaultDomainDescription: "Lebendiges SBKIM-Vokabular und Protokoll-Doku: Glossar, INTERFACES, ARCHITEKTUR, Karten 00-15, PULS, die Karte, die sich selbst kennt.",` },
  { was: "die stille Erst-Anmeldung faellt auf ihren alten Kurztext zurueck",
    datei: "sbkim-init.js",
    regex: /      defaultDomainDescription: "(?:[^"\\]|\\.)*",/,
    ersatz: `      defaultDomainDescription: "Lebendiges SBKIM-Vokabular und Protokoll-Doku: Glossar, INTERFACES, ARCHITEKTUR, Karten, PULS.",` },
  { was: "das Semantik-Feld der SEITE laesst die Spore wieder gewinnen",
    datei: "index.html",
    alt: "    apply(fallback);",
    neu: "    window.SbkimSpore.getOwnSpore().then(function (sp) { apply(sp.domainDescription); });" },
];

let gefangen = 0, durch = 0;
console.log("\nGEGENPROBE — Sages Bedeutungs-Beschreibung\n");

const kopie = mkdtempSync(join(tmpdir(), "sage-gp-"));
try {
  mkdirSync(join(kopie, "assets"), { recursive: true });
  mkdirSync(join(kopie, "tests"), { recursive: true });
  cpSync(join(WURZEL, ZIEL), join(kopie, ZIEL));
  for (const f of MIT) cpSync(join(WURZEL, f), join(kopie, f));
  cpSync(join(WURZEL, "tests/smoke_sage_beschreibung.mjs"), join(kopie, "tests/smoke_sage_beschreibung.mjs"));

  const laeuft = () => {
    try { execFileSync(process.execPath, [join(kopie, "tests/smoke_sage_beschreibung.mjs")],
      { cwd: kopie, stdio: "pipe" }); return true; } catch { return false; }
  };

  /* ⚠ OHNE DIESE ZEILE MISST KEIN EINZIGER FALL ETWAS. Bei roter Ausgangslage
     gaebe jede Sabotage sich selbst recht. */
  const rein = readFileSync(join(WURZEL, ZIEL), "utf8");
  writeFileSync(join(kopie, ZIEL), rein, "utf8");
  if (!laeuft()) {
    console.log("⚠ ABBRUCH: die unversehrte Kopie ist schon ROT. Kein Fall misst etwas.\n");
    process.exit(2);
  }
  console.log("  ✓ unveraendert ist die Probe gruen\n");

  const roh = {};
  roh[ZIEL] = rein;
  for (const f of MIT) roh[f] = readFileSync(join(WURZEL, f), "utf8");

  for (const f of FAELLE) {
    const datei = f.datei || ZIEL;
    const basis = roh[datei];
    let neu;
    if (f.regex) {
      if (!f.regex.test(basis)) { console.log("  ⚠ ANKER NICHT GEFUNDEN — misst nichts: " + f.was); durch++; continue; }
      neu = basis.replace(f.regex, f.ersatz);
    } else {
      if (!basis.includes(f.alt)) { console.log("  ⚠ ANKER NICHT GEFUNDEN — misst nichts: " + f.was); durch++; continue; }
      neu = basis.replace(f.alt, f.neu);
    }
    if (neu === basis) { console.log("  ⚠ OHNE WIRKUNG — misst nichts: " + f.was); durch++; continue; }
    writeFileSync(join(kopie, datei), neu, "utf8");
    if (laeuft()) { console.log("  ✗ NICHT GEFANGEN: " + f.was); durch++; }
    else { console.log("  ✓ gefangen: " + f.was); gefangen++; }
    writeFileSync(join(kopie, datei), basis, "utf8");   // sonst reicht ein Fall in den nächsten
  }
} finally { rmSync(kopie, { recursive: true, force: true }); }

console.log(`\n— ${gefangen} gefangen, ${durch} durchgerutscht —\n`);
process.exit(durch > 0 ? 1 : 0);
