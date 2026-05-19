# Übergabeprotokoll · 2026-05-18 · Hauptsitzung Modul 15 Membran — Backlog-Stub angelegt

**Sitzungs-Rolle:** Hauptsitzung (eine Sitzung, ein Anker-Scope).
Modul 15 „Membran" wird als reiner Backlog-Stub im Format der
Karten 10/11/12/14 angelegt. **Keine Spec-Detailarbeit**, **kein
JS-Code**, reiner Anker mit vier Sub-Bereichen (a Read-API ✅ Pflicht
/ b postMessage-Brücke ✅ Pflicht / c Capability-Token ⏳ später /
d Backup-Datei-Sluse 📄 nur Verweis auf Modul 02 Bau 02.X). Im
Unterschied zu 14 (Diffusion = proaktiv nach innen) ist 15 die
**proaktive Schwester nach außen** — Außenhülle zwischen PWA-Zelle
und Browser-Umgebung.

**Branch:** `claude/browser-use-indexeddb-Jopiy`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §A und
an `2026-05-15_haupt-14-diffusion-stub.md`.
**Modul:** 15_membran (Stub, Membran-Backlog).

---

## Auftrag

Klaus stellte am Sitzungs-Anfang die Frage:

> Lässt sich das Sage-Protokoll / die Spurenverteilung im Mycel so
> anfassen, dass Spuren im IndexedDB von „Browser Use" mit-genutzt
> werden — und dass Apps **innerhalb des Browsers** miteinander reden,
> **serverunabhängig**?

Spracheingabe-Erkenner hatte ein „Zelda" gestreut, das in der
AskUserQuestion-Klärung als „**Cells**" (Mycel-Vokabular) aufgelöst
wurde. Klaus wählte als Sitzungs-Ergebnis: **Neue Karte 15 anlegen**.

Eine Phase (Backlog-Anker anlegen), klarer Scope, kein Modul-Bau,
keine Spec-Detail-Arbeit:

1. **`docs/components/15_membran.md` anlegen** als Stub im Format
   10/11/12/14. Inhalt: Status-Block · Im-Mycel-Bild · Visualisierung ·
   Zweck · vier Sub-Bereiche der Membran (a/b/c/d) · spätere Spec-
   Anker · Schwellwert „Wann ziehen" · Verbindungen zu anderen
   Karten · Risiken · offene Fragen · Bauzustand · Querverweise.
2. **`status.json` erweitern** um neues Feld `membranBacklog[]`
   parallel zu `schutzBacklog[]` und `diffusionBacklog[]` (Architektur-
   Entscheidung: Schutz reaktiv, Diffusion proaktiv nach innen,
   Membran proaktiv nach außen); Eintrag Modul 15.
   `scoreModel.maxScoreNote` präzisiert um „Diffusion-Backlog (14)
   und Membran-Backlog (15) zählen nicht mit" — Wortlaut nachgeholt
   für 14 (war seit 2026-05-15 inkonsistent).
3. **`scripts/update_puls_pie.py` erweitern** um Lesen von
   `membranBacklog` (zusätzlich zu `modules` + `schutzBacklog` +
   `diffusionBacklog`), damit der Pie-Block Modul 15 als Schablone
   mitzählt. `python3 scripts/update_puls_pie.py` laufen (14 → 15
   Module; Schablonen-Zahl steigt von 4 auf 5).
4. **PULS.md erweitern**: Schnellüberblicks-Tabelle Modul 15;
   neuer Sub-Abschnitt „Membran-Backlog" nach dem Diffusion-Backlog
   mit Begründung „proaktiv nach außen vs. innen"; neuer Sitzungs-
   Eintrag oben in der Archiv-Tabelle.
5. **CLAUDE.md-Modul-Tabelle erweitern**: Überschrift erweitert auf
   „Die zehn Module + Schutz-Backlog 10-12 + Proaktiv-Backlog 14 + 15",
   neue Zeilen für Modul 14 (**nachgeholt** — fehlte seit 2026-05-15
   in der Tabelle) und Modul 15, Folgesatz ergänzt um Erklärung der
   Proaktiv-Backlog-Karten.
6. **INTERFACES.md** neuer Block für Modul 15 direkt nach Modul 09
   (Spec-Spiegelung im Schablone-Status mit Tabu-Liste und Hook-
   Punkten).
