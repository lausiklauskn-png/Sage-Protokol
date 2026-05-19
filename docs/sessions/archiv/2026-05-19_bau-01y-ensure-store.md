# Übergabeprotokoll — Bau-Sitzung 01.Y `ensureStore` in Modul 01

**Datum:** 2026-05-19
**Sitzungs-Rolle:** Bau-Sitzung (kein Spec, kein Modul-Vertrag-Eingriff).
**Branch:** `claude/bau-01y-ensure-store-SxpKG` (Harness-Suffix; gemeinte
Konvention `claude/bau-01y-ensure-store` aus Brief 99). Erster Bau der
Bau-Sitzungs-Brief-Pipeline aus Brief 99 (Klaus' Wahl 2026-05-19:
**Infrastruktur zuerst** — vor Sage-Page-Refactor).

**Voraussetzung:** Brief 99 (PR #100 gemerged 2026-05-19, `main`
`80994fd`) hat die V1-Sammelspec-Kaskade vollständig auf `main`
geschlossen — INTERFACES § 9.5 Option A („dynamische Store-Erzeugung
via `ensureStore`") ist verbindliche Spec.

**Kern (drei Sätze):** Modul 01 hat jetzt eine achte öffentliche
Funktion `ensureStore(storeName: string) → Promise<void>` für die
dynamische Anlage identitäts-spezifischer Stores ab DB-Version 4. Die
Versions-Bump-Choreografie ist linear über `db.version + 1`
implementiert (entkoppelt von der Build-Konstante `DB_VERSION`), mit
fail-soft `onversionchange`-Handlern auf jeder neuen Verbindung; das
Modul-01-Pattern `^sbkim_[a-z0-9_]+$` wird synchron geprüft
(`InvalidStoreNameError`), Bump-Fehler aus der IDBOpenDBRequest-
Choreografie laufen async durch `EnsureStoreError` mit
`cause`-Property. KEINE Modul-02/05/06/07-Änderung, KEINE identitäts-
spezifischen Stores angelegt — das ist Aufrufer-Pflicht in den Folge-
Bau-Sitzungen 02.Y / 05.Y / 06.Y / 07.Y.

---

## Fünf Punkte a–e des Briefes

### a) INTERFACES.md § 1 Modul 01 nachgezogen

- **Bietet-Block** um neue Funktion `ensureStore(storeName: string) →
  Promise<void>` erweitert, additiv hinter `clear(storeName)`.
- **Garantien-Block** zur Funktion ergänzt: Idempotenz (existierender
  Store → no-op-Promise, kein Versions-Bump, keine Resource-Leakage);
  synchroner Pattern-Check `^sbkim_[a-z0-9_]+$` (`InvalidStoreNameError`
  vor jedem Promise-Aufbau); kein `UnknownStoreError` (`ensureStore`
  *erzeugt* den Store); nach Erfolg ist der Store regulär in
  `getStore/get/put/del/all/clear` nutzbar (KNOWN_STORES wird
  erweitert); KEINE Datenmigration alter Stores, KEINE neuen Indices
  auf bestehenden Stores; Aufrufer trägt die Identitäts-Konvention,
  Modul 01 kennt Identität nicht.
- **Storage-Block:** `DB-Version` von 3 auf 4 nachgezogen mit
  ausführlichem Begründungs-Hinweis (additive Erweiterung; `STORES_V4`
  leer, weil v=4 keinen festen Pflicht-Store anlegt; v=4 markiert den
  Übergang zu „dynamische Stores via `ensureStore`"). Neuer Sub-Hinweis
  „Dynamische Stores ab DB-Version 4" mit Pattern und Konstanten-Bezug
  `STORE_NAME_PATTERN`.
- **Selbstcheck-Funktionsliste** auf acht Funktionen erweitert
  (`init/getStore/get/put/del/all/clear/ensureStore`).
- **Fehlerverhalten-Tabelle** um zwei Zeilen ergänzt:
  `InvalidStoreNameError` (synchron bei Pattern-Verstoß) und
  `EnsureStoreError` (asynchron bei fehlgeschlagener Versions-Bump-
  Choreografie; `cause`-Property aus IDBOpenDBRequest-Error-Reason).
- **Geprüft-Zeile** um „2026-05-19 (Bau 01.Y `ensureStore`)" erweitert.
- **§ 9.5 Migrations-Strategie** um Stand-Hinweis auf die Bau-Folge-
  Sitzung 01.Y ergänzt (`„Bau-Folge-Sitzung 01.Y vom 2026-05-19 hat den
  ensureStore-Pfad gebaut; siehe § 1 Modul 01 Bietet-Block"`). KEIN
  inhaltlicher Spec-Eingriff in § 9.1–9.7 — Spec ist gesetzt, Bau zieht
  nur den Code nach.
- **§ 10 Änderungsprotokoll** um neue Zeile „2026-05-19 · Bau-Sitzung
  01.Y `ensureStore`" erweitert.

### b) Karte 01 (`docs/components/01_storage.md`) nachgezogen

- **§ Schnittstelle:** Einleitungs-Satz auf „acht öffentliche
  Funktionen" geändert; neuer Code-Block für `ensureStore` mit
  Signatur, Garantien, Pattern-Begründung (`STORE_NAME_PATTERN`
  strenger als `DB_SUFFIX_PATTERN`), Versions-Bump-Choreografie
  (linear via `db.version + 1`), Aufrufer-Konvention (Bau 02.Y),
  Fehler-Verweis auf § Fehlerverhalten.
- **§ Storage-Stores:** STORES_V1/V2/V3-Tabelle unverändert; neuer Sub-
  Block „Dynamische Stores ab v=4" mit Aufrufer-Konvention (Modul 02
  ruft pro identitäts-spezifischem Store), Pattern, Idempotenz-Hinweis,
  Pflicht-Stores-bleiben-unangetastet-Klausel.
- **§ Versionsmigration:** `DB_VERSION = 4`-Zeile aktualisiert; neue
  Tabellenzeile `v=4` mit Anmerkung „_(keine Pflicht-Stores —
  `STORES_V4 = []`)_"; ausführlicher Sub-Block „Sonderfall `v=4` (Bau
  01.Y)" mit Erklärung des Übergangs zu dynamischen Stores.
