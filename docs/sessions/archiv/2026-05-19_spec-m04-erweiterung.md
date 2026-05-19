# Übergabeprotokoll · 2026-05-19 · Spec — M04-Erweiterung (Brief 03 der V1-Sammelspec-Kaskade)

## Sitzungs-Rahmen

- **Rolle:** Spec-Sitzung (kein Code, kein Modul-Eingriff).
- **Branch:** `claude/spec-v1-m04-erweiterung-2pv3U` (Harness-
  Suffix; im Brief als `claude/spec-v1-m04-erweiterung` geführt).
- **Auslöser:** Auslöser-Befehl aus dem Chat-Tab (Kaskaden-
  Konvention 6, 2026-05-18) plus
  `docs/sessions/BRIEF_03_m04_erweiterung.md` als verbindlicher
  Brief-Volltext.
- **Quell-Spec:** `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
  § STRANG 2 (heraus-geschnitten als Brief 03 in der V1-Sammelspec-
  Kaskade — PULS § Archiv-Index „Meta-Pflege · V1-Sammelspec als
  Brief-Kaskade sequenziert", sechs heilige Tafeln).
- **Etappe in der Kaskade:** Brief 03 von 4. Vorgänger: Brief 01 V1
  Sage-Hybrid (PR #96, gemerged 2026-05-18, `main` `a3e0072`) und
  Brief 02 Plattform-Matrix (PR #97, gemerged 2026-05-18, `main`
  `69077db`). Folge-Etappe: Brief 04 Multi-Identität, dann
  BRIEF_99-Abschluss.

## Kern (3 Sätze)

Strang 2 holt die drei Schichten + Brücken-Feld + doppelte Spore aus
dem ursprünglichen SBKIM-Paper (Plattform-Form, § 3.3 „The Three
Dimensions") in die Mycel-Form ein. Modul 04 (Match) wird additiv um
zwei neue API-Funktionen erweitert (`matchDimensions` als sync
Stufe-A-Pipeline mit drei orthogonalen Schichten und Lane-
Bidirektionalität; `explainMatchLLM` als async Stufe-B-LLM-Pass mit
opt-in User-Key, JSON-only-Output, Fehlertoleranz und
Brücken-Vorschlag), Modul 02 (Spore) bekommt zwei neue optionale
Schema-Felder (`embeddingCapabilities` Alias + `embeddingNeeds`
Sucher-Vektor), und Modul 06 (Heterokaryose) bekommt einen neuen
Outbox-Eintrags-Typ „Brücken-Vorschlag" (Spec, kein Bau). Zwei neue
heilige Tafeln in INTERFACES (LLM-Stufe-B-Ehrlichkeits-Klausel § 7 +
Anti-Missbrauch-Klausel § 8) verankern die ehrliche Trennung Stufe A
↔ Stufe B und sperren `candidateScope:"netz"` bis Anker 10-12 gebaut
sind. **PROTOCOL_VERSION bleibt `"0.1"`** — alles additiv, kein altes
Feld zur Pflicht erhoben.

## Was getan wurde

### 1. INTERFACES.md — drei §0-Konstanten + zwei neue Top-Level-§-Blöcke + Sub-Blöcke + Änderungsprotokoll-Eintrag

- **§ 0 Globale Konstanten** um drei neue Konstanten erweitert:
  - `SCHICHT_MIN_MATCH = 0.60` (pro-Dimension-Schwelle für
    `matchDimensions`; eine Schicht darf fehlen = häufiger
    Brücken-Anlass; 2+ Dimensionen unter Schwelle = Apoptose).
  - `STUFE_B_DEFAULT_MODEL = "claude-sonnet-4"` (Konvention für
    `explainMatchLLM`; aufrufer-überschreibbar via `options.model`,
    Modul 04 hartcodiert keine Modell-ID).
  - `STUFE_B_MAX_TOKENS = 1024` (Default-Token-Budget für den
    Stufe-B-LLM-Call; aufrufer-überschreibbar; Pattern-Quelle:
    Layer-1-Demo der SBKIM-Plattform-`index.html`).

- **§ 1 Modul 02 (Spore) Bietet-Block** um Schema-Erweiterungs-
  Hinweis ergänzt: zwei neue optionale `generateOwnSpore`-meta-
  Felder (`embeddingCapabilities` Alias-Name für `domainVector`,
  semantisch identisch; `embeddingNeeds` neuer Sucher-Vektor,
  fehlend = „nur Anbieter-Modus"). Beide signaturpflichtig wenn
  vorhanden, beide additiv. Verweis auf § 2 Spore-JSON für die
  Schema-Form und § 1 Modul 04 für die Consumer-Seite.

- **§ 1 Modul 04 (Match) Bietet-Block** um zwei neue Funktionen
  erweitert plus eine neue Konstante:
  - `matchDimensions(qCap, qNeeds, pCap, pNeeds) → MatchDimensionsResult`
    (sync, drei Cosinus-Aufrufe + gewichteter `overall`,
    `availableLanes:0|1|2` für 0/einseitig/voll bidirektional;
    null-Vektoren signalisieren Nur-Anbieter-Modus).
  - `explainMatchLLM(matchResult, apiKey, options?) → Promise<ExplainResult>`
    (async — einziger Netz-/async-Pfad in Modul 04, fehlertolerant:
    scheitert nie throw, resolved mit `available:false` bei
    HTTP-/Schema-Fehlern).
  - `SCHICHT_MIN_MATCH` als zweite gespiegelte Konstante (aus § 0).

  Fehlerverhalten um sieben neue Zeilen erweitert (DimensionsAllNullError,
  einseitig-null = kein Throw, Form-Fehler, InvalidApiKeyError,
  InvalidMatchResultError, LLM-HTTP-/Schema-/Abort-Fälle
  fehlertolerant). Garantien-Block um vier neue Punkte erweitert
  (matchDimensions deterministisch, explainMatchLLM einziger
  Netz-/async-Pfad, Aufrufer-Drossel-Pflicht, Brücken-Vorschläge
  bleiben lokal). Geprüft-Zeile um 2026-05-19 (Spec M04-Erweiterung
  Brief 03) erweitert.

  Vier neue Sub-Blöcke unter Modul 04:
  - **§ Drei-Schichten-Modell:** orthogonal `fachlich` (domain) /
    `prozess` (process) / `skalierung` (scale); Lane-Berechnung
    (Lane 1 = qCap×pNeeds, Lane 2 = qNeeds×pCap); Schichten-
    Aufteilung als Heuristik über demselben Embedding-Raum in
    Stufe A; Mittelwert-vs-Min-Begründung für `overall`; Nur-
    Anbieter-Modus mit Rückwärts-Kompatibilität zum Single-Vector-
    Pfad.
  - **§ Brücken-Feld-Spec:** `BridgeProposal` mit `needed` /
    `lookingFor` / `candidateScope`; drei Werte (`lokal` heute,
    `mailbox` bedingt Modul 13, `netz` formal nicht aktivierbar
    bis Anker 10-12). Modul 04 korrigiert `"netz"`-LLM-Antworten
    still auf `"lokal"`.
  - **§ Schwellen-Vertrag:** PROVIDER_MIN_MATCH=0.80 für `overall`
    bleibt; SCHICHT_MIN_MATCH=0.60 pro Dimension neu; fünf
    Auswertungs-Regeln; Stufe-B-Übersteuerung erlaubt.
  - **§ Stufe-B-Vertrag (`explainMatchLLM`):** Modell +
    `max_tokens` + JSON-only-Output + Antwort-Schema (`schichten` /
    `bruecke` / `erklaerung` / `overrideRecommendation`); volle
    `ExplainResult`-Rückgabe-Form (inkl. `available`, `reason`,
    `fallbackScore`, `model`, `tokensUsed`); Fehlertoleranz, Rate-
    Limit-Awareness (Aufrufer-Pflicht), Plattform-agnostisches
    User-Key-Handling (Plattform-Matrix § 6.2 Spalte „Stufe B"
    listet die vier Key-Lokalisations-Varianten); Beispiel-Output
    mit zwei Personas als Brücke zu Brief 04.

- **§ 2 Spore-JSON Optionale Felder** um `embeddingCapabilities`
  (Alias für `domainVector`) und `embeddingNeeds` (neuer Sucher-
  Vektor) erweitert. Hinweis-Block: beide additiv,
  signaturpflichtig wenn vorhanden, PROTOCOL_VERSION bleibt 0.1.
  Verifikations-Pfad unverändert (Signatur deckt JSON-Form as-is,
  keine Wert-Konsistenz-Prüfung zwischen `domainVector` und
  `embeddingCapabilities`).

- **§ 7 LLM-Stufe-B-Ehrlichkeits-Klausel (M04-Erweiterung)** neu
  eingefügt — vier verbindliche Sätze:
  1. Stufe B ist opt-in (kein automatischer Schlüssel-Fallback,
     `InvalidApiKeyError` bei leerem Key).
  2. Stufe A ist rückgrat-tragend lokal (Match-Entscheidungen
     laufen aus Stufe-A-Werten, Stufe-B-`overrideRecommendation`
     ist nicht weisungsgebunden).
  3. Kein Knoten wird gezwungen, einen Drittanbieter zu nutzen
     (Modul 04 hartcodiert keine API-Endpunkte oder Modell-IDs;
     `apiKey` ist opaque).
  4. Knoten ohne Stufe B = vollwertige Netz-Teilnehmer (Match-
     Pipeline läuft ohne Stufe B durch, Brücken-Vorschläge sind
     semantische Vertiefung, keine Eintritts-Barriere).

  Namentlich von § 6.3 Plattform-allgemeiner Ehrlichkeits-Klausel
  unterschieden (§ 6.3 = Spore-Verhalten / Hintergrund-Empfang /
  Schlüssel-Sicherheit; § 7 = Stufe-B-Drittanbieter-Abhängigkeit /
  API-Key / Modell-Wahl). Plattform-Matrix-Konsumtion erklärt
  (Spalte „Stufe B" in § 6.2 = wo der Key liegt; Modul 04 = wie
  der Call läuft).

- **§ 8 Anti-Missbrauch-Klausel (M04-Erweiterung)** neu eingefügt —
  drei verbindliche Sätze:
  1. Brücken-Vorschlag bleibt lokal (`candidateScope` darf produktiv
     heute nur `"lokal"` tragen; LLM-Output mit `"netz"` wird still
     auf `"lokal"` korrigiert).
  2. `candidateScope:"netz"` ist formal nicht aktivierbar bis Anker
     10-12 (Reputation / Rate-Limit / Blocklist) gebaut sind.
  3. Modul 06 Heterokaryose filtert Brücken-Vorschlag-Outbox-
     Einträge defensiv beim `readOwnAnchors`-Lese-Pfad.

  Verbindlichkeit: Klausel gilt für jede Folge-Spec-Sitzung mit
  Brücken-Vorschlag-Einträgen, bis eine ausdrückliche Spec-Sitzung
  unter Verweis auf implementierte Anker 10-12 sie ändert.

- **§ 7 Änderungsprotokoll auf § 9 nachnummeriert** (additiv —
  Brief 03 fügt § 7 + § 8 vor der Changelog ein). Neuer Brief-03-
  Eintrag in § 9 mit allen Punkten dieser Sitzung + Verweis auf
  Brief-01-PR #96 und Brief-02-PR #97 als Vorgänger + Hinweis auf
  den hier entstehenden Brief 04.

### 2. Karte 02 (`docs/components/02_spore.md`) erweitert

- § Datenformat „Spore-JSON" Optionale-Felder-Block um die zwei
  neuen Vektor-Felder erweitert (`embeddingCapabilities`,
  `embeddingNeeds`).
- Neuer Sub-Block „M04-Erweiterung: embeddingCapabilities +
  embeddingNeeds (Brief 03)" mit:
  - Erläuterungen der beiden Felder (kanonischer Alias vs. neuer
    Sucher-Vektor).
  - Migrations-Tabelle (vier Spore-Zustände: Alt-Spore / Neu-Spore
    Anbieter-only / Neu-Spore voll / Übergangs-Spore — mit
    `matchDimensions`-Verhalten pro Zustand).
  - Bauzustand-Hinweis für die Bau-Folge-Sitzung
    (`generateOwnSpore`-Allow-List um zwei Zeilen analog
    `stammCategories`/`guestCategories`-Pflege 2026-05-15;
    konkreter Code-Schnipsel als Spec-Vorlage — **kein** Code-
    Eingriff in dieser Spec-Sitzung).
  - Bezugs-Verweise: Anker 9 (M04-Haupt-Anker), Anker 6 (Multi-
    Identität — doppelte Spore pro Persona, Brief 04 spezifiziert),
    Modul 04 (Consumer), Modul 06 (Brücken-Vorschlag-Outbox).
- Bauzustand-Tabelle um Zeile „Spec M04-Erweiterung (Brief 03)"
  mit allen Punkten erweitert.

### 3. Karte 04 (`docs/components/04_match.md`) erweitert

- § Schnittstelle von „zwei Funktionen + eine Konstante" auf
  „vier Funktionen + zwei Konstanten" angepasst.
- `matchDimensions` und `explainMatchLLM` mit vollen Signaturen und
  Verhaltens-Notizen ergänzt; `SCHICHT_MIN_MATCH` als zweite
  gespiegelte Konstante.
- Vier neue Sub-Blöcke (parallel zu INTERFACES.md):
  - Drei-Schichten-Modell mit Paper-Korrespondenz-Tabelle
    (fachlich↔domain, prozess↔process, skalierung↔scale).
  - Brücken-Feld-Spec mit `BridgeProposal` und drei
    `candidateScope`-Werten samt Verfügbarkeits-Hinweis.
  - Schwellen-Vertrag mit fünf Auswertungs-Regeln.
  - Stufe-B-Vertrag mit Antwort-Schema, `ExplainResult`-Form,
    Fehlertoleranz, Rate-Limit-Awareness, Plattform-agnostischem
    Key-Handling und Beispiel-Output mit zwei Personas als Brücke
    zu Brief 04.
- § Stamm/Gast-Klassifikation-Hinweis-Block **unverändert** — der
  Pflege-Hinweis von 2026-05-15 bleibt gültig (Schichten sind
  orthogonale Schicht zur Stamm/Gast-Klassifikation; explizit kein
  Dämpfungsfaktor, keine zweite Schwelle).
- § Fehlerverhalten um sieben neue Zeilen erweitert
  (DimensionsAllNullError, einseitig-null = kein Throw,
  InvalidApiKeyError, InvalidMatchResultError, LLM-HTTP-/Schema-/
  Abort-Fälle fehlertolerant).
- Bauzustand-Tabelle um Zeile „Spec M04-Erweiterung (Brief 03)"
  mit allen Punkten erweitert.

### 4. Karte 06 (`docs/components/06_heterokaryose.md`) ergänzt

- Neuer Sub-Block „Brücken-Vorschlag-Eintrags-Typ (M04-Erweiterung,
  Brief 03)" nach § Anker-Quelle:
  - Additive Outbox-Eintrags-Form
    `{entryType:"bridge-suggestion", label, vector:null, addedAt,
    bridgeProposal:{needed, lookingFor, candidateScope}}`.
  - Vier-stufige Filter-Logik im `readOwnAnchors`-Lese-Pfad:
    1. `entryType === "bridge-suggestion"`-Einträge werden vom
       Anker-Lese-Pfad AUSGESCHLOSSEN (sie tragen kein `vector`-
       Feld und wären strukturell falsch in einer
       `HeterokaryosisResponse.anchors`-Liste).
    2. `candidateScope === "lokal"` — Eintrag bleibt im Outbox-
       Store, Endknoten-UI rendert lokal, kein Netz-Schritt.
    3. `candidateScope === "mailbox"` — wartet auf Modul 13
       (Königin-Relay, Vision-Anker 4); vor Modul 13 spec-offen.
    4. `candidateScope === "netz"` — wird NICHT versendet bis
       Anker 10-12 gebaut; Modul 06 filtert defensiv (auch wenn
       `entryType` versehentlich nicht gesetzt sein sollte).
  - Schreiber-Konvention: Modul 08 als Co-Schreiber (analog zum
    bestehenden Anker-Eintrags-Pfad); Modul 04 spec-offen (Brief 03
    lässt offen, weil Modul 04 zustandslos ist).
  - Anti-Missbrauch-Klausel-Verweis auf INTERFACES.md § 8 als
    verbindliche heilige Tafel.
- **Kein Code-Eingriff** in `src/modules/06_heterokaryose.js` oder
  `src/modules/08_ui_demo.js`. Bau-Implementierung folgt als eigene
  Phase (Spec-Sitzung 08.2 oder dedizierte Bau-Sitzung).
- Bauzustand-Tabelle um Zeile „Spec M04-Erweiterung Brücken-
  Vorschlag (Brief 03)" erweitert.

### 5. PULS.md — neuer Sitzungs-Eintrag + Vision-Anker 9 § Status + Archiv-Index

- Neuer Top-Eintrag „2026-05-19 · Spec — M04-Erweiterung (Brief 03
  der V1-Sammelspec-Kaskade)" mit den vier Punkten a–d, voller
  Heilige-Tafeln-Block, Konsistenz-Prüfungs-Notiz (5 Punkte
  abgehakt), Sichttest-Vermerk („ungeprüft, weil reine Doku-Pflege"),
  Nächster-Schritt-Vermerk.
- **Brief-02-Sitzungs-Eintrag aus dem Body entfernt** (Vorletzten-
  Auslagerungs-Konvention) — Voll-Eintrag bleibt im
  Übergabeprotokoll `2026-05-18_spec-plattform-matrix.md`, im
  Archiv-Index als Tabellenzeile oben mit Quintessenz-Stichworten +
  Verlinkung.
- **Vision-Anker 9 § Status nachgezogen** auf „Strang 2 der
  V1-Sammelspec realisiert (2026-05-19, Brief 03 der V1-Sammelspec-
  Kaskade)" mit Verweis auf Brief 04 und BRIEF_99-Liste. Vision-
  Anker 1 / 4 / 5 / 6 / 7 / 8 **unangetastet** — Brief 03 ist
  Strang 2, ohne Bezug zu deren Status-Blöcken.
- PULS-Zeilen-Status nach Edit: 2855 Zeilen (vor Edit 2761; +94
  netto — neuer Brief-03-Eintrag deutlich kompakter als Brief 02
  in der Spitze gewesen war). Schutz-Klausel (3000 Zeilen)
  eingehalten.

### 6. Brief 04 angelegt

`docs/sessions/BRIEF_04_multi_identitaet.md` als letzte Datei-
Aktion. Inhalt: Strang 3 aus BRIEF_SPEC_V1_SAMMELSPEC heraus-
geschnitten + dieselbe Bauplan-Struktur wie Briefe 01 / 02 / 03.

- **Pflichtleseliste** aktualisiert: eigener PR (Brief 03) +
  INTERFACES-Stand nach Brief 03 + Karten 02 / 05 / 06 / 07 nach
  Brief 03 + Briefe 01–03 als Vorgänger-Belege + PULS-Anker-
  Querverweise (V6 Multi-Identität als Haupt-Anker, V1 / V4 / V5 /
  V9 als Bezugs-Anker).
- **Kaskaden-Konvention 5** (Vorgänger-Konsistenz-Prüfung) explizit
  gefordert: Brief 04 muss prüfen, dass keine Korrekturen an Brief
  01 / 02 / 03 nötig sind, bevor `sbkim_keys`-Multi-Slots und
  `active-identity`-Marker eingeführt werden.
- **PROTOCOL_VERSION-Disziplin** geerbt: bleibt 0.1, solange
  `sbkim_keys[key]` ein lokales Schema ist und nicht in die
  Spore-JSON wandert. Sollte Brief 04 eine `spore.json`-Liste-
  Schema-Variante (Strategie B aus § STRANG 3 § d) wählen, ist die
  Bump-Entscheidung explizit zu treffen.
- **Kaskaden-Konvention 6** (Auslöser-Befehl im Chat) propagiert
  in Brief 04's „Pflicht am Ende" für die BRIEF_99-Abschluss-Sitzung.

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Schnittstellen-Änderungen ZUERST in
  INTERFACES, dann in den Karten 02 / 04 / 06. Drei §0-Konstanten +
  §1 Modul 02 + §1 Modul 04 + §2 Spore-JSON + §7 + §8 + §9 alle in
  INTERFACES verankert; Karten nachgezogen.
- **PROTOCOL_VERSION-Disziplin geprüft, kein Bump.**
  `embeddingCapabilities` ist optionaler Alias (kein Pflicht-Rename),
  `embeddingNeeds` ist optionales Feld (kein Pflicht-Feld),
  `matchDimensions` / `explainMatchLLM` sind additive Funktionen
  (alte Signatur `match` bleibt wortwörtlich, alte Aufrufer brechen
  nicht). `PROTOCOL_VERSION` bleibt `"0.1"` — die Brief-Wahl-Klausel
  „Sollte M04 ein altes Feld zur Pflicht erheben, bumpe auf 0.2"
  wurde explizit geprüft und nicht ausgelöst.
- **Plattform-Ehrlichkeits-Klausel LLM (§ 7) als eigene heilige
  Tafel.** Namentlich von § 6.3 Plattform-allgemeiner Ehrlichkeits-
  Klausel unterschieden. Beide ergänzen einander.
- **Anti-Missbrauch-Klausel (§ 8) als eigene heilige Tafel.**
  Brücken-Vorschlag bleibt lokal; `candidateScope:"netz"` formal
  nicht aktivierbar bis Anker 10-12.
- **Privatheit:** Anker 9 § Sorge ums Freigeben bleibt offen.
  Lizenz-Entscheidung wird beim Public-Schalten separat geklärt.
- **Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5):**
  Fünf Punkte abgehakt — (1) Brief-02-PR #97 ist gemerged,
  `main`-Stand bei `69077db`; (2) INTERFACES § 6.2 / § 6.3 / § 6.4
  + § 7 Änderungsprotokoll auf Brief-02-Stand; (3) Brief-02-
  Plattform-Matrix-Spalte „Stufe B" in der M04-Spec gespiegelt
  (Plattform-agnostisches Key-Handling); (4) Keine Korrekturen an
  Brief 01 oder Brief 02 nötig; (5) PR #89 (Karte 15 Membran als
  Stub, Draft) bleibt unangetastet — Modul-15-Block liegt nach
  Modul 09 in INTERFACES, kollidiert nicht mit den Brief-03-
  Eingriffen.

## Was NICHT angefasst wurde

- **Modul-Code in `src/`** — Spec geht der Implementierung voraus.
  Kein Eingriff in irgendeinem Modul; Bau-Folge-Sitzungen (Stufe A
  erweitert ~2-3 h, Stufe B ~5-8 h, Sage-Page-Karte 04 ~3-5 h,
  Migrations-Pflege Spore-Schema ~2 h) folgen nach Kaskaden-
  Abschluss.
- **Sage-Page `index.html`** — Sage-Page-Refactor ist Bau-Sitzung
  nach Kaskaden-Abschluss in der BRIEF_99-Liste. Keine Karten-
  Erweiterung um eine „Schichten-Lampen"-Visualisierung.
- **Plattform-Matrix** (Brief 02 hat sie gesetzt). § 6.2 / § 6.3 /
  § 6.4 bleiben unangetastet — Brief 03 konsumiert nur die Spalte
  „Stufe B" als Schnittstellen-Eckdatum.
- **Multi-Identität-Spec** (`sbkim_keys`-Multi-Slots,
  `active-identity`-Marker) — Brief 04.
- **Königin-Relay-Spec** (Anker 4) — eigene Spec-Sitzung. Brücken-
  Feld `candidateScope:"mailbox"` verweist nur.
- **Identitäts-Container-Spec** (Anker 5) — eigene Spec-Sitzung.
  API-Key-Speicher-Hinweis verweist nur.
- **Extension- oder Mini-Browser-Spec** (Anker 7 / 8) — eigene Spec-
  Sitzungen. Stufe-B-Plattform-Matrix-Spalte (Brief 02) referenziert
  sie, Brief 03 konsumiert die Eckdaten.
- **CLAUDE.md** — Brief 01 hat sie auf „Hub und Knoten zugleich"
  umgeschrieben. Brief 03 ändert nichts.
- **Karte 09** (`docs/components/09_einbau_pwa.md`) — Brief 01 hat
  § Schritt 1 erweitert. Brief 03 ändert nichts.
- **`status.json`** — Brief 01 hat Sage als drittes
  `endknoten[]`-Element aufgenommen. Brief 03 ändert nichts.
- **`update_puls_pie.py`** NICHT aufgerufen — keine
  `status.json`-Score-Wechsel.
- **`tests/manual_check.html`** unangetastet — kein Modul-
  Eingriff, keine UI-Erweiterung.

## Was offen blieb (für Folge-Sitzungen)

- **Brief 04 (Multi-Identität) als nächste Etappe.** Auslöser-
  Befehl im Chat-Tab; Brief-Datei
  `docs/sessions/BRIEF_04_multi_identitaet.md` liegt im Repo.
  Pflichtleseliste enthält Brief 03-PR als gemerged-Voraussetzung.
- **BRIEF_99 (Sammelspec-Abschluss)** schließt die Kaskade nach
  Brief 04. Erst danach beginnt die Sage-Page-Refactor-Bau-Sitzung
  (`index.html`-Eingriff mit voller init()-Kette + Andock-Wizard +
  ggf. Schichten-Lampen für M04-Erweiterung).
- **Bau-Folge-Sitzungen** für M04-Erweiterung (Stufe A erweitert
  ~2-3 h; Stufe B mit User-Key + LLM-Call ~5-8 h; Sage-Page-Karte 04
  mit drei Schicht-Lampen ~3-5 h; Migrations-Pflege Spore-Schema in
  Mein-Mixarium / Mein-Rezeptbuch ~2 h). Alle nicht in Brief 03.
- **Vision-Anker 4 / 5 / 7 / 8** bleiben Vision; eigene Spec-
  Sitzungen kommen nicht in der V1-Sammelspec-Kaskade.

## Nächster sinnvoller Schritt

**Auslöser-Befehl für Brief 04** (Kaskaden-Konvention 6, im
Chat-Tab am Sitzungs-Ende):

```
Lies docs/sessions/BRIEF_04_multi_identitaet.md vollständig
und führe den Brief als nächste Sitzung in der V1-Sammelspec-
Kaskade aus. Konventionen siehe PULS § Archiv-Index „Meta-
Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" (sechs
heilige Tafeln). Branch laut Brief (claude/spec-v1-multi-
identitaet, vom main aus anlegen).
```

**Reihenfolge-Hinweis:** Brief 04 setzt Brief-03-PR (diese
Sitzung) als gemerged voraus. Wenn Klaus die Kaskade pausieren
will, kann die Brief-03-PR auf `main` ruhen, und Brief 04 wird
zu einem späteren Zeitpunkt gestartet — INTERFACES § 0 / § 1
Modul 02 / § 1 Modul 04 / § 2 / § 7 / § 8 bleiben gültig, weil
sie additiv sind.

## Manueller Sichttest

**Ungeprüft, weil reine Doku-Pflege.** Kein Modul-Code in
`src/`, kein `tests/manual_check.html`-Eingriff, keine Sage-
Page-Änderung, `status.json` unverändert,
`update_puls_pie.py` NICHT aufgerufen. INTERFACES.md ist
Spec-Tafel, kein Sichttest-pflichtiger Artefakt.

## Verlinkte Artefakte

- **Brief-Datei:** `docs/sessions/BRIEF_03_m04_erweiterung.md`
- **Vorgänger-Briefe:** `docs/sessions/BRIEF_01_v1_sage_hybrid.md`,
  `docs/sessions/BRIEF_02_plattform_matrix.md`
- **Folge-Brief:** `docs/sessions/BRIEF_04_multi_identitaet.md`
- **Quell-Spec:** `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
  § STRANG 2; Stil-/Detail-Vorlage:
  `docs/sessions/BRIEF_SPEC_M04_ERWEITERUNG.md` (Bruder-Brief,
  nur als Detail-Anschauung — nicht als alleinstehender
  Sitzungs-Brief gezogen).
