# Übergabeprotokoll · 2026-09-04 · Paper A, englische Fassung gegengelesen

**Rolle:** Bausitzung · **Zweig:** `claude/paper-a-english-review-p0koqn`
**Auftrag:** die englische Fassung von Paper A gegen die deutsche lesen. Sie war
von niemandem außer der Sitzung vom 2026-09-03 gesehen worden und trägt bereits
einen DOI. Die Funde erst vollständig sammeln und vorlegen, **bevor** eine neue
Fassung gebaut wird.

---

## Was getan wurde

**An den beiden Paper-Dateien wurde nichts geändert.** Das war die Vorgabe: eine
Änderung an einer veröffentlichten Datei ist bei Zenodo eine neue Version, und
das entscheidet Klaus. Entstanden sind stattdessen

| Datei | Was drin steht |
|---|---|
| `docs/papers/GEGENLESEN_EN_2026-09-04.md` | die Fundliste, 19 Punkte in drei Gruppen, jeder mit Zeilenangabe in beiden Dateien |
| `tests/smoke_paper_a_parallel.mjs` | Wächter: die beiden Sprachfassungen in derselben **Gestalt** |
| `tests/gegenprobe_paper_a_parallel.mjs` | neun eingebaute Fehler, jeder muss den Wächter umwerfen |

## Gemessen

| | |
|---|---|
| DE / EN | **1.834** / **1.775** Zeilen |
| Überschriften | **90 : 90**, gleiche Reihenfolge, 0 Abweichung |
| Abschnitte mit abweichender Absatz-Blockzahl | **0 von 90** |
| Tabellenzeilen und Listenpunkte je Abschnitt | in allen 90 gleich |
| interne Querverweise | **25 verschiedene**, jeder gleich oft |
| ISO-Daten | **16 : 16**, deckungsgleich |
| `npm test` | **93 Proben — 93 grün, 0 rot, 0 nicht lauffähig** |
| `gegenprobe_paper_a.mjs` | 18 von 18 gefangen · 0 durchgerutscht · 0 tote Anker |
| `gegenprobe_paper_a_parallel.mjs` | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |

Alle Rückgabewerte **ohne Pipe** abgefragt (`> datei; echo $?`). Die Falle ist in
dieser Woche zweimal zugeschnappt.

Die Rechnungen in 3.9 sind nachgerechnet und gehen auf: 1.572 − 714 = 858
(45,4 %) · 1.000.000/204 ≈ 4.900 · 15 × 204 = 3.060 · 0,00102/0,000025 = 40,8 → 41
· gecacht 4,08 → 4 · 5,00/0,0153 = 327 · 1,67/0,0153 = 109 · Erstlösung
30/50/70 % → 2,40/2,00/1,60 Runden → 17/20/33 % weniger.

## Die Funde in einem Satz je Gruppe

- **A (6 Punkte):** die englische Fassung weicht ab — Literaturverzeichnis anders
  sortiert · vierter Arm heißt `R+G+F` statt `R+G+Rück` · „nachziehen" als „bring
  along" · „Zuschnitt" dreimal verschieden · „vorzeigen" als „produced on demand"
  · ein „therefore" in der Zusammenfassung, das im Deutschen fehlt.
- **B (8 Punkte):** Fehler in der **deutschen** Fassung, die die englische nicht
  hat — sieben Satzzeichen- und Numerusfehler und ein Grundsatz, der zweimal
  verschieden zitiert wird (`darf` / `muss`).
- **C (4 Punkte):** Befunde in **beiden** Fassungen — die Korrektur 47 % → 45 %
  ist an einer Stelle nicht nachgezogen · „Zwei Dinge bleiben stehen", und es
  folgen drei · 4.4 steht im Präsens und meint den Zustand vor dem 2026-08-23 ·
  das durchgerechnete Beispiel nennt die Regel bei ihrem zurückgezogenen Wortlaut.

Wortlaut, Zeilenangaben und die Begründung je Punkt: `docs/papers/GEGENLESEN_EN_2026-09-04.md`.

## Der Wächter, und warum er die Gestalt misst und nicht die Wörter

Ein Wortlaut-Wächter verböte bei einem **übersetzten** Text die Übersetzung
selbst und, schlimmer, jede spätere Berichtigung. Genau dieser Fehler steht in
Paper A als Befund (3.2): der Kimhub-Wächter verlangte die Zeichenfolge
`KEINE WERKZEUGE` und hielt elf Tage lang die Regel am Leben, die falsch
geworden war — grün die ganze Zeit.

