/*
 * Probe: Sages eigene Bedeutungs-Beschreibung — und wer im Feld gewinnt.
 *
 * ── WARUM ES DIESE PROBE GIBT (Befund 2026-09-10) ───────────────────────────
 *
 * Der erste Mitschnitt der Mycel-Karte hat gezeigt, dass Sage im Raum mit
 * einer 160-Zeichen-Beschreibung stand — als DÜNNSTER Knoten des Netzes, und
 * ausgerechnet an der Stelle, gegen die alle zwanzig `matchScore`-Werte im
 * Register gemessen werden. Die Ursache lag nicht im Register, sondern hier:
 * `assets/siegel-inhalt.js` brachte genau diese 160 Zeichen mit, und beim
 * Signieren am 2026-09-02 sind sie mitgewandert.
 *
 * ⚠ EINE ZAHL MISST UMFANG, KEINEN INHALT. Die Vorgänger-Prüfung dieser Sorte
 * in Kim Hub Company mass die LÄNGE — und eine Beschreibung mit 1851 Zeichen
 * ging durch, in der weder der Name noch der Zweck stand. Gemessen werden
 * deshalb die Sachen EINZELN, jede mit eigenem Namen in der roten Zeile.
 *
 * ⚠ UND DER BEGRIFF WIRD GEMESSEN, NICHT DIE FORMULIERUNG. Ein Wächter, der
 * einen Satz festnagelt, verbietet das nächste Richtigstellen.
 *
 * Lauf: node tests/smoke_sage_beschreibung.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const sieg = readFileSync(join(WURZEL, "assets/siegel-inhalt.js"), "utf8");
/* ⚠ SEIT A18 (2026-09-14) LIEGT DER WIZARD-CODE NICHT MEHR IN siegel-inhalt.js.
   Die fünf Wächter weiter unten messen den ABLAUF, nicht die Identität — sie
   sind deshalb MITGEZOGEN worden statt gelöscht. Die Zusicherung ist dieselbe
   geblieben; nur ihr Wohnort hat sich geändert (INTERFACES §11.9). Ein Wächter,
   den man beim Umzug wegwirft, nimmt seine Zusicherung mit. */
const wiz = readFileSync(join(WURZEL, "assets/sbkim-andock-wizard.js"), "utf8");

/* ⚠ SAGE HAT DREI WEGE ZUR SPORE, NICHT EINEN — und beim ersten Bau dieser
   Probe am 2026-09-10 hat sie nur den ersten gemessen. Gefunden hat es Klaus'
   Rückfrage („du hast die Beschreibung jetzt geändert, richtig?"), nicht der
   Lauf: die Probe war grün, während zwei Drittel der Wahrheit ungeprüft
   danebenlagen.

     assets/siegel-inhalt.js   das Siegel-Fenster  (WIZ.domainDescription)
     index.html                das Semantik-Feld der Seite selbst
                               (SBKIM_SEMANTIK_CONFIG.defaultDomainDescription)
     sbkim-init.js             die stille Erst-Anmeldung
                               (C.defaultDomainDescription)

   Drei verschiedene Texte ergäben drei verschiedene Vektoren für denselben
   Knoten — je nachdem, welchen Weg der Nutzer nimmt. Genau diese Falle bewacht
   kim-hub-company seit dem 2026-09-09 mit einem Wortgleich-Wächter; hier fehlte
   sie, und die beiden nachgelassenen Wege trugen 135 bzw. 95 Zeichen. */
