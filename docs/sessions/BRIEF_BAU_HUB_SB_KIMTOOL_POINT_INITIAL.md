# Brief — Initial-Bau SB-KIMTool-Point (externer Mycel-Hub)

**Anlass:** Sage-Protokol Bau-Sitzung 04.C (2026-05-26) hat die
Vorlage `docs/components/_sb_kim_tool_point_template/` angelegt
(fünf Dateien: index.html, status.json, README.md, sbkim/spore.json,
EINBAU.md). Diese Bau-Sitzung setzt die Vorlage in Klaus' externes
Repo `lausiklauskn-png/SB-KIMTool-Point` ein und liefert einen
initialen Commit.

**Repo:** `lausiklauskn-png/SB-KIMTool-Point` (extern, **NICHT
Sage-Protokol**). Repo wurde 2026-05-26 als public + leer angelegt.

**Pipeline-Stellung:** Phase B Pipeline-Schritt 9 (Externer Mycel-
Hub — siehe CLAUDE.md im Sage-Protokol-Repo). **NACH App-Freigabe**
(Phase B ist nach Klaus' App-Freigabe vorgesehen, aber die Vorlage
ist schon kopierfertig).

**Voraussetzungen:**

- Sage-Protokol Bau 04.C ist gemerged → Vorlage liegt unter
  `docs/components/_sb_kim_tool_point_template/`.
- Modul 19 Andock-Wizard kann optional schon gebaut sein (Phase B
  Schritt 7); andernfalls rendert die Hub-`index.html` einen
  Placeholder.
- Klaus hat Schreibrechte im Hub-Repo (eigener Account).

**Branch-Vorschlag (im Hub-Repo):** `main` direkt (Erst-Befüllung,
kein PR-Workflow nötig — leeres Repo).

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung im Hub-Repo)

```
Du bist eine Bau-Sitzung in SB-KIMTool-Point (externes Hub-Repo,
NICHT Sage-Protokol).

Sitzungs-Rolle: Initial-Bau — Hub-Landing-Page + Hub-Spore + ausgewählte
SBKIM-Module übernehmen. Erstes Commit ins leere Repo.

Branch: main (direkt — leeres Repo, kein PR-Workflow nötig).

Pflichtleseliste (in dieser Reihenfolge):
1. Sage-Protokol docs/components/_sb_kim_tool_point_template/EINBAU.md
   (Sieben-Schritte-Anleitung).
2. Sage-Protokol docs/components/_mycel_hub.md (Konzept-Karte).
3. Sage-Protokol docs/components/_sb_kim_tool_point_template/
   (alle fünf Dateien als Vorlage).
4. Sage-Protokol src/modules/02_spore.js (Modul 02 — für Hub-Spore).
5. Sage-Protokol src/modules/17_floating_widget.js (Modul 17 — für
   Hub-Sichtbarkeit als SBKIM-Knoten).

Deine Aufgabe (= EINBAU.md Schritte 1–7):

A. **Vorlage kopieren** (Sage-Protokol →
   lausiklauskn-png/SB-KIMTool-Point):
   - docs/components/_sb_kim_tool_point_template/index.html → /index.html
   - docs/components/_sb_kim_tool_point_template/status.json → /status.json
   - docs/components/_sb_kim_tool_point_template/README.md → /README.md
   - docs/components/_sb_kim_tool_point_template/sbkim/spore.json → /sbkim/spore.json
   - docs/components/_sb_kim_tool_point_template/EINBAU.md → /EINBAU.md

B. **SBKIM-Module übernehmen** aus Sage-Protokol src/modules/:
   Pflicht:
   - 02_spore.js → modules/02_spore.js
   - 17_floating_widget.js → modules/17_floating_widget.js
   Optional für Phase C Cross-Knoten-Such-Tests:
   - 01_storage.js, 03_embedding.js, 04_match.js, 05_anastomose.js,
     16_siegel.js → modules/
   Sobald Modul 19 gebaut:
   - 19_andock_wizard.js → modules/19_andock_wizard.js

C. **index.html aktivieren:** die zwei auskommentierten <script>-
   Tags einkommentieren (Modul 17 + Modul 19 sofern gebaut).

D. **Hub-Spore initial erzeugen** (optional, aber empfohlen — Hub
   wird damit selbst zum SBKIM-Knoten):
   - Hub-URL im Browser öffnen (lokal via Termux-localhost:8000
     ODER nach GitHub-Pages-Aktivierung live).
   - Browser-Konsole:
     await SbkimStorage.init({dbSuffix: "hub"});
     await SbkimSpore.init();
     const spore = await SbkimSpore.generateOwnSpore({
       domain: "Mycel-Hub",
       nodeType: "hybrid",
       endpoint: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",
       nodeName: "SB-KIMTool-Point (Hub)",
       domainDescription: "Externer SBKIM-Mycel-Hub — Forker-Observatorium light.",
       domainKeywords: ["SBKIM","Mycel","Forker-Hub","Observatorium","Andocken","Spore","Endknoten"],
     });
     console.log(JSON.stringify(spore, null, 2));
   - JSON-Output nach sbkim/spore.json kopieren + committen.

E. **GitHub-Pages aktivieren:** Repo-Settings → Pages → Source:
   main Branch, / (root). URL: https://lausiklauskn-png.github.io/SB-KIMTool-Point/.

F. **Initial-Commit + Push.**
   git add index.html status.json README.md EINBAU.md sbkim/ modules/
   git commit -m "SB-KIMTool-Point initial — Hub-Landing-Page + Hub-Spore + Modul 02/17"
   git push -u origin main

G. **Verifikation:**
   - Hub-URL lädt im Browser, Header zeigt "SB-KIMTool-Point".
   - "Andocken"-Sektion zeigt Wizard (Modul 19 da) oder Placeholder.
   - "Angedockte Endknoten"-Sektion zeigt "noch keine Forker
     registriert".
   - Footer verweist auf Sage-Protokol.
   - Floating-Widget mountet unten rechts (wenn Modul 17 geladen).

Was du nicht tust:

- KEINE Spec-Spiegelung aus Sage-Protokol (keine Karten, keine
  INTERFACES.md-Kopie).
- KEINE Klaus-Endknoten (MR/MM/Sage) in der Hub-status.json
  registrieren — die stehen in Sage-Protokol-status.json.
- KEINE PII von potentiellen Forkern in status.json.
- KEINE Auto-PR-Merge-Regel im Repo-Setting.
- KEIN Push in Sage-Protokol-Repo (das ist diese Sitzung NICHT —
  Sage-Protokol-Vorlage bleibt unangetastet).

Pflicht am Ende:

- Hub-Repo lausiklauskn-png/SB-KIMTool-Point hat initial-Commit
  auf main.
- GitHub-Pages aktiv, URL erreichbar.
- Verifikation 5 Punkte durch Klaus.
- (Optional) Hub-Spore erzeugt + sbkim/spore.json befüllt.
- Endknoten-Liste leer (kein Forker registriert).
- Sage-Protokol unangetastet (diese Sitzung pflegt das externe Repo).
```

