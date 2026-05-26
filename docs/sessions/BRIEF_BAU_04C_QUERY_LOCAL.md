# Brief — Bau-Sitzung 04.C `queryLocal` (lokales Such-Feld-Backend)

**Anlass:** Tafel-Spec-Pflege Mycel-Vision 2026-05-26 (PR
`claude/tafel-spec-mycel-vision`) hat Karte 04 § Sub (c) `queryLocal`
voll spec'd. Modul 04.C ist der kritische Blocker für Klaus'
Such-Feld-Vision (bidirektionales Cross-Knoten-Matching) — Modul 15
Sub (b) `op:"query"` postMessage-Bridge antwortet seit Bau 15.B
2026-05-25 mit `error:"module-04c-not-available"`, weil 04.C fehlt.
Diese Bau-Sitzung schließt die Lücke.

**Pipeline-Stellung:** **Phase A (vor App-Freigabe)** — Pipeline-
Schritt 5f (siehe CLAUDE.md § Pipeline-Reihenfolge nach Tafel-
Erweiterung 2026-05-26).

**Branch-Vorschlag:** `claude/bau-04c-query-local`

**Voraussetzungen:**

- Tafel-Spec-Pflege Mycel-Vision (PR `claude/tafel-spec-mycel-vision`)
  ist gemerged → Karte 04 § Sub (c) liegt auf `main`.
- Modul 03 (Embedding) `embedQuery` voll funktional (ist seit
  2026-05-16 live, kein Block).
- Modul 04 bestehende API (`match` / `isAboveProviderThreshold` /
  `matchDimensions` / `explainMatchLLM`) unverändert.
- Klaus hat Bronze/Gold-SIEGEL-Stufe (Modul 16 Sub e) noch nicht
  gebaut — aber Bau 04.C ist davon unabhängig.

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung 04.C)

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Bau-Sitzung 04.C `queryLocal` — lokales Such-Feld-
Backend in Modul 04. Klaus' Vision-Anker (Such-Feld als bidirektionales
Cross-Knoten-Matching-Anker).

