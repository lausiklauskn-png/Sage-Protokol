/* Waechter fuer tools/kanon-verteilen.mjs (Klaus 2026-09-14).
 *   node tests/smoke_kanon_verteilen.mjs
 *
 * WARUM ES DIESE PROBE GIBT. Das Werkzeug schreibt in ZWANZIG fremde Repos.
 * Ein Fehler darin ist keine rote Zeile, sondern zwanzig kaputte Apps — und
 * beim Bauen hat die erste Fassung wirklich `siegel-inhalt.js` mitverteilt,
 * also die komplette App-Identitaet ueberschrieben. Gefunden hat das nicht das
 * Nachdenken, sondern ein Blick in den Diff zweier Repos.
 *
 * ⚠ SIE FAEHRT DAS WERKZEUG WIRKLICH, an einem Wegwerf-Baum. Ein Waechter, der
 * den Quelltext LIEST, misst nicht, ob er LAEUFT — dieselbe Lehre wie bei
 * Abschnitt 4b der Sprach-Probe, an einer anderen Tuer.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
let pass = 0, fail = 0;
const ok = (b, m, d = "") => { if (b) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m, d ? "— " + d : ""); } };

const werkzeug = join(wurzel, "tools", "kanon-verteilen.mjs");

/* ── Ein Wegwerf-Netz: ein Sage, drei Nachbarn ────────────────────────── */
function netzBauen() {
  const w = mkdtempSync(join(tmpdir(), "kanon-"));
  const sage = join(w, "Sage-Protokol");
  mkdirSync(join(sage, "src", "modules"), { recursive: true });
  mkdirSync(join(sage, "tools"), { recursive: true });
  mkdirSync(join(sage, "assets"), { recursive: true });
  writeFileSync(join(sage, "tools", "kanon-verteilen.mjs"), readFileSync(werkzeug));

  const modul = (nr, inhalt) =>
    `/*\n * SBKIM — Modul ${nr} — Probe\n */\n${inhalt}\n`;
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var NEU = 2;"));
  writeFileSync(join(sage, "src/modules/17_floating_widget.js"), modul(17, "var X = 1;"));
  /* ⚠ MODUL 20 SCHREIBT EINEN DOPPELPUNKT statt des Gedankenstrichs. Ohne ein
   * solches Modul im Wegwerf-Netz misst die Probe die Muster-Breite NICHT —
   * beim ersten Gegenprobe-Lauf am 2026-09-14 genau so durchgerutscht. */
  writeFileSync(join(sage, "src/modules/20_schluessel_safe.js"),
    `/*\n * SBKIM — Modul 20: Schluessel-Safe\n */\nvar S = 2;\n`);
  /* ⚠ DIE IDENTITAETS-DATEI LIEGT IM KANON-PFAD. Sie gehoert dort NICHT hin —
   * genau deshalb steht sie hier: nur so kommt die Sperrliste ueberhaupt an die
   * Reihe. Lag sie (wie in Sage) unter assets/, waere sie schon durch den
   * Lese-Pfad ausgeschlossen, und der Riegel waere von seinem Fehlen nicht zu
   * unterscheiden. */
  writeFileSync(join(sage, "src/modules/siegel-inhalt.js"),
    `/*\n * SBKIM — Modul 99 — Klebstoff\n */\nvar WIZ = { nodeName: "Sage", domainDescription: "Sages Beschreibung" };\n`);

  const app = (name, dateien) => {
    const p = join(w, name);
    for (const [rel, inhalt] of Object.entries(dateien)) {
      mkdirSync(join(p, dirname(rel)), { recursive: true });
      writeFileSync(join(p, rel), inhalt);
    }
    mkdirSync(join(p, ".git"), { recursive: true });
    return p;
  };

  /* App 1: traegt Modul 16 unter EIGENEM Dateinamen und haengt zurueck. */
  app("App-Eins", {
    "modules/sbkim-siegel.js": modul(16, "var ALT = 1;"),
    "modules/20_schluessel_safe.js": `/*\n * SBKIM — Modul 20: Schluessel-Safe\n */\nvar S = 1;\n`,
    /* ⚠ MIT MARKE. Ohne sie kaeme der zweite Riegel nie an die Reihe, und ein
     * Fall darauf waere immer „nicht gefangen" — so geschehen beim ersten
     * Gegenprobe-Lauf. */
    "assets/siegel-inhalt.js":
      `/*\n * SBKIM — Modul 99 — Klebstoff\n */\nvar WIZ = { nodeName: "App Eins", domainDescription: "Eigene Beschreibung" };\n`,
    "sw.js": `var CACHE_VERSION = "app-eins-v7";\nvar ASSET_V = "7";\nvar CORE = ["modules/sbkim-siegel.js"];\n`,
    /* ⚠ ZWEI SORTEN ?v= IN EINER SEITE, und das ist der ganze Punkt. Die eine
     * steht auf der Cache-Nummer (7) — sie MEINT die Schale und muss mitziehen.
     * Die andere ist ein Icon-Zaehler (1) und meint etwas voellig anderes; wer
     * die mitzieht, schreibt eine fremde Zahl um. Netzweit gemessen am
     * 2026-09-16: in Rezeptbuch, Muttis und Mixarium ist ?v= GENAU dieser
     * Icon-Zaehler. */
    "index.html": `<link rel="stylesheet" href="assets/style.css?v=7">\n`
      + `<link rel="icon" href="icons/app.png?v=1">\n`
      + `<script src="assets/app.js?v=7"></script>\n`,
    /* ⚠ EIN ZWEITER WORKER, in dessen Vorrat die Datei NICHT steht. Ohne ihn
     * aendert ein ausgebauter Vorrat-Riegel nichts, und der Fall misst nichts. */
    "extra-sw.js": `var CACHE_VERSION = "extra-v3";\nvar CORE = ["index.html"];\n`,
    /* ⚠ EIN WORKER, DER DIE DATEI NICHT FUEHRT UND SIE TROTZDEM AUSLIEFERT.
     * Cache-first: er legt jede gleich-urspruengliche Antwort selbst ab und
     * bedient sie danach aus dem Speicher — auch was in keinem Vorrat stand.
     * Gemessen am 2026-09-16 an PWA-Toolpoint, Tomys-Hub und family-project:
     * dort blieb der Wizard genau so haengen. */
    "laufzeit-sw.js": `var CACHE_VERSION = "laufzeit-v2";\n`
      + `self.addEventListener("fetch", function (e) {\n`
      + `  e.respondWith(caches.match(e.request).then(function (h) { return h || fetch(e.request); }));\n});\n`,
    /* ⚠ UND DIE GEGENRICHTUNG: derselbe Worker, aber in einem Unterordner.
     * Sein Geltungsbereich ist `unterapp/` — `modules/…` kann er gar nicht
     * ausliefern. Ihn zu bumpen wirft den Vorrat einer FREMDEN Unter-App weg. */
    "unterapp/sw.js": `var CACHE_VERSION = "unterapp-v5";\n`
      + `self.addEventListener("fetch", function (e) {\n`
      + `  e.respondWith(caches.match(e.request).then(function (h) { return h || fetch(e.request); }));\n});\n`,
  });
  /* App 2: schon gleich — darf NICHT angefasst werden. */
  app("App-Zwei", { "sbkim/16_siegel.js": modul(16, "var NEU = 2;") });
  /* App 3: drei Dateien mit aehnlichem Namen, nur EINE ist die Kopie. */
  app("App-Drei", {
    "web/16_siegel.js": modul(16, "var ALT = 1;"),                       // Kopie (Marke)
    "assets/sbkim-siegel.js": "/* Loader, keine Marke */\nvar L = 1;\n",  // kein Kanon
    "sandbox/16_siegel.js": "/* Fassung des Modells, keine Marke */\nvar M = 1;\n",
  });
  /* App 4: eine ZWEITE, ANDERE alte Fassung desselben Moduls. Ohne sie steht
   * im Wegwerf-Netz nur EINE aeltere Fassung, und der Generationen-Wächter
   * waere von seinem Fehlen nicht zu unterscheiden — er meldete so oder so
   * „eine aeltere Fassung". Gemessen wird, dass er ZWEI auseinanderhaelt. */
  app("App-Vier", { "sbkim/16_siegel.js": modul(16, "var NOCH_AELTER = 0;") });
  return { w, sage };
}

