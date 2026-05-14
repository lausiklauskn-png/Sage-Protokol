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
PROVIDER_MIN_MATCH     = 0.80
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
Status: entwurf
Datei:  src/modules/02_spore.js

Bietet (öffentlich):
  init()                              → Promise<void>
  getOrCreateIdentity()               → Promise<{ nodeId: string, publicKeyJwk: JsonWebKey }>
  getNodeId()                         → Promise<string>          // base64url(sha256(rawPub)), ohne Padding
  getPublicKeyJwk()                   → Promise<JsonWebKey>      // OKP / Ed25519
  generateOwnSpore(meta)              → Promise<SporeJson>       // signiert + persistiert
  getOwnSpore()                       → Promise<SporeJson | null>
  verifyForeignSpore(spore)           → Promise<{ valid: boolean, reason?: string }>

  Singleton-Identität pro PWA: in beiden Stores (sbkim_keys und
  sbkim_spore) wird der feste Schlüssel "main" benutzt. Eine zweite
  Identität ist nicht Sache von Modul 02 — wer das will, legt eine
  neue PWA an.

  Schlüssel-Erzeugung ist lazy: passiert beim ersten
  getOrCreateIdentity()-Aufruf, nicht beim Skript-Laden.

Nutzt:
  SbkimStorage.init / get / put       (sbkim_keys["main"], sbkim_spore["main"])
  WebCrypto:
    crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign","verify"])
    crypto.subtle.exportKey("raw" | "jwk", key)
    crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, true, ["verify"])
    crypto.subtle.digest("SHA-256", bytes)
    crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes)
    crypto.subtle.verify({ name: "Ed25519" }, publicKey, sig, bytes)

Storage:
  Stores: sbkim_keys, sbkim_spore (beide aus Modul 01).
  Schreib-Keys: ausschließlich "main" (Singleton).
  Werteform sbkim_keys["main"]:  { keyId: string, privateKey: JsonWebKey, publicKey: JsonWebKey }
  Werteform sbkim_spore["main"]: { nodeId: string, sporeJson: SporeJson, signature: string }
    sporeJson enthält die Signatur bereits im Feld "signature"; auf der
    Wrapper-Ebene wird sie redundant gehalten, damit Modul 05 ohne
    Re-Parse darauf zugreifen kann.

Events:
  (keine — keine Pub/Sub. Andere Module rufen die Funktionen direkt.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore");
  Wie Modul 01 — die Meldung signalisiert "Modul geladen", nicht
  "Identität existiert".

node_id-Ableitung (verbindlich, von anderen Knoten nachrechenbar):
  rawPub  = await crypto.subtle.exportKey("raw", publicKey)   // 32 bytes
  hash    = await crypto.subtle.digest("SHA-256", rawPub)     // 32 bytes
  nodeId  = base64url(hash) ohne Padding                      // 43 chars

Kanonische Signatur (für sign + verify):
  1. Spore-Objekt ohne signature-Feld bauen.
  2. JSON.stringify mit rekursiv sortierten Object-Keys (lexikographisch).
  3. UTF-8 → Uint8Array.
  4. crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes).
  5. base64url ohne Padding → spore.signature.

Fehlerverhalten:
  - WebCrypto / Ed25519 nicht verfügbar  → init() rejects mit CryptoUnavailableError (kein Polyfill)
  - Storage nicht verfügbar              → StorageUnavailableError aus Modul 01 unverändert durchgereicht
  - getNodeId / getPublicKeyJwk vor Identität → NoIdentityError
  - generateOwnSpore mit fehlendem Pflichtfeld in meta → InvalidSporeMetaError
  - verifyForeignSpore: Pflichtfeld fehlt / id ≠ sha256(rawPub) / Signatur falsch / Hauptversion inkompatibel
                                          → { valid: false, reason: "<deutsch>" } (wirft niemals)

