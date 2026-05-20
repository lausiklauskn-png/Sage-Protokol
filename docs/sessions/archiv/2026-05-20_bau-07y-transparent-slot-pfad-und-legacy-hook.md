# Bau-Sitzung 2026-05-20 — Bau 07.Y transparenter Slot-Pfad + `_sendLegacyForIdentity`-Hook in Modul 07

**Sitzungs-Rolle:** Bau-Sitzung (kein Spec — Brief 04 PR #99 hat alles
spezifiziert; Bau 02.Y ruft den Hook bereits fail-soft). Branch
`claude/bau-07y-transparent-slot-pfad-und-legacy-hook-j6mJF`, vom
`main` `48a1abd` aus angelegt. **Dritte und letzte der drei
Konsumenten-Bauten** (05.Y / 06.Y / 07.Y).

Brief BAU_07Y_TRANSPARENT_SLOT_PFAD_UND_LEGACY_HOOK (PR #115 gemerged
2026-05-20, `main` `cf38d0f`) als Spec-Vorlage.

---

## 1. Drei Eingriffe in Modul 07

### Eingriff 1: Transparenter Slot-Pfad

`src/modules/07_apoptose.js` schreibt jetzt slot-spezifisch in
`sbkim_legacy_inbox_<key>` und `sbkim_anastomosis_log_<key>`; liest
aus `sbkim_siblings_<key>` (Bau 05.Y) und im Cleanup-Pfad zusätzlich
aus `sbkim_hetero_inbox_<key>` (Bau 06.Y) + `sbkim_hetero_outbox_<key>`
(Bau 08.Y). Receiver-Pfad (`receiveLegacy`) nutzt eine `nodeId →
slotKey`-Map (im `init()` einmal aus `SbkimSpore.listIdentities()` ×
`SbkimSpore.getOrCreateIdentity(slot)` aufgebaut). `setActiveIdentity`
wird NICHT gerufen.

### Eingriff 2: Globale `confirmSelfApoptose` über alle Slots

`confirmSelfApoptose(token, reason)` komplett umgeschrieben:
1. Token-Check unverändert (60 s TTL).
2. `slots = await SbkimSpore.listIdentities()`.
3. PRO Slot `await _sendLegacyForIdentity(slot, reason)` (fail-soft,
   aggregiert `recipientsNotified` + `recipientsFailed`).
4. PRO Slot Cleanup über `CLEANUP_ORDER_BASES = [siblings,
   anastomosis_log, legacy_inbox, hetero_inbox, hetero_outbox]`
   (clear) + `del(sbkim_spore, slot)` + `del(sbkim_keys, slot)`.
5. Global `del(sbkim_meta, "active-identity")`.
6. Closure-Caches invalidiert (`ownPrivateKeyCacheBySlot.clear()` +
   `pseudoSiblings = null` + `activeSlotKey = null` + `receiverMap =
   new Map()`) + `SbkimSpore.resetIdentityCache()`.

Return: globales `{outcome:"completed", recipientsNotified,
recipientsFailed}` mit aggregierten Listen aus allen Slots.

### Eingriff 3: `_sendLegacyForIdentity(key, reason?)` neu

**Interner Hook**, exportiert auf `window.SbkimApoptose._sendLegacyForIdentity`.
Aufrufer:
- **(a) Bau 02.Y `removeIdentity(key, {force:true})`** via typeof-check
  (Modul 02 schluckt Würfe fail-soft).
- **(b) `confirmSelfApoptose`** iteriert über alle Slots und ruft den
  Hook pro Slot.

Pflicht:
- Sendet Persona-Vermächtnis an Geschwister DIESER Persona (gelesen
  aus `sbkim_siblings_<key>`).
- Signiert PRO Sibling separat mit `toNodeId: sibling.nodeId` für
  Receiver-Map-Routing beim Empfänger (Bau 05.Y / 06.Y / 07.Y).
- **KEIN Store-Cleanup** — Modul 02 räumt nach Bau 02.Y für per-
  Persona-Apoptose; `confirmSelfApoptose` räumt nach diesem Hook.

Fail-soft: returns `{recipientsNotified, recipientsFailed}` (auch bei
vielen Fehlern); wirft nur bei klaren Aufrufer-Fehlern (key fehlt /
nicht-String). Default-Reason `"Persona-Apoptose (slot=<key>)"` wenn
Aufrufer keinen liefert.

---

## 2. Sechs Punkte a–f

### a) INTERFACES.md

- § 1 Modul 07 Geprüft-Zeile um „2026-05-20 (Bau 07.Y transparenter
  Slot-Pfad + `_sendLegacyForIdentity`-Hook produktiv)" erweitert.
- § 10 Änderungsprotokoll neue Zeile.

KEIN Vertrags-Drift.

### b) Karte 07

