# Übergabeprotokoll · 2026-05-14 · Bau-Sitzung Modul 00 Doku-Fenster

**Sitzungs-Rolle:** Bau-Sitzung (eine Sitzung, eine Phase). Code-Stub für
Modul 00; Karte 00 bleibt inhaltlich auf Spec, nur Bauzustand-Block und
Hero-Badge ziehen nach. INTERFACES.md §1 Modul 00 bleibt auf
`entwurf` (Spec-Vertrag unverändert); §6 bekommt eine
Änderungsprotokoll-Zeile.
**Branch:** `claude/bau-00-doku-fenster-xYRua`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und an
das Übergabeprotokoll der Bau-Sitzung 07 (2026-05-14).
**Modul:** 00_doku_fenster

---

## Auftrag

Eine Phase (Bau), keine Spec-Drift, drei Bau-Pflichtfragen:

1. **`src/modules/00_doku_fenster.js` schreiben.** IIFE-Muster wie
   01/02/04/05/07, `window.SbkimDoku` als Namespace. Sechs öffentliche
   Funktionen, vier Error-Klassen, fünf Test-Brücken,
   synchroner Selbstcheck beim Skript-Laden.
2. **Panel 00 in `tests/manual_check.html` verdrahten.** Hero-Badge
   anheben, sechs Knöpfe, sichtbares Fake-Such-Symbol als Klick-Anker.
3. **Karte 00 Bauzustand + Hero-Badge auf Code-Stub** ziehen.
4. **INTERFACES.md §6** Änderungsprotokoll-Zeile am unteren Ende.
5. **Drei Bau-Pflichtfragen verbindlich entscheiden** (Render-Stil,
   späte DOM-Mount-Strategie, Panel-00-Test-Pragmatismus).
6. **`status.json` Modul 00** von `spec` auf `stub`; Pie regenerieren
   (Spec fertig 2→1, Code-Stub 6→7).
7. **Sitzungs-Abschluss:** PULS, Übergabeprotokoll (diese Datei),
   WEGWEISER-Stand-Block-Zeile.

---

## Was getan wurde

### 1. `src/modules/00_doku_fenster.js` geschrieben

~750 Zeilen, Stil exakt nach Modul 07 (IIFE, `(function (global) {…})
(typeof window !== "undefined" ? window : globalThis)`):

- **Öffentliche API** (auf `window.SbkimDoku`):
  - `init(options) → Promise<void>` — prüft `searchIconSelector` +
    `SbkimStorage`, ruft `SbkimStorage.init()`, schreibt einmalig
    `sbkim_doku_meta["meta"]`, registriert globalen Esc-Listener,
    mountet Click-Listener am Such-Symbol (oder per MutationObserver,
    siehe Frage 2).
  - `open() → Promise<void>` — idempotent; baut Snapshot via
    `getStatusSnapshot()`, aktualisiert `sbkim_doku_meta["meta"].
    lastOpenedAt` (Storage-Fehler hier → `StorageQuotaError` mit
    `.cause`, Fenster öffnet sich dann **nicht**), rendert Modal.
  - `close() → void` — synchron, idempotent, entfernt Backdrop-DOM,
    setzt Klickzähler + Reveal-Timer zurück.
  - `isOpen() → boolean` — synchron.
  - `getStatusSnapshot() → Promise<DokuStatus>` — fail-soft pro
    Lese-Quelle; jeder Throw einer optionalen Quelle landet als
    `{source, reason}` in `errors[]`. Pflicht-Quelle
    `sbkim_doku_meta` wird durchgereicht.
  - `recordSighttest(moduleId, result) → Promise<void>` —
    sync-prüft `result ∈ {"ok","fail"}` und `moduleId` nicht-leer;
    schreibt `sbkim_doku_meta[moduleId]`.
