/* smoke_papers_verweise.mjs — in einem veröffentlichten Papier gibt es keinen
 * relativen Verweis.
 *
 * WARUM ES DIESE PROBE GIBT (2026-09-02, an einem Tag ZWEIMAL zugeschlagen).
 *
 * Erster Fall: die beiden Papers unter `docs/papers/` verwiesen auf
 * `index.html` und `sbkim-network.html`. Beide Dateien liegen in
 * `sbkim-demo/`, nicht hier. In der Demo-Fassung derselben Datei liefen genau
 * diese Zeilen — deshalb fiel es beim Schreiben nicht auf.
 *
 * Zweiter Fall, am selben Abend: repariert worden war das mit
 * `../../sbkim-demo/demo.html`. Im Depot stimmt das. Klaus hat das Papier dann
 * als EINZELNE Datei auf seinem Tablet geöffnet, auf „Live-Demo" gedrückt und
 * bekam FORBIDDEN: sein Betrachter löste den Verweis gegen den Dateipfad auf.
 *
 * DIE LEHRE DAHINTER, und sie ist allgemeiner als HTML:
 *
 *   Ein Verweis ist keine Eigenschaft des Textes.
 *   Er ist eine Eigenschaft des Textes AN SEINEM ORT.
 *
 * Ein veröffentlichtes Papier hat keinen festen Ort. Es wird
 * heruntergeladen, als PDF gedruckt, weitergeschickt, in einen Ordner gelegt.
 * Jeder relative Verweis darin ist eine Zeitbombe, die genau dann zündet, wenn
 * jemand Fremdes prüfen will, ob etwas dahintersteckt.
 *
 * Deshalb prüft diese Probe NICHT, ob eine Datei am Zielpfad liegt (das sagt
 * nur etwas über dieses Depot aus), sondern ob der Verweis überhaupt eine
 * Adresse ist, die von überall trägt.
 *
 * Lauf:  node tests/smoke_papers_verweise.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const ok = (c, m, d) => {
  if (c) pass++;
  else { fail++; console.log("  ✗ " + m + (d ? "\n       " + d : "")); }
};

/* Die Dateien, die als Papier hinausgehen. Wer hier eine ergänzt, trägt sie
   nach — eine Datei, die nicht in der Liste steht, wird nicht geprüft. */
const PAPIERE = [
  "docs/papers/sbkim-paper-de.html",
  "docs/papers/sbkim-paper-en.html",
];

/* Erlaubt sind: absolute Adressen (http/https), Sprungmarken in der Seite,
   Mail-Adressen und eingebettete Daten. Alles andere ist ortsabhängig. */
