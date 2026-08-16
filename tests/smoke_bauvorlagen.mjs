/*
 * Probe: die Bauvorlagen sind vollständig und byte-1:1 zum Kanon.
 *
 * ── WARUM ES DIESE PROBE GIBT ────────────────────────────────────────────────
 *
 * Am 2026-08-16 fiel auf, dass BEIDE Bündel unvollständig waren:
 *
 *   sbkim-bundle/      fehlten 07, 15, 16, 17 — VIER der sieben Module, die
 *                      das Siegel für seine Selbst-Prüfung verlangt
 *   sbkim-bundle-voll/ fehlte 07, und sein 23_rendezvous_ui hing eine
 *                      Generation zurück
 *
 * Das sind genau die Ordner, aus denen ein Forker kopiert. Wer sie genommen
 * hätte, hätte eine App gebaut, die sich kein Siegel ausstellen kann — und
 * gemerkt hätte er es erst, wenn das Abzeichen ausbleibt, ohne Fehlermeldung.
 *
 * Sage verteilte also seinen eigenen Rückstand. Niemand hat es bemerkt, weil
 * niemand nachgesehen hat.
 *
 * Gegenprobe: node tests/gegenprobe_bauvorlagen.mjs
 * Lauf:       node tests/smoke_bauvorlagen.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");

// Die 13 Dateien, aus denen ein Knoten besteht. Begründung je Modul:
// docs/PFLICHT_MODULE.md.
const KANON = [
  "01_storage", "02_spore", "03_embedding", "04_match", "05_anastomose",
  "05b_nostr_relay", "07_apoptose", "15_membran", "16_siegel",
  "17_floating_widget", "23_rendezvous", "23_rendezvous_ui", "noble-secp256k1",
];

// Die sieben, die Modul 16 für sein Siegel verlangt — eine Teilmenge, aber
// die wichtigste: fehlt eine davon, bleibt das Abzeichen stumm aus.
const SIEGEL_PFLICHT = ["01_storage", "02_spore", "03_embedding", "04_match",
                        "05_anastomose", "07_apoptose", "15_membran"];

const VORLAGEN = ["sbkim-bundle", "sbkim-bundle-voll"];

let gruen = 0, rot = 0;
const sage = (ok, t) => { ok ? gruen++ : rot++; console.log(`${ok ? "  ✓" : "  ✗ ROT"} ${t}`); };
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");

console.log("\n=== Bauvorlagen ===\n");

for (const v of VORLAGEN) {
  const ordner = join(WURZEL, v, "modules");
  sage(existsSync(ordner), `${v}/modules liegt vor`);
  if (!existsSync(ordner)) continue;

  for (const m of KANON) {
    const kopie = join(ordner, `${m}.js`);
    const quelle = join(WURZEL, "src/modules", `${m}.js`);
    if (!existsSync(kopie)) { sage(false, `${v}: Modul ${m} FEHLT`); continue; }
    sage(sha(kopie) === sha(quelle), `${v}: ${m} byte-1:1 zum Kanon`);
  }

  // Eigene Zeile, weil es der Fall ist, der beim Kopieren am meisten kostet:
  // ohne diese sieben stellt sich die App kein Siegel aus, und zwar STUMM.
  const fehlend = SIEGEL_PFLICHT.filter((m) => !existsSync(join(ordner, `${m}.js`)));
  sage(fehlend.length === 0,
       `${v}: alle sieben Siegel-Pflicht-Module da${fehlend.length ? " — fehlt: " + fehlend.join(", ") : ""}`);
  console.log("");
}

// Und die Liste selbst muss auffindbar sein — eine Regel, die niemand findet,
// ist keine.
const doku = join(WURZEL, "docs/PFLICHT_MODULE.md");
sage(existsSync(doku), "docs/PFLICHT_MODULE.md liegt vor");
if (existsSync(doku)) {
  const t = readFileSync(doku, "utf-8");
  for (const m of KANON) sage(t.includes(m.replace(/_.*/, "").replace(/^0/, "0")) || t.includes(m),
                              `die Liste nennt ${m}`);
  sage(/SBKIM_DB_SUFFIX/.test(t), "die Liste erklärt die Schubladen-Falle");
  sage(/ES-Modul/.test(t), "die Liste erklärt, warum 05b nicht in die Kette gehört");
  sage(/17 (steht )?VOR/i.test(t) || /17 vor 15/.test(t), "die Liste erklärt die Reihenfolge 17 vor 15/16");
  sage(/CACHE_VERSION/.test(t), "die Liste erklärt den Offline-Vorrat");
}

console.log(`\nErgebnis: ${gruen} grün, ${rot} rot\n`);
process.exit(rot ? 1 : 0);
