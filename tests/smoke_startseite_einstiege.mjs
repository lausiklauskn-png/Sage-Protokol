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


/* ---- 5 · Kein Link fuehrt nirgendwohin (Auslieferungsprüfer 2026-09-11) --
 *
 * Sein Bericht: „1 Sache an 3 Stellen · Dieser Link führt nirgendwohin · ein
 * Knopf, der nichts tut" — die Marke oben links und zwei Platzhalter, die
 * das Skript erst spaeter fuellt.
 *
 * ⚠ DAS href WEGZULASSEN WAR DER ZWEITE FEHLVERSUCH. Der Prüfer meldet ein
 * <a> OHNE href genauso wie eines mit `#`, und zu Recht: in der
 * ausgelieferten Datei fuehrt beides nirgends hin. Jeder Link traegt jetzt
 * ein ECHTES Ziel, das auch ohne Skript etwas oeffnet; das Skript schaerft
 * es danach.
 *
 * ⚠ GEMESSEN WIRD IM MARKUP, NICHT IN DER GANZEN DATEI. Die Erklaer-
 * Kommentare daneben nennen `href="#"` woertlich — ein Waechter, der frei
 * sucht, wird in seiner eigenen Begruendung fuendig und misst nichts.
 */
/* ⚠ UND DIE SKRIPTE MUESSEN AUCH RAUS. Im JS steht `<a download>` als
   Zeichenkette — Markup, das erst zur Laufzeit entsteht und dessen Ziel dann
   ein blob: ist. Der Auslieferungsprüfer ueberspringt `<script>`-Inhalte aus
   genau diesem Grund; ein Waechter, der es nicht tut, meldet Code als Markup.
   Beim ersten Lauf ist er prompt darueber gefallen. */
const ohneKommentare = html.replace(/<!--[\s\S]*?-->/g, "")
                           .replace(/<script\b[\s\S]*?<\/script\s*>/gi, "");
const tote = [...ohneKommentare.matchAll(/<a\b[^>]*>/gi)].filter((m) => {
  const tag = m[0];
  const treffer = /\shref\s*=\s*("([^"]*)"|'([^']*)')/i.exec(tag);
  if (!treffer) return true;                              // gar kein href
  const ziel = (treffer[2] !== undefined ? treffer[2] : treffer[3]).trim();
  return ziel === "" || ziel === "#" || /^javascript:void/i.test(ziel);
});
pruef(tote.length === 0,
  "kein <a> ohne Ziel — kein Knopf, der nichts tut (gefunden: " + tote.length + ")");
if (tote.length) tote.slice(0, 3).forEach((m) => console.log("      ↳ " + m[0].slice(0, 110)));

/* Und die drei aus dem Bericht namentlich — damit ein Ruecktausch auffaellt,
   nicht nur ein neuer toter Link. */
pruef(/<a href="#screen-overview" class="brand"/.test(ohneKommentare),
  "  · die Marke springt auf die Übersicht, die es wirklich gibt");
pruef(/id="ad-pr-link"[\s\S]{0,220}?href="https:\/\/github\.com\/[^"]*status\.json"/.test(ohneKommentare),
  "  · der PR-Link zeigt auf die Datei, die der Andockende bearbeiten muss");
pruef(/<a id="md-link" href="docs\/components\/">/.test(ohneKommentare),
  "  · die Komponenten-Karte zeigt auf ihren Ordner");

console.log("\n" + bestanden + " grün · " + gefallen + " ROT");
process.exit(gefallen ? 1 : 0);
