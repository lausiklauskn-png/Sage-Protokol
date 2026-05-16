# Übergabeprotokoll · 2026-05-16 · Pflege-Sitzung — Persistenz-Strategie verbinden (Stufe 3)

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase. Branch
`claude/pflege-persistenz-strategie-verbinden-shnqf`. Folge-Pflege
direkt zu Bau 02.X Backup-Export vom selben Tag (PR #54 gemerged).
Schließt Stufe (3) der drei-stufigen Identitäts-Persistenz-Architektur
final ab — alle drei Stufen damit gelöst.

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §D
(Pflege-Sitzung, Kurz-Variante).

**Module:** ausschließlich 00 (Doku-Fenster — Code + Karte + Vertrag).
Module 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08 ausdrücklich nicht
angefasst.

---

## Auftrag

Spec und Code für Stufe (1) Storage-Persist und Stufe (2)
Backup-Export waren in `main`. Was fehlte, war nur die **textliche
Verbindung** im Doku-Fenster: eine „Backup empfohlen"-Hinweis-Zeile,
die im Modal erscheint, wenn der Knoten weiß, dass seine Persistenz
wackelt. Konkret: Trigger bei
`SbkimStorage._meta.storagePersisted === false` (Browser hat Stufe (1)
verweigert) ODER `snapshot.quota.warningLevel !== "none"` (Stufe (3)
Quota-Frühwarnung greift, eine der beiden §0-Schwellen
überschritten).

Spec für Stufe (3) existierte seit Spec-Sitzung 00 (2026-05-14,
`DOKU_QUOTA_WARN_RATIO` + `DOKU_QUOTA_WARN_BYTES` in §0 verankert),
Code für die Quota-Frühwarnung war seit Bau 00 (2026-05-14) im Modul.
Fehlte nur die textliche Brücke zu Stufe (2) — ein einziger Satz, der
Klaus an Panel 02 „Backup exportieren" erinnert.

---

## Was getan wurde

### 1. `src/modules/00_doku_fenster.js` (additiv, kein Refactoring)

- **Neue modul-lokale Konstante** `DOKU_BACKUP_TIP_TEXT` mit dem
  deutschsprachigen Hinweis-Text. Unicode-Anführungszeichen `„…"`
  (U+201E / U+201C) statt ASCII-`"`, weil der eingebettete Panel-
  02-Knopf-Name `„Backup exportieren"` sonst das JS-String-Literal
  schließen würde (analog dem Quote-Fix in Bau 02.X für
  `tests/manual_check.html`):

  > Tipp: Speicher-Schutz für diesen Knoten ist nicht bestätigt. Lege
  > ein Backup an (Panel 02, „Backup exportieren" — passwort-
  > verschlüsselte .json-Datei), damit die Identität einen Browser-
  > Wechsel oder ein Aufräumen des Browserspeichers überlebt.

- **`getStatusSnapshot()`** um Feld `storagePersisted: boolean | null`
  erweitert. Fail-soft-Lesen aus `SbkimStorage._meta.storagePersisted`
  via try/catch + `typeof`-Check (Modul 01 nicht geladen / `_meta`
  fehlt / persist warf synchron → `null`). Begründung: `null` und
  `true` triggern nicht (kein Warn-Zustand bei API-Verweigerung —
  fail-soft-Konvention aus Modul 01 erlaubt es ausdrücklich, dass
  persist nicht beantwortbar ist); nur explizites `false` triggert.

- **Neuer Modal-Render-Sub-Block:**
  - Prädikat `isBackupTipActive(snapshot)` (Closure-lokal) prüft
    `snapshot.storagePersisted === false` ODER
    `snapshot.quota && snapshot.quota.warningLevel !== "none"`.
  - `renderBackupTip()` rendert ein `<div class="sbkim-doku-backup-tip">`
    in hell-blauer Hinweis-Farbe
    (`background:#e0f2fe;color:#075985;border:1px solid #7dd3fc`) mit
    dem Text aus `DOKU_BACKUP_TIP_TEXT`. Farb-Wahl bewusst abgegrenzt
    von der bestehenden gelb-bernsteinen Quota-Warnzeile
    (`background:#fff3cd;color:#6b5500`) — beide Zeilen können
    gleichzeitig erscheinen, wenn Stufe (1) verweigert UND Stufe (3)
    greift.
  - Aufruf-Position im `renderWindow(snapshot)` direkt nach dem
    Knoten-Block und der optionalen Quota-Warnzeile, vor dem
    Sichttest-pro-Modul-Block.

- **`_meta`** um zwei neue Felder erweitert:
  - `dokuBackupTipText` (String) — Wortlaut-Zugriff für Test-Brücken.
  - `backupTipActive()` (async Funktion) — Test-Helper, zieht
    frischen Snapshot via `getStatusSnapshot()` und liefert das
    Prädikat-Ergebnis als Boolean. Erlaubt Tests ohne Fenster-Öffnen
    (z.B. „würde die Tipp-Zeile JETZT erscheinen?").

- **Modul-Kopfkommentar** um Pflege-Block „Pflege Persistenz-Strategie
  verbinden (2026-05-16) — Stufe (3)" zwischen Bau-Sitzungs-Kommentar
  und Self-check-Hinweis erweitert.

**Drei Bau-Befunde während der Pflege-Sitzung:**

1. **Quote-Konflikt im JS-String-Literal.** Erster Versuch nutzte
   ASCII-`"` rund um „Backup exportieren". `node --check` warf
   `SyntaxError: Invalid or unexpected token`. Fix: deutsche
   Unicode-Anführungszeichen `„…"` (U+201E / U+201C). Konsistent mit
   dem analogen Fix in `tests/manual_check.html` aus Bau 02.X.
2. **`_meta.backupTipActive`-Form.** Briefing erlaubte Optional. Die
   Wahl fiel auf eine async Closure-Funktion (statt eines sync
   Boolean-Snapshots), weil der Trigger-Zustand vom Storage abhängt
   und der Test-Pfad sowieso `getStatusSnapshot()` braucht. Sync-
   Variante würde einen Closure-State `lastSnapshot` brauchen — das
   ist verfrühte Komplexität ohne Aufrufer-Bedarf.
3. **Snapshot-Feld-Lese-Pfad.** Brief skizzierte
   `global.SbkimStorage && global.SbkimStorage._meta && typeof
   global.SbkimStorage._meta.storagePersisted !== "undefined"`. Im
   Modul liegt ein lokaler `getStorage()`-Helper (Z. 78); die
   Pflege nutzt ihn, damit die Lese-Pfade konsistent bleiben
   (vier Stellen in `getStatusSnapshot()` lesen schon über
   `getStorage()` / `getSpore()` / etc.).

### 2. Karte 00 (`docs/components/00_doku_fenster.md`)

- **§ Datenformate `DokuStatus`** Block: neue Zeile
  `"storagePersisted": true | false | null` mit Pflege-Vermerk;
  anschließender Absatz erklärt die Drei-Werte-Form (Spiegelung
  Modul-01-Getter), die Fail-Soft-Konvention und die Null-/True-
  gleich-Trigger-Regel.
- **Neuer § Modal-Render-Pfad — Backup-Tipp-Zeile** zwischen
  § Datenformate und § 5-Klick-Pfad: vier Punkte (Trigger-Bedingung,
  Wortlaut als Blockquote, Position im Modal, Hinweis-only-Klar­
  stellung mit Aufrufer-Pflicht-Trennung), plus Test-Helper-Verweis
  auf `_meta.backupTipActive()`.
- **§ Konfigurationswerte** modul-lokale Zeile
  `DOKU_BACKUP_TIP_TEXT = "Tipp: Speicher-Schutz …"` ergänzt
  (neben `WINDOW_TITLE_DEFAULT` und `NODE_ID_SHORT_LEN`).
- **§ Risiken** neuer Punkt „Backup-Tipp ist textlich, keine
  Selbstheilung". Klaus muss den Tipp lesen und Panel 02 „Backup
  exportieren" aktiv anklicken; Modul 00 ruft
  `SbkimSpore.exportBackup` nicht automatisch (Aufrufer-Pflicht-
  Trennung; § Verantwortlichkeiten „Macht nicht: Kein Daten-Export"
  als Anker).
- **§ Manueller Test** neuer Punkt 7 „Backup-Tipp-Zeile" mit Drei-
  Setup-Probe: (a) Persist-Trigger via Property-Override-Stub auf
  `_meta.storagePersisted = false`; (b) Quota-Trigger via
  `_setQuotaForTest({usage:8.1*1024**3, quota:10*1024**3})`; (c)
  Negativ-Fall (Stub zurücksetzen + `_clearQuotaForTest()`).
  Test-Helper-Verweis auf `await SbkimDoku._meta.backupTipActive()`.
- **§ Bauzustand** neue Zeile „Pflege Persistenz-Strategie verbinden
  2026-05-16" mit Sichttest-Vermerk „ungeprüft, weil headless
  gebaut — wartet auf Klaus' Browser-Lauf".

### 3. INTERFACES.md §1 Modul 00 + §6

- **Bietet-Block:** unter `options-Form` ein neuer Absatz, der die
  `DokuStatus`-Form als Verweis auf Karte 00 § Datenformate
  formuliert und das neue Feld `storagePersisted: boolean | null`
  mit Spiegelungs-Hinweis und Trigger-Konvention nennt.
- **Nutzt-Block:** neue Zeile `SbkimStorage._meta.storagePersisted`
  (Live-Lesen mit `typeof`-Check, fail-soft; Erklärung der Drei-
  Werte-Form und der Null-/True-gleich-Konvention).
- **Geprüft-Zeile:** „2026-05-14 (Spec-Sitzung 00), 2026-05-16
  (Pflege Persistenz-Strategie verbinden — Stufe 3)".
- **§6 Änderungsprotokoll:** neue Zeile am unteren Ende mit dem
  vollen Bau-Befund (modul-lokale Konstante, Snapshot-Feld, Modal-
  Render-Sub-Block, Test-Helper, Aufrufer-Pflicht-Trennung), den
  bewussten Nicht-Änderungen und der Sichttest-Status-Note.
- **§0 unangetastet** (DOKU_BACKUP_TIP_TEXT ist modul-lokal in
  Karte 00, kein §0-Anker).
- **Storage-Block / Events / Versionierungs-Vertrag / Garantien-
  Block** unverändert.

### 4. PULS

- **§ Offene Querschnitts-Fragen „Identitäts-Persistenz":** Stufe
  (3) mit ~~strikethrough~~ markiert + Verweis aufs Übergabe-
  protokoll; **ganzer Querschnitts-Eintrag** „Identitäts-Persistenz"
  mit ~~strikethrough~~ in der Überschriften-Zeile.
- **§ Spore-Persistenz-Strategie verteilt:** ganzer Querschnitts-
  Eintrag mit ~~strikethrough~~ + Modul-00-Punkt um Pflege-Vermerk
  erweitert (Tipp-Zeile, Snapshot-Feld, Aufrufer-Pflicht-Trennung).
- **Schnellüberblick-Tabelle:** Modul 00 Code-Spalte um
  „Pflege Persistenz-Strategie verbinden 2026-05-16" erweitert;
  Sichttest-Spalte um „ungeprüft (headless)"-Hinweis.
- **§ Sitzungs-Einträge** rotiert: dieser Eintrag oben mit vollem
  Text; Bau-02.X-Backup-Export-Eintrag aus dem Inline-Block entfernt
  (bleibt im Archiv-Index aus PR #54).
- **§ Archiv-Index:** neue Zeile oben (diese Pflege-Sitzung).

### 5. `status.json` — nicht angefasst

Modul 00 bleibt `score:"stub"`, additive Code-Erweiterung, kein
Score-Wechsel. `update_puls_pie.py` NICHT aufgerufen (CLAUDE.md-
Konvention).

### 6. Übergabeprotokoll

Diese Datei.

---

## Was bewusst nicht angefasst wurde

- **`src/modules/01_storage.js`** unverändert. `_meta.storagePersisted`
  ist nur Lese-Ziel; Modul 01 schreibt es selbst nach
  `requestStoragePersist()` (Pflege Storage-Persist 2026-05-16).
- **`src/modules/02_spore.js`** unverändert. `exportBackup` wird im
  Tipp-Text nur erwähnt, nicht aufgerufen. Aufrufer-Pflicht-Trennung
  ist Spec-Wille (Karte 00 § Verantwortlichkeiten „Macht nicht").
- **`src/modules/03_embedding.js` / `04_match.js` / `05_anastomose.js`
  / `06_heterokaryose.js` / `07_apoptose.js` / `08_ui_demo.js`**
  unverändert. Pflege berührt keinen Embedding-/Match-/Handshake-/
  Heterokaryose-/Apoptose-/UI-Demo-Pfad.
- **INTERFACES.md §0** keine neue Konstante (DOKU_BACKUP_TIP_TEXT ist
  modul-lokal).
- **INTERFACES.md §2 / §3 / §4 / §5** unverändert.
- **Spore-Feld-Erweiterung:** keine. `PROTOCOL_VERSION` bleibt
  `"0.1"`.
- **`DB_VERSION`** bleibt `3`. Kein neuer Store, keine DB-Schema-
  Migration. Modul 00 schreibt bei dieser Pflege gar nichts in den
  Storage — nur Lesen aus `sbkim_doku_meta` (wie schon vorher).
- **`BACKUP_FORMAT_VERSION`** bleibt `1`.
- **`tests/manual_check.html`** unverändert. Briefing erlaubte
  optional, dass Panel 00 einen neuen Test-Knopf bekommt; Pflege
  hat entschieden, dies NICHT zu tun, weil das Setup für Test 7
  zwei verschiedene Stubs braucht (Object-Property-Override für
  `storagePersisted`, plus `_setQuotaForTest`-Aufruf), und ein
  einzelner Knopf das nicht sauber kapselt — Klaus' Browser-Lauf
  greift die Test-Brücken direkt aus der Konsole, wie in Karte 00
  § Manueller Test Punkt 7 beschrieben.
- **`docs/components/01_storage.md` / `02_spore.md` / Karten
  03-12 / 14**: alle unverändert.
- **`docs/INTERFACES.md` §1 Modul 01 / 02 / 03 / ...:** alle
  unverändert (Vertrag ist eine Spur tiefer; Pflege berührt nur
  Modul 00).
- **`index.html`** (Sage-Page) unverändert.
- **`status.json`** unverändert; **`update_puls_pie.py`** NICHT
  aufgerufen.
- **Karten 14 / 10 / 11 / 12** unangetastet.
- **Bestehende sechs Funktionen** (`init` / `open` / `close` /
  `isOpen` / `getStatusSnapshot` / `recordSighttest`) unverändert
  bis auf die additive Erweiterung von `getStatusSnapshot()`. Kein
  Refactoring der Render-Helper, keine API-Änderung.

---

## Validierung

- **`node --check src/modules/00_doku_fenster.js`** grün (nach Quote-
  Fix auf Unicode-`„…"`).
- **Mini-Smoke-Test der Trigger-Logik** in einem Node-VM-Kontext mit
  minimalem DOM-Stub (`document.createElement`-Stub +
  `MutationObserver`-Stub + `navigator.storage.estimate`-Stub). Vier
  Fälle alle erwartungsgemäß:

  | # | Setup | Erwartung Tipp aktiv | Resultat |
  |---|---|---|---|
  | A | `storagePersisted: true`, `warningLevel: "none"` | `false` | PASS |
  | B | `storagePersisted: null`, `warningLevel: "none"` | `false` | PASS |
  | C | `storagePersisted: false`, `warningLevel: "none"` | `true`  | PASS |
  | D | `storagePersisted: undefined` (kein _meta-Feld), `warningLevel: "none"` | `false` | PASS |
  | E | `storagePersisted: true`, `warningLevel: "ratio"` | `true`  | PASS |

  Test-Skript war ein einmaliges `/tmp/sbkim_doku_tip_smoke.js`
  (selbst-zerstörend, nicht eingecheckt). Das Modul wurde direkt
  ausgewertet (Selbstcheck-Zeile in der Konsole bestätigt das
  Skript-Laden), das Prädikat zum Vergleich nachgebaut, um die
  Code-Branche exakt zu spiegeln.

- **Cross-Reading** Karte 00 ↔ INTERFACES.md §1 Modul 00 ↔ PULS auf
  Konsistenz durchgezogen:
  - Trigger-Bedingung identisch beschrieben (Karte 00 § Modal-
    Render-Pfad, INTERFACES.md §1 Bietet-Block, PULS Querschnitts-
    Frage Stufe 3, Karte 00 § Bauzustand).
  - Wortlaut der Tipp-Zeile identisch in Karte 00 § Modal-Render-
    Pfad (Blockquote) und Code (modul-lokale Konstante).
  - Aufrufer-Pflicht-Trennung in Karte 00 § Risiken und INTERFACES.md
    §6 Änderungsprotokoll konsistent formuliert.
  - Drei-Werte-Form (`true`/`false`/`null`) und Null-/True-gleich-
    Konvention in allen drei Dokumenten gleich.

- **CLAUDE.md-Vorgaben respektiert:**
  - Pflege-Sitzung schreibt nur in Modul 00 + Karte 00 + INTERFACES.md
    §1 Modul 00 + §6 + PULS + Übergabeprotokoll.
  - INTERFACES.md zuerst nachgezogen (Bietet/Nutzt/Geprüft/§6),
    Code zieht nach — heilige Tafeln bleiben oben.
  - `update_puls_pie.py` nicht aufgerufen (kein Score-Wechsel).
  - Keine personenbezogenen Daten in Code / Karte / Tests / PULS.
  - Antworten auf Deutsch, ruhig + präzise.

---

## Sichttest-Status

**Ungeprüft, weil headless gebaut — wartet auf Klaus' Browser-Lauf.**

Klaus' echter Sichttest in seinem Browser braucht zwei Mini-Setups
plus einen Negativ-Lauf (Karte 00 § Manueller Test Punkt 7):

**Test 7a · Persist-Trigger:**

```js
// Vor SbkimDoku.init(...) — oder nach init, sobald SbkimStorage geladen ist:
Object.defineProperty(SbkimStorage._meta, "storagePersisted", {
  get: () => false,
  configurable: true,
});
// Fenster öffnen (5-Klick-Geste oder Panel-Knopf "5 Klicks simulieren")
```

Erwartung: zwischen Knoten-Block und Sichttest-pro-Modul-Block
erscheint die hell-blaue Tipp-Zeile mit `DOKU_BACKUP_TIP_TEXT`.
Quota-Warnung erscheint NICHT (Default-Quota auf Klaus' Tablet
liegt weit unter den §0-Schwellen).

**Test 7b · Quota-Trigger:**

```js
SbkimDoku._setQuotaForTest({ usage: 8.1 * 1024 ** 3, quota: 10 * 1024 ** 3 });
// Persist-Stub aus 7a ggf. mit `delete SbkimStorage._meta.storagePersisted` zurücksetzen
// oder eine zweite Property-Override mit `get: () => true` legen.
// Fenster schließen + neu öffnen
```

Erwartung: BEIDE Zeilen erscheinen — oben gelb-bernsteine
Quota-Warnung („Speicher knapp · 80%-Schwelle (81.0% belegt)"),
darunter die hell-blaue Backup-Tipp-Zeile.

**Test 7c · Negativ-Fall:**

```js
SbkimDoku._clearQuotaForTest();
// storagePersisted-Stub auch zurücksetzen
// Fenster schließen + neu öffnen
```

Erwartung: keine Tipp-Zeile, keine Quota-Warnung. Modal nur mit den
üblichen Sektionen.

**Test-Helper ohne Fenster-Öffnen:**

```js
await SbkimDoku._meta.backupTipActive();
// liefert true in 7a und 7b, false in 7c.
```

Klaus' Sichttest-Lauf zeigt drei Befunde:

1. Erscheint die Tipp-Zeile in 7a + 7b an der richtigen Stelle und in
   der richtigen Farbe?
2. Sind beide Zeilen in 7b lesbar nebeneinander (Reihenfolge:
   Quota-Warn oben, Backup-Tipp darunter)?
3. Bleibt das Fenster in 7c sauber (keine versehentlichen Trigger
   durch Test-Brücken-Reste)?

Ergebnis kommt in Karte 00 § Bauzustand Zeile „Pflege Persistenz-
Strategie verbinden" (Sichttest-Spalte).

---

## Was offen blieb

### Klaus' Sichttest Panel 00 Test 7

Drei-Setup-Probe oben. Wartet auf Klaus, ist aber **nicht
blockierend** — der Knoten läuft auch ungetestet. Bei grünem Lauf:
Karten 00 § Bauzustand-Zeile auf „geprüft <Datum>" stellen.

### Klaus' Sichttest Panel 02 Knöpfe 6/7/7b (Bau 02.X)

Unverändert offen. Plattform-spezifische Antwort (PBKDF2-600 000-
Aufruf-Zeit auf Galaxy Tab S6, AES-GCM-Verhalten in Safari iOS)
bringt erst Klaus' Browser-Lauf.

### Übrige offene Punkte aus Bau 02.X

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

1. **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** mit
   PWA-Suffix aus Pflege 2026-05-16 — *nicht headless*, wartet auf
   Klaus am Termux. Schätzaufwand: ~30 Min für beide Endknoten
   zusammen.
2. **Cross-Knoten-Handshake** nach Re-Andock (Karte 09 Schritt 8).
3. **Klaus' Sichttest Panel 02 + Panel 00 in einem Lauf** — Panel 02
   Knöpfe 6/7/7b (Backup-Export), Panel 00 Test 7 Drei-Setup-Probe
   (Backup-Tipp-Zeile). Bei grünen Läufen: § Bauzustand-Zeilen in
   Karten 02 + 00 auf „geprüft <Datum>" stellen.
4. **`status.json` `pingStatus`-Update** + Folge-Pflege-Sitzung
   nach Re-Andock und erstem Cross-Handshake.

---

## Material aus der Sitzung

**Patch-Übersicht `src/modules/00_doku_fenster.js`:**

```diff
+ // Pflege Persistenz-Strategie verbinden (2026-05-16) — Stufe (3) ...
+ var DOKU_BACKUP_TIP_TEXT =
+   "Tipp: Speicher-Schutz für diesen Knoten ist nicht bestätigt. Lege ein " +
+   "Backup an (Panel 02, „Backup exportieren" — " +
+   "passwort-verschlüsselte .json-Datei), damit die Identität einen " +
+   "Browser-Wechsel oder ein Aufräumen des Browserspeichers überlebt.";

  // in getStatusSnapshot():
+ var storagePersisted = null;
+ try {
+   var stor = getStorage();
+   if (stor && stor._meta &&
+       typeof stor._meta.storagePersisted !== "undefined") {
+     storagePersisted = stor._meta.storagePersisted;
+   }
+ } catch (err) { storagePersisted = null; }

  return {
    …
+   storagePersisted: storagePersisted,
    …
  };

  // in renderWindow():
+ if (isBackupTipActive(snapshot)) {
+   box.appendChild(renderBackupTip());
+ }

+ function isBackupTipActive(snapshot) {
+   if (!snapshot) return false;
+   var persistFalse = snapshot.storagePersisted === false;
+   var quotaWarn = !!(snapshot.quota && snapshot.quota.warningLevel !== "none");
+   return persistFalse || quotaWarn;
+ }

+ function renderBackupTip() {
+   return el("div", {
+     "class": "sbkim-doku-backup-tip",
+     "style": "background:#e0f2fe;color:#075985;border:1px solid #7dd3fc;" +
+              "border-radius:4px;padding:0.4rem 0.6rem;margin-bottom:0.6rem;font-size:0.9rem;",
+     "text": DOKU_BACKUP_TIP_TEXT,
+   });
+ }

  // _meta:
+ dokuBackupTipText: DOKU_BACKUP_TIP_TEXT,
+ backupTipActive: function () {
+   return getStatusSnapshot().then(isBackupTipActive);
+ },
```

**Bau-Statistik:**

- `src/modules/00_doku_fenster.js`: 1039 Zeilen → ~1090 Zeilen.
  Additive Erweiterung: eine modul-lokale Konstante, ein Snapshot-
  Feld, zwei Render-Helper, ein Render-Aufruf, zwei `_meta`-
  Einträge.
- `docs/components/00_doku_fenster.md`: § Datenformate-Zeile + Absatz,
  neuer § Modal-Render-Pfad-Block (~50 Zeilen), § Konfigurationswerte-
  Zeile, § Risiken neuer Punkt, § Manueller Test Punkt 7,
  § Bauzustand-Zeile.
- `docs/INTERFACES.md` §1 Modul 00: neuer Absatz im Bietet-Block,
  neue Zeile im Nutzt-Block, erweiterte Geprüft-Zeile.
- `docs/INTERFACES.md` §6: neue Zeile am unteren Ende.
- `docs/PULS.md`: Querschnitts-Frage „Identitäts-Persistenz" ganz
  mit ~~strikethrough~~ (alle drei Stufen), „Spore-Persistenz-
  Strategie verteilt" ganz mit ~~strikethrough~~, Modul-01- und
  Modul-00-Punkte um Pflege-Vermerk erweitert, Schnellüberblick
  Modul 00 Code+Sichttest-Spalten erweitert, § Sitzungs-Einträge
  rotiert, § Archiv-Index neue Zeile oben.

**Validierungs-Ergebnisse:**

- `node --check src/modules/00_doku_fenster.js`: OK (nach Quote-Fix).
- Mini-Smoke-Test (5 Fälle): alle PASS.
- Cross-Reading Karte 00 ↔ INTERFACES.md §1/§6 ↔ PULS: konsistent.

**Beobachtung zur Modul-00-Code-Form:** Der bestehende Code nutzt
`var` durchgängig, Funktionen sind `function`-deklariert, async
nur wo nötig (`init`/`open`/`getStatusSnapshot`/`recordSighttest`).
Die Pflege-Sitzung hat diese Konvention strikt übernommen — keine
`let`/`const` im neuen Code, keine Arrow-Funktionen in der Render-
Pfad-Erweiterung; nur in `_meta.backupTipActive` ist eine
Promise-Kette mit `.then(isBackupTipActive)` — das passt zur Form
der Closure-Helper. Konsistenz mit den bestehenden sechs Funktionen
und den vorhandenen Render-Helfern war wichtiger als ES2015-
Eleganz.

**Commit dieser Sitzung:** TBD (folgt am Sitzungs-Ende).

**Branch:** `claude/pflege-persistenz-strategie-verbinden-shnqf`.

**PR:** wird am Sitzungs-Ende als Draft erstellt.
