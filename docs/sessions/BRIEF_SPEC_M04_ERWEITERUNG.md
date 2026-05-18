# Brief — Spec-Sitzung M04-Erweiterung · Brücke Paper ↔ Mycel

**Vision-Anker 9**, eingetragen 2026-05-18 in `docs/PULS.md`
§ Vision-Anker. Diese Spec integriert die strukturierten Match-Felder
des ursprünglichen SBKIM-Papers (Plattform-Form, Frühjahr 2026) in die
Mycel-Form von Modul 04 (heute einseitiger Cosinus über ein einzelnes
Spore-Embedding). Klaus' Brainstorming hat die Brücke sichtbar gemacht:
die drei Match-Schichten + Brücken-Feld + volle Bidirektionalität sind
nie verworfen, nur beim Mai-2026-Pivot vereinfacht worden — Anker 9
holt sie ein.

Dieser Brief geht in den **ersten Prompt** der nächsten Spec-Sitzung
als Codeblock.

---

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Branch: claude/spec-09-m04-erweiterung   (vom main aus anlegen)

Sitzungs-Rolle: Spec (kein Code, kein Modul-Eingriff). Du schreibst
die Schnittstellen-Erweiterung in docs/INTERFACES.md und die zwei
Modul-Karten 02 (Spore) + 04 (Match) auf den neuen Stand. Bau läuft
in Folge-Sitzungen, nicht hier.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md § Vision-Anker → "2026-05-18 · M04-Erweiterung — drei
   Schichten + Brücke + doppelte Spore" (Anker 9, vollständig lesen —
   Konzept, Match-Pipeline, Architektur-Skizze, Verbindungen zu V1/V4/V5/
   V6/V7/V8, Modul 06, Historie Paper ↔ Mycel, Größenordnung, Status)
3. docs/sessions/archiv/2026-05-18_mini-pflege-vision-anker-m04-erweiterung.md
   (Übergabeprotokoll der Pflege, die Anker 9 eingetragen hat — bringt
   Kontext und die zwei Brainstorming-Stränge: Paper-↔-Mycel-Brücke
   gefunden, Sorge ums Freigeben dokumentiert)
4. docs/INTERFACES.md (vollständig — das ist die heilige Tafel, du
   editierst sie hier)
5. docs/components/02_spore.md (Spore-Schema, das du erweitern wirst)
6. docs/components/04_match.md (Match-API, die du erweitern wirst)
7. docs/papers/sbkim-paper-en.html § 3.3 "Bidirectional Matching with
   Three Dimensions" (Quell-Spec aus der Plattform-Form, fachlich/
   prozess/skalierung sind dort definiert)

Was du NICHT liest: andere Komponenten-Karten, Modul-Code in src/,
Sage-Page index.html, status.json. Diese Spec lebt rein in INTERFACES
+ Modul-Karten 02 + 04.

Heilige Tafeln:
- INTERFACES ist verbindlich — wenn du eine Schnittstelle änderst,
  ziehst du sie ZUERST dort nach, DANN die Modul-Karten. Andersrum
  produziert Widersprüche.
- PROTOCOL_VERSION-Disziplin: Bleibt 0.1, solange alte Sporen (nur
  embedding-Feld) weiter akzeptiert werden. Wird das alte Feld
  zwingend, dann Minor-Bump auf 0.2. Entscheide das in der Spec
  explizit und begründe.
- Anti-Missbrauch: Brücken-Vorschlag bleibt LOKAL (kein Spore-Leak
  auf Drittknoten). Schreib das als Spec-Klausel, nicht als
  Implementierungs-Detail.

Deine Aufgabe heute:

Integriere die drei Bausteine des ursprünglichen SBKIM-Pitches in die
Mycel-Form:

  1. Drei-Schichten-Bewertung (fachlich/prozess/skalierung) statt
     Single-Score
  2. Brücken-Feld (was würde es vollständig machen) mit Anschluss an
     Modul 06 Heterokaryose
  3. Doppelte Spore (capabilities + needs auf beiden Seiten)

