/* smoke_meilenstein_bilder.mjs — die Meilenstein-Bilder muessen ANKOMMEN.
 *
 * ANLASS (2026-08-11, Klaus: „da fehlen die Bilder"): Alle fuenf Kacheln
 * starteten mit der Klasse `ms-noimg`, die das Bild auf `display:none`
 * setzt; ein `onload` sollte sie wieder abnehmen. Dieses `onload` kam nie:
 *
 *     display:none   → das Bild hat keine Anzeige-Flaeche
 *     loading="lazy" → ein Bild ohne Flaeche wird gar nicht erst geholt
 *     kein Abruf     → kein onload → Klasse bleibt → fuer immer versteckt
 *
 * Im echten Chromium gemessen: alle fuenf `complete:false`, `naturalWidth:0`,
 * und in der Netz-Aufzeichnung KEIN EINZIGER Abruf. Nicht fehlgeschlagen —
 * nie gestellt. Deshalb war auch nichts kaputt zu SEHEN, und deshalb fiel es
 * so lange nicht auf.
 *
 * Lauf: node tests/smoke_meilenstein_bilder.mjs   (braucht nichts weiter)
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(wurzel, "index.html"), "utf8");

let bestanden = 0, gefallen = 0;
const pruef = (ok, text) => {
  if (ok) { bestanden++; console.log("  ✓ " + text); }
  else { gefallen++; console.log("  ✗ " + text); }
};

console.log("\n── Meilenstein-Bilder ──");

// 1) Der Kern: KEINE Kachel startet in der Fehler-Fassung.
const startklassen = [...html.matchAll(/<article class="(ms-tile[^"]*)"/g)].map((m) => m[1]);
pruef(startklassen.length >= 5, `${startklassen.length} Meilenstein-Kacheln gefunden`);
const mitNoimg = startklassen.filter((k) => /\bms-noimg\b/.test(k));
pruef(mitNoimg.length === 0,
  "keine Kachel startet mit ms-noimg (sonst Sackgasse aus display:none + lazy)" +
  (mitNoimg.length ? `\n      betroffen: ${mitNoimg.join(" | ")}` : ""));

// 2) Der Weg in die Fehler-Fassung fuehrt ueber onerror — der muss bleiben.
const onerror = (html.match(/onerror="[^"]*ms-noimg[^"]*"/g) || []).length;
pruef(onerror >= 5, `${onerror} Kacheln fallen bei echtem Fehler auf die Emoji-Fassung zurück`);

// 3) Jedes verlinkte Bild muss auch wirklich im Repo liegen.
const quellen = [...html.matchAll(/<img class="ms-img"[^>]*src="([^"]+)"/g)].map((m) => m[1]);
pruef(quellen.length >= 5, `${quellen.length} Bild-Quellen verlinkt`);
const fehlend = quellen.filter((q) => !existsSync(resolve(wurzel, q)));
pruef(fehlend.length === 0,
  "alle verlinkten Bilder liegen im Repo" + (fehlend.length ? ` — fehlt: ${fehlend.join(", ")}` : ""));

// 4) Der Verlauf gehoert an .ms-tile selbst, nicht nur an die Fehler-Fassung —
//    sonst steht eine Kachel waehrend des Ladens leer.
pruef(/\.ms-tile \{[^}]*radial-gradient/.test(html),
  "der Verlauf liegt am .ms-tile selbst (Untergrund beim Laden UND im Fehlerfall)");

console.log(`\n${bestanden} bestanden, ${gefallen} fehlgeschlagen\n`);
process.exit(gefallen ? 1 : 0);
