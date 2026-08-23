# Forschungskorpus — die Kette, auf die ein Antrag zeigt

**Stand: 2026-08-23.** Wer Förderung für offene Software beantragt, muss zeigen
können, **woran** geforscht wurde — nachprüfbar, nicht behauptet. Diese Datei
benennt die Kette. Sie gehört zu
[`FORSCHUNGSFOERDERUNG.md`](FORSCHUNGSFOERDERUNG.md), wo steht, wofür.

> **Nicht die Menge zählt, sondern die Geschlossenheit.** Sechs Repos mit einer
> erkennbaren Linie wiegen mehr als fünfzehn ohne. Ein Gutachter fragt nicht
> „wie viel ist offen", sondern „ist die Kette geschlossen".

---

## Die sechs Glieder

Alle unter **MIT-Lizenz** — nutzen, kopieren, verändern und weitergeben ist
erlaubt, auch geschäftlich. Bedingung ist die Namensnennung.

| # | Repo | Was es im Korpus beweist | MIT seit |
|---|---|---|---|
| 1 | **[Sage-Protokol](https://github.com/lausiklauskn-png/Sage-Protokol)** | die **Spezifikation** — Module, Verträge, Glossar, Proben, Papers, Meilensteine | von Anfang an |
| 2 | **[SB·KIMTool·Point](https://github.com/lausiklauskn-png/SB-KIMTool-Point)** | das **Modell** — eine Rollen-Kette, die einen aufgezeichneten Lauf zeigt und das ehrlich dazusagt | von Anfang an |
| 3 | **[mycel-karte](https://github.com/lausiklauskn-png/mycel-karte)** | das **Messinstrument** — die lebende Netz-Karte, mit der überhaupt sichtbar wurde, ob Knoten sich finden | von Anfang an |
| 4 | **[Kim-Bell](https://github.com/lausiklauskn-png/Kim-Bell)** | die **Vorlage** — die kanonische, 1:1 kopierbare Netz-Anmeldung (Modul 23) | 2026-08-23 |
| 5 | **[Kimseek](https://github.com/lausiklauskn-png/Kimseek)** | die **Suche** — semantische Bedeutungs-Suche als eigener Knoten | 2026-08-23 |
| 6 | **[Kimboard](https://github.com/lausiklauskn-png/Kimboard)** | die **Pinnwand** und die **Moderations-Werkzeuge** — Sperr-Liste, Relais-Wache, Relais-Grenzen, je mit Gegenprobe | 2026-08-23 |

Dazu, in diesem Repo:

| Ort | Was es beweist |
|---|---|
| **[`docs/werkstatt/`](werkstatt/)** | die **Regel-/Grundsatz-Trennung** — Momentaufnahme aus Kimhub, samt dem, was daran *nicht* bewiesen ist |
| **[`docs/meilenstein/`](meilenstein/)** | die **datierten Belege** mit Bild |
| **[`docs/papers/`](papers/)** | die beiden Papers (DE/EN) |
| **[`sbkim-demo/`](../sbkim-demo/)** | der **erste lauffähige Stand vom 10. März 2026**, absichtlich so stehen geblieben |

---

## Die drei Stränge — und was sie verbindet

**1 · Semantische, bidirektionale, server-lose Suche.** Zwei Knoten ohne
gemeinsamen Hub beantworten einander nach Bedeutung. Belegt und datiert:
Zwei-Knoten-Suche (2026-07-10), hub-unabhängige Cross-Knoten-Fragen (2026-07-11),
Mesh-Handshake über mehrere Knoten (2026-07-23) — siehe
[`MEILENSTEIN_SEMANTISCHE_SUCHE.md`](MEILENSTEIN_SEMANTISCHE_SUCHE.md).

**2 · Grundsatzbasiertes gegenüber regelbasiertem Lenken.** Was lässt sich
erzwingen, was muss man fragen? Material und ehrlicher Befund in
[`werkstatt/`](werkstatt/).

**3 · Was die Nutzung mit Menschen macht.** Suchtpotenzial, Vermenschlichung,
Übervertrauen, Verlernen. **Am wenigsten belegt von den dreien** und ohne
methodischen Partner nicht weiterzubringen —
[`FORSCHUNGSFOERDERUNG.md` § 2.3](FORSCHUNGSFOERDERUNG.md).

### Was die drei zusammenhält

**Bidirektionalität.** Die Suche fragt **und** antwortet — beide Seiten, keine
Hierarchie. Und die Beobachtung über Mensch und KI hat **dieselbe Figur**: der
Mensch prägt die KI über Grundsätze, die KI prägt den Menschen über Gewöhnung.

Beides in nur eine Richtung zu denken ist der Fehler. Beides zusammen ist die
These — und der Grund, warum die drei Stränge **ein** Vorhaben sind und nicht
drei nebeneinander.

---

## Was ausdrücklich NICHT im Korpus liegt

Damit niemand danach sucht und damit die Grenze klar ist:

- **Die Geschäfts-Apps** behalten ihre eigene Nutzungslizenz: WorkFloh, Tomys Hub,
  BookLedgerPro, Alis Moderaum, Perfect Skin (beide), Rezeptbuch (beide),
  Mixarium, Küchenzettel, Private Brain, Company Brain, die Tresore — und die
  beiden Marktplätze family-project und PWA Toolpoint.
  **Sie tragen das Protokoll trotzdem offen:** Ziffer 5 jeder Nutzungslizenz
  stellt die SBKIM-Module unter MIT. Zu ist nur die App-Hülle.
- **Kimhub** bleibt privat. Seine Git-Historie trägt Rechnungsdaten aus der Zeit
  vor dem 2026-08-22; eine offene Lizenz wäre eine Einladung zum Forken, und ein
  Fork nimmt die Historie mit. Der Forschungsteil liegt stattdessen als
  Momentaufnahme in [`werkstatt/`](werkstatt/). Begründung dort.

## Ehrlichkeit über den Stand

- **Die Papers tragen noch keinen DOI.** Der Zenodo-Schritt steht aus
  ([`FORSCHUNGSFOERDERUNG.md`](FORSCHUNGSFOERDERUNG.md), Stufe B1). Bis dahin
  sind sie Dateien in einem Depot, keine zitierfähigen Quellen.
- **Ein Blatt „Stand der Technik und Abgrenzung" fehlt** — gegen IPFS,
  ActivityPub, Matrix, Solid, libp2p, Nostr und zentrale Vektor-Suchen. Ohne es
  wirkt der Korpus naiv, mit ihm belesen. Stufe B2.
- **Klaus' Browser-Sichttest ist nicht ersetzbar.** Headless beweist die Logik,
  nicht wie es sich am Tablet anfühlt.
- **Was in `werkstatt/BEFUND.md` als nicht bewiesen steht, ist nicht bewiesen** —
  keine Kontrollgruppe, kein Maß, Fallzahl eins, nicht verblindet.
