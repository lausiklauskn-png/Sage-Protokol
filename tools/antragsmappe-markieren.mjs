/* antragsmappe-markieren.mjs — die Markier-Schicht der Antragsmappe.
 *
 * Klaus zieht mit Maus oder Finger über eine Stelle, wählt eine Farbe, und
 * kann die Markierungen später als Liste auslesen und in den Chat geben.
 * Damit sieht eine Folge-Sitzung, WO etwas verbessert werden soll — statt es
 * aus einer 240-KB-Datei erraten zu müssen.
 *
 * ── DREI ENTSCHEIDUNGEN, JEDE MIT GRUND ────────────────────────────────────
 *
 * 1 · MARKIERUNGEN WERDEN NIE GEDRUCKT UND NIE MITGELADEN.
 *     Das ist kein Schönheitsschritt, sondern der eigentliche Riegel: die
 *     Einreich-Abteilung geht zur Behörde. Wer sie mit „das muss geändert
 *     werden"-Streifen ausdruckt oder herunterlädt, schickt seine eigenen
 *     Zweifel mit. Der Ausdruck der Markierungen ist die AUSLESE-LISTE — die
 *     ist ohnehin brauchbarer als ein bunt gestreiftes Dokument.
 *
 * 2 · GEANKERT WIRD AM TEXT, NICHT AN DER STELLE IM DOKUMENT.
 *     Die Mappe wird neu gebaut, sobald sich eine `.md` ändert. Eine
 *     Markierung, die an „Absatz 412" hinge, säße danach woanders — und
 *     zwar lautlos. Gespeichert wird deshalb: Quelldatei · der markierte
 *     Text · das wievielte Vorkommen. Findet sich das nach einem Neubau
 *     nicht mehr, heißt die Markierung **verwaist** und wird als solche
 *     gemeldet. Eine Markierung, die stillschweigend verschwindet, ist
 *     schlimmer als eine, die fehlt.
 *
 * 3 · DER SPEICHER KANN VERSAGEN, UND DANN WIRD ES GESAGT.
 *     `localStorage` wirft im privaten Fenster und bei gesperrten
 *     Seitendaten. Wer fünfzig Stellen markiert und es erst beim nächsten
 *     Öffnen merkt, hat die Arbeit umsonst gemacht. Jeder Schreibversuch
 *     wird geprüft, und die Tafel sagt beim ersten Fehlschlag Bescheid.
 *
 * Der Speicher hängt am Browser: was auf dem Tablet markiert wurde, steht
 * nicht in DeX. Das steht auch auf der Tafel — es ist genau die Falle, die in
 * Kimhub am 2026-08-23 zugeschnappt ist.
 */

/* ── Stil ──────────────────────────────────────────────────────────────── */

