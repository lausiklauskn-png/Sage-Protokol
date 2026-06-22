# Übergabeprotokoll 2026-06-22 — Pflege Modul 22: Such-Panel größer ziehbar

**Rolle:** Pflege-Sitzung Modul 22 (Such-Widget). Strang A aus Klaus'
Drei-Wege-Wahl (A Panel ziehbar / B B3-Sicherheits-Richter / C Standalone-PWA) —
Klaus bestätigte **„A — Panel größer ziehbar"**.

## Auslöser

Klaus' Befund: das untere **Lesefeld** (Treffer-Liste) im Such-Widget ist zu eng.

## Was gebaut

Ein **Resize-Griff unten rechts** am expandierten Panel
(`.sbkim-sw-resize`, `cursor: nwse-resize`, Touch-fähig via Pointer-Events). Er
zieht **gleichzeitig**:

- **Panel-Breite** `panelWidth` — geklemmt `240 … min(760, Viewport-16)` px,
- **Lesefeld-Höhe** `resultsHeight` (`max-height` der Treffer-Liste) — geklemmt
  `120 … 0.72·Viewport` px.

Die Größe **persistiert** in `localStorage` `sbkim_search_widget_size`
(JSON `{w,h}`, User-Wahl heilig — übersteht Re-Init, überschreibt
`init({panelWidth,resultsHeight})`).

### Drag-Konflikt sauber getrennt

- Griff-`pointerdown` ruft `stopPropagation()` → der Verschiebe-Drag (root
  pointerdown) springt nicht zugleich an.
- `.sbkim-sw-resize` zählt zusätzlich als interaktives Ziel in
  `isInteractiveTarget` (Defense gegen Bubbling).
- Beim Resize-**Start** stellt das Widget auf **freie Position** um (obere-linke
  Ecke verankert), damit der untere-rechte Griff natürlich nach unten-rechts
  wächst statt ecken-verankert „falsch" zu wachsen.
- Nur bei `allowDrag:true` (gepinnte Widgets bleiben in Größe + Ort fest).

### Surface / Tabus

- Neu: `getSize()`, `setSize({panelWidth?,resultsHeight?})` (null = Reset auf
  CSS-Default + localStorage-Eintrag löschen), `_meta.panelWidth/resultsHeight`,
  `init({panelWidth,resultsHeight})`.
- Modul 17 **unangetastet** (Mechanik nur kopiert/gespiegelt). Keine eigene
  Identität/Krypto, kein IndexedDB, kein Netz, kein Protokoll-Bump. Fail-soft.

## Dateien

- `src/modules/22_such_widget.js` — Konstanten + State + CSS + Resize-Handler +
  `getSize`/`setSize` + Surface/`_meta`/`init`-Verdrahtung.
- `tests/smoke_bau22_such_widget.mjs` — **Probe 44** (Resize-Pfad, Persistenz
  über Re-Init, Min-Klemmung, Reset).
- `tests/manual_check.html` — Panel-22-Knopf „Größe ziehbar: setSize + Reset" +
  `_meta`-Anzeige um `panelWidth/resultsHeight` ergänzt.
- Doku: `docs/components/22_such_widget.md`, `docs/INTERFACES.md` § Modul 22,
  `CLAUDE.md` Modul-22-Zeile, `docs/PULS.md`.

## Test

Headless-Smoke `node tests/smoke_bau22_such_widget.mjs` → **162/162 grün**
(vorher 148; +14 Probe-44-Punkte).

## Offen / Nächster Schritt

- **Klaus' Browser-Sichttest** am Galaxy-Tab-S6: Griff mit dem Finger ziehen,
  Lesefeld wird größer, Persistenz nach Hard-Reload. Headless ersetzt das nicht.
- Danach Klaus' Wahl: **Strang B** (B3 Sicherheits-/Eignungs-Richter —
  architektonisch, Modul-04-Querschnitt, mit Klaus abstimmen) oder **Strang C**
  (Standalone-Single-File-PWA-Download mit eigener Fußzeile).