- **§ Konfigurationswerte:** neue Konstante `STORE_NAME_PATTERN =
  /^sbkim_[a-z0-9_]+$/` mit modul-lokaler Begründung (NICHT in §0,
  sondern direkt im Modul-01-Vertrag); `DB_VERSION = 4` nachgezogen.
- **§ Fehlerverhalten:** zwei neue Zeilen analog INTERFACES.md
  (`InvalidStoreNameError` synchron, `EnsureStoreError` async mit
  `cause`).
- **§ Risiken & offene Punkte:** neuer Punkt „Versions-Bump-
  Choreografie auf mehreren Tabs" — beschreibt das `onblocked`-Szenario,
  wenn ein anderer Tab `onversionchange` ignoriert; Empfehlung Single-
  Instance-Disziplin beim Andocken, Verweis auf PULS § Offene
  Querschnitts-Fragen „DeX-Chrome vs. Tablet-Chrome".
- **§ Manueller Test:** Knöpfe 6/7/8 hinzugefügt (Drei-Stufen-Probe
  happy-path / Idempotenz / Pattern-Verstoß) mit konkreten
  Erwartungen; Cleanup-Hinweis für Test-Stores `sbkim_test_*`.
- **§ Bauzustand:** zwei neue Zeilen — „Bau 01.Y `ensureStore`
  2026-05-19" mit voller Punkte-a-bis-e-Beschreibung und „Sichttest
  Knöpfe 6/7/8 `ensureStore` (Bau 01.Y)" als „ungeprüft, weil
  headless gebaut — wartet auf Klaus' Browser-Lauf".

### c) `src/modules/01_storage.js` erweitert

- **`DB_VERSION = 4`** (von 3).
- **`STORES_V4 = []`** als leere Liste; `applyMigration(db, 4)`-Branch
  als no-op-Marker hinzugefügt (Loop läuft durch, legt keinen
  Pflicht-Store an).
