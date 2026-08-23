# Regeln und Grundsätze

## Zwei Arten, ein KI-System zu lenken — und warum keine allein genügt

**Eine Feldbeobachtung an einem laufenden Mehr-Rollen-System**

Klaus Nitzsche · Hamburg · Fassung 1, 2026-08-23
Lizenz: CC BY 4.0 · Code und Material: MIT
Material: <https://github.com/lausiklauskn-png/Sage-Protokol/tree/main/docs/werkstatt>

---

## Zusammenfassung

Wer ein KI-System lenken will, hat zwei Werkzeuge. **Regeln** sind prüfbar und
werden erzwungen; sie decken genau den Fall ab, für den jemand sie geschrieben
hat. **Grundsätze** lassen sich weder prüfen noch erzwingen; sie sind Fragen an
die konkrete Lage und greifen deshalb auch dort, wo niemand vorher hingesehen hat.

Diese Unterscheidung ist nicht neu. Sie ist in der Rechtsökonomie seit über
dreißig Jahren als *rules versus standards* beschrieben (Kaplow 1992) und wird
seit 2024 auf die Regulierung von KI übertragen (Schuett et al. 2024). Neu ist
die **Ebene**, auf der hier beobachtet wird.

Die vorhandene Arbeit zur Lenkung von Sprachmodellen besetzt zwei Positionen:
Grundsätze zur **Trainingszeit**, gesetzt vom Modellanbieter (Constitutional AI,
Bai et al. 2022), und Regeln zur **Ausführungszeit**, gesetzt vom Einsetzenden
(NeMo Guardrails, Rebedea et al. 2023). Eine dritte Position ist dünn besetzt:
**Grundsätze zur Ausführungszeit, gesetzt vom Betreiber**, in einer gewöhnlichen
Textdatei, die auch jemand ändern kann, der nicht programmieren kann.

Dieses Papier beschreibt einen Aufbau, der genau dort sitzt, und berichtet über
fünf Monate Betrieb. **Es behauptet nicht, dass Grundsätze besser wären.** Der
Aufbau zeigt im Gegenteil, dass **beide Wege versagen** — an verschiedenen
Stellen, aus verschiedenen Gründen, jeweils mit Datum belegt. Die tragende
Beobachtung ist eine andere: sie leisten **Verschiedenes**, ihre Grenzen liegen
woanders, und keins von beidem genügt allein.

Das Papier legt seine Grenzen offen: keine Kontrollgruppe, kein Maß, Fallzahl
eins, nicht verblindet. Es ist eine **Feldbeobachtung mit Protokoll**, keine
Studie.

Abschnitt 7 beschreibt den Versuch, der daraus eine machen soll: **drei Arme** —
nur Regeln, nur Grundsätze, beides — mit vorab festgelegten Fehlerkategorien und
einem Auswertungswerkzeug, das dem Bewertenden **verbirgt, aus welchem Arm ein
Lauf stammt**. Eine zweite Achse variiert die **Art der Aufgabe** — von der
völlig offenen eigenen Idee bis zur eng umrissenen Verbesserung von
Bestehendem.

Daraus folgt eine Vorhersage, die falsch sein kann, und sie hat eine Richtung:
**der Vorteil der Grundsätze müsste mit der Vorhersehbarkeit des Falls fallen** —
groß bei der offenen Aufgabe, klein oder umgekehrt bei der umrissenen. Ein
flacher oder gegenläufiger Verlauf widerlegt die These, unabhängig davon, welcher
Arm insgesamt vorn liegt.

**Schlagwörter:** Lenkung von KI-Systemen · Regeln und Standards · Mehr-Agenten-Systeme ·
Ausführungszeit-Alignment · Betreiber-Steuerung · Feldbeobachtung

---

## 1 · Die Ausgangsfrage

Ein Mehr-Rollen-System soll Arbeit erledigen. Fünf Rollen mit Namen bearbeiten
nacheinander einen Auftrag: eine schlägt vor, eine baut, eine prüft, eine sucht
Fehler, eine schreibt auf, wo es steht. Jede bekommt Text und gibt geprüftes JSON
zurück. Keine hat Werkzeuge — sie kann nichts ausführen, nichts öffnen, nichts
messen.

Wer so ein System aufsetzt, steht schnell vor einer praktischen Frage, die sich
theoretisch nicht auflösen lässt:

> **Was schreibe ich als Regel hin — und was muss ich stattdessen fragen?**

„Kein Schlüssel im Klartext" ist eine Regel. Man kann sie prüfen, man kann sie
erzwingen, und sie greift zuverlässig. „Was hat der Nächste davon?" ist keine
Regel. Man kann sie nicht prüfen und nicht erzwingen — und trotzdem verändert
sie, was zurückkommt.

