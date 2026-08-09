# Pilz-Wirtschaft — wovon das Netz leben soll

**Phase D.2 der Pipeline · Stand 2026-08-09 · lebendes Dokument**
**Fassung 2** — die erste Fassung stand auf einer falschen Grundannahme; siehe § 1.

> **Was dieses Papier ist:** eine Bestandsaufnahme mit Zahlen und ein Vorschlag,
> in welcher Reihenfolge Geld entstehen kann. **Was es nicht ist:** ein
> Geschäftsplan mit belastbarer Umsatzprognose, und keine Rechts- oder
> Steuerberatung. Wo geschätzt wird, steht „geschätzt". Wo gemessen wurde, steht
> die Zahl mit Datum.

---

## 0. Warum dieses Papier jetzt kommt

In `CLAUDE.md` § Pipeline stand Phase **D.2 (Pilz-Wirtschafts-Spec)** seit Mai
mit einem ausdrücklichen Vorbehalt: *„bleibt bewusst offen, bis reale
Pilz-Bauten existieren, an denen sich das Modell bewähren kann."* Die Bedingung
ist eingetreten — vierzehn laufende Apps, ein Marktplatz, nächtliche Messung,
Wächter, Siegel, bewiesene server-lose Cross-Knoten-Suche.

Auslöser ist Klaus' Frage vom 2026-08-09: *„Wie können WIR daraus eine möglichst
mit wenig Aufwand / mehr Automatisierung gewinnbringendes Geschäftsmodell
umsetzen? Gegebenenfalls die Regeln anpassen. Evolution im Pilz-Mycel, um davon
leben zu können."*

---

## 1. Die Korrektur — worauf Fassung 1 stand und warum sie falsch war

Fassung 1 rechnete gegen einen **Kaltstart**: null fremde Marktplatz-Einträge
trotz kostenloser Plätze, also fehle die Bekanntheit, also sei der Marktplatz
auf Jahre kein Einnahmeweg.

**Diese Annahme war falsch.** Klaus' Auskunft am selben Abend:

> „Ich arbeite jetzt schon mit Kundenkontakt, und ich habe durch meine
> Gemeinschaft sehr viel Kontakt zu Menschen, die sehr aktiv für sich und ihre
> Lieben sorgen — auch als Geschäftsleute. Diese werden meine Hauptpartner. Zum
> Beispiel Alis Moderaum, Beauty. Es ist nicht nur ein Übungsfeld. Ich arbeite
> bei neuen Firmen auf Anteile hin. Das Ziel ist sowohl eine Plattform, die alle
> verbindet, als auch persönliche Betreuung und Anteile am Umsatz bei
> Vertrauenspersonen. Alles nach Recht und Gesetz."

Damit sind zwei Dinge anders:

1. **Die Verteilung existiert bereits** — nicht als Reichweite, sondern als
   Vertrauen in einer Gemeinschaft. Das ist der Baustein, den die
   Mai-Kostenanalyse mit „275.000 Abonnenten" oder „10.000–20.000 € Marketing"
   ersetzen wollte.
2. **Die vierzehn Marktplatz-Einträge sind kein Eigenlob, sondern das Netz.**
   Alis Moderaum, Perfect Skin Beauty, Tomys Hub sind Partnerbetriebe, keine
   Beispiel-Apps. Fassung 1 hat sie als „alle eigene" gezählt. Das war der Fehler.

**Was aus Fassung 1 bleibt:** der Kassensturz (§ 2), die Regeln (§ 11), die
Nicht-bauen-Liste (§ 12). Was ersetzt wird: die Diagnose und die Reihenfolge.

---

## 2. Kassensturz — was das Konzept kostete, was schon dasteht

Die `Kosten_Nutzen_Analyse_PWA_Plattform.pdf` (Mai 2026, im Repo
`semantic-match-demo`) beziffert die Plattform auf **65.000–116.500 €** in
26–36 Wochen. Posten für Posten gegen den Ist-Stand:

| Baustein laut Konzept | Preisschild im Papier | Ist-Stand 2026-08-09 |
|---|---|---|
| Semantic Matching Engine | 20.000–37.500 € | **gebaut** — Modul 03 + 04 |
| Vektordatenbank (Pinecone/Weaviate) | 50–200 €/Monat laufend | **entfällt** — `listings-vec.json`, int8, im Repo |
| Plattform-Grundgerüst | 18.000–34.000 € | **gebaut** — `markt.html`, Studio, `einreichung.php` |
| Bidirektionale Pipeline | 8.000–15.000 € | **zur Hälfte** — `matchDimensions` steht, Bedarfs-Seite ohne Treibstoff (§ 10) |
| Matching- & Ranking-Engine | 4.000–7.000 € | **gebaut**, inkl. Unterscheidung Rangfolge/Urteil |
| KI-Sicherheitsscan | 2.000–4.000 € | **gebaut** — der Wächter |
| Zertifizierungssystem | 2.000–3.500 € | **gebaut** — SBKIM-Siegel |
| Treuhand (PayPal-Escrow) | 2.000–4.000 € | **nicht gebaut** |
| Gerätegebundener Kopierschutz | 4.000–7.000 € | **nicht gebaut — und soll es nicht** (§ 11) |

