# Gegenlesen der englischen Fassung von Paper A · 2026-09-04

**Was geprüft wurde:** `rules-and-principles-in-ai-agent-systems.md` (1.775 Zeilen)
gegen `regeln-und-grundsaetze-in-ki-agentensystemen.md` (1.834 Zeilen), Stand
`origin/main` `919ad6e`.

**Warum es diese Datei gibt:** die englische Fassung war von niemandem außer der
Sitzung gesehen worden, die sie geschrieben hat, und trägt bereits einen DOI
(10.5281/zenodo.22286072, in beiden Dateien). **An den Papers wurde in dieser
Sitzung nichts geändert.** Eine Änderung an einer veröffentlichten Datei ist bei
Zenodo eine neue Version; das entscheidet der Betreiber.

⚠ **zenodo.org und doi.org sind aus dieser Umgebung gesperrt (403).** Keine
Aussage in dieser Datei ist am Zenodo-Eintrag geprüft. Der DOI ist aus den
beiden HTML-Dateien gelesen, nicht aufgelöst.

---

## Was nicht abweicht — gemessen, nicht durchgesehen

Diese Zahlen stehen zuerst, weil ohne sie unklar bliebe, wie weit die Prüfung
überhaupt reichte.

| Geprüft | Ergebnis |
|---|---|
| Überschriften, Zahl und Reihenfolge | **90 : 90**, 0 Abweichung |
| Abschnitte mit abweichender Absatz-Blockzahl | **0 von 90** |
| Tabellenzeilen je Abschnitt | in allen 90 gleich |
| Listenpunkte je Abschnitt | in allen 90 gleich |
| interne Querverweise (1.1 … 7.9) | **25 verschiedene, jeder gleich oft** |
| Datumsangaben im ISO-Format | **16 : 16**, deckungsgleich |
| weitere Datumsangaben (`10.03.`, `21.08.`, `24.08.2026`, `03.09.`) | je eine englische Entsprechung |
| `npm test` | **92 Proben — 92 grün, 0 rot, 0 nicht lauffähig** |

Die Absatz-Blockzahl ist die härteste der Zahlen: sie zählt je Abschnitt die
durch Leerzeilen getrennten Blöcke. **0 von 90** heißt, dass in keinem Abschnitt
ein Absatz, eine Tabelle oder ein Kasten fehlt oder hinzugekommen ist.

⚠ **Was diese Zahlen NICHT sagen.** Sie messen die Form, nicht den Inhalt. Ein
Absatz, der an derselben Stelle steht und etwas anderes behauptet, fällt darin
nicht auf. Deshalb ist der Text zusätzlich Abschnitt für Abschnitt gelesen
worden; die Funde unten stammen aus dem Lesen, die Zahlen oben aus dem Zählen.

### Die Rechnungen sind nachgerechnet

Alle Zahlen in 3.9 stimmen in beiden Fassungen überein **und** gehen auf:

| | |
|---|---|
| 1.572 − 714 | 858 · 714/1.572 = 45,4 % |
| 1.000.000 / 204 | ≈ 4.900 Aufrufe |
| 15 × 204 | 3.060 Token · × 5 USD/Mio = 0,0153 USD |
| 204 × 5 USD/Mio | 0,00102 USD je Aufruf |
| 0,00102 / 0,000025 | 40,8 → **41** Ausgabe-Token · gecacht 4,08 → **4** |
| 5,00 / 0,0153 | **327** Schichten · gecacht 5,00/0,00153 = **3.268** |
| 0,0153 / 0,05 | **0,31 %** Trefferquote |
| Erstlösung 30/50/70 % | 2,40 / 2,00 / 1,60 Runden → **17 / 20 / 33 %** weniger |
| 1,67 / 0,0153 | **109** — „das Hundertneunfache" |

### Die erzeugten HTML-Fassungen

`lang="en"` bzw. `lang="de"` richtig gesetzt, Titel je Sprache, DOI in beiden.
Im sichtbaren Text der englischen HTML steht kein deutscher Rest; die deutschen
Wörter, die eine Volltextsuche dort findet, stehen sämtlich in den Kommentaren
der eingebetteten `paper.css`.