---

## Hintergrund

Klaus' Naming-Festlegung 2026-05-26: `SB-KIMTool-Point` als Repo-Name
für den externen Mycel-Hub. `SB-KIM` referenziert das Akronym mit
Bindestrich-Lesbarkeit; `Tool-Point` bezeichnet den Sammelpunkt für
Modul-18-Tool-PWAs. Repo wurde public + leer am 2026-05-26 angelegt.

Die Trennung Sage-Protokol vs. SB-KIMTool-Point:

- **Sage** = Klaus' Spec-Bibliothek + Klaus' eigene Endknoten
  (Rezeptbuch, Mixarium, Sage selbst).
- **SB-KIMTool-Point** = Forker-Observatorium light. Forker tragen
  sich hier via Wizard ein. Klaus muss nicht jeden Forker-PR an der
  Sage reviewen.

Diese Bau-Sitzung ist die Erst-Befüllung des Hub-Repos. Spätere
Pflege läuft via PR im Hub-Repo.

## Nach dieser Sitzung

- **Phase C Schritt 10:** Pepo Semantic Match Demo als ersten
  Forker andocken (eigene Sitzung).
- **Phase C Schritt 11:** Muttis Rezeptbuch andocken (eigene Sitzung).
- **Phase C Schritt 12:** Cross-Knoten-Such-Test über
  Forker-Endpunkte.

## Heilige Tafeln dieser Sitzung

- KEINE Spec-Spiegelung.
- KEINE PII von Forkern.
- KEINE Klaus-Endknoten in Hub-status.json (Default).
- KEIN Push in Sage-Protokol.
- KEIN Modul-Code-Eingriff (Vorlage-Kopie ist Pflicht-Pfad —
  Hub übernimmt Module unverändert vom Sage-Bau-Commit).

---

**Endstand-Codeblock für die übernächste Sitzung** (Phase C
Schritt 10 — Erster Forker andocken):

```
Du bist eine Sitzung im Forker-Repo (lausiklauskn-png/semantic-match-demo
oder lausiklauskn-png/muttis-rezeptbuch).

Sitzungs-Rolle: Forker-PWA an SB-KIMTool-Point andocken — erste
Forker-Eintragung in Hub-status.json.

Pflichtleseliste:
1. CLAUDE.md des Forker-Repos.
2. SB-KIMTool-Point README.md + EINBAU.md.
3. Sage-Protokol docs/components/09_einbau_pwa.md (Andock-Anleitung).
4. Sage-Protokol docs/components/19_andock_wizard.md (Wizard-Spec).

Schritte:
A. Forker-PWA mit SBKIM-Modulen befüllen (Sage Karte 09).
B. Forker-Spore erzeugen (Modul 02 generateOwnSpore mit eigener
   Domain).
C. Hub-Andock-Wizard öffnen → Wizard erzeugt PR gegen
   SB-KIMTool-Point/status.json.
D. PR im Hub-Repo merged (Klaus oder Maintainer).
E. Hub-Landing-Page zeigt Forker-Eintrag.
F. Optional: Cross-Knoten-Handshake zu Sage-Endknoten (MR/MM)
   anstoßen.
```
