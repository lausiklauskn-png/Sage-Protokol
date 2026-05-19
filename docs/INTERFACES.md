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
BACKUP_FORMAT_VERSION    = 2            // Modul 02, Spec-Sitzung Backup-Export Stufe 2; Hauptversion des SbkimBackupBlob-Wrappers, additiv versioniert getrennt von PROTOCOL_VERSION und DB_VERSION. Bau 02.Y 2026-05-19 bumpt von 1 auf 2 — Multi-Identitäts-Backup-Schema mit Pflicht-Feld payload.identities[]; alte Backups (version === 1) bleiben importierbar (Rückwärts-Kompat).
BACKUP_KDF_ITERATIONS    = 600000       // Modul 02, Spec-Sitzung Backup-Export Stufe 2; PBKDF2-SHA256-Iterations (OWASP 2023+, Pflicht-Frage 2 Variante b)
BACKUP_PASSWORD_MIN_LEN  = 8            // Modul 02, Spec-Sitzung Backup-Export Stufe 2; Mindestlänge des Backup-Passworts (untere Validierungs-Schwelle, keine Komplexitäts-Pflicht; siehe Karte 02 § Risiken „Passwort-Schwäche")
SIBLING_MAX_AGE_MS     = 2592000000     // 30 Tage; TTL für Modul 07 forgetExpiredSiblings
HETERO_MAX_ANCHORS     = 5              // max. Anker pro Heterokaryose-Response; Modul 06, Spec-Sitzung 06
HETERO_OUTBOX_MAX_ENTRIES = 5           // max. Anker in sbkim_hetero_outbox; Modul 08, Spec-Sitzung 08
                                        //   (konsistent mit HETERO_MAX_ANCHORS — was in der Outbox steht,
                                        //    geht beim nächsten Pull raus; größere Outbox hätte
                                        //    nicht-erreichbare Anker zur Folge)
SCHICHT_MIN_MATCH      = 0.60           // Modul 04, Spec-Sitzung M04-Erweiterung (Brief 03 der V1-Sammelspec-
                                        //   Kaskade). Pro-Dimension-Schwelle für `matchDimensions` —
                                        //   eine Schicht darf fehlen (= häufiger Brücken-Anlass);
                                        //   2+ Dimensionen unter SCHICHT_MIN_MATCH = Apoptose.
                                        //   PROVIDER_MIN_MATCH=0.80 bleibt verbindlich für `overall`.
STUFE_B_DEFAULT_MODEL  = "claude-sonnet-4"   // Modul 04, Spec-Sitzung M04-Erweiterung; Default-Modell-
                                        //   ID für `explainMatchLLM` (Stufe-B-LLM-Call). Aufrufer darf
                                        //   per Optional-Parameter überschreiben (z.B. Nachfolge-Modell).
                                        //   Modul 04 hartcodiert die Modell-ID nicht — sie wird nur
                                        //   hier als Konvention verankert.
STUFE_B_MAX_TOKENS     = 1024           // Modul 04, Spec-Sitzung M04-Erweiterung; Default-`max_tokens`
                                        //   für den Stufe-B-LLM-Call. Aufrufer-überschreibbar.
                                        //   Pattern-Quelle: Layer-1-Demo der SBKIM-Plattform-`index.html`.
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

  DokuStatus-Form (siehe Karte 00 § Datenformate für die volle JSONC-
  Form): Pflicht-Felder nodeId / nodeIdShort / ownSporePresent / domain
  / nodeType / protocolVersion / siblings / siblingCount / legacy /
  legacyCount / modules / quota / openedAt / lastOpenedAt / errors,
  plus seit Pflege Persistenz-Strategie verbinden 2026-05-16 das Feld
  `storagePersisted: boolean | null` (Spiegelung des Modul-01-Getters
  `SbkimStorage._meta.storagePersisted`, fail-soft; null und true
  behandelt Modul 00 gleich — nur explizites false triggert die
  Backup-Tipp-Zeile im Modal-Render-Pfad).

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
  SbkimStorage._meta.storagePersisted          Pflege Persistenz-Strategie verbinden 2026-05-16.
                                                Live-Zustand-Getter aus Modul 01 (Pflege Storage-
                                                Persist 2026-05-16). Drei Werte: true|false|null.
                                                Modul 00 liest rein lesend mit typeof-Check (fail-
                                                soft); `null` und `true` behandelt es gleich (kein
                                                Warn-Trigger), nur explizites `false` triggert die
                                                Backup-Tipp-Zeile im Modal-Render-Pfad.
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