---

## A · Stellen, an denen die englische Fassung von der deutschen abweicht

### A1 · Das Literaturverzeichnis ist verschieden sortiert

| | Reihenfolge |
|---|---|
| DE, Zeilen 1793–1799 | Kant · **Kohlberg** · **Kaplow** |
| EN, Zeilen 1736–1742 | Kant · **Kaplow** · **Kohlberg** |

Die englische Reihenfolge ist die alphabetische. Die deutsche ist es nicht.

### A2 · Der vierte Arm heißt in beiden Fassungen anders

| | 7.10, letzter Unterabschnitt |
|---|---|
| DE, Zeile 1726 | **`R+G+Rück`** |
| EN, Zeile 1672 | **`R+G+F`** |

Die Armkennungen **R** und **G** sind in der englischen Fassung unübersetzt
geblieben — **G** steht dort neben „principles" und nicht neben einem Wort mit
G. Bei **Rück → F** ist anders verfahren worden. Armkennungen sind Bezeichner:
sie stehen im Versuchsaufbau, in den Fehlerkategorien und künftig in den Daten.

### A3 · „nachziehen" ist mit „bring along" übersetzt

Das Wort trägt in 3.5 eine Aussage der Arbeit: eine grundsatzbasierte Regel
lässt sich **anpassen**, wenn der Fall sich ändert, weil ihr Zweck bekannt ist.

| | |
|---|---|
| DE 534 | „die Regel … **lässt sich nachziehen**, wenn der Fall sich ändert" |
| EN 518 | „it can be **brought along** when the case changes" |
| DE 524 | „**kann sie deshalb nicht nachziehen**, wenn sie nicht mehr passen" |
| EN 508 | „therefore **cannot bring them along** when they stop fitting" |

„bring along" heißt mitnehmen. „nachziehen" heißt nachträglich anpassen.

### A4 · „Zuschnitt" ist an drei Stellen drei verschiedene Wörter

| Stelle | DE | EN |
|---|---|---|
| 2.2, Schuett-Befund | „eines des **Zuschnitts**" | „one of **fit**" (Zeile 164) |
| 3.7, Faustregel-Tabelle | „es um **Zuschnitt** geht" | „it is about **judgement**" (Zeile 634) |
| 6 und 7.7, Grenzen | „ein **Aufgabenzuschnitt**" | „one **shape of task**" (Zeilen 1288, 1480) |

In 3.7 steht das Wort als Gegenstück zu **Form** in derselben Tabellenzeile.

### A5 · „vorzeigen" ist mit „produced on demand" übersetzt

| | 2.6 |
|---|---|
| DE 262 | „Ein Grundsatz **lässt sich nicht vorzeigen**." |
| EN 255 | „A principle **cannot be produced on demand**." |

Der Satz steht zwischen „prüfen, protokollieren und einer Aufsicht vorlegen" und
der Folgerung über die Nachweisbarkeits-Anforderung. Gemeint ist: man kann ihn
niemandem hinhalten. „produced on demand" lässt sich auch als *lässt sich nicht
auf Zuruf erzeugen* lesen.

### A6 · Die Zusammenfassung trägt ein „therefore", das im Deutschen fehlt

| | |
|---|---|
| DE 17–18 | „Sie sind Fragen an die konkrete Lage **und greifen auch dort**, wo niemand vorher hingesehen hat." |
| EN 18 | „They are questions put to the situation at hand, **and they therefore also reach** where nobody looked in advance." |

Das englische „therefore" macht aus der Nebeneinanderstellung eine Begründung.

---

## B · Fehler in der deutschen Fassung, die die englische nicht hat

Diese Funde stammen aus derselben Prüfung. Sie betreffen die **deutsche** Datei;
die englische ist an jeder dieser Stellen richtig.

