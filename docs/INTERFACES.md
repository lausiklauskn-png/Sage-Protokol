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
DOKU_REVEAL_WINDOW_MS  = 3000           // 3 Sekunden Zeitfenster für alle 5 Klicks; Modul 00, Spec-Sitzung 00
DOKU_QUOTA_WARN_RATIO  = 0.80           // Quota-Frühwarnung relativ; Modul 00, Spec-Sitzung 00 (auch Modul 01/02 Querschnitt „Spore-Persistenz")
DOKU_QUOTA_WARN_BYTES  = 52428800       // 50 MiB freier Speicher als zweite Quota-Frühwarnung absolut; Modul 00, Spec-Sitzung 00
BACKUP_FORMAT_VERSION    = 1            // Modul 02, Spec-Sitzung Backup-Export Stufe 2; Hauptversion des SbkimBackupBlob-Wrappers, additiv versioniert getrennt von PROTOCOL_VERSION und DB_VERSION
BACKUP_KDF_ITERATIONS    = 600000       // Modul 02, Spec-Sitzung Backup-Export Stufe 2; PBKDF2-SHA256-Iterations (OWASP 2023+, Pflicht-Frage 2 Variante b)
BACKUP_PASSWORD_MIN_LEN  = 8            // Modul 02, Spec-Sitzung Backup-Export Stufe 2; Mindestlänge des Backup-Passworts (untere Validierungs-Schwelle, keine Komplexitäts-Pflicht; siehe Karte 02 § Risiken „Passwort-Schwäche")
SIBLING_MAX_AGE_MS     = 2592000000     // 30 Tage; TTL für Modul 07 forgetExpiredSiblings
HETERO_MAX_ANCHORS     = 5              // max. Anker pro Heterokaryose-Response; Modul 06, Spec-Sitzung 06
HETERO_OUTBOX_MAX_ENTRIES = 5           // max. Anker in sbkim_hetero_outbox; Modul 08, Spec-Sitzung 08
                                        //   (konsistent mit HETERO_MAX_ANCHORS — was in der Outbox steht,
                                        //    geht beim nächsten Pull raus; größere Outbox hätte
                                        //    nicht-erreichbare Anker zur Folge)
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
Status: entwurf
Datei:  src/modules/00_doku_fenster.js

Bietet (öffentlich):
  init(options)                              → Promise<void>
  open()                                     → Promise<void>
  close()                                    → void
  isOpen()                                   → boolean
  getStatusSnapshot()                        → Promise<DokuStatus>
  recordSighttest(moduleId, result)          → Promise<void>

  options-Form: { searchIconSelector: string,
                  revealClicks?: number,
                  revealWindowMs?: number,
                  windowTitle?: string,
                  mountTarget?: HTMLElement }

  DokuStatus-Rückgabe-Form (relevante Felder; volle Form in
  docs/components/00_doku_fenster.md § Datenformate):
    { nodeId, nodeIdShort, ownSporePresent, domain, nodeType,
      protocolVersion,
      siblings[], siblingCount, legacy[], legacyCount,
      modules{}, quota|null,
      storagePersisted: boolean | null,    // Pflege Persistenz-Strategie verbinden 2026-05-16; aus SbkimStorage._meta.storagePersisted, fail-soft (null = Modul 01 nicht geladen / persist-API fehlt / persist warf/rejected); triggert die textliche Backup-Tipp-Zeile im Modal nur bei explizitem false (zusammen mit dem Quota-Frühwarnung-Trigger).
      openedAt, lastOpenedAt, errors[] }

  Modul 00 ist ein **reines Lese-/Trigger-Modul** im Endknoten:
  versteckte 5-Klick-Geste auf das Such-Symbol enthüllt ein modales
  Statusfenster mit dem Lauf-Zustand des Knotens. Kein Datenexport,
  kein Netz-Aufruf außerhalb dessen, was `SbkimApoptose` ohnehin
  auslöst (TTL-Sweep-Knopf ruft `SbkimApoptose.forgetExpiredSiblings`,
  das selbst kein Netz nutzt). Kein Self-Apoptose-Knopf — der gehört
  in Modul 08 (UI-Demo), nicht ins versteckte Doku-Fenster (Karte 07
  Begründung).

  Schlüssel-Schreib-Rolle: Modul 00 ist **alleiniger Schreiber** von
  `sbkim_doku_meta` (Karte 01 Vertrag).

Nutzt:
  SbkimStorage.init / get / put / all          (sbkim_doku_meta — Schreib- und Lese-Quelle)
                                                Pflicht-Abhängigkeit.
  SbkimStorage._meta.storagePersisted          Optional, Lesen, fail-soft (Pflege Persistenz-Strategie
                                                verbinden 2026-05-16). Modul 00 liest den Live-Wert
                                                im getStatusSnapshot — fehlender/wirft Getter → null.
                                                Trigger der textlichen Backup-Tipp-Zeile im Modal:
                                                explizites false (zusammen mit Quota-Frühwarnung).
                                                KEIN Schreib-Zugriff, KEIN Modul-02-Aufruf.
  SbkimSpore.getNodeId / getOwnSpore / getPublicKeyJwk
                                                Optional. Fail-soft: wenn das Modul nicht auf window
                                                ist oder NoIdentityError wirft, landet
                                                `nodeId:null`/`ownSporePresent:false` im Snapshot,
                                                kein Throw.
  SbkimAnastomose.listSiblings                  Optional, fail-soft (siblings:[], errors[]-Eintrag).
  SbkimApoptose.listLegacy                      Optional, fail-soft (legacy:[], errors[]-Eintrag).
  SbkimApoptose.forgetExpiredSiblings           Optional. Wird vom TTL-Sweep-Knopf aufgerufen mit
                                                SIBLING_MAX_AGE_MS aus §0. Knopf ist deaktiviert,
                                                wenn SbkimApoptose fehlt.
  Browser-API: navigator.storage.estimate()     Quota-Frühwarnung. Wenn API nicht verfügbar,
                                                quota:null im Snapshot, kein Fehler.
  DOM:
    document.querySelector(options.searchIconSelector)   click-Listener-Anker
    document.addEventListener("keydown")                 Esc → close()

Storage:
  Store: sbkim_doku_meta (aus Modul 01).
  Schreib-Schlüssel:
    "meta"             → { moduleId:"meta", schemaVersion:1, lastOpenedAt: ISO-8601 | null }
    "<modulId>"        → { moduleId: "01"|"02"|"03"|"04"|"05"|"07"|...,
                           lastSighttest: ISO-8601, status: "ok"|"fail" }
  Modul 00 schreibt ausschließlich diese beiden Schlüsselformen. Andere
  Module schreiben sbkim_doku_meta NICHT (Karte 01: "Schreiber 00").
  Lese-Rechte für sbkim_doku_meta: jedes Modul darf lesen (z.B. Modul
  08 für die UI-Werkstatt). Modul 00 hat keine Lese-Sperre.

Events:
  (keine — DOM-Click-Listener und Keyboard-Esc-Listener werden in
   init() registriert, ein Custom-Event-Pub/Sub gibt es nicht.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 00 DOKU-FENSTER bereit, Funktionen: init/open/close/isOpen/getStatusSnapshot/recordSighttest");
  Wie Modul 01 / 02 / 04 / 05 / 07 — keine Konstante in der Selbstcheck-
  Zeile. Reveal-Schwelle / Quota-Schwellen stehen in §0; sie werden in
  der Selbstcheck-Zeile bewusst nicht wiederholt.

Versionierungs- und Sichtbarkeits-Vertrag:
  - Modul 00 ist nicht protokoll-aktiv (kein Netz, keine Spore-
    Signatur, kein Vermächtnis). Es gibt keinen Hauptversions-Check
    in 00 — die §0-Konstanten werden beim Skript-Laden gelesen und
    in den Snapshot gespiegelt.
  - Sichtbarkeits-Persistenz: SESSION-ONLY (Entscheidung Spec-Sitzung
    00, Frage 3 Variante (a)). sbkim_doku_meta["meta"] hat KEIN
    visible-Feld; beim Tab-Schließen verliert Modul 00 seinen
    in-memory-Zustand; 5-Klick-Geste muss bei jedem PWA-Start neu
    ausgeführt werden.
  - `sbkim_doku_meta` ist additiv versioniert: das schemaVersion-
    Feld in `["meta"]` ist aktuell `1`. Eine Folge-Pflege-Sitzung
    (z.B. zur Einführung persistenter Sichtbarkeit nach Variante (b)
    oder (c)) darf das Feld zu `2` heben und neue Felder ergänzen.
    Modul 00 muss dann ältere Schemata akzeptieren (Migration im
    init()).

Fehlerverhalten:
  - init(): options.searchIconSelector fehlt / leerer String → InvalidDokuOptionsError (sync, vor DB)
  - init(): SbkimStorage nicht auf window                     → DokuDependenciesError
  - init(): SbkimStorage.init() wirft                         → unverändert durchgereicht
  - init(): searchIconSelector matcht aktuell kein Element    → console.warn, kein Throw; Re-Mount beim DOMContentLoaded
  - init(): zweimaliger Aufruf                                → idempotent (kein Doppel-Listener, keine Doppel-Meta-Anlage)
  - open(): Fenster bereits offen                             → idempotent, kein Re-Render
  - open(): SbkimStorage.put(sbkim_doku_meta,"meta",…) wirft → StorageQuotaError (Sammel-Klasse, Original in .cause)
  - open(): Spore/Anastomose/Apoptose-Lesefehler              → fail-soft (siehe Karte 00 § Fehlertabelle); Eintrag in DokuStatus.errors[]
  - open(): navigator.storage.estimate() nicht verfügbar      → quota:null im Snapshot, kein Throw
  - close(): Fenster nicht offen                              → idempotent, kein Fehler
  - getStatusSnapshot(): optionale Lese-Quelle wirft          → fail-soft (errors[]-Eintrag), kein Throw
  - getStatusSnapshot(): SbkimStorage-Lesefehler              → unverändert durchgereicht (Pflicht-Quelle)
  - recordSighttest(): result nicht "ok"/"fail"               → InvalidSighttestResultError (sync throw)
  - recordSighttest(): unbekannte moduleId                    → additiv, kein Fehler

  Vier benannte Error-Klassen (exportiert auf window.SbkimDoku.*):
    InvalidDokuOptionsError, DokuDependenciesError,
    InvalidSighttestResultError, StorageQuotaError

Garantien für Modul 08 / 12 und alle Bau-Sitzungen:
  - Schreibrecht auf `sbkim_doku_meta` liegt ausschließlich bei
    Modul 00. Wer in einer Bau-Sitzung Sichttests dort persistieren
    will, ruft `SbkimDoku.recordSighttest(moduleId, "ok"|"fail")` —
    keine direkten Storage.put-Aufrufe in den Store.
  - `DokuStatus` ist eine reine JSON-Form (keine Methoden, keine
    Closures). Module 08 (UI-Demo) und Modul 12 (Blocklist, später)
    dürfen die Form direkt rendern.
  - Modul 00 macht keine Netz-Aufrufe. `navigator.storage.estimate()`
    ist Browser-lokal; ein Crawler-Risiko besteht nicht.
  - Self-Apoptose-Knopf liegt NICHT in Modul 00 (bewusst). Wer in
    Modul 08 einen Self-Apoptose-Pfad anbieten will, muss das selbst
    bauen (Karte 07 § Schnittstelle: prepareSelfApoptose →
    confirmSelfApoptose mit 60 s Token).

Geprüft: 2026-05-14 (Spec-Sitzung 00), 2026-05-16 (Pflege Persistenz-Strategie verbinden — additive `storagePersisted`-Feld-Erweiterung in DokuStatus, neue Tipp-Zeile im Modal-Render-Pfad, kein Vertragsbruch)

---

### Modul: 01_storage
Status: entwurf
Datei:  src/modules/01_storage.js

Bietet (öffentlich):
  init(options?)                         → Promise<void>
  getStore(storeName: string)            → StoreHandle           // sync; wirft UnknownStoreError
  get(storeName, key: string)            → Promise<any | undefined>
  put(storeName, key: string, value)     → Promise<void>
  del(storeName, key: string)            → Promise<void>
  all(storeName)                         → Promise<Array<{key: string, value: any}>>
  clear(storeName)                       → Promise<void>

  options-Form: { dbSuffix?: string }
    dbSuffix optional. Wenn gesetzt, öffnet Modul 01 die DB unter dem
    Namen "sbkim_<dbSuffix>" statt der Default-DB "sbkim". Pattern:
    ^[a-z0-9_-]+$ (Kleinbuchstaben, Ziffern, '_', '-'); Verstösse werfen
    InvalidDbSuffixError SYNCHRON beim init-Aufruf (vor jedem Promise-
    Aufbau). dbSuffix muss beim ERSTEN init-Aufruf gesetzt werden — Modul
    05/06/07/00 rufen Storage.init() intern selbst nach (idempotent;
    abweichender Suffix bei späterem init wirft InvalidDbSuffixError).
    Anwendungsfall: GitHub-Pages-Project-Sites teilen Origin und damit
    IndexedDB; ohne Suffix kollidieren zwei Endknoten auf der DB "sbkim"
    und teilen sich die Identität (Pflege PWA-Suffix 2026-05-16).

Nutzt:
  (keine SBKIM-Module — Wurzelmodul, IndexedDB direkt)
  Browser-API: navigator.storage.persist()    Pflege Storage-Persist 2026-05-16.
                                              Nach erfolgreichem DB-Open
                                              fragt Modul 01 fail-soft an, ob der
                                              Browser den Speicher als persistent
                                              markiert (Chrome auto-bei-PWA,
                                              Firefox prompt, Safari restriktiv).
                                              Wenn die API fehlt oder das Promise
                                              rejectet, bleibt _meta.storagePersisted
                                              null — kein Throw, kein Reject.
                                              Persist-Verweigerung ist KEIN
                                              SBKIM-Bruchgrund; der Knoten läuft
                                              auch bei false weiter.

Storage:
  DB-Name:    "sbkim" (Default, ohne dbSuffix);
              "sbkim_<dbSuffix>" wenn init({dbSuffix}) gesetzt
              (Pflege PWA-Suffix 2026-05-16)
  DB-Version: 3          (Spec-Sitzung 08, 2026-05-15: additive Migration v=3 fügt sbkim_hetero_outbox hinzu;
                          v=2 aus Bau-Sitzung 06 unverändert)
  Stores:
    sbkim_keys              (Schlüssel "main";              Wert: {keyId, privateKey, publicKey})                                    — Schreiber 02       (v=1)
    sbkim_spore             (Schlüssel "main";              Wert: {nodeId, sporeJson, signature})                                    — Schreiber 02       (v=1)
    sbkim_siblings          (Schlüssel nodeId;              Wert: {nodeId, domain, endpoint, pubKey, since, heterokaryosisOptIn?})   — Schreiber 05, Co-Schreiber 08 (nur Feld heterokaryosisOptIn)   (v=1)
    sbkim_anastomosis_log   (Schlüssel ts;                  Wert: {ts, peerId, outcome})                                             — Schreiber 05, 06   (v=1)
    sbkim_legacy_inbox      (Schlüssel fromId;              Wert: {fromNodeId, reason, signature, receivedAt})                       — Schreiber 07       (v=1)
    sbkim_doku_meta         (Schlüssel modId;               Wert: {moduleId, lastSighttest, status})                                 — Schreiber 00       (v=1)
    sbkim_hetero_inbox      (Schlüssel "<peerNodeId>|<ts>"; Wert: {peerNodeId, ts, anchors, signature, receivedAt})                  — Schreiber 06       (v=2, Bau 06)
    sbkim_hetero_outbox     (Schlüssel label;               Wert: {label, vector, addedAt})                                          — Schreiber 08       (v=3, Spec 08)
  Alle Store-Namen mit SBKIM_STORE_PREFIX ("sbkim_"). Versionsmigrationen
  sind additiv; jede neue Spec, die einen Store hinzufügt, erhöht
  DB-Version um 1. Bestehende Klaus-PWAs mit DB-Version 1 oder 2 bekommen
  den jeweils fehlenden Store beim nächsten Lade über den
  onupgradeneeded-Pfad — additiv, kein Datenverlust.

  Schema-Hinweise:
    - sbkim_siblings.heterokaryosisOptIn ist additiv und optional
      (Spec-Sitzung 06). Modul 05 setzt das Feld NICHT; Modul 06 liest
      fail-soft (fehlend → default false). Haupt-Schreiber des Stores
      bleibt Modul 05 — Modul 08 ist Co-Schreiber AUSSCHLIESSLICH für
      das eine Feld heterokaryosisOptIn (Spec-Sitzung 08): Modul 08
      darf den Eintrag lesen, das eine Feld ändern und das gesamte
      Objekt zurückschreiben; legt aber KEINEN neuen Sibling-Eintrag
      an (UnknownSiblingError, wenn peerNodeId nicht in sbkim_siblings).
      Begründung: heterokaryosisOptIn ist Klaus-gesetzt, nicht 05-
      gesetzt — Modul 05 hat das Feld in seiner Schreiber-Disziplin
      bewusst nicht spezifiziert (Karte 05 unangetastet seit Spec-
      Sitzung 06). Die Co-Schreiber-Konvention ist eine kleine
      Vertrags-Erweiterung im Storage-Vertrag (Modul 01), nicht in
      Modul 05.
    - sbkim_anastomosis_log hat ab Spec-Sitzung 06 zwei Schreiber
      (05: established/rejected/re-handshake/timeout; 06: hetero-pulled/
      -served/-opt-out/-opt-out-local/-rejected/-timeout/-endpoint-
      unsupported). Modul 07's TTL-Sweep bleibt unverändert (er liest
      nur "established"/"re-handshake").
    - sbkim_hetero_inbox nutzt einen Komposit-Schlüssel
      "<peerNodeId>|<ts>" (Pipe-getrennt). Damit akkumulieren mehrere
      Pulls über die Zeit als Drift-Spur, ohne ältere Einträge zu
      überschreiben.
    - sbkim_hetero_outbox (Spec-Sitzung 08) nutzt label als Schlüssel
      (string ≤ 64 Zeichen, eindeutig pro Knoten). Doppelte
      addOutboxAnchor-Aufrufe mit gleichem Label überschreiben den
      Eintrag und aktualisieren addedAt. Max. HETERO_OUTBOX_MAX_ENTRIES
      Einträge (= 5, §0); ein sechster Anker mit neuem Label wirft
      OutboxFullError (kein automatisches Verdrängen — Klaus muss
      manuell aufräumen). Reihenfolge der Lese-Antwort in listOutbox:
      absteigend nach addedAt (neueste zuerst). Modul 06 ist Leser
      (fail-soft: Store leer oder nicht vorhanden → Fallback auf
      Spore-Single-Anker mit Label "(domain)"); der Lese-Pfad in
      src/modules/06_heterokaryose.js folgt in einer Folge-Pflege
      Bau 06.1 nach Spec-Sitzung 08.

Events:
  (keine — reine Datenzugriffsschicht, keine Pub/Sub)

Selbstcheck:
  Beim Skript-Laden (synchron, nicht in init):
    console.info("MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear");

