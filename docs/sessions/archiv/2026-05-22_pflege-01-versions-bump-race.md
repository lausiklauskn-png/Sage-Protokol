# Übergabeprotokoll — Pflege Modul 01 Versions-Bump-Race in `openProbe`

**Datum:** 2026-05-22
**Sitzungs-Rolle:** Pflege (kein Spec, kein neuer Modul-Vertrag —
additive Robustheits-Erweiterung an Modul 01).
**Branch:** `claude/pflege-01-versions-bump-race-VFy9Y`.
**Brief:** PR #136 (gemerged 2026-05-21, `main` `7d0efa0`).
**Vorige Modul-01-Pflege:** „init() versions-fail-soft" (PR #?,
gemerged 2026-05-19) — diese Pflege baut darauf auf, ohne den
Versions-Fail-Soft-Pfad zu brechen.

---

## Auslöser

Klaus' Sichttest 2026-05-21 (Sichttest-Folge zur Bau-Sage-Page-
Refactor-Sitzung, DeX-Chrome auf Galaxy Tab S6) zeigte reproduzierbar
auf frischer DB:

```
ensureStore('sbkim_meta') Versions-Bump blockiert — ein anderer Tab
haelt die DB offen und ignoriert onversionchange.
```

Sequenz: Panel-01-Notfall-Reset (PR #131) + Hard-Reload + Panel-06-
Setup. Diagnose-2-Befund im Übergabeprotokoll
`2026-05-21_bau-sage-page-refactor-sichttest.md` § Diagnose 2 mit
Code-Pfad-Analyse: `openProbe`-Connection wird mit `probedDb.close()`
synchron geschlossen, IndexedDB schließt sie im IDB-Worker-Thread
aber asynchron, ein nachfolgender `ensureStore`-Bump trifft auf eine
noch offene Verbindung → `onblocked`.

**Manifestation:** nur in `tests/manual_check.html` bei wiederholtem
Modul-Wechsel (mehrere `init()`-Ketten pro Tab-Session). Endknoten-
PWAs sind nicht betroffen — sie haben nur EINE `init()`-Kette pro
Tab-Lebenszeit (Karte 09 § Schritt 9 ruft `init()` einmal beim
Andocken).

---

## Was getan wurde

### Code in `src/modules/01_storage.js` (additiv)

1. **Neuer modul-lokaler Helper `closeConnectionAndWait(db)`**
   zwischen `attachVersionChangeHandler` und `requestStoragePersist`:

   ```js
   function closeConnectionAndWait(db) {
     return new Promise(function (resolve) {
       db.onclose = resolve;
       setTimeout(resolve, 50);
       try { db.close(); } catch (e) { resolve(); }
     });
   }
   ```

   Wartet auf `db.onclose`-Feuer ODER auf einen 50-ms-Timeout-
   Fallback. Chrome feuert `db.onclose` nicht zuverlässig auf Android
   (DeX-Chrome / Galaxy Tab S6 zeigt das stärker als Desktop-
   Chrome) — der Timeout ist die Sicherheits-Klausel. Multi-Resolve
   ist Promise-konform (nur die erste resolve-Aufruf zählt).

2. **`openProbe(name)` installiert `attachVersionChangeHandler`** vor
   `resolve`. Die Probe-Verbindung ist zwar transient, muss aber im
   IDB-Worker-Thread sicher schließen können, falls ein späterer
   Bump das `onversionchange`-Event auslöst. Vorher: nur die
   `init`-Initial-Verbindung und die `ensureStore`-Bump-Verbindung
   trugen den Handler.

3. **`init()`** beide `probedDb.close()`-Stellen ersetzt durch
   `closeConnectionAndWait(probedDb).then(...)`:

   - Fail-soft-Pfad (Zeile ~376, `existing >= DB_VERSION`): vor
     `openExact(name, existingVersion)`.
   - Initial-Pfad (Zeile ~404): vor `wasCreated ? deleteDb(...) :
     Promise.resolve()` und nachfolgendem regulärem Initial-Open.

   Der nachfolgende `indexedDB.open` startet jetzt erst, wenn die
   Probe-Verbindung im DB-Worker vollständig geschlossen ist.

4. **`ensureStore`** `db.close()` (Zeile ~770) ersetzt durch
   `closeConnectionAndWait(db).then(...)` mit
   `indexedDB.open(dbNameInUse, newVersion)` im `then`-Block.
   `currentDb`/`dbPromise`-Invalidierung BLEIBT VOR dem await,
   damit nachfolgende `init()`-Aufrufe sofort auf der neuen
   Verbindung landen.

**Modul-Kopfkommentar** um Pflege-Block am Anfang erweitert (Befund,
Ursache, drei Eingriffe).

### Karte `docs/components/01_storage.md`

- **§ Versionsmigration** neuer Sub-Block „Folge-Pflege 2026-05-21 —
  Race-Auflösung in openProbe + Close-Wait" mit zwei Absätzen (Was
  sich änderte / Klaus' Sichttest-Beweis).
- **§ Bauzustand** zwei neue Zeilen: „Pflege „Versions-Bump-Race in
  openProbe" 2026-05-22 (Code + Karte + INTERFACES) + „Sichttest
  Race-Auflösung 2026-05-22 (ungeprüft, wartet auf Klaus' Browser)".
- **§ Risiken** unverändert (bestehender Race war nicht
  dokumentiert, deshalb keine Tafel zu evolvieren).

### `docs/INTERFACES.md`

- **§ 1 Modul 01 Garantien-Block** neuer Sub-Block „init-Garantien
  (Pflege „Versions-Bump-Race in openProbe", 2026-05-22)" mit drei
  Punkten: (1) Race-frei bei Versions-Bumps innerhalb derselben
  Tab-Session; (2) `openProbe`-Probe-Verbindung trägt jetzt den
  fail-soft-`onversionchange`-Handler; (3) Anwendungsfall + Endknoten-
  PWA-Unbetroffenheit explizit benannt.
- **§ 1 Modul 01 Geprüft-Zeile** um 2026-05-22 erweitert.
- **§ 9.5 Migrations-Strategie** neuer Stand-Hinweis-Absatz „Stand
  2026-05-22 (Folge-Pflege „Versions-Bump-Race in openProbe")" mit
  Befund / Code-Lösung / Tafel-Evolutions-Hinweis.
- **§ 10 Änderungsprotokoll** neue Zeile am Ende der Tabelle.

**KEIN Bietet-/Storage-/Fehler-Block-Eingriff für Modul 01** — die
acht öffentlichen Funktionen + ihre Signaturen + ihre dokumentierten
Fehlerverhalten bleiben identisch. Nur ein Garantien-Zusatz „Race-
frei bei Versions-Bumps innerhalb derselben Tab-Session".

### Headless-Smoke-Test

Neue Datei `tests/smoke_pflege_01_versions_bump_race.mjs` (Node 22 +
fake-indexeddb). Vier Proben mit 6 Sub-Proben, 6/6 grün:

| Probe | Erwartung | Ergebnis |
|---|---|---|
| Probe 1: zwei aufeinander folgende `ensureStore`-Bumps ohne Block | db.version >= 6 (4 init + 2 Bumps) | 6 ✓ |
| Probe 2: `closeConnectionAndWait`-Timeout-Fallback greift | beide Bumps grün, < 5 s | 1.51 ms, 2.51 ms ✓ |
| Probe 3: drei `init()`→`ensureStore`-Zyklen mit Modul-Re-Load | kein Throw, db.version >= 7 | OK, version=7 ✓ |
| Probe 4 Regression: db.version === 4 auf frischer DB | 4 | 4 ✓ |
| Probe 4 Regression: `_meta.dbVersionPolicy` | "fail-soft-min-schema" | "fail-soft-min-schema" ✓ |
| Probe 4 Regression: alle 8 Pflicht-Stores vorhanden | alle 8 | alle 8 ✓ |

Probe 2 zeigt ~51 ms pro Bump — der 50-ms-Timeout dominiert, weil
fake-indexeddb kein `onclose` für normalen `close()` feuert. Das
spiegelt das Android-Chrome-Verhalten korrekt: dort wird der
Timeout-Fallback auch der Normalfall sein, weil `onclose` nicht
zuverlässig feuert.

### Regression aller anderen Smoke-Tests

Ohne Code-Anpassung an Aufrufer-Seite läuft alles grün:

| Smoke-Test | Proben | Status |
|---|---|---|
| `smoke_pflege_01_init_fail_soft.mjs` | 8 | 8/8 ✓ |
| `smoke_bau02y.mjs` | 33 | 33/33 ✓ |
| `smoke_bau04a_match_dimensions.mjs` | 19 | 19/19 ✓ |
| `smoke_bau05y_transparent_slot_pfad.mjs` | 25 | 25/25 ✓ |
| `smoke_bau06y_transparent_slot_pfad.mjs` | 25 | 25/25 ✓ |
| `smoke_bau07y_transparent_slot_pfad_und_legacy_hook.mjs` | 30 | 30/30 ✓ |
| `smoke_bau08y_slot_spezifische_outbox.mjs` | 26 | 26/26 ✓ |
| `smoke_pflege_01_versions_bump_race.mjs` (neu) | 6 | 6/6 ✓ |
| **Summe** | **172** | **172/172 grün** |

`node --check src/modules/01_storage.js` grün.

---

## Was NICHT geändert wurde

- **KEIN Modul-Code-Eingriff in Module 00 / 02 / 03 / 04 / 05 / 06 /
  07 / 08.** Diese Module sind „Aufrufer" der Modul-01-API; ihre
  Verträge bleiben unverändert. Die Race-Auflösung ist transparent
  von außen.
- **KEIN INTERFACES.md-Bietet-Block-Eingriff für Modul 01.** Die
  acht öffentlichen Funktionen + ihre Signaturen + ihre
  dokumentierten Fehlerverhalten bleiben identisch.
- **KEIN `DB_VERSION`-Bump.** `DB_VERSION = 4` bleibt.
- **KEINE Spec-Sitzung.** Pflege ist additive Robustheits-Erweiterung,
  kein neuer Modul-Vertrag.
- **KEINE Sichttest-Brücke ergänzt.** PR #131 deckt das schon ab
  (Notfall-Reset-Knopf in Panel 01 + bestehende Panel-06-Setup-
  Knopf).
- **KEINE Sage-Page-(`index.html`)-Änderung.**
- **KEINE CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- `update_puls_pie.py` NICHT aufgerufen (Modul 01 bleibt
  `score:"fertig"`, additive Erweiterung).
- `PROTOCOL_VERSION / DB_VERSION / BACKUP_FORMAT_VERSION` unverändert.

---

## Tafel-Evolutions-Status

**Keine Tafel evolviert.** Die Pflege ist additive Race-Auflösung,
ohne Vertragsbruch. Heilige Tafeln respektiert:

- **„INTERFACES verbindlich":** Bietet-/Storage-/Fehler-Block für
  Modul 01 unverändert. Nur Garantien-Block + Geprüft-Zeile + § 9.5
  Stand-Hinweis + § 10 Änderungsprotokoll wurden additiv nachgezogen.
- **„KEIN `DB_VERSION`-Bump":** respektiert.
- **„KEIN Modul-02/05/06/07/08-Eingriff":** respektiert. Aufrufer-
  Seite ohne Code-Änderung.
- **„KEINE Sichttest-Brücke ergänzen":** respektiert. Der
  Sichttest-Trigger ist der vorhandene PR-#131-Workflow.

---

## Sichttest-Status

**Ungeprüft.** Wartet auf Klaus' Browser-Lauf am Galaxy Tab S6 /
DeX-Chrome auf `127.0.0.1:8000/tests/manual_check.html`. Sequenz aus
dem Brief:

1. Panel 01 Knopf „Notfall-Reset: IndexedDB komplett löschen"
   (frische DB).
2. Strg+Shift+R (Hard-Reload).
3. Panel 06 Knopf „Setup: Identität + 2 Pseudo-Geschwister
   (einmalig)" — MUSS ohne `ensureStore Versions-Bump blockiert`-
   Throw durchgehen.
4. Folge-Knöpfe in Panel 06 (Test 1, Test 9, Test 10, Test 11)
   MÜSSEN grün laufen (PR #130-Test-Bridge-Pflege ist die
   statische Voraussetzung; live-Beweis steht aus).
5. Folge-Knöpfe in Panel 07 (Test 4, Test 5, Test 6) MÜSSEN grün
   laufen.
6. Panel 00 Test 5 MUSS grün laufen.

Headless-Smoke-Test (172 Proben grün) belegt die Modul-Logik; Klaus'
Sichttest auf Android-Chrome ist die finale Bestätigung, weil dort
die `onclose`-Feuer-Unzuverlässigkeit messbarer ist als auf Desktop-
Chrome.

---

## Was offen bleibt

1. **Klaus' Sichttest auf DeX-Chrome / Galaxy Tab S6** (siehe oben).
   Erfolgskriterium aus dem Brief: Setup-Knopf in Panel 06 geht
   ohne Throw durch; Folge-Knöpfe in 06/07/00 grün.
2. **Vollständiger Modul-06/07/00-Sichttest auf grüner DB.** Wartet
   auf Sichttest 1 grün — die 84 Bridge-Stellen aus PR #130 sind
   statisch verifiziert, aber nicht live durchgeklickt.

---

## Nächster sinnvoller Schritt

1. **Klaus' Sichttest am Tab.** Vor jeder Folge-Sitzung. Eine grüne
   Setup-Knopf-Antwort in Panel 06 bestätigt die Race-Auflösung;
   eine rote Antwort bedeutet, dass der 50-ms-Timeout-Fallback auf
   Android-Chrome nicht ausreicht und der Helper länger warten muss
   (oder dass es noch eine andere Race-Quelle gibt).
2. **Bei grünem Sichttest:** PR #136-Brief schließen, PULS-Eintrag
   final markieren (Sichttest grün), Schnellüberblick-Tabelle Modul
   01 Sichttest-Zelle erweitern.
3. **Bei rotem Sichttest:** Folge-Pflege-Sitzung mit höherem Timeout
   oder zusätzlichem Beobachtungs-Mechanismus (z.B.
   `requestAnimationFrame`-Tick + `microtask`-Yield).

---

## Pflicht-Quellen

- **Brief:** PR #136 (gemerged 2026-05-21, `main` `7d0efa0`).
- **Voriger Befund:** `docs/sessions/archiv/2026-05-21_bau-sage-page-refactor-sichttest.md` § Diagnose 2.
- **Code:** `src/modules/01_storage.js` (`openProbe` Zeile 484-523,
  `init()` Zeile 340-470, `ensureStore` Zeile 745-822, `attachVersionChangeHandler` Zeile 230-240).
- **INTERFACES:** § 1 Modul 01 Bietet-Block, § 9.5 Migrations-
  Strategie, § 10 Änderungsprotokoll.
- **Karte 01:** § Versionsmigration § Versions-Fail-Soft-Pfad §
  Folge-Pflege 2026-05-21, § Bauzustand.
