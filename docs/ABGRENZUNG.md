# Stand der Technik und Abgrenzung

**Stand: 2026-09-02.** Eine Seite. Sie beantwortet die Frage, die eine
Gutachterin zuerst stellt: *gibt es das nicht schon?*

> **Die ehrliche Antwort, Fassung 2026-09-02:** die einzelnen Bausteine gibt es
> alle, und SBKIM benutzt einige davon. **Auch die Symmetrie gibt es schon.**
> Das ist seit der Literatursuche in § 6 belegt. Was in den gefundenen Arbeiten
> fehlt, ist keine einzelne Eigenschaft. Es ist der **laufende Betrieb**, in dem
> alle drei zusammenkommen.
>
> Vorher stand hier: *„Was es nicht gibt, ist die eine Eigenschaft, um die es
> geht."* Dieser Satz ist widerlegt und bleibt als widerlegt stehen.

---

## 1 · Was SBKIM ist, in drei Sätzen

Zwei Parteien beschreiben sich in **freiem Text**: was sie können und was sie
brauchen. Ein Sprachmodell bewertet das **Paar** und gibt einen strukturierten
Bericht zurück. Es gibt **keinen zentralen Index**, bei dem sich beide vorher
anmelden müssten.

Der Kern ist die **Symmetrie**: beide Seiten nennen Fähigkeit **und** Bedarf.
Genau daraus entsteht ein Ergebnis, das eine Suchmaschine nicht liefern kann,
weil sie nur eine Richtung kennt.

## 2 · Was es schon gibt, und was es beantwortet

| Verfahren | Beantwortet die Frage | Was es nicht beantwortet |
|---|---|---|
| **IPFS** | *wo liegt der Inhalt mit diesem Fingerabdruck?* | wer für mich passt. Man muss den Fingerabdruck schon kennen |
| **libp2p / DHT** | *wo erreiche ich diesen Knoten?* | dasselbe: die Kennung muss man schon haben |
| **ActivityPub** | *wie stelle ich meinen Beitrag denen zu, die mir folgen?* | wem man folgen sollte |
| **Matrix** | *wie rede ich sicher mit jemandem?* | mit wem |
| **Nostr** | *wie veröffentliche ich etwas, ohne eine Plattform zu brauchen?* | wer daran Interesse hat |
| **Solid** | *wie behalte ich die Hoheit über meine Daten?* | wer damit etwas anfangen kann |
| **Zentrale Vektor-Suchen** | *welches Dokument passt zu meiner Frage?* | ob ich zu dem Dokument passe. Und: es braucht einen Betreiber, der alle Daten hat |
| **MCP und verwandte Agenten-Protokolle** | *wie spricht ein Modell mit einem Werkzeug?* | welches Modell und welches Werkzeug zueinander passen, bevor sie sprechen |

**Die Zeile, die am ehesten wie ein Einwand aussieht, ist die vorletzte.** Eine
Vektor-Suche ist semantisch, und das klingt nach demselben. Sie ist aber
**einseitig** (eine Frage sucht Dokumente, die Dokumente suchen nichts) und
**zentral** (ein Index, ein Betreiber, alle Daten an einer Stelle). Beides ist
genau das, was hier nicht sein soll.

## 3 · Wo SBKIM nichts Neues beansprucht

Das gehört ausdrücklich dazu, weil ein Vorhaben, das alles für neu erklärt,
seine wirklich neue Stelle mit begräbt.

- **Der Transport ist geliehen.** SBKIM spricht über **Nostr**-Relais. Das
  Protokoll ist fremd, offen und wurde nicht von uns gebaut.
- **Die Einbettung ist Stand der Technik.** Text in Vektoren zu übersetzen ist
  seit Jahren üblich.
- **Die Kryptographie ist Standard.** Ed25519, AES-256-GCM, PBKDF2. Nichts davon
  ist eine Eigenentwicklung, und das ist Absicht.
- **Die Rollen-Kette** in der Werkstatt ist ein bekanntes Muster.

## 4 · Was übrig bleibt

**Semantische Entdeckung, bevor kommuniziert wird, in beide Richtungen, ohne
zentralen Index.**

> ⚠ **Eingeschränkt am 2026-09-02, nachdem die Literatursuche aus § 6 gemacht
> wurde.** Dieser Satz stand hier als *der Anspruch*. Er beschreibt weiterhin
> richtig, was SBKIM tut. Aber **keiner seiner Bestandteile ist neu**, und die
> Belege dafür stehen in § 6. Die **Symmetrie** ist der Kern der reziproken
> Empfehlungssysteme. Die **indexfreie semantische Entdeckung** ist seit etwa
> 2008 als semantische Überlagerungsnetze beschrieben. Die **signierte
> Selbstbeschreibung** gibt es als Agent Cards.
>
> Was in den gefundenen Arbeiten nicht vorkommt, ist die **Verbindung aller
> drei in einem laufenden Betrieb**. Genau darauf stellen die Papers seit dem
> 2026-09-02 um: *die Bausteine sind bekannt; der Betrieb ist der Beitrag.*
> Diese Seite behält den Satz, weil er die Lage der Verfahren richtig
> beschreibt. Ein **Neuheits-Anspruch ist er nicht mehr**.

