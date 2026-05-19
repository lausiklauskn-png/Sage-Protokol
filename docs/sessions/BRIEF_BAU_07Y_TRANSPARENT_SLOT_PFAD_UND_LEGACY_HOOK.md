# Brief — Bau-Sitzung 07.Y Transparenter Slot-Pfad in Modul 07 (Apoptose) + `_sendLegacyForIdentity`-Hook

**Bau-Sitzung** (kein Spec — Brief 04 hat identitäts-spezifische
Store-Pattern, globale-vs-per-Persona-Apoptose und
`_sendLegacyForIdentity`-Hook in INTERFACES § 1 Modul 07 + § 9.2 +
§ 9.4 vollständig spezifiziert; Bau 02.Y ruft den Hook bereits
fail-soft). Voraussetzung: Brief 04 (PR #99), Bau 02.Y (PR #104),
Pflege Modul 01 (PR #107), Bau 04.A (PR #110), Brief BAU_05Y (PR #113),
Brief BAU_06Y (PR #114). Bau 07.Y kann **vor oder nach Bau 05.Y/06.Y
gebaut werden** — parallelisierbar.

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Bau 07.Y Transparenter
Slot-Pfad in Modul 07 (Apoptose) + `_sendLegacyForIdentity`-Hook.

Branch: claude/bau-07y-transparent-slot-pfad-und-legacy-hook
        (vom main aus anlegen)

Sitzungs-Rolle: Bau (kein Spec — Brief 04 hat alles spezifiziert).
Drei Eingriffe in Modul 07:
1) Transparenter Slot-Pfad — `sbkim_legacy_inbox_<key>` und
   `sbkim_anastomosis_log_<key>` statt nicht-suffixed Stores.
2) Globale Self-Apoptose iteriert über alle Slots aus
   `listIdentities()`.
3) Neuer interner Hook `_sendLegacyForIdentity(key)` — Bau 02.Y ruft
   den heute fail-soft (typeof-check, `console.warn` wenn fehlt);
   nach Bau 07.Y ist der Hook produktiv, fail-soft-Aufruf in Modul
   02 bleibt unverändert (Hook ist jetzt da, der typeof-check liefert
   true, Funktion wird gerufen).

KEIN Vertrags-Eingriff in Bietet/Storage/Fehler-Block — das ist Brief
04, gemerged.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (§ Heilige Tafeln § Tafel-Evolutions-Klausel).
2. docs/PULS.md (§ Sitzungs-Einträge oben für Pipeline-Kontext;
   § Vision-Anker 6 Status — Bau 02.Y verwies bereits auf
   `_sendLegacyForIdentity`-Hook in Modul 07).
3. docs/INTERFACES.md
   - § 1 Modul 02 — fail-soft-Aufruf `_sendLegacyForIdentity` aus
     `removeIdentity` mit force; Modul 02 erwartet keine Garantie,
     Hook kann fehlen
   - § 1 Modul 07 (Apoptose) — VOLLER Vertrag inkl. identitäts-
     spezifischer Store-Pattern, globaler Self-Apoptose mit Slot-
     Iteration, `_sendLegacyForIdentity`-Hook-Spec, `forgetExpiredSiblings(maxAgeMs, key?)`-
     Erweiterung um optionalen key-Parameter, `listLegacy(key?)`
     analog
   - § 9.1-9.4 (Slot-Schema, Stores, active-identity, Receiver-Pfad)
4. docs/components/07_apoptose.md (Karte 07) — du erweiterst
   § Manueller Test + § Bauzustand
5. src/modules/07_apoptose.js — du erweiterst den Code
6. src/modules/02_spore.js — NUR den `_sendLegacyForIdentity`-
   typeof-check-Pfad lesen (Bau 02.Y), KEIN Eingriff dort

Heilige Tafeln (Bau-07Y-spezifisch):

- **INTERFACES verbindlich.** Modul 07 Bietet/Storage/Fehler/Garantien
  UNVERÄNDERT. Nur Geprüft-Zeile + § 10 Änderungsprotokoll-Zeile.

