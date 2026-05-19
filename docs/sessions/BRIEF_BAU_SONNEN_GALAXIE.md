# Brief — Bau-Sitzung Sonnen-Galaxie · Sage-Geschichts-Galerie

**Vision-Anker 10**, eingetragen 2026-05-18 in `docs/PULS.md`
§ Vision-Anker (mid-Pflege re-gerahmt von „Papers-Bibliothek" auf
„Geschichts-Galerie"). Dieser Brief geht in den **ersten Prompt**
der nächsten Bau-Sitzung als Codeblock.

**Heilige Tafel — Privatheit:** Die Sonnen-Galaxie darf **Everlast
GmbH NICHT erwähnen**. Gilt für Code-Kommentare, Modal-Texte,
Platzhalter, Commit-Messages, PR-Beschreibungen.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Branch: claude/bau-vision-10-sonnen-galaxie  (vom main aus anlegen)

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md § Vision-Anker → "2026-05-18 · Sonnen-Galaxie —
   Sage-Geschichts-Galerie" (Anker 10, vollständig lesen — enthält
   die Bau-Architektur-Skizze, das Stationen-Inventar, die heilige
   Privatheits-Klausel, das Sonnenflecken-Pattern und die Bahn-
   Mathematik)
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

Heilige Tafel: Die Sonnen-Galaxie darf Everlast GmbH NICHT erwähnen.
Gilt für Code-Kommentare, Modal-Texte, Platzhalter, Commits, PR-Beschreibung.

Deine Aufgabe heute:

Baue Vision-Anker 10 vollständig in index.html ein — Sonnen-Karte
(oberhalb der Schwarz-Loch-Karte, vor .card.reading) UND Sage-
Geschichts-Galerie-Screen (analog zum Observatorium-Screen, aber
Galaxien auf einer GEMEINSAMEN Ellipsen-Bahn mit gleichmäßiger
Phasen-Verteilung + Eigenrotation, NICHT wandernd wie Anker 3). Vier
Stationen beim Start, drei davon mit Platzhalter-Body (Klaus liefert
Erzähl-Texte später per Mini-Pflege), eine inhaltlich live (EN-Paper).

Konkret:

1. CSS-Block "Sonnen-Galaxie · Sage-Geschichts-Galerie" vor
   .blackhole-card einfügen (~Z. 403). Sechs Klassen + vier Keyframes
   wie in PULS § Anker 10 § Architektur-Skizze beschrieben:
   - .sun-card / .sun-stage / .sun-scene
   - .sun-corona / .sun-corona-2 / .sun-disk / .sun-spot (3x)
   - @keyframes sun-corona-pulse / sun-corona-spin / sun-disk-pulse /
     sun-spot-drift-1/2/3
   Bei Hover: alle Animations-Dauern halbieren. prefers-reduced-motion
   schaltet alles ab.

