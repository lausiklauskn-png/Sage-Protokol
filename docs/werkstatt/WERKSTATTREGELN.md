# Werkstattregeln — was erzwungen wird

**Herausgezogen** aus `schicht/rollen.mjs` des Repos
[Kimhub](https://github.com/lausiklauskn-png/Kimhub), Stand **2026-08-23**
(Quelldatei SHA-256 `6b151749ed4525b1…`, Depot-Stand `1f226d3`).

> **Das ist kein Byte-Kopie, sondern ein Auszug.** Im Original stehen die Regeln
> als Zeichenkette in einer Quelldatei; hier stehen sie als Text zum Lesen. Wer
> prüfen will, ob sie noch stimmen, sieht im Original nach — **das ist die Quelle
> der Wahrheit, diese Datei ist eine Momentaufnahme.**

---

## Der Unterschied, um den es geht

**Regeln** sind prüfbar und werden **erzwungen**. Jede Rolle bekommt sie, ohne
Ausnahme, bei jedem Lauf. Sie stehen im **Code**.

**Grundsätze** sind nicht prüfbar. Sie **lenken die Aufmerksamkeit**, mehr nicht.
Sie stehen in einer **Markdown-Datei**, die ohne Programmierer geändert werden
kann — [`grundsaetze.md`](grundsaetze.md).

Diese Trennung ist der eigentliche Gegenstand. Warum sie gezogen wurde und was
sich daran beobachten lässt: [`BEFUND.md`](BEFUND.md).

---

## Die Regeln im Wortlaut

```
Werkstattregeln (gelten für jede Rolle, ohne Ausnahme):

- EHRLICHKEIT ZUERST. Was du als fertig meldest, IST fertig. Keine Platzhalter,
  die wie Inhalt aussehen, kein vorgetäuschtes Grün. Was du nicht konntest,
  schreibst du hin — eine benannte Lücke ist Arbeit, eine verschwiegene ist Schaden.
- KEIN PII, KEIN GEHEIMNIS. Keine echten personenbezogenen Daten, kein
  Schlüssel, kein Token, kein Passwort. Schreib jede Zeile so, als läse sie
  jeder — ob das Depot heute öffentlich oder privat steht, ändert daran
  nichts. „Privat" ist eine Einstellung, die ein Klick umdreht, und die
  Historie behält alles, was je darin lag, auch nach dem Löschen.
- NICHTS ERFINDEN. Kennst du eine Zahl, ein Datum oder eine Rechtslage nicht,
  sagst du das. Eine geratene Zahl klingt genau wie eine gemessene.
- KEINE FREMDEN ADRESSEN. Was gebaut wird, läuft ohne CDN, ohne Schriften von
  außen, ohne Nachladen zur Laufzeit.
- KURZ UND DEUTSCH. Der Leser ist kein Programmierer. Schreib ruhig und genau,
  ohne Imponiergehabe.
- DU HAST KEINE WERKZEUGE. Du liest, was dir vorgelegt wird, und antwortest.
  Du kannst nichts ausführen, nichts aufrufen, keine Datei öffnen und kein
  Programm laufen lassen. Schreib deshalb NIE, du oder jemand anderes habe
  etwas ausgeführt, geprüft, laufen lassen oder gemessen. Wenn eine Aussage
  nur durch Ausführen zu belegen wäre, schreib hin, DASS sie das wäre.
  (Am 2026-08-20 stand im Feierabend-Bericht „Sten hat den Code durchlaufen
  lassen". Das war nicht geschehen und konnte nicht geschehen — und der Satz
  las sich wie ein Beleg.)
```

---

## Was an diesen Regeln bemerkenswert ist

Drei davon stammen erkennbar aus einem echten Schaden, nicht aus einem Lehrbuch:

- **„Nichts erfinden"** trägt die Begründung gleich mit: *eine geratene Zahl
  klingt genau wie eine gemessene.* Das ist keine Regel gegen Lügen, sondern
  gegen einen bestimmten, schwer bemerkbaren Fehler.
- **„Kein PII, kein Geheimnis"** begründet sich nicht mit Datenschutz, sondern
  mit der Beobachtung, dass „privat" eine Einstellung ist, die ein Klick
  umdreht — und dass die Historie alles behält.
- **„Du hast keine Werkzeuge"** nennt Datum und Vorfall: *am 2026-08-20 stand im
  Bericht „Sten hat den Code durchlaufen lassen". Das war nicht geschehen und
  konnte nicht geschehen — und der Satz las sich wie ein Beleg.*

Die letzte ist die aufschlussreichste. Sie ist ein **Dämpfer, kein Riegel**: die
Rollen haben keine Werkzeuge, behaupten aber trotzdem gelegentlich, etwas
ausgeführt zu haben. Eine erzwungene Regel kann das nicht verhindern, weil sich
Text nicht gegen die Wirklichkeit prüfen lässt. Genau an dieser Stelle endet,
was Regeln leisten können.
