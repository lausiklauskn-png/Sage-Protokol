# Brief — Vektoren-Kalibrierung abschließen + „neues Modul" für Pinnwand & Such-Werkzeug, dann Sage / SB-KIMTool-Point / family-projekt.de aktualisieren

> **Freibrief gilt** (CLAUDE.md § Freibrief — jetzt **netzweit**: eigene PRs in
> JEDEM Repo selbstständig mergen, wenn getestet, abgegrenzt, sinnvoll; echtes
> Zweifeln → erst Klaus fragen). Vor jedem Urteil/Bau: `git fetch origin main`
> + `git ls-tree -r origin/main` + md5 — NIE aus dem Working-Tree schließen
> (Stale-Checkout-Lehre; Branches können weit hinter `main` liegen → bei
> Konflikt-Rebase besser `git reset --hard origin/main` + Edit neu anwenden).

## Das Ziel (Klaus 2026-06-28)

Diese Brief-Kette läuft, **bis** das **Such-Werkzeug** (Modul 22) und die
**Pinnwand** (Pinnwand-PWA) ihr **neues Modul** (Verwandtschafts-/„Wählen"-
Schicht: Modul 04 `relatedness` + Anzeige in 22/23/Pinnwand) tragen **und** die
**Vektoren-Kalibrierung** (`RELATEDNESS_CENTER` v2) **abgeschlossen** ist —
sodass wir danach in **einem Zug netzweit** aktualisieren können:

1. **Sage-Protokol** (Hub + Knoten)
2. **SB-KIMTool-Point** (Mycel-Hub / Werkzeugkiste)
3. **family-projekt.de** (family-project)
4. **Alle weiteren Repos, die das Andock-Tool oder andere SBKIM-Module fahren
   und nachkalibriert wurden** — auf die **zwei neuen Einstellungen ihrer
   Vektorengenauigkeit** bringen (Klaus 2026-06-28): das **Zwei-Maß-Design**
   („**verbunden**" = grob, rohe Cosinus-Reihenfolge ↔ „**verwandt**" = genau,
   zentrierter Cosinus über `relatedness()`) **UND** den **kalibrierten
   `RELATEDNESS_CENTER` v2**. Betrifft u.a. Mein-Mixarium, Mein-Rezeptbuch,
   Mein-Tresor, Jasons-Tresor, BookLedgerPro — jeder Knoten, der `04_match.js`
   / einen Andock-Pfad trägt, kriegt **denselben** Center + dasselbe Zwei-Maß.

Reihenfolge ist bindend: **erst Kalibrierung lockern, dann rollen** — sonst
verteilen wir einen ungeeigneten Center-Vektor an viele Knoten. Die zwei
„neuen Einstellungen" sind genau (a) das verbunden/verwandt-Maß und (b) der
v2-Center; **beide müssen netzweit identisch** sein, sonst messen Knoten
unterschiedlich „verwandt".

## Ausgangslage (Stand 2026-06-28, nach Badge-Rollout-Sitzung)

- **Badge in Sage main:** PR #483 (Modul 23 Verwandtschafts-Badge) + #485
  (Mess-Knopf) gemergt. Sage main intern drift-frei (`src/modules/{04,23,23_ui}`
  == `sbkim-bundle/modules/…`).
