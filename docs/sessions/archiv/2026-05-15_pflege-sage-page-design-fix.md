# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Sage-Page Design-Fix

**Sitzungs-Rolle:** Pflege-Sitzung (eine Sitzung, eine Phase). Rein
visueller Page-Fix in `index.html` nach Klaus' Tablet-Sichttest. **Keine**
JS-Funktions-Änderung, **keine** Modul-Karten-Änderung, **keine**
INTERFACES.md-Änderung, **keine** `status.json`-Änderung, **kein**
Pie-Regenerate.
**Branch:** `claude/pflege-sage-page-design-fix`
**Anlass:** Klaus' Screenshots vom 2026-05-15 ~19:28–19:31 (Galaxy
Tab S6 + DeX, Chrome) zeigten drei Design-Bugs auf
`lausiklauskn-png.github.io/Sage-Protokol/`:
1. Modul-Bento (Karte 4): Modul 06 Heterokaryose und Modul 00
   Doku-Fenster brachen den Funktions-Listen-Text nicht und
   überliefen die Nachbar-Karte (Modul 07 Apoptose, Modul 08
   UI-Demo).
2. Lebenszyklus-Loop (Karte 3): Hub wirkt wie zwingender Mediator
   zwischen Rezept und Mixarium — widerspricht der Mycel-Spec
   (Eigenschutz-Karte 13 „Selbst wenn der Hub ausfällt, leben
   Direktverbindungen weiter"; Mini-Glossar „Hub: kein Endknoten,
   kein Vermittler").
3. Initialstart (Karte 5): „Mixarium" und „Rezept" am SVG-Rand
   angeschnitten.

---

## Auftrag

Klaus' Brief am Sitzungs-Start:

> zuerst PR mergen und danach die Screenshots betrachten und die
> grafischen Fehler beheben, Zeilenumbrüche korrigieren,
> Logiklücken schließen. nur Design verbessern, Funktionen
> unberührt lassen. Bei den Demos wo sich Elemente bewegen (z.B.
> Lebenszyklus usw.) wird der Rückfluss nicht richtig dargestellt,
> der Fluss geht immer nur in eine Richtung. Auch die Erklärungen
> müssten angepasst werden? Kommunizieren die Sender und Empfänger
> nicht irgendwann direkt ohne den Hub, oder besser gesagt nicht
> hauptsächlich über den Hub, Hub kann ausfallen, er ist nur ein
> Teil des Mycels.

Vorbedingung „PR mergen" erledigt: PR #36 (Spec-Sitzung 08) von
Draft → ready → squash-merged in `main` (commit
`f9b160012a47dc29b1574b474cb9d99b67dc49eb`). Diese Pflege-Sitzung
zweigt von `main` ab (`claude/pflege-sage-page-design-fix`).

---

## Was getan wurde

### 1. Karte 4 (Module-Bento) Wort-Umbruch-Fix

CSS-Änderung in `.mod` und `.mod-kurz`:

```css
.mod {
  ...
  overflow-wrap: anywhere; word-break: break-word;
  min-width: 0;
}
.mod-kurz {
  ...
  overflow-wrap: anywhere; word-break: break-word;
  hyphens: auto; line-height: 1.45;
}
```

Wirkung: lange Listen wie
`init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis`
(Modul 06) und
`init/open/close/isOpen/getStatusSnapshot/recordSighttest`
(Modul 00) brechen jetzt mitten im Funktionsnamen, statt in die
Nachbar-Karte zu überlaufen. `min-width: 0` löst das übliche
Flex-/Grid-„children dürfen schmaler als intrinsic-min werden"-
Problem.

### 2. Karte 3 (Lebenszyklus · Loop) Hub-Rolle korrigiert

**SVG-Markup** (`viewBox=0 0 600 280`) umstrukturiert:

- **Hub:** Radius `34 → 28`, Gradient-Opacity `0.9 → 0.6`, Sonar-
  Pulses gedämpft (von 2 Wellen auf 1 langsamere Welle, `r=120 →
  90`). Neuer Untertitel-Text unter dem Hub-Kreis: „Bootstrap ·
  kann ausfallen" (font-size 8, opacity 0.45).
- **Bisherige Hub-Linien** (Rezept→Hub, Mixar→Hub): bleiben drin
  als gestrichelte, dünne Bootstrap-Hinweise — `stroke-width 1 →
  0.8`, `stroke-dasharray 2 4 → 2 5`, Farbe von blau auf violett
  (`rgba(99,102,241,0.4) → rgba(139,92,246,0.3)`). Visuell deutlich
  zurückgenommen.
- **Neue Direktverbindung Rezept↔Mixarium:** durchgezogener
  `<path>` von `102,80` über `Q 300,30` nach `498,80` — quadratische
  Bézier-Bogen über den Hub-Bereich, deutlich sichtbar
  (`stroke-width: 1.8`, Farbe `#14B8A6` teal), mit atmender Opacity
  0.45..0.85 (`<animate dur=3.4s>`) — gleiche Atmung wie die
  Initialstart-Karte 5 Mycel-Linie, optisch konsistent.
- **Particle-Streams** komplett umgebaut. Vorher: 4 Particles über
  den Hub (Rezept→Hub, Mixar→Hub, Hub→Rezept, Hub→Mixar). Nachher:
  2 Particles **direkt** auf dem neuen Bogen-Pfad:
  - `#F59E0B` (gold) Rezept→Mixar — Anfrage fließt hin.
  - `#14B8A6` (teal) Mixar→Rezept — Antwort fließt zurück, mit
    `begin=2.3s` versetzt, sodass beide Richtungen sichtbar
    werden, ohne sich gegenseitig zu verdecken.

**Phase-Pills** (DOM-Text, JS-Logik unverändert):

- Pill 3: „Anastomose" → „**Anastomose · Direktfaden entsteht**".
- Pill 4: „Antwort fließt zurück" → „**Antwort fließt direkt
  zurück**".

**Neuer Untertitel** unter den Pills (`<p class="card-sub">`):

> Der Hub ist nur Bootstrap (Erstkontakt). Sobald die Anastomose
> steht, läuft der Fluss **direkt zwischen den Knoten** — Hub kann
> ausfallen, das Mycel lebt weiter.

### 3. Karte 11 (Detail-Tour, `#screen-cycle`) Phase 3 + 4
Erklärungen angepasst

`TOUR`-Array in `<script>`-Block (Index 2 + 3) angepasst:

- **Phase 3 „Anastomose · Hyphenfusion"** → „Anastomose ·
  Hyphenfusion (**Direktfaden**)". Bio-Block ergänzt: „Ab hier
  kennen sich beide direkt; der Hub wird für diese Beziehung
  nicht mehr gebraucht." Mech-Block neu: „Handshake direkt
  zwischen den Endknoten: Spore-Tausch + Pubkey-Verifikation +
  Domain-Match. Der Hub vermittelt nur den Erstkontakt
  (Wurzelverzeichnis); danach ist er austauschbar — er kann
  ausfallen, ohne dass die Anastomose stirbt." Code-Kommentar
  ergänzt: „POST geht direkt an peer.endpoint, NICHT über den Hub".
- **Phase 4 „Antwort fließt zurück"** → „Antwort fließt **direkt**
  zurück". Bio-Block ergänzt: „Der Fluss läuft jetzt zwischen den
  Endknoten; der Hub ist nur noch eine von vielen Adress-Quellen,
  nicht der Pfad." Mech-Block ergänzt: „Kein Single Point of
  Failure: jeder Knoten hält seine eigene Geschwister-Liste in
  IndexedDB, Direktverbindungen leben weiter, auch wenn der Hub
  offline geht."

### 4. Karte 5 (Initialstart · Wie das Mycel beginnt) viewBox-Fix

- **viewBox** `0 0 320 240` → `0 0 360 260` (mehr Innenraum).
- **Hub-cx** 160 → 180 (mittig in neuer Breite).
- **Mixarium-cx** 60 → 78; **Rezept-cx** 260 → 282 (vom Rand weg).
- **Mixarium-cy / Rezept-cy** 180 → 190 (mehr Platz oben).
- **Mycel-Linie** zwischen den Endknoten an neue Koordinaten
  angepasst: `x1=82,x2=238` → `x1=100,x2=260`.
- **Andock-Linien Hub→Mixarium/Rezept** an neue Koordinaten
  angepasst und leicht abgedämpft (`stroke-width 1.2 → 1.1`,
  opacity `0.5 → 0.45`).
- **Neuer Hub-Untertitel** „nur Bootstrap" unter „Wurzelverzeichnis"
  (font-size 7, opacity 0.32, letter-spacing 0.6).
- **§ Cold-Foot-Liste Punkte 1 + 2 überarbeitet:**
  - Punkt 1: „Erste Reise braucht erste Peers. Der Hub ist die
    Wurzel — **Wurzelverzeichnis, an dem ein neuer Knoten sich
    einmal listet**." (statt „wer andockt, ist dort gelistet").
  - Punkt 2: „… Mixarium und Rezeptbuch sehen einander **direkt**,
    sobald beide angedockt sind — **der Hub ist danach nicht mehr
    im Pfad**." (Direkt-Akzent ergänzt.)