Die teure technische Hälfte steht, in Heimarbeit, ohne Fremdkapital. Nicht
gebaut ist, was Geld bewegt: ein Zahlungsweg und klare Bedingungen.

---

## 3. Das tatsächliche Modell — drei Säulen

### ① Beteiligung an Partnerbetrieben

Software als Einlage in Geschäfte, an denen Klaus beteiligt ist. Der Ertrag
hängt daran, dass es dem Betrieb **besser geht** — nicht daran, dass viel
geklickt wird. Das passt zum Ehrlichkeits-Apparat: bei einer Beteiligung ist
saubere Arbeit Eigeninteresse, nicht Ideal.

Größenordnung (geschätzt): wenige Prozent am Umsatz eines Betriebs mit
100.000–200.000 € Jahresumsatz sind vier- bis fünfstellig pro Jahr, pro Partner,
wiederkehrend. **Zwei bis drei solche Partner sind die Existenzgrundlage.** Zum
Vergleich: 10 % Provision auf 59 € sind 5,90 €.

### ② Persönliche Betreuung — Einarbeitung und besondere Wartung

Klar getrennt in zwei Dinge, die sich unterschiedlich verhalten:

- **Einarbeitung** — endlich, projektartig, findet einmal statt.
- **Wartung** — laufend: neue Funktionen, Umbauten, Reparaturen, jährliche
  Durchsicht. Das ist der wiederkehrende Teil.

Nicht enthalten und ausdrücklich **nicht** Klaus' Arbeit: Texte, Preise, Bilder,
Produkte, Sicherungen. Das macht der Partner selbst (§ 5).

### ③ Markt mit Provision und Vermittlung — als **eigene Instanz**, parallel

**Korrektur gegenüber Fassung 1**, auf Klaus' Einspruch: *„Der Marktplatz auf
Provision ist definitiv eine weitere Option."* Er hat recht, und der Grund ist
derselbe wie in § 1 — die Rechnung gegen einen Kaltstart stimmt nicht. Jeder
Partner bringt eigene Kunden und Bekannte mit; der Laden startet nicht leer.

**Klaus' Form dafür (2026-08-09):** *„Den Markt mit Provision und Vermittlung
parallel als laufende Einnahme — also ein Family-Projekt-Klon für Fremde."*

Also **nicht** eine Seite mit zwei Betriebsarten, sondern **zwei Instanzen
derselben Software**:

| | **family-projekt.de** | **Der Klon** |
|---|---|---|
| Für wen | den inneren Geschäftskreis | Fremde, offen |
| Einnahme | Beteiligung + Betreuung (① ②) | **Provision + Vermittlung**, laufend |
| Vertrauen | vorhanden, persönlich | muss die Software herstellen — Wächter, Siegel, Messung |
| Rechtslage | schlank | Vermittler-Pflichten (§ 13) |
| Name/Adresse | bleibt | **eigener Name, eigene Adresse** |

Das ist architektonisch das Sauberste, was heute Abend gesagt wurde, aus drei
Gründen:

1. **Es trennt die Rechtslast.** Die Vermittler-Pflichten hängen am Klon, nicht
   am Kreis. Zwei Instanzen sind hier kein Umweg, sondern die Trennung selbst.
2. **Die Software ist ohnehin zum Kopieren gebaut.** family-project *ist* der
   Bausatz — der Klon ist sein erstes eigenes Produkt.
3. **Und damit ist der Klon zugleich der Beweis für ein drittes Produkt:** wenn
   ein Marktplatz für Fremde läuft, läuft er auch für einen Verein, eine
   Innung, einen Ort. „Ein Marktplatz für deine Gemeinschaft" ist dann keine
   Idee mehr, sondern eine Referenz.

**Der Preis dafür steht in § 5:** zwei Instanzen laufen auseinander, wenn das
Geteilte nicht bewacht wird. Es ist dieselbe Lehre wie bei den zwei WorkFlohs,
nur eine Ebene höher. Und eine technische Falle aus den eigenen Regeln: laufen
beide auf derselben Adresse (GitHub Pages), **muss die DB-Kennung sich
unterscheiden**, sonst kollidieren die Datenbestände.

Die Reihenfolge ① → ② → ③ ist keine Wertung, sondern eine Fütterungskette:
Beteiligung und Betreuung bringen die ersten Anbieter, die bringen Besucher,
und ab da trägt Provision — und skaliert dann besser als beide anderen, weil
sie keine Zeit kostet.

Das Wachstum über Empfehlung ist im eigenen Protokoll schon vorgesehen:
**Modul 14 (Diffusion) — „konsensuelle Empfehlung im Handshake, Wuchs durch
Empfehlung".** Bisher ein Backlog-Stub mit niedriger Priorität. In diesem Modell
ist es der Wachstumsweg selbst und gehört hochgestuft.

---

## 4. Der Beweis — drei Fälle, drei Reifegrade