function lauf(sage, w, extra = []) {
  try {
    return { text: execFileSync("node", [join(sage, "tools", "kanon-verteilen.mjs"),
      "--nachbarn", w, ...extra], { encoding: "utf8" }), code: 0 };
  } catch (e) { return { text: String(e.stdout || "") + String(e.stderr || ""), code: e.status }; }
}

/* ══ 1. Nur nachsehen ═══════════════════════════════════════════════════ */
console.log("Nur nachsehen:");
{
  const { w, sage } = netzBauen();
  const r = lauf(sage, w);
  ok(/App-Eins/.test(r.text), "findet die Kopie unter FREMDEM Dateinamen (App-Eins)");
  ok(/App-Drei/.test(r.text), "findet die Kopie in App-Drei");
  ok(!/App-Zwei/.test(r.text), "eine schon gleiche Kopie wird NICHT gemeldet (App-Zwei)");
  ok(r.code === 1, "Rueckgabewert 1, solange etwas zurueckhaengt", `war ${r.code}`);

  /* ⚠ DER WICHTIGSTE WAECHTER. Traefe das Werkzeug den Loader oder die
   * Modell-Fassung, saehe niemand es — beide sehen aus wie das Siegel. */
  ok(!/assets\/sbkim-siegel/.test(r.text), "der LOADER (ohne Marke) wird nicht angefasst");
  ok(!/sandbox/.test(r.text), "die Fassung des MODELLS (ohne Marke) wird nicht angefasst");
  ok(/web\/16_siegel\.js/.test(r.text), "…aber die echte Kopie mit Marke schon");

  /* Nur nachsehen heisst: NICHTS wird geschrieben. */
  const nachher = readFileSync(join(w, "App-Eins", "modules/sbkim-siegel.js"), "utf8");
  ok(/ALT = 1/.test(nachher), "ohne --schreiben bleibt die Datei unberuehrt");
  rmSync(w, { recursive: true, force: true });
}

