# Übergabeprotokoll — Bau-Sitzung 17 Floating-Widget (2026-05-25)

## Sitzungs-Rolle

Bau-Sitzung 17 (Pipeline-Schritt 5c, CLAUDE.md § Pipeline-Reihenfolge).
Branch `claude/floating-widget-build-17-RQLgJ`.

## Brief

`docs/sessions/BRIEF_BAU_17_FLOATING_WIDGET.md` (PR #165 gemerged
2026-05-25, Spec-Sitzung 17 vom selben Tag).

## Was getan

### A. Modul-Datei `src/modules/17_floating_widget.js` (~770 Zeilen)

- **IIFE-Pattern** wie Modul 00/01/02/04/05/06/07/08/15/16.
- **Public Surface** `window.SbkimWidget = {init, show, hide,
  isVisible, getPosition, _meta}`.
- **init(options?)** idempotent. Liest `localStorage` für
  `sbkim_widget_visible` + `sbkim_widget_position`. Mountet die Pille
  in `document.body` (MutationObserver-Re-Try wenn body noch nicht
  da, 10 s Safety-Timeout analog Modul 16). Injiziert Standalone-CSS
  via `<style id="sbkim-widget-style">`-Element ans Ende von `<head>`
  (KEIN Shadow-DOM in Stufe 1, KEIN `:root`-Eingriff — alle CSS-
  Variablen modul-lokal mit `--sbkim-widget-*`-Präfix). Registriert
  fünf Event-Listener auf `window` (`sbkim:alive`, `:handshake`,
  `:postmessage`, `:fremd-alert`, `:siegel-certified`). Default-
  Position bottom-right + 16 px Abstand.
- **show() / hide() / isVisible()** sync, mit `localStorage`-Persistenz
  (außer bei `rememberHidden:false`); `isVisible()` liest DOM-State
  (nicht localStorage, sonst drift); Vor-init-Aufrufe drosseln
  `console.warn` auf 1× pro 60 s.
- **getPosition()** sync, defensive Kopie mit Default-Werten bei
  nicht-initialisiertem Modul.
- **_meta** Read-Anker für Tests: `slots[]`, `eventCounts`,
  `trafficLogSize`, `trafficLogSnapshot`, `widgetMounted`,
  `firstBootShown`, `siegelMounted`, `fremdBufferSize`, `lebtSince`,
  `lebtNodeIdPrefix`, `siegelCertifiedAt`, `siegelRepoUrl`,
  `visibleFlag`, `optAllowClose`, `optAllowDrag`, `optRememberHidden`,
  `optTheme`, `zIndex`, plus Konstanten-Anker (`widgetId`, `styleId`,
  `trafficLogMax`, `dragThresholdPx`, `defaultZIndex`, `lsKeyVisible`,
  `lsKeyPosition`, `events`).

### Vier-Slot-DOM

- `<button id="sbkim-widget-slot-lebt">` (Klick → LEBT-Modal)
- `<button id="sbkim-widget-slot-verkehr">` (Klick → VERKEHR-Modal)
- `<button id="sbkim-widget-slot-fremd">` (Klick → Proxy auf
  `#lamp-fremd`)
- `<button id="sbkim-widget-slot-siegel">` (Klick → Proxy auf
  `#sbkim-siegel-badge`) — **nur im DOM wenn
  `SbkimSiegel.isCertified() === true`** zum Render-Zeitpunkt
  (Anti-Greenwashing binär).

### Drag-Mechanik

- Pointer-Events (`pointerdown`/`pointermove`/`pointerup`/
  `pointercancel`) — Touch + Maus vereinheitlicht.
- 5 px Threshold (Klicks < 5 px Bewegung als Tap, ≥ 5 px als Drag).
- Gesamte Pille drag-fähig **außerhalb der Slots + X-Knopfs** (Bau-
  Sitzung-17-Entscheidung — kein eigener Drag-Griff, weniger DOM-
  Komplexität; folgt Eruda-Pattern).
- Drag-Klasse `.sbkim-widget-dragging` mit Schatten-Lift +
  `transform:scale(1.03)` + cursor `grabbing`.
- Freies Drag mit Pixel-Präzision (KEIN Snap-zu-Ecken in Stufe 1 —
  Spec-Empfehlung Karte 17 § Drag-Mechanik übernommen).
- Viewport-Clamp: 24 px immer sichtbar (verhindert komplettes Aus-
  dem-Viewport-Rutschen).