- **`_sendLegacyForIdentity(key)` ist INTERNER Hook in Modul 07.**
  Aufrufer ist Modul 02 (`removeIdentity` mit force). Hook-Form:
  `async function _sendLegacyForIdentity(key)` — sendet das
  Persona-Vermächtnis an die Geschwister DIESER Persona (gelesen aus
  `sbkim_siblings_<key>`), KEIN globaler Cleanup; Modul 02 räumt
  Stores danach selbst auf (siehe Bau 02.Y `removeIdentity`-Pfad).
  **Auf `window.SbkimApoptose._sendLegacyForIdentity` exportiert**
  (Modul 02's typeof-check sucht da). Fehler-Behandlung: Hook darf
  intern try/catch um Send-Fehler haben (Vermächtnis-Versand ist
  fail-soft, ein nicht-erreichbares Geschwister blockt die Apoptose
  nicht); Throw aus dem Hook wird in Modul 02 vom Bau-02.Y-fail-soft-
  catch geschluckt (siehe Modul 02 Code). Aber: idealer Pfad ist,
  dass Modul 07 selbst fail-soft sendet und resolved.

- **Globale Self-Apoptose (`confirmSelfApoptose`) iteriert über alle
  Slots:**
  1. `slots = await SbkimSpore.listIdentities()`.
  2. Pro `slot`: Vermächtnis-Versand via
     `_sendLegacyForIdentity(slot)` (fail-soft).
  3. Danach Cleanup: alle identitäts-spezifischen Stores leeren PRO
     Slot (sbkim_siblings_<slot> / sbkim_anastomosis_log_<slot> /
     sbkim_legacy_inbox_<slot> / sbkim_hetero_inbox_<slot> /
     sbkim_hetero_outbox_<slot>), plus sbkim_keys[slot] +
     sbkim_spore[slot] löschen, plus sbkim_meta["active-identity"]
     löschen.
  4. Nach allen Slots: `SbkimSpore.resetIdentityCache()` (Pflege-
     2026-05-15-Hook).

- **Per-Persona-Apoptose** läuft NICHT durch Modul 07 — sie ist Modul
  02's `removeIdentity(key, {force:true})`-Pfad, der wiederum den
  Hook in Modul 07 ruft (Vermächtnis-Versand für die eine Persona),
  dann selbst Store-Cleanup für den einen Slot macht (Modul-02-
  Verantwortung gemäß Bau 02.Y). Modul 07's `confirmSelfApoptose`
  bleibt **globale Self-Apoptose** über alle Slots.

- **Receiver-Map-Konvention (§ 9.4)** für `receiveLegacy` analog Bau
  05.Y / 06.Y: `init()` baut `Map<nodeId, key>`; pro eingehendem
  Legacy `request.toNodeId`-Lookup. Treffer → Slot für die
  Operation; Inbox-Schreiben in `sbkim_legacy_inbox_<targetSlotKey>`.
  Kein Treffer → Legacy verwerfen (kein Throw, kein Logging — analog
  Modul 05/06).

- **KEIN `setActiveIdentity` aus Modul 07.** Receiver nutzt
  getroffenen Slot nur für die Operation; globaler Marker
  unangetastet.

- **`forgetExpiredSiblings(maxAgeMs, key?)`** erweitert um optionalen
  key-Parameter:
  - `key` fehlt / `null` → liest `sbkim_anastomosis_log_<activeKey>`
    + `sbkim_siblings_<activeKey>` (aktive Persona).
  - `key` String → liest `sbkim_anastomosis_log_<key>` +
    `sbkim_siblings_<key>` (Aufrufer-getriebene Persona-Wahl;
    nutzbar für persona-übergreifende TTL-Sweeps durch Aufrufer-
    Iteration).

- **`listLegacy(key?)`** analog: `key` fehlt → aktive Persona;
  `key` String → Persona-Wahl.

- **`ensureStore` defensiv vor jedem ersten Schreibvorgang** pro
  Slot. Stores: `sbkim_legacy_inbox_<key>`,
  `sbkim_anastomosis_log_<key>`, `sbkim_siblings_<key>`,
  `sbkim_hetero_inbox_<key>`, `sbkim_hetero_outbox_<key>` (alle fünf
  für den globalen Cleanup-Pfad).

- **Cleanup-Reihenfolge (Karte 07):** alphabetisch sortiert nach
  Store-Basis, dann pro Slot ein voller Reihen-Durchlauf. Genaue
  Reihenfolge in Karte 07 § Cleanup-Reihenfolge nachlesen
  (Pflege Bau 06 + Pflege 02+07-Cache-Invalidate 2026-05-15).

- **Default-Slot „main" Rückwärts-Kompat:** Pre-Brief-04-Aufrufer
  treffen unverändert auf `_main`-Slots.

- **Bestehende Funktionen unangetastet in der äußeren Signatur**
  (außer Erweiterung um optionalen `key`-Parameter, die rückwärts-
  kompatibel ist).

- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert.

Deine Aufgabe heute — sechs Punkte a–f:

a) **INTERFACES.md** § 1 Modul 07 Geprüft-Zeile + § 10
   Änderungsprotokoll-Zeile.

