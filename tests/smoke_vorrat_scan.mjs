/* smoke_vorrat_scan.mjs — die Einstufung des Vorrat-Scanners, in BEIDE Richtungen.
 *
 * WARUM ES DIESE PROBE GIBT (2026-09-08). Nach der Reparatur des geteilten
 * Vorrats in 19 Depots meldete `tools/vorrat-scan.mjs` weiter 25 von 33
 * Depots als „löscht alles" — 44 Stellen, alle repariert. Der Scanner kannte
 * nur String-Literale (`k.startsWith('x-')`); die Reparatur schreibt den
 * Präfix in eine Konstante (`var VORRAT_PRAEFIX = "x-"`), Modul 22 bekommt
 * ihn vom Wirt, die Pinnwand filtert ihre Modell-Vorräte mit einem positiven
 * Regex. Alles davon fiel auf das `!==` dahinter durch.
 *
 * Eine zu hohe Zahl ist derselbe Fehler wie eine zu niedrige — und ein
 * Messwerkzeug ohne eigene Probe kann sich nicht selbst melden. Deshalb hier
 * jede Form einmal richtig und einmal falsch: ein Wächter, der nur die
 * richtige Seite kennt, ist ein grüner Haken.
 *
 * Lauf:  node tests/smoke_vorrat_scan.mjs
 */
import { stufeEin, findeStellen } from "../tools/vorrat-scan.mjs";

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log("  ✗ " + m); } };
const urteil = (code, ganz) => stufeEin(code, ganz ?? code).urteil;

/* ── Literal ──────────────────────────────────────────────────────────── */
ok(urteil(`keys.filter(k => k.startsWith('alis-') && k !== CACHE).map(k => caches.delete(k))`) === "praefix-ok",
  "Literal-Präfix ist ok");
ok(urteil(`keys.filter(k => k !== CACHE).map(k => caches.delete(k))`) === "loescht-alles",
  "`k !== CACHE` allein löscht alles");
ok(urteil(`keys.map(k => caches.delete(k))`) === "loescht-alles",
  "ohne Filter löscht alles");
ok(urteil(`keys.filter(k => !k.startsWith('eigen-')).map(k => caches.delete(k))`) === "loescht-alles",
  "verneintes Literal (alles AUSSER dem eigenen) löscht alles");
ok(urteil(`ks.filter(k => k.includes('mixarium-sw-')).map(k => caches.delete(k))`) === "praefix-ok",
  "positives includes-Literal ist ok");
ok(urteil(`ks.filter(k => !k.includes('mixarium-sw-')).map(k => caches.delete(k))`) === "loescht-alles",
  "verneintes includes löscht alles");

/* ── Konstante: der Wert wird in der DATEI nachgeschlagen ─────────────── */
const datei = (def, zeile) => `var CACHE_VERSION = "alis-v6";\n${def}\nself.addEventListener("activate", e => {\n  ${zeile}\n});`;
const zeileK = `caches.keys().then(n => Promise.all(n.filter(k => k.startsWith(VORRAT_PRAEFIX) && k !== CACHE_VERSION).map(k => caches.delete(k))))`;
{
  const g = datei(`var VORRAT_PRAEFIX = "alis-moderaum-";`, zeileK);
  const e = stufeEin(zeileK, g);
  ok(e.urteil === "praefix-ok", "Konstante mit Wert in der Datei ist ok");
  ok(/alis-moderaum-/.test(e.filter), "…und der aufgelöste Wert steht im Filtertext: " + e.filter);
}
ok(urteil(zeileK, datei(``, zeileK)) === "unklar",
  "Konstante OHNE Definition in der Datei ist unklar — nicht ok");
ok(urteil(zeileK, datei(``, zeileK)) !== "praefix-ok",
  "…und wird nie als ok gezählt");
ok(urteil(zeileK, datei(`var VORRAT_PRAEFIX = "";`, zeileK)) === "loescht-alles",
  "leerer Präfix trifft alles");
ok(urteil(`n.filter(k => !k.startsWith(VORRAT_PRAEFIX)).map(k => caches.delete(k))`,
  datei(`var VORRAT_PRAEFIX = "x-";`, "")) === "loescht-alles",
  "verneinte Konstante löscht alles");
