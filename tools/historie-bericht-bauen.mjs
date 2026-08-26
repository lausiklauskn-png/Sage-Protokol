/* historie-bericht-bauen.mjs — macht aus der Auslese ein lesbares Dokument.
 *
 * Aufruf:  node tools/historie-bericht-bauen.mjs
 * Liest:   docs/historie/historie.json   (aus tools/historie-auslesen.mjs)
 * Schreibt: docs/historie/historie.html
 *
 * ── WOZU ───────────────────────────────────────────────────────────────────
 *
 * Klaus am 2026-08-24: „Es geht darum, das Entscheidende hervorzuheben und noch
 * einmal zusammenzufassen, mit wie vielen Punkten, wann und wo. Also sodass man
 * wirklich nachvollziehen kann, dass da was passiert ist zwischen dir und mir."
 * Und: „auch die Rollenverteilung, du als Sitzungs-KI, Agenten, Wächter-Aufgabe
 * und so weiter, mit Erklärung, wer welche Aufgabe hatte und wie er sie erfüllt
 * hat und mit welchem Erfolg oder wachsendem Erfolg."
 *
 * ── DIE EINE ENTSCHEIDUNG, AUF DER ALLES ANDERE STEHT ──────────────────────
 *
 * **Es wird gezählt, nicht erzählt.** Jede Zahl in diesem Bericht kommt aus den
 * Commit-Nachrichten selbst. Kein Satz behauptet einen Fortschritt, den nicht
 * eine Zeile in der Historie belegt. Wo etwas nicht messbar ist, steht das da.
 *
 * Das ist keine Bescheidenheit, sondern der Zweck: das Dokument soll einem
 * Gutachter vorgelegt werden können. Ein Bericht über die eigene Arbeit, der
 * seine Zahlen selbst erfindet, ist wertlos, und zwar auch dann, wenn die
 * Zahlen zufällig stimmen.
 *
 * ── WIE EINGEORDNET WIRD, UND WO DAS UNGENAU IST ──────────────────────────
 *
 * Ein Commit wird an SEINEN WÖRTERN eingeordnet: steht „Gegenprobe" darin, gilt
 * er als Wächter-Arbeit; steht „zurückgenommen" darin, als Selbstkorrektur.
 * Das ist grob, und die Grenze wird im Bericht ausdrücklich benannt: ein Commit,
 * der einen Fehler behebt, ohne es zu sagen, wird nicht gezählt. Die Zahlen sind
 * deshalb eine **Untergrenze**, keine Vollerhebung. Genau so stehen sie da.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARKEN, markenFuer } from './historie-marken.mjs';
import { LUECKE_MIN, VORLAUF_MIN, rechneTage } from './arbeitstage-rechnen.mjs';
/* Das Markier-Werkzeug der Lesefassung. Es haengt sich an DIESELBE Datei, die
   Klaus ohnehin liest, statt eine zweite Fassung der Historie zu erzeugen.
   Zwei Fassungen desselben Textes waeren eine Drift-Quelle mit Ansage. */
import { MARKER_STIL, MARKER_HTML, MARKER_SKRIPT } from './lesefassung-marker.mjs';

const SAGE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(SAGE, 'docs/historie/historie.json');
const ZIEL = resolve(SAGE, 'docs/historie/historie.html');

const d = JSON.parse(readFileSync(QUELLE, 'utf-8'));

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const zahl = (n) => Number(n).toLocaleString('de-DE');

/* Die Einordnung steht in `tools/historie-marken.mjs`, damit Bericht und
   Probe dieselbe benutzen. */

for (const c of d.commits) c.marken = markenFuer(c);

/* ── Monatsverlauf: wächst etwas? ────────────────────────────────────────── */

const monate = new Map();
for (const c of d.commits) {
  const m = c.datum.slice(0, 7);
  if (!monate.has(m)) monate.set(m, {
    monat: m, commits: 0, tage: new Set(), repos: new Set(),
    plus: 0, minus: 0, sackgasse: 0,
    ...Object.fromEntries(MARKEN.map((x) => [x.id, 0])),
  });
  const e = monate.get(m);
  e.commits++;
  e.tage.add(c.datum);
  e.repos.add(c.repo);
  e.plus += c.plus; e.minus += c.minus;
  if (!c.aufMain) e.sackgasse++;
  for (const id of c.marken) e[id]++;
}
const monatsListe = [...monate.values()].sort((a, b) => a.monat.localeCompare(b.monat));

const MONATSNAME = {
  '03': 'März', '04': 'April', '05': 'Mai', '06': 'Juni',
  '07': 'Juli', '08': 'August',
};
const monatName = (m) => (MONATSNAME[m.slice(5)] || m.slice(5)) + ' ' + m.slice(0, 4);

/* ── Tagesverlauf ──────────────────────────────────────────────────────── */

