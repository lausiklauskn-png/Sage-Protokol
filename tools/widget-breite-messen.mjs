/* Wie breit ist die Modul-17-Blase wirklich? — die Tat messen, nicht den Quelltext.
 *
 *   PW_CORE=/pfad/zu/playwright-core/index.js node tools/widget-breite-messen.mjs \
 *     src/modules/17_floating_widget.js
 *   BREITEN=320,360,412,768 …   (Vorgabe: 320,360,412,768)
 *
 * GESCHWISTER VON tools/breite-messen.mjs, und bewusst ein zweites Werkzeug:
 * jenes misst eine ganze SEITE, dieses misst EIN Modul in Reinform — ohne dass
 * eine App drumherum stehen muss, gegen die Kanon-Datei selbst. Damit lässt sich
 * eine Änderung am Modul messen, bevor sie in fünfzehn Repos kopiert ist.
 *
 * WARUM ES DAS GIBT (Klaus' Befund, gemessen 2026-08-12). Die Pille hat keine
 * Breiten-Grenze — sie ist so breit wie ihr Inhalt. Weil sie rechts in der Ecke
 * hängt, wächst sie nach LINKS aus dem Bild:
 *
 *     Fenster 320 px  →  Pille 385 px  →  81 px links abgeschnitten
 *     Fenster 360 px  →  Pille 385 px  →  41 px links abgeschnitten
 *
 * ZWEI FALLEN IM MESSEN SELBST, beide am 2026-08-12 zuerst hineingetappt:
 *
 *   1. Der SIEGEL-Slot mountet NUR, wenn window.SbkimSiegel.isCertified() wirklich
 *      true liefert (Anti-Greenwashing, Modul 17 prüft doppelt). Ohne diesen Stub
 *      fehlt der breiteste Slot und die Messung fällt um 111 px zu niedrig aus.
 *   2. Alle Maße im Modul sind `rem`. Setzt die Messseite eine eigene Grundschrift,
 *      misst man seine eigene Testseite statt des Moduls. Darum gibt diese Seite
 *      KEINE font-size vor — und das Ergebnis nennt die gemessene Grundschrift mit.
 *
 * Beide Fallen zeigten dieselbe Handschrift: die Messung gab zu früh Entwarnung.
 */
import { readFileSync, existsSync } from "node:fs";
import http from "node:http";

const MODUL = process.argv[2] || "src/modules/17_floating_widget.js";
if (!existsSync(MODUL)) {
  console.error(`Datei nicht gefunden: ${MODUL}`);
  console.error("Aufruf: PW_CORE=<pfad>/index.js node tools/widget-breite-messen.mjs [modul.js]");
  process.exit(2);
}
const code = readFileSync(MODUL, "utf8");

const pwPfad = process.env.PW_CORE || "/tmp/pw/node_modules/playwright-core/index.js";
if (!existsSync(pwPfad)) {
  console.error("❌ playwright-core nicht gefunden. PW_CORE=<pfad>/index.js setzen.");
  console.error("   (npm install playwright-core in einem Wegwerf-Ordner genügt.)");
  process.exit(2);
}
// playwright-core ist CommonJS: als ESM-Import liegt alles unter `default`.
// Ohne diese Zeile ist `pw.chromium` undefined — dieselbe Stelle wie in
// tools/breite-messen.mjs, aus demselben Grund.
const pwModul = await import(pwPfad);
const pw = pwModul.default || pwModul;

/* Der Siegel-Stub steht VOR dem Modul: sonst ist die Anti-Greenwashing-Prüfung
   schon gelaufen, wenn er ankommt, und der vierte Slot fehlt. */
const SEITE = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Breiten-Messung Modul 17</title>
<style>html,body{margin:0;padding:0;background:#111;color:#eee}</style>
</head><body><p style="padding:8px">Messseite</p>
<script>window.SbkimSiegel={isCertified:function(){return true;},
  getCertifiedAt:function(){return "2026-01-01";},_meta:{stufe:"gold"}};</script>
<script>${code}</script></body></html>`;

const server = http.createServer((q, r) => {
  r.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  r.end(SEITE);
});
await new Promise(res => server.listen(0, "127.0.0.1", res));
const port = server.address().port;

const browser = await pw.chromium.launch({
  executablePath: process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});

const BREITEN = (process.env.BREITEN || "320,360,412,768").split(",").map(Number);
let fehler = 0;

console.log(`Modul: ${MODUL}\n`);
console.log("Fenster  Pille    links…rechts   Zustand");
console.log("─".repeat(78));

for (const w of BREITEN) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 720 } });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load" });
  const m = await page.evaluate(async () => {
    await window.SbkimWidget.init({ allowDrag: true, allowClose: true });
    window.dispatchEvent(new CustomEvent("sbkim:siegel-certified", {
      detail: { certifiedAt: "2026-01-01", repoUrl: "https://example.invalid/x", stufe: "gold" } }));
    await new Promise(r => setTimeout(r, 120));
    const el = document.getElementById("sbkim-widget");
    if (!el) return null;
    const r0 = el.getBoundingClientRect();
    const slots = Array.from(el.querySelectorAll(".sbkim-widget-slot")).map(s => {
      const b = s.getBoundingClientRect();
      return { slot: s.getAttribute("data-slot"), w: Math.round(b.width), ziel: Math.round(Math.min(b.width, b.height)) };
    });
    return { breite: Math.round(r0.width), links: Math.round(r0.left), rechts: Math.round(r0.right),
             fenster: window.innerWidth, slots, rem: getComputedStyle(document.documentElement).fontSize };
  });
  await ctx.close();
  if (!m) { console.log(`${String(w).padEnd(8)} — Widget nicht gemountet`); fehler++; continue; }

  // Beide Seiten zählen: rechts in der Ecke verankert, ragt eine zu breite
  // Pille nach LINKS hinaus — ein Blick nur auf den rechten Rand fände nichts.
  const ueberLinks = m.links < -0.5 ? Math.round(-m.links) : 0;
  const ueberRechts = m.rechts > m.fenster + 0.5 ? Math.round(m.rechts - m.fenster) : 0;
  const raus = ueberLinks > 0 || ueberRechts > 0 || m.breite > m.fenster;
  if (raus) fehler++;
  const zustand = ueberLinks ? `RAGT HINAUS — ${ueberLinks} px links abgeschnitten`
    : ueberRechts ? `RAGT HINAUS — ${ueberRechts} px rechts hinaus`
    : raus ? "RAGT HINAUS — breiter als das Fenster" : "passt";
  const kleinstesZiel = Math.min(...m.slots.map(s => s.ziel));
  console.log(`${String(w).padEnd(8)} ${String(m.breite + " px").padEnd(8)} ${String(m.links + "…" + m.rechts).padEnd(14)} ${zustand}`);
  console.log(`         Slots: ${m.slots.map(s => `${s.slot} ${s.w}`).join(" · ")}` +
              `  · kleinstes Berührungsziel ${kleinstesZiel} px${kleinstesZiel < 24 ? "  ⚠ unter der 24-px-Norm" : ""}` +
              `  · Grundschrift ${m.rem}`);
}

await browser.close();
server.close();
console.log("");
console.log(fehler === 0 ? "✓ passt bei allen gemessenen Breiten" : `❌ ${fehler} Breite(n) mit Befund`);
process.exitCode = fehler === 0 ? 0 : 1;
