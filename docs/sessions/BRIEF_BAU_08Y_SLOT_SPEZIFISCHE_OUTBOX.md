# Brief — Bau-Sitzung 08.Y Slot-spezifische Outbox in Modul 08 (UI-Demo)

**Bau-Sitzung** (kein Spec — Brief 04 hat identitäts-spezifische
Store-Pattern in INTERFACES § 9.2 spezifiziert; Modul 08 ist
einziger Schreiber von `sbkim_hetero_outbox` und Co-Schreiber von
`sbkim_siblings.heterokaryosisOptIn`). Voraussetzung: Brief 04 (PR
#99), Bau 02.Y (PR #104), Pflege Modul 01 (PR #107). Bau 08.Y kann
**vor oder nach Bau 05.Y/06.Y/07.Y gebaut werden** — Modul 08 ist
storage-only (kein Netz, kein Receiver), Receiver-Map nicht nötig.

**Bau 08.Y löst die in Bau 06.Y dokumentierte bekannte Limitierung**:
Modul 08's Outbox-Schreiber war bis dahin nicht slot-spezifisch.

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Bau 08.Y Slot-spezifische
Outbox in Modul 08 (UI-Demo).

Branch: claude/bau-08y-slot-spezifische-outbox   (vom main aus anlegen)

Sitzungs-Rolle: Bau (kein Spec — Brief 04 hat die Store-Pattern in
INTERFACES § 9.2 spezifiziert; Modul 08 ist Schreiber von
`sbkim_hetero_outbox` und Co-Schreiber von `sbkim_siblings.
heterokaryosisOptIn`). Modul 08 ist **storage-only** (kein Netz,
kein Receiver) — Receiver-Map ist NICHT nötig, nur der Schreib-Pfad
muss slot-spezifisch werden.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (§ Heilige Tafeln § Tafel-Evolutions-Klausel).
2. docs/PULS.md (§ Sitzungs-Einträge oben für Pipeline-Kontext;
   § Vision-Anker 6 Status).
3. docs/INTERFACES.md
   - § 1 Modul 02 — Multi-Identitäts-API
   - § 1 Modul 08 (UI-Demo) — VOLLER Vertrag inkl. Outbox-
     Pflicht-Felder und sbkim_siblings.heterokaryosisOptIn-Co-
     Schreiber-Konvention
   - § 9.1-9.4 (Slot-Schema, identitäts-spezifische Stores)
4. docs/components/08_ui_demo.md (Karte 08) — du erweiterst
   § Manueller Test + § Bauzustand
5. src/modules/08_ui_demo.js — du erweiterst den Code

Heilige Tafeln (Bau-08Y-spezifisch):

- **INTERFACES verbindlich.** Modul 08 Bietet/Storage/Fehler/Garantien
  UNVERÄNDERT. Nur Geprüft-Zeile + § 10 Änderungsprotokoll-Zeile.

- **Modul 08 ist storage-only.** KEIN Receiver-Map (kein
  receiveHandshake / receiveHeterokaryosis / receiveLegacy). Nur
  Schreib-Pfad muss slot-spezifisch werden. Daher KEINE
  receiverMap-Implementierung — Bau 08.Y ist KÜRZER als Bau 05.Y /
  06.Y / 07.Y.

- **Aktiver-Slot-Cache analog Bau 05.Y:** `activeSlotKey` im `init()`
  aus `SbkimSpore.getActiveIdentityKey()` cachen.

- **Stores pro aktivem Slot:**
  - `sbkim_hetero_outbox_<activeSlotKey>` (Modul 08 alleiniger
    Schreiber; max. `HETERO_OUTBOX_MAX_ENTRIES = 5` Einträge pro
    Slot — die Konstante bleibt bei 5, nicht pro Aufrufer-Konfig).
  - `sbkim_siblings_<activeSlotKey>` (Modul 08 Co-Schreiber für
    `heterokaryosisOptIn`-Feld; Haupt-Schreiber bleibt Modul 05).

- **`ensureStore` defensiv vor jedem ersten Schreibvorgang** pro
  Slot (idempotent, Bau 01.Y).

- **`setSiblingHeteroOptIn` Co-Schreiber-Konvention unverändert
  (Karte 08):** liest existing Sibling-Eintrag aus
  `sbkim_siblings_<activeSlotKey>`, ergänzt das eine additive Feld
  `heterokaryosisOptIn` via `Object.assign({}, sibling,
  {heterokaryosisOptIn})`, schreibt zurück. Wenn Sibling nicht
  existiert: `UnknownSiblingError`. Heute liest Modul 08 noch aus
  `sbkim_siblings` (ohne Suffix) — nach Bau 08.Y aus
  `sbkim_siblings_<activeSlotKey>`. **Aufrufer-Kontext:** Klaus
  pflegt die OptIn-Flags typischerweise nur für die aktive Persona
  (UI-Pfad in Panel 08); persona-übergreifende OptIn-Pflege ist
  Aufrufer-Pflicht via `setActiveIdentity` + Re-Init.

- **Default-Slot „main" Rückwärts-Kompat:** Pre-Brief-04-Aufrufer
  treffen unverändert auf `_main`-Slots.

- **Bestehende Funktionen unangetastet in der äußeren Signatur.**
  `init`, `listOutbox`, `addOutboxAnchor`, `removeOutboxAnchor`,
  `setSiblingHeteroOptIn` bleiben in äußerer Form gültig. Test-
  Brücken `_clearOutbox`, `_addPseudoSibling`,
  `_clearPseudoSiblings` analog umgestellt — schreiben in
  slot-spezifische Stores.

- **`addOutboxAnchor`-Check-Reihenfolge unverändert** (Karte 08):
  (1) Label sync, (2) Vektor sync, (3) async-Voll-Check
  `OutboxFullError` nur bei NEUEM Label; Überschreiben eines
  bekannten Labels bleibt erlaubt. Reihenfolge der Lese-Antwort in
  `listOutbox`: absteigend nach `addedAt` (neueste zuerst).
  Verhalten unverändert; nur Store-Name jetzt mit Slot-Suffix.

- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert.

Deine Aufgabe heute — sechs Punkte a–f:

a) **INTERFACES.md** § 1 Modul 08 Geprüft-Zeile um „2026-05-XX (Bau
   08.Y slot-spezifische Outbox)" + § 10 Änderungsprotokoll-Zeile.

