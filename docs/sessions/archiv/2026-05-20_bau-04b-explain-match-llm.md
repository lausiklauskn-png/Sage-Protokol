# Bau-Sitzung 2026-05-20 — Bau 04.B `explainMatchLLM` in Modul 04

**Sitzungs-Rolle:** Bau-Sitzung (kein Spec — Brief 03 hat alles in
INTERFACES + Karte 04 § Stufe-B-Vertrag spezifiziert). Branch
`claude/bau-04b-explain-match-llm-j6mJF`, vom `main` `cd138c3` aus
angelegt (Stand nach Bau 07.Y PR #121). Schließt die M04-Erweiterung
aus Brief 03 (Stufe B nach Stufe A).

Brief BAU_04B_EXPLAIN_MATCH_LLM (PR #112 gemerged 2026-05-20, `main`
`a1f6939`) als Spec-Vorlage.

---

## 1. Was getan

### a) INTERFACES.md

- § 1 Modul 04 Geprüft-Zeile um „2026-05-20 (Bau 04.B
  `explainMatchLLM`)" erweitert.
- § 10 Änderungsprotokoll neue Zeile.

KEIN Vertrags-Eingriff in Bietet/Storage/Fehler/Garantien — Brief 03
hat alles spezifiziert.

### b) Karte 04

§ Bauzustand neue Zeile mit vollständiger Code-Beschreibung.
§ Manueller Test wird durch den neuen Knopf 10 ergänzt (Inhalt in
Panel 04, siehe d).

### c) `src/modules/04_match.js` Code-Eingriff (additiv)

**Zwei neue Fehler-Factories:**
- `InvalidApiKeyError(message)` — sync von `explainMatchLLM` bei
  leerem/nicht-String `apiKey`.
- `InvalidMatchResultError(message)` — sync wenn `matchResult` kein
  gültiges MatchDimensionsResult ist.

**Modul-lokale Konstanten:**
- `STUFE_B_DEFAULT_MODEL = "claude-sonnet-4"` (aus § 0).
- `STUFE_B_MAX_TOKENS = 1024` (aus § 0).
- `ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"`
  (hartcodiert, kein Aufrufer-Override).
- `ANTHROPIC_API_VERSION = "2023-06-01"` (Pflicht-Header).
- `LLM_MAX_OUTPUT_CHARS = 4096` (defensiv vor JSON-Parse).
- `ALLOWED_CANDIDATE_SCOPES = ["lokal","mailbox","netz"]`.
- `ALLOWED_OVERRIDE_RECOMMENDATIONS = ["established","established-with-bridge","rejected"]`.
- `MAX_BEGRUENDUNG_LEN = 200` + `MAX_ERKLAERUNG_LEN = 600`.

**Interne Helper:**
- `isNumberOrNull(v)` (sync) — Schema-Helper.
- `validateMatchResultShape(matchResult)` (sync) — wirft
  `InvalidMatchResultError` mit konkretem Feld-Hinweis.
- `buildLlmPrompt(matchResult)` (sync) — deutscher User-Message-String
  mit vier Schicht-Werten + Schema-Block wörtlich aus Karte 04.
- `validateLlmResponseSchema(parsedJson, matchResult)` (sync) — strikt
  gegen Karte-04-Schema; **`candidateScope:"netz"` STILL auf
  `"lokal"` korrigiert** (Anti-Missbrauch § 8, KEIN Throw, KEIN
  Logging).

**Neue Funktion `explainMatchLLM(matchResult, apiKey, options?)` async:**

1. Sync-Vor-Checks (KEIN Promise-Aufbau):
   - `apiKey` nicht String oder leer → `InvalidApiKeyError`.
   - `validateMatchResultShape(matchResult)` wirft `InvalidMatchResultError`.

2. Options-Defaults: `model` / `maxTokens` / `abortSignal`.

3. Prompt bauen via `buildLlmPrompt`.

4. `fetch` POST an `ANTHROPIC_API_URL` mit Headern + JSON-Body + signal.

5. **Fail-soft auf allen Fehlerpfaden** (KEIN Throw, alle resolved
   mit `ExplainResult{available:false, reason, fallbackScore, model,
   tokensUsed:null}`):
   - HTTP 4xx/5xx → `"API HTTP <status> (<text>)"`.
   - HTTP 429 sonder-getaggt → `"API HTTP 429 (Rate-Limit) — Aufrufer-Drossel-Pflicht"`.
   - `response.json()` wirft → `"Antwort war kein valides JSON"`.
   - Anthropic-API-Form fehlt → `"Antwort entsprach nicht der Anthropic-API-Form"`.
   - LLM-Text > LLM_MAX_OUTPUT_CHARS gekürzt vor JSON-Parse.
   - LLM-Text kein valides JSON → `"LLM-Output war kein valides JSON"`.
   - Schema-Mismatch → `"Antwort entsprach nicht dem Schema: <konkreter Hinweis>"`.
   - TypeError aus fetch → `"Netz nicht erreichbar (<message>)"`.

6. **`AbortError` aus fetch wird NICHT abgefangen** — Standard-DOM-
   Verhalten, durchgereicht. Aufrufer fängt selbst.

7. **Erfolgs-Pfad:** `ExplainResult{available:true, schichten, bruecke
   (mit candidateScope:"netz"→"lokal"-Korrektur), erklaerung,
   overrideRecommendation, fallbackScore:matchResult.overall, model,
   tokensUsed:(input+output)|null}`.

**`window.SbkimMatch`-Export** um `explainMatchLLM` +
`InvalidApiKeyError` + `InvalidMatchResultError` ergänzt.

**Selbstcheck-Zeile auf VIER Funktionen erweitert:**
```
MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold/
matchDimensions/explainMatchLLM, Schwellen: PROVIDER_MIN_MATCH=0.80,
SCHICHT_MIN_MATCH=0.60
```

**`_meta`** um `stufeBDefaultModel` / `stufeBMaxTokens` /
`anthropicApiUrl` / `anthropicApiVersion` (Read-Anker) erweitert.

Modul-Kopfkommentar um Bau-04.B-Block am Ende.

`node --check src/modules/04_match.js` grün.

### d) Panel 04 Knopf 10

Neuer Knopf 10 „explainMatchLLM (Bau 04.B Test-Brücke — Anthropic-API-
Key per window.prompt)":
- **User-Key-Eingabe via `window.prompt`** mit klarem Hinweis: Key
  wird NICHT persistiert; produktiver Identitäts-Container ist
  Vision-Anker 5.
- Bei leer/abgebrochen: Hinweis-Log „ℹ Abgebrochen.", kein Aufruf.
- Setup-matchResult via Modul 03 + Modul 04 (Käsekuchen-vs-Käsetorte-
  Vektoren, hoher Match-Score).
- Logging von `available`/`model`/`tokensUsed`/`schichten`/`bruecke`/
  `erklaerung`/`overrideRecommendation` bzw. `reason`/`fallbackScore`.
- Status-Chip „Stufe-B-Call OK" (auch bei `available:false` — Modul
  04 hat sauber resolved, nicht rot wegen API-Fehler).
