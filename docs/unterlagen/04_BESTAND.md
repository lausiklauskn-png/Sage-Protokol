# Bestandsaufnahme: was dokumentiert ist, und wo es aufhört

**Erzeugt am 2026-08-26** von `tools/bestand-bauen.mjs`. Zeitraum und Umfang
kommen aus `git log` und aus den Dateien selbst. Wer diese Datei von Hand
ändert, verliert die Änderung beim nächsten Lauf.

> **Warum sie erzeugt wird.** Der Bestand ändert sich. Zeitraum und Umfang
> kommen deshalb bei jedem Lauf frisch aus `git log` und aus den Dateien
> selbst, nicht aus einer gepflegten Liste.

---

## 1 · Die Kennzahlen, jede mit ihrer Definition

**Jede Zahl trägt, was sie zählt.** Zwei Angaben für dieselbe Sache sind für
jeden, der sie nebeneinander liest, ein Widerspruch, auch wenn beide stimmen.
Die Definition steht deshalb in derselben Zeile wie der Wert.

| Kennzahl | Wert | Was genau gezählt wird |
|---|---|---|
| **Einträge insgesamt** | 5.823 | jeder gespeicherte Stand, auch die zeitgesteuerten Läufe |
| **Einträge von Hand** | 5.775 | ohne die zeitgesteuerten Läufe; das ist die Zahl für die Arbeitszeit |
| **davon zeitgesteuert** | 48 | Läufe des Dienstes, meist nachts; keine Arbeitszeit |
| **Arbeitstage** | 128 | Tage mit mindestens einem Eintrag von Hand |
| **Depots** | 33 | ausgelesene Git-Depots, leere eingeschlossen |
| **Zweige** | 1.388 | alle Zweige aller Depots, die Hauptzweige mitgezählt |

Die Differenz zwischen den ersten beiden Zeilen sind genau die
48 zeitgesteuerten Läufe. Wer die Arbeitszeit rechnet, nimmt die
zweite Zahl; wer den Umfang der Historie angibt, die erste.

## 2 · Die Unterlagen, nach Vorgehen geordnet

In dieser Reihenfolge nimmt man sie in die Hand.

> **Die Spalte misst die Datei, nicht den Inhalt.** Wer eine Datei aus einer
> anderen herauslöst, bekommt ein junges Datum für einen alten Text. Wo das
> vorkommt, steht es in der Zelle dabei.

