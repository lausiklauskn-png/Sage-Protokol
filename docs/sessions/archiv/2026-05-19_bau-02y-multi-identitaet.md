# Übergabeprotokoll — Bau-Sitzung 02.Y Multi-Identitäts-API + Backup-Schema-Bump in Modul 02

**Datum:** 2026-05-19
**Sitzungs-Rolle:** Bau-Sitzung (kein Spec, kein Modul-Vertrag-Eingriff
jenseits Modul 02 — und auch dort nur Geprüft-Zeile-Eintrag, KEIN
Vertrags-Drift).
**Branch:** `claude/bau-02y-multi-identitaet-iRl02` (Harness-Suffix;
gemeinte Konvention `claude/bau-02y-multi-identitaet` aus dem Brief).
Zweite Bau-Sitzung der Bau-Sitzungs-Brief-Pipeline aus Brief 99 (Klaus'
Wahl 2026-05-19: **logische Reihenfolge — Infrastruktur weiter**).

**Voraussetzung:** Bau 01.Y (PR #102 gemerged 2026-05-19, `main`
`8a07ed5`) ist erfüllt — `SbkimStorage.ensureStore` ist produktiv
verfügbar. Brief-Datei `docs/sessions/BRIEF_BAU_02Y_MULTI_IDENTITAET.md`
gemerged 2026-05-19 (PR #103, `main` `d237988`).

**Kern (drei Sätze):** Modul 02 hat jetzt die vollständige Multi-
Identitäts-API aus Brief 04 — fünf neue / erweiterte Funktionen
(`setActiveIdentity` / `getActiveIdentityKey` / `listIdentities` /
`removeIdentity` plus optionaler `key`-Parameter auf
`getOrCreateIdentity` / `generateOwnSpore` / `getOwnSpore`) — und
schreibt identitäts-spezifische Stores pro Persona über
`SbkimStorage.ensureStore(...)`. Das Backup-Wrapper-Schema ist von
`BACKUP_FORMAT_VERSION = 1` auf `2` gebumpt (Multi-Identitäts-Backup
„kompletter Rucksack" aus INTERFACES.md § 9.6 Pkt. 2); alte
v=1-Backups bleiben über `importBackup` lesbar (Rückwärts-Kompat zu
Klaus' Mein-Mixarium- / Mein-Rezeptbuch-Backups vom 2026-05-16). KEINE
Modul-01/05/06/07-Änderung — der transparente Slot-Pfad in den
Konsumenten 05 / 06 / 07 kommt in 05.Y / 06.Y / 07.Y nach.

---

## Sechs Punkte a–f des Briefes

### a) INTERFACES.md drei kleine Eingriffe (KEIN Vertrags-Drift)

- **§ 0 Globale Konstanten:** `BACKUP_FORMAT_VERSION` von `1` auf `2`
  gesetzt, mit Kommentar zur Bau-02.Y-Begründung (Multi-Identitäts-
  Backup-Schema mit Pflicht-Feld `payload.identities[]`; alte Backups
  `version === 1` bleiben importierbar).
- **§ 1 Modul 02 Geprüft-Zeile** um „2026-05-19 (Bau 02.Y Multi-
  Identitäts-API + Backup-Schema-Bump)" erweitert. KEIN Eingriff in
  Bietet / Storage / Fehlerverhalten — der Vertrag steht aus Brief 04
  (gemerged 2026-05-19) und ist im Code-Stand dieses Baus eins-zu-eins
  abgebildet.
- **§ 9.6 Pkt. 2 Stand-Hinweis** am Ende der Trade-off-Klausel ergänzt
  („Stand 2026-05-19: Bau-Folge-Sitzung 02.Y vom 2026-05-19 hat den
  Backup-Schema-Bump 1→2 sowie die fünf neuen / erweiterten API-
  Funktionen gebaut; siehe § 1 Modul 02 Bietet-Block"), analog zum
  § 9.5-Stand-Hinweis aus Bau 01.Y.
- **§ 10 Änderungsprotokoll** neue Zeile „2026-05-19 · Bau-Sitzung 02.Y
  Multi-Identitäts-API + Backup-Schema-Bump" mit voller Bau-
  Beschreibung.

### b) Karte 02 (`docs/components/02_spore.md`) nachgezogen

- **§ Schnittstelle Einleitungs-Satz** auf „vierzehn öffentliche
  Funktionen ab Brief 04 (2026-05-19) plus Bau 02.Y (2026-05-19, Code-
  Stand)" aktualisiert.
- **§ Storage** neuer Sub-Block „**Identitäts-Slot-Vertrag (Brief 04 /
  Bau 02.Y)**" mit Tabelle (acht Einträge: zwei Single-Slot-Maps +
  fünf identitäts-spezifische Store-Basen + `active-identity`-Marker),
  Pattern-Verweis auf § 9.2, Erklärung der `ensureStore`-Aufrufe pro
  Persona-Slot, Default-Slot-Klausel.
- **§ Datenformat „Backup-Format"** umfassend nachgezogen: Wrapper-
  Schema-Bump `version: 1` → `version: 2` dokumentiert (mit Hinweis
  auf Lese-Asymmetrie); Klartext-Payload-Schema bei
  `payload-schema-version: 2` mit neuem Pflicht-Feld `identities[]`
  (Array je Slot: `key` / `nodeId` / `keys` / `spore` / `siblings`);
  optionales Top-Level-Feld `active-identity` für den aktiven Slot;
  Migrations-Hinweis „Alte Backups (`version: 1`) bleiben importierbar —
  main-Slot wird automatisch erzeugt".
- **§ Konfigurationswerte** `BACKUP_FORMAT_VERSION` auf `2` und
  `BACKUP_PAYLOAD_SCHEMA_VERSION` auf `2` nachgezogen, Erklärung der
  Liste `BACKUP_FORMAT_VERSION_READ_OK = [1, 2]`. KEIN modul-lokaler
  Schema-Pflege-Eintrag (das Schema lebt im Wrapper, § Datenformat
  trägt die Definition).
- **§ Fehlerverhalten** zwei neue Zeilen (`UnknownIdentityError` von
  `setActiveIdentity` bei unbekanntem key, `RemoveActiveIdentityError`
  von `removeIdentity` ohne force auf aktiver Identität, dazu eine
  Idempotenz-Zeile „removeIdentity bei unbekanntem key → kein Throw,
  resolves mit false"); `BackupSchemaError`-Zeile um „leere
  identities[]-Liste nach Decrypt" als zusätzlichen Auslöser erweitert;
  `BackupOverwriteError`-Zeile um Pro-Slot-Klausel ab Bau 02.Y
  (Sammel-Error mit kollidierenden Slot-Keys) erweitert.
- **§ Risiken** zwei neue Punkte:
  - „Mid-Operation-Identitäts-Wechsel nicht spezifiziert (Bau 02.Y)" —
    Verweis auf INTERFACES § 9.3-Hinweis; Folge-Spec darf einen Hook
    nachreichen, Bau 02.Y liefert ihn NICHT.
  - „Backup-Schema-Migration v1 → v2 ist asymmetrisch (Bau 02.Y)" —
    Lesen beider Versionen, Schreiben nur v=2; alte 02.X-Code-Pfade
    können 02.Y-Backups nicht importieren (Down-Grade nur über
    Re-Export mit alter Modul-Version möglich).
- **§ Manueller Test** drei neue Knöpfe 8 / 9 / 10 dokumentiert mit
  vollständigen Erwartungen + Cleanup-Hinweis zu den leeren
  Identitäts-spezifischen Stores `*_test` (Modul 01 bietet keinen
  `dropStore`-Pfad).
- **§ Bauzustand** zwei neue Zeilen: „Bau 02.Y Multi-Identitäts-API +
  Backup-Schema-Bump 2026-05-19" (vollständige Bau-Beschreibung) +
  „Sichttest (Bau 02.Y) 2026-05-19 — ungeprüft, weil headless gebaut,
  wartet auf Klaus' Browser-Lauf".

### c) `src/modules/02_spore.js` erweitert (additiv, kein Refactoring)

- **`BACKUP_FORMAT_VERSION`** modul-lokal von `1` auf `2` hochgezogen.
  Neue Konstante `BACKUP_FORMAT_VERSION_READ_OK = [1, 2]` — `importBackup`
  akzeptiert beide; `exportBackup` schreibt nur die aktuelle Version 2.
- **Neue Konstante `BACKUP_PAYLOAD_SCHEMA_VERSION = 2`** modul-lokal
  (war 1 in Bau 02.X). Im Klartext-Payload wird das Feld
  `"payload-schema-version": 2` geschrieben.
- **Neue Konstante `IDENTITY_STORE_BASES`** mit den fünf identitäts-
  spezifischen Store-Basen aus INTERFACES.md § 9.2 (`sbkim_siblings`,
  `sbkim_anastomosis_log`, `sbkim_legacy_inbox`, `sbkim_hetero_inbox`,
  `sbkim_hetero_outbox`).
- **Neue Konstanten** `META_STORE = "sbkim_meta"`,
  `ACTIVE_IDENTITY_META_KEY = "active-identity"`,
  `DEFAULT_IDENTITY_KEY = "main"` (war früher `IDENTITY_KEY`).
- **Zwei neue Fehler-Factories** `UnknownIdentityError` (sync, von
  `setActiveIdentity`) und `RemoveActiveIdentityError` (sync, von
  `removeIdentity` ohne force) — Factory-Stil analog Modul 00 / 08 / 02.X.
- **In-Memory `identityCache`** von Singleton-`null|{...}` auf
  `Map<key, IdentitySnapshot>` erweitert (additiv, kein Bruch des
  Vertrags); `resetIdentityCache()` leert die ganze Map.
- **In-Memory `activeIdentityKeyCache`** als Lese-Cache für
  `getActiveIdentityKey` (sync-Anker; `setActiveIdentity` /
  `removeIdentity` / `resetIdentityCache` invalidieren bzw. setzen ihn).
- **Neuer Closure-Helper `ensureIdentityStores(key)`**: ruft seriell
  `SbkimStorage.ensureStore("sbkim_<base>_<key>")` für alle fünf
  Store-Basen. **Bewusst seriell, nicht `Promise.all`** — parallele
  ensureStore-Aufrufe würden alle gegen dieselbe alte `db.version`
  racen und sich gegenseitig blockieren (mehrfache Versions-Bumps auf
  die gleiche Ziel-Version). Bau 01.Y dokumentiert die lineare
  Choreografie.
- **Neuer Closure-Helper `ensureMetaStore()`**: `sbkim_meta` wird in
  Modul 01 NICHT als Pflicht-Store deklariert (würde Modul-01-Eingriff
  bedeuten); stattdessen legt Modul 02 den Store via
  `SbkimStorage.ensureStore("sbkim_meta")` lazy beim ersten Lese-/
  Schreib-Zugriff an. Modul-lokaler `metaStoreEnsured`-Flag verhindert
  redundante ensureStore-Aufrufe (Bau-01.Y-Idempotenz wäre auch ohne
  Flag korrekt, aber schont das pro-Aufruf-`db.transaction`).
- **Erweiterung `getOrCreateIdentity(key)`:**
  1. Default-Slot `"main"`, Rückwärts-Kompat zum Singleton-Vertrag.
  2. Cache-Hit pro Slot → return cached snapshot.
  3. Cache-Miss → `sbkim_keys[key]`-Read; existiert → in Cache laden.
  4. Existiert nicht → Identitäts-Erzeugung (Ed25519
     `crypto.subtle.generateKey` + `exportKey("jwk")`).
  5. **VOR dem ersten Schreibvorgang in identitäts-spezifische
     Stores:** `ensureIdentityStores(key)` rufen; bei
     `EnsureStoreError`-Reject Rollback via `storage.del(sbkim_keys,
     key)` — vermeidet halb-angelegte Identitäten.
  6. Snapshot in Map-Cache, return.
- **Neue Funktion `setActiveIdentity(key)`:** sync-TypeError bei
  nicht-String-key; `await storage.get(sbkim_keys, key)` —
  `UnknownIdentityError` bei null (kein Storage-Schreibvorgang);
  idempotent (no-op wenn key bereits aktiv); schreibt
  `sbkim_meta["active-identity"]`; ruft `resetIdentityCache()` (damit
  nachfolgende getNodeId/getOwnSpore-Aufrufe die neue Identität
  liefern).
- **Neue Funktion `getActiveIdentityKey()`:** Cache-Hit → return;
  Cache-Miss → `await storage.get(sbkim_meta, "active-identity")`;
  null/undefined → return `"main"` (Default), Cache schreiben.
- **Neue Funktion `listIdentities()`:** `await storage.all(sbkim_keys)`
  → Map auf `key`-Felder; `Array.prototype.sort()` lexikographisch
  (JS-Default für Strings, stabile Reihenfolge wie in INTERFACES
  gefordert); return.
- **Neue Funktion `removeIdentity(key, options)`:** TypeError bei
  nicht-String-key; `force = opts.force === true`; existing-Check
  via `storage.get(sbkim_keys, key)` — null → return false (idempotent,
  kein Throw, wie `forgetSibling`); aktiv-Check via
  `getActiveIdentityKey()` — `RemoveActiveIdentityError` ohne force;
  force-Pfad auf aktiver Identität: `SbkimApoptose._sendLegacyForIdentity`-
  Hook fail-soft (typeof-check, `console.warn` wenn fehlt, kein Throw);
  Lösch-Pfad in INTERFACES § 1 Modul 02-konformer Reihenfolge:
  `del(sbkim_keys)` → `del(sbkim_spore)` → fünf `clear(...)` (fail-soft
  via try/catch um `UnknownStoreError` — ein Slot muss nicht alle fünf
  Stores haben); Cache-Map-Eintrag für `key` löschen; bei aktiver
  Identität neue aktive Identität wählen (Vorrang: `"main"` → erster
  Slot aus `listIdentities()` → Marker löschen); `resetIdentityCache()`
  am Ende; return true.
- **Erweiterung `generateOwnSpore(meta, key)`:** Default-Slot via
  `await getActiveIdentityKey()`; bestehender Sign-Pfad unverändert,
  persistiert nach `sbkim_spore[slotKey]` statt `sbkim_spore["main"]`;
  `ensureIdentityStores(slotKey)` als Vorsichts-Pfad (idempotent,
  falls der Slot aus einem Backup-Import stammt).
- **Erweiterung `getOwnSpore(key)`:** Default-Slot via
  `await getActiveIdentityKey()`; `await storage.get(sbkim_spore,
  slotKey)`; return `sporeJson` oder null.
- **Erweiterung `exportBackup(password)`:** Mindest-Längen-Check
  unverändert; `await getOrCreateIdentity(DEFAULT_IDENTITY_KEY)` für
  den frischen-PWA-Pfad; `listIdentities()` iteriert; pro Slot
  `buildIdentityEntry(slotKey)` → Eintrag mit `{key, nodeId, keys,
  spore, siblings}` (siblings fail-soft via try/catch um den slot-
  spezifischen Store); `payload.identities[]` als Array; zusätzlich
  `payload["active-identity"]` als optionales Top-Level-Feld; Wrapper
  schreibt `version: 2`, `payload-schema-version: 2`; **alte Top-Level-
  Felder `nodeId`/`keys`/`spore`/`siblings` bleiben im Payload
  befüllt** (konservative Down-Grade-Kompat — KEINE Pflicht aus Brief 04,
  aber eine bewusste Wahl: ein altes 02.X-importBackup soll den
  Top-Level-Pfad weiter lesen können, falls jemand ein Down-Grade
  braucht; Karte 02 § Datenformat dokumentiert beides).
- **Erweiterung `importBackup(blob, password, options)`:** Bestehende
  Vor-Checks unverändert; **Wrapper-Version-Check akzeptiert
  `version: 1` ODER `version: 2`** (`BACKUP_FORMAT_VERSION_READ_OK`-
  Liste); Decrypt + Schema-Check unverändert; **bei `version === 1`**
  alter Pfad — `identities[]` wird intern aus den Top-Level-Feldern
  `nodeId`/`keys`/`spore`/`siblings` als ein-Eintrags-Liste mit
  `key: "main"` migriert (Rückwärts-Kompat zum Bau-02.X-Format);
  **bei `version === 2`** neuer Pfad — `payload.identities[]` ist
  Pflicht; Pflicht-Vor-Check „mindestens eine Identität im Container"
  (`BackupSchemaError` bei leerer Liste); Pro-Slot-Schema-Check
  (`key` / `nodeId` / `keys.privateKey` / `keys.publicKey` / `spore`);
  **Pro-Slot-`BackupOverwriteError`-Check** ohne force — Sammel-Error
  mit allen kollidierenden Slot-Keys, kein Schreibvorgang bis der
  Container überschreibbar ist; pro Slot
  `ensureIdentityStores(entry.key)` → `put(sbkim_keys, ...)` →
  `put(sbkim_spore, ...)` → siblings-Loop in
  `sbkim_siblings_<entry.key>`; Active-identity-Marker setzen
  (Vorrang: optionales `payload["active-identity"]` → `"main"` falls
  im Container → erster Slot); `resetIdentityCache()` am Ende; return
  `{restored: true}`.
- **`window.SbkimSpore`** im Export-Block um die fünf neuen / erweiterten
  Funktionen + die zwei neuen Fehler-Factories ergänzt.
- **Selbstcheck** auf 14 Funktionen erweitert: `init/getOrCreateIdentity/
  getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/
  verifyForeignSpore/setActiveIdentity/getActiveIdentityKey/
  listIdentities/removeIdentity/resetIdentityCache/exportBackup/
  importBackup`.
- **`_meta`** um zwei neue Anker erweitert: `backupFormatVersion: 2`
  (nachgezogen), `backupFormatVersionReadOk: [1, 2]` (Lese-Liste),
  `identityStoreBases` (Liste der fünf Store-Basen für Tests),
  `metaStore`, `activeIdentityMetaKey`, `defaultIdentityKey`.
- `node --check src/modules/02_spore.js` grün.

### d) `tests/manual_check.html` Panel 02 um drei Knöpfe erweitert

- **Knopf 8 „Identität anlegen + wechseln":** `getOrCreateIdentity('test')`
  → `listIdentities()` → `setActiveIdentity('test')` →
  `getActiveIdentityKey()` → `getNodeId()`; Log: nodeId von „main" vor
  dem Wechsel, nodeId von „test" nach dem Wechsel,
  `listIdentities()` zeigt `["main", "test"]`. Status-Chip „Identitäts-
  Wechsel OK" bei Erfolg.
- **Knopf 9 „Identität entfernen (force)":**
  `removeIdentity('test', {force:true})` plus zweiter Aufruf für
  Idempotenz-Probe; Log: active-identity vor/nach (= „test"/„main"),
  `getNodeId()` liefert wieder main-nodeId, zweiter Aufruf gibt
  `false`. Status-Chip „Persona-Apoptose OK" bei Erfolg.
- **Knopf 10 „Backup mit Multi-Identität":** Setup `getOrCreateIdentity`
  für main + test mit Spore-Generation; `exportBackup` mit
  Klartext-Decrypt-Anzeige (`identities.length === 2`, Slot-Keys, Slot-
  nodeIds, `active-identity`-Feld); Download-Link analog Knopf 6.
  Status-Chip „Multi-ID-Backup OK" bei Erfolg.
- Cleanup-Hinweis: Test-Slot wird in Knopf 9 gelöscht; die identitäts-
  spezifischen Stores `*_test` bleiben als leere Stores in IndexedDB
  (siehe Karte 02 § Risiken „Backup-Schema-Migration"-Hinweis; manueller
  Cleanup über DevTools).
- Alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html`
  syntaktisch validiert (`node --check` pro extrahiertem Block).

### e) Übergabeprotokoll

Diese Datei: `docs/sessions/archiv/2026-05-19_bau-02y-multi-identitaet.md`.

### f) Smoke-Test mit `fake-indexeddb` (headless, Node 22)

Skript: `tests/smoke_bau02y.mjs`. Lädt `01_storage.js` und `02_spore.js`
in einem isolierten Function-Scope, simuliert eine echte PWA-Sitzung
und prüft 33 Punkte.

| # | Probe | Erwartet | Ergebnis |
|---|---|---|---|
| 1 | Exporte — 14 Funktionen | alle vorhanden | ✓ alle 14 vorhanden |
| 2 | Errors `UnknownIdentityError` + `RemoveActiveIdentityError` | typeof function | ✓ function/function |
| 3 | `_meta.backupFormatVersion` | 2 | ✓ 2 |
| 4 | `_meta.identityStoreBases.length` | 5 | ✓ 5 |
| 5 | `init()` resolves | void | ✓ |
| 6 | `getOrCreateIdentity()` default | nodeId 43-char-String | ✓ |
| 7 | `getOrCreateIdentity('test')` | nodeId ≠ main-nodeId | ✓ verschieden |
| 8 | `listIdentities()` lexikographisch | `[main, test]` | ✓ `["main","test"]` |
| 9 | `setActiveIdentity('test')` | `getActiveIdentityKey() === "test"` | ✓ test |
| 10 | `getNodeId()` nach Wechsel | test-nodeId | ✓ |
| 11 | `generateOwnSpore` default = aktiver Slot | `spore.id === main-nodeId` | ✓ match |
| 12 | `generateOwnSpore(meta, 'test')` | `spore.id === test-nodeId` | ✓ match |
| 13 | `setActiveIdentity('unknown')` | `UnknownIdentityError` | ✓ |
| 14 | `removeIdentity(active)` ohne force | `RemoveActiveIdentityError` | ✓ |
| 15 | `removeIdentity('test', {force:true})` Rückgabe | `true` | ✓ |
| 16 | active-identity nach force-Remove | `"main"` | ✓ |
| 17 | `listIdentities()` nach force-Remove | `[main]` | ✓ |
| 18 | `getNodeId()` nach force-Remove | main-nodeId | ✓ |
| 19 | `removeIdentity` idempotent (zweiter Aufruf) | `false` | ✓ |
| 20 | `exportBackup` wrapper.version | 2 | ✓ |
| 21 | `exportBackup` payload-schema-version | 2 | ✓ |
| 22 | `payload.identities.length` | 2 | ✓ |
| 23 | `payload.identities[].key` Slots | `[main, test]` | ✓ |
| 24 | `payload["active-identity"]` | Slot im Container | ✓ main |
| 25 | vor Import: leere PWA | `[]` | ✓ |
| 26 | `importBackup` leere PWA | `{restored:true}` | ✓ |
| 27 | `listIdentities` nach Import | `[main, test]` | ✓ |
| 28 | active-identity nach Import | Slot aus payload | ✓ main |
| 29 | `importBackup` zweiter Lauf ohne force | `BackupOverwriteError` | ✓ |
| 30 | v=1-Backup-Import in leere PWA | `{restored:true}` | ✓ |
| 31 | v=1-Backup-Import → main-Slot angelegt | `[main]` | ✓ |
| 32 | v=1-Backup-Import → active-identity = main | `"main"` | ✓ |
| 33 | `importBackup` unbekannte Wrapper-Version (99) | `BackupVersionMismatchError` | ✓ |

**Total: 33 Proben, 33 grün, 0 rot.** Aufruf-Zeit auf Container-Node-22:
~7 Sekunden (dominant: zwei PBKDF2-600 000-Aufrufe für Export + Import).

Was die headless Probe **nicht** abdeckt: DevTools-Application-IndexedDB-
Sichtbarkeits-Kriterium (Stores erscheinen visuell in der Browser-
DevTools), `onversionchange`-Verhalten zwischen mehreren echten Tabs
derselben Origin, AES-GCM-Verhalten in Safari iOS, PBKDF2-600 000-
Aufruf-Zeit auf Galaxy Tab S6 (~1–2 s erwartet). Diese vier Aspekte
prüft erst Klaus' Browser-Sichttest.

---

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Reihenfolge: INTERFACES Geprüft-Zeile +
  § 9.6 Stand-Hinweis ZUERST, DANN Karte 02, DANN Code. KEIN
  Vertrags-Drift gegen Brief 04 — der Modul-02-Bietet-/Storage-/
  Fehler-Block ist BEREITS in INTERFACES gespiegelt (durch Brief 04,
  gemerged 2026-05-19); Bau 02.Y hat NUR die Geprüft-Zeile + § 9.6-
  Stand-Hinweis + § 0 BACKUP_FORMAT_VERSION + § 10 Änderungsprotokoll
  nachgezogen.
- **§ 9.6 Pkt. 2 ist Backup-Bump-Spec.** Bau 02.Y bumpt
  `BACKUP_FORMAT_VERSION` von 1 auf 2 (additiv); Klartext-Payload-
  Pflicht-Feld `identities[]`; Pflicht-Vor-Check „mindestens eine
  Identität im Container"; `BackupOverwriteError`-Klausel **pro Slot**
  (nicht mehr nur für „main"). KEIN Eingriff in § 9.6, nur Stand-
  Hinweis am Ende analog § 9.5-Stand-Hinweis von Bau 01.Y.
- **Aufrufer-Konvention für `ensureStore`.** Modul 02 ruft
  `SbkimStorage.ensureStore("sbkim_<base>_<key>")` PRO Persona-Slot,
  BEVOR er den ersten Schreibvorgang in einen davon macht. Aufrufe in
  `getOrCreateIdentity(key)` (für neue Slots) und in `importBackup`
  (für Slots aus dem Backup, die in der aktuellen DB noch nicht
  existieren). Idempotenz von `ensureStore` garantiert, dass parallele
  oder wiederholte Aufrufe kein Problem sind. **Pflege-Befund während
  des Baus:** parallele `ensureStore`-Aufrufe via `Promise.all` führen
  zu Versions-Bump-Races (alle bumpen gleichzeitig von `db.version` auf
  `db.version + 1`); Helper `ensureIdentityStores` ruft seriell (siehe
  Code-Kommentar mit Begründung).
- **`active-identity`-Marker.** Modul 02 ist alleiniger Schreiber des
  `sbkim_meta["active-identity"]`-Markers (`setActiveIdentity`,
  `removeIdentity` force-Fall mit Fallback-Logik); KEIN Storage-Eingriff
  von Modul 02 auf andere `sbkim_meta`-Felder. Default „main" wenn das
  Feld fehlt. **Pflege-Befund während des Baus:** `sbkim_meta` ist
  KEIN Pflicht-Store in Modul 01 (Brief 04 hat den Marker spezifiziert,
  aber keine Modul-01-Eingriffs-Klausel beigefügt); Modul 02 ruft
  `ensureStore("sbkim_meta")` lazy beim ersten Zugriff (Bau 01.Y
  Option A) — KEIN Modul-01-Eingriff nötig.
- **Identitäts-Cache invalidieren bei Wechsel.** `setActiveIdentity(key)`
  ruft intern `resetIdentityCache()`; `removeIdentity` ruft am Ende
  ebenfalls `resetIdentityCache()`. Bestehende `resetIdentityCache`-
  Konvention (Pflege 2026-05-15) unverändert in der äußeren Signatur;
  intern leert sie jetzt die ganze Map + den `activeIdentityKeyCache`.
- **Backup-Schema-Migration.** `BACKUP_FORMAT_VERSION = 1` bleibt
  LESBAR durch `importBackup` (additiver Bump, Liste
  `BACKUP_FORMAT_VERSION_READ_OK = [1, 2]`); v=1-Backups bekommen
  intern eine ein-Eintrags-Liste `identities = [{key: "main", ...}]`
  aus den Top-Level-Feldern. `exportBackup` schreibt IMMER `version: 2`
  (kein Auswahl-Parameter — Aufwärts-Kompat ist gut, Aufwärts-Schreiben
  wäre Schritt zurück). Klaus' bestehende Mein-Mixarium- /
  Mein-Rezeptbuch-Backups vom 2026-05-16 (alle `version: 1`) bleiben
  in 02.Y-Code importierbar — Smoke-Test-Probe 30/31/32 bestätigt.
- **Vermächtnis-Versand pro Persona.** `removeIdentity(key,
  {force:true})` löst pro-Persona-Apoptose aus. Modul 02 ruft den
  Modul-07-Hook `_sendLegacyForIdentity(key)` **fail-soft**: typeof-
  check auf `SbkimApoptose._sendLegacyForIdentity`, `console.warn` wenn
  fehlt (Bau 07.Y noch nicht eingespielt), kein Throw — `try/catch` um
  den Hook-Aufruf schluckt Fehler mit `console.warn` (Persona-Apoptose
  läuft weiter). Heilige-Tafel-Grund: 07.Y und 02.Y können in
  beliebiger Reihenfolge gemerged werden.
- **Bestehende Funktionen unangetastet.** `init`, `getNodeId`,
  `getPublicKeyJwk`, `verifyForeignSpore`, `resetIdentityCache`
  bleiben in ihrer äußeren Signatur gültig für Singleton-Aufrufer
  ohne `key`-Parameter (`getNodeId`/`getPublicKeyJwk` lösen jetzt
  intern den aktiven Slot auf, das ist Rückwärts-Kompat-konform).
  `exportBackup`, `importBackup` haben Form-Erweiterungen aber kein
  Refactoring. `generateOwnSpore` / `getOwnSpore` / `getOrCreateIdentity`
  sind um den optionalen `key`-Parameter erweitert mit Default
  `getActiveIdentityKey()` bzw. `"main"`.
- **`PROTOCOL_VERSION` bleibt `"0.1"`.** Multi-Identitäts-Schema ist
  lokales Storage-Schema, kein Spore-Feld. **`DB_VERSION` bleibt `4`**
  (Bau 01.Y hat das gesetzt; neue identitäts-spezifische Stores
  entstehen dynamisch via `ensureStore`). **`BACKUP_FORMAT_VERSION` von
  1 auf 2** (additiver Bump des separaten Backup-Wrapper-Schemas aus
  § 0, KEIN `PROTOCOL_VERSION`-Eingriff).
- **Selbstcheck-Format** in INTERFACES § 1 Modul 02 bereits auf 14
  Funktionen spezifiziert. Code-Selbstcheck-String auf die volle Liste
  nachgezogen.

---

## Was NICHT angefasst

- **Keine Modul-05/06/07-Änderung.** Transparenter Slot-Pfad kommt in
  05.Y / 06.Y / 07.Y. Module 05/06/07 lesen `getActiveIdentityKey()`
  **heute noch nicht** — Bau 02.Y baut nur die Modul-02-API, die sie
  morgen rufen werden.
- **Keine Modul-07-`_sendLegacyForIdentity`-Implementierung.** Der Hook
  ist im Modul-07-Vertrag (Brief 04) spezifiziert, Implementation kommt
  in 07.Y. Bau 02.Y ruft fail-soft mit typeof-check + console.warn.
- **Kein Modul-01-Eingriff.** `ensureStore` (Bau-01.Y-Stand) wird als
  Konsument benutzt; `sbkim_meta` wird über die dynamische
  Store-Erzeugung (Bau-01.Y-Option-A) angelegt — KEINE neue Pflicht-
  Store-Definition in Modul 01.
- **Kein `PROTOCOL_VERSION`-Bump.** Multi-Identität ist lokales
  Storage-Schema; Backup-Wrapper ist separat versioniert.
- **Kein `DB_VERSION`-Bump.** Bau 01.Y hat das auf 4 gesetzt; identitäts-
  spezifische Stores entstehen via `ensureStore`.
- **Keine Sage-Page-Änderung** (Sage-Page-Refactor ist eigene Bau-
  Sitzung in Brief 99-Liste).
- **Keine CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 02 ist bereits
  `score:"fertig"` (Live-Andock-Beweis 2026-05-16); Multi-Identitäts-
  API ist additive Erweiterung, kein Score-Wechsel.
- **Keine `generateOwnSpore`-Allow-List-Erweiterung für
  `embeddingNeeds`/`embeddingCapabilities`.** Diese Felder kommen aus
  Brief 03 und werden in Bau 04.A im Modul-04-Pfad gebaut — Bau 02.Y
  berührt das nicht. Wenn Klaus' Spore bereits `embeddingCapabilities`
  trägt, geht das durch den bestehenden `domainKeywords`-Allow-List-
  Pfad aus Pflege Stamm/Gast (2026-05-15) — Allow-List akzeptiert
  `Array.isArray(meta.embeddingCapabilities)` nicht, das ist Brief-
  03-Bau-Folge-Sitzung-Pflege.

---

## Manueller Sichttest

**ungeprüft, weil headless gebaut — wartet auf Klaus' Browser-Lauf.**

Klaus' Drei-Stufen-Probe in `tests/manual_check.html` Panel 02:

1. **Knopf 8 „Identität anlegen + wechseln":** in DevTools → Application
   → IndexedDB → `sbkim` (oder `sbkim_<dbSuffix>`) müssen nach dem
   Klick fünf neue Stores erscheinen: `sbkim_siblings_test`,
   `sbkim_anastomosis_log_test`, `sbkim_legacy_inbox_test`,
   `sbkim_hetero_inbox_test`, `sbkim_hetero_outbox_test`. Plus
   `sbkim_meta` mit Eintrag `"active-identity": "test"`. Log zeigt
   beide nodeIds + `listIdentities() === ["main", "test"]`.
2. **Knopf 9 „Identität entfernen (force)":** active-identity fällt
   auf „main" zurück (Fallback-Logik); `getNodeId()` liefert wieder
   die main-nodeId; `removeIdentity` zweiter Aufruf gibt `false`
   (Idempotenz). `sbkim_meta["active-identity"]` ist im DevTools
   wieder `"main"`. Die `*_test`-Stores bleiben als leere Stores in
   der IndexedDB (Hinweis-Text aus Karte 02 § Risiken).
3. **Knopf 10 „Backup mit Multi-Identität":** Wrapper-`version === 2`,
   `payload-schema-version === 2`, `payload.identities.length === 2`;
   beide nodeIds + Slot-Keys im Log. Download-Link erzeugt eine
   Backup-Datei `sbkim-backup-multi-YYYY-MM-DD.json`.

**Wahrscheinliche Stolperfallen für Klaus' Browser-Lauf** (aus dem
Brief „Wenn du blockierst"-Block):

- **`EnsureStoreError` mit `cause`-Hinweis auf `onblocked`** beim
  Multi-Tab-Szenario (zwei DeX-Chrome-Tabs gleichzeitig). Klaus' 01.Y-
  Sichttest lief Single-Instance grün; falls 02.Y im DeX-Chrome auf
  einen `onblocked`-Befund stößt, ist das ein Architektur-Befund
  (Versions-Bump-Choreografie auf mehreren Tabs) — als offene Frage in
  PULS dokumentieren statt durchforcen.
- **Backup-Schema-Asymmetrie:** sollte ein Re-Import von Klaus'
  bestehendem Mein-Mixarium- / Mein-Rezeptbuch-Backup vom 2026-05-16
  (v=1) in 02.Y-Code scheitern, ist das ein Migrations-Bug. Smoke-Test-
  Probe 30/31/32 in dieser Bau-Sitzung bestätigt den Pfad headless;
  Browser-Verhalten kann abweichen (insbesondere bei JSON-Parse-
  Reihenfolge auf älteren Browser-Versionen).
- **`_sendLegacyForIdentity`-Hook in Modul 07 fehlt** (Bau 07.Y noch
  nicht gemacht) → fail-soft mit `console.warn`, kein Throw. Klaus
  sieht im DevTools-Konsolen-Log eine Warnung wie „SbkimApoptose.
  _sendLegacyForIdentity nicht verfügbar (Bau 07.Y noch nicht
  eingespielt) — Persona-Apoptose für 'test' läuft ohne Vermächtnis-
  Versand." — ist Spec-konform, keine offene Frage nötig.

---

## Nächster sinnvoller Schritt

**Klaus' Browser-Sichttest der drei neuen Panel-02-Knöpfe** (nicht
headless — wartet auf Klaus, DeX-Chrome auf Galaxy Tab S6 oder
Tablet-Chrome; Termux-`python3 -m http.server 8000`-Setup wie Bau 01.Y).
Resultate ziehen in Karte 02 § Bauzustand-Zeile „Sichttest (Bau 02.Y)"
nach.

Parallel-Trigger nach dem Sichttest (oder schon vorher, weil die
Module-04-/05-/06-/07-Bauten unabhängig laufen):

- **Bau 05.Y transparenter Slot-Pfad in Modul 05** (~2–3 h; liest
  `getActiveIdentityKey()` im init, cached, schreibt in
  `sbkim_siblings_<key>` — additive Refactoring). Parallel analog
  06.Y / 07.Y.
- **Alternativ Bau 04.A Stufe A erweitert in Modul 04** (~2–3 h;
  `matchDimensions` synchron) — unabhängig von 02.Y / 05.Y / 06.Y /
  07.Y, parallelisierbar.

---

## Pull-Request

Branch: `claude/bau-02y-multi-identitaet-iRl02`. Draft-PR „Bau 02.Y
Multi-Identitäts-API + Backup-Schema-Bump in Modul 02".
