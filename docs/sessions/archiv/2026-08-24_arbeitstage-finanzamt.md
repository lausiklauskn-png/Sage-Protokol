# Übergabeprotokoll 2026-08-24 · Die Arbeitstage einzeln

**Zweig:** `claude/research-funding-paper-delivery-vuppnj`
**Rolle:** Fortsetzung, dritter Auftrag desselben Tages.
**Auftrag:** Klaus: *„Kannst Du diese Tage einzeln auflisten, sodass wenn das
Finanzamt mal nachfragen sollte, ob ich wirklich so lange an den einzelnen
Tagen gearbeitet habe?"* Dazu, nachgereicht: *„Excel und PDF und in die
historie html"* und *„im Stil einer täglichen Dokumentation"*.

---

## 0 · Der Empfänger bestimmt die Bauart

Das Blatt kann einer Behörde vorgelegt werden. Alles Weitere folgt daraus, und
zwar nicht als Vorsicht, sondern als Statik: eine Aufstellung, die an einer
Stelle mehr behauptet, als sie belegt, verliert auch ihre belegten Zeilen.

---

## 1 · Der Befund, der vor dem Bauen kam

**Achtundvierzig Einträge stammen von `github-actions[bot]`**, zweiunddreißig
davon nachts um drei. Zeitgesteuerte Läufe, kein Mensch war dabei.

Ließe man sie stehen, wiese das Blatt **64,9 Stunden zu viel** aus, und zwar an
genau der Stelle, an der eine Prüfung zuerst hinsieht: eine Zeile „erster
Eintrag 03:04" an einem Tag, an dem in Wahrheit ab neun gearbeitet wurde.

**Eine Zahl, die man selbst nach unten korrigiert hat, trägt weiter als eine,
die jemand anders nach unten korrigieren muss.** Das Blatt schreibt hin, dass es
bereinigt, und beziffert, um wie viel.

Der Unterschied wird **gerechnet, nicht hingeschrieben**: `rechneTage` kennt
dafür den Schalter `automatikZaehlt`. Eine feste Zahl im Text würde stumm
veralten, sobald ein weiterer Lauf dazukommt. Das war der erste eigene Fehler
in dieser Runde, gefunden beim erneuten Lesen des eigenen Codes.

---

## 2 · Die Spalten sagen, was sie messen

Keine Spalte heißt „gearbeitet". Sie heißen *erster Eintrag*, *letzter
Eintrag*, *Spanne*, *aktive Zeit*.

| Formulierung | was sie ist |
|---|---|
| „19,9 h gearbeitet" | eine Behauptung, die bei der ersten Rückfrage fällt |
| „Spanne vom ersten bis zum letzten Eintrag: 19,9 h" | eine aus fremden Zeitstempeln nachprüfbare Tatsache |

**Die Überschrift trägt die Ehrlichkeit.** Deshalb steht darunter kein Absatz
voller Einschränkungen, und deshalb hat Klaus' Bitte, die Vorbehalts-Absätze
wegzulassen, hier keinen Widerspruch erzeugt: sie sind in die Spaltennamen
gewandert, nicht verschwunden.

Ein Wächter misst genau das: im Tabellenkopf darf weder „gearbeitet" noch
„Arbeitszeit" stehen, und jede Spalte trägt ihre Marke `data-spalte`.

---

## 3 · Die Zahlen

| | |
|---|---|
| Tage mit Arbeit | **128**, 10.03. bis 24.08.2026 |
| Spanne, aufsummiert | **1.935,9 h** |
| aktive Zeit, ohne Pausen | **1.186,6 h** |
| Einträge gezählt · herausgerechnet | 5.775 · 48 |

**Die Probe von außen:** der 22.08. war ein Samstag. Das Werkzeug misst 19,9
Stunden Spanne. Klaus hat denselben Tag unabhängig davon mit „zwanzig Stunden"
angegeben. Das ist kein Beweis der Methode, aber es ist der einzige Tag, an dem
eine unabhängige Angabe vorliegt, und sie stimmt überein.

Klaus' eigene Faustregel lautete 128 Tage mal acht Stunden, also 1.024. Die
gemessene aktive Zeit liegt darüber.

---

## 4 · Eine Quelle für die Rechnung

`tools/arbeitstage-rechnen.mjs` wird von **drei** Stellen benutzt: dem Blatt,
dem Abschnitt in `historie.html` und der Probe.

Dieselbe Lehre wie bei `historie-marken.mjs`: eine zweite Fassung würde
irgendwann etwas anderes zählen als das Blatt zeigt, **und beide wären grün**.
Die erste Fassung dieser Sitzung hatte die Rechnung im Blatt stehen; sie wurde
herausgezogen, bevor der Bericht sie zum zweiten Mal gebraucht hätte.

Die Regelzahlen (`LUECKE_MIN`, `VORLAUF_MIN`) stehen dort und werden im Blatt
**daraus** genannt. Ein Wächter prüft, dass der Text die Zahl des Moduls trägt;
die Gegenprobe setzt eine abweichende ein und sieht nach, ob es auffällt.

---

