# Brief 03 — Spec-Sitzung M04-Erweiterung · dritte Etappe der V1-Sammelspec-Kaskade

**Strang 3 von 4** der V1-Sammelspec, kaskadiert in PR der
Meta-Pflege 2026-05-18 (siehe `docs/PULS.md` § Archiv-Index
„Meta-Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" plus
Übergabeprotokoll
`docs/sessions/archiv/2026-05-18_meta-pflege-v1-sammelspec-kaskade.md`).
Quell-Spec ist `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
§ STRANG 2; dieser Brief schneidet den Strang heraus und liefert
die Etappe als eigenständige Sitzung. Brief 01 (V1 Sage-Hybrid)
und Brief 02 (Plattform-Matrix) wurden in den vorausgegangenen
Sitzungen erledigt und sind Voraussetzung. Brief 04 (Anker 6
Multi-Identität) folgt als letzte inhaltliche Etappe vor
BRIEF_99_SAMMELSPEC_ABSCHLUSS.

Dieser Brief geht in den **ersten Prompt** der nächsten Spec-Sitzung
als Codeblock.

---

```
Du bist eine Spec-Sitzung in Sage-Protokol — Brief 03 der V1-
Sammelspec-Kaskade.

Branch: claude/spec-v1-m04-erweiterung   (vom main aus anlegen,
        NACHDEM Brief-02-PR gemerged ist — siehe Konsistenz-Prüfung)

Sitzungs-Rolle: Spec (kein Code, kein Modul-Eingriff). Du
realisierst STRANG 2 der V1-Sammelspec — M04-Erweiterung mit
drei Schichten (fachlich / prozess / skalierung) + Brücken-Feld
+ doppelte Spore (capabilities + needs auf beiden Seiten) +
Stufe-A/Stufe-B-Match-Pipeline. Die anderen drei Stränge (V1
Sage-Hybrid, Plattform-Matrix, Multi-Identität) sind in Brief
01, Brief 02 und Brief 04 verortet. INTERFACES.md ist die
heilige Tafel — ziehst du sie ZUERST, dann die Modul-Karten 02
+ 04 + 06 (alle drei editierst du). CLAUDE.md / Karte 09 /
status.json bleiben unangetastet (Brief 01-02 haben sie auf
den Endknoten-/Plattform-Stand gebracht — Brief 03 lebt in
INTERFACES + Karten 02/04/06).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (Sitzungs-Disziplin, Pflicht am Sitzungs-Ende,
   Konventionen — § „Was dieses Repo ist" steht seit Brief 01 auf
   „Hub und Knoten zugleich")
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Spec — Plattform-Matrix
     (Brief 02 der V1-Sammelspec-Kaskade)" als unmittelbarer Vorgänger
   - § Archiv-Index: „Spec · V1 Sage-Hybrid — Strang 1" + „Meta-
     Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" (sechs
     heilige Tafeln) plus die zwei Übergabeprotokolle
   - § Vision-Anker
     - „2026-05-18 · M04-Erweiterung — drei Schichten + Brücke +
       doppelte Spore" (Anker 9 — HAUPT-Anker dieser Sitzung)
     - „2026-05-17 · Sage als Hybrid-Knoten (Variante I)" (Anker 1,
       § Status nach Brief 01 auf „Strang 1 realisiert")
     - „2026-05-18 · Multi-Identität in der IndexedDB" (Anker 6 —
       Bezugs-Anker für „doppelte Spore PRO PERSONA")
     - „2026-05-17 · Königin-Relay (Modul 13?)" (Anker 4 — Bezug
       für `candidateScope:"mailbox"`)
     - „2026-05-18 · SBKIM-Browser-Extension" (Anker 7 — Bezug
       für Stufe-B-Anzeige im Popup)
     - „2026-05-18 · Eigener Mini-Browser — Tauri-App" (Anker 8 —
       natürlicher Träger der LLM-Stufe-B-Calls)
     - „2026-05-17 · Identitäts-Container" (Anker 5 — Stufe-B-
       API-Key-Speicher)
3. docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md § STRANG 2 (Detail-
   Vorlage für die vier Punkte a–d dieses Strangs plus Schichten-
   Definitionen, Brücken-Feld-Schema, Schwellen, Plattform-
   Ehrlichkeits-Klausel, Anti-Missbrauch-Klausel)
4. docs/sessions/BRIEF_SPEC_M04_ERWEITERUNG.md (engerer Bruder-
   Brief, nur als Stil-/Detail-Vorlage — die Substanz übernimmst
   du aus § STRANG 2 plus dem Anker 9 in PULS; der Bruder-Brief
   wird NICHT mehr als eigenständige Sitzung gezogen)
5. docs/sessions/BRIEF_01_v1_sage_hybrid.md + docs/sessions/BRIEF_02_plattform_matrix.md
   (Vorgänger-Briefe; lies die Pflicht-am-Ende-Sektionen und die
   Konsistenz-Prüfungs-Blöcke — Brief 03 erbt deren Bauplan und
   die Konvention-5-Disziplin)
6. docs/sessions/BRIEF_03_m04_erweiterung.md (dieser Brief)
7. docs/INTERFACES.md (vollständig — heilige Tafel, du editierst
   sie; § 6 Endknoten-Liste + § 6.1 / 6.2 / 6.3 / 6.4 stehen
   auf Brief-01-/02-Stand; deine Eingriffe liegen primär in § 0
   Globale Konstanten + § 1 Modul 02 + § 1 Modul 04 + § 1 Modul
   06 + § 2 Spore-JSON + § 7 Änderungsprotokoll plus neuen
   §-Blöcken für Schichten / Brücken-Feld / Plattform-
   Ehrlichkeit-LLM / Anti-Missbrauch — entscheide in der Spec
   die Platzierung, bevorzugt als § 8 / § 9 oder eingegliedert
   in die Modul-04-Sektion)
8. docs/components/02_spore.md (vollständig — du editierst sie)
9. docs/components/04_match.md (vollständig — du editierst sie)
10. docs/components/06_heterokaryose.md (Brücken-Vorschlag-
    Eintrags-Typ ergänzen)
11. docs/papers/sbkim-paper-en.html § 3.3 „Bidirectional Matching
    with Three Dimensions" — Quell-Spec für die drei Achsen
    fachlich / prozess / skalierung (entweder direkt im Browser
    via `localhost:8000` oder als HTML-Datei lesen)

Was du NICHT liest: andere Komponenten-Karten als 02/04/06,
Modul-Code in src/, Sage-Page index.html, andere Vision-Anker
in PULS als die oben genannten.

Heilige Tafeln (Kaskaden- und Strang-spezifisch):

- **INTERFACES verbindlich** — wenn du eine Schnittstelle
  änderst, ZUERST dort, DANN Karten 02 + 04 + 06. § 0 Globale
  Konstanten bekommt mindestens eine neue Konstante
  (`SCHICHT_MIN_MATCH=0.60` aus § STRANG 2 § a, gegebenenfalls
  weitere für Stufe-B-Parameter wie Token-Budget).
