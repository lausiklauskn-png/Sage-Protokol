# PULS-Auslagerung vom 2026-09-11 — zwei Sitzungen im vollen Wortlaut

**Warum diese Datei existiert.** `docs/PULS.md` stand am 2026-09-11 bei **exakt
3.000 von 3.000 Zeilen**. Die Schutz-Klausel im Kopf der Datei verlangt
**auslagern statt kürzen** und verbietet ausdrücklich, die Grenze
herabzusetzen. Hier stehen die beiden ältesten Einträge des oberen Blocks
**unverändert, Zeichen für Zeichen** — gekürzt wurde nichts.

**Was ausgelagert wurde:**

| Sitzung | Thema |
|---|---|
| 2026-09-07 (Brief aus Kimhub) | NETZWEIT § 3a — ein Cache-Bump ist kein „+1" |
| 2026-09-04 (Bau) | Paper A englisch gegengelesen — 19 Funde, nichts geändert |

**Der Dateiname trägt das Datum der Auslagerung, nicht das der Einträge.** Am
2026-09-10 ist beim Auslagern eine vorhandene Archiv-Datei mit 228 Zeilen
überschrieben worden, weil ihr Name aus dem Datum der Einträge gebildet war und
deshalb schon vergeben. Gefangen hat es `git status`, zurückgeholt
`git checkout --`. **Ein Archiv, das sich selbst überschreiben kann, ist keins.**
Vor dem Schreiben dieser Datei wurde mit `ls` nachgesehen.

---

## Stand 2026-09-07 (Brief aus Kimhub) · NETZWEIT § 3a — ein Cache-Bump ist kein „+1"

**Rolle:** Fremd-Sitzung aus **Kimhub**, mit einer netzweiten Tafel-Ergänzung.
Kein Modul-Code angefasst, kein `status.json`, keine Spec.

**Was getan.** `docs/NETZWEIT.md` bekommt **§ 3a**, direkt hinter § 3 — dort
gehört es hin, weil es derselbe Kern ist: *eine Zahl aus der eigenen Kopie ist
eine Aussage über die eigene Kopie.*

**Der Anlass, gemessen am 2026-09-07 in `kim-hub-company`:** zwei Sitzungen
arbeiteten am selben Tag am selben Depot. Beide sahen `v25`, beide setzten
`v26`, beide hatten recht — und der Inhalt war ein anderer. Die zweite Fassung
wäre für jeden Browser, der die App dazwischen geöffnet hatte, **dieselbe**
gewesen: der Vorrat hält sich an den Namen, nicht an den Inhalt. Aufgefallen ist
es beim Zusammenführen, nicht durch eine Probe — **eine doppelt vergebene Nummer
wirft keinen Fehler, und keine Probe fällt um.**

Die Regel „wer eine Datei aus dem Vorrat ändert, erhöht `CACHE_VERSION`" steht
in fast jedem Repo und ist richtig. Sie sagt nur **dass** hochgezählt wird,
nicht **wogegen**. § 3a ergänzt das Wogegen: gegen `origin/main`, nicht gegen
die eigene Datei.

**Was offen ist.** Die Repo-Verfassungen tragen die Cache-Regel weiterhin
einzeln; keine verweist bisher auf § 3a. Das ist kein Widerspruch (§ 3a
ergänzt, es ersetzt nichts), aber wer die Repo-Regel liest, findet die
Ergänzung nicht von allein. **In Kimhub konnte ich den Verweis nicht mehr
setzen** — dort lief zu diesem Zeitpunkt ein voller Gegenprobe-Lauf, und am
Arbeitsbaum zu bauen hätte ihn entwertet.

**Nächster sinnvoller Schritt.** Beim nächsten Anfassen einer Repo-Verfassung
den Verweis auf § 3a nachziehen, statt dafür 21 Depots aufzumachen — dieselbe
Zurückhaltung, aus der NETZWEIT.md überhaupt entstanden ist.

**Proben:** `npm test` — **92 grün, 0 rot, 0 nicht lauffähig.**

---

## Stand 2026-09-04 (Bau) · 🔍 Paper A englisch gegengelesen — 19 Funde, nichts geändert

**Übergabeprotokoll:** [`sessions/archiv/2026-09-04_paper-a-englisch-gegengelesen.md`](sessions/archiv/2026-09-04_paper-a-englisch-gegengelesen.md)
**Fundliste:** [`papers/GEGENLESEN_EN_2026-09-04.md`](papers/GEGENLESEN_EN_2026-09-04.md)

**Rolle:** Bausitzung. Auftrag: die englische Fassung von Paper A gegen die
deutsche lesen. Sie war von niemandem außer der Sitzung vom 2026-09-03 gesehen
worden und trägt bereits den DOI 10.5281/zenodo.22286072.

