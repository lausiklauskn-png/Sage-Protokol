/* frageblatt-bauen.mjs — baut das Frageblatt für den Steuerberater.
 *
 * Aufruf:   node tools/frageblatt-bauen.mjs [--datum=YYYY-MM-DD]
 * Liest:    docs/STEUERBERATER_FRAGEN.md
 * Schreibt: docs/frageblatt.html
 *
 * ── EINE QUELLE, DREI AUSGABEN ────────────────────────────────────────────
 *
 * Der Text steht NUR in der Markdown-Datei. Daraus entstehen das Blatt hier,
 * das PDF (`frageblatt-pdf.mjs`) und der Abschnitt in der Antragsmappe. Eine
 * zweite von Hand gepflegte HTML-Fassung wäre eine Drift-Quelle mit Ansage:
 * sie liefe auseinander, und beide sähen richtig aus.
 *
 * Genau das war am 2026-08-25 der Fehler. Es gab eine handgeschriebene
 * HTML-Fassung neben der Markdown-Datei, und sie hat sich beim Anzeigen
 * zerlegt: die Aufzählungspunkte standen als `display:grid` mit zwei Spalten,
 * und JEDES Kind eines Grid-Containers wird zu einem Grid-Element, auch ein
 * `<strong>` mitten im Satz. Aus einem Satz mit drei fetten Stellen wurden
 * dadurch sechs Zellen, umgebrochen auf zwei Spalten, ein Wort je Zeile.
 *
 * **Ein Layout, das den INHALT eines Absatzes zerlegt, ist immer falsch.**
 * Deshalb entstehen die Listen hier aus dem Markdown-Leser als gewöhnliche
 * `<ol>`/`<ul>`, und der Zähler hängt am `::marker`. Dort kann kein
 * `<strong>` je zu einem eigenen Kasten werden.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdown } from './markdown-mini.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(WURZEL, 'docs/STEUERBERATER_FRAGEN.md');
const ZIEL = resolve(WURZEL, 'docs/frageblatt.html');
const ROH = 'https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/';

const argDatum = process.argv.find((a) => a.startsWith('--datum='));
const DATUM = argDatum ? argDatum.slice(8) : new Date().toISOString().slice(0, 10);

/* Verweise zeigen aus einer heruntergeladenen Datei ins Leere. Auf dem Tablet
   liegt sie unter `content://…` und hat kein Verzeichnis, gegen das ein
   relativer Pfad auflöst. Also alles auf die volle Adresse. */
