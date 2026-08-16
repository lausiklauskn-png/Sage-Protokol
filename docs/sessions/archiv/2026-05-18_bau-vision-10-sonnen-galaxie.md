# Bau-Sitzung — Vision-Anker 10 Sonnen-Galaxie · Sage-Geschichts-Galerie

**Datum:** 2026-05-18
**Sitzungs-Rolle:** Bau-Sitzung (Sage-Page-Bau, kein Modul-Code)
**Branch:** `claude/bau-vision-10-sonnen-galaxie-JxoIH`
**Brief:** `docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md`

---

## Was getan

Vision-Anker 10 vollständig in `index.html` eingebaut — die in
PULS § Anker 10 § Architektur-Skizze spezifizierten **sieben
Eingriffe** sind alle umgesetzt (additiv, keine bestehende Card
und kein bestehender Screen wurden angefasst):

1. **CSS-Block „Sonnen-Galaxie · Sage-Geschichts-Galerie"** vor
   dem `.blackhole-card`-Block eingefügt. Sechs Klassen
   (`.sun-card`, `.sun-stage`, `.sun-scene`, `.sun-corona`,
   `.sun-corona-2`, `.sun-disk`, `.sun-spot` mit `.s1/.s2/.s3`)
   plus vier Keyframes (`sun-corona-pulse`, `sun-corona-spin`,
   `sun-disk-pulse`, `sun-spot-drift-1/2/3`). Hover halbiert alle
   Animations-Dauern. `prefers-reduced-motion: reduce` schaltet
   alle Sonnen-Animationen ab.

2. **CSS-Block „Sage-Geschichts-Galerie-Screen"** unmittelbar vor
   dem schließenden `</style>`. Warm-dunkler Hintergrund `#1a0a08`,
   warm-goldene Nebel (`rgba(244,180,53,…)` /
   `rgba(255,120,40,…)`) statt der magenta/cyan-Observatoriums-
   Nebel, eigene Drift-Keyframes (`sonnen-nebula-drift-1/2/3`).
   `.station-galaxy` baut auf der bestehenden `galaxy-spin`-
   Eigenrotation auf — die existierenden Formen-Klassen
   (`galaxy-spiral`, `galaxy-elliptical`, `galaxy-ring`,
   `galaxy-sombrero` …) und Größen (`small/medium/large`) sind
   wiederverwendet. Status-Klassen `.text-only` (sichtbar
   gedämpft, Saturation 0.65) und `.live` (volle Sättigung)
   machen den Unterschied „Geschichte folgt" vs. „Geschichte
   liegt vor" optisch lesbar. Eigenes `.station-modal` analog
   `.universe-modal` mit warm-goldenem Backdrop.

