# Brief — Bau-Sitzung 02.Y · Multi-Identitäts-API + Backup-Schema-Bump in Modul 02

**Bau-Sitzung** (kein Spec, kein Modul-Vertrag-Eingriff jenseits Modul 02).
Zweite Bau-Sitzung der Bau-Sitzungs-Brief-Pipeline aus Brief 99
(Sammelspec-Abschluss, PR #100 gemerged 2026-05-19, `main` `80994fd`).
**Logische Reihenfolge:** Klaus' Wahl 2026-05-19 — Infrastruktur zuerst.
Bau 01.Y `ensureStore` (PR #102 gemerged 2026-05-19, `main` `8a07ed5`) ist
die direkte Voraussetzung; Bau 02.Y nutzt den frischen
`SbkimStorage.ensureStore`-Pfad für identitäts-spezifische Stores pro
Persona und ist seinerseits Voraussetzung für 05.Y / 06.Y / 07.Y
(transparenter Slot-Pfad in den Konsumenten).

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Bau 02.Y Multi-
Identitäts-API + Backup-Schema-Bump in Modul 02.

Branch: claude/bau-02y-multi-identitaet   (vom main aus anlegen)

Sitzungs-Rolle: Bau (kein Spec, kein Modul-Vertrag-Eingriff). Du
implementierst die fünf neuen / erweiterten API-Funktionen aus
INTERFACES.md § 1 Modul 02 (Brief 04 der V1-Sammelspec-Kaskade) und
bumpst das Backup-Wrapper-Schema von BACKUP_FORMAT_VERSION 1 auf 2
für die Multi-Identitäts-Backup-Strategie „kompletter Rucksack"
(INTERFACES.md § 9.6). KEINE Modul-05-/06-/07-Änderung in dieser
Sitzung — die kommen in 05.Y / 06.Y / 07.Y nach (transparenter
Slot-Pfad in den Konsumenten).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Bau 01.Y `ensureStore`
     in Modul 01" zeigt den frischen Code-Stand von Modul 01 und
     den Pipeline-Kontext
   - § Vision-Anker 6 „Multi-Identität in der IndexedDB" § Status —
     dokumentiert Bau 02.Y als nächsten Schritt nach 01.Y
3. docs/INTERFACES.md
   - § 0 Globale Konstanten — `BACKUP_FORMAT_VERSION = 1` heute,
     dieser Bau bumpt auf 2
   - § 1 Modul 01 Bietet-Block (insbesondere `ensureStore`-Garantien
     aus Bau 01.Y) — Modul 02 ist Aufrufer, nutzt die Funktion
   - § 1 Modul 02 (Spore) — Vertrags-Stand (du implementierst den
     bereits gespiegelten Vertrag im Code; KEIN Vertrags-Eingriff
     außer Geprüft-Zeile und ggf. Karte-02-Stand-Hinweise)
   - § 9 Identitäts-Map (Brief 04), insbesondere § 9.1 Slot-Schema,
     § 9.2 identitäts-spezifische Stores, § 9.3 active-identity-
     Marker, § 9.6 Trade-off-Klausel (insbesondere Pkt. 2 — Multi-
     Identitäts-Backup „kompletter Rucksack")
4. docs/components/02_spore.md (Karte 02) — du erweiterst sie
5. src/modules/02_spore.js — du erweiterst den Code

Was du NICHT liest: andere Modul-Karten (01 außer Bietet-Block /
05 / 06 / 07 / 08 / 09); Sage-Page index.html; Brief 01-04 / 99 /
SPEC_V1_SAMMELSPEC (Stand ist in INTERFACES § 1 Modul 02 + § 9
bereits gespiegelt); Brief BAU_01Y (Bau 01.Y ist gemerged, Modul-01-
Vertrag liegt im aktuellen INTERFACES.md).

Heilige Tafeln (Bau-02.Y-spezifisch):

- **INTERFACES verbindlich.** Modul 02 Bietet-Block + Storage-Block
  + Fehlerverhalten + Selbstcheck-Zeile sind in INTERFACES § 1
  Modul 02 BEREITS gespiegelt (durch Brief 04, gemerged 2026-05-19).
  Du ziehst NUR die Geprüft-Zeile um „2026-05-XX (Bau 02.Y Multi-
  Identitäts-API + Backup-Schema-Bump)" nach. KEIN Vertrags-Eingriff
  in das Bietet-/Storage-/Fehler-Block — sonst Vertrags-Drift gegen
  Brief 04. Reihenfolge: INTERFACES Geprüft-Zeile + § 9.6 Stand-
  Hinweis ZUERST, DANN Karte 02, DANN Code.

- **§ 9.6 Pkt. 2 ist der Backup-Bump-Spec.** Bau 02.Y bumpt
  `BACKUP_FORMAT_VERSION` von 1 auf 2; das Backup-Wrapper-Schema
  bekommt das additive Pflicht-Feld `payload.identities[]` (eine
  Eintrag pro Identitäts-Slot, Klartext nach Decrypt). `importBackup`
  bekommt einen Pflicht-Vor-Check „mindestens eine Identität im
  Container" (BackupSchemaError bei leerer identities-Liste) und
  wendet die `BackupOverwriteError`-Klausel **pro Slot** an (nicht
  mehr nur für „main"). § 9.6 Pkt. 2 ist die Spec-Quelle — KEIN
  Eingriff in § 9.6, nur ein Stand-Hinweis am Ende analog zum
  § 9.5-Stand-Hinweis von Bau 01.Y.

- **Aufrufer-Konvention für `ensureStore`.** Modul 02 ruft
  `SbkimStorage.ensureStore("sbkim_siblings_<key>")`,
  `ensureStore("sbkim_anastomosis_log_<key>")`,
  `ensureStore("sbkim_legacy_inbox_<key>")`,
  `ensureStore("sbkim_hetero_inbox_<key>")`,
  `ensureStore("sbkim_hetero_outbox_<key>")` PRO Persona-Slot, BEVOR
  er den ersten Schreibvorgang in einen davon macht. Die Aufrufe
  passieren in `getOrCreateIdentity(key)` (für neue Slots) und bei
  Bedarf in `importBackup` (für Slots aus dem Backup, die in der
  aktuellen DB noch nicht existieren). Idempotenz von `ensureStore`
  garantiert, dass parallele oder wiederholte Aufrufe kein Problem
  sind (siehe Bau-01.Y-Garantien-Block).

- **`active-identity`-Marker.** Modul 02 ist **alleiniger
  Schreiber** des `sbkim_meta["active-identity"]`-Markers
  (`setActiveIdentity`, `removeIdentity` mit force-Fall der die
  aktive Identität löscht). KEIN Storage-Eingriff von Modul 02 auf
  `sbkim_meta`-Felder, die nicht zum active-identity-Marker gehören.
  Default „main" wenn das Feld fehlt — Rückwärts-Kompat zum
  Singleton-Vertrag aus Spec-Sitzung 02 (2026-05-14).

- **Identitäts-Cache invalidieren bei Wechsel.** `setActiveIdentity(key)`
  ruft intern `resetIdentityCache()`, damit nachfolgende `getNodeId`/
  `getOwnSpore`-Aufrufe die neue Identität liefern. `removeIdentity`
  ruft am Ende ebenfalls `resetIdentityCache()`. Bestehende
  `resetIdentityCache`-Konvention bleibt unverändert (Pflege 2026-05-15).

- **Backup-Schema-Migration.** Das alte Format `BACKUP_FORMAT_VERSION
  = 1` bleibt LESBAR durch `importBackup` (additiver Bump). Wenn
  `blob.version === 1`, liest `importBackup` den alten Payload (nur
  „main"-Identität) und schreibt ihn in den main-Slot — sonst würde
  Klaus' bestehendes Mein-Mixarium- / Mein-Rezeptbuch-Backup vom
  2026-05-16 (Bau 02.X) nach dem Bump unbrauchbar. `exportBackup`
  schreibt IMMER `version: 2` (kein Auswahl-Parameter — Aufwärts-
  Kompat ist gut, Aufwärts-Schreiben wäre ein Schritt zurück).

- **Vermächtnis-Versand pro Persona.** `removeIdentity(key,
  {force:true})` löst pro-Persona-Apoptose aus. Modul 02 ruft den
  internen Modul-07-Hook `_sendLegacyForIdentity(key)` (siehe § 1
  Modul 07 Vertrag — der Hook ist im Modul-07-Vertrag spezifiziert,
  aber Modul 07 bekommt ihn ERST in Bau 07.Y implementiert; Bau
  02.Y prüft fail-soft, ob `SbkimApoptose._sendLegacyForIdentity`
  existiert — wenn nicht, übersprung mit `console.warn`, kein
  Throw). Begründung: 07.Y und 02.Y können in beliebiger Reihenfolge
  gemerged werden; der `removeIdentity`-Pfad muss in beiden Welten
  funktionieren. Klaus' Erst-Andock-Setup hat noch kein 07.Y, also
  ist der fail-soft-Weg verbindlich.

- **Bestehende Funktionen unangetastet.** `init`, `getNodeId`,
  `getPublicKeyJwk`, `verifyForeignSpore`, `resetIdentityCache`,
  `exportBackup`, `importBackup` (Form-Erweiterungen aber kein
  Refactoring), `generateOwnSpore` (Erweiterung um optionalen
  `key`-Parameter), `getOwnSpore` (Erweiterung um optionalen
  `key`-Parameter), `getOrCreateIdentity` (Erweiterung um
  optionalen `key`-Parameter) — alle bleiben in ihrer bestehenden
  Form gültig für Singleton-Aufrufer ohne `key`-Parameter
  (Rückwärts-Kompat zum Singleton-Vertrag).

- **`PROTOCOL_VERSION` bleibt `"0.1"`.** Multi-Identitäts-Schema
  ist lokales Storage-Schema, kein Spore-Feld. `DB_VERSION` bleibt
  `4` (Bau 01.Y hat das gesetzt); neue identitäts-spezifische
  Stores entstehen dynamisch via `ensureStore`. **`BACKUP_FORMAT_VERSION`
  von 1 auf 2** (additiver Bump des separaten Backup-Wrapper-
  Schemas aus § 0, KEIN `PROTOCOL_VERSION`-Eingriff). Diese drei
  Disziplinen sind verbindlich.

- **Selbstcheck-Format** (CLAUDE.md-Konvention `MODUL 02 SPORE
  bereit, Funktionen: ...`) ist in INTERFACES § 1 Modul 02 BEREITS
  auf 14 Funktionen spezifiziert (`init/getOrCreateIdentity/
  getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/
  verifyForeignSpore/setActiveIdentity/getActiveIdentityKey/
  listIdentities/removeIdentity/resetIdentityCache/exportBackup/
  importBackup`). Du ziehst den Code-Selbstcheck-String auf diese
  Liste nach.

Deine Aufgabe heute — sechs Punkte a–f:

a) **docs/INTERFACES.md** drei kleine Nachzieh-Eingriffe (KEIN
   Vertrags-Eingriff in das Modul-02-Bietet-/Storage-/Fehler-Block —
   das ist Brief 04, gemerged):
   - § 0 Globale Konstanten: `BACKUP_FORMAT_VERSION = 1` auf
     `BACKUP_FORMAT_VERSION = 2` setzen, mit Kommentar „Bau 02.Y
     2026-05-XX bumpt von 1 auf 2 — Multi-Identitäts-Backup-Schema
     mit Pflicht-Feld `payload.identities[]`; alte Backups (version
     === 1) bleiben importierbar (Rückwärts-Kompat)".
   - § 1 Modul 02 Geprüft-Zeile um „2026-05-XX (Bau 02.Y Multi-
     Identitäts-API + Backup-Schema-Bump)" erweitert. KEIN Eingriff
     in Bietet/Storage/Fehler.
   - § 9.6 Pkt. 2 Stand-Hinweis am Ende der Trade-off-Klausel
     (analog § 9.5-Stand-Hinweis aus Bau 01.Y): „Bau-Folge-Sitzung
     02.Y vom 2026-05-XX hat den Backup-Schema-Bump 1→2 sowie die
     fünf neuen / erweiterten API-Funktionen gebaut; siehe § 1
     Modul 02 Bietet-Block."
   - § 10 Änderungsprotokoll um eine neue Zeile „2026-05-XX · Bau-
     Sitzung 02.Y Multi-Identitäts-API + Backup-Schema-Bump"
     erweitert.

b) **docs/components/02_spore.md (Karte 02)** nachziehen:
   - § Schnittstelle: die fünf neuen / erweiterten Funktionen als
     eigene Code-Blöcke (Signatur, Garantien, Fehler-Verweis), in
     der Reihenfolge `getOrCreateIdentity(key?)` (Erweiterung),
     `setActiveIdentity(key)`, `getActiveIdentityKey()`,
     `listIdentities()`, `removeIdentity(key, options?)`. Plus
     Erweiterungs-Hinweis bei `generateOwnSpore(meta, key?)` und
     `getOwnSpore(key?)`.
   - § Storage: neuer Sub-Block „Identitäts-Slot-Vertrag (Brief
     04 / Bau 02.Y)" — `sbkim_keys[key]` / `sbkim_spore[key]`
     beschreiben, identitäts-spezifische Stores `sbkim_siblings_<key>`
     etc. mit Pattern-Verweis auf § 9.2; `sbkim_meta["active-identity"]`-
     Marker erklären; Default-Slot „main" verbindlich.
   - § Datenformat „Backup-Format": Wrapper-Schema-Bump von
     `version: 1` auf `version: 2` dokumentieren, neues
     Pflicht-Feld `payload.identities[]` (Array von Objekten je
     Slot — Felder: `key`, `keys`, `spore`, `siblings`; `nodeId`
     pro Slot redundant für Identifikation), Migrations-Hinweis
     „Alte Backups (version: 1) bleiben importierbar — main-Slot
     wird automatisch erzeugt".
   - § Konfigurationswerte: `BACKUP_FORMAT_VERSION` auf 2
     nachgezogen; KEIN modul-lokaler Schema-Pflege-Eintrag (das
     Schema lebt im Wrapper, siehe § Datenformat).
   - § Fehlerverhalten: zwei neue Zeilen (analog INTERFACES) —
     `UnknownIdentityError` (von `setActiveIdentity`) und
     `RemoveActiveIdentityError` (von `removeIdentity` mit
     `force:false` auf aktive Identität). Plus Erweiterung der
     `BackupSchemaError`-Zeile um „leere `identities[]`-Liste nach
     Decrypt" als zusätzlichen Auslöser.
   - § Risiken: zwei neue Punkte — „Mid-Operation-Identitäts-
     Wechsel nicht spezifiziert" (siehe § 9.3-Hinweis; Folge-Spec
     darf einen Hook nachreichen, Bau 02.Y liefert ihn NICHT) und
     „Backup-Schema-Migration v1 → v2 ist asymmetrisch" (Lesen
     beider Versionen, Schreiben nur v2 — alte PWAs bleiben
     importable, aber Backups von 02.Y können nicht in 02.X-Code
     importiert werden).
   - § Manueller Test: drei neue Knöpfe in Panel 02 — Knopf 8
     „Identität anlegen + wechseln" (sequenz `getOrCreateIdentity('test')`
     → `listIdentities()` → `setActiveIdentity('test')` →
     `getActiveIdentityKey()` → `getNodeId()` ≠ main-nodeId; Log
     vor + nach), Knopf 9 „Identität entfernen (force)"
     (`removeIdentity('test', {force:true})`; Log: active-identity
     fällt auf „main" zurück, getNodeId liefert wieder main),
     Knopf 10 „Backup mit Multi-Identität" (Export → Import-Probe
     in leerer PWA; identities[]-Liste muss zwei Slots zeigen).
     Cleanup-Hinweis: Test-Slot bleibt nicht in der DB (Knopf 9
     löscht ihn); die identitäts-spezifischen Stores `*_test`
     bleiben aber als leere Stores in IndexedDB (siehe § Risiken
     „Backup-Schema-Migration"-Hinweis; manueller Cleanup über
     DevTools).
   - § Bauzustand: neue Zeile „Bau 02.Y Multi-Identitäts-API +
     Backup-Schema-Bump 2026-05-XX".

