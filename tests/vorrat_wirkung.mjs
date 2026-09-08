/* vorrat_wirkung.mjs — löscht eine echte App wirklich den Vorrat einer anderen?
 *
 *   node tests/vorrat_wirkung.mjs
 *
 * WAS HIER GEMESSEN WIRD. `tools/vorrat-scan.mjs` zählt CODE — es findet das
 * Muster, aber es beweist die Wirkung nicht. Diese Probe fährt sie:
 *
 *   Zwei ECHTE Apps von Klaus, unter EINEM Ursprung ausgeliefert (ein Server,
 *   zwei Unterpfade). App A installieren, ihren Vorrat füllen. Dann App B
 *   aufrufen. Steht danach noch drin, was A eingelagert hat?
 *
 * BEIDE RICHTUNGEN, sonst misst es nichts:
 *
 *   1. B mit ihrem echten `activate`     → A's Vorrat MUSS weg sein
 *   2. B mit dem Präfix-Filter aus Tomys → A's Vorrat MUSS bleiben
 *
 * Ohne den zweiten Lauf wäre „bestätigt" auch dann das Ergebnis, wenn der
 * Vorrat aus einem ganz anderen Grund verschwindet — weil der Server ihn nicht
 * ausliefert, weil die Installation scheiterte, weil der Browser aufräumt.
 * Der zweite Lauf ist der Unterschied zwischen einem Befund und einer
 * Vermutung.
 *
 * ⚠ DIE APPS WERDEN AUS `origin/main` GEHOLT, nicht aus dem Klon. Ein Klon im
 * Container kann Monate alt sein.
 *
 * ⚠ WENN A GAR KEINEN VORRAT ANLEGT, ist der Lauf NICHT GRÜN, sondern NICHT
 * MESSBAR. Eine Probe, die nichts vorfindet und trotzdem „nichts gelöscht"
 * meldet, ist die stillste Sorte Fehler: sie sieht aus wie eine Entwarnung.
 */
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

export const NAME = "Geteilter Vorrat — Wirkung";

const HIER = dirname(fileURLToPath(import.meta.url));
const NETZ = join(HIER, "..", "..");
const BUEHNE = join("/tmp", "vorrat-buehne");

/* Die zwei kleinsten echten Apps mit dem Muster — je weniger Vorrat-Einträge,
   desto seltener scheitert die Installation an einer fehlenden Datei. */
const APP_A = { repo: "mycel-karte", vorrat: "mycel-karte" };
const APP_B = { repo: "Kuechenzettel", sw: "sw.js" };

const TYPEN = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json",
};

/* Standard ist `origin/main` — ein Klon im Container kann Monate alt sein.
 *
 * `ARBEITSKOPIE=<repo>[,<repo>]` nimmt fuer die genannten Depots stattdessen den
 * ARBEITSBAUM. Das ist der Weg, eine Reparatur zu pruefen, BEVOR sie gepusht
 * wird — und es steht in der Ausgabe, damit niemand eine ungepushte Messung
 * fuer eine Aussage ueber `main` haelt. */
const ARBEITSKOPIE = (process.env.ARBEITSKOPIE || "").split(",").filter(Boolean);

function auschecken(repo, ziel) {
  const quelle = join(NETZ, repo);
  mkdirSync(ziel, { recursive: true });
  if (ARBEITSKOPIE.includes(repo)) {
    const tar = execFileSync("tar",
      ["-c", "--exclude=.git", "--exclude=node_modules", "-C", quelle, "."],
      { maxBuffer: 256 * 1024 * 1024 });
    execFileSync("tar", ["-x", "-C", ziel], { input: tar });
    return;
  }
  execFileSync("git", ["-C", quelle, "fetch", "origin", "main", "--quiet"], { stdio: "ignore" });
  const tar = execFileSync("git", ["-C", quelle, "archive", "origin/main"],
    { maxBuffer: 256 * 1024 * 1024 });
  execFileSync("tar", ["-x", "-C", ziel], { input: tar });
}

function server(wurzel) {
  return new Promise((fertig) => {
    const s = createServer((req, res) => {
      const pfad = decodeURIComponent(req.url.split("?")[0]);
      let datei = join(wurzel, pfad);
      if (pfad.endsWith("/")) datei = join(datei, "index.html");
      if (!existsSync(datei)) { res.writeHead(404).end("weg"); return; }
      res.writeHead(200, {
        "content-type": TYPEN[extname(datei)] || "application/octet-stream",
        /* Ein Service-Worker darf nicht aus dem HTTP-Vorrat kommen, sonst misst
           der zweite Lauf den Worker des ersten. */
        "cache-control": "no-store",
      });
      res.end(readFileSync(datei));
    });
    s.listen(0, "127.0.0.1", () => fertig({ s, port: s.address().port }));
  });
}

