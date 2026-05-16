# Übergabeprotokoll · 2026-05-16 · Pflege-Sitzung — Karten 01 + 09 PWA-Suffix

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase. Branch
`claude/pflege-pwa-suffix-EDj8D`. Folge-Pflege direkt nach der
Live-Andock-Sitzung 2026-05-16 (Mein-Mixarium + Mein-Rezeptbuch live
SBKIM-integriert, aber identische `nodeId` wegen IndexedDB-Origin-
Kollision auf GitHub-Pages-Project-Sites — siehe Übergabeprotokoll
`2026-05-16_andock-mein-rezeptbuch-iteration-3-live.md`,
§ ARCHITEKTUR-LÜCKE).

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C
(Pflege-Sitzung).

**Module:** 01 (Storage — Code + Karte + Vertrag) und 09 (Einbau-PWA —
Karte). Modul 02 / 05 ausdrücklich nicht angefasst.

---

## Auftrag

Variante (a) aus dem Andock-Übergabeprotokoll umsetzen: **PWA-Suffix in
Modul 01 DB-Name**, additiv und ohne Hauptversions-Sprung. Beide
Endknoten teilen Origin `lausiklauskn-png.github.io` und damit die
Default-DB `sbkim`; mit Suffix können sie eigene, getrennte
Identitäten bekommen, ohne dass Modul 02 angefasst werden muss
(`IDENTITY_KEY = "main"` bleibt — Singleton-Schlüssel ist DB-lokal).

Ziel: nach dieser Sitzung kann Klaus in `sbkim-init.js` beider
Endknoten-Repos einen Zwei-Aufruf-Pfad einbauen
(`SbkimStorage.init({dbSuffix})` zuerst, dann `SbkimAnastomose.init()`)
und durch erneuten `__sbkimErzeugeSpore()`-Trigger getrennte
nodeIds pro PWA bekommen.

---

## Was getan wurde

### 1. `src/modules/01_storage.js` — Code-Patch

`init()` umgebaut auf `init(options)` mit optionalem
`options.dbSuffix: string`:

- **Pattern-Validierung** `^[a-z0-9_-]+$` (Kleinbuchstaben, Ziffern,
  `_`, `-`). Bei Verstoß: **synchroner** Wurf von
  `InvalidDbSuffixError` VOR dem Promise-Aufbau — sonst verschluckt
  das Promise einen Programmier-Fehler bis zur ersten
  `await`-Auswertung.
- **Effektiver DB-Name:** ohne Suffix bleibt der Default `sbkim`
  (rückwärtskompatibel — Sage-Werkstatt und alle bestehenden Klaus-
  PWAs ohne Suffix-Konfig laufen unverändert weiter); mit Suffix
  öffnet Modul 01 die DB unter `sbkim_<dbSuffix>` (z.B.
  `sbkim_mixarium`).
- **Idempotenz erweitert:** zweiter `init()`-Aufruf mit EXPLIZIT
  abweichendem Suffix wirft `InvalidDbSuffixError` (kein stilles
  Ignorieren). Zweiter Aufruf OHNE Optionen (Standard-Pfad in Modul
  05/06/07/00, die `Storage.init()` intern selbst nachziehen)
  benutzt weiter den zuerst gesetzten DB-Namen — der Konflikt-Check
  feuert nur bei explizit gesetztem, abweichendem `options.dbSuffix`.
- **Neue Konstanten** `DB_NAME_DEFAULT = "sbkim"` und
  `DB_SUFFIX_PATTERN = /^[a-z0-9_-]+$/`.
- **`_meta.dbName`** umgestellt von Build-Konstante auf **Getter**
  (zeigt Live-Zustand `dbNameInUse`). `_meta.dbNameDefault` ist neu
  und konstant.

### 1.1 Idempotenz-Bug erkannt + behoben (selbiger Commit)

Erster Implementierungs-Wurf hatte einen kritischen Bug: der
Konflikt-Check verglich `requestedName` (Default `"sbkim"` bei einem
init-Aufruf ohne Optionen) mit `dbNameInUse` (gesetzt auf
`"sbkim_<dbSuffix>"` durch ersten Aufruf). Folge: nach
`SbkimStorage.init({dbSuffix:"mixarium"})` hätte der interne
`SbkimStorage.init()`-Aufruf in `SbkimAnastomose.init()`
fälschlich `InvalidDbSuffixError` geworfen — und damit den gesamten
Andock-Pfad blockiert.

