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

console.log(`\nErgebnis: ${pass} bestanden, ${fail} fehlgeschlagen`);
process.exit(fail ? 1 : 0);
