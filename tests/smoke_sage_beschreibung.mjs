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

console.log("\nWer im Feld gewinnt\n");

/* ⚠ GEMESSEN WIRD DER BLOCK, NICHT DIE DATEI. `ta.value = WIZ.domainDescription`
   steht zweimal — als Vorbelegung und im Knopf. Ein Wächter, der frei in der
   Datei sucht, findet die falsche Stelle und bleibt grün, wenn die Vorbelegung
   ausgebaut wird. Genau so ist es in Kim Hub Company passiert. */
const iFeld = sieg.indexOf('ta.id = "sbkim-si-semantik-text"');
const iHerk = sieg.indexOf("var herkunft = document.createElement");
const vorbelegung = iFeld >= 0 && iHerk > iFeld ? sieg.slice(iFeld, iHerk) : "";
ok("das Feld zeigt den Vorschlag der App",
  vorbelegung.length > 0 && /ta\.value\s*=\s*WIZ\.domainDescription\s*;/.test(vorbelegung));

/* Die andere Hälfte, und sie ist die eigentliche Zusicherung: im Lade-Pfad
   darf NUR EINE Zuweisung an `ta.value` stehen — die im Knopf. Gezählt statt
   gesucht: „steht irgendwo" ist hier keine Frage, die etwas beantwortet. */
const iLade = sieg.indexOf("getOwnSpore()");
const iEnde = sieg.indexOf('ta.addEventListener("input"', iLade);
const ladePfad = iLade >= 0 && iEnde > iLade ? sieg.slice(iLade, iEnde) : "";
const imKnopf = /zurueck\.addEventListener[\s\S]{0,240}?ta\.value\s*=\s*eigener\s*;/.test(ladePfad);
const stilleZuweisungen = (ladePfad.match(/ta\.value\s*=/g) || []).length;
ok("… und die gespeicherte Spore überschreibt ihn NICHT mehr von selbst",
  ladePfad.length > 0 && imKnopf && stilleZuweisungen === 1);

/* ⚠ AN DER MARKE, NICHT AM SATZ. */
ok("eine Zeile nennt, WELCHER der beiden Texte im Feld steht",
  /data-woher/.test(sieg)
  && /setAttribute\("data-woher",\s*"app"\)/.test(sieg)
  && /setAttribute\("data-woher",\s*"spore"\)/.test(sieg));

/* Der Knopf erscheint nur bei Abweichung — einer, der immer dasteht, ist bald
   einer, den niemand mehr liest. Gemessen wird der Vergleich der TEXTE. */
ok("der Knopf holt den eigenen Text zurück und zeigt sich nur bei Abweichung",
  /id\s*=\s*"sbkim-si-semantik-eigener-text"/.test(sieg)
  && /zurueck\.hidden\s*=\s*true\s*;/.test(sieg)
  && /abweichend\s*=[\s\S]{0,140}?eigener\.trim\(\)\s*!==/.test(sieg)
  && /if\s*\(!abweichend\)\s*return\s*;/.test(sieg)
  && /zurueck\.hidden\s*=\s*false\s*;/.test(sieg));

/* Ein Element, das gebaut, aber nie eingehängt wird, ist von einem fehlenden
   nicht zu unterscheiden — außer für den Nutzer, der es nicht sieht. */
ok("… und beide hängen wirklich im Block",
  /wrap\.appendChild\(herkunft\)/.test(sieg) && /wrap\.appendChild\(zurueck\)/.test(sieg));

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
process.exit(rot > 0 ? 1 : 0);