Fix: Konflikt-Check feuert NUR, wenn `options.dbSuffix` EXPLIZIT
gesetzt UND abweichend ist. Neue Variable `explicitSuffix`
(null = keine Option mitgegeben, sonst der `SBKIM_STORE_PREFIX +
suffix`-String). Smoke-Test 3 (siehe Validierung unten) deckt den
Pfad ab.

### 2. Karte 01 (`docs/components/01_storage.md`)

- § Schnittstelle: `init()` → `init(options?)`; Doc-Block zu
  options-Form, Pattern, ERSTEM init-Aufruf, Rückwärtskompatibilität.
- **Neuer Sub-Block § DB-Namen-Konvention (PWA-Suffix)** zwischen
  § Schnittstelle und § Stores (vor der Stores-Tabelle): drei-Zeilen-
  Beispieltabelle (Default → `sbkim`, `mixarium` → `sbkim_mixarium`,
  `rezeptbuch` → `sbkim_rezeptbuch`); vier Konventions-Punkte
  (Aufrufer-Pflicht, Pattern-Validierung sync, Suffix beim ERSTEN
  init-Aufruf, Modul 02 unangetastet).
- § Konfigurationswerte: `DB_NAME` → `DB_NAME_DEFAULT`, neue
  Konstante `DB_SUFFIX_PATTERN`. Erläuterungs-Absatz unter dem
  Code-Block.
- § Fehlerverhalten: zwei neue Zeilen oben in der Tabelle
  (`InvalidDbSuffixError` synchron bei ungültigem Suffix, async bei
  zweitem init mit abweichendem Suffix).
- § Bauzustand: neue Zeile „Pflege PWA-Suffix" mit Beschreibung der
  Code- und Karten-Änderungen.

### 3. Karte 09 (`docs/components/09_einbau_pwa.md`)

- **§ Vor dem Einbau zu klärende Werte:** neue Zeile `<DB_SUFFIX>`
  (Pattern `^[a-z0-9_-]+$`, Beispiele: Rezeptbuch `rezeptbuch`,
  Mixarium `mixarium`). Erklärungs-Absatz direkt unter der Tabelle
  zur IndexedDB-Origin-Kollision und zur Default-Variante (ohne
  Suffix, eine PWA pro Origin).
- **§ Schritt 4** umbenannt von „`SbkimAnastomose.init()`" auf
  „`SbkimStorage.init({dbSuffix})` + `SbkimAnastomose.init()`":
  Code-Block mit ZWEI sequenziellen `await`-Aufrufen
  (`SbkimStorage.init({dbSuffix:"<DB_SUFFIX>"})` zuerst, dann
  `SbkimAnastomose.init()`). Erklärungs-Absatz „Warum zwei Aufrufe
  statt einem?" (Modul 01 ist die einzige DB-Namen-Quelle; Storage
  muss ZUERST mit Suffix, dann Anastomose-Init nutzt idempotent
  dasselbe `dbPromise`). Sichtkontrolle aktualisiert
  (`sbkim_<DB_SUFFIX>` statt `sbkim`). „Häufiger Fehler"-Block um
  `InvalidDbSuffixError` ergänzt.
- § Bauzustand: neue Zeile „Pflege PWA-Suffix".

### 4. INTERFACES.md §1 Modul 01 + §6

- **§1 Modul 01 init-Signatur** auf `init(options?)` erweitert;
  options-Form (dbSuffix, Pattern, ERSTER init-Aufruf,
  Rückwärtskompatibilität) ausführlich dokumentiert.
- **§1 Modul 01 Storage / DB-Name:** Zeile auf „`sbkim` (Default,
  ohne dbSuffix); `sbkim_<dbSuffix>` wenn `init({dbSuffix})` gesetzt"
  umgestellt.
- **§1 Modul 01 Fehlerverhalten:** zwei neue Zeilen ergänzt
  (`InvalidDbSuffixError` synchron bei ungültigem Suffix, async bei
  zweitem init mit abweichendem Suffix).
- **§1 Modul 01 Geprüft-Zeile:** um 2026-05-16 erweitert.
- **§6 Änderungsprotokoll:** neue Zeile am unteren Ende
  (Konventions-Stil, neueste unten).

### 5. PULS

- **§ Empfehlung Hauptsitzung** umformuliert auf „Klaus' Re-Andock
  beider Endknoten mit PWA-Suffix" mit vier-Punkte-Liste der
  Endknoten-Schritte.
- **§ Offene Querschnitts-Fragen:** „IndexedDB-Origin-Kollision bei
  GitHub-Pages-Project-Sites" mit `~~strikethrough~~` als gelöst
  markiert + Verweis auf dieses Übergabeprotokoll. Variante (b)
  (eigene Subdomain mit Custom Domain) bleibt als langfristige
  Option dokumentiert.