- CORS-Hinweis im fallback-Log: Anthropic-API erlaubt direkte
  Browser-Aufrufe seit 2024 mit `anthropic-dangerous-direct-browser-access`-
  Header, den Modul 04 BEWUSST NICHT setzt. Workaround echtes
  PWA-Setup.

Bestehende neun Knöpfe (Setup + Tests 1-9 + Selbstcheck) unverändert.
Panel-Header um Bau-04.B-Block + CORS-Hinweis erweitert.

### e) Smoke-Test mit fetch-Stub

Neue Datei `tests/smoke_bau04b_explain_match_llm.mjs` (Node 22, KEIN
echter Netz-Aufruf — fetch wird pro Probe gestubbt). **Zehn Proben +
zwei Bonus:**

1. HTTP 200 + valides JSON nach Schema → `available:true`, alle Felder.
2. HTTP 200 + `candidateScope:"netz"` → still auf `"lokal"` korrigiert.
3. HTTP 429 → `available:false`, reason enthält „429" UND „Rate-Limit".
4. HTTP 500 → `available:false`, reason enthält „500".
5. TypeError fetch → `available:false`, reason enthält „Netz nicht erreichbar".
6. HTTP 200 + LLM-Output kein JSON → reason enthält „kein valides JSON".
7. HTTP 200 + Schema-Mismatch (begruendung fehlt) → reason enthält „Schema".
8. Leerer apiKey → `InvalidApiKeyError` SYNCHRON (Sync-Vor-Check).
9. Leeres matchResult → `InvalidMatchResultError` SYNCHRON.
10. AbortError aus fetch → durchgereicht (NICHT abgefangen).
11. Bonus: usage fehlt → `tokensUsed:null` (fail-soft).
12. Bonus: `schichten.score=1.5` außerhalb [-1,1] → Schema-Mismatch.

**Ergebnis: 30 Sub-Proben, 30 grün, 0 rot.**

Regression:
- Bau-02.Y-Smoke: 33/33 grün.
- Bau-04.A-Smoke: 19/19 grün.
- Pflege-01-Smoke: 8/8 grün.
- Bau-05.Y-Smoke: 25/25 grün.
- Bau-06.Y-Smoke: 25/25 grün.
- Bau-07.Y-Smoke: 30/30 grün.
- Bau-08.Y-Smoke: 26/26 grün.

**Summe alle Smokes: 196 Sub-Proben grün.**

### f) Übergabeprotokoll

Diese Datei: `docs/sessions/archiv/2026-05-20_bau-04b-explain-match-llm.md`.

---

