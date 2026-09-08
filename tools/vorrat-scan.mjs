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
import { readdirSync, statSync, existsSync } from "node:fs";
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

/**
 * Stuft EINE Fundstelle ein.
 * Gibt `{ urteil, filter }` zurück — `urteil` ist eines von:
 *   "loescht-alles" · "praefix-ok" · "unklar"
 */
export function stufeEin(umfeld) {
  /* Ein Präfix-Vergleich ist der einzige Filter, der fremde Vorräte stehen
     lässt. `k !== MEINER` lässt ALLE anderen durch — genau das ist der Fehler. */
  const praefix = umfeld.match(/\.startsWith\s*\(\s*(['"`])([^'"`]+)\1/);
  if (praefix) return { urteil: "praefix-ok", filter: `startsWith("${praefix[2]}")` };

  /* `k.indexOf('praefix') === 0` ist dasselbe in alt. */
  const idx = umfeld.match(/\.indexOf\s*\(\s*(['"`])([^'"`]+)\1\s*\)\s*===?\s*0/);
  if (idx) return { urteil: "praefix-ok", filter: `indexOf("${idx[2]}") === 0` };

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
    const { urteil, filter } = stufeEin(umfeld);
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

export function ursprung(repo) {
  const cname = (git(repo, ["show", "origin/main:CNAME"]) || "").trim().split("\n")[0];
  if (cname) return { art: "eigen", wert: cname, quelle: "CNAME auf origin/main", zitate: [] };

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
           quelle: "keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar",
           zitate };
}

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
      for (const s of findeStellen(text)) stellen.push({ datei, ...s });
    }

    ergebnis.push({ repo: name, pfad: repo, ursprung: ursprung(repo), stellen });
  }
  return ergebnis;
}

/* ── Ausgabe ───────────────────────────────────────────────────────────── */

const ZEICHEN = { "loescht-alles": "✗", "praefix-ok": "✓", unklar: "?" };

function bericht(daten, fetch) {
  const zeilen = [];
  const p = (s) => zeilen.push(s);

  p("# Wer löscht die Vorräte der Geschwister?");
  p("");
  p(fetch
    ? "Gemessen gegen `origin/main` jedes Depots."
    : "⚠ OHNE_FETCH — gemessen gegen die KLONE. Sie können Monate alt sein; das ist kein Befund.");
  p("");

  const betroffen = [];
  for (const r of daten) {
    const schlimm = r.stellen.filter((s) => s.urteil === "loescht-alles");
    if (schlimm.length) betroffen.push(r);
  }

  p(`**${betroffen.length} von ${daten.length} Depots** tragen mindestens eine Stelle, die`);
  p("jeden fremden Vorrat des Ursprungs löscht.");
  p("");

  const zaehle = (art) => daten.filter((r) => r.ursprung.art === art).length;
  p(`Ursprung: **${zaehle("eigen")} belegt eigen** (CNAME) · `
    + `**${zaehle("ungeprueft")} ungeprüft**`);
  p("");
  p("⚠ **„ungeprüft\" heisst ungeprüft, nicht „geteilt\".** Eine `CNAME` zu haben");
  p("belegt einen eigenen Ursprung; sie nicht zu haben belegt nichts —");
  p("family-project und Company-Brain liefern über eigene Adressen aus und haben");
  p("keine. Von hier aus ist die Auslieferung nicht nachsehbar: der Egress-Proxy");
  p("sperrt `github.io`, und die Pages-Einstellung geben die GitHub-Werkzeuge");
  p("dieser Sitzung nicht her.");
  p("");
  p("**Diese Frage beantwortet Klaus, nicht das Werkzeug.** Wo die Doku eine");
  p("Adresse nennt, steht die Zeile als Belegstelle darunter — zitiert, nicht");
  p("ausgewertet.");
  p("");

  for (const r of daten) {
    if (!r.stellen.length) continue;
    const a = r.stellen.filter((s) => s.sorte === "A" && s.urteil === "loescht-alles").length;
    const b = r.stellen.filter((s) => s.sorte === "B" && s.urteil === "loescht-alles").length;
    const ok = r.stellen.filter((s) => s.urteil === "praefix-ok").length;

    p(`## ${r.repo}`);
    p("");
    p(`Ursprung: **${r.ursprung.art}**${r.ursprung.wert !== "—" ? ` (${r.ursprung.wert})` : ""}`
      + ` — ${r.ursprung.quelle}`);
    for (const z of r.ursprung.zitate || []) p(`  > ${z}`);
    p("");
    p(`Sorte A (läuft von allein): **${a}** · Sorte B (⟳ / Knopf): **${b}**`
      + (ok ? ` · richtig gefiltert: ${ok}` : ""));
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
