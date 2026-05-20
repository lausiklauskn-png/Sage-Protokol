# Übergabeprotokoll — Bau-Sitzung 08.Y slot-spezifische Outbox in Modul 08

**Datum:** 2026-05-20
**Sitzungs-Rolle:** Bau-Sitzung (kein Spec — Brief 04 hat das Store-Pattern
in INTERFACES § 9.2 spezifiziert; Modul 08 ist Schreiber von
`sbkim_hetero_outbox_<key>` und Co-Schreiber von
`sbkim_siblings_<key>.heterokaryosisOptIn`).
**Branch:** `claude/bau-08y-slot-spezifische-outbox-j6mJF`. Brief
BAU_08Y_SLOT_SPEZIFISCHE_OUTBOX (PR #116 gemerged 2026-05-20, `main`
`4b063ad`) als Spec-Vorlage.

**Voraussetzung:** Brief 04 (PR #99), Bau 02.Y (PR #104), Pflege Modul 01
(PR #107), Brief 08.Y (PR #116) gemerged.

---

## Kern (drei Sätze)

Modul 08 schreibt jetzt slot-spezifisch in
`sbkim_hetero_outbox_<activeSlotKey>` und liest/schreibt
`sbkim_siblings_<activeSlotKey>`. Der `activeSlotKey` wird im `init()`
via `SbkimSpore.getActiveIdentityKey()` einmalig gecached (Default
`"main"` — Rückwärts-Kompat zum Singleton-Vertrag). **Bau 08.Y löst die
in Bau-06.Y-Brief dokumentierte bekannte Limitierung auf** — Modul 06
liest jetzt aus `sbkim_hetero_outbox_<key>` (Bau 06.Y), Modul 08
schreibt dorthin (diese Sitzung).

---

## Sechs Punkte a–f

### a) INTERFACES.md zwei kleine Eingriffe

- **§ 1 Modul 08 Geprüft-Zeile** um „2026-05-20 (Bau 08.Y
  slot-spezifische Outbox)" erweitert.
- **§ 10 Änderungsprotokoll** neue Zeile mit voller Bau-Beschreibung.

KEIN Vertrags-Eingriff in Bietet / Storage / Fehlerverhalten /
Garantien — Brief 04 hat das Slot-Pattern in § 9.2 spezifiziert,
Spec-Sitzung 08 hat den Modul-08-Vertrag spec'd, und beide
Vertrags-Bausteine bleiben in Bau 08.Y unangetastet.

### b) Karte 08 nachgezogen

- **§ Konfigurationswerte** `HETERO_OUTBOX_MAX_ENTRIES = 5`-Block um
  „PRO SLOT, nicht global"-Hinweis ergänzt (Stolperfalle aus Brief).
- **§ Datenformate** neuen Slot-Pfad-Block am Anfang ergänzt;
  `sbkim_hetero_outbox` → `sbkim_hetero_outbox_<activeSlotKey>`,
  `sbkim_siblings` → `sbkim_siblings_<activeSlotKey>` durchgezogen.
- **§ Manueller Test** Erwartungs-Block je Knopf nachgezogen
  (`sbkim_hetero_outbox_main` jetzt statt `sbkim_hetero_outbox`,
  Setup-Output zeigt `active_slot_key`, OutboxFullError-Message-
  Hinweis auf „pro Slot", UnknownSiblingError-Slot-Benennung).
- **§ Test-Brücken-Doku** umgestellt (`_clearOutbox` / `_clearPseudoSiblings`
  via `SbkimStorage.clear` statt iteratives `del`; Slot-isoliert).
- **§ Bauzustand** neue Zeile „Bau 08.Y slot-spezifische Outbox
  2026-05-20".

### c) Code in `src/modules/08_ui_demo.js`

Additiv-mit-internem-Refactoring (KEIN Bruch der äußeren Signatur):

- **Modul-State** um `var activeSlotKey = null` erweitert (gecached
  vom `init()`; null vor init).
- **Modul-lokale Konstanten** `OUTBOX_STORE` / `SIBLINGS_STORE` durch
  `OUTBOX_STORE_BASE` / `SIBLINGS_STORE_BASE` ersetzt; neue Konstante
  `DEFAULT_IDENTITY_KEY = "main"` als Defensiv-Fallback.
- **Neue Closure-Helper:**
  - `heteroOutboxStoreName(slot)` (sync, intern): returns
    `"sbkim_hetero_outbox_" + slot`.
  - `siblingsStoreName(slot)` (sync, intern): returns
    `"sbkim_siblings_" + slot`.
  - `ensureSlotStores(slot)` (async, intern): ruft
    `SbkimStorage.ensureStore` für beide slot-suffixed Stores;
    idempotent dank Bau 01.Y. Schützt gegen Backup-Re-Import-Pfade
    + Tab-Race, in denen Modul 02's `ensureIdentityStores` den
    Soll-Stand noch nicht erreicht hat.
- **`probeDependencies`** um Pflicht-Abhängigkeit
  `SbkimSpore (Modul 02)` als zweite Probe erweitert. Sprechende
  Fehler-Message benennt Bau-08.Y als Hintergrund. (Vorher: nur
  `SbkimStorage`-Probe.)
- **`init(options)` erweitert:**
  1. `probeDependencies()` (Storage + Spore).
  2. `options`-Parsing unverändert; `options.storeName` wird
     stillschweigend ignoriert (slot-suffix ist intern verbindlich).
  3. `await SbkimStorage.init()` (unverändert).
  4. `await SbkimSpore.init()` (neu — Modul 02-Dependency).
  5. `activeSlotKey = await SbkimSpore.getActiveIdentityKey()`
     (Default `"main"` aus Modul 02; defensiv auf
     `DEFAULT_IDENTITY_KEY` zurückfallen, falls Modul 02 in einer
     unerwarteten Form antwortet).
  6. `await ensureSlotStores(activeSlotKey)`.
  7. `ready = true`.
- **`listOutbox()`** liest aus
  `heteroOutboxStoreName(activeSlotKey)` statt
  `sbkim_hetero_outbox`. Reihenfolge unverändert (absteigend nach
  `addedAt`, max. `HETERO_OUTBOX_MAX_ENTRIES = 5` Einträge — die
  Konstante bleibt bei 5, gilt aber jetzt pro Slot).
- **`addOutboxAnchor(label, vector)` erweitert:**
  1. Sync-Checks (Label, Vektor) unverändert.
  2. `await ensureReady()` unverändert.
  3. Defensiv `await ensureSlotStores(activeSlotKey)` (idempotent).
  4. Existing-Anchor-Check + Voll-Check + put-Pfad jetzt gegen
     `heteroOutboxStoreName(activeSlotKey)`.
  5. `OutboxFullError`-Message benennt jetzt den slot-suffixed
     Store + „pro Slot".
- **`removeOutboxAnchor(label) erweitert:** löscht aus
  `heteroOutboxStoreName(activeSlotKey)`; weiterhin idempotent
  via `SbkimStorage.del`.
- **`setSiblingHeteroOptIn(peerNodeId, value) erweitert:** liest aus +
  schreibt nach `siblingsStoreName(activeSlotKey)`. Co-Schreiber-
  Konvention via `Object.assign({}, sibling, {heterokaryosisOptIn})`
  unverändert. `UnknownSiblingError`-Message benennt den Slot.
  Defensiv `ensureSlotStores` vor dem ersten Schreibvorgang.
- **Test-Brücken erweitert:**
  - `_clearOutbox()`:
    `clear(heteroOutboxStoreName(activeSlotKey))`.
  - `_addPseudoSibling(sib)`: schreibt in
    `siblingsStoreName(activeSlotKey)`.
  - `_clearPseudoSiblings()`:
    `clear(siblingsStoreName(activeSlotKey))`.
  - `pseudoSiblingIds`-Tracker entfernt (durch `clear`-Pfad
    obsolet).
- **`_meta`** um `outboxStoreBase` / `siblingsStoreBase` (Basis-Namen
  ohne Slot-Suffix) + Getter `activeSlotKey` (Read-Anker für Tests,
  null vor init) erweitert. Bestehende `outboxStore` / `siblingsStore`-
  Felder (mit globalem Namen) durch `outboxStoreBase` /
  `siblingsStoreBase` ersetzt — Bau 08.Y bricht das nur intern;
  externe Test-Brücken nutzten die nicht.
- **Modul-Kopfkommentar** um Bau-08.Y-Block am Ende.
- **Selbstcheck-Zeile UNVERÄNDERT** — die fünf Funktionen heißen
  weiterhin gleich (`init/listOutbox/addOutboxAnchor/
  removeOutboxAnchor/setSiblingHeteroOptIn`).
- `node --check src/modules/08_ui_demo.js` grün.

### d) tests/manual_check.html Panel 08

- **Setup-Knopf-Output** zeigt jetzt:
  - `active_slot_key`: der aus `SbkimSpore.getActiveIdentityKey()`
    gecachte Slot-Key (typisch `"main"`).
  - `outbox_store: "sbkim_hetero_outbox_<active>"` (slot-suffixed).
  - `siblings_store: "sbkim_siblings_<active>"` (slot-suffixed).
  - `hinweis` um Bau-08.Y-Block erweitert („HETERO_OUTBOX_MAX_ENTRIES
    gilt PRO SLOT").
- **Test 6 (Opt-In setzen)** direkte Storage-Reads umgestellt von
  `"sbkim_siblings"` auf `"sbkim_siblings_" + activeSlotKey` (drei
  Stellen). Damit prüfen wir den Co-Schreiber-Pfad im aktiven Slot.
- **Panel-Header-Hinweistext** um Bau-08.Y-Block erweitert
  (slot-suffixed Store-Namen, „pro Slot"-Hinweis).
- **Optional-Knopf Sekundär-Persona-Test bewusst NICHT in dieser
  Bau-Sitzung** (Brief-Empfehlung — Bau-05.Y/06.Y/07.Y-Sichttests
  haben das Sekundär-Persona-Muster genug demonstriert; die acht
  bestehenden Panel-08-Knöpfe ohne Strukturänderung).
- Alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html`
  syntaktisch validiert (`node --check` pro extrahiertem Block).

### e) Smoke-Test `tests/smoke_bau08y_slot_spezifische_outbox.mjs`

Mit `fake-indexeddb` + Node 22. Drei Proben + Bonus + Setup-Proben,
**26 Sub-Proben, 26 grün, 0 rot:**

| # | Probe | Erwartet | Ergebnis |
|---|---|---|---|
| 1 | Exports — fünf Funktionen | alle vorhanden | ✓ |
| 2 | Errors — sechs Klassen exportiert | alle function | ✓ |
| 3 | `_meta.outboxStoreBase` | `sbkim_hetero_outbox` | ✓ |
| 4 | `_meta.siblingsStoreBase` | `sbkim_siblings` | ✓ |
| 5 | `_meta.activeSlotKey` vor init | null | ✓ |
| 6 | Probe 1 — `init()` resolves | void | ✓ |
| 7 | Probe 1 — `activeSlotKey` nach init | `main` | ✓ |
| 8 | Probe 1 — `sbkim_hetero_outbox_main` hat Eintrag | 1 Zeile | ✓ |
| 9 | Probe 1 — Eintrag-Label | `Hefeteig` | ✓ |
| 10 | Probe 1 — `listOutbox` liefert Eintrag | `[Hefeteig]` | ✓ |
| 11 | Probe 1 — non-suffixed `sbkim_hetero_outbox` leer | 0 Zeilen | ✓ |
| 12 | Probe 2 — Sekundär-Persona angelegt + aktiv | `test_08y` | ✓ |
| 13 | Probe 2 — `activeSlotKey` nach Re-Init | `test_08y` | ✓ |
| 14 | Probe 2 — `sbkim_hetero_outbox_test_08y` hat Eintrag | 1 Zeile | ✓ |
| 15 | Probe 2 — Eintrag-Label im test_08y-Slot | `Whisky-Sour` | ✓ |
| 16 | Probe 2 — main-Slot unverändert (Persona-Isolation) | 1 Zeile | ✓ |
| 17 | Probe 2 — `listOutbox` nur test_08y-Eintrag | `[Whisky-Sour]` | ✓ |
| 18 | Probe 3 — `activeSlotKey` zurück auf main | `main` | ✓ |
| 19 | Probe 3 — `_addPseudoSibling` in `sbkim_siblings_main` | Eintrag da | ✓ |
| 20 | Probe 3 — NICHT in `sbkim_siblings` (non-suffixed) | undefined | ✓ |
| 21 | Probe 3 — `setSiblingHeteroOptIn(true)` Co-Schreiber-Pfad | optIn:true + andere Felder unverändert | ✓ |
| 22 | Probe 3 — `setSiblingHeteroOptIn(false)` Co-Schreiber-Pfad | optIn:false + andere Felder | ✓ |
| 23 | Probe 3 — unbekannter Sibling im aktiven Slot | `UnknownSiblingError` | ✓ |
| 24 | Probe 3 — `setSiblingHeteroOptIn(1)` strikt-boolean | `InvalidOptInArgError` | ✓ |
| 25 | Bonus — main-Outbox nach Zweitschreibung | 2 Zeilen | ✓ |
| 26 | Bonus — test_08y-Outbox unverändert | 1 Zeile | ✓ |

**Sekundär-Slot via Modul-Re-Load:** der Smoke-Test simuliert
Tab-Reload durch erneutes `loadModule("src/modules/08_ui_demo.js")` —
das überschreibt die IIFE-Closure mit frischem State (`ready=false`,
`activeSlotKey=null`), sodass der nächste `init()` den neuen aktiven
Slot picks. Das ist genau das Verhalten, das Klaus im Browser per
Tab-Reload erreicht.

**Regression-Bonus:** Bau-02.Y-Smoke-Test 33/33 weiterhin grün,
Bau-04.A-Smoke-Test 19/19 weiterhin grün, Pflege-01-Smoke-Test 8/8
weiterhin grün.

### f) Übergabeprotokoll

Diese Datei: `docs/sessions/archiv/2026-05-20_bau-08y-slot-spezifische-outbox.md`.

---

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** § 1 Modul 08 Bietet / Storage /
  Fehlerverhalten / Garantien UNVERÄNDERT — Spec-Sitzung 08 + Brief 04
  haben den Vertrag spec'd. Bau 08.Y zieht NUR Geprüft-Zeile + § 10
  Änderungsprotokoll nach.
- **Modul 08 ist storage-only.** KEIN Receiver-Map, KEIN Netz-Empfang,
  KEIN `_per_identity_op`-Pattern. Modul 08 schreibt lokal und liest
  lokal; das macht Bau 08.Y kürzer als Bau 05.Y / 06.Y / 07.Y.
- **Aktiver-Slot-Cache analog Bau 05.Y-Brief:** `activeSlotKey` im
  `init()` aus `SbkimSpore.getActiveIdentityKey()` gecached, modul-
  lokale Variable für die Lebenszeit der jeweiligen Tab-Sitzung.
- **Stores pro aktivem Slot:** `sbkim_hetero_outbox_<activeSlotKey>`
  (Modul 08 alleiniger Schreiber; max. `HETERO_OUTBOX_MAX_ENTRIES = 5`
  pro Slot) + `sbkim_siblings_<activeSlotKey>` (Modul 08 Co-Schreiber
  für `heterokaryosisOptIn`-Feld).
- **`ensureStore` defensiv vor jedem ersten Schreibvorgang pro Slot.**
  Idempotent dank Bau 01.Y. Auch in `addOutboxAnchor` /
  `setSiblingHeteroOptIn` zusätzlich zur init-Phase — schützt gegen
  Backup-Re-Import-Pfade.
- **`setSiblingHeteroOptIn` Co-Schreiber-Konvention unverändert.**
  Liest existierenden Sibling-Eintrag, ergänzt das eine additive Feld
  `heterokaryosisOptIn` via `Object.assign`, schreibt zurück. Wenn
  Sibling nicht existiert: `UnknownSiblingError` (mit Slot-Hinweis in
  der Message). Modul 05 bleibt Haupt-Schreiber von `sbkim_siblings`.
- **Default-Slot „main" Rückwärts-Kompat:** pre-Brief-04-Aufrufer
  treffen unverändert auf `_main`-Slots, weil
  `getActiveIdentityKey()` ohne `sbkim_meta["active-identity"]`-Eintrag
  per Default `"main"` liefert (Modul 02-Vertrag).
- **Bestehende Funktionen unangetastet in der äußeren Signatur.**
  `init`, `listOutbox`, `addOutboxAnchor`, `removeOutboxAnchor`,
  `setSiblingHeteroOptIn` bleiben in äußerer Form gültig. Test-
  Brücken `_clearOutbox`, `_addPseudoSibling`, `_clearPseudoSiblings`
  bleiben in der äußeren Form gültig — interner Pfad jetzt slot-
  spezifisch.
- **`addOutboxAnchor`-Check-Reihenfolge unverändert** (Karte 08
  § Bauzustand Pflicht-Entscheidung 1): (1) Label sync, (2) Vektor
  sync, (3) async-Voll-Check `OutboxFullError` nur bei NEUEM Label;
  Überschreiben eines bekannten Labels bleibt erlaubt.
- **Reihenfolge der Lese-Antwort in `listOutbox`** unverändert:
  absteigend nach `addedAt` (neueste zuerst).
- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert (`"0.1"` / `4` / `2`).

**KEINE Tafel-Spannung** während des Baus aufgetreten. Die Stolperfalle
„`HETERO_OUTBOX_MAX_ENTRIES = 5` ist PRO SLOT" aus dem Brief ist
spec-konform (keine Tafel-Spannung) — Karte 08 § Konfigurationswerte
ist um den Hinweis ergänzt; bei 3 Personae hat Klaus theoretisch
5 × 3 = 15 Anker insgesamt.

---

## Was NICHT angefasst

- **Kein Modul-05/06/07-Eingriff.** Die anderen drei Konsumenten-Bauten
  haben eigene Sitzungen (Bau 05.Y / 06.Y / 07.Y — Briefe gemerged,
  Bau-Sitzungen folgen in eigener Reihenfolge).
- **Kein Receiver-Map-Code** (Modul 08 ist storage-only, kein Netz-
  Empfang).
- **Keine `setActiveIdentity`-Aufrufe aus Modul 08.** Slot-Wechsel
  ist Aufrufer-Pflicht.
- **Keine Migration der alten nicht-suffixed
  `sbkim_hetero_outbox`-Daten.** Wer alte Daten erhalten will, nutzt
  Backup-Re-Import aus Bau 02.Y, um sie in den `_main`-Slot zu
  bringen.
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.**
- **Keine Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 08 bleibt
  `score:"stub"`, additive Erweiterung, kein Score-Wechsel.

---

## Manueller Sichttest

**Ungeprüft, weil headless gebaut.** Wartet auf Klaus' Browser-Lauf
von Panel 08 Setup-Knopf — Erwartung:
- `active_slot_key: "main"` (oder die jeweilige aktive Persona).
- `outbox_store: "sbkim_hetero_outbox_main"`.
- `siblings_store: "sbkim_siblings_main"`.
- DB-Version ≥ 4 (Bau 01.Y).
- `console.info("MODUL 08 UI-DEMO bereit, …")`-Zeile in DevTools.

Anschließend Test 1–6 auf dem Default-Slot durchspielen — Erwartung:
8/8 wie bisher. **Bonus-Sichttest** (wenn Klaus Lust hat): Tab-Reload
nach `SbkimSpore.setActiveIdentity('<sekundär>')` in einem zweiten
Browser-Konsolen-Eingriff — Setup-Knopf zeigt dann den sekundären
Slot. Optional, nicht Pflicht.

**Indirekt belegt durch Headless-Smoke-Test:** der Re-Module-Load
in Probe 2 simuliert genau diesen Tab-Reload-Pfad und prüft, dass
der `activeSlotKey`-Cache + die slot-suffixed Store-Namen korrekt
durchgereicht werden. Klaus' Browser-Sichttest deckt zusätzlich die
DevTools-Sichtbarkeit der Stores im IndexedDB-Inspektor ab — das ist
mit fake-indexeddb in Node nicht testbar.

---

## Nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest Panel 08** — Setup-Knopf zeigt
   slot-suffixed Store-Namen + `active_slot_key`; Tests 1–6
   wie bisher grün.
2. **Endknoten-Migration (Mein-Mixarium + Mein-Rezeptbuch)** — alle
   Bau-02.Y / 04.A / 05.Y / 06.Y / 07.Y / 08.Y produktiv im
   Endknoten-Repo verfügbar (Multi-Persona-Pfad live).
3. **Vision-Anker 5 Identitäts-Container Spec-Sitzung** (optional) —
   löst die User-Key-Test-Brücke aus Bau 04.B mit produktivem
   sicheren Pfad.

---

## PR

Branch: `claude/bau-08y-slot-spezifische-outbox-j6mJF`. Draft-PR
„Bau 08.Y slot-spezifische Outbox in Modul 08 (UI-Demo)".