- **Vier Error-Klassen** auf `SbkimDoku.<Error>` exportiert für
  `instanceof`-/`name`-Checks:
  - `InvalidDokuOptionsError` — `searchIconSelector` fehlt/leer.
  - `DokuDependenciesError` — `SbkimStorage` fehlt auf `window`
    oder `init()` wurde übersprungen.
  - `InvalidSighttestResultError` — `result` nicht `"ok"`/`"fail"`
    oder `moduleId` leer.
  - `StorageQuotaError` — Sammel-Klasse mit `.cause` (analog
    Modul 07's `LegacyTimeoutError`/`LegacyNetworkError`-Muster),
    wenn `SbkimStorage.put` beim `lastOpenedAt`-Schreib wirft.
- **Fünf Test-Brücken** (Unterstrich-Präfix, exportiert auf
  `SbkimDoku.<bridge>` für `manual_check.html`):
  - `_dispatchClick()` — synthetisiert `MouseEvent("click")` und
    dispatcht auf `searchEl`; identischer Pfad wie ein echter Klick.
  - `_resetClickCounter()` — `cancelRevealTimer() + resetClicks()`.
  - `_advanceRevealClock(ms)` — verschiebt `revealStartedAt` zurück,
    rechnet `elapsed`, cancelt + Reset wenn `elapsed >=
    revealWindowMs`, sonst Timer mit Restzeit neu (zeit-virtuell).
  - `_setQuotaForTest({usage, quota})` — setzt `quotaOverride` im
    Closure; `getStatusSnapshot()`-`readQuota()` nimmt den Override
    statt `navigator.storage.estimate()`.
  - `_clearQuotaForTest()` — `quotaOverride = null`.
- **Modul-Closure-State** (außerhalb der IIFE-Exports):
  `initialized`, `options`, `searchEl`, `clickListener`,
  `escListener`, `mountObserver`, `mountTimeoutId`, `windowEl`,
  `clickCount`, `revealTimerId`, `revealStartedAt`, `quotaOverride`.
- **Synchroner Selbstcheck beim Skript-Laden** (Muster wie 01/02/04/
  05/07): `console.info("MODUL 00 DOKU-FENSTER bereit, Funktionen:
  init/open/close/isOpen/getStatusSnapshot/recordSighttest")`.

### 2. Drei Bau-Pflichtfragen entschieden

**Frage 1 · Fenster-Render-Stil — Variante (a).** Modal mit
halb-transparentem Backdrop (`position:fixed;inset:0;background:
rgba(0,0,0,0.55);z-index:2147483646;display:flex;align-items:
center;justify-content:center`) und zentriertem Fenster-DOM. Alle
DOM-Klassen mit Präfix `sbkim-doku-*` (z.B. `.sbkim-doku-backdrop`,
`.sbkim-doku-window`, `.sbkim-doku-warn`, `.sbkim-doku-modules` …).
Klick auf den Backdrop schließt; Esc-Taste schließt (über den global
in `init()` registrierten Listener); explizite Schließen-Knöpfe oben
rechts und in der Action-Row unten. Begründung: Klaus' Single-File-
Stil, kein Risiko der Verwechslung mit App-Inhalt, kein CSS-Konflikt
(Klassenpräfix), spätere Migration auf einen Webcomponent
(`<sbkim-doku>` mit Shadow-DOM) bleibt additiv möglich ohne
API-Bruch.

**Frage 2 · Späte DOM-Mount-Strategie — Variante (a).**
`MutationObserver` auf `document.body` mit Auto-Disconnect sobald
der Selektor matcht, plus 10-Sekunden-Safety-Timeout (danach
`console.warn` + Selbst-Disconnect, kein Throw). Wenn
`document.body` selbst zum `init()`-Zeitpunkt noch nicht existiert,
wird auf `DOMContentLoaded` gewartet und dann erneut
`tryMountSearchEl()` aufgerufen. Begründung: dem Spec-Wortlaut
treu (Karte 00 Fehlertabelle: „Re-Mount beim `DOMContentLoaded`,
sonst beim ersten `open()`-Versuch erneut prüfen" → MutationObserver
deckt beides ab), kein Polling (keine Pulsation-Anmutung),
deterministisches Auto-Disconnect, kein lebenslang offener
Observer.

**Frage 3 · Panel-00-Test-Pragmatismus — Variante (a).** Panel 00
hat im Markup ein eigenes
`<button id="panel-00-fake-search">🔍 Such-Symbol (5× klicken)</button>`-
Element, sichtbar gestaltet (`background:#92400E;color:#fff`) — Klaus
klickt es bei Sichttest auch von Hand. `_dispatchClick()`
synthetisiert für Test 2 / Test 3 reale `MouseEvent("click")`-
Dispatches auf dieses Element. Begründung: Klaus' Sichttest wird
**sichtbar** (er sieht das Such-Symbol und kann es anklicken, der
Klickzähler wächst real beobachtbar — wenn er beim fünften ist,
öffnet sich das Modal). `_dispatchClick()` simuliert für die
automatischen Tests die volle Geste.

### 3. Panel 00 in `tests/manual_check.html` verdrahtet

- **Hero-Badge** von „noch nicht gebaut" auf 🟦 Code-Stub.
- **Sichtbares Fake-Such-Symbol** als eigenes `<button>` im Panel-
  Markup, mit Hint-Zeile darüber: „Fake-Such-Symbol als DOM-Anker
  für die 5-Klick-Geste — Klaus klickt es im Sichttest 5× von Hand
  binnen 3 s; `_dispatchClick()` simuliert automatisch."
- **Sechs Test-Knöpfe** via `SbkimUI.addButton` registriert
  (Konventions-Stil wie Panel 07):
  1. **Setup: Storage + Doku.init** — `SbkimStorage.init() +
     SbkimDoku.init({searchIconSelector:"#panel-00-fake-search"})`
     plus fail-soft Init von `SbkimSpore`/`SbkimAnastomose`/
     `SbkimApoptose` damit der Snapshot etwas Echtes zeigt.
     Idempotent.
  2. **Test 2 · 5 Klicks im Zeitfenster** — `_resetClickCounter()`
     + fünfmal `_dispatchClick()` mit 50 ms zwischen den Klicks
     (= 250 ms Gesamt, weit unter 3 s). Erwartung: `isOpen()===true`,
     Snapshot-Auszug im Log (`nodeIdShort`, `domain`, `siblingCount`,
     `legacyCount`, `quota`, `errors`-Anzahl).
  3. **Test 3 · 4 Klicks + Timeout** — vier Klicks dispatchen,
     `_advanceRevealClock(4000)`, fünfter Klick. Erwartung:
     `isOpen()===false`, Log-Notiz „Zähler war zurückgesetzt,
     Fenster bleibt zu".
  4. **Test 4 · Quota-Warnzeile** —
     `_setQuotaForTest({usage:81,quota:100})`, `await open()`,
     `getStatusSnapshot()`-Prüfung (`warnRatio:true`,
     `warningLevel:"ratio"`), DOM-Warnblock-Sichtbarkeit
     (`document.querySelector(".sbkim-doku-warn")`) verifizieren.
     Knopf schließt das Fenster und ruft `_clearQuotaForTest()`
     am Ende.
  5. **Test 5 · TTL-Sweep** — legt zwei echte Geschwister-Einträge
     in `sbkim_siblings` an (`SbkimStorage.put` mit `since` 31
     Tage in der Vergangenheit), ruft
     `SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)`.
     Erwartung: beide entfernt; im Re-Open-Snapshot nicht mehr
     gelistet.
  6. **Selbstcheck-Hinweis** — gibt im Log die erwartete
     Konsolen-Zeile aus und weist explizit darauf hin, dass
     Reveal-Schwelle/Quota-Schwellen **nicht** in der Selbstcheck-
     Zeile auftauchen (sie stehen in §0).
- **Skript-Tag** am Ende der Datei (nach 01/02/03/04/05/07):
  `<script src="../src/modules/00_doku_fenster.js"></script>`.

### 4. Karte 00 Bauzustand + Hero-Badge

`docs/components/00_doku_fenster.md` Hero-Badge auf 🟦 Code-Stub.
Bauzustand-Tabelle um zwei Zeilen ergänzt:

- *Code geschrieben | 2026-05-14 | Bau 00 | …* mit ausführlicher
  Anmerkung (Stil wie Bauzustand-Block in Karte 07): IIFE-Muster,
  alle sechs Funktionen, vier Error-Klassen, fünf Test-Brücken,
  drei Bau-Pflichtfragen-Entscheidungen mit Variante + Begründung
  in Stichworten, Persistenz-Pfad strikt über `SbkimStorage`,
  Selbstcheck-Format, Panel-00-Aufbau, `node --check`-Status,
  §6-Änderungsprotokoll-Zeile, status.json-Hebung mit Pie-Werten.
- *Sichttest | 2026-05-14 | Bau 00 | ungeprüft, weil Sitzung
  headless — Klaus klickt im Browser (Panel 00: Fake-Such-Symbol
  5× anklicken, alle sechs Knöpfe durchgehen, Selbstcheck-Zeile in
  DevTools-Konsole prüfen, Quota-Test-Knopf zeigt Warnzeile im
  Modal).*

### 5. INTERFACES.md §6 Änderungsprotokoll

Eine Zeile am unteren Ende der Tabelle ergänzt (neueste unten,
Konventions-Stil wie Bau-Sitzung 05 / 07): fasst die Bau-Sitzung
00 zusammen — IIFE, sechs Funktionen, vier Error-Klassen, fünf
Test-Brücken, drei Bau-Pflichtfragen mit Varianten + Begründungen,
5-Klick-Mechanik, `_advanceRevealClock`-Zeit-Virtualität, fail-soft-
Snapshot, `quota.warningLevel`-Mapping, `nodeIdShort`-Cut,
`recordSighttest`-Sync-Prüfung, Persistenz-Vertrag, Self-check,
TTL-Sweep-Knopf-Verhalten, Panel-00-Aufbau (sechs Knöpfe +
Fake-Such-Symbol), `node --check`-Status, status.json-Hebung mit
Pie-Werten, Spec-Korrektur-Vermerk zu Karte 00 § Manueller Test
Punkt 5. §1 Modul 00 bleibt auf `entwurf`.

### 6. status.json + Pie regeneriert

Modul 00 von `score:"spec"` / `siegel:"Spec fertig"` auf
`score:"stub"` / `siegel:"Code-Stub"` mit aktualisiertem
`kurz`-Feld:

```
"Versteckte 5-Klick-Statusanzeige in Endknoten-PWAs — Code-Stub,
sechs Funktionen (init/open/close/isOpen/getStatusSnapshot/recordSighttest),
Modal mit Backdrop und MutationObserver-Mount, alleiniger Schreiber
von sbkim_doku_meta, Quota-Frühwarnung (80% / 50 MiB) und
TTL-Sweep-Knopf andocken"
```

`python3 scripts/update_puls_pie.py` gelaufen, Pie regeneriert:

- Schablone: 4 → 4
- Werkstatt: 1 → 1
- Spec fertig: 2 → **1**
- Code-Stub: 6 → **7**
- Fertig: 0 → 0

Genau wie das Briefing vorgibt. Keine anderen Modul-Scores
verändert.

### 7. `node --check` für JS-Modul + Inline-Scripts

- `node --check src/modules/00_doku_fenster.js` → grün.
- Alle acht Inline-`<script>`-Blöcke in `tests/manual_check.html`
  einzeln extrahiert und via `node --check` validiert → alle grün
  (BLOCK 0–7 OK).

### 8. PULS-Aktualisierungen

- **Schnellüberblicks-Zeile Modul 00:** `Spec fertig (2026-05-14)`
  / `Code-Stub (2026-05-14)` / `ungeprüft (Sitzung headless)` /
  Notiz mit Sechs-Funktionen-API, Modal+MutationObserver-Anker,
  Schreib-Rolle, Quota-Doppel-Schwelle, Self-Apoptose-Ausschluss.
- **„Als nächstes ✨" umgestellt:** Modul 00 raus aus der „Spec
  frisch, Bau ausstehend"-Liste und rein in die „Code-Stub
  frisch, Sichttest ausstehend"-Liste neben 05 und 07. Empfehlung
  jetzt: Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-
  Andock-Versuch (parallel anbietbar: Folge-Pflege-Sitzung
  Karte 09 „Schritt 9: TTL-Sweep + Modul 00 im Andock-Pfad",
  jetzt spruchreif).
- **Neuer Sitzungs-Eintrag oben** mit Was getan / Frischer-Kopf-
  Befund (Spec-Korrektur Karte 00 Punkt 5, keine API-Korrektur an
  01/02/05/07, Skript-Reihenfolge-Beobachtung Endknoten) / Was
  offen blieb (Sichttest 00, Folge-Pflege-Sitzung Karte 09 Schritt
  9, Persistenz-Strategie verbinden, Bau-Sitzung Modul 09) /
  Nächster sinnvoller Schritt (3 Punkte).

### 9. WEGWEISER-Stand-Block-Zeile

Eine Zeile am unteren Ende des Stand-Blocks ergänzt (Wanderung —
neueste Zeile unten), zusammenfassend: alle sechs Funktionen,
vier Error-Klassen, fünf Test-Brücken, drei Bau-Pflichtfragen-
Entscheidungen, 5-Klick-Mechanik-Eckpunkte, Persistenz-Pfad,
Selbstcheck-Format, Panel-00-Aufbau, status.json-Hebung mit
Pie-Werten, Spec-Korrektur-Vermerk.

---

## Frischer-Kopf-Befund: eine Spec-Korrektur, keine API-Eingriffe

Das Briefing erlaubte „Spec-Korrektur"-Punkte, falls beim Bauen
eine Lücke an einer Karte oder INTERFACES.md auffällt, die
korrigiert werden muss. Beim Bau ist genau **eine** kleine
Beobachtung dieser Art aufgekommen:

**Karte 00 § Manueller Test Punkt 5** schlug als Setup für den
TTL-Sweep-Knopf-Test `SbkimApoptose._addPseudoSibling` vor (analog
Panel 07). Beim Bau hat sich beim Lesen von `07_apoptose.js`
gezeigt: `_addPseudoSibling` überschreibt **ausschließlich** den
Versand-Pfad-Helfer `listSiblingsForBroadcast()`, der in
`prepareSelfApoptose` aufgerufen wird.
`forgetExpiredSiblings(maxAgeMs)` hingegen liest **immer** aus dem
realen `sbkim_siblings`-Store in IndexedDB (Zeilen 666–707 in
`07_apoptose.js`). Der TTL-Sweep wird also durch
`_addPseudoSibling`-Einträge nicht ausgelöst.

**Korrektur**: Karte 00 § Manueller Test Punkt 5 leicht präzisiert
— Test-Knopf nutzt direkten `SbkimStorage.put` auf `sbkim_siblings`
mit altem `since` (analog Panel 07 Test 4 TTL-Cleanup), nicht
`_addPseudoSibling`. Diese Änderung ist additiv und berührt
**keinen** API-Vertrag — kein Eingriff in Modul 07. Vermerk in
Karte 00 Punkt 5 selbst sowie in INTERFACES.md §6-Bau-00-Zeile.

**Keine weiteren API-Korrekturen an 01/02/05/07 nötig.** Beim
vollen Bau von Modul 00 ist sonst nichts aufgefallen, was eine
Schnittstelle erweitern oder ändern müsste:

- `SbkimStorage.{init, get, put, all}` — alles vorhanden.
- `SbkimSpore.{getNodeId, getOwnSpore, getPublicKeyJwk}` — alles
  vorhanden; `getPublicKeyJwk` wird im aktuellen Snapshot nicht
  konsumiert, ist aber in der Spec als Lese-Quelle aufgeführt
  und bleibt für künftige Detail-Views (z.B. Modul 11 Replay-
  Schutz) verfügbar.
- `SbkimAnastomose.listSiblings` — vorhanden, liefert exakt die
  Form `{nodeId, domain, since, pubKey}`, die Modul 00 in
  `siblings[]` braucht.
- `SbkimApoptose.{listLegacy, forgetExpiredSiblings}` — beide
  vorhanden, beide nehmen genau die Parameter, die Modul 00
  übergeben muss.
- `navigator.storage.estimate()` — Browser-Standard.

**Beobachtung zur Skript-Reihenfolge in `manual_check.html`:**
Modul 00 wird am **Ende** der Datei eingebunden (nach 01/03/04/02/
05/07), analog Bau-Sitzung 07. Im Endknoten gilt die in Karte 00
§ 5-Klick-Pfad Schritt 1 spezifizierte Reihenfolge 01 → 02 → 03
→ 04 → 05 → 07 → **00** (weil 00 die anderen Module beim `init()`
liest und ihre Existenz prüft, aber nicht braucht — sie sind
optional). Die in der Spec-Sitzung 00 als „kleine Beobachtung"
festgehaltene Folge-Pflege-Sitzung Karte 09 „Schritt 9" ist jetzt
spruchreif — Karte 09 § Andock-Schritt-Pfad Schritt 2 muss um 07
und 00 ergänzt werden.

---

## Was offen blieb

- **Sichttest Modul 00 durch Klaus im Browser.** Diese Sitzung
  war headless. Klaus klickt Panel 00 durch (Fake-Such-Symbol
  5× von Hand, alle sechs Test-Knöpfe, Selbstcheck-Zeile in
  DevTools-Konsole prüfen, Quota-Warnzeile im Modal sichtbar,
  Esc schließt). Falls eine Beobachtung daneben liegt, kleine
  Pflege-Sitzung.
- **Folge-Pflege-Sitzung Karte 09 „Schritt 9: TTL-Sweep + Modul
  00 im Andock-Pfad"** ist jetzt spruchreif (Modul 00 ist
  Code-Stub). Karte 09 § Andock-Schritt-Pfad Schritt 2
  (`<script>`-Tags) muss um Modul 07 und 00 ergänzt werden; ein
  Schritt 9 für `SbkimDoku.init({searchIconSelector:...})` plus
  optionalen `SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)`-
  Aufruf nach jedem Handshake angehängt.
