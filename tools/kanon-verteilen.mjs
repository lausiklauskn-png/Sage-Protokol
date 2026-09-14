#!/usr/bin/env node
/*
 * kanon-verteilen.mjs — traegt eine Kanon-Aenderung in ALLE Traeger, von selbst.
 *
 * WARUM ES DIESES WERKZEUG GIBT (Klaus 2026-09-14, nachdem er gefragt hat,
 * wie lange wir noch brauchen).
 *
 * Jede Kanon-Aenderung kostete bis heute Handarbeit MAL ZWANZIG. Am 2026-09-14
 * waren es 23 Pull Requests fuer ZWEI uebersetzte Woerter im Wappen. Das ist
 * nicht der Preis der Aenderung, sondern der Preis des Verteilens — und er
 * faellt bei jeder weiteren wieder an.
 *
 * ⚠ DIE LISTE WIRD GEFUNDEN, NICHT GEPFLEGT. Das ist die eine Entscheidung,
 * an der alles haengt, und sie folgt aus einem Schaden vom selben Tag:
 * BookLedgerPro fiel aus dem Rollout, weil ich nach der ERWARTETEN
 * Vorgaenger-Fassung gesucht hatte — es hing eine Generation weiter zurueck.
 * Eine von Hand gepflegte Liste haette denselben Fehler gemacht, nur dauerhaft.
 * Wer eine neue App baut, traegt sie hier NICHT ein: sie ist dabei, sobald sie
 * ein Modul traegt.
 *
 * ⚠ ERKANNT WIRD AM INHALT, NICHT AM DATEINAMEN. Jedes Kanon-Modul traegt in
 * seinem Kopf die Marke `SBKIM — Modul NN`. Das loest die Falle, in die ich am
 * 2026-09-14 fast gelaufen waere: SB-KIMTool-Point hat DREI Siegel-Dateien, und
 * nur eine ist die Kopie —
 *
 *     web/tools/sbkim-siegel.js   Marke da    → Kopie, wird bedient
 *     assets/sbkim-siegel.js      keine Marke → Loader, bleibt
 *     sandbox/16_siegel.js        keine Marke → Fassung des Modells, bleibt
 *
 * Eine Namens-Suche haette alle drei getroffen oder zwei verfehlt. Kim-Bell und
 * Mein-WorkFloh nennen dasselbe Modul `sbkim-siegel.js` — auch das ist egal.
 *
 * Aufruf:
 *   node tools/kanon-verteilen.mjs                  # nur nachsehen (Vorgabe)
 *   node tools/kanon-verteilen.mjs --schreiben      # kopieren + Pins + Cache-Bump
 *   node tools/kanon-verteilen.mjs --nachbarn /pfad # wo die Klone liegen
 *   node tools/kanon-verteilen.mjs --nur 16_siegel  # ein Modul statt aller
 *
 * Rueckgabewert: 0 wenn alles gleich ist (oder geschrieben wurde), sonst 1.
 * NICHT hinter eine Pipe haengen — `| tail` liefert den Wert von `tail`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, relative } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const schreiben = args.includes("--schreiben");
const ni = args.indexOf("--nachbarn");
const NACHBARN = ni >= 0 && args[ni + 1] ? args[ni + 1] : join(WURZEL, "..");
const nuri = args.indexOf("--nur");
const NUR = nuri >= 0 && args[nuri + 1] ? args[nuri + 1] : null;

const sha = (b) => createHash("sha256").update(b).digest("hex");

/* ── Die Marke im Modul-Kopf ───────────────────────────────────────────────
 * `SBKIM — Modul 16 —` · `SBKIM — Modul 23 UI —` · `SBKIM — Modul 20:`
 * Modul 20 schreibt einen Doppelpunkt statt des Gedankenstrichs; wer nur auf
 * „—" prueft, verliert es still. Gemessen, nicht angenommen. */
