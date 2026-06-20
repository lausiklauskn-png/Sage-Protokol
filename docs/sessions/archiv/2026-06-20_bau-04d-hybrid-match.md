# Übergabeprotokoll — Bau 04.D Hybrid-Match (Match-Zeit-LLM-Richter)

**Datum:** 2026-06-20
**Rolle:** Bau-Sitzung Modul 04 (additiv, fail-soft)
**Branch:** `claude/bau-04d-hybrid-match`
**Konzept-Quelle:** `docs/HYBRID-MATCH-KONZEPT.md` (Brainstorming Klaus + Sage,
2026-06-20), Anisotropie-Befund `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`.

---

## Was getan wurde

Eine **Hybrid-Match-Schicht** auf Basis des vorhandenen Stufe-B-Keims
`explainMatchLLM` — additiv, nichts Bestehendes gebrochen. Der Cosinus-
Vorfilter (Modul 04) liefert weiter die Kandidaten; ein **opt-in LLM-Richter**
fällt das echte Bedeutungs-Urteil über sie.

### Code (`src/modules/04_match.js`, additiv)

- **`hybridMatch(query, candidates, options?) → Promise<HybridJudgment>`** —
  der Match-Zeit-Richter. Urteilt pro Kandidat (passt/passt-nicht + Begründung
  + Score `[0,1]`).
- **Provider-Abstraktion `HYBRID_PROVIDERS`** — `claude` (Anthropic
  `/v1/messages`, `x-api-key`), `mistral`/`openai`/`local` (OpenAI-kompatibel
  `/chat/completions`, `Authorization: Bearer`). Kein Schlüssel im Code (BYOK).
  EU-Default `"mistral"` für DSGVO-Knoten via `options.euOnly`.
  `provider:"local"` braucht `options.endpoint`.
- **`pickJudgeProvider(options?) → providerId`** — EU-Default-Logik.
- **`bidirectionalVerdict(passtA, passtB, rule?) → boolean`** — kombiniert die
  zwei Seiten-Urteile. **Default `"both"` (streng — Klaus-Festlegung
  2026-06-20)**, `"one"` = großzügig.
- **Fail-soft:** leerer apiKey (kein opt-in) ODER LLM-/Netz-/HTTP-(429
  sondergetaggt)/Schema-Fehler → `available:false` + `fallbackCandidates`
  **ohne Throw**. Nur zwei sync Throws (Aufrufer-Konfig):
  `InvalidCandidatesError` + `InvalidProviderError`; plus reuse
  `EmptyQueryError`/`QueryTooLongError` für `query.text`. AbortError
  durchgereicht.
- **Bezeugung:** Erfolg liefert ein signierbares `attestation`-Objekt
  (`kind:"sbkim-hybrid-match-judgment"`, version 1, judgedAt YYYY-MM-DD,
  provider/region/model, verdicts). **Modul 04 signiert NICHT selbst** (kein
  Identitäts-Zugriff) — Aufrufer signiert via Modul 02 + legt es in die Inbox.
- Selbstcheck-Zeile auf **sechs** Funktionen erweitert
  (`…/queryLocal/hybridMatch`). `_meta` um `hybridProviders` (4) +
  `hybridEuDefaultProvider` + `hybridUsDefaultProvider` + `hybridMaxCandidates`
  (20) + `hybridBidirectionalDefault` ("both").

### Tests

- **Headless-Smoke** `tests/smoke_bau04d_hybrid_match.mjs` — **62/62 grün**
  (Mock-LLM via fetch-Stub, Anthropic- + OpenAI-Form). Deckt ab: Richter-
  Happy-Path + Bezeugung, Fail-soft auf lokal (Netz-Fehler/HTTP/Schema/kaputtes
  JSON), Opt-in-aus, Anbieter-Abstraktion (Claude/Mistral/lokal), EU-Default,
  Bidir-Kombinator, alle Sync-Throws, AbortError durchgereicht.
- **Panel 04** in `tests/manual_check.html` — vier neue Knöpfe (16 Richter
  Happy-Path / 17 Fail-soft / 18 Opt-in-aus / 19 Bidir-Regel + Anbieter-Liste).
  Mock-LLM via temporärem `window.fetch`-Override (kein echter Netz-Aufruf,
  kein API-Key nötig).
- Regression: 04.A 19/19 + 04.B 30/30 + 04.C 43/43 + 15.B 31/31 + 17 36/36
  grün. `node --check` grün. 16 Inline-Script-Blöcke validiert.

### Doku

- `docs/INTERFACES.md` § 1 Modul 04 (Bietet/Fehlerverhalten/Garantien/
  Selbstcheck/Geprüft) + neue **§ 7.1 Hybrid-Match-Richter-Ergänzung**.
- `docs/components/04_match.md` § **Hybrid-Match-Schicht** + Manueller Test
  16–19 + Selbstcheck-Format + Bauzustand-Zeilen + Querverweise.
- `docs/HYBRID-MATCH-KONZEPT.md` Status (Richter gebaut) + Bau-Parameter-
  Entscheidungen (1 opt-in / 2 Anbieter-Abstraktion / 3 streng / 4 Vorfilter
  unverändert / 5 Bezeugung — alle gebaut; 6 Bau-Zeit-Workflow offen).
- `docs/PULS.md` Sitzungs-Eintrag + Modul-04-Schnellüberblick-Zeile.

---

## Klaus-Entscheidungen (Bau-Parameter)

| # | Frage | Entscheidung |
|---|---|---|
| 1 | Richter Pflicht oder opt-in | **opt-in/BYOK** (Konzept-Empfehlung) |
| 2 | Bidirektional-Regel | **streng „both" (beide nötig)** — per `AskUserQuestion` bestätigt |
| 3 | Vorfilter roh vs. gewhitened | **unverändert** (Tabu — separater Anisotropie-Hebel) |

---

## Tabus eingehalten

- **KEINE** netzweite Schwellen-Änderung, **KEIN** Whitening-Flip von
  `matchDimensions`/`queryLocal` — das bleibt der separate Anisotropie-Hebel
  (eigene koordinierte Klaus-Entscheidung). Hybrid baut **neben** den
  bestehenden Pfaden, ändert deren Default nicht.
- **KEIN** PROTOCOL_VERSION-/DB_VERSION-Bump.
- BYOK, opt-in, kein Schlüssel im Code, kein PII, Empfangsmodus (kein
  Default-Aufruf ins offene Netz — nur der bewusst konfigurierte Richter-Call).
- Vorfilter bleibt offline/server-los lauffähig (lokales Embedding).
- `status.json` unverändert — Modul 04 war + bleibt `fertig` (rein additiv).

---

## Nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest Panel 04 Knöpfe 16–19** (Headless 62/62 ersetzt
   ihn nicht). Mock-LLM, kein API-Key nötig — funktioniert offline.
2. **Anisotropie-Hebel** (Whitening + netzweite Schwellen-Neukalibrierung von
   Modul 04) — eigene koordinierte Entscheidung, netzweit (Lehre
   `LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` § Fix-Konzept). Blockiert nicht.
3. **Bau-Zeit-Authoring-Helfer** (Konzept § Bau-Parameter 6) — Doku/Helfer,
   wie ein Entwickler die `domainDescription` mit seiner KI optimiert, bevor
   das geteilte Modell einbettet. Eigene Folge-Sitzung.
4. **Integration des Richters in einen Aufrufer** (Modul 05/06/08 oder ein
   Endknoten-Such-Feld) inkl. Signatur des `attestation`-Objekts via Modul 02
   in die Inbox — eigene Folge-Sitzung (Empfangsmodus + Identitäts-Container).