Die vorhandenen Verfahren teilen sich in zwei Lager. Das eine kann **finden,
aber nur einseitig und nur mit einem Betreiber in der Mitte**. Das andere kann
**verbinden, aber erst, wenn man schon weiß, mit wem**. Zwischen beiden liegt
eine Lücke, und sie ist keine Nische: sie ist die Frage, mit der jede
Zusammenarbeit anfängt.

Dass die Lücke besteht, ist eine Aussage über die **gefundenen** Arbeiten,
nicht über alle. § 6 nennt, wie weit gesucht wurde und wo die Suche endet.

## 5 · Was daran belegt ist

| | Belegt durch |
|---|---|
| Zwei Knoten beantworten einander nach Bedeutung | Zwei-Knoten-Suche, **2026-07-10** |
| Und zwar ohne gemeinsamen Hub | Cross-Knoten-Fragen, **2026-07-11** |
| Über mehrere Knoten hinweg | Mesh-Handshake, **2026-07-23** |

Alle drei mit Datum und Bild in
[`MEILENSTEIN_SEMANTISCHE_SUCHE.md`](../MEILENSTEIN_SEMANTISCHE_SUCHE.md) und
[`meilenstein/`](../meilenstein/).

## 6 · Was hier ausdrücklich NICHT belegt ist

**Diese Seite ist eine Abgrenzung, keine Literaturübersicht.** Sie stützt sich
auf die veröffentlichten Zwecke der genannten Verfahren, nicht auf eine
systematische Recherche mit Zitaten. Für einen Antrag reicht das, um die Frage
*gibt es das nicht schon* zu beantworten. Für eine Veröffentlichung reicht es
nicht.

**Was dafür fehlte:** eine Suche in der Fachliteratur nach Arbeiten zu
bidirektionalem semantischem Matching, und die Prüfung, ob eine davon dieselbe
Symmetrie-Anforderung stellt.

### ✅ Am 2026-09-02 gemacht, und sie ist gegen uns ausgegangen

| Bestandteil | existiert als | seit |
|---|---|---|
| **bidirektional / symmetrisch** | reziproke Empfehlungssysteme (Partner- und Stellenvermittlung), eigenes Feld mit eigenen Metriken | Jahre |
| **semantische Entdeckung ohne zentralen Index** | semantische Überlagerungsnetze | ~2008 |
| **signierte Selbstbeschreibung** | A2A Agent Cards · Fähigkeits-Beschreibungen mit Verfallsdatum | 2026 |

**Die Frage aus dem alten Absatz ist beantwortet: ja, es gibt Arbeiten mit
derselben Symmetrie-Anforderung.** Reziproke Empfehlungssysteme verlangen
ausdrücklich, dass **beide** Seiten zustimmen. Sie setzen dafür allerdings eine
**Plattform** voraus, die beide kennt, und ein Kandidatenfeld, das feststeht.
Semantische Überlagerungsnetze brauchen keine Plattform, kennen aber nur **eine**
Richtung. Agent Cards nennen, was einer **kann**, und schweigen darüber, was er
**sucht**.

**Was daraus folgt, steht in den Papers und nicht hier:** der Neuheits-Anspruch
ist zurückgenommen, die Vorarbeiten sind benannt, und der Beitrag heißt jetzt
Feldbericht. Siehe `papers/sbkim-paper-de.html` § 2.1 und § 8. Seit dem
2026-09-03 ist das Papier zitierfähig veröffentlicht:
[10.5281/zenodo.22277738](https://doi.org/10.5281/zenodo.22277738) bezeichnet
diese Fassung, [10.5281/zenodo.22277737](https://doi.org/10.5281/zenodo.22277737)
das Werk über alle Fassungen hinweg.

**Und die Grenzen dieser Suche, damit sie nicht mehr wiegt, als sie kann:**
drei Suchen, keine systematische Übersicht. Geprüft wurde an Titeln und
Zusammenfassungen, **nicht an den Volltexten**. `arxiv.org` und die
Verlagsseiten sind aus der Arbeitsumgebung gesperrt. **Für eine Veröffentlichung
reicht das immer noch nicht.** Der methodische Partner macht hier weiterhin den
größten Unterschied; nur ist die Lage jetzt bekannt statt unbekannt.

**Und eine Selbstbeschränkung:** ein Vergleich, der die eigene Sache gewinnen
lässt, ist zuerst verdächtig. Die Tabelle oben nennt bei jedem Verfahren, was
es **kann**, bevor sie sagt, was es nicht tut. Wer eine Zeile für unfair hält,
soll sie beanstanden.