Garantien für Modul 05 / 06 / 07:
  - Singleton: getNodeId liefert über die gesamte Lebenszeit derselben
    PWA denselben String (solange IndexedDB-Speicher erhalten bleibt).
  - Verifikation eines fremden Spore-Strings ist seitenfrei rekonstruier-
    bar — kein Zustand außerhalb des übergebenen JSON-Blocks nötig.
  - Spore-Format ist additiv versioniert: neue Pflichtfelder erscheinen
    erst mit einem Hauptversions-Sprung in protocolVersion.

Geprüft: 2026-05-14 (Spec+Bau-Sitzung 02)

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
Status: entwurf
Datei:  src/modules/04_match.js

Bietet (öffentlich):
  match(queryVec: Float32Array, passageVec: Float32Array) → number     // sync; [-1, 1] für L2-norm. Eingaben
  isAboveProviderThreshold(score: number)                  → boolean   // sync; score >= PROVIDER_MIN_MATCH (0.80)
  PROVIDER_MIN_MATCH                                       : number    // 0.80, aus §0 hierher gespiegelt

  KEIN mode-Parameter. Skalarprodukt ist symmetrisch; die Parameter-
  Namen sind reine Lese-Hilfe für den Aufrufer. Reine Funktion, kein
  Promise, kein async.

Nutzt:
  (keine SBKIM-Module zur Laufzeit — vertraut auf die L2-Norm-Garantie
   von Modul 03. Domänen-Vektor entsteht im Andock-Schritt (Modul 02
   Spore / Modul 09 Einbau-PWA), nicht in Modul 04.)

Storage:
  (kein eigener Store — Match ist zustandslos.)

Events:
  (keine)

Selbstcheck:
  Beim Skript-Laden (synchron, sofort beim <script>-Tag-Auswerten):
    console.info("MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold, Schwelle: PROVIDER_MIN_MATCH=0.80");
  Wie Modul 01 — Modul 04 hat keinen asynchronen Lade-Schritt.

Fehlerverhalten:
  - Eingabe ist nicht Float32Array            → InvalidVectorError  (sync throw)
  - Längen-Differenz zwischen den Vektoren    → ShapeMismatchError  (sync throw)
  - Länge ≠ EMBEDDING_DIM (384)               → ShapeMismatchError  (sync throw)
  - NaN/Infinity in der Eingabe               → kein expliziter Check; Ergebnis ist NaN/Infinity
  - Norm ≠ 1.0                                → kein Fehler. Ergebnis liegt evtl. außerhalb [-1, 1]
                                                (Modul 04 vertraut auf die Norm-Garantie von Modul 03;
                                                 jede Norm-Prüfung im Hot-Path wäre Verschwendung).

Garantien für Modul 05 / 07:
  - match() ist deterministisch und reproduzierbar (kein RNG, kein Zeit-Effekt).
  - Bei korrekt L2-normalisierten Eingaben liegt der Rückgabewert in [-1, 1].
  - isAboveProviderThreshold(score) liefert exakt score >= 0.80, ohne
    Toleranz-Spielraum. Wer Hysterese will, baut sie eine Schicht höher.

Geprüft: 2026-05-14 (Spec+Bau-Sitzung 04)

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

Verbindliches Schema, festgelegt in der Spec+Bau-Sitzung 02 vom
2026-05-14. Kanonische Reihenfolge der Keys ist **alphabetisch**
(rekursiv); jede abweichende Serialisierung bricht die Signatur.

**Pflichtfelder** (jede Spore muss alle haben):

```
createdAt        : string   ISO-8601 mit Millisekunden, UTC ("Z")
                            Beispiel: "2026-05-14T07:00:00.000Z"
domain           : string   DNS-Domain ohne Schema, z.B. "rezeptbuch.example.org"
embeddingModel   : string   Default "Xenova/multilingual-e5-small" (aus §0)
endpoint         : string   Basis-URL des Knotens, mit Schema, mit trailing "/"
                            Beispiel: "https://klaus.github.io/rezeptbuch/"
id               : string   = nodeId = base64url(sha256(rawPublicKey)), ohne Padding
nodeType         : string   "provider" | "seeker" | "hybrid"
protocolVersion  : string   semver-artig, z.Z. "0.1" (aus §0)
publicKey        : object   JsonWebKey, kty:"OKP", crv:"Ed25519", x:<base64url>
signature        : string   base64url ohne Padding, Ed25519 über kanonisches JSON ohne signature
```