### 5. Karte 8 (Mini-Glossar) Eintrag „Hub" präzisiert

Vorher: „Dieses Repo. Wurzelverzeichnis, kein Endknoten."

Nachher: „Dieses Repo. **Wurzelverzeichnis für den Erstkontakt**
— kein Endknoten, kein Vermittler. **Sobald zwei Knoten sich
kennen, läuft der Fluss direkt zwischen ihnen; der Hub kann
ausfallen.**"

---

## Was bewusst nicht geändert wurde

- **Keine JS-Funktions-Änderung.** `tickPhase` /
  `setInterval(tickPhase, 2400)` läuft unverändert (Phase-Pill-
  Zyklus). `buildWander`, `TOUR`-Array-Struktur, Module-Grid-
  Rendering, Bau-Puls-Pie, `status.json`-Fetch, `goScreen`,
  alle Handler unverändert. Die Änderung im `TOUR`-Array war nur
  Inhalt der `bio`/`mech`/`code`-Strings, keine Logik.
- **Keine `status.json`-Änderung.** `lastUpdated: 2026-05-15` war
  durch Spec-Sitzung 08 (gleichen Tag) bereits gesetzt. Pie nicht
  regeneriert (keine Modul-Daten-Änderung).
- **Keine Modul-Karten-/INTERFACES.md-Änderung.**
- **Keine `tests/manual_check.html`-Änderung.**
- **Keine Hub-Entfernung aus dem SVG.** Der Hub bleibt sichtbar —
  er ist *real* der Bootstrap-Punkt (Spore-Endpoint `/sbkim/spore.json`,
  Wurzelverzeichnis). Die Pflege macht nur klar, dass er nicht der
  Vermittler ist.
