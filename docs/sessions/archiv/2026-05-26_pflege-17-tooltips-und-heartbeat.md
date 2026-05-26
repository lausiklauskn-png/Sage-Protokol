# Übergabeprotokoll — Pflege 17 Tooltips + Self-Heartbeat (2026-05-26)

## Sitzungs-Rolle

Pflege-Sitzung nach Endknoten-Re-Migrationen Mein-Rezeptbuch (PR #246)
+ Mein-Mixarium 2026-05-26. Zwei Befunde aus den Endknoten-Sichttests
abgearbeitet. Branch `claude/pflege-17-tooltips-und-heartbeat`.

## Befunde + Fixes

### Befund 1 — Doppel-Tooltips auf DeX-Chrome

Auf rechten Slots (FREMD, SIEGEL, Minimize-Knopf, X-Schließen) zeigten
sich beim longpress zwei Tooltips. Linke Slots (LEBT, VERKEHR) waren OK,
weil sie sofort beim Klick eigene Modul-17-Modals öffnen — der longpress-
Pfad wurde nicht ausgelöst.

**Diagnose:** DeX-Chrome zeigt beim longpress Browser-Standard-Tooltip
via `title`-Attribut PLUS Android-Touch-Action-Bubble = doppelt.

**Fix:** `title`-Attribut auf allen Slot-Buttons (buildSlotButton) +
Icon-Buttons (Minimize, Close in buildWidget) + applyMinimizedState
weggelassen. `aria-label` trägt jetzt den vollen Tooltip-Text
(Screenreader + A11y intakt).

Verlust: kein Hover-Tooltip auf Desktop. Bei Klaus' Tablet-Workflow
akzeptabel — Tap öffnet das jeweilige Modal als Kontext-Pfad.

### Befund 2 — LEBT-Heartbeat fehlt in Endknoten

Modul 17 LEBT-Slot wartet auf `sbkim:alive`-Event. Modul 02 dispatcht
das aktuell nur in `getOrCreateIdentity()` (Bau 17). Endknoten-`sbkim-
init.js` ruft nur `SbkimSpore.init()` — Identität wird erst beim
Andock-Wizard-Klick erzeugt. Folge: LEBT-Slot bleibt grau, suggeriert
„App lebt nicht".

**Architektur-Entscheidung:** Option (b) aus Klaus' Brief — Self-
Heartbeat-Fallback in Modul 17 (statt Option (a) Modul-02-Erweiterung
oder Option (c) Doku-Klarstellung).

Begründung: Modul 02 bleibt unangetastet (keine Tafel-Bruch); Modul 17
trägt die Fallback-Logik konsumenten-zentrisch. Anti-Greenwashing
intakt, weil Modul 17 explizit `SbkimSpore._meta.ready === true` prüft
— das Modul-02-`init()`-Lauf IST ein realer Event.

**Fix:**

- Neue Konstante `SELF_HEARTBEAT_DELAY_MS = 5000`.
- Neuer State `selfHeartbeatTimerId` + `selfHeartbeatFired`.
- Neue Funktion `scheduleSelfHeartbeat()`: setTimeout(5000) — wenn
  `eventCounts.alive === 0` UND `window.SbkimSpore._meta.ready === true`,
  dispatcht Modul 17 selbst ein synthetisches `sbkim:alive` mit
  `detail: { since, nodeId: null, synthetic: true }`. Idempotent
  (selfHeartbeatFired-Flag).
- Aufruf am Ende von `init()`.
- `_meta` um `selfHeartbeatFired` (Getter) + `selfHeartbeatDelayMs`
  (Konstante).

**Schema-Erweiterung (additiv, Karte 17 § Event-Bus-Schema erlaubt):**

- `synthetic: true|undefined` — Marker, dass Event nicht von Modul 02
  kam.
- `nodeId: string|null` — null bei Self-Heartbeat (Identität noch
  nicht erzeugt). Wenn später echtes `getOrCreateIdentity` läuft,
  kommt zweites Event mit echter nodeId — Modul 17 aktualisiert
  nodeId-Präfix.

## Tests

- **Headless-Smoke** `tests/smoke_bau17_floating_widget.mjs` 28 → **32
  Proben**, 32/32 grün:
  - Probe 26 aktualisiert: aria-label statt title.
  - Probe 29 neu: title-Attribut NICHT auf Slot-Buttons (nur aria-label).
  - Probe 30 neu: Self-Heartbeat-Success (mit SbkimSpore.ready=true).
  - Probe 31 neu: Anti-Greenwashing (ohne SbkimSpore kein dispatch).
- **Modul-15-Regression** `tests/smoke_bau15b_membran.mjs` 31/31 grün
  ohne Anpassung.
- `node --check src/modules/17_floating_widget.js` grün.

## Was offen blieb

- **Sichttest** durch Klaus auf Sage-Page (DeX-Chrome, manual_check.html):
  - Tooltips zeigen sich einmal (nicht doppelt).
  - LEBT pulst grün spätestens nach 5 s (Self-Heartbeat).
  - Konsole sauber.
- **Endknoten-Hinweis:** Mein-Rezeptbuch + Mein-Mixarium sollten ihre
  `sbkim/17_floating_widget.js` auf den neuen Sage-Commit nachziehen
  — Endknoten-CLAUDE.md Pipeline-Schritt 5d-Folge-Pflege.

## Pflicht am Ende

- src/modules/17_floating_widget.js: title-Attribute weg + Self-
  Heartbeat eingebaut ✅
- `node --check` grün ✅
- Headless-Smoke 32/32 grün ✅
- Modul-15-Regression 31/31 grün ✅
- Karte 17 § Bauzustand neue Zeile ✅
- INTERFACES.md § 10 Änderungsprotokoll ✅
- PULS.md Sitzungs-Eintrag ✅
- Übergabeprotokoll (diese Datei) ✅
- KEIN Modul-02-/05-/15-/16-Eingriff ✅
- KEIN PROTOCOL_VERSION-/DB_VERSION-Bump ✅
- KEINE Sage-Page-Änderung ✅
- KEINE Tafel-Umsortierung CLAUDE.md ✅

## Nächster sinnvoller Schritt

PR mergen + Sichttest auf Sage-Page (manual_check.html). Wenn grün:
Endknoten-Folge-Pflege (Mein-Rezeptbuch + Mein-Mixarium ziehen den
neuen Sage-Commit für sbkim/17_floating_widget.js nach).
