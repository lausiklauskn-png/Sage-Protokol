# Die Schritte, in der Reihenfolge, in der sie zu tun sind

**Stand 2026-08-26.** Diese Liste ist der Auszug aus
[`docs/FORSCHUNGSFOERDERUNG.md`](../FORSCHUNGSFOERDERUNG.md) § 7, sortiert
danach, **was worauf wartet**. Der lange Text erklärt das Warum; hier steht die
Reihenfolge.

> **Warum überhaupt eine zweite Liste.** Der Fahrplan hat 1.403 Zeilen. Wer
> darin nach dem nächsten Handgriff sucht, findet eine Begründung. Diese Liste
> hat den umgekehrten Zweck: sie sagt, was jetzt dran ist, und verweist für das
> Warum zurück.

---

## Die Kette, an der alles hängt

Drei Schritte sperren einander, und zwar in dieser Richtung:

```
ELSTER-Zertifikat  ──►  Fragebogen zur steuerlichen Erfassung  ──►  Steuernummer
   (Brief, Tage)              (nach dem Steuerberater)              (öffnet Weg 1 und Weg 2)
```

**Das Zertifikat ist der Engpass, nicht der Fragebogen.** Es kommt per Brief,
also dauert es Tage, in denen nichts geht. Wer es zuletzt beantragt, wartet
zuletzt.

**Der Steuerberater gehört davor, nicht danach.** Im Fragebogen beschreibt man
die Tätigkeit, und **das Finanzamt entscheidet daraufhin**, ob es sie als
freiberuflich oder gewerblich einordnet. Diese Beschreibung will man nicht raten.

---

## Jetzt, diese Woche

Diese vier kosten zusammen keine zwei Stunden und machen alles Weitere möglich.

| | Schritt | warum jetzt | Dauer |
|---|---|---|---|
| **1** | **ELSTER-Zertifikat beantragen** · <https://www.elster.de> | der Brief ist der Engpass, alles Weitere wartet darauf | 10 Min beantragen, dann Tage warten |
| **2** | **Steuerberater-Termin ausmachen** | er muss **vor** dem Fragebogen stattfinden; die Fragen liegen als eigenes Blatt bereit | 5 Min anrufen |
| **3** | **In den eigenen Arbeitsvertrag sehen** | Nebentätigkeit anzeigepflichtig? genehmigungspflichtig? Wettbewerbsklausel? Betrifft **alle vier Wege** | 10 Min |
| **4** | **Stundenaufzeichnung beginnen** | der einzige Punkt **ohne Vorlaufzeit**, und er verliert mit jedem Tag, an dem er nicht läuft | ab sofort, täglich 2 Min |

> **Punkt 4 ist der, der still Geld kostet.** Wenn der Steuerberater grünes
> Licht für die Forschungszulage gibt, ist jede nicht aufgezeichnete Stunde
> verlorenes Geld. Er hängt an keiner Antwort und an keiner Frist.
>
> Für die **zurückliegenden** 128 Tage liegt der Nachweis vor, aus den
> Zeitstempeln der Quelltext-Verwaltung: `historie/arbeitstage.pdf`. Für alles
> ab heute braucht es die Aufzeichnung von Hand.

**Dazu, ohne Abhängigkeit von irgendetwas:**

- **ORCID anlegen** · <https://orcid.org/register>. Fünf Minuten, kostenlos,
  ohne Institution. Ab da bist du in der Wissenschaftswelt identifizierbar.
- **Fristen selbst nachsehen.** Prototype Fund, 01.10. bis 30.11.2026. **Nicht
  dem Fahrplan glauben**, er ist vom 23.08.2026.

---

## Sobald das Zertifikat da ist

| | Schritt | hängt an |
|---|---|---|
| **5** | **Fragebogen zur steuerlichen Erfassung** über ELSTER | Zertifikat **und** Steuerberater-Gespräch |
| **6** | Falls das Gespräch „gewerblich" ergibt: **Gewerbeanzeige** · <https://serviceportal.hamburg.de/HamburgGateway/Service/Entry/GWR> | Ergebnis aus 5 |

Vorbereitung dazu: das Blatt **„Vorbereitung Finanzamt"** in dieser Mappe.

**Bei „gewerblich" ändert sich die Reihenfolge nicht.** Das Gewerbeamt meldet
zwar ans Finanzamt, der Fragebogen ist trotzdem **innerhalb eines Monats**
über ELSTER fällig. Kosten in Hamburg: 20 €.

