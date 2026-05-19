# Brief — Bau-Sitzung 04.B `explainMatchLLM` + User-Key-Eingabe in Modul 04

**Bau-Sitzung** (kein Spec — Brief 03 der V1-Sammelspec-Kaskade hat
`explainMatchLLM` vollständig in INTERFACES § 1 Modul 04 + § 7 + § 8 +
Karte 04 § Stufe-B-Vertrag spezifiziert). Voraussetzung: Brief 03 (PR
#98), Brief 99 (PR #100), Bau 02.Y (PR #104), Pflege Modul 01 (PR
#107 + #108), Brief BAU_04A (PR #109), Bau 04.A (PR #110 + #111
Sichttest gemerged 2026-05-19).

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Bau 04.B Stufe B
`explainMatchLLM` + User-Key-Eingabe in Modul 04.

Branch: claude/bau-04b-explain-match-llm   (vom main aus anlegen)

Sitzungs-Rolle: Bau (kein Spec — Brief 03 hat alles in INTERFACES
+ Karte 04 § Stufe-B-Vertrag spezifiziert). Du implementierst nur
`explainMatchLLM` und die zwei sync-Fehler-Factories (InvalidApiKey,
InvalidMatchResult), plus eine Test-Brücke für User-Key-Eingabe im
Panel 04 (window.prompt — KEIN produktiver Identitäts-Container; das
ist Vision-Anker 5, eigene Folge-Spec-Sitzung).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
   - § Heilige Tafeln § Tafel-Evolutions-Klausel — die Folge-Pflege-
     Konvention. Falls du während des Baus auf eine Tafel-Spannung
     stößt: Klaus EXPLIZIT auf Anpassungs-Bedarf hinweisen.
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Bau 04.A `matchDimensions`
     sync" (live grün 2026-05-19), Kontext für Stufe-A-Resultat
   - § Vision-Anker 9 (M04-Erweiterung) § Status für Bau-Pfad
   - § Vision-Anker 5 (Identitäts-Container) — User-Key-Hintergrund;
     Bau 04.B bezieht den Key NICHT aus diesem Container (der ist
     nicht gebaut), sondern via Test-Brücke window.prompt
3. docs/INTERFACES.md
   - § 0 Globale Konstanten — STUFE_B_DEFAULT_MODEL, STUFE_B_MAX_TOKENS
   - § 1 Modul 04 (Match) — VOLLER Vertrag, insbesondere
     `explainMatchLLM`-Signatur + Fehlerverhalten-Tabelle
   - § 1 Modul 04 § Stufe-B-Vertrag (in Karte 04 detailliert)
   - § 7 LLM-Stufe-B-Ehrlichkeits-Klausel — Stufe B ist opt-in pro
     Knoten, Stufe A bleibt rückgrat-tragend; KEINE Pflicht zur
     Drittanbieter-Nutzung
   - § 8 Anti-Missbrauch-Klausel — Brücken-Vorschlag bleibt lokal;
     `candidateScope:"netz"` formal nicht aktivierbar bis Anker 10-12;
     Modul 04 korrigiert "netz" still auf "lokal"
4. docs/components/04_match.md (Karte 04) — du erweiterst § Manueller
   Test + § Bauzustand. Inhaltlich liest du § Stufe-B-Vertrag voll
   (Antwort-JSON-Schema, ExplainResult-Form, Fehlerklassen, Beispiel-
   Output mit zwei Personas)
5. src/modules/04_match.js — du erweiterst den Code

Was du NICHT liest: andere Modul-Karten (00/01/02/03/05/06/07/08/09);
Sage-Page index.html; Briefe 01-04 / 99 (Stand in INTERFACES
gespiegelt); BRIEF_BAU_04A (gemerged, historisch).

Heilige Tafeln (Bau-04B-spezifisch):