§ Bauzustand neue Zeile mit vollständiger Code-Beschreibung.

### c) `src/modules/07_apoptose.js` Code-Eingriff

(Detail siehe oben + Patches in src/modules/07_apoptose.js)

**Selbstcheck-Zeile UNVERÄNDERT**:
```
MODUL 07 APOPTOSE bereit, Funktionen: init/prepareSelfApoptose/
confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings
```

`node --check src/modules/07_apoptose.js` grün.

### d) Panel 07

Bestehende neun Knöpfe ohne Strukturänderung. Cleanup-Pfad nach
Bau 07.Y transparent slot-suffixed; Tests prüfen weiterhin korrektes
Verhalten.

### e) Smoke-Test mit fake-indexeddb

Neue Datei `tests/smoke_bau07y_transparent_slot_pfad_und_legacy_hook.mjs`.
Fünf Proben:

**Probe 1: Default-Slot „main" — receiveLegacy + listLegacy**
- `activeSlotKey === "main"`, `receiverMapSize === 1`.
- `_invokeReceiveLegacyDirect(legacyP1)` → `outcome:"accepted"`.
- Inbox-Eintrag in `sbkim_legacy_inbox_main`.
- `listLegacy()` zeigt einen Eintrag.

**Probe 2: Sekundär-Slot „test_07y" — listLegacy(key)**
- `setActiveIdentity('test_07y')` + Modul-Re-Load.
- `activeSlotKey === "test_07y"`, `receiverMapSize === 2`.
- `listLegacy('test_07y')` leer; `listLegacy('main')` zeigt Probe-1-
  Eintrag (explizite Persona-Wahl).

**Probe 3: Empfänger-Pfad mit unbekanntem toNodeId**
- `outcome:"rejected"`, `reason` enthält „toNodeId".
- KEIN Inbox-Eintrag in irgendeinem Slot.

**Probe 4: `_sendLegacyForIdentity('main')` — Hook produktiv**
- Hook resolved fail-soft (kein Throw).
- Liefert Arrays `recipientsNotified` + `recipientsFailed`.
- Hook macht KEINEN Cleanup: `sbkim_keys[main]` + `sbkim_spore[main]`
  bleiben erhalten.

**Probe 5: Globale `confirmSelfApoptose` über main + test_07y**
- `prepareSelfApoptose` liefert `confirmationToken` (string).
- `recipientCount = 1` (globale Summe über alle Slots).
- `confirmSelfApoptose` → `outcome:"completed"`.
- Nach Apoptose: `listIdentities()` leer.
- `sbkim_meta["active-identity"]` cleared.
- Pro Slot `sbkim_keys[slot]` + `sbkim_spore[slot]` gelöscht.
- `getNodeId()` wirft `NoIdentityError`.
- `_meta.activeSlotKey` null.

**Ergebnis: 30 Sub-Proben, 30 grün, 0 rot.**

Regression:
- Bau-02.Y-Smoke: 33/33 grün.
- Bau-04.A-Smoke: 19/19 grün.
- Pflege-01-Smoke: 8/8 grün.
- Bau-05.Y-Smoke: 25/25 grün.
- Bau-06.Y-Smoke: 25/25 grün.
- Bau-08.Y-Smoke: 26/26 grün.

### f) Übergabeprotokoll

Diese Datei.

---

## 3. Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Modul 07 Bietet/Storage/Fehler/Garantien
  UNVERÄNDERT (außer Geprüft-Zeile + § 10).
- **`_sendLegacyForIdentity(key)` ist INTERNER Hook** — auf
  `window.SbkimApoptose._sendLegacyForIdentity` exportiert. Modul
  02's typeof-check sucht da.
- **Globale Self-Apoptose iteriert über alle Slots** mit pro-Slot
  Vermächtnis + Cleanup.
- **Per-Persona-Apoptose läuft NICHT durch Modul 07** — sie ist
  Modul 02's `removeIdentity(key, {force:true})`-Pfad, der den Hook
  ruft. Modul 07's `confirmSelfApoptose` bleibt **globale Self-
  Apoptose**.
- **Receiver-Map-Konvention § 9.4** analog Bau 05.Y / 06.Y.
- **KEIN `setActiveIdentity` aus Modul 07.**
- **`forgetExpiredSiblings(maxAgeMs, key?)` + `listLegacy(key?)`**
  um optionalen key-Parameter erweitert (Default = aktiver Slot;
  rückwärtskompatibel).
- **`ensureStore` defensiv** vor jedem ersten Schreibvorgang.
- **Cleanup-Reihenfolge** (CLEANUP_ORDER_BASES) verbindlich pro Slot:
  siblings → log → legacy_inbox → hetero_inbox → hetero_outbox.