- **`STORE_NAME_PATTERN = /^sbkim_[a-z0-9_]+$/`** modul-lokal.
- **`KNOWN_STORES`-Konstruktion** um `STORES_V4` erweitert (bleibt
  leer, aber zukunftssicher). Kommentar erklärt, dass die Liste ab
  Bau 01.Y zur Laufzeit erweitert wird.
- **Neue Fehler-Factories** `InvalidStoreNameError` und
  `EnsureStoreError` (Factory-Stil analog Modul 02 / 08;
  `EnsureStoreError` mit `cause`-Parameter).
- **Neuer Modul-State `currentDb`** (null vor `init()`) als sync-
  lesbarer Anker auf die aktuelle IDBDatabase-Verbindung.
- **Neue Helper-Funktion `attachVersionChangeHandler(db)`:** installiert
  einen fail-soft `onversionchange`-Handler, der bei einem Versions-
  Bump auf einer anderen Verbindung die alte Verbindung schließt und
  `currentDb` + `dbPromise` invalidiert. Wird in `init`-onsuccess und
  in `ensureStore`-onsuccess gerufen.
- **Neue öffentliche Funktion `ensureStore(storeName)`:**
  1. Sync-Pattern-Check via `STORE_NAME_PATTERN`
     (`InvalidStoreNameError` vor jedem Promise-Aufbau).
  2. `init().then(db ⇒ ...)` für Idempotenz-Check:
     `db.objectStoreNames.contains(storeName)` → ja → resolve
     `undefined` (KNOWN_STORES wird falls nötig synchron nachgezogen,
     z.B. wenn der Store von einem anderen Tab dynamisch angelegt
     wurde).
  3. Sonst Versions-Bump-Choreografie:
     - `db.close()` der aktuellen Verbindung (try/catch — fail-soft,
       falls Verbindung in seltsamem Zustand).
     - `currentDb = null; dbPromise = null;` damit nachfolgende
       `init()`-Aufrufe die neue Verbindung bekommen.
     - `indexedDB.open(dbNameInUse, db.version + 1)` mit
       `onupgradeneeded`-Handler, der `createObjectStore(storeName)`
       aufruft (kein keyPath, externe Keys wie alle anderen sbkim_*-
       Stores).
     - `onsuccess`: neue Verbindung als `currentDb` cachen,
       `dbPromise = Promise.resolve(newDb)`, `KNOWN_STORES.push(name)`,
       `attachVersionChangeHandler(newDb)`, resolve `undefined`.
     - `onerror` / `onblocked`: `EnsureStoreError` mit `cause` bzw.
       sprechender Meldung.
  4. KEINE Schema-Migration alter Stores — nur additive Anlage.
- **`window.SbkimStorage.ensureStore`** im Export-Block ergänzt.
- **`window.SbkimStorage.InvalidStoreNameError`** und
  `window.SbkimStorage.EnsureStoreError` als Factory-Exporte.
- **Selbstcheck**-Zeile auf acht Funktionen erweitert
  (`MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear/ensureStore`).
- **`_meta.dbVersion`** als Getter (`currentDb ? currentDb.version :
  DB_VERSION`) — Live-Zustand statt Build-Konstante, kann nun > 3 sein.
- **`_meta.dbVersionInitial`** als Build-Konstante (Tests können den
  Initial-Wert separat abfragen).
- **`_meta.knownStores`** als Getter — Snapshot pro Aufruf (war vorher
  einmaliger Snapshot bei Modul-Laden).
- **`_meta.ensureStorePattern`** als Read-Anker für Tests.
- **`node --check src/modules/01_storage.js`** grün.

### d) `tests/manual_check.html` Panel 01 erweitert