Gemessen wird deshalb nur Sprachunabhängiges: Zahl und Ebenen-Folge der
Überschriften · je Abschnitt Absatz-Blöcke, Tabellenzeilen, Listenpunkte ·
Querverweise · ISO-Daten · und dass beide HTML-Fassungen **denselben** DOI
tragen.

**Die Gegenprobe ist selbst gegengeprüft.** Eine Zusicherung des Wächters wurde
von Hand blind gemacht (Bedingung fest auf `true`); die Gegenprobe meldete
daraufhin genau ihren Fall als NICHT GEFANGEN, Rückgabewert 1. Danach byte-gleich
zurückgeschrieben, `md5sum` vor und nach dem Eingriff identisch. Ohne diesen
Handgriff wäre „9 gefangen" nur ein grüner Haken.

## Nebenbei erledigt

- **Kimhub PR #75** (Regel 6) auf Klaus' Wort aus dem Entwurf geholt und gemergt
  (Squash, `d5e1314`). Er trug 1093 grün und Gegenprobe 421/0/0.
- **Der Zenodo-Eintrag ist laut Klaus aktualisiert:** Version `1.0`, Titel
  einsprachig. ⚠ **Nicht nachgeprüft** — zenodo.org und doi.org antworten aus
  dieser Umgebung mit 403. Die Angabe steht hier, weil sie von Klaus kommt, nicht
  weil sie gemessen wäre.

## Was NICHT geprüft ist

- **Kein Browser-Sichttest, kein PDF.** Die PDFs bei Zenodo liegen nicht im
  Depot. Ob eine Berichtigung deren Seitenumbruch verschiebt, ist ungeprüft;
  `tools/paper-umbruch-pruefen.mjs` und `tools/paper-seiten-messen.mjs` liegen
  bereit. Die HTML-Fassungen sind unverändert und deshalb weiter deckungsgleich
  mit ihrem Markdown (`smoke_paper_a.mjs` grün).
- **Kein Abgleich mit dem Zenodo-Eintrag** (403).
- **Die Sachaussagen sind nicht gegen die Quellen geprüft.** Ob Kant, Kohlberg,
  Tyler, Gneezy/Rustichini und Kaplow richtig wiedergegeben sind, ist nicht
  nachgeschlagen. Geprüft ist, dass **beide Fassungen dasselbe sagen**.
- **Kein englischer Stil-Durchgang.** Gesucht wurde nach Aussage-Verschiebungen,
  nicht nach schöneren Formulierungen.
- **Kein Briefkasten-Signal.** Diese Sitzung hat keinen Andock-Bezug;
  `sbkim/SIGNAL.json` bleibt unangetastet. Ein `seq`+1 ohne Inhalt wäre ein
  Signal, hinter dem nichts steht.
- **Kein Modul-Code, kein `status.json`, kein Pie-Block** angefasst.

## Offen

- **Die 19 Funde sind unentschieden.** Klaus entscheidet, welche davon in eine
  Berichtigung gehen und ob daraus eine neue Zenodo-Version wird. **Beide
  Sprachfassungen liegen unter demselben DOI** — eine Berichtigung an nur einer
  Datei ist trotzdem eine neue Version des Werks.
- **Der Wächter fängt A1 nicht** (Reihenfolge des Literaturverzeichnisses). Eine
  Prüfung darauf wäre heute rot, weil die Abweichung besteht. Sie gehört
  nachgetragen, sobald A1 entschieden ist — ein rotes Depot legt die Gegenproben
  still, und das ist der eigentliche Preis einer roten Probe.
- **PULS:** 2.163 → **2.249** Zeilen, **751** Zeilen Luft bis zur Grenze.
  Auslagern ist kein Thema.

> ⚠ **Hier stand zuerst „2.240 Zeilen, 760 Luft".** Das war geschätzt, bevor der
> Eintrag geschrieben war — `wc -l` sagt 2.249. Dieselbe Falle wie am 2026-09-03:
> eine Zahl im Text, die von der Länge eines noch nicht geschriebenen Textes
> abhängt, ist keine Messung, auch wenn sie wie eine aussieht. Nachgemessen und
> berichtigt.
