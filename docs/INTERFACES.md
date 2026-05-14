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
SIBLING_MAX_AGE_MS     = 2592000000     // 30 Tage; TTL für Modul 07 forgetExpiredSiblings
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
Status: entwurf
Datei:  src/modules/05_anastomose.js

Bietet (öffentlich):
  init()                                                       → Promise<void>
  handshake(targetSpore: SporeJson, ownDomainVector: Float32Array(384))
                                                               → Promise<HandshakeResult>
  receiveHandshake(incomingRequest: HandshakeRequest)          → Promise<HandshakeResponse>
  listSiblings()                                               → Promise<Array<{ nodeId, domain, since, pubKey }>>
  forgetSibling(nodeId: string)                                → Promise<void>

  Anastomose ist die *Komposition* aus 01/02/04. Modul 05 rechnet nicht
  selbst, sondern ruft `SbkimSpore.verifyForeignSpore`,
  `SbkimMatch.match` + `SbkimMatch.isAboveProviderThreshold` und
  `SbkimStorage.put/get/del` auf. Auslöser ist ausschließlich der
  Aufrufer (Modul 08 UI-Demo / Modul 09 Einbau-PWA) — kein Auto-
  Handshake beim Spore-Empfang, keine Pulsation, keine Eigenanfragen
  ins offene Netz.

Nutzt:
  SbkimStorage.init / get / put / del / all     (sbkim_siblings, sbkim_anastomosis_log)
  SbkimSpore.init / getOrCreateIdentity / getOwnSpore / getNodeId / getPublicKeyJwk
                                                 (eigene Identität, kanonisches Sign)
  SbkimSpore.verifyForeignSpore                  (fremde Spore prüfen — Signatur, id-Konsistenz, Hauptversion)
  SbkimMatch.match                               (Cosinus zweier domainVector)
  SbkimMatch.isAboveProviderThreshold            (Schwelle ≥ PROVIDER_MIN_MATCH (0.80) aus §0)
  WebCrypto via Modul 02:
    crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes)   (Request/Response signieren)
    crypto.subtle.verify({ name: "Ed25519" }, publicKey, sig, bytes)  (Gegen-Signatur prüfen)
  fetch (POST) gegen targetSpore.endpoint + ENDPOINT.anastomosis ("/sbkim/anastomosis").
    AbortController(QUERY_TIMEOUT_MS = 4000) für ausgehende Anfragen.

Storage:
  Stores (beide aus Modul 01):
    sbkim_siblings         (Schlüssel: peerNodeId; Wert: { nodeId, domain, endpoint, pubKey, since })
    sbkim_anastomosis_log  (Schlüssel: ISO-Timestamp; Wert: { ts, peerId, outcome })
  outcome ∈ { "established", "rejected", "re-handshake", "timeout" }.
  Log ist anonymisiert: kein domainVector, kein Score-Profil, kein
  Anfrage-Inhalt; nur Begegnung + Ausgang. `since` bleibt beim ersten
  Anklopf-Zeitpunkt eingefroren (Reentry-Idempotenz).

