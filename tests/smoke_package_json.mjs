/* smoke_package_json.mjs — die package.json darf die Module nicht umdeuten.
 *
 * WARUM ES DIESE PROBE GIBT (2026-08-14). Sage bekam eine package.json, damit
 * `fake-indexeddb` da ist und die 19 Speicher-/Krypto-Proben wieder laufen.
 * Sie trägt bewusst KEIN `"type": "module"`.
 *
 * Das ist kein Aberglaube, sondern gemessen: mit dem Feld fallen zwei Proben
 * um (69 grün → 67 grün, 2 rot). Node deutet dann JEDE `.js`-Datei als
 * ES-Modul — und die SBKIM-Module sind klassische Browser-Skripte, die Tests
 * laden sie direkt per `import("../src/modules/23_rendezvous.js")`.
 *
 * Der Zug ist verführerisch: eine moderne package.json bekommt das Feld fast
 * reflexhaft, und wer es setzt, sieht zwei rote Proben und sucht den Fehler
 * bei den Proben. Deshalb steht der Grund hier, direkt neben der Prüfung.
 *
 * Ebenso wichtig: die Abhängigkeit gehört unter `devDependencies` und ist auf
 * eine EXAKTE Fassung genagelt. Ein `^` würde bedeuten, dass zwei Container
 * verschiedene Fassungen ziehen — und dann prüft nicht mehr jeder dasselbe.
 * Genau die Sorte Unterschied, die man erst bemerkt, wenn eine Probe „bei mir
 * grün" ist.
 *
 * Lauf:  node tests/smoke_package_json.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log("  ✗ " + m); } };

const roh = readFileSync(join(ROOT, "package.json"), "utf8");
let p = null;
try { p = JSON.parse(roh); } catch (e) { ok(false, "package.json ist kein gültiges JSON: " + e.message); }

if (p) {
  ok(!("type" in p),
     'package.json trägt KEIN "type" — sonst werden alle .js als ES-Modul gelesen und zwei Proben fallen um');
  ok(p.private === true, "private: true — dieses Paket wird nie veröffentlicht");
  ok(!p.dependencies || Object.keys(p.dependencies).length === 0,
     "keine Laufzeit-Abhängigkeiten — die Module bleiben build-frei");

  const dev = p.devDependencies || {};
  ok(Object.prototype.hasOwnProperty.call(dev, "fake-indexeddb"),
     "fake-indexeddb steht unter devDependencies");
  for (const [name, fassung] of Object.entries(dev)) {
    ok(/^\d+\.\d+\.\d+$/.test(String(fassung)),
       "exakte Fassung für " + name + " (kein ^ oder ~) — sonst prüft nicht jeder dasselbe, erhalten: " + fassung);
  }
  ok(p.scripts && p.scripts.test === "node tests/run_alle.mjs",
     "npm test führt den Läufer aus, der ALLE Proben laufen lässt");
}

console.log(`\npackage.json-Probe: ${pass} bestanden, ${fail} fehlgeschlagen.`);
process.exit(fail > 0 ? 1 : 0);