/* ══ 2. Schreiben ═══════════════════════════════════════════════════════ */
console.log("\nMit --schreiben:");
{
  const { w, sage } = netzBauen();
  const r = lauf(sage, w, ["--schreiben"]);
  ok(r.code === 0, "Rueckgabewert 0 nach dem Schreiben", `war ${r.code}`);

  const eins = readFileSync(join(w, "App-Eins", "modules/sbkim-siegel.js"), "utf8");
  ok(/NEU = 2/.test(eins), "die zurueckhaengende Kopie traegt jetzt den Kanon");

  const drei = readFileSync(join(w, "App-Drei", "web/16_siegel.js"), "utf8");
  ok(/NEU = 2/.test(drei), "…auch die in App-Drei");

  /* ⚠⚠ DER RIEGEL, DER BEIM BAUEN GEFEHLT HAT. `siegel-inhalt.js` traegt die
   * komplette App-Identitaet (nodeName, domainDescription, domainKeywords).
   * Ein Ueberschreiben gaebe JEDER App Sages Namen und Sages Bedeutungs-Vektor
   * — der Schaden vom 2026-08-16 in Alis Moderaum, nur zwanzigfach. */
  const wiz = readFileSync(join(w, "App-Eins", "assets/siegel-inhalt.js"), "utf8");
  ok(/App Eins/.test(wiz) && /Eigene Beschreibung/.test(wiz),
     "die APP-IDENTITAET (siegel-inhalt.js) bleibt unberuehrt");
  ok(!/Sages Beschreibung/.test(wiz),
     "…und traegt KEINE fremde Beschreibung");

  const loader = readFileSync(join(w, "App-Drei", "assets/sbkim-siegel.js"), "utf8");
  ok(/Loader/.test(loader), "der Loader bleibt unberuehrt");

  /* Cache-Bump nur, wo die Datei im Vorrat steht. */
  const sw = readFileSync(join(w, "App-Eins", "sw.js"), "utf8");
  ok(/app-eins-v8/.test(sw), "CACHE_VERSION wurde erhoeht (v7 → v8)", sw.slice(0, 60));

  /* ── Die ?v= ziehen mit — aber nur die richtigen (Befund 2026-09-16) ─────
   *
   * ⚠ DER ANLASS WAR EIN SCHADEN DIESES WERKZEUGS. Es hob
   * `family-projekt-v116` auf `v117` und `pwa-toolpoint-v56` auf `v57` und
   * liess die Asset-Adressen stehen. Beide Marktplaetze binden ihre ?v= an die
   * Cache-Nummer, und beide Baeume waren danach ROT — eine Stunde, nachdem
   * genau diese Luecke in beiden von Hand geschlossen worden war.
   *
   * Beide Richtungen, und die zweite ist die wichtigere: ein Werkzeug, das
   * JEDES ?v= mitzieht, wuerde in drei Apps den Icon-Zaehler umschreiben. */
  const seite = readFileSync(join(w, "App-Eins", "index.html"), "utf8");
  ok(/style\.css\?v=8/.test(seite) && /app\.js\?v=8/.test(seite),
    "die ?v= auf der Cache-Nummer ziehen mit (7 → 8)", seite.replace(/\n/g, " | "));
  ok(/icons\/app\.png\?v=1\b/.test(seite),
    "… und ein ?v=, das etwas ANDERES zaehlt, bleibt liegen", seite.replace(/\n/g, " | "));
  ok(/ASSET_V = "8"/.test(sw),
    "… ASSET_V zaehlt mit — es ist die ausdrueckliche Bindung an die Cache-Nummer",
    sw.slice(0, 90));

  /* ⚠ UND DER WORKER, DER DIE DATEI WEDER FUEHRT NOCH ABLEGT, BLEIBT STEHEN.
   * Ein Bump ohne jede Bedingung zwaenge jedem Nutzer einen Download auf,
   * obwohl sich in DIESEM Vorrat nichts geaendert hat.
   * ⚠ TAFEL-EVOLUTIONS-KLAUSEL: bis zum 2026-09-16 hiess diese Zusicherung
   * „ein Worker OHNE die Datei im Vorrat wird NICHT gebumpt". Das war zu weit
   * — ein cache-first-Worker liefert sie auch dann aus. Ersetzt, nicht
   * stillschweigend getauscht; die neue Haelfte steht gleich darunter. */
  const extra = readFileSync(join(w, "App-Eins", "extra-sw.js"), "utf8");
  ok(/extra-v3/.test(extra),
     "ein Worker, der die Datei weder fuehrt noch ablegt, wird NICHT gebumpt", extra.slice(0, 40));

  /* ⚠ DIE NEUE HAELFTE, UND SIE IST DIE TEURERE. Ein Sicherheits-Update, das
   * still nicht ankommt, kostet mehr als ein ueberfluessiger Download. */
  const laufzeit = readFileSync(join(w, "App-Eins", "laufzeit-sw.js"), "utf8");
  ok(/laufzeit-v3/.test(laufzeit),
     "ein cache-first-Worker wird gebumpt, auch ohne die Datei im Vorrat (v2 → v3)",
     laufzeit.slice(0, 40));

  /* ⚠ UND DER GELTUNGSBEREICH BEGRENZT DAS. Sonst wirft ein Kanon-Nachzug den
   * Vorrat jeder Unter-App im selben Depot weg — gemessen am 2026-09-16:
   * die erste Fassung dieser Regel bumpte in Tomys-Hub FUENF davon. */
  const unter = readFileSync(join(w, "App-Eins", "unterapp/sw.js"), "utf8");
  ok(/unterapp-v5/.test(unter),
     "ein Worker in einem FREMDEN Geltungsbereich wird NICHT gebumpt", unter.slice(0, 40));

  /* ⚠ MODUL 20 TRAEGT EINEN DOPPELPUNKT statt des Gedankenstrichs. Wer das
   * Muster darauf verengt,
   * verliert es still — kein Fehler, nur eine Datei weniger verteilt. */
  const m20 = readFileSync(join(w, "App-Eins", "modules/20_schluessel_safe.js"), "utf8");
  ok(/S = 2/.test(m20),
     "auch die Marke mit Doppelpunkt (Modul 20) wird erkannt und nachgezogen");
  rmSync(w, { recursive: true, force: true });
}

/* ══ 3. Zweiter Lauf: einmal gleich, bleibt gleich ══════════════════════ */
console.log("\nEinmal gleich, bleibt gleich:");
{
  const { w, sage } = netzBauen();
  lauf(sage, w, ["--schreiben"]);
  const swNach1 = readFileSync(join(w, "App-Eins", "sw.js"), "utf8");
  const r2 = lauf(sage, w);
  ok(r2.code === 0, "der zweite Lauf meldet nichts mehr (Rueckgabewert 0)", `war ${r2.code}`);
  ok(/0 haengen zurueck/.test(r2.text), "…und zaehlt null Rueckstaende");

  /* ⚠ KEIN BUMP OHNE AENDERUNG. Ein Automat, der bei jedem Lauf die
   * CACHE_VERSION hochzaehlt, zwingt jedem Nutzer bei jedem Lauf einen neuen
   * Download auf — und der Zaehler waere bald dreistellig, ohne dass sich je
   * etwas geaendert haette. */
  lauf(sage, w, ["--schreiben"]);
  ok(readFileSync(join(w, "App-Eins", "sw.js"), "utf8") === swNach1,
     "ein zweites --schreiben bumpt NICHT noch einmal");
  rmSync(w, { recursive: true, force: true });
}

