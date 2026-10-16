/* Waechter: tools/kanon-verteilen.mjs zieht beim Cache-Bump auch das MANIFEST
 * und die PROBEN mit, die die Cache-Kennung festnageln (Pflege-Liste § 18).
 *   node tests/smoke_kanon_mitziehen.mjs
 *
 * WARUM ES DIESE PROBE GIBT. Am 2026-10-15 viermal dieselben zwei Stellen von
 * Hand: In-and-Out-Book `?v=` in manifest.json, Kim-sync `kimsync-vNN` in
 * tests/smoke.mjs. Die Proben der Apps haben es jedes Mal gefunden — nach dem
 * Rollout, nicht davor.
 *
 * ⚠ SIE FAEHRT DAS WERKZEUG WIRKLICH, an einem Wegwerf-Netz unter tmp. Die
 * echten Repos werden nie angefasst. Gemessen werden BEIDE Richtungen: was
 * mitwandern muss, und was liegen bleiben muss (Icon-Zaehler, fremde
 * Kennungen, kurze Vorsilben).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const ok = (b, m, d = "") => { if (b) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m, d ? "— " + d : ""); } };
const werkzeug = join(wurzel, "tools", "kanon-verteilen.mjs");
const modul = (nr, inhalt) => `/*\n * SBKIM — Modul ${nr} — Probe\n */\n${inhalt}\n`;

function netzBauen() {
  const w = mkdtempSync(join(tmpdir(), "kanon-mz-"));
  const sage = join(w, "Sage-Protokol");
  mkdirSync(join(sage, "src", "modules"), { recursive: true });
  mkdirSync(join(sage, "tools"), { recursive: true });
  writeFileSync(join(sage, "tools", "kanon-verteilen.mjs"), readFileSync(werkzeug));
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var NEU = 2;"));

  const app = (name, dateien) => {
    const p = join(w, name);
    for (const [rel, inhalt] of Object.entries(dateien)) {
      mkdirSync(join(p, dirname(rel)), { recursive: true });
      writeFileSync(join(p, rel), inhalt);
    }
    mkdirSync(join(p, ".git"), { recursive: true });
    return p;
  };
  const sw = (kennung) => `const CACHE = '${kennung}';\n`
    + `const CORE = ["./", "index.html", "modules/16_siegel.js?v=19"];\n`
    + `self.addEventListener("fetch", (e) => e.respondWith(caches.match(e.request).then((h) => h || fetch(e.request))));\n`;

  /* Wie In-and-Out-Book UND Kim-sync zugleich: ?v= an der Cache-Nummer im
   * Manifest, und eine Probe, die die Kennung festnagelt. Dazu, was liegen
   * bleiben MUSS: ein absichtlich alter Vorrat `appa-v4`, eine laengere
   * Kennung `appa-v190`, eine fremde `fremd-appa-v19`. */
  const a = app("App-A", {
    "modules/16_siegel.js": modul(16, "var ALT = 1;"),
    "index.html": `<script src="modules/16_siegel.js?v=19"></script>\n`,
    "sw.js": sw("appa-v19"),
    "manifest.json": `{ "icons": [ { "src": "icons/icon-192.png?v=19" } ] }\n`,
    "tests/smoke.mjs": [
      `ok("sw.js: CACHE ist appa-v19", /const CACHE = 'appa-v19'/.test(s));`,
      `await caches.open('appa-v4');`,
      `const lang = "appa-v190";`,
      `const fremd = "fremd-appa-v19";`,
    ].join("\n") + "\n",
    "tests/teil/stand.json": `{ "version": "appa-v19" }\n`,
    /* Gehoert tools/cache-stand.mjs (Pflege-Liste #13) — darf NICHT wandern. */
    "tests/cache-stand.json": `{ "version": "appa-v19", "sha": "x" }\n`,
  });
  /* Wie Rezeptbuch/Mixarium: ?v=1 ist der ICON-Zaehler, nicht die Cache-Nummer. */
  const b = app("App-B", {
    "modules/16_siegel.js": modul(16, "var ALT = 1;"),
    "index.html": `<script src="modules/16_siegel.js"></script>\n`,
    "sw.js": sw("appb-v19"),
    "site.webmanifest": `{ "icons": [ { "src": "icon.png?v=1" } ] }\n`,
  });
  /* Kurze Vorsilbe: `v19` stuende in jeder Probe fuer etwas anderes. */
  const c = app("App-C", {
    "modules/16_siegel.js": modul(16, "var ALT = 1;"),
    "index.html": `<script src="modules/16_siegel.js"></script>\n`,
    "sw.js": sw("v19"),
    "tests/smoke.mjs": `const x = "v19";\n`,
  });
  return { w, sage, a, b, c };
}

function lauf(sage, w, extra = []) {
  const r = spawnSync("node", [join(sage, "tools", "kanon-verteilen.mjs"), "--nachbarn", w, ...extra], { encoding: "utf8" });
  return { text: String(r.stdout || "") + String(r.stderr || ""), code: r.status };
}
const lies = (p, rel) => readFileSync(join(p, rel), "utf8");

/* ══ 1. Nur nachsehen ══════════════════════════════════════════════════ */
console.log("Nur nachsehen:");
{
  const { w, sage, a } = netzBauen();
  const vorM = lies(a, "manifest.json"), vorP = lies(a, "tests/smoke.mjs");
  lauf(sage, w);
  ok(lies(a, "manifest.json") === vorM, "nachsehen: manifest.json bleibt unberuehrt");
  ok(lies(a, "tests/smoke.mjs") === vorP, "nachsehen: die Probe bleibt unberuehrt");
  rmSync(w, { recursive: true, force: true });
}

/* ══ 2. Schreiben ══════════════════════════════════════════════════════ */
console.log("Schreiben:");
{
  const { w, sage, a, b, c } = netzBauen();
  const r = lauf(sage, w, ["--schreiben"]);
  ok(/const CACHE = 'appa-v20'/.test(lies(a, "sw.js")), "Voraussetzung: der Bump hat stattgefunden (appa-v20)", lies(a, "sw.js").split("\n")[0]);
  ok(/icon-192\.png\?v=20/.test(lies(a, "manifest.json")),
    "manifest.json: ?v= an der Cache-Nummer zieht mit (19 → 20)", lies(a, "manifest.json").trim());
  const probe = lies(a, "tests/smoke.mjs");
  ok(/CACHE ist appa-v20/.test(probe) && /const CACHE = 'appa-v20'/.test(probe) && !/'appa-v19'|ist appa-v19/.test(probe),
    "Probe: die festgenagelte Cache-Kennung zieht mit (beide Stellen)", probe.split("\n")[0]);
  ok(/"version": "appa-v20"/.test(lies(a, "tests/teil/stand.json")),
    "Probe: auch in Unterordnern und JSON unter tests/");
  ok(/caches\.open\('appa-v4'\)/.test(probe), "Probe: ein absichtlich ALTER Vorrat (appa-v4) bleibt liegen");
  ok(/"appa-v190"/.test(probe), "Probe: eine LAENGERE Kennung (appa-v190) bleibt liegen");
  ok(/"version": "appa-v19"/.test(lies(a, "tests/cache-stand.json")),
    "tests/cache-stand.json bleibt liegen — sie gehoert tools/cache-stand.mjs");
  ok(/"fremd-appa-v19"/.test(probe), "Probe: eine FREMDE Kennung (fremd-appa-v19) bleibt liegen");
  ok(/Proben mitgezogen: 3 Stellen in 2 Dateien  appa-v19 → appa-v20/.test(r.text),
    "die Ausgabe nennt, was in den Proben mitgezogen wurde", (r.text.match(/Proben mitgezogen.*/) || ["fehlt"])[0]);

  ok(/'appb-v20'/.test(lies(b, "sw.js")), "Voraussetzung: App-B gebumpt (appb-v20)");
  ok(/icon\.png\?v=1"/.test(lies(b, "site.webmanifest")),
    "Icon-Zaehler ?v=1 im Manifest bleibt liegen (stand vorher NICHT auf der Cache-Nummer)");

  ok(/const CACHE = 'v20'/.test(lies(c, "sw.js")), "Voraussetzung: App-C gebumpt (v20)");
  ok(lies(c, "tests/smoke.mjs") === `const x = "v19";\n`,
    "kurze Vorsilbe (v19): die Probe wird NICHT angefasst");
  ok(r.code === 0, "Rueckgabewert 0", `war ${r.code}: ${r.text.slice(-300)}`);
  rmSync(w, { recursive: true, force: true });
}

console.log(`\n${pass} grün · ${fail} ROT`);
process.exit(fail ? 1 : 0);