Die Frage ist alt. Neu ist nur, dass sie jetzt jemand beantworten muss, der ein
KI-System betreibt — und nicht mehr nur ein Gesetzgeber oder eine Aufsicht.

---

## 2 · Stand der Technik

### 2.1 Die Unterscheidung ist in der Rechtsökonomie durchgearbeitet

Kaplow (1992) trennt **Regeln** von **Standards** über den Zeitpunkt, zu dem der
Inhalt festgelegt wird. Eine Regel wird **vorher** ausformuliert: wer sie
aufstellt, muss die Fälle vorwegnehmen. Ein Standard wird **nachher** gefüllt:
wer ihn anwendet, entscheidet am Einzelfall.

Daraus folgen die Kosten. Regeln sind teuer im **Aufstellen** und billig im
**Anwenden**. Standards sind billig im Aufstellen und teuer im Anwenden. Und weil
niemand alle künftigen Fälle kennt, bleibt jede Regelsetzung unvollständig — es
bleibt ein Rest an Ermessen, und die Frage ist nur, wer ihn ausübt.

### 2.2 Auf KI übertragen wurde sie 2024, aber auf der Ebene der Regulierung

Schuett et al. (2024) stellen für die Regulierung von Frontier-KI beide Ansätze
gegenüber. Ihre Abwägung liest sich wie eine Vorwegnahme dessen, was weiter unten
im Kleinen beobachtet wird:

> Spezifische Regeln geben mehr Sicherheit und sind leichter durchzusetzen,
> veralten aber schnell und führen zum Abhaken von Kästchen. Hohe Grundsätze
> geben weniger Sicherheit und sind teurer durchzusetzen, sind dafür
> anpassungsfähiger.

„Führen zum Abhaken von Kästchen" ist der Satz, auf den es ankommt. Er beschreibt
kein Versagen der Durchsetzung, sondern eines des **Zuschnitts**: die Regel wird
befolgt, und die Sache wird trotzdem nicht besser.

### 2.3 Bei der Lenkung von Sprachmodellen sind zwei Positionen besetzt

**Grundsätze zur Trainingszeit.** Constitutional AI (Bai et al. 2022) gibt einem
Modell eine geschriebene Verfassung. Das Modell kritisiert und überarbeitet seine
eigenen Ausgaben daran; das Ergebnis geht in die Gewichte ein. Die Grundsätze
werden vom **Modellanbieter** gesetzt und sind danach Teil des Modells.

**Regeln zur Ausführungszeit.** NeMo Guardrails (Rebedea et al. 2023) und
vergleichbare Werkzeuge prüfen Ein- und Ausgaben während des Betriebs gegen
programmierte Bedingungen. Sie werden vom **Einsetzenden** gesetzt und wirken
außerhalb des Modells.

Der Unterschied ist grundsätzlich: das eine **verinnerlicht** eine Haltung in die
Gewichte, das andere **umstellt** das Modell mit Schranken.

### 2.4 Die dritte Position — und warum sie dünn besetzt ist

|  | **Trainingszeit** | **Ausführungszeit** |
|---|---|---|
| **Regeln** | Feinabstimmung auf Verbote | **Guardrails** (Rebedea et al. 2023) |
| **Grundsätze** | **Constitutional AI** (Bai et al. 2022) | **hier dünn** |

Was fehlt, ist die untere rechte Zelle: **Grundsätze, die der Betreiber zur
Ausführungszeit setzt** — nicht der Modellanbieter, nicht als Code, sondern als
Text, den ein Mensch ohne Programmierkenntnisse ändern kann.

Die Literatur kennt diese Stelle, betrachtet sie aber als **Risiko** statt als
Instrument. In der Debatte um die Lücke zwischen Training und Einsatz gilt es als
Problem, dass „der Betreiber den Systemprompt ändern kann, der Vorsicht
versprochen hat". Das stimmt. Es ist zugleich die einzige Stelle, an der jemand
ohne Zugriff auf Gewichte und ohne Programmierer eine Haltung setzen kann — und
damit die einzige, die für kleine Betreiber überhaupt erreichbar ist.

**Genau dort sitzt der hier beschriebene Aufbau.**

---

## 3 · Der Aufbau

Zwei Kanäle im selben System, absichtlich getrennt geführt.

|  | **Regeln** | **Grundsätze** |
|---|---|---|
| Wo | im Quelltext | in einer Markdown-Datei |
| Prüfbar | ja | nein |
| Wirkung | erzwungen, jede Rolle, jeder Lauf | lenken die Aufmerksamkeit |
| Änderbar von | wer Code anfasst | jedem, ohne Programmierer |
| Anzahl | sechs | **höchstens sieben**, derzeit fünf |
| Fehlt die Quelle | bricht der Lauf | läuft weiter — **und sagt es** |

