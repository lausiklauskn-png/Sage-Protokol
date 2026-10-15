# Sicherer Umgang im Knotennetz

## Welche Angriffe es gibt, was gemessen dagegen wirkt, und wo die Grenze liegt

**Ein Werkstattbericht aus einem laufenden Netz ohne Server**

Klaus Nitzsche · Hamburg · **Fassung 1 (Entwurf, nicht veröffentlicht)**, 2026-10-15
Lizenz: CC BY 4.0 · Code und Material: MIT
Material: <https://github.com/lausiklauskn-png/Sage-Protokol>
Ergänzung zu: *SBKIM: Ein Protokoll für Semantisches Bidirektionales KI-Matching in
Menschen- und Agentennetzwerken*, DOI 10.5281/zenodo.22277738

> **Stand dieser Fassung.** Entwurf zum Gegenlesen. Jede Literaturangabe trägt ihren
> Prüfstand (gelesen · Auszug · offen, siehe Literatur). Die Zuordnung Natur ↔ Netz ist
> an Fachquellen gegengelesen, aber noch nicht von einer Fachperson. Was in dieser Fassung
> nicht gemessen ist, steht als solches da.

---

## Zusammenfassung

Ein Netz aus Web-Anwendungen, die einander ohne Server finden und befragen, hat keinen
Türsteher. Jeder kann einen Knoten anlegen, jeder kann im gemeinsamen Raum schreiben.
Schutz gibt es nur beim **Empfänger**, durch Prüfungen, die er selbst vornimmt.

Dieser Bericht stellt die Angriffe, die an einem solchen Netz gemessen wurden, den
Gegenmaßnahmen gegenüber, die dagegen gebaut wurden. Grundlage ist ein laufendes Netz
mit 24 eingetragenen Knoten. Am 2026-10-14 wurden dort drei Angriffe nachgestellt, mit
den echten Modulen. Alle drei gingen durch: eine gefälschte Visitenkarte galt als echt,
ein Mithörer konnte im Namen eines anderen Knotens antworten, und der öffentliche
Bedeutungs-Vektor eines Knotens ließ sich kopieren. Alle drei Lücken sind geschlossen
und in die tragenden Anwendungen verteilt, die dritte über eine Prüfung beim Empfänger,
die den Vektor aus der Beschreibung nachrechnet.

Zwei Gedanken tragen den Bericht. **Erstens** genügt keine einzelne Prüfung. Wirksam ist
eine Folge von Hürden, billige zuerst, teure erst im Ernstfall. Die Natur hält Arten mit
genau so einer Folge auseinander, und ein eigener Abschnitt geht dem nach, wie weit der
Vergleich trägt und wo er bricht. **Zweitens** heißt „garantiert" hier nur eines: Zu
jeder Zusicherung gibt es eine Probe, die zeigt, dass der Schutz greift, und eine
Gegenprobe, die den Fehler absichtlich einbaut und zeigt, dass die Probe dann rot wird.
Eine Zusicherung ohne Gegenprobe ist eine Behauptung.

Der Bericht widerspricht einem Satz des eigenen SBKIM-Papers (§7.3) und liefert die
Messung dazu. Er legt seine Grenzen offen: Fallzahl eins, ein Betreiber, kein
unabhängiger Angreifer, und am Tablet, dem eigentlichen Gerät, ist bisher nur eine Zahl gemessen
(die Wiederholgenauigkeit für S2).

---

## 1 · Einleitung

### 1.1 Ein Netz ohne Server

Das Netz, von dem hier die Rede ist, besteht aus kleinen Web-Anwendungen: ein
Rezeptbuch, eine Buchhaltung, ein Formular-Werkzeug, ein Brett für Notizen. Jede
Anwendung liegt als statische Seite im Netz, meist bei GitHub Pages, und läuft ganz im
Browser ihres Nutzers. Damit sie einander finden, meldet sich jede in einem gemeinsamen,
öffentlichen Raum an. Dieser Raum ist ein geliehenes Nostr-Relais: ein Dienst, der
signierte Nachrichten annimmt und an alle weitergibt, die zuhören.

Jede Anwendung trägt eine **Spore**, eine unterschriebene Visitenkarte. Darin stehen
ihr Name, eine Beschreibung in Worten, ein Bedeutungs-Vektor (384 Zahlen, aus der
Beschreibung oder aus den eigenen Inhalten gerechnet) und ihr öffentlicher Schlüssel.
Die Kennung des Knotens ist die Prüfsumme dieses Schlüssels. Wer eine Frage hat, legt
einen Frage-Zettel in den Raum, der gefragte Knoten antwortet mit einem Antwort-Zettel.
Ein KI-Richter, für den der Nutzer seinen eigenen Schlüssel einträgt, kann die Antworten
bewerten.

### 1.2 Was „sicher" hier heißen kann

In einem solchen Netz gibt es niemanden, der Eintritt verlangt. Der Raum ist
öffentlich, und das soll er bleiben: fremde Anwendungen sollen dazukommen können,
ohne jemanden zu fragen. Daraus folgt eine Grenze, die alles Weitere bestimmt.
**Abweisen kann nur der Empfänger.** Er sieht eine Karte, einen Zettel, eine Antwort,
und entscheidet, ob er sie annimmt, markiert oder verwirft.

„Sicher" heißt hier darum nicht, dass nichts Schlechtes in den Raum gelangt. Es heißt:
Was beim Empfänger ankommt, wird so geprüft, dass eine Fälschung auffällt, und so
angezeigt, dass fremder Text keinen Schaden anrichtet. Für jede dieser Zusicherungen
gibt es in diesem Bericht eine Probe und eine Gegenprobe (Abschnitt 9).

### 1.3 Werkstatt statt Labor

Wie die beiden früheren Papers ist auch dieses ein Werkstattbericht. Es gibt einen
Betreiber, ein Netz und keinen unabhängigen Angreifer. Die Angriffe hat der Betreiber
selbst nachgestellt, zusammen mit einer KI-Sitzung, die den Code schreibt und prüft.
Dafür ist das Netz echt. Die Anwendungen werden benutzt, die Fehler sind beim Arbeiten
aufgefallen, und jede Zahl in diesem Bericht steht mit Datum im öffentlichen Depot.

---

## 2 · Das Bedrohungsmodell

### 2.1 Wer angreift

Fünf Arten von Angreifern kommen in Frage. Sie unterscheiden sich darin, was sie
brauchen.

| Angreifer | Was er braucht | Was er will |
|---|---|---|
| **Mithörer** | nichts außer Zugang zum öffentlichen Raum | Fragen lesen, im Namen anderer antworten |
| **Fälscher** | einen eigenen Schlüssel (kostet nichts) | sich als anderer Knoten ausgeben, Rangfolgen verschieben |
| **Flutender** | viele Schlüssel und Zettel | den Raum unbrauchbar machen |
| **Text, der eine KI anweisen will** | ein Feld, das eine KI später liest | den KI-Richter oder eine andere KI zu etwas bringen |
| **Browser-KI des Nutzers** | nichts, sie ist schon da | nichts Böses; sie liest aber die Seite und kann für den Nutzer handeln |

Der letzte Eintrag ist kein Angreifer im üblichen Sinn. Er steht hier, weil eine KI im
Browser alles liest, was die Anwendung anzeigt, auch fremden Text, und weil keine
Prüfung in der Anwendung sie davon abhalten kann (Abschnitt 4.4).

