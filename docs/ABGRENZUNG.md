# Stand der Technik und Abgrenzung

**Stand: 2026-08-26.** Eine Seite. Sie beantwortet die Frage, die eine
Gutachterin zuerst stellt: *gibt es das nicht schon?*

> **Die ehrliche Antwort ist zweiteilig.** Die einzelnen Bausteine gibt es
> alle, und SBKIM benutzt einige davon. Was es nicht gibt, ist die eine
> Eigenschaft, um die es geht.

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

## 4 · Was übrig bleibt, und das ist der Anspruch

**Semantische Entdeckung, bevor kommuniziert wird, in beide Richtungen, ohne
zentralen Index.**

Die vorhandenen Verfahren teilen sich in zwei Lager. Das eine kann **finden,
aber nur einseitig und nur mit einem Betreiber in der Mitte**. Das andere kann
**verbinden, aber erst, wenn man schon weiß, mit wem**. Zwischen beiden liegt
die Lücke, und sie ist keine Nische: sie ist die Frage, mit der jede
Zusammenarbeit anfängt.

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

**Was dafür fehlt:** eine Suche in der Fachliteratur nach Arbeiten zu
bidirektionalem semantischem Matching, und die Prüfung, ob eine davon dieselbe
Symmetrie-Anforderung stellt. Das ist der Punkt, an dem ein methodischer
Partner den größten Unterschied macht, und er steht offen.

**Und eine Selbstbeschränkung:** ein Vergleich, der die eigene Sache gewinnen
lässt, ist zuerst verdächtig. Die Tabelle oben nennt bei jedem Verfahren, was
es **kann**, bevor sie sagt, was es nicht tut. Wer eine Zeile für unfair hält,
soll sie beanstanden.
