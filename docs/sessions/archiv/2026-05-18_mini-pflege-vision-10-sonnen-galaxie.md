# Mini-Pflege — Vision-Anker Sonnen-Galaxie (Sage-Geschichts-Galerie) als zehnter Anker

**Datum:** 2026-05-18
**Sitzungs-Rolle:** Mini-Pflege (Vision-Anker + Brief für Folge-Bau-Sitzung)
**Branch:** `claude/pflege-vision-10-sonnen-galaxie`

---

## Was getan

### Vision-Anker 10 in PULS.md festgehalten — mid-Pflege re-gerahmt

Neuer Anker „2026-05-18 · Sonnen-Galaxie — Sage-Geschichts-Galerie"
in `docs/PULS.md` § Vision-Anker. **Mid-Pflege inhaltlich neu
gerahmt:** Erste Fassung lief auf „wissenschaftliche Papers-
Bibliothek" mit drei Paper-Galaxien (EN live, DE draft, Synthesis
geplant). Klaus' Re-Definition mid-Pflege: Sonnen-Galaxie soll
**Sage-Geschichts-Galerie** sein, biographisch-erzählerisch,
**Stationen** statt Papers, mit Tonalität „was macht man, wenn man
auf eine Antwort wartet? Man macht sich selber an die Arbeit." Vier
Stationen beim Start: SBKIM-Namensgebung, Zwei Seiten einer Medaille,
Sage-Protokol-Geburt (Pivot von Plattform zu Mycel), Wissenschaftlicher
Niederschlag (EN-Paper). Optik (Sonnen-Karte, Ellipsen-Bahn,
Eigenrotation, Sonnenflecken) blieb vollständig unverändert; nur die
Daten und die Sprache haben sich gewandelt. Anker, Brief und JS-
Skelett wurden in einem Folge-Edit auf das neue Konzept umgeschrieben.

Klaus' O-Ton (Pflege-Sitzung 2026-05-18): „Eine Art Sonne, nicht
so'n komisches schwarzes Loch in der Mitte. Galaxien in Ellipsenform,
drehen sich in liebsten Formen umeinander und auch um sich selber
herum — nicht durcheinander, sondern schön im Kreis. Eher in die
Richtung was macht man, wenn man auf eine Antwort wartet? Man macht
sich selber an die Arbeit."

**Heilige Tafel — Privatheit:** Die Sonnen-Galaxie erwähnt Everlast
GmbH NICHT. Klaus' Wunsch ausdrücklich. Gilt für Code-Kommentare,
Modal-Texte, Platzhalter, Commits, PR-Beschreibungen — und für alle
Folge-Mini-Pflegen, die Stations-Inhalte nachziehen.

Der Anker enthält:

- **Konzept** (Sonnen-Karte + Geschichts-Galerie-Screen, präzise
  visuell)
- **Heilige Privatheits-Tafel** (kein Everlast-GmbH-Bezug)
- **Stationen-Inventar** (4 Galaxien beim Start, 3 text-only mit
  Platzhalter-Inhalt + 1 dokumentengestützt mit EN-Paper-href)
- **Architektur-Skizze** (sieben Eingriffe in `index.html`: CSS-Block
  Sonne, CSS-Block Geschichts-Galerie-Screen, HTML Sonnen-Karte,
  HTML Geschichts-Galerie-Screen, SCREENS-Array, goScreen +
  applyHashScreen, JS-Block mit STATIONS_DATA + setupSonnenGalaxie +
  Modal-Handlers für `text-only` und `live`)
- **Sonnenflecken-Pattern** (drei Spots in 18%/12%/9% Größe,
  unterschiedliche Drift-Animationen 11/9/13 s)
- **Bahn-Mathematik** (gemeinsame Ellipse, Phasen-Verteilung
  `360°/n`, ~50 s Umlaufzeit, Eigenrotation via existierende
  `@keyframes galaxy-spin`)
- **Verbindung zu anderen Vision-Ankern** (Anker 1: Observatorium
  privat → Geschichts-Galerie als öffentliche Reise-Erzählung;
  Anker 9: Station „Zwei Seiten einer Medaille" als biographische
  Quelle für M04-Erweiterung; Schwarz-Loch-Karte als optisches
  Pendant — Sonne erzählerisch, Loch wirbelnd-Lehren)
- **Größenordnung** (~4-5 h Bau-Sitzung, aufteilbar in 10a + 10b)
- **Status** „Reif für Bau-Sitzung mit text-only-Skelett; Stationen
  1–3 warten auf Erzähl-Text per Folge-Mini-Pflegen"

### EN-Paper im Repo eingecheckt

Ordner `docs/papers/` angelegt, Klaus' Upload eingecheckt als
`docs/papers/sbkim-paper-en.html` (23 KB, sieben Sektionen, Titel
„SBKIM: A Protocol for Semantic Bidirectional Matching in Human and
Agent Networks"). Bau-Sitzung kann direkt auf die Datei verweisen
(href in PAPERS_DATA[0]).

### Brief für Bau-Sitzung angelegt — und auf Geschichts-Galerie umgeschrieben

`docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md` — vollständig formuliert,
mit Codeblock zum Kopieren in den ersten Prompt einer neuen Bau-
Sitzung. Erste Fassung als „Papers-Bibliothek"-Brief geschrieben,
dann mid-Pflege auf Klaus' Re-Definition komplett auf Geschichts-
Galerie umgeschrieben. Enthält:

- Pflichtleseliste (CLAUDE.md, PULS § Anker 10, Brief, gezielte
  `index.html`-Stellen als Bau-Referenz)
- Heilige Privatheits-Tafel (Everlast GmbH NICHT erwähnen) im Brief-
  Kopf sichtbar gemacht
- Sieben konkrete Eingriffspunkte mit HTML/CSS/JS-Skelett
- STATIONS_DATA-Array startfertig formuliert (4 Einträge — 3 text-
  only mit Platzhalter-Summaries + EN-Paper als live-Station mit
  href)
- Bewegungs-Mathematik-Skizze (gemeinsame Ellipse, Phasen-Verteilung
  über 4 Stationen)
- Modal-Body-Varianten (`text-only` zeigt nur Summary, `live` zeigt
  Summary + Datei-Link)
- „Was du NICHT tust"-Block (kein Modul-Code, kein Everlast-GmbH-
  Bezug, keine eigenständigen Erzähl-Texte für Stationen 1–3,
  keine Änderung an Observatorium)
- „Pflicht am Ende"-Block (Sichttest, PULS-Eintrag, Übergabe,
  Commit + Push + Draft-PR)
- Blockier-Klausel (anhalten, Frage in PULS § Anker 10 § Status)
- Hinweise außerhalb des Briefes (Mid-Pflege-Re-Framing,
  Privatheits-Klausel, EN-Paper-Status, Demo-Optik-Inspiration)

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
  ist scharf, EN-Paper-Station ist inhaltlich fertig. Klaus wählt
  den Zeitpunkt (4-5 h Aufwand, oder zwei separate Sitzungen
  10a + 10b).
- **Erzähl-Texte für Stationen 1–3** (SBKIM-Namensgebung, Zwei
  Seiten einer Medaille, Sage-Protokol-Geburt) — Klaus liefert per
  einzelner Folge-Mini-Pflegen, jede Mini-Pflege schreibt einen
  `summary` aus, prüft vor Commit dass Everlast GmbH nicht erwähnt
  wird, und switcht den Status der jeweiligen Station von
  `text-only` auf `live`.
- **Weitere Stationen** kommen mit der Zeit — die Bahn-Ellipse
  skaliert ihre Phasen automatisch.

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