- **Folge-Pflege-Sitzung „Persistenz-Strategie verbinden"**
  bleibt offen (Modul 01 Persist + Modul 02 Backup). Modul 00 hat
  seinen Anteil verankert (Quota-Schwellen in §0).
- **Folge-Pflege-Sitzung „Sichtbarkeits-Persistenz später"
  (optional)** — wenn Klaus später Komfort wünscht, kann eine
  Pflege-Sitzung Variante (b) oder (c) additiv einführen.
- **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Browser** ist
  jetzt die produktivste Folge-Sitzung — Module 00/05/07 sind
  alle drei Code-Stub und können im Live-Andock-Versuch
  zusammen sichtgeprüft werden.

---

## Nächster sinnvoller Schritt

1. **Sichttest Karte 00 + Karte 05 + Karte 07** durch Klaus im
   Browser (Panel 00 sechs Knöpfe + Fake-Such-Symbol von Hand,
   Panel 05 acht Knöpfe, Panel 07 zehn Knöpfe). Idealerweise
   vor Schritt 2 und Schritt 3.
2. **Folge-Pflege-Sitzung Karte 09 „Schritt 9: TTL-Sweep + Modul
   00 im Andock-Pfad"** — kompakte Pflege-Sitzung, jetzt
   spruchreif.
3. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
   Versuch** — der erste echte Andock-Klick zwischen Rezeptbuch
   und Mixarium. Module 00/05/07 sind alle Code-Stub und können
   mit-andocken.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `src/modules/00_doku_fenster.js` als IIFE mit
      `window.SbkimDoku` geschrieben, ~750 Zeilen, Stil
      01/02/04/05/07
- [x] **Sechs öffentliche Funktionen:**
      `init`/`open`/`close`/`isOpen`/`getStatusSnapshot`/
      `recordSighttest`
- [x] **Vier benannte Error-Klassen** exportiert
      (`InvalidDokuOptionsError`, `DokuDependenciesError`,
      `InvalidSighttestResultError`, `StorageQuotaError` als
      Sammel-Klasse mit `.cause`)
- [x] **Fünf Test-Brücken** exportiert (`_dispatchClick`,
      `_resetClickCounter`, `_advanceRevealClock`,
      `_setQuotaForTest`, `_clearQuotaForTest`)
- [x] **Drei Bau-Pflichtfragen verbindlich entschieden:**
      - Frage 1 Variante (a) — Modal mit halb-transparentem
        Backdrop, Klassenpräfix `sbkim-doku-*`
      - Frage 2 Variante (a) — MutationObserver auf
        `document.body` mit Auto-Disconnect, 10-s-Safety-Timeout
      - Frage 3 Variante (a) — Fake-Such-Symbol als eigenes
        `<button id="panel-00-fake-search">` im Panel-Markup