b) **Karte 07** § Manueller Test (Cleanup-Pfad-Anpassung; Sekundär-
   Persona-Knopf wenn sinnvoll), § Cleanup-Reihenfolge falls
   Erweiterung nötig, § Bauzustand neue Zeile.

c) **src/modules/07_apoptose.js** erweitern:

   - **Modul-State um Slot-Cache + Receiver-Map** (analog Bau 05.Y).
   - **Helper-Funktionen pro Store-Basis:**
     `legacyInboxStoreName(key)`, `anastomosisLogStoreName(key)`,
     `siblingsStoreName(key)`, `heteroInboxStoreName(key)`,
     `heteroOutboxStoreName(key)`, `ensureSlotStores(key)` (ruft
     `SbkimStorage.ensureStore` für alle fünf identitäts-spezifischen
     Stores).
   - **`init()` erweitern:** aktiven Slot cachen + Receiver-Map über
     `listIdentities()` × `getOrCreateIdentity`-Resolution +
     `ensureSlotStores(activeSlotKey)` defensiv.
   - **Neue interne Funktion `async function _sendLegacyForIdentity(key)`:**
     1. Sync-Check: `key` ist nicht-leerer String — sonst Throw
        (Aufrufer-Fehler; Modul 02 würde das fail-soft schlucken,
        aber Defensive ist gut).
     2. `siblings = await
        SbkimStorage.all(siblingsStoreName(key))` — fail-soft, leere
        Liste bei UnknownStoreError.
     3. Pro Sibling: Vermächtnis-LegacyMessage bauen (signiert mit
        Persona-Identität via `getOrCreateIdentity(key)`-Pfad),
        `fetch` POST an `sibling.endpoint + ENDPOINT.legacy`
        (`/sbkim/legacy`), fail-soft (Errors geloggt, nicht geworfen
        — analog `confirmSelfApoptose`-Pfad).
     4. Resolved nach Versand-Schleife (auch bei vielen Fehlern —
        Apoptose darf nicht blocken).
     5. **WICHTIG:** dieser Hook MACHT KEINEN Store-Cleanup! Cleanup
        ist Modul 02's `removeIdentity`-Pflicht.
   - **`window.SbkimApoptose._sendLegacyForIdentity = _sendLegacyForIdentity`**
     im Export.
   - **`confirmSelfApoptose(token)` erweitern** auf globale-über-alle-
     Slots-Schleife:
     1. Token-Check (60 s, bestehend).
     2. `slots = await SbkimSpore.listIdentities()`.
     3. Pro `slot`: `await _sendLegacyForIdentity(slot).catch(noop)`
        (fail-soft, kein blocker).
     4. Cleanup pro Slot: `clear` auf alle fünf identitäts-
        spezifischen Stores + `del(sbkim_keys, slot)` + `del(sbkim_
        spore, slot)`.
     5. Globaler Marker: `del(sbkim_meta, "active-identity")`.
     6. `SbkimSpore.resetIdentityCache()` als letzter Schritt
        (Pflege-2026-05-15-Hook).
   - **`receiveLegacy(legacyMessage)` erweitern** mit Receiver-Map-
     Lookup für `legacyMessage.toNodeId`. Treffer → Inbox-Schreib in
     `sbkim_legacy_inbox_<targetSlotKey>`. Kein Treffer → Verwerfen
     ohne Throw.
   - **`forgetExpiredSiblings(maxAgeMs, key?)`** und
     **`listLegacy(key?)`** um optionalen key-Parameter erweitern;
     Default = aktiver Slot.
   - **Selbstcheck-Zeile** bleibt unverändert (Hook ist intern, nicht
     in der Selbstcheck-Liste).
   - **`_meta`** um `activeSlotKey` + `receiverMapSize` (Getter).
   - **Modul-Kopfkommentar** um Bau-07.Y-Block am Ende.

