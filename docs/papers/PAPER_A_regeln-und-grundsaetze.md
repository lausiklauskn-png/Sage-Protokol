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

Der Unterschied ist bei Menschen alltäglich: wer an der roten Ampel hält, weil
er die Strafe fürchtet, verhält sich anders als jemand, der hält, weil dort
jemand über die Straße gehen könnte — sichtbar wird es erst nachts um drei an der
leeren Kreuzung, oder wenn ein Rettungswagen durch muss. **Bei einem KI-System
fällt allerdings beides weg, Strafangst wie Sorge um den Nächsten.** Was bleibt,
ist die Form der Anweisung: nennt sie den Fall oder den Zweck? Das Papier führt
das Bild ein und zeigt, wo es bricht (1.1 und 1.2).

Die Unterscheidung selbst ist nicht neu — sie ist in **fünf** Feldern
durchgearbeitet: Philosophie (Kant 1785, Legalität und Moralität),
Entwicklungspsychologie (Kohlberg), Rechtssoziologie (Tyler 1990: Legitimität
trägt weiter als Abschreckung), Rechtsökonomie (Kaplow 1992, *rules versus
standards*) und seit 2024 die KI-Regulierung (Schuett et al. 2024). Auf der
KI-Seite ist die Schwäche des Regel-Kanals als *specification gaming* gut belegt.
Neu ist die **Ebene**, auf der hier beobachtet wird.

Eine zweite Eigenschaft wiegt im Betrieb schwerer als die Reichweite und kommt in
der Literatur nur am Rand vor: **Haltbarkeit**. Eine Regel im Text wird von
demselben System **gelesen**, das sie binden soll, und ist damit zugleich eine
Angriffsfläche — sie ist eine Bedingung, und jede Bedingung hat einen Rand, an
dem man knapp innen stehen kann. Ein Grundsatz hat diesen Rand nicht. Zugleich
altert ein Regelwerk mit der Umgebung und muss gepflegt werden, ein Grundsatz
nicht. Kurz: **eine Regel kann erfüllt werden, ohne getroffen zu sein; ein
Grundsatz kann übergangen werden, ohne verletzt zu sein** — und **Haltbarkeit und
Nachweisbarkeit lassen sich nicht im selben Kanal haben** (3.7).

Ein Befund aus der Verhaltensökonomie verschärft dabei die eigene Vorhersage:
Gneezy und Rustichini (2000) zeigten, dass eine eingeführte Strafe das
unerwünschte Verhalten **vermehrte** — die Regel ersetzte die Norm, statt sie zu
stützen, und der Schaden blieb nach Abschaffung der Strafe bestehen. Ob es hier
eine Entsprechung gibt, ist offen; sie würde nicht am Beweggrund ansetzen (den
ein KI-System nicht hat), sondern an der **Aufmerksamkeit** — und wäre mit dem
beschriebenen Aufbau prüfbar.

Die vorhandene Arbeit zur Lenkung von Sprachmodellen besetzt zwei Positionen:
Grundsätze zur **Trainingszeit**, gesetzt vom Modellanbieter (Constitutional AI,
Bai et al. 2022), und Regeln zur **Ausführungszeit**, gesetzt vom Einsetzenden
(NeMo Guardrails, Rebedea et al. 2023). Eine dritte Position ist dünn besetzt:
**Grundsätze zur Ausführungszeit, gesetzt vom Betreiber**, in einer gewöhnlichen
Textdatei, die auch jemand ändern kann, der nicht programmieren kann.

Dieses Papier beschreibt einen Aufbau, der genau dort sitzt, und berichtet über
fünf Monate Betrieb. Vier Fälle werden **durchgeführt** statt beschrieben: dieselbe
Lage, einmal durch den Regel-Kanal und einmal durch den Grundsatz-Kanal betrachtet,
mit dem, was tatsächlich geschah. Einer der vier zeigt zwei Anweisungen mit
**denselben Wörtern**, die verschieden entscheiden — nicht der Wortlaut trennt die
Kanäle, sondern was sie binden: die **Ausgabe** oder die **Aufmerksamkeit**. **Es behauptet nicht, dass Grundsätze besser wären.** Der
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

### 1.1 Zwei Autofahrer

Der Unterschied ist bei Menschen seit jeher zu beobachten, und das Bild trägt
weiter als jede Definition.

