# Woher das kommt — Klaus' Darstellung

**Aufgezeichnet am 2026-08-23.** Das ist **Klaus' eigene Schilderung**, wie das
Vorhaben entstanden ist, festgehalten bevor sie verlorengeht. Sie ist **Rohstoff**
für den Anfang von Paper A und für die Vorhabensbeschreibung im Antrag, noch nicht
eingearbeitet.

> **Warum diese Datei überhaupt existiert.** Beim Prüfen der Antragsunterlagen fiel
> Klaus auf, dass die Texte mitten im Thema anfangen. Wer sie liest, erfährt nie,
> worauf sie aufbauen, warum ein Werkzeug gebaut wurde und was eine „Schicht" ist.
> Er sagte dazu: *„bis man da ist, denkt man, das hat KI geschrieben."* Der
> Zusammenhang fehlt, und er stand bisher nur im Gespräch.

---

## 1 · Der Ausgangspunkt: das Matching

Am Anfang stand **Sage-Protokol** und das semantische, bidirektionale KI-Matching.

Über das Mycel wurde gebaut, dass **PWAs und Internetseiten einander erkennen** —
anhand von Bedeutungsvektoren, nicht anhand von Stichwörtern. Das Ziel war, die
**inhaltliche Bedeutung** zu erfassen und damit etwas zu erreichen: Dinge schneller
zu finden, die jemand sucht.

**Zwei Genauigkeiten, auf die Klaus ausdrücklich hinweist** und die in den
Unterlagen bisher fehlten:

- **Es sind keine KIs, die sich erkennen.** Es sind Anwendungen und Seiten. Die KI
  steckt im Einbetten und im Sortieren, nicht in den Knoten.
- **„Server-los" gehört in Anführungszeichen.** Es gibt sehr wohl ein **Relais**.
  Was fehlt, ist ein Server **beim Einzelnen** und ein zentraler Index. Klaus
  betreibt selbst ein Relais (`wss://relay.family-projekt.de`). Peer-to-peer heißt
  hier: niemand muss eigene Infrastruktur stellen, nicht: es gibt keine.

## 2 · Der Anlass: einer allein, und die Dokumentation frisst die Zeit

Klaus hat allein gearbeitet und nach einer Möglichkeit gesucht, das zu
automatisieren — **die Dokumentation eingeschlossen**.

Dabei kam der Befund, um den sich alles Weitere dreht:

> **Regeln allein haben nicht gereicht**, um die KI sinnvoll an ein Ziel zu lenken.

Er hat mitgelesen und verfolgt, wo die Arbeit immer wieder scheiterte: falscher
Code, doppelt gebaute Dinge, wiederholte Wege. Seine Beobachtung zur Ursache:
**es wurde von falschen Annahmen ausgegangen.**

> ⚠ **Das ist eine Beobachtung, kein erwiesener Befund.** Sie ist in `LEHREN.md`
> und in den Verfassungen dutzendfach mit Datum belegt, aber sie ist nicht gemessen.
> Im Paper gehört sie als Beobachtung hinein — sonst ist die Forschungsfrage
> beantwortet, bevor sie gestellt wurde.

## 3 · Die Überlegung: mehrere Agenten, und Grundsätze statt vieler Regeln

Daraus wurde die Frage, wie man **mehrere Agenten** so anleitet oder initiiert, dass
sie ein Ziel schneller und besser erreichen. Nicht über viele Regeln, sondern über
**Grundsätze**.

**Die Idee stand schon vorher.** SB·KIMTool·Point trägt sie als **Modell**: dort
läuft eine Rollen-Kette, aber sie spielt einen **aufgezeichneten** Lauf ab. Das
steht in dessen Verfassung ausdrücklich so.

**In Kimhub ist dasselbe lebendig geworden** — echte Aufträge, echte Modelle, echte
Kosten. Auch das steht dort so geschrieben. Der Bogen ist damit in beiden Depots
nachprüfbar und keine nachträgliche Erzählung.

## 4 · Warum das Werkzeug gebaut wurde

Es wurde stundenlang an Dingen gearbeitet, **aus denen nichts wurde**. Um zu sehen,
wo das Problem sitzt, musste es aufgeschrieben werden. Daraus entstand die
Buchhaltung: was eine Fahrt kostet, wie lange sie lief, wie viele Aufrufe, wie es
sich auf die Rollen verteilt.

**Klaus' Richtigstellung dazu, wörtlich sinngemäß:**