- **Mixarium:** `sbkim/{04_match,23_rendezvous,23_rendezvous_ui}.js` byte-1:1 auf
  Sage-main-Stand (PR #81 gemergt). Browser-Sichttest Badge wartet auf Klaus.
- **Selbst-Merge-Freibrief netzweit** in allen Repo-CLAUDE.md verankert
  (2026-06-28).
- **Offen:** `RELATEDNESS_CENTER` ist noch **v1**. v2-Mess-Knopf liegt in
  `tests/manual_check.html` Panel 04 („RELATEDNESS_CENTER v2 messen …"),
  **ändert keine Konstante** — wartet auf Klaus' Browser-Mess-Lauf.

## Schritt 1 — Vektoren-Kalibrierung (`RELATEDNESS_CENTER` v2) lockern · BLOCKER

**Voraussetzung:** Klaus klickt den Mess-Knopf (Panel 04), liest das v2-Literal
+ die v1/v2-Referenz-Tabelle und meldet `freigabeReif`.

- Nur bei `freigabeReif:true` (Referenz-Fälle in v1 UND v2 korrekt: Schwestern
  oben + verwandt; Hub↔Endknoten unten + nicht-verwandt): Konstante
  `RELATEDNESS_CENTER` in `src/modules/04_match.js` bewusst auf das v2-Literal
  setzen. Versions-Hinweis im Commit + PULS.
- **Netzweit:** ALLE byte-Kopien von `04_match.js` identisch nachziehen —
  `sbkim-bundle/modules/04_match.js`, `such-tool/modules/04_match.js`,
  Mixarium `sbkim/04_match.js`, family-projekt.de `sbkim/04_match.js`.
- `smoke_bau04e` muss mit dem neuen Center grün bleiben (Erwartungswerte ggf.
  bewusst anpassen + dokumentieren). Drift-Guard (md5) über alle Kopien grün.
- **SIGNAL §11.6 Pflicht** (netzweite Konstante): `sbkim/SIGNAL.json` `seq`+1,
  `headline`/`forNodes`, Bau-Protokoll-Zeile ins betroffene Postfach, push.

## Schritt 2 — „Neues Modul" in Such-Werkzeug & Pinnwand bestätigen/nachziehen

- **Such-Werkzeug (Modul 22):** trägt den „Wählen"-Umschalter (verbunden ↔
  verwandt) bereits (Bau 22e). Nach Schritt 1 läuft er auf dem **kalibrierten**
  Center automatisch (liest Modul 04). Prüfen: Such-Tool-Kopie
  (`such-tool/modules/22…` + `04…`) byte-1:1, Drift-Guard grün.
- **Pinnwand-PWA:** Strang A war bewusst KEIN Eingriff (sie zentriert seiten-
  lokal/wachsend, passender als der netzweite Center für freien Q&A-Text —
  siehe LEHRE-Doc 2026-06-28 Nacht). **Klaus' neue Bitte prüfen:** soll die
  Pinnwand denselben „Wählen"-Schalter / dasselbe Modul bekommen? Falls ja:
  **erst Plan an Klaus** (Pinnwand-UI-Architektur betroffen), dann reine
  Anzeige-Schicht ergänzen (gatet nichts). Falls die seiten-lokale Zentrierung
  bleibt: das ausdrücklich als bewusste Abweichung dokumentieren.

## Schritt 3 — Netzweiter Rollout (NACH Schritt 1+2)

Byte-1:1 auf den kalibrierten Sage-main-Stand ziehen, je Knoten Drift-Guard
(md5) grün, Lade-Reihenfolge (04 vor 22/23) bestätigt, **kein Funktions-
Eingriff**:

- **SB-KIMTool-Point:** relevante `sandbox/`-bzw.-Modul-Kopien (04 + Wählen-
  Anzeige) auf Stand. Achtung: SB-KIMTool-Point spiegelt Sage-Module „Datei für
  Datei", kein git-clone (CLAUDE.md). `npm test` grün.
- **family-project (family-projekt.de):** `sbkim/04_match.js` + Rendezvous-
  Module auf Stand. family fährt ein **eigenes Raum-UI** (kein
  `23_rendezvous_ui.js`) → das Badge dort ist ein **Consumer-Refactor** (family
  wird Konsument von Modul 23 + Wählen-Anzeige). **Erst Plan an Klaus**
  (family-UI-Architektur betroffen).
- **Mixarium / Rezeptbuch:** `sbkim/04_match.js` byte-1:1 nachziehen (neuer
  Center) + prüfen, ob das Zwei-Maß (verbunden/verwandt) in deren Such-/Andock-
  UI sichtbar ist; falls nicht und Klaus es will → reine Anzeige-Schicht
  ergänzen (Plan-vor-Code bei UI-Eingriff).
- **Mein-Tresor / Jasons-Tresor / BookLedgerPro:** jeder Knoten mit Andock-Pfad
  / `04_match` bekommt **denselben** v2-Center; deren `npm test` grün halten.
  Wo ein Andock-Tool die Vektorengenauigkeit anzeigt/nutzt, auf die zwei neuen
  Einstellungen (verbunden/verwandt + v2-Center) nachkalibrieren.

**Netzweite Konsistenz-Probe zum Schluss:** für JEDEN Knoten, der `04_match.js`
fährt, den md5 von `04_match.js` gegen Sage main vergleichen → eine einzige
Tabelle „Knoten · md5 · MATCH/DIFFER". Erst wenn alle MATCH, ist der Rollout
abgeschlossen. Stille Drifts hier sind der gefährlichste Fall (zwei Knoten
messen „verwandt" unterschiedlich).

## Datenverträge (nicht brechen)
- **Reine Anzeige-Schicht.** `relatedness()` gatet nichts; `PROVIDER_MIN_MATCH`
  (0.80, Modul 05 Handshake) / Andock-Riegel bleiben unverändert.
- Vektoren `Float32Array(384)`, L2-normiert (Modul 03). `relatedness` wirft
  `InvalidVectorError` → fail-soft umschließen.
- `RELATEDNESS_CENTER`-Änderung ist **netzweit** → alle Knoten identische
  Konstante (SIGNAL §11.6, Versions-Hinweis im Commit/PULS).
- Kern-Module 02/05/05b/23 unangetastet; Modul 04 nur an der EINEN Konstante
  gesetzt, sonst gelesen.

## Akzeptanzkriterien
1. (Schritt 1) v2-Konstante nur bei `freigabeReif`, netzweit identisch (alle
   byte-Kopien), `smoke_bau04e` grün, SIGNAL gesetzt, Referenz-Fälle
   dokumentiert.
2. (Schritt 2) Such-Werkzeug + Pinnwand tragen das Wählen-Modul (oder
   dokumentierte bewusste Abweichung), Drift-Guard grün.
3. (Schritt 3) Sage / SB-KIMTool-Point / family-projekt.de **und alle weiteren
   Knoten mit `04_match`/Andock-Pfad** byte-1:1 auf kalibriertem Stand (v2-Center
   + Zwei-Maß), je Drift-Guard grün, Lade-Reihenfolge bestätigt, `npm test`/Smoke
   grün. Abschluss-Konsistenz-Tabelle (alle md5 == Sage main) belegt.
4. Headless-Smoke grün überall; Browser-Sichttest wartet auf Klaus.

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)
1. Dieser Brief. 2. `CLAUDE.md` (Freibrief netzweit, Konventionen). 3.
`docs/PULS.md` (oberster Eintrag). 4.
`docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`. 5. `INTERFACES.md` §0
(`RELATEDNESS_MIN`) + §1 Modul 04 + Modul 22 + Modul 23 + §11.6 (SIGNAL). 6.
Code: `src/modules/04_match.js` (`RELATEDNESS_CENTER`/`relatedness`),
`tests/manual_check.html` Panel 04 (Mess-Knopf), `such-tool/modules/…`,
Pinnwand-PWA, family-Raum-UI + Script-Tags.

## Abschluss-Pflicht (die Kette reißt nie ab)
PULS fortschreiben, Übergabeprotokoll, „Nächste Schritte"-Block im Chat, neuen
Brief als Codeblock im Chat. SIGNAL §11.6 bei netzweiter Konstante Pflicht.
Kern-Match bleibt unberührt.
