# Brief — Bau-Sitzung 06.Y Transparenter Slot-Pfad in Modul 06 (Heterokaryose)

**Bau-Sitzung** (kein Spec — Brief 04 hat identitäts-spezifische
Store-Pattern und Receiver-Map-Konvention für Modul 06 vollständig in
INTERFACES § 1 Modul 06 + § 9.2 + § 9.4 spezifiziert). Voraussetzung:
Brief 04 (PR #99), Bau 02.Y (PR #104), Pflege Modul 01 (PR #107),
Bau 04.A (PR #110), Bau 05.Y (Brief PR #113; Bau-PR steht aus). Bau
06.Y kann **vor oder nach Bau 05.Y gebaut werden** — beide sind
orthogonal (Modul 05 und Modul 06 teilen sich nur die Bau-02.Y-API).

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Bau 06.Y Transparenter
Slot-Pfad in Modul 06 (Heterokaryose).

Branch: claude/bau-06y-transparent-slot-pfad   (vom main aus anlegen)

Sitzungs-Rolle: Bau (kein Spec — Brief 04 hat alles spezifiziert).
Modul 06 schreibt jetzt in `sbkim_hetero_inbox_<key>` und liest
identitäts-spezifisch aus `sbkim_hetero_outbox_<key>`. Empfänger-Pfad
(`receiveHeterokaryosis`) nutzt eine `toNodeId`-Receiver-Map analog
Bau 05.Y zur Persona-Auflösung. KEIN Vertrags-Eingriff in
Bietet/Storage/Fehler-Block — das ist Brief 04, gemerged.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (§ Heilige Tafeln § Tafel-Evolutions-Klausel).
2. docs/PULS.md (§ Sitzungs-Einträge oben für Pipeline-Kontext;
   § Vision-Anker 6 Status).
3. docs/INTERFACES.md
   - § 1 Modul 02 — Multi-Identitäts-API (`getActiveIdentityKey`,
     `listIdentities`, `getOrCreateIdentity(key)`)
   - § 1 Modul 06 (Heterokaryose) — VOLLER Vertrag inkl.
     identitäts-spezifischer Store-Pattern
   - § 1 Modul 08 — sbkim_hetero_outbox_<key>-Schreiber-Konvention
     (kontextuell, Bau 08.Y ist separater Pflege-Pfad)
   - § 9.1-9.4 (Slot-Schema, Stores, active-identity-Marker, Receiver-
     Pfad)
4. docs/components/06_heterokaryose.md (Karte 06) — du erweiterst
   § Manueller Test + § Bauzustand
5. src/modules/06_heterokaryose.js — du erweiterst den Code

Heilige Tafeln (Bau-06Y-spezifisch):

- **INTERFACES verbindlich.** Modul 06 Bietet/Storage/Fehler/Garantien
  UNVERÄNDERT. Nur Geprüft-Zeile + § 10 Änderungsprotokoll-Zeile.
  Reihenfolge: INTERFACES → Karte → Code.

- **Receiver-Map-Konvention (§ 9.4)** analog Bau 05.Y: `init()` baut
  `Map<nodeId, key>` aus `listIdentities()` × `getOrCreateIdentity(
  key)`-Resolution; pro eingehendem `receiveHeterokaryosis(request)`
  Map-Lookup für `request.toNodeId`. Treffer → getroffener Slot für
  diese Operation. Kein Treffer → `outcome:"rejected", reason:
  "toNodeId stimmt nicht zum Empfänger"`.

- **Map einmal pro `init()` gebaut.** KEIN `refreshIdentityMap()`-Hook
  (analog Bau 05.Y, Karte 06 § Receiver-Map-Schlank-Konvention).
  Re-Init via Tab-Reload.

- **`receiveHeterokaryosis` ruft NICHT `setActiveIdentity`.** Die
  globale aktive Identität bleibt unangetastet; Receiver nutzt den
  getroffenen Slot NUR für die Operation (analog Bau 05.Y).

- **Sender-Pfad (`requestHeterokaryosis`) nutzt den aktiven Slot.**
  `getActiveIdentityKey()` im init cachen; schreibt resultierende
  Hetero-Inbox-Einträge in `sbkim_hetero_inbox_<activeKey>`. Liest
  Anker-Vorrat aus `sbkim_hetero_outbox_<activeKey>` (Modul-08-
  Schreiber-Pfad ist Aufrufer-Pflicht — Modul 08-Updates kommen in
  Bau 08.Y, hier nicht in Scope).

- **`ensureStore` defensiv vor jedem ersten Schreibvorgang** pro Slot.
  Stores: `sbkim_hetero_inbox_<key>`, `sbkim_hetero_outbox_<key>`.

- **Outbox-Lese-Pfad fail-soft (Karte 06 § Anker-Quelle aus Pflege Bau
  06.1):** `sbkim_hetero_outbox_<activeKey>` ist Anker-Quelle.
  Bei leerer/fehlender Outbox: Fallback auf Spore-Single-Anker
  (`domainVector` aus eigener Spore). Verhalten unverändert; nur
  Store-Name jetzt mit Slot-Suffix.

- **Anker-Quelle: kanonischer Sign-Pfad bleibt unverändert.** Modul
  06 sign't die HeterokaryosisRequest mit der **Persona-Identität**
  (aktive Identität bei Sender, getroffene Persona bei Receiver) —
  `SbkimSpore.getOrCreateIdentity(slotKey)` liefert den
  Persona-Schlüssel.

- **Default-Slot „main" Rückwärts-Kompat:** Pre-Brief-04-Aufrufer
  treffen unverändert auf `_main`-Slots.

- **Bestehende Funktionen unangetastet in der äußeren Signatur.**
  `init`, `requestHeterokaryosis`, `receiveHeterokaryosis`,
  `listHeterokaryosis`, `forgetHeterokaryosis` bleiben in äußerer
  Form gültig. `listHeterokaryosis()` listet die Inbox der aktiven
  Persona; persona-übergreifende Sicht ist Aufrufer-Pflicht.

- **`PROTOCOL_VERSION`, `DB_VERSION`, `BACKUP_FORMAT_VERSION`**
  unverändert.

Deine Aufgabe heute — sechs Punkte a–f:

a) **INTERFACES.md** § 1 Modul 06 Geprüft-Zeile um „2026-05-XX (Bau
   06.Y transparenter Slot-Pfad)" + § 10 Änderungsprotokoll-Zeile.

b) **Karte 06** § Manueller Test: Erwartungs-Block je Knopf nachziehen
   (Inbox/Outbox-Stores jetzt mit Slot-Suffix). § Bauzustand neue
   Zeile.