Geprüft: 2026-05-14 (Spec-Sitzung 00), 2026-05-16 (Pflege Persistenz-Strategie verbinden — Stufe 3)

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
  ensureStore(storeName: string)         → Promise<void>          // additive Anlage dynamischer Stores ab v=4

  ensureStore-Garantien (Bau 01.Y, § 9.5 Option A):
    - Idempotent: existierender Store → no-op-Promise (resolve undefined),
      kein Versions-Bump, keine Resource-Leakage.
    - Pattern-Check SYNCHRON: storeName muss dem Modul-01-Pattern
      ^sbkim_[a-z0-9_]+$ entsprechen (Modul-01-Pattern; ist NICHT
      identisch mit dem dbSuffix-Pattern ^[a-z0-9_-]+$ aus init() —
      dbSuffix kennt zusätzlich '-', Store-Namen verbieten den Trenner,
      und Store-Namen tragen den 'sbkim_'-Präfix). Verstoss wirft
      InvalidStoreNameError SYNCHRON vor jedem Promise-Aufbau.
    - Kein UnknownStoreError — ensureStore *erzeugt* den Store, wirft also
      nicht für unbekannte Namen (anders als getStore/get/put/del/all/clear).
    - Nach erfolgreichem ensureStore ist der Store regulär in
      getStore/get/put/del/all/clear nutzbar (KNOWN_STORES wird
      erweitert).
    - KEINE Datenmigration alter Stores, KEINE neuen Indices auf
      bestehenden Stores — strict additiv.
    - Aufrufer trägt die Identitäts-Konvention. Modul 01 kennt
      Identität NICHT; der Modul-02-Folge-Bau 02.Y liefert den
      `_<key>`-Suffix.

  init-Garantien (Pflege „init() versions-fail-soft", 2026-05-19):
    - DB_VERSION ist Mindest-Schema-Version, nicht Ziel-Version.
      init() respektiert existing DB-Versionen > DB_VERSION (entstanden
      durch ensureStore-Bumps in früheren Sitzungen) und übernimmt sie,
      ohne onupgradeneeded zu triggern oder VersionError zu werfen.
    - Initial-Pfad (existing < DB_VERSION oder DB existiert nicht):
      indexedDB.open(name, DB_VERSION) mit onupgradeneeded,
      applyMigration pro Pflicht-Version. Bestehender Bau-01.Y-Pfad
      unverändert.
    - Fail-soft-Pfad (existing >= DB_VERSION): Probe-Open ohne
      Version-Parameter liest existing.version; Pflicht-Stores aus
      STORES_V1/V2/V3/V4 werden sync geprüft
      (objectStoreNames.contains); bei vollständigem Schema wird die
      existing Version übernommen und eine reguläre Verbindung via
      indexedDB.open(name, existing.version) ohne onupgradeneeded
      eröffnet. Bei fehlendem Pflicht-Store wirft init()
      StorageOpenError mit der Liste der fehlenden Stores — Modul 01
      repariert manuell zerstörte DBs NICHT (Klaus' Verantwortung).
    - Test-Stores aus früheren ensureStore-Aufrufen (z.B. sbkim_test_*
      aus Sichttest-Sessions) blockieren den nächsten init() NICHT mehr.
      Klaus' Cleanup-Workaround „Browserdaten löschen + Storage init
      klicken" aus Bau 01.Y / 02.Y entfällt damit.
    - Multi-Tab-Race-Risiko (bekannte Limitierung): zwischen Probe-Open
      und Re-Open kann ein anderer Tab einen ensureStore-Bump auf
      existing.version + 1 machen; das Re-Open mit existing.version
      würde dann VersionError werfen. Praktisch selten in Klaus'
      Single-Tab-Standard-Setup; in Karte 01 § Risiken notiert.

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
  DB-Version: 4          (Bau 01.Y, 2026-05-19: additive Erweiterung — STORES_V4 leer, weil v=4 KEINEN festen
                          Pflicht-Store anlegt; v=4 markiert den Übergang zu „dynamische Stores via ensureStore"
                          gemäß § 9.5 Option A. Bestehende v=3-Migration unverändert; v=2 / v=3 aus Bau 06 /
                          Pflege Bau 06.1 unangetastet)
  Dynamische Stores ab DB-Version 4: zulässig via ensureStore(storeName),
    Pattern ^sbkim_[a-z0-9_]+$ (Modul-01-Pattern, modul-lokale Konstante
    STORE_NAME_PATTERN). STORES_V1/V2/V3 sind der initiale Migrations-
    Pfad und bleiben verbindliche Pflicht-Stores; STORES_V4 ist leer
    (kein zusätzlicher Pflicht-Store in v=4 — neue Stores entstehen erst
    durch Aufrufer-getriebene ensureStore-Calls in späteren Bau-Sitzungen).
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
    console.info("MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear/ensureStore");

Fehlerverhalten:
  - init({dbSuffix}) mit ungültigem Suffix     → InvalidDbSuffixError (SYNCHRON, vor Promise-Aufbau)
  - init({dbSuffix}) nach erstem init mit
    abweichendem Suffix                        → InvalidDbSuffixError (async, kein stilles Ignorieren)
  - Privatmodus / IDB nicht verfügbar          → init() rejects mit StorageUnavailableError
  - Unbekannter Store                          → UnknownStoreError (synchron bei getStore, async sonst)
  - Quota überschritten                        → QuotaExceededError (vom Browser durchgereicht)
  - Nicht-klonbarer Wert                       → DataCloneError
  - DB-Open scheitert                          → StorageOpenError (keine Auto-Reparatur)
  - ensureStore(name) mit Pattern-Verstoß      → InvalidStoreNameError (SYNCHRON, vor Promise-Aufbau;
                                                  Modul-01-Pattern ^sbkim_[a-z0-9_]+$)
  - ensureStore(name) Versions-Bump-Choreografie
    schlägt fehl (anderer Tab blockiert
    onversionchange, IDBOpenDBRequest.onerror,
    IDBOpenDBRequest.onblocked)                → EnsureStoreError (async; cause-Property trägt die
                                                  IDBOpenDBRequest-Error-Reason)

Geprüft: 2026-05-14 (Spec-Sitzung 01+03), 2026-05-16 (Pflege PWA-Suffix Karten 01+09), 2026-05-16 (Pflege Storage-Persist Stufe 1), 2026-05-19 (Bau 01.Y `ensureStore`), 2026-05-19 (Pflege `init()` versions-fail-soft)

---

### Modul: 02_spore
Status: entwurf
Datei:  src/modules/02_spore.js

Bietet (öffentlich):
  init()                              → Promise<void>
  getOrCreateIdentity(key?: string)   → Promise<{ nodeId: string, publicKeyJwk: JsonWebKey }>
                                                                    // Default-Parameter key="main" (Rückwärts-Kompat zum Singleton-
                                                                    // Vertrag aus Spec-Sitzung 02 2026-05-14). Multi-Identität:
                                                                    // Spec-Sitzung Multi-Identität (Brief 04 der V1-Sammelspec-
                                                                    // Kaskade, 2026-05-19). Siehe § 9 Identitäts-Map.
  getNodeId()                         → Promise<string>          // base64url(sha256(rawPub)), ohne Padding;
                                                                    // bezieht sich auf die AKTIVE Identität (sbkim_meta["active-identity"]).
  getPublicKeyJwk()                   → Promise<JsonWebKey>      // OKP / Ed25519; aktive Identität.
  generateOwnSpore(meta, key?: string)→ Promise<SporeJson>       // signiert + persistiert.
                                                                    // Default-Parameter key=getActiveIdentityKey(). Brief 04 (Multi-
                                                                    // Identität): schreibt nach sbkim_spore[key]. Pro Identität existiert
                                                                    // ein eigener Spore-Slot mit eigener embeddingCapabilities +
                                                                    // embeddingNeeds (M04-Erweiterung pro Persona).
  getOwnSpore(key?: string)           → Promise<SporeJson | null>
                                                                    // Default-Parameter key=getActiveIdentityKey(). Liefert Spore
                                                                    // der angegebenen Identität (null wenn Slot fehlt).
  verifyForeignSpore(spore)           → Promise<{ valid: boolean, reason?: string }>
  setActiveIdentity(key: string)      → Promise<void>            // Spec-Sitzung Multi-Identität (Brief 04).
                                                                    // Schreibt sbkim_meta["active-identity"] = key. Validiert,
                                                                    // dass key in sbkim_keys existiert — sonst UnknownIdentityError
                                                                    // (kein Storage-Eingriff). Idempotent: wenn key bereits aktiv,
                                                                    // resolves ohne Storage-Schreibvorgang. resetIdentityCache()
                                                                    // wird intern gerufen, sodass nachfolgende getNodeId/getOwnSpore-
                                                                    // Aufrufe die neue Identität liefern.
  getActiveIdentityKey()              → Promise<string>          // Spec-Sitzung Multi-Identität (Brief 04). Liest
                                                                    // sbkim_meta["active-identity"]; Default "main", falls fehlend
                                                                    // (Rückwärts-Kompat zum Singleton-Vertrag).
  listIdentities()                    → Promise<string[]>        // Spec-Sitzung Multi-Identität (Brief 04). Alle Schlüssel in
                                                                    // sbkim_keys (lexikographisch sortiert für stabile Reihenfolge).
                                                                    // Leeres Array, wenn noch keine Identität angelegt wurde.
  removeIdentity(key: string, options?: { force?: boolean })
                                      → Promise<boolean>          // Spec-Sitzung Multi-Identität (Brief 04). Löscht den
                                                                    // Identitäts-Slot key inkl. allen identitäts-spezifischen Stores.
                                                                    // options-Form: { force?: boolean } (Default false).
                                                                    // - force:false → RemoveActiveIdentityError, wenn key === active-identity
                                                                    //   (defensiver Schutz vor versehentlicher Selbstauslöschung).
                                                                    // - force:true  → löscht auch die aktive Identität; setzt
                                                                    //   active-identity auf "main", falls dort noch eine Identität liegt;
                                                                    //   sonst auf den ersten Schlüssel aus listIdentities() (lexikographisch);
                                                                    //   sonst (kein Slot mehr) wird sbkim_meta["active-identity"] gelöscht.
                                                                    // - key === active-identity → Vermächtnis-Versand pro Persona (siehe
                                                                    //   Modul 07). Single-Identitäts-Apoptose im Sinne von Brief 04 §
                                                                    //   Trade-off-Klausel. Bei key !== active-identity wird KEIN
                                                                    //   Vermächtnis verschickt — die andere Persona ist nicht
                                                                    //   „gestorben", sie wird nur lokal vergessen.
                                                                    // Löscht in dieser Reihenfolge: sbkim_keys[key], sbkim_spore[key],
                                                                    // sbkim_siblings_<key> (Store), sbkim_hetero_inbox_<key> (Store),
                                                                    // sbkim_legacy_inbox_<key> (Store), sbkim_anastomosis_log_<key>
                                                                    // (Store). resetIdentityCache() wird am Ende gerufen.
                                                                    // Rückgabe: true wenn gelöscht, false wenn key unbekannt
                                                                    // (idempotent — wie forgetSibling). Bestätigungs-Konvention auf
                                                                    // Anwendungs-Ebene: UI muss vor dem Aufruf bestätigen; Modul 02
                                                                    // selbst hat keinen Bestätigungs-Token.
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

  Identitäts-Slot-Vertrag (Spec-Sitzung Multi-Identität, Brief 04,
  2026-05-19): sbkim_keys und sbkim_spore tragen jeweils einen
  Identitäts-Slot pro key. Default-Slot "main" bleibt verbindlich
  (Rückwärts-Kompat zum Singleton-Vertrag aus Spec-Sitzung 02
  2026-05-14). Zusätzliche Slots können beliebig viele weitere keys
  tragen (frei wählbare Strings, [a-z0-9-]+ empfohlen — Modul 02
  validiert nicht, der Aufrufer trägt Verantwortung für sinnvolle
  Schlüsselnamen). Die AKTIVE Identität steht in
  sbkim_meta["active-identity"]; Default "main", falls fehlend. Siehe
  § 9 Identitäts-Map für den vollständigen Vertrag.

  Schlüssel-Erzeugung ist lazy: passiert beim ersten
  getOrCreateIdentity(key)-Aufruf für den jeweiligen key, nicht beim
  Skript-Laden. Vor Brief 04 als „Singleton beim ersten
  getOrCreateIdentity()" beschrieben; der Mechanismus bleibt
  identisch — lediglich um den optionalen key-Parameter erweitert.

  Spore-Schema-Erweiterung M04 (Spec-Sitzung M04-Erweiterung, Brief 03
  der V1-Sammelspec-Kaskade, 2026-05-19): generateOwnSpore akzeptiert
  zwei zusätzliche optionale meta-Felder, beide additiv und
  signaturpflichtig wenn vorhanden:
    - embeddingCapabilities : Float32Array(384) | number[384]
                              Alias-Name für domainVector (selbe Semantik:
                              "was kann dieser Knoten anbieten"). Wenn
                              vorhanden, wird er kanonisch in das Spore-
                              JSON aufgenommen wie domainVector. Eine
                              Spore darf domainVector ODER embeddingCapabilities
                              ODER beide tragen (siehe § 2 Spore-JSON
                              § Optionale Felder).
    - embeddingNeeds         : Float32Array(384) | number[384]
                              Neues Feld für den Sucher-Vektor ("was
                              sucht dieser Knoten"). Wenn fehlend oder
                              null: "nur Anbieter-Modus" (kein
                              Bidirektionalitäts-Test bei matchDimensions).
                              Modul 04 nimmt das fail-soft an.
  Beide Felder gehen in den kanonischen Sign-/Verify-Pfad ein (Array-
  Elemente bleiben in geschriebener Reihenfolge, Object-Keys werden
  alphabetisch sortiert — siehe § 2). PROTOCOL_VERSION bleibt "0.1" —
  beide Felder sind optional, alte Sporen ohne sie bleiben gültig.

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
  Stores: sbkim_keys, sbkim_spore, sbkim_meta (alle aus Modul 01).
  Schreib-Keys vor Brief 04: ausschließlich "main" (Singleton).
  Schreib-Keys nach Brief 04: beliebig viele Identitäts-Slot-Keys; "main"
    bleibt Default-Slot. Identitäts-Map-Vertrag in § 9.
  Werteform sbkim_keys[key]:   { keyId: string, privateKey: JsonWebKey, publicKey: JsonWebKey }
  Werteform sbkim_spore[key]:  { nodeId: string, sporeJson: SporeJson, signature: string }
    sporeJson enthält die Signatur bereits im Feld "signature"; auf der
    Wrapper-Ebene wird sie redundant gehalten, damit Modul 05 ohne
    Re-Parse darauf zugreifen kann.
  sbkim_meta["active-identity"]: string  (Spec-Sitzung Multi-Identität,
    Brief 04). Lokaler Marker, kein Spore-Feld, wird NICHT über das
    Netz transportiert. Default "main", wenn fehlend.

Events:
  (keine — keine Pub/Sub. Andere Module rufen die Funktionen direkt.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/setActiveIdentity/getActiveIdentityKey/listIdentities/removeIdentity/resetIdentityCache/exportBackup/importBackup");
  Wie Modul 01 — die Meldung signalisiert "Modul geladen", nicht
  "Identität existiert". Die Multi-Identitäts-Funktionen (Brief 04)
  sind in der Selbstcheck-Zeile aufgeführt, weil sie öffentliche API
  sind — der Selbstcheck nennt KEINE Identitäts-Slot-Keys, weil die
  Slot-Liste aufrufer-getrieben ist.

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
  - setActiveIdentity(key): key nicht in sbkim_keys
                                          → UnknownIdentityError (kein Storage-Schreibvorgang;
                                            aktive Identität bleibt unverändert; Spec-Sitzung
                                            Multi-Identität, Brief 04).
  - removeIdentity(key, {force:false}): key === sbkim_meta["active-identity"]
                                          → RemoveActiveIdentityError (kein Storage-Eingriff;
                                            Aufrufer muss force:true setzen oder zuerst die
                                            aktive Identität wechseln; Spec-Sitzung Multi-
                                            Identität, Brief 04).
  - removeIdentity(key) bei unbekanntem key
                                          → KEIN Throw; resolves mit false (idempotent, analog
                                            forgetSibling).

Garantien für Modul 05 / 06 / 07:
  - Identitäts-Stabilität: getNodeId(/* aktive Identität */) liefert
    über die gesamte Lebenszeit derselben PWA denselben String, solange
    weder setActiveIdentity gerufen wird noch sbkim_keys[active]
    storage-extern entfernt wird. Identitäts-Wechsel (setActiveIdentity)
    invalidiert den Cache und ändert die folgende getNodeId-Antwort.
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
  - Aktive Identität als Lese-Konvention (Brief 04): Modul 05 / 06 / 07
    rufen SbkimSpore.getActiveIdentityKey() in ihren init()-Pfaden und
    cachen den Wert für die Lebenszeit der jeweiligen Operation. Ein
    Identitäts-Wechsel mid-Operation ist NICHT spezifiziert und nicht
    geliefert; eine Folge-Spec-Sitzung darf einen aktiven Hook für
    Mid-Operation-Wechsel spezifizieren.

Geprüft: 2026-05-14 (Spec+Bau-Sitzung 02), 2026-05-15 (Pflege-Sitzung 02+07-Cache-Invalidate), 2026-05-15 (Bau 02 Stamm/Gast-Felder), 2026-05-16 (Spec-Sitzung Backup-Export Stufe 2), 2026-05-16 (Bau 02.X Backup-Export Code-Stub), 2026-05-19 (Spec-Sitzung Multi-Identität — Brief 04 der V1-Sammelspec-Kaskade), 2026-05-19 (Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump)

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
  matchDimensions(queryCap: Float32Array | null,
                  queryNeeds: Float32Array | null,
                  passageCap: Float32Array | null,
                  passageNeeds: Float32Array | null)        → MatchDimensionsResult
                                                                       // sync; M04-Erweiterung (Brief 03,
                                                                       // 2026-05-19). Drei orthogonale
                                                                       // Schichten + overall. Null-Vektoren
                                                                       // signalisieren „nur Anbieter-Modus"
                                                                       // (siehe § Drei-Schichten-Modell).
  explainMatchLLM(matchResult: MatchDimensionsResult,
                  apiKey: string,
                  options?: { model?: string, maxTokens?: number,
                              abortSignal?: AbortSignal })  → Promise<ExplainResult>
                                                                       // async; M04-Erweiterung (Brief 03).
                                                                       // Stufe-B-LLM-Call, opt-in pro Knoten.
                                                                       // Fehlertolerant — siehe § Stufe-B-
                                                                       // Vertrag und § 7 LLM-Stufe-B-
                                                                       // Ehrlichkeits-Klausel.
  PROVIDER_MIN_MATCH                                       : number    // 0.80, aus §0 hierher gespiegelt
  SCHICHT_MIN_MATCH                                        : number    // 0.60, aus §0 hierher gespiegelt (M04-Erweiterung)

  KEIN mode-Parameter für `match`. Skalarprodukt ist symmetrisch; die
  Parameter-Namen sind reine Lese-Hilfe für den Aufrufer. Reine Funktion,
  kein Promise, kein async.
  `matchDimensions` ist ebenfalls sync (drei Cosinus-Aufrufe + Gewichtung),
  kein Promise. `explainMatchLLM` ist der einzige async-Pfad und der
  einzige, der Netz berührt — alle anderen Modul-04-Funktionen sind
  zustandslos und lokal.

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
  - matchDimensions: alle vier Vektoren null  → DimensionsAllNullError (sync throw — keine Schicht
                                                berechenbar; Aufrufer hätte vor dem Aufruf prüfen müssen).
                                                Drei oder weniger null sind erlaubt (siehe § Drei-Schichten-
                                                Modell § „Nur-Anbieter-Modus").
  - matchDimensions: eine Seite vollständig null
    (z.B. queryCap=null UND queryNeeds=null)  → KEIN Throw. Ergebnis: alle drei Schichten und overall
                                                tragen `null`, plus `availableLanes: 0` — der Aufrufer
                                                entscheidet, was das bedeutet (typisch: kein Bidirektionalitäts-
                                                Test, Single-Vector-Pfad über `match()` ist Aufrufer-Wahl).
  - explainMatchLLM: apiKey leer / kein String → InvalidApiKeyError (sync throw vor Netz-Aufruf).
  - explainMatchLLM: matchResult fehlerhaft (kein MatchDimensionsResult)
                                              → InvalidMatchResultError (sync throw vor Netz-Aufruf).
  - explainMatchLLM: LLM-API HTTP-Fehler (4xx/5xx, Timeout, Netz)
                                              → KEIN Throw. Resolved mit ExplainResult{ available:false,
                                                reason:"<deutscher Klartext>", fallbackScore:overall }.
                                                Aufrufer fällt auf Stufe-A-Resultat zurück; UI zeigt
                                                „Erklärung nicht verfügbar". Siehe § Stufe-B-Vertrag.
  - explainMatchLLM: LLM-Antwort kein valides JSON oder Schema-Mismatch
                                              → KEIN Throw. Resolved mit ExplainResult{ available:false,
                                                reason:"Antwort entsprach nicht dem Schema",
                                                fallbackScore:overall }. Modul 04 verwirft die
                                                LLM-Antwort still — kein Halb-Resultat.
  - explainMatchLLM: abortSignal triggert      → AbortError (Standard-DOM-Verhalten, durchgereicht).
                                                Aufrufer ist verantwortlich, das aufzufangen.

Garantien für Modul 05 / 06 / 07 / 08:
  - match() ist deterministisch und reproduzierbar (kein RNG, kein Zeit-Effekt).
  - Bei korrekt L2-normalisierten Eingaben liegt der Rückgabewert in [-1, 1].
  - isAboveProviderThreshold(score) liefert exakt score >= 0.80, ohne
    Toleranz-Spielraum. Wer Hysterese will, baut sie eine Schicht höher.
  - matchDimensions() ist ebenfalls deterministisch und reproduzierbar — drei
    Cosinus-Aufrufe + gewichteter Mittelwert für `overall`. Kein Promise,
    kein async (M04-Erweiterung).
  - explainMatchLLM() ist der EINZIGE Modul-04-Pfad, der Netz berührt
    und der EINZIGE async-Pfad. Aufrufer (typisch Modul 06 / 08 / 00)
    drosseln selbst (Rate-Limit-Awareness ist Aufrufer-Pflicht — Modul 04
    fügt keine eigene Drossel ein). Stufe B ist opt-in pro Knoten — siehe
    § 7 LLM-Stufe-B-Ehrlichkeits-Klausel.
  - Brücken-Vorschläge aus explainMatchLLM bleiben LOKAL — Modul 04
    sendet sie nicht über das Netz, und der Aufrufer ist an die
    Anti-Missbrauch-Klausel in § 8 gebunden (candidateScope:"netz" ist
    formal nicht aktivierbar bis Anker 10-12 gebaut sind).

Geprüft: 2026-05-14 (Spec+Bau-Sitzung 04), 2026-05-19 (Spec-Sitzung M04-Erweiterung — Brief 03 der V1-Sammelspec-Kaskade — drei Schichten, Brücken-Feld, Stufe-A/Stufe-B-Pipeline additiv), 2026-05-19 (Bau 04.A `matchDimensions` sync)

#### Drei-Schichten-Modell (M04-Erweiterung)

Spec-Sitzung M04-Erweiterung (Brief 03 der V1-Sammelspec-Kaskade,
2026-05-19) führt die drei orthogonalen Schichten aus dem
ursprünglichen SBKIM-Paper (`docs/papers/sbkim-paper-en.html` § 3.3
„The Three Dimensions" / `docs/papers/sbkim-paper-de.html` § 3.3) in
die Mycel-Form ein. Die Schichten sind **orthogonal** — ein hoher
Score in einer Dimension impliziert keinen hohen Score in einer
anderen. Das erlaubt teil-kompatible Treffer und gezielte
Brücken-Vorschläge (siehe § Brücken-Feld unten).

```
fachlich    (= domain im Paper)
            : Was kannst du / was suchst du inhaltlich?
              Domain-Match: dasselbe Problem-/Themen-Feld.
              Beispiel: Kochrezepte ↔ Backrezepte = hoch;
                        Kochrezepte ↔ Cocktails    = mittel (Speise-/Trink-Nachbarschaft);
                        Kochrezepte ↔ Astrophysik = niedrig.

prozess     (= process im Paper)
            : Wie arbeitest du? Rhythmus, Methodik, Verbindlichkeit.
              Workflow-Kompatibilität: passen die Arbeitsweisen
              zusammen? Beispiel: täglich kuratierter Knoten ↔
              monatlich kuratierter Knoten = niedriger Prozess-Match;
              beide täglich = hoher Prozess-Match.

skalierung  (= scale im Paper)
            : Auf welcher Größenebene? Einzelner Knoten / Cluster / Netz.
              Kapazität, Wachstum, Reichweite. Beispiel: Single-User-PWA
              ↔ Single-User-PWA = passt; Single-User-PWA ↔
              hundert-Knoten-Cluster = Skalierungs-Mismatch.
```

`matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds)`
nimmt vier Vektoren entgegen (jeder optional, jeder ein
`Float32Array(384)` oder `null`) und liefert:

```
MatchDimensionsResult = {
  fachlich   : number | null,   // [-1, 1] oder null wenn nicht berechenbar
  prozess    : number | null,
  skalierung : number | null,
  overall    : number | null,   // gewichteter Mittelwert der nicht-null Schichten
  availableLanes : number       // 0..2: wie viele Richtungs-Vergleiche
                                //   gerechnet wurden (Cap×Needs in beiden
                                //   Richtungen). 0 = nichts berechnet
                                //   (Single-Anbieter ↔ Single-Anbieter ohne
                                //   needs); 1 = einseitig (eine Seite hat
                                //   keinen needs-Vektor — Anbieter-Modus);
                                //   2 = volle Bidirektionalität.
}
```

**Berechnung pro Lane:** wenn `queryCap` und `passageNeeds` beide
nicht-null sind, ist Lane 1 berechenbar (A bietet → B sucht); wenn
`queryNeeds` und `passageCap` beide nicht-null sind, ist Lane 2
berechenbar (A sucht ← B bietet). Pro Lane wird `match(cap, needs)`
ausgeführt. Wenn beide Lanes berechenbar sind, ist die Schicht-Score
der Mittelwert beider Lane-Cosinus; wenn nur eine Lane berechenbar
ist, der Single-Lane-Wert; wenn keine berechenbar, `null`.

**Aufteilung in drei Schichten (Spec-Entscheidung):** Da die heutigen
Embedding-Vektoren `domainVector` ein einziges Domain-Embedding pro
Knoten tragen (kein separater Prozess- oder Skalierungs-Vektor), ist
die Drei-Schichten-Aufteilung in der Stufe-A-Pipeline eine **Heuristik
über demselben 384-dim Embedding-Raum**: das Modul rechnet drei
Lane-Cosinus, kommt aber zu drei semantisch leicht unterschiedlichen
Schicht-Zahlen, indem es jede Schicht mit einem festen
Schicht-Projektions-Gewicht pro Lane multipliziert (Initial-Gewicht:
identisch — `fachlich = prozess = skalierung = Lane-Cosinus`).
**Die echte Schichten-Differenzierung passiert in Stufe B** — der
LLM-Pass kann den Embedding-Lane-Cosinus durch semantisch reichere
Schicht-Zahlen ergänzen oder übersteuern (siehe § Stufe-B-Vertrag).

Spätere Pflege-Sitzungen dürfen die Schicht-Projektion verfeinern
(z.B. separate `embeddingProcessNeeds` / `embeddingScaleNeeds`-Felder
einführen, sobald empirische Daten zeigen, dass das nötig ist); das
ist ein additiver Eingriff am Spore-Schema (heute optional, künftig
möglicherweise Pflicht → dann PROTOCOL_VERSION-Bump).

**Overall-Berechnung:** `overall` ist der **gewichtete Mittelwert**
der nicht-null Schichten — `(fachlich + prozess + skalierung) / 3`,
wenn alle drei vorhanden sind; sonst Mittelwert über die nicht-null
Schichten. **Spec-Begründung Mittelwert vs. Min:** Mittelwert lässt
eine ein-Dimensions-Schwäche überspielen, wenn die anderen zwei
deutlich überschwellig sind (= Brücken-Anlass, kein Apoptose-Anlass);
Min wäre zu hart — eine einzige schwache Dimension würde Anastomose
verhindern, obwohl genau diese Lücke der Anlass für aktive Vermittlung
sein könnte. Die Schwellen-Tafel unten setzt die harte Apoptose-
Grenze separat (2+ Dimensionen unter `SCHICHT_MIN_MATCH = 0.60`).

**Nur-Anbieter-Modus:** Wenn `queryNeeds === null` UND `passageNeeds
=== null`, ist `availableLanes = 0`. Das ist heute der Default-Stand
für alle Sporen ohne `embeddingNeeds`-Feld (siehe § 1 Modul 02 §
Spore-Schema-Erweiterung M04). In diesem Modus liefert
`matchDimensions` alle Schichten als `null` zurück — der Aufrufer
sollte stattdessen den Single-Vector-Pfad `match(domainVectorA,
domainVectorB)` nutzen und die alte einseitige Auswertung fahren
(rückwärts-kompatibel zum heutigen Modul-05-Vertrag).

#### Brücken-Feld-Spec (M04-Erweiterung)

Brücken-Vorschlag = das Element in der Match-Antwort, das sagt: „was
würde diese Verbindung vollständig machen?" Anlass: A und B matchen
in zwei Schichten gut, in der dritten aber schlecht — der
Brücken-Vorschlag nennt einen abstrakten Knoten-C, der die Lücke
schließen könnte. Brücken-Vorschläge entstehen **ausschließlich** in
Stufe B (`explainMatchLLM`) — die Stufe-A-Pipeline rechnet keine
Brücken-Empfehlungen.

```
BridgeProposal = {
  needed         : string,          // deutscher Klartext, was fehlt
                                    //   Beispiel: „Knoten mit täglicher
                                    //   Rezept-Pflege, der auch
                                    //   Cocktail-Inhalte trägt"
  lookingFor     : string | null,   // deutscher Klartext, was gesucht
                                    //   wird (oder null, wenn die
                                    //   Lücke einseitig auf der
                                    //   Empfänger-Seite liegt)
  candidateScope : "lokal" | "mailbox" | "netz"
                                    //   "lokal"   = Anzeige nur im Knoten,
                                    //              kein Netz-Schritt.
                                    //              Heute der EINZIGE
                                    //              produktiv aktivierbare
                                    //              Wert (siehe § 8
                                    //              Anti-Missbrauch).
                                    //   "mailbox" = Anker an Modul 13
                                    //              Königin-Relay (Vision-
                                    //              Anker 4, PULS); Brücken-
                                    //              Vorschlag wird in die
                                    //              Königin-Mailbox gelegt,
                                    //              sobald Modul 13 gebaut
                                    //              ist. Vor Modul 13 NICHT
                                    //              aktivierbar.
                                    //   "netz"    = FORMAL NICHT AKTIVIERBAR
                                    //              bis Anker 10/11/12
                                    //              (Reputation / Rate-Limit /
                                    //              Blocklist) gebaut sind.
                                    //              Siehe § 8 Anti-Missbrauch.
}
```

Wer einen Brücken-Vorschlag-Eintrag mit `candidateScope:"netz"` an
Modul 06 übergeben würde, wird vom Heterokaryose-Modul (Karte 06)
gefiltert (kein Versand). Stufe B darf `candidateScope:"netz"` heute
nicht selbständig setzen — wenn die LLM-Antwort das Feld auf `"netz"`
setzt, korrigiert Modul 04 still auf `"lokal"` (defensive Wahl, kein
Throw). Diese Korrektur entfällt erst, wenn Anker 10-12 implementiert
und freigegeben sind.

#### Schwellen-Vertrag (M04-Erweiterung)

```
PROVIDER_MIN_MATCH = 0.80     // bleibt für `overall` (alte Pipeline + neue)
SCHICHT_MIN_MATCH  = 0.60     // pro Dimension (neu, §0)
```

Auswertungs-Regeln (in dieser Reihenfolge):

1. **Wenn `availableLanes === 0` (Nur-Anbieter-Modus):** Aufrufer
   nutzt `match()` + `isAboveProviderThreshold()` wie bisher.
   `matchDimensions` ist hier nicht anwendbar.

2. **Wenn `availableLanes >= 1` und `overall < PROVIDER_MIN_MATCH`:**
   Apoptose-Vorbedingung wie bisher (Modul 05 / 07 entscheidet, ob
   tatsächlich Selbstlöschung folgt).

3. **Wenn `availableLanes >= 1` und mind. 2 Schicht-Scores unter
   `SCHICHT_MIN_MATCH`:** Apoptose-Vorbedingung. Selbst wenn `overall
   >= 0.80` (statistisch möglich, wenn eine Schicht extrem stark ist),
   dominiert die Schicht-Schwelle — zwei strukturelle Lücken sind kein
   tragfähiges Match.

4. **Wenn `availableLanes >= 1` und genau eine Schicht unter
   `SCHICHT_MIN_MATCH` UND `overall >= PROVIDER_MIN_MATCH`:** Match
   gilt als **brücken-tauglich**. Aufrufer kann optional
   `explainMatchLLM` rufen, um einen Brücken-Vorschlag zu erhalten
   (Stufe B). Ohne Stufe B bleibt der Match einfach als
   „established mit Lücke" — Aufrufer entscheidet, ob er die Lücke
   ignoriert oder anders behandelt.

5. **Wenn alle Schichten >= `SCHICHT_MIN_MATCH` UND `overall >=
   PROVIDER_MIN_MATCH`:** voller Match. Stufe B ist optional und nur
   für Erklär-/UI-Zwecke nützlich.

**Stufe-B-Übersteuerung:** `explainMatchLLM` darf eine Dimensions-
Schwelle übersteuern, wenn die Begründung im Brücken-Vorschlag
semantisch reicher ist als die Zahl (z.B. „die niedrige Skalierungs-
Schicht ist hier irrelevant, weil A explizit nach kleinem Maßstab
sucht"). In dem Fall liefert `explainMatchLLM` das Feld
`overrideRecommendation: "established" | "established-with-bridge" |
"rejected"` mit Begründung; Aufrufer kann dem folgen oder bei der
Stufe-A-Heuristik bleiben. Modul 04 ist nicht weisungsbefugt — die
Entscheidung bleibt beim Aufrufer.

#### Stufe-B-Vertrag (`explainMatchLLM`)

Stufe B ist ein opt-in LLM-Pass über das Match-Resultat aus Stufe A.
Pattern-Quelle: Layer-1-Demo der SBKIM-Plattform-`index.html` (im
Paper-Repo, **nicht** in diesem Repo — die Pattern-Form wird hier
spezifiziert, der konkrete Prompt ist Bau-Detail).

**Vertrag:**

- **Modell:** `STUFE_B_DEFAULT_MODEL = "claude-sonnet-4"` aus § 0.
  Aufrufer kann via `options.model` überschreiben (z.B. Nachfolge-
  Modell). Modul 04 hartcodiert keine Modell-ID.
- **`max_tokens`:** `STUFE_B_MAX_TOKENS = 1024` aus § 0. Aufrufer kann
  via `options.maxTokens` überschreiben (typisch nur, wenn der
  Brücken-Vorschlag besonders ausführlich werden soll).
- **Output-Form:** JSON-only. Modul 04 setzt im Prompt explizit „Antworte
  ausschließlich mit JSON nach dem unten gezeigten Schema, kein
  Prosa-Text drumherum". Antworten ohne valides JSON werden verworfen
  (siehe Fehlerverhalten).
- **Antwort-JSON-Schema** (Modul 04 validiert strikt; Mismatch →
  `available:false`):

  ```jsonc
  {
    "schichten": {
      "fachlich":   { "score": <number, [-1,1]>, "begruendung": "<deutsch, ≤200 Zeichen>" },
      "prozess":    { "score": <number, [-1,1]>, "begruendung": "<deutsch, ≤200 Zeichen>" },
      "skalierung": { "score": <number, [-1,1]>, "begruendung": "<deutsch, ≤200 Zeichen>" }
    },
    "bruecke": {                           // optional — null wenn kein Brücken-Vorschlag
      "needed":         "<deutscher Klartext, ≤300 Zeichen>",
      "lookingFor":     "<deutscher Klartext, ≤300 Zeichen> | null",
      "candidateScope": "lokal" | "mailbox" | "netz"
                         // Modul 04 korrigiert "netz" still auf "lokal", bis
                         //   Anker 10-12 da sind — siehe § Brücken-Feld-Spec.
    },
    "erklaerung":               "<deutscher Klartext, ≤600 Zeichen, fasst das Match zusammen>",
    "overrideRecommendation":   "established" | "established-with-bridge" | "rejected" | null
                                // null = LLM gibt keine Übersteuerungs-Empfehlung,
                                //   Stufe-A-Schwellen gelten unverändert.
  }
  ```

- **Rückgabe `ExplainResult`** (Modul 04 verpackt das LLM-Ergebnis):

  ```
  ExplainResult = {
    available             : boolean,           // true = LLM-Antwort gültig
    schichten             : object | null,     // wie oben oder null bei available:false
    bruecke               : BridgeProposal | null,
    erklaerung            : string | null,
    overrideRecommendation: string | null,
    fallbackScore         : number,            // = matchResult.overall (Stufe-A-Resultat)
    reason                : string | null,     // bei available:false: deutscher Grund
                                               //   z.B. "API HTTP 429 (Rate-Limit)",
                                               //   "Antwort entsprach nicht dem Schema",
                                               //   "Netz nicht erreichbar"
    model                 : string,            // verwendetes Modell (default oder options.model)
    tokensUsed            : number | null      // input+output tokens, fail-soft wenn API es nicht liefert
  }
  ```

- **Fehlertoleranz:** Stufe B darf scheitern. Wenn der LLM-Call
  scheitert (HTTP-Fehler, Timeout, Netzfehler, Schema-Mismatch),
  resolved `explainMatchLLM` mit `{available:false, reason, fallbackScore}`
  — kein Throw, kein Halb-Resultat. Aufrufer fällt auf das Stufe-A-
  Resultat (`matchResult`) zurück; UI zeigt „Erklärung nicht verfügbar".
- **Rate-Limit-Awareness:** Modul 04 fügt KEINE eigene Drossel ein. Der
  Aufrufer (typisch Modul 06 Heterokaryose-Brücken-Vorschlag, Modul 08
  UI-Demo, Modul 00 Doku-Fenster mit Erklär-Knopf) drosselt selbst.
  Empfehlung: max. 1 Stufe-B-Call pro Sekunde pro Knoten bei
  Anthropic-API (Standard-Quota); konkrete Drossel-Strategie ist
  Aufrufer-Bau-Detail.
- **User-Key-Handling:** `apiKey` kommt aus dem Identitäts-Container
  (Vision-Anker 5, PULS) — **niemals plain aus IndexedDB**. Die
  Container-Spec selbst liegt in Anker 5 (eigene Spec-Sitzung, derzeit
  als Pfad 1 „Rucksack-Datei" via Modul 02 Backup-Export bereits
  rudimentär umgesetzt). Die Plattform-Matrix in § 6.2 listet pro
  Plattform-Profil, wo der Key konkret liegen kann („eigener Key" in
  Desktop-Browser / DeX-Tablet; „Key im App-Dir" beim Mini-Browser;
  „im Popup" bei der Extension; „App-Dir-Key" gibt es nicht — die
  Plattform-Matrix-Spalte „Stufe B" benennt die vier Key-Lokalisations-
  Varianten). Modul 04 konsumiert den Key Plattform-agnostisch als
  String — wer ihn übergibt, hat ihn aus dem für seine Plattform
  zuständigen Container geholt.
- **Schichten-Übersteuerung:** Wenn die LLM-Antwort eigene Schicht-
  Scores liefert, sind diese die maßgeblichen Werte für die UI-
  Anzeige; die Stufe-A-Heuristik-Werte aus `matchDimensions` bleiben
  als `matchResult.fachlich/prozess/skalierung` separat im Aufruf-
  Kontext sichtbar. Aufrufer entscheidet, welche Werte er anzeigt.

**Beispiel-Output für eine Match-Sitzung mit zwei Personas** (Brief 03
markiert das als „knüpft an Brief 04 Multi-Identität" — die zwei
Personas hier sind zwei unabhängige Identitäten im selben IndexedDB-
Slot-Schema aus Anker 6):

```jsonc
// Persona A („Klaus privat — Kochrezepte"):
//   embeddingCapabilities = domainVector der Rezeptbuch-Spore
//   embeddingNeeds        = Vektor für „Wein-Empfehlungen, die zu Hauptgang passen"
//
// Persona B („Klaus beruflich — Wein-Verkostungen"):
//   embeddingCapabilities = Vektor für „Wein-Verkostungs-Notizen"
//   embeddingNeeds        = null  ←  reiner Anbieter, Persona B sucht nichts
//
// matchDimensions(qCap=A.cap, qNeeds=A.needs, pCap=B.cap, pNeeds=B.needs)
//   Lane 1 (A.cap × B.needs): nicht berechenbar (B.needs=null) → übersprungen
//   Lane 2 (A.needs × B.cap): cosinus(A.Wein-Suche × B.Wein-Verkostung) = 0.83
//   availableLanes = 1
//   Schichten: fachlich = prozess = skalierung = 0.83 (gleicher Lane-Wert,
//                                                       Schicht-Differenzierung kommt aus Stufe B)
//   overall = 0.83
//
// explainMatchLLM(matchResult, apiKey) liefert:
{
  "available": true,
  "schichten": {
    "fachlich":   { "score": 0.91, "begruendung": "Wein-Verkostungs-Notizen passen direkt zu Wein-Empfehlungen für Hauptgang" },
    "prozess":    { "score": 0.62, "begruendung": "Persona A pflegt täglich, Persona B nur wenn neue Verkostung — Prozess-Mismatch" },
    "skalierung": { "score": 0.88, "begruendung": "Beide Single-Knoten ohne Cluster-Ambition" }
  },
  "bruecke": null,                            // kein Brücken-Vorschlag nötig
  "erklaerung": "Anbieter-Sucher-Match auf Wein-Domain; Prozess-Lücke (kontinuierlich vs. ereignisbasiert) verhindert vollen Match nicht, weil A explizit nach Verkostungs-Wissen sucht.",
  "overrideRecommendation": "established",
  "fallbackScore": 0.83,
  "reason": null,
  "model": "claude-sonnet-4",
  "tokensUsed": 421
}
```

Persona-Quelle für `embeddingCapabilities` / `embeddingNeeds` pro
Persona ist Brief 04 (Multi-Identität — `sbkim_keys["main"]` /
`["beruflich"]` / `["test"]` + `sbkim_meta["active-identity"]`-Marker).
Brief 03 spezifiziert nur, dass Modul 04 die zwei Vektor-Slots
**pro Persona unabhängig** konsumiert; die Mehr-Slot-Logik selbst
liegt in Brief 04.

---

### Modul: 05_anastomose
Status: entwurf
Datei:  src/modules/05_anastomose.js

Bietet (öffentlich):
  init()                                                       → Promise<void>
  handshake(targetSpore: SporeJson, ownDomainVector: Float32Array(384),
            options?: { transport?: "auto"|"http"|"channel" })
                                                               → Promise<HandshakeResult>
  receiveHandshake(incomingRequest: HandshakeRequest)          → Promise<HandshakeResponse>
  listSiblings()                                               → Promise<Array<{ nodeId, domain, since, pubKey }>>
  forgetSibling(nodeId: string)                                → Promise<void>

  `options.transport` (Spec-Sitzung BroadcastChannel-Bridge 2026-05-17):
    "auto"    (Default) — HTTP zuerst; bei klaren Signalen (HTTP 4xx/5xx,
              non-JSON-Antwort, JSON ohne Pflichtfelder des HandshakeResponse,
              `outcome` außerhalb { "established", "rejected" }) **einmaliger**
              Fallback auf BroadcastChannel('sbkim'). Cross-domain bleibt
              unverändert HTTP-only — siehe Karte 05 § BroadcastChannel-Bridge.
    "http"    nur HTTP-Pfad (bestehendes Verhalten, kein Fallback).
    "channel" nur BroadcastChannel-Pfad (kein HTTP-Versuch; für same-origin-
              Test-Setups, in denen HTTP-Bridge konzeptuell nicht trägt).
  HandshakeRequest/HandshakeResponse-Schema bleibt **unverändert** —
  BroadcastChannel ist eine Transport-Schicht, kein zweites Datenformat.

  Anastomose ist die *Komposition* aus 01/02/04. Modul 05 rechnet nicht
  selbst, sondern ruft `SbkimSpore.verifyForeignSpore`,
  `SbkimMatch.match` + `SbkimMatch.isAboveProviderThreshold` und
  `SbkimStorage.put/get/del` auf. Auslöser ist ausschließlich der
  Aufrufer (Modul 08 UI-Demo / Modul 09 Einbau-PWA) — kein Auto-
  Handshake beim Spore-Empfang, keine Pulsation, keine Eigenanfragen
  ins offene Netz.

Nutzt:
  SbkimStorage.init / get / put / del / all     (sbkim_siblings_<key>, sbkim_anastomosis_log_<key> —
                                                 Pattern pro Identität ab Brief 04; Default-Slot
                                                 sbkim_siblings_main / sbkim_anastomosis_log_main)
  SbkimSpore.init / getOrCreateIdentity / getOwnSpore / getNodeId / getPublicKeyJwk /
                   getActiveIdentityKey / listIdentities
                                                 (eigene Identität, kanonisches Sign; aktive Identität
                                                 lesen + alle Identitäten für Receiver-Map ab Brief 04)
  SbkimSpore.verifyForeignSpore                  (fremde Spore prüfen — Signatur, id-Konsistenz, Hauptversion)
  SbkimMatch.match                               (Cosinus zweier domainVector)
  SbkimMatch.isAboveProviderThreshold            (Schwelle ≥ PROVIDER_MIN_MATCH (0.80) aus §0)
  WebCrypto via Modul 02:
    crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes)   (Request/Response signieren)
    crypto.subtle.verify({ name: "Ed25519" }, publicKey, sig, bytes)  (Gegen-Signatur prüfen)
  fetch (POST) gegen targetSpore.endpoint + ENDPOINT.anastomosis ("/sbkim/anastomosis").
    AbortController(QUERY_TIMEOUT_MS = 4000) für ausgehende Anfragen.
  BroadcastChannel('sbkim')                       (Fallback-Transport, same-origin,
                                                   Spec-Sitzung BroadcastChannel-Bridge 2026-05-17).
    Receiver-Channel wird in init() geöffnet und lebt über die Tab-Lebensdauer.
    Sender öffnet pro Handshake einen Reply-Channel `BroadcastChannel("sbkim:reply:" + nonce)`,
    hört dort mit Timeout QUERY_TIMEOUT_MS (4000 ms) auf den Empfänger-Reply und
    schließt den Reply-Channel im finally-Block. Wenn options.transport != "http"
    und (Auto-Fallback-Bedingung erfüllt ODER transport === "channel"): Channel-Pfad.
    Same-origin-only (Browser-Standard); cross-domain läuft weiterhin nur über HTTP.

Storage:
  Stores (alle aus Modul 01 — als Pattern ab Brief 04 der V1-Sammelspec-
  Kaskade, 2026-05-19):
    sbkim_siblings_<key>        (Schlüssel: peerNodeId; Wert: { nodeId, domain,
                                  endpoint, pubKey, since })
    sbkim_anastomosis_log_<key> (Schlüssel: ISO-Timestamp; Wert: { ts, peerId, outcome })
  <key> = aktive Identität aus SbkimSpore.getActiveIdentityKey()
  (Default "main"). Pre-Brief-04-Aufrufer, die mit fester
  Singleton-Identität gearbeitet haben, treffen unverändert auf
  sbkim_siblings_main und sbkim_anastomosis_log_main — das ist die
  Rückwärts-Kompat. Modul 05 schreibt und liest ausschließlich den
  Slot der aktiven Identität (siehe Identitäts-Cache-Konvention unten).
  Andere Identitäten haben ihre eigenen, voneinander isolierten
  Geschwister-Netze und Log-Strings; ein Geschwister-Knoten gehört
  einer Persona, nicht dem ganzen Knoten.
  outcome ∈ { "established", "rejected", "re-handshake", "timeout" }.
  Log ist anonymisiert: kein domainVector, kein Score-Profil, kein
  Anfrage-Inhalt; nur Begegnung + Ausgang. `since` bleibt beim ersten
  Anklopf-Zeitpunkt eingefroren (Reentry-Idempotenz).

Identitäts-Cache-Konvention (Brief 04 der V1-Sammelspec-Kaskade,
2026-05-19):
  - Modul 05 ruft SbkimSpore.getActiveIdentityKey() im init()-Pfad
    und cached den Wert in einem Modul-lokalen `activeIdentityKey`
    für die Lebenszeit der jeweiligen Operation (ein handshake-
    Aufruf, ein receiveHandshake-Aufruf, ein listSiblings-Aufruf).
  - Mid-Operation-Wechsel der aktiven Identität ist NICHT spezifiziert
    — wer mitten in einem laufenden handshake setActiveIdentity ruft,
    bekommt undefiniertes Verhalten (Spec-offen für Folge-Sitzung).
  - Receiver-Pfad (receiveHandshake): toNodeId aus dem eingehenden
    Request wird gegen ALLE eigenen Identitäten (listIdentities() →
    getNodeId pro key) verglichen, NICHT nur gegen die aktive — eine
    inkommende Anfrage darf jede vorhandene Persona ansprechen. Der
    Receiver setzt die aktive Identität für diese eine Operation
    intern auf die getroffene Persona und schreibt sbkim_siblings_<hit-key>.
    Brief 04 spezifiziert das als Empfangs-Konvention; Modul 05 baut
    keinen ListProzess für alle Slots in jedem Receive-Pfad, sondern
    eine schlanke Map nodeId → key beim init().

Events:
  (keine — keine Pub/Sub. Modul 09 / 08 rufen handshake() bzw.
   der Service-Worker ruft receiveHandshake() direkt auf.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 05 ANASTOMOSE bereit, Funktionen: init/handshake/receiveHandshake/listSiblings/forgetSibling");
  Wie Modul 01/02/04 — die Meldung signalisiert "Modul geladen", nicht
  "Identität existiert" oder "Geschwister da". Schwelle / Endpunkt /
  Version / Transport werden in der Selbstcheck-Zeile bewusst nicht
  wiederholt (stehen verbindlich in §0 / §3 / Modul 04 / Karte 05
  § BroadcastChannel-Bridge).

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
  - handshake(): Channel-Timeout > QUERY_TIMEOUT_MS       → HandshakeTimeoutError, Log "timeout-channel"
                                                            (Spec-Sitzung BroadcastChannel-Bridge 2026-05-17;
                                                             bei transport:"auto" wird der vorher gesammelte
                                                             HTTP-Fehler als cause durchgereicht — Auto-Fallback
                                                             scheitert nur, wenn BEIDE Pfade scheitern).
  - handshake(): Channel-Reply-Signatur ungültig          → HandshakeSignatureInvalidError, Log "abgelehnt: invalid-peer"
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
  - Architektur-Grenze (Pflege Scope-Fix 2026-05-17, PR #72): Same-origin
    cross-PWA Handshake via SW-Bridge ist konzeptuell unmöglich, weil
    Subresource-Fetches durch den SW des **Senders** gehen, nicht den
    des Empfängers. Für same-origin-Setups (z.B. zwei PWAs auf
    `<user>.github.io`) ist der BroadcastChannel-Fallback unten der
    einzige Weg zu `outcome:"established"` ohne localStorage-Bypass.

BroadcastChannel-Bridge (same-origin Fallback,
Spec-Sitzung BroadcastChannel-Bridge 2026-05-17):
  - Channel-Name: BroadcastChannel('sbkim') — ein gemeinsamer Channel für
    alle SBKIM-Knoten in der Origin; Receiver filtert via
    `payload.toNodeId === own.nodeId`. Versionierung läuft über
    `payload.payload.protocolVersion` (= request.protocolVersion), nicht
    über den Channel-Namen.
  - Envelope-Schema (NICHT signiert; signiert ist nur das innere
    HandshakeRequest/HandshakeResponse wie im HTTP-Pfad):
      Request-Envelope:
        { type: "SBKIM_ANASTOMOSE_REQUEST",
          payload: <HandshakeRequest>,
          replyChannelName: "sbkim:reply:" + payload.nonce }
      Response-Envelope:
        { type: "SBKIM_ANASTOMOSE_RESPONSE",
          payload: <HandshakeResponse> }
  - Receiver-Pflicht: `init()` öffnet BroadcastChannel('sbkim') eager und
    registriert einen message-Listener. Empfangen, filtern
    (`type === "SBKIM_ANASTOMOSE_REQUEST"`,
    `payload.toNodeId === own.nodeId`, `payload.fromNodeId !== own.nodeId`),
    `receiveHandshake(payload)` aufrufen, Response-Envelope auf einen
    **dediziert geöffneten** `BroadcastChannel(replyChannelName)` posten,
    diesen Reply-Channel sofort schließen.
  - Sender-Pfad: für den Request den Reply-Channel
    `BroadcastChannel(replyChannelName)` **vor** dem Posten öffnen, dann
    auf dem Main-Channel posten, mit Timeout `QUERY_TIMEOUT_MS` (4000 ms)
    auf die Reply lauschen. Im finally-Block den Reply-Channel schließen.
    Doppelt-Bindung gegen Cross-Talk: Sender prüft zusätzlich
    `response.nonceEcho === request.nonce` (gleicher Replay-Marker wie
    im HTTP-Pfad).
  - `toNodeId` ist im Channel-Pfad **Pflicht** (im HTTP-Pfad optional;
    Karte 05 § BroadcastChannel-Bridge § Pflichtfeld-Schärfung). Ohne
    `toNodeId` kein Receiver-Filter möglich → Sender wirft synchron
    `MissingToNodeIdError` vor dem Posten.
  - Self-Hit-Schutz: Receiver ignoriert Nachrichten mit
    `payload.fromNodeId === own.nodeId` (Sender im selben Tab darf sich
    nicht selbst antworten). Replay-Schutz bleibt wie im HTTP-Pfad
    nonce-basiert (Modul 11 Schutz-Backlog für aktiven Cache).
  - Cleanup: Main-Channel (`BroadcastChannel('sbkim')`) lebt über
    Tab-Lebensdauer (Browser räumt bei Tab-Close auf). Reply-Channels
    werden pro Handshake erzeugt und in finally geschlossen — sowohl auf
    Sender- als auch auf Receiver-Seite.
  - Wer-nicht-da-ist-schweigt: Wenn kein Tab same-origin den Main-Channel
    abonniert hat (Receiver-PWA-Tab geschlossen), kommt keine Reply →
    Sender-Timeout → HandshakeTimeoutError. Kein Wake-Lock, kein
    Auto-Start. Konsistent zur SW-Pfad-Linie „503, wenn keine Page aktiv".

Datenformate:
  HandshakeRequest / HandshakeResponse → §2 dieser Datei.
  sbkim_siblings-Wert / sbkim_anastomosis_log-Wert → Karte 05 Block
  "Datenformate".

Garantien für Modul 06 / 07:
  - sbkim_siblings_<key> ist die Einzige Quelle für „verbundene Geschwister"
    der jeweiligen Identität. Modul 06 (Heterokaryose) iteriert nur über
    diese Liste und legt keine eigenen Listen an.
  - Modul 05 vergisst Geschwister NICHT von selbst (kein TTL, keine
    Apoptose). Vergessen ist Aufgabe von Modul 07 (Apoptose) bzw.
    manuell über forgetSibling.
  - Anastomose ist die kleinste Einheit eines Schlucks: ein
    Handshake = eine Aktion + ein Log-Eintrag. Wer mehrfach handshakt,
    erzeugt mehrfach Logs — aber pro Peer + Identität nur einen
    Geschwister-Eintrag (zwei Personae auf dem eigenen Knoten dürfen
    denselben Peer als Geschwister haben — sie sind getrennte
    semantische Identitäten).
  - Persona-Isolation: ein Peer, der mit Persona A einen established-
    Handshake hatte, ist NICHT automatisch Geschwister von Persona B.
    Wer Persona-übergreifende Geschwister-Sicht braucht, iteriert
    listIdentities() und addiert die sbkim_siblings_<key>-Stores
    aufrufer-seitig.

Geprüft: 2026-05-14 (Spec-Sitzung 05), 2026-05-17 (Spec-Sitzung BroadcastChannel-Bridge — additiver Fallback-Transport, Schema unverändert), 2026-05-19 (Spec-Sitzung Multi-Identität — Brief 04 der V1-Sammelspec-Kaskade, sbkim_siblings_<key>-Pattern + Receiver-Map)

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
  01/02. Modul 06 rechnet nicht selbst — es liest `sbkim_siblings_<key>`
  als Quelle für „verbundene Geschwister" und für den additiven
  Opt-In-Filter, signiert kanonisch mit dem Ed25519-Schlüssel aus
  `sbkim_keys[<key>]`, und schreibt empfangene Anker in
  `sbkim_hetero_inbox_<key>`. <key> ist die aktive Identität aus
  SbkimSpore.getActiveIdentityKey() (Default "main"; Brief 04 der
  V1-Sammelspec-Kaskade, 2026-05-19). Modul 06 ruft
  `SbkimAnastomose.handshake` **NICHT** auf — der Heterokaryose-Pull
  ist ein eigener HTTP-POST gegen ENDPOINT.heterokaryosis
  (= "/sbkim/heterokaryosis" aus §3).

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
  SbkimStorage.init / get / put / del / all     (sbkim_hetero_inbox_<key> als Schreiber;
                                                 sbkim_siblings_<key> als Leser für Opt-In-Filter und Sender-Lookup;
                                                 sbkim_anastomosis_log_<key> als Schreiber für hetero-* outcomes;
                                                 sbkim_hetero_outbox_<key> als Leser für Anker-Quelle.
                                                 <key> = aktive Identität ab Brief 04.)
  SbkimSpore.init / getOrCreateIdentity / getOwnSpore / getNodeId / getPublicKeyJwk /
                   getActiveIdentityKey
                                                 (eigene Identität + Spore für Signatur; aktive Identität
                                                 lesen ab Brief 04)
  SbkimSpore.verifyForeignSpore                  (eingehende Sender-Spore prüfen — Signatur, id-Konsistenz, Hauptversion)
  WebCrypto via Modul 02:
    crypto.subtle.sign({ name: "Ed25519" }, privateKey, bytes)   (HeterokaryosisRequest / HeterokaryosisResponse signieren)
    crypto.subtle.verify({ name: "Ed25519" }, publicKey, sig, bytes)  (eingehende Signatur prüfen)
  fetch (POST) gegen sibling.endpoint + ENDPOINT.heterokaryosis ("/sbkim/heterokaryosis").
    AbortController(QUERY_TIMEOUT_MS = 4000) pro Pull.

Storage:
  Stores (alle aus Modul 01 — als Pattern pro Identität ab Brief 04
  der V1-Sammelspec-Kaskade, 2026-05-19; <key> = aktive Identität):
    sbkim_hetero_inbox_<key>   (Schlüssel: `<peerNodeId>|<ts>`;
                            Wert: { peerNodeId, ts, anchors, signature, receivedAt })
                            — Schreiber 06, Leser 06/00/08.
                            Pro Persona getrennt: ein Heterokaryose-Pull
                            wird der Identität zugeordnet, die ihn ausgelöst
                            hat; eine andere Persona desselben Knotens
                            sieht ihn nicht.
    sbkim_siblings_<key>   (Schlüssel: peerNodeId; Schreiber 05)
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
    sbkim_anastomosis_log_<key>
                           (Schlüssel: ts; Schreiber 05+06)
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
    sbkim_hetero_outbox_<key>
                           (Anker-Quelle; Schreiber 08 — Endknoten-Pflege-
                            UI für Anker-Vorrat. Pro Identität getrennt:
                            jede Persona pflegt ihren eigenen Anker-
                            Vorrat. Brief 04 zieht das Pattern nach;
                            Bau-Folge-Sitzung 08.Y migriert den
                            Singleton-Store v=3 zu identitäts-
                            spezifischen Stores. Falls Store leer/
                            fehlend, Fallback auf Spore-Single-Anker
                            mit Label "(domain)".)

  Receiver-Pfad (Brief 04): Wie in Modul 05 — toNodeId aus dem ein-
  gehenden HeterokaryosisRequest wird gegen alle eigenen Identitäten
  geprüft (Map nodeId → key beim init()), und der Pull wird in den
  Slot der getroffenen Persona geschrieben. Anker-Auswahl (Outbox
  oder Spore-Fallback) und Signatur erfolgen mit dem Schlüssel
  derselben Persona.

  Identitäts-Cache-Konvention (Brief 04): wie Modul 05 — getActiveIdentityKey
  im init()-Pfad gerufen und für die Lebenszeit der Operation gecached.

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
  - sbkim_hetero_inbox_<key> ist Einzige Quelle für „empfangene
    Heterokaryose-Anker" der jeweiligen Persona; Modul 08 / 10 / 12
    dürfen davon ausgehen, dass jeder Eintrag eine valide Signatur
    durchlaufen hat (oder gar nicht angelegt wurde).
  - Modul 06 erzeugt keine eigenen Sibling-Listen, keine Pulsation,
    keine Eigenanfragen — der einzige Netz-Aufruf ist der
    explizite Pull bei `requestHeterokaryosis`.
  - Modul 06 schreibt sbkim_siblings_<key> NICHT — Schreibrecht bleibt bei
    Modul 05.
  - Persona-Isolation der Heterokaryose: Anker einer Persona dürfen
    NICHT in der Inbox einer anderen Persona desselben Knotens
    landen. Wer Persona-übergreifende Anker-Sicht braucht, iteriert
    listIdentities() und addiert die sbkim_hetero_inbox_<key>-Stores
    aufrufer-seitig (analog Modul 05 § Persona-Isolation).
  - Modul 14 (Diffusion, Backlog) darf Modul 06 als Lead-Pool-
    Konsument betrachten: ein bekannter Geschwister-Hop liefert
    Anker, die einen späteren Lead-Match feinkörniger machen können
    (Spec-Sitzung 14 entscheidet die genaue Form, wenn die Schwelle
    erreicht ist).

Geprüft: 2026-05-15 (Spec-Sitzung 06), 2026-05-15 (Bau-Sitzung 06 — Code-Stub belegt; Anker-Quelle in der Erst-Bau-Iteration ausschließlich Spore-Single-Anker-Fallback / Degraded-Modus), 2026-05-19 (Spec-Sitzung Multi-Identität — Brief 04 der V1-Sammelspec-Kaskade, sbkim_hetero_inbox_<key>-Pattern + Receiver-Map)

---

### Modul: 07_apoptose
Status: entwurf
Datei:  src/modules/07_apoptose.js

Bietet (öffentlich):
  init()                                                           → Promise<void>
  prepareSelfApoptose(reason: string)
                                                                   → Promise<{ confirmationToken: string, expiresAt: string, recipientCount: number }>
                                                                   // recipientCount summiert die Geschwister ÜBER ALLE Identitäten
                                                                   // (Brief 04 der V1-Sammelspec-Kaskade) — confirmSelfApoptose
                                                                   // wirkt global.
  confirmSelfApoptose(token: string, reason: string)
                                                                   → Promise<{ outcome: "completed", recipientsNotified: string[], recipientsFailed: Array<{ nodeId, reason }> }>
                                                                   // Versand pro Identität (jede Persona signiert ihr eigenes
                                                                   // LegacyMessage und schickt es an die Geschwister AUS
                                                                   // sbkim_siblings_<key>); Cleanup global (alle Identitäts-
                                                                   // Stores werden geleert; siehe § Cleanup-Reihenfolge).
                                                                   // Brief 04: Liste recipientsNotified/recipientsFailed
                                                                   // aggregiert pro nodeId — Duplikate (Peer ist Geschwister
                                                                   // mehrerer Personae desselben Knotens) erscheinen mehrfach,
                                                                   // weil sie pro Persona ein separates Vermächtnis bekommen.
  receiveLegacy(incomingLegacy: LegacyMessage)                     → Promise<LegacyResponse>
                                                                   // Receiver-Pfad (Brief 04): toNodeId aus dem eingehenden
                                                                   // Vermächtnis wird gegen alle eigenen Identitäten geprüft
                                                                   // (Map nodeId → key beim init(), analog Modul 05/06); das
                                                                   // empfangene Vermächtnis landet in sbkim_legacy_inbox_<hit-key>,
                                                                   // und der entsprechende sbkim_siblings_<hit-key>[fromNodeId]
                                                                   // wird gelöscht. Andere Identitäten bleiben unberührt.
  listLegacy(key?: string)                                         → Promise<Array<{ fromNodeId, reason, receivedAt }>>
                                                                   // Default-Parameter key=getActiveIdentityKey(). Liefert
                                                                   // Vermächtnisse der angegebenen Persona (Brief 04).
  forgetExpiredSiblings(maxAgeMs: number, key?: string)            → Promise<Array<{ nodeId, lastSeen }>>
                                                                   // Default-Parameter key=getActiveIdentityKey(). TTL-Sweep
                                                                   // wirkt auf sbkim_siblings_<key>; pro Aufruf eine Persona.
                                                                   // Wer einen Knoten-weiten Sweep braucht, iteriert
                                                                   // listIdentities() und ruft die Funktion pro key.

  Apoptose ist die *zweite Komposition* (nach Modul 05) aus 01/02. Modul
  07 rechnet nicht selbst — es liest `sbkim_siblings_<key>` als Quelle der
  Vermächtnis-Empfänger und für TTL-Sweeps, signiert kanonisch mit dem
  Ed25519-Schlüssel aus `sbkim_keys[<key>]`, und schreibt empfangene
  Vermächtnisse in `sbkim_legacy_inbox_<key>`. <key> = aktive Identität
  aus SbkimSpore.getActiveIdentityKey() (Default "main"; Brief 04 der
  V1-Sammelspec-Kaskade, 2026-05-19). Modul 07 ruft
  `SbkimAnastomose.handshake` **NICHT** auf — der Vermächtnis-Versand
  ist ein eigener HTTP-POST gegen ENDPOINT.legacy (= "/sbkim/legacy"
  aus §3).

  Self-Apoptose ist **irreversibel** und **zweistufig**:
  `prepareSelfApoptose` liefert einen einmal verwendbaren Token mit
  60 s Gültigkeit (APOPTOSE_TOKEN_TTL_MS = 60_000, Modul-lokal);
  erst `confirmSelfApoptose(token, reason)` versendet das Vermächtnis
  und löscht die SBKIM-Stores. **Granularität ab Brief 04 (Multi-
  Identität):** confirmSelfApoptose wirkt **global** — alle Identitäten
  des Knotens sterben gemeinsam, Vermächtnis-Versand erfolgt pro
  Identität an deren jeweilige Geschwister (eine Persona → ihre
  Geschwister, jeweils mit eigenem Schlüssel signiert). Nach
  Self-Apoptose haben SbkimSpore.getNodeId / getOwnSpore keine
  Identität mehr (werfen NoIdentityError); listIdentities() liefert
  []. Für die per-Persona-Auflösung („eine einzelne Persona stirbt,
  die anderen leben weiter") ruft der Aufrufer
  `SbkimSpore.removeIdentity(key, {force:true})` — dieser Pfad ist
  in Modul 02 implementiert und ruft intern in Modul 07 den
  `_sendLegacyForIdentity(key, reason)`-Hook (siehe Bietet-Block),
  der das Vermächtnis nur für die Geschwister dieser Persona
  verschickt. Brief 04 spezifiziert die Schnittstelle; die Bau-
  Sitzung schreibt den Hook.

Nutzt:
  SbkimStorage.init / get / put / del / all / clear
                                                 (sbkim_legacy_inbox_<key> als Schreiber;
                                                  sbkim_siblings_<key> als Leser + Löscher für TTL und Empfangs-Cleanup;
                                                  sbkim_keys / sbkim_spore und die identitäts-spezifischen Stores als
                                                  Löscher beim Self-Apoptose-Cleanup, pro Identität iteriert)
  SbkimSpore.init / getOrCreateIdentity / getOwnSpore / getNodeId / getPublicKeyJwk /
                   getActiveIdentityKey / listIdentities
                                                 (eigene Identität + Spore für Signatur; aktive Identität +
                                                 alle Identitäten ab Brief 04)
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
  Stores (alle aus Modul 01 — als Pattern pro Identität ab Brief 04
  der V1-Sammelspec-Kaskade, 2026-05-19; <key> = aktive Identität):
    sbkim_legacy_inbox_<key>     (Schlüssel: fromNodeId;
                            Wert: { fromNodeId, reason, signature, receivedAt })
                            — Schreiber 07, Leser 07/00/08. Pro Persona getrennt:
                            ein empfangenes Vermächtnis gehört der Persona, deren
                            nodeId in toNodeId stand.
    sbkim_siblings_<key>   (Schlüssel: peerNodeId; Schreiber 05)
                            — Modul 07 ist hier LÖSCHER:
                              - bei receiveLegacy(C) → sbkim_siblings_<hit-key>.del(C)
                                (Receiver-Map nodeId → key wie in Modul 05)
                              - bei forgetExpiredSiblings(maxAgeMs, key?) → del(älter als maxAgeMs)
                            Schreibrecht hat WEITERHIN nur Modul 05.
    sbkim_anastomosis_log_<key>
                           (Schlüssel: ts; Schreiber 05+06)
                            — Modul 07 ist hier LESER:
                              max(ts) mit outcome ∈ {"established","re-handshake"} pro peerId
                              = lastActivity für TTL-Vergleich. Pro Persona getrennt.
    sbkim_keys             (Schreiber 02) — Modul 07 löscht alle key-Slots
                            beim globalen Self-Apoptose-Cleanup; bei
                            removeIdentity(<single>, {force:true})-Pfad
                            (per-Persona-Apoptose) wird nur sbkim_keys[<single>]
                            entfernt (Modul 02 ist Owner; Modul 07 wird
                            via Hook _sendLegacyForIdentity gerufen).
    sbkim_spore            (Schreiber 02) — dito.
    sbkim_hetero_inbox_<key>
                           (Schreiber 06) — Modul 07 löscht alle
                            Identitäts-spezifischen Inbox-Stores beim
                            Self-Apoptose-Cleanup.

  Reihenfolge des Self-Apoptose-Cleanup (sequenziell — global, Brief 04):
    Außere Schleife über listIdentities() ergibt die Reihenfolge der Slot-
    spezifischen Schritte. Pro Identität key:
      1. sbkim_siblings_<key>          clear
      2. sbkim_anastomosis_log_<key>   clear
      3. sbkim_legacy_inbox_<key>      clear
      4. sbkim_hetero_inbox_<key>      clear  ← Heterokaryose-Inbox-Einträge
                                                haben keinen Eigen-Wert ohne
                                                die Identität.
      5. sbkim_hetero_outbox_<key>     clear  ← Anker-Vorrat additiv (Brief 04;
                                                Bau-Folge-Sitzung 08.Y zieht
                                                den Outbox-Singleton zur
                                                Identitäts-spezifischen Form
                                                nach — bis dahin best-effort
                                                löschen).
    Außerhalb der Schleife (zuletzt, einmal):
      6. sbkim_spore                    clear (alle Slots)
      7. sbkim_keys                     clear (alle Slots)
      8. sbkim_meta["active-identity"]  del   ← lokaler Marker, kein
                                                Identitäts-Slot mehr aktiv
      9. SbkimSpore.resetIdentityCache()
                                     ← Cache-Invalidate; ohne diesen Schritt
                                       liefert SbkimSpore.getNodeId weiter die
                                       alte nodeId aus dem identityCache,
                                       trotz leerem Storage. Pflicht ab
                                       Pflege-Sitzung 2026-05-15. Vertrag: ein
                                       Modul, das sbkim_keys/sbkim_spore von
                                       außen leert, MUSS resetIdentityCache
                                       unmittelbar danach rufen.
  sbkim_doku_meta bleibt unangetastet (Schreiber 00).

  Reihenfolge des Per-Persona-Cleanup (über removeIdentity(key, {force:true}),
  Brief 04): Modul 02 ist Owner und ruft Modul 07 nur für den Vermächtnis-
  Versand (Hook _sendLegacyForIdentity(key, reason) — Schreibrecht für
  sbkim_keys/sbkim_spore bleibt bei Modul 02). Reihenfolge (Modul 02):
    1. Vermächtnis-Versand an sbkim_siblings_<key> (Hook in Modul 07)
    2. sbkim_siblings_<key>          clear
    3. sbkim_anastomosis_log_<key>   clear
    4. sbkim_legacy_inbox_<key>      clear
    5. sbkim_hetero_inbox_<key>      clear
    6. sbkim_hetero_outbox_<key>     clear (best-effort, siehe oben)
    7. sbkim_spore.del(<key>)
    8. sbkim_keys.del(<key>)
    9. sbkim_meta["active-identity"]  ggf. neu setzen (siehe Modul 02 §
                                       removeIdentity Bietet-Block)
   10. SbkimSpore.resetIdentityCache()

Events:
  (keine — Service-Worker liefert eingehende /sbkim/legacy-Bodies via
   MessageChannel an receiveLegacy weiter, analog Modul 05.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 07 APOPTOSE bereit, Funktionen: init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings");
  Wie Modul 01/02/04/05 — keine Schwelle/Konstante in der Selbstcheck-
  Zeile. Die irreversible Natur der Self-Apoptose wird beim Aufruf
  von prepareSelfApoptose als console.warn nachgereicht, nicht beim
  Skript-Laden. Die Multi-Identitäts-Hook _sendLegacyForIdentity
  (Brief 04) ist intern (Modul-02-Aufruf-Pfad) und steht NICHT in
  der öffentlichen API — daher nicht in der Selbstcheck-Zeile.

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
  - sbkim_legacy_inbox_<key> ist Einzige Quelle für „empfangene Vermächtnisse"
    der jeweiligen Persona; Modul 10 / 12 dürfen davon ausgehen, dass
    jeder Eintrag eine valide Signatur durchlaufen hat (oder gar nicht
    angelegt wurde).
  - Modul 07 löscht sbkim_siblings_<key>-Einträge zwei Wege:
      (a) auf Vermächtnis-Empfang (sender wird im Slot der getroffenen
          Persona vergessen),
      (b) auf TTL-Sweep (stille Geschwister; pro Persona-Aufruf, oder
          aufrufer-iteriert über alle Identitäten).
    Modul 06 (Heterokaryose) iteriert sbkim_siblings_<key> und darf
    davon ausgehen, dass abgelaufene Geschwister verschwinden, sobald
    der Andocker forgetExpiredSiblings regelmäßig ruft.
  - Modul 07 erzeugt keine eigenen Listen, keine Pulsation, keine
    Eigenanfragen — der einzige Netz-Aufruf ist der parallele
    Vermächtnis-Versand beim Self-Apoptose-Confirm bzw. beim
    removeIdentity-Pfad pro Persona.
  - Globale vs. Per-Persona-Apoptose (Brief 04): confirmSelfApoptose
    ist global (alle Identitäten sterben), removeIdentity(key,
    {force:true}) ist per Persona (eine Persona stirbt, die anderen
    leben weiter). Die zwei Pfade sind explizit verschieden — kein
    Aufrufer darf annehmen, dass removeIdentity die Auto-Variante
    von confirmSelfApoptose ist (Single-Identitäts-Apoptose verlangt
    eigene UI-Bestätigung; siehe Modul 02 § removeIdentity).

Geprüft: 2026-05-14 (Spec-Sitzung 07), 2026-05-19 (Spec-Sitzung Multi-Identität — Brief 04 der V1-Sammelspec-Kaskade, identitäts-spezifische Stores + Per-Persona-Cleanup + _sendLegacyForIdentity-Hook)

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
  `status.json`). Nicht intern im Sage-Protokol-Repo.

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

### Modul: 15_membran
Status: schablone  (Stub, Backlog-Membran, kein JS-Modul in Erst-Stufe —
                   Spec ausstehend bis KI-Browser-Markt stabilisiert oder
                   konkreter App-zu-App-Wunsch eines Endknoten-Betreibers.)
Datei:  docs/components/15_membran.md (Karte; `src/modules/15_membran.js`
        existiert noch nicht)

Bietet (geplant, nicht implementiert — Spec-Sitzung 15 entscheidet die
finale Form):

  Vier Sub-Bereiche unter einer Membran-Metapher (Außenhülle zwischen
  PWA-Zelle und Browser-Umgebung):

  Sub (a) — Read-API für KI-Browser-Agenten (Stufe 1, Pflicht):
    window.SbkimMembrane.read() → Promise<{
      protocolVersion, nodeId, domain, sporeUrl,
      siblings: [{ nodeIdHash, since, status }],  // ANONYMISIERT
      storage:  { quotaWarningLevel, storagePersisted }
    }>
    Streng lesend, kein Seiteneffekt, keine Auslöser.

  Sub (b) — App-zu-App-Brücke via postMessage (Stufe 2, Pflicht):
    window.postMessage({
      type:    "sbkim/membrane/v1",
      op:      "sporeRef" | "query" | "hint",     // KEIN "handshake"
      fromOrigin: <string>,
      nonce:   <random>,
      payload: <op-spezifisch>
    }, peerOrigin /* aus Allowlist */)
    Origin-Allowlist im Andocker hartkodiert; nonce-Pflicht; Replay-
    Schutz; Cross-Origin same-Browser.

  Sub (c) — Capability-Handshake / Membran-Token (Stufe 3, später):
    MembraneCapability = {
      audience: <agent-id | origin-pattern>,
      scope:    "read" | "hint",                  // KEIN "write" in Stufe 3
      expiresAt: <timestamp>,
      nonce:    <random>,
      signature: Ed25519(<canonical-payload>)     // durch eigene Spore signiert
    }
    Signatur-Pfad nutzt Modul 02 (canonical JSON + Ed25519); finale
    Form Spec-Vorbehalt.

  Sub (d) — Backup-Datei als manueller App-Transport (nur Verweis):
    Existiert bereits in Modul 02 (Bau 02.X): exportBackup(password) /
    importBackup(blob, password, options?) mit PBKDF2-SHA256 600 000 +
    AES-GCM-256. Karte 15 dokumentiert nur — kein neuer Bau in 15.

Nutzt-von (geplant):
  KI-Browser-Agenten (Anthropic Browser Use, OpenAI Operator, Comet,
  Dia, Arc-Nachfolger) · Endknoten-Schwester-Apps auf anderen Origins
  desselben Browsers (Mein-Rezeptbuch ↔ Mein-Mixarium) · Endknoten-
  Benutzer mit Backup-Datei-Wunsch.

Abhängigkeiten (geplant):
  Modul 02 (Spore-Signatur für Sub (c)-Capability-Token) ·
  Modul 01 (LESERECHT auf sbkim_spore + sbkim_siblings — KEIN Schreiben
  in Stufe 1) ·
  Modul 00 (Spiegelung quotaWarningLevel + storagePersisted im
  read()-Snapshot).
  KEIN neuer Storage-Store in Stufe 1; Stufe 2 entscheidet ggf. einen
  sbkim_membrane_inbox-Store für hint-Leads.

Tabus (verbindlich, gelten auch ohne Spec):
  - NIEMALS sbkim_keys lesen (auch nicht gehasht). Privater Schlüssel
    verlässt die Zelle nie unverschlüsselt — Sub (d) Backup-Sluse ist
    die einzige Ausnahme und nur mit PBKDF2+AES-GCM.
  - NIEMALS nodeId der Geschwister im Klartext liefern. Sub (a) gibt
    nur nodeIdHash = base64url(sha256(nodeId)) heraus.
  - NIEMALS schreiben in Sub (a). read() ist async-pur.
  - KEIN op:"handshake" in Sub (b). Wer Anastomose will, geht durch
    Modul 05 (HTTP oder BroadcastChannel-Fallback).
  - Origin-Allowlist ist STATISCH im Andocker konfiguriert, nicht über
    die Membran selbst änderbar.
  - Nonce-Pflicht in Sub (b) und Sub (c) — kein Replay-Schutz, keine
    Brücke.
  - Empfangsmodus-Prinzip bleibt: Membran initiiert nichts, sie
    antwortet nur. Kein Crawler, keine Pulsation, keine Eigenanfragen.

Hook-Punkte (nur Verweis, nicht implementiert):
  Modul 10 (Reputation) auf Capability-Token-Aussteller (Sub (c)) ·
  Modul 11 (Rate-Limit) auf eingehende postMessage-Calls pro Origin
  (Sub (b)) ·
  Modul 12 (Blocklist) auf Origin-Ebene (Sub (b)).

Risiken (für Spec-Sitzung 15 zu schließen):
  Origin-Spoofing · Datenexfiltration via KI-Browser-Agent ·
  Agent-Replay (Token-Reuse) · Konsens-Bruch (Agent macht hint im
  Hintergrund) · Allowlist-Drift bei PWA-Update · Sluse-Phishing
  (Sub (d), heute schon mitigiert) · PWA-Suffix vs. Origin-Allowlist-
  Kollision.

Geprüft: 2026-05-18 (Hauptsitzung 15-Membran-Stub)

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
nodeName                : string              z.B. "Rezeptbuch Klaus"
domainDescription       : string              Freitext über die Domäne
domainKeywords          : string[]            z.B. ["Backen", "Saucen"]
domainVector            : number[]            384 floats, vorab-berechneter Domänen-Vektor.
                                              Legacy-Name aus Spec-Sitzung 02 (2026-05-14) für den
                                              Anbieter-Vektor („was kann dieser Knoten anbieten").
                                              Spec-Sitzung M04-Erweiterung (Brief 03, 2026-05-19)
                                              führt embeddingCapabilities als neuen kanonischen
                                              Namen ein — siehe unten.
embeddingCapabilities   : number[]            384 floats, NEU additiv (Brief 03, 2026-05-19).
                                              Kanonischer Name für den Anbieter-Vektor; semantisch
                                              identisch zu domainVector. Eine Spore darf domainVector
                                              ODER embeddingCapabilities ODER BEIDE tragen.
                                              Falls beide vorhanden: SOLLEN sie wertgleich sein
                                              (Consumer prüft NICHT — keine Verifikations-Pflicht,
                                              additiver Übergangs-Pfad). Consumer (Modul 04 /
                                              Modul 05) liest bevorzugt embeddingCapabilities,
                                              sonst domainVector, sonst kein Vektor verfügbar.
embeddingNeeds          : number[]            384 floats, NEU additiv (Brief 03, 2026-05-19).
                                              Sucher-Vektor („was sucht dieser Knoten"). Optional —
                                              wenn fehlend oder null, ist der Knoten im
                                              „nur Anbieter-Modus" (siehe § 1 Modul 04 § Drei-
                                              Schichten-Modell § Nur-Anbieter-Modus). Signaturpflichtig
                                              wenn vorhanden (analog domainKeywords / stammCategories /
                                              embeddingCapabilities).
endpointPaths           : object              Override für §3, falls Hoster ohne .well-known
stammCategories         : string[]            Kerngebiet-Kategorien des Knotens (siehe ARCHITEKTUR.md §8).
                                              Beispiel Mixarium: ["Cocktails", "Mocktails", "Limonaden"].
                                              Beispiel Rezeptbuch: ["Vorspeisen", "Fleisch", "Fisch", "Vegetarisch"].
                                              Sortier-Reihenfolge frei wählbar; kanonische JSON-Sortierung
                                              sortiert nur Object-Keys, nicht Array-Elemente.
guestCategories         : string[]            Begleit-Kategorien (UI-Label: "Überraschungs-Plus").
                                              Beispiel Mixarium: ["Knabbereien", "Fingerfood"].
                                              Beispiel Rezeptbuch: ["Begleitgetränke", "Weinkarte"].
                                              Disjunkt zu stammCategories (kein Element in beiden Listen);
                                              das ist Hosting-Pflicht des Knotens, kein Empfänger-Check.
```

**Hinweis Spec-Sitzung M04-Erweiterung (Brief 03, 2026-05-19):** Die
neuen Felder `embeddingCapabilities` und `embeddingNeeds` sind beide
optional und additiv — `PROTOCOL_VERSION` bleibt `"0.1"`. Alte Sporen
ohne diese Felder bleiben gültig; eine fehlende `embeddingNeeds`
signalisiert „nur Anbieter-Modus" (kein Bidirektionalitäts-Test).
Wenn eine Folge-Spec-Sitzung `embeddingNeeds` zur Pflicht erhöbe (z.B.
in einer künftigen Stufe-B-only-Variante des Protokolls), bumpte
`PROTOCOL_VERSION` auf `"0.2"` — diese Entscheidung gehört in eine
eigene Spec-Sitzung und ist nicht Teil von Brief 03.

**Hinweis Spec-Sitzung Multi-Identität (Brief 04 der V1-Sammelspec-
Kaskade, 2026-05-19) — Pages-`spore.json`-Strategie:**

Brief 04 entscheidet sich für **Strategie A (Default)** — die unter
`<endpoint>/sbkim/spore.json` öffentlich gehostete Spore-Datei trägt
ausschließlich die zum Push-Zeitpunkt **aktive** Identität. Spore-JSON-
Schema bleibt unverändert, alle Pflichtfelder beziehen sich auf genau
eine Identität (id / publicKey / endpoint / domain / etc.), und
`PROTOCOL_VERSION` bleibt `"0.1"`. Ein Identitäts-Wechsel auf
Endknoten-Seite (Aufruf von `SbkimSpore.setActiveIdentity(key)` plus
`generateOwnSpore(meta, key)`) führt zu einem neuen `spore.json`-Push;
ein Peer, der die zwei Personae „sehen" möchte, müsste zwei Spore-URLs
kennen — entweder Konvention im Endknoten (z.B.
`/sbkim/spore-<key>.json`) oder Identitäts-Container-Push (Anker 5
eigene Spec). Brief 04 spezifiziert die Mehrfach-Pfad-Konvention NICHT
— sie bleibt Aufrufer-Pflicht.

**Strategie B (Liste-Schema, NICHT in Brief 04 gewählt):** ein
zukünftiges Spore-Schema mit Pflicht-Feld `identities[]` (Array von
Identitäts-Sub-Spore-Objekten, jede mit eigener `id` / `publicKey` /
`embeddingCapabilities` / `embeddingNeeds`) wäre Multi-Persona-First-
Class-Citizen — Peer könnte über `toNodeId` die spezifische Persona
filtern, ohne mehrere URLs zu kennen. Diese Variante bricht aber alle
bestehenden Empfänger, die ein flaches Spore-Objekt erwarten, und
erfordert einen `PROTOCOL_VERSION`-Bump auf `"0.2"` (Pflicht-Feld
hinzugefügt = Hauptversions-Sprung nach § 4 § Versionierungs-Regel).
Strategie B ist als Option für eine Folge-Spec-Sitzung benannt, wenn
der Multi-Persona-Use-Case reift; bis dahin bleibt sie ausdrücklich
**nicht aktiviert**. Wer Strategie B in einer Folge-Spec-Sitzung
wählt, hat die Bump-Entscheidung EXPLIZIT zu treffen und im
Änderungsprotokoll § 10 + im PULS-Sitzungs-Eintrag + im Übergabe-
protokoll zu begründen — keine heimliche Edit.

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

HTTP-Pfade (Default-Transport, alle Transporte ausgehend POST):

```
spore           : /.well-known/sbkim/spore.json   (Default)
spore-alias     : /sbkim/spore.json               (für Hoster ohne .well-known)
query           : /sbkim/query                    (POST)
anastomosis     : /sbkim/anastomosis              (POST)
heterokaryosis  : /sbkim/heterokaryosis           (POST)
legacy          : /sbkim/legacy                   (POST/GET)
```

Bei statisch gehosteten PWAs ohne Backend werden eingehende HTTP-
Endpunkte durch einen Service-Worker abgefangen. Details in Modul 05.

Same-origin Fallback-Transport für Modul 05 (Spec-Sitzung
BroadcastChannel-Bridge 2026-05-17):

```
channel-bridge  : BroadcastChannel('sbkim')       (Anastomose-Fallback, same-origin)
reply-channel   : BroadcastChannel('sbkim:reply:' + nonce)
                                                  (pro Handshake, lebt nur bis Reply/Timeout)
```

Verwendung verbindlich nur für Modul 05 (Anastomose). Heterokaryose
(Modul 06) und Legacy (Modul 07) nutzen ausschließlich den HTTP-Pfad
— BroadcastChannel ist in dieser Spec auf den Handshake-Pfad begrenzt
(Begründung in Karte 05 § BroadcastChannel-Bridge).

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

## 6. Endknoten-Liste

Verbindliche Aufzählung der Endknoten, die das Sage-Mycel als
gleichwertige Knoten kennt. Spec-Sitzung V1 Sage-Hybrid 2026-05-18
(Brief 01 der V1-Sammelspec-Kaskade) hat Sage als dritten Endknoten
aufgenommen — neben den beiden zuerst integrierten Endknoten
Mein-Rezeptbuch und Mein-Mixarium. Mit dieser Aufnahme wird die
Konvention `NODE_TYPE_DEFAULT = "hybrid"` aus §0 erstmals
selbstreferenziell wahr: Sage-Protokol ist Hub und Knoten zugleich.

Die maschinenlesbare Spiegelung dieser Liste liegt in `status.json`
§ `endknoten[]` (gleiche `domain`-Werte, Pflege-Konvention vom
Bestands-Endknoten beibehalten). Wenn diese Tafel und `status.json`
auseinanderlaufen, gilt **diese Tafel** (INTERFACES verbindlich).

| id | domain | domainDescription | domainKeywords | domainVector |
|---|---|---|---|---|
| `rezeptbuch` | `Kochrezepte` | Kuratierte Sammlung von Koch- und Backrezepten des Betreibers. | `["Backen","Saucen","Fleisch","Fisch","Vegetarisch","Suppen","Vorspeisen","Desserts"]` | berechnet 2026-05-16 (384-dim, in `spore.json` live) |
| `mixarium` | `Cocktails / Drinks` | Kuratierte Sammlung von Cocktails, Mocktails und alkoholfreien Drinks des Betreibers. | `["Cocktails","Mocktails","Limonaden","Smoothies","Tees","Sirup","Bowlen"]` | berechnet 2026-05-16 (384-dim, in `spore.json` live) |
| `sage` | `Mycel-Bibliothek` | Lebendiges SBKIM-Vokabular und Protokoll-Doku: Glossar, INTERFACES, ARCHITEKTUR, Karten 00-15, PULS — die Karte, die sich selbst kennt. | `["SBKIM-Glossar","Mycel-Vokabular","Protokoll-Doku","Heilige Tafeln","Karten","Schwesternetz-Beobachtungen"]` | `null` (Slot, Sage-Page-Bau-Sitzung füllt nach) |

**Domäne-Entscheidung Sage (Spec-Sitzung 2026-05-18):** `"Mycel-
Bibliothek"` gewählt aus den drei Anker-Vorschlägen („Mycel-
Bibliothek" / „SBKIM-Glossar" / „Sage-Observatorium"), weil sie das
gesamte Doku-Korpus (Glossar + INTERFACES + ARCHITEKTUR + Karten +
PULS) als ein semantisches Feld benennt — „SBKIM-Glossar" wäre zu
eng (nur eine Datei), „Sage-Observatorium" zu seitenbezogen (visuelle
Metapher der Sage-Page, kein Domäne-Begriff). Die biologische
Bildwelt („Mycel") spiegelt das Protokoll-Bild im Domäne-Label.

**Stamm/Gast-Kategorien Sage** (analog zu Spore-JSON §2 Optionale
Felder `stammCategories` / `guestCategories` — disjunkt als
Hosting-Pflicht, Begründung in Karte 02 § Stamm/Gast):

- `stammCategories`: `["Protokoll-Doku","Mycel-Vokabular","Heilige Tafeln","Karten","INTERFACES","ARCHITEKTUR"]`
- `guestCategories`: `["Glossar-Wartung","Schwesternetz-Beobachtungen","Sitzungs-Briefe","Übergabeprotokolle"]`

### 6.1 Sage-Endknoten — Sage-Page-Architektur

Verbindliche Architektur-Festlegung für die Sage-Page, sobald die
Folge-Bau-Sitzung „Sage-Page-Refactor V1" sie umsetzt (in der
Brief-99-Bau-Brief-Liste enumeriert). **Dieser Block ist Spec, kein
Bau-Detail** — die Sage-Page (`index.html`) bleibt in dieser Spec-
Sitzung unangetastet.

- **IndexedDB-Suffix:** `sbkim_sage`. Analog zur Konvention der
  Bestands-Endknoten (`sbkim_rezeptbuch` / `sbkim_mixarium` aus
  Pflege PWA-Suffix Karten 01+09 vom 2026-05-16). Modul 01 ruft
  `init({dbSuffix: "sage"})` beim Andock-Trigger; gleiche Origin-
  Pflicht-Trennung wie bei den Bestands-Endknoten.
- **App-SW: Variante 3a (Standalone).** Sage-Page hat aktuell
  keinen eigenen App-Service-Worker. Daher liefert die Sage-Page-
  Bau-Sitzung einen Standalone `sbkim-sw.js` im Sage-Page-Root
  (Repo-Root, **nicht** unter `sbkim/`). Konvention identisch zu
  Karte 09 § Schritt 3a (Pre-Flight-Check ergibt „kein App-SW
  vorhanden").
- **Volle init()-Kette aller SBKIM-Module beim ersten Andocken.**
  Reihenfolge wie Karte 09 § Schritt 2: `01 → 02 → 03 → 04 → 05 →
  07 → 00`. Modul 03 Embedding (~30 MB Modell-Download via
  `Xenova/multilingual-e5-small`) **lädt lazy** — erst beim ersten
  Andock-Klick, nicht beim Sage-Page-Boot. UX-Vorwarnung im Andock-
  Wizard ist Pflicht („Erstmaliges Andocken lädt ~30 MB Embedding-
  Modell, danach offline-fähig — fortfahren?").
- **Andock-Geste an der Schwarz-Loch-Karte.** Klick auf die
  Schwarz-Loch-Karte öffnet künftig einen **Andock-Wizard** für
  Sages eigene Spore-Erzeugung (`generateOwnSpore` mit Sage-
  Domäne aus §6 Tabelle oben, `domainVector` aus `embedQuery` über
  `domain + domainDescription + domainKeywords.join(" ")`, Spore
  zu `sbkim/spore.json` deployen analog Karte 09 § Schritt 6+7).
  Spec-Hinweis, kein Bau-Detail — Konkret-Umsetzung in der
  Folge-Bau-Sitzung „Sage-Page-Refactor V1".
- **Plattform-Ehrlichkeit (Vorgriff auf Brief 02):** Sage liegt auf
  GitHub Pages, statisch, ohne Hintergrund-Empfang. Der `pingStatus`
  in `status.json` bildet das ehrlich ab (`pending-first-andock`
  bis zur ersten Spore-Erzeugung, danach analog zu den Bestands-
  Endknoten mit Plattform-Marker — Detail folgt in Brief 02
  Plattform-Matrix). Sage kennt keinen Königin-Hintergrund-
  Empfangs-Modus (Anker 4 Vision); empfangen wird nur, solange ein
  Tab offen ist.

> **Plattform-Matrix:** siehe § 6.2 unten — die fünf Plattform-
> Profile (Desktop-Browser / DeX-Tablet / PWA-installiert /
> Mini-Browser / Extension) werden dort verbindlich aufgelistet
> und für Sage einzeln zugeordnet. Brief 02 der V1-Sammelspec-
> Kaskade (2026-05-18) hat den Stub aus Brief 01 zur vollen
> Matrix ausgebaut.

### 6.2 Plattform-Matrix

Verbindliche Aufzählung der Plattform-Profile, unter denen
Endknoten heute laufen oder künftig laufen werden. Jede Zeile
beschreibt ein Plattform-Profil — kein Endknoten ist mit „seiner"
Plattform fest verheiratet, sondern wechselt mit der Trägerumgebung
(Klaus' Sage-Page öffnet sich heute im Desktop-Browser-Profil,
nach „Zur Startseite hinzufügen" im PWA-installiert-Profil, in
einer Tauri-Hülle künftig im Mini-Browser-Profil — derselbe Code,
andere Plattform-Eigenschaften).

Spec-Sitzung Brief 02 der V1-Sammelspec-Kaskade (2026-05-18) hat
die Matrix als § 6.2 neben § 6.1 Sage-Endknoten — Sage-Page-
Architektur etabliert. Die Plattform-Ehrlichkeits-Klausel in
§ 6.3 ist für diese Matrix verbindlich: kein Endknoten gibt vor,
mehr zu können als seine Plattform erlaubt.

| Plattform | IndexedDB | SW | Spore-Empfang | Identitäts-Backup | Stufe B | Beispiel-Knoten |
|---|---|---|---|---|---|---|
| Desktop-Browser | pro Profil | browser-SW | nur Tab offen | optional Container | ja (eigener Key) | heute Klaus' Sage-Page-Test im Chrome-Tab |
| DeX-Tablet | pro Profil | browser-SW | nur Tab offen | optional Container | ja | heute Mein-Mixarium / Mein-Rezeptbuch im DeX-Chrome (Galaxy Tab S6 + DeX, Cross-Knoten-Handshake 2026-05-17) |
| PWA-installiert | pro Profil | App-SW | Tab fest, längere Lebenszeit | optional Container | ja | Mein-Mixarium + Mein-Rezeptbuch nach „Zur Startseite hinzufügen" (Variante 3b mit `importScripts('./sbkim-sw.js')` im bestehenden App-SW, Karte 09 § Schritt 3b) |
| Mini-Browser (V8) | eigene DB (App-Daten-Verzeichnis) | App-eigener | Tray-Modus, Hintergrund-OK | Datei-System | ja (Key im App-Dir) | Vision-Anker 8 (Tauri-App, noch nicht gebaut) |
| Extension (V7) | Browser-DB geteilt mit PWA | Background-Service-Worker | Popup-Trigger, begrenzt | keine eigene, nutzt PWA-Container | ja im Popup | Vision-Anker 7 („Lampe in der Toolbar", noch nicht gebaut) |

**Spalten-Glossar:**

- **IndexedDB** — wo die identitäts-tragende Datenbank
  (`sbkim_<dbSuffix>`) physisch liegt. „pro Profil" bedeutet:
  Browser-Profil-spezifisch, Reklamations-Risiko bei Browser-
  Aufräumen (siehe `docs/OBSERVATORIUM_BROWSER.md` § Lehre 1).
  „eigene DB (App-Daten-Verzeichnis)" bei Mini-Browser löst dieses
  Risiko strukturell. „Browser-DB geteilt mit PWA" bei der
  Extension meint: Extension liest und schreibt nicht in die SBKIM-
  IndexedDB; die Identitäts-Schlüssel bleiben in der PWA, die
  Extension ist nur Anzeige- und Steuerungs-Hülle.
- **SW** — welcher Service-Worker den `/sbkim/`-Pfad bedient.
  „browser-SW" = der von der Page selbst registrierte Worker beim
  Tab-Öffnen (Variante 3a Standalone, Karte 09 § Schritt 3a).
  „App-SW" = der bestehende App-Service-Worker der PWA, in den
  `sbkim-sw.js` via `importScripts('./sbkim-sw.js')` koexistent
  eingebunden ist (Variante 3b, Karte 09 § Schritt 3b).
  „App-eigener" = der Service-Worker, den die Mini-Browser-App-
  Shell selbst hostet (kein Browser-Worker im Sinne der Web-API,
  weil Tauri-WebView eigene Engine). „Background-Service-W." =
  Extension-eigener Background-Worker nach Manifest V3.
- **Spore-Empfang** — wann und wie lange der Knoten Handshakes
  beantworten kann. „nur Tab offen" und „Popup-Trigger, begrenzt"
  sind ehrlich offline-anfällig — der Knoten antwortet, solange
  der Tab im Vordergrund läuft (oder im Hintergrund mit
  ausreichendem Browser-Quota), sonst nicht. „Tab fest, längere
  Lebenszeit" bei PWA-installiert ist eine Browser-Eigenschaft
  (PWAs bekommen erfahrungsgemäß längere Worker-Lebenszeit), kein
  echtes Hintergrund-Service-Versprechen. „Tray-Modus, Hintergrund-
  OK" beim Mini-Browser ist der einzige strukturelle Hintergrund-
  Empfang im Profil-Inventar — Bezug zu Vision-Anker 4 (Königin-
  Relay) siehe § 6.4 unten.
- **Identitäts-Backup** — wie die Identität die Plattform überlebt
  (Browser-Wechsel, Geräte-Wechsel, IndexedDB-Reklamation). „optional
  Container" meint: Modul 02 `exportBackup` / `importBackup` (Bau
  02.X 2026-05-16, PBKDF2-SHA256-600 000 + AES-GCM-256) — Klaus
  speichert den Backup-Blob außerhalb der Plattform und importiert
  ihn beim Plattform-Wechsel. Verweis auf Vision-Anker 5
  (Identitäts-Container) für die Container-UX. „Datei-System" beim
  Mini-Browser meint: Tauri-Backend hat direkten Dateisystem-Zugriff
  und kann den verschlüsselten Container in eine `.sbkim`-Datei im
  App-Daten-Verzeichnis schreiben — kein Browser-Download-Pfad
  nötig. „keine eigene, nutzt PWA-Container" bei der Extension
  meint: Extension-Popup ruft den PWA-Endpunkt für Backup-Export
  auf, eigene Schlüssel-Haltung wäre ein Sicherheitsbruch (zwei
  Speicher-Schichten = zwei Verlust-Risiken).
- **Stufe B** — Verfügbarkeit der optionalen LLM-Erklär-Schicht
  aus Vision-Anker 9 (M04-Erweiterung — drei Schichten + Brücke
  + doppelte Spore). „ja" bedeutet: die Plattform kann einen
  User-eigenen API-Key halten und einen Stufe-B-Call ausführen.
  Wo der Key konkret liegt, hängt vom Profil ab: „eigener Key"
  in Desktop-Browser / DeX-Tablet (Browser-Storage); „Key im
  App-Dir" beim Mini-Browser (Datei-System, kein Browser-
  Reklamations-Risiko); „im Popup" bei der Extension (Extension-
  eigener Storage, NICHT die PWA-IndexedDB — Trennung der
  Sicherheits-Domänen). Die Spec der Stufe B selbst liegt in
  Brief 03 (M04-Erweiterung), die Plattform-Matrix nennt nur das
  Schnittstellen-Eckdatum.
- **Beispiel-Knoten** — heute laufender Endknoten oder Vision-
  Anker-Verweis. Jede Zeile soll einen konkreten Ankerpunkt
  haben, damit die Matrix nicht im Abstrakten bleibt. Die zwei
  Vision-Anker-Zeilen (Mini-Browser V8, Extension V7) markieren
  die nicht-gebauten Profile transparent.

**Sage als dritter Endknoten (Brief 01) in der Plattform-Matrix:**
Sage liegt heute auf GitHub Pages und nimmt damit **zwei Profile**
ein, je nach Andock-Zustand des Betreibers:

- **Vor Installation (Desktop-Browser bzw. DeX-Tablet):** Sobald
  jemand `https://lausiklauskn-png.github.io/Sage-Protokol/`
  im Browser-Tab öffnet und an der Schwarz-Loch-Karte andockt
  (Andock-Wizard aus § 6.1, Bau-Sitzung folgt), spielt der
  Knoten unter dem Desktop-Browser-Profil bzw. dem DeX-Tablet-
  Profil. IndexedDB `sbkim_sage` liegt pro Browser-Profil,
  Service-Worker ist der von der Sage-Page selbst registrierte
  Standalone `sbkim-sw.js` (Variante 3a aus § 6.1).
- **Nach Installation (PWA-installiert):** Sobald der Betreiber
  die Sage-Page via Browser-Menü „Zur Startseite hinzufügen"
  installiert, wechselt der Knoten ins PWA-installiert-Profil
  — mit längerer Worker-Lebenszeit und festerem Tab-Verhalten.
  Der Andock-Vertrag in § 6.1 (IndexedDB-Suffix `sbkim_sage`,
  volle init()-Kette) bleibt identisch; das Plattform-Profil
  wechselt, nicht der Sage-Knoten-Vertrag.

Sage steht damit **nicht als eigene Zeile in der Tabelle** — die
Matrix beschreibt Plattform-Profile, nicht Endknoten. Sage nimmt
diese Profile ein, ebenso wie Mein-Rezeptbuch heute das PWA-
installiert-Profil einnimmt (Beispiel-Knoten-Spalte).

> **Pflicht-Frage-Anker für künftige Plattform-Profile.** Wenn ein
> neues Profil die Matrix erweitert (z.B. Mobile-PWA mit
> WebPush-Background, mobile Capacitor-Hülle, Cordova-Wrapper),
> muss die neue Zeile alle sechs Spalten ehrlich belegen und das
> Beispiel-Knoten-Feld einen konkreten Anker tragen (Endknoten oder
> Vision-Anker). Ehrliche Belegung heißt: was die Plattform
> NICHT kann, steht expliziert in der Zelle — keine Schönfärberei
> über Hintergrund-Empfang oder Schlüssel-Sicherheit. Siehe § 6.3.

### 6.3 Plattform-Ehrlichkeits-Klausel

**Verbindliche Spec-Klausel.** Sporen-Verhalten ist plattform-
ehrlich: jede Spore trägt implizit ihre Plattform (durch ihren
`endpoint` und das beobachtete Empfangs-Verhalten), kein Knoten
lügt über Hintergrund-Empfang oder Schlüssel-Sicherheit.
Plattformen mit „nur Tab offen" (Desktop-Browser, DeX-Tablet,
PWA-installiert) oder „Popup-Trigger, begrenzt" (Extension) sind
ehrlich offline-anfällig — Hintergrund-Empfang ist Vision-Anker 4
(Königin-Relay) vorbehalten und **kein Pflicht-Bestandteil des
Protokolls.** Ein Knoten ohne Hintergrund-Empfang ist ein
vollwertiger Mycel-Teilnehmer; das Empfangsmodus-Prinzip aus
`sbkim_paper.pdf` („wer nicht da ist, schweigt") bleibt
unangetastet.

**Begründung (Klaus' Lehre 1, Browser-Instanzen-Trennung).** Die
Pages-Live-Tests am 2026-05-17 haben gezeigt, dass dieselbe Spore
in zwei Browser-Instanzen (DeX-Chrome vs. Tablet-Chrome auf
demselben Galaxy Tab S6) faktisch zwei getrennte Knoten ergibt —
eigene IndexedDB, eigene Service-Worker, eigene PWA-Liste; ein im
DeX-Modus angedockter Knoten ist im Tablet-Modus nicht da. Die
Ursache ist keine Schwäche im Protokoll, sondern eine Eigenschaft
der Plattform — die Browser-Engine isoliert Instanzen für
legitime Sicherheits- und Datenschutz-Zwecke. Die Plattform-
Ehrlichkeits-Klausel zieht daraus die Konsequenz: **eine Spore
verspricht nicht, mehr zu können als ihre Plattform hergibt.** Wer
einen immer-online-Knoten braucht, wechselt das Profil (Mini-
Browser mit Tray-Modus, Vision-Anker 8) oder lehnt sich an eine
Königin-Mailbox (Vision-Anker 4) — beides ist Plattform-Wechsel
oder Plattform-Ergänzung, nicht Spore-Erweiterung.

Diese Klausel ist verbindlich für jede künftige Plattform-Profil-
Erweiterung der Matrix in § 6.2. Bezugs-Dokumente: Klaus' Lehre 1
in `docs/OBSERVATORIUM_BROWSER.md` § Lehre 1; PULS § Offene
Querschnitts-Fragen „DeX-Chrome vs. Tablet-Chrome — zwei
getrennte Browser-Instanzen"; PULS § Vision-Anker 1 § Bezugs-
Block (Pages-Live-Tests 2026-05-17).

### 6.4 Vision-Bezüge

Querverweis-Matrix zwischen den V1-Sammelspec-relevanten Vision-
Ankern aus PULS § Vision-Anker. Sieben Anker — V1 (Sage-Hybrid),
V9 (M04-Erweiterung), V6 (Multi-Identität), V7 (Extension), V8
(Mini-Browser), V4 (Königin-Relay), V5 (Identitäts-Container).
Dieser Block VERWEIST nur auf die Anker und benennt ihre Rolle im
Plattform-Matrix-Kontext; er SPEZIFIZIERT sie nicht. Anker 1
wurde mit Brief 01 als Strang 1 realisiert; Anker 9 (Brief 03),
Anker 6 (Brief 04), Anker 7 / 8 / 4 / 5 haben eigene Spec-
Sitzungen oder bleiben Vision.

| V1 (Sage-Hybrid) | V9 (M04) | V6 (Multi-Id.) | V7 (Extension) | V8 (Mini-Browser) | V4 (Königin) | V5 (Container) |
|---|---|---|---|---|---|---|
| Träger | Stufe-B-Ort | Persona-Quelle | Toolbar-Lampe | Tray-Träger | Mailbox | Key-Speicher |

**Erläuterungen pro Anker (Rolle im Plattform-Matrix-Kontext,
nicht Spec des Ankers):**

- **V1 (Sage-Hybrid) — Träger.** Sage ist ab Brief 01 ein
  vollwertiger Endknoten und damit der erste konkrete Träger der
  Plattform-Matrix-Profile, die der Hub selbst spezifiziert. Mit
  Brief 01 wird die Konvention `NODE_TYPE_DEFAULT = "hybrid"` aus
  § 0 selbstreferenziell wahr: Sage trägt die Matrix, in der
  Sage selbst eine Zeile (bzw. zwei Profile, Desktop-Browser und
  PWA-installiert) belegt. Vollständige Spec siehe § 6.1.
- **V9 (M04-Erweiterung) — Stufe-B-Ort.** Die Spalte „Stufe B" der
  Plattform-Matrix benennt nur, **wo** der LLM-Erklär-Pass laufen
  kann (und wo der User-eigene API-Key liegt). **Wie** die drei
  Schichten (fachlich / prozess / skalierung) und das Brücken-
  Feld konkret aussehen, definiert Brief 03 der V1-Sammelspec-
  Kaskade (M04-Erweiterung). Die Plattform-Matrix wartet auf
  Brief 03 — bis dahin ist die „ja"-Belegung in den Stufe-B-Spalten
  ein Schnittstellen-Versprechen, kein implementiertes Verhalten.
- **V6 (Multi-Identität) — Persona-Quelle.** Brief 04 der V1-
  Sammelspec-Kaskade spezifiziert mehrere Identitäts-Slots in
  derselben IndexedDB (`sbkim_keys["main"]` / `["beruflich"]` /
  `["test"]` + `sbkim_meta["active-identity"]`-Marker). Die
  Plattform-Matrix bleibt davon unberührt — Multi-Identität ist
  eine Schicht **innerhalb** einer Plattform, kein zusätzliches
  Plattform-Profil. Mini-Browser und Extension können die
  Persona-Wahl als UX-Element exponieren (Tray-Menü-Eintrag bzw.
  Popup-Dropdown), das ist Bau-Detail in Brief 04 / V7 / V8.
- **V7 (Extension) — Toolbar-Lampe.** Plattform-Profil-Zeile 5 der
  Matrix in § 6.2. Manifest-V3-basierte Browser-Extension mit
  zwei Toolbar-Lampen (Status + Aktivität); kein eigener
  Identitäts-Speicher, nutzt die PWA-IndexedDB-Identität.
  Modul-13-Bridge (in PULS § Vision-Anker 7 skizziert) bleibt
  Spec-offen. Mobile-Browser unterstützen keine Extensions —
  Klaus' DeX-/Tablet-Chrome-Setup bleibt außen vor.
- **V8 (Mini-Browser) — Tray-Träger.** Plattform-Profil-Zeile 4
  der Matrix in § 6.2. Tauri-App (Rust-Backend + System-WebView,
  ~10–30 MB pro Plattform-Binary), eigene IndexedDB im App-Daten-
  Verzeichnis (kein Browser-Reklamations-Risiko, strukturelle
  Antwort auf Lehre 1), Tray-Icon-Modus für Hintergrund-Empfang.
  Der einzige Profil-Eintrag mit „Hintergrund-OK" in der Spore-
  Empfangs-Spalte — und damit der wahrscheinlichste Hintergrund-
  Empfänger für eine Königin-Polling-Schleife (siehe V4).
- **V4 (Königin-Relay) — Mailbox.** Plattformen mit „nur Tab
  offen" (Desktop-Browser, DeX-Tablet, PWA-installiert) und
  „Popup-Trigger, begrenzt" (Extension) sind die Hauptgründe,
  warum die Königin als optionaler Modul-13-Anker überhaupt
  Sinn ergibt: eine Mailbox puffert verschlüsselte Handshake-
  Envelopes, solange der Empfänger nicht da ist. Die Plattform-
  Matrix benennt das Problem (offline-Anfälligkeit der vier
  Tab-/Popup-Profile), das Königin-Relay benennt die Lösungs-
  Schicht. Brief 02 spezifiziert das Relay NICHT — Anker 4 hat
  eine eigene Spec-Sitzung (PULS § Vision-Anker 4, Status „reif
  für Spec-Diskussion nach V1").
- **V5 (Identitäts-Container) — Key-Speicher.** Die Spalte
  „Identitäts-Backup" der Plattform-Matrix verweist auf den
  Container als Backup-Strategie über alle Plattformen hinweg.
  Die Container-Spec liegt in Vision-Anker 5 (Pfad 1 Rucksack-
  Datei ist mit Bau 02.X bereits implementiert; Pfade 2/3/4
  Hardware-Wallet / Mini-Browser-Träger / Passkey-Sync sind
  Vision). Stufe-B-API-Key (V9) gehört in den verschlüsselten
  Container, nicht in plain IndexedDB.

**Anti-Vorgriff auf V4 / V5 / V7 / V8 (Brief-02-Disziplin):** Die
Matrix VERWEIST auf diese Vision-Anker, sie SPEZIFIZIERT sie nicht.
Königin-Relay (V4), Identitäts-Container (V5), Extension (V7) und
Mini-Browser (V8) haben eigene Spec-Sitzungen (oder bleiben
Vision). Brief 02 nimmt nur die Schnittstellen-Eckdaten in die
Matrix.

---

## 7. LLM-Stufe-B-Ehrlichkeits-Klausel (M04-Erweiterung)

**Verbindliche Spec-Klausel.** Spec-Sitzung M04-Erweiterung (Brief 03
der V1-Sammelspec-Kaskade, 2026-05-19). Stufe B — der optionale
LLM-Erklär-Pass über das Stufe-A-Match-Resultat (`explainMatchLLM`
aus § 1 Modul 04) — ist **opt-in pro Knoten**. Wer keinen User-eigenen
API-Key hinterlegt, bleibt vollwertiger Mycel-Teilnehmer; Stufe A
allein ist rückgrat-tragend lokal. Kein Knoten wird gezwungen, einen
Drittanbieter (Anthropic, OpenAI, sonst) zu nutzen.

Diese Klausel ist namentlich von § 6.3 Plattform-Ehrlichkeits-Klausel
(Brief 02) zu unterscheiden: § 6.3 ist Plattform-allgemein (Hintergrund-
Empfang, Schlüssel-Sicherheit, Spore-Verhalten); diese § 7 ist
Stufe-B-spezifisch (LLM-Call, API-Key, Drittanbieter-Abhängigkeit).
Sie ergänzen einander — § 6.3 + § 7 zusammen ergeben das Bild: das
Mycel verspricht nichts, was eine Plattform oder ein Drittanbieter
nicht zuverlässig hergibt.

**Vier Sätze (verbindlich):**

1. **Stufe B ist opt-in.** Ein Knoten ohne hinterlegten API-Key
   ruft `explainMatchLLM` schlicht nicht auf — Modul 04 wirft beim
   Aufruf mit leerem Schlüssel `InvalidApiKeyError` (siehe § 1 Modul 04
   § Fehlerverhalten). Es gibt keinen automatischen Fallback auf einen
   geteilten Schlüssel des Repos oder eines anderen Knotens.

2. **Stufe A ist rückgrat-tragend lokal.** Match-Entscheidungen
   (`isAboveProviderThreshold`, Schicht-Schwellen aus § 1 Modul 04 §
   Schwellen-Vertrag) laufen ausschließlich aus den Stufe-A-Werten.
   `explainMatchLLM` kann eine Übersteuerungs-Empfehlung liefern
   (`overrideRecommendation`), aber Aufrufer sind nicht weisungsgebunden
   — wer Stufe B ignoriert, bleibt im vollen Anastomose-/Heterokaryose-
   Netz.

3. **Kein Knoten wird gezwungen, einen Drittanbieter zu nutzen.**
   Modul 04 hartcodiert keine API-Endpunkte und keine Modell-IDs
   (siehe § 0 `STUFE_B_DEFAULT_MODEL` — Konvention, nicht Pflicht);
   der `apiKey`-Parameter ist opaque (Modul 04 prüft nur, dass er
   nicht leer ist und kein null). Aufrufer wählen Modell und Anbieter
   pro Call. Wer eine selbst-gehostete LLM-API betreibt, kann sie
   genauso einbinden wie die Anthropic-API.

4. **Knoten ohne Stufe B sind vollwertige Netz-Teilnehmer.** Die
   Match-Pipeline (Modul 04 → Modul 05 Anastomose → Modul 06
   Heterokaryose → Modul 07 Apoptose) läuft komplett ohne Stufe B
   durch. Brücken-Vorschläge entstehen nur dort, wo jemand Stufe B
   anruft; das Mycel wächst auch ohne sie. Stufe B ist semantische
   Vertiefung, keine Eintritts-Barriere.

**Plattform-Matrix-Konsumtion (siehe § 6.2 Spalte „Stufe B"):** Die
Plattform-Matrix nennt pro Profil, **wo** der User-eigene Key liegen
kann (eigener Key in Desktop-Browser / DeX-Tablet; Key im App-Dir bei
Mini-Browser; im Popup bei der Extension; via PWA-Container in
allen Fällen optional via Modul 02 `exportBackup`). Modul 04
konsumiert den Key Plattform-agnostisch — die Plattform-spezifische
Container-Logik liegt in Vision-Anker 5 (Identitäts-Container,
PULS § Vision-Anker, eigene Spec-Sitzung).

Bezugs-Dokumente: PULS § Vision-Anker 9 § Match-Pipeline § Stufe B;
`docs/papers/sbkim-paper-en.html` § 3.4 „Protocol Properties" („Stateless"
+ „Evaluator agnosticism"); § 6.2 Plattform-Matrix Spalte „Stufe B".

---

## 8. Anti-Missbrauch-Klausel (M04-Erweiterung)

**Verbindliche Spec-Klausel.** Spec-Sitzung M04-Erweiterung (Brief 03
der V1-Sammelspec-Kaskade, 2026-05-19). Der Brücken-Vorschlag aus
Stufe B (`BridgeProposal` in § 1 Modul 04 § Brücken-Feld-Spec) bleibt
**lokal** — kein Spore-Leak, keine ungeschützte Empfehlung über das
Netz.

**Drei Sätze (verbindlich):**

1. **Brücken-Vorschlag bleibt lokal.** `candidateScope` darf in der
   produktiv ausgelieferten Form heute nur `"lokal"` tragen. Wer
   die Form aus dem LLM-Output mit `"netz"` empfängt, sieht sie
   in Modul 04 still auf `"lokal"` korrigiert (defensive Wahl,
   kein Throw — siehe § 1 Modul 04 § Brücken-Feld-Spec). Der
   `"mailbox"`-Wert ist formal erlaubt, bedingt aber Modul 13
   (Königin-Relay, Vision-Anker 4, PULS); vor Modul 13 nicht
   produktiv aktivierbar — wer ihn setzt, wird vom Aufrufer
   ignoriert.

2. **`candidateScope:"netz"` ist formal nicht aktivierbar bis Anker
   10-12 gebaut sind.** Modul 10 (Reputation, Schutz-Backlog), Modul
   11 (Rate-Limit, Schutz-Backlog) und Modul 12 (Blocklist,
   Schutz-Backlog) zusammen liefern die Anti-Spam-Schicht, ohne die
   ein Netz-Versand von Brücken-Vorschlägen Spore-Leakage und
   Spam-Vektoren erzeugen würde. Vor Anker-10-12-Aktivierung darf
   kein Modul (insbesondere nicht Modul 06 Heterokaryose) eine
   Brücken-Vorschlag-Outbox-Eintrag mit `candidateScope:"netz"`
   versenden. Bei Aktivierung von Anker 10-12 wird diese Klausel
   überprüft und ggf. eine Folge-Spec-Sitzung schreibt die
   Netz-Aktivierung mit den dann verfügbaren Schutz-Mechanismen.

3. **Modul 06 Heterokaryose filtert Brücken-Vorschlag-Einträge.**
   Wenn `sbkim_hetero_outbox` (Schreiber Modul 08, Leser Modul 06)
   einen Brücken-Vorschlag-Eintrag enthält (in einer Folge-Spec-
   Sitzung 06 oder 08 als eigener `entryType`-Wert spezifiziert),
   filtert Modul 06 ihn beim Lese-Pfad: `candidateScope:"lokal"` →
   Anker bleibt im Outbox, geht nie ins Netz; `candidateScope:
   "mailbox"` → Spec-offen, wartet auf Modul 13; `candidateScope:
   "netz"` → wird nicht versendet (Karte 06 Spec, siehe Verweis
   unten). Die Filter-Logik selbst spezifiziert Karte 06 in einem
   Folge-Spec-Sub-Block (kein Bau-Detail in Brief 03).

**Verbindlichkeit:** Diese Klausel gilt für **jede** Folge-Spec-
Sitzung, die mit Brücken-Vorschlag-Einträgen umgeht — bis eine
ausdrückliche Folge-Spec-Sitzung sie unter Verweis auf
implementierte Anker 10-12 ändert.

Bezugs-Dokumente: PULS § Vision-Anker 9 § Architektur-Skizze §
„Anti-Missbrauch"; CLAUDE.md § „Was du nicht tust" („Kein Crawler,
keine Pulsation, keine Eigenanfragen ins offene Netz"); `docs/
components/10_reputation.md` (Stub, Schutz-Backlog); `docs/
components/11_rate_limit.md` (Stub); `docs/components/12_blocklist.md`
(Stub); Karte 06 § Brücken-Vorschlag-Eintrags-Typ (Folge-Spec-Block,
Brief 03 hat den Verweis hinterlegt).

---

## 9. Identitäts-Map (Multi-Identität, Brief 04)

**Verbindliche Spec-Klausel.** Spec-Sitzung Multi-Identität (Brief 04
der V1-Sammelspec-Kaskade, 2026-05-19). Diese Sektion verankert die
Multi-Identitäts-Konvention, die mit Brief 04 eingeführt wird, und
spannt den Vertrag zwischen Modul 02 (Owner der Identitäts-Slots) und
den Konsumenten 05 / 06 / 07 auf. Sie ist namentlich von § 0 (globale
Konstanten) und § 1 Modul 02 (Modul-Vertrag) zu unterscheiden — § 9
beschreibt die *Map* zwischen Slot-Schlüssel und identitäts-spezifischen
Stores plus den `active-identity`-Marker; § 0 / § 1 verweisen darauf.

### 9.1 Slot-Schema

```
sbkim_keys["main"]                      → Default-Identitäts-Slot (verbindlich, Rückwärts-Kompat)
sbkim_keys["<frei wählbarer key>"]      → weitere Slots, beliebig viele
sbkim_spore["main"]                     → Spore-Slot zur Identität "main"
sbkim_spore["<key>"]                    → Spore-Slot zur Identität <key>
sbkim_meta["active-identity"]           → String-Marker: welche Identität ist aktiv?
                                          Default "main", falls fehlend.
```

**Schlüssel-Wahl:** keys sind frei wählbare Strings, [a-z0-9-]+
empfohlen (kein Sub-Slash, kein Whitespace, keine Sonderzeichen, die
in Store-Namen Probleme machen). Modul 02 validiert keine Schlüssel-
Form — der Aufrufer trägt Verantwortung. Reservierte Schlüssel: KEINE
(auch "main" ist kein Magic-Wert; lediglich Default-Slot mit
Rückwärts-Kompat-Garantie). Maximale Slot-Anzahl: kein Limit in Brief
04 (Spec-offen für Folge-Sitzung; praktische Grenze ist
IndexedDB-Quota).

### 9.2 Identitäts-spezifische Stores

Folgende IndexedDB-Stores existieren pro Identitäts-Slot. Pattern-
Form `<store-base>_<key>`; die Store-Liste pro `<key>` ist
deckungsgleich. Modul 01 ist Owner aller Stores; pro Identität
werden sie additiv angelegt (siehe § 9.5 Migrations-Strategie).

| Store-Basis              | Pattern                              | Schreiber | Leser     |
|---|---|---|---|
| `sbkim_siblings`         | `sbkim_siblings_<key>`               | 05         | 05/06/07/08 |
| `sbkim_anastomosis_log`  | `sbkim_anastomosis_log_<key>`        | 05/06      | 07          |
| `sbkim_legacy_inbox`     | `sbkim_legacy_inbox_<key>`           | 07         | 07/00/08   |
| `sbkim_hetero_inbox`     | `sbkim_hetero_inbox_<key>`           | 06         | 06/00/08   |
| `sbkim_hetero_outbox`    | `sbkim_hetero_outbox_<key>`          | 08         | 06         |

**Persona-Isolation:** Anker / Geschwister / Vermächtnisse einer
Persona dürfen NICHT in den Slots einer anderen Persona desselben
Knotens landen. Wer Persona-übergreifende Sicht braucht, iteriert
`SbkimSpore.listIdentities()` aufrufer-seitig und addiert die Stores.
Diese Spec-Klausel ist verbindlich für Module 05 / 06 / 07 — eine
Folge-Spec-Sitzung darf sie nicht lockern, ohne den Privatheits-
Trade-off (zwischen Personen-Wechsel und „leak across personae")
ausdrücklich neu zu verhandeln.

### 9.3 `active-identity`-Marker

`sbkim_meta["active-identity"]` ist ein lokaler String-Marker (kein
Spore-Feld, kein Netz-Transport). Default „main", falls fehlend.

Lese-Konvention (verbindlich für Module 05 / 06 / 07):
- Modul ruft `SbkimSpore.getActiveIdentityKey()` im `init()`-Pfad.
- Wert wird in einer modul-lokalen Variable für die Lebenszeit der
  jeweiligen Operation gecached.
- Mid-Operation-Wechsel ist **nicht spezifiziert**; ein Aufrufer, der
  mitten in einem laufenden handshake / receiveLegacy /
  requestHeterokaryosis `setActiveIdentity` ruft, bekommt undefiniertes
  Verhalten. Eine Folge-Spec-Sitzung darf einen aktiven Hook für
  Mid-Operation-Wechsel definieren (z.B. CustomEvent
  `sbkim:active-identity-changed`); Brief 04 spezifiziert das NICHT.

Schreib-Konvention:
- Modul 02 ist **alleiniger Schreiber** des Markers
  (`setActiveIdentity` / `removeIdentity` mit force-Fall).
- Modul 01 darf `sbkim_meta` aus IndexedDB-Sicht löschen (beim
  globalen Self-Apoptose-Cleanup über Modul 07; siehe § 1 Modul 07
  § Cleanup-Reihenfolge Schritt 8).

### 9.4 Receiver-Pfad (Eingehende Anfragen treffen auf Personae)

Eingehende Requests aus Modul 05 / 06 / 07 tragen typischerweise ein
`toNodeId`-Feld (Modul 05 HandshakeRequest optional, Modul 06
HeterokaryosisRequest Pflicht, Modul 07 LegacyMessage Pflicht). Brief
04 verankert die Receiver-Map-Konvention:

1. Beim `init()` baut das jeweilige Modul eine Map
   `nodeId → key` aus `listIdentities()` ×
   `getOrCreateIdentity(key)`-Resolution.
2. Pro eingehendem Request wird `request.toNodeId` gegen die Map
   geprüft. Treffer → die getroffene Persona wird für diese Operation
   intern als aktive Identität verwendet (siehe entsprechende
   `_per_identity_op(...)`-Pattern-Notizen in den Modul-Verträgen).
3. Kein Treffer → Response `outcome:"rejected", reason:"toNodeId
   stimmt nicht zum Empfänger"` (analog Modul 05 Vor-Brief-04-
   Verhalten — die Logik wird erweitert, die Reason-Klausel bleibt
   gleich).

**Schlanke Map-Konvention:** die nodeId→key-Map wird beim `init()`
einmal gebaut und gecached (nicht pro Request neu aufgelöst, weil
das pro Persona einen async-Crypto-Aufruf erzwingen würde). Wer
`getOrCreateIdentity` für eine bisher unbekannte Persona-Key ruft
(neue Identität anlegen), muss anschließend Module 05 / 06 / 07
re-initialisieren ODER eine API-Erweiterung in einer Folge-Spec-
Sitzung anstoßen (`refreshIdentityMap()`-Hook in 05 / 06 / 07).
Brief 04 spezifiziert das NICHT; die heutige Empfehlung ist:
`init()` einmal pro Tab und Identitäts-Anlage über
`getOrCreateIdentity(key)` + Re-Andock-Reload für neue Personae.

### 9.5 Migrations-Strategie (Modul-01-Eingriff)

Modul 01 muss die identitäts-spezifischen Stores anlegen können.
Brief 04 stellt zwei Optionen mit Trade-offs:

**Option A (Empfehlung) — Dynamische Store-Erzeugung:** Modul 01
bekommt einen additiven Helper `ensureStore(name: string) →
Promise<void>` (Spec-offen für die genaue Signatur — Modul 01
darf eine Liste verlangen). Modul 02 ruft `ensureStore(...)` für
jeden identitäts-spezifischen Store, bevor er beschrieben wird.
Vorteile: keine vorab-Annahme über die Slot-Anzahl, keine harte
v=N-Migration pro Identitätsanlage. Nachteile: jeder
`getOrCreateIdentity(key)`-Aufruf braucht ein `db.close()` +
`indexedDB.open(<dbName>, <new-version>)`-Kreislauf in Modul 01 —
non-trivial, weil IndexedDB-Versions-Bumps `onversionchange` auf
allen offenen Tabs feuern. Bau-Folge-Sitzung 01.Y muss die Versions-
Bump-Choreografie sauber liefern.

**Option B — Fest deklarierte Slot-Tabelle:** Modul 01 deklariert
eine endliche Slot-Liste (z.B. STORES_V4 = STORES_V3 + Stores für
N feste Identitäts-Slots). Vorteile: einfacher Versions-Bump v=3 →
v=4, keine dynamische Choreografie. Nachteile: Slot-Anzahl ist
hartcodiert (N=3 oder 5 oder 10) und blockiert Klaus' Vision „beliebig
viele Personae".

**Empfehlung in der Spec:** Option A (dynamische Store-Erzeugung).
Die Bau-Folge-Sitzung 01.Y zieht den `ensureStore`-Pfad nach und
versioniert v=3 → v=4 nur einmalig (zum Andock-Zeitpunkt der
Multi-Identitäts-Migration in den Endknoten). Klaus entscheidet
beim Andock pro Endknoten, ob er die Migration mitmacht.

**Stand 2026-05-19:** Bau-Folge-Sitzung 01.Y vom 2026-05-19 hat den
`ensureStore`-Pfad gebaut. Details — Signatur, Garantien,
Fehlerverhalten, Pattern `^sbkim_[a-z0-9_]+$`, Versions-Bump-
Choreografie mit `db.version + 1`-Inkrement und fail-soft
`onversionchange`-Handler — siehe § 1 Modul 01 Bietet-Block.

**Folge-Befund 2026-05-19 (Klaus' Bau-02.Y-Sichttest, DeX-Chrome auf
Galaxy Tab S6):** Modul 01 `init()` ist nicht versions-fail-soft.
`init()` ruft hartkodiert `indexedDB.open(name, DB_VERSION)` mit der
Build-Konstante; nach `ensureStore`-Bumps aus früheren Sitzungen ist
die DB-Version > `DB_VERSION`, und der nächste init scheitert mit
`VersionError`. Klaus muss bei jedem Sichttest Browserdaten löschen
oder den Cleanup-Workaround „Panel 01 ‚Storage init' klicken" fahren.
**Eine Folge-Pflege Modul 01 `init()` versions-fail-soft ist als
nächster Bau-Pipeline-Schritt vorgemerkt** (eigener Brief, eigener
PR; bleibt strikt additiv — Brief-04-Vertrag aus § 9 unangetastet).
Lösungs-Skizze: `init()` öffnet die DB erst ohne Version-Param
(liefert existing Version), prüft Pflicht-Stores aus `STORES_V1/V2/V3`
sync, bumpt nur bei fehlenden Stores mit `existing.version + 1`-
Inkrement. Damit fällt das Klaus-unfreundliche Verhalten weg, dass
Test-Stores aus früheren Sitzungen den nächsten init blockieren.
Dieser Hinweis ist eine **Tafel-Evolutions-Notiz** im Sinne der
CLAUDE.md-Klausel „Tafel-Evolution" (Pflege 2026-05-19): die Brief-
02.Y-Tafel „KEIN Modul-01-Eingriff" war scope-disziplin für diese
Bau-Sitzung, **erlaubt aber explizit eine eigene Pflege-Sitzung**
mit eigenem Brief und eigenem PR.

**Stand 2026-05-19 (Pflege durchgeführt):** Die Folge-Pflege „Modul
01 `init()` versions-fail-soft" vom 2026-05-19 hat den Pfad eingebaut.
`init()` öffnet die DB jetzt erst via Probe-Open ohne Version (liefert
existing Version), prüft Pflicht-Stores sync und übernimmt existing
DB-Versionen > `DB_VERSION` ohne Versions-Bump. Bei fehlendem Pflicht-
Store: `StorageOpenError` mit der Liste der fehlenden Stores (Modul 01
repariert manuell zerstörte DBs nicht). Details — Garantien, Code-
Pfad mit `openProbe`/`checkRequiredStores`/`openExact`, Multi-Tab-
Race-Limitierung — siehe § 1 Modul 01 Bietet-Block (init-Garantien-
Block).

### 9.6 Trade-off-Klausel

1. **IndexedDB-Verlust löscht ALLE Identitäten gleichzeitig.** Anker
   5 (Identitäts-Container, eigene Spec-Sitzung) bleibt parallel
   sinnvoll als Backup-Strategie. Brief 04 verweist nur — der
   Container-Inhalt ist Anker 5's Spec.
2. **Multi-Identitäts-Backup-Strategie (Modul 02 `exportBackup`
   erweitert):** Spec-Empfehlung in Brief 04 ist **ein Container mit
   allen Identitäten** als „kompletter Rucksack" (Klaus' Vision aus
   PULS § Vision-Anker 6). Die Bau-Folge-Sitzung 02.Y zieht den Code
   nach (additive Schema-Erweiterung `SbkimBackupBlob.payload.identities[]`
   pro Slot, Klartext nach Decrypt — `BACKUP_FORMAT_VERSION` wird in
   der Bau-Folge-Sitzung von 1 auf 2 gebumpt, weil das Backup-Schema
   ein neues Pflicht-Feld bekommt; das ist KEIN
   `PROTOCOL_VERSION`-Bump, sondern ein additiver Bump des separaten
   Backup-Wrapper-Schemas aus § 0 `BACKUP_FORMAT_VERSION`).
   `importBackup` muss in der Bau-Folge-Sitzung 02.Y einen Pflicht-
   Vor-Check ergänzen (mindestens eine Identität im Container) und
   pro Slot die `BackupOverwriteError`-Klausel anwenden.

   **Stand 2026-05-19:** Bau-Folge-Sitzung 02.Y vom 2026-05-19 hat den
   Backup-Schema-Bump 1→2 sowie die fünf neuen / erweiterten API-
   Funktionen gebaut; siehe § 1 Modul 02 Bietet-Block.
3. **Königin-Relay (Anker 4) muss pro-Identität-Mailboxes verwalten,
   wenn Modul 13 gebaut wird.** Brief 04 verankert die Konvention —
   das *Wie* ist Anker 4's Spec-Sitzung.
4. **Privatheit (Anker 9 § Sorge ums Freigeben):** Brief 04 rührt die
   Lizenz-Frage nicht. Lizenz-Entscheidung wird beim Public-Schalten
   separat geklärt.

### 9.7 Verbindung zur M04-Erweiterung (Brief 03)

Pro Identitäts-Slot in `sbkim_keys[key]` existiert ein entsprechender
Eintrag in `sbkim_spore[key]` mit eigenen `embeddingCapabilities` +
`embeddingNeeds` (M04-Spore-Schema, Brief 03). `generateOwnSpore(meta,
key)` nimmt den optionalen `key`-Parameter (Default
`getActiveIdentityKey()`) und schreibt in den passenden Slot. Karte 02
§ M04-Erweiterung-Sub-Block aus Brief 03 hat die Persona-spezifische
Auflösung als offenen Punkt notiert; Brief 04 liefert sie.

Match-Pipeline pro Persona: `SbkimMatch.matchDimensions` (aus Brief
03) konsumiert pro Aufruf die Vektor-Slots **einer Persona** (Aufrufer
wählt). Multi-Persona-Aufrufe sind keine atomare Operation in Modul
04 — wer mehrere Personae gleichzeitig matchen will, ruft
`matchDimensions` mehrfach. Brief 04 verlangt keinen Modul-04-
Eingriff; die Schichten-Schicht aus Brief 03 ist orthogonal zur
Persona-Mehrfachheit.

Verbindlichkeit: Die Sibling-Listen pro Identität
(`sbkim_siblings_<key>`) tragen ihre Match-Cosinus zu der spezifischen
Persona, nicht zur globalen Sage-Identität. Wer Persona-übergreifende
Match-Statistiken braucht, addiert aufrufer-seitig (siehe § 9.2
Persona-Isolation).

Bezugs-Dokumente: PULS § Vision-Anker 6 (Multi-Identität, Haupt-Anker),
PULS § Vision-Anker 9 (M04-Erweiterung, doppelte Spore pro Persona),
PULS § Vision-Anker 4 (Königin-Relay), PULS § Vision-Anker 5
(Identitäts-Container), Karte 02 § Multi-Identität (Brief 04), Karten
05 / 06 / 07 § identitäts-spezifische Slot-Pfade.

---

## 10. Änderungsprotokoll

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
| 2026-05-16 | Pflege Persistenz-Strategie verbinden | Stufe (3) der drei-stufigen Identitäts-Persistenz-Architektur (PULS § Offene Querschnitts-Fragen „Identitäts-Persistenz" — Stufen 1 und 2 schon gelöst; § Spore-Persistenz-Strategie verteilt Modul-00-Punkt „Warntext"). Folge-Pflege zu Bau 02.X Backup-Export (selbiger Tag, PR #54): die textliche Brücke zwischen Stufe (1) Storage-Persist und Stufe (2) Backup-Export. **§1 Modul 00 Bietet-Block** um Hinweis auf neues `DokuStatus`-Feld erweitert (`storagePersisted: boolean \| null` — Spiegelung des Modul-01-Getters, fail-soft). **§1 Modul 00 Nutzt-Block** um neue Zeile `SbkimStorage._meta.storagePersisted` erweitert (Lese-Pfad mit `typeof`-Check, fail-soft; `null` und `true` triggern nicht, nur explizites `false`). **§1 Modul 00 Geprüft-Zeile** um 2026-05-16 (Pflege Persistenz-Strategie verbinden — Stufe 3) erweitert. **Code in `src/modules/00_doku_fenster.js` additiv** (kein Refactoring der bestehenden sechs Funktionen): neue modul-lokale Konstante `DOKU_BACKUP_TIP_TEXT` mit deutschsprachigem Hinweis-Text (Verweis auf Modul 02 Panel-02-Knopf „Backup exportieren"); `getStatusSnapshot()` um Feld `storagePersisted: boolean \| null` erweitert (liest `SbkimStorage._meta.storagePersisted` fail-soft); neuer Modal-Render-Sub-Block `renderBackupTip()` + Prädikat `isBackupTipActive(snapshot)` — die Backup-Tipp-Zeile (Klassenpräfix `sbkim-doku-backup-tip`, hell-blaue Hinweis-Farbe) erscheint zwischen Knoten-Block und Sichttest-pro-Modul-Block, wenn `snapshot.storagePersisted === false` ODER `snapshot.quota.warningLevel !== "none"`; `_meta.backupTipActive()` als Test-Helper (zieht frischen Snapshot, gibt Boolean zurück); `_meta.dokuBackupTipText` für Test-Brücken-Zugriff. **Karte 00** § Datenformate (`DokuStatus`-Feld erweitert mit Drei-Werte-Hinweis und Null-/True-gleich-Konvention), neuer § Modal-Render-Pfad-Block „Backup-Tipp-Zeile" mit Trigger-Bedingung und Wortlaut, § Konfigurationswerte modul-lokale Zeile `DOKU_BACKUP_TIP_TEXT`, § Risiken neuer Punkt „Backup-Tipp ist textlich, keine Selbstheilung" (Aufrufer-Pflicht-Trennung — Klaus klickt Panel 02 selbst), § Manueller Test neuer Punkt 7 (Drei-Setup-Probe: Persist-Stub-`false` / Quota-Trigger / Negativ-Fall), § Bauzustand-Zeile „Pflege Persistenz-Strategie verbinden". **Aufrufer-Pflicht-Trennung verbindlich:** Modul 00 ruft `SbkimSpore.exportBackup` NICHT automatisch — Hinweis-only, Klaus klickt den Panel-02-Knopf selbst (Karte 00 § Verantwortlichkeiten „Macht nicht"). **Modul 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08 unangetastet** (Modul 01 `_meta.storagePersisted` nur gelesen, Modul 02 `exportBackup` nur im Tipp-Text erwähnt). **Keine §0-Erweiterung** (keine neue Konstante; `DOKU_BACKUP_TIP_TEXT` ist modul-lokal). **Keine Spore-Feld-Erweiterung. Keine §2-/§3-/§4-/§5-Änderung.** **Kein Hauptversions-Sprung** (`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `3`, `BACKUP_FORMAT_VERSION` bleibt `1`). **`status.json` unverändert** (Modul 00 bleibt `score:"stub"`, additive Code-Erweiterung, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). **Sichttest ungeprüft** (headless gebaut — wartet auf Klaus' Browser-Lauf, Drei-Setup-Probe aus Karte 00 § Manueller Test Punkt 7). `node --check src/modules/00_doku_fenster.js` grün; Mini-Smoke-Test der Trigger-Logik in einem VM-Kontext (Persist-true/null/false × Quota-warn/none, vier Fälle alle grün). Damit ist der Querschnitts-Eintrag „Identitäts-Persistenz" final gelöst (alle drei Stufen) und „Spore-Persistenz-Strategie verteilt" ebenfalls (Quota-Schwellwert + Backup-Format + Warntext alle drei verankert). Übergabeprotokoll `docs/sessions/archiv/2026-05-16_pflege-persistenz-strategie-verbinden.md` angelegt. |
| 2026-05-17 | Spec-Sitzung BroadcastChannel-Bridge | Folge-Spec zur Pflege Scope-Fix 2026-05-17 (PR #72/#73). Architektur-Grenze ehrlich gemacht: same-origin cross-PWA Handshake via SW-Bridge ist konzeptuell unmöglich (Sender-SW intercepted, nicht Receiver-SW). Lösung: **BroadcastChannel als additiver Fallback-Transport in Modul 05**, HandshakeRequest/HandshakeResponse-Schema **unverändert**. **§1 Modul 05 Bietet-Block** erweitert um optionalen dritten Parameter `options?: { transport?: "auto"\|"http"\|"channel" }` (Default `"auto"`). **§1 Modul 05 Nutzt-Block** um `BroadcastChannel('sbkim')` + Reply-Channel-Pfad ergänzt; Timeout aus QUERY_TIMEOUT_MS (kein neuer Wert). **§1 Modul 05 Fehlerverhalten** um zwei Zeilen erweitert (Channel-Timeout → `HandshakeTimeoutError` mit Log "timeout-channel", Channel-Reply-Signatur ungültig → `HandshakeSignatureInvalidError`). **§1 Modul 05 SW-Vertrag** um Architektur-Grenze-Hinweis erweitert (Spec-Klarheit, kein Bug — Auflösung in PR #72/#73 bestätigt). **§1 Modul 05 neuer Sub-Block „BroadcastChannel-Bridge"** mit Channel-Name, Envelope-Schema (Request/Response-Wrapper, NICHT signiert; nur das innere HandshakeRequest/Response wird signiert wie bisher), Receiver-Pflicht (eager in `init()`, Filter `toNodeId`/`fromNodeId`), Sender-Pfad (Reply-Channel pro Handshake, Timeout, finally-Cleanup, `nonceEcho`-Doppelt-Bindung), `toNodeId` als **Pflichtfeld** im Channel-Pfad (im HTTP-Pfad bleibt optional), Self-Hit-Schutz, Cleanup, „Wer-nicht-da-ist-schweigt"-Konvention. **§3 Endpunkt-Pfade** zweiter Sub-Block für Anastomose-Fallback-Transport: `channel-bridge: BroadcastChannel('sbkim')` + `reply-channel: BroadcastChannel('sbkim:reply:' + nonce)`. **Verbindlich nur für Modul 05** (Anastomose) — Heterokaryose (Modul 06) und Legacy (Modul 07) bleiben HTTP-only. **§1 Modul 05 Geprüft-Zeile** um 2026-05-17 erweitert. **Karte 05** § Schnittstelle (handshake-Signatur), neue Hauptsektion „BroadcastChannel-Bridge (same-origin Fallback)" mit Entscheidungs-Tabelle E1–E7 und Begründungen, § Datenformate (Envelope-Schema), § Manueller Test neuer Punkt 9 (Channel-Pfad), § Risiken neuer Punkt „Receiver-Tab-Pflicht", § Bauzustand-Zeile „Spec BroadcastChannel-Bridge". **PROTOCOL_VERSION bleibt `"0.1"`** (additive Transport-Erweiterung, kein Schema-Eingriff). **Kein Code** in `src/modules/05_anastomose.js` (Spec, kein Bau — Bau-Sitzung folgt). **Kein Eingriff** in `src/sbkim-sw.js` (SW-Pfad ist mit `isOwnEndpoint` aus PR #72 abgeschlossen). **Kein Eingriff** in Karte 09 (Andock-Hinweis „Beide Tabs offen halten" folgt in Bau-Sitzung). **`status.json` unverändert** — Modul 05 bleibt `score:"fertig"` (additive Spec-Erweiterung am Vertrag, keine Funktionalitäts-Regression; Bau erst danach setzt den Fallback live; `update_puls_pie.py` NICHT aufgerufen). Übergabeprotokoll `docs/sessions/archiv/2026-05-17_spec-05-broadcastchannel-bridge.md` angelegt.
| 2026-05-18 | Spec-Sitzung V1 Sage-Hybrid (Brief 01) | Brief 01 der V1-Sammelspec-Kaskade (PULS § Meta-Pflege „V1-Sammelspec als Brief-Kaskade sequenziert", sechs heilige Tafeln). **Neue §6 Endknoten-Liste** angelegt: Sage als dritter Endknoten neben Mein-Rezeptbuch und Mein-Mixarium aufgenommen (id `sage`, domain `Mycel-Bibliothek`, domainDescription / domainKeywords / domainVector `null`-Slot, Stamm/Gast disjunkt). **§6.1 Sage-Endknoten — Sage-Page-Architektur** dokumentiert (IndexedDB-Suffix `sbkim_sage`, App-SW Variante 3a, volle init()-Kette mit lazy Modul-03, Andock-Geste an Schwarz-Loch-Karte als Wizard-Hinweis, Plattform-Ehrlichkeits-Vorgriff auf Brief 02). Domäne-Entscheidung „Mycel-Bibliothek" begründet (gesamtes Doku-Korpus, nicht nur Glossar oder Sage-Page-Metapher). **§6 Änderungsprotokoll auf §7 nachnummeriert** (additiv, keine Inhalte verschoben). **PROTOCOL_VERSION bleibt `"0.1"`** (additive Erweiterung, kein bestehendes Feld zur Pflicht erhoben). Plattform-Matrix-Block hier nur als Verweis-Stub auf Brief 02; M04-Erweiterung (Brief 03) und Multi-Identität (Brief 04) bleiben unberührt. Mit-Pflege: CLAUDE.md § „Was dieses Repo ist" („Hub und Knoten zugleich"), Karte 09 § Schritt 1, `status.json` § endknoten (sage-Eintrag mit `pingStatus:"pending-first-andock"` und `nodeId:null`). Sage-Page (`index.html`) unangetastet — Sage-Page-Refactor folgt als Bau-Sitzung in Brief 99-Liste. Übergabeprotokoll `docs/sessions/archiv/2026-05-18_spec-v1-sage-hybrid.md`. PR „Spec: V1 Sage-Hybrid — Strang 1 der V1-Sammelspec-Kaskade". |
| 2026-05-18 | Spec-Sitzung Plattform-Matrix (Brief 02) | Brief 02 der V1-Sammelspec-Kaskade — Strang 4 (Plattform-Matrix) als eigenständige Folge-Etappe nach Brief 01 (Spec V1 Sage-Hybrid, PR #96 gemerged). Drei neue Sub-Sektionen unter § 6: **§ 6.2 Plattform-Matrix** mit fünf Plattform-Profilen (Desktop-Browser / DeX-Tablet / PWA-installiert / Mini-Browser V8 / Extension V7) × sechs Spalten (IndexedDB / SW / Spore-Empfang / Identitäts-Backup / Stufe B / Beispiel-Knoten) plus Spalten-Glossar plus Sage-Anmerkung (Sage nimmt Desktop-Browser- und PWA-installiert-Profile ein, NICHT als eigene Zeile in der Matrix). **§ 6.3 Plattform-Ehrlichkeits-Klausel** als verbindliche Spec-Klausel: kein Endknoten gibt vor, mehr zu können als seine Plattform erlaubt — Hintergrund-Empfang ist Vision-Anker 4 (Königin-Relay) vorbehalten, kein Pflicht-Bestandteil des Protokolls; Begründung aus Klaus' Lehre 1 (Browser-Instanzen-Trennung, Pages-Live-Tests 2026-05-17). **§ 6.4 Vision-Bezüge** als Querverweis-Matrix mit sieben Ankern (V1 Träger / V9 Stufe-B-Ort / V6 Persona-Quelle / V7 Toolbar-Lampe / V8 Tray-Träger / V4 Mailbox / V5 Key-Speicher) plus Erläuterungs-Absatz pro Anker — Schnittstelle Plattform ↔ Anker, KEINE Spec der Anker selbst. **Plattform-Matrix-Stub aus § 6.1** (Brief 01) zu Verweis auf § 6.2 umgeschrieben. **PROTOCOL_VERSION bleibt `"0.1"`** (Strang 4 ist dokumentarisch additiv — Matrix ist Spec-Block, kein Spore-Schema-Feld, kein neuer Pflicht-Pfad). Mit-Pflege: KEINE — Brief 02 lebt rein in INTERFACES; CLAUDE.md / Karte 09 / `status.json` unangetastet (Brief 01 hat sie auf den Endknoten-Stand gebracht). Anti-Vorgriff auf V4 / V5 / V7 / V8 / V9 / V6 streng eingehalten (Matrix verweist, spezifiziert nicht); Brief 03 (M04-Erweiterung) erbt die Spalte „Stufe B" als Schnittstellen-Eckdatum. Übergabeprotokoll `docs/sessions/archiv/2026-05-18_spec-plattform-matrix.md`. PR „Spec: Plattform-Matrix — Strang 2 der V1-Sammelspec-Kaskade" (Brief 01-PR #96 als gemerged vorausgesetzt). |
| 2026-05-19 | Spec-Sitzung M04-Erweiterung (Brief 03) | Brief 03 der V1-Sammelspec-Kaskade — Strang 2 (M04-Erweiterung: drei Schichten + Brücke + doppelte Spore + Stufe-A/Stufe-B-Match-Pipeline) als dritte Etappe nach Brief 01 (V1 Sage-Hybrid, PR #96 gemerged) und Brief 02 (Plattform-Matrix, PR #97 gemerged). **§0 Globale Konstanten** um drei neue Konstanten erweitert: `SCHICHT_MIN_MATCH = 0.60` (pro-Dimension-Schwelle für `matchDimensions`), `STUFE_B_DEFAULT_MODEL = "claude-sonnet-4"` (Konvention für `explainMatchLLM`, aufrufer-überschreibbar), `STUFE_B_MAX_TOKENS = 1024` (Default für den Stufe-B-LLM-Call, aufrufer-überschreibbar). **§1 Modul 02 (Spore) Bietet-Block** um Spore-Schema-Erweiterungs-Hinweis ergänzt — zwei neue optionale meta-Felder für `generateOwnSpore`: `embeddingCapabilities` (Alias-Name für `domainVector`, semantisch identisch) und `embeddingNeeds` (neuer Sucher-Vektor, fehlend = „nur Anbieter-Modus"). **§1 Modul 04 (Match) Bietet-Block** um zwei neue API-Funktionen erweitert: `matchDimensions(qCap, qNeeds, pCap, pNeeds) → MatchDimensionsResult` (sync, drei Cosinus-Aufrufe + gewichteter `overall`, `availableLanes`-Feld für 0/1/2-Bidirektionalität) und `explainMatchLLM(matchResult, apiKey, options?) → Promise<ExplainResult>` (async, fehlertolerant — scheitert nie throw, resolved mit `available:false`-Form bei API-/Schema-Fehlern). **§1 Modul 04** um vier neue Sub-Blöcke erweitert: § Drei-Schichten-Modell (orthogonal `fachlich` / `prozess` / `skalierung`, Lane-Berechnung, Mittelwert vs. Min begründet, Nur-Anbieter-Modus), § Brücken-Feld-Spec (`BridgeProposal` mit `needed` / `lookingFor` / `candidateScope: "lokal"\|"mailbox"\|"netz"`), § Schwellen-Vertrag (`PROVIDER_MIN_MATCH=0.80` für `overall`, `SCHICHT_MIN_MATCH=0.60` pro Dimension, 2+ Dimensionen unter Schwelle = Apoptose, Stufe-B-Übersteuerung erlaubt), § Stufe-B-Vertrag (Modell + max_tokens + JSON-only-Output + Antwort-Schema + `ExplainResult` + Fehlertoleranz + Rate-Limit-Awareness + User-Key-Handling Plattform-agnostisch + Beispiel-Output mit zwei Personas als Brücke zu Brief 04). **§1 Modul 04 Fehlerverhalten** um sieben neue Zeilen erweitert (DimensionsAllNullError, InvalidApiKeyError, InvalidMatchResultError, LLM-HTTP-/Schema-/Abort-Fälle als fehlertolerante Resolves). **§1 Modul 04 Garantien** um vier neue Punkte erweitert (matchDimensions deterministisch, explainMatchLLM einziger Netz-/async-Pfad, Aufrufer-Drossel-Pflicht, Brücken-Vorschläge bleiben lokal). **§2 Spore-JSON** Optionale Felder um `embeddingCapabilities` (additiver Alias) und `embeddingNeeds` (neuer Sucher-Vektor) erweitert plus Hinweis-Block zur additiven Versionierungs-Disziplin. **§7 LLM-Stufe-B-Ehrlichkeits-Klausel (M04-Erweiterung)** als verbindliche Spec-Klausel neu eingefügt (Stufe B opt-in, Stufe A rückgrat-tragend lokal, kein Knoten zu Drittanbieter gezwungen, Knoten ohne Stufe B = vollwertige Netz-Teilnehmer; namentlich von § 6.3 Plattform-allgemeiner Ehrlichkeits-Klausel unterschieden). **§8 Anti-Missbrauch-Klausel (M04-Erweiterung)** als verbindliche Spec-Klausel neu eingefügt (Brücken-Vorschlag bleibt lokal, `candidateScope:"netz"` formal nicht aktivierbar bis Anker 10-12, Modul 06 filtert Brücken-Vorschlag-Outbox-Einträge). **§7 Änderungsprotokoll auf §9 nachnummeriert** (additiv, keine Inhalte verschoben — Brief 03 fügt § 7 + § 8 vor der Changelog ein). **PROTOCOL_VERSION bleibt `"0.1"`** — beide neuen Spore-Felder (`embeddingCapabilities`, `embeddingNeeds`) sind optional, beide neuen Match-Funktionen (`matchDimensions`, `explainMatchLLM`) sind additiv, alte Sporen ohne `embeddingNeeds` bleiben gültig (signalisieren „nur Anbieter-Modus"). Kein altes Feld zur Pflicht erhoben, kein Hauptversions-Sprung-Anlass. Mit-Pflege: Karte 02 (Schema-Erweiterung + Migrations-Pfad + Generate-Spore-Allow-List-Hinweis für spätere Bau-Sitzung), Karte 04 (matchDimensions + explainMatchLLM + Beispiel-Output mit zwei Personas + Stamm/Gast-Hinweis-Block unverändert), Karte 06 (Outbox-Brücken-Vorschlag-Eintrags-Typ + Anti-Missbrauch-Verweis). KEINE — CLAUDE.md / Karte 09 / `status.json` unangetastet (Brief 01 hat sie auf den Endknoten-Stand gebracht); Sage-Page (`index.html`) unangetastet (Sage-Page-Refactor folgt als Bau-Sitzung in Brief 99-Liste). KEINE — Modul-Code in `src/`, keine Multi-Identität-Spec (`sbkim_keys`-Multi-Slots → Brief 04), keine Königin-Relay-/Identitäts-Container-/Extension-/Mini-Browser-Spec (Vision-Anker eigene Spec-Sitzungen, Matrix verweist nur). Übergabeprotokoll `docs/sessions/archiv/2026-05-19_spec-m04-erweiterung.md`. PR „Spec: M04-Erweiterung — Strang 3 der V1-Sammelspec-Kaskade" (Brief 02-PR #97 als gemerged vorausgesetzt). |
| 2026-05-19 | Spec-Sitzung Multi-Identität (Brief 04) | Brief 04 der V1-Sammelspec-Kaskade — Strang 3 (Multi-Identität in der IndexedDB: `sbkim_keys`-Multi-Slots, `active-identity`-Marker, identitäts-spezifische Stores pro Persona, doppelte Spore pro Persona) als vierte Etappe nach Brief 03 (M04-Erweiterung, PR #98 gemerged 2026-05-19, `main` `27d6a19`). **§1 Modul 02 (Spore) Bietet-Block** um fünf neue / erweiterte API-Funktionen erweitert: `getOrCreateIdentity(key?)` (optionaler Slot-Parameter, Default "main"), `setActiveIdentity(key)` (schreibt `sbkim_meta["active-identity"]`, validiert key), `getActiveIdentityKey()` (liefert aktiven Slot, Default "main"), `listIdentities()` (lexikographisch sortierte Slot-Liste), `removeIdentity(key, options?)` (idempotent löscht Slot inkl. identitäts-spezifischer Stores; `force:false` → `RemoveActiveIdentityError` bei aktiver Identität; `force:true` → setzt active-identity neu); `generateOwnSpore(meta, key?)` und `getOwnSpore(key?)` um optionalen key-Parameter erweitert. **§1 Modul 02 Singleton-Klausel** ersetzt durch Identitäts-Slot-Vertrag (Default-Slot "main" verbindlich, beliebig viele weitere Slots, sbkim_meta["active-identity"] als String-Marker). **§1 Modul 02 Storage** um `sbkim_meta["active-identity"]` erweitert. **§1 Modul 02 Fehlerverhalten** um `UnknownIdentityError` + `RemoveActiveIdentityError` erweitert. **§1 Modul 05 (Anastomose) Storage** auf `sbkim_siblings_<key>` / `sbkim_anastomosis_log_<key>` Pattern umgestellt (Pre-Brief-04-Singleton-Aufrufer treffen unverändert auf `_main`-Slots). Receiver-Pfad: toNodeId-Map nodeId→key beim init() gebaut, getroffene Persona für die eine Operation als aktive Identität verwendet. **§1 Modul 06 (Heterokaryose) Storage** auf `sbkim_hetero_inbox_<key>` / `sbkim_hetero_outbox_<key>` Pattern umgestellt; Identitäts-Cache-Konvention analog Modul 05. **§1 Modul 07 (Apoptose) Storage** auf `sbkim_legacy_inbox_<key>` Pattern umgestellt; Cleanup-Reihenfolge auf zwei Pfade aufgespalten (globale Self-Apoptose über alle Slots iteriert; per-Persona-Cleanup über `removeIdentity(key, {force:true})` als eigener Pfad in Modul 02, der Modul 07 nur für den Vermächtnis-Versand pro Persona ruft — interner Hook `_sendLegacyForIdentity`). `confirmSelfApoptose` wirkt global (alle Personae sterben gemeinsam, Vermächtnis-Versand pro Persona an ihre Geschwister, Cleanup über alle Slots). `forgetExpiredSiblings(maxAgeMs, key?)` und `listLegacy(key?)` um optionalen key-Parameter erweitert. **§2 Spore-JSON** Multi-Identitäts-Hinweis-Block ergänzt: **Strategie A** (Default, gewählt) — `spore.json` trägt nur die aktive Identität, `PROTOCOL_VERSION` bleibt `"0.1"`. **Strategie B** (Liste-Schema mit `identities[]`-Pflicht-Feld, NICHT gewählt) als Option für Folge-Spec-Sitzung benannt — würde `PROTOCOL_VERSION` auf `"0.2"` bumpen, alle bestehenden Empfänger brechen. **§9 Identitäts-Map (Multi-Identität, Brief 04)** als neue verbindliche Spec-Klausel eingefügt: §9.1 Slot-Schema, §9.2 identitäts-spezifische Stores mit Persona-Isolation, §9.3 active-identity-Marker (Modul 02 alleiniger Schreiber), §9.4 Receiver-Pfad mit nodeId→key-Map beim init(), §9.5 Migrations-Strategie (Option A dynamische Store-Erzeugung empfohlen, Option B feste Slot-Tabelle als Alternative), §9.6 Trade-off-Klausel (IndexedDB-Verlust + Backup-Strategie „kompletter Rucksack" + Königin-Relay-Pflicht + Privatheit), §9.7 Verbindung zur M04-Erweiterung (doppelte Spore pro Persona, Match-Pipeline pro Persona). **§9 Änderungsprotokoll auf §10 nachnummeriert** (additiv, keine Inhalte verschoben — Brief 04 fügt § 9 vor der Changelog ein). **PROTOCOL_VERSION bleibt `"0.1"`** — `sbkim_keys[key]` ist lokales Storage-Schema, kein Spore-Feld; `sbkim_meta["active-identity"]` ist ebenfalls lokal; alle neuen API-Funktionen additiv (alter Singleton-Aufruf-Pfad bleibt wortwörtlich gültig, Default-Slot "main" hält Rückwärts-Kompat). Strategie B nicht gewählt → kein Bump-Anlass. **`BACKUP_FORMAT_VERSION` Bump-Vermerk:** die Multi-Identitäts-Backup-Strategie (`exportBackup`/`importBackup` für alle Identitäten als ein Container — Klaus' „kompletter Rucksack") braucht in der Bau-Folge-Sitzung 02.Y einen Bump von 1 auf 2 (separates Wrapper-Schema, kein PROTOCOL_VERSION-Eingriff); Brief 04 verankert die Spec-Entscheidung, der Code-Bump erfolgt in der Bau-Folge-Sitzung. Mit-Pflege: Karte 02 (Multi-Identitäts-API + Sub-Block „Multi-Identität (Brief 04)" + Storage-Slot-Pattern + Migrations-Hinweis), Karte 05 (Sibling-Slot-Pattern transparent über `getActiveIdentityKey()` + Receiver-Map), Karte 06 (Hetero-Inbox-Slot-Pattern + Receiver-Map + Outbox-Slot-Pattern), Karte 07 (per-Persona-Cleanup + globale Self-Apoptose-Cleanup-Reihenfolge mit Schleife + `_sendLegacyForIdentity`-Hook). KEINE — CLAUDE.md (Brief 01 hat sie auf „Hub und Knoten zugleich"), Karte 09 (Brief 01 hat § Schritt 1 erweitert), `status.json` (Brief 01 hat Sage als endknoten[]-Eintrag aufgenommen). KEINE — Modul-Code in `src/`, keine Sage-Page-Änderung (Sage-Page-Refactor folgt als Bau-Sitzung in BRIEF_99-Liste), keine M04-Erweiterung-Änderung (Brief 03 hat sie gesetzt), keine Plattform-Matrix-Änderung (Brief 02), keine Königin-Relay-/Identitäts-Container-/Extension-/Mini-Browser-Spec (eigene Spec-Sitzungen, Brief 04 verweist nur). Übergabeprotokoll `docs/sessions/archiv/2026-05-19_spec-multi-identitaet.md`. PR „Spec: Multi-Identität — Strang 4 der V1-Sammelspec-Kaskade" (Brief 03-PR #98 als gemerged vorausgesetzt). |
| 2026-05-19 | Sammelspec-Abschluss (Brief 99) | Abschluss-Sitzung der V1-Sammelspec-Kaskade — schließt die vier Strang-Etappen Brief 01 (V1 Sage-Hybrid, PR #96 gemerged 2026-05-18 `main` `a3e0072`) + Brief 02 (Plattform-Matrix, PR #97 gemerged 2026-05-18 `main` `69077db`) + Brief 03 (M04-Erweiterung, PR #98 gemerged 2026-05-19 `main` `27d6a19`) + Brief 04 (Multi-Identität, PR #99 gemerged 2026-05-19 `main` `59e3998`) und benennt die Bau-Sitzungs-Brief-Pipeline für die nächste Welle. **Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5):** alle vier Strang-PRs gemerged; INTERFACES § 0 (zwei Spec-Sitzungen-Stränge — drei Brief-03-Konstanten `SCHICHT_MIN_MATCH=0.60` / `STUFE_B_DEFAULT_MODEL="claude-sonnet-4"` / `STUFE_B_MAX_TOKENS=1024`, sonst Stand vor der Kaskade) / § 1 Modul 02 (Brief 03 Spore-Schema-Hinweis + Brief 04 fünf neue / erweiterte API-Funktionen, Slot-Vertrag, `sbkim_meta["active-identity"]`) / § 1 Modul 04 (Brief 03 zwei neue Funktionen + vier Sub-Blöcke + Fehlerverhalten + Garantien) / § 1 Modul 05/06/07 (Brief 04 identitäts-spezifische Store-Pattern, Receiver-Map, Persona-Isolation, globale-vs-per-Persona-Apoptose) / § 2 Spore-JSON (Brief 03 zwei neue Vektor-Felder + Brief 04 Strategie A/B-Hinweis) / § 6 / § 6.1 (Brief 01) / § 6.2 / § 6.3 / § 6.4 (Brief 02) / § 7 LLM-Stufe-B-Ehrlichkeits-Klausel (Brief 03) / § 8 Anti-Missbrauch-Klausel (Brief 03) / § 9 Identitäts-Map (Brief 04, sieben Sub-§) / § 10 Änderungsprotokoll (war § 7 vor Brief 03, dann § 9 nach Brief 03, jetzt § 10 nach Brief 04) alle auf Brief-04-Stand geprüft. **PROTOCOL_VERSION-Status-Snapshot:** bleibt `"0.1"` — alle vier Stränge additiv (Brief 01 reine §6-Erweiterung; Brief 02 reine §6-Sub-Sektionen; Brief 03 neue §0-Konstanten + neue API-Funktionen + neue Spore-Felder optional; Brief 04 neue API-Funktionen mit Default-Slot „main" als Rückwärts-Kompat + lokales Storage-Schema `sbkim_keys[key]` / `sbkim_meta["active-identity"]`, kein Spore-Feld). `BACKUP_FORMAT_VERSION` bleibt `1` — Multi-Identitäts-Backup-Bump 1→2 ist in Brief 04 § 9.6 als Bau-Folge-Sitzung-02.Y-Entscheidung dokumentiert, aber NICHT in der Spec-Kaskade vollzogen. **KEINE neuen §-Inhalte** in dieser Abschluss-Sitzung — diese Zeile dokumentiert nur den Snapshot-Stand und ist explizit kein neuer Strang (Brief 99 ist Abschluss, nicht Spec). **Bau-Sitzungs-Brief-Pipeline für die nächste Welle** (KEINE Spec-Kaskade, jeder Bau eigene Bau-Sitzung mit eigenem PR; Reihenfolge in PULS § Sitzungs-Einträge Brief-99-Eintrag): Bau Sage-Page-Refactor (volle init()-Kette + Andock-Wizard + Schichten-Lampen + Identitäts-Wechsler-UX, ~6-10 h) → Bau 01.Y `ensureStore` in Modul 01 (~2-3 h) → Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump in Modul 02 (~5-8 h) → Bau 04.A Stufe A erweitert in Modul 04 (`matchDimensions` sync, ~2-3 h) → Bau 04.B Stufe B in Modul 04 (`explainMatchLLM` + User-Key-Verwaltung, ~5-8 h) → Bau 05.Y / 06.Y / 07.Y transparenter Slot-Pfad in den Konsumenten (je ~2-3 h) → Bau Multi-Identitäts-Migration der Endknoten (additive Andock-Wizard-Erweiterung, ~2 h). **Was NICHT angefasst:** Modul-Code in `src/` (Abschluss ist Doku-Pflege); Sage-Page `index.html` (Sage-Page-Refactor ist Bau-Sitzung nach Kaskaden-Abschluss); CLAUDE.md (Brief 01 hat sie umgeschrieben); Karte 09 (Brief 01 hat sie erweitert); `status.json` (Brief 01 hat Sage als endknoten[]-Eintrag aufgenommen); `update_puls_pie.py` NICHT aufgerufen (kein Score-Wechsel); `tests/manual_check.html` unangetastet; Brief 01-04 inhaltlich unverändert (Brief 99 fasst nur zusammen). Übergabeprotokoll `docs/sessions/archiv/2026-05-19_abschluss-v1-sammelspec.md`. PR „Sammelspec-Abschluss — Brief 99 der V1-Sammelspec-Kaskade" (Brief 04-PR #99 als gemerged vorausgesetzt). |

| 2026-05-19 | Bau-Sitzung 01.Y `ensureStore` | Erste Bau-Sitzung der Bau-Sitzungs-Brief-Pipeline aus Brief 99 (Klaus' Wahl 2026-05-19: Infrastruktur zuerst). § 1 Modul 01 Bietet-Block um `ensureStore(storeName: string) → Promise<void>` (Option A aus § 9.5) erweitert; Garantien-Block zur Funktion ergänzt (Idempotenz, synchroner Pattern-Check `^sbkim_[a-z0-9_]+$`, kein `UnknownStoreError`, strikt additiv, Aufrufer trägt Identitäts-Konvention). § 1 Modul 01 Storage-Block: `DB-Version` von 3 auf 4 nachgezogen (additive Erweiterung — STORES_V4 leer, weil v=4 KEINEN festen Pflicht-Store anlegt; v=4 markiert den Übergang zu „dynamische Stores via ensureStore"); STORES_V1/V2/V3 bleiben unverändert als initialer Migrations-Pfad. Selbstcheck-Funktionsliste auf acht Funktionen erweitert. Fehlerverhalten-Tabelle um zwei Zeilen erweitert: `InvalidStoreNameError` (synchron bei Pattern-Verstoß) und `EnsureStoreError` (async bei fehlgeschlagener Versions-Bump-Choreografie; cause-Property trägt IDBOpenDBRequest-Error-Reason). Geprüft-Zeile um 2026-05-19 erweitert. § 9.5 Migrations-Strategie um Stand-Hinweis auf die Bau-Folge-Sitzung 01.Y ergänzt (KEIN inhaltlicher Spec-Eingriff in § 9 — Spec ist gesetzt, Bau zieht nur Code nach). **PROTOCOL_VERSION bleibt `"0.1"`** (lokales Storage-Schema, kein Spore-Feld); **BACKUP_FORMAT_VERSION bleibt `1`** (Bump 1→2 erst in Bau 02.Y); **DB_VERSION von 3 auf 4** (additive Schema-Erweiterung). KEINE Modul-02/05/06/07-Änderung (transparenter Slot-Pfad kommt in 02.Y / 05.Y / 06.Y / 07.Y nach), keine identitäts-spezifischen Stores angelegt (Aufrufer-Pflicht). Karte 01 nachgezogen (§ Schnittstelle / § Stores / § Konfigurationswerte / § Fehlerverhalten / § Risiken / § Manueller Test / § Bauzustand); drei neue Panel-01-Knöpfe in `tests/manual_check.html` (happy-path / Idempotenz / Pattern-Verstoß). |
| 2026-05-19 | Bau-Sitzung 02.Y Multi-Identitäts-API + Backup-Schema-Bump | Zweite Bau-Sitzung der Bau-Sitzungs-Brief-Pipeline aus Brief 99 (Klaus' Wahl 2026-05-19: logische Reihenfolge, Infrastruktur weiter). Direkte Folge auf Bau 01.Y (PR #102 gemerged 2026-05-19, `main` `8a07ed5` — `SbkimStorage.ensureStore` produktiv verfügbar). **§ 0 BACKUP_FORMAT_VERSION 1 → 2** mit Kommentar zur Multi-Identitäts-Backup-Schema-Erweiterung (additiver Pflicht-Feld `payload.identities[]`; alte Backups version === 1 bleiben importierbar). **§ 1 Modul 02 Geprüft-Zeile** um 2026-05-19 (Bau 02.Y) erweitert; KEIN Eingriff in Bietet/Storage/Fehler-Block — der Vertrag steht aus Brief 04. **§ 9.6 Pkt. 2** Stand-Hinweis am Ende der Trade-off-Klausel (analog § 9.5-Stand-Hinweis aus Bau 01.Y): „Bau-Folge-Sitzung 02.Y vom 2026-05-19 hat den Backup-Schema-Bump 1→2 sowie die fünf neuen / erweiterten API-Funktionen gebaut; siehe § 1 Modul 02 Bietet-Block." **Code in `src/modules/02_spore.js` additiv** (kein Refactoring der bestehenden 10 + `resetIdentityCache` Funktionen): `BACKUP_FORMAT_VERSION` modul-lokal 1 → 2; neue Konstante `BACKUP_FORMAT_VERSION_READ_OK = [1, 2]`; `BACKUP_PAYLOAD_SCHEMA_VERSION` 1 → 2; zwei neue Fehler-Factories `UnknownIdentityError` (sync, von `setActiveIdentity`) und `RemoveActiveIdentityError` (sync, von `removeIdentity` ohne force); In-Memory `identityCache` auf Map `key → IdentitySnapshot` erweitert; In-Memory `activeIdentityKeyCache` als Lese-Cache für `sbkim_meta["active-identity"]`; neuer Closure-Helper `ensureIdentityStores(key)` (Promise.all über fünf identitäts-spezifische Stores via `SbkimStorage.ensureStore("sbkim_<base>_<key>")`); `getOrCreateIdentity(key)` erweitert (Default "main"; ruft `ensureIdentityStores(key)` für neue Slots; Rollback `del(sbkim_keys, key)` bei `EnsureStoreError`); neue Funktion `setActiveIdentity(key)` (validiert key in sbkim_keys, schreibt sbkim_meta["active-identity"], invalidiert identityCache); neue Funktion `getActiveIdentityKey()` (Default "main"); neue Funktion `listIdentities()` (Array.prototype.sort lexikographisch); neue Funktion `removeIdentity(key, options?)` (idempotent, fail-soft clear pro identitäts-spezifischem Store via try/catch um `UnknownStoreError`, Vermächtnis-Versand fail-soft via `SbkimApoptose._sendLegacyForIdentity`-Hook); `generateOwnSpore(meta, key?)` und `getOwnSpore(key?)` um optionalen key-Parameter erweitert; `exportBackup(password)` iteriert `listIdentities()` und baut `payload.identities[]`-Array pro Slot (Wrapper schreibt `version: 2`, `payload-schema-version: 2`; alte Top-Level-Felder `nodeId`/`keys`/`spore`/`siblings` bleiben mit aktivem Slot befüllt — konservative Down-Grade-Kompat); `importBackup(blob, password, options?)` akzeptiert `version: 1` ODER `version: 2`; v=1 wird in eine Eintrags-Liste migriert; v=2 erzwingt `payload.identities[]` Pflicht-Vor-Check (`BackupSchemaError` bei leerer Liste); pro Identität `BackupOverwriteError`-Check (Sammel-Error mit Slot-Keys), `ensureIdentityStores(entry.key)`, Slot-spezifische `put`-Schritte; active-identity-Marker nach Import gesetzt (optionales Top-Level-Feld oder "main"-Default). Selbstcheck-Zeile auf 14 Funktionen erweitert (`init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/setActiveIdentity/getActiveIdentityKey/listIdentities/removeIdentity/resetIdentityCache/exportBackup/importBackup`). `_meta` um `backupFormatVersion: 2` (nachgezogen) und `identityStoreBases` (Liste der fünf Store-Basen) erweitert. **Karte 02** § Schnittstelle (vierzehn Funktionen, Erweiterungs-Hinweise), § Storage (neuer Sub-Block „Identitäts-Slot-Vertrag (Brief 04 / Bau 02.Y)"), § Datenformat „Backup-Format" (Wrapper-Schema-Bump version 1 → 2 + neues `payload.identities[]`-Pflicht-Feld + Migrations-Hinweis), § Konfigurationswerte (`BACKUP_FORMAT_VERSION` auf 2 + `BACKUP_PAYLOAD_SCHEMA_VERSION` auf 2), § Fehlerverhalten (zwei neue Zeilen `UnknownIdentityError` / `RemoveActiveIdentityError`; `BackupSchemaError`-Zeile um „leere identities[]-Liste nach Decrypt" erweitert), § Risiken (zwei neue Punkte: Mid-Operation-Identitäts-Wechsel nicht spezifiziert + Backup-Schema-Migration v1 → v2 asymmetrisch), § Manueller Test (drei neue Knöpfe 8/9/10), § Bauzustand-Zeile. **Panel 02** in `tests/manual_check.html` um drei Knöpfe erweitert: Knopf 8 „Identität anlegen + wechseln", Knopf 9 „Identität entfernen (force)", Knopf 10 „Backup mit Multi-Identität". **Headless-Smoke-Test mit `fake-indexeddb`** (Node 22) deckt Modul-Lade / Selbstcheck / Multi-Identitäts-Pfad / removeIdentity-force-Fallback / Backup-Export v=2 / Backup-Import in leerer PWA mit Multi-Identität / alter v=1-Backup-Import. **PROTOCOL_VERSION bleibt `"0.1"`**; **DB_VERSION bleibt `4`** (Bau 01.Y hat das gesetzt — neue Stores entstehen dynamisch via `ensureStore`); **BACKUP_FORMAT_VERSION von 1 auf 2**. **KEINE Modul-05/06/07-Änderung** (transparenter Slot-Pfad kommt in 05.Y / 06.Y / 07.Y); KEIN `_sendLegacyForIdentity`-Implementierung in Modul 07 (Bau 02.Y ruft fail-soft via typeof-check + console.warn); KEIN Modul-01-Eingriff; KEINE Sage-Page-Änderung; KEINE CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 02 bleibt `score:"fertig"` — Multi-Identitäts-API ist additive Erweiterung, kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). **Sichttest ungeprüft** (headless gebaut — wartet auf Klaus' Browser-Lauf der drei neuen Panel-02-Knöpfe). Übergabeprotokoll `docs/sessions/archiv/2026-05-19_bau-02y-multi-identitaet.md`. |
| 2026-05-19 | Pflege Tafel-Evolutions-Klausel + Modul-01-init-Folge-Pipeline | Meta-Pflege nach Klaus' Bau-02.Y-Sichttest (DeX-Chrome, 2026-05-19). **CLAUDE.md § Heilige Tafeln** um neue Sub-Sektion „Tafel-Evolutions-Klausel (Pflege 2026-05-19)" erweitert: Tafeln sind verbindlich aber nicht ewig; bei Konflikt zwischen alter Tafel und neuer notwendiger Arbeit ist Klaus EXPLIZIT auf Anpassungs-Bedarf hinzuweisen (nicht stoisch befolgen, nicht stillschweigend umgehen). Bezeichnungs-Konvention „Diese-Sitzung-nicht"-Tafeln vs. absolute Verbote eingeführt; Bezugs-Beispiel Klaus' Sichttest-Befund Modul-01-init nicht versions-fail-soft. **INTERFACES.md § 9.5** um Folge-Befund 2026-05-19 erweitert: Modul 01 `init()` ist nicht versions-fail-soft (hartkodiertes `indexedDB.open(name, DB_VERSION)`; nach `ensureStore`-Bumps aus früheren Sitzungen scheitert jeder neue init mit `VersionError`). Lösungs-Skizze: erst ohne Version-Param öffnen (existing Version lesen), Pflicht-Stores sync prüfen, nur bei fehlenden mit `existing.version + 1` bumpen. Vermerkt als nächste Folge-Pflege Modul 01 in der Bau-Pipeline. Tafel-Evolutions-Notiz im Sinne der neuen CLAUDE.md-Klausel: die Brief-02.Y-Tafel „KEIN Modul-01-Eingriff" war scope-disziplin, erlaubt eigene Pflege-Sitzung mit eigenem Brief und eigenem PR. **PULS § Vision-Anker 6 § Status** um Querverweis auf Folge-Pflege Modul 01 erweitert. **PROTOCOL_VERSION bleibt `"0.1"`**, **DB_VERSION bleibt `4`**, **BACKUP_FORMAT_VERSION bleibt `2`** — reine Meta-Pflege, kein Code-Eingriff. **`status.json` unverändert** (kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). **KEINE Modul-Code-Änderung** in `src/` — die eigentliche Modul-01-Pflege ist eigene Folge-Sitzung. |
| 2026-05-19 | Pflege Modul 01 `init()` versions-fail-soft | Folge-Pflege auf Klaus' Bau-02.Y-Sichttest (PR #104 gemerged 2026-05-19, `main` `63e8fd1`) und die Meta-Pflege Tafel-Evolutions-Klausel (PR #105 gemerged 2026-05-19, `main` `60ea3f6`). Brief BAU_PFLEGE_01_INIT_FAIL_SOFT (PR #106 gemerged 2026-05-19, `main` `42a04e0`) als Spec-Vorlage. **§ 1 Modul 01 Bietet-Block** um neuen Sub-Block „init-Garantien (Pflege „init() versions-fail-soft", 2026-05-19)" erweitert: DB_VERSION als Mindest-Schema-Version (nicht Ziel-Version); Initial-Pfad (existing < DB_VERSION) unverändert; Fail-soft-Pfad (existing >= DB_VERSION) via Probe-Open ohne Version + Pflicht-Store-Check + Re-Open mit existing Version; bei fehlendem Pflicht-Store `StorageOpenError` mit Liste; Multi-Tab-Race-Risiko als bekannte Limitierung notiert. **§ 1 Modul 01 Geprüft-Zeile** um 2026-05-19 (Pflege `init()` versions-fail-soft) erweitert. KEIN Eingriff in Bietet/Storage/Fehlerverhalten-Block jenseits der Garantien-Erweiterung. **§ 9.5** um Stand-Hinweis am Ende ergänzt: Pflege durchgeführt, Code-Pfad mit `openProbe`/`checkRequiredStores`/`openExact` eingebaut. **Code in `src/modules/01_storage.js` additiv** (kein Refactoring der bestehenden 8 Funktionen): neuer Closure-Helper `openProbe(name)` (öffnet ohne Version-Parameter, fail-soft bei nicht-existierender DB); `checkRequiredStores(db)` (sync-Check auf STORES_V1/V2/V3/V4 in objectStoreNames); `openExact(name, version)` (Re-Open ohne onupgradeneeded); `init(options)` umgebaut mit Phase-1-Probe + Phase-2-Entscheidung (existing >= DB_VERSION → übernehmen; existing < DB_VERSION → regulärer Bau-01.Y-Pfad mit onupgradeneeded). `_meta.dbVersionPolicy = "fail-soft-min-schema"` als neuer Read-Anker für Tests. **Karte 01** § Versionsmigration (neuer Sub-Block „Versions-Fail-Soft-Pfad"), § Schnittstelle (init-Doku-Block um Garantie), § Risiken (zwei neue Punkte: manuell zerstörte DB / Multi-Tab-Race), § Manueller Test (neuer Knopf 9), § Bauzustand-Zeile nachgezogen. **Panel 01** in `tests/manual_check.html` um Knopf 9 „init() versions-fail-soft probe" erweitert (ensureStore-Bump + Tab-Reload + erneuter init muss grün sein). **Headless-Smoke-Test** `tests/smoke_pflege_01_init_fail_soft.mjs` mit fake-indexeddb (Node 22): drei Proben (frische DB / existing v=10 mit allen Pflicht-Stores / existing v=10 mit fehlendem Pflicht-Store → StorageOpenError). **PROTOCOL_VERSION bleibt `"0.1"`, DB_VERSION bleibt `4` (Bedeutung-Wandel: Mindest-Schema statt Ziel), BACKUP_FORMAT_VERSION bleibt `2`**. KEINE Modul-02/05/06/07-Änderung, KEIN ensureStore-Verhalten-Bruch (Bau 01.Y unverändert), kein neuer Pflicht-Store, keine Sage-Page-Änderung, keine CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (kein Score-Wechsel; `update_puls_pie.py` NICHT aufgerufen). Sichttest erwartet — ungeprüft, weil headless. Tafel-Evolutions-konform: die Brief-02.Y-Tafel „KEIN Modul-01-Eingriff" war scope-disziplin, diese Pflege ist die explizite Folge-Sitzung. Übergabeprotokoll `docs/sessions/archiv/2026-05-19_pflege-01-init-fail-soft.md`. |
| 2026-05-19 | Bau-Sitzung 04.A `matchDimensions` synchron in Modul 04 | Erste Bau-Sitzung der M04-Erweiterung aus Brief 03 (PR #98 gemerged 2026-05-19, `main` `27d6a19`). Brief BAU_04A_MATCH_DIMENSIONS (PR #109 gemerged 2026-05-19, `main` `ae98842`) als Spec-Vorlage. **§ 1 Modul 04 Geprüft-Zeile** um „2026-05-19 (Bau 04.A `matchDimensions` sync)" erweitert. KEIN Vertrags-Eingriff in Bietet/Storage/Fehler/Garantien — der Vertrag steht aus Brief 03. **Code in `src/modules/04_match.js` additiv** (kein Refactoring der bestehenden `match` / `isAboveProviderThreshold`): neue Konstante `SCHICHT_MIN_MATCH = 0.60` (modul-lokal gespiegelt aus § 0); neue Fehler-Factory `DimensionsAllNullError` (sync, von `matchDimensions` bei allen vier null); Closure-Helper `cosineSafe(a, b)` (intern, null-safe wrapper um `match`); neue Funktion `matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds)` sync — Stufe-A-Heuristik gemäß Karte 04 § Drei-Schichten-Modell (alle drei Schichten ergeben in Stufe A denselben Lane-Cosinus; echte Differenzierung kommt in Stufe B via `explainMatchLLM`). Berechnung: Lane 1 (queryCap × passageNeeds) + Lane 2 (queryNeeds × passageCap); `availableLanes = 0|1|2` (Anzahl berechenbarer Lanes); `Schicht-Score = Mittelwert der berechenbaren Lanes` (Single-Lane → Single-Lane-Wert; keine Lane → null); `overall = Mittelwert der nicht-null Schichten` (gewichtet = einfacher Mittelwert über die drei identischen Schicht-Werte in Stufe A); `bruecke: null` (Bau 04.B füllt das via `explainMatchLLM`); `DimensionsAllNullError` sync bei allen vier null; Nur-Anbieter-Modus (eine Seite vollständig null) → alle Schichten null, `availableLanes:0`, kein Throw. **Selbstcheck-Zeile auf drei Funktionen erweitert** (`match/isAboveProviderThreshold/matchDimensions`; `explainMatchLLM` kommt mit Bau 04.B). `_meta` um `schichtMinMatch` + `matchDimensionsLanes` (Read-Anker `["fachlich","prozess","skalierung"]`) erweitert. **Karte 04** § Manueller Test um drei neue Knöpfe (Knopf 6 bidirektional, Knopf 7 Nur-Anbieter-Modus, Knopf 8 `DimensionsAllNullError`); § Bauzustand neue Zeile. **Panel 04** in `tests/manual_check.html` um drei Knöpfe erweitert (alle drei mit deterministischen Float32Array-Vektoren statt SbkimEmbedding — kein Modell-Lade-Overhead beim Test). **Smoke-Test** `tests/smoke_bau04a_match_dimensions.mjs` als reine Funktions-Probe in Node 22 (kein fake-indexeddb nötig — `matchDimensions` zustandslos): drei Proben (bidirektional / Nur-Anbieter / alle vier null). **PROTOCOL_VERSION bleibt `"0.1"`, DB_VERSION bleibt `4`, BACKUP_FORMAT_VERSION bleibt `2`**. KEIN Modul-01/02/03/05/06/07/08-Eingriff, KEIN `explainMatchLLM` (Bau 04.B kommt mit eigenem Brief + eigener Sitzung), KEIN `BridgeProposal`-Code, KEINE Sage-Page-Änderung, KEINE CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 04 bleibt `score:"fertig"`; `update_puls_pie.py` NICHT aufgerufen). Sichttest erwartet — ungeprüft, weil headless gebaut. Übergabeprotokoll `docs/sessions/archiv/2026-05-19_bau-04a-match-dimensions.md`. |