| Fall | Stand 2026-08-09 | Wert für das Modell |
|---|---|---|
| **Alis Moderaum** | pflegt **selbst** — Warenwirtschaft, Kasse, Produkte | **Der Referenzfall.** Eine Nicht-Programmiererin betreibt ihr eigenes System. Das ist das stärkste Verkaufsargument, das existiert — stärker als jede Marktanalyse. |
| **Tomys Hub** | vollständiger **zweiter Werkzeugkasten** | **Der Beweis, dass der Bausatz funktioniert.** Eigenes BookLedger, eigenes WorkFloh, eigener Angebots-Katalog, eigener Tresor, eigenes Erscheinungsbild (`tomy-ui`), eigene Tests. Der Kasten wurde schon einmal dupliziert. |
| **Perfect Skin Beauty** | teils über Klaus; sie arbeitet sich mit ihrem Mann ein; ein weiterer Shop ist geplant | **Der Messfall.** Die Einarbeitung läuft gerade — jede Stelle, an der sie stockt, ist die Spezifikation des Bausatzes. Diese Beobachtung ist nicht wiederholbar. |

**Belege im Code** für die Selbstbedienung:

| App | Fundstellen |
|---|---|
| Alis Moderaum | 76× Backup, 64× Import, 35× Export, 20× Anlegen, 17× Bearbeiten, 12× Wiederherstellen, eigene `gebrauchsanleitung.html` |
| Tomys Hub | 553× Export, 233× Backup, 172× Import, 48× Anlegen |
| BookLedgerPro | 289× Export, 188× Import, 118× Backup |

Kein Zufallsmuster, sondern ein durchgehaltenes Bauprinzip: **wer sichern,
einlesen und selbst anlegen kann, ist nicht abhängig.**

---

## 5. Der Bausatz — vorhanden, aber unbenannt

### Apps: erfüllt

Siehe § 4. Die Selbstbedienung ist real und in drei unabhängigen Apps belegt.

### Internetseiten: hier geht die Zeit hin

Geprüft am 2026-08-09:

| Seite | Selbstpflege-Ansatz |
|---|---|
| Alis Moderaum | `texte.json` + `bild-import.js` + `products.json` — mit Substanz |
| Perfect Skin Beauty | `texte.json` vorhanden, aber praktisch leer (`{"inputLang":"ru","labels":{},"styles":{}}`) — der Weg ist angelegt, aber nicht begehbar |
| Mein-Workfloh-Page | nichts davon |
| Muttis-Rezeptbuch-Seite | nichts davon |

Das Studio, das wirklich funktioniert — Texte ändern, Bilder tauschen,
veröffentlichen, ohne Sitzung und ohne Git — steht in **family-project** und
kennt nur den Marktplatz.

> **Befund:** Die Apps pflegen sich selbst. Die *Seiten* kosten Klaus Zeit, und
> zwar bei jedem Partner erneut und dauerhaft.

**Erstes Stück des Bausatzes** ist damit keine Erfindung, sondern eine
Zweitverwendung: das Studio aus family-project so allgemein machen, dass es die
Seite eines Partners pflegt. `texte.json` ist bereits die richtige Form und
liegt in zwei Seiten, nur ungefüllt; `bild-import.js` liegt bereits doppelt
herum. Der Bausatz bildet sich von selbst — er ist nur nicht benannt.

### Was bei fünf Partnern bricht

In `Mein-WorkFloh/CLAUDE.md` steht die geltende Regel:

> „Die Brücke läuft immer parallel — eine Verbesserung an einem WorkFloh wird am
> anderen nachgezogen, und umgekehrt."

Richtig **bei zwei**. Bei fünf heißt dieselbe Regel: jede Verbesserung fünfmal
von Hand, jedes Mal die Gefahr, eine Stelle zu vergessen. Diese Arbeit wächst
mit jedem Partner — also genau dann, wenn es gut läuft.

Das Gegenmittel existiert, nur woanders: **der Drift-Guard** (Sage,
Privat-Brain) prüft geteilte Module per SHA-256 auf Byte-Gleichheit.

> **Regel für den Bausatz:** Was geteilt ist, wird geteilt gepflegt und per
> Prüfsumme bewacht. Was eigen ist — Daten, Farben, Texte, Marke —, bleibt eigen.
> Verbessert wird an einer Stelle, dann neu kopiert.

Ohne diese Disziplin wird der fünfte Partner teurer als der erste. Mit ihr
billiger.

---

## 6. Das Übersichtsblatt — alle Partner nebeneinander

**Klaus' Auftrag 2026-08-09.** Ein Blatt, das die Frage beantwortet, von der
das Modell abhängt: *welcher Partner läuft selbstständig, und welcher kostet
mich Zeit?*

**Der größere Teil der Werte liegt bereits vor** — mit Datum und Uhrzeit. Sie
stehen nur in vier verschiedenen Dateien und in keinem Überblick. Das Blatt ist
darum überwiegend eine **Zusammenstellung, kein Neubau.**