c) **src/modules/06_heterokaryose.js** erweitern (additiv-mit-
   internem-Refactoring, KEIN Bruch der äußeren Signatur):

   - **Modul-State um Slot-Cache + Receiver-Map** (analog Bau 05.Y):
     `var activeSlotKey = null;`, `var receiverMap = null;`.
   - **Helper `heteroInboxStoreName(slotKey)` /
     `heteroOutboxStoreName(slotKey)` /
     `ensureSlotStores(slotKey)`** intern.
   - **`init()` erweitern:** `activeSlotKey =
     SbkimSpore.getActiveIdentityKey()`; `ensureSlotStores`;
     Receiver-Map über `listIdentities()` × `getOrCreateIdentity`.
   - **`requestHeterokaryosis(targetSpore, ...)`:** alle Inbox-
     Schreibvorgänge in `sbkim_hetero_inbox_<activeSlotKey>`; Outbox-
     Lese-Pfad aus `sbkim_hetero_outbox_<activeSlotKey>` (fail-soft
     Fallback auf Spore-Anker unverändert).
   - **`receiveHeterokaryosis(incomingRequest)`:** Receiver-Map-
     Lookup für `request.toNodeId`. Treffer → Slot für die Operation;
     Sign-Pfad mit `getOrCreateIdentity(targetSlotKey)`-Identität;
     Inbox-Schreib in `sbkim_hetero_inbox_<targetSlotKey>`; Outbox-
     Lese aus `sbkim_hetero_outbox_<targetSlotKey>`. KEIN
     `setActiveIdentity`. Kein Treffer → `outcome:"rejected"`-
     Response.
   - **`listHeterokaryosis()`:** liest aus
     `sbkim_hetero_inbox_<activeSlotKey>`.
   - **`forgetHeterokaryosis(peerNodeId, ts?)`:** löscht aus
     `sbkim_hetero_inbox_<activeSlotKey>`.
   - **Selbstcheck-Zeile** unverändert (Funktionen heißen weiter
     gleich).
   - **`_meta`** um `activeSlotKey` (Getter) + `receiverMapSize`
     (Getter) erweitern.
   - **Modul-Kopfkommentar** um Bau-06.Y-Block am Ende.

