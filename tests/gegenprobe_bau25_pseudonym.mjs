/*
 * Gegenprobe zu `smoke_bau25_pseudonym.mjs` (Modul 25, Generation 2).
 *
 * Jeder Fall baut GENAU EINEN Fehler ins Modul ein. Er zählt nur als gefangen,
 * wenn die Probe rot wird UND die rote Zeile den Namen seiner Zusicherung
 * trägt (`trifft`) — „rot" allein kann auch ein Absturz oder ein fremder
 * Wächter sein. Ein Anker, der nicht genau einmal trifft, misst nichts und
 * wird als toter Anker gemeldet, nicht als blinder Wächter.
 *
 * Gearbeitet wird in einer Wegwerf-Kopie (Modul + Probe), nie im echten Baum.
 *
 * Lauf: node tests/gegenprobe_bau25_pseudonym.mjs   ·   NUR_ANKER=1 prüft nur die Anker.
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODUL = "src/modules/25_pseudonym.js";
const PROBE = "tests/smoke_bau25_pseudonym.mjs";

const FAELLE = [
  { was: "IBAN ohne Prüfziffer", trifft: "1h Gegenrichtung",
    alt: "return rest === 1;", neu: "return rest >= 0;" },
  { was: "Telefon auch ohne Ländervorwahl", trifft: "1f Gegenrichtung",
    alt: "var TELEFON = /(?:tel:|\\+\\d{2}[\\s\\-/()]?)", neu: "var TELEFON = /(?:tel:|\\+?\\d{2}[\\s\\-/()]?)" },
  { was: "Betrag ohne Tausenderpunkt (nur „248,50 EUR“)", trifft: "1i Betrag mit Tausenderpunkt",
    alt: "var ZAHL = \"(?:\\\\d{1,3}(?:\\\\.\\\\d{3})+(?:,\\\\d{2})?|", neu: "var ZAHL = \"(?:" },
  { was: "Namen ohne Wortgrenze", trifft: "2b Gegenrichtung",
    alt: "\"(?<![\\\\p{L}\\\\p{N}])\" + escapeRegExp(v.value) + \"(?![\\\\p{L}\\\\p{N}])\"", neu: "escapeRegExp(v.value)" },
  { was: "Namen mit Groß/klein", trifft: "2c ohne Groß/klein",
    alt: "\"giu\")", neu: "\"gu\")" },
  { was: "Feld: der Feldname wird mitverdeckt", trifft: "1b Passwort-Feld",
    alt: "[SCHLUESSEL_FELD, 1, null]", neu: "[SCHLUESSEL_FELD, 0, null]" },
  { was: "freistehende Rechnungsnummer fällt weg", trifft: "1m freistehende Rechnungsnummer",
    alt: ", [BELEG_FREI, 0, null]]", neu: "]" },
  { was: "gleicher Wert bekommt neuen Platzhalter", trifft: "3b derselbe Name zweimal",
    alt: "if (Object.prototype.hasOwnProperty.call(reverse, key)) return reverse[key];", neu: "" },
  { was: "Überlappung wird nicht aufgelöst", trifft: "4b überlappende Treffer",
    alt: "if (h.start >= until) { out.push(h); until = h.end; }", neu: "out.push(h);" },
  { was: "Zeilennummer zählt nicht", trifft: "3f jede Fundstelle trägt ihre Zeile",
    alt: "if (text.charCodeAt(pos) === 10) line++;", neu: "" },
  { was: "vorhandene Platzhalter werden verschachtelt", trifft: "5e ein Muster",
    alt: "return !reserved.some(", neu: "return true || !reserved.some(" },
  { was: "alte [[TYP_n]] werden nicht mehr gelesen", trifft: "5b alter Platzhalter",
    alt: "var TOKEN_RE_SRC = \"(?:\" + TOKEN_NEW_SRC + \"|\" + TOKEN_OLD_SRC + \")\";", neu: "var TOKEN_RE_SRC = \"(?:\" + TOKEN_NEW_SRC + \")\";" },
  { was: "findLeak findet nichts", trifft: "3i findLeak",
    alt: "if (isString(w) && w.length && text.indexOf(w) !== -1) return w;", neu: "" },
  { was: "alter Sortenname EMAIL wird ignoriert", trifft: "8b alter Sortenname",
    alt: "var ALIAS = { EMAIL: \"MAIL\", TEL: \"TELEFON\" };", neu: "var ALIAS = {};" },
  { was: "Telefon standardmäßig aus (wie Generation 1)", trifft: "10b alle sieben Sorten",
    alt: "var DEFAULT_TYPES = ORDER.slice();", neu: "var DEFAULT_TYPES = ORDER.filter(function (t) { return t !== \"TELEFON\"; });" },
  { was: "Datum ohne Prüfung des Tages", trifft: "1v Gegenrichtung",
    alt: "var TAG = \"(?:0?[1-9]|[12]\\\\d|3[01])\"", neu: "var TAG = \"(?:\\\\d{1,2})\"" },
  { was: "Datum frisst Versionsnummern", trifft: "1u Gegenrichtung",
    alt: "\"\\\\.(?:\\\\d{4}|\\\\d{2})(?![\\\\d]|[.,/]\\\\d)\"", neu: "\"\\\\.(?:\\\\d{4}|\\\\d{2})\"" },
  { was: "Vorschlag: nach Herr zwei Wörter auch mitten im Satz", trifft: "11b nach Herr nur EIN Wort",
    alt: "(?=[ \\\\t]*(?:[,.;:!?)]|$)))?)\", \"gmu\");", neu: "))?)\", \"gmu\");" },
  { was: "Vorschlag: Stoppwörter fallen weg", trifft: "11f Team, Damen",
    alt: "if (woerter.some(function (w) { return KEIN_NAME.indexOf(w) !== -1; })) continue;", neu: "" },
  { was: "Vorschlag: bekannte Namen werden wieder vorgeschlagen", trifft: "11h schon bekannte",
    alt: "if (bekannt[key] || gesehen[key]) continue;", neu: "if (gesehen[key]) continue;" },
  { was: "Vorschlag: Grußformel fällt weg", trifft: "11e aus der Grußformel",
    alt: "    nimm(VOR_ABSCHIED, \"grussformel\");\n", neu: "" },
  { was: "Vorschlag: Begrüßung fällt weg", trifft: "11d aus der Begrüßung",
    alt: "    nimm(VOR_GRUSS, \"begruessung\");\n", neu: "" },
  { was: "Monatsnamen fallen weg", trifft: "1s Datum mit Monatsnamen",
    alt: "[DATUM_ZAHL, DATUM_STRICH, DATUM_ISO, DATUM_WORT]", neu: "[DATUM_ZAHL, DATUM_STRICH, DATUM_ISO]" },
  { was: "ISO-Datum fällt weg", trifft: "1q Datum ISO",
    alt: "DATUM_STRICH, DATUM_ISO, DATUM_WORT", neu: "DATUM_STRICH, DATUM_WORT" },
  { was: "DATUM standardmäßig aus", trifft: "1o Datum TT.MM.JJJJ",
    alt: "var DEFAULT_TYPES = ORDER.slice();", neu: "var DEFAULT_TYPES = ORDER.filter(function (t) { return t !== \"DATUM\"; });" },
];

const kopie = mkdtempSync(join(tmpdir(), "sage-bau25-"));
let gefangen = 0, blind = 0, falsch = 0, tot = 0;
try {
  for (const p of [MODUL, PROBE]) { mkdirSync(join(kopie, dirname(p)), { recursive: true }); cpSync(join(WURZEL, p), join(kopie, p)); }
  const basis = readFileSync(join(kopie, MODUL), "utf8");
  const lauf = () => {
    try { execFileSync(process.execPath, [join(kopie, PROBE)], { stdio: "pipe" }); return { rot: false, aus: "" }; }
    catch (e) { return { rot: true, aus: String(e.stdout || "") + String(e.stderr || "") }; }
  };
  const nurAnker = !!process.env.NUR_ANKER;
  if (!nurAnker && lauf().rot) { console.log("⚠ ABBRUCH: die unversehrte Kopie ist schon ROT."); process.exit(2); }
  console.log("\nGEGENPROBE — Modul 25, Generation 2\n");
  for (const f of FAELLE) {
    const n = basis.split(f.alt).length - 1;
    if (n !== 1) { console.log("  ⚠ TOTER ANKER (" + n + "×): " + f.was); tot++; continue; }
    if (nurAnker) { console.log("  ✓ Anker lebt: " + f.was); continue; }
    writeFileSync(join(kopie, MODUL), basis.replace(f.alt, () => f.neu), "utf8");
    const r = lauf();
    writeFileSync(join(kopie, MODUL), basis, "utf8");
    const rote = r.aus.split("\n").filter((l) => l.startsWith("  FAIL"));
    if (!r.rot) { console.log("  ✗ NICHT GEFANGEN: " + f.was); blind++; }
    else if (rote.some((l) => l.includes(f.trifft))) { console.log("  ✓ gefangen: " + f.was + "  ← " + rote.length + " rote Zeile(n)"); gefangen++; }
    else { console.log("  ✗ ROT AUS FALSCHEM GRUND: " + f.was + "\n      " + (rote[0] || r.aus.split("\n").slice(0, 3).join(" | "))); falsch++; }
  }
} finally { rmSync(kopie, { recursive: true, force: true }); }
console.log(`\n— ${gefangen} gefangen · ${blind} blind · ${falsch} aus falschem Grund · ${tot} tote Anker —\n`);
process.exit(blind + falsch + tot > 0 ? 1 : 0);