---

## September, die Vorleistungs-Mappe

Diese hängen an keiner Behörde. Sie können parallel zum Warten laufen.

| | Schritt | Wirkung |
|---|---|---|
| **7** | **Papers auf Zenodo** → DOI | bestes Verhältnis von Aufwand zu Wirkung auf der ganzen Liste: zitierfähige Nummer und beweisbarer Zeitstempel |
| **8** | ~~Blatt „Stand der Technik und Abgrenzung"~~ **erledigt am 2026-08-26**, `docs/ABGRENZUNG.md`, Abteilung 2 der Antragsmappe | offen bleibt die Literatursuche, siehe § 6 darin |
| **9** | **Vorleistung in Zahlen** | liegt zum Teil vor: 128 Tage, 5.775 Einträge von Hand, 33 Depots |
| **10** | ~~Lizenz-Lücken schließen~~ **erledigt**, siehe Kasten unten | das Depot, mit dem beantragt wird, trägt MIT |
| **11** | **Englische Projektseite**, eine Seite | Grundlage für den OTF-Antrag |
| **12** | **Erste Hochschul-Mail**, **eine** Hochschule, nicht zwanzig | Briefentwurf im Fahrplan § 6.2 |
| **13** | **Hamburg: drei kostenlose Türen** (Handelskammer, hei., Kreativ Gesellschaft) | Landesprogramme stehen in keiner Bundesübersicht |
| **14** | **InnoFounder-Vorgespräch** | 2.500 €/Monat, kein Abschluss verlangt, keine Hochschule dazwischen |

> **Punkt 10 ist erledigt, und der Fahrplan sagte bis zum 2026-08-24 etwas
> anderes.** Er verlangte Lizenz-Dateien für `BookLedgerPro` und
> `Meine-In-and-Out-Book`. Nachgemessen: `BookLedgerPro` trägt seit dem
> 2026-08-16 eine Lizenz, im Container lag nur ein veralteter Klon.
> `Meine-In-and-Out-Book` ist ein leeres Depot ohne einen einzigen Commit.
> **Entscheidend ist ohnehin nur, dass das Depot, mit dem beantragt wird, eine
> anerkannte freie Lizenz trägt.** `Sage-Protokol` trägt MIT.

> **Punkt 7 hat kein Risiko.** Eine Zenodo-Fassung bleibt unverändert stehen,
> spätere bekommen einen eigenen DOI und werden mit der alten verknüpft. Man
> legt sich nichts fest, was man später bereut.
>
> **Aber eine Sache gehört davor geklärt** (siehe „Was noch fehlt" in der
> Übersicht): der Werkzeug-Widerspruch in Paper A. Eine Zenodo-Fassung bleibt
> stehen, auch die mit dem Widerspruch darin.

---

## Oktober und November, der Antrag

| | Schritt | |
|---|---|---|
| **15** | **Vorhaben scharf abgrenzen** | sechs Monate, **ein** Ziel, nachprüfbar. Nicht „das Mycel weiterbauen" |
| **16** | **Prototype-Fund-Antrag schreiben** | das Formular ist kurz, genau deshalb ist jeder Satz wichtig |
| **17** | **Abschicken, spätestens Mitte November** | nicht am letzten Tag |
| **18** | **OTF-Concept-Note** parallel | der OTF hat keine Frist; kostet nur die Übersetzung dessen, was für 16 ohnehin entsteht |

---

## Läuft nebenher, an keiner Frist

- **BSFZ-Antrag für die Forschungszulage**, sobald der Steuerberater grünes
  Licht gibt. Dieser Weg hängt an **keiner** Ausschreibung.
- **EXIST prüfen**, nur wenn die Abschluss-Bedingung erfüllbar ist. Erster
  Schritt ist ein kostenloses Gespräch beim Gründungsservice.
- **Eine Krankenkasse auf § 20k SGB V ansprechen.** Nicht die Hotline, das
  Präventions-Referat. Kostet einen Anruf.

---

## Im Dezember, und nur dann

Die Institutsfrage. **Bewusst vertagt, nicht aus Versehen.** Das Institut ist
eine gute Idee, aber es darf den Antrag nicht aufhalten. Wieder aufnehmen, wenn
der Antrag draußen ist.

Und wenn es soweit ist: **kein „Psychologie" im Namen**, und den Namen vorab bei
IHK und Registergericht prüfen lassen, bevor irgendwo „Institut" auf einer Seite
steht.
