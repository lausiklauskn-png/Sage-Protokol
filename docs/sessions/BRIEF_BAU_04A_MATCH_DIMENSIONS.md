# Brief — Bau-Sitzung 04.A Stufe A erweitert in Modul 04 (`matchDimensions` sync)

**Bau-Sitzung** (kein Spec — Brief 03 der V1-Sammelspec-Kaskade hat
`matchDimensions` vollständig in INTERFACES § 1 Modul 04 + § 0 + § 2
+ § 7 + § 8 spezifiziert). Voraussetzung: Brief 03 (PR #98 gemerged
2026-05-19, `main` `27d6a19`), Brief 99 (PR #100, `main` `80994fd`),
Bau 02.Y (PR #104, `main` `63e8fd1`), Pflege Modul 01 (PR #107,
`main` `b9e1a8f`), Sichttest-Nachzug (PR #108, `main` `af4fdff`)
gemerged.

Dieser Brief geht in den **ersten Prompt** der nächsten Bau-Sitzung
als Codeblock.

---

```
Du bist eine Bau-Sitzung in Sage-Protokol — Bau 04.A Stufe A
erweitert in Modul 04 (`matchDimensions` synchron).

Branch: claude/bau-04a-match-dimensions   (vom main aus anlegen)

Sitzungs-Rolle: Bau (kein Spec — Brief 03 hat alles in INTERFACES
spezifiziert; Karte 04 § Drei-Schichten-Modell / § Brücken-Feld-Spec
/ § Schwellen-Vertrag / § Stufe-B-Vertrag schon nachgezogen). Du
implementierst nur `matchDimensions` und die Stufe-A-Hilfsfunktionen.
**`explainMatchLLM` ist Bau 04.B** — eigene Folge-Sitzung mit eigenem
Brief. Bau 04.A baut KEINEN LLM-Call, KEINEN Netz-Pfad.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
   - § Heilige Tafeln § Tafel-Evolutions-Klausel — die Folge-Pflege-
     Konvention. Falls du während des Baus auf eine Tafel-Spannung
     stößt: Klaus EXPLIZIT auf Anpassungs-Bedarf hinweisen, NICHT
     stoisch befolgen oder stillschweigend umgehen.
2. docs/PULS.md
   - § Sitzungs-Einträge: oberster Eintrag „Pflege Modul 01 `init()`
     versions-fail-soft" (live-bewiesen 2026-05-19), zweiter Eintrag
     „Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump" mit dem
     Klaus-freundlichen Ergebnis
   - § Vision-Anker 9 (M04-Erweiterung) § Status für den Kontext
3. docs/INTERFACES.md
   - § 0 Globale Konstanten — SCHICHT_MIN_MATCH (0.60),
     PROVIDER_MIN_MATCH (0.80), STUFE_B_DEFAULT_MODEL,
     STUFE_B_MAX_TOKENS
   - § 1 Modul 04 (Match) — VOLLER Vertrag: Bietet-Block,
     MatchDimensionsResult-Form, Nutzt-Block, Selbstcheck,
     Fehlerverhalten, Garantien
   - § 1 Modul 04 § Drei-Schichten-Modell (orthogonale Schichten
     fachlich/prozess/skalierung, Lane-Berechnung, Mittelwert vs.
     Min, Nur-Anbieter-Modus)
   - § 1 Modul 04 § Brücken-Feld-Spec (`BridgeProposal` —
     für Bau 04.B Relevanz, hier nur Lese-Stoff)
   - § 1 Modul 04 § Schwellen-Vertrag (PROVIDER_MIN_MATCH=0.80 für
     overall, SCHICHT_MIN_MATCH=0.60 pro Dimension, 2+ Dimensionen
     unter Schwelle = Apoptose, Stufe-B-Übersteuerung)
   - § 7 LLM-Stufe-B-Ehrlichkeits-Klausel (Kontext für Bau 04.B —
     hier nur sicherstellen, dass Bau 04.A das nicht stört)
   - § 8 Anti-Missbrauch-Klausel (Brücken-Vorschlag bleibt lokal —
     hier nur Kontext)
4. docs/components/04_match.md (Karte 04) — du erweiterst § Bauzustand
   + § Manueller Test
5. src/modules/04_match.js — du erweiterst den Code

Was du NICHT liest: andere Modul-Karten (00/01/02/03/05/06/07/08/09);
Sage-Page index.html; Briefe 01-04 / 99 (Stand ist in INTERFACES
gespiegelt); BRIEF_BAU_02Y / BRIEF_BAU_PFLEGE_01_INIT_FAIL_SOFT
(gemerged, historisch).

Heilige Tafeln (Bau-04A-spezifisch):

- **INTERFACES verbindlich.** Modul 04 Bietet-Block + Storage-Block +
  Fehler-Block + Garantien-Block sind in INTERFACES § 1 Modul 04
  BEREITS gespiegelt (durch Brief 03, gemerged 2026-05-19). Du ziehst
  NUR die Geprüft-Zeile um „2026-05-XX (Bau 04.A `matchDimensions`
  sync)" nach + § 10 Änderungsprotokoll-Zeile. KEIN Vertrags-Eingriff
  in Bietet/Storage/Fehler/Garantien — sonst Vertrags-Drift gegen
  Brief 03.

- **`explainMatchLLM` ist Bau 04.B.** KEIN LLM-Call, KEIN Netz-Pfad
  in Bau 04.A. Funktion bleibt im Modul-Code NICHT EXISTENT (oder als
  Stub mit `throw new Error("Bau 04.B"). Empfehlung: nicht
  vorhanden). Auch `BridgeProposal` lebt in Modul 04, aber wird nur
  durch `explainMatchLLM` befüllt — in Bau 04.A reine
  Vertrags-Definition (kein Code).

- **`matchDimensions` ist deterministisch + reproduzierbar.** Reine
  Funktion: drei Cosinus-Aufrufe (queryCap × passageCap,
  queryNeeds × passageNeeds, queryCap × passageNeeds — drei
  orthogonale Schichten; siehe § Drei-Schichten-Modell für die
  exakte Zuordnung) + gewichteter Mittelwert für `overall`.
  KEIN RNG, kein Zeit-Effekt, kein Promise, kein async.

- **`Nur-Anbieter-Modus`.** Wenn eine Seite vollständig null ist
  (z.B. `queryCap === null && queryNeeds === null`), liefert
  `matchDimensions` `{fachlich:null, prozess:null, skalierung:null,
  overall:null, availableLanes:0}` — KEIN Throw. Aufrufer entscheidet,
  ob er auf `match()` zurückfällt.

- **`DimensionsAllNullError` synchron** wenn ALLE VIER Vektoren null
  sind — vorher hat der Aufrufer Pflicht-Vor-Check zu machen.

- **`MatchDimensionsResult`-Form aus INTERFACES** verbindlich:
  ```
  {
    fachlich:    number | null,    // [-1, 1] oder null
    prozess:     number | null,
    skalierung:  number | null,
    overall:     number | null,    // gewichteter Mittelwert; null wenn alle Schichten null
    availableLanes: 0 | 1 | 2,     // bidirektionale Lane-Anzahl
    bruecke:     null              // Bau 04.A liefert IMMER null; BridgeProposal kommt in Bau 04.B
  }
  ```

- **Vertrags-Synchronisation mit Modul 03 ist Pflicht.** Modul 03
  garantiert L2-Norm 1.0 auf den Embedding-Vektoren — Modul 04
  vertraut darauf, prüft die Norm NICHT im Hot-Path. `matchDimensions`
  setzt das genauso fort: Eingaben werden auf `Float32Array(384)`
  oder `null` geprüft (siehe § Fehlerverhalten), nicht auf L2-Norm.

- **Bestehende Funktionen unangetastet.** `match`,
  `isAboveProviderThreshold` bleiben in ihrer bestehenden Form gültig
  (Rückwärts-Kompat). Selbstcheck-Zeile bleibt unverändert (sie nennt
  nur `match/isAboveProviderThreshold` und die Schwelle — Brief 03 hat
  KEINE Selbstcheck-Erweiterung spezifiziert, weil `matchDimensions`
  + `explainMatchLLM` als API-Erweiterung nicht zwingend in der
  Selbstcheck-Zeile erscheinen müssen). **Bonus-Vorschlag (optional):**
  Selbstcheck-Zeile auf vier Funktionen erweitern, wenn der Bau-
  Befund sauberer wirkt; KEIN Bruch der Konvention. **Bei Erweiterung:
  Karte 04 § Selbstcheck-Zeile mitnachziehen.**

- **`PROTOCOL_VERSION` bleibt `"0.1"`, `DB_VERSION` bleibt `4`,
  `BACKUP_FORMAT_VERSION` bleibt `2`.** Modul 04 ist zustandslos —
  kein Storage, kein Spore-Feld, kein DB-Eingriff. Reine Code-
  Erweiterung in `src/modules/04_match.js`.

Deine Aufgabe heute — sechs Punkte a–f:

a) **docs/INTERFACES.md** zwei kleine Nachzieh-Eingriffe (KEIN
   Vertrags-Eingriff in Bietet/Storage/Fehler/Garantien — das ist
   Brief 03, gemerged):
   - § 1 Modul 04 Geprüft-Zeile (aktuell: 2026-05-14 (Spec+Bau 04) +
     Pflegen) um „2026-05-XX (Bau 04.A `matchDimensions` sync)"
     erweitert.
   - § 10 Änderungsprotokoll um eine neue Zeile „2026-05-XX · Bau-
     Sitzung 04.A `matchDimensions` synchron in Modul 04" erweitert.

