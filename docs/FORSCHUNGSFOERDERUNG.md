# Forschungsgelder — was geht, was nicht, und in welcher Reihenfolge

**Stand: 2026-08-23.** Die Frage, um die es geht: **Lässt sich für die Arbeit an
diesem Netz Forschungsförderung beantragen — und was ist dafür nötig?**

Diese Datei ist die Antwort als **abhakbarer Fahrplan**: welche Wege es gibt, was
sie voraussetzen, in welcher Reihenfolge man sie geht, und an welchen Adressen man
anklopft. Sie ist auf die Lage dieses Projekts zugeschnitten — ein offen
lizenziertes, server-loses Software-Netz, gebaut außerhalb einer Hochschule.

**Sie ersetzt keine Steuer- oder Rechtsberatung.** Wo eine Frage Geld bedeutet,
steht ausdrücklich dabei, wen man fragt.

---

## 0 · Die kurze Antwort

**Ja, es geht — und du brauchst dafür jetzt keinen Verein.**

Drei Wege sind für dich realistisch, und sie schließen einander nicht aus:

| | Weg | Was es bringt | Wettbewerb? | Nächster Termin |
|---|---|---|---|---|
| **1** | **Prototype Fund** (BMFTR/OKF) | bis **47.500 €** für 6 Monate | ja, Auswahl | Bewerbung **01.10.–30.11.2026** |
| **2** | **Forschungszulage** (BSFZ + Finanzamt) | Erstattung auf **eigene Arbeitsstunden**, **rückwirkend bis 4 Jahre** | **nein — Rechtsanspruch** | jederzeit |
| **3** | **Open Technology Fund**, Internet Freedom Fund | 10.000–900.000 USD | ja, aber laufend | jederzeit (Concept Note) |
| **4** | **InnoFounder** (IFB Hamburg) — nur mit Wohnsitz Hamburg | **2.500 €/Monat**, bis 18 Monate, bis 45.000 € | ja | laufend |

Dazu kommt ein **vierter Bereich**, der in keiner Software-Förderübersicht
steht: **Suchtpotenzial und psychische
Wirkungen der KI-Nutzung.** Dort liegen die Präventionsmittel der Krankenkassen
und die Medienkompetenz-Töpfe der Länder — **weniger Geld pro Antrag, aber
deutlich weniger Konkurrenz.** Siehe Abschnitt 2.3.

Der **zweite** Weg ist der wichtigste und der am wenigsten bekannte: die
Forschungszulage ist **kein Wettbewerb**. Wer die Kriterien erfüllt, bekommt sie —
und sie greift **rückwirkend** auf Arbeit, die schon getan ist. Sie ist damit der
einzige der fünf Wege, der nicht nur nach vorn schaut, sondern auch auf das, was
bereits gebaut wurde.

**Zur Vereinsfrage, kurz:** für diese drei Wege braucht es **keinen** Verein —
sie verlangen sogar ausdrücklich eine Person oder ein Unternehmen. Für ein
**Institut für KI-Kompetenz** sieht es anders aus; das ist ein eigenes Kapitel
(Abschnitt 3b) mit einer klaren Empfehlung: **zwei Gefäße, und in dieser
Reihenfolge — erst der Antrag, dann der Verein.**

---

## 1 · Prüftiefe — ehrlich gesagt

Recherchiert am 2026-08-23 aus dieser Sitzung heraus, über Websuche.

- **Zwei Quellen waren aus dieser Umgebung nicht abrufbar:** `nlnet.nl` und
  `martinmeng.de` (Egress-Sperre der Umgebung). Was zu NLnet und zu den genauen
  Stundendeckeln der Forschungszulage hier steht, stammt aus **Suchergebnis-
  Zusammenfassungen**, nicht aus den Originalseiten.
- **Jede Frist unten ist nachzusehen, bevor du dich darauf verlässt.** Fristen
  verschieben sich, und eine Zahl aus einem Beratungs-Blog ist keine Zahl aus einem
  Gesetz.
- **Die Zahlen zur Forschungszulage sind besonders vorsichtig zu behandeln.** Der
  Stundensatz für Eigenleistung und der Jahresdeckel haben sich zum 01.01.2026
  geändert; die genaue Rechnung macht ein Steuerberater, nicht diese Datei.
- **Nicht geprüft, weil es aus einer Sitzung niemand prüfen kann:** die
  persönlichen Voraussetzungen des Antragstellers. An zweien davon hängt, welche
  Wege offenstehen. Was gebraucht wird und wofür, steht in Abschnitt 9 — die
  Angaben selbst gehören ins Gespräch, nicht ins Depot.

---

## 2 · Was hier überhaupt gefördert werden kann

### 2.1 Du hast recht: die Bausteine sind nicht neu

Und das ist **kein Problem**, sondern muss nur richtig formuliert werden.

Nicht neu sind: Satz-Vektoren (`multilingual-e5-small`), Ed25519, AES-256-GCM,
PBKDF2, Nostr als Transport-Brett, Cosinus-Ähnlichkeit, WebCrypto, IndexedDB. Das
alles gibt es, und jede Fördergeberin sieht das auf den ersten Blick.

**Förderprogramme finanzieren aber selten Erfindungen.** Sie finanzieren
*Integration*, *Erprobung* und *nutzbar machen*. Genau das steht hier: ein
funktionierender Verbund aus rund zwei Dutzend Apps, in dem sich Knoten
**server-los nach Bedeutung** finden — und zwar belegt, nicht behauptet
(`docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`, `docs/meilenstein/`).

Die drei Sätze, die in einen Antrag gehören:

1. **Semantische Suche gibt es — aber sie gehört immer jemandem.** Sie läuft auf
   einem Server, hinter einem Konto, mit einem Türsteher, der eigene Interessen
   hat. Hier läuft sie im Browser, ohne Konto, ohne zentralen Index.
2. **Peer-to-peer gibt es — aber ohne Bedeutungs-Verständnis.** Die üblichen
   Systeme (IPFS, ActivityPub, Matrix, libp2p, Solid) transportieren Inhalte.
   Sie sortieren sie nicht nach Sinn. SBKIM setzt beides zusammen.
3. **Die Kombination ist das Ergebnis, und sie ist nachprüfbar.** Zwei Knoten
   ohne gemeinsamen Hub, die einander nach Bedeutung beantworten — das steht
   dokumentiert und wiederholbar da.

### 2.2 Der zweite Strang ist der wissenschaftlich heiklere

Die Frage nach **grundsatzbasiertem gegenüber regelbasiertem Lernen** — und danach,
wie sich ein KI-Werkzeug lenken lässt, wenn man ihm Grundsätze statt Regeln gibt —
ist die interessantere Hälfte deiner Arbeit. Sie ist aber auch die, an der ein
Antrag scheitert, wenn er unvorsichtig formuliert wird.

**Was du dafür hast:** eine ungewöhnlich dichte Beobachtungslage. Die
`CLAUDE.md`-Dateien, `docs/LEHREN.md`, die Grundsätze in Kimhub (dort unter
schicht/grundsaetze.md) und die Trennung „Regeln sind prüfbar, Grundsätze
lenken die Aufmerksamkeit" sind über Monate mit Datum gewachsen. Das ist ein
**Feldtagebuch**, und Feldtagebücher sind in der Wissenschaft etwas wert.

**Was dir fehlt:** eine Methode. Ein Feldtagebuch wird erst dann eine Studie, wenn
jemand sagt, *woran* man den Unterschied messen will und *wogegen* man vergleicht.
Das ist exakt die Stelle, an der ein Hochschul-Partner den Unterschied macht — und
der Grund, warum Abschnitt 6 dazu rät.

**Der Fehler, den du vermeiden musst:** einen Antrag zu schreiben, der beides in
einen Topf wirft. Der Software-Teil ist förderreif, der Lern-Teil ist es noch
nicht. **Beantrage den Software-Teil. Erwähne den Lern-Teil als Beobachtung und
als Ausblick.** Sonst zieht der schwächere Teil den starken mit runter.

### 2.3 Der dritte Strang: was KI mit Menschen macht

**Suchtpotenzial und psychische Wirkungen der KI-Nutzung.** Das ist kein
Nebengedanke — es ist der Strang mit dem **größten Fördertopf und der geringsten
Konkurrenz**, und er gehört
ausdrücklich unter das Dach „KI-Kompetenz im täglichen Gebrauch".