Branch: claude/bau-04c-query-local (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md § Heilige Tafeln + § Pipeline-Reihenfolge + § Modul-Tabelle.
2. docs/PULS.md jüngsten Sitzungs-Eintrag „Tafel-Spec-Pflege Mycel-Vision".
3. docs/components/04_match.md KOMPLETT (Sub (c) `queryLocal` voll
   spec'd in Tafel-Spec-Pflege 2026-05-26, alle anderen Sub-Bereiche
   liefern Kontext).
4. docs/components/03_embedding.md § embedQuery + § Lazy-Init (Pattern
   für Modul-03-Aufruf).
5. docs/components/15_membran.md § Sub (b) postMessage-Bridge
   `op:"query"` / `op:"queryResult"` (Empfänger-Pfad → ruft `queryLocal`).
6. src/modules/04_match.js KOMPLETT (additive Erweiterung um `queryLocal`).
7. src/modules/15_membran.js § Sub (b) Empfänger-Kette (KEIN Code-Update
   in Modul 15 — die `typeof window.SbkimMatch.queryLocal === "function"`-
   Prüfung ist fail-soft, sie greift automatisch sobald Modul 04.C da
   ist).
8. tests/manual_check.html Panel 04 (Knöpfe 1–10 bestehend, neue
   Knöpfe 11–13 für 04.C).
9. tests/smoke_bau15b_membran.mjs (Smoke-Test für Modul 15 Sub b —
   nach Bau 04.C laufen alle Proben weiterhin grün, plus Bau-04.C-
   Smoke neu).

Deine Aufgabe:

A. **`src/modules/04_match.js` additiv erweitern.** Neue Funktion
   `queryLocal(text, k, options?)` async gemäß Karte 04 § Sub (c):
   - Sync-Vor-Checks: `EmptyQueryError`, `QueryTooLongError`
     (≥ LLM_MAX_OUTPUT_CHARS=4096), `InvalidKError` (k < 1),
     `InvalidCorpusError` (corpus nicht Array oder passageVec falsche
     Form).
   - `EmbeddingNotAvailableError` wenn `window.SbkimEmbedding` /
     `embedQuery` fehlt.
   - Embedding via `await SbkimEmbedding.embedQuery(text)` (NICHT
     embedPassage — Such-Texte sind Anfragen).
   - Korpus zwei Pfade: `options.corpus` (Vorrang, für Test-Brücken)
     ODER registrierter `_corpusProvider`-Callback aus
     `SbkimMatch.setLocalCorpus(corpus)` (neue Public-Funktion).
   - Top-k-Cut: `.filter(r => r.score >= PROVIDER_MIN_MATCH).sort(...)
     .slice(0, k)`.
   - Default `k = 5`.
   - Selbstcheck-Zeile auf fünf Funktionen erweitern:
     `MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold
     /matchDimensions/explainMatchLLM/queryLocal, Schwellen: ...`
   - `_meta` um `localCorpusLength` / `queryLocalK` Read-Anker erweitern.

B. **Drei neue Fehler-Factories** (Closure, Factory-Stil analog
   `DimensionsAllNullError`):
   - `EmptyQueryError(text)`
   - `QueryTooLongError(textLength, max)`
   - `InvalidKError(value)`
   - `EmbeddingNotAvailableError()`
   - `InvalidCorpusError(reason)`
   (`EmbeddingFailedError` ist async — wird mit `cause` rethrown.)

C. **`SbkimMatch.setLocalCorpus(corpus)`** als Public-Funktion (idempotent,
   defensive Kopie via Array.from).

D. **Modul 15 Sub (b) unverändert.** Die `typeof window.SbkimMatch.queryLocal
   === "function"`-Prüfung im `op:"query"`-Handler greift automatisch.
   KEIN Eingriff in src/modules/15_membran.js (TABU).

E. **Panel 04 in `tests/manual_check.html` um drei Knöpfe erweitern:**
   - Knopf 11: Mini-Korpus (3–5 Test-Items mit deterministischen
     Vektoren) → queryLocal mit Top-3 → erwartete Reihenfolge.
   - Knopf 12: Leerer Korpus → leere Liste, KEIN Throw.
   - Knopf 13: Cross-Knoten-Stub via Modul 15 Sub b BroadcastChannel
     `op:"query"` → erwartete `op:"queryResult"` mit Treffer-Liste
     (Setup: BroadcastChannel an gleiche Origin, beide Knoten
     registrieren Listener).
   - Selbstcheck-Hinweis-Knopf-Text aktualisieren auf fünf Funktionen.

F. **Headless-Smoke-Test** `tests/smoke_bau04c_query_local.mjs`:
   - Setup: deterministische LCG-Vektoren (Embedding mock).
   - 10–15 Proben (Sync-Throws, Embedding-Fail, leerer Korpus, Top-k-
     Cut, Schwellen-Filter, Idempotenz von setLocalCorpus, etc.).
   - Regression: alle anderen Smokes (04.A 19/19, 04.B 30/30,
     15.B 31/31, 15.SW 21/21, 17 19/19) bleiben grün.
   - `node --check src/modules/04_match.js` grün.
   - `node --check tests/manual_check.html` Inline-`<script>`-Blöcke
     syntaktisch validiert.

G. **`status.json` Modul 04** bleibt `score:"stub"` ODER wechselt zu
   `score:"fertig"` nach Bau? — Diese Bau-Sitzung entscheidet. Vorschlag:
   bleibt `"stub"` bis Klaus' Sichttest grün ist (analog Bau 04.B).
   `python3 scripts/update_puls_pie.py` (auch wenn keine Score-
   Änderung — sicher ist sicher).

H. **Karte 04 § Bauzustand** neue Zeile „Bau Sub (c) `queryLocal`"
   mit Code-Details + Smoke-Bilanz + Sichttest-Status. INTERFACES.md
   § 1 Modul 04 voll gespiegelt (queryLocal-Signatur + Fehler-Tabelle
   + Selbstcheck-Zeile) + § 10 Änderungsprotokoll-Eintrag.

Was du nicht tust:

- KEIN Modul-15-Eingriff (Sub b ist gebaut, fail-soft-Pattern greift).
- KEIN Modul-03-Eingriff (nur consumer-Aufruf).
- KEINE Korpus-Persistierung in Modul 04 (Endknoten-Pflicht).
- KEINE eigene Embedding-Variante.
- KEINE Sage-Page-/Endknoten-Sitzung in dieser PR.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.

Pflicht am Ende:

- src/modules/04_match.js erweitert + Smoke grün.
- Karte 04 § Bauzustand + INTERFACES.md gespiegelt.
- status.json + Pie regeneriert.
- Panel 04 Knöpfe 11–13 + Selbstcheck-Hinweis aktualisiert.
- PULS.md Sitzungs-Eintrag oben.
- Übergabeprotokoll docs/sessions/archiv/YYYY-MM-DD_bau-04c-query-local.md.
- Commit + Push auf claude/bau-04c-query-local.
- Draft-PR anlegen.
- „Vorgeschlagene nächste Schritte"-Block im Chat (Sichttest 04.C
  + Bau 16 Sub e Bronze-Stufe + Re-Aktivierung Modul 15+16 in MR/MM).
