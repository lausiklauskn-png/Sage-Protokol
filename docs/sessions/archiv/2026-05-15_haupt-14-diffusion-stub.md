# Übergabeprotokoll · 2026-05-15 · Hauptsitzung Modul 14 Diffusion — Backlog-Stub angelegt

**Sitzungs-Rolle:** Hauptsitzung (eine Sitzung, ein Anker-Scope).
Modul 14 „Diffusion" wird als reiner Backlog-Stub im Format der
Schutz-Module 10/11/12 angelegt. **Keine Spec-Detailarbeit**, **kein
JS-Code**, **keine Spiegelung in INTERFACES.md §1**. Reiner Anker
mit drei dokumentierten Diffusionspfaden, verbindlicher Auswahl
Pfad 2, Verweisen auf 05/06/10/11/12 und Schwellwert „Wann ziehen".
**Branch:** `claude/haupt-14-diffusion-stub-7fLee`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §A und
an `2026-05-15_pflege-09-schritt-9-doku-ttl.md`.
**Modul:** 14_diffusion (Stub, Diffusion-Backlog).

---

## Auftrag

Eine Phase (Backlog-Anker anlegen), klarer Scope, kein Modul-Bau,
keine Spec-Detail-Arbeit:

1. **`docs/components/14_diffusion.md` anlegen** als Stub im Format
   10/11/12. Inhalt: Status-Block · Im-Mycel-Bild · Visualisierung ·
   drei Diffusionspfade mit Auswahl · sechs Anker-Punkte für die
   spätere Spec-Sitzung · Schwellwert „Wann ziehen" · Verbindungen
   zu anderen Karten · Risiken · offene Fragen.
2. **`status.json` erweitern** um neues Feld `diffusionBacklog[]`
   parallel zu `schutzBacklog[]` (Architektur-Entscheidung: Schutz
   reaktiv, Diffusion proaktiv); Eintrag Modul 14.
   `scoreModel.maxScoreNote` unangetastet (Backlog zählt nicht zum
   maxScore, analog 10/11/12).
3. **`scripts/update_puls_pie.py` erweitern** um Lesen von
   `diffusionBacklog` (zusätzlich zu `modules` + `schutzBacklog`),
   damit der Pie-Block Modul 14 als Schablone mitzählt.
   `python3 scripts/update_puls_pie.py` laufen (13 → 14 Module;
   Schablonen-Zahl steigt von 4 auf 5).
4. **PULS.md erweitern**: Schnellüberblicks-Tabelle Modul 14;
   Offene-Querschnitts-Fragen-Block Diffusion-Frage als gelöst
   markiert + neue offene Frage „Sage-Page sichtbar machen für
   Modul 14"; Sub-Abschnitt „Diffusion-Backlog" unter dem Schutz-
   Backlog mit Begründung „proaktiv vs. reaktiv"; neuer Sitzungs-
   Eintrag oben.
5. **INTERFACES.md §6** Änderungsprotokoll-Zeile am unteren Ende
   (neueste unten, Konventions-Stil). **§1 unangetastet** — Stub
   hat keine Schnittstelle.
6. **Sage-Page (index.html) und Observatorium prüfen** — wenn
   Erweiterung nicht-trivial: als offene Frage in PULS notieren
   und in einer separaten Pflege-Sitzung nachziehen. Diese
   Hauptsitzung berührt nur den Anker.
7. **Übergabeprotokoll** (diese Datei).
8. **Sitzungs-Abschluss:** Commit + Push + Draft-PR.

---

## Was getan wurde

### 1. `docs/components/14_diffusion.md` angelegt

Reiner Stub im Format 10/11/12. Pflicht-Inhalt verbindlich:

