# Brief — „Wählen"-UI: Umschalter grob ↔ genau (verbunden ↔ verwandt)

> **Freibrief gilt** (CLAUDE.md § Freibrief). Vor jedem Urteil/Bau:
> `git fetch origin main` + `git ls-tree -r origin/main` + md5 — NIE aus dem
> Working-Tree schließen (Stale-Checkout-Lehre).

## Auslöser (Klaus, 2026-06-28)

Klaus' Idee, wörtlich sinngemäß: „Was wäre, wenn man **zwei Messungen wählen
könnte — eine mit einem niedrigen und eine mit einem genaueren Cosinus-Wert?**"
— Das traf **genau** das in Bau 04.E (PR #480) gebaute Zwei-Maß-Design. Klaus:
„eine geniale Sache … genau mein Gedanke. Sehr, sehr gut." Diese Folge-Sitzung
**verdrahtet** das schon gebaute zweite Maß in eine **sichtbare Auswahl**.

## Stand (erledigt, liegt auf `main` nach Merge PR #480)

Modul 04 hat **zwei** Cosinus-Maße nebeneinander (beide rein, sync, getestet):

| | grob / niedrig | genau / fein |
|---|---|---|
| Funktion | `SbkimMatch.match(a,b)` (roher Cosinus) | `SbkimMatch.relatedness(a,b)` (zentriert) |
| Schwelle | `PROVIDER_MIN_MATCH = 0.80` (Andock-Boden, **gatet** Handshake) | `RELATEDNESS_MIN = 0.30` (**gatet nichts**) |
| Frage | „dürfen sie sich **verbinden**?" | „**wie verwandt** sind sie wirklich?" |

Smoke: `tests/smoke_bau04e_relatedness.mjs` 29/29. Lehre/Tafel:
`docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` (Stand 2026-06-28 Abend),
`INTERFACES.md` §0/§1 Modul 04.

## Erweiterung (Klaus 2026-06-28) — diese Erkenntnis AUF DIE SUCHE anwenden

Klaus' Auftrag: die gerade entworfene Erkenntnis **anwenden** — vor allem auf
das **Such-Werkzeug / die Suchmaschine (Modul 22)**, und bei der **Pinnwand**
**prüfen, ob sie davon profitiert** (Klaus war unsicher; **Befund dieser
Brief-Pflege: ja, die Pinnwand sortiert ebenfalls „nach Bedeutung"** — sie nutzt
`embedQuery`/`embedPassage` + einen `.a-score` (Cosinus) + optionalen
`.a-judge` (KI-Richter); funktioniert also semantisch sehr ähnlich zur Suche).

**Klaus' Kern-Gedanke (wörtlich sinngemäß):** Beim Suchen braucht es einen
**Vergleichswert** zwischen *dem, was ich suche* und *dem, was eine
Internetseite anbietet* — „wie genau stimmt der **Inhalt der Seite** mit meinem
**Gesuchten** überein?". Wenn dieser Vergleich **schon allein über den Cosinus
gut funktioniert**, ist **nicht zwingend ein zusätzliches Tool / eine KI nötig** —
die Einordnung/Sortierung ist schon relativ genau. **Die zwei Schlüsselpunkte,
an denen die Suche besser wird:**

1. **Der (zentrierte) Cosinus** als Vergleichswert — `relatedness()` über
   `match()` hinaus liefert ein *ehrliches* „wie nah ist das wirklich".
2. **Die inhaltsgetreue Vektor-/Sporen-Erzeugung** (`embedContentVector` — der
   Vektor entsteht aus dem **echten Inhalt** der Seite/des Knotens, nicht aus
   einer Hüllen-Beschreibung).

Zusammen ergeben sie einen **gratis, KI-freien, schon recht genauen
Vergleichswert**. Der **KI-Richter bleibt optional** — er ist die *Kür* (für
Grenzfälle / Erklärtext), nicht die *Pflicht*. Das senkt Kosten + Abhängigkeit
und macht die Suche server-los/offline stark.

**Konkret für diese Folge-Sitzung — zusätzlich zum Umschalter (unten):**
- **Modul 22 (Such-Werkzeug):** den **gratis semantischen Pfad als
  vollwertigen Default** behandeln — Query-Vektor ↔ Treffer-Inhalts-Vektor via
  (zentriertem) Cosinus als Vergleichswert/Sortierung; KI-Richter ausdrücklich
  **opt-in**, nicht Voraussetzung. Wo Treffer-Inhalte vorliegen, deren Vektor
  inhaltsgetreu bilden (`embedContentVector`), nicht aus Titeln/Hüllen allein.
- **Pinnwand prüfen + ggf. anwenden:** schaut, ob `.a-score` vom rohen auf den
  **zentrierten** Cosinus gehoben werden soll (ehrlichere Bedeutungs-Sortierung)
  und ob der Richter dort ebenfalls *opt-in* statt automatisch laufen kann.
  **Nur anwenden, wenn es dort wirklich besser wird** — Pinnwand-Mechanik (Nostr
  Q&A-Brett) erst lesen, dann entscheiden (kein Zwang).

## Aufgabe dieser Sitzung

Einen **Umschalter** dort einbauen, wo Treffer/Knoten angezeigt werden, mit
zwei Modi:

- **Modus „verbunden" (grob):** alle erreichbaren Knoten/Treffer (Andock-Boden
  0.80) — das heutige Verhalten.
