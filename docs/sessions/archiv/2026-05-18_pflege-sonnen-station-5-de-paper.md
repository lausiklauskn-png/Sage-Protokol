# Mini-Pflege — Sonnen-Galaxie um Station 5 (DE-Paper) erweitert

**Datum:** 2026-05-18
**Sitzungs-Rolle:** Mini-Pflege (Folge nach PR-#92-Merge)
**Branch:** `claude/bau-vision-10-sonnen-galaxie-JxoIH` (auf
`origin/main` rebased; PR #91 + #92 in der Historie)

---

## Was getan

### Klaus' Upload und Entscheidung

Klaus hat das deutsche SBKIM-Paper als HTML-Datei hochgeladen
(eigenständig, mit eingebautem Print-zu-PDF-Button via
`window.print()`). Auf die Frage „PDF oder HTML mit Print-Button
lassen?" hat Klaus geantwortet: lassen wie es ist — der Print-Button
erzeugt die PDF on-demand im Browser. Konsistent zum englischen
Paper, das denselben Mechanismus trägt.

Auf die Frage „5. Station mit eigener Galaxie oder neben EN auf
Station 4?" hat Klaus geantwortet: **5. Station mit eigener
Galaxie**. Saubere Symmetrie, Bahn-Ellipse skaliert automatisch
auf 72° pro Station.

### Was in `index.html` geändert wurde

- `STATIONS_DATA` um fünften Eintrag erweitert:
  - `idx: 4`
  - `status: 'live'`
  - `shape: 'galaxy-quasar'` (visuell auffällige Lichtstrahl-Beams
    — passt zum „wissenschaftlichen Niederschlag")
  - `size: 'large'` (parallel zu Station 4)
  - `title: 'Wissenschaftlicher Niederschlag — SBKIM-Paper (DE)'`
  - `tag: 'Station 5'`
  - `summary: ...` (parallel zur EN-Beschreibung, in deutscher
    Tonalität, plus Hinweis auf den Print-zu-PDF-Knopf)
  - `href: 'docs/papers/sbkim-paper-de.html'`
- Bewegungs-Mathematik unverändert — die Phasen-Verteilung erfolgt
  automatisch über `STATIONS_DATA.length` (5 Stationen → 72° pro
  Galaxie).

### Was an Dateien neu im Repo ist

- `docs/papers/sbkim-paper-de.html` — Klaus' Upload eingecheckt;
  vollständige deutsche Übersetzung des englischen Papers, sieben
  Sektionen, eingebauter „Als PDF speichern"-Button (gleicher
  Mechanismus wie EN-Paper).
- `docs/sessions/archiv/2026-05-18_pflege-sonnen-station-5-de-paper.md`
  (diese Datei).

### Was in PULS.md geändert wurde

- § Anker 10 § Stationen-Inventar: Überschrift „4 Galaxien" auf
  „5 Galaxien"; neue Zeile für Station 5 (DE-Paper).
- § Anker 10 § Status: Realisiert-Vermerk um Station-5-Ergänzung
  + 72°-Phasen-Verteilung erweitert.
- § Sitzungs-Einträge: neuer Top-Eintrag (diese Pflege); vorherige
  Mini-Pflege (Stationen 1–3 inhaltlich gefüllt) in den Archiv-
  Index ausgelagert.

### Was in `docs/papers/README.md` geändert wurde

- Einleitungssatz von „eine Datei" auf „zwei Dateien".
- Neue Tabellen-Zeile für `sbkim-paper-de.html` → Station 5 →
  `STATIONS_DATA[4]`.

## Privatheits-Klausel

Pre-Commit-Grep `grep -i everlast` auf:
- `index.html`
- `docs/papers/sbkim-paper-de.html`
- `docs/PULS.md`
- `docs/papers/README.md`
- Dieser Session-Protokoll-Datei
- Commit-Message

Alle Treffer sind ausschließlich Meta-Verweise auf die Klausel
selbst (PULS § Anker 10 § Heilige Tafel definiert sie). Der Inhalt
des DE-Papers ist wissenschaftlicher Protokoll-Vorschlag ohne
kommerziellen Kontext — keine Erwähnung irgendwelcher Firmen-Namen
im Paper-Body, sondern nur Forschungs-Bezüge (Pinecone, LangChain,
MCP/Anthropic etc., die für die Wissenschaftshistorie nötig sind).

## Format-Entscheidung „HTML statt PDF"

Sowohl das englische als auch das deutsche Paper haben einen
eingebauten `window.print()`-Knopf am unteren Rand. Das Browser-
Print-Dialog erzeugt das PDF on-demand mit der `@media print`-CSS
des Papers (kein Schatten, weißer Hintergrund, kein Print-Button
im PDF selbst). Vorteil:

- **Eine Quelle pro Sprache** — kein Drift zwischen HTML- und
  PDF-Version.
- **Größenvorteil im Repo** — HTML ist deutlich kleiner als PDF
  und versioniert sauber als Diff.
- **Aktualisierungen kostenlos** — Klaus oder eine Pflege-Sitzung
  passt das HTML an, PDF folgt automatisch.

## Manueller Sichttest

**Offen** — Klaus prüft im Browser auf:
- `http://localhost:8000/#sonnen` (Termux-Server) oder
- `https://lausiklauskn-png.github.io/Sage-Protokol/#sonnen` (nach
  Pages-Deploy)

…dass:

- Fünf Galaxien statt vier auf der gemeinsamen Ellipsen-Bahn
  tanzen, gleichmäßige Phasen-Verteilung à 72°.
- Die neue Quasar-Galaxie (Station 5) klickbar ist und ihr Modal
  den DE-Paper-Summary plus „Original-Dokument öffnen →"-Link
  zeigt.
- Der Print-Knopf im DE-Paper das Browser-Druck-Dialog öffnet
  (PDF on-demand).

## Nächster sinnvoller Schritt

Klaus' Sichttest abnehmen. Wenn nötig, optische Schärfung der
Quasar-Galaxie oder Sortierung der Stationen — sonst Themen-
Abschluss.