const MARKE = /SBKIM\s+—\s+Modul\s+([0-9]+[A-Za-z]?)(\s+UI)?\s*[—:]/;
function markeVon(text) {
  const kopf = text.slice(0, 400);
  const m = kopf.match(MARKE);
  return m ? `Modul ${m[1]}${m[2] ? " UI" : ""}` : null;
}

/* ⚠ EINE KANON-DATEI TRAEGT KEINE MARKE, und zu Recht: `noble-secp256k1.js`
 * ist FREMDER Code (MIT, Paul Miller) — dort gehoert keine SBKIM-Marke hinein.
 * Sie laeuft deshalb ueber den DATEINAMEN; sie heisst ueberall gleich. */
const UEBER_NAMEN = new Set(["noble-secp256k1.js"]);

/* ⚠⚠ `siegel-inhalt.js` WIRD NICHT VERTEILT, und das ist der wichtigste Riegel
 * dieses Werkzeugs. Beim Bau am 2026-09-14 stand sie zuerst in der Liste — und
 * die Probe deckte auf, was das angerichtet haette: die Datei traegt die
 * KOMPLETTE APP-IDENTITAET. Gemessen an family-project gegen Sage:
 *
 *     domain · endpoint · nodeName · domainDescription · domainKeywords
 *     stammCategories · guestCategories · backupPrefix
 *
 * Ein Ueberschreiben haette JEDER App Sages Namen, Sages Beschreibung und
 * Sages Stichworte gegeben — und damit ihren Bedeutungs-Vektor. Das ist genau
 * der Schaden vom 2026-08-16 („in Alis Moderaum landete die Beschreibung einer
 * fremden App im Wizard"), nur zwanzigfach und ohne dass jemand hinsieht.
 *
 * Sie ist APP-EIGENER KLEBSTOFF mit Kanon-Rumpf. Die 272 gemeinsamen Zeilen aus
 * dem Rumpf zu loesen ist Aufgabe A18 (erst zusammenfuehren, dann uebersetzen,
 * Klaus 2026-09-14) — bis dahin bleibt sie Handarbeit. Ein Werkzeug, das sie
 * anfasst, waere schneller als die Handarbeit und richtete mehr Schaden an. */
const NIE_VERTEILEN = new Set(["siegel-inhalt.js", "pruefer-siegel-inhalt.js"]);

