# Übergabeprotokoll · 2026-05-18 · Spec — V1 Sage-Hybrid (Brief 01 der V1-Sammelspec-Kaskade)

## Sitzungs-Rahmen

- **Rolle:** Spec-Sitzung (kein Code, kein Modul-Eingriff).
- **Branch:** `claude/spec-v1-sage-hybrid-NEyOX` (Harness-Suffix; im
  Brief als `claude/spec-v1-sage-hybrid` geführt).
- **Auslöser:** Auslöser-Befehl aus dem Chat-Tab (Klaus-Regel
  Kaskaden-Konvention 6, 2026-05-18) plus
  `docs/sessions/BRIEF_01_v1_sage_hybrid.md` als verbindlicher
  Brief-Volltext.
- **Quell-Spec:** `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
  § STRANG 1 (heraus-geschnitten als Brief 01 in der V1-Sammelspec-
  Kaskade — PULS § Archiv-Index „Meta-Pflege · V1-Sammelspec als
  Brief-Kaskade sequenziert").
- **Etappe in der Kaskade:** Brief 01 von 4 (V1 Sage-Hybrid). Folge-
  Stränge: Brief 02 Plattform-Matrix, Brief 03 M04-Erweiterung,
  Brief 04 Multi-Identität, dann BRIEF_99-Abschluss.

## Was getan wurde

### 1. INTERFACES.md — zwei neue Sektionen, eine Nachnummerierung

- **§ 6 Endknoten-Liste** (neu) — Sage als dritter Endknoten neben
  Mein-Rezeptbuch und Mein-Mixarium aufgenommen. Tabelle mit
  Spalten `id` / `domain` / `domainDescription` / `domainKeywords`
  / `domainVector`. Stamm/Gast-Kategorien für Sage disjunkt
  festgelegt (Stamm = Protokoll-Doku / Mycel-Vokabular / Heilige
  Tafeln / Karten / INTERFACES / ARCHITEKTUR; Gast = Glossar-
  Wartung / Schwesternetz-Beobachtungen / Sitzungs-Briefe /
  Übergabeprotokolle). Domäne-Entscheidung **`"Mycel-Bibliothek"`**
  begründet (gesamtes Doku-Korpus, nicht nur Glossar oder Sage-
  Page-Metapher; „SBKIM-Glossar" zu eng, „Sage-Observatorium" zu
  seitenbezogen).
- **§ 6.1 Sage-Endknoten — Sage-Page-Architektur** (neu) —
  verbindliche Architektur-Festlegung für die spätere Sage-Page-
  Refactor-Bau-Sitzung:
  - IndexedDB-Suffix `sbkim_sage` (analog `sbkim_rezeptbuch` /
    `sbkim_mixarium` aus Pflege PWA-Suffix Karten 01+09 vom
    2026-05-16).
  - App-SW Variante 3a (Standalone `sbkim-sw.js` im Sage-Page-
    Root, weil aktuell kein App-SW existiert; analog Karte 09
    § Schritt 3a).
  - Volle init()-Kette `01 → 02 → 03 → 04 → 05 → 07 → 00` beim
    ersten Andocken. Modul 03 Embedding (~30 MB) **lädt lazy** —
    erst beim ersten Andock-Klick, nicht beim Sage-Page-Boot;
    UX-Vorwarnung im Andock-Wizard ist Pflicht.
  - Andock-Geste an der Schwarz-Loch-Karte als Wizard-Hinweis
    (Spec, kein Bau-Detail — Konkret-Umsetzung in der Sage-Page-
    Refactor-Bau-Sitzung).
  - Plattform-Ehrlichkeits-Vorgriff auf Brief 02 als Verweis-
    Stub (kein Vorgriff auf die Matrix selbst).
- **§ 6 Änderungsprotokoll auf § 7 nachnummeriert** — additiv,
  keine Inhalte verschoben oder umgeschrieben. Neuer Eintrag
  „2026-05-18 · Spec-Sitzung V1 Sage-Hybrid (Brief 01)" am Ende
  des Änderungsprotokolls ergänzt.

### 2. status.json — Sage als dritter `endknoten[]`-Eintrag

```json
{
  "name": "Sage",
  "domain": "Mycel-Bibliothek",
  "integrated": false,
  "integratedAt": null,
  "nodeId": null,
  "sporeUrl": "https://lausiklauskn-png.github.io/Sage-Protokol/sbkim/spore.json",
  "stammCategories": ["Protokoll-Doku", "Mycel-Vokabular", "Heilige Tafeln", "Karten", "INTERFACES", "ARCHITEKTUR"],
  "guestCategories": ["Glossar-Wartung", "Schwesternetz-Beobachtungen", "Sitzungs-Briefe", "Übergabeprotokolle"],
  "pingStatus": "pending-first-andock",
  "url": "https://lausiklauskn-png.github.io/Sage-Protokol/"
}
```

- `pingStatus: "pending-first-andock"` als ehrlicher Initialwert
  für „Spec da, Bau ausstehend". Pflege-Konvention der zwei
  Bestands-Endknoten (`pingStatus: "live-direct"` mit echtem
  nodeId nach Andocken) beibehalten — Sage füllt sich nach, wenn
  die Sage-Page-Refactor-Bau-Sitzung läuft.
- **KEIN Score-Schub.** Sage `integrated: false` zählt nicht zum
  Hub-Score; Pie-Block bleibt unverändert; `update_puls_pie.py`
  NICHT aufgerufen (das Skript liest nur `modules` +
  `schutzBacklog` + `diffusionBacklog`, nicht `endknoten`).
- `fullName` und `purpose` umformuliert auf „Hub und Knoten
  zugleich". `lastUpdated` auf `"2026-05-18"`.

### 3. CLAUDE.md § „Was dieses Repo ist" — umgeschrieben

- Satz „Es ist kein Endknoten." entfernt.
- Neuer Eröffnungssatz: „Sage-Protokol ist **Hub und Knoten
  zugleich** … der Spezifikations- und Bau-Hub für alle SBKIM-
  Module **und** ein eigener Endknoten mit eigener Domäne."
- Drei Endknoten gleichwertig gelistet: Rezeptbuch / Mixarium /
  Sage. Sage-Eintrag mit Verweis auf INTERFACES § 6 / § 6.1 und
  auf die Sage-Page-Refactor-Bau-Sitzung in der BRIEF_99-Liste.
- Konventionen § Knotentyp (`hybrid`) bleibt unverändert — wird
  mit dieser Spec wahr.

### 4. Karte 09 § Schritt 1 — erweitert

Der vorgegebene Satz wurde 1:1 übernommen: „Sage-Observatorium
selbst ist auch ein Endknoten — wer sich am Sage-Mycel andockt,
bekommt es als Geschwister." plus Hinweis auf die Folge-Bau-Sitzung
und Verweis auf INTERFACES § 6.1 für die Sage-spezifische Andock-
Architektur. Karten-Schichten Bauzustand / Manueller Test
unangetastet.

### 5. PULS.md — Vision-Anker-Status + Sitzungs-Eintrag

- **Vision-Anker 1 § Status:** vorher „Reif für Spec-Sitzung",
  jetzt „Strang 1 der V1-Sammelspec realisiert (2026-05-18) +
  Verweis auf Brief 02-04 und BRIEF_99-Liste".
- **Neuer Top-Sitzungs-Eintrag** „2026-05-18 · Spec — V1 Sage-
  Hybrid (Brief 01 der V1-Sammelspec-Kaskade)" mit den fünf
  Punkten a–e, heiligen Tafeln, Konsistenz-Prüfungs-Befund (nur
  PR #89 offen, kollidiert nicht), manueller-Sichttest-Status
  („ungeprüft, weil reine Doku-Pflege") und nächstem sinnvollen
  Schritt (Klaus mergt diesen PR, startet Brief 02-Sitzung).
- **Meta-Pflege-Sitzungs-Eintrag** „V1-Sammelspec als Brief-
  Kaskade sequenziert" (vorher oben) **per Konvention ins
  Archiv-Index ausgelagert** als zwei-Sätze-Beschreibung mit
  Link zum bestehenden Übergabeprotokoll
  `docs/sessions/archiv/2026-05-18_meta-pflege-v1-sammelspec-kaskade.md`.
  Sechs heilige Tafeln der Kaskade bleiben über das
  Übergabeprotokoll greifbar.
- PULS-Zeilen-Status: 2765 / 3000 nach diesem Eingriff (Schutz-
  Klausel 2026-05-17 eingehalten, keine Auslagerung weiterer
  Einträge nötig).

### 6. Brief 02 angelegt

`docs/sessions/BRIEF_02_plattform_matrix.md` — STRANG 4 der V1-
Sammelspec herausgeschnitten + dieselbe Bauplan-Struktur wie
Brief 01. Pflichtleseliste umfasst: CLAUDE.md, PULS § Sitzungs-
Einträge (Brief-01-Eintrag als Vorgänger) + § Archiv-Index (Meta-
Pflege-Eintrag) + § Vision-Anker (V1 nach Brief 01 + V4 + V7 + V8),
BRIEF_SPEC_V1_SAMMELSPEC § STRANG 4, Brief 01 als Vorgänger-Beleg,
Brief 02 selbst, INTERFACES (vollständig), Karte 09 (nur lesen).

Kaskaden-Konvention 5 (Vorgänger-Konsistenz-Prüfung) explizit
gefordert: Brief 02 muss prüfen, dass der Brief-01-PR gemerged ist,
dass INTERFACES § 6 / § 6.1 auf dem Brief-01-Stand sind, dass die
Plattform-Matrix-Zeile für Sage den Endknoten-Eintrag aus Brief 01
korrekt spiegelt (NICHT konstruiert) und dass keine Korrekturen an
Brief 01 nötig sind. Brief 02 erbt die PROTOCOL_VERSION-Disziplin
(bleibt 0.1, additiv).

Kaskaden-Konvention 6 (Auslöser-Befehl im Chat statt Brief-Volltext)
propagiert: Brief 02's „Pflicht am Ende" formuliert denselben
Mechanismus für Brief 03.

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Erst dort, dann andere Tafeln —
  Reihenfolge: INTERFACES § 6 + § 6.1 + § 7 → CLAUDE.md → Karte 09
  → status.json → PULS.md → BRIEF_02-Datei.
- **PROTOCOL_VERSION-Disziplin:** bleibt `"0.1"`. Strang 1 ist
  additiv — kein bestehendes Feld zur Pflicht erhoben.
- **Plattform-Ehrlichkeit:** `pingStatus:"pending-first-andock"`
  reflektiert „Spec da, Bau ausstehend"; das Tab-offen-Modell von
  Sage als GitHub-Pages-Statik wird in § 6.1 dokumentiert, ohne
  Brief 02 (Plattform-Matrix) vorzugreifen — nur als Verweis-Stub.
- **Privatheit:** Sage bleibt heute privat (Vision-Anker 9 § Sorge
  ums Freigeben). Lizenz-Frage unberührt.
- **Konsistenz-Prüfung VOR dem Eingriff:** nur PR #89 (Karte 15
  Membran als Stub, Draft) war offen — kollidiert nicht (eigener
  Modul-15-Block in INTERFACES nach Modul 09, weder Endknoten-
  Liste noch Karte 09 § Schritt 1 berührt). `main`-Stand war beim
  PR-#95-Merge („Kaskaden-Konvention 6 refactor"), der Brief-
  Datei-Stand wurde übernommen.

## Was NICHT angefasst wurde

- Modul-Code in `src/` (Spec geht der Implementierung voraus).
- Sage-Page `index.html` (volle init()-Kette + Andock-Wizard sind
  Bau-Sitzung über BRIEF_99-Liste).
- Karte 09 § Schritte 2–9, Bauzustand-Block, Manueller-Test-Block.
- Plattform-Matrix-Volltext in INTERFACES (Brief 02; in § 6.1 nur
  als Verweis-Stub markiert).
- M04-Erweiterung — Spore-Schema, Match-API, Brücken-Feld
  (Brief 03). Karten 02 / 04 / 06 unangetastet.
- Multi-Identität — sbkim_keys-Multi-Slots, active-identity-Marker
  (Brief 04). Karten 02 / 05 / 06 / 07 unangetastet.
- `sbkim-paper-en.html`, `sbkim-paper-de.html`, andere Komponenten-
  Karten (00 / 01 / 03 / 04 / 05 / 06 / 07 / 08 / 14), Modul-Stubs
  Karten 10 / 11 / 12, Diffusion-Karte 14, Sonnen-Galaxie-Daten in
  `index.html`.
- `update_puls_pie.py` (kein Modul-Status-Wechsel; Skript liest
  ohnehin keine `endknoten[]`-Einträge).
- ARCHITEKTUR.md (kein Schnittstellen-Eingriff in Modul-DAG;
  Endknoten-Liste ist Schnittstellen-Schicht, nicht Bau-DAG).

## Was offen blieb (für Folge-Sitzungen)

1. **Brief 02 Plattform-Matrix.** Erste Folge-Sitzung der Kaskade.
   Bauanleitung in `docs/sessions/BRIEF_02_plattform_matrix.md`.
   Setzt diesen PR als gemerged voraus.
2. **Brief 03 M04-Erweiterung.** Wird von Brief-02-Sitzung
   geschrieben (Vorlage aus BRIEF_SPEC_V1_SAMMELSPEC § STRANG 2,
   der engere Bruder-Brief BRIEF_SPEC_M04_ERWEITERUNG nur noch als
   Stil-/Detail-Vorlage).
3. **Brief 04 Multi-Identität.** Wird von Brief-03-Sitzung
   geschrieben.
4. **BRIEF_99_SAMMELSPEC_ABSCHLUSS.** Wird von Brief-04-Sitzung als
   Kaskaden-Schluss geschrieben — Bau-Brief-Liste enumeriert dann
   die Sage-Page-Refactor-Bau-Sitzung, Modul-02-Bau Schichten/
   Needs, Modul-04-Bau Stufe A + Stufe B, Modul-02-Bau Multi-
   Identität.
5. **Sage-Page-Refactor V1** (Bau-Sitzung nach Kaskaden-Abschluss):
   in `index.html` die volle init()-Kette aller SBKIM-Module
   verdrahten (mit lazy Modul 03), Andock-Wizard an der Schwarz-
   Loch-Karte bauen, eigene Spore mit `domainVector` deployen,
   `status.json` § endknoten[`name:"Sage"`] auf `integrated:true`
   + nodeId + `pingStatus` umstellen.

## Nächster sinnvoller Schritt

Klaus mergt diesen PR (damit `docs/sessions/BRIEF_02_plattform_matrix.md`
auf `main` liegt) und startet die Brief-02-Sitzung über den
Auslöser-Befehl in der Chat-Antwort (Kaskaden-Konvention 6).

Alternativ Kaskade pausieren, falls Klaus Sage-Page-Refactor vorab
planen will — aber Brief 02 erbt den hier gesetzten Endknoten-
Eintrag, daher ist die Reihenfolge „Brief 01 mergen, dann Brief 02
starten" der dichteste Pfad.

## Manueller Sichttest

**Ungeprüft, weil reine Doku-Pflege:**

- kein Modul-Code in `src/`
- kein `tests/manual_check.html`-Eingriff
- keine Sage-Page-Änderung
- `status.json`-Schema additiv (drittes `endknoten[]`-Element mit
  bekanntem Schema; `integrated:false` + `nodeId:null` ist die
  Pflege-Konvention für „noch nicht angedockt")
- `update_puls_pie.py` nicht nötig (Pie liest nur `modules` +
  `schutzBacklog` + `diffusionBacklog`)

Klaus kann beim PR-Review die Diff-Tafeln (INTERFACES § 6, § 6.1,
§ 7, CLAUDE.md, Karte 09, status.json, PULS) gegen den Brief-01-
Auftrag prüfen — das ist der echte Sicht-Pfad bei einer Spec-
Sitzung.

## Verlinkte Artefakte

- Brief 01: `docs/sessions/BRIEF_01_v1_sage_hybrid.md`
- Brief 02 (Folge): `docs/sessions/BRIEF_02_plattform_matrix.md`
- Quell-Spec: `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md` § STRANG 1
- Meta-Pflege-Übergabe (Kaskaden-Konvention):
  `docs/sessions/archiv/2026-05-18_meta-pflege-v1-sammelspec-kaskade.md`
- PULS § Vision-Anker 1: „2026-05-17 · Sage als Hybrid-Knoten
  (Variante I)" — Status auf „Strang 1 realisiert" nachgezogen.