- **PROTOCOL_VERSION-Disziplin:** Strang 2 ist additiv, SOLANGE
  `embeddingNeeds` und die neuen Match-Funktionen optional
  bleiben (alte Spore ohne `embeddingNeeds` ist weiterhin gültig,
  signalisiert „nur Anbieter-Modus"). Erwartung: `PROTOCOL_VERSION`
  bleibt `"0.1"`. Sollte M04 ein altes Feld zur Pflicht erheben
  (z.B. `embedding` → `embeddingCapabilities` als Pflicht-Rename,
  oder `embeddingNeeds` als Pflichtfeld in der HandshakeRequest),
  bumpe auf `"0.2"` und nenne das EXPLIZIT im Änderungsprotokoll
  + im PULS-Sitzungs-Eintrag. Die Entscheidung dazu trifft die
  Spec-Sitzung in der konkreten Edit-Reihenfolge.
- **Plattform-Ehrlichkeits-Klausel LLM (eigener neuer Block):**
  Stufe B ist opt-in pro Knoten. Wer keinen User-eigenen API-Key
  hinterlegt, bleibt vollwertiger Netz-Teilnehmer (Stufe A allein
  ist rückgrat-tragend). Kein Knoten wird gezwungen, einen
  Drittanbieter zu nutzen. Plattform-Matrix § 6.2 (Brief 02)
  hat die Spalte „Stufe B" bereits als Schnittstellen-Eckdatum
  pro Plattform-Profil; deine Spec verbindet das mit der M04-
  Match-API.
- **Anti-Missbrauch-Klausel (eigener neuer Block):** Brücken-
  Vorschlag bleibt LOKAL — keine Spore-Leakage auf Drittknoten.
  `candidateScope:"netz"` ist formal nicht aktivierbar bis
  Anker 10-12 (Reputation / Rate-Limit / Blocklist) gebaut sind.
  Verbindlich als Spec-Klausel formulieren.
- **Privatheit (Anker 9 § Sorge ums Freigeben):** bleibt offen;
  die M04-Spec rührt die Lizenz-Frage nicht.

Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5):

1. Prüfe, dass der Brief-02-PR (Spec Plattform-Matrix — Strang 2
   der V1-Sammelspec-Kaskade aus Cascading-Sicht; Strang 4 aus
   Sammelspec-Sicht) gemerged ist. Wenn nicht: HALT AN, schreib
   die offene Frage in PULS § Vision-Anker 9, ende die Sitzung.
   Brief 03 setzt die Plattform-Matrix in § 6.2 / § 6.3 / § 6.4
   voraus, weil die Stufe-B-API in der Matrix-Spalte
   „Stufe B" als Schnittstellen-Eckdatum referenziert ist.

2. Prüfe INTERFACES § 6 / 6.1 / 6.2 / 6.3 / 6.4 auf den Stand
   nach Brief 02: drei Endknoten in § 6 + Sage-Page-Architektur
   in § 6.1 + Plattform-Matrix in § 6.2 (fünf Profile × sechs
   Spalten + Sage-Anmerkung) + Plattform-Ehrlichkeits-Klausel in
   § 6.3 + Vision-Bezüge in § 6.4 (sieben Anker). § 7
   Änderungsprotokoll muss den Brief-02-Eintrag haben.

3. **Spiegele die Brief-02-Plattform-Matrix-Stufe-B-Spalte in
   deiner M04-Spec.** Die Spalte „Stufe B" listet pro Plattform-
   Profil, wo der API-Key liegen kann (eigener Key, App-Dir-Key,
   Popup-Key, geteilter PWA-Container-Key); deine Spec der
   Stufe-B-API in `explainMatchLLM` muss die vier Key-Lokalisations-
   Varianten konsumieren können, ohne sie zu erzwingen
   (Plattform-agnostische Key-Übergabe).

4. Falls Korrekturen an Brief 01 (Endknoten-Liste / Karte 09 /
   CLAUDE.md / status.json) oder Brief 02 (Plattform-Matrix /
   Ehrlichkeits-Klausel / Vision-Bezüge) nötig sind (z.B. weil
   ein M04-Schichten-Detail eine bisher übersehene Plattform-
   Eigenschaft verlangt): erst Brief 01 bzw. Brief 02 korrigieren
   in separaten Commits auf demselben Branch, dann eigenen
   Strang einbauen. Niemals Brief-01-/02-Schäden ohne Vermerk
   hineinmischen.

