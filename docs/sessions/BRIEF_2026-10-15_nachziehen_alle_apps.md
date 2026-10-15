# Brief · Folge-Sitzung: Bau 23.R in alle Apps nachziehen, neue Apps andocken

Klaus 2026-10-15: *„das nachzuziehen in den anderen Apps … auch die neuen Apps mit einbinden …
alle, die das Mycel in sich tragen können, auch wenn sie nicht veröffentlicht sind. Aber sie
müssen funktionsfähig sein und nützlich."* Ausdrücklich **nicht**: der Linksprüfer und der
Prompt-Generator — beide stecken in Tomys Hub und werden nicht gebraucht.

```
Du bist eine Hauptsitzung in Sage-Protokol. Aufgabe: Bau 23.R (Echtheit im Raum, Antworten
signiert und an den Gefragten gebunden, fremder Text nie als HTML) in ALLE Apps tragen, die das
Mycel tragen, und die funktionsfähigen, nützlichen Apps ohne Mycel als Knoten andocken.

Zuerst:
  bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"
  Für jedes Repo, an dem du arbeitest: git fetch origin --quiet && git checkout -B <branch> origin/main
  Repos, die nicht im Sitzungs-Umfang sind: mit add_repo holen. Wird eines abgelehnt, NICHT
  umgehen, sondern am Ende namentlich als offen melden.

Pflichtleseliste:
1. CLAUDE.md
2. docs/PULS.md (Einträge 2026-10-14 und 2026-10-15)
3. docs/sessions/archiv/2026-10-15_abschluss_pruef-reihe-sitzung6.md
4. docs/PFLICHT_MODULE.md (für das Andocken neuer Apps)
5. docs/INTERFACES.md — Modul 02 (signDetached/verifyDetached), Modul 23 (Bau 23.R)
6. docs/PLAN_MYCEL_SCHICHTEN.md, Abschnitt „Nachziehen und Sporen je Schicht"
7. Skills: netzweiter-modul-rollout, saubere-netz-anmeldung, status-leiste-siegel

Stand 2026-10-15 (auf main nachgezählt, `RDV_LABEL_MAX = 200`):
  FERTIG (13): Auslieferung-Pruefer, BookLedgerPro, Kimboard, Mein-Mixarium, Mein-Rezeptbuch,
  Muttis-Rezeptbuch, Mein-WorkFloh, Privat-Brain, Sende-Pruefer, Tomys-Hub, Workflow-Calculate,
  Workflow-Needs, Workflow-PDF. Dazu Sage selbst und die Mycel-Karte (sicher() im Protokoll).

GRUPPE A — tragen das Mycel, auf Bau 23.R nachziehen (`node tools/kanon-verteilen.mjs`,
erst ohne --schreiben ansehen; der Verteiler erkennt Träger am INHALT, nicht an dieser Liste):
  PWA-Toolpoint, Kimseek, SB-KIMTool-Point, family-project, Kim-Bell, Mein-Tresor,
  Jasons-Tresor, kim-hub-company, Company-Brain, Alis-Moderaum, Perfect-Skin-Fashion,
  Perfect-Skin-Beauty. Dazu Kimhub — NUR wenn Klaus es in dieser Sitzung ausdrücklich freigibt.
  Dazu: der Knoten „Muster Werbetechnik" steht im Raum; sein Repo herausfinden (Spore/
  Mitschnitt), nicht raten. docs/observatorium/tools/mycelknoten.html (02/16 eingebettet) prüfen.
  ⚠ SB-KIMTool-Point: Loader-Datei und echte Modul-Kopie auseinanderhalten (Skill).
  ⚠ Herkunfts-Riegel meldet Handarbeit → ansehen, nicht mit Gewalt überschreiben.
  ⚠ Nach dem Verteilen: wo es tools/cache-stand.mjs gibt, mitlaufen lassen (Pflege-Liste #13).
  ⚠ Eigene Glue-Stellen mit innerHTML für fremden Text suchen (wie Kimboard „Kontakt senden");
     fremde Namen/Texte nur als Text.
  Je Repo: Proben des Repos, PR, Merge (Freibrief), danach auf main nachzählen.

GRUPPE B — funktionsfähig und nützlich, noch OHNE Mycel → als Knoten andocken:
  Mein-In-and-Out-Book, Kim-sync, Datei-Post.
  Vorgehen je App nach PFLICHT_MODULE.md (13 Module, SBKIM_DB_SUFFIX im <head>, 05b nicht über
  die Nachlade-Kette, 17 vor 15/16 bzw. feste Leiste ohne 17 wie Sende-Prüfer, Offline-Vorrat,
  CACHE-Bump), eigene Schublade, eigene Identität, Siegel, Beschreibung ohne Kundendaten,
  beim Laden kein Netz. Vorbild: Sende-Prüfer / Workflow-Needs (feste Leiste in der Kopfzeile).
  ⚠ Datei-Post ist ein Node-Server mit Browser-Oberfläche: der Knoten gehört in die
     Oberfläche (public/), nie in den Server; der Server bekommt nie einen Code (CLAUDE.md dort).
     Vorher mit Klaus klären, ob Datei-Post Knoten werden soll.
  ⚠ In-and-Out-Book: eigene Speicher-Namen `inout_…`, Schublade z. B. `inoutbook`.
  ⚠ Kim-sync: nutzt schon noble-secp256k1 aus Kimboard — dieselbe Datei, kein zweites Exemplar.

GRUPPE C — vorher mit Klaus klären (funktionsfähig? nützlich?), nicht von selbst andocken:
  papas-aktenschrank, Kuechenzettel, Kochfreunde, semantic-match-demo.

NICHT anfassen:
  yamilet-Promptgenerator und der Linksprüfer (Klaus: in Tomys Hub, nicht gebraucht) ·
  reine Werbe-/Landing-Seiten (Mein-Rezeptbuch-Page, Mein-Mixarium-Page, Mein-Workfloh-Page,
  Workfloh-PDF-Page, Muttis-Rezeptbuch-Seite, PWA-Toolpoint-com, ISD-Page-Entwurf,
  Family-Projekt.de-Video) · die GPT-Gegenproben (Sendepruefer-Made-GPT,
  Auslieferungspruefer-Made-GPT) · Me-Mixarium (leer) · New-Perfect-Skin-Beauty- ·
  FP-Schleuse · SP-FP-md-Speicher · odysseus (Fork).
  Wer hier eine App für nützlich hält, FRAGT Klaus, statt sie anzudocken.

Sporen:
  Für Bau 23.R keine neue Spore — signiert wird mit dem vorhandenen Schlüssel. Ausnahme: eine
  App verschwindet nach dem Update von der Karte → ihre Spore war schon vorher ungültig → im
  Siegel neu signieren. Neue Apps (Gruppe B) bekommen ihre erste Spore beim Andocken.
  Nach jedem Merge: auf dem Gerät einmal ⟳ / Hard-Reload.

Regeln:
- Erst auf main nachzählen, DANN Zweige heben (Sage-CLAUDE.md, Rollout 2026-09-16).
- Eine rote Probe, die auch auf main rot ist, ist nicht die eigene — aber nie still: im PR nennen.
- Befund ins Dokument, Rat in den Chat.
- Am Tablet ist nichts gemessen — so benennen.

Pflicht am Ende:
- Tabelle aller Apps: Gruppe · Stand vorher · Stand nachher · PR · offen (mit Grund).
- PULS.md, Übergabeprotokoll in docs/sessions/archiv/.
- Vorgeschlagene nächste Schritte und den nächsten Brief im Chat ausgeben. Danach:
  docs/sessions/BRIEF_2026-10-15_schutzschichten_und_paper_s.md (S1 Fragen unterschreiben).
```