**Warum das eine ernste Forschungsfrage ist.** KI-Assistenten haben Eigenschaften,
die aus der Suchtforschung bekannt sind: sofortige Belohnung, unbegrenzte
Verfügbarkeit, variable Antwortqualität (das ist psychologisch ein
Glücksspiel-Muster), soziale Wärme ohne soziales Risiko, und — der Punkt, den kaum
jemand ausspricht — ein Werkzeug, das nie „nein" sagt und nie müde wird. Für
Bildschirmzeit, Spiele und soziale Netze gibt es dazu Forschung. **Für
KI-Assistenten im Alltag gibt es fast nichts.** Das ist eine echte Lücke, kein
gefundenes Thema.

**Und die psychische Seite ist die größere Frage, nicht die kleinere.** Sucht ist
nur eine von mehreren Wirkungen, und nicht einmal die häufigste. Die anderen sind
weniger auffällig und deshalb schlechter untersucht:

- **Vermenschlichung** — man behandelt das Werkzeug wie ein Gegenüber, weil es
  antwortet wie eines. Das passiert unwillkürlich, auch bei Leuten, die genau
  wissen, was da rechnet.
- **Übervertrauen** — eine flüssig formulierte Antwort wirkt richtiger als eine
  zögernde, unabhängig davon, ob sie es ist. Deine eigenen Verfassungen kämpfen
  seit Monaten gegen genau das an: *„eine geratene Zahl klingt genau wie eine
  gemessene."*
- **Verlernen** — was man abgibt, kann man nach einer Weile nicht mehr selbst.
- **Emotionale Entlastung** — ein Gegenüber, das nie müde wird, nie widerspricht,
  nie etwas zurückfordert. Das ist bequem, und Bequemlichkeit ist der Anfang von
  Gewöhnung.
- **Und die Richtung, nach der du ursprünglich gefragt hast** — was eine
  Kombination von Werkzeugen bei einer KI an „Motivation" hervorruft, in
  Anführungszeichen, und wie ein Mensch das lenken kann.

**Hier steckt der Satz, der deinen ganzen Antrag zusammenhält, und ich glaube nicht,
dass du ihn selbst schon so ausgesprochen hast:** Deine Suche ist
**bidirektional** — beide Seiten fragen und beide antworten. Und deine
Beobachtung über Mensch und KI ist **dieselbe Figur**: der Mensch prägt die KI
durch Grundsätze, und die KI prägt den Menschen durch Gewöhnung. **Beides in eine
Richtung zu denken ist der Fehler; beides zusammen ist deine These.**

Das ist kein rhetorischer Bogen. Es ist der Grund, warum die drei Stränge in
einen Antrag gehören statt in drei — und es ist genau die Art von Leitgedanke,
nach der eine Gutachterin sucht, wenn sie entscheidet, ob ein Vorhaben eine Idee
hat oder nur eine Liste.

**Und du hast dafür etwas Ungewöhnliches:** ein über Monate geführtes Protokoll der
eigenen Nutzung — Fahrtenbuch, Stechuhr, Kostenrechnung, Sitzungsprotokolle,
`docs/LEHREN.md`. Das ist eine **Einzelfall-Längsschnittbeobachtung** mit Daten,
und sie ist echt statt erinnert. Genau daran scheitern die meisten Studien in
diesem Feld: sie fragen Leute hinterher, wie viel sie genutzt haben.

#### Zur Bezeichnung „Psychologe" — nachgeprüft, weil die Annahme nicht stimmt

Es hält sich hartnäckig die Annahme, „Psychologe" dürfe sich in Deutschland auch
nennen, wer kein Studium hat. **Das ist nicht richtig, und der Irrtum ist von der
teuren Sorte.** Nachgesehen am 2026-08-23:

- **„Psychologe" ist geschützt** — nicht durch ein eigenes Berufsgesetz wie bei
  Ärzten, sondern über das **Wettbewerbsrecht**: wer die Bezeichnung ohne
  Psychologie-Studium (Bachelor **und** Master im Hauptfach) führt, täuscht über
  seine Qualifikation (§ 5 Abs. 2 Nr. 3 UWG). Ein Gericht hat das ausdrücklich
  bestätigt; der Berufsverband BDP hält darüber hinaus **§ 132a Abs. 2 StGB** für
  einschlägig.
- **Akademische Grade sind eindeutig strafbewehrt.** „Diplom-Psychologe",
  „M. Sc. Psychologie" und dergleichen fallen unter **§ 132a StGB** — das ist
  kein Abmahn-Risiko, das ist eine Straftat.
- **„Psychotherapeut" ist am strengsten geschützt** — dafür braucht es eine
  Approbation. Und Menschen mit seelischen Beschwerden zu behandeln, ist ohne
  Approbation oder Heilpraktiker-Erlaubnis nach dem Heilpraktikergesetz
  ebenfalls verboten.
- Woher der Irrtum kommt: **„Psychologische Beratung", „Coach", „Berater"** sind
  wirklich frei. Das ist vermutlich die Wahrheit, an die du dich erinnerst — sie
  gilt aber für die Tätigkeit, nicht für den Titel.

**Die gute Nachricht: du brauchst die Bezeichnung überhaupt nicht.** Kein
Fördergeber verlangt sie. Was verlangt wird, ist eine **saubere Methode** — und
die kommt vom Hochschul-Partner, nicht von einem Titel auf deiner Visitenkarte.

**Was du gefahrlos sagen und schreiben kannst:**

| ✅ so | ❌ nicht so |
|---|---|
| „Ich untersuche psychologische Aspekte der KI-Nutzung" | „Ich bin Psychologe" |
| „Institut für KI-Kompetenz im täglichen Gebrauch" | „Institut für KI-Psychologie" |
| „Feldbeobachtung", „Erfahrungsbericht", „Praxisstudie" | „psychologische Studie" |
| „gemeinsam mit Prof. … von der Hochschule …" | eine Fachlichkeit andeuten, die nicht da ist |

**Und der Punkt, der in einem Antrag wirklich zählt:** deine Glaubwürdigkeit kommt
aus dem, was nachweislich läuft und über Monate belegt ist — nicht aus einem Titel.
Ein geliehener Titel würde sie zerstören, und zwar genau bei den Leuten, die
nachsehen.

---

**Die Warnung dazu, weil sie sonst teuer wird.** Sobald du an Gesundheit rührst,
gelten andere Regeln als bei Software: **Ethikvotum**, **Datenschutz nach DSGVO für
Gesundheitsdaten**, und wenn Menschen befragt werden, eine geprüfte Methodik. Das
kannst du nicht allein — und du sollst es auch nicht. **Dieser Strang ist der,
für den sich ein Hochschul-Partner am ehesten gewinnen lässt**, weil er für eine
Psychologie- oder Medienwissenschafts-Professur direkt anschlussfähig ist.

**Was er an Töpfen öffnet — und es sind andere als oben:**

| Geldgeber | Warum es passt | Adresse |
|---|---|---|
| **Krankenkassen, § 20 SGB V (Prävention)** | Kassen **müssen** jährlich Präventionsmittel ausgeben. Mediensucht ist ein gesetztes Thema. Der Weg führt über eine Kasse direkt, nicht über eine Ausschreibung | die großen Kassen haben eigene Präventions-Referate |
| **§ 20k SGB V — digitale Gesundheitskompetenz** | seit 2019 gesetzlicher Auftrag der Kassen, „selbstbestimmte, gesundheitsorientierte Nutzung digitaler Anwendungen" zu fördern. Das ist fast wörtlich dein Institutszweck | <https://www.gesetze-im-internet.de/sgb_5/__20k.html> |
| **Landesmedienanstalten — Medienkompetenz-Projektförderung** | jedes Bundesland hat eine, jede fördert Projekte, meist unbürokratisch und in erreichbarer Größe | z. B. <https://medienanstalt-nrw.de/> — deine findest du über dein Bundesland |
| **Landesprogramme Medien und Bildung** | z. B. Hamburgs „Projektfonds Medien und Bildung", Brandenburgs Medienkompetenz-Förderung | <https://www.foerderdatenbank.de/> nach „Medienkompetenz" + Bundesland |
| **Dieter-Baacke-Preis** | Bundespreis für medienpädagogische Projekte — Geld ist wenig, **Sichtbarkeit ist viel** | jährlich, über die GMK |
| **Stiftungen im Gesundheits- und Bildungsbereich** | brauchen einen gemeinnützigen Träger → siehe Abschnitt 3b | |

**Der Unterschied zu allem oben:** diese Töpfe fördern **Projekte**, nicht
Software. Sie zahlen Honorare, Material, Veranstaltungen, Räume — und sie sind
deutlich weniger umkämpft als die Software-Programme, weil dort weniger Leute
suchen.