- **INTERFACES verbindlich.** Modul 04 Bietet-Block + Fehlerverhalten
  + Garantien-Block sind in INTERFACES § 1 Modul 04 BEREITS gespiegelt
  (durch Brief 03, gemerged 2026-05-19). Du ziehst NUR die Geprüft-
  Zeile um „2026-05-XX (Bau 04.B `explainMatchLLM`)" nach + § 10
  Änderungsprotokoll-Zeile. KEIN Vertrags-Eingriff in
  Bietet/Storage/Fehler/Garantien — sonst Vertrags-Drift gegen Brief
  03.

- **Karte 04 § Stufe-B-Vertrag ist verbindliche Spec.** Modell-ID
  (`STUFE_B_DEFAULT_MODEL`), max_tokens (`STUFE_B_MAX_TOKENS`),
  JSON-only-Output, strikte Schema-Validierung, ExplainResult-Form —
  alles aus § 7 / § 8 / Karte 04. Du implementierst es eins-zu-eins,
  KEIN Spec-Drift.

- **Fehlertoleranz: scheitert NIE throw nach dem sync-Vor-Check.** Nur
  zwei sync Throws: `InvalidApiKeyError` (apiKey leer/kein String) und
  `InvalidMatchResultError` (matchResult kein MatchDimensionsResult).
  Danach: alle HTTP-/Netz-/Schema-Fehler resolved mit
  `ExplainResult{available:false, reason:"<deutsch>",
  fallbackScore: matchResult.overall}`. KEIN Throw. Aufrufer fällt
  auf Stufe-A-Resultat zurück.

- **`AbortError` ist die EINE Ausnahme:** wenn `options.abortSignal`
  triggert, wird `AbortError` NICHT abgefangen — Standard-DOM-
  Verhalten, durchgereicht. Aufrufer fängt selbst.

- **Anti-Missbrauch: `candidateScope:"netz"` STILL auf `"lokal"`
  korrigieren** (Karte 04 § Brücken-Feld-Spec). KEIN Throw, KEIN
  Logging — defensiv. Diese Korrektur entfällt erst, wenn Anker
  10/11/12 (Reputation/Rate-Limit/Blocklist) implementiert sind. Bau
  04.B macht das bewusst.

- **User-Key-Verwaltung NICHT in Modul 04.** Modul 04 konsumiert den
  `apiKey` als **opaque String** vom Aufrufer (Karte 04 § Stufe-B-
  Vertrag § User-Key). Identitäts-Container für sichere Key-
  Persistenz ist Vision-Anker 5 (eigene Folge-Spec-Sitzung, NICHT in
  Bau 04.B). Bau 04.B liefert eine **Test-Brücke**: Panel-04-Knopf
  10 holt den Key per `window.prompt` (oder optional
  `localStorage.getItem("sbkim_test_anthropic_key")` als Convenience,
  mit klarem Hinweis dass das KEIN produktiver Pfad ist — siehe
  Stolperfallen).

- **Anthropic-API-Endpoint:** verbindlich `https://api.anthropic.com/v1/messages`.
  Modul 04 hartcodiert die URL, kein Aufrufer-Override (vermeidet
  Klaus-feindliche Konfig-Komplexität; ein Endpoint-Wechsel wäre
  eigene Spec-Sitzung).

- **Rate-Limit-Awareness ist AUFRUFER-Pflicht.** Modul 04 fügt KEINE
  eigene Drossel ein (Karte 04 § Stufe-B-Vertrag § Rate-Limit). Bei
  HTTP-429 resolved Modul 04 mit `ExplainResult{available:false,
  reason:"API HTTP 429 (Rate-Limit) — Aufrufer-Drossel-Pflicht"}`.

- **Bestehende Funktionen unangetastet.** `match`,
  `isAboveProviderThreshold`, `matchDimensions` (Bau 04.A) bleiben in
  ihrer bestehenden Form gültig. Selbstcheck-Zeile auf VIER Funktionen
  erweitern: `match/isAboveProviderThreshold/matchDimensions/
  explainMatchLLM`.

