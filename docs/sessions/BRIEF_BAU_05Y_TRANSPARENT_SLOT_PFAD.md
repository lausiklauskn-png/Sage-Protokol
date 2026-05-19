# Brief — Bau-Sitzung 05.Y Transparenter Slot-Pfad in Modul 05

**Bau-Sitzung** (kein Spec — Brief 04 der V1-Sammelspec-Kaskade hat
identitäts-spezifische Store-Pattern und Receiver-Map-Konvention
vollständig in INTERFACES § 1 Modul 05 + § 9.2 + § 9.4 spezifiziert).
Voraussetzung: Brief 04 (PR #99), Bau 02.Y (PR #104), Pflege Modul 01
(PR #107 + #108), Bau 04.A (PR #110 + #111). Bau 05.Y nutzt Bau 02.Y's
Multi-Identitäts-API (`getActiveIdentityKey` / `listIdentities` /
`getOrCreateIdentity`) und Bau 01.Y's `ensureStore`.

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Bau 05.Y Transparenter
Slot-Pfad in Modul 05 (Anastomose).

Branch: claude/bau-05y-transparent-slot-pfad   (vom main aus anlegen)

Sitzungs-Rolle: Bau (kein Spec — Brief 04 hat alles spezifiziert).
Du baust Modul 05 auf identitäts-spezifische Stores um: statt
`sbkim_siblings` und `sbkim_anastomosis_log` schreibt Modul 05 jetzt
in `sbkim_siblings_<key>` und `sbkim_anastomosis_log_<key>` pro
aktiver Identität. Empfänger-Pfad (`receiveHandshake`) prüft
`toNodeId` gegen eine Receiver-Map (nodeId → key) und verwendet den
getroffenen Slot als Persona für die eine Operation. KEIN Vertrags-
Eingriff in Bietet/Storage/Fehler-Block — das ist Brief 04, gemerged.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
   - § Heilige Tafeln § Tafel-Evolutions-Klausel
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Bau 04.A `matchDimensions`
     sync" (live grün 2026-05-19); Bau 02.Y-Eintrag im Archiv-Index
     (Multi-Identitäts-API verfügbar)
   - § Vision-Anker 6 (Multi-Identität) § Status — Bau 02.Y
     abgeschlossen + Pflege Modul 01 abgeschlossen
3. docs/INTERFACES.md
   - § 1 Modul 02 — Multi-Identitäts-API (`getActiveIdentityKey`,
     `listIdentities`, `getOrCreateIdentity(key)`) ist die heutige
     Lese-Quelle für Bau 05.Y
   - § 1 Modul 05 (Anastomose) — VOLLER Vertrag inkl. Nutzt-Block
     mit identitäts-spezifischen Store-Pattern
   - § 9.1 Slot-Schema + § 9.2 Identitäts-spezifische Stores +
     § 9.3 active-identity-Marker + § 9.4 Receiver-Pfad mit
     nodeId→key-Map
4. docs/components/05_anastomose.md (Karte 05) — du erweiterst
   § Manueller Test + § Bauzustand
5. src/modules/05_anastomose.js — du erweiterst den Code

Was du NICHT liest: andere Modul-Karten (00/01/02/03/04/06/07/08/09);
Sage-Page index.html; Briefe 01-04 / 99 (Stand in INTERFACES
gespiegelt).

Heilige Tafeln (Bau-05Y-spezifisch):

- **INTERFACES verbindlich.** Modul 05 Bietet-Block + Storage-Block +
  Fehler-Block + Garantien-Block sind in INTERFACES § 1 Modul 05
  BEREITS gespiegelt (durch Brief 04 + Spec-Sitzung BroadcastChannel-
  Bridge). Du ziehst NUR die Geprüft-Zeile + § 10 Änderungsprotokoll
  nach. KEIN Vertrags-Drift.

- **Receiver-Map-Konvention aus § 9.4 verbindlich:**
  1. `init()` baut eine Map `nodeId → key` aus `listIdentities()` ×
     `getOrCreateIdentity(key)`-Resolution.
  2. Pro eingehendem `receiveHandshake(request)` wird
     `request.toNodeId` gegen die Map geprüft. Treffer → die
     getroffene Persona wird für diese Operation intern als aktive
     Identität verwendet (NICHT global! `setActiveIdentity` wird
     NICHT gerufen — die globale aktive Identität bleibt unangetastet,
     der Receiver nutzt nur den Slot für die Operation).
  3. Kein Treffer → Response `outcome:"rejected",
     reason:"toNodeId stimmt nicht zum Empfänger"` (analog Modul 05
     Vor-Brief-04-Verhalten — die Logik wird erweitert, die Reason-
     Klausel bleibt gleich).

- **Map einmal pro init() gebaut, nicht pro Request neu aufgelöst.**
  Pro-Request-Auflösung würde pro Persona einen async-Crypto-Aufruf
  erzwingen (Karte 05 § Receiver-Map-Schlank-Konvention). Wer
  `getOrCreateIdentity(<neuer key>)` ruft, muss Modul 05 re-
  initialisieren ODER Modul 05 baut die Map lazy bei Bedarf nach
  (Empfehlung: re-init via Tab-Reload; Bau 05.Y baut KEINEN
  `refreshIdentityMap()`-Hook — das wäre Folge-Spec).

- **Sender-Pfad nutzt den aktiven Slot.** `handshake(...)` ruft
  `getActiveIdentityKey()` im init oder im handshake-Pfad (cached für
  die Operation), schreibt den entstehenden Sibling-Eintrag in
  `sbkim_siblings_<activeKey>` und das Log in
  `sbkim_anastomosis_log_<activeKey>`.

- **`ensureStore`-Aufrufe vor jedem Schreibvorgang.** Modul 05 muss
  `SbkimStorage.ensureStore("sbkim_siblings_<key>")` und
  `SbkimStorage.ensureStore("sbkim_anastomosis_log_<key>")` rufen,
  bevor er den ersten Schreibvorgang in einen davon macht. Modul 02
  Bau 02.Y ruft das beim `getOrCreateIdentity(key)` schon — wenn der
  Aufrufer die Identität via Modul 02 angelegt hat, sind die Stores
  da. **Aber:** Modul 05 darf sich NICHT darauf verlassen (Identität
  könnte aus einem Backup-Import stammen, wo Modul 02 die Stores
  bereits angelegt hat, oder aus einem Pre-Bau-02.Y-Storage-Zustand).
  Sicherer Pfad: Modul 05 ruft `ensureStore` defensiv selbst vor
  jedem Schreibvorgang (idempotent dank Bau 01.Y).

- **Default-Slot „main" Rückwärts-Kompat:** Pre-Brief-04-Singleton-
  Aufrufer rufen `handshake(...)` ohne `setActiveIdentity`. Modul 05
  liest `getActiveIdentityKey()` → bekommt „main" zurück (Bau-02.Y-
  Default). Schreibt in `sbkim_siblings_main` und
  `sbkim_anastomosis_log_main`. **Migration aus dem nicht-suffixed
  `sbkim_siblings`-Store ist NICHT Bau-05.Y-Scope:** wer alte Daten
  aus `sbkim_siblings` (ohne Suffix) hat, lädt sie via `importBackup`
  in den main-Slot (Bau 02.Y). Modul 05 ignoriert den alten
  nicht-suffixed Store. Karte 05 § Bauzustand vermerkt das als
  „Migrations-Hinweis: alte sbkim_siblings-Daten via Backup-Re-
  Import nach sbkim_siblings_main bringen".

- **Bestehende Funktionen unangetastet in der äußeren Signatur.**
  `init`, `handshake`, `receiveHandshake`, `listSiblings`,
  `forgetSibling` bleiben in ihrer bestehenden Form gültig — nur
  interne Store-Namen ändern sich (sbkim_siblings →
  sbkim_siblings_<activeKey> bzw. sbkim_siblings_<requestSlot>).
  `listSiblings()` listet die Geschwister der **aktiven** Identität;
  Persona-übergreifende Sicht ist Aufrufer-Pflicht (Karte 05 §
  Bauzustand-Hinweis).

- **BroadcastChannel-Bridge unverändert.** Spec-Sitzung 2026-05-17
  hat den Channel-Pfad eingebaut; Bau 05.Y berührt das nicht —
  Channel-Receiver liest `request.toNodeId` analog HTTP-Receiver
  durch die Receiver-Map.

- **`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `4`,
  `BACKUP_FORMAT_VERSION` bleibt `2`.**

Deine Aufgabe heute — sechs Punkte a–f:

a) **docs/INTERFACES.md** zwei kleine Nachzieh-Eingriffe:
   - § 1 Modul 05 Geprüft-Zeile um „2026-05-XX (Bau 05.Y
     transparenter Slot-Pfad)" erweitert.
   - § 10 Änderungsprotokoll um eine neue Zeile „2026-05-XX · Bau-
     Sitzung 05.Y transparenter Slot-Pfad in Modul 05".

b) **docs/components/05_anastomose.md (Karte 05)** zwei Sub-Sektionen:
   - § Manueller Test: Knöpfe in Panel 05 bleiben in der Anzahl —
     aber Setup-Knopf nutzt jetzt die aktive Identität. Erwartungs-
     Block für jeden Knopf nachziehen (sbkim_siblings_main statt
     sbkim_siblings). Falls der Sichttest noch nicht nachgezogen ist,
     kann das in einem späteren Mini-Pflege-PR passieren.
   - § Bauzustand neue Zeile „Bau 05.Y transparenter Slot-Pfad
     2026-05-XX" + Migrations-Hinweis (alte sbkim_siblings via
     Backup-Re-Import).

c) **src/modules/05_anastomose.js** erweitern (additiv-mit-internem-
   Refactoring, KEIN Bruch der äußeren Signatur):

   - **Modul-State um Slot-Cache erweitern:**
     - `var activeSlotKey = null;` (cached vom `init()` für die Tab-
       Lebenszeit; null vor `init`).
     - `var receiverMap = null;` (`Map<nodeId, key>`, cached vom
       `init()`).

   - **Helper `siblingsStoreName(slotKey)`:** sync, intern. Returns
     `"sbkim_siblings_" + slotKey`. Analog
     `anastomosisLogStoreName(slotKey)`.

   - **Helper `ensureSlotStores(slotKey)`:** async, intern. Ruft
     `SbkimStorage.ensureStore` für beide Slot-Stores. Idempotent
     dank Bau 01.Y. Wird vor jedem ersten Schreibvorgang in einen
     Slot gerufen.

   - **`init()` erweitern:**
     1. Bestehende init-Pfade (Storage init, Spore init, etc.)
        unverändert.
     2. Nach Storage+Spore-init: `activeSlotKey =
        await SbkimSpore.getActiveIdentityKey()`.
     3. `await ensureSlotStores(activeSlotKey)`.
     4. Receiver-Map bauen: `slots = await
        SbkimSpore.listIdentities()`. Pro `slot` in `slots`:
        `ident = await SbkimSpore.getOrCreateIdentity(slot);
        receiverMap.set(ident.nodeId, slot);`
     5. Bestehender BroadcastChannel-Receiver-Init unverändert (das
        ist Spec-Sitzung BroadcastChannel-Bridge 2026-05-17, bereits
        eingebaut).

   - **`handshake(targetSpore, ownDomainVector, options)` erweitern:**
     - Den `activeSlotKey` cachen für die Operation (gegen Mid-
       Operation-Wechsel — Karte 02 § Risiken: Mid-Operation-
       Identitäts-Wechsel ist nicht spezifiziert).
     - Alle `storage.get/put/del/all("sbkim_siblings", ...)`-
       Aufrufe ersetzen durch
       `storage.get/put/del/all(siblingsStoreName(activeSlotKey), ...)`.
     - Analog für `sbkim_anastomosis_log`.
     - `getOwnSpore()` ohne key-Parameter ruft die aktive Identität
       (Bau-02.Y-Default) — das stimmt.
     - Vor dem ersten Schreibvorgang: `await
       ensureSlotStores(activeSlotKey)` (idempotent).

   - **`receiveHandshake(incomingRequest)` erweitern:**
     1. `request.toNodeId` lesen.
     2. **Receiver-Map-Lookup:** `targetSlotKey =
        receiverMap.get(request.toNodeId)`.
     3. Wenn `targetSlotKey === undefined`: Response
        `outcome:"rejected", reason:"toNodeId stimmt nicht zum
        Empfänger"`. KEIN Storage-Eingriff.
     4. Sonst: `targetSlotKey` für die Operation verwenden — alle
        `storage.get/put/del/all`-Aufrufe in
        `siblingsStoreName(targetSlotKey)` /
        `anastomosisLogStoreName(targetSlotKey)`.
     5. `getOrCreateIdentity(targetSlotKey)` für die Sign-Operationen
        der Response (Sign mit der GETROFFENEN Persona, nicht der
        globalen aktiven).
     6. **WICHTIG:** `setActiveIdentity` wird NICHT gerufen. Die
        globale aktive Identität bleibt unangetastet — Receiver nutzt
        die Persona NUR für diese eine Operation.
     7. Vor dem ersten Schreibvorgang: `await
        ensureSlotStores(targetSlotKey)` (idempotent).

   - **`listSiblings()` erweitern:** liest jetzt
     `siblingsStoreName(activeSlotKey)` statt `sbkim_siblings`. Karte
     05 § Bauzustand vermerkt: Persona-übergreifende Sicht ist
     Aufrufer-Pflicht (über `listIdentities()` iterieren).

   - **`forgetSibling(nodeId)` erweitern:** löscht aus
     `siblingsStoreName(activeSlotKey)`. Wer einen Sibling aus einer
     anderen Persona vergessen will, müsste vorher
     `setActiveIdentity` rufen (Karte 05 § Bauzustand-Hinweis).

   - **Selbstcheck-Zeile bleibt unverändert** (sie nennt nur die
     Funktionsnamen; die Store-Namen sind interner Aspekt). Optional:
     im Selbstcheck-String einen Hinweis auf den aktiven Slot
     ergänzen — Empfehlung **nicht**, weil der Selbstcheck VOR `init`
     emittiert wird und der active-Slot dann noch nicht bekannt ist.

   - **`_meta`** um neue Anker erweitern:
     - `_meta.activeSlotKey` (Getter, liefert `activeSlotKey` —
       Live-Zustand; `null` vor `init`).
     - `_meta.receiverMapSize` (Getter, liefert `receiverMap?.size ||
       0` — Read-Anker für Tests).

   - **Modul-Kopfkommentar** um Pflege-Block am Ende erweitern: „Bau
     05.Y transparenter Slot-Pfad (2026-05-XX): Modul 05 schreibt
     identitäts-spezifisch in `sbkim_siblings_<key>` und
     `sbkim_anastomosis_log_<key>`. Receiver-Pfad nutzt
     `toNodeId`-Map zur Persona-Auflösung; Sender-Pfad nutzt den
     aktiven Slot. Spec-Quelle Brief 04 (PR #99) + Bau 02.Y (PR
     #104)."

   - `node --check src/modules/05_anastomose.js` muss grün sein.

d) **tests/manual_check.html Panel 05:**
   Bestehende Knöpfe bleiben — sie funktionieren weiterhin, weil die
   äußere Signatur unverändert ist. **Setup-Knopf-Output** sollte
   jetzt den aktiven Slot anzeigen (z.B. „main") und in DevTools sind
   die Stores `sbkim_siblings_main` + `sbkim_anastomosis_log_main`
   sichtbar statt der alten nicht-suffixed Stores.

   **Neuer Knopf 10 „Test mit Sekundär-Persona"** (Bau 05.Y) —
   Setup: `await SbkimSpore.getOrCreateIdentity('test_05y')`; dann
   `await SbkimSpore.setActiveIdentity('test_05y')`; dann **Modul 05
   re-init** (durch Tab-Reload nötig — oder im Test direkt
   `SbkimAnastomose._reinit()` wenn ein interner Hook gebaut wird;
   Empfehlung **kein Hook**, weil Re-Init via Tab-Reload Spec-konform
   ist — Karte 05 § Receiver-Map-Schlank-Konvention). **Daher:**
   Knopf 10 lädt nur die Vorbereitung (Sekundär-Persona anlegen +
   aktivieren); Klaus muss Tab reloaden + Test 1 erneut klicken, um
   den Effekt zu sehen (Sibling-Eintrag jetzt in
   `sbkim_siblings_test_05y` statt `sbkim_siblings_main`).

   Cleanup-Hinweis: `removeIdentity('test_05y', {force:true})` nach
   dem Test, damit die identitäts-spezifischen Stores `*_test_05y`
   leer sind (Bau 02.Y-Pfad).

   Alle 10 Inline-`<script>`-Blöcke in `tests/manual_check.html`
   syntaktisch validiert.

e) **Smoke-Test mit `fake-indexeddb`** (headless, Node 22) — neue
   Datei `tests/smoke_bau05y_transparent_slot_pfad.mjs`. Vier
   Proben:
   - Probe 1: Default-Slot „main" — init, handshake mit Pseudo-
     Sibling, listSiblings; Sibling-Eintrag muss in
     `sbkim_siblings_main` sein, NICHT in `sbkim_siblings`.
   - Probe 2: Sekundär-Slot „beruflich" — getOrCreateIdentity +
     setActiveIdentity, dann Modul 05 re-init (durch Modul-Re-Load
     im Test), handshake mit Pseudo-Sibling; Sibling-Eintrag in
     `sbkim_siblings_beruflich`.
   - Probe 3: Empfänger-Pfad — receiveHandshake mit `toNodeId` der
     main-Persona; Eintrag landet in `sbkim_siblings_main` auch
     wenn `active-identity` = „beruflich" ist.
   - Probe 4: Empfänger-Pfad mit unbekanntem `toNodeId` →
     `outcome: "rejected", reason: enthält "toNodeId"`.

   Regression-Smoke-Tests Bau-02.Y (33/33) + Pflege-01 (8/8) + Bau-
   04.A (19/19) müssen weiterhin grün laufen.

f) **Übergabeprotokoll** in
   `docs/sessions/archiv/2026-05-XX_bau-05y-transparent-slot-pfad.md`
   mit allen sechs Punkten a–f, Heilige-Tafeln-Eingehalten-Block,
   Was-NICHT-angefasst-Block, Sichttest-Vermerk, Nächster-sinnvoller-
   Schritt-Block.

