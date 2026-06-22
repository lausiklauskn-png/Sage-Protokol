# Übergabeprotokoll — Bau 22 Folge: Splitscreen-Fix + Vollbild + Merken-Liste

**Datum:** 2026-06-22
**Rolle:** Bau-Sitzung Modul 22 (Such-Werkzeug), Folge des Brainstorms
2026-06-22 (`docs/sessions/BRIEF_BAU_22_VOLLBILD_MERKEN.md`).
**Branch:** `claude/module-22-search-fullscreen-gf6rwq`
**Freibrief:** gilt (CLAUDE.md § Freibrief).

## Ausgangslage

PR #388 (Resize) + #389 (`such-tool/` Standalone-PWA) gemerged. Modul-22-Smoke
162/162, Standalone 46/46. Auftrag aus dem Brief: drei Features in Reihenfolge,
je eigener Commit/PR, Klaus-Sichttest abwarten.

## Was getan (drei abgegrenzte Commits)

Alle Änderungen in `src/modules/22_such_widget.js` + byte-genaue Standalone-Kopie
`such-tool/modules/22_such_widget.js` (Drift-Guard im Standalone-Smoke).

1. **Splitscreen-Fix.** `clampPositionIntoView()` + einmaliger Window-Listener
   auf `resize` **und** `orientationchange` (`attachViewportListener`, fail-soft
   ohne `addEventListener`). Klemmt die **gezogene (freie)** Position in den
   sichtbaren Bereich (24 px Rand-Reserve, spiegelt die Drag-Clamp). Ecken-
   verankerte Widgets unberührt. Heilung schon beim Mount; geklemmte Position
   persistiert. Smoke Probe 45.

2. **Vollbild-Modus (⛶).** `enterFullscreen/exitFullscreen/toggleFullscreen/
   isFullscreen` + `_meta.fullscreen`. CSS `.sbkim-sw-fullscreen` (Root inset:0,
   Panel 100%×100%, Treffer-Liste `max-height:none`, z-index 9996). ⛶-Knopf im
   Panel-Kopf (wechselt auf 🗗). **NICHT persistiert** — die Pille bleibt
   Standard-Start (Klaus: kein Auto-Vollbild). Minimieren (–) und X (dockToTop)
   beenden den Vollbild-Modus ebenfalls. Auf `such-tool/` automatisch verfügbar.
   Smoke Probe 46.

3. **Merken-Liste (📌).** `openMerkliste/closeOverlays/getMerkliste/
   clearMerkliste` + `_meta.merkCount/merkOverlayOpen/detailOverlayOpen`.
   - Merk-Haken pro Treffer → `localStorage` `sbkim_search_widget_merkliste`,
     **nur Text+Link** (+Quelle/Datum für Anzeige), **GRUPPIERT unter der
     Suchfrage** als Überschrift. Haken weg → Eintrag weg. Alle Treffer-Arten
     (App/Knoten/Netz) mit Badge.
   - Tool-eigene **Detail-Karte** (Overlay) beim Tippen auf einen Treffer:
     Titel/Beschreibung/URL + [📌 Merken] + [↗ Seite öffnen neuer Tab]; ‹ Zurück
     schließt. Linksklick auf Link-Titel öffnet die Karte, Rechtsklick bleibt
     „in neuem Tab".
   - **Merkliste-Overlay** (📌-Kopf-Knopf), gruppiert nach Frage, je Eintrag
     öffnen/entfernen + „Alles entfernen".
   - KEINE PII, kein IndexedDB, kein Protokoll-Bump. Smoke Probe 47.

Nachgezogen: INTERFACES § Modul 22 (Surface + `_meta` + localStorage-Schema),
Karte `docs/components/22_such_widget.md` (drei neue Abschnitte + LS-Schema-Zeile),
`tests/manual_check.html` Panel 22 (Vollbild- + Merken-Knöpfe, `_meta`-Ausgabe).

## Tests

- Headless `tests/smoke_bau22_such_widget.mjs` **208/208** (Proben 45/46/47 neu;
  Window-Event-System im Stub ergänzt).
- Headless `tests/smoke_standalone_such_tool.mjs` **46/46** (Drift-Guard grün).
- `node --check src/modules/22_such_widget.js` grün.

## Was offen

- **Klaus' Browser-Sichttest am Galaxy Tab S6** (headless ersetzt ihn nicht):
  Splitscreen-Rückklemmung im DeX-Fenster / bei Drehung, ⛶-Vollbild + Verkleinern,
  📌-Merken-Haken + Detail-Karte + Merkliste-Overlay. Pro Feature ein eigener
  Commit — bei grün squash-mergen.
- **Vergleich / Splitscreen-zwei-Spalten (Form 1/2/3)** — Richtungsentscheid für
  Klaus, NICHT in dieser Sitzung gebaut.
- **Pilz-Server / Geld-Modell (Phase D.2)** — eigene Konzept-/Bau-Sitzung.
- Installations-Sichttest `such-tool/` am Tablet weiterhin offen (aus Vorsitzung).

## Nächster sinnvoller Schritt

Klaus testet die drei Features im Browser. Bei grün mergen. Danach Klaus' Wahl
der Vergleichs-Form (1/2/3), dann ggf. Pilz-Server-Konzept-Sitzung.

## Branch-Hinweis

Der Auftrag nannte „je eigener PR". Die Sitzung war auf den festen Branch
`claude/module-22-search-fullscreen-gf6rwq` gebunden → drei saubere, getrennte
**Commits** auf diesem einen Branch, ein PR. Reihenfolge der Commits =
Splitscreen → Vollbild → Merken, sodass Klaus pro Feature getrennt sichten kann.
