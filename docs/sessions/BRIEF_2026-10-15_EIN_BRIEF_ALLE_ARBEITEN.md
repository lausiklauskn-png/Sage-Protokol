# Ein Brief für alle offenen Arbeiten (Stand 2026-10-15)

Klaus 2026-10-15: *„Es gibt ein Problem mit den anderen Sitzungen. Mach bitte einen einzigen
Sitzungsbrief, wo alle diese Arbeiten erwähnt sind und dann der Reihe nach abgearbeitet werden
können. In einer Sitzung und dann später weiterleiten für die anderen Sitzungen."*

**Dieser Brief ersetzt** `BRIEF_2026-10-15_nachziehen_alle_apps.md` und
`BRIEF_2026-10-15_schutzschichten_und_paper_s.md`. Beide bleiben als Nachschlagewerk liegen;
gearbeitet wird nur noch nach diesem hier.

**So wird weitergeleitet:** Es arbeitet immer nur **eine** Sitzung an diesem Brief. Sie beginnt
beim ersten offenen Schritt der Fortschritts-Tabelle unten und hakt dort ab, was auf `main`
angekommen ist. Wird der Kontext knapp oder ist die Sitzung zu Ende, hakt sie ihren Stand ab,
merget und gibt den Codeblock unten unverändert im Chat aus. Klaus startet damit die nächste
Sitzung. Die neue Sitzung liest die Tabelle auf `main` und macht beim ersten offenen Schritt
weiter.

## Fortschritt (hier abhaken, nicht im Chat)

