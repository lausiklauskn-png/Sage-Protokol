# Übergabeprotokoll — Bau 22: Such-Widget (Increment 1 — Widget-Shell)

**Datum:** 2026-06-21
**Rolle:** Bau-Sitzung Modul 22 (neu)
**Branch:** `claude/bau-22-such-widget-ws7xfh`
**Vorgänger:** Bau 21 Spracheingabe (`tests/smoke_bau21` 45/45, Sichttest-Logik
grün), Bau 04.D Hybrid-Match (`SbkimMatch.hybridMatch`).

---

## Auftrag

Schritt 2 des SBKIM-Such-Werkzeugs als **separates, frei bewegliches Floating-
Widget** (Modul 22 „Such-Widget"). Klaus' Vision: eigenes Tool (weitere Pläne),
klein im Ruhezustand, wächst nur bei Interaktion, eigenes Textfeld, leicht
transparent, lässt sich über andere Suchfelder/PWAs legen und koppelt sich beim
Auflegen mit der Wirts-PWA (Host lesen + aus dem Suchfeld interagieren).
Komponiert Sprache (Modul 21) + interne Suche (Modul 04 `queryLocal`) + Richter
(Modul 04 `hybridMatch`) + EU-Politik-Auswahl.

Reihenfolge: spec-first, dann inkrementell. **Increment 1 (diese Sitzung):
Widget-Shell + komponierte Suche.** Increment 2 (Kopplung über Modul 15):
eigene Folge-Sitzung, sicherheits-sensibel.

## Getan

- **Komponenten-Karte** `docs/components/22_such_widget.md` (Architektur, Zustände
  klein/groß, Transparenz, Drag/Self-Mount/X/Persistenz, EU-Politik, Drei-Stufen-
  Pipeline, Kopplungs-Modell Increment 2, Strikte Tabus, Risiken).
- **INTERFACES.md § 1 Modul 22** gespiegelt (Surface, options, `SearchResult`,
  localStorage-Schema, Tabus, Smoke-Stand).
- **`src/modules/22_such_widget.js`** — `window.SbkimSearchWidget`:
  - Self-Mount in `<body>` (MutationObserver-Fallback, Pattern aus Modul 17).
  - Ruhezustand 🔍-Blase ↔ Interaktions-Panel via `data-state`; wächst bei
    Tap/Fokus/Ergebnis. Leicht transparent (`rgba(...,0.90/0.92)` + backdrop-blur).
  - Drag (Pointer-Events, 5 px Threshold, Viewport-Clamping) — Mechanik aus
    Modul 17 **wiederverwendet**, Modul 17 selbst **unangetastet**.
  - X-Schließen + `show`/`hide`, `expand`/`collapse`, `getPosition`.
  - Eigenes Textfeld mit **UX-Erhalt** (nie `value:''`, erkannter Text an den
    LIVE-Feldwert angehängt).
  - Komponierte Suche `runSearch` = Spiegelung `sbkimHybridSearch`: Vorfilter
    `queryLocal` → opt-in Richter `hybridMatch` → fail-soft. Sechs Modi.
  - EU-Politik `frei`/`bindend` einheitlich für Sprach-Engine (Modul 21
    `pickEngine`) UND Richter (`euOnly`); Klick-Chip wechselt.
  - Sprach-Knopf (Modul 21): Browser-Engine → Textfeld; EU-Engine fail-soft
    Hinweis (braucht Schlüssel — Increment-1-Grenze).
  - localStorage-Persistenz (Position/Sichtbarkeit/Zustand). KEIN Auto-Init.
- **Headless-Smoke** `tests/smoke_bau22_such_widget.mjs` **55/55 grün**.
- **`index.html`** lädt das Skript (vor `sbkim-init.js`, KEIN Auto-Init).
- **Panel 22** in `tests/manual_check.html` (init/expand/collapse/show/hide +
  Demo-Korpus-Suche + `_meta`). Inline-Script `node --check` grün.
- **CLAUDE.md** Modul-Tabelle Zeile 22 + Backlog-Überschrift ergänzt (Freibrief,
  selbstständig gemerkt — logisch + nützlich).

## Geprüft

- `node --check src/modules/22_such_widget.js` grün.
- `node tests/smoke_bau22_such_widget.mjs` → **55/55**.
- Regression: `smoke_bau17` 36/36, `smoke_bau21` 45/45 grün.
- Panel-22-Inline-Script `node --check` grün.

## Offen

1. **Browser-Sichttest durch Klaus** (Drag + Sprache am Galaxy-Tab-S6) —
   headless ersetzt ihn nicht.
2. **Increment 2** — PWA-/Suchfeld-Kopplung über Modul 15 Membran (Host lesen
   via `read()` + aus dem Suchfeld interagieren via `op:"query"` postMessage).
   Sicherheits-sensibel: Host-Inhalt = `untrusted external data`. Eigene Bau-
   Sitzung. Surface-Vorgriff in der Karte (`couple`/`decouple`/`isCoupled`);
   in Increment 1 `_meta.coupled === false`, keine Kopplungs-API.
3. **Korpus-Quelle** im Standalone-Betrieb: bis zur Kopplung registriert der
   Andocker den Korpus (`init({corpus})` / `setCorpus`).

## Nächster sinnvoller Schritt

Klaus' Browser-Sichttest Panel 22 + (optional) Sage-Page-Blase, danach
Increment 2 (Kopplung über Modul 15) als eigene Bau-Sitzung.

## Sicherheit / Tabus eingehalten

Render-/Kompositions-Schicht: keine eigene Identität/Krypto/Signatur, kein
IndexedDB, kein Crawler/Eigenanfrage ins offene Netz (einziger Netz-Pfad: opt-in
Richter, BYOK, vom Nutzer ausgelöst — Empfangsmodus gewahrt). Modul 21/17/15/04
nur über öffentliche Schnittstellen genutzt, keine Querschnitts-Eingriffe. Kein
PROTOCOL_VERSION-Bump.
