# Übergabeprotokoll · 2026-05-26 · Bau 04.C `queryLocal` + Such-Feld-Vorbereitung + Hub-Vorlage

**Sitzungs-Rolle:** Hauptsitzung Bau-Phase-A-Such-Feld-Sprint.
Pipeline-Schritt 5f (Bau 04.C) + Vorbereitung 5i (Such-Feld in
Endknoten) + Vorbereitung Phase B Schritt 9 (Externer Mycel-Hub).

**Branch:** `claude/bau-04c-suchfeld-hub-mjSYl`

**Pull-Request:** folgt — Draft.

## Auslöser

Tafel-Spec-Pflege Mycel-Vision (2026-05-26) hat Karte 04 § Sub (c)
`queryLocal` voll spec'd. Modul 15 Sub (b) `op:"query"`-Empfänger ist
seit Bau 15.B 2026-05-25 fail-soft gebaut und antwortet mit
`error:"module-04c-not-available"` weil 04.C fehlt. Diese Sitzung
schließt die Lücke (Block 1), führt das Such-Feld-Dual-Modus-Pattern
voll aus (Block 2), legt eine Hub-Landing-Page-Vorlage an (Block 3)
und schreibt drei Folge-Briefe (Block 4) für externe Sitzungen.

## Was getan — Block-Übersicht

### Block 1 — Bau Modul 04 Sub (c) `queryLocal` (Pipeline-Schritt 5f)

Code-Eingriff in `src/modules/04_match.js` (additiv):

- Fünf neue Fehler-Factories sync: `EmptyQueryError`,
  `QueryTooLongError`, `InvalidKError`, `EmbeddingNotAvailableError`,
  `InvalidCorpusError`. Closure-Factory-Stil analog
  `DimensionsAllNullError`.
- Neue Closure-State `_localCorpusProvider`. Sync-Helper
  `validateCorpus` (Array-Check + Item-Schema: label-String +
  passageVec-Float32Array(384)).
- Neue async-Funktion `queryLocal(text, k?, options?)`:
  - Sync-Vor-Checks: EmptyQueryError (leerer/nicht-String),
    QueryTooLongError (> LLM_MAX_OUTPUT_CHARS=4096), InvalidKError
    (k kein Integer >= 1), EmbeddingNotAvailableError (wenn
    SbkimEmbedding.embedQuery fehlt).
  - Korpus zwei Pfade: `options.corpus` (Vorrang) oder registrierter
    Provider via `setLocalCorpus`. InvalidCorpusError sync vor
    Embedding.
  - Leerer Korpus → leere Liste, KEIN Embedding-Call, kein Throw.
  - Embedding via `SbkimEmbedding.embedQuery(text)`,
    EmbeddingFailedError-rethrow (cause durchgereicht) + Bad-Shape-
    Check (Float32Array(384)).
  - Score pro Item via `match()`, filter ≥ `PROVIDER_MIN_MATCH=0.80`,
    sort descending, slice(0, k). Default k=5.
- Neue Public-Funktion `setLocalCorpus(corpusOrProvider)`:
  - Array → defensive Array-Kopie via `Array.from` (Items als
    Referenzen).
  - Function → lazy-lookup zur queryLocal-Zeit.
  - null/undefined → Provider entfernen.
  - Anderes Argument → `InvalidCorpusError` sync.
  - Idempotent (mehrfach rufbar).
- Selbstcheck-Zeile auf fünf Funktionen erweitert:
  `match/isAboveProviderThreshold/matchDimensions/explainMatchLLM/queryLocal`.
- `_meta` um `queryLocalDefaultK:5` + `queryLocalMaxTextLen:4096` +
  Live-Getter `localCorpusRegistered` erweitert.

`tests/manual_check.html` Panel 04 um fünf Knöpfe erweitert (Test
11–15):

- **Test 11** Happy-Path Mini-Korpus (3 Items, Ziel-Cosinus
  0.95/0.85/0.50 zum Referenz-Vektor) → 2 Treffer Top+Mittel.
- **Test 12** Schwelle-Cut (alle 3 Items unter 0.80) → leere Liste,
  kein Throw.
- **Test 13** Top-k-Cut (5 Items über Schwelle, k=2) → genau T1+T2.
- **Test 14** Provider-Pfad: `setLocalCorpus(corpus)` + queryLocal
  ohne options.corpus.
- **Test 15** Leerer Korpus + kein Provider → beide Aufrufe leer,
  `localCorpusRegistered === false`.

SbkimEmbedding wird im Test-Setup mit deterministischem
LCG-Referenz-Vektor 384-dim gemockt — KEINE Modell-Lade, keine
~30 MB Modell-Download im Test-Pfad.

Headless-Smoke `tests/smoke_bau04c_query_local.mjs`:

- 12 Probengruppen (Setup-Anker, Happy-Path, Schwelle, Top-k,
  Default-k, leerer Korpus, Provider-Pfad, Provider-Funktion,
  Provider-Vorrang, Sync-Throws, Async-Embedding-Fehler,
  defensive Array-Kopie).
