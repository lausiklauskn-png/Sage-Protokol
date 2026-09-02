# Übergabeprotokoll · 2026-09-02, Abend — Sporen-Befund und DOI-Vorbereitung

*Fortsetzung derselben Sitzung. Der erste Teil ist in
[`2026-09-02_papers-feldbericht.md`](2026-09-02_papers-feldbericht.md)
protokolliert und endet mit PR #930.*

---

## Was das Ziel war und was daraus wurde

Die Sitzung war für die **Veröffentlichung der Papers und den Zenodo-DOI**
losgegangen. Die Papers stehen; **der DOI steht am Ende immer noch offen.**

Dazwischen lag eine Sporen-Diagnose von rund vier Stunden. Sie war richtig und
hat drei Irrtümer aufgedeckt, einen davon in einer Auskunft dieser Sitzung.
**Beide Hälften gehören zum Befund** — der Fund war es wert, und das Ziel ist
trotzdem liegen geblieben. Daraus ist `NETZWEIT § 6a` entstanden.

## Was gebaut wurde

| PR | |
|---|---|
| #931 | SBKIM heißt **Semantisches Bidirektionales KI-Matching** — zwei erfundene Lesarten aus einer früheren Sitzung entfernt |
| #932 | `tools/spore-verschiebung.html` — misst im Browser, wie weit ein Vektor nach dem Neu-Signieren wandert |
| #933 | der Sporen-Befund als `LEHREN.md` § 9, Regel in `CLAUDE.md`, Messung an die vorhandene Notiz in `OBSERVATORIUM_BROWSER.md` |
| #934 | drei offene Textstellen entschieden (ABGRENZUNG § 4, Geschichts-Galerie, der 403-Befund) |
| #935 | die Papier-Titel lösen das Kürzel auf, mit Wächter und vier Gegenproben |
| #936 | der Grundsatz bindet **beide** Seiten und sucht keinen Schuldigen |
| #937 | der harte Umbruch im Titel strandete ein Wort |

Dazu, außerhalb des Depots: **zwei PDFs für Zenodo** (A4, echte Schriften
eingebettet) und eine **Angaben-Datei** mit Titeln, Lizenz, Schlagwörtern und
beiden Zusammenfassungen wortgleich aus den Papieren.

## Der Hauptbefund

**Die Spore im Netz ist nicht die Spore im Depot.**

Klaus hat mit dem Analyse-Rekorder der Mycel-Karte zwei Mitschnitte aufgenommen,
20:42 und 20:49 UTC. Gegen die committeten Sporen gehalten:

| | Depot-Datei | auf der Leitung |
|---|---|---|
| Sage, Beschreibung | 2.527 Zeichen | 160 |
| Mixarium, Beschreibung | 1.476 Zeichen | 88, **anderer Text** |
| `embeddingSource` · `embeddingVersion` | fehlt in **allen 18** | vorhanden |
| Signatur · `createdAt` · Kennung | | jeweils andere |

Mixariums Leitungs-Text ist **kein Anfang** seines Depot-Textes. Die angekündigte
Spore entsteht **im Browser**; die Datei im Depot ist Ablage und Beleg, kein
Sender.

**Die Kernaussage stand schon im Depot.** `OBSERVATORIUM_BROWSER.md` sagt seit
Mai: *„Pages-deployte `spore.json` ist ein Snapshot einer einzigen
Andock-Session."* Diese Sitzung hat am selben Abend das Gegenteil behauptet und
Klaus daraufhin eine signierte Datei erzeugen lassen, die nichts sendet.

## Fehler dieser Sitzung, alle gemessen widerlegt

| | Behauptung | wodurch widerlegt |
|---|---|---|
| 1 | „jede App liest ihre eigene `sbkim/spore.json`" | zwei Mitschnitte; die Aussage stand seit Mai widerlegt im Depot |
| 2 | die 160 Zeichen seien eine Kappung bei `SNIPPET_TEXT_MAX` | Mixariums 88 Zeichen — unter jeder Grenze und trotzdem anders |
| 3 | „94 % der Selbstbeschreibung gehen verloren" | es geht nichts verloren, es geht etwas **anderes** hinaus |
| 4 | der PDF-Prüfer meldete „§ 3.5 fehlt, Kürzel nicht aufgelöst" | er las **Schriftdaten** statt Seiteninhalt; die 15.168 „Textzeichen" waren Fonttabellen |

