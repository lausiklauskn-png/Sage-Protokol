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
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
/* ⚠ EIN NAME, DER DER ANFANG EINES ANDEREN IST, MISST NICHT, WAS ER ZU
   MESSEN GLAUBT. `schonGesehenAlt` enthaelt `schonGesehen` — die Gegenprobe
   hat am 2026-09-10 genau so drei Waechter dieser Datei entlarvt, diesen
   eingeschlossen. Verlangt wird deshalb die oeffnende Klammer. */
pruef(/function schonGesehen\(/.test(html),
  "Doppel-Filter da (dasselbe Ereignis über mehrere Relais zählt einmal)");
pruef(/function relayPills\(/.test(html) && /id="relayPills"/.test(html),
  "Relais-Pillen zum An-/Abschalten");
pruef(/function knotenKarteOeffnen\(/.test(html) && /id="knotenKarte"/.test(html),
  "ein Tipp öffnet die Knoten-Karte");
pruef(/var getippt = \([^;]*dx[^;]*dy[^;]*\)\s*<\s*\d+/.test(html),
  "Tipp und Zug getrennt (echte Rechnung, nicht nur das Wort)");
pruef(/var ADRESSBUCH = \{/.test(html), "Adressbuch für die App-Knöpfe");
pruef(!/Mycel-Apps öffnen \(nebeneinander\)/.test(html),
  "die alte feste Sechser-Knopfreihe ist raus");

/* --- ⚠ WAS DIESER WAECHTER AM 2026-09-10 NICHT GEFANGEN HAT ------------
 *
 * Klaus: „und die sage-Mycel karte hat nicht die selben funktionen wie die
 * PWA App." Er hatte recht, und diese Probe war GRUEN. Gemessen an dem Tag:
 *
 *     Ein Tipp auf eine Pille      Kopie:0  PWA:1
 *     btnReplay                    Kopie:0  PWA:6
 *     kkRaum                       Kopie:0  PWA:2
 *
 * Die Kopie hing zwei Baustufen zurueck — kein Einzeltipp, keine Wiedergabe,
 * keine Auskunft in der Knoten-Karte. Der Waechter fragte nach Faehigkeiten
 * vom August und wusste von den neuen nichts.
 *
 * ⚠ EIN WAECHTER, DER NUR DEN STAND SEINES BAUTAGS KENNT, VERROTTET MIT DER
 * KOPIE. Deshalb steht unten zusaetzlich die Frage nach dem ABLEITER: sie
 * altert nicht, weil sie nichts aufzaehlt. Die Liste hier bleibt trotzdem —
 * sie greift auch dort, wo der Quell-Klon nicht daneben liegt. */

pruef(/if \(getippt\) knotenKarteOeffnen\(n\)/.test(html),
  "EIN Tipp genügt (Klaus 2026-09-10) — kein zweiter mehr nötig");
/* ⚠ GEMESSEN WIRD DIE ANMELDUNG, NICHT DAS WORT. `dblclick` steht in dieser
   Datei zweimal — beide Male im Erklaer-Kommentar, der sagt, warum es NICHT
   benutzt wird. Ein Waechter, der im Kommentar fuendig wird, misst nichts;
   diese Falle ist im Quell-Repo dreimal zugeschnappt. */
pruef(!/letzterTipp/.test(html)
      && !/addEventListener\(\s*["']dblclick["']/.test(html)
      && !/ondblclick/.test(html),
  "und es ist wirklich kein Doppeltipp mehr angemeldet");
pruef(/id="btnReplay"/.test(html) && /function spieleMitschnitt\(/.test(html),
  "die Wiedergabe des echten Laufs ist da");
pruef(/id="replayTransport"/.test(html) && /id="btnSpulVor"/.test(html)
      && /function replayZurueck\(/.test(html),
  "samt Pause, Schritt und Spulen (Klaus 2026-09-10)");
["kkRaum", "kkRegister", "kkVerbindungen"].forEach((id) =>
  pruef(new RegExp('id="' + id + '"').test(html),
    "  · die Knoten-Karte hat ihren Kasten " + id));
pruef(/function merkeRaumSpore\(/.test(html) && /function fuelleRegister\(/.test(html),
  "und füllt sie aus dem, was der Knoten im Raum sagt, und aus Sages Register");
pruef(/function zeigeSymbol\(/.test(html) && /icon:/.test(html),
  "die Karte zeigt das echte Symbol der App");

/* --- Und der eine Wächter, der NICHT mit der Kopie altert -------------- */
/* ⚠ ER MISST NUR, WENN DER QUELL-KLON DANEBEN LIEGT. In einem frischen
   Behaelter tut er das nicht — dann sagt er „nicht messbar" statt eines
   gruenen Hakens. Ein Haken, der von seinem Fehlen nicht zu unterscheiden
   ist, ist keine Deckung. */
const werkzeug = resolve(wurzel, "tools/mycelkarte-uebernehmen.mjs");
pruef(existsSync(werkzeug), "es gibt ein Werkzeug, das die Kopie ableitet");
const quelle = resolve(wurzel, "../mycel-karte/index.html");
if (!existsSync(quelle)) {
  console.log("  ⊘ nicht messbar: der Klon von `mycel-karte` liegt nicht daneben —");
  console.log("    die Frage „ist die Kopie noch die Kopie?" + '"' + " bleibt hier offen.");
} else {
  let ergebnis = 0;
  try {
    execFileSync(process.execPath, [werkzeug], { cwd: wurzel, stdio: "pipe" });
  } catch (e) { ergebnis = e.status; }
  pruef(ergebnis === 0,
    "die Kopie ist GENAU das, was der Ableiter erzeugt (sonst: nachziehen mit --schreiben)");
}

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
