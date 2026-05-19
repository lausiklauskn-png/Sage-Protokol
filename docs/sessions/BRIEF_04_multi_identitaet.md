# Brief 04 — Spec-Sitzung Multi-Identität · vierte Etappe der V1-Sammelspec-Kaskade

**Strang 4 von 4** der V1-Sammelspec, kaskadiert in PR der
Meta-Pflege 2026-05-18 (siehe `docs/PULS.md` § Archiv-Index
„Meta-Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" plus
Übergabeprotokoll
`docs/sessions/archiv/2026-05-18_meta-pflege-v1-sammelspec-kaskade.md`).
Quell-Spec ist `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
§ STRANG 3; dieser Brief schneidet den Strang heraus und liefert
die Etappe als eigenständige Sitzung. Brief 01 (V1 Sage-Hybrid),
Brief 02 (Plattform-Matrix) und Brief 03 (M04-Erweiterung) wurden
in den vorausgegangenen Sitzungen erledigt und sind Voraussetzung.
Nach Brief 04 schließt BRIEF_99_SAMMELSPEC_ABSCHLUSS die Kaskade.

Dieser Brief geht in den **ersten Prompt** der nächsten Spec-Sitzung
als Codeblock.

---

```
Du bist eine Spec-Sitzung in Sage-Protokol — Brief 04 der V1-
Sammelspec-Kaskade.

Branch: claude/spec-v1-multi-identitaet   (vom main aus anlegen,
        NACHDEM Brief-03-PR gemerged ist — siehe Konsistenz-Prüfung)

Sitzungs-Rolle: Spec (kein Code, kein Modul-Eingriff). Du
realisierst STRANG 3 der V1-Sammelspec — Multi-Identität in der
IndexedDB mit `sbkim_keys`-Multi-Slots, `active-identity`-Marker,
Geschwister-Netz pro Identität und Verbindung zur doppelten Spore
(Brief 03 — pro Persona eigene `embeddingCapabilities` +
`embeddingNeeds`). Brief 01, Brief 02 und Brief 03 sind erledigt
und Voraussetzung. INTERFACES.md ist die heilige Tafel — ziehst du
sie ZUERST, dann Modul-Karten 02 + 05 + 06 + 07 (alle vier
editierst du). CLAUDE.md / Karte 09 / status.json bleiben
unangetastet (Brief 01-03 haben sie auf den Endknoten-/Plattform-/
M04-Stand gebracht — Brief 04 lebt in INTERFACES + Karten 02 / 05 /
06 / 07).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (Sitzungs-Disziplin, Pflicht am Sitzungs-Ende,
   Konventionen — § „Was dieses Repo ist" steht seit Brief 01 auf
   „Hub und Knoten zugleich")
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Spec — M04-Erweiterung
     (Brief 03 der V1-Sammelspec-Kaskade)" als unmittelbarer
     Vorgänger
   - § Archiv-Index: „Spec · Plattform-Matrix — Strang 2 (Brief 02)"
     + „Spec · V1 Sage-Hybrid — Strang 1 (Brief 01)" + „Meta-Pflege ·
     V1-Sammelspec als Brief-Kaskade sequenziert" (sechs heilige
     Tafeln) plus die drei Übergabeprotokolle
   - § Vision-Anker
     - „2026-05-18 · Multi-Identität in der IndexedDB" (Anker 6 —
       HAUPT-Anker dieser Sitzung)
     - „2026-05-17 · Sage als Hybrid-Knoten (Variante I)" (Anker 1,
       § Status nach Brief 01 auf „Strang 1 realisiert")
     - „2026-05-17 · Königin-Relay (Modul 13?)" (Anker 4 — Bezugs-
       Anker; Königin muss pro-Identität-Mailboxes verwalten)
     - „2026-05-17 · Identitäts-Container" (Anker 5 — Bezugs-Anker;
       jeder Backup-Container könnte mehrere Identitäten enthalten)
     - „2026-05-18 · M04-Erweiterung" (Anker 9, § Status nach
       Brief 03 auf „Strang 2 realisiert" — Bezugs-Anker: doppelte
       Spore pro Persona)
3. docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md § STRANG 3 (Detail-
   Vorlage für die sechs Punkte a–f dieses Strangs)
4. docs/sessions/BRIEF_01_v1_sage_hybrid.md + docs/sessions/BRIEF_02_plattform_matrix.md
   + docs/sessions/BRIEF_03_m04_erweiterung.md (Vorgänger-Briefe;
   lies die Pflicht-am-Ende-Sektionen und die Konsistenz-Prüfungs-
   Blöcke — Brief 04 erbt deren Bauplan und die Konvention-5-
   Disziplin)
5. docs/sessions/BRIEF_04_multi_identitaet.md (dieser Brief)
6. docs/INTERFACES.md (vollständig — heilige Tafel, du editierst
   sie; § 0 / § 1 Modul 02 / § 1 Modul 04 / § 1 Modul 05 / § 1
   Modul 06 / § 1 Modul 07 / § 2 Spore-JSON / § 7 (LLM-Stufe-B-
   Ehrlichkeit) / § 8 (Anti-Missbrauch) / § 9 (Änderungsprotokoll)
   sind alle aus Brief 01-03 nachgezogen; deine Eingriffe liegen
   primär in § 1 Modul 02 (API-Erweiterung + Identitäts-Map),
   § 1 Modul 05 (sbkim_siblings_<key> als Pattern, Lese-Pfad
   transparent), ggf. § 2 Spore-JSON (Strategie A oder B), § 9
   Änderungsprotokoll plus einer neuen Identitäts-Map-Sektion —
   entscheide in der Spec die Platzierung)
7. docs/components/02_spore.md (vollständig — du editierst sie)
8. docs/components/05_anastomose.md (vollständig — du editierst
   sie für den identitäts-spezifischen Siblings-Slot-Pfad)
9. docs/components/06_heterokaryose.md (du editierst sie für den
   identitäts-spezifischen Heterokaryose-Pfad)
10. docs/components/07_apoptose.md (du editierst sie — Apoptose-
    Cleanup muss pro Identität funktionieren, oder Single-Identitäts-
    Apoptose pro `removeIdentity(key)`-Aufruf)

Was du NICHT liest: andere Komponenten-Karten als 02/05/06/07,
Modul-Code in src/, Sage-Page index.html, andere Vision-Anker
in PULS als die oben genannten.

Heilige Tafeln (Kaskaden- und Strang-spezifisch):

