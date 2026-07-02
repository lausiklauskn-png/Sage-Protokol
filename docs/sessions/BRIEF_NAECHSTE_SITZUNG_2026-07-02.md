# BRIEF — nächste Sitzung (Stand 2026-07-02 Abend, nach Meilenstein-Sichttest)

```
Neue Sitzung — Sage-Protokol. Freibrief gilt (CLAUDE.md § Freibrief).

════════════════════════════════════════════════════════════════════
STAND — Cross-Knoten-Antwort-Kette ist LIVE bewiesen (Klaus-Browser 2026-07-02)
════════════════════════════════════════════════════════════════════
Die komplette serverlose Bedeutungs-Such-Kette läuft im Browser (Rezeptbuch, Eruda):
  window.R (47 echte Rezepte, Live-Getter) → Korpus-Provider baut faul (Modul 03
  e5-small, 384-dim) → queryLocal("kuchen",{hybrid:true}) → echte Rezeptnamen + Score.
Alles heute Gebaute ist live grün: window.R-Getter, queryLocal-await-Fix, Korpus-
Provider, A1-Hybrid. Siehe PULS oberster Eintrag „✅ MEILENSTEIN".

Heute gemergt (alles in main):
- Rezeptbuch: A1/A4-Empfänger (#279) · window.R-Getter+Korpus (#280) · Eruda sichtbar
  (#281) · queryLocal-await-Fix (#282). SW CACHE mrz-v30.
- Mixarium: A1/A4-Empfänger (#89) · window.R-Getter (#90) · Eruda sichtbar (#91) ·
  await-Fix (#92). SW v41.
- Sage: Modul-04-await-Fix + Regressions-Probe 8c (#533) · Doku/Meilenstein (#530–534).
Headless grün: smoke_bau04c 45/45 (neue async-Probe 8c), smoke_bau22 260/260,
Drift-Guards such-tool 49/49 + sbkim-bundle 21/21, Endknoten-Rollout-Smokes.

⚠️ REGEL (Rezeptbuch): IMMER gegen `main` prüfen. Der GitHub-Default-Branch ist ein
   toter Vor-SBKIM-Decoy (claude/recipe-book-app-update-fGP7B). Session-Branch von
   `main` neu aufsetzen: git checkout -B <branch> origin/main. Steht in Rezeptbuch/CLAUDE.md.

⚠️ Deploy-Disziplin: NICHT viele Einzel-PRs schnell hintereinander mergen — GitHub
   Pages serialisiert die Deploys pro Konto, die Warteschlange staut (heute erlebt).
   Änderungen bündeln, dann in wenigen Merges deployen.

════════════════════════════════════════════════════════════════════
AUFGABE (eine wählen, nicht alle)
════════════════════════════════════════════════════════════════════
1. TRENNSCHÄRFE (empfohlen, Klaus' Beobachtung): der Gratis-Cosinus-Boden ~0.80 lässt
   Fremdes durch — „Hühnerfrikassee" landet bei „kuchen" gleichauf mit echten Kuchen
   (4/5 Treffer korrekt, aber Huhn rutscht rein). Bau den opt-in KI-Richter (BYOK, wie
   in Modul 22 „verwandt · KI") in den Cross-Knoten-Antwort-Pfad ein, sodass eine echte
   KI „ist das ein Kuchen?" entscheidet und Fremdes rausfällt. REINE Anzeige/Rerank,
   0.80-Andock-Riegel (Modul 05) unberührt, Default aus, fail-soft auf Cosinus.
   Modul 04 hat hybridMatch/queryLocalJudged bereits — prüfen ob wiederverwendbar.
   Byte-Kopien (Endknoten sbkim/04, such-tool, sbkim-bundle) mitziehen, Caches bumpen.
   Braucht Klaus' Browser-Test.

2. MIXARIUM GEGENTESTEN: derselbe Live-Test mit Drinks (Fix ist dort auch live). Eruda
   → window.R.length (echte Drinks laden falls 0/blank!) → SbkimMatch.queryLocal(
   "zitrone",5,{hybrid:true}).then(r=>console.log(r.map(x=>x.label+" "+x.score))).
   Bestätigt die Kette auf beiden Endknoten. Kein Bau nötig, nur Sichttest + PULS.

3. LLM-VARIANTEN-GENERATOR (A4-Aufsatz) in Sage Modul 22: statt der kleinen
   DEFAULT_SYNONYMS-Karte optional per LLM Query-Varianten generieren (opt-in/BYOK,
   Default aus, fail-soft auf Synonym-Karte). Byte-Kopie such-tool/modules/22, SW-Cache.

════════════════════════════════════════════════════════════════════
PFLICHTLEKTÜRE (in dieser Reihenfolge)
════════════════════════════════════════════════════════════════════
CLAUDE.md · docs/PULS.md (oberster „✅ MEILENSTEIN"-Eintrag) ·
docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md (erklärt den 0.80-Anisotropie-Boden!) ·
docs/components/04_match.md + 22_such_widget.md ·
Modul 04: src/modules/04_match.js (hybridMatch/queryLocalJudged für Aufgabe 1).

Tests: Headless-Smoke + Drift-Guards such-tool/sbkim-bundle byte-1:1.
Bei Endknoten-Änderung: Mixarium index==QC md5 + SW bumpen; Rezeptbuch QC→build.py +
CACHE bumpen; und IMMER von origin/main branchen.
Selbst-Merge nach grünen Tests (Draft→ready→squash), dann prüft Klaus live.
Am Sitzungsende: PULS fortschreiben, Übergabeprotokoll, diesen Brief-Typ neu ausgeben.
```