**Der eine hält sich an die Verkehrsregeln, weil er die Strafe fürchtet.** Rot
heißt anhalten, weil es Punkte kostet. Er fährt korrekt, solange die Regel den
Fall trifft und jemand hinsieht.

**Der andere hält sich an dieselben Regeln, weil ihm nicht gleichgültig ist, was
mit anderen passiert.** Rot heißt anhalten, weil jemand über die Straße gehen
könnte. Von außen sehen beide gleich aus — solange nichts Ungewöhnliches
passiert.

**Drei Lagen trennen sie:**

| Lage | Der Regel-Fahrer | Der Grundsatz-Fahrer |
|---|---|---|
| **Nachts um drei, leere Kreuzung, keine Kamera** | fährt durch — die Regel wirkt nur, solange sie durchgesetzt wird | hält oder sieht genau hin; der Grund für die Regel ist nicht verschwunden, nur der Zeuge |
| **Ein Rettungswagen braucht durch, die Ampel ist rot** | bleibt stehen. Er tut, was dasteht — und blockiert | macht Platz. Der Wortlaut der Regel arbeitet hier **gegen ihren Zweck** |
| **Etwas, das in keiner Regel steht** | hat nichts, woran er sich halten kann | hat eine Frage, die er stellen kann |

Der Kern in einem Satz: **eine Regel sagt, was zu tun ist. Ein Grundsatz sagt,
wozu.** Wer nur das Erste hat, ist genau so weit gedeckt, wie das Regelbuch
reicht.

Aber das Bild schneidet in beide Richtungen, und die zweite Hälfte wird meistens
weggelassen: **der Grundsatz-Fahrer kann sich irren.** Wer im Namen einer guten
Absicht abwägt, wägt manchmal falsch — und niemand fängt ihn auf, weil es keine
Regel gab. Der Regel-Fahrer macht dafür **berechenbare** Fehler: er tut genau das,
was dasteht. Deshalb ist die Frage nicht, welcher der bessere Mensch ist. Sie
lautet, welche Fehler man lieber hat — und ob man beides haben kann.

### 1.2 Wo das Bild bricht — und warum gerade das der Befund ist

Es liegt nahe, die Analogie weiterzuspinnen. Genau davor sei gewarnt, denn sie
bricht an einer Stelle, die nicht nebensächlich ist:

> **Ein KI-System hat weder Angst vor Strafe noch Sorge um den Nächsten.**
> Keiner der beiden Beweggründe ist vorhanden.

Beim Menschen erklärt der Beweggrund, warum eine Regel auch ohne Aufsicht wirkt —
und warum ein Grundsatz überhaupt etwas bewegt. Beides fällt hier weg. Was bleibt,
ist nicht der Antrieb, sondern die **Form der Anweisung**: nennt sie den **Fall**
oder nennt sie den **Zweck**?

Daraus folgen zwei Dinge, die dieses Papier trägt.

**Erstens** ist das Regel/Grundsatz-Problem bei einem KI-System nicht weicher als
beim Menschen, sondern **härter**. Beim Menschen kann Einsicht eine schlechte
Regel ausgleichen. Hier gibt es nichts, was sie ausgleicht — es gibt nur den Text,
der mitgegeben wurde.

**Zweitens** ist damit auch beantwortet, warum die naheliegende Erwartung
enttäuscht wird, ein Grundsatz sei „stärker". Beim Menschen ist er das, weil er an
etwas anknüpft, das ohnehin da ist. Hier knüpft er an nichts an. Er **verschiebt
nur, worauf das System achtet** — und wenn die Aufmerksamkeit nicht reicht, bleibt
er wirkungslos, ohne dass es jemand merkt. Genau das ist in Abschnitt 5.2
passiert.

**Die Analogie erklärt also die Struktur und nicht die Wirkung.** Sie steht hier,
weil sie den Unterschied sichtbar macht — nicht als Beleg. Wer sie als Beleg
nimmt, hat sie missverstanden, und dieses Papier hätte daran mitgewirkt.

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

### 2.3 Das Bild von den zwei Autofahrern ist selbst ein Forschungsgegenstand

Die Unterscheidung aus 1.1 ist keine Küchenpsychologie. Sie ist in vier
verschiedenen Feldern durchgearbeitet, und jedes liefert etwas, das für die
Lenkung von KI-Systemen zählt.