| Spalte | Woher die Daten kommen | Stand |
|---|---|---|
| **Partner / App(s)** | `assets/config/listings.js` | ✅ vorhanden |
| **Lebt** | `assets/config/spore-stand.json` — nächtlicher Lauf mit genauem Zeitstempel (`"geprueft": "2026-08-09T03:15:26.439Z"`), je Eintrag `url`, `lage`, `nodeName`, `nodeId` | ✅ vorhanden |
| **Leistung** (Messwert + Datum) | `forschung/messreihe.json` — Zeitreihe je Ziel mit Von-Bis-Spannen, dazu `geraet` (welches Gerät gemessen wurde) | ✅ vorhanden |
| **Wächter** (grün/gelb) | `assets/config/wache-hand.json` + nächtlicher Lauf | ✅ vorhanden |
| **Zuletzt selbst gepflegt** | `spore-stand.json` → **`sporeHash` + `lage: "abweichend"`**: ändert der Partner die Beschreibung in seinem eigenen Repo, ändert sich der Hash, und der nächtliche Lauf meldet es. Ergänzend die Git-Historie der Partner-Seite (Autor ≠ Klaus). | 🟡 **ableitbar** — die Quelle ist da, sie wird nur nicht als Verlauf geführt |
| **Meine Stunden im Monat** | von Hand eingetragen | ❌ fehlt |
| **Bausatz-Stand** (geteilte Teile byte-gleich?) | Drift-Guard über die Partner-Repos | ❌ fehlt |
| **Vereinbarung** (Form, Datum, Anteil) | von Hand, **ohne Beträge im öffentlichen Repo** | ❌ fehlt |

**Der Fund dabei:** `sporeHash` ist bereits ein brauchbares Maß für „hat der
Partner selbst etwas geändert". Er deckt nicht jede Änderung ab — nur die
Beschreibung in der Spore —, aber er kommt ohne jede Hintertür aus und läuft
schon jede Nacht. Was fehlt, ist nicht die Messung, sondern dass sie als
**Verlauf** geführt wird statt als Schnappschuss. Genau dafür ist die
Forschungsstation gebaut.

**Ehrliche Einschränkung:** „Zuletzt selbst gepflegt" ist bei **Seiten**
messbar (die Änderung steht in Git bzw. im Studio-Protokoll), bei **Apps** aber
grundsätzlich **nicht** — die Daten bleiben auf dem Gerät des Partners, und das
ist gewollt. Für Apps braucht die Spalte eine Handeintragung oder eine
freiwillige Meldung. Sie darf **nicht** durch eine Hintertür in die App gelöst
werden; das würde den Datenschutz-Kern brechen, der die Apps überhaupt
verkäuflich macht.

**Bauform:** dieselbe wie die Forschungsstation — eine Reihe mit
Von-Bis-Spannen, die **nur das Werkzeug** schreibt, und Bewertungen, die **nur
von Hand** entstehen. Diese Trennung ist der Grund, warum die Forschungsstation
funktioniert (die nächtliche Maschine kann die Erklärung eines Menschen nicht
überschreiben), und sie gilt hier genauso.

**Wo es liegt:** in family-project, nicht öffentlich. Es enthält
Geschäftsinformationen über Dritte — Stundenzahlen und Vereinbarungen gehören
**nicht** in ein öffentliches Repo (siehe § 13).

---

## 7. Die vorhandenen Messwerkzeuge und wofür sie taugen

Klaus arbeitet gern mit Analysewerkzeugen. Vorhanden sind vier — sie zeigen
bisher alle auf die Technik, keins auf das Geschäft.

