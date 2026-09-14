/* Waechter fuer tools/kanon-verteilen.mjs (Klaus 2026-09-14).
 *   node tests/smoke_kanon_verteilen.mjs
 *
 * WARUM ES DIESE PROBE GIBT. Das Werkzeug schreibt in ZWANZIG fremde Repos.
 * Ein Fehler darin ist keine rote Zeile, sondern zwanzig kaputte Apps — und
 * beim Bauen hat die erste Fassung wirklich `siegel-inhalt.js` mitverteilt,
 * also die komplette App-Identitaet ueberschrieben. Gefunden hat das nicht das
 * Nachdenken, sondern ein Blick in den Diff zweier Repos.
 *
 * ⚠ SIE FAEHRT DAS WERKZEUG WIRKLICH, an einem Wegwerf-Baum. Ein Waechter, der
 * den Quelltext LIEST, misst nicht, ob er LAEUFT — dieselbe Lehre wie bei
 * Abschnitt 4b der Sprach-Probe, an einer anderen Tuer.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const ok = (b, m, d = "") => { if (b) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m, d ? "— " + d : ""); } };

const werkzeug = join(wurzel, "tools", "kanon-verteilen.mjs");

/* ── Ein Wegwerf-Netz: ein Sage, drei Nachbarn ────────────────────────── */
function netzBauen() {
  const w = mkdtempSync(join(tmpdir(), "kanon-"));
  const sage = join(w, "Sage-Protokol");
  mkdirSync(join(sage, "src", "modules"), { recursive: true });
  mkdirSync(join(sage, "tools"), { recursive: true });
  mkdirSync(join(sage, "assets"), { recursive: true });
  writeFileSync(join(sage, "tools", "kanon-verteilen.mjs"), readFileSync(werkzeug));

  const modul = (nr, inhalt) =>
    `/*\n * SBKIM — Modul ${nr} — Probe\n */\n${inhalt}\n`;
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var NEU = 2;"));
  writeFileSync(join(sage, "src/modules/17_floating_widget.js"), modul(17, "var X = 1;"));
  /* ⚠ MODUL 20 SCHREIBT EINEN DOPPELPUNKT statt des Gedankenstrichs. Ohne ein
   * solches Modul im Wegwerf-Netz misst die Probe die Muster-Breite NICHT —
   * beim ersten Gegenprobe-Lauf am 2026-09-14 genau so durchgerutscht. */
  writeFileSync(join(sage, "src/modules/20_schluessel_safe.js"),
    `/*\n * SBKIM — Modul 20: Schluessel-Safe\n */\nvar S = 2;\n`);
  /* ⚠ DIE IDENTITAETS-DATEI LIEGT IM KANON-PFAD. Sie gehoert dort NICHT hin —
   * genau deshalb steht sie hier: nur so kommt die Sperrliste ueberhaupt an die
   * Reihe. Lag sie (wie in Sage) unter assets/, waere sie schon durch den
   * Lese-Pfad ausgeschlossen, und der Riegel waere von seinem Fehlen nicht zu
   * unterscheiden. */
  writeFileSync(join(sage, "src/modules/siegel-inhalt.js"),
    `/*\n * SBKIM — Modul 99 — Klebstoff\n */\nvar WIZ = { nodeName: "Sage", domainDescription: "Sages Beschreibung" };\n`);

  const app = (name, dateien) => {
    const p = join(w, name);
    for (const [rel, inhalt] of Object.entries(dateien)) {
      mkdirSync(join(p, dirname(rel)), { recursive: true });
      writeFileSync(join(p, rel), inhalt);
    }
    mkdirSync(join(p, ".git"), { recursive: true });
    return p;
  };

  /* App 1: traegt Modul 16 unter EIGENEM Dateinamen und haengt zurueck. */
  app("App-Eins", {
    "modules/sbkim-siegel.js": modul(16, "var ALT = 1;"),
    "modules/20_schluessel_safe.js": `/*\n * SBKIM — Modul 20: Schluessel-Safe\n */\nvar S = 1;\n`,
    /* ⚠ MIT MARKE. Ohne sie kaeme der zweite Riegel nie an die Reihe, und ein
     * Fall darauf waere immer „nicht gefangen" — so geschehen beim ersten
     * Gegenprobe-Lauf. */
    "assets/siegel-inhalt.js":
      `/*\n * SBKIM — Modul 99 — Klebstoff\n */\nvar WIZ = { nodeName: "App Eins", domainDescription: "Eigene Beschreibung" };\n`,
    "sw.js": `var CACHE_VERSION = "app-eins-v7";\nvar CORE = ["modules/sbkim-siegel.js"];\n`,
    /* ⚠ EIN ZWEITER WORKER, in dessen Vorrat die Datei NICHT steht. Ohne ihn
     * aendert ein ausgebauter Vorrat-Riegel nichts, und der Fall misst nichts. */
    "extra-sw.js": `var CACHE_VERSION = "extra-v3";\nvar CORE = ["index.html"];\n`,
  });
  /* App 2: schon gleich — darf NICHT angefasst werden. */
  app("App-Zwei", { "sbkim/16_siegel.js": modul(16, "var NEU = 2;") });
  /* App 3: drei Dateien mit aehnlichem Namen, nur EINE ist die Kopie. */
  app("App-Drei", {
    "web/16_siegel.js": modul(16, "var ALT = 1;"),                       // Kopie (Marke)
    "assets/sbkim-siegel.js": "/* Loader, keine Marke */\nvar L = 1;\n",  // kein Kanon
    "sandbox/16_siegel.js": "/* Fassung des Modells, keine Marke */\nvar M = 1;\n",
  });
  return { w, sage };
}