Events:
  (keine — keine Pub/Sub. Modul 09 / 08 rufen handshake() bzw.
   der Service-Worker ruft receiveHandshake() direkt auf.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 05 ANASTOMOSE bereit, Funktionen: init/handshake/receiveHandshake/listSiblings/forgetSibling");
  Wie Modul 01/02/04 — die Meldung signalisiert "Modul geladen", nicht
  "Identität existiert" oder "Geschwister da". Schwelle / Endpunkt /
  Version werden in der Selbstcheck-Zeile bewusst nicht wiederholt
  (stehen verbindlich in §0 / §3 / Modul 04).

Versionierungs- und Match-Vertrag:
  - Hauptversion-Mismatch zwischen lokaler PROTOCOL_VERSION und
    `targetSpore.protocolVersion` (bzw. `request.protocolVersion`):
    sofortiger Abbruch (ausgehend: ProtocolVersionMismatchError;
    eingehend: HandshakeResponse{outcome:"rejected",
    reason:"Inkompatible Hauptversion: <x.y>"}). Siehe §4.
  - Schwellwert kommt ausschließlich aus
    SbkimMatch.isAboveProviderThreshold — niemals literal 0.80 in
    Modul 05. Wer den Wert ändert, ändert §0 + Modul 04; Modul 05
    zieht ohne Code-Änderung nach.
  - Bidirektionalität: sbkim_siblings wird auf beiden Seiten genau
    dann gefüllt, wenn beide Match-Schwellen passieren. Einseitiger
    Match → kein Geschwister-Eintrag; in sbkim_anastomosis_log
    erscheint auf beiden Seiten eine "rejected"-Zeile.

Fehlerverhalten:
  - Abhängigkeit fehlt (Storage/Spore/Match nicht auf window) → init() rejects mit AnastomoseDependenciesError
  - handshake(): verifyForeignSpore(targetSpore) liefert {valid:false} → InvalidPeerSporeError (cause: reason)
  - handshake(): Hauptversion inkompatibel → ProtocolVersionMismatchError (kein Netz-Aufruf)
  - handshake(): lokaler Vor-Check unter Schwelle (wenn targetSpore.domainVector vorhanden)
                                                          → KEIN Throw. return {outcome:"rejected-local", score},
                                                            Log "abgelehnt: lokal".
  - handshake(): fetch-Timeout > QUERY_TIMEOUT_MS         → HandshakeTimeoutError, Log "timeout"
  - handshake(): Netz-/CORS-/DNS-Fehler                   → HandshakeNetworkError (cause: Original-Error)
  - handshake(): Response-Signatur ungültig                → HandshakeSignatureInvalidError, Log "abgelehnt: invalid-peer"
  - handshake(): outcome "rejected" vom Peer               → KEIN Throw. return {outcome:"rejected", reason, score?},
                                                            Log "abgelehnt: peer".
  - receiveHandshake(): jegliche Form-/Signatur-/Version-/Schwellen-Verletzung
                                                          → WIRFT NIEMALS. Alles als
                                                            HandshakeResponse{outcome:"rejected", reason:"<deutsch>"}
                                                            (analog Modul 02 verifyForeignSpore).
  - listSiblings() / forgetSibling(): Storage-Fehler aus Modul 01    → unverändert durchgereicht

Reentry-Verhalten:
  Wenn dieselbe peerNodeId (mit derselben Spore-id) zweimal anklopft:
  sbkim_siblings-Eintrag wird NICHT überschrieben, `since` bleibt
  beim ersten Anklopf-Zeitpunkt. Log-Zeile bekommt outcome
  "re-handshake". forgetSibling auf einen unbekannten nodeId wirft
  NICHT (idempotent).

Service-Worker-Vertrag (für statisch gehostete Endknoten):
  - Pfad: ENDPOINT.anastomosis ("/sbkim/anastomosis"), POST,
    Content-Type application/json, Body ≤ 64 KiB. Andere Methode → 405,
    falscher Content-Type → 415, zu groß → 413.
  - SW liest JSON-Body, ruft `SbkimAnastomose.receiveHandshake(body)`
    auf der aktiven PWA-Instanz auf, antwortet mit dem zurückgegebenen
    HandshakeResponse als JSON (200).
  - Wenn keine PWA-Instanz aktiv: 503 Service Unavailable, kein Auto-
    Start, kein Wake-Lock.
  - Variante Page-Hosted vs. SW-Hosted: Entscheidung in Bau-Sitzung 05.
    Beide Varianten rufen dieselbe `receiveHandshake`-Signatur.

Datenformate:
  HandshakeRequest / HandshakeResponse → §2 dieser Datei.
  sbkim_siblings-Wert / sbkim_anastomosis_log-Wert → Karte 05 Block
  "Datenformate".

Garantien für Modul 06 / 07:
  - sbkim_siblings ist die Einzige Quelle für „verbundene Geschwister".
    Modul 06 (Heterokaryose) iteriert nur über diese Liste und legt
    keine eigenen Listen an.
  - Modul 05 vergisst Geschwister NICHT von selbst (kein TTL, keine
    Apoptose). Vergessen ist Aufgabe von Modul 07 (Apoptose) bzw.
    manuell über forgetSibling.
  - Anastomose ist die kleinste Einheit eines Schlucks: ein
    Handshake = eine Aktion + ein Log-Eintrag. Wer mehrfach handshakt,
    erzeugt mehrfach Logs — aber pro Peer nur einen Geschwister-
    Eintrag.

Geprüft: 2026-05-14 (Spec-Sitzung 05)

---

### Modul: 06_heterokaryose
Status: schablone
Datei:  src/modules/06_heterokaryose.js

Bietet:
  *(noch zu spezifizieren — Datenaustausch zwischen verbundenen Knoten)*

Geprüft: ungeprüft

---

### Modul: 07_apoptose
Status: entwurf
Datei:  src/modules/07_apoptose.js

Bietet (öffentlich):
  init()                                                           → Promise<void>
  prepareSelfApoptose(reason: string)
                                                                   → Promise<{ confirmationToken: string, expiresAt: string, recipientCount: number }>
  confirmSelfApoptose(token: string, reason: string)
                                                                   → Promise<{ outcome: "completed", recipientsNotified: string[], recipientsFailed: Array<{ nodeId, reason }> }>
  receiveLegacy(incomingLegacy: LegacyMessage)                     → Promise<LegacyResponse>
  listLegacy()                                                     → Promise<Array<{ fromNodeId, reason, receivedAt }>>
  forgetExpiredSiblings(maxAgeMs: number)                          → Promise<Array<{ nodeId, lastSeen }>>

  Apoptose ist die *zweite Komposition* (nach Modul 05) aus 01/02. Modul
  07 rechnet nicht selbst — es liest `sbkim_siblings` als Quelle der
  Vermächtnis-Empfänger und für TTL-Sweeps, signiert kanonisch mit dem
  Ed25519-Schlüssel aus `sbkim_keys["main"]`, und schreibt empfangene
  Vermächtnisse in `sbkim_legacy_inbox`. Modul 07 ruft
  `SbkimAnastomose.handshake` **NICHT** auf — der Vermächtnis-Versand
  ist ein eigener HTTP-POST gegen ENDPOINT.legacy (= "/sbkim/legacy"
  aus §3).

  Self-Apoptose ist **irreversibel** und **zweistufig**:
  `prepareSelfApoptose` liefert einen einmal verwendbaren Token mit
  60 s Gültigkeit (APOPTOSE_TOKEN_TTL_MS = 60_000, Modul-lokal);
  erst `confirmSelfApoptose(token, reason)` versendet das Vermächtnis
  und löscht die SBKIM-Stores. Nach Self-Apoptose haben
  SbkimSpore.getNodeId / getOwnSpore keine Identität mehr (werfen
  NoIdentityError).

Nutzt:
  SbkimStorage.init / get / put / del / all / clear
                                                 (sbkim_legacy_inbox als Schreiber;
                                                  sbkim_siblings als Leser + Löscher für TTL und Empfangs-Cleanup;
                                                  sbkim_keys / sbkim_spore / sbkim_anastomosis_log / sbkim_legacy_inbox als Löscher beim Self-Apoptose-Cleanup)
  SbkimSpore.init / getOrCreateIdentity / getOwnSpore / getNodeId / getPublicKeyJwk
                                                 (eigene Identität + Spore für Signatur)
  SbkimSpore.verifyForeignSpore                  (eingehende Sender-Spore prüfen — Signatur, id-Konsistenz, Hauptversion)
  WebCrypto via Modul 02:
    crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes)   (LegacyMessage / LegacyResponse signieren)
    crypto.subtle.verify({ name: "Ed25519" }, publicKey, sig, bytes)  (eingehende Vermächtnis-Signatur prüfen)
  fetch (POST) gegen sibling.endpoint + ENDPOINT.legacy ("/sbkim/legacy").
    AbortController(QUERY_TIMEOUT_MS = 4000) pro Empfänger.
    Versand parallel via Promise.allSettled.

