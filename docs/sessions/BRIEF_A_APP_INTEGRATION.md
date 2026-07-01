# BRIEF — Strang A: App-Integration A1 (Hybrid) + A4 (Multi-Query) ins Suchfeld
Absender: Vorgänger-Sitzung (2026-07-01) · Typ: BAU · Klaus müde, hat „für die neue Sitzung" beauftragt.
Freibrief gilt (Sage CLAUDE.md § Freibrief) — inkl. netzweitem Selbst-Merge-Freibrief.

## SOFORT-START (Klaus' ausdrückliche Anweisung 2026-07-01)
**Ohne weitere Nachfrage direkt mit „1" (App-Integration) beginnen.** Klaus hat entschieden:
die zwei gemessen-positiven Hebel (A1 + A4) ins echte Suchfeld verdrahten, damit Nutzer den
Vorteil bekommen. Kein erneutes „1/2/3/4?"-Fragen. (Plan-vor-Code entfällt im Freibrief-Umfang
für genau diese Aufgabe; bei echtem Zweifel weiter fragen.)

## STAND — gemessen & gemergt (nicht neu bauen)
Drei Hebel im Browser gemessen (Klaus, Panel 04):
- **A1 Hybrid BM25+Vektor** — POSITIV (4/4 Wort-Treffer gerettet, 0 Fehl). `queryLocal(text,k,{hybrid:true})`.
- **A3 Contextual Chunking** — NEGATIV (Δ −0.11), abgeschlossen, NICHT verdrahten.
- **A4 Query-Expansion / Multi-Query** — POSITIV (4/4 Ziele gerettet).
  `expandQuerySimple(text,{synonyms?,maxVariants?})` + `queryLocalMulti(queries,k,options)` (RRF-Fusion).
Alles in Modul 04 (`src/modules/04_match.js`), byte-1:1 in `such-tool/` + `sbkim-bundle/`.
family-project OCR (Strang B2) erledigt (family PR #21).

## DIE AUFGABE (konkret, minimal-invasiv)
**Suchfeld = Modul 22 (`src/modules/22_such_widget.js`).** Heute ruft die lokale Sortiermaschine
(~Z. 2472–2476) `match.queryLocal(query, k, { corpus: corpus })` — OHNE hybrid, OHNE Multi-Query.

1. **A1 verdrahten:** den Vorfilter-Aufruf auf `{ corpus, hybrid: true }` heben (BM25+Vektor-Fusion).
   Additiv, fail-soft (ohne `text`-Feld im Korpus fällt BM25 auf `label` zurück — schon so gebaut).
2. **A4 verdrahten:** vor der Suche Varianten bilden und `queryLocalMulti(varianten, k, {corpus, hybrid:true})`
   statt `queryLocal` nutzen. Varianten-Quelle:
   - **Frei/offline (Default):** `expandQuerySimple(query, { synonyms })` mit einer kleinen, app-
     eigenen **Synonym-Karte** (z. B. Rezept-/Getränke-Domäne: „kfz"→„auto", „notebook"→„laptop",
     „torte"→„kuchen" …). Ohne Karte = nur `[query]` (byte-gleich zum Einzel-Fall, kein Regress).
   - **Opt-in (später):** LLM-Varianten-Generator (BYOK, wie der KI-Richter) — als Aufsatz,
     NICHT blockierend. Erst Freipfad liefern.
3. **Reine Anzeige / Leitplanken:** `PROVIDER_MIN_MATCH` (0.80) + Andock-Riegel (Modul 05) unberührt;
   kein PROTOCOL_VERSION-/DB_VERSION-Bump; fail-soft (kein Modul 04 → Textfeld bleibt nutzbar).
   Der KI-Richter (A2, Modul 22 `richterRerank`) bleibt unverändert daneben (opt-in).

## PFLICHTLEKTÜRE VOR BAU (in dieser Reihenfolge)
1. CLAUDE.md (§ Freibrief, § Pipeline-Reihenfolge, § Tafel-Evolutions-Klausel)
2. docs/PULS.md (oberste Einträge: A4/A3/A1-Messungen)
3. docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md (warum Cosinus allein nicht reicht; A1/A4 = zweiter Zugang)
4. docs/components/22_such_widget.md + 04_match.md (Bau 04.F Hybrid, Bau 04.H Multi-Query)
5. src/modules/22_such_widget.js (Z. ~1673 search / ~2472 Sortiermaschine / ~2595 richterRerank),
   src/modules/04_match.js (queryLocal hybrid, queryLocalMulti, expandQuerySimple)

## TESTS / VERIFIKATION
- Headless: neuen Smoke `smoke_bau22*_app_integration` ODER bestehenden `smoke_bau22*`-Lauf erweitern —
  beweisen, dass die Sortiermaschine hybrid+multi nutzt (Cross-Phrasing-Rettung sichtbar).
- Panel/Standalone-Smoke grün halten; **Drift-Guards** (`smoke_standalone_such_tool.mjs`,
  `smoke_bundle_connect.mjs`) byte-1:1 — Modul 04 UND 22 nach jeder Änderung in `such-tool/` +
  `sbkim-bundle/` kopieren.
- Panel-04-Messknöpfe (A1/A3/A4-NACHMESSUNG) bleiben als reproduzierbare Instrumente.
- Browser-Sichttest wartet auf Klaus (nach Merge live; Pages deployt von main).

## ROLLOUT (nach Sage-Kern)
Byte-gleich in die App-Kopien: `such-tool/` + `pinnwand/` (Drift-Guard) + die Endknoten-PWAs, die das
Such-Widget fahren (Mixarium/Rezeptbuch nutzen eigenes Suchfeld — dort separat prüfen, ob A1/A4 passt).
Pro Repo die Per-Repo-Disziplin beachten (unten).

## OFFENE FÄDEN (nicht vergessen)
- A5 Embedding-Modellwechsel (e5-base/BGE-M3/Jina): NUR NACH MESSUNG, netzweit schwer umkehrbar —
  EIGENER Brief, Entscheidung Klaus. Aktuell multilingual-e5-small (384D).
- A6 GraphRAG / Self-Reflective RAG (später, groß).
- family-project pre-existing Smoke-Bug „footer: Bauleiste öffentlich verborgen" (tests/smoke_all.mjs
  ~Z.121) — NICHT von OCR, eigener Mini-Fix, Klaus fragen ob gewünscht.
