# docs/papers/: dokumentengestützte Stationen der Sonnen-Galaxie

Dieser Ordner trägt die **dokumentengestützten Stationen** der
Sonnen-Galaxie (Sage-Geschichts-Galerie, Vision-Anker 10 in
`docs/PULS.md`). Heute stehen hier **zwei** Dateien:

| Datei | Station | Eintrag in `index.html` |
|---|---|---|
| `sbkim-paper-en.html` | Station 4 · Wissenschaftlicher Niederschlag, SBKIM-Paper (EN) | `STATIONS_DATA[3]` (status `live`, `href` zeigt auf diese Datei) |
| `sbkim-paper-de.html` | Station 5 · Wissenschaftlicher Niederschlag, SBKIM-Paper (DE) | `STATIONS_DATA[4]` (status `live`, `href` zeigt auf diese Datei) |

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
Mai 2026 im offenen Depot".** Die frühere Ausgabe wird damit genannt, statt
verschwiegen zu werden — ein Leser, der sie im Depot findet, soll nicht
rätseln, in welchem Verhältnis sie zu der Fassung steht, die er in der Hand
hält.

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