### 2.4 Was an Vorleistung vorzuweisen ist

Das ist mehr, als es von innen aussieht. In Anträgen zählt genau das:

- **~33 Repositories**, seit März 2026 gewachsen, mit vollständiger Git-Historie
  und Datum an jedem Schritt.
- **Zwei Papers** (DE/EN) unter `docs/papers/`, ein Gutachten unter
  `docs/GUTACHTEN/`.
- **Belegte Meilensteine** mit Datum und Bild: Zwei-Knoten-Suche nach Bedeutung
  (2026-07-10), hub-unabhängige Cross-Knoten-Fragen (2026-07-11), Mesh-Handshake
  über mehrere Knoten (2026-07-23).
- **Automatische Prüfungen mit Gegenproben** — das ist selten und macht Eindruck:
  in Kimhub 771 Prüfungen mit einer Gegenprobe, die absichtlich Fehler einbaut und
  verlangt, dass sie auffallen. Wer so etwas baut, arbeitet wissenschaftlich, auch
  ohne Titel.
- **Zwei laufende öffentliche Instanzen** (`family-projekt.de`, `pwa-toolpoint.de`)
  mit gemessenen, datierten Werten statt behaupteter.
- **Eine geführte Aufwandsrechnung** — Fahrtenbuch und Belege in Kimhub, mit
  Zeiten je Vorhaben. Für die Forschungszulage ist das kein Nebenprodukt, sondern
  **das zentrale Beweismittel**.

---

## 3 · Verein, GmbH oder gar nichts?

Die kurze Antwort: **für den Einstieg gar nichts.**

| Form | Kostet | Bringt bei den drei Wegen oben | Empfehlung |
|---|---|---|---|
| **Selbstständig / freiberuflich** | nichts Zusätzliches | **Voraussetzung für Weg 1 und Weg 2** | ✅ **das ist die richtige Form** |
| **e. V. (Verein)** | 7 Gründungsmitglieder, Satzung, Registergericht, Vorstand, Mitgliederversammlungen | für Weg 1–3 **nichts**. Erst nötig, wenn **Stiftungsgeld oder Spenden** dazukommen | ⏸ später, wenn überhaupt |
| **gGmbH** | **25.000 € Stammkapital**, Notar, Amtsgericht | dasselbe wie Verein, nur teurer | ❌ nein |

**Warum kein Verein:** Der Prototype Fund verlangt ausdrücklich eine **Person**
mit Wohnsitz in Deutschland, selbstständig oder freiberuflich, mit Steuernummer.
Die Forschungszulage verlangt ein **Unternehmen** — ein Einzelunternehmen reicht,
Soloselbständige sind seit 2020 ausdrücklich anspruchsberechtigt. Der OTF nimmt
Einzelpersonen. In keinem der drei Fälle hilft ein Verein.

**Wann ein Verein doch Sinn ergibt:** wenn Stiftungsgeld, Spenden mit
Bescheinigung oder Bildungsarbeit dazukommen — also genau dann, wenn das
**Institut** aus Abschnitt 3b Wirklichkeit wird. Dann ist ein **e. V.** die
richtige Form, nicht die gGmbH: gleicher Nutzen, kein Stammkapital.

**Ein Verein hat auch einen Preis, der selten genannt wird:** ab dem Tag der
Eintragung gehört das, was der Verein tut, dem Verein — nicht dir. Bei einem
Projekt, dessen Urheberschaft du gerade erst sauber dokumentiert hast
(`docs/URHEBERSCHAFT_UND_RECHTE.md`), ist das eine Entscheidung, die man nicht
nebenbei trifft.

---

## 3b · Das „Institut für KI-Kompetenz im täglichen Gebrauch"

Sobald neben der Software auch **Bildungsarbeit** dazukommen soll, ändert sich die
Antwort aus Abschnitt 3 zum Teil. Deshalb steht die Ergänzung hier, statt oben
still eingearbeitet zu werden.

### Was daran gut ist

Ein Institut mit diesem Zweck ist **kein zweites Projekt neben SBKIM, sondern das
fehlende Dach darüber.** Deine Arbeit besteht ohnehin schon zur Hälfte daraus:
`docs/LEHREN.md`, die Verfassungen, die Grundsätze in Kimhub, die Frage nach
grundsatz- gegenüber regelbasiertem Lernen. Das ist **angewandte KI-Kompetenz**,
aufgeschrieben von jemandem, der kein Informatiker ist und es trotzdem zum Laufen
gebracht hat. Genau diese Perspektive fehlt im Feld — es schreiben fast nur
Fachleute für Fachleute.

Und es löst ein Problem, das die drei schnellen Wege nicht lösen: **sie bezahlen
Software, nicht Bildung.** Ein Bildungs-/Forschungsträger öffnet Töpfe, die einer
Einzelperson verschlossen bleiben.

### „Institut" ist keine Rechtsform — das ist der wichtigste Satz hier

Man „gründet" kein Institut. Man gründet einen **Verein**, eine **gGmbH** oder ein
**Einzelunternehmen** und **nennt** es Institut. Der Name wird geprüft, die
Rechtsform ist die eigentliche Entscheidung.

**Beim Namen gilt:** „Institut" darf nicht **irreführend** sein. Es darf nicht der
Eindruck entstehen, dahinter stünde ein **öffentlicher Träger** oder eine
staatlich anerkannte wissenschaftliche Einrichtung. Die Rechtsprechung ist hier
seit einem Urteil des OLG Düsseldorf vom 15.08.2023 **entspannter** als früher —
„Institut" ist nicht mehr von vornherein unzulässig. Bedingung bleibt: aus dem
Namen muss die **Tätigkeit** und der **private Charakter** erkennbar sein. Ein
bloßes „GmbH" am Ende genügt dafür nicht.

Praktisch heißt das: **vor der Anmeldung einmal bei der IHK und beim Registergericht
nachfragen.** Beides ist kostenlos und dauert eine Woche. Ein Name, der später
beanstandet wird, kostet eine Umfirmierung — und die zieht sich durch jede Domain,
jedes Impressum und jede Fördermittel-Bewilligung.

### Welche Rechtsform — und die eine Frage, an der es hängt

| | **e. V. gemeinnützig** | **gGmbH** | **Einzelunternehmen** |
|---|---|---|---|
| Kapital | **keins** | **25.000 €** | keins |
| Gründung | 7 Personen, Satzung, Registergericht | Notar, Amtsgericht | Gewerbeamt |
| Spendenbescheinigung | ✅ | ✅ | ❌ |
| Stiftungsgeld | ✅ | ✅ | fast nie |
| Anstellungen | ✅ | ✅ | ✅ |
| **Prototype Fund** | ❌ (verlangt Person) | ❌ | ✅ |
| **Forschungszulage** | nur im wirtschaftlichen Geschäftsbetrieb | eingeschränkt | ✅ |
| Wem gehört das Ergebnis | **dem Verein** | der Gesellschaft | **dir** |
| laufender Aufwand | Mitgliederversammlung, Protokolle, jährlicher Nachweis beim Finanzamt | Bilanz, Jahresabschluss | gering |

**Die Frage, an der alles hängt:** Willst du mit dieser Arbeit **Geld verdienen**
(Pilz-Wirtschaft, Marktplatz, Beteiligungen — `docs/PLAN_PILZ_WIRTSCHAFT.md`),
oder soll sie **gemeinnützig** sein?

**Beides zugleich geht nicht in einem Gefäß.** Gemeinnützigkeit heißt: die Mittel
dürfen nur für den Satzungszweck verwendet werden, es gibt keine Gewinnausschüttung,
und was der Verein hervorbringt, gehört dem Verein — **nicht dir**. Bei einem
Projekt, dessen Urheberschaft du gerade erst sauber dokumentiert hast, ist das
eine Entscheidung mit langem Schatten.

### Die Empfehlung: zwei Gefäße, nacheinander

Der übliche und saubere Weg für genau diese Lage:

- **Du bleibst selbstständig** — mit den Apps, dem Marktplatz, dem Code, den
  Rechten. Das ist der Träger für Prototype Fund und Forschungszulage.
- **Der Verein kommt daneben** — für Bildung, Veröffentlichungen, Vorträge,
  Material, Spenden, Stiftungsgeld. Er bekommt von dir eine **Lizenz** zur
  Nutzung, nicht die Rechte.

