/* gegenprobe_startseite_einstiege.mjs — jeder eingebaute Fehler MUSS
 * `tests/smoke_startseite_einstiege.mjs` umwerfen, und zwar mit dem Namen
 * SEINER Zusicherung in der roten Zeile.
 *
 * ⚠ GEARBEITET WIRD IN EINER WEGWERF-KOPIE. Wird ein Lauf unterbrochen, bliebe
 * eine Sabotage sonst im echten Baum liegen, und die nächste Prüfung meldete
 * rote Proben, die niemandem gehören (PWA-Toolpoint, 2026-09-09).
 *
 * Lauf: node tests/gegenprobe_startseite_einstiege.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const kopie = mkdtempSync(resolve(tmpdir(), "sage-einstiege-"));
cpSync(resolve(wurzel, "index.html"), resolve(kopie, "index.html"));
cpSync(resolve(wurzel, "tests/smoke_startseite_einstiege.mjs"),
       resolve(kopie, "tests/smoke_startseite_einstiege.mjs"), { recursive: true });

const ZIEL = resolve(kopie, "index.html");
const ORIGINAL = readFileSync(ZIEL, "utf8");

function lauf() {
  try {
    execFileSync(process.execPath, [resolve(kopie, "tests/smoke_startseite_einstiege.mjs")],
      { stdio: "pipe", encoding: "utf8" });
    return [];
  } catch (e) {
    const rot = String(e.stdout || "").split("\n").filter((z) => z.includes("✗"))
      .map((z) => z.replace(/^\s*✗\s*/, "").trim());
    /* Eine Probe, die WIRFT, ist rot — nicht „nicht gefangen". */
    return rot.length ? rot : ["ABGESTÜRZT: " + String(e.stderr || "").split("\n")[1]];
  }
}

const FAELLE = [
  { was: "die Lasche kommt zurück — und mit ihr die zweite Suche",
    trifft: /\.tool-launcher\) steht nicht mehr|EIN Weg zum Such-Werkzeug/,
    kaputt: (t) => t.replace("<div class=\"wrap\">",
      '<nav class="tool-launcher"><a class="tool-launch-btn" href="such-tool/">🔍</a></nav>\n  <div class="wrap">') },

  { was: "nur die CSS-Regel der Lasche kommt zurück (die Einladung zum Wiederbeleben)",
    trifft: /CSS-Regeln sind mitgegangen/,
    kaputt: (t) => t.replace("  .hub-demo-badge {",
      "  .tool-launcher { position: fixed; }\n  .hub-demo-badge {") },

  /* ⚠ DER TEUERSTE FALL: aufgeräumt und dabei einen Weg zugemauert. */
  { was: "die Pinnwand-Karte fällt weg — sie wäre von dieser Seite aus unerreichbar",
    trifft: /EIN Weg zur Pinnwand/,
    kaputt: (t) => t.replace("      url: 'pinnwand/',", "      url: '',") },

  { was: "die Pinnwand steht wieder nur als Lasche da, nicht in der Liste",
    trifft: /neben dem Such-Werkzeug/,
    kaputt: (t) => t.replace("name: '📌 Pinnwand'", "name: 'Pinnwand'") },

  { was: "der Weg zur Mycel-Karte steht wieder zweimal da",
    trifft: /EIN Knopf öffnet die Mycel-Karte/,
    kaputt: (t) => t.replace('<div class="bento">',
      '<a class="nav-pill mycel-link" href="mycel-karte/">🍄 öffnen</a>\n      <div class="bento">') },

  { was: "der verbliebene Knopf verschwindet — die Karte ist nur noch im Rahmen zu sehen",
    trifft: /EIN Knopf öffnet die Mycel-Karte/,
    kaputt: (t) => t.replace(
      "<div class=\"card-cta\"><button onclick=\"window.open('./mycel-karte/','_blank','noopener')\">↗ Mycel-Karte in Vollbild öffnen</button></div>", "") },

  { was: "die eingebettete Live-Karte selbst fällt weg",
    trifft: /Live-Karte selbst ist unberührt/,
    kaputt: (t) => t.replace('<iframe src="./mycel-karte/"', '<iframe src="about:blank"') },

  { was: "die CSS des zweiten Karten-Knopfes bleibt als Leiche liegen",
    trifft: /seine CSS-Regeln sind mitgegangen/,
    kaputt: (t) => t.replace("  .hub-demo-badge {",
      "  .topology-cta { margin-top: 1rem; }\n  .hub-demo-badge {") },

  { was: "das Such-Werkzeug steht wieder zweimal da",
    trifft: /EIN Weg zum Such-Werkzeug/,
    kaputt: (t) => t.replace("      url: 'such-tool/',",
      "      url: 'such-tool/', zweit: 'such-tool/',") }
];

let gefangen = 0, durch = 0, falsch = 0, tot = 0;

console.log("\n── Gegenprobe: Einstiege der Startseite ──");
if (lauf().length) {
  console.log("  ABBRUCH — die Probe ist schon ohne Eingriff rot");
  rmSync(kopie, { recursive: true, force: true });
  process.exit(2);
}

for (const f of FAELLE) {
  const nachher = f.kaputt(ORIGINAL);
  if (nachher === ORIGINAL) { tot++; console.log("  ⚠ ANKER NICHT GEFUNDEN — " + f.was); continue; }
  writeFileSync(ZIEL, nachher);
  const rot = lauf();
  writeFileSync(ZIEL, ORIGINAL);
  if (!rot.length) { durch++; console.log("  ✗ NICHT GEFANGEN — " + f.was); continue; }
  if (!rot.some((z) => f.trifft.test(z))) {
    falsch++;
    console.log("  ✗ FALSCHER GRUND — " + f.was + "\n      rot war: " + rot.join(" | "));
    continue;
  }
  gefangen++;
  console.log("  ✓ gefangen (" + rot.length + " rot) — " + f.was);
}

rmSync(kopie, { recursive: true, force: true });
console.log("\n" + gefangen + " gefangen · " + durch + " durchgerutscht · "
  + falsch + " aus dem falschen Grund · " + tot + " tote Anker");
process.exit(durch || falsch || tot ? 1 : 0);
