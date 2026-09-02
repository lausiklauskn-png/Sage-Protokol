# Abschlussbrief · Stand 2026-08-26

**Was in den Sitzungen vom 23. bis 26. August entstanden ist, wo es liegt, und
was daraus für den Antrag folgt.**

> Dies ist der erste Brief unter diesem Namen. Er löst
> [`BRIEF_nach_historie_und_gelber_runde.md`](BRIEF_nach_historie_und_gelber_runde.md)
> ab, dessen Lage-Beschreibung vom 24.08. inzwischen überholt ist. Der
> Arbeitsauftrag für die nächste Sitzung steht in
> [`BRIEF_lueckenlose_dokumentation.md`](BRIEF_lueckenlose_dokumentation.md).

---

## 1 · Was jetzt vorliegt

| | Unterlage | Wo | Zeitraum |
|---|---|---|---|
| **1** | Fahrplan Forschungsgelder | der Fahrplan, 1.403 Zeilen | Stand 24.08. |
| **1b** | Die Schritte, abhakbar | `docs/unterlagen/01_SCHRITTE.md` | 26.08. |
| **2** | Fragen-Blatt | das Fragen-Blatt, das Fragen-Blatt | 24.08. |
| **3** | Vorbereitung für die Behörde | das Behörden-Blatt | 26.08. |
| **4** | Arbeitszeit-Nachweis, Tag für Tag | `docs/historie/arbeitstage.*`, 301 Seiten | 10.03. bis 24.08. |
| **5** | Forschungsunterlagen inkl. Paper A | die Arbeits-Mappe, Abteilung 2 | 24.08. |
| **6** | Historie der Zusammenarbeit | `docs/historie/historie.html`, 7,8 MB | 10.03. bis 24.08. |

Dazu zwei Mappen, in denen jede Abteilung **einzeln herunterzuladen und einzeln
zu drucken** ist: `antragsmappe.html` für die Behörde, `unterlagen.html` für den
Weg dorthin.

## 2 · Die Zahlen, auf die sich alles stützt

| | |
|---|---|
| Arbeitstage | **128**, 10.03. bis 24.08.2026 |
| Commits · Depots · Zweige | 5.823 · 33 · 1.388 |
| Spanne, aufsummiert | **1.935,9 h** |
| aktive Zeit, ohne Pausen | **1.186,6 h** |
| Zeilen dazu · entfernt | 1.852.315 · 292.930 |
| Commits, die nie auf `main` lagen | 1.662, die Sackgassen |
| Belege | 75 Rechnungen, 13.03. bis 04.08. |

Der **22.08. war Samstag**: gemessene Spanne 19,9 Stunden, von Klaus unabhängig
davon mit „zwanzig Stunden" angegeben. Der einzige Tag mit einer unabhängigen
Angabe, und sie stimmt überein.

## 3 · Was in diesen vier Tagen sonst geschah

**Paper A** hat eine Zusammenfassung ohne Prozentzahlen und Cent-Beträge
bekommen, mit einem Absatz davor, der das Werkzeug einführt und den Satz trägt:
die Dokumentation reicht über fünf Monate, die Messung über Tage.

**613 Gedankenstriche** sind aufgelöst. Zwei Ausnahmen bleiben und sind keine
Nachsicht: die Byte-Kopien aus Kimhub tragen Prüfsummen, und ein wörtliches
Zitat folgt seiner Quelle.

**Klaus' 100 Markierungen** sind abgearbeitet. Sechzehn rote gestrichen, vierzig
gelbe abgewogen, **nichts davon gestrichen**. Das ist kein Ausweichen vor der
Abwägung, sondern ihr Ergebnis unter seiner Regel „im Zweifel bleiben".

**Ein Widerspruch im Fahrplan** ist geheilt: Schritt B4 verlangte Lizenz-Dateien
für zwei Depots, § 4 derselben Datei hatte längst nachgemessen, dass die eine
existiert und das andere Depot leer ist. § 4 war gemessen, B4 abgeschrieben.

## 4 · Was diese Tage über die Arbeitsweise gelehrt haben

**Zweimal in drei Tagen lief eine Sitzung parallel.** Beim ersten Mal berührten
sie verschiedene Dateien, beim zweiten bauten beide dasselbe. Beide Male
gemerkt beim Push, nicht davor.

> Eine Zahl aus `git diff --stat` gegen `origin/main` ist keine Formalie am
> Ende. Sie ist die einzige Stelle, an der eine Parallel-Sitzung überhaupt
> sichtbar wird.

**Die Doppelung ist die Drift-Quelle, nicht der Widerspruch.** Zwei
Blätter zur selben Auskunft hätten einander nicht widersprochen, sie wären nur zwei
gewesen. Eines ist gelöscht, und zwar das eigene.

**Ein Wächter wird an fremdem Text erwachsen.** Das eigene Material trifft die
eigenen Annahmen nie. Der Text der Nachbarsitzung hat einen Messfehler
aufgedeckt, der seit Wochen darin steckte.

**Eine abgebrochene Gegenprobe lässt ihre Sabotage stehen.** Und zwei
nebeneinander laufende verderben einander die Ausgangslage.

## 5 · Was gemessen ist und was nicht

```
node tests/run_alle.mjs                 90 grün, 0 rot, 0 nicht lauffähig
fünf Gegenproben                        14 + 32 + 9 + 16 + 9, alle vollständig
Gedankenstriche in den neuen Texten      0
docs/PULS.md                             2.833 Zeilen von 3.000
```

**Nicht gemessen:** Klaus' Sichttest am Tablet, für keine der neuen Unterlagen.
Headless beweist die Logik, nicht wie es sich am Gerät anfühlt.

## 6 · Was jetzt drängt

1. **Ein Behörden-Schritt mit Vorlaufzeit.** Zehn Minuten beantragen, dann kommt ein Brief.
   Solange er nicht da ist, geht es nicht weiter, und ohne ihn
   sind Weg 1 und Weg 2 beide zu.
2. **Der der Termin, der Klaus’ Sache ist**, mit dem Frageblatt. Er gehört **vor** den
   Fragebogen, weil das Finanzamt anhand der Tätigkeitsbeschreibung entscheidet.
3. **Die Stundenaufzeichnung**, ab sofort. Der einzige Punkt ohne Vorlaufzeit.
4. **Der Werkzeug-Widerspruch in Paper A.** Klaus' Entscheidung, und sie gehört
   **vor** die Zenodo-Nummer: eine Zenodo-Fassung bleibt stehen.

## 7 · Was fehlt, ehrlich

| | Stand |
|---|---|
| Blatt „Stand der Technik und Abgrenzung" | **existiert nicht.** Wer die Untersuchung liest, braucht es zuerst |
| Englische Projektseite | **existiert nicht.** Grundlage für die englischsprachige Fassung |
| Paper B und C | geplant, nicht geschrieben. Für den Antrag reicht A |
| Zenodo-Nummer | offen, hängt am Werkzeug-Widerspruch |
| Drei der fünf persönlichen Angaben | offen (Abschluss, Institutsform, Stunden je Woche) |

**Und die Lücke, die dieser Brief zuletzt gefunden hat:** von 5.823 Commits
liegen **551 aus dem April ohne ein einziges Sitzungs-Protokoll** da. Die
Protokoll-Dichte fällt, während die Arbeit steigt. Das ist der Auftrag des
nächsten Briefes.