7. **Sage-Page `index.html` erweitern**: Schema-Kommentar,
   `FALLBACK_STATUS`, `BACKLOG_IDS`, `SLUG_MAP`, `TOPO_LAYOUT`,
   `renderTopology` (all-Aggregation + backLabel + counts-Summe),
   `renderModuleList` (byId + neuer Divider „Membran-Backlog
   · proaktiv (nach außen)").
8. **Übergabeprotokoll** (diese Datei).
9. **Sitzungs-Abschluss:** Commit + Push + Draft-PR.

---

## Was getan wurde

### 1. `docs/components/15_membran.md` angelegt

423 Zeilen, Format analog Karte 14, Pflicht-Inhalt:

- **Status-Block** als Blockquote: `🟫 Schablone · Membran-Backlog
  · Priorität niedrig`, Schicht „Außenhülle (Brücke zwischen Knoten
  und seiner Browser-Umgebung)", Anker „Sage-Page → Karte 4 / 13 / 14
  als zweiter Backlog parallel zu Diffusion", Datei
  `src/modules/15_membran.js` (existiert noch nicht — Spec ausstehend),
  Ein-Zeilen-Zusammenfassung.

- **„Im Mycel-Bild"**-Block: Zellmembran-Metapher (Rezeptoren +
  Kanäle), passiv-reaktiv, Außenhülle zur Welt. Verankert in Klaus'
  Vokabular „Cells".

- **Visualisierung** als Mermaid-Flowchart: drei Membran-Strukturen
  (Rezeptor / Kanal / Sluse) zwischen KI-Browser-Agent / Rezeptbuch-
  PWA / Mixarium-PWA / Benutzer-Datei-System und den Stores
  `sbkim_spore` (gehashed) + `sbkim_keys` (vollverschlüsselt).
  Lesart-Block mit Tabu „niemals roher Zugriff auf `sbkim_keys`".

- **„Zweck"**: drei neue Realitäten als Auslöser — KI-Browser
  werden Markt-reif (Anthropic Browser Use SDK / OpenAI Operator /
  Comet / Dia), zwei Endknoten leben seit 2026-05-16 auf demselben
  Browser aber unterschiedlichen Origins, Backup-Export aus Modul 02
  Bau 02.X existiert und braucht formalen Anker.

- **„Vier Sub-Bereiche der Membran"** (Auswahl-Block analog Karte 14
  „Drei Pfade"):
  - **Sub (a) — Read-API für KI-Browser-Agenten** ✅ Pflicht Stufe 1.
    `window.SbkimMembrane.read()` → Promise<{ protocolVersion, nodeId,
    domain, sporeUrl, siblings[].nodeIdHash, storage:
    {quotaWarningLevel, storagePersisted} }>. Streng lesend, kein
    Seiteneffekt. **Tabus:** niemals `sbkim_keys`, niemals `nodeId`
    der Geschwister im Klartext (nur `nodeIdHash`), niemals schreiben.
  - **Sub (b) — App-zu-App-Brücke via `postMessage`** ✅ Pflicht
    Stufe 2. `type:"sbkim/membrane/v1"`, `op:"sporeRef"|"query"|"hint"`
    (**kein** `handshake`), strikte Origin-Allowlist hartkodiert im
    Andocker, nonce-Pflicht gegen Replay. **Tabus:** kein Handshake
    über die Brücke, Allowlist nicht selbst-änderbar.
  - **Sub (c) — Capability-Handshake (Membran-Token)** ⏳ Stufe 3.
    `MembraneCapability = { audience, scope:"read"|"hint", expiresAt,
    nonce, signature: Ed25519(...) }`. Signatur nutzt Modul 02. Final
    Spec-Vorbehalt — Sub (c) wird nicht vor (a)+(b) gebaut.
  - **Sub (d) — Backup-Datei als manueller App-Transport** 📄 nur
    Verweis. Existiert bereits in Modul 02 Bau 02.X (PBKDF2-SHA256
    600 000 + AES-GCM-256). Karte 15 baut nichts dazu.

- **„Was eine spätere Spec-Sitzung füllen müsste"**: vier Block-
  Anker (für jeden Sub-Bereich), bewusst leer gehalten — Bau-Sitzung
  darf nichts ableiten, wer baut, ruft erst eine Spec-Sitzung 15.

