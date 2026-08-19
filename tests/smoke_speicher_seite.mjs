/*
 * Probe zu `tools/speicher.html`.
 *
 * Die eine Zusicherung, die zählt: **diese Seite fasst IndexedDB nicht an.**
 * Alles andere ist Bequemlichkeit; das hier ist der Grund, warum Klaus auf
 * „löschen" drücken kann, ohne seine Rezepte, Aufträge und Tresore zu riskieren.
 *
 * Deshalb wird das NICHT nur im Quelltext gesucht, sondern im echten Browser
 * gemessen: eine Datenbank anlegen, alle Vorräte löschen lassen, nachsehen ob
 * die Datenbank noch da ist UND ihr Inhalt unversehrt. Eine Quelltext-Suche
 * allein wäre der grüne Haken über dem offenen Loch — sie fände `deleteDatabase`
 * nicht, wenn es über einen zusammengesetzten Namen aufgerufen würde.
 *
 * Lauf: node tests/smoke_speicher_seite.mjs
 */
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
// Die Gegenprobe schiebt hier eine absichtlich kaputte Kopie unter — die echte
// Datei wird nie angefasst.
const SEITE = process.env.SPEICHER_SEITE || join(WURZEL, "tools", "speicher.html");

let gruen = 0, rot = 0;
const ok = (was, b) => b
  ? (gruen++, console.log("  ✓ " + was))
  : (rot++, console.log("  ✗ ROT: " + was));

const quelle = readFileSync(SEITE, "utf8");

/* Auf die BEDINGUNG warten, nicht auf ein Wort. Der Fortschrittstext der Seite
   enthielt zuerst dasselbe Wort wie die Endmeldung — die Prüfung feuerte damit
   mitten im Löschen und sah einen halb aufgeräumten Stand. Gewartet wird jetzt
   darauf, dass die Endmeldung steht UND die Liste die erwartete Länge hat. */
async function warteAufFertig(seite, erwarteteZeilen) {
  await seite.waitForFunction((n) =>
    document.getElementById("ergebnis").textContent.startsWith("Fertig:")
    && document.querySelectorAll("#liste li").length === n,
  erwarteteZeilen, { timeout: 15000 });
}

/* Kommentare weg, BEVOR nach Aufrufen gesucht wird. Sonst schlägt die Prüfung
   auf die eigene Doku an: die Seite erklärt im Kopf, dass sie `deleteDatabase`
   NICHT aufruft — und genau dieser Satz machte die Probe rot. Eine Textsuche
   unterscheidet Prosa nicht von Code; das muss sie hier aber. */
const code = quelle
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");

console.log("\nSPEICHER-SEITE — Probe\n");
console.log("Quelltext");

// Ein einziger Aufruf würde reichen, um Daten zu vernichten. Es darf keinen geben.
ok("kein deleteDatabase im Code (Kommentare abgezogen)", !/deleteDatabase/.test(code));
// `indexedDB` darf vorkommen — aber nur lesend (`databases()`).
const idbAufrufe = code.match(/indexedDB\.\w+/g) || [];
ok("indexedDB wird nur gelesen (databases), nichts anderes",
  idbAufrufe.every((a) => a === "indexedDB.databases"));
ok("die Trennlinie steht als Text auf der Seite",
  quelle.includes("fasst sie nicht an"));
