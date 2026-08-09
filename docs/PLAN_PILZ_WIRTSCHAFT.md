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
| **Tomys Hub** | die **Software** ist ein vollständiger zweiter Werkzeugkasten; **Tomy selbst arbeitet sich noch ein** | **Der Beweis, dass der Bausatz funktioniert** — eigenes BookLedger, eigenes WorkFloh, eigener Angebots-Katalog, eigener Tresor, eigenes Erscheinungsbild (`tomy-ui`), eigene Tests. Zugleich **zweiter Messfall**: der Kasten ist dupliziert, der Mensch ist es noch nicht. |
| **Perfect Skin Beauty** | teils über Klaus; sie arbeitet sich mit ihrem Mann ein; ein **Online-Shop** ist geplant | **Erster Messfall** und zugleich der erste Fall, in dem **Geld durch die Software fließt** (§ 4b). |

**Wichtige Unterscheidung (Klaus 2026-08-09):** *„Der Bausatz ist dupliziert"* und
*„der Partner ist selbstständig"* sind **zwei verschiedene Reifegrade**. Tomys
Werkzeugkasten steht vollständig, aber Tomy arbeitet sich ein. Von drei Partnern
ist **einer selbstständig und zwei sind in der Einarbeitung** — das ist der
aktuelle Engpass des Modells und zugleich die beste Nachricht für den Bausatz:
**es laufen gerade zwei Beobachtungsfälle gleichzeitig**, nicht einer. Was bei
Tomy *und* bei Beauty klemmt, ist mit Sicherheit ein Fehler im Bausatz und nicht
am Menschen.

---

## 4b. Der Online-Shop — der erste Fall, in dem Geld durch die Software fließt

Beauty's geplanter Shop ist ein **Online-Shop**, kein zweiter Laden (Klaus
2026-08-09). Das ist ein anderer Fall als alles bisher Gebaute, in drei
Hinsichten.

### Empfehlung: die Kasse **nicht** selbst bauen

Das ist die klarste Bau-Empfehlung dieses Papiers und gehört zur
Nicht-bauen-Liste (§ 12).

Ein selbstgebauter Bezahlvorgang bedeutet, dauerhaft die Verantwortung für
Zahlungssicherheit, Steuerlogik und rechtliche Pflichten zu tragen — **für einen
fremden Betrieb**. Das ist kein Wochenendprojekt, es ist eine Dauerlast, und
sie widerspricht der Regel „jede Partner-App muss ihren Erbauer überleben
können" (§ 11).

**Die saubere Teilung:**

| Klaus baut | Ein erprobter Anbieter macht |
|---|---|
| Katalog, Bilder, Beschreibungen, Selbstpflege (`texte.json`-Muster) | Warenkorb, Bezahlung, Rechnungen, Steuersätze |
| semantische Suche, Empfehlung im Kreis | Zahlungssicherheit, Rückabwicklung |
| Messung, Wächter, Siegel, Ladezeit | die Pflichtangaben-Vorlagen des Checkouts |

Was Klaus besser kann als jede Shop-Software, ist **Auffindbarkeit nach
Bedeutung und belegtes Vertrauen**. Was er nicht besser kann als ein
Zahlungsanbieter, ist der Bezahlvorgang.

### Rechtliches — hier wird es dichter als bisher

Ein Online-Shop an Verbraucher trägt Pflichten, die eine App ohne Verkauf nicht
hat. Dieses Papier zählt sie **nur auf**, damit nichts vergessen wird; die
Umsetzung gehört zu Steuerberater und, für Texte wie Widerruf und AGB, zu
jemandem mit Rechtskenntnis:

- **Bestellablauf:** der Bestellknopf muss zahlungspflichtig beschriftet sein
  (Button-Lösung), Gesamtpreis inklusive Steuer und Versandkosten vor dem Klick.
- **Widerrufsrecht:** Belehrung plus Muster-Widerrufsformular.
- **AGB, Impressum, Datenschutzerklärung** — Lieferzeiten, Zahlungsarten.
- **Kosmetik ist ein besonders geregeltes Produkt.** Wer eigene Ware herstellt
  oder einführt, hat Pflichten aus der EU-Kosmetikverordnung
  (verantwortliche Person, Meldung, Kennzeichnung, Inhaltsstoffe). Wer nur
  weiterverkauft, in der Regel nicht — **das ist vorher zu klären, nicht
  hinterher.**