Was du NICHT tust:

- **Kein Modul-06/07-Eingriff.** Bau 06.Y / 07.Y kommen mit eigenen
  Briefen. KEINER der drei Konsumenten von Bau 02.Y wird mit-erledigt.
- **Keine `setActiveIdentity`-Aufrufe aus Modul 05.** Receiver nutzt
  den getroffenen Slot NUR für die Operation; globaler Marker bleibt
  unangetastet.
- **Kein `refreshIdentityMap()`-Hook.** Re-Init via Tab-Reload ist
  Spec-konform (Karte 05).
- **Keine Migration der alten nicht-suffixed sbkim_siblings-Daten.**
  Wer alte Daten hat: via `importBackup` (Bau 02.Y) in den main-Slot
  bringen.
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **Keine Sage-Page-Änderung.**
- **Keine CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf.** Modul 05 ist bereits
  `score:"fertig"`; transparenter Slot-Pfad ist additiv, kein Score-
  Wechsel.

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am Sitzungsende.
2. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort:
   - Klaus' Browser-Sichttest Panel 05 (Setup-Knopf zeigt
     `sbkim_siblings_main`-Store, Knopf 10 Sekundär-Persona).
   - Brief BAU_06Y schreiben (Modul 06 Heterokaryose transparenter
     Slot-Pfad, analog 05.Y).
   - Brief BAU_07Y schreiben (Modul 07 Apoptose transparenter
     Slot-Pfad + `_sendLegacyForIdentity`-Hook).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Sitzungs-Eintrag
  „Bau 05.Y abgebrochen" ans Ende.
