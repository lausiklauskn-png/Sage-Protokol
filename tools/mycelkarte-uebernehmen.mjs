#!/usr/bin/env node
/* mycelkarte-uebernehmen.mjs — holt `mycel-karte/index.html` aus dem
 * eigenstaendigen Repo herueber und legt GENAU DIE VIER Abweichungen darauf.
 *
 * ANLASS (2026-09-10, Klaus): „und die sage-Mycel karte hat nicht die selben
 * funktionen wie die PWA App." Gemessen, bevor gebaut wurde:
 *
 *     Ein Tipp auf eine Pille      Kopie:0  PWA:1
 *     Doppeltipp auf eine Pille    Kopie:2  PWA:0
 *     btnReplay                    Kopie:0  PWA:6
 *     kkRaum                       Kopie:0  PWA:2
 *
 * Die Kopie hing zwei Baustufen zurueck: kein Einzeltipp, keine Wiedergabe,
 * keine Knoten-Karte. Nichts schlug fehl — sie zeigte nur weniger. Genau die
 * Sorte Fehler, die `tests/smoke_mycelkarte_kopie.mjs` fangen soll und die
 * hier zum ZWEITEN Mal aufgetreten ist (das erste Mal am 2026-08-11).
 *
 * ⚠ EINE REGEL, AN DIE MAN SICH ERINNERN MUSS, IST KEINE. Beim ersten Mal
 * stand als Lehre daneben „wer eine Funktion baut, zieht die Kopie nach". Sie
 * hat nicht gereicht. Deshalb steht hier ein Werkzeug: ein Aufruf, und die
 * Kopie ist wieder die Kopie.
 *
 * Aufruf:
 *     node tools/mycelkarte-uebernehmen.mjs [pfad-zum-repo]     # nur nachsehen
 *     node tools/mycelkarte-uebernehmen.mjs --schreiben [pfad]  # wirklich holen
 *
 * Vorgabe fuer den Pfad: ../mycel-karte
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const schreiben = args.includes("--schreiben");
const quellRepo = resolve(wurzel, args.find((a) => !a.startsWith("--")) || "../mycel-karte");
const quelle = resolve(quellRepo, "index.html");
const ziel = resolve(wurzel, "mycel-karte/index.html");

if (!existsSync(quelle)) {
  console.error("✗ Die Quelle liegt nicht da: " + quelle);
  console.error("  Erwartet wird ein Klon von lausiklauskn-png/mycel-karte daneben.");
  process.exit(2);
}

/* Der Kopf, der die Kopie als Kopie ausweist. Er steht VOR dem
   FP-COPYRIGHT-Block der Quelle, nicht an dessen Stelle — das Urheberrecht
   gehoert zum Original und reist mit. */
const KOPF = `<!DOCTYPE html>
<!-- Sage-Protokol · Mycel-Live-Karte — UEBERNOMMEN aus dem eigenstaendigen Repo
     \`lausiklauskn-png/mycel-karte\`.

     ⚠ NICHT VON HAND BEARBEITEN. Diese Datei wird ABGELEITET:

         node tools/mycelkarte-uebernehmen.mjs --schreiben

     Eine Handarbeit neben einem Ableiter ist eine zweite Fassung, die
     auseinanderlaeuft — und genau das ist hier zweimal passiert (2026-08-11
     und 2026-09-10). Neue Funktionen gehoeren ins Repo \`mycel-karte\` und
     kommen von dort herueber.

     ABWEICHUNGEN von der Standalone-Fassung — und NUR diese vier:
       1. Titel nennt Sage-Protokol
       2. Kopfzeile nennt Sage-Protokol
       3. Rueck-Link zeigt auf ../index.html (Sage-Page) statt nach aussen
       4. kein Manifest, keine Service-Worker-Anmeldung — diese Fassung ist
          eingebettet und keine eigene PWA (die Dateien liegen hier nicht)

     \`tests/smoke_mycelkarte_kopie.mjs\` misst beides: dass die tragenden
     Faehigkeiten da sind UND dass die vier Abweichungen stimmen.
-->
`;

