# Brief — Pflege Modul 01 Versions-Bump-Race in `openProbe`

**Pflege-Sitzung** (kein Spec, kein neuer Modul-Vertrag, additive
Robustheits-Erweiterung an Modul 01). Direkte Folge auf Klaus'
Sage-Page-Sichttest 2026-05-21 (Sitzungs-Ende-PR #135 gemerged,
`main` `7da0da9`). Diese Pflege schließt den letzten offenen
Modul-01-Bug, der den `manual_check.html`-Sichttest blockiert — der
`openProbe`-Connection wird kein `onversionchange`-Handler installiert,
und ihr synchronisches `close()` läuft asynchron im IndexedDB-Worker-
Thread weiter; ein späterer `ensureStore`-Bump scheitert mit
`onblocked`.

Dieser Brief geht in den **ersten Prompt** der nächsten Pflege-Sitzung
als Codeblock.

---

```
Du bist eine Pflege-Sitzung in Sage-Protokol — Pflege Modul 01
Versions-Bump-Race in `openProbe`.

Branch: claude/pflege-01-versions-bump-race   (vom main aus anlegen)

Sitzungs-Rolle: Pflege (kein Spec, kein neuer Modul-Vertrag, additive
Robustheits-Erweiterung an Modul 01). Du löst eine Race-Condition
zwischen `openProbe`-Connection-Close und nachfolgendem
`ensureStore`-Versions-Bump auf. Manifestiert sich nur in
`tests/manual_check.html` bei wiederholtem Modul-Wechsel — Endknoten-
PWAs (Mein-Rezeptbuch / Mein-Mixarium / Sage-Page) sind nicht
betroffen, weil sie nur EINE `init()`-Kette pro Tab-Lebenszeit haben.
KEINE Modul-02/05/06/07/08-Änderung, KEIN `ensureStore`-Verhalten-
Bruch (Ergebnis bleibt identisch), KEIN `DB_VERSION`-Bump.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
   - § Heilige Tafeln § Tafel-Evolutions-Klausel — der Auslöser
     der vorigen Modul-01-Pflege (2026-05-19); diese ist eine
     weitere Folge-Pflege, kein neuer Vertrag.
   - § Wer ist der Betreiber § Arbeitsumgebung (Pflege 2026-05-21) —
     Klaus arbeitet am Galaxy Tab S6 / DeX-Chrome, keine Konsole,
     alle Sichttests via Knöpfe.
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Sichttest-Folge zur
     Bau-Sitzung Sage-Page-Refactor" — § Offene Folge-Pflege § Modul-
     01-Versions-Bump-Bug enthält den Befund.
3. docs/sessions/archiv/2026-05-21_bau-sage-page-refactor-sichttest.md
   - § Diagnose 2 „Bekannter Modul-01-Versions-Bump-Bug bleibt offen"
     mit Code-Pfad-Analyse (openProbe Zeile 484-523, init() Zeile
     340-470, ensureStore Zeile 745-822). DER zentrale Lese-Auftrag.
4. docs/INTERFACES.md
   - § 1 Modul 01 Bietet-Block + Garantien-Block bleibt UNVERÄNDERT.
   - § 9.5 Migrations-Strategie inkl. Folge-Befund 2026-05-19.
5. docs/components/01_storage.md — du erweiterst sie um die neue
   Race-Auflösung (Sub-Block § Versionsmigration § Folge-Pflege
   2026-05-21).
6. src/modules/01_storage.js — du erweiterst openProbe + init.

Was du NICHT liest: Karten 00 / 02-15; Modul-Code 02-08; Sage-Page
index.html; tests/manual_check.html (außer für Sichttest-Trigger via
PR #131-Notfall-Knopf); Briefe der V1-Sammelspec-Kaskade (sind
historisch); BRIEF_BAU_PFLEGE_01_INIT_FAIL_SOFT (vorige Modul-01-
Pflege gemerged 2026-05-19, der Befund ist in INTERFACES § 9.5
gespiegelt).

Heilige Tafeln (Pflege-spezifisch):

- **INTERFACES verbindlich.** Reihenfolge INTERFACES → Karte → Code.
  § 1 Modul 01 Bietet-Block + Storage-Block + Fehler-Block bleiben
  UNVERÄNDERT. Du ziehst NUR den Garantien-Block (zusätzliche
  Race-frei-Zusicherung) + Geprüft-Zeile + § 9.5 Stand-Hinweis +
  § 10 Änderungsprotokoll nach.

- **Tafel-Evolutions-Klausel respektieren.** Wenn du im Lauf der
  Sitzung auf eine weitere Tafel stößt, die mit dieser Arbeit in
  Konflikt steht: NICHT stillschweigend umgehen, NICHT stoisch
  blockieren, sondern Klaus EXPLIZIT auf Anpassungs-Bedarf hinweisen
  (CLAUDE.md § Heilige Tafeln § Tafel-Evolutions-Klausel).

- **Race-Auflösung semantisch:** Modul 01 wartet vor dem nächsten
  `indexedDB.open(name, newVersion)` darauf, dass alle ZUVOR
  geöffneten Connections vollständig geschlossen sind. Konkret:
  (a) auf der `openProbe`-Connection einen `onversionchange`-Handler
  installieren, der bei einem späteren Bump die Connection
  zusätzlich schließt (Fail-soft); (b) `db.close()` mit einem
  `onclose`-Listener kombinieren + `await new Promise(resolve =>
  { db.onclose = resolve; setTimeout(resolve, 50); })` (Timeout
  als Sicherheitsnetz, weil Chrome `onclose` nicht immer feuert);
  (c) `attachVersionChangeHandler` für ALLE neu geöffneten
  Connections (Probe + Initial + Bump) aufrufen, nicht nur für die
  „aktuelle" `currentDb`.

- **Bestehender `ensureStore`-Vertrag bleibt unverändert.**
  Aufrufer-Seite (Modul 02/05/06/07/08): keine Code-Änderung. Modul-
  Verhalten von außen identisch — nur die intern verborgene
  Race-Anfälligkeit fällt weg.

- **Sichttest-Trigger erhältlich.** Klaus reproduziert den Bug
  reproduzierbar via `tests/manual_check.html` Panel 01 Knopf
  „Notfall-Reset" (PR #131 gemerged) + Hard-Reload + Panel 06
  „Setup" — vor der Pflege wirft `ensureStore('sbkim_meta') Versions-
  Bump blockiert`; nach der Pflege MUSS Setup ohne Throw durchgehen.

- **Galaxy-Tab-S6-Browser-Quirks beachten.** Klaus' Sichttest ist
  in DeX-Chrome auf Android. Chrome auf Android schließt IndexedDB-
  Connections messbar langsamer als Desktop-Chrome. Wenn dein
  Lösungs-Ansatz auf Desktop-Chrome funktioniert aber auf Android
  scheitert, ist der Ansatz nicht fertig. (Klaus' Sichttest ist
  die Wahrheit, nicht der Smoke-Test auf deinem Server.)

Sechs Punkte zu erledigen:

a) `openProbe(name)` (Zeile 484-523):
   - Vor `resolve({ db: req.result, wasCreated: wasCreated })` einen
     `onversionchange`-Handler an die Connection hängen, der die
     Connection bei einem späteren Bump aus einem anderen Pfad
     schließt — Fail-soft (kein Throw). Konkret:
     `req.result.onversionchange = function () { req.result.close(); };`
   - Begründung im Code-Kommentar erklären (Race-Auflösung,
     Pflege 2026-05-21).

b) `init()` (Zeile 340-470), beide `probedDb.close()`-Stellen
   (Zeile 376 Fail-soft-Pfad + Zeile 404 Initial-Pfad):
   - `probedDb.close()` durch eine async-Wait-Helper-Funktion
     ersetzen, die auf `onclose` wartet (mit 50 ms Timeout-Fallback).
     Konkret: neue Closure-Helper-Funktion
     `closeConnectionAndWait(db)`, die zurückgibt
     `new Promise(function (resolve) {
        db.onclose = resolve;
        setTimeout(resolve, 50);
        try { db.close(); } catch (e) { resolve(); }
     });`
   - Beide Aufrufstellen `await`en.

c) `ensureStore` (Zeile 745-822) `db.close()` (Zeile 770):
   - Gleiche async-Wait-Helper-Funktion `closeConnectionAndWait(db)`
     anwenden. Erst nach `await closeConnectionAndWait(db)` das
     `indexedDB.open(dbNameInUse, newVersion)` ausführen.

d) `attachVersionChangeHandler(db)` (Zeile 230-240):
   - Sicherstellen, dass dieser Handler auf JEDER neuen Connection
     installiert wird — `init()`-Erfolgs-Pfad (Zeile 442 ✓ bereits da)
     + `ensureStore`-Erfolgs-Pfad (Zeile 798 ✓ bereits da) +
     **NEU: `openProbe`-Erfolgs-Pfad** (siehe Punkt a).

e) Karte `docs/components/01_storage.md`:
   - § Versionsmigration: neuer Sub-Block „Folge-Pflege 2026-05-21 —
     Race-Auflösung in openProbe + Close-Wait" mit zwei Absätzen
     (Was sich änderte / Klaus' Sichttest-Beweis).
   - § Bauzustand: neue Zeile mit Datum + PR-Nummer + „Race-Auflösung
     grün im Sichttest am Galaxy Tab S6 / DeX-Chrome".
   - § Risiken: keine neuen Punkte (bestehender Race war nicht
     dokumentiert, deshalb keine Tafel zu evolvieren).

f) `tests/manual_check.html`:
   - KEINE Änderung. Sichttest-Trigger ist der vorhandene Workflow
     aus PR #131 (Notfall-Reset-Knopf + Hard-Reload + Setup-Knopf in
     einem anderen Panel).

Was du NICHT machst:

- **KEIN Modul-Code-Eingriff in Module 00 / 02 / 03 / 04 / 05 / 06 /
  07 / 08.** Diese Module sind „Aufrufer" der Modul-01-API; ihre
  Verträge bleiben unverändert.
- **KEIN INTERFACES.md-Bietet-Block-Eingriff für Modul 01.** Die
  acht öffentlichen Funktionen + ihre Signaturen + ihre dokumentierten
  Garantien bleiben identisch. Nur ein Garantien-Zusatz „Race-frei
  bei Versions-Bumps innerhalb derselben Tab-Session" wird ergänzt.
- **KEIN `DB_VERSION`-Bump.** `DB_VERSION = 4` bleibt.
- **KEINE Spec-Sitzung.** Wenn die Pflege auf einen Spec-Lücke trifft
  (sehr unwahrscheinlich): ENDE der Sitzung, Befund in PULS § Offene
  Querschnitts-Fragen, eigene Spec-Sitzung anschließen.
- **KEINE Sichttest-Brücke ergänzen.** PR #131 deckt das schon ab.

Erfolgskriterium:

- `node --check src/modules/01_storage.js` grün.
- Headless-Smoke-Test (sofern vorhanden) grün ohne Regression.
- Klaus' Sichttest auf `127.0.0.1:8000/tests/manual_check.html`:
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

Pflicht am Ende:

- `src/modules/01_storage.js` mit Race-Auflösung.
- `docs/components/01_storage.md` aktualisiert (Versionsmigration
  + Bauzustand).
- `docs/INTERFACES.md` § 1 Modul 01 Garantien-Block: neue
  Race-frei-Garantie + § 10 Änderungsprotokoll.
- `docs/PULS.md`-Eintrag (neuer TOP-Eintrag, kompakt).
- `docs/sessions/archiv/2026-05-22_pflege-01-versions-bump-race.md`
  (Übergabeprotokoll, Format siehe BRIEFING_TEMPLATE.md).
- Knopf „Notfall-Reset" + Module 06/07/00 Sichttest-Knöpfe von
  Klaus live durchgespielt, Outputs ins Übergabeprotokoll.
- Commit + Push + PR (Draft).

Zeitschätzung: 2-3 h reine Bau-Zeit + 30 min Klaus' Sichttest. Hängt
davon ab, ob der 50-ms-Timeout-Fallback ausreicht oder das Lösungs-
Ansatz auf Android-Chrome anders trägt als auf Desktop-Chrome.

PROTOCOL_VERSION/DB_VERSION/BACKUP_FORMAT_VERSION unverändert.
KEINE Endknoten-Repo-Änderungen.
```
