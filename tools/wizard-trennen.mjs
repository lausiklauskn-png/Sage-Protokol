#!/usr/bin/env node
/*
 * wizard-trennen.mjs — traegt die A18-Trennlinie in einen Nachbar-Klon.
 *
 * Aus EINER Datei werden ZWEI, und die Trennlinie ist die aus INTERFACES §11.9:
 *
 *   siegel-inhalt.js          bleibt, schrumpft auf window.SBKIM_SIEGEL_WIZ
 *                             — die IDENTITAET, wird NIE verteilt
 *   sbkim-andock-wizard.js    neu, byte-gleich mit src/modules/16b_andock_wizard.js
 *                             — der ABLAUF, wird ab jetzt vom Automaten verteilt
 *
 * ⚠ WARUM EIN WERKZEUG UND NICHT NEUNZEHNMAL VON HAND: weil neunzehn Handgriffe
 * neunzehn Gelegenheiten sind, einen zu vergessen. Genau dieser Preis ist der
 * Grund, aus dem es kanon-verteilen.mjs ueberhaupt gibt (23 PRs fuer zwei
 * uebersetzte Woerter). Hier faellt er ein LETZTES Mal an — danach traegt der
 * Automat.
 *
 * ⚠ DIE EINBINDUNG WIRD GEFUNDEN, NICHT GERATEN. Jede App laedt die Datei
 * anders — als <script>-Tag, als Eintrag einer Nachlade-Kette, als Zeile im
 * Offline-Vorrat. Das Werkzeug sucht deshalb JEDE Zeile, die den Pfad in
 * Anfuehrungszeichen nennt, und legt dieselbe Zeile mit dem neuen Pfad
 * DANEBEN. Kommentare und Doku bleiben unangetastet.
 *
 * Aufruf:
 *   node tools/wizard-trennen.mjs ../Kim-Bell              # nur nachsehen
 *   node tools/wizard-trennen.mjs ../Kim-Bell --schreiben
 *
 * Rueckgabewert: 0 wenn alles klar ist, 1 wenn etwas offen blieb.
 * NICHT hinter eine Pipe haengen — `| tail` liefert den Wert von `tail`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, relative } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const KANON = readFileSync(join(WURZEL, "src/modules/16b_andock_wizard.js"), "utf8");

const args = process.argv.slice(2);
const ZIEL = args.find((a) => !a.startsWith("--"));
const schreiben = args.includes("--schreiben");
if (!ZIEL || !existsSync(join(ZIEL, ".git"))) {
  console.error("Aufruf: node tools/wizard-trennen.mjs <repo> [--schreiben]");
  process.exit(1);
}

const UEBERSPRINGEN = new Set(["node_modules", ".git", "docs", "archiv", "mitschnitt"]);
function dateien(w, tiefe = 0) {
  const aus = [];
  if (tiefe > 4) return aus;
  let e; try { e = readdirSync(w); } catch { return aus; }
  for (const n of e) {
    if (UEBERSPRINGEN.has(n)) continue;
    const p = join(w, n);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) aus.push(...dateien(p, tiefe + 1));
    else if (/\.(js|mjs|cjs|html)$/.test(n) && st.size < 8_000_000) aus.push(p);
  }
  return aus;
}

const alle = dateien(ZIEL);
let offen = 0;
console.log(`▶ ${basename(ZIEL)}`);

/* Beide Identitaets-Dateien, falls die App zwei Knoten traegt (PWA Toolpoint). */
const KONFIGS = alle.filter((p) => /(^|[\\/])(pruefer-)?siegel-inhalt\.js$/.test(p.replace(/\\/g, "/")));
if (!KONFIGS.length) { console.log("    — keine siegel-inhalt.js, nichts zu tun"); process.exit(0); }

