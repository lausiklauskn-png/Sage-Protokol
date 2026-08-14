/* run_alle.mjs — lässt ALLE Smokes laufen und sagt ehrlich, was dabei herauskam.
 *
 * WARUM ES DAS GEBEN MUSS (Befund 2026-08-14): `smoke_bau23_0b_identitaet.mjs`
 * und `smoke_bau23c_ki_richter.mjs` waren rund zwei Monate TOT. Sie starben
 * beim Start mit einem TypeError, weil die Modul-23-UI ihren selbstgebauten
 * DOM-Ersatz überwachsen hatte — noch bevor die erste Prüfung dran war. Sie
 * sahen aus wie zwei Wächter und waren keine.
 *
 * Gemerkt hat es niemand, und das ist der eigentliche Punkt: Sage hat 69
 * einzelne Smoke-Dateien und NICHTS, was sie zusammen laufen lässt. Wer eine
 * Datei ändert, ruft die eine Probe, die er kennt. Eine Probe, die niemand
 * aufruft, kann beliebig lange kaputt sein.
 *
 * ── DREI ERGEBNISSE, NICHT ZWEI ─────────────────────────────────────────────
 *
 * Das Wichtigste an diesem Läufer ist die Unterscheidung zwischen „rot" und
 * „läuft hier gar nicht". In einem frischen Container sind ohne `npm install`
 * rund 19 Smokes rot — nicht, weil etwas kaputt wäre, sondern weil
 * `fake-indexeddb` fehlt (Sage hat keine `package.json`). Jede Sitzung, die
 * das nicht weiß, hält zwei Dutzend Fehlalarme für einen Scherbenhaufen und
 * sucht am falschen Ende.
 *
 *   ✓ grün         die Probe lief und war zufrieden
 *   ✗ ROT          die Probe lief und hat etwas gefunden  ← das zählt
 *   ⊘ nicht lauffähig   ein Paket fehlt (ERR_MODULE_NOT_FOUND)
 *
 * Nur ROT setzt den Rückgabewert auf 1. „Nicht lauffähig" wird gezählt und
 * benannt, aber nicht als Fehler ausgegeben — sonst wäre der Läufer in dieser
 * Umgebung dauerhaft rot und damit wertlos. Ehrlich heißt hier: sagen, was
 * ungeprüft blieb, statt es als geprüft zu verbuchen ODER als kaputt.
 *
 * Aufruf:
 *   node tests/run_alle.mjs           alle
 *   node tests/run_alle.mjs bau23     nur Dateien, deren Name das enthält
 */
import { readdirSync } from "node:fs";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HIER = dirname(fileURLToPath(import.meta.url));
const filter = process.argv[2] || "";
const FRIST = 120000;   // eine Probe, die zwei Minuten braucht, hängt

const dateien = readdirSync(HIER)
  .filter((f) => f.startsWith("smoke_") && f.endsWith(".mjs"))
  .filter((f) => !filter || f.includes(filter))
  .sort();

/* Ein fehlendes Paket ist keine gefundene Schwäche. Erkannt wird es am
   Node-Fehlercode, NICHT am Wortlaut der Meldung — Wortlaute ändern sich mit
   der Node-Fassung, Fehlercodes nicht. */
function fehltEinPaket(text) {
  return /ERR_MODULE_NOT_FOUND/.test(text) || /Cannot find package/.test(text);
}

function lauf(datei) {
  return new Promise((fertig) => {
    execFile("node", [join(HIER, datei)], { timeout: FRIST, maxBuffer: 8 * 1024 * 1024 },
      (fehler, aus, err) => {
        const text = String(aus || "") + String(err || "");
        if (!fehler) return fertig({ datei, art: "gruen" });
        if (fehltEinPaket(text)) {
          const paket = (/Cannot find package '([^']+)'/.exec(text) || [, "?"])[1];
          return fertig({ datei, art: "fehlt", grund: paket });
        }
        if (fehler.killed) return fertig({ datei, art: "rot", grund: "Frist von " + (FRIST / 1000) + " s überschritten" });
        // Die letzte nicht-leere Zeile trägt bei diesen Proben die Summe.
        const zeilen = text.trim().split("\n").filter((z) => z.trim());
        return fertig({ datei, art: "rot", grund: zeilen[zeilen.length - 1] || "ohne Ausgabe" });
      });
  });
}

const ergebnisse = [];
for (const d of dateien) ergebnisse.push(await lauf(d));

const gruen = ergebnisse.filter((e) => e.art === "gruen");
const rot = ergebnisse.filter((e) => e.art === "rot");
const fehlt = ergebnisse.filter((e) => e.art === "fehlt");

if (rot.length) {
  console.log("\nROT — hier hat eine Probe wirklich etwas gefunden:");
  for (const e of rot) console.log("  ✗ " + e.datei + "\n      " + e.grund);
}
if (fehlt.length) {
  const pakete = [...new Set(fehlt.map((e) => e.grund))].join(", ");
  console.log("\nNICHT LAUFFÄHIG — ungeprüft, nicht kaputt (" + pakete + " fehlt):");
  console.log("  " + fehlt.map((e) => e.datei.replace(/^smoke_|\.mjs$/g, "")).join(" · "));
  console.log("  Diese Proben sagen hier weder ja noch nein. Mit dem Paket laufen sie.");
}

console.log(
  "\n" + dateien.length + " Proben" + (filter ? " (Filter: " + filter + ")" : "") +
  " — " + gruen.length + " grün, " + rot.length + " rot, " + fehlt.length + " nicht lauffähig"
);
process.exit(rot.length ? 1 : 0);