- **Versandverpackungen** sind in Deutschland registrierungspflichtig
  (Verpackungsregister). Wird häufig übersehen und ist bußgeldbewehrt.
- **Umsatzsteuer** — auch bei Versand über die Grenze.

**Für das Modell heißt das:** der Shop ist der erste Fall, in dem Klaus'
Software an einem echten Geldfluss hängt. Damit steigt sowohl der Wert der
Beteiligung als auch die Sorgfaltspflicht. Beides gehört auf denselben Zettel
wie § 13 — **und zwar bevor der Shop online geht.**

**Belege im Code** für die Selbstbedienung:

| App | Fundstellen |
|---|---|
| Alis Moderaum | 76× Backup, 64× Import, 35× Export, 20× Anlegen, 17× Bearbeiten, 12× Wiederherstellen, eigene `gebrauchsanleitung.html` |
| Tomys Hub | 553× Export, 233× Backup, 172× Import, 48× Anlegen |
| BookLedgerPro | 289× Export, 188× Import, 118× Backup |

Kein Zufallsmuster, sondern ein durchgehaltenes Bauprinzip: **wer sichern,
einlesen und selbst anlegen kann, ist nicht abhängig.**

---

## 4c. Alis nimmt Fahrt auf — und was das für die Daten heißt

**Klaus 2026-08-09:** *„Auch Alis Moderaum nimmt gerade Form an. Erste Einkäufe
finden statt, und die Planung, Preise, Vertriebswege und vieles mehr nehmen
Fahrt auf."*

Damit wird aus dem Referenzfall ein **arbeitender Betrieb**. Ab dem ersten
echten Einkauf stehen in der Warenwirtschaft Daten, deren Verlust Geld kostet:
Bestand, Einkaufs- und Verkaufspreise (`ekcent`, `vkcent`, `verkaufbuchen` sind
vorhanden und richtig angelegt).

### Der Befund — geprüft, nicht vermutet

| Frage | Antwort |
|---|---|
| Wo liegen Lager und Bewegungen? | **IndexedDB** (`idbAdd('articles')`, `idbPut`, `idbClear`) |
| Wo liegen die Shop-Inhalte? | **localStorage** (`alm_products`, `alm_labels`, `alm_styles`, …) |
| `navigator.storage.persist()`? | **fehlte** |
| Erinnerung an eine Sicherung? | **fehlte** |
| Backup-Tresor selbst? | **vorhanden und gut gebaut** — Komplett-Backup, Wiederherstellen, CSV, Alt-Format-Erkennung |

*Berichtigung: eine erste, schnellere Durchsicht hatte den Bestand komplett in
`localStorage` verortet. Das stimmt nicht — der Lager-Kern liegt in IndexedDB.
Der Befund selbst bleibt: beides ist Browser-Speicher, und ein „Browserdaten
löschen" nimmt beides mit.*

**Die eigentliche Lücke war nicht der Tresor, sondern die Erinnerung:**

> Eine Sicherungsfunktion, die niemand drückt, ist keine Sicherung.