- **INTERFACES verbindlich** — wenn du eine Schnittstelle
  änderst, ZUERST dort, DANN Karten 02 + 05 + 06 + 07. Die
  Identitäts-Map (sbkim_keys-Multi-Slots, sbkim_meta["active-
  identity"]-Marker) bekommt einen eigenen § oder Sub-§-Block in
  INTERFACES — entscheide in der Spec, ob als neue § 10 oder als
  Sub-Block von § 1 Modul 02.

- **PROTOCOL_VERSION-Disziplin:** Strang 3 ist im Default
  additiv — `sbkim_keys[key]` ist ein lokales Storage-Schema, kein
  Spore-Feld; `sbkim_meta["active-identity"]` ist ebenfalls
  lokal. Erwartung: `PROTOCOL_VERSION` bleibt `"0.1"`. **ABER:**
  wenn du in § d (Pages-spore.json) Strategie B wählst (Liste-
  Schema mit mehreren Identitäten pro `spore.json`), ist das ein
  Spore-Schema-Eingriff — Strategie B fügt ein neues Pflicht-Feld
  ein (z.B. `identities[]` als Array von Identitäts-Spore-Sub-
  Objekten) und bricht alte Empfänger, die nur ein flaches
  Spore-Objekt erwarten. Strategie B → `PROTOCOL_VERSION`-Bump
  auf `"0.2"`, EXPLIZIT im Änderungsprotokoll + im PULS-Sitzungs-
  Eintrag begründet. Empfehlung in der Spec: **Strategie A (nur
  aktive Identität in spore.json)** als Default — sie ist
  rückwärtskompatibel und passt zur „Sporen-Wechsel = neuer
  Spore-Push"-Logik. Strategie B als Option nennen, aber
  Klaus-Entscheidung vorbehalten (in Folge-Spec-Sitzung, wenn
  Multi-Persona-Use-Case erprobt ist).

- **Anti-Vorgriff auf V4 Königin-Relay:** Brief 04 spezifiziert,
  dass Königin-Mailboxes pro Identität existieren MÜSSEN (wenn
  Modul 13 gebaut wird) — aber Brief 04 spezifiziert NICHT, wie
  die Königin das umsetzt. Verweis auf V4 als heilige Tafel.

- **Anti-Vorgriff auf V5 Identitäts-Container:** der Backup-
  Container (Modul 02 `exportBackup` aus Bau 02.X 2026-05-16)
  speichert heute nur `sbkim_keys["main"]`. Brief 04 erweitert
  Backup-Format implizit auf alle Identitäten — entweder als
  separate Container pro Identität ODER als ein Container mit
  allen Identitäten (Klaus' „kompletter Rucksack"-Vision aus
  PULS § Anker 6). Spec entscheidet; die Bau-Folge-Sitzung 02.Y
  zieht den Code nach.

- **Verbindung zur M04-Erweiterung (Brief 03):** jede Identität
  trägt ihre eigene doppelte Spore (`embeddingCapabilities` +
  `embeddingNeeds`). Die zwei Vektor-Slots aus Brief 03 sind
  pro Persona unabhängig — Brief 04 spezifiziert die Persona-
  Mehrfachheit, Brief 03 hat die Vektor-Slots schon spezifiziert.
  Karte 02 (M04-Erweiterung Sub-Block) hat schon den Verweis
  „doppelte Spore pro Persona, Brief 04" hinterlegt.

- **Privatheit (Anker 9 § Sorge ums Freigeben):** bleibt offen;
  die Multi-Identitäts-Spec rührt die Lizenz-Frage nicht.

Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5):

1. Prüfe, dass der Brief-03-PR (Spec M04-Erweiterung — Strang 3
   der V1-Sammelspec-Kaskade aus Cascading-Sicht) gemerged ist.
   Wenn nicht: HALT AN, schreib die offene Frage in PULS §
   Vision-Anker 6, ende die Sitzung. Brief 04 setzt die M04-
   Erweiterung (doppelte Spore `embeddingCapabilities` +
   `embeddingNeeds`) in § 1 Modul 02 + § 2 Spore-JSON voraus,
   weil die Persona-spezifischen Vektor-Slots in Brief 04 als
   Spec-Eckdatum referenziert sind.

2. Prüfe INTERFACES § 0 / § 1 Modul 02 / § 1 Modul 04 / § 2 / § 7
   / § 8 / § 9 auf den Stand nach Brief 03: drei neue §0-Konstanten
   (SCHICHT_MIN_MATCH / STUFE_B_DEFAULT_MODEL / STUFE_B_MAX_TOKENS),
   §1 Modul 02 Bietet-Block mit Schema-Erweiterungs-Hinweis
   (embeddingCapabilities + embeddingNeeds), §1 Modul 04 mit
   vier neuen Sub-Blöcken (Drei-Schichten-Modell, Brücken-Feld-
   Spec, Schwellen-Vertrag, Stufe-B-Vertrag), §2 Spore-JSON
   Optionale Felder erweitert, §7 LLM-Stufe-B-Ehrlichkeits-
   Klausel, §8 Anti-Missbrauch-Klausel, §9 Änderungsprotokoll
   mit Brief-03-Eintrag.

3. **Spiegele die M04-Erweiterung-Felder in deiner Multi-Identitäts-
   Spec.** Pro Identitäts-Slot in `sbkim_keys[key]` muss ein
   entsprechender Eintrag in `sbkim_spore[key]` (oder ein
   identitäts-spezifischer Spore-Generierungs-Pfad in Modul 02)
   den eigenen `embeddingCapabilities` + `embeddingNeeds`-Slot
   tragen — sonst hat eine Persona keine eigenen Vektor-Slots,
   was die M04-Erweiterung pro Persona aushöhlt. Die Sibling-
   Listen pro Identität (`sbkim_siblings_<key>`) tragen ihre
   eigenen Match-Cosinus zu der spezifischen Persona, nicht zur
   globalen Sage-Identität.

4. Falls Korrekturen an Brief 01 (Endknoten-Liste / Karte 09 /
   CLAUDE.md / status.json), Brief 02 (Plattform-Matrix /
   Ehrlichkeits-Klausel / Vision-Bezüge) oder Brief 03 (drei
   §0-Konstanten / Modul 02 Schema-Erweiterung / Modul 04 vier
   Sub-Blöcke / §7-§8-Klauseln) nötig sind: erst Brief 01/02/03
   korrigieren in separaten Commits auf demselben Branch, dann
   eigenen Strang einbauen. Niemals Brief-01-/02-/03-Schäden
   ohne Vermerk hineinmischen.

5. **PR #89 (Karte 15 Membran als Stub)** und ggf. weitere
   parallele PRs prüfen. Falls beim Brief-04-Sitzungs-Start
   PR #89 noch offen ist oder zwischenzeitlich gemerged wurde,
   INTERFACES.md auf den `main`-Stand prüfen. Karte 15 Membran
   berührt Modul-15-Block (nach Modul 09) und sollte mit den
   Multi-Identitäts-Karten 02 / 05 / 06 / 07 nicht kollidieren —
   sofern Brief 04 die Identitäts-Map nicht versehentlich in den
   Modul-15-Block hineinschreibt.

Deine Aufgabe heute — STRANG 3, sechs Punkte a–f:

a) docs/INTERFACES.md § Identitäts-Map (neuer Sub-Block oder
   neue § 10 — Spec entscheidet):

   - `sbkim_keys["main"]` als Default-Slot bleibt verbindlich
     (Rückwärts-Kompatibilität zum Singleton-Vertrag aus
     Spec-Sitzung 02 2026-05-14)
   - `sbkim_keys["<frei wählbare key>"]` als weitere Slots,
     beliebig viele
   - `sbkim_meta["active-identity"]` als String-Marker, der den
     aktiven Slot benennt (Default `"main"`, falls fehlt)
   - Modul 05 / 06 / 07 lesen `active-identity` als Konvention,
     KEIN verpflichtender API-Hook (sie lesen den Marker beim
     Init und cachen den Wert für die Lebenszeit der Operation;
     ein Identitäts-Wechsel mid-Operation ist nicht spezifiziert)