b) **docs/components/04_match.md (Karte 04)** zwei Sub-Sektionen:
   - § Manueller Test um drei neue Knöpfe erweitert (siehe Punkt d).
   - § Bauzustand neue Zeile „Bau 04.A `matchDimensions` sync
     2026-05-XX".

c) **src/modules/04_match.js** erweitern (additiv, kein Refactoring
   der bestehenden `match` + `isAboveProviderThreshold`):

   - **Neue Konstante `SCHICHT_MIN_MATCH = 0.60`** modul-lokal
     gespiegelt aus §0 (Brief 03; bestehende `PROVIDER_MIN_MATCH =
     0.80`-Konstante unverändert).

   - **Neue Fehler-Factory `DimensionsAllNullError`** (sync, von
     `matchDimensions` bei allen vier null). Factory-Stil analog Modul
     02 / 08 (`name`-Property gesetzt, deutschsprachige `message`,
     `cause` optional).

   - **Helper `cosineSafe(a, b)`** (intern, sync): wrapper um den
     bestehenden `match`-Pfad mit null-Check. Liefert `null`, wenn
     `a === null || b === null`; sonst delegiert an `match(a, b)`.
     Begründung: drei Aufrufe brauchen den null-Check sowieso; ein
     interner Helper hält `matchDimensions` lesbar.

   - **Neue Funktion `matchDimensions(queryCap, queryNeeds,
     passageCap, passageNeeds)`** synchron:
     1. **Vor-Check:** alle vier null → `DimensionsAllNullError`
        SYNCHRON werfen.
     2. **Eine Seite vollständig null** (queryCap === null && queryNeeds
        === null ODER passageCap === null && passageNeeds === null) →
        return `{fachlich:null, prozess:null, skalierung:null,
        overall:null, availableLanes:0, bruecke:null}` (Nur-Anbieter-
        Modus, KEIN Throw).
     3. **Schicht-Berechnung** (gemäß INTERFACES § Drei-Schichten-
        Modell — die exakte Zuordnung der drei Schichten zu den
        Vektor-Paaren steht dort. Skizze:
        - `fachlich = cosineSafe(queryCap, passageCap)` (Was kann
          Knoten A vs. was kann Knoten B)
        - `prozess = cosineSafe(queryNeeds, passageNeeds)` (Was
          sucht A vs. was sucht B)
        - `skalierung = cosineSafe(queryCap, passageNeeds)` (Was
          kann A vs. was sucht B — Brücken-Pfad)
        Die genaue Mapping-Konvention liest du in der Karte 04 nach.
        WENN die Karte da widerspricht oder unklar ist: **HALTE AN
        + Tafel-Spannung melden, NICHT raten.**
     4. **`availableLanes`-Berechnung:** Anzahl der nicht-null
        Schichten. Spec-konform: 0 / 1 / 2 / 3 (Karte 04 erwähnt
        0/1/2 — wenn das ein Tippfehler ist und tatsächlich 0-3
        gemeint sind: Tafel-Spannung melden).
     5. **`overall`-Berechnung:** gewichteter Mittelwert der
        nicht-null Schichten. Karte 04 § Drei-Schichten-Modell trägt
        die Gewichtung — wenn dort „Mittelwert vs. Min begründet"
        steht, ist der Mittelwert verbindlich; bei mehr als der Hälfte
        null wird overall null. Konkrete Lese-Pflicht: in Karte 04
        nachlesen.
     6. Return `MatchDimensionsResult` mit `bruecke: null` (Bau 04.B
        füllt das).

   - **Export `matchDimensions` + `SCHICHT_MIN_MATCH` +
     `DimensionsAllNullError`** in `window.SbkimMatch.<...>`.

   - **`_meta`** um neue Anker erweitern:
     `_meta.schichtMinMatch: SCHICHT_MIN_MATCH` und
     `_meta.matchDimensionsLanes: ["fachlich", "prozess", "skalierung"]`
     (Read-Anker für Tests).

   - **Selbstcheck** OPTIONAL erweitert auf vier Funktionen
     (`match/isAboveProviderThreshold/matchDimensions` plus
     `explainMatchLLM` — letzteres ist Bau 04.B, kann hier mitgenommen
     ODER weggelassen werden). **Empfehlung:** nur `match/
     isAboveProviderThreshold/matchDimensions` (drei Funktionen),
     `explainMatchLLM` kommt mit Bau 04.B. **Bei Erweiterung Karte 04
     § Selbstcheck mitnachziehen.**

   - **Modul-Kopfkommentar** um Pflege-Block am Ende erweitern: „Bau
     04.A `matchDimensions` synchron (2026-05-XX): drei orthogonale
     Schichten + gewichteter overall + availableLanes. KEIN
     `explainMatchLLM` (Bau 04.B). `BridgeProposal`-Feld bleibt
     `null`. Spec-Quelle Brief 03 (PR #98)."

   - `node --check src/modules/04_match.js` muss grün sein.

d) **tests/manual_check.html Panel 04** um drei Knöpfe erweitern:
   - **Knopf 6 „matchDimensions bidirektional"** — Setup: zwei
     384-dim Float32Array-Vektoren via SbkimEmbedding (z.B.
     `Käsekuchen` als queryCap, `Käsetorte` als queryNeeds,
     `Kochrezepte` als passageCap, `Backen` als passageNeeds). Aufruf
     `matchDimensions(...)`. Erwartung: `fachlich`, `prozess`,
     `skalierung` alle drei nicht-null in [0.5, 1.0], `availableLanes:
     3` (falls 3 Schichten realisiert; sonst 2), `overall` als
     gewichteter Mittelwert, `bruecke: null`.
   - **Knopf 7 „matchDimensions Nur-Anbieter-Modus"** — eine Seite
     mit beiden Vektoren `null`. Erwartung: `{fachlich:null,
     prozess:null, skalierung:null, overall:null, availableLanes:0,
     bruecke:null}` — KEIN Throw.
   - **Knopf 8 „matchDimensions alle vier null (Fehler erwartet)"** —
     Aufruf mit allen vier null. Erwartung: `DimensionsAllNullError`
     SYNCHRON geworfen (kein Promise-Aufbau, try/catch außerhalb
     `await`); `name`-Property gesetzt, sprechende Message.
   - Alle 10 Inline-`<script>`-Blöcke in
     `tests/manual_check.html` syntaktisch validiert (`node --check`
     pro extrahiertem Block).

e) **Optional: Smoke-Test mit `fake-indexeddb` NICHT NÖTIG**, weil
   `matchDimensions` zustandslos + reine Funktion ist (kein
   IndexedDB-Zugriff). Stattdessen: **Smoke-Test als reine Funktions-
   Probe in Node 22** ohne fake-indexeddb. Datei:
   `tests/smoke_bau04a_match_dimensions.mjs`. Drei Proben:
   - Probe 1: alle vier 384-dim Float32Arrays mit L2-Norm 1.0 (z.B.
     einer-Hot mit Norm 1, oder zufällig + normalisiert) →
     deterministisches Ergebnis, alle drei Schichten in [-1, 1],
     `availableLanes: 3`, `overall` gleicht der Gewichtungs-Formel.
   - Probe 2: eine Seite null (queryCap=null, queryNeeds=null) →
     Nur-Anbieter-Resultat, `availableLanes: 0`.
   - Probe 3: alle vier null → `DimensionsAllNullError` SYNCHRON
     geworfen.