const verweis = (u) => (/^(https?:|mailto:|#)/.test(u) ? u : ROH + u.replace(/^\.\//, '').replace(/^\.\.\//, ''));

const rumpf = markdown(readFileSync(QUELLE, 'utf-8'), verweis);

/* BOM VORWEG. Beim Herunterladen geht `charset=utf-8` verloren: die Angabe
   steht im MIME-Typ, auf der Platte liegen nur Bytes. Androids Betrachter rät
   dann Latin-1, und aus jedem Umlaut werden zwei Zeichen ("AushÃ¤ngen").
   Netzweite Regel, siehe NETZWEIT § 6b, und `arbeitstage-bauen.mjs` macht es
   seit dem 2026-08-24 genauso.

   NUR HIER, nicht in der Zwischenablage und nicht in einem JSON-Paket: dort
   wäre er ein unsichtbares Zeichen bzw. ein Grund, an dem `JSON.parse`
   abbricht. */
const html = `\uFEFF<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Frageblatt Steuerberater</title>
<style>
:root{
  --papier:#F4F5F1; --blatt:#FFFFFF; --tinte:#1B2027; --gedaempft:#5C6672;
  --linie:#D9DCD4; --linie-stark:#BFC4BA; --akzent:#2F5D50; --akzent-weich:#EAF0EC;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --papier:#131619; --blatt:#1C2024; --tinte:#E7E9E4; --gedaempft:#9AA3A9;
    --linie:#2B3136; --linie-stark:#3C444A; --akzent:#7FAE9C; --akzent-weich:#1E2A27;
  }
}
:root[data-theme="dark"]{
  --papier:#131619; --blatt:#1C2024; --tinte:#E7E9E4; --gedaempft:#9AA3A9;
  --linie:#2B3136; --linie-stark:#3C444A; --akzent:#7FAE9C; --akzent-weich:#1E2A27;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0;background:var(--papier);color:var(--tinte);
  font:400 16.5px/1.62 "IBM Plex Sans",-apple-system,"Segoe UI",Roboto,system-ui,sans-serif;
}
.bogen{max-width:47rem;margin:0 auto;padding:clamp(1rem,4vw,3rem) clamp(.7rem,4vw,2rem) 5rem}
.blatt{background:var(--blatt);border:1px solid var(--linie);border-radius:2px;
  box-shadow:0 1px 2px rgba(27,32,39,.06),0 8px 24px -12px rgba(27,32,39,.16);
  padding:clamp(1.1rem,5vw,3.5rem)}

.kopf{padding-bottom:1.2rem;border-bottom:2px solid var(--linie-stark);margin-bottom:.5rem}
.marke{font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--akzent);font-weight:600}
.kopf .datum{font-size:.85rem;color:var(--gedaempft);margin-top:.5rem;font-variant-numeric:tabular-nums}

/* ── Fließtext ──────────────────────────────────────────────────────────
   KEIN Grid und KEIN Flex auf etwas, das Satz-Inhalt trägt. Siehe Kopf. */
h1,h2,h3,h4{font-family:Georgia,"Times New Roman",serif;line-height:1.25;margin:0;text-wrap:balance}
h1{font-size:clamp(1.6rem,5vw,2.2rem);font-weight:600;letter-spacing:-.01em;margin:.2rem 0 .8rem}
h2{font-size:clamp(1.2rem,3.6vw,1.5rem);font-weight:600;margin:2.4rem 0 .5rem;
   padding-top:1.1rem;border-top:1px solid var(--linie)}
h3{font-size:1.12rem;font-weight:600;margin:1.9rem 0 .4rem;color:var(--akzent)}
h4{font-size:1rem;font-weight:600;margin:1.3rem 0 .3rem}
p{margin:.75rem 0}
strong{font-weight:600}
em{font-style:italic}
hr{border:none;border-top:1px solid var(--linie);margin:2rem 0}
a{color:var(--akzent);text-underline-offset:2px}
code{font-family:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;font-size:.85em;
  background:var(--akzent-weich);padding:.1em .35em;border-radius:2px;word-break:break-word}

ol,ul{margin:.75rem 0;padding-left:1.6rem}
li{margin:.42rem 0}
li::marker{color:var(--akzent);font-weight:600}
li>ul,li>ol{margin:.3rem 0}

blockquote{margin:1.1rem 0;padding:.7rem 0 .7rem 1.1rem;
  border-left:3px solid var(--akzent);background:var(--akzent-weich);
  border-radius:0 2px 2px 0;padding-right:1rem}
blockquote>p:first-child{margin-top:0}
blockquote>p:last-child{margin-bottom:0}

.tabelle{overflow-x:auto;margin:1rem 0;border:1px solid var(--linie);border-radius:2px}
table{border-collapse:collapse;width:100%;font-size:.9rem;min-width:20rem}
th,td{text-align:left;padding:.5rem .7rem;border-bottom:1px solid var(--linie);vertical-align:top}
thead th{font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--gedaempft);
  font-weight:600;background:var(--akzent-weich)}
tbody tr:last-child td{border-bottom:none}
td{font-variant-numeric:tabular-nums}

pre{overflow-x:auto;background:var(--akzent-weich);padding:.8rem 1rem;border-radius:2px;
  border:1px solid var(--linie);font-size:.85rem}
pre code{background:none;padding:0}

.fuss{margin-top:2.5rem;padding-top:1rem;border-top:1px solid var(--linie);
  font-size:.8rem;color:var(--gedaempft);text-align:center}

@media print{
  body{background:#fff;color:#000;font-size:10.5pt;line-height:1.45}
  .bogen{max-width:none;padding:0}
  .blatt{box-shadow:none;border:none;padding:0}
  .fuss{display:none}
  h2{break-after:avoid;page-break-after:avoid;border-top-color:#999}
  h3,h4{break-after:avoid;page-break-after:avoid}
  tr,li,blockquote{break-inside:avoid;page-break-inside:avoid}
  thead{display:table-header-group}
  .tabelle{overflow:visible;border-color:#999}
  th,td{border-bottom-color:#bbb}
  thead th{background:#f0f0f0 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  blockquote{background:none;border-left-color:#666}
  a{color:#000;text-decoration:none}
  code,pre{background:#f4f4f4 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
</style>
</head>
<body>
<div class="bogen">
<div class="blatt">
<header class="kopf">
  <div class="marke">Vorbereitung eines Beratungstermins</div>
  <div class="datum" data-stand="${DATUM}">Stand ${DATUM} &middot; erzeugt aus <code>docs/STEUERBERATER_FRAGEN.md</code></div>
</header>
${rumpf}
<p class="fuss">Vorbereitung, keine steuerliche Beratung &middot; Stand ${DATUM}</p>
</div>
</div>
</body>
</html>
`;

mkdirSync(dirname(ZIEL), { recursive: true });
writeFileSync(ZIEL, html, 'utf-8');
console.log('geschrieben: docs/frageblatt.html');
console.log('  Stand: ' + DATUM + ' · Größe: ' + Math.round(html.length / 1024) + ' KB');
