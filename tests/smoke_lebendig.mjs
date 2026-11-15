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

// Wechselnde Hintergründe der beiden Galaxien-Screens
const liste = ((start.match(/const GALAXIE_HINTERGRUENDE = \[([\s\S]*?)\];/) || [])[1] || "").match(/'([^']+)'/g) || [];
t("Galaxien-Hintergründe: mindestens zwei Bilder zum Wechseln", liste.length >= 2, `${liste.length} gefunden`);
for (const e of liste) t(`Galaxien-Hintergrund ${e}: liegt im Depot`, da(join(WURZEL, e.replace(/'/g, ""))));
t("Galaxien-Hintergründe: gewechselt wird beim Öffnen beider Screens", /if \(id === 'sonnen' \|\| id === 'observatorium'\) wechsleGalaxieHintergrund\(id\);/.test(start));

// Discovery-Seite: Licht-Schichten über den Bildern
const disc = readFileSync(join(WURZEL, "docs/discovery/index.html"), "utf8");
const licht = ((disc.match(/const LICHT_FILME = \[([^\]]*)\];/) || [])[1] || "").match(/'([^']+)'/g) || [];
t("Discovery: mindestens ein Bild trägt eine Licht-Schicht", licht.length >= 1, `${licht.length} gefunden`);
for (const e of licht) {
  const n = e.replace(/'/g, "");
  t(`Discovery · ${n}: Licht-Film liegt im Depot`, da(join(WURZEL, "assets/discovery/licht", n + ".mp4")));
  t(`Discovery · ${n}: das Bild dazu liegt im Depot`, da(join(WURZEL, "assets/discovery", n + ".webp")));
}
t("Discovery: der Licht-Film lädt nicht vorab und ist stumm", /film\.preload = 'none'/.test(disc) && /film\.muted = true/.test(disc) && /film\.dataset\.src = /.test(disc));
t("Discovery: der Film liegt als Licht über dem Bild, nicht an seiner Stelle", /\.licht-film \{[^}]*mix-blend-mode: screen/.test(disc));
const staerke = Number((disc.match(/\.licht-film\.laeuft \{ opacity: ([0-9.]+); \}/) || [])[1]);
t("Discovery: die Licht-Schicht liegt gedämpft über dem Bild (höchstens 40 %)", staerke > 0 && staerke <= 0.4, `opacity ${staerke}`);
t("Discovery: kein Film bei „Bewegung reduzieren“ oder Save-Data", /prefers-reduced-motion: reduce\)'\)\.matches\s*&& !\(navigator\.connection && navigator\.connection\.saveData\)/.test(disc));

// Einladung: Film als Licht-Schicht, weiche Nähte zwischen den Szenen (Klaus 2026-11-15)
const einl = readFileSync(join(WURZEL, "docs/einladung/index.html"), "utf8");
t("Einladung: der Szenen-Film liegt als Licht über dem Standbild", /\.szenen-film \{[^}]*mix-blend-mode: screen/.test(einl) && /\.szenen-film\.laeuft \{ opacity: 1; \}/.test(einl));
t("Einladung: die Tür-Szene legt nach oben und unten ein weiches Band über die Naht", /section\.scene-doorway::before, section\.scene-doorway::after \{/.test(einl) && /section\.scene-doorway::before \{ top: -42vh; \}/.test(einl) && /section\.scene-doorway::after \{\s*bottom: -16vh; height: 58vh;/.test(einl));
t("Einladung: der Schlüssel-Kasten läuft an den Rändern aus", /#scene-5 \.key-host \.key-image, #scene-5 \.key-host canvas \{\s*-webkit-mask-image/.test(einl));

// Startseite: Vollbild, Klappkarten, Meilenstein-Kachel, Sonne (Klaus 2026-11-15)
t("Galaxien-Screens: füllen offen das ganze Fenster", /\.sonnen-screen\.active, \.observatorium-screen\.active \{ position: fixed; inset: 0;/.test(start));
const klapp = [...start.matchAll(/data-back-anchor="([^"]+)" data-klapp/g)].map((m) => m[1]);
t("Klappkarten: die fünf benannten Karten liegen unter einem Knopf", ["module-list", "stationen", "reading", "sage-identitaet", "andock"].every((k) => klapp.includes(k)), klapp.join(","));
t("Klappkarten: Einladung und Discovery bleiben offen", !klapp.includes("einladung") && !klapp.includes("discovery"));
t("Klappkarten: der Inhalt startet versteckt und der Kopf ist bedienbar", /inhalt\.hidden = true/.test(start) && /kopf\.setAttribute\('role', 'button'\)/.test(start) && /e\.key === 'Enter'/.test(start));
t("Meilenstein: die ganze Kachel schaltet auf und zu", /if \(kachel && !e\.target\.closest\('a, \.ms-link'\)\) kachel\.classList\.toggle\('is-open'\)/.test(start) && !/class="ms-bot" onclick=/.test(start));
t("Sonne: keine kreisenden Galaxien mehr", !/sun-bahn|sun-koerper/.test(start));
t("Galaxien: drehen sich sichtbar und mit nachlaufenden Armen", /\.mu-bild \{[^}]*galaxy-spin 26s linear infinite reverse/.test(start));
t("Apps: das Raster füllt die Kartenbreite", /\.endknoten-grid \{ grid-template-columns: repeat\(auto-fill, minmax\(min\(100%, 14\.5rem\), 1fr\)\); \}/.test(start) && /class="card span-12" data-back-anchor="endknoten"/.test(start));

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══`);
process.exit(rot ? 1 : 0);