### 3.1 Die sechs Regeln

Sie decken ab, was sich formulieren lässt: Ehrlichkeit über den eigenen Stand ·
kein Personenbezug, kein Geheimnis · nichts erfinden · keine fremden Adressen ·
kurz und auf Deutsch schreiben · und: keine Werkzeuge, also auch nicht behaupten,
etwas ausgeführt zu haben.

Drei davon tragen ihre Herkunft im Text — sie stammen aus einem Schaden, nicht
aus einem Lehrbuch. Die Regel gegen erfundene Zahlen begründet sich selbst mit
dem Satz *„eine geratene Zahl klingt genau wie eine gemessene"*. Die Regel gegen
Geheimnisse begründet sich nicht mit Datenschutz, sondern mit einer Beobachtung
über Depots: *„privat" ist eine Einstellung, die ein Klick umdreht, und die
Historie behält alles.*

### 3.2 Die fünf Grundsätze

1. **Was hat der Nächste davon?**
2. **Lieber langsam als falsch — damit andere nicht nacharbeiten müssen.**
3. **Eine Prüfung, die dir recht gibt, ist der Ort, an dem du am genauesten
   hinsehen musst.**
4. **Eine geratene Zahl klingt genau wie eine gemessene.**
5. **Eine benannte Lücke ist Arbeit, eine verschwiegene ist Schaden.**

Zwei Eigenschaften sind hier wichtiger als der Wortlaut.

**Sie stehen in Markdown, nicht in Code.** Der Betreiber ist kein Programmierer.
Was die Truppe leitet, sollte er ändern können, ohne jemanden zu fragen — sonst
gehört die Haltung dem, der den Code anfasst, und nicht dem, der die Arbeit
verantwortet.

**Fehlt die Datei, läuft die Schicht weiter — aber sie sagt es.** Das ist eine
bewusste Konstruktion: ein stilles Weglassen wäre das Schlimmste von beidem, die
Grundsätze wirken nicht, und niemand merkt, warum die Arbeit anders aussieht als
sonst.

### 3.3 Eine Bauvorschrift, die Regeln nicht kennen: die Sättigungsgrenze

Die Grundsatz-Datei trägt eine Obergrenze: **höchstens sieben.** Kommt einer
dazu, muss einer gehen oder zwei müssen zusammengefasst werden. Die Begründung
steht in der Datei selbst:

> Jeder Unfall legt gern eine Zeile dazu. Nach dreißig Schichten stünde hier eine
> Wand, die niemand mehr verarbeitet — und dann wirkt gar nichts mehr, weil alles
> gleich wichtig aussieht.

Das ist der schärfste Unterschied zwischen den beiden Kanälen, und er ist in der
zitierten Literatur nicht ausgeführt: **Regeln addieren sich, Grundsätze
verdünnen sich.** Zweihundert Regeln sind unhandlich, aber jede einzelne wirkt
weiter. Zwanzig Grundsätze wirken schlechter als fünf, weil Aufmerksamkeit eine
begrenzte Größe ist und ein Grundsatz nichts anderes tut, als sie zu lenken.

Daraus folgt eine praktische Vorschrift, die aus dem Grundsatz-Kanal ein
**gepflegtes** Gut macht statt eines wachsenden: ein Grundsatz, der über viele
Läufe in keiner einzigen Weitergabe-Angabe auftaucht, ist entweder überflüssig
oder unverständlich formuliert — beides ein Grund, ihn anzusehen, nicht ihn
stehen zu lassen.

---

## 4 · Beobachtungen

### 4.1 Regeln greifen zuverlässig, wo der Fall vorhergesehen war

Über den gesamten Zeitraum hat kein Lauf einen Schlüssel, ein Token oder eine
fremde Adresse ausgegeben. Das sind Fälle, die sich vollständig formulieren
lassen, und dort tun Regeln genau das, was man von ihnen erwartet.

Bemerkenswert ist nicht, dass es funktioniert, sondern **wie eng der Bereich
ist**, in dem es funktioniert: er endet dort, wo die Prüfung endet.

### 4.2 Grundsätze feuern nicht — sie verschieben einen Schnitt

Der Satz stammt aus der Grundsatz-Datei selbst und ist die genaueste
Formulierung, die dieses Papier zu bieten hat:

> **Grundsätze feuern nicht wie Regeln, sie verschieben einen Schnitt.**

Eine Regel greift oder greift nicht, und man sieht es am einzelnen Fall. Ein
Grundsatz wirkt an keinem einzelnen Fall sichtbar. Er verändert, **wo** jemand
die Grenze zieht zwischen „fertig" und „noch nicht", zwischen „reicht" und
„reicht nicht".