### 2.2 Was ein Angreifer kann und was nicht

Ein Angreifer kann alles lesen, was im Raum steht. Er kann beliebig viele Schlüssel
erzeugen und mit jedem davon gültig unterschreiben. Er kann jeden öffentlichen Wert
eines anderen Knotens kopieren: Name, Beschreibung, Stichworte, Bedeutungs-Vektor.

Er kann **nicht** mit dem privaten Schlüssel eines anderen Knotens unterschreiben.
Dieser Schlüssel bleibt im Browser seines Besitzers. Auf diesem einen Punkt ruht alles,
was in diesem Bericht als Schutz gebaut ist. Daraus folgt eine Regel, die jede Schicht
prüfen muss: **Jedes öffentliche Signal lässt sich nachahmen.** Tragen kann nur ein
Geheimnis oder ein Aufwand, den ein Angreifer nicht billig fälschen kann.

---

## 3 · Stand der Forschung

Nichts in diesem Bericht ist als Idee neu. Signierte Nachrichten ohne Zentrale,
Rechenaufwand gegen Fluten, Vertrauen über Bürgen, die Gefahr von Anweisungen in fremdem
Text: all das ist erforscht. Der Betreiber hat dazu eine klare Frage gestellt: *„was andere
schon erforscht haben … was wir davon übernehmen können und was vorgeschlagen wird für das
Knotennetz. Und warum?"* Die Tabelle beantwortet sie Quelle für Quelle.