for (const konfigPfad of KONFIGS) {
  const roh = readFileSync(konfigPfad, "utf8");
  const rel = relative(ZIEL, konfigPfad).replace(/\\/g, "/");
  const neuName = basename(konfigPfad).replace("siegel-inhalt.js", "sbkim-andock-wizard.js");
  const neuPfad = join(dirname(konfigPfad), neuName);
  const neuRel = relative(ZIEL, neuPfad).replace(/\\/g, "/");

  if (roh.includes("window.SBKIM_SIEGEL_WIZ")) { console.log(`    ✓ ${rel} ist schon getrennt`); continue; }

  /* Das WIZ-Objekt herausschneiden — von `var WIZ = {` bis zur schliessenden
   * Klammer auf derselben Einrueckung. Klammern zaehlen, nicht raten: eine
   * Beschreibung kann geschweifte Klammern enthalten. */
  const i = roh.indexOf("var WIZ = {");
  if (i < 0) { console.log(`    ✗ ${rel}: kein WIZ-Objekt gefunden — VON HAND ansehen`); offen++; continue; }
  let j = roh.indexOf("{", i), tiefe = 0, ende = -1, inStr = null;
  for (let k = j; k < roh.length; k++) {
    const c = roh[k];
    if (inStr) { if (c === "\\") k++; else if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "{") tiefe++;
    else if (c === "}") { tiefe--; if (tiefe === 0) { ende = k; break; } }
  }
  if (ende < 0) { console.log(`    ✗ ${rel}: WIZ-Objekt nicht geschlossen — VON HAND ansehen`); offen++; continue; }
  const koerper = roh.slice(j + 1, ende);

  const konfigNeu = `/*
 * Siegel-Inhalt — DIE IDENTITÄT DIESES KNOTENS, und sonst nichts.
 *
 * ⚠ HIER STEHT KEIN KANON. Der Andock-Wizard, alle Anzeigetexte und alle
 * Prüfungen liegen seit A18 (2026-09-14) in EINER netzweit byte-gleichen
 * Datei — \`${neuRel}\`, Kanon \`Sage-Protokol/src/modules/16b_andock_wizard.js\`.
 * Diese Datei trägt nur noch, was in jedem Knoten ANDERS sein muss.
 *
 * Warum die Trennung: gemessen über die 20 Kopien im Netz standen am 2026-09-14
 * ZWÖLF verschiedene Code-Fassungen desselben Werkzeugs. Jede Verbesserung
 * kostete Handarbeit mal zwanzig und unterblieb deshalb meistens.
 *
 * ⚠ UND DIESE DATEI WIRD NIE VERTEILT. Sie trägt die BEDEUTUNG des Knotens; ein
 * Überschreiben gäbe dieser App den Namen und den Vektor einer fremden — der
 * Schaden vom 2026-08-16 in Alis Moderaum.
 *
 * Vertrag: Sage-Protokol/docs/INTERFACES.md §11.9.
 */
(function () {
  "use strict";
  window.SBKIM_SIEGEL_WIZ = {${koerper}};
})();
`;

  /* Die Einbindung: jede Zeile, die den alten Pfad in Anfuehrungszeichen nennt,
   * bekommt eine Schwester mit dem neuen. */
  const name = basename(konfigPfad);
  const nachzuziehen = [];
  const vonHand = [];
  /* ⚠ PROBEN WERDEN NICHT MASCHINELL ANGEFASST. Eine Zeile in einem Waechter
   * sieht aus wie eine Einbindung und ist eine ZUSICHERUNG: mal muss sie
   * mitwandern, mal muss sie auf die NEUE Datei zeigen, mal auf beide. Wer das
   * mechanisch verdoppelt, baut stille Behauptungen ein — genau die Sorte
   * Schaden, gegen die diese Proben gebaut sind. Sie werden GEMELDET. */
  const istProbe = (q) => /(^|[\\/])(tests?|tools)[\\/]/.test(q.replace(/\\/g, "/"))
    || /\.(test|smoke|gegenprobe)\.(js|mjs|cjs)$/.test(q)
    || /(^|[\\/])(smoke|gegenprobe)_/.test(q.replace(/\\/g, "/"));
  for (const p of alle) {
    if (p === konfigPfad) continue;
    if (istProbe(p) && readFileSync(p, "utf8").includes(name)) { vonHand.push(p); continue; }
    const t = readFileSync(p, "utf8");
    if (!t.includes(name)) continue;
    if (t.includes(neuName)) continue;                       // schon getan
    const zeilen = t.split("\n");
    const raus = [];
    let getroffen = 0;
    /* ⚠ EIN BLOCK-KOMMENTAR WIRD MITGEZAEHLT, NICHT AM ZEILENANFANG ERKANNT.
     * Die erste Fassung sprang nur ueber Zeilen, die mit `//`, `*` oder `/*`
     * ANFANGEN — und zerlegte damit PWA Toolpoints `sw.js`: dort steht mitten
     * in einem Block-Kommentar die Zeile
     *     dessen `assets/siegel-inhalt.js` aus demselben Grund fehlt. */
     * Sie faengt mit einem Wort an und nennt den Pfad in Rueckwaerts-Strichen.
     * Das Werkzeug legte eine Schwester daneben, und der Service-Worker war
     * syntaktisch kaputt — ein Offline-Vorrat, der nicht mehr laedt. Gefunden
     * hat es die Probe des Ziel-Repos, nicht das Nachdenken.
     * Gezaehlt wird jetzt der ZUSTAND, nicht der Zeilenanfang. */
    let imBlock = false;
    for (const z of zeilen) {
      raus.push(z);
      const warImBlock = imBlock;
      const auf = z.lastIndexOf("/*"), zu = z.lastIndexOf("*/");
      if (auf > zu) imBlock = true; else if (zu > auf) imBlock = false;
      if (warImBlock || auf >= 0) continue;
      const nackt = z.trim();
      if (nackt.startsWith("//") || nackt.startsWith("#") || nackt.startsWith("<!--")) continue;
      /* Nur echte Einbindungen: der Pfad MUSS in Anfuehrungszeichen stehen. */
      if (!new RegExp(`["'\`][^"'\`]*${name.replace(/\./g, "\\.")}["'\`]`).test(z)) continue;
      raus.push(z.split(name).join(neuName));
      getroffen++;
    }
    if (getroffen) nachzuziehen.push({ pfad: p, inhalt: raus.join("\n"), getroffen });
  }

  /* CACHE_VERSION nur dort, wo der Vorrat die Datei wirklich nennt. */
  const bumps = [];
  /* ⚠ DERSELBE FEHLER, ZWEITE STELLE: auch hier wurde der Name im KOMMENTAR
   * gefunden. PWA Toolpoints `sw.js` erklaert in einem Block-Kommentar, warum
   * `siegel-inhalt.js` ABSICHTLICH nicht im Vorrat steht — und das Werkzeug
   * schloss daraus, dass sie drinsteht, und erhoehte die Cache-Nummer fuer
   * nichts. Eine Nummer, die sich ohne Grund bewegt, kostet jedem Nutzer einen
   * vollstaendigen Neu-Download. Gemessen wird ohne Kommentare. */
  const ohneKommentar = (t) => t.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
  for (const p of alle.filter((q) => /(^|[\\/])[a-z-]*sw\.js$/.test(q.replace(/\\/g, "/")))) {
    const t = readFileSync(p, "utf8");
    if (!new RegExp(`["'\`][^"'\`]*${name.replace(/\./g, "\\.")}["'\`]`).test(ohneKommentar(t))) continue;
    const m = t.match(/(var|const|let)\s+(CACHE_VERSION|CACHE)\s*=\s*(['"`])([^'"`]*?)(\d+)\3/);
    if (!m) { console.log(`    ⚠ ${relative(ZIEL, p)}: kein Cache-Bump moeglich (Muster fehlt)`); continue; }
    bumps.push({ pfad: p, m });
  }

  console.log(`    ${rel} → ${neuRel}`);
  console.log(`      Konfiguration: ${koerper.split("\n").length} Zeilen · Kanon: ${KANON.split("\n").length} Zeilen`);
  for (const n of nachzuziehen) console.log(`      Einbindung: ${relative(ZIEL, n.pfad)} (${n.getroffen}×)`);
  for (const v of vonHand) console.log(`      ⚠ VON HAND: ${relative(ZIEL, v)} nennt ${name} — Zusicherung, kein Muster`);
  for (const b of bumps) console.log(`      Cache-Bump: ${relative(ZIEL, b.pfad)}  ${b.m[4]}${b.m[5]} → ${b.m[4]}${Number(b.m[5]) + 1}`);
  if (!nachzuziehen.length) { console.log(`      ✗ NIEMAND laedt ${name} — von Hand ansehen`); offen++; }

  if (!schreiben) continue;
  writeFileSync(konfigPfad, konfigNeu);
  writeFileSync(neuPfad, KANON);
  for (const n of nachzuziehen) writeFileSync(n.pfad, n.inhalt);
  for (const b of bumps) {
    const t = readFileSync(b.pfad, "utf8");
    const m = b.m;
    const neu = m[0].slice(0, -(m[5].length + 1)) + (Number(m[5]) + 1) + m[3];
    writeFileSync(b.pfad, t.slice(0, m.index) + neu + t.slice(m.index + m[0].length));
  }
  console.log(`      ✓ geschrieben`);
}

if (!schreiben) console.log(`\nZum Schreiben:  node tools/wizard-trennen.mjs ${ZIEL} --schreiben`);
process.exit(offen ? 1 : 0);
