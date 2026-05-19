# Brief — Bau-Sitzung 01.Y · `ensureStore` in Modul 01

**Bau-Sitzung** (kein Spec, kein Modul-Code-Erweiterung jenseits Modul 01).
Erste Bau-Sitzung der Bau-Sitzungs-Brief-Pipeline aus Brief 99
(Sammelspec-Abschluss, PR #100 gemerged 2026-05-19, `main` `80994fd`).
**Logische Reihenfolge:** Klaus' Wahl 2026-05-19 — Infrastruktur zuerst.
Bau 01.Y `ensureStore` ist Voraussetzung für 02.Y Multi-Identitäts-API
(dynamische Slot-Stores pro Persona) und damit für 05.Y / 06.Y / 07.Y
transparenten Slot-Pfad. Erst nach 01.Y + 02.Y + 04.A wird der Sage-
Page-Refactor (Position 1 der Pipeline) realistisch in voller Breite
machbar (Identitäts-Wechsler-UX + Schichten-Lampen).

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Bau 01.Y `ensureStore`
in Modul 01.

Branch: claude/bau-01y-ensure-store   (vom main aus anlegen)

Sitzungs-Rolle: Bau (kein Spec, kein Modul-Vertrag-Eingriff). Du
implementierst die dynamische Store-Erzeugung aus INTERFACES § 9.5
Option A (Empfehlung): Modul 01 bekommt einen additiven Helper
`ensureStore(name) → Promise<void>` plus die Versions-Bump-
Choreografie für IndexedDB v=3 → v=4 (sauber, weil `onversionchange`
auf allen offenen Tabs feuert). KEINE Modul-02-/05-/06-/07-Änderung
in dieser Sitzung — die kommen in 02.Y / 05.Y / 06.Y / 07.Y nach.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Abschluss — V1-
     Sammelspec-Kaskade (Brief 99)" enthält die Bau-Sitzungs-Brief-
     Pipeline mit 01.Y-Position
   - § Vision-Anker 6 „Multi-Identität in der IndexedDB" § Status —
     dokumentiert die Bau-Folge-Sitzung 01.Y als nächsten Schritt
3. docs/INTERFACES.md
   - § 0 Globale Konstanten (DB_VERSION steht in § 1 Modul 01)
   - § 1 Modul 01 (Storage) — Vertrags-Stand (du erweiterst den
     Bietet-Block um `ensureStore`)
   - § 9 Identitäts-Map (Brief 04), insbesondere
     § 9.1 Slot-Schema, § 9.2 identitäts-spezifische Stores,
     § 9.5 Migrations-Strategie (Modul-01-Eingriff) mit Option A /
     Option B Trade-offs — Spec-Quelle für diese Bau-Sitzung
4. docs/components/01_storage.md (Karte 01) — du erweiterst sie
5. src/modules/01_storage.js — du erweiterst den Code

Was du NICHT liest: andere Modul-Karten (02 / 05 / 06 / 07 / 09);
Sage-Page index.html; Brief 01-04 / 99 / SPEC_V1_SAMMELSPEC (Stand
ist in PULS § Sitzungs-Einträge Brief-99-Eintrag bereits gespiegelt).

Heilige Tafeln (Bau-01.Y-spezifisch):

- **INTERFACES verbindlich.** § 1 Modul 01 Bietet-Block ZUERST
  erweitern um `ensureStore(name) → Promise<void>` (siehe Spec-Vorlage
  unten), DANN Karte 01, DANN Code. Andersrum produziert
  Vertrags-Drift.

- **Option A aus § 9.5 ist gewählt** (Brief 04 Spec). Modul 01 hat
  Identitäts-Konzept NICHT zu kennen — `ensureStore` nimmt einen
  beliebigen Store-Namen, prüft Form (gleiches `sbkim_<...>`-
  Pattern wie bisher), legt den Store an, falls noch nicht da.
  Aufrufer (Modul 02) liefert den `_<key>`-Suffix.

- **Versions-Bump-Choreografie verbindlich.** IndexedDB-Versions-
  Bumps feuern `onversionchange` auf allen offenen Tabs. Modul 01
  muss:
  1. Aktuelle DB-Verbindung sauber `close()`-en.
  2. `indexedDB.open(<dbName>, <new-version>)` rufen mit
     `onupgradeneeded`-Handler, der den neuen Store anlegt
     (`db.createObjectStore(name)`, kein keyPath — Modul 01 nutzt
     externe Keys, siehe Bestand).
  3. Andere Tabs bekommen `onversionchange` — bestehender Handler
     (falls vorhanden) muss informieren und fail-soft schließen,
     damit der Bump durchgehen kann.
  4. Idempotenz: `ensureStore(name)` für bereits existierenden Store
     ist no-op — kein Bump, keine Resource-Leakage.
  5. KEINE Schemata-Migration alter Stores — nur additive Anlage
     neuer Stores; bestehende sechs Stores aus STORES_V1/V2/V3
     bleiben unangetastet.

- **DB-Version auf 4 setzen.** STORES_V1/V2/V3 bleiben unverändert
  (initialer Migration-Pfad). Neue Konstante / Konvention für
  „dynamische Stores ab v=4"; eine `STORES_V4_DYNAMIC = []`-Liste
  ist zulässig (leer), oder Code-Konvention "alle Stores oberhalb
  v=3 werden dynamisch via `ensureStore` angelegt". Entscheide in
  der Bau-Sitzung, was sauberer ist; Karte 01 dokumentiert die
  Entscheidung.

- **Selbstcheck-Format** (CLAUDE.md-Konvention `MODUL 01 STORAGE
  bereit, Funktionen: ...`) um `ensureStore` erweitern.

- **`PROTOCOL_VERSION` bleibt `"0.1"`.** `ensureStore` ist lokales
  Storage-Schema, kein Spore-Feld. **`BACKUP_FORMAT_VERSION` bleibt
  `1`** — Bau 02.Y bumpt das auf 2 (für Multi-Identitäts-Backup-
  Strategie „kompletter Rucksack"), nicht 01.Y. **`DB_VERSION`
  von 3 auf 4** (additive Schema-Erweiterung, neue dynamische
  Stores).

Deine Aufgabe heute — fünf Punkte a–e:

a) **docs/INTERFACES.md § 1 Modul 01 Bietet-Block** erweitern um:
   `ensureStore(storeName: string) → Promise<void>`
   - Signatur additiv hinter `clear(storeName)`.
   - Garantien: idempotent (existierender Store → no-op-Promise);
     `InvalidStoreNameError` SYNCHRON bei Verstoß gegen das Pattern
     `^sbkim_[a-z0-9_]+$` (Modul-01-Pattern — Klaus' Endknoten-
     Suffix `dbSuffix` ist davon separat); kein `UnknownStoreError`
     (`ensureStore` *erzeugt* den Store, wirft also nicht für
     unbekannte).
   - Garantien: nach erfolgreichem `ensureStore` ist `getStore(name)`
     / `get` / `put` / `del` / `all` / `clear` für den neuen Store
     gültig.
   - Garantien: KEINE Datenmigration alter Stores; KEINE neuen
     Indices auf bestehenden Stores.
   - Fehlerverhalten-Tabelle um zwei Zeilen erweitert:
     - `InvalidStoreNameError` (synchron, Pattern-Verstoß)
     - `EnsureStoreError` (asynchron, IndexedDB-Versions-Bump-
       Choreografie hat fehlgeschlagen — z.B. anderer Tab hat
       `onversionchange` geblockt; cause-Property trägt die
       IDBOpenDBRequest-Error-Reason)
   - § 1 Modul 01 Storage-Block um Hinweis: STORES_V1/V2/V3 sind
     der initiale Migrations-Pfad (DB_VERSION ≤ 3); ab DB_VERSION
     ≥ 4 sind dynamische Stores via `ensureStore` zulässig (Pattern
     `^sbkim_[a-z0-9_]+$`).
   - § 1 Modul 01 Selbstcheck-Funktionsliste auf die neue Funktion
     erweitern.
   - § 1 Modul 01 Geprüft-Zeile um 2026-05-XX (Bau 01.Y `ensureStore`).
   - § 9.5 Migrations-Strategie KEIN Eingriff (Spec ist gesetzt;
     Bau zieht nur den Code nach) — aber EIN Verweis-Hinweis am
     Ende von § 9.5: „Bau-Folge-Sitzung 01.Y vom 2026-05-XX hat den
     `ensureStore`-Pfad gebaut; siehe § 1 Modul 01 Bietet-Block."

b) **docs/components/01_storage.md (Karte 01)** parallel nachziehen:
   - § Schnittstelle: `ensureStore` als neue Zeile (mit Signatur,
     Garantien, Fehler-Verweis auf § Fehlerverhalten).
   - § Storage-Stores: STORES_V1/V2/V3-Tabelle bleibt; neuer Sub-
     Block „Dynamische Stores ab v=4" mit Pattern, Aufrufer-
     Konvention (Modul 02 ruft pro identitäts-spezifischem Store),
     Idempotenz-Hinweis.
   - § Konfigurationswerte: `DB_VERSION` auf 4 nachgezogen; neuer
     Hinweis auf STORE_NAME_PATTERN (modul-lokal).
   - § Fehlerverhalten: zwei neue Zeilen analog INTERFACES.
   - § Risiken: ein neuer Punkt „Versions-Bump-Choreografie auf
     mehreren Tabs" (anderer Tab hält DB offen → `onversionchange`
     muss fail-soft schließen; sonst hängt der Bump).
   - § Manueller Test: neuer Punkt für Panel 01 Knopf 6
     `ensureStore('sbkim_test_foo')` — Store in DevTools-Application-
     IndexedDB sichtbar; Knopf 7 `ensureStore('sbkim_test_foo')`
     zweimal — idempotent; Knopf 8 `ensureStore('invalid-name')` —
     `InvalidStoreNameError` synchron geworfen.
   - § Bauzustand: neue Zeile „Bau 01.Y `ensureStore` 2026-05-XX".