- **INTERFACES neue Sub-Sektionen:** § 0 Globale Konstanten
  (drei neue), § 1 Modul 02 Bietet-Block-Schema-Erweiterung,
  § 1 Modul 04 (Bietet-Block + Fehlerverhalten + Garantien +
  vier neue Sub-Blöcke), § 2 Spore-JSON Optionale Felder,
  § 7 LLM-Stufe-B-Ehrlichkeits-Klausel (neu), § 8 Anti-
  Missbrauch-Klausel (neu), § 9 Änderungsprotokoll (war § 7).
- **Karten neue Sub-Sektionen:** Karte 02 § M04-Erweiterung,
  Karte 04 vier neue Sub-Blöcke, Karte 06 § Brücken-Vorschlag-
  Eintrags-Typ.
- **PULS-Eintrag:** § Sitzungs-Einträge, neuer Top-Eintrag
  „2026-05-19 · Spec — M04-Erweiterung"; Vision-Anker 9 §
  Status nachgezogen.
- **Vorgänger-PRs:** #96 „Spec: V1 Sage-Hybrid — Strang 1"
  (gemerged 2026-05-18), #97 „Spec: Plattform-Matrix — Strang 2"
  (gemerged 2026-05-18).
- **Paralleler PR:** #89 „Karte 15 Membran als Stub" (Draft,
  offen, kollidiert nicht — Modul-15-Block nach Modul 09 in
  INTERFACES, keine Berührung mit M04-Modulen 02 / 04 / 06).
- **PULS § Vision-Anker:** 1 (V1 Sage-Hybrid), 4 (Königin-
  Relay), 5 (Identitäts-Container), 6 (Multi-Identität), 7
  (Extension), 8 (Mini-Browser), **9 (M04-Erweiterung — Haupt-
  Anker, § Status nachgezogen).**
- **Bezugs-Dokumente:**
  - `docs/papers/sbkim-paper-en.html` § 3.3 „The Three
    Dimensions" + § 3.4 „Protocol Properties" (Stateless +
    Evaluator agnosticism) — Quell-Spec für die drei orthogonalen
    Achsen.
  - `docs/papers/sbkim-paper-de.html` § 3.3 (deutsches Pendant).
  - PULS § Vision-Anker 9 „M04-Erweiterung — drei Schichten +
    Brücke + doppelte Spore" (Haupt-Anker, Konzept-Vorlage).