- Brief-Codeblock für Sichttest oder nächste Sitzung im Chat ausgeben
  (Konvention CLAUDE.md Pflicht-6).
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Sitzung liest)

### Warum diese Bau-Sitzung jetzt

Klaus' Vision-Klärung 2026-05-26: das Such-Feld in jeder Endknoten-
PWA ist der **bidirektionale Cross-Knoten-Matching-Anker**. Aktuell
funktioniert das nicht, weil Modul 15 Sub (b) den Empfänger-Pfad
gebaut hat (postMessage `op:"query"` empfangen), aber `queryLocal`
fehlt — die Antwort ist immer `error:"module-04c-not-available"`.

Modul 04.C ist der **letzte fehlende Baustein** für die Cross-Knoten-
Such-Pattern. Nach Bau 04.C kann Klaus:

1. Mein-Rezeptbuch-Such-Feld testen mit „welcher Wein passt zu
   Lasagne".
2. Cross-Knoten-Anfrage an Mein-Mixarium senden (Modul 15 Sub b).
3. Mein-Mixarium ruft `queryLocal` → Cocktail-/Drink-Treffer-Liste.
4. Antwort kommt zurück → UI in Mein-Rezeptbuch zeigt Wein-
   Empfehlungen mit Verweis-Link zu Mein-Mixarium-Anchor.

### Was nach dieser Bau-Sitzung kommt

- **Klaus' Sichttest 04.C** (Panel 04 Knöpfe 11–13 + Cross-Knoten-Stub).
- **Re-Aktivierung Modul 15+16 in MR/MM** (eigene Endknoten-Sitzung
  pro Repo, externe Repos — siehe Pipeline-Schritt 5e).
- **Bau-Sitzung 16 Sub e Bronze-Stufe** (Modul 16 zweistufiger SIEGEL,
  siehe Pipeline-Schritt 5g).
- **Endknoten-Migration mit Modul 18 + Such-Feld-Pattern** (Pipeline-
  Schritt 5j).

### Klaus-Disziplin: keine Endknoten-Migration in dieser PR

Diese Bau-Sitzung ist **Sage-Protokol-only**. Endknoten-Re-Aktivierung
von Modul 15 + 16 + Sub (b)/(c)-Code-Stellen läuft in eigenen
Folge-PRs pro Endknoten-Repo (Mein-Rezeptbuch, Mein-Mixarium).
