/* gegenprobe_mycelkarte_kopie.mjs — jeder eingebaute Fehler MUSS
 * `tests/smoke_mycelkarte_kopie.mjs` umwerfen, mit dem Namen SEINER
 * Zusicherung in der roten Zeile.
 *
 * ANLASS (2026-09-10): Der Waechter war GRUEN, waehrend die Kopie zwei
 * Baustufen zurueckhing — Klaus hat es gesehen, keine Probe. Er fragte nach
 * Faehigkeiten vom August und wusste von den neuen nichts. Genau deshalb
 * steht hier eine Gegenprobe: sie zeigt, was er von seinem Fehlen
 * unterscheiden kann und was nicht.
 *
 * ⚠ GEARBEITET WIRD IN EINER WEGWERF-KOPIE. Ein unterbrochener Lauf liesse
 * sonst eine Sabotage im echten Baum liegen (PWA-Toolpoint, 2026-09-09).
 *
 * Lauf: node tests/gegenprobe_mycelkarte_kopie.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync, mkdirSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const behaelter = mkdtempSync(resolve(tmpdir(), "sage-kopie-gegenprobe-"));
const kopie = resolve(behaelter, "Sage-Protokol");
mkdirSync(resolve(kopie, "tests"), { recursive: true });
mkdirSync(resolve(kopie, "tools"), { recursive: true });
mkdirSync(resolve(kopie, "mycel-karte"), { recursive: true });
cpSync(resolve(wurzel, "mycel-karte/index.html"), resolve(kopie, "mycel-karte/index.html"));
/* \u26a0 DIE AUFZEICHNUNG REIST MIT IN DIE WEGWERF-KOPIE. Ohne sie waere die
   Ausgangslage schon ohne Eingriff rot ("die Datei liegt NEBEN der Kopie"),
   und der ganze Lauf braeche ab \u2014 495 Faelle massen dann nichts. */
const REPLAY_REL = (/var REPLAY_DATEI = "([^"]+)";/
  .exec(readFileSync(resolve(wurzel, "mycel-karte/index.html"), "utf8")) || [])[1];
if (!REPLAY_REL) {
  console.log("  ABBRUCH \u2014 in der Kopie steht kein REPLAY_DATEI");
  process.exit(2);
}
const REPLAY_QUELL = resolve(wurzel, "mycel-karte", REPLAY_REL);
const REPLAY_ZIEL = resolve(kopie, "mycel-karte", REPLAY_REL);
mkdirSync(dirname(REPLAY_ZIEL), { recursive: true });
cpSync(REPLAY_QUELL, REPLAY_ZIEL);
const REPLAY_ORIGINAL = readFileSync(REPLAY_ZIEL, "utf8");
cpSync(resolve(wurzel, "tests/smoke_mycelkarte_kopie.mjs"),
       resolve(kopie, "tests/smoke_mycelkarte_kopie.mjs"));
cpSync(resolve(wurzel, "tools/mycelkarte-uebernehmen.mjs"),
       resolve(kopie, "tools/mycelkarte-uebernehmen.mjs"));
/* ⚠ DER QUELL-KLON WIRD ABSICHTLICH NICHT MITKOPIERT. Sonst liefe in jedem
   Fall zusaetzlich der Ableiter-Vergleich an und faerbte jede Sabotage rot —
   „gefangen" waere dann die Sabotage, nicht die gemeinte Zusicherung.
   Der Ableiter-Vergleich bekommt weiter unten seinen EIGENEN Fall. */

const ZIEL = resolve(kopie, "mycel-karte/index.html");
const ORIGINAL = readFileSync(ZIEL, "utf8");

function lauf() {
  try {
    execFileSync(process.execPath, [resolve(kopie, "tests/smoke_mycelkarte_kopie.mjs")],
      { stdio: "pipe", encoding: "utf8" });
    return [];
  } catch (e) {
    const rot = String(e.stdout || "").split("\n").filter((z) => z.includes("✗"))
      .map((z) => z.replace(/^\s*✗\s*/, "").trim());
    return rot.length ? rot : ["ABGESTÜRZT: " + String(e.stderr || "").split("\n")[1]];
  }
}

