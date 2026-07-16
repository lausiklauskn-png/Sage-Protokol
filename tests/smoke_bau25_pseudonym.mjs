#!/usr/bin/env node
/*
 * Smoke — Modul 25 Pseudonymisierung (E2E Grad B), Bau 2026-07-16 (B5).
 *
 * Beweist die Kern-Logik headless (reiner Text-/Objekt-Transform, keine Krypto):
 *  - Round-trip: pseudonymize -> rehydrate gibt den Klartext zurück.
 *  - Stabile, aufsteigende Token pro Typ; gleicher Wert -> gleiches Token.
 *  - Kein sensibler Klartext mehr im Ergebnis-Text (Namen/EMAIL/IBAN ersetzt).
 *  - Bestehende Token werden nicht erneut/verschachtelt erkannt.
 *  - map-Fortführung über mehrere Läufe (options.map) hält Token stabil.
 *  - pseudonymizeObject/rehydrateObject: verschachteltes Objekt, Zahlen bleiben.
 *  - serializeVault/parseVault Round-trip.
 *  - rehydrate ist fail-soft bei unbekannten Token.
 *  - Aufrufer-Fehler werfen InvalidPseudonymArgError.
 *  - protocolVersion bleibt 0.1 (Grad B ändert das Draht-Protokoll NICHT).
 *
 * Aufruf:  node tests/smoke_bau25_pseudonym.mjs   ·   Exit 0 = grün.
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);
require(resolve(repoRoot, "src/modules/25_pseudonym.js")); // registriert globalThis.SbkimPseudonym
const P = globalThis.SbkimPseudonym;

let pass = 0, fail = 0;
function ok(cond, name) { if (cond) { pass++; console.log("  ok   " + name); } else { fail++; console.log("  FAIL " + name); } }

console.log("== Modul 25 — Pseudonymisierung (Grad B) ==");

// --- 1) Round-trip Text mit Namen (explizit) + EMAIL + IBAN ---
const text1 =
  "Rechnung an Max Mustermann, E-Mail max@example.com, IBAN DE89 3704 0044 0532 0130 00, Betrag 100 EUR.";
const r1 = P.pseudonymize(text1, { values: [{ value: "Max Mustermann", type: "KUNDE" }] });
ok(r1.text.indexOf("Max Mustermann") === -1, "1a Name ist ersetzt");
ok(r1.text.indexOf("max@example.com") === -1, "1b EMAIL ist ersetzt");
ok(r1.text.indexOf("DE89") === -1, "1c IBAN ist ersetzt");
ok(r1.text.indexOf("[[KUNDE_1]]") !== -1, "1d Token [[KUNDE_1]] gesetzt");
ok(r1.text.indexOf("[[EMAIL_1]]") !== -1, "1e Token [[EMAIL_1]] gesetzt");
ok(r1.text.indexOf("[[IBAN_1]]") !== -1, "1f Token [[IBAN_1]] gesetzt");
ok(r1.text.indexOf("100 EUR") !== -1, "1g Betrag bleibt (Grad-B-Grenze: Metadaten leaken)");
const back1 = P.rehydrate(r1.text, r1.map);
ok(back1 === text1, "1h rehydrate stellt Klartext exakt wieder her");

// --- 2) Kompakte IBAN (ohne Leerzeichen) erkannt ---
const r2 = P.pseudonymize("Konto DE89370400440532013000 bezahlt.");
ok(r2.text.indexOf("[[IBAN_1]]") !== -1 && r2.text.indexOf("DE89") === -1, "2 kompakte IBAN erkannt");

// --- 3) Gleicher Wert -> gleiches Token; aufsteigende Indizes pro Typ ---
const r3 = P.pseudonymize("a@x.de, b@x.de, a@x.de", { types: ["EMAIL"] });
ok((r3.text.match(/\[\[EMAIL_1\]\]/g) || []).length === 2, "3a gleicher Wert -> gleiches Token (2x EMAIL_1)");
ok(r3.text.indexOf("[[EMAIL_2]]") !== -1, "3b zweiter EMAIL -> EMAIL_2");
ok(r3.tokens.length === 2, "3c genau 2 neue Token erzeugt");

// --- 4) Bestehende Token werden nicht erneut erkannt/verschachtelt ---
const r4 = P.pseudonymize("[[KUNDE_1]] schreibt an c@x.de", { types: ["EMAIL"] });
ok(r4.text.indexOf("[[KUNDE_1]]") !== -1, "4a vorhandenes Token bleibt unversehrt");
ok((r4.text.match(/\[\[/g) || []).length === 2, "4b keine Verschachtelung (genau 2 Token-Öffnungen)");

// --- 5) map-Fortführung über zwei Läufe hält Token stabil ---
const first = P.pseudonymize("Kunde Anna Beispiel", { values: ["Anna Beispiel"], valueType: "KUNDE" });
const second = P.pseudonymize("Erneut: Anna Beispiel und Neu: Bert Neu",
  { values: ["Anna Beispiel", "Bert Neu"], valueType: "KUNDE", map: first.map });
ok(second.text.indexOf(first.tokens[0]) !== -1, "5a bekannter Wert behält sein Token über Läufe");
ok(second.text.indexOf("[[KUNDE_2]]") !== -1, "5b neuer Wert bekommt nächsten Index");
ok(P.rehydrate(second.text, second.map) === "Erneut: Anna Beispiel und Neu: Bert Neu", "5c Round-trip mit fortgeführter Map");

// --- 6) Objekt-Transform: verschachtelt, Zahlen bleiben ---
const rec = { kunde: "Max Mustermann", mail: "max@example.com", betrag: 100, pos: ["Max Mustermann", 2] };
const ro = P.pseudonymizeObject(rec, { values: [{ value: "Max Mustermann", type: "KUNDE" }] });
ok(ro.data.betrag === 100, "6a Zahl bleibt Zahl");
ok(ro.data.kunde === ro.data.pos[0], "6b gleicher Name -> gleiches Token im ganzen Objekt");
ok(ro.data.pos[1] === 2, "6c Zahl im Array bleibt");
ok(ro.data.mail.indexOf("[[EMAIL_1]]") !== -1, "6d EMAIL im Objekt ersetzt");
const backObj = P.rehydrateObject(ro.data, ro.map);
ok(JSON.stringify(backObj) === JSON.stringify(rec), "6e rehydrateObject stellt das Objekt exakt wieder her");

// --- 7) Anker-Tresor serialisieren/parsen ---
const vaultStr = P.serializeVault(r1.map);
const parsed = P.parseVault(vaultStr);
ok(JSON.stringify(parsed) === JSON.stringify(r1.map), "7a serializeVault/parseVault Round-trip");
ok(vaultStr.indexOf("sbkimAnchorVault") !== -1, "7b Tresor-Umschlag erkennbar");

// --- 8) rehydrate fail-soft bei unbekannten Token ---
ok(P.rehydrate("[[FREMD_9]] bleibt", {}) === "[[FREMD_9]] bleibt", "8 unbekanntes Token bleibt stehen");

// --- 9) Token-Helfer ---
ok(P.makeToken("IBAN", 3) === "[[IBAN_3]]", "9a makeToken");
ok(P.parseToken("[[IBAN_3]]").type === "IBAN" && P.parseToken("[[IBAN_3]]").index === 3, "9b parseToken");
ok(P.isToken("[[EMAIL_1]]") === true && P.isToken("kein token") === false, "9c isToken");

// --- 10) Custom pattern (Aktenzeichen) ---
const r10 = P.pseudonymize("Akte AZ-2026-777 offen", {
  types: [], customPatterns: [{ type: "AKTE", regex: /AZ-\d{4}-\d+/ }],
});
ok(r10.text.indexOf("[[AKTE_1]]") !== -1 && r10.text.indexOf("AZ-2026-777") === -1, "10 custom pattern greift");

// --- 11) Aufrufer-Fehler werfen InvalidPseudonymArgError ---
function throwsInvalid(fn) {
  try { fn(); return false; } catch (e) { return e.name === "InvalidPseudonymArgError"; }
}
ok(throwsInvalid(() => P.pseudonymize(123)), "11a text kein String -> wirft");
ok(throwsInvalid(() => P.pseudonymize("x", { values: "nope" })), "11b values kein Array -> wirft");
ok(throwsInvalid(() => P.makeToken("iban", 1)), "11c Token-Typ klein -> wirft");
ok(throwsInvalid(() => P.parseVault("kein json")), "11d parseVault Müll -> wirft");

// --- 12) Verfassungs-Invarianten ---
ok(P._meta.protocolVersion === "0.1", "12a protocolVersion bleibt 0.1 (kein Draht-Bruch)");
ok(P._meta.buildFree === true, "12b build-frei markiert");
ok(P._meta.defaultTypes.join("+") === "EMAIL+IBAN", "12c Default-Typen EMAIL+IBAN (TEL opt-in)");

console.log(`\n== Ergebnis: ${pass} ok, ${fail} FAIL ==`);
process.exit(fail === 0 ? 0 : 1);
