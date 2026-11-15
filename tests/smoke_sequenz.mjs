#!/usr/bin/env node
/* smoke_sequenz.mjs — die Film-Sequenzen (assets/sequenz.js) zeigen auf Dateien, die es gibt.
 *
 * Was hier bewacht wird: ein <figure class="sequenz"> ohne Clip, ohne Standbild oder ohne das
 * Skript sieht im Browser nicht kaputt aus (fail-soft), es fehlt nur still. Genau deshalb
 * braucht es eine Probe, die hineinsieht.
 *
 *   node tests/smoke_sequenz.mjs            # prüft das Depot
 *   SEQUENZ_WURZEL=/pfad node tests/…       # prüft eine Kopie (für die Gegenprobe)
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = process.env.SEQUENZ_WURZEL || resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SEITEN = ["index.html", "paper.html"];
let rot = 0, gruen = 0;
const t = (name, ok, detail = "") => {
  if (ok) { gruen++; console.log("  ✓ " + name); }
  else { rot++; console.log("  ✗ " + name + (detail ? " — " + detail : "")); }
};
const da = (p) => existsSync(p) && statSync(p).size > 1000;

let figuren = 0;
for (const seite of SEITEN) {
  const html = readFileSync(join(WURZEL, seite), "utf8");
  const basis = dirname(join(WURZEL, seite));
  const funde = [...html.matchAll(/<figure class="sequenz"([^>]*)>([\s\S]*?)<\/figure>/g)];
  t(`${seite}: trägt mindestens eine Sequenz`, funde.length > 0);
  t(`${seite}: lädt assets/sequenz.js`, /<script src="assets\/sequenz\.js"><\/script>/.test(html));
  for (const [, attr, innen] of funde) {
    figuren++;
    const video = (attr.match(/data-video="([^"]+)"/) || [])[1];
    const poster = (attr.match(/data-poster="([^"]+)"/) || [])[1];
    const name = video || "(ohne data-video)";
    t(`${seite} · ${name}: Clip liegt im Depot`, !!video && da(join(basis, video)));
    t(`${seite} · ${name}: Standbild liegt im Depot`, !!poster && da(join(basis, poster)));
    t(`${seite} · ${name}: nichts wird von einem fremden Host geholt`, !/^(https?:)?\/\//.test(video || "") && !/^(https?:)?\/\//.test(poster || ""));
    const stationen = (innen.match(/<li>/g) || []).length;
    t(`${seite} · ${name}: mindestens zwei Stationen mit Text`, /class="sequenz-stationen"/.test(innen) && stationen >= 2, `${stationen} gefunden`);
  }
}

// The invitation page carries its own copy, because it must stay self-contained.
const einladung = join(WURZEL, "docs/einladung/index.html");
const eh = readFileSync(einladung, "utf8");
const film = (eh.match(/class="scene1-film"[^>]*data-src="([^"]+)"/) || [])[1];
t("Einladung: Szene 1 nennt einen Film", !!film);
t("Einladung: der Film liegt im eigenen Ordner", !!film && da(join(dirname(einladung), film)));
t("Einladung: der Film lädt nicht vorab (preload=none, kein src im Markup)", /class="scene1-film"[^>]*preload="none"/.test(eh) && !/class="scene1-film"[^>]*\ssrc=/.test(eh));

const js = readFileSync(join(WURZEL, "assets/sequenz.js"), "utf8");
t("sequenz.js: lädt den Clip erst bei Sichtbarkeit (preload none + IntersectionObserver)", /preload = 'none'/.test(js) && /IntersectionObserver/.test(js));
t("sequenz.js: achtet auf prefers-reduced-motion und Save-Data", /prefers-reduced-motion/.test(js) && /saveData/.test(js));
t("sequenz.js: ein kaputter Clip nimmt den Knopf mit (kein toter Knopf)", /addEventListener\('error'[\s\S]{0,260}knopf\.remove\(\)/.test(js));

console.log(`\n═══ ${figuren} Sequenzen · ${gruen} grün · ${rot} ROT ═══`);
process.exit(rot ? 1 : 0);