/* ══ Wie viele Fassungen liegen draussen? ════════════════════════════════
 *
 * WARUM ES DIESEN WAECHTER GIBT. Am 2026-09-16 hat dieses Werkzeug fuer
 * Modul 15 „19 haengen zurueck" gemeldet, mit Zeilen-Abstaenden von 225 bis
 * 657 — und ich habe daraus „ueberall fehlt dieselbe Aenderung" gelesen.
 * Gemessen war es etwas anderes: ACHT Traeger trugen den Kanon byte-genau,
 * ZWOELF eine von VIER aelteren Fassungen. Der Abstand je Datei beantwortet
 * „wie weit ist DIESE zurueck", nicht „wie viele Staende liegen draussen".
 */
console.log("\nWie viele Fassungen liegen draussen:");
{
  const { w, sage } = netzBauen();
  const r = lauf(sage, w, ["--nur", "16_siegel"]);
  ok(/Fassungen im Netz/.test(r.text), "der Lauf meldet die Fassungen im Netz");
  ok(/2 verschiedene aeltere Fassungen/.test(r.text),
     "…und haelt ZWEI aeltere Fassungen auseinander",
     (r.text.match(/.*aeltere Fassung.*/) || [""])[0].trim());
  ok(/MEHR ALS EINE aeltere Fassung/.test(r.text),
     "…und nennt es einen Generationen-Fall, nicht einen Nachtrag");
  /* Die GEGENRICHTUNG: liegt nur EINE alte Fassung draussen, darf er nicht
   * von Generationen reden. Ein Wächter, der immer warnt, ist keiner. */
  rmSync(join(w, "App-Vier"), { recursive: true, force: true });
  const r2 = lauf(sage, w, ["--nur", "16_siegel"]);
  ok(/eine aeltere Fassung/.test(r2.text) && !/verschiedene aeltere/.test(r2.text),
     "bei nur EINER alten Fassung meldet er keine Generationen");
  ok(!/MEHR ALS EINE aeltere Fassung/.test(r2.text),
     "…und die Generationen-Warnung bleibt weg");
  rmSync(w, { recursive: true, force: true });
}

/* ══ Ein Arbeitsbaum, der aelter ist als sein Depot ══════════════════════
 *
 * WARUM ES DIESEN WAECHTER GIBT, und er ist der teurere der beiden. Dieses
 * Werkzeug liest den ARBEITSBAUM. Am 2026-09-16 stand BookLedgerPros Klon im
 * Behaelter 302 Commits / drei Monate zurueck — sein Sitzungs-Zweig war aus
 * dem alten Klon abgezweigt, und der Sitzungsstart-Hook fasst einen
 * Nicht-Standard-Zweig zu Recht nicht an. In diesem Baum gab es
 * `sbkim/15_membran.js` noch gar nicht.
 *
 * Folge: keine Marke, kein Traeger, kein Eintrag — der Lauf meldete
 * „19 Repos tragen Kanon-Dateien", waehrend auf origin/main ZWANZIG eine
 * Kopie tragen. Das Repo fiel aus dem Lauf, OHNE dass eine Zeile darueber
 * stand. Ein stilles Ueberspringen ist teurer als ein lautes Rot.
 *
 * ⚠ HIER MUESSEN ES ECHTE DEPOTS SEIN. Das Wegwerf-Netz oben legt `.git` als
 * gewoehnliches Verzeichnis an; `git rev-list` scheitert dort, der Code faellt
 * fail-soft durch, und ein Fall darauf waere IMMER „nicht gefangen" — ohne
 * dass der Waechter etwas falsch macht.
 */
