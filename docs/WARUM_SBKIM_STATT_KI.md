# Warum diese App statt einfach eine KI?

> **Ehrliche Positionierung (Klaus' Frage 2026-06-23).** Soll motivieren,
> mitzumachen. Darum kein Marketing, sondern eine ehrliche Antwort, an der sich
> Forker und jede neue Sitzung orientieren können. Gehört zum Meilenstein
> [`MEILENSTEIN_SEMANTISCHE_SUCHE.md`](MEILENSTEIN_SEMANTISCHE_SUCHE.md).

---

## Die ehrliche Ausgangslage

Für **eine einzelne Web-Recherche** kann man dasselbe direkt in ChatGPT, Gemini,
Claude usw. machen. Als reines „frag eine KI nach Quellen" ist die App **kein**
Alleinstellungsmerkmal. Das muss man offen sagen, sonst verliert die Erzählung
ihre Glaubwürdigkeit. Solo gegen eine große KI **verliert** die nackte Web-Suche.

## Was SBKIM anders macht (drei echte Unterschiede)

1. **Server-los & privat, mit eigener, lokaler Bedeutungs-Sortier-Maschine.**
   Einbetten + Sortieren nach Bedeutung läuft **im Browser** (Modul 03 Embedding +
   Modul 04 Matcher). Kein Konto, keine Daten an einen Server, außer der Nutzer
   löst **selbst** und **bewusst** eine KI-Anfrage mit **seinem** Schlüssel aus.
   Der gratis, rein semantische Modus funktioniert **ganz ohne KI**. Ein KI-Chat
   schickt dagegen prinzipiell alles zum Anbieter.

2. **Anbieter-neutral statt Vendor-Lock.** Die KI ist hier ein **austauschbarer
   Motor** (ChatGPT / Gemini / Claude / Perplexity, oder keiner). Niemand ist an
   einen Konzern gebunden, und der **Gratis-Kern** (lokales Semantik-Ranking)
   gehört dem Nutzer. Der Code ist **offen und forkbar**.

3. **Dezentrale Knoten-Suche (das Mycel), der eigentliche Kern.** Das kann
   **keine** zentrale KI und **kein** Google: kleine, unabhängige Seiten finden
   sich **gegenseitig, peer-to-peer, ohne zentralen Index**. „Honig im Hefeteig" →
   der Teig-Knoten antwortet zum Teig, ein Imker-Knoten zum Honig, über
   Themengrenzen hinweg, ohne dass eine Firma dazwischen sitzt und mitliest.

## Wo der Wert wirklich entsteht (nicht in der Solo-Web-Suche)

- **Eingebaut in Fach-Apps** (Rezeptbuch, Mixarium, eigene Tools): das Werkzeug
  sucht über **deren** Inhalt + verbundene Knoten, **nicht** das offene Web. Das
  kann eine externe KI nicht, weil sie diese (oft privaten) App-Inhalte nicht kennt.
- **Mit wachsendem Netz:** je mehr Knoten, desto mehr „findet man Wissen, das in
  keinem zentralen Index steht".

## Können auch normale Internetseiten (mit eigenem Server) mitmachen?

**Ja, die Hosting-Art ist egal.** Die SBKIM-Module sind **Client-seitiges
JavaScript**, das im Browser des Besuchers läuft (Identität, Embedding via WASM,
IndexedDB, Handshake, Spore). Ob die Seite von **GitHub Pages**, **PHP/Apache**,
**Node**, **WordPress** oder sonstwo ausgeliefert wird, spielt keine Rolle: sobald
die Seite im Browser geladen ist, arbeitet das Mycel **dort**.

- Der Server muss SBKIM **nicht selbst „können"**, er **hostet nur die Dateien**
  (die JS-Module) plus, wie bei den Endknoten, einen öffentlichen
  **`/sbkim/spore.json`**-Endpunkt (die signierte Identität + Domain-Vektor) und
  einen kleinen **Service-Worker**. Siehe Einbau-Anleitung Karte 09.
- Eine Server-Seite kann **zusätzlich** einen **Pilz-Server** stellen
  (Proxy/SearXNG/KI-Brücke), optional, für echte Inline-Web-Treffer oder
  automatische KI-Aufrufe. Das ist die **Pilz-Schicht**, nicht das Mycel.

**Ehrliche Grenze (offene Front):** Eine Seite als Knoten, deren `spore.json`
andere **lesen** (Empfangsmodus), ist machbar. Die **volle bidirektionale
Cross-Origin-Live-Vernetzung server-los** (fremder Knoten fragt fremden Knoten
direkt im Browser) ist noch **nicht** end-to-end bewiesen, und es fehlt eine
**Discovery-Schicht**: *wie* findet ein Knoten überhaupt fremde Knoten? (Heute:
manuelles Andocken / bekannte Geschwister. Ein echtes „finde jede teilnehmende
Seite" braucht ein Verzeichnis oder einen Gossip-Mechanismus, offene Design-Frage.)

## Offen, nicht entschieden: öffentlich/offen vs. Geld

Der offene, öffentliche Weg passt zur **SBKIM-Philosophie**: das Mycel ist
**offen und forkbar**; Geld lebt in der **kommerziellen Pilz-Schicht** (Premium-
Tools/Dienste), nicht im Mycel. Öffentlich-offen senkt die Einstiegshürde →
**mehr Knoten → mehr Wert** (der Wert wächst mit dem Netz, nicht gegen es). Ob und
wie monetarisiert wird, bleibt **Klaus' offene Entscheidung** (Phase D.2). „Kopiert
werden" ist hier **kein** Schaden, sondern **Verbreitung**. Die Kopie nimmt nur
den ohnehin gratis Teil mit; bezahlt würde allenfalls ein laufender Server-Dienst.

„Professioneller" wird das nicht durch Verschließen, sondern durch **Mit-Bauer**
(Menschen und Agenten, die beitragen), genau die Schicht-3-Idee des Projekts.

## Der ehrliche Einzeiler

> **Nicht die Suche ist das Besondere, sondern das server-lose, anbieter-neutrale,
> dezentrale Finden zwischen unabhängigen Seiten, privat und forkbar.** Solo gegen
> ChatGPT verliert die Web-Suche; als Mycel-Organ in vielen kleinen Apps gewinnt
> sie etwas, das eine zentrale KI prinzipiell nicht haben kann.
