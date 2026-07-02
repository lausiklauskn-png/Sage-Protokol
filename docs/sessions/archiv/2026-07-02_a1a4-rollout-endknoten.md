# Übergabeprotokoll — 2026-07-02 · A1/A4-Rollout in die Endknoten

**Rolle:** Bau-/Rollout-Sitzung · Branch `claude/sage-search-rollout-2tlm28`
**Thema:** Rollout der App-Integration (A1 Hybrid BM25+Vektor, A4 Multi-Query;
Sage Modul 22, PR #528) in die Endknoten-Apps.

## Was getan

### Investigation (Voraussetzung für „prüfen ob einzubauen ist")

Die drei Rollout-Ziele haben grundverschiedene Ausgangslagen:

| Ziel | SBKIM-Such-Pfad | Entscheidung |
|---|---|---|
| **Mein-Mixarium** | Modul 04 vorhanden (stale, Bau 04.D); einziger Such-Pfad = Cross-Knoten-Antwort-Empfänger (`op:"query"` in `15_membran.js`) + Korpus-Provider (`sbkim-init.js`). Kein nutzer-sichtbares SBKIM-Suchfeld. | **ROLLOUT** — A1/A4 in den Antwort-Pfad (Mycel-Kern-Nutzen). |
| **Mein-Rezeptbuch** | **Kein** SBKIM (kein `sbkim/`, 0 `queryLocal`/`SbkimMatch`). | **Ausgelassen** — Rollout setzt Modul-09-Migration voraus (eigener großer Auftrag, außerhalb Scope). |
| **Pinnwand** (`pinnwand/`) | Modul 03 + inline whitened Cosinus + opt-in KI-Richter; **kein Modul 04, keine 0.80-Schwelle** (zeigt ALLE Einträge, nur sortiert). | **Ausgelassen** — A1s Inklusions-Gewinn braucht einen Filter-Boden (gibt es nicht); A4 dupliziert das reine Bedeutungs-Embedding und widerspräche der „Bedeutung über Stichwörter"-These. |

### Bau (Mixarium) — PR #89 gemergt (netzweiter Selbst-Merge-Freibrief)

- **A1** — `sbkim/04_match.js` **byte-1:1 aus Sage `src/modules/04_match.js`** synchronisiert.
  Manuell verifiziert: reiner additiver Superset (BM25/`queryLocalMulti`/`expandQuerySimple`
  dazu, 4 Change-Blöcke sind additive Refactors des `queryLocal`-Innenlebens + Selbstcheck-
  String), **keine** app-eigenen Modul-04-Änderungen in Mixarium. Byte-bewiesen durch Sages
  bestehende Smokes.
- `sbkim/sbkim-init.js` — Korpus-Items tragen jetzt `text` (roher Passage-Text) → BM25 trifft
  Zutaten/Geschmack, nicht nur den Namen.
- `sbkim/15_membran.js` — neuer fail-soft-Helfer `queryWithInclusion` (A4 → A1 → Cosinus) +
  kleine `MX_QUERY_SYNONYMS`-Karte; der `op:"query"`-Empfänger nutzt ihn.
- `app-sw.js` — `SW_VERSION` v37→v38.
- Neuer Headless-Smoke `Mein-Mixarium/tests/smoke_rollout_a1a4.mjs` **14/14 grün**.

## Leitplanken

REINE INKLUSIONS-Verbesserung. `PROVIDER_MIN_MATCH` (0.80) = Vektor-Boden UND Andock-Riegel
(Modul 05) unberührt. Kein PROTOCOL_VERSION-Bump, kein Netz/LLM. `index.html` ==
`QC_Mixarium_20_04_26.html` byte-identisch unverändert (nur separate `sbkim/*.js`).

## Verifikation

- `smoke_rollout_a1a4.mjs` 14/14 grün (Cross-Phrasing-Rettung, fail-soft, Rückwärts-Kompat).
- `node --check` alle geänderten Mixarium-Dateien grün.
- md5 `index.html` == `QC_Mixarium_20_04_26.html` unverändert identisch.
- Sage-Quelle unberührt → Drift-Guards weiter grün (standalone 49/49, bundle 21/21, bau22f 17/17).
- **Browser-Sichttest (live Cross-Knoten-Antwort) wartet auf Klaus** (Mixarium `main`, PR #89 gemergt).

## Nächster sinnvoller Schritt

1. Klaus' Live-Sichttest der Mixarium-Cross-Knoten-Antwort (nach dem Merge deployt).
2. Rezeptbuch bleibt bewusst ohne SBKIM — bei Bedarf eigene Modul-09-Migrations-Sitzung.
3. Optional A4-Aufsatz: LLM-Varianten-Generator (BYOK, opt-in, wie KI-Richter) in Sage Modul 22.