b) **Karte 08** § Manueller Test: Erwartungs-Block je Knopf nachziehen
   (sbkim_hetero_outbox_main jetzt statt sbkim_hetero_outbox);
   § Bauzustand neue Zeile + Hinweis auf Auflösung der Bau-06.Y-
   Limitierung.

c) **src/modules/08_ui_demo.js** erweitern (additiv-mit-internem-
   Refactoring, KEIN Bruch der äußeren Signatur):

   - **Modul-State um Slot-Cache:** `var activeSlotKey = null;`
     (cached vom `init()`; null vor `init`).

   - **Helper `heteroOutboxStoreName(slot)`:** sync, intern.
     Returns `"sbkim_hetero_outbox_" + slot`. Analog
     `siblingsStoreName(slot)`.

   - **Helper `ensureSlotStores(slot)`:** async, intern. Ruft
     `SbkimStorage.ensureStore` für beide Stores
     (`sbkim_hetero_outbox_<slot>`, `sbkim_siblings_<slot>`).
     Idempotent dank Bau 01.Y. Wird vor jedem ersten
     Schreibvorgang gerufen.

   - **`init()` erweitern:**
     1. Bestehende init-Pfade (Storage init, Spore init)
        unverändert.
     2. `activeSlotKey = await SbkimSpore.getActiveIdentityKey()`.
     3. `await ensureSlotStores(activeSlotKey)`.

   - **`listOutbox()`:** liest aus
     `heteroOutboxStoreName(activeSlotKey)` statt
     `sbkim_hetero_outbox`. Reihenfolge unverändert (absteigend
     nach `addedAt`, max. `HETERO_OUTBOX_MAX_ENTRIES = 5`).

   - **`addOutboxAnchor(label, vector)` erweitern:**
     1. Sync-Checks (Label, Vektor) unverändert.
     2. `await ensureSlotStores(activeSlotKey)` (idempotent).
     3. Existing-Anchor-Check + Voll-Check + put-Pfad jetzt gegen
        `heteroOutboxStoreName(activeSlotKey)`.

   - **`removeOutboxAnchor(label)` erweitern:** löscht aus
     `heteroOutboxStoreName(activeSlotKey)`.

   - **`setSiblingHeteroOptIn(peerNodeId, value)` erweitern:**
     liest aus + schreibt nach `siblingsStoreName(activeSlotKey)`
     (statt `sbkim_siblings`). Co-Schreiber-Konvention via
     `Object.assign` unverändert. `UnknownSiblingError` wenn
     peerNodeId nicht in `sbkim_siblings_<activeSlotKey>`.

   - **Test-Brücken erweitern:**
     - `_clearOutbox()`: `clear(heteroOutboxStoreName(activeSlotKey))`.
     - `_addPseudoSibling(nodeId, ...)`: schreibt in
       `siblingsStoreName(activeSlotKey)`.
     - `_clearPseudoSiblings()`: `clear(siblingsStoreName(activeSlotKey))`.

   - **Selbstcheck-Zeile** unverändert (Funktionen heißen weiter
     gleich).

   - **`_meta`** um `activeSlotKey` (Getter) erweitern. Read-Anker
     für Tests.

   - **Modul-Kopfkommentar** um Bau-08.Y-Block am Ende.

   - `node --check src/modules/08_ui_demo.js` muss grün sein.

