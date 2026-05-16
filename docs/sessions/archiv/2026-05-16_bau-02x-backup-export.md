# Übergabeprotokoll · 2026-05-16 · Bau-Sitzung — Modul 02 Backup-Export Code-Stub (Bau 02.X)

**Sitzungs-Rolle:** Bau-Sitzung, headless, EINE Phase. Branch
`claude/bau-02x-backup-export-kt2MF`. Folge-Bau direkt zur Spec-
Sitzung Backup-Export Stufe 2 vom selben Tag (PR #52 gemerged).

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C
(Bau-Sitzung).

**Module:** ausschließlich 02 (Spore — Code + Panel 02 in
`tests/manual_check.html`). Module 00 / 01 / 03 / 04 / 05 / 06 /
07 / 08 ausdrücklich nicht angefasst.

---

## Auftrag

`src/modules/02_spore.js` additiv um `exportBackup` + `importBackup`
erweitern, exakt nach den drei Pflicht-Fragen, die die Spec-Sitzung
verbindlich entschieden hat:

| # | Frage | Entscheidung | Quelle |
|---|---|---|---|
| 1 | Backup-Inhalt | **(b) Identität + Geschwister** | Spec § Pflicht-Frage 1 |
| 2 | PBKDF2-Iterations | **(b) 600 000** (OWASP 2023+) | Spec § Pflicht-Frage 2 |
| 3 | Import-Überschreibung | **(a) defensiv per Default** (`BackupOverwriteError`) | Spec § Pflicht-Frage 3 |

KEIN Refactoring der bestehenden sieben + `resetIdentityCache`-
Funktionen. Drei Helper-Reuse-Entscheidungen für die Bau-Sitzung
eigenständig getroffen — unten begründet.

---

## Drei Helper-Reuse-Entscheidungen mit Begründung

Die Spec hat die drei Helper-Reuse-Pfade bewusst offen gelassen,
weil Spec den Code nicht sah. Diese Bau-Sitzung trifft sie nach
den Regeln aus dem Bau-Briefing:

### Helper-Reuse 1 — `canonicalJsonStringify` (kanonische Sort-Funktion)

**Entscheidung:** Bestehender Closure-Helper `canonicalize` +
`canonicalJsonBytes` aus dem Spore-Sign-Pfad wird **wiederverwendet**.

**Begründung:** Modul 02 hat bereits seit Spec+Bau 02 (2026-05-14)
einen Closure-Helper `canonicalize(value)` (rekursive lexikographische
Object-Key-Sortierung) und `canonicalJsonBytes(obj)` (canonicalize →
`JSON.stringify` → UTF-8). Beide sind modul-lokal, nicht inline in
`generateOwnSpore` versteckt — also kein Extraktions-Aufwand. Eine
zweite kanonische Sort-Implementation wäre Spec-Bruch: bei jeder
Spore-Feld-Erweiterung müssten zwei Stellen synchron gehalten werden,
und ein Drift im Sort-Edge-Case (z.B. Unicode-Reihenfolge der Keys)
würde die Backup-Format-Integrität brechen. Die Abstraktion ist hier
nicht verfrüht — sie ist Vertrag (gleiche Disziplin wie zwischen
Sign- und Verify-Pfad).

### Helper-Reuse 2 — `base64urlEncode` / `base64urlDecode`

**Entscheidung:** Bestehende Closure-Helper aus dem nodeId-/Signatur-
Pfad werden **wiederverwendet**. Beide Richtungen waren schon da.

**Begründung:** Modul 02 hat beide Funktionen seit Bau 02 (2026-05-14)
modul-lokal — `base64urlEncode` für `nodeId` und Spore-`signature`,
`base64urlDecode` für `verifyForeignSpore` (Signatur dekodieren). Sie
sind symmetrisch und korrekt (Padding-Handling RFC 4648 §5). Kein
neuer Decode-Helper nötig. Der Backup-Pfad nutzt sie für salt (16
Bytes), iv (12 Bytes), ciphertext.

### Helper-Reuse 3 — `resetIdentityCache()` nach erfolgreichem Import

**Entscheidung:** Bestehende öffentliche Funktion `resetIdentityCache()`
(Pflege-Sitzung 2026-05-15) wird als letzter Schritt vor
`return {restored:true}` aufgerufen. **KEIN neuer Cache-Reset-Pfad.**

**Begründung:** Die Pflege-Sitzung 2026-05-15 hat den Hook genau für
diese Klasse von externen Storage-Eingriffen gebaut (damals: Modul 07
`confirmSelfApoptose`). `importBackup` ist ein semantisch identischer
Fall: `sbkim_keys["main"]` wird von außen überschrieben, der In-
Memory-`identityCache` ist danach veraltet, der nächste `getNodeId()`-
Aufruf würde die alte nodeId liefern. Der `resetIdentityCache()`-
Aufruf am Ende von `importBackup` macht den Cache invalid; der
nächste Lese-Pfad rekonstruiert ihn aus dem frisch geschriebenen
Storage. Klein, idempotent, kein State-Risiko.

---

## Was getan wurde

### 1. `src/modules/02_spore.js` (additiv, +208 Zeilen)

- **Modul-Kopfkommentar** um Pflege-Block „Bau 02.X Backup-Export
  (2026-05-16)" am Ende erweitert (analog Pflege Storage-Persist-
  Block in `01_storage.js`).