Storage:
  Stores (alle aus Modul 01):
    sbkim_legacy_inbox     (Schlüssel: fromNodeId;
                            Wert: { fromNodeId, reason, signature, receivedAt })
                            — Schreiber 07, Leser 07/00/08
    sbkim_siblings         (Schlüssel: peerNodeId; Schreiber 05)
                            — Modul 07 ist hier LÖSCHER:
                              - bei receiveLegacy(C) → sbkim_siblings.del(C)
                              - bei forgetExpiredSiblings(maxAgeMs) → sbkim_siblings.del(älter als maxAgeMs)
                            Schreibrecht hat WEITERHIN nur Modul 05.
    sbkim_anastomosis_log  (Schlüssel: ts; Schreiber 05)
                            — Modul 07 ist hier LESER:
                              max(ts) mit outcome ∈ {"established","re-handshake"} pro peerId
                              = lastActivity für TTL-Vergleich.
    sbkim_keys             (Schreiber 02) — Modul 07 löscht den "main"-Eintrag beim Self-Apoptose-Cleanup.
    sbkim_spore            (Schreiber 02) — dito.

  Reihenfolge des Self-Apoptose-Cleanup (sequenziell):
    1. sbkim_siblings        clear
    2. sbkim_anastomosis_log clear
    3. sbkim_legacy_inbox    clear
    4. sbkim_spore           clear
    5. sbkim_keys            clear   ← zuletzt; Identität ist die letzte Bastion
  sbkim_doku_meta bleibt unangetastet (Schreiber 00).

