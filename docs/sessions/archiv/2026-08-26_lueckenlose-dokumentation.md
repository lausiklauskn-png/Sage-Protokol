# Übergabeprotokoll · 2026-08-26 · Die lückenlose Dokumentation

**Zweig:** `claude/dokumentation-bestandsaufnahme-ph81s1` · **PR** #922
**Auftrag:** `BRIEF_lueckenlose_dokumentation.md`, dazu drei Nachforderungen von
Klaus im Lauf der Sitzung.

---

## 1 · Was Klaus während der Sitzung dazugegeben hat

Der Brief nannte fünf Aufgaben. Klaus hat drei weitere gestellt, jede in einer
eigenen Nachricht, während gearbeitet wurde:

1. *„Prüf bitte, ob in allen Texten nach dem vorhandenen Skill menschlich
   geschrieben wurde und alle nicht notwendigen Gedankenstriche entfernt
   wurden."*
2. *„danach alle Unterlagen noch einmal chronologisch und vorgehenstechnisch
   geordnet als Download bereitstellen"*
3. *„Inhalte noch einmal auf Widersprüche untersuchen und korrigieren"*

Dazu **elf heruntergeladene Dateien** von seinem Gerät, ohne Begleittext. Sie
beantworten die Frage, die der Brief ausdrücklich an ihn richtete: was hat er,
und in welcher Form.

## 2 · Der Befund, mit dem alles anfing

Die Frage des Briefes lautete: fällt die Dokumentation ab, oder wurden die
Sitzungen länger? **Beides ergibt dieselbe Kurve**, wenn man Einträge je
Protokoll zählt. Tage lassen sich dagegen zählen.

| Monat | Arbeitstage | mit Protokoll | Deckung |
|---|---|---|---|
| 2026-03 | 1 | 0 | 0 % |
| 2026-04 | 20 | 0 | 0 % |
| 2026-05 | 25 | 17 | 68 % |
| 2026-06 | 27 | 11 | 41 % |
| 2026-07 | 31 | 8 | 26 % |
| 2026-08 | 24 | 12 | 50 % |
| **zusammen** | **128** | **48** | **38 %** |

**Der April war keine Lücke in der Ablage, sondern eine Zeit ohne diese
Ablage.** Seine 551 Einträge liegen in Mein-Rezeptbuch (288),
Muttis-Rezeptbuch (206) und Mein-Mixarium (55); Sage hatte einen. Die
Protokollpflicht ist eine Sage-Regel, und das erste Protokoll überhaupt stammt
vom 10.05.

> Der Brief verglich netzweite Einträge gegen Protokolle eines einzigen Depots.
> Beide Zahlen waren richtig, ihr Verhältnis war es nicht.

## 3 · Was jetzt vorliegt

| | Wo | Was |
|---|---|---|
| **Abteilung 5** | `docs/unterlagen/04_BESTAND.md` | Bestandsaufnahme, zweifach geordnet, jede Zeile mit ihrer Lücke |
| **Abteilung 6** | `docs/unterlagen/05_APRIL.md` | der April, als Rekonstruktion gekennzeichnet |
| **Abteilung 2 der Antragsmappe** | `docs/ABGRENZUNG.md` | Stand der Technik, vor Paper A |
| Rechnung | `tools/bestand-rechnen.mjs` | die eine Quelle |
| Bau | `tools/bestand-bauen.mjs` | beide Blätter, Zeitraum aus `git log` |
| Wächter | `tests/smoke_bestand.mjs`, `tests/smoke_zahlen.mjs` | beide mit Gegenprobe |

Neun PDFs neu gebaut, vier davon neu: `antragsmappe.pdf`,
`antragsmappe-einreichbar.pdf`, `unterlagen-bestand.pdf`,
`unterlagen-april.pdf`.

## 4 · Vier Widersprüche in Unterlagen, die aus dem Haus gehen

| stand da | gemessen | wo |
|---|---|---|
| „27 Tage nichts" | 26 | Fahrplan, Frageblatt |
| „140 Kalendertage" | 141 | Fahrplan, Frageblatt |
| „genau **eine** Lücke von vier Tagen" | neun Unterbrechungen, längste drei | Fahrplan, Frageblatt |
| 5.823 und 5.775, beide „Einträge" | beide richtig, Differenz sind 48 Läufe | Übersicht, Schritte, Frageblatt |

