# INTERFACES — die heiligen Tafeln

Diese Datei ist **verbindlich**. Jedes Modul, jede Sitzung hält sich an
die hier festgelegten Signaturen. Wenn du eine Schnittstelle ändern
musst, **erst hier nachziehen, dann den Code**.

---

## 0. Globale Konstanten

Diese Werte stehen in `src/modules/00_config.js` (sobald angelegt) und
sind in jedem Modul als `import { CONFIG } from "./00_config.js";`
verfügbar.

```
PROTOCOL_VERSION       = "0.1"
NODE_TYPE_DEFAULT      = "hybrid"
EMBEDDING_MODEL        = "Xenova/multilingual-e5-small"
EMBEDDING_DIM          = 384
PROVIDER_MIN_MATCH     = 0.55
LOCAL_RESULT_THRESHOLD = 3
QUERY_TIMEOUT_MS       = 4000
SBKIM_STORE_PREFIX     = "sbkim_"
DOKU_REVEAL_CLICKS     = 5
```

---

## 1. Verträge pro Modul

> **Schablone — pro Modul auszufüllen, sobald die Spec geschrieben ist.**
>
> Format pro Modul:
>
> ```
> ### Modul: NN_name
> Status: schablone | entwurf | review | stabil
> Datei:  src/modules/NN_name.js
>
> Bietet (öffentlich):
>   funktionA(arg: Typ) → Rückgabetyp
>   ...
>
> Nutzt:
>   ModulX.funktionY (Lesen / Schreiben / Aufruf)
>   ...
>
> Storage:
>   Stores: <Liste der IndexedDB-Stores, die dieses Modul anlegt/nutzt>
>   Felder: <kurze Liste>
>
> Events (falls relevant):
>   feuert:     <event-name>(payload-form)
>   reagiert:   <event-name>
>
> Fehlerverhalten:
>   Bei Fehler: ...
>
> Geprüft: <YYYY-MM-DD oder "ungeprüft">
> ```

---

### Modul: 00_doku_fenster
Status: schablone
Datei:  src/modules/00_doku_fenster.js

Bietet:
  *(noch zu spezifizieren — Modul 00 enthüllt nach 5 Klicks auf das
   Such-Symbol ein Statusfenster mit Knoten-Entwicklungsstand)*

Geprüft: ungeprüft

---

### Modul: 01_storage
Status: entwurf
Datei:  src/modules/01_storage.js

Bietet (öffentlich):
  init()                                 → Promise<void>
  getStore(storeName: string)            → StoreHandle           // sync; wirft UnknownStoreError
  get(storeName, key: string)            → Promise<any | undefined>
  put(storeName, key: string, value)     → Promise<void>
  del(storeName, key: string)            → Promise<void>
  all(storeName)                         → Promise<Array<{key: string, value: any}>>
  clear(storeName)                       → Promise<void>

Nutzt:
  (keine — Wurzelmodul, IndexedDB direkt)

Storage:
  DB-Name:    "sbkim"
  DB-Version: 1
  Stores:
    sbkim_keys              (Schlüssel "main";  Wert: {keyId, privateKey, publicKey})              — Schreiber 02
    sbkim_spore             (Schlüssel "main";  Wert: {nodeId, sporeJson, signature})              — Schreiber 02
    sbkim_siblings          (Schlüssel nodeId;  Wert: {nodeId, domain, since, pubKey})             — Schreiber 05
    sbkim_anastomosis_log   (Schlüssel ts;      Wert: {ts, peerId, outcome})                       — Schreiber 05
    sbkim_legacy_inbox      (Schlüssel fromId;  Wert: {fromNodeId, reason, signature, receivedAt}) — Schreiber 07
    sbkim_doku_meta         (Schlüssel modId;   Wert: {moduleId, lastSighttest, status})           — Schreiber 00
  Alle Store-Namen mit SBKIM_STORE_PREFIX ("sbkim_"). Versionsmigrationen
  sind additiv; jede neue Spec, die einen Store hinzufügt, erhöht
  DB-Version um 1.

Events:
  (keine — reine Datenzugriffsschicht, keine Pub/Sub)

Selbstcheck:
  Beim Skript-Laden (synchron, nicht in init):
    console.info("MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear");

Fehlerverhalten:
  - Privatmodus / IDB nicht verfügbar  → init() rejects mit StorageUnavailableError
  - Unbekannter Store                  → UnknownStoreError (synchron bei getStore, async sonst)
  - Quota überschritten                → QuotaExceededError (vom Browser durchgereicht)
  - Nicht-klonbarer Wert               → DataCloneError
  - DB-Open scheitert                  → StorageOpenError (keine Auto-Reparatur)

Geprüft: 2026-05-14 (Spec-Sitzung 01+03)

---

### Modul: 02_spore
Status: schablone
Datei:  src/modules/02_spore.js

