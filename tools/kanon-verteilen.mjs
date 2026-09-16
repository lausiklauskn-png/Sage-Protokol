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

/* ── --nur-generation <sha> ────────────────────────────────────────────────
 * ERGAENZT AM 2026-09-16, WEIL „ganz oder gar nicht" die falsche Wahl war.
 * Modul 15 bekam seine englische Tabelle; von 20 Traegern standen 8 sonst
 * byte-genau auf dem Kanon, 12 auf einer aelteren Generation. Bei den 8 aendert
 * sich nur die Render-Schicht (gemessen: +203 / -22 Zeilen, alle 22 deutsche
 * Anzeige-Saetze), bei den 12 springt ein SCHUTZ-Modul ganze Generationen, und
 * dafuer verlangt die Verfassung einen Probenlauf im Ziel-Repo. Ohne Filter
 * haette `--schreiben` beides in einer Bewegung getan.
 *
 * ⚠ GEFILTERT WIRD NACH DEM sha DES TRAEGERS, NICHT NACH REPO-NAMEN. Eine
 * getippte Repo-Liste waere genau die gepflegte Liste, vor der der Kopf dieser
 * Datei warnt: sie vergisst die App, die nach ihr gebaut wurde. Der sha steht
 * in der Fassungs-Uebersicht dieses Laufs — er ist eine Messung, kein Name.
 *
 * ⚠ DIE UEBERSICHT BLEIBT VOLLSTAENDIG. Wuerde der Filter auch sie
 * beschneiden, meldete ein gefilterter Lauf „eine Fassung im Netz", waehrend
 * vier draussen liegen — die Auskunft, wegen der es den Filter ueberhaupt gibt. */
const geni = args.indexOf("--nur-generation");
const NUR_GEN = geni >= 0 && args[geni + 1] ? String(args[geni + 1]).trim().toLowerCase() : null;
if (NUR_GEN !== null && !/^[0-9a-f]{8,64}$/.test(NUR_GEN)) {
  /* Kein stilles Durchwinken: ein Tippfehler im sha traefe sonst KEINEN
   * Traeger, und „0 nachgezogen" saehe aus wie „nichts zu tun". */
  console.error(`--nur-generation braucht mindestens 8 Hex-Zeichen eines Traeger-sha, bekam: ${NUR_GEN}`);
  process.exit(2);
}

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
/* Wie jsDateien, nur auch fuer HTML — die Versions-Anhaenge stehen in den
   Seiten, nicht nur in den Skripten. */
function traegerDateien(wurzel, tiefe = 0) {
  const aus = [];
  if (tiefe > 4) return aus;
  let eintraege; try { eintraege = readdirSync(wurzel); } catch { return aus; }
  for (const e of eintraege) {
    if (UEBERSPRINGEN.has(e)) continue;
    const p = join(wurzel, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) aus.push(...traegerDateien(p, tiefe + 1));
    else if (/\.(js|html)$/.test(e) && st.size < 3_000_000) aus.push(p);
  }
  return aus;
}

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

/* ── Wessen Arbeitsbaum ist aelter als sein Depot? ─────────────────────────
 * ⚠ ERGAENZT AM 2026-09-16, NACH EINEM STILLEN UEBERSPRINGEN. Dieser Automat
 * liest den ARBEITSBAUM. BookLedgerPros Klon im Behaelter stand an dem Tag
 * 302 Commits / drei Monate zurueck (HEAD 2026-06-14, origin/main 2026-09-16),
 * weil sein Sitzungs-Zweig aus dem alten Klon abgezweigt war und der
 * Sitzungsstart-Hook einen Nicht-Standard-Zweig zu Recht nicht anfasst.
 *
 * Folge: in diesem Baum gab es `sbkim/15_membran.js` noch gar nicht. Der
 * Automat fand also keine Marke, zaehlte das Repo nicht als Traeger und
 * meldete „19 Repos tragen Kanon-Dateien" — waehrend auf `origin/main` ZWANZIG
 * eine Kopie tragen. Das Repo fiel aus dem Lauf, ohne dass eine Zeile darueber
 * stand.
 *
 * Das ist die Schwester der Lehre „eine gefundene Liste schuetzt vor einer
 * veralteten Kopie, nicht vor einer fehlenden" — nur ist die Kopie hier gar
 * nicht fehlend, sondern bloss unsichtbar. Gemeldet wird deshalb, WESSEN BAUM
 * aelter ist als sein Depot: dort sagt dieser Lauf ueber die Kanon-Dateien
 * nichts aus, weder „gleich" noch „haengt zurueck".
 *
 * Es wird NICHTS nachgezogen. Ein Automat, der fremde Arbeitsbaeume bewegt,
 * koennte ungepushte Arbeit ueberfahren — gemeldet, nicht angefasst. */
