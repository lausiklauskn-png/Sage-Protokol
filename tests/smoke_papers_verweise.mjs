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
  ok(
    ziele.some((z) => /^https?:\/\//i.test(z) && !/fonts\.googleapis/i.test(z)),
    rel + ": es steht mindestens ein echter Sach-Verweis darin (nicht nur die Schriftart)",
  );
}

console.log(`\nPapier-Verweise: ${pass} bestanden, ${fail} fehlgeschlagen.`);
process.exit(fail > 0 ? 1 : 0);