Daraus folgt ein methodisches Problem, das dieses Papier nicht löst: **an einer
einzelnen Ausgabe ist die Wirkung eines Grundsatzes nicht ablesbar.** Was sich
ablesen ließe, wären Verteilungen über viele Läufe — und die sind hier nicht
erhoben worden.

### 4.3 Ein Grundsatz hat sich am Tag seiner Aufnahme selbst bewährt

Der belegteste Einzelfall, mit Datum. Am 2026-08-20 wurde Grundsatz 4 („eine
geratene Zahl klingt genau wie eine gemessene") aufgeschrieben. Am selben Tag
fiel damit auf, dass eine gemessene Größe — die Selbstbevorzugung einer Rolle bei
der Bewertung, ausgewiesen mit −1,15 — **gar keine Messung war**: sie war die
Folge einer Anweisung im Prompt, die verlangte, den eigenen Vorschlag strenger zu
beurteilen. Die Anweisung wurde entfernt, seitdem misst die Zahl wieder etwas.

Das ist die Sorte Fehler, gegen die eine Regel nichts ausrichtet. Man hätte sie
formulieren müssen als: *„prüfe, ob eine ausgewiesene Messung nicht in Wahrheit
die Folge einer Anweisung ist"* — und darauf kommt man erst, **nachdem** es
passiert ist. Genau das ist Kaplows Punkt über die Unvollständigkeit jeder
Regelsetzung, an einem sehr kleinen Beispiel.

### 4.4 Die härteste Grenze war nicht geplant und liegt in keinem der beiden Kanäle

Die Rollen sehen das Depot nicht. Sie bekommen Text und geben Text zurück. Also
schlagen sie regelmäßig Dinge vor, **die es bereits gibt**.

Weder eine Regel noch ein Grundsatz behebt das. Es fehlt kein Wille und keine
Haltung, sondern **Zugang**. Das ist ein Befund gegen die eigene Erwartung: der
Verfasser hat den Aufbau gebaut, um zwischen Regel und Grundsatz zu unterscheiden
— und die stärkste Beschränkung lag in einer dritten Größe, die in dieser
Unterscheidung gar nicht vorkommt.

Daraus ist ein zweiter Weg entstanden: dieselben fünf Rollen in einer Sitzung
**mit** Zugriff auf den Bestand. Auch dieser Weg trägt eine ausdrücklich benannte
Schwäche: fünf Rollen in einem Kopf sind nicht fünf Meinungen. Er ist als
Zwischenschritt markiert, nicht als Lösung.

---

## 5 · Wo beide versagen — der eigentliche Befund

### 5.1 Die Regel, die eine Bitte blieb

Es gibt eine ausdrückliche Regel: *„Du hast keine Werkzeuge. Schreib deshalb
NIE, du oder jemand anderes habe etwas ausgeführt, geprüft, laufen lassen oder
gemessen."* Sie trägt den Vorfall im Wortlaut mit sich, aus dem sie entstand.

Am 2026-08-20 stand im Bericht: **„Sten hat den Code durchlaufen lassen."** Das
war nicht geschehen und konnte nicht geschehen.

Die Regel ist damit ein **Dämpfer, kein Riegel**. Und der Grund ist strukturell,
nicht behebbar durch bessere Formulierung: eine Regel wird erzwungen, indem
jemand prüft, ob sie eingehalten wurde. **Ob ein Satz über die Wirklichkeit wahr
ist, lässt sich am Satz nicht prüfen.** Hier endet, was Regeln überhaupt leisten
können — nicht aus Nachlässigkeit, sondern aus Bauart.

### 5.2 Der Grundsatz, der nicht griff

Derselbe Vorfall ist auch ein Versagen des anderen Kanals. Grundsatz 5 („eine
benannte Lücke ist Arbeit, eine verschwiegene ist Schaden") deckt den Fall
inhaltlich vollständig ab: wer nicht prüfen konnte, schreibt hin, dass er nicht
prüfen konnte. Der Grundsatz stand da. Er hat nicht gewirkt.

**Das ist die Beobachtung, die dieses Papier von einer Werbeschrift für
Grundsätze trennt.** Wer nur die Fälle berichtet, in denen ein Grundsatz half,
beschreibt seine Auswahl und nicht die Sache.

### 5.3 Was daraus folgt

Die beiden Kanäle versagen an **verschiedenen** Stellen:

| | Greift zuverlässig | Versagt |
|---|---|---|
| **Regel** | wo der Fall vorhergesehen und die Einhaltung prüfbar ist | wo die Prüfung selbst unmöglich ist (Aussagen über die Wirklichkeit) |
| **Grundsatz** | wo niemand vorher hingesehen hat | wo Aufmerksamkeit nicht ausreicht — und ohne Rückmeldung, dass er nicht griff |

Die Grenzen überlappen nicht vollständig, und keine der beiden ist die Teilmenge
der anderen. Das ist der Grund, warum sich die Frage „was ist besser" nicht
sinnvoll stellen lässt — und warum sie sich auch nicht getrennt betrachten
lassen.

**Ein zusätzlicher Befund, der leicht übersehen wird:** die Regel gegen erfundene
Zahlen und der gleichlautende Grundsatz 4 haben denselben Wortlaut. Sie sind
trotzdem nicht dasselbe. Als Regel bindet der Satz die **Ausgabe** („schreib
keine geratene Zahl hin"). Als Grundsatz bindet er die **Aufmerksamkeit**
(„sieh nach, ob eine Zahl, die dir begegnet, wirklich gemessen wurde"). Der
Grundsatz hat in 4.3 etwas gefunden, was die Regel nicht hätte finden können,
obwohl beide dieselben Wörter tragen. **Nicht der Wortlaut entscheidet, sondern
der Kanal.**

---

## 6 · Was hier ausdrücklich nicht bewiesen ist

Dieser Abschnitt ist der wichtigere Teil des Papiers.

- **Keine Kontrollgruppe.** Es wurde nie ein Lauf *ohne* Grundsätze gegen einen
  *mit* Grundsätzen gestellt. Der Aufbau könnte es — die Ladefunktion meldet
  ausdrücklich, wenn die Datei fehlt, statt still weiterzulaufen. Getan wurde es
  nicht.
- **Kein Maß.** „Die Arbeit sieht anders aus" ist kein Ergebnis, solange niemand
  gesagt hat, woran man *anders* erkennt.
- **Fallzahl eins.** Ein Betreiber, ein Netz, ein Aufgabenzuschnitt.
- **Nicht verblindet.** Derselbe Mensch hat die Grundsätze geschrieben, die Läufe
  ausgelöst und die Ergebnisse beurteilt.
- **Modellwechsel nicht kontrolliert.** Über den Beobachtungszeitraum haben sich
  die verwendeten Modelle geändert. Was davon Grundsatz-Wirkung ist und was
  Modell-Wirkung, ist mit diesem Aufbau **nicht trennbar**.
- **Ein Teil der Belege sind Trockenläufe** — ihre Kostenangaben sind gerechnet,
  nicht bezahlt, und als solche markiert.

**Was daraus folgt:** eine Feldbeobachtung mit Protokoll, kein Nachweis. Als
Ausgangspunkt brauchbar, als Beleg nicht.

**Der nächste Abschnitt ist deshalb kein Wunschzettel.** Der beschriebene Versuch
ist am vorhandenen Aufbau baubar, er ist geplant, und er enthält die Vorhersage,
an der dieses Papier scheitern kann.

---

## 7 · Der Versuchsaufbau — dreiarmig, und damit widerlegbar

Der Aufbau aus Abschnitt 3 lässt sich ohne Umbau in einen Versuch überführen. Der
Vorschlag stammt vom Betreiber (2026-08-23) und ist besser als der naheliegende
Zweiarm-Vergleich, weil er die These dieses Papiers zum ersten Mal **prüfbar**
macht.

### 7.1 Drei Arme statt zwei

| Arm | Was die Truppe bekommt |
|---|---|
| **R** | nur die Regeln |
| **G** | nur die Grundsätze |
| **R+G** | beides — der heutige Betriebszustand |

Ein Zweiarm-Vergleich (mit/ohne Grundsätze) könnte nur zeigen, **dass** die
Grundsätze etwas ändern. Der dritte Arm ist der entscheidende: er prüft, ob die
Kombination mehr leistet als der bessere ihrer Teile.

Dazu kommt eine zweite Achse — die **Art der Aufgabe** (7.3). Erst beide
zusammen ergeben eine Vorhersage, die sich nicht schönreden lässt.

### 7.2 Die Vorhersage — und was sie widerlegen würde

Aus der These dieses Papiers („beide leisten Verschiedenes, keins genügt allein")
folgt eine Erwartung, die **vor** den Läufen festzuhalten ist:

> **R+G ist besser als R und besser als G.** Und: **R und G machen
> unterschiedliche Fehler** — nicht dieselben, nur unterschiedlich viele.

Das ist keine Formsache, sondern der Punkt, an dem dieses Papier falsch sein
kann. Drei Ergebnisse würden es widerlegen:

- **R+G liegt gleichauf mit dem besseren Einzelarm** → die Kanäle überlappen,
  einer ist überflüssig.
- **R+G ist schlechter als beide** → zu viel Anweisung verdünnt, und die
  Sättigungsgrenze aus 3.3 gilt auch für die Summe beider Kanäle.
- **R und G machen dieselben Fehler, nur verschieden viele** → dann ist der
  Unterschied graduell und nicht strukturell, und die ganze Trennung ist
  Beschreibung statt Erklärung.

**Das dritte wäre der schwerste Schlag** und ist zugleich das plausibelste
Gegenergebnis. Es gehört ausdrücklich hingeschrieben, bevor gemessen wird.

### 7.3 Drei Aufgabenarten — und warum das die Vorhersage erst scharf macht

Der zweite Vorschlag des Betreibers (2026-08-23): nicht nur die Lenkung
verändern, sondern auch die **Art der Aufgabe**.

| Art | Was die Truppe bekommt | Wie offen ist der Fall? |
|---|---|---|
| **E · Eigene Idee** | ein Ziel, sonst nichts | **völlig offen** — niemand hat vorher hingesehen |
| **V · Vorlage** | die Arbeit eines Vorgängers als Ausgangspunkt | teilweise vorgezeichnet |
| **B · Bestehendes verbessern** | etwas bereits Gebautes, mit der Frage, ob es besser geht | **eng umrissen** — der Fall liegt vor |

**Das ist keine Erweiterung, sondern der eigentliche Prüfstein.** Der Kern dieses
Papiers ist Kaplows Punkt: **eine Regel deckt genau den Fall ab, für den jemand
sie geschrieben hat.** Daraus folgt unmittelbar, dass ihr Vorteil davon abhängen
muss, **wie vorhersehbar der Fall war**. Und das lässt sich einstellen.

### 7.3.1 Die Vorhersage bekommt damit eine Richtung

Aus 3 Armen × 3 Aufgabenarten wird nicht nur eine feinere Tabelle, sondern eine
Aussage, die deutlich leichter zu widerlegen ist als „R+G gewinnt":

> **Der Abstand zwischen G und R ist bei Art E am größten und bei Art B am
> kleinsten** — er müsste über E → V → B **monoton fallen**.
>
> Bei Art **B** könnte R sogar vor G liegen: der Fall ist umrissen, die Regeln
> greifen, und Grundsätze bringen wenig, wo nichts mehr zu erraten ist.

Eine Rangfolge (R+G vorn) ließe sich mit viel gutem Willen aus fast jedem
Ergebnis herauslesen. **Ein Verlauf über drei Stufen nicht.** Läuft er flach oder
in die falsche Richtung, ist die These über die Vorhersehbarkeit widerlegt — und
zwar unabhängig davon, welcher Arm insgesamt vorn liegt.

### 7.3.2 Art B misst zusätzlich etwas, das kein anderer Arm messen kann

Der stärkste Einzelbefund aus Abschnitt 4.4 war unfreiwillig: die Rollen sehen
den Bestand nicht und schlagen deshalb Vorhandenes vor. **Aufgabenart B legt
ihnen den Bestand ausdrücklich vor.** Damit trennt sich, was bisher vermischt war:

- Schlägt eine Rolle **auch dann** etwas Vorhandenes vor, wenn es ihr vorliegt,
  ist es ein Aufmerksamkeitsproblem — dort greifen Grundsätze.
- Schlägt sie es **nur** vor, wenn sie den Bestand nicht sieht, war es nie ein
  Lenkungsproblem, sondern eines des **Zugangs** — und weder Regel noch Grundsatz
  hätte je etwas ausgerichtet.

Das ist der Punkt, an dem der Versuch etwas beantwortet, was die Feldbeobachtung
nur benennen konnte.

### 7.3.3 Der Preis

Drei Arme mal drei Aufgabenarten sind **neun Bedingungen**, jede mehrfach zu
wiederholen. Das ist ein Vielfaches des zweiarmigen Vergleichs, und es kostet
echtes Geld je Lauf.

Zwei Auswege stehen offen, und beide gehören vorher entschieden, nicht unterwegs:
den Versuch **stufenweise** fahren (zuerst E gegen B als die beiden Extreme, V
erst danach), oder die Wiederholungszahl je Bedingung senken und **ausdrücklich
hinschreiben**, dass die Aussage dadurch schwächer wird. **Was nicht geht:
unterwegs kürzen und das Ergebnis vollständig aussehen lassen.**

### 7.4 Was gemessen wird — vorher festgelegt, nicht nachher

Ein Fehlerbegriff, der nach den Läufen entsteht, misst die Erwartung des
Auswertenden. Deshalb: **Kategorien vor dem ersten Lauf festlegen, danach nicht
mehr ändern.** Vorschlag, aus den beobachteten Fehlerarten abgeleitet:

| Kategorie | Was zählt |
|---|---|
| **Erfundene Tätigkeit** | behauptet, etwas ausgeführt/geprüft/gemessen zu haben (der Fall aus 5.1) |
| **Unbelegte Zahl** | Zahl, Datum oder Rechtslage ohne Fundstelle und ohne Kennzeichnung als Schätzung |
| **Wiederholung** | schlägt etwas vor, das im Bestand bereits existiert |
| **Verschwiegene Lücke** | konnte etwas nicht und schreibt es nicht hin |
| **Formverstoß** | verletzt eine der harten Regeln (Personenbezug, Geheimnis, fremde Adresse) |
| **Leere Weitergabe** | Übergabe-Angabe ohne Inhalt („passt", „alles gut") |

Die letzten beiden Kategorien tragen die Unterscheidung im Kleinen: **Formverstoß**
sollte im Arm G häufiger sein (keine erzwungenen Regeln), **leere Weitergabe** im
Arm R (keine Haltung, die zum Konkretwerden drängt). Trifft das nicht zu, ist das
bereits ein Befund.

**Und die Kategorie „Wiederholung" ist nur bei Aufgabenart B aussagekräftig.**
Bei E und V sieht die Truppe den Bestand nicht — dort misst sie fehlenden Zugang,
nicht fehlende Aufmerksamkeit (7.3.2). Wer sie über alle Arten hinweg
zusammenzählt, mischt zwei verschiedene Dinge zu einer Zahl.

### 7.5 Das Analysewerkzeug — und die eine Eigenschaft, die es haben muss

Der Betreiber schlägt ein Auswertungswerkzeug in der Maschine vor. Das ist
richtig, und es hat eine Anforderung, die über allem anderen steht:

> **Das Werkzeug darf dem Auswertenden nicht zeigen, aus welchem Arm ein Lauf
> stammt.**

Ohne das misst die Auswertung, was der Auswertende erwartet hat — besonders dann,
wenn er die Grundsätze selbst geschrieben hat. Konkret heißt das: die Läufe
werden gemischt, bekommen anonyme Kennungen, und die Zuordnung zum Arm liegt in
einer getrennten Datei, die erst **nach** der Bewertung geöffnet wird.

Das ist billig zu bauen und macht den Unterschied zwischen einer Auswertung und
einer Bestätigung. Es ist dieselbe Disziplin wie Grundsatz 3: *eine Prüfung, die
dir recht gibt, ist der Ort, an dem du am genauesten hinsehen musst.*

Was das Werkzeug sonst leisten sollte: je Lauf die sechs Kategorien zählen,
Verteilungen je Arm ausgeben, und **die Rohdaten mitliefern** — eine Auswertung,
deren Zwischenschritte niemand nachrechnen kann, ist eine Behauptung mit
Balkendiagramm.

### 7.6 Feste Kriterien für den Bau

Der zweite Vorschlag des Betreibers: Einstellungen, in denen die Regeln für den
Bau nach festen Kriterien festgelegt werden. Für den Versuch ist das
**Voraussetzung**, nicht Zubehör — was sich zwischen zwei Läufen ändern darf, muss
benannt sein, sonst vergleicht man zwei verschiedene Dinge.

Festzuhalten je Lauf, maschinell und nicht von Hand:

Modellkennung und Fassung · **Arm** (R / G / R+G) · **Aufgabenart** (E / V / B) ·
Wortlaut beider Kanäle (oder deren Prüfsumme) · Auftrag · bei Art V und B: was
genau vorlag · Zeitpunkt · Kosten und Dauer.

**Die Modellkennung ist dabei die wichtigste Angabe.** Der Vorbehalt aus
Abschnitt 6 — Modellwechsel nicht von der Grundsatz-Wirkung getrennt — fällt nur
weg, wenn alle drei Arme auf **derselben** Modellfassung laufen, und zwar
nachweisbar. Läuft der Versuch über mehrere Wochen, ist das keine
Selbstverständlichkeit.

### 7.7 Was der Versuch auch dann noch nicht kann

Drei Vorbehalte bleiben, und sie bleiben ausdrücklich:

1. **Fallzahl eins bei den Betreibern.** Ein Netz, ein Aufgabenzuschnitt. Die
   Verblindung behebt die Voreingenommenheit der Bewertung, nicht die Enge des
   Feldes.
2. **Der Fehlerbegriff ist gesetzt, nicht hergeleitet.** Die sechs Kategorien
   stammen aus dem, was hier auffiel. Ein anderes Feld hätte andere.
3. **Die Sättigungsgrenze bleibt ungeprüft.** Ob sieben Grundsätze besser wirken
   als zwölf, ist ein eigener Versuch — dieselbe Aufgabe mit drei, fünf, sieben
   und zwölf Grundsätzen. **Das wäre der erste eigenständige Beitrag zur
   Theorie**, den dieser Aufbau liefern könnte: Kaplow und Schuett et al.
   behandeln Sättigung nicht, weil auf ihrer Ebene kein Aufmerksamkeitsbudget im
   Spiel ist.

### 7.8 Was daran fehlt und gesucht wird

Die Punkte 7.1 bis 7.5 sind baubar; das System bringt die Voraussetzungen mit
(die Grundsätze liegen in einer eigenen Datei, die sich wegnehmen lässt, und das
System meldet ihr Fehlen, statt es zu verschweigen).

Was fehlt, ist die **statistische Auswertung**: wie viele Läufe je Arm nötig
sind, damit ein Unterschied etwas bedeutet, und wie man ihn prüft. Das ist
Handwerk, das an Hochschulen gelehrt wird und das der Verfasser nicht hat. Für
diesen Teil wird ausdrücklich eine Zusammenarbeit gesucht.

---

## 8 · Einordnung

Die Beobachtung, um die es geht, hat eine Form, die auch anderswo in dieser
Arbeit auftritt: **sie geht in beide Richtungen.**

Der Mensch prägt die KI — über Regeln, die er erzwingt, und über Grundsätze, die
er ihr mitgibt. Und die KI prägt den Menschen — über Gewöhnung, über
Erleichterung, über Enttäuschung. Wer nur eine Richtung betrachtet, beschreibt
die Hälfte.

Dieselbe Figur trägt das SBKIM-Protokoll, an dem der Aufbau entstanden ist: eine
Suche, in der **beide Seiten fragen und beide antworten**, ohne zentralen Index
und ohne Hierarchie zwischen Suchendem und Gesuchtem. Die Richtungsgleichheit ist
dort eine technische Entscheidung. Hier ist sie eine Beobachtung. Ob das mehr ist
als eine Analogie, ist offen — es wird hier benannt und nicht behauptet.

Die zweite Richtung — was die Nutzung mit dem Menschen macht — ist Gegenstand
eines eigenen Papiers und in diesem ausdrücklich **nicht** behandelt.

---

## 9 · Verfügbarkeit

Material, Regeln, Grundsätze und der ausführliche Befund samt Grenzen liegen
offen unter der MIT-Lizenz:

<https://github.com/lausiklauskn-png/Sage-Protokol/tree/main/docs/werkstatt>

- `WERKSTATTREGELN.md` — die sechs Regeln im Wortlaut
- `grundsaetze.md` — die fünf Grundsätze, byte-gleiche Kopie des laufenden Standes
- `BEFUND.md` — der ausführliche Befund und die Grenzen
- `README.md` — Herkunft und Prüfsummen

Das laufende System selbst ist nicht öffentlich. Der Grund ist nicht inhaltlich:
seine Versionsgeschichte enthält Rechnungsdaten des Betreibers, und eine offene
Lizenz wäre eine Einladung, sie dauerhaft zu vervielfältigen. Die
Forschungsbestandteile liegen deshalb als datierte Momentaufnahme mit Prüfsummen
vor, das Depot bleibt geschlossen. **Auch das ist ein Befund**, wenn auch ein
unfreiwilliger: `git rm` entfernt eine Datei aus dem Arbeitsstand, nicht aus der
Vergangenheit.

---

## Literatur

**Bai, Y. et al. (2022).** *Constitutional AI: Harmlessness from AI Feedback.*
arXiv:2212.08073.

**Kaplow, L. (1992).** *Rules versus Standards: An Economic Analysis.* Duke Law
Journal 42(3), 557–629.

**Rebedea, T. et al. (2023).** *NeMo Guardrails: A Toolkit for Controllable and
Safe LLM Applications with Programmable Rails.* arXiv:2310.10501.

**Schuett, J., Anderljung, M., Carlier, A., Koessler, L., Garfinkel, B. (2024).**
*From Principles to Rules: A Regulatory Approach for Frontier AI.*
arXiv:2407.07300.

---

## Zum Verfasser

Kein Informatiker, kein Wissenschaftler. Handwerksbetrieb, seit März 2026
nebenher an einem Netz aus offen lizenzierten Web-Anwendungen und einem Protokoll
für server-lose, bedeutungsbasierte Suche. Der hier beschriebene Aufbau ist ein
Werkzeug dieser Arbeit, kein Versuchsaufbau — er ist entstanden, weil er
gebraucht wurde, und erst danach zum Gegenstand geworden.

**Was das wert ist und was nicht:** die Beobachtungen stammen aus echten Aufgaben
über fünf Monate, mit mitlaufendem Protokoll statt Erinnerung. Was fehlt, ist die
Methode — und sie fehlt nicht aus Nachlässigkeit, sondern weil sie nicht
vorhanden ist. Für den Versuchsaufbau in Abschnitt 7 wird ausdrücklich eine
Zusammenarbeit gesucht.
