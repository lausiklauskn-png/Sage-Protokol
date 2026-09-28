/*
 * Gegenprobe zu `smoke_warten_async.mjs`.
 *
 * Jeder Fall baut GENAU EINEN Fehler ein — in einer Wegwerf-Kopie von
 * `tests/`, `tools/` und `pinnwand/`, nie im echten Baum — und die Probe
 * MUSS dabei rot werden, und zwar mit der Zeile, die der Fall nennt
 * (`trifft`). Ein Fall, der die Probe an einer FREMDEN Zusicherung
 * umwirft, sähe sonst wie ein Treffer aus.
 *
 * Ein toter Anker (die Sabotage ändert nichts) wird als solcher gemeldet,
 * nicht als „nicht gefangen" — das eine heißt „zieh den Fall nach", das
 * andere „bau einen Wächter".
 *
 * Lauf: node tests/gegenprobe_warten_async.mjs
 *       NUR_ANKER=1 node tests/gegenprobe_warten_async.mjs   (nur die Anker)
 */
import { readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROBE = "tests/smoke_warten_async.mjs";
const VORRAT = "tests/vorrat_wirkung.mjs";
const W = "waitFor" + "Function";

const FAELLE = [
  /* Der Anker steht viermal da (vier gleiche Wartepunkte) — alle vier zurück. */
  { was: "die Wartepunkte kommen mit `async` zurück",
    datei: VORRAT, alle: 4,
    alt: "await warteBis(a, () => caches.keys().then((ks) => ks.length > 0), null, 20000);",
    neu: `await a.${W}(async () => (await caches.keys()).length > 0, null, { timeout: 20000 }).catch(() => {});`,
    trifft: /keine Probe wartet mit einer Promise-Bedingung → tests\/vorrat_wirkung/ },

  /* Die Gestalt, die Kimhubs Fassung nicht sieht. */
  { was: "ein Wartepunkt kommt mit `.then(` zurück",
    datei: VORRAT,
    alt: "await warteBis(b, (n) => caches.keys().then((ks) => !ks.includes(n)),\n      alterVorrat, 15000);",
    neu: `await b.${W}((n) => caches.keys().then((ks) => !ks.includes(n)),\n      alterVorrat, { timeout: 15000 }).catch(() => {});`,
    trifft: /keine Probe wartet mit einer Promise-Bedingung → tests\/vorrat_wirkung/ },

  { was: "die Erkennung sieht `.then(` nicht mehr",
    datei: PROBE,
    alt: "const PROMISE = /^\\s*async\\b|\\.then\\s*\\(|\\bPromise\\b|\\bawait\\b/;",
    neu: "const PROMISE = /^\\s*async\\b|\\bPromise\\b|\\bawait\\b/;",
    trifft: /✗ ROT: erkennt `\.then\(` in der Bedingung/ },

  { was: "die Erkennung sieht `async` nicht mehr",
    datei: PROBE,
    alt: "const PROMISE = /^\\s*async\\b|",
    neu: "const PROMISE = /^\\s*asyncX\\b|",
    trifft: /✗ ROT: erkennt `async` vorn/ },

  { was: "die Bedingung wird über das Komma hinaus gelesen (zweites Argument zählt mit)",
    datei: PROBE,
    alt: "else if (c === \",\" && tiefe === 0) break;",
    neu: "else if (c === \";\" && tiefe === 0) break;",
    trifft: /✗ ROT: `await` im ZWEITEN Argument/ },

  { was: "Kommentare werden nicht mehr entfernt",
    datei: PROBE,
    alt: "  const t = ohneKommentare(text);\n  const muster",
    neu: "  const t = text;\n  const muster",
    trifft: /✗ ROT: in einem Kommentar ist es KEIN Fund/ },

  { was: "die Dateiliste läuft leer",
    datei: PROBE,
    alt: 'const ORDNER = ["tests", "tools", "pinnwand"];',
    neu: 'const ORDNER = ["gibt-es-nicht"];',
    trifft: /✗ ROT: es werden Dateien gefunden \(0\)/ },
];

let gefangen = 0, blind = 0, falsch = 0, tot = 0;

for (const f of FAELLE) {
  const quelle = readFileSync(join(WURZEL, f.datei), "utf8");
  const n = quelle.split(f.alt).length - 1;
  if (n !== (f.alle || 1)) { tot++; console.log(`  ⚰ TOTER ANKER (${n}×): ${f.was}`); continue; }
  if (process.env.NUR_ANKER) { console.log(`  · Anker lebt: ${f.was}`); continue; }

  const kopie = mkdtempSync(join(tmpdir(), "warten-gp-"));
  try {
    for (const o of ["tests", "tools", "pinnwand"])
      if (existsSync(join(WURZEL, o))) cpSync(join(WURZEL, o), join(kopie, o), { recursive: true });
    writeFileSync(join(kopie, f.datei), quelle.split(f.alt).join(f.neu));
    let aus = "", code = 0;
    try { aus = execFileSync("node", [join(kopie, PROBE)], { encoding: "utf8" }); }
    catch (e) { aus = String(e.stdout || "") + String(e.stderr || ""); code = e.status ?? 1; }
    if (code === 0) { blind++; console.log(`  ✗ NICHT GEFANGEN: ${f.was}`); }
    else if (!f.trifft.test(aus)) {
      falsch++;
      console.log(`  ✗ ROT AUS FALSCHEM GRUND: ${f.was}\n${aus.split("\n").filter((z) => /ROT|Error/.test(z)).join("\n")}`);
    } else {
      gefangen++;
      const zeile = aus.split("\n").find((z) => f.trifft.test(z)) || "";
      console.log(`  ✓ gefangen: ${f.was}\n      ${zeile.trim()}`);
    }
  } finally { rmSync(kopie, { recursive: true, force: true }); }
}

console.log(`\n═══ ${gefangen} gefangen · ${blind} durchgerutscht · ${falsch} aus falschem Grund · ${tot} tote Anker ═══\n`);
process.exit(blind || falsch || tot ? 1 : 0);
