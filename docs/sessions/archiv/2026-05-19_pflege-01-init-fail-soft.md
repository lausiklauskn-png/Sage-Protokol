# Übergabeprotokoll — Pflege Modul 01 `init()` versions-fail-soft

**Datum:** 2026-05-19
**Sitzungs-Rolle:** Pflege-Sitzung (kein Spec, kein neuer Modul-
Vertrag, additive Garantien-Erweiterung an Modul 01).
**Branch:** `claude/pflege-01-init-fail-soft`. Direkte Folge auf
Klaus' Bau-02.Y-Sichttest 2026-05-19 (PR #104 gemerged, `main`
`63e8fd1`), Meta-Pflege Tafel-Evolutions-Klausel (PR #105 gemerged,
`main` `60ea3f6`) und Brief-Pflege (PR #106 gemerged, `main`
`42a04e0`).

**Auslöser:** Klaus' Sichttest 2026-05-19 (DeX-Chrome auf Galaxy
Tab S6) hat freigelegt, dass `init()` hartkodiert mit
`indexedDB.open(name, DB_VERSION=4)` öffnet und mit `VersionError`
scheitert, wenn die DB durch frühere `ensureStore`-Bumps (Bau 01.Y
Sichttest, Bau 02.Y Sichttest) eine höhere Version hat. Klaus'
Cleanup-Workaround „Browserdaten löschen + Storage init klicken"
funktionierte, war aber Klaus-unfreundlich. Diese Pflege beseitigt
den Workaround.

---

## Kern (drei Sätze)

`DB_VERSION = 4` ist jetzt **Mindest-Schema-Version**, nicht
„immer-anstreben-Version". `init()` öffnet die DB zweiphasig: erst
ein Probe-Open ohne Version (liefert existing Version + Flag ob
gerade neu angelegt), dann eine Entscheidung — bei `existing >=
DB_VERSION` Pflicht-Stores prüfen und existing übernehmen, sonst
regulärer Initial-Pfad mit `onupgradeneeded`. Test-Stores aus
früheren `ensureStore`-Aufrufen blockieren den nächsten `init()`
nicht mehr; Klaus' Cleanup-Theater bei Sichttests entfällt.

---

## Sechs Punkte a–f

### a) INTERFACES.md drei kleine Eingriffe

- **§ 1 Modul 01 Bietet-Block** um neuen Sub-Block **„init-Garantien
  (Pflege „init() versions-fail-soft", 2026-05-19)"** erweitert:
  - `DB_VERSION` als Mindest-Schema-Version (Bedeutung-Wandel).
  - Initial-Pfad (existing < `DB_VERSION`) unverändert (Bau-01.Y-
    Verhalten).
  - Fail-soft-Pfad (existing >= `DB_VERSION`) via Probe-Open +
    `checkRequiredStores` + Re-Open mit existing Version, kein
    `onupgradeneeded`.
  - Bei fehlendem Pflicht-Store: `StorageOpenError` mit Liste; Modul
    01 repariert manuell zerstörte DBs NICHT.
  - Multi-Tab-Race-Risiko als bekannte Limitierung notiert.
- **§ 1 Modul 01 Geprüft-Zeile** um „2026-05-19 (Pflege `init()`
  versions-fail-soft)" erweitert.
- **§ 9.5 Folge-Befund-Absatz** um Stand-Hinweis ergänzt: Pflege
  durchgeführt, Code-Pfad mit `openProbe` / `checkRequiredStores` /
  `openExact` eingebaut.
- **§ 10 Änderungsprotokoll** neue Zeile.

KEIN Eingriff in Bietet-/Storage-/Fehlerverhalten-Block jenseits der
Garantien-Erweiterung. Vertrag unverändert.

### b) Karte 01 nachgezogen

- **§ Schnittstelle init()-Doku-Block** um Hinweis auf
  versions-fail-soft erweitert (Funktions-Signatur unverändert).
- **§ Versionsmigration** neuer Sub-Block **„Versions-Fail-Soft-Pfad
  (Pflege 2026-05-19)"** mit Entscheidungs-Tabelle (Probe + drei
  Fälle A/B/C) und Klaus-Effekt-Hinweis.