- Position-Persistierung in `localStorage` via JSON-Stringify eines
  `PositionSnapshot`-Objekts.

### X-Schließen + Wiederherstellungs-Pfade

- X-Knopf oben-rechts (12 px, halbtransparent, Hover-Aufhellung).
- Klick blendet das Widget aus (`display:none` via
  `.sbkim-widget-hidden`-Klasse).
- `localStorage.setItem("sbkim_widget_visible", "false")` persistiert
  die User-Wahl.
- Wiederherstellungs-Pfade:
  - (a) `SbkimWidget.show()` in der DevTools-Konsole (z.B. via Eruda).
  - (b) 5-Klick-Geste am SBKIM-Such-Symbol (Modul 00) — eigene Folge-
    Pflege Modul 00 + 17 (nicht in dieser Bau-Sitzung).
  - (c) Doku-Fenster-Knopf (Folge-Pflege Modul 00).
  - (d) `init({rememberHidden:false})` zeigt das Widget bei jedem
    Reload neu (Default `true` — User-Wahl heilig, Spec-Wille).

### Modal-Bridge — Bau-Sitzung-17-Entscheidung: Option 1 (Proxy-DOM-Element im Widget)

- Widget legt unsichtbare Spans `<span id="lamp-fremd">` +
  `<span id="sbkim-siegel-badge">` in seinem Inneren an (via
  `.sbkim-widget-proxy`-Container mit `visibility:hidden;
  pointer-events:none`).
- Modul 15/16 attachen ihre Click-Handler dort, sobald ihre `init()`
  läuft.
- **Folge: `SbkimWidget.init()` MUSS VOR `SbkimMembrane.init()` /
  `SbkimSiegel.init()` im Endknoten-Andocker stehen.** Sonst finden
  Modul 15/16 ihre Mount-Elemente nicht.
- Karte 09 § Schritt 12 dokumentiert das in eigener Folge-Pflege
  nach Bau 17.
- Slot-Klick → bevorzugt Element AUSSERHALB des Widgets (Sage-Page-
  Lampe), fällt fail-soft auf Widget-interne Proxy zurück.
- Fail-soft via `querySelector`-null-Check: wenn keine Proxy gefunden
  → no-op + `console.warn`.

### LEBT-Modal (eigenes Modul-17-Modal)

- Mount in `document.body` (analog Modul 15/16).
- `<dl>`-Grid mit fünf Zeilen: Uptime (formatiert h/m/s),
  Modul-02-Init-Status (boolean aus `SbkimSpore._meta`-Existenz),
  nodeId-Präfix (erste 12 Zeichen aus `sbkim:alive`-Detail),
  Events:alive-Count, since-ISO.
- Uptime-Counter aktualisiert 1× pro Sekunde via `setInterval`
  (gestartet beim Open, gestoppt beim Close).
- Backdrop + Esc + ✕ schließen.

### VERKEHR-Modal (eigenes Modul-17-Modal)

- Mount in `document.body`.
- Tabelle [Zeit, Quelle (handshake/postmessage), Richtung
  (incoming/outgoing), Decision].
- RAM-only FIFO 10 (analog Modul 15 Sub (e) Ringbuffer-Pattern, aber
  kürzer). Tab-Reload = leer.
- Auto-refresh bei offenem Modal pro Event.

### B. DispatchEvent-Hooks in Modul 02/05/15/16

- **Modul 02 (`src/modules/02_spore.js`):** neuer Flag
  `aliveDispatched` + Helper `dispatchAliveOnce(nodeId)`; Aufruf am
  Ende beider getOrCreateIdentity-Pfade (existing-Slot + new-Slot).
  Einmal pro Session.
- **Modul 05 (`src/modules/05_anastomose.js`):** neuer Helper
  `dispatchHandshakeEvent(outcome, peerNodeId, direction)`;
  **`handshake`/`receiveHandshake` zu thin wrappers umgebaut**
  (additiv-mit-internem-Refactoring) um neue interne
  `_doHandshake`/`_doReceiveHandshake`-Funktionen. Wrappers
  dispatchen `sbkim:handshake` mit direction-Feld
  (outgoing/incoming) nach Result-Resolve. Äußere Signatur +
  Selbstcheck-Zeile + Public-Surface-Pointer UNVERÄNDERT.