/* ── 1. Den Kanon einlesen ────────────────────────────────────────────── */
const kanon = [];
for (const d of ["src/modules"]) {
  const abs = join(WURZEL, d);
  if (!existsSync(abs)) continue;
  for (const f of readdirSync(abs)) {
    if (!f.endsWith(".js")) continue;
    if (NIE_VERTEILEN.has(f)) continue;
    const p = join(abs, f);
    const roh = readFileSync(p);
    const txt = roh.toString("utf8");
    const marke = markeVon(txt);
    if (!marke && !UEBER_NAMEN.has(f)) continue;           // kein Kanon-Modul
    kanon.push({ name: f, pfad: p, marke, sha: sha(roh), roh });
  }
}
const gewaehlt = NUR ? kanon.filter((k) => k.name.includes(NUR)) : kanon;
if (!gewaehlt.length) { console.error(`✗ Kein Kanon-Modul gefunden${NUR ? ` fuer „${NUR}"` : ""}.`); process.exit(1); }

console.log(`Kanon: ${gewaehlt.length} Dateien aus ${relative(process.cwd(), WURZEL) || "."}`);
console.log(`Nachbarn: ${NACHBARN}\n`);

/* ── 2. In jedem Nachbar-Klon die Kopien FINDEN ───────────────────────── */
const UEBERSPRINGEN = new Set(["node_modules", ".git", "docs", "tests", "test", "mitschnitt", "archiv"]);
function jsDateien(wurzel, tiefe = 0) {
  const aus = [];
  if (tiefe > 4) return aus;
  let eintraege; try { eintraege = readdirSync(wurzel); } catch { return aus; }
  for (const e of eintraege) {
    if (UEBERSPRINGEN.has(e)) continue;
    const p = join(wurzel, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) aus.push(...jsDateien(p, tiefe + 1));
    else if (e.endsWith(".js") && st.size < 3_000_000) aus.push(p);
  }
  return aus;
}

const repos = readdirSync(NACHBARN).filter((r) => {
  const p = join(NACHBARN, r);
  try { return statSync(p).isDirectory() && existsSync(join(p, ".git")) && p !== WURZEL; }
  catch { return false; }
}).sort();

let gleich = 0, nachgezogen = 0, betroffen = 0;
const offen = [];

for (const repo of repos) {
  const rp = join(NACHBARN, repo);
  const treffer = [];
  for (const datei of jsDateien(rp)) {
    let roh; try { roh = readFileSync(datei); } catch { continue; }
    const name = basename(datei);
    if (NIE_VERTEILEN.has(name)) continue;   // zweiter Riegel, s. o.
    const txt = roh.toString("utf8");
    /* Erkennung: erst die Marke (traegt ueber jeden Dateinamen), sonst der
     * Name — aber NUR fuer die zwei benannten Ausnahmen oben. */
    const marke = markeVon(txt);
    const k = marke
      ? gewaehlt.find((x) => x.marke === marke)
      : (UEBER_NAMEN.has(name) ? gewaehlt.find((x) => x.name === name) : null);
    if (!k) continue;
    treffer.push({ datei, k, ist: sha(roh) });
  }
  if (!treffer.length) continue;
  betroffen++;

  const zurueck = treffer.filter((t) => t.ist !== t.k.sha);
  if (!zurueck.length) { gleich += treffer.length; continue; }

  console.log(`▶ ${repo}`);
  for (const t of zurueck) {
    const rel = relative(rp, t.datei);
    /* ⚠ WIE WEIT es zurueckhaengt, gehoert DANEBEN. Gemessen am 2026-09-14:
     * family-projects Modul 15 hing 188 Zeilen zurueck, Tomys Modul 04 155 —
     * das sind ganze Generationen, kein Nachtrag. Eine Meldung, die „haengt
     * zurueck" fuer zwei Zeilen und fuer zweihundert gleich schreibt, laedt
     * dazu ein, beides gleich zu behandeln. Ein Generationen-Sprung braucht
     * einen Probenlauf im Ziel-Repo; zwei Zeilen nicht. */
    const weite = zeilenAbstand(t.datei, t.k.pfad);
    const wie = weite >= 50 ? `  ⚠ ${weite} Zeilen — GENERATIONEN-SPRUNG, Proben im Ziel-Repo fahren`
              : weite > 0   ? `  (${weite} Zeilen)` : "";
    if (!schreiben) { console.log(`    ⚠ haengt zurueck: ${rel}  (${t.k.marke || t.k.name})${wie}`); offen.push(`${repo}/${rel}`); continue; }
    writeFileSync(t.datei, t.k.roh);
    console.log(`    ✓ nachgezogen: ${rel}  (${t.k.marke || t.k.name})`);
    nachgezogen++;
    pinsNachziehen(rp, t.ist, t.k.sha);
    cacheBump(rp, basename(t.datei));
  }
  gleich += treffer.length - zurueck.length;
}

/* Wie weit haengt eine Kopie zurueck? Gezaehlt in abweichenden Zeilen — eine
 * Zahl, die ein Mensch einordnen kann, im Gegensatz zu zwei Pruefsummen. */
function zeilenAbstand(a, b) {
  try {
    execFileSync("diff", [a, b], { encoding: "utf8" });
    return 0;
  } catch (e) {
    const aus = String(e.stdout || "");
    return aus.split("\n").filter((z) => z.startsWith("<") || z.startsWith(">")).length;
  }
}

/* ── 3. sha-Pins in ALLEN DREI LAENGEN ────────────────────────────────────
 * ⚠ SB-KIMTool-Point pinnt mit 16 Zeichen — eine Suche nach dem vollen
 * 64-Zeichen-sha findet ihn NICHT. Am 2026-09-14 gemessen, in allen drei
 * Laengen gesucht. UND: ein Repo kann seinen EIGENEN sha pinnen statt des
 * Sage-sha (BookLedgerPro, `3e17f6474fc7f96f`) — deshalb wird der ALTE Wert
 * der Kopie ersetzt, nicht der alte Kanon-Wert. */
function pinsNachziehen(rp, altSha, neuSha) {
  for (const L of [64, 16, 12]) {
    const a = altSha.slice(0, L), n = neuSha.slice(0, L);
    let dateien;
    try {
      dateien = execFileSync("grep", ["-rlF", a, "--include=*.mjs", "--include=*.js",
        "--include=*.json", "--include=*.md", "--include=*.sh", "--include=*.cjs", "."],
        { cwd: rp, encoding: "utf8" }).trim().split("\n").filter(Boolean);
    } catch { continue; }                    // grep: nichts gefunden
    for (const d of dateien) {
      if (d.includes("node_modules") || d.includes("/.git/")) continue;
      const p = join(rp, d);
      const s = readFileSync(p, "utf8");
      if (!s.includes(a)) continue;
      writeFileSync(p, s.split(a).join(n));
      console.log(`        ↳ Pin (${L}) nachgezogen: ${d}`);
    }
  }
}

/* ── 4. CACHE_VERSION — nur wo die Datei im Installations-Vorrat steht ────
 * ⚠ GEMESSEN, NICHT GERATEN: am 2026-09-14 brauchten 11 von 20 Repos einen
 * Bump, neun nicht — dort bewegt er nichts. Und die neue Nummer entsteht aus
 * der Datei, die gerade danebenliegt; wer sie gegen den eigenen alten Stand
 * zaehlt statt gegen den aktuellen, vergibt dieselbe Nummer zweimal
 * (Kimhub-Befund 2026-09-07: zwei Sitzungen, beide „v26"). */
function cacheBump(rp, dateiname) {
  for (const sw of jsDateien(rp).filter((p) => /(^|\/)[a-z-]*sw\.js$/.test(p.replace(/\\/g, "/")))) {
    let s; try { s = readFileSync(sw, "utf8"); } catch { continue; }
    const imVorrat = new RegExp(`["'\`][^"'\`]*${dateiname.replace(/\./g, "\\.")}["'\`]`).test(s);
    if (!imVorrat) continue;
    const m = s.match(/(var|const|let)\s+(CACHE_VERSION|CACHE)\s*=\s*(['"`])([^'"`]*?)(\d+)\3/);
    if (!m) { console.log(`        ⚠ ${relative(rp, sw)}: kein Bump moeglich (Muster nicht gefunden)`); continue; }
    const neu = m[0].slice(0, -(m[5].length + 1)) + (Number(m[5]) + 1) + m[3];
    writeFileSync(sw, s.slice(0, m.index) + neu + s.slice(m.index + m[0].length));
    console.log(`        ↳ Cache-Bump: ${relative(rp, sw)}  ${m[4]}${m[5]} → ${m[4]}${Number(m[5]) + 1}`);
  }
}

/* ── 5. Schluss ───────────────────────────────────────────────────────── */
console.log(`\n${betroffen} Repos tragen Kanon-Dateien · ${gleich} schon gleich · ` +
            (schreiben ? `${nachgezogen} nachgezogen` : `${offen.length} haengen zurueck`));
if (!schreiben && offen.length) {
  console.log(`\nZum Nachziehen:  node tools/kanon-verteilen.mjs --schreiben`);
}
process.exit(!schreiben && offen.length ? 1 : 0);
