/* Waechter: tools/kanon-verteilen.mjs zieht den Cache-Stand eines Traegers mit
 * (Pflege-Liste #13, gemessen 2026-10-14).
 *   node tests/smoke_kanon_cachestand.mjs
 *
 * WARUM ES DIESE PROBE GIBT. Workflow-Calculate und Workflow-Needs halten zu
 * jeder CACHE_VERSION eine Pruefsumme ihres Vorrats in tests/cache-stand.json.
 * Beim Rollout von Bau 23.R hob der Verteiler die Nummer und liess die
 * Pruefsumme stehen — beide Waechter waren rot, bis jemand
 * `node tools/cache-stand.mjs` von Hand lief.
 *
 * ⚠ SIE FAEHRT DAS WERKZEUG WIRKLICH, an einem Wegwerf-Netz unter tmp. Drei
 * Traeger: einer MIT cache-stand.mjs, einer OHNE, einer mit einem, das
 * scheitert. Die echten Repos werden nie angefasst.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const ok = (b, m, d = "") => { if (b) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m, d ? "— " + d : ""); } };

const werkzeug = join(wurzel, "tools", "kanon-verteilen.mjs");

/* Wortgleich das Werkzeug aus Workflow-Calculate / Workflow-Needs (beide
 * gleich, Stand 2026-10-15). Eingebettet, damit die Probe ohne Nachbar-Klon
 * laeuft — die Probe misst den VERTEILER, nicht dieses Werkzeug. */
const CACHE_STAND = `import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const W = join(dirname(fileURLToPath(import.meta.url)), "..");
const sw = readFileSync(join(W, "sw.js"), "utf8");
const core = JSON.parse(sw.match(/const CORE = (\\[[\\s\\S]*?\\]);/)[1]);
const h = createHash("sha256");
core.filter((u) => u !== "./").sort().forEach((u) => h.update(u + "\\0").update(readFileSync(join(W, u.replace(/\\?.*$/, "")))));
const version = sw.match(/CACHE_VERSION = "([^"]+)"/)[1];
const alt = (() => { try { return JSON.parse(readFileSync(join(W, "tests/cache-stand.json"), "utf8")); } catch { return null; } })();
const sha = h.digest("hex");
if (alt && alt.sha !== sha && alt.version === version) {
  console.error("Der Vorrat hat sich geändert, aber CACHE_VERSION ist noch " + version + ". Erst in sw.js erhöhen.");
  process.exit(1);
}
writeFileSync(join(W, "tests/cache-stand.json"), JSON.stringify({ version, sha }, null, 1) + "\\n");
console.log("cache-stand: " + version + " " + sha.slice(0, 12));
`;

/* Dieselbe Rechnung, unabhaengig nachgebaut: passt die Datei zum Baum? */
function standSoll(p) {
  const sw = readFileSync(join(p, "sw.js"), "utf8");
  const core = JSON.parse(sw.match(/const CORE = (\[[\s\S]*?\]);/)[1]);
  const h = createHash("sha256");
  core.filter((u) => u !== "./").sort().forEach((u) => h.update(u + "\0").update(readFileSync(join(p, u.replace(/\?.*$/, "")))));
  return { version: sw.match(/CACHE_VERSION = "([^"]+)"/)[1], sha: h.digest("hex") };
}
const lies = (p) => { try { return JSON.parse(readFileSync(join(p, "tests", "cache-stand.json"), "utf8")); } catch { return null; } };

const modul = (nr, inhalt) => `/*\n * SBKIM — Modul ${nr} — Probe\n */\n${inhalt}\n`;

function netzBauen() {
  const w = mkdtempSync(join(tmpdir(), "kanon-cs-"));
  const sage = join(w, "Sage-Protokol");
  mkdirSync(join(sage, "src", "modules"), { recursive: true });
  mkdirSync(join(sage, "tools"), { recursive: true });
  writeFileSync(join(sage, "tools", "kanon-verteilen.mjs"), readFileSync(werkzeug));
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var NEU = 2;"));
  writeFileSync(join(sage, "src/modules/17_floating_widget.js"), modul(17, "var NEU17 = 2;"));

  const app = (name, werkzeugText) => {
    const p = join(w, name);
    const dateien = {
      /* ⚠ ZWEI zurueckhaengende Module im selben Traeger. Nur so misst die
       * Probe „einmal je Traeger, nach ALLEN Schreibvorgaengen" — mit einem
       * einzigen waere ein Aufruf je Datei davon nicht zu unterscheiden. */
      "modules/16_siegel.js": modul(16, "var ALT = 1;"),
      "modules/17_floating_widget.js": modul(17, "var ALT17 = 1;"),
      "index.html": `<script src="modules/16_siegel.js?v=4"></script>\n`,
      "sw.js": `const CACHE_VERSION = "${name.toLowerCase()}-v4";\n`
        + `const CORE = ["./", "index.html", "modules/16_siegel.js?v=4", "modules/17_floating_widget.js"];\n`
        + `self.addEventListener("fetch", (e) => e.respondWith(caches.match(e.request).then((h) => h || fetch(e.request))));\n`,
    };
    if (werkzeugText !== null) dateien["tools/cache-stand.mjs"] = werkzeugText;
    for (const [rel, inhalt] of Object.entries(dateien)) {
      mkdirSync(join(p, dirname(rel)), { recursive: true });
      writeFileSync(join(p, rel), inhalt);
    }
    mkdirSync(join(p, ".git"), { recursive: true });
    mkdirSync(join(p, "tests"), { recursive: true });
    /* Ausgangslage: der Stand passt zum alten Baum, wie in einem gruenen Repo. */
    if (werkzeugText === CACHE_STAND) execFileSync("node", [join(p, "tools", "cache-stand.mjs")], { cwd: p, stdio: "ignore" });
    return p;
  };
  const mit = app("Mit-Stand", CACHE_STAND);
  const ohne = app("Ohne-Stand", null);
  const kaputt = app("Kaputt-Stand", `console.error("absichtlich kaputt"); process.exit(1);\n`);
  return { w, sage, mit, ohne, kaputt };
}