const tage = new Map();
for (const c of d.commits) {
  if (!tage.has(c.datum)) tage.set(c.datum, []);
  tage.get(c.datum).push(c);
}
const tagesListe = [...tage.entries()].sort((a, b) => a[0].localeCompare(b[0]));

/* Ein Arbeitstag: von der ersten bis zur letzten Uhrzeit. Das ist NICHT die
   gearbeitete Zeit, sondern die Spanne, in der Commits fielen. Der Unterschied
   steht im Bericht; eine Spanne als Arbeitszeit auszugeben wäre genau die
   geratene Zahl, gegen die hier seit Monaten angeschrieben wird. */
function spanne(liste) {
  const z = liste.map((c) => c.zeit).sort();
  return { von: z[0], bis: z[z.length - 1] };
}

/* ── Die Rollen ────────────────────────────────────────────────────────── */

const zaehl = (pruef) => d.commits.filter(pruef).length;

const ROLLEN = [
  {
    name: 'Klaus, der Betreiber',
    aufgabe: 'Entscheidet, was gebaut wird, und prüft am eigenen Gerät nach. '
      + 'Er ist kein Programmierer. Sein Beitrag ist nicht Code, sondern der '
      + 'Befund aus der wirklichen Benutzung und das Wort, das eine Regel setzt '
      + 'oder aufhebt.',
    erfuellung: 'Jede Regel dieses Netzes geht auf einen Satz von ihm zurück oder '
      + 'auf einen Schaden, den er gemeldet hat. Der Sichttest am Tablet ist der '
      + 'einzige Weg, auf dem etwas als fertig gilt: headless beweist Logik, '
      + 'nicht wie sich etwas anfühlt.',
    messung: () => zaehl((c) => c.marken.includes('klaus')),
    einheit: 'Commits nennen ihn ausdrücklich',
    grenze: 'Die Zahl ist eine Untergrenze. Sein Einfluss steht in jedem Commit, '
      + 'auch in denen, die ihn nicht namentlich nennen.',
  },
  {
    name: 'Die Sitzung, also ich',
    aufgabe: 'Baut, prüft, schreibt auf und übergibt. Eine Sitzung hat kein '
      + 'Gedächtnis über ihr Ende hinaus; alles, was die nächste wissen muss, '
      + 'muss aufgeschrieben sein. Daraus folgt die halbe Verfassung dieses '
      + 'Netzes.',
    erfuellung: 'Der messbare Teil sind die Commits selbst. Der interessantere '
      + 'Teil sind die Stellen, an denen eine Sitzung eine frühere Aussage '
      + 'zurücknimmt, statt sie stehen zu lassen.',
    messung: () => zaehl((c) => c.marken.includes('selbstkorrektur')),
    einheit: 'Commits nehmen etwas zurück oder stellen richtig',
    grenze: 'Ein Commit, der einen Fehler behebt, ohne es zu sagen, wird nicht '
      + 'gezählt. Die Zahl misst die Offenheit, nicht die Fehlerzahl.',
  },
  {
    name: 'Die Wächter: Proben und Gegenproben',
    aufgabe: 'Der einzige Teil dieses Netzes, der weder Klaus noch die Sitzung '
      + 'ist. Eine Probe prüft eine Zusicherung. Eine Gegenprobe prüft die Probe: '
      + 'sie baut absichtlich Fehler ein und besteht darauf, dass die Probe '
      + 'umfällt. Ein Wächter ohne Gegenprobe ist nur ein grüner Haken.',
    erfuellung: 'Sie haben beide Seiten erwischt. Mehrfach ist eine Gegenprobe '
      + 'nicht über den Code gestolpert, sondern über die Prüfung selbst: sie '
      + 'war blind und hatte nie gemessen, wovon sie handelte.',
    messung: () => zaehl((c) => c.marken.includes('waechter')),
    einheit: 'Commits bauen oder reparieren eine Prüfung',
    grenze: 'Gezählt wird die Erwähnung, nicht die Wirkung. Wie oft eine Probe '
      + 'wirklich etwas gefangen hat, steht nur dort, wo es jemand hingeschrieben '
      + 'hat.',
  },
  {
    name: 'Die Werkstatt-Agenten in Kimhub',
    aufgabe: 'Fünf Rollen mit Namen: Nora schlägt vor, Emil baut, Vera prüft, '
      + 'Sten sucht die Fehler, Jonas schreibt auf. Ein Durchgang heißt Schicht '
      + 'und hat einen Kosten-Deckel. Sie sind der Gegenstand von Paper A und '
      + 'zugleich ein arbeitender Teil des Netzes.',
    erfuellung: 'Sie sind die jüngste Rolle und die am wenigsten belegte. Der '
      + 'erste bezahlte Lauf ist am 2026-08-23 gemessen worden: 0,42 Euro, fünf '
      + 'Aufrufe, vier Minuten. Was eine Schicht kostet, die bis „fertig" '
      + 'durchläuft, ist NICHT gemessen.',
    messung: () => d.commits.filter((c) => c.repo === 'Kimhub').length,
    einheit: 'Commits in Kimhub',
    grenze: 'Die Agenten selbst hinterlassen keine Commits. Gezählt wird die '
      + 'Arbeit AN ihnen, nicht ihre eigene.',
  },
];