- App-UX (Rezept-Apps): (1) eigene Kategorie direkt beim Rezept/Scan (Klaus-Frage 1/2/3 offen);
  (2) schlanke Schlüssel-Erklärung im KI-Scan (Schritte 1·2·3); (3) Import-Ordner-Option auch in
  Mixarium/Muttis (haben _showCatMapDialog NICHT).

## DATENVERTRÄGE / LEITPLANKEN (nicht brechen)
- Additiv: PROTOCOL_VERSION unberührt (außer A5 = bewusster netzweiter Bump, eigener Brief).
- 0.80-Andock-Riegel (Modul 05) nie durch A1/A4 verändern; reine Anzeige bleibt reine Anzeige.
- Kein PII, kein Schlüssel im Code, alles BYOK + fail-soft.
- Ehrlichkeit: „erst messen, dann behaupten". Browser-Sichttest wartet auf Klaus.

## PER-REPO-DISZIPLIN
- Sage: Modul-Änderung in src/modules/* → byte-Kopie such-tool/ + sbkim-bundle/ (+ pinnwand/ für 03/24;
  pinnwand hat KEIN Modul 04). Cache-Bust an manual_check.html-Script-Tags bumpen.
- Mein-Mixarium: index.html == QC byte-identisch (md5sum!), app-sw SW_VERSION bumpen.
- Mein-/Muttis-Rezeptbuch: Änderung in QC → python3 build.py, app-sw CACHE mrz-vN bumpen.
- BookLedgerPro: build-frei, EU-BYOK, sw.js CACHE_VERSION bumpen.
- family-project: eigener Aufbau (native SpeechRecognition; Suche delegiert an Sages such-tool). sw.js bumpen.
- Commit-Identität: git user.email noreply@anthropic.com / user.name Claude.
- Branch: der für die Sitzung vorgegebene (claude/…). Selbst-Merge: getestet + abgegrenzt + nicht
  zweifelhaft → Draft→ready→squash. Erst mergen, dann prüft Klaus live (Pages von main). Bei bereits
  gemergter Branch-Historie: Branch von origin/main neu aufsetzen, force-with-lease.

## ABSCHLUSS-BEFEHL (Kette reißt nie ab)
Am Sitzungsende: docs/PULS.md fortschreiben, Übergabeprotokoll (docs/sessions/archiv/) anlegen,
„nächste Schritte"-Block im Chat, DIESEN Brief-Typ als Codeblock für die Folge-Sitzung ausgeben.
Pflichtlektüre oben wiederholen.