**An den beiden Paper-Dateien wurde nichts geändert.** Das war die Vorgabe: eine
Änderung an einer veröffentlichten Datei ist bei Zenodo eine neue Version, und
das entscheidet Klaus.

### Gemessen

| | |
|---|---|
| DE / EN | **1.834** / **1.775** Zeilen |
| Überschriften | **90 : 90**, gleiche Reihenfolge, 0 Abweichung |
| Abschnitte mit abweichender Absatz-Blockzahl | **0 von 90** |
| Tabellenzeilen und Listenpunkte je Abschnitt | in allen 90 gleich |
| interne Querverweise | **25 verschiedene**, jeder gleich oft |
| ISO-Daten | **16 : 16**, deckungsgleich |
| `npm test` | **93 Proben — 93 grün, 0 rot, 0 nicht lauffähig** |
| `gegenprobe_paper_a_parallel.mjs` | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |

Alle Rückgabewerte ohne Pipe abgefragt. Die Rechnungen in 3.9 sind nachgerechnet
und gehen auf (45,4 % · 4.900 · 3.060 · 41 · 4 · 327 · 109).

### Die 19 Funde in drei Gruppen

- **A · 6 Punkte, die englische Fassung weicht ab:** Literaturverzeichnis anders
  sortiert (DE nicht alphabetisch, EN schon) · der vierte Arm heißt `R+G+F` statt
  `R+G+Rück`, während `R` und `G` unübersetzt blieben · „nachziehen" als „bring
  along" (heißt mitnehmen, gemeint ist anpassen) · „Zuschnitt" an drei Stellen
  drei verschiedene Wörter · „vorzeigen" als „produced on demand" · ein
  „therefore" in der Zusammenfassung, das im Deutschen fehlt.
- **B · 8 Punkte, Fehler in der DEUTSCHEN Fassung**, die die englische nicht hat:
  sieben Satzzeichen- und Numerusfehler (Zeilen 812, 890, 907, 1510, 1639, 1773,
  1793) und ein Grundsatz, der zweimal verschieden zitiert wird (`darf` / `muss`).
- **C · 4 Punkte in BEIDEN Fassungen:** die Korrektur 47 % → 45 % ist in der
  Tabelle „Die Rechnung von der richtigen Seite" nicht nachgezogen (DE 974,
  EN 946) · „Zwei Dinge bleiben trotzdem stehen", und es folgen drei · Abschnitt
  4.4 steht im Präsens und meint den Zustand vor dem 2026-08-23 · das
  durchgerechnete Beispiel nennt die Regel bei ihrem zurückgezogenen Wortlaut.

### Ein Wächter dazu, und er misst die Gestalt statt der Wörter

`tests/smoke_paper_a_parallel.mjs` hält die beiden Sprachfassungen in derselben
Gestalt: Zahl und Ebenen-Folge der Überschriften · je Abschnitt Absatz-Blöcke,
Tabellenzeilen, Listenpunkte · Querverweise · ISO-Daten · derselbe DOI in beiden
HTML-Fassungen.

⚠ **Wortlaut wäre hier der falsche Anker.** Ein übersetzter Text muss andere
Wörter haben; ein Wächter auf Wörter verböte die Übersetzung und jede spätere
Berichtigung. Genau dieser Fehler steht in Paper A selbst als Befund (3.2) — der
Kimhub-Wächter verlangte `KEINE WERKZEUGE` und hielt elf Tage die falsch
gewordene Regel am Leben, grün die ganze Zeit.

**Die Gegenprobe ist selbst gegengeprüft:** eine Zusicherung des Wächters von
Hand blind gemacht, worauf die Gegenprobe genau ihren Fall als NICHT GEFANGEN
meldete (Rückgabewert 1). Danach byte-gleich zurückgeschrieben. Ohne diesen
Handgriff wäre „9 gefangen" nur ein grüner Haken.

### Nebenbei

- **Kimhub PR #75** (Regel 6) auf Klaus' Wort gemergt (Squash, `d5e1314`).
- **Zenodo laut Klaus aktualisiert:** Version `1.0`, Titel einsprachig.
  ⚠ **Nicht nachgeprüft** — zenodo.org und doi.org antworten hier mit 403.

### Offen

- **Die 19 Funde sind unentschieden.** Klaus entscheidet, was in eine
  Berichtigung geht und ob daraus eine neue Zenodo-Version wird. Beide
  Sprachfassungen liegen unter demselben DOI.
- **Der Wächter fängt A1 nicht.** Eine Prüfung auf die Reihenfolge des
  Literaturverzeichnisses wäre heute rot, weil die Abweichung besteht. Sie gehört
  nachgetragen, sobald A1 entschieden ist.