f) **Übergabeprotokoll** in
   `docs/sessions/archiv/2026-05-XX_bau-04a-match-dimensions.md`
   (Format BRIEFING_TEMPLATE.md § C Bau-Sitzung). Inhalt: alle sechs
   Punkte a–f plus Heilige-Tafeln-Eingehalten-Block plus „Was NICHT
   angefasst"-Block plus „Nächster sinnvoller Schritt"-Block mit
   Verweis auf Brief BAU_04B (`explainMatchLLM` + User-Key-
   Verwaltung) als nächste Etappe.

Was du NICHT tust:

- **Kein `explainMatchLLM`-Aufruf.** Funktion bleibt im Modul-Code
  nicht existent (oder als sprechender Stub mit `throw new
  Error("Bau 04.B")`). Bau 04.B ist eigene Sitzung mit eigenem Brief.
- **Kein `BridgeProposal`-Code.** `bruecke:` bleibt `null` im
  MatchDimensionsResult.
- **Kein Netz-Pfad.** Modul 04 ist zustandslos + lokal.
- **Kein Modul-01/02/03/05/06/07/08-Eingriff.**
- **Kein `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.**
- **Keine Sage-Page-Änderung.**
- **Keine CLAUDE.md-/Karte-09-/`status.json`-Änderung.**
- **Kein `update_puls_pie.py`-Aufruf** — Modul 04 ist bereits
  `score:"fertig"`; `matchDimensions` ist additive Erweiterung,
  kein Score-Wechsel.
- **Kein L2-Norm-Check im Hot-Path** — Modul 04 vertraut Modul 03's
  Norm-Garantie (Karte 04 § Risiken).

Pflicht am Ende deiner Sitzung:

1. Übliche Sitzungs-Disziplin nach CLAUDE.md § Pflicht am Sitzungsende:
   - INTERFACES.md zwei kleine Eingriffe (§ 1 Modul 04 Geprüft-Zeile,
     § 10 Änderungsprotokoll).
   - Karte 04 zwei Sub-Sektionen nachgezogen (§ Manueller Test + §
     Bauzustand).
   - PULS.md § Sitzungs-Einträge: neuer Top-Eintrag „Bau 04.A
     `matchDimensions` sync in Modul 04" mit Punkten a–f, Heilige-
     Tafeln-Block, Was-NICHT-angefasst-Block, Sichttest-Vermerk.
   - Vorletzten Sitzungs-Eintrag ins Archiv-Index auslagern
     (Konvention pro Sitzung).
   - PULS § Vision-Anker 9 § Status um „Bau 04.A `matchDimensions`
     sync 2026-05-XX abgeschlossen" erweitern.
   - Manueller Sichttest **erwartet** (CLAUDE.md § Pflicht 3): drei
     neue Panel-04-Knöpfe in `tests/manual_check.html`. Klaus prüft
     im Browser, dass (i) bidirektionaler Pfad alle drei Schichten
     liefert, (ii) Nur-Anbieter-Modus `availableLanes: 0` ohne
     Throw, (iii) alle vier null `DimensionsAllNullError` synchron.
     **Headless-Bau ist OK** — Vermerk „ungeprüft, weil headless,
     wartet auf Klaus' Browser-Lauf" ist zulässig.
   - Übergabeprotokoll
     `docs/sessions/archiv/2026-05-XX_bau-04a-match-dimensions.md`.
   - Commit + Push auf `claude/bau-04a-match-dimensions`.
   - Draft-PR „Bau 04.A `matchDimensions` synchron in Modul 04".

2. „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende (CLAUDE.md § Pflicht 5): zwei bis vier priorisierte
   Folge-Trigger als Markdown-Liste. Empfehlung:
   - **Klaus' Browser-Sichttest der drei neuen Panel-04-Knöpfe**
     (nicht headless, wartet auf Klaus).
   - **Brief `BAU_04B` schreiben** (Meta-Pflege, ~45 min): Stufe B
     `explainMatchLLM` + User-Key-Verwaltung aus Brief 03 / § Stufe-
     B-Vertrag. Eigene Folge-Sitzung mit eigenem PR.
   - **Bau 05.Y transparenter Slot-Pfad in Modul 05** als
     paralleler Trigger (unabhängig von 04.A/B; nutzt Bau 02.Y).

Wenn du blockierst:

- HALTE AN. Schreibe die offene Frage in PULS § Sitzungs-Eintrag
  „Bau 04.A abgebrochen" ans Ende. Klaus klärt in der nächsten
  Sitzung.
- Wahrscheinliche Stolperfallen:
  - **Schicht-Mapping-Ambiguität:** wenn Karte 04 § Drei-Schichten-
    Modell die Zuordnung der drei Vektor-Paare zu den Schichten
    fachlich/prozess/skalierung NICHT eindeutig benennt, ist das
    eine Tafel-Spannung. NICHT raten — Klaus EXPLIZIT auf
    Anpassungs-Bedarf hinweisen (Tafel-Evolutions-Klausel,
    CLAUDE.md § Heilige Tafeln).
  - **`availableLanes`-Range:** wenn Karte 04 0/1/2 nennt aber drei
    Schichten implementiert werden, ist 3 ein logischer Wert. Wenn
    das ein Tippfehler ist: Tafel-Spannung melden + Empfehlung
    machen.
  - **`overall`-Gewichtung:** wenn Karte 04 keine konkrete Formel
    nennt (z.B. „gewichteter Mittelwert" ohne Gewichte): Empfehlung
    1:1:1-Mittelwert (alle drei Schichten gleich gewichtet) und in
    Karte 04 nachziehen, ODER Tafel-Spannung melden.

Zeitschätzung: 2–3 Stunden für Bau + Karten-Nachzug + Test-Panel +
Übergabeprotokoll + Smoke-Test. Wenn das Schicht-Mapping in der
Karte unscharf ist, kann es länger werden — dann lieber Tafel-
Spannung melden statt durchforcen.
```

