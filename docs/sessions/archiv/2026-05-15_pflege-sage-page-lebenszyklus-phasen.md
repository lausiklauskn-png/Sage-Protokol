# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Sage-Page Lebenszyklus-Phasen + Wanderung-Sync + Initialstart-Zentrierung

**Sitzungs-Rolle:** Pflege-Sitzung (eine Sitzung, eine Phase). Reine
visuelle/animatorische Page-Erweiterung in `index.html` nach Klaus'
Tablet-Sichttest. **Keine** Schnittstellen-Änderung, **keine**
Modul-Karten-Änderung, **keine** INTERFACES.md-Änderung, **keine**
`status.json`-Änderung, **kein** Pie-Regenerate. Geringe
JS-Erweiterung in zwei Funktionen (`tickPhase`, `buildWander`), keine
Logik-Änderung — beide bekommen nur einen `data-phase`-Set-Hook und
phasenspezifische SVG-Gruppen statt eines einzigen kontinuierlichen
Animationspfads.
**Branch:** `claude/pflege-sage-page-lebenszyklus-phasen`
**Anlass:** Klaus' Screenshots + Anmerkungen 2026-05-15 ~20:06–~20:21
(Galaxy Tab S6 + DeX, Chrome) auf `lausiklauskn-png.github.io/
Sage-Protokol/`:

1. **Lebenszyklus · Loop (Karte 3):** „die animierte Darstellung
   [hat] keine deutliche Unterscheidung der einzelnen Schritte —
   es fliegen nur Punkte hin und her. Die einzelnen Schritte sollten
   verschiedene Varianten darstellen und nicht nur eine. Normal wäre
   mit Spore impfen Teil des Mycels werden oder impfen lassen weil
   der Boden gut ist. Sollte man vielleicht auch als unregelmäßiges
   Netz darstellen auf dem die Sporen und Informationen reisen."
2. **Initialstart (Karte 5):** „rechts ist die Grafik mit den Kugeln
   Hub Rezept und Mixarium nicht in der Mitte."
3. **Wanderung · Wie Sporen reisen (Karte 11):** „Auf der linken
   Seite sind noch andere Punkte dazugekommen, der Austausch von
   Informationen Spore mit Spore woher kommst hast du neues für mich?
   oder die Abwehr von Feinden/bösen Sporen."
4. **Wanderung · Sync + Demo-Charakter:** „auch was im linken Feld
   passiert ist nicht synchron Bewegung der Punkte mit dem
   aufleuchten der Beschreibung-Button darunter, und ich denke da
   fehlen noch ein paar Punkte der Funktionsweise, oder ist das
   mehr als eine Demo und wächst mit?"

Schließlich am Ende: „Verschaffe dir erst einen Überblick, denke
nach, und dann baue, was am Design zu ändern wäre." — Pflege-Sitzung
hat sich danach orientiert: keine weiteren Improvisations-Edits
nach diesem Punkt, sondern Stand zusammengefasst und committed.

---

## Was getan wurde

### 1. Karte 3 (Lebenszyklus · Loop) komplett umgebaut