const veraltet = [];
const unmessbar = [];   // Depot da, aber kein Vergleichs-Zweig zu finden

/* Welchen Zweig nennt DIESES Depot seinen eigenen? Gefragt, nicht geraten.
 * ⚠ BIS ZUM 2026-09-16 STAND HIER `catch { def = "master"; }` — ein Raten mit
 * genau zwei erlaubten Antworten. Gibt es auch `origin/master` nicht, warf das
 * folgende `rev-list` ein „fatal: ambiguous argument" in die Ausgabe, der
 * aeussere catch schluckte es, und das Repo fiel aus der Pruefung, OHNE DASS
 * EINE ZEILE DARUEBER STAND. Gemessen an `Meine-In-and-Out-Book` (Depot ohne
 * einen einzigen Zweig auf origin). Das ist wortgleich der Schaden, gegen den
 * dieser ganze Block einen Tag vorher gebaut wurde — nur eine Zeile weiter. */
function standardZweig(rp) {
  try {
    const h = String(execFileSync("git", ["-C", rp, "symbolic-ref", "--short", "refs/remotes/origin/HEAD"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })).trim();
    if (h.startsWith("origin/")) return h.slice(7);
  } catch { /* kein origin/HEAD gesetzt — weiter unten nachsehen */ }
  for (const kandidat of ["main", "master"]) {
    try {
      execFileSync("git", ["-C", rp, "rev-parse", `origin/${kandidat}`], { stdio: "ignore" });
      return kandidat;
    } catch { /* der naechste */ }
  }
  return null;
}

for (const r of repos) {
  const rp = join(NACHBARN, r);
  try {
    execFileSync("git", ["-C", rp, "fetch", "origin", "--quiet"], { stdio: "ignore", timeout: 30000 });
    const def = standardZweig(rp);
    if (def === null) {
      /* Drei Ausgaenge, nicht zwei: aktuell · haengt zurueck · NICHT MESSBAR.
       * Ein leeres Depot ist kein Befund, aber es als „aktuell" zu verbuchen
       * waere einer. */
      const zweige = String(execFileSync("git", ["-C", rp, "branch", "-r"],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })).trim();
      unmessbar.push({ repo: r, grund: zweige ? "kein origin/main, origin/master oder origin/HEAD" : "kein Zweig auf origin" });
      continue;
    }
    const n = Number(String(execFileSync("git", ["-C", rp, "rev-list", "--count", `HEAD..origin/${def}`],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })).trim());
    if (n > 0) veraltet.push({ repo: r, n });
  } catch { /* kein Depot, kein Netz — fail-soft, das ist kein Befund */ }
}
if (veraltet.length) {
  console.log(`\n⚠ ARBEITSBAUM AELTER ALS DAS DEPOT — hier sagt dieser Lauf NICHTS aus:`);
  for (const v of veraltet) console.log(`  ${v.repo}: ${v.n} Commits hinter origin`);
  console.log(`  (frisch abzweigen, dann erneut laufen lassen — dieser Automat fasst fremde Baeume nicht an)`);
}
if (unmessbar.length) {
  console.log(`\n⊘ NICHT MESSBAR — kein Vergleichs-Zweig, also weder „aktuell" noch „haengt zurueck":`);
  for (const u of unmessbar) console.log(`  ${u.repo}: ${u.grund}`);
}

let gleich = 0, nachgezogen = 0, betroffen = 0;
const zurueckgehalten = [];   // vom --nur-generation-Filter uebergangen
/* ⚠ HIER OBEN, NICHT BEI cacheBump. Ein `const` unterhalb seiner Verwendung
 * liegt in der toten Zone — der erste Lauf starb mit „Cannot access
 * 'schonGebumpt' before initialization", nachdem er eine Datei geschrieben
 * hatte. Einmal je Worker je LAUF: zwei Kopien im selben Repo sind kein
 * zweiter Grund, den Vorrat wegzuwerfen. */
