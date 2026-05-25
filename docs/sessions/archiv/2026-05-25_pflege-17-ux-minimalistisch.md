# Übergabeprotokoll — Pflege Modul 17 UX (2026-05-25)

## Sitzungs-Rolle

Folge-Pflege nach Bau-Sitzung 17 (PR #166 gemerged 2026-05-25). Klaus'
Sichttest 17 (9 von 10 Tests grün) lieferte einen UX-Befund —
Folge-Pflege adressiert ihn. Branch
`claude/pflege-17-ux-minimalistisch`.

## Klaus' UX-Befund (Tafel-Evolutions-Klausel)

> „LEB / VER / FRE als Drei-Buchstaben-Glyphe suggerieren falsche
> Begriffe (LEB → Leberwurst? VER → Versicherung? FRE → Freitag?),
> lieber Lampen-Stil wie Sage-Page mit Tooltips + minimalistischer +
> minimierbar auf nur SIEGEL".

Plus Klaus-Notiz für Folge-Sitzung: SIEGEL-Slot soll später als
„abgerundeter Container für Tool-PWA" (Andocken + Sporen-Installation)
gestaltet werden — Idee, noch nicht jetzt implementiert.

## Was getan

### 1. Sage-Page-Lampen-Stil-Übernahme

`index.html` § `.lamps` + `.lamp` + `lamp-breath` + `lamp-pulse` +
`lamp-alert-pulse` als Stil-Referenz. Modul-17-`buildCss()` komplett
umgebaut:

- Pille: `border-radius:999px`, `padding:6px 12px`, schmaler
  Schwarz-Hintergrund mit `backdrop-filter:blur(8px)`
- Click-Targets: 28 px (Touch-Mindestgröße bewahrt)
- Sichtbare Lampe: 10 px Durchmesser als `::before`-Pseudo
- Atmungs-Ring: `::after` mit `sbkim-widget-lamp-breath` 3.2 s
  (analog Sage-Page)
- Puls-Animationen `sbkim-widget-lamp-pulse` (Gold, VERKEHR) +
  `sbkim-widget-lamp-alert-pulse` (Rot, FREMD) übernehmen Sage-Page-
  Pattern
- SIEGEL: 22 px Gold-Medaillon mit `radial-gradient` + ★-Glyph +
  Gold-Glow

### 2. Drei-Buchstaben-Glyphe entfernt

`buildSlotButton()` setzt jetzt KEINEN `textContent` für LEBT/VERKEHR/
FREMD mehr (Lampen sprechen über Farbe + Glow). SIEGEL behält ★ als
Identitäts-Glyph. Neue `SLOT_TOOLTIPS`-Tabelle mit vollen Beschreibungs-
Texten:

- LEBT — „Page lebt seit init() (Modul 02 Spore). Klick öffnet
  Status-Modal."
- VERKEHR — „Verkehr — letzte Handshakes (Modul 05) + postMessages
  (Modul 15). Klick öffnet Mini-Log."
- FREMD — „Fremdzugriff-Buffer (Modul 15 Sub e). Rot wenn Buffer
  nicht leer. Klick öffnet Modul-15-Modal."
- SIEGEL — „SBKIM-Siegel — Modul 16 Self-Inscribing-Bezeugung.
  Klick öffnet Aspekte-Modal."

`title`-Property + `aria-label` nutzen jetzt die Tooltip-Tabelle.

### 3. Drei-Zustand-Schnittstelle

Neue Public-Surface-Funktionen:

- `SbkimWidget.minimize()` — voll → minimiert (nur SIEGEL, oder
  LEBT-Fallback wenn kein SIEGEL gemountet via `data-fallback="lebt"`)
- `SbkimWidget.maximize()` — minimiert → voll
- `SbkimWidget.isMinimized()` — boolean aus internem Flag

Neuer localStorage-Schlüssel `sbkim_widget_minimized` (Default
`"false"`).

Minimize- und X-Knopf als kleine dezente Icon-Buttons (Klasse
`sbkim-widget-btn`) rechts am Pillen-Ende. Selbstcheck-Zeile auf
„init/show/hide/isVisible/minimize/maximize/isMinimized/getPosition"
erweitert.

### 4. UX-Konsistenz beim asynchronen SIEGEL-Mount

`mountSiegelSlot()` ruft nach Slot-Mount `applyMinimizedState()` erneut
auf → `data-fallback="lebt"` wird entfernt, sobald SIEGEL da ist.

### 5. Tests

- **Panel 17** in `tests/manual_check.html`: Header-Status auf
  „Code-Stub + Pflege UX 2026-05-25"; Test 11 (minimize) + Test 12
  (maximize) ergänzt.
- **Headless-Smoke** `tests/smoke_bau17_floating_widget.mjs` um sieben
  Proben (20–26) erweitert: Public-Surface-Check, minimize ohne
  SIEGEL → fallback=lebt, SIEGEL-mount-während-minimiert, maximize,
  localStorage-Round-Trip, kein-Slot-Glyph, volle Tooltips.
  **26/26 grün**.
- **Modul-15-Regression** `tests/smoke_bau15b_membran.mjs` **31/31
  grün** ohne Anpassung.
- `node --check src/modules/17_floating_widget.js` grün.
- Alle 13 Inline-`<script>`-Blöcke in `tests/manual_check.html`
  syntaktisch grün.

### 6. Doku

- **Karte 17** § Bauzustand neue Zeile „Pflege UX 2026-05-25"
  zwischen Bau-Sitzung-17-Zeile und Sichttest-Zeile.
- **INTERFACES.md** § 1 Modul 17:
  - Bietet-Block um `minimize()` / `maximize()` / `isMinimized()`
    erweitert
  - Storage-Block um dritten LS-Schlüssel `sbkim_widget_minimized`
  - Geprüft-Zeile um Pflege-UX 2026-05-25
- **§ 10 Änderungsprotokoll**: neuer Eintrag „Pflege Modul 17 UX —
  Sage-Page-Lampen-Stil + Drei-Zustand-Schnittstelle".

## Was offen blieb

- **Sichttest Pflege UX** durch Klaus (DeX-Chrome, Galaxy Tab S6):
  Hard-Reload + Panel 17 Setup + Test 11/12 + Sage-Page-Bonus-Check
  (Navleisten-Lampen bleiben unverändert).
- **Pflege Karte 09 § Schritt 10–12** (Endknoten-Drei-Zeilen-Einbau
  + Init-Reihenfolge-Pflicht) — eigene Folge-Sitzung.
- **Endknoten-Re-Migration** (zwei externe Sitzungen) — Mein-
  Rezeptbuch + Mein-Mixarium — setzt diese Pflege voraus (damit die
  Endknoten direkt die finale Optik kriegen).
- **SIEGEL-Slot als Tool-PWA-Container** — Klaus-Idee, eigene
  Folge-Spec-Sitzung wenn relevant.

## Pflicht am Ende

- `src/modules/17_floating_widget.js` umgebaut ✅
- `node --check` grün ✅
- Tooltip-Tabelle + Drei-Zustand-Schnittstelle ✅
- Selbstcheck-Zeile erweitert ✅
- Panel 17 + Smoke-Test (26/26 grün) ✅
- Modul-15-Regression 31/31 grün ✅
- Karte 17 + INTERFACES.md + PULS.md ✅
- Übergabeprotokoll (diese Datei) ✅
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump ✅
- KEINE Sage-Page-Änderung (`index.html` unangetastet) ✅
- KEIN Endknoten-Eingriff ✅
- KEINE Modul-02/05/15/16-Code-Änderung ✅
- ZERTIFIKAT_ASPEKTE-Eintrag in Modul 16 UNVERÄNDERT (Pflege UX ist
  Render-Schicht-Anpassung, kein neuer Sicherheits-Aspekt) ✅
- `status.json` unverändert (Modul 17 bleibt `score:"stub"`) ✅
- CLAUDE.md § Modul-Tabelle unverändert (Status bleibt „Code-Stub") ✅

## Nächster sinnvoller Schritt

Sichttest Pflege UX (Klaus am Tablet). Brief-Codeblock in der finalen
Chat-Antwort.