c) **src/modules/01_storage.js** erweitern (additiv, kein Refactoring
   des bestehenden Migrations-Pfads STORES_V1/V2/V3):

   - **`DB_VERSION = 4`** (von 3).
   - **`STORES_V4 = []`** als leere Liste (oder analoge Konvention) —
     in `onupgradeneeded` bei `oldVersion < 4 → newVersion ≥ 4` ist
     keine sofortige Store-Anlage nötig; die dynamischen Stores
     entstehen erst durch `ensureStore`-Aufrufe der Modul-02-Folge-
     Bau-Sitzung.
   - **Neue Konstante `STORE_NAME_PATTERN = /^sbkim_[a-z0-9_]+$/`**
     modul-lokal.
   - **Neue Fehler-Factories** `InvalidStoreNameError` (sync) und
     `EnsureStoreError` (async; cause-Property aus IDBOpenDBRequest).
   - **Neue öffentliche Funktion `ensureStore(storeName)`:**
     1. Sync-Pattern-Check (`InvalidStoreNameError` bei Verstoß).
     2. Schon-vorhandener-Store-Check (idempotent — bestehende
        Verbindung → `db.objectStoreNames.contains(storeName)`):
        ja → resolve `undefined`.
     3. Sonst Versions-Bump-Choreografie:
        - `db.close()` der aktuellen Verbindung.
        - `newVersion = oldVersion + 1` (oder konstanter Inkrement-
          Schritt; Modul 01 entscheidet — eine pragmatische Wahl:
          `newVersion = db.version + 1`; das hält die Versions-
          Folge linear und entkoppelt von DB_VERSION).
        - `indexedDB.open(dbNameInUse, newVersion)` mit
          `onupgradeneeded`-Handler, der `createObjectStore(storeName)`
          aufruft (ohne keyPath, externe Keys wie alle anderen
          Stores).
        - `onversionchange`-Handler auf der NEUEN Verbindung: fail-
          soft schließen (so wie bestehende Modul-01-Konvention bei
          init-Re-Open).
        - Bei Fehler im IDBOpenDBRequest: `EnsureStoreError` mit
          cause.
        - Bei Erfolg: neue Verbindung als `db` cachen, `_meta.dbVersion`
          aktualisieren, resolve `undefined`.
     4. KEINE Schema-Migration alter Stores — nur additive Anlage.
   - **`window.SbkimStorage.ensureStore`** im Export-Block ergänzen.
   - **`window.SbkimStorage.InvalidStoreNameError`** und
     `window.SbkimStorage.EnsureStoreError` im Error-Export-Block
     ergänzen.
   - **Selbstcheck** (`MODUL 01 STORAGE bereit, Funktionen: init/
     getStore/get/put/del/all/clear/ensureStore`) — siebte Funktion.
   - **`_meta.ensureStorePattern`** als Read-Anker für Tests.
   - **`_meta.dbVersion`** wird auf den aktuellen `db.version`
     aktualisiert (kann nun > 3 sein).

