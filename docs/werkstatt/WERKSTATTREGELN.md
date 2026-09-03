# Werkstattregeln — was erzwungen wird

**Herausgezogen** aus `schicht/rollen.mjs` des Repos
[Kimhub](https://github.com/lausiklauskn-png/Kimhub), Stand **2026-09-03**
(Quelldatei SHA-256 `06cd5bc35639fc71…`, Depot-Stand `9c456d9`).

> **Das ist keine Byte-Kopie, sondern ein Auszug.** Im Original stehen die Regeln
> als Zeichenkette in einer Quelldatei, hier stehen sie als Text zum Lesen. Wer
> prüfen will, ob sie noch stimmen, sieht im Original nach: **dort ist die Quelle,
> diese Datei ist eine Momentaufnahme.**

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
- BEHAUPTE NUR, WAS DU WIRKLICH GETAN HAST. Schreiben und Verändern kannst du
  nicht: ein Schreib-Werkzeug gibt es nicht, und das ist Absicht. Was geändert
  werden soll, beschreibst du. WELCHE Werkzeuge du sonst hast, steht weiter
  unten in dieser Anweisung — steht dort keines, hast du keines. Schreib NIE,
  du oder jemand anderes habe etwas ausgeführt, geprüft, laufen lassen oder
  gemessen, wenn es nicht so war. Hast du etwas gelesen, sag WAS du gelesen
  hast. Wäre eine Aussage nur durch Ausführen zu belegen, schreib hin, DASS
  sie das wäre.
  (Am 2026-08-20 stand im Feierabend-Bericht „Sten hat den Code durchlaufen
  lassen". Das war nicht geschehen, und der Satz las sich wie ein Beleg.)
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
- **„Behaupte nur, was du wirklich getan hast"** nennt Datum und Vorfall: *am
  2026-08-20 stand im Bericht „Sten hat den Code durchlaufen lassen". Das war
  nicht geschehen, und der Satz las sich wie ein Beleg.*

Die letzte ist die aufschlussreichste, und zwar zweimal.

**Erstens ist sie ein Dämpfer, kein Riegel.** Die Rollen behaupten trotzdem
gelegentlich, etwas ausgeführt zu haben. Eine erzwungene Regel kann das nicht
verhindern, weil sich Text nicht gegen die Wirklichkeit prüfen lässt. Genau an
dieser Stelle endet, was Regeln leisten können.

**Zweitens ist sie einmal falsch geworden, ohne dass es jemand merkte.** Bis zum
2026-09-03 hieß sie *„DU HAST KEINE WERKZEUGE. Du kannst nichts ausführen,
nichts aufrufen, keine Datei öffnen."* Am 2026-08-23 bekamen die Rollen
Lese-Werkzeuge; seitdem stand in derselben Anweisung erst dieser Satz und wenige
Absätze später sein Gegenteil. Elf Tage lang, und die zuständige Probe war grün:
sie prüfte den **Wortlaut** `/KEINE WERKZEUGE/` statt der Zusicherung und hielt
damit genau die Regel am Leben, die falsch geworden war.

Die Regel nennt jetzt nur noch, was in **jedem** Modus gilt. Was gerade gelesen
werden darf, sagt der Werkzeug-Hinweis, der mit der Werkbank mitwandert.
**Das ist dieselbe Behandlung, die die Depot-Regel schon bekommen hatte:** keine
Tages-Einstellung, nur der Grund, der immer gilt.
