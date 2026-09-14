/* tests/manual_check.html — laufen die Inline-Skripte überhaupt? (2026-09-14)
 *   node tests/smoke_manual_check_syntax.mjs
 *
 * WARUM ES DIESE PROBE GIBT. CLAUDE.md § Pflicht am Sitzungsende verlangt seit
 * jeher, nach einer Code-Änderung zu prüfen, dass `tests/manual_check.html` im
 * Browser noch läuft. Am 2026-09-14 habe ich das getan — und dabei gefunden,
 * dass Panel 23 seit dem **2026-09-03** gar nicht lief:
 *
 *     hinweis: "Jetzt „👥 discover" drücken."
 *
 * Die deutschen Anführungszeichen sind ein PAAR aus zwei VERSCHIEDENEN Zeichen
 * — „ öffnet (U+201E), “ schliesst (U+201C). Hier stand hinten ein GERADES
 * Anführungszeichen, und das beendet die JS-Zeichenkette. Der ganze
 * `<script>`-Block fiel mit einem Syntaxfehler aus; im Browser stand das Panel
 * einfach tot da. Zweimal in derselben Datei, elf Tage lang, von niemandem
 * bemerkt.
 *
 * ⚠ DAS IST DIESELBE FAMILIE wie `\n` statt einer echten Zeile und wie `$` mit
 * m-Flag: ein Zeichen, das der Schreibende als Text meint und der Parser als
 * Syntax liest. Man sieht es nicht — man misst es.
 *
 * ⚠ UND SIE PRÜFT NUR DIE SYNTAX. Ob die Panels im Browser das Richtige TUN,
 * sieht nur Klaus. Eine Datei, die sich parsen lässt, ist nicht eine Datei, die
 * funktioniert — sie ist bloss eine, die überhaupt anfängt zu laufen.
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { tmpdir } from "node:os";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATEI = resolve(wurzel, "tests/manual_check.html");
let pass = 0, fail = 0;
const ok = (b, m, d = "") => { if (b) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m, d ? "— " + d : ""); } };

console.log("manual_check.html — Inline-Skripte");

const src = readFileSync(DATEI, "utf8");
/* Nur Blöcke OHNE src: die geladenen Module prüfen ihre eigenen Proben. */
const bloecke = [...src.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
ok(bloecke.length > 15, `die Datei trägt Inline-Skripte (${bloecke.length} Blöcke)`);

const arbeit = mkdtempSync(join(tmpdir(), "manual-check-"));
/* Gemessen wird mit `node --check` in einem eigenen Prozess, nicht mit
 * `new Function`: der Parser ist derselbe, aber die Fehlermeldung nennt Zeile
 * und Spalte — und genau die braucht, wer es reparieren soll. */
function pruefe(code) {
  const f = join(arbeit, "b.js");
  writeFileSync(f, code);
  try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); return null; }
  catch (e) { return String(e.stderr || e.message).split("\n").slice(0, 3).join(" "); }
}

try {
  const kaputt = [];
  bloecke.forEach((m, i) => {
    const fehler = pruefe(m[1]);
    if (fehler) {
      const zeile = src.slice(0, m.index).split("\n").length;
      kaputt.push(`Block ${i + 1} ab Zeile ${zeile}: ${fehler.slice(0, 90)}`);
    }
  });
  ok(kaputt.length === 0,
     `jeder Inline-Block ist syntaktisch lauffähig (${kaputt.length} kaputt)`,
     kaputt.slice(0, 2).join(" | "));

  /* DIE GEGENRICHTUNG, und ohne sie wäre die Prüfung oben ein grüner Haken:
   * erkennt sie einen kaputten Block überhaupt? Gebaut wird der ECHTE Fall vom
   * 2026-09-03 nach — ein deutsches Anführungszeichen-Paar, dessen zweite
   * Hälfte ein gerades ist. */
  const KAPUTT     = 'var x = "Jetzt \u201eDemo discover" dr\u00fccken.";';   // hinten ein GERADES "
  const BERICHTIGT = 'var x = "Jetzt \u201eDemo discover\u201c dr\u00fccken.";'; // hinten U+201C
  const stolpert = pruefe(KAPUTT);
  ok(stolpert !== null, "…und sie erkennt einen kaputten Block (Gegenrichtung)");
  const laeuft = pruefe(BERICHTIGT);
  ok(laeuft === null, "…und lässt den berichtigten durch", laeuft || "");

  /* Der Nagel auf das Zeichen selbst. Ein Wächter am Einzelfall ist morgen am
   * Nachbarn blind — hier wird die REGEL festgehalten, nicht die eine Zeile. */
  ok("„".charCodeAt(0) === 0x201e && "“".charCodeAt(0) === 0x201c,
     "das deutsche Paar ist „ (U+201E) auf “ (U+201C) — nie ein gerades \"");
} finally {
  rmSync(arbeit, { recursive: true, force: true });
}

console.log(`\nErgebnis: ${pass} bestanden, ${fail} fehlgeschlagen`);
process.exit(fail ? 1 : 0);
