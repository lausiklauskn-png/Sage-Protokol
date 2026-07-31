#!/usr/bin/env node
/*
 * SBKIM Voll-Box — Installer (ein Befehl, plattformübergreifend, ohne Fremdpakete).
 *
 * Kopiert die Voll-Geschenkbox in ein Ziel-Repo und trägt die <script>-Zeilen in
 * dessen index.html ein (Ladereihenfolge 17 vor 15 vor 16). Läuft überall, wo
 * Node ist — Windows, macOS, Linux, Android/Termux. Nur Node-Bordmittel, kein npm.
 *
 * AUFRUF
 *   node sbkim-bundle-voll/install.mjs               # Ziel = aktuelles Verzeichnis
 *   node sbkim-bundle-voll/install.mjs --target .    # Ziel ausdrücklich
 *   node install.mjs --fetch --target ./mein-repo    # Box aus dem Netz holen
 *   node install.mjs --dry                           # nur zeigen, nichts schreiben
 *   node install.mjs --help
 *
 * Was er tut (alles fail-soft, idempotent):
 *   1. Box-Dateien nach <ziel>/sbkim-bundle-voll/ kopieren (lokal ODER --fetch).
 *   2. In <ziel>/index.html einen markierten <script>-Block VOR </body> einsetzen
 *      (überspringt, wenn der Block schon da ist) + einen auskommentierten
 *      init()-Vorlage-Block, den man nur mit eigenen Werten füllt.
 *   3. Ehrlich berichten, was passiert ist.
 *
 * Er ändert NUR: <ziel>/sbkim-bundle-voll/* und (additiv) <ziel>/index.html.
 * Er verlangt kein GitHub-Konto und lädt nichts nach außen (außer bei --fetch,
 * dann liest er die öffentlichen Box-Dateien von raw.githubusercontent.com).
 */
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));         // …/sbkim-bundle-voll
const RAW_BASE =
  "https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim-bundle-voll";

// Ladereihenfolge = README-Reihenfolge. WICHTIG: 17 vor 15 vor 16.
const MODULES = [
  "noble-secp256k1.js", "01_storage.js", "02_spore.js", "03_embedding.js",
  "04_match.js", "05_anastomose.js", "05b_nostr_relay.js",
  "23_rendezvous.js", "23_rendezvous_ui.js",
  "17_floating_widget.js", "15_membran.js", "siegel-inhalt.js", "16_siegel.js",
  "19_andock_wizard.js", "20_schluessel_safe.js", "21_spracheingabe.js",
  "22_such_widget.js", "24_ocr_eingabe.js",
];
const ROOT_FILES = ["sbkim-connect.js", "README.md", "beispiel-voll.html"];

const MARK_A = "<!-- SBKIM Voll-Box: Anfang (vom Installer eingesetzt) -->";
const MARK_B = "<!-- SBKIM Voll-Box: Ende -->";

// ---- kleine Helfer ---------------------------------------------------------
function parseArgs(argv) {
  const a = { target: process.cwd(), fetch: false, dry: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--help" || t === "-h") a.help = true;
    else if (t === "--fetch") a.fetch = true;
    else if (t === "--dry" || t === "--dry-run") a.dry = true;
    else if (t === "--target") a.target = argv[++i] || a.target;
  }
  return a;
}
const say = (s) => console.log(s);
const warn = (s) => console.log("⚠  " + s);

async function readSource(rel, useFetch) {
  // Liest eine Box-Datei — lokal (neben dem Installer) oder aus dem Netz.
  if (!useFetch) {
    const p = join(HERE, rel);
    if (existsSync(p)) return await readFile(p);
  }
  const url = RAW_BASE + "/" + rel.split("\\").join("/");
  const res = await fetch(url);
  if (!res.ok) throw new Error("Download fehlgeschlagen (" + res.status + "): " + url);
  return Buffer.from(await res.arrayBuffer());
}

