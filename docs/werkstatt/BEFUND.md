# Befund — was die Werkstatt zeigt, und was sie nicht zeigt

**Stand: 2026-08-23.** Dieser Text gehört zum
[Forschungskorpus](../FORSCHUNGSKORPUS.md). Er hält fest, **was an der
Regel-/Grundsatz-Trennung beobachtet wurde** — und, ebenso ausdrücklich, was
daraus **nicht** folgt.

> **Warum die zweite Hälfte hier so viel Platz bekommt.** Wer einen Befund
> vorlegt, ohne seine Grenzen zu nennen, zwingt jeden Leser, sie selbst zu
> suchen — und wer sie findet, misstraut danach auch dem Rest. Eine benannte
> Lücke ist Arbeit, eine verschwiegene ist Schaden.

---

## 1 · Der Aufbau

Fünf Rollen mit Namen bearbeiten einen Auftrag: **Nora** schlägt vor, **Emil**
baut, **Vera** prüft, **Sten** sucht Fehler, **Jonas** schreibt auf, wo es steht.
Jede Rolle bekommt Text und gibt geprüftes JSON zurück. **Die Rollen haben keine
Werkzeuge** — sie können nichts ausführen, nichts öffnen, nichts messen.

Gesteuert werden sie über **zwei getrennte Kanäle**:

| | **Regeln** | **Grundsätze** |
|---|---|---|
| wo | im Code (`schicht/rollen.mjs`) | in einer Markdown-Datei |
| prüfbar | ja | nein |
| Wirkung | erzwungen, jede Rolle, jeder Lauf | lenken die Aufmerksamkeit |
| änderbar von | wer Code anfasst | jedem, ohne Programmierer |
| Anzahl | sechs | höchstens sieben, derzeit fünf |

Die Trennung ist **absichtlich** und war die Ausgangsfrage: *Was lässt sich
erzwingen, was muss man stattdessen fragen?*

## 2 · Die Beobachtung, um die es geht

**Eine Regel deckt genau den Fall ab, für den jemand sie geschrieben hat.**
Ein Grundsatz ist eine **Frage an die konkrete Lage** — und greift deshalb auch
dort, wo niemand vorher hingesehen hat.

Das Bild aus der Datei selbst: *der Unterschied zwischen dem, der sein eigenes
Papier aufhebt, und dem, der auch das fremde aufhebt. Der Erste befolgt eine
Regel. Der Zweite beantwortet eine Frage.*

Drei Dinge, die sich beim Bauen gezeigt haben:

**a · Regeln greifen zuverlässig, wo der Fall vorhergesehen war.** Kein Lauf hat
je einen Schlüssel oder eine fremde Adresse ausgegeben. Das sind Fälle, die sich
formulieren lassen.

**b · Regeln versagen dort, wo die Prüfung selbst unmöglich ist.** Die Regel
*„Du hast keine Werkzeuge — schreib nie, du habest etwas ausgeführt"* wurde
trotzdem verletzt: am 2026-08-20 stand im Bericht *„Sten hat den Code durchlaufen
lassen."* Das konnte nicht geschehen sein. Die Regel steht seitdem samt Vorfall
im Wortlaut da — und ist trotzdem ein **Dämpfer, kein Riegel**. Text lässt sich
nicht gegen die Wirklichkeit prüfen.

**c · Die härteste Grenze liegt woanders, und sie war nicht geplant.** Die Rollen
sehen das Depot nicht. Sie schlagen deshalb regelmäßig Dinge vor, **die es schon
gibt**. Kein Grundsatz und keine Regel behebt das — es fehlt kein Wille, sondern
Zugang. Daraus ist ein eigener Weg entstanden: dieselben fünf Rollen in einer
Sitzung **mit** Repo-Zugriff (Kimhubs Skill `konferenz`).

> **Und dieser Weg hat seine eigene, benannte Schwäche:** fünf Rollen in einem
> Kopf sind nicht fünf Meinungen. Das steht in Kimhubs Verfassung ausdrücklich
> als Zwischenschritt markiert, nicht als Lösung.

## 3 · Was hier NICHT bewiesen ist

Diese Liste ist der wichtigere Teil des Dokuments.