/* ── Was wirklich gewachsen ist ────────────────────────────────────────── */

const ersteHaelfte = monatsListe.slice(0, Math.ceil(monatsListe.length / 2));
const zweiteHaelfte = monatsListe.slice(Math.ceil(monatsListe.length / 2));
const summe = (liste, feld) => liste.reduce((n, m) => n + m[feld], 0);
const anteil = (liste, feld) => {
  const c = summe(liste, 'commits');
  return c ? (summe(liste, feld) / c) * 100 : 0;
};

const WACHSTUM = [
  ['waechter', 'Anteil der Commits, die eine Prüfung bauen oder reparieren'],
  ['messung', 'Anteil der Commits, die etwas messen statt behaupten'],
  ['selbstkorrektur', 'Anteil der Commits, die etwas zurücknehmen oder richtigstellen'],
  ['regel', 'Anteil der Commits, die eine Regel oder einen Grundsatz betreffen'],
].map(([id, text]) => ({
  id, text,
  frueh: anteil(ersteHaelfte, id),
  spaet: anteil(zweiteHaelfte, id),
}));

/* ── Die Sackgassen ────────────────────────────────────────────────────── */

const sackgassen = [];
for (const r of d.depots) {
  for (const z of (r.zweigListe || [])) {
    if (z.ref === r.hauptzweig) continue;
    if (!z.eigeneCommits) continue;
    sackgassen.push({ repo: r.name, zweig: z.ref, commits: z.eigeneCommits,
      letzt: z.letzteAenderung });
  }
}
sackgassen.sort((a, b) => b.commits - a.commits || a.repo.localeCompare(b.repo));

/* ── HTML ──────────────────────────────────────────────────────────────── */

function commitZeile(c) {
  const m = c.marken.map((id) => {
    const mk = MARKEN.find((x) => x.id === id);
    return '<span class="mk" data-mk="' + id + '" title="' + esc(mk.name) + '">'
      + esc(mk.name) + '</span>';
  }).join('');
  const koerper = c.koerper
    ? '<details><summary>Nachricht vollständig</summary><pre>'
      + esc(c.koerper) + '</pre></details>'
    : '';
  return '<li class="c" data-marken="' + c.marken.join(' ')
    + '" data-main="' + (c.aufMain ? 'ja' : 'nein') + '">'
    + '<p class="kopf"><span class="zeit">' + esc(c.zeit) + '</span> '
    + '<span class="repo">' + esc(c.repo) + '</span> '
    + '<span class="sha">' + esc(c.sha) + '</span>'
    + (c.aufMain ? '' : '<span class="sack">nur im Zweig'
      + (c.zweige.length ? ': ' + esc(c.zweige.slice(0, 2).join(', ')) : '') + '</span>')
    + (c.istMerge ? '<span class="merge">Merge</span>' : '')
    + '</p>'
    + '<p class="betreff">' + esc(c.betreff) + '</p>'
    + (m ? '<p class="marken">' + m + '</p>' : '')
    + (c.dateien ? '<p class="stat">' + c.dateien + ' Dateien, +' + zahl(c.plus)
      + ' / −' + zahl(c.minus) + '</p>' : '')
    + koerper
    + '</li>';
}

const s = d.summe;

