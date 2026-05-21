# Sage-Protokol — Sitzungs-Anker

**Lies diese Datei zu Beginn jeder neuen Sitzung. Sie ist das Pulsblatt.**

---

## Was dieses Repo ist

Sage-Protokol ist **Hub und Knoten zugleich** für das SBKIM-Protokoll
(Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel): der
**Spezifikations- und Bau-Hub** für alle SBKIM-Module **und** ein
eigener Endknoten mit eigener Domäne. Mit Spec-Sitzung V1 Sage-
Hybrid (Brief 01 der V1-Sammelspec-Kaskade, 2026-05-18) wird die
Konvention `NODE_TYPE_DEFAULT = "hybrid"` aus INTERFACES §0
endlich selbstreferenziell wahr.

Drei gleichwertige Endknoten kennt das Sage-Mycel:

- **Rezeptbuch** (externes Repo, kuratierte Domäne: Kochrezepte)
- **Mixarium** (externes Repo, kuratierte Domäne: Cocktails / Drinks)
- **Sage** (dieses Repo, kuratierte Domäne: Mycel-Bibliothek —
  SBKIM-Glossar, Protokoll-Doku, heilige Tafeln). Spec in
  INTERFACES §6 Endknoten-Liste + §6.1 Sage-Page-Architektur;
  Bau via Sage-Page-Refactor-Bau-Sitzung aus der BRIEF_99-Liste,
  sobald die Kaskade schließt (volle `init()`-Kette aller SBKIM-
  Module, Andock-Wizard an der Schwarz-Loch-Karte).

Hier in Sage-Protokol entstehen die **Module**, die anschließend per Copy-Paste
in die echten Apps eingebaut werden. Hier liegen außerdem die **Spezifikationen**,
das **Glossar** und die **Tests**.

## Wer ist der Betreiber

Klaus. Kein Programmierer, lernbereit. Arbeitet bevorzugt mit PWAs als
Single-File-`index.html`. Hat aktuell drei Nutzer (zwei davon installiert).
Tonalität: ruhig, präzise, ohne Imponiergehabe. Antworten auf Deutsch.

### Arbeitsumgebung (Pflege 2026-05-21)

**Hardware:** Samsung Galaxy Tab S6 (Android-Tablet). Wechselt zwischen
**Tablet-Modus** und **DeX-Modus** (Desktop-ähnliche UI mit externem
Bildschirm + Maus + Tastatur). DeX-Chrome und Tablet-Chrome sind
**zwei getrennte Browser-Instanzen** — eigene IndexedDB, eigene
Service-Worker, eigene PWA-Liste (siehe `docs/OBSERVATORIUM_BROWSER.md`
Lehre 1 / Lehre 7).

**Werkzeuge:**

- **Chrome-Browser** für Sage-Page, Endknoten-PWAs, GitHub-Browser-UI
  (Pull-Requests reviewen).
- **Termux** (Linux-Userland auf Android): `git pull` /
  `git status`, `python3 -m http.server 8000` für lokalen Sichttest
  von `tests/manual_check.html`. KEIN Code-Editor-Workflow.
- **Eruda** (in-Page-DevTools-Polyfill) nur dort, wo es explizit in
  einer PWA eingebaut ist — typisch bei Live-Andock-Sichttests an
  Endknoten-PWAs. **Nicht eingebaut** in `tests/manual_check.html` —
  Modul-Sichttests laufen ausschließlich über die Test-Bridge-Knöpfe
  in den Panels, nicht über eine Konsole.

**Sichttest-Stil:**

- **Knöpfe statt Konsole.** Test-Bridges in `tests/manual_check.html`
  bieten benannte Knöpfe pro Test-Punkt mit `<pre>`-Output. Wer einen
  neuen Sichttest-Pfad oder eine Wartungs-Operation (z.B. State-
  Aufräumen) braucht, ergänzt sie als Knopf in der passenden Panel-
  Sektion mit eigener Pflege-Sitzung + eigenem PR — KEINE Konsolen-
  Befehle für Klaus.