ok(urteil(`keys.filter(k => k.includes(VORRAT_KENNUNG) && k !== PRECACHE).map(k => caches.delete(k))`,
  `const VORRAT_KENNUNG = "mixarium-sw-";`) === "praefix-ok",
  "includes(Konstante) mit Wert ist ok (Mixarium app-sw.js)");
ok(urteil(`namen.map(n => (n.startsWith(VORRAT_PRAEFIX) && n !== VORRAT) ? caches.delete(n) : null)`,
  `const VORRAT_PRAEFIX = 'buendel-pruefer-';`) === "praefix-ok",
  "Ternär MIT Präfix davor ist ok (Bündel-Prüfer)");
ok(urteil(`namen.map(n => (n !== VORRAT) ? caches.delete(n) : null)`) === "loescht-alles",
  "Ternär ohne Präfix löscht alles");

/* ── Regex ────────────────────────────────────────────────────────────── */
ok(urteil(`keys.filter((k) => /webllm|mlc/i.test(k)).map((k) => caches.delete(k))`) === "praefix-ok",
  "positives Muster (Modell-Vorräte) ist gezielt");
ok(urteil(`keys.filter((k) => !/webllm|mlc/i.test(k)).map((k) => caches.delete(k))`) === "loescht-alles",
  "verneintes Muster löscht alles");

/* ── Modul 22: der Wirt nennt den Präfix ──────────────────────────────── */
const m22 = `var praefixe = [].concat(global.SBKIM_VORRAT_PRAEFIX || []).filter(function (x) { return typeof x === "string" && x; });
var eigener = function (k) { return praefixe.some(function (p) { return k.indexOf(p) === 0; }); };
sw.getRegistration().then(function (r) { return r && r.unregister ? r.unregister() : null; });
global.caches.keys().then(function (keys) { return Promise.all((keys || []).filter(eigener).map(function (k) { return global.caches.delete(k); })); })`;
ok(urteil(m22) === "praefix-ok", "Modul 22 mit Wirt-Präfix ist ok");
ok(urteil(m22.replace("SBKIM_VORRAT_PRAEFIX", "IRGENDWAS")) !== "praefix-ok",
  "…und ohne die Wirt-Marke nicht");

/* ── findeStellen reicht die ganze Datei durch (Sorte + Auflösung) ────── */
{
  const g = datei(`var VORRAT_PRAEFIX = "alis-moderaum-";`, zeileK);
  const st = findeStellen(g);
  ok(st.length === 1 && st[0].sorte === "A" && st[0].urteil === "praefix-ok",
    "findeStellen: Sorte A, Konstante über die ganze Datei aufgelöst — " + JSON.stringify(st));
  const seite = `var VORRAT_PRAEFIX = "kb-";\nfunction reload(){ caches.keys().then(ks => ks.filter(k => k.startsWith(VORRAT_PRAEFIX)).map(k => caches.delete(k))); }`;
  const s2 = findeStellen(seite);
  ok(s2.length === 1 && s2[0].sorte === "B" && s2[0].urteil === "praefix-ok",
    "findeStellen: Sorte B (kein activate) mit Konstante — " + JSON.stringify(s2));
}

/* ── Die ECHTE Modul-22-Datei, nicht ein Schnipsel ─────────────────────
 * Der Schnipsel oben war grün, die Datei kam als „unklar" zurück: die Marke
 * steht dort sechs Zeilen über dem Löschen, ausserhalb des kurzen Fensters.
 * Eine Probe am Ausschnitt misst den Ausschnitt. */
{
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
  const modul = readFileSync(join(ROOT, "src", "modules", "22_such_widget.js"), "utf8");
  const st = findeStellen(modul);
  ok(st.length >= 1 && st.every((s) => s.urteil === "praefix-ok"),
    "die echte 22_such_widget.js ist an jeder Löschstelle ok — " + JSON.stringify(st));
  const ohne = findeStellen(modul.replace(/SBKIM_VORRAT_PRAEFIX/g, "IRGENDWAS"));
  ok(ohne.some((s) => s.urteil !== "praefix-ok"),
    "…und ohne die Wirt-Marke in der echten Datei nicht mehr");
}

console.log(`smoke_vorrat_scan: ${pass} grün, ${fail} rot`);
if (fail) process.exit(1);
