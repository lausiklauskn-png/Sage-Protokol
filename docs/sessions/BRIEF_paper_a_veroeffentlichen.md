# Brief für die nächste Sitzung — Paper A veröffentlichen

*Geschrieben am 2026-09-03, nach der Sitzung „Der Zenodo-DOI".*

---

## Wo wir stehen

**Das SBKIM-Papier ist veröffentlicht.** Beide Sprachfassungen, ein Zenodo-Eintrag:

```
10.5281/zenodo.22277738   diese Fassung (Version 2.0)  →  steht IM Papier
10.5281/zenodo.22277737   das Werk, alle Fassungen     →  für dauerhafte Verweise
```

Vorabdruck, offen, CC BY 4.0, von Klaus im Browser geprüft — der Link löst auf.

Damit ist der Weg einmal gegangen, und **er ist der Bauplan für Paper A.**

## Deine Aufgabe: Paper A veröffentlichen

**Thema:** *Regeln und Grundsätze — zwei Arten, ein KI-System zu lenken, und
warum keine allein genügt.* Klaus nennt es „grundsatzbasierte Regelsteuerung".

### Was schon da ist

| | |
|---|---|
| **Das Papier** | `docs/papers/PAPER_A_regeln-und-grundsaetze.md` — **1.842 Zeilen**, Fassung 1 vom 2026-08-23 |
| **Das Gerüst** | `docs/papers/PLAN_PAPERS.md` § Paper A |
| **Das Material** | in **Kimhub**: `schicht/grundsaetze.md`, die Werkstatt, das Fahrtenbuch |
| **Der Rahmen** | `PLAN_PAPERS.md` § Der gemeinsame Rahmen — der Satz, der in jedem der drei Papers oben stehen soll |

⚠ **Das Papier liegt in SAGE, das Material in KIMHUB.** Klaus sagte zuerst
„Kimhub" und hat sich gleich berichtigt. Wer in Kimhub nach dem Papier sucht,
findet nur die Grundsätze und die Sitzungsbriefe.

### Was fehlt

| | |
|---|---|
| HTML-Fassung | fehlt — bei SBKIM war sie die **Quelle**, aus der das PDF entsteht |
| PDF | fehlt |
| englische Fassung | fehlt (SBKIM hat beide; ob Paper A eine braucht, entscheidet Klaus) |
| Literaturarbeit | im Plan als offen benannt: 15–40 Titel. **Volltexte sind aus der Umgebung gesperrt** |

### ⚠ Die Stelle, an der dieses Papier kippen kann

**Sie steht schon im Plan**, und sie ist ernster als alles Formale:

> Es gibt **keine Kontrollgruppe und kein Maß**. Ein Gutachter sieht das im
> ersten Absatz.

Genau daran ist das SBKIM-Papier am 2026-09-02 vom Neuheits-Anspruch auf
**Feldbericht** umgestellt worden. Paper A trägt im Untertitel schon „Eine
Feldbeobachtung" — **prüfe, ob der Rest des Textes das durchhält**, bevor
irgendetwas gebaut wird. Ein Titel, der mehr behauptet als gemessen ist, kostet
später mehr als er einbringt.

## Der Weg, der bei SBKIM getragen hat

Diese Reihenfolge ist erprobt, halte sie ein:

```
1. Markdown → HTML          (das Layout der SBKIM-Papers als Vorlage nehmen)
2. node tools/paper-zu-pdf.mjs docs/papers/<datei>.html
3. node tools/paper-pdf-pruefen.mjs <datei>.pdf
4. bei Zenodo: DOI RESERVIEREN, bevor die Dateien hochgehen
5. DOI in die HTML eintragen, PDF neu bauen, hochladen
6. veröffentlichen
```

**Schritt 4 ist der Schlüssel**, und er hat zwei Sitzungen gekostet, bis er
gefunden war. Zenodo sagt es selbst: *„Reservieren Sie eine DOI, damit sie vor
dem Hochladen in die Dateien eingefügt werden kann."*

### Die zwei Werkzeuge, die es jetzt gibt

```bash
node tools/paper-zu-pdf.mjs docs/papers/<datei>.html
node tools/paper-pdf-pruefen.mjs <datei>.pdf
```

