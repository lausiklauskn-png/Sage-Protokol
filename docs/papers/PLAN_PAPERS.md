# Plan für die kommenden Papers

**Stand: 2026-08-23.** Drei Themen, die Klaus in der nächsten Woche schreiben
will. Diese Datei ist das Gerüst dafür: was in jedes Paper gehört, was der Kern
der Aussage ist — und an welcher Stelle jedes einzelne **kippen** kann, wenn man
zu weit greift.

Zwei Papers liegen bereits als HTML in diesem Ordner (DE/EN) und beschreiben das
SBKIM-Protokoll. Die drei hier kommen daneben, nicht darüber.

---

## Der gemeinsame Rahmen

Alle drei gehören zu **einer** Beobachtung, und die sollte in jedem Paper im
ersten Absatz stehen, damit sie sich gegenseitig tragen statt nebeneinanderher zu
laufen:

> **Die Wirkung geht in beide Richtungen.** Der Mensch prägt die KI — über Regeln
> und über Grundsätze. Und die KI prägt den Menschen — über Gewöhnung,
> Erleichterung und Enttäuschung. Wer nur eine Richtung betrachtet, beschreibt
> die Hälfte.

Das ist dieselbe Figur wie die **bidirektionale Suche** im Protokoll: beide
Seiten fragen, beide antworten. Deshalb sind es drei Papers und nicht drei
Themen.

**Die Perspektive, die diese Arbeit von der übrigen Literatur trennt** — und die
in jedem Abstract stehen sollte: geschrieben nicht von jemandem, der KI
*untersucht*, sondern von jemandem, der **fünf Monate lang intensiv damit
gearbeitet** und dabei mitgeschrieben hat. Kein Laborzugang, sondern ein
Werkstattzugang. Das ist eine Schwäche (Fallzahl eins, nicht verblindet) **und**
eine Stärke (Dauer, Dichte, echte Aufgaben, echtes Geld) — und beides gehört
hingeschrieben.

---

## Paper A · Regelbasiertes und grundsatzbasiertes Lenken

> **✅ Fassung 1 geschrieben am 2026-08-23:**
> [`PAPER_A_regeln-und-grundsaetze.md`](PAPER_A_regeln-und-grundsaetze.md).
> Was unten steht, ist das Gerüst, nach dem es gebaut wurde — es bleibt stehen,
> damit die Folge-Papers dieselbe Disziplin bekommen.
>
> **Über das Gerüst hinaus dazugekommen:** ein Abschnitt zum Stand der Technik
> mit vier belegten Quellen (Kaplow 1992 · Schuett et al. 2024 · Bai et al. 2022 ·
> Rebedea et al. 2023), die Verortung in der Lücke zwischen ihnen — Grundsätze
> zur **Ausführungszeit**, gesetzt vom **Betreiber** —, die **Sättigungsgrenze**
> als Eigenschaft, die Regeln nicht haben, und der Versuchsaufbau: **drei Arme**
> (nur Regeln · nur Grundsätze · beides) mal **drei Aufgabenarten** (eigene Idee ·
> Vorlage · Bestehendes verbessern), beides Klaus' Vorschläge vom selben Tag.
> Erst die zweite Achse macht die Vorhersage scharf: der Vorteil der Grundsätze
> müsste mit der Vorhersehbarkeit des Falls **fallen**.

**Arbeitstitel:** *Regeln und Grundsätze: zwei Arten, ein KI-System zu lenken —
und warum keine allein genügt*

### Der Kern

- **Eine Regel** ist prüfbar und wird erzwungen. Sie deckt **genau den Fall ab,
  für den jemand sie geschrieben hat**.
- **Ein Grundsatz** ist eine **Frage an die konkrete Lage**. Er greift auch dort,
  wo niemand vorher hingesehen hat — dafür lässt er sich nicht erzwingen und
  nicht nachprüfen.
- Das Bild aus der Praxis: *der Unterschied zwischen dem, der sein eigenes Papier
  aufhebt, und dem, der auch das fremde aufhebt. Der Erste befolgt eine Regel.
  Der Zweite beantwortet eine Frage.*

### Der Aufbau, den es beweist

Zwei getrennte Kanäle im selben System: die Regeln stehen im **Code** (acht,
erzwungen, jede Rolle, jeder Lauf), die Grundsätze in einer **Markdown-Datei**
(höchstens sieben, derzeit fünf, ohne Programmierer änderbar). Material:
[`../werkstatt/`](../werkstatt/).

