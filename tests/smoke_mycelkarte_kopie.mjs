/* smoke_mycelkarte_kopie.mjs — die eingebettete Mycel-Karte darf nicht
 * zurueckfallen.
 *
 * ANLASS (2026-08-11, Klaus): `mycel-karte/index.html` ist eine KOPIE aus dem
 * eigenstaendigen Repo `lausiklauskn-png/mycel-karte`. Sie war seit dem
 * 2026-07-08 nicht nachgezogen und lief still auf altem Stand: EIN fest
 * verdrahtetes Relais, keine Relais-Wahl, kein Doppeltipp. Nichts schlug fehl
 * — sie zeigte nur weniger. Kopien verrotten lautlos; deshalb dieser Waechter.
 *
 * Er prueft NICHT byte-Gleichheit (die Sage-Fassung hat vier bewusste
 * Abweichungen), sondern dass die tragenden Faehigkeiten da sind UND die vier
 * Abweichungen stimmen.
 *
 * Lauf: node tests/smoke_mycelkarte_kopie.mjs   (braucht nichts weiter)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(wurzel, "mycel-karte/index.html"), "utf8");

let bestanden = 0, gefallen = 0;
const pruef = (ok, text) => {
  if (ok) { bestanden++; console.log("  ✓ " + text); }
  else { gefallen++; console.log("  ✗ " + text); }
};

console.log("\n── Eingebettete Mycel-Karte ──");

/* --- Faehigkeiten, die aus dem Original mitkommen muessen --------------- */
pruef(/var RELAY_POOL = \[/.test(html) && !/var RELAY_URL =/.test(html),
  "mehrere Relais statt einer fest verdrahteten Adresse");
const pool = [...(/var RELAY_POOL = \[([\s\S]*?)\];/.exec(html)?.[1] || "")
  .matchAll(/"(wss:\/\/[^"]+)"/g)].map((m) => m[1]);
pruef(pool.length >= 5, `${pool.length} Relais im Pool`);
pruef(pool[0] === "wss://relay.family-projekt.de" && pool[1] === "wss://relay.pwa-toolpoint.de",
  "die beiden eigenen Relais stehen vorn");
pruef(/function schonGesehen/.test(html),
  "Doppel-Filter da (dasselbe Ereignis über mehrere Relais zählt einmal)");
pruef(/function relayPills/.test(html) && /id="relayPills"/.test(html),
  "Relais-Pillen zum An-/Abschalten");
pruef(/function knotenKarteOeffnen/.test(html) && /id="knotenKarte"/.test(html),
  "Doppeltipp öffnet die Knoten-Karte");
pruef(/var getippt = \([^;]*dx[^;]*dy[^;]*\)\s*<\s*\d+/.test(html),
  "Tipp und Zug getrennt (echte Rechnung, nicht nur das Wort)");
pruef(/var ADRESSBUCH = \{/.test(html), "Adressbuch für die App-Knöpfe");
pruef(!/Mycel-Apps öffnen \(nebeneinander\)/.test(html),
  "die alte feste Sechser-Knopfreihe ist raus");

/* --- Die VIER erlaubten Abweichungen — und nur die -------------------- */
pruef(/<title>Mycel-Live-Karte · Sage-Protokol<\/title>/.test(html),
  "Abweichung 1: eigener Titel");
pruef(/Sage-Protokol · reine Anzeige/.test(html),
  "Abweichung 2: eigene Kopfzeile");
pruef(/<a class="back" href="\.\.\/index\.html">/.test(html),
  "Abweichung 3: Rück-Link zeigt auf die Sage-Page");
pruef(!/manifest\.webmanifest/.test(html) && !/serviceWorker\.register/.test(html),
  "Abweichung 4: kein Manifest, kein Service-Worker (eingebettet, keine eigene PWA)");

console.log(`\n${bestanden} bestanden, ${gefallen} fehlgeschlagen\n`);
process.exit(gefallen ? 1 : 0);