Drei neue Knöpfe (additiv hinter Knopf 5 „Persist-Status zeigen"):

- **Knopf 6 „ensureStore('sbkim_test_foo')"** — happy-path. Loggt
  `db.version` vor und nach dem Aufruf, prüft per
  `_meta.knownStores.indexOf("sbkim_test_foo")`, ob der neue Store in
  der Allow-List ist, gibt Sichtprüfungs-Hinweis aus.
- **Knopf 7 „ensureStore('sbkim_test_foo') zweimal"** — Idempotenz.
  Loggt drei `db.version`-Werte (vor erstem Aufruf, nach erstem,
  nach zweitem); setzt Panel-Status auf `fail`, wenn der zweite
  Aufruf die Version erhöht hat (Idempotenz-Verletzung).
- **Knopf 8 „ensureStore('invalid-name')"** — Pattern-Verstoß.
  Erwartet synchronen `InvalidStoreNameError` (Bindestrich verstößt
  gegen `^sbkim_[a-z0-9_]+$`, plus fehlender `sbkim_`-Präfix). Setzt
  Panel-Status auf `fail`, wenn der falsche Fehler-Name kommt.

Cleanup-Hinweis im Knopf-6-Output: Test-Stores `sbkim_test_*` bleiben
in der DB — Klaus löscht sie via DevTools → Application → IndexedDB
manuell.

### e) Übergabeprotokoll

Diese Datei,
`docs/sessions/archiv/2026-05-19_bau-01y-ensure-store.md`.

---

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Reihenfolge: INTERFACES.md § 1 Modul 01
  Bietet-Block ZUERST erweitert (Vertrag), DANN Karte 01, DANN Code.
  KEIN Vertrags-Drift.
- **Option A aus § 9.5 ist gewählt** (Brief 04 Spec). Modul 01 hat
  Identitäts-Konzept NICHT zu kennen — `ensureStore` nimmt einen
  beliebigen Store-Namen, prüft das Modul-01-Pattern
  `^sbkim_[a-z0-9_]+$`, legt den Store an, falls noch nicht da.
  Aufrufer (Modul 02 in Bau 02.Y) liefert den `_<key>`-Suffix.
- **Versions-Bump-Choreografie verbindlich umgesetzt.** Aktuelle
  Verbindung wird vor dem Bump explizit `close()`-d; `newVersion =
  db.version + 1` hält die Versions-Folge linear und entkoppelt von
  der Build-Konstante `DB_VERSION`; `onversionchange`-Handler auf der
  NEUEN Verbindung schließt fail-soft (damit ein Folge-Bump im selben
  Tab durchgeht); Idempotenz via `db.objectStoreNames.contains(name)`
  (no-op, kein Bump, keine Resource-Leakage); KEINE Schemata-Migration
  alter Stores — nur additive Anlage; bestehende STORES_V1/V2/V3
  bleiben unangetastet.
- **DB-Version auf 4 gesetzt.** STORES_V1/V2/V3 bleiben unverändert
  (initialer Migrations-Pfad). `STORES_V4 = []` als leere Liste
  gewählt — keine Pflicht-Stores in v=4, das ist die Konvention „alle
  Stores oberhalb v=3 werden dynamisch via `ensureStore` angelegt".
  Karte 01 § Versionsmigration dokumentiert die Entscheidung mit
  eigenem Sub-Block „Sonderfall `v=4` (Bau 01.Y)".
- **Selbstcheck-Format** erweitert (`MODUL 01 STORAGE bereit,
  Funktionen: init/getStore/get/put/del/all/clear/ensureStore` — acht
  Funktionen).
- **`PROTOCOL_VERSION` bleibt `"0.1"`.** `ensureStore` ist lokales
  Storage-Schema, kein Spore-Feld.
- **`BACKUP_FORMAT_VERSION` bleibt `1`.** Bau 02.Y bumpt das auf 2,
  nicht 01.Y.
- **`DB_VERSION` von 3 auf 4** (additive Schema-Erweiterung — leere
  STORES_V4-Liste, Übergangs-Marker).

---

## Was NICHT angefasst

- **Modul 02 (Spore).** Multi-Identitäts-API kommt in Bau 02.Y. Modul
  02's `getOrCreateIdentity(key)` wird später `ensureStore` für jeden
  identitäts-spezifischen Store rufen, aber das ist 02.Y — nicht 01.Y.
- **Modul 05 / 06 / 07.** Transparenter Slot-Pfad kommt in 05.Y / 06.Y
  / 07.Y. KEINE Receiver-Map nodeId→key gebaut.
- **KEINE identitäts-spezifischen Stores angelegt.** `ensureStore` ist
  generisch — Modul 01 kennt Identität nicht. Aufrufer liefert den
  Namen.
- **KEIN `PROTOCOL_VERSION`-Bump** (lokales Storage-Schema, kein
  Spore-Feld).
- **KEIN `BACKUP_FORMAT_VERSION`-Bump** (02.Y bumpt das auf 2).
- **KEINE Sage-Page-Änderung** (Sage-Page-Refactor ist eigene Bau-
  Sitzung in der Pipeline).
- **KEINE CLAUDE.md-/Karte-09-/`status.json`-Änderung.** Bau 01.Y
  ändert keine Endknoten-Konvention.
- **KEIN `update_puls_pie.py`-Aufruf** — Modul 01 ist bereits
  `score:"fertig"` (Live-Andock-Beweis 2026-05-16); `ensureStore` ist
  additive Erweiterung, kein Score-Wechsel.
- **KEIN Modul-Vertrag-Eingriff in § 9.1–9.7.** Spec ist gesetzt;
  Bau zieht nur Code nach. Einziger § 9.5-Eingriff ist ein Verweis-
  Hinweis am Ende des Sub-§.
- **KEINE Modul-02-`generateOwnSpore`-Erweiterung** (Modul 02 setzt
  später, in 02.Y, den `key`-Parameter um — aber das ist Vertrags-
  Bietet-Block in Modul 02, nicht Modul 01).

---

## Smoke-Test mit fake-indexeddb (headless)

Headless-Bau-Smoke-Test mit `fake-indexeddb` als IndexedDB-Stub durch
Node 22:

| Probe | Erwartet | Ergebnis |
|---|---|---|
| Exporte | acht Funktionen + zwei Fehler-Factories | ✓ `init/getStore/get/put/del/all/clear/ensureStore` + `InvalidStoreNameError` + `EnsureStoreError` |
| Selbstcheck | „MODUL 01 STORAGE bereit, Funktionen: …/ensureStore" | ✓ ausgegeben beim Laden |
| `_meta.dbVersion` vor `init()` | `4` (Build-Konstante) | ✓ 4 |
| `_meta.dbVersion` nach `init()` | `4` (frische DB, keine Stores via `ensureStore` angelegt) | ✓ 4 |
| `_meta.knownStores.length` nach `init()` | `8` (sechs aus v=1 + 1 aus v=2 + 1 aus v=3) | ✓ 8 |
| `ensureStore("invalid-name")` | synchroner Wurf `InvalidStoreNameError` | ✓ name: `InvalidStoreNameError` |
| `ensureStore("foo_bar")` (fehlender `sbkim_`-Präfix) | synchroner Wurf `InvalidStoreNameError` | ✓ name: `InvalidStoreNameError` |
| `ensureStore("sbkim_test_foo")` happy-path | `dbVersion` 4 → 5; Store in `knownStores` | ✓ 4 → 5; `knownStores.includes("sbkim_test_foo") === true` |
| `ensureStore("sbkim_test_foo")` zweimal | `dbVersion` bleibt 5 (Idempotenz) | ✓ 5 = 5 |
| `ensureStore("sbkim_test_bar")` (zweiter Bump) | `dbVersion` 5 → 6 | ✓ 5 → 6 |
| `put`/`get` auf dem dynamisch angelegten Store | Wert kommt zurück | ✓ `{ v: 42 }` |

Die headless Probe deckt den Programm-Pfad ab; was sie **nicht**
abdeckt, ist das DevTools-Application-IndexedDB-Sichtbarkeits-Kriterium
(Stores erscheinen visuell in der Browser-DevTools), das
`onversionchange`-Verhalten zwischen mehreren echten Tabs derselben
Origin und das tatsächliche `persist()`-Verhalten — diese drei Aspekte
prüft erst Klaus' Browser-Sichttest.

## Manueller Sichttest

**Ungeprüft, weil headless gebaut — wartet auf Klaus' Browser-Lauf
(Galaxy Tab S6 + DeX, Chrome).** Drei-Stufen-Probe in
`tests/manual_check.html` Panel 01:

1. **Knopf 6 happy-path:** `ensureStore('sbkim_test_foo')` → in
   DevTools → Application → IndexedDB → `sbkim` (oder
   `sbkim_<dbSuffix>`) muss der Store `sbkim_test_foo` zusätzlich zu
   den acht Pflicht-Stores erscheinen. `db.version` steigt um genau 1.
2. **Knopf 7 Idempotenz:** `ensureStore('sbkim_test_foo')` zweimal in
   Folge → `db.version` zwischen den zwei Aufrufen darf NICHT
   steigen. Idempotenz-Garantie aus § Schnittstelle / § 9.5 Option A.
3. **Knopf 8 Pattern-Verstoß:** `ensureStore('invalid-name')` →
   `InvalidStoreNameError` **synchron** geworfen (kein Promise-Aufbau,
   try/catch außerhalb `await` fängt). `name`-Property gesetzt,
   `message` deutschsprachig.

**Cleanup nach Sichttest:** die Test-Stores `sbkim_test_*` bleiben in
der IndexedDB. Klaus kann sie über DevTools → Application → IndexedDB
→ Rechte-Maustaste auf Store-Name → „Delete" manuell entfernen.
Modul 01 bietet keinen `dropStore`-Pfad — Drop-Operationen brauchen
einen eigenen Spec-Eintrag (Karte 01 § Versionsmigration).

---

## Nächster sinnvoller Schritt

**Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump in Modul 02** ist
die direkte logische Folge. Bau 02.Y ruft `SbkimStorage.ensureStore(...)`
für jeden identitäts-spezifischen Store
(`sbkim_keys_<key>` / `sbkim_spore_<key>` / `sbkim_siblings_<key>` /
etc.) im Anlegen-Pfad einer neuen Persona; bumpt zusätzlich
`BACKUP_FORMAT_VERSION` von 1 auf 2 (Multi-Identitäts-Backup
„kompletter Rucksack" mit `payload.identities[]`-Pflicht-Feld, Brief
04 § 9.6). Geschätzt ~5-8 h.

Vor Bau 02.Y sollte Klaus den Sichttest der drei neuen Panel-01-
Knöpfe in `tests/manual_check.html` durchführen — sicherstellen,
dass die Versions-Bump-Choreografie auf seinem konkreten Setup
(DeX-Chrome) sauber durchläuft. Bei `EnsureStoreError` mit
`cause`-Hinweis auf `onblocked` ist das ein Architektur-Befund (zwei
Tabs im selben DeX-Chrome haben die DB offen) — bitte als offene
Frage in PULS dokumentieren statt Bau 02.Y darauf zu setzen.

---

## Bezüge

- **Brief:** [`docs/sessions/BRIEF_BAU_01Y_ENSURE_STORE.md`](../BRIEF_BAU_01Y_ENSURE_STORE.md)
- **Spec-Quelle:** INTERFACES.md § 9.5 Migrations-Strategie Option A
  (Brief 04 der V1-Sammelspec-Kaskade, gemerged 2026-05-19)
- **Vorgänger:** PR #100 Brief 99 Sammelspec-Abschluss
  (gemerged 2026-05-19, `main` `80994fd`)
- **Karte:** [`docs/components/01_storage.md`](../../components/01_storage.md)
  — § Schnittstelle / § Storage-Stores / § Dynamische Stores ab v=4 /
  § Konfigurationswerte / § Fehlerverhalten / § Risiken / § Manueller
  Test / § Bauzustand alle nachgezogen
- **Code:** [`src/modules/01_storage.js`](../../../src/modules/01_storage.js)
  — Bau-01.Y-Block im Datei-Kopf-Kommentar, `ensureStore` direkt nach
  `clear`, `attachVersionChangeHandler`-Helper zwischen Migration und
  init
- **Test-Panel:** [`tests/manual_check.html`](../../../tests/manual_check.html)
  Panel 01 — Knöpfe 6/7/8 additiv