/** Wartet, bis unter diesem Pfad ein Worker die Seite steuert. */
async function warteAufWorker(seite) {
  await seite.waitForFunction(
    () => navigator.serviceWorker && navigator.serviceWorker.controller !== null,
    null, { timeout: 20000 });
}

const vorraete = (seite) => seite.evaluate(() => caches.keys());

async function lauf(ok, { sabotiereB }) {
  rmSync(BUEHNE, { recursive: true, force: true });
  auschecken(APP_A.repo, join(BUEHNE, "a"));
  auschecken(APP_B.repo, join(BUEHNE, "b"));

  if (sabotiereB === "regress") {
    /* Seit dem 2026-09-08 traegt Kuechenzettel auf main den Praefix-Filter.
       Die Gegenprobe nimmt ihn wieder HERAUS — der Schaden muss dann wieder
       auftreten, sonst misst der Lauf nur, dass nichts passiert. */
    const p = join(BUEHNE, "b", APP_B.sw);
    const alt = readFileSync(p, "utf8");
    const neu = alt.replace(/(\w+)\.startsWith\(VORRAT_PRAEFIX\)\s*&&\s*/g, "");
    if (alt === neu) throw new Error("Praefix-Filter liess sich nicht herausnehmen — der Fall misst nichts");
    writeFileSync(p, neu);
  } else if (sabotiereB) {
    /* Der Präfix-Filter aus Tomys-Hub/sw.js — kopiert, nicht erfunden.
       (Historisch: so wurde der Befund am 2026-09-08 bewiesen, als main den
       Filter noch nicht trug.) */
    const p = join(BUEHNE, "b", APP_B.sw);
    const alt = readFileSync(p, "utf8");
    const neu = alt.replace(/(\w+)\s*!==?\s*CACHE_VERSION/g,
      "$1.startsWith('kuechenzettel-') && $1 !== CACHE_VERSION");
    if (alt === neu) throw new Error("Präfix-Filter liess sich nicht einsetzen — der Fall misst nichts");
    writeFileSync(p, neu);
  }

  const { s, port } = await server(BUEHNE);
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const kontext = await browser.newContext();
  const basis = `http://127.0.0.1:${port}`;

  try {
    /* ── App A: installieren und Vorrat füllen ── */
    const a = await kontext.newPage();
    await a.goto(`${basis}/a/`, { waitUntil: "load" });
    await warteAufWorker(a);
    await a.waitForFunction(async () => (await caches.keys()).length > 0,
      null, { timeout: 20000 }).catch(() => {});
    const vorher = await vorraete(a);
    const meins = vorher.filter((k) => k.includes(APP_A.vorrat));

    if (!meins.length) {
      ok(`AUSGANGSLAGE: ${APP_A.repo} legt einen Vorrat an — NICHT MESSBAR, `
        + `vorgefunden: [${vorher.join(", ")}]`, false);
      return { messbar: false };
    }
    ok(`Ausgangslage: ${APP_A.repo} hat ${meins.length} Vorrat/Vorräte `
      + `(${meins.join(", ")})`, true);

    /* ── App B unter demselben Ursprung aufrufen ── */
    const b = await kontext.newPage();
    await b.goto(`${basis}/b/`, { waitUntil: "load" });
    await warteAufWorker(b);

    const nachher = await vorraete(b);
    const ueberlebt = nachher.filter((k) => k.includes(APP_A.vorrat));

    return { messbar: true, meins, nachher, ueberlebt };
  } finally {
    await browser.close();
    s.close();
    rmSync(BUEHNE, { recursive: true, force: true });
  }
}

/* ══ SORTE B — der Hart-Neuladen-Knopf (⟳) ═══════════════════════════════
 *
 * ⚠ SORTE A UND B WÜRDEN SICH VERMISCHEN, und dann misst der Lauf nichts.
 * mycel-kartes `sw.js` löscht selbst schon alles; ein Klick auf ihren ⟳ lädt
 * die Seite neu, der Worker aktiviert erneut — und man wüsste hinterher nicht,
 * WER gelöscht hat.
 *
 * Deshalb bekommt ihr Worker hier den Präfix-Filter. Das ist keine
 * Beschönigung, sondern die Isolierung: Sorte A ist damit stillgelegt, und der
 * Lauf weist das mit einer eigenen KONTROLLE nach, bevor er den Knopf drückt.
 * Verschwindet der fremde Vorrat danach trotzdem, kann es nur der Knopf
 * gewesen sein.
 */
