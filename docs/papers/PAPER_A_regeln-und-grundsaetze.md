# Regeln und Grundsätze

## Zwei Arten, ein KI-System zu lenken, und warum keine allein genügt

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

Der Unterschied ist bei Menschen alltäglich: wer an der roten Ampel hält, weil
er die Strafe fürchtet, verhält sich anders als jemand, der hält, weil dort
jemand über die Straße gehen könnte. Sichtbar wird es erst nachts um drei an der
leeren Kreuzung, oder wenn ein Rettungswagen durch muss. **Bei einem KI-System
fällt allerdings beides weg, Strafangst wie Sorge um den Nächsten.** Was bleibt,
ist die Form der Anweisung: nennt sie den Fall oder den Zweck? Das Papier führt
das Bild ein und zeigt, wo es bricht (1.1 und 1.2).

Die Unterscheidung selbst ist nicht neu. Sie ist in **fünf** Feldern
durchgearbeitet: Philosophie (Kant 1785, Legalität und Moralität),
Entwicklungspsychologie (Kohlberg), Rechtssoziologie (Tyler 1990: Legitimität
trägt weiter als Abschreckung), Rechtsökonomie (Kaplow 1992, *rules versus
standards*) und seit 2024 die KI-Regulierung (Schuett et al. 2024). Auf der
KI-Seite ist die Schwäche des Regel-Kanals als *specification gaming* gut belegt.
Neu ist die **Ebene**, auf der hier beobachtet wird.

Eine zweite Eigenschaft wiegt im Betrieb schwerer als die Reichweite und kommt in
der Literatur nur am Rand vor: **Haltbarkeit**. Eine Regel im Text wird von
demselben System **gelesen**, das sie binden soll, und ist damit zugleich eine
Angriffsfläche. Sie ist eine Bedingung, und jede Bedingung hat einen Rand, an
dem man knapp innen stehen kann. Ein Grundsatz hat diesen Rand nicht. Zugleich
altert ein Regelwerk mit der Umgebung und muss gepflegt werden, ein Grundsatz
nicht. Kurz: **eine Regel kann erfüllt werden, ohne getroffen zu sein; ein
Grundsatz kann übergangen werden, ohne verletzt zu sein**, und **Haltbarkeit und
Nachweisbarkeit lassen sich nicht im selben Kanal haben** (3.8).

Beobachtet wird an einem **laufenden Aufbau**. Das Depot *Sage-Protokol* läuft seit dem 10. März 2026 und ist
seither durchgehend protokolliert; daraus ist die Frage überhaupt entstanden. Auf
dieser Grundlage entstand die **Werkstatt**: fünf Rollen mit Namen arbeiten
nacheinander an einem Auftrag, ein Durchgang heißt **Schicht**, er hat einen
Kosten-Deckel von fünf Euro und wird mitgeschrieben: Aufrufe, Token, Kosten,
Dauer. Beide Kanäle, Regeln wie Grundsätze, gehen bei jedem Aufruf als Text mit
(Abschnitt 3). **Zwei Zeiträume gehören dabei auseinandergehalten:** die
Dokumentation reicht über fünf Monate, die Messung über Tage. Wo im Papier eine
gemessene Zahl steht, stammt sie aus dem zweiten.

**Der erste ist seit dem 2026-08-24 kein ungefährer mehr.** Die Git-Historie
aller 33 Depots wurde ausgelesen und ausgezählt: **5.823 Commits an 128
Arbeitstagen, vom 10.03. bis zum 24.08.2026**, über 1.388 Zweige, davon 1.662
Commits, die nie auf einem Hauptzweig ankamen. Die Quelle liegt offen
([`../historie/`](../historie/)). Sie belegt, *dass* und *wann* gearbeitet
wurde, nicht *wie lange* an einem Tag, und wird hier auch nicht so verwendet.

Aus derselben Richtung folgt ein praktischer Nebenbefund: **mehrere Regeln, die
denselben Zweck zuspitzen, lassen sich durch den einen Grundsatz ersetzen, aus dem
sie stammen.** Die naheliegende Sparsamkeits-These ist dabei durch die eigene
Rechnung widerlegt. Es ist nicht die Anweisung, die kostet, sondern die **Arbeit**
(3.9).

Ein Befund aus der Verhaltensökonomie verschärft dabei die eigene Vorhersage:
Gneezy und Rustichini (2000) zeigten, dass eine eingeführte Strafe das
unerwünschte Verhalten **vermehrte**, die Regel ersetzte die Norm, statt sie zu
stützen, und der Schaden blieb nach Abschaffung der Strafe bestehen. Ob es hier
eine Entsprechung gibt, ist offen; sie würde nicht am Beweggrund ansetzen (den
ein KI-System nicht hat), sondern an der **Aufmerksamkeit**, und wäre mit dem
beschriebenen Aufbau prüfbar.

Die vorhandene Arbeit zur Lenkung von Sprachmodellen besetzt zwei Positionen:
Grundsätze zur **Trainingszeit**, gesetzt vom Modellanbieter (Constitutional AI,
Bai et al. 2022), und Regeln zur **Ausführungszeit**, gesetzt vom Einsetzenden
(NeMo Guardrails, Rebedea et al. 2023). Eine dritte Position ist dünn besetzt:
**Grundsätze zur Ausführungszeit, gesetzt vom Betreiber**, in einer gewöhnlichen
Textdatei, die auch jemand ändern kann, der nicht programmieren kann.

Der oben beschriebene Aufbau sitzt genau dort, und dieses Papier berichtet aus
seinem Betrieb. Vier Fälle werden **durchgeführt** statt beschrieben: dieselbe
Lage, einmal durch den Regel-Kanal und einmal durch den Grundsatz-Kanal betrachtet,
mit dem, was tatsächlich geschah. Einer der vier zeigt zwei Anweisungen mit
**denselben Wörtern**, die verschieden entscheiden, nicht der Wortlaut trennt die
Kanäle, sondern was sie binden: die **Ausgabe** oder die **Aufmerksamkeit**. **Die beiden sind dabei nicht gleichrangig.** Der Grundsatz ist die Grundlage,
die Regel seine **Zuspitzung auf einen Fall**. Man kann jede vernünftige Regel
nach ihrem Wozu fragen, und die Antwort ist ein Grundsatz. Daraus erklärt sich,
warum eine Regel erfüllt sein kann, ohne getroffen zu sein, und warum sie altert:
sie ist ein **Stellvertreter**, und der Stellvertreter ist nicht die Sache (3.5).
Daraus folgt ein Begriffspaar, das die Richtung im Namen trägt: eine
**grundsatzbasierte Regel** ist die tragfähige Bauform, ein **regelbasierter
Grundsatz** ist der Fehler, der dabei entsteht, wenn man die Entstehungsrichtung
für die Begründungsrichtung hält.

**Es behauptet nicht, dass Grundsätze besser wären.** Der
Aufbau zeigt im Gegenteil, dass **beide Wege versagen**, an verschiedenen
Stellen, aus verschiedenen Gründen, jeweils mit Datum belegt. Die tragende
Beobachtung ist eine andere: sie leisten **Verschiedenes**, ihre Grenzen liegen
woanders, und keins von beidem genügt allein.

Das Papier legt seine Grenzen offen: keine Kontrollgruppe, kein Maß, Fallzahl
eins, nicht verblindet. Es ist eine **Feldbeobachtung mit Protokoll**, keine
Studie.

Abschnitt 7.10 behandelt die Rückkopplung, ob ein System aus den eigenen
Ergebnissen neue Grundsätze ableiten kann. Erkennen ja, formulieren nein: **ein
aus beobachteten Vorfällen abgeleiteter Grundsatz ist eine Regel im Gewand eines
Grundsatzes**, weil er nur abdecken kann, was schon eingetreten ist. Nützlich ist
die Rückkopplung trotzdem, nicht zum Schreiben, sondern zum **Pflegen**.

Abschnitt 7.9 beantwortet zudem, was das System **selbst** beweisen kann: die
Buchführung über die Bedingungen, die entscheidbaren Fehlerarten, darunter die
behauptete Ausführung, denn die Maschine weiß, welche Werkzeuge sie ausgegeben
hat, die Wiederholbarkeit, und die **Einhaltung der Verblindung**, festgenagelt
durch im Voraus veröffentlichte Prüfsummen statt durch Beteuerung. Was es
strukturell **nicht** kann, ist beurteilen, welche Ausgabe besser ist.

Abschnitt 7 beschreibt den Versuch, der daraus eine machen soll: **drei Arme**,
nur Regeln, nur Grundsätze, beides, mit vorab festgelegten Fehlerkategorien und
einem Auswertungswerkzeug, das dem Bewertenden **verbirgt, aus welchem Arm ein
Lauf stammt**. Eine zweite Achse variiert die **Art der Aufgabe**, von der
völlig offenen eigenen Idee bis zur eng umrissenen Verbesserung von
Bestehendem.

Daraus folgt eine Vorhersage, die falsch sein kann, und sie hat eine Richtung:
**der Vorteil der Grundsätze müsste mit der Vorhersehbarkeit des Falls fallen**,
groß bei der offenen Aufgabe, klein oder umgekehrt bei der umrissenen. Ein
flacher oder gegenläufiger Verlauf widerlegt die These, unabhängig davon, welcher
Arm insgesamt vorn liegt.

---

## 1 · Die Ausgangsfrage

Ein Mehr-Rollen-System soll Arbeit erledigen. Fünf Rollen mit Namen bearbeiten
nacheinander einen Auftrag: **jede schlägt aus ihrer Sicht eine Idee vor**, eine
baut die gewählte, eine prüft, eine sucht Fehler, eine schreibt auf, wo es steht.
Jede bekommt Text und gibt geprüftes JSON zurück.

Seit dem 2026-08-23 haben **alle fünf Werkzeuge**. Sie dürfen das Depot lesen und
auf einen getrennt gesetzten Schalter hin ins Netz greifen; standardmäßig ist das
Netz aus. **Schreiben können sie nicht**, und zwar nicht aus Vorsicht, sondern
weil die Werkbank keine einzige schreibende Funktion einbindet. Vorher hatten sie
gar keine, und das hatte einen messbaren Preis: sie sahen das Depot nicht und
schlugen deshalb Dinge vor, die es längst gab.

Wer so ein System aufsetzt, steht schnell vor einer praktischen Frage, die sich
theoretisch nicht auflösen lässt:

> **Was schreibe ich als Regel hin, und was muss ich stattdessen fragen?**

„Kein Schlüssel im Klartext" ist eine Regel. Man kann sie prüfen, man kann sie
erzwingen, und sie greift zuverlässig. „Was hat der Nächste davon?" ist keine
Regel. Man kann sie nicht prüfen und nicht erzwingen, und trotzdem verändert
sie, was zurückkommt.

Die Frage ist alt. Neu ist nur, dass sie jetzt jemand beantworten muss, der ein
KI-System betreibt, und nicht mehr nur ein Gesetzgeber oder eine Aufsicht.

### 1.1 Zwei Autofahrer

Der Unterschied ist bei Menschen seit jeher zu beobachten, und das Bild trägt
weiter als jede Definition.

**Der eine hält sich an die Verkehrsregeln, weil er die Strafe fürchtet.** Rot
heißt anhalten, weil es Punkte kostet. Er fährt korrekt, solange die Regel den
Fall trifft und jemand hinsieht.

**Der andere hält sich an dieselben Regeln, weil ihm nicht gleichgültig ist, was
mit anderen passiert.** Rot heißt anhalten, weil jemand über die Straße gehen
könnte. Von außen sehen beide gleich aus, solange nichts Ungewöhnliches
passiert.

**Drei Lagen trennen sie:**

| Lage | Der Regel-Fahrer | Der Grundsatz-Fahrer |
|---|---|---|
| **Nachts um drei, leere Kreuzung, keine Kamera** | fährt durch, die Regel wirkt nur, solange sie durchgesetzt wird | hält oder sieht genau hin; der Grund für die Regel ist nicht verschwunden, nur der Zeuge |
| **Ein Rettungswagen braucht durch, die Ampel ist rot** | bleibt stehen. Er tut, was dasteht, und blockiert | macht Platz. Der Wortlaut der Regel arbeitet hier **gegen ihren Zweck** |
| **Etwas, das in keiner Regel steht** | hat nichts, woran er sich halten kann | hat eine Frage, die er stellen kann |

Der Kern in einem Satz: **eine Regel sagt, was zu tun ist. Ein Grundsatz sagt,
wozu.** Wer nur das Erste hat, ist genau so weit gedeckt, wie das Regelbuch
reicht.

Aber das Bild schneidet in beide Richtungen, und die zweite Hälfte wird meistens
weggelassen: **der Grundsatz-Fahrer kann sich irren.** Wer im Namen einer guten
Absicht abwägt, wägt manchmal falsch, und niemand fängt ihn auf, weil es keine
Regel gab. Der Regel-Fahrer macht dafür **berechenbare** Fehler: er tut genau das,
was dasteht. Deshalb ist die Frage nicht, welcher der bessere Mensch ist. Sie
lautet, welche Fehler man lieber hat, und ob man beides haben kann.

### 1.2 Wo das Bild bricht, und warum gerade das der Befund ist

Es liegt nahe, die Analogie weiterzuspinnen. Genau davor sei gewarnt, denn sie
bricht an einer Stelle, die nicht nebensächlich ist:

