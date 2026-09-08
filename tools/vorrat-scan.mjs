/* Vorrat-Scan — wer löscht die Offline-Vorräte der Geschwister-Apps?
 *
 *   node tools/vorrat-scan.mjs                 # alle Repos neben diesem
 *   node tools/vorrat-scan.mjs --wurzel /pfad  # anderer Ordner mit den Klonen
 *   node tools/vorrat-scan.mjs --json          # maschinenlesbar
 *   OHNE_FETCH=ja node tools/vorrat-scan.mjs   # nicht holen (misst dann KLONE)
 *
 * WARUM ES DAS GIBT (Befund 2026-09-08, kim-hub-company). Der Service-Worker des
 * Bündel-Prüfers räumte in `activate` „alte Vorräte" auf — mit dem üblichen
 * Ausschnitt:
 *
 *   caches.keys().then(namen => Promise.all(
 *     namen.map(n => n === VORRAT ? null : caches.delete(n))))
 *
 * `caches` gehört dem URSPRUNG, nicht dem Pfad. Ein Service-Worker unter
 * `…/werkzeuge/buendel-pruefer/` steuert zwar nur seinen Pfad, darf aber jeden
 * Vorrat des ganzen Ursprungs aufzählen und löschen. Auf
 * lausiklauskn-png.github.io liegen rund zwanzig Apps. Gemessen an zwei
 * Wegwerf-Apps unter einem Ursprung: App B löschte den Vorrat von App A.
 *
 * Es ist dieselbe Falle wie beim DB-Suffix, eine Ebene höher: ein Namensraum,
 * der der ADRESSE gehört und nicht der App.
 *
 * ⚠ EIN `grep` AUF `caches.delete` GENÜGT NICHT — und das ist der ganze Grund,
 * warum dieses Werkzeug mehr tut als eine Zeile Shell. Entschieden wird am
 * FILTER davor:
 *
 *   k !== MEIN_VORRAT          → löscht ALLES, auch fremdes
 *   k.startsWith('praefix-')   → löscht nur eigenes
 *   k.startsWith(VORRAT_PRAEFIX) → dito, Wert wird in der Datei nachgeschlagen
 *   /webllm|mlc/i.test(k)      → gezielt (positives Muster)
 *   window.SBKIM_VORRAT_PRAEFIX → Modul 22: der Wirt nennt den Präfix; ohne ihn löscht es nichts
 *   gar kein Filter            → löscht ALLES
 *
 * Wer nur nach dem Löschen sucht, zählt `Tomys-Hub/sw.js` fälschlich mit — das
 * einzige Repo, das es von Anfang an richtig macht.
 *
 * ZWEI SORTEN, und sie werden nicht vermischt:
 *
 *   A · im `activate` eines Service-Workers  → läuft VON ALLEIN, bei jeder
 *                                              Aktivierung
 *   B · sonst (Hart-Neuladen-Knopf ⟳, App-Code) → läuft auf Knopfdruck
 *
 * Beide löschen dasselbe. Sorte A trifft den Nutzer ohne sein Zutun, Sorte B
 * erst, wenn er drückt — und dann trifft es Apps, an die er nicht gedacht hat.
 *
 * GEMESSEN WIRD GEGEN `origin/main`, NICHT GEGEN DEN KLON. Die Klone im
 * Container können Monate alt sein; eine Aussage über den Stand eines Repos
 * ohne vorheriges `fetch` ist kein Beweis (Sage-Verfassung, Sitzungsstart-
 * Pflicht). `OHNE_FETCH=ja` gibt es nur, damit man ohne Netz überhaupt etwas
 * laufen lassen kann — die Ausgabe sagt dann ausdrücklich, dass sie Klone misst.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const VORGABE_WURZEL = join(HIER, "..", "..");

/* ── kleine Helfer ─────────────────────────────────────────────────────── */