const FAELLE = [
  /* Die Faehigkeiten, an denen die Kopie am 2026-09-10 wirklich zurueckhing. */
  { was: "der Einzeltipp faellt zurueck auf den alten Doppeltipp",
    trifft: /EIN Tipp genügt/,
    kaputt: (t) => t.replace("if (getippt) knotenKarteOeffnen(n);",
      "if (getippt && letzterTipp === n) knotenKarteOeffnen(n);") },

  { was: "ein dblclick-Horcher kommt zurueck — am Tablet unzuverlaessig",
    trifft: /kein Doppeltipp mehr angemeldet/,
    kaputt: (t) => t.replace('canvas.addEventListener("pointerdown"',
      'canvas.addEventListener("dblclick", function () {});\ncanvas.addEventListener("pointerdown"') },

  { was: "die Wiedergabe des echten Laufs fehlt (der Stand vom 2026-08-11)",
    trifft: /Wiedergabe des echten Laufs/,
    kaputt: (t) => t.replace('id="btnReplay"', 'id="btnReplayFehlt"') },

  { was: "die Wiedergabe ist da, aber ohne Pause/Schritt/Spulen",
    trifft: /Pause, Schritt und Spulen/,
    kaputt: (t) => t.replace('id="replayTransport"', 'id="replayTransportFehlt"') },

  { was: "die Knoten-Karte hat ihren Raum-Kasten nicht mehr",
    trifft: /Kasten kkRaum/,
    kaputt: (t) => t.replace('id="kkRaum"', 'id="kkRaumFehlt"') },

  { was: "die Karte fuellt die Kaesten nicht mehr aus dem Register",
    trifft: /aus Sages Register/,
    kaputt: (t) => t.replace("function fuelleRegister", "function fuelleRegisterAlt") },

  { was: "das echte App-Symbol im Kopf faellt weg",
    trifft: /echte Symbol der App/,
    kaputt: (t) => t.replace("function zeigeSymbol", "function zeigeSymbolAlt") },

  /* Die vier bewussten Abweichungen — in BEIDE Richtungen. */
  { was: "der Titel faellt auf den der Standalone-Fassung zurueck",
    trifft: /Abweichung 1/,
    kaputt: (t) => t.replace("<title>Mycel-Live-Karte · Sage-Protokol</title>",
                             "<title>Mycel-Karte</title>") },

  { was: "eine Service-Worker-Anmeldung rutscht in die eingebettete Fassung",
    trifft: /Abweichung 4/,
    kaputt: (t) => t.replace("</script>",
      'navigator.serviceWorker.register("./sw.js");\n</script>') },

  /* Die tragenden Faehigkeiten aus der ersten Bauzeit. */
  { was: "das zweite eigene Relais faellt aus dem Pool",
    trifft: /eigenen Relais stehen vorn/,
    kaputt: (t) => t.replace('"wss://relay.pwa-toolpoint.de",', "") },

  { was: "der Doppel-Filter faellt weg — dasselbe Ereignis zaehlt mehrfach",
    trifft: /Doppel-Filter/,
    kaputt: (t) => t.replace("function schonGesehen", "function schonGesehenAlt") },

  /* --- Die Aufzeichnung, die der Knopf holt (Klaus 2026-09-17) -----------
   * \u26a0 GENAU HIER WAR DIESE PROBE BLIND. Die Faelle darueber sabotieren
   * alle den QUELLTEXT; der Befund vom 2026-09-17 lag in einer DATEI, die
   * daneben fehlte. Ein Fall, der nur den Text anfasst, kann das nicht
   * treffen \u2014 deshalb koennen die folgenden auch die Aufzeichnung selbst
   * verbiegen (`kaputtDatei`) oder sie ganz wegnehmen (`entfernen`). */
  { was: "die Aufzeichnung fehlt neben der Kopie (der Befund vom 2026-09-17)",
    trifft: /liegt NEBEN der Kopie/,
    entfernen: true },

  { was: "der Knopf zeigt auf einen Pfad, den es nicht gibt (umbenannt, Zeiger nicht nachgezogen)",
    trifft: /liegt NEBEN der Kopie/,
    kaputt: (t) => t.replace('var REPLAY_DATEI = "mitschnitt/',
                             'var REPLAY_DATEI = "mitschnitt/anders-') },

  { was: "die Aufzeichnung ist nicht mehr zu lesen (kaputtes JSON)",
    trifft: /gueltiges JSON/,
    kaputtDatei: (d) => "{ kaputt" + d },

  { was: "in der Aufzeichnung steht kein Relais-Verkehr mehr zum Abspielen",
    trifft: /Relais-Verkehr darin/,
    kaputtDatei: (d) => JSON.stringify(
      Object.assign(JSON.parse(d), { ereignisse: [] })) },

  { was: "der Erklaertext verspricht mehr Ereignisse, als in der Datei stehen",
    trifft: /Ereignis-Zahl im Text/,
    kaputt: (t) => t.replace("191 Ereignisse aus", "999 Ereignisse aus") },

  { was: "der Erklaertext verspricht mehr Aufzeichnungen, als es sind",
    trifft: /Zahl der Aufzeichnungen ebenso/,
    kaputt: (t) => t.replace("Ereignisse aus fünf Aufzeichnungen",
                             "Ereignisse aus acht Aufzeichnungen") }
];

let gefangen = 0, durch = 0, falsch = 0, tot = 0;