Plus die zweistufige Match-Pipeline:

  - Stufe A: lokal, kostenlos, WebGPU-Embedding → Cosinus pro
    Dimension → { fachlich, prozess, skalierung }-Vektor + overall.
    Erweitert das heute schon vorhandene match().
  - Stufe B: optional, LLM-Call mit User-eigenem API-Key, gibt
    Erklärung + Brücken-Vorschlag zurück. Pattern: claude-sonnet-4,
    max_tokens ~1024, JSON-only-Output, strenge Validation. Opt-in
    pro Knoten. Pattern-Quelle: Layer-1-Demo der SBKIM-Plattform-
    index.html (im Paper-Repo, nicht hier — du brauchst die Datei
    nicht lesen, das Pattern wird vom Spec her abgeleitet).

Konkret zu schreiben:

A) docs/INTERFACES.md erweitern um:

   1. Spore-Schema (Modul 02) — zweites Embedding-Feld:
      - embedding wird als embeddingCapabilities akzeptiert (alter Name
        bleibt lesbar)
      - embeddingNeeds neu, additiv, optional (alte Sporen bleiben
        gültig — embeddingNeeds = null oder fehlend ist OK)
      - Beide Embeddings sind float32-Arrays gleicher Dimension
        (heute 384)
      - Definiere PROTOCOL_VERSION-Verhalten: 0.1 solange embeddingNeeds
        optional ist; 0.2 erst, wenn embeddingNeeds Pflicht wird (Anker 9
        Stufe-B-Auflage)

   2. Match-API (Modul 04) — drei neue Funktionen plus Beibehaltung
      der alten:
      - match(query, passage) -> number    (alte Signatur bleibt
        wortwörtlich, kein Bruch für 06/07/08)
      - matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds)
        -> { fachlich, prozess, skalierung, overall }     (neu, additiv)
      - explainMatchLLM(matchResult, apiKey)
        -> Promise<{ schichten: {...}, bruecke: string|null,
                     erklaerung: string }>                 (Stufe B)
      - isAboveProviderThreshold(score)              (bleibt erhalten)

   3. Schichten-Definition (heilige Tafel, drei Achsen orthogonal):
      - fachlich: Domain-Match (was kannst du / was suchst du
        inhaltlich)
      - prozess: Arbeitsweise (Rhythmus, Methodik, Verbindlichkeit)
      - skalierung: Größenebene (einzelner Knoten / Cluster / Netz)

   4. Brücken-Feld-Spec:
      - Format: { needed: string, lookingFor: string|null,
                  candidateScope: 'lokal'|'mailbox'|'netz' }
      - candidateScope='lokal' = Brücken-Vorschlag bleibt im
        Knoten-Anzeigefenster, keine Netz-Aktion
      - candidateScope='mailbox' = Anker an Modul 13 (Königin-Relay,
        falls vorhanden) für asynchronen Knoten-C-Hinweis
      - candidateScope='netz' = NOCH NICHT DEFINIERT (für später,
        wenn Anti-Spam-Schicht steht — Anker 10/11/12-Schutz-Backlog)

   5. Schwellen:
      - PROVIDER_MIN_MATCH=0.80 bleibt für overall
      - Pro Dimension: SCHICHT_MIN_MATCH=0.60 (Brücke darf in einer
        Dimension scheitern; reine 1-Dimension-Lücke ist der häufige
        Brücken-Anlass)
      - Zwei oder mehr Dimensionen unter SCHICHT_MIN_MATCH = Apoptose
      - Falls Stufe-B-Erklärung den Brücken-Vorschlag begründet, gewinnt
        sie gegen die Dimensions-Schwelle (Erklärung schlägt
        Zahl — Stufe B ist semantisch reicher)

