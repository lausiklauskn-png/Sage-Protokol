# docs/papers/: dokumentengestützte Stationen der Sonnen-Galaxie

Dieser Ordner trägt die **dokumentengestützten Stationen** der
Sonnen-Galaxie (Sage-Geschichts-Galerie, Vision-Anker 10 in
`docs/PULS.md`).

| Datei | Station | Eintrag in `index.html` |
|---|---|---|
| `sbkim-paper-en.html` | Station 4 · Wissenschaftlicher Niederschlag, SBKIM-Paper (EN) | `STATIONS_DATA[3]` (status `live`, `href` zeigt auf diese Datei) |
| `sbkim-paper-de.html` | Station 5 · Wissenschaftlicher Niederschlag, SBKIM-Paper (DE) | `STATIONS_DATA[4]` (status `live`, `href` zeigt auf diese Datei) |
| `paper-a-regeln-und-grundsaetze.html` | Station 9 · Regeln und Grundsätze, Paper A (DE) | `STATIONS_DATA[8]` (status `live`) |
| `paper-a-rules-and-principles.html` | Station 10 · Rules and Principles, Paper A (EN) | `STATIONS_DATA[9]` (status `live`) |

## Paper A ist ERZEUGT, nicht von Hand gesetzt (2026-09-03)

Die beiden SBKIM-Papers sind HTML-Dateien, die selbst die Quelle sind. **Paper A
ist es nicht.** Seine Quelle ist das Markdown
[`PAPER_A_regeln-und-grundsaetze.md`](PAPER_A_regeln-und-grundsaetze.md); die
HTML entsteht daraus mit `tools/paper-md-zu-html.mjs`.

Der Grund steht weiter unten in dieser Datei, im Abschnitt über die einzige
Quelle: bis zum 2026-09-02 gab es jedes SBKIM-Paper **zweimal**, mit
verschiedenen Titeln. Ein Markdown und eine von Hand gesetzte HTML daneben
hätten genau diese Lage wiederhergestellt — nur mit Ansage.

| | |
|---|---|
| **Quelle DE** | `PAPER_A_regeln-und-grundsaetze.md` — hier wird geändert |
| **Quelle EN** | `PAPER_A_rules-and-principles.md` — die Übersetzung, folgt der deutschen |
| **Erzeugnisse** | `paper-a-regeln-und-grundsaetze.html` · `paper-a-rules-and-principles.html` — **nie von Hand ändern** |
| **Stil** | `paper.css`, byte-treu aus `sbkim-paper-de.html` gezogen, plus ein abgegrenzter Zusatz-Block |
| **Wächter** | `tests/smoke_paper_a.mjs` baut beide neu und vergleicht · `tests/smoke_paper_css.mjs` hält den Stil an der inline-Fassung · `tests/gegenprobe_paper_a.mjs` |

### Die englische Fassung ist eine Übersetzung, keine zweite Fassung

**Bei Widersprüchen gilt die deutsche.** Sie ist die Quelle; die englische folgt
ihr. Das steht so auch im Papier selbst.

Wort für Wort lässt sich eine Übersetzung nicht vergleichen. **Ihre Gliederung
schon**, und genau die misst `smoke_paper_a.mjs`: gleich viele Hauptabschnitte,
Unterabschnitte und vierte Ebenen. Weicht das ab, hat jemand nur **eine** der
beiden Seiten geändert, und dort fängt das Auseinanderlaufen an, vor dem der
Abschnitt weiter unten warnt. Der Wächter misst nicht, ob richtig übersetzt
wurde. Er misst, ob beide Seiten noch dieselbe Form haben.

Gemessen am 2026-09-03: **13 Hauptabschnitte, 41 Unterabschnitte, 35 vierte
Ebenen** in beiden Fassungen.

**Das PDF liegt NICHT im Depot** — wie bei den SBKIM-Papers auch. Es wird mit
`tools/paper-zu-pdf.mjs` gebaut, wenn es gebraucht wird. Der Weg zur
Veröffentlichung: **[`ZENODO_WEG.md`](ZENODO_WEG.md)**.