- **Modul 15 (`src/modules/15_membran.js`):** neue Helper
  `dispatchPostmessageEvent(op, decision)` +
  `dispatchFremdAlertEvent(kind, decision, bufferSize)`.
  `recordEntry` dispatcht `sbkim:fremd-alert` NACH Buffer-Push +
  Listener-Aufruf. `recordPostMessageEntry` dispatcht
  `sbkim:postmessage` gated auf VALID_OPS-Whitelist (Type-Mismatch +
  unbekannte Ops geben KEIN Event ab — sind keine SBKIM-Membran-
  Postmessages im engeren Sinn).
- **Modul 16 (`src/modules/16_siegel.js`):** `init()` dispatcht
  `sbkim:siegel-certified` am Ende, wenn `certifiedFlag===true`
  (durch `ready=true`-Flag-Schutz idempotent).

### C. Standalone-CSS im Widget-Modul

- CSS-Variablen modul-lokal mit Präfix `--sbkim-widget-*`. KEIN
  `:root`-Eingriff.
- Vier-Slot-Layout: flex-Container, vier 40-px-Slots horizontal,
  4 px Gap. Pille ~200 × 48 px, `border-radius: 12px`,
  halbtransparenter dunkler Hintergrund + `backdrop-filter:
  blur(8px)`.
- X-Knopf oben-rechts ~ 12 px.
- Animation-Klassen: `.lebt-pulse` (Atmung 2.2 s),
  `.verkehr-pulse` (gold pulse 600 ms), `.fremd-alert` (Dauer-Rot
  + Glow), `.fremd-pulse` (Puls 600 ms), `.siegel-first-boot`
  (600 ms First-Boot-Animation einmalig pro Session).
- Z-Index: 9990 (Default, überschreibbar via `init({zIndex})`).

### D. Panel 17 in `tests/manual_check.html`

Setup-Knopf + Mock-Modul-16-Knopf + 10 Test-Knöpfen + Selbstcheck-
Hinweis:

1. **LEBT-Slot wird grün** (sbkim:alive feuern, Slot prüfen).
2. **VERKEHR pulst** (drei Events feuern, Slot-Pulse + Mini-Log-
   Inhalt prüfen).
3. **FREMD wird rot** (zwei sbkim:fremd-alert-Events,
   Slot-Zustand + bufferSize prüfen).
4. **sbkim:fremd-alert OHNE bufferSize → fail-soft** (Schema-Reject,
   Slot-Zustand bleibt).
5. **SIEGEL-Slot erscheint** (Mock-Modul-16-Knopf + Event).
6. **SIEGEL-Anti-Greenwashing-Hinweis** (braucht Tab-Reload davor).
7. **Traffic-Log FIFO max 10** (15 Events → size=10).
8. **hide + show + localStorage** (X-Schließen + show()-
   Wiederherstellung).
9. **getPosition() liefert defensive Kopie**.
10. **Modal-Bridge** (FREMD/SIEGEL via Proxy-Click).

### E. ZERTIFIKAT_ASPEKTE-Eintrag in Modul 16

```js
{
  since:       "2026-05-25",
  module:      "17",
  aspect:      "Floating-Widget mit Vier-Slot-Live-Status",
  description: "Live-Status-Dashboard (LEBT/VERKEHR/FREMD/SIEGEL) als Endknoten-Standard; macht den SBKIM-Lauf sichtbar ohne Navleisten-Mount-Pflicht. Render-Schicht ohne Protokoll-Eingriff.",
}
```

Konvention CLAUDE.md § „Sicherheits-Module pflegen Aspekte" erfüllt
(Modul 17 ist Render-Schicht, aber der Brief empfiehlt den Eintrag
explizit weil das Widget die Live-Schau-Schicht für die Sicherheits-
Module ist).

### F. Headless-Smoke-Test

`tests/smoke_bau17_floating_widget.mjs` (Node 22, kein externes
Paket) mit minimalem DOM-Stub: 19 Proben, **19/19 grün**:

1. Public Surface verfügbar
2. init() mountet Pille in body + Style in head
3. Drei Slots (LEBT/VERKEHR/FREMD) im DOM, SIEGEL NICHT (Modul 16
   fehlt)
4. Proxy-DOM-Bridge: #lamp-fremd + #sbkim-siegel-badge im Widget
5. sbkim:alive → LEBT.active + eventCounts.alive=1
6. sbkim:handshake → VERKEHR.active + trafficLogSize=1
7. sbkim:postmessage → trafficLogSize=2
8. sbkim:fremd-alert (bufferSize:2) → FREMD.active
9. sbkim:fremd-alert OHNE bufferSize → fremdBufferSize unverändert
10. sbkim:siegel-certified OHNE Modul 16 → KEIN DOM-Mount +
    Anti-Greenwashing-Warn
