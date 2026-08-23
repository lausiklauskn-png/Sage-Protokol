/* antragsmappe-bauen.mjs — baut `docs/antragsmappe.html` aus den Markdown-Quellen.
 *
 * Aufruf:  node tools/antragsmappe-bauen.mjs
 *
 * ── WOZU ───────────────────────────────────────────────────────────────────
 *
 * Klaus bekommt EINE Datei. Sie ist sein Zugang, nichts wird auf mehrere
 * Downloads verteilt. Aber sie hat ZWEI Abteilungen, und die müssen sich
 * getrennt herausnehmen lassen:
 *
 *   1 · PRIVAT      — der Fahrplan Forschungsgelder. Klaus' Arbeitspapier.
 *                     Geht niemanden etwas an, steht in keinem Antrag.
 *   2 · EINREICHBAR — Entstehung, Paper A, Forschungskorpus, Paper-Plan und
 *                     die Werkstatt-Unterlagen. Für Behörde und Gutachter.
 *
 * ── DREI ENTSCHEIDUNGEN, JEDE MIT GRUND ────────────────────────────────────
 *
 * 1 · EINE QUELLE. Die Mappe wird ERZEUGT, nie von Hand gepflegt. Sonst
 *     stünden dieselben Sätze zweimal im Depot und liefen auseinander — und
 *     der Antrag zitierte irgendwann eine Fassung, die es nicht mehr gibt.
 *     Wer den Inhalt ändert, ändert die `.md` und baut neu.
 *
 * 2 · KEIN RELATIVER VERWEIS. Auf Klaus' Tablet liegt die heruntergeladene
 *     Datei unter `content://…`; dort gibt es kein Verzeichnis, gegen das
 *     sich ein relativer Pfad auflösen ließe. Ergebnis wäre
 *     ERR_FILE_NOT_FOUND. Jeder Verweis aus den Quellen wird deshalb
 *     umgeschrieben: liegt das Ziel in der Mappe, auf einen internen Anker;
 *     liegt es nicht darin, auf die volle GitHub-Adresse.
 *
 * 3 · DRUCKEN ÜBER EINE KLASSE, NICHT ÜBER EINE ZWEITE FASSUNG. Der
 *     Druck-Knopf einer Abteilung setzt eine Klasse am <html>, die die andere
 *     ausblendet. Zwei Fassungen desselben Textes wären eine Drift-Quelle mit
 *     Ansage.
 *
 * Geprüft von `tests/smoke_antragsmappe.mjs`, gegengeprüft von
 * `tests/gegenprobe_antragsmappe.mjs`.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdown, escape } from './markdown-mini.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = resolve(WURZEL, 'docs/antragsmappe.html');
const ROH = 'https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/';

/* Das Datum wird beim Bauen gestempelt und steht dann IN der Datei. Eine
   Mappe ohne Datum ist im Antragswesen wertlos — man weiß nicht, welchen
   Stand man in der Hand hält. `--datum` erlaubt einen festen Wert, damit die
   Probe zweimal dasselbe bekommt. */
const argDatum = process.argv.find((a) => a.startsWith('--datum='));
const DATUM = argDatum ? argDatum.slice(8) : new Date().toISOString().slice(0, 10);

/* ── Was in welche Abteilung gehört ────────────────────────────────────── */

