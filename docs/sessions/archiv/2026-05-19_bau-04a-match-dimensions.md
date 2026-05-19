# Übergabeprotokoll — Bau-Sitzung 04.A `matchDimensions` synchron in Modul 04

**Datum:** 2026-05-19
**Sitzungs-Rolle:** Bau-Sitzung (kein Spec — Brief 03 hat alles in
INTERFACES § 1 Modul 04 + § 0 + § 7 + § 8 spezifiziert).
**Branch:** `claude/bau-04a-match-dimensions`. Folge auf den Brief
BAU_04A_MATCH_DIMENSIONS (PR #109 gemerged 2026-05-19, `main`
`ae98842`).

**Voraussetzung:** Brief 03 (PR #98 gemerged 2026-05-19, `main`
`27d6a19`), Brief 99 (PR #100), Bau 02.Y (PR #104), Pflege Modul 01
(PR #107), Sichttest-Nachzug (PR #108), Brief BAU_04A (PR #109)
gemerged.

---

## Kern (drei Sätze)

Modul 04 hat jetzt `matchDimensions(queryCap, queryNeeds, passageCap,
passageNeeds)` synchron — drei orthogonale Schichten (fachlich /
prozess / skalierung) + gewichteter `overall` + `availableLanes ∈
{0,1,2}` + `bruecke: null` (Bau 04.B füllt das via
`explainMatchLLM`). In Stufe A sind die drei Schichten eine Heuristik
über demselben Embedding-Raum — alle drei ergeben denselben Lane-
Cosinus (gemäß Karte 04 § Drei-Schichten-Modell „Aufteilung in drei
Schichten"). Die echte semantische Differenzierung passiert in Stufe B
via `explainMatchLLM` — eigene Folge-Sitzung Bau 04.B, eigener Brief.

---

## Sechs Punkte a–f

### a) INTERFACES.md zwei kleine Eingriffe

- **§ 1 Modul 04 Geprüft-Zeile** um „2026-05-19 (Bau 04.A
  `matchDimensions` sync)" erweitert.
- **§ 10 Änderungsprotokoll** neue Zeile mit voller Bau-Beschreibung.

KEIN Vertrags-Eingriff in Bietet / Storage / Fehlerverhalten /
Garantien — der Vertrag steht aus Brief 03 (gemerged 2026-05-19).

### b) Karte 04 nachgezogen

- **§ Manueller Test** um drei neue Knöpfe 7/8/9 erweitert (siehe
  Punkt d). Knopf-6-Selbstcheck-Format-Zeile auf den neuen Stand
  „match/isAboveProviderThreshold/matchDimensions, Schwellen:
  PROVIDER_MIN_MATCH=0.80, SCHICHT_MIN_MATCH=0.60" aktualisiert.
- **§ Bauzustand** zwei neue Zeilen (Bau 04.A + Sichttest ausstehend).

### c) Code in `src/modules/04_match.js`

Additiv (kein Refactoring der bestehenden `match` /
`isAboveProviderThreshold`):

- **Neue Konstante `SCHICHT_MIN_MATCH = 0.60`** modul-lokal
  gespiegelt aus § 0 (Brief 03). Bestehende `PROVIDER_MIN_MATCH =
  0.80`-Konstante unverändert.
- **Neue Konstante `MATCH_DIMENSIONS_LANES`** mit den drei Schicht-
  Namen `["fachlich", "prozess", "skalierung"]` als Read-Anker für
  Tests + Doku-Kommentar.
- **Neue Fehler-Factory `DimensionsAllNullError`** (sync, von
  `matchDimensions` bei allen vier Vektoren null). Factory-Stil
  analog Modul 02 / 08.
- **Neuer Closure-Helper `cosineSafe(a, b)`** (intern): null-safe
  wrapper um `match`. Returns null wenn `a === null || b === null`;
  sonst delegiert an `match(a, b)` mit voller Validierung.
- **Neue Funktion `matchDimensions(queryCap, queryNeeds, passageCap,
  passageNeeds)`** synchron:
  1. Alle vier null → `DimensionsAllNullError` SYNCHRON werfen.
  2. Eine Seite vollständig null (queryCap+queryNeeds null ODER
     passageCap+passageNeeds null) → Nur-Anbieter-Modus: alle
     Schichten null, `availableLanes:0`, `bruecke:null`, KEIN Throw.
  3. Lane-Berechnung: `lane1 = cosineSafe(queryCap, passageNeeds)`
     (A bietet → B sucht); `lane2 = cosineSafe(queryNeeds,
     passageCap)` (A sucht ← B bietet).
  4. `availableLanes` = Anzahl der nicht-null Lanes ∈ {0, 1, 2}.
  5. Schicht-Score: bei zwei Lanes Mittelwert, bei einer Lane der
     Single-Lane-Wert, bei keiner null.
  6. **Stufe-A-Heuristik:** alle drei Schichten (fachlich / prozess /
     skalierung) sind in Stufe A gleich dem Schicht-Score. Karte 04
     § Drei-Schichten-Modell § „Aufteilung in drei Schichten" benennt
     das explizit als heutigen Stand — echte Differenzierung kommt
     in Stufe B.
  7. `overall` = Mittelwert der nicht-null Schichten. In Stufe A
     also gleich dem Schicht-Score (weil alle drei identisch).
  8. Return `MatchDimensionsResult` mit `bruecke: null` (Bau 04.B
     füllt das).
- **`window.SbkimMatch`** um `matchDimensions`, `SCHICHT_MIN_MATCH`,
  `DimensionsAllNullError` ergänzt.
- **Selbstcheck-Zeile auf drei Funktionen erweitert:**
  `MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold/
  matchDimensions, Schwellen: PROVIDER_MIN_MATCH=0.80,
  SCHICHT_MIN_MATCH=0.60`. `explainMatchLLM` kommt mit Bau 04.B.
- **`_meta`** um `schichtMinMatch: 0.6` + `matchDimensionsLanes`
  (`["fachlich","prozess","skalierung"]`-Snapshot) erweitert.
- **Modul-Kopfkommentar** um Pflege-Block am Ende erweitert.
- `node --check src/modules/04_match.js` grün.

### d) tests/manual_check.html Panel 04 drei Knöpfe

- **Knopf 7 „matchDimensions bidirektional"** — vier 384-dim
  Float32Arrays via deterministischem LCG erzeugt + L2-normalisiert
  (KEIN SbkimEmbedding-Modell-Lade, kein ~30 MB Overhead beim
  Test). Aufruf `SbkimMatch.matchDimensions(qCap, qNeeds, pCap,
  pNeeds)`. Erwartung: `availableLanes:2`, alle drei Schichten
  gleich (Stufe-A-Heuristik), `overall === Schicht-Score`,
  `bruecke:null`. Status-Chip „matchDimensions bidirektional OK".
- **Knopf 8 „matchDimensions Nur-Anbieter-Modus"** — eine Seite
  vollständig null (`queryCap===null && queryNeeds===null`).
  Erwartung: alle Schichten null, `availableLanes:0`, KEIN Throw.
  Status-Chip „Nur-Anbieter-Modus OK".
- **Knopf 9 „matchDimensions alle vier null (Fehler erwartet)"** —
  Aufruf mit `(null, null, null, null)`. Erwartung:
  `DimensionsAllNullError` SYNCHRON geworfen, `name`-Property
  gesetzt, sprechende Message. Status-Chip
  „DimensionsAllNullError synchron".
- Alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html`
  syntaktisch validiert (`node --check` pro extrahiertem Block).

### e) Smoke-Test `tests/smoke_bau04a_match_dimensions.mjs`

Reine Funktions-Probe in Node 22 (KEIN `fake-indexeddb` nötig —
`matchDimensions` ist zustandslos + reine Funktion). Vier Proben,
**19 Sub-Proben, 19 grün, 0 rot:**

| # | Probe | Erwartet | Ergebnis |
|---|---|---|---|
| 1 | Bidirektional — `availableLanes` | 2 | ✓ |
| 2 | Bidirektional — `fachlich` in [-1, 1] | number | ✓ |
| 3 | Bidirektional — `prozess === fachlich` (Stufe-A-Heuristik) | gleich | ✓ |
| 4 | Bidirektional — `skalierung === fachlich` | gleich | ✓ |
| 5 | Bidirektional — `overall === fachlich` | gleich | ✓ |
| 6 | Bidirektional — `bruecke === null` (Bau 04.B kommt) | null | ✓ |
| 7 | Single-Lane — `availableLanes` | 1 | ✓ |
| 8 | Single-Lane — Schicht-Score === Lane-1-Cosinus | exakt | ✓ |
| 9 | Nur-Anbieter — `availableLanes` | 0 | ✓ |
| 10 | Nur-Anbieter — alle Schichten null | null/null/null/null | ✓ |
| 11 | Nur-Anbieter — `bruecke` null | null | ✓ |
| 12 | Nur-Anbieter andere Seite — `availableLanes` | 0 | ✓ |
| 13 | Alle vier null → `DimensionsAllNullError` | name | ✓ |
| 14 | Error-Message deutsch | enthält „alle vier Vektoren null" | ✓ |
| 15 | `_meta.schichtMinMatch` | 0.6 | ✓ |
| 16 | `_meta.matchDimensionsLanes` | `[fachlich,prozess,skalierung]` | ✓ |
| 17 | `SCHICHT_MIN_MATCH` exportiert | 0.6 | ✓ |
| 18 | `matchDimensions` exportiert | function | ✓ |
| 19 | `DimensionsAllNullError` exportiert | function | ✓ |

**Regression-Bonus:** Bau-02.Y-Smoke-Test 33/33 weiterhin grün,
Pflege-01-Smoke-Test 8/8 weiterhin grün.

### f) Übergabeprotokoll

Diese Datei: `docs/sessions/archiv/2026-05-19_bau-04a-match-dimensions.md`.

---

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** § 1 Modul 04 Bietet-Block + Storage-Block +
  Fehler-Block + Garantien-Block UNVERÄNDERT — Brief 03 hat alles
  spec'd. Bau 04.A zieht NUR Geprüft-Zeile + § 10 Änderungsprotokoll
  nach. KEIN Vertrags-Drift.
- **`explainMatchLLM` ist Bau 04.B.** KEIN LLM-Call, KEIN Netz-Pfad
  in Bau 04.A. Funktion bleibt im Modul-Code nicht existent
  (kein Stub, keine sprechende Fehler-Funktion — sauberer Fall).
- **`BridgeProposal` bleibt null.** Modul-Code hat das Feld
  `bruecke: null` in `MatchDimensionsResult`; Stufe B (Bau 04.B)
  befüllt es via `explainMatchLLM`.
- **Stufe-A-Heuristik gemäß Karte 04 § Drei-Schichten-Modell
  „Aufteilung in drei Schichten":** in Stufe A sind alle drei
  Schichten identisch dem Lane-Cosinus, weil heute jeder Spore-Vektor
  ein einziges 384-dim Domain-Embedding trägt (kein separater
  Prozess- oder Skalierungs-Vektor). Die Karte benennt das explizit
  als heutigen Stand und gibt das Folge-Pflege-Pattern an (separate
  `embeddingProcessNeeds` / `embeddingScaleNeeds`-Felder einführen
  später, wenn empirische Daten zeigen, dass das nötig ist —
  PROTOCOL_VERSION-Bump dann).
- **Vertrags-Synchronisation mit Modul 03 ist Pflicht.** Modul 03
  garantiert L2-Norm 1.0 — Modul 04 prüft die Norm NICHT im
  Hot-Path. `matchDimensions` setzt das fort: Eingaben werden auf
  `Float32Array(384) | null` geprüft (via existing `assertVector` in
  `match()`), nicht auf L2-Norm.
- **Bestehende Funktionen unangetastet.** `match`,
  `isAboveProviderThreshold` bleiben in ihrer bestehenden Form
  gültig (Rückwärts-Kompat). Hot-Path durchläuft denselben
  `assertVector`-Pfad wie bisher.
- **`PROTOCOL_VERSION` bleibt `"0.1"`**, **`DB_VERSION` bleibt `4`**,
  **`BACKUP_FORMAT_VERSION` bleibt `2`**. Modul 04 zustandslos.
- **Reihenfolge INTERFACES → Karte → Code** befolgt.

**KEINE Tafel-Spannung** während des Baus aufgetreten — Karte 04
§ Drei-Schichten-Modell ist eindeutig (alle drei Schichten in Stufe A
gleich; `availableLanes` 0/1/2 ist die Lane-Anzahl, nicht die
Schicht-Anzahl; `overall` = Mittelwert der nicht-null Schichten).
Der Brief hatte Schicht-Mapping-Ambiguität als mögliche Tafel-
Spannung antizipiert; in der Karte ist das aber klar geregelt.

---

## Was NICHT angefasst

- **Modul-Code 00 / 01 / 02 / 03 / 05 / 06 / 07 / 08.** Reine
  Modul-04-Erweiterung.
- **`explainMatchLLM`-Implementierung** (Bau 04.B).
- **`BridgeProposal`-Befüllung** (Bau 04.B).
- **Netz-Pfad** (Modul 04 zustandslos + lokal).
- **DB-Schema-Eingriff** (Modul 04 hat keinen Store).
- **`PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.**
- **Sage-Page (`index.html`).**
- **CLAUDE.md / Karte 09 / `status.json`.**
- **`update_puls_pie.py`-Aufruf** — Modul 04 ist bereits
  `score:"fertig"`; `matchDimensions` ist additive Erweiterung.

---

## Manueller Sichttest

**Grün geprüft 2026-05-19 (Klaus, DeX-Chrome auf Galaxy Tab S6,
Termux-`python3 -m http.server 8000`-Setup):** Bau 04.A live bewiesen.

**Schritt 1 — Knopf 7 „matchDimensions bidirektional":**
- `fachlich: -0.0084`, `prozess: -0.0084`, `skalierung: -0.0084`,
  `overall: -0.0084` — **alle vier identisch**, Stufe-A-Heuristik
  live bestätigt (drei Schichten = Schicht-Score = Lane-Cosinus).
- `availableLanes: 2`.
- `bruecke: null` (Bau 04.B kommt mit `explainMatchLLM`).
- Status-Chip grün „matchDimensions bidirektional OK".

**Cosinus-Wert-Beobachtung:** `-0.0084` ist nahe null — das ist
genau das erwartete Verhalten für zwei zufällige LCG-Vektoren in
384 Dimensionen ("Curse of Dimensionality": hochdimensionale
Zufallsvektoren sind fast orthogonal). Die Funktion ist
deterministisch + reproduzierbar (jeder Test-Lauf liefert exakt
denselben Wert), genau wie spezifiziert.

**Schritt 2 — Knopf 8 „matchDimensions Nur-Anbieter-Modus":**
- Alle Schichten `null`, `availableLanes: 0`, `bruecke: null`.
- KEIN Throw.
- Status-Chip grün „Nur-Anbieter-Modus OK".

**Schritt 3 — Knopf 9 „matchDimensions alle vier null (Fehler erwartet)":**
- `name: DimensionsAllNullError`, `synchron_geworfen: true`.
- Deutsche Message: „matchDimensions: alle vier Vektoren null.
  Aufrufer haette vor dem Aufruf pruefen muessen (siehe Karte 04
  § Fehlerverhalten + § Drei-Schichten-Modell § Nur-Anbieter-Modus)."
- Status-Chip grün „DimensionsAllNullError synchron".

**Indirekter Beleg für Pflege Modul 01 init() versions-fail-soft
(PR #107 / #108):** Klaus hat ohne Browserdaten-Cleanup direkt zu
Panel 04 weitergeklickt — `init()` läuft jetzt von selbst sauber
durch, auch bei alter DB-Version aus Bau-02.Y- / Bau-01.Y-
Sichttests. Klaus-Cleanup-Theater ist endgültig Geschichte; der
Tafel-Evolutions-Pfad (CLAUDE.md § Heilige Tafeln § Tafel-
Evolutions-Klausel aus PR #105) hat sich praktisch bewährt.

**Randnotiz zur Test-Methodik (2026-05-19):** Klaus hat zwischen
Sitzungs-Wechseln teilweise Hard-Reload (`Ctrl+Shift+R` /
Pull-to-refresh) oder „Browserdaten löschen / Letzte Stunde" gefahren.
Tiefe-Details des Chrome-Cleanup-Verhaltens je nach Version /
Plattform / Settings sind nicht abschließend geprüft — Hard-Reload
räumt sicher JS/HTML-Cache (Browser-Memory), IndexedDB bleibt
typischerweise erhalten; „Browserdaten löschen" mit Häkchen bei
„Cookies und Websitedaten" trifft die IndexedDB in Tablet-Chrome
nicht immer (siehe PULS § Offene Querschnitts-Fragen „DeX-Chrome
vs. Tablet-Chrome"). Der Beleg-Schluss für die Pflege Modul 01 hängt
nicht von der Cleanup-Tiefe ab: Klaus' Bau-04.A-Knopf 7 hat eine
deterministische `matchDimensions`-Probe gefahren, die nur
funktioniert, wenn `init()` durchgekommen ist — und durchgekommen ist
sie auf einer DB mit v > 4 (Beleg aus Bau-02.Y-/Bau-01.Y-Sichttests).

---

## Nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest der drei neuen Panel-04-Knöpfe**
   (nicht headless, wartet auf Klaus).
2. **Brief `BAU_04B` schreiben** (Meta-Pflege, ~45–60 min):
   Stufe B `explainMatchLLM` + User-Key-Verwaltung aus Brief 03
   § Stufe-B-Vertrag. Eigene Folge-Sitzung mit eigenem PR.
3. **Bau 05.Y transparenter Slot-Pfad in Modul 05** als paralleler
   Trigger (unabhängig von 04.A/B; nutzt Bau 02.Y).

---

## PR

Branch: `claude/bau-04a-match-dimensions`. Draft-PR „Bau 04.A
`matchDimensions` synchron in Modul 04".