Events:
  (keine — Service-Worker liefert eingehende /sbkim/legacy-Bodies via
   MessageChannel an receiveLegacy weiter, analog Modul 05.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 07 APOPTOSE bereit, Funktionen: init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings");
  Wie Modul 01/02/04/05 — keine Schwelle/Konstante in der Selbstcheck-
  Zeile. Die irreversible Natur der Self-Apoptose wird beim Aufruf
  von prepareSelfApoptose als console.warn nachgereicht, nicht beim
  Skript-Laden.

Versionierungs- und Vermächtnis-Vertrag:
  - Hauptversion-Mismatch zwischen lokaler PROTOCOL_VERSION und
    `incomingLegacy.protocolVersion`: receiveLegacy antwortet
    LegacyResponse{outcome:"rejected",
    reason:"Inkompatible Hauptversion: <x.y>"}. Siehe §4.
  - Beim Self-Apoptose-Versand bricht Modul 07 NICHT pro Empfänger ab,
    wenn dessen Antwort Hauptversion-inkompatibel ist — der Empfänger
    landet als "rejected" in recipientsFailed.
  - Vermächtnis ist eine direkte Eins-zu-eins-Nachricht; Modul 07
    leitet empfangene Vermächtnisse NICHT an seine eigenen
    Geschwister weiter.
  - Kein Quorum, keine Misstrauensvoten. Quorum-Verfahren gehört
    in Modul 10 (Reputation, Schutz-Backlog) — Spec-Sitzung 07
    hat das bewusst aus dieser Spec gestrichen (anders als die
    ursprüngliche Schablone aus 2026-05-10 nahelegt).

Fehlerverhalten:
  - init(): Abhängigkeit fehlt (SbkimStorage/SbkimSpore nicht auf window)
        → ApoptoseDependenciesError
  - prepareSelfApoptose(): keine Identität → NoIdentityError aus Modul 02 unverändert durchgereicht
  - confirmSelfApoptose(): Token unbekannt/abgelaufen/reason weicht ab
        → InvalidApoptoseTokenError; kein Versand, kein Cleanup
  - confirmSelfApoptose(): Identität fehlt (schon ausgeführt)
        → ApoptoseAlreadyExecutedError
  - confirmSelfApoptose(): einzelner Empfänger antwortet mit Timeout/Netz/Sig-Fehler/rejected
        → KEIN Throw; Empfänger landet in recipientsFailed; Versand an andere läuft weiter
  - confirmSelfApoptose(): Storage-Fehler beim Cleanup
        → unverändert durchgereicht; Knoten ist inkonsistent (siehe Karte 07 Risiken)
  - receiveLegacy(): jegliche Form-/Spore-/Versions-/Signatur-Verletzung
        → WIRFT NIEMALS; LegacyResponse{outcome:"rejected", reason:"<deutsch>"}
          (analog Modul 02 verifyForeignSpore und Modul 05 receiveHandshake)
  - receiveLegacy(): Storage-Fehler beim put/del
        → WIRFT NIEMALS nach außen; Response outcome:"rejected",
          reason:"interner Speicherfehler"; Original-Error in console.error
  - listLegacy(): Storage-Fehler → unverändert durchgereicht
  - forgetExpiredSiblings(): maxAgeMs fehlt / ≤ 0 → InvalidTtlError (kein Sweep)
  - forgetExpiredSiblings(): Storage-Fehler → unverändert durchgereicht

TTL-Trigger (Spec-Sitzung 07, 2026-05-14):
  Variante (c) — explizit durch den Andocker. Modul 07 hat KEIN
  setInterval, KEINEN Selbst-Sweep im init() und KEINE Pulsation.
  Empfehlung für Karte 09 (Folge-Pflege-Sitzung): forgetExpiredSiblings
  nach jedem erfolgreichen Handshake aufrufen, oder auf einem
  versteckten Modul-00-Doku-Fenster-Knopf.

`SIBLING_MAX_AGE_MS`-Ort-Entscheidung (Spec-Sitzung 07, 2026-05-14):
  Variante A — global in §0. Konsistenz mit PROVIDER_MIN_MATCH /
  QUERY_TIMEOUT_MS / PROTOCOL_VERSION; additive Änderung an §0, KEIN
  Hauptversions-Sprung. `status.json.config` zieht den Wert mit.

Garantien für Modul 06 / 10 / 11:
  - sbkim_legacy_inbox ist Einzige Quelle für „empfangene Vermächtnisse";
    Modul 10 / 12 dürfen davon ausgehen, dass jeder Eintrag eine valide
    Signatur durchlaufen hat (oder gar nicht angelegt wurde).
  - Modul 07 löscht sbkim_siblings-Einträge zwei Wege:
      (a) auf Vermächtnis-Empfang (sender wird vergessen),
      (b) auf TTL-Sweep (stille Geschwister).
    Modul 06 (Heterokaryose) iteriert sbkim_siblings und darf davon
    ausgehen, dass abgelaufene Geschwister verschwinden, sobald der
    Andocker forgetExpiredSiblings regelmäßig ruft.
  - Modul 07 erzeugt keine eigenen Listen, keine Pulsation, keine
    Eigenanfragen — der einzige Netz-Aufruf ist der parallele
    Vermächtnis-Versand beim Self-Apoptose-Confirm.

Geprüft: 2026-05-14 (Spec-Sitzung 07)

---

### Modul: 08_ui_demo
Status: schablone
Datei:  src/modules/08_ui_demo.js

Bietet:
  *(noch zu spezifizieren — UI für tests/manual_check.html)*

Geprüft: ungeprüft

---

### Modul: 09_einbau_pwa
Status: entwurf  (Anleitung, kein JS-Modul — Statuscodes sind formal
                  für JS-Module; 09 ist die Bündel-Anleitung und nutzt
                  „entwurf" als Marker für „Spec fertig, Inhalt
                  verbindlich".)
Datei:  docs/components/09_einbau_pwa.md (Anleitung, kein JS-Modul)

Bietet:
  Schritt-für-Schritt Andock-Anleitung für Endknoten-PWAs (Rezeptbuch,
  Mixarium und künftige). Acht nummerierte Schritte vom Kopieren der
  Modul-Dateien bis zum ersten erfolgreichen Handshake. Trifft drei
  Andock-Konventionen verbindlich:
    1. Datei-Pfad-Konvention: Service-Worker `sbkim-sw.js` liegt im
       Endknoten-Repo-Root (Scope `/<repo>/`); die fünf JS-Module
       werden als Inline-`<script>`-Blöcke in `index.html` eingebaut
       (Klaus' Single-File-Stil) oder alternativ unter `<endknoten>/
       sbkim/` als externe `.js`-Dateien. Reihenfolge verbindlich:
       01 → 02 → 03 → 04 → 05.
    2. Spore-Endpunkt-Konvention: `/sbkim/spore.json` (§3-Alias) ist
       der verbindliche Andock-Default, weil GitHub-Pages-Project-Sites
       mit `.well-known/` (Jekyll-Default-Ausschluss von Dot-Ordnern)
       Probleme haben können.
    3. Service-Worker-Registrierungs-Konvention: SW im Endknoten-Repo-
       Root als `sbkim-sw.js`, registriert mit
       `navigator.serviceWorker.register("sbkim-sw.js")` (relativer
       Pfad, automatischer Scope `/<repo>/`). Scope-Falle bei Ablage
       unter `<endknoten>/sbkim/sbkim-sw.js` ist dokumentiert
       (engerer Scope `/<repo>/sbkim/` blockiert spätere Schutz-
       Module).

Nutzt-von:
  Endknoten-Repos Rezeptbuch + Mixarium (siehe `endknoten` in
  `status.json`). Nicht intern im Sage-Protokoll-Repo.

Abhängigkeiten:
  Keine im Bau-DAG (Karte 09 hängt formal an gar nichts und ist auch
  von gar nichts abhängig). Inhaltlich setzt sie alle fünf Code-Module
  + den Service-Worker voraus:
    Modul 01 (Storage), Modul 02 (Spore), Modul 03 (Embedding),
    Modul 04 (Match), Modul 05 (Anastomose), `src/sbkim-sw.js`.

`domainVector`-Pflicht-Entscheidung (Spec-Sitzung 09, 2026-05-14):
  Soft-Pflicht im Andock-Workflow — `domainVector` bleibt im §2-
  Spore-Schema OPTIONAL (kein Hauptversions-Sprung). Karte 09 macht
  es im Andock-Workflow zur verbindlichen Pflicht (Schritte 5–7
  erzeugen und deployen den Vektor). Modul 05 lehnt unverändert ab
  mit `outcome:"rejected", reason:"kein domainVector verfügbar"`,
  wenn jemand trotzdem eine Spore ohne Vektor publiziert. Begründung
  in Karte 09 § Risiken & offene Punkte.

Geprüft: 2026-05-14 (Spec-Sitzung 09)

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

Verbindliches Schema des Anastomose-Handshakes, festgelegt in der
Spec-Sitzung 05 vom 2026-05-14. Anfrage = `HandshakeRequest`, der vom
Initiator A an `targetSpore.endpoint + ENDPOINT.anastomosis` (= dem
`/sbkim/anastomosis`-Pfad aus §3) **POST** geschickt wird, mit
`Content-Type: application/json`. Antwort = `HandshakeResponse`
(unten). Beide JSON-Objekte sind **kanonisch** serialisiert
(alphabetisch sortierte Keys, rekursiv); die Signatur deckt die Form
**ohne** das `signature`-Feld.

#### HandshakeRequest — Pflichtfelder

```
fromNodeId       : string   = nodeId des Senders A (= base64url(sha256(rawPub)), ohne Padding)
nonce            : string   16 zufällige Bytes, base64url ohne Padding (Replay-Marker; Modul 05
                            prüft in der Erst-Spec noch nicht aktiv auf Wiederholung, vgl. Karte
                            05 Risiken-Block)
protocolVersion  : string   semver-artig, z.Z. "0.1" (aus §0). Hauptversions-Mismatch zwischen
                            request.protocolVersion und PROTOCOL_VERSION → Abbruch, siehe §4.
senderSpore      : object   vollständige SporeJson des Senders, vom Sender mit Ed25519 signiert
                            (siehe oben „Spore-JSON"). Empfänger verifiziert über
                            SbkimSpore.verifyForeignSpore.
signature        : string   base64url ohne Padding, Ed25519 über kanonisches JSON ohne signature.
                            Schlüssel: privateKey des Senders (Modul 02). Empfänger verifiziert
                            gegen senderSpore.publicKey.
timestamp        : string   ISO-8601 mit Millisekunden, UTC ("Z"). Vom Sender beim Bauen gesetzt.
```

#### HandshakeRequest — Optionale Felder (signaturpflichtig, wenn vorhanden)

```
domainVector     : number[]   384 floats, L2-normalisiert. Wenn nicht in senderSpore.domainVector
                              gesetzt: hier nachreichen. Empfänger kann ohne einen der beiden
                              Vektoren nicht matchen — siehe Karte 05 Risiken-Block.
toNodeId         : string     erwartete nodeId des Empfängers, falls dem Sender bekannt. Empfänger
                              prüft (wenn vorhanden) Übereinstimmung mit getNodeId(); Mismatch →
                              outcome:"rejected", reason:"toNodeId stimmt nicht zum Empfänger".
```

#### HandshakeResponse — Pflichtfelder

```
fromNodeId       : string   nodeId des Empfängers B
nonceEcho        : string   identisch zu request.nonce (Replay-Verkettung; in Erst-Spec rein
                            informativ, in einer Folge-Spec für aktiven Replay-Schutz nutzbar)
outcome          : string   "established" | "rejected"
protocolVersion  : string   "0.1"
receiverSpore    : object   vollständige SporeJson des Empfängers B (signiert)
signature        : string   Ed25519-Signatur über kanonisches JSON ohne signature, mit dem
                            privateKey des Empfängers.
timestamp        : string   ISO-8601 UTC, Empfänger beim Bauen
toNodeId         : string   nodeId des Senders (= request.fromNodeId)
```

#### HandshakeResponse — Optionale Felder

```
reason           : string   deutschsprachiger Klartext, Pflicht bei outcome="rejected", sonst weggelassen.
                            Beispiele: "Pflichtfeld fehlt: <name>", "Inkompatible Hauptversion: 1.0",
                            "Signatur ungültig", "score unterhalb Schwelle", "kein domainVector verfügbar".
score            : number   Cosinus-Ergebnis aus SbkimMatch.match auf der Empfängerseite. Wird bei
                            outcome:"established" und bei outcome:"rejected" mit Grund "score
                            unterhalb Schwelle" mitgeschickt. Bei anderen Ablehnungs-Gründen
                            (Form, Versions-Mismatch, Signatur ungültig) weggelassen.
```

#### Versionierungs-Regel

- Pflichtfelder dürfen ab Status `entwurf` nur additiv erweitert
  werden. Das Hinzufügen eines Pflichtfelds erfordert den Schritt von
  `protocolVersion: "0.x"` auf `"1.0"`.
- Hauptversionen (1.x ↔ 2.x): inkompatibel. Empfänger und Sender
  brechen den Handshake bei Hauptversion-Mismatch ab — siehe §4 und
  Modul 05 Vertrag (`ProtocolVersionMismatchError` ausgehend,
  `outcome:"rejected"` mit reason eingehend).
- Streichen oder Optional→Pflicht ist immer ein Hauptversions-Sprung.
- Unbekannte zusätzliche Felder werden bei `receiveHandshake` **nicht**
  abgewiesen — sie sind aber Teil der Signatur (jeder Knoten signiert,
  was er ausliefert).

#### Verifikations-Pfad (Empfänger, Reihenfolge verbindlich)

1. Pflichtfelder vollzählig im HandshakeRequest? → sonst
   `outcome:"rejected", reason:"Form ungültig"`.
2. `SbkimSpore.verifyForeignSpore(senderSpore)` valid? → sonst
   `outcome:"rejected", reason:"<deutsch>"` (reason aus dem
   verifyForeignSpore-Ergebnis durchgereicht).
3. Hauptversion `request.protocolVersion` kompatibel mit lokalem
   `PROTOCOL_VERSION`? → sonst `outcome:"rejected",
   reason:"Inkompatible Hauptversion: <x.y>"`.
4. Request-Signatur über die kanonisch serialisierte Form ohne
   `signature` gegen `senderSpore.publicKey` verifiziert? → sonst
   `outcome:"rejected", reason:"Request-Signatur ungültig"`.
5. `domainVector` verfügbar (aus `request.domainVector` oder
   `senderSpore.domainVector`)? → sonst `outcome:"rejected",
   reason:"kein domainVector verfügbar"`.
6. `score = SbkimMatch.match(ownDomainVector, peerDomainVector)`;
   `SbkimMatch.isAboveProviderThreshold(score)` true? → sonst
   `outcome:"rejected", reason:"score unterhalb Schwelle"` (score
   mit-melden).
7. Sonst: `sbkim_siblings.put({nodeId, domain, endpoint, pubKey,
   since: now()})` (nur wenn neu — Reentry hält `since` fest),
   `sbkim_anastomosis_log.put({ts, peerId, outcome:"established"})`,
   Response `{outcome:"established", score, …}` mit Signatur.

Detail-Erklärung der Sender-Seite und der Schritt-für-Schritt-Ebene
liegt in `docs/components/05_anastomose.md` § „Anastomose-Pfad".

### Antwort (Response)

*(noch zu spezifizieren — siehe Modul 05)*

### Vermächtnis (Legacy)

Verbindliches Schema des Apoptose-Vermächtnisses, festgelegt in der
Spec-Sitzung 07 vom 2026-05-14. Vermächtnis = `LegacyMessage`, das vom
sterbenden Knoten A an `sibling.endpoint + ENDPOINT.legacy` (= dem
`/sbkim/legacy`-Pfad aus §3) **POST** geschickt wird, mit `Content-Type:
application/json`. Antwort = `LegacyResponse` (unten). Beide JSON-
Objekte sind **kanonisch** serialisiert (alphabetisch sortierte Keys,
rekursiv); die Signatur deckt die Form **ohne** das `signature`-Feld.
Sign-/Verify-Pfad **identisch** zu Spore (Modul 02) und HandshakeRequest
(Modul 05).

#### LegacyMessage — Pflichtfelder

```
fromNodeId       : string   = nodeId des sterbenden Senders A (= base64url(sha256(rawPub)), ohne Padding)
nonce            : string   16 zufällige Bytes, base64url ohne Padding (Replay-Marker; Modul 07
                            prüft in der Erst-Spec noch nicht aktiv auf Wiederholung — aktiver
                            Replay-Schutz gehört in Modul 11, vgl. Karte 07 Risiken-Block).
protocolVersion  : string   semver-artig, z.Z. "0.1" (aus §0). Hauptversions-Mismatch zwischen
                            incomingLegacy.protocolVersion und lokaler PROTOCOL_VERSION → outcome:
                            "rejected", reason:"Inkompatible Hauptversion: <x.y>". Siehe §4.
reason           : string   deutschsprachiger Klartext, der erklärt, warum der Knoten stirbt
                            (z.B. "Domain stillgelegt", "Schlüssel kompromittiert",
                            "Betreiber-Wechsel"). Pflicht; leerer String ist ungültig.
senderSpore      : object   vollständige SporeJson des Senders, vom Sender mit Ed25519 signiert
                            (siehe oben „Spore-JSON"). Empfänger verifiziert über
                            SbkimSpore.verifyForeignSpore.
signature        : string   base64url ohne Padding, Ed25519 über kanonisches JSON ohne signature.
                            Schlüssel: privateKey des Senders (Modul 02). Empfänger verifiziert
                            gegen senderSpore.publicKey.
timestamp        : string   ISO-8601 mit Millisekunden, UTC ("Z"). Vom Sender beim Bauen gesetzt.
```

#### LegacyResponse — Pflichtfelder

```
fromNodeId       : string   nodeId des Empfängers B
nonceEcho        : string   identisch zu incomingLegacy.nonce (Replay-Verkettung; in Erst-Spec
                            rein informativ, in einer Folge-Spec für aktiven Replay-Schutz nutzbar)
outcome          : string   "accepted" | "rejected"
protocolVersion  : string   "0.1"
receiverSpore    : object   vollständige SporeJson des Empfängers B (signiert)
signature        : string   Ed25519-Signatur über kanonisches JSON ohne signature, mit dem
                            privateKey des Empfängers.
timestamp        : string   ISO-8601 UTC, Empfänger beim Bauen
toNodeId         : string   nodeId des Senders (= incomingLegacy.fromNodeId)
```

#### LegacyResponse — Optionale Felder

```
reason           : string   deutschsprachiger Klartext, Pflicht bei outcome="rejected",
                            sonst weggelassen.
                            Beispiele: "Form ungültig", "Spore ungültig: <inner reason>",
                            "Inkompatible Hauptversion: 1.0", "Signatur ungültig",
                            "interner Speicherfehler".
```

#### Versionierungs-Regel

- Pflichtfelder dürfen ab Status `entwurf` nur additiv erweitert
  werden. Das Hinzufügen eines Pflichtfelds erfordert den Schritt von
  `protocolVersion: "0.x"` auf `"1.0"`.
- Hauptversionen (1.x ↔ 2.x): inkompatibel. Empfänger lehnt
  Hauptversion-Mismatch mit `outcome:"rejected", reason:"Inkompatible
  Hauptversion: <x.y>"` ab — siehe §4 und Modul 07 Vertrag.
- Streichen oder Optional→Pflicht ist immer ein Hauptversions-Sprung.
- Unbekannte zusätzliche Felder werden bei `receiveLegacy` **nicht**
  abgewiesen — sie sind aber Teil der Signatur (jeder Knoten signiert,
  was er ausliefert).

#### Verifikations-Pfad (Empfänger, Reihenfolge verbindlich)

1. Pflichtfelder vollzählig in der LegacyMessage? → sonst
   `outcome:"rejected", reason:"Form ungültig"`.
2. `SbkimSpore.verifyForeignSpore(senderSpore)` valid? → sonst
   `outcome:"rejected", reason:"<deutsch>"` (reason aus dem
   verifyForeignSpore-Ergebnis durchgereicht).
3. Hauptversion `incomingLegacy.protocolVersion` kompatibel mit
   lokalem `PROTOCOL_VERSION`? → sonst `outcome:"rejected",
   reason:"Inkompatible Hauptversion: <x.y>"`.
4. LegacyMessage-Signatur über die kanonisch serialisierte Form ohne
   `signature` gegen `senderSpore.publicKey` verifiziert? → sonst
   `outcome:"rejected", reason:"Signatur ungültig"`.
5. `sbkim_legacy_inbox.put(fromNodeId, {fromNodeId, reason, signature,
   receivedAt: now()})` — der Eintrag landet im Inbox-Store, auch wenn
   der Sender kein bekanntes Geschwister war.
6. `sbkim_siblings.del(fromNodeId)` — Sender wird vergessen. Idempotent:
   bei unbekanntem Sender ohne Fehler.
7. Response `{outcome:"accepted", …}` mit Signatur kanonisch über die
   Form ohne `signature` gegen den eigenen Ed25519-Privat-Schlüssel.

Detail-Erklärung der Sender-Seite (Self-Apoptose, parallelisierter
Versand via `Promise.allSettled`, sequenzieller lokaler Cleanup) und
die Schritt-für-Schritt-Ebene liegen in
`docs/components/07_apoptose.md` § „Apoptose-Pfad".

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
| 2026-05-14 | Spec-Sitzung 05 | Modul 05 (Anastomose) spezifiziert. Fünf-Funktionen-API (`init/handshake/receiveHandshake/listSiblings/forgetSibling`), bidirektionale Eintragung nur bei beidseitigem Match, semantische Ablehnung ist Outcome (kein Throw), Protokoll-/Netz-/Krypto-Fehler werfen. Stores `sbkim_siblings` (peerNodeId → {nodeId, domain, endpoint, pubKey, since}) und `sbkim_anastomosis_log` (ts → {ts, peerId, outcome}) — anonymisiert. Reentry idempotent: `since` bleibt beim ersten Anklopf, Log bekommt `outcome:"re-handshake"`. Schwellwert wird ausschließlich über `SbkimMatch.isAboveProviderThreshold` gelesen (kein literales 0.80 in 05). §2 „Anfrage (Query)" verbindlich mit HandshakeRequest/HandshakeResponse-Schema gefüllt (kanonische Signatur, Pflicht-/Optional-Felder, Versionierungs-Regel auf §4 verwiesen, Verifikations-Pfad in sieben Schritten). Service-Worker-Vertrag für statisch gehostete Endknoten (POST `/sbkim/anastomosis`, JSON, ≤ 64 KiB, 503 wenn keine Page-Instanz aktiv); Wahl Page-Hosted vs. SW-Hosted vertagt auf Bau-Sitzung 05. Status auf `entwurf`. |
| 2026-05-14 | Spec-Sitzung 09 | Modul 09 (Einbau-PWA) spezifiziert. Karte 09 vollständig gefüllt — acht-Schritt Andock-Pfad mit konkreten Konsolen-Befehlen für Klaus (kein-Programmierer-Andocker), Datei-Pfad-Konvention verbindlich (SW im Endknoten-Repo-Root, fünf JS-Module inline in `index.html` oder unter `<endknoten>/sbkim/`), Spore-Endpunkt verbindlich `/sbkim/spore.json` (Alias aus §3 statt `.well-known/`, weil GitHub-Pages-Project-Sites Jekyll-Dot-Ordner-Falle haben), Service-Worker-Registrierungs-Konvention `navigator.serviceWorker.register("sbkim-sw.js")` aus dem Repo-Root mit automatischem Scope `/<repo>/`, Scope-Falle bei Ablage unter `sbkim/` dokumentiert. Sichtkontrolle (3 Pflicht-Punkte: Konsolen-Selbstchecks · IndexedDB-Stores · live-Spore-URL). `domainVector`-Pflicht-Frage aus Spec-Sitzung 05 verbindlich entschieden: **Variante A (Soft-Pflicht im Andock-Workflow, kein Hauptversions-Sprung)** — `domainVector` bleibt in §2 OPTIONAL, Karte 09 macht ihn Andock-Pflicht; §0 `PROTOCOL_VERSION` bleibt `"0.1"`. Begründung in Karte 09 § Risiken & offene Punkte. Status Modul 09 auf `entwurf` (Anleitung-Marker; Karten-Statuscodes formal für JS-Module). |
| 2026-05-14 | Spec-Sitzung 07 | Modul 07 (Apoptose) spezifiziert. Sechs-Funktionen-API (`init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings`); Self-Apoptose **irreversibel** und **zweistufig** mit 60s-Confirmation-Token (`APOPTOSE_TOKEN_TTL_MS = 60_000`, Modul-lokal) gegen versehentliches Auslösen, plus `console.warn` beim `prepare`-Aufruf; Quorum-Verfahren und Misstrauensvoten aus der ursprünglichen Schablone bewusst gestrichen — gehören in Modul 10 (Reputation, Schutz-Backlog). `receiveLegacy` wirft **niemals** (Outcome statt Throw, analog `verifyForeignSpore` und `receiveHandshake`). Vermächtnis-Versand parallel via `Promise.allSettled` mit `AbortController(QUERY_TIMEOUT_MS)` pro Empfänger — Trennung `recipientsNotified` (Empfänger antwortete `outcome:"accepted"`) und `recipientsFailed` (Timeout, Netz, ungültige Signatur, `rejected`). Lokaler Self-Apoptose-Cleanup sequenziell: siblings → log → inbox → spore → keys (Identität zuletzt); `sbkim_doku_meta` bleibt. §2 „Vermächtnis (Legacy)" verbindlich mit `LegacyMessage` (7 Pflichtfelder) und `LegacyResponse` (8 Pflichtfelder + `reason` als optionales `rejected`-Begleitfeld) gefüllt, kanonische Ed25519-Signatur identisch zu Spore / HandshakeRequest, Verifikations-Pfad in sieben Schritten. **§0 um `SIBLING_MAX_AGE_MS = 2592000000` (30 Tage) ergänzt** — Spec-Sitzung-7-Entscheidung Variante A (global statt modul-lokal, additiv, kein Hauptversions-Sprung; konsistent mit `PROVIDER_MIN_MATCH` / `QUERY_TIMEOUT_MS` / `PROTOCOL_VERSION`). TTL-Trigger Variante (c) — explizit durch den Andocker (z.B. nach jedem erfolgreichen Handshake oder auf einem Modul-00-Doku-Fenster-Knopf); **kein `setInterval`, kein Selbst-Sweep im `init()`**, keine Pulsation. Karte 09 Folge-Pflege-Sitzung „Schritt 9: TTL-Sweep-Aufruf" als offen vermerkt. `sbkim_legacy_inbox` als Schreib-Store; `sbkim_siblings` als Löscher-Store (Schreibrecht bleibt bei 05); `sbkim_anastomosis_log` als Leser-Store für die `lastActivity`-Berechnung pro Geschwister (max `ts` mit `outcome ∈ {"established","re-handshake"}`, Fallback `sbkim_siblings.since`). Status Modul 07 auf `entwurf`. |