Nummer 2 ist die lehrreichste: **eine Zahl, die zu einer Konstante im Code passt,
ist noch keine Ursache.** Aus einer Probe waren „bei 160 abgeschnitten" und „nur
der erste Satz" nicht zu trennen. Es brauchte einen zweiten Knoten.

## Zwei Gegenproben, die nichts gemessen haben

Beim Bau des Titel-Wächters:

- **Toter Anker.** Eine `sed`-Sabotage zielte auf sechs Leerzeichen, im Dokument
  stehen vier. Sie änderte nichts und meldete sich als „nicht gefangen".
  Gefunden nur, weil jede Sabotage seitdem per `cmp` belegen muss, dass sich die
  Datei wirklich geändert hat.
- **Die falsche Fundstelle.** Eine Sabotage an der Überschrift traf über
  `replace(…, 1)` den `<title>`, weil er denselben Wortlaut trägt. Zwei Fälle
  prüften dasselbe, und der Überschriften-Wächter blieb blind.

## Drei Werkzeug-Fallen, jede einmal zugeschnappt

- **`git checkout --` auf eine Datei mit einer noch nicht committeten Reparatur
  nimmt die Reparatur mit weg.** Gemerkt, weil eine `md5sum`-Probe davorlag;
  seitdem wird mit Sicherungskopien zurückgesetzt.
- **`while read` überspringt die letzte Zeile ohne Zeilenumbruch.** Von acht
  Schrift-Dateien kamen sieben. Die Prüfung „Datei fehlt oder zu klein" hat es
  gefangen.
- **`pip` ist in diesem Container defekt** (`pyo3_runtime.PanicException`). Kein
  PDF-Leser nachinstallierbar; geprüft wurde deshalb **vor** dem Druck im
  geladenen Dokument statt danach im PDF.

## Die PDFs

Zenodo schreibt kein Format vor, aber ein Preprint gehört als PDF hinein — HTML
wird dort nur zum Herunterladen angeboten.

Zwei Dinge waren dabei zu lösen:

- **Die Schriften fehlten.** Chromium kam durch den Proxy nicht an Google Fonts
  (`ERR_CONNECTION_RESET`) und setzte still Liberation Serif ein. `curl` kommt
  durch; die acht lateinischen Schnitte sind jetzt als `data:`-URI in eine
  **Arbeitskopie** eingebettet. Das Depot bleibt unberührt, das PDF braucht kein
  Netz.
- **Der Titel strandete ein Wort** (#937), sichtbar erst in echter Druckbreite.

Vor jedem Druck prüft der Bauer drei Dinge und bricht sonst ab: Titel löst das
Kürzel auf · § 3.5 steht im Text · die verlangte Schrift ist wirklich geladen.

## Stundennachweis

| | |
|---|---|
| Erster Merge dieses Teils | **22:05** UTC · #931 |
| Letzter Merge | **23:46** UTC · #937 |
| **Spanne** | **1 h 41 min**, sieben PRs |
| Ganzer Tag auf `main` | 13:30 bis 23:46, **13 Merges** |

⚠ **Das ist die Spanne des Ablegens, nicht der Aufwand.** Die zwei Mitschnitte,
das Auswerten der Vektoren, drei Runden Gegenproben und das Rendern der PDFs
liegen dazwischen und davor. Und die Spanne ist **nicht Klaus' Arbeitszeit** —
beide überschneiden sich, sind aber nicht dasselbe.

## Proben

`node tests/run_alle.mjs` auf dem `main`-Stand: **90 Proben, 90 grün, 0 rot,
0 nicht lauffähig.** Rückgabewert getrennt von der Pipe geprüft.

## Was offen bleibt

Alle drei im Browser, keines aus einer Sitzung lösbar:

1. **Der Zenodo-DOI** — das Sitzungs-Ziel. Angaben und PDFs liegen bereit.
2. **Sages Netz-Identität** steht auf `BgjXhSAp…` statt `nysOZE3V…`. Zurück über
   den Identitäts-Wechsler aus der verschlüsselten Sicherung.
3. **Die neue Beschreibung gehört in die App**, nicht in die Datei. Wer das
   verwechselt, hat `LEHREN.md` § 9 nicht gelesen.

Nicht gemessen: woher der Browser den Beschreibungstext nimmt, ob dieses Feld
selbst kappt, und ob die anderen 16 Knoten sich gleich verhalten.

Brief für die nächste Sitzung:
[`../BRIEF_nach_papers_veroeffentlichung.md`](../BRIEF_nach_papers_veroeffentlichung.md).