console.log("\nEin Arbeitsbaum, der aelter ist als sein Depot:");
{
  const w = mkdtempSync(join(tmpdir(), "kanon-git-"));
  const sage = join(w, "Sage-Protokol");
  mkdirSync(join(sage, "src", "modules"), { recursive: true });
  mkdirSync(join(sage, "tools"), { recursive: true });
  writeFileSync(join(sage, "tools", "kanon-verteilen.mjs"), readFileSync(werkzeug));
  const modul = (nr, inhalt) => `/*\n * SBKIM — Modul ${nr} — Probe\n */\n${inhalt}\n`;
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var NEU = 2;"));

  const git = (cwd, ...a) => execFileSync("git", ["-C", cwd, ...a],
    { stdio: "pipe", env: { ...process.env, GIT_AUTHOR_NAME: "p", GIT_AUTHOR_EMAIL: "p@p",
                            GIT_COMMITTER_NAME: "p", GIT_COMMITTER_EMAIL: "p@p" } });

  /* Ein „Depot" und ein Klon davon. Der Klon bleibt auf dem ersten Stand;
   * das Depot bekommt danach die Kanon-Kopie. Genau BookLedgerPros Lage. */
  const fern = join(w, "fern.git");
  mkdirSync(fern, { recursive: true });
  git(fern, "init", "--bare", "--initial-branch=main", ".");
  const quelle = join(w, "quelle");
  mkdirSync(quelle, { recursive: true });
  git(quelle, "init", "--initial-branch=main", ".");
  writeFileSync(join(quelle, "liesmich.txt"), "erster Stand\n");
  git(quelle, "add", "-A"); git(quelle, "commit", "-m", "erster");
  git(quelle, "remote", "add", "origin", fern); git(quelle, "push", "-q", "origin", "main");

  const alt = join(w, "App-Alt");
  execFileSync("git", ["clone", "-q", fern, alt], { stdio: "pipe" });
  /* Danach kommt im Depot die Kopie dazu — der Klon sieht sie nie. */
  mkdirSync(join(quelle, "sbkim"), { recursive: true });
  writeFileSync(join(quelle, "sbkim/16_siegel.js"), modul(16, "var ALT = 1;"));
  git(quelle, "add", "-A"); git(quelle, "commit", "-m", "Kanon-Kopie dazu");
  git(quelle, "push", "-q", "origin", "main");

  const r = lauf(sage, w, ["--nur", "16_siegel"]);
  ok(/ARBEITSBAUM AELTER ALS DAS DEPOT/.test(r.text),
     "der Lauf meldet den veralteten Arbeitsbaum");
  ok(/App-Alt: 1 Commits hinter origin/.test(r.text),
     "…mit Namen und Rueckstand",
     (r.text.match(/App-Alt.*/) || [""])[0].trim());
  /* ⚠ DIE VORBEDINGUNG WIRD GEMESSEN: die Kopie ist im ALTEN Baum wirklich
   * unsichtbar. Waere sie sichtbar, sagte der Fall nichts ueber das stille
   * Ueberspringen aus. */
  ok(!/App-Alt.*haengt zurueck/.test(r.text),
     "…und das Repo taucht als Traeger NICHT auf (genau das stille Ueberspringen)");

  /* GEGENRICHTUNG: ein Klon auf dem neuesten Stand darf NICHT gemeldet werden.
   * Ein Werkzeug, das jeden Baum als veraltet meldet, liest bald niemand. */
  git(alt, "pull", "-q", "origin", "main");
  const r2 = lauf(sage, w, ["--nur", "16_siegel"]);
  ok(!/ARBEITSBAUM AELTER/.test(r2.text), "ein frischer Klon wird NICHT gemeldet");
  ok(/App-Alt/.test(r2.text) && /haengt zurueck/.test(r2.text),
     "…und seine Kopie ist jetzt sichtbar");
  rmSync(w, { recursive: true, force: true });
}

/* ══ --nur-generation: nur EINE Fassung nachziehen ══════════════════════
 * ERGAENZT AM 2026-09-16. Modul 15 bekam seine englische Tabelle; von 20
 * Traegern standen 8 sonst byte-genau auf dem Kanon, 12 auf einer aelteren
 * Generation. `--schreiben` kannte keinen Filter — es waere ganz oder gar
 * nicht gewesen, und „ganz" haette einen SCHUTZ-Modul-Generationssprung in
 * zwoelf Apps mitgenommen, ohne dass irgendwo eine Probe gelaufen waere.
 *
 * Das Wegwerf-Netz traegt zwei alte Fassungen: App-Eins/App-Drei (`var ALT`)
 * und App-Vier (`var NOCH_AELTER`). Genau daran wird gemessen. */
console.log("\nNur EINE Fassung nachziehen (--nur-generation):");
{
  const { w, sage } = netzBauen();
  /* ⚠ DER sha WIRD GERECHNET, NICHT GENAGELT. Ein fest eingetragener Hash
   * waere beim ersten Wort mehr im Probe-Modul still falsch, und der Fall
   * meldete dann „trifft keinen Traeger" statt einer gebrochenen Zusicherung. */
  const shaVon = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
  const genAlt = shaVon(join(w, "App-Eins/modules/sbkim-siegel.js"));
  const genAelter = shaVon(join(w, "App-Vier/sbkim/16_siegel.js"));
  ok(genAlt !== genAelter,
     "VORBEDINGUNG: die zwei Traeger-Fassungen sind wirklich verschieden");

  const r = lauf(sage, w, ["--nur", "16_siegel", "--nur-generation", genAlt.slice(0, 12), "--schreiben"]);
  ok(/App-Eins/.test(r.text) && /nachgezogen/.test(r.text),
     "die passende Fassung wird nachgezogen (App-Eins)");
  ok(/zurueckgehalten:.*App-Vier|App-Vier[\s\S]{0,200}?zurueckgehalten/.test(r.text)
     || /App-Vier[\s\S]{0,200}?Fassung /.test(r.text),
     "die andere Fassung wird ZURUECKGEHALTEN — und zwar sichtbar, mit Namen",
     (r.text.match(/App-Vier[\s\S]{0,120}/) || [""])[0].trim());
  /* ⚠ GEMESSEN WIRD DIE DATEI, NICHT DIE MELDUNG. Ein Werkzeug, das
   * „zurueckgehalten" schreibt und trotzdem schreibt, saehe hier gleich aus. */
  ok(shaVon(join(w, "App-Vier/sbkim/16_siegel.js")) === genAelter,
     "…und die zurueckgehaltene Datei ist auf der Platte UNVERAENDERT");
  ok(shaVon(join(w, "App-Eins/modules/sbkim-siegel.js")) !== genAlt,
     "…waehrend die passende wirklich geschrieben wurde");
  /* ⚠ DIE UEBERSICHT DARF DER FILTER NICHT BESCHNEIDEN. Sonst meldete ein
   * gefilterter Lauf „eine Fassung im Netz", waehrend zwei draussen liegen —
   * genau die Auskunft, wegen der es den Filter gibt. */
  /* ⚠ GEMESSEN WIRD, DASS SIE DIE REPOS NENNT — nicht, dass sie zwei Gruppen
   * zaehlt. Die erste Fassung dieses Waechters fragte nur nach „2 verschiedene
   * aeltere Fassungen", und die Sabotage (Mitglieder nur noch bei Treffer
   * eintragen) rutschte durch: `gm.set(gkey, [])` legt den Schluessel weiter
   * an, die ZAHL blieb also 2, die Liste war leer. Eine Uebersicht, die zwei
   * Fassungen behauptet und kein Repo nennt, ist keine Uebersicht. */
  const uebersicht = (r.text.split("Fassungen im Netz")[1] || "");
  ok(/2 verschiedene aeltere Fassungen/.test(uebersicht),
     "die Fassungs-Uebersicht zaehlt weiter BEIDE Fassungen, trotz Filter",
     (r.text.match(/Modul 16: .*/) || [""])[0]);
  ok(/App-Vier/.test(uebersicht),
     "…und nennt das ZURUECKGEHALTENE Repo dort beim Namen",
     uebersicht.trim().split("\n").slice(0, 4).join(" | "));
  ok(/zurueckgehalten \(andere Fassung\)/.test(r.text),
     "die Schlusszeile nennt die Zurueckgehaltenen");
  rmSync(w, { recursive: true, force: true });
}