const schonGebumpt = new Set();
const offen = [];
/* ⚠ WIE VIELE FASSUNGEN NEBENEINANDER IM NETZ STEHEN — ergaenzt am 2026-09-16,
 * nachdem ich die eigene Ausgabe dieses Werkzeugs falsch gelesen habe.
 *
 * Es meldete fuer Modul 15 „19 haengen zurueck" mit Zeilen-Abstaenden von 225
 * bis 657. Daraus liest man „ueberall fehlt meine Aenderung, bei einigen etwas
 * mehr". Gemessen war es etwas anderes: ACHT Traeger trugen den Kanon
 * byte-genau, ZWOELF eine von VIER aelteren Fassungen — bis zu 349 Zeilen
 * zurueck, in einem SCHUTZ-Modul.
 *
 * Der Abstand je Datei beantwortet „wie weit ist DIESE zurueck". Er beantwortet
 * NICHT „wie viele verschiedene Staende liegen draussen" — und das ist die
 * Frage, an der sich entscheidet, ob ein Rollout ein Nachtrag oder ein
 * Generationen-Sprung ist. Gruppiert wird nach dem sha des TRAEGERS, nicht
 * nach dem Abstand: zwei Dateien koennen gleich weit zurueckhaengen und
 * trotzdem verschiedene Fassungen sein. */
const generationen = new Map();   // modul → Map<traeger-sha, string[]>

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
    const modName = t.k.marke || t.k.name;
    if (!generationen.has(modName)) generationen.set(modName, new Map());
    const gm = generationen.get(modName);
    /* ⚠ GRUPPIERT WIRD NACH DEM sha DES TRAEGERS, nicht nach seinem Abstand.
     * Zwei Dateien koennen gleich weit zurueckhaengen und trotzdem
     * verschiedene Fassungen sein — dann meldete diese Uebersicht EINE
     * Generation, wo ZWEI liegen, und genau darauf kommt es hier an. */
    const gkey = t.ist;
    if (!gm.has(gkey)) gm.set(gkey, []);
    gm.get(gkey).push(`${repo}/${rel}`);

    /* ⚠ ZURUECKGEHALTEN WIRD LAUT, NICHT STILL. Ein Traeger, der wegen des
     * Filters uebergangen wird, verschwindet sonst aus jeder Zeile des Laufs —
     * und ein Repo, das aus einem Rollout faellt, ohne dass eine Zeile darueber
     * steht, ist genau der Schaden vom Vortag (BookLedgerPro). Er steht
     * deshalb mit Grund da und zaehlt in der Schlusszeile mit. */
    if (NUR_GEN !== null && !t.ist.startsWith(NUR_GEN)) {
      console.log(`    ⤳ zurueckgehalten: ${rel}  (${modName}) — Fassung ${t.ist.slice(0, 12)}, nicht ${NUR_GEN}${wie}`);
      zurueckgehalten.push(`${repo}/${rel}`);
      continue;
    }

    if (!schreiben) { console.log(`    ⚠ haengt zurueck: ${rel}  (${modName})${wie}`); offen.push(`${repo}/${rel}`); continue; }
    writeFileSync(t.datei, t.k.roh);
    console.log(`    ✓ nachgezogen: ${rel}  (${t.k.marke || t.k.name})`);
    nachgezogen++;
    pinsNachziehen(rp, t.ist, t.k.sha);
    cacheBump(rp, t.datei);
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

/* ── 4. CACHE_VERSION — wo der Worker die Datei ueberhaupt ausliefern kann ──
 * ⚠ GEMESSEN, NICHT GERATEN: am 2026-09-14 brauchten 11 von 20 Repos einen
 * Bump, neun nicht — dort bewegt er nichts. Und die neue Nummer entsteht aus
 * der Datei, die gerade danebenliegt; wer sie gegen den eigenen alten Stand
 * zaehlt statt gegen den aktuellen, vergibt dieselbe Nummer zweimal
 * (Kimhub-Befund 2026-09-07: zwei Sitzungen, beide „v26").
 *
 * ⚠ DIE BEDINGUNG WAR ZU ENG — GEMESSEN AM 2026-09-16. Bis dahin hiess sie
 * „nur wo die Datei im Installations-Vorrat steht". Ein Worker, der
 * gleich-urspruengliche GETs CACHE-FIRST beantwortet, legt sie aber beim
 * ersten Abruf SELBST ab und liefert danach die alte Fassung weiter — auch
 * wenn sie in keiner Vorrats-Liste stand. Gemessen an drei Repos
 * (PWA-Toolpoint, Tomys-Hub, family-project): sbkim-andock-wizard.js steht
 * dort in keinem Vorrat, und alle drei bedienen ihn aus dem Speicher.
 * Ein Sicherheits-Update, das still nicht ankommt, ist der teuerste Fall.
 *
 * ⚠ ES WIRD NICHT GERATEN, OB EIN PFAD CACHE-FIRST LAEUFT. Das ist aus dem
 * Quelltext nicht verlaesslich zu lesen (Ausnahmen, Zweige, Reihenfolge), und
 * eine geratene Erkennung waere genau der stille Fehler, den sie verhindern
 * soll. Gebumpt wird deshalb, sobald der Worker ueberhaupt fetch abfaengt.
 * DIE KOSTEN SIND EINSEITIG: ein ueberfluessiger Bump kostet einmal die
 * Schale neu laden, ein ausgelassener kostet ein Update, das niemand bemerkt.
 * Betrifft 6 der 18 Repos; drei davon brauchten ihn wirklich. */
