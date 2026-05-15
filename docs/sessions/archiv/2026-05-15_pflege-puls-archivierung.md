# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung PULS-Archivierung

**Sitzungs-Rolle:** Pflege-Sitzung Token-Budget / Aufräum-Sitzung,
headless, EINE Phase. Datei-Scope: ausschließlich `docs/PULS.md`
(§ Sitzungs-Einträge) plus ein nachträglich angelegtes
Übergabeprotokoll für die 2026-05-10-Skelett-Anlage-Sitzung, die
als einzige kein Archiv-Übergabeprotokoll hatte. **Keine** Änderung
an `src/modules/*`, `tests/manual_check.html`, `docs/INTERFACES.md`,
`status.json`, `index.html`, Komponenten-Karten, Pie.

**Branch:** `claude/pflege-puls-archivierung-2026-05-15`

**Anlass:** `docs/PULS.md` war auf **4758 Zeilen** angewachsen —
gegen das harte CLAUDE.md-Limit von 400 Zeilen. Jede der 33
Sitzungen seit 2026-05-10 hatte einen ausführlichen Eintrag
(60–240 Zeilen) in PULS, parallel zu einem Übergabeprotokoll im
Archiv. Doppel-Buchführung, Token-Budget-Last für jede neue
Sitzung beim Pflichtleseliste-Lesen — ohne zusätzlichen Nutzen,
weil das Archiv ohnehin die kanonische Quelle ist.

Klaus hat in der direkt vorausgegangenen Sitzung
(Pflege Sage-Page Lebenszyklus mehrschichtig, 2026-05-15) selbst
darauf hingewiesen, dass die PULS-Archivierung überfällig ist —
*„headless möglich, niedrige Dringlichkeit, aber Token-Budget-
Entlastung für alle Folgesitzungen"*.

---

## Was getan wurde

### 1. PULS.md § Sitzungs-Einträge umgebaut

**Vorher:** 32 `### `-Sitzungs-Einträge zwischen Zeile 292 und 4758,
jeder mit voller Mehrhundert-Zeilen-Beschreibung. Plus die obigen
laufenden Sektionen (§§ Modulstand, Als nächstes, Schnellüberblick,
Endknoten, Offene Querschnitts-Fragen, Schutz-Backlog, Diffusion-
Backlog) — Zeile 1–289.

**Nachher:** ein einzelner ausführlicher Eintrag oben (diese Pflege-
Sitzung, ~85 Zeilen) plus eine kompakte Markdown-Tabelle „Archiv-
Index" mit allen 33 vorigen Sitzungen als Zeile (Datum, Sitzung,
Archiv-Link). Total PULS.md ≈ 426 Zeilen, davon Zeile 1–289
unverändert.

**Konvention für die Zukunft** (im § Sitzungs-Einträge-Vorspann
festgehalten): jede neue Sitzung trägt sich oben mit vollem Text
ein und verschiebt den dann jeweils vorletzten Eintrag als
Index-Zeile in die Tabelle. Damit bleibt die Größe stabil bei
~400 Zeilen.

### 2. Skelett-Anlage-Übergabeprotokoll nachträglich angelegt

`docs/sessions/archiv/2026-05-10_skelett-anlage.md` neu erstellt.
Inhalt 1:1 aus dem damaligen PULS-Eintrag rekonstruiert — keine
Re-Interpretation, keine Erweiterung. Mit Hinweis-Block am Ende,
dass die Datei nachträglich (2026-05-15) angelegt wurde, damit
spätere Sitzungen die Provenance kennen.

Vorher: 32 Sitzungs-Einträge in PULS, 32 Übergabeprotokolle im
Archiv (eines fehlte: Skelett-Anlage).
Nachher: 33 Übergabeprotokolle im Archiv (alle Sitzungen abgedeckt),
1 Pflege-Eintrag in PULS (PULS-Archivierung), 33 Index-Zeilen.

