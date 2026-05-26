# Übergabeprotokoll — Pflege 17 Widget Bronze/Gold-Render (2026-05-26)

## Sitzungs-Rolle

Pflege-Sitzung Render-Schicht. Folge-Pflege zu Sub-(e)-Sichttest-
Bilanz vom selben Tag (Befund 1 der drei Folge-Briefe). Branch
`claude/pflege-17-widget-bronze-gold-render`. Brief
`docs/sessions/BRIEF_PFLEGE_17_WIDGET_BRONZE_GOLD_RENDER.md`.

## Anlass

Sichtbarer SIEGEL-Slot im Floating-Widget rendert stufen-unabhängig
als Gold-Medaillon mit ★ — Klaus visuell kein Unterschied zwischen
MR (pre-Handshake, sollte Bronze sein) und MM (post-Handshake, ist
Gold). Ursache: Modul 16 setzt `data-stufe="bronze"`/`"gold"` korrekt
am unsichtbaren `#sbkim-siegel-badge`-Proxy-Span im Widget-Inneren
(Spec-konform), aber der sichtbare Slot-Button daneben hat keine
Stufen-Logik.

## Architektur-Entscheidung

**Pfad (ii) aus Brief gewählt:** Modul 17 nutzt lookup auf
`SbkimSiegel._meta.siegelStufe` (Modul-16-Getter aus Bau 16 Sub e)
im `mountSiegelSlot()`-Aufruf + setzt initial-`data-siegel-stufe`-
Attribut am sichtbaren Slot + re-setzt bei `sbkim:handshake`-
outcome:"established"-Event.

**Warum (ii) statt (i) Event-only:** robust gegen Event-Reihenfolge.
Modul 16's `init()` läuft vor Modul 17's mount; ein bei Init bereits
golden geflaggter Slot zeigt sich sofort gold (initial-Lookup), nicht
erst nach dem nächsten Handshake-Event. Lookup ist fail-soft (Default
"bronze") — sicheres Minus.

## Was geändert wurde

### `src/modules/17_floating_widget.js` additiv

- Drei neue Konstanten oben:
  - `SIEGEL_STUFE_BRONZE = "bronze"`
  - `SIEGEL_STUFE_GOLD = "gold"`
  - `SIEGEL_STUFENWECHSEL_MS = 600`
- Zwei neue Closure-State-Variablen:
  - `siegelStufeRendered` (null|string — Diagnose-Anker)
  - `siegelStufenwechselTimerId` (für setTimeout-Cleanup)
- Drei neue Helper-Funktionen:
  - `getSiegelStufe()` — liest fail-soft
    `window.SbkimSiegel?._meta?.siegelStufe`, Default `"bronze"`.
  - `applySiegelStufeToSlot(stufe)` — setzt `data-siegel-stufe`-
    Attribut am sichtbaren Slot-Element + aktualisiert
    `siegelStufeRendered`.
  - `playSiegelStufenwechselAnimation()` — fügt 600 ms
    `.sbkim-widget-siegel-stufenwechsel`-Klasse hinzu + setTimeout-
    Cleanup.
- `buildWidget()`-Init-Pfad (SIEGEL beim init-Zeitpunkt zertifiziert):
  ruft `applySiegelStufeToSlot(getSiegelStufe())` nach Slot-Mount.
- `mountSiegelSlot()` (async Mount via `sbkim:siegel-certified`-Event):
  ruft dasselbe nach Slot-Mount, **VOR** `applyMinimizedState()`-
  Aufruf.
- `onHandshake()`-Listener erweitert: bei `detail.outcome ===
  "established"` + `siegelMounted === true` + `siegelStufeRendered
  !== "gold"` → `applySiegelStufeToSlot("gold")` +
  `playSiegelStufenwechselAnimation()`. Idempotent — kein Re-Animate
  beim zweiten established-Handshake.
- `_meta` um `siegelStufeRendered`-Getter erweitert.

### `buildCss()`-Block erweitert

- `#sbkim-widget .sbkim-widget-slot.siegel[data-siegel-stufe="bronze"]::before`
  + `.sbkim-widget-siegel-glyph { filter: saturate(0.6) brightness(0.85); }`
  — analog index.html § Sub (e) (dort wirkt der Filter am 40 px
  Wappen-SVG; hier am 22 px Gold-Medaillon + ★-Glyph).
- Bronze-Hover-Override mit Bronze-glow `rgba(140,110,47,0.55)`.
- `#sbkim-widget .sbkim-widget-slot.siegel[data-siegel-stufe="gold"]`
  = Default-Render, kein Override.
- `#sbkim-widget .sbkim-widget-slot.siegel.sbkim-widget-siegel-stufenwechsel::before`
  triggert 600 ms `@keyframes sbkim-widget-siegel-stufenwechsel-gold`
  (scale 1.00 → 1.15 → 1.00 + box-shadow Gold-Pulse, analog
  index.html `siegel-stufenwechsel-gold`).

### `tests/manual_check.html` Panel 17

- Header-Status auf „Code-Stub + Pflege Sub-(e)-Render 2026-05-26".
- **Test 13** „SIEGEL-Slot initial data-siegel-stufe='bronze'"
  — Mock-Modul-16 mit `_meta.siegelStufe`-Getter (initial "bronze"),
  dispatcht `sbkim:siegel-certified`, prüft Attribut + _meta-Spiegelung.
  Test akzeptiert "bronze" ODER "gold" (je nach Mycel-Stand bei
  echtem Modul 16) — entscheidend ist Attribut gesetzt + Spiegelung.