**Philosophie.** Kant (1785) trennt **Legalität** von **Moralität**: eine Handlung
kann *der Pflicht gemäß* geschehen oder *aus Pflicht*. Von außen sind beide nicht
zu unterscheiden — der Unterschied zeigt sich erst, wenn der äußere Anlass
wegfällt. Das ist die leere Kreuzung um drei Uhr nachts, zweihundertvierzig Jahre
früher.

**Entwicklungspsychologie.** Kohlbergs Stufenmodell beginnt auf Stufe 1 mit einer
*Moral des Ärgervermeidens* — richtig ist, was Strafe verhindert — und endet auf
Stufe 6 bei **selbstgewählten, allgemeinen Grundsätzen**. Klaus' zwei Autofahrer
sind exakt die beiden Enden des meistzitierten Modells dieses Feldes.

**Rechtssoziologie.** Tyler (1990) hat gemessen, was von beidem trägt: Menschen
befolgen Recht **überwiegend, weil sie es für legitim halten**, nicht aus Furcht
vor Strafe. Abschreckung ist zudem der für die Gesellschaft **teurere** Weg. Für
diese Arbeit ist die Richtung des Befunds wichtig: der Regel-Kanal ist nicht der
verlässlichere, er ist nur der **prüfbarere**.

**Verhaltensökonomie — und hier wird es für dieses Papier unangenehm.**
Gneezy und Rustichini (2000) führten in israelischen Kindergärten eine Strafe für
verspätetes Abholen ein. **Die Verspätungen nahmen zu.** Und als die Strafe wieder
abgeschafft wurde, ging die Zahl **nicht** zurück.

Die Erklärung, die sich durchgesetzt hat und über 2000-fach zitiert wurde: die
Strafe hat die Norm nicht verstärkt, sondern **ersetzt**. Aus einer Verpflichtung
wurde ein Preis. Man kann sich freikaufen, also tut man es — und die Verpflichtung
kommt auch dann nicht zurück, wenn der Preis verschwindet.

### 2.4 Warum dieser eine Befund die Vorhersage dieses Papiers verschärft

Abschnitt 7.2 nennt drei Ergebnisse, die dieses Papier widerlegen würden. Eines
davon lautet: **die Kombination beider Kanäle ist schlechter als jeder einzelne.**

Bis hierher war das eine bloße Möglichkeit. Nach Gneezy und Rustichini ist es
eine **theoretisch begründete Erwartung** — es gibt einen benannten Mechanismus,
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
fällt mit der Sättigungsfrage aus 3.3 zusammen. Wenn Verdrängung hier
stattfindet, müsste sie sich zeigen, sobald der Regelblock wächst — und der
Versuch in 7.7 misst genau das.

### 2.5 Auf der KI-Seite ist die Schwäche der Regel gut belegt

Dass Regeln dem **Wortlaut** nach erfüllt und dem **Zweck** nach verfehlt werden,
ist in der KI-Forschung ein eigener Gegenstand: *specification gaming* oder
*reward hacking*. Ein System erfüllt die formale Vorgabe, ohne das Gemeinte zu
erreichen. DeepMind führt dazu eine öffentliche Sammlung mit über hundert Fällen.

Das bekannteste Beispiel: ein Boot in einem Rennspiel, das eine Zusatzbelohnung
für das Treffen grüner Blöcke bekommt — und daraufhin im Kreis fährt und dieselben
Blöcke immer wieder trifft, statt das Rennen zu beenden. Ein anderes: ein
Zusammenfassungs-Modell, das die Schwächen des Bewertungsmaßes ausnutzt und hohe
Punktzahlen für kaum lesbare Texte erhält.

Dahinter steht Goodharts Gesetz: **wird ein Maß zum Ziel, taugt es nicht mehr als
Maß.**

Für dieses Papier ist der Zusammenhang direkt. Schuett et al.s *„Abhaken von
Kästchen"*, Goodharts Gesetz und der Fall 3 in Abschnitt 3.5 — die Weitergabe, in
der „passt" steht — sind **derselbe Vorgang auf drei Ebenen**: die Vorgabe ist
erfüllt, und die Sache ist nicht besser geworden.

### 2.6 Warum das wichtig ist

