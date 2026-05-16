# Pflege-Sitzung 2026-05-16 — Persistenz-Strategie verbinden (zwei Phasen)

**Sitzungs-Rolle:** Pflege-Sitzung, headless, ZWEI Phasen in einer
Sitzung, ein PR. Branch `claude/pflege-persistenz-strategie-rb6pb`.

**Anlass:** Folge-Pflege direkt zu Bau 02.X Backup-Export (PR #54,
selbiger Tag). Klaus' Sichttest 2026-05-16 hat Stufe (2) der
Identitäts-Persistenz im Browser bestätigt; diese Sitzung schließt
Stufe (3) (Quota-Frühwarnung + Backup-Tipp-Zeile im Doku-Fenster) und
damit den **gesamten Querschnitt „Identitäts-Persistenz" final** —
alle drei Stufen jetzt gelöst.

**Auftrag aus dem Sitzungs-Brief:** zwei klar getrennte Phasen.

- **Phase 1** (~15 Min, Doku-only): Sichttest-Resultate vom
  2026-05-16 (Klaus, Chrome auf Galaxy Tab S6 + DeX) in die heiligen
  Tafeln nachziehen — Karten 02 / 06 / 01 § Bauzustand-Sichttest-
  Zeilen + PULS Schnellüberblick-Tabelle + PULS § „Als nächstes ✨".
- **Phase 2** (~30 Min, Code+Doku): `src/modules/00_doku_fenster.js`
  additiv um eine textliche „Backup empfohlen"-Hinweis-Zeile
  erweitern, die im Modal erscheint, wenn der Knoten weiß, dass
  seine Persistenz wackelt.

---

## § Phase 1 — Sichttest-Resultate 2026-05-16 dokumentieren

Klaus hat am 2026-05-16 in seinem Browser (Chrome auf Galaxy Tab S6
+ DeX) die Panels 01–08 in `tests/manual_check.html` durchgeklickt.
Das Sichttest-Log liegt im Sitzungs-Brief der Bau-02.X-Folge (zweiter
User-Block): vollständige Logs von Panel 02 Knöpfe 6/7/7b + Klaus-
Befund „die anderen 01–08 getestet, die waren alle OK".

### Karte 02 (`docs/components/02_spore.md`)

§ Bauzustand-Zeile „Sichttest (Bau 02.X)" von „ungeprüft, weil
headless gebaut" auf „geprüft 2026-05-16 (Klaus, Chrome auf Galaxy
Tab S6 + DeX)" gesetzt:

- **Knopf 6 (Backup exportieren)** — liefert valides Wrapper-Format
  (`version:1`, `iterations:600000`, AES-GCM-256, `payload-schema-
  version:1`). Download-Link `sbkim-backup-YYYY-MM-DD.json`
  erscheint unter den Knöpfen.
- **Knopf 7 (Backup einlesen ohne force)** — `BackupOverwriteError`
  mit korrekter Warnzeile + Status-Chip „Bestehende Identität"
  (Schutz-Pfad, erwartet).
- **Knopf 7b (Identität ersetzen — unwiderruflich)** — force-Pfad
  funktioniert im normalen Pfad.

**Test-Panel-UX-Befund** (kein Modul-Bug): `pendingBackup`-Stash
wird in Knopf 7 beim zweiten Klick überschrieben (`pendingBackup =
null` direkt am Anfang des Handlers). Wenn Klaus zweimal auf
Knopf 7 klickt ohne im File-Picker eine Datei zu wählen, geht der
Stash verloren und Knopf 7b zeigt „Kein Backup zum Ersetzen
vorgemerkt". Modul-Vertrag unangetastet — Folge-Mini-Pflege offen
(Knopf-7-Reset nach erfolgreicher Datei-Wahl statt am Anfang).

### Karte 06 (`docs/components/06_heterokaryose.md`)

§ Bauzustand-Sichttest-Zeile gesetzt: „geprüft 2026-05-16 (Klaus,
Chrome auf Galaxy Tab S6 + DeX) — Panel 06 mit 14 Knöpfen rasch
grob durchgeklickt zusammen mit Panels 01–05/07/08, alle
Selbstchecks grün, Hauptpfade ohne Auffälligkeit. Voller Test-1–9-
Lauf mit 14-Knopf-Pass-Check (inkl. Test 9 `HETERO_MAX_ANCHORS`-
Begrenzung sechs Outbox-Einträge → fünf Anker, neueste zuerst)
folgt bei Bedarf."