/* GEGENRICHTUNG: ohne Filter wird ALLES nachgezogen. Ohne diesen Fall waere
 * ein Werkzeug, das immer alles zurueckhaelt, von einem richtigen nicht zu
 * unterscheiden. */
{
  const { w, sage } = netzBauen();
  const shaVon = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
  const vorher = shaVon(join(w, "App-Vier/sbkim/16_siegel.js"));
  const r = lauf(sage, w, ["--nur", "16_siegel", "--schreiben"]);
  ok(!/zurueckgehalten/.test(r.text), "OHNE Filter wird nichts zurueckgehalten");
  ok(shaVon(join(w, "App-Vier/sbkim/16_siegel.js")) !== vorher,
     "…und auch die andere Fassung wird wirklich nachgezogen");
  rmSync(w, { recursive: true, force: true });
}

/* Ein Filter, der nichts trifft, ist ein BEFUND — kein stilles „nichts zu tun". */
{
  const { w, sage } = netzBauen();
  const r = lauf(sage, w, ["--nur", "16_siegel", "--nur-generation", "deadbeefdead", "--schreiben"]);
  ok(r.code === 2, "ein sha, der KEINEN Traeger trifft, gibt 2 zurueck", `war ${r.code}`);
  ok(/trifft KEINEN/.test(r.text), "…und sagt es im Klartext");
  const r2 = lauf(sage, w, ["--nur", "16_siegel", "--nur-generation", "xyz"]);
  ok(r2.code === 2, "kein Hex-sha gibt 2 zurueck", `war ${r2.code}`);
  ok(/mindestens 8 Hex-Zeichen/.test(r2.text), "…und nennt den Grund");
  rmSync(w, { recursive: true, force: true });
}

/* ══ Der Standard-Zweig wird GEFRAGT, nicht geraten ═════════════════════
 * ⚠ BIS ZUM 2026-09-16 STAND IM WERKZEUG `catch { def = "master"; }`. Gibt es
 * auch `origin/master` nicht, warf das folgende `rev-list` ein „fatal:
 * ambiguous argument", der aeussere catch schluckte es, und das Repo fiel aus
 * der Veraltet-Pruefung — OHNE DASS EINE ZEILE DARUEBER STAND. Gemessen an
 * `Meine-In-and-Out-Book`. Wortgleich der Schaden, gegen den diese Pruefung
 * einen Tag vorher gebaut wurde, nur eine Zeile weiter. */
console.log("\nDer Standard-Zweig wird gefragt, nicht geraten:");
{
  const w = mkdtempSync(join(tmpdir(), "kanon-zweig-"));
  const sage = join(w, "Sage-Protokol");
  mkdirSync(join(sage, "src", "modules"), { recursive: true });
  mkdirSync(join(sage, "tools"), { recursive: true });
  writeFileSync(join(sage, "tools", "kanon-verteilen.mjs"), readFileSync(werkzeug));
  const modul = (nr, inhalt) => `/*\n * SBKIM — Modul ${nr} — Probe\n */\n${inhalt}\n`;
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var NEU = 2;"));

  const git = (cwd, ...a) => execFileSync("git", ["-C", cwd, ...a],
    { stdio: "pipe", env: { ...process.env, GIT_AUTHOR_NAME: "p", GIT_AUTHOR_EMAIL: "p@p",
                            GIT_COMMITTER_NAME: "p", GIT_COMMITTER_EMAIL: "p@p" } });

  /* Ein Depot, dessen Standard-Zweig WEDER main NOCH master heisst. */
  const fern = join(w, "trunk.git");
  mkdirSync(fern, { recursive: true });
  git(fern, "init", "--bare", "--initial-branch=trunk", ".");
  const quelle = join(w, "quelle");
  mkdirSync(quelle, { recursive: true });
  git(quelle, "init", "--initial-branch=trunk", ".");
  writeFileSync(join(quelle, "liesmich.txt"), "erster Stand\n");
  git(quelle, "add", "-A"); git(quelle, "commit", "-m", "erster");
  git(quelle, "remote", "add", "origin", fern); git(quelle, "push", "-q", "origin", "trunk");

  const app = join(w, "App-Trunk");
  execFileSync("git", ["clone", "-q", fern, app], { stdio: "pipe" });
  mkdirSync(join(quelle, "sbkim"), { recursive: true });
  writeFileSync(join(quelle, "sbkim/16_siegel.js"), modul(16, "var ALT = 1;"));
  git(quelle, "add", "-A"); git(quelle, "commit", "-m", "Kanon-Kopie dazu");
  git(quelle, "push", "-q", "origin", "trunk");

  /* Und ein Depot GANZ OHNE Zweig auf origin — das ist der dritte Ausgang. */
  const leerFern = join(w, "leer.git");
  mkdirSync(leerFern, { recursive: true });
  git(leerFern, "init", "--bare", "--initial-branch=main", ".");
  const leer = join(w, "App-Leer");
  execFileSync("git", ["clone", "-q", leerFern, leer], { stdio: "pipe" });

  const r = lauf(sage, w, ["--nur", "16_siegel"]);
  ok(!/fatal:/.test(r.text),
     "kein rohes git-fatal mehr in der Ausgabe", (r.text.match(/fatal:.*/) || [""])[0]);
  ok(/App-Trunk: 1 Commits hinter origin/.test(r.text),
     "ein Depot mit Standard-Zweig `trunk` wird GEMESSEN statt uebersprungen",
     (r.text.match(/App-Trunk.*/) || [""])[0].trim());
  ok(/NICHT MESSBAR/.test(r.text) && /App-Leer/.test(r.text),
     "ein Depot ohne jeden Zweig heisst NICHT MESSBAR statt aktuell",
     (r.text.match(/App-Leer.*/) || [""])[0].trim());
  /* GEGENRICHTUNG: das messbare Repo darf NICHT als unmessbar dastehen. */
  ok(!/NICHT MESSBAR[\s\S]{0,200}App-Trunk/.test(r.text),
     "…und App-Trunk steht NICHT unter den unmessbaren");
  rmSync(w, { recursive: true, force: true });
}