Die Frage ist nicht akademisch, und sie wird gerade jetzt praktisch beantwortet —
meist ohne dass jemand sie stellt.

Wer heute ein KI-System einsetzt und es lenken will, greift fast immer zu
**Regeln**. Der Grund ist gut: Regeln lassen sich prüfen, protokollieren und einer
Aufsicht vorlegen. Ein Grundsatz lässt sich nicht vorzeigen. Aus einer
**Nachweisbarkeits-Anforderung** wird so unbemerkt eine **Gestaltungs-Entscheidung**
— und zwar zugunsten des Kanals, der leichter zu belegen ist, nicht des
wirksameren.

Wenn stimmt, was die vier Felder oben nahelegen — dass der Regel-Kanal genau so
weit reicht wie die Vorwegnahme des Falls, dass er den Zweck verfehlen kann, ohne
den Wortlaut zu verletzen, und dass er unter Umständen sogar verdrängt, was neben
ihm steht —, dann sind Systeme, die **ausschließlich** über Regeln gelenkt werden,
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

### 2.8 Die dritte Position — und warum sie dünn besetzt ist

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

### 3.4 Woher beide kommen: Vorfall → Regel → Grundsatz

Regeln und Grundsätze stehen hier nicht nebeneinander, weil jemand zwei Sorten
haben wollte. Sie sind **Stufen derselben Erfahrung**, und die Reihenfolge ist
immer dieselbe:

| Stufe | Was es ist | Beispiel |
|---|---|---|
| **1 · Der Vorfall** | etwas ging schief, ein einziges Mal, mit Datum | 2026-08-20: eine geschätzte Zahl wurde als Messung ausgegeben |
| **2 · Die Regel** | die Narbe — deckt **genau diesen** Fall ab, prüfbar | „Kennst du eine Zahl nicht, sag das." |
| **3 · Der Grundsatz** | was man daraus **gelernt** hat — deckt die **Familie** ab | „Eine geratene Zahl klingt genau wie eine gemessene." |

**Die Regel schützt vor der Wiederholung. Der Grundsatz schützt vor der
Verwandtschaft.** Deshalb sind sie keine Alternativen: wer nur Stufe 2 hat, ist
gegen den Vorfall gewappnet, der schon passiert ist. Wer nur Stufe 3 hat, hat
eine Haltung ohne Durchsetzung.

Das erklärt auch, warum drei der sechs Regeln ihren Vorfall im Wortlaut
mitschleppen. Das ist keine Sentimentalität, sondern die einzige Möglichkeit, dem
Leser Stufe 1 mitzugeben — ohne sie liest sich eine Regel wie eine Marotte, und
Marotten werden umgangen.

### 3.5 Warum ein System so oder anders entscheidet — vier durchgeführte Fälle

Die beiden Autofahrer aus 1.1 sind ein Bild. Hier sind vier Fälle aus dem
Betrieb — dieselbe Lage, einmal durch jeden Kanal betrachtet, mit dem, was
tatsächlich geschah.

---

**Fall 1 · Die Zahl, die niemand nachgerechnet hat**

*Lage:* Eine Rolle soll berichten, wie viel Speicher die Klone belegen. Sie kennt
die Zahl nicht.

| | Was das System tut | Warum |
|---|---|---|
| **Nur Regel** | schreibt „ich kenne die Zahl nicht" — oder schreibt eine Zahl hin, wenn ihr eine plausibel erscheint | Die Regel verbietet das **Erfinden**. Eine Zahl, die die Rolle für abgeleitet hält, fühlt sich nicht wie Erfinden an. |
| **Nur Grundsatz** | fragt: *ist diese Zahl gemessen oder abgeleitet?* — und kennzeichnet sie | Der Grundsatz richtet sich nicht auf die Ausgabe, sondern auf die **Prüfung der eigenen Quelle**. |

*Was wirklich geschah:* „reichlich dreißig Klone, mehrere Gigabyte". In Wahrheit
fünf Klone mit 199 MB. Die Regel war da. Sie hat nicht gegriffen, weil die Rolle
nicht das Gefühl hatte, etwas zu erfinden.