- **§ Risiken** zwei neue Punkte:
  - „Manuell zerstörte DB" — fehlender Pflicht-Store →
    `StorageOpenError`, kein Auto-Reparatur-Pfad.
  - „Multi-Tab-Race zwischen Probe und Re-Open" — bekannte
    Limitierung, Aufrufer-/Klaus-Retry löst es.
- **§ Manueller Test** neuer **Knopf 9 „init() versions-fail-soft
  probe"** mit Drei-Schritt-Anleitung (init + ensureStore-Bump → Tab-
  Reload → erneuter Storage init muss grün sein).
- **§ Bauzustand** zwei neue Zeilen (Pflege durchgeführt + Sichttest
  ausstehend).

### c) Code in `src/modules/01_storage.js`

- **Vier neue Closure-Helper:**
  - `openProbe(name)` — öffnet ohne Version-Parameter; liefert
    `{db, wasCreated}`. `wasCreated` wird via `onupgradeneeded`-
    Trigger gesetzt (feuert nur wenn IDB die DB GERADE angelegt
    hat).
  - `checkRequiredStores(db)` — sync-Check auf
    `STORES_V1.concat(STORES_V2).concat(STORES_V3).concat(STORES_V4)`
    via `db.objectStoreNames.contains`. Returns Array der fehlenden
    Stores.
  - `openExact(name, version)` — Re-Open mit exakter Version, kein
    `onupgradeneeded`-Handler (sollte nie feuern, wenn `version ===
    existing`).
  - `deleteDb(name)` — Helper für den `wasCreated`-Fall (openProbe
    hat versehentlich angelegt).
- **`init(options)` umgebaut** auf zweiphasigen Pfad. Sync-
  Validierung + Idempotenz-Cache unverändert. Im Promise-Body:
  - Phase 1: `openProbe(dbNameInUse)`.
  - Phase 2 Entscheidung:
    - `wasCreated === true` → openProbe hat versehentlich angelegt
      (Version 1, keine Stores). `deleteDb(name)` und dann regulärer
      Initial-Pfad mit `indexedDB.open(name, DB_VERSION)` +
      `onupgradeneeded`-Loop (`oldVersion=0 → newVersion=4`, alle
      Pflicht-Stores).
    - `wasCreated === false` UND `existingVersion < DB_VERSION` →
      Migrations-Pfad mit `indexedDB.open(name, DB_VERSION)` +
      `onupgradeneeded`-Loop für die fehlenden Migrations (existing
      Bau-01.Y-Verhalten).
    - `wasCreated === false` UND `existingVersion >= DB_VERSION` →
      `checkRequiredStores` + `KNOWN_STORES`-Erweiterung um
      dynamische Stores + `openExact(name, existingVersion)` ohne
      `onupgradeneeded`. Bei fehlendem Pflicht-Store
      `StorageOpenError` mit Liste.
- **`_meta.dbVersionPolicy: "fail-soft-min-schema"`** als neuer
  Read-Anker für Tests, dass der Pflege-Stand aktiv ist.
- **Kopfkommentar** um Pflege-Block am Ende erweitert.
- `node --check src/modules/01_storage.js` grün.

**Wichtiger Bau-Befund:** der erste Versuch ohne `wasCreated`-Flag
hat den Bau-02.Y-Smoke-Test gebrochen — `openProbe` legt nach
IndexedDB-Spec die DB neu mit Version 1 + leeren Stores an, falls
sie nicht existiert. Der nachfolgende Initial-Open mit
`DB_VERSION=4` rief dann nur Migrations `v=2/3/4`; `v=1` wurde
übersprungen (`for v=oldV+1 → newV`-Loop startet bei 2 weil oldV=1).
Pflicht-Stores aus v=1 fehlten. Fix: `wasCreated`-Flag via
`onupgradeneeded`-Trigger, dann `deleteDb` vor Initial-Pfad —
`oldVersion=0` greift wieder voll.

### d) tests/manual_check.html Panel 01 Knopf 9

Knopf **„init() versions-fail-soft probe"** ergänzt:
1. `await SbkimStorage.init()` — Pflicht-Stores sicherstellen.
2. `_meta.dbVersion` und `_meta.dbVersionPolicy` lesen.
3. `await SbkimStorage.ensureStore("sbkim_test_failsoft_dummy")` —
   bumpt `db.version` um 1.