const APP_KNOPF = { repo: "mycel-karte", sw: "sw.js", knopf: "#reloadBtn" };
const APP_OPFER = { repo: "Kuechenzettel", vorrat: "kuechenzettel" };

async function laufSorteB(ok) {
  rmSync(BUEHNE, { recursive: true, force: true });
  auschecken(APP_OPFER.repo, join(BUEHNE, "a"));
  auschecken(APP_KNOPF.repo, join(BUEHNE, "b"));

  /* Sorte A der Knopf-App stilllegen — sonst ist der Befund nicht zuzuordnen. */
  const p = join(BUEHNE, "b", APP_KNOPF.sw);
  const alt = readFileSync(p, "utf8");
  const neu = alt.replace(/(\w+)\s*!==?\s*CACHE_VERSION/g,
    "$1.startsWith('mycel-karte-') && $1 !== CACHE_VERSION");
  if (alt === neu) throw new Error("Sorte A liess sich nicht stilllegen — der Lauf misst nichts");
  writeFileSync(p, neu);

  const { s, port } = await server(BUEHNE);
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const kontext = await browser.newContext();
  const basis = `http://127.0.0.1:${port}`;

  try {
    const a = await kontext.newPage();
    await a.goto(`${basis}/a/`, { waitUntil: "load" });
    await warteAufWorker(a);
    await a.waitForFunction(async () => (await caches.keys()).length > 0,
      null, { timeout: 20000 }).catch(() => {});
    const vorher = (await vorraete(a)).filter((k) => k.includes(APP_OPFER.vorrat));
    if (!vorher.length) {
      ok(`AUSGANGSLAGE Sorte B: ${APP_OPFER.repo} legt einen Vorrat an — NICHT MESSBAR`, false);
      return;
    }
    ok(`Ausgangslage Sorte B: ${APP_OPFER.repo} hat [${vorher.join(", ")}]`, true);

    const b = await kontext.newPage();
    await b.goto(`${basis}/b/`, { waitUntil: "load" });
    await warteAufWorker(b);

    /* KONTROLLE: Sorte A ist wirklich still. Ohne diese Zeile wäre der Befund
       unten von einem Worker-Fehler nicht zu unterscheiden. */
    const nachLaden = (await vorraete(b)).filter((k) => k.includes(APP_OPFER.vorrat));
    ok(`KONTROLLE: Sorte A stillgelegt — nach dem blossen ÖFFNEN von `
      + `${APP_KNOPF.repo} steht [${nachLaden.join(", ") || "nichts"}] noch da`,
      nachLaden.length > 0);
    if (!nachLaden.length) return;

    /* Jetzt der Knopf. Er lädt die Seite neu — abwarten, dann nachsehen. */
    await b.click(APP_KNOPF.knopf);
    await b.waitForLoadState("load").catch(() => {});
    await b.waitForFunction(
      (v) => caches.keys().then((ks) => !ks.some((k) => k.includes(v))),
      APP_OPFER.vorrat, { timeout: 15000 }).catch(() => {});

    const danach = (await vorraete(b)).filter((k) => k.includes(APP_OPFER.vorrat));
    ok(`WIRKUNG Sorte B: ein Klick auf ⟳ in ${APP_KNOPF.repo} löscht den Vorrat `
      + `von ${APP_OPFER.repo} — überlebt: [${danach.join(", ") || "nichts"}]`,
      danach.length === 0);
  } finally {
    await browser.close();
    s.close();
    rmSync(BUEHNE, { recursive: true, force: true });
  }
}

/* ══ DIE REPARATUR PRUEFEN — beide Haelften ══════════════════════════════
 *
 * ⚠ EIN ZU ENGER FILTER IST DERSELBE FEHLER, NUR ANDERSHERUM. Wer nur prueft,
 * dass der FREMDE Vorrat bleibt, uebersieht eine App, die ihre EIGENEN alten
 * Vorraete nicht mehr wegraeumt — die wachsen dann ewig, und niemand merkt es,
 * weil nichts rot wird.
 *
 * Deshalb wird ein alter eigener Vorrat untergeschoben, BEVOR der Worker
 * aktiviert. Danach muessen beide Aussagen zugleich gelten.
 */
