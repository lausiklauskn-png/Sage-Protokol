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
MEMBRANE_FREMDZUGRIFF_BUFFER_MAX = 50   // Modul 15, Spec-Sitzung 15 (Sub (e) 2026-05-24); maximale
                                        //   Anzahl `FremdzugriffEntry`-Einträge im Membran-Ringbuffer
                                        //   (RAM-only, Closure-State in `15_membran.js`). FIFO-
                                        //   Verdrängung bei vollem Buffer, kein Throw. Default 50 —
                                        //   ausgewogen zwischen „Live-Schau über mehrere Minuten"
                                        //   und „RAM-Aufblähung". Klaus' Spur ist eine lebende Schau,
                                        //   kein Audit-Archiv (siehe Karte 15 § Sub (e) Strikte Tabus).
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

  init-Garantien (Pflege „Versions-Bump-Race in openProbe", 2026-05-22):
    - Race-frei bei Versions-Bumps innerhalb derselben Tab-Session.
      Konkret: `openProbe`-Probe-Verbindung, `init`-Initial-/Fail-Soft-
      Pfad und `ensureStore`-Versions-Bump-Pfad warten async auf die
      vollständige Schließung der Vorgänger-Verbindung im IDB-Worker-
      Thread, bevor der nachfolgende `indexedDB.open(name, newVersion)`
      startet. Wait-Strategie: `db.onclose` ODER 50-ms-Timeout-Fallback
      (Chrome feuert `onclose` nicht zuverlässig auf Android — der
      Timeout ist die Sicherheits-Klausel).
    - `openProbe`-Probe-Verbindung trägt jetzt den fail-soft-
      `onversionchange`-Handler (vorher nur `init`-Initial- und
      `ensureStore`-Verbindungen). Eine spätere `ensureStore`-Bump
      kann die Probe-Verbindung im IDB-Worker-Thread sicher schließen,
      auch wenn der JS-`close()`-Aufruf längst zurückgekehrt ist.
    - Anwendungsfall: `tests/manual_check.html` bei wiederholtem
      Modul-Wechsel (mehrere `init()`-Ketten pro Tab-Session). Endknoten-
      PWAs sind nicht betroffen — sie haben nur EINE `init()`-Kette pro
      Tab-Lebenszeit (Karte 09 § Schritt 9). Sichtbar wurde der Race
      bei Klaus' Sichttest-Folge am 2026-05-21 (DeX-Chrome auf Galaxy
      Tab S6) als `ensureStore('sbkim_meta') Versions-Bump blockiert`
      nach Panel-01-Notfall-Reset (PR #131) + Hard-Reload + Panel-06-
      Setup. Tafel-Evolutions-konform: additive Race-Auflösung, KEIN
      Bietet-/Storage-/Fehler-Block-Eingriff, KEIN `ensureStore`-
      Verhalten-Bruch von außen, KEIN `DB_VERSION`-Bump.

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

Geprüft: 2026-05-14 (Spec-Sitzung 01+03), 2026-05-16 (Pflege PWA-Suffix Karten 01+09), 2026-05-16 (Pflege Storage-Persist Stufe 1), 2026-05-19 (Bau 01.Y `ensureStore`), 2026-05-19 (Pflege `init()` versions-fail-soft), 2026-05-22 (Pflege Versions-Bump-Race in openProbe)

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
  feuert (Vorbestellung Modul 17 Floating-Widget, Bau-Sitzung 17 oder
         eigene Mini-Pflege; Spec-Sitzung 17 vom 2026-05-25):
    sbkim:alive  — Custom-Event auf window, einmalig nach init() +
                   getOrCreateIdentity(). Detail-Form:
                     { since:  <ISO-8601 string>,
                       nodeId: <base64url-sha256, eigene Identität, Klartext> }
                   PII-Disziplin: KEINE domain, KEINE Geschwister-Daten,
                   KEINE API-Keys. Konsumiert von Modul 17 (LEBT-Slot)
                   und ggf. künftigen Sage-Page-Statistik-Karten.
  reagiert: (keine — Modul 02 ist Quelle, kein Konsument.)

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
  queryLocal(text: string, k?: number,
             options?: { corpus?: Array<{label,passageVec,anchorId?}> })
                                                          → Promise<Array<{
                                                                label:    string,
                                                                score:    number,
                                                                anchorId: string | null
                                                              }>>
                                                                       // async; Bau 04.C (Sub (c), 2026-05-26).
                                                                       // Lokales Such-Feld-Backend. Embedding
                                                                       // via Modul 03 `embedQuery`, Top-k-Cut
                                                                       // nach Filter (>= PROVIDER_MIN_MATCH)
                                                                       // + Sort descending. Default k=5.
                                                                       // Korpus zwei Pfade: options.corpus
                                                                       // (Vorrang) ODER registrierter
                                                                       // Provider via setLocalCorpus.
                                                                       // Fünf Sync-Throws (EmptyQueryError /
                                                                       // QueryTooLongError / InvalidKError /
                                                                       // EmbeddingNotAvailableError /
                                                                       // InvalidCorpusError); leerer Korpus
                                                                       // und alle-unter-Schwelle resolved
                                                                       // mit [] (kein Throw). Cross-Knoten-
                                                                       // Search-Hook auf Modul 15 Sub (b)
                                                                       // ohne Code-Update (typeof-Check).
  setLocalCorpus(corpusOrProvider: Array | Function | null)  → void
                                                                       // sync; Bau 04.C. Registriert
                                                                       // Korpus-Quelle für queryLocal.
                                                                       // Array → defensive Array-Kopie via
                                                                       // Array.from. Function → lazy lookup
                                                                       // zur queryLocal-Zeit. null → Provider
                                                                       // entfernt. Idempotent (mehrfach
                                                                       // rufbar). Wirft InvalidCorpusError
                                                                       // sync bei anderem Argument-Typ.
  hybridMatch(query: string | { text: string, label?: string },
              candidates: Array<{ label: string, text: string,
                                  cosine?: number, anchorId?: string }>,
              options?: { apiKey?: string, provider?: "claude"|"mistral"|"openai"|"local",
                          euOnly?: boolean, model?: string, maxTokens?: number,
                          endpoint?: string, abortSignal?: AbortSignal })
                                                          → Promise<HybridJudgment>
                                                                       // async; Bau 04.D (2026-06-20).
                                                                       // Match-Zeit-LLM-RICHTER über die
                                                                       // Vorfilter-Kandidaten (passt /
                                                                       // passt-nicht + Begründung + Score
                                                                       // pro Kandidat). Vorfilter (match /
                                                                       // queryLocal) bleibt lokal + server-
                                                                       // los und liefert die Kandidaten;
                                                                       // hybridMatch ändert deren Default
                                                                       // NICHT. Anbieter-abstrahiert (Claude /
                                                                       // Mistral / OpenAI / lokal); EU-Default
                                                                       // „mistral" für DSGVO-Knoten
                                                                       // (options.euOnly); BYOK (Key pro Call,
                                                                       // nie im Code). FAIL-SOFT: leerer
                                                                       // apiKey (kein opt-in) ODER LLM nicht
                                                                       // erreichbar/HTTP-/Schema-Fehler →
                                                                       // KEIN Throw, available:false +
                                                                       // fallbackCandidates (Vorfilter gilt).
                                                                       // Erfolg liefert signierbares
                                                                       // attestation-Objekt (Bezeugung —
                                                                       // Aufrufer signiert via Modul 02 +
                                                                       // legt es in die Inbox; Modul 04
                                                                       // signiert NICHT selbst). Zwei sync
                                                                       // Throws (InvalidCandidatesError /
                                                                       // InvalidProviderError = Aufrufer-
                                                                       // Konfig). Siehe § 7 LLM-Stufe-B-/
                                                                       // Hybrid-Richter-Ehrlichkeits-Klausel.
  pickJudgeProvider(options?: { provider?: string, euOnly?: boolean }) → string
                                                                       // sync; Bau 04.D. Default-Anbieter-
                                                                       // Wahl: options.provider hat Vorrang
                                                                       // (wirft InvalidProviderError bei
                                                                       // Unbekanntem); sonst euOnly=true →
                                                                       // "mistral", sonst "claude".
  bidirectionalVerdict(passtA: boolean, passtB: boolean,
                       rule?: "both" | "one")             → boolean
                                                                       // sync; Bau 04.D. Kombiniert die zwei
                                                                       // Seiten-Urteile (jede Seite urteilt
                                                                       // mit eigener KI). Default "both"
                                                                       // (streng — beide nötig, Klaus
                                                                       // 2026-06-20); "one" = großzügig.
  PROVIDER_MIN_MATCH                                       : number    // 0.80, aus §0 hierher gespiegelt
  SCHICHT_MIN_MATCH                                        : number    // 0.60, aus §0 hierher gespiegelt (M04-Erweiterung)

  KEIN mode-Parameter für `match`. Skalarprodukt ist symmetrisch; die
  Parameter-Namen sind reine Lese-Hilfe für den Aufrufer. Reine Funktion,
  kein Promise, kein async.
  `matchDimensions` ist ebenfalls sync (drei Cosinus-Aufrufe + Gewichtung),
  kein Promise. `explainMatchLLM` ist der einzige async-Pfad, der Netz
  berührt. `queryLocal` ist async (wegen Modul 03 lazy), aber rein
  lokal — KEIN Netz-Aufruf, KEINE Korpus-Persistierung. `setLocalCorpus`
  ist sync. `hybridMatch` ist async und berührt Netz — aber NUR den
  bewusst vom Knoten konfigurierten Richter-Call (opt-in, BYOK;
  Empfangsmodus gewahrt — kein Default-Aufruf ins offene Netz).
  `pickJudgeProvider` und `bidirectionalVerdict` sind sync + rein lokal.

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
    console.info("MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold/matchDimensions/explainMatchLLM/queryLocal/hybridMatch, Schwellen: PROVIDER_MIN_MATCH=0.80, SCHICHT_MIN_MATCH=0.60");
  Wie Modul 01 — Modul 04 hat keinen asynchronen Lade-Schritt.
  (Format-Stand seit Bau 04.D 2026-06-20 — sechs Funktionen, zwei Schwellen.)

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
  - queryLocal: text leer / kein String        → EmptyQueryError (sync throw vor Embedding).
  - queryLocal: text länger als LLM_MAX_OUTPUT_CHARS (4096 Zeichen)
                                              → QueryTooLongError (sync throw, defensiv-Schutz
                                                gegen Pathological-Inputs).
  - queryLocal: k kein Integer >= 1            → InvalidKError (sync throw).
  - queryLocal: SbkimEmbedding / embedQuery fehlt
                                              → EmbeddingNotAvailableError (sync throw,
                                                vor Korpus-Check).
  - queryLocal: corpus kein Array oder Item-Schema falsch
    (label kein String, passageVec kein Float32Array(384))
                                              → InvalidCorpusError (sync throw).
  - queryLocal: leerer Korpus / alle Treffer < PROVIDER_MIN_MATCH
                                              → KEIN Throw. Resolved mit leerer Liste `[]`.
                                                Aufrufer (typisch Modul 15 Sub b)
                                                interpretiert das als „keine Cross-Knoten-Treffer".
  - queryLocal: embedQuery Promise rejected (Modell-Lade-Fehler)
                                              → EmbeddingFailedError (async rethrow mit
                                                ursprünglicher Cause).
  - queryLocal: embedQuery liefert unerwartete Form (kein Float32Array(384))
                                              → EmbeddingFailedError (async).
  - setLocalCorpus: Argument kein Array / Function / null
                                              → InvalidCorpusError (sync throw).
  - hybridMatch: query kein String/{text} bzw. query.text leer
                                              → EmptyQueryError (sync throw). query.text > 4096 Zeichen
                                                → QueryTooLongError (sync throw).
  - hybridMatch: candidates kein Array / leer / > HYBRID_MAX_CANDIDATES (20)
    / Item ohne label oder text             → InvalidCandidatesError (sync throw, Aufrufer-Konfig).
  - hybridMatch: options.provider unbekannt   → InvalidProviderError (sync throw, Aufrufer-Konfig).
  - hybridMatch: leerer/fehlender apiKey (kein opt-in)
                                              → KEIN Throw. Resolved mit HybridJudgment{ available:false,
                                                reason:"Richter nicht opt-in …", fallbackCandidates }.
                                                Das IST der fail-soft-„kein opt-in"-Pfad (Vorfilter gilt).
  - hybridMatch: provider:"local" ohne options.endpoint
                                              → KEIN Throw. available:false (Endpoint fehlt) — Vorfilter gilt.
  - hybridMatch: LLM HTTP-Fehler (4xx/5xx, 429 sondergetaggt), Netz-Fehler,
    kein valides JSON, falsche Anbieter-Form, Richter-Schema-Mismatch
                                              → KEIN Throw. Resolved mit HybridJudgment{ available:false,
                                                reason:"<deutsch>", verdicts:null, fallbackCandidates }.
                                                Aufrufer fällt auf die Vorfilter-Kandidaten zurück.
  - hybridMatch: abortSignal triggert          → AbortError (durchgereicht, Aufrufer fängt selbst).
  - bidirectionalVerdict: passtA/passtB kein Boolean
                                              → InvalidCandidatesError (sync throw).

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
  - queryLocal() ist async, aber rein lokal — KEIN Netz-Aufruf,
    KEINE Korpus-Persistierung in Modul 04 (Endknoten-Pflicht). Modul 04
    nimmt fertige `passageVec`-Vektoren entgegen, analog `match()`
    § Macht nicht. Cross-Knoten-Search-Hook auf Modul 15 Sub (b) ohne
    Code-Update — Modul 15 prüft `typeof window.SbkimMatch.queryLocal
    === "function"` fail-soft, der Empfänger-Pfad greift automatisch
    sobald Modul 04.C geladen ist.
  - setLocalCorpus() ist idempotent (mehrfach rufbar). Array-Variante
    macht eine defensive Array-Kopie via `Array.from` (Items selbst
    bleiben Referenzen — Float32Array zu kopieren wäre teuer und
    semantisch unnötig). Function-Variante: lazy-lookup zur queryLocal-
    Zeit. null entfernt den Provider.
  - hybridMatch() ändert den Vorfilter-Default NICHT — match() /
    queryLocal() bleiben die lokale, server-lose Kandidaten-Quelle
    (kein Whitening-Flip, kein Schwellen-Eingriff in dieser Schicht;
    das ist der separate Anisotropie-Hebel, koordinierte Klaus-
    Entscheidung). hybridMatch baut NEBEN den bestehenden Pfaden.
  - hybridMatch() ist opt-in (BYOK) und fail-soft: ohne apiKey oder bei
    LLM-/Netz-/Schema-Fehler resolved es mit available:false +
    fallbackCandidates statt zu werfen. Ein Knoten ohne Richter bleibt
    vollwertiger Mycel-Teilnehmer (siehe § 7).
  - hybridMatch() signiert NICHT selbst. Das Erfolgs-`attestation`-Objekt
    (Bezeugung — kind/judgedAt/provider/region/model + verdicts) ist
    serialisierbar; der Aufrufer signiert es via Modul 02 und legt es in
    die Inbox. Modul 04 hat keinen Identitäts-Zugriff (analog Stufe B).
  - hybridMatch() macht KEINEN Default-Netz-Aufruf — nur der bewusst vom
    Knoten konfigurierte Richter-Call geht raus (Empfangsmodus). Anbieter-
    Abstraktion (Claude/Mistral/OpenAI/lokal) hartcodiert keinen Key;
    EU-Default „mistral" für DSGVO-Knoten (options.euOnly).

Geprüft: 2026-05-14 (Spec+Bau-Sitzung 04), 2026-05-19 (Spec-Sitzung M04-Erweiterung — Brief 03 der V1-Sammelspec-Kaskade — drei Schichten, Brücken-Feld, Stufe-A/Stufe-B-Pipeline additiv), 2026-05-19 (Bau 04.A `matchDimensions` sync), 2026-05-20 (Bau 04.B `explainMatchLLM` produktiv — Stufe-B-LLM-Pass gegen Anthropic-API, JSON-only-Output, strikte Schema-Validierung, fail-soft; zwei sync Throws InvalidApiKeyError + InvalidMatchResultError; candidateScope:"netz" still auf "lokal" korrigiert), 2026-05-26 (Bau 04.C `queryLocal` produktiv — lokales Such-Feld-Backend, async via Modul 03 lazy, Default k=5, hartcodierte Schwelle 0.80, Korpus zwei Pfade options.corpus + setLocalCorpus-Provider, fünf neue Sync-Throws, leerer Korpus + unter-Schwelle → leere Liste ohne Throw, Cross-Knoten-Hook auf Modul 15 Sub (b) ohne Code-Update; Headless-Smoke 43/43 grün; Sichttest ungeprüft), 2026-06-20 (Bau 04.D `hybridMatch` produktiv — Match-Zeit-LLM-Richter über die Vorfilter-Kandidaten, additiv. Provider-Abstraktion Claude/Mistral/OpenAI/lokal mit EU-Default „mistral" für DSGVO-Knoten, BYOK; opt-in/fail-soft — leerer apiKey oder LLM-/Netz-/Schema-Fehler → available:false + fallbackCandidates ohne Throw; signierbares attestation-Objekt als Bezeugung; zwei sync Throws InvalidCandidatesError + InvalidProviderError; bidirectionalVerdict-Helfer Default „both" streng. Vorfilter-Default UNVERÄNDERT — kein Whitening-Flip/Schwellen-Eingriff. Headless-Smoke 62/62 grün; Sichttest ungeprüft. Siehe § 7 + Karte 04 § Hybrid-Match-Schicht.)

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
  handshake(targetSpore: SporeJson, ownDomainVector?: Float32Array(384),
            options?: { transport?: "auto"|"http"|"channel" })
                                                               → Promise<HandshakeResult>
    // Pflege 2026-05-28: ownDomainVector ist OPTIONAL. Wird er weggelassen
    // (undefined/null), löst Modul 05 ihn kanonisch aus der eigenen Spore
    // auf (ownSpore.domainVector → Float32Array(384)) — dieselbe Quelle,
    // die als senderSpore mitgesendet wird (single source of truth). Wer
    // explizit einen Vektor übergibt, wird weiter honoriert (muss
    // Float32Array(384) sein). Fehlt die eigene Spore ganz →
    // AnastomoseDependenciesError „Eigene Spore noch nicht erzeugt …
    // generateOwnSpore(meta) zuerst". Hintergrund: Aufrufer (Modul 18 etc.)
    // sollen den Vektor nicht selbst ableiten müssen — ein frisch
    // berechneter Vektor wich vom signierten Spore-domainVector ab.
  receiveHandshake(incomingRequest: HandshakeRequest)          → Promise<HandshakeResponse>
  listSiblings()                                               → Promise<Array<{ nodeId, domain, since, pubKey }>>
  forgetSibling(nodeId: string)                                → Promise<void>

  `options.timeoutMs` (Pflege 2026-05-28): optionaler Override für den
    Channel-Reply- bzw. HTTP-Abort-Timeout. Default QUERY_TIMEOUT_MS (4000)
    für automatisierte Pfade. Interaktive Aufrufer (Modul-18-Andock-Wizard)
    reichen einen großzügigeren Wert (z.B. 300000 = 5 min), damit ein in
    Mobile-Chrome kurz aufgeweckter Geschwister-Tab antworten kann
    (Observatorium-Lehre 3 § Tab-Suspendierung). Ungültige Werte (≤0,
    NaN, kein number) → Fallback auf QUERY_TIMEOUT_MS.

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
  feuert (Vorbestellung Modul 17 Floating-Widget, Bau-Sitzung 17 oder
         eigene Mini-Pflege; Spec-Sitzung 17 vom 2026-05-25):
    sbkim:handshake — Custom-Event auf window, pro abgeschlossenem
                      Handshake (Sender + Empfänger beide). Detail-Form:
                        { outcome:     "established" | "rejected" |
                                       "re-handshake" | "rejected-local",
                          peerNodeId:  <base64url-sha256> | null,
                          direction:   "incoming" | "outgoing" }
                      PII-Disziplin: KEINE Spore-Inhalte, KEIN score-
                      Feld (Empfehlungs-Pfad bleibt bei Modul 14
                      Diffusion). peerNodeId ist Klartext (Andocker
                      sieht ihn ohnehin in sbkim_siblings). Konsumiert
                      von Modul 17 (VERKEHR-Slot + Mini-Log).
  reagiert: (keine — Modul 05 ist Quelle, kein Konsument der Custom-
             Events. Modul 09 / 08 rufen handshake() bzw. der Service-
             Worker ruft receiveHandshake() direkt auf.)

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

Geprüft: 2026-05-14 (Spec-Sitzung 05), 2026-05-17 (Spec-Sitzung BroadcastChannel-Bridge — additiver Fallback-Transport, Schema unverändert), 2026-05-19 (Spec-Sitzung Multi-Identität — Brief 04 der V1-Sammelspec-Kaskade, sbkim_siblings_<key>-Pattern + Receiver-Map), 2026-05-20 (Bau 05.Y transparenter Slot-Pfad — Receiver-Map nodeId→key live, sbkim_siblings_<key> + sbkim_anastomosis_log_<key>)

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

Geprüft: 2026-05-15 (Spec-Sitzung 06), 2026-05-15 (Bau-Sitzung 06 — Code-Stub belegt; Anker-Quelle in der Erst-Bau-Iteration ausschließlich Spore-Single-Anker-Fallback / Degraded-Modus), 2026-05-19 (Spec-Sitzung Multi-Identität — Brief 04 der V1-Sammelspec-Kaskade, sbkim_hetero_inbox_<key>-Pattern + Receiver-Map), 2026-05-20 (Bau 06.Y transparenter Slot-Pfad — Receiver-Map nodeId→key live, sbkim_hetero_inbox_<key> + Lesen aus sbkim_hetero_outbox_<key> + sbkim_siblings_<key>)

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

Geprüft: 2026-05-14 (Spec-Sitzung 07), 2026-05-19 (Spec-Sitzung Multi-Identität — Brief 04 der V1-Sammelspec-Kaskade, identitäts-spezifische Stores + Per-Persona-Cleanup + _sendLegacyForIdentity-Hook), 2026-05-20 (Bau 07.Y transparenter Slot-Pfad + _sendLegacyForIdentity-Hook produktiv — Receiver-Map nodeId→key live, sbkim_legacy_inbox_<key> + per-Slot-Cleanup in globaler Self-Apoptose, listLegacy(key?) und forgetExpiredSiblings(maxAgeMs, key?) optional per-Persona)

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

Geprüft: 2026-05-15 (Spec-Sitzung 08), 2026-05-20 (Bau 08.Y slot-spezifische Outbox)

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
Status: stabil   (Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe voll
                 spezifiziert in Spec-Sitzung 15 vom 2026-05-24; Sub (a)
                 Read-API + Sub (b) postMessage-Brücke voll spezifiziert
                 in Spec-Sitzung 15.B vom 2026-05-25, vollständig
                 implementiert in Bau-Sitzung 15.B vom 2026-05-25
                 (PR #159, gemerged) und **vom Klaus-Sichttest 8/8 grün
                 bestätigt 2026-05-25** (DeX-Chrome auf Galaxy Tab S6,
                 Panel 15 Setup + Knöpfe 10–17 grün + Sage-Page Bonus-
                 Check vier Plaketten sichtbar). Headless-Smoke
                 `tests/smoke_bau15b_membran.mjs` 31/31 grün.
                 Mini-Pflege Knopf-11-Anti-PII-Filter (eigene nodeId
                 vom String-Match ausnehmen) im selben PR #159
                 mitgenehmigt. Sub (c) Capability-Token Stufe 3,
                 später; Sub (d) Backup-Datei nur Verweis auf Modul
                 02 Bau 02.X.)
Datei:  docs/components/15_membran.md (Karte) ·
        src/modules/15_membran.js (existiert noch nicht — Bau-Sitzung 15
        nach Spec-Sitzung 15 vom 2026-05-24 fällig) ·
        Erweiterung in src/sbkim-sw.js für endpoint-probe-Detektor
        (Sub (e) SW-Hook; eigene SW-Bau-Sitzung oder Teil von Bau 15)

Bietet (öffentlich):
  // --- Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe (Stufe 1, voll-Spec) ---
  init(options?)                              → Promise<void>
  fremdzugriff.list()                         → FremdzugriffEntry[]    // sync, defensive Kopie, älteste zuerst
  fremdzugriff.subscribe(cb)                  → unsubscribeFn          // sync, cb(entry) bei jedem Neueintrag
  fremdzugriff.clear()                        → void                    // Buffer leeren + Lampe aus
  fremdzugriff._recordForTest(entry)          → void                    // Test-Brücke (Unterstrich-Konvention)

  // --- Sub (a) Read-API für KI-Browser-Agenten (Stufe 1, voll-Spec 2026-05-25) ---
  read()                                      → Promise<MembraneSnapshot>
    // MembraneSnapshot-Form (finale Spec, Karte 15 § Sub (a) verbindlich):
    // {
    //   // Identitäts-Block (aus Modul 02 SbkimSpore)
    //   protocolVersion: "0.1",                     // §0 PROTOCOL_VERSION
    //   nodeId:          <eigene-base64url-sha256>, // KLARTEXT (eigene Identität)
    //   domain:          <string>,                  // Spore-Domain
    //   sporeUrl:        <string>,                  // /sbkim/spore.json-Pfad
    //   domainKeywords:  <string[]>,                // Spore-Feld, public
    //   stammCategories: <string[]>,                // Spore-Feld, public
    //   guestCategories: <string[]>,                // Spore-Feld, public
    //
    //   // Geschwister-Block ANONYMISIERT (aus Modul 05 SbkimAnastomose)
    //   siblings: [{ nodeIdHash, since, status }],  // KEIN score, KEIN lastSeen
    //
    //   // Storage-Block (aus Modul 01 SbkimStorage._meta + navigator.storage)
    //   storage:  { quotaWarningLevel, storagePersisted },
    //
    //   // Siegel-Block (aus Modul 16 SbkimSiegel, Vorbestellung INTERFACES §1 M16)
    //   siegel:   null | { isCertified, repoUrl, certifiedModules:[…vollständig] }
    // }
    // Streng lesend, kein Seiteneffekt AUSSER Sub-(e)-Buffer-Eintrag
    // (kind:"membrane-read", details:{ fieldsRequested:null, snapshotByteLen }).
    // Quota blockt read() NICHT (Empfangsmodus-Prinzip — read() ist
    // Beobachtungs-Schicht, kein Storage-Schreiber).

  // --- Sub (b) App-zu-App-Brücke via postMessage (Stufe 2, voll-Spec 2026-05-25) ---
  // Sender (Andocker-Pflicht, NICHT Modul-15-Surface):
  //   peerWindow.postMessage({
  //     type:       "sbkim/membrane/v1",
  //     op:         "sporeRef" | "query" | "hint" | "queryResult",   // KEIN "handshake"
  //     fromOrigin: <string>,
  //     nonce:      <crypto.randomUUID()>,          // Pflicht pro Anfrage
  //     inReplyTo:  <nonce-der-Anfrage> | undefined, // nur bei op:"queryResult"
  //     payload:    <op-spezifisch, siehe Tabelle>
  //   }, peerOrigin /* aus Allowlist via init({allowedOrigins}) */)
  //
  // Empfänger: window.addEventListener("message", …) prüft
  //   (1) event.origin === window.location.origin → still verworfen
  //       (same-origin gilt nicht als Fremd-Origin)
  //   (2) event.origin nicht in allowedOrigins → Sub-(e)-Eintrag
  //       decision:"rejected-allowlist", KEINE Antwort
  //   (3) data.type !== "sbkim/membrane/v1" → Sub-(e)-Eintrag
  //       decision:"ignored"
  //   (4) optionaler SbkimRateLimit?.checkOrigin(origin)-Hook
  //       (fail-soft wenn Modul 11 fehlt; "throttled" → ignored
  //       + details.throttled:true)
  //   (5) op-Schema-Validierung → bedient oder ignored
  //
  // op-Tabelle (verbindlich):
  //   sporeRef    payload={nodeId, sporeUrl, domain}
  //               → fire-and-forget; RAM-Cache recentSporeRefs[origin]
  //                 (max. 16 Origins FIFO). KEIN IndexedDB-Schreiber.
  //                 decision:"accepted" wenn verarbeitet, "ignored" bei
  //                 Schema-Fehler.
  //   query       payload={text:string, k:number(Default 5)}
  //               → Antwort via op:"queryResult" mit inReplyTo:<nonce>.
  //                 Delegiert an SbkimMatch.queryLocal(text, k) wenn
  //                 vorhanden (Modul 04.C, noch nicht implementiert);
  //                 fehlt das → Antwort {results:[], error:"module-04c-
  //                 not-available"} + decision:"ignored".
  //   hint        payload={vector:number[384], label:string, ttlMs:number}
  //               → fire-and-forget; delegiert an SbkimDiffusion?.recordLead
  //                 ({vector, label, ttlMs, sourceOrigin:event.origin}) wenn
  //                 Modul 14 vorhanden, sonst console.info +
  //                 decision:"ignored". KEIN Auto-Handshake zur Lead-Origin.
  //   queryResult payload={results:Array<{label,score,sporeUrl}>,
  //                        error:string|null}
  //               → Empfänger matched inReplyTo gegen pendingQueries[nonce]
  //                 (RAM-Map TTL 30 s); resolves den Aufrufer-Promise.
  //                 Bei kein-Match: decision:"ignored" (Replay/verspätet).
  //
  // Nonce-Pflicht: crypto.randomUUID() pro Anfrage, 30 s Replay-Dedupe
  //   (RAM-Map seenNonces[nonce] = receivedAt mit FIFO-Eviction).
  //
  // Sub (e) triggert Eintrag bei JEDER message-Quelle ungleich
  //   window.location.origin (auch decision:"rejected-allowlist").
  //
  // KEIN op:"handshake" — Anastomose bleibt bei Modul 05 (HTTP / same-origin
  //   BroadcastChannel-Fallback). Sub (b) ist Brücke für Browser-interne
  //   App-zu-App-Konversation, nicht Replacement für Modul 05.

  // --- Sub (c) Capability-Handshake / Membran-Token (Stufe 3, später) ---
  // MembraneCapability-Form aus Karte 15 § Sub (c); Spec-Sitzung 15.C
  //   füllt die finale Form.

  // --- Sub (d) Backup-Datei (nur Verweis) ---
  // Existiert in Modul 02 (Bau 02.X): SbkimSpore.exportBackup/importBackup
  //   (PBKDF2-SHA256 600 000 + AES-GCM-256). Karte 15 verweist nur.

  options-Form (init):
    {
      // Sub (e) Steuerung — alles optional, Defaults aus §0/Modul-lokal:
      bufferMax?:    number,            // Default MEMBRANE_FREMDZUGRIFF_BUFFER_MAX = 50
      lampSelector?: string,            // Default '#lamp-fremd' (CSS-Selektor in der Page)
      mountModal?:   boolean,           // Default true — Modal in document.body anlegen + Click-Handler
      // Sub (b) Allowlist (Stufe-2-Pflicht, in Stufe 1 noch optional):
      allowedOrigins?: string[],        // strict-String-Liste, exakter Origin-Match,
                                        // kein Wildcard, kein "*self*"-Sonderwert;
                                        // Default [] (Sub (b) ohne Allowlist verwirft alle Cross-Origin-Messages
                                        // als rejected-allowlist und triggert Sub-(e)-Eintrag).
                                        // Validierung fail-soft: Modul 15 filtert nicht-String-Einträge
                                        // oder Einträge ohne http(s)://-Präfix aus + console.warn pro
                                        // entferntem Eintrag (KEIN sync Throw, damit Andocker-Init weiterläuft).
      // Sage-Page-Sichttest-Knopf (Pflege 2026-05-24):
      enableTestButton?: boolean        // Default false. Wenn true, ergänzt das Fremdzugriff-Modal
                                        // einen sichtbaren „🧪 Demo-Eintrag"-Knopf neben „Aufräumen",
                                        // der via _recordForTest einen synthetischen endpoint-probe-Eintrag
                                        // einschiebt. Ausschließlich Sichttest-Werkzeug; Endknoten setzen
                                        // die Flag NICHT (echter Live-Test kommt dort über fremde Origin).
    }

  FremdzugriffEntry-Form (Karte 15 § Sub (e) Schema, verbindlich):
    {
      at:        <ISO-8601 UTC mit ms>,
      kind:      "membrane-read" | "membrane-postmessage" | "endpoint-probe",
      origin:    <string | null>,                // Cross-Origin-Quelle oder null
      agentHint: <string | null>,                // navigator.userAgent.slice(0, 64) oder null
      endpoint:  <string | null>,                // relativer Pfad ab '/' oder null
      decision:  "accepted" | "ignored" | "rejected-allowlist",
      details:   <kind-spezifisch>               // Karte 15 § Sub (e) Feld-Konventionen
    }

Nutzt:
  Browser-API: window.addEventListener("message", …)   Sub (b) Empfänger-Pfad (in init() registriert)
  Browser-API: BroadcastChannel("sbkim-membrane")      Sub (e) SW-→Page-Brücke für endpoint-probes
                                                        (SW-Seite postet { type:"SBKIM_MEMBRANE_PROBE",
                                                         entry: FremdzugriffEntry })
  Browser-API: navigator.userAgent                     Sub (e) agentHint-Feld, abgeschnitten auf 64 Zeichen
  DOM: document.querySelector(lampSelector)            Sub (e) Lampen-Element für CSS-Klassen-Toggle
                                                        (.fremd-alert / .fremd-pulse)
  DOM: document.body                                   Sub (e) Modal-Mount-Anker
  SbkimSpore.getNodeId / getOwnSpore                   Sub (a) read()-Pfad (Pflicht ab Sub-(a)-Bau)
                                                        — fail-soft (nodeId:null im Snapshot)
  SbkimAnastomose.listSiblings                         Sub (a) read()-Pfad — fail-soft (siblings:[])
  SbkimStorage._meta.storagePersisted                  Sub (a) read()-Pfad (Spiegelung Modul-01-Getter)
                                                        — fail-soft (storagePersisted:null)
  Browser-API: navigator.storage.estimate()            Sub (a) read()-Pfad für quotaWarningLevel
                                                        — fail-soft (storage:{quotaWarningLevel:"none"})

  Sub (e) hat KEINE Pflicht-Modul-Abhängigkeiten — Buffer + Lampe + Modal
  laufen ohne anderes SBKIM-Modul (das macht Sub (e) auch in der Sage-
  Page sofort baubar, ohne dass Modul 02/05/Storage initialisiert sein
  müssten).

Storage:
  KEINE Stores. Sub (e) ist RAM-only (Modul-lokales Closure `let buffer = []`).
  Sub (a)+(b) lesen ggf. via Modul 01 (Sub (a) sbkim_spore / sbkim_siblings —
  Lese-Recht, KEIN Schreiben in Stufe 1).
  Sub (b) Stufe 2 entscheidet ggf. neuen Store sbkim_membrane_inbox für
  hint-Leads (Spec-Sitzung 15.B).

  BroadcastChannel('sbkim-membrane') hat seit Bau-Sitzung 15.SW vom
  2026-05-24 ZWEI aktive Schreiber:
    - Page-Schicht (`src/modules/15_membran.js` subscribeBroadcastChannel-
      Closure): LESEND. Hört auf `SBKIM_MEMBRANE_PROBE`-Messages und legt
      den darin transportierten FremdzugriffEntry (kind:"endpoint-probe")
      in den Ringbuffer.
    - SW-Schicht (`src/sbkim-sw.js` postProbeViaBroadcastChannel): SCHREIBEND.
      Postet bei jedem als Fremd erkannten Fetch auf einen SBKIM-Endpunkt
      ein `{type:"SBKIM_MEMBRANE_PROBE", entry:FremdzugriffEntry}`-Paket.
      Pro Probe neue Channel-Instanz (open → post → close), KEIN long-lived
      Channel im SW (Lebenszyklus-Komplikation vermieden — eigene Folge-
      Pflege falls Probe-Volumen je zum Bottleneck wird).
  Message-Schema (SBKIM_MEMBRANE_PROBE) bleibt UNVERÄNDERT seit Spec-
  Sitzung 15 vom 2026-05-24 / Bau-Sitzung 15 (Page-Empfänger ist
  schema-bestimmend). Bau-Sitzung 15.SW hat KEINE Schema-Änderung
  vorgenommen — nur den Sender im SW ergänzt.

Events:
  reagiert: window "message"-Event                     Sub (b)-Empfänger + Sub-(e)-Hook
  reagiert: BroadcastChannel("sbkim-membrane") "message"
                                                       Sub-(e)-Hook für SW-gemeldete endpoint-probes
  reagiert: click auf lampSelector-Element             Sub-(e)-Modal öffnen
  reagiert: Esc-Keydown / Backdrop-Klick               Sub-(e)-Modal schließen
  feuert (Vorbestellung Modul 17 Floating-Widget, Bau-Sitzung 17 oder
         eigene Mini-Pflege; Spec-Sitzung 17 vom 2026-05-25):
    sbkim:postmessage — Custom-Event auf window, pro eingehender message
                        mit type:"sbkim/membrane/v1" (gespiegelt aus
                        Sub (b)-Empfänger-Pfad NACH Allowlist + Schema +
                        Replay-Dedupe). Detail-Form:
                          { op:        "sporeRef" | "query" | "hint" | "queryResult",
                            direction: "incoming",
                            decision:  "accepted" | "ignored" | "rejected-allowlist" }
                        PII-Disziplin: KEIN payload, KEIN origin im
                        Custom-Event (origin steht im Sub-(e)-Buffer);
                        nur op + direction + decision.
    sbkim:fremd-alert — Custom-Event auf window, pro Ringbuffer-Neueintrag
                        in Sub (e) (Spiegelung des subscribe(cb)-Hooks).
                        Detail-Form:
                          { kind:       "membrane-read" | "membrane-postmessage" |
                                       "endpoint-probe",
                            decision:   "accepted" | "ignored" | "rejected-allowlist",
                            bufferSize: <number> (aktuelle Buffer-Länge nach Eintrag) }
                        PII-Disziplin: KEIN origin, KEIN agentHint, KEIN
                        endpoint im Custom-Event (alle drei stehen im
                        Sub-(e)-Buffer und kommen via fremdzugriff.list() /
                        subscribe(cb) raus; das Custom-Event ist nur
                        Status-Trigger für den FREMD-Slot des Widgets).
  Konsumiert von Modul 17 (VERKEHR-Slot pro sbkim:postmessage, FREMD-Slot
  pro sbkim:fremd-alert).

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 15 MEMBRAN bereit, Funktionen: init/read/fremdzugriff.{list,subscribe,clear,_recordForTest}");
  Wie Modul 00/01/02/04/05/06/07/08 — keine Konstante in der Selbstcheck-
  Zeile. MEMBRANE_FREMDZUGRIFF_BUFFER_MAX steht verbindlich in §0;
  AGENT_HINT_MAX_LEN = 64 ist modul-lokal in Karte 15.

Versionierungs- und Sichtbarkeits-Vertrag:
  - Modul 15 ist nicht protokoll-aktiv (kein Netz, keine Signatur, keine
    Spore-Erzeugung in Stufe 1; Sub (c) Stufe 3 nutzt später Modul-02-
    Signatur). Es gibt keinen Hauptversions-Check in 15 — die §0-
    Konstante MEMBRANE_FREMDZUGRIFF_BUFFER_MAX wird beim Skript-Laden
    bzw. init() gelesen.
  - FremdzugriffEntry-Schema ist additiv versioniert: das details-Feld
    ist offen für kind-spezifische Erweiterungen (spätere Sub-(b)-
    Stufe-2-Spec darf op-spezifische Felder ergänzen, ohne den Ringbuffer
    zu brechen). Pflichtfelder bleiben stabil.
  - Sub (e) Ringbuffer-Inhalt ist SESSION-ONLY (RAM-only, Tab-Reload =
    leer). Wer Persistenz will, baut Modul 12 (Blocklist) mit Append-Log.

Fehlerverhalten:
  - init(): options.lampSelector kein gültiger CSS-Selektor    → console.warn, kein Throw;
                                                                  Lampen-Toggle wird übersprungen, Buffer + Modal funktionieren
  - init(): lampSelector matcht aktuell kein Element            → console.warn, kein Throw;
                                                                  Re-Mount beim DOMContentLoaded
  - init(): zweimaliger Aufruf                                  → idempotent (kein Doppel-Listener,
                                                                  kein Doppel-Modal-Mount)
  - fremdzugriff.list(): unter allen Bedingungen                → leeres oder gefülltes Array, KEIN Throw
  - fremdzugriff.subscribe(cb): cb nicht Funktion               → console.warn, no-op unsubscribeFn
  - fremdzugriff.subscribe(cb): cb wirft beim Aufruf             → Throw GEFANGEN (console.warn),
                                                                  andere Listener werden weiter aufgerufen
  - fremdzugriff.clear(): unter allen Bedingungen               → no-op bei leerem Buffer, KEIN Throw
  - fremdzugriff._recordForTest(entry): entry kein Objekt /
       fehlende Pflichtfelder / unbekannter kind/decision-Wert  → console.warn, KEIN Throw, KEIN Eintrag
                                                                  (fail-soft analog Doku-recordSighttest-Pattern)
  - read() (Sub (a)): jede Sub-Lese-Quelle wirft                → fail-soft (Feld auf null/[]),
                                                                  read() resolved IMMER mit Snapshot.
                                                                  Sub-(e)-Eintrag wird trotzdem geschrieben
                                                                  (kind:"membrane-read", decision:"accepted").
  - read() (Sub (a)): Modul 16 SbkimSiegel fehlt/nicht ready    → siegel-Feld auf null (Doku-Hinweis im
                                                                  Snapshot-Schema, damit Agent zwischen
                                                                  "Modul 16 nicht da" und "nicht zertifiziert"
                                                                  unterscheiden kann)
  - read() (Sub (a)): Quota-Warnung                              → KEIN Block, snapshot.storage.quotaWarningLevel
                                                                  wird gesetzt, read() resolved normal
  - Eingehende postMessage (Sub (b)): unbekannter type           → kein read, kein Sub-(b)-Antwort-Pfad;
                                                                  Sub-(e)-Eintrag (decision:"ignored")
  - Eingehende postMessage: Origin nicht in allowedOrigins       → kein Bedienen;
                                                                  Sub-(e)-Eintrag (decision:"rejected-allowlist")
  - Eingehende postMessage: Schema-Fehler im Payload             → kein Bedienen, KEINE Antwort;
                                                                  Sub-(e)-Eintrag (decision:"ignored");
                                                                  KEIN Throw, console.warn frequenzgedrosselt
  - Eingehende postMessage: Replay (nonce schon gesehen <30 s)  → still verworfen, KEINE Antwort,
                                                                  KEIN doppelter Sub-(e)-Eintrag
  - Eingehende op:"hint" (Sub (b)): Modul 14 fehlt              → console.info, KEINE Antwort;
                                                                  Sub-(e)-Eintrag (decision:"ignored")
  - Eingehende op:"query" (Sub (b)): Modul 04.C fehlt           → Antwort op:"queryResult" mit
                                                                  {results:[], error:"module-04c-not-available",
                                                                   inReplyTo:<nonce>};
                                                                  Sub-(e)-Eintrag (decision:"ignored")
  - Eingehende op:"queryResult" (Sub (b)): kein passendes      → still verworfen (kein Pending-Promise);
       pendingQueries[inReplyTo]                                  Sub-(e)-Eintrag (decision:"ignored")
  - init({allowedOrigins}): Element kein String / kein         → fail-soft, Eintrag aus Allowlist
       gültiger Origin-String                                     herausgefiltert + console.warn;
                                                                  KEIN sync Throw — Andocker-Init läuft weiter
  - SbkimRateLimit?.checkOrigin liefert "throttled" (Sub (b))   → Sub-(e)-Eintrag (decision:"ignored",
                                                                  details.throttled:true);
                                                                  KEINE Antwort
  - BroadcastChannel-Message: kein "SBKIM_MEMBRANE_PROBE"-Type   → still verworfen, kein Eintrag

  KEINE benannten Error-Klassen für Sub (e) — rein beobachtend, alles
  fail-soft mit console.warn. Sub (a) finale Spec entscheidet, ob
  Quota-Block einen MembraneQuotaError wirft (vermutlich NICHT — fail-
  soft an die Agenten zurückreichen, der Agent ist nicht Klaus und kann
  keinen Backup-Restore triggern); Sub (b) finale Spec entscheidet, ob
  Allowlist-Verletzungen Throws werfen sollen (vermutlich NICHT —
  stille Verwerfung + Sub-(e)-Eintrag reicht).

Datenformate:
  FremdzugriffEntry              → Karte 15 § Sub (e) Schema (oben gespiegelt).
  MembraneSnapshot (Sub (a))     → Karte 15 § Sub (a) Snapshot-Schema (final
                                    Spec-Sitzung 15.B 2026-05-25), oben in
                                    Bietet-Block gespiegelt. Pflicht-Felder:
                                    protocolVersion, nodeId, domain, sporeUrl,
                                    domainKeywords, stammCategories,
                                    guestCategories, siblings, storage, siegel.
                                    Alle Sub-Lese-Quellen fail-soft (Feld auf
                                    null/[] bei Modul-Miss); read() resolved
                                    IMMER mit Snapshot. siegel-Feld ist null
                                    wenn Modul 16 fehlt, sonst
                                    {isCertified, repoUrl, certifiedModules}.
  postMessage-Envelope (Sub (b)) → Karte 15 § Sub (b) Envelope-Schema (final
                                    Spec-Sitzung 15.B 2026-05-25):
                                    {type:"sbkim/membrane/v1", op, fromOrigin,
                                     nonce:crypto.randomUUID(), inReplyTo?,
                                     payload}. op ∈ {sporeRef, query, hint,
                                     queryResult}; KEIN handshake.
  Sub-(b)-Payload-Schemata       → siehe op-Tabelle in Bietet-Block oben:
                                    sporeRef.payload={nodeId,sporeUrl,domain};
                                    query.payload={text,k};
                                    hint.payload={vector,label,ttlMs};
                                    queryResult.payload={results,error}.

Garantien für Modul 00 / 09 / 12 / 14 / Sage-Page:
  - Sub (e) Lampe + Modal sind ANZEIGE-only. Sub (e) blockiert nicht,
    filtert nicht, signiert nicht. Filter-Verhalten gehört in Modul 12
    (Blocklist), Rate-Limit in Modul 11.
  - Lampe pulst bei JEDER decision (accepted/ignored/rejected-allowlist) —
    auch bei Abweisungen, weil Klaus Phishing-Versuche sehen soll
    (Karte 15 § Risiken „Allowlist-Drift").
  - Sub (a) read()-Snapshot enthält NIEMALS sbkim_keys, NIEMALS nodeId
    der Geschwister im Klartext (nur nodeIdHash, base64url-sha256 OHNE
    Per-Session-Salt), NIEMALS PII von Drittseiten, NIEMALS
    navigator.userAgent, NIEMALS Klaus' API-Key (Modul 04.B). Die EIGENE
    nodeId wird im Klartext geliefert — der Agent sieht sie ohnehin in
    IndexedDB. Tabus aus Karte 15 § Sub (a) Strikte Tabus sind
    bindend (Spec-Sitzung 15.B 2026-05-25 finalisiert).
  - Sub (a) Snapshot enthält ein Siegel-Hook-Feld
    `siegel: { isCertified, repoUrl, certifiedModules } | null` —
    Vorbestellung aus INTERFACES § 1 Modul 16 § Hook-Punkte. Drei
    Pflicht-Fälle: null wenn Modul 16 fehlt; voll mit isCertified:true
    wenn ready+grün; voll mit isCertified:false wenn ready+rot
    (transparent für Agent, Badge bleibt anti-greenwashing nicht im DOM).
    certifiedModules-Eintrag voll (`{id,name,surfaceFn,lazy,status}`),
    nicht reduziert.
  - Sub (a) Quota blockt read() NICHT — Empfangsmodus-Prinzip. Quota-
    Warnung wird im Snapshot-Feld storage.quotaWarningLevel sichtbar,
    der Agent entscheidet selbst über Folge-Schritte (z.B. Modul 02
    Sub (d) Backup-Restore vorschlagen).
  - Sub (b) Allowlist ist STATISCH im Andocker via init({allowedOrigins})
    konfiguriert, nicht über die Membran selbst änderbar. Format strict
    String, exakter Origin-Match, KEIN Wildcard, KEIN "*self*"-Sonderwert.
    Validierungs-Strenge: fail-soft (console.warn pro entferntem Eintrag,
    KEIN sync Throw — Andocker-Init bleibt funktional).
  - Sub (b) Op-Tabelle (final 2026-05-25): vier Werte sporeRef / query /
    hint / queryResult mit expliziten Payload-Schemata. KEIN
    op:"handshake" — Anastomose geht durch Modul 05.
  - Sub (b) Nonce-Pflicht: crypto.randomUUID() pro Anfrage, 30 s Replay-
    Dedupe via RAM-Map. Jede Antwort referenziert inReplyTo:<nonce>.
  - Sub (b) Rate-Limit-Hook für Modul 11: optionaler
    SbkimRateLimit?.checkOrigin(origin)-Aufruf vor Bedienung, fail-soft
    wenn Modul 11 fehlt. Drosselungs-Marker details.throttled:true macht
    Modul-11-Verwerfungen im Fremdzugriff-Modal sichtbar.
  - Sub (b) sporeRef-Cache (recentSporeRefs[origin], max. 16 FIFO) und
    Sub (b) Nonce-Dedupe (seenNonces[nonce] TTL 30 s) und Sub (b)
    pendingQueries (TTL 30 s) sind alle RAM-only — KEIN neuer Store
    (sbkim_membrane_log verworfen).
  - Sub (e) Ringbuffer ist RAM-only — Tab-Reload leert ihn. Modul 12
    (Blocklist) darf später einen eigenen Append-Log bauen, aber NICHT
    den Sub-(e)-Buffer mitnutzen (Trennung Anzeige/Audit).
  - Sage-Page (index.html) erhält in Bau-Sitzung 15:
      :root { --lamp-alert: #DC2626; }
      .lamp.fremd-alert { … }     // Dauer-Rot mit Glow
      .lamp.fremd-pulse { … }     // kurzer Puls analog .traffic-pulse
      <span class="lamp" id="lamp-fremd" title="…"></span>
      <span class="lamp-label">fremd</span>
    direkt nach #lamp-traffic + Label „verkehr". Click-Handler auf
    #lamp-fremd öffnet das Sub-(e)-Modal.
  - Modul 09 (Einbau-PWA) bekommt in eigener Folge-Pflege einen
    zehnten optionalen Schritt: „Membran-Allowlist setzen + Lampe in
    PWA-Header anhängen falls Fremdzugriff-Sichtbarkeit gewünscht".

Tabus (verbindlich, gelten auch für künftige Sub-Stufen):
  - NIEMALS sbkim_keys lesen (auch nicht gehasht). Privater Schlüssel
    verlässt die Zelle nie unverschlüsselt — Sub (d) Backup-Sluse ist
    die einzige Ausnahme und nur mit PBKDF2+AES-GCM.
  - NIEMALS nodeId der GESCHWISTER im Klartext liefern. Sub (a) gibt
    nur nodeIdHash = base64url(sha256(nodeId)) heraus, OHNE Per-Session-
    Salt (Spec-Sitzung 15.B 2026-05-25 verworfen — kosmetischer
    Schutz). Die EIGENE nodeId wird im Klartext geliefert (Agent sieht
    sie ohnehin in IndexedDB).
  - NIEMALS score/lastSeen der Geschwister in Sub (a) exponieren —
    Empfehlungs-Pfad bleibt bei Modul 14 Diffusion, nicht durch Membran
    sichtbar.
  - NIEMALS navigator.userAgent im Sub-(a)-Snapshot. Sub-(e)-Buffer
    nutzt agentHint (slice(0, 64)) — getrennte Schicht.
  - NIEMALS Klaus' API-Key (Modul 04.B) in Sub (a). Lebt ausschließlich
    in sbkim_keys / Modul 02.
  - NIEMALS schreiben in Sub (a). read() ist async-pur (außer dem
    Sub-(e)-Buffer-Eintrag — der ist Beobachtungs-Schicht, kein
    Protokoll-Seiteneffekt).
  - KEIN op:"handshake" in Sub (b). Wer Anastomose will, geht durch
    Modul 05 (HTTP oder BroadcastChannel-Fallback).
  - Origin-Allowlist ist STATISCH im Andocker konfiguriert (via
    init({allowedOrigins})), nicht über die Membran selbst änderbar.
    Format strict String, exakter Origin-Match — KEIN Wildcard, KEIN
    Pattern, KEIN "*self*"-Sonderwert.
  - Validierungs-Strenge der Allowlist: fail-soft (console.warn pro
    entferntem Eintrag), KEIN sync Throw — Andocker-Init darf bei
    Tippfehler in der Origins-Liste nicht brechen.
  - Nonce-Pflicht in Sub (b) (crypto.randomUUID() pro Anfrage, 30 s
    Replay-Dedupe) und Sub (c) — kein Replay-Schutz, keine Brücke.
  - KEIN Auto-Handshake bei sporeRef/hint. Der Andocker muss explizit
    SbkimAnastomose.handshake() rufen — Empfangsmodus-Prinzip.
  - KEIN op:"hint" mit Schreib-Recht ohne Modul 14. Wenn Modul 14 fehlt,
    wird der hint stillschweigend ignoriert; Modul 15 legt KEINEN Stub-
    Store sbkim_diffusion_leads an (Modul 15 ist Empfänger der
    Botschaft, nicht Store-Owner).
  - KEIN Persistent-Log für Sub (b) (sbkim_membrane_log o.ä. verworfen).
    Persistenz bleibt RAM-only. Wer Audit will, baut Modul 12.
  - Empfangsmodus-Prinzip bleibt: Membran initiiert nichts, sie
    antwortet nur. Kein Crawler, keine Pulsation, keine Eigenanfragen.
  - Sub (e) PII-Schutz: agentHint NUR navigator.userAgent.slice(0, 64),
    KEINE weiteren navigator.*-Felder; details niemals voller
    postMessage-payload (nur op + nonce + optional throttled:true);
    origin nur als Schema+Host+Port.

Hook-Punkte:
  Modul 10 (Reputation) auf Capability-Token-Aussteller (Sub (c)) — nur Verweis.
  Modul 11 (Rate-Limit) auf eingehende postMessage-Calls pro Origin
    (Sub (b)) — VORBESTELLT in Spec-Sitzung 15.B 2026-05-25:
    Sub (b) ruft optional window.SbkimRateLimit?.checkOrigin(origin) →
    "ok" | "throttled" vor jeder Bedienung; fail-soft wenn Modul 11
    fehlt; "throttled" → decision:"ignored" + details.throttled:true.
    Modul 11 bringt seinen ZERTIFIKAT_ASPEKTE-Eintrag in Modul 16 mit
    (Pflicht-Konvention CLAUDE.md § Sicherheits-Module pflegen Aspekte).
  Modul 12 (Blocklist) auf Origin-Ebene (Sub (b)) — nur Verweis. KANN
    Sub-(e)-Einträge zum Trigger nutzen, schreibt aber einen eigenen
    Persistent-Log (Trennung Anzeige/Audit).
  Modul 14 (Diffusion) auf op:"hint"-Pfad (Sub (b)) — VORBESTELLT in
    Spec-Sitzung 15.B 2026-05-25: Sub (b) delegiert hint-Bedienung an
    window.SbkimDiffusion?.recordLead({vector, label, ttlMs,
    sourceOrigin}); fail-soft wenn Modul 14 fehlt (console.info +
    decision:"ignored"). Modul 15 ist Empfänger der Botschaft, NICHT
    Store-Owner des sbkim_diffusion_leads.
  Modul 04.C (Search-API) auf op:"query"-Pfad (Sub (b)) — VORBESTELLT in
    Spec-Sitzung 15.B 2026-05-25: Sub (b) delegiert query-Bedienung an
    window.SbkimMatch?.queryLocal(text, k) → Promise<Array<{label,
    score, sporeUrl}>>; fail-soft wenn 04.C fehlt (Antwort {results:[],
    error:"module-04c-not-available"} via op:"queryResult").
  Modul 16 (SBKIM-Siegel) auf Sub (a) read()-Snapshot — siehe Garantien-
    Block oben (siegel-Feld). Vorbestellung gespiegelt aus INTERFACES
    § 1 Modul 16 § Hook-Punkte.

Risiken (für Spec-Sitzung 15.B / 15.C zu schließen, Sub (e) jetzt
mitigiert):
  Origin-Spoofing (Mitigation: postMessage event.origin browser-seitig
  nicht-fälschbar + Sub-(b)-Allowlist) · Datenexfiltration via
  KI-Browser-Agent (Mitigation: Sub (a) nodeIdHash + sbkim_keys nie
  exponiert; Sub (e) Lampe macht Read-Vorgänge SICHTBAR) ·
  Agent-Replay (Mitigation: nonce + expiresAt in Sub (c)) · Konsens-
  Bruch (Mitigation: Sub (e) Lampe + kein Auto-Handshake) ·
  Allowlist-Drift bei PWA-Update (Mitigation: Sub (e) zeigt
  rejected-allowlist-Einträge, Klaus erkennt fehlende Origins) ·
  Sluse-Phishing (Sub (d), heute schon mitigiert) · PWA-Suffix vs.
  Origin-Allowlist-Kollision.

Geprüft: 2026-05-18 (Hauptsitzung 15-Membran-Stub),
         2026-05-24 (Spec-Sitzung 15 — Sub (e) voll, Sub (a)+(b) grob),
         2026-05-25 (Spec-Sitzung 15.B — Sub (a) Snapshot-Schema +
                     Siegel-Hook + Sub (b) Envelope/Op-Tabelle/Nonce/
                     Rate-Limit-Hook voll spezifiziert),
         2026-05-25 (Bau-Sitzung 15.B — Sub (a) read() voll, Sub (b)
                     postMessage-Bedien-Pfade voll implementiert;
                     Headless-Smoke 31/31 grün),
         2026-05-25 (Klaus' Sichttest Bau 15.B grün — Panel 15
                     Setup + Knöpfe 10–17 8/8 in DeX-Chrome auf
                     Galaxy Tab S6 + Sage-Page Bonus vier Plaketten
                     sichtbar; Status `entwurf` → `review` → `stabil`)

---

### Modul: 16_siegel
Status: entwurf  (Spec-Sitzung 16 vom 2026-05-24 — alle vier Sub-Bereiche
                 final spezifiziert: Sub (a) Pflicht-Modul-Liste mit
                 sieben Modulen + Surface-Check-Form, Sub (b) Badge-
                 Rendering Auszeichnungs-Optik, Sub (c) Erklärungs-
                 Modal mit nüchterner Aussteller-Klärung, Sub (d)
                 `ZERTIFIKAT_ASPEKTE`-Liste lebendes Dokument.
                 Bau-Sitzung 16 ausstehend; Modul-Code in
                 `src/modules/16_siegel.js` existiert noch nicht.)
Datei:  docs/components/16_siegel.md (Karte) ·
        src/modules/16_siegel.js (existiert noch nicht — Bau-Sitzung 16
        nach Spec-Sitzung 16 vom 2026-05-24 fällig) ·
        index.html (Bau-Sitzung 16 ergänzt :root --siegel-*-Variablen,
        Badge-CSS + DOM-Anker `#sbkim-siegel-badge` als vierte
        Plakette nach #lamp-fremd, ergänzt `<script src="src/modules/
        16_siegel.js">` und `SbkimSiegel.init({...})`-Aufruf in
        sbkim-init.js nach SbkimMembrane.init)

Bietet (öffentlich):
  init(options?)                  → Promise<void>
                                    // Snapshot-Init, prüft PFLICHT_MODULE-Surface
                                    // via typeof-Check, cached in Closure, mountet
                                    // Badge + Modal-Lifecycle. Idempotent: zweiter
                                    // Aufruf no-op (kein Re-Check).
  isCertified()                   → boolean (sync)
                                    // true wenn alle PFLICHT_MODULE-Status ∈
                                    // {"ok","deferred"} sind. Gültig nach init().
  getExplanation()                → ExplanationSnapshot (sync)
                                    // Defensive Kopie. Modal-Render-Quelle.
  getCertifiedModules()           → string[] (sync)
                                    // Modul-IDs mit status ∈ {"ok","deferred"}.
                                    // Defensive Kopie.
  getAspects()                    → Aspect[] (sync)
                                    // ZERTIFIKAT_ASPEKTE chronologisch aufsteigend
                                    // (älteste oben). Defensive Kopie.
  _meta                           // Read-Anker für Tests (analog Modul 15):
                                    //   firstBootShown:    boolean
                                    //   certifiedAt:       string | null  (ISO-8601)
                                    //   pflichtModuleSpec: Array (Snapshot der
                                    //                       PFLICHT_MODULE-Spec)
                                    //   mycelConnected:    boolean   (Bau Sub e, 2026-05-26)
                                    //                                — true sobald
                                    //                                  sbkim:handshake
                                    //                                  outcome:"established"
                                    //                                  empfangen wurde
                                    //   mycelConnectedAt:  string | null  (Bau Sub e,
                                    //                                  ISO-8601; null
                                    //                                  in Bronze-Stufe)
                                    //   siegelStufe:       "bronze"|"gold"  (Bau Sub e,
                                    //                                  Live-Getter)
                                    //   ribbonText:        string   (effektiver Band-
                                    //                                  Text; "" wenn offen
                                    //                                  gelassen, sonst der
                                    //                                  via init gesetzte Wert)
                                    //   andockToolEnabled: boolean  (opt-in Andock-
                                    //                                  Knopf; via init
                                    //                                  andockTool, Default
                                    //                                  false)

  _resetMycelConnectedForTest()   → void (sync, Bau Sub e)
                                    // Test-Brücke (KEIN Public-Use): setzt
                                    // _meta.mycelConnected auf false +
                                    // mycelConnectedAt auf null, re-rendert
                                    // Badge auf Bronze, schließt offenes Modal
                                    // nicht. Convention analog Modul 08
                                    // _clearOutbox. Tab-Reload erreicht das
                                    // gleiche; Panel-16-Knopf-12-Test braucht
                                    // Reset ohne Reload.

  options-Form (init):
    {
      // CSS-Selektor für das Badge-Element. Default '#sbkim-siegel-badge'.
      // Wenn Selektor zur init()-Zeit nicht matcht und mountModal:true,
      // wird via MutationObserver wie in Modul 00 nach DOMContentLoaded
      // erneut versucht.
      badgeSelector?: string,

      // "visible" (Default): Badge im DOM + Modal-Lifecycle aktiv.
      // "hidden": kein Badge-DOM, kein Modal-Mount; API erreichbar.
      visible?: "visible" | "hidden",

      // Default true. false unterbindet Modal-Mount + Click-Handler-no-op.
      // Sinnvoll für Endknoten mit eigenem Modal-Design.
      mountModal?: boolean,

      // Override für die Aussteller-Klärungs-URL. null/undefined → Auto-
      // Erkennung (location.origin + erstes Pfad-Segment).
      // Endknoten setzen typischerweise den Source-Repo-URL
      // (z.B. "https://github.com/lausiklauskn-png/Mein-Mixarium").
      repoUrl?: string | null,

      // Band-Text im Wappen (unteres Ribbon des SVG-Siegels). Default
      // "SAGE OBSERVATORIUM" → für Sage byte-identisch zum inlined
      // WAPPEN_SVG. Forker setzen ihren Knoten-Namen (z.B. "MEIN-
      // REZEPTBUCH"); das Modul ersetzt den Band-Text zur Render-Zeit
      // (renderWappenSvg), XML-escaped. KEIN SVG-Edit mehr nötig.
      // Fail-soft: leerer/Nicht-String-Wert lässt den Default.
      // Band-Text im Wappen unten (SELF-INSCRIBING-Ribbon). OHNE Wert bleibt
      // das Band OFFEN (leer) + ein einmaliger console.info-Vermerk bittet den
      // Host, seinen Namen via ribbonText einzugravieren — KEINE Auto-Ableitung
      // aus dem Repo-Namen (Klaus-Entscheidung 2026-06-20: ein geratener Slug
      // wirkt auf einer Auszeichnung falsch). Expliziter Wert wird zur
      // Render-Zeit XML-escaped ins Ribbon gesetzt. So entsteht nie ein
      // mitkopiertes Fremd-Label (Befund 2026-06-19: Rezeptbuch/Mixarium
      // trugen statisch "MEIN-TRESOR"). Sage setzt explizit "SAGE OBSERVATORIUM".
      ribbonText?: string,

      // Default false. true → optionaler "Fremden Knoten andocken"-Knopf
      // im Modal (KI-unabhängiger Handshake): öffnet den Modul-18-Wizard
      // SbkimToolPwa.openAndockTab() (Repo-URL → Spore holen →
      // verifyForeignSpore → Match → Handshake via Modul 05). Fail-soft:
      // fehlt Modul 18, zeigt der Knopf einen Hinweis statt zu werfen.
      // Der "🔑"-Identitäts-Pfad (eigene Spore/Vektor) bleibt unberührt;
      // Andocken ist die ZUSÄTZLICHE Gegenstellen-Richtung (Klaus
      // 2026-06-19). Nur bei true entsteht das DOM-Element
      // [data-siegel-andock-tool] — Default-Render trägt es nicht.
      andockTool?: boolean,
    }

  ExplanationSnapshot (Karte 16 § Schnittstelle, verbindlich):
    {
      certifiedAt:      <ISO-8601 string | null>,
      isCertified:      <boolean>,
      repoUrl:          <string>,
      modules:          [
        { id, name, globalName, surfaceFn, lazy, status }
        // status ∈ "ok" | "deferred" | "missing" | "broken"
      ],
      certifiedModules: <string[]>,
      aspects:          [Aspect, ...]   // chronologisch aufsteigend
    }

  Aspect (Karte 16 § Sub (d), verbindlich):
    {
      since:       <ISO-Datum string>,  // "YYYY-MM-DD"
      module:      <string>,             // zweistellige Modul-ID
      aspect:      <string>,             // Kurz-Titel, ≤ 80 Zeichen
      description: <string>,             // 1–2 Sätze, ≤ 240 Zeichen, kein PII
    }

  PFLICHT_MODULE (modul-interne Konstante, Karte 16 § Sub (a)):
    Sieben Einträge — Stand Spec-Sitzung 16 vom 2026-05-24:
    [
      { id:"01", name:"Storage",     globalName:"SbkimStorage",     surfaceFn:"init",                lazy:false },
      { id:"02", name:"Spore",       globalName:"SbkimSpore",       surfaceFn:"getOwnSpore",         lazy:false },
      { id:"03", name:"Embedding",   globalName:"SbkimEmbedding",   surfaceFn:"embedPassage",        lazy:true  },
      { id:"04", name:"Match",       globalName:"SbkimMatch",       surfaceFn:"match",               lazy:false },
      { id:"05", name:"Anastomose",  globalName:"SbkimAnastomose",  surfaceFn:"handshake",           lazy:false },
      { id:"07", name:"Apoptose",    globalName:"SbkimApoptose",    surfaceFn:"prepareSelfApoptose", lazy:false },
      { id:"15", name:"Membran",     globalName:"SbkimMembrane",    surfaceFn:"init",                lazy:false },
    ]
    Diese Liste ist code-versioniert. Aktualisierung NUR über eine
    Pflege-PR mit Karten- und Brief-Update; KEINE Runtime-API zum
    Setzen.

  ZERTIFIKAT_ASPEKTE (modul-interne Konstante, Karte 16 § Sub (d)):
    Start-Eintrag verbindlich für Bau-Sitzung 16:
    [
      {
        since:       "2026-05-24",
        module:      "16",
        aspect:      "Grund-Siegel-Bezeugung",
        description: "Diese App bestätigt durch Selbst-Prüfung beim Boot, dass die SBKIM-Pflicht-Module 01/02/03/04/05/07/15 geladen sind.",
      },
    ]
    Diese Liste ist code-versioniert. Erweiterung NUR über Pflege-PR
    jedes spätergebaut werden Sicherheits-Moduls (Konvention §
    Garantien unten); KEINE Runtime-API zum Setzen.

Nutzt:
  Browser-API: typeof globalThis[NS]              Surface-Check für
                                                   PFLICHT_MODULE — KEIN
                                                   echter Funktions-Aufruf,
                                                   nur "Funktion existiert".
  Browser-API: document.querySelector(badgeSelector)
                                                   Badge-Mount, optional
                                                   MutationObserver-Re-Try
                                                   (analog Modul 00).
  Browser-API: document.body                       Modal-Mount-Anker (eigenes
                                                   Modal, analog Modul 15).
  Browser-API: location.origin / location.pathname Auto-Erkennung der Repo-URL
                                                   (erstes Pfad-Segment).
  Modul 16 ruft KEINE Funktion eines Pflicht-Moduls auf — nur typeof-
  Check. Damit ist Modul 16 von der Pflicht-Modul-Achse entkoppelt;
  ein Pflicht-Modul-Bug bricht nur die Bezeugung, nicht den 16er-Lauf.

Storage:
  KEINE Stores. Modul 16 ist RAM-only (Modul-lokales Closure
  `let metaSnapshot = null`).
  KEIN `DB_VERSION`-Bump in Modul 01. KEIN neuer Store. Persistenz-
  Entscheidung Karte 16 § Persistenz: per-Session-Selbst-Bezeugung
  ist die ehrliche Aussage; eine IndexedDB-Persistenz würde
  suggerieren, das Siegel sei „älter" als es aktiv ist.

Events:
  reagiert: click auf badgeSelector-Element        Modal öffnen
  reagiert: Esc-Keydown / Backdrop-Klick / ✕-Klick Modal schließen
  feuert (Vorbestellung Modul 17 Floating-Widget, Bau-Sitzung 17 oder
         eigene Mini-Pflege; Spec-Sitzung 17 vom 2026-05-25):
    sbkim:siegel-certified — Custom-Event auf window, einmalig nach
                             init() wenn isCertified()===true. Detail-Form:
                               { certifiedAt: <ISO-8601 string>,
                                 repoUrl:     <string> }
                             PII-Disziplin: Repo-URL ist öffentlich
                             (Hosting-URL), certifiedAt ist die Session-
                             Zeitstempel-Zeit. Konsumiert von Modul 17
                             (SIEGEL-Slot ins DOM mounten + First-Boot-
                             Animation). Anti-Greenwashing-Klausel binär:
                             wird NUR gefeuert wenn isCertified()===true.
  reagiert (Bau Sub e, 2026-05-26):
    sbkim:handshake          — Window-Custom-Event aus Modul 05 (Bau 17).
                             Handler-Vertrag idempotent + fail-soft:
                             `event?.detail?.outcome !== "established"` →
                             no-op (kein Throw bei fehlendem detail / null).
                             Bei outcome:"established": _meta.mycelConnected
                             wird true (RAM-only, Tab-Reload setzt zurück
                             auf false), _meta.mycelConnectedAt = new
                             Date().toISOString(); Badge data-stufe wechselt
                             auf "gold" + Klasse stufenwechsel-gold für 600 ms;
                             aria-label wechselt auf „SBKIM-Siegel · Mycel
                             verbunden"; wenn Modal offen, Refresh via
                             renderModalContents(). Zweiter Event mit
                             outcome:"established" ist no-op (idempotent
                             durch mycelConnected-Flag).
  reagiert: (sonst keine — getExplanation() ist die Live-API, keine DOM-Event-
             Indirektion. Modul 15 Sub (a) read() ergänzt einen Siegel-
             Hook, der SbkimSiegel.getExplanation() synchron abfragt.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 16 SIEGEL bereit, Funktionen: init/isCertified/getExplanation/getCertifiedModules/getAspects");
  Wie Modul 00/01/02/04/05/06/07/08/15 — keine Konstante in der
  Selbstcheck-Zeile. PFLICHT_MODULE und ZERTIFIKAT_ASPEKTE sind modul-
  lokal in `src/modules/16_siegel.js`.

Versionierungs- und Sichtbarkeits-Vertrag:
  - Modul 16 ist NICHT protokoll-aktiv. Kein Netz, keine Signatur, kein
    Embedding, kein Handshake. Lokales Render-Modul. Es gibt keinen
    Hauptversions-Check in 16 — `PROTOCOL_VERSION` bleibt unverändert,
    `DB_VERSION` bleibt unverändert.
  - PFLICHT_MODULE und ZERTIFIKAT_ASPEKTE sind **code-versioniert**.
    Spätere Sicherheits-Module (10/11/12/14/künftige 15.B-Erweiterungen)
    ergänzen einen ZERTIFIKAT_ASPEKTE-Eintrag in ihrer eigenen Bau-/
    Pflege-Sitzung — KEINE Runtime-API für Aspekte/Pflicht-Module.
  - `ExplanationSnapshot.modules[].status`-Werte sind additiv
    versioniert: `"ok"` / `"deferred"` / `"missing"` / `"broken"` sind
    die vier festgelegten Werte. Eine spätere Spec darf ergänzen
    (z.B. `"stale"` für Pflicht-Module mit veraltetem Surface), aber
    nicht umbenennen.
  - `_meta.certifiedAt` ist SESSION-ONLY (RAM-only, Tab-Reload setzt
    Datum neu). Modal-Text „bezeugt seit YYYY-MM-DD HH:MM" ist die
    ehrliche Selbst-Beschreibung. Wer Persistenz will, baut Modul 12
    (Blocklist) mit Append-Log und ergänzt einen Aspekt-Eintrag.

Fehlerverhalten:
  - init(): badgeSelector kein gültiger CSS-Selektor               → console.warn, KEIN Throw;
                                                                     Badge-Mount übersprungen, Modal-Mount
                                                                     erfolgt trotzdem (mountModal:true)
  - init(): badgeSelector matcht zur init()-Zeit kein Element     → MutationObserver-Re-Try analog Modul 00,
                                                                     gibt nach 10 s auf (console.warn)
  - init(): repoUrl ist string aber keine gültige URL              → fail-soft, Auto-Erkennung als Fallback,
                                                                     console.warn
  - init(): zweimaliger Aufruf                                    → idempotent (kein Re-Check, kein
                                                                     Re-Mount, kein Doppel-Listener)
  - init(): mindestens ein PFLICHT_MODULE mit status "missing"/"broken"
                                                                   → genau EINE console.warn-Zeile mit
                                                                     ID-Liste; KEIN Badge-Render (Element
                                                                     wird gar nicht angelegt — nicht
                                                                     display:none, sondern nicht im DOM);
                                                                     Modal-Mount übersprungen;
                                                                     isCertified() → false;
                                                                     getExplanation() liefert Snapshot
                                                                     trotzdem (Debug-Zwecke)
  - isCertified() vor init()                                       → returniert false (Default-Wert,
                                                                     kein Throw)
  - getExplanation() vor init()                                    → returniert leeren Snapshot
                                                                     (certifiedAt:null, isCertified:false,
                                                                     modules:[], aspects:[]), kein Throw
  - getCertifiedModules() / getAspects() vor init()               → leeres Array, kein Throw

  KEINE benannten Error-Klassen für Modul 16. Modul ist rein lokal/
  beobachtend; alle Pfade sind fail-soft mit console.warn analog
  Modul 15. Sub (a) finale Spec entscheidet KEINE Fehler-Pfade über
  diese hinaus (z.B. NICHT Custom-Error für Pflicht-Modul-Spoofing —
  Spoofing ist ein bewusster akzeptierter Trade-off, siehe Karte 16
  § Risiken).

Datenformate:
  ExplanationSnapshot   → Karte 16 § Schnittstelle (oben gespiegelt).
  Aspect                → Karte 16 § Sub (d) (oben gespiegelt).
  PFLICHT_MODULE-Entry  → { id, name, globalName, surfaceFn, lazy }
                           (oben unter PFLICHT_MODULE gelistet).
  Status-Werte          → "ok" | "deferred" | "missing" | "broken".

Garantien für Modul 00 / 09 / 10 / 11 / 12 / 14 / 15:
  - **Anti-Greenwashing-Klausel:** kein Badge-Render bei
    isCertified() === false. Element ist gar nicht im DOM (nicht
    display:none, nicht ausgegraut). Klaus' Disziplin 2026-05-24,
    binär.
  - **Self-Issued ist eine Disziplin-Aussage, KEIN UI-Disclaimer.**
    Modal-Klausel ist sachliche Selbst-Beschreibung in zwei Zeilen
    (Karte 16 § Sub (c)). Kein Haftungs-Block; „ohne Garantie" wird
    NICHT in den UI-Text aufgenommen (Klaus-Korrektur 2026-05-24).
  - **Keine Hub-Aussteller-Variante.** Self-Inscribing ist die einzige
    spezifizierte Variante. Eine zentrale Zertifizierungs-Autorität
    widerspricht dem dezentralen SBKIM-Geist.
  - **PFLICHT_MODULE und ZERTIFIKAT_ASPEKTE sind code-versioniert.**
    Keine Runtime-API zum Setzen. Endknoten-PWAs ergänzen Einträge in
    ihrer Repo-Kopie von `16_siegel.js`, falls sie wollen — aber das
    ist ein Pflege-PR-Schritt, nicht ein Config-Schritt.
  - **Pflicht-Konvention für künftige Sicherheits-Module:** jedes
    spätere Sicherheits-Modul (10 Reputation / 11 Rate-Limit / 12
    Blocklist / 14 Diffusion / 15.B Membran Sub (a)+(b) finale Spec /
    künftige Module) MUSS in seiner Bau- bzw. Pflege-Sitzung in
    `src/modules/16_siegel.js` einen ZERTIFIKAT_ASPEKTE-Eintrag
    ergänzen (Listen-Ende, aktuelles Datum + Modul-ID + kurze
    Beschreibung). Folge-Pflege CLAUDE.md: § „Sicherheits-Module
    pflegen Aspekte" als neuer Pflicht-Block ist NACH Bau-Sitzung 16
    fällig (eigene Mini-Pflege-Sitzung).
  - **Keine PII im Modal.** Repo-URL, Modul-Liste, Aspekt-Beschreibung
    sind alle öffentlich. Modal trägt KEINE nodeId, KEINE Geschwister-
    Daten, KEINE API-Keys.
  - **Modul 15 Sub (a) read()-Hook (vorbestellt für Spec-Sitzung 15.B):**
    `read()`-Snapshot SOLL ein optionales Feld
    `siegel: { isCertified, repoUrl, certifiedModules }` mitliefern.
    Modul 16 stellt dafür die sync getter (`isCertified()` +
    `getExplanation()`) bereit; Modul 15 Sub (a) finale Spec
    entscheidet das Snapshot-Schema.
  - **Sage-Page (index.html) erhält in Bau-Sitzung 16:**
      :root {
        --siegel-gold:        #C9A961;
        --siegel-gold-glow:   rgba(201,169,97,0.55);
        --siegel-ink:         #1A1306;
        --siegel-line:        rgba(201,169,97,0.45);
      }
      #sbkim-siegel-badge   { ... rundes 40-px-Medaillon, Edel-Gold ... }
      #sbkim-siegel-badge:hover { box-shadow: 0 0 12px var(--siegel-gold-glow); }
      #sbkim-siegel-badge.first-boot { animation: siegel-first-boot 600ms ease-out; }
      @keyframes siegel-first-boot { 0%→0.7/0%, 60%→1.12/100%, 100%→1.00/100% }
      <span id="sbkim-siegel-badge" title="SBKIM-Siegel — klick für Details">
        <svg viewBox="0 0 40 40">…drei Hyphen-Bögen + Knoten…</svg>
      </span>
    direkt nach <span class="lamp" id="lamp-fremd"> + "fremd"-Label.
    Click-Handler öffnet das Sub-(c)-Modal. Modul 09 (Einbau-PWA)
    bekommt in eigener Folge-Pflege einen erweiterten Schritt 10:
    „Membran-Allowlist + FREMD-Lampe + Siegel-Badge in PWA-Header
    anhängen".

Tabus (verbindlich):
  - NIEMALS Badge-Render ohne isCertified() === true. Anti-
    Greenwashing-Klausel, binär.
  - NIEMALS Disclaimer-Schwall im Modal. Zwei Zeilen Aussteller-
    Klärung, sachlich (Klaus-Korrektur 2026-05-24).
  - NIEMALS Hub-Aussteller-Variante. Self-Inscribing ist die einzige
    Variante.
  - NIEMALS Runtime-Ergänzung von PFLICHT_MODULE oder
    ZERTIFIKAT_ASPEKTE. Code-versioniert.
  - NIEMALS Funktionen der Pflicht-Module aufrufen — nur typeof-
    Check. Modul 16 ist von der Pflicht-Modul-Achse entkoppelt.
  - NIEMALS PII im Modal. Repo-URL/Modul-Liste/Aspekte sind öffentlich;
    nodeId/API-Keys/Geschwister-Liste niemals.
  - NIEMALS Stufen-Varianten (Bronze/Silber/Gold) für das Grund-
    Siegel. Klaus' Festlegung 2026-05-24: Siegel wächst über Aspekte,
    NICHT über sichtbare Stufen.
  - NIEMALS Spore-Schema erweitern um ein `siegel`-Feld. Modul 16 ist
    eine PWA-lokale Bezeugung, kein Netz-Signal. Sichtbarmachung im
    Netz gehört in Modul 10 Reputation, nicht in 02 Spore.
  - Empfangsmodus-Prinzip bleibt: Modul 16 initiiert nichts, beobachtet
    nichts, antwortet nichts ins Netz. Lokale Render-Schicht.

Hook-Punkte (nur Verweis, nicht implementiert):
  Modul 10 (Reputation) auf certifiedModules + repoUrl als Anfangs-
  Trust-Signal beim Handshake (eigene Spec-Sitzung 10) ·
  Modul 15 Sub (a) read() ergänzt `siegel`-Feld im Snapshot (Spec-
  Sitzung 15.B) ·
  Module 11/12/14/künftige: jeder Bau/Pflege ergänzt einen
  ZERTIFIKAT_ASPEKTE-Eintrag.

Risiken (Karte 16 § Risiken):
  Surface-Check-Spoofing (Mitigation: akzeptierter Trade-off; tiefere
  Verhaltens-Prüfung wäre fragil) · Aspekte-Liste-Drift zwischen
  Endknoten (Mitigation: gewollt — jeder Knoten hat eigene Pflege-
  Geschichte) · Embedding-Lazy-Loading vortäuscht Bezeugung
  (Mitigation: lazy:true nur für Modul 03 in Sage-Page, Endknoten
  laden 03 eager via Karte 09) · Repo-URL-Auto-Erkennung trifft
  falsche Pfad-Komponente (Mitigation: Custom-Domain-PWA setzt
  expliziten repoUrl-Override) · First-Boot-Animation Hintergrund-Tab
  unsichtbar (Mitigation: bewusste Akzeptanz, Animation ist
  Hervorhebung, kein Pflicht-Signal) · Verwechslung mit „rechtlicher
  Garantie" (Mitigation: Modal-Klausel sagt es nüchtern, kein
  Haftungs-Block — Klaus-Korrektur 2026-05-24).

Geprüft: 2026-05-24 (Spec-Sitzung 16 — alle vier Sub-Bereiche final),
         2026-05-26 (Tafel-Spec-Pflege Mycel-Vision — § Sub (e)
                     Mycel-Verbindungs-Stufe + Aspekt 4 hinzugefügt),
         2026-05-26 (Bau-Sitzung 16 Sub (e) — Bronze/Gold-Stufung
                     implementiert: window-Event-Listener sbkim:handshake
                     mit idempotent + fail-soft Handler, _meta-Erweiterung
                     mycelConnected/mycelConnectedAt/siegelStufe-Getter,
                     applyStufeToBadge mit data-stufe-Attribut + aria-label
                     je Stufe + KEIN title (Pflege-17-Klausel), Stufenwechsel-
                     Animation 600 ms via stufenwechsel-gold-Klasse,
                     Modal-Bronze-Hinweis-Block + [Andocken]-Knopf mit fail-
                     soft Modul-18-Check, Aspekt-4-Pending-Marker in
                     Bronze, ZERTIFIKAT_ASPEKTE um Aspekt 4 erweitert,
                     index.html CSS um zwei Variablen + drei Regeln + Keyframes
                     ergänzt, Panel 16 in tests/manual_check.html um vier
                     Knöpfe 9–12 erweitert, Headless-Smoke 15/15 grün,
                     Regression 04a 19/19 + 04b 30/30 + 04c 43/43 +
                     15b 31/31 + 17 32/32 grün.),
         2026-05-26 (Sichttest Bau 16 Sub (e) — Klaus, DeX-Chrome auf
                     Galaxy Tab S6 mit Termux python3 -m http.server 8000
                     nach Hard-Reload: Panel 16 Knöpfe 9–12 alle 4/4 grün.
                     Knopf 9 Bronze-Initial: data-stufe="bronze",
                     aria-label="SBKIM-Siegel · Mycel suchend", title=null,
                     mycelConnected=false, mycelConnectedAt=null,
                     siegelStufe-Getter="bronze". Knopf 10 Bronze→Gold via
                     synthetischem Handshake (zweimal idempotent über
                     _resetMycelConnectedForTest grün): stufe_vor="bronze"
                     → stufe_nach="gold", aria_label_nach="SBKIM-Siegel ·
                     Mycel verbunden", mycelConnected=true, mycelConnectedAt
                     ISO ("2026-05-26T16:27:22.973Z"), Klasse
                     stufenwechsel-gold direkt nach Dispatch live gesetzt.
                     Knopf 11 Idempotenz: erste_welle === zweite_welle
                     ("2026-05-26T16:27:56.565Z"), Klasse nach zweitem
                     Dispatch wieder false, Stufe bleibt gold. Knopf 12
                     Bronze-Klick öffnet Modal mit sichtbarem Hinweis-Block
                     + [Andocken]-Button + Aspekt-4-pending-Marker
                     ("pending· 16· Mycel-Verbindung etabliert (erster
                     Handshake)…", aspekte_anzahl=4). Sichttest 1–8
                     (Bau-16-Basis) bleibt ungeprüft — Pflege-Sitzung
                     deckt nur Sub (e) ab.),
         2026-05-26 (Endknoten-Sichttest Cross-Knoten Sub (e) — Klaus,
                     DeX-Chrome auf Galaxy Tab S6 mit Mein-Rezeptbuch
                     PR #249 + Mein-Mixarium PR #58 gemerged + Fix-PRs
                     für badgeSelector-Konfig. Sub (e) funktional in
                     beiden Endknoten bewiesen: Initial-Bronze visuell
                     + Eruda-Verify, Modal öffnet sich mit Bronze-
                     Hinweis-Block + [Andocken]-Knopf + Modul-18-Info-
                     Notiz, Aspekt 4 als „pending"-Marker. Live-Cross-
                     Knoten-Handshake via Eruda mit BroadcastChannel-
                     bridge: outcome="established", score=0.9544.
                     Manueller window.dispatchEvent('sbkim:handshake',
                     outcome:'established') in beiden PWAs ergibt
                     stufe="gold" + mycelConnected=true + Modal-
                     Refresh (Bronze-Hinweis-Block weg, Aspekt 4
                     datiert). Drei eigenständige Folge-Befunde:
                     (a) Modul 17 Widget-SIEGEL-Slot rendert immer
                     gold-medaillon, data-stufe wirkt nur am unsichtbaren
                     Proxy-Span — visueller Bronze/Gold-Unterschied im
                     Slot fehlt; (b) Endknoten-sbkim/05_anastomose-v2.js
                     ist prä-Bau-17 und dispatcht KEIN sbkim:handshake-
                     window-Event automatisch beim erfolgreichen
                     Handshake → manueller dispatch nur als Workaround;
                     (c) Modal-„Bezeugt seit … Uhr"-Datum zeigt UTC
                     statt MESZ-lokal. Drei separate Folge-Pflege-
                     Sitzungen geplant.),
         2026-05-26 (Pflege Modal-Local-Time — Sub-(e)-Folge-Pflege 3/3
                     aus dem Endknoten-Sichttest-Befund (3). Klaus'
                     Befund DeX-Chrome (MESZ): Modal zeigte UTC-Zeit
                     statt lokal. Fix in renderModalContents Zeile
                     ~872–885: UTC-ISO-Slice durch lokale Date-Methoden
                     ersetzt (date.getFullYear/getMonth+1/getDate/
                     getHours/getMinutes mit padStart). Format-
                     Konvention bleibt YYYY-MM-DD, HH:MM Uhr (kein
                     Optik-Wechsel — Klaus' Doku-Pattern überall ISO-
                     Datum). _meta.certifiedAt bleibt UTC-ISO (Spec-
                     Vertrag unverändert). Karte 16 § Sub (c) Modal-
                     Body Punkt 1 um Anzeige-Konvention-Block
                     erweitert. Headless-Smoke smoke_bau16_sub_e_bronze
                     15→16/16 grün (Probe 16 Modal-Datum lokal-
                     Konsistenz). Regression smoke_bau15b 31/31 +
                     smoke_bau17 36/36 grün. node --check Modul 16
                     grün. KEIN funktionaler Vertrags-Eingriff, KEIN
                     PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-
                     Bump, KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-
                     Schicht). Endknoten ziehen nach.)
Status: Code-Stub  (Bau-Sitzung 17 vom 2026-05-25 — `src/modules/17_floating_widget.js`
                 voll angelegt: Vier-Slot-Live-Status-Dashboard
                 (LEBT/VERKEHR/FREMD/SIEGEL) mit Drag-via-Pointer-Events,
                 X-Schließen, localStorage-persistiertem Visible + Position,
                 RAM-only VERKEHR-FIFO 10. Fünf Event-Listener auf `window`:
                 sbkim:alive / :handshake / :postmessage / :fremd-alert /
                 :siegel-certified. DispatchEvent-Hooks additiv in Modul
                 02/05/15/16 verdrahtet — Modul 17 lauscht passiv. Modal-
                 Bridge via Proxy-DOM-Element (Option 1 aus Brief): Widget
                 legt `#lamp-fremd` + `#sbkim-siegel-badge` unsichtbar in
                 seinem Inneren an; Modul 15/16 attachen Click-Handler
                 dort. **Init-Reihenfolge-Pflicht: SbkimWidget.init() VOR
                 SbkimMembrane.init() / SbkimSiegel.init() im Endknoten-
                 Andocker.** SIEGEL-Slot binär Anti-Greenwashing (kein
                 DOM-Render ohne isCertified===true, doppelte Defensive-
                 Prüfung). KEINE benannten Error-Klassen, fail-soft via
                 console.warn. Headless-Smoke 19/19 grün; Modul-15-
                 Regression 31/31 grün; node --check für alle fünf Module
                 + 13 Inline-Script-Blöcke in tests/manual_check.html
                 grün. Sichttest ungeprüft — wartet auf Klaus' Browser-
                 Lauf Panel 17.)
Datei:  docs/components/17_floating_widget.md (Karte) ·
        src/modules/17_floating_widget.js (existiert noch nicht —
        Bau-Sitzung 17 nach Spec-Sitzung 17 vom 2026-05-25 fällig) ·
        Endknoten-Andocker (sbkim/sbkim-init.js): EIN-Zeilen-Aufruf
        `await SbkimWidget.init({allowedOrigins, repoUrl})` als
        Endknoten-Standard-Pfad (statt drei Zeilen Modul-15-init +
        Modul-16-init mit Selektor-Bridge)

Bietet (öffentlich):
  init(options?)                  → Promise<void>
                                    // Self-mountet die Pille in <body>,
                                    // registriert fünf Event-Listener auf
                                    // window, liest localStorage für
                                    // visible + position. Idempotent —
                                    // zweiter Aufruf no-op.
  show()                          → void (sync)
                                    // Widget einblenden + localStorage-
                                    // Wahl persistieren. No-op + console.warn
                                    // wenn nicht initialisiert.
  hide()                          → void (sync)
                                    // Widget ausblenden + localStorage-
                                    // Wahl persistieren.
  isVisible()                     → boolean (sync)
                                    // Aus DOM-State gelesen (nicht aus
                                    // localStorage — sonst drift).
  minimize()                      → void (sync, Pflege UX 2026-05-25)
                                    // Drei-Zustand-Pfad: setzt minimierten
                                    // Zustand (nur SIEGEL sichtbar, oder
                                    // LEBT-Fallback wenn kein SIEGEL).
                                    // Persistiert in localStorage
                                    // `sbkim_widget_minimized`="true".
                                    // No-op + console.warn vor init().
  maximize()                      → void (sync, Pflege UX 2026-05-25)
                                    // Stellt den Voll-Zustand wieder her
                                    // (alle Slots sichtbar). Persistiert
                                    // `sbkim_widget_minimized`="false".
  isMinimized()                   → boolean (sync, Pflege UX 2026-05-25)
                                    // Liest aus internem Flag (nicht
                                    // localStorage, analog isVisible).
  getPosition()                   → PositionSnapshot (sync)
                                    // Defensive Kopie. Defaults bei
                                    // nicht-initialisiertem Modul:
                                    // { corner:"bottom-right", offsetX:16,
                                    //   offsetY:16, x:null, y:null }.
  _meta                           // Read-Anker für Tests (analog Modul 15/16):
                                    //   slots:          string[]
                                    //   eventCounts:    { alive, handshake,
                                    //                     postmessage,
                                    //                     fremdAlert,
                                    //                     siegelCertified }
                                    //   trafficLogSize: number (max 10)
                                    //   widgetMounted:  boolean
                                    //   firstBootShown: boolean
                                    //   siegelStufeRendered: "bronze"|"gold"|null
                                    //                         (Pflege Stufen-Render
                                    //                          2026-05-26 — was der
                                    //                          sichtbare SIEGEL-Slot
                                    //                          gerade anzeigt; null
                                    //                          wenn Slot noch nicht
                                    //                          gemountet)

  options-Form (init):
    {
      // Doku-Spiegelung, NICHT durchgereicht (Modul 17 ruft NICHT
      // SbkimMembrane.init() / SbkimSiegel.init(); Andocker bleibt
      // verantwortlich — Spec-Empfehlung Karte 17 § API-Signatur):
      allowedOrigins?: string[],
      repoUrl?:        string,

      // UX-Optionen (alle optional):
      defaultCorner?:  "top-left" | "top-right" | "bottom-left" | "bottom-right",
                       // Default "bottom-right"
      defaultOffset?:  { x:number, y:number },  // Default { x:16, y:16 }
      allowClose?:     boolean,    // Default true. false = kein X-Knopf
      allowDrag?:      boolean,    // Default true. false = fixe Position
      rememberHidden?: boolean,    // Default true. User-Wahl heilig.
      slots?:          ("lebt"|"verkehr"|"fremd"|"siegel")[],
                       // Default ["lebt","verkehr","fremd","siegel"].
                       // Ein Endknoten ohne Modul 15 kann z.B.
                       // ["lebt","siegel"] setzen → andere Slots werden
                       // nicht angelegt.
      zIndex?:         number,     // Default 9990 (unter Modal-Layer 9999,
                                   // weit unter Eruda 9999999).
      theme?:          "auto" | "dark" | "light",  // Default "auto".
    }

  PositionSnapshot (Karte 17 § Schnittstelle):
    {
      corner:  "top-left" | "top-right" | "bottom-left" | "bottom-right" | null,
      offsetX: number,      // px von der Corner-Kante
      offsetY: number,      // px von der Corner-Kante
      x:       number | null,  // wenn Free-Drag aktiv: abs. px von links
      y:       number | null,  // wenn Free-Drag aktiv: abs. px von oben
    }

  Vier-Slot-Layout (verbindlich, Karte 17 § Vier-Slot-Layout):
    Slot          Aktiv-Quelle                  Aktiv-Zustand                  Inaktiv
    LEBT          Modul 02 (Spore)              pulsiert grün                  grau (kein sbkim:alive)
    VERKEHR       Modul 05 + Modul 15 Sub (b)   gold-Puls pro Event            dunkel (keine Events)
    FREMD         Modul 15 Sub (e)              dauer-rot + Puls               grau (Buffer leer / Modul 15 fehlt)
    SIEGEL        Modul 16                      Bronze/Gold (data-siegel-stufe) NICHT IM DOM (Anti-Greenwashing binär)

    Alle vier Slots im DOM (Ausnahme SIEGEL bei isCertified()===false → kein
    DOM-Element). UX-Disziplin: leerer Slot = „Funktion bekannt, gerade nicht
    aktiv", nicht versteckt.

    SIEGEL-Stufen-Render (Pflege Stufen-Render 2026-05-26, Sub-(e)-Sichttest-
    Befund 1): der sichtbare SIEGEL-Slot bekommt `data-siegel-stufe`-Attribut
    am Button-Element. Zwei Werte:
      - "bronze" (Default fail-soft) → CSS-Filter saturate(0.6) brightness(0.85)
                                       am Gold-Medaillon + ★-Glyph; Hover mit
                                       Bronze-glow.
      - "gold"   → Default-Render (kein Override).
    Initial-Wert wird beim Slot-Mount aus `SbkimSiegel._meta.siegelStufe`
    gelesen (Architektur-Pfad ii — robust gegen Event-Reihenfolge). Bei
    `sbkim:handshake` mit `outcome:"established"` re-setzt Modul 17 das
    Attribut auf "gold" + 600 ms `.sbkim-widget-siegel-stufenwechsel`-Klasse
    für die Stufenwechsel-Animation (analog Modul 16 `.stufenwechsel-gold`
    in index.html § Sub (e)). Idempotent — zweiter established-Handshake
    re-animiert nicht. _meta.siegelStufeRendered spiegelt den aktuellen
    Render-Stand als Diagnose-Anker.

Event-Bus-Schema (verbindlich, Karte 17 § Event-Bus-Schema):
  Modul 17 abonniert fünf Custom-Events auf window. Anbieter-Module
  dispatchen via window.dispatchEvent(new CustomEvent(name, {detail})).
  Detail-Form PII-frei (nur Counts + Status-Flags, KEINE Inhalte).

  Event-Name              Dispatcher                       detail-Form
  sbkim:alive             Modul 02 (Spore)                 { since:ISO, nodeId:base64url }
  sbkim:handshake         Modul 05 (Anastomose)            { outcome, peerNodeId|null, direction:"incoming"|"outgoing" }
                                                            outcome ∈ "established" | "rejected" | "re-handshake" | "rejected-local"
  sbkim:postmessage       Modul 15 Sub (b)                 { op, direction:"incoming", decision }
                                                            op ∈ "sporeRef"|"query"|"hint"|"queryResult"
                                                            decision ∈ "accepted"|"ignored"|"rejected-allowlist"
  sbkim:fremd-alert       Modul 15 Sub (e)                 { kind, decision, bufferSize }
                                                            kind ∈ "membrane-read"|"membrane-postmessage"|"endpoint-probe"
  sbkim:siegel-certified  Modul 16 (SBKIM-Siegel)          { certifiedAt:ISO, repoUrl:string }

  Trigger-Zeitpunkt + Hook-Pflege siehe Karte 17 § Event-Bus-Schema +
  Folge-Pflege-Liste. Bau-Sitzung 17 verdrahtet die dispatchEvent-Aufrufe
  in den jeweiligen Modulen (oder eigene Mini-Pflege-Sitzungen pro Modul).

  Konvention:
    - bubbles:false, cancelable:false. Andere Module dürfen die Events
      ebenfalls abonnieren (z.B. künftige Sage-Page-Statistik).
    - Anti-Greenwashing: Anbieter dispatcht das Event NUR bei realer
      Operation (Test-Brücken wie Modul 15 _recordForTest feuern bewusst
      mit, weil sie für das Widget „echte" Einträge simulieren).
    - Frequency-Drossel auf Anbieter-Seite NICHT pflicht; Modul 17 macht
      intern Render-Drossel (typisch requestAnimationFrame).

Nutzt:
  Browser-API: document.body                        Self-Mount-Anker für die Pille
  Browser-API: document.head                        CSS-Inject via <style>-Element bei init()
  Browser-API: window.addEventListener(name, cb)   fünf Event-Listener auf window
                                                    (sbkim:alive / :handshake / :postmessage /
                                                     :fremd-alert / :siegel-certified)
  Browser-API: localStorage                         UX-Preferences (visible + position).
                                                    KEIN IndexedDB-Schreiber, KEIN Modul-01-
                                                    Abhängigkeit (Modul 17 startet, auch wenn
                                                    Modul 01 fehlt).
  Browser-API: PointerEvent / pointerdown/move/up   Drag-Mechanik (Touch + Mouse vereinheitlicht)
  Browser-API: requestAnimationFrame                Render-Drossel bei Event-Sturm
  DOM: document.querySelector("#lamp-fremd")        Modal-Bridge (Proxy-Click) für FREMD-Slot,
                                                    falls Modul 15 im DOM gemountet ist
                                                    (fail-soft via typeof-Check)
  DOM: document.querySelector("#sbkim-siegel-badge") Modal-Bridge für SIEGEL-Slot, falls Modul 16
                                                    im DOM gemountet ist (fail-soft)
  SbkimSiegel.isCertified()                         Sync-Lese-Check für SIEGEL-Slot bei
                                                    sbkim:siegel-certified-Event (fail-soft,
                                                    Anti-Greenwashing-Klausel binär)

  KEINE Pflicht-Modul-Abhängigkeit. Modul 17 startet idempotent, auch wenn
  Modul 02/05/15/16 alle fehlen — alle Slots bleiben dann grau bzw. SIEGEL
  nicht im DOM.

Storage:
  KEINE IndexedDB-Stores. localStorage-Schlüssel (verbindlich):
    sbkim_widget_visible   → "true" | "false"   (Default "true")
    sbkim_widget_position  → JSON-Stringify eines PositionSnapshot
                             (Default {corner:"bottom-right", offsetX:16, offsetY:16})
    sbkim_widget_minimized → "true" | "false"   (Default "false")  ★ Pflege UX 2026-05-25

  VERKEHR-Mini-Log: RAM-only FIFO max 10 (analog Modul 15 Sub (e) Ringbuffer-
  Pattern, aber kleiner). Kein localStorage, kein IndexedDB. Tab-Reload =
  leer.

  KEIN DB_VERSION-Bump in Modul 01. KEIN neuer Store. KEIN
  PROTOCOL_VERSION-Bump (Modul 17 ist nicht protokoll-aktiv).

Events:
  reagiert: window "sbkim:alive"               LEBT-Slot pulsiert grün
  reagiert: window "sbkim:handshake"           VERKEHR-Slot pulst + Mini-Log
  reagiert: window "sbkim:postmessage"         VERKEHR-Slot pulst + Mini-Log
  reagiert: window "sbkim:fremd-alert"         FREMD-Slot dauer-rot + Puls
  reagiert: window "sbkim:siegel-certified"    SIEGEL-Slot ins DOM mounten +
                                                First-Boot-Animation (einmalig
                                                pro Session)
  reagiert: click auf Slot-Element             Modal-Bridge (LEBT/VERKEHR neue
                                                Modals aus Modul 17; FREMD/SIEGEL
                                                Proxy-Click auf bestehende Modul-
                                                15-/16-Modals)
  reagiert: click auf X-Knopf                  Widget ausblenden + localStorage
  reagiert: pointerdown/move/up auf Pille      Drag-Mechanik
  feuert:   (keine CustomEvents — Modul 17 ist reiner Konsument der vier
             Event-Kanäle.)

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 17 FLOATING-WIDGET bereit, Funktionen: init/show/hide/isVisible/getPosition");
  Wie Modul 00/01/02/04/05/06/07/08/15/16 — Format-Konvention konsistent.

Versionierungs- und Sichtbarkeits-Vertrag:
  - Modul 17 ist NICHT protokoll-aktiv. Kein Netz, keine Signatur, kein
    Embedding, kein Handshake. Reine Render-Schicht.
    PROTOCOL_VERSION/DB_VERSION/BACKUP_FORMAT_VERSION alle unverändert.
  - Event-Detail-Form additiv versioniert: Felder hinzufügen erlaubt
    (z.B. künftig `signalStrength` in `sbkim:handshake`); umbenennen nicht.
  - localStorage-Schema additiv versioniert: weitere Schlüssel mit
    `sbkim_widget_<…>`-Präfix erlaubt; bestehende Schlüssel-Form bleibt.
  - VERKEHR-Mini-Log ist SESSION-ONLY (RAM-only FIFO 10). Wer Persistenz
    will, hängt einen eigenen Listener an die Custom-Events und schreibt
    in seinen eigenen Store.

Fehlerverhalten:
  - init(): document.body fehlt (z.B. Skript im <head> ohne defer)  → fail-soft, MutationObserver wartet auf
                                                                       document.body, mountet dann; KEIN Throw
  - init(): zweimaliger Aufruf                                       → idempotent (kein Doppel-Mount, kein
                                                                       Doppel-Listener-Set)
  - init(): localStorage nicht verfügbar (Inkognito-Modus, alte
       iOS-Safari-Varianten)                                          → fail-soft, Position-/Visible-Persistierung
                                                                       übersprungen, Widget startet mit Defaults
  - show()/hide() vor init()                                         → no-op + genau EINE console.warn-Zeile pro
                                                                       Sitzung (frequenz-gedrosselt)
  - sbkim:siegel-certified-Event bei isCertified()===false (Anti-
       Greenwashing-Bypass-Versuch)                                   → Slot wird NICHT ins DOM angelegt; KEIN
                                                                       Throw; eine console.warn-Zeile
  - sbkim:fremd-alert-Event ohne bufferSize-Feld                    → Slot bleibt grau; kein Throw
                                                                       (fail-soft Schema-Check)
  - sbkim:handshake-Event mit unbekanntem outcome                   → Mini-Log-Eintrag ohne Wertung; Slot pulst
                                                                       (Event ist real); kein Throw
  - Drag-Pointer-Event-Fehler (z.B. capturing fail)                 → Drag abgebrochen, Position springt zurück
                                                                       zur Last-Known-Good-Position; kein Throw
  - Modal-Bridge: #lamp-fremd / #sbkim-siegel-badge fehlt im DOM    → Slot-Click ist no-op + console.warn
                                                                       (Modul 15 / 16 nicht gemountet)

  KEINE benannten Error-Klassen. Modul 17 ist rein lokal/render-only;
  alle Pfade sind fail-soft mit console.warn analog Modul 15/16.

Datenformate:
  PositionSnapshot         → Karte 17 § Schnittstelle (oben gespiegelt).
  Slot-IDs                 → "lebt" | "verkehr" | "fremd" | "siegel".
  Event-detail-Schemata    → Karte 17 § Event-Bus-Schema (oben gespiegelt).
  TrafficLogEntry          → { at:ISO, source:"handshake"|"postmessage",
                              direction:"incoming"|"outgoing",
                              decision:string } (RAM-only, FIFO 10).

Garantien für Modul 00 / 02 / 05 / 09 / 15 / 16:
  - **Anti-Greenwashing pro Slot (binär für SIEGEL, transparent für
    LEBT/VERKEHR/FREMD):** SIEGEL-Slot ist nicht im DOM, wenn
    `SbkimSiegel.isCertified() === false`. LEBT/VERKEHR/FREMD-Slots
    bleiben sichtbar aber grau, wenn kein zugrundeliegendes Event sie
    aktiviert — UX-Wahl gegen „verschwindende UI".
  - **Backend-Module unverändert.** Modul 15 + 16 Public-Surface bleibt
    identisch (Klaus-Festlegung Tafel-Evolutions-Klausel 2026-05-25).
    Nur die Render-Schicht wandert ins Widget. lampSelector +
    badgeSelector bleiben weiterhin Spec-konforme Optionen für den
    Sage-Page-Pfad.
  - **Sage-Page-Pfad bleibt erhalten.** Sage-Page (index.html) behält
    Navleisten-Lampen + Siegel-Badge in der definierten DOM-Position
    (Karte 15 § Sub (e) Lampe + Karte 16 § Sub (b) Position). Endknoten-
    PWAs nutzen das Widget als Standard. Zweigleisigkeit ist Spec-Wille.
  - **Endknoten-Einbau auf drei Zeilen reduziert** (statt 30): Modul-
    Datei-Kopie + <script>-Tag + EIN SbkimWidget.init({allowedOrigins,
    repoUrl})-Aufruf. KEINE CSS-Variablen-Kopier-Pflicht, KEIN
    Navleisten-Markup-Anpassung. Karte 09 § Schritt 10 + 11 + neuer
    Schritt 12 wird in eigener Folge-Pflege nachgezogen (NICHT in
    Spec-Sitzung 17).
  - **Event-Bus ist passiver Hook-Punkt.** Modul 17 dispatcht KEINE
    eigenen Events. Andere Module dürfen die fünf sbkim:*-Events
    ebenfalls abonnieren — z.B. eine künftige Sage-Page-Statistik-
    Karte. Konsumenten-Reihenfolge ist nicht spezifiziert (Listener-
    Aufruf-Reihenfolge ist Browser-Implementation-defined).
  - **VERKEHR-Mini-Log ist RAM-only FIFO 10.** Analog Modul 15 Sub (e)
    Ringbuffer-Pattern, aber kürzer. Tab-Reload = leer. Wer Audit will,
    baut Modul 12 (Blocklist) mit Append-Log.
  - **localStorage-Schlüssel sind UX-only.** sbkim_widget_visible +
    sbkim_widget_position sind keine Protokoll-Daten, kein Spore-Feld,
    kein Identitäts-Anker. Browser-Daten-Wipe → Default-Position
    wiederhergestellt, kein Identitäts-Verlust (analog zu Modul 17 §
    Risiken).

Tabus (verbindlich):
  - NIEMALS eigene Identität / Spore / Signatur / Crypto. Modul 17 ist
    Render-Schicht.
  - NIEMALS IndexedDB-Schreiber. Nur localStorage für UX-Preferences.
  - NIEMALS Netz-Pfad: kein fetch, kein BroadcastChannel, keine
    postMessage, kein Service-Worker-Hook.
  - NIEMALS Anti-Greenwashing-Bypass für SIEGEL-Slot. Binär: kein
    DOM-Render ohne isCertified()===true (Spiegelung Karte 16 §
    Strikte Tabus).
  - NIEMALS Override der Modul-15-/16-Modals. Modal-Bridge via Proxy-
    Click; bestehende Modals bleiben unverändert.
  - NIEMALS Auto-Verhalten ohne init(). Skript-Laden zeigt nur die
    Selbstcheck-Zeile; erst SbkimWidget.init() mountet die Pille.
  - NIEMALS PII in Event-Details. Detail-Form trägt nur Counts +
    Status-Flags. Keine domain-Strings, keine query-text-Inhalte,
    keine hint-vector-Inhalte. nodeId in sbkim:alive ist die EIGENE
    Identität (analog Modul 15 Sub (a) read() Klartext-Konvention);
    peerNodeId in sbkim:handshake ist auch Klartext, weil der Andocker
    den Peer ohnehin in sbkim_siblings sieht — nicht hashed.
  - NIEMALS Dauer-Disclaimer-Schwall im Widget selbst. Erklärungen
    gehören in Sub-(c)-Modal von Modul 16 + Sub-(e)-Modal von Modul 15.
  - NIEMALS Pflicht-Module-Liste. Modul 17 prüft NICHT, ob Anbieter-
    Module da sind — es lauscht nur auf Events. Pflicht-Modul-Bezeugung
    ist Modul-16-Aufgabe.
  - Empfangsmodus-Prinzip: Modul 17 initiiert nichts, antwortet nichts
    ins Netz. Reine Page-Schicht-Render.

Hook-Punkte:
  Modul 02 (Spore) → dispatcht sbkim:alive einmalig nach init() +
    getOrCreateIdentity(). Bau-Sitzung 17 oder eigene Mini-Pflege.
  Modul 05 (Anastomose) → dispatcht sbkim:handshake pro abgeschlossenem
    Handshake (Sender + Empfänger). Bau-Sitzung 17 oder eigene Mini-
    Pflege.
  Modul 15 Sub (b) → dispatcht sbkim:postmessage pro eingehender
    message mit type:"sbkim/membrane/v1". Bau-Sitzung 17 oder eigene
    Mini-Pflege.
  Modul 15 Sub (e) → dispatcht sbkim:fremd-alert pro Ringbuffer-
    Neueintrag (Spiegelung des subscribe(cb)-Hooks). Bau-Sitzung 17
    oder eigene Mini-Pflege.
  Modul 16 (SBKIM-Siegel) → dispatcht sbkim:siegel-certified einmalig
    nach init() wenn isCertified()===true. Bau-Sitzung 17 oder eigene
    Mini-Pflege.
  Modul 00 (Doku-Fenster) → optional: 5-Klick-Geste am Such-Symbol
    triggert SbkimWidget.show() als Wiederherstellungs-Pfad (b).
    Eigene Folge-Pflege Modul 00 + Modul 17.

Risiken:
  Slot-Event-Drift (Mitigation: Bau-Sitzung 17 verdrahtet die fünf
  Pflicht-Events in einer Sitzung) · localStorage-Verlust (Mitigation:
  bewusste Akzeptanz, Default-Position als Fallback) · Eruda-Kollision
  (Mitigation: defaultCorner-Override) · Mobile-Footprint zu groß
  (Mitigation: Klärungs-Entscheidung Bau-Sitzung 17 ob 36 px Slots
  reichen) · Slot-Anti-Greenwashing-Verwechslung (Mitigation: Click
  öffnet Modal trotzdem, Modal-Text klärt) · Event-Spamming
  (Mitigation: Render-Drossel via requestAnimationFrame).

Geprüft: 2026-05-25 (Spec-Sitzung 17 — Vier-Slot-Live-Status-Dashboard
                     spezifiziert: Event-Bus-Schema fünf Pflicht-Events,
                     Layout 200×48 px Pille mit vier 40 px-Slots,
                     localStorage-Persistierung visible + position,
                     RAM-only VERKEHR-FIFO 10, Modal-Bridge zu Modul
                     15/16 unverändert, Sage-Page-Pfad bleibt erhalten,
                     KEIN Code, KEIN Modul-15/16-Eingriff, KEINE
                     Sage-Page-Änderung),
         2026-05-25 (Bau-Sitzung 17 — `src/modules/17_floating_widget.js`
                     voll angelegt, DispatchEvent-Hooks additiv in
                     Modul 02/05/15/16, ZERTIFIKAT_ASPEKTE-Eintrag
                     ergänzt, Panel 17 in tests/manual_check.html mit
                     10 Test-Knöpfen, Headless-Smoke 19/19 grün, Modul-
                     15-Regression 31/31 grün, **Modal-Bridge-
                     Entscheidung Option 1** (Proxy-DOM-Element im
                     Widget) — SbkimWidget.init() MUSS VOR
                     SbkimMembrane.init()/SbkimSiegel.init() im
                     Endknoten-Andocker stehen),
         2026-05-25 (Pflege UX — Sage-Page-Lampen-Stil: 10 px Lampen
                     in 28 px Click-Targets, kompakte Pille mit
                     `border-radius:999px`, Glow + `lamp-breath`-
                     Atmung, Drei-Buchstaben-Glyphe entfernt, SIEGEL
                     als Gold-Medaillon mit ★. Drei-Zustand-API
                     `minimize()`/`maximize()`/`isMinimized()` +
                     `sbkim_widget_minimized`-localStorage. Selbst-
                     check-Zeile auf init/show/hide/isVisible/minimize/
                     maximize/isMinimized/getPosition erweitert.
                     Headless-Smoke 26/26 grün, Modul-15-Regression
                     31/31 grün. KEIN Modul-15-/-16-Backend-Eingriff,
                     KEIN PROTOCOL_VERSION-Bump.),
         2026-05-26 (Pflege Sub-(e)-Visueller Slot-Render — Folge-Pflege
                     auf Sub-(e)-Sichttest-Bilanz vom 2026-05-26
                     Befund 1: sichtbarer SIEGEL-Slot bekommt jetzt
                     data-siegel-stufe-Attribut. Modul 17 liest initial-
                     Stufe via getSiegelStufe() aus
                     SbkimSiegel._meta.siegelStufe (Architektur-Pfad ii,
                     fail-soft Default "bronze"), Re-Setting beim
                     sbkim:handshake outcome:"established" auf "gold" +
                     600 ms Stufenwechsel-Klasse
                     .sbkim-widget-siegel-stufenwechsel (analog Modul
                     16 .stufenwechsel-gold). Bronze-CSS-Override:
                     filter saturate(0.6) brightness(0.85) am
                     Slot::before + .sbkim-widget-siegel-glyph;
                     Bronze-Hover mit Bronze-glow rgba(140,110,47,0.55).
                     Gold = Default-Render. _meta um Getter
                     siegelStufeRendered erweitert. Idempotent —
                     zweiter established-Handshake re-animiert nicht.
                     Headless-Smoke 32 → 36 Proben (32 Initial-Bronze,
                     33 Bronze→Gold + Animations-Klasse, 34 Klasse-
                     Cleanup nach 600 ms, 35 Idempotenz), 36/36 grün.
                     Modul-15-Regression 31/31 grün; Modul-16-Sub-(e)-
                     Regression 15/15 grün; node --check + 13 Inline-
                     Scripts grün. Panel 17 um Test 13 + 14 erweitert.
                     KEIN Modul-16-Eingriff, KEIN ZERTIFIKAT_ASPEKTE-
                     Eintrag, KEIN PROTOCOL_VERSION-Bump, KEIN Endknoten-
                     Eingriff.)

---

### Modul: 18_tool_pwa
Status: Code-Stub (Bau Sub (a) Vorab — Bau-Sitzung 18 Sub (a) Vorab
                 vom 2026-05-28, Pipeline-Phase A Schritt 5h.1:
                 `src/modules/18_tool_pwa.js` voll angelegt mit
                 Sub-(a)-Vorab-Surface gemäß Spec-Sitzung 18 Sub (a)
                 Vorab vom 2026-05-28 (init/openAndockTab/close/isOpen
                 + 13-Feld-_meta + zwei Errors ToolPwaNotReadyError +
                 ToolPwaInvalidUrlArgError + Selbstcheck-Zeile + Vier-
                 Schritt-Stepper-UI mit Lazy-Embedding-Re-Use und Drei-
                 Schichten-Match-Bars und Handshake-auto-close). Sub-
                 Bereiche (b)–(i) bleiben **Spec ausstehend** für Voll-
                 Spec 18 + Voll-Bau 18 (Pipeline-Schritt 5h.2, NACH
                 App-Freigabe). Sichttest ungeprüft — wartet auf Klaus'
                 Browser-Lauf Panel 18 Knöpfe 1–10. Headless-Smoke
                 `smoke_bau18_sub_a_vorab.mjs` 17/17 grün.)
Datei:  docs/components/18_tool_pwa.md (Karte — § Sub (a) Vorab final
        2026-05-28; Sub (b)–(i) Schablone aus Tafel-Spec-Pflege
        2026-05-26) ·
        src/modules/18_tool_pwa.js (existiert noch nicht — Bau-
        Sitzung 18 Sub (a) Vorab nach dieser Spec-Sitzung fällig) ·
        Endknoten-Andocker (sbkim/sbkim-init.js der Endknoten):
        nach Bau Sub (a) Vorab + Endknoten-Re-Migration ergänzt
        Klaus' Andocker den Aufruf
        `await SbkimToolPwa.init({endpoint, domain, domainKeywords,
        stammCategories, guestCategories, repoUrl, externalHubUrl?})`
        NACH `SbkimWidget.init` / `SbkimMembrane.init` /
        `SbkimSiegel.init`.

Bietet (öffentlich) — Sub (a) Vorab:
  init(options)                   → Promise<void>
                                    // Liest opts.endpoint + domain +
                                    // domainKeywords + optionale Felder.
                                    // Pflicht-Felder fehlen → console.warn
                                    // + _meta.ready=false; KEIN Throw.
                                    // Idempotent: zweiter Aufruf mit
                                    // identischen opts → no-op; zweiter
                                    // Aufruf mit veränderten opts → setzt
                                    // _meta neu (Pflicht-Feld-Wechsel
                                    // löst console.warn aus, kein Throw).
  openAndockTab(url?)             → Promise<void>
                                    // Sync vor await: validiert _meta.ready
                                    // === true (wirft sonst ToolPwaNotReady-
                                    // Error); wenn url übergeben, validiert
                                    // sie als String mit gültigem URL-
                                    // Konstruktor (wirft sonst ToolPwa-
                                    // InvalidUrlArgError sync).
                                    // Async: öffnet das Andock-Modal mit
                                    // Wizard-Schritt 1 (URL-Eingabe leer)
                                    // ODER Schritt 2 (Spore-Fetch mit url
                                    // vorbelegt) je nach Argument. Promise
                                    // resolved wenn Modal sichtbar gemountet
                                    // — NICHT erst nach Wizard-Abschluss.
                                    // Wenn Modal bereits offen mit gleicher
                                    // url → no-op; mit anderer url →
                                    // Wizard-Reset auf Schritt 2 mit neuer
                                    // URL.
  close()                         → void (sync)
                                    // Schließt das Andock-Modal. Bei
                                    // offenen Wizard-Eingaben (URL eingegeben
                                    // aber noch nicht handshaked):
                                    // Bestätigungs-Modal vor dem Schluss
                                    // („Andock-Wizard schließen? Eingaben
                                    // gehen verloren."). No-op wenn Modal
                                    // nicht offen.
  isOpen()                        → boolean (sync)
                                    // true wenn das Andock-Modal sichtbar
                                    // gemountet ist (_meta.modalOpen).
  _meta                           // Read-Anker für Tests + Multisuchfeld:
                                    //   ready:           boolean
                                    //   endpoint:        string  (aus opts)
                                    //   domain:          string
                                    //   domainKeywords:  string[]
                                    //   stammCategories: string[] (Default [])
                                    //   guestCategories: string[] (Default [])
                                    //   matchThreshold:  number  (Default
                                    //                    PROVIDER_MIN_MATCH
                                    //                    = 0.80; geclampt
                                    //                    auf [0, PROVIDER_MIN_MATCH])
                                    //   externalHubUrl:  string|null
                                    //                    (Default null; Sub
                                    //                    (a) Vorab macht
                                    //                    KEINEN Hub-Fetch
                                    //                    — Read-Anker für
                                    //                    Sub (i)+Multisuchfeld)
                                    //   repoUrl:         string  (Default
                                    //                    Auto-Erkennung)
                                    //   embeddingReady:  null|"loading"|
                                    //                    true|"failed"
                                    //                    (Modul-03-Lazy-Load-
                                    //                    Status)
                                    //   modalOpen:       boolean
                                    //   currentStep:     0|1|2|3|4
                                    //                    (0 = Modal zu;
                                    //                    1–4 = Wizard-Schritt)
                                    //   lastFetchUrl:    string|null
                                    //                    (URL aus letztem
                                    //                    openAndockTab()-
                                    //                    Aufruf)
                                    //   missingFields:   string[]
                                    //                    (Pflicht-Felder,
                                    //                    die bei init()
                                    //                    fehlten; leer wenn
                                    //                    ready=true)

  options-Form (init), Sub (a) Vorab-relevant:
    {
      // Pflicht-Felder (alle drei Voraussetzung für _meta.ready=true):
      endpoint:        string,
      domain:          string,
      domainKeywords:  string[],

      // Optional:
      stammCategories?:  string[],          // Default []
      guestCategories?:  string[],          // Default []
      matchThreshold?:   number,            // Default PROVIDER_MIN_MATCH (0.80);
                                            // wird auf [0, PROVIDER_MIN_MATCH]
                                            // geclampt; > 0.80 → console.warn +
                                            // Setzen auf 0.80
      externalHubUrl?:   string | null,     // Default null. Sub (a) Vorab
                                            // implementiert KEINEN Hub-Fetch;
                                            // nur Read-Anker für Sub (i) +
                                            // Multisuchfeld
      repoUrl?:          string,            // Default Auto-Erkennung
                                            // (location.origin + erstes
                                            // Pfad-Segment)
      mountTarget?:      HTMLElement | null,// Default document.body
      // Sub (b)–(i)-Felder (bindToSiegelSlot, enabledTabs, theme, …)
      // bleiben Voll-Spec 18-Aufgabe.
    }

Sub-Bereiche (b)–(i) Spec ausstehend (Voll-Spec 18 Pipeline-Schritt
5h.2, NACH App-Freigabe):
  - Sub (b) Bidirektionaler Sporen-Informationsaustausch (Heterokaryose)
  - Sub (c) Identitäts-Wechsel (Multi-Identität)
  - Sub (d) Backup-Export + -Import
  - Sub (e) Self-Apoptose (irreversibel)
  - Sub (f) Sporen NEU generieren
  - Sub (g) Re-Embedding
  - Sub (h) Manueller Handshake-Trigger aus Sibling-Liste
  - Sub (i) Spore-Discovery (Sage / Externer-Hub / Manuelle-URL)
  Voll-Spec 18 entscheidet die finale Surface; mögliche generische
  `open(subBereich?)`-Funktion / `enabledTabs`-Option / Tab-Container-
  Layout. Bis dahin ist `openAndockTab` der einzige Public-Trigger.

Nutzt — Sub (a) Vorab:
  SbkimSpore.getOwnSpore             Lesen — Wizard zeigt eigene Spore-
                                      Identität in Schritt 1 als Absender-
                                      Anker. Fail-soft: wenn nicht da,
                                      Wizard rendert Anker-Block ohne
                                      Identitäts-Anzeige, Schritte gehen
                                      trotzdem (Bauer-Verantwortung über
                                      opts.endpoint+domain+domainKeywords).
  SbkimSpore.verifyForeignSpore      Wizard-Schritt 2: Spore-Signatur-
                                      Verifikation der fetched Foreign-
                                      Spore. Bei Fail: Schritt-2-Fehlermeldung
                                      „Spore-Signatur ungültig", KEIN
                                      „Trotzdem"-Knopf.
  SbkimEmbedding.init / embedPassage Wizard-Schritt 3 LAZY-LOAD: erster
                                      Aufruf von openAndockTab() löst (bei
                                      Bedarf) Modul-03-Init aus. Re-Use,
                                      wenn SbkimEmbedding._meta.ready ===
                                      true bereits. User-sichtbarer
                                      Progress-Indicator Pflicht.
  SbkimMatch.matchDimensions         Wizard-Schritt 3: Match-Berechnung mit
                                      eigenem domainKeywords-Vektor vs.
                                      Foreign-Spore-domainKeywords. Liefert
                                      overall + drei Schicht-Werte
                                      (fachlich/prozess/skalierung) als
                                      Bar-Render-Quelle.
  SbkimMatch._meta.providerMinMatch  Read — Default für opts.matchThreshold.
  SbkimAnastomose.handshake          Wizard-Schritt 4: Handshake-Aufruf.
                                      Bei Erfolg → Modal-Erfolgs-Bestätigung
                                      + auto-Close nach 2 s. `sbkim:handshake`-
                                      Custom-Event-Dispatch erfolgt aus
                                      Modul 05 (Bau 17 hat den Hook gelegt);
                                      Modul 16 Sub (e) reagiert → Bronze→
                                      Gold-Wechsel.
  Browser-API: window.fetch          Wizard-Schritt 2: `fetch(url +
                                      "sbkim/spore.json")`. KEIN
                                      Cross-Origin-Auto-Retry. CORS-Fehler
                                      werden in Schritt 2 als Fehlermeldung
                                      gerendert mit „URL ändern"-Knopf.
  Browser-API: document.body         Self-Mount-Anker für das Modal
                                      (analog Modul 15/16/17). Override
                                      via opts.mountTarget möglich.

Storage — Sub (a) Vorab:
  KEINE eigenen Stores. Modul 18 Sub (a) Vorab ist RAM-only (Closure-
  State analog Modul 16). Wizard-Eingaben (URL, Foreign-Spore-Cache,
  Match-Score) leben nur in der Modal-Session und gehen beim Close
  verloren. Persistenter Sibling-Eintrag entsteht via SbkimAnastomose
  in Schritt 4 (Modul 05 schreibt sbkim_siblings_<slotKey>).
  Sub (b)–(i)-Stores (z.B. sbkim_backup_… / sbkim_search_history)
  bleiben Voll-Spec 18-Aufgabe.

Events — Sub (a) Vorab:
  feuert:    (keine eigenen) — Sub (a) Vorab dispatcht KEINE Custom-
             Events. Der `sbkim:handshake`-Event aus dem Wizard-
             Schritt-4-Handshake wird von Modul 05 dispatched (Hook-
             Bau-Sitzung 17), NICHT von Modul 18.
  reagiert:  (keine eigenen) — Sub (a) Vorab abonniert KEINE window-
             Custom-Events. Andock-Trigger erfolgt ausschließlich
             via öffentlich aufrufbares `openAndockTab()` (vom
             SIEGEL-Bronze-Modal-Knopf in Modul 16 Sub e, vom
             Multisuchfeld-Treffer-Andock-Knopf, oder programmatisch
             aus Endknoten-UI).

Fehlerverhalten — Sub (a) Vorab (verbindlich für Bau-Sitzung 18 Sub
(a) Vorab):
  Errors aus openAndockTab() (sync vor await):
    - ToolPwaNotReadyError(message)
        message enthält Liste der fehlenden init-Felder.
        Konvention analog Modul 15 MembraneNotReadyError.
    - ToolPwaInvalidUrlArgError(message)
        url-Argument ist kein valider URL-String (new URL(url) wirft).

  Wizard-interne Fehler (NICHT als Errors aus openAndockTab —
  als UI-Hinweise pro Wizard-Schritt):
    - Spore-Fetch 404 / non-JSON / CORS-Fehler
        → Schritt-2-Fehlermeldung, „Erneut versuchen" + „URL ändern".
    - SbkimSpore.verifyForeignSpore-Fail (Signatur-Mismatch)
        → Schritt-2-Fehlermeldung „Spore-Signatur ungültig",
          KEIN „Trotzdem"-Knopf.
    - EmbeddingLoadError (Modul 03 Lazy-Load fail)
        → Schritt-3-Fehlermeldung „Embedding-Modul lädt nicht —
          Netz prüfen?", „Erneut versuchen"-Knopf ruft
          SbkimEmbedding.init() nochmal.
    - DimensionsAllNullError aus matchDimensions
        → Schritt-3-Fehlermeldung „Match konnte nicht berechnet
          werden — Domain-Stichworte fehlen", KEIN „Trotzdem"-Knopf.
    - overall < matchThreshold
        → Schritt-3-Drei-Schichten-Darstellung mit Bar-Farben
          (grün ≥ matchThreshold; gelb ≥ SCHICHT_MIN_MATCH; rot
          < SCHICHT_MIN_MATCH); „Trotzdem andocken"-Knopf + Warnung.
    - SbkimAnastomose.handshake-Fehler
        → Schritt-4-Fehlermeldung mit konkretem Grund
          (Timeout / Schwelle / Signatur), „Erneut versuchen"-Knopf.

  init() wirft KEINE Errors. Fehlende Pflicht-Felder → console.warn
  + _meta.ready=false. Re-Init mit voll-Pflicht-Feldern ist der
  einzige Weg, _meta.ready auf true zu heben.

Selbstcheck:
  Beim Skript-Laden (synchron, vor jeglichem Aufruf):
    console.info("MODUL 18 TOOL-PWA bereit, Sub (a) Vorab, Funktionen: init/openAndockTab/close/isOpen");
  Konvention analog Modul 16/17 — keine Konstante in der Selbstcheck-
  Zeile. Sub (b)–(i)-Funktionen werden Voll-Spec 18 / Bau-Sitzung 18
  Voll-Bau in die Zeile aufnehmen.

Strikte Tabus — Sub (a) Vorab (verbindlich):
  - KEINE eigene Identität. Modul 18 ruft Modul 02 für alle
    Identitäts-Operationen.
  - KEIN automatisches Andock-Triggern. Nur auf explizite User-Geste.
  - KEIN Hub-Fetch in Sub (a) Vorab. externalHubUrl ist Read-Anker.
  - KEIN matchThreshold > PROVIDER_MIN_MATCH. Endknoten-Bauer kann
    reduzieren, aber nicht erhöhen.
  - KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump
    (Sub (a) Vorab ist RAM-only Render-Schicht).
  - KEIN PII im Wizard-Modal (foreign-Spore-Felder sind public —
    nodeId/domain/domainKeywords/categories; KEINE IP-Adressen,
    KEINE lokalen Identitäts-Daten, KEINE Geschwister-Liste
    angedockt vorher).

Hook-Punkte (nur Verweis, nicht in Sub (a) Vorab implementiert):
  - Modul 16 Sub (e) Bronze-Hinweis-Block ruft fail-soft
    `typeof window.SbkimToolPwa?.openAndockTab === "function"`
    → ruft `SbkimToolPwa.openAndockTab()` (ohne url) bei Klick.
    Hook existiert seit PR #180 (Bau 16 Sub e).
  - Multisuchfeld (Spec-Sitzung Multisuchfeld, Pipeline-Schritt
    5i.2, Schwester-Brief BRIEF_SPEC_SUCHFELD_MULTI.md) ruft
    `SbkimToolPwa.openAndockTab(treffer.url)` aus Extern-/Hub-
    Treffer-Knopf.
  - Sub (i) Spore-Discovery (Voll-Spec 18) liest
    `SbkimToolPwa._meta.externalHubUrl` als Hub-Endpunkt und ruft
    `SbkimToolPwa.openAndockTab(eintrag.endpoint)` pro Hub-Eintrag.

Risiken (Karte 18 § Risiken — werden in Voll-Spec 18 vervollständigt):
  - URL-Spoofing — User tippt eine URL ein, deren spore.json
    gefälscht ist. Mitigation: Schritt 2 ruft
    SbkimSpore.verifyForeignSpore (Signatur-Check), Fail kein
    „Trotzdem"-Knopf.
  - Embedding-Modul-Lazy-Load schlägt fehl bei schlechter Netz-
    Verbindung. Mitigation: Schritt 3 zeigt Time-out-Warnung,
    Retry-Knopf.
  - Match-Schwelle-Override (matchThreshold reduziert) verleitet
    User zum Andocken zwischen sinnlosen Domain-Paaren. Mitigation:
    matchThreshold > PROVIDER_MIN_MATCH ist verboten (Sanity-Check);
    Drei-Schichten-Darstellung macht die Schwäche pro Schicht
    sichtbar.
  - Modal-Konflikt mit gleichzeitig offenem Modul-16-Erklär-Modal.
    Mitigation: Bau-Sitzung 18 Sub (a) Vorab entscheidet die
    z-index-Hierarchie (Vorschlag analog Modul 17 9999, Modul 16
    Modal bleibt unter Modul 18, oder Modul 18 schließt Modul 16
    bei Open — Bau-Sitzung 18 Sub (a) Vorab klärt).
  - Sub (b)–(i)-Wechselwirkung — z.B. Identitäts-Wechsel während
    offener Sub (a)-Wizard-Sitzung. Mitigation: Sub (a) Vorab
    spec-frei (Voll-Spec 18 löst). Sub (a) Vorab-Sitzung lässt das
    explizit als offene Frage stehen.

Geprüft: 2026-05-28 (Spec-Sitzung 18 Sub (a) Vorab — Sub (a)
                     Andocken-Pfad voll spezifiziert; Sub (b)–(i)
                     ausdrücklich „Spec ausstehend" für Voll-Spec 18.
                     Karte 18 § Sub (a) gefüllt; INTERFACES.md § 1
                     Modul 18 als neuer Eintrag angelegt. status.json
                     Modul 18 bleibt score:"schablone".
                     KEIN PROTOCOL_VERSION-/DB_VERSION-/
                     BACKUP_FORMAT_VERSION-Bump, KEIN Modul-Code in
                     src/, KEIN Endknoten-Eingriff, KEINE Tafel-
                     Umsortierung CLAUDE.md (eigene Folge-Pflege-
                     Sitzung mit Klaus' OK für 5h → 5h.1+5h.2),
                     KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Spec, kein
                     Sicherheits-Modul-Update).
                     Brief: docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md.)
       · 2026-05-28 (Bau-Sitzung 18 Sub (a) Vorab —
                     src/modules/18_tool_pwa.js voll angelegt mit
                     Surface init+openAndockTab+close+isOpen+_meta
                     (13 Felder, defensive Kopie pro Lese-Zugriff) +
                     zwei Errors ToolPwaNotReadyError +
                     ToolPwaInvalidUrlArgError (Factory-Stil) +
                     Selbstcheck "MODUL 18 TOOL-PWA bereit, Sub (a)
                     Vorab, Funktionen: init/openAndockTab/close/
                     isOpen". init() fail-soft (Pflicht-Felder fehlen
                     → console.warn + ready=false, KEIN Throw) +
                     Idempotenz + Pflicht-Feld-Sanity-Check.
                     matchThreshold > 0.80 → clamp + warn.
                     externalHubUrl Read-Anker, KEIN Hub-Fetch.
                     repoUrl Auto-Erkennung. openAndockTab(url?) mit
                     Sync-Validierung vor await (ToolPwaNotReadyError
                     + ToolPwaInvalidUrlArgError). Modal Self-Mount in
                     document.body mit Self-Mount-Observer-Fallback.
                     Vier-Schritt-Stepper-UI (URL/Spore/Match/
                     Handshake) mit Lazy-Embedding (Re-Use bei
                     SbkimEmbedding._meta.ready===true ODER
                     isReady()===true), Drei-Schichten-Match-Bars
                     fachlich/prozess/skalierung via matchDimensions,
                     „Trotzdem"-Knopf bei overall<matchThreshold (KEIN
                     bei DimensionsAllNullError ODER Signatur-Fail),
                     Handshake auto-close 2 s. close() mit confirm()-
                     Bestätigung bei offenen Wizard-Eingaben. Inline-
                     CSS via <style>-Inject (Konvention Modul 17).
                     index.html um <script>-Tag vor sbkim-init.js
                     erweitert; KEIN SbkimToolPwa.init()-Aufruf in
                     Sage-Page (Sub (a) Vorab ist Endknoten-Pflicht).
                     Panel 18 in tests/manual_check.html mit 11
                     Knöpfen. Headless-Smoke smoke_bau18_sub_a_vorab.mjs
                     17/17 grün. Regression smoke_bau15b 31/31,
                     smoke_bau16_sub_e_bronze 16/16, smoke_bau17 36/36
                     grün. node --check src/modules/18_tool_pwa.js
                     grün, alle 14 inline-script-Blöcke in
                     manual_check.html grün. status.json Modul 18 von
                     schablone auf stub gehoben (Konvention analog
                     Modul 17). update_puls_pie.py ausgeführt.
                     Sub (b)–(i) bleiben Spec ausstehend für Voll-
                     Spec 18 + Voll-Bau 18 Pipeline 5h.2 NACH App-
                     Freigabe. Sichttest ungeprüft — wartet auf Klaus'
                     Browser-Lauf Panel 18 Knöpfe 1–10. KEIN
                     PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-
                     Bump (RAM-only Render-Schicht), KEIN Endknoten-
                     Eingriff (Re-Migration ist eigene Folge-Sitzung
                     pro Endknoten-Repo), KEIN ZERTIFIKAT_ASPEKTE-
                     Eintrag (Modul 18 ist Wartungs-/Andock-Schicht,
                     kein Sicherheits-Modul), KEINE Tafel-Umsortierung
                     CLAUDE.md.)
       · 2026-05-28 (Sichttest-Nachzug Bau 18 Sub (a) Vorab — Klaus'
                     Live-Sichttest Panel 18 Knöpfe 1–10 alle grün am
                     Galaxy Tab S6 (DeX-Chrome). Test 6 hat live gegen
                     https://lausiklauskn-png.github.io/Mein-Mixarium/
                     sbkim/spore.json gefetched + verifyForeignSpore
                     durchgelaufen + Foreign-Spore-Preview vollständig
                     gerendert (Knoten-ID B7Fke9CYTR1BrC3x…, sieben
                     Domain-Stichworte, alle Stamm-/Gast-Kategorien).
                     Erster produktiver Cross-Knoten-Spore-Read aus
                     Modul 18. Test 8 confirm()-Bestätigungs-Dialog
                     bei offenen Wizard-Eingaben korrekt ausgelöst.
                     Drei Screenshots als Beleg in
                     docs/sessions/archiv/screenshots/. Pipeline-Phase
                     A Schritt 5h.1 abgeschlossen. Folge: Endknoten-
                     Re-Migration MR + MM als eigene Sitzungen pro
                     Endknoten-Repo. Übergabe: docs/sessions/archiv/
                     2026-05-28_sichttest-bau-18-sub-a-vorab.md.)

---

### Modul: 20_schluessel_safe
Status: code-stub (Bau-Sitzung 2026-06-20, Headless-Smoke 19/19 grün;
        Sichttest durch Klaus ausstehend). Spec: docs/components/
        20_schluessel_safe.md.
Datei:  src/modules/20_schluessel_safe.js · docs/components/20_schluessel_safe.md

Zweck:  Lokal verschlüsselter "Safe" für die SBKIM-Identität (nodeId +
        privater Knotenschlüssel + Spore) gegen Identitäts-Wandern.
        NAME bewusst "Safe" (NICHT "Tresor", Klaus 2026-06-20) — zur
        Abgrenzung vom JSON-Backup-"Tresor" der Endknoten (Mein-Rezeptbuch/
        Mein-Mixarium) und BLPs eigenem "Tresor"/Geheim-Fach.
        Krypto-Kern wiederverwendet Modul 02 (exportBackup/importBackup,
        PBKDF2-SHA256 ≥600k + AES-GCM-256); der Safe speichert NUR den
        verschlüsselten Backup-Blob (Store sbkim_safe, Modul 01 ensureStore).
        Recovery via Shamir's Secret Sharing ÜBER DAS PASSWORT (GF(256),
        k von N, Default 2 von 3). Reines Lokal-Modul, KEIN Netz.
        WIRD AUF ABRUF geöffnet (open(), Einstellungen/Tool), NICHT beim
        Seitenstart — die App startet immer normal.

Bietet (öffentlich):
  init(options?)            → Promise<void>   // idempotent; autoPrompt Default
                                              // false (KEIN Startup-Modal).
  open()                   → Promise<void>   // zeigt Einrichten-/Entsperr-Modal
                                              // AUF ABRUF (Host-Einstellungen).
  hasVault()               → Promise<boolean> // Blob im Store vorhanden?
  isUnlocked()             → boolean (sync)
  createVault(password)    → Promise<{ shares: string[] }>
                                              // exportBackup → Store; Shamir-
                                              // Anteile (N Stück) zurück.
  unlock(password)         → Promise<boolean> // importBackup(force) restauriert
                                              // Identität; false bei falschem PW.
  lock()                   → void
  recoverPassword(shares)  → string | null    // Shamir-Kombination ≥ k Anteile.
  _meta                    // { storeName, minPasswordLen, ready, unlocked,
                           //   shamirN, shamirK }

options-Form (init):
  {
    autoPrompt?:    boolean,   // Default FALSE — kein Modal beim Seitenstart;
                               // true nur, wenn ein Host es bewusst will.
    shamirN?:       number,    // Default 3
    shamirK?:       number,    // Default 2 (2 von 3, Klaus 2026-06-20)
    mountSelector?: string,
  }

Fehler (Factory-Stil, .name gesetzt): WeakPasswordError,
  SporeNotAvailableError, StorageNotAvailableError, VaultExistsError,
  InvalidShareError. (unlock fail-soft: false statt Throw bei falschem PW.)

Garantien:
  - Kein Klartext-Schlüssel at rest (nur AES-GCM-Blob im Store).
  - Passwort, Schlüssel und Shamir-Anteile verlassen NIE das Gerät / das Netz.
  - Speichert NUR SBKIM-Identität — keine App-/PII-Daten (Datenschutz, BLP).
  - Shamir deterministisch: split→combine round-trip, < k Anteile reichen nicht.
  - Verlust von Passwort UND ausreichend Anteilen → nicht wiederherstellbar
    (by design, Zero-Knowledge, kein Hintertür-Server).
  - Anteil-Format: "v1.<index>.<base64url(bytes)>".

Geprüft: Headless-Smoke tests/smoke_bau20_safe.mjs 19/19 (Shamir 2/3 +
  Safe create/unlock/recover mit gemocktem Modul 02 + In-Memory-Storage).
  Browser-Sichttest (Modal-UI) durch Klaus ausstehend.

---

### Modul: 22_such_widget
Status: Code-Stub (Bau-Sitzung 22 vom 2026-06-21, **Increment 1 — Widget-Shell**;
        Headless-Smoke 55/55 grün; Browser-Sichttest durch Klaus ausstehend).
        Schritt 2 des SBKIM-Such-Werkzeugs (nach Modul 21 Spracheingabe).
Datei:  src/modules/22_such_widget.js · docs/components/22_such_widget.md ·
        Skript-Load in index.html (KEIN Auto-Init) · Panel 22 in
        tests/manual_check.html

Zweck:  SEPARATES, frei bewegliches Floating-Such-Tool, self-mountend in
        <body>. KLEIN im Ruhezustand (🔍-Blase), wächst NUR bei Interaktion
        zum Eingabe-Panel mit eigenem Textfeld. Leicht transparent.
        KOMPONIERT vorhandene Module (baut keine eigene Such-Logik):
          1. Sprache   — Modul 21 SbkimSpeech (Sprach-Knopf → Text ins Feld).
          2. Vorfilter — Modul 04 queryLocal + Modul 03 Embedding (lokal,
                         server-los, IMMER).
          3. Richter   — Modul 04 hybridMatch (opt-in, BYOK).
          4. Fail-soft — kein Schlüssel/Richter → Vorfilter gilt; nie
                         Eintritts-Barriere.
        Render-/Kompositions-Schicht, NICHT protokoll-aktiv. Drag-/Mount-/
        Persistenz-Mechanik aus Modul 17 wiederverwendet (Modul 17 selbst
        unangetastet). Increment 2 (PWA-/Suchfeld-Kopplung über Modul 15
        Membran — Host lesen + aus dem Suchfeld interagieren) ist eine
        eigene Folge-Sitzung; in Increment 1 ist _meta.coupled === false.

EU-Politik (einheitlich für Sprach-Engine UND Richter, Klaus 2026-06-21):
  - "frei"    (Default) — beide Sprach-Engines (browser+eu), Richter euOnly
                          wählbar (Default false). Sage/Mixarium/Rezeptbuch.
  - "bindend" — nur EU-Sprach-Engine, Richter euOnly:true erzwungen (BLP).

Bietet (öffentlich, window.SbkimSearchWidget):
  init(options?)     → Promise<void>   // Self-mountet das Widget in <body>,
                                        // liest localStorage, setzt EU-Politik
                                        // + Korpus + Richter-Optionen.
                                        // Idempotent (zweiter Aufruf re-appliziert).
  show()             → void (sync)      // einblenden
  hide()             → void (sync)      // programmatisch ausblenden (KEIN UI-Knopf ruft
                                        //   das mehr — das X parkt via dockToTop). Ein
                                        //   versteckter Zustand wird beim nächsten init()
                                        //   geheilt → Widget startet immer sichtbar.
  isVisible()        → boolean (sync)   // aus DOM-State
  expand()           → void (sync)      // klein → groß (Mittelpunkt bleibt, in den
                                        //   Viewport geklemmt)
  collapse()         → void (sync)      // groß → klein (Mittelpunkt bleibt; minimiert
                                        //   an Ort und Stelle, springt nicht in die Ecke)
  dockToTop()        → void (sync)      // X-Knopf: als Lupe oben rechts „in der Navleiste"
                                        //   parken. Versteckt NICHT — bleibt sichtbar +
                                        //   antippbar (Klaus 2026-06-21: X = weg war ein Bug).
                                        //   LEERT den Such-Inhalt (Frage/KI-Antwort/Kontext/
                                        //   Treffer) für frischen Start; Minimieren (–) BEHÄLT
                                        //   ihn. Tresor bleibt unberührt (Identität, kein Inhalt).
  isExpanded()       → boolean (sync)
  enterFullscreen()  → void (sync)      // Vollbild-Modus (⛶, 2026-06-22): das Panel füllt
                                        //   den ganzen Viewport — zweite Anzeige DERSELBEN
                                        //   Treffer (kein Kern-Umbau). Setzt expanded.
  exitFullscreen()   → void (sync)      // zurück zum Panel (Position/Größe wiederhergestellt).
  toggleFullscreen() → void (sync)      // ⛶-Knopf im Kopf. NICHT persistiert — die Pille
                                        //   bleibt Standard-Start (kein Auto-Vollbild).
  isFullscreen()     → boolean (sync)
  // ---- Merken-Liste (Klaus 2026-06-22; nur Text+Link, localStorage, kein Protokoll) ----
  openMerkliste()    → void (sync)      // 📌-Knopf im Kopf: Merkliste-Overlay (gemerkte
                                        //   Treffer, GRUPPIERT unter der Suchfrage als Überschrift).
  closeOverlays()    → void (sync)      // Detail-Karte / Merkliste schließen ("Zurück").
  getMerkliste()     → Object (sync)    // defensive Kopie { "<suchfrage>": [{titel,url,text,source,addedAt}] }
  clearMerkliste()   → void (sync)      // ganze Merkliste leeren (localStorage-Eintrag weg).
  reload()           → void (sync)      // App aktualisieren: Cache Storage leeren + Service-Worker
                                        // abmelden, dann neu laden (holt neueste Version). Nur als
                                        // 🔄-Knopf sichtbar bei init({reloadButton:true}) — z.B. such-tool/.
                                        //   Pro Treffer ein 📌-Haken; Klick auf einen Treffer
                                        //   öffnet die Tool-eigene Detail-Karte ([📌 Merken] /
                                        //   [↗ Seite öffnen im neuen Tab]). Badge je Art (App/Knoten/Netz).
  getPosition()      → PositionSnapshot // defensive Kopie {corner,offsetX,offsetY,x,y}
  getSize()          → {panelWidth,resultsHeight}  // px oder null (CSS-Default)
  setSize(opts)      → void             // {panelWidth?,resultsHeight?} px; null=Reset;
                                        // geklemmt (240…760 / 120…0.72·vh) + persistiert.
                                        // Ziehbar am Resize-Griff unten rechts (2026-06-22).
  setCorpus(corpus)  → void             // lokaler Such-Korpus
                                        // (Array<{label,text?,passageVec,anchorId?}>);
                                        // reicht an SbkimMatch.setLocalCorpus durch.
  search(text)       → Promise<SearchResult>  // komponierte Suche, auch direkt
                                        // aufrufbar (Tests).
  // ---- Stufe B · B1 Widget-Tresor (self-contained, portabel; Krypto wie Modul
  //      20/02: PBKDF2-SHA256 ≥600k → AES-GCM-256, Recovery Shamir 2-von-3) ----
  hasVault()         → boolean (sync)   // localStorage sbkim_search_widget_vault da?
  isVaultUnlocked()  → boolean (sync)
  createVault(password, secrets) → Promise<{shares: string[]}>  // secrets = {provider:key};
                                        // verschlüsselt + speichert, gibt 3 Shamir-Anteile zurück.
                                        // WeakPasswordError (<8) / VaultExistsError.
  unlockVault(password) → Promise<boolean>   // Schlüssel in RAM; falsches Passwort → false (kein Oracle).
  lockVault()        → void (sync)      // RAM-Schlüssel löschen.
  deleteVault()      → void (sync)      // Tresor aus localStorage entfernen + lock.
  setVaultSecret(password, provider, key) → Promise<boolean>  // im entsperrten Tresor neu verschlüsseln.
  recoverVaultPassword(shares) → string|null  // ≥2 Anteile → Passwort (rein lokal).
  buildPrompt(query, context?) → string (sync)  // KI-Such-Brücke Stufe A: Prompt aus
                                        // Frage + optionalem Schärfen-Kontext (Code-Block-
                                        // Regel, breites Sammeln/Recall → saubere URLs).
  parseAiAnswer(text)→ Array (sync)     // eingefügte KI-Antwort → [{titel,url,quelle,text}];
                                        // verträgt Code-Fences, säubert URL-Müll; [] wenn kein Array.
  setAiAnswer(text)  → boolean (sync)   // KI-Antwort übernehmen; true wenn gültige Quellen.
                                        //   Nächste search() sortiert sie als source:"internet".
  resultsAsText()    → string (sync)    // ALLE gerankten Treffer als nüchterner Text-Block
                                        //   (Nr · Quelle · Prozent · Titel · URL · Snippet);
                                        //   🖨-Knopf in der Treffer-Liste kopiert ihn (Klaus-Relay).
  autoSearch(query)  → Promise<boolean> // Stufe B · B2 (Probe): direkter Browser-API-Aufruf mit
                                        //   Web-Suche → parseAiAnswer → sortieren. NUR Claude
                                        //   (api.anthropic.com + anthropic-dangerous-direct-browser-
                                        //   access + web_search-Tool). Schlüssel aus Tresor/init.
                                        //   Fail-soft (CORS/Key/Netz → Hinweis + false, kein Throw).
  aiAutoSupported()  → boolean (sync)   // ob der gewählte Anbieter den Auto-Aufruf kann (z.Z. claude).
  _meta              // { euPolicy, corpusSize, corpusReady, nodeCorpusSize, areas,
                     //   richterOn, hasSearxng, webEngine, aiProvider, aiProviders, hasPastedAi,
                     //   visible, expanded, fullscreen, merkCount, merkOverlayOpen, detailOverlayOpen,
                     //   widgetMounted, lastSearchMode, searchCount, hasApiKey, coupled:false }
                     //   localStorage zusätzlich: sbkim_search_widget_merkliste (Text+Link, gruppiert)
                     //   + sbkim_search_widget_lastsearch (letzte Suche: Frage+Treffer, Reload-Schutz,
                     //     beim Mount automatisch wiederhergestellt; ✕/dockToTop löscht sie)

options-Form (init):
  {
    euPolicy?:    "frei" | "bindend",   // Default "frei"
    corpus?:      Array<{label,text?,passageVec,anchorId?}>,   // App-Bereich-Korpus
    apiKey?:      string,               // BYOK Richter-Schlüssel (opt-in)
    provider?:    "mistral"|"claude"|"openai"|"local",  // Default "mistral"
    euOnly?:      boolean,              // nur bei euPolicy:"frei" relevant (Default false);
                                        // bindend erzwingt true
    queryLabel?:  string,               // Knoten-Name für die Attestation
    k?:           number,               // Top-k Vorfilter (Default 5)
    prepareCorpus?: () => Promise<Array<corpusEntry>>,  // LAZY App-Korpus-Provider (einmalig,
                                        // Embedding via Modul 03, setCorpus + cacht; fail-soft).
    // ---- Mehrfach-Suche (Bau 22 Mehrfach 2026-06-21) ----
    areas?:       { app?:boolean, knoten?:boolean, internet?:boolean },  // Bereichs-Default
                                        // (Default app:true, knoten:false, internet:false)
    richter?:     boolean,              // KI-Richter an/aus. DEFAULT FALSE (gratis, rein
                                        // semantisch). AN nur sinnvoll mit apiKey.
    searxngUrl?:  string,               // SearXNG-Instanz für Web-Treffer. Leer → Internet =
                                        // „↗ neuer Tab"; gesetzt → Re-Ranker.
    webSearchEngine?: "duckduckgo"|"startpage"|"ecosia"|"brave"|"google"|"bing"|"searxng",
                                        // Suchmaschine für den Neuer-Tab-Weg (frei wählbar,
                                        // Default "duckduckgo"; im Widget umstellbar, persistiert).
                                        // "searxng" nimmt die eigene Instanz aus searxngUrl,
                                        // sonst eine öffentliche Standard-Instanz (searx.be).
    aiProvider?:  "chatgpt"|"claude"|"gemini"|"perplexity",
                                        // KI-Such-Brücke (Default "chatgpt"). Gemini 2026-06-21 dazu
                                        // (stark in semantischem Verstehen + Mehrsprachigkeit/Deutsch).
                                        // Mistral + Aleph Alpha bewusst RAUS (Aleph Alpha ohne Web-
                                        // Suche, Mistral schwach). euPolicy:"bindend" fällt auf alle
                                        // zurück, solange es keinen web-such-fähigen EU-Anbieter gibt.
    nodeCorpus?:  Array<corpusEntry>,            // Knoten-Bereich-Korpus (verbundene Knoten)
    prepareNodeCorpus?: () => Promise<Array<corpusEntry>>,  // LAZY Knoten-Korpus-Provider
    defaultCorner?: "top-left"|"top-right"|"bottom-left"|"bottom-right",  // Default "bottom-right"
    defaultOffset?: { x:number, y:number },                              // Default {x:16,y:16}
    allowDrag?:     boolean,            // Default true
    rememberHidden?: boolean,           // Default true
    startExpanded?: boolean,            // Default false (Ruhezustand klein)
    reloadButton?:  boolean,            // Default false. true → 🔄-Knopf im Kopf (App
                                        // aktualisieren: Cache + SW leeren, neu laden). In such-tool/ an.
    zIndex?:        number,             // Default 9985 (unter Modul 17 9990 + Modals 9999)
  }

SearchResult (Rückgabe von search()/runMultiSearch):
  {
    mode:    "leer" | "semantisch" | "richter" | "modul-04-fehlt" | "fehler",
             // semantisch = reine Cosinus-Suche (Richter aus ODER kein Key ODER
             //   Richter fail-soft); richter = KI-Urteil; leer = keine Treffer/
             //   kein Bereich; modul-04-fehlt = Matcher fehlt; fehler = unerwartet.
    treffer: Array<{ label, score, anchorId, source, text?, snippet?, url?, begruendung? }>,
             // source ∈ "app"|"knoten"|"internet"; url = Link (Knoten/Internet);
             // snippet = Inhalts-Text (KI-/Web-Beschreibung), in der UI unter dem
             //   Titel gezeigt; begruendung nur bei mode:"richter".
             // Bis zu MAX_RANK (100) Kandidaten werden semantisch gerankt und
             //   zurückgegeben; die UI zeigt die ersten 10, der ▾-Pfeil je 10 mehr.
             //   score wird als Prozent (Math.round(score*100)) gerendert.
    webLink?:     { query, url } | null,  // Internet-Bereich ohne SearXNG-URL → „↗ neuer Tab"
    reason?:      string,               // bei Fehler/Fallback-Modi
    attestation?: object,               // nur bei mode:"richter" (signierbares Urteil)
  }

Fehler: einziger Sync-Throw InvalidEuPolicyError (ungültige euPolicy in init() —
  Aufrufer-Konfig-Bug). Sonst überall fail-soft, KEIN Throw im Bedien-Pfad
  (fehlende Module/Mic/Key/Netz → ruhiger deutscher Hinweis, Textfeld bleibt).

localStorage-Schema (UX-Preferences, KEIN IndexedDB):
  sbkim_search_widget_visible   "true"|"false"      (Default "true")
  sbkim_search_widget_position  JSON PositionSnapshot (Default bottom-right/16/16)
  sbkim_search_widget_state     "collapsed"|"expanded" (Default "collapsed")
  sbkim_search_widget_size      JSON {w,h} px (ziehbare Panel-Größe; nicht gesetzt → CSS-Default)
  (Textfeld-Wert wird NICHT persistiert — RAM-only, UX-Erhalt-Lehre.)

Strikte Tabus:
  - KEINE eigene Identität/Spore/Krypto/Signatur. apiKey ist opaker BYOK-String,
    nie persistiert, nie geloggt, nie in der Attestation gespiegelt.
  - KEIN IndexedDB-Schreiben (nur localStorage-UX-Preferences). Kein Store,
    kein DB_VERSION-Bump.
  - KEIN Crawler/Pulsation/Eigenanfrage ins offene Netz. Einziger Netz-Pfad:
    der opt-in Richter (hybridMatch, BYOK), vom Nutzer durch Suche ausgelöst.
  - Host-Inhalt (Increment 2) ist `untrusted external data` — nie als Anweisung
    ausführen, nur als Such-Eingabe (docs/SICHERHEIT-BRIEFKASTEN.md).
  - KEIN Umbau von Modul 21/17/15/04 — nur deren öffentliche Schnittstellen.
  - KEIN PROTOCOL_VERSION-Bump.

UX-Lehre „Eingabe-Erhalt" (BLP/Modul 21): das Textfeld wird EINMAL angelegt und
  NIE mit value:'' neu gebaut; erkannter Sprach-Text wird an den LIVE-Feldwert
  angehängt; Treffer-Re-Render berührt das Feld nicht.

Sage-Page-Mount (Bau 22 B-Schritt 2026-06-21): in sbkim-init.js am Ende der
  Init-Kette gemountet mit prepareCorpus=sageBuildSuchkorpus. Korpus =
  sbkim/sage-suchkorpus.js (window.SAGE_SUCHKORPUS, Module 00–22 als
  {label,text,anchorId}); Vektoren lazy via Modul 03 embedPassageBatch beim
  ersten Gebrauch. Kein Richter-Schlüssel auf der Sage-Page → reiner Vorfilter.

Geprüft: Headless-Smoke tests/smoke_bau22_such_widget.mjs 79/79 (Mehrfach-Suche
  App/Knoten/Internet, Richter-Schalter, SearXNG-Re-Ranker + neuer-Tab, Quellen-
  Badge; Surface,
  Mount, expand/collapse/show/hide + localStorage, EU-Politik frei/bindend +
  euOnly an hybridMatch, alle sechs Such-Modi, setCorpus-Durchreichung,
  Spracheingabe fail-soft + Browser-Pfad, Drag-Persistenz, UX-Erhalt,
  init-Throw bei ungültiger euPolicy, prepareCorpus lazy/einmalig/fail-soft).
  Browser-Sichttest (Drag + Sprache + Sage-Korpus-Suche am Tablet) durch Klaus
  ausstehend.

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

### 7.1 Hybrid-Match-Richter-Ergänzung (Bau 04.D, 2026-06-20)

`hybridMatch` (§ 1 Modul 04) hebt den Stufe-B-Keim `explainMatchLLM` vom
**Erklärer** zum **Richter** über die Vorfilter-Kandidaten hoch
(`docs/HYBRID-MATCH-KONZEPT.md`). Die vier Ehrlichkeits-Sätze von § 7
gelten **wörtlich** auch hier — `hybridMatch` ist dieselbe opt-in-/BYOK-/
fail-soft-Schicht, nur mit Urteils- statt Erklär-Rolle. Drei Präzisierungen:

1. **Der Vorfilter bleibt das Rückgrat.** Der lokale, server-lose Cosinus
   (`match` / `queryLocal`) liefert die Kandidaten und entscheidet allein
   weiter, wenn der Richter aus ist. `hybridMatch` ändert **keinen**
   Vorfilter-Default (keine Schwellen-Änderung, kein Whitening-Flip — das
   ist der separate Anisotropie-Hebel, koordinierte Klaus-Entscheidung).
2. **Anbieter-Agnostik + EU-Default.** Modul 04 hartcodiert keinen
   Schlüssel; der Knoten wählt Claude / Mistral / OpenAI / einen
   selbst-gehosteten (`provider:"local"` + `endpoint`). DSGVO-Knoten
   bekommen per `options.euOnly` den EU-Default „mistral". Bidirektional
   urteilt jede Seite mit **ihrer eigenen** KI; `bidirectionalVerdict`
   kombiniert die zwei Urteile (Default streng „both", Klaus 2026-06-20).
3. **Bezeugung, nicht Selbst-Signatur.** Der Erfolgs-Pfad liefert ein
   serialisierbares `attestation`-Objekt (Anbieter-Marker + Datum +
   Urteil). Der **Aufrufer** signiert es via Modul 02 und legt es in die
   Inbox — Modul 04 hält keinen Identitäts-Schlüssel und signiert nie
   selbst. Empfangsmodus bleibt gewahrt: der einzige Netz-Aufruf ist der
   bewusst konfigurierte Richter-Call, kein Default ins offene Netz.

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

**Stand 2026-05-22 (Folge-Pflege „Versions-Bump-Race in openProbe"):**
Klaus' Sichttest 2026-05-21 (Sichttest-Folge zur Bau-Sage-Page-
Refactor-Sitzung) zeigte einen Race auf der `openProbe`→`init`→
`ensureStore`-Achse innerhalb derselben Tab-Session: `db.close()` ist
synchron in JS, IndexedDB schließt die Verbindung intern asynchron,
ein direkt nachfolgender `indexedDB.open(name, newVersion)` trifft
auf eine noch nicht aufgelöste Vorgänger-Verbindung und hängt in
`onblocked` (Fehler-Message `ensureStore('sbkim_meta') Versions-Bump
blockiert — ein anderer Tab haelt die DB offen und ignoriert
onversionchange.`). Manifestation nur in `tests/manual_check.html` bei
wiederholtem Modul-Wechsel — Endknoten-PWAs nicht betroffen (nur EINE
`init()`-Kette pro Tab-Lebenszeit). Die Folge-Pflege vom 2026-05-22
hat den Pfad additiv aufgelöst: neuer modul-lokaler Helper
`closeConnectionAndWait(db)` (wartet auf `db.onclose` ODER 50-ms-
Timeout-Fallback) ersetzt synchrones `db.close()` an drei Stellen
(beide `probedDb.close()` in `init`, der `db.close()` vor dem
Versions-Bump in `ensureStore`); zusätzlich installiert `openProbe`
jetzt den `attachVersionChangeHandler` AUF der Probe-Verbindung
(vorher: nur `init`-Initial-Verbindung und `ensureStore`-Bump-
Verbindung). Race-frei-Garantie siehe § 1 Modul 01 Bietet-Block (init-
Garantien-Block aus Pflege „Versions-Bump-Race in openProbe"). KEIN
INTERFACES-Bietet-/Storage-/Fehler-Block-Eingriff, KEIN `ensureStore`-
Verhalten-Bruch von außen, KEIN `DB_VERSION`-Bump.

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
| 2026-05-20 | Bau-Sitzung 05.Y transparenter Slot-Pfad in Modul 05 | Erste der drei Konsumenten-Bauten (05.Y / 06.Y / 07.Y) der Bau-Sitzungs-Brief-Pipeline aus Brief 99. Brief BAU_05Y_TRANSPARENT_SLOT_PFAD (PR #113 gemerged 2026-05-20, `main` `700f062`) als Spec-Vorlage. Bau 05.Y nutzt Bau 02.Y's Multi-Identitäts-API (`getActiveIdentityKey` / `listIdentities` / `getOrCreateIdentity`) und Bau 01.Y's `ensureStore`. **§ 1 Modul 05 Geprüft-Zeile** um „2026-05-20 (Bau 05.Y transparenter Slot-Pfad)" erweitert. KEIN Vertrags-Eingriff in Bietet / Storage / Fehlerverhalten / Garantien — der Vertrag steht aus Brief 04 (PR #99) + Spec-Sitzung BroadcastChannel-Bridge (PR #75). **Code in `src/modules/05_anastomose.js` additiv-mit-internem-Refactoring** (keine äußere Signatur-Änderung): modul-lokale Konstanten `SIBLINGS_STORE` / `LOG_STORE` durch `SIBLINGS_STORE_BASE="sbkim_siblings"` / `LOG_STORE_BASE="sbkim_anastomosis_log"` + `DEFAULT_IDENTITY_KEY="main"` ersetzt; `IDENTITY_KEY="main"`-Hartkodierung im PrivKey-Lader durch Slot-Parameter ersetzt; drei neue Closure-Helper: `siblingsStoreName(slot)` (sync, intern, returns `SIBLINGS_STORE_BASE + "_" + slot`), `anastomosisLogStoreName(slot)` (sync, intern), `ensureSlotStores(slot)` (async, ruft `SbkimStorage.ensureStore` für beide slot-suffixed Stores — idempotent dank Bau 01.Y); Modul-State um `var activeSlotKey = null` + `var receiverMap = new Map()` (nodeId → slotKey) + `ownPrivateKeyCacheBySlot` als `Map<slotKey, CryptoKey>` (statt globalem `ownPrivateKeyCache`) erweitert; `loadOwnPrivateKey(slotKey?)` lädt jetzt pro Slot aus `sbkim_keys[<slot>]`, cached pro Slot; `loadOwnDomainVector(slotKey?)` ruft `SbkimSpore.getOwnSpore(slot)` für die getroffene Persona; `upsertSibling(entry, slotKey?)` / `logEntry(peerId, outcome, slotKey?)` schreiben in `siblingsStoreName(slot)` / `anastomosisLogStoreName(slot)` (slot fällt auf `activeSlotKey` zurück bei fehlendem Argument); `init()` erweitert um (1) bestehende Storage/Spore-init-Pfade unverändert + (2) `activeSlotKey = await SbkimSpore.getActiveIdentityKey()` + (3) `await ensureSlotStores(activeSlotKey)` + (4) Receiver-Map-Bau via `SbkimSpore.listIdentities()` × `SbkimSpore.getOrCreateIdentity(slot)` (Async-Crypto-Aufruf pro Slot einmalig im init — Karte 05 § Receiver-Map-Schlank-Konvention); `handshake(targetSpore, ownDomainVector, options)` cached `opSlot = activeSlotKey || await getActiveIdentityKey()` zur Operations-Zeit (gegen Mid-Operation-Wechsel — Karte 02 § Risiken), schreibt Sibling-Eintrag in `siblingsStoreName(opSlot)`, signiert mit `loadOwnPrivateKey(opSlot)`, lädt eigene Spore via `getOwnSpore(opSlot)`; `sendViaChannel(targetSpore, request, preScore, httpCause, opSlot)` reicht opSlot durch (Log-Pfad im Timeout); `consumeResponse(targetSpore, responseJson, preScore, opSlot)` reicht opSlot für `upsertSibling` + `logEntry` durch; `receiveHandshake(request)` macht Receiver-Map-Lookup `targetSlot = receiverMap.get(request.toNodeId)`: toNodeId angegeben + nicht in Map → `outcome:"rejected", reason:"toNodeId stimmt nicht zum Empfänger"`, KEIN Storage-Eingriff; toNodeId in Map → targetSlot als Persona für die Operation (storage + Sign mit GETROFFENER Persona); toNodeId fehlt/leer → Pre-Brief-04-Rückwärts-Kompat (legacy single-identity, activeSlotKey als Default); ab da `ensureSlotStores(targetSlot)` defensiv + alle storage-Aufrufe gegen slot-suffixed Stores; **`setActiveIdentity` wird NICHT gerufen** — globale aktive Identität bleibt unangetastet; `buildResponse(extra, request, slotKey?)` signiert mit der getroffenen Persona (oder activeSlotKey-Fallback bei early rejections); `listSiblings()` / `forgetSibling(nodeId)` lesen/schreiben gegen `siblingsStoreName(activeSlotKey)` (Persona-übergreifende Sicht = Aufrufer-Pflicht via `listIdentities()` + `setActiveIdentity` + Re-Init). Selbstcheck-Zeile UNVERÄNDERT (init/handshake/receiveHandshake/listSiblings/forgetSibling). `_meta` um `siblingsStoreBase` / `logStoreBase` + Getter `activeSlotKey` + Getter `receiverMapSize` (Read-Anker für Tests) erweitert; modul-lokale Konstanten `SIBLINGS_STORE` / `LOG_STORE` entfernt. Modul-Kopfkommentar um Bau-05.Y-Block am Anfang. `node --check src/modules/05_anastomose.js` grün. **Karte 05** § Manueller Test (Setup-Knopf-Output zeigt aktiven Slot; Test 1 Erwartung um `sbkim_siblings_main` statt `sbkim_siblings` nachgezogen; neuer Knopf 10 „Sekundär-Persona-Test"), § Bauzustand neue Zeile + Migrations-Hinweis (alte `sbkim_siblings`-Daten via Backup-Re-Import nach `sbkim_siblings_main` bringen — Bau-02.Y-Pfad). **Bekannte Limitierung:** Modul 06's TTL-Sweep liest noch den nicht-suffixed Log bis Bau 06.Y nachgezogen ist; Modul 06 läuft fail-soft (kein Bruch, nur unvollständige TTL-Sweeps). **Panel 05** in `tests/manual_check.html` neuer Knopf 10 „Sekundär-Persona-Test" (Vorbereitung: `getOrCreateIdentity('test_05y')` + `setActiveIdentity('test_05y')`; Klaus muss Tab reloaden, dann Test 1 erneut klicken → Sibling-Eintrag in `sbkim_siblings_test_05y`); bestehende neun Knöpfe (Setup + Test 1-7 + Selbstcheck + 9/9a/9b/9c BroadcastChannel) ohne Strukturänderung. **Headless-Smoke-Test** `tests/smoke_bau05y_transparent_slot_pfad.mjs` mit fake-indexeddb (Node 22): vier Proben (Default-Slot „main" / Sekundär-Slot „beruflich" via Modul-Re-Load / Receiver-Pfad mit toNodeId-Map / unbekanntes toNodeId-Mismatch). Regression: Bau-02.Y-Smoke 33/33 + Bau-04.A-Smoke 19/19 + Pflege-01-Smoke 8/8 + Bau-08.Y-Smoke 26/26 alle grün. **PROTOCOL_VERSION bleibt `"0.1"`, DB_VERSION bleibt `4`, BACKUP_FORMAT_VERSION bleibt `2`**. KEIN Modul-01/02/03/04/06/07/08-Eingriff, KEINE `setActiveIdentity`-Aufrufe aus Modul 05 (Receiver nutzt Slot NUR für die Operation, globaler Marker bleibt unangetastet), KEIN `refreshIdentityMap()`-Hook (Re-Init via Tab-Reload Spec-konform), KEINE Migration der alten nicht-suffixed `sbkim_siblings`-Daten (Aufrufer-Pflicht via Backup-Re-Import), KEINE Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 05 bleibt `score:"fertig"`; `update_puls_pie.py` NICHT aufgerufen — additive Erweiterung). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf Panel 05 Setup-Knopf (zeigt aktiven Slot) + Knopf 10 (Sekundär-Persona). Übergabeprotokoll `docs/sessions/archiv/2026-05-20_bau-05y-transparent-slot-pfad.md`. |
| 2026-05-20 | Bau-Sitzung 06.Y transparenter Slot-Pfad in Modul 06 | Zweite der drei Konsumenten-Bauten (05.Y / 06.Y / 07.Y) nach Bau 05.Y (PR #119). Brief BAU_06Y_TRANSPARENT_SLOT_PFAD (PR #114 gemerged 2026-05-20, `main` `b92a602`) als Spec-Vorlage. **§ 1 Modul 06 Geprüft-Zeile** um „2026-05-20 (Bau 06.Y transparenter Slot-Pfad)" erweitert. KEIN Vertrags-Eingriff in Bietet / Storage / Fehlerverhalten / Garantien — der Vertrag steht aus Brief 04 + Spec-Sitzung 06. **Code in `src/modules/06_heterokaryose.js` additiv-mit-internem-Refactoring** (keine äußere Signatur-Änderung): modul-lokale Konstanten `SIBLINGS_STORE` / `LOG_STORE` / `INBOX_STORE` / `OUTBOX_STORE` durch `_BASE`-Variante ersetzt (`SIBLINGS_STORE_BASE` / `LOG_STORE_BASE` / `INBOX_STORE_BASE` / `OUTBOX_STORE_BASE`); `KEYS_STORE = "sbkim_keys"` + `DEFAULT_IDENTITY_KEY = "main"` als modul-lokale Konstanten; vier neue Closure-Helper: `siblingsStoreName(slot)` (sync), `anastomosisLogStoreName(slot)` (sync), `heteroInboxStoreName(slot)` (sync), `heteroOutboxStoreName(slot)` (sync), `ensureSlotStores(slot)` (async, ruft `SbkimStorage.ensureStore` für die zwei Modul-06-Schreib-Stores `sbkim_hetero_inbox_<slot>` + `sbkim_anastomosis_log_<slot>`); Modul-State um `var activeSlotKey = null` + `var receiverMap = new Map()` + `ownPrivateKeyCacheBySlot` als `Map<slotKey, CryptoKey>` (statt globalem `ownPrivateKeyCache`) erweitert; `loadOwnPrivateKey(slotKey?)` lädt pro Slot aus `sbkim_keys[<slot>]`, cached pro Slot; `logEntry(peerId, outcome, slotKey?)` schreibt in `anastomosisLogStoreName(slot)` (slot fällt auf `activeSlotKey` zurück); `readOutboxAnchors(slotKey?)` / `readSporeFallbackAnchors(slotKey?)` / `readOwnAnchors(slotKey?)` nehmen Slot-Parameter (Outbox-Lese-Pfad jetzt slot-suffixed nach Bau 08.Y — Modul 08 schreibt nach `sbkim_hetero_outbox_<slot>`, Modul 06 liest dort); `init()` erweitert um (1) bestehende Storage/Spore-init-Pfade unverändert + (2) `getOrCreateIdentity()` (Identität sicherstellen) + (3) `activeSlotKey = await getActiveIdentityKey()` + (4) `ensureSlotStores(activeSlotKey)` + (5) Receiver-Map-Bau via `listIdentities()` × `getOrCreateIdentity(slot)`; `requestHeterokaryosis(peerNodeId)` cached `opSlot = activeSlotKey || await getActiveIdentityKey()` zur Operations-Zeit (gegen Mid-Operation-Wechsel — Karte 02 § Risiken), liest Sibling aus `siblingsStoreName(opSlot)` (slot-suffixed nach Bau 05.Y / 06.Y), schreibt `consumeResponse` Inbox-Eintrag in `heteroInboxStoreName(opSlot)`, signiert mit `loadOwnPrivateKey(opSlot)`, lädt eigene Spore via `getOwnSpore(opSlot)`; `receiveHeterokaryosis(request)` macht Receiver-Map-Lookup `targetSlot = receiverMap.get(request.toNodeId)`: toNodeId in Map → targetSlot als Persona für die Operation (storage + Sign mit GETROFFENER Persona); toNodeId nicht in Map → `outcome:"rejected", reason:"toNodeId stimmt nicht zum Empfänger"`, KEIN Storage-Eingriff; ab da `ensureSlotStores(targetSlot)` defensiv + alle storage-Aufrufe gegen slot-suffixed Stores (`siblingsStoreName(targetSlot)` für Sibling-Filter + Opt-In, `readOwnAnchors(targetSlot)` für Anker-Quelle, `logEntry(senderId, ..., targetSlot)`); **`setActiveIdentity` wird NICHT gerufen** — globale aktive Identität bleibt unangetastet; `buildResponse(extra, request, slotKey?)` signiert mit der getroffenen Persona (oder `activeSlotKey`-Fallback bei early rejections); `listHeterokaryosis()` / `forgetHeterokaryosis(peerNodeId, ts)` lesen/schreiben gegen `heteroInboxStoreName(activeSlotKey)` (Persona-übergreifende Sicht = Aufrufer-Pflicht). Selbstcheck-Zeile UNVERÄNDERT (init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis). `_meta` um `inboxStoreBase` / `outboxStoreBase` / `siblingsStoreBase` / `logStoreBase` + Getter `activeSlotKey` + Getter `receiverMapSize` erweitert; modul-lokale Konstanten `INBOX_STORE` / `OUTBOX_STORE` / `SIBLINGS_STORE` / `LOG_STORE` entfernt. Test-Brücken `_buildSignedHeterokaryosisRequest` (signiert mit aktiver Identität) + `_addPseudoSibling` / `_clearPseudoSiblings` (schreiben in `siblingsStoreName(activeSlotKey)` mit defensivem ensureStore) angepasst. Modul-Kopfkommentar um Bau-06.Y-Block am Anfang. `node --check src/modules/06_heterokaryose.js` grün. **Karte 06** § Manueller Test (Erwartungs-Block je Knopf nachzieht slot-suffixed Stores; Knopf 15 Sekundär-Persona-Test mit Tab-Reload), § Bauzustand neue Zeile. **Headless-Smoke-Test** `tests/smoke_bau06y_transparent_slot_pfad.mjs` mit fake-indexeddb (Node 22): vier Proben (Default-Slot „main" / Sekundär-Slot „beruflich" via Modul-Re-Load / Receiver-Pfad nutzt getroffene Persona — Antwort + Log in main-Slot trotz active=beruflich, global unverändert / unbekanntes toNodeId → rejected ohne Storage-Eingriff). 25 Sub-Proben, 25 grün. Regression: Bau-02.Y 33/33 + Bau-04.A 19/19 + Pflege-01 8/8 + Bau-05.Y 25/25 + Bau-08.Y 26/26 alle grün. **Bekannte Limitierung aus Bau-05.Y aufgelöst:** Modul 06's TTL-Sweep / forgetExpiredSiblings-Pfad liest jetzt aus `sbkim_anastomosis_log_<key>` (slot-suffixed), passt zum Bau-05.Y-Schreib-Pfad. **PROTOCOL_VERSION bleibt `"0.1"`, DB_VERSION bleibt `4`, BACKUP_FORMAT_VERSION bleibt `2`**. KEIN Modul-01/02/03/04/05/07/08-Eingriff, KEIN `refreshIdentityMap()`-Hook (Re-Init via Tab-Reload Spec-konform), KEINE `setActiveIdentity`-Aufrufe aus Modul 06, KEINE Migration der alten nicht-suffixed `sbkim_hetero_inbox`-Daten (Aufrufer-Pflicht via Backup-Re-Import aus Bau 02.Y), KEINE Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 06 bleibt `score:"fertig"`; `update_puls_pie.py` NICHT aufgerufen). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf Panel 06 Setup-Knopf + Knopf 15 Sekundär-Persona. Übergabeprotokoll `docs/sessions/archiv/2026-05-20_bau-06y-transparent-slot-pfad.md`. |
| 2026-05-20 | Bau-Sitzung 07.Y transparenter Slot-Pfad + `_sendLegacyForIdentity`-Hook in Modul 07 | Dritte und letzte der drei Konsumenten-Bauten (05.Y / 06.Y / 07.Y) nach Bau 05.Y (PR #119) + Bau 06.Y (PR #120). Brief BAU_07Y_TRANSPARENT_SLOT_PFAD_UND_LEGACY_HOOK (PR #115 gemerged 2026-05-20, `main` `cf38d0f`) als Spec-Vorlage. Komplexer als 05.Y/06.Y wegen drei Eingriffen: (1) transparenter Slot-Pfad in Storage-Stores, (2) globale `confirmSelfApoptose` iteriert über ALLE Slots, (3) neuer interner Hook `_sendLegacyForIdentity(key, reason?)`, den Bau 02.Y bereits via typeof-check fail-soft ruft (nach Bau 07.Y produktiv). **§ 1 Modul 07 Geprüft-Zeile** + § 10 Änderungsprotokoll. KEIN Vertrags-Eingriff. **Code in `src/modules/07_apoptose.js` additiv-mit-internem-Refactoring** (keine äußere Signatur-Änderung außer optionalen `key`-Parametern auf `listLegacy(key?)` und `forgetExpiredSiblings(maxAgeMs, key?)`, beide rückwärtskompatibel): modul-lokale Konstanten `SIBLINGS_STORE` / `LOG_STORE` / `INBOX_STORE` / `HETERO_INBOX_STORE` durch `_BASE`-Variante ersetzt; `HETERO_OUTBOX_STORE_BASE = "sbkim_hetero_outbox"` neu (für globalen Cleanup-Pfad); `IDENTITY_KEY = "main"` durch `DEFAULT_IDENTITY_KEY` ersetzt; `META_STORE = "sbkim_meta"` + `ACTIVE_IDENTITY_META_KEY = "active-identity"` modul-lokal. `CLEANUP_ORDER` durch `CLEANUP_ORDER_BASES` ersetzt (slot-suffixed pro Slot durchlaufen): siblings → log → legacy_inbox → hetero_inbox → hetero_outbox. Fünf neue Closure-Helper: `siblingsStoreName(slot)` / `anastomosisLogStoreName(slot)` / `legacyInboxStoreName(slot)` / `heteroInboxStoreName(slot)` / `heteroOutboxStoreName(slot)` (sync); `ensureSlotStores(slot)` ruft `SbkimStorage.ensureStore` für alle fünf identitäts-spezifischen Stores (idempotent dank Bau 01.Y). Modul-State um `var activeSlotKey = null` + `var receiverMap = new Map()` + `ownPrivateKeyCacheBySlot` als `Map<slotKey, CryptoKey>` (statt globalem `ownPrivateKeyCache`) erweitert. `loadOwnPrivateKey(slotKey?)` lädt pro Slot. `listSiblingsForBroadcast(slotKey?)` liest aus `siblingsStoreName(slot)` (Pseudo-Sibling-Override gilt persona-übergreifend für Tests). `init()` erweitert um (1) `getOrCreateIdentity()` (Identität sicherstellen) + (2) `activeSlotKey = await getActiveIdentityKey()` + (3) `ensureSlotStores(activeSlotKey)` + (4) Receiver-Map-Bau via `listIdentities()` × `getOrCreateIdentity(slot)`. **`prepareSelfApoptose(reason)`**: `recipientCount` zählt jetzt Geschwister über ALLE Slots (globale Summe; Pseudo-Sibling-Override gilt persona-übergreifend). **`confirmSelfApoptose(token, reason)` komplett umgeschrieben**: Token-Check unverändert; iteriert `slots = await SbkimSpore.listIdentities()`; PRO Slot `await _sendLegacyForIdentity(slot, reason)` (fail-soft try/catch, sammelt recipientsNotified + recipientsFailed aus allen Slot-Aufrufen); danach PRO Slot Cleanup über `CLEANUP_ORDER_BASES` (clear) + `del(SPORE_STORE, slot)` + `del(KEYS_STORE, slot)`; danach globaler Marker `del(sbkim_meta, "active-identity")`; danach Closure-Caches invalidiert (`ownPrivateKeyCacheBySlot.clear()` + `pseudoSiblings = null` + `activeSlotKey = null` + `receiverMap = new Map()`) + `SbkimSpore.resetIdentityCache()`. Returns globales `{outcome:"completed", recipientsNotified, recipientsFailed}` mit aggregierten Listen aus allen Slots. **Neue interne Funktion `_sendLegacyForIdentity(key, reason?)`**: Aufrufer (a) Bau 02.Y `removeIdentity(key, {force:true})` via typeof-check (Modul 02 schluckt Würfe fail-soft); (b) `confirmSelfApoptose` iteriert. Pflicht: sendet Persona-Vermächtnis an Geschwister DIESER Persona (gelesen aus `sbkim_siblings_<key>`); signiert PRO Sibling separat mit `toNodeId: sibling.nodeId` für Receiver-Map-Routing; KEIN Store-Cleanup (Modul 02 räumt nach Bau 02.Y für per-Persona-Apoptose; `confirmSelfApoptose` räumt nach diesem Hook). Fail-soft: gibt `{recipientsNotified, recipientsFailed}` zurück (auch bei vielen Fehlern); wirft nur bei klaren Aufrufer-Fehlern. Default-Reason `"Persona-Apoptose (slot=<key>)"` wenn Aufrufer keinen liefert. **Auf `window.SbkimApoptose._sendLegacyForIdentity` exportiert** (Modul 02's typeof-check sucht da). **`receiveLegacy(legacyMessage)` erweitert** mit Receiver-Map-Lookup `targetSlot = receiverMap.get(legacyMessage.toNodeId)`: toNodeId in Map → targetSlot als Persona; toNodeId nicht in Map → `outcome:"rejected", reason:"toNodeId stimmt nicht zum Empfänger"`, KEIN Storage-Eingriff; toNodeId fehlt/leer → Pre-Brief-04-Rückwärts-Kompat (`activeSlotKey` als Default). Inbox-Schreib in `legacyInboxStoreName(targetSlot)`, Sibling-del aus `siblingsStoreName(targetSlot)`, `buildLegacyResponse(extra, request, targetSlot)` signiert mit getroffener Persona. **`listLegacy(key?)`**: optionaler key-Parameter (Default = activeSlotKey); liest aus `legacyInboxStoreName(sk)`, fail-soft leere Liste bei fehlendem Slot-Store. **`forgetExpiredSiblings(maxAgeMs, key?)`**: optionaler key-Parameter; liest aus `siblingsStoreName(sk)` + `anastomosisLogStoreName(sk)`, fail-soft bei fehlendem Slot-Store. **`_meta`** um `inboxStoreBase` / `siblingsStoreBase` / `logStoreBase` / `heteroInboxStoreBase` / `heteroOutboxStoreBase` / `cleanupOrderBases` + Getter `activeSlotKey` + Getter `receiverMapSize` erweitert. Test-Brücke `_buildSignedLegacyMessage(reason)` signiert mit aktiver Identität. Modul-Kopfkommentar um Bau-07.Y-Block am Ende. `node --check src/modules/07_apoptose.js` grün. **Karte 07** § Bauzustand neue Zeile. **Panel 07** in `tests/manual_check.html` bestehende neun Knöpfe ohne Strukturänderung (Cleanup-Pfad nach Bau 07.Y transparent slot-suffixed; bestehende Tests prüfen weiterhin korrektes Verhalten). **Headless-Smoke-Test** `tests/smoke_bau07y_transparent_slot_pfad_und_legacy_hook.mjs` mit fake-indexeddb (Node 22): fünf Proben (Default-Slot „main" receiveLegacy + listLegacy / Sekundär-Slot „test_07y" via Modul-Re-Load + listLegacy(key) per Persona / Receiver-Pfad mit unbekanntem toNodeId → rejected ohne Storage-Eingriff / `_sendLegacyForIdentity('main')`-Hook resolved fail-soft + KEIN Store-Cleanup / globale `confirmSelfApoptose` über zwei Slots — pro Slot Cleanup + globaler Marker + Cache-Invalidate). 30 Sub-Proben, 30 grün. Regression: Bau-02.Y 33/33 + Bau-04.A 19/19 + Pflege-01 8/8 + Bau-05.Y 25/25 + Bau-06.Y 25/25 + Bau-08.Y 26/26 alle grün. **Konsumenten-Achse 05/06/07/08 jetzt vollständig slot-suffixed.** **Bau-02.Y-fail-soft-Klausel aufgelöst:** Modul 02's typeof-check für `_sendLegacyForIdentity` findet den Hook jetzt; `console.warn`-Pfad verschwindet automatisch ohne Modul-02-Code-Änderung. **PROTOCOL_VERSION bleibt `"0.1"`, DB_VERSION bleibt `4`, BACKUP_FORMAT_VERSION bleibt `2`**. KEIN Modul-01/02/03/04/05/06/08-Eingriff, KEIN `setActiveIdentity`-Aufruf aus Modul 07, KEINE Migration alter nicht-suffixed Daten (Aufrufer-Pflicht via Backup-Re-Import), KEINE Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 07 bleibt `score:"fertig"`; `update_puls_pie.py` NICHT aufgerufen). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf Panel 07. Übergabeprotokoll `docs/sessions/archiv/2026-05-20_bau-07y-transparent-slot-pfad-und-legacy-hook.md`. |
| 2026-05-20 | Bau-Sitzung 04.B `explainMatchLLM` in Modul 04 | Stufe-B-LLM-Pass produktiv nach Bau 04.A (matchDimensions sync) + Brief 03 M04-Erweiterung. Brief BAU_04B_EXPLAIN_MATCH_LLM (PR #112 gemerged 2026-05-20, `main` `a1f6939`) als Spec-Vorlage. **§ 1 Modul 04 Geprüft-Zeile** + § 10 Änderungsprotokoll. KEIN Vertrags-Eingriff (Brief 03 hat `explainMatchLLM` voll spezifiziert). **Code in `src/modules/04_match.js` additiv** (keine bestehende Funktion verändert): zwei neue Fehler-Factories `InvalidApiKeyError(message)` + `InvalidMatchResultError(message)` (sync von `explainMatchLLM`-Vor-Check); fünf neue modul-lokale Konstanten `STUFE_B_DEFAULT_MODEL = "claude-sonnet-4"` + `STUFE_B_MAX_TOKENS = 1024` (gespiegelt aus § 0) + `ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"` + `ANTHROPIC_API_VERSION = "2023-06-01"` + `LLM_MAX_OUTPUT_CHARS = 4096` (defensiv-Schutz vor pathologischen LLM-Outputs); modul-lokale Allow-Lists `ALLOWED_CANDIDATE_SCOPES = ["lokal","mailbox","netz"]` + `ALLOWED_OVERRIDE_RECOMMENDATIONS = ["established","established-with-bridge","rejected"]` + Längen-Limits `MAX_BEGRUENDUNG_LEN = 200` + `MAX_ERKLAERUNG_LEN = 600`. Drei interne Helper: `isNumberOrNull(v)` (sync), `validateMatchResultShape(matchResult)` (sync, wirft `InvalidMatchResultError` mit konkreten Feld-Hinweis), `buildLlmPrompt(matchResult)` (sync, baut deutsche User-Message mit vier Schicht-Werten + Schema-Block wörtlich aus Karte 04), `validateLlmResponseSchema(parsedJson, matchResult)` (sync, prüft strikt `schichten.{fachlich/prozess/skalierung}.{score:Number∈[-1,1], begruendung:String ≤ MAX_BEGRUENDUNG_LEN}` + `bruecke:null|{needed:String, lookingFor:String\|null, candidateScope:"lokal"\|"mailbox"\|"netz"}` + `erklaerung:String ≤ MAX_ERKLAERUNG_LEN` + `overrideRecommendation:null\|"established"\|"established-with-bridge"\|"rejected"`; **Anti-Missbrauch § 8: `candidateScope:"netz"` STILL auf `"lokal"` korrigiert** — KEIN Throw, KEIN Logging, defensiv; entfällt erst mit Anker 10/11/12). **Neue Funktion `explainMatchLLM(matchResult, apiKey, options?)` async**: Sync-Vor-Checks werfen `InvalidApiKeyError` (leerer/nicht-String apiKey) oder `InvalidMatchResultError` (matchResult kein gültiges MatchDimensionsResult); danach Options-Defaults (model / maxTokens / abortSignal); fetch POST an `ANTHROPIC_API_URL` mit Headern `x-api-key` + `anthropic-version` + `content-type:application/json` und Body `{model, max_tokens, messages:[{role:"user", content:prompt}]}` + signal. **Fail-soft auf allen Fehlerpfaden:** HTTP 4xx/5xx → `ExplainResult{available:false, reason:"API HTTP <status> (<text>)", fallbackScore:matchResult.overall, model, tokensUsed:null}`; HTTP 429 sondergetaggt als „API HTTP 429 (Rate-Limit) — Aufrufer-Drossel-Pflicht"; response.json() wirft → „Antwort war kein valides JSON"; Anthropic-API-Form fehlt (kein `content[0].text`) → „Antwort entsprach nicht der Anthropic-API-Form"; LLM-Text > LLM_MAX_OUTPUT_CHARS gekürzt vor JSON-Parse; LLM-Text kein valides JSON → „LLM-Output war kein valides JSON"; Schema-Mismatch (validateLlmResponseSchema returns null) → „Antwort entsprach nicht dem Schema: <konkreter Hinweis>"; TypeError aus fetch → „Netz nicht erreichbar (<message>)". **`AbortError` aus fetch wird NICHT abgefangen** — Standard-DOM-Verhalten, durchgereicht; Aufrufer fängt selbst. **Erfolgs-Pfad:** `ExplainResult{available:true, schichten, bruecke (mit candidateScope:"netz"→"lokal"-Korrektur), erklaerung, overrideRecommendation, fallbackScore:matchResult.overall, model, tokensUsed:(input+output) oder null}`. **`window.SbkimMatch`-Export** um `explainMatchLLM` + `InvalidApiKeyError` + `InvalidMatchResultError` ergänzt. **Selbstcheck-Zeile auf VIER Funktionen erweitert**: `MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold/matchDimensions/explainMatchLLM, Schwellen: PROVIDER_MIN_MATCH=0.80, SCHICHT_MIN_MATCH=0.60`. `_meta` um `stufeBDefaultModel` + `stufeBMaxTokens` + `anthropicApiUrl` + `anthropicApiVersion` (Read-Anker für Tests) erweitert. Modul-Kopfkommentar um Bau-04.B-Block am Ende. `node --check src/modules/04_match.js` grün. **Karte 04** § Manueller Test um Knopf 10 erweitert; § Bauzustand neue Zeile. **Panel 04** in `tests/manual_check.html` Knopf 10 „explainMatchLLM Test-Brücke" — User-Key-Eingabe via `window.prompt` (KEIN localStorage / sessionStorage / IndexedDB-Persistenz — Sicherheits-Klausel; produktiver Identitäts-Container ist Vision-Anker 5, eigene Folge-Spec-Sitzung), Setup-matchResult via deterministischem `SbkimMatch.matchDimensions`-Aufruf mit Käsekuchen-vs-Käsetorte-Vektoren; Logging von `available`/`model`/`tokensUsed`/`schichten`/`bruecke`/`erklaerung`/`overrideRecommendation` bzw. `reason`/`fallbackScore`. Status-Chip „Stufe-B-Call OK" (auch bei `available:false` — Modul 04 hat sauber resolved, nicht rot wegen API-Fehler). Panel-Header-Hinweistext um Bau-04.B-Block + CORS-Hinweis erweitert. **Headless-Smoke-Test** `tests/smoke_bau04b_explain_match_llm.mjs` mit fetch-Stub (Node 22, KEIN echter Netz-Aufruf): zehn Proben + zwei Bonus-Proben (HTTP 200 valide JSON / candidateScope:"netz"→"lokal"-Korrektur / HTTP 429 / HTTP 500 / TypeError fetch / LLM-Output kein JSON / Schema-Mismatch / leerer apiKey → sync InvalidApiKeyError / leeres matchResult → sync InvalidMatchResultError / AbortError aus fetch durchgereicht / usage fehlt → tokensUsed null / schichten.score=1.5 außerhalb [-1,1] → Schema-Mismatch). 30 Sub-Proben, 30 grün. Regression: Bau-02.Y 33/33 + Bau-04.A 19/19 + Pflege-01 8/8 + Bau-05.Y 25/25 + Bau-06.Y 25/25 + Bau-07.Y 30/30 + Bau-08.Y 26/26 alle grün. **PROTOCOL_VERSION bleibt `"0.1"`, DB_VERSION bleibt `4`, BACKUP_FORMAT_VERSION bleibt `2`** — Modul 04 zustandslos, kein Storage, kein Spore-Feld. KEIN Modul-01/02/03/05/06/07/08-Eingriff, KEIN Identitäts-Container-Code (Vision-Anker 5), KEIN localStorage / sessionStorage / IndexedDB-Persistenz des API-Keys (Sicherheits-Klausel), KEIN eigener Rate-Limit-Pfad (Aufrufer-Pflicht), KEINE Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 04 bleibt `score:"fertig"`; `update_puls_pie.py` NICHT aufgerufen — additive Erweiterung). **Bekannte Limitierung CORS:** Anthropic-API erlaubt direkte Browser-Aufrufe seit 2024 mit `anthropic-dangerous-direct-browser-access`-Header — Modul 04 setzt diesen Header BEWUSST NICHT (keine Klaus-feindliche Konfig-Komplexität). Bei `localhost`-Test scheitert CORS möglich; Workaround echtes PWA-Setup mit gehosteter Origin (GitHub-Pages-Endknoten). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf Panel 04 Knopf 10 mit Anthropic-API-Key. Übergabeprotokoll `docs/sessions/archiv/2026-05-20_bau-04b-explain-match-llm.md`. |
| 2026-05-20 | Bau-Sitzung 08.Y slot-spezifische Outbox in Modul 08 | Vierte Konsumenten-Bau-Sitzung der Bau-Sitzungs-Brief-Pipeline aus Brief 99 (nach Bau 05.Y / 06.Y / 07.Y — alle drei Briefe gemerged, Bau-Sitzungen folgen in eigener Reihenfolge). Brief BAU_08Y_SLOT_SPEZIFISCHE_OUTBOX (PR #116 gemerged 2026-05-20, `main` `4b063ad`) als Spec-Vorlage. **Modul 08 ist storage-only** (kein Netz, kein Receiver-Map) — kürzester der vier Konsumenten-Bauten. **§ 1 Modul 08 Geprüft-Zeile** um „2026-05-20 (Bau 08.Y slot-spezifische Outbox)" erweitert. KEIN Vertrags-Eingriff in Bietet / Storage / Fehlerverhalten / Garantien — der Vertrag steht aus Spec-Sitzung 08 + Brief 04 (Slot-Pattern). **Code in `src/modules/08_ui_demo.js` additiv-mit-internem-Refactoring** (keine äußere Signatur-Änderung): Modul-State um `var activeSlotKey = null` erweitert (gecached vom `init()`); modul-lokale Konstanten `OUTBOX_STORE` / `SIBLINGS_STORE` durch `OUTBOX_STORE_BASE` / `SIBLINGS_STORE_BASE` ersetzt (Slot-Suffix wird im Schreib-Pfad angehängt); neuer Helper `heteroOutboxStoreName(slot)` (sync, intern, returns `"sbkim_hetero_outbox_" + slot`); neuer Helper `siblingsStoreName(slot)` (sync, intern, returns `"sbkim_siblings_" + slot`); neuer Helper `ensureSlotStores(slot)` (async, intern, ruft `SbkimStorage.ensureStore` für beide slot-suffixed Stores — idempotent dank Bau 01.Y); `probeDependencies` um `SbkimSpore (Modul 02)` als zweite Pflicht-Abhängigkeit erweitert; `init(options)` erweitert um (1) `SbkimSpore.init()` + (2) `activeSlotKey = await SbkimSpore.getActiveIdentityKey()` (Default `"main"` bei fehlendem Marker) + (3) `await ensureSlotStores(activeSlotKey)`; `options.storeName` wird stillschweigend ignoriert (slot-suffix ist intern verbindlich); `listOutbox()` / `addOutboxAnchor` / `removeOutboxAnchor` lesen + schreiben jetzt gegen `heteroOutboxStoreName(activeSlotKey)`; `setSiblingHeteroOptIn` liest + schreibt gegen `siblingsStoreName(activeSlotKey)` (Co-Schreiber-Konvention via `Object.assign({}, sibling, {heterokaryosisOptIn})` unverändert); defensives `ensureSlotStores(activeSlotKey)` vor jedem ersten Schreibvorgang in `addOutboxAnchor` + `setSiblingHeteroOptIn` (idempotent, schützt gegen Backup-Re-Import-Pfade); `addOutboxAnchor`-Check-Reihenfolge unverändert (1 Label sync, 2 Vektor sync, 3 async-Voll-Check `OutboxFullError` nur bei NEUEM Label); `removeOutboxAnchor` weiterhin idempotent via `SbkimStorage.del`; Test-Brücken `_clearOutbox` / `_addPseudoSibling` / `_clearPseudoSiblings` umgestellt auf slot-spezifische Stores (`_clearOutbox` und `_clearPseudoSiblings` nutzen jetzt `SbkimStorage.clear(<store>)` statt iteratives `del` — sauberer, da Slot-isoliert); `pseudoSiblingIds`-Tracker entfernt (durch `clear`-Pfad obsolet); `_meta` um `outboxStoreBase` / `siblingsStoreBase` + Getter `activeSlotKey` (Read-Anker für Tests, null vor init) erweitert; Modul-Kopfkommentar um Bau-08.Y-Block am Ende. Selbstcheck-Zeile UNVERÄNDERT (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn` — fünf Funktionen heißen weiterhin gleich). `node --check src/modules/08_ui_demo.js` grün. **Karte 08** § Schnittstelle (Storage-Block-Erweiterung um slot-suffixed Stores), § Manueller Test (Erwartungs-Block je Knopf nachgezogen — `sbkim_hetero_outbox_main` jetzt statt `sbkim_hetero_outbox`; Setup-Knopf-Output zeigt aktiven Slot), § Konfigurationswerte (`HETERO_OUTBOX_MAX_ENTRIES = 5` jetzt PRO SLOT, Hinweis ergänzt), § Bauzustand neue Zeile. **Panel 08** in `tests/manual_check.html` Setup-Knopf-Output zeigt den aktiven Slot + slot-suffixed Store-Namen (`outbox_store: "sbkim_hetero_outbox_main"`, neues Feld `active_slot_key`); Test-1-Erwartung um Slot-Suffix-Hinweis erweitert; bestehende acht Knöpfe ohne Strukturänderung. Optional-Knopf Sekundär-Persona-Test bewusst NICHT in dieser Bau-Sitzung (Empfehlung Brief 08.Y — Bau-05.Y/06.Y/07.Y-Sichttests haben das Sekundär-Persona-Muster genug demonstriert). **Headless-Smoke-Test** `tests/smoke_bau08y_slot_spezifische_outbox.mjs` mit fake-indexeddb (Node 22): drei Proben (Default-Slot Schreib-/Lese-Pfad / Sekundär-Slot via Modul-Re-Load / Co-Schreiber-Pfad in `sbkim_siblings_main`) + Bonus (Slot-Isolation Cross-Persona) — 26 Sub-Proben, 26 grün. Regression: Bau-02.Y-Smoke 33/33 + Bau-04.A-Smoke 19/19 + Pflege-01-Smoke 8/8 alle grün. **Bekannte Limitierung aus Bau-06.Y-Brief aufgelöst:** Modul 06 liest jetzt aus `sbkim_hetero_outbox_<key>` (Bau 06.Y) — Modul 08 schreibt dorthin (diese Bau-Sitzung). Pre-Brief-04-Aufrufer treffen unverändert auf `_main`-Slots via `getActiveIdentityKey`-Default. **PROTOCOL_VERSION bleibt `"0.1"`, DB_VERSION bleibt `4`, BACKUP_FORMAT_VERSION bleibt `2`**. KEIN Modul-01/02/03/04/05/06/07-Eingriff, KEIN Receiver-Map-Code (Modul 08 storage-only), KEINE `setActiveIdentity`-Aufrufe aus Modul 08, KEINE Migration der alten nicht-suffixed `sbkim_hetero_outbox`-Daten (Aufrufer-Pflicht via Backup-Re-Import aus Bau 02.Y in main-Slot bringen), KEINE Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung. **`status.json` unverändert** (Modul 08 bleibt `score:"stub"`; `update_puls_pie.py` NICHT aufgerufen — additive Erweiterung, kein Score-Wechsel). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf von Panel 08 Setup-Knopf (zeigt slot-suffixed Store-Namen). Übergabeprotokoll `docs/sessions/archiv/2026-05-20_bau-08y-slot-spezifische-outbox.md`. |
| 2026-05-22 | Pflege Modul 01 Versions-Bump-Race in `openProbe` | Folge-Pflege auf Klaus' Sichttest 2026-05-21 (Sichttest-Folge zur Bau-Sage-Page-Refactor-Sitzung, PRs #127–#134 gemerged) und Diagnose-2-Befund im Übergabeprotokoll `2026-05-21_bau-sage-page-refactor-sichttest.md`: `ensureStore('sbkim_meta') Versions-Bump blockiert — ein anderer Tab haelt die DB offen und ignoriert onversionchange.` reproduzierbar auf frischer DB nach Panel-01-Notfall-Reset (PR #131) + Hard-Reload + Panel-06-Setup, **nur in `tests/manual_check.html` bei wiederholtem Modul-Wechsel** — Endknoten-PWAs nicht betroffen, weil sie nur EINE `init()`-Kette pro Tab-Lebenszeit haben. Ursache: `db.close()` ist synchron in JS, IndexedDB schließt die Verbindung intern asynchron, ein direkt nachfolgender `indexedDB.open(name, newVersion)` trifft auf eine noch nicht aufgelöste Vorgänger-Verbindung und hängt in `onblocked` (manifestiert sich auf Android-Chrome / Galaxy Tab S6 / DeX-Chrome stärker als auf Desktop-Chrome, weil `db.onclose` dort weniger zuverlässig feuert). **§ 1 Modul 01 Bietet-Block:** Garantien-Block nachgezogen um neuen Sub-Block „init-Garantien (Pflege „Versions-Bump-Race in openProbe", 2026-05-22)" mit drei Punkten: (1) Race-frei bei Versions-Bumps innerhalb derselben Tab-Session (Wait auf `db.onclose` ODER 50-ms-Timeout-Fallback); (2) `openProbe`-Probe-Verbindung trägt jetzt den fail-soft-`onversionchange`-Handler; (3) Anwendungsfall + Endknoten-PWA-Unbetroffenheit explizit benannt. **§ 1 Modul 01 Geprüft-Zeile** um 2026-05-22 erweitert. **§ 9.5 Migrations-Strategie** neuer Stand-Hinweis-Absatz „Stand 2026-05-22 (Folge-Pflege „Versions-Bump-Race in openProbe")" mit Befund / Code-Lösung / Tafel-Evolutions-Hinweis. **KEIN Bietet-/Storage-/Fehler-Block-Eingriff** für Modul 01 (acht öffentliche Funktionen + Signaturen unverändert); **KEIN `ensureStore`-Verhalten-Bruch von außen** (Aufrufer-Seite 02/05/06/07/08 ohne Code-Änderung); **KEIN `DB_VERSION`-Bump** (`DB_VERSION = 4` bleibt). **Code in `src/modules/01_storage.js` additiv**: neuer modul-lokaler Helper `closeConnectionAndWait(db)` (wartet auf `db.onclose`-Feuer ODER 50-ms-Timeout-Fallback); `openProbe(name)` ruft `attachVersionChangeHandler(req.result)` vor `resolve`; `init()` beide `probedDb.close()`-Stellen (Fail-soft-Pfad + Initial-Pfad) und `ensureStore` `db.close()` (vor Versions-Bump) auf `closeConnectionAndWait(db).then(...)` umgestellt — `indexedDB.open(name, newVersion)` startet jetzt erst nach vollständig aufgelöster Vorgänger-Verbindung. Modul-Kopfkommentar um Pflege-Block am Anfang erweitert (Befund, Ursache, drei Eingriffe). **Headless-Smoke-Test** `tests/smoke_pflege_01_versions_bump_race.mjs` (Node 22 + fake-indexeddb): vier Proben, 6 Sub-Proben, 6/6 grün. **Regression** alle anderen Smoke-Tests grün ohne Anpassung: Pflege-01-Smoke 8/8 + Bau-02.Y 33/33 + Bau-04.A 19/19 + Bau-05.Y 25/25 + Bau-06.Y 25/25 + Bau-07.Y 30/30 + Bau-08.Y 26/26 = 166 Proben grün. **KEINE Modul-02/03/04/05/06/07/08-Änderung**, **KEINE `tests/manual_check.html`-Änderung** (Sichttest-Trigger ist der vorhandene PR-#131-Notfall-Reset-Knopf + Hard-Reload + Panel-06-Setup-Knopf), **KEINE Sage-Page-Änderung**, **KEINE CLAUDE.md-/Karte-09-/`status.json`-Änderung**. **`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `4`, `BACKUP_FORMAT_VERSION` bleibt `2`**. **`status.json` unverändert** (Modul 01 bleibt `score:"fertig"`; `update_puls_pie.py` NICHT aufgerufen). Karte 01 § Versionsmigration neuer Sub-Block „Folge-Pflege 2026-05-21 — Race-Auflösung in openProbe + Close-Wait" (zwei Absätze: Was sich änderte / Klaus' Sichttest-Beweis); § Bauzustand zwei neue Zeilen (Pflege „Versions-Bump-Race" + Sichttest-Race-Auflösung); § Risiken unverändert (bestehender Race war nicht dokumentiert, deshalb keine Tafel zu evolvieren). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf am Galaxy Tab S6 / DeX-Chrome. Übergabeprotokoll `docs/sessions/archiv/2026-05-22_pflege-01-versions-bump-race.md`. |
| 2026-05-25 | Spec-Sitzung 17 Floating-Widget | Pipeline-Schritt 5b. Neuer § 1 Modul 17-Block voll spezifiziert — Vier-Slot-Live-Status-Dashboard (LEBT/VERKEHR/FREMD/SIEGEL) als finale Form (Klaus-Zusatz-Wunsch 2026-05-25 ersetzt den ursprünglichen 2-Plaketten-Vorschlag aus Brief `BRIEF_SPEC_15_16_FLOATING_WIDGET.md` Punkt 3 via Tafel-Evolutions-Klausel). Schnittstelle `window.SbkimWidget = {init/show/hide/isVisible/getPosition/_meta}` mit Pille ~200×48 px, self-mountend in `<body>`, Drag via Pointer-Events, X-Schließen + vier Wiederherstellungs-Pfade, `localStorage`-persistierte Visible + Position, RAM-only VERKEHR-Mini-Log FIFO 10. **Event-Bus-Schema** (fünf Pflicht-Events auf `window`): `sbkim:alive` (Modul 02 dispatcht), `sbkim:handshake` (Modul 05), `sbkim:postmessage` (Modul 15 Sub b), `sbkim:fremd-alert` (Modul 15 Sub e), `sbkim:siegel-certified` (Modul 16). Modul 17 lauscht passiv, kennt keine Modul-Referenz; Anbieter-Module dispatchen bei realer Operation (Anti-Greenwashing). Detail-Form PII-frei (Counts + Status-Flags, KEINE Inhalte). § 1 Modul 02/05/15/16 Events-Blöcke um die Pflicht-Custom-Events erweitert (`feuert: sbkim:…` mit Detail-Form und Konsument-Hinweis). Karten 02 + 05 § Bauzustand + 15 § Sub (e) + 16 § Sub (b) bekommen je einen ein-Satz-Verweis-Block. Modul-15-+-16-Backends bleiben unverändert (Klaus-Festlegung); Sage-Page-Pfad (Navleisten-Lampen + Siegel-Badge) bleibt erhalten als Sage-page-spezifisch. Endknoten-Standard wird das Widget — Endknoten-Einbau auf drei Zeilen reduziert (Modul-Datei-Kopie + `<script>`-Tag + EIN `SbkimWidget.init({allowedOrigins, repoUrl})`-Aufruf). Karte 09 § Schritt 10 + 11 schrumpfen in eigener Folge-Pflege nach Bau 17. CLAUDE.md § Modul-Tabelle Eintrag 17 auf „Spec fertig" gesetzt; § Pipeline-Reihenfolge bleibt unangetastet (Spec-Sitzung 17 entspricht Pipeline-Schritt 5b, war bereits am 2026-05-25 in PR #163 verankert). `status.json` § modules[] um Modul 17 (`score:"spec"`, `siegel:"Spec fertig"`) erweitert; `python3 scripts/update_puls_pie.py` aufgerufen. **KEIN Modul-Code** in `src/modules/17_floating_widget.js` (Spec-Sitzung, kein Bau). **KEINE Endknoten-Änderung.** **KEIN Eingriff in `src/modules/02_spore.js` / `05_anastomose.js` / `15_membran.js` / `16_siegel.js`** (Event-Hook-Code ist Bau-Sitzung 17 oder eigene Folge-Pflege pro Modul). **KEINE Sage-Page-Änderung.** **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump** (Modul 17 ist nicht protokoll-aktiv). Brief Bau-Sitzung 17 angelegt: `docs/sessions/BRIEF_BAU_17_FLOATING_WIDGET.md`. Übergabeprotokoll `docs/sessions/archiv/2026-05-25_spec-17-floating-widget.md`. |
| 2026-05-25 | Bau-Sitzung 17 Floating-Widget | Pipeline-Schritt 5c. **`src/modules/17_floating_widget.js`** voll angelegt (~770 Zeilen, IIFE-Pattern wie 00/01/02/04/05/06/07/08/15/16). Public Surface `window.SbkimWidget = {init/show/hide/isVisible/getPosition/_meta}` voll implementiert: Self-mountende Pille in `<body>` via MutationObserver-Fallback (analog Modul 00/16, 10 s Safety-Timeout); Standalone-CSS via `<style id="sbkim-widget-style">`-Element ans Ende von `<head>` injiziert (KEIN Shadow-DOM in Stufe 1, KEIN `:root`-Eingriff — CSS-Variablen modul-lokal mit `--sbkim-widget-*`-Präfix); vier Slot-Buttons à 40 px horizontal (LEBT/VERKEHR/FREMD/SIEGEL); X-Knopf oben-rechts; Drag-Mechanik via Pointer-Events (Touch + Maus vereinheitlicht), 5 px Threshold, gesamte Pille drag-fähig außerhalb der Slots (Bau-Sitzung-17-Entscheidung), Viewport-Clamp (24 px immer sichtbar), `setPointerCapture`/`releasePointerCapture` fail-soft; `localStorage` für `sbkim_widget_visible` + `sbkim_widget_position` (UX-only, kein Protokoll-Datum, defekter JSON fail-soft auf Defaults); RAM-only VERKEHR-FIFO 10. **Fünf Event-Listener auf `window`** registriert: `sbkim:alive` (→ LEBT.active + pulsiert grün); `sbkim:handshake` (→ VERKEHR.active + verkehr-pulse + trafficLog push); `sbkim:postmessage` (→ VERKEHR + trafficLog); `sbkim:fremd-alert` (→ FREMD.active + fremd-pulse bei bufferSize>0; OHNE bufferSize-Feld → Slot-Zustand bleibt, fail-soft); `sbkim:siegel-certified` (→ SIEGEL-Slot ins DOM mounten + 600 ms First-Boot-Animation EINMAL pro Session via `firstBootShown`-Flag). **SIEGEL-Slot Anti-Greenwashing binär:** Slot wird beim `init()` nur gemountet, wenn `isSiegelCertifiedNow()===true` (Sync-Lese-Check `SbkimSiegel.isCertified()`); sonst wartet das Modul auf `sbkim:siegel-certified`-Event UND prüft erneut `SbkimSiegel.isCertified()` (doppelte Defensive-Prüfung, Anti-Greenwashing-Bypass-Schutz). Ohne `SbkimSiegel`-Stub oder bei `isCertified()===false` wird der Slot NICHT angelegt + `console.warn` mit „Anti-Greenwashing"-Marker. **Modal-Bridge-Entscheidung Bau-Sitzung 17: Option 1 (Proxy-DOM-Element im Widget)** — Widget legt unsichtbare Spans `<span id="lamp-fremd">` + `<span id="sbkim-siegel-badge">` in seinem Inneren an (via `.sbkim-widget-proxy`-Container mit `visibility:hidden;pointer-events:none`). Modul 15/16 attachen ihre Click-Handler dort. **Folge: SbkimWidget.init() MUSS VOR SbkimMembrane.init()/SbkimSiegel.init() im Endknoten-Andocker stehen** — sonst finden Modul 15/16 ihre Mount-Elemente nicht und können keinen Handler attachen. Slot-Klick → bevorzugt Element AUSSERHALB des Widgets (Sage-Page-Lampe), fällt fail-soft auf Widget-interne Proxy zurück. Karte 09 § Schritt 12 dokumentiert das in eigener Folge-Pflege nach Bau 17. **LEBT-Modal** (eigenes Modul-17-Modal in `document.body`, `<dl>`-Grid: Uptime-Counter aktualisiert 1× pro Sekunde via setInterval, Modul-02-Init-Status boolean, nodeId-Präfix erste 12 Zeichen, events:alive-Count, since-ISO). **VERKEHR-Modal** (eigenes Modul-17-Modal, Tabelle [Zeit, Quelle:handshake/postmessage, Richtung:incoming/outgoing, Decision]); auto-refresht bei offenem Modal pro Event. **FREMD/SIEGEL-Slot-Klicks** → Proxy-Click via `proxyClickModalBridge` (fail-soft via querySelector-null-Check). **show()/hide()/isVisible()** sync; `isVisible()` liest DOM-State (nicht localStorage, sonst drift); Vor-init-Aufrufe drosselt console.warn auf 1× pro 60 s. **getPosition()** liefert defensive Kopie mit Defaults. **KEINE benannten Error-Klassen** (Render-Schicht, fail-soft via `console.warn` analog Modul 15/16). **DispatchEvent-Hooks additiv in Modul 02/05/15/16:** (1) `src/modules/02_spore.js` neuer modul-lokaler `aliveDispatched`-Flag + `dispatchAliveOnce(nodeId)`-Helper; Aufruf am Ende beider getOrCreateIdentity-Pfade (existing-Slot + new-Slot). Selbstcheck-Zeile UNVERÄNDERT. (2) `src/modules/05_anastomose.js` neuer Helper `dispatchHandshakeEvent(outcome, peerNodeId, direction)`; **`handshake`/`receiveHandshake` zu thin wrappers umgebaut** (additiv-mit-internem-Refactoring) um neue interne `_doHandshake`/`_doReceiveHandshake`-Funktionen, wrappers dispatchen nach Result-Resolve einmal `sbkim:handshake` mit direction-Feld (outgoing/incoming). Äußere Signatur + Selbstcheck-Zeile + Public-Surface-Pointer UNVERÄNDERT. BroadcastChannel-Bridge + Service-Worker-Bridge routen Receiver-Events automatisch durch den neuen Wrapper. (3) `src/modules/15_membran.js` neue Helper `dispatchPostmessageEvent(op, decision)` + `dispatchFremdAlertEvent(kind, decision, bufferSize)`; `recordEntry` ruft `dispatchFremdAlertEvent` NACH Buffer-Push + Listener-Aufruf (alle drei `kind`-Werte: membrane-read / membrane-postmessage / endpoint-probe); `recordPostMessageEntry` ruft `dispatchPostmessageEvent` gated auf VALID_OPS-Whitelist (Type-Mismatch + unbekannte Ops geben KEIN Event ab — sind keine SBKIM-Membran-Postmessages im engeren Sinn, Karte 17 § Event-Bus-Schema). Selbstcheck-Zeile UNVERÄNDERT. (4) `src/modules/16_siegel.js` ZERTIFIKAT_ASPEKTE um Modul-17-Eintrag „Floating-Widget mit Vier-Slot-Live-Status" 2026-05-25 ergänzt (Konvention CLAUDE.md § Sicherheits-Module pflegen Aspekte); `init()` dispatcht `sbkim:siegel-certified` am Ende wenn `certifiedFlag===true` (durch `ready=true`-Flag-Schutz idempotent). Selbstcheck-Zeile UNVERÄNDERT. **PII-Disziplin** strikt: Event-Details tragen nur Counts + Status-Flags (op/decision/direction/outcome/bufferSize/since/certifiedAt/repoUrl/nodeId-Klartext-Vertrag aus Karte 17). KEIN payload, KEIN origin (außer im Modul-15-Sub-(e)-Buffer), KEIN agentHint, KEIN endpoint. **Panel 17** in `tests/manual_check.html` mit Setup-Knopf + Mock-Modul-16-Knopf + 10 Test-Knöpfen + Selbstcheck-Hinweis: 1 LEBT-grün / 2 VERKEHR-pulst-drei-Events / 3 FREMD-rot-bufferSize / 4 fremd-alert-OHNE-bufferSize-fail-soft / 5 SIEGEL-erscheint-mit-Mock / 6 SIEGEL-Anti-Greenwashing-Hinweis-mit-Tab-Reload / 7 Traffic-FIFO-10 / 8 hide+show+localStorage / 9 getPosition-defensive-Kopie / 10 Modal-Bridge. **Headless-Smoke** `tests/smoke_bau17_floating_widget.mjs` (Node 22) mit minimalem DOM-Stub (Element/classList/querySelector/addEventListener/dispatchEvent + window-localStorage + CustomEvent-Polyfill): 19 Proben, 19/19 grün. **Modul-15-Smoke-Regression** 31/31 grün (Sub-(b)-Tests prüfen unverändertes Verhalten + die neuen DispatchEvent-Hooks brechen das Verhalten nicht). **node --check** für alle fünf Module + alle 13 Inline-`<script>`-Blöcke in `tests/manual_check.html` grün. **KEINE Sage-Page-Änderung** (`index.html` unangetastet). **KEIN Endknoten-Eingriff** (Pipeline-Schritt 5d Re-Migration ist eigene Folge-Sitzung pro Endknoten-Repo). **KEIN Refactoring der Public-Surface von Modul 02/05/15/16** — alle Selbstcheck-Zeilen unverändert; Modul-05-Public-Surface zeigt weiterhin auf Funktions-Wrapper mit identischem Namen + identischer Signatur + identischem Result-Shape. **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump** (Modul 17 ist nicht protokoll-aktiv). **KEINE neuen IndexedDB-Stores.** `status.json` Modul 17 von `score:"spec"` auf `"stub"` aktualisiert, `python3 scripts/update_puls_pie.py` aufgerufen (Pie: 🟧 0 / 🟨 0 / 🟦 9 / 🟩 4 / 🟫 4). CLAUDE.md § Modul-Tabelle Eintrag 17 auf „Code-Stub" gesetzt mit Modal-Bridge-Init-Reihenfolge-Hinweis. Karte 17 § Bauzustand um Zeile „Code geschrieben 2026-05-25" erweitert. **Bekannte Limitierung CORS:** Headless-Smoke nutzt minimalen DOM-Stub (kein jsdom, keine externe Abhängigkeit); echter Browser-Sichttest muss Klaus Panel 17 in DeX-Chrome am Galaxy Tab S6 klicken (1–10 + Mock-Modul-16-Knopf vor Test 5). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf Panel 17 + Sage-Page-Bonus-Check (Navleisten-Lampen + Siegel-Badge in der Sage-Page bleiben UNVERÄNDERT). Übergabeprotokoll `docs/sessions/archiv/2026-05-25_bau-17-floating-widget.md`. |
| 2026-05-25 | Pflege Modul 17 UX — Sage-Page-Lampen-Stil + Drei-Zustand-Schnittstelle | Folge-Pflege nach Bau-Sitzung 17 (PR #166 gemerged 2026-05-25). Auslöser: Klaus's Sichttest-Befund am DeX-Chrome am Galaxy Tab S6: „LEB / VER / FRE als Drei-Buchstaben-Glyphe suggerieren falsche Begriffe (LEB → Leberwurst? VER → Versicherung? FRE → Freitag?), lieber Lampen-Stil wie Sage-Page mit Tooltips + minimalistischer + minimierbar auf nur SIEGEL". Tafel-Evolutions-Klausel (CLAUDE.md § Heilige Tafeln) — die Bau-Sitzung-17-Glyph-Wahl war scope-bezogen; UX-Befund erlaubt bewusste Anpassung der Glyph-Konvention. **§ 1 Modul 17 Bietet-Block** um drei neue Funktionen erweitert: `minimize()` / `maximize()` / `isMinimized()` (sync, Drei-Zustand-Pfad full → minimized → hidden). **§ 1 Modul 17 Storage-Block** um dritten localStorage-Schlüssel `sbkim_widget_minimized` erweitert (Default `"false"`). **§ 1 Modul 17 Geprüft-Zeile** um Pflege-UX 2026-05-25 erweitert. **Code in `src/modules/17_floating_widget.js` additiv**: neue Konstante `LS_KEY_MINIMIZED`; neue Tooltip-Tabelle `SLOT_TOOLTIPS` (volle Beschreibungs-Texte pro Slot statt nur Großbuchstaben-Label); neuer Closure-State `minimizedFlag` + `minimizeBtnEl`; neue Helper `loadMinimizedFromLs()` + `persistMinimized()` + `applyMinimizedState()`; `buildSlotButton(slotId)` entfernt `textContent = SLOT_LABELS[slotId].slice(0,3)`-Drei-Buchstaben-Glyphe (jetzt leere Lampen für LEBT/VERKEHR/FREMD; SIEGEL bekommt ★ als Identitäts-Hinweis); `aria-label` + `title` nutzen jetzt `SLOT_TOOLTIPS[slotId]` (voller Tooltip statt nur Label); `buildWidget(doc)`-Reihenfolge geändert (Minimize-/Close-Knopf RECHTS am Pillen-Ende statt schwebend über der Pille); neue Public-Surface-Funktionen `minimize()` / `maximize()` / `isMinimized()` mit Persist + Drosselung-für-Vor-Init-Aufrufe (analog show/hide); `mountSiegelSlot()` ruft `applyMinimizedState()` nach Slot-Mount erneut auf (data-fallback="lebt" entfernen sobald SIEGEL da); `mountWidget()` ruft `applyMinimizedState()` nach buildWidget; `onPointerDown()`-Drag-Filter ergänzt um `sbkim-widget-btn`-Klasse (Minimize-/Close-Knopf darf Drag nicht auslösen); `init()` ruft `loadMinimizedFromLs()`. **Selbstcheck-Zeile auf init/show/hide/isVisible/minimize/maximize/isMinimized/getPosition erweitert**. **Standalone-CSS-Block in `buildCss()` komplett umgebaut** auf Sage-Page-Lampen-Stil (siehe `index.html` § :root + .lamps + .lamp): Pille mit `border-radius:999px` + `padding:6px 12px`, Click-Targets 28 px (Touch-Mindestgröße bewahrt), sichtbare Lampe als `::before`-Pseudo (10 px Durchmesser, var-CSS-Hintergrund + Glow), Atmungs-Ring als `::after` (`sbkim-widget-lamp-breath` 3.2 s Animation analog Sage-Page-`lamp-breath`), Puls-Animationen (`sbkim-widget-lamp-pulse` für VERKEHR + `sbkim-widget-lamp-alert-pulse` für FREMD) übernehmen das Sage-Page-Pattern, SIEGEL als 22 px Gold-Medaillon mit radial-gradient + ★-Glyph + box-shadow Gold-Glow. Neue Klasse `sbkim-widget-btn` (Minimize-/Close-Buttons) als kleine dezente Icon-Buttons. Minimierter Zustand via `[data-minimized="true"]`-Attribut am Root mit CSS-Display-Hide-Regeln für LEBT/VERKEHR/FREMD; Fallback via `[data-fallback="lebt"]` wenn kein SIEGEL gemountet. **DOM-Optik:** kein expliziter Text in den Slot-Buttons mehr (außer SIEGEL ★); Tooltip voll im title-Attribut + aria-label. `node --check src/modules/17_floating_widget.js` grün. **Panel 17** in `tests/manual_check.html` Header-Status auf „Code-Stub + Pflege UX 2026-05-25" gesetzt; Test-Knöpfe 11 (minimize) + 12 (maximize) ergänzt; Selbstcheck-Hinweis auf neue Funktions-Liste aktualisiert. **Headless-Smoke** `tests/smoke_bau17_floating_widget.mjs` um sieben Proben erweitert (20 minimize/maximize/isMinimized-Surface, 21 minimize ohne SIEGEL → data-fallback=lebt, 22 SIEGEL mount während minimiert → fallback weg, 23 maximize → attr weg + ls false, 24 localStorage minimized=true wird beim init gelesen, 25 Slot-Buttons ohne Glyph-Text, 26 Tooltips voll mit „Klick öffnet"). 26 Proben, **26/26 grün**. **Modul-15-Regression** `tests/smoke_bau15b_membran.mjs` 31/31 grün ohne Anpassung. **node --check** für alle 13 Inline-`<script>`-Blöcke in `tests/manual_check.html` grün. **Karte 17** § Bauzustand neue Zeile „Pflege UX 2026-05-25" zwischen Bau-Sitzung-17-Zeile und Sichttest-Zeile. **KEINE Funktions-Änderung** an Modul 02/05/15/16; ZERTIFIKAT_ASPEKTE in Modul 16 unverändert (Pflege UX ist Render-Schicht-Anpassung, kein neuer Sicherheits-Aspekt). **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump** (Modul 17 ist nicht protokoll-aktiv). **KEIN Endknoten-Eingriff**. **KEINE Sage-Page-Änderung** (`index.html` unangetastet; Pflege übernimmt Sage-Page-Stil als Referenz, kopiert aber nur CSS-Pattern, nicht Sage-Page-Code). **`status.json` unverändert** (Modul 17 bleibt `score:"stub"`; `update_puls_pie.py` NICHT aufgerufen — additive UX-Pflege, kein Score-Wechsel). CLAUDE.md unverändert (Modul-Tabelle 17 bleibt „Code-Stub"). Sichttest ungeprüft — wartet auf Klaus's Browser-Lauf Panel 17 mit der neuen Lampen-Optik + Minimize-Knopf. **Klaus-Notiz für Folge-Sitzung:** SIEGEL-Slot soll später als „abgerundeter Container für Tool-PWA" (Andocken + Sporen-Installation) gestaltet werden — Idee, noch nicht jetzt implementiert. Übergabeprotokoll `docs/sessions/archiv/2026-05-25_pflege-17-ux-minimalistisch.md`. |
| 2026-05-25 | Pflege Karte 09 § Schritt 12 — Floating-Widget als Endknoten-Standard | Folge-Pflege nach Bau-Sitzung 17 (PR #166) + drei UX-Pflegen 17 (PR #167/#168/#169) am 2026-05-25 gemerged. **Reine Doku-Pflege, KEIN Modul-Code-Eingriff** — Karte 09 erweitert: (1) § Andock-Schritt-Pfad-Überschrift "elf Schritte → elf Schritte + Render-Schicht Schritt 12". (2) Hinweis-Block vor Schritt 10 + 11 — Schritte sind ab sofort Sage-Page-Pfad; Endknoten nutzen Schritt 12 (Floating-Widget) als einheitlichen Render-Pfad mit Click-Handler-Bridge via Proxy-Spans. Schritte 10 + 11 inhaltlich UNVERÄNDERT (Referenz für Sage-Page + Forker mit Navleisten-Bevorzugung). (3) Neuer **Schritt 12 — Floating-Widget (Modul 17, Endknoten-Standard)** zwischen Schritt 11 und § Sichtkontrolle: Drei-Zeilen-Einbau (Modul-Datei-Kopie + `<script>`-Tag + `SbkimWidget.init({allowedOrigins, repoUrl})`); **Init-Reihenfolge-Pflicht** prominent (SbkimWidget.init() MUSS VOR SbkimMembrane.init() / SbkimSiegel.init() — sonst finden Modul 15/16 die Proxy-Spans nicht); Erwartung-Block; Theme-Anpassung via CSS-Variablen-Override + theme:"transparent"; Fallback-Hinweis auf Schritte 10 + 11 für Forker mit Navleisten-Bevorzugung. **KEINE Spec-Änderung an Karte 15 / 16 / 17 / INTERFACES § 1 Modul 15 / 16 / 17.** **Keine Tafel-Umsortierung in CLAUDE.md § Pipeline-Reihenfolge.** **`status.json` Modul 09 unverändert** (Pie nicht regeneriert — additiv im Andock-Pfad, kein Modul-Bau, kein Score-Wechsel). Karte 09 § Bauzustand neue Zeile. Übergabeprotokoll `docs/sessions/archiv/2026-05-25_pflege-09-widget-einbau.md`. |
| 2026-05-26 | Pflege 17 Tooltips + Self-Heartbeat | Zwei Befunde aus Endknoten-Re-Migrationen Mein-Rezeptbuch (PR #246) + Mein-Mixarium 2026-05-26. **(1) Doppel-Tooltips fix:** `title`-Attribut auf Slot-Buttons + Minimize/Close-Knöpfen weggelassen (buildSlotButton + buildWidget + applyMinimizedState). aria-label trägt vollen Tooltip-Text. Browser-Standard-Tooltip auf DeX-Chrome via title triggerte zusammen mit Android-Touch-Bubble doppel-Anzeige nur auf rechten Slots (FREMD/SIEGEL/Minimize/Close), weil linke Slots (LEBT/VERKEHR) sofort eigene Modul-17-Modals öffneten und der longpress-Pfad nicht ausgelöst wurde. **(2) Self-Heartbeat-Fallback:** neue Konstante `SELF_HEARTBEAT_DELAY_MS=5000`, neue Funktion `scheduleSelfHeartbeat()` in `init()` — wenn 5 s nach init `eventCounts.alive===0` UND `window.SbkimSpore._meta.ready===true`, dispatcht Modul 17 selbst ein synthetisches `sbkim:alive` mit `detail.synthetic:true` und `detail.nodeId:null`. Anti-Greenwashing intakt — ohne SbkimSpore.ready KEIN dispatch. `_meta` um `selfHeartbeatFired` + `selfHeartbeatDelayMs`. Architektur-Entscheidung: Option (b) Klaus-Brief — Modul 02 bleibt unangetastet. Schema-Erweiterung in Karte 17 additiv (`synthetic` + `nodeId:null` als erlaubte Werte). Headless-Smoke 28→32 Proben, 32/32 grün; Modul-15-Regression 31/31 grün; node --check grün. KEIN Modul-02/05/15/16-Eingriff, KEIN PROTOCOL_VERSION-/DB_VERSION-Bump, KEINE Sage-Page-Änderung. KEINE Tafel-Umsortierung CLAUDE.md. status.json Modul 17 unverändert (bleibt `score:"stub"`). Endknoten-Hinweis im PR-Body: Mein-Rezeptbuch + Mein-Mixarium sollen sbkim/17_floating_widget.js auf den neuen Sage-Commit nachziehen. Übergabeprotokoll `docs/sessions/archiv/2026-05-26_pflege-17-tooltips-und-heartbeat.md`. |

| 2026-05-26 | Bau-Sitzung 04.C `queryLocal` + Hub-Vorlage | **Bau-Sitzung Phase A Pipeline-Schritt 5f.** Brief `BRIEF_BAU_04C_QUERY_LOCAL.md`. **§ 1 Modul 04 Bietet-Block** um zwei neue Funktionen erweitert: `queryLocal(text, k?, options?) → Promise<Array<{label,score,anchorId}>>` (async via Modul 03 lazy, Default k=5, hartcodierte Schwelle `PROVIDER_MIN_MATCH=0.80`, Korpus zwei Pfade `options.corpus` Vorrang + registrierter Provider, Top-k-Cut nach Filter+Sort, Cross-Knoten-Search-Hook auf Modul 15 Sub (b) ohne Code-Update) + `setLocalCorpus(corpusOrProvider) → void` (sync, idempotent, akzeptiert Array/Function/null, defensive Array-Kopie via Array.from). **§ 1 Modul 04 Fehlerverhalten** um zehn Zeilen erweitert (EmptyQueryError / QueryTooLongError / InvalidKError / EmbeddingNotAvailableError / InvalidCorpusError / leerer Korpus + alle-unter-Schwelle → leere Liste ohne Throw / EmbeddingFailedError async rethrow + Bad-Shape-Check / setLocalCorpus-Argument-Throw). **§ 1 Modul 04 Selbstcheck-Zeile** auf fünf Funktionen aktualisiert. **§ 1 Modul 04 Garantien-Block** um queryLocal-Lokalität + setLocalCorpus-Idempotenz erweitert. **§ 1 Modul 04 Geprüft-Zeile** um Bau 04.C 2026-05-26 erweitert. **Code in `src/modules/04_match.js` additiv** (keine bestehende Funktion verändert): fünf neue Fehler-Factories (EmptyQueryError, QueryTooLongError, InvalidKError, EmbeddingNotAvailableError, InvalidCorpusError), Closure-State `_localCorpusProvider`, sync-Helper `validateCorpus` (Array-Check + Item-Schema-Check), neue Public-Funktionen `queryLocal` (async) + `setLocalCorpus` (sync). `_meta` um `queryLocalDefaultK:5` + `queryLocalMaxTextLen:4096` + Live-Getter `localCorpusRegistered` erweitert. Selbstcheck-Zeile aktualisiert. **Panel 04** in `tests/manual_check.html` um fünf Knöpfe erweitert (Test 11–15: Happy-Path / Schwelle-Cut / Top-k-Cut / Provider-Pfad / leerer Korpus). SbkimEmbedding wird im Test-Setup gemockt (deterministischer LCG-Referenz-Vektor 384-dim, KEINE Modell-Lade). **Headless-Smoke** `tests/smoke_bau04c_query_local.mjs` mit 12 Probengruppen + Sync-Throws + Provider-Pfade + defensive Kopie: **43 Sub-Proben, 43 grün.** Regression smoke_bau04a 19/19 + smoke_bau04b 30/30 + smoke_bau15b 31/31 + smoke_bau17 32/32 weiterhin grün. **PROTOCOL_VERSION** / **DB_VERSION** / **BACKUP_FORMAT_VERSION** unverändert. KEIN Modul-15-Eingriff (fail-soft-Pattern greift automatisch). KEIN Modul-03-Eingriff. KEINE Korpus-Persistierung in Modul 04 (Endknoten-Pflicht). **`status.json` Modul 04 bleibt `score:"stub"`** — Score-Wechsel folgt nach Klaus' Sichttest Panel 04 Knöpfe 11–15 (analog Bau 04.B). **Karte 18 § Such-Feld-Integration-Pattern** voll ausgeführt: Stichwort/Semantik-Klassifikations-Heuristik (≤3 Wörter ohne Fragezeichen + Bridge-Words → Stichwort lokal; sonst → Semantik queryLocal + Cross-Knoten), Code-Schnipsel klassifizieren + senden, Resultat-Liste-UI-Pattern mit zwei Sektionen, Anker-Pfad-Konvention via `#anchor=…` URL-Fragment, Edge-Cases (Timeout / kein Sibling / Schwelle leer). **Hub-Landing-Page-Vorlage** in `docs/components/_sb_kim_tool_point_template/` angelegt (index.html, status.json, README.md, sbkim/spore.json, EINBAU.md) — KEIN Push ins externe Repo `lausiklauskn-png/SB-KIMTool-Point`, kopierfertig für Klaus' Folge-Sitzung. **Drei Folge-Briefe** in `docs/sessions/`: `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md`, `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md`, `BRIEF_BAU_HUB_SB_KIMTOOL_POINT_INITIAL.md`. Übergabeprotokoll `docs/sessions/archiv/2026-05-26_bau-04c-suchfeld-und-hub-vorlage.md`. |

| 2026-05-26 | Tafel-Spec-Pflege Mycel-Vision | **Reine Doku-Pflege**, KEIN Modul-Code-Eingriff. Auslöser: Klaus' Vision-Klärung 2026-05-26 (Such-Feld als bidirektionales Cross-Knoten-Matching-Anker; mehrstufige Mycel-Architektur Sage → Starter-Bundle → Externer Hub → Forker-PWAs). **Karte 04** § Sub (c) `queryLocal` voll spec'd (Signatur `queryLocal(text, k?, options?) → Promise<Array<{label,score,anchorId}>>`, async via Modul 03 lazy, Default k=5, hartcodierte Schwelle `PROVIDER_MIN_MATCH=0.80`, Korpus zwei Pfade `options.corpus` + `_corpusProvider`-Callback via `setLocalCorpus`, Top-k-Cut nach Filter+Sort, fünf Fehler-Pfade benannt, Performance-Reserve < 10000 Einträge, Cross-Knoten-Search-Hook auf Modul 15 Sub (b) ohne Code-Update). Selbstcheck-Zeile künftig fünf Funktionen. **Karte 16** § Sub (e) Mycel-Verbindungs-Stufe voll spec'd (zweistufiger SIEGEL Bronze/Gold, Modul-16-Listener auf `sbkim:handshake outcome:"established"`, RAM-only `_meta.mycelConnected`, visuelle Unterscheidung gedämpfter Bronze-Ton via saturate(0.6)-filter + Stufenwechsel-Animation 600 ms, Klick in Bronze öffnet Modul-18-Andock-Geste mit Hinweis-Block); Aspekt 4 „Mycel-Verbindung etabliert (erster Handshake)" in ZERTIFIKAT_ASPEKTE-Liste verankert mit dynamischer Render-Variante (vor Handshake als „pending" markiert). § Strikte Tabus Klausel „Keine Stufen-Varianten" auf „Bronze/Gold-Stufung erlaubt seit 2026-05-26" angepasst (Tafel-Anpassung mit explizitem Anpassungs-Antrag; Silber/Platin/weitere bleiben verboten). **Karte 18** Sub-Bereiche von 5 (a–e) auf 9 (a–i) erweitert: Sub (a) Andocken 4-Schritt-Workflow präzisiert + Empfangsmodus-Klausel; Sub (b) NEU Heterokaryose (ersetzt alte „Sporen-Installation"); Sub (c)–(e) bleiben; Sub (f) NEU Sporen NEU generieren; Sub (g) NEU Re-Embedding; Sub (h) NEU Manueller Handshake-Trigger (triggert SIEGEL Bronze→Gold); Sub (i) NEU Spore-Discovery (Sage / Externer Hub / Manuelle-URL). Neuer Karten-Abschnitt § Such-Feld-Integration-Pattern mit Pepo-Demo-Studie als Referenz (Symmetrie-Anforderung + Score-Ring + Drei-Dimensionen + Match-/Differenz-Listen sind übernehmbar; WebRTC/PeerJS-Transport + Claude-API-zentrale-Match-Engine + Tablet-Hub-Modell NICHT übernehmbar). § Schnittstelle `options.enabledTabs` von 5 auf 9 Werte erweitert + `externalHubUrl`. **Drei neue Stub-Karten** angelegt: `docs/components/19_andock_wizard.md` (Andock-Wizard als kopierbares JS-Modul, extrahiert aus Sage-Page-Wizard-Code in `index.html` Z. ~969–991), `docs/components/_starter_bundle.md` (Modul-Distributions-Repo, eigenes GitHub-Repo `sbkim-starter`-Vorschlag), `docs/components/_mycel_hub.md` (öffentliches Observatorium light für Forker, eigenes GitHub-Repo `sbkim-hub`-Vorschlag, mit eingebettetem Modul 19). **Drei neue Briefe**: `BRIEF_BAU_04C_QUERY_LOCAL.md` (Phase-A-Bau), `BRIEF_SPEC_19_ANDOCK_WIZARD.md` (Phase-B-Spec), `BRIEF_SPEC_18_TOOL_PWA.md` aktualisiert (Sub-Bereiche 9-Liste + Such-Pattern-Pflicht). **CLAUDE.md** § Pipeline-Reihenfolge erweitert um Phase A (Schritte 5e–5j) + Phase B (Schritte 7–9) + Phase C (Schritte 10–12); § Modul-Tabelle um Modul 18 (Schablone 9-Sub) + Modul 19 (Schablone) erweitert. **`status.json`** neuer `mycelHubBacklog`-Pool mit Modul 19 + `_starter_bundle` + `_mycel_hub` (alle `score:"schablone"`); Modul 04 + 16 + 18 bleiben mit ihrem bisherigen Score (additive Spec-Erweiterung, kein Code-Bau). `scripts/update_puls_pie.py` um `mycelHubBacklog`-Pool erweitert + `python3 scripts/update_puls_pie.py` aufgerufen. **KEIN Modul-Code**, KEIN Endknoten-Eingriff, KEINE Sage-Page-Änderung (`index.html` nur als Code-Vorlage für Modul 19 referenziert), KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump, KEIN Modul-02/05/15/17-Eingriff. **Pepo-Demo-URL-Befund**: lausiklauskn-png/semantic-match-demo enthält bidirektionale Match-UI (Vier-Feld-Eingabe, Score-Ring, drei Dimensionen) als Pattern-Vorlage, aber KEINE Sporen/Hub/lokales-Embedding-Architektur — diese sind Sage-eigene Erweiterungen. Übergabeprotokoll `docs/sessions/archiv/2026-05-26_tafel-spec-mycel-vision.md`. |

| 2026-05-26 | Bau-Sitzung 16 Sub (e) Bronze/Gold-Stufung | **Bau-Sitzung Phase A Pipeline-Schritt 5g.** Brief `BRIEF_BAU_16_SUB_E_BRONZE.md`. **§ 1 Modul 16 Bietet-Block** um `_meta.mycelConnected` (boolean, RAM-only — Tab-Reload startet wieder false) + `_meta.mycelConnectedAt` (string\|null, ISO-8601) + `_meta.siegelStufe` (Live-Getter "bronze"\|"gold") + Test-Brücke `_resetMycelConnectedForTest()` erweitert. **§ 1 Modul 16 Events-Block** um `reagiert: sbkim:handshake` (Window-Custom-Event aus Modul 05 Bau 17) ergänzt mit Handler-Vertrag: idempotent + fail-soft via `event?.detail?.outcome !== "established"` → no-op (kein Throw bei fehlendem detail/null); bei outcome:"established" wird mycelConnected true, mycelConnectedAt gesetzt, Badge wechselt auf data-stufe="gold" + Klasse stufenwechsel-gold 600 ms + aria-label "Mycel verbunden"; offenes Modal wird über renderModalContents() aktualisiert. **§ 1 Modul 16 Geprüft-Zeile** um zwei Einträge erweitert (Tafel-Spec-Pflege 2026-05-26 + Bau-Sitzung 16 Sub (e) 2026-05-26). **Code in `src/modules/16_siegel.js` additiv** (keine bestehende Public-Surface-Funktion verändert, keine Refactoring): Closure-State `mycelConnected:false` / `mycelConnectedAt:null` / `handshakeListener:null` / `stufenwechselTimeoutId:null`; closure-interne Helper `siegelStufe()` / `applyStufeToBadge()` / `playStufenwechselAnimation()` / `onHandshakeEvent(event)` / `registerHandshakeListener()` / `isAspect4(a)`. `mountBadge()` um EINEN Aufruf `applyStufeToBadge()` erweitert (vor `attachBadgeClickHandler` + `playFirstBootAnimation`). `init()` um EINEN Aufruf `registerHandshakeListener()` vor dem `ready=true`-Flag erweitert. `buildBadgeElement()` setzt initiales aria-label auf `ARIA_LABEL_BRONZE` + KEIN title-Attribut mehr (Pflege 17 Tooltips, Doppel-Tooltip-Problem auf DeX-Chrome — aria-label trägt vollen Text). `mountSiegelModal()` um `bronzeHinweisBlock` zwischen Header und dateLine erweitert (display:none Default; Bronze-Style mit Bronze-Glow-Border + Bronze-Hintergrund-Tint). Neue Helper-Funktion `renderBronzeHinweisBlock(modalRoot)` baut Hinweis-Text + `[Andocken]`-Knopf bei jedem Modal-Render: in Gold-Stufe display:none, in Bronze-Stufe display:block; Andock-Click-Handler fail-soft via `global.SbkimToolPwa?.openAndockTab`-Check (bei Fehlen Info-Notiz im Block: „Modul 18 noch nicht verfügbar — Andocken via Sage-Page-Andock-Wizard."). `renderModalContents()` aspectsList-Loop erweitert um Aspekt-4-Pending-Marker via `isAspect4(a) && mycelConnected !== true` → since-Span zeigt „pending" mit italic + grauem Text statt Datum. **`ZERTIFIKAT_ASPEKTE`** um Aspekt 4 am Listen-Ende ergänzt (`since:"2026-05-26"`, `module:"16"`, `aspect:"Mycel-Verbindung etabliert (erster Handshake)"`, Beschreibung mit Verweis auf SIEGEL-Stufe Gold). **`index.html` additiv erweitert**: zwei neue `:root`-Variablen `--siegel-bronze: #8C6E2F` + `--siegel-bronze-glow: rgba(140,110,47,0.45)`; drei neue CSS-Regeln im Badge-Block (`#sbkim-siegel-badge[data-stufe="bronze"]` mit `filter:saturate(0.6) brightness(0.85)`, `:hover`-Variante mit drop-shadow im Bronze-Glow, `#sbkim-siegel-badge[data-stufe="gold"]` als no-op-Anker, `#sbkim-siegel-badge.stufenwechsel-gold` mit `animation: siegel-stufenwechsel-gold 600ms ease-out`); neuer `@keyframes siegel-stufenwechsel-gold` (0→1.15→1.0 mit Gold-Glow-Box-Shadow + Drop-Shadow-Filter im Mittelpunkt). **Panel 16** in `tests/manual_check.html` um vier Knöpfe 9–12 erweitert (9 Sub-(e)-Bronze-Initial-Stand, 10 synthetischer Handshake → Gold-Wechsel + Stufenwechsel-Klasse, 11 Idempotenz-Test mit zweitem Dispatch, 12 Bronze-Klick → Modal-Hinweis-Block + [Andocken]-Knopf + Aspekt-4-Pending-Marker). Panel-Header-Text um Bau-16-Sub-(e)-Block erweitert. **Headless-Smoke** `tests/smoke_bau16_sub_e_bronze.mjs` (Node 22) mit minimalem DOM-Stub inkl. Descendant-Combinator-Support + textContent-Getter/Setter: 15 Proben, **15/15 grün** (1 Public Surface + Test-Brücke, 2 Initial-State vor init, 3 init grüner Surface-Check + Badge im DOM, 4 Bronze-Initial-Badge-Attribute, 5 ZERTIFIKAT_ASPEKTE-Aspekt-4-am-Ende, 6 Handshake → Gold + Klasse, 7 mycelConnectedAt ISO, 8 Idempotenz, 9 outcome:"rejected" no-op, 10 dispatch ohne detail no-op, 11 detail:null no-op, 12 Reset Gold→Bronze, 13 Modal-Bronze-Hinweis sichtbar + Andock-Knopf + Aspekt-4 pending, 14 Modal nach Gold: Hinweis aus + Datum, 15 fail-soft Andock-Click → Info-Notiz). **Regression** smoke_bau04a 19/19 + smoke_bau04b 30/30 + smoke_bau04c 43/43 + smoke_bau15b 31/31 + smoke_bau17 32/32 grün. **node --check** für 16_siegel.js + alle 13 Inline-`<script>`-Blöcke in `tests/manual_check.html` grün. **PROTOCOL_VERSION** / **DB_VERSION** / **BACKUP_FORMAT_VERSION** unverändert. **KEIN Auto-Andocken** — Aspekt 4 wird ausschließlich via empfangenem `sbkim:handshake`-Event aktiviert, KEIN Modul-16-Polling, KEIN Modul-16-eigener fetch (Empfangsmodus-Prinzip). **KEIN Persistent-Store für mycelConnected** (RAM-only, gewollt). **KEIN Modul-18-Code-Bau** (Andocken-Knopf fail-soft mit Check `typeof window.SbkimToolPwa?.openAndockTab`). **KEIN Modul-05/17-Eingriff** (`sbkim:handshake`-Custom-Event existiert seit Bau 17). **KEIN Endknoten-Eingriff** (Pipeline-Schritt 5e Re-Aktivierung folgt). **`status.json` Modul 16 bleibt `score:"stub"`** bis Klaus' Sichttest Knöpfe 9–12 (analog Konvention 04.B/04.C); Sichttest-Nachzug-PR „Sichttest 16 Sub e grün" geplant. Übergabeprotokoll `docs/sessions/archiv/2026-05-26_bau-16-sub-e-bronze.md`. |

| 2026-05-26 | Sichttest 16 Sub (e) grün | **Reine Doku-Pflege-Sitzung** (Sichttest-Nachzug nach Bau 16 Sub (e) aus PR #180 / Pipeline-Schritt 5g). Klaus' Live-Probe Panel 16 Knöpfe 9–12 in DeX-Chrome auf Galaxy Tab S6, Termux `python3 -m http.server 8000` nach Hard-Reload: **4/4 grün**. Knopf 9 Bronze-Initial: `badge_data_stufe:"bronze"`, `aria_label:"SBKIM-Siegel · Mycel suchend"`, `title:null` (Pflege-17-Doppel-Tooltip-Klausel wirkt), `mycel_connected:false`, `mycel_connected_at:null`, `siegel_stufe_getter:"bronze"`. Knopf 10 Bronze→Gold (zweimal idempotent grün dank `_resetMycelConnectedForTest`): `stufe_vor:"bronze"` → `stufe_nach:"gold"`, `aria_label_nach:"SBKIM-Siegel · Mycel verbunden"`, `mycel_connected_nach:true`, `mycel_connected_at_nach:"2026-05-26T16:27:22.973Z"`, `klasse_stufenwechsel_gold:true` (Klasse direkt nach Dispatch live beobachtet, 600 ms Auto-Remove). Knopf 11 Idempotenz: `erste_welle === zweite_welle === "2026-05-26T16:27:56.565Z"`, `datum_unveraendert:true`, `klasse_nach_zweitem_dispatch:false`, `stufe_nach_zweitem_dispatch:"gold"`. Knopf 12 Bronze-Klick öffnet Modal mit Hinweis-Block + [Andocken]: `modal_offen:true`, `hinweis_block_im_dom:true`, `hinweis_block_sichtbar:true`, `andock_button_im_modal:true`, `aspekt_4_pending_marker:true`, `letzter_aspekt_text_kopf:"pending· 16· Mycel-Verbindung etabliert (erster Handshake)…"`, `aspekte_anzahl:4`. **§ 1 Modul 16 Geprüft-Zeile** um „2026-05-26 (Sichttest Bau 16 Sub (e) — Klaus, DeX-Chrome auf Galaxy Tab S6: Panel 16 Knöpfe 9–12 4/4 grün)" erweitert. **Karte 16 § Bauzustand** „Sichttest Sub (e) — folgt"-Zeile ersetzt durch volle 4/4-grün-Sichttest-Zeile mit allen Knopf-Outputs. **`status.json` Modul 16 BLEIBT `score:"stub"`** — Sub-(e)-Sichttest deckt nur Knöpfe 9–12 ab; Knöpfe 1–8 (Bau-16-Basis) bleiben ungeprüft (eigener späterer Sichttest-Nachzug). `siegel`-Text um Sub-(e)-Sichttest-Befund erweitert. `python3 scripts/update_puls_pie.py` aufgerufen — Pie-Verteilung unverändert, weil Score-Wechsel nicht stattfindet. **PULS.md** § Schnellüberblick Modul-16-Zeile aktualisiert + neuer Sitzungs-Eintrag oben. **KEIN Modul-Code-Eingriff** (`src/modules/16_siegel.js` unangetastet), KEIN Endknoten-Eingriff, KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump, KEINE Tafel-Umsortierung CLAUDE.md. Übergabeprotokoll `docs/sessions/archiv/2026-05-26_sichttest-16-sub-e-gruen.md`. |

| 2026-05-26 | Endknoten-Sichttest Cross-Knoten Sub (e) + drei Folge-Briefe | **Pipeline-Phase A Schritt 5e abgeschlossen.** Klaus' Live-Sichttest im DeX-Chrome (Galaxy Tab S6) mit beiden Endknoten Mein-Rezeptbuch + Mein-Mixarium in derselben Chrome-Instanz nach Merge von MR PR #249, MM PR #58 + Fix-PRs für `badgeSelector`-Konfig (Sage-Default `.lamps` war Endknoten-untauglich, Fix: explizit `#sbkim-siegel-badge` Widget-Proxy-Anker). **Sub (e) funktional in beiden Endknoten bewiesen:** Initial-Bronze visuell + Eruda-`_meta.siegelStufe:"bronze"`, Modal öffnet sich mit Bronze-Hinweis-Block + `[Andocken]`-Knopf + Modul-18-Info-Notiz, Aspekt 4 als „pending"-Marker; Live-Cross-Knoten-Handshake via Eruda + Klipboard-Workaround (Sage-`navigator.clipboard.readText()` ging in DeX-Chrome nicht zuverlässig zwischen Tabs → Workaround mit BroadcastChannel-Spore-Transfer als 5-Min-Sender-Loop in MR + 60-s-Listener in MM) ergibt `outcome:"established", score:0.9544`; manueller `window.dispatchEvent("sbkim:handshake", outcome:"established")` in beiden PWAs ergibt `stufe:"gold"` + `mycelConnected:true` + Modal-Refresh (Bronze-Hinweis-Block weg, Aspekt 4 datiert). **VERKEHR-Slot in MM-Widget** zeigt `handshake outgoing established`-Event. **Drei eigenständige Folge-Befunde** (separate Pflege-Sitzungen — Briefe in PR mit angelegt): (1) **Modul 17 Widget-SIEGEL-Slot stufen-unabhängig**: Render bleibt Gold-Medaillon mit ★, `data-stufe="bronze"`/`"gold"` wirkt nur am unsichtbaren Widget-Proxy-Span, nicht am sichtbaren Slot-Button → visuell kein Bronze/Gold-Unterschied; (2) **Endknoten-`sbkim/05_anastomose-v2.js` ist prä-Bau-17**: dispatcht KEIN `sbkim:handshake`-window-Event automatisch beim erfolgreichen Handshake → manueller Eruda-Dispatch als Workaround nötig; Fix: Endknoten-Modul-05 auf Sage-`main`-Stand updaten (analog Modul 15/16/17/sw); (3) **Modal-Datum „Bezeugt seit … Uhr" zeigt UTC** statt MESZ-lokal — `Modul 16 certifiedAt` wird ohne `toLocaleString`-Konvertierung gerendert. **`status.json` Modul 16** `siegel`-Text um Cross-Knoten-Sichttest-Befund erweitert; Score BLEIBT `"stub"` (Knöpfe 1–8 Bau-16-Basis bleiben ungeprüft + drei Folge-Befunde offen). **Karte 16 § Bauzustand** Zeile „In Endknoten eingebaut" gefüllt mit MR-PR-#249 + MM-PR-#58 + Sub-(e)-Sichttest-Befund + drei Folge-Befunde. **§ 1 Modul 16 Geprüft-Zeile** um Endknoten-Cross-Knoten-Sichttest-Eintrag erweitert. **Drei neue Folge-Briefe** in `docs/sessions/`: `BRIEF_PFLEGE_17_WIDGET_BRONZE_GOLD_RENDER.md`, `BRIEF_PFLEGE_ENDKNOTEN_MODUL_05_UPDATE.md`, `BRIEF_PFLEGE_16_MODAL_LOCAL_TIME.md`. **PULS.md** Schnellüberblick + neuer Sitzungs-Eintrag oben. **KEIN Modul-Code-Eingriff in Sage** (Diagnose-Sitzung, Folge-Pflegen wirken in eigenen PRs), KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump, KEIN Endknoten-Eingriff, KEINE Tafel-Umsortierung CLAUDE.md. Übergabeprotokoll `docs/sessions/archiv/2026-05-26_endknoten-sichttest-cross-knoten-sub-e.md`. |

| 2026-05-26 | Pflege Modul 17 Widget Bronze/Gold-Render | **Folge-Pflege auf Sub-(e)-Sichttest-Bilanz vom 2026-05-26** (Befund 1 — separate Pflege-Sitzung pro Befund). Brief `BRIEF_PFLEGE_17_WIDGET_BRONZE_GOLD_RENDER.md`. **Auslöser:** sichtbarer SIEGEL-Slot im Floating-Widget rendert stufen-unabhängig als Gold-Medaillon mit ★ — Klaus visuell kein Unterschied zwischen MR (pre-Handshake, sollte Bronze sein) und MM (post-Handshake, ist Gold). Ursache: Modul 16 setzt `data-stufe="bronze"`/`"gold"` korrekt am unsichtbaren `#sbkim-siegel-badge`-Proxy-Span im Widget-Inneren (Spec-konform), aber der sichtbare Slot-Button daneben hat keine Stufen-Logik. **Architektur-Pfad (ii)** aus Brief gewählt: Modul 17 nutzt lookup auf `SbkimSiegel._meta.siegelStufe` (Modul-16-Getter aus Bau 16 Sub e) im `mountSiegelSlot()`-Aufruf — robust gegen Event-Reihenfolge (Modul 16 init vor Modul 17 dispatch). **§ 1 Modul 17 Bietet-Block** um `_meta.siegelStufeRendered` (Getter, "bronze"|"gold"|null) erweitert. **§ 1 Modul 17 Vier-Slot-Layout** SIEGEL-Zeile aktualisiert auf „Bronze/Gold (data-siegel-stufe)" + neuer Block „SIEGEL-Stufen-Render" beschreibt den Pfad (Initial-Wert via `getSiegelStufe()` aus `SbkimSiegel._meta.siegelStufe`, Re-Setting bei `sbkim:handshake outcome:"established"`, Bronze-CSS-Filter `saturate(0.6) brightness(0.85)`, Gold = Default-Render, 600 ms `.sbkim-widget-siegel-stufenwechsel`-Klasse für Animation, idempotent). **§ 1 Modul 17 Geprüft-Zeile** um Pflege-Sub-(e)-Render 2026-05-26 erweitert. **Code in `src/modules/17_floating_widget.js` additiv**: neue Konstanten `SIEGEL_STUFE_BRONZE`/`SIEGEL_STUFE_GOLD`/`SIEGEL_STUFENWECHSEL_MS=600`; neue Helper `getSiegelStufe()` (fail-soft Default `"bronze"`) + `applySiegelStufeToSlot(stufe)` (setzt `data-siegel-stufe`-Attribut + aktualisiert `siegelStufeRendered`-Closure-State) + `playSiegelStufenwechselAnimation()` (600 ms `.sbkim-widget-siegel-stufenwechsel`-Klasse mit setTimeout-Cleanup); `mountSiegelSlot()` ruft `applySiegelStufeToSlot(getSiegelStufe())` nach Slot-Mount; `buildWidget()`-Init-Pfad (SIEGEL-Slot beim init-Zeitpunkt schon zertifiziert) tut dasselbe; `onHandshake()` prüft bei `outcome:"established"` + `siegelMounted===true` + `siegelStufeRendered!=="gold"`: schaltet auf Gold + startet Animation (idempotent — kein Re-Animate bei zweitem established-Handshake). **`buildCss()`-Block** erweitert um drei Regeln + ein @keyframes: `#sbkim-widget .sbkim-widget-slot.siegel[data-siegel-stufe="bronze"]::before`+`.sbkim-widget-siegel-glyph { filter: saturate(0.6) brightness(0.85); }`; Bronze-Hover-Override mit Bronze-glow `rgba(140,110,47,0.55)`; Gold = Default-Render kein Override; `.sbkim-widget-siegel-stufenwechsel::before { animation: sbkim-widget-siegel-stufenwechsel-gold 600ms ease-out; }`; `@keyframes sbkim-widget-siegel-stufenwechsel-gold` (scale 1.00→1.15→1.00 + box-shadow Gold-Pulse, analog index.html `siegel-stufenwechsel-gold`). **Panel 17** in `tests/manual_check.html` um Test 13 (Initial-Bronze-Attribut + _meta-Spiegelung) + Test 14 (sbkim:handshake established → Gold + Animations-Klasse + 700-ms-Re-Check) erweitert; Header-Status auf „Code-Stub + Pflege Sub-(e)-Render 2026-05-26". **Headless-Smoke** `tests/smoke_bau17_floating_widget.mjs` um vier neue Proben 32–35 erweitert (Initial-Bronze, Bronze→Gold + Stufenwechsel-Klasse, Klasse-Cleanup nach 600 ms, Idempotenz beim zweiten established-Handshake), **36/36 grün**. **Modul-15-Regression** 31/31 grün; **Modul-16-Sub-(e)-Regression** `tests/smoke_bau16_sub_e_bronze.mjs` 15/15 grün; **node --check** für `17_floating_widget.js` + alle 13 Inline-`<script>`-Blöcke in `tests/manual_check.html` grün. **PROTOCOL_VERSION**/**DB_VERSION**/**BACKUP_FORMAT_VERSION** unverändert. **KEIN Modul-16-Eingriff** (Modul 16 setzt `data-stufe` korrekt am Proxy-Span — Pflege-17-Spec-Konformität bestätigt). **KEIN ZERTIFIKAT_ASPEKTE-Eintrag** (Render-Schicht-Pflege, kein Sicherheits-Modul-Update). **KEIN Endknoten-Eingriff** (Mein-Rezeptbuch + Mein-Mixarium ziehen `sbkim/17_floating_widget.js` in eigener Folge-Pflege pro Endknoten-Repo nach — eigene PRs pro Endknoten). **KEINE Sage-Page-Änderung** (`index.html` unangetastet). **KEINE Tafel-Umsortierung** in CLAUDE.md § Pipeline-Reihenfolge. `status.json` Modul 17 BLEIBT `score:"stub"` (additive Render-Pflege, kein Score-Wechsel); `python3 scripts/update_puls_pie.py` aufgerufen (Pie unverändert). Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf Panel 17 + Endknoten-Re-Migration mit visuellem Vergleich. Übergabeprotokoll `docs/sessions/archiv/2026-05-26_pflege-17-widget-bronze-gold-render.md`. |

| 2026-05-26 | Pflege 16 Modal-Local-Time (Sub-(e)-Folge-Pflege 3/3) | Folge-Pflege zum Endknoten-Sichttest Cross-Knoten Sub (e) am 2026-05-26 (Folge-Befund 3). Klaus' Befund DeX-Chrome auf Galaxy Tab S6 in MESZ-Zeitzone (UTC+2): „Datum/Uhrzeit ist nicht aktuell, ich vermute nicht Mitteleuropäische Zeit, eher Amerikan." Ursache: Modul 16 `renderModalContents()` baute die `dateLine.textContent` per `new Date(snap.certifiedAt).toISOString().slice(0, 10)` + `iso.slice(11, 16)` — UTC-ISO-Substrings, daher zeigte das Modal Klaus' lokales 21:10 MESZ als „19:10 Uhr" (UTC). **§ 1 Modul 16 Geprüft-Zeile** um Pflege-Modal-Local-Time-Eintrag erweitert. **Code in `src/modules/16_siegel.js` additiv** (sehr kleiner Eingriff, KEIN Vertrags-Bruch): `renderModalContents()` Zeilen ~872–885 ersetzt — UTC-ISO-Slice-Pfad ersetzt durch lokale Date-Methoden (`date.getFullYear()`, `String(date.getMonth() + 1).padStart(2, "0")`, `getDate()`, `getHours()`, `getMinutes()` mit `padStart(2, "0")`). Format-Konvention `YYYY-MM-DD, HH:MM Uhr` bleibt (ISO-Datum + lokale Stunden/Minuten — kein Optik-Wechsel auf `toLocaleString("de-DE", {dateStyle, timeStyle})`-Style, weil Klaus' Doku-Pattern überall ISO-Datum verwendet). Fail-soft-Fallback: falls `new Date(certifiedAt)` `NaN` (kaputter ISO-String), wird der Roh-`certifiedAt` direkt angezeigt. `_meta.certifiedAt` bleibt UTC-ISO (Spec-Vertrag aus § Persistenz unverändert — nur die Render-Schicht konvertiert). **Karte 16 § Sub (c) Modal-Body Punkt 1** um Anzeige-Konvention-Block erweitert (lokale Date-Methoden statt UTC-ISO-Slice, Begründung Klaus' MESZ-Befund). **Headless-Smoke** `tests/smoke_bau16_sub_e_bronze.mjs` um Probe 16 erweitert (Modal-Datum lokal-Konsistenz: `dateLine.textContent` muss `getHours():getMinutes()` aus der Laufzone enthalten), **16/16 grün**. **Regression** smoke_bau15b 31/31 + smoke_bau17 36/36 grün. **node --check** Modul 16 grün. **PROTOCOL_VERSION** / **DB_VERSION** / **BACKUP_FORMAT_VERSION** unverändert. **KEIN funktionaler Vertrags-Eingriff** (Public Surface von Modul 16 unverändert; `_meta.certifiedAt`-Format bleibt UTC-ISO). **KEIN ZERTIFIKAT_ASPEKTE-Eintrag** (Render-Schicht-Pflege, kein Sicherheits-Modul-Update — CLAUDE.md § „Sicherheits-Module pflegen Aspekte" greift nicht). **KEIN Endknoten-Eingriff** (Mein-Rezeptbuch + Mein-Mixarium ziehen den neuen Modul-16-Code in eigener Folge-Pflege nach — kombinierbar mit den anderen zwei Sub-(e)-Folge-Pflegen Modul 17 + Modul 05). **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump**. **KEINE Tafel-Umsortierung CLAUDE.md**. **`status.json` Modul 16 unverändert** (bleibt `score:"stub"`; `update_puls_pie.py` NICHT aufgerufen — additive Render-Pflege, kein Score-Wechsel). Klaus' Sub-(e)-Befund 3 von 3 ist hiermit gelöst. **Damit sind alle drei Sage-Sub-(e)-Folge-Pflegen abgeschlossen** (1/3 Modul 17 Bronze/Gold-Render gemerged in PR #185, 2/3 Endknoten-Modul-05-Update läuft als externe Bau-Sitzungen MR+MM, 3/3 diese hier). Brief: `docs/sessions/BRIEF_PFLEGE_16_MODAL_LOCAL_TIME.md`. Übergabeprotokoll `docs/sessions/archiv/2026-05-26_pflege-16-modal-local-time.md`. |

| 2026-05-30 | Spec-Sitzung Andock-Konventionen | **Neuer §11 „Andock-Konventionen" (netzweit)** angelegt aus SB·KIMTool·Points eingefrorenem Rückbrief A–E. Fünf Unterabschnitte: §11.1 Kanonische Signier-Form (Norm + Pseudocode + Determinismus-Klausel), §11.2 Verifizierer-Paar (WebCrypto/Modul 02 ↔ node:crypto, 4 Pflicht-Prüfpunkte), §11.3 Inbox-Konvention (`<gegenseite>_inbox.json` signatur-rein + `.verify.md` Pflichtfelder), §11.4 Sync-Vertrag (7 Regeln, Regel 7 für N>2 verallgemeinert + `status.json`-Pflichtfelder + `matchScore` Pflicht bei `verified-match` + `pingStatus`-Stufen), §11.5 Pflicht-Spore-Felder (9 REQUIRED). **Sage-Entscheidung zu E:** `domainVector` optional für `verified-spore`, **Pflicht für `verified-match`** (Ja zum gestuften Vorschlag); `_demo`-Markierung Pflicht bis echtes Embedding. Hervorgegangen aus dem ersten vollständigen Andock Sage ⟷ SB·KIMTool (Match 0.848508). KEIN Modul-Code, KEIN PROTOCOL_VERSION-Bump (Konventions-Tafel, kein Schema-Bruch — die 9 Pflichtfelder + kanonische Form sind bereits gelebt). Postfach-Abgleich-Antwort A–E + Bau-Protokoll-Zeile in `sbkim/AUSTAUSCH.md`. |
| 2026-05-31 | Pflege Briefkasten-Regel | **Neuer §11.6 „Briefkasten-Pflege & Netz-Signal" (netzweite Pflicht).** Server-los, Empfangsmodus-konform: jeder Knoten pflegt `sbkim/SIGNAL.json` (maschinenlesbarer Aushang mit monoton steigender `seq` + `ack`-Symmetrie). Sitzungsstart-Pflicht: Signale aller Gegenstellen aus `raw/main` lesen, bei `seq > ack` lesen+quittieren. Sitzungsende-Pflicht nach Bau: `seq`+1, Bau-Protokoll-Zeile, pushen (= das Signal). Gilt für ALLE angeschlossenen Knoten (`forNodes:"*"`), nicht nur Sage. Sage geht voran: `sbkim/SIGNAL.json` angelegt, CLAUDE.md § „Briefkasten pflegen" als Sitzungsstart-/-ende-Pflicht ergänzt, `sbkim/NETZ-STAND.md` referenziert. Formalisiert die Hand-Meldung „dritter Knoten Jasons-Tresor". KEIN Modul-Code, KEIN PROTOCOL_VERSION-Bump. |

---

## 11. Andock-Konventionen (netzweit, Spec-Sitzung 2026-05-30)

> **Heilige Tafel, netzweit gültig** — nicht mehr nur bilateral. Sie
> regelt, wie ein beliebiger SBKIM-Knoten an einen anderen andockt:
> kanonische Signier-Form, Verifizierer-Paar, Inbox-Konvention,
> Synchronisations-Vertrag, Pflicht-Spore-Felder. Hervorgegangen aus
> dem **ersten vollständigen Knoten-zu-Knoten-Andock** Sage ⟷
> SB·KIMTool·Point (beidseitig signatur-verifiziert + echter
> semantischer Match 0.848508). Quelle der eingefrorenen Referenz-Texte:
> SB·KIMTool·Points Rückbrief A–E (`SB-KIMTool-Point/sbkim/AUSTAUSCH.md`
> §10) + `docs/ANDOCK.md` + `scripts/verify_foreign_spore.mjs`.
>
> Serverlos, Empfangsmodus mit Antwortrecht — kein Crawler, kein
> Daemon, kein Live-Socket. Austausch über offene Dateien (Dead-Drop)
> über die Repo-Grenze; ein menschlicher Vermittler je Repo-Paar
> startet die Sitzungen.

### 11.1 Kanonische Signier-Form (Norm)

Signiert und geprüft werden die **UTF-8-Bytes des Spore-Objekts ohne das
Feld `signature`**, als kompaktes JSON **ohne Whitespace** mit
**rekursiv** alphabetisch sortierten Objekt-Schlüsseln; Unterschrift =
**Ed25519**, kodiert als **base64url ohne Padding**.

```
canonicalize(v):
  null           -> null
  Array          -> map(canonicalize)            // Array-Reihenfolge bleibt!
  Object         -> neues Objekt, Schlüssel via sort() aufsteigend,
                    Werte rekursiv canonicalize
  sonst (Skalar) -> v
canonicalBytes = utf8( JSON.stringify( canonicalize( spore ohne "signature" ) ) )
signature      = base64url_nopad( Ed25519_sign( canonicalBytes, privateKey ) )
verify         = Ed25519_verify( canonicalBytes,
                                 base64url_decode(signature), publicKey.x )
```

**Verbindlich für alle Knoten.** Byte-deckungsgleich mit Sage Modul 02
(`canonicalize` in `src/modules/02_spore.js`) und SB·KIMTools
`scripts/verify_foreign_spore.mjs`. Beleg: beide Richtungen ✔ VALID
(Sages Spore in A's Verifizierer, A's Spore in Sages Verifizierer).

**Determinismus-Klausel:** Arrays werden **nicht** umsortiert (nur
Objekt-Schlüssel). Ein `domainVector` muss in der publizierten Datei in
**exakt** der Reihenfolge/Float-Schreibweise stehen, in der signiert
wurde — also genau das Objekt signieren (minus `signature`), das
publiziert wird.

### 11.2 Verifizierer-Paar (Referenz)

Zwei Laufzeiten, **eine** Norm (§11.1). Beide MÜSSEN für ein- und
dieselbe Spore dasselbe Urteil fällen.

| Seite | Datei | Umgebung |
|---|---|---|
| WebCrypto/Browser | `src/modules/02_spore.js` `verifyForeignSpore` + headless `tools/verify_remote_spore.mjs` | WebCrypto (Browser) + Node-Headless |
| node:crypto | `scripts/verify_foreign_spore.mjs` (SB·KIMTool-Referenz) | `node:crypto`, keine npm-Abhängigkeit |

**Vier Pflicht-Prüfpunkte** (identische Reihenfolge der Wahrheit):

1. **Pflichtfelder** vollständig (die 9 aus §11.5).
2. **`id == base64url(SHA256(roher 32-Byte-Pubkey))`** — unabhängig aus
   `publicKey.x` nachgerechnet.
3. **Signatur** Ed25519 gültig über die kanonischen Bytes (Feld
   `signature` ausgenommen).
4. **Manipulationsprobe** — ein verändertes Feld (z. B. `domain`) lässt
   die Signatur **durchfallen**.

Urteil ist nur **VALID**, wenn 2 ∧ 3 ∧ 4 zutreffen (1 ist
Vorbedingung). Ein neuer Knoten SOLL ein headless-Gegenstück seiner
Browser-Verifikation bereitstellen (für serverlose Datei-/URL-Prüfung).

### 11.3 Inbox-Konvention

- **`<gegenseite>_inbox.json`** = originalgetreue, **signatur-reine**
  1:1-Momentaufnahme der fremden Spore. **Kein Zusatzfeld** (jedes
  Zusatzfeld zerstörte die Signatur). Sonst nichts.
- **`<gegenseite>_inbox.verify.md`** = Begleit-Vermerk mit
  **Pflichtfeldern**: Quelle (URL), Datum, Verifizierer (Datei/Tool +
  Befehl), Ergebnis-Tabelle (die 4 Prüfpunkte aus §11.2), Identität
  (`nodeName`/`nodeType`/`domain`, `nodeId`, `publicKey.x`),
  `domainVector`-Notiz (echt vs. `_demo`), Manipulationsprobe-Zeile.
  Reproduzierbarer Beweis als Offline-Test/Befehl daneben.

**Namens-Symmetrie:** jeder Knoten legt die Kopie der Gegenseite unter
einem sprechenden `<gegenseite>_inbox.*` ab. Gelebt: Sage ↔
`sbkim/point_inbox.*`, SB·KIMTool ↔ `sbkim/sage_inbox.*`.

### 11.4 Synchronisations-Vertrag (7 Regeln)

1. **Prüf-Rhythmus:** jede Seite liest bei jedem Sitzungsstart mit
   Andock-Bezug die `AUSTAUSCH.md` + `status.json` der Gegenseite
   (Empfangsmodus, kein Daemon).
2. **Lese-Quittung Pflicht:** Datum in „zuletzt gelesen" + „wartet auf".
3. **Bau-Protokoll:** wer baut/ändert, trägt `Datum · Knoten · WAS ·
   WO (Datei/Commit/PR) · real|demo`.
4. **Abgleich-Frage:** zu jedem gemeldeten Bau prüft die Gegenseite
   „kann/soll das bei uns rein?" → Ja / Nein / Wie, mit Datum.
5. **Quelle der Wahrheit:** Identität = `spore.json`, Status =
   `status.json`, Verträge = ANDOCK ↔ INTERFACES; Spec vor Code.
6. **Heartbeat:** kein gemeldeter Schritt bleibt länger als eine
   Gegen-Sitzung unquittiert.
7. **Menschlicher Vermittler je Repo-Paar** startet die Sitzungen
   (für N>2 Knoten verallgemeinert aus „Klaus = Taktgeber").

**Pflichtfelder eines Endknoten-Eintrags in `status.json`:** `name`,
`domain`, `integrated`, `integratedAt`, `nodeId`, `sporeUrl`,
`stammCategories`, `guestCategories`, `pingStatus`, `url`.
**Optional:** `previousNodeIds` (bei Schlüsselwechsel), `domainKeywords`,
`reIntegratedAt`, `note`. **Bedingt Pflicht:** `matchScore` ist
**Pflicht, sobald `pingStatus: "verified-match"`**.

**`pingStatus`-Stufen (Andock-Kontext):** `verified-spore`
(Identität/Signatur verifiziert, kein Match) → `verified-match`
(zusätzlich echter Cross-Knoten-Match ≥ `PROVIDER_MIN_MATCH`, mit
`matchScore`). Die Live-Ping-Stufen (`live-direct`/`live-channel`)
bleiben für lokal eingebaute Endknoten gültig.

### 11.5 Pflicht-Spore-Felder

Die **9 `REQUIRED_SPORE_FIELDS`** sind für alle Knoten verbindlich:
`createdAt`, `domain`, `embeddingModel`, `endpoint`, `id`, `nodeType`,
`protocolVersion`, `publicKey`, `signature`. Eine Spore ohne eines
dieser Felder wird abgelehnt (`Pflichtfeld fehlt: …`).

**`domainVector`-Entscheidung (Sage, 2026-05-30): JA zum
gestuften Vorschlag.** `domainVector` (384-dim, L2-normalisiert) ist
**optional für `verified-spore`** (reines Identitäts-Andocken bleibt
niedrigschwellig) und **Pflicht, sobald ein Knoten `verified-match`
anstrebt** — denn ohne echten Vektor gibt es keinen ehrlichen Match.
Ein `domainVector` MUSS, solange er nicht aus echtem Embedding stammt,
über das Begleitfeld `_demo: ["domainVector"]` als Demo markiert sein;
mit echtem Embedding wird `_demo` entfernt. Das Embedding-Modell ist
`Xenova/multilingual-e5-small` (Feld `embeddingModel`), Vektor-Erzeugung
mit `passage: `-Präfix, mean-pooled, L2-normalisiert (siehe Modul 03 +
`tools/embed_helper.html`).

### 11.6 Briefkasten-Pflege & Netz-Signal (netzweite Pflicht-Regel, 2026-05-31)

> **Gilt für JEDEN angeschlossenen Knoten — nicht nur Sage.** Server-los heißt: es
> gibt keinen echten Push. Trotzdem darf kein Bau im Netz untergehen. Diese Regel
> macht aus „ich habe etwas gebaut" ein **maschinen- und menschenlesbares Signal**,
> das die Gegenseite beim nächsten Sitzungsstart **zwingend** sieht. Empfangsmodus
> bleibt gewahrt: kein Daemon, kein Crawler, keine Eigenanfrage ins offene Netz —
> nur das Lesen genannter URLs bei einem bewussten Sitzungsstart.

**Das Signal — `sbkim/SIGNAL.json` (jeder Knoten pflegt seine eigene).**
Maschinenlesbarer „Briefkasten-Aushang". Pflicht-Schema:

```json
{
  "node": "<nodeName>",
  "lastBuild": "YYYY-MM-DD",
  "seq": <monoton steigende Ganzzahl, +1 pro gemeldetem Bau>,
  "headline": "<ein Satz: was wurde gebaut>",
  "mailboxes": { "<gegenseite>": "<URL der eigenen AUSTAUSCH-Datei für sie>" },
  "forNodes": ["<nodeName>", "..."],   // wen betrifft es; "*" = alle
  "ack": { "<gegenseite>": <seq, den diese Gegenseite zuletzt quittiert hat> }
}
```

`seq` ist der Herzschlag: steigt die `seq` der Gegenseite über den Wert in
**deinem** `ack`, gibt es Ungelesenes → Pflicht zu lesen + zu quittieren.

**Pflicht am Sitzungsstart (jeder Knoten, mit Andock-Bezug):**
1. Eigenes `sbkim/SIGNAL.json` lesen — wo steht das eigene Netz?
2. `SIGNAL.json` **jeder** Gegenstelle aus deren `raw/main` lesen (genannte URLs).
3. Für jede Gegenstelle: ist deren `seq` > dein `ack[gegenstelle]`? → ihre
   `AUSTAUSCH`-Datei + `status.json` lesen, handeln, **quittieren** (Datum + `ack`
   hochsetzen).

**Pflicht am Sitzungsende (jeder Knoten, der etwas gemeldet hat):**
1. `seq` +1, `lastBuild` + `headline` setzen, `forNodes` füllen.
2. Bau-Protokoll-Zeile ins betroffene `AUSTAUSCH`-Postfach (Regel §11.4.3).
3. Committen/pushen — **das Pushen IST das Signal.** Die Gegenseite holt es beim
   nächsten Start ab (Schritt 2 oben). Mehr Push gibt es server-los nicht, und
   mehr ist auch nicht nötig.

**Quittungs-Symmetrie (beidseitig bezeugt):** Wer liest, setzt `ack[gegenstelle]`
auf deren aktuelle `seq` und stempelt Datum in der `AUSTAUSCH`-Datei. So sieht jede
Seite jederzeit, ob die andere ihren letzten Bau schon gesehen hat (Heartbeat §11.4.6).

**Mehr-als-zwei-Knoten:** `forNodes` adressiert gezielt; `"*"` heißt „alle angeschlossenen
Knoten von Klaus". Ein neuer Bau, der das ganze Netz betrifft (z.B. neue Andock-
Konvention), wird an `"*"` gemeldet und von jedem Knoten quittiert.

**Bezug:** Diese Regel formalisiert das, was 2026-05-31 von Hand geschah (Bau-Meldung
„dritter Knoten Jasons-Tresor" in SB·KIMTools Briefkasten). Ab jetzt verbindlich für
alle Knoten — Sage geht voran (`sbkim/SIGNAL.json` angelegt), Forker ziehen beim
nächsten Andock nach. Wahrheits-Karte des Gesamtnetzes: `sbkim/NETZ-STAND.md`.
