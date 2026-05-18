# Mini-Pflege — Vision-Anker Sonnen-Galaxie (Papers-Bibliothek) als zehnter Anker

**Datum:** 2026-05-18
**Sitzungs-Rolle:** Mini-Pflege (Vision-Anker + Brief für Folge-Bau-Sitzung)
**Branch:** `claude/pflege-vision-10-sonnen-galaxie`

---

## Was getan

### Vision-Anker 10 in PULS.md festgehalten

Neuer Anker „2026-05-18 · Sonnen-Galaxie — Papers-Bibliothek" in
`docs/PULS.md` § Vision-Anker. Konzept: oberhalb der bestehenden
Schwarz-Loch-Karte auf der Sage-Page sitzt eine **Sonnen-Karte** als
optisches Pendant — warm-goldene Korona mit dunklem pulsierenden
Sonnenkern, drei Sonnenflecken in unregelmäßiger Außenform, die
eigenständig pulsieren und driften. Klick öffnet ein **Papers-Galaxie-
Universum**, in dem Papers als Galaxien auf einer **gemeinsamen
Ellipsen-Bahn** mit gleichmäßiger Phasen-Verteilung tanzen und sich
zusätzlich um die eigene Achse drehen — geordneter als die wandernden
Lehre-Galaxien des Observatoriums.

Klaus' O-Ton (Pflege-Sitzung 2026-05-18): „Im Prinzip wie das
Schwarze Loch, nur weiter oben auf der Seite als Vision und für
Neugierige — die Sonne als Lebensgrundlage. Nicht statisch, wächst
mit jeder publizierten Idee. Eine Art Sonne, nicht so'n komisches
schwarzes Loch in der Mitte. Galaxien in Ellipsenform, drehen sich
in liebsten Formen umeinander und auch um sich selber herum — nicht
durcheinander, sondern schön im Kreis."

Der Anker enthält:

- **Konzept** (Sonnen-Karte + Papers-Galaxie-Screen, präzise visuell)
- **Papers-Inventar** (3 Galaxien beim Start: EN live, DE draft,
  Synthesis geplant)
- **Architektur-Skizze** (sieben Eingriffe in `index.html`: CSS-Block
  Sonne, CSS-Block Papers-Screen, HTML Sonnen-Karte, HTML Papers-
  Screen, SCREENS-Array, goScreen + applyHashScreen, JS-Block mit
  PAPERS_DATA + setupPapersGalaxy + Modal-Handlers)
- **Sonnenflecken-Pattern** (Klaus' Detail-Wunsch konkret: drei
  Spots in 18%/12%/9% Größe, unterschiedliche Drift-Animationen
  11/9/13 s)
- **Bahn-Mathematik** (gemeinsame Ellipse, Phasen-Verteilung
  `360°/n`, ~50 s Umlaufzeit, Eigenrotation via existierende
  `@keyframes galaxy-spin`)
- **Verbindung zu anderen Vision-Ankern** (Anker 1: Observatorium
  privat → bedingt auf Papers-Anführung; Anker 9: Synthesis-Paper
  trägt theoretisches Fundament für M04-Erweiterung; Schwarz-Loch-
  Karte als optisches Pendant)
- **Größenordnung** (~5-6 h Bau-Sitzung, aufteilbar in 10a + 10b)
- **Status** „Reif für Bau-Sitzung"

### EN-Paper im Repo eingecheckt

Ordner `docs/papers/` angelegt, Klaus' Upload eingecheckt als
`docs/papers/sbkim-paper-en.html` (23 KB, sieben Sektionen, Titel
„SBKIM: A Protocol for Semantic Bidirectional Matching in Human and
Agent Networks"). Bau-Sitzung kann direkt auf die Datei verweisen
(href in PAPERS_DATA[0]).

### Brief für Bau-Sitzung angelegt

`docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md` — vollständig formuliert,
mit Codeblock zum Kopieren in den ersten Prompt einer neuen Bau-
Sitzung. Enthält:

- Pflichtleseliste (CLAUDE.md, PULS § Anker 10, Brief, gezielte
  `index.html`-Stellen als Bau-Referenz)
- Sieben konkrete Eingriffspunkte mit HTML/CSS/JS-Skelett
- PAPERS_DATA-Array startfertig formuliert
- Bewegungs-Mathematik-Skizze
- „Was du NICHT tust"-Block (kein Modul-Code, kein status.json-
  Zwang, keine Änderung an Observatorium)