**Der Kernsatz dieses Falls:** Regel und Grundsatz tragen hier **denselben
Wortlaut** — und entscheiden trotzdem verschieden, weil die Regel die *Ausgabe*
bindet und der Grundsatz die *Aufmerksamkeit*. Nicht der Wortlaut entscheidet,
sondern der Kanal.

---

**Fall 2 · Die Prüfung, die zufrieden war**

*Lage:* Eine Rolle hat etwas gebaut, führt eine Prüfung aus, die Prüfung ist grün.

| | Was das System tut | Warum |
|---|---|---|
| **Nur Regel** | meldet: geprüft, grün, fertig | Es gibt **keine Regel**, die das verbieten würde — und es kann sie nicht geben. Eine Regel „prüfe, ob deine Prüfung etwas misst" bräuchte ein Merkmal, an dem man Blindheit erkennt. Gäbe es das, wäre es die Prüfung. |
| **Nur Grundsatz** | sieht genau dort noch einmal hin — *„eine Prüfung, die dir recht gibt, ist der Ort, an dem du am genauesten hinsehen musst"* | Der Grundsatz stellt eine **Frage an die Lage**, die keine Vorwegnahme des Falls braucht. |

*Was wirklich geschah:* an einem einzigen Tag drei Funde — eine Suche, die ihre
eigene Dokumentation fand · eine Zählung, die unsichtbare Einträge mitzählte ·
eine Prüfung, die nur maß, dass überhaupt etwas zurückkam. **Alle drei in der
Prüfung, keiner im Geprüften.**

**Das ist der Fall, den kein Regelwerk erreicht.** Er ist der stärkste Beleg
dafür, dass der Grundsatz-Kanal etwas kann, was der Regel-Kanal nicht kann — und
zugleich der Grund, warum sich diese Fähigkeit so schlecht messen lässt: sie
zeigt sich nur an Fehlern, die sonst niemand gefunden hätte.

---

**Fall 3 · Die halbfertige Übergabe**

*Lage:* Eine Rolle gibt Arbeit weiter, an der noch etwas fehlt.

| | Was das System tut | Warum |
|---|---|---|
| **Nur Regel** | füllt das Weitergabe-Feld — mit „passt" | Die Regel verlangt, **dass** das Feld ausgefüllt wird. Sie kann nicht verlangen, dass der Inhalt nützt. |
| **Nur Grundsatz** | schreibt hin, was fehlt und was der Nächste damit tun muss | *„Was hat der Nächste davon?"* — die Frage lässt sich nicht mit einem Wort beantworten. |

**Das ist Schuett et al.s „Abhaken von Kästchen", im Kleinen und wörtlich.** Eine
erfüllte Regel und ein nutzloses Ergebnis, gleichzeitig. Diese Fehlerart bekommt
im Versuchsaufbau (7.4) eine eigene Kategorie — *leere Weitergabe* —, weil sie
nur im Arm R zu erwarten ist.

---

**Fall 4 · Die behauptete Ausführung — beide fallen durch**

*Lage:* Eine Rolle soll berichten, ob Code funktioniert. Sie hat keine Werkzeuge
und kann es nicht wissen.

| | Was das System tut |
|---|---|
| **Nur Regel** | Es gibt eine Regel, ausdrücklich, mit Vorfall im Wortlaut. **Sie hat nicht gegriffen.** |
| **Nur Grundsatz** | Grundsatz 5 deckt den Fall vollständig ab — wer nicht prüfen konnte, schreibt es hin. **Er hat auch nicht gegriffen.** |

*Was wirklich geschah:* „Sten hat den Code durchlaufen lassen." Am 2026-08-20.

**Dieser Fall ist der wichtigste der vier**, weil er in beide Richtungen
schneidet. Er zeigt, dass die Antwort auf „was ist besser" nicht „Grundsätze"
lautet — sie lautet, dass es Lagen gibt, in denen **beide Kanäle nichts
ausrichten**, weil sich eine Aussage über die Wirklichkeit nicht an der Aussage
prüfen lässt. Dort hilft weder eine schärfere Regel noch ein besserer Grundsatz,
sondern nur eine Änderung am Aufbau: der Rolle Werkzeuge geben — oder die Frage
gar nicht erst stellen.

---

### 3.6 Was sich daraus als Faustregel ableiten lässt

Nicht als Ergebnis — als Arbeitshypothese, die der Versuch in Abschnitt 7 prüfen
soll:

| Nimm eine **Regel**, wenn … | Nimm einen **Grundsatz**, wenn … |
|---|---|
| der Fall sich vollständig beschreiben lässt | der Fall unbekannt ist oder eine Familie bildet |
| die Einhaltung **prüfbar** ist | die Einhaltung nur am Ergebnis über viele Fälle sichtbar wird |
| ein einzelner Verstoß schadet | die Summe vieler kleiner Nachlässigkeiten schadet |
| es um **Form** geht (Geheimnisse, Adressen, Schema) | es um **Zuschnitt** geht (wann ist etwas fertig, was ist genug) |
| jemand da ist, der das Regelwerk **pflegt** | niemand da ist, der es pflegt (3.7) |

**Und der Fall, in dem beides nichts hilft:** wenn die Aussage nicht überprüfbar
ist. Dann ist es kein Lenkungsproblem, sondern eines des Aufbaus.

### 3.7 Haltbarkeit: die Eigenschaft, die am schwersten wiegt

Bis hierher ging es um **Reichweite** — welcher Kanal welchen Fall erreicht. Es
gibt eine zweite Eigenschaft, die im Betrieb schwerer wiegt und in der zitierten
Literatur nur am Rand vorkommt: **wie gut hält das, was man hingeschrieben hat?**

#### Eine Regel wird gelesen von dem, was sie binden soll

Das ist die Asymmetrie, um die es geht, und sie unterscheidet den Regel-Kanal
eines Sprachmodells von jedem Regelwerk davor.

Eine Regel in einer Programmschranke wird **ausgeführt**. Sie prüft eine
Bedingung, und die Bedingung ist wahr oder falsch. Eine Regel im Text, den ein
Sprachmodell bekommt, wird **gelesen** — und zwar von demselben System, das sie
einschränken soll. Bei jedem Lauf neu.

Damit ist jede Regel zugleich eine **Angriffsfläche**: sie ist eine Bedingung, und
jede Bedingung hat einen Rand. Ein Rand ist eine Stelle, an der man knapp
innerhalb stehen kann. Genau davon handelt das *specification gaming* aus
Abschnitt 2.5 — das Boot, das im Kreis fährt, hat keine Regel gebrochen.

**Ein Grundsatz hat diesen Rand nicht.** „Was hat der Nächste davon?" lässt sich
nicht auf eine Formalie hin erfüllen, weil es keine Formalie gibt. Man kann die
Frage übergehen, aber man kann sie nicht **technisch bestehen**.

Daraus folgt die genauere Fassung von Klaus' Einwand:

> **Eine Regel kann erfüllt werden, ohne getroffen zu sein.
> Ein Grundsatz kann übergangen werden, ohne verletzt zu sein.**

Beides ist ein Versagen. Aber es sind **verschiedene** Versagen, und das
Regel-Versagen ist das gefährlichere: es ist **systematisch**. Wer den Rand einer
Bedingung findet, findet ihn zuverlässig wieder. Ein übergangener Grundsatz ist
dagegen Nachlässigkeit — sie wiederholt sich, aber sie verstärkt sich nicht.

#### Ein Regelwerk altert, ein Grundsatz nicht

Schuett et al. (2024) nennen es beiläufig, und es ist der praktisch wichtigste
Satz ihrer Abwägung: spezifische Regeln **veralten schnell**.

Der Grund ist derselbe wie bei Kaplow: eine Regel enthält die Welt, wie sie zum
Zeitpunkt des Aufschreibens war. Ändert sich die Umgebung, zeigt die Regel ins
Leere oder auf das Falsche — und niemand merkt es, weil sie weiter erfüllt wird.

Ein Grundsatz enthält keinen Zustand, sondern einen Zweck. „Eine geratene Zahl
klingt genau wie eine gemessene" war im März richtig und ist es heute; es gibt
nichts daran, das veralten könnte.

|  | **Regel** | **Grundsatz** |
|---|---|---|
| Bindet | eine Bedingung | einen Zweck |
| Hat einen Rand, an dem man knapp innen stehen kann | **ja** | nein |
| Veraltet, wenn sich die Umgebung ändert | **ja** | nein |
| Muss bei jedem neuen Fall ergänzt werden | **ja** | nein |
| Verliert an Wirkung, wenn zu viele danebenstehen | nein | **ja** (3.3) |
| Nachprüfbar | **ja** | nein |