- **Default-Slot „main" Rückwärts-Kompat.**
- **Bestehende Funktionen in äußerer Signatur gültig**
  (außer optionalen key-Parametern, rückwärtskompatibel).
- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert.

**KEINE Tafel-Spannung.**

---

## 4. Was NICHT angefasst

- **Kein Modul-02-Eingriff.** Bau 02.Y hat den fail-soft-Aufruf
  bereits; Modul 07's Hook fügt sich nahtlos ein.
- Kein Modul-05/06/08-Eingriff.
- Kein `setActiveIdentity`-Aufruf aus Modul 07.
- Keine Migration alter nicht-suffixed Daten.
- Kein `PROTOCOL_VERSION`/`DB_VERSION`/`BACKUP_FORMAT_VERSION`-Bump.
- Keine Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.
- `status.json` unverändert (Modul 07 bleibt `score:"fertig"`).
- `update_puls_pie.py` NICHT aufgerufen.

---

## 5. Konsumenten-Achse 05/06/07/08 jetzt vollständig slot-suffixed

Mit Bau 07.Y schließt sich die Pipeline der vier Konsumenten-Bauten
aus Brief 99:

- **Modul 05 (Anastomose)** schreibt slot-suffixed Siblings + Log.
- **Modul 06 (Heterokaryose)** schreibt slot-suffixed Inbox + Log;
  liest slot-suffixed Outbox + Siblings.
- **Modul 07 (Apoptose)** schreibt slot-suffixed Legacy-Inbox + Log;
  liest slot-suffixed Siblings + (im Cleanup) Hetero-Stores.
- **Modul 08 (UI-Demo)** schreibt slot-suffixed Outbox; co-schreibt
  Siblings.

**Bau-02.Y-fail-soft-Klausel aufgelöst:** Modul 02's typeof-check
für `_sendLegacyForIdentity` findet den Hook jetzt; `console.warn`-
Pfad verschwindet automatisch ohne Modul-02-Code-Änderung.

---

## 6. Sichttest

**ungeprüft**, weil headless gebaut. Wartet auf Klaus' Browser-Lauf:

1. Panel 07 Setup-Knopf — DevTools → Application → IndexedDB →
   `sbkim_legacy_inbox_main` + `sbkim_anastomosis_log_main` sichtbar.
2. Panel 07 Test 1 (receiveLegacy round-trip) — Inbox-Eintrag in
   `sbkim_legacy_inbox_main`.
3. Panel 07 Test 6 (Self-Apoptose IRREVERSIBEL) — globale Apoptose
   über alle Slots; nach Ablauf alle Stores leer und
   `NoIdentityError` beim Re-Aufruf.
4. Panel 07 Test 4 (TTL-Cleanup) nutzt nach Bau 07.Y aktiven Slot.
5. Panel 02 Knopf 9 (Persona-Apoptose mit force=true) — Modul 02's
   typeof-check findet jetzt `_sendLegacyForIdentity` und ruft ihn
   produktiv (kein `console.warn` mehr).

---

## 7. Vorgeschlagene nächste Schritte

1. **Klaus' Browser-Sichttest Panel 07** — insbesondere Test 6
   Self-Apoptose globale Slot-Iteration + Panel 02 Knopf 9
   Persona-Apoptose ohne `console.warn`.
2. **Endknoten-Migration (Mein-Mixarium + Mein-Rezeptbuch)** — alle
   Bau-02.Y / 04.A / 05.Y / 06.Y / 07.Y / 08.Y produktiv im
   Endknoten-Repo verfügbar machen. Konsumenten-Achse 05/06/07/08
   ist jetzt vollständig — Multi-Persona-Pfad live.
3. **Bau 04.B explainMatchLLM** (parallel zur Endknoten-Migration) —
   Stufe-B LLM-Erweiterung in Modul 04. Brief BAU_04B (PR #112)
   gemerged. ~3-4 h, braucht User-Key-Test-Brücke.
4. **Vision-Anker 5 Identitäts-Container Spec-Sitzung** (optional) —
   löst die User-Key-Test-Brücke aus Bau 04.B mit produktivem
   sicheren Pfad.

---

## 8. PR-Stand

- **PR #117** Bau 08.Y gemerged 2026-05-20 (`main` `54bba18`).
- **PR #118** Bau 08.Y Sichttest-Nachzug gemerged (`main` `a3b5123`).
- **PR #119** Bau 05.Y gemerged (`main` `12bebea`).
- **PR #120** Bau 06.Y gemerged (`main` `48a1abd`).
- **Diese Bau-Sitzung Bau 07.Y:** Branch
  `claude/bau-07y-transparent-slot-pfad-und-legacy-hook-j6mJF`,
  Draft-PR „Bau 07.Y transparenter Slot-Pfad + `_sendLegacyForIdentity`-
  Hook in Modul 07 (Apoptose)".
