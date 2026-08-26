# Forschungskorpus: die Kette, auf die ein Antrag zeigt

**Stand: 2026-08-24.** Wer Förderung für offene Software beantragt, muss zeigen
können, **woran** geforscht wurde, nachprüfbar, nicht behauptet. Diese Datei
benennt die Kette. Sie gehört zu
[`FORSCHUNGSFOERDERUNG.md`](FORSCHUNGSFOERDERUNG.md), wo steht, wofür.

> **Nicht die Menge zählt, sondern die Geschlossenheit.** Sechs Repos mit einer
> erkennbaren Linie wiegen mehr als fünfzehn ohne. Ein Gutachter fragt nicht
> „wie viel ist offen", sondern „ist die Kette geschlossen".

---

## Die sechs Glieder

Alle unter **MIT-Lizenz**, nutzen, kopieren, verändern und weitergeben ist
erlaubt, auch geschäftlich. Bedingung ist die Namensnennung.

| # | Repo | Was es im Korpus beweist | MIT seit |
|---|---|---|---|
| 1 | **[Sage-Protokol](https://github.com/lausiklauskn-png/Sage-Protokol)** | die **Spezifikation**, Module, Verträge, Glossar, Proben, Papers, Meilensteine | von Anfang an |
| 2 | **[SB·KIMTool·Point](https://github.com/lausiklauskn-png/SB-KIMTool-Point)** | das **Modell**, eine Rollen-Kette, die einen aufgezeichneten Lauf zeigt und das ehrlich dazusagt | von Anfang an |
| 3 | **[mycel-karte](https://github.com/lausiklauskn-png/mycel-karte)** | das **Messinstrument**, die lebende Netz-Karte, mit der überhaupt sichtbar wurde, ob Knoten sich finden | von Anfang an |
| 4 | **[Kim-Bell](https://github.com/lausiklauskn-png/Kim-Bell)** | die **Vorlage**, die kanonische, 1:1 kopierbare Netz-Anmeldung (Modul 23) | 2026-08-23 |
| 5 | **[Kimseek](https://github.com/lausiklauskn-png/Kimseek)** | die **Suche**, semantische Bedeutungs-Suche als eigener Knoten | 2026-08-23 |
| 6 | **[Kimboard](https://github.com/lausiklauskn-png/Kimboard)** | die **Pinnwand** und die **Moderations-Werkzeuge**, Sperr-Liste, Relais-Wache, Relais-Grenzen, je mit Gegenprobe | 2026-08-23 |

Dazu, in diesem Repo:

| Ort | Was es beweist |
|---|---|
| **[`docs/werkstatt/`](werkstatt/)** | die **Regel-/Grundsatz-Trennung**, Momentaufnahme aus Kimhub, samt dem, was daran *nicht* bewiesen ist |
| **[`docs/meilenstein/`](meilenstein/)** | die **datierten Belege** mit Bild |
| **[`docs/papers/`](papers/)** | die beiden Papers (DE/EN) |
| **[`sbkim-demo/`](../sbkim-demo/)** | der **erste lauffähige Stand vom März 2026**, absichtlich so stehen geblieben. Er kam am **2026-08-15** in dieses Depot (#855): bis dahin war er unveröffentlicht, weil er an eine konkrete Anfrage gebunden war. Wer die Git-Historie prüft, findet deshalb das August-Datum, und das ist kein Widerspruch |

---

## Die drei Stränge, und was sie verbindet

**1 · Semantische, bidirektionale Suche ohne zentralen Index.** („Server-los"
heißt hier: kein Server beim Einzelnen, kein zentraler Index. Ein Relais gibt es.)
Zwei Knoten ohne
gemeinsamen Hub beantworten einander nach Bedeutung. Belegt und datiert:
Zwei-Knoten-Suche (2026-07-10), hub-unabhängige Cross-Knoten-Fragen (2026-07-11),
Mesh-Handshake über mehrere Knoten (2026-07-23), siehe
[`MEILENSTEIN_SEMANTISCHE_SUCHE.md`](MEILENSTEIN_SEMANTISCHE_SUCHE.md).

**2 · Grundsatzbasiertes gegenüber regelbasiertem Lenken.** Was lässt sich
erzwingen, was muss man fragen? Material und ehrlicher Befund in
[`werkstatt/`](werkstatt/).

**3 · Was die Nutzung mit Menschen macht.** Suchtpotenzial, Vermenschlichung,
Übervertrauen, Verlernen. **Am wenigsten belegt von den dreien** und ohne
methodischen Partner nicht weiterzubringen.
[`FORSCHUNGSFOERDERUNG.md` § 2.3](FORSCHUNGSFOERDERUNG.md).

### Was die drei zusammenhält

**Bidirektionalität.** Die Suche fragt **und** antwortet: beide Seiten, keine
Hierarchie. Und die Beobachtung über Mensch und KI hat **dieselbe Figur**: der
Mensch prägt die KI über Grundsätze, die KI prägt den Menschen über Gewöhnung.

Beides in nur eine Richtung zu denken ist der Fehler. Beides zusammen ist die
These, und der Grund, warum die drei Stränge **ein** Vorhaben sind und nicht
drei nebeneinander.

---

## Was ausdrücklich NICHT im Korpus liegt

Damit niemand danach sucht und damit die Grenze klar ist:

- **Die Geschäfts-Apps** behalten ihre eigene Nutzungslizenz: WorkFloh, Tomys Hub,
  BookLedgerPro, Alis Moderaum, Perfect Skin (beide), Rezeptbuch (beide),
  Mixarium, Küchenzettel, Private Brain, Company Brain, die Tresore, und die
  beiden Marktplätze family-project und PWA Toolpoint.
  **Sie tragen das Protokoll trotzdem offen:** Ziffer 5 jeder Nutzungslizenz
  stellt die SBKIM-Module unter MIT. Zu ist nur die App-Hülle.
- **Kimhub** bleibt geschlossen. **Entschieden von Klaus am 2026-08-24**, nachdem
  der Grund nachgemessen wurde statt vermutet:
  `werkstatt/buchhaltung/anthropic-belege.json` und `zeiten.json` wurden am
  **2026-08-20 eingecheckt und am 2026-08-22 wieder entfernt**. Aus dem aktuellen
  Stand sind sie weg, aus der Historie nicht, und **ein Fork nimmt die Historie
  mit**. Der einzige Weg zu MIT führte über ein Umschreiben der Historie; das
  entwertet jeden vorhandenen Klon und jeden Verweis auf einen alten Commit und
  ist deshalb ein eigener Auftrag, keine Nebensache. Der Forschungsteil liegt
  stattdessen als Momentaufnahme in [`werkstatt/`](werkstatt/), wo er nichts
  davon mitträgt.
- **Kim-sync** bleibt draußen, und der Grund ist ein anderer als erwartet. Das
  Depot gilt als leer, seine eigene `CLAUDE.md` sagt das auch. Es ist aber nicht
  leer: darin liegt `Company-Brain/VISION.md`, ein Papier zur Geschäfts-App
  Company Brain, das in seinem eigenen Kopf **„Sichtbarkeit: privat"** trägt.
  Eine MIT-Lizenz über das Depot legte dieses Papier mit frei. **Der Handgriff
  hätte fünf Minuten gedauert und wäre still gewesen.** Dagegen hilft nur,
  vorher hineinzusehen. *(Nebenbefund, nicht angefasst: `CLAUDE.md` in Kim-sync
  beschreibt den eigenen Inhalt falsch.)*

### Die KIM-Familie: warum drei drin sind und zwei nicht

Klaus am 2026-08-24: *„die ganze mögliche KIM-Familie sollte mitwirken."*
Nachgemessen gegen `origin/main`, nicht gegen den ausgecheckten Stand:

| Depot | Im Korpus | Warum |
|---|---|---|
| **Kim-Bell** | ✅ | MIT seit 2026-08-23, Glied 4 |
| **Kimseek** | ✅ | MIT seit 2026-08-23, Glied 5 |
| **Kimboard** | ✅ | MIT seit 2026-08-23, Glied 6 |
| **Kimhub** | ❌ | Rechnungsdaten in der Historie, siehe oben |
| **Kim-sync** | ❌ | fremdes, ausdrücklich privates Dokument darin, siehe oben |

> **Das ist kein Fehlbetrag, sondern der bessere Befund.** Der Korpus steht bei
> sechs Depots nicht, weil es nicht mehr gäbe, sondern weil zwei aus benennbaren
> Gründen nicht hineingehören. Und es passt zu dem Satz ganz oben: nicht die
> Menge zählt, sondern die Geschlossenheit. Ein Gutachter, der fragt *„warum ist
> das eine offen und das andere nicht"*, bekommt hier zwei Sätze mit Datum statt
> eines Achselzuckens.

## Ehrlichkeit über den Stand

- **Die Papers tragen noch keinen DOI.** Der Zenodo-Schritt steht aus
  ([`FORSCHUNGSFOERDERUNG.md`](FORSCHUNGSFOERDERUNG.md), Stufe B1). Bis dahin
  sind sie Dateien in einem Depot, keine zitierfähigen Quellen.
- **Das Blatt „Stand der Technik und Abgrenzung" liegt seit dem 2026-08-26 vor**
  ([`ABGRENZUNG.md`](ABGRENZUNG.md), Abteilung 2 der Antragsmappe): gegen IPFS,
  ActivityPub, Matrix, Solid, libp2p, Nostr, zentrale Vektor-Suchen und MCP.
  **Es ist eine Abgrenzung, keine Literaturübersicht.** Für den Antrag reicht
  das, für eine Veröffentlichung nicht; was dafür fehlt, steht in § 6 darin.
- **Klaus' Browser-Sichttest ist nicht ersetzbar.** Headless beweist die Logik,
  nicht wie es sich am Tablet anfühlt.
- **Was in `werkstatt/BEFUND.md` als nicht bewiesen steht, ist nicht bewiesen**.
  keine Kontrollgruppe, kein Maß, Fallzahl eins, nicht verblindet.
