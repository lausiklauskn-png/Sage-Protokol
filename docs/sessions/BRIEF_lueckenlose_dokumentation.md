# Brief an die nächste Sitzung: die lückenlose Dokumentation

**Datum:** 2026-08-26
**Stand:** alles Genannte liegt auf `main` (bis PR #920, alle gemergt).
**Vorgänger:** [`ABSCHLUSSBRIEF_2026-08-26.md`](ABSCHLUSSBRIEF_2026-08-26.md)
sagt, was vorliegt. Dieser Brief sagt, was daraus zu machen ist.

> ## ⚠ ZUERST, JEDES MAL
>
> **`git fetch origin` und frisch von `origin/main` abzweigen.** In drei Tagen
> liefen **zweimal** zwei Sitzungen parallel, beim zweiten Mal bauten beide
> dasselbe. Beide Male gemerkt beim Push, nicht davor.
>
> **Vor jedem PR:** `git diff --numstat origin/main origin/<zweig>` und die
> Löschungen ansehen. Steht dort eine Datei, die du nicht angefasst hast,
> drehst du fremde Arbeit zurück.
>
> Und **`docs/PULS.md` steht bei 2.833 Zeilen.** Hundertsiebenundsechzig unter
> der Grenze. Wer viel zu schreiben hat, lagert **vorher** aus.

---

## Der Auftrag (Klaus, 2026-08-26)

> *„Der Reihe nach alle Forschungsunterlagen, Historie, Entstehung und alles,
> was zu einer lückenlosen Dokumentation (soweit wie möglich) notwendig ist."*

**Die Klammer trägt die Arbeit.** *Soweit wie möglich* heißt: eine Lücke, die
benannt und begründet ist, gehört zur lückenlosen Dokumentation dazu. Eine, die
zugeschrieben wird, zerstört sie.

---

## 1 · Der Befund, mit dem diese Sitzung anfängt

Gemessen am 2026-08-26, aus `docs/historie/historie.json` und dem Dateibestand:

| Monat | Commits | Sitzungs-Protokolle |
|---|---|---|
| März | 2 | 0 |
| April | **551** | **0** |
| Mai | 747 | 146 |
| Juni | 1.437 | 30 |
| Juli | **1.811** | **22** |
| August | 1.275 | 27 |

**Zwei Dinge stehen darin, und das zweite ist das unangenehmere.**

Der **April hat 551 Commits und kein einziges Protokoll.** Das ist die größte
zusammenhängende Lücke.

Und die **Protokoll-Dichte fällt, während die Arbeit steigt**: im Mai kam auf
je fünf Commits ein Protokoll, im Juli auf je zweiundachtzig. Genau das ist der
Satz, den Paper A behandelt, nur diesmal an der eigenen Arbeit gemessen statt
an einer Werkstatt-Schicht. **Ob das ein Befund über die Dokumentation ist oder
über die Sitzungen, entscheidet die Prüfung, nicht die Vermutung**: ein
Protokoll je Sitzung bei längeren Sitzungen ergibt dieselbe Kurve, ohne dass
etwas fehlte.

**Das ist die erste Frage dieser Sitzung, und sie ist beantwortbar:** die
Historie kennt die Tage. Wie viele Arbeitstage je Monat haben ein Protokoll,
und wie viele nicht?

---

## 2 · Was die Forschungsunterlagen heute NICHT enthalten

Abteilung 2 der Antragsmappe trägt acht Dateien: `ENTSTEHUNG.md`, Paper A,
`FORSCHUNGSKORPUS.md`, `PLAN_PAPERS.md` und die vier Werkstatt-Dateien.

**Nicht darin, obwohl vorhanden und stark:**

| | wo es liegt | warum es zählt |
|---|---|---|
| Die **Historie** | `docs/historie/historie.html` | 5.823 Commits, Tag für Tag, mit Rollen und Verlauf |
| Der **Arbeitszeitnachweis** | `docs/historie/arbeitstage.*` | 128 Tage, aus fremden Zeitstempeln |
| Die **Meilensteine** | `docs/MEILENSTEIN_*.md`, `docs/meilenstein/` | der Beweis, dass etwas wirklich lief |
| **225 Sitzungs-Protokolle** | `docs/sessions/archiv/` | die eigentliche Arbeitsspur |
| Die **Lehren** | `docs/LEHREN.md` | was schiefging und was daraus folgt |

**Das ist keine Nachlässigkeit, sondern eine offene Entscheidung.** Eine Mappe,
die alles enthält, liest niemand. Zu entscheiden ist: **was gehört hinein, was
gehört als Anlage daneben, und was bleibt Nachschlagewerk?**

Klaus entscheidet das. Der Brief verlangt einen **Vorschlag mit Begründung je
Zeile**, nicht eine Umsortierung auf eigene Faust.

---

## 3 · Die Aufgaben, in der Reihenfolge

### A · Die Bestandsaufnahme (zuerst, alles andere hängt daran)

Ein Blatt, das **jeden** Dokumentations-Bestand nennt, mit vier Spalten:
**was · wo · welcher Zeitraum · welche Lücke.**

Erzeugt, nicht von Hand geschrieben: der Bestand ändert sich, und eine Liste
von Hand ist am Tag nach dem Schreiben falsch. Wo eine Zahl steht, kommt sie
aus den Daten.

Bekannt sind bereits:

- `docs/historie/historie.json`, 10.03. bis 24.08., 5.823 Commits
- 225 Protokolle, Mai bis August, **April fehlt**
- Kimhubs Fahrtenbuch, **erst ab 22.08.**, Stunden und Kosten auf die Minute
- 75 Rechnungen, 13.03. bis 04.08., **in Kimhub und gitignoriert**
- drei Bildschirmfotos unter `docs/sessions/archiv/screenshots`
- **Klaus' Chat-Archive**, außerhalb von Git, Umfang unbekannt

> **Der letzte Punkt ist der wichtigste und der einzige, den eine Sitzung nicht
> allein klären kann.** Frag Klaus, was er hat und in welcher Form. Was in
> keinem Depot liegt, kann kein Werkzeug finden, und eine Aufstellung, die es
> verschweigt, behauptet Vollständigkeit, die sie nicht hat.

### B · Die April-Lücke schließen, als Rekonstruktion gekennzeichnet

Der April hat 551 Commits. Aus ihnen lässt sich ableiten, **was** geschah, mit
Datum und Uhrzeit. Was sich **nicht** ableiten lässt, ist, was besprochen,
verworfen und warum entschieden wurde.

**Deshalb: rekonstruieren und es hinschreiben.** Eine Rekonstruktion, die als
solche gekennzeichnet ist, trägt in einem Antrag. Eine, die wie ein Protokoll
aussieht, kostet die Glaubwürdigkeit aller echten.

Die Form steht schon: `docs/sessions/BRIEFING_TEMPLATE.md`. Das
Rekonstruktions-Blatt bekommt einen eigenen Kopf, der sagt, woraus es gemacht
ist und was darin fehlt.

### C · Entstehung und Forschungskorpus gegen die Daten prüfen

`docs/papers/ENTSTEHUNG.md` ist **Klaus' Darstellung**, 156 Zeilen, und § 8
sagt selbst, was belegt ist und was nicht. Zu prüfen ist: **hält jede
Jahreszahl und jede Reihenfolge darin gegen die Historie?**

Dasselbe für `FORSCHUNGSKORPUS.md` (sechs Glieder, MIT, mit Datum). Die
Lizenz-Tafel hat sich am 24.08. schon einmal als falsch erwiesen; ein Wächter
dafür steht seitdem (`tests/smoke_lizenz_konsistenz.mjs`).

**Wo Darstellung und Messung auseinandergehen, wird beides genannt**, nicht
eines stillschweigend angeglichen. Klaus' Erinnerung ist eine Quelle, die
Historie ist eine zweite, und wo sie sich widersprechen, ist das selbst ein
Befund.

### D · Der Vorschlag zur Mappe

Aus A und B: **was gehört in Abteilung 2, was als Anlage daneben, was bleibt
Nachschlagewerk?** Eine Tabelle mit einer Begründung je Zeile. **Nicht
umsortieren**, vorlegen.

### E · Das Blatt „Stand der Technik und Abgrenzung"

Es existiert nicht, und **jede Fördergeberin liest es zuerst**. Eine Seite: was
es schon gibt (IPFS, ActivityPub, Matrix, Solid, libp2p, Nostr, zentrale
Vektor-Suchen) und in welchem Punkt SBKIM etwas anderes tut.

Von allem Fehlenden hat es die größte Wirkung je Seite. **Ohne es wirkt der
Antrag naiv, mit ihm belesen.** Es gehört in dieselbe Sitzung, wenn der Platz
reicht, und sonst in den nächsten Brief, ausdrücklich benannt.

---

## 4 · Was dabei NICHT geschieht

- **Kein Umschreiben von Paper A.** Der Werkzeug-Widerspruch ist Klaus'
  Entscheidung und steht noch aus.
- **Keine Zenodo-Veröffentlichung.** Eine Zenodo-Fassung bleibt stehen; erst
  entscheiden, dann hochladen.
- **Kein Anfassen der Byte-Kopien** unter `docs/werkstatt/`. Ihre Prüfsummen
  stehen in `werkstatt/README.md`; geändert wird in Kimhub, dann neu kopiert.
- **Keine geratene Zahl.** Wo nichts gemessen ist, steht „nicht gemessen",
  nicht „0". Eine geratene Zahl klingt genau wie eine gemessene.

---

## 5 · Die Regeln, die hier zuletzt Geld und Zeit gekostet haben

**Ein Wächter nagelt eine Aussage fest, keine Wörter.** Drei Prüfungen fanden
am 26.08. ihren Satz woanders (im Warnkasten des Generators, im anderen Blatt,
klein geschrieben in derselben Einleitung) und waren zufrieden, während die
Stelle, um die es ging, leer war.

**Ein Wächter, der eine Funktion nachbaut, misst seine eigene Funktion.** Der
Download-Wächter klonte die Abteilung selbst, statt den Knopf zu drücken.

**Ein Wächter wird an fremdem Text erwachsen.** Das eigene Material trifft die
eigenen Annahmen nie.

**Ein Wächter ohne Gegenprobe ist nur ein grüner Haken.** Wer eine Prüfung
ergänzt, ergänzt den passenden Fehler und sieht nach, ob sie umfällt. **Und
nie zwei Gegenproben nebeneinander:** sie verderben einander die Ausgangslage,
und eine abgebrochene lässt ihre Sabotage stehen.

**`| tail` ist zum Lesen da, nicht zum Urteilen.**

**Keine Gedankenstriche.** Es gibt Sätze.

---

## Pflicht am Ende dieser Sitzung

1. `docs/PULS.md` fortschreiben, **vorher** auslagern, wenn es eng wird.
2. Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`.
3. `node tests/run_alle.mjs` **und** die Gegenproben, einzeln, nacheinander,
   mit echtem Rückgabewert.
4. Vorgeschlagene nächste Schritte direkt in die Chat-Antwort, 2 bis 4 Punkte.
5. Diesen Brief fortschreiben, damit die Kette nicht abreißt.