export async function laufReparatur(ok, { opfer, geprueft, praefix, alterVorrat, unterpfad = "" }) {
  /* `unterpfad` fuer Apps, die nicht an der Wurzel ihres Depots liegen
     (SB-KIMTool-Point: such-tool/). Ohne ihn laedt die Messstrecke die
     Wurzelseite und faesst den fraglichen Worker gar nicht an — sie waere
     gruen, ohne etwas gemessen zu haben. */
  rmSync(BUEHNE, { recursive: true, force: true });
  auschecken(opfer.repo, join(BUEHNE, "a"));
  auschecken(geprueft.repo, join(BUEHNE, "b"));

  const ausArbeit = ARBEITSKOPIE.includes(geprueft.repo);
  ok(`Quelle von ${geprueft.repo}: ${ausArbeit ? "ARBEITSKOPIE (noch nicht gepusht)" : "origin/main"}`,
    true);

  const { s, port } = await server(BUEHNE);
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const kontext = await browser.newContext();
  const basis = `http://127.0.0.1:${port}`;

  try {
    const a = await kontext.newPage();
    await a.goto(`${basis}/a/`, { waitUntil: "load" });
    await warteAufWorker(a);
    await a.waitForFunction(async () => (await caches.keys()).length > 0,
      null, { timeout: 20000 }).catch(() => {});
    const fremd = (await vorraete(a)).filter((k) => k.includes(opfer.vorrat));
    if (!fremd.length) { ok(`AUSGANGSLAGE: ${opfer.repo} hat einen Vorrat — NICHT MESSBAR`, false); return; }

    /* Einen ALTEN eigenen Vorrat unterschieben, vor der Aktivierung. */
    await a.evaluate(async (n) => { const c = await caches.open(n); await c.put("/alt", new Response("alt")); },
      alterVorrat);
    const gesetzt = (await vorraete(a)).includes(alterVorrat);
    ok(`Ausgangslage: fremd [${fremd.join(", ")}] + alter eigener Vorrat "${alterVorrat}" gesetzt`,
      gesetzt);
    if (!gesetzt) return;

    const b = await kontext.newPage();
    await b.goto(`${basis}/b/${unterpfad}`, { waitUntil: "load" });
    await warteAufWorker(b);
    await b.waitForFunction((n) => caches.keys().then((ks) => !ks.includes(n)),
      alterVorrat, { timeout: 15000 }).catch(() => {});

    const danach = await vorraete(b);
    ok(`HAELFTE 1 — fremder Vorrat BLEIBT: [${danach.filter((k) => k.includes(opfer.vorrat)).join(", ") || "nichts"}]`,
      danach.some((k) => k.includes(opfer.vorrat)));
    ok(`HAELFTE 2 — eigener ALTER Vorrat "${alterVorrat}" wird weiter weggeraeumt`,
      !danach.includes(alterVorrat));
    ok(`und der eigene AKTUELLE Vorrat steht da: [${danach.filter((k) => k.startsWith(praefix)).join(", ") || "nichts"}]`,
      danach.some((k) => k.startsWith(praefix)));
  } finally {
    await browser.close(); s.close();
    rmSync(BUEHNE, { recursive: true, force: true });
  }
}

/**
 * Die Gegenprobe zur REPARATUR eines ⟳-Knopfs (Sorte B). Drei Zusicherungen,
 * und die zweite wiegt am schwersten:
 *   1. der fremde Vorrat (App A) BLEIBT
 *   2. der fremde WORKER (App A) bleibt angemeldet — ein abgemeldeter Worker
 *      macht die Geschwister-App bis zum naechsten Online-Besuch nicht mehr
 *      offline-faehig; das ist schlimmer als ein geloeschter Vorrat
 *   3. der eigene alte Vorrat GEHT — sonst ist der Filter nur andersherum falsch
 */
