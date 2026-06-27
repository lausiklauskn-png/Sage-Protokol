// Headless smoke test für die Standalone-Such-Tool-PWA (such-tool/).
// Run mit `node tests/smoke_standalone_such_tool.mjs`. Prüft, dass der Ordner
// self-contained + installierbar-tauglich ist und die Modul-Kopien NICHT von
// src/modules abdriften (Drift-Guard).

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const toolDir = resolve(repoRoot, "such-tool");

const results = [];
function record(probe, expected, actual, ok) { results.push({ probe, expected: String(expected), actual: String(actual), ok }); }
function eq(probe, expected, actual) { record(probe, expected, actual, expected === actual); }
function ok(probe, cond) { record(probe, "true", String(!!cond), !!cond); }

// ---- Probe 1: Pflicht-Dateien existieren ----
const REQUIRED = [
  "index.html", "manifest.json", "sbkim-sw.js", "impressum.html",
  "icon-192.png", "icon-512.png",
  "modules/03_embedding.js", "modules/04_match.js",
  "modules/21_spracheingabe.js", "modules/22_such_widget.js",
];
for (const f of REQUIRED) ok("Probe 1: existiert " + f, existsSync(resolve(toolDir, f)));

// ---- Probe 2: Modul-Kopien byte-identisch zu src/modules (Drift-Guard) ----
const MODULES = ["03_embedding", "04_match", "21_spracheingabe", "22_such_widget"];
for (const m of MODULES) {
  const src = readFileSync(resolve(repoRoot, "src/modules/" + m + ".js"));
  const copy = existsSync(resolve(toolDir, "modules/" + m + ".js"))
    ? readFileSync(resolve(toolDir, "modules/" + m + ".js")) : Buffer.from("MISSING");
  ok("Probe 2: " + m + ".js identisch zu src/modules", src.equals(copy));
}

// ---- Probe 3: manifest.json gültig + installierbar-tauglich ----
const manifest = JSON.parse(readFileSync(resolve(toolDir, "manifest.json"), "utf8"));
ok("Probe 3: name gesetzt", !!manifest.name);
eq("Probe 3: display standalone", "standalone", manifest.display);
ok("Probe 3: start_url gesetzt", !!manifest.start_url);
ok("Probe 3: scope gesetzt", !!manifest.scope);
const sizes = (manifest.icons || []).map((i) => i.sizes);
ok("Probe 3: Icon 192 vorhanden", sizes.includes("192x192"));
ok("Probe 3: Icon 512 vorhanden", sizes.includes("512x512"));
const hasMaskable = (manifest.icons || []).some((i) => /maskable/.test(i.purpose || ""));
ok("Probe 3: maskable-Icon vorhanden", hasMaskable);
// Alle Icon-Quellen existieren auf der Platte.
for (const ic of manifest.icons || []) {
  const rel = ic.src.replace(/^\.\//, "");
  ok("Probe 3: Icon-Datei existiert " + rel, existsSync(resolve(toolDir, rel)));
}

// ---- Probe 4: Service-Worker hat fetch-Handler + alle APP_SHELL-Dateien da ----
const swSrc = readFileSync(resolve(toolDir, "sbkim-sw.js"), "utf8");
ok("Probe 4: SW hat fetch-Listener (Installierbarkeit)", /addEventListener\(\s*["']fetch["']/.test(swSrc));
ok("Probe 4: SW hat install-Listener", /addEventListener\(\s*["']install["']/.test(swSrc));
// APP_SHELL-Einträge aus dem SW herauslesen und auf Existenz prüfen.
const shellMatch = swSrc.match(/var APP_SHELL = \[([\s\S]*?)\];/);
ok("Probe 4: APP_SHELL-Liste gefunden", !!shellMatch);
if (shellMatch) {
  const entries = [...shellMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  for (const e of entries) {
    if (e === "./") continue; // Verzeichnis-Wurzel = index.html, separat geprüft
    const rel = e.replace(/^\.\//, "");
    ok("Probe 4: APP_SHELL-Datei existiert " + rel, existsSync(resolve(toolDir, rel)));
  }
}

// ---- Probe 5: index.html verdrahtet Module + Manifest + SW + Impressum ----
const html = readFileSync(resolve(toolDir, "index.html"), "utf8");
ok("Probe 5: lädt manifest.json", /href="\.\/manifest\.json"/.test(html));
ok("Probe 5: registriert sbkim-sw.js", /register\("\.\/sbkim-sw\.js"\)/.test(html));
ok("Probe 5: verlinkt impressum.html", /href="\.\/impressum\.html"/.test(html));
for (const m of MODULES) {
  ok("Probe 5: lädt modules/" + m, new RegExp('src="\\./modules/' + m + '\\.js"').test(html));
}
ok("Probe 5: ruft SbkimSearchWidget.init", /SbkimSearchWidget\.init\(/.test(html));

// ---- Probe 6: Impressum mit Forker-Hinweis (Klaus 2026-06-27) --------------
// Konventions-Evolution: Klaus' Live-Instanz dieses Werkzeugs trägt sein echtes,
// rechtlich erforderliches Impressum (wie das Haupt-Sage-Impressum auch). Statt
// auf Platzhalter zu prüfen, sichern wir jetzt ab, dass ein klarer FORKER-HINWEIS
// vorhanden ist — er erinnert jeden, der das Werkzeug kopiert, die Betreiber-
// Angaben durch die EIGENEN zu ersetzen (Schutz vor versehentlichem PII-Mitschleppen).
const imp = readFileSync(resolve(toolDir, "impressum.html"), "utf8");
ok("Probe 6: Impressum enthält Forker-Hinweis (Angaben ersetzen)", /Hinweis für Forker/.test(imp) && /ersetzt/.test(imp));

// ---- Auswertung ----
let allOk = true;
console.log("\n=== Standalone Such-Tool Smoke-Test ===");
for (const r of results) {
  const mark = r.ok ? "✓" : "✗";
  console.log(`${mark} ${r.probe}\n   erwartet: ${r.expected}\n   erhalten: ${r.actual}`);
  if (!r.ok) allOk = false;
}
console.log(`\nTotal: ${results.length} Proben, ${results.filter((r) => r.ok).length} grün, ${results.filter((r) => !r.ok).length} rot.`);
if (!allOk) process.exit(1);
