/*
 * Drift-Guard für die Voll-Knoten-Geschenkbox (sbkim-bundle-voll/).
 *
 * Prüft, dass JEDE Modul-Datei in sbkim-bundle-voll/modules/ BYTE-1:1 mit ihrer
 * Kanon-Quelle in Sage-Protokol übereinstimmt (SHA-256). „Kopieren, nicht
 * klonen" (Modul 09): reift ein Modul im Kanon, wird hier NEU kopiert — nie
 * abgewandelt. Zusätzlich: die README nennt alle Dateien und die kritische
 * Ladereihenfolge (17 vor 15 vor 16).
 *
 * Lauf:  node sbkim-bundle-voll/tests/smoke_vollbundle.mjs
 * Erwartet: „ALLE GRÜN".
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const BOX = join(HERE, "..");            // sbkim-bundle-voll/
const ROOT = join(BOX, "..");            // Sage-Protokol/
const CANON = join(ROOT, "src", "modules");
const ASSETS = join(ROOT, "assets");

let ok = 0, fail = 0;
const check = (name, cond) => {
  if (cond) { ok++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name); }
};
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");

// Modul-Datei -> Kanon-Quelle. Die meisten liegen in src/modules/,
// siegel-inhalt.js im Kanon unter assets/.
const MODULE_SOURCES = {
  "01_storage.js": join(CANON, "01_storage.js"),
  "02_spore.js": join(CANON, "02_spore.js"),
  "03_embedding.js": join(CANON, "03_embedding.js"),
  "04_match.js": join(CANON, "04_match.js"),
  "05_anastomose.js": join(CANON, "05_anastomose.js"),
  "05b_nostr_relay.js": join(CANON, "05b_nostr_relay.js"),
  "23_rendezvous.js": join(CANON, "23_rendezvous.js"),
  "23_rendezvous_ui.js": join(CANON, "23_rendezvous_ui.js"),
  "noble-secp256k1.js": join(CANON, "noble-secp256k1.js"),
  "15_membran.js": join(CANON, "15_membran.js"),
  "16_siegel.js": join(CANON, "16_siegel.js"),
  "17_floating_widget.js": join(CANON, "17_floating_widget.js"),
  "19_andock_wizard.js": join(CANON, "19_andock_wizard.js"),
  "20_schluessel_safe.js": join(CANON, "20_schluessel_safe.js"),
  "21_spracheingabe.js": join(CANON, "21_spracheingabe.js"),
  "22_such_widget.js": join(CANON, "22_such_widget.js"),
  "24_ocr_eingabe.js": join(CANON, "24_ocr_eingabe.js"),
  "siegel-inhalt.js": join(ASSETS, "siegel-inhalt.js"),
};

console.log("Drift-Guard sbkim-bundle-voll (byte-1:1 gegen Kanon):");
for (const [file, source] of Object.entries(MODULE_SOURCES)) {
  const boxPath = join(BOX, "modules", file);
  let same = false;
  try { same = sha(boxPath) === sha(source); } catch (e) { same = false; }
  check("byte-1:1 modules/" + file, same);
}

// Der gehärtete Schutz-Stand MUSS in der Box sein (Stufe 2b + Siegel-Aspekt).
check(
  "Modul 23 trägt die Kartenechtheit (Stufe 2b, sha 3caa0bb1)",
  sha(join(BOX, "modules", "23_rendezvous.js")).startsWith("3caa0bb1"),
);
check(
  "Modul 16 trägt den 2026-07-29-Aspekt (sha 4e11ef0d)",
  sha(join(BOX, "modules", "16_siegel.js")).startsWith("4e11ef0d"),
);

// README nennt alle Dateien + die kritische Ladereihenfolge.
const readme = readFileSync(join(BOX, "README.md"), "utf8");
for (const file of Object.keys(MODULE_SOURCES)) {
  check("README nennt " + file, readme.includes(file));
}
const i17 = readme.indexOf("17_floating_widget");
const i15 = readme.indexOf("15_membran");
const i16 = readme.indexOf("16_siegel");
check("README: 17 vor 15 dokumentiert", i17 > -1 && i15 > -1 && i17 < i15);
check("README: 15 vor 16 dokumentiert", i15 > -1 && i16 > -1 && i15 < i16);

// Beispielseite lädt die Kern-Dateien.
const bsp = readFileSync(join(BOX, "beispiel-voll.html"), "utf8");
check("beispiel-voll.html lädt sbkim-connect.js", bsp.includes("sbkim-connect.js"));
check("beispiel-voll.html ruft SbkimWidget.init vor SbkimSiegel.init",
  bsp.indexOf("SbkimWidget.init") > -1 &&
  bsp.indexOf("SbkimSiegel.init") > -1 &&
  bsp.indexOf("SbkimWidget.init") < bsp.indexOf("SbkimSiegel.init"));

console.log("");
if (fail === 0) console.log("ALLE GRÜN — " + ok + " ok, 0 fail");
else console.log("FEHLER — " + ok + " ok, " + fail + " fail");
process.exit(fail === 0 ? 0 : 1);
