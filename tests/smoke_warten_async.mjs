/*
 * smoke_warten_async.mjs — keine Probe wartet mit einer Bedingung, die ein
 * Promise zurückgibt.
 *
 * ⚠ DER ANLASS IST GEMESSEN (2026-09-28, playwright-core 1.62.1).
 * Playwrights `waitForFunction` wartet, bis die Bedingung etwas „Wahres"
 * zurückgibt — und ein Promise ist IMMER wahr. Sie wartet es NICHT ab:
 *
 *   async () => false             löst nach 100 ms auf
 *   () => Promise.resolve(false)  löst nach   6 ms auf
 *   () => false                   scheitert an der Frist (so ist es richtig)
 *
 * Kimhub hat die Falle am selben Tag in `smoke_ansicht.mjs` gefunden (der
 * „Flatterer" seit dem 2026-09-26) und eine Familien-Probe gebaut. Die
 * erkennt nur die erste Gestalt, `async`. In Sages `vorrat_wirkung.mjs`
 * standen SECHS blinde Wartepunkte: vier `async`, und zwei mit `.then(…)` —
 * die hätte Kimhubs Fassung nicht gesehen. Deshalb misst diese Probe die
 * Gestalten, an denen man ein Promise erkennt: `async` vorn, `.then(`,
 * `Promise`, `await` in der Bedingung.
 *
 * ⚠ BENANNTE GRENZE: eine Bedingung, die eine Hilfsfunktion ruft, die
 * ihrerseits ein Promise zurückgibt (`() => holeWas()`), sieht keine
 * Textsuche. Gemessen wird, was man der Zeile ansehen kann.
 *
 * Gemessen wird die FAMILIE: jede `.mjs`/`.js` unter `tests/`, `tools/` und
 * `pinnwand/`, gefunden statt gepflegt. Die Erkennung wird an gestellten
 * Zeilen in beide Richtungen gefragt — sonst wäre „nichts gefunden" auch
 * dann grün, wenn sie gar nichts findet. Das Suchwort steht hier nicht
 * wörtlich (es wird zusammengesetzt), und Kommentare werden vorher entfernt:
 * wer über die Falle SCHREIBT, benutzt sie nicht.
 *
 * Lauf: node tests/smoke_warten_async.mjs
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORDNER = ["tests", "tools", "pinnwand"];
const AUFRUF = "waitFor" + "Function";

let gruen = 0, rot = 0;
const ok = (was, gut) => { console.log(`  ${gut ? "✓" : "✗ ROT:"} ${was}`); gut ? gruen++ : rot++; };

function ohneKommentare(t) {
  return t
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
}

/** Das erste Argument jedes Aufrufs, samt Zeilennummer. */
function bedingungen(text) {
  const t = ohneKommentare(text);
  const muster = new RegExp(AUFRUF + "\\(", "g");
  const aus = [];
  let m;
  while ((m = muster.exec(t))) {
    let i = m.index + m[0].length, tiefe = 0;
    const anfang = i;
    for (; i < t.length; i++) {
      const c = t[i];
      if ("([{".includes(c)) tiefe++;
      else if (")]}".includes(c)) { if (tiefe === 0) break; tiefe--; }
      else if (c === "," && tiefe === 0) break;
    }
    aus.push({ zeile: t.slice(0, m.index).split("\n").length, arg: t.slice(anfang, i) });
  }
  return aus;
}

const PROMISE = /^\s*async\b|\.then\s*\(|\bPromise\b|\bawait\b/;

/** Zeilennummern, an denen die Bedingung ein Promise zurückgibt. */
function fundstellen(text) {
  return bedingungen(text).filter((b) => PROMISE.test(b.arg)).map((b) => b.zeile);
}

function dateien() {
  const aus = [];
  for (const o of ORDNER) {
    const d = join(WURZEL, o);
    if (!existsSync(d)) continue;
    for (const n of readdirSync(d)) if (/\.(mjs|js)$/.test(n)) aus.push(join(o, n));
  }
  return aus;
}

/* ── 1 · die Erkennung, an gestellten Zeilen — beide Richtungen ─────────── */
const A = AUFRUF;
ok("erkennt `async` vorn", fundstellen(`await p.${A}(async () => false);`).length === 1);
ok("erkennt `async function`", fundstellen(`await p.${A}(async function () { return 1; });`).length === 1);
ok("erkennt `.then(` in der Bedingung",
  fundstellen(`await p.${A}((n) => caches.keys().then((ks) => ks.length > n), 0);`).length === 1);
ok("erkennt `Promise` in der Bedingung",
  fundstellen(`await p.${A}(() => Promise.resolve(window.x));`).length === 1);
ok("erkennt es auch über einen Zeilenumbruch",
  fundstellen(`await p.${A}(\n    (v) => caches.keys()\n      .then((ks) => ks.includes(v)),\n  "a");`).length === 1);
ok("eine gewöhnliche Bedingung ist KEIN Fund",
  fundstellen(`await p.${A}(() => window.x === 1);`).length === 0);
ok("`await` im ZWEITEN Argument ist KEIN Fund (nur die Bedingung zählt)",
  fundstellen(`await p.${A}((n) => window.x === n, await holeZahl(), { timeout: 5 });`).length === 0);
ok("`.then` NACH dem Aufruf ist KEIN Fund",
  fundstellen(`await p.${A}(() => window.ok, null, { timeout: 5 }).then(() => 1);`).length === 0);
ok("in einem Kommentar ist es KEIN Fund",
  fundstellen(`// p.${A}(async () => 1)\n/* p.${A}(() => x.then(y)) */\nlet a = 1;`).length === 0);
ok("die Zeilennummer stimmt",
  fundstellen(`let a;\nlet b;\np.${A}(async () => 1);`)[0] === 3);

/* ── 2 · der Bestand ─────────────────────────────────────────────────────── */
const liste = dateien();
ok(`es werden Dateien gefunden (${liste.length})`, liste.length > 20);
let gezaehlt = 0;
const funde = [];
for (const d of liste) {
  const text = readFileSync(join(WURZEL, d), "utf8");
  const b = bedingungen(text);
  gezaehlt += b.length;
  for (const z of fundstellen(text)) funde.push(`${d}:${z}`);
}
ok(`es gibt überhaupt Warte-Aufrufe (${gezaehlt}) — sonst misst die Zeile darunter nichts`,
  gezaehlt > 5);
ok(`keine Probe wartet mit einer Promise-Bedingung${funde.length ? " → " + funde.join(", ") : ""}`,
  funde.length === 0);

console.log(`\n═══ ${gruen} grün · ${rot} ROT ═══\n`);
process.exit(rot > 0 ? 1 : 0);