- **Modus „verwandt" (genau):** nur die zentriert wirklich verwandten
  (`isRelated`, ≥ `RELATEDNESS_MIN`), **nach `relatedness()` absteigend
  sortiert** — der ehrliche Themen-Bezug.

**Zwei mögliche Einbau-Orte (Sitzung entscheidet, ggf. beide):**
1. **Such-Widget (Modul 22)** — Treffer-Sortierung/Filter-Schalter „verbunden ↔
   verwandt". Naheliegend, weil das Widget schon Treffer rendert.
2. **Rendezvous-Andock-Anzeige (Modul 23 UI)** — pro Knoten im Raum den
   zentrierten Verwandtschafts-Score als Badge zeigen (z. B. „verwandt 0.72"
   vs „verbunden"), optional „nur verwandte zeigen"-Haken.

## Datenverträge (nicht brechen)

- **Reine Anzeige-Schicht.** `relatedness()` **gatet nichts** — der Andock-
  Handshake (Modul 05, `PROVIDER_MIN_MATCH`) bleibt **unverändert**. Der
  Umschalter filtert/sortiert NUR die Darstellung.
- Beide Vektoren sind `Float32Array(384)`, L2-normiert (Modul 03). `relatedness`
  wirft `InvalidVectorError` bei falscher Eingabe — fail-soft umschließen.
- Default-Modus = **„verbunden" (grob)**, damit nichts an der gewohnten Sicht
  überrascht; „verwandt" ist die bewusste Wahl.
- `MEAN_VECTOR` (`RELATEDNESS_CENTER`) ist v1 aus 7 Vektoren — **nicht** in
  dieser Sitzung neu rechnen (eigener Folge-Schritt „größeres Referenz-Korpus").

## Akzeptanzkriterien

1. Umschalter sichtbar + bedienbar (benannter Knopf/Toggle, kein Konsolen-Pfad).
2. „verwandt"-Modus zeigt echte Paare oben, fremde Domänen ausgeblendet/unten
   (an den Referenz-Vektoren nachprüfbar: Schwestern/Essen-Trinken oben,
   Sage↔BLP raus).
3. Headless-Smoke für die Filter-/Sortier-Logik grün (reine Funktion testbar).
4. Andock-Verhalten unverändert (Regressionscheck: Handshake gatet weiter 0.80).
5. Tafeln nachgezogen (Karte 22 bzw. 23, PULS, ggf. SIGNAL §11.6).
6. **Browser-Sichttest** des Umschalters wartet auf Klaus (headless ersetzt ihn
   nicht).

## Reihenfolge

1. Pflichtlektüre (unten) + Modul-04-Surface (`relatedness/isRelated/
   RELATEDNESS_MIN`) + Ziel-Modul-Code (22 oder 23 UI) lesen.
2. Kurzen Plan an Klaus (welcher Einbau-Ort zuerst), dann bauen.
3. Smoke + Tafeln + PR (Freibrief: additiv + grün + abgegrenzt → mergebar).

## Offene Fragen an Klaus

- **Welcher Ort zuerst** — Such-Widget (Modul 22) oder Andock-Anzeige (Modul 23)?
  (Empfehlung: Such-Widget, da es schon Treffer listet.)
- Soll „verwandt" **filtern** (fremde ausblenden) oder nur **umsortieren**
  (alle zeigen, verwandte oben)? (Empfehlung: umsortieren + optionaler Haken
  „nur verwandte".)

---

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)

1. Dieser Brief.
2. `CLAUDE.md` (Freibrief, Konventionen).
3. `docs/PULS.md` (oberster Eintrag: Bau 04.E).
4. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` (Stand 2026-06-28 Abend —
   die Zwei-Maß-Begründung).
5. `INTERFACES.md` §0 (`RELATEDNESS_MIN`) + §1 Modul 04 (Surface).
6. Code des Ziel-Moduls (`src/modules/22_such_widget.js` ODER
   `sbkim/23_rendezvous_ui.js`) + `src/modules/04_match.js`
   (`relatedness`/`isRelated`).

## Abschluss-Pflicht (die Kette reißt nie ab)

PULS fortschreiben, Übergabeprotokoll, „Nächste Schritte"-Block im Chat,
neuen Brief als Codeblock im Chat. SIGNAL §11.6 falls netz-relevant gemeldet.
Kern-Match bleibt unberührt — diese Sitzung ist **reine Anzeige**.