const ERLAUBT = /^(https?:\/\/|#|mailto:|data:)/i;

for (const rel of PAPIERE) {
  let roh;
  try {
    roh = readFileSync(join(ROOT, rel), "utf8");
  } catch (e) {
    ok(false, rel + " ist nicht lesbar", e.message);
    continue;
  }

  const ziele = [];
  for (const m of roh.matchAll(/\b(?:href|src)\s*=\s*"([^"]*)"/gi)) ziele.push(m[1].trim());

  ok(ziele.length > 0, rel + ": es wurden überhaupt Verweise gefunden");

  const ortsabhaengig = ziele.filter((z) => z && !ERLAUBT.test(z));
  ok(
    ortsabhaengig.length === 0,
    rel + ": jeder Verweis trägt auch außerhalb des Depots",
    ortsabhaengig.length
      ? "ortsabhängig: " + ortsabhaengig.join(" · ") +
        "\n       Ein veröffentlichtes Papier hat keinen festen Ort. Absolute Adresse nehmen."
      : "",
  );

  /* Die Gegenprobe zur Gegenprobe: eine Datei ohne jeden Verweis würde die
     Prüfung oben mühelos bestehen und nichts messen. Die Papers tragen
     mindestens den Verweis auf das Protokoll-Depot. */
  const sachlich = ziele.filter(
    (z) => /^https?:\/\//i.test(z) && !/fonts\.(googleapis|gstatic)/i.test(z),
  );
  ok(sachlich.length > 0,
     rel + ": es steht mindestens ein echter Sach-Verweis darin (nicht nur die Schriftart)");

  /* KEIN target="_blank" (Befund 2026-09-02, abends).
     Nachdem die Adressen absolut waren, tat ein Klick aus Klaus' Datei-Betrachter
     heraus GAR NICHTS — ohne Fehlermeldung. Getippt funktionierten dieselben
     Adressen. Ursache: ein eingebetteter Betrachter ohne Popup-Erlaubnis
     verschluckt `target="_blank"` stillschweigend.

     Ein Papier wird in unbekannten Betrachtern gelesen: Vorschau-Fenster,
     Mail-Programme, PDF-Anzeigen, eingebettete Rahmen. Ein Verweis, der eine
     Popup-Erlaubnis BRAUCHT, ist dort ein toter Knopf. Ohne das Attribut
     navigiert er an Ort und Stelle, und der Zurück-Knopf bringt einen wieder
     her. Das geht überall. */
  ok(!/target\s*=\s*"_blank"/i.test(roh),
     rel + ': kein target="_blank" — sonst schluckt ein eingebetteter Betrachter den Klick');

  /* Jede Adresse muss auch LESBAR dastehen, nicht nur anklickbar.
     Ein Papier wird gedruckt und als PDF weitergegeben. Wer es auf Papier vor
     sich hat, kann nichts anklicken. Steht die Adresse nur im href und der
     Knopf heißt "Live-Demo →", ist sie für diesen Leser verloren. */
  const text = roh
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const unsichtbar = [...new Set(sachlich)].filter(
    (z) => !text.includes(z.replace(/^https?:\/\//i, "")),
  );
  ok(unsichtbar.length === 0,
     rel + ": jede Adresse steht auch als lesbarer Text da, nicht nur im Verweis",
     unsichtbar.length
       ? "nur anklickbar: " + unsichtbar.join(" · ") +
         "\n       Auf Papier kann niemand klicken."
       : "");
  /* Der Titel muss das Kürzel AUFLÖSEN, und Kopf und Überschrift müssen
     dasselbe sagen (Befund 2026-09-02, kurz vor dem DOI).

     Die <h1> im Text war richtig — "Semantisches Bidirektionales KI-Matching".
     Der <title>-Tag war es nicht: dort fehlte "KI-", weil die Berichtigung des
     Namens an der <h1> ansetzte und der Zeilenumbruch <br> die Stelle im Kopf
     verdeckte. Im englischen Papier fehlte "AI" in BEIDEN.

     Warum das teurer ist, als es aussieht: der <title> ist das, was der
     Browser-Reiter zeigt, was eine Suchmaschine übernimmt und was jeder in ein
     Formular kopiert. Wäre er so in den DOI gegangen, stünde eine Auflösung des
     Kürzels dauerhaft und unveränderlich da, die das Kürzel nicht ergibt.

     Bewacht wird die AUSSAGE (der Titel löst das Kürzel auf), nicht der
     Wortlaut — sonst verbietet der Wächter die nächste Titel-Änderung. */
  const istEn = /-en\.html$/.test(rel);
  const kuerzelWort = istEn ? "AI Matching" : "KI-Matching";
  const titelTag = (roh.match(/<title>([\s\S]*?)<\/title>/i) || [, ""])[1];
  const h1 = (roh.match(/<h1[^>]*class="paper-title"[^>]*>([\s\S]*?)<\/h1>/i) || [, ""])[1]
    .replace(/<[^>]+>/g, " ");
  const glatt = (t) => t.replace(/\s+/g, " ").trim();

  ok(glatt(titelTag).includes(kuerzelWort),
     rel + `: der <title> löst das Kürzel auf ("${kuerzelWort}")`,
     glatt(titelTag).includes(kuerzelWort) ? "" : "steht da: " + glatt(titelTag));
  ok(glatt(h1).includes(kuerzelWort),
     rel + `: die Überschrift löst das Kürzel auf ("${kuerzelWort}")`,
     glatt(h1).includes(kuerzelWort) ? "" : "steht da: " + glatt(h1));
  ok(glatt(titelTag) === glatt(h1),
     rel + ": <title> und Überschrift sagen dasselbe",
     glatt(titelTag) === glatt(h1)
       ? ""
       : "Kopf:        " + glatt(titelTag) + "\n       Überschrift: " + glatt(h1));
}

console.log(`\nPapier-Verweise: ${pass} bestanden, ${fail} fehlgeschlagen.`);
process.exit(fail > 0 ? 1 : 0);
