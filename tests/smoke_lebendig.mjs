#!/usr/bin/env node
/* smoke_lebendig.mjs — die kleinen Filme hinter den Bildern und das Schwarze Loch zeigen auf
 * Dateien, die es gibt, und laden nichts vorab.
 *
 * Alles hier ist fail-soft gebaut: fehlt ein Film, bleibt das Bild stehen und niemand merkt es.
 * Genau deshalb braucht es eine Probe, die hineinsieht.
 *
 *   node tests/smoke_lebendig.mjs            # prüft das Depot
 *   LEBENDIG_WURZEL=/pfad node tests/…       # prüft eine Kopie (für die Gegenprobe)
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = process.env.LEBENDIG_WURZEL || resolve(dirname(fileURLToPath(import.meta.url)), "..");
let rot = 0, gruen = 0;
const t = (name, ok, detail = "") => {
  if (ok) { gruen++; console.log("  ✓ " + name); }
  else { rot++; console.log("  ✗ " + name + (detail ? " — " + detail : "")); }
};
const da = (p) => existsSync(p) && statSync(p).size > 1000;

function filme(seite, klassen, erwartet) {
  const html = readFileSync(join(WURZEL, seite), "utf8");
  const basis = dirname(join(WURZEL, seite));
  const funde = [...html.matchAll(/<video\b([^>]*)>/g)].map((m) => m[1])
    .filter((a) => klassen.some((k) => new RegExp('class="[^"]*\\b' + k + '\\b').test(a)));
  t(`${seite}: ${erwartet} Filme der Sorte ${klassen.join("/")}`, funde.length === erwartet, `${funde.length} gefunden`);
  for (const a of funde) {
    const src = (a.match(/data-src="([^"]+)"/) || [])[1];
    const name = src || "(ohne data-src)";
    t(`${seite} · ${name}: Film liegt im Depot`, !!src && da(join(basis, src)));
    t(`${seite} · ${name}: lädt nicht vorab und ist stumm`, /preload="none"/.test(a) && /\bmuted\b/.test(a) && !/\ssrc=/.test(a));
    t(`${seite} · ${name}: kommt nicht von einem fremden Host`, !/^(https?:)?\/\//.test(src || ""));
  }
  return html;
}

const start = filme("index.html", ["ms-film", "sun-film", "universe-film"], 7);
filme("docs/einladung/index.html", ["szenen-film"], 2);

// Schwarzes Loch
t("index.html: lädt assets/schwarzes-loch.js", /<script src="assets\/schwarzes-loch\.js"><\/script>/.test(start));
t("schwarzes-loch.js liegt im Depot", da(join(WURZEL, "assets/schwarzes-loch.js")));
const aufruf = (start.match(/SchwarzesLoch\.einbauen\(szene, \{([\s\S]*?)\}\)/) || [])[1] || "";
const video = (aufruf.match(/video: '([^']+)'/) || [])[1], poster = (aufruf.match(/poster: '([^']+)'/) || [])[1];
t("Schwarzes Loch: der Rückfall-Film liegt im Depot", !!video && da(join(WURZEL, video)));
t("Schwarzes Loch: das Standbild liegt im Depot", !!poster && da(join(WURZEL, poster)));
t("Schwarzes Loch: der Knopf startet versteckt (kein toter Knopf)", /id="bh-steuern" hidden/.test(start));
const js = existsSync(join(WURZEL, "assets/schwarzes-loch.js")) ? readFileSync(join(WURZEL, "assets/schwarzes-loch.js"), "utf8") : "";
t("schwarzes-loch.js: regelt die Auflösung nach der Bildrate", /dtMittel > 25 && st\.scale > unten/.test(js));
t("schwarzes-loch.js: gibt an die Aufnahme ab, wenn es nicht reicht", /aufgeben\(\)/.test(js) && /function aufnahme\(\)/.test(js));
t("schwarzes-loch.js: ruht, wenn die Karte nicht zu sehen ist", /IntersectionObserver/.test(js) && /document\.hidden/.test(js));

// Meilenstein-Kachel wächst beim Öffnen
t("Meilenstein: die offene Kachel nimmt zwei Spalten", /\.ms-tile\.is-open \{ aspect-ratio: auto; grid-column: span 2; \}/.test(start));
t("Meilenstein: die offene Kachel bleibt mindestens quadratisch", /k\.style\.minHeight = k\.classList\.contains\('is-open'\) \? k\.offsetWidth \+ 'px' : ''/.test(start));

// Observatorium
t("Observatorium: die Mini-Universen werden gemalt", /function malMiniUniversum\(/.test(start) && /try \{ malMiniUniversum\(el, lehre\.shape, lehre\.n\); \} catch/.test(start));
t("Observatorium: die Schleife ruht, solange ein anderer Screen offen ist", /if \(stage\.offsetParent === null\) \{\s*filmSchalten\(false\);/.test(start));

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══`);
process.exit(rot ? 1 : 0);
