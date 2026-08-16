/*
 * Probe: Modul 16 prüft den Relais-Client (05b) — und die Aspekte-Liste
 * trägt die Feldnamen, die das Modal wirklich liest.
 *
 * ── WARUM ES DIESE PROBE GIBT ───────────────────────────────────────────────
 *
 * Am 2026-08-16 meldete Klaus' Tablet „✗ Raum-Lesen fehlgeschlagen: Kein
 * Nostr-Relais-Client (Modul 05b) verfügbar" — und das SIEGEL LEUCHTETE
 * TROTZDEM. Es prüfte sieben Module, 05b war nicht darunter. Ein Siegel, das
 * goldenes Vertrauen zeigt, während der Knoten den gemeinsamen Raum gar nicht
 * lesen kann, sagt die Unwahrheit; genau davor soll die Anti-Greenwashing-
 * Klausel (Karte 16) schützen. Sie griff nicht, weil die LISTE unvollständig
 * war — nicht weil die Prüfung schwach war.
 *
 * Die zweite Hälfte ist aus demselben Tag, und sie ist die unangenehmere:
 * der Aspekt, der die Aufnahme dokumentiert, wurde zuerst mit den Feldnamen
 * `moduleId`/`title` geschrieben. `node --check` war zufrieden — es ist
 * gültiges JavaScript. Das Modal liest aber `a.module`/`a.aspect`, und der
 * Eintrag wäre schlicht LEER erschienen: eine Sicherheits-Änderung, die sich
 * selbst dokumentiert, und die Dokumentation ist unsichtbar. Gefunden hat das
 * nicht eine Probe, sondern das Lesen des Diffs. Ab hier eine Probe.
 *
 * ── DIE GEGENPROBE STECKT DRIN ──────────────────────────────────────────────
 *
 * Probe 2 baut die Umgebung OHNE Relais-Client und verlangt, dass das Siegel
 * dann AUSBLEIBT. Ohne diese Hälfte wäre Probe 1 nur ein grüner Haken: sie
 * liefe genauso grün, wenn 05b gar nicht in der Liste stünde.
 *
 * Lauf: node tests/smoke_bau16_pflicht_05b.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let gruen = 0, rot = 0;
const sage = (ok, t, ist) => {
  ok ? gruen++ : rot++;
  console.log(`${ok ? "  ✓" : "  ✗ ROT"} ${t}${ok || ist === undefined ? "" : `\n        ist: ${ist}`}`);
};

/* ── Minimal-Umgebung: Modul 16 braucht kein DOM, solange nicht gerendert
   wird. init() rendert; wir prüfen die Selbst-Prüfung, nicht das Abzeichen. */
function umgebung({ mit05b }) {
  const g = {};
  const hoerer = {};
  g.console = console;
  g.Date = Date; g.JSON = JSON; g.Math = Math; g.Promise = Promise;
  g.setTimeout = setTimeout; g.clearTimeout = clearTimeout;
  g.location = { origin: "https://example.test", pathname: "/probe/" };
  g.CustomEvent = function (type, init) {
    return { type, detail: (init && init.detail) || undefined };
  };
  g.addEventListener = (t, cb) => { (hoerer[t] = hoerer[t] || []).push(cb); };
  g.removeEventListener = () => {};
  g.dispatchEvent = (ev) => {
    for (const cb of (hoerer[ev.type] || []).slice()) { try { cb(ev); } catch { /* egal */ } }
    return true;
  };
  g.MutationObserver = function () { return { observe() {}, disconnect() {} }; };
  g.document = {
    readyState: "complete",
    createElement: () => ({ style: {}, classList: { add() {}, remove() {}, contains: () => false },
                            appendChild() {}, setAttribute() {}, addEventListener() {} }),
    querySelector: () => null,
    getElementById: () => null,
    addEventListener: () => {},
    body: null, head: null,
  };

  // Die sieben alten Pflicht-Module — immer da.
  g.SbkimStorage    = { init() {} };
  g.SbkimSpore      = { getOwnSpore() { return {}; } };
  g.SbkimEmbedding  = { embedPassage() {} };
  g.SbkimMatch      = { match() { return 1; } };
  g.SbkimAnastomose = { handshake() {} };
  g.SbkimApoptose   = { prepareSelfApoptose() {} };
  g.SbkimMembrane   = { init() {} };
  // Das achte — genau der Schalter dieser Probe.
  if (mit05b) g.SbkimNostrRelay = { subscribe() { return function () {}; } };

  const src = readFileSync(resolve(WURZEL, "src/modules/16_siegel.js"), "utf8");
  new Function(
    "window", "globalThis", "self", "console", "document",
    "addEventListener", "removeEventListener", "dispatchEvent", "CustomEvent",
    "setTimeout", "clearTimeout", "MutationObserver", "Date", "JSON", "Math", "Promise",
    src,
  )(
    g, g, g, console, g.document,
    g.addEventListener, g.removeEventListener, g.dispatchEvent, g.CustomEvent,
    g.setTimeout, g.clearTimeout, g.MutationObserver, g.Date, g.JSON, g.Math, g.Promise,
  );
  return g.SbkimSiegel;
}

