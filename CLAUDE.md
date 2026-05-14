# Sage-Protokol — Sitzungs-Anker

**Lies diese Datei zu Beginn jeder neuen Sitzung. Sie ist das Pulsblatt.**

---

## Was dieses Repo ist

Sage-Protokol ist der **Spezifikations- und Bau-Hub** für das SBKIM-Protokoll
(Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel). Es ist **kein Endknoten**.
Die echten Endknoten sind die PWA-Apps des Betreibers:

- **Rezeptbuch** (externes Repo, kuratierte Domäne: Kochrezepte)
- **Mixarium** (externes Repo, kuratierte Domäne: Cocktails / Drinks)

Hier in Sage-Protokol entstehen die **Module**, die anschließend per Copy-Paste
in die echten Apps eingebaut werden. Hier liegen außerdem die **Spezifikationen**,
das **Glossar** und die **Tests**.

## Wer ist der Betreiber

Klaus. Kein Programmierer, lernbereit. Arbeitet bevorzugt mit PWAs als
Single-File-`index.html`. Hat aktuell drei Nutzer (zwei davon installiert).
Tonalität: ruhig, präzise, ohne Imponiergehabe. Antworten auf Deutsch.

## Wer du bist (jede Claude-Sitzung)

Du bist eine **Sitzung**, kein Mensch. Du arbeitest entweder als:

- **Hauptsitzung** — koordiniert, integriert, reviewt, schreibt PULS.md fort
- **Bausitzung** — baut genau ein Modul, kennt nur dessen Briefing

Welche Rolle du hast, sagt dir der Nutzer im ersten Prompt. Im Zweifel:
**frage, bevor du loslegst.**

## Pflichtleseliste (in dieser Reihenfolge)

1. Diese Datei (`CLAUDE.md`)
2. `docs/PULS.md` — was ist gerade los, was ist offen
3. `docs/ARCHITEKTUR.md` — das Gesamtbild
4. `docs/INTERFACES.md` — die Verträge zwischen den Modulen (verbindlich)
5. **Nur** die Komponenten-Karte des Moduls, an dem du arbeitest
   (`docs/components/<NN>_<name>.md`)
6. **Nur** der Code des Moduls, an dem du arbeitest

Alles andere liest du **nicht**. Token-Budget.

## Heilige Tafeln

`docs/INTERFACES.md` ist **verbindlich**. Wenn du eine Schnittstelle änderst,
musst du **zuerst** dort nachziehen, **dann** den Code. Andersrum produziert
Widersprüche zwischen Modulen.

## Pflicht am Sitzungsende

Bevor du `END` machst:

1. **`docs/PULS.md` aktualisieren.** Mindestens: Datum, was du getan hast,
   was offen blieb, was als nächstes ansteht.
   - **Wenn du `status.json` geändert hast:** vorher
     `python3 scripts/update_puls_pie.py` ausführen — das zieht den
     Mermaid-Pie-Block oben in PULS.md automatisch aus `status.json`
     nach. Niemals den Pie-Block in PULS.md von Hand bearbeiten.
2. **Übergabeprotokoll** in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`
   anlegen. Format: siehe `docs/sessions/BRIEFING_TEMPLATE.md`.
3. Wenn du Code geändert hast: **manuell prüfen**, dass
   `tests/manual_check.html` in einem Browser noch funktioniert (oder
   begründet markieren "ungeprüft, weil ...").
4. Commit + Push auf `claude/semantic-agent-network-Y03Vg`. Ein Commit pro
   abgegrenzter Aufgabe, sprechende Message.

## Was du nicht tust

- **Kein Modul-Code ohne Auftrag.** Eine Sitzung, die "nur orientieren"
  oder "Spezifikation erweitern" soll, schreibt **kein JS** in `src/`.
- **Keine Vermischung der Module.** Wer am Embedding arbeitet, fasst Apoptose
  nicht an. Querschnitts-Änderungen brauchen die Hauptsitzung.
- **Keine personenbezogenen Daten.** Weder im Code, noch in Specs, noch
  in Tests, noch in PULS.md.
- **Kein Crawler, keine Pulsation, keine Eigenanfragen ins offene Netz.**
  Siehe `sbkim_paper.pdf` und `docs/components/*` — der Knoten ist
  Empfangsmodus mit Antwortrecht.

## Die zehn Module + Schutz-Backlog 10-12

| # | Datei | Status (siehe PULS.md für Details) |
|---|---|---|
| 00 | `docs/components/00_doku_fenster.md` | spec ausstehend |
| 01 | `docs/components/01_storage.md` | spec ausstehend |
| 02 | `docs/components/02_spore.md` | spec ausstehend |
| 03 | `docs/components/03_embedding.md` | spec ausstehend |
| 04 | `docs/components/04_match.md` | spec ausstehend |
| 05 | `docs/components/05_anastomose.md` | spec ausstehend |
| 06 | `docs/components/06_heterokaryose.md` | spec ausstehend |
| 07 | `docs/components/07_apoptose.md` | spec ausstehend |
| 08 | `docs/components/08_ui_demo.md` | spec ausstehend |
| 09 | `docs/components/09_einbau_pwa.md` | spec ausstehend |
| 10 | `docs/components/10_reputation.md` | Schutz-Backlog · Stub, Priorität niedrig |
| 11 | `docs/components/11_rate_limit.md` | Schutz-Backlog · Stub, Priorität niedrig |
| 12 | `docs/components/12_blocklist.md` | Schutz-Backlog · Stub, Priorität niedrig |

Modul 00 (Doku-Fenster) ist die "5-Klick versteckte Funktion" in den
Suchleisten der Endknoten-PWAs. Modul 09 beschreibt, wie ein fertiges Modul
in Rezeptbuch / Mixarium eingebaut wird.

Module 10-12 sind reaktive Schutz-Module (Reputation, Rate-Limit, manuelle
Blocklist) — sie werden erst gebaut, wenn das Netz groß genug ist, dass
Apoptose und Match-Filter allein nicht mehr reichen. Stubs liegen schon, damit
keine Sitzung sie übersieht. Sichtbar gemacht in der Eigenschutz-Karte (Karte
13) der Sage-Page.

## Wenn du blockiert bist

Beim ersten echten Hindernis: **ende die Sitzung sauber**, dokumentiere im
PULS, schreibe das Hindernis als offene Frage in `docs/PULS.md` ans Ende.
Eine andere Sitzung, frischer Kontext, löst es schneller, als wenn du dich
festbeißt und Tokens verbrennst.

## Konventionen

- Sprache: Deutsch in Doku, Englisch in Code (Variablen, Kommentare).
- Datumsformat: `YYYY-MM-DD`.
- Knotentyp dieses Referenz-Repos / der Endknoten: **hybrid**.
- Protokoll-Version: siehe `docs/INTERFACES.md`, Feld `PROTOCOL_VERSION`.