b) docs/INTERFACES.md § 1 Modul 02 API-Erweiterung (in INTERFACES
   + Karte 02):

   - `getOrCreateIdentity(key?: string)` → Promise<Identity>
     (Default-Parameter `key="main"`, behält Rückwärts-Kompat
     zum heutigen Aufruf-Pfad)
   - `setActiveIdentity(key: string)` → Promise<void> (schreibt
     `sbkim_meta["active-identity"]`, validiert dass `key` in
     `sbkim_keys` existiert — sonst `UnknownIdentityError`)
   - `getActiveIdentityKey()` → Promise<string> (liest
     `sbkim_meta["active-identity"]`, Default `"main"` falls
     fehlend)
   - `listIdentities()` → Promise<string[]> (alle Schlüssel in
     `sbkim_keys`)
   - `removeIdentity(key: string, options?: { force?: boolean })`
     → Promise<bool>
     - Bestätigungs-Konvention auf Anwendungs-Ebene: UI muss
       bestätigen, bevor der Aufruf erfolgt — Spec nennt die
       Pflicht, ohne den Bestätigungs-Modus zu spezifizieren
     - `force:false` (Default): wirft `RemoveActiveIdentityError`,
       wenn `key === active-identity` (keine versehentliche
       Selbstauslöschung der aktiven Persona)
     - `force:true`: löscht auch die aktive Identität; setzt
       `active-identity` auf `"main"` (Default), falls vorhanden;
       sonst auf den nächsten Slot in `listIdentities()` (Spec-
       Entscheidung in der Sitzung)
     - Löscht `sbkim_keys[key]`, `sbkim_spore[key]`,
       `sbkim_siblings_<key>` (siehe c), `sbkim_hetero_inbox_<key>`
       (Spec-offen: ob Heterokaryose-Inbox pro Identität oder
       global — entscheide in der Sitzung)