console.log("\n=== Modul 16 · Relais-Client (05b) ist Pflicht ===\n");

/* ── Probe 1 — mit Relais-Client: 05b steht in der Liste und ist „ok" ────── */
{
  const S = umgebung({ mit05b: true });
  S.init({ autoRender: false });

  const ids = S.getCertifiedModules();
  sage(ids.includes("05b"), "05b steht in der Pflicht-Liste des Siegels", ids.join(","));
  sage(S.isCertified(), "mit Relais-Client: Siegel wird ausgestellt", `isCertified=${S.isCertified()}`);
}

/* ── Probe 2 — die Gegenprobe: OHNE Relais-Client kein Siegel ────────────── */
{
  const S = umgebung({ mit05b: false });
  S.init({ autoRender: false });

  sage(!S.isCertified(),
       "ohne Relais-Client: Siegel bleibt aus (das ist der ganze Zweck)",
       `isCertified=${S.isCertified()}`);
  sage(!S.getCertifiedModules().includes("05b"),
       "05b wird dann auch nicht als erfüllt gemeldet",
       S.getCertifiedModules().join(","));
}

/* ── Probe 3 — Aspekte-Schema: die Feldnamen, die das Modal liest ────────── */
{
  const S = umgebung({ mit05b: true });
  S.init({ autoRender: false });
  const aspekte = S.getAspects();

  sage(aspekte.length > 0, "die Aspekte-Liste ist nicht leer", `${aspekte.length}`);

  // Das Modal rendert a.since · a.module · a.aspect + a.description. Ein
  // Eintrag mit anderen Feldnamen ist gültiges JS und trotzdem unsichtbar.
  const kaputt = aspekte
    .map((a, i) => ({ i, a }))
    .filter(({ a }) => !["since", "module", "aspect", "description"]
      .every((f) => typeof a[f] === "string" && a[f].trim() !== ""));
  sage(kaputt.length === 0,
       "jeder Aspekt trägt since · module · aspect · description als nicht-leeren Text",
       kaputt.map(({ i, a }) => `#${i + 1} ${JSON.stringify(a)}`).join(" | "));

  const schiefesDatum = aspekte.filter((a) => !/^\d{4}-\d{2}-\d{2}$/.test(a.since || ""));
  sage(schiefesDatum.length === 0, "jedes since ist ein Datum YYYY-MM-DD",
       schiefesDatum.map((a) => a.since).join(", "));

  // Karte 16 § Sub (d): aspect ist ein KURZER Titel, ≤ 80 Zeichen.
  const zuLang = aspekte.filter((a) => (a.aspect || "").length > 80);
  sage(zuLang.length === 0, "jeder Aspekt-Titel bleibt unter 80 Zeichen",
       zuLang.map((a) => `${a.aspect.length}: ${a.aspect}`).join(" | "));

  // Der Aspekt zu genau dieser Änderung — Ehrlichkeits-Kopplung: der Code
  // ändert sich, also muss das Siegel es auch sagen.
  const a05b = aspekte.find((a) => a.module === "05b");
  sage(!!a05b, "die Aufnahme von 05b ist als Aspekt dokumentiert",
       aspekte.map((a) => a.module).join(","));
}

console.log(`\nErgebnis: ${gruen} grün, ${rot} rot\n`);
process.exit(rot ? 1 : 0);