| | DE-Zeile | Was dasteht |
|---|---|---|
| B1 | 812 | „lässt sich benennen. **Drei der sechs Regeln.**" — Punkt zerlegt den Satz, die Aufzählung darunter hängt frei |
| B2 | 890 | „**ist die Anwendungskosten** eines Standards die Zeit" — Numerus |
| B3 | 907 | „…bei einundvierzig Token umschlägt.\n**also** an einer sehr kleinen Zahl." — Punkt + Kleinschreibung |
| B4 | 1639 | „…um die es die ganze Zeit geht.\n**sie** taucht hier nur eine Ebene höher wieder auf" — dasselbe |
| B5 | 1510–1511 | „Der Vorbehalt aus Abschnitt 6**.** Modellwechsel nicht von der Grundsatz-Wirkung getrennt, fällt nur weg, wenn…" — der Punkt trennt Subjekt und Prädikat |
| B6 | 1773 | „`README.md`**.** Herkunft und Prüfsummen" — als einziger der vier Listenpunkte mit Punkt statt Komma |
| B7 | 1793 | „*Grundlegung zur Metaphysik der Sitten**.***, zur Unterscheidung" — Punkt vor dem Komma |

**B8 · Ein Grundsatz wird zweimal verschieden zitiert.** DE 473 „Wer sich
verlässt, **darf** sich verlassen können", DE 761 und 816 „muss sich verlassen
können". Die englische Fassung schreibt an beiden Stellen „must".

---

## C · Befunde, die in BEIDEN Fassungen stehen

Diese vier sind keine Übersetzungsfragen. Sie stehen wortgleich in beiden
Dateien und träfen eine Berichtigung deshalb beide.

### C1 · Die Korrektur von 47 % auf 45 % ist an einer Stelle nicht nachgezogen

Der Kasten in 3.9 hält fest, dass „von 1.510 auf 796 Zeichen, also um 47 %" bis
zum 2026-09-03 falsch dastand, und nennt als richtigen Wert **45 %**
(DE 827, EN 803).

Die Vergleichstabelle in „Die Rechnung von der richtigen Seite" trägt weiterhin
**47 %** (DE 974, EN 946):

> | Anweisungsblock um **47 %** kürzen | 0,015 USD | 1× |

Der Geldbetrag daneben ist unberührt: die 0,015 USD sind über 204 Token
gerechnet, nicht über den Prozentsatz.

### C2 · „Zwei Dinge bleiben trotzdem stehen", und es folgen drei

DE 928 · EN 903. Darunter stehen **1 ·**, **2 ·** und **3 ·**
(DE 931 / 938 / 941 · EN 906 / 913 / 916).

### C3 · Abschnitt 4.4 steht im Präsens und meint einen früheren Zustand

| | |
|---|---|
| DE 1248 · EN 1213 | „**Die Rollen sehen das Depot nicht.** Sie bekommen Text und geben Text zurück." |
| DE 59 · EN 57 | „**Seit dem 2026-08-23 haben alle fünf Werkzeuge.** Sie dürfen das Depot lesen…" |

