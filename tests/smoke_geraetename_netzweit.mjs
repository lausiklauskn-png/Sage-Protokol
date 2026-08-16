/*
 * Probe: jeder Knoten, der eine EIGENE Adresse hat, kann seinen Gerätenamen
 * auch selbst setzen.
 *
 * ── DIE UNTERSCHEIDUNG, UM DIE ES GEHT ──────────────────────────────────────
 *
 * Der Gerätename liegt in `localStorage` unter `sbkim_geraetename` — bewusst
 * OHNE App-Suffix, denn die Absicht ist „dieses Gerät heißt X", nicht „diese
 * App heißt X" (Skill `geraetename`). Daraus folgt etwas, das man leicht
 * übersieht:
 *
 *   · Apps auf der GETEILTEN Adresse (lausiklauskn-png.github.io) teilen sich
 *     den Speicher. Setzt der Nutzer den Namen in EINER Schwester-App, haben
 *     ihn alle. Ein eigenes Eingabefeld ist dort Zugabe, kein Muss.
 *
 *   · Apps auf einer EIGENEN Adresse (pwa-toolpoint.de, perfectskinbeauty.de,
 *     company-brain.family-projekt.de) haben einen eigenen Speicher. Dort gibt
 *     es keine Schwester-App, die den Namen setzen könnte. Ohne eigenes
 *     Eingabefeld liest die Verdrahtung für immer einen leeren Wert — sie ist
 *     da, sie läuft, und sie kann nichts bewirken.
 *
 * Genau dieser Fall lag am 2026-08-16 dreimal vor: PWA Toolpoint hatte weder
 * Feld noch Verdrahtung, Company Brain ebenso, und Perfect Skin Beauty hatte
 * die Verdrahtung ohne Feld — die stillste der drei Formen, weil im Code alles
 * richtig aussah.
 *
 * Diese Probe prüft deshalb NICHT „hat jede App ein Feld", sondern die
 * Bedingung, die wirklich zählt: **eigene Adresse ⇒ eigenes Feld.**
 *
 * Gegenprobe: node tests/gegenprobe_geraetename_netzweit.mjs
 * Lauf:       node tests/smoke_geraetename_netzweit.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const HEIM = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Knoten mit EIGENER Adresse — hier ist das Feld Pflicht.
const EIGENE_ADRESSE = [
  { repo: "PWA-Toolpoint",       adresse: "pwa-toolpoint.de" },
  { repo: "Perfect-Skin-Beauty", adresse: "perfectskinbeauty.de" },
  { repo: "Company-Brain",       adresse: "company-brain.family-projekt.de" },
  { repo: "family-project",      adresse: "family-projekt.de" },
];

let gruen = 0, rot = 0, uebersprungen = 0;
const sage = (ok, t, ist) => {
  ok ? gruen++ : rot++;
  console.log(`${ok ? "  ✓" : "  ✗ ROT"} ${t}${ok || ist === undefined ? "" : `\n        ${ist}`}`);
};

function dateien(wurzel) {
  const raus = [];
  (function geh(d) {
    let eintraege;
    try { eintraege = readdirSync(d); } catch { return; }
    for (const e of eintraege) {
      if (e === ".git" || e === "node_modules") continue;
      const p = join(d, e);
      let s; try { s = statSync(p); } catch { continue; }
      if (s.isDirectory()) geh(p);
      else if (/\.(html?|js|mjs)$/i.test(e)) raus.push(p);
    }
  })(wurzel);
  return raus;
}

console.log("\n=== Gerätename: eigene Adresse ⇒ eigenes Feld ===\n");

for (const k of EIGENE_ADRESSE) {
  const wurzel = join(HEIM, k.repo);
  if (!existsSync(wurzel)) {
    uebersprungen++;
    console.log(`  ⊘ ${k.repo} liegt in diesem Container nicht — nicht prüfbar`);
    continue;
  }

  let hatFeld = false, hatAnzeige = false, hatSpeicher = false;
  for (const p of dateien(wurzel)) {
    let t; try { t = readFileSync(p, "utf-8"); } catch { continue; }
    // Das FELD: ein Eingabeelement mit der bekannten Kennung — entweder im
    // Markup oder per JS erzeugt. Nach der Kennung suchen, nicht nach dem Wort:
    // „Gerätename" steht auch in jedem Kommentar.
    if (/id\s*=\s*["']sbkim-geraetename["']/.test(t) ||
        /\.id\s*=\s*["']sbkim-geraetename["']/.test(t)) hatFeld = true;
    // Die ANZEIGE: der Name wird an die Anmeldung durchgereicht.
    if (/displayNodeName\s*\(/.test(t)) hatAnzeige = true;
    // Der SPEICHER: gelesen wird der geteilte Schlüssel.
    if (/sbkim_geraetename/.test(t)) hatSpeicher = true;
  }

  sage(hatFeld, `${k.repo} (${k.adresse}): hat ein eigenes Eingabefeld`,
       "kein Element mit id=\"sbkim-geraetename\" gefunden — der Name ließe sich hier nie setzen");
  sage(hatSpeicher, `${k.repo}: liest sbkim_geraetename`);
  sage(hatAnzeige, `${k.repo}: reicht den Namen an die Anmeldung durch (displayNodeName)`);
}

// ── Der stille Fall, der eigens genannt gehört ──────────────────────────────
// Verdrahtung ohne Feld sieht im Code vollständig aus. Sie ist der Grund, warum
// diese Probe nicht einfach „irgendwas mit Gerätename vorhanden" zählt.
for (const k of EIGENE_ADRESSE) {
  const wurzel = join(HEIM, k.repo);
  if (!existsSync(wurzel)) continue;
  let feld = false, anzeige = false;
  for (const p of dateien(wurzel)) {
    let t; try { t = readFileSync(p, "utf-8"); } catch { continue; }
    if (/id\s*=\s*["']sbkim-geraetename["']/.test(t) || /\.id\s*=\s*["']sbkim-geraetename["']/.test(t)) feld = true;
    if (/displayNodeName\s*\(/.test(t)) anzeige = true;
  }
  sage(!(anzeige && !feld),
       `${k.repo}: keine Verdrahtung ohne Feld (der stille Fall)`,
       "displayNodeName ist da, das Feld fehlt — die Verdrahtung liest für immer einen leeren Wert");
}

console.log(`\nErgebnis: ${gruen} grün, ${rot} rot` +
            (uebersprungen ? `, ${uebersprungen} nicht prüfbar` : "") + "\n");

// Der Fall, der sonst als „bestanden" durchginge: liegt KEINES der Repos neben
// Sage, hat diese Probe nichts geprüft — und meldete trotzdem grün. Ein grüner
// Haken über einem Loch ist schlimmer als ein roter, denn man sieht ihn nicht.
// Darum wird das ausdrücklich rot.
if (gruen === 0 && rot === 0) {
  console.error("✗ ROT — NICHTS GEPRÜFT: keines der Knoten-Repos liegt neben Sage.\n" +
                "   Diese Probe braucht die Nachbar-Klone (../PWA-Toolpoint usw.).\n" +
                "   „Grün\" hieße hier nur: es wurde nicht hingesehen.\n");
  process.exit(1);
}
process.exit(rot ? 1 : 0);