Das erste baut das PDF (Schriften per `curl` in eine Arbeitskopie, Depot
unberührt, Prüfung **vor** dem Druck — schlägt sie fehl, entsteht kein PDF).
Das zweite misst am fertigen PDF, ob eine Tabelle über eine Seitengrenze läuft.

⚠ **Chromium kommt aus dem Container nicht an Google Fonts** und setzt still
eine Ersatzschrift ein. `curl` kommt durch. Das ist im Werkzeug gelöst; wer ein
eigenes baut, tappt hinein.

### Die Druck-Entscheidungen, die schon getroffen sind

Sie stehen als Kommentar in den SBKIM-Papers und gelten für Paper A genauso:

- `@page { size:A4; margin:15mm 14mm }` — **der Rand steht im Dokument**, nicht
  im Werkzeug. Zwei Stellen für dieselbe Entscheidung laufen auseinander.
- `.abstract { break-after:page }` — Deckblatt für sich, Einleitung ab Seite 2.
- `table { break-inside:avoid }` — Tabellen bleiben ganz. **Nur weil sie klein
  genug sind**: alle fünf liegen unter der halben Seite. Wächst eine, kippt die
  Entscheidung zurück.
- `h2 + p { orphans:4 }` — ein Thema zerfällt nicht am Seitenrand.
- Schlussabschnitte auf eigene Seiten (`.eigene-seite`), Quellen einspaltig
  darunter. **Nicht mehrspaltig** — Chromium schiebt einen Spalten-Kasten als
  Ganzes weiter, und dann passt nichts mehr.

## Was NICHT mehr offen ist

- **Sages Netz-Identität** bleibt bei `BgjXhSAp…` (Klaus 2026-09-03). Der
  Punkt ist entschieden, nicht vertagt.
- **Die neue Selbstbeschreibung** hängt daran und ist damit ebenfalls vom Tisch,
  bis Klaus sie von sich aus aufmacht.
- **Die alten Zenodo-Entwürfe** sind gelöscht.

## Zwei Dinge, die diese Sitzung teuer gelernt hat

**Zwei Sitzungen liefen am 2026-09-03 parallel auf denselben Dateien.** PR #939
und #940 bearbeiteten denselben Auftrag, ohne voneinander zu wissen; aufgefallen
ist es erst am `mergeable_state: "dirty"`. Beide hatten gemessen, in einem Punkt
hatte #939 recht und diese Sitzung falsch. **Vor der Arbeit deshalb nicht nur
`git fetch`, sondern auch nachsehen, ob ein offener PR dieselben Dateien
anfasst.**

**Und: über eine Seite, die man nicht sehen kann, spricht man nicht.** Ich habe
behauptet, der Löschen-Knopf für Zenodo-Entwürfe stehe in der Übersicht. Klaus
hat widersprochen und hatte recht. `zenodo.org` und `doi.org` sind aus dieser
Umgebung **gesperrt** (403 vom Egress-Proxy) — jede Aussage über diese Seiten
ist geraten, und das gehört dazugesagt.

## Pflichtlektüre

1. `CLAUDE.md`
2. `docs/PULS.md` — die zwei obersten Einträge (beide vom 2026-09-03)
3. `docs/papers/PLAN_PAPERS.md` — **besonders § „Die Stelle, an der dieses
   Papier kippen kann"**
4. `docs/papers/README.md` — die DOI-Rollenverteilung und die Ein-Quelle-Regel
5. `docs/NETZWEIT.md` § 6a und § Für wen sie gelten

## Pflicht am Sitzungsende

`PULS.md` fortschreiben · **Abschlussbrief mit Stundennachweis** nach
`docs/sessions/archiv/` · Commit und Push auf den vorgegebenen Branch ·
**„Vorgeschlagene nächste Schritte" direkt in der Chat-Antwort** · den nächsten
Brief **vollständig als Codeblock im Chat**. Die Kette reißt nie ab.

⚠ `PULS.md` steht bei rund 2.856 von 3.000 Zeilen. **Die nächste Sitzung lagert
aus — auslagern, nicht kürzen.** Vorbild: die Blöcke vom 2026-08-23 und
2026-08-24 im Archiv.