Fehlerverhalten:
  - init({dbSuffix}) mit ungültigem Suffix     → InvalidDbSuffixError (SYNCHRON, vor Promise-Aufbau)
  - init({dbSuffix}) nach erstem init mit
    abweichendem Suffix                        → InvalidDbSuffixError (async, kein stilles Ignorieren)
  - Privatmodus / IDB nicht verfügbar          → init() rejects mit StorageUnavailableError
  - Unbekannter Store                          → UnknownStoreError (synchron bei getStore, async sonst)
  - Quota überschritten                        → QuotaExceededError (vom Browser durchgereicht)
  - Nicht-klonbarer Wert                       → DataCloneError
  - DB-Open scheitert                          → StorageOpenError (keine Auto-Reparatur)

Geprüft: 2026-05-14 (Spec-Sitzung 01+03), 2026-05-16 (Pflege PWA-Suffix Karten 01+09), 2026-05-16 (Pflege Storage-Persist Stufe 1)

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
  resetIdentityCache()                → void                     // sync, idempotent — leert In-Memory-identityCache;
                                                                    // Storage bleibt unangetastet (Aufgabe von Modul 01).
                                                                    // Aufrufer: externe Cleanup-Pfade, die sbkim_keys/
                                                                    // sbkim_spore selbst leeren (z.B. Modul 07
                                                                    // confirmSelfApoptose). Modul 02 erkennt Storage-
                                                                    // Cleanup nicht selbst und vertraut auf den Aufruf.
  exportBackup(password)              → Promise<SbkimBackupBlob>   // Spec-Sitzung Backup-Export Stufe 2 (2026-05-16).
                                                                    // Passwort-verschlüsselter Snapshot von sbkim_keys["main"]
                                                                    // + sbkim_spore["main"] + sbkim_siblings (alle Einträge,
                                                                    // fail-soft). Wrapper-Form siehe §2 Hinweis-Block +
                                                                    // Karte 02 § Datenformat „Backup-Format". Password-
                                                                    // Mindestlänge BACKUP_PASSWORD_MIN_LEN (§0), AES-GCM-256
                                                                    // mit PBKDF2-SHA256 BACKUP_KDF_ITERATIONS (§0).
                                                                    // Modul 02 prüft nur die Mindestlänge — Aufrufer-Pflicht
                                                                    // für die echte Passwort-Qualität.
  importBackup(blob, password, options?) → Promise<{ restored: boolean, reason?: string }>
                                                                    // Spec-Sitzung Backup-Export Stufe 2 (2026-05-16).
                                                                    // options-Form: { force?: boolean } (Default false).
                                                                    // Entschlüsselt + prüft Schema + schreibt Identität +
                                                                    // Geschwister zurück (sbkim_keys["main"] und
                                                                    // sbkim_spore["main"] overwrite; sbkim_siblings put-pro-
                                                                    // Eintrag additiv). Bei bestehender Identität und
                                                                    // options.force !== true → BackupOverwriteError
                                                                    // (Pflicht-Frage 3 Variante a — defensiv, Schutz vor
                                                                    // versehentlicher Identitäts-Auslöschung). Nach
                                                                    // restored=true ruft Modul 02 intern
                                                                    // resetIdentityCache().

  Singleton-Identität pro PWA: in beiden Stores (sbkim_keys und
  sbkim_spore) wird der feste Schlüssel "main" benutzt. Eine zweite
  Identität ist nicht Sache von Modul 02 — wer das will, legt eine
  neue PWA an.

  Schlüssel-Erzeugung ist lazy: passiert beim ersten
  getOrCreateIdentity()-Aufruf, nicht beim Skript-Laden.

Nutzt:
  SbkimStorage.init / get / put / all   (sbkim_keys["main"], sbkim_spore["main"];
                                         sbkim_siblings als Leser+Schreiber NUR im Backup-Pfad:
                                         exportBackup liest fail-soft alle Einträge,
                                         importBackup schreibt pro Sibling-Eintrag additiv.
                                         Hauptschreiber von sbkim_siblings bleibt Modul 05.)
  WebCrypto:
    crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign","verify"])
    crypto.subtle.exportKey("raw" | "jwk", key)
    crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, true, ["verify"])
    crypto.subtle.digest("SHA-256", bytes)
    crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes)
    crypto.subtle.verify({ name: "Ed25519" }, publicKey, sig, bytes)
    crypto.subtle.importKey("raw", utf8(password), {name:"PBKDF2"}, false, ["deriveKey"])
                                                  (Backup-Pfad, Spec-Sitzung Backup-Export Stufe 2)
    crypto.subtle.deriveKey({ name:"PBKDF2", salt, iterations: BACKUP_KDF_ITERATIONS,
                              hash:"SHA-256" }, baseKey,
                            { name:"AES-GCM", length: 256 }, false, ["encrypt","decrypt"])
                                                  (Backup-Pfad)
    crypto.subtle.encrypt({ name:"AES-GCM", iv }, aesKey, plaintext)
                                                  (Backup-Pfad — exportBackup)
    crypto.subtle.decrypt({ name:"AES-GCM", iv }, aesKey, ciphertext)
                                                  (Backup-Pfad — importBackup;
                                                   Auth-Tag-Fail → BackupDecryptError)
    crypto.getRandomValues(Uint8Array(16|12))    salt + iv für Backup-Pfad

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
    console.info("MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache/exportBackup/importBackup");
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
  - exportBackup / importBackup: password kürzer als BACKUP_PASSWORD_MIN_LEN (§0) oder leerer String
                                          → InvalidBackupPasswordError (synchron, vor Crypto-Aufruf)
  - exportBackup: keine Identität        → NoIdentityError aus dem getOrCreateIdentity-Pfad
  - importBackup: AES-GCM-Auth-Tag-Fail (falsches Passwort) oder korrupte Blob-Form (kein valides base64url,
                  JSON-Parse scheitert auf Klartext)
                                          → BackupDecryptError (Sammel-Klasse — Modul 02 unterscheidet
                                            absichtlich nicht zwischen „Passwort falsch" und „Datei
                                            beschädigt", kein Oracle für Angreifer)
  - importBackup: blob.version ≠ BACKUP_FORMAT_VERSION
                                          → BackupVersionMismatchError (kein Decrypt-Versuch)
  - importBackup: blob.payload-schema-version > eigene Schema-Version (nach Decrypt) oder Klartext-
                  Pflichtfeld fehlt (nodeId / keys.privateKey / keys.publicKey / spore)
                                          → BackupSchemaError
  - importBackup: sbkim_keys["main"] existiert UND options.force !== true
                                          → BackupOverwriteError (Pflicht-Frage 3 Variante a;
                                            Vor-Check vor Crypto). Recovery in leerer PWA greift
                                            ohne force, weil dort keine Identität existiert.

Garantien für Modul 05 / 06 / 07:
  - Singleton: getNodeId liefert über die gesamte Lebenszeit derselben
    PWA denselben String (solange IndexedDB-Speicher erhalten bleibt).
  - Verifikation eines fremden Spore-Strings ist seitenfrei rekonstruier-
    bar — kein Zustand außerhalb des übergebenen JSON-Blocks nötig.
  - Spore-Format ist additiv versioniert: neue Pflichtfelder erscheinen
    erst mit einem Hauptversions-Sprung in protocolVersion.
  - Cache-Konsistenz nach externem Storage-Cleanup: Modul 02 hält einen
    In-Memory-identityCache als Performance-Optimierung. Wer sbkim_keys/
    sbkim_spore von außen leert (Modul 07 confirmSelfApoptose, ggf.
    Modul 12 Blocklist später), MUSS unmittelbar danach
    SbkimSpore.resetIdentityCache() aufrufen — sonst liefern getNodeId/
    getPublicKeyJwk weiter die alte Identität aus dem Cache und der
    nächste storage-direkte Lookup (z.B. SbkimApoptose.loadOwnPrivateKey)
    wirft NoIdentityError trotz "frischer" Identität-Erwartung.

Geprüft: 2026-05-14 (Spec+Bau-Sitzung 02), 2026-05-15 (Pflege-Sitzung 02+07-Cache-Invalidate), 2026-05-15 (Bau 02 Stamm/Gast-Felder), 2026-05-16 (Spec-Sitzung Backup-Export Stufe 2), 2026-05-16 (Bau 02.X Backup-Export Code-Stub)

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
Status: entwurf
Datei:  src/modules/06_heterokaryose.js

Bietet (öffentlich):
  init()                                                       → Promise<void>
  requestHeterokaryosis(peerNodeId: string)                    → Promise<HeterokaryoseResult>
  receiveHeterokaryosis(incomingRequest: HeterokaryosisRequest)
                                                               → Promise<HeterokaryosisResponse>
  listHeterokaryosis()                                         → Promise<Array<{ peerNodeId, ts, anchorCount, receivedAt }>>
  forgetHeterokaryosis(peerNodeId: string, ts: string)         → Promise<void>

  Heterokaryose ist die *dritte Komposition* (nach Modul 05 und 07) aus
  01/02. Modul 06 rechnet nicht selbst — es liest `sbkim_siblings` als
  Quelle für „verbundene Geschwister" und für den additiven
  Opt-In-Filter, signiert kanonisch mit dem Ed25519-Schlüssel aus
  `sbkim_keys["main"]`, und schreibt empfangene Anker in
  `sbkim_hetero_inbox`. Modul 06 ruft `SbkimAnastomose.handshake`
  **NICHT** auf — der Heterokaryose-Pull ist ein eigener HTTP-POST
  gegen ENDPOINT.heterokaryosis (= "/sbkim/heterokaryosis" aus §3).

  Pull-Pattern verbindlich: der Initiator fragt, der Angefragte
  antwortet. Kein Push, keine Pulsation, keine Eigenanfrage ins offene
  Netz. Auslöser ist ausschließlich der Aufrufer (Modul 08 UI-Demo /
  Modul 00 Doku-Fenster später / Modul 09 Einbau-PWA in einer
  Folge-Sitzung).

  Beidseitiger Opt-In über das additive Feld
  `sbkim_siblings[peerNodeId].heterokaryosisOptIn: boolean` (default
  `false`, fail-soft wenn das Feld fehlt). Modul 05 setzt das Feld
  NICHT — Klaus setzt es pro Geschwister im Endknoten-UI (Modul 00
  Doku-Fenster oder Modul 08 UI-Demo, eigene Folge-Pflege). Sender
  prüft lokal vor Versand; Empfänger prüft serverseitig.

Nutzt:
  SbkimStorage.init / get / put / del / all     (sbkim_hetero_inbox als Schreiber;
                                                 sbkim_siblings als Leser für Opt-In-Filter und Sender-Lookup;
                                                 sbkim_anastomosis_log als Schreiber für hetero-* outcomes)
  SbkimSpore.init / getOrCreateIdentity / getOwnSpore / getNodeId / getPublicKeyJwk
                                                 (eigene Identität + Spore für Signatur)
  SbkimSpore.verifyForeignSpore                  (eingehende Sender-Spore prüfen — Signatur, id-Konsistenz, Hauptversion)
  WebCrypto via Modul 02:
    crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes)   (HeterokaryosisRequest / HeterokaryosisResponse signieren)
    crypto.subtle.verify({ name: "Ed25519" }, publicKey, sig, bytes)  (eingehende Signatur prüfen)
  fetch (POST) gegen sibling.endpoint + ENDPOINT.heterokaryosis ("/sbkim/heterokaryosis").
    AbortController(QUERY_TIMEOUT_MS = 4000) pro Pull.

Storage:
  Stores (alle aus Modul 01 — `sbkim_hetero_inbox` ist ein neuer Store
  und muss in der Bau-Sitzung 06 in Karte 01's Store-Vertrag ergänzt
  werden; bis dahin ist er ein **angekündigter Store** in dieser Spec):
    sbkim_hetero_inbox     (Schlüssel: `<peerNodeId>|<ts>`;
                            Wert: { peerNodeId, ts, anchors, signature, receivedAt })
                            — Schreiber 06, Leser 06/00/08
    sbkim_siblings         (Schlüssel: peerNodeId; Schreiber 05)
                            — Modul 06 ist hier LESER für:
                              - vorhanden? (Sibling-Filter beim Empfangen)
                              - heterokaryosisOptIn === true? (Opt-In-Filter
                                beidseits, fail-soft wenn Feld fehlt)
                            Schreibrecht hat WEITERHIN nur Modul 05.
                            Schema-Erweiterung um optionales Feld
                            `heterokaryosisOptIn: boolean` ist additiv;
                            Modul 05 setzt das Feld nicht, Modul 12
                            (Blocklist, Schutz-Backlog) wird es in
                            einer eigenen Spec-Sitzung berühren dürfen.
    sbkim_anastomosis_log  (Schlüssel: ts; Schreiber 05+06)
                            — Modul 06 schreibt zusätzliche outcome-Werte
                              (additiv zum bisherigen Vokabular aus Karte 05):
                                "hetero-pulled"              — A hat erfolgreich Anker empfangen
                                "hetero-served"              — B hat erfolgreich Anker ausgeliefert
                                "hetero-opt-out"             — B hat opt-out-Antwort gegeben
                                "hetero-opt-out-local"       — A hat lokale Vorprüfung gestoppt (kein Netz)
                                "hetero-rejected"            — Spore-/Versions-/Signatur-Fehler
                                "hetero-timeout"             — fetch-Timeout
                                "hetero-endpoint-unsupported" — HTTP 404 (Peer hat den Endpunkt nicht)
                              Modul 07's TTL-Sweep bleibt unverändert (es
                              liest nur "established"/"re-handshake"-Einträge
                              für die lastActivity-Berechnung). Modul 12 darf
                              die neuen outcome-Werte später konsumieren
                              (Anker-Vergiftungs-Detektion).
    sbkim_hetero_outbox    (Anker-Quelle; Spec-Wille Modul 06: vorbereitet
                            für Modul 08 / spätere Spec-Sitzung 02-Pflege,
                            **noch nicht spezifiziert**. Falls vorhanden,
                            liest Modul 06 ihn; sonst Fallback auf
                            Spore-Single-Anker mit Label "(domain)".
                            **Bau-Iteration 06 (2026-05-15) implementiert
                            ausschließlich den Spore-Single-Anker-Fallback**
                            — der Outbox-Store ist KEIN angemeldeter v=2-
                            Store; Spec-Sitzung 08 entscheidet, wie er
                            angelegt wird.)

  Vermerk an Karte 07 (Apoptose-Cleanup): Self-Apoptose-Cleanup-
  Reihenfolge muss in einer eigenen Folge-Pflege-Sitzung um
  `sbkim_hetero_inbox` ergänzt werden (vor `sbkim_spore`). Diese
  Spec-Sitzung 06 ändert Karte 07 NICHT.