B) docs/components/02_spore.md erweitern:
   - Schema-Erweiterung dokumentieren (embeddingCapabilities +
     embeddingNeeds)
   - Migrations-Pfad für alte Sporen (embeddingNeeds=null bleibt
     Spore-gültig, signalisiert „nur Anbieter-Modus")
   - Verweis auf Anker 9 und Anker 6 (Multi-Identität: doppelte Spore
     pro Persona)

C) docs/components/04_match.md erweitern:
   - matchDimensions-Spec
   - explainMatchLLM-Spec mit:
     - LLM-Pattern (claude-sonnet-4, max_tokens, JSON-only)
     - User-Key-Handling: Spec sagt „Key kommt aus Container, niemals
       aus plain IndexedDB"; konkrete Container-Spec bleibt Anker 5
     - Fehlertoleranz: LLM-Call darf scheitern, Match fällt dann auf
       Stufe-A-Resultat zurück; Knoten-Anzeige zeigt „Erklärung nicht
       verfügbar"
     - Rate-Limit-Awareness: Spec erwähnt, dass Stufe B teuer ist;
       Aufrufer (heterokaryose, ui_demo) drosseln selbst, nicht das
       Match-Modul
     - Schema des Antwort-JSON (für strenge Validation)
   - Beispiel-Output für eine Match-Sitzung mit zwei Personas

D) Plattform-Ehrlichkeits-Klausel als eigenes § in INTERFACES:
   - Stufe B ist opt-in, kein Knoten ist gezwungen, einen
     Drittanbieter-API-Key zu hinterlegen
   - Stufe A bleibt rückgrat-tragend lokal
   - Knoten ohne Stufe B sind vollwertige Netz-Teilnehmer

E) Verbindungs-Pfade in INTERFACES eintragen (Querbezug, nicht
   Spec der anderen Anker selbst):
   - V1 (Hybrid): Hybrid-Knoten ist Träger von Stufe B
   - V4 (Königin-Relay): candidateScope='mailbox' nutzt Relay
   - V5 (Identitäts-Container): API-Key liegt im Container
   - V6 (Multi-Identität): doppelte Spore pro Persona
   - V7 (Extension) + V8 (Mini-Browser): Träger des Stufe-B-Calls
   - Modul 06 (Heterokaryose): Brücken-Feld als Trigger für aktive
     Vermittlung — heterokaryose-outbox bekommt einen Eintrag-Typ
     "Brücken-Vorschlag" (Spec nennt das, Bau passiert in
     Folge-Sitzung)

Was du NICHT tust:

- Kein Modul-Code in src/modules/04_match.js oder 02_spore.js.
  Spec geht der Implementierung voraus — Bau läuft in Folge-Sitzung.
- Keine Sage-Page-Änderungen. UI-Anzeige (drei Schicht-Lampen +
  Brücken-Slot) wird in einer eigenen Bau-Sitzung gebaut, nicht in
  der Spec.
- Keine Stufe-B-Prompt-Konstruktion in Code-Form. Spec definiert das
  Antwort-JSON-Schema und das Verhaltens-Modell; der konkrete Prompt
  ist Bau-Detail.
- Keine status.json-Änderung. Modul 04 bleibt im Status, wo es heute
  steht (siehe PULS-Pie); Spec-Reife hebt den Score nicht.
- Keine Lizenz-Entscheidung. Klaus' Sorge ums Freigeben (Public-
  Schalten) ist im Anker-9-Übergabeprotokoll dokumentiert, bleibt
  aber offen. Spec rührt das nicht an.

Pflicht am Ende:

- docs/INTERFACES.md auf neuem Stand (Spore-Schema, Match-API,
  Schwellen, Brücken-Feld, Plattform-Ehrlichkeit, Querbezüge)
- docs/components/02_spore.md auf neuem Stand
- docs/components/04_match.md auf neuem Stand
- PULS.md neuer Sitzungs-Eintrag oben (vorletzten ins Archiv-Index
  schieben — Konvention der PULS-Auslagerung).
- Vision-Anker 9 § Status nachziehen: "Reif für Spec-Diskussion" →
  "Spec realisiert in PR #<nummer>; Bau-Sitzungen Stufe A + Stufe B
  als Folge-Mini-Pflegen".