const stil = `
:root{color-scheme:light dark;--grund:#f7f6f3;--tinte:#1b1b1b;--matt:#5a5a5a;
--kante:#d8d5cf;--karte:#fff;--akzent:#7a4b1e}
@media (prefers-color-scheme:dark){:root{--grund:#14161a;--tinte:#e8e6e1;
--matt:#a4a09a;--kante:#2e3238;--karte:#1b1e23;--akzent:#e0a253}}
*{box-sizing:border-box}
body{margin:0;background:var(--grund);color:var(--tinte);
font:16px/1.65 Georgia,"Times New Roman",serif;padding:0 0 5rem}
.wrap{max-width:54rem;margin:0 auto;padding:0 1rem}
h1{font-size:1.9rem;line-height:1.2;margin:2rem 0 .3rem}
h2{font-size:1.4rem;margin:2.6rem 0 .6rem;border-bottom:1px solid var(--kante);
padding-bottom:.3rem}
h3{font-size:1.1rem;margin:1.6rem 0 .4rem}
p{margin:0 0 1rem}
.unter{color:var(--matt);font-style:italic;margin:0 0 1.4rem}
.hut{position:sticky;top:0;z-index:5;background:var(--karte);
border-bottom:1px solid var(--kante);padding:.6rem 1rem;
font-family:system-ui,sans-serif;font-size:.85rem}
.hut .innen{max-width:54rem;margin:0 auto;display:flex;gap:.8rem;flex-wrap:wrap;
align-items:center}
.hut a{color:var(--akzent)}
.zahlen{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));
gap:.7rem;margin:1.2rem 0 2rem}
.kachel{background:var(--karte);border:1px solid var(--kante);border-radius:10px;
padding:.8rem;font-family:system-ui,sans-serif}
.kachel b{display:block;font-size:1.5rem;line-height:1.1}
.kachel span{font-size:.78rem;color:var(--matt)}
table{border-collapse:collapse;width:100%;font-size:.92rem;margin:0 0 1.4rem}
th,td{border:1px solid var(--kante);padding:.42rem .6rem;text-align:left;
vertical-align:top}
th{background:var(--karte);font-family:system-ui,sans-serif;font-size:.85rem}
.tabelle{overflow-x:auto}
.mk{display:inline-block;font-family:system-ui,sans-serif;font-size:.7rem;
padding:.1rem .45rem;border-radius:99px;margin:0 .3rem .25rem 0;
border:1px solid currentColor}
.mk[data-mk="fehler"]{color:#c0392b}
.mk[data-mk="selbstkorrektur"]{color:#8e44ad}
.mk[data-mk="waechter"]{color:#1f7a4d}
.mk[data-mk="regel"]{color:#b8860b}
.mk[data-mk="messung"]{color:#1d6fa5}
.mk[data-mk="klaus"]{color:#7a5230}
.mk[data-mk="sicherheit"]{color:#a5341d}
.tag{margin:2rem 0 0}
.tag>h3{position:sticky;top:2.9rem;background:var(--grund);
padding:.35rem 0;margin:0;font-family:system-ui,sans-serif;font-size:1rem;
border-bottom:1px solid var(--kante);z-index:2}
ul.commits{list-style:none;padding:0;margin:.5rem 0 0}
li.c{border-left:3px solid var(--kante);padding:.5rem 0 .5rem .8rem;
margin:0 0 .7rem;font-family:system-ui,sans-serif;font-size:.88rem}
li.c[data-main="nein"]{border-left-color:#b8860b;border-left-style:dashed}
li.c .kopf{margin:0 0 .15rem;font-size:.75rem;color:var(--matt)}
li.c .zeit{font-variant-numeric:tabular-nums}
li.c .repo{color:var(--akzent)}
li.c .sha{font-family:ui-monospace,monospace}
li.c .sack{margin-left:.5rem;color:#b8860b}
li.c .merge{margin-left:.5rem;color:var(--matt)}
li.c .betreff{margin:0 0 .25rem;font-size:.95rem;color:var(--tinte)}
li.c .stat{margin:.2rem 0 0;font-size:.72rem;color:var(--matt)}
li.c .marken{margin:.25rem 0 0}
details{margin:.3rem 0 0}
summary{cursor:pointer;font-size:.78rem;color:var(--matt)}
pre{white-space:pre-wrap;background:var(--karte);border:1px solid var(--kante);
border-radius:8px;padding:.7rem;font-size:.8rem;overflow-x:auto;
font-family:ui-monospace,monospace}
.grenze{border-left:3px solid var(--akzent);
background:color-mix(in srgb,var(--akzent) 8%,transparent);
padding:.6rem .9rem;margin:0 0 1.2rem}
.filter{display:flex;gap:.4rem;flex-wrap:wrap;margin:.5rem 0 0}
.filter button{font:inherit;font-family:system-ui,sans-serif;font-size:.78rem;
padding:.3rem .6rem;min-height:34px;border:1px solid var(--kante);
border-radius:8px;background:var(--grund);color:var(--tinte);cursor:pointer}
.filter button[aria-pressed="true"]{border-color:var(--akzent);
background:color-mix(in srgb,var(--akzent) 14%,transparent)}
html.f-an li.c{display:none}
html.f-an li.c.treffer{display:block}
html.f-an .tag{display:none}
html.f-an .tag.hatTreffer{display:block}
.balken{display:block;height:.5rem;border-radius:99px;background:var(--kante);
position:relative;overflow:hidden;margin:.2rem 0}
.balken i{display:block;height:100%;background:var(--akzent)}
@media print{.hut,.filter{display:none}body{background:#fff;color:#000}
details{display:none}}
`;