- **§ Sitzungs-Einträge** rotiert: dieser Eintrag ausführlich oben,
  Bau Mein-Rezeptbuch ist auf Position 2, Mein-Mixarium-Eintrag und
  Spec-Stamm/Gast-Eintrag aus den inline-Einträgen entfernt (beide
  waren ohnehin schon im Archiv-Index, kein Verlust).
- **§ Archiv-Index:** zwei neue Zeilen oben (diese Pflege-Sitzung,
  Mein-Rezeptbuch-Andock); Mein-Mixarium-Andock-Zeile unverändert.

### 6. Übergabeprotokoll

Diese Datei.

---

## Was bewusst nicht angefasst wurde

- **`src/modules/02_spore.js`** unverändert. `IDENTITY_KEY = "main"`
  bleibt — durch den umbenannten DB-Namen ist die Identität jetzt
  PWA-spezifisch, ohne dass Modul 02 davon weiß. Karte 02 + §1
  Modul 02 in INTERFACES.md unangetastet.
- **`src/modules/05_anastomose.js`** unverändert.
  `SbkimAnastomose.init()` weiterhin ohne Optionen — Idempotenz von
  `Storage.init` macht den zwei-Aufruf-Pfad im Andocker sauber
  (Storage zuerst mit Suffix, dann Anastomose-Init ruft
  `Storage.init()` intern nach und bekommt dasselbe `dbPromise`).
  Keine Vertrags-Ausweitung in INTERFACES.md §1 Modul 05.

  **Bewusste Abweichung vom Briefing:** der Sitzungs-Brief sagte
  „§ Schritt 4: `SbkimAnastomose.init({ dbSuffix: "<DB_SUFFIX>" })`
  statt `init()`". Das hätte erfordert, dass Modul 05's init-Signatur
  um einen options-Parameter erweitert wird — und mit ihm Modul
  06/07's `init()`-Pfade. Der Brief listete Modul 05 / 06 / 07 aber
  nicht in den explizit erlaubten Code-Eingriffen; nur Modul 01
  sollte gepatcht werden. Stattdessen wurde der `Storage.init`-direkt-
  Pfad als ZWEITER `await` VOR `SbkimAnastomose.init()` dokumentiert
  — gleicher Effekt, kein Modul-05-Eingriff. Falls Klaus eine
  Folge-Pflege „Modul 05 init({dbSuffix})-Forward" möchte, ist das
  eine eigene kleine Sitzung.

- **Modul 00 / 03 / 04 / 06 / 07 / 08 Code** unverändert.
- **Karte 02** unverändert (Vertrag nicht erweitert).
- **`tests/manual_check.html`** unverändert. Der optionale
  „DB mit Suffix öffnen"-Test-Knopf wurde bewusst weggelassen:
  Panel 01 „Storage init" ist idempotent (zweiter Klick gibt dasselbe
  `dbPromise` zurück); ein zweiter Test-Knopf mit abweichendem Suffix
  würde nach einem normalen Setup-Lauf `InvalidDbSuffixError` werfen
  und das Panel durcheinanderbringen. Wer den Suffix-Pfad sichten
  will, testet ihn in einer Endknoten-PWA (Karte 09 Schritt 4) — das
  ist die echte Bühne. Klaus' Re-Andock-Sitzung ist effektiv der
  Sichttest.
- **`status.json`** unverändert. Klaus' Re-Andock danach erzeugt
  frische nodeIds — `pingStatus`, `nodeId` und `sporeUrl` werden in
  einer Folge-Sitzung aktualisiert, sobald beide Endknoten neue
  Spore-Files unter ihren Pages-URLs deployed haben.
- **`update_puls_pie.py`** nicht aufgerufen (kein Modul-Score-
  Wechsel; Modul 01 bleibt Code-Stub, Pie-Inhalt unverändert).
- **`index.html`** (Sage-Page) unverändert.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.
- **`DB_VERSION`** bleibt `3` (keine Schema-Änderung; nur DB-Name-
  Änderung).

---

## Validierung