function lauf(sage, w, extra = []) {
  try {
    return { text: execFileSync("node", [join(sage, "tools", "kanon-verteilen.mjs"),
      "--nachbarn", w, ...extra], { encoding: "utf8" }), code: 0 };
  } catch (e) { return { text: String(e.stdout || "") + String(e.stderr || ""), code: e.status }; }
}

/* ══ 1. Nur nachsehen ═══════════════════════════════════════════════════ */
console.log("Nur nachsehen:");
{
  const { w, sage } = netzBauen();
  const r = lauf(sage, w);
  ok(/App-Eins/.test(r.text), "findet die Kopie unter FREMDEM Dateinamen (App-Eins)");
  ok(/App-Drei/.test(r.text), "findet die Kopie in App-Drei");
  ok(!/App-Zwei/.test(r.text), "eine schon gleiche Kopie wird NICHT gemeldet (App-Zwei)");
  ok(r.code === 1, "Rueckgabewert 1, solange etwas zurueckhaengt", `war ${r.code}`);

  /* ⚠ DER WICHTIGSTE WAECHTER. Traefe das Werkzeug den Loader oder die
   * Modell-Fassung, saehe niemand es — beide sehen aus wie das Siegel. */
  ok(!/assets\/sbkim-siegel/.test(r.text), "der LOADER (ohne Marke) wird nicht angefasst");
  ok(!/sandbox/.test(r.text), "die Fassung des MODELLS (ohne Marke) wird nicht angefasst");
  ok(/web\/16_siegel\.js/.test(r.text), "…aber die echte Kopie mit Marke schon");

  /* Nur nachsehen heisst: NICHTS wird geschrieben. */
  const nachher = readFileSync(join(w, "App-Eins", "modules/sbkim-siegel.js"), "utf8");
  ok(/ALT = 1/.test(nachher), "ohne --schreiben bleibt die Datei unberuehrt");
  rmSync(w, { recursive: true, force: true });
}

