# Übergabeprotokoll 2026-07-01 · Bau 04.G — queryLocalJudged (Strang A2)

**Rolle:** Bau-Sitzung · **Branch:** `claude/a2-queryjudged-verankerung` (von `main` nach A1-Merge)
**Auftrag:** Brief 2026-07-01, Strang **A2** — KI-Richter (`hybridMatch`) fest im Antwort-Pfad verankern.
Klaus: „entscheide selber". **Freibrief gilt.**

## Was getan

`src/modules/04_match.js` — **rein additiv**:
- Neue async-Funktion `queryLocalJudged(text, k, options?) → {judged, candidates, judgment}`:
  Vorfilter (`queryLocal`, `options.hybrid` durchgereicht) + Richter (`hybridMatch`, opt-in via
  `options.apiKey`/BYOK). judged:true → Finalisten umsortiert (`passt` zuerst, dann Richter-Score,
  Tie-Break Cosinus). **Fail-soft**: kein Schlüssel / leerer Vorfilter / Richter nicht erreichbar →
  roher Vorfilter, kein Throw.
- Korpus wird identisch zu queryLocal aufgelöst; Text-Karte (anchorId bevorzugt, sonst label; Fallback
  label) speist den Richter mit dem Passage-**Text**. Treffer additiv `passt`/`judgeScore`/`begruendung`;
  `score` bleibt Cosinus. `HYBRID_MAX_CANDIDATES`-Cap (20), Rest un-gerichtet hinten.
- **Kein anderes Modul angefasst** (Modul-15-Verdrahtung = eigener Folge-Schritt). Export + `_meta`
  (`queryLocalJudgedNote`) + Selbstcheck + Doku (Karte 04, INTERFACES §1). Byte-Kopien `such-tool/` +
  `sbkim-bundle/`. Panel 04 **Test 21** (Vorfilter vs. Mock-Richter).

## Beweis (headless)

- **Neu:** `tests/smoke_bau04g_query_local_judged.mjs` **28/28 grün**.
- Regression: 04c 43/43, 04d 68/68, 04e 29/29, 04f 32/32, Drift-Guard standalone 46/46 + bundle 21/21.
- Panel-04-Block syntaktisch validiert. `node --check` grün.

## Leitplanken

`PROVIDER_MIN_MATCH` (0.80) + Andock-Riegel (Modul 05) unberührt. Kein Schlüssel im Code (BYOK).
Kein PROTOCOL_VERSION-/DB_VERSION-Bump. Kein Modul-Eingriff außer 04. Kein PII.

## Nächster sinnvoller Schritt

1. **Browser-Sichttest Panel 04 Test 21** (+ echter Richter-Schlüssel) — wartet auf Klaus.
2. **Modul-15-Verdrahtung** von `queryLocalJudged` in den Cross-Knoten-Antwort-Pfad (`op:"query"`) —
   eigener Schritt im Modul-15-Scope (Querschnitt → sauber getrennt gehalten).
3. Alternativ **Strang B1** (OCR-Modul, Geschwister von Modul 21) oder **A3** (Schnipsel-Chunking).

## Offene Entscheidungen für Klaus (aus dem Brief, weiterhin offen)

Pipeline-Position (parallel/blockierend) · A5-Modellwechsel-Timing · B2-Rollout-Reihenfolge.