Ehrliche „rasch grob"-Variante (Briefing-Vorgabe) — kein Fake-
„geprüft" für nicht im Detail durchgespielte Pfade. Klaus' Aussage
„die anderen 01–08 getestet, die waren alle OK" ist als grob-
durchgeklickt interpretiert; das ist ehrlich und korrekt.

### Karte 01 (`docs/components/01_storage.md`)

§ Bauzustand neue Zeile „Sichttest Knopf 5 Persist-Status (Pflege
Storage-Persist)": „geprüft 2026-05-16 (Klaus, Chrome auf Galaxy
Tab S6 + DeX): fünfter Panel-01-Knopf „Persist-Status zeigen"
liefert `_meta.storagePersisted: true` (Chrome auto-bei-PWA
bestätigt — Stufe (1) der Identitäts-Persistenz wirkt
plattformkonform)."

Live-Wert `true` ist die erwartete Antwort für Chrome auf einer
installierten PWA. Hätte Klaus' Lauf `false` oder `null` geliefert,
hätte ich diesen Live-Wert dokumentiert (Sichttest-Konvention
„kein Fake-Pass").

### PULS-Aktualisierungen Phase 1

- **§ Schnellüberblick-Tabelle** Modul 02 / 06 / 01 Sichttest-
  Spalten mit „2026-05-16 (Klaus)"-Datum aktualisiert. Modul 01
  Code-Spalte um „Pflege PWA-Suffix + Pflege Storage-Persist
  2026-05-16" erweitert.
- **§ „Als nächstes ✨" obere geprüft-Liste** Modul 02-Eintrag um
  Bau-02.X-Sichttest-Vermerk erweitert; Modul 06 aus der
  „Sichttest ausstehend bzw. teilweise erledigt"-Liste in die
  obere Liste verschoben (rasch grob durchgeklickt 2026-05-16).

KEIN Code in Phase 1, KEINE INTERFACES.md-Änderung, KEIN
`update_puls_pie.py` (kein Score-Wechsel).

---

## § Phase 2 — Modul 00 Backup-Tipp-Zeile

Modul 00 (Doku-Fenster) bekommt eine textliche Brücke zu Modul 02
(Backup-Export): eine „Backup empfohlen"-Hinweis-Zeile, die im
Modal erscheint, wenn der Knoten weiß, dass seine Persistenz wackelt.

### Code-Befund — `src/modules/00_doku_fenster.js`

Additiv erweitert (kein Refactoring der bestehenden Funktionen):

1. **Neue modul-lokale Konstante** `DOKU_BACKUP_TIP_TEXT` am Kopf
   neben `DOKU_QUOTA_WARN_RATIO`/`…_BYTES`. Vollständiger Wortlaut
   (deutsche typografische Anführungszeichen):

   > Tipp: Speicher-Schutz für diesen Knoten ist nicht bestätigt.
   > Lege ein Backup an (Panel 02 „Backup exportieren" —
   > passwort-verschlüsselte .json-Datei), damit die Identität
   > einen Browser-Wechsel oder ein Aufräumen des Browserspeichers
   > überlebt.

2. **`getStatusSnapshot()` um neues Feld erweitert.** Modul 00
   liest `SbkimStorage._meta.storagePersisted` fail-soft via
   try/catch um den Getter; null/undefined/Wurf → `null` im
   Snapshot. Das neue Feld `storagePersisted: boolean | null`
   sitzt zwischen `quota` und `openedAt`. Defensiv: `null` bedeutet
   „Modul 01 nicht geladen, API nicht verfügbar, persist warf
   synchron oder rejected". Modul 00 behandelt `null` und `true`
   gleich (= kein Warn-Trigger); nur explizites `false` triggert
   die Tipp-Zeile.

3. **Modal-Render-Pfad** um Tipp-Zeile erweitert. Zwei neue Render-
   Helfer direkt nach `renderQuotaWarning`:

   - `shouldShowBackupTip(snapshot)` — true wenn
     `storagePersisted === false` ODER `quota.warningLevel !==
     "none"`.
   - `renderBackupTip()` — blaue Hinweis-Zeile (`background:
     #e7f1ff;color:#1a3a6e;border:#9cbfee`), Klassen-Präfix
     `sbkim-doku-backup-tip`, ℹ-Glyph + Wortlaut.

   Der Aufruf sitzt im Modal-Aufbau **zwischen** Quota-Warnung und
   Modulstand-Sektion — damit die akute Quota-Schwelle gelb-rot
   sichtbar bleibt und der Tipp die nächste Handlung beschreibt.
   KEIN Knopf, KEIN `SbkimSpore.exportBackup`-Aufruf (Aufrufer-
   Pflicht-Trennung; Karte 00 § Verantwortlichkeiten „Macht
   nicht"). Klaus liest den Tipp und klickt „Backup exportieren"
   in Panel 02 selbst.

4. **`_meta` um `dokuBackupTipText`** ergänzt — Test-Brücken können
   den Wortlaut prüfen (Trigger-Bedingung lässt sich via
   `_setQuotaForTest` und `_meta`-Mock simulieren).

5. **Validierung:** `node --check src/modules/00_doku_fenster.js`
   grün.

### Karten- und INTERFACES-Erweiterungen Phase 2

- **`docs/components/00_doku_fenster.md`**:
  - § Datenformat `DokuStatus` um `storagePersisted: boolean |
    null` erweitert.
  - Neuer § Modal-Render-Pfad mit elf Render-Sub-Sektionen und
    Sub-Sektion „Backup-Tipp-Zeile" (Trigger-Bedingung, voller
    Wortlaut, Hinweis-only-Erklärung).
  - § Konfigurationswerte (Modul-lokal) um `DOKU_BACKUP_TIP_TEXT`
    (NICHT in §0 — der Wortlaut ist Modul-00-Eigenheit, nicht
    querschnittsrelevant).
  - § Risiken neuer Punkt „Backup-Tipp ist textlich, keine
    Selbstheilung".
  - § Manueller Test neuer Punkt 6 „Backup-Tipp-Zeile prüfen"
    (Quota-Trigger und/oder `storagePersisted: false`-Mock); Punkt
    7 ist jetzt Selbstcheck-Hinweis (ehemals Punkt 6).
  - § Bauzustand zwei neue Zeilen: „Pflege Persistenz-Strategie
    verbinden" (Code) + „Sichttest (Pflege Persistenz)"
    („ungeprüft, weil headless gebaut").

- **`docs/INTERFACES.md` §1 Modul 00**:
  - Bietet-Block um DokuStatus-Rückgabe-Form mit
    `storagePersisted: boolean | null`-Feld erweitert.
  - Nutzt-Block um `SbkimStorage._meta.storagePersisted` (Lesen,
    fail-soft) erweitert.
  - Geprüft-Zeile um 2026-05-16 (Pflege Persistenz-Strategie
    verbinden).
  - §6 Änderungsprotokoll neue Zeile am unteren Ende mit Code-
    Befund (neue Konstante, snapshot-Feld, Modal-Render-Zeile, zwei
    Render-Helfer).

### PULS-Aktualisierungen Phase 2

- **§ Offene Querschnitts-Fragen „Identitäts-Persistenz"** alle
  drei Stufen `~~strikethrough~~`-gelöst; gesamter Block im unteren
  gelösten Bereich.
- **§ Offene Querschnitts-Fragen „Spore-Persistenz-Strategie
  verteilt"** ebenfalls `~~strikethrough~~`-gelöst (alle drei
  verteilten Stellen jetzt konsistent: Quota-Schwellwert in §0,
  Backup-Format in §0 + Karte 02, Warntext modul-lokal in Modul 00).
- **§ Schnellüberblick-Tabelle Modul 00** Code-Spalte um „Pflege
  Persistenz-Strategie verbinden 2026-05-16" erweitert.
- **§ Sitzungs-Einträge** rotiert (dieser Pflege-Eintrag oben mit
  vollem Text und beiden Phasen klar getrennt; Bau-02.X bleibt im
  Archiv-Index — schon dort).
- **§ Archiv-Index** neue Zeile oben (diese Pflege).

---

## § Querschnitt final gelöst

Mit dieser Pflege-Sitzung sind ZWEI Querschnitts-Einträge in PULS
endgültig auf `~~strikethrough~~`-gelöst:

### Identitäts-Persistenz (drei Stufen)

- ~~Stufe (1) `navigator.storage.persist()` beim Storage.init~~ —
  Pflege Storage-Persist 2026-05-16 (PR #51 / `_meta.storagePersisted`-
  Getter fail-soft, Klaus' Sichttest 2026-05-16 Knopf 5 Panel 01
  `true` auf Chrome auto-bei-PWA).
- ~~Stufe (2) Backup-Export passwort-verschlüsselt in Modul 02~~ —
  Spec Backup-Export Stufe 2 + Bau 02.X Backup-Export 2026-05-16
  (PR #52 + PR #54 / PBKDF2-SHA256 600 000 + AES-GCM-256, Klaus'
  Sichttest 2026-05-16 Knöpfe 6/7/7b alle drei grün).
- ~~Stufe (3) Quota-Frühwarnung + Backup-Tipp-Zeile in Modul 00~~ —
  diese Pflege-Sitzung (DokuStatus `storagePersisted: boolean |
  null`-Feld, blaue Backup-Tipp-Zeile im Modal mit
  `DOKU_BACKUP_TIP_TEXT`; Trigger bei `storagePersisted === false`
  ODER `quota.warningLevel !== "none"`).

### Spore-Persistenz-Strategie verteilt (drei Stellen, vier Module)

- Modul 01 Storage `navigator.storage.persist()` (Pflege Storage-
  Persist 2026-05-16) + `navigator.storage.estimate()` via Modul 00
  (Bau 00 2026-05-14).
- Modul 02 Spore Backup-Export (Spec + Bau 02.X 2026-05-16).
- Modul 00 Doku-Fenster Quota-Frühwarnung (Bau 00 2026-05-14) +
  Backup-Tipp-Zeile (diese Pflege 2026-05-16).
- Modul 07 Apoptose Risiko-Vermerk „stille Löschung" (steht seit
  Bau 07 in Karte 07 § Risiken).