| Werkzeug | Was es heute tut | Wofür es im Modell taugt |
|---|---|---|
| **Analyse-Rekorder** der Mycel-Karte (🔬 v1.3) | zeichnet alle Roh-Ereignisse eines Laufs auf, lädt eine JSON-Datei herunter („schick sie Claude") | **Übergabe-Werkzeug für die Einarbeitung**: der Partner drückt Aufnahme, macht seine Runde, schickt die Datei. Dann sieht man, wo es klemmt, statt sich zu erinnern. |
| **Forschungsstation** `forschung/` | Messreihe über die Zeit, Journal, handgeschriebene Lehren, Gegenproben | **Trägt die Geschäftszahl**: wie viel Pflege läuft noch über Klaus — je Partner, über die Zeit. |
| **Drift-Guard** (Sage, Privat-Brain) | SHA-256 über geteilte Module | Beantwortet „läuft Tomys WorkFloh noch mit meinem gleich?" in zwei Sekunden statt als Handregel. |
| **Gegenproben** `gegenprobe_*.sh` | belegen, dass eine Prüfung nötig war | Schutz gegen den grünen Haken, der nichts geprüft hat. |

**Datenschutz beim Rekorder — verbindlich, wenn er auf die Einarbeitung
gerichtet wird:** nur auf Knopfdruck, nur lokal, **keine Inhalte** — nur welcher
Knopf, welche Fehlermeldung, wie lange gewartet. Der Partner schickt die Datei
oder eben nicht.

> **Die präzise Antwort auf die Automatisierungsfrage:** Automatisiere nicht das
> Verkaufen, sondern das **Hinsehen**. Verkauft wird über Vertrauen, das kann
> keine Maschine. Zu wissen, welcher Partner selbstständig läuft und welcher
> Zeit kostet — das kann sie, und das Werkzeug dafür ist dreimal gebaut.

---

## 7b. Wissen, Regeln und Skills — der Bausatz in Schriftform

**Klaus' Frage 2026-08-09:** *„Was ist mit der Erfassung deiner Fortschritte und
Regeln und Dokumentationen — Skills anzuwenden auf dieses Projekt?"*

Das ist dieselbe Frage wie § 5, eine Etage höher. Der Bausatz besteht nicht nur
aus Code, sondern auch aus **Wissen**: wie man eine schnelle Seite baut, wie ein
Knoten sich sauber anmeldet, wie ein Siegel aussieht, wie ein Schlüssel
verschlüsselt liegt. Genau dafür gibt es die Skills unter `.claude/skills/`, und
sie sind gut — sie stammen aus echten Messungen an echten Repos, mit Datum und
Zahl, nicht aus dem Lehrbuch.

### Der Befund — gemessen am 2026-08-09

Dieselben Skills liegen in mehreren Repos. Prüfsummen über `SKILL.md`:

| Skill | Sage-Protokol | family-project | Ergebnis |
|---|---|---|---|
| `verschluesselter-schluessel-tresor` | `10561e87…` | `10561e87…` | ✅ **gleich** |
| `status-leiste-siegel` | `237dcceb…` | `b551bd29…` | ❌ **auseinandergelaufen** |
| `saubere-netz-anmeldung` | `c3d731f1…` | `cd48ea9c…` | ❌ **auseinandergelaufen** |
| `menschlich-schreiben` | vorhanden | — | ⚠️ **nur in Sage** |
| `seiten-bauregeln` | — | vorhanden | ⚠️ **nur in family-project** |

**Zwei von drei geteilten Skills stimmen nicht mehr überein.** Und zwei
wertvolle Skills liegen jeweils nur in einem Repo — eine Sitzung, die in Sage an
einer Seite baut, bekommt die **Bauregeln für Seiten** nicht zu sehen; eine
Sitzung in family-project bekommt die Regeln für **verständliches Schreiben**
nicht zu sehen. Beide würden dort gebraucht.

Der Extremfall steht in `semantic-match-demo`: dessen `CLAUDE.md` ist die
Verfassung von **Muttis Rezeptbuch** — Build-Skript, Icon-Regeln, `QC_MeinRezb`-
Dateien — und behauptet obendrein, das Repo sei privat. Es ist öffentlich.

> **Es ist genau dieselbe Krankheit wie bei den Modulen und den zwei WorkFlohs:
> geteilte Teile ohne Wächter.** Nur trifft sie hier die Regeln selbst — also
> das, woran sich alles andere ausrichtet.

### Was daraus folgt

1. **Skills und Verfassungen sind geteilte Teile und gehören unter denselben
   Drift-Guard** wie die Module. Eine Quelle, byte-genaue Kopien, Prüfsumme.
   Was repo-eigen ist (Dateinamen, Build-Schritt, Domäne), bleibt getrennt —
   dieselbe Trennung wie in § 5 zwischen Geteiltem und Eigenem.
2. **Der wichtigste Skill für dieses Geschäft fehlt noch:** *einen neuen Partner
   aufnehmen* — von „wir sollten mal" bis „die App läuft und er pflegt sie
   selbst". Das ist der Schritt, der sich pro Partner wiederholt, also der mit
   dem größten Hebel. **Sein Inhalt entsteht gerade von allein** — bei Beauty's
   Einarbeitung (§ 4). Was dort dreimal vorkommt, ist eine Zeile in diesem Skill.
3. **Zwei Leser, ein Inhalt.** Ein Skill ist für die Sitzung geschrieben, eine
   **Gebrauchsanleitung** für den Menschen. Alis hat die menschliche Hälfte
   bereits (`gebrauchsanleitung.html`). Beide aus derselben Quelle zu pflegen
   spart die Hälfte der Arbeit und verhindert, dass Anleitung und Wirklichkeit
   auseinanderlaufen.
4. **Fortschritt wird pro Repo sehr gut erfasst** — `PULS.md`, Brief-Kette,
   Übergabeprotokolle, `forschung/JOURNAL.md` und `LEHREN.md`, `status.json`.
   **Über die Repos hinweg gibt es nichts.** Das ist wieder dieselbe Lücke wie
   beim Übersichtsblatt (§ 6): die Daten sind da, der Überblick fehlt.

### Regel

> **Was in mehr als einem Repo gilt, hat eine Quelle und einen Wächter.** Das
> gilt für Module, für Skills, für Verfassungen und für die zwei
> Marktplatz-Instanzen gleichermaßen. Wer eine Kopie ändert, ändert die Quelle
> und kopiert neu — nie umgekehrt.

---

## 8. Der innere Kreis — Klaus' Frage vom 2026-08-09

> *„Was wäre, wenn wir Family Projekt als Grundbaustein nehmen in Kombination
> mit Sage — nur für meinen internen Geschäftskreis, nicht für wildfremde?"*

**Einschätzung: das ist keine Einschränkung, sondern die Form, die die eigene
Architektur ohnehin vorsieht.** Die Vier-Schichten-Lesart trennt bereits
**Schicht 1 (Mycel)** — server-los, unter Vertrauten, Empfangsmodus — von
**Schicht 2 (Pilz)** — sichtbar, oberirdisch, nach außen. Ein geschlossener
Geschäftskreis *ist* die Mycel-Schicht. Der öffentliche Marktplatz *ist* der
Fruchtkörper. Der Marktplatz war nie als Mycel gedacht; Fassung 1 hat ihn so
gelesen und ist deshalb zu einer zu düsteren Diagnose gekommen.

### Was dafür spricht

- **Kein Kaltstart.** Der Kreis beginnt mit den Partnern, die schon da sind.
- **Vertrauen ist vorhanden**, statt durch Zertifikate ersetzt werden zu müssen.
  Das ganze Stufen-/Prüfsystem des Konzeptpapiers wird dadurch weitgehend
  überflüssig; der Wächter bleibt als **Fürsorge**, nicht als Türsteher.
- **Rechtlich einfacher.** Wer keinen öffentlichen Marktplatz für Verbraucher
  betreibt, hat deutlich weniger Pflichten als ein Vermittler für jedermann.
- **Die Cross-Knoten-Suche wird endlich nützlich.** Der bewiesene Versuch vom
  2026-07-11 — BookLedgerPro fragt „wo bekomme ich bedruckte Tassen?", Tomys Hub
  antwortet aus seinem Katalog (0.84, 2,9 s) — ist im offenen Netz eine
  Spielerei. **Im Geschäftskreis ist es ein Empfehlungsnetz unter Betrieben, die
  sich kennen.** Das war die ganze Zeit die eigentliche Anwendung.
- **Modul 14 (Diffusion)** ist genau der Aufnahmeweg eines solchen Kreises:
  Wuchs durch Empfehlung, nicht durch Anmeldung.

### Was es braucht

1. **Eine Mitgliedschaft.** Heute ist der gemeinsame Raum offen — wer die
   Rendezvous-Kennung kennt, ist drin. Ein Kreis braucht eine Liste zugelassener
   Knoten oder einen gemeinsamen Kreis-Schlüssel. Die Bausteine liegen als
   Backlog-Karten bereit: **12 (Blocklist), 10 (Reputation), 14 (Diffusion)**.
2. **Zwei Instanzen statt zweier Betriebsarten** (Klaus 2026-08-09, siehe § 3 ③).
   Der Kreis behält family-projekt.de; für Fremde läuft ein eigener Klon unter
   eigenem Namen. Das ist einfacher zu bauen, einfacher zu erklären und trennt
   die Rechtslast. Offen bleibt nur, was der Wächter in welcher Instanz meldet.
3. **Vertraulichkeit, die den Namen verdient.** *Das ist die eine Stelle, an der
   der Ist-Stand nicht reicht.* Alles auf GitHub Pages ist öffentlich lesbar, und
   das Relais ist ein geborgtes, öffentliches. **Geschlossen im Sinne von
   Sichtbarkeit ≠ geschlossen im Sinne von Daten.** Sobald Partner
   Geschäftsdaten austauschen — Bestände, Preise, Kunden —, braucht es echte
   Verschlüsselung. Der Weg ist schon beschrieben: `docs/E2E-VERTRAULICHKEIT.md`,
   Grad B (Pseudonymisierung, **Modul 25 gebaut**) und Grad C (**B6, offen**).
   **Vor dem ersten echten Geschäftsdaten-Austausch im Kreis ist B6 fällig.**
4. **Eine Antwort auf „was ist der Kreis rechtlich?"** Sobald mehrere Betriebe
   gemeinsam auftreten und Umsätze teilen, entsteht schnell mehr als eine lose
   Runde. Gehört auf denselben Zettel wie § 13.

### Was es nicht löst

Ein geschlossener Kreis macht die Vertraulichkeit **nicht** automatisch besser
(siehe 3.), und er ersetzt die Bausatz-Disziplin nicht — im Gegenteil, im Kreis
sind die Apps enger verwandt, also läuft der Drift schneller auseinander.

**Entscheidung offen — Klaus.** Dieses Papier empfiehlt die Richtung, trifft
aber die Entscheidung nicht.

---

## 9. Was „davon leben" konkret heißt

Bei einem angenommenen Bedarf von **2.000–3.000 € im Monat**:

| Weg | Was dafür nötig wäre | Einschätzung |
|---|---|---|
| Beteiligung an Partnerbetrieben | **2–3 Partner** mit laufendem Geschäft | erreichbar — teilweise vorhanden |
| Wartung / Betreuung | **~100 laufende Kunden** à ~20 €/Monat, oder wenige größere Verträge | erreichbar über Jahre |
| Marktplatz-Provision | **400–500 Käufe im Monat** | erst nach ① und ② |
| Jahresbeitrag für Einträge | bei 50 €/Jahr: **500 zahlende Anbieter** | erst nach ③ |

Alle Zahlen außer der ersten Spalte sind Schätzungen. Was trägt, ist die
**Größenordnung**: die Partner-Wege brauchen wenige Menschen, die
Marktplatz-Wege brauchen hunderte.

---

## 10. Die technische Lücke, wirtschaftlich gelesen

`matchDimensions` (Modul 04) kann beide Richtungen — *A bietet → B sucht* und
*A sucht ← B bietet* — samt drei Schichten und Brücken-Feld. **Aber keine Spore
trägt Fähigkeit und Bedarf getrennt** (`capVector`/`needsVector`: null Treffer
über alle Module und `INTERFACES.md`, geprüft 2026-08-09).

Die vierzehn Knoten sagen, was sie *sind*. Keiner sagt, was er *braucht*. Ein
Netz, in dem niemand Bedarf äußert, kann nur auflisten, nicht vermitteln — und
im Geschäftskreis (§ 8) ist genau das Vermitteln der Zweck.

**Nicht sofort bauen.** Erst messen, ob die zweite Spur die Rangfolge wirklich
verbessert (Werkbank + Messung, siehe
`family-project/docs/BRIEF_UEBERGABE_2026-08-09_BAUPLATZ.md`). Ein
nachgewiesenes „bringt nichts" spart den Bau.

---

## 11. Regeln

**Der Empfangsmodus blockiert den Verkauf nicht.** Die Vier-Schichten-Lesart hat
das versöhnt: *„Akquise gehört in die Pilz-Schicht, nicht ins Mycel."* Der
Knoten bleibt Empfangsmodus. Keine Änderung nötig.

**Die Module sind nicht das Produkt.** Das Protokoll bleibt gemeinfrei, die
Referenz-Implementierung MIT. Verkäuflich sind die fertigen Apps, die Anpassung
an einen Betrieb und die laufende Wartung. Wer beides vermischt, verkauft
entweder nichts oder verliert den Standard.

**Kein Einnahmeweg, der täuscht oder einsperrt.** Kein DRM-Theater, keine
künstliche Knappheit, keine geschönten Messwerte. Der ganze Unterschied zu den
großen Anbietern ist der Ehrlichkeits-Apparat; wer ihn verkauft und dann Nutzer
austrickst, verbrennt sein einziges Kapital.

**Jede Partner-App muss ihren Erbauer überleben können.** Wenn ein Betrieb, an
dem Klaus beteiligt ist, auf einer App läuft, die nur er warten kann, hängt
dessen Geschäft an seiner Zeit und Gesundheit. Die Antwort steht schon in den
Bauregeln — fail-soft, keine toten Knöpfe, Sicherung und Export in jeder App.
Das ist kein düsterer Gedanke, sondern Teil der Ware.

**Geteiltes wird bewacht.** Siehe § 5: Drift-Guard statt Handregel.

---

## 12. Was ausdrücklich NICHT gebaut wird

| Nicht bauen | Grund |
|---|---|
| Gerätegebundener Kopierschutz / DRM | widerspricht der Obfuskations-Tafel; teuer; hält niemanden auf |
| Treuhand/Escrow | löst ein Problem, das erst bei vielen Transaktionen entsteht |
| Entwickler-Stufen 1–4 aus dem Konzept | setzt hunderte Fremde voraus; im Kreis ersetzt Vertrauen das Stufensystem |
| Eine Hintertür, die App-Nutzung meldet | bräche den Datenschutz-Kern, der die Apps verkäuflich macht (§ 6) |
| Eigenes Embedding-Modell | war schon im Konzept ausgeschlossen — gilt weiter |

---

## 13. Rechtliches — gehört auf einen Zettel, nicht in dieses Papier

Klaus' Vorgabe lautet „alles nach Recht und Gesetz". Vier Punkte werden dabei
konkret, und für alle gilt: **das ist Sache eines Steuerberaters, bei Anteilen
zusätzlich eines Notars.** Dieses Papier benennt sie nur, damit sie nicht
vergessen werden.

1. **Form der Beteiligung** — GmbH-Anteile, stille Beteiligung, Umsatz- oder
   Gewinnbeteiligung sind vier verschiedene Dinge mit sehr verschiedenen Folgen
   für Haftung, Steuer und Trennung. Software als Sacheinlage muss bewertet
   werden.
2. **Provision** — wer Provision auf fremde Umsätze nimmt, ist Vermittler, mit
   eigenen Pflichten (Rechnungen, Umsatzsteuer, Bedingungen, je nach
   Ausgestaltung Haftungsfragen).
3. **Der Kreis als solcher** (§ 8) — mehrere Betriebe, die gemeinsam auftreten
   und Umsätze teilen, sind schnell mehr als eine lose Runde.
4. **Keine Beträge und keine Vertragsdetails in öffentliche Repos.** Das
   Übersichtsblatt (§ 6) enthält Geschäftsinformationen über Dritte.

---

## 14. Erste Schritte, in dieser Reihenfolge

1. **Beauty jetzt mitschreiben** (kostet nichts, ist nicht wiederholbar): wo
   bleibt sie hängen, was fragt sie. Was dreimal vorkommt, gehört in die
   Anleitung; was zweimal vorkommt, gehört in die Software geändert.
2. **Der zweite Knopf am Marktplatz** — „Ich hätte gern so etwas für meinen
   Betrieb". Die Maschinerie steht (`einreichung.php` mit Warteschlange,
   Spam-Falle, Rate-Limit); es fehlt nur ein zweiter Anlass.