- **„Wann ziehen"**: höhere Schwelle als Karte 14 (mindestens **zwei**
  Bedingungen, weil Membran-Bau neue Angriffsfläche eröffnet) — KI-
  Browser real verfügbar, App-zu-App-Wunsch konkret, dritter Endknoten
  außerhalb `github.io`.

- **„Verbindung zu anderen Karten"**: Modul 02 (Signatur für Sub (c)),
  Modul 05 (Membran ersetzt Handshake nicht — `op:"handshake"`
  bewusst ausgeschlossen), Modul 06 (Sluse-Verweis), Modul 09
  (Andock-Schritt 10 für Allowlist-Konfiguration, Folge-Pflege),
  Modul 13 (Sage-Page), **Modul 14 (spiegelbildlich — Diffusion
  proaktiv nach innen, Membran proaktiv nach außen)**.

- **„Risiken"**: sieben Punkte — Origin-Spoofing, Datenexfiltration,
  Agent-Replay, Konsens-Bruch, Allowlist-Drift, Sluse-Phishing
  (heute mitigiert durch `BackupOverwriteError`), PWA-Suffix vs.
  Origin-Allowlist-Kollision.

- **„Bekannte offene Fragen"**: sieben Punkte für die spätere Spec-
  Sitzung (globaler Name, Anonymisierungstiefe, postMessage vs.
  BroadcastChannel vs. SharedWorker, Allowlist-Konfigurationspfad,
  Lead-vs-Hint-Trennung, Capability-Token-Bezug, Sluse-Verweis-Pflege).

- **„Bauzustand"**-Tabelle mit Zeile „Stub angelegt 2026-05-18 ·
  Hauptsitzung 15-Membran-Stub" und Anmerkungs-Block (vier Sub-
  Bereiche, Klaus' Auslöser, Vokabular „Cells").

- **„Querverweise"**: Abhängigkeiten · Nutzer · Hook-Punkte
  (10/11/12) · Site-Karte · Paper · Verwandt (14/02/09/00).

### 2. `status.json` erweitert

- `lastUpdated`: `"2026-05-17"` → `"2026-05-18"`.
- Neues Top-Level-Feld `membranBacklog[]` parallel zu
  `schutzBacklog[]` und `diffusionBacklog[]`. Eintrag Modul 15
  mit `score:"schablone"`, ausführlichem `siegel` und `kurz`.
- `scoreModel.maxScoreNote` präzisiert: „Schutz-Backlog (10-12),
  Diffusion-Backlog (14) und Membran-Backlog (15) zählen nicht mit,
  da reaktiv/proaktiv-zukünftig." (Diffusion-Erwähnung war seit
  2026-05-15 fehlend — nachgeholt.)

### 3. `scripts/update_puls_pie.py` erweitert

- Modul-Docstring um `membranBacklog` ergänzt.
- `count_statuses` `pool`-Liste um `status.get("membranBacklog", [])`
  erweitert.
- `python3 scripts/update_puls_pie.py` ausgeführt → **15 Module,
  5 Schablonen** (10, 11, 12, 14, 15), Pie-Block in PULS.md
  automatisch aktualisiert.

### 4. `docs/PULS.md` erweitert

- Schnellüberblicks-Tabelle: neue Zeile `| 15 membran | Stub
  (Membran-Backlog) | — | — | …` analog Karte 14, mit vier-Sub-
  Bereiche-Zusammenfassung und Auslöser-Kontext.
- Neuer Sub-Abschnitt **„Membran-Backlog (aus Hauptsitzung
  15-Membran-Stub, 2026-05-18)"** direkt nach Diffusion-Backlog-
  Sektion. Erklärt: Schutz reaktiv, Diffusion proaktiv nach innen,
  Membran proaktiv nach außen. Auswahl verbindlich (a)+(b) Pflicht.
  Wann-ziehen-Bedingungen (mind. 2 von 3). Notiz: `status.json`
  führt `membranBacklog[]`, `scoreModel.maxScoreNote` präzisiert,
  Pie-Skript zählt mit.
- Neue Sitzungs-Eintrag-Zeile oben in der Archiv-Tabelle, Datum
  2026-05-18, mit Verweis auf diese Datei.

### 5. `CLAUDE.md` Modul-Tabelle erweitert