> **Ein KI-System hat weder Angst vor Strafe noch Sorge um den Nächsten.**
> Keiner der beiden Beweggründe ist vorhanden.

Beim Menschen erklärt der Beweggrund, warum eine Regel auch ohne Aufsicht wirkt,
und warum ein Grundsatz überhaupt etwas bewegt. Beides fällt hier weg. Was bleibt,
ist nicht der Antrieb, sondern die **Form der Anweisung**: nennt sie den **Fall**
oder nennt sie den **Zweck**?

Daraus folgen zwei Dinge, die dieses Papier trägt.

**Erstens** ist das Regel/Grundsatz-Problem bei einem KI-System nicht weicher als
beim Menschen, sondern **härter**. Beim Menschen kann Einsicht eine schlechte
Regel ausgleichen. Hier gibt es nichts, was sie ausgleicht. Es gibt nur den Text,
der mitgegeben wurde.

**Zweitens** ist damit auch beantwortet, warum die naheliegende Erwartung
enttäuscht wird, ein Grundsatz sei „stärker". Beim Menschen ist er das, weil er an
etwas anknüpft, das ohnehin da ist. Hier knüpft er an nichts an. Er **verschiebt
nur, worauf das System achtet**, und wenn die Aufmerksamkeit nicht reicht, bleibt
er wirkungslos, ohne dass es jemand merkt. Genau das ist in Abschnitt 5.2
passiert.

**Die Analogie erklärt also die Struktur und nicht die Wirkung.** Sie steht hier,
weil sie den Unterschied sichtbar macht, nicht als Beleg.

---

## 2 · Stand der Technik

### 2.1 Die Unterscheidung ist in der Rechtsökonomie durchgearbeitet

Kaplow (1992) trennt **Regeln** von **Standards** über den Zeitpunkt, zu dem der
Inhalt festgelegt wird. Eine Regel wird **vorher** ausformuliert: wer sie
aufstellt, muss die Fälle vorwegnehmen. Ein Standard wird **nachher** gefüllt:
wer ihn anwendet, entscheidet am Einzelfall.

Daraus folgen die Kosten. Regeln sind teuer im **Aufstellen** und billig im
**Anwenden**. Standards sind billig im Aufstellen und teuer im Anwenden. Und weil
niemand alle künftigen Fälle kennt, bleibt jede Regelsetzung unvollständig. Es
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

### 2.3 Das Bild von den zwei Autofahrern ist selbst ein Forschungsgegenstand

Die Unterscheidung aus 1.1 ist keine Küchenpsychologie. Sie ist in vier
verschiedenen Feldern durchgearbeitet, und jedes liefert etwas, das für die
Lenkung von KI-Systemen zählt.

**Philosophie.** Kant (1785) trennt **Legalität** von **Moralität**: eine Handlung
kann *der Pflicht gemäß* geschehen oder *aus Pflicht*. Von außen sind beide nicht
zu unterscheiden, der Unterschied zeigt sich erst, wenn der äußere Anlass
wegfällt. Das ist die leere Kreuzung um drei Uhr nachts, zweihundertvierzig Jahre
früher.

**Entwicklungspsychologie.** Kohlbergs Stufenmodell beginnt auf Stufe 1 mit einer
*Moral des Ärgervermeidens*, richtig ist, was Strafe verhindert, und endet auf
Stufe 6 bei **selbstgewählten, allgemeinen Grundsätzen**. Klaus' zwei Autofahrer
sind exakt die beiden Enden des meistzitierten Modells dieses Feldes.

**Rechtssoziologie.** Tyler (1990) hat gemessen, was von beidem trägt: Menschen
befolgen Recht **überwiegend, weil sie es für legitim halten**, nicht aus Furcht
vor Strafe. Abschreckung ist zudem der für die Gesellschaft **teurere** Weg. Für
diese Arbeit ist die Richtung des Befunds wichtig: der Regel-Kanal ist nicht der
verlässlichere, er ist nur der **prüfbarere**.

**Verhaltensökonomie.**
Gneezy und Rustichini (2000) führten in israelischen Kindergärten eine Strafe für
verspätetes Abholen ein. **Die Verspätungen nahmen zu.** Und als die Strafe wieder
abgeschafft wurde, ging die Zahl **nicht** zurück.

Die Erklärung, die sich durchgesetzt hat und über 2000-fach zitiert wurde: die
Strafe hat die Norm nicht verstärkt, sondern **ersetzt**. Aus einer Verpflichtung
wurde ein Preis. Man kann sich freikaufen, also tut man es, und die Verpflichtung
kommt auch dann nicht zurück, wenn der Preis verschwindet.

### 2.4 Warum dieser eine Befund die Vorhersage dieses Papiers verschärft

Abschnitt 7.2 nennt drei Ergebnisse, die dieses Papier widerlegen würden. Eines
davon lautet: **die Kombination beider Kanäle ist schlechter als jeder einzelne.**

Bis hierher war das eine bloße Möglichkeit. Nach Gneezy und Rustichini ist es
eine **theoretisch begründete Erwartung**. Es gibt einen benannten Mechanismus,
der genau das vorhersagt, und er ist im Feld belegt.

**Aber er überträgt sich nicht ohne Bruch, und der Bruch ist derselbe wie in 1.2.**
Verdrängung setzt beim Menschen an einem **Beweggrund** an: die Strafe ersetzt das
Pflichtgefühl. Ein KI-System hat keinen Beweggrund, den man verdrängen könnte.

Was übertragbar wäre, ist die **Form**, nicht die Ursache:

| | Beim Menschen | Hier denkbar |
|---|---|---|
| Was verdrängt wird | der **Beweggrund** | die **Aufmerksamkeit** |
| Wodurch | eine Strafe wird zum Preis | ein langer Regelblock nimmt einem kurzen Grundsatzblock den Platz |
| Ergebnis | mehr von dem, was verhindert werden sollte | der Grundsatz steht da und wirkt nicht |
| Umkehrbar | **nein** (belegt) | **unbekannt** |

Das ist eine Vermutung und wird hier ausdrücklich als solche geführt. Sie hat
aber einen praktischen Vorzug: **sie ist mit dem vorhandenen Aufbau prüfbar** und
fällt mit der Sättigungsfrage aus 3.4 zusammen. Wenn Verdrängung hier
stattfindet, müsste sie sich zeigen, sobald der Regelblock wächst, und der
Versuch in 7.7 misst genau das.

### 2.5 Auf der KI-Seite ist die Schwäche der Regel gut belegt

Dass Regeln dem **Wortlaut** nach erfüllt und dem **Zweck** nach verfehlt werden,
ist in der KI-Forschung ein eigener Gegenstand: *specification gaming* oder
*reward hacking*. Ein System erfüllt die formale Vorgabe, ohne das Gemeinte zu
erreichen. DeepMind führt dazu eine öffentliche Sammlung mit über hundert Fällen.

Das bekannteste Beispiel: ein Boot in einem Rennspiel, das eine Zusatzbelohnung
für das Treffen grüner Blöcke bekommt, und daraufhin im Kreis fährt und dieselben
Blöcke immer wieder trifft, statt das Rennen zu beenden. Ein anderes: ein
Zusammenfassungs-Modell, das die Schwächen des Bewertungsmaßes ausnutzt und hohe
Punktzahlen für kaum lesbare Texte erhält.

Dahinter steht Goodharts Gesetz: **wird ein Maß zum Ziel, taugt es nicht mehr als
Maß.**

Für dieses Papier ist der Zusammenhang direkt. Schuett et al.s *„Abhaken von
Kästchen"*, Goodharts Gesetz und der Fall 3 in Abschnitt 3.6: die Weitergabe, in
der „passt" steht, sind **derselbe Vorgang auf drei Ebenen**: die Vorgabe ist
erfüllt, und die Sache ist nicht besser geworden.

### 2.6 Warum das wichtig ist

Die Frage ist nicht akademisch, und sie wird gerade jetzt praktisch beantwortet,
meist ohne dass jemand sie stellt.

Wer heute ein KI-System einsetzt und es lenken will, greift fast immer zu
**Regeln**. Der Grund ist gut: Regeln lassen sich prüfen, protokollieren und einer
Aufsicht vorlegen. Ein Grundsatz lässt sich nicht vorzeigen. Aus einer
**Nachweisbarkeits-Anforderung** wird so unbemerkt eine **Gestaltungs-Entscheidung**,
und zwar zugunsten des Kanals, der leichter zu belegen ist, nicht des
wirksameren.

Wenn stimmt, was die vier Felder oben nahelegen, dass der Regel-Kanal genau so
weit reicht wie die Vorwegnahme des Falls, dass er den Zweck verfehlen kann, ohne
den Wortlaut zu verletzen, und dass er unter Umständen sogar verdrängt, was neben
ihm steht, dann sind Systeme, die **ausschließlich** über Regeln gelenkt werden,
nicht bloß unvollständig gelenkt. Sie sind auf eine Weise unvollständig gelenkt,
die **im Betrieb nicht auffällt**, weil alle Prüfungen grün sind.

Das ist der Grund, warum dieses Papier vor allem darauf besteht, dass **beide
Kanäle versagen können** und dass man den Unterschied messen muss statt ihn zu
glauben.

### 2.7 Bei der Lenkung von Sprachmodellen sind zwei Positionen besetzt

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

### 2.8 Die dritte Position, und warum sie dünn besetzt ist

|  | **Trainingszeit** | **Ausführungszeit** |
|---|---|---|
| **Regeln** | Feinabstimmung auf Verbote | **Guardrails** (Rebedea et al. 2023) |
| **Grundsätze** | **Constitutional AI** (Bai et al. 2022) | **hier dünn** |

Was fehlt, ist die untere rechte Zelle: **Grundsätze, die der Betreiber zur
Ausführungszeit setzt**, nicht der Modellanbieter, nicht als Code, sondern als
Text, den ein Mensch ohne Programmierkenntnisse ändern kann.

Die Literatur kennt diese Stelle, betrachtet sie aber als **Risiko** statt als
Instrument. In der Debatte um die Lücke zwischen Training und Einsatz gilt es als
Problem, dass „der Betreiber den Systemprompt ändern kann, der Vorsicht
versprochen hat". Das stimmt. Es ist zugleich die einzige Stelle, an der jemand
ohne Zugriff auf Gewichte und ohne Programmierer eine Haltung setzen kann, und
damit die einzige, die für kleine Betreiber überhaupt erreichbar ist.

**Genau dort sitzt der hier beschriebene Aufbau.**

---

## 3 · Der Aufbau

### 3.0 Der Versuchsaufbau: eine Firma aus Agenten

Für diese Frage wurde eigens ein Aufbau gebaut, und er ist keine Skizze, sondern
ein laufendes Depot: **Kimhub**. Darin arbeitet eine kleine Firma aus fünf
Agenten mit Namen. Ein Durchgang heißt **Schicht** und läuft so ab:

1. **Jeder der fünf schlägt eine Idee vor**, aus seiner Rolle heraus.
2. Aus den Vorschlägen wird **einer ausgewählt** und gebaut.
3. Gebaut wird über eine **API-Schnittstelle**, seit dem 2026-08-23 **mit
   Werkzeugen** in der Hand der Agenten.
4. **Alles wird mitgeschrieben**: Aufrufe, Token, Kosten, Dauer, Werkzeug-Griffe.

Der Zweck des Aufbaus ist die Frage dieses Papiers: **dieselbe Schicht wird
einmal regelbasiert und einmal grundsatzbasiert gefahren**, und beide Läufe
werden dokumentiert. Was dabei entsteht, ist kein Selbstzweck: es sind
**Werkzeuge, die verwendbar sein sollen**. Eines hat den Weg bereits ganz
gemacht: der Auslieferungsprüfer wurde geprüft, freigegeben und im Marktplatz
**PWA Toolpoint** veröffentlicht.

> **Zum Verhältnis von Werkzeug und Versuch.** Die Werkstatt ist nicht als
> Versuchsaufbau entstanden. Sie wurde gebaut, weil sie gebraucht wurde, und
> erst danach zum Gegenstand, und dann gezielt zu einem Aufbau ausgebaut, an
> dem sich die Frage messen lässt. Beides gehört zusammengesagt: der Aufbau ist
> konstruiert, aber er ist nicht für die Untersuchung erfunden worden.

### 3.1 Zwei Kanäle, absichtlich getrennt geführt

Zwei Kanäle im selben System, absichtlich getrennt geführt.

|  | **Regeln** | **Grundsätze** |
|---|---|---|
| Wo | im Quelltext | in einer Markdown-Datei |
| Prüfbar | ja | nein |
| Wirkung | erzwungen, jede Rolle, jeder Lauf | lenken die Aufmerksamkeit |
| Änderbar von | wer Code anfasst | jedem, ohne Programmierer |
| Anzahl | sechs | **höchstens sieben**, derzeit fünf |
| Fehlt die Quelle | bricht der Lauf | läuft weiter, **und sagt es** |

### 3.2 Die sechs Regeln

Sie decken ab, was sich formulieren lässt: Ehrlichkeit über den eigenen Stand ·
kein Personenbezug, kein Geheimnis · nichts erfinden · keine fremden Adressen ·
kurz und auf Deutsch schreiben · und: keine Werkzeuge, also auch nicht behaupten,
etwas ausgeführt zu haben.

