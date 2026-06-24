<!-- NOTIZ / PARKPLATZ (Klaus 2026-06-24): konkreter Bauplan für die nächste
     Sitzung. Bewusst NICHT eingebaut, NICHT verlinkt — nur Notiz. Berührt
     EXTERNE Repos (Mein-Mixarium, Mein-Rezeptbuch); Bau dort, eigener PR. -->

# Bauplan — Live-Such-Beweis Mixarium ↔ Sage (kleinster echter Schritt)

> Ziel: **einmal** beweisen, dass eine getippte Suche in Sage live an eine
> Geschwister-App geht und eine bedeutungs-sortierte Antwort aus deren
> **aktuellem Inhalt** zurückkommt — server-los, im selben Browser. Das ist das
> Hin-und-Zurück, das im Meilenstein noch als „offen" steht.

## Die tragende Erkenntnis (warum das überhaupt funktioniert)

**Inhalt schlägt Name.** `SbkimMatch.queryLocal` nimmt seinen Korpus über
`setLocalCorpus(provider)` — und das ist eine **Provider-Funktion mit Lazy-Lookup
zur Anfrage-Zeit**. Heißt: bei JEDER Anfrage wird der **aktuelle** App-Inhalt
durchsucht. Folge:

- Dieselbe App-Hülle mit Sushi beladen → antwortet auf „leichtes Sommeressen"
  mit Sushi; mit schwerer Kost beladen → antwortet schwach/leer. Automatisch.
- 1000 gleich benannte Instanzen, verschieden befüllt → jede antwortet aus
  ihrem eigenen aktuellen Inhalt. Der Name unterscheidet nicht — der **Inhalt**
  unterscheidet.
- **Identität eines Knotens = sein aktueller Inhalt, nicht sein Name.** Feature.

## Was schon GEBAUT ist (geprüft 2026-06-24)

- **Membran (Modul 15)** in Mixarium UND Rezeptbuch lauscht bereits auf
  `op:"query"`, ruft `SbkimMatch.queryLocal(text, k)` und antwortet mit
  `op:"queryResult"` (Senden/Empfangen/Antworten komplett, fail-soft).
- **`queryLocal` (Modul 04.C)** ist in **Sage** gebaut (`src/modules/04_match.js`),
  inkl. `setLocalCorpus(provider)`, Embedding-Anbindung (Modul 03), Cosinus-Rang,
  `PROVIDER_MIN_MATCH`-Schwelle, Rückgabe `{label, score, anchorId}`.
- Beide Apps laden den vollen Modul-Stack (00–08, 15, 16, 17, 18) + Identität
  (`spore.json`) → daher `verified-match`.

## Die EINE Lücke

Die Apps tragen eine **ältere** `04_match.js` **ohne** `queryLocal` → ihre
Membran antwortet heute nur `module-04c-not-available`. Plus: niemand hat der App
ihren eigenen Inhalt als Korpus angeschlossen.

## Die 3 Schritte (im Mixarium-Repo zuerst — klein, hat schon Suchfeld + Netz-UX)

1. **Modul nachziehen:** Sages aktuelles `src/modules/04_match.js` (mit
   `queryLocal`) als `sbkim/04_match.js` in Mixarium übernehmen. Reines
   Aktualisieren, kein Neubau. (Drift-Check: bytegleich zu Sage halten.)
2. **Korpus-Anschluss (das einzige echte App-Stück):**
   `SbkimMatch.setLocalCorpus(provider)` mit einer **LEBENDEN Funktion** rufen,
   die zur Anfrage-Zeit Mixariums **aktuelle** Drinks liefert:
   `[{ label: <Drink-Name>, anchorId: <Link>, passageVec|text: <Inhalt> }]`.
   - `label` = der **Drink** (z. B. „Virgin Mojito"), NICHT „Mein-Mixarium".
   - Inhalt lazy einbetten (Modul 03 ist geladen) oder vorab beim Laden der
     Drink-Liste.
   - Optional: ein kurzer **Knoten-Charakter** aus dem Korpus-Schwerpunkt
     („z. Z. überwiegend alkoholfrei") für die Treffer-Beschriftung.
3. **Sender in Sage:** das Such-Widget (Modul 22) schickt eine Live-Anfrage
   `op:"query"` per postMessage an die Mixarium-Zelle (statt nur im lokalen
   Knoten-Abzug `sage-knoten-korpus.js` zu suchen), sammelt `op:"queryResult"`
   und zeigt die Treffer nach `score` sortiert.

## Treffer-Benennung (Klaus' Namens-Frage)

Nicht nach App-Name. Nach **Inhalt**: `label` = das konkrete Stück (Drink/Rezept)
+ optional der lebende Knoten-Charakter. Beispiel-Zeile:
> **Virgin Mojito** · Getränke-Knoten, *z. Z. alkoholfrei geprägt* · 0,90 · [öffnen]

## Woran man „BEWIESEN" erkennt

- Tippe in Sage „fruchtiger Drink, wenig Alkohol" → echte Mixarium-Drinks kommen
  sortiert zurück, live, ohne Server.
- **Inhalts-Probe:** andere Drink-JSON in Mixarium laden → dieselbe App antwortet
  anders. Das beweist „Inhalt schlägt Name".

## Ehrliche Grenzen

- **Selber Browser** (Geschwister-Zellen). Fremde Rechner = später, mit dem
  dummen gemeinsamen Brett.
- Bau in **externen Repos** (Mixarium, dann Rezeptbuch) — eigener PR pro Repo,
  nicht in Sage.
- `domainVector`-Vorfilter optional später „inhalts-treuer" machen (eigene
  Folge); für den Beweis nicht nötig — `queryLocal` entscheidet live.

## Danach (Ausbau)

- Gleiches in **Rezeptbuch** → echte **Essen-+-Drink-Paarung** (deine Demo:
  Sage fragt beide, setzt ein Paar zusammen).
- Such-Feld jeder App wird selbst zum **Sender** (Such-Feld-Pattern) → Suche im
  Mixarium zieht auch passende Rezepte.

*Notiz, 2026-06-24. Vorlage: `docs/sessions/BRIEF_BAU_04C_QUERY_LOCAL.md`.
Verwandte Notizen (unverlinkt): `notiz-briefkasten-pinnwand.md`,
`notiz-kosten-nutzen.md`, `vorsehung-suche.md`. Sachstand:
`docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`.*