d) **tests/manual_check.html Panel 06:** Setup-Knopf zeigt aktiven
   Slot; **Knopf 15 „Test mit Sekundär-Persona"** (analog Bau 05.Y)
   legt `test_06y` an, setzt aktiv; Tab-Reload + Setup zeigt
   `sbkim_hetero_inbox_test_06y`.

e) **Smoke-Test fake-indexeddb** `tests/smoke_bau06y_transparent_slot_pfad.mjs`:
   - Probe 1: Default-Slot — request schreibt in `sbkim_hetero_
     inbox_main`.
   - Probe 2: Sekundär-Slot — request schreibt in `sbkim_hetero_
     inbox_<sekundär>`.
   - Probe 3: Empfänger-Pfad — receive mit main-toNodeId schreibt in
     `sbkim_hetero_inbox_main` (auch wenn aktive Identität anders).
   - Probe 4: Unbekannter `toNodeId` → `outcome:"rejected"`,
     enthält "toNodeId".
   Regression-Smoke-Tests alle weiterhin grün.

f) **Übergabeprotokoll** in
   `docs/sessions/archiv/2026-05-XX_bau-06y-transparent-slot-pfad.md`.

Was du NICHT tust:

- **Kein Modul-05/07/08-Eingriff.**
- **Kein `refreshIdentityMap()`-Hook.**
- **Keine `setActiveIdentity`-Aufrufe aus Modul 06.**
- **Keine Migration der alten nicht-suffixed sbkim_hetero_inbox-Daten**
  — via `importBackup` (Bau 02.Y) in den main-Slot bringen, falls
  vorhanden.
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **Keine Sage-Page-/CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 06 bleibt
  `score:"fertig"`, additive Erweiterung.

Pflicht am Ende der Sitzung: übliche Disziplin + „Vorgeschlagene
nächste Schritte"-Block mit Verweis auf Brief BAU_07Y (Modul 07
Apoptose transparenter Slot-Pfad + `_sendLegacyForIdentity`-Hook).

Stolperfallen:

- **Receiver-Map-Race bei Mid-Operation-Wechsel** — analog Bau 05.Y;
  Modul 06 cached zur Operations-Zeit, ist unbeeinflusst.
- **`sbkim_hetero_inbox`-Komposit-Schlüssel** `"<peerNodeId>|<ts>"`
  bleibt unverändert — nur Store-Name mit Slot-Suffix.
- **Modul-08-Outbox-Schreiber-Pfad:** Modul 08 schreibt heute in
  nicht-suffixed `sbkim_hetero_outbox`. Bau 06.Y liest aus
  `sbkim_hetero_outbox_<key>` — bei leerer slot-spezifischer Outbox
  fällt der Code auf Spore-Single-Anker zurück (bestehender fail-soft-
  Pfad). **Bekannte Limitierung:** Modul 08-Updates für slot-
  spezifische Outbox-Schreiben kommen in Bau 08.Y; bis dahin liefert
  die Outbox immer den fail-soft-Fallback. In Karte 06 § Bauzustand
  als Mid-Hinweis notieren.

Zeitschätzung: 2-3 h Bau-Teil.
```

---

## Hinweise außerhalb des Briefes

- **Auslöser:** Brief 99-Pipeline; analog Bau 05.Y.
- **Spec-Quelle Brief 04 (PR #99):** Stores + Receiver-Map in INTERFACES.
- **Parallelisierbar zu Bau 05.Y/07.Y** — keine Modul-übergreifenden
  Abhängigkeiten (außer der gemeinsamen Bau-02.Y-API).
- **Bekannte Limitierung Modul 08:** Outbox-Schreiber-Pfad noch nicht
  slot-spezifisch — fail-soft-Fallback fängt das ab.