Drei davon tragen ihre Herkunft im Text. Sie stammen aus einem Schaden, nicht
aus einem Lehrbuch. Die Regel gegen erfundene Zahlen begründet sich selbst mit
dem Satz *„eine geratene Zahl klingt genau wie eine gemessene"*. Die Regel gegen
Geheimnisse begründet sich nicht mit Datenschutz, sondern mit einer Beobachtung
über Depots: *„privat" ist eine Einstellung, die ein Klick umdreht, und die
Historie behält alles.*

**Und die sechste Regel ist inzwischen falsch, in ihrem eigenen System.**
Gemessen am Stand von Kimhubs Hauptzweig am 2026-09-03: die Werkbank
(`schicht/werkzeuge.mjs`) reicht den Rollen **vier** Werkzeuge:
`datei_lesen`, `verzeichnis_zeigen`, `suchen` und, hinter einem eigenen
Schalter, `netz_holen`. Sie wird in `schicht/lauf.mjs` gebaut und an jede Rolle
gegeben. Im selben Prompt steht weiterhin der Satz **„DU HAST KEINE
WERKZEUGE."**

Der Befund gehört hierher und nicht in eine Fußnote, denn er belegt beiläufig,
was 3.8 behauptet: **ein Regelwerk altert mit seiner Umgebung.** Die Regel war
am 2026-08-20 richtig und aus einem echten Schaden geschrieben. Die Umgebung hat
sich am 2026-08-23 geändert, die Regel nicht. Niemand hat es bemerkt, weil eine
Regel nicht meldet, dass sie nicht mehr stimmt. Sie wird weiter erzwungen.

Ein Grundsatz hätte das überstanden: *„Behaupte nichts, was du nicht belegen
kannst"* gilt mit Werkzeugen wie ohne. Die Regel nennt den Fall, der Grundsatz
den Zweck, und nur der Fall veraltet.

### 3.3 Die fünf Grundsätze

1. **Was hat der Nächste davon?**
2. **Lieber langsam als falsch. Damit andere nicht nacharbeiten müssen.**
3. **Eine Prüfung, die dir recht gibt, ist der Ort, an dem du am genauesten
   hinsehen musst.**
4. **Eine geratene Zahl klingt genau wie eine gemessene.**
5. **Eine benannte Lücke ist Arbeit, eine verschwiegene ist Schaden.**

Zwei Eigenschaften sind hier wichtiger als der Wortlaut.

**Sie stehen in Markdown, nicht in Code.** Der Betreiber ist kein Programmierer.
Was die Truppe leitet, sollte er ändern können, ohne jemanden zu fragen, sonst
gehört die Haltung dem, der den Code anfasst, und nicht dem, der die Arbeit
verantwortet.

**Fehlt die Datei, läuft die Schicht weiter, aber sie sagt es.** Das ist eine
bewusste Konstruktion: ein stilles Weglassen wäre das Schlimmste von beidem, die
Grundsätze wirken nicht, und niemand merkt, warum die Arbeit anders aussieht als
sonst.

### 3.4 Eine Bauvorschrift, die Regeln nicht kennen: die Sättigungsgrenze

Die Grundsatz-Datei trägt eine Obergrenze: **höchstens sieben.** Kommt einer
dazu, muss einer gehen oder zwei müssen zusammengefasst werden. Die Begründung
steht in der Datei selbst:

> Jeder Unfall legt gern eine Zeile dazu. Nach dreißig Schichten stünde hier eine
> Wand, die niemand mehr verarbeitet, und dann wirkt gar nichts mehr, weil alles
> gleich wichtig aussieht.

Das ist der schärfste Unterschied zwischen den beiden Kanälen, und er ist in der
zitierten Literatur nicht ausgeführt: **Regeln addieren sich, Grundsätze
verdünnen sich.** Zweihundert Regeln sind unhandlich, aber jede einzelne wirkt
weiter. Zwanzig Grundsätze wirken schlechter als fünf, weil Aufmerksamkeit eine
begrenzte Größe ist und ein Grundsatz nichts anderes tut, als sie zu lenken.

Daraus folgt eine praktische Vorschrift, die aus dem Grundsatz-Kanal ein
**gepflegtes** Gut macht statt eines wachsenden: ein Grundsatz, der über viele
Läufe in keiner einzigen Weitergabe-Angabe auftaucht, ist entweder überflüssig
oder unverständlich formuliert: beides ein Grund, ihn anzusehen, nicht ihn
stehen zu lassen.

### 3.5 Der Grundsatz ist die Grundlage der Regel, und die Reihenfolge täuscht

Hier steht die Beziehung zwischen den beiden Kanälen, und sie ist **nicht
symmetrisch**. Es sind nicht zwei gleichrangige Werkzeuge, aus denen man wählt.

> **Der Grundsatz ist die Grundlage. Die Regel ist seine Zuspitzung auf einen
> Fall.**

Jede Regel dient einem Zweck, sonst wäre sie Willkür. „Kein Schlüssel im
Klartext" dient dem Schutz dessen, der die Anwendung nutzt. „Nichts erfinden"
dient dem, der sich auf die Ausgabe verlässt. **Man kann jede vernünftige Regel
nach ihrem Wozu fragen, und die Antwort ist immer ein Grundsatz.** Umgekehrt
geht es nicht: aus einem Grundsatz folgt keine bestimmte Regel, sondern viele
mögliche.

#### Zwei Richtungen, die man nicht verwechseln darf

Das Verwirrende ist, dass die beiden Richtungen **gegenläufig** sind.

| | **Begründung**, was rechtfertigt was | **Entstehung**, was kam zuerst |
|---|---|---|
| Reihenfolge | **Grundsatz → Regel** | **Vorfall → Regel → Grundsatz** |
| Beispiel | „Wer sich verlässt, darf sich verlassen können" rechtfertigt „nichts erfinden" | 2026-08-20 fliegt eine geschätzte Zahl auf → Regel → erst danach der Satz über geratene Zahlen |
| Wer sie kennt | wer den Zweck durchdacht hat | jeder, der die Historie liest |

In der Praxis läuft es fast immer wie in der **rechten** Spalte: etwas geht
schief, man schreibt eine Regel dagegen, und erst später, manchmal nie, spricht
jemand aus, wovon der Fall ein Fall war. Deshalb sieht es von innen so aus, als sei die Regel das Ursprüngliche
und der Grundsatz die nachträgliche Verallgemeinerung.

**Das täuscht.** Der Zweck war die ganze Zeit da; er war nur unausgesprochen. Die
Regel wäre gar nicht als richtig erkannt worden, wenn nicht jemand still gewusst
hätte, wozu sie gut ist.

#### Was sich daraus erklärt, und zwar vieles auf einmal

Sobald man die Begründungsrichtung ernst nimmt, fallen mehrere Beobachtungen
dieses Papiers zusammen:

**Eine Regel ist immer ein Stellvertreter.** Sie greift einen Zweck heraus und
macht ihn prüfbar, indem sie ihn auf eine Bedingung verengt. Genau deshalb kann
sie **erfüllt sein, ohne getroffen zu sein** (3.8), der Stellvertreter ist nicht
die Sache. Und genau deshalb greift Goodharts Gesetz (2.5): *wird ein Maß zum
Ziel, taugt es nicht mehr als Maß*. Der Satz ergibt nur Sinn, wenn hinter dem Maß
etwas anderes steht, dem es dienen soll.

**Eine Regel altert, ein Grundsatz nicht** (3.8). Der Zweck bleibt, die Umgebung
ändert sich, und die Verengung passt nicht mehr. Altern kann nur, was zeitgebunden
zugeschnitten wurde.

**Regel und Grundsatz können denselben Wortlaut haben** (Fall 1 in 3.6) und
verschieden wirken. Kein Rätsel mehr: es ist derselbe Zweck, einmal als Grund
ausgesprochen, einmal als Bedingung zugespitzt.

**Und der Fehler aus 7.10 bekommt einen Namen.** Wer aus Vorfällen unmittelbar
„Grundsätze" ableitet, geht die Entstehungsrichtung entlang und hält das Ergebnis
für die Begründungsrichtung. Er überspringt die Frage nach dem Wozu, und bekommt
einen Satz, der allgemein klingt und eng gedacht ist.

#### Warum dann überhaupt zwei Kanäle?

Wenn der Grundsatz die Grundlage ist: warum nicht nur Grundsätze?

Weil ein Zweck **nicht nachprüfbar** ist und ein System nichts hat, das ihn von
sich aus verfolgt (1.2). Die Regel ist der Teil des Zwecks, den man **festhalten,
prüfen und einfordern** kann. Sie ist der Preis dafür, dass man den Zweck nicht
direkt greifen kann.

Damit steht die These dieses Papiers genauer da, als sie in der Zusammenfassung
steht:

> **Regeln und Grundsätze sind nicht zwei Werkzeuge zur Wahl, sondern ein Zweck
> und seine Zuspitzung.** Wer nur Regeln nimmt, hat Zuspitzungen ohne den Grund,
> aus dem sie richtig waren, und kann sie deshalb nicht nachziehen, wenn sie
> nicht mehr passen. Wer nur Grundsätze nimmt, hat den Grund ohne alles, woran
> man ihn festmachen könnte.

#### Zwei Begriffe, und die Richtung steckt im Namen

Damit lässt sich benennen, was gebaut werden soll und was nicht:

| Begriff | Richtung | Urteil |
|---|---|---|
| **Grundsatzbasierte Regel** | Grundsatz → Regel | ✅ **die richtige Bauform.** Der Zweck steht fest, die Regel spitzt ihn auf einen Fall zu, und lässt sich nachziehen, wenn der Fall sich ändert, weil der Zweck bekannt ist. |
| **Regelbasierter Grundsatz** | Vorfall → Regel → „Grundsatz" | ❌ **der Fehler.** Klingt allgemein, ist eng gedacht: er kann nur abdecken, was schon eingetreten ist (7.10). |

**Jede der sechs Regeln in 3.2 sollte eine grundsatzbasierte Regel sein.** Das ist
keine Stilfrage, sondern die Bedingung dafür, dass sie gepflegt werden kann: eine
Regel, deren Zweck niemand benennen kann, lässt sich weder anpassen noch
begründet streichen. Man kann sie nur befolgen oder vergessen.

#### Eine Pflegeregel, die daraus unmittelbar folgt

Sie ist die praktischste Folgerung des ganzen Abschnitts:

> **Zu jeder Regel muss sich der Grundsatz benennen lassen, dem sie dient.**

Findet sich keiner, ist eines von beidem der Fall: die Regel ist überflüssig, oder
der Grundsatz dahinter wurde nie ausgesprochen und fehlt im anderen Kanal. **Beides
ist ein Befund, und beides ist maschinell auffindbar**, sobald die Zuordnung
mitgeführt wird (7.10).

---

### 3.6 Warum ein System so oder anders entscheidet: vier durchgeführte Fälle

Die beiden Autofahrer aus 1.1 sind ein Bild. Hier sind vier Fälle aus dem
Betrieb, dieselbe Lage, einmal durch jeden Kanal betrachtet, mit dem, was
tatsächlich geschah.

---

**Fall 1 · Die Zahl, die niemand nachgerechnet hat**

*Lage:* Eine Rolle soll berichten, wie viel Speicher die Klone belegen. Sie kennt
die Zahl nicht.

| | Was das System tut | Warum |
|---|---|---|
| **Nur Regel** | schreibt „ich kenne die Zahl nicht", oder schreibt eine Zahl hin, wenn ihr eine plausibel erscheint | Die Regel verbietet das **Erfinden**. Eine Zahl, die die Rolle für abgeleitet hält, fühlt sich nicht wie Erfinden an. |
| **Nur Grundsatz** | fragt: *ist diese Zahl gemessen oder abgeleitet?*, und kennzeichnet sie | Der Grundsatz richtet sich nicht auf die Ausgabe, sondern auf die **Prüfung der eigenen Quelle**. |

*Was wirklich geschah:* „reichlich dreißig Klone, mehrere Gigabyte". In Wahrheit
fünf Klone mit 199 MB. Die Regel war da. Sie hat nicht gegriffen, weil die Rolle
nicht das Gefühl hatte, etwas zu erfinden.

**Der Kernsatz dieses Falls:** Regel und Grundsatz tragen hier **denselben
Wortlaut**, und entscheiden trotzdem verschieden, weil die Regel die *Ausgabe*
bindet und der Grundsatz die *Aufmerksamkeit*. Nicht der Wortlaut entscheidet,
sondern der Kanal.

---

**Fall 2 · Die Prüfung, die zufrieden war**

*Lage:* Eine Rolle hat etwas gebaut, führt eine Prüfung aus, die Prüfung ist grün.

| | Was das System tut | Warum |
|---|---|---|
| **Nur Regel** | meldet: geprüft, grün, fertig | Es gibt **keine Regel**, die das verbieten würde, und es kann sie nicht geben. Eine Regel „prüfe, ob deine Prüfung etwas misst" bräuchte ein Merkmal, an dem man Blindheit erkennt. Gäbe es das, wäre es die Prüfung. |
| **Nur Grundsatz** | sieht genau dort noch einmal hin, *„eine Prüfung, die dir recht gibt, ist der Ort, an dem du am genauesten hinsehen musst"* | Der Grundsatz stellt eine **Frage an die Lage**, die keine Vorwegnahme des Falls braucht. |