- [x] **Synchroner Selbstcheck beim Skript-Laden** — Format wie
      01/02/04/05/07, keine Konstanten in der Zeile
- [x] **Persistenz strikt über `SbkimStorage`** (kein
      `indexedDB.open` in 00); Modul 00 als alleiniger Schreiber
      von `sbkim_doku_meta` gehalten
- [x] **5-Klick-Mechanik nach Spec:** Timer für alle 5 Klicks
      **insgesamt** (nicht pro Klick), Zähler-Reset bei
      Schwelle/Close/Timer-Ablauf
- [x] **`_advanceRevealClock(ms)` zeit-virtuell** — verschiebt
      `revealStartedAt`, cancelt + Reset oder Timer mit Restzeit
- [x] **Fail-soft-Snapshot** — jede optionale Lese-Quelle hat
      eigenen try/catch, Fehler in `errors[]`, kein Throw;
      `sbkim_doku_meta` Pflicht-Quelle durchgereicht
- [x] **TTL-Sweep-Knopf im Fenster** deaktiviert mit Tooltip,
      wenn `SbkimApoptose` fehlt; sonst Aufruf mit
      `SIBLING_MAX_AGE_MS`
- [x] **Self-Apoptose-Knopf NICHT in Modul 00** —
      ausdrücklich nicht eingebaut, Karte 00 § Verantwortlichkeiten
      „Macht nicht" bleibt verbindlich
