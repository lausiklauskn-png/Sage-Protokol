# Brief — Bau-Sitzung Sonnen-Galaxie · Papers-Bibliothek

**Vision-Anker 10**, eingetragen 2026-05-18 in `docs/PULS.md`
§ Vision-Anker. Dieser Brief geht in den **ersten Prompt** der nächsten
Bau-Sitzung als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Branch: claude/bau-vision-10-sonnen-galaxie  (vom main aus anlegen)

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md § Vision-Anker → "2026-05-18 · Sonnen-Galaxie —
   Papers-Bibliothek" (Anker 10, vollständig lesen — enthält die
   Bau-Architektur-Skizze, das Papers-Inventar, das Sonnenflecken-
   Pattern und die Bahn-Mathematik)
3. docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md (dieser Brief)
4. index.html — folgende Stellen als Referenz für baugleiche Optik:
   - .blackhole-card / .blackhole-stage / .blackhole-scene (Z. ~403)
   - <article class="card span-12 blackhole-card"> (Z. ~817)
   - .observatorium-screen / .universe-galaxy / .universe-modal (Z. ~440)
   - <main id="screen-observatorium"> (Z. ~1097)
   - setupObservatoriumUniverse() (Z. ~2240)
   - OBSERVATORIUM_LEHREN-Array (Z. ~2144)

Was du NICHT liest: docs/INTERFACES.md, andere Komponenten-Karten,
Modul-Code in src/. Reiner Sage-Page-Bau.

Deine Aufgabe heute:

Baue Vision-Anker 10 vollständig in index.html ein — Sonnen-Karte
(oberhalb der Schwarz-Loch-Karte, vor .card.reading) UND Papers-
Galaxie-Screen (analog zum Observatorium-Screen, aber Galaxien auf
einer GEMEINSAMEN Ellipsen-Bahn mit gleichmäßiger Phasen-Verteilung
+ Eigenrotation, NICHT wandernd wie Anker 3). Alle Details in
PULS.md § Vision-Anker 10 § Architektur-Skizze (für Bau-Sitzung).

Konkret:

1. CSS-Block "Sonnen-Galaxie · Papers-Bibliothek" vor .blackhole-card
   einfügen (~Z. 403). Sechs Klassen + vier Keyframes:
   - .sun-card  (Hintergrund radial-gradient, warm-dunkel)
   - .sun-stage (Grid, Hover-Scene-Scale)
   - .sun-scene (Container, aspect-ratio 1)
   - .sun-corona  (radial, pulsierend, @keyframes sun-corona-pulse)
   - .sun-corona-2 (conic, rotierend, @keyframes sun-corona-spin,
     mit -webkit-mask: radial-gradient für Ring-Optik)
   - .sun-disk    (dunkler Sonnenkern, @keyframes sun-disk-pulse)
   - .sun-spot (3x .s1/.s2/.s3, je eigene @keyframes sun-spot-drift-X
     mit unterschiedlichen Dauern 11/9/13 s, leicht unregelmäßige
     Translate-Vektoren, leichte Skalierung 0.7–1.15)
   Bei Hover: alle Animations-Dauern halbieren. prefers-reduced-motion
   schaltet alles ab.