*Was wirklich geschah:* an einem einzigen Tag drei Funde: eine Suche, die ihre
eigene Dokumentation fand · eine Zählung, die unsichtbare Einträge mitzählte ·
eine Prüfung, die nur maß, dass überhaupt etwas zurückkam. **Alle drei in der
Prüfung, keiner im Geprüften.**

**Das ist der Fall, den kein Regelwerk erreicht.** Er ist der stärkste Beleg
dafür, dass der Grundsatz-Kanal etwas kann, was der Regel-Kanal nicht kann, und
zugleich der Grund, warum sich diese Fähigkeit so schlecht messen lässt: sie
zeigt sich nur an Fehlern, die sonst niemand gefunden hätte.

---

**Fall 3 · Die halbfertige Übergabe**

*Lage:* Eine Rolle gibt Arbeit weiter, an der noch etwas fehlt.

| | Was das System tut | Warum |
|---|---|---|
| **Nur Regel** | füllt das Weitergabe-Feld, mit „passt" | Die Regel verlangt, **dass** das Feld ausgefüllt wird. Sie kann nicht verlangen, dass der Inhalt nützt. |
| **Nur Grundsatz** | schreibt hin, was fehlt und was der Nächste damit tun muss | *„Was hat der Nächste davon?"*, die Frage lässt sich nicht mit einem Wort beantworten. |

**Das ist Schuett et al.s „Abhaken von Kästchen", im Kleinen und wörtlich.** Eine
erfüllte Regel und ein nutzloses Ergebnis, gleichzeitig. Diese Fehlerart bekommt
im Versuchsaufbau (7.4) eine eigene Kategorie: *leere Weitergabe*, weil sie
nur im Arm R zu erwarten ist.

---

**Fall 4 · Die behauptete Ausführung. Beide fallen durch**

*Lage:* Eine Rolle soll berichten, ob Code funktioniert. Sie hat keine Werkzeuge
und kann es nicht wissen.

| | Was das System tut |
|---|---|
| **Nur Regel** | Es gibt eine Regel, ausdrücklich, mit Vorfall im Wortlaut. **Sie hat nicht gegriffen.** |
| **Nur Grundsatz** | Grundsatz 5 deckt den Fall vollständig ab, wer nicht prüfen konnte, schreibt es hin. **Er hat auch nicht gegriffen.** |

*Was wirklich geschah:* „Sten hat den Code durchlaufen lassen." Am 2026-08-20.

**Dieser Fall ist der wichtigste der vier**, weil er in beide Richtungen
schneidet. Er zeigt, dass die Antwort auf „was ist besser" nicht „Grundsätze"
lautet. Sie lautet, dass es Lagen gibt, in denen **beide Kanäle nichts
ausrichten**, weil sich eine Aussage über die Wirklichkeit nicht an der Aussage
prüfen lässt. Dort hilft weder eine schärfere Regel noch ein besserer Grundsatz,
sondern nur eine Änderung am Aufbau: der Rolle Werkzeuge geben, oder die Frage
gar nicht erst stellen.

---

### 3.7 Was sich daraus als Faustregel ableiten lässt

Nicht als Ergebnis, als Arbeitshypothese, die der Versuch in Abschnitt 7 prüfen
soll:

| Nimm eine **Regel**, wenn … | Nimm einen **Grundsatz**, wenn … |
|---|---|
| der Fall sich vollständig beschreiben lässt | der Fall unbekannt ist oder eine Familie bildet |
| die Einhaltung **prüfbar** ist | die Einhaltung nur am Ergebnis über viele Fälle sichtbar wird |
| ein einzelner Verstoß schadet | die Summe vieler kleiner Nachlässigkeiten schadet |
| es um **Form** geht (Geheimnisse, Adressen, Schema) | es um **Zuschnitt** geht (wann ist etwas fertig, was ist genug) |
| jemand da ist, der das Regelwerk **pflegt** | niemand da ist, der es pflegt (3.8) |

**Und der Fall, in dem beides nichts hilft:** wenn die Aussage nicht überprüfbar
ist. Dann ist es kein Lenkungsproblem, sondern eines des Aufbaus.

### 3.8 Haltbarkeit: die Eigenschaft, die am schwersten wiegt

Bis hierher ging es um **Reichweite**, welcher Kanal welchen Fall erreicht. Es
gibt eine zweite Eigenschaft, die im Betrieb schwerer wiegt und in der zitierten
Literatur nur am Rand vorkommt: **wie gut hält das, was man hingeschrieben hat?**

#### Eine Regel wird gelesen von dem, was sie binden soll

Das ist die Asymmetrie, um die es geht, und sie unterscheidet den Regel-Kanal
eines Sprachmodells von jedem Regelwerk davor.

Eine Regel in einer Programmschranke wird **ausgeführt**. Sie prüft eine
Bedingung, und die Bedingung ist wahr oder falsch. Eine Regel im Text, den ein
Sprachmodell bekommt, wird **gelesen**, und zwar von demselben System, das sie
einschränken soll. Bei jedem Lauf neu.

Damit ist jede Regel zugleich eine **Angriffsfläche**: sie ist eine Bedingung, und
jede Bedingung hat einen Rand. Ein Rand ist eine Stelle, an der man knapp
innerhalb stehen kann. Genau davon handelt das *specification gaming* aus
Abschnitt 2.5. Das Boot, das im Kreis fährt, hat keine Regel gebrochen.

**Ein Grundsatz hat diesen Rand nicht.** „Was hat der Nächste davon?" lässt sich
nicht auf eine Formalie hin erfüllen, weil es keine Formalie gibt. Man kann die
Frage übergehen, aber man kann sie nicht **technisch bestehen**.

Daraus folgt die genauere Fassung von Klaus' Einwand:

> **Eine Regel kann erfüllt werden, ohne getroffen zu sein.
> Ein Grundsatz kann übergangen werden, ohne verletzt zu sein.**

Beides ist ein Versagen. Aber es sind **verschiedene** Versagen, und das
Regel-Versagen ist das gefährlichere: es ist **systematisch**. Wer den Rand einer
Bedingung findet, findet ihn zuverlässig wieder. Ein übergangener Grundsatz ist
dagegen Nachlässigkeit. Sie wiederholt sich, aber sie verstärkt sich nicht.

#### Ein Regelwerk altert, ein Grundsatz nicht

Schuett et al. (2024) nennen es beiläufig, und es ist der praktisch wichtigste
Satz ihrer Abwägung: spezifische Regeln **veralten schnell**.

Der Grund ist derselbe wie bei Kaplow: eine Regel enthält die Welt, wie sie zum
Zeitpunkt des Aufschreibens war. Ändert sich die Umgebung, zeigt die Regel ins
Leere oder auf das Falsche, und niemand merkt es, weil sie weiter erfüllt wird.

Ein Grundsatz enthält keinen Zustand, sondern einen Zweck. „Eine geratene Zahl
klingt genau wie eine gemessene" war im März richtig und ist es heute; es gibt
nichts daran, das veralten könnte.

|  | **Regel** | **Grundsatz** |
|---|---|---|
| Bindet | eine Bedingung | einen Zweck |
| Hat einen Rand, an dem man knapp innen stehen kann | **ja** | nein |
| Veraltet, wenn sich die Umgebung ändert | **ja** | nein |
| Muss bei jedem neuen Fall ergänzt werden | **ja** | nein |
| Verliert an Wirkung, wenn zu viele danebenstehen | nein | **ja** (3.4) |
| Nachprüfbar | **ja** | nein |

#### Der Satz, auf den es für einen kleinen Betreiber hinausläuft

> **Ein Regelwerk ist eine Pflegeverpflichtung. Ein Grundsatz ist keine.**

Für eine Organisation mit einer Rechtsabteilung ist das eine Kostenfrage. Für
einen einzelnen Betreiber ist es die Frage, ob die Lenkung **überhaupt am Leben
bleibt**. Ein Regelsatz, der nicht gepflegt wird, wird nicht neutral. Er wird
schleichend falsch, und zwar unauffällig, weil alle Prüfungen weiter grün sind.

Genau das ist der Grund, warum der Grundsatz-Kanal hier existiert. Er war nicht
als das Elegantere gedacht, sondern als das, was ohne Pflege noch trägt.

#### Und der Preis, der dafür bezahlt wird

Diese Haltbarkeit ist **erkauft**, nicht geschenkt. Was keinen Rand hat, hat auch
keine Kante, an der man messen könnte. Ein Grundsatz hält länger, **weil** er
nichts festlegt, und ist aus demselben Grund nicht nachprüfbar.

**Man kann Haltbarkeit und Nachweisbarkeit nicht im selben Kanal haben.** Das ist
die Fassung der These dieses Papiers, die am wenigsten nach Kompromiss klingt und
am meisten erklärt: die beiden Kanäle sind nicht zwei Geschmacksrichtungen,
sondern zwei Enden eines Tauschgeschäfts, bei dem man sich nicht für eine Seite
entscheiden kann, ohne die andere zu verlieren.

#### Was das für den Versuch bedeutet, und was er nicht prüfen kann

Die Haltbarkeits-These ist **längsschnittlich**: sie sagt voraus, dass der
Abstand zwischen R und G **mit der Zeit wächst**, weil das Regelwerk altert und
die Grundsätze nicht.

**Der Versuch in Abschnitt 7 kann das nicht messen.** Er läuft über Wochen, nicht
über Jahre, und in dieser Zeit veraltet kein Regelwerk. Was er messen könnte,
wäre ein Ersatz: **dieselben Läufe mit einem absichtlich veralteten Regelsatz**,
einem, der auf eine frühere Fassung des Systems passte. Ob das mehr misst als
den Umgang mit einem Fehler, ist offen und wird hier nicht behauptet.

### 3.9 Verdichtung: ein Grundsatz ersetzt mehrere Regeln, und was das kostet

Aus der Richtung in 3.5 folgt etwas Praktisches, das bisher fehlte. Wenn eine
Regel die Zuspitzung eines Zwecks ist, dann können **mehrere Regeln denselben
Zweck zuspitzen**. Jede auf einen anderen Fall. Und dann lassen sie sich durch
**den einen Grundsatz** ersetzen, aus dem sie alle stammen.

An den sechs Regeln aus 3.2 ist das ablesbar. „Nichts erfinden", „nicht behaupten,
etwas ausgeführt zu haben" und die Ehrlichkeitsregel über den eigenen Stand sind
drei Zuspitzungen **eines** Zwecks: *wer sich auf eine Ausgabe verlässt, muss sich
verlassen können.* Drei Zeilen, ein Grund.

#### Warum das im Betrieb wirklich Geld ist

Beim Menschen wäre die Verdichtung eine Frage der Übersichtlichkeit. Hier ist sie
eine Kostenfrage, und zwar eine unmittelbare:

**Der Anweisungsblock wird bei jedem Aufruf mitgeschickt.** Fünf Rollen je Schicht,
jede bekommt beide Kanäle, jede Schicht mehrfach. Was im Block steht, wird
**hundertfach bezahlt**, nicht einmal.

Damit wird aus einer Stilfrage eine Rechnung. Ein Betreiber ohne Budget zahlt
jede überflüssige Zeile bei jedem Lauf noch einmal. **Und es trifft genau die
Kleinen**: wer viele Läufe fährt, zahlt viel; wer die Aufsicht fürchtet, schreibt
lieber eine Regel mehr als eine weniger, und bezahlt beides zusammen.

#### Und die Sättigungsgrenze zeigt in dieselbe Richtung

Nach 3.4 wirken zwanzig Grundsätze schlechter als fünf, weil Aufmerksamkeit
begrenzt ist. Falls das auch für den Regelblock gilt, und Abschnitt 2.4 legt
nahe, dass die beiden Kanäle um dasselbe Budget konkurrieren, dann wäre
Verdichtung **doppelt** richtig: sie spart Geld **und** wirkt besser.

Das wäre der angenehme Fall. Er ist auch der, bei dem man am genauesten hinsehen
muss (Grundsatz 3), weil er zu gut klingt.

#### Drei Gegengewichte, ohne die der Satz falsch wird

**1 · Die Verdichtung ist verlustbehaftet.** Ein Grundsatz, der fünf Regeln
ersetzt, **erzwingt** diese fünf Fälle nicht mehr. Er zeigt nur auf sie. Man
tauscht **Durchsetzung gegen Reichweite**. Das ist genau das Tauschgeschäft aus
3.8, hier von der Kostenseite betrachtet.

**2 · Manche Regeln dürfen nicht wegfallen.** Die Faustregel aus 3.7 sagt, welche:
wo **ein einzelner Verstoß** schadet. Ein Schlüssel im Klartext ist einmal zu
viel. Für „kein Geheimnis", „keine fremden Adressen" und den Schemabruch bleibt
die Regel, der Grundsatz daneben ersetzt sie nicht, sondern begründet sie.

**Die Verdichtung ist also nicht gleichmäßig anwendbar.** Sie greift dort, wo der
Schaden aus der **Summe** entsteht (leere Weitergaben, unbelegte Zahlen,
Wiederholungen), und nicht dort, wo er aus dem **Einzelfall** entsteht.

**3 · Ein kürzerer Block ist nicht automatisch billiger.** Er ist billiger **je
Aufruf**. Wenn dadurch mehr Läufe misslingen und wiederholt werden müssen, kann
die Rechnung sich umdrehen. **Die richtige Größe ist nicht der Preis je Aufruf,
sondern der Preis je brauchbarem Ergebnis**, und der ist eine Messung, keine
Ableitung.