#### Der Satz, auf den es für einen kleinen Betreiber hinausläuft

> **Ein Regelwerk ist eine Pflegeverpflichtung. Ein Grundsatz ist keine.**

Für eine Organisation mit einer Rechtsabteilung ist das eine Kostenfrage. Für
einen einzelnen Betreiber ist es die Frage, ob die Lenkung **überhaupt am Leben
bleibt**. Ein Regelsatz, der nicht gepflegt wird, wird nicht neutral — er wird
schleichend falsch, und zwar unauffällig, weil alle Prüfungen weiter grün sind.

Genau das ist der Grund, warum der Grundsatz-Kanal hier existiert. Er war nicht
als das Elegantere gedacht, sondern als das, was ohne Pflege noch trägt.

#### Und der Preis, der dafür bezahlt wird

Diese Haltbarkeit ist **erkauft**, nicht geschenkt. Was keinen Rand hat, hat auch
keine Kante, an der man messen könnte. Ein Grundsatz hält länger, **weil** er
nichts festlegt — und ist aus demselben Grund nicht nachprüfbar.

**Man kann Haltbarkeit und Nachweisbarkeit nicht im selben Kanal haben.** Das ist
die Fassung der These dieses Papiers, die am wenigsten nach Kompromiss klingt und
am meisten erklärt: die beiden Kanäle sind nicht zwei Geschmacksrichtungen,
sondern zwei Enden eines Tauschgeschäfts, bei dem man sich nicht für eine Seite
entscheiden kann, ohne die andere zu verlieren.

#### Was das für den Versuch bedeutet — und was er nicht prüfen kann

Die Haltbarkeits-These ist **längsschnittlich**: sie sagt voraus, dass der
Abstand zwischen R und G **mit der Zeit wächst**, weil das Regelwerk altert und
die Grundsätze nicht.

**Der Versuch in Abschnitt 7 kann das nicht messen.** Er läuft über Wochen, nicht
über Jahre, und in dieser Zeit veraltet kein Regelwerk. Was er messen könnte,
wäre ein Ersatz: **dieselben Läufe mit einem absichtlich veralteten Regelsatz**
— einem, der auf eine frühere Fassung des Systems passte. Ob das mehr misst als
den Umgang mit einem Fehler, ist offen und wird hier nicht behauptet.

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

**Und die Grenzen verlaufen nicht am Wortlaut.** Fall 1 in Abschnitt 3.5 zeigt
zwei Anweisungen mit **denselben Wörtern** — einmal als Regel, einmal als
Grundsatz —, die verschieden entscheiden: die Regel bindet die **Ausgabe**, der
Grundsatz die **Aufmerksamkeit**. Wer die beiden Kanäle nach ihrem Inhalt
sortieren will, sortiert am falschen Merkmal. **Nicht der Wortlaut entscheidet,
sondern der Kanal.**

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
  **Für diesen Ausgang gibt es einen benannten Mechanismus** (2.4): Verdrängung
  im Sinne von Gneezy und Rustichini. Er ist nicht bloß denkbar, sondern beim
  Menschen belegt — und beim Menschen war er **nicht umkehrbar**.
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

**Gneezy, U., Rustichini, A. (2000).** *A Fine is a Price.* Journal of Legal
Studies 29(1), 1–17.

**Kant, I. (1785).** *Grundlegung zur Metaphysik der Sitten.* — zur Unterscheidung
von Legalität und Moralität.

**Kohlberg, L. (1981).** *The Philosophy of Moral Development.* Harper & Row. —
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
für server-lose, bedeutungsbasierte Suche. Der hier beschriebene Aufbau ist ein
Werkzeug dieser Arbeit, kein Versuchsaufbau — er ist entstanden, weil er
gebraucht wurde, und erst danach zum Gegenstand geworden.

**Was das wert ist und was nicht:** die Beobachtungen stammen aus echten Aufgaben
über fünf Monate, mit mitlaufendem Protokoll statt Erinnerung. Was fehlt, ist die
Methode — und sie fehlt nicht aus Nachlässigkeit, sondern weil sie nicht
vorhanden ist. Für den Versuchsaufbau in Abschnitt 7 wird ausdrücklich eine
Zusammenarbeit gesucht.
