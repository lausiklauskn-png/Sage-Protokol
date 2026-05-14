# Übergabeprotokoll · 2026-05-14 · Bau-Sitzung Modul 03 Embedding

**Sitzungs-Rolle:** Bau-Sitzung (zweite Bau-Sitzung in derselben Klaus-
Sitzung; folgt direkt auf Bau-Sitzung 01 vom selben Tag)
**Branch:** `claude/build-03-embedding` (von `main` abgezweigt nach
Merge PR #10 Bau 01)
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C
**Vorgänger-Sitzung:** `docs/sessions/archiv/2026-05-14_bau-01-storage.md`

---

## Auftrag

Modul 03 implementieren gemäß `docs/components/03_embedding.md` und
`docs/INTERFACES.md` Modul 03. Die zentrale Spec-Vorgabe: vier
Embed-Funktionen statt `mode`-Parameter, L2-Norm-Garantie gegen Modul 04,
Selbstcheck per `console.info` **nach `init()`** (nicht beim
Skript-Laden).

---

## Was getan wurde

### 1. `src/modules/03_embedding.js`

IIFE-Modul wie 01, klassisches `<script>`-Tag. Selbe Bauart, damit der
Andock-Workflow in den Endknoten-PWAs einheitlich ist.

- **Öffentliche API:** registriert auf `window.SbkimEmbedding` mit
  allen sechs Funktionen aus der Spec
  (`init` / `isReady` / `embedQuery` / `embedPassage` /
  `embedQueryBatch` / `embedPassageBatch`). Zusätzlich `_meta` mit
  `model` / `dim` / `maxTokens` / `queryPrefix` / `passagePrefix` /
  `transformersCdn` für Diagnose.
- **Bibliotheks-Laden:** dynamischer `await import(...)` aus dem CDN
  `https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2`. Die
  Version ist explizit fixiert, damit das Verhalten reproduzierbar ist.
  Bei `import()`-Fehlern wird ein `ModelLoadError` mit
  deutschsprachiger Message und Original-Error in `.cause` geworfen.
  Hinweis: dynamic import funktioniert in einem klassischen `<script>`
  ohne `type="module"` als Funktionsaufruf — nur top-level `import`-
  Statements wären ESM-only.
- **`init()`:** lädt die Bibliothek und ruft
  `pipeline("feature-extraction", EMBEDDING_MODEL)` auf. `pipePromise`
  ist gecached; mehrfacher Aufruf gibt sofort zurück. Bei Misserfolg
  wird `pipePromise` zurückgesetzt, damit Retry möglich ist.
- **`embedQuery` / `embedPassage`:** verkettet intern den e5-Prefix
  (`"query: "` bzw. `"passage: "`) vor den Aufruf an die Pipeline.
  Aufruf mit `{ pooling: "mean", normalize: true }` — transformers.js
  liefert daraus eine L2-normalisierte Float32-Repräsentation. Modul 04
  kann Cosinus als simples Skalarprodukt rechnen.
- **`embedQueryBatch` / `embedPassageBatch`:** validieren Array-Typ und
  Nicht-Leere pro Element. Leeres Array → `Promise<[]>` (kein Fehler,
  wie in der Spec).
- **Truncate-Erkennung:** `tokenCountOrNull(text)` ruft
  `pipe.tokenizer(text).input_ids.dims[1]` ab und triggert
  `warnTruncateOnce()`, wenn > 512. Bei Tokenizer-Surface-Änderung in
  einem späteren transformers.js-Update fällt der Check still aus
  (best-effort) — die tatsächliche Trunkation passiert immer noch durch
  die Pipeline, der `console.warn`-Hinweis fehlt dann nur.
- **Drei benannte Error-Typen:** `ModelLoadError`, `EmbeddingError`,
  `EmptyInputError` — alle aus der Spec, alle mit deutschsprachiger
  Message.
- **Vektor-Extraktion:** `vectorAt(out, index)` kopiert eine 384-Slice
  aus `out.data` per `new Float32Array(out.data.slice(...))`. Bewusste
  Kopie statt View, damit der Aufrufer nicht versehentlich den Tensor-
  Backing-Buffer modifiziert.
- **Selbstcheck:** wird **einmalig** nach erfolgreichem `init()`
  emittiert (`selfCheckEmitted`-Flag). Nicht beim Skript-Laden —
  Klaus' Plan-Entscheidung, damit „bereit" tatsächlich „nutzbar"
  bedeutet.

JS-Syntax mit `node --check src/modules/03_embedding.js` validiert
(grün).

### 2. `tests/manual_check.html`

- Panel 03: Status-Badge von „Spec fertig, Code ausstehend" auf
  „Code-Stub" (grüne `ok`-Variante). Stub-Knöpfe entfernt.
  Log-Vorbelegung weist auf den ~30-MB-Modell-Download beim ersten
  Klick hin.
- Stub-Handler-Skript (das auf alle `button[data-stub]` reagierte)
  komplett entfernt, weil die letzten `data-stub`-Knöpfe (Panel 03)
  jetzt durch echte Knöpfe ersetzt sind.
- `<script src="../src/modules/03_embedding.js"></script>` eingebunden.
- Fünf echte Knöpfe via `SbkimUI.addButton` registriert:
  1. **Embedding init** — `await init()`, gibt Meta zurück. Log
     warnt vor dem Modell-Download.
  2. **Embedding round-trip** — `embedQuery("Käsekuchen mit Quark")`,
     prüft Länge 384 und L2-Norm. Zeigt die ersten vier Werte.
  3. **Vergleich Query vs. Passage** — beide Funktionen auf
     denselben Text, Skalarprodukt → erwartete Spanne 0.85–0.95.
  4. **Batch (2 Inhalte)** — `embedPassageBatch` mit „Käsekuchen"
     und „Auspuffrohr", inter-Cosinus zwischen den beiden Vektoren
     (erwartet niedrig).
  5. **Selbstcheck Konsole prüfen** — schreibt den exakten
     Such-String für die DevTools-Konsole.

### 3. Komponenten-Karte 03

- Hero-Badge auf 🟦 Code-Stub.
- Bauzustand-Tabelle: *Code geschrieben* mit Datum + Detail-Anmerkung;
  *Sichttest* als „ungeprüft im Browser, Sitzung headless" markiert.

### 4. INTERFACES.md

- Modul 03 Sektion: Status `spec` → `entwurf`.
- Änderungsprotokoll §6: neue Zeile für die Bau-Sitzung 03.

### 5. status.json + PULS-Pie

- Modul 03: `score: "stub"`, `siegel: "Code-Stub"`.
- `python3 scripts/update_puls_pie.py` aufgerufen — Pie zeigt jetzt
  10 Schablone / 1 Werkstatt / 0 Spec / 2 Stub.

### 6. PULS.md

- Neuer Sitzungs-Eintrag oben (Bau-Sitzung 03).
- „Als nächstes ✨"-Liste: 03 verschoben in den Code-Stub-Block.
  Spec-fertig-Block ist jetzt leer; Empfehlung umgestellt auf
  Sichttest-für-Klaus + Spec-Sitzung Modul 04.
- Schnellüberblicks-Tabelle: Zeile 03 auf „Spec fertig / Code-Stub /
  ungeprüft".

---

## Was offen blieb

- **Sichttest im Browser** durch Klaus — gleicher Punkt wie bei
  Bau 01, plus die fünf 03-Knöpfe. Modell-Download beim allerersten
  Klick (5–15 s). Cosinus-Spanne bei Query-vs-Passage sollte
  zwischen 0.85 und 0.95 liegen.
- **Spec-Sitzung Modul 04 Match** ist der jetzt naheliegende nächste
  Schritt: 03 (und indirekt 01) sind als Code-Stub verfügbar, die
  Plan-Sitzung hat festgehalten, dass 04 die A1–B3-Notations-
  Synthese gleichzeitig leistet.
- **Voll-Glossar (`docs/GLOSSAR.md`)** und `favicon.ico`-Fallback
  unverändert offen (aus früheren Sitzungen).

---

## Nächster sinnvoller Schritt

1. **Sichttest 01 + 03** durch Klaus im Browser.
2. **Spec-Sitzung Modul 04 Match** — modus-frei
   `match(queryVec, passageVec)`, Beziehung zu den A1–B3-Hops als
   Querschnitts-Erfüllung.
3. **Optional parallel:** Spec-Sitzung Modul 09 (Einbau-PWA).

---

## Pflicht-Häkchen am Sitzungsende

- [x] `docs/PULS.md` aktualisiert (Sitzungs-Eintrag oben, Tabelle,
       „Als nächstes"-Liste, Pie via Skript)
- [x] Übergabeprotokoll (diese Datei)
- [x] `status.json` geändert → `python3 scripts/update_puls_pie.py`
       ausgeführt, Pie regeneriert
- [x] Code geschrieben → JS-Syntax via `node --check` validiert.
       Browser-Sichttest in dieser Sitzung nicht möglich (headless +
       Modell-Download); als „ungeprüft, Klaus prüft im Browser"
       markiert
- [ ] Commit + Push (folgt unmittelbar)
- [ ] PR + Merge (folgt unmittelbar)