/* ══ Der Herkunfts-Riegel ═══════════════════════════════════════════════
 * ERGAENZT AM 2026-09-16, NACH DEM TEUERSTEN FUND DES MODUL-15-ROLLOUTS.
 * Vier von zwanzig Traegern hatten ihre byte-1:1-Kopie VON HAND GEAENDERT (je
 * eine eigene Synonym-Karte mitten im Modul). Ein blindes Nachziehen haette
 * alle vier LAUTLOS geloescht. Gefunden hat es damals ein Blick, kein Werkzeug.
 *
 * ⚠ DIESE PROBE BAUT EINE ECHTE HISTORIE. Ohne sie gaebe `bekannteFassungen`
 * eine leere Menge zurueck, alles landete im dritten Ausgang („nicht
 * pruefbar"), und der Riegel waere von seinem Fehlen nicht zu unterscheiden. */
console.log("\nDer Herkunfts-Riegel — war diese Kopie je Kanon?");
{
  const w = mkdtempSync(join(tmpdir(), "kanon-herkunft-"));
  const sage = join(w, "Sage-Protokol");
  mkdirSync(join(sage, "src", "modules"), { recursive: true });
  mkdirSync(join(sage, "tools"), { recursive: true });
  writeFileSync(join(sage, "tools", "kanon-verteilen.mjs"), readFileSync(werkzeug));
  const modul = (nr, inhalt) => `/*\n * SBKIM — Modul ${nr} — Probe\n */\n${inhalt}\n`;

  const git = (cwd, ...a) => execFileSync("git", ["-C", cwd, ...a],
    { stdio: "pipe", env: { ...process.env, GIT_AUTHOR_NAME: "p", GIT_AUTHOR_EMAIL: "p@p",
                            GIT_COMMITTER_NAME: "p", GIT_COMMITTER_EMAIL: "p@p" } });

  /* Sage bekommt eine echte Historie mit ZWEI alten Generationen — und die
   * zweite liegt unter einem ANDEREN PFAD. Genau das ist Modul 15 passiert
   * (frueher `sbkim-bundle/modules/`); wer nur den heutigen Pfad durchsucht,
   * meldet die aeltere Generation faelschlich als Handarbeit. */
  git(sage, "init", "--initial-branch=main", ".");
  mkdirSync(join(sage, "sbkim-bundle", "modules"), { recursive: true });
  writeFileSync(join(sage, "sbkim-bundle/modules/16_siegel.js"), modul(16, "var URALT = 0;"));
  git(sage, "add", "-A"); git(sage, "commit", "-m", "Generation 0, alter Pfad");
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var ALT = 1;"));
  git(sage, "add", "-A"); git(sage, "commit", "-m", "Generation 1, neuer Pfad");
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var NEU = 2;"));
  git(sage, "add", "-A"); git(sage, "commit", "-m", "Generation 2, heute");

  const app = (name, dateien) => {
    const p = join(w, name);
    for (const [rel, inhalt] of Object.entries(dateien)) {
      mkdirSync(join(p, dirname(rel)), { recursive: true });
      writeFileSync(join(p, rel), inhalt);
    }
    mkdirSync(join(p, ".git"), { recursive: true });
    return p;
  };
  app("App-Kanon",  { "sbkim/16_siegel.js": modul(16, "var ALT = 1;") });      // war Kanon
  app("App-Uralt",  { "sbkim/16_siegel.js": modul(16, "var URALT = 0;") });    // war Kanon, alter Pfad
  app("App-Hand",   { "sbkim/16_siegel.js": modul(16, "var ALT = 1;\nvar MEINE_KARTE = { a: 1 };") });

  const shaVon = (f) => createHash("sha256").update(readFileSync(f)).digest("hex");
  const handVorher = shaVon(join(w, "App-Hand/sbkim/16_siegel.js"));

  const r = lauf(sage, w, ["--nur", "16_siegel", "--schreiben"]);

  ok(/HANDARBEIT VERMUTET/.test(r.text) && /App-Hand/.test(r.text),
     "eine Kopie, deren sha NICHT in Sages Historie steht, wird gemeldet",
     (r.text.match(/App-Hand[\s\S]{0,90}/) || [""])[0].trim().replace(/\n/g, " | "));
  /* ⚠ GEMESSEN WIRD DIE DATEI, NICHT DIE MELDUNG. Ein Werkzeug, das warnt und
   * trotzdem schreibt, saehe in der Ausgabe gleich aus — und haette die Arbeit
   * genauso geloescht. */
  ok(shaVon(join(w, "App-Hand/sbkim/16_siegel.js")) === handVorher,
     "…und die Datei ist auf der Platte UNVERAENDERT");

  /* GEGENRICHTUNG, und sie ist die Haelfte, auf die es ankommt: eine echte
   * Kanon-Generation darf NICHT als Handarbeit gelten. Ein Riegel, der jede
   * alte Kopie anklagt, haelt den ganzen Rollout auf. */
  ok(!/App-Kanon[\s\S]{0,60}HANDARBEIT/.test(r.text),
     "eine echte Kanon-Generation wird NICHT als Handarbeit gemeldet");
  ok(shaVon(join(w, "App-Kanon/sbkim/16_siegel.js")) !== shaVon(join(w, "App-Hand/sbkim/16_siegel.js")) &&
     readFileSync(join(w, "App-Kanon/sbkim/16_siegel.js"), "utf8").includes("var NEU = 2;"),
     "…sondern ganz normal nachgezogen");
  /* Und die aeltere Generation unter dem ALTEN PFAD ebenso — sonst sucht die
   * Herkunftspruefung nur dort, wo die Datei heute liegt. */
  ok(!/App-Uralt[\s\S]{0,60}HANDARBEIT/.test(r.text),
     "auch eine Generation vom FRUEHEREN PFAD gilt als Kanon");
  ok(readFileSync(join(w, "App-Uralt/sbkim/16_siegel.js"), "utf8").includes("var NEU = 2;"),
     "…und wird nachgezogen");

  ok(r.code === 1, "Handarbeit setzt den Rueckgabewert auf 1, auch im Schreib-Gang", `war ${r.code}`);
  rmSync(w, { recursive: true, force: true });
}