- **Keine Karte-12-(Wanderung)-Änderung.** Dort ist der Particle-
  Pfad schon korrekt: Pfad A (`home → n1 → n2 → n5 → home`)
  schließt zurück — Rückfluss vorhanden; Pfad B fadet aus
  (Apoptose, gewollt einseitig). Kein Eingriff nötig.
- **Keine Module-Grid-Höhen-Vereinheitlichung.** Bento-typisch
  bleiben Karten in einer Reihe unterschiedlich hoch — kein Layout-
  Bug, nur visueller Charakter.

---

## Frischer-Kopf-Befund

Klaus' Beobachtung „der Fluss geht immer nur in eine Richtung" war
**nur teilweise zutreffend** — das Lebenszyklus-Loop-SVG hatte
**vorher schon** Rückfluss-Particles (`#14B8A6` Hub→Rezept und
Hub→Mixar mit `begin=2s` versetzt). Aber: alle vier Pfade liefen
*durch den Hub*, was den Eindruck eines zwingenden Mediators
erzeugt hat. Die echte Spec-Aussage ist:

- **Karte 13 § Dezentralität:** „Kein Zentralspeicher. Jeder Knoten
  hält seine eigene Spore-Sammlung in IndexedDB. Selbst wenn der
  Hub ausfällt, leben Direktverbindungen weiter."
- **Karte 05 § Anastomose-Pfad:** Handshake POST geht direkt an
  `peer.endpoint`, nicht an `hub.endpoint`.
- **`sbkim_paper.pdf` §1.4 „Welt ohne Riesen":** kein wirtschaftlicher
  Anreiz für zentrale Vermittlung; jeder Knoten ist eigenständig.