- Wahrscheinliche Stolperfallen:
  - **Receiver-Map-Race bei Mid-Operation-Identitäts-Wechsel:** wenn
    Klaus während eines laufenden `receiveHandshake` per
    `setActiveIdentity(...)` die globale Identität wechselt. Karte 02
    § Risiken benennt das als nicht-spezifizierten Fall — Modul 05's
    Receiver nutzt den `targetSlotKey` aus dem Map-Lookup (zur
    Request-Zeit) und wird vom globalen Wechsel nicht beeinflusst.
    Sender-Pfad cached `activeSlotKey` zur Operations-Zeit (analog).
  - **`sbkim_anastomosis_log`-Aufrufe verteilt:** mehrere Stellen im
    Code schreiben/lesen den Log. Sicherstellen, dass ALLE Aufrufe
    den slot-suffixed Namen nutzen (Modul-internes grep „sbkim_
    anastomosis_log").
  - **Modul-06-Lese-Rechte auf `sbkim_anastomosis_log`:** Modul 06's
    `forgetExpiredSiblings`-Pfad liest das Log. Bau 05.Y ändert den
    Store-Namen — Modul 06 muss in Bau 06.Y nachgezogen werden. Bis
    dahin: Modul 06's TTL-Sweep liest den nicht-suffixed Store und
    findet leere Einträge. **Bekannte Limitierung — als
    Mid-Hinweis in Karte 05 § Bauzustand notieren.** Modul 06 läuft
    fail-soft; kein Bruch, nur unvollständige TTL-Sweeps bis Bau
    06.Y.

Zeitschätzung: 2-3 Stunden für Bau + Karten-Nachzug + Test-Knopf +
Übergabeprotokoll + Smoke-Test. Bei Receiver-Map-Race-Befunden 3-4 h.
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Auslöser dieser Bau-Sitzung:** Brief 99-Pipeline. Nach Bau 02.Y
  (Multi-Identitäts-API) + Pflege Modul 01 (init versions-fail-soft)
  + Bau 04.A (matchDimensions) sind die Konsumenten 05/06/07 dran —
  Bau 05.Y ist die direkte logische Folge zu Bau 02.Y.

- **Spec-Quelle Brief 04 (PR #99):** identitäts-spezifische Store-
  Pattern und Receiver-Map-Konvention sind in INTERFACES § 1 Modul
  05 + § 9.2 + § 9.4 spezifiziert. Karte 05 ist seit Brief 04 auf
  den neuen Stand gepflegt.

- **PR-Pipeline-Stand:** Brief 99 → Bau 01.Y ✓ → Bau 02.Y ✓ → Pflege
  Tafel-Evolution ✓ → Brief Pflege 01-init ✓ → Pflege Modul 01 ✓ +
  Sichttest ✓ → Brief BAU_04A ✓ → Bau 04.A ✓ + Sichttest ✓ → Brief
  BAU_04B ✓ → **Brief BAU_05Y (dieser PR)** → eigene Bau-Sitzung →
  Brief BAU_06Y → Bau 06.Y → Brief BAU_07Y → Bau 07.Y → Endknoten-
  Migration.

- **`PROTOCOL_VERSION` bleibt `"0.1"`**, **`DB_VERSION` bleibt `4`**,
  **`BACKUP_FORMAT_VERSION` bleibt `2`**.

- **Manueller Sichttest:** Setup-Knopf in Panel 05 zeigt den aktiven
  Slot; neuer Knopf 10 für Sekundär-Persona-Test (mit Tab-Reload-
  Schritt). Bekannte Limitierung: Modul 06's TTL-Sweep liest den
  nicht-suffixed Log bis Bau 06.Y nachgezogen ist.

- **Auslöser-Befehl im Chat (Kaskaden-Konvention 6):** der Volltext
  des Briefes oben ist im Repo (diese Datei). Klaus tippt am
  Sitzungs-Start nur den kurzen Auslöser-Befehl mit Verweis auf die
  Brief-Datei.
