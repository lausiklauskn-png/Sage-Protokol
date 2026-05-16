# Mini-Pflege 2026-05-16 — Test-Panel Knopf-7-pendingBackup-Reset

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase (reine
Test-Panel-UX). Branch `claude/fix-test-panel-button-7-Iwf1E`.

**Anlass:** Folge-Mini-Pflege zum Test-Panel-UX-Befund aus
Pflege Phase-1 Sichttest-Resultate Karten 02/06/01 (selbiger
Tag, archiviert unter
`docs/sessions/archiv/2026-05-16_pflege-phase1-sichttest-karten-02-06-01.md`).
Klaus' Sichttest 2026-05-16 hatte die Bau-02.X-Knöpfe 6/7/7b als
grün bestätigt, aber dabei einen Test-Panel-UX-Befund (kein
Modul-Bug) dokumentiert: der `pendingBackup`-Stash in Panel 02
Knopf 7 wurde beim zweiten Klick auf „Backup einlesen"
überschrieben (`pendingBackup = null` direkt am Anfang des
Handlers). Bei doppeltem Klick auf Knopf 7 ohne File-Wahl ging
der Stash aus einem vorherigen `BackupOverwriteError`-Lauf
verloren, und Knopf 7b zeigte „Kein Backup zum Ersetzen
vorgemerkt".

**Module:** keine — reine Test-Panel-UX-Pflege in
`tests/manual_check.html`. Modul-Code in `src/modules/`
unangetastet, INTERFACES.md unangetastet.

---

## Auftrag

1. Im Knopf-7-Handler die Zeile `pendingBackup = null;` direkt
   am Handler-Anfang entfernen.
2. Stattdessen `pendingBackup = null;` erst dann setzen, wenn
   der File-Picker-`change`-Listener tatsächlich eine Datei
   geliefert hat — und vor dem `importBackup(blob, password)`-
   Aufruf.
3. Bestehende Pfade unverändert:
   - **Erfolgsfall** (kein `BackupOverwriteError`) →
     `pendingBackup` bleibt null, Knopf 7b inert.
   - **`BackupOverwriteError`-Pfad** → `pendingBackup` wird mit
     gelesenem Blob+Passwort gefüllt, Knopf 7b scharf, Warnzeile
     mit alter nodeId erscheint wie bisher.
4. **File-Picker-Cancel** darf KEINE State-Änderung auslösen —
   `change`-Listener feuert in diesem Fall nicht, `pendingBackup
   = null` darf nirgends im Pfad davor sitzen.
5. Karte 02 § Bauzustand-Zeile „Sichttest (Bau 02.X)" UX-Befund-
   Satz auf „in Folge-Mini-Pflege gefixt" anpassen.
6. PULS § „Als nächstes ✨" Modul 02-Eintrag UX-Befund-Vermerk
   auf „gefixt" stellen; § obersten Sitzungs-Eintrag (Phase-1)
   „Was offen blieb"-Punkt mit `~~strikethrough~~` markieren.
7. PULS § Sitzungs-Einträge rotieren (dieser Mini-Pflege-Eintrag
   oben); § Archiv-Index neue Zeile oben.
8. `status.json` NICHT angefasst, `update_puls_pie.py` NICHT
   aufgerufen.
9. Übergabeprotokoll anlegen (diese Datei).

---

## Was getan wurde

### 1. `tests/manual_check.html` — Knopf-7-Handler-Refactor

**Vorher:**

```javascript
var pendingBackup = null; // { blob, password }
SbkimUI.addButton("02_spore", "Backup einlesen", async function () {
  pendingBackup = null;                                   // ← entfernt
  var fileInput = document.createElement("input");
  // ... File-Picker, Passwort-Prompt, JSON-Parse ...
  try {
    var result = await SbkimSpore.importBackup(blob, password);
    // ...
```

**Nachher:**

```javascript
var pendingBackup = null; // { blob, password }
SbkimUI.addButton("02_spore", "Backup einlesen", async function () {
  var fileInput = document.createElement("input");
  // ... File-Picker, Passwort-Prompt, JSON-Parse ...
  try {
    pendingBackup = null;                                 // ← jetzt hier
    var result = await SbkimSpore.importBackup(blob, password);
    // ...
```

Inline-Kommentar oberhalb der `var pendingBackup`-Deklaration
erweitert um die Begründung: „pendingBackup-Reset bewusst NICHT
am Handler-Anfang: ein zweiter Klick auf „Backup einlesen" ohne
File-Wahl (Picker-Cancel) würde sonst den Stash aus einem
vorherigen BackupOverwriteError-Lauf verlieren und Knopf 7b
inert machen. Reset passiert daher erst direkt vor dem
importBackup-Aufruf (nach erfolgreicher File-Wahl)."

### 2. `docs/components/02_spore.md` — Karte 02 § Bauzustand