export const MK_STIL = `
/* Die drei Farben setzen Grund UND Schrift. Damit lesen sie sich in hell
   und dunkel gleich — eine helle Fläche ohne gesetzte Schriftfarbe wäre im
   dunklen Thema weiße Schrift auf hellem Grund. */
mark.mk{background:#b7f0c2;color:#10331a;border-radius:3px;
padding:.06em .05em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
mark.mk[data-farbe="gelb"]{background:#fdedb0;color:#3a2f05}
mark.mk[data-farbe="rot"]{background:#ffc4bd;color:#45120c}
mark.mk[data-notiz]{box-shadow:inset 0 -2px 0 rgba(0,0,0,.45)}

.mk-leiste{position:fixed;z-index:30;display:none;gap:.3rem;padding:.35rem;
background:var(--karte);border:1px solid var(--kante);border-radius:12px;
box-shadow:0 8px 24px rgba(0,0,0,.3)}
.mk-leiste[data-offen="ja"]{display:flex}
.mk-leiste{flex-wrap:wrap;max-width:min(94vw,30rem)}
/* Der Farbtupfen ist eine CSS-Flaeche, KEIN Emoji. Ein Emoji haengt an der
   Schrift des Geraets -- fehlt sie, steht dort ein Kaestchen oder nichts,
   und die Leiste zeigt nur noch Zahlen. Genau das ist Klaus am 2026-08-24
   passiert. Eine Farbe, die die Bedeutung traegt, wird gezeichnet, nicht
   geschrieben -- und daneben steht das Wort. */
.mk-tupf{display:inline-block;width:.85em;height:.85em;border-radius:3px;
vertical-align:-.08em;background:#b7f0c2;border:1px solid rgba(0,0,0,.3)}
.mk-tupf[data-f="gelb"]{background:#fdedb0}
.mk-tupf[data-f="rot"]{background:#ffc4bd}
.mk-leiste button{min-width:46px;min-height:46px;padding:.3rem;font-size:1.15rem;
line-height:1;border-radius:9px}
.mk-leiste button[data-mk-tun="weg"]{font-size:.95rem}

.mk-tafel{position:fixed;left:0;right:0;bottom:0;z-index:31;display:none;
max-height:min(82vh,700px);overflow:auto;background:var(--karte);
border-top:2px solid var(--akzent);padding:1rem 1rem 2rem;
font-family:system-ui,sans-serif;font-size:.9rem;
box-shadow:0 -8px 28px rgba(0,0,0,.3)}
.mk-tafel[data-offen="ja"]{display:block}
.mk-tafel .innen{max-width:52rem;margin:0 auto}
.mk-tafel h2{margin:0 0 .2rem;font-size:1.15rem;font-family:inherit}
.mk-tafel p{margin:0 0 .7rem}
.mk-tafel .zaehler{font-size:1rem;margin:0 0 .8rem}
.mk-tafel ul{list-style:none;padding:0;margin:0 0 1rem}
.mk-tafel li{border-top:1px solid var(--kante);padding:.5rem 0}
.mk-tafel .stelle{cursor:pointer;background:none;border:0;color:inherit;
font:inherit;text-align:left;padding:0;min-height:0}
.mk-tafel .stelle:hover{color:var(--akzent)}
.mk-tafel .woher{color:var(--matt);font-size:.78rem;margin:.15rem 0 0}
.mk-tafel .notiz{color:var(--matt);font-style:italic;margin:.15rem 0 0}
.mk-warn{border-left:3px solid var(--warn);
background:color-mix(in srgb,var(--warn) 10%,transparent);
padding:.5rem .8rem;margin:0 0 .8rem}
.mk-leer{color:var(--matt)}
.mk-legende{list-style:none;padding:0;margin:0 0 .5rem}
.mk-legende li{border:0;padding:.15rem 0}
.mk-grundsatz{border-left:3px solid var(--akzent);padding:.35rem .7rem;
background:color-mix(in srgb,var(--akzent) 8%,transparent);margin:0 0 .8rem}
.hut button{font:inherit;font-family:system-ui,sans-serif;font-size:.85rem;
padding:.35rem .6rem;min-height:34px;border:1px solid var(--kante);
border-radius:8px;background:var(--grund);color:var(--tinte);cursor:pointer}
.hut button:hover{border-color:var(--akzent)}
`;

/* Der Druck-Riegel steht bewusst NICHT beim übrigen Druck-Block, sondern
   hier bei der Sache, die er schützt. Wer die Markierungen anfasst, sieht
   ihn. `mark` bekommt Grund und Schrift zurückgesetzt, nicht nur die
   Farbe — sonst bliebe im Ausdruck ein grauer Streifen stehen. */
export const MK_DRUCK = `
  .mk-leiste,.mk-tafel{display:none !important}
  mark.mk{background:none !important;color:inherit !important;
    box-shadow:none !important;padding:0 !important}
`;

/* ── Markup ────────────────────────────────────────────────────────────── */

/* Beides steht AUSSERHALB der Abteilungen. `alleinBauen` klont nur die
   Abteilung — damit kann weder die Leiste noch die Tafel je in einer
   herausgenommenen Datei landen. */