5. **PR #89 (Karte 15 Membran als Stub)** und ggf. weitere
   parallele PRs prüfen. Falls beim Brief-03-Sitzungs-Start
   PR #89 noch offen ist oder zwischenzeitlich gemerged wurde,
   INTERFACES.md auf den `main`-Stand prüfen. Karte 15 Membran
   berührt Modul-15-Block (nach Modul 09) und sollte mit den
   M04-Karten 02 / 04 / 06 nicht kollidieren — sofern Brief 03
   die Schichten nicht versehentlich in den Modul-15-Block
   hineinschreibt.

Deine Aufgabe heute — STRANG 2, vier Punkte a–d:

a) docs/INTERFACES.md erweitern (additiv, mit klarer Trennung):

   - **§ 0 Globale Konstanten** um mindestens `SCHICHT_MIN_MATCH=0.60`
     erweitern (eine Schicht darf fehlen → häufiger Brücken-Anlass;
     2+ Dimensionen unter `SCHICHT_MIN_MATCH` = Apoptose). Stufe-B-
     Parameter (Token-Budget, Default-Modell-ID) entscheidest du,
     ob § 0 oder modul-lokal in Karte 04.

   - **§ 1 Modul 02 (Spore) Bietet-Block** um Schema-Erweiterung:
     - `embedding` wird als `embeddingCapabilities` akzeptiert
       (additiv — alte Sporen mit `embedding` bleiben gültig,
       neue mit `embeddingCapabilities` daneben oder als Alias)
     - `embeddingNeeds` neu, additiv, optional (float32, gleiche
       Dimension wie `embeddingCapabilities`, heute 384)
     - Migrations-Pfad: `embeddingNeeds=null` bleibt gültig,
       signalisiert „nur Anbieter-Modus" — Karte 02-Begründung

   - **§ 1 Modul 04 (Match) Bietet-Block** um drei neue API-Funktionen:
     - `match(query, passage) -> number` bleibt erhalten (alte
       Aufrufer)
     - `matchDimensions(qCap, qNeeds, pCap, pNeeds) -> { fachlich,
       prozess, skalierung, overall }` neu, additiv
     - `explainMatchLLM(matchResult, apiKey) -> Promise<{ schichten,
       bruecke, erklaerung }>` neu, Stufe B, optional, fehlertolerant
     - `isAboveProviderThreshold(score) -> bool` bleibt erhalten

   - **Schichten-Definition** (drei Achsen orthogonal, eigener
     Sub-Block in Modul 04 oder als neue § 8):
     - `fachlich` = Domain-Match (was kannst du / was suchst du
       inhaltlich)
     - `prozess` = Arbeitsweise (Rhythmus, Methodik, Verbindlichkeit)
     - `skalierung` = Größenebene (einzelner Knoten / Cluster / Netz)

   - **Brücken-Feld-Spec** (eigener Sub-Block):
     - `{ needed: string, lookingFor: string|null,
         candidateScope: "lokal"|"mailbox"|"netz" }`
     - `"lokal"` = Anzeige nur im Knoten, kein Netz-Schritt
     - `"mailbox"` = Anker an Modul 13 Königin-Relay (falls vorhanden,
       Verweis auf Vision-Anker 4 ohne Spec der Königin selbst)
     - `"netz"` = NOCH NICHT DEFINIERT (wartet auf Anti-Spam-Schicht
       Anker 10-12); formal nicht aktivierbar bis Reputation /
       Rate-Limit / Blocklist gebaut sind

   - **Schwellen** (Sub-Block in Modul 04):
     - `PROVIDER_MIN_MATCH=0.80` für `overall` (bleibt)
     - `SCHICHT_MIN_MATCH=0.60` pro Dimension (neu)
     - 2+ Dimensionen unter `SCHICHT_MIN_MATCH` = Apoptose
     - Stufe-B-Erklärung darf Dimensions-Schwelle übersteuern,
       wenn sie den Brücken-Vorschlag begründet (semantisch reicher
       als Zahl)

   - **Plattform-Ehrlichkeits-Klausel LLM** als eigenes neues §
     (z.B. § 8 oder als Sub-Block nach § 6.3, namentlich
     unterscheidbar — die § 6.3-Klausel ist Plattform-allgemein,
     diese hier ist Stufe-B-spezifisch):
     - Stufe B opt-in pro Knoten
     - Stufe A rückgrat-tragend lokal
     - Kein Knoten gezwungen, Drittanbieter zu nutzen
     - Knoten ohne Stufe B = vollwertige Netz-Teilnehmer

   - **Anti-Missbrauch-Klausel** als eigenes § (z.B. § 9):
     - Brücken-Vorschlag bleibt LOKAL (kein Spore-Leak)
     - `candidateScope="netz"` formal nicht aktivierbar bis
       Anker 10-12

   - **§ 2 Spore-JSON** Pflichtfelder/Optionale Felder um
     `embeddingCapabilities` / `embeddingNeeds` erweitern (additiv,
     alte `embedding`-Aufrufer bleiben gültig). Signaturpflicht-Frage
     entscheiden: `embeddingNeeds` ist signaturpflichtig, wenn
     vorhanden (analog zu `domainKeywords` / `stammCategories`).