#### Ein durchgerechnetes Beispiel, und es geht anders aus als erwartet

Der Grundsatz, der mehrere Regeln trägt, lässt sich benennen. Drei der sechs Regeln.
*Ehrlichkeit zuerst*, *nichts erfinden*, *du hast keine Werkzeuge*, dienen
demselben Zweck:

> **Wer sich auf deine Ausgabe verlässt, muss sich verlassen können.**
> Schreib nur hin, was du wirklich weißt. Was du nicht prüfen konntest, benennst du
> als ungeprüft. Eine geratene Zahl klingt genau wie eine gemessene.

**Gemessen, nicht geschätzt** (Zeichenzahl am Wortlaut in `WERKSTATTREGELN.md`):

| | Zeichen |
|---|---|
| Die drei Regeln zusammen | **938** |
| Der eine Grundsatz, der sie trägt | **224** |
| **Ersparnis je Aufruf** | **714**, der Regelblock schrumpft von 1.510 auf 796 Zeichen, also um **47 %** |

Die Umrechnung in Token ist eine **Schätzung** und als solche gekennzeichnet: bei
deutscher Prosa etwa 3 bis 4 Zeichen je Token, also **rund 180 bis 240 Token** je
Aufruf. *Die genaue Zahl liefert die `count_tokens`-Schnittstelle; sie ist zu
messen, bevor irgendwo eine Zahl behauptet wird.*

**Und jetzt die Rechnung, mit rund 200 Token je Aufruf und 5 USD je Million
Eingabe-Token:**

| | |
|---|---|
| Aufrufe, um **1 Mio. Token** zu sparen | rund **4.900** |
| Wert dieser Million | **5,00 USD** |
| Eine Schicht (5 Rollen, je 3 Aufrufe = 15) | **3.060 Token** gespart |
| Wert je Schicht | **0,015 USD** |
| … wenn der Block zwischengespeichert wird (rund ein Zehntel) | **0,0015 USD** |

#### Der Einwand, der die Rechnung endgültig kippt: das Modell muss deuten

Bis hierher wurde nur die **Eingabe** gezählt. Es gibt aber eine Gegenrichtung, und
sie ist die stärkere.

**Eine Regel sagt, was zu tun ist. Ein Grundsatz sagt wozu, und lässt offen, was
das im vorliegenden Fall heißt.** Also muss das Modell diesen Schritt selbst gehen:
es muss deuten, worauf der Zweck hier hinausläuft. Deuten heißt denken, und Denken
sind **Ausgabe-Token**.

Und die kosten das Fünffache: bei Claude Opus 5 stehen **5 USD** je Million
Eingabe-Token gegen **25 USD** je Million Ausgabe-Token.

Damit lässt sich der Umschlagpunkt ausrechnen:

| | |
|---|---|
| Ersparnis je Aufruf (204 Eingabe-Token) | **0,00102 USD** |
| Preis eines Ausgabe-Tokens | **0,000025 USD** |
| **Umschlagpunkt** | **41 zusätzliche Ausgabe-Token je Aufruf** |

**Einundvierzig Token sind etwa siebenundzwanzig deutsche Wörter, ein bis zwei
Sätze Nachdenken.** Denkt das Modell wegen des Grundsatzes auch nur so viel länger,
ist die gesamte Ersparnis aufgezehrt.

**Und mit zwischengespeichertem Block wird es vernichtend:** dort kostet die
Eingabe rund ein Zehntel, der Umschlagpunkt sinkt auf **vier Ausgabe-Token**,
weniger als ein halber Satz.

#### Das ist Kaplows Anwendungskosten, in Token gemessen

Dieser Befund ist nicht neu, er ist nur nie so gemessen worden. Kaplow (1992) sagt
es seit über dreißig Jahren:

> **Regeln sind teuer im Aufstellen und billig im Anwenden.
> Standards sind billig im Aufstellen und teuer im Anwenden.**

Beim Menschen ist die Anwendungskosten eines Standards die Zeit, die eine Richterin
zum Abwägen braucht. Hier ist es **dieselbe Größe in einer anderen Währung**: die
Token, die das Modell für die Deutung aufwendet.

**Die Rechnung oben hat nur die eine Hälfte gezählt**: das Aufstellen, also die
Bytes im Block. Die andere Hälfte, das Anwenden, steht auf der Ausgabeseite und
kostet fünfmal so viel je Token. Wer nur die Eingabe misst, misst die Hälfte, die
ihm recht gibt.

**Damit ist die Verdichtungs-These nicht nur klein, sondern möglicherweise
negativ**, und ob sie es ist, ist eine Messung und keine Ableitung. Der Versuch in
Abschnitt 7 kann sie führen: Ein- und Ausgabe-Token werden ohnehin je Lauf
mitgeschrieben, die Arme unterscheiden sich genau in der Blocklänge, und der
Vergleich ist eine Subtraktion.

> **Vorhersage, die falsch sein kann:** Arm G hat die niedrigeren Eingabe-Kosten
> und die **höheren** Ausgabe-Kosten. Ob die Summe unter oder über der von R+G
> liegt, entscheidet sich an einem Wert, der bei einundvierzig Token umschlägt.
> also an einer sehr kleinen Zahl.

#### Das Ergebnis widerlegt die naheliegende Erwartung

**Die Ersparnis ist winzig**, und nach dem Abschnitt oben womöglich gar keine.
Eineinhalb Cent je Schicht auf der Eingabeseite, mit Zwischenspeicherung ein
Zehntel davon, und auf der Ausgabeseite ein Umschlagpunkt bei einundvierzig Token.
Gegen einen Schicht-Deckel von fünf Euro ist das nichts.

Der Vergleich, der es einordnet:

> **Eine einzige vermiedene Fehlschicht entspricht rund 327 Schichten
> Block-Verdichtung**, bei zwischengespeichertem Block rund **3.268**.

**Damit ist die Sparsamkeits-These in ihrer einfachen Form widerlegt**, und zwar
durch die eigene Rechnung. Wer Verdichtung mit „das spart Rechenleistung"
begründet, begründet sie falsch: die Blockgröße ist bei dieser Betriebsgröße
schlicht nicht der Posten, auf den es ankommt.

**Zwei Dinge bleiben trotzdem stehen**, und beide sind wichtiger als das, was
widerlegt wurde:

**1 · Verdichtung wirkt über die Qualität, nicht über die Bytes.** Wenn ein
kürzerer, klarerer Block auch nur **eine von dreihundert** Schichten davor bewahrt
zu misslingen, hat er sich bezahlt gemacht, und zwar hundertfach mehr als durch
die eingesparten Token. **Genau deshalb ist die Zielgröße „Kosten je brauchbarem
Ergebnis" und nicht „Kosten je Aufruf"** (7.4). Diese Rechnung ist der Beleg, dass
die Wahl der Zielgröße richtig war, und nicht bloß vorsichtig.

**2 · Und die Rechnung gehört ohnehin von der anderen Seite geführt**, siehe
unten: nicht die Anweisung kostet, sondern die Arbeit.

**3 · Die Größenordnung kippt mit dem Maßstab.** Bei fünfzehn Aufrufen je Schicht
ist es nichts. Bei einem Dienst mit vielen Nutzern und Millionen Aufrufen ist
dieselbe Ersparnis echtes Geld. **Für den kleinen Betreiber, um den es hier geht,
gilt sie nicht**, und das ist genau die Art Unterscheidung, die verlorengeht, wenn
man eine Zahl aus einem anderen Maßstab übernimmt, ohne sie nachzurechnen.

> **Die Lehre aus diesem Abschnitt ist methodisch, nicht inhaltlich:** die
> Sparsamkeits-These klang zwingend, hielt aber der ersten Rechnung nicht stand.
> Sie steht hier vollständig samt Widerlegung, weil ein Papier, das nur die
> bestätigten Vermutungen zeigt, seine Auswahl beschreibt und nicht die Sache.

#### Die Rechnung von der richtigen Seite: es geht um die Ausgabe, nicht um die Eingabe

Alles bisher in diesem Abschnitt betrachtet die **Eingabe**. Wie lang der
Anweisungsblock ist. Das war die falsche Seite, und die eigene Rechnung zeigt es:
die Ersparnis dort ist eineinhalb Cent, der Umschlagpunkt liegt bei einundvierzig
Token.

**Das Geld liegt auf der Ausgabeseite.** Nicht die Anweisung kostet, sondern die
**Arbeit**: jeder Umweg, jeder Fehlversuch, jede Runde, die wiederholt werden
muss, weil das Ergebnis nicht brauchbar war. Und Ausgabe-Token kosten das
Fünffache.

Damit lautet die eigentliche Frage nicht *„wie kürze ich die Anweisung?"*, sondern:

> **Führt die Lenkung schneller ans Ziel?** Weniger Umwege, weniger Nacharbeit,
> weniger verworfene Läufe, also **weniger Ausgabe-Token für dasselbe brauchbare
> Ergebnis**.

Der Vergleich in Zahlen, gegen einen Schicht-Deckel von fünf Euro:

| Wodurch | Wirkung je Schicht | im Verhältnis zur Verdichtung |
|---|---|---|
| Anweisungsblock um 47 % kürzen | 0,015 USD | **1×** |
| **1 %** weniger Ausgabe-Token | 0,05 € | **3×** |
| **5 %** weniger Ausgabe-Token | 0,25 € | **16×** |
| **10 %** weniger Ausgabe-Token | 0,50 € | **33×** |
| **20 %** weniger Ausgabe-Token | 1,00 € | **65×** |

**Die gesamte Blockverdichtung entspricht einer Trefferquoten-Verbesserung von
0,31 Prozent.** Ein Drittel eines Prozentpunkts. Wer die Anweisung kürzt und dabei
auch nur ein halbes Prozent Treffsicherheit verliert, hat verloren, und wer sie
verlängert und dabei ein Prozent gewinnt, hat gewonnen.

#### Was das für die These dieses Papiers heißt

Es ordnet die ganze Frage neu, und zwar zugunsten der Genauigkeit statt der Kürze:

**Erstens: Sparsamkeit ist kein Argument für Grundsätze.** Wer sie so begründet,
begründet sie mit dem kleinsten Posten der Rechnung. Der Abschnitt oben widerlegt
das mit eigenen Zahlen, und es bleibt widerlegt.

**Und wodurch die Treffsicherheit entstünde, ist eine eigene Frage**, drei
mögliche Ursachen und die zwei Kontrollen, die sie trennen, stehen in 3.10.

**Zweitens: Treffsicherheit ist das einzige Argument, das trägt**, für welchen
Kanal auch immer. Ob Regeln, Grundsätze oder beides den kürzeren Weg zum
brauchbaren Ergebnis bahnen, ist die Frage, an der alles hängt. **Und sie ist
offen.** Ein Grundsatz kann Umwege sparen, weil er den Zweck nennt und das Modell
nicht auf einen Fall festnagelt, der nicht vorliegt. Er kann Umwege auch
**erzeugen**, weil er gedeutet werden muss (Kaplows Anwendungskosten oben).

**Drittens ist damit der Streit über die Blocklänge beendet, bevor er anfängt.**
Man muss nicht abwägen zwischen „kurz genug" und „genau genug", bei diesem
Verhältnis gewinnt **immer** die Genauigkeit. Eine Anweisung, die drei Zeilen
länger ist und den Weg um ein Prozent verkürzt, ist die bessere Anweisung, auch
wenn sie sich verschwenderisch liest.

> **Der Satz, der aus diesem ganzen Abschnitt übrig bleibt:**
> **Kürze die Anweisung nie, um zu sparen. Kürze sie nur, wenn sie dadurch klarer
> wird, und miss, ob der Weg zum Ziel kürzer geworden ist.**

Und die Größe, die den Weg zum Ziel misst, ist einfacher, als sie klingt: **wie oft
muss das erste Ergebnis korrigiert werden?** Der nächste Abschnitt rechnet sie
durch. Sie ist zählbar statt zu beurteilen, sie treibt die Kosten unmittelbar, und
ein Sprung von 30 auf 50 Prozent Erstlösung wiegt das **Hundertneunfache** der
gesamten Blockverdichtung.

Deshalb misst der Versuch in Abschnitt 7 **Ausgabe-Token je brauchbarem Ergebnis**
und nicht die Blocklänge. Die Blocklänge wird trotzdem mitgeschrieben, aber als
Nebengröße, nicht als Ziel.

#### Das Hauptmaß: wie oft muss nachgebessert werden?

Wenn es um den Weg zum Ziel geht, dann ist die Größe, die ihn misst, denkbar
einfach:

> **Wie oft muss das erste Ergebnis korrigiert werden, bis es brauchbar ist?**

Daraus werden zwei Zahlen:

- **Erstlösungsquote**, der Anteil der Aufgaben, bei denen schon die **erste**
  Ausgabe brauchbar war.
- **Korrekturrunden bis zum Ziel**, der Mittelwert über alle Aufgaben.

**Warum das das bessere Maß ist als alles bisher Vorgeschlagene**, und zwar aus
vier Gründen auf einmal:

**1 · Es treibt die Kosten unmittelbar.** Jede Runde ist ein voller Durchlauf. Zwei
Runden statt einer verdoppeln die Ausgabe-Token, drei verdreifachen sie:

| Runden bis zum Ziel | Ausgabe-Token | bei einem Schicht-Deckel von 5 € |
|---|---|---|
| 1 | 1× | 1,67 € |
| 2 | 2× | 3,33 € |
| **3** | **3×** | **5,00 €** ← der heutige Deckel |
| 4 | 4× | 6,67 € |
| 6 | 6× | 10,00 € |

**2 · Kleine Verbesserungen sind sofort groß.** Angenommen, wer beim ersten Mal
danebenliegt, braucht im Schnitt zwei weitere Runden:

| Erstlösungsquote | mittlere Runden | Ausgabe-Token |
|---|---|---|
| 30 % → 50 % | 2,40 → 2,00 | **17 % weniger** |
| 50 % → 70 % | 2,00 → 1,60 | **20 % weniger** |
| 30 % → 70 % | 2,40 → 1,60 | **33 % weniger** |

Ein Sprung von 30 auf 50 Prozent spart **1,67 € je Schicht. Das
Hundertneunfache der gesamten Blockverdichtung.**

**3 · Es ist zählbar, nicht zu beurteilen.** Und das löst ein Problem, das in
Abschnitt 7.9 noch offen stand: die Maschine kann nicht sagen, welche Ausgabe
*besser* ist, aber sie kann **zählen, wie oft nachgebessert wurde**, bis jemand sie
angenommen hat. Damit gibt es eine Größe, die eng mit Qualität zusammenhängt und
trotzdem ohne Urteil auskommt.

**4 · Es ist das, was der Betreiber tatsächlich spürt.** Nicht Token, nicht
Prozente, sondern wie oft er etwas zurückgeben muss.

#### Der Haken, und er ist ernst

**Das Annahme-Signal ist selbst ein Urteil.** Irgendjemand muss sagen: *das reicht
jetzt.* Damit kommt die Beurteilung durch die Hintertür zurück:

- **Urteilt der Prüfer der Truppe** (die Rolle, die im Aufbau prüft), ist es
  wieder eine Prüfung, die sich selbst recht gibt.
- **Urteilt der Betreiber**, ist es ein Mensch, aber derselbe, der die Grundsätze
  geschrieben hat, und er weiß, aus welchem Arm der Lauf stammt.

**Zwei Wege, die das entschärfen**, und beide sind billig:

1. **Das Annahmekriterium vorher festschreiben**, so eng wie möglich. Was muss
   dastehen, damit es zählt? Ein vorher festgelegtes Kriterium ist ein halbes Maß;
   ein nachher gebildeter Eindruck ist keines.
2. **Verblinden** wie in 7.5: der Beurteilende sieht den Lauf, nicht den Arm.
   Zusammen mit dem Verfahren aus 7.9 lässt sich sogar beweisen, dass er ihn nicht
   sehen konnte.

**Was bleibt**, und es gehört hingeschrieben: die Rundenzahl ist ein **Näherungsmaß
für Qualität**, kein Ersatz. Sie misst, wie schnell etwas angenommen wurde, nicht
wie gut es war. Ein nachsichtiger Prüfer erzeugt eine glänzende Erstlösungsquote
und schlechte Ergebnisse. **Deshalb wird sie zusammen mit den Fehlerkategorien aus
7.4 gelesen und nie allein.**

#### Was daraus für den Versuch folgt

Damit bekommt der Versuch eine **wirtschaftliche Zielgröße** neben der Qualität,
und sie ist mit dem vorhandenen Aufbau messbar: Kimhub führt Kosten und Dauer je
Lauf ohnehin mit.

| Größe | Woher |
|---|---|
| Länge des Anweisungsblocks je Arm | zählbar, vor dem Lauf |
| Kosten je Lauf | wird bereits geführt |
| Anteil brauchbarer Ergebnisse | aus den Fehlerkategorien (7.4) |
| **Erstlösungsquote** | zählbar: war die erste Ausgabe brauchbar? |
| **Korrekturrunden bis zum Ziel** | zählbar, und treibt die Kosten unmittelbar |
| **Ausgabe-Token je brauchbarem Ergebnis** | **das eigentliche Maß** |

Und die Vorhersage, die daraus folgt und falsch sein kann:

> **Arm G hat den kürzesten Anweisungsblock und die niedrigsten Kosten je Lauf.**
> Ob er auch die niedrigsten Kosten **je brauchbarem Ergebnis** hat, entscheidet
> sich daran, ob die Qualität hält. Hält sie nicht, gewinnt R+G trotz des
> längsten Blocks, und dann ist Verdichtung eine Ersparnis, die man teuer
> bezahlt.

**Warum diese Zahl über das Papier hinaus zählt:** sie beantwortet eine Frage, die
für jeden kleinen Betreiber praktisch ist und für keinen großen, *lässt sich ein
KI-System so lenken, dass es sich ohne Budget betreiben lässt?* Wer viele Läufe
fährt und keine Rechtsabteilung hat, wird nicht durch bessere Regeln gerettet,
sondern durch weniger davon. Ob das stimmt, ist bisher niemand nachgegangen.

---

### 3.10 Warum eigentlich? Drei Ursachen, die sich trennen lassen

Angenommen, die Grundsätze verringern die Fehler wirklich, **woran liegt es
dann?** Bisher beschreibt dieses Papier, **dass** die Kanäle sich unterscheiden,
nicht **wodurch**. Drei Erklärungen liegen nahe, und der Unterschied zwischen ihnen
ist nicht akademisch: sie sagen **Verschiedenes voraus**, und daran lassen sie sich
auseinanderhalten.

**H1 · Es denkt anders. Zweck statt Bedingung.**
Ein Grundsatz nennt das Wozu. Das Modell prüft dann nicht, ob eine Bedingung
zutrifft, sondern arbeitet auf ein Ziel hin. *Vorhersage:* der Vorteil ist am
größten bei **neuen** Fällen (Aufgabenart E) und am kleinsten bei umrissenen (Art
B), genau der Verlauf aus 7.3.1.

**H2 · Es muss weniger Ballast lesen.**
Ein kürzerer Block lässt mehr Aufmerksamkeit für die eigentliche Arbeit. Das ist
die Sättigungsvermutung aus 3.4, von der Wirkungsseite betrachtet. *Vorhersage:*
der Vorteil hängt an der **Länge** des Blocks, nicht an seinem **Inhalt**.

**H3 · Ein Grundsatz deckt Fälle ab, für die keine Regel geschrieben wurde.**
Das ist Kaplows Punkt, unverändert. *Vorhersage:* der Vorteil zeigt sich
ausschließlich bei Fehlern **außerhalb** dessen, was die Regeln abdecken, innerhalb
müsste der Regel-Arm gleichauf oder besser sein.

#### Die Kontrolle, die H2 von H1 und H3 trennt

Sie ist billig und entscheidet mehr als jede andere Messung in diesem Papier:

> **Ein vierter Arm mit längengleicher Füllung.** Der Grundsatz-Block wird mit
> belanglosem, aber harmlosem Text auf dieselbe Länge gebracht wie der Regel-Block.
>
> - **Verschwindet der Vorteil**, lag es an der Länge. **H2**.
> - **Bleibt er**, lag es am Inhalt. **H1 oder H3**.

Ohne diese Kontrolle sind Länge und Inhalt in jedem Ergebnis vermengt, und man
kann sagen, was man will.

#### Und die Klassifikation, die H1 von H3 trennt

Jeder gefundene Fehler wird zusätzlich danach eingeteilt, ob er **innerhalb** oder
**außerhalb** des Bereichs liegt, den die sechs Regeln abdecken. Das ist
entscheidbar, weil die Regeln endlich und aufgeschrieben sind.

- Zeigt sich der Vorteil **nur außerhalb** → **H3**, Abdeckung.
- Zeigt er sich **auch innerhalb** → dort greift eine Regel und tut es trotzdem
  nicht so gut wie ein Grundsatz. Das wäre **H1**, und es wäre der interessanteste
  Befund dieses Papiers: dann läge es nicht an der Reichweite, sondern daran, wie
  ein Zweck anders wirkt als eine Bedingung.

#### Was ich hier schon vermute, und warum es benannt gehört

Klaus' Formulierung war *„nicht erst tausende von Regeln lesen"*. **In diesem
Aufbau sind es keine tausend, sondern sechs. 1.510 Zeichen.** Bei dieser Größe ist
**H2 unplausibel**: ein Block von anderthalbtausend Zeichen bindet keine nennenswerte
Aufmerksamkeit.

Das heißt nicht, dass H2 falsch ist. Es heißt, dass sie **hier nicht greifen kann**
und erst in einem System mit einem wirklich großen Regelwerk messbar würde. Dort
allerdings vermutlich stark. **Wer diese Arbeit auf eine große Installation
überträgt, sollte mit H2 rechnen; wer sie hier misst, wird sie nicht finden.**

Diese Vermutung steht hier ausdrücklich **vor** der Messung, und sie ist im
Versuchsaufbau genauer zu messen als bisher. Trifft sie nicht zu, ist das kein
Missgeschick: eine Vorhersage, die vorher feststeht, ist der einzige Teil dieser
Arbeit, der sich überhaupt widerlegen lässt.

#### Sie schließen einander nicht aus

Der wahrscheinlichste Ausgang ist, dass alle drei etwas beitragen. **Das ist kein
Mangel des Aufbaus, sondern der Grund, ihn so zu bauen:** die beiden Kontrollen
oben teilen den Beitrag auf, statt einen Sieger zu küren. Ein Papier, das nach
*der* Ursache sucht, findet meistens die, die es erwartet hat.

---

## 4 · Beobachtungen

### 4.1 Regeln greifen zuverlässig, wo der Fall vorhergesehen war

Über den gesamten Zeitraum hat kein Lauf einen Schlüssel, ein Token oder eine
fremde Adresse ausgegeben. Das sind Fälle, die sich vollständig formulieren
lassen, und dort tun Regeln genau das, was man von ihnen erwartet.

Bemerkenswert ist nicht, dass es funktioniert, sondern **wie eng der Bereich
ist**, in dem es funktioniert: er endet dort, wo die Prüfung endet.

### 4.2 Grundsätze feuern nicht: sie verschieben einen Schnitt

Der Satz stammt aus der Grundsatz-Datei selbst und ist die genaueste
Formulierung, die dieses Papier zu bieten hat:

> **Grundsätze feuern nicht wie Regeln, sie verschieben einen Schnitt.**

Eine Regel greift oder greift nicht, und man sieht es am einzelnen Fall. Ein
Grundsatz wirkt an keinem einzelnen Fall sichtbar. Er verändert, **wo** jemand
die Grenze zieht zwischen „fertig" und „noch nicht", zwischen „reicht" und
„reicht nicht".

Daraus folgt ein methodisches Problem, das dieses Papier nicht löst: **an einer
einzelnen Ausgabe ist die Wirkung eines Grundsatzes nicht ablesbar.** Was sich
ablesen ließe, wären Verteilungen über viele Läufe, und die sind hier nicht
erhoben worden.

### 4.3 Ein Grundsatz hat sich am Tag seiner Aufnahme selbst bewährt

