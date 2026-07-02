# Übergabeprotokoll — App-Integration A1 (Hybrid) + A4 (Multi-Query) ins Suchfeld

- **Datum:** 2026-07-02
- **Rolle:** Bau-Sitzung
- **Branch:** `claude/sage-app-integration-a1-a4-f4dy8b`
- **Brief:** `docs/sessions/BRIEF_A_APP_INTEGRATION.md`
- **Freibrief:** gilt (Sage CLAUDE.md § Freibrief) — Sofort-Start, kein „1/2/3/4?".

## Was getan

Die zwei gemessen-positiven Semantik-Hebel aus Strang A ins echte Suchfeld
(Modul 22) verdrahtet — bisher lief die Sortiermaschine `queryCorpus` mit reinem
`queryLocal(q, k, {corpus})` (Cosinus, 0.80-Boden).

**`src/modules/22_such_widget.js`:**
- **A1 (Bau 04.F):** Vorfilter-Aufruf auf `{corpus, hybrid:true}` gehoben
  (BM25+Vektor-Fusion). Fail-soft — ohne `text`-Feld fällt BM25 auf `label` zurück.
- **A4 (Bau 04.H):** neue `expandVariants()` → `match.expandQuerySimple(q, {synonyms})`
  mit kleiner, bidirektionaler `DEFAULT_SYNONYMS`-Karte (Rezept-/Getränke-Domäne +
  allgemeine Umschreibungen), dann `match.queryLocalMulti(varianten, k, {corpus,
  hybrid:true})` (RRF-Fusion) statt `queryLocal`.
- Neue `enrichRanked()` rekonstruiert `text/url/nodeId/passageVec` aus dem Korpus
  (queryLocalMulti gibt nur `label/score/anchorId`).
- Fallback-Kaskade: kein `queryLocalMulti` → hybrid-`queryLocal`; jeder A1/A4-Fehler
  → einfacher Cosinus-`queryLocal`; dessen Fehler → `[]`.
- `init({synonyms})` ersetzt die Default-Karte; `init({queryExpand:false})` schaltet
  A4 ab (hybrid bleibt). Neue `_meta.hybridPrefilter/queryExpand/synonymCount`.
- Gilt einheitlich für App-, Knoten- und Internet-Korpus (alle über `queryCorpus`).

**Byte-Kopie / SW:** `such-tool/modules/22_such_widget.js` byte-1:1 mitgezogen;
`such-tool/sbkim-sw.js` `CACHE_VERSION` v1→v2 (Modul 22 wird cache-first precacht).
`sbkim-bundle/` führt Modul 22 nicht → keine Kopie nötig.

## Leitplanken (gewahrt)

REINE Vorfilter-/Anzeige-Verbesserung. `PROVIDER_MIN_MATCH` (0.80) + Andock-Riegel
(Modul 05) **unberührt**, kein PROTOCOL_VERSION-/DB_VERSION-Bump, KI-Richter
(`richterRerank`, A2) unverändert daneben (opt-in), Kern-Module 04/05 nicht angefasst
(nur öffentliche Flächen genutzt). Widget-End-Sort bleibt Cosinus — der Gewinn ist
**INKLUSION** (cross-phrased Treffer unter dem 0.80-Boden werden über BM25
aufgenommen), nicht Umsortierung.

## Tests (headless — Beweis)

- **Neu:** `tests/smoke_bau22f_app_integration.mjs` **17/17 grün** — Cross-Phrasing-
  Rettung (Frage „torte" findet Doku „kuchen"; Kontrolle: `queryLocal('torte',hybrid)`
  rettet 0) + Spy (`queryLocalMulti({hybrid:true})` + Synonym-Variante) + fail-soft
  (`queryExpand:false`, Leer-Frage).
- **Regress-frei:** `smoke_bau22` 260/260 · `smoke_bau22e` 45/45 · `smoke_bau04f`
  32/32 · `smoke_bau04d` 68/68 · Drift-Guards `smoke_standalone_such_tool` 49/49 ·
  `smoke_bundle_connect` 21/21.
- **Browser-Sichttest:** ungeprüft — wartet auf Klaus (nach Merge live; Pages von main).

## Nächster sinnvoller Schritt

1. Rollout byte-gleich in `pinnwand/` (hat KEIN Modul 04 — prüfen ob sinnvoll)
   und die Endknoten-PWAs Mixarium/Rezeptbuch (eigenes Suchfeld — separat prüfen,
   ob A1/A4 dort passt).
2. LLM-Varianten-Generator (A4 opt-in-Aufsatz, BYOK, wie KI-Richter) — später,
   nicht blockierend.
3. A5 Embedding-Modellwechsel bleibt eigener Brief (netzweit schwer umkehrbar).