b) docs/components/02_spore.md erweitern:
   - Schema-Erweiterung dokumentieren (`embeddingCapabilities`-Alias
     für `embedding`, neues optionales `embeddingNeeds`-Feld)
   - Migrations-Pfad (`embeddingNeeds=null` bleibt gültig, „nur
     Anbieter-Modus" als Spec-Begriff)
   - Verweis auf Anker 9 (M04-Erweiterung) + Anker 6 (Multi-
     Identität → doppelte Spore PRO PERSONA)
   - `generateOwnSpore`-Allow-List in Karte 02 § Bauzustand-Hinweis
     für die spätere Bau-Sitzung (keine Code-Änderung in dieser
     Spec-Sitzung)

c) docs/components/04_match.md erweitern:
   - `matchDimensions`-Spec (drei Achsen, orthogonal, Cosinus pro
     Achse, `overall` als gewichteter Mittelwert oder Min — du
     entscheidest in der Spec und begründest)
   - `explainMatchLLM`-Spec mit:
     - LLM-Pattern (claude-sonnet-4 oder Nachfolge-Modell,
       `max_tokens` ~1024, JSON-only-Output, strenge Validation;
       Pattern-Quelle: Layer-1-Demo der Plattform-`index.html`,
       sinngemäß)
     - Antwort-JSON-Schema (für die Validation in `explainMatchLLM`)
     - Fehlertoleranz: scheitert Stufe B, fällt auf Stufe-A-Resultat
       zurück; UI zeigt „Erklärung nicht verfügbar"
     - Rate-Limit-Awareness: Aufrufer (06/08) drosseln selbst, nicht
       das Match-Modul
     - User-Key-Handling: aus Container (Anker 5), niemals plain
       IndexedDB; Plattform-Matrix-Spalte „Stufe B" konsumieren
       (vier Key-Lokalisations-Varianten Plattform-agnostisch)
   - Beispiel-Output für eine Match-Sitzung mit zwei Personas
     (Verweis auf Brief 04 Multi-Identität)
   - Karte 04 § Stamm/Gast-Hinweis bleibt; Schichten sind eine
     orthogonale Schicht zur Stamm/Gast-Klassifikation

d) docs/components/06_heterokaryose.md ergänzen:
   - Outbox bekommt einen Eintrags-Typ „Brücken-Vorschlag" (nur
     Spec, kein Bau-Detail). Verweis auf das Brücken-Feld-Schema
     in INTERFACES § Modul 04.
   - Anti-Missbrauch-Klausel referenzieren — heterokaryose-outbox-
     Brücken-Einträge mit `candidateScope="netz"` werden NICHT
     versendet, solange Anker 10-12 nicht gebaut sind.

Was du NICHT tust:

- Kein Modul-Code in src/. Spec geht der Implementierung voraus.
- Keine Sage-Page-Änderung (index.html). Sage-Page-Refactor ist
  Bau-Sitzung nach Kaskaden-Abschluss (BRIEF_99-Liste).
- Keine Plattform-Matrix-Änderung (Brief 02 hat sie gesetzt).
- Keine Multi-Identität-Spec (`sbkim_keys`-Multi-Slots,
  `active-identity`-Marker) — das ist Brief 04.
- Keine Königin-Relay-Spec (Anker 4 hat eigene Spec-Sitzung,
  bedingt Anker 13). Brücken-Feld `candidateScope:"mailbox"`
  verweist nur.
- Keine Identitäts-Container-Spec (Anker 5). API-Key-Speicher-
  Hinweis verweist nur.
- Keine Extension- oder Mini-Browser-Spec (Anker 7 / 8). Stufe-B-
  Plattform-Matrix-Spalte (Brief 02) referenziert sie, du
  konsumierst die Eckdaten.
- KEINE CLAUDE.md-Änderung (Brief 01 hat sie auf „Hub und Knoten
  zugleich" umgeschrieben). KEINE Karte-09-Änderung (Brief 01
  hat § Schritt 1 erweitert). KEINE `status.json`-Änderung
  (Brief 01 hat Sage als endknoten[]-Eintrag aufgenommen).
- KEINE Sage-Page-Karten-Erweiterung um eine „Schichten-Lampen"-
  Visualisierung — gehört zu Bau-Sitzungen.
- Kein update_puls_pie.py-Aufruf (kein status.json-Score-Wechsel).
  Wenn du beim INTERFACES-Editieren feststellst, dass die M04-
  Erweiterung einen Pflicht-Pfad erzeugt (z.B. `embeddingNeeds`
  als Pflichtfeld), HALT AN und schreib die offene Frage in
  PULS § Vision-Anker 9 — Pflicht-Pfade bumpen
  `PROTOCOL_VERSION` und sollen bewusst entschieden werden.

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am
   Sitzungsende:
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag „2026-05-XX ·
     Spec — M04-Erweiterung (Brief 03 der V1-Sammelspec-Kaskade)"
     mit den vier Punkten a–d, Verweis auf den Brief-02-PR als
     Vorgänger und auf den hier entstehenden Brief 04.
   - Vorletzten Sitzungs-Eintrag ins Archiv-Index auslagern
     (Konvention). Der vorletzte wird nach diesem Brief der
     Brief-02-Sitzungs-Eintrag sein. PULS-Zeilen-Status prüfen —
     wenn nahe 3000, mehrere Einträge auslagern; nicht kürzen.
   - Vision-Anker 9 § Status nachziehen — vorher „Reif für Spec-
     Diskussion, integraler Teil von V1-Sammelspec", jetzt
     „Strang 2 der V1-Sammelspec realisiert (2026-05-XX, Brief
     03 der V1-Sammelspec-Kaskade) + Verweis auf Brief 04 und
     BRIEF_99-Liste". Vision-Anker 1 / 4 / 5 / 6 / 7 / 8
     unangetastet lassen.
   - Übergabeprotokoll in
     `docs/sessions/archiv/2026-05-XX_spec-m04-erweiterung.md`
     (Format BRIEFING_TEMPLATE.md). Die zwei verbleibenden Strang-
     Aufgaben (Multi-Identität, BRIEF_99-Abschluss) im § „Nächster
     sinnvoller Schritt" als „nicht in dieser Sitzung" markieren.
   - Commit + Push auf claude/spec-v1-m04-erweiterung.
   - Draft-PR „Spec: M04-Erweiterung — Strang 3 der V1-Sammelspec-
     Kaskade".

