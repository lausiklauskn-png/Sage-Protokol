/* smoke_startseite_einstiege.mjs — jeder Weg steht EINMAL da.
 *
 * ANLASS (2026-09-10, Klaus): „im Sage Protokol gibt es zweimal Suche, ich
 * würde das Flying widget wegnehmen und mycelkarte öffnen gibt es auch
 * zweimal."
 *
 * Er hatte in beiden Fällen recht. Die Suche stand als Lasche am rechten Rand
 * (`.tool-launcher`) UND als Karte in der PWA-Liste; „Mycel-Karte öffnen"
 * stand unter der Modul-Topologie UND unter der eingebetteten Live-Karte.
 *
 * ⚠ UND EIN AUFRAEUMEN KANN EINEN WEG STILL ZUMAUERN. Die Pinnwand hing NUR
 * an dieser Lasche; wer sie ohne Ersatz entfernt, nimmt ihr den einzigen Weg
 * von dieser Seite aus. Deshalb misst diese Probe beides: dass kein Einstieg
 * doppelt ist UND dass keiner verschwunden ist.
 *
 * Lauf: node tests/smoke_startseite_einstiege.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(wurzel, "index.html"), "utf8");

let bestanden = 0, gefallen = 0;
const pruef = (ok, text) => {
  if (ok) { bestanden++; console.log("  ✓ " + text); }
  else { gefallen++; console.log("  ✗ " + text); }
};

console.log("\n── Einstiege der Startseite ──");

/* ⚠ GEZAEHLT WIRD DAS ZIEL, NICHT DAS WORT. Ein Waechter auf „Suche" faende
   jeden Fliesstext, in dem das Wort vorkommt — und meldete Duplikate, die
   keine sind. Gezaehlt werden die Stellen, die wirklich irgendwo HINFUEHREN. */
const zaehle = (muster) => (html.match(muster) || []).length;

/* ---- 1 · Das Flying-Widget ist weg ------------------------------------- */
pruef(!/class="tool-launcher"/.test(html),
  "die Lasche am rechten Rand (.tool-launcher) steht nicht mehr in der Seite");
pruef(!/tool-launch-btn/.test(html),
  "und auch ihre Knöpfe nicht");
/* Eine tote Regel im Stylesheet ist kein Schaden, aber sie ist die Einladung,
   die Lasche versehentlich wiederzubeleben. */
pruef(!/\.tool-launcher \{/.test(html),
  "ihre CSS-Regeln sind mitgegangen — keine tote Regel als Einladung");

/* ---- 2 · Die Suche steht EINMAL da ------------------------------------- */
const suchWege = zaehle(/["']such-tool\//g);
pruef(suchWege === 1,
  "genau EIN Weg zum Such-Werkzeug (gemessen: " + suchWege + ")");
pruef(/name: '🔍 Such-Werkzeug'/.test(html),
  "und zwar als Karte in der PWA-Liste, wo man Werkzeuge sucht");

/* ---- 3 · Die Pinnwand ist NICHT verschwunden --------------------------- */
/* ⚠ DER TEUERSTE FALL. Sie hing nur am Flying-Widget; ohne diese Prüfung
   wäre die Seite aufgeräumt und die Pinnwand von hier aus unerreichbar —
   eine stille Sackgasse. */
const pinnWege = zaehle(/["']pinnwand\//g);
pruef(pinnWege === 1,
  "genau EIN Weg zur Pinnwand — sie ist weiter erreichbar (gemessen: " + pinnWege + ")");
pruef(/name: '📌 Pinnwand'/.test(html),
  "und steht neben dem Such-Werkzeug in derselben Liste");

/* ---- 4 · „Mycel-Karte öffnen" steht EINMAL da -------------------------- */
/* Gezählt werden die Wege, die ein Nutzer DRUECKT — der `iframe src` gehört
   nicht dazu: er zeigt die Karte, er öffnet sie nicht. */
const kartenKnoepfe = zaehle(/(?:href="mycel-karte\/"|window\.open\('\.\/mycel-karte\/')/g);
pruef(kartenKnoepfe === 1,
  "genau EIN Knopf öffnet die Mycel-Karte (gemessen: " + kartenKnoepfe + ")");
pruef(/window\.open\('\.\/mycel-karte\/','_blank','noopener'\)/.test(html),
  "und er steht dort, wo die Karte auch zu sehen ist — unter der Einbettung");
pruef(/<iframe src="\.\/mycel-karte\/"/.test(html),
  "die eingebettete Live-Karte selbst ist unberührt");
pruef(!/class="nav-pill mycel-link"/.test(html),
  "der zweite, unter der MODUL-Topologie, ist weg — dort zeigte er auf etwas anderes");
pruef(!/\.topology-cta \{/.test(html) && !/a\.nav-pill\.mycel-link/.test(html),
  "und seine CSS-Regeln sind mitgegangen");

console.log("\n" + bestanden + " grün · " + gefallen + " ROT");
process.exit(gefallen ? 1 : 0);