- Überschrift: „Die zehn Module + Schutz-Backlog 10-12 + Proaktiv-
  Backlog 14 + 15".
- Neue Zeile für **Modul 14** (nachgeholt — fehlte in der Tabelle
  seit der Hauptsitzung 14-Diffusion-Stub vom 2026-05-15; durch
  Konsistenz-Pflege mitgezogen).
- Neue Zeile für **Modul 15** mit Datei-Pfad und Status-Beschreibung.
- Folgesatz ergänzt: „Karten 14 + 15 sind proaktive Backlog-Karten
  — Diffusion (14) arbeitet nach innen, Membran (15) arbeitet nach
  außen. Beide werden in der Sage-Page Karten 4 / 13 / 14 parallel
  zum Schutz-Backlog gerendert."

### 6. `docs/INTERFACES.md` Block für Modul 15 angelegt

Direkt nach dem `Modul: 09_einbau_pwa`-Block (vor §2 Datenformate).
Status `schablone`, Datei-Verweis auf Karte 15, **Bietet** (geplant,
nicht implementiert) mit den vier Sub-Bereich-Schnittstellen
(window.SbkimMembrane.read, postMessage-Schema, MembraneCapability-
Form, Backup-Verweis). **Nutzt-von**, **Abhängigkeiten** (Modul 02 +
01-Leserecht + 00-Spiegelung, kein neuer Store in Stufe 1).
**Tabus** als verbindlicher Block: niemals `sbkim_keys`, nur
`nodeIdHash`, kein Schreiben in (a), kein `op:"handshake"` in (b),
Origin-Allowlist statisch, Nonce-Pflicht. **Hook-Punkte** für
10/11/12 als Verweis. **Risiken** als Spec-Sitzungs-Auftrag.
Geprüft-Zeile 2026-05-18.

### 7. Sage-Page `index.html` erweitert

- Schema-Kommentar (Karte 7 Datenquelle): neuer Eintrag
  `"membranBacklog": [// 15 — proaktiv nach außen]`, parallel
  zu schutz/diffusion. Diffusion-Kommentar präzisiert zu
  „proaktiv nach innen".
- `FALLBACK_STATUS`: `membranBacklog: []` ergänzt.
- `BACKLOG_IDS`: `Set(['10','11','12','14'])` → `Set(['10','11','12','14','15'])`.
- `SLUG_MAP`: neue Zeile `'15': 'membran'`.
- `TOPO_LAYOUT`: neue Zeile `'15': { col: 3, row: 6 }`.
- `renderTopology`: `all`-Aggregation um `(s.membranBacklog || [])`
  erweitert. `backLabel.textContent` aktualisiert auf „backlog ·
  reaktiv (schutz) + proaktiv (diffusion + membran)". Counts-Summe
  in der Anzeige zählt Membran-Backlog mit.
- `renderModuleList`: byId-Aggregation erweitert; neuer dritter
  Divider „Membran-Backlog · proaktiv (nach außen) · Priorität
  niedrig", der `s.membranBacklog`-Einträge rendert. Diffusion-
  Divider präzisiert zu „proaktiv (nach innen)".

### 8. Übergabeprotokoll

Diese Datei.

### 9. Manueller Test

**Nicht in dieser Sitzung durchgeführt — headless gebaut.** Klaus'
Browser-Sichttest auf `index.html` steht aus. Erwartung beim Sichttest:

- Pie-Center der Topologie zeigt **15** statt 14.
- Legende „Schablonen 5", andere Counts unverändert.
- Modul 15 erscheint als blauer Kreis im Backlog-Bereich
  (col 3, row 6) der Topologie.
- Modul-Liste hat dritten Divider „Membran-Backlog" mit der
  Modul-15-Zeile darunter.
- Klick auf Modul 15 öffnet Detail-Modal mit Spore-Kurztext.
- Daten-Schema-Beispiel-Karte zeigt drei Backlog-Kommentare.

Folge-Mini-Pflege nach Klaus' Sichttest, falls Befunde.

---

## Was offen blieb

- **Sichttest `index.html`** wartet auf Klaus' Browser-Lauf
  (s. § Manueller Test).