function cacheBump(rp, zielPfad) {
  const dateiname = basename(zielPfad);
  const ziel = zielPfad.replace(/\\/g, "/");
  /* ⚠ DER GELTUNGSBEREICH ENTSCHEIDET, NICHT DAS REPO. Ein Worker unter
   * bookledger/sw.js kann eine Datei unter sbkim/ gar nicht ausliefern — ihn
   * zu bumpen wirft den Vorrat einer FREMDEN Unter-App weg. Gemessen am
   * 2026-09-16: die erste Fassung dieser Regel bumpte in Tomys-Hub FUENF
   * Unter-Apps, von denen keine den Wizard je sieht. */
  for (const sw of jsDateien(rp).filter((p) => /(^|\/)[a-z-]*sw\.js$/.test(p.replace(/\\/g, "/")))) {
    if (schonGebumpt.has(sw)) continue;
    let s; try { s = readFileSync(sw, "utf8"); } catch { continue; }
    const bereich = dirname(sw).replace(/\\/g, "/") + "/";
    const imVorrat = new RegExp(`["'\`][^"'\`]*${dateiname.replace(/\./g, "\\.")}["'\`]`).test(s);
    /* ⚠ EIN fetch-LISTENER ALLEIN IST KEIN VORRAT. `sbkim/sbkim-sw.js` faengt
     * POSTs ab und leitet sie an die Seite weiter — es legt NICHTS ab. Ohne
     * diese Bedingung meldete der Automat dort dreimal „kein Bump moeglich":
     * eine Warnung, die immer kommt, verdeckt die eine, auf die es ankommt. */
    const faengtAb = ziel.startsWith(bereich)
      && /addEventListener\s*\(\s*["'`]fetch["'`]/.test(s)
      && /\bcaches\s*\./.test(s);
    if (!imVorrat && !faengtAb) continue;
    /* ⚠ SW_VERSION GEHOERT DAZU. Mein Mixarium nennt seine Nummer so — bis zum
     * 2026-09-16 meldete der Automat dort „kein Bump moeglich" und ging weiter.
     * Eine Meldung, die niemand liest, ist kein Bump. */
    const m = s.match(/(var|const|let)\s+(CACHE_VERSION|CACHE|SW_VERSION)\s*=\s*(['"`])([^'"`]*?)(\d+)\3/);
    if (!m) { console.log(`        ⚠ ${relative(rp, sw)}: kein Bump moeglich (Muster nicht gefunden)`); continue; }
    const neu = m[0].slice(0, -(m[5].length + 1)) + (Number(m[5]) + 1) + m[3];
    writeFileSync(sw, s.slice(0, m.index) + neu + s.slice(m.index + m[0].length));
    schonGebumpt.add(sw);
    console.log(`        ↳ Cache-Bump: ${relative(rp, sw)}  ${m[4]}${m[5]} → ${m[4]}${Number(m[5]) + 1}`);

    /* ── ⚠ UND DIE ?v= ZIEHEN MIT — aber NUR, wo sie VORHER schon passten ──
     *
     * GEMESSEN am 2026-09-16, und zwar an einem Schaden, den dieser Automat
     * selbst angerichtet hat: er hob `family-projekt-v116` auf `v117` und
     * `pwa-toolpoint-v56` auf `v57` — und liess die `?v=` stehen. Beide
     * Marktplaetze binden ihre Asset-Adressen aber an die Cache-Nummer, und
     * beide Baeume waren danach ROT. Eine Stunde zuvor war genau diese Luecke
     * in beiden von Hand geschlossen worden.
     *
     * ⚠ ES WIRD NICHT GERATEN, OB EIN ?v= DIE CACHE-NUMMER MEINT. Netzweit
     * gemessen (28 Repos) heisst es meistens etwas ANDERES: in Rezeptbuch,
     * Muttis und Mixarium ist es der ICON-Zaehler und steht bei `?v=1`,
     * waehrend die Cache-Nummer ganz woanders liegt. Wer dort mitzieht,
     * schreibt eine Zahl um, die eine andere Sache zaehlt.
     *
     * Der Riegel ist deshalb eine MESSUNG, keine Annahme: mitgezogen wird nur,
     * was vor dem Bump BUCHSTAEBLICH auf der alten Cache-Nummer stand. Stimmten
     * sie vorher ueberein, gehoeren sie zusammen; taten sie es nicht, bleibt
     * alles liegen. `ASSET_V` zaehlt mit — es ist die ausdrueckliche Erklaerung
     * einer Seite, dass ihre Adressen an der Cache-Nummer haengen. */
    const altN = m[5], neuN = String(Number(m[5]) + 1);
    const vMuster = new RegExp(`\\?v=${altN}(?!\\d)`, "g");
    const aMuster = new RegExp(`(ASSET_V\\s*=\\s*(['"\`]))${altN}\\2`, "g");
    let gezogen = 0, dateienGezogen = 0;
    for (const d of traegerDateien(rp)) {
      let t; try { t = readFileSync(d, "utf8"); } catch { continue; }
      const treffer = (t.match(vMuster) || []).length + (t.match(aMuster) || []).length;
      if (!treffer) continue;
      writeFileSync(d, t.replace(vMuster, `?v=${neuN}`).replace(aMuster, `$1${neuN}$2`));
      gezogen += treffer; dateienGezogen++;
    }
    /* Eine Meldung, die niemand liest, ist kein Bump — also steht auch hier
       die Zahl da, statt es still zu tun. */
    if (gezogen) {
      console.log(`        ↳ ?v= mitgezogen: ${gezogen} Stellen in ${dateienGezogen} Dateien  ${altN} → ${neuN}`);
    }
  }
}

/* ── 4b. Wie viele Fassungen liegen draussen? ─────────────────────────── */
/* Nur fuer Module, bei denen ueberhaupt etwas zurueckhaengt — eine Uebersicht,
 * die bei jedem Lauf „1 Fassung" meldet, liest bald niemand mehr. */
{
  const mehrfach = [...generationen.entries()].filter(([, gm]) => gm.size > 0);
  if (mehrfach.length) {
    console.log(`\nFassungen im Netz (nach sha des Traegers, nicht nach Abstand):`);
    for (const [mod, gm] of mehrfach) {
      const sortiert = [...gm.entries()].sort((a, b) => b[1].length - a[1].length);
      const wort = sortiert.length === 1 ? "eine aeltere Fassung" : `${sortiert.length} verschiedene aeltere Fassungen`;
      console.log(`  ${mod}: ${wort} bei ${sortiert.reduce((n, e) => n + e[1].length, 0)} Traegern`);
      for (const [sha, wo] of sortiert) {
        console.log(`     ${sha.slice(0, 12)}  ${wo.length}×  ${wo.map((x) => x.split("/")[0]).join(", ")}`);
      }
      if (sortiert.length > 1) {
        console.log(`     ⚠ MEHR ALS EINE aeltere Fassung — das ist kein Nachtrag, das sind Generationen.`);
      }
    }
  }
}

/* ── 5. Schluss ───────────────────────────────────────────────────────── */
console.log(`\n${betroffen} Repos tragen Kanon-Dateien · ${gleich} schon gleich · ` +
            (schreiben ? `${nachgezogen} nachgezogen` : `${offen.length} haengen zurueck`) +
            (NUR_GEN !== null ? ` · ${zurueckgehalten.length} zurueckgehalten (andere Fassung)` : ""));

/* ⚠ EIN FILTER, DER NICHTS TRIFFT, IST EIN BEFUND — KEIN STILLES „NICHTS ZU TUN".
 * Ein Tippfehler im sha laesst jeden Traeger durch den Zurueckgehalten-Zweig
 * fallen; die Schlusszeile meldete dann „0 nachgezogen", und das sieht genauso
 * aus wie ein Netz, das schon gleich steht. Dieselbe Familie wie „0 Treffer ist
 * erst dann eine Aussage, wenn man belegt hat, dass man ueberall hineingesehen
 * hat" (LEHREN § 1). */
if (NUR_GEN !== null && zurueckgehalten.length && !nachgezogen && !offen.length) {
  console.error(`\n✗ --nur-generation ${NUR_GEN} trifft KEINEN der ${zurueckgehalten.length} zurueckhaengenden Traeger.`);
  console.error(`  Die Fassungen, die es wirklich gibt, stehen oben unter „Fassungen im Netz".`);
  process.exit(2);
}

if (!schreiben && offen.length) {
  console.log(`\nZum Nachziehen:  node tools/kanon-verteilen.mjs --schreiben` +
              (NUR_GEN !== null ? ` --nur-generation ${NUR_GEN}` : ""));
}
process.exit(!schreiben && offen.length ? 1 : 0);