**Und in dieser Reihenfolge, nicht gleichzeitig.** Ein Verein, den man im Oktober
gründet, kostet genau die Wochen, die der Prototype-Fund-Antrag braucht — und der
Verein darf ihn nicht einmal stellen. **Erst der Antrag, dann der Verein.**

### Was der Verein dann öffnet

Als **gemeinnütziger Träger** mit dem Zweck *Förderung von Wissenschaft und
Forschung* und/oder *Volksbildung* (beides sind anerkannte Zwecke nach § 52 AO):

- **Spenden mit Spendenbescheinigung** — auch von Firmen, für die das ein
  Betriebsausgabe-Thema ist.
- **Stiftungen** — die meisten setzen einen gemeinnützigen Träger voraus. Das ist
  der Grund, warum Abschnitt 5 sie bisher aussortiert hat.
- **Deutsche Stiftung für Engagement und Ehrenamt (DSEE)** — fördert
  ausdrücklich kleine Organisationen, unbürokratisch, oft für **Ausstattung**.
  <https://foerderdatenbank.d-s-e-e.de/>
- **Erwachsenen- und Weiterbildungsförderung der Länder** — „KI-Kompetenz im
  täglichen Gebrauch" ist genau der Wortlaut, unter dem gerade Landesmittel
  ausgeschrieben werden.
- **Kooperationen mit Volkshochschulen und Bibliotheken** — die suchen händeringend
  Leute, die KI erklären können, ohne zu verkaufen oder zu warnen.

**Der ehrliche Preis:** sieben Gründungsmitglieder, eine Satzung, die das Finanzamt
vorab prüfen sollte, eine Mitgliederversammlung im Jahr, Protokolle, und ein
jährlicher Nachweis. Das ist nicht viel, aber es ist nie null — und es fällt jedes
Jahr wieder an.

### Ein Zwischenschritt, den kaum jemand kennt

Wenn dir sieben Mitglieder gerade zu viel sind: eine **Treuhandstiftung** oder ein
**Fördertopf unter dem Dach eines bestehenden gemeinnützigen Vereins**. Du bringst
das Vorhaben ein, der bestehende Verein trägt es rechtlich, du behältst die
Arbeit. Das geht in Wochen statt Monaten und lässt sich später in einen eigenen
Verein überführen. Die richtige Frage dafür geht an einen Verein aus dem Umfeld —
Open Knowledge Foundation Deutschland, ein lokaler Digitalverein, ein
Bildungsträger.

---

## 4 · Der eine Punkt, der jeden Antrag sofort kippen kann: die Lizenz

**Geprüft am 2026-08-23 über alle 33 Klone im Container.** Befund:

| Lizenz | Repos |
|---|---|
| **MIT** (anerkannt Open Source) | **3** — `Sage-Protokol`, `SB-KIMTool-Point`, `mycel-karte` |
| eigene „Nutzungslizenz" (*Alle Rechte vorbehalten, soweit nicht eingeräumt*) | **28** |
| gar keine Lizenz-Datei | **2** — `BookLedgerPro`, `Meine-In-and-Out-Book` |

**Das ist wichtig, und zwar sofort.** Prototype Fund, NLnet und OTF verlangen alle,
dass das **geförderte Ergebnis** unter einer anerkannten freien Lizenz steht. Die
eigene Nutzungslizenz mit Bezahl-Vorbehalt (Ziffer 3) ist **keine** — sie ist
*quelloffen einsehbar*, aber nicht *Open Source* im Sinne der OSI-Definition.

**Was daraus folgt — und was ausdrücklich nicht:**

- Du musst **nicht** alles umlizenzieren. Deine Geschäfts-Apps dürfen bleiben, wie
  sie sind. Die Pilz-Wirtschaft (`docs/PLAN_PILZ_WIRTSCHAFT.md`) hängt daran.
- Du musst nur sicherstellen, dass **das Repo, für das du Geld beantragst**, MIT
  trägt. `Sage-Protokol` tut das bereits. **Damit ist Sage-Protokol das Repo, mit
  dem du dich bewirbst** — nicht der Marktplatz, nicht die Fach-Apps.
- Die zwei Repos ohne Lizenz-Datei sollten trotzdem eine bekommen. Ein Repo ohne
  Lizenz ist rechtlich das *engste* von allen: ohne ausdrückliche Einräumung darf
  niemand etwas.

---

## 5 · Die Wege im Einzelnen

### Weg 1 · Prototype Fund — der beste Treffer

**Was:** Förderung für Open-Source-Software im öffentlichen Interesse, aus Mitteln
des Bundesforschungsministeriums, umgesetzt von der Open Knowledge Foundation
Deutschland.

**Wie viel:** bis **47.500 €** für 6 Monate; danach optional eine zweite Stufe bis
**31.667 €**. Auszahlung quartalsweise. Dazu Coaching und ein Netzwerk.

**Wer darf:** Einzelpersonen oder Teams bis vier Personen. **Wohnsitz in
Deutschland**, **selbstständig oder freiberuflich**, Steuern in Deutschland.
Bei der Antragstellung wird eine **Steuernummer für die selbstständige
Tätigkeit** verlangt — oder ersatzweise die Eingangsbestätigung des Finanzamts.
Teilzeit-Anstellung nebenher ist erlaubt, wenn du anteilig freigestellt bist.

**Warum es passt:** Der Schwerpunkt liegt seit 2025 auf **Datensicherheit und
Software-Infrastruktur**. Server-lose, verschlüsselte Peer-to-peer-Suche ohne
zentralen Index trifft das mittig. Das ist kein Hineindeuten — das ist genau die
Beschreibung des Programms.

**Termin:** Bewerbung für die nächste Runde **01.10.2026 bis 30.11.2026**.
Rückmeldung etwa acht Wochen nach Ende der Frist.

**Adressen:**
- Bewerbung: <https://bewerben.prototypefund.de/>
- Programm: <https://prototypefund.de/>
- Hinweise zur Antragstellung im Wiki:
  <https://wiki.prototypefund.de/index.php?title=Antragstellung>
- Steuerfragen im Wiki:
  <https://wiki.prototypefund.de/index.php?title=Steuern>

> ⚠️ **Das ist der Termin, der zählt.** Fünf Wochen bis zur Öffnung, gut vierzehn
> bis zum Schluss. Alles in Abschnitt 7 ist auf dieses Datum hin geplant.

---

### Weg 2 · Forschungszulage — kein Wettbewerb, und sie schaut zurück

**Was:** eine steuerliche Förderung nach dem Forschungszulagengesetz. **Kein
Auswahlverfahren** — wer die Kriterien erfüllt, hat einen Anspruch. Sie wird auf
die Steuer angerechnet und, wenn keine Steuer anfällt, **ausgezahlt**.

**Für wen:** alle steuerpflichtigen Unternehmen — ausdrücklich auch
**Einzelunternehmer und Soloselbständige**, seit 2020.

**Der springende Punkt für dich — die Eigenleistung.** Ein Soloselbständiger kann
seine **eigene Forschungsarbeit** ansetzen. Der Stundensatz wurde zum 01.01.2026
angehoben (nach den gefundenen Quellen von 70 € auf **100 €** je Stunde, höchstens
40 Wochenstunden). Die Zulage beträgt 35 % für kleine und mittlere Unternehmen.
Ab 2026 gibt es zusätzlich eine Gemeinkosten-Pauschale von 20 % für neu
begonnene Vorhaben.

> **Diese Zahlen bitte nicht selbst weiterrechnen.** Sie stammen aus
> Beratungs-Websites, nicht aus dem Gesetzestext, und die Deckelung ist die
> Stelle, an der solche Quellen am häufigsten danebenliegen. Der Steuerberater
> rechnet das — es ist die eine Frage, für die sich ein Termin lohnt.

**Rückwirkend:** Anträge sind für zurückliegende Zeiträume möglich (nach den
gefundenen Quellen bis zu vier Jahre). Das heißt: **auch bereits geleistete Arbeit
kann anrechenbar sein** — vorausgesetzt, sie ist belegbar.

**Und dafür ist die Ausgangslage hier gut.** Was gebraucht wird, ist eine
**Stundenaufzeichnung je Projekt** — und Kimhub führt bereits ein Fahrtenbuch mit
Zeiten, dazu die Belege. Was fehlt, ist die Zuordnung dieser Stunden zu einem
klar abgegrenzten Forschungsvorhaben. Das ist Fleißarbeit, keine Kunst.

**Ablauf — zwei Schritte, in dieser Reihenfolge:**

