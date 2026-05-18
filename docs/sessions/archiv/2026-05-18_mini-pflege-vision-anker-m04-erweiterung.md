# Mini-Pflege 2026-05-18 — Vision-Anker M04-Erweiterung als neunter Anker

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-vision-anker-m04-erweiterung`. Brainstorming-Sitzung mit
Klaus, zwei Stränge: (1) Paper-↔-Mycel-Brücke gefunden, (2) Sorge ums
spätere Freigeben thematisiert.

---

## 1. Was geschah

Klaus hat in der Brainstorming-Sitzung die **Brücke zwischen SBKIM-
Paper (Plattform-Form, Frühjahr 2026) und Mycel-Form (dieses Repo)**
sichtbar gemacht. Das Paper trägt drei Match-Schichten + Brücken-Feld
+ volle Bidirektionalität als Kern-Innovation; die Mycel-Form von
Modul 04 nutzt heute nur einseitigen Cosinus-Vergleich. Diese
Vereinfachung war beim Pivot Mai 2026 bewusst — zuerst Infrastruktur
tragfähig bekommen —, aber die strukturierte Tiefe ist im Repo nirgends
verankert. Anker 9 holt sie ein.

Parallel: Klaus' Sorge vorm späteren Public-Schalten (Lizenz, Lecken).
Sage ist heute privat, kein konkreter Druck. Lizenz-Entscheidung
(CC-BY-NC vs AGPL vs MIT) bleibt offen.

Klaus' Entscheidung am Ende des Brainstormings (per AskUserQuestion):
**A + B kombiniert**:
- **A — heute:** Mini-Pflege als neunter Vision-Anker (kein Code-Eingriff)
- **B — als Großbrief vorbereiten:** für mehrtägige V1-Sammelspec mit
  erweitertem Scope (V1 + Anker 9 + Anker 6 Multi-Identität + Plattform-
  Matrix Browser/DEX/Tablet/PWA/Mini-Browser/Extension)

## 2. Konzept — Anker 9 M04-Erweiterung

Modul 04 hat heute:

```
match(queryVec, passageVec) -> number   // Cosinus-Ähnlichkeit
isAboveProviderThreshold(score) -> bool // PROVIDER_MIN_MATCH=0.80
```

Eine Spore trägt ein einzelnes Embedding. Vorauswahl ist ehrlich, aber
strukturarm: kein Aufschluss, kein Brücken-Vorschlag, kein Gegenseitigkeits-
Test.

**Drei Bausteine aus dem Paper für die Mycel-Form:**

1. **Drei-Schichten-Bewertung** (fachlich / prozess / skalierung) statt
   Single-Score. Orthogonal, jede liefert eigenen Score + Begründung.
2. **Brücken-Feld** — „was würde es vollständig machen". Anknüpfung an
   Modul 06 Heterokaryose: Brücken-Feld kann aktive Vermittlung anstoßen.
3. **Doppelte Spore** — capabilities + needs auf beiden Seiten. Modul 02
   bekommt zweiten Embedding-Slot, Modul 04 prüft beide Richtungen.

## 3. Match-Pipeline (Vision)

- **Stufe A — lokal, kostenlos** (heute schon da, leicht erweitert):
  WebGPU-Embedding → Cosinus pro Dimension → `{ fachlich, prozess,
  skalierung }` statt einer Zahl. Score < Schwelle → Apoptose.
- **Stufe B — optional, LLM, User-eigener API-Key** (neu): bei Score ≥
  Schwelle Claude-API-Call mit Erklärung + Brücken-Vorschlag. Pattern
  übernimmt Layer-1-Demo der Plattform-`index.html` (claude-sonnet-4,
  max_tokens ~1024, JSON-only). Opt-in pro Knoten.

## 4. Architektur-Skizze

- **Modul 02 Spore-Schema:** zweites Embedding-Feld (`embeddingNeeds`
  parallel zu `embedding`). Additiv — alte Sporen bleiben gültig.
- **Modul 04 API:**
  - `match()` bleibt erhalten (alte Aufrufer)
  - `matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds)
    -> { fachlich, prozess, skalierung, overall }` neu, additiv
  - `explainMatchLLM({…}, apiKey) -> Promise<{ schichten, bruecke,
    erklaerung }>` — Stufe B, optional, fehlertolerant
- **Sage-Page:** Match-Karte zeigt drei Schicht-Lampen + Brücken-Slot
- **Anti-Missbrauch:** Brücken-Vorschlag bleibt lokal (kein Spore-Leak
  auf Drittknoten)

## 5. Verbindungen zu anderen Vision-Ankern

- **V1 (Hybrid-Knoten):** drei Schichten + Brücke gehören **integraler
  Teil der V1-Spec**, nicht separat. Hybrid ist der natürliche Ort für
  Stufe-B.
- **V4 (Königin-Relay):** Brücken-Vorschlag kann Knoten C vermitteln —
  Königin-Mailbox als Transport.
- **V5 (Identitäts-Container):** API-Key gehört in verschlüsselten
  Container.
- **V6 (Multi-Identität):** doppelte Spore **pro Persona**.
- **V7 (Extension):** drei Schichten + Brücke im Popup-Detailfenster.
- **V8 (Mini-Browser):** natürlicher Träger der LLM-Stufe-B-Calls
  (Tray-Modus, App-Daten-Key-Speicher).
- **Modul 06 (Heterokaryose):** Brücken-Feld als Anlass für aktive
  Vermittlung.

## 6. Historie — Paper ↔ Mycel

Der SBKIM-Pitch (Plattform-Form, Frühjahr 2026) trug drei Schichten +
Brücken-Feld als Kern-Innovation (Paper Section 3.3 „Bidirektionales
Matching mit drei Dimensionen"). Pivot zur Mycel-Form (Mai 2026, Beginn
dieses Repos) hielt Modul 04 bewusst minimal — Cosinus + Schwelle —, um
zuerst die Infrastruktur (Storage, Spore, Embedding, Anastomose,
Apoptose) tragfähig zu bekommen. Die strukturierte Tiefe blieb als
**implizite Vision** im Paper; Anker 9 macht sie explizit.

Die Layer-1-Demo der Plattform-`index.html` enthält bereits einen
funktionierenden LLM-Call mit JSON-only-Output und strenger Validation —
dieses Pattern wird in Stufe B übernommen.

## 7. Größenordnung

- Spec ~3-5 h (Schema-Erweiterung Modul 02, API Modul 04,
  Stufe-B-Prompt-Design)
- Bau Stufe A erweitert (dimensions-Aufschlüsselung): ~2-3 h
- Bau Stufe B (LLM-Call + Validation + Fehlerbehandlung): ~5-8 h
- Sage-Page-Karten 04 + Match-Demo: ~3-5 h
- Migrations-Pflege Spore-Schema: ~2 h

## 8. Was eingetragen

- **`docs/PULS.md` § Vision-Anker** um neunten Anker erweitert:
  „M04-Erweiterung — drei Schichten + Brücke + doppelte Spore" mit
  Konzept, Match-Pipeline, Architektur-Skizze, Verbindungen,
  Historie, Größenordnung, Status.
- **`docs/PULS.md` § Vision-Anker Anker 7 Status** ergänzt: Verweis
  „Anschluss an Anker 9".
- **`docs/PULS.md` § Vision-Anker Anker 8 Status** ergänzt: Verweis
  „natürlicher Träger der LLM-Stufe-B-Calls" + Wechsel „Acht"→„Neun".
- **`docs/PULS.md` § Sitzungs-Einträge** neuer Top-Eintrag (PR-#85-
  Eintrag ausgelagert ins Archiv-Index, Übergabeprotokoll bleibt
  unverändert).
- **Dieses Übergabeprotokoll.**

## 9. Was NICHT angefasst

- Modul-Code (`src/modules/04_match.js`, `src/modules/02_spore.js`) —
  Anker 9 ist Vision, kein Bau
- `docs/INTERFACES.md` — Schema-Erweiterung wartet auf V1-Spec
- Modul-Karten `docs/components/02_spore.md`, `docs/components/04_match.md`
- Sage-Page `docs/sage_page/index.html`
- `data/status.json` (kein Score-Wechsel)
- `update_puls_pie.py` (kein Pie-Update nötig)

## 10. Plattform-Ehrlichkeit

Stufe B (LLM-Call) braucht User-eigenen API-Key. Wer keinen hat,
bleibt bei Stufe A — kein Knoten ist gezwungen, Drittanbieter zu
nutzen. Stufe A bleibt rückgrat-tragend lokal.

## 11. PULS-Zeilen-Status

- Sitzungsstart: 3105 Zeilen
- Nach Edits: 3254 Zeilen (+149)
- Aufschlüsselung:
  - Anker 9 selbst: +130 (dauerhaft)
  - Sitzungs-Eintrag dieser Pflege: +78
  - PR-#85-Sitzungs-Eintrag ausgelagert: −75
  - Schluss-Satz-Ergänzungen Anker 7+8: +14
  - Archiv-Index neuer Eintrag: +1
  - Header/Whitespace: +1
- 3254 liegt deutlich über der 3000er-Schutz-Klausel. **Dezidierte
  Auslager-Sitzung** mehrerer älterer Sitzungs-Einträge wird zur
  nächst-priorisierten Mini-Pflege.

## 12. Sorge ums Freigeben (dokumentiert, nicht gehandelt)

Klaus hat im Brainstorming-Strang die Sorge vor Public-Schalten
geäußert (Lizenzwahl, Lecken). Sage ist heute privat — kein konkreter
Handlungsdruck. Lizenz-Entscheidung (CC-BY-NC vs AGPL vs MIT) bleibt
offen für eine spätere Sitzung beim Public-Schalten. Diese Mini-Pflege
ändert nichts daran.

## 13. Großbrief vorbereitet (Teil B)

Klaus möchte die V1-Sammelspec als mehrtägige Sitzung führen — Scope
erweitert um:

- V1 (Sage als Hybrid-Knoten — der ursprüngliche V1-Brief)
- Anker 9 (M04-Erweiterung — diese Pflege)
- Anker 6 (Multi-Identität / Mehrfach-Sporen-Identität)
- Plattform-Matrix (Sporen-Verhalten in Desktop-Browser / DeX-Tablet /
  PWA-installiert / Mini-Browser / Extension)

Der Brief liegt am Chat-Tab der heutigen Sitzungs-Antwort als
Codeblock zur Auslösung vor. Klaus entscheidet, wann er Zeit hat —
**läuft nicht automatisch**.

## 14. Nächster sinnvoller Schritt

Klaus entscheidet (siehe Chat-Antwort am Sitzungs-Ende). Drei Pfade:

1. V1-Sammelspec auslösen (Großbrief kopieren, mehrtägig)
2. Auslager-Sitzung mehrerer alter Sitzungs-Einträge (PULS unter 3000)
3. Pause (neun Anker reichen erstmal)