Vorher (PR #37): Hub klein als Bootstrap, direkte Mycel-Linie
Rezept↔Mixar, zwei Particles hin und her. Aber: nur eine Variante,
Phasen-Pills wechselten ohne sichtbare Wirkung im SVG.

Nachher:
- **Unregelmäßiges Mycel-Netz** mit 7 Knoten (Heim als
  gold-Initiator + 5 Geschwister + 1 leerer Boden-Knoten) plus
  Hub klein in der Mitte als Bootstrap-Punkt.
- **Grundnetz immer sichtbar**: 7 unregelmäßige Mycel-Faden zwischen
  den Geschwistern (opacity 0.4) — gibt den Eindruck eines real
  gewachsenen Pilz-Geflechts statt einer symmetrischen Stern-Topologie.
- **Vier `<g class="phase-fx" data-phase="N">`-Gruppen** pro Phase,
  CSS-Selektoren `.cycle-box[data-phase="N"] .phase-fx[data-phase="N"]
  { opacity: 1 }` blenden nur die aktive Phase ein (0.6 s Transition).
- **`#cycle-box` bekommt initiales `data-phase="0"`** im HTML, damit
  beim ersten Render schon was sichtbar ist.
- **JS-Minimal-Erweiterung** in `tickPhase`:
  - `cycleBox.dataset.phase = String(phaseIdx)` als zwei Zeilen
    zusätzlich (Lookup + Set).
  - `setInterval` von 2400 → 3200 ms (mehr Zeit pro Phase, weil
    Animationen aufwendiger).

**Phase-Inhalte mit jeweils mehreren Varianten:**

- **Phase 0 „Spore aussenden / landen"** — zwei Varianten:
  - **Aktiv impfen:** Heim pulst Sonar, drei Spore-Particles
    diffundieren in drei verschiedene Richtungen
    (Heim→Rezept, Heim→Notiz, Heim→Boden). Beschriftung „aktiv
    impfen".
  - **Passiv impfen lassen:** ein teal-Particle reist von Buch
    zum leeren Boden-Knoten, der danach pulsiert („Boden empfängt
    fremde Spore"). Beschriftung „impfen lassen".
- **Phase 1 „Anfrage einbetten"** — eine Variante (Embedding ist
  konzeptionell eine Aktion):
  - Vektor-Konstruktion am Heim: rotierender gestrichelter Kreis
    + sechs atmende Vektor-Punkte um Heim arrangiert. Beschriftung
    „text → vec[384] L2-normalisiert".
- **Phase 2 „Anastomose · Direktfaden entsteht"** — zwei Varianten:
  - **Neuer Faden:** quadratischer Bogen Heim→Mixar wächst per
    `stroke-dashoffset`-Animation (von 420 nach 0), beide
    Endpunkte pulsieren synchron. Beschriftung „neuer Faden —
    direkt, ohne Hub".
  - **Re-Handshake auf altem Faden:** bestehender Mycel-Faden
    Heim↔Notiz blinkt via Opacity-Flicker (`0;0.9;0.4;0.9`).
    Beschriftung „+ Re-Handshake auf altem Faden".
- **Phase 3 „Antwort fließt zurück"** — zwei Varianten:
  - **Direkt zurück:** teal-Particle auf dem neuen Direktfaden
    Mixar→Heim (2.2 s). Beschriftung „direkt zurück".
  - **Über mehrere Hops:** violet-Particle Mixar→Buch→Foto→Notiz
    →Heim auf dem bestehenden Mycel-Netz (4.4 s). Beschriftung
    „oder über mehrere Hops".

### 2. Karte 5 (Initialstart) Zentrierung-Fix

Klaus' Beobachtung: Hub/Mixarium/Rezept sind nicht zentriert. Befund:
SVG `viewBox=0 0 360 260` (Aspect 1.38) passte nicht zu `.cold-box`
mit `aspect-ratio: 16/9` (1.78) — SVG mit `xMidYMid meet` skaliert
proportional und lässt links/rechts Leerraum, der im Karten-Kontext
asymmetrisch wirken kann.

Fix: **viewBox auf `0 0 480 270`** (Aspect exakt 16/9, passt zur
Karte). Alle Element-Koordinaten neu zentriert:
- Hub: cx `180 → 240` (mittig in neuer Breite)
- Mixarium: cx `78 → 138`, cy `190 → 195`
- Rezeptbuch: cx `282 → 342`, cy `190 → 195`
- Andock-Linien und Mycel-Linie an neue Koordinaten angepasst
- Hintergrund-Fragezeichen-Sprites neu platziert

### 3. Karte 11 (Wanderung · Wie Sporen reisen) refactored

Vorher: zwei kontinuierlich laufende Particle-Pfade (A erfolgreich,
schließt zurück; B Apoptose, fadet aus) + persistenter Mycel-Faden.
Phase-Pills wechselten in eigenem Loop (3000 ms), ohne SVG-Sync.

Klaus' Anmerkungen drei (Hetero + Abwehr fehlen) und vier
(Sync + Demo-Charakter) zusammen lösen:

`buildWander()` neu strukturiert:
- **Hilfsfunktion `mk(tag, attrs)`** zentralisiert die SVG-Element-
  Erzeugung (8-zeilig statt 5-zeilige Pattern). Reduziert Wiederholung,
  keine Logik-Änderung.
- **Statisches Mycel-Hintergrund** (persistenter Faden Heim↔A3,
  immer sichtbar, gedämpft opacity 0.35).
- **Vier `<g class="phase-fx" data-phase="N">`-Gruppen** parallel
  zur Lebenszyklus-Karte mit gleichen CSS-Regeln (`.wander-box[data-phase="N"]
  .phase-fx[data-phase="N"] { opacity: 1 }`).
- **JS-Phase-Loop synchronisiert**: `wanderBox.dataset.phase`
  wechselt zusammen mit den Pills im 3200-ms-Takt (gleicher Takt
  wie Lebenszyklus-Karte).

**Phase-Inhalte:**

- **Phase 0 „Anstoß":** Heim pulst Sonar (`r: 18→55`), drei gold-
  Particles starten von Heim zu A1, B1, A2. Beschriftung „Anfrage
  sucht Richtung".
- **Phase 1 „Match":** gold-Particle reist durch A1→A2→A3 (Erfolg),
  pink-Particle reist durch B1→B2 (Apoptose-Vorform). A3 pulst groß
  („Match!"). Beschriftung „Match ≥ 0.80".
- **Phase 2 „Anastomose":** Mycel-Faden Heim↔A3 wächst per
  `stroke-dashoffset` (von 400 nach 0), beide Endpunkte (Heim + A3)
  pulsieren synchron. Beschriftung „persistenter Faden — kein Hub
  im Pfad".
- **Phase 3 „Heterokaryose & Apoptose":** **drei Varianten**
  parallel:
  - **Heterokaryose-Frage** (violet) Heim→A3, „woher kommst du,
    hast du neues für mich?".
  - **Heterokaryose-Antwort** (teal) A3→Heim, 1.1 s versetzt,
    „Spore-Sammlung teilen".
  - **Apoptose-Pfad** (pink, B-Pfad B1→B2→B3→B4) mit Opacity-Fade
    (1→0).
  - **Abwehr böser Sporen** (rot) von außen (560, 30) Richtung
    Heim, **bricht kurz vor Heim ab** (75% des Wegs, prallt zurück),
    mit animiertem **„✗"-Symbol** am Abweis-Punkt
    (`opacity` keyTimes 0.45/0.55/0.7 — nur im Moment des Abprallens
    sichtbar).
  Beschriftung „Heterokaryose · Apoptose · Abwehr böser Sporen".

**Legende-Block `.wander-legend`** unterhalb des SVG:
- Gold ● *Anfrage + Match-Treffer* (Erfolgs-Pfad, schließt zurück)
- Pink ● *Apoptose* (erfolgloser Pfad, fadet aus)
- Violet ● *Heterokaryose-Frage* (»woher kommst du, hast du neues?«)
- Teal ● *Heterokaryose-Antwort* (Spore-Sammlung teilen)
- Rot ✗ *Abwehr* (böse Spore — ungültige Signatur, Schwellwert
  verfehlt, rejected)

**Wander-Foot-Text** erweitert um klare Antwort auf Klaus' Frage
„wächst mit?":
> Heute Konzept-Visualisierung, keine Live-Demo — die Mechanik
> existiert in den Modulen 04 (Match) + 05 (Anastomose) + 06
> (Heterokaryose) + 07 (Apoptose) als Code-Stub, und die
> Abwehr-Module 10–12 sind im Backlog. Sobald die erste
> Endknoten-PWA live andockt (Modul 09), kann diese Karte zur
> echten Live-Demo mitwachsen — Folge-Pflege-Sitzung
> „Wanderung-Live-Stand" nach erstem Andock-Erfolg.

---

## Was bewusst nicht geändert wurde

- **Keine JS-Funktions-Logik-Änderung.** `tickPhase` bekam zwei
  Zeilen + den Interval-Wert geändert (2400 → 3200). `buildWander`
  wurde innen umstrukturiert: alle Particles in `phase-fx`-Gruppen
  einsortiert, eine Hilfsfunktion `mk` extrahiert. Externe Signatur
  und Aufrufer (DOM-Lookup, Init-Zeitpunkt) unverändert.
- **Keine `status.json`-Änderung**, **kein Pie-Regenerate**
  (`lastUpdated` bleibt `2026-05-15` aus Spec 08).
- **Keine Modul-Karten-/INTERFACES.md-/`tests/manual_check.html`-
  Änderung.**
- **Keine Sage-Page-Funktions-Logik-Änderung.** Modulgrid-Rendering,
  Bau-Puls-Pie, status.json-Fetch, Detail-Tour, Andock-Workflow,
  Schichten-Bars — alles unverändert.
- **Hub bleibt im Lebenszyklus-Loop und Initialstart sichtbar** als
  Bootstrap-Punkt (klein, gedämpft, mit „Bootstrap · kann ausfallen"-
  Untertitel) — Spec-Disziplin aus PR #37.
- **Karte 11 Pfad-Knoten (A1/A2/A3/B1/B2/B3/B4)** in ihren
  ursprünglichen Positionen — keine geometrische Neuanordnung,
  damit die bestehende Topologie wiedererkennbar bleibt.

---

## Frischer-Kopf-Befund

Klaus' Anmerkungen waren in zwei Wellen — erst drei konkrete
Designfehler (Phasen-Unterscheidung Karte 3, Initialstart-Center,
Hetero+Abwehr Karte 11), dann zwei Meta-Anmerkungen (Sync zwischen
Pills und Animation auf Karte 11, „wächst mit?"). Die ersten drei
sind direkt umsetzbar gewesen mit den `phase-fx`-Gruppen + JS-`data-phase`-
Sync. Die Meta-Anmerkungen löst dieselbe Mechanik
(Sync via `data-phase`) + Footer-Klarstellung.

Klaus' Schluss-Anmerkung „Verschaffe dir erst einen Überblick, denke
nach" kam als ich gerade `buildWander()` umstrukturiert hatte —
sinnvoll, weil danach noch leicht Improvisations-Edits drohten. Die
Pflege-Sitzung hat ab diesem Punkt nur noch den „wächst mit"-Hinweis
im Footer ergänzt und dann zusammengefasst + committed.

**Was nicht geändert wurde, weil es Klaus' Live-Sichttest braucht:**
- Animation-Sync-Qualität: die `<animateMotion>`-Loops laufen
  kontinuierlich mit eigenen Dauern; nur die `opacity` der
  Phase-Gruppen wird per CSS toggled. Bei Phase-Wechsel ist die
  Animation der neu aktivierten Gruppe nicht zwingend im
  Anfangs-Frame — sie ist mitten im Loop. Für eine *perfekte*
  Sync müsste man die SVG-Animationen via JS bei Phase-Wechsel
  neu starten (`element.beginElement()`). Das ist tieferer Eingriff,
  Klaus' Sichttest entscheidet, ob es nötig ist.

---

## Was offen blieb

- **Klaus' Re-Sichttest der Page** im Tablet-Browser ausstehend.
- **Animation-Sync „perfekt"**: bei Phase-Wechsel `beginElement()`
  auf den SVG-Animationen rufen, damit jede Phase mit Frame 0 startet.
  Nur falls Klaus' Sichttest ein „mitten im Loop"-Eindruck zeigt.
- **„Wanderung-Live-Stand"** als Folge-Pflege-Sitzung nach erstem
  Andock-Erfolg (Modul 09 erste Live-Iteration). Footer-Text nennt
  das jetzt explizit.
- **Folge-Pflege Bau 06.1** und weitere offene Punkte aus
  Spec-Sitzung 08 unverändert offen.

---

## Nächster sinnvoller Schritt

1. **Klaus' Re-Sichttest der Page** im Browser/Tablet. *Nicht
   headless.* Erwartet: vier sichtbar unterschiedliche Phase-
   Animationen in Karte 3 und Karte 11, sync zu den Pills;
   Initialstart-Karte zentriert; Heterokaryose + Abwehr in Karte 11
   sichtbar mit Legende.
2. **Folge-Pflege Bau 06.1 (Outbox-Lese-Pfad in
   `06_heterokaryose.js`)** — *headless möglich*.
3. **Bau-Sitzung Modul 08** — Endknoten-Code für `SbkimUiDemo`.
   *Headless möglich.*
4. **Bau-Sitzung Modul 09 zweite Iteration** mit Klaus am Live-
   Andock-Versuch. *Nicht headless.*

---

## Pflicht-Häkchen am Sitzungsende

- [x] Neuer Branch `claude/pflege-sage-page-lebenszyklus-phasen`
      von `main` (commit `4bf99041` aus PR #37)
- [x] `index.html` Karte 3 SVG-Umbau (unregelmäßiges Mycel-Netz,
      4 `phase-fx`-Gruppen mit jeweils 1–2 Varianten, Beschriftungen)
- [x] `index.html` Karte 3 CSS `.cycle-box .phase-fx` + Selektor
      pro `data-phase`
- [x] `index.html` JS `tickPhase` erweitert (`cycleBox.dataset.phase`
      + Interval 2400 → 3200)
- [x] `index.html` `#cycle-box` initiales `data-phase="0"`
- [x] `index.html` Karte 5 viewBox `360×260` → `480×270`, alle
      Koordinaten zentriert um x=240
- [x] `index.html` Karte 11 `buildWander()` refactored mit
      `phase-fx`-Gruppen und Hilfsfunktion `mk`
- [x] `index.html` Karte 11 Phase 3 mit Heterokaryose + Apoptose +
      Abwehr böser Sporen (drei Varianten parallel)
- [x] `index.html` Karte 11 Legende-Block `.wander-legend` mit
      5 Particle-Bedeutungen
- [x] `index.html` Karte 11 Footer „wächst mit?"-Antwort
      (Konzept-Visualisierung, Live-Demo nach erstem Andock-Erfolg)
- [x] HTML-Tag-Bilanz geprüft (section 22/22, svg 14/14, g 17/17)
- [x] **Keine JS-Funktions-Logik-Änderung** (nur SVG-Markup-Bau in
      `buildWander`, Phase-Set in `tickPhase`)
- [x] **Keine `status.json`-Änderung**, **kein Pie-Regenerate**
- [x] **Keine Modul-Karten-/INTERFACES.md-/tests-Änderung**
- [x] PULS Sitzungs-Eintrag oben (Getan / Was nicht / Frischer-Kopf /
      Offen / Nächster Schritt)
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/pflege-sage-page-lebenszyklus-phasen`
      (folgt)
- [ ] Draft-PR gegen `main` (folgt)