2. CSS-Block "Sage-Geschichts-Galerie-Screen" nach dem Observatorium-
   Block (~Z. 540). Klassen:
   - .sonnen-screen (warm-dunkler Hintergrund #1a0a08)
   - .sonnen-stage / .sonnen-back / .sonnen-galaxies / .sonnen-stars
   - .sonnen-nebula-1/2/3 mit warm-goldenem statt magenta/cyan
     Gradient (rgba(244,180,53,…), rgba(255,120,40,…))
   - .station-galaxy (analog .universe-galaxy)
   - .station-galaxy.text-only / .live — Status-Klassen mit
     leichter Opacity-/Saturation-Variation (text-only minimal
     gedämpft, damit deutlich wird: "Geschichte folgt")
   - .station-modal (analog .universe-modal, eigene IDs)

3. HTML-Block Sonnen-Karte vor .card.reading (Z. ~751) einfügen:
   <article class="card span-12 sun-card" data-back-anchor="sonnen">
     <span class="card-tag">Sage-Geschichts-Galerie · auf den Spuren des Protokolls</span>
     <a class="sun-stage" href="#sonnen"
        onclick="goScreen('sonnen', 'sonnen'); return false;"
        aria-label="Geschichts-Galerie öffnen — Sonnen-Galaxie">
       <div class="sun-scene" aria-hidden="true">
         <div class="sun-corona"></div>
         <div class="sun-corona-2"></div>
         <div class="sun-disk"></div>
         <div class="sun-spot s1"></div>
         <div class="sun-spot s2"></div>
         <div class="sun-spot s3"></div>
       </div>
       <div class="sun-caption">
         <h3>Auf welchen Spuren Sage gewachsen ist</h3>
         <p>Was macht man, wenn man auf eine Antwort wartet? Man macht
         sich selber an die Arbeit. Hier liegen die Stationen, an denen
         das Protokoll seine Form gefunden hat — Namensgebung, das
         bidirektionale Match-Prinzip, die Geburt als Mycel, und das
         Paper, das die Theorie zusammenträgt.</p>
         <p class="sun-hint">Klicke in die Sonne → die Stationen tanzen
         als Galaxien um sie herum.</p>
       </div>
     </a>
   </article>

4. HTML-Block Geschichts-Galerie-Screen nach </main> von
   screen-observatorium (~Z. 1121):
   <main id="screen-sonnen" class="screen sonnen-screen">
     <button class="screen-back sonnen-back" onclick="goScreen('overview', 'sonnen')">← Zurück zur Sage</button>
     <div class="sonnen-stage" id="sonnen-stage">
       <canvas id="sonnen-stars" class="sonnen-stars" aria-hidden="true"></canvas>
       <div class="sonnen-nebula sonnen-nebula-1" aria-hidden="true"></div>
       <div class="sonnen-nebula sonnen-nebula-2" aria-hidden="true"></div>
       <div class="sonnen-nebula sonnen-nebula-3" aria-hidden="true"></div>
       <div class="sonnen-galaxies" id="sonnen-galaxies" aria-label="Stationen der Sage-Entwicklung"></div>
       <div class="sonnen-hint">
         <span>Vier Stationen · Klick öffnet die Geschichte.</span>
       </div>
     </div>
     <div class="station-modal" id="station-modal" role="dialog" aria-modal="true" aria-labelledby="station-modal-title" hidden>
       <div class="station-modal-backdrop" onclick="closeStationModal()"></div>
       <article class="station-modal-card">
         <button class="station-modal-close" onclick="closeStationModal()" aria-label="Station schließen">✕</button>
         <header class="station-modal-head">
           <span class="station-modal-tag" id="station-modal-tag">Station</span>
           <h2 id="station-modal-title">Titel</h2>
         </header>
         <div class="station-modal-body" id="station-modal-body"></div>
       </article>
     </div>
   </main>

5. SCREENS-Array (Z. ~1179) um 'sonnen' erweitern.

6. goScreen() (Z. ~1226): Aufruf setupSonnenGalaxie() bei id === 'sonnen'.
   applyHashScreen() (Z. ~2482): bei h === 'sonnen' Zurück-Anker
   'sonnen' mitgeben.

7. JS-Block nach closeUniverseModal() (~Z. 2479):

   const STATIONS_DATA = [
     { idx: 0, status: 'text-only', shape: 'galaxy-spiral', size: 'large',
       title: 'SBKIM-Namensgebung',
       tag: 'Station 1',
       summary: 'Inhalt folgt per Mini-Pflege — woher der Name kam, was die einzelnen Buchstaben in der Reise getragen haben.'
     },
     { idx: 1, status: 'text-only', shape: 'galaxy-elliptical', size: 'large',
       title: 'Zwei Seiten einer Medaille',
       tag: 'Station 2',
       summary: 'Inhalt folgt per Mini-Pflege — das bidirektionale Match-Prinzip biographisch erzählt: wann und warum die Idee aufkam, Anbieter und Sucher zugleich zu denken.'
     },
     { idx: 2, status: 'text-only', shape: 'galaxy-ring', size: 'medium',
       title: 'Sage-Protokol-Geburt',
       tag: 'Station 3',
       summary: 'Inhalt folgt per Mini-Pflege — der Pivot von Plattform-Form zu Mycel-Form, Geburt dieses Repos.'
     },
     { idx: 3, status: 'live', shape: 'galaxy-sombrero', size: 'large',
       title: 'Wissenschaftlicher Niederschlag — SBKIM-Paper (EN)',
       tag: 'Station 4',
       summary: 'Das englische SBKIM-Paper. Sieben Sektionen: Einleitung, verwandte Arbeiten, das SBKIM-Protokoll mit den drei Dimensionen, Zwei-Schichten-Architektur (Human + Agent), Referenz-Implementation, offene Probleme, Schluss.',
       href: 'docs/papers/sbkim-paper-en.html'
     }
   ];

   function setupSonnenGalaxie() { … }    // einmaliger Init-Schalter
   function openStationModal(idx) { … }   // Body + bei status:'live' den href-Link
   function closeStationModal() { … }

   Bewegungs-Mathematik (im Render-Loop):
     const ANG_SPEED = (2 * Math.PI) / 50;   // 50 s Umlaufzeit
     const t = now / 1000;
     STATIONS_DATA.forEach((s, i) => {
       const phase = (i / STATIONS_DATA.length) * Math.PI * 2;
       const x01 = 50 + Math.cos(t * ANG_SPEED + phase) * 30;
       const y01 = 50 + Math.sin(t * ANG_SPEED + phase) * 18;
       // Eigenrotation läuft via CSS @keyframes galaxy-spin
     });

   Modal-Body:
   - status: 'text-only' → nur summary-Text in <p>, keinen Link
   - status: 'live'      → summary-Text + "Original-Dokument öffnen →"-Link auf href

Was du NICHT tust:

- Kein Modul-Code in src/modules/.
- Keine Erwähnung von Everlast GmbH in Code, Kommentaren, Texten.
- Kein Eingriff in status.json. (Optional, nur wenn Zeit übrig:
  status.json um Feld historie[] erweitern. Nicht Pflicht.)
- Keine eigenständigen Erzähl-Texte für Stationen 1–3 schreiben —
  Platzhalter-Bodies sind explizit gewünscht, Klaus liefert Inhalte
  per Folge-Mini-Pflegen.
- Keine Änderung an .blackhole-card oder am Observatorium-Screen.

Pflicht am Ende:

- index.html-Erweiterung mit allen sieben Eingriffen aus PULS § Anker 10.
- docs/papers/README.md anlegen — kurze Erklärung: dieser Ordner trägt
  dokumentengestützte Stationen der Sonnen-Galaxie (heute eine — das
  EN-Paper als Station 4); Verweis auf Vision-Anker 10.
- Manueller Sichttest (Klaus, Browser, idealerweise Desktop +
  Tablet): Sonnen-Karte sichtbar, klickbar, Hover pulsiert stärker;
  Geschichts-Galerie-Screen lädt, vier Galaxien tanzen auf
  gemeinsamer Bahn, Eigenrotation läuft, Klick auf Stations-Galaxie
  öffnet Modal — Station 4 (live) mit EN-Paper-Link, Stationen 1–3
  (text-only) mit Platzhalter-Hinweis.
- PULS.md neuer Sitzungs-Eintrag oben (vorletzten ins Archiv-Index
  schieben — Konvention der PULS-Auslagerung).
- Vision-Anker 10 § Status: "Reif für Bau-Sitzung mit text-only-
  Skelett" → "Realisiert PR #<nummer>; Stationen 1–3 warten auf
  Erzähl-Text per Folge-Mini-Pflegen".
- Übergabeprotokoll in
  docs/sessions/archiv/2026-05-XX_bau-vision-10-sonnen-galaxie.md.
- Commit + Push auf claude/bau-vision-10-sonnen-galaxie + Draft-PR.
- "Vorgeschlagene nächste Schritte"-Block am Sitzungs-Ende im Chat
  (2–4 priorisierte Schritte — eine pro Folge-Mini-Pflege je Station).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS.md ans Ende von
  Anker 10 § Status. Klaus klärt in der nächsten Sitzung.

Zeitschätzung: 4-5 Stunden für volle Auslieferung (etwas weniger als
die ursprüngliche Papers-Bibliothek, weil drei der vier Stationen
text-only sind und keinen Datei-Anker brauchen). Aufteilbar in zwei
Sitzungen, falls die erste zu lang wird:
- Bau 10a (~2.5 h): Sonnen-Karte + Klick-Verlinkung + papers/README.md
- Bau 10b (~2.5 h): Geschichts-Galerie-Screen + Modal + Bewegungs-Loop
```

---

## Hinweise außerhalb des Briefes (Hauptsitzung-Kontext)

- **Mid-Pflege-Re-Framing beachten:** Anker 10 wurde mid-Pflege 2026-05-18
  von „Papers-Bibliothek" auf „Geschichts-Galerie" umgeschrieben.
  Wer den Brief in der Bau-Sitzung zieht, soll **nicht** mid-Sitzung
  zurück auf „Papers-Bibliothek" abweichen — Geschichts-Galerie ist
  der feste Spec-Anker.

- **Privatheits-Klausel ist heilig.** Klaus' Wunsch: keine Erwähnung
  von Everlast GmbH in der Sonnen-Galaxie. Bau-Sitzung muss vor
  jedem Commit prüfen, dass weder Code-Kommentare noch Modal-Texte
  noch PR-Beschreibung diesen Namen tragen.

- **Englisches Paper ist da.** Pfad: `docs/papers/sbkim-paper-en.html`.
  Trägt Station 4 als dokumentengestützte Galaxie.

- **Stationen 1–3 sind text-only beim Bau.** Bau-Sitzung baut sie mit
  Platzhalter-Bodies („Inhalt folgt per Mini-Pflege"). Klaus liefert
  Erzähl-Texte per einzelner Folge-Mini-Pflegen — jeder Mini-PR
  schreibt einen `summary` aus.

- **Demo-Optik-Inspiration:** Klaus hat in der Pflege-Sitzung 2026-05-18
  eine externe `index.html` (Endknoten-Prototyp mit PeerJS + QR) als
  Inspirations-Material erwähnt — drift/blink/scan/fadeup-Keyframes.
  Die vorhandenen Observatorium-Animationen sind reichhaltig genug;
  externe Inspiration nicht zwingend nötig.