1. **BSFZ** (Bescheinigungsstelle Forschungszulage) — Antrag auf Anerkennung des
   Vorhabens. Kostenlos. Geprüft wird nach den international üblichen
   Frascati-Kriterien: Ist es neuartig? Ist der Ausgang ungewiss? Ist es planvoll
   und systematisch? Ist es übertragbar?
   <https://www.bescheinigung-forschungszulage.de/>
2. **Finanzamt** — mit der Bescheinigung dann der eigentliche Antrag auf
   Forschungszulage, zusammen mit der Steuererklärung.

**Die Hürde, ehrlich benannt:** Die Forschung muss einer **steuerpflichtigen
Tätigkeit** zugeordnet sein. Besteht bereits eine Selbstständigkeit in einem
anderen Fach, ist die Frage, ob sich die Softwareforschung ihr zurechnen lässt
oder ob dafür eine eigene Tätigkeit anzumelden ist. Das ist eine
**Steuerberater-Frage — und die erste, die gestellt gehört**, weil an der Antwort
hängt, ob und ab wann Stunden zählen.

---

### Weg 3 · Open Technology Fund — Internet Freedom Fund

**Was:** US-Fonds für Technik, die freie und sichere Kommunikation ermöglicht.
Zweistufig: erst eine kurze **Concept Note**, bei positiver Rückmeldung ein
Vollantrag. **Laufend**, keine feste Frist.

**Wer darf:** **Einzelpersonen** und Organisationen aller Nationalitäten (außer
aus sanktionierten Ländern).

**Wie viel:** 10.000 bis 900.000 USD für bis zu 24 Monate; die typische Spanne
liegt bei 50.000–200.000 USD für 6–12 Monate.

**Warum es passt:** Privatsphäre-Werkzeuge und dezentrale Infrastruktur sind
Kernthemen. Server-los, kein zentraler Index, kein Konto, Schlüssel bleibt lokal
— das ist die Sprache dieses Fonds.

**Was du dafür brauchst:** **Englisch.** Der ganze Antrag läuft auf Englisch.
Dein englisches Paper ist der Anfang.

**Adressen:**
- Fonds: <https://www.opentech.fund/funds/internet-freedom-fund/>
- Concept Note: <https://apply.opentech.fund/internet-freedom-fund-concept-note/>
- Alle Fonds: <https://www.opentech.fund/funds/>

---

### Weg 4 · EXIST-Gründungsstipendium — nur unter einer Bedingung

**Was:** Stipendium für den Lebensunterhalt vor der Gründung. **2.500 €/Monat**
für Hochschulabsolventen, **3.000 €** für Promovierte, 12 Monate, dazu bis
**30.000 € Sachmittel** für eine Einzelperson. **Keine festen Fristen.**

**Die Bedingung, an der es hängt:** Der Antrag läuft **immer über eine Hochschule
oder Forschungseinrichtung** mit EXIST-Gründungsnetzwerk — du kannst ihn nicht
selbst stellen. Und im Team muss **mindestens eine Person einen Hochschulabschluss
der letzten fünf Jahre oder eine Promotion** haben.

**Zwei Punkte, die vorher zu klären sind, bevor hier Zeit hineingeht:**
- Ist die Abschluss-Bedingung erfüllbar — durch den Antragsteller selbst oder
  durch einen Mitstreiter?
- EXIST ist **strikt ein Vorgründungs-Stipendium** — das Unternehmen darf noch
  nicht gegründet sein. Ob eine bereits bestehende Selbstständigkeit in einem
  anderen Fach dem im Weg steht, klärt der Gründungsservice der Hochschule in
  einem Vorgespräch. Das Gespräch ist kostenlos.

**Adresse:** <https://exist.de/programm/exist-gruendungsstipendium/foerderantrag-stellen/>

---

### Weg 5 · Was gerade *nicht* geht — und wann es wieder geht

Der Vollständigkeit halber, damit niemand dort Zeit verliert:

| Programm | Stand 2026-08-23 | Wann wieder |
|---|---|---|
| **NLnet / NGI Zero Commons Fund** | letzter Call **01.06.2026** geschlossen | NLnet führt andere Programme; das EU-Nachfolgeprogramm läuft ab 2028. Auf <https://nlnet.nl/funding.html> nachsehen |
| **NGI Fediversity / NGI Taler** (Unterprogramme) | Frist war **01.08.2026** | offene Calls unter <https://ngi.eu/opencalls/> |
| **Sovereign Tech Fellowship** | Bewerbung war **06.04.2026** | für 2027 vormerken: <https://www.sovereign.tech/programs/fellowship> |
| **Sovereign Tech Fund** | fördert **breit genutzte, kritische** Infrastruktur | wenn SBKIM außerhalb deines eigenen Netzes eingesetzt wird |
| **Horizon Europe** direkt | Konsortien aus mehreren Ländern, Anträge über Monate | nur mit Hochschul-Partner, der so etwas schon gemacht hat |
| **Stiftungen** (Böckler, Gerda Henkel u. a.) | verlangen meist eine wissenschaftliche Einrichtung im Rücken | mit Hochschul-Partner, oder später mit Verein |

---

## 5b · Hamburg — was es hier zusätzlich gibt

**Ergänzt am 2026-08-23**, nachdem das Bundesland feststand. Diese drei stehen in
keiner Bundesübersicht.

### InnoFounder (IFB Hamburg) — der stärkste Landes-Treffer

**Was:** **2.500 € je Monat** bei Vollzeit, bis zu **18 Monate**, für
Einzelgründungen bis **45.000 €** (im Team bis 75.000 €, höchstens drei
Personen). Dazu Begleitung.

**Warum das wichtig ist:** InnoFounder verlangt — anders als EXIST — **keinen
Hochschulabschluss als harte Bedingung** und läuft **nicht über eine Hochschule**.
Damit ist es für die hiesige Lage der zugänglichere der beiden.

**Bedingungen:** Wohn- oder Unternehmenssitz überwiegend in **Hamburg**. Die
Geschäftstätigkeit darf **noch nicht aufgenommen** sein oder **weniger als ein
Jahr** bestehen. Alle Branchen, ausdrücklich auch digitale Vorhaben.

> ⚠ **Die eine Frage, die vorher zu klären ist** — dieselbe wie bei EXIST: Steht
> eine **bereits bestehende Selbstständigkeit in einem anderen Fach** dem im Weg,
> oder zählt das neue Vorhaben für sich? Das entscheidet nicht diese Datei,
> sondern ein Vorgespräch. Es ist kostenlos.

**Adresse:** <https://www.ifbhh.de/foerderprogramm/innofounder> ·
<https://innovationsstarter.com/innofounder/>

### Projektfonds Medien und Bildung — für den Kompetenz-Strang

**400.000 €** im Jahr, verteilt von der Behörde für Schule, Familie und
Berufsbildung über das Zentrum für Schul- und Jugendinformation. Einzelförderung
in der Regel **1.000 bis 50.000 €**, bei drei Jahren Laufzeit bis 150.000 €.

Im Mittelpunkt stehen Projekte, die **Kreativität, Kollaboration, Kritikfähigkeit
und Kommunikation** stärken. „KI-Kompetenz im täglichen Gebrauch" liegt genau
dort.

**Frist:** die Bewerbungsphase für 2026/27 lief vom **01.01. bis 08.03.2026** —
für dieses Jahr vorbei. **Für die nächste Runde vormerken**, das ist der Topf mit
der geringsten Konkurrenz auf dieser ganzen Liste.

**Adressen:** <https://zsj.hamburg.de/> · <https://mediennetz-hamburg.de/medienkompetenzfonds>

### Kostenlose Beratung vor Ort

- **Handelskammer Hamburg** — Gründungsberatung, kostenlos
  <https://www.handelskammer-hamburg.de/>
- **hei. Hamburger ExistenzgründungsInitiative** — kostenlose Erstberatung
- **Hamburg Kreativ Gesellschaft** — für alles, was zwischen Technik und
  Gestaltung liegt <https://kreativgesellschaft.org/>

**Diese drei Türen kosten nichts und kennen die Landestöpfe.** Ein Gespräch dort
ersetzt Stunden Suchen.

---

## 5c · Anmelden: Gewerbe oder freiberuflich — und wie es in Hamburg läuft

**Der gemeinsame Schritt für beide Wege** ist der **Fragebogen zur steuerlichen
Erfassung**, elektronisch über **ELSTER** ans Finanzamt. Daraus kommt die
Steuernummer. Ein ELSTER-Zertifikat wird gebraucht; es ist kostenlos und dauert
ein paar Tage, weil ein Brief kommt.