console.log("\n── Gegenprobe: die eingebettete Mycel-Karte ──");
if (lauf().length) {
  console.log("  ABBRUCH — die Probe ist schon ohne Eingriff rot");
  rmSync(behaelter, { recursive: true, force: true });
  process.exit(2);
}

for (const f of FAELLE) {
  /* Drei Sorten Eingriff, und der Unterschied ist kein Schoenheitsfehler:
     am Quelltext, an der Aufzeichnung, oder die Aufzeichnung ganz weg.
     Ein Fall, der nur den Quelltext anfassen kann, ist fuer eine fehlende
     DATEI blind \u2014 und genau das war der Befund vom 2026-09-17. */
  let nachher = ORIGINAL;
  if (f.kaputt) {
    nachher = f.kaputt(ORIGINAL);
    if (nachher === ORIGINAL) { tot++; console.log("  \u26a0 ANKER NICHT GEFUNDEN \u2014 " + f.was); continue; }
    writeFileSync(ZIEL, nachher);
  }
  if (f.kaputtDatei) {
    const gebogen = f.kaputtDatei(REPLAY_ORIGINAL);
    if (gebogen === REPLAY_ORIGINAL) { tot++; console.log("  \u26a0 ANKER NICHT GEFUNDEN \u2014 " + f.was); writeFileSync(ZIEL, ORIGINAL); continue; }
    writeFileSync(REPLAY_ZIEL, gebogen);
  }
  if (f.entfernen) unlinkSync(REPLAY_ZIEL);
  const rot = lauf();
  writeFileSync(ZIEL, ORIGINAL);
  writeFileSync(REPLAY_ZIEL, REPLAY_ORIGINAL);
  if (!rot.length) { durch++; console.log("  ✗ NICHT GEFANGEN — " + f.was); continue; }
  if (!rot.some((z) => f.trifft.test(z))) {
    falsch++;
    console.log("  ✗ FALSCHER GRUND — " + f.was + "\n      rot war: " + rot.join(" | "));
    continue;
  }
  gefangen++;
  console.log("  ✓ gefangen (" + rot.length + " rot) — " + f.was);
}

/* ---- Der Ableiter-Vergleich, mit dem Quell-Klon daneben ----------------
 * ⚠ ER IST DER EINZIGE WAECHTER, DER NICHT MIT DER KOPIE ALTERT — und
 * deshalb der wichtigste. Gemessen wird er getrennt, weil er einen Klon
 * neben dem Depot braucht; fehlt der, sagt die Probe „nicht messbar", und
 * dieser Fall wird uebersprungen statt still als bestanden gezaehlt. */
const echteQuelle = resolve(wurzel, "../mycel-karte/index.html");
let ableiter = "übersprungen";
try {
  readFileSync(echteQuelle);
  mkdirSync(resolve(behaelter, "mycel-karte"), { recursive: true });
  cpSync(echteQuelle, resolve(behaelter, "mycel-karte/index.html"));
  /* Der Ableiter holt seit dem 2026-09-17 auch die Aufzeichnung. Fehlt sie im
     gestellten Quell-Klon, bricht er ab \u2014 und dieser Fall waere „gefangen"
     aus dem falschen Grund, naemlich schon ohne das Leerzeichen. */
  const quellReplay = resolve(wurzel, "../mycel-karte", REPLAY_REL);
  mkdirSync(dirname(resolve(behaelter, "mycel-karte", REPLAY_REL)), { recursive: true });
  cpSync(quellReplay, resolve(behaelter, "mycel-karte", REPLAY_REL));
  /* Ein einziges Zeichen in der Kopie, das der Ableiter so nie erzeugt. */
  writeFileSync(ZIEL, ORIGINAL.replace("<h1>🍄 Mycel-Live-Karte",
                                       "<h1>🍄 Mycel-Live-Karte "));
  const rot = lauf();
  writeFileSync(ZIEL, ORIGINAL);
  if (rot.some((z) => /GENAU das, was der Ableiter erzeugt/.test(z))) {
    gefangen++; ableiter = "gefangen";
    console.log("  ✓ gefangen — eine Handarbeit an der Kopie (ein einziges Leerzeichen)");
  } else if (rot.length) {
    falsch++; ableiter = "falscher Grund";
    console.log("  ✗ FALSCHER GRUND — eine Handarbeit an der Kopie\n      rot war: " + rot.join(" | "));
  } else {
    durch++; ableiter = "durchgerutscht";
    console.log("  ✗ NICHT GEFANGEN — eine Handarbeit an der Kopie");
  }
} catch {
  console.log("  ⊘ nicht messbar: der Klon von `mycel-karte` liegt nicht daneben");
}

rmSync(behaelter, { recursive: true, force: true });
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · "
  + falsch + " aus dem falschen Grund · " + tot + " tote Anker"
  + "  (Ableiter-Vergleich: " + ableiter + ")");
process.exit(durch || falsch || tot ? 1 : 0);
