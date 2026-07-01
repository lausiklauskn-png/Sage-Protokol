# BRIEF — Semantische Matching-Qualität (Strang A): A3 messen → A4, plus offene Fäden
Absender: Vorgänger-Sitzung (2026-07-01) · Typ: BAU-Vorbereitung
Freibrief gilt (Sage CLAUDE.md § Freibrief) — inkl. netzweitem Selbst-Merge-Freibrief.

## STAND — was erledigt & GEMERGT ist (nicht neu bauen)
Strang A:
- A1 Hybrid BM25+Vektor (Modul 04 queryLocal) — gebaut, Klaus-Browser "Hybrid OK".
- A2 KI-Richter (hybridMatch) fest im Cross-Knoten-Antwort-Pfad + Modul-15 — gebaut.
- A3 Contextual Chunking (Modul 03 embedContentVector) — GEBAUT + GEMERGT (Sage PR #517/#518).
    opts.context global + pro-Schnipsel {context}; contextUsed-Feld; _assembleContentTexts.
    ADDITIV: ohne Kontext byte-gleich, gatet nichts, 0.80-Riegel/PROTOCOL_VERSION unberührt.
    Panel-04 "A3-NACHMESSUNG"-Knopf, Cache-Bust ?v=a3-20260701. Byte-1:1 such-tool/sbkim-bundle/pinnwand.
    Smoke smoke_a3_contextual_chunking.mjs 20/20 + Rückwärts-Kompat 25/25 + Drift-Guards grün.
- Panel-Fokus-Filter (Sage PR #519): tests/manual_check.html?only=04_match zeigt NUR Panel 04.
Strang B (OCR):
- family-project OCR (Strang B2) — GEBAUT + GEMERGT (family PR #21). 📷 Foto→Text neben jedem 🎤
    (Modul 24 SbkimOcr, Mistral EU BYOK, 1·2·3-Schlüssel-Fläche, localStorage fp_ocr_key, fail-soft).
    Smoke 79/80 (die 1 rote Probe "footer Bauleiste" ist VORBESTEHEND, unabhängig von OCR).
  ⇒ Strang B2 damit über ALLE Apps abgeschlossen (Sage such-tool/Pinnwand, MR, MM, BLP, Muttis, family).

## OFFENE TESTS (Klaus, Browser — nach Merge live, Pages deployt von main)
1. A3-MESSUNG (Sage): tests/manual_check.html Panel 04 — zuerst KALIBRIER-BODEN + SCHWELLEN-ANALYSE
   (Baseline), dann A3-NACHMESSUNG → Lücken-Delta ablesen. Termux-Direkt-Link mit ?only=04_match.
   → POSITIV: A3 lohnt netzweit (nächster Schritt unten). NULL/NEGATIV: ehrlicher Negativ-Befund
     dokumentieren (wie v2-Center), A3 bleibt opt-in-Werkzeug ohne netzweite Verdrahtung.
2. family-project OCR-Sichttest: index.html/markt.html — 📷 neben 🎤; erster Klick → 1·2·3-Mistral-
   Schlüssel-Fläche → Foto/Screenshot → Text landet im Feld. Hard-Reload nach Pull.

## PFLICHTLEKTÜRE VOR BAU (Sage-Protokol, in dieser Reihenfolge)
1. CLAUDE.md (§ Freibrief, § Pipeline-Reihenfolge, § Tafel-Evolutions-Klausel)
2. docs/PULS.md (oberster Eintrag 2026-07-01 · A3)
3. docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md (§ Stand 2026-07-01 — A3; Kern: warum Cosinus allein nicht reicht)
4. docs/components/03_embedding.md, 04_match.md
5. src/modules/03_embedding.js (embedContentVector + _assembleContentTexts), 04_match.js

## NÄCHSTER SCHRITT (nach Klaus' A3-Messung)
- A3-Delta POSITIV: embedContentVector-Aufrufer (Modul 02 regenerateOwnSpore / Andock) optional mit
  Knoten-Titel als Kontext verdrahten — netz-koordiniert, Re-Sign, EIGENER Brief.
- Dann A4 — Query-Expansion / Multi-Query im Suchfeld (Modul 22), additiv, testbar:
  aus EINER Nutzer-Frage mehrere Such-Varianten (Synonyme/Umformulierungen) bilden, alle einbetten,
  Treffer zusammenführen (Reciprocal Rank Fusion). Gatet nichts, 0.80-Riegel unberührt, fail-soft.

## OFFENE FÄDEN (nicht vergessen)
- Pre-existing Bug family-project: Smoke-Probe "footer: Bauleiste öffentlich verborgen (kein ?dev)"
  ist rot (tests/smoke_all.mjs Z. ~121) — NICHT von OCR verursacht, eigener Mini-Fix (dev-Footer
  ist ohne ?dev sichtbar, sollte verborgen sein). Klaus fragen, ob gewünscht.
- A5 Embedding-Modellwechsel (e5-base / BGE-M3 / Jina): NUR NACH MESSUNG, netzweit schwer umkehrbar
  (alle Knoten neu einbetten + Spore neu signieren, koordiniert wie Schwellen-Bump) — EIGENER Brief,
  Entscheidung Klaus. Aktuell: multilingual-e5-small (384D).
- A6 GraphRAG / Self-Reflective RAG (später, groß).
- App-UX (Rezept-Apps, Klaus-Wünsche offen): (1) eigene Kategorie DIREKT beim Rezept/Scan anlegen
  (Klaus-Frage 1/2/3: 1=nur Formular, 2=auch beim KI-Scan, 3=beides — noch offen); (2) schlanke
  Schlüssel-Erklärung im KI-Scan (Schritte 1·2·3 wie in den Einstellungen, alle 3 Apps); (3) Import-
  Ordner-Option (unbekannte Kategorie → Ordner) auch in Mixarium/Muttis (haben _showCatMapDialog NICHT).

## DATENVERTRÄGE / LEITPLANKEN (nicht brechen)
- Additiv: PROTOCOL_VERSION unberührt (außer A5 = bewusster netzweiter Bump, eigener Brief).
- 0.80-Andock-Riegel (Modul 05) nie durch A1–A4 verändern; reine Anzeige bleibt reine Anzeige.
- Kein PII, kein Schlüssel im Code, alles BYOK + fail-soft.
- Ehrlichkeit: "erst messen, dann behaupten". Browser-Sichttest wartet auf Klaus (nach Merge live).

## PER-REPO-DISZIPLIN
- Sage: Modul-Änderung in src/modules/* → byte-Kopie such-tool/ + sbkim-bundle/ + pinnwand/
  (Drift-Guards: smoke_standalone_such_tool.mjs / smoke_bundle_connect.mjs / pinnwand/_smoke.mjs),
  Cache-Bust an manual_check.html-Script-Tags bumpen.
- Mein-Mixarium: index.html == QC byte-identisch (md5sum!), app-sw SW_VERSION bumpen.
- Mein-/Muttis-Rezeptbuch: Änderung in QC → python3 build.py, app-sw CACHE mrz-vN bumpen.
- BookLedgerPro: build-frei (native ES-Module, keine CDNs), EU-BYOK, sw.js CACHE_VERSION bumpen.
- family-project: eigener Aufbau (native SpeechRecognition, kein sbkim-Such-Widget; Suche delegiert
  an Sages such-tool). Modul 24 liegt jetzt in sbkim/, app.js rüstet 📷 nach. sw.js CACHE_VERSION bumpen.
- Commit-Identität: git user.email noreply@anthropic.com / user.name Claude.
- Branch: der für die Sitzung vorgegebene (claude/…). Selbst-Merge: getestet + abgegrenzt + nicht
  zweifelhaft → Draft→ready→squash. Erst mergen, dann prüft Klaus live (Pages von main).

## ABSCHLUSS-BEFEHL (Kette reißt nie ab)
Am Sitzungsende: docs/PULS.md fortschreiben, Übergabeprotokoll (docs/sessions/archiv/) anlegen,
"nächste Schritte"-Block im Chat, diesen Brief-Typ als Codeblock für die Folge-Sitzung ausgeben.
Pflichtlektüre oben wiederholen.