const skript = `
(function(){
  var wurzel=document.documentElement;
  var an=new Set();
  document.addEventListener('click',function(ev){
    var k=ev.target.closest&&ev.target.closest('[data-filter]');
    if(!k)return;
    var f=k.getAttribute('data-filter');
    if(f==='alle'){an.clear();}
    else if(an.has(f)){an.delete(f);}else{an.add(f);}
    for(var b of document.querySelectorAll('[data-filter]')){
      var v=b.getAttribute('data-filter');
      b.setAttribute('aria-pressed', v==='alle' ? (an.size===0?'true':'false') : (an.has(v)?'true':'false'));
    }
    if(an.size===0){wurzel.classList.remove('f-an');
      for(var t of document.querySelectorAll('.tag'))t.classList.remove('hatTreffer');
      return;}
    wurzel.classList.add('f-an');
    for(var t of document.querySelectorAll('.tag')){
      var treffer=0;
      for(var c of t.querySelectorAll('li.c')){
        var mk=(c.getAttribute('data-marken')||'').split(' ');
        var sack=c.getAttribute('data-main')==='nein';
        var passt=false;
        an.forEach(function(f){
          if(f==='sackgasse'){ if(sack) passt=true; }
          else if(mk.indexOf(f)>=0) passt=true;
        });
        c.classList.toggle('treffer',passt);
        if(passt)treffer++;
      }
      t.classList.toggle('hatTreffer',treffer>0);
    }
  });
})();
`;

let html = '\ufeff';   /* BOM: überstimmt jedes Raten der Zeichenkodierung */
html += '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n';
html += '<meta name="viewport" content="width=device-width,initial-scale=1">\n';
html += '<title>Die Historie einer Zusammenarbeit, 10.03. bis 24.08.2026</title>\n';
html += '<meta name="robots" content="noindex">\n';
html += '<!-- ERZEUGT von tools/historie-bericht-bauen.mjs aus '
  + 'docs/historie/historie.json. Nicht von Hand bearbeiten. -->\n';
html += '<style>' + stil + MARKER_STIL + '</style>\n</head>\n'
  + '<body data-blatt="historie" data-modus="lesen" data-lm-wurzel=".wrap">\n';

html += '<div class="hut"><div class="innen"><strong>Historie</strong>'
  + '<a href="#zahlen">Zahlen</a><a href="#arbeitszeit">Arbeitszeit</a>'
  + '<a href="#rollen">Rollen</a>'
  + '<a href="#wachstum">Wachstum</a><a href="#monate">Monate</a>'
  + '<a href="#sackgassen">Sackgassen</a><a href="#verlauf">Voller Verlauf</a>'
  + '</div></div>\n';

html += '<div class="wrap">\n';
html += '<h1>Die Historie einer Zusammenarbeit</h1>\n';
html += '<p class="unter">Klaus Nitzsche und eine KI-Sitzung, '
  + esc(s.erster) + ' bis ' + esc(s.letzter) + '. '
  + 'Erzeugt am ' + esc(d.erzeugt) + ' aus den Git-Historien von '
  + s.depots + ' Depots.</p>\n';

html += '<div class="grenze"><p><strong>Wie dieses Dokument entstanden ist, und '
  + 'was es nicht kann.</strong> Jede Zahl darin kommt aus den Commit-Nachrichten '
  + 'selbst, keine ist geschätzt. Die Einordnung eines Commits geschieht an '
  + 'seinen Wörtern: steht „Gegenprobe" darin, gilt er als Wächter-Arbeit. Das '
  + 'ist grob. Ein Commit, der einen Fehler behebt, ohne es zu sagen, wird nicht '
  + 'gezählt. <strong>Alle Zahlen zu den Marken sind deshalb Untergrenzen, keine '
  + 'Vollerhebung.</strong></p>'
  + '<p>Achtzehn der dreiunddreißig Klone waren <em>flach</em> und trugen nur die '
  + 'letzten fünfzig Commits. Sie wurden vorher vervollständigt. Ohne diesen '
  + 'Schritt hätte hier eine viel kleinere Zahl gestanden, die genauso '
  + 'überzeugend ausgesehen hätte.</p></div>\n';

/* ── Zahlen ── */
html += '<h2 id="zahlen">Die Zahlen</h2>\n<div class="zahlen">\n';
for (const [wert, text] of [
  [zahl(s.commits), 'Commits'],
  [zahl(s.depots), 'Depots'],
  [zahl(s.zweige), 'Zweige'],
  [zahl(s.arbeitstage), 'Tage mit Arbeit'],
  [zahl(s.zeilenPlus), 'Zeilen dazu'],
  [zahl(s.zeilenMinus), 'Zeilen entfernt'],
  [zahl(s.nurImZweig), 'Commits nie auf main'],
  [zahl(s.merges), 'Merges'],
]) html += '<div class="kachel"><b>' + wert + '</b><span>' + text + '</span></div>\n';
html += '</div>\n';

html += '<p>Der Zeitraum umfasst ' + zahl(
  Math.round((new Date(s.letzter) - new Date(s.erster)) / 86400000)
) + ' Kalendertage. An ' + zahl(s.arbeitstage) + ' davon fiel mindestens ein '
  + 'Commit, das sind ' + Math.round(s.arbeitstage / ((new Date(s.letzter)
  - new Date(s.erster)) / 86400000) * 100) + ' Prozent aller Tage.</p>\n';