d) **tests/manual_check.html Panel 08:** Setup-Knopf-Output zeigt
   den aktiven Slot. Bestehende Knöpfe bleiben — sie nutzen jetzt
   intern den slot-suffixed Store. **Optional: Knopf für Sekundär-
   Persona-Test** (analog Bau 05.Y Knopf 10) — Sekundär-Persona
   anlegen + aktiv setzen + Tab-Reload + Setup zeigt
   `sbkim_hetero_outbox_<sekundär>`. Empfehlung: **nicht in dieser
   Bau-Sitzung** — Klaus' Bau-05.Y/06.Y/07.Y-Sichttests haben das
   Sekundär-Persona-Muster genug demonstriert. Karte 08 § Manueller
   Test bleibt auf 8 Knöpfen; nur Erwartungs-Block je Knopf
   nachgezogen.

   Alle Inline-Scripts validieren (`node --check` pro extrahiertem
   Block).

e) **Smoke-Test fake-indexeddb**
   `tests/smoke_bau08y_slot_spezifische_outbox.mjs`. Drei Proben:
   - Probe 1: Default-Slot — `addOutboxAnchor` schreibt in
     `sbkim_hetero_outbox_main`; `listOutbox` liest aus
     `sbkim_hetero_outbox_main`.
   - Probe 2: Sekundär-Slot — `getOrCreateIdentity('test_08y')` +
     `setActiveIdentity('test_08y')`, dann Modul 08 re-init (im
     Test via Modul-Re-Load), `addOutboxAnchor` schreibt in
     `sbkim_hetero_outbox_test_08y`.
   - Probe 3: `setSiblingHeteroOptIn` — Pseudo-Sibling via
     `_addPseudoSibling` in `sbkim_siblings_main`,
     `setSiblingHeteroOptIn` liest + schreibt mit
     `heterokaryosisOptIn`-Flag in `sbkim_siblings_main` (nicht
     im nicht-suffixed `sbkim_siblings`).

   Regression-Smoke-Tests alle weiterhin grün.

f) **Übergabeprotokoll** in
   `docs/sessions/archiv/2026-05-XX_bau-08y-slot-spezifische-outbox.md`.
   Mit Hinweis: **löst die in Bau-06.Y-Brief dokumentierte bekannte
   Limitierung auf** (Modul 06 liest jetzt aus
   `sbkim_hetero_outbox_<key>` — Modul 08 schreibt dorthin).

Was du NICHT tust:

