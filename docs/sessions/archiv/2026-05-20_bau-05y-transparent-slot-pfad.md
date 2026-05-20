# Bau-Sitzung 2026-05-20 — Bau 05.Y transparenter Slot-Pfad in Modul 05

**Sitzungs-Rolle:** Bau-Sitzung (kein Spec — Brief 04 PR #99 hat das
Pattern in INTERFACES § 1 Modul 05 + § 9.2 + § 9.4 vollständig
spezifiziert). Branch `claude/bau-05y-transparent-slot-pfad-j6mJF`,
vom `main` `a3b5123` aus angelegt (Stand nach Bau 08.Y +
Sichttest-Nachzug PR #117 / #118). Erste der drei Konsumenten-
Bauten (05.Y / 06.Y / 07.Y) nach Bau 08.Y.

Brief BAU_05Y_TRANSPARENT_SLOT_PFAD (PR #113 gemerged 2026-05-20,
`main` `700f062`) als Spec-Vorlage.

---

## 1. Was getan

### a) INTERFACES.md zwei Nachzieh-Eingriffe

- § 1 Modul 05 Geprüft-Zeile um „2026-05-20 (Bau 05.Y transparenter
  Slot-Pfad — Receiver-Map nodeId→key live, sbkim_siblings_<key> +
  sbkim_anastomosis_log_<key>)" erweitert.
- § 10 Änderungsprotokoll neue Zeile.

KEIN Vertrags-Drift in Bietet / Storage / Fehlerverhalten / Garantien
(steht aus Brief 04).

### b) Karte 05 zwei Sub-Sektionen

- § Bauzustand neue Zeile „Bau 05.Y transparenter Slot-Pfad
  2026-05-20" mit vollständiger Code-Beschreibung +
  Migrations-Hinweis (alte `sbkim_siblings`-Daten via `importBackup`
  in `sbkim_siblings_main` bringen) + bekannter Limitierung
  (Modul 06's TTL-Sweep liest noch non-suffixed Log bis Bau 06.Y).

### c) `src/modules/05_anastomose.js` Code-Eingriff (additiv-mit-internem-Refactoring)

Keine äußere Signatur-Änderung.

**Konstanten:**
- `SIBLINGS_STORE` / `LOG_STORE` durch `SIBLINGS_STORE_BASE` /
  `LOG_STORE_BASE` ersetzt (Slot-Suffix wird im Schreib-Pfad angehängt).
- `IDENTITY_KEY = "main"`-Hartkodierung im PrivKey-Lader durch
  Slot-Parameter ersetzt; modul-lokale Konstante
  `DEFAULT_IDENTITY_KEY = "main"` als Fallback-Anker.

**Neue Closure-Helper:**
- `siblingsStoreName(slot)` (sync) → `SIBLINGS_STORE_BASE + "_" + slot`.
- `anastomosisLogStoreName(slot)` (sync).
- `ensureSlotStores(slot)` (async) — ruft `SbkimStorage.ensureStore`
  für beide slot-suffixed Stores; idempotent dank Bau-01.Y.

**Modul-State:**
- `var activeSlotKey = null` — gecached im `init()` via
  `SbkimSpore.getActiveIdentityKey()`.
- `var receiverMap = new Map()` — `nodeId → slotKey`, im `init()`
  einmal aus `listIdentities()` × `getOrCreateIdentity(slot)`
  aufgebaut.
- `var ownPrivateKeyCacheBySlot = new Map()` — pro Slot ein
  CryptoKey (statt einem globalen).

**`init()` erweitert:**
1. Bestehende init-Pfade (Storage init, Spore init,
   getOrCreateIdentity, SW-Bridge, BroadcastChannel-Bridge)
   unverändert.
2. `activeSlotKey = await SbkimSpore.getActiveIdentityKey()`.
3. `await ensureSlotStores(activeSlotKey)`.
4. Receiver-Map-Bau: für jeden `slot` in `listIdentities()`:
   `receiverMap.set(getOrCreateIdentity(slot).nodeId, slot)`.

**`handshake(targetSpore, ownDomainVector, options)` erweitert:**
- `opSlot = activeSlotKey || await getActiveIdentityKey()` zur
  Operations-Zeit cachen (gegen Mid-Operation-Wechsel — Karte 02
  § Risiken).
- `await ensureSlotStores(opSlot)` defensiv.
- `getOwnSpore(opSlot)` + `loadOwnPrivateKey(opSlot)` +
  `getOrCreateIdentity(opSlot).nodeId` als ownNodeId.
- `sendViaChannel(...)` und `consumeResponse(...)` reichen opSlot
  durch für `upsertSibling(entry, opSlot)` und
  `logEntry(peerId, outcome, opSlot)`.

**`receiveHandshake(request)` erweitert:**
1. Pre-Checks (Form / senderSpore / version / signature) unverändert
   — Antwort wird mit `activeSlotKey`-Default signiert (early reject).
2. Receiver-Map-Lookup: `targetSlot = receiverMap.get(request.toNodeId)`.
   - `toNodeId` angegeben + nicht in Map → `outcome:"rejected",
     reason:"toNodeId stimmt nicht zum Empfänger"`, KEIN
     Storage-Eingriff.
   - `toNodeId` in Map → `targetSlot` als Persona für die Operation.
   - `toNodeId` fehlt/leer → Pre-Brief-04-Rückwärts-Kompat
     (`activeSlotKey` als Default).
3. `await ensureSlotStores(targetSlot)` defensiv.
4. `loadOwnDomainVector(targetSlot)` + Match.
5. `upsertSibling(entry, targetSlot)` + `logEntry(peerId, outcome,
   targetSlot)`.
6. `buildResponse(extra, request, targetSlot)` signiert mit der
   GETROFFENEN Persona.
7. **`setActiveIdentity` wird NICHT gerufen** — globaler Marker
   bleibt unangetastet.

**Hilfsfunktionen:**
- `loadOwnPrivateKey(slotKey)` — lädt CryptoKey pro Slot aus
  `sbkim_keys[<slot>]`, cached pro Slot.
- `loadOwnDomainVector(slotKey)` — ruft `getOwnSpore(slot)` für die
  getroffene Persona; fail-soft null bei fehlender Spore.
- `upsertSibling(entry, slotKey)` / `logEntry(peerId, outcome,
  slotKey)` — schreiben in slot-suffixed Stores; Slot fällt auf
  `activeSlotKey` zurück bei fehlendem Argument.
- `buildResponse(extra, request, slotKey)` — signiert mit Slot
  (oder `activeSlotKey`-Fallback).

**`listSiblings()` / `forgetSibling(nodeId)`:** lesen/schreiben
gegen `siblingsStoreName(activeSlotKey)` — Persona-übergreifende
Sicht ist Aufrufer-Pflicht (über `listIdentities()` iterieren +
`setActiveIdentity` + Modul-Re-Init via Tab-Reload).

**Selbstcheck-Zeile UNVERÄNDERT** (`init/handshake/receiveHandshake/
listSiblings/forgetSibling` — fünf Funktionen heißen weiter gleich).

**`_meta` erweitert:**
- `siblingsStoreBase` / `logStoreBase` (Basis-Namen, Read-Anker).
- Getter `activeSlotKey` (Live-Zustand, null vor init).
- Getter `receiverMapSize` (Live-Zustand).

**Modul-Kopfkommentar** um Bau-05.Y-Block am Anfang.

`node --check src/modules/05_anastomose.js` grün.

### d) Panel 05 in tests/manual_check.html

Neuer Knopf 10 „Test 10: Sekundär-Persona-Vorbereitung (Bau 05.Y —
Tab-Reload nötig)":
- Vorbereitung: `getOrCreateIdentity('test_05y')` +
  `setActiveIdentity('test_05y')`.
- Klaus muss Tab reloaden, dann Test 1 erneut klicken.
- Sibling-Eintrag landet in `sbkim_siblings_test_05y` statt
  `sbkim_siblings_main`.
- Cleanup-Hinweis: `removeIdentity('test_05y', {force:true})` räumt
  die identitäts-spezifischen Stores.

Bestehende neun Knöpfe (Setup + Test 1-7 + Selbstcheck + 9/9a/9b/9c
BroadcastChannel) ohne Strukturänderung.

Panel-Header-Beschreibung um Bau-05.Y-Block erweitert (slot-suffixed
Store-Hinweis + Knopf-10-Beschreibung).

### e) Smoke-Test mit `fake-indexeddb`

Neue Datei `tests/smoke_bau05y_transparent_slot_pfad.mjs`. Fünf
Sub-Probe-Blöcke (Exports/Meta + Probe 1-4):

**Probe 1: Default-Slot „main":**
- `activeSlotKey === "main"`.
- `receiverMapSize === 1` (nur main).
- `sbkim_siblings_main` + `sbkim_anastomosis_log_main` in
  `knownStores`.
- `_invokeDirect(reqP1)` → `outcome:"established"`.
- Sibling-Eintrag in `sbkim_siblings_main` (slot-suffixed).
- `sbkim_siblings` (legacy) bleibt leer für alt.nodeId.
- `listSiblings()` zeigt einen Eintrag.
- Log-Eintrag in `sbkim_anastomosis_log_main`.

**Probe 2: Sekundär-Slot „beruflich":**
- `getOrCreateIdentity('beruflich')` + `setActiveIdentity('beruflich')`.
- Modul-Re-Load (simuliert Tab-Reload).
- `activeSlotKey === "beruflich"`.
- `receiverMapSize === 2` (main + beruflich).

**Probe 3: Empfänger-Pfad nutzt getroffene Persona:**
- active-identity = „beruflich", aber Pseudo-Sender schickt mit
  `toNodeId = main-NodeId`.
- `outcome:"established"`, `receiverSpore.id === mainNodeId`.
- Sibling-Eintrag in `sbkim_siblings_main`, NICHT in
  `sbkim_siblings_beruflich`.
- `active-identity` global unverändert (= „beruflich") — Receiver
  ruft `setActiveIdentity` NICHT.

**Probe 4: Unbekanntes toNodeId:**
- `outcome:"rejected"`, `reason` enthält „toNodeId".
- KEIN Sibling-Eintrag in irgendeinem slot-suffixed Store
  (Map-Miss = kein Storage-Eingriff).

**Ergebnis: 25 Sub-Proben, 25 grün, 0 rot.**

Regression:
- Bau-02.Y-Smoke: 33/33 grün.
- Bau-04.A-Smoke: 19/19 grün.
- Pflege-01-Smoke: 8/8 grün.
- Bau-08.Y-Smoke: 26/26 grün.

### f) Übergabeprotokoll

Diese Datei: `docs/sessions/archiv/2026-05-20_bau-05y-transparent-slot-pfad.md`.

---

## 2. Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Modul 05 Bietet/Storage/Fehler/Garantien
  unverändert; nur Geprüft-Zeile + § 10 Änderungsprotokoll.
- **Receiver-Map-Konvention § 9.4:** Map einmal in `init()` gebaut
  (`nodeId → key`); Pro-Request-Lookup für `toNodeId`-Routing;
  Treffer → getroffene Persona für die Operation; Map-Miss → reject.
- **Aktiver-Slot-Cache im init().** Sender cached `opSlot` zur
  Operations-Zeit (gegen Mid-Operation-Wechsel).
- **Stores pro aktivem/getroffenem Slot:** `sbkim_siblings_<slot>` +
  `sbkim_anastomosis_log_<slot>`. Schreiben über `ensureSlotStores`
  defensiv idempotent (Bau-01.Y).
- **Default-Slot „main" Rückwärts-Kompat:** Pre-Brief-04-Aufrufer
  treffen unverändert auf `_main`-Slots; `toNodeId` fehlt → legacy
  single-identity (activeSlotKey).
- **Bestehende Funktionen unangetastet in äußerer Signatur.**
- **BroadcastChannel-Bridge unverändert** (Spec-Sitzung 2026-05-17
  Pfade laufen weiter; Channel-Receiver geht durch dieselbe
  `receiveHandshake`-Logik).
- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert.

**KEINE Tafel-Spannung.**

---

## 3. Was NICHT angefasst

- **Kein Modul-06/07-Eingriff.** Bau 06.Y / 07.Y kommen mit eigenen
  Bau-Sitzungen.
- **Keine `setActiveIdentity`-Aufrufe aus Modul 05.** Receiver nutzt
  Slot NUR für die Operation; globaler Marker bleibt unangetastet.
- **Kein `refreshIdentityMap()`-Hook.** Re-Init via Tab-Reload
  Spec-konform.
- **Keine Migration der alten nicht-suffixed `sbkim_siblings`-Daten.**
  Aufrufer-Pflicht via `importBackup` (Bau 02.Y).
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.**
- **Keine Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 05 bleibt
  `score:"fertig"`, additive Erweiterung.

---

## 4. Bekannte Limitierung bis Bau 06.Y

Modul 06's `forgetExpiredSiblings`-Pfad liest noch den nicht-suffixed
`sbkim_anastomosis_log`. Der TTL-Sweep läuft fail-soft (Modul 06
wirft nicht, findet aber leere Einträge), bis Bau 06.Y Modul 06's
Lese-Pfad ebenfalls slot-suffixed macht. **Karte 05 § Bauzustand
vermerkt das**; Bau 06.Y muss diesen Punkt mit auflösen.

---

## 5. Sichttest

**ungeprüft**, weil headless gebaut. Wartet auf Klaus' Browser-Lauf:

1. Panel 05 Setup-Knopf — DevTools → Application → IndexedDB →
   `sbkim_siblings_main` + `sbkim_anastomosis_log_main` sichtbar.
2. Panel 05 Test 1 — Sibling-Eintrag landet in `sbkim_siblings_main`.
3. Panel 05 Knopf 10 — Sekundär-Persona `test_05y` anlegen +
   aktivieren; Klaus reloaded Tab; Test 1 erneut → Sibling-Eintrag in
   `sbkim_siblings_test_05y`.
4. BroadcastChannel-Knöpfe 9 / 9a / 9b / 9c — laufen weiterhin
   (Bridge unverändert; receiver-seitig durch `receiveHandshake`-
   Receiver-Map-Lookup).

---

## 6. Vorgeschlagene nächste Schritte

1. **Klaus' Browser-Sichttest Panel 05** — Setup-Knopf zeigt
   `_meta.activeSlotKey` + `receiverMapSize`; Test 1 schreibt in
   slot-suffixed Store; Knopf 10 Sekundär-Persona-Test.
2. **Bau 06.Y schreiben** — Modul 06 Heterokaryose transparenter
   Slot-Pfad. Löst die in Bau-05.Y-Karte-§-Bauzustand notierte
   bekannte Limitierung (TTL-Sweep auf slot-suffixed Log) auf.
   Plus: Modul 06 liest `sbkim_hetero_outbox_<key>` (Bau 08.Y
   schrieb bereits dorthin).
3. **Bau 07.Y schreiben** — Modul 07 Apoptose transparenter
   Slot-Pfad + `_sendLegacyForIdentity`-Hook für
   `removeIdentity(key, {force:true})`. ~3-4 h, komplexer als
   05.Y/06.Y.
4. **Endknoten-Migration** — Mein-Mixarium + Mein-Rezeptbuch — alle
   Bau-02.Y / 04.A / 05.Y / 06.Y / 07.Y / 08.Y produktiv im
   Endknoten-Repo (setzt Schritt 2 + 3 voraus).

---

## 7. PR-Stand

- **PR #117** Bau 08.Y gemerged 2026-05-20 (`main` `54bba18`).
- **PR #118** Bau 08.Y Sichttest-Nachzug gemerged 2026-05-20
  (`main` `a3b5123`).
- **Diese Bau-Sitzung Bau 05.Y:** Branch
  `claude/bau-05y-transparent-slot-pfad-j6mJF`, Draft-PR
  „Bau 05.Y transparenter Slot-Pfad in Modul 05 (Anastomose)".