### ⚠ Die Stelle, an der dieses Paper kippen kann

Klaus' Formulierung war *„warum Grundsätze tatsächlich besser sind als Regeln"*.
**So darf der Titel nicht lauten**, und zwar aus einem Grund, der aus dem eigenen
Material kommt:

Der Grundsatz-Weg **hat auch versagt**. Am 2026-08-20 stand im Bericht *„Sten hat
den Code durchlaufen lassen"* — was nicht geschehen war und nicht geschehen
konnte. Es gibt dazu eine ausdrückliche Regel, und sie ist trotzdem nur ein
**Dämpfer, kein Riegel**.

**Die tragfähige These ist die dritte, die Klaus selbst genannt hat:** *warum
beides nicht getrennt voneinander betrachtet werden kann.* Also:

| ❌ so nicht | ✅ so |
|---|---|
| „Grundsätze sind besser als Regeln" | „Regeln und Grundsätze leisten Verschiedenes — und keins von beidem genügt allein" |
| „Grundsätze verhindern Fehler" | „Regeln greifen im vorhergesehenen Fall, Grundsätze im unvorhergesehenen — beide haben eine Grenze, und die Grenzen liegen woanders" |

**„Besser" ist eine Behauptung, die eine Messung braucht** — und die gibt es
nicht (keine Kontrollgruppe, kein Maß). Ein Gutachter sieht das im ersten Absatz.
**„Verschieden und aufeinander angewiesen" ist dagegen belegt** — an einem Aufbau,
der beides getrennt führt und bei dem beides einmal versagt hat.

### Gliederung

1. Die Ausgangsfrage: was lässt sich erzwingen, was muss man fragen?
2. Stand der Technik: Systemprompts, Guardrails, Constitutional-Ansätze,
   Policy-Engines — **und wo die Grenze zwischen „Regel" und „Grundsatz" dort
   verschwimmt**
3. Der Aufbau: zwei Kanäle, getrennt geführt
4. Beobachtungen — die drei aus [`../werkstatt/BEFUND.md`](../werkstatt/BEFUND.md)
5. **Wo beide versagen** — und warum das der interessante Teil ist
6. Was es bräuchte, um daraus eine Messung zu machen (A/B, Maß, fremde Beurteilung)
7. Grenzen, ausdrücklich

---

## Paper B · Wie KI auf den Menschen wirkt

**Arbeitstitel:** *Fünf Monate täglicher KI-Nutzung: eine Selbstbeobachtung mit
Protokoll*

### Der Kern

Klaus' eigene Worte, und sie sind die Stärke des Papers: *„Ich konnte es
persönlich am eigenen Leib spüren und testen, wie sich das Ganze positiv
auswirkt, aber auch negative Einflüsse haben kann, wenn man nicht bewusst
gegensteuert."*

Die Wirkungen, die zu beschreiben sind — **beide Richtungen, nicht nur die
Warnung**:

| Was zunimmt | Was abnimmt oder kippt |
|---|---|
| Reichweite: Dinge werden möglich, die allein nicht möglich waren | **Gewöhnung** — die Verfügbarkeit rund um die Uhr, ohne Ermüden, ohne Nein |
| Tempo: aus Wochen werden Tage | **Übervertrauen** — eine flüssige Antwort wirkt richtiger als eine zögernde |
| Mut: man traut sich an Größeres | **Verlernen** — was man abgibt, kann man nach einer Weile nicht mehr selbst |
| Gesellschaft: ein Gegenüber, das zuhört | **Vermenschlichung** — man behandelt es wie ein Gegenüber, weil es antwortet wie eines |

### Was dieses Paper von der übrigen Literatur unterscheidet

Es gibt Forschung zu Bildschirmzeit, Spielen und sozialen Netzen. Zu
**KI-Assistenten im Alltag** gibt es fast nichts, und was es gibt, fragt Menschen
**hinterher**, wie viel sie genutzt haben.

**Hier liegt ein mitlaufendes Protokoll vor:** Fahrtenbuch mit Zeiten, Belege,
Sitzungsprotokolle mit Datum, `docs/LEHREN.md`. Das ist eine Selbstbeobachtung
über fünf Monate mit **Daten statt Erinnerung**. Genau daran scheitern die
meisten Arbeiten in diesem Feld.

### ⚠ Die Stellen, an denen dieses Paper kippen kann