Bietet:
  *(noch zu spezifizieren — Ed25519-Schlüssel, node_id, Spore-JSON)*

Geprüft: ungeprüft

---

### Modul: 03_embedding
Status: entwurf
Datei:  src/modules/03_embedding.js

Bietet (öffentlich):
  init()                                  → Promise<void>
  isReady()                               → boolean                    // sync
  embedQuery(text: string)                → Promise<Float32Array(384)>  // L2-normalisiert
  embedPassage(text: string)              → Promise<Float32Array(384)>  // L2-normalisiert
  embedQueryBatch(texts: string[])        → Promise<Float32Array[]>    // Reihenfolge erhalten
  embedPassageBatch(texts: string[])      → Promise<Float32Array[]>    // Reihenfolge erhalten

  KEIN mode-Parameter. e5-Rollen-Prefix wird intern angewandt:
    embedQuery   → "query: "   + text
    embedPassage → "passage: " + text
  Modul 04 nimmt match(queryVec, passageVec) und ist damit modus-frei
  (die Parameternamen erzwingen die richtige Vektor-Kombination).

Nutzt:
  (keine SBKIM-Module — lädt eigenes Modell via transformers.js)

Storage:
  (kein SBKIM-Store — transformers.js verwaltet den Modell-Cache im
   Browser-Cache selbst. Kein sbkim_embedding_cache in dieser Spec.)

Events:
  (keine)

Selbstcheck:
  Nach erfolgreichem init() (Modell tatsächlich geladen), einmalig:
    console.info(
      "MODUL 03 EMBEDDING bereit, Funktionen: " +
      "init/isReady/embedQuery/embedPassage/embedQueryBatch/embedPassageBatch, " +
      "Modell: Xenova/multilingual-e5-small, Dim: 384"
    );
  NICHT beim Skript-Laden — der asynchrone Modell-Download würde sonst
  die "bereit"-Meldung verfälschen.