- **Nicht geprüft:** kein Browser-Sichttest, keine PDFs (liegen nicht im Depot),
  kein Abgleich mit dem Zenodo-Eintrag, die Sachaussagen nicht gegen die Quellen.

### Ein Fund am Rande, der eine eigene Lehre trägt

Beim `git add -A` kamen vier `docs/lesen/*.html` mit, die diese Sitzung nie
angefasst hat — je eine Zeile, der Tagesstempel aus `tools/lesefassung-bauen.mjs`.

**Ursache:** der Rumpf des Erzeugers stand auf **oberster Ebene**. Ein blosser
`import` löschte damit `docs/lesen/` und baute es neu — und importiert wird er
von `tests/smoke_werkzeuge_lauffaehig.mjs`, deren eigener Kopf sagt *„Ausführen
schriebe Dateien … ein Import führt den Modulkopf aus"*. Bei diesem Werkzeug
**war** der Modulkopf das ganze Programm. Die Positivliste `NUR_SYNTAX` dort
kannte es nicht. Zweite Hälfte: `if (fehlend) process.exit(1)` ganz unten hätte
die importierende Probe beendet und alles danach verschluckt.

⚠ **Und die Zwischendiagnose war falsch, gemessen gegen eine verunreinigte
Ausgangslage.** Ich hatte notiert, `npm test` schreibe nicht — geprüft nach einem
`git checkout HEAD`, während HEAD den bereits gestempelten Stand trug. Der
Vergleich konnte gar keinen Unterschied zeigen. **Dieselbe Falle, die die
Verfassung als „miss auf einem frischen Klon" führt, nur von innen.** Erst der
Abgleich gegen `origin/main` legte es offen.

**Behoben:** Direkt-Riegel im Werkzeug (`const DIREKT = …`), Definitionen bleiben
importierbar. Dazu ein Wächter, der **nicht** den einen Namen nachträgt, sondern
misst: `smoke_werkzeuge_lauffaehig.mjs` tastet `docs/` vor und nach dem Laden ab
und fällt um, sobald **irgendein** Werkzeug beim Import schreibt. Die Liste zu
ergänzen hätte diesen Fall geschlossen und den nächsten nicht.
`tests/gegenprobe_werkzeuge_schreiben.mjs`: **1 gefangen · 0 durchgerutscht ·
0 tote Anker.**

### Eine Parallel-Sitzung hat unterwegs `main` bewegt

Nach dem Push zeigte `git diff --stat origin/main <zweig>` eine Datei mehr als
erwartet. Der Zweig hätte **fremde Arbeit zurückgedreht**: PR #947 (`d24fec5`,
08:00 Uhr) hatte in `sessions/archiv/2026-09-03_paper-a-veroeffentlicht.md`
nachgetragen, dass Kimhub #75 gemergt ist. Mein Zweig stand auf der älteren
Basis, der Diff zeigte deren Zeilen als Löschung. `origin/main` hereingenommen.

> Der Fall, den `veroeffentlichung-pruefen` benennt. Aufgefallen nur, weil nach
> dem Push nachgesehen wurde. **Der Diff gegen `origin/main` beantwortet zwei
> Fragen — „trägt der PR etwas?" und „nimmt er etwas weg?".** Die zweite stellt
> sich niemand von selbst.

**Nächster sinnvoller Schritt: keiner an diesem Papier.** Klaus hat am
2026-09-04 nachgefragt, ob die Datei dafür wirklich umgeschrieben werden muss.
Nachgesehen: **von den 19 Funden ist einer sachlich** — C1, die Tabelle trägt
47 %, während der Kasten drei Abschnitte höher 45 % als berichtigten Wert nennt.
Er ändert an keiner Schlussfolgerung etwas; der Eurobetrag daneben ist über
Token gerechnet, nicht über den Prozentsatz. Die übrigen 18 sind Kommafehler,
eine nicht alphabetische Literaturliste und Übersetzungs-Nuancen.

**Eine neue Zenodo-Version dafür wäre schlechter als die Fehler** — sie spaltet
den Zitier-Nachweis für nichts. Die Funde bleiben dokumentiert liegen und werden
mitgenommen, falls aus einem anderen Grund einmal eine Version 2 entsteht.

⚠ **Hier stand zuerst „Klaus entscheidet, danach eine Berichtigungs-Sitzung".**
Das war der Anfang einer Schleife: eine Sitzung liest den Auftrag, arbeitet 19
Kleinigkeiten ab und schreibt den nächsten. **Wer einen nächsten Schritt
aufschreibt, prüft vorher, ob er nötig ist** — sonst erzeugt die Übergabe
selbst die Arbeit, die sie zu übergeben vorgibt.