- **Kein Modul-05/06/07-Eingriff.**
- **Kein Receiver-Map-Code** (Modul 08 storage-only).
- **Keine setActiveIdentity-Aufrufe aus Modul 08.**
- **Keine Migration der alten nicht-suffixed sbkim_hetero_outbox-
  Daten** (via Backup-Re-Import aus Bau 02.Y in main-Slot bringen,
  falls vorhanden — Aufrufer-Pflicht).
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **Keine Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 08 bleibt
  `score:"fertig"`, additive Erweiterung.

Pflicht am Ende der Sitzung: übliche Disziplin + „Vorgeschlagene
nächste Schritte"-Block:
- Klaus' Browser-Sichttest Panel 08 (Setup-Knopf zeigt slot-suffixed
  Store).
- Endknoten-Migration (Mein-Mixarium + Mein-Rezeptbuch — alle Bau-
  02.Y / 04.A / 05.Y / 06.Y / 07.Y / 08.Y produktiv im
  Endknoten-Repo verfügbar).
- Optional: Vision-Anker 5 Identitäts-Container Spec-Sitzung (löst
  User-Key-Test-Brücke aus Bau 04.B mit produktivem sicheren
  Pfad).

Stolperfallen:

- **`HETERO_OUTBOX_MAX_ENTRIES = 5` ist PRO SLOT, nicht global.**
  Klaus kann theoretisch 5 Anker pro Persona haben (bei 3 Personae
  → 15 Anker insgesamt). Das ist Spec-konform — keine Tafel-
  Spannung. Karte 08 § Konfigurationswerte könnte den Hinweis
  „pro Slot" ergänzen für Klarheit; OPTIONAL.
- **`setSiblingHeteroOptIn` auf Sibling aus anderer Persona:** wer
  ein OptIn-Flag für einen Sibling aus einer NICHT-aktiven Persona
  setzen will, müsste vorher `setActiveIdentity` rufen + Modul 08
  re-init (Tab-Reload). Modul 08 unterstützt das NICHT in einer
  Operation — analog Bau 05.Y / 06.Y / 07.Y. KEIN
  refreshIdentityMap()-Hook.
- **Backup-Re-Import alte Outbox-Daten:** Klaus' bestehende
  `sbkim_hetero_outbox`-Einträge (vor Bau 08.Y) sind im non-suffixed
  Store. Wer sie behalten will: via `exportBackup` (alt) + manuelles
  JSON-Editing in den `sbkim_hetero_outbox_main`-Store, oder neu
  via `addOutboxAnchor` setzen. **Keine Modul-08-Migration.**

Zeitschätzung: 2 Stunden für Bau + Karten-Nachzug + Smoke-Test +
Übergabeprotokoll. Kürzer als Bau 05.Y / 06.Y / 07.Y, weil
storage-only (kein Receiver-Map-Code).
```

---

## Hinweise außerhalb des Briefes

- **Auslöser:** Brief 99-Pipeline. Letzter Konsumenten-Bau der Bau-
  02.Y-API (nach Modul 05/06/07). Auch: Auflöser der „bekannten
  Limitierung" aus Bau-06.Y-Brief.

- **Spec-Quelle Brief 04 (PR #99):** Stores in INTERFACES § 9.2;
  Modul 08 ist Schreiber von `sbkim_hetero_outbox_<key>` und
  Co-Schreiber von `sbkim_siblings_<key>.heterokaryosisOptIn`.

- **Modul 08 ist storage-only** — kürzester der vier Konsumenten-
  Bauten (kein Netz, kein Receiver-Map). Zeitschätzung 2 h.

- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert.

- **PR-Pipeline-Stand:** Brief 99 → Bau 01.Y ✓ → Bau 02.Y ✓ → Pflege
  Tafel-Evolution ✓ → Pflege Modul 01 ✓ → Bau 04.A ✓ → Briefe
  BAU_04B / 05Y / 06Y / 07Y bereit (PR #112 / #113 / #114 / #115
  gemerged) → **Brief BAU_08Y (dieser PR)** → fünf eigene Bau-
  Sitzungen → Endknoten-Migration.

- **Auslöser-Befehl im Chat (Kaskaden-Konvention 6):** der Volltext
  des Briefes oben ist im Repo (diese Datei). Klaus tippt am
  Sitzungs-Start nur den kurzen Auslöser-Befehl mit Verweis auf die
  Brief-Datei.
