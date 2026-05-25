# Brief — Spec-Sitzung 15 + 16 Floating-Widget

**Anlass:** Klaus' Sichttest 2026-05-25 nach den ersten beiden externen
Endknoten-Bau-Sitzungen (Mein-Rezeptbuch + Mein-Mixarium nach Pflege
PR #162). UI-Befund:

- **Mein-Rezeptbuch:** Lampen + Siegel-Badge nehmen zu viel Platz in
  der oberen Navleiste.
- **Mein-Mixarium:** Navleiste vollständig ausgefüllt — keine
  Atemluft für die App-eigenen Header-Elemente.
- **Nicht einheitlich:** Beide Endknoten haben unterschiedliche
  Header-Strukturen; der Brief verlangte einen `.lamps`-Container,
  den manche Endknoten gar nicht haben (und der dort nachgerüstet
  Platz frisst, den die App-UX braucht).
- **Kein User-X-Schließen:** Wer das Badge ausblenden möchte, kann
  es nicht (Anti-Greenwashing-Klausel verbietet das Anzeigen ohne
  Selbst-Prüfung-grün, nicht das User-Verbergen).
- **Kein Drag:** Position ist hartkodiert in der Navleiste; der User
  kann sie nicht verschieben.

**Klaus' Architektur-Forderung (2026-05-25, Chat-Sitzung Pflege
Endknoten-Migration):**

> „Am besten wäre es natürlich, wenn diese Siegel oder diese in einem
> beweglichen Tab oder in einem beweglichen Modul, so ähnlich wie
> Eruda, das Tool, auch frei beweglich irgendwo hingesetzt werden
> können. Sie könnten dann auch selber entscheiden, ob Sie's
> wegklicken mit einem x oder nicht. […] Wir müssen uns auf ein
> einheitliches Modul einigen, das jederzeit weitergegeben werden
> kann."

**Tafel-Evolutions-Klausel** (CLAUDE.md § Heilige Tafeln) — die
existierenden Tafeln (Karte 15 § Sub (e) Navleisten-Lampe, Karte 16
§ Sub (b) Badge-Rendering mit `.lamps`-Container-Anker) waren
scope-bezogen auf die Sage-Page-Optik; Klaus' UI-Befund zeigt, dass
sie für fremde Endknoten-Layouts nicht skalieren. Bewusste
Anpassung statt stillschweigendes Umgehen.

**Branch (Vorschlag):** `claude/spec-15-16-floating-widget`

**Voraussetzungen:**