> Das Werkzeug ist nicht unbrauchbar, weil ich sauer war. Es **schien** unbrauchbar,
> weil ich kein Ergebnis gesehen habe. **Was die Ursache war, ist die Grundlage des
> Forschungsprojekts.**

Das ist der Kern der Haltung und gehört so ins Paper. Der Ärger war das **Signal**,
nicht das Urteil.

## 5 · Was offen ist — und offen bleiben soll

Warum kam nichts heraus? Die Möglichkeiten stehen nebeneinander, **keine ist
ausgeschlossen**:

- Waren es die **Regeln**?
- Waren es die **fehlenden Grundsätze**?
- War es **beides zusammen**?
- War es die **Vorgehensweise**?
- War es das **Fehlen der Werkzeuge** bei den Rollen?

Diese Liste ist die Forschungsfrage. Sie vorzeitig zu beantworten wäre der Fehler,
vor dem Grundsatz 3 warnt.

## 6 · Die eigentliche Frage, in Klaus' Worten

> **Wie kann jemand, der keinen Zugriff und keinen Einfluss auf die großen Modelle
> hat, seine Zeit, sein Geld und seinen Einsatz mit KI-Systemen so regulieren, dass
> es sinnvoll und einfach bleibt, zielführend ist und Ressourcen spart?**

Und das Ziel dahinter: Menschen sollen KI nicht nur **benutzen** können, sondern
wissen, **wie sie sich eigene Werkzeuge bauen** — mit möglichst wenig Zeiteinsatz.

**Das Paper stellt heute nur die Unterfrage** (Regeln gegen Grundsätze) und nennt
diese Hauptfrage nicht. In der Sprache der Fördergeber heißt sie *digitale
Souveränität für kleine Akteure*, und sie ist dünn besetzt: fast alle Forschung
dazu kommt von Leuten, die Zugriff auf die Modelle haben.

## 7 · Der rote Faden, der die drei Papers verbindet: Zeit

Die drei geplanten Papers sahen aus wie drei Themen. Sie sind eines, und der Faden
ist **Zeit**:

| Strang | Was er an Zeit spart oder kostet |
|---|---|
| Semantische Suche | soll das **Finden** schneller machen |
| Lenkung über Grundsätze | soll die **Umwege** kürzer machen |
| Psychische Wirkung | **je mehr Zeit hineingeht, desto tiefer die Gewöhnung** |

Es geht nicht um Token und nicht um Euro. Beide sind kleine Posten. **Zeit ist der
Preis**, in Geld wie in Gewöhnung.

**Und die Kehrseite steht im selben Satz.** Dieselbe Intensität, die in fünf
Monaten dieses Netz hervorgebracht hat — nach Klaus' eigener Schätzung **mehr als
doppelte Arbeitszeit** —, ist die, vor der der Sucht-Strang warnt. Er sagt dazu:

> *„Ich bin nicht süchtig. Aber ich bin das lebendige Beispiel dafür. Das schafft
> man nicht, wenn man die Sachen nebenbei macht."*

Diese Ambivalenz ist kein Makel der Darstellung. Sie ist der Gegenstand.

## 8 · Was davon belegt ist und was nicht

Damit die beiden nicht ineinanderlaufen:

| | Zeitraum | Art des Belegs |
|---|---|---|
| **Aufschreibung** | seit März 2026, fünf Monate | `LEHREN.md`, Verfassungen, Sitzungsprotokolle, Git-Historie mit Datum. Echt und datiert, aber **Text, keine Messreihe** |
| **Messung** | seit **2026-08-20** (Deckel, Kosten), **2026-08-22** (Fahrtenbuch) | belastbar, aber **wenige Läufe** |
| **Zeitaufwand des Menschen** | „mehr als doppelte Arbeitszeit" | **Schätzung von Klaus**, nicht gemessen. Die Stechuhr existiert, eine Reihe noch nicht |

## 9 · Was mit dieser Datei geschehen soll

Sie ist der Rohstoff für drei Dinge, die noch zu tun sind:

1. **Ein neuer Abschnitt 1 in Paper A**, der die Herkunft erzählt, bevor Begriffe
   wie „Schicht" gebraucht werden.
2. **Die Vorhabensbeschreibung** im Förderantrag — Abschnitt 6 ist deren Kern.
3. **Ein Abschnitt zur Entstehung des Papers selbst**: welche Wendepunkte von Klaus
   kamen und welche von der Sitzung. Bei einem Papier über die Lenkung von KI ist
   das kein Anhang, sondern Material.

**Klaus liest gegen und korrigiert.** Was hier steht, ist seine Darstellung, von
einer Sitzung aufgeschrieben — nicht umgekehrt.