2. Schreibe als letzte Datei-Aktion `docs/sessions/BRIEF_04_multi_identitaet.md`
   für die nächste Folge-Sitzung. Inhalt: Strang 3 aus
   BRIEF_SPEC_V1_SAMMELSPEC herausgeschnitten + dieselbe Bauplan-
   Struktur wie Briefe 01 / 02 / 03. Pflichtleseliste
   aktualisieren (eigener PR + INTERFACES-Stand nach Brief 03 +
   Karten 02 / 05 / 06 / 07 nach Brief 03 + Briefe 01–03 als
   Vorgänger-Belege + relevante PULS-Anker-Querverweise: V6
   Multi-Identität als Haupt-Anker, plus V1 / V4 / V5 / V9 als
   Bezugs-Anker plus die Multi-Identitäts-Spezifika aus
   BRIEF_SPEC_V1_SAMMELSPEC § STRANG 3). Kaskaden-Konvention 5
   (Vorgänger-Konsistenz-Prüfung) explizit erwähnen: Brief-04-
   Sitzung muss prüfen, dass keine Korrekturen an Briefen 01–03
   nötig sind, bevor `sbkim_keys`-Multi-Slots und `active-
   identity`-Marker eingeführt werden.
   Brief 04 erbt die PROTOCOL_VERSION-Disziplin — bleibt 0.1,
   solange `sbkim_keys[key]` ein lokales Schema ist und nicht in
   die Spore-JSON wandert. Sollte Brief 04 eine `spore.json`-
   Liste-Schema-Variante (Strategie B aus § STRANG 3 § d) wählen,
   ist die Bump-Entscheidung explizit zu treffen.

3. **Kaskaden-Konvention 6 (Auslöser-Befehl im Chat, nicht Brief-
   Volltext):** Gib am Sitzungs-Ende einen kurzen, kopierbaren
   Auslöser-Befehl (3–5 Zeilen) als Codeblock direkt in der Chat-
   Antwort aus. Der Auslöser nennt die Brief-Datei, den Branch
   und den Kaskaden-Kontext; die Folge-Sitzung liest den Brief
   selbst aus der Datei. Wortlaut (anpassen an deinen Brief-
   Namen + Branch):

   ```
   Lies docs/sessions/BRIEF_04_multi_identitaet.md vollständig
   und führe den Brief als nächste Sitzung in der V1-Sammelspec-
   Kaskade aus. Konventionen siehe PULS § Archiv-Index „Meta-
   Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" (sechs
   heilige Tafeln). Branch laut Brief (claude/spec-v1-multi-
   identitaet oder ähnlich, vom main aus anlegen).
   ```

   Brief-Volltext im Chat ausdrücklich NICHT gewünscht — Datei
   im Repo ist die einzige Wahrheits-Quelle des Briefes, der
   Auslöser-Befehl ist nur der Sprung-Anker. Die Regel
   propagiert: dein BRIEF_04 muss in seinem „Pflicht am Ende"
   denselben Auslöser-Mechanismus für die BRIEF_99-Abschluss-
   Sitzung formulieren, und so weiter bis BRIEF_99_SAMMELSPEC_ABSCHLUSS.

4. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): erster Schritt verweist
   auf den Auslöser-Befehl aus Punkt 3 als Start-Trigger der
   nächsten Sitzung. Zweiter Schritt als alternative Auslöser-
   Option (z.B. PR mergen + die Bau-Sitzung Sage-Page-Refactor
   schon vorab planen — nur falls Klaus die Kaskade pausieren
   will). Reihenfolge-Hinweis: Brief 04 setzt diesen PR #<nummer>
   als gemerged voraus.

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Vision-Anker 9
  ans Ende oder in den hier entstehenden Sitzungs-Eintrag „Was
  offen blieb". Klaus klärt in der nächsten Sitzung. Eine andere
  Sitzung mit frischem Kontext löst es schneller, als wenn du
  dich festbeißt und Tokens verbrennst.

