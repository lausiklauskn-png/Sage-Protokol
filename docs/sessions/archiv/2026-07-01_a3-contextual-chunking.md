# Übergabeprotokoll — 2026-07-01 · A3 Contextual Chunking (Strang A)

**Rolle:** Bau-Sitzung. Branch `claude/semantic-matching-quality-a3-jb0aut`.
**Freibrief:** Klaus für die Sitzungs-Entscheidung („entscheide selber, solange
sinnvoll und logisch") + netzweiter Selbst-Merge-Freibrief.

## Was getan

**A3 — Contextual Chunking in Modul 03 `embedContentVector` (additiv, PR #517, gemergt).**
- `opts.context` (global) + pro-Schnipsel `{ …, context }` stellt jedem Inhalts-
  Schnipsel VOR dem Einbetten einen kurzen Domänen-/Dokument-Kontext voran
  (Anthropic „Contextual Retrieval", deterministisch/offline/gratis), dann wie
  bisher mitteln. Ohne Kontext **byte-gleiches** Verhalten.
- Rückgabe-Feld `contextUsed`; Test-Brücke `_assembleContentTexts` (reine,
  deterministische Text-Assemblierung → headless prüfbar).
- **Leitplanken gewahrt:** gatet nichts, `PROVIDER_MIN_MATCH = 0.80`/Andock-Riegel
  (Modul 05) unberührt, kein PROTOCOL_VERSION-/DB_VERSION-Bump, kein Spore-Feld.
- **Panel 04 „A3-NACHMESSUNG"** (neuer Knopf): Baseline (ohne Kontext) vs. A3
  (mit Domänen-Vorspann) über zentrierten Cosinus (`relatedness`, v1), zeigt
  Lücken-Delta. Reine Messung. Cache-Bust `?v=a3-20260701`.
- **Tests:** `smoke_a3_contextual_chunking.mjs` 20/20; Rückwärts-Kompat
  `smoke_inhaltstreuer_domainvektor.mjs` 25/25; Drift-Guards such-tool/
  sbkim-bundle/pinnwand byte-1:1 grün. Modul 03 byte-kopiert in alle drei.
- Doku: `03_embedding.md`, `INTERFACES.md` §1 Modul 03, LEHRE § „Stand
  2026-07-01 — A3", PULS.

## Ehrlich offen / nicht behauptet

OB der Vorspann die Domänen-Trennung real verbessert, ist **headless nicht
messbar** (transformers.js nur im Browser; Fake-Modell beweist nur die Mechanik).
**Kein %-Gewinn behauptet.** Klaus misst den Delta mit Panel-04-„A3-NACHMESSUNG"
(nach Schritt-0-Baseline KALIBRIER-BODEN/SCHWELLEN-ANALYSE). Negativer Delta =
ehrlicher Negativ-Befund → Vorspann bleibt opt-in-Werkzeug ohne netzweite
Verdrahtung.

## Befund: family-project OCR (Strang B2, offener Faden) — KEIN mechanischer Rollout

family-project ist architektonisch anders als die anderen Apps:
- Sein „🔍 Such-Werkzeug" verlinkt **hinaus** auf Sages such-tool
  (`.../Sage-Protokol/such-tool/`) — das **hat OCR bereits**. Family hostet keine
  eigene Suche.
- Family enhanced seine Text-Felder nur mit einem **nativen 🎤-Sprach-Knopf**
  (`assets/app.js` `wireMic`/`enhanceBareInputs`, Browser-`SpeechRecognition`,
  NICHT Modul 21).
- **Kein KI-Scan, kein BYOK-Schlüssel-Surface** — der OCR-Host der anderen Apps
  (Rezept-Scan / Such-Widget) existiert hier nicht.

⇒ Die faithful-Parität wäre ein **📷 Foto→Text-Knopf neben jedem 🎤** (Modul 24
`SbkimOcr`), was aber eine **neue UX + ein Mistral-Schlüssel-Surface** braucht,
das family nicht hat. Das ist eine **Produkt-Entscheidung für Klaus**, kein
byte-Copy. Nicht blind gebaut (Freibrief-Grenze: neue Fläche/echtes Zweifeln →
erst fragen).

## Nächster sinnvoller Schritt

1. **Klaus, Browser:** Panel 04 `KALIBRIER-BODEN` + `SCHWELLEN-ANALYSE` (Baseline)
   dann `A3-NACHMESSUNG` laufen → Delta ablesen. Positiv → A3 lohnt netzweit.
2. **Bei positivem Delta:** `embedContentVector`-Aufrufer (Modul 02
   `regenerateOwnSpore` / Andock) optional mit Knoten-Titel als Kontext
   verdrahten (eigene Folge-Sitzung, netz-koordiniert, Re-Sign).
3. **family-project OCR:** Klaus entscheidet, ob family einen 📷-Knopf (Modul 24)
   parallel zum 🎤 bekommt (inkl. kleinem Mistral-Key-Surface) — sonst bleibt es
   bei der Delegation an Sages such-tool (das OCR schon trägt).
4. **A4** Query-Expansion / Multi-Query im Suchfeld (Modul 22, additiv).