- **43 Sub-Proben, 43 grün, 0 rot.**

Regression-Smoke:

- `smoke_bau04a_match_dimensions.mjs` — 19/19 grün
- `smoke_bau04b_explain_match_llm.mjs` — 30/30 grün
- `smoke_bau15b_membran.mjs` — 31/31 grün
- `smoke_bau17_floating_widget.mjs` — 32/32 grün

`node --check src/modules/04_match.js` grün. Alle 13 Inline-
`<script>`-Blöcke in `tests/manual_check.html` syntaktisch validiert.

Doku nachgezogen:

- `docs/components/04_match.md` § Bauzustand-Tabelle neue Zeile,
  § Manueller Test um Knöpfe 11–15, § Schnittstelle Selbstcheck-
  Format-Zeile.
- `docs/INTERFACES.md` §1 Modul 04 Bietet-Block + Fehlerverhalten +
  Garantien + Selbstcheck + Geprüft-Zeile, §10 Änderungsprotokoll-
  Eintrag.
- `status.json` Modul 04 `score:"stub"` (analog Bau 04.B,
  Score-Wechsel folgt nach Sichttest), `siegel` + `kurz` erweitert.
  **`update_puls_pie.py` NICHT aufgerufen** (keine Score-Änderung).

PROTOCOL_VERSION / DB_VERSION / BACKUP_FORMAT_VERSION unverändert.

**Commit:** `Bau 04.C queryLocal — lokales semantisches Such-Backend`

### Block 2 — Karte 18 § Such-Feld-Integration-Pattern voll ausgeführt

Klaus' Heuristik 2026-05-26 (Stichwort vs. Semantik) als Drei-Signal-
Klassifikator:

1. Wort-Anzahl ≤ 3
2. Kein Fragezeichen
3. Kein Bridge-Word (deutsche Liste: welcher/welches/welche/passt/
   zu/für/mit/ohne/wie/wann/warum/was/wer/wo, case-insensitiv,
   ganzes Wort)

Alle drei erfüllt → Stichwort-Modus (lokaler Substring-Filter, KEIN
queryLocal). Sonst → Semantik-Modus (queryLocal + Cross-Knoten).

`docs/components/18_tool_pwa.md` § Such-Feld-Integration-Pattern um
folgende Abschnitte erweitert:

- § Dual-Modus-Klassifikation mit Code-Schnipsel `classifySearch`.
- § Such-Helper mit Code-Schnipsel `runSearch`.
- § Sender-Helper-Code-Pattern mit volltext `sendCrossKnotenQuery`
  (BroadcastChannel `sbkim-membrane`, 3 s Timeout pro Geschwister,
  postMessage `op:"query"` + Sammeln von `op:"queryResult"`).
- § UI-Pattern: zwei Sektionen („Lokal" + „Aus dem Mycel"),
  Treffer-Spalten Label/Score/Geschwister-Verweis.
- § Anker-Pfad-Konvention: `#anchor=<anchorId>` URL-Fragment +
  scrollToAnchor-Hook-Beispiel.
- § Edge-Cases: leeres Feld, 0 lokale Treffer, Modul 03 nicht
  geladen, kein Geschwister, BroadcastChannel-Timeout, fremdes
  `error:"module-04c-not-available"`, > 4096 Zeichen,
  Debounce-Pflicht beim Aufrufer.

Pattern bleibt explizit Endknoten-Pflicht (keine Modul-18-Surface).

**Commit:** `Karte 18 Such-Feld-Pattern voll — Stichwort/Semantik-Klassifikation`

### Block 3 — SB-KIMTool-Point Hub-Landing-Page-Vorlage

`docs/components/_sb_kim_tool_point_template/` mit fünf Dateien:

- `index.html` — Single-file Hub-Landing-Page (GitHub-Pages-fähig),
  Sage-Tonalität. Mount-Anker `<section id="andock-wizard">` für
  Modul 19 + `<section id="endknoten">` für status.json-Liste.
  Floating-Widget-Mount-Skripte auskommentiert. Fail-soft-Render
  via fetch("status.json"). Verweis auf Sage-Protokol als
  Spec-Quelle.
- `status.json` — Skelett mit leerer endknoten-Liste, Hub-Spore-
  Platzhalter, Pflicht-Modul-Liste (02/17/19), spec-source-URL.
- `README.md` — Forker-Aufruf, Pflege-Konvention (keine PII, keine
  Spec-Spiegelung, keine Klaus-Endknoten im Default, kein Auto-
  Merge), Andock-Pfad in 5 Schritten, MIT-Lizenz.
- `sbkim/spore.json` — Hub-Spore-Skelett, Domain „Mycel-Hub",
  nodeType „hybrid". Felder nodeId / publicKey / domainVector /
  signature null (werden beim Andock-Wizard-Lauf erzeugt).