/* ══ 2. Schreiben ═══════════════════════════════════════════════════════ */
console.log("\nMit --schreiben:");
{
  const { w, sage } = netzBauen();
  const r = lauf(sage, w, ["--schreiben"]);
  ok(r.code === 0, "Rueckgabewert 0 nach dem Schreiben", `war ${r.code}`);

  const eins = readFileSync(join(w, "App-Eins", "modules/sbkim-siegel.js"), "utf8");
  ok(/NEU = 2/.test(eins), "die zurueckhaengende Kopie traegt jetzt den Kanon");

  const drei = readFileSync(join(w, "App-Drei", "web/16_siegel.js"), "utf8");
  ok(/NEU = 2/.test(drei), "…auch die in App-Drei");

  /* ⚠⚠ DER RIEGEL, DER BEIM BAUEN GEFEHLT HAT. `siegel-inhalt.js` traegt die
   * komplette App-Identitaet (nodeName, domainDescription, domainKeywords).
   * Ein Ueberschreiben gaebe JEDER App Sages Namen und Sages Bedeutungs-Vektor
   * — der Schaden vom 2026-08-16 in Alis Moderaum, nur zwanzigfach. */
  const wiz = readFileSync(join(w, "App-Eins", "assets/siegel-inhalt.js"), "utf8");
  ok(/App Eins/.test(wiz) && /Eigene Beschreibung/.test(wiz),
     "die APP-IDENTITAET (siegel-inhalt.js) bleibt unberuehrt");
  ok(!/Sages Beschreibung/.test(wiz),
     "…und traegt KEINE fremde Beschreibung");

  const loader = readFileSync(join(w, "App-Drei", "assets/sbkim-siegel.js"), "utf8");
  ok(/Loader/.test(loader), "der Loader bleibt unberuehrt");

  /* Cache-Bump nur, wo die Datei im Vorrat steht. */
  const sw = readFileSync(join(w, "App-Eins", "sw.js"), "utf8");
  ok(/app-eins-v8/.test(sw), "CACHE_VERSION wurde erhoeht (v7 → v8)", sw.slice(0, 60));

  /* ⚠ UND DER WORKER, DER DIE DATEI NICHT FUEHRT, BLEIBT STEHEN. Ein Bump
   * ohne Vorrat-Pruefung zwaenge jedem Nutzer einen Download auf, obwohl sich
   * in DIESEM Vorrat nichts geaendert hat. */
  const extra = readFileSync(join(w, "App-Eins", "extra-sw.js"), "utf8");
  ok(/extra-v3/.test(extra),
     "ein Worker OHNE die Datei im Vorrat wird NICHT gebumpt", extra.slice(0, 40));

  /* ⚠ MODUL 20 TRAEGT EINEN DOPPELPUNKT statt des Gedankenstrichs. Wer das
   * Muster darauf verengt,
   * verliert es still — kein Fehler, nur eine Datei weniger verteilt. */
  const m20 = readFileSync(join(w, "App-Eins", "modules/20_schluessel_safe.js"), "utf8");
  ok(/S = 2/.test(m20),
     "auch die Marke mit Doppelpunkt (Modul 20) wird erkannt und nachgezogen");
  rmSync(w, { recursive: true, force: true });
}

/* ══ 3. Zweiter Lauf: einmal gleich, bleibt gleich ══════════════════════ */
console.log("\nEinmal gleich, bleibt gleich:");
{
  const { w, sage } = netzBauen();
  lauf(sage, w, ["--schreiben"]);
  const swNach1 = readFileSync(join(w, "App-Eins", "sw.js"), "utf8");
  const r2 = lauf(sage, w);
  ok(r2.code === 0, "der zweite Lauf meldet nichts mehr (Rueckgabewert 0)", `war ${r2.code}`);
  ok(/0 haengen zurueck/.test(r2.text), "…und zaehlt null Rueckstaende");

  /* ⚠ KEIN BUMP OHNE AENDERUNG. Ein Automat, der bei jedem Lauf die
   * CACHE_VERSION hochzaehlt, zwingt jedem Nutzer bei jedem Lauf einen neuen
   * Download auf — und der Zaehler waere bald dreistellig, ohne dass sich je
   * etwas geaendert haette. */
  lauf(sage, w, ["--schreiben"]);
  ok(readFileSync(join(w, "App-Eins", "sw.js"), "utf8") === swNach1,
     "ein zweites --schreiben bumpt NICHT noch einmal");
  rmSync(w, { recursive: true, force: true });
}

console.log(`\nErgebnis: ${pass} bestanden, ${fail} fehlgeschlagen`);
process.exit(fail ? 1 : 0);