html += '<p><strong>Was die Zahl der Arbeitstage nicht sagt.</strong> Ein Tag '
  + 'zählt, sobald ein Commit darauf fällt. Wie lange gearbeitet wurde, steht '
  + 'darin nicht. Die Spanne zwischen dem ersten und dem letzten Commit eines '
  + 'Tages steht weiter unten bei jedem Tag, aber sie ist eine Spanne und keine '
  + 'Arbeitszeit. Eine Spanne als Arbeitszeit auszugeben wäre genau die geratene '
  + 'Zahl, gegen die in diesem Netz seit Monaten angeschrieben wird.</p>\n';

/* ── Marken ── */
/* ── Die Arbeitszeit ────────────────────────────────────────────────────────
   Gerechnet mit DERSELBEN Quelle wie das Blatt `arbeitstage.html`
   (`tools/arbeitstage-rechnen.mjs`). Zwei Fassungen der Rechnung würden
   irgendwann verschiedene Zahlen zeigen, und beide wären grün. */
{
  const az = rechneTage(d.commits).summe;
  const mit = rechneTage(d.commits, { automatikZaehlt: true }).summe;
  const st = (n) => n.toFixed(1).replace('.', ',');

  html += '<h2 id="arbeitszeit">Die Arbeitszeit</h2>\n';
  html += '<p>Aus den Zeitstempeln lässt sich mehr ablesen als die Zahl der '
    + 'Tage. Ein Eintrag trägt die Uhrzeit, die das System beim Speichern '
    + 'selbst vergibt; daraus ergibt sich, wann an einem Tag zuerst und '
    + 'zuletzt etwas abgelegt wurde.</p>\n';
  html += '<div class="zahlen">'
    + '<div><b>' + zahl(az.arbeitstage) + '</b><span>Tage mit Arbeit</span></div>'
    + '<div><b>' + st(az.spanne) + ' h</b><span>Spanne, aufsummiert</span></div>'
    + '<div><b>' + st(az.aktiv) + ' h</b><span>aktive Zeit, ohne Pausen</span></div>'
    + '<div><b>' + st(az.spanne / az.arbeitstage) + ' h</b><span>Spanne je Tag</span></div>'
    + '</div>\n';
  html += '<p><strong>Spanne</strong> ist der Abstand vom ersten bis zum letzten '
    + 'Eintrag desselben Tages, Pausen eingeschlossen. <strong>Aktive Zeit</strong> '
    + 'rechnet sie heraus: Abstände bis ' + LUECKE_MIN + ' Minuten zählen mit, '
    + 'längere gelten als Unterbrechung, und jeder Abschnitt bekommt '
    + VORLAUF_MIN + ' Minuten Vorlauf.</p>\n';
  html += '<p data-az-automatik>' + zahl(az.automatik) + ' Einträge stammen von '
    + 'einem zeitgesteuerten Dienst und sind herausgerechnet. Ohne diese '
    + 'Bereinigung stünden hier ' + st(mit.spanne - az.spanne)
    + ' Stunden zu viel.</p>\n';
  html += '<p data-az-untergrenze>Beide Werte sind eher zu niedrig als zu hoch. '
    + 'Lesen, Prüfen, Besprechen und jeder verworfene Versuch hinterlassen '
    + 'keinen Eintrag, und vor dem ersten wie nach dem letzten Eintrag eines '
    + 'Tages ist gearbeitet worden.</p>\n';
  html += '<p data-az-blatt>Jeder Tag einzeln, mit allen Tätigkeiten, steht in '
    + '<a href="arbeitstage.html">arbeitstage.html</a>. Daneben liegen '
    + '<a href="arbeitstage.pdf">arbeitstage.pdf</a> zum Ausdrucken sowie '
    + '<a href="arbeitstage-tage.csv">arbeitstage-tage.csv</a> und '
    + '<a href="arbeitstage-taetigkeiten.csv">arbeitstage-taetigkeiten.csv</a> '
    + 'für die Tabellenkalkulation.</p>\n';
}

html += '<h2 id="marken">Woran etwas erkannt wird</h2>\n';
html += '<p>Sieben Marken. Jede hat Wörter, an denen sie erkannt wird, und die '
  + 'stehen hier, damit ein Leser die Einordnung nachprüfen und ihr '
  + 'widersprechen kann.</p>\n<div class="tabelle"><table>\n';