/* ⚠ DER DRITTE AUSGANG, UND ER WAR ZUERST NUR BEHAUPTET. „bekannt · Handarbeit
 * · NICHT PRUEFBAR" stand im Code, gemessen wurde nur das erste und zweite —
 * der zugehoerige Gegenprobe-Fall fiel deshalb am NACHBAR-Waechter, mit dessen
 * Namen in der roten Zeile. Ohne Historie darf der Riegel NICHT anklagen:
 * ein Werkzeug, das bei fehlender Auskunft „Handarbeit" meldet, haelt beim
 * ersten frischen Klon den ganzen Rollout auf. */
{
  const { w, sage } = netzBauen();   // dieses Sage hat GAR KEIN git
  const r = lauf(sage, w, ["--nur", "16_siegel"]);
  ok(/HERKUNFT NICHT PRUEFBAR/.test(r.text),
     "ohne Historie sagt der Riegel „nicht pruefbar\" — das ist der dritte Ausgang",
     (r.text.match(/NICHT PRUEFBAR[\s\S]{0,70}/) || [""])[0].trim().replace(/\n/g, " | "));
  ok(!/HANDARBEIT VERMUTET/.test(r.text),
     "…und klagt dabei NIEMANDEN der Handarbeit an");
  rmSync(w, { recursive: true, force: true });
}

/* Der ausdrueckliche Weg daran vorbei — ohne ihn waere der Riegel eine
 * Sackgasse: nach einem Umzug MUSS die Kopie ueberschrieben werden. */
{
  const w = mkdtempSync(join(tmpdir(), "kanon-herkunft2-"));
  const sage = join(w, "Sage-Protokol");
  mkdirSync(join(sage, "src", "modules"), { recursive: true });
  mkdirSync(join(sage, "tools"), { recursive: true });
  writeFileSync(join(sage, "tools", "kanon-verteilen.mjs"), readFileSync(werkzeug));
  const modul = (nr, inhalt) => `/*\n * SBKIM — Modul ${nr} — Probe\n */\n${inhalt}\n`;
  const git = (cwd, ...a) => execFileSync("git", ["-C", cwd, ...a],
    { stdio: "pipe", env: { ...process.env, GIT_AUTHOR_NAME: "p", GIT_AUTHOR_EMAIL: "p@p",
                            GIT_COMMITTER_NAME: "p", GIT_COMMITTER_EMAIL: "p@p" } });
  git(sage, "init", "--initial-branch=main", ".");
  writeFileSync(join(sage, "src/modules/16_siegel.js"), modul(16, "var NEU = 2;"));
  git(sage, "add", "-A"); git(sage, "commit", "-m", "heute");
  const p = join(w, "App-Hand");
  mkdirSync(join(p, "sbkim"), { recursive: true });
  mkdirSync(join(p, ".git"), { recursive: true });
  writeFileSync(join(p, "sbkim/16_siegel.js"), modul(16, "var ALT = 1;\nvar MEINE_KARTE = { a: 1 };"));

  const r = lauf(sage, w, ["--nur", "16_siegel", "--schreiben", "--handarbeit-gesichert"]);
  ok(readFileSync(join(p, "sbkim/16_siegel.js"), "utf8").includes("var NEU = 2;"),
     "--handarbeit-gesichert zieht die Kopie wirklich nach");
  /* ⚠ GEMESSEN WIRD DIE AUSSAGE, NICHT DIE SCHREIBWEISE. Meine erste Fassung
   * suchte „Handarbeit vermutet" in Kleinschreibung, waehrend das Werkzeug
   * „HANDARBEIT VERMUTET" schreibt — rot, ohne dass eine Zusicherung gefallen
   * waere. Ein Waechter nagelt eine Aussage fest, keine Grossbuchstaben. */
  ok(/handarbeit vermutet/i.test(r.text) && /trotzdem nachgezogen/i.test(r.text),
     "…sagt aber trotzdem, dass dort Handarbeit lag",
     (r.text.match(/HANDARBEIT[\s\S]{0,140}/i) || [""])[0].trim().replace(/\n/g, " | "));
  ok(r.code === 0, "…und der Rueckgabewert ist dann 0", `war ${r.code}`);
  rmSync(w, { recursive: true, force: true });
}

console.log(`\nErgebnis: ${pass} bestanden, ${fail} fehlgeschlagen`);
process.exit(fail ? 1 : 0);