/* Jede Abweichung ist EIN benannter Eingriff mit eindeutigem Anker. Findet
   einer seinen Anker nicht, bricht das Werkzeug ab — eine stille Auslassung
   waere eine Kopie, die etwas anderes ist, als ihr Kopf behauptet. */
const ABWEICHUNGEN = [
  { name: "1 · Titel",
    von: "<title>Mycel-Karte</title>",
    nach: "<title>Mycel-Live-Karte · Sage-Protokol</title>" },

  { name: "2 · Kopfzeile",
    von: '<h1>🍄 Mycel-Karte<span class="sub">lebende Netz-Karte · reine Anzeige, Empfangsmodus</span></h1>',
    nach: '<h1>🍄 Mycel-Live-Karte<span class="sub">Sage-Protokol · reine Anzeige, Empfangsmodus</span></h1>' },

  { name: "3 · Rueck-Link",
    von: '<a class="back" href="https://lausiklauskn-png.github.io/Sage-Protokol/" target="_blank" rel="noopener">Sage-Page ↗</a>',
    nach: '<a class="back" href="../index.html">← Sage-Page</a>' },

  { name: "4a · kein Manifest",
    von: '<link rel="manifest" href="manifest.webmanifest">\n',
    nach: "" },

  { name: "4b · keine Service-Worker-Anmeldung",
    von: `// ---------- PWA: Service-Worker (relativer Pfad = umbenennungs-sicher) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").catch(function () {
      /* fail-soft: Karte laeuft auch ohne SW, nur nicht offline */
    });
  });
}
`,
    nach: `/* ⚠ HIER STEHT KEINE SERVICE-WORKER-ANMELDUNG, und das ist Abweichung 4.
   Diese Fassung ist in die Sage-Seite eingebettet und keine eigene PWA; ein
   Worker unter dieser Adresse wuerde die Vorraete der Sage-Seite anfassen.
   Die eigenstaendige Fassung im Repo \`mycel-karte\` hat ihn. */
` }
];

let text = readFileSync(quelle, "utf8");
const alt = existsSync(ziel) ? readFileSync(ziel, "utf8") : "";

/* Der eigene Kopf der Quelle beginnt mit <!DOCTYPE html>; er wird durch den
   Kopf der Kopie ersetzt, der Rest bleibt woertlich. */
if (!text.startsWith("<!DOCTYPE html>\n")) {
  console.error("✗ Die Quelle faengt nicht mit <!DOCTYPE html> an — Abbruch.");
  process.exit(2);
}
text = KOPF + text.slice("<!DOCTYPE html>\n".length);

let gefehlt = 0;
for (const a of ABWEICHUNGEN) {
  const treffer = text.split(a.von).length - 1;
  if (treffer !== 1) {
    console.error(`✗ ${a.name}: Anker ${treffer === 0 ? "nicht gefunden" : treffer + "-mal gefunden"} — Abbruch.`);
    gefehlt++;
    continue;
  }
  text = text.replace(a.von, a.nach);
  console.log(`  ✓ ${a.name}`);
}
if (gefehlt) {
  console.error("\nEs wurde NICHTS geschrieben. Ein Anker ist verrutscht;");
  console.error("er gehoert in diesem Werkzeug nachgezogen, nicht umgangen.");
  process.exit(2);
}

if (text === alt) {
  console.log("\n= Die Kopie ist bereits die Kopie. Nichts zu tun.");
  process.exit(0);
}

if (!schreiben) {
  console.log("\n⚠ Die Kopie weicht ab (" + alt.length + " → " + text.length + " Zeichen).");
  console.log("  Mit --schreiben wird sie nachgezogen.");
  process.exit(1);
}

writeFileSync(ziel, text);
console.log("\n✓ mycel-karte/index.html nachgezogen (" + text.length + " Zeichen).");