| Quelle | Was dort erforscht ist | Was wir übernehmen | Was wir fürs Knotennetz vorschlagen, und warum |
|---|---|---|---|
| Douceur 2002, *The Sybil Attack* | Ohne eine zentrale Stelle lassen sich Sybil-Angriffe (ein Angreifer, viele Identitäten) nur unter unrealistischen Annahmen verhindern. Akzeptiert man jede Identität, für die genug andere bürgen, kann eine Gruppe von Fälschern beliebig viele Identitäten erzeugen (Lemma 3). | die Grenze: im offenen Raum kann jeder viele Kennungen haben | keine Zählung von Stimmen. Eine Bürgschaft zählt nur, wenn der Leser dem Bürgen **selbst** traut (S5, Abschnitt 8). Das umgeht Lemma 3, weil fremde Bürgen gar nicht zählen |
| Zimmermann 1994/1995, PGP-Handbuch | Web of Trust: jeder legt selbst fest, wem er beim Bestätigen fremder Schlüssel traut („unknown, untrusted, marginally trusted, completely trusted"). Das Vertrauen bleibt privat und wird nicht mit dem Schlüssel weitergegeben. | Vertrauen ist eine Entscheidung des Lesers, nicht des Netzes | Bürgen nach diesem Muster, dazu kurze Kette, Ablauf und Widerruf (Abschnitt 8), damit eine alte oder falsche Bürgschaft nicht ewig weiterwirkt |
| Yu et al. 2006, *SybilGuard* | Ehrliche und gefälschte Identitäten hängen nur über wenige „Angriffskanten" zusammen, echte soziale Beziehungen, die schwer zu bekommen sind. | die Idee, dass eine echte Beziehung teurer ist als ein Schlüssel | der zweite Weg beim Bürgen: wer eine Bürgschaft will, meldet sich persönlich, telefonisch oder über eine bekannte Adresse |
| Nostr NIP-01 | Ereignisse tragen Kennung (Prüfsumme des Inhalts) und Schnorr-Unterschrift; jedes Relais und jeder Client kann sie prüfen. | den Raum selbst: das Netz nutzt Nostr-Relais als Transport | die Spore trägt eine **zweite**, eigene Unterschrift (Ed25519). Der Nostr-Schlüssel kostet nichts und sagt nichts über den Knoten |
| Nostr NIP-13, Back 2002 (Hashcash) | Rechenaufwand als Nachweis: die Kennung muss mit einer Zahl von Null-Bits beginnen. Jeder kann das billig prüfen. Laut NIP-13 lässt sich der Aufwand auslagern, er beweist also Arbeit, nicht Herkunft. | das Verfahren für S3 | milde Schwierigkeit, am Tablet gemessen; Zettel ohne Aufwand werden nicht verworfen, nur nachrangig behandelt, weil der Aufwand auch Ehrliche trifft |
| Greshake et al. 2023 | Indirekte Prompt-Injektion: eine KI kann über Inhalte angegriffen werden, die sie liest, etwa Webseiten. | den Begriff und das Modell: jede Antwort eines fremden Knotens ist so ein Inhalt | unbestätigte Antworten gehen nicht an den KI-Richter; Prüfliste davor; S7 als offener Punkt |
| OWASP Top 10 für LLM-Anwendungen, Fassung 2026 (LLM01 Prompt Injection) | Fremde Inhalte sollen über einen getrennten, nach Herkunft gekennzeichneten Kanal gehen; das helfe aber nur gegen nicht-anpassende Angreifer. | die Trennung nach Herkunft (bestätigt, unbestätigt) | die Herkunft am Zettel ist durch Unterschrift belegt, nicht nur behauptet |
| OWASP Top 10 (Web), Fassung 2025 (A05 Injection) | Injektion heißt: nicht vertrauenswürdige Eingabe erreicht einen Interpreter; dazu gehört Cross-Site-Scripting. Abhilfe: Daten von Befehlen getrennt halten. | fremder Text nur als Text, nie als HTML | eine Probe für jede Anzeige-Stelle, weil jede neue Stelle denselben Fehler wieder einführen kann |
| Secure Scuttlebutt (Tarr et al. 2019) | Ein Netz ohne Server, in dem jede Identität ein Ed25519-Schlüsselpaar ist und Nachrichten ein unterschriebenes, fortlaufendes Protokoll bilden. | Identität = Schlüssel, Kennung = Prüfsumme | (nichts darüber hinaus; SSB zeigt, dass der Ansatz trägt) |

Eine Bemerkung zum Stand dieser Quellen. Douceur, NIP-01, NIP-13, das PGP-Handbuch, die
OWASP-Fassungen und Hashcash sind im Wortlaut gelesen, teils über Spiegel auf GitHub.
Bei Greshake et al., SybilGuard und Secure Scuttlebutt sind Titel und Kern über die Seiten
der Autoren und Suchauszüge bestätigt, Seitenzahlen und DOI noch nicht an der Quelle.

---

## 4 · Die Wege fremden Texts

Ein Knoten bekommt fremden Text auf acht Wegen. Für jeden Weg ist entscheidend, **wohin**
er führt: zu einem Menschen, der ihn liest, zu einer KI, die ihn bewertet, oder in eine
Rangfolge, die entscheidet, wer gefragt wird.

| Weg | Fremder Text | Führt zu |
|---|---|---|
| Spore | Name, Beschreibung, Stichworte, Adresse | Anzeige, Rangfolge |
| Karte im Raum | Name (außerhalb der Spore, unsigniert) | Anzeige, Auswahl |
| Frage | Fragetext, Absender | Antwort-Suche beim Gefragten |
| Antwort | Treffer-Titel, Absender | Anzeige, KI-Richter |
| Bedeutungs-Vektor | 384 Zahlen | Rangfolge, Andock-Riegel |
| eingefügte KI-Antwort | Titel, Text, Adresse | Anzeige, Link |
| Briefkasten zwischen Depots | Dateien fremder Depots | KI-Sitzungen, die daran arbeiten |
| die ganze Seite | alles, was angezeigt wird | Browser-KI des Nutzers |

### 4.1 Die Signatur prüft die Herkunft, nicht den Inhalt

Die wichtigste Einsicht der Nachstellung vom 2026-10-14 ist unbequem. Eine Spore mit
einer Beschreibung von 4360 Zeichen, mit HTML darin und mit `javascript:alert(1)` als
Adresse ist **gültig unterschrieben**. Die Prüfung meldet `{"valid":true}`, und das ist
richtig so: sie sagt, dass diese Spore von diesem Schlüssel kommt, und nichts weiter.
Wer der Unterschrift mehr entnimmt, als sie aussagt, hat schon verloren.

### 4.2 Wohin der Text geht, entscheidet über den Schaden

Ein fremder Name auf einer Karte ist harmlos, solange er als Text angezeigt wird. Wird
er als HTML eingesetzt, kann er ein Skript starten. Genau das ist an zwei Stellen im Netz
gemessen worden: in der Mycel-Karte, die das Netz zeichnet, und in Kimboard, dem
Notiz-Brett. In beiden lief in der alten Fassung ein Skript aus einem fremden Namen.
Die Mycel-Karte kappte Namen auf 28 Zeichen; `<img src=x onerror=alert(1)>` hat genau 28.

Text, der an eine KI geht, ist auf andere Weise gefährlich. Er braucht kein Skript, er
muss nur wie eine Anweisung klingen. Davor steht seit Bau 04.J eine Prüfliste, die feste
Wendungen erkennt (Abschnitt 5, Zeile „Anweisung an eine KI").

### 4.3 Der Vektor ist Text in anderer Gestalt

Der Bedeutungs-Vektor sieht nicht wie Text aus, wirkt aber wie einer: er sagt, worum es
bei einem Knoten geht, und entscheidet, wer bei einer Frage zuerst gefragt wird. Er steht
in der unterschriebenen Spore. Bis zum 2026-10-15 war er aber an nichts gebunden. Ein
Knoten konnte den Vektor eines anderen in seine eigene Spore schreiben und bekam damit
dieselbe Verwandtschaft (Abschnitt 5, Zeile „Kopierter Bedeutungs-Vektor").

### 4.4 Die Browser-KI liest alles

Ein Browser mit eingebauter KI liest die Seite, die der Nutzer sieht, und kann für ihn
klicken, tippen und navigieren. Zeigt eine Anwendung fremden Text an, kann diese KI ihn
als Anweisung lesen. Dagegen hilft keine Prüfung in der Anwendung, denn ein Agent
braucht kein Skript, er bedient die Seite wie ein Mensch. Dieser Weg ist **vermutet,
nicht gemessen**. Abschnitt 11 sieht nach, was die Browser-Hersteller selbst dazu sagen.

---

## 5 · Die Gegenüberstellung

Das Herzstück dieses Berichts ist eine Tabelle. Sie stellt jedem Angriff gegenüber, was
er erreichte, was dagegen gebaut ist und wo die Grenze liegt. In der Spalte „Beleg" steht
nur, was **gemessen** ist. Vermutetes ist als solches gekennzeichnet.

| Angriff | Was er erreichte | Gegenmaßnahme | Stand | Beleg | Grenze |
|---|---|---|---|---|---|
| Gefälschte oder nachträglich veränderte Spore im Raum | galt als echt | Echtheit über das Ergebnisfeld `.valid` statt über `!== false` | gebaut 2026-10-14 (Bau 23.R), in 25 Anwendungen | Nachstellung N2/N2b; Probe 18 grün, Gegenprobe 10 von 10 | prüft Herkunft, nicht Inhalt (4.1) |
| Namensvetter verdrängt den echten Knoten | echte Karte ausgeblendet | Echtheit **vor** dem Zusammenfassen nach Namen; die Karte sagt „derselbe Name noch N×" | gebaut 2026-10-14 | N2 a/b | ein gültig signierter Vetter bleibt möglich und wird angezeigt |
| Gefälschte Antwort im Namen eines Knotens | ging an den KI-Richter, stand als „✓ Antwort von …" da | Antworten unterschrieben, nur der Gefragte zählt; unbestätigte gehen nicht an den Richter | gebaut 2026-10-14 | N1 | ältere Knoten antworten unbestätigt, bis sie die neue Fassung tragen |
| Gefälschte oder veränderte Frage | wurde beantwortet | Fragen unterschrieben (S1); gefälschte werden nicht beantwortet, unsignierte höchstens 2 von 6 je Minute | gebaut und verteilt 2026-10-15, 26 von 26 Anwendungen | Probe 13 grün, Gegenprobe 7 von 7 | eine echte, aber lästige Frage bleibt eine echte Frage |
| Fremder Name oder Text als HTML | Skript lief (Mycel-Karte, Kimboard) | fremder Text nur als Text | gebaut 2026-10-14 | alte Fassung 3 rot, neue 4 grün | jede neue Anzeige-Stelle braucht denselben Riegel |
| Kopierter Bedeutungs-Vektor | gleiche Verwandtschaft (0,504 = 0,504), Andock-Riegel 1,000 | Empfänger rechnet den Vektor aus der Beschreibung nach (S2); passt er nicht, kein Vorrang | gebaut und verteilt 2026-10-15, 28 Anwendungen | N2 b/c; Probe 27 grün, Gegenprobe 14 von 14 | braucht das Sprachmodell beim Empfänger; ein Vektor aus Inhalten ist nicht nachprüfbar |
| Anweisung an eine KI in fremdem Text | klassische Wendungen auf Deutsch und Englisch ausgeschlossen | Prüfliste vor dem Richter (04.J) | gebaut | N1 | umformuliert, Französisch und ein kyrillisches „і" gehen durch |
| `javascript:`-Adresse aus einer eingefügten KI-Antwort | lief über die Wege des Moduls nicht, aber nur, weil der Browser es so tut | Schema im Modul prüfen | **offen** | N3 (Chromium headless) | Android, DeX nicht gemessen |
| Fluten des Raums | — | Grenzen am Relais (5 Nachrichten je Sekunde), je Lauf 200 Karten, je Nostr-Schlüssel 3; Rechenaufwand je Zettel (S3) | teilweise | Relais-Grenzen gemessen 2026-08-19 | ein Nostr-Schlüssel kostet nichts; Rechenaufwand trifft auch Ehrliche |
| Selbst ausgestellte Vertrauensnachweise (Sybil) | — | Bürgschaft zählt nur über eigenes Vertrauen (S5) | geplant | — | braucht einen Anker |
| Browser-KI liest und bedient die Seite | — | keine aus der Anwendung heraus | — | **vermutet** | von innen nicht schützbar |

### 5.1 Was die Tabelle über §7.3 des SBKIM-Papers sagt

Das SBKIM-Paper behandelt Angriffe in §7.3 mit zwei Sätzen. Der erste lautet:
*„Im Gegensatz zu Keyword-Systemen ist SBKIM resistent gegenüber SEO-artiger
Manipulation — das Auffüllen einer Selbstbeschreibung mit Keywords verbessert
Match-Scores nicht direkt, da der Evaluator Bedeutung bewertet, nicht lexikalische
Übereinstimmung."*

Dieser Satz war nicht gemessen. Gemessen ist am 2026-10-14 ein stärkerer Weg, den der
Satz nicht bedenkt: Ein Angreifer muss keine Stichworte stopfen, er kopiert den fertigen
Vektor. Damit stimmen Verwandtschaft und Andock-Wert, und daneben kann jeder beliebige
Text stehen. Der Satz in §7.3 ist damit nicht falsch, aber er beantwortet die falsche
Frage. Das veröffentlichte Paper wird nicht geändert. Dieser Bericht stellt den Satz mit
Messung zur Diskussion.

Der zweite Satz von §7.3 sagt, Prompt-Injektion „erfordert Eingabebereinigung in
Produktivumgebungen". Das stimmt, aber die Messung zeigt, wie wenig eine Bereinigung über
feste Wendungen leistet (Zeile „Anweisung an eine KI").

---

## 6 · Was die Natur bewährt hat

Der Betreiber hat diesen Abschnitt ausdrücklich gewünscht, mit einem Satz, der den
Gedanken trägt: *„da ist es bewährt, das ist im Prinzip die Gegenprobe … durch Erhaltung
der Arten."* Die Natur hält Arten seit sehr langer Zeit auseinander, und sie tut es nicht
mit einer Hürde, sondern mit vielen.

### 6.1 Viele Hürden hintereinander

Die Biologie beschreibt die Trennung von Arten als Folge von Barrieren in der Reihenfolge
des Lebenslaufs (Coyne und Orr 2004). Zuerst kommen die billigen: Balz, Paarungszeit,
Lebensraum. Dann die Prüfung an der Zelle, wenn Spermium und Eizelle zusammentreffen.
Erst danach, beim Mischling selbst, zeigt sich, ob die Erbanlagen zusammenpassen. Jede
Hürde filtert nur, was an der vorigen vorbeigekommen ist. Bei zwei Arten der Gauklerblume
haben Ramsey, Bradshaw und Schemske (2003) die Hürden einzeln gemessen: zusammen
verhindern sie etwa 99,87 % des Genflusses, der größte Teil davon, bevor überhaupt ein
Mischling entsteht.

Das ist das Muster, das dieser Bericht überträgt: **billige Prüfungen zuerst, teure erst im
Ernstfall, und keine Prüfung muss alles allein leisten.**

### 6.2 Die Stufen und ihre Entsprechung

| Natur | Im Netz | Wie weit der Vergleich trägt |
|---|---|---|
| Balz, Paarungszeit | Raum-Marke, Protokoll-Version, Zeitstempel, Grenzen am Relais | gut: billig, grob, siebt das Meiste aus |
| teure Balz, das Rad des Pfaus (Zahavi 1975) | Rechenaufwand je Zettel (S3) | mit Vorsicht: das Handicap-Prinzip war lange umstritten und wurde erst durch spätere Modelle gestützt |
| Erkennung an der Eizelle: Bindin beim Seeigel (Vacquier und Swanson 2011), Izumo1 und Juno bei Säugetieren (Bianchi et al. 2014) | Unterschriften an Spore, Antwort und Frage (Bau 23.R, S1) | mit Abstrich: in der Natur bevorzugt dieses Schloss die eigene Art, schließt aber nicht absolut. Juno vom Hamster bindet menschliches Izumo1 (Bianchi und Wright 2015). Eine Unterschrift ist schärfer: sie passt oder passt nicht |
| Fehlerkorrektur bei der Rekombination: Bakterien verweigern den Austausch mit zu fremdem Erbgut über die Reparatur-Proteine mutS und mutL (Rayssiguier, Thaler und Radman 1989), bei höheren Lebewesen leisten das MSH2 und seine Partner; die Suche nach dem passenden Gegenstück übernimmt RecA beziehungsweise Rad51 (Renkawitz et al. 2014) | Vektor gegen Text nachrechnen (S2) | gut: in beiden Fällen wird geprüft, ob zwei Dinge, die zusammengehören sollen, wirklich zusammenpassen |
| Dobzhansky-Muller-Unverträglichkeit: Anlagen, die jede für sich harmlos sind, vertragen sich im Mischling nicht (Orr 1996) | das Siegel prüft, ob die Pflicht-Module zusammenpassen | gut als Bild für „jedes Teil für sich korrekt, zusammen kaputt" |
| Restriktion und Modifikation bei Bakterien: die eigene DNA ist methyliert, fremde ohne diese Markierung wird zerschnitten (Tock und Dryden 2005) | eigene Einträge markieren (S6) | gut, aber S6 ist nicht freigegeben |
| CRISPR: Bakterien bauen Stücke früherer Viren ins eigene Erbgut ein und erkennen sie wieder (Barrangou et al. 2007) | signierte Sperrliste (S4) | gut: ein Gedächtnis an Eindringlinge, das weitergegeben wird |
| piRNA hält springende Gene in der Keimbahn still (Ozata et al. 2019) | Prüfliste vor dem KI-Richter (04.J, S7) | als Bild für „schütze, was weitergegeben wird" |
| Verwandtenerkennung, etwa bei Erdhörnchen über Geruch (Mateo 2003) | eigene Kontakte und Bürgen (S5) | mit Abstrich: Erdhörnchen vergleichen mit einem gelernten Muster, Bürgen beruhen auf ausdrücklicher Zusage |

### 6.3 Wo die Natur verliert, und warum auch das Lehre ist

Der Vergleich wäre unehrlich, wenn er nur die Erfolge zeigte. Die Natur verliert
regelmäßig, und jede Niederlage hat eine Entsprechung im Netz.

**Viren ahmen Schlüssel nach.** Große DNA-Viren tragen Kopien von Botenstoffen und
Rezeptoren ihres Wirts, um seiner Abwehr zu entgehen (Alcamí 2003). Im Netz heißt das:
jedes öffentliche Signal ist kopierbar, und genau so wurde der Bedeutungs-Vektor kopiert.

**Autoimmunität.** Die Abwehr greift den eigenen Körper an, wenn eine ihrer
Toleranz-Stufen versagt (Theofilopoulos et al. 2017). Im Netz: zu scharfe Abwehr trifft
die eigenen Anwendungen. Deshalb wird markiert statt abgewiesen (7.1).

**Mischlinge kommen vor.** Mindestens 25 % der Pflanzenarten und 10 % der Tierarten sind
an Kreuzungen beteiligt (Mallet 2005). Die Hürden sind Filter, keine Mauer. Auch im Netz
kommt eine Fälschung gelegentlich durch, und das System muss damit rechnen.

**Die Bewährung zeigt nur die Überlebenden.** Arten, deren Hürden versagt haben, sind
nicht mehr da, um es zu zeigen.

**Was die Natur bewährt hat, ist das Muster, nicht dieser Code.** Ob die Umsetzung im Netz
trägt, zeigt nur ihre eigene Probe mit Gegenprobe. Beides gehört nebeneinander, und keines
ersetzt das andere.

### 6.4 Störungen als Prüfmechanismus: die Lesart des Betreibers

> **Dies ist die Sicht des Betreibers, nicht ein Befund der Biologie.**

Der Betreiber liest die Niederlagen der Natur anders als üblich: *„ein Virus ist kein
Schädling, ein Virus ist ein Prüfmechanismus … wenn ein System aus dem Gleichgewicht
gerät, zeigen diese Prüfmechanismen, dass etwas nicht stimmt."* Viren, Autoimmunität und
Mischlinge machen nach dieser Lesart eine schwache oder fehlgehende Abwehr sichtbar, bevor
man sie anders bemerken würde.

Die Biologie kennt keinen Planer. Ein Virus ist nicht als Prüfung gedacht, er **wirkt**
aber wie eine, weil er als Auslesedruck aussortiert, was nicht hält. In diesem Sinn, und
nur in diesem, trägt die Lesart auch im Netz: die nachgestellte gefälschte Antwort (N1)
hat sichtbar gemacht, dass Antworten an niemanden gebunden waren. Daraus folgt ein
praktischer Vorschlag: Angriffe, Fluten und Fehlmeldungen nicht nur abwehren, sondern
**aufzeichnen**. Sie zeigen, wo das Netz instabil ist.

---

## 7 · Die Schichten im Netz

Aus dem Muster der Natur ist eine Liste von Schichten entstanden. Jede ist eine Hürde,
keine ist allein genug. Der Betreiber hat am 2026-10-15 die Reihenfolge S1 → S2 → S5 →
S3 → S4 freigegeben; S6 und S7 sind nicht freigegeben.

| Schicht | Vorbild | Was sie tut | Stand am 2026-10-15 |
|---|---|---|---|
| S1 Fragen unterschreiben | Schlüssel und Schloss | Frage-Zettel tragen Spore und Unterschrift; gefälschte Fragen werden nicht beantwortet, unsignierte gedrosselt | gebaut, in 26 von 26 Anwendungen |
| S2 Vektor gegen Text nachrechnen | Fehlerkorrektur bei der Paarung der Chromosomen | der Empfänger rechnet den Vektor aus der Beschreibung nach; Schwelle 0,99 | gebaut, in 28 Anwendungen |
| S3 Rechenaufwand je Zettel | teure Balz | der Sender rechnet vor dem Senden eine kleine Aufgabe (Nostr NIP-13) | geplant |
| S4 Signierte Sperrliste | Gedächtnis an Eindringlinge | nur der Betreiber sperrt; gesperrte Kennungen erscheinen nicht | geplant |
| S5 Bürgen | Verwandtenerkennung | ein bekannter Knoten unterschreibt „diese Kennung kenne ich" | geplant |
| S6 Eigene Einträge markieren | Methylierung | was die App selbst ablegt, trägt eine eigene Prüfsumme | nicht freigegeben |
| S7 Prüfliste über die Wortliste hinaus | piRNA | Weg offen | nicht freigegeben |

### 7.1 Im Zweifel markieren, nicht abweisen

Eine Regel gilt für jede Schicht: **zu scharfe Abwehr trifft die Falschen.** Fremde
Anwendungen im offenen Netz dürfen nicht still herausfallen, nur weil sie eine ältere
Fassung tragen. Deshalb wird im Zweifel markiert. Eine unsignierte Antwort steht als
„unbestätigt" da und geht nicht an den Richter. Eine unsignierte Frage wird beantwortet,
aber gedrosselt. Ein Vektor, der nicht zur Beschreibung passt, bleibt sichtbar und
verliert nur seinen Vorrang.

### 7.2 S2 im Einzelnen, weil es das jüngste Beispiel ist

S2 zeigt, wie eine Schwelle entsteht. Gemessen wurden die gespeicherten Vektoren von elf
Sporen im Depot: verschiedene Knoten liegen zwischen 0,780 und 0,983 auseinander, das
engste Paar sind zwei Tresor-Anwendungen mit fast gleicher Beschreibung. Die Schwelle
0,99 liegt darüber. Ein abgeschriebener Vektor fällt also auch dann auf, wenn er von
einer sehr ähnlichen Anwendung stammt.

Offen war, wie genau dasselbe Sprachmodell denselben Text auf einem anderen Gerät
wiederholt. Rechnete ein Gerät nur auf 0,98 genau nach, stünde jede echte Spore als
„passt nicht" da. Der Betreiber hat das am 2026-10-15 mit einer eigenen Mess-Seite an seinem
Tablet gemessen (Chrome im DeX-Modus): bei neun Sporen ergab der aus der Beschreibung nachgerechnete Vektor **1,0000**,
auch bei Sporen, die auf anderen Geräten unterschrieben worden waren. Die Satz-Schnipsel
kamen einzeln nachgerechnet auf 0,995 bis 0,997, vermutlich weil sie beim Unterschreiben
im Stapel gerechnet werden. Auch sie liegen über der Schwelle.

Zwei Fälle kann S2 nicht prüfen. Ist der Vektor aus den Inhalten einer Anwendung
gerechnet (aus Rezepten etwa), kennt der Empfänger diese Inhalte nicht. Die Karte sagt
dann „Bedeutung aus Inhalten, nicht nachprüfbar", ohne Abzug. Und ohne geladenes
Sprachmodell steht „nicht geprüft" da, nie still ein Haken. Das Modell wird für die
Prüfung nicht eigens geladen, weil es 118 MB groß ist.

---

## 8 · Vertrauen ohne Zentrale: Bürgen

Bürgen sind als Schicht S5 geplant, noch nicht gebaut. Der Abschnitt beschreibt den
Entwurf, damit er vor dem Bau diskutiert werden kann.

### 8.1 Zwischen offenem Raum und geschlossenem Netz

Das Netz kennt heute zwei Lagen. Im **offenen Raum** ist jeder willkommen und nichts
bestätigt, außer dass eine Karte zu ihrem Schlüssel passt. Im **eigenen Netz** teilen
alle einen Code; wer ihn hat, ist drin, wer nicht, sieht nichts. Dazwischen fehlt etwas:
eine Aussage wie „diesen Knoten kenne ich". Das ist der Bürge.

### 8.2 Wie man einen Bürgen bekommt

Der neue Knoten meldet sich auf einem zweiten Weg beim Bürgen: persönlich, am Telefon oder
über eine bekannte E-Mail-Adresse. Beide vergleichen eine Sicherheitsnummer, die aus den
Schlüsseln berechnet ist, wie bei den eigenen Kontakten. Dann unterschreibt der Bürge.
Die Bürgschaft hängt an der **Kennung**, nie am Namen, denn Namen sind frei wählbar.

### 8.3 Warum ein selbst ausgestellter Bürge nichts zählt

Der Betreiber hat den Einwand selbst gebracht: *„Man kann sich auch selber einen Bürgen
ausstellen."* Genau das ist der Sybil-Angriff. Douceur hat 2002 gezeigt, dass ein System,
das jede Identität annimmt, für die genug andere bürgen, einer Gruppe von Fälschern
beliebig viele Identitäten erlaubt. Hundert erfundene Knoten, die füreinander bürgen,
erfüllen jede Zählregel.

Die Antwort darauf ist keine bessere Zählung. Sie heißt: **eine Bürgschaft zählt beim
Leser nur, wenn er dem Bürgen selbst schon traut**, als eigenen Kontakt oder als Anker.
Hundert erfundene Knoten zählen dann bei niemandem, der keinen von ihnen kennt. Das ist
die Lehre aus dem Web of Trust von PGP, wo jeder selbst festlegt, wem er beim Bestätigen
traut, und dieses Vertrauen nicht weitergibt.

### 8.4 Vier Riegel

- **Kurze Kette.** Höchstens zwei Schritte vom eigenen Vertrauen. Der genaue Wert ist eine
  Entscheidung des Betreibers.
- **Der Bürge haftet.** Fällt ein Verbürgter auf, verlieren die Bürgschaften seines Bürgen
  an Gewicht.
- **Widerruf.** Der Bürge zieht zurück, sofort wirksam. Der Widerruf ist selbst
  unterschrieben.
- **Ablauf.** Eine Bürgschaft gilt befristet, vorgeschlagen ist ein Jahr, und wird erneuert.

### 8.5 Der Anker ist eine Mitte, und das wird gesagt

Vertrauen muss irgendwo anfangen. Vorgeschlagen ist die Kennung des Betreibers, fest in
der Anwendung, dazu die eigenen Kontakte des Nutzers. Das ist eine **Mitte** und keine
Gleichberechtigung. Wer das Netz nutzt, soll es wissen. Unverbürgte Knoten bleiben
sichtbar, das offene Netz bleibt offen. Sie bekommen nur keinen Vorrang.

---

## 9 · Wie man prüft, dass ein Schutz wirkt

### 9.1 Probe und Gegenprobe

Jede Zusicherung in Abschnitt 5 hat zwei Prüfungen. Die **Probe** stellt die Lage nach
und zeigt, dass der Schutz greift. Die **Gegenprobe** kopiert den Code in einen
Wegwerf-Ordner, baut genau einen Fehler ein (sie nimmt einen Riegel weg) und lässt die
Probe laufen. Die Probe muss dann rot werden, und zwar an der Stelle, die den Namen
dieses Riegels trägt.

Für S2 sieht das so aus: Die Gegenprobe kennt 14 Fälle, von „Schwelle zu mild (0,98
statt 0,99)" bis „die Karte zeigt die Bedeutung nicht". Alle 14 wurden gefangen, jeder
an der richtigen Zeile.

### 9.2 Drei Ausgänge, nicht zwei

Eine Gegenprobe hat drei mögliche Ergebnisse. Sie **fängt** den Fehler, dann wirkt die
Probe. Sie bleibt **grün**, obwohl der Fehler eingebaut ist. Dann gibt es zwei Ursachen,
die das Gegenteil voneinander verlangen. Entweder ist die Probe **blind** und braucht
einen neuen Wächter. Oder der Eingriff hat den Code gar nicht verändert, weil die
gesuchte Stelle nicht mehr existiert, ein **toter Anker**. Wer beides „blind" nennt,
baut Wächter für Fehler, die nie eingebaut waren.

### 9.3 Grüne Haken, die nichts gemessen hatten

Zwei Fälle aus diesem Netz zeigen, warum die Gegenprobe Pflicht ist.

Die Probe für die Echtheit der Karten war seit Monaten grün. Sie stellte einen Prüfer,
der `true` oder `false` zurückgab. Der echte Prüfer gibt ein Objekt zurück,
`{valid: false, reason: …}`, und ein Objekt ist nie gleich `false`. Die Probe prüfte
also einen Prüfer, den es nicht gab, und die Lücke stand in mindestens sieben
Anwendungen.

Beim Bau der unterschriebenen Antworten rutschte ein Gegenprobe-Fall zweimal durch:
„eine unbestätigte Antwort überschreibt eine bestätigte". Die Fälschung wurde schneller
geprüft und kam deshalb zuerst an. Erst eine Fälschung, die während des Abholens
nachkommt, ließ den Fall rot werden.

### 9.4 Auch eine Probe kann aus anderen Gründen hängen

Ein dritter Fall stammt vom selben Tag wie dieser Entwurf. Eine Browser-Probe in einer
Formular-Anwendung blieb gelegentlich hängen, in 3 von 17 Läufen. Vermutet war ein
Speicherproblem der Anwendung. Gemessen war etwas anderes: die Probe schaltete ihre
Netz-Sperre erst ein, als der neue Tab schon lud, und dabei blieb eine Datei liegen.
Seit die Sperre vor dem Öffnen steht, waren es 0 von 40. Der Fehler lag in der Prüfung,
nicht im Geprüften, und gefunden hat ihn erst der Blick auf den Zustand des hängenden
Tabs.

---

## 10 · Ausrollen in ein lebendes Netz

### 10.1 Eine Lücke steckt in jeder Kopie

Die Anwendungen tragen die Schutz-Module als Kopien. Die falsch gelesene
Echtheitsprüfung stand deshalb nicht an einer Stelle, sondern in mindestens sieben
Anwendungen. Eine Lücke ist erst geschlossen, wenn sie in **allen** Kopien geschlossen
ist.

Bau 23.R ging in 25 Anwendungen, S1 in 26. Jede bekam einen eigenen Pull Request, ihre
eigenen Proben liefen, und erst danach wurde gemergt.

### 10.2 Ein Kanon und ein Verteiler mit Herkunfts-Riegel

Die Module leben an einer Stelle, dem Kanon im Depot Sage-Protokol. Ein Werkzeug
verteilt sie. Es erkennt eine Kopie an ihrem Inhalt, nicht am Dateinamen. Vor jedem
Schreiben fragt es: Stand diese Kopie je so im Kanon? Wenn nicht, hat dort jemand von
Hand gearbeitet, und ein Überschreiben würde diese Arbeit löschen.

Gemessen am Tag, an dem dieser Riegel entstand: 4 von 20 Anwendungen trugen eigene
Änderungen mitten im Modul.

### 10.3 Nachzählen statt der Meldung glauben

Eine Meldung „gemergt" sagt nicht, dass die Änderung angekommen ist. Zweimal hat das
in diesem Netz Arbeit gekostet. Einmal wurde ein Pull Request als gemergt gemeldet, der
keine Zeile enthielt. Ein andermal fiel eine Anwendung aus zwei Verteilungen am selben
Tag heraus, weil ihr Hauptzweig anders hieß. Deshalb gilt: Nach jedem Merge wird auf dem
Hauptzweig nachgezählt, ob die neue Zeile in jeder Kopie steht. Erst danach werden die
Arbeitszweige aufgeräumt.

---

## 11 · Browser und Knotennetz

Der Betreiber hat gefragt, *„inwiefern der Browser selber schon zur Sicherheit beiträgt …
und inwiefern sich das ergänzt oder auch gegenseitig schwächt."* Die Anwendungen laufen
im Browser, und der bringt eigene Schutzschichten mit. Manche helfen dem Netz, manche
gehen an ihm vorbei, eine arbeitet gegen eine Annahme, die man leicht macht.

### 11.1 Was die Plattform liefert

**Die Same-Origin-Policy** trennt Seiten nach Herkunft. Eine Herkunft besteht aus Schema,
Rechner und Port (HTML Living Standard, § Origins). Der Pfad gehört nicht dazu. Das hat
eine Folge, die für dieses Netz zentral ist: `nutzer.github.io/AppA` und
`nutzer.github.io/AppB` haben **dieselbe** Herkunft und teilen sich deshalb den Speicher
des Browsers. Zwei Nutzer auf github.io sind dagegen getrennt, weil github.io auf der
Public Suffix List steht. Die Trennung zwischen den eigenen Anwendungen muss das Netz
also selbst leisten. Es tut das mit Speicher-Namen, die je Anwendung verschieden sind,
und mit einer eigenen Schublade für jede Identität.

**Web Crypto** erlaubt Unterschriften im Browser, ohne Bibliothek von außen. Ed25519, das
Verfahren der Sporen, steht in Firefox seit Version 129, in Safari seit 17 und in Chrome
seit 137 zur Verfügung (Mozilla 2024; Can I Use). Ältere Browser brauchen einen Ersatz.

**Content Security Policy** begrenzt, welche Skripte und Quellen eine Seite laden darf
(W3C, CSP Level 3, Arbeitsentwurf). Auf GitHub Pages lassen sich keine eigenen
HTTP-Kopfzeilen setzen. Ein Mitarbeiter von GitHub schrieb dazu am 2023-05-02: *„We don't
support this feature today so a meta tag unfortunately is the only way"*, und am
2024-07-10, das Thema werde *„not … prioritized"*. Eine Policy im `meta`-Tag kennt manche
Anweisungen nicht, darunter `frame-ancestors`.

**Subresource Integrity** prüft, ob eine nachgeladene Datei unverändert angekommen ist
(W3C-Empfehlung 2016). Das hilft bei Bibliotheken aus fremden Quellen. Das Sprachmodell
dieses Netzes wird von einem fremden Server geladen; ob dort eine Prüfsumme greift, ist
nicht nachgesehen.

### 11.2 Was die Hersteller dazulegen

**Google Safe Browsing** warnt vor Seiten, die als Betrug oder Schadsoftware bekannt sind.
Laut Google nutzen über eine Milliarde Menschen den erweiterten Schutz in Chrome, der dafür
KI-Modelle einsetzt. Seit Chrome 137 kommt auf dem Rechner zusätzlich ein kleines
Sprachmodell (Gemini Nano) gegen Betrugsseiten zum Einsatz, zunächst gegen falsche
Support-Seiten (Google 2025).

**DuckDuckGo App Tracking Protection** blockiert unter Android Verbindungen anderer Apps zu
bekannten Tracking-Firmen, auf dem Gerät selbst, über den VPN-Platz von Android (DuckDuckGo,
Hilfeseiten).

**Für Browser mit KI-Agent** hat Google im Dezember 2025 beschrieben, wie Chrome sich gegen
indirekte Prompt-Injektion schützen soll, also gegen Anweisungen, die in Webseiten stecken
(Parker 2025). Genannt werden ein zweites Modell, das jede geplante Handlung prüft, ohne den
fremden Seiteninhalt zu sehen, eine Begrenzung auf die Seiten, die zur Aufgabe gehören, und
eine Rückfrage beim Nutzer vor kritischen Schritten.

### 11.3 Wo es sich ergänzt und wo es sich reibt

Es **ergänzt** sich dort, wo der Browser Seiten abwehrt und das Netz Zettel prüft. Safe
Browsing weiß nichts von Sporen, und Modul 23 weiß nichts von Betrugsseiten. Beide
Schichten sehen verschiedene Dinge.

Es **reibt** sich an drei Stellen:

- **Die gemeinsame Herkunft.** Was der Browser trennt, sind Herkünfte, nicht Anwendungen.
  Eine Schwachstelle in einer Anwendung unter github.io kann den Speicher aller anderen
  Anwendungen desselben Nutzers lesen. Die Nachstellung N3 hat genau das gezeigt: eine
  `javascript:`-Adresse ohne `target` las den Speicher der Anwendung.
- **Die Browser-KI.** Sie sieht alles, was die Seite anzeigt. Googles Schutz für den Agenten
  setzt bei der **Handlung** an, nicht beim Text. Eine Anwendung kann nicht wissen, welche
  Browser-KI zusieht und wie sie geschützt ist. Ob die übrigen Browser (Edge, Brave, Opera,
  Samsung Internet) Vergleichbares haben, ist **nicht nachgesehen**.
- **Ein App-Schutz kann Verbindungen kappen.** Ein Tracker-Blocker, der über den VPN-Platz
  arbeitet, entscheidet nach seiner eigenen Liste. Ob er die Verbindung zum Relais je
  trifft, ist **nicht gemessen**.

### 11.4 Drei Internetseiten als Fallbeispiele

Der Betreiber hat drei eigene Seiten als Fallbeispiele benannt: Perfect-Skin-Beauty,
PWA-Toolpoint und family-projekt.de. Gemessen wird dort nur mit echtem Abruf, nicht aus
dem Quelltext geschlossen: was der Server wirklich herausgibt, welche Kopfzeilen er setzt,
ob Server-Dateien als Klartext zu lesen sind.

> **In dieser Fassung nicht gemessen.** Aus der Umgebung, in der dieser Entwurf entstand,
> waren die Seiten nicht erreichbar. Der Abschnitt wird mit der nächsten Fassung gefüllt.

---

## 12 · Was offen bleibt

- **Die Prüfliste vor dem Richter** fängt nur feste Wendungen.
- **`javascript:`-Adressen** aus eingefügten KI-Antworten prüft das Modul nicht selbst.
- **Browser mit eingebauter KI** sind aus der Anwendung heraus nicht zu schützen.
- **Bürgen, Rechenaufwand, Sperrliste** (S5, S3, S4) sind geplant, nicht gebaut.
- **Ein gültig signierter Namensvetter** wird angezeigt, und nur wer die Kennung kennt,
  kann ihn vom echten unterscheiden.
- **Am Tablet ist fast nichts gemessen**, dem Gerät, auf dem das Netz benutzt wird. Die
  einzige Messung dort ist die Wiederholgenauigkeit für S2 (7.2).
- **Die drei Internetseiten** aus Abschnitt 11.4 sind in dieser Fassung nicht abgerufen.

---

## 13 · Zur Diskussion

Die Tabelle in Abschnitt 5 ist als Vorlage gedacht. Wer ein anderes Netz ohne Zentrale
betreibt, kann sie Zeile für Zeile durchgehen: Gibt es diesen Weg bei mir? Was erreicht
ein Angreifer dort? Was steht dagegen, und gibt es eine Gegenprobe dazu?

Drei Fragen an Leser:

1. **Wo liegt die richtige Schwelle zwischen markieren und abweisen?** Dieses Netz
   markiert fast immer. Ein Netz mit Geld oder Gesundheitsdaten müsste vermutlich
   abweisen. Wo ist die Grenze?
2. **Kann ein Bürgen-System ohne Mitte auskommen?** S5 setzt einen festen Anker, den
   Betreiber. Das ist ehrlich benannt, aber es ist eine Mitte.
3. **Was tun Browser-KIs mit fremdem Text auf Seiten, die ihn nur anzeigen?** Hier
   endet, was eine Anwendung leisten kann.

---

## 14 · Zur Entstehung dieses Textes

Der Text entstand in einer KI-Sitzung (Claude Code) im Auftrag des Betreibers. Der
Betreiber gab die Gliederung vor und stimmte sie am 2026-10-15 ab. Alle Messwerte stammen
aus dem Depot und stehen dort mit Datum. Die Literaturangaben wurden in derselben
Sitzung an der Quelle nachgesehen, nicht aus dem Gedächtnis übernommen. Die Lesart in
Abschnitt 6.4 ist die des Betreibers und als solche gekennzeichnet.

---

## Literatur

Prüfstand je Eintrag (2026-10-15): **[gelesen]** im Wortlaut an der Quelle oder einem
Spiegel des Originaltexts · **[Auszug]** über Seiten der Autoren, Bibliothekseinträge oder
Suchauszüge bestätigt, Volltext nicht gelesen · **[offen]** eine Angabe (Seiten, DOI) steht
noch aus. Vor der Veröffentlichung wird jeder DOI einmal von Hand aufgelöst.

### Sicherheit und Netze

**Back, A. (2002).** *Hashcash – A Denial of Service Counter-Measure.* Technischer Bericht,
1. August 2002. <http://www.hashcash.org/papers/hashcash.pdf> [gelesen, Spiegel]

**Douceur, J. R. (2002).** *The Sybil Attack.* In: Peer-to-Peer Systems (IPTPS 2002),
LNCS 2429, Springer, S. 251–260. DOI 10.1007/3-540-45748-8_24 [gelesen]

**Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., Fritz, M. (2023).**
*Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with
Indirect Prompt Injection.* arXiv:2302.12173; AISec '23 [Auszug; ACM-DOI und Seiten offen]

**Nostr (o. J.).** *NIP-01: Basic protocol flow description* und *NIP-13: Proof of Work.*
<https://github.com/nostr-protocol/nips> [gelesen]

**OWASP (2025).** *OWASP Top 10:2025*, A05 Injection. <https://github.com/OWASP/Top10>
[gelesen]

**OWASP GenAI Security Project (2026).** *OWASP Top 10 for LLM Applications 2026*, LLM01
Prompt Injection. <https://github.com/GenAI-Security-Project/GenAI-LLM-Top10> [gelesen]

**Tarr, D., Lavoie, E., Meyer, A., Tschudin, C. (2019).** *Secure Scuttlebutt: An
Identity-Centric Protocol for Subjective and Decentralized Applications.* ICN '19, S. 1–11.
DOI 10.1145/3357150.3357396 [Auszug]

**Yu, H., Kaminsky, M., Gibbons, P. B., Flaxman, A. (2006).** *SybilGuard: Defending
Against Sybil Attacks via Social Networks.* ACM SIGCOMM 2006 [Auszug; DOI und Seiten offen]

**Zimmermann, P. (1994).** *PGP User's Guide, Volume I: Essential Topics* (PGP 2.6.2);
Buchausgabe: *The Official PGP User's Guide*, MIT Press 1995 [Handbuch gelesen, Buch Auszug]

### Browser und Plattform

**GitHub Community (2023/2024).** *HTTP Headers (e.g. Content-Security-Policy) on Pages*,
Diskussion #54257. <https://github.com/orgs/community/discussions/54257> [gelesen]

**Google (2025).** *How we're using AI to combat the latest scams.* blog.google [Auszug]

**Google (o. J.).** *Defending 1 billion Chrome users with Enhanced Protection.*
blog.google [Auszug]

**Mozilla (2024).** *Firefox 129 for developers* (Ed25519 in Web Crypto). MDN [Auszug]

**Parker, N. (2025).** *Architecting Security for Agentic Capabilities in Chrome.* Google
Security Blog, 8. Dezember 2025 [Auszug]

**W3C (2016).** *Subresource Integrity.* W3C-Empfehlung, 23. Juni 2016 [Auszug]

**W3C (2025).** *Content Security Policy Level 3.* Arbeitsentwurf, 30. Juni 2025 [Auszug]

**WHATWG.** *HTML Living Standard*, § Origins [Auszug]

**DuckDuckGo (o. J.).** *What is DuckDuckGo App Tracking Protection?* Hilfeseiten [Auszug]

### Biologie

**Alcamí, A. (2003).** Viral mimicry of cytokines, chemokines and their receptors.
*Nature Reviews Immunology* 3, 36–50. DOI 10.1038/nri980 [Auszug]

**Barrangou, R. et al. (2007).** CRISPR provides acquired resistance against viruses in
prokaryotes. *Science* 315, 1709–1712. DOI 10.1126/science.1138140 [Auszug]

**Bianchi, E., Doe, B., Goulding, D., Wright, G. J. (2014).** Juno is the egg Izumo receptor
and is essential for mammalian fertilization. *Nature* 508, 483–487. DOI 10.1038/nature13203
[Auszug]

**Bianchi, E., Wright, G. J. (2015).** Cross-species fertilization: the hamster egg
receptor, Juno, binds the human sperm ligand, Izumo1. *Phil. Trans. R. Soc. B* 370,
20140101 [Auszug]

**Coyne, J. A., Orr, H. A. (2004).** *Speciation.* Sinauer [Auszug, Inhaltsverzeichnis]

**Mallet, J. (2005).** Hybridization as an invasion of the genome. *Trends in Ecology and
Evolution* 20, 229–237. DOI 10.1016/j.tree.2005.02.010 [Auszug]

**Mateo, J. M. (2003).** Kin recognition in ground squirrels and other rodents. *Journal of
Mammalogy* 84, 1163–1181 [Auszug]

**Orr, H. A. (1996).** Dobzhansky, Bateson, and the genetics of speciation. *Genetics* 144,
1331–1335 [Auszug]

**Ozata, D. M., Gainetdinov, I., Zoch, A., O'Carroll, D., Zamore, P. D. (2019).**
PIWI-interacting RNAs: small RNAs with big functions. *Nature Reviews Genetics* 20, 89–108
[Auszug; DOI offen]

**Ramsey, J., Bradshaw, H. D., Schemske, D. W. (2003).** Components of reproductive
isolation between the monkeyflowers *Mimulus lewisii* and *M. cardinalis*. *Evolution* 57,
1520–1534 [Auszug]

**Rayssiguier, C., Thaler, D. S., Radman, M. (1989).** The barrier to recombination between
*Escherichia coli* and *Salmonella typhimurium* is disrupted in mismatch-repair mutants.
*Nature* 342, 396–401. DOI 10.1038/342396a0 [Auszug]

**Renkawitz, J., Lademann, C. A., Jentsch, S. (2014).** Mechanisms and principles of
homology search during recombination. *Nature Reviews Molecular Cell Biology* 15, 369–383
[Auszug]

**Theofilopoulos, A. N., Kono, D. H., Baccala, R. (2017).** The multiple pathways to
autoimmunity. *Nature Immunology* 18, 716–724. DOI 10.1038/ni.3731 [Auszug]

**Tock, M. R., Dryden, D. T. F. (2005).** The biology of restriction and anti-restriction.
*Current Opinion in Microbiology* 8, 466–472 [Auszug]

**Vacquier, V. D., Swanson, W. J. (2011).** Selection in the rapid evolution of gamete
recognition proteins in marine invertebrates. *Cold Spring Harbor Perspectives in Biology*
3, a002931 [Auszug]

**Zahavi, A. (1975).** Mate selection – a selection for a handicap. *Journal of Theoretical
Biology* 53, 205–214 [Auszug]

### Eigenes Material

**SBKIM-Paper (2026).** *SBKIM: Ein Protokoll für Semantisches Bidirektionales KI-Matching
in Menschen- und Agentennetzwerken.* Zweite Fassung, September 2026. DOI 10.5281/zenodo.22277738

Befund der Nachstellungen N1–N3: `docs/sessions/archiv/2026-10-14_angriffsflaeche_mycel.md`;
Schichten: `docs/PLAN_MYCEL_SCHICHTEN.md`; Proben: `tests/smoke_bau23r_echtheit_antworten.mjs`,
`tests/smoke_s1_fragen_signiert.mjs`, `tests/smoke_s2_bedeutung.mjs` und ihre Gegenproben.

---

## Zum Verfasser

Kein Informatiker, kein Wissenschaftler. Seit März 2026 nebenher an einem Netz aus
offen lizenzierten Web-Anwendungen und einem Protokoll für bedeutungsbasierte Suche
zwischen ihnen, ohne zentralen Index und ohne eigene Infrastruktur beim Nutzer.