- „Pflicht am Ende"-Block (Sichttest, PULS-Eintrag, Übergabe,
  Commit + Push + Draft-PR)
- Blockier-Klausel (anhalten, Frage in PULS § Anker 10 § Status)
- Hinweise außerhalb des Briefes (Klaus' Mid-Sitzungs-Kehrtwende,
  Demo-Optik-Inspiration, Privatheits-Verbindung zu Anker 1)

### PULS-Konvention: PULS-Auslagerung-Eintrag verschoben

Der vorletzte Sitzungs-Eintrag (2026-05-18 · PULS-Auslagerung) wurde
gemäß Klaus' Konvention („pro Sitzung verschiebt vorletzten in
Archiv-Index") aus dem Body entfernt und als neue Top-Zeile im
`§ Archiv-Index` eingefügt. Body-Größe von 2337 → 2560 Zeilen netto
+223 (neuer Top-Eintrag Sonnen-Galaxie ~75 Zeilen + Vision-Anker-10-
Block ~220 Zeilen − PULS-Auslagerung-Body ~68 Zeilen + 1 Archiv-
Index-Zeile). Komfortabel unter der 3000-Zeilen-Schutz-Klausel.

### Zwischenversuch bewusst zurückgerollt

In dieser Sitzung wurde initial — auf Klaus' „bauen jetzt"-Befehl
mitten in der Pflege — ein **CSS-Block für die Sonnen-Karte
testweise in `index.html` eingefügt** (~80 Zeilen, Sonnen-Korona +
Sonnenscheibe-Kern + drei Sonnenflecken-Animationen). Kurz darauf
hat Klaus auf „Briefing für neue Bausitzung" umgeschwenkt — der
CSS-Block wurde **bewusst zurückgerollt**, damit die Bau-Sitzung mit
klarem Auftrag gegen den festen Vision-Anker startet und nicht
mitten in einem Halb-Bau anfängt. Die CSS-Skizze lebt jetzt im
Anker-10-Block „Architektur-Skizze" als Bau-Vorlage weiter — kein
Code-Verlust.

---

## Was NICHT angefasst

- Modul-Code (`src/modules/`)
- `docs/INTERFACES.md`
- Komponenten-Karten
- `index.html` (außer rolliertes CSS-Zwischenversuch — netto unverändert)
- `status.json`
- `tests/manual_check.html`
- `scripts/update_puls_pie.py` NICHT aufgerufen (Pie-Block bleibt
  wie er ist — kein Modul-Status-Wechsel)

---

## Offen geblieben

- **Bau-Sitzung 10** muss noch gezogen werden. Brief liegt, Anker
  ist scharf, EN-Paper ist da. Klaus wählt den Zeitpunkt (5-6 h
  Aufwand, oder zwei separate Sitzungen 10a + 10b).
- **Deutsches SBKIM-Paper** ist noch nicht im Repo — Klaus lädt
  nach. Die Bau-Sitzung baut die DE-Galaxie initial als `draft`
  (sichtbar, aber gedämpft); sobald die Datei kommt, switcht eine
  Folge-Mini-Pflege den Status auf `live`.
- **Synthesis-Paper Mizel + SBKIM** — geplante Zukunft, Klaus
  schreibt es selbst (Geistesarbeit, nicht Bau-Job). Galaxie 3
  startet permanent als `geplant`, bis Klaus die Datei hochlädt.

---

## Nächster sinnvoller Schritt

**Bau-Sitzung Vision-Anker 10 auslösen** — Brief
`docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md` als Codeblock kopieren,
in den ersten Prompt einer neuen Bau-Sitzung pasten, Branch
`claude/bau-vision-10-sonnen-galaxie` vom main aus.

Alternativ — falls Klaus zwischendurch ein **deutsches Paper**
hochlädt — kann eine **Mini-Pflege „DE-Paper einchecken"** vor der
Bau-Sitzung gezogen werden. Dann ist beim Bau die DE-Galaxie bereits
`live`-bereit.

---

## Commit-Plan

- `docs/PULS.md` — Anker 10 Body + Top-Sitzungs-Eintrag + Archiv-
  Index-Zeile für PULS-Auslagerung
- `docs/papers/sbkim-paper-en.html` — neu (Klaus' Upload)
- `docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md` — neu
- `docs/sessions/archiv/2026-05-18_mini-pflege-vision-10-sonnen-galaxie.md` — neu (dieses Protokoll)