4. Output gibt Hinweis: Tab reloaden, dann Knopf 1 erneut klicken
   → muss grün durchgehen (vor der Pflege wäre `VersionError`).
5. Status-Chip „fail-soft-Probe vorbereitet" bei Erfolg.
6. Alle 10 Inline-`<script>`-Blöcke syntaktisch validiert.

### e) Smoke-Test `tests/smoke_pflege_01_init_fail_soft.mjs`

Drei Proben mit `fake-indexeddb` (Node 22), **8 Sub-Proben gesamt,
8 grün, 0 rot:**

| # | Probe | Erwartet | Ergebnis |
|---|---|---|---|
| 1 | Frische DB — `db.version` | 4 | ✓ 4 |
| 2 | Frische DB — alle Pflicht-Stores | alle 8 vorhanden | ✓ alle 8 |
| 3 | `_meta.dbVersionPolicy` | `"fail-soft-min-schema"` | ✓ |
| 4 | Existing v=10 — KEIN VersionError | init resolves | ✓ |
| 5 | Existing v=10 — db.version übernommen | 10 | ✓ 10 |
| 6 | Existing v=10 — dynamischer Store in knownStores | `sbkim_test_dynamic` vorhanden | ✓ |
| 7 | Existing v=10 mit fehlendem Pflicht-Store → `StorageOpenError` | name: `StorageOpenError` | ✓ |
| 8 | Error-Message benennt fehlenden Store | enthält `sbkim_keys` | ✓ |

**Regression-Bonus:** der Bau-02.Y-Smoke-Test `tests/smoke_bau02y.mjs`
läuft weiterhin 33/33 grün — die Pflege-Änderung an `init()` bricht
keinen bestehenden Pfad.

### f) Übergabeprotokoll

Diese Datei: `docs/sessions/archiv/2026-05-19_pflege-01-init-fail-soft.md`.

---

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** § 1 Modul 01 Bietet-/Storage-/
  Fehlerverhalten-Block UNVERÄNDERT. Nur Garantien-Block erweitert,
  Geprüft-Zeile + § 9.5 Stand-Hinweis + § 10 Änderungsprotokoll-
  Zeile. KEIN Vertrags-Drift.