- **`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `4`,
  `BACKUP_FORMAT_VERSION` bleibt `2`.** Modul 04 zustandslos — kein
  Storage, kein Spore-Feld, kein DB-Eingriff. Reine Code-Erweiterung
  in `src/modules/04_match.js`.

Deine Aufgabe heute — sechs Punkte a–f:

a) **docs/INTERFACES.md** zwei kleine Nachzieh-Eingriffe (KEIN
   Vertrags-Eingriff):
   - § 1 Modul 04 Geprüft-Zeile um „2026-05-XX (Bau 04.B
     `explainMatchLLM`)" erweitert.
   - § 10 Änderungsprotokoll um eine neue Zeile „2026-05-XX · Bau-
     Sitzung 04.B `explainMatchLLM` in Modul 04" erweitert.

b) **docs/components/04_match.md (Karte 04)** zwei Sub-Sektionen:
   - § Manueller Test um Knopf 10 erweitern (siehe Punkt d).
   - § Bauzustand neue Zeile „Bau 04.B `explainMatchLLM` 2026-05-XX".

c) **src/modules/04_match.js** erweitern (additiv, kein Refactoring):

   - **Zwei neue Fehler-Factories:**
     - `InvalidApiKeyError(message)` — sync von `explainMatchLLM` bei
       leerem/nicht-String `apiKey`.
     - `InvalidMatchResultError(message)` — sync von `explainMatchLLM`
       wenn `matchResult` kein gültiges `MatchDimensionsResult` ist.
     Factory-Stil analog Modul 02 / 08 / Bau-04.A `DimensionsAllNullError`.

   - **Modul-lokale Konstanten:**
     - `STUFE_B_DEFAULT_MODEL = "claude-sonnet-4"` (modul-lokal
       gespiegelt aus § 0).
     - `STUFE_B_MAX_TOKENS = 1024` (modul-lokal gespiegelt).
     - `ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"`
       (modul-lokal, hartcodiert).
     - `ANTHROPIC_API_VERSION = "2023-06-01"` (Pflicht-Header für
       die Anthropic-API).
     - `LLM_MAX_OUTPUT_CHARS = 4096` (defensiv — wenn die API mehr
       Text schickt, wird er auf diesen Wert gekürzt, dann
       JSON-parsed; reduziert Memory-Druck bei API-Bugs).

   - **Helper `validateMatchResultShape(matchResult)`:** sync,
     intern. Prüft minimal: matchResult ist Object, hat
     `availableLanes` als Number ∈ {0,1,2}, hat die drei Schicht-
     Felder `fachlich/prozess/skalierung` als Number-or-null,
     `overall` als Number-or-null, `bruecke` als BridgeProposal-or-
     null. Wirft `InvalidMatchResultError` mit konkreten Fehler-
     Hinweis (welches Feld fehlt/falsch).

   - **Helper `buildLlmPrompt(matchResult)`:** sync, intern. Baut
     den User-Message-String für die Anthropic-API. Empfehlung:
     deutscher Prompt mit den vier Schicht-Werten + dem
     overall-Wert, plus die expliziten Anweisungen: „Antworte
     ausschließlich mit JSON nach folgendem Schema [Schema-Block].
     Kein Prosa-Text drumherum." Schema-Block aus Karte 04 §
     Stufe-B-Vertrag wörtlich übernehmen (inkl. der Längen-Limits
     für `begruendung` ≤ 200 Zeichen und `erklaerung` ≤ 600
     Zeichen).

   - **Helper `validateLlmResponseSchema(parsedJson, matchResult)`:**
     sync, intern. Prüft das LLM-Antwort-JSON strikt gegen das
     Karte-04-Schema:
     - `schichten.{fachlich,prozess,skalierung}.score` ist Number
       ∈ [-1, 1]; `.begruendung` ist String.
     - `bruecke` ist null ODER `{needed:String, lookingFor:String|null,
       candidateScope:"lokal"|"mailbox"|"netz"}`.
     - `erklaerung` ist String.
     - `overrideRecommendation` ist null ODER eine der drei
       String-Konstanten ("established", "established-with-bridge",
       "rejected").
     Bei Schema-Mismatch: returns null + Reason-String.
     Bei Erfolg: returns das normalisierte `ExplainResult` (mit
     `candidateScope:"netz"` STILL auf `"lokal"` korrigiert —
     siehe Heilige Tafel Anti-Missbrauch).

   - **Neue Funktion `explainMatchLLM(matchResult, apiKey, options)`**:
     async, Signatur exakt gemäß § 1 Modul 04.

     1. **Sync-Vor-Checks (KEIN Promise-Aufbau):**
        - `apiKey` nicht String oder leer → `InvalidApiKeyError`
          (sync throw, vor Netz-Aufruf).
        - `matchResult` nicht gültig → `validateMatchResultShape`
          wirft `InvalidMatchResultError`.

     2. **Options-Defaults:** `model = options.model ||
        STUFE_B_DEFAULT_MODEL`; `maxTokens = options.maxTokens ||
        STUFE_B_MAX_TOKENS`; `abortSignal = options.abortSignal`
        (durchgereicht).

     3. **Prompt bauen:** `var prompt = buildLlmPrompt(matchResult);`

     4. **`fetch()` an Anthropic-API:**
        ```
        POST https://api.anthropic.com/v1/messages
        Headers:
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        Body (JSON):
          { model, max_tokens, messages: [{ role:"user", content: prompt }] }
        signal: abortSignal (wenn vorhanden)
        ```

     5. **Response-Handling — alle Fehlerfälle fail-soft:**
        - `response.ok === false` (HTTP-4xx/5xx) → resolved mit
          `ExplainResult{available:false, reason:"API HTTP <status>
          (<text>)" , fallbackScore: matchResult.overall, model,
          tokensUsed:null}`. KEIN Throw.
        - `response.json()` wirft → resolved mit
          `ExplainResult{available:false, reason:"Antwort war kein
          valides JSON", ...}`.
        - Antwort-Body hat kein `content[0].text` (Anthropic-API-
          Form) → resolved mit
          `{available:false, reason:"Antwort entsprach nicht der
          Anthropic-API-Form"}`.
        - LLM-Text-Output ist kein valides JSON (parse wirft) →
          resolved mit `{available:false, reason:"LLM-Output war
          kein valides JSON"}`.
        - LLM-JSON validiert nicht gegen Schema
          (`validateLlmResponseSchema` returns null) → resolved mit
          `{available:false, reason:"Antwort entsprach nicht dem
          Schema: <konkreter Hinweis>"}`.
        - `AbortError` aus dem `fetch` → NICHT abfangen,
          durchgereicht (Standard-DOM-Verhalten).
        - Sonstiger Netz-Fehler (TypeError, etc.) → resolved mit
          `{available:false, reason:"Netz nicht erreichbar (<error.
          message>)"}`.

     6. **Erfolgs-Pfad:** resolved mit normalisiertem
        `ExplainResult{available:true, schichten, bruecke (mit
        candidateScope:"netz"→"lokal"-Korrektur), erklaerung,
        overrideRecommendation, fallbackScore: matchResult.overall,
        model, tokensUsed: response.usage.input_tokens +
        response.usage.output_tokens (fail-soft: null wenn API es
        nicht liefert)}`.

   - **`window.SbkimMatch`-Export:** `explainMatchLLM`,
     `InvalidApiKeyError`, `InvalidMatchResultError` ergänzen.

   - **Selbstcheck-Zeile auf VIER Funktionen erweitert:**
     ```
     MODUL 04 MATCH bereit, Funktionen: match/
     isAboveProviderThreshold/matchDimensions/explainMatchLLM,
     Schwellen: PROVIDER_MIN_MATCH=0.80, SCHICHT_MIN_MATCH=0.60
     ```
     Karte 04 § Selbstcheck-Zeile mitnachziehen.

   - **`_meta`** um neue Anker erweitern:
     - `stufeBDefaultModel: STUFE_B_DEFAULT_MODEL`
     - `stufeBMaxTokens: STUFE_B_MAX_TOKENS`
     - `anthropicApiUrl: ANTHROPIC_API_URL` (Read-Anker für
       Tests + Doku-Kommentar).

   - **Modul-Kopfkommentar** um Pflege-Block am Ende erweitern:
     „Bau 04.B `explainMatchLLM` (2026-05-XX): Stufe-B-LLM-Pass
     gegen Anthropic-API, JSON-only, strikte Schema-Validierung,
     fail-soft. apiKey als opaque String vom Aufrufer
     (Identitäts-Container Vision-Anker 5 ist NICHT Bestandteil
     dieser Bau-Sitzung). `candidateScope:"netz"` wird still auf
     `"lokal"` korrigiert (Anti-Missbrauch). Spec-Quelle Brief 03
     (PR #98) + Karte 04 § Stufe-B-Vertrag."

   - `node --check src/modules/04_match.js` muss grün sein.

d) **tests/manual_check.html Panel 04** um Knopf 10 erweitern:
   - **Knopf 10 „explainMatchLLM (Test-Brücke)"** —
     User-Key-Eingabe via `window.prompt("Anthropic API-Key (sk-ant-…):"
     )`. Wenn leer/abgebrochen: Hinweis-Log „ℹ Abgebrochen.", kein
     Aufruf. Sonst: Setup-matchResult via deterministischer LCG-
     Vektoren + `SbkimMatch.matchDimensions(...)`; dann
     `await SbkimMatch.explainMatchLLM(matchResult, apiKey)`. Log:
     - `available: true|false`
     - `model` (used)
     - `tokensUsed`
     - `available:true` → schichten + bruecke + erklaerung +
       overrideRecommendation
     - `available:false` → `reason` + `fallbackScore`
     Status-Chip "Stufe-B-Call OK" (auch bei `available:false` —
     Modul 04 hat sauber resolved, der Knopf ist nicht rot wegen
     API-Fehler).

     **Hinweis-Block neben dem Knopf** (in der Test-Seite oder im
     Log):
     - Key wird NICHT persistiert — keine localStorage-Nutzung
       (siehe Stolperfallen).
     - Key-Eingabe ist Test-Brücke; produktiver Identitäts-Container
       ist Vision-Anker 5.
     - Bei `localhost`-Tests könnte Anthropic-CORS-Policy stören.
       Wenn das in DeX-Chrome / Tablet-Chrome scheitert: das ist
       ein bekannter Test-Setup-Befund (Anthropic-API ist nicht für
       direkte Browser-Aufrufe gedacht). Workaround: Test im
       echten PWA-Setup mit gehosteter Origin (GitHub-Pages-
       Endknoten), nicht in `localhost`-Termux.

     Alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html`
     syntaktisch validiert (`node --check` pro extrahiertem Block).

e) **Smoke-Test mit fetch-stub** (headless, Node 22) — neue Datei
   `tests/smoke_bau04b_explain_match_llm.mjs`. **Kein echter Netz-
   Aufruf** — wir stubben `globalThis.fetch` mit synthetischen
   Antworten:

   - Probe 1: HTTP 200 + valides JSON nach Schema → `ExplainResult{
     available:true, schichten/bruecke/erklaerung gesetzt,
     fallbackScore === matchResult.overall, model, tokensUsed}`.
   - Probe 2: HTTP 200 + LLM-Output mit `candidateScope:"netz"` →
     Bruecke kommt zurück mit `candidateScope:"lokal"` (Anti-
     Missbrauch-Korrektur greift).
   - Probe 3: HTTP 429 → `{available:false, reason: enthält "429"
     UND "Rate-Limit", fallbackScore === matchResult.overall}`,
     KEIN Throw.
   - Probe 4: HTTP 500 → `{available:false, reason: enthält "500"}`,
     KEIN Throw.
   - Probe 5: Fetch wirft TypeError („Netz nicht erreichbar") →
     `{available:false, reason: enthält "Netz nicht erreichbar"}`,
     KEIN Throw.
   - Probe 6: HTTP 200 + LLM-Output kein JSON → `{available:false,
     reason: enthält "kein valides JSON"}`.
   - Probe 7: HTTP 200 + LLM-Output JSON aber Schema-Mismatch
     (z.B. `schichten.fachlich.score` fehlt) → `{available:false,
     reason: enthält "Schema"}`.
   - Probe 8: Sync-Throw — leerer apiKey → `InvalidApiKeyError`
     SYNCHRON. Smoke-Test fängt mit try/catch außerhalb `await`.
   - Probe 9: Sync-Throw — `matchResult` ist `{}` → `InvalidMatchResultError`
     SYNCHRON.
   - Probe 10: `AbortError` aus fetch → durchgereicht, NICHT
     abgefangen. Smoke-Test fängt mit try/catch um `await`.

   Regression-Smoke-Tests Bau-02.Y / Pflege-01 / Bau-04.A müssen
   weiterhin grün laufen (33+8+19 = 60).

f) **Übergabeprotokoll** in
   `docs/sessions/archiv/2026-05-XX_bau-04b-explain-match-llm.md`
   mit allen sechs Punkten a–f, Heilige-Tafeln-Eingehalten-Block,
   Was-NICHT-angefasst-Block, Sichttest-Vermerk, Nächster-sinnvoller-
   Schritt-Block.

Was du NICHT tust:

- **Kein Identitäts-Container-Code** (Vision-Anker 5 — eigene Spec-
  Sitzung). Test-Brücke via window.prompt ist die heutige Lösung.
- **Kein localStorage / sessionStorage / IndexedDB-Persistenz** des
  API-Keys. Aus Sicherheitsgründen NICHT speichern (siehe
  Stolperfallen).
- **Kein Modul-01/02/03/05/06/07/08-Eingriff.**
- **Kein eigener Rate-Limit-Pfad** (Aufrufer-Pflicht).
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **Keine Sage-Page-Änderung.**
- **Keine CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 04 ist bereits
  `score:"fertig"`; additive Erweiterung, kein Score-Wechsel.

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am Sitzungsende.
   - INTERFACES + Karte 04 + Modul-04-Code + Panel-04-Knopf 10 +
     Smoke-Test + Übergabeprotokoll.
   - PULS § Sitzungs-Einträge neuer Top-Eintrag; vorletzten ins
     Archiv-Index auslagern (Konvention).
   - PULS § Vision-Anker 9 § Status um „Bau 04.B `explainMatchLLM`
     2026-05-XX abgeschlossen" erweitern.
   - Sichttest erwartet — Knopf 10 mit window.prompt-Key. Headless-
     Bau ist OK, Sichttest-Vermerk „ungeprüft, weil headless".

2. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort. Zwei
   bis drei priorisierte Folge-Trigger:
   - Klaus' Browser-Sichttest des Panel-04-Knopfes 10 (braucht
     Anthropic-API-Key; bei CORS-Befund: Test im echten PWA-Setup).
   - Brief BAU_05Y schreiben (transparenter Slot-Pfad in Modul 05;
     unabhängig von 04.A/B; nutzt Bau 02.Y).
   - Optional: Spec-Sitzung Vision-Anker 5 Identitäts-Container
     (sichere User-Key-Persistenz, würde die Test-Brücke durch
     produktiven Pfad ersetzen).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Sitzungs-Eintrag
  „Bau 04.B abgebrochen" ans Ende. Klaus klärt in der nächsten
  Sitzung.
- Wahrscheinliche Stolperfallen:
  - **`localStorage`-Versuchung:** der einfache Weg wäre, den Key
    in `localStorage` zu speichern für Convenience („Klaus muss nicht
    bei jedem Klick neu tippen"). NICHT machen — `localStorage` ist
    unverschlüsselt + zugänglich für jedes Browser-Skript der Origin.
    Anthropic-Keys haben Quota-Wert + können missbraucht werden.
    Test-Brücke via `window.prompt` ist die Pflicht-Form; sicherer
    User-Key-Pfad ist Vision-Anker 5.
  - **CORS:** Anthropic-API erlaubt direkte Browser-Aufrufe seit
    2024 (mit `anthropic-dangerous-direct-browser-access`-Header)
    — Modul 04 setzt diesen Header NICHT (keine Klaus-feindliche
    Konfig-Komplexität, kein Klick-durch-Warnungen). Wenn der Test
    in `localhost` mit CORS-Fehler scheitert: Workaround echtes
    PWA-Setup. Als bekannte Limitierung in Karte 04 § Risiken
    notieren.
  - **Tafel-Spannung Token-Counting:** Karte 04 § Stufe-B-Vertrag §
    Tabelle „tokensUsed: 421 | null". Die Anthropic-API liefert das
    in `response.usage.input_tokens` + `output_tokens`. Wenn die API
    das Format zwischen Versionen ändert: fail-soft `null` setzen,
    nicht throw. KEINE Tafel-Spannung — Karte erlaubt explizit das
    null-fallback.
  - **`schichten.score` ∈ [-1, 1]-Validierung:** die LLM könnte
    Werte > 1 oder < -1 liefern. Sauberer Pfad: Schema-Validierung
    schlägt → `{available:false, reason:"Schicht-Score außerhalb
    [-1, 1]"}`. KEIN Clamping.

Zeitschätzung: 4-6 Stunden für Bau + Karten-Nachzug + Test-Knopf +
Übergabeprotokoll + Smoke-Test mit fetch-Stub. Bei größeren
Tafel-Spannungen oder API-Form-Befunden 6-8 h.
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Auslöser dieser Bau-Sitzung:** Brief 99-Pipeline. Nach Bau 04.A
  (PR #110 + #111 Sichttest gemerged 2026-05-19) ist `explainMatchLLM`
  die direkte logische Folge (Stufe B nach Stufe A).

- **Spec-Quelle Brief 03 (PR #98):** `explainMatchLLM` ist vollständig
  in INTERFACES + Karte 04 § Stufe-B-Vertrag spezifiziert. Bau 04.B
  muss nur den Code für `explainMatchLLM` + zwei sync Fehler-Factories
  + Test-Brücke liefern.

- **PR-Pipeline-Stand:** Brief 99 → Bau 01.Y ✓ → Bau 02.Y ✓ → Pflege
  Tafel-Evolution ✓ → Brief Pflege 01-init ✓ → Pflege Modul 01 ✓ +
  Sichttest ✓ → Brief BAU_04A ✓ → Bau 04.A ✓ + Sichttest ✓ → **Brief
  BAU_04B (dieser PR)** → eigene Bau-Sitzung → Bau 05.Y / 06.Y / 07.Y
  → Endknoten-Migration.

- **`PROTOCOL_VERSION` bleibt `"0.1"`**, **`DB_VERSION` bleibt `4`**,
  **`BACKUP_FORMAT_VERSION` bleibt `2`**. Reine zustandslose Code-
  Erweiterung in Modul 04.

- **Manueller Sichttest:** ein Panel-04-Knopf 10 mit window.prompt-
  Key-Eingabe. Klaus braucht einen Anthropic-API-Key. CORS-Befund bei
  `localhost`-Test ist möglich — Workaround im echten PWA-Setup.

- **Identitäts-Container (Vision-Anker 5)** wird in Bau 04.B NICHT
  gebaut. Test-Brücke via window.prompt; produktiver sicherer Key-
  Pfad ist eigene Folge-Spec-Sitzung.

- **Auslöser-Befehl im Chat (Kaskaden-Konvention 6):** der Volltext
  des Briefes oben ist im Repo (diese Datei). Klaus tippt am
  Sitzungs-Start nur den kurzen Auslöser-Befehl mit Verweis auf die
  Brief-Datei.
