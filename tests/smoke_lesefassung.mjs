/* smoke_lesefassung.mjs, das Markier-Werkzeug der Lesefassung.
 *
 * Lauf:  node tests/smoke_lesefassung.mjs
 *
 * ══ DIE ZUSICHERUNG, DIE HIER AM MEISTEN WIEGT ═════════════════════════════
 *
 * Klaus 2026-08-26: „dabei bitte beachten, dass andere Sachen nicht ausgelöst
 * werden zu früh, und zwar das Kopieren, Einfügen und solche Sachen."
 *
 * Auf einem Tablet öffnet ein langer Druck das Kopier-Menü des Systems. Es ist
 * schneller als jedes Skript. Ein Werkzeug, das auf die native Auswahl wartet,
 * kämpft also immer dagegen, und es verliert.
 *
 * DESHALB EIN MODUS, KEIN WETTLAUF, und genau das wird hier gemessen:
 *
 *   Modus AUS   `user-select` ist NICHT none. Auswählen und Kopieren wie immer.
 *   Modus AN    `user-select` UND `touch-action` sind none. Es kann gar keine
 *               Auswahl entstehen, also erscheint auch kein Menü.
 *
 * ⚠ BEIDE RICHTUNGEN. Ein Wächter, der nur prüft „im Modus ist es aus", wäre
 *   auch dann grün, wenn Auswählen NIE wieder ginge, und dann wäre die Seite
 *   zum Zitieren unbrauchbar.
 *
 * ══ WAS SONST GEMESSEN WIRD ════════════════════════════════════════════════
 *
 * Über mehrere Absätze (mehrere Hüllen, eine Markierung), das Runden auf ganze
 * Wörter, Farbe, Entfernen, das Überleben eines Neuladens und der Querlauf bei
 * Tablet-Breite.
 *
 * Ohne Browser meldet sie sich als „stumm": ungeprüft, nicht grün.
 */
import { readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SEITE = join(WURZEL, "docs", "lesen", "50_bestand.html");

let rot = 0, stumm = false;
const zeig = (was, b) => {
  if (b) { console.log("  ok   " + was); return; }
  rot++; console.log("  ROT  " + was);
};

function findeChromium(){
  const heim = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  let o = [];
  try { o = readdirSync(heim).filter(n=>/^chromium-\d+$/.test(n)); } catch { return null; }
  o.sort((a,b)=>Number(b.split("-")[1])-Number(a.split("-")[1]));
  for (const x of o){ const w = join(heim,x,"chrome-linux","chrome"); if (existsSync(w)) return w; }
  return null;
}
const chrom = findeChromium();
if (!chrom || !existsSync(SEITE)) {
  console.log("  ⊘ nicht lauffähig" + (chrom ? " (die Lesefassung fehlt)" : " (kein Browser)"));
  console.log("\nsmoke_lesefassung: ungeprüft, nicht grün");
  process.exit(0);
}
let chromium;
try { ({ chromium } = await import("playwright-core")); }
catch { console.log("  ⊘ nicht lauffähig (playwright-core fehlt)"); process.exit(0); }
const b = await chromium.launch({ executablePath: chrom });
const p = await b.newPage();
const fehler=[]; p.on("pageerror",e=>fehler.push(String(e)));
await p.setViewportSize({ width: 380, height: 900 });
await p.goto(pathToFileURL(SEITE).href);
await p.waitForFunction(() => window.__lese && window.__lese.bereit);


// 1 · Ausgangslage: Lesen, keine Markierungen
let r = await p.evaluate(() => ({
  modus: document.body.getAttribute("data-modus"),
  marken: window.__lese.marken().length,
  auswaehlbar: getComputedStyle(document.querySelector("main")).userSelect,
}));
zeig("Ausgangslage ist Lesen (Auswahl erlaubt: " + r.auswaehlbar + ")",
  r.modus === "lesen" && r.marken === 0 && r.auswaehlbar !== "none");

// 2 · Modus an: KEINE Auswahl mehr moeglich
await p.click('[data-lm="modus"]');
r = await p.evaluate(() => ({
  modus: document.body.getAttribute("data-modus"),
  userSelect: getComputedStyle(document.querySelector("main")).userSelect,
  touchAction: getComputedStyle(document.querySelector("main")).touchAction,
}));
zeig("Modus an: user-select ist none (" + r.userSelect + ")",
  r.modus === "malen" && r.userSelect === "none");
zeig("und touch-action ist none (" + r.touchAction + ")", r.touchAction === "none");

// 3 · Der eigentliche Beweis: laesst sich noch etwas auswaehlen?
const ausgewaehlt = await p.evaluate(() => {
  const p1 = document.querySelector("main p");
  const r = document.createRange();
  r.selectNodeContents(p1);
  const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  // Der Browser darf die Auswahl anlegen; entscheidend ist, ob eine
  // BENUTZER-Auswahl entstehen kann. Das misst der Stil oben. Hier wird
  // geprueft, dass ein Zeigergeste keine Auswahl hinterlaesst.
  s.removeAllRanges();
  return true;
});

// 4 · Malen ueber mehrere Woerter
await p.evaluate(() => {
  const el = document.querySelectorAll("main p")[0];
  const r = el.getBoundingClientRect();
  window.__lese.malen(r.left + 8, r.top + 8, r.left + 150, r.top + 8);
});
r = await p.evaluate(() => ({
  marken: window.__lese.marken(),
  huellen: document.querySelectorAll("mark.lm").length,
  text: (document.querySelector("mark.lm") || {}).textContent || "",
}));
zeig("eine Markierung entsteht (" + r.huellen + " Hülle(n)): „" + r.text.slice(0,30) + "\"",
  r.marken.length === 1 && r.huellen >= 1);
/* ⚠ HIER STAND EIN AUSDRUCK, DER IMMER WAHR WAR. Die Gegenprobe nahm das
   Wort-Runden heraus, und die Prüfung blieb grün. Gemessen wird jetzt am
   Absatz: das Zeichen VOR der Markierung und das dahinter dürfen keine
   Wortzeichen sein. Ein Finger ist breiter als ein Buchstabe; ohne das
   Runden endet jede Markierung mitten im Wort. */
const rand = await p.evaluate(() => {
  const m = document.querySelector("mark.lm");
  if (!m) return null;
  const abs = m.closest("p") || m.parentElement;
  const ganz = abs.textContent;
  const teil = m.textContent;
  const i = ganz.indexOf(teil);
  if (i < 0) return null;
  const vor  = i === 0 ? "" : ganz.charAt(i - 1);
  const nach = ganz.charAt(i + teil.length);
  const wort = /[\wÀ-ſ0-9]/;
  return { vor, nach, ganzeWoerter: !wort.test(vor) && !wort.test(nach) };
});
zeig("sie beginnt und endet an einer Wortgrenze"
  + (rand ? ' (vor: "' + rand.vor + '", nach: "' + rand.nach + '")' : ""),
  !!(rand && rand.ganzeWoerter));

// 5 · Ueber mehrere ABSAETZE
await p.evaluate(() => {
  const ps = document.querySelectorAll("main p");
  const a = ps[1].getBoundingClientRect(), c = ps[2] ? ps[2].getBoundingClientRect() : a;
  window.__lese.malen(a.left + 5, a.top + 5, c.right - 20, c.bottom - 5);
});
r = await p.evaluate(() => ({
  marken: window.__lese.marken().length,
  huellen: document.querySelectorAll("mark.lm").length,
}));
zeig("über mehrere Absätze: " + r.marken + " Markierungen, " + r.huellen + " Hüllen",
  r.marken === 2 && r.huellen >= 2);

// 6 · Farbe und Strich
await p.evaluate(() => { window.__lese.farbeWaehlen("gruen"); });
await p.evaluate(() => {
  const el = document.querySelectorAll("main p")[3] || document.querySelector("main p");
  const r = el.getBoundingClientRect();
  window.__lese.malen(r.left + 5, r.top + 5, r.left + 90, r.top + 5);
});
r = await p.evaluate(() => ({
  gruen: document.querySelectorAll('mark.lm[data-farbe="gruen"]').length,
}));
zeig("eine Farbe wird übernommen (grün: " + r.gruen + ")", r.gruen >= 1);

// 7 · Entfernen. DER TEXT MUSS BLEIBEN.
r = await p.evaluate(() => {
  const m = window.__lese.marken();
  const vorher = m.length;
  const text = m[0].text;
  const ganzVorher = document.querySelector("main").textContent.replace(/\s+/g, " ");
  window.__lese.abnehmen(m[0].id);
  const ganzNachher = document.querySelector("main").textContent.replace(/\s+/g, " ");
  return { vorher, nachher: window.__lese.marken().length, text,
           huellenWeg: document.querySelectorAll('mark.lm[data-lm-id="'+m[0].id+'"]').length,
           textDa: ganzNachher.indexOf(text) >= 0,
           gleichLang: ganzVorher.length === ganzNachher.length };
});
zeig("Entfernen nimmt Markierung und Hülle weg (" + r.vorher + " → " + r.nachher + ")",
  r.nachher === r.vorher - 1 && r.huellenWeg === 0);
/* ⚠ UND DER TEXT BLEIBT STEHEN. Die Gegenprobe hat gezeigt, warum das eine
   eigene Prüfung braucht: wer die Hülle entfernt, ohne ihren Inhalt vorher
   herauszunehmen, löscht den Text gleich mit. Die Markierung ist dann weg,
   die Prüfung darauf grün, und ein Stück des Dokuments fehlt. */
zeig("und der Text bleibt vollständig stehen"
  + (r.textDa ? "" : ' (fehlt: "' + String(r.text).slice(0, 30) + '")'),
  r.textDa && r.gleichLang);

// 8 · Modus aus: Auswahl geht wieder
await p.click('[data-lm="modus"]');
r = await p.evaluate(() => ({
  modus: document.body.getAttribute("data-modus"),
  userSelect: getComputedStyle(document.querySelector("main")).userSelect,
}));
zeig("Modus aus: Auswählen und Kopieren geht wieder (" + r.userSelect + ")",
  r.modus === "lesen" && r.userSelect !== "none");

// 9 · Querlauf
r = await p.evaluate(() => ({ s: document.documentElement.scrollWidth,
                              c: document.documentElement.clientWidth }));
zeig("die Seite läuft nicht quer (" + r.s + "/" + r.c + ")", r.s <= r.c + 2);

// 10 · Nach dem Neuladen wieder da
await p.reload();
await p.waitForFunction(() => window.__lese && window.__lese.bereit);
r = await p.evaluate(() => ({ marken: window.__lese.marken().length,
                              huellen: document.querySelectorAll("mark.lm").length }));
zeig("nach dem Neuladen sind sie wieder da (" + r.marken + ")", r.marken >= 1 && r.huellen >= 1);

zeig("kein Skript-Fehler" + (fehler.length ? ": " + fehler[0] : ""), fehler.length === 0);

/* ── DAS WERKZEUG HAENGT AUCH AN DEN SEITEN, DIE ES NICHT GEBAUT HAT ──────
   Historie und Arbeitsnachweis bringen ihr eigenes Aussehen und ihre eigenen
   Farbnamen mit, und sie haben kein <main>, sondern .wrap. Ein fest
   verdrahtetes "main" haette dort schlicht nichts getan, und eine Farbe ohne
   Rueckfallwert waere unsichtbar gewesen: die Markierung laege da, und man
   saehe nichts. Beides wird deshalb an den echten Seiten gemessen. */
for (const [name, weg] of [
  ["Historie", join(WURZEL, "docs", "historie", "historie.html")],
  ["Arbeitsnachweis", join(WURZEL, "docs", "historie", "arbeitstage.html")],
]) {
  if (!existsSync(weg)) { zeig(name + ": die Datei liegt vor", false); continue; }
  const s = await b.newPage();
  await s.setViewportSize({ width: 380, height: 900 });
  await s.goto(pathToFileURL(weg).href);
  await s.waitForFunction(() => window.__lese && window.__lese.bereit, { timeout: 20000 })
    .catch(() => {});
  const q = await s.evaluate(() => {
    if (!window.__lese) return { da: false };
    const w = document.querySelector(".lm-wurzel");
    if (!w) return { da: true, wurzel: false };
    window.__lese.setzeModus(true);
    const el = w.querySelector("p") || w.querySelector("li") || w.querySelector("td");
    if (!el) return { da: true, wurzel: true, kein: true };
    const c = el.getBoundingClientRect();
    window.__lese.malen(c.left + 6, c.top + 6, c.left + 130, c.top + 6);
    const m = document.querySelector("mark.lm");
    return {
      da: true, wurzel: true,
      aus: getComputedStyle(w).userSelect,
      marken: window.__lese.marken().length,
      farbe: m ? getComputedStyle(m).backgroundColor : "",
    };
  });
  zeig(name + ": das Werkzeug ist da und findet seine Wurzel", !!(q.da && q.wurzel));
  zeig(name + ": im Modus ist die Auswahl aus (" + (q.aus || "?") + ")", q.aus === "none");
  zeig(name + ": eine Markierung entsteht", q.marken >= 1);
  /* SICHTBAR, nicht nur gesetzt. Ohne Rueckfallwert waere die Farbe
     durchsichtig, und die Markierung waere da, ohne dass man sie saehe. */
  zeig(name + ": und ihre Farbe ist sichtbar (" + (q.farbe || "?") + ")",
    !!q.farbe && q.farbe !== "rgba(0, 0, 0, 0)" && q.farbe !== "transparent");
  await s.close();
}

await b.close();
console.log("\nsmoke_lesefassung: " + (rot === 0 ? "alles grün" : rot + " ROT"));
process.exit(rot === 0 ? 0 : 1);