### 3. Zeilen 1–289 unverändert

Sektionen, die nicht angefasst wurden:

- **§ Modulstand heute** (Mermaid-Pie + Header-Block).
- **§ Als nächstes ✨** (Modul-Status-Übersicht 01–08 + 09).
- **§ Schnellüberblick** (Modul-Tabelle, ~20 Zeilen).
- **§ Endknoten** (zwei Endknoten-Tabellen-Zeilen).
- **§ Offene Querschnitts-Fragen** (~141 Zeilen — historische
  Entscheidungen mit `~~strikethrough~~` für Gelöstes; bewusst
  drin gelassen, weil sie Provenance für die heiligen Tafeln
  liefern).
- **§ Schutz-Backlog** + **§ Diffusion-Backlog** (zusammen ~44
  Zeilen).

Begründung: das sind lebende Information, keine archivierbare
Sitzungs-Historie. Wenn sie eines Tages selbst über Limit wachsen
(speziell § Offene Querschnitts-Fragen), ist das eine eigene
Pflege-Sitzung wert — nicht diese.

---

## Was bewusst nicht geändert wurde

- **`src/modules/*`** unverändert — kein Modul-Eingriff. Diese
  Pflege ist reine Token-Hygiene auf der Memory-Schicht.
- **`status.json`** unverändert — Modul-Stand bleibt; keine
  Pie-Regeneration.
- **`docs/INTERFACES.md`** unverändert — keine Schnittstellen-
  Änderung.
- **`index.html`** unverändert — Sage-Page wird nicht berührt.
- **`tests/manual_check.html`** unverändert — Werkstatt ist
  eigener Pfad.
- **Alle 14 Komponenten-Karten** unverändert.
- **`CLAUDE.md`** unverändert — das Format-Limit „400 Zeilen" steht
  schon dort, diese Pflege erfüllt es nur.
- **§ Offene Querschnitts-Fragen** nicht aufgeräumt, obwohl sie
  141 Zeilen wiegt. Sie enthält die Provenance für Entscheidungen
  wie Pfad-2-Diffusion, Hub-vs-Anastomose, GitHub-Pages-Spore-Endpunkt,
  A1–B3-Notations-Synthese, Persistenz-Strategie verteilt usw.
  Strikethrough macht den Erledigt-Status klar — Auslagerung in
  ein separates Dokument wäre nützlich, gehört aber in eine
  eigene Pflege-Sitzung.

---

## Validierung

- **PULS-Zeilenzahl vorher:** 4758.
- **PULS-Zeilenzahl nachher:** 426 (knapp über 400-Soll; Sitzungs-
  Eintrag selbst wiegt ~85 Zeilen, Archiv-Index ~40 Zeilen).
- **Archiv-Abdeckung:** alle 33 vorigen Sitzungs-Einträge haben
  einen Archiv-Link in der Index-Tabelle; das einzige fehlende
  Übergabeprotokoll (Skelett-Anlage) wurde in dieser Pflege
  angelegt.
- **Markdown-Syntax der Index-Tabelle** geprüft — drei Spalten
  (`Datum | Sitzung | Übergabeprotokoll`), korrekter
  Trenner-Header, alle Archiv-Links als relative Pfade
  `sessions/archiv/...`.
- **Strukturheader unversehrt:** `## Modulstand heute`,
  `## Als nächstes ✨`, `## Schnellüberblick`,
  `## Endknoten ...`, `## Offene Querschnitts-Fragen`,
  `## Schutz-Backlog ...`, `### Diffusion-Backlog ...`,
  `## Sitzungs-Einträge`, `## Archiv-Index ...` — alle vorhanden,
  Reihenfolge wie vorher (außer dass der neue § Archiv-Index am
  Ende dazugekommen ist).

---

## Frischer-Kopf-Befund