c) **src/modules/02_spore.js** erweitern (additiv, kein
   Refactoring der bestehenden 10 + `resetIdentityCache` Funktionen):

   - **`BACKUP_FORMAT_VERSION`** modul-lokal von 1 auf 2 hochziehen.
     Bestehende Konstante `BACKUP_FORMAT_VERSION_READ_OK = [1, 2]`
     (oder analoge Konvention) ergänzen — `importBackup` akzeptiert
     beide; `exportBackup` schreibt nur die aktuelle. Begründung
     siehe Heilige Tafel „Backup-Schema-Migration".

   - **Neue Konstante `BACKUP_PAYLOAD_SCHEMA_VERSION = 2`**
     (modul-lokal, war 1 in Bau 02.X). Im Klartext-Payload wird das
     Feld `"payload-schema-version": 2` geschrieben.

   - **Neue Fehler-Factories** `UnknownIdentityError` (sync, von
     `setActiveIdentity`) und `RemoveActiveIdentityError` (sync, von
     `removeIdentity` ohne force) — Factory-Stil analog Modul 00 / 08.

   - **In-Memory `identityCache`** auf eine Map von `key →
     IdentitySnapshot` erweitern (heute Singleton — additive
     Refactoring-Erweiterung, kein Bruch des Vertrags;
     `resetIdentityCache()` leert die ganze Map).

   - **In-Memory `activeIdentityKeyCache`** als Lese-Cache für den
     `sbkim_meta["active-identity"]`-Marker (synchroner Read-Anker
     für `getActiveIdentityKey`; `setActiveIdentity` invalidiert
     und schreibt neu; `resetIdentityCache` setzt auf null).

   - **Erweiterung `getOrCreateIdentity(key)`:**
     1. `key = key || "main"` (Default-Slot, Rückwärts-Kompat).
     2. Cache-Hit für den `key` → return cached snapshot.
     3. Cache-Miss → versuche `sbkim_keys[key]`-Read; existiert →
        importieren in Cache, return.
     4. Existiert nicht → Identitäts-Erzeugung (`crypto.subtle.generateKey`
        + `exportKey("jwk")`); persistieren in `sbkim_keys[key]`.
     5. **VOR dem ersten Schreibvorgang in identitäts-spezifische
        Stores:** `ensureIdentityStores(key)`-Hilfsfunktion rufen,
        die `SbkimStorage.ensureStore("sbkim_siblings_<key>")`
        etc. für alle fünf identitäts-spezifischen Stores ruft (in
        einer `Promise.all`-Schleife; Reihenfolge egal, ensureStore
        ist idempotent). Bei `EnsureStoreError`-Reject: Identitäts-
        Erzeugung scheitert, `sbkim_keys[key]` wird wieder gelöscht
        (Rollback) — vermeidet halb-angelegte Identitäten.
     6. Snapshot in Cache, return.
     - Für `key === "main"` ist der Pfad rückwärts-kompatibel zum
       Vor-Brief-04-Singleton.

   - **Neue Funktion `setActiveIdentity(key)`:**
     1. Sync-Check `typeof key === "string"` (sonst TypeError).
     2. `await SbkimStorage.get("sbkim_keys", key)` — wenn null,
        wirft `UnknownIdentityError` (sync nach dem await; kein
        Storage-Schreibvorgang).
     3. Aktuelle aktive Identität lesen — wenn === key, no-op (kein
        Schreibvorgang).
     4. `SbkimStorage.put("sbkim_meta", "active-identity", key)`
        schreiben.
     5. `activeIdentityKeyCache = key`, `resetIdentityCache()`
        rufen (damit getNodeId/getOwnSpore die neue Identität
        liefern).

   - **Neue Funktion `getActiveIdentityKey()`:**
     1. Cache-Hit → return.
     2. Cache-Miss → `await SbkimStorage.get("sbkim_meta",
        "active-identity")`.
     3. null/undefined → return "main" (Default), Cache schreiben.
     4. String → return, Cache schreiben.

   - **Neue Funktion `listIdentities()`:**
     1. `await SbkimStorage.all("sbkim_keys")` → Liste von
        {key, value}.
     2. Map auf nur die `key`-Felder.
     3. `Array.prototype.sort()` (lexikographisch, JS-Default für
        Strings — stabile Reihenfolge wie in INTERFACES gefordert).
     4. Return.

   - **Neue Funktion `removeIdentity(key, options)`:**
     1. `options = options || {}`, `force = options.force === true`.
     2. `await SbkimStorage.get("sbkim_keys", key)` — wenn null,
        return false (idempotent, kein Throw).
     3. `activeKey = await getActiveIdentityKey()`.
     4. Wenn `key === activeKey` UND `!force` → wirft
        `RemoveActiveIdentityError` (kein Storage-Eingriff).
     5. Wenn `key === activeKey` UND `force` → optional
        `_sendLegacyForIdentity`-Hook in Modul 07 prüfen und rufen
        (fail-soft — siehe Heilige Tafel „Vermächtnis-Versand pro
        Persona"). Bei Erfolg: nach dem Lösch-Pfad neue aktive
        Identität wählen (siehe Schritt 8).
     6. Lösch-Pfad (Reihenfolge wie INTERFACES § 1 Modul 02
        `removeIdentity`-Block): `del("sbkim_keys", key)` → `del(
        "sbkim_spore", key)` → `clear("sbkim_siblings_<key>")` →
        `clear("sbkim_hetero_inbox_<key>")` → `clear(
        "sbkim_legacy_inbox_<key>")` → `clear("sbkim_anastomosis_log_<key>")`
        → `clear("sbkim_hetero_outbox_<key>")`. Die `clear`-Aufrufe
        sind fail-soft (try/catch um `UnknownStoreError`, weil ein
        Slot nicht alle Stores haben muss — z.B. wenn die Identität
        nie ein Heterokaryose-Pull bekommen hat). KEIN `dropStore`-
        Pfad (Modul 01 bietet keinen — die Stores bleiben als leere
        Stores in IndexedDB, siehe Karte 02 § Risiken Hinweis).
     7. Cache-Map: den Eintrag für `key` löschen.
     8. Wenn `key === activeKey`: neue aktive Identität wählen —
        wenn `sbkim_keys["main"]` existiert → setze active-identity
        auf „main"; sonst auf den ersten Schlüssel aus
        `listIdentities()` (lexikographisch); sonst (keine
        Identität mehr) → `del("sbkim_meta", "active-identity")`.
     9. `resetIdentityCache()` rufen.
     10. Return true.

   - **Erweiterung `generateOwnSpore(meta, key)`:**
     1. `key = key || await getActiveIdentityKey()` (Default
        aktive Identität, NICHT „main" — wenn aktive Identität
        eine andere ist).
     2. Bestehender Sign-Pfad unverändert, aber persistiert nach
        `sbkim_spore[key]` statt `sbkim_spore["main"]`.
     3. `ensureIdentityStores(key)` rufen, falls die identitäts-
        spezifischen Stores noch nicht existieren (passiert für
        Slots, die aus einem Backup-Import stammen — siehe
        `importBackup`-Erweiterung unten).

   - **Erweiterung `getOwnSpore(key)`:**
     1. `key = key || await getActiveIdentityKey()`.
     2. `await SbkimStorage.get("sbkim_spore", key)`.
     3. Return das `sporeJson`-Feld (oder null wenn fehlt).

   - **Erweiterung `exportBackup(password)`:**
     1. Sync-Mindestlängen-Check unverändert.
     2. Bisher: `sbkim_keys["main"]` + `sbkim_spore["main"]` +
        `sbkim_siblings` (alle).
     3. Neu: `listIdentities()` iterieren, pro Slot
        `payload.identities[]`-Eintrag bauen:
        ```
        {
          key: <slot-key>,
          nodeId: <slot-nodeId aus getOrCreateIdentity>,
          keys: { privateKey: JWK, publicKey: JWK },
          spore: <sporeJson aus sbkim_spore[key] oder null>,
          siblings: <alle Einträge aus sbkim_siblings_<key>, fail-soft>
        }
        ```
     4. Wrapper schreibt `version: 2`, `payload-schema-version: 2`.
     5. Die alten Top-Level-Felder `nodeId` / `keys` / `spore` /
        `siblings` BLEIBEN im Payload (befüllt mit dem aktiven Slot)
        — Rückwärts-Kompat: ein altes 02.X-importBackup soll den
        Top-Level-Pfad lesen können, falls jemand jemals ein
        Down-Grade braucht. Das ist KEINE Pflicht aus Brief 04,
        aber eine konservative Wahl; Karte 02 § Datenformat
        dokumentiert beides.

   - **Erweiterung `importBackup(blob, password, options)`:**
     1. Bestehende Vor-Checks unverändert (Mindestlänge,
        Wrapper-Version-Check — jetzt akzeptiert `version: 1` ODER
        `version: 2`).
     2. Decrypt + Schema-Check.
     3. **Wenn `payload-schema-version === 1`:** alter Pfad —
        identifies-Liste hat nur einen impliziten Eintrag „main"
        aus dem Top-Level. Migration: ein `payload.identities`-Array
        mit einem Eintrag bauen, dann Multi-Identitäts-Pfad
        durchlaufen.
     4. **Wenn `payload-schema-version === 2`:** neuer Pfad.
        `payload.identities[]` ist Pflicht; Vor-Check „mindestens
        eine Identität im Container" — sonst `BackupSchemaError`.
     5. **Pro Identität im Container:**
        - `BackupOverwriteError`-Check pro Slot: wenn
          `sbkim_keys[entry.key]` existiert UND `!options.force` →
          wirft (Sammel-Error mit Hinweis auf die kollidierenden
          Slot-Keys).
        - `ensureIdentityStores(entry.key)` rufen.
        - `put("sbkim_keys", entry.key, entry.keys)`.
        - `put("sbkim_spore", entry.key, {nodeId, sporeJson:
          entry.spore, signature: entry.spore.signature})`.
        - Für jedes `sibling` in `entry.siblings`: `put(
          "sbkim_siblings_<entry.key>", sibling.nodeId, sibling)`.
     6. Active-identity-Marker setzen: wenn Backup einen
        `active-identity`-Hinweis trägt (optionales Top-Level-Feld),
        diesen Wert übernehmen; sonst „main" (Default).
     7. `resetIdentityCache()` rufen.
     8. Return `{restored: true}`.

   - **`window.SbkimSpore.<NeueFunktionen>`** im Export-Block ergänzen.
     `window.SbkimSpore.UnknownIdentityError` und
     `window.SbkimSpore.RemoveActiveIdentityError` im Error-Export-
     Block ergänzen.

   - **Selbstcheck** auf 14 Funktionen erweitern: `MODUL 02 SPORE
     bereit, Funktionen: init/getOrCreateIdentity/getNodeId/
     getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/
     setActiveIdentity/getActiveIdentityKey/listIdentities/
     removeIdentity/resetIdentityCache/exportBackup/importBackup`.

   - **`_meta`** um zwei neue Anker erweitern: `_meta.backupFormatVersion`
     (jetzt 2) und `_meta.identityStoreBases` (Liste der fünf
     identitäts-spezifischen Store-Basen für Tests).

d) **tests/manual_check.html Panel 02** um drei Knöpfe erweitern:
   - Knopf 8 „Identität anlegen + wechseln" — `getOrCreateIdentity('test')`
     → `listIdentities()` → `setActiveIdentity('test')` →
     `getActiveIdentityKey()` → `getNodeId()`; Log: nodeId von „main"
     vor dem Wechsel, nodeId von „test" nach dem Wechsel,
     `listIdentities()` zeigt `["main", "test"]`.
   - Knopf 9 „Identität entfernen (force)" — `removeIdentity('test',
     {force:true})`; Log: vor dem Aufruf active-identity = „test",
     nach dem Aufruf active-identity = „main" (fallback auf main),
     `getNodeId()` liefert wieder main-nodeId.
   - Knopf 10 „Backup mit Multi-Identität" — Setup: Identität „test"
     anlegen, dann `exportBackup`; Log: Wrapper-Version = 2,
     `payload.identities.length === 2`, beide nodeIds aufgelistet.
     Cleanup-Hinweis: Test-Slot wird in Knopf 9 gelöscht; identitäts-
     spezifische Stores `*_test` bleiben als leere Stores in
     IndexedDB.

e) **Übergabeprotokoll in
   `docs/sessions/archiv/2026-05-XX_bau-02y-multi-identitaet.md`**
   (Format BRIEFING_TEMPLATE.md § C Bau-Sitzung). Inhalt: alle sechs
   Punkte a–f plus Heilige-Tafeln-Eingehalten-Block plus „Was NICHT
   angefasst"-Block plus „Nächster sinnvoller Schritt"-Block mit
   Verweis auf 05.Y / 06.Y / 07.Y (transparenter Slot-Pfad) als
   logische Folge — oder parallel Bau 04.A Stufe A (matchDimensions
   sync).

f) **Smoke-Test mit `fake-indexeddb`** (headless, Node) — analog
   Bau 01.Y: Module-Lade, Selbstcheck, Multi-Identitäts-Pfad
   (getOrCreateIdentity('test') + setActiveIdentity + nodeId-
   Differenz), removeIdentity-force-Pfad mit Fallback auf „main",
   Backup-Export mit `version: 2` und `identities.length === 2`,
   Backup-Import in leerer PWA mit Multi-Identität, alter v=1-
   Backup-Import (synthetischer Blob aus 02.X-Form). Resultate als
   Tabelle ins Übergabeprotokoll.

Was du NICHT tust:

- **Keine Modul-05/06/07-Änderung.** Transparenter Slot-Pfad
  kommt in 05.Y / 06.Y / 07.Y. Module 05/06/07 lesen
  `getActiveIdentityKey()` heute NOCH NICHT — du baust nur die
  Modul-02-API, die sie morgen rufen werden.
- **Keine Modul-07-`_sendLegacyForIdentity`-Implementierung.** Der
  Hook ist im Modul-07-Vertrag spezifiziert (Brief 04), aber
  Implementation kommt in 07.Y. Bau 02.Y ruft den Hook fail-soft
  (typeof-check, console.warn wenn fehlt — KEIN Throw).
- **Kein Modul-01-Eingriff.** `ensureStore` ist Bau-01.Y-Stand,
  Modul 02 ist Aufrufer.
- **Kein `PROTOCOL_VERSION`-Bump** (lokales Storage-Schema +
  separates Backup-Schema; siehe Heilige Tafel).
- **Kein `DB_VERSION`-Bump** (Bau 01.Y hat das gesetzt; identitäts-
  spezifische Stores entstehen dynamisch via `ensureStore`).
- **Keine Sage-Page-Änderung.**
- **Keine CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 02 ist bereits
  `score:"fertig"` (Live-Andock-Beweis 2026-05-16); Multi-
  Identitäts-API ist additive Erweiterung, kein Score-Wechsel.
- **Keine `generateOwnSpore`-Allow-List-Erweiterung für `embeddingNeeds`/
  `embeddingCapabilities`.** Diese Felder kommen aus Brief 03 (M04-
  Erweiterung) und werden in Bau 04.A im Modul-04-Pfad gebaut —
  Bau 02.Y berührt das nicht. Wenn Klaus' Spore bereits
  `embeddingCapabilities` trägt, geht das durch den bestehenden
  `domainKeywords`-Allow-List-Pfad aus Pflege Stamm/Gast (2026-05-15).

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am Sitzungsende:
   - INTERFACES.md drei kleine Eingriffe (§ 0 BACKUP_FORMAT_VERSION,
     § 1 Modul 02 Geprüft-Zeile, § 9.6 Stand-Hinweis, § 10
     Änderungsprotokoll).
   - Karte 02 acht Sub-Sektionen nachgezogen (siehe Punkt b).
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag „Bau 02.Y
     Multi-Identitäts-API + Backup-Schema-Bump in Modul 02" mit
     Punkten a–f, Heilige-Tafeln-Block, Was-NICHT-angefasst-Block,
     Sichttest-Vermerk.
   - Vorletzten Sitzungs-Eintrag (Bau 01.Y) ins Archiv-Index
     auslagern (Konvention pro Sitzung).
   - PULS § Vision-Anker 6 § Status um „Bau 02.Y Multi-Identitäts-
     API + Backup-Schema-Bump 2026-05-XX abgeschlossen" erweitern;
     Anker 1 / 9 unangetastet (02.Y berührt nur Anker 6).
   - Manueller Sichttest **erwartet** (CLAUDE.md § Pflicht 3): drei
     neue Panel-02-Knöpfe in `tests/manual_check.html`. Klaus prüft
     im Browser, dass (i) Identität anlegen + wechseln nodeId
     ändert, (ii) removeIdentity force-Fallback auf „main" greift,
     (iii) Backup mit `identities.length === 2` exportiert wird.
     Sichttest-Vermerk in Karte 02 § Manueller Test und in PULS-
     Eintrag. **Headless-Bau ist OK** — Vermerk „ungeprüft, weil
     headless, wartet auf Klaus' Browser-Lauf" ist zulässig.
   - Übergabeprotokoll
     `docs/sessions/archiv/2026-05-XX_bau-02y-multi-identitaet.md`.
   - Commit + Push auf `claude/bau-02y-multi-identitaet`.
   - Draft-PR „Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump
     in Modul 02".

2. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): zwei bis vier priorisierte
   Folge-Bau-Trigger als Markdown-Liste. Empfehlung:
   - **Klaus' Browser-Sichttest der drei neuen Panel-02-Knöpfe**
     (nicht headless, wartet auf Klaus).
   - **Bau 05.Y transparenter Slot-Pfad in Modul 05** (~2-3 h;
     liest `getActiveIdentityKey()` im init, cached, schreibt in
     `sbkim_siblings_<key>` — additive Refactoring). Parallel
     analog 06.Y / 07.Y.
   - **Alternativ Bau 04.A Stufe A erweitert in Modul 04** (~2-3 h;
     `matchDimensions` synchron) — unabhängig von 02.Y / 05.Y / 06.Y
     / 07.Y, parallelisierbar.

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Sitzungs-Eintrag
  „Bau 02.Y abgebrochen" ans Ende. Klaus klärt in der nächsten
  Sitzung.
- Wahrscheinliche Stolperfallen:
  - `ensureStore`-Versions-Bump auf mehreren Tabs blockiert
    (`EnsureStoreError` mit `cause`-Hinweis auf `onblocked`) →
    Architektur-Befund, als offene Frage dokumentieren statt
    durchforcen. Klaus' DeX-Chrome-Sichttest für 01.Y lief grün,
    aber das ist kein Beweis für Multi-Tab-Szenarien.
  - Backup-Schema-Asymmetrie: Tests müssen sicherstellen, dass
    alte v=1-Backups aus 02.X (Klaus' Backup vom 2026-05-16) noch
    importierbar sind. Wenn das nicht klappt, ist das ein
    Migrations-Bug — als offene Frage dokumentieren.
  - `_sendLegacyForIdentity`-Hook in Modul 07 fehlt (Bau 07.Y noch
    nicht gemacht) → fail-soft mit console.warn, kein Throw, ist
    Spec-konform; keine offene Frage nötig.

Zeitschätzung: 5–8 Stunden für Bau + Karten-Nachzug + Test-Panel +
Übergabeprotokoll + Smoke-Test. Wenn der Backup-Schema-Migrations-
Pfad (v=1 → v=2 Lesen + Schreiben) tricky wird, kann es 8-10 h
werden — Brief 99's 5-8 h ist Untergrenze.
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Brief 99-PR #100 ist gemerged** (2026-05-19, `main` `80994fd`).
- **Bau 01.Y-PR #102 ist gemerged** (2026-05-19, `main` `8a07ed5`).
  Modul 01 hat `ensureStore` als achte öffentliche Funktion;
  DB-Version 4; Pattern `^sbkim_[a-z0-9_]+$`; Versions-Bump-
  Choreografie linear via `db.version + 1`. Sichttest 3/3 grün im
  DeX-Chrome.

- **Logische Bau-Reihenfolge (Klaus' Wahl 2026-05-19):**
  1. Bau 01.Y `ensureStore` ✓ (PR #102 gemerged 2026-05-19)
  2. **Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump in
     Modul 02 — DIESER BRIEF.**
  3. Bau 04.A Stufe A erweitert in Modul 04 — unabhängig,
     parallelisierbar zu 02.Y.
  4. Bau 04.B Stufe B in Modul 04 — braucht 04.A.
  5. Bau 05.Y / 06.Y / 07.Y transparenter Slot-Pfad — braucht 01.Y
     + 02.Y.
  6. Bau Sage-Page-Refactor — braucht 04.A (Schichten-Lampen) +
     02.Y (Identitäts-Wechsler-UX); volle Breite nach allen
     Vorbedingungen.
  7. Bau Multi-Identitäts-Migration der Endknoten — braucht 02.Y.

- **KEINE Spec-Kaskade.** Jeder Bau-Brief ist eigenständige Bau-
  Sitzung mit eigenem PR. Klaus entscheidet jeden Auslöser-Befehl
  einzeln.

- **Auslöser-Befehl im Chat (Kaskaden-Konvention 6):** der Volltext
  des Briefes oben ist im Repo (diese Datei). Klaus tippt am
  Sitzungs-Start nur den kurzen Auslöser-Befehl mit Verweis auf die
  Brief-Datei.

- **`PROTOCOL_VERSION` bleibt `"0.1"`** für 02.Y — bestätigt vom
  Brief-99-Snapshot und Brief 04 Strategie A. **`BACKUP_FORMAT_VERSION`
  von 1 auf 2** in 02.Y (Multi-Identitäts-Backup-Schema „kompletter
  Rucksack", additiver Pflicht-Feld `payload.identities[]`).
  **`DB_VERSION` bleibt `4`** in 02.Y (Bau 01.Y hat das gesetzt;
  neue identitäts-spezifische Stores entstehen dynamisch via
  `ensureStore`).

- **Manueller Sichttest:** drei neue Panel-02-Knöpfe in
  `tests/manual_check.html`. Klaus' Browser-Lauf prüft die Drei-
  Stufen-Probe (Identität-Wechsel / removeIdentity-Force-Fallback /
  Multi-Identitäts-Backup-Export) — ungeprüft beim headless Bau ist
  zulässig.

- **Rückwärts-Kompat-Garantie:** alte 02.X-Backups (`version: 1`)
  bleiben über `importBackup` in 02.Y lesbar. Das ist wichtig, weil
  Klaus' Mein-Mixarium- / Mein-Rezeptbuch-Backup vom 2026-05-16
  noch im alten Format ist; nach dem Bau soll ein Re-Import in der
  Sage-Werkstatt-DB möglich sein, ohne Backup neu zu erstellen.