3. **Das Übersichtsblatt** (§ 6) — erst mit den Spalten, die schon Daten haben.
   Die Handspalten kommen dazu, wenn sie gebraucht werden.
4. **Das Studio für Partner-Seiten** (§ 5) — Zweitverwendung, kein Neubau. Der
   Punkt, an dem Klaus' Zeit pro Partner aufhört zu wachsen.
5. **Drift-Guard über die Partner-Apps** — bevor der vierte Partner dazukommt,
   nicht danach. Er deckt später auch die zwei Marktplatz-Instanzen ab.
6. **Die zwei auseinandergelaufenen Skills zusammenführen** (§ 7b) — klein,
   heute machbar, und es verhindert, dass zwei Sitzungen nach verschiedenen
   Regeln bauen. Dabei `menschlich-schreiben` und `seiten-bauregeln` in beide
   Repos legen; sie werden in beiden gebraucht.
7. **Der Klon für Fremde** (§ 3 ③) — erst wenn 1–5 stehen. Er braucht eigenen
   Namen, eigene Adresse, eigene DB-Kennung und die Vermittler-Pflichten aus
   § 13. Bis dahin ist er eine Entscheidung, kein Bau.

---

## 15. Offene Entscheidungen — nur Klaus

1. **Innerer Kreis ja/nein** (§ 8) und, falls ja, in welcher Form die
   Mitgliedschaft entsteht.