- [x] **Panel 00 in `tests/manual_check.html` verdrahtet:**
      Hero-Badge auf 🟦 Code-Stub, Fake-Such-Symbol-Button im
      Markup, sechs Knöpfe (Setup + Test 2/3/4/5 +
      Selbstcheck-Hinweis), Skript-Tag am Datei-Ende
- [x] **Karte 00 Hero-Badge** auf 🟦 Code-Stub, Bauzustand-
      Tabelle um *Code geschrieben* + *Sichttest ungeprüft
      (Sitzung headless)* ergänzt
- [x] **`docs/INTERFACES.md` §6** Änderungsprotokoll-Zeile am
      unteren Ende ergänzt (neueste Zeile unten, Konventions-Stil
      wie Bau-Sitzung 05 / 07); §1 Modul 00 bleibt auf `entwurf`
- [x] **Spec-Korrektur** Karte 00 § Manueller Test Punkt 5
      (TTL-Sweep-Setup über `SbkimStorage.put`, nicht
      `_addPseudoSibling`) eingetragen; additiv, kein API-Eingriff
- [x] `status.json` Modul 00 auf `score:"stub"` /
      `siegel:"Code-Stub"` mit aktualisiertem `kurz`-Feld (keine
      anderen Modul-Scores geändert)
- [x] `python3 scripts/update_puls_pie.py` gelaufen (Spec fertig
      2→1, Code-Stub 6→7; alle anderen Werte unverändert)
- [x] **`node --check` für `00_doku_fenster.js`** grün; alle
      acht Inline-`<script>`-Blöcke in `manual_check.html`
      einzeln syntaktisch validiert (alle grün)
- [x] `docs/PULS.md` Sitzungs-Eintrag oben, Schnellüberblick und
      „Als nächstes ✨" aktualisiert
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile unten ergänzt
      (Wanderung, neueste Zeile unten)
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/bau-00-doku-fenster-xYRua` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