Die Pflege löst beides: sichtbarer Direktfluss (Particles auf dem
neuen Bogen-Pfad) + sichtbarer Rückfluss (zweite Particle versetzt
in Gegenrichtung) + Hub als Bootstrap markiert (Untertitel,
gedämpfte Linien, Größen-Reduktion).

---

## Was offen blieb

- **Klaus' Re-Sichttest der Page nach diesem Fix** im Tablet-Browser
  ausstehend. Sollte zeigen:
  - Kein Text-Overlap mehr in Karte 4 (Module-Bento).
  - Direkte Mycel-Linie + Bootstrap-Untertitel in Karte 3.
  - „Mixarium"/„Rezept" nicht mehr abgeschnitten in Karte 5.
  - Phase 4 Pill liest „Antwort fließt direkt zurück".
  - Bei Klick „Schritte erklären →": Phase 3 + 4 Texte enthalten
    die Direkt-/Hub-kann-ausfallen-Aussagen.
- **Folge-Pflege Bau 06.1 (Outbox-Lese-Pfad in
  `src/modules/06_heterokaryose.js`)** weiter offen — Spec-Sitzung
  08 hat den Vertrag spezifiziert, der Code-Pfad fehlt.
- **Bau-Sitzung Modul 08, Bau-Sitzung Modul 09 zweite Iteration,
  Klaus' Sichttest Panel 06** weiter offen.
- **PULS-400-Zeilen-Konvention** weiter überfällig.

---

## Nächster sinnvoller Schritt

1. **Klaus' Re-Sichttest der Page** im Browser/Tablet nach diesem
   Design-Fix. *Nicht headless.*
2. **Folge-Pflege Bau 06.1 (Outbox-Lese-Pfad in
   `06_heterokaryose.js`)** — *headless möglich*, kleine Pflege.
3. **Bau-Sitzung Modul 08** — Endknoten-Code für `SbkimUiDemo`.
   *Headless möglich.*
4. **Bau-Sitzung Modul 09 zweite Iteration** mit Klaus am Live-
   Andock-Versuch. *Nicht headless.*

---

## Pflicht-Häkchen am Sitzungsende

- [x] PR #36 (Spec-Sitzung 08) gemerged (Draft → ready → squash;
      commit `f9b160012a47dc29b1574b474cb9d99b67dc49eb`)
- [x] Neuer Branch `claude/pflege-sage-page-design-fix` von `main`
- [x] `index.html` Karte 4 Wort-Umbruch-Fix (`.mod` + `.mod-kurz`
      mit `overflow-wrap: anywhere`)
- [x] `index.html` Karte 3 SVG Hub als Bootstrap (gedämpfte Größe/
      Sonar/Linien, Untertitel „Bootstrap · kann ausfallen")
- [x] `index.html` Karte 3 SVG direkte Mycel-Verbindung Rezept↔Mixar
      (durchgezogen teal, atmend)
- [x] `index.html` Karte 3 SVG Particle-Streams direkt
      (Anfrage hin + Antwort zurück, versetzt)
- [x] `index.html` Karte 3 Phase-Pills 3 + 4 Text angepasst,
      neuer Untertitel
- [x] `index.html` Karte 11 (`TOUR`-Array) Phase 3 + 4 bio/mech/code
      angepasst (Direktfluss-Wording)
- [x] `index.html` Karte 5 SVG viewBox `320 240 → 360 260`, alle
      Koordinaten nach innen verschoben, Hub-Untertitel „nur
      Bootstrap"
- [x] `index.html` Karte 5 Cold-Foot Punkte 1 + 2 überarbeitet
- [x] `index.html` Karte 8 Mini-Glossar-Eintrag „Hub" präzisiert
- [x] HTML-Tag-Bilanz geprüft (`<section>`/`</section>` 22/22,
      `<svg>`/`</svg>` 14/14)
- [x] **Keine JS-Funktions-Änderung** (nur SVG-Markup + Text-
      Inhalte + CSS)
- [x] **Keine `status.json`-Änderung**, **kein Pie-Regenerate**
- [x] **Keine Modul-Karten-/INTERFACES.md-/tests-Änderung**
- [x] PULS Sitzungs-Eintrag oben (Getan / Was nicht / Frischer-Kopf /
      Offen / Nächster Schritt)
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/pflege-sage-page-design-fix` (folgt)
- [ ] Draft-PR gegen `main` (folgt)