html += '<tr><th>Marke</th><th>Was sie bedeutet</th><th>Commits</th></tr>\n';
for (const m of MARKEN) {
  const n = d.commits.filter((c) => c.marken.includes(m.id)).length;
  html += '<tr><td><span class="mk" data-mk="' + m.id + '">' + esc(m.name)
    + '</span></td><td>' + esc(m.was) + '</td><td>' + zahl(n) + ' <span style="color:var(--matt)">('
    + Math.round(n / s.commits * 100) + ' %)</span></td></tr>\n';
}
html += '</table></div>\n';

/* ── Rollen ── */
html += '<h2 id="rollen">Wer welche Aufgabe hatte</h2>\n';
html += '<p>Vier Rollen, und sie sind nicht gleichartig. Zwei sind Personen '
  + 'beziehungsweise Programme, die handeln. Eine ist ein Mechanismus, der '
  + 'weder das eine noch das andere ist und genau deshalb beide erwischt. Die '
  + 'vierte ist die jüngste und am wenigsten belegte.</p>\n';
for (const r of ROLLEN) {
  html += '<h3>' + esc(r.name) + '</h3>\n';
  html += '<p><strong>Aufgabe.</strong> ' + esc(r.aufgabe) + '</p>\n';
  html += '<p><strong>Wie sie erfüllt wurde.</strong> ' + esc(r.erfuellung) + '</p>\n';
  html += '<p><strong>Gemessen:</strong> ' + zahl(r.messung()) + ' ' + esc(r.einheit)
    + '. <span style="color:var(--matt)">' + esc(r.grenze) + '</span></p>\n';
}

/* ── Wachstum ── */
html += '<h2 id="wachstum">Ob etwas gewachsen ist</h2>\n';
html += '<p>Klaus hat ausdrücklich nach dem <em>wachsenden</em> Erfolg gefragt. '
  + 'Verglichen wird die erste Hälfte des Zeitraums (' + esc(monatName(ersteHaelfte[0].monat))
  + ' bis ' + esc(monatName(ersteHaelfte[ersteHaelfte.length - 1].monat))
  + ') mit der zweiten (' + esc(monatName(zweiteHaelfte[0].monat)) + ' bis '
  + esc(monatName(zweiteHaelfte[zweiteHaelfte.length - 1].monat)) + '). '
  + 'Gezählt wird jeweils der Anteil an allen Commits der Hälfte, nicht die '
  + 'nackte Zahl: sonst würde nur gemessen, dass später mehr passiert ist.</p>\n';
html += '<div class="tabelle"><table>\n<tr><th>Was</th><th>erste Hälfte</th>'
  + '<th>zweite Hälfte</th><th>Richtung</th></tr>\n';
for (const w of WACHSTUM) {
  const richtung = w.spaet > w.frueh * 1.1 ? 'gewachsen'
    : (w.spaet < w.frueh * 0.9 ? 'gefallen' : 'gleich geblieben');
  html += '<tr><td>' + esc(w.text) + '</td><td>' + w.frueh.toFixed(1) + ' %</td><td>'
    + w.spaet.toFixed(1) + ' %</td><td>' + richtung + '</td></tr>\n';
}
html += '</table></div>\n';
html += '<p><strong>Was diese Tabelle nicht beweist.</strong> Sie zählt Wörter in '
  + 'Commit-Nachrichten. Ein gewachsener Anteil kann heißen, dass mehr geprüft '
  + 'wurde, oder dass ausführlicher darüber geschrieben wurde. Beides ist eine '
  + 'Veränderung, aber nicht dieselbe. Wer die Zahlen als Beleg nimmt, nimmt sie '
  + 'als Beleg für die Aufmerksamkeit, nicht für die Arbeit.</p>\n';

/* ── Monate ── */
html += '<h2 id="monate">Der Verlauf nach Monaten</h2>\n<div class="tabelle"><table>\n';
html += '<tr><th>Monat</th><th>Commits</th><th>Tage</th><th>Depots</th>'
  + '<th>Zeilen dazu</th><th>Fehler</th><th>Wächter</th><th>Regeln</th>'
  + '<th>gemessen</th><th>nie auf main</th></tr>\n';
for (const m of monatsListe) {
  html += '<tr><td>' + esc(monatName(m.monat)) + '</td><td>' + zahl(m.commits)
    + '</td><td>' + m.tage.size + '</td><td>' + m.repos.size + '</td><td>'
    + zahl(m.plus) + '</td><td>' + zahl(m.fehler) + '</td><td>' + zahl(m.waechter)
    + '</td><td>' + zahl(m.regel) + '</td><td>' + zahl(m.messung) + '</td><td>'
    + zahl(m.sackgasse) + '</td></tr>\n';
}
html += '</table></div>\n';

/* ── Depots ── */
html += '<h2 id="depots">Die Depots, auch die stillgelegten</h2>\n';
html += '<p>Klaus: <em>„Auch der Repos, die wir zwischendurch bauen wollten, wo '
  + 'mir Gedankensprünge gekommen sind. […] Wir haben auch Repos gemacht, die '
  + 'sinnlos waren. Gehört aber alles dazu."</em> Sie stehen deshalb alle hier, '
  + 'auch die mit vier Commits.</p>\n<div class="tabelle"><table>\n';