**Gebaut am 2026-08-09** (Alis-Moderaum PR #37): der Kopf der Warenwirtschaft
zeigt, wann zuletzt ein Komplett-Backup gezogen wurde (heute / gestern / vor N
Tagen / noch nie); ab 14 Tagen fällt der Hinweis auf und führt per Klick zum
Tresor. `exportFullBackup()` setzt den Zeitstempel selbst, kann ihn also nicht
vergessen. Dazu `navigator.storage.persist()` als Bitte an den Browser.
Gespeichert wird **nur ein Datum** — keine Inhalte, nichts verlässt das Gerät.
Beweis: `tests/smoke_backup_erinnerung.mjs`, 17/17. Browser-Sichttest steht aus.

**Regel daraus, netzweit:**

> **Sobald bei einem Partner echtes Geld durch die Daten geht, ist die Sicherung
> keine Funktion mehr, sondern eine Zusage.** Jede Partner-App braucht dann:
> einen Export, eine sichtbare Erinnerung daran, und `persist()`. Das ist die
> App-Seite derselben Verantwortung, die § 11 „muss den Erbauer überleben
> können" nennt.

Zu prüfen bei den anderen Partner-Apps, bevor auch dort Geld fließt.

---

## 4d. Provision und Anteil im System — was automatisch geht und was nicht

**Klaus' Frage 2026-08-09:** *„Lässt sich automatisch im Warenwirtschaftssystem
eine Provision / ein Anteil als Auszahlung einbauen, in Kombination mit BLP,
Steuerproblematik und Einnahmen-Überschuss-Rechnung?"*

Die Antwort zerfällt sauber in drei Teile — und sie sind unterschiedlich zu
beantworten.

### 1. Rechnen: ja, und die Daten reichen dafür schon

Die Warenwirtschaft kennt Einkaufspreis (`ekcent`), Verkaufspreis (`vkcent`) und
den gebuchten Verkauf. Damit ist jede Beteiligungsform rechenbar. **Die Rechnung
ist trivial — die Wahl der Grundlage ist die ganze Entscheidung:**

| Grundlage | Was sie bedeutet | Beurteilung |
|---|---|---|
| **Umsatz** | Anteil vom Verkaufspreis | einfach und nachvollziehbar, aber Klaus verdient auch an einem Artikel, an dem der Betrieb verliert |
| **Rohertrag** (VK − EK) | Anteil an der Spanne | **passt zu einem Handelsbetrieb und zu den vorhandenen Daten.** Empfehlung dieses Papiers |
| **Gewinn** | nach allen Kosten | braucht vollständige Kostenrechnung, lädt zum Streit über einzelne Posten ein |

Rohertrag ist auch das ehrlichste Maß: Klaus verdient daran, dass **gut
eingekauft und gut verkauft** wird — genau der Beitrag, den die Software
leistet.

### 2. Auszahlen: nein — bewusst nicht

Ein selbstgebautes System **berechnet und zeigt**. Es **bewegt kein Geld**. Das
ist dieselbe Linie wie beim Bezahlvorgang (§ 4b), und sie steht als Prinzip
bereits im Netz — in Private Brain, als eine der drei Vertrauens-Säulen:

> *liest nur · schlägt vor · bewegt nichts*

Automatische Zahlungen aus einem selbstgebauten System heraus wären ein Fehler,
für den es keinen Ausgleich gibt: ein Rechenfehler, ein doppelter Lauf, ein
falscher Zeitraum — und es ist fremdes Geld. Der Mensch drückt den Knopf bei
der Bank, nicht die Software.

### 3. Der saubere Weg — vier Schritte, drei davon automatisch

```
Warenwirtschaft          rechnet je Zeitraum den Rohertrag → eine Zahl
        ↓  (Beleg, wie WorkFloh → BLP heute schon)
BookLedgerPro            bucht sie als Betriebsausgabe / -einnahme, EÜR
        ↓
Klaus                    stellt die Abrechnung, wie vereinbart      ← Mensch
        ↓
Bank                     zahlt                                     ← Mensch
```

Die Brücke dafür ist **kein Neubau**: `WorkFloh → BookLedgerPro` läuft bereits
über `?uebernahme=<base64url(JSON)>` mit einem festen Datenvertrag. Von der
Warenwirtschaft aus wäre es das dritte Mal dasselbe Muster.

**Ein starker Nebeneffekt:** BookLedgerPro ist von Anfang an auf GoBD gebaut —
Festschreibung, Storno statt Löschen, Hash-Kette. Eine automatisch berechnete
und dort gebuchte Abrechnung ist damit **nachvollziehbar und unveränderlich**.
Das ist bei einer Beteiligung zwischen Vertrauenspersonen mehr wert als die
Bequemlichkeit: es schützt beide Seiten, gerade wenn es später einmal Streit
gäbe.

### 4. Die Steuerseite — hier entscheidet die Form, nicht die Software

**Das ist der Punkt, an dem dieses Papier aufhört und ein Steuerberater
anfängt.** Der Grund ist präzise benennbar: **die steuerliche Behandlung folgt
der Rechtsform der Beteiligung, nicht der Berechnungsweise.**

- Ist der Anteil eine **Leistung** (Vermittlung, Lizenz, Wartung), ist er beim
  Partner Betriebsausgabe und bei Klaus Betriebseinnahme, in der Regel mit
  Rechnung und Umsatzsteuer — sofern nicht die Kleinunternehmer-Regelung greift.
- Ist er ein **Gewinnanteil** aus einer Gesellschafterstellung, gelten andere
  Regeln, und eine Rechnung wäre sogar falsch.
- Beides gleichzeitig geht nicht, und die Wahl hat Folgen für Haftung, Steuer
  und den Fall einer Trennung.

**Praktisch heißt das:** die Berechnung kann jetzt gebaut werden, denn sie ist
in beiden Fällen dieselbe Zahl. Die **Beschriftung** dieser Zahl — Rechnung oder
Gewinnanteil — wird erst nach dem Steuerberater-Termin festgelegt. Wer es
umgekehrt macht, baut eine Buchung, die er hinterher zurücknehmen muss.

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

## 8b. Der offene Markt — was der Klon konkret ist

**Klaus 2026-08-09, sinngemäß:** *„Es gibt inzwischen etliche, die den Markt
erkannt haben. Aber es ist noch sehr unprofessionell, eher wie eine Community
aufgebaut — ‚hast du nicht Lust, das zu machen'. Das will ich nicht. Ich müsste
es professionell machen, ehrlich und offen. Der Grund, warum man mitmacht, soll
sein, dass man damit Geld verdienen kann — darüber soll man nicht diskutieren
müssen. Deshalb getrennt von family-project: das ist familiär. Das andere ist
offen für den gesamten Markt, auf demselben Prinzip: Ehrlichkeit, technische
Raffinesse, professionell. Und es muss nebenbei laufen."*

### Warum die Trennung technisch **und** menschlich richtig ist

Die beiden brauchen einen **gegensätzlichen Ton**:

| | **family-projekt.de** — der Kreis | **Der offene Markt** |
|---|---|---|
| Wer | Menschen, die sich kennen | Fremde |
| Woher kommt Vertrauen | von den Personen | **muss die Software herstellen** |
| Ton | persönlich, offen, man redet über alles | sachlich, knapp, nachprüfbar |
| Warum macht jemand mit | weil man sich hilft | **weil man damit Geld verdient** — offen so gesagt |
| Rechtslage | schlank | Vermittler-Pflichten (§ 13) |

Wer beides in eine Seite packt, macht den Kreis unpersönlich und den Markt
unseriös. Die Trennung ist deshalb kein Umweg, sondern der Kern.

### Der Wettbewerbsvorteil ist nicht behauptet, sondern belegbar

Klaus' Beobachtung — die bestehenden PWA-Marktplätze wirken unprofessionell und
community-artig — beschreibt eine echte Lücke. Was ihn davon unterscheidet, ist
bereits **gebaut und läuft jede Nacht**:

- **gemessene Ladezeiten je Eintrag**, täglich neu, auch die schlechten
  (Forschungsstation + Messreihe)
- **ein Wächter**, der fremde Herkunft und auffällige Muster meldet
- **ein Siegel**, das an Bedingungen hängt statt an Selbstauskunft
- **Suche nach Bedeutung** statt nach Stichwörtern
- **belegte Herkunft** jeder Zahl („von uns gemessen" ≠ „vom Anbieter gemeldet")

Kein anderer PWA-Marktplatz kann das heute zeigen. **Professionell heißt hier
nicht „hübscher", sondern „nachprüfbar".** Das ist der Unterschied, und er ist
schon bezahlt.

### Was der Klon sein muss — und was nicht

**Muss:**
- **Eigener Name, eigene Adresse, eigene DB-Kennung** (sonst kollidieren die
  Datenbestände auf geteilter Adresse).
- **Preis und Provision auf der ersten Seite** — kein Herantasten. Wer nicht
  weiß, was es kostet, hält es für unseriös.
- **Aufnahme in Minuten, ohne Gespräch.** Formular → Prüfung → veröffentlicht.
  Die Maschinerie steht (`einreichung.php` + `freigabe.php` + Studio).
- **Nebenbei-tauglich:** jeder Schritt, der Klaus' Zeit kostet, ist ein Fehler
  im Entwurf. Ziel ist, dass ein neuer Eintrag ihn **null Minuten** kostet,
  solange nichts auffällt.
- **Impressum, AGB, Widerruf, Preisangaben** — siehe § 13.

**Darf nicht:**
- kein Community-Ton, keine Mitmach-Appelle, kein „hast du nicht Lust"
- keine Bewertungen ohne Grundlage, keine geschönten Zahlen
- **kein Bezahlvorgang in Eigenbau** (§ 4b)
- keine Vermischung mit dem Kreis — weder in der Marke noch in den Daten

### Was ihn nichts kostet, weil es schon existiert

Marktplatz-Seite · Studio · Einreich-Formular mit Warteschlange und Spam-Falle ·
nächtliche Messung · Wächter · Siegel · semantische Suche · Vektor-Katalog.
**Der Klon ist keine Neuentwicklung, sondern eine Kopie mit anderem Gesicht und
anderen Bedingungen** — und damit zugleich der Beweis für ein drittes Produkt:
ein Marktplatz für einen Verein, eine Innung, einen Ort (§ 3 ③).

---

## 8b1. Eigenes Repo — Entscheidung 2026-08-09

Zur Debatte stand, **SB-KIMTool-Point umzuwidmen und umzubenennen**. Es war
ursprünglich für genau diesen Zweck gedacht und trägt bereits eine
Werkzeugkiste (7 Werkzeuge), ein Knoten-Verzeichnis (`web/data/marktplatz.json`,
9 Einträge), ein Such-Werkzeug und eine neutrale Identität.

**Gemessen, was ein Umbenennen anfassen würde:**

| Repo | Dateien mit Verweis auf `SB-KIMTool-Point` |
|---|---|
| Sage-Protokol | **101** |
| family-project | **34** |
| Jasons-Tresor | **30** |
| Mein-Tresor | **25** |
| mycel-karte | 1 |
| **Summe** | **191** |

Dazu: die Spore des Knotens trägt `endpoint:
https://lausiklauskn-png.github.io/SB-KIMTool-Point/` und ist **signiert** — ein
Adresswechsel erzwingt eine Neu-Signatur und läuft in genau die Adress-Wand,
die Modul 23 gelöst hat.

**Klaus' Entscheidung: neues Repo.** Das ist auch inhaltlich sauberer —
SB-KIMTool-Point bleibt, was es ist (Werkzeug-Hub und Observatorium für Forker,
ein Knoten im Mycel); der offene Markt bekommt eine **eigene Identität, eigene
Spore, eigene Adresse**. Was gebraucht wird, wird **kopiert, nicht verschoben**
(Bausatz-Regel, § 5) — beide Seiten bleiben lauffähig.

Arbeitsname: **PWA Toolpoint**. Er besteht den Vorlese-Test aus § 8b und
vermeidet „Kim" nach außen. Die Domain muss noch geprüft und entschieden werden
(§ 15 Punkt 6).

---

## 8c. Den Kreis schließen — was wirklich schützbar ist und was nicht

**Klaus' Wunsch:** *„family-project soll verschlüsselt werden, damit andere da
nicht reinkapern, im Prinzip die Apps klauen. Sie stehen zwar offen zur
Verfügung, aber sie sollen in dieses Netzwerk eingebunden sein. Fremde, die
reinkommen, werden ausgegliedert oder auf das andere Projekt verwiesen."*

Das Ziel ist richtig. Der Weg dorthin führt aber **nicht** über Verschlüsselung
der Apps — und das ist keine Meinung, sondern steht bereits als Tafel in
`CLAUDE.md`:

> **Obfuskation ist ausdrücklich NICHT der Weg** — Web-Code ist immer lesbar,
> und Kopierbarkeit ist bei SBKIM gewollt: das Protokoll und die Werkzeuge
> SOLLEN nachgebaut werden können. Rechtlicher Schutz ist das **Copyright plus
> die Git-Historie**, nicht Verschleierung.

Eine öffentlich erreichbare Web-App lässt sich nicht gegen Kopieren sichern.
Jeder Versuch kostet Ladezeit, bricht die Offline-Fähigkeit und hält niemanden
auf, der es ernst meint.

**Aber der eigentliche Wunsch ist erfüllbar** — er betrifft nicht den Code,
sondern **die Zugehörigkeit**:

| Nicht schützbar | Schützbar — und das ist gemeint |
|---|---|
| dass jemand den Code liest oder kopiert | **wer im Kreis ist** (Mitgliedschaft, Aufnahme über Empfehlung — Modul 14) |
| dass jemand eine ähnliche App baut | **was im Kreis ausgetauscht wird** (echte Verschlüsselung, Grad C / B6) |
| dass jemand die Seite ansieht | **worüber im Kreis gesprochen wird** (nicht öffentlich, nicht auf einem geborgten Relais im Klartext) |
| — | **die Urheberschaft** (Copyright + Git-Historie mit Datum — bereits vorhanden) |

**Daraus die drei Bauteile, in dieser Reihenfolge:**

1. **Mitgliedschaft.** Heute ist der gemeinsame Raum offen: wer die
   Rendezvous-Kennung kennt, ist drin. Der Kreis braucht eine Liste zugelassener
   Knoten. Bausteine liegen als Backlog-Karten bereit: **12 (Blocklist),
   14 (Diffusion, Aufnahme über Empfehlung), 10 (Reputation)**.
2. **Höfliche Weiterleitung.** Ein Fremder, der anklopft, wird **nicht
   abgewiesen, sondern verwiesen** — auf den offenen Markt (§ 8b). Das ist
   zugleich der Zubringer für ③: jeder abgewiesene Interessent ist ein
   möglicher Eintrag drüben. *Ausschluss und Wachstum sind hier dasselbe
   Bauteil.*
3. **Vertraulichkeit im Kreis.** Erst wenn dort Geschäftsdaten fließen —
   Bestände, Preise, Kunden — reicht der heutige Stand nicht mehr.
   **Grad C (B6) ist dann fällig**, nicht vorher, aber auch nicht später.

**Die ehrliche Ansage nach außen**, die beides zusammenhält:

> Die Apps sind offen und dürfen kopiert werden — das ist Absicht. Was nicht
> offen ist, ist der Kreis: wer drin ist, ist eingeladen worden. Wer mitmachen
> will, findet nebenan einen Marktplatz, der jedem offensteht.

Das ist ehrlich, es widerspricht keiner Tafel, und es ist in einem Satz erklärbar
— was bei einem Kopierschutz nie der Fall wäre.

---

## 8c1. Relais — eigenes oder fremdes, und wie viele

**Klaus' Frage 2026-08-09:** *„Eigenes oder fremdes Relais? Mehrere, um Ausfälle
zu vermeiden?"*

**Ausgangslage:** Klaus betreibt bereits ein **eigenes** Relais —
`wss://relay.family-projekt.de`, auf seinem Hetzner-Server hinter Caddy. Alle
Knoten laufen darüber. Und **Modul 05b kann längst mehrere**: `DEFAULT_RELAYS`
ist eine Liste, `configure({relays:[…]})` nimmt sie entgegen — heute steht nur
eine Adresse darin. **Mehrere Relais sind Konfiguration, kein Bau.**

### Die Abwägung

| | Eigenes Relais | Fremde, öffentliche Relais |
|---|---|---|
| Kontrolle | vollständig; später auch Beschränkung möglich | keine — können filtern, drosseln, verschwinden |
| Kosten | läuft auf dem vorhandenen Server mit | 0 € |
| Wartung | seine | keine |
| Ausfall | **ein Server, ein Ausfallpunkt** | viele, unabhängig voneinander |
| Lesbarkeit | öffentlich lesbar, wer die Adresse kennt | ebenso |

**Der wunde Punkt beim eigenen:** Relais und Marktplatz lägen auf **derselben
Maschine**. Fällt der Server aus, fällt beides gleichzeitig — ein
zusammenhängender Ausfall, genau die Sorte, gegen die Redundanz eigentlich
helfen soll.

### Empfehlung: gemischt, aber **unterschiedlich je Seite**

- **Der offene Markt:** eigenes Relais **plus zwei bis drei öffentliche** als
  Ausweichweg. Mehr Relais heißt hier mehr Reichweite und mehr Verfügbarkeit —
  beides erwünscht, nichts spricht dagegen.
- **Der Kreis:** **nur das eigene.** Jedes zusätzliche Relais ist eine weitere
  Stelle, an der der Verkehr des Kreises öffentlich mitlesbar liegt. Verfügbarkeit
  ist hier weniger wert als Übersichtlichkeit — man weiß genau, wo die Nachrichten
  landen.

Das folgt derselben Logik wie die ganze Trennung: außen Reichweite, innen
Kontrolle.

### Zwei Klarstellungen, damit nichts missverstanden wird

1. **Mehr Relais bringt Verfügbarkeit, nicht Vertraulichkeit.** Im Gegenteil —
   jede zusätzliche Adresse ist eine weitere öffentliche Kopie. Vertraulichkeit
   bleibt Grad C (B6), und die ist fällig, sobald im Kreis Geschäftsdaten
   fließen (§ 8c).
2. **Ein eigenes Relais ist noch keine Mitgliedschaft.** Wer die Adresse und das
   Raum-Tag kennt, kann mithören — auch auf dem eigenen Server. Die
   Mitgliedschaft entsteht über die Zulassungsliste (§ 8c, Module 12/14), nicht
   über den Betreiber des Relais.

---

## 8d. Der langsame Start — drei Stufen, ein Auslöser

**Klaus' Ausgangslage am 2026-08-09, in seinen Worten:** noch alles im Aufbau ·
**kein Geld eingenommen**, nur ein Spenden-Hinweis auf der Seite · mit niemandem
über Beteiligungen gesprochen — *„das kommt alles erst in einer Woche, dann wird
darüber gesprochen und dann entscheidet sich, wie ich weiter vorgehe"* · bei den
meisten Projekten noch kein Geld in Aussicht oder geringfügige Beträge · Werbung
soll über Freunde und das eigene Umfeld laufen, gezielt an Leute mit Interesse ·
zunächst als **zweite Einnahmequelle**, und *„wenn's mehr wird, übernimmt es den
Hauptlebensunterhalt"*.

Sein Wunsch: **das geringste Risiko, das überhaupt geht.** Erst bauen, zeigen,
die Reaktion abwarten — dann handeln. *„Auf die Projektion der anderen kommt
meine Reaktion."*

### Die drei Stufen

| Stufe | Was passiert | Gewerbe nötig? |
|---|---|---|
| **0 · Bauen** | Repo, Seite, Werkzeuge; nichts öffentlich | nein |
| **1 · Zeigen** | Seite ist online, zeigt Apps und die gemessenen Werte. **Keine Preise, keine Provision, kein „trag dich ein für X €"** | nein — aber Impressum + Datenschutzerklärung gehören trotzdem drauf |
| **2 · Handeln** | zum ersten Mal ein Preis, eine Provision, eine Vereinbarung | **ja, vor diesem Schritt** |

**Die Formulierung, die das Risiko klein hält:**

> Ich baue und zeige zuerst. Solange ich nur zeige, gibt es keine Preise und
> keine Provision. Sobald ich zum ersten Mal etwas gegen Bezahlung anbiete,
> melde ich das Gewerbe an — vorher nicht, aber auch nicht später.

**Warum beide Hälften wichtig sind:** zu früh anmelden kostet Papierkram und
eine kleine Gebühr. Handeln ohne Anmeldung ist eine Ordnungswidrigkeit. Die
Fehler sind **nicht gleich teuer**, deshalb wird die Grenze zwischen Stufe 1 und
2 **scharf** gezogen: sobald irgendwo ein Preis, ein Prozentsatz oder ein „jetzt
eintragen" steht, ist es Stufe 2. Eine Seite, die *zeigt*, ist eindeutig; eine,
die *fast schon anbietet*, ist ein Graubereich — und Graubereiche sind das,
was vermieden werden soll.

*(Keine Rechtsberatung. Die Struktur steht hier, die Entscheidung trifft das
Gewerbeamt bzw. der Steuerberater — § 13.)*

### Stufe 1 ist zugleich die Messung

In Stufe 1 gibt es keinen Preis, aber sehr wohl ein **Formular**: *„Ich hätte
Interesse."* Das kostet nichts, verpflichtet zu nichts, und es ist genau die
Reaktion, die gemessen werden soll. Meldet sich niemand, ist Stufe 2 gespart.
Melden sich zehn, weiß man auch gleich, was sie wollen.

**Das ist dieselbe Disziplin wie überall sonst im Netz:** keine Ursache ohne
Beleg, keine Schwankung ohne Zahl — hier: **kein Preismodell ohne Nachfrage.**
Erst messen, dann verpflichten.

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
| **Automatische Auszahlung von Anteilen/Provision** | ein selbstgebautes System rechnet und zeigt, es bewegt kein fremdes Geld. „liest nur · schlägt vor · bewegt nichts". Siehe § 4d |
| **Ein eigener Bezahlvorgang / eigene Shop-Kasse** | dauerhafte Verantwortung für Zahlungssicherheit, Steuerlogik und Rechtspflichten — für einen fremden Betrieb. Widerspricht „muss den Erbauer überleben können". Siehe § 4b |
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

1. **Beauty UND Tomy jetzt mitschreiben** (kostet nichts, ist nicht
   wiederholbar): wo bleiben sie hängen, was fragen sie. Zwei Einarbeitungen
   gleichzeitig sind ein Glücksfall — **was bei beiden klemmt, ist ein Fehler im
   Bausatz und nicht am Menschen.** Was dreimal vorkommt, gehört in die
   Anleitung; was zweimal vorkommt, gehört in die Software geändert.
1b. **Vor dem Shop-Start die Pflichten klären** (§ 4b) — Kosmetik-Einstufung,
   Verpackungsregister, Widerruf, Bestellknopf. Das ist kein Bau, das ist ein
   Termin.
2. **Der zweite Knopf am Marktplatz** — „Ich hätte gern so etwas für meinen
   Betrieb". Die Maschinerie steht (`einreichung.php` mit Warteschlange,
   Spam-Falle, Rate-Limit); es fehlt nur ein zweiter Anlass.