11. Modul-16-Stub + sbkim:siegel-certified → SIEGEL-Slot im DOM
12. Traffic-Log FIFO max 10
13. hide/show/isVisible + localStorage-Persistierung
14. Selbstcheck-Marker via _meta
15. getPosition() liefert defensive Kopie
16. _meta.slots[] entspricht enabledSlots-Liste
17. Slot-Whitelist `{slots:["lebt","siegel"]}` → VERKEHR + FREMD
    NICHT im DOM
18. Defekter localStorage-Eintrag → fail-soft, Default-Position
19. FREMD-Slot-Click ohne Modul 15 → fail-soft, kein Throw

## Regression-Checks

- **Modul-15-Smoke** `tests/smoke_bau15b_membran.mjs`: 31/31 grün
  — die neuen DispatchEvent-Hooks in Modul 15 brechen das
  Sub-(a)+(b)-Verhalten nicht.
- **`node --check`** für alle fünf modifizierten/neuen Module grün:
  `02_spore.js`, `05_anastomose.js`, `15_membran.js`, `16_siegel.js`,
  `17_floating_widget.js`.
- **Alle 13 Inline-`<script>`-Blöcke** in `tests/manual_check.html`
  syntaktisch grün (vm.Script-Parse).
- **Modul-02/05-Smokes** (`smoke_bau02y.mjs`, `smoke_bau05y_*.mjs`)
  konnten in diesem Container nicht laufen (fake-indexeddb-Paket
  fehlt) — das ist eine bestehende Container-Limitierung, kein
  Bau-17-Befund. Modul 02/05 wurden additiv-mit-internem-Refactoring
  angepasst; äußere Signatur + Selbstcheck-Zeile + Public-Surface-
  Pointer UNVERÄNDERT.

## Pflicht am Ende

- **`src/modules/17_floating_widget.js`** voll angelegt +
  Selbstcheck-Zeile ✅
- **`node --check`** für alle fünf Module ✅
- **DispatchEvent-Hooks** in Modul 02/05/15/16 (vier Code-Stellen
  additiv); Selbstcheck-Zeilen UNVERÄNDERT ✅
- **Panel 17** in `tests/manual_check.html` mit 10 Test-Knöpfen +
  Selbstcheck-Hinweis ✅
- **Headless-Smoke** 19/19 grün ✅
- **ZERTIFIKAT_ASPEKTE-Eintrag** in Modul 16 ✅
- **Karte 17 § Bauzustand-Tabelle** erweitert ✅
- **INTERFACES.md § 1 Modul 17 Status + Geprüft + § 10
  Änderungsprotokoll** erweitert ✅
- **status.json § modules[] Modul 17** auf `score:"stub"` +
  `python3 scripts/update_puls_pie.py` ✅
- **CLAUDE.md § Modul-Tabelle Eintrag 17** auf „Code-Stub" ✅
- **PULS.md Sitzungs-Eintrag** ✅
- Übergabeprotokoll (diese Datei) ✅

## Was offen blieb

- **Sichttest 17** durch Klaus (DeX-Chrome, Galaxy Tab S6) —
  zehn Test-Knöpfe + Mock-Modul-16-Knopf vor Test 5 + Sage-Page-
  Bonus-Check (Navleisten-Lampen + Siegel-Badge bleiben).
- **Pflege Karte 09 § Schritt 10 + 11 + 12** — drei-Zeilen-Einbau
  pro Endknoten + Init-Reihenfolge-Pflicht
  (`SbkimWidget.init()` VOR `SbkimMembrane.init()` /
  `SbkimSiegel.init()`).
- **Endknoten-Re-Migration** (Mein-Rezeptbuch + Mein-Mixarium,
  zwei externe Sitzungen).
- **Pflege PULS.md** — Datei ist bei ~5125 Zeilen (CLAUDE.md-
  Schutz-Klausel 3000 längst gerissen). Eigene Pflege-Sitzung
  „PULS-Archiv" empfohlen, um älteste Sitzungs-Einträge ins
  `docs/sessions/archiv/`-Verzeichnis auszulagern. Nicht-blockierend
  für Bau 17.

## Nächster sinnvoller Schritt

**Sichttest 17** (Klaus am Tablet, DeX-Chrome). Brief-Codeblock für
Sichttest-Sitzung 17 wird in der finalen Chat-Antwort dieser Sitzung
wortwörtlich ausgegeben (Konvention CLAUDE.md Pflicht-6).