c) docs/INTERFACES.md § 1 Modul 05 Storage-Block + Karte 05:

   - `sbkim_siblings_<key>` als Pattern (z.B. `sbkim_siblings_main`,
     `sbkim_siblings_beruflich`). Modul 05's API bleibt unverändert
     — `handshake` / `listSiblings` / `forgetSibling` lesen
     transparent den `<key>`-spezifischen Slot, der sich aus
     `getActiveIdentityKey()` ergibt
   - Verbindlich: Modul 05 ruft `SbkimSpore.getActiveIdentityKey()`
     im `init()`-Pfad und cached den Wert für die Lebenszeit der
     Operation; eine Folge-Spec-Sitzung darf einen aktiven Hook
     für Mid-Operation-Wechsel spezifizieren
   - Karte 01 Storage-Block muss die `sbkim_siblings_<key>`-
     Pattern-Stores ankündigen — additive DB-Migration v=3 → v=4
     (vermutlich), wenn Modul 02 `removeIdentity` einen neuen
     Slot anlegt. Spec-Entscheidung: dynamische Store-Erzeugung
     (Modul 01 erweitert) oder feste Slot-Tabelle (Modul 01
     bleibt). Beide Optionen in der Spec mit Trade-off-Hinweisen

d) docs/INTERFACES.md § 2 Spore-JSON + Karte 02 — Pages-spore.json-
   Strategien:

   - **Strategie A (Empfehlung — `PROTOCOL_VERSION` bleibt 0.1):**
     nur die aktive Identität in `spore.json`. Identitäts-Wechsel
     = `generateOwnSpore` neu aufrufen + `spore.json` neu pushen.
     Vorteile: rückwärts-kompatibel zu allen heutigen Empfängern,
     keine Spore-Schema-Änderung, einfache Deploy-Pipeline.
     Nachteile: ein Sage-Endknoten mit drei Personae hat in
     `spore.json` zu jedem Zeitpunkt nur eine — Peer kann andere
     Personae nicht „sehen" über den Pages-Anchor.

   - **Strategie B (`PROTOCOL_VERSION`-Bump auf 0.2):** Liste-
     Schema mit mehreren Identitäten pro `spore.json`. Spore-JSON
     bekommt ein neues Pflicht-Feld `identities[]` (Array von
     Sub-Spore-Objekten, jede mit eigener `id` / `publicKey` /
     `embeddingCapabilities` / `embeddingNeeds` / etc.). Peer
     filtert über `toNodeId` und antwortet der spezifischen
     Persona. Vorteile: Multi-Persona-First-Class-Citizen.
     Nachteile: alte Empfänger brechen (`PROTOCOL_VERSION`-Bump
     erzwingt) ⇒ Hauptversion-Mismatch in Modul 05's Verify-Pfad,
     alle Endknoten müssen synchron upgraden.

   - Empfehlung in der Spec: **Strategie A als Default**; Strategie
     B als Folge-Spec-Sitzung-Option, wenn Multi-Persona-Use-Case
     reift. **Falls die Spec sich für Strategie B entscheidet:**
     `PROTOCOL_VERSION` auf 0.2 bumpen, EXPLIZIT im Änderungs-
     protokoll + im PULS-Sitzungs-Eintrag + im Übergabeprotokoll
     dokumentieren — keine heimliche Edit.