const ABTEILUNGEN = [
  {
    id: 'privat',
    marke: 'Abteilung 1',
    titel: 'Fahrplan Forschungsgelder',
    unter: 'Arbeitspapier — nicht zum Einreichen',
    art: 'privat',
    warnung: 'Diese Abteilung ist das <strong>Arbeitspapier</strong>: Wege, '
      + 'Fristen, Anmeldeschritte und pers&ouml;nliche Abw&auml;gungen. Sie '
      + 'geht niemanden etwas an und steht in <strong>keinem Antrag</strong>. '
      + '&mdash; <strong>&bdquo;Privat&ldquo; hei&szlig;t hier: geh&ouml;rt '
      + 'nicht in die Mappe, die zur Beh&ouml;rde geht.</strong> Es hei&szlig;t '
      + '<em>nicht</em> geheim: der Text liegt als '
      + '<code>docs/FORSCHUNGSFOERDERUNG.md</code> in einem &ouml;ffentlichen '
      + 'Depot, und diese Datei liegt daneben. Die f&uuml;nf pers&ouml;nlichen '
      + 'Angaben (Abschnitt&nbsp;9) stehen absichtlich in keiner von beiden.',
    dateien: ['docs/FORSCHUNGSFOERDERUNG.md'],
  },
  {
    id: 'einreichbar',
    marke: 'Abteilung 2',
    titel: 'Forschungsunterlagen',
    unter: 'Zum Einreichen bei Beh&ouml;rde und Gutachter',
    art: 'einreichbar',
    warnung: 'Diese Abteilung ist so gebaut, dass sie <strong>allein '
      + 'vollst&auml;ndig</strong> ist: eigener Kopf, eigenes Datum, eigene '
      + 'Herkunftsangabe. Wer nur sie in der Hand h&auml;lt, vermisst nichts.',
    dateien: [
      'docs/papers/ENTSTEHUNG.md',
      'docs/papers/PAPER_A_regeln-und-grundsaetze.md',
      'docs/FORSCHUNGSKORPUS.md',
      'docs/papers/PLAN_PAPERS.md',
      'docs/werkstatt/README.md',
      'docs/werkstatt/WERKSTATTREGELN.md',
      'docs/werkstatt/grundsaetze.md',
      'docs/werkstatt/BEFUND.md',
    ],
  },
];

/* Jede Datei bekommt einen Anker. Nur was hier drinsteht, kann ein Verweis
   intern auflösen — alles andere geht auf die volle GitHub-Adresse. */
const ANKER = new Map();
for (const abt of ABTEILUNGEN) {
  for (const pfad of abt.dateien) {
    ANKER.set(pfad, 'q-' + pfad.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase());
  }
}

/* ── Verweise umschreiben ──────────────────────────────────────────────── */