- **Es gibt keine Kontrollgruppe.** Es wurde nie ein Lauf *ohne* Grundsätze gegen
  einen *mit* Grundsätzen gestellt. Der Aufbau könnte es (die Ladefunktion meldet
  ausdrücklich, wenn die Datei fehlt, statt still weiterzulaufen) — getan wurde
  es nicht.
- **Es gibt kein Maß.** „Die Arbeit sieht anders aus" ist kein Ergebnis, solange
  niemand gesagt hat, woran man *anders* erkennt.
- **Die Fallzahl ist eins.** Ein Betreiber, ein Netz, ein Aufgabenzuschnitt.
  Nichts davon ist übertragbar, solange es niemand übertragen hat.
- **Die Beobachtungen sind nicht verblindet.** Derselbe Mensch hat die Grundsätze
  geschrieben, die Läufe ausgelöst und die Ergebnisse beurteilt.
- **Ein Teil der Belege sind Trockenläufe.** Der hinterlegte Beispiel-Lauf trägt
  `"art": "trocken"` — seine Kosten sind gerechnet, nicht bezahlt.
- **Modellwechsel sind nicht kontrolliert.** Über den Beobachtungszeitraum haben
  sich die verwendeten Modelle geändert. Was davon Grundsatz-Wirkung ist und was
  Modell-Wirkung, ist **nicht getrennt** — und mit diesem Aufbau nicht trennbar.

**Was daraus folgt:** Das hier ist eine **Feldbeobachtung mit Protokoll**, keine
Studie. Es ist als Ausgangspunkt brauchbar und als Beleg nicht. Der Unterschied
gehört genannt, bevor jemand ihn selbst bemerkt.

## 4 · Was es bräuchte, um daraus eine Untersuchung zu machen

In der Reihenfolge, in der es sinnvoll wäre:

1. **Ein Maß.** Woran soll sich der Unterschied zeigen? Vorschläge, die der
   Aufbau schon hergäbe: Anteil der Vorschläge, die etwas bereits Vorhandenes
   wiederholen · Anteil der Behauptungen ohne Beleg · Anteil der Übergaben, die
   dem Nächsten Nacharbeit machen.
2. **Ein A/B-Lauf.** Derselbe Auftrag, einmal mit und einmal ohne Grundsätze,
   dasselbe Modell, dieselbe Fassung, mehrfach.
3. **Eine fremde Beurteilung.** Jemand, der die Grundsätze nicht geschrieben hat,
   bewertet die Ausgaben, ohne zu wissen, welche aus welcher Bedingung stammt.
4. **Ein methodischer Partner.** Die Punkte 1 bis 3 sind Handwerk, das an
   Hochschulen gelehrt wird und hier nicht vorhanden ist. Das ist keine
   Bescheidenheit, sondern die genaue Beschreibung der Lücke.

## 5 · Wo das Original liegt

Der lebende Stand steht in **[Kimhub](https://github.com/lausiklauskn-png/Kimhub)**
— dort laufen die Schichten, dort werden die Grundsätze gepflegt, dort liegen die
Proben mit ihren Gegenproben.

**Kimhub selbst ist nicht Teil des offenen Korpus.** Grund: seine Git-Historie
trägt Klaus' Rechnungsdaten aus der Zeit, bevor sie am 2026-08-22 aus dem
Arbeitsbaum genommen wurden — `git rm` entfernt nicht aus der Vergangenheit. Eine
offene Lizenz ist eine Einladung zum Forken, und ein Fork nimmt die Historie mit.
Deshalb liegt hier der **Forschungsteil als Momentaufnahme**, und das Depot bleibt
privat.

| Datei hier | Herkunft | Art |
|---|---|---|
| [`grundsaetze.md`](grundsaetze.md) | `Kimhub:schicht/grundsaetze.md` | **byte-gleiche Kopie** |
| [`WERKSTATTREGELN.md`](WERKSTATTREGELN.md) | `Kimhub:schicht/rollen.mjs` | **Auszug**, kein Byte-Kopie |
| dieses Dokument | — | hier geschrieben |

**Die Prüfsummen stehen in [`README.md`](README.md).** Wer wissen will, ob die
Kopie noch stimmt, vergleicht sie — eine Momentaufnahme ohne Prüfsumme läuft
still vom Original weg.