// Selbstgenügsam: die Bauregel gilt auch für ein Werkzeug.
ok("keine fremden Adressen (kein CDN, keine Schriften von außen)",
  !/(src|href)\s*=\s*["']https?:\/\//i.test(quelle));

// ── Der echte Lauf ─────────────────────────────────────────────────────────
const server = createServer((req, res) => {
  if ((req.url || "").startsWith("/speicher.html")) {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(quelle);
    return;
  }
  // Irgendein Inhalt, den die Seite in einen Vorrat legen kann.
  res.writeHead(200, { "content-type": "text/plain", "content-length": "5" });
  res.end("hallo");
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const adresse = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
try {
  const seite = await browser.newPage();
  await seite.goto(adresse + "/speicher.html");

  // Vorräte anlegen: zwei Fassungen derselben App plus eine einzelne.
  await seite.evaluate(async (basis) => {
    for (const name of ["probeapp-v7", "probeapp-v8", "einzelapp-v3"]) {
      const v = await caches.open(name);
      await v.add(basis + "/inhalt.txt");
    }
    // Und eine Datenbank mit echtem Inhalt — sie MUSS den Lauf überleben.
    await new Promise((fertig) => {
      const anfrage = indexedDB.open("probe_daten", 1);
      anfrage.onupgradeneeded = () => anfrage.result.createObjectStore("fach");
      anfrage.onsuccess = () => {
        const db = anfrage.result;
        const t = db.transaction("fach", "readwrite");
        t.objectStore("fach").put({ rezept: "Kartoffelsuppe" }, "eins");
        t.oncomplete = () => { db.close(); fertig(); };
      };
    });
  }, adresse);

  await seite.reload();
  await seite.waitForFunction(() => {
    const t = document.getElementById("lage").textContent;
    return t.includes("Vorräte,") || t.includes("Keine Vorräte");
  }, null, { timeout: 15000 });

  console.log("\nAnzeige");
  const lage = await seite.textContent("#lage");
  ok("alle drei Vorräte werden gefunden", lage.includes("3 Vorräte"));
  ok("genau eine alte Fassung erkannt (probeapp-v7)", lage.includes("1 alte Fassungen"));

  const marken = await seite.$$eval("#liste li", (zeilen) =>
    zeilen.map((z) => [z.querySelector(".name").textContent,
                       z.querySelector(".marke").textContent]));
  const marke = (n) => (marken.find((m) => m[0] === n) || [, ""])[1];
  ok("probeapp-v7 ist als alte Fassung markiert", marke("probeapp-v7") === "alte Fassung");
  ok("probeapp-v8 gilt als in Gebrauch", marke("probeapp-v8") === "in Gebrauch");
  ok("einzelapp-v3 gilt als in Gebrauch (eine Fassung ist nie alt)",
    marke("einzelapp-v3") === "in Gebrauch");

  console.log("\nAuswahl");
  await seite.click("#alteWaehlen");
  const gewaehlt = await seite.$$eval("#liste input",
    (h) => h.filter((x) => x.checked).map((x) => x.dataset.name));
  ok("der Knopf fuer alte Fassungen trifft genau probeapp-v7",
    gewaehlt.length === 1 && gewaehlt[0] === "probeapp-v7");

  console.log("\nLöschen mit Teil-Auswahl");
  // Zuerst NUR die alte Fassung wegräumen — der Fall, den Klaus wirklich nutzt.
  // Löschte die Seite hier alles, wären die beiden anderen Vorräte auch weg, und
  // niemand merkte es: eine Probe, die immer alles anhakt, misst genau das nicht.
  await seite.click("#loeschen");
  await warteAufFertig(seite, 2);
  const nachTeil = (await seite.evaluate(() => caches.keys())).sort();
  ok("nur die alte Fassung ist weg",
    JSON.stringify(nachTeil) === JSON.stringify(["einzelapp-v3", "probeapp-v8"]));

  console.log("\nLöschen — und was danach noch da ist");
  await seite.click("#allesWaehlen");
  await seite.click("#loeschen");
  await warteAufFertig(seite, 0);

  const uebrig = await seite.evaluate(() => caches.keys());
  ok("alle Vorräte sind weg", uebrig.length === 0);
  if (uebrig.length) console.log("     übrig:", JSON.stringify(uebrig));

  const daten = await seite.evaluate(async () => {
    const namen = (await indexedDB.databases()).map((d) => d.name);
    const wert = await new Promise((fertig) => {
      const a = indexedDB.open("probe_daten", 1);
      a.onsuccess = () => {
        const db = a.result;
        if (!db.objectStoreNames.contains("fach")) { db.close(); return fertig(null); }
        const g = db.transaction("fach", "readonly").objectStore("fach").get("eins");
        g.onsuccess = () => { const w = g.result; db.close(); fertig(w); };
        g.onerror = () => { db.close(); fertig(null); };
      };
      a.onerror = () => fertig(null);
    });
    return { namen, wert };
  });
  ok("die Datenbank steht noch", daten.namen.includes("probe_daten"));
  ok("und ihr Inhalt ist unversehrt",
    !!daten.wert && daten.wert.rezept === "Kartoffelsuppe");
} finally {
  await browser.close();
  server.close();
}

console.log(`\n— ${gruen} bestanden, ${rot} fehlgeschlagen —\n`);
process.exit(rot > 0 ? 1 : 0);
