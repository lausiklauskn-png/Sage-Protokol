/*
 * Knoten-Probe SBKIM-Demo (sbkim-demo/) — der SBKIM-Andock (Sammel-Brief
 * 2026-10-15, Schritt 4b; Klaus: die öffentliche Demo dockt an).
 *
 * Teil 1 ohne Browser: Schublade im <head>, Kette lädt den Kanon DIREKT aus
 * src/modules/ (keine Kopien), 05b getrennt, Identität ohne Personendaten.
 * Teil 2 im echten Browser: der Knoten startet, das Siegel steht im Kopf, und
 * der Knoten baut beim Laden keinen WebSocket auf.
 * Gegenprobe: tests/gegenprobe_sbkim_demo_knoten.mjs.
 */
import { readFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, resolve } from "node:path";

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = join(WURZEL, "sbkim-demo");
let gruen = 0, rot = 0;
function ok(name, bed, extra) {
  if (bed) { gruen++; console.log("  ✓ " + name); }
  else { rot++; console.log("  ✗ ROT " + name + (extra ? " — " + extra : "")); }
}
const lies = (f) => readFileSync(join(DEMO, f), "utf8");
const seite = lies("index.html"), glue = lies("sbkim-init.js");

console.log("── Teil 1 · ohne Browser");
{
  const kopf = seite.split("</head>")[0];
  const suffixAt = kopf.search(/<script>\s*window\.SBKIM_DB_SUFFIX\s*=\s*"sbkimdemo"\s*;?\s*<\/script>/);
  const erstesSkript = kopf.search(/<script(?![^>]*>\s*window\.SBKIM_DB_SUFFIX)/);
  ok("K1 Schublade „sbkimdemo“ steht im <head> vor jedem anderen Skript", suffixAt >= 0 && (erstesSkript < 0 || suffixAt < erstesSkript), suffixAt + "/" + erstesSkript);
  ok("K2 Klebstoff nutzt dieselbe Schublade (nicht die von Sage)", /dbSuffix:\s*"sbkimdemo"/.test(glue) && !/dbSuffix:\s*"sage"/.test(glue));
  const kette = (glue.match(/var KANON = \[([\s\S]*?)\n\s*\];/) || [])[1] || "";
  const glieder = kette.split("\n").map((z) => z.replace(/\/\/.*$/, "").trim()).filter((z) => z.startsWith("["));
  const ohneKomma = glieder.slice(0, -1).filter((z) => !z.endsWith(","));
  ok("K3 zwischen den Kettengliedern steht je ein Komma", glieder.length > 0 && ohneKomma.length === 0, "ohne Komma: " + ohneKomma.join(" | "));
  const namen = glieder.map((z) => (z.match(/"([^"]+\.js)"/) || [])[1]);
  const pflicht = ["01_storage", "02_spore", "03_embedding", "04_match", "05_anastomose", "07_apoptose", "15_membran", "16_siegel", "23_rendezvous", "23_rendezvous_ui", "16b_andock_wizard"].map((m) => "../src/modules/" + m + ".js");
  ok("K4 die Kette lädt jedes Pflicht-Modul (ohne 05b) DIREKT aus dem Kanon", pflicht.every((f) => namen.includes(f)), pflicht.filter((f) => !namen.includes(f)).join(", "));
  const fehlt = namen.filter((f) => f && !existsSync(join(DEMO, f)));
  ok("K5 jede Datei der Kette gibt es wirklich", fehlt.length === 0, fehlt.join(", "));
  ok("K6 die Identität steht vor dem Andock-Werkzeug", namen.indexOf("siegel-inhalt.js") >= 0 && namen.indexOf("siegel-inhalt.js") < namen.indexOf("../src/modules/16b_andock_wizard.js"));
  ok("K7 05b als ES-Modul mit eigener Zeile aus dem Kanon, NICHT in der Kette", /<script type="module" src="\.\.\/src\/modules\/05b_nostr_relay\.js"><\/script>/.test(seite) && !/05b_/.test(kette));
  ok("K8 kein Modul 17 (feste Leiste im Kopf)", !/17_/.test(kette) && !/17_/.test(seite));
  ok("K9 keine fremde Herkunft (allowedOrigins leer)", /allowedOrigins:\s*\[\]/.test(glue));
  ok("K10 Siegel-Band „SBKIM-DEMO“ im Badge-Platz", /ribbonText:\s*"SBKIM-DEMO"/.test(glue) && /badgeSelector:\s*"#siegel-platz"/.test(glue));
  ok("K11 beim Start keine Identität erzwungen (kein ensureIdentity)", !/ensureIdentity\s*\(/.test(glue.replace(/\/\*[\s\S]*?\*\//g, "")));
  ok("K12 Gerätename über den Klebstoff ins Verbinden-Panel, nur als Text", /setAttribute\("data-sbkim-geraetename"/.test(glue) && !/innerHTML/.test(glue));
  const leiste = ['id="netzleiste"', 'id="lamp-alive"', 'id="lamp-traffic"', 'id="lamp-fremd"', 'id="siegel-platz"', "data-sbkim-mycel-platz"];
  ok("K13 der Kopf trägt Lampen, Siegel-Platz und Mycel-Platz", leiste.every((x) => seite.includes(x)), leiste.filter((x) => !seite.includes(x)).join(", "));
  ok("K14 sicherheit.html liegt neben der Seite (sonst 404 hinter „Ausführlich erklärt“)", existsSync(join(DEMO, "sicherheit.html")));
  const fenster = {}; new Function("window", lies("siegel-inhalt.js"))(fenster);
  const W = fenster.SBKIM_SIEGEL_WIZ || {};
  const d = String(W.domainDescription || "");
  ok("K15 Beschreibung beginnt mit dem eigenen Namen und nennt Zweck, SBKIM, Mycel, Sage-Protokol, Knoten", d.startsWith("SBKIM-Demo") && ["ZWECK", "SBKIM", "Mycel", "Sage-Protokol", "Knoten"].every((w) => d.includes(w)));
  ok("K16 Beschreibung trägt keine Mailadresse, keine Anschrift, keine Telefonnummer", !/@|\d{5}\s|\+?\d[\d ]{7,}/.test(d));
  ok("K17 Endpunkt ist die eigene Adresse", W.endpoint === "https://lausiklauskn-png.github.io/Sage-Protokol/sbkim-demo/" && W.nodeName === "SBKIM-Demo");
}

let pw;
try { pw = await import("playwright-core"); } catch {
  console.log("⊘ Teil 2 nicht lauffähig: playwright-core fehlt (npm install). " + gruen + " grün · " + rot + " ROT ohne Browser.");
  process.exit(rot ? 1 : 2);
}
const kandidaten = ["/opt/pw-browsers/chromium", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"];
let exe = null;
try { for (const d of (await import("node:fs")).readdirSync("/opt/pw-browsers")) kandidaten.push("/opt/pw-browsers/" + d + "/chrome-linux/chrome"); } catch {}
exe = kandidaten.find((p) => existsSync(p) && !p.endsWith("/chromium")) || null;
if (!exe) { console.log("⊘ Teil 2 nicht lauffähig: kein Chromium gefunden."); process.exit(rot ? 1 : 2); }

const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml" };
const server = createServer((q, a) => {
  let p = decodeURIComponent(new URL(q.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = join(WURZEL, p);
  if (!f.startsWith(WURZEL) || !existsSync(f) || /node_modules|\.git/.test(f)) { a.writeHead(404); a.end(); return; }
  a.writeHead(200, { "content-type": TYP[extname(f)] || "application/octet-stream" });
  a.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASIS = "http://127.0.0.1:" + server.address().port + "/";
const browser = await pw.chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });

console.log("── Teil 2 · im Browser");
try {
  for (const breite of [1280, 360, 320]) {
    const ctx = await browser.newContext({ viewport: { width: breite, height: 800 } });
    const page = await ctx.newPage();
    await page.addInitScript(() => { const W = window.WebSocket; window.__wsZahl = 0;
      window.WebSocket = function (...a) { window.__wsZahl++; return new W(...a); }; window.WebSocket.prototype = W.prototype; });
    const fehler = [], fremd = [];
    page.on("pageerror", (e) => fehler.push(String(e)));
    /* Nur die Seite selbst: die eingebettete Mycel-Karte (iframe ../mycel-karte/) liest
       status.json von raw.githubusercontent.com — so war es schon vor dem Andocken. */
    page.on("request", (r) => { if (r.frame() === page.mainFrame() && !r.url().startsWith(BASIS) && !r.url().startsWith("data:")) fremd.push(r.url()); });
    await page.goto(BASIS + "sbkim-demo/index.html");
    const bereit = await page.waitForFunction(() => window.DEMO_KNOTEN_BEREIT === true, null, { timeout: 30000 }).then(() => true, () => false);
    ok(`B1 ${breite}: der Knoten startet (Kette durchgelaufen)`, bereit);
    ok(`B2 ${breite}: die Seite lädt ohne Skriptfehler`, fehler.length === 0, fehler.join(" | ").slice(0, 300));
    const m = await page.evaluate(() => ({
      module: ["SbkimStorage", "SbkimSpore", "SbkimEmbedding", "SbkimMatch", "SbkimAnastomose", "SbkimNostrRelay", "SbkimApoptose",
        "SbkimMembrane", "SbkimSiegel", "SbkimRendezvous", "SbkimRendezvousUI"].filter((g) => !window[g]),
      siegel: !!document.querySelector("#siegel-platz #sbkim-siegel-badge"),
      zettel: document.querySelectorAll("h1").length,
      suffix: window.SBKIM_DB_SUFFIX,
    }));
    ok(`B3 ${breite}: alle Pflicht-Module sind geladen`, m.module.length === 0, m.module.join(", "));
    ok(`B4 ${breite}: das Siegel steht im Platz der Kopfleiste`, m.siegel);
    ok(`B5 ${breite}: die Überschrift der Demo steht weiter da`, m.zettel === 1, String(m.zettel));
    const box = await page.evaluate(() => { const r = document.getElementById("lampen").getBoundingClientRect(); return { l: r.left, r: r.right, w: innerWidth }; });
    ok(`B6 ${breite}: die Lampen stehen ganz im Schirm`, box.l >= 0 && box.r <= box.w, JSON.stringify(box));
    const drin = await page.evaluate(() => { const k = document.getElementById("lampen").getBoundingClientRect();
      return [...document.querySelectorAll("#lampen .lamp")].map((l) => l.getBoundingClientRect()).filter((r) => r.width > 0)
        .every((r) => r.left >= k.left - 0.5 && r.right <= k.right + 0.5); });
    ok(`B11 ${breite}: die Lampen passen in ihren Knopf (er erbt nicht die feste Breite der Kopfknöpfe)`, drin);
    const knoepfe = await page.evaluate(() => [...document.querySelectorAll("header > *")].map((e) => { const r = e.getBoundingClientRect(); return { id: e.id || e.className, l: r.left, r: r.right }; }).filter((k) => k.r > innerWidth + 0.5 || k.l < -0.5));
    ok(`B10 ${breite}: kein Teil der Kopfleiste ragt aus dem Schirm`, knoepfe.length === 0, JSON.stringify(knoepfe));
    if (breite < 1100) {
      await page.click("#lampen");
      const auf = await page.evaluate(() => { const r = document.getElementById("netz-mehr").getBoundingClientRect(); return { sichtbar: r.width > 0, l: r.left, r: r.right, w: innerWidth }; });
      ok(`B7 ${breite}: ein Tipp auf die Lampen klappt Siegel und Netz auf, ohne über den Rand`, auf.sichtbar && auf.l >= 0 && auf.r <= auf.w, JSON.stringify(auf));
    }
    await page.waitForTimeout(1500);
    const ws = await page.evaluate(() => window.__wsZahl);
    ok(`B8 ${breite}: beim Laden entsteht kein WebSocket`, ws === 0, ws + " erzeugt");
    ok(`B9 ${breite}: beim Laden kein Abruf außer Haus (Seite selbst, ohne die eingebettete Karte)`, fremd.length === 0, fremd.slice(0, 3).join(", "));
    await ctx.close();
  }
} catch (e) {
  ok("die Probe läuft durch (Absturz: " + String(e && e.message || e).slice(0, 200) + ")", false);
} finally {
  await browser.close().catch(() => {}); server.close();
}
console.log("\n" + gruen + " grün · " + rot + " ROT");
process.exitCode = rot ? 1 : 0;