2. **Everlast GmbH** — das Konzept-Repo ist über weite Strecken ein Angebot an
   eine namentlich genannte Firma (30 Fundstellen in 7 Dateien). Klaus
   2026-08-09: *erst später entscheiden.* Bis dahin wird darauf nichts
   aufgebaut und nichts entfernt.
3. **Jahresbeitrag (`yearlyUrl`)** — Marktplatz-Gebühr oder Wartungsbeitrag.
   Dieses Papier empfiehlt Wartungsbeitrag.
4. **Preisform für WorkFloh** und für die Betreuung (Einarbeitung ≠ Wartung).
5. **Verfügbare Zeit im Monat** für Betreuung und Gespräche.
6. **Name und Adresse des Klons** (§ 3 ③) — er darf nicht „Family Projekt"
   heißen, sonst vermischen sich Kreis und Öffentlichkeit in der Wahrnehmung.
7. **Provisionshöhe und Vermittlungs-Bedingungen** im Klon — wer bekommt wie
   viel, wann, und was gilt, wenn etwas schiefgeht.

---

## 16. Belege und Fundstellen

| Aussage | Quelle |
|---|---|
| 65.000–116.500 €, Break-even ab Monat 8 bei 400 Apps | `semantic-match-demo/Kosten_Nutzen_Analyse_PWA_Plattform.pdf` |
| Engine 20.000–37.500 €, „einmal gebaut, beliebig integrierbar" | `Kostenanalyse_Everlast_Engine_PWA.pdf` |
| „Ohne Partner: Kaltstart 3–6 Monate, 10.000–20.000 € Marketing" | ebenda, § 5 |
| Bidirektionalität als Alleinstellungsmerkmal | `USP_Bidirektionales_Matching.pdf`, `SBKIM_Paper_DE.html` § 3.1 |
| 14 Marktplatz-Einträge | `family-project/assets/config/listings-vec.json` |
| Selbstbedienungs-Zählungen (Backup/Import/Export/Anlegen) | Alis-Moderaum, Tomys-Hub, BookLedgerPro, gezählt 2026-08-09 |
| Tomys zweiter Werkzeugkasten | `Tomys-Hub/` — `bookledger`, `workfloh`, `tomy-data`, `tomy-ui`, `tomy-tresor.js`, eigene `tests` |
| „Die Brücke läuft immer parallel" | `Mein-WorkFloh/CLAUDE.md` |
| `texte.json` in Beauty praktisch leer | `Perfect-Skin-Beauty/texte.json`, gelesen 2026-08-09 |
| Analyse-Rekorder v1.3, „schick sie Claude" | `mycel-karte/index.html` |
| Forschungsstation, Rollentrennung der drei Dateien | `family-project/forschung/README.md` |
| Cross-Knoten-Q&A hub-unabhängig bewiesen | `docs/meilenstein/2026-07-11_hub-unabhaengige-cross-knoten-qa.md` |
| Vier-Schichten-Lesart, „Akquise gehört in die Pilz-Schicht" | `CLAUDE.md` |
| „Obfuskation ist ausdrücklich NICHT der Weg" | `CLAUDE.md` § Fork ≠ Vorfall |
| Vertraulichkeits-Grade B und C | `docs/E2E-VERTRAULICHKEIT.md`, `docs/PLAN_SEMANTIK_KRYPTO.md` |
| `capVector`/`needsVector` nirgends vorhanden | Suche über `src/modules/*` + `docs/INTERFACES.md`, 2026-08-09 |

---

**Fortschreiben:** Wer einen Punkt entscheidet oder widerlegt, trägt es hier ein
(Datum + was jetzt gilt) und vermerkt es in `docs/PULS.md`. Dieses Papier bindet,
bis eine Messung oder eine Auskunft es widerlegt — genau das ist zwischen
Fassung 1 und Fassung 2 passiert.