- **Status-Block** als Blockquote: `🟫 Schablone · Diffusion-Backlog
  · Priorität niedrig`, Schicht „Netzwerk (Erweiterung von Karte 05
  Anastomose)", Anker „Sage-Page → noch nicht sichtbar (Folge-Pflege)",
  Datei `src/modules/14_diffusion.js` (existiert noch nicht — Spec
  ausstehend), Ein-Zeilen-Zusammenfassung („Konsensuell-empfehlende
  Spore-Diffusion: zwei Knoten tauschen beim Handshake zusätzlich
  ein bis zwei Empfehlungs-Spores. Stub, kein Spec-Detail.").

- **„Im Mycel-Bild"**-Block: Pilz-Hyphen tauschen beim Berühren
  nicht nur eigene Sporen, sondern auch Notizen über andere Pilze
  in der Nachbarschaft — „Wuchs durch Empfehlung, nicht durch
  Senden". Im SBKIM-Drehbuch ist das die proaktive Schwester des
  passiven `/sbkim/spore.json`-Mechanismus; beide bleiben
  Empfangsmodus.

- **Visualisierung** als Mermaid-Flowchart (analog 11/12):
  Handshake A↔B mit `recommendedPeers` in Request und Response,
  Lead-Store `sbkim_diffusion_leads` mit TTL beim Empfänger,
  gestrichelter Opt-in-Pfad in eigene Handshakes. Lesart-Block
  unter dem Diagramm.

- **„Zweck"**: Lücke zwischen „totaler Empfangsmodus" und „aktivem
  Crawlen" mit konsensuellem Erweiterungs-Pfad. Empfehlung
  während eines Handshakes, der ohnehin im Konsens stattfindet.
  Anker-Hinweis: keine Pulsation, kein Crawler, Anfrage-Initiative
  bleibt beim Empfänger.

- **„Drei Diffusionspfade"**:
  - **Pfad 1 — passiv (Status quo, Default-Mechanismus):**
    `/sbkim/spore.json` wird gefunden, weil eine Domain-URL irgendwo
    auftaucht (manuelle Eintragung, Sage-Page-Live-Generator,
    Karte 09 Andock-Workflow). Langsam, aber drehbuchkonform.
    Bleibt Default parallel.
  - **Pfad 2 — konsensuell-empfehlend** ✅ **verbindlich
    gewählt:** zwei Knoten tauschen beim Handshake (Karte 05
    Anastomose) zusätzlich zu eigenen Spores je 1–2 Empfehlungs-
    Spores anderer Geschwister, die der Empfänger noch nicht
    kennt. Drehbuchkonform, weil jede Übergabe im Konsens passiert.
    Kein Auto-Anastomose, kein „Eigenanfrage ins offene Netz".
    **Spec-Vorgabe für die spätere Spec-Sitzung 14.**
  - **Pfad 3 — parasitär-mitreisend** ❌ **verworfen:**
    Empfehlungs-Spores reisen ohne expliziten Konsens mit (z.B.
    als Header in einem Query-Response oder als Pulsations-
    Broadcast). Bricht das Empfangsmodus-Prinzip aus `CLAUDE.md`
    („Kein Crawler, keine Pulsation, keine Eigenanfragen ins
    offene Netz") und aus `sbkim_paper.pdf` (Empfangsmodus mit
    Antwortrecht). Nicht weiterverfolgt, auch nicht als Option.
    Begründung der Verwerfung: kein Konsens-Anker (Empfehlende
    sendet, Empfohlene weiß nichts davon, Empfänger empfängt
    ohne Anfrage).

- **„Was eine spätere Spec-Sitzung füllen müsste"** als sechs
  Anker ohne Detail-Festlegung:
  - (a) **Handshake-Erweiterung Karte 05:** neues optionales Feld
    `recommendedPeers: SporeRef[]` in `HandshakeResponse` (und ggf.
    `HandshakeRequest`), max. 2 Einträge. Additiv, kein
    Hauptversions-Sprung. `SporeRef` vermutlich `{nodeId, endpoint,
    publicKey}` — exakte Form offen, Spec-Sitzung 14 entscheidet
    zusammen mit einer Pflege-Sitzung Karte 05. **Karte 05 wird
    in der Stub-Sitzung NICHT angefasst.**
  - (b) **Empfehlungs-Quelle** aus eigenem `sbkim_siblings`-
    Bestand, gefiltert nach Vertrauenswert.
  - (c) **Empfangsseite:** opt-in pro Empfehlung, kein Auto-
    Anastomose, Empfänger speichert höchstens als Lead in neuem
    Store `sbkim_diffusion_leads` (Schlüssel `peerNodeId`, Wert
    `{peerNodeId, endpoint, publicKey, fromNodeId, recommendedAt,
    ttl}`), TTL pflicht. Wer den Lead in einen echten Handshake
    umsetzt, ist Klaus oder ein Endknoten-eigenes UI.
  - (d) **Trust-Hook auf Karte 10 Reputation:** Empfehlungs-
    Quellen werden gewichtet. Wirkt erst, wenn Karte 10 spec-
    spruchreif ist; bis dahin flache Gewichtung oder
    Mindest-`since`-Filter.
  - (e) **Rate-Limit-Hook auf Karte 11:** Empfehlungs-Limit pro
    Handshake (Anti-Flood). Wirkt erst, wenn Karte 11 spec-
    spruchreif ist; bis dahin hartes Limit aus (a) (max. 2).
  - (f) **Anti-Vergiftung:** Empfehlungs-Spores haben weniger
    Vertrauen als selbst-gefundene Spores (Trust-Tier
    `trustLevel ∈ {"self-discovered","recommended"}` als Anker-
    Idee, Spec entscheidet exakte Form).

- **„Wann ziehen"**: Schwellwert „Netz ≥ 10 aktive Geschwister
  ODER Bau-Sitzung 09 erfolgreich abgeschlossen UND spürbares
  Wachstums-Bedürfnis", parallel zur 10/11/12-Logik.

- **„Verbindung zu anderen Karten"**: 05 (Schnittstelle) · 06
  (Lead-Pool für Heterokaryose) · 10 (Trust) · 11 (Anti-Flood) ·
  12 (Filter beidseits — geblockte Knoten weder empfehlen noch
  empfohlen werden).

- **„Risiken"**: Echo-Kammer · Diffusion-Sybil · Trust-Inflation
  · Privacy-Leak (Empfehlung verrät, dass Empfehlende den
  Empfohlenen kennt) — vier Punkte mit Mitigations-Ideen.

- **„Bekannte offene Fragen"** für die spätere Spec-Sitzung: sechs
  Punkte (SporeRef-Form, Auswahl-Heuristik, TTL-Wert, Lead-Anzeige,
  Opt-in beim Empfehlenden, Trust-Tier-Übergang).

- **„Manueller Test"**: leer mit Hinweis „später, sobald Modul 05
  + 10 stehen und Klaus Modul 14 freigegeben hat".

- **Bauzustand-Tabelle** nur mit Zeile „Stub angelegt | 2026-05-15
  | Hauptsitzung 14-Diffusion-Stub | Diffusion-Backlog (proaktiv,
  parallel zum Schutz-Backlog), Pfad-2-Auswahl verbindlich, drei
  Pfade dokumentiert; Anker zur abgebrochenen Bau-Sitzung Modul 09
  (2026-05-15) wo die Diffusion-Frage entstand".

- **Querverweise-Block** unten: Abhängigkeiten · genutzt-von ·
  Hook-Punkte (nur Verweis) · Site-Karte (noch nicht sichtbar) ·
  Paper-Kapitel · verwandte Karten.

### 2. `status.json` erweitert

- `lastUpdated` von `2026-05-14` auf `2026-05-15` aktualisiert.
- Neues Feld `diffusionBacklog` parallel zu `schutzBacklog`
  eingefügt:
  ```json
  "diffusionBacklog": [
    { "id": "14", "name": "Diffusion",
      "score": "schablone",
      "siegel": "Stub (Backlog), Priorität niedrig",
      "kurz": "Konsensuell-empfehlende Spore-Diffusion über
              Handshake-Erweiterung — Pfad 2 (drehbuchkonform),
              Pfade 1 (passiv) und 3 (parasitär) dokumentiert;
              Spec ausstehend bis Netz wächst" }
  ]
  ```
- **Architektur-Entscheidung**: parallel statt erweitern. Der
  Schutz-Backlog (10/11/12) ist **reaktiv** — wird gezogen, wenn
  das Netz angegriffen wird oder zu groß für Apoptose-allein wird.
  Der Diffusion-Backlog (14) ist **proaktiv** — wird gezogen,
  wenn das Netz zu klein bleibt und konsensuelles Wachstum
  gewünscht ist. Beide haben dieselbe Eigenschaft („zählen nicht
  zum maxScore"), aber unterschiedliche Auslöser; deshalb saubere
  Trennung in zwei Backlog-Felder.
- `scoreModel.maxScoreNote` **unangetastet** — Backlog zählt nicht
  zum maxScore, analog 10/11/12. Formel `Hub(10) + 10 Module × 10 +
  2 Endknoten × 15 = 140` bleibt korrekt.

### 3. `scripts/update_puls_pie.py` erweitert

`count_statuses(status)` liest jetzt zusätzlich zu `modules` und
`schutzBacklog` auch `diffusionBacklog`. Drei-Zeilen-Erweiterung
(`pool = modules + schutzBacklog + diffusionBacklog`). Skript
gelaufen:

```
PULS-Pie aktualisiert (Stand 2026-05-15, 14 Module):
  🟫 Schablone: 5
  🟧 In Werkstatt: 1
  🟨 Spec fertig: 1
  🟦 Code-Stub: 7
  🟩 Fertig: 0
```

Zähl-Erwartung erfüllt: 13 → 14 Module, Schablonen 4 → 5, andere
Score-Verteilungen unverändert. Pie-Block in PULS.md automatisch
nachgezogen.

### 4. PULS.md erweitert

- **Schnellüberblicks-Tabelle** um neue Zeile „14 diffusion · Stub
  (Diffusion-Backlog) · konsensuell-empfehlende Spore-Diffusion via
  Handshake-Erweiterung (Pfad 2 verbindlich, Pfad 1 = Default-
  Status-quo, Pfad 3 verworfen wegen Empfangsmodus-Prinzip); Spec
  ausstehend bis Netz ≥ 10 Geschwister oder erfolgreicher Live-
  Andock + Wachstums-Bedürfnis; Priorität niedrig" analog 10/11/12-
  Zeilen.

- **Offene Querschnitts-Fragen**: Diffusion-Frage als gelöst
  markiert (durchgestrichen mit `~~…~~` + Verweis auf Karte 14).
  Verbindliche Auswahl Pfad 2 in der Auflösung notiert, explizite
  Verwerfung Pfad 3 mit Empfangsmodus-Begründung.

- **Neue offene Querschnitts-Frage** „Sage-Page sichtbar machen
  für Modul 14" eingetragen: `index.html` rendert aktuell nur
  `modules[]` und `schutzBacklog[]`, nicht `diffusionBacklog[]`.
  Modul 14 muss in der Bau-Puls-Karte und ggf. Eigenschutz-Karte
  13 sichtbar werden — Folge-Pflege-Sitzung „Sage-Page für Modul
  14" zieht den Anker nach. Diese Hauptsitzung berührt nur den
  Anker (status.json + Karte + PULS), nicht die Sage-Page selbst.

- **Schutz-Backlog-Abschnitt erweitert** um neuen Sub-Abschnitt
  „Diffusion-Backlog (aus Hauptsitzung 14-Diffusion-Stub,
  2026-05-15)" mit Begründung „Schutz und Diffusion sind zwei
  verschiedene Backlog-Kategorien: Schutz reaktiv, Diffusion
  proaktiv", Verweis auf Karte 14 und Schwellwert-Verweis.
  Architektur-Hinweis: `status.json` führt Modul 14 als eigenes
  Feld `diffusionBacklog[]` parallel zu `schutzBacklog[]`,
  `scoreModel.maxScoreNote` bleibt unangetastet, Pie-Skript zählt
  beide Backlog-Kategorien mit.

- **Neuer Sitzungs-Eintrag oben** „2026-05-15 · Hauptsitzung ·
  Modul 14 Diffusion — Backlog-Stub angelegt" mit ausführlichem
  Was-getan / Was-nicht-geändert-bewusst / Frischer-Kopf-Befund /
  Was-offen-blieb / Nächster-Schritt-Block.

### 5. INTERFACES.md §6 Änderungsprotokoll

Eine Zeile am unteren Ende der Tabelle eingefügt (neueste Zeile
unten, Konventions-Stil wie die anderen Pflege-Sitzungen 2026-05-15
und wie die Pflege-09-Schritt-9-Zeile). Fasst Karte-14-Stub +
status.json-Erweiterung + Pie-Skript-Erweiterung + PULS-Erweiterung
in einer langen Zeile zusammen. **§1 unangetastet** — Stub hat
keine Schnittstelle; Schnittstellen-Spiegelung kommt erst in der
späteren Spec-Sitzung 14 zusammen mit einer Pflege-Sitzung Karte 05
(`recommendedPeers: SporeRef[]` additiv in `HandshakeResponse`).

### 6. Sage-Page (index.html) und Observatorium

**Geprüft, nicht geändert.** `index.html` (Karte „Bau-Puls" via
`renderBauPuls(s)` Zeile 2447 und Karte 4 „Module · 10 Haupt + 3
Schutz-Backlog" via `renderModules(s)` Zeile 2349 sowie
Eigenschutz-Karte 13 mit `.schutz-backlog`-Block) liest aktuell
nur `s.modules` und `s.schutzBacklog`. Erweiterung um
`s.diffusionBacklog` wäre **nicht-trivial** — drei Render-Blöcke
müssten den neuen Pool aufnehmen, das CSS bekommt ggf. eine eigene
Farb-Note (Diffusion ≠ Schutz), und die Eigenschutz-Karte 13 selbst
müsste evaluieren, ob Modul 14 dort sichtbar werden soll oder eine
eigene „Wuchs-Mechanik"-Karte bekommt. **Entscheidung gemäß
Briefing:** als offene Querschnitts-Frage in PULS notiert, separate
Folge-Pflege-Sitzung „Sage-Page für Modul 14" zieht nach. Diese
Hauptsitzung berührt nur den Anker. (Begründung: Stub-Sitzungen
sollen den Bau-DAG nicht mit Renderer-Arbeit vermischen, gleicher
Diskpilin wie bei 10/11/12 zur Observatoriums-Sitzung 2026-05-10.)

### 7. Übergabeprotokoll

Diese Datei.

---

## Was nicht geändert wurde (bewusst)

- **Kein Spec-Detail für Modul 14.** Keine Funktions-Signaturen,
  keine Datenformate (`SporeRef`-Form bleibt offen), keine
  Konfigurationswerte (TTL-Wert bleibt offen), keine Tests, keine
  Manual-Check-Knöpfe. Spec-Sitzungs-Arbeit später, wenn die
  Schwelle erreicht ist (Netz ≥ 10 oder Bau-Sitzung 09
  abgeschlossen + Wachstums-Bedürfnis).
- **Keine Änderung an Karte 05 Anastomose.** Die Handshake-
  Erweiterung um `recommendedPeers: SporeRef[]` gehört in eine
  eigene Pflege-Sitzung Karte 05, sobald Modul 14 spec-spruchreif
  ist. Karte 05 § Schnittstelle bleibt verbindlich fünf-funktional
  (`init/handshake/receiveHandshake/listSiblings/forgetSibling`).
- **Keine Änderung an Karte 10/11/12.** Die Hook-Punkte (Trust,
  Rate-Limit, Blocklist-Filter) werden in Karte 14 nur als Verweis
  dokumentiert, nicht implementiert. Stubs 10/11/12 bleiben
  unangetastet.
- **Kein JS-Code in `src/`.** `src/modules/14_diffusion.js` existiert
  nicht und entsteht erst nach Spec-Sitzung 14.
- **INTERFACES.md §1 unangetastet.** Stub hat keine Schnittstelle,
  keine `kurz`-Zeile, keinen Bietet-Block. Nur §6 bekommt eine
  Änderungsprotokoll-Zeile.
- **Sage-Page `index.html` und Observatorium nicht berührt.** Als
  offene Querschnitts-Frage in PULS notiert; Folge-Pflege-Sitzung
  zieht nach (siehe oben Punkt 6).
- **`tests/manual_check.html` nicht berührt.** Stub hat keine
  Tests; manueller Test wird erst in der späteren Spec-Sitzung 14
  ergänzt.
- **`scoreModel.maxScoreNote` in `status.json` unangetastet.**
  Backlog zählt nicht zum maxScore, analog 10/11/12. Wortlaut
  bleibt wie er ist; eine spätere Pflege-Sitzung kann das Wording
  „Schutz-Backlog (10-12)" um „Diffusion-Backlog (14)" ergänzen.
- **Kein Anfassen der parallel offenen Pflege-Sitzung Karte 09
  „App-SW-Koexistenz".** Sie läuft auf eigenem Branch und ist
  unabhängig. Befund-Kontext aus der dort entstandenen Diffusion-
  Frage wurde nur als Anker-Hinweis in Karte 14 und als Verweis
  in den Querschnitts-Fragen eingetragen.
- **CLAUDE.md unangetastet.** Modul-Tabelle bleibt bei 12 Zeilen
  (00–12); Modul 14 ist Backlog und wird über die PULS-
  Schnellüberblicks-Tabelle und Karte 14 selbst getragen, nicht
  zwingend in CLAUDE.md gespiegelt. Eine Folge-Sitzung kann das
  ergänzen, wenn 14 Pflichtleseliste-Relevanz bekommt.
- **WEGWEISER.md unangetastet.** Brief listet WEGWEISER nicht als
  Pflicht-Aktualisierung; Stub-Anker passt nicht in das
  Stand-Wanderungs-Format (das Backlog-Stubs 10/11/12 vom
  2026-05-10 ebenfalls nicht einzeln aufführt). Sub-Glossar-Zeile
  „zehn aktive + drei Schutz-Backlog-Module" wird in einer Folge-
  Pflege-Sitzung nachzuziehen sein (jetzt: drei Schutz + ein
  Diffusion).

---

## Frischer-Kopf-Befund: Backlog-Schema sauber getrennt

Die Architektur-Entscheidung `diffusionBacklog[]` parallel zu
`schutzBacklog[]` (statt: einen Eintrag in `schutzBacklog` mit
Begründungs-Note ergänzen) ist die saubere Trennung:

- **Schutz-Backlog (10/11/12) ist reaktiv.** Stubs werden gezogen,
  wenn das Netz angegriffen wird (Sybil, Flood, gezielter
  Angreifer) oder zu groß für Apoptose-allein wird. Auslöser ist
  Schaden bzw. Schadens-Risiko.
- **Diffusion-Backlog (14) ist proaktiv.** Stub wird gezogen,
  wenn das Netz zu klein bleibt und konsensuelles Wachstum
  gewünscht ist. Auslöser ist Wachstums-Bedürfnis.

Beide Backlogs teilen die Eigenschaft „zählen nicht zum maxScore,
weil zukunftsgewandt", aber sie sind semantisch verschiedene
Antworten auf verschiedene Probleme. Konsequenz für die
Datenstruktur:

- `status.json` führt zwei separate Felder.
- `scripts/update_puls_pie.py` liest beide für die Pie-Zählung
  (Modul 14 ist eine Schablone, gehört in den Pie).
- `scoreModel.maxScoreNote` bleibt unangetastet (Wortlaut „Schutz-
  Backlog (10-12) zählt nicht mit, da reaktiv-zukünftig" wird in
  einer späteren Pflege-Sitzung um Diffusion-Backlog ergänzt;
  Korrektheit der Formel ist nicht betroffen).
- Sage-Page muss in der Folge-Pflege-Sitzung beide Backlogs
  rendern, möglicherweise unter einer gemeinsamen Visualisierung
  („zukunftsgewandte Stubs") oder unter zwei Sektionen
  („Eigenschutz" + „Wuchs-Mechanik"). Entscheidung der Folge-
  Pflege-Sitzung.

**Karte 14 ist jetzt der vollständige Backlog-Anker** für die
Diffusions-Frage. Eine spätere Spec-Sitzung 14 kann mit den sechs
Anker-Punkten und der Pfad-2-Auswahl direkt loslegen, ohne erst
die drei Pfade noch einmal abwägen zu müssen. Karte 05 bleibt
sauber unangetastet, bis Modul 14 spec-spruchreif ist.

---

## Was offen blieb

- **Sage-Page (`index.html`) sichtbar machen für Modul 14** —
  Folge-Pflege-Sitzung „Sage-Page für Modul 14" zieht den Anker
  in der Bau-Puls-Karte (`renderBauPuls`, `renderBauPulsPie`),
  in Karte 4 Module (`renderModules`) und ggf. in Karte 13
  Eigenschutz nach. Klein, headless ausführbar.
- **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
  Versuch** bleibt der nächste produktive Schritt im Haupt-Pfad
  (parallel offene Pflege-Sitzung Karte 09 „App-SW-Koexistenz"
  schließt diesen Blocker auf eigenem Branch ab).
- **Modul 06 Heterokaryose Spec-Sitzung** kommt weiterhin erst
  nach dem ersten Live-Andock; Modul 14 ergibt eine semantisch
  nahe Schwester (Lead-Pool für Heterokaryose-Vorschläge), wartet
  aber genauso auf das Netz.
- **Spec-Sitzung Modul 14** wird gezogen, sobald die Schwelle
  erreicht ist (Netz ≥ 10 aktive Geschwister ODER Bau-Sitzung 09
  abgeschlossen + Wachstums-Bedürfnis). Aufhänger für eine
  Pflege-Sitzung Karte 05 sobald Modul 14 spec-spruchreif ist
  (`recommendedPeers: SporeRef[]` in `HandshakeResponse`
  additiv einbauen).
- **`scoreModel.maxScoreNote`-Wortlaut** könnte in einer späteren
  Mini-Pflege-Sitzung das Wording „Schutz-Backlog (10-12)" um
  „Diffusion-Backlog (14)" ergänzen. Korrektheit der Formel ist
  nicht betroffen; reine kosmetische Pflege.
- **WEGWEISER.md Mini-Glossar-Zeile** „zehn aktive + drei
  Schutz-Backlog-Module" muss in einer Folge-Pflege-Sitzung um
  „+ ein Diffusion-Backlog" ergänzt werden.
- **CLAUDE.md Modul-Tabelle**: könnte um Modul 14 als 13. Zeile
  ergänzt werden (gleiche Logik wie bei 10-12). Folge-Pflege.
- Bereits zuvor offen geblieben (von Pflege-Sitzungen 2026-05-15):
  Re-Sichttest Panel 07 Test 6 erledigt; Embedding-Baseline;
  Persistenz-Strategie-Verbinden; Match-Kalibrierungs-Beleg-Update.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Live-Andock-
   Versuch** zwischen Rezeptbuch und Mixarium (Karte 09
   vollständig auf neun Schritten, Module 00/05/07 alle
   Code-Stub + sichtgeprüft). Nicht headless ausführbar — Klaus
   aktiv im Browser mit zwei Endknoten-Repos nötig. Parallele
   Pflege-Sitzung Karte 09 „App-SW-Koexistenz" schließt den
   App-SW-Blocker zuerst.
2. **Folge-Pflege-Sitzung „Sage-Page für Modul 14"** —
   `index.html` (Bau-Puls + Module-Grid + ggf. Eigenschutz-Karte
   13) um `diffusionBacklog[]`-Rendering erweitern. Klein,
   headless ausführbar, parallel zu Bau-Sitzung 09 möglich.
3. Nach dem Live-Andock: **Spec-Sitzung Modul 06 Heterokaryose**
   (Klaus weiß dann aus echtem Endknoten-Betrieb, welche Daten
   austauschenswert sind).
4. **Spec-Sitzung Modul 14** erst bei Erreichen des Schwellwerts
   (Netz ≥ 10 oder erfolgreicher Live-Andock + Wachstums-
   Bedürfnis); danach Pflege-Sitzung Karte 05 für die
   `recommendedPeers`-Erweiterung.

---

## Pflicht-Häkchen am Sitzungsende

- [x] **`docs/components/14_diffusion.md` angelegt** als Stub im
      Format 10/11/12 (Status-Block · Im-Mycel-Bild ·
      Visualisierung · drei Diffusionspfade mit verbindlicher
      Auswahl Pfad 2 + Verwerfung Pfad 3 · sechs Anker-Punkte für
      Spec-Sitzung · Schwellwert „Wann ziehen" · Verbindung zu
      anderen Karten · vier Risiken · sechs offene Fragen)
- [x] **`status.json` erweitert** um `diffusionBacklog[]` parallel
      zu `schutzBacklog[]`; Eintrag Modul 14 mit
      `score:"schablone"` / `siegel:"Stub (Backlog), Priorität
      niedrig"`; `lastUpdated` auf `2026-05-15`;
      `scoreModel.maxScoreNote` unangetastet
- [x] **`scripts/update_puls_pie.py` erweitert** um
      `diffusionBacklog` zusätzlich zu `modules` + `schutzBacklog`
- [x] **`python3 scripts/update_puls_pie.py` gelaufen** — 13 → 14
      Module, Schablonen 4 → 5
- [x] **PULS Sitzungs-Eintrag oben** mit Was-getan / Was-nicht-
      geändert-bewusst / Frischer-Kopf-Befund / Was-offen-blieb /
      Nächster-Schritt
- [x] **PULS Schnellüberblicks-Tabelle** um Modul-14-Zeile analog
      10/11/12 erweitert
- [x] **PULS Offene-Querschnitts-Fragen**: Diffusion-Frage als
      gelöst durch Stub Modul 14 markiert (`~~…~~` + Verweis);
      neue offene Frage „Sage-Page sichtbar machen für Modul 14"
- [x] **PULS Schutz-Backlog-Abschnitt erweitert** um Sub-Abschnitt
      „Diffusion-Backlog" mit Begründung proaktiv vs. reaktiv +
      Schwellwert-Verweis
- [x] **INTERFACES.md §6 Änderungsprotokoll-Zeile** am unteren
      Ende ergänzt (neueste unten, Konventions-Stil)
- [x] **INTERFACES.md §1 unangetastet** (Stub hat keine
      Schnittstelle)
- [x] **Sage-Page (index.html) und Observatorium geprüft, nicht
      geändert** — als offene Querschnitts-Frage in PULS notiert
- [x] **Kein JS-Code in `src/`**
- [x] **Karte 05/10/11/12 unangetastet**
- [x] **`tests/manual_check.html` unangetastet**
- [x] **Übergabeprotokoll** (diese Datei)
- [ ] **Commit + Push** auf `claude/haupt-14-diffusion-stub-7fLee`
      (folgt)
- [ ] **Draft-PR gegen `main`** (folgt)