e) Verbindung zu Anker 9 (M04-Erweiterung, Brief 03) —
   doppelte Spore PRO PERSONA:

   - Pro Identitäts-Slot in `sbkim_keys[key]` existiert ein
     entsprechender Eintrag in `sbkim_spore[key]` mit eigenen
     `embeddingCapabilities` + `embeddingNeeds`. `generateOwnSpore`
     nimmt optional einen `key`-Parameter (Default
     `getActiveIdentityKey()`) und schreibt in den passenden
     Slot. Karte 02 § M04-Erweiterung-Sub-Block aus Brief 03
     wartet auf diese Persona-spezifische Auflösung — Brief 04
     liefert sie.

   - Match-Pipeline pro Persona: Modul 04 `matchDimensions`
     konsumiert pro Aufruf die Vektor-Slots **einer Persona**
     (Aufrufer wählt). Multi-Persona-Aufrufe sind keine
     atomare Operation in Modul 04 — wer mehrere Personae
     gleichzeitig matchen will, ruft `matchDimensions` mehrfach.

f) Trade-off-Klausel in INTERFACES (neuer Sub-Block oder Hinweis
   in § Identitäts-Map):

   - IndexedDB-Verlust löscht ALLE Identitäten gleichzeitig.
     Anker 5 (Identitäts-Container) bleibt parallel sinnvoll
     als Backup-Strategie. Spec verweist auf Anker 5, spezifiziert
     Container nicht (Anker 5 hat eigene Spec-Sitzung).
   - Multi-Identitäts-Backup-Strategie: Modul 02 `exportBackup`
     muss alle Identitäten exportieren können (entweder als
     separate Container pro Identität ODER als ein Container mit
     allen Identitäten — Spec entscheidet; die Bau-Folge-Sitzung
     02.Y zieht den Code nach). Empfehlung in der Spec: **ein
     Container mit allen Identitäten** als „kompletter Rucksack"
     (Klaus' Vision aus PULS § Anker 6).

Was du NICHT tust:

- Kein Modul-Code in src/. Spec geht der Implementierung voraus.
- Keine Sage-Page-Änderung (index.html). Sage-Page-Refactor ist
  Bau-Sitzung nach Kaskaden-Abschluss (BRIEF_99-Liste).
- Keine M04-Erweiterung-Änderung (Brief 03 hat sie gesetzt) —
  außer du brauchst eine kleine Korrektur an Modul 02 Bietet-
  Block-Schema-Erweiterungs-Hinweis für die Persona-spezifische
  Auflösung. Dann separat-Commit + Vermerk.
- Keine Plattform-Matrix-Änderung (Brief 02).
- Keine Königin-Relay-Spec (Anker 4 eigene Spec, bedingt Anker 13).
- Keine Identitäts-Container-Spec (Anker 5 eigene Spec).
  Multi-Identitäts-Backup-Strategie verweist nur.
- Keine Extension- oder Mini-Browser-Spec (Anker 7 / 8).
- KEINE CLAUDE.md-Änderung (Brief 01 hat sie auf „Hub und Knoten
  zugleich" umgeschrieben). KEINE Karte-09-Änderung (Brief 01
  hat § Schritt 1 erweitert). KEINE `status.json`-Änderung
  (Brief 01 hat Sage als endknoten[]-Eintrag aufgenommen).
- KEINE Sage-Page-Karten-Erweiterung um einen „Identitäts-
  Wechsler" — gehört zu Bau-Sitzungen.
- Kein update_puls_pie.py-Aufruf (kein status.json-Score-Wechsel).
  Wenn du Strategie B wählst (Spore-Schema-Eingriff,
  PROTOCOL_VERSION-Bump auf 0.2), HALT AN und stelle die Pflicht-
  Entscheidung in PULS § Vision-Anker 6 — Klaus muss den Bump
  bewusst absegnen, oder du entscheidest mit Begründung und
  vermerkst es im PULS-Sitzungs-Eintrag.

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am
   Sitzungsende:
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag „2026-05-XX ·
     Spec — Multi-Identität (Brief 04 der V1-Sammelspec-Kaskade)"
     mit den sechs Punkten a–f, Verweis auf den Brief-03-PR als
     Vorgänger und auf BRIEF_99-Abschluss als Folge-Etappe.
   - Vorletzten Sitzungs-Eintrag ins Archiv-Index auslagern
     (Konvention). Der vorletzte wird nach diesem Brief der
     Brief-03-Sitzungs-Eintrag sein. PULS-Zeilen-Status prüfen —
     wenn nahe 3000, mehrere Einträge auslagern; nicht kürzen.
   - Vision-Anker 6 § Status nachziehen — vorher „Reif für Spec-
     Diskussion", jetzt „Strang 3 der V1-Sammelspec realisiert
     (2026-05-XX, Brief 04 der V1-Sammelspec-Kaskade) + Verweis
     auf BRIEF_99-Abschluss". Vision-Anker 1 / 4 / 5 / 7 / 8 / 9
     unangetastet lassen.
   - Übergabeprotokoll in
     `docs/sessions/archiv/2026-05-XX_spec-multi-identitaet.md`
     (Format BRIEFING_TEMPLATE.md). Die verbleibende Strang-
     Aufgabe (BRIEF_99-Abschluss) im § „Nächster sinnvoller
     Schritt" als „nicht in dieser Sitzung" markieren.
   - Commit + Push auf claude/spec-v1-multi-identitaet.
   - Draft-PR „Spec: Multi-Identität — Strang 4 der V1-Sammelspec-
     Kaskade".

2. Schreibe als letzte Datei-Aktion `docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md`
   für die Abschluss-Sitzung. Inhalt: Zusammenfassung aller vier
   Stränge (V1 Sage-Hybrid, Plattform-Matrix, M04-Erweiterung,
   Multi-Identität); Auflistung der Bau-Sitzungs-Briefe, die
   nach dem Sammelspec-Abschluss anstehen (typisch: Sage-Page-
   Refactor-Bau-Sitzung mit voller init()-Kette + Andock-Wizard +
   Schichten-Lampen + Identitäts-Wechsler; Bau Stufe A erweitert;
   Bau Stufe B; Bau Multi-Identitäts-Migration der Endknoten);
   Konsistenz-Prüfungs-Pflicht (alle vier Strang-PRs gemerged);
   PROTOCOL_VERSION-Status-Snapshot. **Kaskaden-Konvention 6**
   (Auslöser-Befehl im Chat) propagieren — BRIEF_99 ist kein
   normaler Strang, sondern die Schluss-Sitzung; die Auslöser-
   Konvention gilt trotzdem.

3. **Kaskaden-Konvention 6 (Auslöser-Befehl im Chat, nicht Brief-
   Volltext):** Gib am Sitzungs-Ende einen kurzen, kopierbaren
   Auslöser-Befehl (3–5 Zeilen) als Codeblock direkt in der Chat-
   Antwort aus. Der Auslöser nennt die Brief-Datei, den Branch
   und den Kaskaden-Kontext; die Folge-Sitzung liest den Brief
   selbst aus der Datei. Wortlaut (anpassen an deinen Brief-
   Namen + Branch):

   ```
   Lies docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md vollständig
   und führe den Brief als Abschluss-Sitzung der V1-Sammelspec-
   Kaskade aus. Konventionen siehe PULS § Archiv-Index „Meta-
   Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" (sechs
   heilige Tafeln). Branch laut Brief (claude/spec-v1-abschluss
   oder ähnlich, vom main aus anlegen).
   ```

   Brief-Volltext im Chat ausdrücklich NICHT gewünscht — Datei
   im Repo ist die einzige Wahrheits-Quelle des Briefes, der
   Auslöser-Befehl ist nur der Sprung-Anker.

4. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): erster Schritt verweist
   auf den Auslöser-Befehl aus Punkt 3 als Start-Trigger der
   Abschluss-Sitzung. Zweiter Schritt als alternative Auslöser-
   Option (z.B. PR mergen + die Bau-Sitzung Sage-Page-Refactor
   schon vorab planen — nur falls Klaus die Kaskade pausieren
   will). Reihenfolge-Hinweis: BRIEF_99-Abschluss setzt diesen
   PR #<nummer> als gemerged voraus.

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Vision-Anker 6
  ans Ende oder in den hier entstehenden Sitzungs-Eintrag „Was
  offen blieb". Klaus klärt in der nächsten Sitzung.