| Schritt | Inhalt | Stand |
|---|---|---|
| 0 | Startprüfung: keine andere Sitzung arbeitet daran | je Sitzung neu |
| 1 | Werkzeug: `kanon-verteilen` lässt `cache-stand.mjs` mitlaufen (Pflege-Liste #13) | erledigt (PR #1094, 2026-10-15) |
| 2 | Gruppe A: Bau 23.R in die übrigen Träger nachziehen | erledigt (2026-10-15): A1 (PWA-Toolpoint #167, SB-KIMTool-Point #186, Kimseek #92, 2026-10-15); A2 (Kim-Bell #72, kim-hub-company #75, family-project #359, Kimhub ohne Modul-Dateien, 2026-10-15); A3 (Mein-Tresor #134, Jasons-Tresor #186, Company-Brain #24, 2026-10-15); A4 (Alis-Moderaum #72, Perfect-Skin-Fashion #44, Perfect-Skin-Beauty #72, 2026-10-15). Offen: Mein-Workfloh-Page („Muster Werbetechnik“) trägt 23 `3caa0bb1fbe7`, steht aber unter „NIE anfassen: *-Page“ — Klaus' Entscheid; `docs/observatorium/tools/mycelknoten.html` bettet 02/16 ohne 23 ein, benannt, nicht nachgezogen |
| 3 | Gruppe B: In-and-Out-Book, Kim-sync (Datei-Post nur nach Klaus' Ja) als Knoten andocken | offen |
| 4 | Gruppe C: Klaus fragen, was davon andocken soll | offen |
| 5 | Schichten: Klaus' Freigabe holen, dann S1 „Fragen unterschreiben“ bauen und in alle Träger tragen | teilweise: Freigabe erteilt (Klaus 2026-10-15: S1 → S2 → S5 → S3 → S4; S6/S7 nicht), Bau von S1 offen |
| 6 | Paper S: Gliederung mit Klaus abstimmen (schreiben erst nach 2 und 5) | offen |
| 7 | Nebenbei, wenn Zeit bleibt: Workflow-PDF `tests/chrome.mjs` hängt (Pflege-Liste #14) | offen |

In die Spalte „Stand“ kommt `erledigt (PR #…, YYYY-MM-DD)`, `teilweise: …` oder
`offen: <Grund>`. Was auf `main` nicht nachgezählt ist, gilt nicht als erledigt.

## Der Brief zum Kopieren

```
Du bist eine Hauptsitzung in Sage-Protokol und arbeitest den Sammel-Brief
docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md der Reihe nach ab.

SCHRITT 0 · Startprüfung (Klaus: es gab Probleme mit parallelen Sitzungen)
  bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"
  git -C Sage-Protokol fetch origin --quiet && git -C Sage-Protokol checkout -B <branch> origin/main
  - Lies die Fortschritts-Tabelle im Brief auf origin/main. Du beginnst beim ERSTEN offenen Schritt.
  - Offene PRs in Sage und in den Repos deines Schritts ansehen. Liegt dort ein fremder, nicht
    gemergter PR zum selben Thema, arbeitet vermutlich eine andere Sitzung daran: NICHT
    parallel bauen, sondern Klaus fragen.
  - Vor jedem Push: git fetch, git diff --stat origin/main origin/<branch>. Löscht der Diff
    fremde Arbeit, erst zusammenführen.

Pflichtleseliste:
1. CLAUDE.md
2. docs/PULS.md (Einträge ab 2026-10-14)
3. docs/sessions/archiv/2026-10-15_abschluss_pruef-reihe-sitzung6.md
4. docs/PLAN_MYCEL_SCHICHTEN.md
5. erst beim jeweiligen Schritt: docs/PFLICHT_MODULE.md (3), docs/papers/PLAN_PAPER_KNOTENNETZ.md (6),
   docs/INTERFACES.md Modul 02 und 23 (2, 5)
6. Skills: netzweiter-modul-rollout, saubere-netz-anmeldung, status-leiste-siegel

Ausgangslage: Bau 23.R (Echtheit im Raum, Antworten signiert und an den Gefragten gebunden,
fremder Text nie als HTML) steht in Sage und 13 Trägern: Auslieferung-Pruefer, BookLedgerPro,
Kimboard, Mein-Mixarium, Mein-Rezeptbuch, Muttis-Rezeptbuch, Mein-WorkFloh, Privat-Brain,
Sende-Pruefer, Tomys-Hub, Workflow-Calculate, Workflow-Needs, Workflow-PDF. Dazu Mycel-Karte.

SCHRITT 1 · Werkzeug (Pflege-Liste #13)
  tools/kanon-verteilen.mjs erhöht CACHE_VERSION, aber Workflow-Calculate und Workflow-Needs
  halten zusätzlich tests/cache-stand.json. Der Verteiler soll dort, wo es tools/cache-stand.mjs
  gibt, es nach dem Schreiben mitlaufen lassen (oder es namentlich als Nacharbeit melden).
  Probe UND Gegenprobe. Danach Pflege-Liste #13 als erledigt markieren.

SCHRITT 2 · Gruppe A: Bau 23.R nachziehen
  PWA-Toolpoint, Kimseek, SB-KIMTool-Point, family-project, Kim-Bell, Mein-Tresor,
  Jasons-Tresor, kim-hub-company, Company-Brain, Alis-Moderaum, Perfect-Skin-Fashion,
  Perfect-Skin-Beauty, Kimhub (die Sperre ist aufgehoben, Klaus 2026-10-15).
  - Repos mit add_repo holen; wird eines abgelehnt, nicht umgehen, am Ende namentlich melden.
  - node tools/kanon-verteilen.mjs erst ohne --schreiben ansehen; er erkennt Träger am INHALT.
  - Herkunfts-Riegel meldet Handarbeit → ansehen, nicht mit Gewalt überschreiben.
  - SB-KIMTool-Point: Loader-Datei und echte Modul-Kopie auseinanderhalten (Skill).
  - Eigene Glue-Stellen mit innerHTML für fremden Text suchen; fremde Namen/Texte nur als Text.
  - Knoten „Muster Werbetechnik“: Repo über Spore/Mitschnitt herausfinden, nicht raten.
  - docs/observatorium/tools/mycelknoten.html (02/16 eingebettet) prüfen.
  - Je Repo: Proben, PR, Merge (Freibrief), auf main nachzählen (RDV_LABEL_MAX = 200),
    DANN erst Zweige heben.

SCHRITT 3 · Gruppe B: als Knoten andocken
  Mein-In-and-Out-Book (Schublade z. B. inoutbook, Speicher inout_…), Kim-sync (nutzt schon
  noble-secp256k1 aus Kimboard, kein zweites Exemplar). Datei-Post NUR nach Klaus' Ja, und dann
  nur in der Oberfläche (public/), nie im Server.
  Nach PFLICHT_MODULE.md: 13 Module, SBKIM_DB_SUFFIX im <head>, 05b nicht über die
  Nachlade-Kette, feste Leiste ohne 17 wie Sende-Prüfer/Workflow-Needs, Offline-Vorrat,
  Cache-Bump, eigene Identität, Siegel, Beschreibung ohne Kundendaten, beim Laden kein Netz.

SCHRITT 4 · Gruppe C: Klaus fragen (nicht von selbst andocken)
  papas-aktenschrank, Kuechenzettel, Kochfreunde, semantic-match-demo — funktionsfähig? nützlich?

NIE anfassen: yamilet-Promptgenerator, Linksprüfer (in Tomys Hub, nicht gebraucht), reine
Werbe-/Landing-Seiten (*-Page, Muttis-Rezeptbuch-Seite, PWA-Toolpoint-com, ISD-Page-Entwurf,
Family-Projekt.de-Video), die GPT-Gegenproben (*-Made-GPT), Me-Mixarium, New-Perfect-Skin-Beauty-,
FP-Schleuse, SP-FP-md-Speicher, odysseus.

SCHRITT 5 · Schutzschichten (docs/PLAN_MYCEL_SCHICHTEN.md)
  - Klaus fragen, welche Schichten er freigibt (Vorschlag S1 → S2 → S5 → S3 → S4; S5 Bürgen ist
    als Planpunkt schon freigegeben).
  - S1 „Fragen unterschreiben“: erst INTERFACES (Frage-Zettel v2: spore + sig wie Antwort-Zettel
    v2), dann Modul 23. Eine unsignierte Frage wird weiter beantwortet, aber „unbestätigt“
    vermerkt. Probe UND Gegenprobe, jeder Fall rot mit dem Namen seiner Zusicherung.
  - Rollout in ALLE Träger (auch die aus Schritt 2 und 3) mit kanon-verteilen.

SCHRITT 6 · Paper S (docs/papers/PLAN_PAPER_KNOTENNETZ.md)
  Gliederung mit Klaus abstimmen. Geschrieben wird erst, wenn Schritt 2 und S1 auf main sind
  (keine Anleitung zu offenen Lücken veröffentlichen). Die veröffentlichten Papers nicht ändern.
  Klaus' Lesart „Störungen als Prüfmechanismus“ als seine Sicht kennzeichnen.

SCHRITT 7 · Nebenbei (Pflege-Liste #14)
  Workflow-PDF tests/chrome.mjs hängt manchmal schon auf main (Dialog wartet auf IndexedDB).
  Nur wenn Zeit bleibt; Ursache suchen, Probe robuster machen, nie überspringen.

Sporen: Für Bau 23.R keine neue Spore (signiert wird mit dem vorhandenen Schlüssel). Ausnahme:
verschwindet eine App nach dem Update von der Karte, war ihre Spore schon vorher ungültig → im
Siegel neu signieren. Neue Apps (Schritt 3) bekommen ihre erste Spore beim Andocken. Nach jedem
Merge auf dem Gerät einmal ⟳ / Hard-Reload.

Regeln: Befund ins Dokument, Rat in den Chat. Eine rote Probe, die auch auf main rot ist, ist
nicht die eigene, wird aber im PR genannt (bekannt: Sage smoke_geraetename_netzweit). Am Tablet
ist nichts gemessen — so benennen. „Garantiert“ nur mit Probe UND Gegenprobe.

WEITERLEITEN (Pflicht, auch wenn nicht alles fertig ist):
- Fortschritts-Tabelle im Brief abhaken (nur, was auf main nachgezählt ist), PULS.md,
  Übergabeprotokoll in docs/sessions/archiv/YYYY-MM-DD_<thema>.md, mergen.
- Im Chat: Tabelle aller angefassten Apps (vorher · nachher · PR · offen mit Grund),
  vorgeschlagene nächste Schritte, und DIESEN Codeblock unverändert zum Kopieren für die
  nächste Sitzung, mit dem Satz „Weiter bei Schritt N“.
```