export async function laufReparaturB(ok, { opfer, geprueft, praefix, alterVorrat, knopf, unterpfad = "" }) {
  rmSync(BUEHNE, { recursive: true, force: true });
  auschecken(opfer.repo, join(BUEHNE, "a"));
  auschecken(geprueft.repo, join(BUEHNE, "b"));
  ok(`Quelle von ${geprueft.repo}: ${ARBEITSKOPIE.includes(geprueft.repo) ? "ARBEITSKOPIE (noch nicht gepusht)" : "origin/main"}`, true);

  const { s, port } = await server(BUEHNE);
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const kontext = await browser.newContext();
  const basis = `http://127.0.0.1:${port}`;
  try {
    const a = await kontext.newPage();
    await a.goto(`${basis}/a/`, { waitUntil: "load" });
    await warteAufWorker(a);
    await a.waitForFunction(async () => (await caches.keys()).length > 0, null, { timeout: 20000 }).catch(() => {});
    const fremd = (await vorraete(a)).filter((k) => k.includes(opfer.vorrat));
    if (!fremd.length) { ok(`AUSGANGSLAGE: ${opfer.repo} hat einen Vorrat — NICHT MESSBAR`, false); return; }

    const b = await kontext.newPage();
    await b.goto(`${basis}/b/${unterpfad}`, { waitUntil: "load" });
    await warteAufWorker(b);
    await b.evaluate((n) => caches.open(n), alterVorrat);
    const vorher = await vorraete(b);
    ok(`Ausgangslage: fremd [${fremd.join(", ")}] + alter eigener "${alterVorrat}" + fremder Worker unter /a/`,
      vorher.includes(alterVorrat) && fremd.every((k) => vorher.includes(k)));

    /* `js:hardReload()` ruft die Funktion direkt — fuer Knoepfe hinter einem
       Tor (Mein-Tresor: der Safe-Eingang verdeckt die Schale, bis er offen ist).
       Gemessen wird dann der Handler, nicht der Klick. */
    if (knopf.startsWith("js:")) await b.evaluate(knopf.slice(3)).catch(() => {});
    else await b.click(knopf);
    await b.waitForLoadState("load").catch(() => {});
    await b.waitForTimeout(1500); // der Knopf laedt neu; die Loeschungen laufen davor
    const p2 = await kontext.newPage();
    await p2.goto(`${basis}/a/`, { waitUntil: "load" });
    const danach = await vorraete(p2);
    const scopes = await p2.evaluate(() => navigator.serviceWorker.getRegistrations().then((rs) => rs.map((r) => new URL(r.scope).pathname)));
    ok(`HAELFTE 1 — fremder Vorrat BLEIBT: [${danach.filter((k) => k.includes(opfer.vorrat)).join(", ") || "nichts"}]`,
      danach.some((k) => k.includes(opfer.vorrat)));
    ok(`HAELFTE 2 — fremder WORKER bleibt angemeldet: [${scopes.join(", ") || "keiner"}]`,
      scopes.includes("/a/"));
    ok(`HAELFTE 3 — eigener ALTER Vorrat "${alterVorrat}" ist weg`, !danach.includes(alterVorrat));
  } finally {
    await browser.close(); s.close();
    rmSync(BUEHNE, { recursive: true, force: true });
  }
}

export async function lauf_(ok) {
  /* ⚠ SEIT DEM 2026-09-08 MISST DIESER LAUF DEN STAND NACH DER REPARATUR.
     Bis dahin bewies er den SCHADEN (Vorrat weg nach dem Besuch der Nachbar-
     App). Seit die Reparatur auf main liegt, waere dieselbe Zusicherung rot —
     nicht weil etwas kaputt ist, sondern weil es heil ist. Ein Wächter, der
     den Befund festnagelt, verbietet die Reparatur. Deshalb jetzt in beide
     Richtungen: der Stand auf main haelt, UND ohne den Filter kaeme der
     Schaden zurueck (sonst misst der Lauf nur, dass nichts passiert). */

  /* ── Sorte A, Stand main ── */
  const heil = await lauf(ok, { sabotiereB: false });
  if (!heil.messbar) return;
  ok(`STAND main, Sorte A: nach dem Besuch von ${APP_B.repo} steht der Vorrat von `
    + `${APP_A.repo} noch — ueberlebt: [${heil.ueberlebt.join(", ") || "nichts"}]`,
    heil.ueberlebt.length > 0);

  /* ── Sorte A, Gegenprobe: Filter heraus → Schaden zurueck ── */
  const regress = await lauf(ok, { sabotiereB: "regress" });
  if (!regress.messbar) return;
  ok(`GEGENPROBE Sorte A: ohne Praefix-Filter ist der Vorrat von ${APP_A.repo} WEG `
    + `— ueberlebt: [${regress.ueberlebt.join(", ") || "nichts"}]`,
    regress.ueberlebt.length === 0);

  /* ── Sorte B, Stand main: der ⟳ von mycel-karte gegen Kuechenzettel ── */
  await laufReparaturB(ok, {
    opfer: { repo: "Kuechenzettel", vorrat: "kuechenzettel" },
    geprueft: { repo: "mycel-karte" },
    praefix: "mycel-karte-", alterVorrat: "mycel-karte-v1", knopf: "#reloadBtn",
  });
}

export { lauf_ as lauf };

/* ── Kommandozeile ──────────────────────────────────────────────────────── */
if (process.argv[1] && process.argv[1].endsWith("vorrat_wirkung.mjs")) {
  let rot = 0;
  const ok = (was, gut) => { console.log(`  ${gut ? "✓" : "✗ ROT:"} ${was}`); if (!gut) rot++; };
  await lauf_(ok);
  console.log(`\n═══ ${rot === 0 ? "alles wie erwartet" : rot + " ROT"} ═══`);
  process.exit(rot ? 1 : 0);
}
