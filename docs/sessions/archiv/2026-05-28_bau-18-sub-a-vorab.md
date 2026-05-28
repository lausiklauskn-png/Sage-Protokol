# Übergabeprotokoll · 2026-05-28 · Bau-Sitzung 18 Sub (a) Vorab

**Branch:** `claude/bau-18-sub-a-vorab-Ze6Xf`
**Pipeline-Schritt:** Phase A **5h.1** (Bau Sub (a) Vorab — Andocken-
Pfad allein, nach Spec-Sitzung 18 Sub (a) Vorab PR #190)
**Sitzungs-Rolle:** Bau-Sitzung. Implementiert ausschließlich
Sub (a) Vorab; Sub (b)–(i) bleibt Voll-Bau 18 (Pipeline 5h.2 NACH
App-Freigabe).
**Auslöser:** Klaus' Pipeline-Klärung 2026-05-28 — Modul 18 Sub (a)
Andocken-Pfad **vor** dem Multisuchfeld umsetzen. Macht den fail-
soft-Hook im Modul-16-Sub-(e)-Bronze-Modal (PR #180) produktiv und
versorgt das Multisuchfeld mit einer realen Andock-Surface.

---

## Was getan

### 1. Spec-Merge in Bau-Branch

PR #190 (Spec-Sitzung 18 Sub (a) Vorab) ist beim Start der Sitzung
noch nicht in `main` gemergt — der Brief geht aber von gemergtem
Spec aus. Lösung: `origin/claude/spec-18-sub-a-vorab-2oi16` per
fast-forward in die Bau-Branch gemergt, damit der Bau auf der Spec
aufsetzt. PR #190 entscheidet Klaus separat.

### 2. Modul-Code `src/modules/18_tool_pwa.js`

~1 000 Zeilen inkl. Inline-CSS. Strukturierung in fünf Bereiche:

1. **Konstanten + Errors** — `PROVIDER_MIN_MATCH=0.80` /
   `SCHICHT_MIN_MATCH=0.60` / `EMBEDDING_LOAD_TIMEOUT_MS=30000` /
   `HANDSHAKE_AUTO_CLOSE_MS=2000` / `MODAL_Z_INDEX=10000`.
   Factory-Errors `ToolPwaNotReadyError` (Liste der fehlenden Felder
   im Message) + `ToolPwaInvalidUrlArgError` (URL + Cause).
2. **`init(options)`** — fail-soft, idempotent, Pflicht-Feld-
   Sanity-Check; clamp `matchThreshold` auf `[0, 0.80]` mit warn
   bei > 0.80; `repoUrl` Auto-Erkennung; `externalHubUrl` Read-
   Anker (KEIN Fetch).
3. **`openAndockTab(url?)`** — Sync-Validierung vor await
   (`ready === true`-Check + `new URL(url)`-Check); async Modal-
   Mount mit Self-Mount-Observer-Fallback; bereits-offen + gleiche
   URL = no-op; bereits-offen + andere URL = Reset auf Schritt 2.
4. **Vier-Schritt-Stepper-UI** — komplett-Rebuild pro Schritt-
   Wechsel; Schritt 1 URL-Input, Schritt 2 Spore-Fetch +
   `verifyForeignSpore`, Schritt 3 Match-Check mit Lazy-Embedding +
   Drei-Schichten-Bars (fachlich/prozess/skalierung), Schritt 4
   Handshake + auto-Close 2 s.
5. **Inline-CSS via `<style>`-Inject** — Drei-Zeilen-Einbau-
   Konvention (analog Modul 17). `z-index: 10000` (> Modul-17-
   Modal-9999, Spec § Risiken Modal-Konflikt-Mitigation).

`_meta`-Read-Anker liefert via `Object.defineProperty` getter eine
**defensive Kopie** pro Lese-Zugriff — Array-Mutation am Snapshot
beeinflusst den Closure-State NICHT (Probe 11 im Smoke).

Selbstcheck-Zeile beim Skript-Laden:
`MODUL 18 TOOL-PWA bereit, Sub (a) Vorab, Funktionen: init/openAndockTab/close/isOpen`.

### 3. `index.html` erweitert

Ein `<script src="src/modules/18_tool_pwa.js"></script>` vor
`sbkim-init.js` ergänzt. **KEIN `SbkimToolPwa.init()`-Aufruf** auf
der Sage-Page — Sub (a) Vorab ist Endknoten-Pflicht. Sage-Page
hat ihren eigenen Andock-Wizard (Schwarz-Loch-Karte) und braucht
das Modul nur zum Code-Verifikations-Zweck (Klaus' Sichttest am
Tab läuft via `tests/manual_check.html` Panel 18).

### 4. `tests/manual_check.html` Panel 18

Neuer Panel-Block mit Header, Beschreibungs-Text und 11 Test-
Knöpfen über `SbkimUI.addButton`:

- Setup: `init({…vollständig…})`.
- Test 1: Surface + Selbstcheck-Hinweis.
- Test 2: `init({})` ohne Pflicht-Felder → `console.warn` +
  `ready=false`.
- Test 3: `init({…vollständig…})` → `ready=true`.
- Test 4: `openAndockTab()` ohne ready → `ToolPwaNotReadyError`.
- Test 5: `openAndockTab()` mit ready → Modal Schritt 1.
- Test 6: `openAndockTab("https://…")` → Schritt 2 direkt.
- Test 7: `openAndockTab("not-a-url")` → `ToolPwaInvalidUrlArgError`.
- Test 8: `close()` schließt Modal.
- Test 9: `matchThreshold > 0.80` → clamp + warn.
- Test 10: `externalHubUrl` als string → `_meta` gespiegelt (kein
  Hub-Fetch).
- Reset-Knopf für sauberen Vorzustand vor Test 4.
- Selbstcheck-Konsolen-Hinweis.

### 5. Headless-Smoke `tests/smoke_bau18_sub_a_vorab.mjs`

17 Proben, alle grün:

| # | Probe | Status |
|---|---|---|
| 1 | Public Surface (init/openAndockTab/close/isOpen + _meta) | ✓ |
| 2 | init({}) ohne Pflicht-Felder → warn + ready=false + missingFields[3] | ✓ |
| 3 | init({…vollständig…}) → ready=true + missingFields leer + _meta gespiegelt | ✓ |
| 4 | openAndockTab() ohne ready → ToolPwaNotReadyError sync | ✓ |
| 5 | openAndockTab() mit ready → Modal in body + Style in head + Schritt 1 | ✓ |
| 6 | openAndockTab("https://…") → springt direkt zu Schritt 2 | ✓ |
| 7 | openAndockTab("not-a-url") → ToolPwaInvalidUrlArgError sync | ✓ |
| 8 | close() schließt Modal + isOpen()=false + currentStep=0 | ✓ |
| 9 | matchThreshold > 0.80 → clamp + console.warn | ✓ |
| 10 | externalHubUrl als string → _meta gespiegelt + KEIN Hub-Fetch | ✓ |
| 11 | _meta liefert defensive Kopie (Array-Mutation am Snapshot ohne Effekt) | ✓ |
| 12 | modalOpen-Toggle (init=false / open=true / close=false / open=true) | ✓ |
| 13 | currentStep-Bewegung (ohne=1, mitUrl=2, close=0) | ✓ |
| 14 | missingFields-Reset bei Re-Init mit vollen Feldern | ✓ |
| 15 | Re-Use SbkimEmbedding._meta.ready=true → kein init-Aufruf + Match-Bars | ✓ |
| 16 | Idempotenz mit identischen opts → no-op (kein warn) | ✓ |
| 17 | repoUrl Auto-Erkennung aus location | ✓ |

Lauf: **17/17 grün**.

### 6. Regression der Vor-Sitzungen

| Test | Vorher | Nach Bau 18 Sub (a) Vorab |
|---|---|---|
| `smoke_bau15b_membran.mjs` | 31/31 | **31/31** ✓ |
| `smoke_bau16_sub_e_bronze.mjs` | 16/16 | **16/16** ✓ |
| `smoke_bau17_floating_widget.mjs` | 36/36 | **36/36** ✓ |

### 7. Syntax-Checks

- `node --check src/modules/18_tool_pwa.js` → grün.
- Alle 14 inline-script-Blöcke in `tests/manual_check.html` →
  grün (Python-Pipe extrahiert + `node --check` pro Block in
  tempfile).

### 8. Doku-Pflege

- **`docs/components/18_tool_pwa.md`:** Status-Header auf 🟦
  **Code-Stub Sub (a) Vorab** + Sub (b)–(i) bleibt 🟫 Schablone.
  Bauzustand-Tabelle um Zeile „Bau Sub (a) Vorab — 2026-05-28 —
  Bau-Sitzung 18 Sub (a) Vorab" am Listen-Ende ergänzt mit
  voller Bau-Begründung (Surface / Disziplinen / Smoke /
  Regression / Tabus).
- **`docs/INTERFACES.md` § 1 Modul 18:** Status-Block auf
  „Code-Stub (Bau Sub (a) Vorab)" geändert; Geprüft-Zeile um
  zweite Datums-Zeile mit voller Bau-Begründung ergänzt (alle
  Pflicht-Disziplinen sichtbar verankert).
- **`status.json` Modul 18:** von `score:"schablone"` auf
  `score:"stub"` gehoben (Konvention analog Modul 17 nach Bau-
  Sitzung 17 — Code-Stub mit Sichttest ungeprüft). `abhaengig:
  ["02","03","04","05","16"]` ergänzt.
- **`scripts/update_puls_pie.py`** ausgeführt — Pie zeigt jetzt
  7 Schablone / 9 Code-Stub / 5 Fertig (Modul 18 wechselt von
  Schablone-7-Bucket in Code-Stub-9-Bucket).
- **`docs/PULS.md`:** voller Sitzungs-Eintrag oben.

---

## Pflicht-Disziplin eingehalten

- ✓ KEIN Code für Sub (b)–(i). NUR Sub (a) Vorab-Surface.
- ✓ KEIN Endknoten-Eingriff (MR + MM Re-Migration ist eigene
  Folge-Sitzung pro Endknoten-Repo).
- ✓ KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump (Sub (a) Vorab ist RAM-only Render-Schicht).
- ✓ KEINE neuen Module (KEIN Modul 19, KEIN Vision-Anker-5-
  Container).
- ✓ KEINE Tafel-Umsortierung CLAUDE.md (5h → 5h.1+5h.2-Pflege ist
  eigene Folge-Sitzung).
- ✓ KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Modul 18 ist Wartungs-/
  Andock-Schicht, kein Sicherheits-Modul).
- ✓ KEIN automatisches Andock-Triggern.
- ✓ KEIN Hub-Fetch in Sub (a) Vorab.
- ✓ KEIN `matchThreshold > PROVIDER_MIN_MATCH`.

---

## Was offen blieb

1. **Klaus' Browser-Sichttest Panel 18 Knöpfe 1–10** — nicht
   ersetzbar (CLAUDE.md Konvention „Klaus' Browser-Sichttest ist
   nicht ersetzbar"). Headless-Smoke bestätigt Modul-Logik; jeder
   echte Bug zeigt sich erst am Tab.
2. **PR #190 (Spec-Sitzung 18 Sub (a) Vorab)** noch offen in
   `main`. Diese Bau-Branch enthält den Spec-Merge fast-forward,
   damit der Bau auf der Spec aufsetzt. Klaus entscheidet die
   Merge-Reihenfolge.
3. **Endknoten-Re-Migration MR + MM** — Folge-Sitzungen pro
   Endknoten-Repo. Brief-Codeblock in der Bau-Sitzungs-Antwort.
4. **Sub (b)–(i) Voll-Spec + Voll-Bau** — Pipeline 5h.2 NACH
   App-Freigabe.
5. **PULS.md über 3000-Zeilen-Schutzklausel** (3636 Zeilen) — war
   schon vorher (3330 Zeilen auf `main`). Eigene Archiv-Auslagerungs-
   Pflege-Sitzung nötig (kein Scope dieser Bau-Sitzung).

---

## Nächster sinnvoller Schritt

**Klaus' Sichttest Panel 18 Knöpfe 1–10** (DeX-Chrome, Galaxy Tab S6,
Termux-localhost:8000 nach Hard-Reload).

Bei grünem Sichttest startet die **Endknoten-Re-Migration MR**
(Mein-Rezeptbuch) als eigene Folge-Sitzung im externen Endknoten-
Repo. Brief-Codeblock liegt in der Chat-Antwort dieser Sitzung.

---

## Querverweise

- Brief Spec-Sitzung 18 Sub (a) Vorab:
  `docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md` (PR #190).
- Karte 18: `docs/components/18_tool_pwa.md`.
- Karte 16 § Sub (e) Klick-Verhalten: `docs/components/16_siegel.md`
  (fail-soft-Hook seit PR #180 — wird durch Bau Sub (a) Vorab
  produktiv).
- Multisuchfeld-Spec-Brief: `docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md`
  (Schwester-Brief, Pipeline 5i.2 — setzt `openAndockTab(url)` voraus).
- INTERFACES § 0: `PROVIDER_MIN_MATCH=0.80`, `SCHICHT_MIN_MATCH=0.60`.