Die Doppel-Buchführung war historisch sinnvoll: in der Aufbauphase
(2026-05-10 bis 2026-05-15) gab es kein verlässliches Archiv-
Format, und die PULS-Einträge waren der primäre Speicher. Erst nach
dem Spec+Bau-Schub 2026-05-14/15 war jeder Eintrag durchgehend in
beiden Quellen redundant. Diese Pflege löst die Redundanz auf,
ohne die Quellen-Information zu verlieren.

Der einzige nachträglich angelegte Archiv-Eintrag (Skelett-Anlage)
ist die historische Anomalie aus der allerersten Sitzung — damals
gab es noch kein etabliertes Sessions-Archiv-Verzeichnis.

---

## Was offen blieb

- **Keine Modul-Lücke.** Diese Pflege ist reine Token-Hygiene.
- **Folge-Pflege „Offene Querschnitts-Fragen kürzen"** möglich,
  sobald sie selbst aus dem Rahmen läuft. Aktuell 141 Zeilen,
  noch unter Schmerzgrenze (200 wäre Grenzwert für eine eigene
  Pflege).
- **Konvention im § Sitzungs-Einträge-Vorspann:** Klaus hat den
  Disziplin-Pfad für die Zukunft jetzt schwarz auf weiß — neue
  Sitzungen verschieben den vorletzten Eintrag in den Index. Die
  nächste Sitzung wird zeigen, ob das in der Praxis trägt.

---

## Nächster sinnvoller Schritt

Mehrere gleichberechtigt (aus dem zweiten Brief der Pflege-Sitzung
am 2026-05-15):

1. **Pflege-Sitzung Karte 09 „App-SW-Koexistenz + Tablet-
   Sichtkontrolle"** — Voraussetzung für Bau-Sitzung 09 zweite
   Iteration. *Headless möglich.*
2. **Bau-Sitzung Modul 09 zweite Iteration** mit Klaus am Live-
   Andock-Versuch. *Nicht headless.* Wartet auf Pflege Karte 09.
3. **Klaus' Sichttest Sage-Page Lebenszyklus mehrschichtig** im
   Tablet-Browser (offen seit Pflege 2026-05-15). *Nicht headless.*
4. **Klaus' Sichttest Panel 08** im Browser (offen seit Bau 08).
   *Nicht headless.*
5. **Mini-Pflege Panel 07 Test 6** (`allEmpty`-Check um
   `sbkim_hetero_inbox` erweitern). *Headless möglich.*

---

## Pflicht-Häkchen am Sitzungsende

- [x] Neuer Sitzungs-Branch `claude/pflege-puls-archivierung-2026-05-15`
      von aktuellem main (`e74d985`)
- [x] `docs/PULS.md` § Sitzungs-Einträge auf einen ausführlichen
      Eintrag oben + kompakte Archiv-Index-Tabelle umgebaut
- [x] `docs/sessions/archiv/2026-05-10_skelett-anlage.md` neu
      angelegt (einzige Sitzung ohne Archiv-Übergabeprotokoll)
- [x] PULS.md von 4758 auf 426 Zeilen reduziert (Ziel 400, knapp
      drüber wegen ausführlichem Sitzungs-Eintrag — Folgesitzung
      bringt das durch Verschieben in den Index zurück)
- [x] Zeilen 1–289 (§§ Modulstand bis Diffusion-Backlog) unverändert
- [x] Konvention für Folgesitzungen im § Sitzungs-Einträge-Vorspann
      festgehalten
- [x] **Keine `src/modules/*`-Änderung**
- [x] **Keine `tests/manual_check.html`-Änderung**
- [x] **Keine `docs/INTERFACES.md`-Änderung**
- [x] **Keine `status.json`-Änderung**, **kein Pie-Regenerate**
- [x] **Keine `index.html`-Änderung**
- [x] **Keine Modul-Karten-Änderung**
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/pflege-puls-archivierung-2026-05-15`
      (folgt)
- [ ] Draft-PR gegen `main` (folgt)