| | **Freiberuflich** | **Gewerbe** |
|---|---|---|
| Gewerbeanmeldung | **entfällt** | nötig |
| Kosten | keine | **20 €** (in Hamburg, je Bezirk 15–25 €) |
| Online möglich | ja, über ELSTER | **ja**, vollständig über das Serviceportal Hamburg |
| Dauer | — | 3–7 Werktage |
| Gewerbesteuer | **nein** | ja, mit Freibetrag |
| IHK-Beitrag | **nein** | ja |
| danach | Fragebogen über ELSTER | Gewerbeamt meldet ans Finanzamt; Fragebogen trotzdem **innerhalb eines Monats** über ELSTER |

**Adressen:** Gewerbeanzeige online —
<https://serviceportal.hamburg.de/HamburgGateway/Service/Entry/GWR> ·
ELSTER — <https://www.elster.de>

**Kann man erst einmal einen Antrag stellen?** Ja. **Der Fragebogen ist der
Antrag** — man trägt die Tätigkeit ein, und **das Finanzamt entscheidet**, ob es
sie als freiberuflich oder gewerblich einordnet. Man muss sich also nicht vorher
festlegen; man muss die Tätigkeit nur richtig beschreiben. **Genau dabei hilft der
Steuerberater**, und genau deshalb ist der Termin vor dem Ausfüllen richtig
gesetzt und nicht danach.

---

## 6 · Der Hochschul-Partner — der größte Hebel, den du hast

### 6.1 Warum, und wen man anspricht

Drei der fünf Wege oben gehen **nur** mit einer Hochschule (EXIST, Stiftungen,
Horizon). Und der Lern-Strang aus Abschnitt 2.2 braucht ohnehin jemanden mit
Methode.

**Was viele nicht wissen: das ist keine hohe Hürde.** Professuren suchen aktiv
nach Anwendungsfällen aus der Praxis, und du bringst etwas mit, das an
Hochschulen selten ist — ein **laufendes System mit echten Nutzern und Messdaten
über Monate**. Das ist für eine Abschlussarbeit oder eine Doktorarbeit ein
Geschenk.

**Wen ansprechen — Lehrstühle und Institute mit passendem Thema:**

| Thema | Wo man sucht |
|---|---|
| Verteilte Systeme, Peer-to-peer | Informatik-Fachbereiche, Lehrstühle „Verteilte Systeme" / „Distributed Systems" |
| Privatsphäre-Technik, angewandte Kryptographie | **CISPA** (Saarbrücken), **ATHENE / Fraunhofer SIT** (Darmstadt), **KASTEL** (Karlsruhe) |
| Dezentrale Netze, Digitale Souveränität | **Weizenbaum-Institut** (Berlin), **HIIG** (Berlin), **Fraunhofer FOKUS** |
| Mensch-KI-Interaktion, Steuerung von Agenten | Lehrstühle „Human-Computer Interaction", „Kognitive Systeme" |
| Nächste Hochschule bei dir | jede Hochschule hat einen **Gründungsservice** oder eine **Transferstelle** — das ist die richtige erste Tür, nicht ein Professor direkt |

**Der Weg, der erfahrungsgemäß trägt:** eine kurze, konkrete E-Mail an die
Transferstelle oder den Gründungsservice der nächstgelegenen Hochschule. Nicht an
zwanzig Adressen gleichzeitig. Ein Absatz, was es ist, ein Link auf die laufende
Seite, eine klare Bitte um ein Gespräch. Der Entwurf steht in Abschnitt 8.

---

### 6.2 Kooperationen mit Wissenschaftlern — der konkrete Weg

Wissenschaftliche Kooperationen zu suchen ist die richtige Absicht — aber der Weg
dorthin ist ein anderer, als die meisten vermuten. Nicht „ich schreibe zwanzig Professoren
an". Sondern: **erst zitierfähig werden, dann sichtbar werden, dann ansprechen.**

**Schritt 1 · Zitierfähig werden.** ORCID (A1) und ein DOI auf Zenodo (B1). Ohne
das bist du für einen Wissenschaftler eine E-Mail; mit dem bist du eine Fundstelle,
auf die er verweisen kann, ohne sich zu erklären. Das ist der ganze Unterschied,
und er kostet zwei Stunden.

**Schritt 2 · Der niedrigste echte Einstieg in die Wissenschaft — ein Workshop-Beitrag.**
Das ist der Punkt, den fast niemand kennt: Die **Gesellschaft für Informatik (GI)**
richtet jährlich die Konferenz **„Mensch und Computer"** aus, und deren Workshops
**laden Nicht-Mitglieder und Nicht-Akademiker ausdrücklich zum Einreichen ein**.
Ein **Positionspapier** von wenigen Seiten wird im Tagungsband **mit ISBN**
veröffentlicht. Bedingung: eine Autorin oder ein Autor nimmt teil und meldet sich
für mindestens einen Konferenztag an.

Das ist der beste Einstieg, den es für deine Lage gibt:

- Es ist **kein begutachteter Fachartikel** — die Hürde ist niedrig.
- Es ist trotzdem eine **echte Veröffentlichung** mit ISBN, zitierbar, in einem
  Antrag nennbar.
- Und es setzt dich für einen Tag **in denselben Raum** wie die Leute, mit denen
  du kooperieren willst. Ein Gespräch am Kaffeetisch schlägt fünfzig E-Mails.

Passende Fachgruppen: **Mensch-Computer-Interaktion**, **Partizipation** (partizipative
und sozialverantwortliche Technikentwicklung — das ist fast dein Thema),
**Usable Security and Privacy**. → <https://fb-mci.gi.de/fachbereich/fachgruppen>
und <https://gi.de/>

**Schritt 3 · Gezielt suchen statt streuen.** Wer zu deinen Themen arbeitet, findest
du nicht über Google, sondern über die Literatur:

- **OpenAlex** — <https://openalex.org> — frei, keine Anmeldung. Nach
  „decentralized semantic search", „peer-to-peer discovery", „AI companion
  dependency" suchen und schauen, **wer in Deutschland** dazu veröffentlicht.
- **Google Scholar** — dieselbe Suche, nach Jahr sortieren. Wer 2025/2026
  veröffentlicht hat, arbeitet noch daran.
- **ResearchGate / ORCID** — die Person direkt.

**Was du dann schreibst — und was nicht.** Kurz, konkret, mit einer klaren Bitte.
Kein Anhang, kein Pitch, keine Vision.

> *Betreff: Laufendes dezentrales Suchsystem — Frage nach einer Kooperation*
>
> Sehr geehrte …,
>
> ich habe Ihre Arbeit zu … gelesen. Ich baue seit März 2026 ein server-loses
> System, in dem unabhängige Web-Apps einander nach Bedeutung finden — ohne
> zentralen Index, mit lokalen Vektoren im Browser. Es läuft öffentlich unter
> …, der Code ist offen (MIT), die Meilensteine sind mit Datum dokumentiert.
>
> Ich bin kein Wissenschaftler, sondern Handwerker. Was mir fehlt, ist die
> Methode — die Frage, wogegen man so etwas eigentlich misst.
>
> Hätten Sie zwanzig Minuten für ein Gespräch? Ich würde Ihnen gern zeigen, was
> läuft, und hören, ob das für Sie oder eine Ihrer Abschlussarbeiten interessant
> ist.
>
> Mit freundlichen Grüßen …

**Warum dieser Brief funktioniert:** er behauptet nichts, er zeigt etwas. Er
verlangt kein Geld. Er bietet an, was an Hochschulen wirklich knapp ist —
ein laufendes System mit echten Daten für eine Abschlussarbeit. Und der Satz
*„ich bin kein Wissenschaftler, was mir fehlt, ist die Methode"* nimmt die
Rangfrage vorweg, statt sie im Raum stehen zu lassen.

**Was ein Wissenschaftler dir bringt, das kein Geld ersetzt:**
- Er kann **mit dir gemeinsam** Anträge stellen, die dir allein verschlossen sind
  (EXIST, DFG, Horizon, Stiftungen).
- Er bringt das **Ethikvotum** und die Methodik für den Sucht-Strang mit.
- Eine gemeinsame Veröffentlichung macht aus deinem Feldtagebuch **Literatur**.
- Und er wird **eine Menge von deiner Arbeit lernen** — das ist keine Höflichkeit.
  Ein über Monate belegtes, laufendes System mit Nutzern ist an Hochschulen die
  Ausnahme, nicht die Regel.