- `EINBAU.md` — Sieben-Schritte-Anleitung für Klaus' Folge-Sitzung
  im externen Repo: Vorlage kopieren, Module übernehmen, index.html
  aktivieren, Hub-Spore optional erzeugen, GitHub-Pages aktivieren,
  Initial-Commit, Verifikation.

**KEIN Push** ins externe Repo `lausiklauskn-png/SB-KIMTool-Point`
— die Vorlage bleibt in Sage-Protokol, das Hub-Repo wird in eigener
Folge-Sitzung befüllt (Brief liegt — siehe Block 4).

JSON-Validierung: `status.json` + `sbkim/spore.json` JSON-valid.

**Commit:** `SB-KIMTool-Point Hub-Landing-Page-Vorlage in docs/components/`

### Block 4 — Drei Folge-Briefe in `docs/sessions/`

- `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` — Such-Feld-Dual-Modus in
  Mein-Rezeptbuch. Korpus aus Rezept-Items via Modul 03 +
  setLocalCorpus. classifySearch + runSearch + sendCrossKnotenQuery
  (BroadcastChannel). UI-Pattern zwei Sektionen, Cross-Knoten-Links
  zu Mixarium-Anker. Sichttest-Plan. Endstand-Codeblock für
  Cross-Knoten-Sichttest MR↔MM.
- `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md` — Schwester-Brief für
  Mein-Mixarium. Cocktail-/Drink-Korpus, Cross-Knoten-Links zu
  Rezeptbuch-Anker.
- `BRIEF_BAU_HUB_SB_KIMTOOL_POINT_INITIAL.md` — Initial-Bau im
  externen Hub-Repo. Vorlage aus
  `_sb_kim_tool_point_template/` einsetzen + Module 02/17 kopieren
  + Hub-Spore generieren + GitHub-Pages aktivieren. Endstand-Codeblock
  für ersten Forker-Andock (Phase C Schritt 10).

**Commit:** `Drei Folge-Briefe für externe Endknoten- + Hub-Sitzungen`

### Block 5 — PULS + Übergabeprotokoll + Brief-Codeblock im Chat

- PULS.md neuer Sitzungs-Eintrag oben (zwei 2026-05-26-Einträge
  bleiben darunter erhalten).
- Übergabeprotokoll = diese Datei.
- `update_puls_pie.py` NICHT aufgerufen (keine status.json-Modul-
  Score-Änderung — Modul 04 bleibt `score:"stub"`, andere Module
  unverändert).
- Vorgeschlagene-nächste-Schritte-Block + Brief-Codeblock im Chat
  (Konvention CLAUDE.md Pflicht-5 + Pflicht-6).

**Commit:** `PULS + Übergabeprotokoll Bau 04.C + Such-Feld-Vorbereitung`

## Heilige Tafeln dieser Sitzung (alle eingehalten)

- ✓ Modul-Code-Eingriff NUR in `src/modules/04_match.js`.
- ✓ KEIN Eingriff in Module 00/01/02/03/05/06/07/08/15/16/17/18/19.
- ✓ KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- ✓ KEIN Push in externe Repos (Mein-Rezeptbuch / Mein-Mixarium /
  SB-KIMTool-Point) — Klaus startet die Folge-Sitzungen.
- ✓ KEINE Sage-Page-Änderung in `index.html` Root.
- ✓ KEIN Modul-18-Code-Bau (Karte 18 nur als Doku erweitert).

## Was offen / Nächster sinnvoller Schritt

1. **Klaus' Sichttest 04.C** (Panel 04 Knöpfe 11–15 in DeX-Chrome
   nach Hard-Reload). Nach Sichttest grün: PR mergen + Score in
   status.json auf `"fertig"` (eigene Mini-Pflege).
   ⚠ **Hard-Reload nach Klick auf Panel-04-Knopf 11+:** das Test-
   Setup mockt `window.SbkimEmbedding.embedQuery`. Wer danach Panel
   03 nutzt, sieht den Mock statt das echte Modell. Hard-Reload
   stellt das echte Modul-03 wieder her.
2. **Bau-Sitzung 16 Sub (e) Bronze/Gold-SIEGEL-Stufung** (Pipeline-
   Schritt 5g). Unabhängig von Sichttest 04.C.
3. **Externe Folge-Sitzungen** (Klaus startet im jeweiligen Repo):
   - `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` in Mein-Rezeptbuch.
   - `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md` in Mein-Mixarium.
   - Beide laufen müssen, bevor Cross-Knoten-Sichttest sinnvoll ist.
4. **Hub-Initial-Bau** in SB-KIMTool-Point (Phase B, nach
   App-Freigabe) — Brief `BRIEF_BAU_HUB_SB_KIMTOOL_POINT_INITIAL.md`
   liegt.

## Brief-Codeblock für die nächste Sitzung

Siehe Chat-Antwort der aktuellen Sitzung. Klaus entscheidet: Bau 16
Sub e (Sage-Protokol) oder eine der drei externen Sitzungen.