- **Drei §0-Konstanten modul-lokal gespiegelt** (siehe §0
  „sobald angelegt"-Hinweis): `BACKUP_FORMAT_VERSION = 1`,
  `BACKUP_KDF_ITERATIONS = 600000`, `BACKUP_PASSWORD_MIN_LEN = 8`.
- **Drei modul-lokale Konstanten** aus Karte 02 § Konfigurationswerte:
  `BACKUP_PAYLOAD_SCHEMA_VERSION = 1`, `BACKUP_KDF_SALT_BYTES = 16`,
  `BACKUP_CIPHER_IV_BYTES = 12`.
- **Neue Konstante** `SIBLINGS_STORE = "sbkim_siblings"` neben den
  bestehenden Store-Konstanten.
- **Fünf benannte Error-Klassen** im Factory-Stil analog Modul 00/08:
  `InvalidBackupPasswordError`, `BackupDecryptError` (Sammel-Klasse,
  unterscheidet bewusst nicht zwischen falschem Passwort und korruptem
  Blob — kein Oracle), `BackupVersionMismatchError`, `BackupSchemaError`,
  `BackupOverwriteError`. Auf `window.SbkimSpore.<Error>` exportiert.
- **Neuer Closure-Helper** `derivePbkdf2AesGcmKey(password, salt,
  iterations)` → `Promise<CryptoKey>`:
  ```
  importKey("raw", utf8(password), {name:"PBKDF2"}, false, ["deriveKey"])
  deriveKey({name:"PBKDF2", salt, iterations, hash:"SHA-256"},
            baseKey, {name:"AES-GCM", length:256}, false,
            ["encrypt","decrypt"])
  ```
- **`exportBackup(password)`** (Pfad strikt nach Karte 02 § Schnittstelle):
  1. Mindest-Länge sync prüfen → `InvalidBackupPasswordError`.
  2. `await getOrCreateIdentity()` für nodeId-Anker.
  3. Direkt-Reads `SbkimStorage.get("sbkim_keys", "main")` +
     `SbkimStorage.get("sbkim_spore", "main")` (Roh-JWK, NICHT über
     identityCache — der hält nur CryptoKey-Instanzen).
  4. `SbkimStorage.all("sbkim_siblings")` in try/catch (fail-soft;
     bei `UnknownStoreError` oder Cursor-Fehler → leeres Array).
  5. Payload-Bau (kanonisch sortiert via `canonicalJsonBytes`):
     `{createdAt, keys:{keyId,privateKey,publicKey}, nodeId,
       siblings:[…], spore: sporeJson|null}`.
  6. `getRandomValues(16)` Salt + `getRandomValues(12)` IV.
  7. `derivePbkdf2AesGcmKey(password, salt, BACKUP_KDF_ITERATIONS)`.
  8. `encrypt({name:"AES-GCM", iv}, aesKey, plaintext)`.
  9. Wrapper-Return: `{version:1, kdf:{algorithm,hash,iterations,salt},
     cipher:{algorithm,iv}, ciphertext, "payload-schema-version":1}`.
- **`importBackup(blob, password, options?)`** (Vor-Checks VOR Crypto):
  1. `force = options?.force === true`.
  2. Mindest-Länge sync → `InvalidBackupPasswordError`.
  3. Blob-Form-Check + `blob.version === BACKUP_FORMAT_VERSION` →
     sonst `BackupVersionMismatchError` (kein Decrypt-Versuch).
  4. Wrapper-Block-Check (`kdf`/`cipher`/`ciphertext`) →
     `BackupSchemaError` falls fehlend.
  5. Async-Vor-Check: `sbkim_keys["main"]` existiert UND nicht force
     → `BackupOverwriteError` (deutschsprachige Message mit Hinweis
     auf Apoptose-Pfad-Konsequenz für Geschwister).
  6. `iterations = blob.kdf.iterations` (NICHT aus §0; Spec Pflicht-
     Frage 2 „Hinweis zur Kompatibilität").
  7. Decode salt/iv/ct + Decrypt + JSON.parse in einem try/catch →
     `BackupDecryptError("Falsches Passwort oder korruptes Backup")`.
  8. Schema-Check: `payload-schema-version >
     BACKUP_PAYLOAD_SCHEMA_VERSION` → `BackupSchemaError`. Pflichtfeld-
     Check (`nodeId`/`keys.privateKey`/`keys.publicKey`/`spore`) →
     `BackupSchemaError` mit konkretem Feld-Namen.
  9. Writes: `sbkim_keys["main"]` + `sbkim_spore["main"]` overwrite;
     Sibling-Loop additiv (put pro Eintrag, key=`s.nodeId`, leere/
     ungültige Einträge übersprungen).
  10. `resetIdentityCache()` (Helper-Reuse 3).
  11. `return {restored: true}`.
- **Selbstcheck-Zeile** auf zehn Funktionen erweitert:
  `init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache/exportBackup/importBackup`.
- **`SbkimSpore`-Export-Objekt** um zwei neue Funktionen + fünf
  Error-Klassen erweitert.
- **`_meta`** um vier Backup-Werte ergänzt (`backupFormatVersion`,
  `backupKdfIterations`, `backupPasswordMinLen`,
  `backupPayloadSchemaVersion`) + `siblingsStore`-Name.

### 2. `tests/manual_check.html` Panel 02 (+ drei Knöpfe)

- **Knopf 6 „Backup exportieren"** (Position nach den fünf
  bestehenden): `window.prompt` Passwort, vor Export wird Demo-Spore
  angelegt falls noch keine existiert (sonst Schema-Fail beim
  Re-Import — `payload.spore` wäre `null`), `SbkimSpore.exportBackup`,
  Blob als JSON ins Log, Download-Link `sbkim-backup-YYYY-MM-DD.json`
  via `Blob` + `URL.createObjectURL`. try/catch fängt
  `InvalidBackupPasswordError` / `NoIdentityError` mit Klassen-Name
  im Log + Status-Update.
- **Knopf 7 „Backup einlesen"**: `<input type="file" accept=".json">`
  + Passwort-Prompt, lese-Pfad `await file.text() → JSON.parse →
  importBackup`. **Erster Versuch ohne force**. Bei
  `BackupOverwriteError`: alter `getNodeId()` ins Log + Warnzeile
  („Mit zweitem Klick wirst du sie unwiderruflich ersetzen …"),
  `pendingBackup`-Stash für den Force-Pfad. Bei
  `BackupDecryptError`/`BackupSchemaError`/`BackupVersionMismatchError`:
  Klassen-Name ins Log. Bei `restored:true`: `getNodeId()` ins Log
  („Neue nodeId nach Restore: …").
- **Knopf 7b „Identität ersetzen — unwiderruflich"**: scharf nur
  wenn `pendingBackup` gesetzt; ruft `importBackup(blob, password,
  {force:true})`, danach `getNodeId()` ins Log. Reset von
  `pendingBackup` direkt am Anfang (Force-Pfad ist ein einmaliger
  Klick pro Aufnahme).

### 3. Karte 02 (`docs/components/02_spore.md`)

- **§ Manueller Test** um Punkte 6 (Backup exportieren — Erwartungs-
  Blob, Download-Link, `InvalidBackupPasswordError`-Fall) und 7
  (Backup einlesen — Force-Pfad, falsches Passwort, modifizierter
  Ciphertext, Wrapper-Version-Mismatch) erweitert.
- **§ Bauzustand** um zwei neue Zeilen:
  - „Code geschrieben (Bau 02.X Backup-Export)" — alle Details
    (fünf Error-Klassen, sechs Konstanten, drei Helper-Reuse-
    Entscheidungen, beide Funktionen, drei Panel-02-Knöpfe).
  - „Sichttest (Bau 02.X)" — „ungeprüft, weil headless gebaut".

### 4. INTERFACES.md

- **§1 Modul 02 Geprüft-Zeile** um „2026-05-16 (Bau 02.X Backup-
  Export Code-Stub)" erweitert.
- **§6 Änderungsprotokoll** neue Zeile am unteren Ende — Code-Befund
  mit drei Helper-Reuse-Entscheidungen, fünf Error-Klassen,
  `iterations`-aus-Blob-Hinweis, drei Panel-02-Knöpfen.
- **KEINE Bietet/Nutzt/Fehlerverhalten-Änderung** — Vertrag steht
  seit Spec-Sitzung Backup-Export Stufe 2, dieser Bau zieht nur
  Implementation nach.

### 5. PULS

- **§ Offene Querschnitts-Fragen „Identitäts-Persistenz"** Stufe (2)
  mit ~~strikethrough~~ markiert + Verweis auf beide Übergabe-
  protokolle (Spec + Bau). Stufe (3) bleibt offen, bis Folge-Pflege
  „Persistenz-Strategie verbinden" Modul 00 nachzieht.
- **§ Spore-Persistenz-Strategie verteilt** Modul-02-Punkt
  „Backup-Export" um Code-Stub-Vermerk + Helper-Reuse-Verweis
  erweitert.
- **Schnellüberblick-Tabelle** Modul 02 Code-Spalte um „Bau 02.X
  Backup-Export 2026-05-16" erweitert; Sichttest-Spalte um
  „ungeprüft (headless)"-Hinweis.
- **§ Sitzungs-Einträge** rotiert: dieser Bau-Eintrag oben mit
  vollem Text; Spec-Backup-Export-Eintrag wurde nach Konvention
  schon im Archiv-Index abgelegt und ist hier nur entfernt aus dem
  Volltext-Block.
- **§ Archiv-Index** neue Zeile oben (diese Bau-Sitzung).

### 6. status.json — nicht angefasst

Modul 02 bleibt `score:"stub"`, additive Code-Erweiterung, kein
Score-Wechsel. `update_puls_pie.py` NICHT aufgerufen (CLAUDE.md-
Konvention).

### 7. Übergabeprotokoll

Diese Datei.

---

## Was bewusst nicht angefasst wurde

- **`src/modules/00_doku_fenster.js` / `01_storage.js` /
  `03_embedding.js` / `04_match.js` / `05_anastomose.js` /
  `06_heterokaryose.js` / `07_apoptose.js` / `08_ui_demo.js`**
  unverändert. Modul 01 § `SbkimStorage.all`-Signatur nur gelesen
  (sbkim_siblings ist in `STORES_V1` registriert; fail-soft im Bau-
  Code ist Defense-in-Depth gegen künftige Schema-Migrationen).
- **`docs/components/00_doku_fenster.md` / `01_storage.md` /
  `03_…` / `04_…` / `05_…` / `06_…` / `07_…` / `08_…` /
  `09_…` / `10_…` / `11_…` / `12_…` / `14_…`** unverändert.
- **INTERFACES.md §0 / §1 Modul 02 Bietet-/Nutzt-/Fehlerverhalten-/
  §2 / §3 / §4 / §5** unverändert (Vertrag steht seit Spec-Sitzung,
  Bau zieht nur Implementation nach; nur Geprüft-Zeile + §6
  Änderungsprotokoll bekommen neue Zeile).
- **INTERFACES.md §2 Spore-JSON Pflicht-/Optional-Felder**
  unverändert — Backup-Format ist separate Schicht.
- **`PROTOCOL_VERSION`** bleibt `"0.1"` (keine Spore-Erweiterung).
- **`DB_VERSION`** bleibt `3` (kein neuer Store, Backup ist
  Aufrufer-extern).
- **`BACKUP_FORMAT_VERSION`** bleibt `1` (eigene additive
  Versionierung, startet bei 1, unabhängig von `PROTOCOL_VERSION` /
  `DB_VERSION`).
- **`status.json`** unverändert; **`update_puls_pie.py`** NICHT
  aufgerufen.
- **`index.html`** (Sage-Page) unverändert.
- **Karten 14 / 10 / 11 / 12** unangetastet.
- **Bestehende sieben + `resetIdentityCache`-Funktionen** unverändert
  (kein Refactoring — Helper-Reuse 1-3 sind reine Lese-/Aufruf-Pfade,
  keine Code-Änderung an `getOrCreateIdentity`, `generateOwnSpore`,
  `verifyForeignSpore`, `loadIdentity`, `init`).
- **Andock-Versuch** nicht unternommen (Bau-Sitzung, kein Endknoten-
  Eingriff; Klaus baut das Modul später per Copy-Paste in die
  Endknoten ein — siehe Modul 09).

---

## Validierung

- **`node --check src/modules/02_spore.js`** grün.
- **Alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html`**
  syntaktisch validiert (Python-Splitter + `node --check` pro Block):
  alle 10 OK. Ein erster Lauf zeigte einen ASCII-Quote-Konflikt in
  einem String mit eingebettetem `"Backup einlesen"` — repariert mit
  Unicode-Anführungszeichen `„…"`.
- **Cross-Reading** Karte 02 ↔ INTERFACES.md §1/§6 ↔ PULS auf
  Konsistenz durchgezogen:
  - Error-Klassen-Namen identisch in Code / Karte 02 § Fehlerverhalten
    / INTERFACES.md §1 Modul 02 Fehlerverhalten-Block /
    Übergabeprotokoll.
  - Konstanten-Werte identisch in Code / §0 / Karte 02
    § Konfigurationswerte.
  - Funktions-Signaturen (Parameter, Rückgabe-Form) identisch in
    Code / Karte 02 § Schnittstelle / INTERFACES.md §1 Modul 02
    Bietet-Block.
  - Drei Helper-Reuse-Entscheidungen identisch dokumentiert in Karte
    02 § Bauzustand-Zeile Bau 02.X / INTERFACES.md §6 / dieses
    Übergabeprotokoll.
- **CLAUDE.md-Vorgaben respektiert:**
  - Bau-Sitzung schreibt nur in dem Modul, das beauftragt wurde
    (Modul 02 — Code + Karten-Bauzustand + Manueller Test).
  - INTERFACES.md zuerst geprüft (Vertrag steht schon aus Spec-
    Sitzung), Code zieht nach — heilige Tafeln nicht aufgebrochen.
  - `update_puls_pie.py` nicht aufgerufen (kein Score-Wechsel).
  - Keine personenbezogenen Daten in Code / Karte / Tests / PULS.
  - Antworten auf Deutsch, ruhig + präzise.

---

## Sichttest-Status

**Ungeprüft, weil headless gebaut — wartet auf Klaus' Browser-Lauf.**

Klaus' echter Sichttest in seinem Browser bringt die plattform-
spezifische Antwort:

- **PBKDF2-600 000-Aufruf-Zeit auf Galaxy Tab S6** (Ziel: ≤ 2 s).
  Spec-Sitzung Pflicht-Frage 2 Begründung 3: „Aufruf-Zeit auf
  low-end Android ~1–2 s, auf Desktop < 0,5 s". Wenn der Tab S6
  spürbar über 2 s landet, kann eine spätere Pflege-Sitzung
  `BACKUP_KDF_ITERATIONS` runtersetzen — die §0-Konstante ist genau
  für diesen Fall querschnittlich, und der Bau hat `iterations` aus
  `blob.kdf.iterations` gelesen (nicht aus §0 — alte Backups bleiben
  importierbar).
- **AES-GCM-Verhalten in Safari iOS**. Modul 02 hat einen
  `CryptoUnavailableError`-Pfad für altes Safari (Ed25519 < 17), der
  hier nicht greifen sollte — AES-GCM ist deutlich älter als Ed25519
  im WebCrypto-Support, also dürfte AES-GCM überall verfügbar sein,
  wo Ed25519 läuft.

**Test-Plan für Klaus (Panel 02, drei neue Knöpfe):**

1. **„Backup exportieren"** — Passwort ≥ 8 Zeichen eingeben.
   Erwartung: Wrapper-Blob mit `version:1`, `kdf:{…,iterations:600000,
   salt:…}`, `cipher:{…,iv:…}`, `ciphertext:…`,
   `payload-schema-version:1`. Download-Link erscheint unter den
   Knöpfen.
2. **Mit zu kurzem Passwort** (< 8 Zeichen): synchron
   `InvalidBackupPasswordError`, kein Crypto-Aufruf (Klick spürbar
   sofortig).
3. **„Backup einlesen"** mit der Datei aus Schritt 1, gleicher PWA:
   `BackupOverwriteError`, Warnzeile mit aktueller nodeId.
4. **„Identität ersetzen — unwiderruflich"** (zweiter Klick):
   `{restored: true}`, gleiche nodeId wie vor dem Export.
5. **„Backup einlesen"** mit falschem Passwort: `BackupDecryptError`.
6. **„Backup einlesen"** mit modifizierter Datei** (irgendein
   Zeichen im `ciphertext` umtippen): `BackupDecryptError`.
7. **„Backup einlesen"** mit Wrapper-`version: 2` (von Hand
   editiert): synchron `BackupVersionMismatchError`, kein Decrypt-
   Versuch.

Ergebnis kommt in Karte 02 § Bauzustand Zeile „Sichttest (Bau 02.X)".

---

## Was offen blieb

### Stufe (3) Quota-Frühwarnung

Modul 00 hat die §0-Konstanten `DOKU_QUOTA_WARN_RATIO = 0.80` und
`DOKU_QUOTA_WARN_BYTES = 50 MiB` schon verankert (Spec-Sitzung 00,
2026-05-14) und zeigt die Warnzeile. Mit Stufe (2) jetzt Code-da
darf eine kleine Folge-Pflege „Persistenz-Strategie verbinden"
Modul 00 um eine „Backup empfohlen"-Zeile erweitern, wenn
`SbkimStorage._meta.storagePersisted === false` ODER Quota-Schwelle
greift. Damit ist der Querschnitts-Eintrag „Identitäts-Persistenz"
final gelöst (alle drei Stufen). Klein, ~30 Min headless.

### Klaus' Sichttest Panel 02 Knöpfe 6/7/7b

Siehe Sichttest-Status oben. Bei grünem Lauf: § Bauzustand-Zeile
„Sichttest (Bau 02.X)" auf „geprüft <Datum>" stellen. Bei rotem
Lauf: Test-Bug oder Modul-Bug differenzieren (siehe Diagnose-Pfad
in Karte 02 § Manueller Test bzw. Spec-Sitzung Pflicht-Frage 2
„Hinweis zur Kompatibilität").

### Übrige offene Punkte aus Spec Backup-Export Stufe 2

Unverändert offen:

- Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch mit PWA-Suffix.
- `status.json` `pingStatus`-Update nach Re-Andock.
- Cross-Knoten-Handshake zwischen beiden Endknoten.
- Eruda-Rückbau in beiden Endknoten nach erstem Cross-Handshake.
- Mini-Pflege „Sushi-Kategorie sichtbar machen" in Mein-Mixarium.
- INTERFACES.md §6 Tabellen-Bug aus PR #45 Squash-Merge.
- Klaus' Sichttest Panel 06 (Heterokaryose).
- Klaus' Sichttest Panel 01 fünfter Knopf „Persist-Status zeigen".

---

## Nächster sinnvoller Schritt

1. **Klaus' Sichttest Panel 02** Knöpfe 6/7/7b in seinem Browser.
   Bringt die plattform-spezifische Antwort (Tab-S6-PBKDF2-Zeit,
   Safari-iOS-AES-GCM).
2. **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** mit
   PWA-Suffix aus Pflege 2026-05-16 (unverändert offen, wartet auf
   Klaus am Termux).
3. **Cross-Knoten-Handshake** nach Re-Andock.
4. **Folge-Pflege „Persistenz-Strategie verbinden"** — Modul 00
   Doku-Fenster um „Backup empfohlen"-Zeile erweitern, wenn
   `_meta.storagePersisted === false` ODER Quota-Frühwarnung greift.
   Damit ist der Querschnitt „Identitäts-Persistenz" final gelöst.

---

## Material aus der Sitzung

**Bau-Statistik:**

- `src/modules/02_spore.js`: vorher 444 Zeilen → nachher ~660 Zeilen.
  Additive Erweiterung: drei modul-lokale + drei §0-gespiegelte
  Konstanten, eine `SIBLINGS_STORE`-Konstante, fünf Error-Factory-
  Funktionen, ein `derivePbkdf2AesGcmKey`-Helper, zwei öffentliche
  Funktionen (`exportBackup` + `importBackup`), eine erweiterte
  Selbstcheck-Zeile, vier zusätzliche `_meta`-Felder.
- `tests/manual_check.html`: drei zusätzliche Panel-02-Knöpfe (6,
  7, 7b — Export, Einlesen, Identität-ersetzen-force) plus eine
  Variable `pendingBackup` als Stash zwischen Knopf 7 und 7b.
- `docs/components/02_spore.md`: zwei neue § Manueller Test-Punkte
  (6, 7), zwei neue § Bauzustand-Zeilen (Code, Sichttest).
- `docs/INTERFACES.md`: Geprüft-Zeile erweitert, §6 neue Zeile.
- `docs/PULS.md`: Querschnitts-Frage Stufe (2) ~~strikethrough~~,
  Spore-Persistenz-Strategie aktualisiert, Schnellüberblick erweitert,
  Sitzungs-Einträge rotiert, Archiv-Index neue Zeile oben.

**Validierungs-Ergebnisse:**

- `node --check src/modules/02_spore.js`: OK.
- Inline-Script-Validation (10 Blöcke in `tests/manual_check.html`):
  alle OK nach Quote-Fix.

**Beobachtung zur Modul-02-Code-Form:** Der bestehende Code nutzt
`var` durchgängig, Funktionen sind `function`-deklariert, kein
`let`/`const`. Die Bau-Sitzung hat diese Konvention strikt
übernommen — keine `let`/`const` im neuen Code, keine Arrow-
Funktionen im Backup-Pfad. Konsistenz mit den bestehenden sieben +
`resetIdentityCache`-Funktionen ist wichtiger als ES2015-Eleganz
(Modul 02 ist ein Singleton-IIFE im Browser, kein NPM-Paket).

**Commit dieser Sitzung:** TBD (folgt am Sitzungs-Ende).

**Branch:** `claude/bau-02x-backup-export-kt2MF`.

**PR:** wird am Sitzungs-Ende als Draft erstellt.