const seite = readFileSync(join(WURZEL, "index.html"), "utf8");
const init = readFileSync(join(WURZEL, "sbkim-init.js"), "utf8");
const holText = (quelle) => {
  const m = quelle.match(/(?:default)?[dD]omainDescription:\s*("((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/);
  if (!m) return "";
  return JSON.parse(m[3] !== undefined ? '"' + m[3].replace(/"/g, '\\"') + '"' : m[1]);
};

let gruen = 0, rot = 0;
const ok = (was, bedingung) => {
  if (bedingung) { gruen++; console.log("  ✓ " + was); }
  else { rot++; console.log("  ✗ ROT: " + was); }
};

console.log("\nSages Bedeutungs-Beschreibung\n");

/* Der Text selbst — aus der Datei gelesen, nicht danebengeschrieben. Zwei
   Fassungen desselben Textes liefen sonst auseinander. */
const m = sieg.match(/domainDescription:\s*"((?:[^"\\]|\\.)*)"/);
const text = m ? JSON.parse('"' + m[1] + '"') : "";
ok("die Beschreibung steht überhaupt da", text.length > 0);

/* ── Was drinstehen MUSS. Vier Sachen, vier Zeilen. ─────────────────────── */
ok("… sie nennt den Namen des Knotens", /Sage-Protokol/.test(text));
ok("… sie nennt den ZWECK", /ZWECK/.test(text));
ok("… sie nennt die FORSCHUNG", /FORSCHUNG/.test(text));
ok("… sie nennt das SBKIM-Protokoll", /SBKIM/.test(text));

/* ⚠ DIE AUFLÖSUNG DES EIGENEN NAMENS WAR FALSCH, und niemand hat es gemerkt.
   Die Spore vom 2026-07-14 schrieb „Semantisch-Biologisch Koordiniertes
   Inter-Knoten-Mycel"; das Gutachten (docs/GUTACHTEN/) sagt seit jeher
   „SBKIM = Semantisch Bidirektional KI-Matching". Der Hub des Protokolls trug
   also eine falsche Auskunft über seinen eigenen Namen in den Raum.
   Gemessen wird der tragende Begriff, nicht der genaue Wortlaut. */
ok("… und sie löst SBKIM richtig auf (bidirektional · Matching)",
  /[Bb]idirektional/.test(text) && /[Mm]atching/.test(text));
ok("… und NICHT mehr falsch (kein Biologisch-Koordiniertes)",
  !/Biologisch\s+Koordiniert/i.test(text));

/* Eine Zahl misst Umfang, keinen Inhalt — aber ein Text, der auf ein paar
   Zeilen schrumpft, kann die sechs Sachen oben nicht mehr tragen. Die Grenze
   steht deshalb da, wo sie nichts verbietet: als Untergrenze, nicht als Maß. */
ok(`… und sie ist kein Zweizeiler mehr (${text.length} Zeichen, war 160)`,
  text.length > 1500);

const kw = sieg.match(/domainKeywords:\s*\[([^\]]*)\]/);
const anzahl = kw ? (kw[1].match(/"/g) || []).length / 2 : 0;
ok(`… und die Stichwort-Liste trägt den Text (${anzahl} Stück, waren 6)`, anzahl >= 20);

/* ── Alle DREI Wege tragen denselben Text ────────────────────────────────
   Gemessen wird die Gleichheit, nicht die Länge: drei Texte, die alle vier
   Sachen nennen und trotzdem verschieden sind, ergeben drei Vektoren. */
const tSieg = holText(sieg), tSeite = holText(seite), tInit = holText(init);
ok(`… und die Seite selbst bringt denselben Text mit (${tSeite.length} Zeichen)`,
  tSeite.length > 0 && tSeite === tSieg);
ok(`… und die stille Erst-Anmeldung auch (${tInit.length} Zeichen)`,
  tInit.length > 0 && tInit === tSieg);

console.log("\nWer im Feld gewinnt\n");

/* ⚠ GEMESSEN WIRD DER BLOCK, NICHT DIE DATEI. `ta.value = WIZ.domainDescription`
   steht zweimal — als Vorbelegung und im Knopf. Ein Wächter, der frei in der
   Datei sucht, findet die falsche Stelle und bleibt grün, wenn die Vorbelegung
   ausgebaut wird. Genau so ist es in Kim Hub Company passiert. */
const iFeld = wiz.indexOf('ta.id = "sbkim-si-semantik-text"');
const iHerk = wiz.indexOf("var herkunft = document.createElement");
const vorbelegung = iFeld >= 0 && iHerk > iFeld ? wiz.slice(iFeld, iHerk) : "";
ok("das Feld zeigt den Vorschlag der App",
  vorbelegung.length > 0 && /ta\.value\s*=\s*c\.domainDescription\b/.test(vorbelegung));

/* Die andere Hälfte, und sie ist die eigentliche Zusicherung: im Lade-Pfad
   darf NUR EINE Zuweisung an `ta.value` stehen — die im Knopf. Gezählt statt
   gesucht: „steht irgendwo" ist hier keine Frage, die etwas beantwortet. */
const iLade = wiz.indexOf("getOwnSpore()");
const iEnde = wiz.indexOf('ta.addEventListener("input"', iLade);
const ladePfad = iLade >= 0 && iEnde > iLade ? wiz.slice(iLade, iEnde) : "";
const imKnopf = /zurueck\.addEventListener[\s\S]{0,240}?ta\.value\s*=\s*eigener\s*;/.test(ladePfad);
const stilleZuweisungen = (ladePfad.match(/ta\.value\s*=/g) || []).length;
ok("… und die gespeicherte Spore überschreibt ihn NICHT mehr von selbst",
  ladePfad.length > 0 && imKnopf && stilleZuweisungen === 1);

/* ⚠ AN DER MARKE, NICHT AM SATZ. */
ok("eine Zeile nennt, WELCHER der beiden Texte im Feld steht",
  /data-woher/.test(wiz)
  && /setAttribute\("data-woher",\s*"app"\)/.test(wiz)
  && /setAttribute\("data-woher",\s*"spore"\)/.test(wiz));

/* ⚠ GEMESSEN WIRD DER BLOCK, NICHT EIN ZEICHENFENSTER. Hier stand
   `[\s\S]{0,140}?` — das misst den ABSTAND zweier Stellen: kommt eine Zeile
   dazwischen, wird die Prüfung rot, ohne dass eine Zusicherung gefallen wäre.
   Beim Umzug in den Kanon wäre sie genau daran gescheitert. */
const iAbw = wiz.indexOf("var abweichend");
const iAbwEnde = wiz.indexOf("if (!abweichend)", iAbw);
const vergleichsBlock = iAbw >= 0 && iAbwEnde > iAbw ? wiz.slice(iAbw, iAbwEnde) : "";

/* Der Knopf erscheint nur bei Abweichung — einer, der immer dasteht, ist bald
   einer, den niemand mehr liest. Gemessen wird der Vergleich der TEXTE. */
ok("der Knopf holt den eigenen Text zurück und zeigt sich nur bei Abweichung",
  /id\s*=\s*"sbkim-si-semantik-eigener-text"/.test(wiz)
  && /zurueck\.hidden\s*=\s*true\s*;/.test(wiz)
  && vergleichsBlock.includes("eigener.trim() !==")
  && /if\s*\(!abweichend\)\s*return\s*;/.test(wiz)
  && /zurueck\.hidden\s*=\s*false\s*;/.test(wiz));

/* Ein Element, das gebaut, aber nie eingehängt wird, ist von einem fehlenden
   nicht zu unterscheiden — außer für den Nutzer, der es nicht sieht. */
ok("… und beide hängen wirklich im Block",
  /wrap\.appendChild\(herkunft\)/.test(wiz) && /wrap\.appendChild\(zurueck\)/.test(wiz));

/* Und dasselbe im Semantik-Feld der SEITE. Dort stand bis zum 2026-09-10
   `apply(sp.domainDescription ? … : fallback)` — die gespeicherte Spore
   gewann, und ein Wächter nur am Siegel hätte das nie gesehen. */
const iPre = seite.indexOf("function prefillSemantik");
const iPreEnde = seite.indexOf("\n  }", iPre);
const pre = iPre >= 0 && iPreEnde > iPre ? seite.slice(iPre, iPreEnde) : "";
ok("auch das Semantik-Feld der Seite zeigt den gepflegten Vorschlag",
  pre.length > 0 && /apply\(fallback\)\s*;/.test(pre)
  && !/sp\.domainDescription/.test(pre));

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
process.exit(rot > 0 ? 1 : 0);
