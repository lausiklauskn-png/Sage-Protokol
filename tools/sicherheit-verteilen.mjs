#!/usr/bin/env node
/* sicherheit-verteilen.mjs — trägt Sages sicherheit.html in alle Nachbar-Klone, die das Siegel
 * mit „Ausführlich erklärt" tragen (2026-10-17).
 *
 *   node tools/sicherheit-verteilen.mjs              # nur nachsehen (Vorgabe)
 *   node tools/sicherheit-verteilen.mjs --schreiben  # schreiben
 *   node tools/sicherheit-verteilen.mjs --nur Kimboard,Tomys-Hub
 *   node tools/sicherheit-verteilen.mjs --schreiben --ohne-bump   # zweiter Lauf derselben Sitzung
 *
 * Die Liste wird GEFUNDEN: jeder Klon unter /home/user, in dem `iframe.src = "sicherheit.html"`
 * steht. Ziel ist jede vorhandene sicherheit.html, sonst die Wurzel.
 *
 * Was ein Träger an der alten Seite angepasst hatte, bleibt (PFLICHT_MODULE: „wer den Text
 * anpasst, darf das"):
 *   · Akzentfarbe (`a { color }`, sonst --gold / --accent) → --akzent
 *   · Rückweg (href und deutscher Text)
 *   · Titel-Zusatz („So funktioniert das Mycel — App")
 *   · eigene Abschnitte zwischen <!-- APP-EIGEN-DE … --> und <!-- 11 --> bzw.
 *     <!-- APP-EIGEN-EN --> und <h2 id="en-regel">
 *   · data-sprache-schluessel am <html>
 *   · eigene Skripte zwischen <!-- APP-EIGEN-KOPF --> … <!-- /APP-EIGEN-KOPF --> (im <head>)
 *     und <!-- APP-EIGEN-FUSS --> … <!-- /APP-EIGEN-FUSS --> (vor </body>)
 *   · eine Seite mit canonical bleibt indexierbar (kein noindex); sonst gilt noindex.
 * Ein Träger mit eigener Sprachmechanik (data-i18n) wird NICHT geschrieben, nur gemeldet.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { cacheBump, cacheStandNachziehen, cacheStandFehler } from "./lib/cache-bump.mjs";

const SAGE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HOME = resolve(SAGE, "..");
const VORLAGE = readFileSync(join(SAGE, "sicherheit.html"), "utf8");
const schreiben = process.argv.includes("--schreiben");
// --ohne-bump: a second run in the same session must not bump the caches twice
const ohneBump = process.argv.includes("--ohne-bump");
const nurArg = process.argv.indexOf("--nur");
const nur = nurArg > 0 ? new Set(process.argv[nurArg + 1].split(",")) : null;

function git(repo, args) {
  try { return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }); } catch (_e) { return ""; }
}
function zwischen(s, a, b) {
  const i = s.indexOf(a); if (i < 0) return null;
  const j = s.indexOf(b, i + a.length); if (j < 0) return null;
  return s.slice(i, j);
}

export function anpassen(alt, vorlage = VORLAGE) {
  let neu = vorlage;
  const notiz = [];
  // accent
  let akzent = (/(?:^|[\s}])a\s*\{\s*color:\s*(#[0-9a-fA-F]{3,8})/m.exec(alt) || [])[1];
  if (!akzent) {
    const v = (/a\s*\{\s*color:\s*var\(--([a-z-]+)\)/.exec(alt) || [])[1];
    if (v) akzent = (new RegExp("--" + v + ":\\s*(#[0-9a-fA-F]{3,8})").exec(alt) || [])[1];
  }
  if (!akzent) akzent = (/--accent:\s*(#[0-9a-fA-F]{3,8})/.exec(alt) || [])[1];
  if (akzent && akzent.toLowerCase() !== "#36d6c3") {
    neu = neu.replace("--akzent: #36d6c3;", "--akzent: " + akzent + ";");
    notiz.push("Akzent " + akzent);
  }
  // back link
  const back = /<a\b[^>]*class="back"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>|<a\b[^>]*href="([^"]+)"[^>]*class="back"[^>]*>([^<]+)<\/a>/.exec(alt);
  if (back) {
    const href = back[1] || back[3], text = (back[2] || back[4]).trim();
    if (href !== "./") {
      neu = neu.replace('<a class="back" data-zurueck href="./">← zurück zur App</a>', `<a class="back" data-zurueck href="${href}">${text}</a>`);
      neu = neu.replace('<a class="back" data-zurueck href="./">← back to the app</a>', `<a class="back" data-zurueck href="${href}">← back to the app</a>`);
      notiz.push("Rückweg " + href);
    }
  }
  // title suffix
  const titel = (/<title>([^<]*)<\/title>/.exec(alt) || [])[1] || "";
  const teile = titel.split(/\s+[—–·]\s+/).map((x) => x.trim()).filter((x) => x && !/So funktioniert|und so bist|^SBKIM$/i.test(x));
  const zusatz = teile.length ? " — " + teile[teile.length - 1] : "";
  if (zusatz) { neu = neu.replace("<title>So funktioniert das Mycel</title>", "<title>So funktioniert das Mycel" + zusatz + "</title>"); notiz.push("Titel" + zusatz); }
  // language key
  const schluessel = (/data-sprache-schluessel="([^"]+)"/.exec(alt) || [])[1];
  if (schluessel) { neu = neu.replace('<html lang="de">', `<html lang="de" data-sprache-schluessel="${schluessel}">`); notiz.push("Sprach-Schlüssel " + schluessel); }
  // own sections
  const eigenDE = zwischen(alt, "<!-- APP-EIGEN-DE", "<!-- 11 -->");
  const eigenEN = zwischen(alt, "<!-- APP-EIGEN-EN -->", '<h2 id="en-regel">');
  if (eigenDE && eigenDE.split("\n").length > 3) {
    neu = neu.replace(zwischen(neu, "<!-- APP-EIGEN-DE", "<!-- 11 -->"), eigenDE); notiz.push("eigene Abschnitte (DE)");
  }
  if (eigenEN && eigenEN.split("\n").length > 3) {
    neu = neu.replace(zwischen(neu, "<!-- APP-EIGEN-EN -->", '<h2 id="en-regel">'), eigenEN); notiz.push("eigene Abschnitte (EN)");
  }
  // own scripts of a carrier (language lock in the head, handlers at the foot)
  const kopf = zwischen(alt, "<!-- APP-EIGEN-KOPF -->", "<!-- /APP-EIGEN-KOPF -->");
  if (kopf) { neu = neu.replace('<meta charset="utf-8">', kopf + '<!-- /APP-EIGEN-KOPF -->\n<meta charset="utf-8">'); notiz.push("eigener Kopf"); }
  const fuss = zwischen(alt, "<!-- APP-EIGEN-FUSS -->", "<!-- /APP-EIGEN-FUSS -->");
  if (fuss) { neu = neu.replace("</body>", fuss + "<!-- /APP-EIGEN-FUSS -->\n</body>"); notiz.push("eigener Fuß"); }
  // canonical keeps the page indexable
  const canon = /<link rel="canonical"[^>]*>/.exec(alt);
  if (canon) {
    const desc = /<meta name="description"[^>]*>/.exec(alt);
    neu = neu.replace('<meta name="robots" content="noindex">\n', (desc ? desc[0] + "\n" : "") + canon[0] + "\n");
    notiz.push("indexierbar (canonical)");
  }
  return { neu, notiz };
}

function traeger() {
  const aus = [];
  for (const name of readdirSync(HOME).sort()) {
    const repo = join(HOME, name);
    if (!existsSync(join(repo, ".git")) || repo === SAGE) continue;
    if (nur && !nur.has(name)) continue;
    if (!git(repo, ["grep", "-l", 'iframe.src = "sicherheit.html"', "HEAD"]).trim()) continue;
    const vorhanden = git(repo, ["ls-files"]).split("\n").filter((f) => /(^|\/)sicherheit\.html$/.test(f));
    for (const f of (vorhanden.length ? vorhanden : ["sicherheit.html"])) aus.push({ name, repo, datei: f });
  }
  return aus;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let n = 0, gleich = 0, zurueck = 0;
  for (const t of traeger()) {
    const pfad = join(t.repo, t.datei);
    const alt = existsSync(pfad) ? readFileSync(pfad, "utf8") : "";
    if (/data-i18n="/.test(alt)) { zurueck++; console.log(`⊘ ${t.name}/${t.datei}: eigene Sprachmechanik (data-i18n) — von Hand`); continue; }
    const { neu, notiz } = anpassen(alt);
    if (neu === alt) { gleich++; console.log(`= ${t.name}/${t.datei}: schon auf dem Stand`); continue; }
    n++;
    console.log(`${schreiben ? "✎" : "→"} ${t.name}/${t.datei}${alt ? "" : " (fehlte)"}${notiz.length ? " · " + notiz.join(" · ") : ""}`);
    if (schreiben) {
      writeFileSync(pfad, neu);
      // a worker that keeps the page (in its store, or cache-first) would keep serving the old one
      if (!ohneBump) {
        const gebumpt = cacheBump(t.repo, pfad);
        cacheStandNachziehen(t.repo, t.name, gebumpt, false);
      }
    }
  }
  console.log(`\n${n} ${schreiben ? "geschrieben" : "anstehend"} · ${gleich} auf dem Stand · ${zurueck} von Hand` +
    (cacheStandFehler.length ? ` · ✗ ${cacheStandFehler.length} Cache-Stand gescheitert` : ""));
  process.exit(cacheStandFehler.length ? 1 : 0);
}