Alle drei verteilten Werte stehen jetzt konsistent: **Quota-
Schwellwert** in §0, **Backup-Format** (`SbkimBackupBlob`) in §0
+ Karte 02 § Datenformat, **Warntext** als `DOKU_BACKUP_TIP_TEXT`
modul-lokal in Modul 00 (einmal formuliert).

---

## § Bewusst nicht angefasst

- **Modul 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08 Code** unverändert.
  Modul 01 `_meta.storagePersisted` wird nur gelesen, nicht
  geändert. Modul 02 `exportBackup` wird im Tipp-Text genannt, nicht
  aufgerufen.
- **Test-Panel-UX-Fix für Knopf-7-pendingBackup-Reset** in dieser
  Sitzung NICHT gemacht — eigene Folge-Mini-Pflege. Karte 02 §
  Bauzustand dokumentiert nur den Befund, keine Lösung. Test-Panel
  ist nicht Modul-Code; eigene Trennung.
- **Spore-Feld-Erweiterung, §2/§3/§4/§5-Änderung** — keine.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`, **`DB_VERSION`** bleibt
  `3`, **`BACKUP_FORMAT_VERSION`** bleibt `1`.
- **`update_puls_pie.py`** NICHT aufgerufen (kein Score-Wechsel).
- **Neuer Store, DB_VERSION-Erhöhung** — keiner.
- **Sage-Page-(`index.html`)-Änderung** — keine.
- **Karten 14 / 10 / 11 / 12-Änderung** — keine.
- **Klaus-Sichttest-Erzwingung Phase 2** — entfällt, weil Code-Stub
  headless gebaut wurde und auf Klaus' Browser-Lauf wartet
  (dokumentiert in Karte 00 § Bauzustand-Zeile „Sichttest (Pflege
  Persistenz)" als „ungeprüft").

---

## § Validierung

- `node --check src/modules/00_doku_fenster.js` grün.
- Cross-Reading Karte 00 ↔ INTERFACES.md §1 Modul 00 ↔ §6 ↔ PULS
  durchgezogen (Datenformat-Feld `storagePersisted` konsistent,
  Trigger-Bedingung konsistent, Wortlaut der Tipp-Zeile konsistent).
- PULS-Querschnitts-Fragen-Block: alle drei Stufen der Identitäts-
  Persistenz `~~strikethrough~~`-markiert; Spore-Persistenz-
  Strategie verteilt ebenfalls.
- CLAUDE.md-Pflichten: deutsche Doku, englische Code-Kommentare,
  YYYY-MM-DD-Datum, kein PROTOCOL_VERSION-Sprung, keine personen-
  bezogenen Daten, keine Netz-Aufrufe (Modul 00 ist Browser-API-
  lokal, kein fetch).

---

## § Was offen blieb

- **Klaus' Sichttest Phase 2** (Backup-Tipp-Zeile im Browser): drei
  Mini-Setups in Panel 00 —
  - (a) `_setQuotaForTest({usage:8.1*1024**3, quota:10*1024**3})` →
    Tipp-Zeile erscheint zusammen mit Quota-Warn.
  - (b) `_clearQuotaForTest()` UND `Object.defineProperty(
    SbkimStorage._meta, "storagePersisted", { get: function () {
    return false; } })` → Tipp-Zeile erscheint allein.
  - (c) beide auf grün → Tipp-Zeile fehlt.
- **Test-Panel-UX-Fix Knopf-7-pendingBackup-Reset** offen (eigene
  Folge-Mini-Pflege, ≤ 15 Min headless möglich; niedrig priorisiert).
- **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** mit
  PWA-Suffix aus Pflege 2026-05-16 (unverändert offen, wartet auf
  Klaus am Termux).
- **Cross-Knoten-Handshake** zwischen beiden Endknoten nach
  Re-Andock.
- **`status.json` `pingStatus`** für beide Endknoten von
  `"blocked-origin-collision"` auf `"live"` nach Cross-Handshake.
- Übrige offene Punkte (Sushi-Kategorie sichtbar machen,
  INTERFACES.md §6 Tabellen-Bug, Eruda-Rückbau, voller Panel-06-
  Test-1–9-Lauf bei Bedarf) unverändert offen.

---

## § Nächster sinnvoller Schritt

1. **Klaus' Sichttest Panel 00 Backup-Tipp-Zeile** in seinem
   Browser (Phase 2 Folge-Sichttest). Bestätigt, dass die
   Trigger-Bedingung tatsächlich greift und die blaue Tipp-Zeile
   sauber zwischen Quota-Warn und Modulstand sitzt. **Nicht
   headless — wartet auf Klaus.** Bei grünem Lauf: Karte 00 §
   Bauzustand-Zeile „Sichttest (Pflege Persistenz)" auf
   „geprüft <Datum>" stellen.
2. **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** mit
   PWA-Suffix (unverändert offen, wartet auf Klaus am Termux —
   `await SbkimStorage.init({dbSuffix:"mixarium"})` bzw.
   `"rezeptbuch"` vor `SbkimAnastomose.init()` in beiden
   Endknoten-Repos einfügen, `__sbkimErzeugeSpore()` triggern,
   neue spore.json deployen). Blockiert Cross-Knoten-Handshake.
3. **Cross-Knoten-Handshake** zwischen Mein-Rezeptbuch und
   Mein-Mixarium nach Re-Andock — setzt Schritt 2 voraus.
4. **Mini-Pflege Test-Panel Knopf 7 pendingBackup-Reset**
   (`tests/manual_check.html` Panel 02 Knopf 7 — Reset nach
   erfolgreicher Datei-Wahl statt am Anfang). Headless möglich,
   ≤ 15 Min, kein Modul-Code-Eingriff. Niedrig priorisiert.

---

**Branch:** `claude/pflege-persistenz-strategie-rb6pb`.
**Vorgänger:** PR #54 (Bau 02.X Backup-Export Code-Stub).
**Identitäts-Persistenz-Architektur nach diesem PR: alle drei Stufen
final gelöst.**