- **`node --check src/modules/01_storage.js`** grün.
- **Smoke-Test des `init(options)`-Pfads** in Node mit stub-
  `indexedDB.open`-Promise — sieben Fälle alle grün:

  | # | Eingabe | Erwartung | Resultat |
  |---|---|---|---|
  | 1 | `init()` | `dbName === "sbkim"` | PASS |
  | 2 | `init({dbSuffix:"mixarium"})` | `dbName === "sbkim_mixarium"` | PASS |
  | 3 | `init({dbSuffix:"rezeptbuch"})` → `init()` (no opts) | kein Wurf, `dbName` bleibt `"sbkim_rezeptbuch"` | PASS (kritischer Idempotenz-Pfad — siehe Bug-Fix oben) |
  | 4 | `init({dbSuffix:"mixarium"})` → `init({dbSuffix:"rezeptbuch"})` | rejects `InvalidDbSuffixError` | PASS |
  | 5 | `init({dbSuffix:"BAD"})` | **synchroner** `InvalidDbSuffixError` (Großbuchstabe) | PASS |
  | 6 | `init({dbSuffix:""})` | **synchroner** `InvalidDbSuffixError` (leerer String) | PASS |
  | 7 | `init({dbSuffix: null})` | behandelt wie keine Optionen, `dbName === "sbkim"` | PASS |

  Test-Quelle: `/tmp/sbkim_storage_test.js` (nicht ins Repo
  eingecheckt; Stub-`indexedDB.open` resolved den open-Request via
  `Promise.resolve().then(onsuccess)` und liefert ein `request`-
  Objekt mit `result.name = name`).

- **Karten 01 + 09 Cross-Reading** durchgezogen: drei Beispielwerte
  (`mixarium`, `rezeptbuch`, Default ohne Suffix) konsistent in
  beiden Karten und in INTERFACES.md §1 Modul 01; alle drei
  Doc-Verweise auf §1 Modul 01 stimmig.

---

## Was offen blieb

### Klaus' Re-Andock beider Endknoten (HÖCHSTE PRIORITÄT, NICHT HEADLESS)

Pflege-Sitzung hat den Sage-Protokol-Seitigen Teil abgeschlossen.
Klaus muss in den **externen** Endknoten-Repos zwei Eingriffe machen:

1. In **`Mein-Mixarium/sbkim/sbkim-init.js`** vor dem bestehenden
   `await SbkimAnastomose.init()` einfügen:
   ```js
   await SbkimStorage.init({ dbSuffix: "mixarium" });
   ```
2. Analog in **`Mein-Rezeptbuch/sbkim/sbkim-init.js`**:
   ```js
   await SbkimStorage.init({ dbSuffix: "rezeptbuch" });
   ```
3. In beiden Endknoten-Repos die aktualisierten **Modul-Files**
   ziehen (`cp ~/Sage-Protokol/src/modules/01_storage.js
   ~/Mein-Mixarium/sbkim/` bzw. `~/Mein-Rezeptbuch/sbkim/`) — nur
   Modul 01 muss neu kopiert werden, da nur dieses geändert ist.
4. App jeweils vom Home-Screen deinstallieren + neu via URL aufrufen
   (frisch installierter Service-Worker).
5. In **beiden** Eruda-Konsolen `__sbkimErzeugeSpore()` erneut
   triggern → neue, getrennte nodeIds pro PWA.
6. Neue `spore.json` jeweils nach `~/<Endknoten>/sbkim/spore.json`
   verschieben + Commit + Push (überschreibt die alte Pages-Spore
   mit der jetzt verfälschten gemeinsamen nodeId).

Erwartetes Resultat: beide Pages-Spore-Files haben jetzt
**unterschiedliche** `id`-Werte und **unterschiedliche** `publicKey.x`-
Werte. DevTools → Application → IndexedDB zeigt in beiden Tabs eine
neue DB mit Namen `sbkim_mixarium` bzw. `sbkim_rezeptbuch`. Die alte
DB `sbkim` ist verwaist und kann später per `indexedDB.deleteDatabase`
manuell gelöscht werden (gehört aber nicht zur Pflege-Sitzung).

### `status.json`-Folge-Sitzung nach Re-Andock

Sobald Klaus die zwei Re-Andock-Schritte abgeschlossen hat, kann eine
Folge-Sitzung (headless möglich):

- `status.json` `endknoten[Mein-Mixarium].nodeId` + `sporeUrl`-Hash
  + `pingStatus` aktualisieren (`"blocked-origin-collision"` → erst
  `"pending-peer"`, dann nach erstem erfolgreichen Cross-Handshake
  `"live"`).
- Analog `endknoten[Mein-Rezeptbuch]`.
- PULS § Endknoten-Tabelle beide Zeilen nachziehen (neue nodeIds, neue
  Pages-Stand-Anmerkung).

### Cross-Knoten-Handshake (Karte 09 Schritt 8)

