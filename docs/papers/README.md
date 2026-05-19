# docs/papers/ — dokumentengestützte Stationen der Sonnen-Galaxie

Dieser Ordner trägt die **dokumentengestützten Stationen** der
Sonnen-Galaxie (Sage-Geschichts-Galerie, Vision-Anker 10 in
`docs/PULS.md`). Heute stehen hier **zwei** Dateien:

| Datei | Station | Eintrag in `index.html` |
|---|---|---|
| `sbkim-paper-en.html` | Station 4 · Wissenschaftlicher Niederschlag — SBKIM-Paper (EN) | `STATIONS_DATA[3]` (status `live`, `href` zeigt auf diese Datei) |
| `sbkim-paper-de.html` | Station 5 · Wissenschaftlicher Niederschlag — SBKIM-Paper (DE) | `STATIONS_DATA[4]` (status `live`, `href` zeigt auf diese Datei) |

## Zweck

Die Geschichts-Galerie zeigt **vier** Stationen der Sage-
Entwicklung als Galaxien, die auf einer gemeinsamen Ellipsen-
Bahn um ein zentrales Sonnen-Zentrum tanzen. Drei davon sind
**text-only** und tragen ihren Erzähl-Text direkt im
`STATIONS_DATA`-Array (per Folge-Mini-Pflegen nachgezogen). Die
vierte Station ist **dokumentengestützt** — ihr Modal verlinkt
auf eine echte HTML-Datei, die hier im Repo liegt. Das ist die
einzige Daseinsberechtigung für diesen Ordner.

## Wachstums-Disziplin

- **Neue Stationen** kommen primär als **text-only** dazu — die
  Bahn-Ellipse skaliert ihre Phasen-Verteilung automatisch
  (`360° / n`). Kein Datei-Anker nötig.
- **Neue dokumentengestützte Stationen** brauchen genau zwei
  Dinge: eine `.html`-Datei in diesem Ordner und einen Eintrag
  mit `status: 'live'` + `href: 'docs/papers/<datei>.html'` in
  `STATIONS_DATA` in `index.html`.
- **Pflege ist ein eigener Mini-PR** — neue Datei einchecken,
  Modul-Code nicht anfassen, INTERFACES.md nicht anfassen.

## Heilige Tafel — Privatheit

Vision-Anker 10 (`docs/PULS.md`) trägt eine ausdrückliche
**Privatheits-Klausel**: die Sonnen-Galaxie darf den Namen
eines bestimmten kommerziellen Kontextes **nicht** erwähnen.
Wer hier eine neue Datei einlegt oder eine Station mit Erzähl-
Text füllt, prüft das vor dem Commit. Details siehe PULS § Anker
10 § Heilige Tafel.

## Verweis

Vollständige Architektur, Bahn-Mathematik, Stationen-Inventar
und Status: `docs/PULS.md` § Vision-Anker → „2026-05-18 ·
Sonnen-Galaxie — Sage-Geschichts-Galerie" (Anker 10).