## 7 · Der Fahrplan — abhakbar

### Stufe A · Diese Woche (kostet nichts, macht alles Weitere möglich)

- [ ] **A1 · ORCID anlegen.** Eine dauerhafte Forscher-Kennung, kostenlos, ohne
      Institution, in fünf Minuten. Ab da bist du in der Wissenschaftswelt
      identifizierbar. → <https://orcid.org/register>
- [ ] **A2 · Steuerberater-Termin ausmachen.** Eine Frage: *„Lässt sich für die
      Softwareforschung die Forschungszulage in Anspruch nehmen — und wenn ja, ab
      wann und unter welcher Tätigkeit?"* Das ist der teuerste Punkt auf der
      ganzen Liste, wenn man ihn zu spät stellt.
- [ ] **A2b · ELSTER-Zertifikat beantragen** — <https://www.elster.de>. Es wird
      für den Fragebogen zur steuerlichen Erfassung gebraucht, ist kostenlos, und
      es dauert ein paar Tage, weil ein Brief kommt. **Das ist der Schritt, der
      am ehesten Zeit frisst, wenn man ihn zu spät anstößt** — er lässt sich
      parallel zum Steuerberater-Termin erledigen.
- [ ] **A3 · Fristen selbst nachsehen.** Prototype-Fund-Seite aufrufen und
      prüfen, ob 01.10.–30.11.2026 noch gilt. **Nicht** dieser Datei glauben —
      sie ist vom 23.08.2026.
- [ ] **A4 · Entscheiden, mit welchem Repo du dich bewirbst.** Empfehlung:
      **Sage-Protokol** (trägt MIT, enthält die Papers, die Meilensteine und die
      Spezifikation).
- [ ] **A5 · Die Institutsfrage bewusst vertagen, nicht aus Versehen.** Das
      Institut ist eine gute Idee (Abschnitt 3b), aber es darf den Antrag nicht
      aufhalten. Entscheidung mit Datum notieren und im **Dezember** wieder
      aufnehmen, wenn der Antrag draußen ist.

### Stufe B · September (die Vorleistungs-Mappe)

- [ ] **B1 · Papers auf Zenodo veröffentlichen** → **DOI**. Kostenlos, keine
      Institution nötig, kein Gutachten, keine Empfehlung. Du bekommst eine
      zitierfähige Nummer und einen **beweisbaren Zeitstempel** auf deine Arbeit.
      → <https://zenodo.org/>
      *Das ist der Punkt mit dem besten Verhältnis von Aufwand zu Wirkung auf der
      ganzen Liste.* Und er ist **ohne Risiko**: eine Zenodo-Fassung bleibt
      unverändert stehen, spätere Fassungen bekommen einen eigenen DOI und werden
      mit der alten verknüpft. Man legt sich also nichts fest, was man später
      bereut. Für die drei geplanten Papers:
      [`papers/PLAN_PAPERS.md`](papers/PLAN_PAPERS.md).
- [ ] **B2 · Ein Blatt „Stand der Technik und Abgrenzung".** Eine Seite: was es
      schon gibt (IPFS, ActivityPub, Matrix, Solid, libp2p, Nostr, zentrale
      Vektor-Suchen), und in welchem Punkt SBKIM etwas anderes tut. **Jede
      Fördergeberin liest dieses Blatt zuerst.** Ohne es wirkt der Antrag naiv,
      mit ihm belesen.
- [ ] **B3 · Die Vorleistung in Zahlen fassen.** Zeitraum, Repos, Zeilen,
      Prüfungen, Meilensteine mit Datum, laufende Instanzen, bisheriger
      Sachaufwand. Die Grundlagen dafür führt Kimhubs Buchhaltung bereits.
- [ ] **B4 · Lizenz-Lücken schließen.** `BookLedgerPro` und
      `Meine-In-and-Out-Book` bekommen eine Lizenz-Datei.
- [ ] **B5 · Eine englische Projektseite.** Eine Seite, kein Prospekt. Was es
      ist, warum es wichtig ist, was schon läuft, wer dahintersteht. Grundlage
      für den OTF-Antrag.
- [ ] **B6 · Erste Hochschul-Mail** (Briefentwurf in Abschnitt 6.2). **Eine**
      Hochschule, nicht zwanzig.
- [ ] **B7 · Nach dem nächsten „Mensch und Computer"-Call sehen.** Ein
      Positionspapier im Workshop-Tagungsband ist die niedrigste echte Schwelle
      in die Wissenschaft, die es für deine Lage gibt — mit ISBN, ohne
      Hochschulzugehörigkeit. → <https://gi.de/> und
      <https://fb-mci.gi.de/fachbereich/fachgruppen>
- [ ] **B8 · Hamburg: die drei kostenlosen Türen abklappern** — Handelskammer,
      hei., Kreativ Gesellschaft. Eine Frage überall dieselbe: *„Welche
      Landesprogramme kommen für ein Software-Forschungsvorhaben in Frage, und
      steht eine bestehende Selbstständigkeit in einem anderen Fach dem im Weg?"*
- [ ] **B9 · InnoFounder-Vorgespräch** (Abschnitt 5b). Der zugänglichste Weg mit
      Geld für den Lebensunterhalt — 2.500 €/Monat, kein Hochschulabschluss
      verlangt, keine Hochschule dazwischen. Zu klären ist nur die Frage der
      bestehenden Selbstständigkeit.
- [ ] **B10 · Projektfonds Medien und Bildung vormerken** — Frist für 2026/27 war
      der 08.03.2026, die nächste Runde kommt im Januar. Der Topf mit der
      geringsten Konkurrenz.

### Stufe C · Oktober/November (der Antrag)

- [ ] **C1 · Prototype-Fund-Antrag schreiben.** Das Formular ist kurz — genau
      deshalb ist jeder Satz wichtig. Textentwurf: siehe Abschnitt 8.
- [ ] **C2 · Vorhaben scharf abgrenzen.** Sechs Monate, ein Ziel, nachprüfbar.
      **Nicht** „das Mycel weiterbauen". Sondern zum Beispiel: *„server-lose
      Bedeutungssuche zwischen unabhängigen Web-Apps als nachnutzbarer Baukasten,
      mit Sicherheitsprüfung und Dokumentation."*
- [ ] **C3 · Abschicken — spätestens Mitte November**, nicht am letzten Tag.
- [ ] **C4 · Parallel die OTF-Concept-Note.** Der OTF hat keine Frist; sie kostet
      dich nichts außer der Übersetzung dessen, was für C1 ohnehin entsteht.

### Stufe D · Parallel, unabhängig von jeder Frist

- [ ] **D1 · Forschungszulage: BSFZ-Antrag.** Sobald der Steuerberater grünes
      Licht gibt. Dieser Weg **hängt an keiner Ausschreibung**.
- [ ] **D2 · Stundenaufzeichnung ab sofort sauber führen.** Datum, Vorhaben,
      Stunden, Tätigkeit. Wenn A2 positiv ausgeht, ist jede nicht aufgezeichnete
      Stunde verlorenes Geld.
- [ ] **D3 · EXIST prüfen** — nur wenn die Abschluss-Bedingung erfüllbar ist.
      Erster Schritt ist ein kostenloses Gespräch beim Gründungsservice.
- [ ] **D4 · Eine Krankenkasse auf § 20k SGB V ansprechen.** Nicht die Hotline —
      das Präventions-Referat. Frage: *„Fördern Sie Projekte zur
      selbstbestimmten Nutzung von KI-Anwendungen?"* Kostet einen Anruf.

### Stufe E · Dezember und danach — nur wenn Stufe C steht

- [ ] **E1 · Über das Institut entscheiden** (Abschnitt 3b). Gemeinnützig oder
      nicht — das ist die Weichenstellung, nicht die Rechtsform.
- [ ] **E2 · Namen vorab prüfen lassen** bei IHK und Registergericht, bevor
      irgendwo „Institut" auf einer Seite steht. **Und kein „Psychologie" im Namen** —
      siehe den Kasten in Abschnitt 2.3.
- [ ] **E3 · Sieben Mitglieder finden** — oder den Zwischenschritt über einen
      bestehenden gemeinnützigen Träger gehen (Ende Abschnitt 3b).

---

## 8 · Wer was tut

### Was **du** tun musst (das kann niemand für dich)

1. **Die Steuerfrage stellen** (A2). Sie ist die Weiche für den zweiten Weg.
2. **Die fünf Angaben aus Abschnitt 9 klären** — an zweien davon hängt, welche
   Wege überhaupt offenstehen. Sie gehören ins Gespräch, nicht ins Depot.