## 2. Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Modul 04 Bietet-Block + Fehlerverhalten
  + Garantien aus Brief 03 UNVERÄNDERT.
- **Karte 04 § Stufe-B-Vertrag eins-zu-eins umgesetzt.**
- **Fehlertoleranz: scheitert NIE throw nach dem sync-Vor-Check.**
  Nur zwei sync Throws (InvalidApiKey + InvalidMatchResult). Alle
  anderen Fehler-Pfade resolved mit `ExplainResult{available:false,
  reason, fallbackScore}`.
- **`AbortError` ist die EINE Ausnahme** — durchgereicht.
- **Anti-Missbrauch: `candidateScope:"netz"` STILL auf `"lokal"`
  korrigiert** (defensiv, kein Throw, kein Logging).
- **User-Key-Verwaltung NICHT in Modul 04.** Opaque-String-API;
  Identitäts-Container (Vision-Anker 5) ist eigene Folge-Spec-Sitzung.
- **Anthropic-API-Endpoint hartcodiert.**
- **Rate-Limit-Awareness ist AUFRUFER-Pflicht.** Bei HTTP 429
  sonder-getaggter reason; KEINE eigene Drossel.
- **Bestehende Funktionen unangetastet.** Selbstcheck-Zeile auf VIER
  Funktionen erweitert.
- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert.

**KEINE Tafel-Spannung.**

---

## 3. Was NICHT angefasst

- Kein Identitäts-Container-Code (Vision-Anker 5).
- Kein localStorage / sessionStorage / IndexedDB-Persistenz des API-Keys.
- Kein Modul-01/02/03/05/06/07/08-Eingriff.
- Kein eigener Rate-Limit-Pfad.
- Kein `PROTOCOL_VERSION`/`DB_VERSION`/`BACKUP_FORMAT_VERSION`-Bump.
- Keine Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.
- `status.json` unverändert (Modul 04 bleibt `score:"fertig"`).
- `update_puls_pie.py` NICHT aufgerufen.

---

## 4. Bekannte Limitierung: CORS

Anthropic-API erlaubt direkte Browser-Aufrufe seit 2024 mit dem
Header `anthropic-dangerous-direct-browser-access`. Modul 04 setzt
diesen Header BEWUSST NICHT (keine Klaus-feindliche Konfig-Komplexität,
kein Klick-durch-Warnungen). Bei `localhost`-Tests könnte CORS-Policy
den Aufruf blocken.

Workaround: Test im echten PWA-Setup mit gehosteter Origin (GitHub-
Pages-Endknoten), nicht in Termux-`localhost`. Modul 04 Panel-Hinweis
ergänzt.

---

## 5. Sichttest

**ungeprüft**, weil headless gebaut. Wartet auf Klaus' Browser-Lauf:

1. Panel 04 Knopf 10 — Anthropic-API-Key via `window.prompt`.
2. Logging-Block prüfen:
   - Bei Erfolg: `available:true` + Schichten-Werte + tokensUsed.
   - Bei CORS-Fehler: `available:false` + `reason: "Netz nicht
     erreichbar (...)"`; das ist nicht „Modul 04 falsch", sondern
     bekannte Limitierung.
3. Optional: Test im echten PWA-Setup (GitHub-Pages-Endknoten).

---

## 6. Vorgeschlagene nächste Schritte

1. **Klaus' Browser-Sichttest Panel 04 Knopf 10** — Anthropic-API-
   Key bereithalten; bei CORS-Fehler im `localhost`: Test im echten
   PWA-Setup verschieben.
2. **Endknoten-Migration (Mein-Mixarium + Mein-Rezeptbuch)** — alle
   Bau-02.Y / 04.A / 04.B / 05.Y / 06.Y / 07.Y / 08.Y produktiv im
   Endknoten-Repo verfügbar machen. **Brief-99-Pipeline ist mit
   Bau 04.B + Konsumenten-Achse jetzt vollständig.** Endknoten-
   Migration ist die letzte verbleibende Phase aus der Pipeline.
3. **Vision-Anker 5 Identitäts-Container Spec-Sitzung** (optional) —
   löst die `window.prompt`-Test-Brücke aus Bau 04.B mit produktivem
   sicheren Pfad.

---

## 7. PR-Stand

- **PR #117** Bau 08.Y gemerged 2026-05-20 (`main` `54bba18`).
- **PR #118** Bau 08.Y Sichttest-Nachzug gemerged (`main` `a3b5123`).
- **PR #119** Bau 05.Y gemerged (`main` `12bebea`).
- **PR #120** Bau 06.Y gemerged (`main` `48a1abd`).
- **PR #121** Bau 07.Y gemerged (`main` `cd138c3`).
- **Diese Bau-Sitzung Bau 04.B:** Branch
  `claude/bau-04b-explain-match-llm-j6mJF`, Draft-PR
  „Bau 04.B `explainMatchLLM` in Modul 04 (Match)".