Abschnitt 1 nennt den Zustand ohne Werkzeuge ausdrücklich als den früheren
(„Vorher hatten sie gar keine"). Abschnitt 4.4 nennt keinen Zeitpunkt.
Abschnitt 7.3.2 baut auf 4.4 auf und schreibt ebenfalls im Präsens.

### C4 · Das durchgerechnete Beispiel nennt die Regel bei ihrem zurückgezogenen Wortlaut

DE 813 · EN 790 führen als eine der drei verdichteten Regeln
*„du hast keine Werkzeuge"* / *„you have no tools"*. Abschnitt 3.2 meldet genau
diese Regel als am 2026-09-03 repariert.

**Das ist nicht ohne Weiteres ein Fehler:** die Zeichenzahl daneben ist
ausdrücklich „Stand 2026-08-23, Regelblock 1.572 Zeichen", und 3.10 nennt 1.572
als den Wert **vor** der Reparatur. Das Beispiel rechnet also folgerichtig am
alten Stand. Es sagt nur nicht dazu, dass die zitierte Regel heute anders lautet
— und die Aufzählung in 3.9 selbst (DE 759–761, EN 738–740) nennt dieselbe Regel
bereits in der neuen Form („nicht behaupten, etwas ausgeführt zu haben").

---

## Ein Wächter für das, was mechanisch messbar ist

Die Strukturzahlen oben sind einmal gemessen worden. Damit sie nicht ein
Zufallsbefund dieser Sitzung bleiben, stehen sie jetzt als Probe im Depot:

| | |
|---|---|
| `tests/smoke_paper_a_parallel.mjs` | 11 Zusicherungen, alle grün |
| `tests/gegenprobe_paper_a_parallel.mjs` | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `npm test` danach | **93 Proben — 93 grün, 0 rot, 0 nicht lauffähig** |

⚠ **Der Wächter nagelt die GESTALT fest, nicht den Wortlaut.** Ein übersetzter
Text muss andere Wörter haben; ein Wächter auf Wörter verböte die Übersetzung
und, schlimmer, jede spätere Berichtigung. Genau dieser Fehler steht in Paper A
selbst als Befund: der Kimhub-Wächter verlangte die Zeichenfolge
`KEINE WERKZEUGE` und hielt damit elf Tage lang die Regel am Leben, die falsch
geworden war — grün die ganze Zeit (3.2).

Gemessen wird deshalb nur, was sprachunabhängig ist: Zahl und Ebenen-Folge der
Überschriften, je Abschnitt die Absatz-Blöcke, Tabellenzeilen und Listenpunkte,
die Querverweise, die ISO-Daten, und dass beide HTML-Fassungen **denselben** DOI
tragen.

**Die Gegenprobe ist selbst gegengeprüft.** Eine Zusicherung des Wächters wurde
von Hand blind gemacht (Bedingung fest auf `true`); die Gegenprobe meldete
daraufhin genau ihren Fall als **NICHT GEFANGEN** und Rückgabewert 1. Ohne
diesen Handgriff wäre „9 gefangen" nur ein grüner Haken — eine Prüfung, die dir
recht gibt, ist der Ort, an dem man am genauesten hinsieht. Der Wächter ist
danach byte-gleich zurückgeschrieben (`md5sum` vor und nach dem Eingriff
identisch).

### Was der Wächter NICHT fängt

- **A1 (Reihenfolge des Literaturverzeichnisses).** Beide Fassungen haben acht
  Einträge; die Blockzahl ist gleich. Eine Prüfung auf die Reihenfolge der
  Nachnamen wäre **heute rot**, weil die Abweichung besteht. Sie gehört
  nachgetragen, sobald A1 entschieden ist — vorher wäre sie ein roter Wächter,
  und ein rotes Depot legt die Gegenproben still.
- **A2 bis A6 und B1 bis B8.** Das sind Wortlaut-Fragen. Sie zu bewachen hieße,
  den Wortlaut festzunageln.
- **C1 bis C4.** Sie stehen in beiden Fassungen gleich; ein Paritäts-Wächter
  sieht sie gerade deshalb nicht.

Der Wächter ersetzt das Lesen also nicht. Er hält nur fest, was das Lesen an
diesem Tag vorgefunden hat.

---

## Was diese Prüfung nicht geleistet hat

- **Kein Browser-Sichttest, kein PDF.** Die PDFs, die bei Zenodo liegen, sind
  nicht im Depot. Ob eine Berichtigung deren Seitenumbruch verschiebt, ist
  ungeprüft; `tools/paper-umbruch-pruefen.mjs` und `tools/paper-seiten-messen.mjs`
  liegen dafür bereit.
- **Kein Abgleich mit dem Zenodo-Eintrag** (403, siehe oben).
- **Keine Prüfung der Sachaussagen gegen die Quellen.** Ob Kohlberg, Tyler,
  Gneezy/Rustichini und Kaplow richtig wiedergegeben sind, ist nicht
  nachgeschlagen worden — geprüft ist nur, dass beide Fassungen dasselbe sagen.
- **Keine Bewertung des englischen Stils.** Gesucht wurde nach Stellen, an denen
  eine Übersetzung eine Aussage verschiebt, nicht nach besseren Formulierungen.