Zeitschätzung: 3–5 Stunden für Strang 2 allein (signifikanter
als Brief 02, weil drei Karten 02/04/06 + § 0 / § 1 / § 2 / § 7
in INTERFACES plus zwei neue Klausel-Blöcke; aber weiterhin reine
Doku-Pflege ohne Sage-Page- oder Modul-Code-Eingriff).
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Kaskaden-Konvention 1 (ein Strang = ein PR) ist heilig.** Wenn
  die Brief-03-Sitzung mid-Sitzung versucht, Multi-Identität oder
  Sage-Page-Refactor in derselben PR mitzunehmen, abbrechen und in
  PULS dokumentieren. Mehrere Stränge in einem PR brechen den
  Reviewer-Rhythmus.

- **Kaskaden-Konvention 2 (Brief als Datei, nicht im Chat).** Die
  Brief-03-Sitzung MUSS `BRIEF_04_multi_identitaet.md` als letzte
  Datei-Aktion anlegen — der Auftrag der nächsten Sitzung darf
  nicht nur im Chat-Tab leben.

- **BRIEF_SPEC_M04_ERWEITERUNG bleibt als reine Stil-/Detail-
  Vorlage.** Der engere Bruder-Brief ist mit Brief 03 in der
  Kaskade obsolet als alleinstehender Sitzungs-Brief — er liegt
  nur noch als Detail-Anschauung im Repo. Wenn die Brief-03-
  Sitzung dort ein Schichten-Detail oder einen Brücken-Feld-Wert
  abschreibt, ist das fein; was die Brief-03-Sitzung NICHT macht,
  ist den Bruder-Brief als eigene Quelle anstelle von Brief 03
  zu ziehen.

- **PROTOCOL_VERSION-Disziplin als bewusste Entscheidung.** Die
  Erwartung ist `"0.1"` (additiv); aber Brief 03 kann begründet
  auf `"0.2"` bumpen, wenn die Edit-Reihenfolge zeigt, dass ein
  bisheriges Feld zur Pflicht erhoben werden muss. Die Bump-
  Entscheidung gehört EXPLIZIT in den PULS-Sitzungs-Eintrag + ins
  Änderungsprotokoll + ins Übergabeprotokoll, nicht als heimliche
  Edits.

- **Vorgänger-Sage-/Plattform-Stand spiegeln, nicht neu erfinden.**
  Sage steht seit Brief 01 mit konkreten Eigenschaften in
  INTERFACES § 6 / § 6.1 (Domäne `Mycel-Bibliothek`, IndexedDB-
  Suffix `sbkim_sage`, App-SW Variante 3a, keine Hintergrund-
  Empfangs-Modus). Brief 02 hat die Plattform-Matrix in § 6.2 /
  § 6.3 / § 6.4 etabliert. Brief 03 darf darauf aufbauen, aber
  diese Sektionen NICHT ändern. Wenn ein M04-Schichten-Detail
  ergibt, dass Brief 01 oder Brief 02 eine Eigenschaft falsch
  gesetzt hat, dann KORRIGIERT der Brief das separat (eigener
  Commit) und vermerkt das im Brief-03-PULS-Eintrag — niemals
  heimlich mitziehen.

- **Sage-Page-Refactor bleibt NACH der Kaskade.** Erst wenn Brief
  99 (Sammelspec-Abschluss) steht und die Bau-Brief-Liste die
  Sage-Page-Refactor-Bau-Sitzung benennt, beginnt dort der
  eigentliche `index.html`-Eingriff. Bis dahin lebt die M04-
  Erweiterung rein in INTERFACES + Karten 02 / 04 / 06.

- **Paralleler offener PR #89 (Karte 15 Membran).** Wenn beim
  Brief-03-Sitzungs-Start PR #89 noch offen ist, INTERFACES.md
  vor dem Editieren auf den `main`-Stand prüfen. Karte 15
  Membran berührt den Modul-15-Block (nach Modul 09) und sollte
  mit Modul 04 / Modul 02 / Modul 06 nicht kollidieren — sofern
  Brief 03 die Schichten- oder Brücken-Feld-Spec nicht
  versehentlich in den Modul-15-Block hineinschreibt.