Fehlerverhalten:
  - Modell-Download scheitert  → ModelLoadError (deutschsprachige Message)
  - Tokenizer-Crash            → EmbeddingError (Original-Error in .cause)
  - Leerer/whitespace-Text     → EmptyInputError (Modul 04 darf nie Null-Vektor sehen)
  - Text > 512 Token nach Prefix → KEIN Fehler. Stilles Truncate.
    Beim ersten Truncate pro Sitzung: console.warn("MODUL 03 EMBEDDING:
    Eingabe > 512 Tokens, abgeschnitten"). Danach Schweige-Modus.
  - Leeres Batch-Array         → Promise<[]>, kein Fehler.

Garantien für Modul 04:
  - Alle Vektoren sind Float32Array der Länge 384.
  - Alle Vektoren sind L2-normalisiert (Norm ≈ 1.0 ± 0.001).
  - Cosinus-Ähnlichkeit reduziert sich auf das Skalarprodukt.

Geprüft: 2026-05-14 (Spec-Sitzung 01+03)

---

### Modul: 04_match
Status: schablone
Datei:  src/modules/04_match.js

Bietet:
  *(noch zu spezifizieren — Cosine-Sim, Domänen-Vektor)*

Geprüft: ungeprüft

---

### Modul: 05_anastomose
Status: schablone
Datei:  src/modules/05_anastomose.js

Bietet:
  *(noch zu spezifizieren — Handshake mit fremdem Knoten)*

Geprüft: ungeprüft

---

### Modul: 06_heterokaryose
Status: schablone
Datei:  src/modules/06_heterokaryose.js

Bietet:
  *(noch zu spezifizieren — Datenaustausch zwischen verbundenen Knoten)*

Geprüft: ungeprüft

---

### Modul: 07_apoptose
Status: schablone
Datei:  src/modules/07_apoptose.js

Bietet:
  *(noch zu spezifizieren — Selbstlöschung, Vermächtnis-Nachricht)*

Geprüft: ungeprüft

---

### Modul: 08_ui_demo
Status: schablone
Datei:  src/modules/08_ui_demo.js

Bietet:
  *(noch zu spezifizieren — UI für tests/manual_check.html)*

Geprüft: ungeprüft

---

### Modul: 09_einbau_pwa
Status: schablone
Datei:  docs/components/09_einbau_pwa.md (Anleitung, kein JS-Modul)

Bietet:
  *(Anleitung, wie ein fertiges Modul in Rezeptbuch / Mixarium
   eingebaut wird — keine JS-Schnittstelle)*

Geprüft: ungeprüft

---

## 2. Datenformate (Querschnitt)

### Spore-JSON

*(noch zu spezifizieren — siehe Modul 02 und Kapitel 13 des Papers)*

### Anfrage (Query)

*(noch zu spezifizieren — siehe Modul 05)*

### Antwort (Response)

*(noch zu spezifizieren — siehe Modul 05)*

### Vermächtnis (Legacy)

*(noch zu spezifizieren — siehe Modul 07)*

---

## 3. Endpunkt-Pfade

```
spore           : /.well-known/sbkim/spore.json   (Default)
spore-alias     : /sbkim/spore.json               (für Hoster ohne .well-known)
query           : /sbkim/query                    (POST)
anastomosis     : /sbkim/anastomosis              (POST)
heterokaryosis  : /sbkim/heterokaryosis           (POST)
legacy          : /sbkim/legacy                   (POST/GET)
```

Bei statisch gehosteten PWAs ohne Backend werden eingehende Endpunkte
durch einen Service-Worker abgefangen. Details in Modul 05.

---

## 4. Versionierungs-Regeln

- Hauptversionen (1.x ↔ 2.x): inkompatibel, Knoten verbinden sich nicht.
- Nebenversionen (0.1 ↔ 0.2): kompatibel, wenn alle Pflichtfelder gleich.
- Pflichtfelder pro Datenformat sind in Abschnitt 2 dieses Dokuments
  markiert (sobald die Specs gefüllt sind).

---

## 5. Status-Farb-Mapping (gemeinsame Referenz)

Diese Tabelle ist die **eine Quelle** für Modul-Status-Farben. Sie wird
identisch verwendet in den Markdown-Karten (Hero-Block-Badge), in den
Mermaid-Diagrammen (`classDef`), in `PULS.md` (Pie-Chart) und in der
Sage-Page `index.html` (CSS-Variablen + Bau-Puls-Karte).

| Status | Emoji | Farbe (hex) | Markdown-Badge | Site-CSS-Var |
|---|---|---|---|---|
| schablone | 🟫 | `#92400E` braun | `🟫 Schablone` | `--status-schablone` |
| werkstatt | 🟧 | `#EA580C` orange | `🟧 In Werkstatt` | `--status-werkstatt` |
| spec | 🟨 | `#CA8A04` gelb | `🟨 Spec fertig` | `--status-spec` |
| stub | 🟦 | `#2563EB` blau | `🟦 Code-Stub` | `--status-stub` |
| fertig | 🟩 | `#16A34A` grün | `🟩 Fertig` | `--status-fertig` |

Zusätzlich der abgeleitete Sonderzustand `nextup` (kein eigener Score,
nur visuelle Hervorhebung):

| Sonderzustand | Emoji | Farbe (hex) | Bedeutung |
|---|---|---|---|
| nextup | ✨ | `#F59E0B` Gold (Outline) | alle Abhängigkeiten `fertig`, selbst noch nicht `fertig`, nicht im Schutz-Backlog |

**`nextup`-Logik** (Pseudocode):
```
isNextUp(modul, alleModule) =
  modul.score != "fertig" &&
  modul.id ∉ {"10","11","12"} &&
  alle(d ∈ modul.abhaengig: alleModule[d].score == "fertig")
```

Ergebnis: das Mycel zeigt von selbst, wo der nächste Wachstumspunkt
sitzt. Wer in den Bau-DAG (`ARCHITEKTUR.md`) oder die Bau-Puls-Karte
(Sage-Page) schaut, sieht goldene Kanten/Outlines genau dort, wo eine
Sitzung sinnvoll loslegen könnte.

**Reife-Gradient**: braun (im Boden) → orange (Werkstatt-Hitze) →
gelb (Lichtblick) → blau (kühler Code-Stub) → grün (lebendig). Bewusst
kein Site-Akzent (Indigo/Violett/Teal), weil die Site-Akzente keinen
Reife-Sinn haben — sie sind dekorativ, nicht semantisch.

---

## 6. Änderungsprotokoll

| Datum | Sitzung | Änderung |
|---|---|---|
| 2026-05-10 | Hauptsitzung Skelett | Datei angelegt, alle Module als Schablonen |
| 2026-05-10 | Hauptsitzung Site-Echo | Status-Farb-Mapping (§5) als gemeinsame Referenz ergänzt |
| 2026-05-14 | Spec-Sitzung 01+03 | Erste Vertrag-Sektionen gefüllt: Modul 01 (Storage) und Modul 03 (Embedding) auf Status `spec`. Modul 03 mit 4-Funktionen-API (`embedQuery`/`embedPassage` + Batch-Varianten) statt `mode`-Parameter. Selbstcheck-Format `MODUL XX <NAME> bereit, Funktionen: ...` für alle Module festgelegt. |
| 2026-05-14 | Bau-Sitzung 01 | Modul 01 Code geschrieben (`src/modules/01_storage.js`), Status auf `entwurf`. IIFE mit `window.SbkimStorage`, Selbstcheck beim Skript-Laden. |
| 2026-05-14 | Bau-Sitzung 03 | Modul 03 Code geschrieben (`src/modules/03_embedding.js`), Status auf `entwurf`. IIFE mit `window.SbkimEmbedding`, dynamischer Import transformers.js@2.17.2, Selbstcheck nach `init()`. |