d) **tests/manual_check.html Panel 07:** bestehende Knöpfe nach
   Slot-Suffix-Sicht aktualisieren; **neuer Knopf für
   `_sendLegacyForIdentity('main')`**-Probe (Test-Brücke, ruft den
   Hook direkt — typischer Test mit Pseudo-Siblings via `_clearPseudoSiblings`-Test-Brücke
   aus Modul 08, falls vorhanden, sonst Modul-07-eigene Setup-
   Sequenz). Alle Inline-Scripts validieren.

e) **Smoke-Test fake-indexeddb** `tests/smoke_bau07y_transparent_slot_pfad.mjs`:
   - Probe 1: Default-Slot — receiveLegacy + listLegacy lesen aus
     `sbkim_legacy_inbox_main`.
   - Probe 2: Sekundär-Slot — `listLegacy('test_07y')` liest aus
     `sbkim_legacy_inbox_test_07y`.
   - Probe 3: Empfänger-Pfad — receiveLegacy mit unbekanntem
     toNodeId → silent verworfen (kein Throw, kein Storage-Eingriff).
   - Probe 4: `_sendLegacyForIdentity('main')` — Hook ruft fetch-Stub;
     resolved erfolgreich, fail-soft auch wenn alle siblings Fehler.
   - Probe 5: Globale `confirmSelfApoptose` mit zwei Slots (main +
     beruflich) — pro Slot Hook gerufen, danach pro Slot Cleanup.
     Nach Ablauf: `listIdentities()` ist leer, sbkim_meta cleared,
     Cache reset.
   Regression-Smoke-Tests alle grün.

f) **Übergabeprotokoll** in
   `docs/sessions/archiv/2026-05-XX_bau-07y-transparent-slot-pfad-und-legacy-hook.md`.

Was du NICHT tust:

- **Kein Modul-02-Eingriff.** Bau 02.Y hat den fail-soft-Aufruf
  bereits; Modul 07's Hook fügt sich nahtlos ein. Modul 02 ruft
  weiterhin via typeof-check — wenn der Hook existiert (jetzt nach
  Bau 07.Y), wird er gerufen.