Events:
  (keine — Service-Worker liefert eingehende /sbkim/heterokaryosis-
   Bodies via MessageChannel an receiveHeterokaryosis weiter, analog
   Modul 05 und Modul 07. Message-Typ: SBKIM_HETEROKARYOSIS_REQUEST.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 06 HETEROKARYOSE bereit, Funktionen: init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis");
  Wie Modul 01/02/04/05/07 — keine Schwelle/Konstante in der Selbstcheck-
  Zeile. HETERO_MAX_ANCHORS / ENDPOINT.heterokaryosis / Versions-Konstante
  stehen verbindlich in §0 / §3.

Versionierungs- und Heterokaryose-Vertrag:
  - Hauptversion-Mismatch zwischen lokaler PROTOCOL_VERSION und
    `incomingRequest.protocolVersion`: receiveHeterokaryosis antwortet
    HeterokaryosisResponse{outcome:"rejected",
    reason:"Inkompatible Hauptversion: <x.y>"}. Siehe §4.
  - HTTP 404 vom Empfänger → KEIN Throw beim Sender; landet als
    `outcome:"endpoint_unsupported"`. Drehbuchkonform für Geschwister
    mit älterem Protokoll-Stand.
  - Sibling-Filter: nur Geschwister aus `sbkim_siblings` werden bedient.
    Spore-Signatur allein reicht NICHT.
  - Opt-In-Filter beidseits: `heterokaryosisOptIn === true` muss auf
    BEIDEN Seiten gesetzt sein. Sender prüft lokal vor Versand,
    Empfänger prüft serverseitig.
  - Anker-Anzahl: max. HETERO_MAX_ANCHORS (= 5) pro Response.
  - Heterokaryose ist eine direkte Eins-zu-eins-Operation; Modul 06
    leitet empfangene Anker NICHT an seine eigenen Geschwister weiter.

Fehlerverhalten:
  - init(): Abhängigkeit fehlt (SbkimStorage/SbkimSpore nicht auf window)
        → HeterokaryoseDependenciesError
  - requestHeterokaryosis(): peerNodeId nicht in sbkim_siblings
        → UnknownSiblingError (kein Netz-Aufruf)
  - requestHeterokaryosis(): sibling.heterokaryosisOptIn !== true
        → KEIN Throw. Log "hetero-opt-out-local",
          return {outcome:"opt-out-local"}.
  - requestHeterokaryosis(): fetch-Timeout > QUERY_TIMEOUT_MS
        → HeterokaryoseTimeoutError, Log "hetero-timeout"
  - requestHeterokaryosis(): HTTP 404 vom Peer
        → KEIN Throw. Log "hetero-endpoint-unsupported",
          return {outcome:"endpoint_unsupported"}.
  - requestHeterokaryosis(): Netz-/CORS-/DNS-Fehler
        → HeterokaryoseNetworkError (cause: Original-Error)
  - requestHeterokaryosis(): Response-Signatur ungültig
        → HeterokaryoseSignatureInvalidError, Log "hetero-rejected"
  - requestHeterokaryosis(): outcome "opt-out" vom Peer
        → KEIN Throw. Log "hetero-opt-out",
          return {outcome:"opt-out"}.
  - requestHeterokaryosis(): outcome "rejected" vom Peer
        → KEIN Throw. Log "hetero-rejected",
          return {outcome:"rejected", reason}.
  - receiveHeterokaryosis(): jegliche Form-/Spore-/Versions-/Signatur-/
                             toNodeId-/Sibling-Filter-/Opt-In-Verletzung
        → WIRFT NIEMALS; HeterokaryosisResponse{outcome:"rejected"|"opt-out",
          reason?} (analog verifyForeignSpore, receiveHandshake,
          receiveLegacy).
  - receiveHeterokaryosis(): Storage-Fehler beim Lesen/Schreiben
        → WIRFT NIEMALS nach außen; Response outcome:"rejected",
          reason:"interner Speicherfehler"; Original-Error in
          console.error.
  - listHeterokaryosis() / forgetHeterokaryosis(): Storage-Fehler
        → unverändert durchgereicht.
  - forgetHeterokaryosis(): unbekannter Schlüssel
        → idempotent, wirft nicht.

Datenformate:
  HeterokaryosisRequest / HeterokaryosisResponse → §2 dieser Datei.
  sbkim_hetero_inbox-Wert → Karte 06 Block "Datenformate".
  Anker-Form {label: string, vector: number[384]} → Karte 06.
  sbkim_siblings[peerNodeId].heterokaryosisOptIn → Karte 06
  (additiv aus Spec-Sitzung 06).

Service-Worker-Vertrag (für statisch gehostete Endknoten):
  - Pfad: ENDPOINT.heterokaryosis ("/sbkim/heterokaryosis"), POST,
    Content-Type application/json, Body ≤ 64 KiB. Andere Methode → 405,
    falscher Content-Type → 415, zu groß → 413.
  - SW liest JSON-Body, ruft `SbkimHeterokaryose.receiveHeterokaryosis(body)`
    auf der aktiven PWA-Instanz auf, antwortet mit dem zurückgegebenen
    HeterokaryosisResponse als JSON (200).
  - Wenn keine PWA-Instanz aktiv: 503 Service Unavailable, kein Auto-
    Start, kein Wake-Lock.
  - Variante A (Page-Hosted) verbindlich, analog 05/07.

Garantien für Modul 07 / 08 / 10 / 11 / 12 / 14:
  - sbkim_hetero_inbox ist Einzige Quelle für „empfangene
    Heterokaryose-Anker"; Modul 08 / 10 / 12 dürfen davon ausgehen,
    dass jeder Eintrag eine valide Signatur durchlaufen hat (oder gar
    nicht angelegt wurde).
  - Modul 06 erzeugt keine eigenen Sibling-Listen, keine Pulsation,
    keine Eigenanfragen — der einzige Netz-Aufruf ist der
    explizite Pull bei `requestHeterokaryosis`.
  - Modul 06 schreibt sbkim_siblings NICHT — Schreibrecht bleibt bei
    Modul 05.
  - Modul 14 (Diffusion, Backlog) darf Modul 06 als Lead-Pool-
    Konsument betrachten: ein bekannter Geschwister-Hop liefert
    Anker, die einen späteren Lead-Match feinkörniger machen können
    (Spec-Sitzung 14 entscheidet die genaue Form, wenn die Schwelle
    erreicht ist).

Geprüft: 2026-05-15 (Spec-Sitzung 06), 2026-05-15 (Bau-Sitzung 06 — Code-Stub belegt; Anker-Quelle in der Erst-Bau-Iteration ausschließlich Spore-Single-Anker-Fallback / Degraded-Modus)

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
  SbkimSpore.resetIdentityCache                  (sync; Pflicht-Aufruf nach storage.clear(sbkim_keys/sbkim_spore)
                                                  im Self-Apoptose-Cleanup, sonst liefert getNodeId stale
                                                  Identität aus dem Modul-02-Cache. Pflege-Sitzung 2026-05-15.)
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
    sbkim_hetero_inbox     (Schreiber 06) — Modul 07 löscht den Store beim Self-Apoptose-Cleanup
                            (Position 4 in der Reihenfolge unten, additiv ab Bau-Sitzung 06
                            + Cleanup-Pflege 07, 2026-05-15).

  Reihenfolge des Self-Apoptose-Cleanup (sequenziell):
    1. sbkim_siblings        clear
    2. sbkim_anastomosis_log clear
    3. sbkim_legacy_inbox    clear
    4. sbkim_hetero_inbox    clear   ← neu zwischen Schritt 3 und Schritt 5 (Bau-Sitzung 06 +
                                       Cleanup-Pflege 07, 2026-05-15). Position vor der
                                       Identitäts-Schicht (spore/keys): Heterokaryose-Inbox-
                                       Einträge haben keinen Eigen-Wert ohne die Identität.
    5. sbkim_spore           clear
    6. sbkim_keys            clear   ← zuletzt; Identität ist die letzte Bastion
    7. SbkimSpore.resetIdentityCache()
                                     ← Cache-Invalidate; ohne diesen Schritt
                                       liefert SbkimSpore.getNodeId weiter die
                                       alte nodeId aus dem identityCache,
                                       trotz leerem Storage. Pflicht ab
                                       Pflege-Sitzung 2026-05-15. Vertrag: ein
                                       Modul, das sbkim_keys/sbkim_spore von
                                       außen leert, MUSS resetIdentityCache
                                       unmittelbar danach rufen.
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
Status: entwurf
Datei:  src/modules/08_ui_demo.js

Bietet (öffentlich):
  init(options)                                          → Promise<void>
  listOutbox()                                           → Promise<Array<{ label: string, addedAt: string }>>
  addOutboxAnchor(label: string, vector: number[384])    → Promise<void>
  removeOutboxAnchor(label: string)                      → Promise<void>
  setSiblingHeteroOptIn(peerNodeId: string, optIn: boolean)
                                                         → Promise<void>

  options-Form: { storeName?: string,
                  labelMaxLen?: number,
                  embeddingDim?: number,
                  maxEntries?: number }

  Modul 08 ist die **Endknoten-Andocker-UI für Outbox- und Opt-In-
  Pflege**. Es ist KEIN universelles UI-Framework und KEINE
  tests/manual_check.html-Werkstatt (siehe Karte 08 § Modul-08-
  Rollenwahl). Klaus pflegt damit zwei Stellen, die Modul 06
  (Heterokaryose) braucht, aber nicht selbst füllt:
    (1) sbkim_hetero_outbox — Anker-Vorrat, den Modul 06 als
        HeterokaryosisResponse-anchors[] liefert (Fallback Spore-
        Single-Anker, wenn Store leer / nicht vorhanden);
    (2) sbkim_siblings[peerNodeId].heterokaryosisOptIn — additives
        Opt-In-Flag pro Geschwister (Modul 05 setzt es nicht, Modul
        08 ist Co-Schreiber für genau dieses Feld).

  Modul 08 ist NICHT protokoll-aktiv: kein Netz-Aufruf, kein
  Embedding, keine Signatur, kein Match, kein Heterokaryose-Pull.
  Es schreibt lokal in zwei Stores (sbkim_hetero_outbox als
  Allein-Schreiber, sbkim_siblings als Co-Schreiber für ein Feld)
  und liest sie. DOM-Pflege liegt beim Endknoten.

  Self-Apoptose-Knopf liegt NICHT in Modul 08 (Spec-Sitzung 08-
  Entscheidung; Karte 08 § Risiken — eigene Spec-Sitzung 08.2 darf
  das später nachholen). Karte 07 § Schnittstelle bleibt die
  einzige spezifizierte Self-Apoptose-API (prepareSelfApoptose →
  60 s Token → confirmSelfApoptose).

Nutzt:
  SbkimStorage.init / get / put / del / all     (sbkim_hetero_outbox als Schreiber;
                                                 sbkim_siblings als Co-Schreiber NUR für
                                                 das Feld heterokaryosisOptIn — Modul 08
                                                 liest den Eintrag, ändert das eine Feld,
                                                 schreibt zurück; Pflicht-Abhängigkeit)
  (keine anderen Module — kein SbkimSpore, kein SbkimEmbedding,
   kein SbkimAnastomose, kein SbkimHeterokaryose. Vektor-Erzeugung
   ist Aufrufer-Pflicht: typisch SbkimEmbedding.embedPassage(label)
   im Endknoten-UI-Code, bevor addOutboxAnchor gerufen wird.)

Storage:
  Stores (alle aus Modul 01):
    sbkim_hetero_outbox    (Schlüssel: label;
                            Wert: { label, vector, addedAt })
                            — Schreiber 08, Leser 06.
                            Max. HETERO_OUTBOX_MAX_ENTRIES Einträge
                            (= 5, §0). Reihenfolge in listOutbox:
                            absteigend nach addedAt (neueste zuerst).
                            Doppelte addOutboxAnchor mit gleichem
                            Label überschreiben.
    sbkim_siblings         (Schlüssel: peerNodeId; Haupt-Schreiber: 05)
                            — Modul 08 ist CO-SCHREIBER NUR für das
                              additive Feld heterokaryosisOptIn:
                              setSiblingHeteroOptIn liest den
                              Eintrag, ändert das eine Feld, schreibt
                              zurück. Wenn der Eintrag fehlt:
                              UnknownSiblingError (kein neuer
                              Sibling-Eintrag). Schreibrecht für die
                              anderen Felder (nodeId, domain, endpoint,
                              pubKey, since) liegt WEITERHIN nur bei
                              Modul 05. Begründung: heterokaryosisOptIn
                              ist Klaus-gesetzt im Endknoten-UI
                              (Spec-Sitzung 06 § Verantwortlichkeiten);
                              Modul 05 hat das Feld in seiner Schreiber-
                              Disziplin bewusst nicht spezifiziert.
                              Die Co-Schreiber-Konvention ist eine
                              kleine Vertrags-Erweiterung in Modul 01,
                              keine Modul-05-API-Änderung.

Events:
  (keine — Modul 08 ist API-Schicht ohne DOM-Listener-Registrierung.
   DOM-Pflege liegt beim Endknoten.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 08 UI-DEMO bereit, Funktionen: init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn");
  Wie Modul 00/01/02/04/05/06/07 — keine Konstante in der Selbstcheck-
  Zeile. HETERO_OUTBOX_MAX_ENTRIES / EMBEDDING_DIM stehen verbindlich
  in §0; OUTBOX_LABEL_MAX_LEN = 64 ist modul-lokal in Karte 08.

Versionierungs- und Sichtbarkeits-Vertrag:
  - Modul 08 ist nicht protokoll-aktiv (kein Netz, keine Signatur,
    keine Spore-Erzeugung). Es gibt keinen Hauptversions-Check in 08 —
    die §0-Konstanten (HETERO_OUTBOX_MAX_ENTRIES, EMBEDDING_DIM)
    werden beim Skript-Laden bzw. init() gelesen.
  - sbkim_hetero_outbox-Schema ist additiv versioniert. Eine spätere
    Spec-Sitzung darf addedAt um Begleitfelder erweitern (z.B.
    sourceModuleId für Audit); Modul 06 als Leser muss dann ältere
    Schemata akzeptieren.

Fehlerverhalten:
  - init(): SbkimStorage nicht auf window               → UiDemoDependenciesError
  - init(): SbkimStorage.init() wirft                   → unverändert durchgereicht
  - init(): zweimaliger Aufruf                          → idempotent
  - listOutbox(): Store leer                            → leeres Array, kein Fehler
  - listOutbox(): SbkimStorage.all() wirft              → unverändert durchgereicht
  - addOutboxAnchor(): label leer / nicht-string / > OUTBOX_LABEL_MAX_LEN
                                                         → InvalidAnchorLabelError (sync throw)
  - addOutboxAnchor(): vector nicht Array / länge ≠ EMBEDDING_DIM /
                       ein Wert nicht Number.isFinite   → InvalidAnchorVectorError (sync throw)
  - addOutboxAnchor(): Store voll (HETERO_OUTBOX_MAX_ENTRIES), label NEU
                                                         → OutboxFullError (kein Verdrängen)
  - addOutboxAnchor(): Store voll, label existiert      → überschreibt, kein Fehler
  - addOutboxAnchor(): Quota überschritten              → SbkimStorage.put wirft QuotaExceededError durch
  - removeOutboxAnchor(): label leer / nicht-string     → InvalidAnchorLabelError (sync throw)
  - removeOutboxAnchor(): label existiert nicht         → idempotent, kein Fehler
  - setSiblingHeteroOptIn(): peerNodeId nicht in sbkim_siblings
                                                         → UnknownSiblingError (Modul 08 legt KEINEN Eintrag an)
  - setSiblingHeteroOptIn(): optIn nicht strikt Boolean → InvalidOptInArgError (sync throw)
  - setSiblingHeteroOptIn(): Storage-Lese-/Schreibfehler → unverändert durchgereicht

  Sechs benannte Error-Klassen (exportiert auf window.SbkimUiDemo.*):
    UiDemoDependenciesError, InvalidAnchorLabelError,
    InvalidAnchorVectorError, OutboxFullError, UnknownSiblingError,
    InvalidOptInArgError

  Hinweis: UnknownSiblingError trägt denselben Namen wie in Modul 06.
  Das ist Spec-Wille — die Bedeutung ist identisch ("peerNodeId
  nicht in sbkim_siblings"). Modul-Zugehörigkeit erkennbar über
  window.SbkimUiDemo.UnknownSiblingError vs.
  window.SbkimHeterokaryose.UnknownSiblingError.

Datenformate:
  sbkim_hetero_outbox-Wert     → Karte 08 § Datenformate.
  addOutboxAnchor-Argument-Form → Karte 08 § Datenformate
                                  (label ≤ OUTBOX_LABEL_MAX_LEN,
                                   vector number[EMBEDDING_DIM],
                                   alle Werte Number.isFinite).
  setSiblingHeteroOptIn-Argument-Form → Karte 08 § Datenformate
                                  (peerNodeId muss in sbkim_siblings
                                   existieren, optIn strikt Boolean).

Garantien für Modul 06 / 09:
  - sbkim_hetero_outbox ist die einzige Anker-Quelle, die Modul 06
    über den Spore-Single-Anker hinaus liest. Solange der Store leer
    oder nicht vorhanden ist, fällt Modul 06 fail-soft auf den
    Spore-Single-Anker zurück (Bau-Iteration 06 / 2026-05-15
    implementiert ausschließlich diesen Fallback). Folge-Pflege Bau
    06.1 (Outbox-Lese-Pfad in src/modules/06_heterokaryose.js) ist
    nach Spec-Sitzung 08 fällig — NICHT Teil der Spec-Sitzung 08.
  - Modul 06 darf davon ausgehen, dass jeder Outbox-Eintrag eine
    valide Vektor-Form hat (Länge EMBEDDING_DIM, finite Zahlen).
    Modul 08 prüft das beim Schreiben; Modul 06 vertraut beim Lesen.
  - sbkim_siblings.heterokaryosisOptIn wird ausschließlich durch
    Modul 08 (Co-Schreiber) gesetzt. Modul 06 liest fail-soft
    (fehlend → false). Modul 05 berührt das Feld weiterhin nicht.
  - Karte 09 (Einbau-PWA) kann Modul 08 als optionalen 10. Schritt
    in den Andock-Pfad aufnehmen (Endknoten ruft SbkimUiDemo.init()
    nach SbkimDoku.init()); eigene Pflege-Sitzung Karte 09.

Geprüft: 2026-05-15 (Spec-Sitzung 08)

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
stammCategories     : string[]                Kerngebiet-Kategorien des Knotens (siehe ARCHITEKTUR.md §8).
                                              Beispiel Mixarium: ["Cocktails", "Mocktails", "Limonaden"].
                                              Beispiel Rezeptbuch: ["Vorspeisen", "Fleisch", "Fisch", "Vegetarisch"].
                                              Sortier-Reihenfolge frei wählbar; kanonische JSON-Sortierung
                                              sortiert nur Object-Keys, nicht Array-Elemente.
guestCategories     : string[]                Begleit-Kategorien (UI-Label: "Überraschungs-Plus").
                                              Beispiel Mixarium: ["Knabbereien", "Fingerfood"].
                                              Beispiel Rezeptbuch: ["Begleitgetränke", "Weinkarte"].
                                              Disjunkt zu stammCategories (kein Element in beiden Listen);
                                              das ist Hosting-Pflicht des Knotens, kein Empfänger-Check.
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

**Backup-Format ist separat** (Spec-Sitzung Backup-Export Stufe 2,
2026-05-16): Die `SbkimBackupBlob`-Form von `SbkimSpore.exportBackup` /
`importBackup` ist **kein** Teil der Spore und wird **nicht** über das
Netz transportiert. Spore und Backup teilen sich nur den Identitäts-
Schlüssel-Inhalt (das `keys`-Material aus `sbkim_keys["main"]` plus
die persistierte `sporeJson` aus `sbkim_spore["main"]`); das Wrapper-
Schema (PBKDF2/AES-GCM-Block, eigene additive
`BACKUP_FORMAT_VERSION = 1` aus §0) lebt auf einer separaten Schicht
und ist in §1 Modul 02 Bietet-Block + `docs/components/02_spore.md`
§ Datenformat „Backup-Format (SbkimBackupBlob)" verbindlich. Eine
Spore-Feld-Erweiterung gibt es **nicht**; `PROTOCOL_VERSION` bleibt
`"0.1"`.

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

### Heterokaryose (Pull)

Verbindliches Schema des Heterokaryose-Pulls, festgelegt in der
Spec-Sitzung 06 vom 2026-05-15. Heterokaryose ist **Pull-basiert**: der
Initiator A schickt `HeterokaryosisRequest` an einen bereits
verbundenen Geschwister-Knoten B (POST gegen
`sibling.endpoint + ENDPOINT.heterokaryosis` (= dem
`/sbkim/heterokaryosis`-Pfad aus §3), `Content-Type: application/json`).
Antwort = `HeterokaryosisResponse` (unten). Beide JSON-Objekte sind
**kanonisch** serialisiert (alphabetisch sortierte Keys, rekursiv); die
Signatur deckt die Form **ohne** das `signature`-Feld. Sign-/Verify-Pfad
**identisch** zu Spore (Modul 02), HandshakeRequest (Modul 05) und
LegacyMessage (Modul 07).

#### HeterokaryosisRequest — Pflichtfelder

```
fromNodeId       : string   = nodeId des Senders A (= base64url(sha256(rawPub)), ohne Padding)
nonce            : string   16 zufällige Bytes, base64url ohne Padding (Replay-Marker; Modul 06
                            prüft in der Erst-Spec noch nicht aktiv auf Wiederholung — aktiver
                            Replay-Schutz gehört in Modul 11, vgl. Karte 06 Risiken-Block).
protocolVersion  : string   semver-artig, z.Z. "0.1" (aus §0). Hauptversions-Mismatch zwischen
                            incomingRequest.protocolVersion und lokaler PROTOCOL_VERSION → outcome:
                            "rejected", reason:"Inkompatible Hauptversion: <x.y>". Siehe §4.
senderSpore      : object   vollständige SporeJson des Senders, vom Sender mit Ed25519 signiert
                            (siehe oben „Spore-JSON"). Empfänger verifiziert über
                            SbkimSpore.verifyForeignSpore.
signature        : string   base64url ohne Padding, Ed25519 über kanonisches JSON ohne signature.
                            Schlüssel: privateKey des Senders (Modul 02). Empfänger verifiziert
                            gegen senderSpore.publicKey.
timestamp        : string   ISO-8601 mit Millisekunden, UTC ("Z"). Vom Sender beim Bauen gesetzt.
toNodeId         : string   = nodeId des erwarteten Empfängers B. PFLICHT (anders als bei
                            HandshakeRequest, wo es optional ist). Ohne toNodeId kann der
                            Empfänger den sbkim_siblings-Lookup nicht durchführen.
                            Mismatch zu getNodeId() → outcome:"rejected",
                            reason:"toNodeId stimmt nicht zum Empfänger".
```

#### HeterokaryosisResponse — Pflichtfelder

```
fromNodeId       : string   nodeId des Empfängers B
nonceEcho        : string   identisch zu incomingRequest.nonce (Replay-Verkettung; in Erst-Spec
                            rein informativ, in einer Folge-Spec für aktiven Replay-Schutz nutzbar)
outcome          : string   "shared" | "opt-out" | "rejected"
protocolVersion  : string   "0.1"
receiverSpore    : object   vollständige SporeJson des Empfängers B (signiert)
signature        : string   Ed25519-Signatur über kanonisches JSON ohne signature, mit dem
                            privateKey des Empfängers.
timestamp        : string   ISO-8601 UTC, Empfänger beim Bauen
toNodeId         : string   nodeId des Senders (= incomingRequest.fromNodeId)
```

#### HeterokaryosisResponse — Optionale Felder

```
anchors          : Anchor[]   Pflicht bei outcome="shared", sonst weggelassen.
                              Max. HETERO_MAX_ANCHORS Einträge (= 5 aus §0).
                              Jeder Anchor: {label: string (≤ 64 Zeichen),
                                             vector: number[384] (L2-normalisiert)}.
                              Reihenfolge bedeutsam (Sender ordnet sinnvoll, z.B. nach
                              Relevanz oder addedAt). Anker tragen keine Eigen-Signatur —
                              die Response-Signatur deckt das ganze JSON inklusive anchors.
reason           : string     Pflicht bei outcome="rejected", sonst weggelassen.
                              Bei outcome="opt-out" weggelassen (minimale Antwort).
                              Beispiele: "Form ungültig", "Spore ungültig: <inner reason>",
                              "Inkompatible Hauptversion: 1.0", "Request-Signatur ungültig",
                              "toNodeId stimmt nicht zum Empfänger",
                              "Sender ist kein Geschwister", "interner Speicherfehler".
```

#### Versionierungs-Regel

- Pflichtfelder dürfen ab Status `entwurf` nur additiv erweitert
  werden. Das Hinzufügen eines Pflichtfelds erfordert den Schritt von
  `protocolVersion: "0.x"` auf `"1.0"`.
- Hauptversionen (1.x ↔ 2.x): inkompatibel. Empfänger lehnt
  Hauptversion-Mismatch mit `outcome:"rejected", reason:"Inkompatible
  Hauptversion: <x.y>"` ab — siehe §4 und Modul 06 Vertrag.
- Streichen oder Optional→Pflicht ist immer ein Hauptversions-Sprung.
- Unbekannte zusätzliche Felder werden bei `receiveHeterokaryosis`
  **nicht** abgewiesen — sie sind aber Teil der Signatur (jeder Knoten
  signiert, was er ausliefert).
- Hinzufügen eines neuen `outcome`-Wertes (z.B. `"throttled"` für Modul
  11) ist additiv, kein Hauptversions-Sprung — Konsumenten, die den
  neuen Wert nicht kennen, behandeln ihn wie `"rejected"` (Default-
  Fallback).

#### Verifikations-Pfad (Empfänger, Reihenfolge verbindlich)

1. Pflichtfelder vollzählig im HeterokaryosisRequest? → sonst
   `outcome:"rejected", reason:"Form ungültig"`.
2. `SbkimSpore.verifyForeignSpore(senderSpore)` valid? → sonst
   `outcome:"rejected", reason:"<deutsch>"` (reason aus dem
   verifyForeignSpore-Ergebnis durchgereicht).
3. Hauptversion `incomingRequest.protocolVersion` kompatibel mit
   lokalem `PROTOCOL_VERSION`? → sonst `outcome:"rejected",
   reason:"Inkompatible Hauptversion: <x.y>"`.
4. Request-Signatur über die kanonisch serialisierte Form ohne
   `signature` gegen `senderSpore.publicKey` verifiziert? → sonst
   `outcome:"rejected", reason:"Request-Signatur ungültig"`.
5. `incomingRequest.toNodeId === getNodeId()` (eigene nodeId)? → sonst
   `outcome:"rejected", reason:"toNodeId stimmt nicht zum Empfänger"`.
6. `senderId = senderSpore.id; siblingEntry =
   sbkim_siblings.get(senderId)`. Wenn `siblingEntry` fehlt → sonst
   `outcome:"rejected", reason:"Sender ist kein Geschwister"`.
7. `siblingEntry.heterokaryosisOptIn === true` (fail-soft: fehlend →
   false)? → sonst `outcome:"opt-out"` (KEIN `reason`-Detail —
   minimale Antwort), Log `"hetero-opt-out"`.
8. Sonst: Anker-Quelle lesen (siehe Karte 06 § Anker-Quelle, max.
   HETERO_MAX_ANCHORS Einträge), Response
   `{outcome:"shared", anchors, receiverSpore, …}` mit Signatur
   kanonisch über die Form ohne `signature`. Log `"hetero-served"`.

Detail-Erklärung der Sender-Seite (Pull-Initiierung, lokale Vorprüfung,
fetch mit AbortController, Outcome-Verarbeitung, Inbox-Persistenz) und
die Schritt-für-Schritt-Ebene liegen in
`docs/components/06_heterokaryose.md` § „Heterokaryose-Pfad".

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
| 2026-05-14 | Spec-Sitzung 00 | Modul 00 (Doku-Fenster) spezifiziert. Sechs-Funktionen-API (`init/open/close/isOpen/getStatusSnapshot/recordSighttest`); reines Lese-/Trigger-Modul im Endknoten — alleiniger Schreiber von `sbkim_doku_meta` (Schlüssel `"meta"` für Modul-Meta + `"<modulId>"` für Sichttest-Spur pro Modul); Lese-Quellen `SbkimSpore.{getNodeId,getOwnSpore,getPublicKeyJwk}`, `SbkimAnastomose.listSiblings`, `SbkimApoptose.listLegacy`, plus `navigator.storage.estimate()` für die Quota-Frühwarnung — alle optional, fail-soft (`errors[]`-Eintrag im Snapshot statt Throw); Pflicht-Abhängigkeit nur `SbkimStorage`. **Drei Pflichtfragen verbindlich entschieden:** Frage 1 Variante (a) **5 Klicks auf Such-Symbol innerhalb 3 s Zeitfenster** (neue §0-Konstante `DOKU_REVEAL_WINDOW_MS = 3000`); Frage 2 Doppel-Schwelle **`DOKU_QUOTA_WARN_RATIO = 0.80` UND `DOKU_QUOTA_WARN_BYTES = 52428800` (50 MiB)** in §0 (additiv, kein Hauptversions-Sprung — konsistent zum Querschnitts-Anker „Spore-Persistenz-Strategie verteilt"); Frage 3 Variante (a) **Sichtbarkeits-Session-only** (kein `visible`-Feld in `sbkim_doku_meta`, 5-Klick-Geste bei jedem PWA-Start neu). **§0 um drei Konstanten erweitert** (`DOKU_REVEAL_WINDOW_MS`, `DOKU_QUOTA_WARN_RATIO`, `DOKU_QUOTA_WARN_BYTES`; `status.json.config` zieht mit). TTL-Sweep-Knopf nutzt `SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)` ohne API-Erweiterung — schließt offene Frage aus Spec-Sitzung 07 (Karte 09 Schritt 9 TTL-Sweep) zur **Hälfte** (manueller Trigger ja, Andocker-Automatik bleibt offen). Vermächtnis-Inbox-Anzeige nutzt `SbkimApoptose.listLegacy()` (Karte 07 Schnittstelle) — keine Detail-View, keine `signature`-Anzeige (Spec-Wille). **Self-Apoptose-Knopf bewusst NICHT in Modul 00** — Karte 07 hat Self-Apoptose als zweistufig+irreversibel spezifiziert; gehört in Modul 08 (UI-Demo) oder einen separaten Endknoten-Pfad. Datenform `DokuStatus` reines JSON (kein Methoden-Objekt) — Schlüsselfelder: `nodeId`/`nodeIdShort`, `ownSporePresent`, `domain`, `nodeType`, `siblings[]`/`siblingCount`, `legacy[]`/`legacyCount`, `modules{}` (Sichttest-Map), `quota{usage,quota,ratio,freeBytes,warnRatio,warnBytes,warningLevel}`, `openedAt`/`lastOpenedAt`, `errors[]`. Vier benannte Error-Klassen (`InvalidDokuOptionsError`, `DokuDependenciesError`, `InvalidSighttestResultError`, `StorageQuotaError`). Karte 09 Folge-Pflege-Sitzung muss Modul 00 in den Andock-Pfad als Schritt 9 ergänzen (Andocker ruft `SbkimDoku.init({searchIconSelector:...})`); Spec-Sitzung 00 stellt die API bereit. Status Modul 00 auf `entwurf`. |
| 2026-05-14 | Bau-Sitzung 00 | Modul 00 Code geschrieben (`src/modules/00_doku_fenster.js`), Status Modul 00 bleibt `entwurf` (Spec-Vertrag unverändert). IIFE mit `window.SbkimDoku`, sechs öffentliche Funktionen, vier benannte Error-Klassen (`InvalidDokuOptionsError`, `DokuDependenciesError`, `InvalidSighttestResultError`, `StorageQuotaError` als Sammel-Klasse mit `.cause`), fünf Test-Brücken (`_dispatchClick`, `_resetClickCounter`, `_advanceRevealClock`, `_setQuotaForTest`, `_clearQuotaForTest`). **Drei Bau-Pflichtfragen entschieden:** (1) Render-Stil **Modal mit halb-transparentem Backdrop** (`position:fixed;inset:0;background:rgba(0,0,0,0.55)`), Klassenpräfix `sbkim-doku-*`, Klick-auf-Backdrop schließt; (2) späte DOM-Mount-Strategie **`MutationObserver` auf `document.body`** mit Auto-Disconnect bei Match und 10-s-Safety-Timeout (`console.warn` + Selbst-Disconnect, kein Throw); (3) Panel-00-Fake-Such-Symbol als eigenes `<button id="panel-00-fake-search">` im Markup für sichtbares Klaus-Klicken, `_dispatchClick()` simuliert für Test 2 / 3 automatisch reale `MouseEvent("click")`-Dispatches. 5-Klick-Geste: Klick 1 startet `setTimeout(reset, revealWindowMs)` mit `revealStartedAt`-Merker, Klicks 2–4 zählen ohne Timer-Reset, Klick 5 cancelt Timer und ruft `open()` async (Fehler in `console.error`); `_advanceRevealClock(ms)` cancelt + Reset wenn `elapsed >= revealWindowMs`, sonst Timer mit Restzeit neu setzen — ohne realen Zeitverlauf. Esc-Listener global registriert, feuert nur bei offenem Fenster; `close()` synchron + idempotent, setzt Klickzähler auf 0; `open()` async + idempotent, baut Snapshot, aktualisiert `sbkim_doku_meta["meta"].lastOpenedAt` (Storage-Fehler hier → `StorageQuotaError` mit `.cause`, Fenster öffnet sich dann nicht). `getStatusSnapshot()` sammelt fail-soft via einzelne try/catch (jeder Lese-Quellen-Fehler landet als `{source, reason}` in `errors[]`, kein Throw); Pflicht-Quelle `sbkim_doku_meta` wird unverändert durchgereicht. `recordSighttest(moduleId, result)` synchron-prüft `result ∈ {"ok","fail"}` und schreibt `sbkim_doku_meta[moduleId]`; Modul 00 strikt alleiniger Schreiber dieses Stores (kein `indexedDB.open` in 00, Persistenz immer über `SbkimStorage`). Synchroner Selbstcheck beim Skript-Laden (`MODUL 00 DOKU-FENSTER bereit, Funktionen: init/open/close/isOpen/getStatusSnapshot/recordSighttest`). Panel 00 in `tests/manual_check.html` von „noch nicht gebaut" auf 🟦 Code-Stub mit sechs Knöpfen (Setup; Test 2 5-Klick-Simulation; Test 3 4-Klick + `_advanceRevealClock(4000)` + 5. Klick → Fenster bleibt zu; Test 4 Quota-Warnzeile via `_setQuotaForTest({usage:81,quota:100})` → `warningLevel:"ratio"`, DOM-Warnblock im Modal sichtbar; Test 5 TTL-Sweep mit direkten `SbkimStorage.put`-Einträgen in `sbkim_siblings` und `since > 30 Tage` → `SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)` entfernt beide; Selbstcheck-Hinweis) plus sichtbarem Fake-Such-Symbol-Element. `node --check` für `00_doku_fenster.js` und alle Inline-`<script>`-Blöcke grün. `status.json` Modul 00 auf `score:"stub"` mit `siegel:"Code-Stub"`, Pie regeneriert (Spec fertig 2→1, Code-Stub 6→7). **Spec-Korrektur:** Karte 00 § Manueller Test Punkt 5 nannte `SbkimApoptose._addPseudoSibling` als TTL-Sweep-Setup; das ist aber Versand-Pfad-Override. `forgetExpiredSiblings` liest ausschließlich aus dem realen `sbkim_siblings`-Store — Panel 00 Test 5 nutzt deshalb `SbkimStorage.put`. Karte 00 § Manueller Test Punkt 5 entsprechend leicht angepasst (additiv, kein Vertrag-Eingriff). |
| 2026-05-15 | Pflege-Sitzung 02+07-Cache-Invalidate | Modul 02 öffentliche **`resetIdentityCache() → void`** ergänzt — sync, idempotent, leert In-Memory-`identityCache` ohne Storage anzufassen. Aufgehängt in §1 Modul 02 Bietet-Block, Selbstcheck-Format-Zeile (sieben Funktionen), Garantien-Block für 05/06/07 (neuer Punkt „Cache-Konsistenz nach externem Storage-Cleanup"). **Modul 07 § Self-Apoptose-Cleanup-Reihenfolge** um Schritt 6 `SbkimSpore.resetIdentityCache()` ergänzt — Pflicht ab dieser Pflege-Sitzung. Hintergrund: Klaus' Sichttest 2026-05-15 ergab Test 6 (Self-Apoptose) `getNodeId_wirft_NoIdentityError:false` trotz `stores_alle_leer:true`; Modul 02's `identityCache` (Performance-Optimierung) wird nicht durch externes `storage.clear` invalidiert — Modul 07 löscht zwar alle SBKIM-Stores sequenziell, weiß aber nichts von Modul 02's Cache. Folgeschaden: nach Self-Apoptose liefert `getNodeId` die alte Identität, `loadOwnPrivateKey` (storage-direkt) wirft `NoIdentityError` beim nächsten Sign-Versuch — Tests 1/2/3/8 von Panel 07 schlagen fehl. **Sauberere Lösung gewählt** (von vier Optionen — A öffentliche Reset-Funktion · B Cache-Trust-Abschalten · C `init({forceReload:true})` · D Pass-Check-Lockern): Option A ist saubere Vertrag-Trennung (Modul 02 kennt keine Apoptose, bietet aber den Hook), performance-neutral (Cache bleibt schnell für Modul 04/05/00), additiv (kein Hauptversions-Sprung), Spec-disziplinär (kein Trick). Modul 02 Code: neue `resetIdentityCache`-Funktion (eine Zeile `identityCache = null;`), Selbstcheck-Zeile auf sieben Funktionen erweitert, Export ergänzt. Modul 07 Code: nach den fünf `storage.clear`-Aufrufen + den eigenen Cache-Invalidations (`ownPrivateKeyCache = null; pseudoSiblings = null;`) wird `getSpore().resetIdentityCache()` als Schritt 6 gerufen. Keine Test-Datei-Änderung — Test 6 wird nach diesem Fix beim Re-Sichttest grün (`getNodeId_wirft_NoIdentityError:true`). Karten 02 + 07 Bauzustand-Tabellen ziehen mit; status.json beide Module unverändert (kein Score-Wechsel). |
| 2026-05-15 | Pflege-Sitzung 09-Schritt-9-Doku-TTL | Karte 09 § Andock-Schritt-Pfad von **acht** auf **neun** Schritte erweitert (Folge-Pflege aus Spec-Sitzungen 07 + 00, dort als „Schritt 9 nachziehen"-offene Frage vermerkt). **Schritt 2 (`<script>`-Tags)** zieht Modul 07 (Apoptose) und Modul 00 (Doku-Fenster) in der verbindlichen Reihenfolge nach (`01 → 02 → 03 → 04 → 05 → 07 → 00` — Modul 00 zuletzt, weil es die anderen fail-soft als optionale Lese-Quellen prüft). Sichtkontroll-Block in Schritt 2 zeigt jetzt sechs Selbstcheck-Zeilen (statt vier; 03 weiterhin nach `init()`); inkl. der durch Pflege-Sitzung 02+07-Cache-Invalidate erweiterten Modul-02-Selbstcheck-Zeile (sieben Funktionen). **Neuer Schritt 9 „Apoptose + Doku-Fenster scharf schalten"** mit drei Sub-Punkten: 9a `await SbkimApoptose.init()` (Vermächtnis-Empfang über MessageChannel-Listener auf Service-Worker — Modul 07 setzt den Listener im `init()`), 9b `await SbkimDoku.init({searchIconSelector:"#search-icon"})` (5-Klick-Geste am PWA-Such-Symbol; Selektor pro Endknoten anpassen, MutationObserver-Re-Mount mit 10-s-Safety-Timeout falls Selektor zur init-Zeit kein Element matcht), 9c (optional, empfohlen) `await SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)` als Andocker-Automatik nach jedem Handshake — schließt offene Frage aus Spec-Sitzung 07 (Karte 09 Schritt 9 TTL-Sweep-Aufruf) zur **anderen Hälfte** (manueller Trigger via Modul-00-Doku-Knopf war schon da, jetzt auch Andocker-Automatik dokumentiert). **§ Sichtkontrolle nach dem Andocken** von drei auf vier Pflicht-Punkte erweitert: sieben Selbstcheck-Zeilen + sechs IndexedDB-Stores (mit `sbkim_doku_meta["meta"]` schon nach Schritt 9 gefüllt) + zwei live-Endpunkte (`/sbkim/spore.json` GET 200; `/sbkim/anastomosis` und `/sbkim/legacy` beide GET 405) + 5-Klick-Geste am Such-Symbol öffnet das Modal mit Knoten-ID-Kurzform/Domäne/Geschwister/Inbox/Quota/Aktion-Knöpfen. **Was Schritt 9 NICHT macht** explizit dokumentiert: kein Self-Apoptose-Knopf (Karte 07 hat ihn als zweistufig+irreversibel spezifiziert; gehört in separaten Service-Pfad), keine Handshake-Automatik (Schritt 8 bleibt Klaus-Trigger), kein Heterokaryose-Pfad (Modul 06 ist Schablone, späte Phase). Visualisierungs-Mermaid-Flowchart von acht auf neun Knoten erweitert (A1–A9). § Datei-Pfad-Konvention von „fünf JS-Module" auf „sieben JS-Module" nachgezogen. § Verantwortlichkeiten Macht-Block ergänzt um Modul 07 + 00. Karte 09 Bauzustand-Tabelle um „Pflege Schritt 9 + 07/00"-Zeile erweitert. **Keine Code-Änderung an Modulen 00/02/05/07/Storage/Embedding/Match.** **`status.json` Modul 09 unverändert** (bleibt `score:"spec"` / `siegel:"Spec fertig"`, Pie nicht regeneriert — die Erweiterung ist additiv im Andock-Pfad, kein Modul-Bau). Modul 09 ist Anleitung, kein JS-Modul; Status-Hochstufung kommt erst nach erstem Live-Andock-Versuch durch Klaus (= „erstmaliger Einbau Rezeptbuch/Mixarium"-Bauzustand-Zeilen). |
| 2026-05-15 | Pflege-Sitzung 07-Test6-bestaetigt | Klaus' Re-Sichttest 2026-05-15 (Panel 07 Test 6 Self-Apoptose im Browser, nach Pflege 02+07-Cache-Invalidate) lieferte den erwarteten Cache-Fix-Beleg: `getNodeId_wirft_NoIdentityError:true` (vorher `false` — Cache-Bug behoben); die übrigen vier Felder unverändert (`outcome:completed, stores_alle_leer:true, recipientsFailed.length:2, recipientsNotified.length:0`). Pass-Check Panel 07 Test 6 grün → **Modul 07 Sichttest 8/8 grün**. Reine Mini-Pflege ohne Code-Änderung und ohne Schnittstellen-Änderung in §1: Karte 07 § Bauzustand Sichttest-Zeile auf „geprüft 2026-05-15 (Klaus + Pflege 02+07-Cache-Invalidate + Re-Sichttest)" mit den fünf Belegfeldern nachgezogen; PULS-Schnellüberblick Modul 07, „Als nächstes ✨"-Block Modul 07 und WEGWEISER-Stand-Block-Zeile entsprechend aktualisiert. `status.json` unverändert (Modul 07 bleibt `score:"stub"` / `siegel:"Code-Stub"`, Pie nicht regeneriert). |
| 2026-05-15 | Hauptsitzung 14-Diffusion-Stub | **Modul 14 „Diffusion" als reiner Backlog-Stub angelegt** (Format analog Schutz-Module 10/11/12). Anlass: in der abgebrochenen Bau-Sitzung Modul 09 (2026-05-15, parallele Pflege-Sitzung Karte 09 „App-SW-Koexistenz" auf eigenem Branch) ist die Frage zur Spore-Verbreitung aufgekommen. Drei Diffusionspfade dokumentiert mit verbindlicher Auswahl: **Pfad 1 (passiv, `/sbkim/spore.json`)** bleibt Default-Mechanismus parallel; **Pfad 2 (konsensuell-empfehlend, `recommendedPeers: SporeRef[]` als optionales Feld in `HandshakeResponse`, max. 2 Einträge, Empfänger speichert als Lead mit TTL in neuem Store `sbkim_diffusion_leads`, opt-in pro Empfehlung)** verbindlich gewählt — drehbuchkonform, weil jede Übergabe im Konsens beim Handshake; **Pfad 3 (parasitär-mitreisend)** explizit verworfen, weil er das Empfangsmodus-Prinzip aus `CLAUDE.md` + `sbkim_paper.pdf` („Kein Crawler, keine Pulsation, keine Eigenanfragen ins offene Netz") bricht. **`docs/components/14_diffusion.md`** mit Status-Block (🟫 Schablone · Diffusion-Backlog · Priorität niedrig), Im-Mycel-Bild (Pilz-Hyphen tauschen Notizen über andere Pilze in der Nachbarschaft — Wuchs durch Empfehlung, nicht durch Senden), Mermaid-Flowchart (Handshake A↔B mit `recommendedPeers`, Lead-Store, Opt-in), drei Pfaden, sechs Anker-Punkten für die spätere Spec-Sitzung (a Handshake-Erweiterung Karte 05 · b Empfehlungs-Quelle aus `sbkim_siblings` · c Lead-Store mit TTL · d Trust-Hook Karte 10 · e Rate-Limit-Hook Karte 11 · f Anti-Vergiftung tiefer Trust-Tier), Schwellwert „Wann ziehen" (Netz ≥ 10 aktive Geschwister ODER Bau-Sitzung 09 abgeschlossen + Wachstums-Bedürfnis), Verbindungen zu Karten 05/06/10/11/12 (alle nur als Verweis, nicht implementiert), vier Risiken (Echo-Kammer · Diffusion-Sybil · Trust-Inflation · Privacy-Leak), sechs offenen Fragen für die spätere Spec, Bauzustand-Tabelle nur mit Zeile „Stub angelegt 2026-05-15". **`status.json` erweitert** um neues Feld `diffusionBacklog[]` parallel zu `schutzBacklog[]` (bewusste Architektur-Entscheidung: Schutz reaktiv, Diffusion proaktiv); Eintrag Modul 14 (`score:"schablone"`, `siegel:"Stub (Backlog), Priorität niedrig"`); `lastUpdated` auf `2026-05-15`; `scoreModel.maxScoreNote` **unangetastet** (Backlog zählt nicht zum maxScore, analog 10/11/12). **`scripts/update_puls_pie.py` erweitert** um Lesen von `diffusionBacklog` zusätzlich zu `modules` + `schutzBacklog`; Skript gelaufen: **13 → 14 Module, Schablonen 4 → 5**, andere Score-Verteilungen unverändert. **PULS.md erweitert**: Schnellüberblicks-Zeile „14 diffusion · Stub (Diffusion-Backlog) · …", Offene-Querschnitts-Frage „Spore-Diffusion Pfad 1/2/3" als gelöst markiert (durchgestrichen + Verweis auf Karte 14), neue offene Frage „Sage-Page sichtbar machen für Modul 14" angelegt (`index.html` rendert aktuell nur `modules[]` + `schutzBacklog[]`, nicht `diffusionBacklog[]` — Folge-Pflege-Sitzung zieht nach), neuer Sub-Abschnitt „Diffusion-Backlog" unter dem Schutz-Backlog mit Begründung „proaktiv vs. reaktiv" und Schwellwert-Verweis, Sitzungs-Eintrag oben. **§1 unangetastet** — Stub hat keine Schnittstelle; Schnittstellen-Spiegelung kommt erst in der späteren Spec-Sitzung 14 zusammen mit einer Pflege-Sitzung Karte 05 (`recommendedPeers: SporeRef[]` additiv in `HandshakeResponse` einbauen). **Karten 05/10/11/12 unangetastet** (Hook-Punkte nur als Verweis in Karte 14 dokumentiert, nicht implementiert). **Kein JS-Code** in `src/`. **Sage-Page `index.html` und Test-Datei `tests/manual_check.html` unangetastet** (Sichtbarmachung in der Bau-Puls-Karte und ggf. Eigenschutz-Karte 13 ist Folge-Pflege-Sitzung). Übergabeprotokoll `docs/sessions/archiv/2026-05-15_haupt-14-diffusion-stub.md` angelegt. |
| 2026-05-15 | Pflege-Sitzung 09-App-SW-Koexistenz | Karte 09 § Andock-Schritt-Pfad **Schritt 3 in 3a/3b aufgesplittet** plus neuer **Pre-Flight-Check** als Einleitungs-Block (`navigator.serviceWorker.getRegistration('./')` — Verzweigungs-Ergebnis ist die Auswahl 3a oder 3b). Variante 3a (PWA ohne eigenen SW) unverändert bisheriges Schritt-3-Verhalten (`register('sbkim-sw.js')`). Variante 3b (PWA mit eigenem App-SW) setzt in `app-sw.js` ganz oben `self.SBKIM_SW_STANDALONE = false; importScripts('./sbkim-sw.js');` — **kein** zweiter `register`-Aufruf, der bestehende `register('./app-sw.js')` reicht; fetch-Listener für `/sbkim/anastomosis` und `/sbkim/legacy` werden im selben SW-Kontext mit-registriert, alle anderen Pfade fallen durch in den App-SW-Cache-/Routing-Code. **Achtes Risiko „App-SW-Überschreibung"** in Karte 09 § Risiken & offene Punkte ergänzt (Schritt-3-`register` ersetzt bestehenden App-SW im selben Scope wegen unbedingtem `skipWaiting`/`clients.claim` in `sbkim-sw.js` → App-Offline-Cache + Push-Pfade weg; Erkennung über DevTools-Source = `sbkim-sw.js`; Lösung Variante 3b + `SBKIM_SW_STANDALONE=false`; Konvention Pre-Flight-Check vor Schritt 3 ist Pflicht). **`src/sbkim-sw.js` umgebaut** — `SBKIM_SW_STANDALONE`-Flag am Modul-Anfang (Default `true`, rückwärtskompatibel; `(typeof self.SBKIM_SW_STANDALONE !== "undefined") ? self.SBKIM_SW_STANDALONE : true`); `install`/`activate`-Handler rufen `skipWaiting`/`clients.claim` nur unter `SBKIM_SW_STANDALONE === true`; fetch-Listener-Pfad für `/sbkim/anastomosis` + `/sbkim/legacy` unverändert; Header-Kommentar erweitert um beide Lade-Pfade; fetch-Konvention dokumentiert (`event.respondWith` nur für SBKIM-Pfade, alle anderen Events durchfallen lassen). Karte 09 § Service-Worker-Hinweis `install`/`activate`-Vertragsblock und fetch-Listener-Reihenfolge entsprechend nachgezogen. Karte 09 § Datei-Pfad-Konvention um optionalen Block `app-sw.js` im Repo-Root ergänzt. Karte 09 § Sichtkontrolle um fünften (variantenspezifischen) Pflicht-Punkt erweitert (Variante-3b-Zwei-Browser-Test). **Keine §1-Vertragsänderung** — das Flag ist SW-intern, kein öffentlicher Funktions-Export wandert, additiv und rückwärtskompatibel. **Keine Code-Änderung an Modulen 00/01/02/03/04/05/07** (deren Code unverändert). Karte 09 Bauzustand-Tabelle „Pflege App-SW-Koexistenz"-Zeile ergänzt; `status.json` Modul 09 unverändert (bleibt `score:"spec"` / `siegel:"Spec fertig"`, Pie nicht regeneriert — die Pflege ist additiv im Andock-Pfad, kein Modul-Bau, kein Score-Wechsel). |
| 2026-05-15 | Pflege-Sitzung Sage-Page-Modul-14 | **`index.html` (Sage-Page) um `diffusionBacklog[]`-Rendering erweitert**, parallel zur bestehenden `schutzBacklog[]`-Darstellung. Schließt die offene Querschnitts-Frage „Sage-Page sichtbar machen für Modul 14" aus der Hauptsitzung 14-Diffusion-Stub (gleicher Tag). Render-Änderungen in drei datengetriebenen Karten plus einer hardgecodeten Karte: **Karte 4 Module-Bento** bekommt einen parallelen Divider „Diffusion-Backlog · proaktiv · spec ausstehend, Priorität niedrig" nach dem bestehenden Schutz-Backlog-Divider plus eine `buildModCard(m, true)`-Zelle für Modul 14 (Pfad: `docs/components/14_diffusion.md` über bestehende `m.name.toLowerCase()`-Konvention im backlog-Pfad); Karten-Titel von „Module · 10 Haupt + 3 Schutz-Backlog" auf „Module · 10 Haupt + 3 Schutz + 1 Diffusion (Backlog)" angehoben. **Karte 14 Bau-Puls** analog: `renderBauPuls(s)` `allMods` enthält jetzt auch `diffusionBacklog`, Divider „Diffusion-Backlog · proaktiv · Priorität niedrig" plus `buildBPCell(m, byId, true)`-Zelle; `BACKLOG_IDS` Set von `{'10','11','12'}` auf `{'10','11','12','14'}` erweitert (Modul 14 bekommt kein „Bereit-Symbol ✨"); `SLUG_MAP` und `slugForId(id)`-Map um `'14': 'diffusion'` ergänzt. `renderBauPulsPie(s)` `all`-Array enthält jetzt auch `diffusionBacklog` → Pie-Center-Zahl zeigt **14** (vorher 13), Legende zeigt Schablonen-Count **5** (vorher 4); andere Score-Verteilungen unverändert. **Karte 13 Eigenschutz** bekommt einen zweiten parallelen `<div class="schutz-backlog">`-Block direkt nach dem bestehenden (sprachlich „reaktiv" vs. „proaktiv", Schutz wehrt ab / Diffusion beschleunigt durch geteilte Erinnerung); `.schutz-pilz`-Schlussspruch um die Diffusion-Zeile erweitert. **Karte 7 Datenquelle Schema-Beispiel** zeigt jetzt `"diffusionBacklog": [/* Modul 14 (proaktiv), zählt NICHT in Score */]` parallel zum bestehenden `"schutzBacklog"`-Kommentar. **`FALLBACK_STATUS` um `diffusionBacklog: []` ergänzt** (Fail-Soft bei `status.json`-Lade-Fehler). **`status.json` unverändert** (PR-Daten aus Hauptsitzung 14-Diffusion-Stub bleiben unangetastet); `scripts/update_puls_pie.py` **NICHT** aufgerufen (keine Modul-Daten-Änderung). **Keine §1-Vertragsänderung** — Sage-Page ist Observatorium, keine Modul-Schnittstelle. **Keine Karten-Änderung 10/11/12/14** (Stubs unangetastet; Status-Zeile „Sage-Page → noch nicht sichtbar" in Karte 14 wartet auf eine Mini-Folge-Pflege oder die spätere Spec-Sitzung 14). **Kein JS-Code in `src/`** (Sage-Page ist Sage-Page-spezifisch, kein Endknoten-Modul). PULS: offene Querschnitts-Frage „Sage-Page sichtbar machen für Modul 14" als gelöst markiert (durchgestrichen + Verweis auf diese Pflege), Schnellüberblicks-Zeile Modul 14 um „plus Sage-Page-Sichtbarmachung 2026-05-15" erweitert, neuer Sitzungs-Eintrag oben mit Getan/Variante-Begründung/Was-nicht-geändert/Frischer-Kopf-Befund/Offene-Punkte/Nächster-Schritt. Übergabeprotokoll `docs/sessions/archiv/2026-05-15_pflege-sage-page-modul-14.md` angelegt. |
| 2026-05-15 | Spec-Sitzung 06 | Modul 06 (Heterokaryose) spezifiziert. Fünf-Funktionen-API (`init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis`); **Pull-Pattern verbindlich** (kein Push, keine Pulsation, drehbuchkonform); **beidseitiger Opt-In** über additives Feld `sbkim_siblings[peerNodeId].heterokaryosisOptIn: boolean` (default `false`, fail-soft wenn das Feld fehlt — Modul 05 setzt es nicht, Klaus setzt es im Endknoten-UI als eigene Folge-Pflege); HeterokaryosisRequest (7 Pflichtfelder inkl. `toNodeId` als Pflicht, anders als HandshakeRequest) und HeterokaryosisResponse (8 Pflichtfelder + 2 optionale: `anchors` Pflicht-bei-shared / `reason` Pflicht-bei-rejected); Anker-Form `{label: string ≤ 64 Zeichen, vector: number[384] L2-normalisiert}` ohne Eigen-Signatur (Response-Signatur deckt das ganze JSON); max. `HETERO_MAX_ANCHORS` (= 5) pro Response. Kanonischer Sign/Verify-Pfad **identisch zu Spore (Modul 02), HandshakeRequest (Modul 05) und LegacyMessage (Modul 07)** — alphabetisch sortierte Keys, Form ohne `signature`, Ed25519, base64url ohne Padding. Anker-Quelle Spec-Wille: Default-Pfad ein Anker aus der eigenen Spore (Label `"(domain)"`, Vektor = `senderSpore.domainVector`); erweiterte Quelle `sbkim_hetero_outbox` für spätere Spec-Sitzung 08 oder Folge-Pflege Modul 02 (Modul 06 liest fail-soft, kein eigener Schreiber). **Neuer Store `sbkim_hetero_inbox`** (Schlüssel-Komposit `<peerNodeId>|<ts>`, Drift-Spur über Zeit) — muss in Bau-Sitzung 06 in Karte 01's Store-Vertrag ergänzt werden, in §1 Modul 06 als angekündigter Store. **`sbkim_anastomosis_log` outcome-Vokabular additiv erweitert** (`hetero-pulled`/`-served`/`-opt-out`/`-opt-out-local`/`-rejected`/`-timeout`/`-endpoint-unsupported`) — kein neuer Log-Store; Modul 07's TTL-Sweep bleibt unverändert (es liest nur `"established"`/`"re-handshake"`-Einträge). Heterokaryose-Pfad in 14 Schritten (Sender 1–6, Empfänger 7–11, Sender 12–14); Verifikations-Pfad beim Empfänger in 8 Schritten (Form → Spore → Hauptversion → Signatur → toNodeId → Sibling-Filter → Opt-In-Filter → Antwort). Service-Worker-Vertrag (POST `/sbkim/heterokaryosis`, JSON, ≤ 64 KiB, 405/415/413/503, HTTP 404 → `outcome:"endpoint_unsupported"` ohne Throw); Variante A (Page-Hosted) verbindlich, analog 05/07; MessageChannel-Brücke mit Typ `SBKIM_HETEROKARYOSIS_REQUEST`. **§0 um `HETERO_MAX_ANCHORS = 5` ergänzt** (additiv, kein Hauptversions-Sprung; konsistent mit `SIBLING_MAX_AGE_MS` aus Spec-Sitzung 07). **§3 Endpunkt-Pfad `heterokaryosis: /sbkim/heterokaryosis` ist bereits seit Hauptsitzung Site-Echo eingetragen** — Spec-Sitzung 06 füllt jetzt den Vertrag. Fehlertabelle mit zwölf Lagen (Outcome vs. Throw klar getrennt: opt-out / opt-out-local / endpoint_unsupported sind Outcome, Form-/Spore-/Versions-/Signatur-/Sibling-/OptIn-Verletzungen sind Outcome beim Empfänger; Timeout/Netz/Krypto-Fehler werfen beim Sender). Manueller Test mit dreizehn Punkten (lokaler Pull-Round-Trip, opt-out Empfänger-Seite, opt-out lokal, unbekannter Sibling, Sender kein Geschwister, toNodeId-Mismatch, Versions-Mismatch, Signatur-Manipulation, HETERO_MAX_ANCHORS-Begrenzung, listHeterokaryosis, forgetHeterokaryosis, endpoint_unsupported, Selbstcheck). Risiken-Block mit acht Punkten (Anker-Vergiftung → Modul 10, Privacy-Leak via Outbox, Replay → Modul 11, Rate-Limit → Modul 11, Blocklist → Modul 12, Drift-Erkennung als Feature, sibling-Schema-Erweiterung additiv, Anker-Quelle minimal in Erst-Spec). **Hinweis an Karte 07** für Self-Apoptose-Cleanup-Reihenfolge: `sbkim_hetero_inbox` muss in einer eigenen Folge-Pflege-Sitzung zwischen Schritt 3 und 4 (zwischen `sbkim_legacy_inbox` und `sbkim_spore`) eingefügt werden — Spec-Sitzung 06 ändert Karte 07 NICHT (Spec-Disziplin). **Keine §2 HandshakeRequest-/HandshakeResponse-Änderung** (Modul 05 unangetastet — die `heterokaryosisOptIn`-Schema-Erweiterung ist eine additive Sibling-Schema-Erweiterung im Storage-Vertrag, kein neues Handshake-Feld). **Keine Modul-10/11/12/14-Karten-Änderung** (Backlog-Stubs unangetastet — nur als Hook-Punkte erwähnt). **Kein JS-Code in `src/`** (Bau-Sitzung 06 ist eigene Phase). Status Modul 06 auf `entwurf`. |
| 2026-05-15 | Bau-Sitzung 06 | Modul 06 (Heterokaryose) Code geschrieben (`src/modules/06_heterokaryose.js`), Status Modul 06 bleibt `entwurf` (Spec-Vertrag unverändert). IIFE mit `window.SbkimHeterokaryose`, fünf öffentliche Funktionen (`init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis`), fünf benannte Error-Klassen (`HeterokaryoseDependenciesError`, `UnknownSiblingError`, `HeterokaryoseTimeoutError`, `HeterokaryoseNetworkError`, `HeterokaryoseSignatureInvalidError`). **Bau-Pflicht-Entscheidung 1:** kanonischer Sign/Verify-Pfad (canonicalize/base64url/signEnvelope/verifyEnvelope) **bewusst aus Modul 02/05/07 als vierter Pfad dupliziert** — Single-File-PWA-Stil, kein Eingriff in 02/05/07 (Konvention seit Bau-Sitzung 07). **Bau-Pflicht-Entscheidung 2:** Test-Brücken-Surface = `_invokeReceiveHeterokaryosisDirect`, `_buildSignedHeterokaryosisRequest`, `_verifyResponseSignature`, `_addPseudoSibling` (mit `heterokaryosisOptIn`-Flag-Argument — schreibt direkt in `sbkim_siblings`, weil Modul 06 Storage-basiert liest; nicht in-memory wie Modul 07), `_clearPseudoSiblings`, `_setReceiverHttpStatus(status|null)` (fetch-Override für 404-Test ohne Netz), plus `_canonicalize`/`_base64urlEncode`/`_base64urlDecode`/`_signEnvelope`/`_verifyEnvelope`. **Bau-Pflicht-Entscheidung 3:** Service-Worker in `src/sbkim-sw.js` um dritten fetch-Listener-Pfad erweitert — `/sbkim/heterokaryosis` mit Message-Typ `SBKIM_HETEROKARYOSIS_REQUEST`, parallel zu `/sbkim/anastomosis` + `/sbkim/legacy`; Body-Schutz (405/415/413/503) identisch; `SBKIM_SW_STANDALONE`-Schalter aus Pflege App-SW-Koexistenz 2026-05-15 unangetastet. **Bau-Pflicht-Entscheidung 4:** `src/modules/01_storage.js` `DB_VERSION` 1 → 2 (additive Migration); `STORES_V2 = ["sbkim_hetero_inbox"]` neuer Block in `applyMigration`; bestehende PWAs bekommen den Store beim nächsten Lade additiv ohne Datenverlust. §1 Modul 01 Storage-Block + Karte 01 § Stores nachgezogen (`sbkim_hetero_inbox` als Schreiber-06-Store mit Komposit-Schlüssel `<peerNodeId>|<ts>`; `sbkim_siblings`-Wert-Form um optionales `heterokaryosisOptIn`-Feld ergänzt — Schreiber bleibt 05; `sbkim_anastomosis_log` mit zwei Schreibern 05+06). **Bau-Pflicht-Entscheidung 5:** `src/modules/07_apoptose.js` `CLEANUP_ORDER` um `HETERO_INBOX_STORE` zwischen `INBOX_STORE` und `SPORE_STORE` erweitert (Position 4, vor der Identitäts-Schicht — siehe Spec-Sitzung 06 § Hinweis an Karte 07). Karte 07 § Schnittstelle (`confirmSelfApoptose`-Block) + § Apoptose-Pfad Sender-Seite Schritt 5 + § Bauzustand-Zeile „Pflege Cleanup-Reihenfolge Bau 06" + INTERFACES.md §1 Modul 07 § Storage + § Self-Apoptose-Cleanup-Reihenfolge ziehen mit (Schritte 1-3 wie vorher, neuer Schritt 4 `sbkim_hetero_inbox`, alte Schritte 4-6 verschieben sich auf 5-7). **Bau-Pflicht-Entscheidung 7 (Anker-Quelle):** In der Erst-Bau-Iteration **ausschließlich Spore-Single-Anker-Fallback** — `getOwnSpore()` lesen, wenn `domainVector` vorhanden → `anchors:[{label:"(domain)", vector: domainVector}]`; sonst `anchors:[]` mit `outcome:"shared"` (**Degraded-Modus**). Kein `sbkim_hetero_outbox`-Lese-Code, kein Stub-Anlegen, kein Store-Register — Spec-Sitzung 08 oder Pflege Modul 02 entscheidet das. Karte 06 § Manueller Test Punkt 9 (HETERO_MAX_ANCHORS-Begrenzung) als „teil-abgedeckt" markiert; Panel 06 prüft Schema-Konformität, voller Begrenzungs-Test (5 von 7) folgt mit Outbox-Befüllung. **Bau-Pflicht-Entscheidung 8:** Panel 06 in `tests/manual_check.html` mit 14 Knöpfen gefüllt (Setup + 12 Test-Punkte aus § Manueller Test + Selbstcheck-Hinweis); Knopf-Stil exakt wie Panel 07 (Pass-Check via `SbkimUI.setStatus`, JSON-Antwort als `output.textContent`). Synchroner Selbstcheck beim Skript-Laden (`MODUL 06 HETEROKARYOSE bereit, Funktionen: init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis`). `node --check src/modules/06_heterokaryose.js`, `node --check src/sbkim-sw.js`, `node --check src/modules/01_storage.js`, `node --check src/modules/07_apoptose.js` und alle 9 Inline-`<script>`-Blöcke in `tests/manual_check.html` syntaktisch validiert. `status.json` Modul 06 von `score:"spec"` / `siegel:"Spec fertig"` auf `score:"stub"` / `siegel:"Code-Stub"` hochgestuft; `lastUpdated` auf `2026-05-15`. Pie regeneriert (Schablone 4 → 4, Werkstatt 1 → 1, **Spec fertig 2 → 1**, **Code-Stub 7 → 8**, Fertig 0 → 0; 14 Module gesamt unverändert). Sage-Page (`index.html`) unangetastet — Karte 4 (Module-Bento) + Karte 14 (Bau-Puls) + Pie-Center-Zahl ziehen datengetrieben aus `status.json` nach. **§2 §3 §4 unverändert** — Spec-Vertrag bleibt fest; Bau-Sitzung 06 hat keine Vertrags-Erweiterung über das hinaus, was in Spec-Sitzung 06 schon spezifiziert war. Übergabeprotokoll `docs/sessions/archiv/2026-05-15_bau-06-heterokaryose.md` angelegt. |
| 2026-05-15 | Spec-Sitzung 08 | Modul 08 (UI-Demo) spezifiziert. **Modul-08-Rollenwahl verbindlich entschieden** (Variante b): Karte 08 spezifiziert das Endknoten-`SbkimUiDemo`-JS-Modul mit fünf öffentlichen Funktionen (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn`); `tests/manual_check.html` ist ausdrücklich KEIN Modul-08-Code, sondern bleibt als Sage-Protokol-interne Werkstatt unbenannt (kein Karten-Vertrag). Begründung: die Werkstatt hat keinen Endknoten-Vertrag (wird nie kopiert), Karten-Statuscodes sind formal für JS-Module gedacht, Rolle (b) schließt die reale Spec-Lücke aus Spec-Sitzung 06 (sbkim_hetero_outbox-Schreiber + heterokaryosisOptIn-Setter im Endknoten-UI). **§0 um `HETERO_OUTBOX_MAX_ENTRIES = 5` ergänzt** (additiv, kein Hauptversions-Sprung; konsistent mit `HETERO_MAX_ANCHORS = 5` — was in der Outbox steht, geht beim nächsten Pull raus). **§1 Modul 01 Storage-Block erweitert**: neuer Store `sbkim_hetero_outbox` (Schlüssel `label` string ≤ 64 Zeichen, Wert `{label, vector, addedAt}`, Schreiber 08, Leser 06), DB-Version 2 → 3 (additive Migration v=3), `sbkim_siblings`-Zeile um Co-Schreiber-Hinweis 08 erweitert (Schreiber bleibt Modul 05; Modul 08 darf AUSSCHLIESSLICH das eine additive Feld `heterokaryosisOptIn` setzen, wenn der Eintrag bereits existiert — sonst `UnknownSiblingError`); Schema-Hinweis zu `sbkim_hetero_outbox` mit Reihenfolge-Regel (absteigend nach `addedAt` in `listOutbox`), Überschreib-Verhalten bei doppeltem Label, `OutboxFullError` ohne automatisches Verdrängen, fail-soft-Lese-Recht für Modul 06. **§1 Modul 08 auf Status `entwurf`** mit voller Vertrag-Sektion (API-Signaturen, Nutzt-Block für `SbkimStorage` als Pflicht-Abhängigkeit, keine anderen Module — Vektor-Erzeugung ist Aufrufer-Pflicht via `SbkimEmbedding.embedPassage`; Storage-Block mit `sbkim_hetero_outbox` als Allein-Schreiber und `sbkim_siblings` als Co-Schreiber für ein Feld; Selbstcheck-Format synchron beim Skript-Laden; Fehlerverhalten mit sechs benannten Error-Klassen `UiDemoDependenciesError` / `InvalidAnchorLabelError` / `InvalidAnchorVectorError` / `OutboxFullError` / `UnknownSiblingError` / `InvalidOptInArgError`; Garantien für Modul 06 / 09). **`UnknownSiblingError`-Name bewusst identisch zu Modul 06** — Bedeutung dieselbe (peerNodeId nicht in `sbkim_siblings`); Unterscheidung über `window.SbkimUiDemo.UnknownSiblingError` vs. `window.SbkimHeterokaryose.UnknownSiblingError`. **Vier Pflicht-Spec-Entscheidungen ausführlich begründet** (Modul-Rollenwahl b, Schnittstelle fünf Funktionen, Outbox-Store-Form mit absteigender Reihenfolge nach `addedAt`, Self-Apoptose-Knopf NICHT in Modul 08 in dieser Erst-Spec). **Self-Apoptose-Knopf bewusst nicht spezifiziert**: Spec-Sitzung 00 hatte ihn aus Modul 00 ausgelagert mit dem Verweis „Modul 08 oder separater Endknoten-Pfad"; Spec-Sitzung 08 entscheidet: in dieser Erst-Spec auch nicht, weil Self-Apoptose sicherheitskritisch (zweistufig + 60s-Token, Karte 07) und ein versteckter Knopf in der Pflege-UI das Risiko nicht kleiner macht — eigene Spec-Sitzung 08.2 oder Karte 07 § UI-Doku darf das später nachholen. **Doku-Fenster-Integration entschieden**: Modul 08 erreicht Klaus über einen eigenen Endknoten-Anker (z.B. „Einstellungen → SBKIM-Pflege"), NICHT über die 5-Klick-Geste in Modul 00 (Modul 00 ist versteckt, nur Lese-/Trigger — Modul 08 schreibt, braucht sichtbare UI). DOM-Form bleibt offen (jeder Endknoten gestaltet selbst). **Modul-lokale Konstante** `OUTBOX_LABEL_MAX_LEN = 64` in Karte 08 (konsistent mit Anker-Form aus Karte 06 § Anker-Form). **Embedding-frei**: `addOutboxAnchor` erwartet einen fertigen Vektor — Aufrufer ruft `SbkimEmbedding` selbst. **Modul 06 unangetastet**: Karte 06 § Anker-Quelle (Spec-Wille) erwähnt `sbkim_hetero_outbox` bereits seit Spec-Sitzung 06; Modul 06 hat das fail-soft-Lese-Recht. Eine **Folge-Pflege Bau 06.1** (Outbox-Lese-Pfad in `src/modules/06_heterokaryose.js`) ist nach Spec-Sitzung 08 fällig, aber **NICHT Teil dieser Spec-Sitzung** — in Karte 08 § Querverweise und in PULS als offener Punkt notiert. **Karte 01 § Stores + § Versionsmigration** (v=3-Zeile) + § Bauzustand „Pflege Spec 08 Outbox-Anmeldung"-Zeile nachgezogen. **Keine Karte-05-Schnittstellen-Änderung** (`heterokaryosisOptIn`-Co-Schreiber-Status von Modul 08 ist Karte-01-Vertragserweiterung, nicht Karte-05-API). **Keine Karte-06-Schnittstellen-Änderung** (fail-soft-Lese-Recht seit Spec-Sitzung 06 spezifiziert). **Keine Karte-07-Schnittstellen-Änderung** (Self-Apoptose bleibt zweistufig+60s-Token). **Keine Karten-10/11/12/14-Änderung** (Schutz-/Diffusion-Backlog-Stubs unangetastet). **Kein Hauptversions-Sprung** (PROTOCOL_VERSION bleibt "0.1"; `HETERO_OUTBOX_MAX_ENTRIES` additiv in §0; `sbkim_hetero_outbox` additiv als v=3-Store; `heterokaryosisOptIn`-Co-Schreiber additiv im Storage-Vertrag). **Keine Sage-Page-(`index.html`)-Änderung** (datengetrieben aus `status.json`). **Kein JS-Code in `src/`** (Bau-Sitzung 08 ist eigene Phase). **Keine `tests/manual_check.html`-Änderung** (Panel 08 entsteht in der Bau-Sitzung 08). `status.json` Modul 08 von `score:"werkstatt"` / `siegel:"in Werkstatt"` auf `score:"spec"` / `siegel:"Spec fertig"` hochgestuft; `kurz` aktualisiert (Endknoten-Pflege-UI für Outbox + Opt-In, fünf Funktionen, neuer Store sbkim_hetero_outbox, Self-Apoptose-Knopf bewusst nicht in dieser Erst-Spec); `config.HETERO_OUTBOX_MAX_ENTRIES = 5` am Ende des `config`-Blocks ergänzt; `lastUpdated` auf `2026-05-15`. Pie regeneriert (Werkstatt 1 → 0, **Spec fertig 1 → 2**, Schablone 4 → 4, Code-Stub 8 → 8, Fertig 0 → 0; 14 Module gesamt unverändert). Übergabeprotokoll `docs/sessions/archiv/2026-05-15_spec-08-ui-demo.md` angelegt. |
| 2026-05-15 | Pflege Bau 06.1 Outbox-Lese-Pfad | Folge-Pflege nach Spec-Sitzung 08: Outbox-Lese-Pfad in `src/modules/06_heterokaryose.js` implementiert. `readOwnAnchors()` ruft zuerst `readOutboxAnchors()` (try/catch um `SbkimStorage.all("sbkim_hetero_outbox")`; bei Wurf — z.B. ältere PWA-DB mit v=1/2 ohne v=3-Store, `UnknownStoreError` aus Modul 01 — oder bei leerem/fehlenden Store: `null` als Fallback-Signal mit `console.info`-Hinweis); nicht-leere Einträge werden absteigend nach `addedAt` sortiert und die ersten `HETERO_MAX_ANCHORS` (= 5) auf Anker-Form `{label, vector}` gemappt (outbox-internes `addedAt` gehört nicht in die Anker-Form, siehe Karte 06 § Datenformate). Bei `null` Fallback auf `readSporeFallbackAnchors()` (= bisheriger Spore-Single-Anker-Fallback aus Erst-Bau-Iteration 06, Degraded-Modus). **`src/modules/01_storage.js`** Code-Anmeldung: `DB_VERSION` 2 → 3 (additive Migration v=3, Spec-Sitzung 08 hatte den Vertrag schon spezifiziert); neuer `STORES_V3 = ["sbkim_hetero_outbox"]`-Block in `applyMigration(db, 3)`; `KNOWN_STORES` um den Outbox-Store erweitert; bestehende PWAs mit DB-Version 1 oder 2 bekommen den Store beim nächsten Lade additiv (`for v = oldVersion+1 … newVersion`-Loop zieht beide Migrations-Schritte nach), kein Datenverlust. **`tests/manual_check.html`** Panel 06 Test 9 von „teil-abgedeckt" auf **vollen Begrenzungs-Test (5 von 6)** gehoben: Setup-Schritt schreibt sechs Outbox-Einträge direkt via `SbkimStorage.put` (Schlüssel `label`, Wert `{label, vector[384], addedAt}`; sechs `addedAt`-Werte über je eine Minute gestaffelt; **kein** `SbkimUiDemo`-Aufruf — Bau-Sitzung 08 ist eigene Phase, Test-Konvention seit Bau 06 ist direkter Storage-Zugriff analog `_addPseudoSibling`); Pass-Check `response.anchors.length === 5`, `anchors[0].label === "Nachtisch"` (neuestes Label, Reihenfolge-Check), `"Hefeteig"` (ältestes Label) aussortiert, jeder Anker hält Schema `{label, vector[384]}` ein; nach dem Test werden die sechs Outbox-Einträge wieder gelöscht, damit andere Test-Knöpfe (z.B. Test 1) wieder den Spore-Single-Anker-Fallback sehen. Panel-06-Hinweis (`<pre class="log">`) zieht entsprechend nach (zwei Anker-Quellen, Test 9 voller Begrenzungs-Test). **Karte 06 § Anker-Quelle** um Pflege-Hinweis-Block (voller Outbox-Lese-Pfad implementiert, Fallback bleibt für leere/fehlende Outbox) erweitert; **§ Manueller Test Punkt 9** von „teil-abgedeckt" auf „voll abgedeckt" mit den genauen Test-Schritten; **§ Bauzustand-Zeile „Pflege Bau 06.1 Outbox-Lese-Pfad"** ergänzt; Sichttest-Zeile aktualisiert. **Karte 01 § Bauzustand-Zeile „Pflege Bau 06.1 Code-DB-Version 2 → 3"** ergänzt (Spec-Sitzung 08 hatte den Vertrag schon spezifiziert; Pflege Bau 06.1 zieht den Code nach). **Keine §1-Modul-06-Vertrags-Änderung** — fail-soft-Lese-Recht steht seit Spec-Sitzung 06; Pflege Bau 06.1 zieht nur die Implementation nach. **Keine §0-/§2-/§3-/§4-/§5-Änderung.** **Keine `src/modules/08_ui_demo.js`-Datei angelegt** (Bau-Sitzung 08 ist eigene Phase). **Keine Karte-05-/-07-/-10-/-11-/-12-/-14-Änderung.** **Kein Hauptversions-Sprung** (PROTOCOL_VERSION bleibt "0.1"). **Keine Sage-Page-(`index.html`)-Änderung.** `node --check src/modules/01_storage.js` und `node --check src/modules/06_heterokaryose.js` grün; alle 9 Inline-`<script>`-Blöcke in `tests/manual_check.html` syntaktisch validiert. **`status.json` unverändert** — Modul 06 bleibt `score:"stub"` (Code-Stub), die Pflege ist additiv im Code, kein Score-Wechsel; Pie nicht regeneriert. Übergabeprotokoll `docs/sessions/archiv/2026-05-15_pflege-bau-06.1-outbox-lese-pfad.md` angelegt. |
| 2026-05-15 | Bau-Sitzung 08 | Modul 08 (UI-Demo) Code geschrieben (`src/modules/08_ui_demo.js`), Status Modul 08 bleibt `entwurf` (Spec-Vertrag aus Spec-Sitzung 08 unverändert).
| 2026-05-15 | Live Andock Iteration 2 — Eruda + Stamm/Gast | **Konzept-Eintrag, keine §1/§2-Vertragsänderung.** Sitzung hat (a) Eruda als Tablet-Sichtkontrolle in beide Endknoten (`Mein-Mixarium` + `Mein-Rezeptbuch`) eingebaut (über Termux, Variante aus Karte 09 § Sichtkontrolle § Tablet-Variante) — kein Sage-Protokol-Code, externer Endknoten-Eingriff. (b) Aus der ersten Mixarium-Sichtkontrolle ergab sich die Erkenntnis: 6 Sushi-Einträge tragen eine verwaiste Kategorie-ID (`fid_17763323516422`) — und allgemeiner: Endknoten haben in Wirklichkeit **gewichtete Domänen**, nicht scharfe. Klaus' UI-Begriff „Überraschungs-Plus" deckt sich mit der Würth-Analogie (Schrauben = Stamm, Werkzeug = Gast). **`docs/ARCHITEKTUR.md` § 8 „Stamm- und Gast-Kategorien" angelegt** mit Konsequenzen-Tabelle für Module 02/03/04/05/00/08/09, Konsequenz-Block für 06/07/14, vier offenen Fragen für die kommende Spec-Sitzung „Stamm/Gast-Felder in Spore-JSON". **Verbindlichkeit:** Konzept ist gesetzt, Spore-JSON-Felder (vorgeschlagene Namen `stammCategories: string[]` / `guestCategories: string[]`, **optional**, signaturpflichtig wenn vorhanden) werden in einer eigenen Spec-Sitzung in §2 Spore-JSON eingetragen — additiv, **kein** Hauptversions-Sprung von 0.1 auf 0.2. Details im Übergabeprotokoll [2026-05-15 Live Andock Iteration 2 — Eruda + Stamm/Gast](sessions/archiv/2026-05-15_live-andock-eruda-stamm-gast.md). IIFE mit `window.SbkimUiDemo`, fünf öffentliche Funktionen (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn`), sechs benannte Error-Klassen im Factory-Stil analog Modul 00 (`UiDemoDependenciesError`, `InvalidAnchorLabelError`, `InvalidAnchorVectorError`, `OutboxFullError`, `UnknownSiblingError`, `InvalidOptInArgError` — auf `SbkimUiDemo.<Error>` exportiert). Modul 08 ist **nicht protokoll-aktiv**: kein Netz-Aufruf, kein Embedding, keine Signatur, kein Heterokaryose-Pull. Drei Test-Brücken (`_clearOutbox`, `_addPseudoSibling`, `_clearPseudoSiblings`). **Bau-Pflicht-Entscheidung 1:** Reihenfolge der Checks in `addOutboxAnchor` — (1) `label`-Typ + Länge sync → `InvalidAnchorLabelError`, (2) `vector`-Form sync (Array, Länge `EMBEDDING_DIM = 384`, alle Werte `Number.isFinite`) → `InvalidAnchorVectorError`, (3) async-Existenz-Check (`SbkimStorage.get`) + Voll-Check (`SbkimStorage.all` → `length >= HETERO_OUTBOX_MAX_ENTRIES`) → `OutboxFullError` nur wenn Label NEU; Überschreiben eines bekannten Labels bleibt erlaubt (kein Verdrängen, Anzahl unverändert). **Bau-Pflicht-Entscheidung 2:** `init()` idempotent über internen `ready`-Flag; Selbstcheck steht synchron im IIFE-Body (nicht in `init()`), wird also genau einmal beim Skript-Laden geloggt. **Bau-Pflicht-Entscheidung 3:** `setSiblingHeteroOptIn` strikt boolean — `optIn !== true && optIn !== false` wirft `InvalidOptInArgError` (kein truthy/falsy-Cast); Co-Schreiber-Disziplin via `Object.assign({}, sibling, {heterokaryosisOptIn})` (alle anderen Felder unverändert; Modul 05 bleibt Haupt-Schreiber). Wenn `peerNodeId` nicht in `sbkim_siblings` → `UnknownSiblingError` (Modul 08 legt KEINEN Eintrag an). **Bau-Pflicht-Entscheidung 4:** `_addPseudoSibling`-Test-Brücke schreibt KEIN `heterokaryosisOptIn`-Feld (anders als Modul 06's `_addPseudoSibling`) — Panel-08-Test 6 prüft den Co-Schreiber-Pfad, indem Modul 08 das Feld selbst setzt. **Bau-Pflicht-Entscheidung 5:** Panel 08 in `tests/manual_check.html` mit acht Knöpfen gefüllt (Setup + sechs Test-Punkte aus Karte 08 § Manueller Test + Selbstcheck-Hinweis); `<script src="../src/modules/08_ui_demo.js"></script>` zwischen Modul 06 und Modul 00 eingehängt; deterministische Pseudo-Vektoren in Panel-Code (Modul 08 ist Embedding-frei, Aufrufer-Pflicht). Panel-08-Status-Chip von `idle "in dieser Datei selbst"` (Werkstatt-Stub) auf `ok "Code-Stub"` umgestellt — die Werkstatt-Doppelbedeutung ist seit Spec-Sitzung 08 § Modul-08-Rollenwahl (Variante b verbindlich) aufgelöst. **Self-Apoptose-Knopf NICHT in Panel 08** (Spec-Sitzung 08-Entscheidung respektiert). **Kein Eingriff in `src/modules/01_storage.js`** (DB-Version 3 + `sbkim_hetero_outbox`-Store-Anmeldung bereits aus Pflege Bau 06.1) **/ `src/modules/05_anastomose.js`** (unangetastet seit Spec-Sitzung 06, `heterokaryosisOptIn` ist Karte-01-Co-Schreiber-Konvention) **/ `src/modules/06_heterokaryose.js`** (Outbox-Lese-Pfad bereits aus Pflege Bau 06.1). **Keine §0-/§1-Modul-01/05/06/07/09-/§2-/§3-/§4-/§5-Änderung** — §1 Modul 08 bleibt der Spec-Sitzung-08-Vertrag, dieser Bau zieht nur die Implementation nach. **Keine Karte-01-/-05-/-06-/-07-/-09-/-10-/-11-/-12-/-14-Änderung.** **Kein Hauptversions-Sprung** (PROTOCOL_VERSION bleibt "0.1"; `sbkim_hetero_outbox`-Schema additiv aus Spec-Sitzung 08). **Keine Sage-Page-(`index.html`)-Änderung** (datengetrieben aus `status.json`). `node --check src/modules/08_ui_demo.js` grün; alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html` syntaktisch validiert. `status.json` Modul 08 von `score:"spec"` / `siegel:"Spec fertig"` auf `score:"stub"` / `siegel:"Code-Stub"` hochgestuft; `kurz` um Bauzustand-Hinweis erweitert; `lastUpdated` auf `2026-05-15`. Pie regeneriert (Schablone 4 → 4, Werkstatt 0 → 0, **Spec fertig 2 → 1**, **Code-Stub 8 → 9**, Fertig 0 → 0; 14 Module gesamt unverändert). Übergabeprotokoll `docs/sessions/archiv/2026-05-15_bau-08-ui-demo.md` angelegt. |
| 2026-05-15 | Spec-Sitzung „Stamm/Gast-Felder in Spore-JSON" | **§2 Spore-JSON Optionale Felder additiv erweitert** um `stammCategories: string[]` (Kerngebiet-Kategorien des Knotens, z.B. Mixarium `["Cocktails","Mocktails","Limonaden"]`) und `guestCategories: string[]` (Begleit-Kategorien, UI-Label „Überraschungs-Plus", z.B. Mixarium `["Knabbereien","Fingerfood"]`). Beide signaturpflichtig wenn vorhanden — gehen normal in die kanonische JSON-Serialisierung ein, Sign-/Verify-Pfad **unverändert**. Disjunktheit (kein Element in beiden Listen) ist **Hosting-Pflicht** des Knotens, **kein** `verifyForeignSpore`-Abbruch-Grund. **Modul 04 Match bleibt unverändert** — die vier offenen Fragen aus ARCHITEKTUR.md §8 sind in dieser Spec-Sitzung gelöst: (1) Feld-Benennung `stammCategories`/`guestCategories` (Mixed-Convention konsistent mit Sage-Fachvokabular Spore/Anastomose/Heterokaryose/Apoptose); (2) Match-Dämpfung **verworfen** — Stamm/Gast ist Klassifikations-Schicht (UI/Sortier), nicht Vektor-Math, Karte 04 mit explizitem Hinweis dazu ergänzt; (3) `domainVector` bleibt single in Erst-Iteration, separate Stamm-/Gast-Vektoren als Folge-Pflege wenn empirisch motiviert; (4) UI-Label „Überraschungs-Plus" verbindlich für Endknoten-App-UI, technischer Begriff bleibt `gast`. **`docs/components/02_spore.md` § Datenformat** Optionale-Felder-Block um die zwei neuen Zeilen ergänzt, Sign-/Verify-Hinweis im Anschluss. **`docs/components/04_match.md` § Konfigurationswerte** um Sub-Block „Stamm/Gast-Klassifikation berührt Modul 04 nicht" erweitert (verhindert spätere Fehl-Interpretation). **`docs/ARCHITEKTUR.md` §8** Konsequenzen-Tabelle nachgezogen (Modul 04 jetzt „unverändert" statt „Dämpfungsfaktor"), vier offene Fragen mit `~~strikethrough~~` als gelöst markiert + Antworten unterhalb. **Keine §0-Änderung** (keine neue Konstante nötig). **Keine §1-Modul-Vertrags-Änderung** (Karten 02/04 sind Karten-Pflege, kein API-Eingriff). **Keine §3-/§4-/§5-Änderung.** **`PROTOCOL_VERSION` bleibt `"0.1"`** — additive Optional-Felder, kein Hauptversions-Sprung. **`status.json` unverändert** (Modul 02 bleibt `score:"stub"`, Modul 04 bleibt `score:"stub"`; die Spec-Erweiterung ist additiv im Karten-Vertrag, kein Score-Wechsel). Pie nicht regeneriert. Übergabeprotokoll `docs/sessions/archiv/2026-05-15_spec-stamm-gast-spore-felder.md` angelegt. |
| 2026-05-15 | Bau 02 Stamm/Gast-Felder | Folge-Bau nach der Spec-Sitzung „Stamm/Gast-Felder in Spore-JSON" (selbiger Tag, PR #46). `src/modules/02_spore.js` `generateOwnSpore` Allow-List um zwei Zeilen erweitert: `if (Array.isArray(meta.stammCategories)) unsigned.stammCategories = meta.stammCategories.slice();` und entsprechend für `meta.guestCategories`. Die Erweiterung steht direkt nach der `domainVector`-Zeile und vor `endpointPaths`, in der gleichen Allow-List-Konvention wie alle anderen Optionalen seit Bau-Sitzung 02 (2026-05-14). **Anlass:** Cross-Reading vor der Bau-Sitzung 09 Iteration 3 zeigte, dass die Spec-Sitzung 2026-05-15 nur die heiligen Tafeln + Karten 02/04 nachgezogen hat, aber **nicht** den Modul-02-Code — und ohne Code-Änderung würden Klaus' `generateOwnSpore({stammCategories, guestCategories, ...})`-Aufrufe in der Endknoten-Andock-Phase die neuen Felder still ignorieren, statt sie in das signierte Spore-JSON aufzunehmen. **Was bewusst nicht geändert wurde:** `validateSporeMeta` (Stamm/Gast bleiben optional, non-Array-Eingaben werden still ignoriert wie bei `domainKeywords`); Disjunktheit-Prüfung (Hosting-Pflicht, kein `verifyForeignSpore`-Eingriff, keine Modul-02-Validierung); `verifyForeignSpore` (verifiziert kanonisch über das ganze Spore-JSON inkl. neuer Felder, ohne Sonderbehandlung — das war schon vor der Pflege so). **Keine §0-/§1-/§2-/§3-/§4-/§5-Änderung** (Vertrag steht seit Spec-Sitzung 2026-05-15, dieser Bau zieht nur die Implementation nach). Karte 02 § Bauzustand Zeile „Pflege Stamm/Gast-Durchreichung" ergänzt. `node --check src/modules/02_spore.js` grün. **`status.json` unverändert** (Modul 02 bleibt `score:"stub"`, kein Score-Wechsel). Pie nicht regeneriert. **`PROTOCOL_VERSION` bleibt `"0.1"`.** Übergabeprotokoll `docs/sessions/archiv/2026-05-15_bau-02-stamm-gast-felder-durchreichung.md` angelegt. |
| 2026-05-16 | Pflege PWA-Suffix Karten 01+09 | Folge-Pflege nach Live-Andock-Sitzung 2026-05-16 (Mein-Mixarium + Mein-Rezeptbuch live SBKIM-integriert, aber identische `nodeId` `1h5OPqqq...0Oq0` wegen IndexedDB-Origin-Kollision auf GitHub-Pages-Project-Sites — beide unter `lausiklauskn-png.github.io`, IndexedDB ist im Browser pro Origin, nicht pro Pfad; Cross-Knoten-Handshake technisch blockiert mit `pingStatus:"blocked-origin-collision"` für beide Endknoten in `status.json`). **§1 Modul 01 `init()` → `init(options?)`** mit optionalem `dbSuffix: string` (Pattern `^[a-z0-9_-]+$`); wenn gesetzt, öffnet Modul 01 die DB unter `"sbkim_<dbSuffix>"` statt der Default-DB `"sbkim"`. Verstösse gegen das Pattern werfen `InvalidDbSuffixError` SYNCHRON beim init-Aufruf (vor jedem Promise-Aufbau). dbSuffix muss beim ERSTEN init-Aufruf gesetzt werden — Modul 05/06/07/00 rufen `Storage.init()` intern selbst nach (idempotent; abweichender Suffix bei späterem init wirft `InvalidDbSuffixError`). **§1 Modul 01 Storage:** DB-Name-Zeile von `"sbkim"` auf „`"sbkim"` (Default, ohne dbSuffix); `"sbkim_<dbSuffix>"` wenn `init({dbSuffix})` gesetzt" erweitert. **§1 Modul 01 Fehlerverhalten** zwei Zeilen ergänzt (`InvalidDbSuffixError` synchron bei ungültigem Suffix, async bei zweitem init mit abweichendem Suffix). **Geprüft-Zeile** um 2026-05-16 erweitert. **Karten 01 + 09 nachgezogen:** Karte 01 § Schnittstelle (`init(options?)`), neuer Sub-Block „DB-Namen-Konvention (PWA-Suffix)" zwischen § Schnittstelle und § Stores (drei-Zeilen-Tabelle: Default → `sbkim`, `dbSuffix:"mixarium"` → `sbkim_mixarium`, `dbSuffix:"rezeptbuch"` → `sbkim_rezeptbuch`; vier Konventions-Punkte zur Aufrufer-Pflicht, Pattern-Validierung sync, ERSTER init-Aufruf, Modul 02 unangetastet); § Konfigurationswerte `DB_NAME` → `DB_NAME_DEFAULT` + neue Konstante `DB_SUFFIX_PATTERN`. Karte 09 § Vor dem Einbau zu klärende Werte neue Zeile `<DB_SUFFIX>` (Beispiele: `rezeptbuch` / `mixarium`); § Schritt 4 umbenannt von „`SbkimAnastomose.init()`" auf „`SbkimStorage.init({dbSuffix})` + `SbkimAnastomose.init()`" mit zwei sequenziellen `await`-Aufrufen + Begründung „Warum zwei Aufrufe statt einem?" (Modul 01 ist die einzige DB-Namen-Quelle; Storage.init muss ZUERST mit Suffix, dann Anastomose-Init nutzt idempotent dasselbe dbPromise). **Code:** `src/modules/01_storage.js` `init(options)` Allow-List + Validierung + `dbNameInUse`-State; `_meta.dbName` als Getter (Live-Zustand statt Build-Konstante). **Modul 02 bleibt unangetastet** (`IDENTITY_KEY = "main"` weiterhin Singleton-Schlüssel INNERHALB der jeweiligen DB — Trennung passiert eine Schicht tiefer, auf DB-Namen-Ebene). **Modul 05 bleibt unangetastet** (`SbkimAnastomose.init()` weiterhin ohne Optionen; Konstrukt erlaubt durch Idempotenz von `Storage.init`). **Keine Hauptversions-Erhöhung** (`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `3`). `node --check src/modules/01_storage.js` grün. **`status.json` unverändert** (Klaus' Re-Andock danach erzeugt frische nodeIds — `pingStatus` + `nodeId` werden in einer Folge-Sitzung aktualisiert, sobald beide Endknoten neue Spore-Files deployed haben). Pie nicht regeneriert. Übergabeprotokoll `docs/sessions/archiv/2026-05-16_pflege-pwa-suffix-karten-01-09.md` angelegt. |

| 2026-05-16 | Pflege Storage-Persist | Folge-Pflege direkt nach Pflege PWA-Suffix (2026-05-16, PR #?): Stufe (1) der drei-stufigen Identitäts-Persistenz-Architektur (PULS § Offene Querschnitts-Fragen „Identitäts-Persistenz"). **§1 Modul 01 Nutzt-Block** um Browser-API `navigator.storage.persist()` als optionalen Aufruf erweitert (Fail-soft-Note); **Geprüft-Zeile** um 2026-05-16 (Pflege Storage-Persist Stufe 1) erweitert. **Code:** `src/modules/01_storage.js` neue Helper-Funktion `requestStoragePersist()` (Closure-Scope), aufgerufen im `req.onsuccess` vor dem `resolve(db)`; setzt neuen Modul-Closure-State `storagePersisted` auf `true` / `false` (Browser-Entscheid) oder `null` (API nicht verfügbar, persist warf synchron, persist-Promise rejected — fail-soft, kein Throw, kein Reject). `_meta.storagePersisted` als Getter (Live-Zustand, Default `null` vor `init()`). Idempotenz beim Re-Init: `dbPromise`-Cache deckt das ab — persist() wird automatisch nur einmal pro Tab-Session gerufen. **Karte 01** § Schnittstelle init-Doc-Block um Persist-Hinweis ergänzt, § Risiken neuer Punkt „Persist-Verweigerung" (Chrome auto-bei-PWA, Firefox prompt, Safari restriktiv; Verlust-Pfade Stufe 2 Backup-Export Modul 02 + Stufe 3 Quota-Frühwarnung Modul 00 decken die übrigen Fälle ab), § Bauzustand-Zeile „Pflege Storage-Persist". **PULS** § Offene Querschnitts-Fragen „Identitäts-Persistenz" Stufe (1) mit ~~strikethrough~~ als gelöst markiert + Verweis aufs Übergabeprotokoll. **`tests/manual_check.html`** Panel 01 fünfter Knopf „Persist-Status zeigen" (gibt `_meta.storagePersisted` aus). **Modul 02 / 05 / 06 / 07 / 08 / 00 unangetastet** (persist greift transparent unter ihren `Storage.init()`-Pfaden). Stufen (2) Backup-Export und (3) Quota-Frühwarnung bleiben offen (eigene Folge-Spec-Sitzungen). Smoke-Test mit Node + stub-`navigator.storage.persist` (vier Fälle: resolved true, resolved false, API fehlt, persist rejected — alle grün; Resultate als Tabelle im Übergabeprotokoll). **Keine §0-Erweiterung** (keine Schwelle, keine Konstante; persist ist Browser-API). **Keine Hauptversions-Erhöhung** (`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `3`). `node --check src/modules/01_storage.js` grün. **`status.json` unverändert** (Modul 01 bleibt `score:"stub"`; additive Code-Erweiterung, kein Score-Wechsel). Pie nicht regeneriert. Übergabeprotokoll `docs/sessions/archiv/2026-05-16_pflege-01-storage-persist.md` angelegt. |
| 2026-05-16 | Spec-Sitzung Backup-Export Stufe 2 | Folge-Spec direkt nach Pflege Storage-Persist (selbiger Tag): Stufe (2) der drei-stufigen Identitäts-Persistenz-Architektur (PULS § Offene Querschnitts-Fragen „Identitäts-Persistenz"; § Spore-Persistenz-Strategie verteilt Modul-02-Punkt „Backup-Export"). **§0** drei neue Konstanten verankert: `BACKUP_FORMAT_VERSION = 1`, `BACKUP_KDF_ITERATIONS = 600000` (Pflicht-Frage 2 Variante b — OWASP 2023+), `BACKUP_PASSWORD_MIN_LEN = 8`. **§1 Modul 02 Bietet-Block** um zwei neue Funktionen erweitert: `exportBackup(password) → Promise<SbkimBackupBlob>` und `importBackup(blob, password, options?) → Promise<{restored, reason?}>` (options-Form `{force?: boolean}`); Selbstcheck-Format-Zeile auf zehn Funktionen erweitert. **§1 Modul 02 Nutzt-Block** um `SbkimStorage.all` (sbkim_siblings fail-soft beim Export), WebCrypto `crypto.subtle.importKey("raw", …, PBKDF2)` + `crypto.subtle.deriveKey(PBKDF2 → AES-GCM-256)` + `crypto.subtle.encrypt(AES-GCM)` + `crypto.subtle.decrypt(AES-GCM)` + `crypto.getRandomValues` (salt 16 Bytes + iv 12 Bytes) erweitert. **§1 Modul 02 Fehlerverhalten** um sechs Zeilen erweitert: `InvalidBackupPasswordError` (synchron), `NoIdentityError`-Durchreichung, `BackupDecryptError` (Sammel-Klasse — kein Oracle, unterscheidet absichtlich nicht zwischen falschem Passwort und korrupter Datei), `BackupVersionMismatchError`, `BackupSchemaError`, `BackupOverwriteError` (Pflicht-Frage 3 Variante a — defensiv, Vor-Check vor Crypto; Recovery in leerer PWA greift ohne force). **§1 Modul 02 Geprüft-Zeile** um 2026-05-16 (Spec-Sitzung Backup-Export Stufe 2) erweitert. **§2 Spore-JSON** Hinweis-Block am Ende des Verifikations-Pfads: „Backup-Format ist separat — Spore und Backup teilen nur den Identitäts-Schlüssel-Inhalt, das Wrapper-Schema lebt auf eigener Schicht; KEINE Spore-Feld-Erweiterung, `PROTOCOL_VERSION` bleibt `0.1`". **Karte 02** § Schnittstelle (zwei neue Funktionen API-Doc), neuer § Datenformat-Sub-Block „Backup-Format (SbkimBackupBlob)" (Wrapper-Schema PBKDF2/AES-GCM + Klartext-Payload-Schema `payload-schema-version=1` mit `nodeId`-Anker + `keys` + `spore` + `siblings`-Array + KDF-/Encrypt-Pfad verbindlich), § Storage Hinweis-Block „Backup-Inhalt" (Pflicht-Frage 1 Variante b — drei Stores, bewusst nicht im Backup: Log/Inbox/Outbox/Doku-Meta), neue § Konfigurationswerte (sechs Konstanten — drei in §0, drei modul-lokal: `BACKUP_PAYLOAD_SCHEMA_VERSION=1`, `BACKUP_KDF_SALT_BYTES=16`, `BACKUP_CIPHER_IV_BYTES=12`), § Fehlerverhalten (sechs neue Zeilen), § Risiken (drei neue Punkte: Passwort-Schwäche, Sicherheits-Schwelle Import-Überschreibung, Backup-Aktualität), § Bauzustand-Zeile „Spec Backup-Export Stufe 2". **PULS** § Offene Querschnitts-Fragen „Identitäts-Persistenz" Stufe (2)-Hinweis um „Spec fertig 2026-05-16" erweitert (bleibt offen, weil Bau noch aussteht — nicht mit strikethrough markiert); § Spore-Persistenz-Strategie verteilt Modul-02-Punkt „Backup-Export" mit Spec-Vermerk + Bauauftrag-Hinweis; Schnellüberblick-Tabelle Modul 02 Spec-Spalte erweitert; § Sitzungs-Einträge rotiert; § Archiv-Index neue Zeile oben. **KEIN Code** in `src/modules/02_spore.js` — Bau-Sitzung 02.X folgt als eigene Phase. **`PROTOCOL_VERSION` bleibt `"0.1"`** (Backup-Format ist eigene additive Versionierung, kein Spore-Feld); **`DB_VERSION` bleibt `3`** (kein Storage-Schema-Eingriff). **`status.json` unverändert** (Modul 02 bleibt `score:"stub"`, Spec-Erweiterung im Karten-Vertrag, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). Übergabeprotokoll `docs/sessions/archiv/2026-05-16_spec-02-backup-export.md` angelegt, drei Pflicht-Fragen ausführlich begründet. |
| 2026-05-16 | Bau 02.X Backup-Export | Folge-Bau zur Spec-Sitzung Backup-Export Stufe 2 (PR #52 gemerged), selbiger Tag. **Code in `src/modules/02_spore.js` additiv** (kein Refactoring der bestehenden sieben + `resetIdentityCache`-Funktionen): fünf benannte Error-Klassen im Factory-Stil analog Modul 00/08 (`InvalidBackupPasswordError` / `BackupDecryptError` Sammel-Klasse ohne Oracle / `BackupVersionMismatchError` / `BackupSchemaError` / `BackupOverwriteError`) — auf `window.SbkimSpore.<Error>` exportiert; drei §0-Konstanten modul-lokal gespiegelt (`BACKUP_FORMAT_VERSION=1` / `BACKUP_KDF_ITERATIONS=600000` / `BACKUP_PASSWORD_MIN_LEN=8`) + drei modul-lokale Konstanten aus Karte 02 § Konfigurationswerte (`BACKUP_PAYLOAD_SCHEMA_VERSION=1` / `BACKUP_KDF_SALT_BYTES=16` / `BACKUP_CIPHER_IV_BYTES=12`); neuer Closure-Helper `derivePbkdf2AesGcmKey(password, salt, iterations)` (PBKDF2-SHA-256 → AES-GCM-256 deriveKey, beide non-extractable, `["encrypt","decrypt"]` usages). **Helper-Reuse-Entscheidung 1 (canonical-JSON-stringify):** bestehender `canonicalize`/`canonicalJsonBytes`-Closure-Helper aus dem Spore-Sign-Pfad wird für die Backup-Payload-Serialisierung wiederverwendet — KEINE zweite Implementation, weil zwei kanonische Sort-Funktionen ein Spec-Bruch wären (Drift-Risiko bei Spore-Feld-Erweiterungen). **Helper-Reuse-Entscheidung 2 (base64url):** bestehende `base64urlEncode`/`base64urlDecode` aus dem nodeId-/Signatur-Pfad werden für salt/iv/ciphertext wiederverwendet, KEIN Refactoring. **Helper-Reuse-Entscheidung 3 (Identity-Cache-Reset):** `resetIdentityCache()` (Pflege-Sitzung 2026-05-15) wird als letzter Schritt vor `return {restored:true}` aufgerufen — KEIN neuer Cache-Reset-Pfad, der bestehende Hook deckt den Fall exakt ab. `exportBackup(password)` liest sbkim_keys["main"] + sbkim_spore["main"] direkt aus dem Storage (Roh-JWK-Form, NICHT über identityCache, weil dort nur die importierten CryptoKeys liegen, nicht die persistierten JWKs), liest sbkim_siblings fail-soft via try/catch um `SbkimStorage.all` (bei `UnknownStoreError` oder Cursor-Fehler → leeres Array), baut den Klartext-Payload mit `createdAt`/`keys`/`nodeId`/`siblings`/`spore`, verschlüsselt mit PBKDF2 + AES-GCM-256 und liefert den Wrapper-Blob. `importBackup(blob, password, options?)` macht alle Vor-Checks (Mindest-Länge sync, Wrapper-Version sync, Force-Schwelle async vor Crypto) VOR dem teuren PBKDF2-Aufruf; `iterations` wird aus `blob.kdf.iterations` gelesen — NICHT aus der §0-Konstante (Spec-Pflicht-Frage 2 „Hinweis zur Kompatibilität": ältere Backups mit niedrigeren Iterations müssen weiter importierbar bleiben, wenn die §0-Konstante später erhöht wird); Decrypt + JSON-Parse in einem try/catch-Block sammelt auf `BackupDecryptError` (Sammel-Klasse ohne Oracle); Schema-Check (payload-schema-version + Pflichtfelder `nodeId`/`keys.privateKey`/`keys.publicKey`/`spore`) wirft `BackupSchemaError` mit konkret-feld-Hinweis; Sibling-Loop additiv (put pro Eintrag, key=`s.nodeId`). Selbstcheck-Zeile auf zehn Funktionen erweitert: `init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache/exportBackup/importBackup`. **Modul-Kopfkommentar** um Pflege-Block „Bau 02.X Backup-Export (2026-05-16)" am Ende erweitert. **`_meta`** um vier Backup-Werte ergänzt (`backupFormatVersion`, `backupKdfIterations`, `backupPasswordMinLen`, `backupPayloadSchemaVersion`) + `siblingsStore`-Name. **Panel 02 in `tests/manual_check.html`** um drei Knöpfe erweitert: „Backup exportieren" (Knopf 6 — Passwort-Prompt, Blob-Log, Download-Link `sbkim-backup-YYYY-MM-DD.json` als `Blob`-URL; falls noch keine Spore existiert, wird `demoMeta` vor dem Export angelegt — sonst würde der Re-Import am Schema-Check scheitern), „Backup einlesen" (Knopf 7 — File-Picker + Passwort-Prompt; erster Versuch ohne `force`; bei `BackupOverwriteError` Bestätigungs-Zeile mit ALTER nodeId und Warntext, neue nodeId steht erst nach erfolgreichem Decrypt fest, deshalb nur die alte zum Vergleich; `pendingBackup`-Stash für den zweiten Knopf), „Identität ersetzen — unwiderruflich" (Knopf 7b — force-Pfad, scharf nur wenn `pendingBackup` gesetzt; nach Erfolg neue nodeId via `getNodeId()` geloggt). **Modul 00 / 01 / 03 / 04 / 05 / 06 / 07 / 08 unangetastet** (sbkim_siblings nur gelesen + geschrieben, kein Storage-Schema-Eingriff; Modul 01 § `SbkimStorage.all`-Signatur nur gelesen, nicht geändert). **Keine §0-Erweiterung** (die drei Konstanten standen schon aus Spec-Sitzung Backup-Export Stufe 2). **Keine §1-Modul-02-Vertrags-Änderung** (Vertrag steht seit der Spec-Sitzung, dieser Bau zieht nur die Implementation nach; nur Geprüft-Zeile um 2026-05-16 Bau 02.X erweitert). **Keine §2-/§3-/§4-/§5-Änderung.** **Keine Karte-00-/-01-/-03-/-04-/-05-/-06-/-07-/-08-/-09-/-14-Änderung.** **Kein Hauptversions-Sprung** (`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `3`, `BACKUP_FORMAT_VERSION` bleibt `1`; Backup ist Aufrufer-extern, geht in keinen SBKIM-Store). **Keine Sage-Page-(`index.html`)-Änderung.** `node --check src/modules/02_spore.js` grün; alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html` syntaktisch validiert. **`status.json` unverändert** (Modul 02 bleibt `score:"stub"`, additive Code-Erweiterung, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). **Sichttest ungeprüft** (headless gebaut — wartet auf Klaus' Browser-Lauf: PBKDF2-600 000-Aufruf-Zeit auf Galaxy Tab S6 ≤ 2 s, AES-GCM-Verhalten in Safari iOS). Übergabeprotokoll `docs/sessions/archiv/2026-05-16_bau-02x-backup-export.md` angelegt, drei Helper-Reuse-Entscheidungen mit Begründung dokumentiert. |
| 2026-05-16 | Pflege Persistenz-Strategie verbinden | Folge-Pflege direkt zu Bau 02.X Backup-Export (PR #54 gemerged, selbiger Tag) — schließt Stufe (3) und damit den gesamten Querschnitt „Identitäts-Persistenz" final ab. Zwei Phasen in einer Sitzung: **Phase 1** = reine Doku-Aktualisierung nach Klaus' Sichttest 2026-05-16 (Chrome auf Galaxy Tab S6 + DeX). Klaus hat Panel 02 Knöpfe 6/7/7b (Backup-Export Sichttest) grün durchgespielt und parallel die Panels 01–08 rasch grob durchgeklickt — alle Selbstchecks und Hauptpfade grün. Karten 02 § Bauzustand-Zeile „Sichttest (Bau 02.X)" auf „geprüft 2026-05-16" gesetzt (Knöpfe 6/7/7b mit Test-Panel-UX-Befund pendingBackup-Stash-Reset in Knopf 7 als offene Mini-Pflege dokumentiert, kein Modul-Bug); Karte 06 § Bauzustand-Sichttest-Zeile auf „rasch grob durchgeklickt" gesetzt (Panel 06 mit 14 Knöpfen, voller Test-1–9-Lauf folgt bei Bedarf); Karte 01 § Bauzustand neue Zeile „Sichttest Knopf 5 Persist-Status" auf „geprüft 2026-05-16, `_meta.storagePersisted: true`". PULS Schnellüberblick-Tabelle Modul 02/06/01 Sichttest-Spalten nachgezogen, Modul 06 aus der „Sichttest ausstehend"-Liste in die obere „geprüft"-Liste verschoben, Modul 02 oben um Bau-02.X-Sichttest-Vermerk erweitert. **Phase 2** = additive Code-Erweiterung in `src/modules/00_doku_fenster.js` (kein Refactoring der bestehenden Funktionen) — neue modul-lokale Konstante `DOKU_BACKUP_TIP_TEXT` mit dem Tipp-Wortlaut; `getStatusSnapshot()` liest `SbkimStorage._meta.storagePersisted` fail-soft (try/catch um den Getter; null/undefined/Wurf → `null` im Snapshot) und liefert das neue Feld `storagePersisted: boolean | null` zurück; zwei neue Render-Helfer `shouldShowBackupTip(snapshot)` (true wenn `storagePersisted === false` ODER `quota.warningLevel !== "none"`) und `renderBackupTip()` (blaue Hinweis-Zeile mit `DOKU_BACKUP_TIP_TEXT`-Wortlaut); Modal-Render-Pfad zeigt die Tipp-Zeile zwischen Quota-Warnung und Modulstand. **Hinweis-only** — kein Knopf, kein `SbkimSpore.exportBackup`-Aufruf (Aufrufer-Pflicht-Trennung, Karte 00 § Verantwortlichkeiten „Macht nicht"). `_meta` um `dokuBackupTipText` ergänzt (Test-Brücke kann den Wortlaut prüfen). **§1 Modul 00** Bietet-Block um die DokuStatus-Rückgabe-Form mit `storagePersisted: boolean | null` erweitert; Nutzt-Block um Lese-Recht auf `SbkimStorage._meta.storagePersisted` (fail-soft); Geprüft-Zeile um 2026-05-16. **Karte 00** § Datenformat um `storagePersisted`-Feld, neuer § Modal-Render-Pfad-Block mit Sub-Sektion „Backup-Tipp-Zeile" (Trigger-Bedingung, voller Wortlaut, Hinweis-only); § Konfigurationswerte um `DOKU_BACKUP_TIP_TEXT` (modul-lokal, NICHT in §0 — der Wortlaut ist Modul-00-Eigenheit, nicht querschnittsrelevant); § Risiken neuer Punkt „Backup-Tipp ist textlich, keine Selbstheilung"; § Manueller Test neuer Punkt 6 (Quota-Trigger und/oder `storagePersisted: false`-Mock); § Bauzustand zwei neue Zeilen („Pflege Persistenz-Strategie verbinden" Code + „Sichttest (Pflege Persistenz)" ungeprüft, weil headless gebaut). **PULS** § Offene Querschnitts-Fragen „Identitäts-Persistenz" Stufe (3) und damit ALLE drei Stufen mit `~~strikethrough~~` als gelöst markiert; § Spore-Persistenz-Strategie verteilt Modul-00-Punkt um „Doku-Fenster Backup-Tipp-Zeile"-Vermerk erweitert, der gesamte Querschnitts-Eintrag ebenfalls `~~strikethrough~~`-gelöst (Quota-Schwellwert Modul 00 + Backup-Format Modul 02 + Warntext Modul 00 alle drei verankert). Schnellüberblick-Tabelle Modul 00 Code-Spalte um „Pflege Persistenz-Strategie verbinden 2026-05-16". **Modul 01 unangetastet** (`_meta.storagePersisted` wird nur gelesen, nicht geändert); **Modul 02 unangetastet** (`exportBackup` wird im Tipp-Text genannt, nicht aufgerufen); **Modul 03 / 04 / 05 / 06 / 07 / 08 unangetastet**. **Test-Panel-UX-Fix für Knopf-7-pendingBackup-Reset** in dieser Sitzung NICHT gemacht (eigene Folge-Mini-Pflege — Test-Panel ist nicht Modul-Code, eigene Trennung). **Keine §0-Erweiterung** (`DOKU_BACKUP_TIP_TEXT` ist modul-lokal). **Keine §2-/§3-/§4-/§5-Änderung.** **Keine Karte-01-/-02-/-03-/-04-/-05-/-06-/-07-/-08-/-09-/-14-Vertragsänderung** (Karten 01 + 02 + 06 nur Sichttest-Zeilen aus Phase 1). **Kein Hauptversions-Sprung** (`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `3`, `BACKUP_FORMAT_VERSION` bleibt `1`). **Keine Sage-Page-(`index.html`)-Änderung.** `node --check src/modules/00_doku_fenster.js` grün. **`status.json` unverändert** (Modul 00 bleibt `score:"stub"`, additive Code-Erweiterung, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). **Sichttest (Pflege Persistenz) ungeprüft** (headless gebaut — wartet auf Klaus' Browser-Lauf: Quota-Trigger + `storagePersisted: false`-Mock + Beide-grün-Negativtest). Übergabeprotokoll `docs/sessions/archiv/2026-05-16_pflege-persistenz-strategie-verbinden.md` angelegt mit klar getrennten Phasen-Blöcken. |