---

## Hinweise außerhalb des Briefes (Meta-Sitzung-Kontext)

- **Auslöser dieser Bau-Sitzung:** Brief 99-Pipeline. Nach Bau 01.Y
  + Bau 02.Y + Pflege Modul 01 + Sichttest-Nachzug (PRs #102 / #104 /
  #107 / #108 alle gemerged) ist `matchDimensions` die nächste
  unabhängige Etappe.

- **Spec-Quelle Brief 03 (PR #98 gemerged 2026-05-19):**
  `matchDimensions` ist vollständig in INTERFACES § 1 Modul 04 +
  § 0 (Konstanten) + § 7 (LLM-Ehrlichkeits-Klausel) + § 8 (Anti-
  Missbrauch) spezifiziert. Karte 04 § Drei-Schichten-Modell + §
  Brücken-Feld-Spec + § Schwellen-Vertrag + § Stufe-B-Vertrag
  sind ebenfalls nachgezogen. Bau 04.A muss nur den Code für
  `matchDimensions` (sync, Stufe A) liefern.

- **PR-Pipeline-Stand:** Brief 99 → Bau 01.Y ✓ → Bau 02.Y ✓ →
  Pflege Tafel-Evolution ✓ → Brief Pflege 01-init ✓ → Pflege Modul
  01 ✓ → Sichttest-Nachzug ✓ → **Brief BAU_04A (dieser PR)** →
  eigene Bau-Sitzung → Brief BAU_04B → Bau 04.B → Bau 05.Y / 06.Y /
  07.Y → Endknoten-Migration.

- **`PROTOCOL_VERSION` bleibt `"0.1"`**, **`DB_VERSION` bleibt `4`**,
  **`BACKUP_FORMAT_VERSION` bleibt `2`**. Reine zustandslose
  Code-Erweiterung in Modul 04.

- **Manueller Sichttest:** drei neue Panel-04-Knöpfe (bidirektional /
  Nur-Anbieter / DimensionsAllNullError). Klaus' Browser-Lauf prüft
  das nach Bau-Sitzung. Headless-Bau ist zulässig.

- **Auslöser-Befehl im Chat (Kaskaden-Konvention 6):** der Volltext
  des Briefes oben ist im Repo (diese Datei). Klaus tippt am
  Sitzungs-Start nur den kurzen Auslöser-Befehl mit Verweis auf die
  Brief-Datei.