| Was | Wo | Stände dieser Datei | Umfang | Lücke |
|---|---|---|---|---|
| **Fahrplan Forschungsgelder** | `docs/FORSCHUNGSFOERDERUNG.md` | 2026-08-23 bis 2026-08-26 | 78 KB, 1.432 Zeilen | keine benannt |
| **Die Schritte, abhakbar** | `docs/unterlagen/01_SCHRITTE.md` | 2026-08-26 bis 2026-08-26 | 7 KB, 141 Zeilen | keine benannt |
| **Frageblatt Steuerberater** | `docs/STEUERBERATER_FRAGEN.md` · `docs/frageblatt.html` · `docs/frageblatt.pdf` | 2026-08-24 bis 2026-08-26 | 202 KB, 817 Zeilen | Die Kleinunternehmerregelung steht nur als Aufzählungspunkt unter Frage 7. Der Fragebogen zur steuerlichen Erfassung verlangt dafür ein Kreuz. |
| **Vorbereitung Finanzamt** | `docs/unterlagen/03_FINANZAMT.md` | 2026-08-26 bis 2026-08-26 | 5 KB, 122 Zeilen | Ohne ELSTER-Zertifikat geht der Fragebogen nicht ab. Das Zertifikat kommt per Brief und hat als einziger Schritt eine Vorlaufzeit. |
| **Sitzungsprotokolle** | `docs/sessions/archiv` | 2026-05-10 bis 2026-08-26 | 20 KB | keine benannt |
| **Arbeitszeitnachweis, Tag für Tag** | `docs/historie/arbeitstage.html` · `docs/historie/arbeitstage-tage.csv` · `docs/historie/arbeitstage-taetigkeiten.csv` · `docs/historie/arbeitstage.pdf` | 2026-08-24 bis 2026-08-26 | 7.5 MB, 13.212 Zeilen | Gemessen wird die Spanne zwischen dem ersten und dem letzten Eintrag eines Tages, nicht die geleistete Arbeit. Was vor dem ersten Eintrag geschah, ist nicht erfasst. |
| **Historie der Zusammenarbeit** | `docs/historie/historie.html` · `docs/historie/historie.json` | 2026-08-24 bis 2026-08-26 | 14.1 MB, 88.282 Zeilen | Die Einordnung eines Eintrags geschieht an seinen Wörtern. Alle Zahlen zu den Marken sind deshalb Untergrenzen, keine Vollerhebung. |
| **Entstehung, Klaus’ Darstellung** | `docs/papers/ENTSTEHUNG.md` | 2026-08-23 bis 2026-08-26 | 8 KB, 167 Zeilen | Eine Schilderung aus dem Gedächtnis, aufgezeichnet am 2026-08-23. Wo sie gegen die Einträge prüfbar ist, hält sie; der Rest ist Darstellung. |
| **Paper A, Regeln und Grundsätze** | `docs/papers/PAPER_A_regeln-und-grundsaetze.md` | 2026-08-23 bis 2026-08-24 | 91 KB, 1.843 Zeilen | Der Werkzeug-Widerspruch ist offen und gehört vor die Zenodo-Nummer. |
| **Forschungskorpus** | `docs/FORSCHUNGSKORPUS.md` | 2026-08-23 bis 2026-08-26 | 8 KB, 133 Zeilen | keine benannt |
| **Werkstatt-Material aus Kimhub** | `docs/werkstatt` | 2026-08-23 bis 2026-08-26 | 4 KB | Byte-Kopien mit Prüfsummen. Sie laufen still vom Original weg, sobald dort etwas geändert und hier nicht neu kopiert wird. |
| **Die beiden SBKIM-Papers, DE und EN** | `docs/papers/sbkim-paper-de.html` · `docs/papers/sbkim-paper-en.html` | 2026-05-18 bis 2026-05-18 | 46 KB, 1.130 Zeilen | Datiert auf Mai 2026 und in `INTERFACES.md` mit Paragraphennummern zitiert. Eine Änderung daran braucht eine v0.2, keine stille Nachbesserung. |
| **Meilensteine mit Bild** | `docs/meilenstein` · `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` · `docs/MEILENSTEIN_VON_DER_HUELLE_ZUM_INHALT.md` | 2026-06-21 bis 2026-08-16 | 20 KB, 300 Zeilen | keine benannt |
| **Die Lehren** | `docs/LEHREN.md` | 2026-08-22 bis 2026-08-22<br>am 2026-08-22 aus `CLAUDE.md` herausgelöst; der Inhalt reicht bis 2026-05 zurück | 35 KB, 673 Zeilen | keine benannt |

## 3 · Dieselben Unterlagen, chronologisch

Nach dem Tag, an dem der erste Stand davon abgelegt wurde. Dieselbe Liste,
andere Ordnung, und sie zeigt etwas anderes: woran zuerst gearbeitet wurde.