⚠ **Der Seitenumbruch für die Schlussabschnitte steht im ERZEUGER**, nicht im
Markdown. Der erste Anlauf setzte eine Marke `<!-- eigene-seite -->` in den
Text — und sie erschien als **sichtbarer Text** in
`docs/antragsmappe-einreichbar.html`, die dasselbe Markdown liest. Ein
Seitenumbruch ist eine Aussage des Drucks, nicht des Textes. Der Wächter dort
sah es nicht und ist seitdem um ein Muster reicher (`smoke_antragsmappe.mjs`,
„HTML-Kommentar").

## Die DOIs (Zenodo, 2026-09-03)

**Es sind zwei, und sie haben verschiedene Aufgaben.** Zenodo legt den zweiten
automatisch an; wer das nicht weiß, verwendet den falschen.

| DOI | Was er bezeichnet | Wofür |
|---|---|---|
| [`10.5281/zenodo.22277738`](https://doi.org/10.5281/zenodo.22277738) | **genau diese Fassung**, Version 2.0 vom 03.09.2026 | steht **in den Papers selbst** — ein Dokument bezeichnet sich, nicht seine Nachfolger |
| [`10.5281/zenodo.22277737`](https://doi.org/10.5281/zenodo.22277737) | **das Werk**, alle Fassungen | überall, wo dauerhaft auf „das SBKIM-Papier" gezeigt wird: führt **immer zur neuesten** |

⚠ **Die Zuordnung ist nicht Geschmackssache.** Im gedruckten Papier muss der
Versions-DOI stehen: wer dieses PDF in der Hand hält, hält Version 2.0, und der
DOI darauf muss zu genau ihr führen. Zeigte er auf die neueste, führte ein
Zitat aus dem Jahr 2026 irgendwann auf einen Text, den der Zitierende nie
gesehen hat.

Umgekehrt gehört in eine Verlinkung, die stehen bleiben soll — README,
Geschichts-Galerie, Marktplatz-Eintrag — der **Concept-DOI**. Sonst zeigt sie
nach der nächsten Fassung auf eine veraltete.

Beide Sprachfassungen liegen unter **einem** DOI, weil sie **ein** Werk sind:
derselbe Text, zwei Sprachen, in einem Zenodo-Eintrag mit zwei Dateien. Zwei
getrennte DOIs hätten aus einer Arbeit zwei gemacht, und wer eine davon
zitiert, hätte die andere nicht mit erfasst.

Eingetragen ist er an **vier** Stellen, und die Liste steht hier, damit die
nächste Fassung keine davon vergisst:

| Wo | Was |
|---|---|
| beide Papers, Zeile unter der Herkunft | `<p class="paper-doi">` |
| diese Datei | dieser Abschnitt |
| `index.html`, Station 4 und 5 | im Erzähl-Text der Galerie |
| `index.html`, Station 8 | im Absatz zur zweiten Fassung |

**In den Papers steht der Versions-DOI**, in Galerie und README beide — mit
der Rolle dabei, damit niemand den falschen abschreibt.

⚠ **Ein DOI ist unveränderlich.** Was unter dieser Nummer liegt, bleibt dort.
Die Angaben daneben (Titel, Beschreibung, Schlüsselwörter) lassen sich bei
Zenodo nachträglich ändern, die **Dateien nicht**. Wer eine neue Fassung
veröffentlicht, legt bei Zenodo eine neue Version an — sie bekommt einen
eigenen DOI und bleibt über den Concept-DOI mit dieser verbunden.

**Lizenz: CC BY 4.0** für den Aufsatz. Die darin beschriebene
Protokoll-Spezifikation ist gemeinfrei, wie im Text an zwei Stellen steht —
das ist kein Widerspruch, sondern die übliche Trennung zwischen dem Text und
dem darin beschriebenen Verfahren.

---

## Der Prioritätsnachweis — die alten Fassungen sind Beleg, nicht Ballast

**Klaus 2026-09-03:** *„die alten Fassungen, Vorgängerversionen der Papers sind
der Nachweis, dass ich schon früher die Idee für SBKIM hatte."*

Er hat recht, und der Nachweis ist stärker, als er selbst gesagt hat. Die
Quelltext-Verwaltung setzt Zeitstempel, die niemand nachträglich vergeben kann:

| Datum | Was | Dauerhafter Verweis |
|---|---|---|
| **10.05.2026** | SBKIM zum ersten Mal genannt: *„Skelett anlegen: Memory- und Spezifikationsschicht für SBKIM-Hub"* | [`d7352fb`](https://github.com/lausiklauskn-png/Sage-Protokol/commit/d7352fb27a6bc30c30d92ed08c411fa3b348aa70) |
| **18.05.2026** | erste Fassung des deutschen Papiers | [Datei ansehen](https://github.com/lausiklauskn-png/Sage-Protokol/blob/631d10fb966c0fcf8235fdb80145e29b69c18412/docs/papers/sbkim-paper-de.html) |
| **18.05.2026** | erste Fassung des englischen Papiers | [Datei ansehen](https://github.com/lausiklauskn-png/Sage-Protokol/blob/76b0e835489aee4d6824ff00e4d31e2fb8699466/docs/papers/sbkim-paper-en.html) |
| **03.09.2026** | DOI, zweite Fassung | [10.5281/zenodo.22277738](https://doi.org/10.5281/zenodo.22277738) |

**Das sind knapp vier Monate zwischen der ersten Niederschrift und der
Veröffentlichung**, jeder Schritt dazwischen protokolliert.

⚠ **Diese Verweise sind Permalinks auf einen Commit, nicht auf einen Zweig.**
Sie zeigen die Datei so, wie sie an dem Tag aussah, und ändern sich nie mit.
Ein Verweis auf `main` zeigte dagegen immer die neueste Fassung — als Beleg
für ein Datum wäre er wertlos.

### Was daraus folgt

**Die alten Fassungen werden nicht gelöscht und nicht überschrieben.** Sie
liegen in der Historie und sind über die Verweise oben erreichbar. Wer den Text
von damals lesen will, kann es; wer das Datum prüfen will, sieht es am Commit.

Das ist auch die Antwort auf die Frage, warum die Papers keine
Berichtigungs-Vermerke tragen: **die Geschichte steht nicht im Text, sie steht
in der Historie** — und dort vollständig, statt als Kasten mitten im Papier.

Es ist zugleich der Schutz, den die Verfassung meint mit
*„Schutz ist Copyright + Git-Historie"*: kein Wasserzeichen, keine Obfuskation,
sondern eine lückenlose, öffentliche, datierte Spur.

---

## 🚨 Dieser Ordner ist die EINZIGE Quelle der beiden Papers

**Seit 2026-09-02.** Vorher gab es jedes Paper zweimal: hier und unter
`sbkim-demo/`. Die beiden Fassungen waren **nicht gleich**, sie trugen sogar
verschiedene Titel. Hier stand „Ein Protokoll für Semantisches Bidirektionales
**KI-Matching**", dort „Ein Offenes Protokoll für Semantisches Bidirektionales
**Wissensintegriertes** Matching".

**Zwei Texte mit derselben Überschrift und verschiedenem Inhalt lassen sich
nicht mehr reparieren, sobald jemand einen davon zitiert hat.** Deshalb:

- **Gepflegt wird nur hier.** `sbkim-demo/SBKIM_Paper.html` und
  `sbkim-demo/SBKIM_Paper_DE.html` sind seitdem **Zeiger-Seiten**, die hierher
  weiterleiten und sagen, warum. Die vier Verweise aus `sbkim-demo/index.html`
  und `sbkim-demo/hub.html` funktionieren weiter.
- **Gültig ist die Lesart „Semantisches Bidirektionales KI-Matching."** So steht
  der Name auch in den übrigen Depots dieses Netzes.
- **Wer eine Änderung am Papier vornimmt, macht sie hier** und nirgends sonst.

> Was beim Vergleich sonst noch herauskam: die Demo-Fassungen trugen bessere
> Druck-Regeln (`break-inside`, `orphans`/`widows`). Die sind übernommen worden,
> bevor die Dateien zu Zeigern wurden. **Vor dem Zusammenlegen vergleichen.**
> Sonst wirft das Zusammenlegen etwas weg.

## Die Fassung vom September ist die ZWEITE (berichtigt 2026-09-03)

**Die Fassung vom Mai 2026 war öffentlich.** Sie lag seit dem **18. Mai 2026**
in diesem Depot und stand in der Geschichts-Galerie auf der Startseite als
**Station 4** mit `status: 'live'` und klickbarem Verweis — also nicht nur
erreichbar, sondern aktiv angeboten. Über GitHub Pages konnte sie jeder lesen.

> ⚠ **Bis zum 2026-09-03 stand hier das Gegenteil:** „Das Paper vom Mai 2026 ist
> nie veröffentlicht worden. Es lag als Entwurf in diesem Depot." Klaus hat
> widersprochen, und die Quelltext-Verwaltung gibt ihm recht:
> `git log --diff-filter=A -- docs/papers/sbkim-paper-en.html` nennt den
> 18.05.2026, und `git show 9011aad:index.html` zeigt den Eintrag mit `href`.
> **Eine Datei, die auf einer öffentlichen Seite verlinkt ist, ist
> veröffentlicht** — ob jemand sie gelesen hat, ist eine andere Frage.

⚠ **Trotzdem stehen in den Papers keine Berichtigungs-Vermerke** (Klaus
2026-09-03). Die Begründung ist eine andere als vorher, denn die alte trägt
nicht mehr. Ein Kasten „Berichtigt am 2. September" wendet sich an jemanden, der
die frühere Fassung **gelesen** hat. Die Fassung vom Mai wurde nirgends
angekündigt, hatte keinen DOI und keine Leserschaft. Wo die Geschichte
vollständig steht, sagt der Abschnitt weiter unten.

> Klaus: *„Gestalte es bitte so, dass es gedanklich nachvollziehbar ist und keiner
> irgendwelche falschen Rückschlüsse zieht. Die Irreführungen sind, die auch nichts
> zur Sache tun und nichts beitragen zur Aufklärung und zur Erklärung darüber, was
> wir jetzt vorschlagen."*

**Wo die Geschichte stattdessen steht:** in der Geschichts-Galerie auf der
Startseite, **Station 8 „Die revidierte Ausgabe"** (`index.html`,
`STATIONS_DATA[7]`). Dort gehört sie hin, und dort kann sie nachgelesen werden.
Der vollständige Befund mit allen Messungen bleibt in
[`REVISION_2026-09-02.md`](REVISION_2026-09-02.md).

**Was in den Papers WEITERHIN steht**, weil es die Sache erklärt und nicht die
Entstehung: die Vorarbeiten in § 2.1, die Zuschreibung „unabhängig gefunden, nicht
zuerst gefunden" in § 5, der Vorbehalt zu den rohen Ähnlichkeitswerten in § 6.2,
die Methoden-Grenzen der Literatursuche und § 9 zur Entstehung des Textes.

### Was der Entwurf vom Mai nicht mehr hergab

| | |
|---|---|
| § 2.1/2.2 **neu** | die Vorarbeiten, aus denen die Bausteine stammen: reziproke Empfehlungssysteme, semantische Überlagerungsnetze, Agent Cards |
| § 3.5 **neu** | die Selbstbeschreibung folgt dem Inhalt. Vektor aus dem Bestand gerechnet, Versionszähler als Drift-Merkmal, neu signiert. War seit Spore v0.2 gebaut und stand in keinem Papier |
| § 5 **neu** | wie das entstanden ist, samt der zwei Genauigkeiten („keine KIs, die sich erkennen" · „server-los" in Anführungszeichen) |
| § 6 **überarbeitet** | 33 Depots statt zwei HTML-Dateien, mit den Zahlen und der Messung vom 10.07. |
| § 7.1 **aufgeteilt** | was belegt ist ⟷ was offen bleibt, samt der Hintergrund-Tab-Grenze |
| § 8 **zurückgenommen** | der Neuheits-Anspruch fällt; die gestrichene Fassung bleibt sichtbar stehen |
| § 9 **neu** | zur Entstehung des Textes: wer die redaktionelle Verantwortung trägt und worin die Prüfung bestand |

**Der Satz, auf den alles hinausläuft:** die Bausteine sind bekannt; der Betrieb
ist der Beitrag.

**Die Papers tragen als Datum „September 2026 · Zweite Fassung · Erstfassung
Mai 2026 im offenen Depot · Zweitveröffentlichung über Zenodo".** Die frühere
Ausgabe wird damit genannt, statt verschwiegen zu werden — ein Leser, der sie
im Depot findet, soll nicht rätseln, in welchem Verhältnis sie zu der Fassung
steht, die er in der Hand hält. Dieselbe Auskunft steht ausformuliert in
**Abschnitt 9** beider Papers, mit dem Datum des ersten Erscheinens.

> ⚠ **Zwei Sitzungen haben am 2026-09-03 parallel an dieser Zeile gearbeitet.**
> PR #939 kam zuerst auf `main` und schrieb „Erstveröffentlichung im offenen
> Depot auf GitHub · Zweitveröffentlichung über Zenodo". Klaus hat die erste
> Hälfte beanstandet — sie liest sich, als sei die Erstveröffentlichung im
> September gewesen, während die erste Fassung seit Mai dort lag. Die jetzige
> Zeile trägt beide Befunde: das Mai-Datum aus dieser Sitzung, die
> Zenodo-Einordnung aus #939.

> **Kommende Papers:** drei weitere sind geplant, regelbasiertes und
> grundsatzbasiertes Lenken · wie KI auf den Menschen wirkt · KI-Kompetenz im
> täglichen Gebrauch. Gerüst, Gliederungen und die Stellen, an denen jedes
> einzelne kippen kann: **[`PLAN_PAPERS.md`](PLAN_PAPERS.md)**.

## Zweck

Die Geschichts-Galerie zeigt die Stationen der Sage-Entwicklung
als Galaxien, die auf einer gemeinsamen Ellipsen-Bahn um ein
zentrales Sonnen-Zentrum tanzen (Stand 2026-09-02: **acht**).
Die meisten sind **text-only** und tragen ihren Erzähl-Text
direkt im `STATIONS_DATA`-Array. Drei sind
**dokumentengestützt**. Ihr Modal verlinkt
auf eine echte HTML-Datei, die hier im Repo liegt. Das ist die
einzige Daseinsberechtigung für diesen Ordner.

## Wachstums-Disziplin

- **Neue Stationen** kommen primär als **text-only** dazu, die
  Bahn-Ellipse skaliert ihre Phasen-Verteilung automatisch
  (`360° / n`). Kein Datei-Anker nötig.
- **Neue dokumentengestützte Stationen** brauchen genau zwei
  Dinge: eine `.html`-Datei in diesem Ordner und einen Eintrag
  mit `status: 'live'` + `href: 'docs/papers/<datei>.html'` in
  `STATIONS_DATA` in `index.html`.
- **Pflege ist ein eigener Mini-PR**: neue Datei einchecken,
  Modul-Code nicht anfassen, INTERFACES.md nicht anfassen.

## Heilige Tafel: Privatheit

Vision-Anker 10 (`docs/PULS.md`) trägt eine ausdrückliche
**Privatheits-Klausel**: die Sonnen-Galaxie darf den Namen
eines bestimmten kommerziellen Kontextes **nicht** erwähnen.
Wer hier eine neue Datei einlegt oder eine Station mit Erzähl-
Text füllt, prüft das vor dem Commit. Details siehe PULS § Anker
10 § Heilige Tafel.

## Verweis

Vollständige Architektur, Bahn-Mathematik, Stationen-Inventar
und Status: `docs/PULS.md` § Vision-Anker → „2026-05-18 ·
Sonnen-Galaxie. Sage-Geschichts-Galerie" (Anker 10).