Die dritte ist die gefährlichste: neben dem Text liegt die Tages-Tabelle, in
der jeder nachzählen kann.

Dazu zwei Angaben, die **wahr sind und beim Nachprüfen falsch aussehen**: die
Demo im Forschungskorpus (Inhalt März, ins Depot am 15.08.) und die
„doppelte Arbeitszeit" in `ENTSTEHUNG.md` (Spanne 2,03-fach, aktive Zeit
1,24-fach). Beide tragen jetzt beides.

## 5 · Was diese Sitzung an sich selbst gelernt hat

**Ein flacher Klon liefert Zeiträume, die wie Messungen aussehen.** Der erste
Lauf gab für `LEHREN.md` „2026-08-22 bis 2026-08-22" aus, weil der Container-Klon
nur fünfzig Einträge trug. Nichts daran sah falsch aus. Die Falle steht seit
dem 24.08. in der Historie; hier hatte niemand daran gedacht. Das Werkzeug
bricht jetzt ab.

**Ein Wächter, der sein Datum irgendwo im Blatt sucht, findet es woanders.**
Der Zeitraum-Wächter fand seinen Tag im Abschnitt zum Protokoll-Beginn, der aus
einer anderen Rechnung kommt, und blieb grün, während jede Angabe der Tabelle
gestempelt war.

**Ein Wächter, der nur das Falsche verbietet, misst nicht, ob das Richtige
dasteht.** Die Zahl der Unterbrechungen wurde nirgends gegen den Text geprüft.

**Zwei Kennzahlen mit demselben Namen** fing keine Prüfung, obwohl das Blatt
genau dagegen gebaut ist.

**Anführungszeichen machen einen Satz nicht zum Zitat.** In `BEFUND.md` stand
eine erfundene Langfassung einer Werkstattregel in Anführungszeichen. Der
Gedankenstrich-Wächter ließ sie durch, **weil** sie in Anführungszeichen stand.

**Ein Wächter, der ein Wort festnagelt, wird beim Richtigstellen rot.** Der
Lücken-Wächter zählte „existiert nicht" und schlug an, weil eine Lücke
geschlossen wurde. Die zu weite Gegenfassung war dann zu nachsichtig. Jetzt
braucht jede Tabellenzeile einen Stand aus einer anerkannten Liste.

## 6 · Klaus' elf Downloads, geprüft

**Neun byte-identisch** mit dem Depot, BOM vorhanden, PDFs vollständig. Der
Weg vom Depot auf sein Gerät ist damit zum ersten Mal end-to-end belegt.

**Zwei sind ältere Downloads:** `antragsmappe.html` steht auf Stand 23.08.
(Depot: 26.08.), `historie.html` stammt von vor der BOM-Reparatur am 24.08.
Kein Fehler, aber der Beleg dafür, dass eine heruntergeladene Datei keinen
Rückweg hat. Beide tragen ihr Datum im Dokument, deshalb war es zu sehen.

**`klauszeit.txt`**, der Export von Kimhubs Stechuhr: zweimal gedrückt,
16 Sekunden. Als Zeitquelle unbrauchbar, und genau deshalb wird der Nachweis
aus den Einträgen gerechnet. Steht so in der Bestandsaufnahme.

## 7 · Was gemessen ist und was nicht

```
node tests/run_alle.mjs                     92 grün, 0 rot, 0 nicht lauffähig
node tests/gegenprobe_antragsmappe.mjs      35 von 35
node tests/gegenprobe_unterlagen.mjs        14 von 14
node tests/gegenprobe_bestand.mjs           17 von 17
node tests/gegenprobe_zahlen.mjs            13 von 13
docs/PULS.md                                2.849 Zeilen von 3.000
```

Die vier Gegenproben liefen **einzeln nacheinander**, nie zwei nebeneinander.

**Nicht geprüft:** Klaus' Sichttest am Tablet für die drei neuen Blätter.

## 8 · Offen