export const MK_HTML = `
<div class="mk-leiste" data-mk-leiste role="toolbar" aria-label="Markieren">
  <button type="button" data-mk-tun="gruen"><span class="mk-tupf" data-f="gruen"></span> bleibt</button>
  <button type="button" data-mk-tun="gelb"><span class="mk-tupf" data-f="gelb"></span> du entscheidest</button>
  <button type="button" data-mk-tun="rot"><span class="mk-tupf" data-f="rot"></span> kann weg</button>
  <button type="button" data-mk-tun="notiz">&#9998; Notiz</button>
  <button type="button" data-mk-tun="weg">&#10005; zur&uuml;ck</button>
</div>

<div class="mk-tafel" data-mk-tafel aria-label="Markierungen">
  <div class="innen">
    <h2>Markierungen</h2>
    <p class="zaehler" data-mk-zaehler>noch keine</p>
    <ul class="mk-legende" data-mk-legende>
      <li><span class="mk-tupf" data-f="gruen"></span> <strong>bleibt</strong>, soll bleiben</li>
      <li><span class="mk-tupf" data-f="gelb"></span> <strong>du entscheidest</strong>, kann bleiben oder weg, Claude wägt ab</li>
      <li><span class="mk-tupf" data-f="rot"></span> <strong>kann weg</strong>, kann komplett gestrichen werden</li>
    </ul>
    <p class="mk-grundsatz">Im Zweifel <strong>bleiben</strong>. Lieber bleiben als weg.</p>
    <div data-mk-warnung hidden></div>
    <p>
      <button type="button" data-mk-tun="datei">&#11015; Als Datei sichern</button>
      <button type="button" data-mk-tun="ablage">&#128203; In die Zwischenablage</button>
      <button type="button" data-mk-tun="aus">Markieren ausschalten</button>
      <button type="button" data-mk-tun="zu">Schließen</button>
    </p>
    <p class="lage" data-mk-lage role="status"></p>
    <div data-mk-liste></div>
    <p class="woher">
      Markierungen werden <strong>nie gedruckt und nie mitgeladen</strong>.
      Die Einreich-Abteilung geht zur Behörde, und dorthin gehören keine
      eigenen Zweifel. Wer sie auf Papier braucht, druckt die ausgelesene
      Liste. Sie liegen im Speicher <em>dieses</em> Browsers: was auf dem
      Tablet markiert wurde, steht in DeX nicht.
    </p>
  </div>
</div>
`;

/* ── Verhalten ─────────────────────────────────────────────────────────── */