- **Kein Modul-05/06/08-Eingriff.**
- **Kein `setActiveIdentity` aus Modul 07.**
- **Keine Bau-02.Y-Sichttest-Wiederholung.** `_sendLegacyForIdentity`
  ist jetzt produktiv — Modul 02's `removeIdentity('test', {force:
  true})` ruft ihn ohne `console.warn` (war fail-soft). Das ist
  Verhaltens-Verbesserung, nicht Test-Bruch.
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **Keine Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 07 bleibt
  `score:"fertig"`, additive Erweiterung + Hook-Implementierung.

Pflicht am Ende der Sitzung: übliche Disziplin + „Vorgeschlagene
nächste Schritte"-Block:
- Klaus' Browser-Sichttest Panel 07 (insbesondere Cleanup-Pfad und
  Sekundär-Persona-Test).
- Brief BAU_08Y schreiben (Modul 08 UI-Demo Outbox-Schreiber-Pfad
  auf slot-spezifischen `sbkim_hetero_outbox_<key>` umstellen —
  löst die bekannte Limitierung aus Bau 06.Y).
- Brief Endknoten-Migration (Mein-Mixarium + Mein-Rezeptbuch auf
  Multi-Identitäts-fähigen Code aktualisieren).

Stolperfallen:

- **`_sendLegacyForIdentity` Sign-Pfad:** der LegacyMessage muss mit
  der **Persona-Identität** (nicht der globalen aktiven) signiert
  werden. `getOrCreateIdentity(key)` liefert den Slot-spezifischen
  privateKey. KEIN `setActiveIdentity`-Hack.
- **Cleanup-Reihenfolge:** Karte 07 hat eine festgelegte Reihenfolge
  (Pflege Bau 06 erweitert um `sbkim_hetero_inbox`). Bei Slot-
  Iteration: pro Slot die volle Reihenfolge durchlaufen, dann
  globale Marker (`sbkim_meta["active-identity"]`).
- **Receiver-Map-Race bei Mid-Operation-Wechsel** — analog Bau 05.Y;
  Receiver cached zur Operations-Zeit.
- **Modul-02-`removeIdentity`-fail-soft-Wrapper:** der bleibt. Wenn
  der Hook intern wirft, fängt Modul 02 das mit `console.warn` und
  läuft die Apoptose weiter. Modul 07's Hook sollte aber selbst
  fail-soft sein (siehe oben).
- **`forgetExpiredSiblings`-Persona-übergreifend:** wer alle Personen
  TTL-sweepen will, iteriert aufrufer-seitig
  `listIdentities()` × `forgetExpiredSiblings(maxAge, slot)`. Modul
  07 macht das NICHT automatisch (kein versteckter Multi-Slot-
  Sweep).

Zeitschätzung: 3-4 h Bau-Teil (komplexer als 05.Y/06.Y wegen
`_sendLegacyForIdentity`-Hook + globaler Slot-Iteration in
`confirmSelfApoptose`).
```

---

## Hinweise außerhalb des Briefes

- **Auslöser:** Brief 99-Pipeline. Modul 07 ist der dritte
  Bau-02.Y-Konsument (nach Modul 05/06) und implementiert
  zusätzlich den `_sendLegacyForIdentity`-Hook, den Bau 02.Y bereits
  fail-soft ruft.
- **Spec-Quelle Brief 04 (PR #99):** Stores + globale-vs-per-Persona-
  Apoptose + Hook-Spec in INTERFACES.
- **Parallelisierbar zu Bau 05.Y / 06.Y** — keine Modul-übergreifenden
  Abhängigkeiten.
- **Auflösung der Bau-02.Y-fail-soft-Klausel:** Modul 02 ruft den Hook
  weiterhin via typeof-check. Nach Bau 07.Y existiert der Hook, der
  typeof-check liefert true, Funktion wird gerufen. `console.warn`-
  Pfad verschwindet automatisch. KEINE Bau-02.Y-Code-Änderung nötig.
- **PR-Pipeline-Stand:** Brief 99 → Bau 01.Y ✓ → Bau 02.Y ✓ → Pflege
  Tafel-Evolution ✓ → Brief Pflege 01-init ✓ → Pflege Modul 01 ✓ +
  Sichttest ✓ → Brief BAU_04A ✓ → Bau 04.A ✓ + Sichttest ✓ → Brief
  BAU_04B ✓ → Brief BAU_05Y ✓ → Brief BAU_06Y ✓ → **Brief BAU_07Y
  (dieser PR)** → drei eigene Bau-Sitzungen → Brief BAU_08Y →
  Endknoten-Migration.