## 5 · Warum die Probe die Rechnung nicht nachbaut

Eine Probe mit eigener Rechnung prüft ihre eigene Rechnung. Sie wäre grün, wenn
beide denselben Denkfehler machen. Deshalb zwei getrennte Teile:

- **Teil A** misst die **Regeln** an erfundenen Tagen mit von Hand bekannter
  Antwort. Darunter die Grenzfälle: eine Lücke von genau 120 Minuten bleibt
  derselbe Abschnitt, drei Stunden beginnen einen neuen. Ein Wächter ohne beide
  Seiten hätte die Schwelle nie gemessen.
- **Teil B** misst, ob das Blatt wiedergibt, was das Modul rechnet.

Ein Fall aus Teil A ist in den echten Daten **unerreichbar**: ein Tag, an dem
ausschließlich der Dienst gelaufen ist. Es gibt ihn nicht, alle 128 Tage tragen
Einträge von Hand. Genau dafür sind die erfundenen Tage da. Die Gegenprobe sagt
das am Ende ihrer Ausgabe ausdrücklich, statt den Fall stumm zu lassen.

---

## 6 · Der BOM, und was er nicht kann

Klaus' Befund: die Dokumente erscheinen im Browser mit Fragezeichen.

Gemessen: die Dateien selbst sind gültiges UTF-8 mit `<meta charset="utf-8">`
an Byte 46, also weit innerhalb der ersten 1024 Bytes, die ein Browser
überhaupt danach absucht. **Der Fehler steckt im Weg, nicht im Inhalt.** Beim
Herunterladen geht die Angabe verloren, weil sie im Übertragungs-Kopf steht und
nicht in der Datei; Androids Betrachter rät dann Latin-1.

Ein BOM überstimmt jedes Raten. Blatt, Historie, Antragsmappe und beide
Tabellen tragen ihn jetzt. Die Downloads der Antragsmappe hatten ihn schon.
Geprüft wird an den **Bytes**, im Browser zusätzlich am gezeichneten Text: ein
Wächter auf die Datei sähe nicht, was der Browser daraus macht.

**Das ⓘ mit „Verbindung ist nicht sicher" bleibt stehen.** Das sagt Chrome über
den *Weg*, nicht über die Datei, und erscheint bei jedem `http://` und bei jeder
lokalen Datei. Keine Änderung am Dokument entfernt es; ein Schloss gibt es nur
über `https`. Ob Sage-Protokol über GitHub Pages ausliefert, war von hier nicht
zu prüfen, weil der Proxy `github.io` sperrt. **Das ist eine offene Frage, keine
Antwort**, und sie steht so im PULS.

---

## 7 · Das PDF kommt aus dem Browser

Das Blatt trägt bereits ein Druck-Stylesheet: wiederholte Tabellenköpfe, keine
Zeile über einen Umbruch, kein zerrissener Tageseintrag. Ein eigener
PDF-Erzeuger müsste das ein zweites Mal können, und die zwei Fassungen liefen
auseinander. Chromium druckt genau das, was auch auf Papier käme.

301 Seiten, mit Seitenzahlen: eine Aufstellung für eine Behörde ohne
Seitenzahlen ist nicht prüfbar. Das Werkzeug bricht ab, statt ein leeres PDF zu
schreiben, wenn `playwright-core` fehlt. **Ein halb erzeugtes PDF wäre
schlimmer als keines, es sieht wie ein Nachweis aus.**

---

## 8 · Was gemessen wurde

```
node tests/run_alle.mjs                  88 grün, 0 rot, 0 nicht lauffähig
node tests/gegenprobe_arbeitstage.mjs    16 von 16 gefangen
node tests/gegenprobe_historie.mjs        9 von  9 gefangen
node tests/gegenprobe_antragsmappe.mjs   32 von 32 gefangen
docs/PULS.md                             2.737 Zeilen, vorher 2.985
```

Ein Gegenproben-Fall rutschte beim ersten Lauf durch: er suchte den BOM als
**Zeichen**, im Bericht steht er als **Escape-Folge**. Zwei Schreibweisen
desselben Bytes. Der Fall sabotierte nichts und meldete korrekt „Anker greift
nicht" statt „gefangen", weil `ersetze` misst, ob sich die Datei wirklich
geändert hat. Berichtigt.

**Nicht gemessen:** Klaus' Sichttest am Tablet, besonders wie sich 301 Seiten
PDF und ein Blatt von einem Megabyte auf dem Gerät öffnen lassen.

---

## 9 · Was offen bleibt

- **Klaus' Sichttest** am Tablet, für Blatt, PDF und die beiden Tabellen.
- **Liefert Sage-Protokol über GitHub Pages aus?** Von hier nicht prüfbar. Davon
  hängt ab, ob das ⓘ verschwinden kann.
- Der **Werkzeug-Widerspruch in Paper A**, unverändert Klaus' Entscheidung, und
  zwar **vor** einer Zenodo-Nummer.
- Die **Anmeldung nach § 5c**, rückwärts vom 30.11.2026 gerechnet.
- Die **Striche in den zwei Byte-Kopien**, nur über Kimhub zu lösen.