html += '<tr><th>Depot</th><th>Commits</th><th>Zweige</th><th>Arbeitstage</th>'
  + '<th>erster Tag</th><th>letzter Tag</th></tr>\n';
for (const r of [...d.depots].sort((a, b) => b.commits - a.commits)) {
  html += '<tr><td>' + esc(r.name) + '</td><td>' + zahl(r.commits) + '</td><td>'
    + zahl(r.zweige) + '</td><td>' + r.arbeitstage + '</td><td>' + esc(r.erst)
    + '</td><td>' + esc(r.letzt) + '</td></tr>\n';
}
html += '</table></div>\n';

/* ── Sackgassen ── */
html += '<h2 id="sackgassen">Die Sackgassen</h2>\n';
html += '<p><strong>' + zahl(s.nurImZweig) + ' Commits liegen in einem Zweig und '
  + 'nie auf <code>main</code>.</strong> Das ist Arbeit, die gemacht wurde und '
  + 'nicht angekommen ist: verworfene Wege, doppelte Anläufe, Versuche, die sich '
  + 'als falsch erwiesen. Sie gehören in diese Dokumentation, weil auch sie Zeit '
  + 'gekostet und etwas gelehrt haben. Die ' + Math.min(60, sackgassen.length)
  + ' größten:</p>\n<div class="tabelle"><table>\n';
html += '<tr><th>Depot</th><th>Zweig</th><th>eigene Commits</th><th>zuletzt</th></tr>\n';
for (const z of sackgassen.slice(0, 60)) {
  html += '<tr><td>' + esc(z.repo) + '</td><td><code>' + esc(z.zweig)
    + '</code></td><td>' + zahl(z.commits) + '</td><td>' + esc(z.letzt)
    + '</td></tr>\n';
}
html += '</table></div>\n';
html += '<p>Insgesamt ' + zahl(sackgassen.length) + ' Zweige mit eigener Arbeit. '
  + '<strong>Ein Zweig ohne eigene Commits ist keine Sackgasse</strong>, sondern '
  + 'ein Zweig, dessen Arbeit gemergt wurde; die stehen hier nicht.</p>\n';

/* ── Voller Verlauf ── */
html += '<h2 id="verlauf">Der volle Verlauf, Tag für Tag</h2>\n';
html += '<p>Alle ' + zahl(s.commits) + ' Commits, nach Tag geordnet, mit Uhrzeit. '
  + 'Ein gestrichelter Rand heißt: dieser Commit liegt nicht auf <code>main</code>. '
  + 'Die Knöpfe filtern.</p>\n';
html += '<div class="filter">';
html += '<button type="button" data-filter="alle" aria-pressed="true">alles zeigen</button>';
for (const m of MARKEN) html += '<button type="button" data-filter="' + m.id
  + '" aria-pressed="false">' + esc(m.name) + '</button>';
html += '<button type="button" data-filter="sackgasse" aria-pressed="false">nur Sackgassen</button>';
html += '</div>\n';

for (const [tag, liste] of tagesListe) {
  const sp = spanne(liste);
  html += '<div class="tag"><h3>' + esc(tag) + ' · ' + liste.length
    + ' Commits · ' + esc(sp.von) + ' bis ' + esc(sp.bis) + '</h3>\n<ul class="commits">\n';
  for (const c of liste) html += commitZeile(c) + '\n';
  html += '</ul></div>\n';
}

html += '<h2>Herkunft</h2>\n';
html += '<p>Erzeugt am ' + esc(d.erzeugt) + ' von <code>tools/historie-bericht-bauen.mjs</code> '
  + 'aus <code>docs/historie/historie.json</code>, das '
  + '<code>tools/historie-auslesen.mjs</code> aus den Git-Historien gelesen hat. '
  + 'Nur gelesen: kein Commit, kein Zweig, kein Push in einem fremden Depot. '
  + 'Wer den Bericht ändern will, ändert das Werkzeug und baut neu.</p>\n';

html += '</div>\n' + MARKER_HTML + '\n<script>' + skript + '</script>\n'
  + '<script>' + MARKER_SKRIPT + '</script>\n</body>\n</html>\n';

writeFileSync(ZIEL, html, 'utf-8');
console.log('geschrieben: docs/historie/historie.html ('
  + Math.round(html.length / 1024) + ' KB)');
console.log('  ' + zahl(s.commits) + ' Commits an ' + zahl(s.arbeitstage) + ' Tagen');
for (const m of MARKEN) {
  const n = d.commits.filter((c) => c.marken.includes(m.id)).length;
  console.log('  ' + m.name.padEnd(34) + String(zahl(n)).padStart(6));
}