- Übergabeprotokoll in
  docs/sessions/archiv/2026-05-XX_spec-09-m04-erweiterung.md.
- Commit + Push auf claude/spec-09-m04-erweiterung + Draft-PR.
- "Vorgeschlagene nächste Schritte"-Block am Sitzungs-Ende im Chat
  (2-4 priorisierte Schritte — typisch: Bau Stufe A erweitert als
  ~2-3 h Mini-Bau, Bau Stufe B als ~5-8 h, Sage-Page-Karte-Erweiterung
  als ~3-5 h, Migrations-Pflege Spore-Schema ~2 h).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS.md ans Ende von
  Anker 9 § Status. Klaus klärt in der nächsten Sitzung.

Zeitschätzung: 3-5 Stunden für die volle Spec. Aufteilbar in zwei
Sitzungen, falls die erste zu lang wird:
- Spec 09a (~2 h): Spore-Schema + Match-API + Schwellen (INTERFACES
  + Modul-Karten 02 + 04, ohne Stufe B)
- Spec 09b (~2-3 h): Stufe B (LLM-Call-Spec, Antwort-JSON-Schema,
  Plattform-Ehrlichkeit, Container-Anschluss, Brücken-Feld-
  Vollausbau)
```

---

## Hinweise außerhalb des Briefes (Hauptsitzung-Kontext)

- **Geschichtlicher Bogen.** Der ursprüngliche SBKIM-Pitch (Plattform-
  Form, Frühjahr 2026) hatte die drei Schichten + das Brücken-Feld als
  **Kern-Innovation** — siehe `docs/papers/sbkim-paper-en.html` § 3.3.
  Beim Pivot zur Mycel-Form (Mai 2026, dieses Repo) wurde Modul 04
  bewusst vereinfacht (Cosinus + Schwelle), um zuerst die Infrastruktur
  (Storage, Spore, Embedding, Anastomose, Apoptose) tragfähig zu
  bekommen. Anker 9 holt die strukturierte Tiefe ein — kein neues
  Konzept, sondern Wiedereinholung einer impliziten Vision.

- **„Die beiden SBKIM" (Klaus' Begriff).** Klaus benennt zwei
  Inkarnationen unter demselben Namen — die **Mycel-Form** (dieses
  Repo, MiZell-Prinzip) und die **Paper-Form** (Plattform-Pitch,
  bidirektionales KI-Matching mit drei Dimensionen). Diese Spec ist
  ihre Brücke.

- **Spec geht Bau voraus.** Anker 9 lebt formal in einer Spec-Sitzung,
  nicht in einer Bau-Sitzung. Stufe A erweitert (~2-3 h) kann **auch
  ohne V1** als Mini-Pflege gezogen werden, falls Klaus das vorziehen
  will — sie braucht nur die Spec-Sitzung als Voraussetzung. Stufe B
  wartet zusätzlich auf V1 (Hybrid-Knoten als Träger) und Anker 5
  (Identitäts-Container für Key-Speicher).

- **Größerer Bogen — V1-Sammelspec.** Anker 9 ist im Anker-Eintrag
  als „integraler Teil von V1-Sammelspec" markiert. Wenn Klaus später
  die V1-Sammelspec (mehrtägig, Scope: V1 + Anker 9 + Anker 6 + Plattform-
  Matrix) auslöst, ist diese M04-Spec dort schon vorbereitet — die
  Sammelspec kann die hier geschriebene INTERFACES-Erweiterung
  übernehmen, nicht neu definieren.

- **Lizenz/Freigabe-Sorge.** Klaus' Brainstorming hat auch die Sorge
  vor Public-Schalten geäußert (CC-BY-NC vs AGPL vs MIT, Spore-Leak-
  Risiken). Diese Spec rührt das nicht an — Sage ist heute privat,
  kein konkreter Druck. Anti-Missbrauch-Klausel im Spec (Brücken-
  Vorschlag lokal) ist Anti-Spore-Leakage, nicht Lizenz-Schutz.