2. CSS-Block "Papers-Galaxie-Screen" nach dem Observatorium-Block
   (~Z. 540). Klassen:
   - .papers-screen (analog .observatorium-screen, warm-dunkler
     Hintergrund #1a0a08 statt #02020c)
   - .papers-stage / .papers-back / .papers-galaxies / .papers-stars
   - .papers-nebula-1/2/3 mit warm-goldenem statt magenta/cyan
     Gradient (rgba(244,180,53,…), rgba(255,120,40,…))
   - .paper-galaxy (analog .universe-galaxy)
   - .paper-galaxy.live / .draft / .geplant — Status-Klassen mit
     unterschiedlicher Opacity + Saturation
   - .paper-modal (analog .universe-modal, eigene IDs)

3. HTML-Block Sonnen-Karte vor .card.reading (Z. ~751) einfügen:
   <article class="card span-12 sun-card" data-back-anchor="papers">
     <span class="card-tag">Wissenschaftliche Grundlage · Papers-Bibliothek</span>
     <a class="sun-stage" href="#papers"
        onclick="goScreen('papers', 'papers'); return false;"
        aria-label="Papers-Bibliothek öffnen — Sonnen-Galaxie">
       <div class="sun-scene" aria-hidden="true">
         <div class="sun-corona"></div>
         <div class="sun-corona-2"></div>
         <div class="sun-disk"></div>
         <div class="sun-spot s1"></div>
         <div class="sun-spot s2"></div>
         <div class="sun-spot s3"></div>
       </div>
       <div class="sun-caption">
         <h3>Auf welcher Grundlage Sage steht</h3>
         <p>Zwei wissenschaftliche Papers tragen die Form. Das englische
         beschreibt SBKIM als bidirektionales Matching-Protokoll mit drei
         Dimensionen. Das deutsche folgt. Ein drittes Paper stellt das
         Mycel-Prinzip dem SBKIM-Matching gegenüber.</p>
         <p class="sun-hint">Klicke in die Sonne → die Papers tanzen
         als Galaxien um sie herum.</p>
       </div>
     </a>
   </article>

4. HTML-Block Papers-Galaxie-Screen nach </main> von
   screen-observatorium (~Z. 1121):
   <main id="screen-papers" class="screen papers-screen">
     <button class="screen-back papers-back" onclick="goScreen('overview', 'papers')">← Zurück zur Sage</button>
     <div class="papers-stage" id="papers-stage">
       <canvas id="papers-stars" class="papers-stars" aria-hidden="true"></canvas>
       <div class="papers-nebula papers-nebula-1" aria-hidden="true"></div>
       <div class="papers-nebula papers-nebula-2" aria-hidden="true"></div>
       <div class="papers-nebula papers-nebula-3" aria-hidden="true"></div>
       <div class="papers-galaxies" id="papers-galaxies" aria-label="Papers-Galaxien — Ellipsen-Bahn"></div>
       <div class="papers-hint">
         <span>Drei Galaxien · drei Papers · Klick öffnet das Paper.</span>
       </div>
     </div>
     <div class="paper-modal" id="paper-modal" role="dialog" aria-modal="true" aria-labelledby="paper-modal-title" hidden>
       <div class="paper-modal-backdrop" onclick="closePaperModal()"></div>
       <article class="paper-modal-card">
         <button class="paper-modal-close" onclick="closePaperModal()" aria-label="Paper schließen">✕</button>
         <header class="paper-modal-head">
           <span class="paper-modal-tag" id="paper-modal-tag">Paper</span>
           <h2 id="paper-modal-title">Titel</h2>
         </header>
         <div class="paper-modal-body" id="paper-modal-body"></div>
       </article>
     </div>
   </main>

5. SCREENS-Array (Z. ~1179) um 'papers' erweitern.

6. goScreen() (Z. ~1226): Aufruf setupPapersGalaxy() bei id === 'papers'.
   applyHashScreen() (Z. ~2482): bei h === 'papers' Zurück-Anker
   'papers' mitgeben.

7. JS-Block nach closeUniverseModal() (~Z. 2479):

   const PAPERS_DATA = [
     { idx: 0, status: 'live',
       title: 'SBKIM: A Protocol for Semantic Bidirectional Matching in Human and Agent Networks',
       lang: 'EN', shape: 'galaxy-spiral', size: 'large',
       href: 'docs/papers/sbkim-paper-en.html',
       summary: 'Das englische SBKIM-Paper. Sieben Sektionen: Einleitung, Verwandte Arbeiten, das SBKIM-Protokoll mit den drei Dimensionen, Zwei-Schichten-Architektur (Human + Agent), Referenz-Implementation, offene Probleme, Schluss.'
     },
     { idx: 1, status: 'draft',
       title: 'SBKIM-Paper · deutsche Fassung',
       lang: 'DE', shape: 'galaxy-elliptical', size: 'large',
       href: 'docs/papers/sbkim-paper-de.html',
       summary: 'Die deutsche Fassung des SBKIM-Papers. In Arbeit — Klaus lädt nach.'
     },
     { idx: 2, status: 'geplant',
       title: 'Mizel + SBKIM — Gegenüberstellung und Synergie',
       lang: 'DE', shape: 'galaxy-ring', size: 'medium',
       href: null,
       summary: 'Geplantes Synthesis-Paper. Stellt das Mizel-Prinzip (Pilz-Netzwerk, Mycel-Form) dem SBKIM-Prinzip (semantisch bidirektionales KI-Matching) gegenüber. Was hat das eine, was hat das andere — wo sind Gemeinsamkeiten, welche Vorteile bringt das eine, welche das andere, und welche Vorteile entstehen erst zusammen.'
     }
   ];

   function setupPapersGalaxy() { … }   // einmaliger Init-Schalter
   function openPaperModal(idx) { … }   // analog openUniverseModal
   function closePaperModal() { … }     // analog closeUniverseModal

   Bewegungs-Mathematik (im Render-Loop):
     const ANG_SPEED = (2 * Math.PI) / 50;   // 50 s Umlaufzeit
     const t = now / 1000;
     PAPERS_DATA.forEach((p, i) => {
       const phase = (i / PAPERS_DATA.length) * Math.PI * 2;
       const x01 = 50 + Math.cos(t * ANG_SPEED + phase) * 30;
       const y01 = 50 + Math.sin(t * ANG_SPEED + phase) * 18;
       // Eigenrotation läuft via CSS @keyframes galaxy-spin
       el.style.transform = 'translate(...)';
     });

   Die geplant-Galaxie (idx 2) öffnet im Modal nur eine Erklärung
   („Paper noch nicht geschrieben — geplant"), keinen Datei-Link.
   Die draft-Galaxie (idx 1) öffnet — wenn die Datei fehlt — eine
   "kommt noch"-Notiz; wenn die Datei vorhanden ist (Klaus' Upload),
   den href.

Was du NICHT tust:

- Kein Modul-Code in src/modules/.
- Kein Eingriff in status.json. (Optional, nur wenn Zeit übrig:
  status.json um Feld papers[] erweitern, dann ist die Bibliothek
  auch maschinen-lesbar. Aber nicht Pflicht für diese Sitzung.)
- Keine neuen Papers schreiben. Das EN-Paper liegt schon; das DE-
  Paper bringt Klaus mit; das Synthesis-Paper ist geplante Zukunft.
- Keine Änderung an .blackhole-card oder am Observatorium-Screen.

Pflicht am Ende:

- index.html-Erweiterung mit allen sieben Eingriffen aus PULS § Anker 10.
- docs/papers/README.md anlegen — kurze Erklärung der Bibliothek +
  Liste der drei Galaxien-Plätze + Verweis auf Vision-Anker 10.
- Manueller Sichttest (Klaus, Browser, idealerweise Desktop +
  Tablet): Sonnen-Karte sichtbar, klickbar, hover pulsiert stärker;
  Papers-Galaxie-Screen lädt, drei Galaxien tanzen auf gemeinsamer
  Bahn, Eigenrotation läuft, Hover/Klick auf live-Galaxie öffnet
  Modal mit EN-Paper-Link, Klick auf geplant-Galaxie zeigt
  „geplant"-Notiz.
- PULS.md neuer Sitzungs-Eintrag oben (vorletzter ins Archiv-Index
  schieben — Konvention der PULS-Auslagerung).
- Vision-Anker 10 § Status: "Reif für Bau-Sitzung" → "Realisiert
  PR #<nummer>".
- Übergabeprotokoll in docs/sessions/archiv/2026-05-XX_bau-vision-10-sonnen-galaxie.md
  (Format: docs/sessions/BRIEFING_TEMPLATE.md § C, an Sage-Page-Bau
  anpassen — kein Modul-Karte, keine INTERFACES-Spiegelung).
- Commit + Push auf claude/bau-vision-10-sonnen-galaxie + Draft-PR.
- "Vorgeschlagene nächste Schritte"-Block am Sitzungs-Ende im Chat
  (2–4 priorisierte Schritte).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS.md ans Ende von
  Anker 10 § Status. Eine Konzept-Klärung ist kein Bau-Job — Klaus
  fragt in der nächsten Sitzung nach.

Zeitschätzung: 5-6 Stunden für volle Auslieferung. Aufteilbar in
zwei Sitzungen, falls die erste zu lang wird:
- Bau 10a (~3 h): Sonnen-Karte + Klick-Verlinkung + papers/README.md
- Bau 10b (~3 h): Papers-Galaxie-Screen + Modal + Bewegungs-Loop
```

---

## Hinweise außerhalb des Briefes (Hauptsitzung-Kontext)

- **Klaus' Mid-Sitzungs-Kehrtwende beachten:** in der Pflege-Sitzung
  2026-05-18 hat Klaus erst „bauen jetzt" gesagt, dann „Briefing für
  neue Bau-Sitzung". Die zweite Aussage gewann. Wer den Brief in der
  Bau-Sitzung zieht, soll **nicht** mid-Sitzung in Richtung „mache es
  noch größer" abweichen — Anker 10 ist der feste Spec-Anker, der
  Brief ist die Bau-Auflage.

- **Englisches Paper ist schon da.** Nicht erneut hochladen lassen.
  Pfad: `docs/papers/sbkim-paper-en.html`. Deutsches Paper liegt
  noch nicht im Repo — die Bau-Sitzung baut die DE-Galaxie als
  `draft` (= sichtbar, aber gedämpft); sobald Klaus die DE-Datei
  hochlädt, switcht eine Folge-Mini-Pflege den Status auf `live`.

- **Demo-Optik-Inspiration:** Klaus hat in der Pflege-Sitzung 2026-05-18
  eine externe `index.html` (eines anderen Endknoten-Prototyps, mit
  PeerJS + QR-Code) als Inspirations-Material erwähnt — drift/blink/
  scan/fadeup-Keyframes. Die Sonnen-Karte braucht das nicht zwingend
  — die vorhandenen Observatorium-Animationen sind reichhaltig genug.
  Wenn die Bau-Sitzung die externe `index.html` braucht: Klaus erneut
  um Upload bitten, sie ist nicht im Repo.

- **Privatheits-Verbindung zu Anker 1:** Klaus hat angedeutet, dass
  das Observatorium privat bleiben kann, „solange beide
  wissenschaftlichen Papers als Grundlage angeführt werden". Die
  Sonnen-Karte erfüllt das — sie ist die öffentliche Visitenkarte
  der Theorie. Wenn V1-Spec dazu kommt, kann der Sonnen-Karten-Text
  um eine kurze Note erweitert werden: „Das technische Detail-
  Observatorium ist privat — die Theorie hier oben trägt."
