# Brief — V1-Sammelspec · Sage-Hybrid + M04-Erweiterung + Multi-Identität + Plattform-Matrix

**Mehrtägige Spec-Sitzung.** Klaus' Wunsch nach der M04-Brainstorming-
Sitzung 2026-05-18: die V1-Spec (Sage als Hybrid-Knoten, Anker 1) nicht
isoliert ziehen, sondern als **Sammelspec** mit drei weiteren reifen
Vision-Ankern (9, 6) und einer Plattform-Matrix bündeln — die Stränge
gehören architektonisch zusammen, eine V1 ohne sie würde später
nachgezogen werden müssen.

**Scope** (aus dem Übergabeprotokoll der M04-Erweiterungs-Pflege, PR
#86, § 13 Großbrief vorbereitet):

1. **V1 — Sage als Hybrid-Knoten** (Anker 1, PULS Z. 555-598)
2. **M04-Erweiterung** — drei Schichten + Brücke + doppelte Spore
   (Anker 9, PULS Z. 1229-1357 — die Paper-↔-Mycel-Brücke)
3. **Multi-Identität in der IndexedDB** (Anker 6, PULS Z. 898-977 —
   Modul 02 lernt mehrere Personae)
4. **Plattform-Matrix** — Sporen-Verhalten in Desktop-Browser /
   DeX-Tablet / PWA-installiert / Mini-Browser (Anker 8) / Extension
   (Anker 7)

Dieser Brief geht in den **ersten Prompt** der nächsten Spec-Sitzung
als Codeblock. Mehrtägig — die Sitzung darf in mehreren Etappen
laufen (siehe Etappierungs-Vorschlag unten), aber INTERFACES soll
am Ende widerspruchsfrei stehen.

---

```
Du bist eine Spec-Sitzung in Sage-Protokol — V1-Sammelspec.

Branch: claude/spec-v1-sammelspec   (vom main aus anlegen)

Sitzungs-Rolle: Spec (kein Code, kein Modul-Eingriff). Mehrtägige
Sammelspec mit vier Strängen: V1 (Sage als Hybrid-Knoten), Anker 9
(M04-Erweiterung), Anker 6 (Multi-Identität), Plattform-Matrix.
INTERFACES.md ist die heilige Tafel — ziehst du sie ZUERST, dann die
Modul-Karten. Bau läuft in Folge-Sitzungen, nicht hier.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md § Vision-Anker:
   - "2026-05-17 · Sage als Hybrid-Knoten (Variante I)"
     (Anker 1, vollständig — CLAUDE.md-Umschrift, INTERFACES-Eintrag
     Sage als Endknoten, status.json-Erweiterung, Sage-Page volle
     init()-Kette, Domäne-Vorschläge, IndexedDB-Suffix sbkim_sage,
     App-SW-Variante 3a)
   - "2026-05-18 · M04-Erweiterung — drei Schichten + Brücke +
     doppelte Spore" (Anker 9, vollständig — drei Schichten
     fachlich/prozess/skalierung, Brücken-Feld, doppelte Spore,
     Stufe A / Stufe B, Verbindungen, Historie Paper ↔ Mycel)
   - "2026-05-18 · Multi-Identität in der IndexedDB (Modul 02
     Erweiterung)" (Anker 6, vollständig — getOrCreateIdentity,
     active-identity-Marker, Geschwister-Netze pro Identität,
     spore.json-Strategien)
3. docs/sessions/archiv/2026-05-18_mini-pflege-vision-anker-m04-erweiterung.md
   (Brainstorming-Kontext, Brücke Paper ↔ Mycel sichtbar gemacht;
   Sorge ums Freigeben dokumentiert aber nicht zu spekulieren)
4. docs/INTERFACES.md (vollständig — heilige Tafel, du editierst sie)
5. docs/components/02_spore.md, docs/components/04_match.md,
   docs/components/05_anastomose.md, docs/components/06_heterokaryose.md,
   docs/components/09_einbau_pwa.md (alles, was V1 + Anker 9 + Anker 6
   berührt)
6. data/status.json (Sage-Endknoten-Eintrag kommt hier rein)
7. docs/papers/sbkim-paper-en.html § 3.3 "Bidirectional Matching with
   Three Dimensions" (Quell-Spec für fachlich/prozess/skalierung)
8. docs/OBSERVATORIUM_BROWSER.md (Lehre 1 — Browser-Instanzen-Trennung;
   Plattform-Matrix-Spec muss diese Lehre kennen)

Was du NICHT liest: Sage-Page index.html (Bau-Detail), Modul-Code in
src/, andere Komponenten-Karten als oben.

Heilige Tafeln:
- INTERFACES verbindlich — wenn du eine Schnittstelle änderst,
  ZUERST dort, DANN Modul-Karten. PROTOCOL_VERSION-Disziplin
  bewusst entscheiden: V1 kann bei 0.1 bleiben, wenn alte spore.json
  weiter gültig ist; Anker 9 erst zwingt 0.2 wenn embeddingNeeds
  Pflicht wird; Anker 6 kann bei 0.1 bleiben (Identitäts-Map ist
  lokales Schema).
- Anti-Missbrauch (Anker 9): Brücken-Vorschlag bleibt LOKAL — keine
  Spore-Leakage auf Drittknoten. Als Spec-Klausel formulieren.
- Plattform-Ehrlichkeit: Stufe B (LLM) ist opt-in pro Knoten. Wer
  keinen API-Key hat, bleibt vollwertiger Netz-Teilnehmer.
- Privatheit: Sage ist heute privat. Lizenz-Sorge dokumentiert, nicht
  hier zu lösen.

Deine Aufgabe — vier Stränge, in dieser Reihenfolge:

STRANG 1 — V1 Sage als Hybrid-Knoten

a) docs/INTERFACES.md § Endknoten-Liste: Sage als dritten Endknoten
   neben Mein-Rezeptbuch und Mein-Mixarium aufnehmen. Felder:
   - id, domain, domainDescription, domainKeywords, domainVector
   - Vorschlag aus Anker 1: Domäne "Mycel-Bibliothek" oder "SBKIM-
     Glossar" oder "Sage-Observatorium" — entscheide in der Spec und
     begründe
   - Stamm/Gast-Kategorien für Sage: Stamm = Protokoll-Doku /
     Mycel-Vokabular, Gast = Glossar-Wartung / Schwesternetz-
     Beobachtungen

b) data/status.json § endknoten: sage-Eintrag mit eigener Domäne,
   nodeId-Slot (nach erstem Andocken), pingStatus.

c) CLAUDE.md umschreiben: Satz "Es ist kein Endknoten" entfernen,
   "Hub und Knoten zugleich" einführen. Knotentyp-Feld unten ("hybrid")
   bleibt — wird jetzt wahr.

d) Karte 09 § Schritt 1 erweitern: "Sage-Observatorium selbst ist
   auch ein Endknoten — wer sich am Sage-Mycel andockt, bekommt es
   als Geschwister."

e) Sage-Page-Architektur dokumentieren (in INTERFACES § Sage-Endknoten,
   nicht in der Sage-Page selbst):
   - IndexedDB-Suffix sbkim_sage
   - App-SW: Variante 3a (Standalone sbkim-sw.js im Sage-Page-Root)
   - Volle init()-Kette aller SBKIM-Module beim ersten Andocken;
     Modul 03 Embedding (~30 MB) lädt lazy + UX-Vorwarnung
   - Andock-Geste an der Schwarz-Loch-Karte: Klick öffnet künftig
     Andock-Wizard für Sage's eigene Spore-Erzeugung

STRANG 2 — Anker 9 M04-Erweiterung (das bidirektionale KI-Matching,
Brücke Paper ↔ Mycel)

a) docs/INTERFACES.md erweitern:

   - Spore-Schema (Modul 02):
     - embedding wird als embeddingCapabilities akzeptiert
     - embeddingNeeds neu, additiv, optional
     - beide float32, gleiche Dimension (heute 384)

   - Match-API (Modul 04):
     - match(query, passage) -> number              (bleibt erhalten)
     - matchDimensions(qCap, qNeeds, pCap, pNeeds)
       -> { fachlich, prozess, skalierung, overall }  (neu, additiv)
     - explainMatchLLM(matchResult, apiKey)
       -> Promise<{ schichten, bruecke, erklaerung }> (Stufe B)
     - isAboveProviderThreshold(score)              (bleibt erhalten)

   - Schichten-Definition (drei Achsen orthogonal):
     - fachlich = Domain-Match (was kannst du / was suchst du
       inhaltlich)
     - prozess = Arbeitsweise (Rhythmus, Methodik, Verbindlichkeit)
     - skalierung = Größenebene (einzelner Knoten / Cluster / Netz)

   - Brücken-Feld-Spec:
     - { needed: string, lookingFor: string|null,
         candidateScope: 'lokal'|'mailbox'|'netz' }
     - 'lokal' = Anzeige nur im Knoten, kein Netz-Schritt
     - 'mailbox' = Anker an Modul 13 Königin-Relay (falls vorhanden)
     - 'netz' = NOCH NICHT DEFINIERT (wartet auf Anti-Spam-Schicht
       Anker 10-12)

   - Schwellen:
     - PROVIDER_MIN_MATCH=0.80 für overall (bleibt)
     - SCHICHT_MIN_MATCH=0.60 pro Dimension (neu — eine Schicht darf
       fehlen = häufiger Brücken-Anlass)
     - 2+ Dimensionen unter SCHICHT_MIN_MATCH = Apoptose
     - Stufe-B-Erklärung darf Dimensions-Schwelle übersteuern wenn
       sie den Brücken-Vorschlag begründet (semantisch reicher als
       Zahl)

   - Plattform-Ehrlichkeits-Klausel als eigenes §:
     - Stufe B opt-in
     - Stufe A rückgrat-tragend lokal
     - Kein Knoten gezwungen, Drittanbieter zu nutzen
     - Knoten ohne Stufe B = vollwertige Netz-Teilnehmer

   - Anti-Missbrauch-Klausel als eigenes §:
     - Brücken-Vorschlag bleibt LOKAL (kein Spore-Leak)
     - candidateScope='netz' formal nicht aktivierbar bis Anker 10-12

b) docs/components/02_spore.md erweitern: Schema-Erweiterung,
   Migrations-Pfad (embeddingNeeds=null bleibt gültig, signalisiert
   "nur Anbieter-Modus"), Verweis auf Anker 9 + Anker 6.

c) docs/components/04_match.md erweitern: matchDimensions-Spec,
   explainMatchLLM-Spec mit:
   - LLM-Pattern (claude-sonnet-4, max_tokens ~1024, JSON-only-Output,
     strenge Validation; Pattern-Quelle: Layer-1-Demo der Plattform-
     index.html, sinngemäß)
   - Antwort-JSON-Schema (für die Validation)
   - Fehlertoleranz: scheitert Stufe B, fällt auf Stufe-A-Resultat
     zurück; UI zeigt "Erklärung nicht verfügbar"
   - Rate-Limit-Awareness: Aufrufer (06/08) drosseln selbst, nicht
     das Match-Modul
   - User-Key-Handling: aus Container (Anker 5), niemals plain
     IndexedDB
   - Beispiel-Output für eine Match-Sitzung mit zwei Personas (knüpft
     an Strang 3)

d) docs/components/06_heterokaryose.md ergänzen: outbox bekommt einen
   Eintrag-Typ "Brücken-Vorschlag" (nur Spec, kein Bau-Detail).

STRANG 3 — Anker 6 Multi-Identität in der IndexedDB

a) docs/INTERFACES.md § Identitäts-Map:
   - sbkim_keys["main"] (Default) + beliebig viele weitere Slots
   - sbkim_meta["active-identity"] = key — bestimmt, welche Identität
     Module 05/06/07 gerade nutzen
   - Module 05/06/07 lesen active-identity als Konvention, kein
     verpflichtender API-Hook

b) Modul 02 API-Erweiterung (in INTERFACES + Modul-Karte 02):
   - getOrCreateIdentity(key='main') -> identity
   - setActiveIdentity(key) -> void (wechselt aktive)
   - listIdentities() -> string[]
   - removeIdentity(key) -> bool (mit Bestätigungs-Konvention auf
     Anwendungs-Ebene — Spec nennt, dass UI bestätigen soll, ohne
     den Bestätigungs-Modus zu spezifizieren)

c) Geschwister-Netze pro Identität:
   - sbkim_siblings_<key> als Pattern
   - Modul 05 erweitert: API behält ihren Namen, liest aber den
     identitäts-spezifischen Slot transparent

d) Pages-spore.json: zwei Strategien dokumentieren, Spec entscheidet:
   - Strategie A: nur aktive Identität in spore.json (heutige Optik
     bleibt), Identitäts-Wechsel = spore.json-Regenerierung
   - Strategie B: Liste-Schema mit mehreren Identitäten; Peer filtert
     über toNodeId
   - Empfehlung in der Spec begründen — Strategie A ist einfacher,
     Strategie B ehrlicher für Multi-Identität-Use-Case

e) Verbindung zu Anker 9: doppelte Spore PRO PERSONA. Jede Identität
   hat eigene embeddingCapabilities + embeddingNeeds.

f) Trade-off-Klausel in INTERFACES: IndexedDB-Verlust löscht ALLE
   Identitäten gleichzeitig — Anker 5 (Identitäts-Container) bleibt
   parallel sinnvoll als Backup-Strategie. Spec verweist auf Anker 5,
   spezifiziert Container nicht (Anker 5 hat eigene Spec).

STRANG 4 — Plattform-Matrix

a) docs/INTERFACES.md § Plattform-Matrix (neuer Block, neben
   Endknoten-Liste):

   Plattform           IndexedDB    SW           Spore-Empfang    Identitäts-Backup    Stufe B
   ---------------------------------------------------------------------------------------------
   Desktop-Browser     pro Profil   browser-SW   nur Tab offen    optional Container   ja (eigener Key)
   DeX-Tablet          pro Profil   browser-SW   nur Tab offen    optional Container   ja
   PWA-installiert     pro Profil   App-SW       Tab fest, längere
                                                  Lebenszeit       optional Container   ja
   Mini-Browser (V8)   eigene DB    App-eigener  Tray-Modus,
                                                  Hintergrund-OK   Datei-System         ja (Key im
                                                                                          App-Dir)
   Extension (V7)      Browser-DB
                       geteilt mit
                       PWA          Background-
                                    Service-W.   Popup-Trigger,
                                                  begrenzt         keine eigene,
                                                                    nutzt PWA-Container   ja im Popup

b) Spec-Klausel "Sporen-Verhalten ist plattform-ehrlich" — kein
   Endknoten gibt vor, mehr zu können als seine Plattform erlaubt.
   Klaus' Sorge nach den Pages-Live-Tests 2026-05-17 (Lehre 1
   Browser-Instanzen-Trennung) wird damit zur Spec-Klausel: jede
   spore.json trägt implizit ihre Plattform, kein Knoten lügt.

c) Verbindung zu Anker 4 (Königin-Relay): Plattformen mit
   "nur Tab offen" oder "Popup-Trigger" sind die Hauptgründe, warum
   die Königin existiert — verschlüsselte Mailbox für offline-Phasen.
   Spec verweist auf Anker 4, spezifiziert das Relay nicht (Anker 4
   hat eigene Spec, bedingt Anker 13).

d) Verbindung zu Anker 7 + 8: Plattform-Matrix-Block in INTERFACES
   bezieht sich auf die Anker — Anker selbst bleiben in PULS,
   INTERFACES nimmt nur die Schnittstellen-Eckdaten.

Querverweis-Matrix (in INTERFACES § Vision-Bezüge, neuer Block):

  V1   V9   V6   V7   V8   V4   V5
  --   --   --   --   --   --   --
  Träger | Stufe-B-Ort | Persona-Quelle | Toolbar-Lampe | Tray-Träger | Mailbox | Key-Speicher

Was du NICHT tust:

- Kein Modul-Code in src/. Spec geht der Implementierung voraus.
- Keine Sage-Page-Änderungen. Bau-Sitzung baut Sage-Page-Refactor in
  Folge-Mini-Pflege.
- Keine Stufe-B-Prompt-Konstruktion in Code. Spec definiert das
  Antwort-JSON-Schema und das Verhaltens-Modell.
- Keine status.json-Wert-Schübe für Module 02/04/05 — Spec-Reife
  hebt den Score nicht; Bau-Sitzungen heben.
- Keine Lizenz-Entscheidung. Klaus' Sorge ums Public-Schalten
  bleibt offen — die Spec rührt das nicht.
- Keine vorgreifende Spec für Anker 4 (Königin) oder Anker 5
  (Container) — diese haben eigene Spec-Sitzungen. Nur Querverweise.

Pflicht am Ende:

- docs/INTERFACES.md auf neuem Stand (alle vier Stränge, Plattform-
  Matrix, Plattform-Ehrlichkeit, Anti-Missbrauch, Querverweise)
- docs/components/02_spore.md auf neuem Stand
- docs/components/04_match.md auf neuem Stand
- docs/components/06_heterokaryose.md mit Brücken-Vorschlag-Eintrag-
  Typ ergänzt
- data/status.json mit Sage-Endknoten-Eintrag
- CLAUDE.md umgeschrieben ("Hub und Knoten zugleich")
- docs/components/09_einbau_pwa.md § Schritt 1 erweitert (Sage-als-
  Endknoten)
- PULS.md neuer Sitzungs-Eintrag oben (vorletzten ins Archiv-Index
  schieben — Konvention).
- Vision-Anker 1, 9, 6 § Status nachziehen: "Reif für Spec-
  Diskussion" → "Spec realisiert in PR #<nummer>; Bau-Sitzungen in
  Folge-Mini-Pflegen".
- Übergabeprotokoll in
  docs/sessions/archiv/2026-05-XX_spec-v1-sammelspec.md mit den vier
  Strängen einzeln dokumentiert.
- Commit + Push auf claude/spec-v1-sammelspec + Draft-PR.
- Mehrtägige Sitzung: nach Etappe 1 (Strang 1 V1 + Strang 4
  Plattform-Matrix, ~4-6 h) Zwischen-Commit. Nach Etappe 2 (Strang 2
  Anker 9, ~3-5 h) Zwischen-Commit. Nach Etappe 3 (Strang 3 Anker 6,
  ~2-3 h) finaler Commit + PR-Aufstellung.
- "Vorgeschlagene nächste Schritte"-Block am Sitzungs-Ende im Chat
  (Bau-Reihenfolge: typisch V1-Bau Sage-Page-Refactor zuerst, dann
  Anker 9 Stufe A, dann Anker 9 Stufe B, parallel Anker 6 Bau).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS.md ans Ende des
  betroffenen Ankers. Klaus klärt in der nächsten Sitzung.

Zeitschätzung gesamt: 10-15 Stunden über 2-3 Sitzungstage.

Etappierungs-Vorschlag:

Tag 1 (~5 h): Strang 1 V1 + Strang 4 Plattform-Matrix
              (INTERFACES § Endknoten-Liste + § Plattform-Matrix,
              status.json, CLAUDE.md, Karte 09)
Tag 2 (~4 h): Strang 2 Anker 9 M04-Erweiterung
              (INTERFACES § Match-API + § Schichten + § Brücken-Feld
              + § Schwellen + § Plattform-Ehrlichkeit + § Anti-
              Missbrauch, Modul-Karten 02 + 04 + 06)
Tag 3 (~3 h): Strang 3 Anker 6 Multi-Identität + Querverweis-Matrix
              + finaler INTERFACES-Durchlauf für Widerspruchsfreiheit
              + Übergabe + PR

Alternativ als ein-Tages-Marathon (~10-12 h) möglich, aber Klaus'
Disziplin "Tages-Rhythmus" sollte respektiert werden.
```

---

## Hinweise außerhalb des Briefes (Hauptsitzung-Kontext)

- **Engerer Bruder-Brief vorhanden.** Für den Fall, dass Klaus nur die
  M04-Erweiterung (Anker 9) als alleinstehende Spec ziehen will (ohne
  V1-Sammelspec-Mehrtäger), liegt der fokussierte Brief
  `docs/sessions/BRIEF_SPEC_M04_ERWEITERUNG.md` daneben — 3-5 h
  statt 10-15 h, Scope nur Strang 2 dieses Großbriefs. Klaus wählt:
  Großbrief (V1 + 9 + 6 + Plattform) oder Bruder (nur 9).

- **„Die beiden SBKIM" (Klaus' Begriff).** Mycel-Form (dieses Repo,
  MiZell-Prinzip) **und** Paper-Form (Plattform-Pitch, bidirektionales
  KI-Matching mit drei Dimensionen) tragen denselben Namen. Diese
  Sammelspec ist ihre Brücke — die Mycel-Form holt die strukturierte
  Tiefe des Papers zurück, ohne die schlanke Infrastruktur aufzugeben.

- **Mehrtägig respektieren.** Klaus hat ausdrücklich „mehrtägige
  Sitzung" gewünscht. Tag 1 darf mit einem Zwischen-Commit enden,
  ohne dass INTERFACES schon widerspruchsfrei sein muss — finale
  Konsistenz-Prüfung läuft am letzten Tag.

- **V1-Bau steht noch nicht an.** Diese Sammelspec ist reine
  Schnittstellen-Arbeit. Sage-Page-Refactor, Modul-Code-Erweiterung
  und Sage-Page-Karten-Erweiterung laufen in Folge-Bau-Sitzungen,
  nicht in dieser Spec.

- **Brief wurde rekonstruiert.** Der ursprüngliche Großbrief lebte nur
  im Chat-Tab der M04-Erweiterungs-Pflege (PR #86, 2026-05-18) und ist
  beim Tab-Schließen verloren. Diese Datei rekonstruiert ihn aus dem
  Übergabeprotokoll (§ 13 Großbrief vorbereitet) und den drei
  Vision-Ankern (1, 9, 6). Wortlaut kann von der Original-Version
  leicht abweichen, Substanz ist identisch.
