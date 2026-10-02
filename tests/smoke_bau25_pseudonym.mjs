#!/usr/bin/env node
/*
 * Smoke — Modul 25 Pseudonymisierung, Generation 2 (2026-09-28).
 *
 * Generation 1 (2026-07-16) kannte EMAIL/IBAN/TEL und Platzhalter [[TYP_n]].
 * Generation 2 trägt den Kern des Sende-Prüfers: sieben Sorten (DATUM seit 2026-10-02), Fund nach Lage,
 * Platzhalter ⟦TYP-n⟧, findLeak. Alte [[TYP_n]] werden weiter gelesen.
 *
 * Gemessen wird an einem erfundenen Text (keine echten Daten). Jede Sorte hat
 * einen Treffer UND eine Gegenrichtung, die NICHT treffen darf — sonst wäre
 * „findet eine IBAN" auch dann grün, wenn jede Ziffernfolge eine IBAN wäre.
 *
 * Aufruf:  node tests/smoke_bau25_pseudonym.mjs   ·   Exit 0 = grün.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
require(resolve(repoRoot, "src/modules/25_pseudonym.js"));
const P = globalThis.SbkimPseudonym;

let pass = 0, fail = 0;
function ok(cond, name, info) {
  if (cond) { pass++; console.log("  ok   " + name); }
  else { fail++; console.log("  FAIL " + name + (info ? "  → " + info : "")); }
}
function sorten(text, opt) { return P.find(text, opt).map((f) => f.type + "=" + f.value); }

// Erfundene Testwerte. Die IBAN ist das Standard-Beispiel mit gültiger Prüfziffer.
const IBAN = "DE89 3704 0044 0532 0130 00";
const KEY = "sk-ant-" + "A".repeat(24);

// --- 1) jede Sorte trifft, und nur sie ---
ok(sorten("Schlüssel " + KEY + " hier")[0] === "SCHLUESSEL=" + KEY, "1a Anthropic-Schlüssel ist SCHLUESSEL");
ok(sorten('password = "geheimgeheim12"').join() === "SCHLUESSEL=geheimgeheim12", "1b Passwort-Feld: nur der WERT, der Feldname bleibt");
ok(sorten("Authorization: Bearer abcdefghijklmnop1234").join() === "SCHLUESSEL=abcdefghijklmnop1234", "1c Bearer-Token");
ok(sorten("Schreib an eva.muster@beispiel.de bitte").join() === "MAIL=eva.muster@beispiel.de", "1d Mailadresse");
ok(sorten("Ruf an: +49 170 1234567 abends").join() === "TELEFON=+49 170 1234567", "1e Telefon mit Ländervorwahl");
ok(sorten("Kundennr. 0170 1234567").length === 0, "1f Gegenrichtung: Ziffern ohne Ländervorwahl sind kein Telefon");
ok(sorten("IBAN " + IBAN + " ok").join() === "IBAN=" + IBAN, "1g IBAN mit stimmender Prüfziffer");
ok(sorten("IBAN DE89 3704 0044 0532 0130 01").length === 0, "1h Gegenrichtung: falsche Prüfziffer ist keine IBAN");
ok(sorten("Summe 1.248,50 EUR fällig").join() === "BETRAG=1.248,50 EUR", "1i Betrag mit Tausenderpunkt GANZ (Klaus 2026-09-21)");
ok(sorten("Summe 1.234.567,89 € fällig").join() === "BETRAG=1.234.567,89 €", "1j Betrag mit zwei Tausenderpunkten ganz");
ok(sorten("zahle € 12,00 bar").join() === "BETRAG=€ 12,00", "1k Währung vor dem Betrag");
ok(sorten("Version 1.2 von 2026").length === 0, "1l Gegenrichtung: Zahl ohne Währung ist kein Betrag");
ok(sorten("Rechnung RE-2026-04871 offen").join() === "RECHNUNG=RE-2026-04871", "1m freistehende Rechnungsnummer (Klaus 2026-09-21)");
ok(sorten('{"rechnungsnummer": "A-7781"}').join() === "RECHNUNG=A-7781", "1n Rechnungsnummer als Feld: nur der Wert");

// --- 1b) Datum (Klaus 2026-10-02, Grenzen-Liste Punkt 4) ---
ok(sorten("Geboren am 12.03.1985 in Kiel").join() === "DATUM=12.03.1985", "1o Datum TT.MM.JJJJ");
ok(sorten("Frist 1.3.26 beachten").join() === "DATUM=1.3.26", "1p Datum kurz T.M.JJ");
ok(sorten("Stand 2026-03-12 laut Akte").join() === "DATUM=2026-03-12", "1q Datum ISO");
ok(sorten("Brief vom 12/03/2026 liegt bei").join() === "DATUM=12/03/2026", "1r Datum mit Schrägstrich");
ok(sorten("am 3. Mai 2026 und am 24. Dezember").join() === "DATUM=3. Mai 2026,DATUM=24. Dezember", "1s Datum mit Monatsnamen, Jahr frei");
ok(sorten("bis 1. Jan. zahlen").join() === "DATUM=1. Jan.", "1t Datum mit abgekürztem Monat");
ok(sorten("Version 1.10.12.5, IP 192.168.1.1, 12.30 Uhr, 3.5 Sterne").length === 0, "1u Gegenrichtung: Version, IP, Uhrzeit sind kein Datum");
ok(sorten("Tag 32.01.2026 und Monat 13.13.2026").length === 0, "1v Gegenrichtung: ungültiger Tag oder Monat ist kein Datum");
ok(sorten("Summe 1.248,50 EUR").join() === "BETRAG=1.248,50 EUR", "1w Gegenrichtung: ein Betrag wird nicht zum Datum");
ok(P.find("Ende 12.03.2026.")[0].value === "12.03.2026", "1x Satzpunkt nach dem Datum gehört nicht dazu");
const fr = P.pseudonymize("Zahlen Sie bis 15.11.2026.");
ok(P.rehydrate("Bitte bis " + fr.findings[0].token + " überweisen.", fr.map) === "Bitte bis 15.11.2026 überweisen.", "1y eine Frist kommt beim Zurückholen wieder");
ok(sorten("am 12.03.2026", { types: ["MAIL"] }).length === 0, "1z wer DATUM nicht in types nennt, bekommt kein Datum");

// --- 2) Namen: nur aus der Liste, an Wortgrenzen, ohne Groß/klein ---
ok(sorten("Frau Müller kommt", { values: ["Müller"] }).join() === "NAME=Müller", "2a Name aus der Liste");
ok(sorten("in der Müllerstraße", { values: ["Müller"] }).length === 0, "2b Gegenrichtung: Müller trifft nicht Müllerstraße");
ok(sorten("MÜLLER ruft an", { values: ["Müller"] }).join() === "NAME=MÜLLER", "2c ohne Groß/klein");
ok(sorten("Frau Müller kommt").length === 0, "2d ohne Liste wird kein Name geraten");

// --- 3) pseudonymize: Platzhalter, gleicher Wert gleicher Platzhalter, Zeilen ---
const TEXT = "Hallo Eva Muster,\nbitte " + IBAN + " belasten: 1.248,50 EUR.\nKopie an eva.muster@beispiel.de und nochmal Eva Muster.";
const r = P.pseudonymize(TEXT, { values: ["Eva Muster"] });
ok(r.text.includes("⟦IBAN-1⟧") && r.text.includes("⟦BETRAG-1⟧") && r.text.includes("⟦MAIL-1⟧"), "3a Platzhalter im neuen Format ⟦TYP-n⟧");
ok((r.text.match(/⟦NAME-1⟧/g) || []).length === 2 && !r.text.includes("⟦NAME-2⟧"), "3b derselbe Name zweimal → derselbe Platzhalter");
ok(!r.text.includes("Eva Muster") && !r.text.includes("0532") && !r.text.includes("1.248") && !r.text.includes("@"), "3c kein Klartext mehr im Text, auch keine Ziffer des Betrags");
ok(r.text.includes("1.⟦") === false, "3d keine führende 1. vor dem Betrags-Platzhalter");
ok(P.rehydrate(r.text, r.map) === TEXT, "3e Hin und zurück ergibt den Text Zeichen für Zeichen");
ok(r.findings.map((f) => f.line).join() === "1,2,2,3,3", "3f jede Fundstelle trägt ihre Zeile", r.findings.map((f) => f.line).join());
ok(r.findings.every((f) => TEXT.slice(f.start, f.end) === f.value), "3g start/end zeigen genau auf den Wert");
ok(P.findLeak(r.text, r.map) === null, "3h findLeak: verdeckter Text ist sauber");
ok(P.findLeak(r.text + " Eva Muster", r.map) === "Eva Muster", "3i findLeak: ein nachgetippter Klartext wird gefunden");

// --- 4) Überlappung: die Mail im Schlüssel-Feld wird nicht zerschnitten ---
const r4 = P.find("Mail max@beispiel.de, Betrag 5,00 EUR");
ok(r4.length === 2 && r4[0].type === "MAIL" && r4[1].type === "BETRAG", "4a zwei Sorten nebeneinander, nach Lage sortiert");
const r4b = P.find("password=" + KEY);
ok(r4b.length === 1 && r4b[0].value === KEY, "4b überlappende Treffer: genau einer bleibt");

// --- 5) vorhandene Platzhalter werden nicht verschachtelt, alte werden gelesen ---
const r5 = P.pseudonymize(r.text, { values: ["Eva Muster"], map: r.map });
ok(r5.text === r.text && r5.tokens.length === 0, "5a zweiter Lauf über verdeckten Text ändert nichts");
const r5e = P.pseudonymize("⟦IBAN-1⟧ und [[TEL_2]] Akte 42", { types: [], customPatterns: [{ type: "AKTE", regex: /\d+/ }] });
ok(r5e.text === "⟦IBAN-1⟧ und [[TEL_2]] Akte ⟦AKTE-1⟧", "5e ein Muster, das IN einem Platzhalter träfe, lässt ihn heil", r5e.text);
ok(P.rehydrate("Konto [[IBAN_1]]", { "[[IBAN_1]]": IBAN }) === "Konto " + IBAN, "5b alter Platzhalter [[IBAN_1]] wird weiter aufgedeckt");
const r5c = P.pseudonymize("an eva.muster@beispiel.de", { map: { "[[EMAIL_1]]": "alt@beispiel.de" } });
ok(r5c.text === "an ⟦MAIL-1⟧", "5c alte Zuordnung stört die neue Zählung nicht");
ok(P.parseToken("[[IBAN_3]]").index === 3 && P.isToken("[[EMAIL_1]]"), "5d parseToken/isToken lesen das alte Format");

// --- 6) Fortführung über Läufe ---
const a = P.pseudonymize("an eva.muster@beispiel.de");
const b = P.pseudonymize("von eva.muster@beispiel.de und max@beispiel.de", { map: a.map });
ok(b.text === "von ⟦MAIL-1⟧ und ⟦MAIL-2⟧", "6 mit options.map: gleiche Adresse behält ihre Nummer");

// --- 7) Objekte ---
const rec = { name: "Eva Muster", betrag: 1248.5, mail: "eva.muster@beispiel.de", tags: ["Eva Muster", 3] };
const ro = P.pseudonymizeObject(rec, { values: ["Eva Muster"] });
ok(ro.data.name === "⟦NAME-1⟧" && ro.data.tags[0] === "⟦NAME-1⟧", "7a eine Zuordnung über alle Felder");
ok(ro.data.betrag === 1248.5 && ro.data.tags[1] === 3, "7b Zahlen bleiben Zahlen (benannte Grad-B-Grenze)");
ok(JSON.stringify(P.rehydrateObject(ro.data, ro.map)) === JSON.stringify(rec), "7c rehydrateObject stellt das Objekt her");

// --- 8) Sortenwahl, eigene Muster, alte Sortennamen ---
ok(sorten("eva@beispiel.de " + IBAN, { types: ["IBAN"] }).join() === "IBAN=" + IBAN, "8a types schränkt ein");
ok(sorten("eva@beispiel.de", { types: ["EMAIL"] }).join() === "MAIL=eva@beispiel.de", "8b alter Sortenname EMAIL wird verstanden");
ok(sorten("Akte AZ-2026-777", { types: [], customPatterns: [{ type: "AKTE", regex: /AZ-\d{4}-\d+/ }] }).join() === "AKTE=AZ-2026-777", "8c eigenes Muster (ohne g-Flag)");
ok(P.isIban(IBAN) && !P.isIban("DE00 0000 0000 0000 0000 00"), "8d isIban rechnet die Prüfziffer");

// --- 9) Tresor, Helfer, Fehler ---
ok(JSON.stringify(P.parseVault(P.serializeVault(r.map))) === JSON.stringify(r.map), "9a Tresor hin und zurück");
ok(P.rehydrate("⟦FREMD-9⟧ bleibt", {}) === "⟦FREMD-9⟧ bleibt", "9b unbekannter Platzhalter bleibt stehen");
ok(P.makeToken("IBAN", 3) === "⟦IBAN-3⟧", "9c makeToken im neuen Format");
function wirft(fn) { try { fn(); return false; } catch (e) { return e.name === "InvalidPseudonymArgError"; } }
ok(wirft(() => P.pseudonymize(123)) && wirft(() => P.find(null)), "9d text kein String → wirft");
ok(wirft(() => P.pseudonymize("x", { values: "nope" })), "9e values kein Array → wirft");
ok(wirft(() => P.makeToken("iban", 1)) && wirft(() => P.parseVault("kein json")), "9f Fehlbedienung → wirft");

// --- 10) Verfassung ---
ok(P._meta.protocolVersion === "0.1" && P._meta.buildFree === true, "10a protocolVersion 0.1, build-frei");
ok(P._meta.defaultTypes.join("+") === "SCHLUESSEL+MAIL+IBAN+BETRAG+RECHNUNG+TELEFON+DATUM", "10b alle sieben Sorten standardmäßig an");
ok(P._meta.ausgefallen.length === 0, "10c in Node fällt kein Muster aus", P._meta.ausgefallen.join());
ok(P._meta.generation === 2, "10d Generation 2");

console.log(`\n== Ergebnis: ${pass} ok, ${fail} FAIL ==`);
process.exit(fail === 0 ? 0 : 1);
