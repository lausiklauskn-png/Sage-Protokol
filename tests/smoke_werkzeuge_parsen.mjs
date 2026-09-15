/*
 * Probe: JEDES Werkzeug und JEDE Probe laesst sich ueberhaupt parsen.
 *
 * ── WARUM ES DIESE PROBE GIBT (Befund 2026-09-15) ───────────────────────────
 *
 * `tools/wizard-trennen.mjs` lag seit dem 2026-09-14 auf `main` und liess sich
 * NICHT parsen — ein Kommentarblock war mitten im Satz geschlossen. Es war in
 * genau dem Commit kaputt, der es angelegt hat: gelaufen ist es aus einer
 * Arbeitskopie, der Kommentar kam danach dazu, und niemand hat es noch einmal
 * aufgerufen.
 *
 * ⚠ DAS IST DIE STILLSTE SORTE. Ein Werkzeug, das nicht parst, meldet sich
 * nicht — es wird ja nicht aufgerufen. Sein Schaden ist laengst verteilt, und
 * der naechste, der es braucht, haelt das Depot fuer kaputt.
 *
 * `node --check` kostet Millisekunden. Es beantwortet EINE Frage, und nur die:
 * laesst sich die Datei lesen. Ob sie das Richtige TUT, misst sie nicht — dafuer
 * gibt es die Proben daneben.
 *
 * Lauf: node tests/smoke_werkzeuge_parsen.mjs
 */
import { readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");

let gruen = 0, rot = 0;
const ok = (was, bedingung, hinweis) => {
  if (bedingung) { gruen++; console.log(`  ✓ ${was}`); }
  else { rot++; console.log(`  ✗ ROT — ${was}${hinweis ? "\n      " + hinweis : ""}`); }
};

console.log("\n── Jedes Werkzeug und jede Probe laesst sich parsen ──\n");

/* Gesammelt wird, was Node wirklich ausfuehren wuerde: .mjs und .js unter
   tools/ und tests/. `.sh`, `.py` und `.html` gehoeren anderen Lesern. */
function dateien(ordner) {
  const p = join(WURZEL, ordner);
  if (!existsSync(p)) return [];
  return readdirSync(p, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(mjs|js|cjs)$/.test(e.name))
    .map((e) => join(p, e.name));
}

const alle = [...dateien("tools"), ...dateien("tests")];

/* ⚠ EINE LEERE LISTE IST KEINE BESTANDENE PRUEFUNG. Faende die Sammlung nichts
   — falscher Pfad, umbenannter Ordner —, liefe die Schleife darunter null Mal
   und die Probe waere grün, ohne eine Datei angesehen zu haben. */
ok(`es gibt Werkzeuge und Proben zu pruefen (${alle.length})`, alle.length >= 20);

const kaputt = [];
for (const d of alle) {
  try {
    execFileSync(process.execPath, ["--check", d], { stdio: "pipe" });
  } catch (e) {
    const zeile = String(e.stderr || e.message).split("\n").filter(Boolean).slice(0, 3).join(" | ");
    kaputt.push({ d: relative(WURZEL, d), zeile });
  }
}

ok("keine Datei bricht beim Parsen ab",
  kaputt.length === 0,
  kaputt.map((k) => `${k.d}\n        ${k.zeile}`).join("\n      "));

/* Die Gegenrichtung: die Prueferei muss einen Fehler auch WIRKLICH sehen.
   Ohne sie waere „0 kaputt" auch dann grün, wenn `--check` gar nicht liefe. */
let merktEsWirklich = false;
try {
  execFileSync(process.execPath, ["--check", join(WURZEL, "tests", "__gibtesnicht__.mjs")], { stdio: "pipe" });
} catch { merktEsWirklich = true; }
ok("… und die Pruefung merkt es, wenn eine Datei nicht lesbar ist", merktEsWirklich);

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
process.exit(rot > 0 ? 1 : 0);