**Optionale Felder** (wenn vorhanden, sind sie Teil der Signatur):

```
nodeName            : string                  z.B. "Rezeptbuch Klaus"
domainDescription   : string                  Freitext über die Domäne
domainKeywords      : string[]                z.B. ["Backen", "Saucen"]
domainVector        : number[]                384 floats, vorab-berechneter Domänen-Vektor
endpointPaths       : object                  Override für §3, falls Hoster ohne .well-known
```

**Versionierungs-Regel:**
- Pflichtfelder dürfen ab Status `entwurf` nur noch additiv erweitert
  werden. Das Hinzufügen eines Pflichtfelds erfordert den Schritt von
  `protocolVersion: "0.x"` auf `"1.0"`.
- Hauptversionen (1.x ↔ 2.x) sind inkompatibel — siehe §4.
- Optional → Pflicht ist ein Hauptversions-Sprung.
- Streichen ist immer ein Hauptversions-Sprung.
- Unbekannte zusätzliche Felder werden bei `verifyForeignSpore` **nicht**
  abgewiesen, sind aber Teil der Signatur (jeder Knoten signiert das,
  was er ausliefert).

**Verifikations-Pfad** (kurz; Details in `docs/components/02_spore.md`):
1. Pflichtfelder vollzählig? → sonst ungültig.
2. Hauptversion in `protocolVersion` kompatibel? → sonst ungültig.
3. `id === base64url(sha256(rawPublicKey))` aus dem mitgelieferten
   `publicKey`? → sonst ungültig.
4. Signatur über die kanonisch serialisierte Spore (ohne `signature`)
   gegen den `publicKey` verifiziert? → sonst ungültig.

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
| 2026-05-14 | Spec+Bau-Sitzung 04 | Modul 04 spezifiziert und gebaut. Modus-freie API `match(queryVec, passageVec) → number` + `isAboveProviderThreshold` + Konstante `PROVIDER_MIN_MATCH`. Vertraut auf L2-Norm-Garantie aus Modul 03 (kein Norm-Check im Hot-Path). Status auf `entwurf`. A1–B3-Notations-Synthese in `docs/components/04_match.md` gelöst (Hops tragen Funktionen). |
| 2026-05-14 | Spec+Bau-Sitzung 02 | Modul 02 spezifiziert und gebaut. Singleton-Identität (`"main"` in `sbkim_keys` und `sbkim_spore`), Sieben-Funktionen-API (init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore), WebCrypto Ed25519 ohne Polyfill (`CryptoUnavailableError` bei Fehlen). `node_id = base64url(sha256(rawPublicKey))` ohne Padding, von anderen Knoten nachrechenbar. Persistenz strikt über `SbkimStorage`. §2 „Spore-JSON" mit verbindlichem Schema gefüllt: neun Pflichtfelder (createdAt/domain/embeddingModel/endpoint/id/nodeType/protocolVersion/publicKey/signature) + fünf optionale, kanonische Serialisierung mit alphabetisch sortierten Keys, Versionierungs-Regel auf §4 verwiesen. |
| 2026-05-14 | Pflege-Sitzung Match-Kalibrierung | `PROVIDER_MIN_MATCH` in §0 von `0.55` auf `0.80` angehoben (Vertrag-Sektion Modul 04 mitgezogen). Beleg: Klaus-Sichttest im Browser ergab fünf reproduzierbare Cosinus-Messwerte (Käsekuchen/Käsetorte 0.9507, Käsekuchen/Auspuffrohr 0.8967, Hefeteig/Kochrezepte 0.8312, Tarantino/Kochrezepte 0.7737, gleicher Inhalt ~0.95). 0.80 trennt empirisch sauber zwischen „relevant" (0.83) und „irrelevant" (0.77); das Paper-Original 0.55 hätte alles durchgelassen. Modul-Status bleibt `entwurf`. |