3. **Das Übersichtsblatt** (§ 6) — erst mit den Spalten, die schon Daten haben.
   Die Handspalten kommen dazu, wenn sie gebraucht werden.
4. **Das Studio für Partner-Seiten** (§ 5) — Zweitverwendung, kein Neubau. Der
   Punkt, an dem Klaus' Zeit pro Partner aufhört zu wachsen.
5. **Drift-Guard über die Partner-Apps** — bevor der vierte Partner dazukommt,
   nicht danach. Er deckt später auch die zwei Marktplatz-Instanzen ab.
5b. **Sicherung prüfen, bevor Geld fließt** (§ 4c) — bei Alis erledigt (PR #37).
   Bei jeder weiteren Partner-App vor dem ersten echten Geschäftsvorfall: Export
   vorhanden? Erinnerung sichtbar? `persist()` gesetzt?
5c. **Die Rohertrags-Zahl je Zeitraum berechnen und als Beleg an BLP geben**
   (§ 4d) — rechnen und buchen ja, auszahlen nein. Die Beschriftung der Zahl
   (Rechnung oder Gewinnanteil) wartet auf den Steuerberater-Termin.
6. **Die zwei auseinandergelaufenen Skills zusammenführen** (§ 7b) — klein,
   heute machbar, und es verhindert, dass zwei Sitzungen nach verschiedenen
   Regeln bauen. Dabei `menschlich-schreiben` und `seiten-bauregeln` in beide
   Repos legen; sie werden in beiden gebraucht.
7. **Der Klon für Fremde** (§ 3 ③, ausbuchstabiert in § 8b) — erst wenn 1–5
   stehen. Er braucht eigenen
   Namen, eigene Adresse, eigene DB-Kennung und die Vermittler-Pflichten aus
   § 13. Bis dahin ist er eine Entscheidung, kein Bau.

---

## 15. Offene Entscheidungen — nur Klaus

0. **Wer macht den Bezahlvorgang in Beauty's Shop?** (§ 4b) — die Empfehlung
   lautet: ein erprobter Anbieter, nicht Eigenbau. Das ist die dringendste
   Entscheidung, weil der Shop sonst darauf wartet.
0b. **Grundlage der Beteiligung: Umsatz, Rohertrag oder Gewinn?** (§ 4d) — die
   Empfehlung lautet Rohertrag; die Daten dafür liegen bereits vor.
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
6. **Name und Adresse des Klons** (§ 3 ③ / § 8b) — er darf nicht „Family
   Projekt" heißen, sonst vermischen sich Kreis und Öffentlichkeit in der
   Wahrnehmung. **Das ist der Punkt, an dem der Bau anfangen kann** — ohne
   Namen kein Repo, ohne Repo kein Anfang.
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
| Lager in IndexedDB, Shop-Inhalte in localStorage, `persist()` fehlte | `Alis-Moderaum/warehouse.html`, gelesen 2026-08-09 |
| Sicherungs-Erinnerung gebaut, 17/17 | `Alis-Moderaum/tests/smoke_backup_erinnerung.mjs`, PR #37 |
| „liest nur · schlägt vor · bewegt nichts" | `Privat-Brain/CLAUDE.md` |
| GoBD-Festschreibung, Storno statt Löschen, Hash-Kette | `BookLedgerPro/CLAUDE.md` § Goldene Regeln |
| Brücke `?uebernahme=<base64url(JSON)>` | `BookLedgerPro/docs/UEBERNAHME_TOMY.md`, `Mein-WorkFloh/CLAUDE.md` |
| `capVector`/`needsVector` nirgends vorhanden | Suche über `src/modules/*` + `docs/INTERFACES.md`, 2026-08-09 |

---

**Fortschreiben:** Wer einen Punkt entscheidet oder widerlegt, trägt es hier ein
(Datum + was jetzt gilt) und vermerkt es in `docs/PULS.md`. Dieses Papier bindet,
bis eine Messung oder eine Auskunft es widerlegt — genau das ist zwischen
Fassung 1 und Fassung 2 passiert.