/* ⚠ stderr IMMER mitlesen, auch bei Rueckgabewert 0. Die laute Meldung steht
 * dort — mit execFileSync ginge sie bei 0 verloren, und der Fall „Rueckgabewert
 * bleibt 0" wurde in der Gegenprobe zuerst an der FALSCHEN Zeile rot. */
function lauf(sage, w, extra = []) {
  const r = spawnSync("node", [join(sage, "tools", "kanon-verteilen.mjs"), "--nachbarn", w, ...extra],
    { encoding: "utf8" });
  return { text: String(r.stdout || "") + String(r.stderr || ""), code: r.status };
}

/* ══ 1. Nur nachsehen ══════════════════════════════════════════════════ */
console.log("Nur nachsehen:");
{
  const { w, sage, mit, ohne } = netzBauen();
  const vorher = readFileSync(join(mit, "tests", "cache-stand.json"), "utf8");
  const r = lauf(sage, w);
  ok(readFileSync(join(mit, "tests", "cache-stand.json"), "utf8") === vorher,
    "nachsehen: cache-stand.json bleibt unberuehrt");
  const zeilen = r.text.split("\n");
  const block = (name) => { const i = zeilen.findIndex((z) => z === `▶ ${name}`); if (i < 0) return ""; const j = zeilen.findIndex((z, k) => k > i && z.startsWith("▶ ")); return zeilen.slice(i, j < 0 ? undefined : j).join("\n"); };
  ok(/liefe hier tools\/cache-stand\.mjs/.test(block("Mit-Stand")),
    "nachsehen: meldet beim Traeger MIT Werkzeug, was beim Schreiben geschaehe", block("Mit-Stand").slice(0, 200));
  ok(!/cache-stand/.test(block("Ohne-Stand")), "nachsehen: OHNE Werkzeug kein Wort von cache-stand");
  ok(!existsSync(join(ohne, "tests", "cache-stand.json")), "nachsehen: ohne Werkzeug entsteht keine cache-stand.json");
  rmSync(w, { recursive: true, force: true });
}

/* ══ 2. Schreiben ══════════════════════════════════════════════════════ */
console.log("Schreiben:");
{
  const { w, sage, mit, ohne, kaputt } = netzBauen();
  const vorher = lies(mit);
  const r = lauf(sage, w, ["--schreiben"]);
  const nachher = lies(mit), soll = standSoll(mit);
  ok(soll.version === "mit-stand-v5", "Voraussetzung: der Bump hat stattgefunden (mit-stand-v5)", soll.version);
  ok(nachher && nachher.version === soll.version,
    "cache-stand.json traegt die NEUE CACHE_VERSION", nachher ? nachher.version : "fehlt");
  ok(nachher && nachher.sha === soll.sha && nachher.sha !== vorher.sha,
    "cache-stand.json traegt die Pruefsumme des NACHGEZOGENEN Vorrats");
  /* Einmal je Traeger: im Text genau eine Zeile fuer Mit-Stand. */
  const n = (r.text.match(/Cache-Stand nachgezogen: cache-stand: mit-stand-v5/g) || []).length;
  ok(n === 1, "einmal je Traeger aufgerufen, nicht je Datei", `${n}×`);
  ok(!existsSync(join(ohne, "tests", "cache-stand.json")), "OHNE Werkzeug: keine cache-stand.json angelegt");
  ok(/Ohne-Stand/.test(r.text) && !/CACHE-STAND GESCHEITERT in Ohne-Stand/.test(r.text) && !/Cache-Stand nachgezogen: cache-stand: ohne/.test(r.text),
    "OHNE Werkzeug: nachgezogen, aber kein Cache-Stand-Aufruf");
  ok(/CACHE-STAND GESCHEITERT in Kaputt-Stand: tools\/cache-stand\.mjs → absichtlich kaputt/.test(r.text),
    "ein Fehlschlag wird LAUT gemeldet, mit Traeger und Grund");
  ok(/Cache-Stand gescheitert/.test(r.text) && /Kaputt-Stand: absichtlich kaputt/.test(r.text.split("CACHE-STAND GESCHEITERT —")[1] || ""),
    "der Fehlschlag steht noch einmal am Schluss");
  ok(r.code === 1, "ein Fehlschlag macht den Rueckgabewert 1", `war ${r.code}`);
  ok(readFileSync(join(kaputt, "modules", "16_siegel.js"), "utf8").includes("var NEU = 2;"),
    "der Fehlschlag haelt die uebrigen Traeger nicht an");
  rmSync(w, { recursive: true, force: true });
}

/* ══ 3. Ohne Fehlschlag ist der Lauf gruen ═════════════════════════════ */
console.log("Ohne Fehlschlag:");
{
  const { w, sage, kaputt } = netzBauen();
  rmSync(kaputt, { recursive: true, force: true });
  const r = lauf(sage, w, ["--schreiben"]);
  ok(r.code === 0, "ohne gescheiterten Cache-Stand Rueckgabewert 0", `war ${r.code}: ${r.text.slice(-300)}`);
  rmSync(w, { recursive: true, force: true });
}

console.log(`\n${pass} grün · ${fail} ROT`);
process.exit(fail ? 1 : 0);