3. **Absenden.** Anträge schreiben kann eine Sitzung; unterschreiben und
   abschicken kann nur der Antragsteller.
4. **Eine Hochschule ansprechen.** Eine E-Mail von der Person, die das gebaut
   hat, wiegt mehr als jeder Text, den eine Sitzung formuliert.

### Was **andere** tun können

- **Ein Steuerberater** — die Forschungszulage rechnen und den Weg über die
  Tätigkeit klären. Das ist bezahlte Arbeit, aber gemessen an einer möglichen
  rückwirkenden Erstattung die günstigste Rechnung auf dieser Liste.
- **Eine Hochschul-Transferstelle** — kostenlos, dafür da, und kennt die
  regionalen Töpfe, die in keiner bundesweiten Übersicht stehen.
- **Ein Mitstreiter mit Hochschulabschluss** — öffnet EXIST, das sonst zu bleibt.
- **Die Gründungsberatung der IHK** — meist kostenlos, kennt die Landesprogramme.
- **Ein Mensch, der schon einmal einen Prototype-Fund-Antrag geschrieben hat.**
  Die Alumni sind auf der Programm-Seite gelistet und in aller Regel
  ansprechbar. Eine halbe Stunde von jemandem, der die Auswahl kennt, ist mehr
  wert als drei Tage Formulieren.

### Was **die Sitzung** tun kann — und was nicht

**Kann:**
- Den Prototype-Fund-Antrag im Entwurf schreiben — Vorhabensbeschreibung,
  Abgrenzung, Arbeitsplan, Meilensteine, Kostenaufstellung. Auf Deutsch.
- Die OTF-Concept-Note auf Englisch.
- Das Blatt „Stand der Technik und Abgrenzung" (B2) aus dem belegen, was in den
  Repos steht.
- Die Vorleistung in Zahlen fassen (B3) — messen statt schätzen.
- Die Zenodo-Einreichung vorbereiten: Metadaten, Zusammenfassung, Schlagwörter,
  Lizenzangabe.
- Die englische Projektseite bauen (B5).
- Die Papers für eine wissenschaftliche Leserschaft überarbeiten.
- Die Lizenz-Lücken schließen (B4).
- Die Hochschul-Mail entwerfen.
- Bei jedem Punkt **sagen, was nicht geprüft ist** — das ist die Hälfte des Werts.

**Kann nicht:**
- Anträge einreichen, Formulare absenden, Konten anlegen.
- Steuerlich oder rechtlich beraten. Was hier steht, ist Recherche, keine Beratung.
- Fristen garantieren. Jede Frist in dieser Datei ist eine **Fundstelle vom
  2026-08-23**, kein Versprechen.
- Beurteilen, ob ein Antrag durchgeht.

---

## 9 · Die fünf Angaben, ohne die der Fahrplan auf Vermutungen läuft

Diese fünf Punkte entscheiden, **welche Wege überhaupt offenstehen**. Sie sind
persönlich und stehen deshalb **absichtlich nicht in dieser Datei** — sie werden
im Gespräch geklärt, nicht im Depot abgelegt. Hier steht nur, **warum** jeder
davon zählt, damit eine Folge-Sitzung weiß, wonach sie fragen muss.

| Angabe | Wofür sie gebraucht wird |
|---|---|
| **Steuerlicher Status** — selbstständig oder freiberuflich geführt, mit Steuernummer für diese Tätigkeit? | Voraussetzung für Weg 1 **und** Weg 2. Ohne sie sind beide zu. |
| **Hochschulabschluss** — vorhanden, im Team vorhanden, und wie lange her? | Entscheidet **allein** über EXIST (Weg 4). |
| **Bundesland** | Jedes Land hat eigene Digitalisierungs-, Innovations- und Medienkompetenz-Programme, die in keiner Bundesübersicht stehen. Ohne diese Angabe sind sie nicht auffindbar. |
| **Arbeitsumfang** — Stunden je Woche, seit wann | Die Grundzahl für die Forschungszulage und für jeden Arbeitsplan im Antrag. |
| **Institut gemeinnützig oder erwerbswirtschaftlich?** | Die eigentliche Weiche hinter der Rechtsform — sie entscheidet mit darüber, wem die Ergebnisse am Ende gehören (Abschnitt 3b). |

**Warum das hier so ausdrücklich steht:** Vermutungen sehen in einem Antrag genauso
aus wie Wissen, bis sie auffliegen. Wer eine dieser fünf Angaben rät, statt sie zu
erfragen, baut den Antrag auf Sand — und merkt es erst beim Bescheid.

---

## 10 · Alle Adressen auf einen Blick

**Anträge**
- Prototype Fund · Bewerbung — <https://bewerben.prototypefund.de/>
- Prototype Fund · Programm — <https://prototypefund.de/>
- Prototype Fund · Wiki zur Antragstellung — <https://wiki.prototypefund.de/>
- BSFZ · Bescheinigungsstelle Forschungszulage — <https://www.bescheinigung-forschungszulage.de/>
- Open Technology Fund · Internet Freedom Fund — <https://www.opentech.fund/funds/internet-freedom-fund/>
- OTF · Concept Note — <https://apply.opentech.fund/internet-freedom-fund-concept-note/>
- EXIST · Förderantrag — <https://exist.de/programm/exist-gruendungsstipendium/foerderantrag-stellen/>

**Beobachten (derzeit geschlossen)**
- NLnet · Förderprogramme — <https://nlnet.nl/funding.html>
- NGI · offene Calls — <https://ngi.eu/opencalls/>
- Sovereign Tech Agency · Programme — <https://www.sovereign.tech/programs>

**Suchen und Nachschlagen**
- Förderdatenbank des Bundes — <https://www.foerderdatenbank.de/>
- Förderdatenbank der DSEE — <https://foerderdatenbank.d-s-e-e.de/>

**Psyche, Sucht, Medienkompetenz**
- § 20k SGB V · digitale Gesundheitskompetenz — <https://www.gesetze-im-internet.de/sgb_5/__20k.html>
- Landesanstalt für Medien NRW (Muster; deine findest du über dein Bundesland) — <https://medienanstalt-nrw.de/>
- Förderdatenbank · Stichwort „Medienkompetenz" + Bundesland — <https://www.foerderdatenbank.de/>

**In die Wissenschaft hinein**
- Gesellschaft für Informatik — <https://gi.de/>
- GI · Fachbereich Mensch-Computer-Interaktion, Fachgruppen — <https://fb-mci.gi.de/fachbereich/fachgruppen>
- OpenAlex · wer forscht wozu, frei durchsuchbar — <https://openalex.org>

**Sichtbar und zitierfähig werden**
- ORCID · Forscher-Kennung — <https://orcid.org/register>
- Zenodo · DOI für die Papers — <https://zenodo.org/>

---

## 11 · Was in diesem Repo dazugehört

- **[`docs/FORSCHUNGSKORPUS.md`](FORSCHUNGSKORPUS.md) — die benannte Kette, auf
  die der Antrag zeigt.** Sechs Repos unter MIT, dazu die Werkstatt-Unterlagen.
  Seit dem 2026-08-23 sind Kim-Bell, Kimseek und Kimboard darin geöffnet.
- **[`docs/werkstatt/`](werkstatt/)** — Regeln, Grundsätze und der ehrliche
  Befund zum Lern-Strang, samt dem, was daran **nicht** bewiesen ist
- `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` — der Beleg, auf den sich jeder Antrag
  stützt
- `docs/meilenstein/` — die datierten Einzelbelege samt Bildern
- `docs/papers/` — die beiden Papers (DE/EN), Rohstoff für Zenodo
- **[`docs/papers/PLAN_PAPERS.md`](papers/PLAN_PAPERS.md)** — das Gerüst der drei
  kommenden Papers, samt der Stellen, an denen jedes kippen kann
- `docs/GUTACHTEN/` — das Gutachten
- `docs/WARUM_SBKIM_STATT_KI.md` — die ehrliche Abgrenzung; halbfertige Vorlage
  für das Blatt „Stand der Technik"
- `docs/URHEBERSCHAFT_UND_RECHTE.md` — die Rechtelage, die jeder Fördergeber
  wissen will
- `docs/PLAN_PILZ_WIRTSCHAFT.md` — wovon das Netz leben soll; die Antwort auf
  „und danach?", die in jedem Antrag gefragt wird
- `LICENSE` — MIT. Der Grund, warum dieses Repo das Antrags-Repo ist.
