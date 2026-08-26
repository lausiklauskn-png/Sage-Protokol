# Übergabeprotokoll 2026-08-26 · Die Unterlagen der Reihe nach

**Zweig:** `claude/research-funding-paper-delivery-vuppnj`
**Auftrag:** Klaus: *„Gib mir bitte aus allen Sitzungen der Reihe nach die
Download-Dokumente: Fahrplan, Steuerberater-Fragebogen, Finanzamt-Einreichung,
Arbeitszeitnachweis, Forschungsunterlagen inkl. Papers, und was noch fehlt für
die Erreichung bei den entsprechenden Stellen. Schaue gründlich nach,
gegebenenfalls passe an wenn nötig."*

---

## 0 · Zum zweiten Mal an drei Tagen: eine Sitzung lief parallel

Während dieser Bau lief, hat eine **zweite Sitzung dasselbe gebaut** (PR #917
bis #919). Gemerkt beim Push, nicht davor, und diesmal mit **echter
Überschneidung**: nicht andere Dateien, sondern dieselbe Sache.

**Ihres gewinnt.** Es ist gründlicher: Sachverhalt in sieben Sätzen, sieben
nummerierte Fragen, 75 Rechnungen. Meines ist gelöscht, Abteilung 3 zeigt auf
`docs/STEUERBERATER_FRAGEN.md`.

> **Die Versuchung war, beide stehen zu lassen.** Sie hätten sich nicht
> widersprochen, sie wären nur zwei gewesen. Genau daran erkennt man die
> Drift-Quelle, bevor sie eine ist: nicht am Widerspruch, sondern an der
> Doppelung.

**Zwei Verweise mussten dabei nachgezogen werden**, weil sie auf die
Fragennummern meines gelöschten Blatts zeigten. Ein Verweis auf eine Nummer in
einem fremden Dokument ist eine Wette darauf, dass niemand dort umsortiert.

**Und eine Lücke in ihrem Blatt fiel auf:** die Kleinunternehmerregelung steht
nur als Aufzählungspunkt unter Frage 7, nicht als eigene Frage, während der
Fragebogen ein Kreuz verlangt. Steht jetzt im Finanzamt-Blatt und in der
Übersicht.

**Ihr Text hat außerdem einen Messfehler in meinem Wächter aufgedeckt:**
`klartext()` entfernte Sternchen auch **innerhalb eines Code-Abschnitts**. An
`docs/historie/arbeitstage.*` meldete er eine vollständig vorhandene Zeile als
fehlend. **Ein Wächter wird an fremdem Text erwachsen**, nicht am eigenen: das
eigene Material trifft die eigenen Annahmen nie.

---

## 0b · Der Bestand, nachgesehen statt angenommen

**Drei der fünf gab es, zwei nicht.**

| | Unterlage | Stand vorher |
|---|---|---|
| 1 | Fahrplan | `docs/FORSCHUNGSFOERDERUNG.md`, 1.403 Zeilen |
| 2 | Steuerberater-Fragebogen | existierte nicht, **kam parallel von der Nachbarsitzung** |
| 3 | Finanzamt-Einreichung | **existierte nicht** |
| 4 | Arbeitszeitnachweis | `docs/historie/arbeitstage.*` |
| 5 | Forschungsunterlagen | Antragsmappe, Abteilung 2 |

Der Fahrplan **enthielt** die Substanz für 2 und 3, aber verteilt über § 5c, § 7
und § 9. *„Kann man erst einmal einen Antrag stellen? Ja, der Fragebogen ist der
Antrag"* steht dort seit dem 23.08.; als Blatt zum Mitnehmen in einen Termin
taugte das nicht.

---

## 1 · Der Widerspruch, den das gründliche Nachsehen gefunden hat

**Schritt B4 des Fahrplans stand gegen § 4 derselben Datei.**

| | sagt |
|---|---|
| **§ 7, B4** | `BookLedgerPro` und `Meine-In-and-Out-Book` bekommen eine Lizenz-Datei |
| **§ 4**, nachgemessen am 2026-08-24 | `BookLedgerPro` trägt seit dem 16.08. eine (im Container lag ein veralteter Klon); `Meine-In-and-Out-Book` ist ein leeres Depot ohne einen einzigen Commit |

**§ 4 war gemessen, B4 abgeschrieben.** Eine Sitzung, die dem Fahrplan folgt,
hätte an zwei Depots Lizenz-Dateien angelegt, von denen eine schon da war und
die andere nichts zu lizenzieren hat. Nachgezogen, mit dem Grund daneben, in
**beiden** Dateien.

> **Die Lehre dahinter:** zwei Abschnitte derselben Datei können
> auseinanderlaufen, und der jüngere gewinnt nicht von allein. Wer einen
> Abschnitt nachmisst, sieht nach, wo dieselbe Sache noch steht.

---

## 2 · Ein Werkzeug für zwei Mappen, nicht zwei Werkzeuge

Die naheliegende Lösung wäre ein zweiter Generator mit eigenem Stil gewesen.
Dagegen sprachen die zwei fest verdrahteten Zeilen im vorhandenen:

```
html.nur-privat .abteilung:not(#privat){display:none}
html.nur-einreichbar .abteilung:not(#einreichbar){display:none}
```

Sie **erzeugen** sich jetzt aus der Abteilungs-Liste. Eine dritte Abteilung wäre
sonst **stumm nicht druckbar** gewesen: der Knopf hätte gearbeitet, das Blatt
hätte alles gezeigt.

Zwei Stile für dieselbe Sorte Dokument liefen auseinander, und man sähe es erst,
wenn eine der Mappen beim Drucken anders aussieht als die andere.

### Und dabei ist ein echter Fehler entstanden

**Die Anker-Karte galt zuerst über beide Mappen.** Ein Verweis aus der
Unterlagen-Mappe auf `FORSCHUNGSFOERDERUNG.md` wurde damit zu
`#q-docs-forschungsfoerderung-md`, dessen Ziel nur in der **anderen** Datei
steht. Ein Sprung ins Leere, der aussieht wie ein Verweis.

**Gefunden hat es die Gegenprobe**, nicht das Nachdenken: ihr Fall „ein
relativer Verweis bleibt stehen" sabotierte die Umschreibung und **nichts
änderte sich**, weil es gar keinen Verweis mehr gab, der diesen Weg nahm.
Anker jetzt je Mappe, und der Wächter prüft, dass jeder interne Sprung ankommt.

---

## 3 · Fünf blinde Wächter, alle von der Gegenprobe entlarvt

| | der Fehler |
|---|---|
| **Download** | der Wächter **klonte die Abteilung selbst**, statt den Knopf zu drücken. Er maß seine eigene Funktion; `alleinBauen` durfte `document.body` zurückgeben und blieb grün |
| **„keine Abschrift des Formulars"** | fand den Satz im **Warnkasten, den der Generator setzt**, nicht im Blatt |
| **„keine steuerliche Beratung"** | fand ihn im **anderen** Blatt |
| **„Was noch fehlt"** mit `/i` | fand „was noch fehlt" klein geschrieben in der Einleitung derselben Abteilung |
| **Anker-Fall** | sabotierte nichts (siehe oben) |

Die drei mittleren sind **dieselbe Sorte**: die Prüfung findet ihren Satz
woanders und ist zufrieden, während die Stelle, um die es geht, leer ist.
Gemessen wird jetzt im **Abschnitt**, zu dem die Aussage gehört.

Beim letzten war **auch der Gegenproben-Fall falsch gebaut**: er benannte nur
die Überschrift um. Eine Überschrift ist keine Zusicherung. Sabotiert wird jetzt
der Warnkasten, der sagt, warum die Zenodo-Nummer warten muss.

---

## 4 · Was daneben herausfiel

**Vier Gedankenstriche in der Markier-Legende.** Der bestehende Wächter misst
die **Quellen**, der neue die **Ansicht**. Damit ist er strenger und sieht auch,
was erst beim Bauen entsteht. Aufgelöst.

**Der Container-Kalender steht auf dem 26.08., der letzte Commit auf dem 24.**
Zwei Tage. Die neuen Blätter tragen jetzt das richtige Datum; ein falsches
Datum auf einem Behörden-Blatt ist kein Schönheitsfehler.

**Eine abgebrochene Gegenprobe lässt ihre Sabotage stehen.** Mein erster Lauf
lief in die Zeitgrenze und wurde mitten drin abgeschossen; das `finally` mit
`zurueck()` kam nie dran, und `historie-bericht-bauen.mjs` behielt eine
eingebaute Lücke. Aufgefallen erst beim nächsten Lauf, als ein Anker nicht mehr
griff. **Und zwei Gegenproben nebeneinander laufen zu lassen ist derselbe
Fehler in laut:** der Läufer las Dateien, die die andere gerade verbogen hatte,
und meldete zwei rote Proben, die keine waren.

---

## 5 · Was gebaut wurde

| | |
|---|---|
| `docs/unterlagen/00_UEBERSICHT.md` | die fünf Unterlagen, und **was noch fehlt** |
| `docs/unterlagen/01_SCHRITTE.md` | die Schritte in der Reihenfolge ihrer Abhängigkeiten |
| `docs/unterlagen/03_FINANZAMT.md` | Vorbereitung, **keine Abschrift des Formulars** |
| `docs/unterlagen.html` | vier Abteilungen, jede einzeln zu haben |
| `tools/html-zu-pdf.mjs` | eine PDF-Umsetzung, `--nur <id>` druckt eine Abteilung |
| `tests/_mappen-teile.mjs` | die geteilten Messwerkzeuge beider Mappen-Proben |
| `tests/smoke_unterlagen.mjs` · `tests/gegenprobe_unterlagen.mjs` | 14 eingebaute Fehler |

`--nur` setzt **dieselbe** Klasse wie der Knopf in der Seite. Eine zweite
Auswahl-Logik wüsste nichts von der ersten.

---

## 6 · Was gemessen wurde

```
node tests/run_alle.mjs                    90 grün, 0 rot, 0 nicht lauffähig
node tests/gegenprobe_unterlagen.mjs       14 von 14 gefangen
node tests/gegenprobe_antragsmappe.mjs     32 von 32 gefangen
node tests/gegenprobe_historie.mjs          9 von  9 gefangen
node tests/gegenprobe_arbeitstage.mjs      16 von 16 gefangen
Gedankenstriche in den neuen Texten         0
docs/PULS.md                                2.810 Zeilen
```

**Nicht gemessen:** Klaus' Sichttest. Ob `--nur` das Richtige druckt, ist an
Seitenzahlen und Textprobe geprüft (15 Seiten gegen 4 bis 5), nicht am Papier.

---

## 7 · Was offen bleibt

- **Klaus' Sichttest** der vier neuen Blätter am Tablet.
- **Der Werkzeug-Widerspruch in Paper A.** Unverändert seine Entscheidung, und
  sie gehört **vor** die Zenodo-Nummer: eine Zenodo-Fassung bleibt stehen.
- **Das Blatt „Stand der Technik und Abgrenzung".** Es existiert nicht, und
  **jede Fördergeberin liest es zuerst.** Von allem Fehlenden das mit der
  größten Wirkung je Seite.
- **Die englische Projektseite**, Grundlage für den OTF-Antrag.
- **Paper B und C**, geplant, nicht geschrieben. Für den Antrag reicht A.
- **Die Anmeldung nach § 5c**, und darin das ELSTER-Zertifikat als Engpass.
- Drei der fünf persönlichen Angaben aus § 9 sind weiter offen.