function git(repo, args) {
  try {
    return execFileSync("git", ["-C", repo, ...args], {
      encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

/** Der ECHTE Repo-Name kommt aus der Fernadresse, nicht aus dem Ordnernamen.
 *  Ein Arbeits-Klon heisst schon mal anders als sein Depot. */
export function repoName(repo) {
  const url = (git(repo, ["remote", "get-url", "origin"]) || "").trim();
  const m = url.match(/[/:]([^/:]+)\/([^/]+?)(?:\.git)?$/);
  return m ? m[2] : basename(repo);
}

/* ── die Einstufung: am FILTER, nicht am Löschen ───────────────────────── */

/** Die Stelle, an der wirklich gelöscht wird, samt Umfeld. */
const FENSTER_VOR = 400;
const FENSTER_NACH = 120;
const FENSTER_WEIT = 1500;   // nur für die Wirt-Marke von Modul 22

/**
 * Stuft EINE Fundstelle ein.
 * Gibt `{ urteil, filter }` zurück — `urteil` ist eines von:
 *   "loescht-alles" · "praefix-ok" · "unklar"
 */
export function stufeEin(umfeld, ganz = umfeld, weit = umfeld) {
  /* Ein Präfix-Vergleich ist der einzige Filter, der fremde Vorräte stehen
     lässt. `k !== MEINER` lässt ALLE anderen durch — genau das ist der Fehler. */
  /* `!k.startsWith('eigen-')` ist die Verneinung: ALLES ausser dem eigenen —
     also jede Geschwister-App. Bis zum 2026-09-08 zaehlte das als „praefix-ok",
     weil nur nach `.startsWith(` gesucht wurde. Ein Filter, der das Richtige
     ausnimmt statt es zu treffen, ist der alte Fehler mit einem Ausrufezeichen. */
  const verneint = umfeld.match(/!\s*\w+\s*\.\s*(startsWith|includes)\s*\(\s*(['"`]?)([\w$.-]+)\2/);
  if (verneint) return { urteil: "loescht-alles", filter: `!${verneint[1]}(${verneint[2]}${verneint[3]}${verneint[2]}) — alles AUSSER dem eigenen` };
  const verneintRegex = umfeld.match(/!\s*(\/[^\/\n]+\/[a-z]*)\s*\.test\s*\(/);
  if (verneintRegex) return { urteil: "loescht-alles", filter: `!${verneintRegex[1]}.test(k) — alles AUSSER dem Muster` };

  /* ⚠ KORREKTUR 2026-09-08 (zweite). Bis hierhin kannte die Einstufung nur
     STRING-LITERALE. Die Reparatur in 19 Depots schreibt den Präfix aber in
     eine Konstante (`var VORRAT_PRAEFIX = "…"`), Modul 22 bekommt ihn vom
     Wirt (`window.SBKIM_VORRAT_PRAEFIX`), und der Modell-Ausputzer der
     Pinnwand filtert mit einem positiven Regex. Alle drei fielen auf das
     `!==` dahinter durch und zählten als „löscht alles" — 44 Fehlurteile in
     einem Lauf, NACH der Reparatur. Eine zu hohe Zahl ist derselbe Fehler wie
     eine zu niedrige. Jetzt wird die Konstante in der DATEI aufgelöst; was
     sich nicht auflösen lässt, heisst „unklar" — nicht „ok". */
  /* Die Wirt-Marke steht in Modul 22 sechs Zeilen über dem Löschen — ausserhalb
     der 400 Zeichen. Deshalb das weite Fenster: gemessen 2026-09-08, die echte
     Datei kam als „unklar" zurück, die Probe mit einem kurzen Schnipsel nicht. */
  if (/SBKIM_VORRAT_PRAEFIX/.test(weit) && /indexOf\s*\(\s*\w+\s*\)\s*===?\s*0|startsWith\s*\(\s*\w+\s*\)/.test(umfeld)) {
    return { urteil: "praefix-ok", filter: "Wirt setzt window.SBKIM_VORRAT_PRAEFIX — ohne Wert wird nichts gelöscht" };
  }
  const literal = umfeld.match(/\.(startsWith|includes)\s*\(\s*(['"`])([^'"`]+)\2/);
  if (literal) return { urteil: "praefix-ok", filter: `${literal[1]}("${literal[3]}")` };

  /* `k.indexOf('praefix') === 0` ist dasselbe in alt. */
  const idx = umfeld.match(/\.indexOf\s*\(\s*(['"`])([^'"`]+)\1\s*\)\s*===?\s*0/);
  if (idx) return { urteil: "praefix-ok", filter: `indexOf("${idx[2]}") === 0` };

  /* Konstante statt Literal: `k.startsWith(VORRAT_PRAEFIX)` — den Wert in der
     ganzen Datei nachschlagen, nicht raten. */
  const konst = umfeld.match(/\.(startsWith|includes)\s*\(\s*([A-Za-z_$][\w$]*)\s*\)/)
    || umfeld.match(/\.(indexOf)\s*\(\s*([A-Za-z_$][\w$]*)\s*\)\s*===?\s*0/);
  if (konst) {
    const name = konst[2];
    const def = ganz.match(new RegExp("(?:var|const|let)\\s+" + name.replace(/\$/g, "\\$") + "\\s*=\\s*(['\"`])([^'\"`]*)\\1"));
    if (!def) return { urteil: "unklar", filter: `${konst[1]}(${name}) — Wert steht nicht in der Datei` };
    if (!def[2]) return { urteil: "loescht-alles", filter: `${konst[1]}(${name} = "") — leerer Präfix trifft alles` };
    return { urteil: "praefix-ok", filter: `${konst[1]}(${name} = "${def[2]}")` };
  }

  /* Ein positives Muster (`/webllm|mlc/i.test(k)`) trifft gezielt, nicht alles. */
  const regex = umfeld.match(/(\/[^\/\n]+\/[a-z]*)\s*\.test\s*\(\s*\w+\s*\)/);
  if (regex) return { urteil: "praefix-ok", filter: `${regex[1]}.test(k) — gezielt` };

  const ungleich = umfeld.match(/(\w+)\s*!==?\s*([A-Z_][A-Z0-9_]*)/);
  if (ungleich) return { urteil: "loescht-alles", filter: `${ungleich[1]} !== ${ungleich[2]}` };

  const ternaer = umfeld.match(/(\w+)\s*===?\s*([A-Z_][A-Z0-9_]*)\s*\?/);
  if (ternaer) return { urteil: "loescht-alles", filter: `${ternaer[1]} === ${ternaer[2]} ? … :` };

  return { urteil: "loescht-alles", filter: "kein Filter" };
}

/** Steht die Fundstelle im `activate` eines Service-Workers? */
export function istActivate(text, pos) {
  const davor = text.slice(0, pos);
  const letzte = [...davor.matchAll(/addEventListener\s*\(\s*['"`](\w+)['"`]/g)].pop();
  return !!letzte && letzte[1] === "activate";
}

/** Alle Fundstellen einer Datei. */
export function findeStellen(text) {
  const stellen = [];
  for (const t of text.matchAll(/caches\s*\.\s*delete\s*\(/g)) {
    const pos = t.index;
    const umfeld = text.slice(Math.max(0, pos - FENSTER_VOR), pos + FENSTER_NACH);
    const weit = text.slice(Math.max(0, pos - FENSTER_WEIT), pos + FENSTER_NACH);
    const { urteil, filter } = stufeEin(umfeld, text, weit);
    stellen.push({
      zeile: text.slice(0, pos).split("\n").length,
      sorte: istActivate(text, pos) ? "A" : "B",
      urteil, filter,
    });
  }
  return stellen;
}

/* ── der Ursprung: was BELEGT ist, und was nicht ───────────────────────── */

/**
 * ⚠ NUR ZWEI ANTWORTEN, UND DIE ZWEITE HEISST „WEISS ICH NICHT".
 *
 * Eine `CNAME` zu haben BELEGT einen eigenen Ursprung. Sie nicht zu haben
 * belegt gar nichts — `family-project` läuft auf Klaus' Hetzner-Server über
 * Caddy, `Company-Brain` unter company-brain.family-projekt.de, beide OHNE
 * CNAME im Depot.
 *
 * ⚠ DIE ERSTE FASSUNG DIESER FUNKTION HAT DIE AUSLIEFERUNG AUS PROSA GERATEN,
 * und sie lag in BEIDE Richtungen daneben (gemessen 2026-09-08):
 *
 *   zu eng   Company-Brain galt als „geteilt". Der Ausdruck suchte „eigene
 *            Adresse", in der Datei steht „eigenEN Adresse". Eine Beugung.
 *   zu weit  Kimhub und Sage-Protokol galten als „ungeprüft", weil ihre
 *            CLAUDE.md das Wort „Hetzner" enthält — in der Drei-Maschinen-
 *            Regel. Beide liegen auf github.io.
 *
 * Ein Muster, das Wortformen trifft statt Aussagen, ist keine Messung. Deshalb
 * wird hier NICHT MEHR GESCHLOSSEN, sondern ZITIERT: was ohne CNAME dasteht,
 * heisst „ungeprüft", und dazu kommen die Zeilen aus der Doku, die eine Adresse
 * nennen — als BELEGSTELLE für Klaus, nicht als Urteil des Werkzeugs.
 *
 * Er beantwortet die offenen Zeilen in einer Minute. Eine geratene Zeile könnte
 * er nicht von einer gemessenen unterscheiden.
 */
const ADRESSE = /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:de|com|io|net|org)\b/i;

/* ⚠ KORREKTUR 2026-09-08. Hier stand: „Von hier aus ist die Auslieferung nicht
 * nachsehbar: der Egress-Proxy sperrt github.io, und die Pages-Einstellung geben
 * die GitHub-Werkzeuge dieser Sitzung nicht her." Der erste Halbsatz stimmt, der
 * zweite nicht: `list_workflow_runs` liefert die Läufe „pages build and
 * deployment" (event `dynamic`) und belegt damit, dass Pages für ein Depot baut
 * und ausliefert. Abgefragt für alle 34 Depots, abgelegt in
 * `docs/daten/auslieferung.json` — mit Datum, weil so eine Abfrage veraltet.
 * Ich hatte eine Grenze erklärt, die keine war, und Klaus um Handarbeit gebeten,
 * die er am Tablet gar nicht leisten kann. Eine Regel über den Normalfall ist
 * kein Befund über den eigenen — und eine behauptete Grenze auch nicht. */
const AUSLIEFERUNG = (() => {
  try { return JSON.parse(readFileSync(join(HIER, "..", "docs", "daten", "auslieferung.json"), "utf8")); }
  catch { return null; }
})();

export function pagesBeleg(name) {
  const e = AUSLIEFERUNG && AUSLIEFERUNG.depots && AUSLIEFERUNG.depots[name];
  if (!e || !e.pages) return null;
  return { laeufe: e.laeufeGesamt, zuletzt: e.zuletzt, stand: AUSLIEFERUNG._stand };
}

export function ursprung(repo) {
  const name = repoName(repo);
  const cname = (git(repo, ["show", "origin/main:CNAME"]) || "").trim().split("\n")[0];
  const pages = pagesBeleg(name);
  if (cname) return { art: "eigen", wert: cname,
    quelle: "CNAME auf origin/main" + (pages ? ` · Pages baut darauf (zuletzt ${pages.zuletzt})` : ""), zitate: [] };
  if (pages) return { art: "geteilt", wert: "lausiklauskn-png.github.io",
    quelle: `Pages belegt — ${pages.laeufe} Läufe, zuletzt ${pages.zuletzt} (docs/daten/auslieferung.json, Stand ${pages.stand})`,
    zitate: [] };

  /* Belegstellen sammeln, nicht auswerten. */
  const zitate = [];
  for (const datei of ["CLAUDE.md", "README.md"]) {
    const text = git(repo, ["show", `origin/main:${datei}`]);
    if (!text) continue;
    for (const zeile of text.split("\n")) {
      if (!ADRESSE.test(zeile)) continue;
      if (!/l(?:ä|ae)uft|liegt|adresse|ausgeliefert|deploy|hosting|erreichbar|Pages/i.test(zeile)) continue;
      const kurz = zeile.replace(/^[>#*\s-]+/, "").trim().slice(0, 150);
      if (kurz && !zitate.includes(kurz)) zitate.push(kurz);
      if (zitate.length >= 3) break;
    }
    if (zitate.length >= 3) break;
  }

  return { art: "ungeprueft", wert: "—",
           quelle: "keine CNAME, kein Pages-Lauf in docs/daten/auslieferung.json",
           zitate };
}

/* ── Benannte Ausnahmen ─────────────────────────────────────────────────
 * Zwei Stellen, die der Scan bis zum 2026-09-08 als Befund zählte und die
 * keine sind. Eine zu hohe Zahl ist derselbe Fehler wie eine zu niedrige.
 * Jede Ausnahme trägt ihren Grund; ohne Grund wird nichts ausgenommen. */
export const AUSNAHMEN = [
  { repo: "Sage-Protokol", datei: "tools/speicher.html",
    grund: "ABSICHT — Klaus' Aufräum-Werkzeug löscht genau die Vorräte, die er anhakt; ursprungsweit ist hier der Zweck" },
  { repo: "Sage-Protokol", datei: "tools/vorrat-scan.mjs",
    grund: "SELBSTTREFFER — der Scanner findet sein eigenes Doku-Beispiel" },
  { repo: "Sage-Protokol", datei: "tests/smoke_vorrat_scan.mjs",
    grund: "SELBSTTREFFER — die Probe des Scanners trägt absichtlich die falschen Formen, damit er sie erkennt" },
];

/* ── Lauf ──────────────────────────────────────────────────────────────── */

export function scanne(wurzel, { fetch = true } = {}) {
  const repos = readdirSync(wurzel)
    .map((n) => join(wurzel, n))
    .filter((p) => { try { return statSync(p).isDirectory(); } catch { return false; } })
    .filter((p) => existsSync(join(p, ".git")))
    .sort();

  const ergebnis = [];
  const gesehen = new Set();

  for (const repo of repos) {
    if (fetch) git(repo, ["fetch", "origin", "main", "--quiet"]);
    if (git(repo, ["rev-parse", "--verify", "origin/main"]) === null) continue;

    const name = repoName(repo);
    /* Zwei Ordner können dasselbe Depot sein (ein Arbeits-Klon daneben).
       Doppelt zu zählen ergäbe eine zu grosse Zahl — derselbe Fehler wie eine
       zu kleine, nur andersherum. */
    if (gesehen.has(name)) continue;
    gesehen.add(name);

    const treffer = (git(repo, ["grep", "-l", "-I", "caches", "origin/main", "--",
      "*.js", "*.html", "*.mjs"]) || "")
      .split("\n").filter(Boolean)
      .map((z) => z.replace(/^origin\/main:/, ""))
      .filter((f) => !/node_modules\/|\/vendor\//.test(f));

    const stellen = [];
    for (const datei of treffer) {
      const text = git(repo, ["show", `origin/main:${datei}`]);
      if (!text) continue;
      const ausnahme = AUSNAHMEN.find((a) => a.repo === name && a.datei === datei);
      for (const s of findeStellen(text)) {
        if (ausnahme) stellen.push({ datei, ...s, urteil: "gewollt", filter: ausnahme.grund });
        else stellen.push({ datei, ...s });
      }
    }

    ergebnis.push({ repo: name, pfad: repo, ursprung: ursprung(repo), stellen });
  }
  return ergebnis;
}

/* ── Ausgabe ───────────────────────────────────────────────────────────── */

const ZEICHEN = { "loescht-alles": "✗", "praefix-ok": "✓", gewollt: "○", unklar: "?" };

function bericht(daten, fetch) {
  const zeilen = [];
  const p = (s) => zeilen.push(s);

  p("# Wer löscht die Vorräte der Geschwister?");
  p("");
  p(fetch
    ? "Gemessen gegen `origin/main` jedes Depots."
    : "⚠ OHNE_FETCH — gemessen gegen die KLONE. Sie können Monate alt sein; das ist kein Befund.");
  p("");

  const betroffen = [], eigenBetroffen = [], unklar = [];
  for (const r of daten) {
    const schlimm = r.stellen.filter((s) => s.urteil === "loescht-alles");
    if (schlimm.length) (r.ursprung.art === "eigen" ? eigenBetroffen : betroffen).push(r);
    if (r.stellen.some((s) => s.urteil === "unklar")) unklar.push(r);
  }

  const geteilt = daten.filter((r) => r.ursprung.art !== "eigen").length;
  p(`**${betroffen.length} von ${geteilt} Depots auf dem geteilten oder ungeprüften Ursprung**`);
  p("tragen mindestens eine Stelle, die jeden fremden Vorrat des Ursprungs löscht"
    + (betroffen.length ? `: ${betroffen.map((r) => r.repo).join(", ")}.` : "."));
  p("");
  p(`Auf **eigenem** Ursprung (CNAME) tragen ${eigenBetroffen.length} Depots dieselbe Form`
    + (eigenBetroffen.length ? ` (${eigenBetroffen.map((r) => r.repo).join(", ")})` : "")
    + " — dort liegt kein Geschwister, das sie treffen könnten. Kein Befund, aber benannt:");
  p("wer eines davon auf den geteilten Ursprung zieht, zieht die Stelle mit.");
  p("");
  if (unklar.length) {
    p(`**? unklar** — Filter, deren Wert der Scan nicht auflösen konnte: ${unklar.map((r) => r.repo).join(", ")}.`);
    p("Unklar ist nicht ok. Nachsehen, nicht annehmen.");
    p("");
  }

  const zaehle = (art) => daten.filter((r) => r.ursprung.art === art).length;
  p(`Ursprung: **${zaehle("eigen")} belegt eigen** (CNAME) · `
    + `**${zaehle("geteilt")} belegt geteilt** (Pages-Lauf) · `
    + `**${zaehle("ungeprueft")} ungeprüft**`);
  p("");
  p("Die Pages-Belege stammen aus `docs/daten/auslieferung.json` (GitHub-API,");
  p(`Stand ${AUSLIEFERUNG ? AUSLIEFERUNG._stand : "—"}). Eine \`CNAME\` belegt einen eigenen Ursprung; ein Lauf`);
  p("„pages build and deployment\" belegt, dass Pages baut und ausliefert. Beides");
  p("zugleich gibt es — family-project liefert über Hetzner UND über Pages.");
  p("");
  p("> **Korrektur 2026-09-08.** Hier stand: *„Von hier aus ist die Auslieferung");
  p("> nicht nachsehbar: der Egress-Proxy sperrt `github.io`, und die");
  p("> Pages-Einstellung geben die GitHub-Werkzeuge dieser Sitzung nicht her.\"*");
  p("> Der zweite Halbsatz war falsch — die Werkzeuge liefern die Pages-Läufe.");
  p("> Ich hatte eine Grenze erklärt, die keine war.");
  p("");
  p("Drei Dateien zählen als **○ gewollt** und nicht als Befund: Klaus' eigenes");
  p("Aufräum-Werkzeug `tools/speicher.html` (löscht, was er anhakt — das ist der");
  p("Zweck), der Selbsttreffer dieses Scanners in seinem Doku-Beispiel und seine");
  p("Probe `tests/smoke_vorrat_scan.mjs`, die die falschen Formen absichtlich trägt.");
  p("");

  for (const r of daten) {
    if (!r.stellen.length) continue;
    const a = r.stellen.filter((s) => s.sorte === "A" && s.urteil === "loescht-alles").length;
    const b = r.stellen.filter((s) => s.sorte === "B" && s.urteil === "loescht-alles").length;
    const ok = r.stellen.filter((s) => s.urteil === "praefix-ok").length;
    const unk = r.stellen.filter((s) => s.urteil === "unklar").length;

    p(`## ${r.repo}`);
    p("");
    p(`Ursprung: **${r.ursprung.art}**${r.ursprung.wert !== "—" ? ` (${r.ursprung.wert})` : ""}`
      + ` — ${r.ursprung.quelle}`);
    for (const z of r.ursprung.zitate || []) p(`  > ${z}`);
    p("");
    p(`Sorte A (läuft von allein): **${a}** · Sorte B (⟳ / Knopf): **${b}**`
      + (ok ? ` · richtig gefiltert: ${ok}` : "") + (unk ? ` · unklar: ${unk}` : ""));
    p("");
    for (const s of r.stellen) {
      p(`- ${ZEICHEN[s.urteil]} \`${s.datei}:${s.zeile}\` · Sorte ${s.sorte} · `
        + `Filter: \`${s.filter}\``);
    }
    p("");
  }
  return zeilen.join("\n");
}

/* ── Kommandozeile ─────────────────────────────────────────────────────── */

const direkt = process.argv[1]
  && process.argv[1].endsWith("vorrat-scan.mjs");

if (direkt) {
  const i = process.argv.indexOf("--wurzel");
  const wurzel = i > -1 ? process.argv[i + 1] : VORGABE_WURZEL;
  const fetch = process.env.OHNE_FETCH !== "ja";

  const daten = scanne(wurzel, { fetch });
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ gemessen: new Date().toISOString(), fetch, daten }, null, 2));
  } else {
    console.log(bericht(daten, fetch));
  }
}