Zeitschätzung: 3–5 Stunden für Strang 3 allein (komplexer als
Brief 02 oder 03, weil vier Karten 02 / 05 / 06 / 07 + § 1 + § 2
+ neue Identitäts-Map-Sektion plus die Strategie-A-/-B-Entscheidung
in § 2; aber weiterhin reine Doku-Pflege ohne Sage-Page- oder
Modul-Code-Eingriff).
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Kaskaden-Konvention 1 (ein Strang = ein PR) ist heilig.** Wenn
  die Brief-04-Sitzung mid-Sitzung versucht, BRIEF_99-Abschluss
  oder Sage-Page-Refactor in derselben PR mitzunehmen, abbrechen
  und in PULS dokumentieren.

- **Kaskaden-Konvention 2 (Brief als Datei, nicht im Chat).** Die
  Brief-04-Sitzung MUSS `BRIEF_99_SAMMELSPEC_ABSCHLUSS.md` als
  letzte Datei-Aktion anlegen — der Auftrag der Abschluss-Sitzung
  darf nicht nur im Chat-Tab leben.

- **BRIEF_SPEC_V1_SAMMELSPEC bleibt als Quell-Spec der Kaskade.**
  Brief 04 schneidet § STRANG 3 daraus heraus — wenn die Brief-04-
  Sitzung dort ein Detail abschreibt, ist das fein; was die Brief-
  04-Sitzung NICHT macht, ist die Sammelspec als alleinstehende
  Sitzung zu ziehen.

