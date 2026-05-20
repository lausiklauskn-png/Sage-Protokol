# Bau-Sitzung 2026-05-20 — Bau 06.Y transparenter Slot-Pfad in Modul 06

**Sitzungs-Rolle:** Bau-Sitzung (kein Spec — Brief 04 PR #99 hat das
Pattern in INTERFACES § 1 Modul 06 + § 9.2 + § 9.4 spezifiziert).
Branch `claude/bau-06y-transparent-slot-pfad-j6mJF`, vom `main`
`12bebea` aus angelegt (Stand nach Bau 05.Y PR #119). Zweite der drei
Konsumenten-Bauten (05.Y / 06.Y / 07.Y).

Brief BAU_06Y_TRANSPARENT_SLOT_PFAD (PR #114 gemerged 2026-05-20,
`main` `b92a602`) als Spec-Vorlage.

---

## 1. Was getan

### a) INTERFACES.md zwei Nachzieh-Eingriffe

- § 1 Modul 06 Geprüft-Zeile um „2026-05-20 (Bau 06.Y transparenter
  Slot-Pfad — Receiver-Map nodeId→key live, sbkim_hetero_inbox_<key>
  + Lesen aus sbkim_hetero_outbox_<key> + sbkim_siblings_<key>)"
  erweitert.
- § 10 Änderungsprotokoll neue Zeile.

KEIN Vertrags-Drift.

### b) Karte 06 § Bauzustand neue Zeile

Vollständige Code-Beschreibung der additiven Erweiterung + zwei
aufgelöste Limitierungen (Bau 05.Y Log-Schreib-Pfad slot-suffixed +
Bau 06.Y-Brief „Outbox-Lese-Pfad noch non-suffixed bis Bau 06.Y").

### c) `src/modules/06_heterokaryose.js` Code-Eingriff

Additiv-mit-internem-Refactoring. Keine äußere Signatur-Änderung.

**Konstanten:**
- `SIBLINGS_STORE` / `LOG_STORE` / `INBOX_STORE` / `OUTBOX_STORE` durch
  `_BASE`-Variante ersetzt.
- `KEYS_STORE = "sbkim_keys"` + `DEFAULT_IDENTITY_KEY = "main"` als
  modul-lokale Konstanten.

**Neue Closure-Helper:**
- `siblingsStoreName(slot)` (sync, intern).
- `anastomosisLogStoreName(slot)` (sync).
- `heteroInboxStoreName(slot)` (sync).
- `heteroOutboxStoreName(slot)` (sync).
- `ensureSlotStores(slot)` (async, ruft `SbkimStorage.ensureStore`
  für die zwei Modul-06-Schreib-Stores `sbkim_hetero_inbox_<slot>` +
  `sbkim_anastomosis_log_<slot>`; idempotent dank Bau-01.Y).

**Modul-State:**
- `var activeSlotKey = null` — gecached in `init()` via
  `getActiveIdentityKey()`.
- `var receiverMap = new Map()` — `nodeId → slotKey`, im `init()`
  einmal aufgebaut.
- `var ownPrivateKeyCacheBySlot = new Map()` — pro Slot ein CryptoKey
  (statt einem globalen).

**Hilfsfunktionen:**
- `loadOwnPrivateKey(slotKey?)` — lädt pro Slot aus
  `sbkim_keys[<slot>]`, cached pro Slot.
- `logEntry(peerId, outcome, slotKey?)` — schreibt slot-suffixed Log.
- `readOutboxAnchors(slotKey?)` / `readSporeFallbackAnchors(slotKey?)`
  / `readOwnAnchors(slotKey?)` — Anker-Quelle slot-spezifisch.

**`init()` erweitert:**
1. Bestehende Storage/Spore-init-Pfade unverändert.
2. `getOrCreateIdentity()` — Identität sicherstellen (wie Modul 05).
3. `activeSlotKey = await getActiveIdentityKey()`.
4. `ensureSlotStores(activeSlotKey)`.
5. Receiver-Map über `listIdentities()` × `getOrCreateIdentity(slot)`.

**`requestHeterokaryosis(peerNodeId)`:**
- Cached `opSlot = activeSlotKey` zur Op-Zeit (gegen
  Mid-Operation-Wechsel).
- `ensureSlotStores(opSlot)` defensiv.
- Sibling-Lookup gegen `siblingsStoreName(opSlot)` (slot-suffixed
  nach Bau 05.Y / 06.Y).
- `getOwnSpore(opSlot)` + `loadOwnPrivateKey(opSlot)` +
  `getOrCreateIdentity(opSlot).nodeId` als ownNodeId.
- `consumeResponse(...)` reicht opSlot durch für Inbox-Schreib +
  Log.

**`receiveHeterokaryosis(request)`:**
1. Pre-Checks (Form / senderSpore / version / signature) unverändert.
2. **Receiver-Map-Lookup:** `targetSlot = receiverMap.get(request.toNodeId)`.
   - Map-Treffer → targetSlot als Persona für die Operation.
   - Map-Miss → `outcome:"rejected", reason:"toNodeId stimmt nicht
     zum Empfänger"`, KEIN Storage-Eingriff.
3. `ensureSlotStores(targetSlot)` defensiv.
4. Sibling-Filter gegen `siblingsStoreName(targetSlot)`.
5. Opt-In-Filter (`siblingEntry.heterokaryosisOptIn`).
6. `readOwnAnchors(targetSlot)` für Anker-Quelle.
7. `logEntry(senderId, ..., targetSlot)`.
8. `buildResponse(..., targetSlot)` signiert mit GETROFFENER Persona.
9. **`setActiveIdentity` wird NICHT gerufen** — globaler Marker
   bleibt unangetastet.

**`buildResponse(extra, request, slotKey?)`:** signiert mit dem
übergebenen Slot oder `activeSlotKey`-Fallback bei early rejections.

**`listHeterokaryosis()` / `forgetHeterokaryosis(peerNodeId, ts)`:**
lesen/schreiben gegen `heteroInboxStoreName(activeSlotKey)` —
Persona-übergreifende Sicht ist Aufrufer-Pflicht.

**Test-Brücken:**
- `_buildSignedHeterokaryosisRequest` — signiert mit aktiver Identität.
- `_addPseudoSibling` / `_clearPseudoSiblings` — schreiben in
  `siblingsStoreName(activeSlotKey)` mit defensivem ensureStore.

**Selbstcheck-Zeile UNVERÄNDERT.**

**`_meta` erweitert:**
- `inboxStoreBase` / `outboxStoreBase` / `siblingsStoreBase` /
  `logStoreBase` (Read-Anker).
- Getter `activeSlotKey` (Live-Zustand).
- Getter `receiverMapSize`.

**Modul-Kopfkommentar** um Bau-06.Y-Block am Ende.

`node --check src/modules/06_heterokaryose.js` grün.

### d) Panel 06 in tests/manual_check.html

Neuer Knopf 15 „Test 15: Sekundär-Persona-Vorbereitung (Bau 06.Y —
Tab-Reload nötig)". Analog Panel 05 Knopf 10. Bestehende 13 Knöpfe
ohne Strukturänderung. Panel-Header um Bau-06.Y-Block erweitert
(slot-suffixed Store-Namen + Knopf-15-Beschreibung).

### e) Smoke-Test mit fake-indexeddb

Neue Datei `tests/smoke_bau06y_transparent_slot_pfad.mjs`. Vier
Proben:

**Probe 1: Default-Slot „main":**
- `activeSlotKey === "main"`, `receiverMapSize === 1`.
- Stores in `knownStores`: `sbkim_hetero_inbox_main` +
  `sbkim_anastomosis_log_main`.
- `_invokeReceiveHeterokaryosisDirect(reqP1)` → `outcome:"shared"`.
- `receiverSpore.id === mainNodeId`.
- Log-Eintrag in `sbkim_anastomosis_log_main`.
- Non-suffixed `sbkim_anastomosis_log` bleibt frei von Bau-06.Y-
  Einträgen.

**Probe 2: Sekundär-Slot „beruflich":**
- `setActiveIdentity('beruflich')` + Modul-Re-Load.
- `activeSlotKey === "beruflich"`, `receiverMapSize === 2`.

**Probe 3: Receiver-Pfad nutzt getroffene Persona:**
- active = „beruflich", request mit `toNodeId = main-NodeId`.
- `outcome:"shared"`, `receiverSpore.id === mainNodeId`.
- Log-Eintrag in `sbkim_anastomosis_log_main`, NICHT in
  `sbkim_anastomosis_log_beruflich`.
- `active-identity` global unverändert (= „beruflich").

**Probe 4: Unbekanntes toNodeId:**
- `outcome:"rejected"`, `reason` enthält „toNodeId".
- KEIN Log-Eintrag in irgendeinem slot-Log.

**Plus:** `listHeterokaryosis()` für aktiven Slot (beruflich, leer)
prüft slot-spezifischen Lese-Pfad.

**Ergebnis: 25 Sub-Proben, 25 grün, 0 rot.**

Regression:
- Bau-02.Y-Smoke: 33/33 grün.
- Bau-04.A-Smoke: 19/19 grün.
- Pflege-01-Smoke: 8/8 grün.
- Bau-05.Y-Smoke: 25/25 grün.
- Bau-08.Y-Smoke: 26/26 grün.

### f) Übergabeprotokoll

Diese Datei: `docs/sessions/archiv/2026-05-20_bau-06y-transparent-slot-pfad.md`.

---

## 2. Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Modul 06 Bietet/Storage/Fehler/Garantien
  UNVERÄNDERT.
- **Receiver-Map-Konvention § 9.4** analog Bau 05.Y.
- **Map einmal pro init() gebaut.** KEIN
  `refreshIdentityMap()`-Hook. Re-Init via Tab-Reload.
- **`receiveHeterokaryosis` ruft NICHT `setActiveIdentity`.**
- **Sender-Pfad nutzt den aktiven Slot, cached zur Op-Zeit.**
- **`ensureStore` defensiv** für Modul-06-Schreib-Stores.
- **Outbox-Lese-Pfad fail-soft** auf Spore-Single-Anker (unverändert,
  jetzt slot-suffixed).
- **Anker-Quelle:** Sign-Pfad nutzt die getroffene Persona.
- **Default-Slot „main" Rückwärts-Kompat.**
- **Bestehende Funktionen in äußerer Signatur gültig.**
- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert.

**KEINE Tafel-Spannung.**

---

## 3. Was NICHT angefasst

- Kein Modul-05/07/08-Eingriff.
- Kein `refreshIdentityMap()`-Hook.
- Keine `setActiveIdentity`-Aufrufe aus Modul 06.
- Keine Migration der alten nicht-suffixed `sbkim_hetero_inbox`-Daten.
- Kein `PROTOCOL_VERSION`/`DB_VERSION`/`BACKUP_FORMAT_VERSION`-Bump.
- Keine Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.
- `status.json` unverändert (Modul 06 bleibt `score:"fertig"`).
- `update_puls_pie.py` NICHT aufgerufen.

---

## 4. Aufgelöste Limitierungen

Mit Bau 06.Y schließen sich zwei Limitierungen aus früheren Bau-Sitzungen:

1. **Bau-05.Y notierte:** „Modul 06's `forgetExpiredSiblings`-Pfad
   liest noch den nicht-suffixed `sbkim_anastomosis_log` — fail-soft
   bis Bau 06.Y." → **Aufgelöst:** Modul 06's Log-Schreib- und
   Lese-Pfad ist jetzt slot-suffixed.
2. **Bau-06.Y-Brief notierte:** „Modul 06 liest aus
   `sbkim_hetero_outbox_<key>` — Modul 08 schreibt heute in
   nicht-suffixed Store; Bau 08.Y zieht nach." → **Bereits aufgelöst
   durch Bau 08.Y (PR #117).** Modul 08 schreibt slot-suffixed,
   Modul 06 liest slot-suffixed.

Damit ist die ganze Konsumenten-Achse 05/06/08 jetzt geschlossen-
konsistent slot-suffixed. Nur Bau 07.Y (Modul 07 Apoptose +
`_sendLegacyForIdentity`-Hook) fehlt noch.

---

## 5. Sichttest

**ungeprüft**, weil headless gebaut. Wartet auf Klaus' Browser-Lauf:

1. Panel 06 Setup-Knopf — DevTools → Application → IndexedDB →
   `sbkim_hetero_inbox_main` + `sbkim_anastomosis_log_main` sichtbar.
2. Panel 06 Test 1 — `outcome:"shared"`, Inbox-Eintrag in
   `sbkim_hetero_inbox_main`.
3. Panel 06 Test 9 — HETERO_MAX_ANCHORS-Begrenzung (sechs Outbox-
   Einträge → fünf in Response). Outbox-Stores sind jetzt
   `sbkim_hetero_outbox_main` (Modul-08-Schreiber-Pfad nach
   Bau 08.Y).
4. Panel 06 Knopf 15 — Sekundär-Persona `test_06y` anlegen +
   aktivieren; Klaus reloaded Tab; Setup + Test 1 erneut →
   Inbox-Eintrag in `sbkim_hetero_inbox_test_06y`.

---

## 6. Vorgeschlagene nächste Schritte

1. **Klaus' Browser-Sichttest Panel 06** — Setup-Knopf zeigt
   `_meta.activeSlotKey` + `receiverMapSize`; Test 9 nutzt
   slot-suffixed Outbox-Store; Knopf 15 Sekundär-Persona-Test.
2. **Bau 07.Y schreiben** — Modul 07 Apoptose transparenter
   Slot-Pfad + `_sendLegacyForIdentity`-Hook für
   `removeIdentity(key, {force:true})`. ~3-4 h (komplexer wegen
   per-Persona-Cleanup-Aufspaltung + globaler Self-Apoptose-
   Iteration). Schließt die letzte Konsumenten-Bau-Sitzung der
   Brief-99-Pipeline.
3. **Endknoten-Migration (Mein-Mixarium + Mein-Rezeptbuch)** — alle
   Bau-02.Y / 04.A / 05.Y / 06.Y / 07.Y / 08.Y produktiv im
   Endknoten-Repo verfügbar machen (setzt Schritt 2 voraus).
4. **Vision-Anker 5 Identitäts-Container Spec-Sitzung** (optional).

---

## 7. PR-Stand

- **PR #117** Bau 08.Y gemerged 2026-05-20 (`main` `54bba18`).
- **PR #118** Bau 08.Y Sichttest-Nachzug gemerged 2026-05-20
  (`main` `a3b5123`).
- **PR #119** Bau 05.Y gemerged 2026-05-20 (`main` `12bebea`).
- **Diese Bau-Sitzung Bau 06.Y:** Branch
  `claude/bau-06y-transparent-slot-pfad-j6mJF`, Draft-PR
  „Bau 06.Y transparenter Slot-Pfad in Modul 06 (Heterokaryose)".