- **Modul 09 Andock-Schritt 10 „Membran-Allowlist konfigurieren"**
  — wird in einer Folge-Pflege Karte 09 nachgezogen, wenn Spec-
  Sitzung 15 stattfindet. Heute nicht relevant, weil 15 noch Stub
  ist; nur als Anker in Karte 15 § Querverweise dokumentiert.
- **Konsistenz-Pflege CLAUDE.md/Karte 14**: dass Karte 14 erst in
  dieser Sitzung in die CLAUDE.md-Modul-Tabelle aufgenommen wurde
  (statt damals in der 14-Diffusion-Stub-Sitzung), ist ein nach-
  geholter Konsistenz-Eintrag — kein Bug.
- **Sub (b) postMessage vs. BroadcastChannel** (offene Frage in
  Karte 15 § Bekannte offene Fragen Punkt 3) — Spec-Sitzung 15
  entscheidet; eventuell SharedWorker-Variante einbeziehen, aber
  Safari-Lücken sind zu prüfen.

---

## Nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest** der Sage-Page (`index.html` lokal
   öffnen, Pie + Topologie + Modul-Liste + Detail-Modal prüfen).
   Setzt nichts voraus, läuft headless-arm.
2. **Falls Befunde:** Mini-Pflege „Sage-Page Modul 15 Sichtbarmachung
   Fixes" wie nach Karte 14 (2026-05-15).
3. **Sonst:** Membran-Karte 15 bleibt Stub, bis KI-Browser real
   verfügbar werden (Anthropic Browser Use SDK öffentlich; OpenAI
   Operator dito) **oder** ein dritter Endknoten-Betreiber mit
   App-zu-App-Wunsch auftaucht. Bis dahin: kein Spec-Bau, kein
   Code-Bau, kein Eingriff in Module 02/05/06/09.
4. **Modul 14 nachgeholte Konsistenz-Pflege CLAUDE.md** ist
   abgeschlossen — keine weitere Aktion nötig.

---

## Beleg-Block

- Karte 15: `docs/components/15_membran.md`, 423 Zeilen, Status
  🟫 Schablone, Bauzustand-Zeile „Stub angelegt 2026-05-18".
- `status.json`: `lastUpdated = "2026-05-18"`, `membranBacklog[0].id
  = "15"`, `membranBacklog[0].score = "schablone"`,
  `scoreModel.maxScoreNote` präzisiert.
- `scripts/update_puls_pie.py`: `pool`-Liste enthält
  `status.get("membranBacklog", [])`.
- Pie-Lauf-Ausgabe: „PULS-Pie aktualisiert (Stand 2026-05-18,
  15 Module): 🟫 Schablone: 5 · 🟧 In Werkstatt: 0 · 🟨 Spec fertig: 0
  · 🟦 Code-Stub: 7 · 🟩 Fertig: 3".
- PULS.md: Schnellüberblicks-Zeile 15 membran, Sektion „Membran-
  Backlog" nach Diffusion-Backlog, Sitzungs-Eintrag oben.
- INTERFACES.md: Block `Modul: 15_membran` zwischen Modul 09 und §2.
- CLAUDE.md: Überschrift „Die zehn Module + Schutz-Backlog 10-12 +
  Proaktiv-Backlog 14 + 15", neue Zeilen für 14 und 15.
- `index.html`: Schema-Kommentar, FALLBACK_STATUS, BACKLOG_IDS,
  SLUG_MAP, TOPO_LAYOUT, renderTopology, renderModuleList alle
  erweitert.

---

## Konventions-Anker

- Backlog-Karten (Stub-Format): Status-Block · Mycel-Bild ·
  Visualisierung · Zweck · Auswahl-Tabelle · spätere Spec-Anker ·
  Wann-ziehen · Verbindungen · Risiken · offene Fragen · Bauzustand
  · Querverweise. Vorbild: Karte 14, jetzt auch Karte 15.
- Drei Backlog-Kategorien etabliert: Schutz (reaktiv) · Diffusion
  (proaktiv nach innen) · Membran (proaktiv nach außen). Mehr
  Kategorien sind nicht zwingend nötig — eine vierte Achse („proaktiv
  zur Zeit" oder ähnlich) würde die Mycel-Metapher überdehnen.
- Empfangsmodus-Prinzip gilt absolut: Membran initiiert nichts,
  hat nur Rezeptoren und Kanäle. Kein `op:"handshake"` in Sub (b),
  kein `scope:"write"` in Sub (c).
