# Brief — Pflege Modul 01 `init()` versions-fail-soft

**Pflege-Sitzung** (kein Spec, kein neuer Modul-Vertrag, additive
Garantien-Erweiterung an Modul 01). Direkte Folge auf den Bau-02.Y-
Sichttest 2026-05-19 (PR #104 gemerged, `main` `63e8fd1`) und die
Meta-Pflege Tafel-Evolutions-Klausel (PR #105 gemerged, `main`
`60ea3f6`). Diese Pflege löst den Cleanup-Workaround auf, den Klaus
bisher bei jedem Sichttest fahren musste.

Dieser Brief geht in den **ersten Prompt** der nächsten Pflege-Sitzung
als Codeblock.

---

```
Du bist eine Pflege-Sitzung in Sage-Protokol — Pflege Modul 01
`init()` versions-fail-soft.

Branch: claude/pflege-01-init-fail-soft   (vom main aus anlegen)

Sitzungs-Rolle: Pflege (kein Spec, kein neuer Modul-Vertrag, additive
Garantien-Erweiterung an Modul 01). Du machst `init()` robust gegen
existing DB-Versionen > `DB_VERSION` — der Klaus-unfreundliche
Workaround „Browserdaten löschen vor jedem Sichttest" entfällt damit.
KEINE Modul-02/05/06/07-Änderung, KEIN `ensureStore`-Verhalten-Bruch,
KEIN DB_VERSION-Bump.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
   - § Heilige Tafeln § Tafel-Evolutions-Klausel (Pflege 2026-05-19) —
     der Auslöser dieser Pflege; die alte Tafel „KEIN Modul-01-
     Eingriff" aus Brief 02.Y war scope-disziplin, diese Folge-Pflege
     ist die explizite Anpassung
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Meta-Pflege Tafel-
     Evolutions-Klausel + Modul-01-init-Folge-Pipeline" + zweiter
     Eintrag „Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump"
     mit Klaus' Sichttest-Befund
   - § Vision-Anker 6 § Status — Folge-Pflege-Block am Ende
3. docs/INTERFACES.md
   - § 1 Modul 01 Bietet-Block (acht Funktionen) + Garantien-Block
     + Storage-Block (DB_VERSION=4, STORES_V1/V2/V3/V4)
   - § 9.5 Migrations-Strategie inkl. Folge-Befund 2026-05-19 — der
     Befund ist hier bereits dokumentiert
4. docs/components/01_storage.md — du erweiterst sie
5. src/modules/01_storage.js — du erweiterst den `init()`-Pfad

Was du NICHT liest: Karten 00 / 02-15; Modul-Code 02-08; Sage-Page
index.html; Briefe der V1-Sammelspec-Kaskade (sind historisch);
BRIEF_BAU_02Y (gemerged, der Befund ist in INTERFACES § 9.5
gespiegelt).

Heilige Tafeln (Pflege-spezifisch):

- **INTERFACES verbindlich.** Reihenfolge INTERFACES → Karte → Code.
  § 1 Modul 01 Bietet-Block + Storage-Block + Fehler-Block bleiben
  UNVERÄNDERT. Du ziehst NUR den Garantien-Block (neue Zusicherung)
  + Geprüft-Zeile + § 9.5 Stand-Hinweis + § 10 Änderungsprotokoll
  nach. KEIN Vertrags-Drift.

- **Tafel-Evolutions-Klausel respektieren.** Wenn du im Lauf der
  Sitzung auf eine weitere Tafel stößt, die mit dieser Arbeit in
  Konflikt steht: NICHT stillschweigend umgehen, NICHT stoisch
  blockieren, sondern Klaus EXPLIZIT auf Anpassungs-Bedarf hinweisen
  (CLAUDE.md § Heilige Tafeln § Tafel-Evolutions-Klausel).

- **`init()` semantisch:** Modul 01 öffnet die DB jetzt fail-soft.
  Wenn existing DB-Version >= `DB_VERSION`: existing übernehmen, KEIN
  Versions-Bump, KEIN `onupgradeneeded`. Wenn existing < `DB_VERSION`
  (inkl. „DB existiert nicht"): regulärer Pfad mit `DB_VERSION` als
  Ziel, `onupgradeneeded` triggert für Pflicht-Stores. Das ist
  Klaus-freundlich: Test-Stores aus früheren `ensureStore`-Aufrufen
  (z.B. `sbkim_test_foo` aus Bau-01.Y-Sichttest, plus die fünf
  identitäts-spezifischen Stores aus Bau-02.Y-Sichttest) blockieren
  den nächsten init nicht mehr.

- **Pflicht-Stores aus `STORES_V1/V2/V3/V4` MÜSSEN existieren.** Wenn
  existing >= `DB_VERSION` aber ein Pflicht-Store FEHLT (sehr
  unwahrscheinlich — das wäre eine manuell zerstörte DB), wirft
  `init()` `StorageOpenError` mit klarem Hinweis. Wir reparieren
  KEINE manuell zerstörten DBs (Klaus' Verantwortung).

- **`ensureStore`-Verhalten bleibt unverändert.** Bau 01.Y hat das
  fertig spezifiziert (Versions-Bump via `db.version + 1`, fail-soft
  `onversionchange`, Idempotenz). Diese Pflege berührt `ensureStore`
  NICHT.

- **`DB_VERSION` bleibt `4`** als Build-Konstante. Bedeutung-Wandel:
  bisher „immer-anstreben-Version", jetzt „Mindest-Schema-Version für
  Pflicht-Stores". Bei existing > 4 (durch frühere ensureStore-Bumps)
  bleibt die existing Version aktiv; `db.version` und
  `_meta.dbVersion`-Getter spiegeln das.

- **`PROTOCOL_VERSION` bleibt `"0.1"`, `BACKUP_FORMAT_VERSION` bleibt
  `2`.** Reine Storage-Schicht-Pflege.

- **Karte 01 § Schnittstelle Bietet-Block UNVERÄNDERT.** Die
  Funktions-Signatur von `init(options)` bleibt gleich, nur das
  interne Verhalten + die Garantie werden präziser.

Deine Aufgabe heute — sechs Punkte a–f:

a) **docs/INTERFACES.md** drei kleine Eingriffe (KEIN Vertrags-Drift):
   - § 1 Modul 01 Garantien-Block um eine neue Zeile erweitert:
     „`init()` versions-fail-soft: existing DB-Versionen > `DB_VERSION`
     werden respektiert (kein VersionError). Pflicht-Stores aus
     `STORES_V1/V2/V3/V4` müssen vorhanden sein; Fehlen → `StorageOpenError`."
   - § 1 Modul 01 Geprüft-Zeile um „2026-05-XX (Pflege `init()`
     versions-fail-soft)" erweitert.
   - § 9.5 Folge-Befund-Absatz um Stand-Hinweis am Ende ergänzt:
     „Stand 2026-05-XX: Pflege Modul 01 `init()` versions-fail-soft
     vom 2026-05-XX hat den Pfad eingebaut; siehe § 1 Modul 01
     Garantien-Block."
   - § 10 Änderungsprotokoll um eine neue Zeile „2026-05-XX · Pflege
     Modul 01 `init()` versions-fail-soft" erweitert.

b) **docs/components/01_storage.md (Karte 01)** nachziehen:
   - § Versionsmigration: neuer Sub-Block „Versions-Fail-Soft-Pfad
     (Pflege 2026-05-XX)" mit Entscheidungs-Logik (existing 0 ≤ x <
     `DB_VERSION` → bump; existing x ≥ `DB_VERSION` → übernehmen),
     Pflicht-Store-Check als Sicherheits-Anker.
   - § Schnittstelle: `init(options)`-Doku-Block um Garantie
     „versions-fail-soft" ergänzt (Funktions-Signatur unverändert).
   - § Risiken: neuer Punkt „Manuell zerstörte DB" (Pflicht-Store
     fehlt → `StorageOpenError`, nicht selbst-heilbar) — Klaus'
     Verantwortung.
   - § Manueller Test: neuer Knopf 9 (siehe Punkt d).
   - § Bauzustand: neue Zeile „Pflege `init()` versions-fail-soft
     2026-05-XX".

c) **src/modules/01_storage.js** den `init()`-Pfad umbauen
   (additiv, kein Refactoring der bestehenden 8 Funktionen):

   - **Pfad-Skizze (Empfehlung):**
     ```
     async function init(options) {
       // dbSuffix sync check unverändert
       // dbPromise-Cache unverändert
       
       // Phase 1: erst probe ohne Version (liefert existing Version)
       var probedDb = await openProbe(dbNameInUse);
       // probedDb ist null wenn DB nicht existiert (oder bei Error)
       
       if (probedDb && probedDb.version >= DB_VERSION) {
         // Existing übernehmen — kein Bump nötig
         var existingVersion = probedDb.version;
         probedDb.close();
         
         // Pflicht-Stores prüfen (sync-Check auf objectStoreNames)
         var missing = checkRequiredStores(probedDb);  
         // Hinweis: probedDb.objectStoreNames muss VOR close() gelesen werden
         if (missing.length > 0) {
           throw StorageOpenError("Pflicht-Stores fehlen: " + ...);
         }
         
         // Re-open mit existing Version (db.close() hat die alte
         // Verbindung gelöst; wir brauchen eine frische für unsere
         // module-Lebenszeit). KEIN onupgradeneeded.
         currentDb = await openExact(dbNameInUse, existingVersion);
         attachVersionChangeHandler(currentDb);
         requestStoragePersist();  // fail-soft wie bisher
         dbPromise = Promise.resolve(currentDb);
         return currentDb;
       }
       
       // Phase 2: existing < DB_VERSION (oder DB existiert nicht) →
       // regulärer Pfad mit DB_VERSION + onupgradeneeded
       // (= der bestehende Pfad aus Bau 01.Y)
     }
     ```

   - **Alternative-Pfad (kompakter, aber tricky):** den existing
     `indexedDB.open(name, DB_VERSION)` versuchen; bei
     `VersionError` im `onerror`-Handler fallback auf
     `indexedDB.open(name)` ohne Version. Spart einen Probe-Open im
     happy-path. Beide Varianten sind valide; **wähle die
     Probe-Variante** für Lesbarkeit + bessere Fehler-Trace —
     `VersionError`-catch-und-retry ist schwer zu lesen für
     spätere Sitzungen.

   - **Neuer Helper `openProbe(name)`:** intern, returns
     `Promise<IDBDatabase | null>`. Öffnet `indexedDB.open(name)`
     ohne Version. Bei success: returns db. Bei `onerror` mit
     Error-Name `NotFoundError` (oder leerer DB): returns null.
     Sonst: throw normaler `StorageOpenError`.

   - **Neuer Helper `checkRequiredStores(db)`:** intern, synchron.
     Iteriert über `STORES_V1.concat(STORES_V2).concat(STORES_V3).concat(STORES_V4)`,
     prüft `db.objectStoreNames.contains(name)`. Returns Array der
     fehlenden Store-Namen. Aufrufer wirft `StorageOpenError` mit
     der Liste, wenn nicht leer.

   - **Neuer Helper `openExact(name, version)`:** intern. Öffnet
     `indexedDB.open(name, version)` und resolved bei `onsuccess`.
     KEIN `onupgradeneeded`-Handler (Pfad nimmt das nie, weil
     Version === existing). `onerror` → `StorageOpenError`.

   - **`_meta.dbVersion`-Getter** schon Bau-01.Y-konform (liefert
     `currentDb.version`); KEIN Eingriff.

   - **`_meta.dbVersionInitial`** als Build-Konstante (= `DB_VERSION`
     = 4) bleibt unverändert.

   - **`_meta.dbVersionPolicy`** als neuer Read-Anker: String-
     Konstante `"fail-soft-min-schema"` als Anker für Tests, dass
     der Pflege-Stand aktiv ist (alter Stand wäre `"strict"`).
     OPTIONAL — wenn der Read-Anker als overkill empfunden wird,
     weglassen.

   - **Selbstcheck-Zeile** bleibt unverändert (acht Funktionen).

   - **Kopfkommentar** um Pflege-Block am Ende erweitern:
     „Pflege `init()` versions-fail-soft (2026-05-XX): `init()`
     respektiert jetzt existing DB-Versionen > `DB_VERSION` (kein
     Bump, kein VersionError). Auslöser: Klaus' Bau-02.Y-Sichttest
     2026-05-19. Tafel-Evolutions-konform: Brief-02.Y-Tafel ‚KEIN
     Modul-01-Eingriff' war scope-disziplin; diese Pflege ist die
     explizite Folge-Sitzung mit eigenem Brief + PR."

   - `node --check src/modules/01_storage.js` muss grün sein.

d) **tests/manual_check.html Panel 01** um EINEN Knopf erweitern:
   - **Knopf 9 „init() versions-fail-soft probe"** — Sequenz:
     1. `SbkimStorage.init()` (frischer Start, sicherstellen Pflicht-
        Stores da)
     2. `SbkimStorage.ensureStore('sbkim_test_failsoft_dummy')` —
        bumpt die DB-Version um 1 (auf `existing.version + 1`)
     3. `_meta.dbVersion` lesen — sollte > `DB_VERSION` sein
     4. Modul-Pseudo-Reset: `_meta.dbVersion`-Snapshot speichern,
        dann `SbkimStorage._closeForTest()`-Helper rufen (NEU,
        wenn nötig) ODER tatsächlich Modul-Re-Load über
        `delete window.SbkimStorage` + Skript-Tag neu — ZU
        TRICKY, deshalb:
     5. **Einfachere Variante:** vermerken im Log, dass die
        Persistenz des Befundes erst nach Tab-Reload sichtbar wird
        (Klaus klickt nach Knopf 9 manuell „Reload" → klickt
        wieder Knopf 1 „Storage init" → sollte ohne VersionError
        durchgehen).
     6. Output-Zusammenfassung:
        `{db_version_nach_ensureStore: X, erwartung: "X > DB_VERSION (=4)", hinweis: "Tab reloaden + Storage init nochmal — muss grün sein"}`
   - Cleanup-Hinweis: der Test-Store `sbkim_test_failsoft_dummy`
     bleibt in der DB; manueller Cleanup über DevTools oder
     site-spezifisches Daten-Löschen.

e) **Smoke-Test mit `fake-indexeddb`** (headless, Node 22) — neue
   Datei `tests/smoke_pflege_01_init_fail_soft.mjs`. Drei Proben:
   - Probe 1: frische DB → `init()` resolves mit `db.version === 4`,
     alle Pflicht-Stores aus `STORES_V1/V2/V3/V4` vorhanden.
   - Probe 2: existing v=10-DB (synth — anlegen via roher
     `indexedDB.open(name, 10)` + Pflicht-Stores als
     `onupgradeneeded`-Loop manuell anlegen) → `init()` resolves mit
     `db.version === 10`, KEIN VersionError, KEIN Bump.
   - Probe 3: existing v=10-DB mit FEHLENDEM Pflicht-Store
     (`sbkim_keys` weglassen) → `init()` rejects mit
     `StorageOpenError`, Message benennt fehlenden Store.

f) **Übergabeprotokoll** in
   `docs/sessions/archiv/2026-05-XX_pflege-01-init-fail-soft.md`.
   Inhalt: alle sechs Punkte a–f plus Heilige-Tafeln-Eingehalten-Block
   plus „Was NICHT angefasst"-Block plus „Nächster sinnvoller Schritt"-
   Block (Brief BAU_04A schreiben + parallel Bau 05.Y / 06.Y / 07.Y
   trigger-bereit).

Was du NICHT tust:

- **Keine Modul-02/05/06/07-Änderung.** Reine Modul-01-Pflege.
- **Kein `ensureStore`-Verhalten-Bruch.** Bau 01.Y bleibt
  unverändert; die neue `init()`-Logik ist orthogonal.
- **Kein `DB_VERSION`-Bump.** Konstante bleibt `4`.
- **Kein Pflicht-Store-Hinzufügen.** `STORES_V1/V2/V3/V4` bleiben
  wie sie sind.
- **Keine Migrations-Schemata für alte Stores.** Wir migrieren nicht
  rückwärts; existing DBs bleiben wie sie sind, Pflicht-Stores
  werden nur beim Initial-Setup (existing < `DB_VERSION`) erzeugt.
- **Kein `PROTOCOL_VERSION`-Bump, kein `BACKUP_FORMAT_VERSION`-Bump.**
- **Keine Sage-Page-Änderung.**
- **Keine CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 01 ist bereits
  `score:"fertig"`; Pflege ist additive Robustheit, kein Score-
  Wechsel.

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am Sitzungsende:
   - INTERFACES.md drei kleine Eingriffe (§ 1 Modul 01 Garantien-Block
     + Geprüft-Zeile, § 9.5 Stand-Hinweis, § 10 Änderungsprotokoll).
   - Karte 01 vier Sub-Sektionen nachgezogen (§ Versionsmigration neuer
     Sub-Block, § Schnittstelle init()-Doku, § Risiken neuer Punkt,
     § Manueller Test + § Bauzustand).
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag „Pflege Modul 01
     `init()` versions-fail-soft" mit Punkten a–f, Heilige-Tafeln-
     Block, Was-NICHT-angefasst-Block, Sichttest-Vermerk.
   - Vorletzten Sitzungs-Eintrag ins Archiv-Index auslagern
     (Konvention pro Sitzung).
   - PULS § Vision-Anker 6 § Status um „Pflege Modul 01 `init()`
     versions-fail-soft 2026-05-XX abgeschlossen" erweitern (Folge-
     Pflege-Block durchstreichen oder als erledigt markieren).
   - Manueller Sichttest **erwartet** (CLAUDE.md § Pflicht 3):
     neuer Panel-01-Knopf 9 in `tests/manual_check.html`. Klaus prüft
     im Browser, dass (i) `ensureStore`-Bump die DB hochbumpt, (ii)
     nach Tab-Reload `init()` ohne `VersionError` durchgeht. Headless-
     Bau ist OK — Vermerk „ungeprüft, weil headless, wartet auf
     Klaus' Browser-Lauf" ist zulässig.
   - Übergabeprotokoll
     `docs/sessions/archiv/2026-05-XX_pflege-01-init-fail-soft.md`.
   - Commit + Push auf `claude/pflege-01-init-fail-soft`.
   - Draft-PR „Pflege Modul 01 `init()` versions-fail-soft".

2. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): zwei bis drei priorisierte
   Folge-Trigger als Markdown-Liste. Empfehlung:
   - **Klaus' Browser-Sichttest des neuen Panel-01-Knopfes 9**
     (nicht headless, wartet auf Klaus).
   - **Brief `BAU_04A` schreiben** (Meta-Pflege, ~30–45 min,
     `matchDimensions` synchron aus Brief 03) — parallel zur
     Modul-01-Pflege möglich; nach Merge dieser Pflege als nächste
     Etappe in der Brief-99-Pipeline.
   - **Bau 05.Y / 06.Y / 07.Y transparenter Slot-Pfad** ist nach
     dem Bau-02.Y-Merge produktiv möglich, aber jeder eigene Brief
     + eigene Bau-Sitzung — Reihenfolge nach Klaus' Wahl.

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Sitzungs-Eintrag
  „Pflege 01-init-fail-soft abgebrochen" ans Ende. Klaus klärt in der
  nächsten Sitzung.
- Wahrscheinliche Stolperfallen:
  - **`onversionchange`-Choreografie auf der Probe-Verbindung:** die
    probe-Verbindung (Phase 1) bekommt einen `onversionchange`-
    Handler vom Bau-01.Y-Pfad NICHT — sie ist transient und wird
    sofort wieder geschlossen. Wenn ein anderer Tab inzwischen einen
    ensureStore-Bump versucht, könnte die Probe-Verbindung ihn
    blockieren. → Sicherheit: die Probe-Verbindung sofort nach dem
    Versionslesen schließen, KEIN Handler-Anhängen.
  - **Race-Condition zwischen Probe und Re-Open:** in Phase 1
    schließt die Probe; in Phase 2 öffnen wir mit `existingVersion`.
    Wenn ein anderer Tab zwischen den beiden Operationen einen
    ensureStore-Bump auf `existingVersion + 1` macht, würde unser
    `openExact(name, existingVersion)` mit VersionError scheitern.
    → Selten in der Praxis (Single-Tab-Standard); als bekannte
    Limitierung in Karte 01 § Risiken notieren, nicht durchforcen.
  - **fake-indexeddb `objectStoreNames`-Liste:** in Probe 2 / 3 des
    Smoke-Tests müssen wir synthetisch eine v=10-DB anlegen. Das
    geht über `indexedDB.open(name, 10)` mit `onupgradeneeded` →
    `createObjectStore` pro Pflicht-Store. fake-indexeddb sollte das
    unterstützen, aber falls nicht: alternative Probe via
    direkter `indexedDB.deleteDatabase`-Pfad + Neu-Anlage.

Zeitschätzung: 2–3 Stunden für Pflege + Karten-Nachzug + Test-Knopf +
Übergabeprotokoll + Smoke-Test. Wenn der Probe-Pfad in fake-indexeddb
unerwartet tricky wird, kann es 3-4 h werden.
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Auslöser dieser Pflege:** Klaus' Bau-02.Y-Sichttest 2026-05-19
  (DeX-Chrome auf Galaxy Tab S6) hat den Befund freigelegt — `init()`
  scheitert mit `VersionError`, wenn die DB durch frühere
  `ensureStore`-Bumps eine höhere Version hat als `DB_VERSION = 4`.
  Klaus' Cleanup-Workaround „Browserdaten löschen + Panel 01
  ‚Storage init' klicken" funktioniert, ist aber Klaus-unfreundlich.

- **Tafel-Evolution:** die Brief-02.Y-Tafel „KEIN Modul-01-Eingriff"
  war scope-disziplin für die Bau-Sitzung 02.Y. CLAUDE.md § Heilige
  Tafeln § Tafel-Evolutions-Klausel (Pflege 2026-05-19, PR #105
  gemerged) hat das verankert: solche Tafeln erlauben **explizit**
  eine eigene Folge-Pflege-Sitzung mit eigenem Brief und eigenem PR.

- **PR-Pipeline-Stand:** Brief 99 → Bau 01.Y ✓ → Bau 02.Y ✓ → Pflege
  Tafel-Evolution ✓ → **Pflege Modul 01 init versions-fail-soft (dieser
  Brief)** → Brief BAU_04A → Bau 04.A → Bau 04.B → Bau 05.Y / 06.Y /
  07.Y → Endknoten-Migration.

- **Parallel-Möglichkeit:** Brief `BAU_04A` (Brief 03 M04-Erweiterung)
  ist unabhängig von dieser Pflege und kann parallel geschrieben
  werden. Klaus entscheidet die Reihenfolge.

- **`PROTOCOL_VERSION` bleibt `"0.1"`**, **`DB_VERSION` bleibt `4`**
  (als Mindest-Schema-Version), **`BACKUP_FORMAT_VERSION` bleibt `2`**.
  Reine Storage-Schicht-Pflege.

- **Manueller Sichttest:** ein neuer Panel-01-Knopf 9 deckt den
  Hauptpfad ab. Klaus' Drei-Probe-Test im Browser:
  (i) ensureStore-Bump auf v > 4 sichtbar; (ii) Tab-Reload; (iii)
  Storage init ohne `VersionError`. Headless-Bau ist OK — Sichttest
  wartet auf Klaus.

- **Auslöser-Befehl im Chat (Kaskaden-Konvention 6):** der Volltext
  des Briefes oben ist im Repo (diese Datei). Klaus tippt am
  Sitzungs-Start nur den kurzen Auslöser-Befehl mit Verweis auf die
  Brief-Datei.