| Nr. | Was | erster Stand | letzter Stand |
|---|---|---|---|
| 1 | **Sitzungsprotokolle** | 2026-05-10 | 2026-08-26 |
| 2 | **Die beiden SBKIM-Papers, DE und EN** | 2026-05-18 | 2026-05-18 |
| 3 | **Meilensteine mit Bild** | 2026-06-21 | 2026-08-16 |
| 4 | **Die Lehren** | 2026-08-22 | 2026-08-22 |
| 5 | **Entstehung, Klaus’ Darstellung** | 2026-08-23 | 2026-08-26 |
| 6 | **Fahrplan Forschungsgelder** | 2026-08-23 | 2026-08-26 |
| 7 | **Forschungskorpus** | 2026-08-23 | 2026-08-26 |
| 8 | **Paper A, Regeln und Grundsätze** | 2026-08-23 | 2026-08-24 |
| 9 | **Werkstatt-Material aus Kimhub** | 2026-08-23 | 2026-08-26 |
| 10 | **Arbeitszeitnachweis, Tag für Tag** | 2026-08-24 | 2026-08-26 |
| 11 | **Frageblatt Steuerberater** | 2026-08-24 | 2026-08-26 |
| 12 | **Historie der Zusammenarbeit** | 2026-08-24 | 2026-08-26 |
| 13 | **Die Schritte, abhakbar** | 2026-08-26 | 2026-08-26 |
| 14 | **Vorbereitung Finanzamt** | 2026-08-26 | 2026-08-26 |

## 4 · Was außerhalb der Depots liegt

Ein Werkzeug findet nur, was in einem Depot steht. Diese vier Posten stehen
deshalb **von Hand** hier, und ihre Zeiträume sind nicht gerechnet, sondern
angegeben.

| Was | Wo | Zeitraum | Was daran fehlt |
|---|---|---|---|
| **Belege, 75 Rechnungen** | Kimhub, `.gitignore`, nur auf Klaus’ Gerät | 2026-03-13 bis 2026-08-04 | Zwei Währungen, Euro und Dollar, getrennt gerechnet. Neun Rechnungsnummern fehlen. |
| **Fahrtenbuch der Werkstatt** | Kimhub, `.gitignore`, nur auf Klaus’ Gerät | ab 2026-08-22 | Beginnt erst am 22.08. Für die Zeit davor gibt es keine Kostenaufzeichnung je Fahrt. |
| **Stechuhr der Werkstatt** | Kimhub, Browser-Speicher | 2026-08-22 | Zweimal gedrückt, zusammen 16 Sekunden. Als Zeitquelle unbrauchbar, und das ist der Grund, aus dem der Nachweis aus den Einträgen gerechnet wird. |
| **Chat-Verläufe** | außerhalb von Git | unbekannt | Umfang und Form sind nicht erhoben. Sie sind die einzige Quelle für das, was besprochen und verworfen wurde, und der einzige Posten dieser Liste, den keine Sitzung allein klären kann. |

## 5 · Die Protokoll-Deckung, Monat für Monat

Die Frage lautete: fällt die Dokumentation ab, oder wurden die Sitzungen nur
länger? Beides ergibt dieselbe fallende Kurve, wenn man Einträge je Protokoll
zählt. **Tage lassen sich dagegen zählen**, und das ist die Antwort.

| Monat | Arbeitstage | mit Protokoll | ohne | Deckung |
|---|---|---|---|---|
| 2026-03 | 1 | 0 | 1 | 0 % |
| 2026-04 | 20 | 0 | 20 | 0 % |
| 2026-05 | 25 | 17 | 8 | 68 % |
| 2026-06 | 27 | 11 | 16 | 41 % |
| 2026-07 | 31 | 8 | 23 | 26 % |
| 2026-08 | 24 | 12 | 12 | 50 % |
| **zusammen** | **128** | **48** | **80** | **38 %** |

Das erste Protokoll überhaupt stammt vom **2026-05-10**. Vorher gab es die
Praxis nicht, in keinem Depot. Was davor liegt, ist deshalb keine Lücke in der
Ablage, sondern eine Zeit ohne diese Ablage. Der Unterschied ist wichtig: das
eine wäre ein Versäumnis, das andere ist ein Datum.

## 6 · Was dieses Blatt nicht kann

Es zählt Dateien und Einträge. Es weiß nicht, ob ein Protokoll gut ist, ob es
den Tag trifft, den es überschreibt, oder ob an einem gedeckten Tag noch drei
andere Dinge geschahen. **Deckung ist eine Untergrenze für Dokumentation, kein
Maß für ihre Güte.**
