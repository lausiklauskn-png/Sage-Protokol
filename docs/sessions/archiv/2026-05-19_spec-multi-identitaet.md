# Übergabeprotokoll · 2026-05-19 · Spec — Multi-Identität (Brief 04 der V1-Sammelspec-Kaskade)

## Sitzungs-Rahmen

- **Rolle:** Spec-Sitzung (kein Code, kein Modul-Eingriff).
- **Branch:** `claude/spec-v1-multi-identitaet-Kwytf` (Harness-Suffix;
  im Brief als `claude/spec-v1-multi-identitaet` geführt; vom `main`
  aus angelegt nachdem Brief-03-PR #98 gemerged war).
- **Auslöser:** Auslöser-Befehl aus dem Chat-Tab (Kaskaden-Konvention 6,
  2026-05-18) plus `docs/sessions/BRIEF_04_multi_identitaet.md` als
  verbindlicher Brief-Volltext.
- **Quell-Spec:** `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md` § STRANG 3
  (heraus-geschnitten als Brief 04 in der V1-Sammelspec-Kaskade —
  PULS § Archiv-Index „Meta-Pflege · V1-Sammelspec als Brief-Kaskade
  sequenziert", sechs heilige Tafeln).
- **Etappe in der Kaskade:** Brief 04 von 4 (vierte und letzte Strang-
  Sitzung). Vorgänger: Brief 01 V1 Sage-Hybrid (PR #96, gemerged
  2026-05-18, `main` `a3e0072`), Brief 02 Plattform-Matrix (PR #97,
  gemerged 2026-05-18, `main` `69077db`), Brief 03 M04-Erweiterung
  (PR #98, gemerged 2026-05-19, `main` `27d6a19`). Folge-Etappe:
  BRIEF_99-Abschluss.

## Kern (3 Sätze)

Strang 3 verankert die Multi-Identität in der IndexedDB als
verbindliche Spec-Klausel: `sbkim_keys["main"]` bleibt Default-Slot,
beliebig viele weitere Slots sind erlaubt, `sbkim_meta["active-identity"]`
ist der String-Marker für die aktive Persona (Default „main").
Modul 02 (Spore) bekommt fünf neue / erweiterte API-Funktionen
(`getOrCreateIdentity(key?)`, `setActiveIdentity(key)`,
`getActiveIdentityKey()`, `listIdentities()`, `removeIdentity(key,
options?)`); Module 05 / 06 / 07 lesen `getActiveIdentityKey()` im
`init()`-Pfad und cachen den Wert; alle identitäts-spezifischen
Stores folgen dem Pattern `<store-base>_<key>` (Geschwister,
Anastomose-Log, Vermächtnis-Inbox, Heterokaryose-Inbox, Heterokaryose-
Outbox — eine pro Persona, mit verbindlicher Persona-Isolation).
**PROTOCOL_VERSION bleibt `"0.1"`** — Strategie A für Pages-
`spore.json` gewählt (nur aktive Identität wird gehostet; Strategie B
mit `identities[]`-Pflicht-Feld würde auf 0.2 bumpen und wurde
ausdrücklich NICHT gewählt), alle neuen API-Funktionen sind additiv
mit Default-Slot „main" als Rückwärts-Kompat.

## Was getan wurde

### 1. INTERFACES.md — neue § 9 Identitäts-Map + Module-Vertrags-Erweiterungen + Änderungsprotokoll-Nachnummerierung

- **§ 1 Modul 02 (Spore) Bietet-Block** um fünf neue / erweiterte
  Funktionen erweitert plus zwei bestehende Funktionen um
  optionalen key-Parameter:
  - `getOrCreateIdentity(key?: string)` — Default `"main"`.
  - `setActiveIdentity(key: string)` — validiert key, schreibt
    `sbkim_meta["active-identity"]`, ruft `resetIdentityCache()`.
  - `getActiveIdentityKey()` — Default `"main"`.
  - `listIdentities()` — lexikographisch sortierte Slot-Liste.
  - `removeIdentity(key, options?)` — idempotent, löscht alle
    identitäts-spezifischen Stores; `force:false` (Default) wirft
    `RemoveActiveIdentityError` bei aktiver Identität; `force:true`
    triggert per-Persona-Apoptose mit Vermächtnis-Versand (Hook in
    Modul 07: `_sendLegacyForIdentity`).
  - `generateOwnSpore(meta, key?)` + `getOwnSpore(key?)` um
    optionalen key-Parameter erweitert.
- **§ 1 Modul 02 Singleton-Klausel** durch Identitäts-Slot-Vertrag
  ersetzt (Default-Slot „main" verbindlich, beliebig viele weitere
  Slots, `sbkim_meta["active-identity"]` als String-Marker; Verweis
  auf § 9).
- **§ 1 Modul 02 Storage-Block** um `sbkim_meta["active-identity"]`
  erweitert; Werteform `sbkim_keys[key]` / `sbkim_spore[key]`.
- **§ 1 Modul 02 Selbstcheck** auf zwölf Funktionen erweitert.
- **§ 1 Modul 02 Fehlerverhalten** um `UnknownIdentityError` +
  `RemoveActiveIdentityError` + `removeIdentity`-idempotente-Variante
  erweitert.
- **§ 1 Modul 02 Garantien-Block** um Aktive-Identität-Lese-
  Konvention für 05/06/07 erweitert (`getActiveIdentityKey()` im
  `init()`, gecached für Operation; Mid-Operation-Wechsel NICHT
  spezifiziert).
- **§ 1 Modul 05 (Anastomose)** Storage-Block auf `sbkim_siblings_<key>`
  / `sbkim_anastomosis_log_<key>` Pattern umgestellt (Pre-Brief-04-
  Singleton-Aufrufer treffen unverändert auf `_main`-Slots);
  Identitäts-Cache-Konvention dokumentiert; Receiver-Pfad mit Map
  nodeId→key beim init() spezifiziert; Nutzt-Block um
  `getActiveIdentityKey` + `listIdentities` erweitert; Garantien-Block
  um Persona-Isolation-Klausel erweitert; Geprüft-Zeile um Brief 04
  erweitert.
- **§ 1 Modul 06 (Heterokaryose)** Storage-Block auf
  `sbkim_hetero_inbox_<key>` / `sbkim_hetero_outbox_<key>` /
  `sbkim_siblings_<key>` / `sbkim_anastomosis_log_<key>` Pattern
  umgestellt; Identitäts-Cache-Konvention analog Modul 05;
  Receiver-Pfad mit Map nodeId→key spezifiziert; Garantien-Block
  um Persona-Isolation-Klausel erweitert; Geprüft-Zeile um Brief 04
  erweitert.
- **§ 1 Modul 07 (Apoptose)** Storage-Block auf
  `sbkim_legacy_inbox_<key>` Pattern umgestellt; Cleanup-Reihenfolge
  auf zwei Pfade aufgespalten (globale Self-Apoptose über alle Slots
  iteriert; per-Persona-Cleanup über `removeIdentity(key, {force:true})`
  als eigener Pfad in Modul 02, der Modul 07 nur für den Vermächtnis-
  Versand pro Persona ruft — interner Hook `_sendLegacyForIdentity`).
  `confirmSelfApoptose` wirkt global (alle Personae sterben gemeinsam,
  Vermächtnis-Versand pro Persona, Cleanup über alle Slots).
  `forgetExpiredSiblings(maxAgeMs, key?)` und `listLegacy(key?)` um
  optionalen key-Parameter erweitert. Garantien-Block um Globale-vs-
  Per-Persona-Apoptose-Klausel erweitert. Selbstcheck-Hinweis: der
  interne Hook steht nicht in der öffentlichen API.
- **§ 2 Spore-JSON** Multi-Identitäts-Hinweis-Block ergänzt:
  - **Strategie A (Default, gewählt)** — `spore.json` trägt nur die
    aktive Identität, `PROTOCOL_VERSION` bleibt `"0.1"`, Identitäts-
    Wechsel = neuer Spore-Push.
  - **Strategie B (NICHT gewählt)** — Liste-Schema mit
    `identities[]`-Pflicht-Feld, würde `PROTOCOL_VERSION` auf
    `"0.2"` bumpen und alle bestehenden Empfänger brechen.
- **§ 9 Identitäts-Map (Multi-Identität, Brief 04)** als neue
  verbindliche Spec-Klausel eingefügt, mit sieben Sub-§:
  - **§ 9.1 Slot-Schema** — `sbkim_keys["main"]` + beliebige weitere
    Slots; `sbkim_meta["active-identity"]` als String-Marker; keine
    Validierung der Schlüssel-Form in Modul 02 (Aufrufer-Pflicht);
    Default „main" hat Rückwärts-Kompat-Garantie aber keine
    Magic-Wert-Bedeutung.
  - **§ 9.2 Identitäts-spezifische Stores** — Pattern-Tabelle für
    fünf Stores plus Persona-Isolation-Klausel (verbindlich, Folge-
    Spec darf nur unter ausdrücklicher Trade-off-Verhandlung
    lockern).
  - **§ 9.3 `active-identity`-Marker** — Lese-Konvention (Module
    05/06/07 cachen beim init(), Mid-Operation-Wechsel NICHT
    spezifiziert), Schreib-Konvention (Modul 02 alleiniger
    Schreiber).
  - **§ 9.4 Receiver-Pfad** — eingehende Requests mit `toNodeId`
    werden gegen alle eigenen Identitäten geprüft (Map nodeId→key
    beim init()); getroffene Persona wird intern für die Operation
    als aktive Identität verwendet.
  - **§ 9.5 Migrations-Strategie** — Option A dynamische Store-
    Erzeugung via `SbkimStorage.ensureStore(name)` (Empfehlung) vs.
    Option B feste Slot-Tabelle (Spec-Alternative); Bau-Folge-Sitzung
    01.Y zieht den Pfad nach.
  - **§ 9.6 Trade-off-Klausel** — IndexedDB-Verlust + Backup-Strategie
    „kompletter Rucksack" + Königin-Relay-Pflicht + Privatheit.
  - **§ 9.7 Verbindung zur M04-Erweiterung (Brief 03)** — doppelte
    Spore pro Persona; Match-Pipeline pro Persona; Sibling-Listen
    tragen Match-Cosinus zur spezifischen Persona.
- **§ 9 Änderungsprotokoll auf § 10 nachnummeriert** (additiv, keine
  Inhalte verschoben — Brief 04 fügt § 9 vor der Changelog ein).
  Neuer Brief-04-Eintrag in § 10 mit allen Punkten dieser Sitzung +
  Verweis auf Brief 03-PR #98 als Vorgänger.

### 2. Karte 02 (`docs/components/02_spore.md`) erweitert

- § Schnittstelle um fünf neue / erweiterte Funktionen (analog
  INTERFACES.md § 1 Modul 02 Bietet-Block); Selbstcheck-
  Funktionsliste auf zwölf Funktionen erweitert.
- § Singleton-Identität durch Identitäts-Slot-Vertrag ersetzt
  (Default-Slot „main" verbindlich, beliebig viele weitere Slots).
- Neuer Sub-Block „Multi-Identität (Brief 04)" mit:
  - Konzept-Einführung + Verweis auf INTERFACES.md § 9.
  - API-Erweiterung-Übersicht (fünf neue / erweiterte Funktionen).
  - Pro-Persona-Spore-/M04-Verknüpfung (doppelte Spore pro Identitäts-
    Slot).
  - Persona-Isolation-Stores-Tabelle (sieben Store-Pattern-Zeilen).
  - Backup-Strategie „kompletter Rucksack" (Empfehlung) +
    Alternative (separate Container pro Identität, NICHT gewählt) +
    `BACKUP_FORMAT_VERSION`-Bump-Vermerk 1→2 für Bau-Folge-Sitzung
    02.Y.
  - Migrations-Strategie (Option A dynamische Store-Erzeugung
    empfohlen).
  - Trade-off-Klausel.
  - Bezugs-Verweise auf Vision-Anker 6 / 9 / 4 / 5 + INTERFACES.md
    § 9.
- M04-Erweiterungs-Sub-Block (Brief 03) Bezugs-Verweis aktualisiert
  (Persona-Mehrfachheit jetzt geliefert).
- Bauzustand-Tabelle um Zeile „Spec Multi-Identität (Brief 04)"
  erweitert.

### 3. Karte 05 (`docs/components/05_anastomose.md`) erweitert

- § Schnittstelle Hinweise auf `sbkim_siblings_<key>`-Pattern in
  `handshake` (Punkt 6 receiver-seitig) + `listSiblings` +
  `forgetSibling` (`<key>` = aktive Identität).
- § Datenformate `sbkim_siblings` / `sbkim_anastomosis_log` auf
  identitäts-spezifische Pattern-Namen umgestellt + neuer Hinweis-
  Block „Multi-Identität (Brief 04)" mit Receiver-Pfad und Persona-
  Isolation.
- Bauzustand-Tabelle um Zeile „Spec Multi-Identität (Brief 04)"
  erweitert.

### 4. Karte 06 (`docs/components/06_heterokaryose.md`) erweitert

- § Schnittstelle Hinweise auf `sbkim_siblings_<key>` /
  `sbkim_hetero_inbox_<key>`; neuer Receiver-Pfad-Schritt 4b in
  `receiveHeterokaryosis`; Sibling-/Opt-In-Filter (Schritte 5+6)
  lesen `sbkim_siblings_<hit-key>` der getroffenen Persona.
- `listHeterokaryosis` / `forgetHeterokaryosis` Hinweise auf
  identitäts-spezifischen Slot.
- Bauzustand-Tabelle um Zeile „Spec Multi-Identität (Brief 04)"
  erweitert.

### 5. Karte 07 (`docs/components/07_apoptose.md`) erweitert

- § Schnittstelle:
  - `prepareSelfApoptose` summiert Empfänger über alle Personae.
  - `confirmSelfApoptose` wirkt **global** — alle Personae sterben
    gemeinsam, Vermächtnis-Versand pro Persona mit eigenem Schlüssel,
    Cleanup-Schleife über alle Slots.
  - `receiveLegacy` Schritt 4b Receiver-Map nodeId→key + Schritt 5
    auf `sbkim_legacy_inbox_<hit-key>` / `sbkim_siblings_<hit-key>`.
  - `listLegacy(key?)` und `forgetExpiredSiblings(maxAgeMs, key?)`
    um optionalen key-Parameter erweitert.
- Neuer Top-Level-§ „Multi-Identität (Brief 04)" mit:
  - Globale Self-Apoptose-Pfad (alle Personae, Vermächtnis pro
    Persona, Cleanup-Schleife).
  - Single-Identitäts-Apoptose-Pfad (interner Hook
    `_sendLegacyForIdentity` für Modul 02 `removeIdentity`-Aufrufe).
  - Receiver-Pfad (Map nodeId→key, Schreibe in
    `sbkim_legacy_inbox_<hit-key>`).
  - TTL-/listLegacy-pro-Persona.
  - Bezugs-Verweise.
- § Fehlerverhalten um zwei neue Zeilen erweitert (`toNodeId`-
  Mismatch in `receiveLegacy` als Outcome, nicht Throw;
  `_sendLegacyForIdentity`-Hook `UnknownIdentityError` defensiv).
- Bauzustand-Tabelle um Zeile „Spec Multi-Identität (Brief 04)"
  erweitert.

### 6. PULS.md — neuer Sitzungs-Eintrag + Vision-Anker 6 § Status + Archiv-Index

- Neuer Top-Eintrag „2026-05-19 · Spec — Multi-Identität (Brief 04
  der V1-Sammelspec-Kaskade)" mit den sechs Punkten a–f, voller
  Heilige-Tafeln-Block, Konsistenz-Prüfungs-Notiz (5 Punkte
  abgehakt), Sichttest-Vermerk („ungeprüft, weil reine Doku-Pflege"),
  Nächster-Schritt-Vermerk.
- **Brief-03-Sitzungs-Eintrag aus dem Body entfernt** (Vorletzten-
  Auslagerungs-Konvention) — Voll-Eintrag bleibt im Übergabeprotokoll
  `2026-05-19_spec-m04-erweiterung.md`; im Archiv-Index als
  Tabellenzeile oben mit Quintessenz-Stichworten + Verlinkung.
- **Vision-Anker 6 § Status nachgezogen** auf „Strang 3 der V1-
  Sammelspec realisiert (2026-05-19, Brief 04 der V1-Sammelspec-
  Kaskade)" mit Verweis auf BRIEF_99-Abschluss. Vision-Anker 1 / 4 /
  5 / 7 / 8 / 9 **unangetastet** — Brief 04 ist Strang 3, ohne
  Bezug zu deren Status-Blöcken.
- PULS-Zeilen-Status nach Edit: ~2912 Zeilen (vor Edit 2855; +57
  netto — Brief-04-Eintrag ist umfangreicher als Brief 03 mangels
  Konsistenz-Prüfungs-Spiegelung; Brief-03-Auslagerung kompensiert).
  Schutz-Klausel (3000 Zeilen) eingehalten.

### 7. BRIEF_99 angelegt (Kaskaden-Konvention 2)

`docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md` als letzte Datei-
Aktion. Inhalt: Zusammenfassung aller vier Stränge (V1 Sage-Hybrid /
Plattform-Matrix / M04-Erweiterung / Multi-Identität); Bau-Sitzungs-
Brief-Liste nach Kaskaden-Abschluss (Sage-Page-Refactor mit voller
init()-Kette + Andock-Wizard + Schichten-Lampen + Identitäts-Wechsler;
Bau Stufe A erweitert; Bau Stufe B; Bau Multi-Identitäts-Migration
der Endknoten + Backup-Schema-Bump); Konsistenz-Prüfungs-Pflicht
(alle vier Strang-PRs gemerged); PROTOCOL_VERSION-Status-Snapshot.

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Schnittstellen-Änderungen ZUERST in
  INTERFACES, dann in den Karten 02 / 05 / 06 / 07. § 1 Modul 02 +
  § 1 Modul 05 + § 1 Modul 06 + § 1 Modul 07 + § 2 Spore-JSON + § 9
  Identitäts-Map (neu) + § 10 Änderungsprotokoll (war § 9) alle
  verankert; Karten 02 / 05 / 06 / 07 nachgezogen.
- **PROTOCOL_VERSION-Disziplin geprüft, kein Bump.** Strategie A für
  `spore.json` gewählt (additiv, kein Spore-Schema-Eingriff); alle
  neuen API-Funktionen additiv (alter Singleton-Aufruf-Pfad bleibt
  wortwörtlich gültig); `sbkim_keys[key]` und
  `sbkim_meta["active-identity"]` sind lokales Storage-Schema, kein
  Spore-Feld. PROTOCOL_VERSION bleibt `"0.1"`.
- **`BACKUP_FORMAT_VERSION`-Bump-Vermerk** (Spec-Entscheidung in
  Brief 04, Code-Bump erfolgt in Bau-Folge-Sitzung 02.Y): von 1 auf
  2 für die Multi-Identitäts-Backup-Strategie „kompletter Rucksack".
  Das ist ein additiver Bump des separaten Backup-Wrapper-Schemas
  aus § 0; KEIN `PROTOCOL_VERSION`-Eingriff.
- **Anti-Vorgriff auf V4 Königin-Relay:** Brief 04 spezifiziert die
  Pro-Identität-Mailboxes-Pflicht; das *Wie* der Königin-Umsetzung
  bleibt Anker 4's Spec-Sitzung.
- **Anti-Vorgriff auf V5 Identitäts-Container:** Brief 04 erweitert
  Backup-Format implizit auf alle Identitäten („kompletter Rucksack"),
  spezifiziert den Container nicht (Anker 5 hat eigene Spec-Sitzung).
- **Persona-Isolation als verbindliche Spec-Klausel.** § 9.2: Stores
  pro Persona getrennt; ein Peer gehört einer Persona, nicht dem
  ganzen Knoten; Folge-Spec darf die Klausel nur unter ausdrücklicher
  Trade-off-Verhandlung lockern.
- **Privatheit (Anker 9 § Sorge ums Freigeben):** bleibt offen — die
  Multi-Identitäts-Spec rührt die Lizenz-Frage nicht. Lizenz-
  Entscheidung wird beim Public-Schalten separat geklärt.
- **Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5):**
  Fünf Punkte abgehakt — (1) Brief-03-PR #98 ist gemerged, `main`-
  Stand bei `27d6a19`; (2) INTERFACES § 0 / § 1 Modul 02 / § 1 Modul
  04 / § 2 / § 7 / § 8 / § 9 auf Brief-03-Stand geprüft; (3) M04-
  Erweiterung-Felder pro Identitäts-Slot gespiegelt (eigener
  `sbkim_spore[key]`-Eintrag mit eigenen `embeddingCapabilities` +
  `embeddingNeeds`); (4) Keine Korrekturen an Brief 01 / 02 / 03
  nötig; (5) PR #89 (Karte 15 Membran als Stub, Draft) bleibt
  unangetastet — Modul-15-Block liegt nach Modul 09 in INTERFACES,
  kollidiert nicht mit den Brief-04-Eingriffen.

## Was NICHT angefasst wurde

- **Modul-Code in `src/`** — Spec geht der Implementierung voraus.
  Kein Eingriff in irgendeinem Modul; Bau-Folge-Sitzungen (01.Y
  `ensureStore`, 02.Y Multi-Identitäts-API + Backup-Schema-Bump,
  05.Y / 06.Y / 07.Y transparenter Slot-Pfad) folgen nach Kaskaden-
  Abschluss (BRIEF_99-Liste).
- **Sage-Page `index.html`** — Sage-Page-Refactor ist Bau-Sitzung
  nach Kaskaden-Abschluss (BRIEF_99-Liste). Keine Karten-Erweiterung
  um einen „Identitäts-Wechsler"-UX.
- **M04-Erweiterung-Änderung (Brief 03)** — Brief 03 hat die
  Felder gesetzt; Brief 04 spiegelt sie nur pro Persona, ohne
  Brief-03-Vertrag zu ändern.
- **Plattform-Matrix (Brief 02)** — Brief 02 hat sie gesetzt;
  Brief 04 verweist nicht direkt.
- **Königin-Relay-Spec (Anker 4)** — eigene Spec-Sitzung. Brief 04
  verankert nur die Pro-Identität-Mailboxes-Pflicht.
- **Identitäts-Container-Spec (Anker 5)** — eigene Spec-Sitzung.
  Brief 04 verweist auf den Container als Backup-Strategie.
- **Extension- oder Mini-Browser-Spec (Anker 7 / 8)** — eigene
  Spec-Sitzungen.
- **CLAUDE.md** — Brief 01 hat sie auf „Hub und Knoten zugleich"
  umgeschrieben. Brief 04 ändert nichts.
- **Karte 09** (`docs/components/09_einbau_pwa.md`) — Brief 01 hat
  § Schritt 1 erweitert. Brief 04 ändert nichts (Multi-Identitäts-
  Wechsler-UX gehört in die Sage-Page-Refactor-Bau-Sitzung).
- **`status.json`** — Brief 01 hat Sage als drittes
  `endknoten[]`-Element aufgenommen. Brief 04 ändert nichts.
- **`update_puls_pie.py`** NICHT aufgerufen — keine
  `status.json`-Score-Wechsel.
- **`tests/manual_check.html`** unangetastet — kein Modul-
  Eingriff, keine UI-Erweiterung.

## Was offen blieb (für Folge-Sitzungen)

- **BRIEF_99 (Sammelspec-Abschluss) als nächste Etappe.** Auslöser-
  Befehl im Chat-Tab; Brief-Datei
  `docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md` liegt im Repo.
  BRIEF_99 schließt die Kaskade und benennt die Bau-Sitzungs-Brief-
  Liste für die nächste Welle (Sage-Page-Refactor-Bau + Bau-Folge-
  Sitzungen 01.Y / 02.Y / 05.Y / 06.Y / 07.Y).
- **Bau-Folge-Sitzungen** für Multi-Identität:
  - **01.Y `ensureStore`-Helper** in Modul 01 (Option A aus § 9.5;
    Versions-Bump-Choreografie für v=3 → v=4 oder dynamisch). ~2-3 h.
  - **02.Y Multi-Identitäts-API + Backup-Schema-Bump** in Modul 02
    (`getOrCreateIdentity(key)` / `setActiveIdentity` / `listIdentities` /
    `removeIdentity` + Backup-Wrapper auf
    `BACKUP_FORMAT_VERSION=2`). ~5-8 h (komplex wegen Backup-
    Schema-Bump und WebCrypto-Pfaden pro Identität).
  - **05.Y / 06.Y / 07.Y transparenter Slot-Pfad** in den Konsumenten
    (über `getActiveIdentityKey()` + Receiver-Map nodeId→key). ~2-3 h
    je Modul.
  - **Sage-Page-Refactor-Bau** (BRIEF_99-Liste) mit Identitäts-
    Wechsler-UX. ~3-5 h.
  - **Multi-Identitäts-Migration der Endknoten** in Mein-Mixarium /
    Mein-Rezeptbuch (additive Andock-Wizard-Erweiterung). ~2 h.
- **Vision-Anker 4 / 5 / 7 / 8** bleiben Vision; eigene Spec-
  Sitzungen kommen nicht in der V1-Sammelspec-Kaskade.

## Nächster sinnvoller Schritt

**Auslöser-Befehl für BRIEF_99-Abschluss** (Kaskaden-Konvention 6,
im Chat-Tab am Sitzungs-Ende):

```
Lies docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md vollständig
und führe den Brief als Abschluss-Sitzung der V1-Sammelspec-
Kaskade aus. Konventionen siehe PULS § Archiv-Index „Meta-
Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" (sechs
heilige Tafeln). Branch laut Brief (claude/spec-v1-abschluss
oder ähnlich, vom main aus anlegen).
```

**Reihenfolge-Hinweis:** BRIEF_99 setzt Brief-04-PR (diese Sitzung)
als gemerged voraus. Wenn Klaus die Kaskade pausieren will, kann
die Brief-04-PR auf `main` ruhen, und BRIEF_99 wird zu einem
späteren Zeitpunkt gestartet — INTERFACES § 1 Modul 02 / 05 / 06 /
07 / § 2 / § 9 bleiben gültig, weil sie additiv sind.

## Manueller Sichttest

**Ungeprüft, weil reine Doku-Pflege.** Kein Modul-Code in `src/`,
kein `tests/manual_check.html`-Eingriff, keine Sage-Page-Änderung,
`status.json` unverändert, `update_puls_pie.py` NICHT aufgerufen.
INTERFACES.md ist Spec-Tafel, kein Sichttest-pflichtiger Artefakt.

## Verlinkte Artefakte

- **Brief-Datei:** `docs/sessions/BRIEF_04_multi_identitaet.md`
- **Vorgänger-Briefe:** `docs/sessions/BRIEF_01_v1_sage_hybrid.md`,
  `docs/sessions/BRIEF_02_plattform_matrix.md`,
  `docs/sessions/BRIEF_03_m04_erweiterung.md`
- **Folge-Brief:** `docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md`
  (als letzte Datei-Aktion dieser Sitzung angelegt; Kaskaden-
  Konvention 2)
- **Quell-Spec:** `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
  § STRANG 3.
- **INTERFACES neue Sub-Sektionen:**
  - § 1 Modul 02 Bietet-Block (fünf neue / erweiterte Funktionen),
    Singleton-Klausel → Slot-Vertrag, Storage-Block, Selbstcheck,
    Fehlerverhalten, Garantien.
  - § 1 Modul 05 Storage-Block + Identitäts-Cache-Konvention +
    Garantien-Persona-Isolation.
  - § 1 Modul 06 Storage-Block + Receiver-Map + Persona-Isolation.
  - § 1 Modul 07 Bietet-Block + Storage-Block + Cleanup-Reihenfolge
    (global / per-Persona) + Garantien-Aufspaltung.
  - § 2 Spore-JSON Multi-Identitäts-Hinweis-Block (Strategie A
    gewählt, B als Folge-Spec-Option).
  - § 9 Identitäts-Map (NEU, sieben Sub-§).
  - § 10 Änderungsprotokoll (war § 9, nachnummeriert).
- **Karten neue Sub-Sektionen:**
  - Karte 02 § Multi-Identität (Brief 04) mit allen Trade-off-Punkten.
  - Karte 05 § Datenformate Multi-Identitäts-Hinweis-Block.
  - Karte 06 § Schnittstelle Receiver-Map-Schritt 4b.
  - Karte 07 § Multi-Identität (Brief 04) (neuer Top-Level-§).
- **PULS-Eintrag:** § Sitzungs-Einträge, neuer Top-Eintrag
  „2026-05-19 · Spec — Multi-Identität (Brief 04)"; Vision-Anker 6
  § Status nachgezogen; Brief-03-Sitzungs-Eintrag ins Archiv-Index
  ausgelagert.
- **Vorgänger-PRs:** #96 „Spec: V1 Sage-Hybrid — Strang 1"
  (gemerged 2026-05-18), #97 „Spec: Plattform-Matrix — Strang 2"
  (gemerged 2026-05-18), #98 „Spec: M04-Erweiterung — Strang 3"
  (gemerged 2026-05-19).
- **Paralleler PR:** #89 „Karte 15 Membran als Stub" (Draft, offen,
  kollidiert nicht — Modul-15-Block nach Modul 09 in INTERFACES,
  keine Berührung mit Multi-Identitäts-Modulen 02 / 05 / 06 / 07).
- **PULS § Vision-Anker:** 1 (V1 Sage-Hybrid), 4 (Königin-Relay), 5
  (Identitäts-Container), **6 (Multi-Identität — Haupt-Anker,
  § Status nachgezogen),** 7 (Extension), 8 (Mini-Browser), 9 (M04-
  Erweiterung).
- **Bezugs-Dokumente:**
  - PULS § Vision-Anker 6 „Multi-Identität in der IndexedDB" (Haupt-
    Anker, Konzept-Vorlage).
  - PULS § Vision-Anker 9 „M04-Erweiterung" (Bezugs-Anker: doppelte
    Spore pro Persona).
  - PULS § Vision-Anker 4 „Königin-Relay" (Bezugs-Anker: Pro-Identität-
    Mailboxes).
  - PULS § Vision-Anker 5 „Identitäts-Container" (Bezugs-Anker:
    Backup-Strategie „kompletter Rucksack").