d) **tests/manual_check.html Panel 01** um drei Knöpfe erweitert:
   - Knopf 6 „ensureStore('sbkim_test_foo')" — happy-path. Log:
     `db.version` vor + nach, `objectStoreNames` enthält neuen Store.
   - Knopf 7 „ensureStore('sbkim_test_foo') zweimal" — Idempotenz-
     Test. Log: `db.version` darf zwischen den zwei Aufrufen NICHT
     steigen (zweiter ist no-op).
   - Knopf 8 „ensureStore('invalid-name')" — Pattern-Verstoß. Log:
     `InvalidStoreNameError` synchron + name-Property.
   - Cleanup-Hinweis am Panel-Ende: „Test-Stores `sbkim_test_*`
     bleiben in der DB — Klaus kann sie via DevTools manuell löschen".

e) **Übergabeprotokoll in
   `docs/sessions/archiv/2026-05-XX_bau-01y-ensure-store.md`**
   (Format BRIEFING_TEMPLATE.md § C Bau-Sitzung). Inhalt: alle fünf
   Punkte a–e plus Heilige-Tafeln-Eingehalten-Block plus „Was NICHT
   angefasst"-Block plus „Nächster sinnvoller Schritt"-Block mit
   Verweis auf Bau 02.Y als logische Folge.