| | |
|---|---|
| **Die Gedankenstriche in den beiden Papers** | v0.1-Vorabveröffentlichung von Mai 2026, in `INTERFACES.md` mit Paragraphennummern zitiert. Ein stilles Umschreiben erzeugte zwei Fassungen mit derselben Nummer. Braucht eine v0.2 und Klaus' Wort |
| **Der Werkzeug-Widerspruch in Paper A** | Klaus' Entscheidung, gehört vor die Zenodo-Nummer |
| **Die Literatursuche** zum Abgrenzungs-Blatt | steht im Blatt selbst als fehlend benannt |
| **Die englische Projektseite** | existiert nicht, Grundlage für den OTF-Antrag |
| **Die Kleinunternehmerregelung** | steht im Frageblatt nur als Aufzählungspunkt, der Fragebogen verlangt ein Kreuz |
| **ELSTER-Zertifikat** | der einzige Schritt mit Vorlaufzeit |

---

# Nachtrag · derselbe Tag, nach Klaus' Rückfragen

## 10 · Die vier Punkte, nachgeprüft

Klaus las im heruntergeladenen PDF, dass vier Dinge fehlen, und bat um eine
Nachprüfung. **Sein PDF war älter als das Depot.** Nachgesehen über den ganzen
Baum, nicht nur in `docs/papers/`:

| | Stand |
|---|---|
| Blatt „Stand der Technik und Abgrenzung" | **existiert**, `docs/ABGRENZUNG.md` |
| Englische Projektseite | **existiert nicht**, kein Entwurf |
| Paper C · KI-Kompetenz | **existiert nicht**, Gerüst in `PLAN_PAPERS.md` |
| Paper B · Wirkung auf den Menschen | **existiert nicht**, Gerüst in `PLAN_PAPERS.md` |

## 11 · Abteilung 7, und die Trennung, auf die es ankommt

`docs/unterlagen/06_FORSCHUNGSAUFGABEN.md`, erzeugt. Sieben Aufgaben mit Frage,
Beleg, Abhängigkeit und Reihenfolge, dazu die drei Stränge.

**Zwei Dinge werden getrennt gehalten**, weil ihre Vermischung das Blatt
wertlos machte: ob ein **Beleg im Depot liegt** und ob die **Aufgabe erledigt**
ist. Keine der sieben ist erledigt. Der Zenodo-Upload wird deshalb als „nicht
als Datei sichtbar" geführt, nicht als vorhanden: die Papers liegen seit Mai
vor, hochgeladen ist nichts, und eine Nummer wäre ohnehin keine Datei.

## 12 · Ein Beinahe-Fehler, und er ist der lehrreichste des Tages

Nach dem Merge stand `docs/unterlagen.html` als geändert da: 238 auf 239
Stände. Die Bestandsaufnahme zählt die eigene Historie mit, und der Merge hatte
ein Protokoll abgelegt. Kein Fehler, eine Eigenschaft, und sie steht jetzt im
Blatt.

**Beim Aufschreiben genau dieser Erklärung** standen die Backticks um einen
Dateinamen in einem Template-Literal und haben es geschlossen. Der Bau brach
mit einem Syntaxfehler ab.

```
SyntaxError: Unexpected identifier 'smoke_unterlagen'
...
93 Proben — 93 grün, 0 rot, 0 nicht lauffähig
```

**Der Bau ist gescheitert, und die Proben blieben grün.** Sie messen das
Erzeugnis, und das Erzeugnis war noch das alte, in sich stimmige.

> **Ein Werkzeug, das gar nicht läuft, hinterlässt keine Spur in einer Probe,
> die nur sein Erzeugnis ansieht.** Gesehen habe ich es nur, weil die
> Fehlermeldung zufällig über der grünen Zeile stand.

Das ist derselbe Bau wie der Kimhub-Befund vom selben Tag, nur andersherum:
dort baute die Probe ihr eigenes Prüfobjekt neu, hier baute es niemand. Beide
Male sah es aus wie Erfolg.

## 13 · Und ab heute trägt sich jede Sitzung ein

Klaus' Auftrag, netzweit: jede Sitzung wie ein Forschungsprojekt, mit
dokumentierten Messungen. Gebaut in **Kimhub** (`forschung/`, PR #67).

Auf seine Frage *„Ist da schon Forschung, wenn dokumentiert?"* war die Antwort
**nein**. Es fehlte eine Vorhersage, die scheitern kann und **vor** den Daten
dasteht. Sie steht seitdem in `METHODE.md` § 6, mit einem Riegel auf den
Wortlaut.

**Das steht als Pflicht in `BRIEF_nach_bestandsaufnahme.md` § 5b.** Ohne sie
stirbt der Datensatz nach einem Eintrag, und die Vorhersage wird nie
auswertbar: sie braucht zwanzig Sitzungen.