Nach Re-Andock möglich.
`SbkimAnastomose.handshake(peerSpore, peerEndpoint)` von Mixarium
gegen Rezeptbuch-Spore-URL und umgekehrt. Bei Erfolg
`sbkim_siblings[peerNodeId]` befüllt + `status.json` Endknoten[*]
.pingStatus auf `"live"`.

### Eruda-Rückbau

Nach erstem erfolgreichen Cross-Knoten-Handshake. Zwei Zeilen aus
beiden `index.html` raus, ein `sed`-Befehl pro Repo.

### Optionale Folge-Pflege „Modul 05 init({dbSuffix})-Forward"

Falls Klaus den Andock-Pfad in Karte 09 Schritt 4 als EINEN Aufruf
sehen möchte (`SbkimAnastomose.init({dbSuffix})`), wäre eine kleine
Folge-Pflege-Sitzung möglich, die Modul 05's `init`-Signatur um einen
options-Parameter erweitert und den `dbSuffix` an
`SbkimStorage.init` durchreicht. Aufwand: ~10 Min headless. Aber:
**nicht nötig** für den Re-Andock — der Zwei-Aufruf-Pfad funktioniert,
ist explizit, und macht die DB-Namen-Wahl im Andocker-Code sichtbar.

### Mini-Pflege „Sushi-Kategorie sichtbar machen" in Mein-Mixarium

Entkoppelt. Klaus' Wahl.

### Mini-Pflege INTERFACES.md §6 Tabellen-Bug

Aus PR #45 Squash-Merge. Niedrige Dringlichkeit.

### Klaus' Sichttest Panel 06 (Heterokaryose)

Weiterhin offen aus früheren Sitzungen.

---

## Nächster sinnvoller Schritt

1. **Klaus' Re-Andock Mein-Mixarium + Mein-Rezeptbuch** —
   *nicht headless*. Sechs-Punkte-Schritt aus § Was offen blieb oben.
   Schätzaufwand: ~30 Min für beide Endknoten zusammen.
2. **`status.json`-Folge-Sitzung** nach Re-Andock —
   *headless möglich*. ~15 Min.
3. **Cross-Knoten-Handshake** zwischen beiden Endknoten —
   *nicht headless*, mit Klaus am Tablet.
4. **Eruda-Rückbau** in beiden Endknoten — *nicht headless*, ein
   `sed`-Befehl pro Repo.

---

## Material aus der Sitzung

**Patch-Übersicht `src/modules/01_storage.js`:**

```diff
- var DB_NAME = "sbkim";
- var DB_VERSION = 3;
- var SBKIM_STORE_PREFIX = "sbkim_";
+ var DB_NAME_DEFAULT = "sbkim";
+ var DB_VERSION = 3;
+ var SBKIM_STORE_PREFIX = "sbkim_";
+ var DB_SUFFIX_PATTERN = /^[a-z0-9_-]+$/;

  var dbPromise = null;
+ var dbNameInUse = DB_NAME_DEFAULT;

- function init() {
+ function init(options) {
+   var explicitSuffix = null;
+   if (options && options.dbSuffix !== undefined && options.dbSuffix !== null) {
+     var suffix = options.dbSuffix;
+     if (typeof suffix !== "string" || !DB_SUFFIX_PATTERN.test(suffix)) {
+       throw makeError("InvalidDbSuffixError", ...);
+     }
+     explicitSuffix = SBKIM_STORE_PREFIX + suffix;
+   }
+   if (dbPromise) {
+     if (explicitSuffix !== null && explicitSuffix !== dbNameInUse) {
+       return Promise.reject(makeError("InvalidDbSuffixError", ...));
+     }
+     return dbPromise;
+   }
-   if (dbPromise) return dbPromise;
+   dbNameInUse = explicitSuffix !== null ? explicitSuffix : DB_NAME_DEFAULT;
    dbPromise = new Promise(...);
    ...
-     req = indexedDB.open(DB_NAME, DB_VERSION);
+     req = indexedDB.open(dbNameInUse, DB_VERSION);
    ...
  }
```

**`_meta`-Block:**

```diff
  _meta: {
-   dbName: DB_NAME,
+   get dbName() { return dbNameInUse; },
+   dbNameDefault: DB_NAME_DEFAULT,
    dbVersion: DB_VERSION,
    storePrefix: SBKIM_STORE_PREFIX,
    knownStores: KNOWN_STORES.slice(),
  },
```

**Commit dieser Sitzung:** TBD (folgt am Sitzungs-Ende).

**Branch:** `claude/pflege-pwa-suffix-EDj8D`.

**PR:** wird am Sitzungs-Ende als Draft erstellt.