- Karte 15 + Karte 16 + Karte 09 sind verbindlich auf main (Stand
  2026-05-25 nach PR #162).
- Modul 15 + 16 Code-Stubs liegen (`src/modules/15_membran.js`,
  `src/modules/16_siegel.js`) — bleiben Backends, werden NICHT
  umgeschrieben in dieser Spec-Sitzung.

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (insbesondere § Heilige Tafeln § Tafel-Evolutions-Klausel
   + § Pipeline-Reihenfolge)
2. docs/PULS.md (Schnellüberblick + jüngste Sitzungs-Einträge
   2026-05-25 Pflege Endknoten-Migrations-Brief erweitern)
3. docs/components/15_membran.md (KOMPLETT — § Sub (e) Lampe + Modal,
   § Sub (a) Read-API, § Sub (b) postMessage-Brücke, § Strikte Tabus,
   § Bauzustand)
4. docs/components/16_siegel.md (KOMPLETT — § Sub (a) Pflicht-Modul-
   Liste, § Sub (b) Badge-Rendering, § Sub (c) Modal, § Sub (d)
   Aspekte-Schema, § Strikte Tabus, § Bauzustand)
5. docs/components/09_einbau_pwa.md § Schritt 10 + Schritt 11 (die
   bestehenden Einbau-Schritte, die durch diese Spec ersetzt werden)
6. docs/components/00_doku_fenster.md § 5-Klick-Geste (Vorbild für
   User-Wiederherstellungs-Pfad)
7. index.html der Sage-Page Z. 41–45 + Z. 116–134 + Z. 716–723 (die
   bestehende Navleisten-Lampen-Optik, bleibt erhalten als Sage-Page-
   spezifischer Pfad)
8. src/modules/15_membran.js + src/modules/16_siegel.js — Selbstcheck-
   Zeilen am Skript-Ende + die `init({lampSelector, badgeSelector,
   …})`-Signaturen (was bleibt unverändert, was wird neu aufgesetzt)

Deine Aufgabe:

PRIMÄR — Spec-Sitzung „Floating-Widget für Modul 15 + 16":

Ziel: Ein gemeinsames floating Mini-Panel (Eruda-Stil) bündelt
FREMD-Lampe + Siegel-Badge in einem einzelnen self-mountenden
Modul. Endknoten-Einbau auf eine Zeile <script> + eine Zeile
init() reduzieren. Modul 15 + 16 Backends bleiben unverändert.

Spec-Punkte zu klären + in einer NEUEN Karte
`docs/components/17_floating_widget.md` zu dokumentieren (Modul-
Nummer 17 als nächste freie Stelle nach Modul 16):

1. **Modul-Name + Funktions-Surface.** Vorschlag:
   `window.SbkimWidget = {init, show, hide, isVisible, getPosition,
   _meta}`. `init({allowedOrigins, repoUrl, defaultCorner, …})` ist
   der einzige Einbau-Pfad; Endknoten ruft NICHT mehr
   `SbkimMembrane.init` und `SbkimSiegel.init` direkt — `SbkimWidget`
   tut das intern. (Klärungs-Frage: ist `SbkimWidget.init` der
   neue alleinige Einbau-Pfad, oder dürfen Endknoten weiterhin
   wählen zwischen direktem `SbkimMembrane.init` + `SbkimSiegel.init`
   und dem gebündelten `SbkimWidget.init`?)

2. **Self-Mount.** Widget fügt sich beim `init()` selbst in
   `<body>` ein — als `<div id="sbkim-widget" class="sbkim-widget
   sbkim-widget-pos-…">…</div>`. KEIN Container-Anker im Endknoten-
   HTML, KEINE `.lamps`-Klasse, KEINE `--lamp-alert` / `--siegel-
   gold`-Variablen kopieren. Standalone-CSS inline im Widget-Script
   (z.B. via `<style>`-Element, das das Widget bei `init()` ans Ende
   von `<head>` injiziert) ODER als Shadow-DOM-Wrapper (Klärungs-
   Frage: inline `<style>` vs. Shadow-DOM — Shadow isoliert sauber,
   `<style>` ist einfacher und der bestehende Modul-15-/16-Modal-
   Code arbeitet schon mit document-Body-Mount).

3. **Layout.** Kompakte Pille, ~80–100 px breit × 40 px hoch,
   nebeneinander zwei Plaketten: FREMD-Lampe links, Siegel-Badge
   rechts. Optional ein dezenter Drag-Griff zwischen ihnen (oder die
   ganze Pille ist drag-fähig). Klärungs-Fragen:
   - Drag-Griff sichtbar oder „greifbar überall"?
   - Sollte das Widget auch ein kleines Label tragen („SBKIM") oder
     nur die zwei Symbole?
   - Mobile-Variante: gleicher Footprint oder kompaktere Form?

4. **Default-Position.** Vorschlag: `defaultCorner: "bottom-right"`
   mit 16 px Abstand vom Rand. Vier Ecken erlaubt (`"top-left"`,
   `"top-right"`, `"bottom-left"`, `"bottom-right"`). Klärungs-Frage:
   sollen wir Snap-zu-Ecken (8 Snap-Punkte: vier Ecken + vier Kanten-
   Mitten) oder freies Drag mit Pixel-Präzision?

5. **Drag-Mechanik.**
   - Touch + Mouse beide unterstützt (Pointer-Events-API ist die
     einheitliche Lösung).
   - Drag-Threshold ~5 px, damit kurze Klicks nicht versehentlich
     als Drag interpretiert werden.
   - Während Drag: Widget bekommt `.sbkim-widget-dragging`-Klasse,
     `pointer-events: none` auf Hintergrund-Layer, leichter Schatten-
     Lift (`box-shadow` + `transform: scale(1.03)`).
   - Snap (falls gewählt): bei Drop nahe Ecke/Kante (Threshold ~80
     px) automatisch einsnappen.
   - Position persistiert in `localStorage` unter
     `sbkim_widget_position` als `{x, y, corner}` (siehe Punkt 6).

6. **Persistierung.** `localStorage`-Schema (NICHT IndexedDB, weil
   Modul 15 + 16 RAM-only sind und Widget-Position ist eine reine
   UX-Preference):
   - `sbkim_widget_visible`: `"true"` | `"false"` (Default `"true"`).
   - `sbkim_widget_position`: `'{"corner":"bottom-right","offsetX":
     16,"offsetY":16}'` ODER bei free-drag `'{"x":123,"y":456}'`.
   Klärungs-Frage: schreiben wir das auch in `sbkim_doku_meta` (Modul
   00) als zentrale UX-Preferences-Stelle, oder bleibt es localStorage-
   only? localStorage hat den Vorteil, dass es noch funktioniert,
   wenn Modul 01 (Storage) nicht initialisiert wurde.

7. **X-Schließen + Wiederherstellung.**
   - X-Knopf in der oberen-rechten Ecke des Widgets (winzig, dezent),
     Klick blendet das Widget aus (`display: none` + localStorage
     `sbkim_widget_visible = "false"`).
   - Wiederherstellung — VIER Pfade:
     - (a) `SbkimWidget.show()` in DevTools-Konsole.
     - (b) 5-Klick-Geste am SBKIM-Such-Symbol (analog Modul 00 Doku-
       Fenster — wenn Modul 00 geladen ist, hängt das Widget an
       dieselbe Geste).
     - (c) Doku-Fenster (Modul 00) bekommt einen
       „SBKIM-Widget anzeigen"-Knopf.
     - (d) Automatisch beim nächsten Tab-Reload? Klärungs-Frage:
       respektieren wir die User-Wahl persistent, oder zeigen wir das
       Widget beim nächsten Reload wieder an (mit dem Argument, dass
       das Siegel wichtig genug ist)? **Vorschlag: persistent
       respektieren** — User-Wahl ist heilig. Widget bleibt versteckt
       bis explizite Wiederherstellung.

8. **Modal-Verhalten unverändert.**
   - Klick auf FREMD-Lampe öffnet Sub-(e)-Modal (Modul 15) —
     unverändert, das Modal mountet sich weiter selbst in `<body>`.
   - Klick auf Siegel-Badge öffnet Erklärungs-Modal (Modul 16) —
     unverändert.
   - Modals haben ihren eigenen z-index, Widget hat einen niedrigeren
     z-index (z-index-Konvention klären: Widget `z-index: 9990`,
     Modals `z-index: 9999`, Eruda `z-index: 9999999`).

9. **Eruda-Kollisions-Check.** Eruda nutzt einen Floating-Button
   typisch unten-links oder oben-rechts. Klärungs-Frage: kollidiert
   unser Default `"bottom-right"` mit Eruda? Empfehlung:
   `defaultCorner` ist konfigurierbar; bei aktivem Eruda nimmt der
   Andocker im `init()` z.B. `"bottom-left"`.

10. **Sage-Page-Pfad.** Klaus' explizite Wahl in der Chat-Sitzung
    2026-05-25: Sage-Page **behält** ihre Navleisten-Lampen
    (sage-page-spezifische Identitäts-Optik, „LEBT/VERKEHR/FREMD/
    Siegel" als ein Pulsblatt). Endknoten bekommen das Widget.
    Konsequenz: Modul 15 + 16 behalten ihre bestehenden
    `lampSelector` / `badgeSelector`-Init-Pfade als Sage-Page-Pfad;
    `SbkimWidget` wird der neue Endknoten-Standard.
    
    Klärungs-Frage: ist das endgültig, oder erlauben wir Endknoten
    auch den Navleisten-Pfad (z.B. wenn ein Endknoten-Bauer bewusst
    die Sage-Page-Optik nachbauen will)? **Vorschlag: zwei Pfade
    gleichwertig, Widget ist Default** — Endknoten-Bauer wählt
    bewusst.

11. **API-Signatur von `SbkimWidget.init`:**
    ```js
    await SbkimWidget.init({
      // PFLICHT — durchgereicht an Modul 15:
      allowedOrigins: ["https://lausiklauskn-png.github.io"],
      // PFLICHT — durchgereicht an Modul 16:
      repoUrl: "https://github.com/lausiklauskn-png/Mein-Mixarium",
      // OPTIONAL — Default-Position + UX:
      defaultCorner: "bottom-right",  // "top-left" | "top-right" | "bottom-left" | "bottom-right"
      defaultOffset: { x: 16, y: 16 }, // Abstand vom Rand in px
      allowClose: true,                // false = kein X-Knopf, Widget immer sichtbar
      allowDrag: true,                 // false = fixe Position
      enableTestButton: false,         // analog Modul 15 — Sage-Page-only
    });
    ```
    Klärungs-Frage: weitere Options-Felder nötig? (`zIndex` für
    Eruda-Kollision? `theme: "auto" | "dark" | "light"` für
    Light-Mode-Endknoten?)

12. **Modul-15-+-16-Backends unverändert.** Surface-API von
    `SbkimMembrane` und `SbkimSiegel` bleibt identisch (Klaus'
    explizite Konvention: „Modul 15 + 16 Backends bleiben"). Nur die
    Render-Schicht (Lampe-Span, Badge-Span, CSS) wird vom Widget
    übernommen. `lampSelector` und `badgeSelector` sind weiterhin
    Spec-konforme Optionen — sie werden vom Widget intern auf
    interne Selektoren gesetzt (`#sbkim-widget-lamp-fremd`,
    `#sbkim-widget-siegel-badge`).

13. **Pflicht-Konvention `ZERTIFIKAT_ASPEKTE` (Modul 16 Sub (d)).**
    Diese Spec-Sitzung ergänzt einen Aspekt-Eintrag in
    `src/modules/16_siegel.js` (Datum 2026-05-25, Modul 17 Widget,
    ein-Satz-Beschreibung) — siehe CLAUDE.md § „Sicherheits-Module
    pflegen Aspekte". Falls Modul 17 noch nicht als Sicherheits-Modul
    klassifiziert wird, ist der Aspekt-Eintrag dennoch sinnvoll für
    die Sichtbarmachung im Siegel-Modal.

14. **Karte 09 § Schritt 10 + 11 vereinfachen.** Nach dieser Spec
    schrumpfen die zwei Schritte auf je drei Zeilen:
    - Schritt 10 (Membran-Backend): nur Modul-Datei-Kopie + SW-Probe-
      Detektor + `<script>`-Tag. KEIN CSS, KEIN Markup.
    - Schritt 11 (Siegel-Backend): nur Modul-Datei-Kopie +
      `<script>`-Tag. KEIN CSS, KEIN Container, KEIN `repoUrl`-
      Aufruf direkt.
    - NEUER Schritt 12 (Widget): Modul-Datei-Kopie + `<script>`-Tag
      + EIN `SbkimWidget.init({allowedOrigins, repoUrl})`-Aufruf.
    Klärungs-Frage: bleibt das eine 12-Schritt-Anleitung, oder
    bündeln wir Schritt 10–12 zu einem? Vorschlag: drei Schritte
    bleiben, weil sie konzeptuell drei Modulen entsprechen, aber
    jeder ist klein.

15. **Status-Schema.** Modul 17 ist `Code-Stub` (nach Bau-Sitzung),
    Spec-fertig nach dieser Sitzung. `status.json § modules[]` um
    Modul 17 erweitern. `index.html` der Sage-Page Module-Liste um
    Eintrag 17 ergänzen.

16. **Strikte Tabus für Modul 17.**
    - KEINE eigene Identität, KEINE Spore, KEINE Krypto, KEIN
      IndexedDB-Schreiben — nur localStorage für UX-Preferences.
    - KEIN Auto-Verhalten ohne `init()`-Aufruf. Endknoten muss
      explizit andocken.
    - KEIN Override der Modul-15-+-16-Modals — Klick öffnet die
      bestehenden Modals unverändert.
    - KEIN Replay-Cache, KEIN Netzwerk-Pfad.
    - KEINE Anzeige bei `SbkimSiegel.isCertified() === false` —
      Anti-Greenwashing-Klausel gilt auch für das Widget (der
      Siegel-Slot bleibt leer, FREMD-Lampe darf sichtbar bleiben).
    - KEIN dauerhafter Sicht-Disclaimer-Schwall im Widget selbst —
      Erklärungen gehören ins Sub-(c)-Modal von Modul 16.

17. **Was diese Spec-Sitzung NICHT spezifiziert.** (Folge-Sitzungen.)
    - Bau-Sitzung Modul 17 — eigene Brief-Datei
      `BRIEF_BAU_17_FLOATING_WIDGET.md`.
    - Sichttest-Pfad — eigene Panel-17 in `tests/manual_check.html`
      (Folge-Pflege nach Bau).
    - Endknoten-Re-Migration — neuer kleinerer Brief
      `BRIEF_BAU_ENDKNOTEN_MIGRATION_WIDGET.md` ODER additive
      Erweiterung des bestehenden Briefes
      `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` als 12.
      Aufgabe.

SEKUNDÄR — wenn Zeit + Token reichen:

18. **Karte 09 in dieser Sitzung schon nachziehen** (Schritt 10 + 11
    vereinfachen, Schritt 12 anlegen). Risiko: Karte 09 ist
    verbindlich; lieber eine eigene Folge-Pflege, damit die Spec
    sauber bleibt. Klärungs-Empfehlung: HIER NICHT, eigene Pflege
    nach Bau.

19. **CLAUDE.md § Pipeline-Reihenfolge nachziehen.** Eintrag „Spec-
    Sitzung 17 Floating-Widget" + „Bau-Sitzung 17" + „Re-Migration
    Endknoten Widget" als neue Schritte zwischen aktuellem Schritt 5
    (Endknoten-Migration, bereits gelaufen aber UI-Befund) und
    Schritt 6 (App-Freigabe). Vorschlag-Reihenfolge:
    - Schritt 5a (gelaufen 2026-05-25 mit UI-Befund): Erste
      Endknoten-Migration mit Navleisten-Lampen + Siegel — UI-
      Befund Klaus.
    - Schritt 5b: Spec-Sitzung 17 Floating-Widget (DIESE).
    - Schritt 5c: Bau-Sitzung 17.
    - Schritt 5d: Endknoten-Re-Migration mit Widget.
    - Schritt 6: Klaus' App-Freigabe.
    HIER in dieser Spec-Sitzung mit-pflegen oder eigene Mini-
    Pflege? Vorschlag: HIER mit-pflegen, weil die Reihenfolge
    Voraussetzung für die nächsten Sitzungen ist.

Was du nicht tust:

- KEIN Modul-17-Code in `src/modules/17_floating_widget.js`
  (Spec-Sitzung, kein Bau).
- KEINE Endknoten-Sitzung (extern, eigene Folge-Sitzung).
- KEIN Eingriff in `src/modules/15_membran.js` oder
  `src/modules/16_siegel.js` außer dem Aspekt-Eintrag in
  ZERTIFIKAT_ASPEKTE (Punkt 13).
- KEINE Sage-Page-Änderung (Sage-Page behält Navleisten-Lampen,
  Klaus-Festlegung).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump (Modul 17 ist nicht protokoll-aktiv).
- KEINE Tafel-Umsortierung CLAUDE.md, die über Pipeline-Schritte
  hinausgeht. Modul 15 + 16 Tafeln bleiben verbindlich; das Widget
  ist zusätzlicher Pfad, kein Ersatz.

Pflicht am Ende:

- Neue Karte `docs/components/17_floating_widget.md` mit allen 17
  Spec-Punkten gefüllt (Schnittstelle, Datenformate, UX-Regeln,
  strikte Tabus, Bauzustand).
- INTERFACES.md § 1 um neuen Block „Modul 17 Floating-Widget"
  erweitern (analog Modul 15 + 16). Surface-API, Persistierungs-
  Schema, Tabus.
- INTERFACES.md § 7 Änderungsprotokoll: Eintrag mit Datum + Sitzung
  + One-Line-Beschreibung.
- Karte 15 § Sub (e) und Karte 16 § Sub (b) jeweils einen
  Verweis-Block an das Ende ergänzen: „Seit Spec-Sitzung 17
  (2026-05-25) ist der Endknoten-Standard das Widget aus Karte 17;
  die Navleisten-Lampe/Badge-Optik bleibt Sage-Page-Pfad."
- `status.json § modules[]` um Modul 17 erweitern (`score:"spec"`,
  `siegel:"Spec fertig"`); Pie-Diagramm via
  `python3 scripts/update_puls_pie.py` regenerieren.
- CLAUDE.md § Modul-Tabelle um Eintrag 17 erweitern.
- CLAUDE.md § Pipeline-Reihenfolge um Schritte 5b/5c/5d
  nachziehen.
- PULS.md Sitzungs-Eintrag „Spec-Sitzung 17 Floating-Widget" oben.
- Übergabeprotokoll in
  `docs/sessions/archiv/YYYY-MM-DD_spec-17-floating-widget.md`.
- Brief für die Bau-Sitzung 17 anlegen in
  `docs/sessions/BRIEF_BAU_17_FLOATING_WIDGET.md` mit Codeblock.
- Commit + Push auf `claude/spec-15-16-floating-widget`.
- Draft-PR anlegen.
- „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort.
- Brief-Codeblock der Bau-Sitzung im Chat ausgeben (Konvention 6).
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Spec-Sitzung
liest)

### Warum Spec-Sitzung statt Sofort-Bau

Das aktuelle Design hat **mehrere Schwächen gleichzeitig** (Navleiste
zu klein, kein User-X, keine Drag, CSS-Variablen-Kopier-Pflicht,
Container-Anker-Pflicht). Eine Bau-Sitzung ohne vorherige Spec würde
willkürlich entscheiden, z.B. wo das Default-Widget hingehört, ob
Snap-zu-Ecken oder frei, ob localStorage oder IndexedDB. Die Spec-
Sitzung muss vier-fünf Architektur-Fragen sauber klären, bevor Code
entsteht — sonst läuft die Bau-Sitzung in dieselbe Wand wie die
erste Endknoten-Migration.

### Was diese Spec-Sitzung NICHT entscheidet

- **Konkretes CSS** des Widgets (Farben, Glow, Animation) — das ist
  Bau-Detail.
- **Konkrete Drag-Bibliothek** (Vanilla Pointer-Events vs. fertige
  Mini-Lib) — Bau-Entscheidung.
- **Sub-Widget-Erweiterungen** (z.B. Anzeige von `sbkim_siblings`-
  Count, Live-Verkehrs-Lampe) — eigene Folge-Pflege.

### Nach dieser Spec

1. Bau-Sitzung 17 — `src/modules/17_floating_widget.js` mit
   Standalone-CSS, Drag, X-Schließen, localStorage-Persistierung,
   Modal-Anker-Bridge zu Modul 15 + 16.
2. Sichttest 17 — Panel-17 in `tests/manual_check.html` (Klaus
   testet am Tablet, drei Test-Punkte: Default-Anzeige, Drag-an-
   Ecke, X-Schließen + Wiederherstellung via 5-Klick).
3. Endknoten-Re-Migration — neuer Mini-Brief, drei Zeilen Einbau-
   Anweisung pro Endknoten. Vorhandene Lampen + Siegel in der
   Navleiste werden ausgebaut, Widget kommt rein.
4. Klaus' App-Freigabe — die drei Apps mit Floating-Widget sichtbar
   verteilen.

### Optionale Folge-Pflegen vor App-Freigabe (außerhalb dieser Spec)

- **Modul 00 Doku-Fenster + Widget-Wiederherstellung verknüpfen:**
  5-Klick-Geste am SBKIM-Such-Symbol soll BEIDE öffnen (Doku-Fenster
  + Widget-Wiederherstellung). Eigene Pflege-Sitzung Modul 00 +
  Modul 17.
- **Eruda-Kollisions-Hinweis in Karte 09:** wenn Eruda im
  Sichttest-Modus läuft, sollte `defaultCorner` automatisch
  auf den freien Quadranten zeigen. Eigene Mini-Pflege.
- **Mobile-spezifische Variante:** auf kleinen Bildschirmen (< 480
  px) das Widget kompakter rendern (z.B. nur eine Plakette gleichzeitig,
  Tab-Wechsel zwischen Lampe und Siegel). Eigene Folge-Pflege.