- **Hard-Reload als Cache-Bust** (Strg+Shift+R bzw. „Cache leeren und
  neu laden" im Chrome-Menü) nach jedem Repo-Pull, weil Pages-Service-
  Worker und Browser-HTTP-Cache jeweils hartnäckig sind. Siehe
  `docs/OBSERVATORIUM_BROWSER.md` Lehre 4.
- **Klaus' Browser-Sichttest ist nicht ersetzbar.** Headless-Smoke-Tests
  bestätigen Modul-Logik, aber jeder echte Bug zeigt sich erst am
  Tablet. Bau-Sitzungen schließen explizit mit „Sichttest ungeprüft,
  wartet auf Klaus' Browser-Lauf" — keine Sitzung markiert sich
  selbst als grün ohne Klaus.

**Kommunikations-Stil:**

- **Einzelschritte, nicht Block-Anweisungen.** Klaus verirrt sich beim
  Scrollen, wenn eine Anleitung mehrere copy-paste-Stücke + mehrere
  Browser-Aktionen mischt. Konvention: pro Antwort EIN konkreter
  Schritt mit klarem Erfolgs-Indikator, dann auf Rückmeldung warten.
- **Copy-Paste-Blöcke** sind kompakt, vollständig, und gehören in einen
  Test-Bridge-Knopf-Handler (eigener PR) ODER in eine Eruda-Konsole
  (nur wenn Eruda auf der jeweiligen Page eingebaut ist) — NICHT in
  die Chrome-Adressleiste (die deutet das als Suchanfrage).
- **GitHub-Mergen** läuft über die Bau-Sitzung per GitHub-API auf
  Klaus' Zuruf („PR XYZ mergen"), KEIN Klick-Workflow auf der Web-UI
  für Klaus.

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

### Tafel-Evolutions-Klausel (Pflege 2026-05-19)

Heilige Tafeln sind verbindlich, **aber nicht ewig**. Eine Tafel gilt, bis
eine neuere Erkenntnis sie widerlegt — z.B. ein Sichttest-Befund, ein Live-
Andock-Beweis, ein Architektur-Schluss aus einer Folge-Spec, oder einfach
Klaus' Lehre aus dem praktischen Einsatz. Wenn alter Vertrag neue
notwendige Arbeit verbietet, ist nicht die neue Erkenntnis falsch, sondern
die Tafel verlangt eine bewusste Aktualisierung.

**Disziplin für jede Sitzung:**

- **Nicht stoisch befolgen.** Tafel als absolute Aussage zu lesen, wo sie
  scope-spezifisch gemeint war, blockiert legitime Arbeit.
- **Nicht stillschweigend umgehen.** Die Tafel mit einem Workaround
  umfahren, ohne die Spannung zu benennen, hinterlässt eine vergiftete
  Doku-Lage für die nächste Sitzung.
- **Stattdessen: Klaus EXPLIZIT auf Anpassungs-Bedarf hinweisen.** Konkret
  benennen: welche Tafel, welche neue Erkenntnis, welche Anpassung
  vorgeschlagen, warum notwendig + vorteilhaft. Klaus entscheidet, ob die
  Tafel umformuliert wird oder die neue Arbeit anders zu lösen ist.

**Bezeichnungs-Konvention:** „Diese-Sitzung-nicht"-Tafeln (z.B. „KEIN
Modul-01-Eingriff in Bau 02.Y") sind scope-disziplin, **kein** absolutes
Verbot. Sie verbieten den Eingriff *in dieser konkreten Bau-Sitzung*, um
das PR-Scope sauber zu halten — sie erlauben aber eine eigene Folge-Pflege-
Sitzung mit eigenem Brief, eigenem PR. Wenn eine Folge-Pflege nötig wird,
ist das ein gültiger Anpassungs-Grund (siehe oben).

**Bezugs-Beispiel:** der Befund 2026-05-19 aus Klaus' Bau-02.Y-Sichttest —
Modul 01 `init()` ist nicht versions-fail-soft (Test-Stores aus früheren
Sichttests blockieren jeden neuen init mit `VersionError`). Die Tafel
„KEIN Modul-01-Eingriff" (Brief 02.Y) war scope-bezogen für genau diese
Bau-Sitzung; eine eigene Pflege-Sitzung Modul 01 ist die saubere Anpassung
und wird als Folge-Sitzung in der Brief-99-Pipeline nachgezogen.

## Pflicht am Sitzungsende

Bevor du `END` machst:

1. **`docs/PULS.md` aktualisieren.** Mindestens: Datum, was du getan hast,
   was offen blieb, was als nächstes ansteht.
   - **Wenn du `status.json` geändert hast:** vorher
     `python3 scripts/update_puls_pie.py` ausführen — das zieht den
     Mermaid-Pie-Block oben in PULS.md automatisch aus `status.json`
     nach. Niemals den Pie-Block in PULS.md von Hand bearbeiten.
   - **Zeilen-Begrenzung:** PULS.md hat eine Schutz-Klausel (Header der
     Datei, 2026-05-17): Grenze 3000 Zeilen, NICHT herabsetzen. Bei
     drohendem Überschreiten Sitzungen ins Archiv auslagern, nicht
     kürzen.
2. **Übergabeprotokoll** in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`
   anlegen. Format: siehe `docs/sessions/BRIEFING_TEMPLATE.md`.
3. Wenn du Code geändert hast: **manuell prüfen**, dass
   `tests/manual_check.html` in einem Browser noch funktioniert (oder
   begründet markieren "ungeprüft, weil ...").
4. Commit + Push auf `claude/semantic-agent-network-Y03Vg`. Ein Commit pro
   abgegrenzter Aufgabe, sprechende Message.
5. **„Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort am
   Sitzungs-Ende.** NICHT nur im Übergabeprotokoll — Klaus liest die
   Chat-Antwort am Tab; das Übergabeprotokoll sieht er erst in einer
   Folge-Sitzung. 2–4 priorisierte Schritte als Markdown-Liste, jede
   mit ein-Satz-Begründung + Reihenfolge-Hinweis (z.B. „setzt PR #X
   voraus", „nicht headless — wartet auf Klaus", „blockiert durch
   Befund Z"). Auch wenn dasselbe im Übergabeprotokoll
   § „Nächster sinnvoller Schritt" steht: hier doppeln. Das ist
   Klaus' Übersichts-Anker am Tab, ohne Datei-Öffnen.

## Vor dem nächsten Sitzungs-Brief (`Befehl schreiben`)

Wenn der Betreiber am Sitzungs-Ende `Befehl schreiben` tippt, prüfst du
**vor** dem Formulieren des Briefes den PR-Status — sonst startet die
nächste Sitzung auf falscher Grundlage und sucht Spuren, die nur in
ungemergten Branches lebten.

1. **Offene PRs auflisten** (`gh pr list --state open` bzw. das
   entsprechende MCP-Tool). Eigener Sitzungs-PR + alle parallelen.
2. **Pro PR eine Einordnung** abgeben: mergen / schließen / lassen,
   mit Konflikt-Risiko-Hinweis. Wo Konflikte zwischen mehreren PRs
   wahrscheinlich sind (gleiche Dateien, typisch PULS.md /
   INTERFACES.md), die Reihenfolge vorschlagen.
3. **Den Brief gegen den `main`-Stand schreiben**, nicht gegen die
   eigene Branch-Erwartung. Wenn der Brief Voraussetzungen aus einem
   ungemergten PR macht, das **explizit** nennen
   („setzt voraus, dass PR #X gemerged ist") **oder** den Merge zuerst
   anstoßen.
4. **Bei mehreren offenen PRs** dem Betreiber eine kurze Merge-
   Empfehlung vor dem Brief vorlegen (welche Reihenfolge, welche
   Methode, wer löst Konflikte). Der Brief kommt erst, wenn der
   Betreiber die Merge-Strategie bestätigt oder explizit „Brief auf
   aktuellem Stand, keine Merges" sagt.

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

## Die zehn Module + Schutz-Backlog 10-12 + Proaktiv-Backlog 14 + 15

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
| 14 | `docs/components/14_diffusion.md` | Diffusion-Backlog · Stub, Priorität niedrig |
| 15 | `docs/components/15_membran.md` | Membran-Backlog · Stub, Priorität niedrig |

Modul 00 (Doku-Fenster) ist die "5-Klick versteckte Funktion" in den
Suchleisten der Endknoten-PWAs. Modul 09 beschreibt, wie ein fertiges Modul
in Rezeptbuch / Mixarium eingebaut wird.

Module 10-12 sind reaktive Schutz-Module (Reputation, Rate-Limit, manuelle
Blocklist) — sie werden erst gebaut, wenn das Netz groß genug ist, dass
Apoptose und Match-Filter allein nicht mehr reichen. Stubs liegen schon, damit
keine Sitzung sie übersieht. Sichtbar gemacht in der Eigenschutz-Karte (Karte
13) der Sage-Page.

Karten 14 + 15 sind proaktive Backlog-Karten — **Diffusion** (14) arbeitet
nach innen (konsensuelle Empfehlung im Handshake, Wuchs durch Empfehlung),
**Membran** (15) arbeitet nach außen (Außenhülle zur Browser-Umgebung:
KI-Browser-Agenten und App-zu-App-Brücken im selben Browser ohne Server).
Stubs liegen schon, damit keine Sitzung sie übersieht. Beide werden in der
Sage-Page Karten 4 / 13 / 14 parallel zum Schutz-Backlog gerendert.

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
