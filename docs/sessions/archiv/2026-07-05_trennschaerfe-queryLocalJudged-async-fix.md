# Übergabeprotokoll — 2026-07-05 · Trennschärfe (Aufgabe 1): `queryLocalJudged` async-Provider-Fix

**Rolle:** Bau-/Fix-Sitzung. **Branch:** `claude/cross-node-search-verification-nmt3bd` (von `main` #535).
**Freibrief gilt** (CLAUDE.md § Freibrief).

## Auftrag
Aufgabe 1 aus `docs/sessions/BRIEF_NAECHSTE_SITZUNG_2026-07-02.md`: **Trennschärfe** — opt-in
KI-Richter in den Cross-Knoten-Antwort-Pfad, damit Fremdes (z.B. „Hühnerfrikassee" bei „kuchen")
rausfällt. Klaus' ausdrücklicher Zusatz: „nimm nur den aktuellen Main, prüf genau — wir sind schon
weiter."

## Prüfung zuerst (Klaus' Warnung ernst genommen)
- **Branch-Stand dreifach verifiziert** (lokal / frischer Fetch / GitHub-API): `main`-HEAD = `e80a0f8`
  (#535), Session-Branch 0 vor / 0 zurück. Kein neuerer Merge. Sage-Default ist `main` (kein Decoy —
  die Wrong-Branch-Falle betrifft nur Mein-Rezeptbuch).
- **Brief noch aktuell:** byte-identisch mit `BRIEF_NAECHSTE_SITZUNG_2026-07-02.md` (#535), nichts Neueres.
- **„Schon weiter"-Fund:** `queryLocalJudged` (Bau 04.G) **existiert bereits** — Vorfilter (`queryLocal`)
  + Richter (`hybridMatch`, opt-in/BYOK, fail-soft), exportiert, byte-kopiert (such-tool + sbkim-bundle),
  im `op:"query"`-Empfänger von Modul 15 verdrahtet (`setQueryJudge`), Siegel-Aspekt gesetzt. **Kein Neubau.**

## Befund + Fix
**Live-Bug:** `queryLocalJudged` löste den registrierten Korpus-Provider **ohne `await`** auf
(`src/modules/04_match.js` Z. ~1773) — der async-Provider-Bug, den PR #533 in `queryLocal` fixte,
in 04.G aber übersehen. Der Cross-Knoten-Empfänger übergibt nur die Richter-Config (keinen Korpus)
→ Provider-Pfad → auf den Endknoten **async** → Promise als Korpus → `InvalidCorpusError` → Empfänger
antwortet **leer** (`module-04c-query-failed`). D.h. KI-Richter live einschalten hätte **nichts**
statt geurteilter Treffer geliefert.

**Fix:** `await` + try/catch (fail-soft parity mit `queryLocal`), byte-1:1 in allen drei Modul-04-Kopien
(`src/`, `such-tool/`, `sbkim-bundle/` — md5-gleich). `PROVIDER_MIN_MATCH` / Modul 05 / PROTOCOL_VERSION
unberührt.

**Test:** Regressions-**Probe 8** (async Provider via `setLocalCorpus`) in
`tests/smoke_bau04g_query_local_judged.mjs`. Vorher blind (nur explizites `corpus:`). Gegenbeweis: ohne
Fix wird Probe 8 rot (wirft); mit Fix **36/36 grün** (vorher 28).

## Verifikation (headless — Klaus' Browser-Sichttest ersetzt das nicht)
Drift-Guards such-tool 49/49 · sbkim-bundle 21/21 · smoke_bau04c 45/45 · 04d 68/68 · 04f 32/32 ·
04g 36/36 · 15b 35/35 · 22 260/260 · 22e 45/45 · 22f 17/17.

## Nächster sinnvoller Schritt
1. **Endknoten-Rollout** (Folge-Sitzung, Option B): Byte-Kopie `sbkim/04_match.js` in Mein-Rezeptbuch +
   Mein-Mixarium nachziehen (+ SW-Cache-Bump) — dort greift der Fix erst nach dem Rollout. Immer von
   `origin/main` branchen (Rezeptbuch-Default ist ein toter Decoy).
2. **Klaus' Browser-Sichttest** mit echtem Schlüssel: KI-Richter live einschalten, „kuchen" → Hühnerfrikassee
   muss rausfallen.
3. Danach ggf. RELATEDNESS_CENTER v2 (gratis-Pfad-Kalibrierung) als eigene Baustelle.