§ Bauzustand-Zeile „Sichttest (Bau 02.X)" UX-Befund-Nachsatz so
umformuliert, dass er den Fix der Folge-Mini-Pflege beschreibt
statt einer offenen Forderung. Sichttest-Datum für Modul 02
selbst bleibt unverändert „geprüft 2026-05-16 (Klaus, Chrome auf
Galaxy Tab S6 + DeX)" — nur der Test-Panel-UX-Befund-Block zeigt
jetzt die Lösung. Hinweis ergänzt, dass der Sichttest des Fix-
Pfads selbst headless gebaut und ungeprüft ist.

### 3. `docs/PULS.md` — § „Als nächstes ✨" Modul 02-Eintrag

UX-Befund-Vermerk im Modul-02-Eintrag von „ist Folge-Mini-
Pflege, kein Modul-Bug" auf „wurde in Folge-Mini-Pflege
2026-05-16 gefixt (Reset jetzt erst direkt vor `importBackup`
statt am Handler-Anfang; Sichttest des Fix-Pfads ungeprüft, weil
headless gebaut, wartet auf Klaus' Browser-Lauf)" gestellt.

### 4. `docs/PULS.md` — § obersten Sitzungs-Eintrag (Phase-1)

„Was offen blieb"-Punkt „Test-Panel-UX-Fix Knopf-7-
pendingBackup-Reset" mit `~~strikethrough~~` als gelöst
markiert (Sub-Eintrag mit Lösung-Beschreibung). Phase-1-Eintrag
selbst wandert in dieser Sitzung vollständig aus dem visible
Sitzungs-Block (war bereits im Archiv-Index, neu hinzugefügt
durch die Phase-1-Sitzung selbiger Tag).

### 5. `docs/PULS.md` — § Sitzungs-Einträge + Archiv-Index

Sitzungs-Eintrag rotiert: dieser Mini-Pflege-Eintrag jetzt oben,
Phase-1-Eintrag fällt aus dem visible Block. Archiv-Index neue
Zeile oben mit Link auf diese Übergabe.

### 6. Übergabeprotokoll

Diese Datei
(`docs/sessions/archiv/2026-05-16_pflege-test-panel-knopf-7-pendingBackup.md`).

---

## Bewusst nicht angefasst

- **`src/modules/00_doku_fenster.js`**,
  **`src/modules/01_storage.js`**, **`src/modules/02_spore.js`**,
  **`src/modules/03_embedding.js`**, **`src/modules/04_match.js`**,
  **`src/modules/05_anastomose.js`**, **`src/modules/06_heterokaryose.js`**,
  **`src/modules/07_apoptose.js`**, **`src/modules/08_ui_demo.js`**
  unverändert (Test-Panel ist nicht Modul-Code).
- **`INTERFACES.md`** unverändert (Test-Panel ist nicht
  Vertrags-Bestandteil; §0/§1/§2/§3/§4/§5/§6 nicht angetastet).
- **`PROTOCOL_VERSION`** bleibt `"0.1"`, **`DB_VERSION`** bleibt
  `3`, **`BACKUP_FORMAT_VERSION`** bleibt `1`.
- **`update_puls_pie.py`** NICHT aufgerufen (kein Score-Wechsel;
  Modul 02 bleibt `score:"stub"` — Test-Panel ist nicht Modul-
  Code).
- **`status.json`** unverändert.
- **Sage-Page-(`index.html`)-Änderung** — keine.
- **Karten 14 / 10 / 11 / 12** unangetastet.
- **`docs/PAPER_NUTZEN_UND_INTEGRATION.md`** unangetastet
  (gehört zur parallelen Hauptsitzung „Page-Neugestaltung mit
  Paper-Integration", frisch in main aus PR #55).
- **Endknoten-Sichtkontrolle / Klaus-Sichttest-Erzwingung**
  während dieser Sitzung — Klaus hat den Original-Befund
  2026-05-16 schon dokumentiert geliefert.

---

## Validierung

- **Python-Splitter + `node --check` pro Inline-`<script>`-
  Block** in `tests/manual_check.html`: alle 10 Blöcke grün
  (Längen 1318 / 2962 / 2723 / 3679 / 9292 / 17664 / 17384 /
  23090 / 15498 / 10258 Zeichen). Splitter-Skript ad-hoc
  ausgeführt (regex `<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>`).
- **Cross-Reading** Karte 02 § Bauzustand-Zeile ↔ PULS § „Als
  nächstes" Modul 02 ↔ PULS § Sitzungs-Eintrag ↔ Archiv-Index
  ↔ Übergabeprotokoll konsistent: gleiche Datums-Formate
  (YYYY-MM-DD), gleiche Fix-Beschreibung (Reset jetzt direkt
  vor `importBackup` statt Handler-Anfang), gleiche „Sichttest
  des Fix-Pfads ungeprüft, weil headless gebaut"-Markierung.
- **CLAUDE.md-Pflichten:** deutsche Doku, YYYY-MM-DD-Datum,
  kein `PROTOCOL_VERSION`-Sprung, keine personenbezogenen
  Daten, KEIN Modul-Code-Eingriff (Test-Panel ist nicht
  `src/modules/`), KEIN Vertrags-Eingriff (INTERFACES.md
  unangetastet).
- **Begründungs-Argument:** Das Refactoring ist semantisch
  minimal — nur die Position der `pendingBackup = null`-Zeile
  ändert sich, die Bedingungen drumherum bleiben. Wrong-
  Password-/Schema-Bruch-/Wrapper-Version-Mismatch-Pfade
  bekommen den Reset weiterhin vorgeschoben (jetzt direkt vor
  `importBackup`, dort fängt der try-Block die Errors ab); der
  Unterschied zum vorherigen Verhalten betrifft ausschließlich
  den File-Picker-Cancel-Pfad, in dem der Handler vorher
  unnötig State-mutierend war.

---

## Was offen blieb

- **Sichttest des Fix-Pfads im Browser** ungeprüft, weil
  headless gebaut — wartet auf Klaus' Browser-Lauf. Konkreter
  Test-Pfad (a→e aus Sitzungs-Brief):
  - (a) Knopf 6 „Backup exportieren" → Demo-Backup-Datei
    erzeugen.
  - (b) Knopf 7 klicken, File-Picker öffnet sich, **ABBRECHEN**.
    Erwartung: kein State-Wechsel, Knopf 7b bleibt inert.
  - (c) Knopf 7 erneut klicken, Datei aus (a) wählen, Passwort
    eingeben → `BackupOverwriteError`, Warnzeile mit alter
    nodeId, Knopf 7b wird scharf.
  - (d) Knopf 7 ein drittes Mal klicken UND im File-Picker
    **ABBRECHEN**. Erwartung: `pendingBackup` bleibt gesetzt,
    Knopf 7b bleibt scharf (das ist der Fix — vorher hätte
    dieser dritte Klick den Stash überschrieben).
  - (e) Knopf 7b drücken → `{restored:true}`, neue nodeId
    stimmt mit alter überein.
- **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** mit
  PWA-Suffix (unverändert offen, wartet auf Klaus am Termux).
  Blockiert Cross-Knoten-Handshake.
- **Cross-Knoten-Handshake** zwischen Mein-Rezeptbuch und
  Mein-Mixarium nach Re-Andock.
- **`status.json` `pingStatus`** für beide Endknoten von
  `"blocked-origin-collision"` auf `"live"` nach Cross-Handshake.
- **Voller Panel-06-Test-1–9-Lauf** (Modul 06 Heterokaryose) —
  niedrig priorisiert; ehrlich „rasch grob"-Variante aus
  2026-05-16-Sichttest hat alle Selbstchecks grün gezeigt.
- Übrige offene Punkte (Sushi-Kategorie, INTERFACES.md §6
  Tabellen-Bug, Eruda-Rückbau) unverändert offen.

---

## Nächster sinnvoller Schritt

1. **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** mit
   PWA-Suffix (unverändert offen, wartet auf Klaus am Termux —
   `await SbkimStorage.init({dbSuffix:"mixarium"})` bzw.
   `"rezeptbuch"` vor `SbkimAnastomose.init()` in beiden
   Endknoten-Repos einfügen, `__sbkimErzeugeSpore()` triggern,
   neue spore.json deployen). *Nicht headless.* Blockiert
   Cross-Knoten-Handshake.
2. **Cross-Knoten-Handshake** zwischen Mein-Rezeptbuch und
   Mein-Mixarium nach Re-Andock — setzt Schritt 1 voraus.
   *Nicht headless.*
3. **Klaus' Sichttest des Fix-Pfads** im Browser (Panel 02
   Knopf 7 Test-Pfad a→e oben). Niedrig priorisiert — der
   reale Sichttest-Pfad (einmal klicken, Datei wählen,
   Passwort, BackupOverwriteError, 7b) funktioniert
   weiterhin; der Fix schützt nur den doppelten Klick ohne
   File-Wahl. *Nicht headless.*
4. **Voller Panel-06-Test-1–9-Lauf** mit Klaus (Heterokaryose-
   Sichttest-Vertiefung — Tests 1 passendes Match, 2/3/4
   Reject-Pfade, 5/6 Re-Handshake + forgetHeterokaryosis,
   7/8 listHeterokaryosis, 9 HETERO_MAX_ANCHORS-Begrenzung).
   *Nicht headless* (Tablet, Eruda-Sichtkontrolle). Niedrig
   priorisiert — Grob-Lauf 2026-05-16 hat schon alle
   Selbstchecks grün gezeigt.

---

**Branch:** `claude/fix-test-panel-button-7-Iwf1E`.
**Vorgänger:** Pflege Phase-1 Sichttest-Resultate Karten
02/06/01 (selbiger Tag, Phase-1-Eintrag in PULS dieser Sitzung
durch Mini-Pflege-Eintrag ersetzt, Archiv-Index-Zeile bleibt).
**PR:** Draft-PR mit klarer Beschreibung (Mini-Pflege Test-
Panel-UX, kein Modul-Code-Eingriff, kein Vertrags-Eingriff).