1. **Die Bezeichnung „Psychologe" ist geschützt** (§ 5 UWG, akademische Grade
   zusätzlich § 132a StGB). Erlaubt und richtig: *„psychologische Aspekte",
   „Selbstbeobachtung", „Feldbeobachtung", „Erfahrungsbericht"*. Nicht: eine
   Fachlichkeit andeuten, die nicht da ist.
2. **Keine Diagnosen, keine Ratschläge zur Gesundheit.** Sobald ein Text nahelegt,
   er könne seelische Beschwerden einordnen oder behandeln, gilt das
   Heilpraktikergesetz.
3. **Keine Zahlen ohne Messung.** „Ich hatte den Eindruck" ist in einer
   Selbstbeobachtung ein zulässiger Satz. „In 30 % der Fälle" wäre es nicht.
4. **Kein PII.** Das gilt auch für die eigenen Belege — die Zahlen aus der
   Buchhaltung gehören nicht ins Paper.

---

## Paper C · KI-Kompetenz im täglichen Gebrauch

**Arbeitstitel:** *Was man können muss, um mit KI zu arbeiten — Erfolg, Misserfolg
und das bewusste Gegensteuern*

### Der Kern

Klaus' Punkt: es gehört zur Kompetenz, **mit Erfolg umzugehen und mit Misserfolg**.
Und: *„wie man denkt, wie man Fragen beantwortet, wie man Probleme löst, verändert
sich in der Arbeit mit KI."*

Das ist der **anwendbare** der drei Texte — und der, der am ehesten zu einem
Institutszweck, zu einem Vortrag und zu einer Förderung durch
Medienkompetenz-Töpfe passt.

Was hineingehört, jeweils mit einem Beispiel aus der eigenen Arbeit:

1. **Prüfen statt glauben.** Eine flüssige Antwort ist kein Beleg. Aus der Praxis:
   *eine Prüfung, die dir recht gibt, ist der Ort, an dem du am genauesten
   hinsehen musst.*
2. **Mit Misserfolg umgehen.** Was tun, wenn dieselbe Sache dreimal nicht geht?
   Wann ist es der eigene Denkfehler, wann eine Grenze des Werkzeugs?
3. **Grenzen kennen statt neu entdecken.** Aus der Praxis teuer bezahlt: *eine
   Grenze, die man kennt, kostet eine Zeile; eine, die man jedes Mal neu
   entdeckt, kostet eine Stunde.*
4. **Gegensteuern.** Bewusst Dinge selbst machen, die man abgeben könnte.
5. **Die eigene Denkveränderung bemerken.** Der schwierigste Punkt, weil man
   dafür einen Vergleich zu sich selbst von vorher braucht.

### ⚠ Wo dieses Paper kippen kann

Es darf **kein Ratgeber mit Versprechen** werden („in fünf Schritten zum
KI-Profi"). Der Wert liegt darin, dass hier jemand schreibt, der **kein
Programmierer ist** und es trotzdem zum Laufen gebracht hat — und der die
Fehlschläge mit Datum nennt. Ohne die Fehlschläge ist es Werbung.

---

## Die Reihenfolge — und warum

| | Was | Warum in dieser Reihenfolge |
|---|---|---|
| **1** | Die **zwei vorhandenen** Papers auf Zenodo → DOI | zitierfähig werden geht allem voran, und es kostet zwei Stunden |
| **2** | **Paper A** | das Material liegt fertig in [`../werkstatt/`](../werkstatt/) — am schnellsten schreibbar |
| **3** | **Paper C** | anwendbar, gut für Vorträge und Medienkompetenz-Töpfe |
| **4** | **Paper B** | am heikelsten, und am meisten von einem methodischen Partner abhängig |

**Jedes einzeln auf Zenodo, mit eigenem DOI.** Drei zitierbare Arbeiten wiegen
mehr als eine lange, und sie lassen sich getrennt weiterentwickeln.

## Zwei Regeln für alle drei

**Grenzen gehören in den Text, nicht in eine Fußnote.** Fallzahl eins, nicht
verblindet, kein Maß, Modellwechsel nicht kontrolliert. Wer das selbst schreibt,
wirkt gründlich; wer es weglässt und dabei ertappt wird, wirkt unseriös — und
zwar rückwirkend für alles andere.

**Nichts behaupten, was nicht dasteht.** Eine geratene Zahl klingt genau wie eine
gemessene.