export const MK_SKRIPT = String.raw`
(function(){
  "use strict";

  var SCHLUESSEL = "sage-antragsmappe-markierungen-v1";
  /* KLAUS 2026-08-24: es geht ums KUERZEN, nicht ums Verbessern.
     "Rot kann komplett weg, Gelb kann bleiben oder auch weg -- entscheidest
     du mit, Gruen soll bleiben. Lieber bleiben als weg."
     Die Schluessel heissen weiter gruen/gelb/rot -- vorhandene Markierungen
     behalten damit ihre Farbe, nur die Beschriftung wechselt. */
  var FARBEN = {
    gruen: { wort: "bleibt",         sinn: "soll bleiben" },
    gelb:  { wort: "du entscheidest", sinn: "kann bleiben oder weg -- abwaegen" },
    rot:   { wort: "kann weg",       sinn: "kann komplett weg" }
  };
  var GRUNDSATZ = "Im Zweifel BLEIBEN. Klaus: „lieber bleiben als weg.\u201C";

  var leiste  = document.querySelector("[data-mk-leiste]");
  var tafel   = document.querySelector("[data-mk-tafel]");
  var zaehler = document.querySelector("[data-mk-zaehler]");
  var listeN  = document.querySelector("[data-mk-liste]");
  var warnN   = document.querySelector("[data-mk-warnung]");
  var lageN   = document.querySelector("[data-mk-lage]");
  var knopfN  = document.querySelector("[data-mk-knopf]");
  if(!leiste || !tafel) return;

  var marken = [];          // was gespeichert ist
  var verwaist = [];        // was sich nach einem Neubau nicht mehr fand
  var speicherGeht = true;  // wird beim ersten Fehlschlag falsch
  var an = true;            // Markieren eingeschaltet?
  var gewaehlt = null;      // Markierung unter dem Zeiger (fuer Notiz/Weg)

  /* ── Speicher ───────────────────────────────────────────────────────── */

  function lesen(){
    try{
      var roh = window.localStorage.getItem(SCHLUESSEL);
      var d = roh ? JSON.parse(roh) : {};
      if(Array.isArray(d)) return { marken: d, an: true };
      return { marken: Array.isArray(d.marken) ? d.marken : [], an: d.an !== false };
    }catch(e){ speicherGeht = false; return { marken: [], an: true }; }
  }

  function schreiben(){
    try{
      window.localStorage.setItem(SCHLUESSEL, JSON.stringify({ marken: marken, an: an }));
      return true;
    }catch(e){ speicherGeht = false; return false; }
  }

  /* ── Text-Karte: normalisierter Text plus Rueckweg in den DOM ────────── */

  function norm(t){ return String(t).replace(/\s+/g, " ").trim(); }

  function karte(wurzel){
    var s = "", stellen = [], leer = true;
    var lauf = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT, null);
    var n;
    while((n = lauf.nextNode())){
      var t = n.nodeValue;
      for(var i = 0; i < t.length; i++){
        var c = t.charAt(i);
        if(c === " " || c === "\n" || c === "\t" || c === "\r"){
          if(leer) continue;
          s += " "; stellen.push([n, i]); leer = true;
        }else{
          s += c; stellen.push([n, i]); leer = false;
        }
      }
    }
    /* Ein abschliessendes Leerzeichen wuerde die Zeichenzaehlung gegen die
       getrimmte Suche verschieben. */
    while(s.charAt(s.length - 1) === " "){ s = s.slice(0, -1); stellen.pop(); }
    var vorn = 0;
    while(s.charAt(vorn) === " ") vorn++;
    if(vorn){ s = s.slice(vorn); stellen = stellen.slice(vorn); }
    return { text: s, stellen: stellen };
  }

  function inMarke(k){
    var e = (k && k.nodeType === 3) ? k.parentElement : k;
    return !!(e && e.closest && e.closest("mark.mk"));
  }

  /* ── Eine Markierung in den Text legen ───────────────────────────────── */

  function umhuellen(r, m){
    var oben = r.commonAncestorContainer;
    if(oben.nodeType === 3) oben = oben.parentNode;
    var stuecke = [], lauf = document.createTreeWalker(oben, NodeFilter.SHOW_TEXT, null), n;
    while((n = lauf.nextNode())){
      if(!r.intersectsNode(n)) continue;
      var von = (n === r.startContainer) ? r.startOffset : 0;
      var bis = (n === r.endContainer) ? r.endOffset : n.nodeValue.length;
      if(bis > von) stuecke.push([n, von, bis]);
    }
    if(!stuecke.length) return false;
    for(var i = 0; i < stuecke.length; i++){
      var kn = stuecke[i][0], v = stuecke[i][1], b = stuecke[i][2];
      if(b < kn.nodeValue.length) kn.splitText(b);
      var ziel = (v > 0) ? kn.splitText(v) : kn;
      var mk = document.createElement("mark");
      mk.className = "mk";
      mk.setAttribute("data-farbe", m.farbe);
      mk.setAttribute("data-mk", m.id);
      if(m.notiz) mk.setAttribute("data-notiz", "1");
      mk.title = FARBEN[m.farbe].wort + (m.notiz ? " — " + m.notiz : "");
      ziel.parentNode.insertBefore(mk, ziel);
      mk.appendChild(ziel);
    }
    return true;
  }

  function anwenden(m){
    var art = document.querySelector('[data-quelle="' + m.quelle + '"]');
    if(!art) return false;
    var k = karte(art);
    var suche = norm(m.text);
    if(!suche) return false;
    var pos = -1;
    for(var j = 0; j <= (m.nth || 0); j++){
      pos = k.text.indexOf(suche, pos + 1);
      if(pos < 0) return false;
    }
    var a = k.stellen[pos], e = k.stellen[pos + suche.length - 1];
    if(!a || !e) return false;
    if(inMarke(a[0]) || inMarke(e[0])) return false;
    var r = document.createRange();
    try{
      r.setStart(a[0], a[1]);
      r.setEnd(e[0], e[1] + 1);
    }catch(err){ return false; }
    return umhuellen(r, m);
  }

  function abnehmen(id){
    var alle = document.querySelectorAll('mark.mk[data-mk="' + id + '"]');
    for(var i = 0; i < alle.length; i++){
      var mk = alle[i], el = mk.parentNode;
      while(mk.firstChild) el.insertBefore(mk.firstChild, mk);
      el.removeChild(mk);
      el.normalize();
    }
  }

  /* ── Aus der Auswahl eine Markierung machen ──────────────────────────── */

  function quelleVon(k){
    var e = (k && k.nodeType === 3) ? k.parentElement : k;
    return (e && e.closest) ? e.closest("[data-quelle]") : null;
  }

  function ausAuswahl(farbe){
    var sel = window.getSelection();
    if(!sel || sel.isCollapsed || !sel.rangeCount) return "leer";
    var r = sel.getRangeAt(0);
    var art = quelleVon(r.startContainer);
    if(!art) return "ausserhalb";
    if(quelleVon(r.endContainer) !== art) return "zweiquellen";
    if(inMarke(r.startContainer) || inMarke(r.endContainer)) return "ueberschneidung";

    var text = norm(r.toString());
    if(!text) return "leer";

    var vor = document.createRange();
    vor.setStart(art, 0);
    try{ vor.setEnd(r.startContainer, r.startOffset); }
    catch(err){ return "ausserhalb"; }
    var davor = norm(vor.toString());
    var nth = 0, p = -1;
    while((p = davor.indexOf(text, p + 1)) >= 0) nth++;

    var m = {
      id: "m" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
      quelle: art.getAttribute("data-quelle"),
      farbe: farbe,
      text: text,
      nth: nth,
      notiz: "",
      wann: new Date().toISOString().slice(0, 10)
    };
    sel.removeAllRanges();
    /* Erst anwenden, dann speichern. Was sich nicht anlegen laesst, wird
       auch nicht abgelegt -- sonst sammelt sich eine Liste von
       Markierungen, die es nie gab. */
    if(!anwenden(m)) return "nichtgefunden";
    marken.push(m);
    var ok = schreiben();
    tafelZeichnen();
    return ok ? "gut" : "ungesichert";
  }

  /* ── Auslesen ────────────────────────────────────────────────────────── */

  function ueberschriftUeber(el){
    var n = el;
    while(n){
      var v = n.previousElementSibling;
      while(v){
        if(/^H[1-6]$/.test(v.tagName)) return v.textContent.trim();
        v = v.previousElementSibling;
      }
      n = n.parentElement;
      if(n && n.hasAttribute && n.hasAttribute("data-quelle")) break;
    }
    return "";
  }

  function bericht(){
    var z = { gruen: 0, gelb: 0, rot: 0 };
    for(var i = 0; i < marken.length; i++) z[marken[i].farbe]++;

    var out = [];
    out.push("# Markierungen aus der Antragsmappe");
    out.push("");
    out.push("Stand der Mappe: " + (document.documentElement.getAttribute("data-stand") || "?")
      + " · ausgelesen am " + new Date().toISOString().slice(0, 10));
    out.push("");
    /* Wie VIEL wegkaeme, ist die Zahl, die man beim Kuerzen braucht --
       "zwoelf Stellen" sagt nichts, "zwoelf Stellen, zusammen 4.800
       Zeichen" schon. Gezaehlt wird der markierte Text selbst. */
    var zeichen = { gruen: 0, gelb: 0, rot: 0 };
    for(var zi = 0; zi < marken.length; zi++)
      zeichen[marken[zi].farbe] += marken[zi].text.length;
    out.push(marken.length + " Markierungen:");
    out.push("");
    out.push("| Farbe | heisst | Stellen | Zeichen |");
    out.push("|---|---|---|---|");
    out.push("| gruen | " + FARBEN.gruen.sinn + " | " + z.gruen + " | " + zeichen.gruen + " |");
    out.push("| gelb | " + FARBEN.gelb.sinn + " | " + z.gelb + " | " + zeichen.gelb + " |");
    out.push("| rot | " + FARBEN.rot.sinn + " | " + z.rot + " | " + zeichen.rot + " |");
    out.push("");
    out.push("**" + GRUNDSATZ + "**");
    if(verwaist.length){
      out.push("");
      out.push("**" + verwaist.length + " verwaist** — der markierte Text steht so nicht");
      out.push("mehr in der Mappe. Sie sind unten mit aufgefuehrt, damit nichts");
      out.push("stillschweigend verschwindet.");
    }
    out.push("");

    var nachQuelle = {};
    for(var j = 0; j < marken.length; j++){
      var m = marken[j];
      (nachQuelle[m.quelle] = nachQuelle[m.quelle] || []).push(m);
    }
    var reihe = ["rot", "gelb", "gruen"];
    for(var q in nachQuelle){
      if(!Object.prototype.hasOwnProperty.call(nachQuelle, q)) continue;
      out.push("---");
      out.push("");
      out.push("## " + q);
      out.push("");
      for(var f = 0; f < reihe.length; f++){
        var farbe = reihe[f];
        var stueck = nachQuelle[q].filter(function(x){ return x.farbe === farbe; });
        if(!stueck.length) continue;
        out.push("### " + farbe.toUpperCase() + " — " + FARBEN[farbe].sinn
          + " (" + stueck.length + ")");
        out.push("");
        for(var s = 0; s < stueck.length; s++){
          var e = stueck[s];
          var knoten = document.querySelector('mark.mk[data-mk="' + e.id + '"]');
          var wo = knoten ? ueberschriftUeber(knoten.closest("p,li,td,th,h1,h2,h3,h4,h5,h6,blockquote,pre") || knoten) : "";
          out.push("> " + e.text);
          if(wo) out.push("");
          if(wo) out.push("Abschnitt: " + wo);
          if(e.notiz){ out.push(""); out.push("Notiz: " + e.notiz); }
          if(!knoten){ out.push(""); out.push("**verwaist** — Text nicht mehr gefunden"); }
          out.push("");
        }
      }
    }
    if(!marken.length){
      out.push("Keine Markierungen. Text mit Maus oder Finger ziehen, dann eine");
      out.push("Farbe waehlen.");
      out.push("");
    }
    return out.join("\n");
  }

  function sagen(text, art){
    if(!lageN) return;
    lageN.textContent = text;
    lageN.setAttribute("data-art", art || "");
  }

  function alsDatei(){
    var name = "Markierungen-Antragsmappe-"
      + (document.documentElement.getAttribute("data-stand") || "ohne-stand") + ".md";
    try{
      /* BOM, weil Android beim Oeffnen einer heruntergeladenen Textdatei
         sonst Latin-1 raet und aus jedem Umlaut zwei Zeichen macht. */
      var blob = new Blob(["﻿" + bericht()], { type: "text/markdown;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
      sagen("Gesichert: " + name, "gut");
    }catch(e){
      sagen("Der Download ist hier gesperrt (" + (e && e.name || "Fehler")
        + "). Nimm den Knopf daneben und fuege die Liste in den Chat ein.", "fehler");
    }
  }

  function inAblage(){
    var t = bericht();
    function alt(){
      /* Der alte Weg ueber ein Feld -- er geht auch dort, wo die
         Zwischenablage-Schnittstelle gesperrt ist. */
      var f = document.createElement("textarea");
      f.value = t;
      f.setAttribute("readonly", "");
      f.style.position = "fixed";
      f.style.left = "-9999px";
      document.body.appendChild(f);
      f.select();
      var ok = false;
      try{ ok = document.execCommand("copy"); }catch(e){ ok = false; }
      f.remove();
      return ok;
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){
        sagen("Kopiert — im Chat einfuegen.", "gut");
      }, function(){
        sagen(alt() ? "Kopiert — im Chat einfuegen."
          : "Kopieren ging nicht. Nimm „Als Datei sichern“.",
          alt ? "gut" : "fehler");
      });
    }else{
      sagen(alt() ? "Kopiert — im Chat einfuegen."
        : "Kopieren ging nicht. Nimm „Als Datei sichern“.", "gut");
    }
  }

  /* ── Tafel ───────────────────────────────────────────────────────────── */

  function tafelZeichnen(){
    var z = { gruen: 0, gelb: 0, rot: 0 };
    for(var i = 0; i < marken.length; i++) z[marken[i].farbe]++;
    if(zaehler){
      zaehler.textContent = marken.length === 0 ? "noch keine"
        : (marken.length + " insgesamt · " + z.gruen + " bleibt · "
           + z.gelb + " du entscheidest · " + z.rot + " kann weg");
      zaehler.setAttribute("data-anzahl", String(marken.length));
    }
    if(knopfN){
      knopfN.textContent = "✎ " + marken.length + " Markierungen";
      knopfN.setAttribute("data-anzahl", String(marken.length));
    }

    if(warnN){
      var w = [];
      if(!speicherGeht){
        w.push("<p><strong>Der Browser laesst nichts speichern.</strong> Die "
          + "Markierungen halten nur, solange diese Seite offen ist — lies "
          + "sie aus, bevor du sie schliesst.</p>");
      }
      if(verwaist.length){
        w.push("<p><strong>" + verwaist.length + " Markierungen sind verwaist.</strong> "
          + "Ihr Text steht so nicht mehr in der Mappe — die Quelle wurde "
          + "geaendert und die Mappe neu gebaut. Sie stehen in der ausgelesenen "
          + "Liste mit dabei.</p>");
      }
      warnN.innerHTML = w.join("");
      warnN.hidden = w.length === 0;
      warnN.className = w.length ? "mk-warn" : "";
    }

    if(!listeN) return;
    if(!marken.length){
      listeN.innerHTML = '<p class="mk-leer">Zieh mit Maus oder Finger ueber eine '
        + 'Stelle im Text — dann erscheint die Farbleiste.</p>';
      return;
    }
    var reihe = ["rot", "gelb", "gruen"], teile = ["<ul>"];
    for(var f = 0; f < reihe.length; f++){
      for(var j = 0; j < marken.length; j++){
        var m = marken[j];
        if(m.farbe !== reihe[f]) continue;
        var da = !!document.querySelector('mark.mk[data-mk="' + m.id + '"]');
        var kurz = m.text.length > 160 ? m.text.slice(0, 160) + "…" : m.text;
        teile.push('<li data-mk-eintrag="' + m.id + '">'
          + '<span class="mk-tupf" data-f="' + m.farbe + '"></span> '
          + "<strong>" + FARBEN[m.farbe].wort + "</strong> — "
          + '<button type="button" class="stelle" data-mk-hin="' + m.id + '">'
          + kurz.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</button>"
          + '<p class="woher">' + m.quelle + (da ? "" : " · <strong>verwaist</strong>") + "</p>"
          + (m.notiz ? '<p class="notiz">' + m.notiz.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</p>" : "")
          + "</li>");
      }
    }
    teile.push("</ul>");
    listeN.innerHTML = teile.join("");
  }

  function tafelAuf(offen){
    tafel.setAttribute("data-offen", offen ? "ja" : "nein");
    if(offen) tafelZeichnen();
  }

  /* ── Leiste ──────────────────────────────────────────────────────────── */

  function leisteZeigen(rechteck, aufMarke){
    leiste.setAttribute("data-offen", "ja");
    leiste.setAttribute("data-auf-marke", aufMarke ? "ja" : "nein");
    var b = leiste.getBoundingClientRect();
    var x = rechteck.left + rechteck.width / 2 - b.width / 2;
    x = Math.max(8, Math.min(x, window.innerWidth - b.width - 8));
    /* Unter die Auswahl, weil dort auf dem Tablet weder der Finger noch
       Androids eigene Kopieren-Leiste steht. Ist unten kein Platz, darueber. */
    var y = rechteck.bottom + 10;
    if(y + b.height > window.innerHeight - 8) y = Math.max(8, rechteck.top - b.height - 10);
    leiste.style.left = Math.round(x) + "px";
    leiste.style.top = Math.round(y) + "px";
  }

  function leisteZu(){
    leiste.setAttribute("data-offen", "nein");
    gewaehlt = null;
  }

  function auswahlPruefen(){
    if(!an) return;
    var sel = window.getSelection();
    if(!sel || sel.isCollapsed || !sel.rangeCount || !norm(sel.toString())){
      if(leiste.getAttribute("data-auf-marke") !== "ja") leisteZu();
      return;
    }
    if(!quelleVon(sel.getRangeAt(0).startContainer)){ leisteZu(); return; }
    gewaehlt = null;
    leisteZeigen(sel.getRangeAt(0).getBoundingClientRect(), false);
  }

  /* ── Ereignisse ──────────────────────────────────────────────────────── */

  document.addEventListener("pointerup", function(ev){
    if(leiste.contains(ev.target) || tafel.contains(ev.target)) return;
    var mk = ev.target.closest ? ev.target.closest("mark.mk") : null;
    if(mk && an){
      var sel0 = window.getSelection();
      if(!sel0 || sel0.isCollapsed){
        gewaehlt = mk.getAttribute("data-mk");
        leisteZeigen(mk.getBoundingClientRect(), true);
        return;
      }
    }
    setTimeout(auswahlPruefen, 0);
  });
  document.addEventListener("keyup", function(){ setTimeout(auswahlPruefen, 0); });

  leiste.addEventListener("click", function(ev){
    var k = ev.target.closest ? ev.target.closest("[data-mk-tun]") : null;
    if(!k) return;
    var tun = k.getAttribute("data-mk-tun");

    if(tun === "weg"){
      if(!gewaehlt){ leisteZu(); return; }
      abnehmen(gewaehlt);
      marken = marken.filter(function(m){ return m.id !== gewaehlt; });
      schreiben(); tafelZeichnen(); leisteZu();
      return;
    }

    if(tun === "notiz"){
      var ziel = gewaehlt;
      if(!ziel){
        /* Ohne bestehende Markierung: erst gelb anlegen, dann beschriften --
           eine Notiz ohne Stelle waere nirgends wiederzufinden. */
        var r0 = ausAuswahl("gelb");
        if(r0 !== "gut" && r0 !== "ungesichert"){ meldung(r0); leisteZu(); return; }
        ziel = marken[marken.length - 1].id;
      }
      var alt2 = null;
      for(var i = 0; i < marken.length; i++) if(marken[i].id === ziel) alt2 = marken[i];
      if(!alt2){ leisteZu(); return; }
      var txt = window.prompt("Was ist hier zu tun?", alt2.notiz || "");
      if(txt !== null){
        alt2.notiz = txt.trim();
        abnehmen(ziel);
        anwenden(alt2);
        schreiben();
        tafelZeichnen();
      }
      leisteZu();
      return;
    }

    if(FARBEN[tun]){
      if(gewaehlt){
        /* Farbe einer bestehenden Markierung wechseln. */
        for(var j = 0; j < marken.length; j++){
          if(marken[j].id !== gewaehlt) continue;
          marken[j].farbe = tun;
          abnehmen(gewaehlt);
          anwenden(marken[j]);
        }
        schreiben(); tafelZeichnen(); leisteZu();
        return;
      }
      meldung(ausAuswahl(tun));
      leisteZu();
    }
  });

  function meldung(art){
    if(art === "gut") return;
    var texte = {
      leer: "Nichts ausgewaehlt.",
      ausserhalb: "Nur im Text der Unterlagen markierbar, nicht in Kopf oder Leiste.",
      zweiquellen: "Die Auswahl geht ueber zwei Quelldateien — bitte je Datei einzeln.",
      ueberschneidung: "Die Auswahl liegt auf einer vorhandenen Markierung. Erst die entfernen.",
      nichtgefunden: "Diese Stelle liess sich nicht anlegen — bitte etwas anders auswaehlen.",
      ungesichert: "Markiert, aber NICHT gespeichert — der Browser laesst nichts ablegen. Vor dem Schliessen auslesen."
    };
    var t = texte[art] || String(art);
    tafelAuf(true);
    sagen(t, art === "ungesichert" ? "fehler" : "");
  }

  tafel.addEventListener("click", function(ev){
    var k = ev.target.closest ? ev.target.closest("[data-mk-tun],[data-mk-hin]") : null;
    if(!k) return;
    var hin = k.getAttribute("data-mk-hin");
    if(hin){
      var n = document.querySelector('mark.mk[data-mk="' + hin + '"]');
      if(n){ n.scrollIntoView({ block: "center" }); tafelAuf(false); }
      else sagen("Diese Markierung ist verwaist — der Text steht so nicht mehr da.", "fehler");
      return;
    }
    var tun = k.getAttribute("data-mk-tun");
    if(tun === "zu") tafelAuf(false);
    else if(tun === "datei") alsDatei();
    else if(tun === "ablage") inAblage();
    else if(tun === "aus"){
      an = !an;
      k.textContent = an ? "Markieren ausschalten" : "Markieren einschalten";
      if(!an) leisteZu();
      schreiben();
      sagen(an ? "Markieren ist an." : "Markieren ist aus — vorhandene bleiben stehen.", "");
    }
  });

  if(knopfN) knopfN.addEventListener("click", function(){
    tafelAuf(tafel.getAttribute("data-offen") !== "ja");
  });

  /* ── Start ───────────────────────────────────────────────────────────── */

  var geladen = lesen();
  marken = geladen.marken;
  an = geladen.an;
  for(var i = 0; i < marken.length; i++){
    if(!anwenden(marken[i])) verwaist.push(marken[i].id);
  }
  tafelZeichnen();
  if(verwaist.length) tafelAuf(true);

  /* Fuer die Proben: kein Bedienweg, sondern ein Fenster hinein. */
  window.__mk = {
    marken: function(){ return marken.slice(); },
    verwaist: function(){ return verwaist.slice(); },
    bericht: bericht,
    setzen: function(quelle, text, farbe, notiz){
      var art = document.querySelector('[data-quelle="' + quelle + '"]');
      if(!art) return "keine-quelle";
      var m = {
        id: "m" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
        quelle: quelle, farbe: farbe, text: norm(text), nth: 0,
        notiz: notiz || "", wann: new Date().toISOString().slice(0, 10)
      };
      if(!anwenden(m)) return "nicht-gefunden";
      marken.push(m); schreiben(); tafelZeichnen();
      return m.id;
    },
    leeren: function(){
      for(var i = 0; i < marken.length; i++) abnehmen(marken[i].id);
      marken = []; verwaist = []; schreiben(); tafelZeichnen();
    }
  };
})();
`;