Was du NICHT tust:

- **Keine Modul-02-Änderung** (Multi-Identitäts-API kommt in 02.Y).
  Modul 02's `getOrCreateIdentity(key)` ruft später `ensureStore`
  für jeden identitäts-spezifischen Store, aber das ist 02.Y, nicht
  01.Y.
- **Keine Modul-05/06/07-Änderung** (transparenter Slot-Pfad kommt
  in 05.Y / 06.Y / 07.Y).
- **Keine identitäts-spezifischen Stores anlegen.** `ensureStore`
  ist generisch — Modul 01 kennt Identität nicht. Aufrufer liefert
  den Namen.
- **Kein `PROTOCOL_VERSION`-Bump** (lokales Storage-Schema).
- **Kein `BACKUP_FORMAT_VERSION`-Bump** (02.Y bumpt das auf 2).
- **Keine Sage-Page-Änderung** (Sage-Page-Refactor ist eigene Bau-
  Sitzung in der Pipeline).
- **Keine CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 01 ist bereits
  `score:"fertig"` (Live-Andock-Beweis 2026-05-16); `ensureStore`
  ist additive Erweiterung, kein Score-Wechsel.

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am Sitzungsende:
   - INTERFACES.md § 1 Modul 01 nachgezogen (Bietet + Storage +
     Selbstcheck + Fehlerverhalten + Geprüft-Zeile + § 9.5 Verweis-
     Hinweis).
   - Karte 01 nachgezogen (sechs Sub-Sektionen siehe Punkt b).
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag „Bau 01.Y
     `ensureStore` in Modul 01" mit Punkten a–e, Heilige-Tafeln-
     Block, Was-NICHT-angefasst-Block, Sichttest-Vermerk.
   - Vorletzten Sitzungs-Eintrag (Brief 99 Abschluss) ins Archiv-
     Index auslagern (Konvention pro Sitzung).
   - PULS § Vision-Anker 6 § Status um „Bau 01.Y `ensureStore`
     2026-05-XX abgeschlossen" erweitern; Anker 1 / 9 unangetastet
     (01.Y berührt nur Anker 6).
   - Manueller Sichttest **erwartet** (CLAUDE.md § Pflicht 3): drei
     neue Panel-01-Knöpfe in `tests/manual_check.html`. Klaus prüft
     im Browser, dass (i) Store sichtbar in DevTools, (ii) Idempotenz
     greift, (iii) Pattern-Verstoß synchron geworfen wird. Sichttest-
     Vermerk in Karte 01 § Manueller Test und in PULS-Eintrag.
     **Headless-Bau ist OK** — Vermerk „ungeprüft, weil headless,
     wartet auf Klaus' Browser-Lauf" ist zulässig.
   - Übergabeprotokoll
     `docs/sessions/archiv/2026-05-XX_bau-01y-ensure-store.md`.
   - Commit + Push auf `claude/bau-01y-ensure-store`.
   - Draft-PR „Bau 01.Y `ensureStore` in Modul 01".

2. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): zwei bis vier priorisierte
   Folge-Bau-Trigger als Markdown-Liste. Empfehlung:
   - **Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump** als
     direkte Folge (~5-8 h; nutzt `ensureStore` für identitäts-
     spezifische Stores pro Persona, bumpt `BACKUP_FORMAT_VERSION`
     1→2).
   - **Klaus' Browser-Sichttest der drei neuen Panel-01-Knöpfe**
     (nicht headless, wartet auf Klaus).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Sitzungs-Eintrag
  „Bau 01.Y abgebrochen" ans Ende. Klaus klärt in der nächsten
  Sitzung.
- Wahrscheinliche Stolperfallen:
  - `onversionchange`-Handler in anderen Tabs verweigert Schließen
    → Bump hängt. Spec sagt: fail-soft schließen. Wenn das nicht
    klappt, ist das ein Architektur-Befund — als offene Frage
    dokumentieren, nicht durchforcen.
  - Modul 01's bestehender `init()`-Re-Open-Pfad (Pflege Storage-
    Persist 2026-05-16) interagiert mit dem `ensureStore`-Re-Open-
    Pfad. Wenn da Drift entsteht, lieber Modul-01-Pflege-Sitzung
    vorschalten statt 01.Y verbiegen.

Zeitschätzung: 2–3 Stunden für Bau + Karten-Nachzug + Test-Panel +
Übergabeprotokoll. Wenn `onversionchange`-Choreografie länger
dauert, kann es 4 h werden — Brief 99's ~2-3 h ist Untergrenze.
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Brief 99-PR #100 ist gemerged** (2026-05-19, `main` `80994fd`).
  Die V1-Sammelspec-Kaskade ist vollständig auf `main` geschlossen.
  Bau-Sitzungs-Brief-Pipeline läuft jetzt an.

- **PR #89 (Karte 15 Membran als Stub) ist gemerged** (2026-05-19,
  `main` `cc9f8cf`). Modul 15 ist als Backlog-Stub eingetragen,
  berührt die Bau-Sitzungs-Brief-Pipeline nicht.

- **Logische Bau-Reihenfolge (Klaus' Wahl 2026-05-19):**
  1. **Bau 01.Y `ensureStore` in Modul 01** — Infrastruktur-
     Voraussetzung. **DIESER BRIEF.**
  2. Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump in Modul 02
     — braucht 01.Y.
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

- **`PROTOCOL_VERSION` bleibt `"0.1"`** für 01.Y — bestätigt vom
  Brief-99-Snapshot. **`BACKUP_FORMAT_VERSION` bleibt `1`** in
  01.Y; 02.Y bumpt auf 2. **`DB_VERSION` von 3 auf 4** in 01.Y.

- **Manueller Sichttest:** drei neue Panel-01-Knöpfe in
  `tests/manual_check.html`. Klaus' Browser-Lauf prüft die Drei-
  Stufen-Probe (happy-path, Idempotenz, Pattern-Verstoß) — ungeprüft
  beim headless Bau ist zulässig.