function verweisUmschreiben(quellPfad, ziel) {
  if (/^(https?:|mailto:|#)/.test(ziel)) return ziel;

  const [pfadTeil, ankerTeil] = ziel.split('#');
  if (!pfadTeil) return ziel;

  // relativ zur Quelldatei auflösen
  const basis = dirname(quellPfad);
  const teile = (basis + '/' + pfadTeil).split('/');
  const stapel = [];
  for (const t of teile) {
    if (t === '.' || t === '') continue;
    if (t === '..') { stapel.pop(); continue; }
    stapel.push(t);
  }
  const aufgeloest = stapel.join('/');

  if (ANKER.has(aufgeloest)) return '#' + ANKER.get(aufgeloest);
  return ROH + aufgeloest + (ankerTeil ? '#' + ankerTeil : '');
}

/* ── Eine Quelldatei in HTML ───────────────────────────────────────────── */

function quelleBauen(pfad) {
  const text = readFileSync(resolve(WURZEL, pfad), 'utf-8');
  const rumpf = markdown(text, (u) => verweisUmschreiben(pfad, u));
  const anker = ANKER.get(pfad);
  return '<article class="quelle" id="' + anker + '" data-quelle="' + escape(pfad) + '">\n'
    + '<p class="herkunft">Quelle: <code>' + escape(pfad) + '</code></p>\n'
    + rumpf + '\n</article>';
}

/* ── Inhaltsverzeichnis ────────────────────────────────────────────────── */

function verzeichnis(abt) {
  const punkte = abt.dateien.map((p) =>
    '<li><a href="#' + ANKER.get(p) + '">' + escape(p.replace(/^docs\//, '')) + '</a></li>');
  return '<nav class="verzeichnis"><p>In dieser Abteilung:</p><ul>'
    + punkte.join('') + '</ul></nav>';
}

/* ── Die Abteilung ─────────────────────────────────────────────────────── */

function abteilungBauen(abt) {
  return [
    '<section class="abteilung" id="' + abt.id + '" data-abteilung="' + abt.art + '">',
    '<header class="abt-kopf">',
    '<p class="marke">' + abt.marke + ' &middot; ' + abt.art.toUpperCase() + '</p>',
    '<h1>' + abt.titel + '</h1>',
    '<p class="unter">' + abt.unter + '</p>',
    '<p class="stempel" data-stempel="' + abt.id + '">'
    + 'Klaus Nitzsche &middot; Hamburg &middot; Stand ' + escape(DATUM) + '<br>'
    + 'Herkunft: Depot <em>Sage-Protokol</em>, '
    + '<a href="https://github.com/lausiklauskn-png/Sage-Protokol">'
    + 'github.com/lausiklauskn-png/Sage-Protokol</a><br>'
    + 'Texte CC BY 4.0 &middot; Code und Material MIT'
    + '</p>',
    '<p class="hinweis">' + abt.warnung + '</p>',
    '<div class="knoepfe" data-knoepfe="' + abt.id + '">',
    '<button type="button" data-tun="laden" data-fuer="' + abt.id + '">'
    + '&#11015; Diese Abteilung als HTML herunterladen</button>',
    '<button type="button" data-tun="drucken" data-fuer="' + abt.id + '">'
    + '&#128424; Nur diese Abteilung drucken / als PDF sichern</button>',
    '</div>',
    '<p class="lage" data-lage="' + abt.id + '" role="status"></p>',
    verzeichnis(abt),
    '</header>',
    abt.dateien.map(quelleBauen).join('\n<hr class="quellgrenze">\n'),
    '</section>',
  ].join('\n');
}

/* ── Stil ──────────────────────────────────────────────────────────────── */

const STIL = `
:root{color-scheme:light dark;--grund:#f7f6f3;--tinte:#1b1b1b;--matt:#5a5a5a;
--kante:#d8d5cf;--karte:#fff;--akzent:#7a4b1e;--warn:#8a1c1c;--gruen:#1f5c34}
@media (prefers-color-scheme:dark){:root{--grund:#14161a;--tinte:#e8e6e1;
--matt:#a4a09a;--kante:#2e3238;--karte:#1b1e23;--akzent:#e0a253;--warn:#ff8a80;
--gruen:#7fd6a0}}
*{box-sizing:border-box}
body{margin:0;background:var(--grund);color:var(--tinte);
font:16px/1.65 Georgia,"Times New Roman",serif;padding:0 0 4rem}
.hut{position:sticky;top:0;z-index:5;background:var(--karte);
border-bottom:1px solid var(--kante);padding:.7rem 1rem}
.hut nav{max-width:52rem;margin:0 auto;display:flex;gap:1rem;flex-wrap:wrap;
align-items:baseline;font-family:system-ui,sans-serif;font-size:.85rem}
.hut strong{font-size:.95rem}
.hut a{color:var(--akzent)}
.abteilung{max-width:52rem;margin:0 auto;padding:2rem 1rem 0}
.abt-kopf{border:1px solid var(--kante);background:var(--karte);
border-radius:10px;padding:1.2rem 1.3rem;margin:1.5rem 0 2.5rem}
.marke{font-family:system-ui,sans-serif;font-size:.72rem;letter-spacing:.14em;
color:var(--matt);margin:0 0 .3rem}
.abt-kopf h1{margin:.1rem 0 .2rem;font-size:1.6rem;line-height:1.25}
.unter{margin:0 0 .9rem;color:var(--matt);font-style:italic}
.stempel{font-family:system-ui,sans-serif;font-size:.82rem;line-height:1.6;
color:var(--matt);margin:0 0 .9rem}
.hinweis{font-family:system-ui,sans-serif;font-size:.88rem;
border-left:3px solid var(--akzent);padding:.5rem .8rem;margin:0 0 1rem;
background:color-mix(in srgb,var(--akzent) 8%,transparent)}
[data-abteilung="privat"] .hinweis{border-left-color:var(--warn);
background:color-mix(in srgb,var(--warn) 9%,transparent)}
.knoepfe{display:flex;gap:.6rem;flex-wrap:wrap;margin:0 0 .6rem}
button{font:inherit;font-family:system-ui,sans-serif;font-size:.9rem;
padding:.6rem .9rem;min-height:44px;border:1px solid var(--kante);
border-radius:8px;background:var(--grund);color:var(--tinte);cursor:pointer}
button:hover{border-color:var(--akzent)}
.lage{font-family:system-ui,sans-serif;font-size:.85rem;margin:.2rem 0 .8rem;
min-height:1.2em;color:var(--matt)}
.lage[data-art="fehler"]{color:var(--warn)}
.lage[data-art="gut"]{color:var(--gruen)}
.verzeichnis{font-family:system-ui,sans-serif;font-size:.85rem;
border-top:1px solid var(--kante);padding-top:.7rem;margin-top:.3rem}
.verzeichnis p{margin:0 0 .35rem;color:var(--matt)}
.verzeichnis ul{margin:0;padding-left:1.1rem}
.quelle{margin:0 0 2rem}
.herkunft{font-family:system-ui,sans-serif;font-size:.75rem;color:var(--matt);
margin:0 0 1rem;letter-spacing:.02em}
.quellgrenze{border:0;border-top:2px solid var(--kante);margin:3rem 0}
h1,h2,h3,h4,h5,h6{line-height:1.3;margin:1.9rem 0 .6rem}
.quelle h1{font-size:1.5rem;border-bottom:1px solid var(--kante);
padding-bottom:.3rem}
.quelle h2{font-size:1.25rem}
.quelle h3{font-size:1.08rem}
.quelle h4,.quelle h5,.quelle h6{font-size:1rem}
p{margin:0 0 1rem}
a{color:var(--akzent)}
code{font-family:ui-monospace,"SFMono-Regular",Menlo,monospace;font-size:.88em;
background:color-mix(in srgb,var(--tinte) 8%,transparent);
padding:.1em .3em;border-radius:4px}
pre{background:var(--karte);border:1px solid var(--kante);border-radius:8px;
padding:.9rem;overflow-x:auto}
pre code{background:none;padding:0;font-size:.85rem}
blockquote{margin:1rem 0;padding:.2rem 0 .2rem 1rem;
border-left:3px solid var(--kante);color:var(--matt)}
blockquote strong{color:var(--tinte)}
ul,ol{margin:0 0 1rem;padding-left:1.4rem}
li{margin:.3rem 0}
.haken{font-family:system-ui,sans-serif}
.tabelle{overflow-x:auto;margin:0 0 1.2rem}
table{border-collapse:collapse;width:100%;font-size:.92rem}
th,td{border:1px solid var(--kante);padding:.45rem .6rem;
text-align:left;vertical-align:top}
th{background:var(--karte);font-family:system-ui,sans-serif;font-size:.85rem}
hr{border:0;border-top:1px solid var(--kante);margin:2rem 0}
.fuss{max-width:52rem;margin:3rem auto 0;padding:1rem;
font-family:system-ui,sans-serif;font-size:.8rem;color:var(--matt);
border-top:1px solid var(--kante)}

/* ── Druck ────────────────────────────────────────────────────────────────
   EINE Fassung, zwei Sichten. Die Klasse am <html> blendet aus, was gerade
   nicht gedruckt werden soll. */
html.nur-privat .abteilung:not(#privat){display:none}
html.nur-einreichbar .abteilung:not(#einreichbar){display:none}
@media print{
  .hut,.knoepfe,.lage{display:none}
  body{background:#fff;color:#000;font-size:11pt}
  .abteilung{max-width:none;padding:0}
  .abt-kopf{border:0;padding:0;background:none}
  a{color:#000;text-decoration:underline}
  .quelle{page-break-before:always}
  .abt-kopf+.quelle,.abteilung>.quelle:first-of-type{page-break-before:auto}
  h1,h2,h3{page-break-after:avoid}
  table,pre,blockquote{page-break-inside:avoid}
}
`;

/* ── Verhalten ─────────────────────────────────────────────────────────── */

const SKRIPT = `
(function(){
  "use strict";
  var wurzel = document.documentElement;

  function sagen(id, text, art){
    var n = document.querySelector('[data-lage="' + id + '"]');
    if(!n) return;
    n.textContent = text;
    n.setAttribute("data-art", art || "");
  }

  /* Eine Abteilung allein als HTML — aus DEMSELBEN DOM, nicht aus einer
     zweiten Fassung des Textes. */
  function alleinBauen(id){
    var abt = document.getElementById(id).cloneNode(true);
    var stil = document.getElementById("stil");
    var titel = abt.querySelector("h1").textContent;
    var stempel = abt.querySelector(".stempel").textContent.replace(/\\s+/g," ").trim();

    /* DIE KNÖPFE BLEIBEN HIER. In der herausgenommenen Datei liegt kein
       Skript -- sie wären dort tote Knöpfe mit Beschriftung, und das ist die
       schlimmste Sorte, weil sie aussehen wie Hilfe. Gedruckt wird die
       einzelne Datei über den Browser; darin steht ohnehin nur noch diese
       eine Abteilung. */
    var weg = abt.querySelectorAll(".knoepfe, .lage");
    for (var k = 0; k < weg.length; k++) weg[k].remove();
    return "<!doctype html>\\n<html lang=\\"de\\">\\n<head>\\n"
      + "<meta charset=\\"utf-8\\">\\n"
      + "<meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\">\\n"
      + "<title>" + titel + "</title>\\n"
      + "<!-- " + stempel + " -->\\n"
      + "<style>" + stil.textContent + "</style>\\n</head>\\n<body>\\n"
      + abt.outerHTML
      + "\\n</body>\\n</html>\\n";
  }

  function laden(id){
    var name = "Sage-" + (id === "privat" ? "Fahrplan-Forschungsgelder"
                                          : "Forschungsunterlagen")
             + "-" + document.documentElement.getAttribute("data-stand") + ".html";
    try{
      /* Ein BOM, weil Android beim Öffnen einer heruntergeladenen Datei sonst
         Latin-1 rät und aus jedem Umlaut zwei Zeichen macht. Der MIME-Typ
         überlebt den Weg auf die Platte nicht, die drei Bytes schon. */
      var blob = new Blob(["\\ufeff" + alleinBauen(id)],
        {type:"text/html;charset=utf-8"});
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
      sagen(id, "Heruntergeladen: " + name, "gut");
    }catch(e){
      /* Ein toter Knopf mit Erklärung ist die schlimmste Sorte — er sieht aus
         wie Hilfe. Also den Weg nennen, der bleibt. */
      sagen(id, "Der Download ist hier gesperrt (" + (e && e.name || "Fehler")
        + "). Nimm den Druck-Knopf daneben und sichere als PDF — der geht immer.",
        "fehler");
    }
  }

  function drucken(id){
    var klasse = id === "privat" ? "nur-privat" : "nur-einreichbar";
    wurzel.classList.add(klasse);
    sagen(id, "Im Druck-Fenster steht jetzt nur diese Abteilung.", "gut");
    function zurueck(){
      wurzel.classList.remove(klasse);
      window.removeEventListener("afterprint", zurueck);
    }
    window.addEventListener("afterprint", zurueck);
    try{ window.print(); }
    catch(e){ zurueck(); sagen(id, "Drucken ging nicht: " + e, "fehler"); }
    /* Manche Browser feuern afterprint nicht. Ein Rückfall, damit die Seite
       nicht halbiert stehenbleibt. */
    setTimeout(zurueck, 60000);
  }

  document.addEventListener("click", function(ev){
    var k = ev.target.closest ? ev.target.closest("[data-tun]") : null;
    if(!k) return;
    if(k.getAttribute("data-tun") === "laden") laden(k.getAttribute("data-fuer"));
    else drucken(k.getAttribute("data-fuer"));
  });
})();
`;

/* ── Zusammensetzen ────────────────────────────────────────────────────── */

const seite = `<!doctype html>
<html lang="de" data-stand="${escape(DATUM)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Antragsmappe — Sage-Protokol, Stand ${escape(DATUM)}</title>
<meta name="robots" content="noindex">
<!-- ERZEUGT von tools/antragsmappe-bauen.mjs. NICHT von Hand bearbeiten —
     die Quelle sind die .md-Dateien, hier steht nur ihre Ansicht.
     Neu bauen:  node tools/antragsmappe-bauen.mjs -->
<style id="stil">${STIL}</style>
</head>
<body>
<div class="hut">
  <nav>
    <strong>Antragsmappe</strong>
    <span>Stand ${escape(DATUM)}</span>
    <a href="#privat">1 &middot; Fahrplan (privat)</a>
    <a href="#einreichbar">2 &middot; Forschungsunterlagen (einreichbar)</a>
  </nav>
</div>

${ABTEILUNGEN.map(abteilungBauen).join('\n\n')}

<p class="fuss">
  Eine Datei, zwei Abteilungen. Erzeugt aus den Markdown-Quellen des Depots
  <em>Sage-Protokol</em> am ${escape(DATUM)} durch
  <code>tools/antragsmappe-bauen.mjs</code>. Wer den Inhalt &auml;ndern will,
  &auml;ndert die <code>.md</code>-Datei und baut neu &mdash; nicht diese Datei.
</p>

<script>${SKRIPT}</script>
</body>
</html>
`;

writeFileSync(ZIEL, seite, 'utf-8');

const zeilen = ABTEILUNGEN.reduce((n, a) => n + a.dateien.length, 0);
console.log('geschrieben: docs/antragsmappe.html');
console.log('  Abteilungen: ' + ABTEILUNGEN.length + ' · Quelldateien: ' + zeilen);
console.log('  Stand: ' + DATUM + ' · Größe: ' + Math.round(seite.length / 1024) + ' KB');
