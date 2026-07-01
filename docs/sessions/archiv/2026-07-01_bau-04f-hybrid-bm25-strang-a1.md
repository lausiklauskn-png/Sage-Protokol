# Übergabeprotokoll 2026-07-01 · Bau 04.F — Hybrid BM25+Vektor (Strang A1)

**Rolle:** Bau-Sitzung · **Branch:** `claude/semantic-matching-mistral-ocr-raxbb9`
**Auftrag:** Brief 2026-07-01 „Semantische Matching-Qualität (Strang A) + Mistral-OCR (Strang B)",
Schritt **A1** (BM25 + Vektor Hybrid in Modul 04 `queryLocal`) — der im Brief benannte größte Hebel.
**Freibrief gilt** (CLAUDE.md § Freibrief).

## Was getan

`src/modules/04_match.js` — **rein additiv**, keine bestehende Funktion verändert:
- `tokenizeBM25(text)` — unicode-bewusst, lowercase, sprach-agnostisch (kein Stemming), deterministisch.
- `bm25Scores(queryText, docTexts, options?)` — Robertson-Sparck-Jones-IDF, `k1=1.5`/`b=0.75`,
  exportiert für Panel-04-Messung (VERFAHREN-VERGLEICH) + Testbarkeit.
- `rrfScore(vRank, lexRank)` (intern) — Reciprocal Rank Fusion, `RRF_K=60`.
- `queryLocal` erweitert um opt-in `options.hybrid`:
  - **ohne Flag:** byte-gleiches Bau-04.C-Verhalten (nur Cosinus, Filter ≥ `PROVIDER_MIN_MATCH`, Top-k).
  - **`hybrid:true`:** Aufnahme = (cos ≥ 0.80 **ODER** bm25 > 0), Sortierung nach `fused` (Tie-Break
    Cosinus). Treffer tragen additiv `bm25` + `fused`; `score` bleibt der Cosinus (unveränderte Semantik).
- `validateCorpus` akzeptiert optionales `text`-Feld (BM25-Doc; fehlt es → Fallback auf `label`).
  Bestands-Korpora ohne `text` bleiben gültig.
- Export + `_meta` (`bm25K1`/`bm25B`/`rrfK` + `hybridQueryLocalNote`) + Selbstcheck-Zeile nachgezogen.

Doku: Karte 04 § Bauzustand (Bau 04.F + Sichttest-Zeile), INTERFACES.md §1 (Signatur + Selbstcheck).
Byte-Kopien `such-tool/modules/04_match.js` + `sbkim-bundle/modules/04_match.js` mitgezogen (md5-gleich).

## Beweis (headless)

- **Neu:** `tests/smoke_bau04f_hybrid_bm25.mjs` **32/32 grün** — Export-Anker, Tokenizer, BM25-Grundlagen
  + IDF-Effekt, DEFAULT-Regression (byte-gleich), **Kern-Hebel** (Eintrag unter Vektor-Boden mit
  Lexik-Treffer wird aufgenommen), Fusion-Reihenfolge, text-Fallback, leerer Korpus/k-Grenze, text-Typ-Throw.
- Regression: `smoke_bau04c` 43/43, `04d` 68/68, `04e` 29/29, `standalone` 46/46 (Drift-Guard),
  `bundle_connect` 21/21, `bau05_nostr` 17/17 (konsumiert Modul 04). Modul-01/05–08-IndexedDB-Tests grün
  nach `npm i fake-indexeddb` (fehlte im frischen Klon; nichts durch Bau 04.F berührt).

## Leitplanken eingehalten

`PROVIDER_MIN_MATCH` (0.80) unverändert = Vektor-Pfad-Boden UND Andock-Riegel (Modul 05 unberührt).
Kein Netz/LLM/Schlüssel in BM25 (reine lokale Rechnung). Kein PROTOCOL_VERSION-/DB_VERSION-Bump.
Kein Modul-Eingriff außer 04. Kein PII.

## Nächster sinnvoller Schritt

1. **Schritt 0 (Baseline) + Bau-04.F-Sichttest** — Panel 04 im Browser (KALIBRIER-BODEN /
   SCHWELLEN-ANALYSE / VERFAHREN-VERGLEICH + Hybrid-Vergleich am realen Korpus). **Wartet auf Klaus.**
2. **Panel-04-Knopf für Hybrid** in `tests/manual_check.html` (Test 20: `queryLocal({hybrid:true})`
   vs. Default) — Folge-Pflege; headless deckt die Logik ab.
3. **Strang A2** (Richter `hybridMatch` fest in Cross-Knoten-Antwort-Pfad) — additiv, headless-bar.
4. **Strang B1** (OCR-Modul, Geschwister von Modul 21) — eigener Bau; wartet auf Klaus'
   Rollout-Reihenfolge (B2).

## Offene Entscheidungen für Klaus (aus dem Brief)

- Pipeline-Position von A1–B1 ggü. der Bestands-Pipeline bis App-Freigabe (parallel vs. blockierend)?
- A5 Embedding-Modellwechsel jetzt oder nach Hybrid-Messung?
- B2 App-Rollout-Reihenfolge (Sage Such-Tool / Mixarium+Rezeptbuch / BookLedgerPro zuerst)?