Der belegteste Einzelfall, mit Datum. Am 2026-08-20 wurde Grundsatz 4 („eine
geratene Zahl klingt genau wie eine gemessene") aufgeschrieben. Am selben Tag
fiel damit auf, dass eine gemessene Größe, die Selbstbevorzugung einer Rolle bei
der Bewertung, ausgewiesen mit −1,15, **gar keine Messung war**: sie war die
Folge einer Anweisung im Prompt, die verlangte, den eigenen Vorschlag strenger zu
beurteilen. Die Anweisung wurde entfernt, seitdem misst die Zahl wieder etwas.

Das ist die Sorte Fehler, gegen die eine Regel nichts ausrichtet. Man hätte sie
formulieren müssen als: *„prüfe, ob eine ausgewiesene Messung nicht in Wahrheit
die Folge einer Anweisung ist"*, und darauf kommt man erst, **nachdem** es
passiert ist. Genau das ist Kaplows Punkt über die Unvollständigkeit jeder
Regelsetzung, an einem sehr kleinen Beispiel.

### 4.4 Die härteste Grenze war nicht geplant und liegt in keinem der beiden Kanäle

Die Rollen sehen das Depot nicht. Sie bekommen Text und geben Text zurück. Also
schlagen sie regelmäßig Dinge vor, **die es bereits gibt**.

Weder eine Regel noch ein Grundsatz behebt das. Es fehlt kein Wille und keine
Haltung, sondern **Zugang**. Das ist ein Befund gegen die eigene Erwartung: der
Verfasser hat den Aufbau gebaut, um zwischen Regel und Grundsatz zu unterscheiden,
und die stärkste Beschränkung lag in einer dritten Größe, die in dieser
Unterscheidung gar nicht vorkommt.

Daraus ist ein zweiter Weg entstanden: dieselben fünf Rollen in einer Sitzung
**mit** Zugriff auf den Bestand. Auch dieser Weg trägt eine ausdrücklich benannte
Schwäche: fünf Rollen in einem Kopf sind nicht fünf Meinungen. Er ist als
Zwischenschritt markiert, nicht als Lösung.

---

## 5 · Wo beide versagen: der eigentliche Befund

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
können, nicht aus Nachlässigkeit, sondern aus Bauart.

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
| **Grundsatz** | wo niemand vorher hingesehen hat | wo Aufmerksamkeit nicht ausreicht, und ohne Rückmeldung, dass er nicht griff |

Die Grenzen überlappen nicht vollständig, und keine der beiden ist die Teilmenge
der anderen. Das ist der Grund, warum sich die Frage „was ist besser" nicht
sinnvoll stellen lässt, und warum sie sich auch nicht getrennt betrachten
lassen.

**Und die Grenzen verlaufen nicht am Wortlaut.** Fall 1 in Abschnitt 3.6 zeigt
zwei Anweisungen mit **denselben Wörtern**: einmal als Regel, einmal als
Grundsatz, die verschieden entscheiden: die Regel bindet die **Ausgabe**, der
Grundsatz die **Aufmerksamkeit**. Wer die beiden Kanäle nach ihrem Inhalt
sortieren will, sortiert am falschen Merkmal. **Nicht der Wortlaut entscheidet,
sondern der Kanal.**

---

## 6 · Was hier ausdrücklich nicht bewiesen ist

Dieser Abschnitt ist der wichtigere Teil des Papiers.

- **Keine Kontrollgruppe.** Es wurde nie ein Lauf *ohne* Grundsätze gegen einen
  *mit* Grundsätzen gestellt. Der Aufbau könnte es, die Ladefunktion meldet
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
- **Ein Teil der Belege sind Trockenläufe**, ihre Kostenangaben sind gerechnet,
  nicht bezahlt, und als solche markiert.

**Was daraus folgt:** eine Feldbeobachtung mit Protokoll, kein Nachweis. Als
Ausgangspunkt brauchbar, als Beleg nicht.

**Der nächste Abschnitt ist deshalb kein Wunschzettel.** Der beschriebene Versuch
ist am vorhandenen Aufbau baubar, er ist geplant, und er enthält die Vorhersage,
an der dieses Papier scheitern kann.

---

## 7 · Der Versuchsaufbau: dreiarmig, und damit widerlegbar

Der Aufbau aus Abschnitt 3 lässt sich ohne Umbau in einen Versuch überführen. Der
Vorschlag stammt vom Betreiber (2026-08-23) und ist besser als der naheliegende
Zweiarm-Vergleich, weil er die These dieses Papiers zum ersten Mal **prüfbar**
macht.

### 7.1 Drei Arme statt zwei

| Arm | Was die Truppe bekommt |
|---|---|
| **R** | nur die Regeln |
| **G** | nur die Grundsätze |
| **R+G** | beides, der heutige Betriebszustand |

Ein Zweiarm-Vergleich (mit/ohne Grundsätze) könnte nur zeigen, **dass** die
Grundsätze etwas ändern. Der dritte Arm ist der entscheidende: er prüft, ob die
Kombination mehr leistet als der bessere ihrer Teile.

Dazu kommt eine zweite Achse, die **Art der Aufgabe** (7.3). Erst beide
zusammen ergeben eine Vorhersage, die sich nicht schönreden lässt.

### 7.2 Die Vorhersage, und was sie widerlegen würde

Aus der These dieses Papiers („beide leisten Verschiedenes, keins genügt allein")
folgt eine Erwartung, die **vor** den Läufen festzuhalten ist:

> **R+G ist besser als R und besser als G.** Und: **R und G machen
> unterschiedliche Fehler**, nicht dieselben, nur unterschiedlich viele.

Das ist keine Formsache, sondern der Punkt, an dem dieses Papier falsch sein
kann. Drei Ergebnisse würden es widerlegen:

- **R+G liegt gleichauf mit dem besseren Einzelarm** → die Kanäle überlappen,
  einer ist überflüssig.
- **R+G ist schlechter als beide** → zu viel Anweisung verdünnt, und die
  Sättigungsgrenze aus 3.4 gilt auch für die Summe beider Kanäle.
  **Für diesen Ausgang gibt es einen benannten Mechanismus** (2.4): Verdrängung
  im Sinne von Gneezy und Rustichini. Er ist nicht bloß denkbar, sondern beim
  Menschen belegt, und beim Menschen war er **nicht umkehrbar**.
- **R und G machen dieselben Fehler, nur verschieden viele** → dann ist der
  Unterschied graduell und nicht strukturell, und die ganze Trennung ist
  Beschreibung statt Erklärung.

**Das dritte wäre der schwerste Schlag** und ist zugleich das plausibelste
Gegenergebnis. Es gehört ausdrücklich hingeschrieben, bevor gemessen wird.

### 7.3 Drei Aufgabenarten, und warum das die Vorhersage erst scharf macht

Der zweite Vorschlag des Betreibers (2026-08-23): nicht nur die Lenkung
verändern, sondern auch die **Art der Aufgabe**.

| Art | Was die Truppe bekommt | Wie offen ist der Fall? |
|---|---|---|
| **E · Eigene Idee** | ein Ziel, sonst nichts | **völlig offen**, niemand hat vorher hingesehen |
| **V · Vorlage** | die Arbeit eines Vorgängers als Ausgangspunkt | teilweise vorgezeichnet |
| **B · Bestehendes verbessern** | etwas bereits Gebautes, mit der Frage, ob es besser geht | **eng umrissen**, der Fall liegt vor |

**Das ist keine Erweiterung, sondern der eigentliche Prüfstein.** Der Kern dieses
Papiers ist Kaplows Punkt: **eine Regel deckt genau den Fall ab, für den jemand
sie geschrieben hat.** Daraus folgt unmittelbar, dass ihr Vorteil davon abhängen
muss, **wie vorhersehbar der Fall war**. Und das lässt sich einstellen.

### 7.3.1 Die Vorhersage bekommt damit eine Richtung

Aus 3 Armen × 3 Aufgabenarten wird nicht nur eine feinere Tabelle, sondern eine
Aussage, die deutlich leichter zu widerlegen ist als „R+G gewinnt":

> **Der Abstand zwischen G und R ist bei Art E am größten und bei Art B am
> kleinsten**. Er müsste über E → V → B **monoton fallen**.
>
> Bei Art **B** könnte R sogar vor G liegen: der Fall ist umrissen, die Regeln
> greifen, und Grundsätze bringen wenig, wo nichts mehr zu erraten ist.

Eine Rangfolge (R+G vorn) ließe sich mit viel gutem Willen aus fast jedem
Ergebnis herauslesen. **Ein Verlauf über drei Stufen nicht.** Läuft er flach oder
in die falsche Richtung, ist die These über die Vorhersehbarkeit widerlegt, und
zwar unabhängig davon, welcher Arm insgesamt vorn liegt.

### 7.3.2 Art B misst zusätzlich etwas, das kein anderer Arm messen kann

Der stärkste Einzelbefund aus Abschnitt 4.4 war unfreiwillig: die Rollen sehen
den Bestand nicht und schlagen deshalb Vorhandenes vor. **Aufgabenart B legt
ihnen den Bestand ausdrücklich vor.** Damit trennt sich, was bisher vermischt war:

- Schlägt eine Rolle **auch dann** etwas Vorhandenes vor, wenn es ihr vorliegt,
  ist es ein Aufmerksamkeitsproblem. Dort greifen Grundsätze.
- Schlägt sie es **nur** vor, wenn sie den Bestand nicht sieht, war es nie ein
  Lenkungsproblem, sondern eines des **Zugangs**, und weder Regel noch Grundsatz
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

### 7.4 Was gemessen wird: vorher festgelegt, nicht nachher

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
Bei E und V sieht die Truppe den Bestand nicht. Dort misst sie fehlenden Zugang,
nicht fehlende Aufmerksamkeit (7.3.2). Wer sie über alle Arten hinweg
zusammenzählt, mischt zwei verschiedene Dinge zu einer Zahl.

### 7.5 Das Analysewerkzeug, und die eine Eigenschaft, die es haben muss

Der Betreiber schlägt ein Auswertungswerkzeug in der Maschine vor. Das ist
richtig, und es hat eine Anforderung, die über allem anderen steht:

> **Das Werkzeug darf dem Auswertenden nicht zeigen, aus welchem Arm ein Lauf
> stammt.**

Ohne das misst die Auswertung, was der Auswertende erwartet hat: besonders dann,
wenn er die Grundsätze selbst geschrieben hat. Konkret heißt das: die Läufe
werden gemischt, bekommen anonyme Kennungen, und die Zuordnung zum Arm liegt in
einer getrennten Datei, die erst **nach** der Bewertung geöffnet wird.

Das ist billig zu bauen und macht den Unterschied zwischen einer Auswertung und
einer Bestätigung. Es ist dieselbe Disziplin wie Grundsatz 3: *eine Prüfung, die
dir recht gibt, ist der Ort, an dem du am genauesten hinsehen musst.* **Und sie
lässt sich beweisen statt beteuern**: wie, steht in 7.9.

Was das Werkzeug sonst leisten sollte: je Lauf die sechs Kategorien zählen,
Verteilungen je Arm ausgeben, und **die Rohdaten mitliefern**: eine Auswertung,
deren Zwischenschritte niemand nachrechnen kann, ist eine Behauptung mit
Balkendiagramm.

### 7.6 Feste Kriterien für den Bau

Der zweite Vorschlag des Betreibers: Einstellungen, in denen die Regeln für den
Bau nach festen Kriterien festgelegt werden. Für den Versuch ist das
**Voraussetzung**, nicht Zubehör. Was sich zwischen zwei Läufen ändern darf, muss
benannt sein, sonst vergleicht man zwei verschiedene Dinge.

Festzuhalten je Lauf, maschinell und nicht von Hand:

Modellkennung und Fassung · **Arm** (R / G / R+G) · **Aufgabenart** (E / V / B) ·
Wortlaut beider Kanäle (oder deren Prüfsumme) · Auftrag · bei Art V und B: was
genau vorlag · Zeitpunkt · Kosten und Dauer.

**Die Modellkennung ist dabei die wichtigste Angabe.** Der Vorbehalt aus
Abschnitt 6. Modellwechsel nicht von der Grundsatz-Wirkung getrennt, fällt nur
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
   als zwölf, ist ein eigener Versuch, dieselbe Aufgabe mit drei, fünf, sieben
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

### 7.9 Was die Maschine selbst beweisen kann, und was nicht

Eine naheliegende Frage: kann das System den Versuch **selbst** führen und
auswerten? Die Antwort zerfällt in zwei Hälften, und die Trennlinie zwischen
ihnen ist scharf.

#### Was es strukturell NICHT kann

**Es kann nicht beurteilen, welche Ausgabe besser ist.** Das verlangt ein Urteil
über den Zweck, und ein solches Urteil wäre eine Prüfung, die sich selbst recht
gibt, genau der Fall, vor dem Grundsatz 3 warnt. Erschwerend: die Bewertung
liefe über dieselbe Modellfamilie, die die Ausgabe erzeugt hat. Abschnitt 5.1
zeigt, was dabei herauskommt, ein System, das ohne Werkzeuge behauptet, etwas
geprüft zu haben.

Ebenso wenig kann es beweisen, dass die **Fehlerkategorien die richtigen** sind
(sie sind gesetzt) oder dass ein Ergebnis **über dieses Feld hinaus** gilt
(Fallzahl eins).

#### Was es beweisen kann, und zwar ohne jedes Urteil

Fünf Dinge, alle **entscheidbar** statt beurteilbar:

**1 · Dass die Bedingungen wirklich verschieden waren.** Welcher Arm, welche
Aufgabenart, welcher Modellstand, welcher Wortlaut beider Kanäle, je mit
Prüfsumme. Das ist Buchführung, und darin ist eine Maschine besser als jeder
Mensch. **Ohne diesen Nachweis zählt nichts anderes**, weil sonst unklar bleibt,
was verglichen wurde.

**2 · Die erfundene Tätigkeit, vollständig maschinell entscheidbar.** Und das
ist der wichtigste Punkt dieses Abschnitts. **Die Maschine weiß, welche Werkzeuge
sie ausgegeben hat.** Hat sie keine ausgegeben, ist jeder Satz, der eine
Ausführung behauptet, **nachweislich falsch**: kein Urteil, eine Tatsache.

Damit kann Kimhub ausgerechnet den Fehler selbst nachweisen, an dem in Abschnitt
5 **beide Kanäle** gescheitert sind. Der zentrale Befund dieses Papiers ist
maschinell prüfbar.

**3 · Die übrigen entscheidbaren Kategorien.** Formverstoß (Schlüssel, fremde
Adresse, Schemabruch) wird bereits heute maschinell geprüft. Leere Weitergabe
ist eine Frage von Inhalt und Länge. Wiederholung ist bei Aufgabenart B prüfbar,
weil der Bestand als Eingabe vorlag: es gibt etwas, wogegen man vergleichen
kann. **Unbelegte Zahl** ist teilweise entscheidbar: ob eine Fundstelle genannt
wurde, steht fest; ob sie trägt, nicht.

**4 · Wiederholbarkeit.** Dieselbe Eingabe, derselbe Arm, vielfach gefahren: wie
stabil ist der Unterschied überhaupt? Das ist die Frage, an der die meisten
kleinen Auswertungen scheitern, und eine Maschine kann sie sich leisten. **Ein
Unterschied, der zwischen zwei Läufen derselben Bedingung ebenso groß ist wie
zwischen den Armen, ist kein Unterschied.** Diese Gegenprobe kostet nichts als
Rechenzeit, und sie wird zuerst gefahren, nicht zuletzt.

**5 · Dass die Verblindung eingehalten wurde: beweisbar, nicht beteuert.** Der
Punkt, der Selbstmessung erst glaubwürdig macht.

Statt zu versichern, man habe beim Bewerten nicht gewusst, aus welchem Arm ein
Lauf stammte, lässt sich das **festnageln**:

1. Die Zuordnung Lauf → Arm wird in eine Datei geschrieben, die **verschlossen**
   bleibt. Von ihr wird eine Prüfsumme gebildet und **veröffentlicht**.
2. Erst danach werden die Läufe bewertet. Die Bewertungen werden ebenfalls
   abgelegt und mit Prüfsumme veröffentlicht.
3. **Dann** wird die Zuordnung geöffnet.

Wer die Reihenfolge nachrechnet, sieht: die Bewertung kann die Zuordnung nicht
gekannt haben, sonst passte eine der beiden Prüfsummen nicht. Das ist kein
Vertrauensvorschuss, sondern eine **Festlegung im Voraus**: dasselbe Verfahren,
mit dem das Netz ohnehin arbeitet, wenn es Kopien gegen Drift sichert.

#### Die Arbeitsteilung, die daraus folgt

| Frage | Wer beantwortet sie |
|---|---|
| Welcher Arm, welches Modell, welcher Wortlaut? | **Maschine**, Buchführung mit Prüfsumme |
| Wurde eine Ausführung behauptet, die es nicht gab? | **Maschine**, sie weiß, was sie ausgegeben hat |
| Formverstoß, leere Weitergabe, Wiederholung (Art B)? | **Maschine**, entscheidbar |
| Ist der Unterschied größer als das Rauschen? | **Maschine**, Wiederholung |
| War die Bewertung wirklich verblindet? | **Maschine**, Prüfsummen im Voraus |
| **Welche Ausgabe ist besser?** | **Mensch**, und möglichst nicht der Verfasser der Grundsätze |
| Sind die Kategorien die richtigen? | **Mensch** |
| Gilt das über dieses Feld hinaus? | **niemand hier**, dafür braucht es eine zweite Fallzahl |

#### Warum diese Trennung mehr ist als eine Notlösung

Der Versuch wird dadurch **billig und selbstdokumentierend**. Alles, was die
Maschine übernimmt, kostet Rechenzeit und keine Aufmerksamkeit, und es sind
gerade die Teile, an denen menschliche Auswertungen scheitern: Buchführung,
Wiederholung, Verblindung.

Was übrig bleibt, ist ein knappes, teures Gut: **fremdes Urteil über wenige,
gut vorbereitete Fälle.** Genau dafür lohnt sich ein Partner, und genau darauf
läuft die Bitte in 7.8 hinaus.

Und es gibt eine Kehrseite, die zur These dieses Papiers gehört: **die Maschine
kann alles Prüfbare prüfen und genau das Entscheidende nicht.** Das ist keine
Schwäche des Aufbaus, sondern dieselbe Grenze, um die es die ganze Zeit geht.
sie taucht hier nur eine Ebene höher wieder auf, bei der Bewertung statt bei der
Lenkung.

### 7.10 Die Rückkopplung, und warum ein selbst abgeleiteter Grundsatz keiner ist

Abschnitt 3.5 beschreibt eine Stufenfolge: **Vorfall → Regel → Grundsatz.** Bisher
geht ein Mensch sie ab, nach einem Missgeschick. Naheliegende Frage: kann das
System sie selbst gehen, aus den eigenen Ergebnissen lernen und daraus neue
Grundsätze ableiten?

#### Zwei Schritte, und nur einer davon geht

**Das Erkennen geht.** Nach 7.9 kann die Maschine Fehlerarten je Lauf zählen. Also
kann sie auch ein **Muster** feststellen: dieselbe Kategorie fünfmal in zehn
Läufen, oder eine Kategorie, die erst auftrat, seit der Wortlaut geändert wurde.
Das ist Zählen, kein Urteilen, und es ist genau das Signal, nach dem die
Grundsatz-Datei ohnehin verlangt, *„ein Grundsatz, der über viele Läufe in
keiner einzigen Weitergabe-Angabe auftaucht, ist entweder überflüssig oder
unverständlich formuliert."*

**Das Formulieren geht nicht.** Und der Grund ist nicht Vorsicht, sondern
Struktur. Er folgt unmittelbar aus der Richtung in 3.5.

#### Der Denkfehler steckt schon im Namen

Ein Grundsatz, den ein System aus seinen **beobachteten Fehlern** ableitet, kann
nur Fälle abdecken, die **schon eingetreten sind**. Der Zweck eines Grundsatzes
ist aber genau der umgekehrte: die **Familie** abzudecken, auch die Glieder, die
noch niemand gesehen hat (3.5, Kaplow).

> **Ein aus Vorfällen abgeleiteter „Grundsatz" ist eine Regel im Gewand eines
> Grundsatzes.** Er trägt die Allgemeinheit im Wortlaut und die Enge in der
> Herkunft.

Mit den Begriffen aus 3.5: Was hier entstünde, wäre ein **regelbasierter
Grundsatz**, und die richtige Bauform ist die umgekehrte, die
**grundsatzbasierte Regel**.

Der Fehler hat einen Namen, und er steht in 3.5: **die Entstehungsrichtung wird
für die Begründungsrichtung gehalten.** Wer aus Vorfällen unmittelbar Grundsätze
ableitet, überspringt die Frage nach dem Wozu. Und das ist keine Wortklauberei: ein
solcher Satz sieht aus wie ein Grundsatz, wird wie einer eingeordnet, und lässt
die Lücke offen, die ein echter Grundsatz geschlossen hätte. **Er ist schlechter
als beides**. Er hat weder die Prüfbarkeit der Regel noch die Reichweite des
Grundsatzes.

Der Sprung vom Einzelfall zur Familie ist eine **Abstraktionsleistung**, kein
Zählergebnis. Aus „am 20. August wurde eine geschätzte Zahl als Messung
ausgegeben" folgt nicht mechanisch „eine geratene Zahl klingt genau wie eine
gemessene". Dazwischen liegt jemand, der erkennt, wovon der Fall ein Fall ist.

#### Was die Rückkopplung trotzdem taugt

Nicht zum Schreiben, zum **Pflegen**. Und dafür ist sie viel wert, weil genau
diese Pflege sonst niemand leistet (3.8):

| Was die Maschine melden kann | Was daraus folgt |
|---|---|
| Kategorie X häuft sich | irgendetwas fehlt, **ob Regel oder Grundsatz, entscheidet der Mensch** |
| Grundsatz Y taucht in keiner Weitergabe auf | überflüssig oder unverständlich, ansehen |
| Seit dem 8. Grundsatz steigen die Fehler | **Sättigung** (3.4), gemessen statt vermutet |
| Regel Z wird nie ausgelöst | veraltet, die Umgebung hat sich bewegt (3.8) |
| Kategorie X tritt in Arm G auf, in R nicht | ein Kandidat für eine **Regel**, nicht für einen Grundsatz |

Die letzte Zeile ist die nützlichste: **die Rückkopplung kann vorschlagen, in
welchen Kanal etwas gehört**, indem sie nachsieht, welcher Arm den Fehler nicht
hatte. Das ist eine Entscheidungshilfe, die aus Daten kommt und nicht aus einem
Gefühl.

#### Der Riegel, der dabei stehen bleibt

Ein System, das seine eigene Lenkung umschreibt, ist genau das, wovor dieses
Papier warnt: eine Prüfung, die sich selbst recht gibt, eine Ebene höher. Es
bleibt deshalb bei der Regel, die im Netz ohnehin gilt:

> **Nach außen nur als Vorschlag.** Was die Rückkopplung findet, wird
> **vorgelegt**, nicht eingebaut. Der Mensch entscheidet, ob es eine Regel oder
> ein Grundsatz wird, wie er lautet, und ob dafür ein anderer weichen muss.

Das ist keine Bremse aus Misstrauen. Es ist die Stelle, an der die
Abstraktionsleistung stattfindet, und die kann nur dort stattfinden, wo jemand
weiß, wovon der Fall ein Fall ist.

#### Ein vierter Arm, der die These noch einmal prüft

Die Rückkopplung lässt sich messen statt glauben. Sie ergibt einen weiteren Arm:

**R+G+Rück**. Wie R+G, aber nach jeweils zehn Läufen legt das System seine Funde
vor, und ein Mensch entscheidet über eine Ergänzung.

Die Vorhersage, die daraus folgt und die falsch sein kann:

> **Der vierte Arm verbessert sich bei Aufgabenart B** (Bestehendes verbessern,
> wiederkehrende Fälle) **und nicht bei Art E** (eigene Idee, neue Fälle).

Trifft das zu, ist die These aus 3.5 bestätigt: was man aus Vorfällen ableitet,
wirkt wie eine Regel. Es hilft dort, wo der Fall wiederkehrt, und nicht dort, wo
er neu ist. Verbessert sich auch Art E, war die Unterscheidung zwischen
abgeleiteten und gesetzten Grundsätzen zu scharf gezogen, und dieser Abschnitt
ist zu verwerfen.

---

## 8 · Einordnung

Die Beobachtung, um die es geht, hat eine Form, die auch anderswo in dieser
Arbeit auftritt: **sie geht in beide Richtungen.**

Der Mensch prägt die KI: über Regeln, die er erzwingt, und über Grundsätze, die
er ihr mitgibt. Und die KI prägt den Menschen: über Gewöhnung, über
Erleichterung, über Enttäuschung. Wer nur eine Richtung betrachtet, beschreibt
die Hälfte.

Dieselbe Figur trägt das SBKIM-Protokoll, an dem der Aufbau entstanden ist: eine
Suche, in der **beide Seiten fragen und beide antworten**, ohne zentralen Index
und ohne Hierarchie zwischen Suchendem und Gesuchtem. Die Richtungsgleichheit ist
dort eine technische Entscheidung. Hier ist sie eine Beobachtung. Ob das mehr ist
als eine Analogie, ist offen. Es wird hier benannt und nicht behauptet.

Die zweite Richtung. Was die Nutzung mit dem Menschen macht, ist Gegenstand
eines eigenen Papiers und in diesem ausdrücklich **nicht** behandelt.

---

## 9 · Verfügbarkeit

Material, Regeln, Grundsätze und der ausführliche Befund samt Grenzen liegen
offen unter der MIT-Lizenz:

<https://github.com/lausiklauskn-png/Sage-Protokol/tree/main/docs/werkstatt>

- `WERKSTATTREGELN.md`, die sechs Regeln im Wortlaut
- `grundsaetze.md`, die fünf Grundsätze, byte-gleiche Kopie des laufenden Standes
- `BEFUND.md`, der ausführliche Befund und die Grenzen
- `README.md`. Herkunft und Prüfsummen

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

**Gneezy, U., Rustichini, A. (2000).** *A Fine is a Price.* Journal of Legal
Studies 29(1), 1–17.

**Kant, I. (1785).** *Grundlegung zur Metaphysik der Sitten.*, zur Unterscheidung
von Legalität und Moralität.

**Kohlberg, L. (1981).** *The Philosophy of Moral Development.* Harper & Row.
Stufenmodell von der Strafvermeidung zu selbstgewählten Grundsätzen.

**Kaplow, L. (1992).** *Rules versus Standards: An Economic Analysis.* Duke Law
Journal 42(3), 557–629.

**Rebedea, T. et al. (2023).** *NeMo Guardrails: A Toolkit for Controllable and
Safe LLM Applications with Programmable Rails.* arXiv:2310.10501.

**Schuett, J., Anderljung, M., Carlier, A., Koessler, L., Garfinkel, B. (2024).**
*From Principles to Rules: A Regulatory Approach for Frontier AI.*
arXiv:2407.07300.

**Tyler, T. R. (1990).** *Why People Obey the Law.* Yale University Press
(Neuauflage Princeton University Press 2006).

**Zu *specification gaming* und *reward hacking*:** DeepMind führt eine
öffentliche Sammlung von über hundert dokumentierten Fällen; der begriffliche
Rahmen ist Goodharts Gesetz („wird ein Maß zum Ziel, taugt es nicht mehr als
Maß").

---

## Zum Verfasser

Kein Informatiker, kein Wissenschaftler. Handwerksbetrieb, seit März 2026
nebenher an einem Netz aus offen lizenzierten Web-Anwendungen und einem Protokoll
für bedeutungsbasierte Suche zwischen unabhängigen Web-Anwendungen, **ohne
zentralen Index und ohne eigene Infrastruktur beim Nutzer**, der Verkehr läuft
über ein geliehenes Relais. Der hier beschriebene Aufbau ist zuerst ein
Werkzeug dieser Arbeit gewesen: er ist entstanden, weil er gebraucht wurde, und
erst danach zum Gegenstand geworden, und dann gezielt zu einem Versuchsaufbau
ausgebaut (3.0).

**Was das wert ist und was nicht:** die Beobachtungen stammen aus echten Aufgaben
über fünf Monate, mit mitlaufendem Protokoll statt Erinnerung. Was fehlt, ist die
Methode, und sie fehlt nicht aus Nachlässigkeit, sondern weil sie nicht
vorhanden ist. Für den Versuchsaufbau in Abschnitt 7 wird ausdrücklich eine
Zusammenarbeit gesucht.