3. **HTML-Block Sonnen-Karte** als `<article class="card span-12
   sun-card" data-back-anchor="sonnen">` vor `.card.reading`
   eingefügt. Sechs Scene-Layer (Korona, konische Korona-Schicht,
   Sonnenscheibe, drei Sonnenflecken), Caption mit Klaus' O-Ton-
   Einleitung („Was macht man, wenn man auf eine Antwort wartet?
   …"), Klick öffnet via `goScreen('sonnen', 'sonnen')` den
   neuen Geschichts-Galerie-Screen.

4. **HTML-Block Geschichts-Galerie-Screen** als `<main
   id="screen-sonnen" class="screen sonnen-screen">` nach dem
   schließenden `</main>` von `screen-observatorium`. Trägt
   Canvas-Sterne, drei warm-goldene Nebel, einen leeren
   `#sonnen-galaxies`-Container (Galaxien werden per JS
   erzeugt), eine Hint-Bar („Vier Stationen · Klick öffnet die
   Geschichte.") und das `#station-modal` mit den vom Brief
   vorgegebenen IDs.

5. **`SCREENS`-Array** um `'sonnen'` erweitert.

6. **`goScreen()`** ruft `setupSonnenGalaxie()` bei `id ===
   'sonnen'` auf (einmalige Initialisierungs-Schranke im Setup
   selbst, kein doppeltes Init). **`applyHashScreen()`** mappt
   `h === 'sonnen'` auf den Zurück-Anker `'sonnen'` (analog
   `observatorium → blackhole`).

7. **JS-Block** nach `closeUniverseModal()`:
   - `STATIONS_DATA`-Array exakt wie im Brief (vier Einträge:
     drei `text-only` mit Platzhalter-Summaries für Stationen
     1–3, ein `live`-Eintrag für Station 4 mit
     `href: 'docs/papers/sbkim-paper-en.html'`).
   - `setupSonnenGalaxie()` baut Galaxien, Canvas-Sterne,
     startet den Render-Loop.
   - **Bewegungs-Mathematik** wie im Brief vorgegeben:
     `ANG_SPEED = (2 * Math.PI) / 50` (50 s Umlaufzeit),
     Phasen-Verteilung `(i / STATIONS_DATA.length) * Math.PI *
     2`, Ellipse `30 vw × 18 vh` zentriert bei 50/50.
     Eigenrotation läuft via CSS `@keyframes galaxy-spin` (vom
     Observatorium übernommen — kein Duplikat).
   - `openStationModal(idx)` baut den Body je nach Status:
     `text-only` zeigt nur `<p>`-Summary plus dezenten
     Platzhalter-Hinweis („Erzähl-Text folgt per Folge-Mini-
     Pflege."); `live` zeigt Summary plus „Original-Dokument
     öffnen →"-Link auf den `href`.
   - `closeStationModal()` versteckt das Modal; Esc-Listener
     hängt am `setupSonnenGalaxie()`-Init.

### Asset-Pflege

- **`docs/papers/README.md`** angelegt — kurze Erklärung des
  Ordners, Verweis auf Vision-Anker 10, Wachstums-Disziplin
  (neue text-only-Stationen brauchen den Ordner nicht; nur
  dokumentengestützte Stationen kommen hier rein),
  Privatheits-Klausel als Wiederholung.

### Was NICHT angefasst

- **Modul-Code in `src/modules/`** — der Brief verbietet das
  ausdrücklich; reiner Sage-Page-Bau.
- **`.blackhole-card` / Observatorium-Screen** — vollständig
  unverändert, optisches Pendant bleibt intakt.
- **`status.json`** — der Brief erlaubt nur den optionalen
  Eintrag `historie[]`; in dieser Sitzung bewusst weggelassen
  (additiv-niedrigster Wert, Folge-Mini-Pflege kann ihn
  jederzeit nachziehen).
- **`docs/INTERFACES.md`, Komponenten-Karten** — keine
  Schnittstellen-Änderung.
- **Privatheits-Klausel** — der Name „EVL." taucht
  weder in Code, noch in Kommentaren, noch in Modal-Texten,
  noch in Commit-Messages oder PR-Beschreibung auf. Geprüft
  vor Commit per Grep.

## Manueller Sichttest

**Offen** — Klaus prüft im Browser (Desktop + Tablet), ob:

- Die Sonnen-Karte zwischen Andock-Karte und Reading-Karte
  sichtbar ist, Hover die Pulsfrequenz halbiert, Klick den
  Geschichts-Galerie-Screen öffnet.
- Der Geschichts-Galerie-Screen lädt, vier Galaxien auf einer
  gemeinsamen Ellipsen-Bahn tanzen, gleichmäßig verteilt
  (Phasen 0°/90°/180°/270°), jede dreht sich zusätzlich um die
  eigene Achse.
- Klick auf eine Stations-Galaxie das Modal öffnet — Station 4
  zeigt den EN-Paper-Link, Stationen 1–3 zeigen den
  Platzhalter-Hinweis „Erzähl-Text folgt per Folge-Mini-
  Pflege.".
- Esc schließt das Modal, Backdrop-Klick auch, der „← Zurück
  zur Sage"-Button kehrt zur Übersicht zurück und scrollt zur
  Sonnen-Karte (data-back-anchor="sonnen").

Begründung „ungeprüft": Diese Sitzung läuft headless in der
ephemeren Cloud-Umgebung ohne Browser. Klaus' visuelle
Abnahme folgt am Tablet/DeX wie für die Schwarz-Loch-Karte
und das Observatorium-Universum.

## Was offen ist

- **Stationen 1–3 brauchen Erzähl-Text.** Per Konvention je eine
  Folge-Mini-Pflege pro Station (Klaus liefert den Inhalt, eine
  Pflege-Sitzung schreibt ihn in das `summary`-Feld der
  jeweiligen STATIONS_DATA-Zeile).
- **`status.json` erweiterbar** um ein `historie[]`-Feld
  (Stationen-Titel, Status, optional Datei) — optional, der
  Brief stuft es als „nicht Pflicht" ein.

## Nächster sinnvoller Schritt

Klaus liefert den ersten Stations-Erzähl-Text (welche Station
zuerst — Namensgebung, Medaille oder Geburt — entscheidet er);
eine Mini-Pflege-Sitzung trägt ihn in `STATIONS_DATA[<i>].
summary` ein und entfernt den Platzhalter-Hinweis (Status auf
`live` gegebenenfalls; bei rein textuellen Stationen bleibt
der Status `text-only` und es entfällt nur der Placeholder-
Hint, was über eine kleine Anpassung in `openStationModal`
geregelt werden kann — Folge-Pflege entscheidet).