- **Tafel-Evolutions-konform.** Die Brief-02.Y-Tafel „KEIN Modul-01-
  Eingriff" (Brief 02.Y „Was du nicht tust") war scope-disziplin
  für die Bau-Sitzung 02.Y. CLAUDE.md § Heilige Tafeln § Tafel-
  Evolutions-Klausel (Pflege 2026-05-19, PR #105) hat diese
  „Diese-Sitzung-nicht"-Tafel als nicht-absolut deklariert; diese
  Folge-Pflege ist die explizite Folge-Sitzung mit eigenem Brief
  (PR #106) + eigenem PR (Pflege-PR).
- **`DB_VERSION` bleibt `4`** als Mindest-Schema-Version.
- **`ensureStore`-Verhalten unverändert.** Bau-01.Y-Pfad
  (Versions-Bump via `db.version + 1`, fail-soft
  `onversionchange`, Idempotenz) bleibt komplett intakt — meine
  Pflege berührt nur `init()`.
- **`PROTOCOL_VERSION` bleibt `"0.1"`, `BACKUP_FORMAT_VERSION`
  bleibt `2`.** Reine Storage-Schicht-Pflege.
- **Reihenfolge INTERFACES → Karte → Code** befolgt.

---

## Was NICHT angefasst

- **Modul-Code 02 / 05 / 06 / 07 / 00 / 08.** Reine Modul-01-Pflege.
- **`ensureStore`-Pfad.** Bau-01.Y-Stand unverändert; meine Pflege
  ist orthogonal.
- **DB-Schema-Eingriff.** `STORES_V1/V2/V3/V4` unverändert, kein
  neuer Pflicht-Store.
- **Migrations-Schemata für alte Stores.** Wir migrieren nicht
  rückwärts; existing DBs bleiben wie sie sind, Pflicht-Stores
  werden nur beim Initial-Setup angelegt.
- **`PROTOCOL_VERSION`-Bump, `BACKUP_FORMAT_VERSION`-Bump.**
- **Sage-Page (`index.html`).**
- **CLAUDE.md.** (Die Tafel-Evolutions-Klausel ist schon aus PR #105
  drin.)
- **Karte 09 / `status.json`.**
- **`update_puls_pie.py`-Aufruf** — Modul 01 ist `score:"fertig"`,
  additive Robustheits-Pflege ohne Score-Wechsel.

---

## Manueller Sichttest

**Grün geprüft 2026-05-19 (Klaus, DeX-Chrome auf Galaxy Tab S6,
Termux-`python3 -m http.server 8000`-Setup):** Pflege Modul 01 `init()`
versions-fail-soft live bewiesen.

**Schritt 1 — Knopf 9 „init() versions-fail-soft probe":**
- `db_version_vor: 16` (akkumuliert aus früheren Bau-01.Y- + Bau-02.Y-
  Sichttests; ein Browserdaten-Cleanup beim Sitzungsanfang hatte die
  DB einmal zurückgesetzt, danach hat sich die Version durch
  `ensureStore`-Bumps wieder auf 16 hochgewandert).
- `db_version_nach_bump: 17` — Bau-01.Y-`ensureStore`-Choreografie
  bumpt sauber um 1.
- `dbVersionPolicy: "fail-soft-min-schema"` — Read-Anker bestätigt den
  Pflege-Stand.
- Status-Chip grün „fail-soft-Probe vorbereitet".

**Schritt 2 — Tab-Reload:** ohne Browserdaten-Cleanup.

**Schritt 3 + Bonus — Panel 02 Knöpfe 8/9/10 direkt weiter:** alle drei
grün ohne `VersionError`:
- Knopf 8 „Identitäts-Wechsel OK": main `4W-MgkDhvm0…` ≠ test
  `00fhU4rp…`, `listIdentities: [main, test]`, `active-identity: test`.
- Knopf 9 „Persona-Apoptose OK": `active_before: test → active_after:
  main`, `removed: true`, zweiter Aufruf `removed: false` (Idempotenz).
- Knopf 10 „Multi-ID-Backup OK": wrapper `version: 2`,
  `payload-schema-version: 2`, `identities.length: 2`, Download-Link
  4766 Bytes.

**Indirekter Beleg für die Pflege-Wirkung:** Panel 02 Knöpfe rufen
`SbkimSpore.init()` → `SbkimStorage.init()`. Bei einer DB auf v=17
> `DB_VERSION=4` hätte `init()` vor der Pflege mit `VersionError`
gescheitert. Hier lief alles durch — `init()` hat die existing
v=17 sauber übernommen via Probe + Re-Open ohne Versions-Bump.

**Klaus-freundliches Ergebnis bestätigt:** ein einmaliges Cleanup am
Anfang einer Sitzung reicht; danach Sichttests beliebig oft ohne
Browserdaten zu löschen. Klaus' Befund aus dem Bau-02.Y-Sichttest
2026-05-19 („zweiter Lauf gelang erst nach Panel-01-Storage-init-
Klick") ist damit aufgelöst — `init()` macht das jetzt von selbst.

---

## Nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest des neuen Panel-01-Knopfes 9**
   (nicht headless, wartet auf Klaus). Bestätigt den Pflege-Effekt
   in der echten IndexedDB-Implementierung (insbesondere die
   `onupgradeneeded`-Trigger-Semantik in Chrome — fake-indexeddb
   bildet das korrekt ab, aber Browser-Verhalten kann minimal
   abweichen).
2. **Brief `BAU_04A` schreiben** (Meta-Pflege, ~30–60 min):
   `matchDimensions` synchron aus Brief 03 (M04-Erweiterung).
   Parallel zur Modul-01-Pflege jederzeit machbar; nach Merge dieser
   Pflege als nächste Etappe in der Brief-99-Pipeline.
3. **Bau 05.Y / 06.Y / 07.Y transparenter Slot-Pfad** ist nach dem
   Bau-02.Y-Merge produktiv möglich. Jeder eigener Brief + eigene
   Bau-Sitzung — Reihenfolge nach Klaus' Wahl.

---

## PR

Branch: `claude/pflege-01-init-fail-soft`. Draft-PR „Pflege Modul 01
`init()` versions-fail-soft" — siehe Code-Pfad oben.