- **PROTOCOL_VERSION-Disziplin als bewusste Entscheidung.** Die
  Erwartung ist `"0.1"` (Strategie A, additiv); aber Brief 04
  kann begründet auf `"0.2"` bumpen (Strategie B, Spore-Schema-
  Eingriff). Die Bump-Entscheidung gehört EXPLIZIT in den PULS-
  Sitzungs-Eintrag + ins Änderungsprotokoll + ins Übergabe-
  protokoll, nicht als heimliche Edits.

- **Vorgänger-Sage-/Plattform-/M04-Stand spiegeln, nicht neu
  erfinden.** Sage steht seit Brief 01 als dritter Endknoten in
  INTERFACES § 6 / § 6.1; Plattform-Matrix seit Brief 02 in § 6.2
  / § 6.3 / § 6.4; M04-Erweiterung seit Brief 03 in § 0 (drei
  Konstanten) / § 1 Modul 02 (Schema-Erweiterung) / § 1 Modul 04
  (vier Sub-Blöcke) / § 2 (Optionale Felder) / § 7 / § 8. Brief 04
  darf darauf aufbauen, aber diese Sektionen NICHT ändern. Wenn
  ein Multi-Identitäts-Detail ergibt, dass Brief 01-03 etwas
  falsch gesetzt hat, dann KORRIGIERT der Brief das separat
  (eigener Commit) und vermerkt das im Brief-04-PULS-Eintrag —
  niemals heimlich mitziehen.

- **Sage-Page-Refactor bleibt NACH der Kaskade.** Erst wenn Brief
  99 (Sammelspec-Abschluss) steht und die Bau-Brief-Liste die
  Sage-Page-Refactor-Bau-Sitzung benennt, beginnt dort der
  eigentliche `index.html`-Eingriff. Bis dahin lebt Multi-
  Identität rein in INTERFACES + Karten 02 / 05 / 06 / 07.

- **Paralleler offener PR #89 (Karte 15 Membran).** Wenn beim
  Brief-04-Sitzungs-Start PR #89 noch offen ist, INTERFACES.md
  vor dem Editieren auf den `main`-Stand prüfen. Karte 15
  Membran berührt den Modul-15-Block (nach Modul 09) und sollte
  mit den Multi-Identitäts-Karten 02 / 05 / 06 / 07 nicht
  kollidieren — sofern Brief 04 die Identitäts-Map nicht
  versehentlich in den Modul-15-Block hineinschreibt.
