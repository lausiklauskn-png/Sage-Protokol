/*
 * Probe: die Bauvorlagen (die „Geschenkbox") sind vollständig und byte-1:1.
 *
 * ── DIE ZWEI KISTEN SIND ABSICHTLICH VERSCHIEDEN GROSS ──────────────────────
 *
 * Das ist der Punkt, an dem diese Probe beim ersten Anlauf falsch war. Sie
 * verlangte von BEIDEN Kisten alle 13 Kanon-Module — und hätte damit die
 * Zweiteilung zementiert weggeputzt, die Klaus bewusst angelegt hat
 * (`docs/MYCEL-GESCHENKBOX.md`):
 *
 *   Stufe 1 · `sbkim-bundle/`       „Verbinden"   — die Minimal-Kiste.
 *       Eigene Identität, Bedeutungs-Match, Handshake, gemeinsamer Raum.
 *       KEIN Siegel, KEINE Lampen, KEINE Membran. Das ist kein Mangel,
 *       sondern das Produkt: wer nur mitreden will, soll nicht das ganze
 *       Vertrauens-Gesicht mitschleppen müssen.
 *
 *   Stufe 2 · `sbkim-bundle-voll/`  „Voll-Knoten" — dazu Siegel, Schutz,
 *       Andock-Wizard, Suche, Safe, Spracheingabe, OCR.
 *
 * ── WARUM ES DIESE PROBE ÜBERHAUPT GIBT ─────────────────────────────────────
 *
 * Am 2026-08-16 fehlte der Stufe-2-Kiste **Modul 07 (Apoptose)**, und ihr
 * `23_rendezvous_ui` hing eine Generation zurück. 07 ist eines der SIEBEN
 * Module, die Modul 16 für sein Siegel verlangt — ohne es stellt sich die App
 * **kein Siegel aus, und zwar stumm**. Es stand in KEINER der beiden Tabellen
 * der Geschenkbox-Doku; die Lücke war also nicht nur im Ordner, sondern schon
 * im Rezept.
 *
 * Das sind die Ordner, auf die `family-project/werkzeuge/geschenkbox.html`
 * direkt verlinkt. Sage verteilte seinen eigenen Rückstand.
 *
 * Gegenprobe: node tests/gegenprobe_bauvorlagen.mjs
 * Lauf:       node tests/smoke_bauvorlagen.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");

// Stufe 1 — „Verbinden". Genau diese neun, nicht mehr.
const STUFE_1 = [
  "01_storage", "02_spore", "03_embedding", "04_match", "05_anastomose",
  "05b_nostr_relay", "23_rendezvous", "23_rendezvous_ui", "noble-secp256k1",
];

// Stufe 2 — „Voll-Knoten". Stufe 1 plus das Vertrauens-Gesicht.
// 07 steht hier, weil Modul 16 es für sein Siegel verlangt. Genau das fehlte.
const STUFE_2 = [...STUFE_1, "07_apoptose", "15_membran", "16_siegel",
                 "17_floating_widget", "19_andock_wizard", "20_schluessel_safe",
                 "21_spracheingabe", "22_such_widget", "24_ocr_eingabe"];

// Die sieben, die Modul 16 fürs Siegel prüft. Fehlt eine, bleibt das Abzeichen
// STUMM aus — kein Fehler, keine Meldung, nur kein Siegel.
const SIEGEL_PFLICHT = ["01_storage", "02_spore", "03_embedding", "04_match",
                        "05_anastomose", "07_apoptose", "15_membran"];

const KISTEN = [
  { ordner: "sbkim-bundle",      soll: STUFE_1, name: "Stufe 1 · Verbinden",   siegelfaehig: false },
  { ordner: "sbkim-bundle-voll", soll: STUFE_2, name: "Stufe 2 · Voll-Knoten", siegelfaehig: true  },
];

let gruen = 0, rot = 0;
const sage = (ok, t) => { ok ? gruen++ : rot++; console.log(`${ok ? "  ✓" : "  ✗ ROT"} ${t}`); };
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");

console.log("\n=== Bauvorlagen (Geschenkbox) ===\n");

for (const k of KISTEN) {
  console.log(`── ${k.name}`);
  const ordner = join(WURZEL, k.ordner, "modules");
  sage(existsSync(ordner), `${k.ordner}/modules liegt vor`);
  if (!existsSync(ordner)) { console.log(""); continue; }

  for (const m of k.soll) {
    const kopie = join(ordner, `${m}.js`);
    const quelle = join(WURZEL, "src/modules", `${m}.js`);
    if (!existsSync(kopie)) { sage(false, `${m} FEHLT`); continue; }
    if (!existsSync(quelle)) { sage(true, `${m} liegt (kein Kanon-Gegenstück)`); continue; }
    sage(sha(kopie) === sha(quelle), `${m} byte-1:1 zum Kanon`);
  }

  // Der Fall, der beim Kopieren am meisten kostet — aber NUR für die Kiste,
  // die ein Siegel verspricht. Stufe 1 verspricht keins.
  if (k.siegelfaehig) {
    const fehlend = SIEGEL_PFLICHT.filter((m) => !existsSync(join(ordner, `${m}.js`)));
    sage(fehlend.length === 0,
         `alle sieben Siegel-Pflicht-Module da${fehlend.length ? " — fehlt: " + fehlend.join(", ") : ""}`);
  } else {
    // Umgekehrt: Stufe 1 darf NICHT heimlich zur Stufe 2 anwachsen. Sonst
    // verschwindet die kleine Kiste, und ein Forker, der nur verbinden will,
    // schleppt das ganze Gesicht mit. (Genau das ist am 2026-08-16 passiert:
    // eine Sitzung hat ihr 07/15/16/17 hinzugefügt, gut gemeint.)
    const zuviel = ["07_apoptose", "15_membran", "16_siegel", "17_floating_widget"]
      .filter((m) => existsSync(join(ordner, `${m}.js`)));
    sage(zuviel.length === 0,
         `bleibt die Minimal-Kiste${zuviel.length ? " — zu viel drin: " + zuviel.join(", ") : ""}`);
  }
  console.log("");
}

// ── Das Rezept muss zur Kiste passen ────────────────────────────────────────
// Eine Kiste ohne Rezept ist ein Ordner; ein Rezept ohne Kiste ist ein Wunsch.
const doku = join(WURZEL, "docs/MYCEL-GESCHENKBOX.md");
sage(existsSync(doku), "docs/MYCEL-GESCHENKBOX.md liegt vor");
if (existsSync(doku)) {
  const t = readFileSync(doku, "utf-8");
  for (const m of STUFE_2) sage(t.includes(m), `das Rezept nennt ${m}`);
}

const pflicht = join(WURZEL, "docs/PFLICHT_MODULE.md");
sage(existsSync(pflicht), "docs/PFLICHT_MODULE.md liegt vor");
if (existsSync(pflicht)) {
  const t = readFileSync(pflicht, "utf-8");
  sage(/SBKIM_DB_SUFFIX/.test(t), "die Liste erklärt die Schubladen-Falle");
  sage(/ES-Modul/.test(t), "die Liste erklärt, warum 05b nicht in die Kette gehört");
  sage(/17 vor 15/.test(t) || /17 (steht )?VOR/i.test(t), "die Liste erklärt die Reihenfolge 17 vor 15/16");
  sage(/CACHE_VERSION/.test(t), "die Liste erklärt den Offline-Vorrat");
}

console.log(`\nErgebnis: ${gruen} grün, ${rot} rot\n`);
process.exit(rot ? 1 : 0);