function scriptBlock() {
  const line = (p) => '  <script src="sbkim-bundle-voll/' + p + '"></script>';
  const core = [
    "modules/noble-secp256k1.js", "modules/01_storage.js", "modules/02_spore.js",
    "modules/03_embedding.js", "modules/04_match.js", "modules/05_anastomose.js",
    "modules/05b_nostr_relay.js", "modules/23_rendezvous.js", "modules/23_rendezvous_ui.js",
    "sbkim-connect.js",
  ];
  const trust = ["modules/17_floating_widget.js", "modules/15_membran.js",
    "modules/siegel-inhalt.js", "modules/16_siegel.js"];
  const extra = ["modules/19_andock_wizard.js", "modules/20_schluessel_safe.js",
    "modules/21_spracheingabe.js", "modules/22_such_widget.js", "modules/24_ocr_eingabe.js"];
  return [
    MARK_A,
    "  <!-- Verbinden-Kern -->",
    ...core.map(line),
    "  <!-- Vertrauen + Oberfläche: 17 VOR 15 VOR 16 -->",
    ...trust.map(line),
    "  <!-- Onboarding + Safe + optional Suche/Eingabe -->",
    ...extra.map(line),
    "  <script>",
    "  // SBKIM starten — Werte durch deine eigenen ersetzen und diesen Block einkommentieren.",
    "  // (async () => {",
    '  //   await SbkimConnect.init({ dbSuffix:"meineapp", nodeName:"Meine App",',
    '  //     endpoint:"https://…/", domain:"meine-domaene",',
    '  //     domainDescription:"Was die App ist …", domainKeywords:["Stichwort"] });',
    "  //   if (window.SbkimWidget)   await SbkimWidget.init();      // Lampen ZUERST",
    "  //   if (window.SbkimMembrane) await SbkimMembrane.init();",
    '  //   if (window.SbkimSiegel)   await SbkimSiegel.init({ ribbonText:"Meine App" });',
    "  // })();",
    "  </script>",
    MARK_B,
  ].join("\n");
}

// ---- Hauptlauf -------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    say("SBKIM Voll-Box Installer\n" +
      "  node install.mjs [--target <ordner>] [--fetch] [--dry]\n" +
      "  --target  Ziel-Repo (Standard: aktuelles Verzeichnis)\n" +
      "  --fetch   Box aus dem Netz laden statt lokal kopieren\n" +
      "  --dry     nur zeigen, nichts schreiben");
    return;
  }
  const target = resolve(args.target);
  const useFetch = args.fetch || !existsSync(join(HERE, "modules"));
  say("SBKIM Voll-Box → " + target);
  say("Quelle: " + (useFetch ? "Netz (raw.githubusercontent.com)" : "lokal (" + HERE + ")") +
    (args.dry ? "   [Trockenlauf — nichts wird geschrieben]" : ""));

  // 1) Box kopieren
  let copied = 0, failed = 0;
  const outDir = join(target, "sbkim-bundle-voll");
  const all = [...MODULES.map((m) => "modules/" + m), ...ROOT_FILES];
  for (const rel of all) {
    try {
      const data = await readSource(rel, useFetch);
      const dest = join(outDir, rel);
      if (!args.dry) { await mkdir(dirname(dest), { recursive: true }); await writeFile(dest, data); }
      copied++;
    } catch (e) { failed++; warn(rel + " — " + (e && e.message ? e.message : e)); }
  }
  say("  Dateien: " + copied + " kopiert" + (failed ? ", " + failed + " fehlgeschlagen" : "") +
    " → sbkim-bundle-voll/");

  // 2) index.html verdrahten (additiv, idempotent)
  const indexPath = join(target, "index.html");
  if (!existsSync(indexPath)) {
    warn("Keine index.html im Ziel gefunden — die Script-Zeilen bitte von Hand aus der README einsetzen.");
  } else {
    let html = await readFile(indexPath, "utf8");
    if (html.includes(MARK_A)) {
      say("  index.html: Script-Block schon vorhanden — übersprungen (idempotent).");
    } else {
      const block = scriptBlock();
      const lc = html.toLowerCase();
      const at = lc.lastIndexOf("</body>");
      const merged = at >= 0
        ? html.slice(0, at) + block + "\n" + html.slice(at)
        : html + "\n" + block + "\n";
      if (!args.dry) await writeFile(indexPath, merged);
      say("  index.html: Script-Block " + (at >= 0 ? "vor </body>" : "am Ende") + " eingesetzt.");
    }
  }

  // 3) Bericht
  say("");
  if (failed) {
    say("Fertig mit Hinweisen. " + failed + " Datei(en) nicht geholt — oben nachsehen.");
  } else {
    say("Fertig ✓  Die Box liegt in deinem Repo und ist in index.html verdrahtet.");
  }
  say("Nächster Schritt: in index.html den init()-Block (unten im eingesetzten Bereich)");
  say("mit deinen eigenen Werten füllen und einkommentieren. Details: sbkim-bundle-voll/README.md.");
  if (args.dry) say("\n(Trockenlauf — es wurde nichts geschrieben. Ohne --dry erneut ausführen.)");
}

main().catch((e) => { console.error("Installer-Fehler:", e && e.message ? e.message : e); process.exit(1); });