- **Test 14** „sbkim:handshake established → Gold + Stufenwechsel-
  Animation" — setzt Mock-Stufe auf "gold", dispatcht Handshake,
  prüft Attribut-Wechsel + Animations-Klasse direkt nach Dispatch.
  Asynchroner Re-Check nach 700 ms loggt Status „Klasse aktiv = false
  erwartet".

### `tests/smoke_bau17_floating_widget.mjs`

Vier neue Proben am Ende:

- **Probe 32** — SIEGEL-Slot initial `data-siegel-stufe="bronze"`,
  `_meta.siegelStufeRendered === "bronze"`, Slot im DOM.
- **Probe 33** — `sbkim:handshake outcome:"established"` → Attribut
  Gold + `_meta` Gold + `.sbkim-widget-siegel-stufenwechsel`-Klasse
  direkt nach Dispatch aktiv.
- **Probe 34** — nach 700 ms ist Stufenwechsel-Klasse wieder weg,
  Slot bleibt Gold.
- **Probe 35** — zweiter established-Handshake re-animiert nicht
  (Idempotenz).

### Karte 17

`docs/components/17_floating_widget.md` § Bauzustand neue Zeile
„Pflege Sub-(e)-Visueller Slot-Render | 2026-05-26 | Pflege 17
Widget Bronze/Gold-Render | …" zwischen „Pflege UX 2026-05-25" und
„Pflege Tooltips + Self-Heartbeat 2026-05-26".

### INTERFACES.md

- § 1 Modul 17 Bietet-Block `_meta` um `siegelStufeRendered` Eintrag
  erweitert.
- § 1 Modul 17 Vier-Slot-Layout SIEGEL-Zeile aktualisiert auf
  „Bronze/Gold (data-siegel-stufe)"; neuer Block „SIEGEL-Stufen-
  Render" mit Spec-Beschreibung (Bronze-CSS-Override, Gold-Default,
  Initial-Lookup, Re-Setting beim Handshake, Idempotenz,
  Diagnose-Anker).
- § 1 Modul 17 Geprüft-Zeile um Pflege Sub-(e)-Render 2026-05-26-
  Eintrag erweitert.
- § 10 Änderungsprotokoll neue Tabellen-Zeile mit vollem Pflege-Text.

## Was geprüft

- `node --check src/modules/17_floating_widget.js` grün.
- `node tests/smoke_bau17_floating_widget.mjs` 36/36 grün.
- `node tests/smoke_bau15b_membran.mjs` 31/31 grün (Modul-15-
  Regression).
- `node tests/smoke_bau16_sub_e_bronze.mjs` 15/15 grün (Modul-16-
  Sub-(e)-Regression).
- Inline-Skript-Check: alle 13 `<script>`-Blöcke in
  `tests/manual_check.html` syntaktisch grün.

## Heilige Tafeln eingehalten

- KEIN Modul-16-Eingriff (Modul 16 setzt `data-stufe` am Proxy-Span
  korrekt — Pflege-17-Spec-Konformität bestätigt).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag in Modul 16 (Render-Schicht-
  Pflege, kein Sicherheits-Modul-Update).
- KEIN Endknoten-Eingriff (Mein-Rezeptbuch + Mein-Mixarium ziehen
  `sbkim/17_floating_widget.js` in eigener Folge-Pflege pro Endknoten-
  Repo nach — eigene PRs pro Endknoten).
- KEINE Sage-Page-Änderung (`index.html` unangetastet — die dortigen
  `[data-stufe]`-Regeln gelten weiterhin am Navleisten-Badge auf der
  Sage-Page, sind unverändert spec-konform).
- KEINE Tafel-Umsortierung CLAUDE.md.

## Was offen

- **Klaus' Browser-Sichttest** Panel 17 Tests 13 + 14 auf der Sage-
  Page (Termux `python3 -m http.server 8000` + DeX-Chrome Hard-Reload).
- **Endknoten-Re-Migration**: Mein-Rezeptbuch + Mein-Mixarium müssen
  ihre `sbkim/17_floating_widget.js` auf den neuen Sage-Commit
  nachziehen — eigene Folge-PRs pro Endknoten-Repo. Visueller
  Vergleich: MR (Bronze, kein Verkehr) vs. MM (Gold, post-handshake)
  sollte sichtbar unterscheidbar werden.
- Optional kombinierbar mit Pflege Modul-05-Update (zweite Folge-
  Pflege aus dem Sichttest-Befund 2) — ein gemeinsamer Endknoten-
  Update-PR pro Repo.

## Nächster sinnvoller Schritt

Merge dieser PR, dann **eine Endknoten-Update-Sitzung pro Repo**
(Mein-Rezeptbuch + Mein-Mixarium) auf den neuen Sage-Commit ziehen.
Klaus' visueller Sichttest am Tablet ist der finale Beweis — Bronze
in MR, Gold in MM.

## status.json

Modul 17 unverändert (`score:"stub"` bleibt). Render-Pflege ist
additiv, kein Score-Wechsel. `python3 scripts/update_puls_pie.py`
aufgerufen — Pie-Verteilung unverändert.
