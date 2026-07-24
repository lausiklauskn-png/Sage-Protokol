# PULS-Archiv — Mai 2026 (26.–31.05.), ausgelagert 2026-07-24

Diese Datei enthält die vollständigen PULS-Sitzungs-Einträge vom **26.–31.05.2026** (51 Einträge),
am 2026-07-24 aus `docs/PULS.md` § „Sitzungs-Einträge" ausgelagert (Klaus' Wahl: Option A — nur Mai),
um die lebende PULS-Datei schlank zu halten. Nichts geht verloren — die Git-Historie behält jede
Fassung. Reihenfolge wie im PULS: neueste oben (31.05. → 26.05.).

---

### 2026-05-31 · Rechts-Seite/Copyright-Empfehlung — über den Briefkasten, nicht als Prompt

**Sitzungs-Rolle:** Andock-Pflege (Sync §11.4). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' berechtigte Korrektur: Aufträge/Empfehlungen an andere Knoten
gehören in den **Briefkasten** (Frage-Antwort-Schicht), nicht als
kopierbarer Prompt — sonst ist der Briefkasten umgangen. Klaus ist
Matcher/Taktgeber (startet Sitzungen), nicht Inhalts-Bote.

- **`sbkim/AUSTAUSCH.md`**: Bau-Meldung + Abgleich-Frage an SB·KIMTool —
  Rechts-Seite/Copyright nach Sage-Vorlage einbauen (jetzt). Inhaber-Daten
  + Forker-Hinweis im Text.
- **`sbkim/AUSTAUSCH-JasonsTresor.md`**: dieselbe Empfehlung an Jasons-
  Tresor, aber mit **⏳-Vorbehalt: erst NACH Fertigstellung der Kern-
  Arbeit** (Klaus' Festlegung).
- **`sbkim/SIGNAL.json`** seq 12, `forNodes` gezielt auf die zwei.

Konvention bestätigt: der Briefkasten transportiert Nachrichten; das
Pushen ist das Signal; die Gegenseite holt es beim nächsten von Klaus
gestarteten Lauf (Empfangsmodus). Server-los weckt niemand niemanden.

### 2026-05-31 · Impressum/Datenschutz/Urheberrecht-Seite + sichtbarer Footer-Link

**Sitzungs-Rolle:** Pflege. Branch `claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' Wunsch: Impressum + Datenschutz + Copyright nach Vorbild
Mein-Rezeptbuch, Sage-angepasst, + sichtbar machen wem es gehört.

- **`impressum.html`** (neu): eigene Rechts-Seite nach dem Mehrsprach-
  Gerüst von Mein-Rezeptbuch (`impressum.html`), aber inhaltlich auf Sage
  angepasst: Impressum (§5 TMG, Klaus Nitzsche), eigener Abschnitt
  **Urheberrecht & Copyright** (mit der ASCII-Box + Klausel „öffentlich
  einsehbar ≠ gemeinfrei" + Forker-Hinweis: Module dürfen übernommen
  werden, aber Urheber-Nennung erhalten), Haftungsausschluss (Software
  statt Rezepte), Datenschutz (server-los, lokal, GitHub-Pages-Hosting,
  CDN-Embedding, Netz-Anfragen an Peer-Knoten). DE + EN sauber
  ausformuliert; Sprach-Gerüst bleibt erweiterbar. Rezeptspezifisches
  (Allergie, KI-Scan, API-Key, PayPal) bewusst entfernt/ersetzt.
- **`index.html`**: dezente `.legal-line` im Footer „© 2026 Klaus
  Nitzsche · Alle Rechte vorbehalten · Impressum, Datenschutz &
  Urheberrecht" → Link auf `impressum.html`. Damit sichtbar wem es
  gehört, ohne die Vorderseite zu überladen. Versteckter HTML-Kommentar-
  Banner bleibt zusätzlich im Kopf.
- inline-JS beider Dateien `node --check` grün. `sbkim/SIGNAL.json` seq 11.

**Ehrliche Einordnung:** Rechtstexte wurden NICHT maschinell in alle 8
Mein-Rezeptbuch-Sprachen übersetzt (juristisch heikel) — DE+EN solide,
weitere Sprachen später. Kein anwaltlich geprüfter Text; Grundgerüst.

### 2026-05-31 · Copyright-Banner für Sage-Protokol

**Sitzungs-Rolle:** Pflege. Branch `claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' Wunsch: Urheberrechts-Banner nach dem Muster von Muttis Rezeptbuch,
angepasst auf Sage-Protokol.

- **`COPYRIGHT`** (neu): ASCII-Box „Sage·Protokol v0.1 © 2026 Klaus
  Nitzsche", E-Mail, DE+EN-Rechtevorbehalt, Repo-URL.
- **`index.html`**: identische Box als HTML-Kommentar direkt nach
  `<!doctype html>` — reist mit der ausgelieferten Seite mit, unsichtbar
  im Quelltext. Box-Breite auf 69 Spalten ausgerichtet (URL-Zeile
  korrigiert). inline-JS `node --check` grün.
- `sbkim/SIGNAL.json` seq 10.

Version v0.1 aus `status.json` `protocolVersion` übernommen.

### 2026-05-31 · Quittungs-Runde geschlossen — Drei-Knoten-Netz beidseitig bezeugt

**Sitzungs-Rolle:** Andock-Pflege (Sync §11.6). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Befund am Briefkasten: **beide Forker haben ihr `SIGNAL.json` bereits
angelegt** (SB·KIMTool seq 1, Jasons-Tresor seq 1, beide HTTP 200) und
Sage quittiert (`ack: Sage-Protokol: 7`). SB·KIMTool hat Jasons zusätzlich
direkt reziprok verifiziert (verified-spore).

**Sage-Quittung nachgezogen** (war noch `null/null`): `sbkim/SIGNAL.json`
`ack` = SB·KIMTool 1 / Jasons 1, seq → 9. Lese-Quittungen in beide
Postfächer (`AUSTAUSCH.md` + `AUSTAUSCH-JasonsTresor.md`). `NETZ-STAND.md`
um Signal-Status aller drei ergänzt.

Damit ist die Quittungs-Runde **beidseitig geschlossen** — jeder Knoten
hat jeden gelesen + bestätigt. Einziger offener inhaltlicher Punkt:
Jasons-Tresor → `verified-match` (echter `domainVector`).

**Antwort auf Klaus' Frage:** Briefkasten ist Hol-Schuld, keine
Bring-Schuld — der 📬-Knopf zieht jeweils FÜR den klickenden Knoten;
die anderen sehen Sages Bauten erst, wenn ihr eigener Knopf/Action läuft.

### 2026-05-31 · Netz-Wächter & Briefkasten in die Werkzeugkiste (Vorteilspack-Truhe)

**Sitzungs-Rolle:** Pflege (Vorteilspack-Truhe). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' Wunsch: das Briefkasten/Netz-Wächter-Werkzeug auch in die
Werkzeugkiste (Vorteilspack-Truhe), damit Forker es kopieren können.

- **`docs/observatorium/vorteilspack.js`**: neues Werkzeug `id:"NETZ"`
  „Netz-Wächter & Briefkasten" (tier basic, status fertig) als 20. Tool +
  eigenes Briefkasten-Symbol `SYM.NETZ`. `code:".github/sbkim-watch.mjs"`,
  `karte:".github/SBKIM-WATCH-FUER-FORKER.md"`. Beschreibt SIGNAL.json
  (§11.6) + Action + 📬-Knopf, server-los.
- Validiert: node --check grün, Modul in Node geladen — TOOLS=20,
  genau 1 NETZ-Eintrag, alle 11 Pflichtfelder, Symbol da, referenzierte
  Dateien existieren, `.nojekyll` vorhanden (Pages serviert `.github/`).
- `sbkim/SIGNAL.json` seq 8.

**Lehre erneut bestätigt:** Lese-Ausgabe der Umgebung war zwischendurch
verstümmelt (zeigte eine Phantom-„Platzhalter"-Einfügung) — per
`git status` + `node --check` + Modul-Load gegen den wahren Dateizustand
geprüft, statt der Ausgabe zu glauben. Sichttest am Browser steht aus.

### 2026-05-31 · Fix: Netz-Briefkasten-Knopf war unsichtbar (nur CSS gelandet)

**Sitzungs-Rolle:** Pflege/Fix (Sage-Page). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

**Befund (Klaus, DeX):** der 📬-Briefkasten-Knopf war nicht zu sehen.
Ursache war NICHT Cache, sondern: in PR #239 sind zwei HTML-Edits
fehlgeschlagen (Lampen-Markup + `</body>`-Anker wichen vom erwarteten
Text ab), gemerkt wurde es nicht — gelandet war nur das `.netz-check-btn`-
**CSS**, ohne den `<button>` selbst und ohne Popup+Script.

**Fix:** Button-HTML neben den Lampen (echter Anker: nach `lamp-fremd` +
`lamp-label fremd`) + Popup-`div` + Browser-Check-Script vor `</body>`
(echter Anker: nach `vorteilspack.js`) korrekt eingefügt. Verifiziert:
Button-HTML 1×, Popup 1×, Handler 1×, alle 4 inline-JS `node --check` grün,
body-Balance ok. `sbkim/SIGNAL.json` seq 6.

**Lehre:** Edit-Fehlschläge an großem Live-File ernster nehmen — nach
HTML-Edits IMMER auf `origin/main` gegenprüfen, dass das sichtbare Element
wirklich da ist, nicht nur ein Teil. Sichttest am Browser steht aus.

### 2026-05-31 · Netz-Briefkasten-Knopf (📬) + Cron-Takt-Optionen

**Sitzungs-Rolle:** Pflege (Sage-Page + Automatisierung). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' Festlegung: Cron 6 h wenn inaktiv, 15 Min wenn aktiv, + ein
„Run"-Knopf oben neben den Lampen (in allen drei Pages).

- **`index.html`**: Knopf **📬 Briefkasten** in der Topbar neben den
  Lampen. Prüft **live im Browser** (kein Token, keine Action): holt die
  `SIGNAL.json` der Peer-Knoten von `raw.githubusercontent.com` (CORS ok),
  vergleicht `seq` gegen Sages eigenen `ack`, zeigt Popup („🔔 Neues" /
  „✓ ruhig" + Briefkasten-Link). Isolierter Script-Block, alle 4 inline-JS
  einzeln `node --check` grün.
- **`.github/workflows/sbkim-watch.yml`**: Cron 6 h Standard + `*/15`-Zeile
  auskommentiert daneben (ein Handgriff für Aktiv-Phasen) + `workflow_dispatch`
  bleibt (Actions-Tab „Run workflow").
- **`.github/SBKIM-WATCH-FUER-FORKER.md`**: Knopf-Snippet + PEERS-Block für
  SB·KIMTool + Jasons (jeder Knopf schaut auf die anderen zwei).
- `sbkim/SIGNAL.json` seq 5.

**Klärung an Klaus:** während wir live arbeiten, braucht es keinen Cron —
ich prüfe auf Zuruf sofort; der Seiten-Knopf macht dasselbe instant im
Browser. Cron/Action sind nur für „niemand da". Echten Push gibt es
server-los weiter nicht.

### 2026-05-31 · GitHub-Action „SBKIM Netz-Wächter" (automatisches Briefkasten-Schauen)

**Sitzungs-Rolle:** Pflege (Automatisierung). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' Wunsch: automatisches Nachschauen ohne dass er da ist — alle drei
Knoten schauen zeitgesteuert in die Briefkästen, Rückmeldung nur bei Neuem.

- **`.github/sbkim-watch.mjs`** + **`.github/workflows/sbkim-watch.yml`**:
  zeitgesteuert (cron alle 6 h) + manuell. Liest die `SIGNAL.json` der
  Peer-Knoten aus deren `raw/main`, vergleicht `seq` gegen eigenen `ack`,
  öffnet **nur bei Neuem** ein Issue (Label `sbkim-watch`, wiederverwendet
  statt zuzuspammen). „Nichts Neues" → keine Rückmeldung. Server-los-
  konform (nur lesende raw-Anfragen, kein Schreiben ins fremde Repo).
  Lokal getestet: Negativ-Pfad (kein SIGNAL bei Peers → still + Notiz) und
  Positiv-Pfad (seq>ack → Alarm) beide grün; `node --check` grün.
- **`.github/SBKIM-WATCH-FUER-FORKER.md`**: kopierfertige CONFIG-Blöcke für
  SB·KIMTool + Jasons-Tresor (jeder schaut auf die anderen zwei → alle drei
  gleichzeitig abgedeckt). Workflow-YAML repo-neutral, 1:1 übernehmbar.
- `sbkim/SIGNAL.json` seq 4.

**Grenze (ehrlich):** echten Push gibt es weiter nicht — die Action ist der
zeitgesteuerte Ersatz. Sage kann die Action nur ins eigene Repo legen; die
zwei Forker-Repos müssen die kopierbare Variante selbst einlegen (Schreib-
zugriff begrenzt).

### 2026-05-31 · Briefkasten-Pflege-Regel netzweit (INTERFACES §11.6 + SIGNAL.json)

**Sitzungs-Rolle:** Pflege (heilige Tafel + Konvention). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' Auftrag: aus der Hand-Meldung eine **dauerhafte, sitzungsübergreifende
Regel für ALLE angeschlossenen Knoten** machen — Briefkasten regelmäßig
pflegen, und ein server-loses Signal „ich habe etwas gebaut / ich muss lesen".

- **INTERFACES §11.6** (netzweite Tafel): `sbkim/SIGNAL.json` je Knoten
  (maschinenlesbarer Aushang, monotone `seq`, `ack`-Symmetrie).
  Sitzungsstart-Pflicht: Gegenstellen-Signale aus `raw/main` lesen, bei
  `seq > ack` lesen+quittieren. Sitzungsende-Pflicht nach Bau: `seq`+1 +
  Bau-Protokoll-Zeile + pushen (= das Signal; kein Daemon, Empfangsmodus).
  Ehrliche Grenze dokumentiert: echten Push gibt es server-los nicht — das
  Pushen + Pflicht-Leseritual ersetzt ihn.
- **`sbkim/SIGNAL.json`** angelegt (Sage geht voran, seq 3, forNodes "*").
- **CLAUDE.md** § „Briefkasten pflegen — sitzungsübergreifend, fürs ganze
  Netz" als Sitzungsstart-/-ende-Pflicht-Block ergänzt.
- **`sbkim/NETZ-STAND.md`** referenziert die Regel.

**Offen:** Forker-Knoten (SB·KIMTool, Jasons-Tresor) legen ihr eigenes
`SIGNAL.json` beim nächsten Andock an + setzen `ack` für Sage.

### 2026-05-31 · Netz-Stand-Tresor + Bau-Meldung an SB·KIMTool

**Sitzungs-Rolle:** Andock-Pflege (Inter-Knoten). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' Wunsch: das Netz zusammenführen — eine findbare Info-Truhe + den
Brief in SB·KIMTools Briefkasten.

- **`sbkim/NETZ-STAND.md`** (neu): lebende Gesamtübersicht des SBKIM-Netzes
  — alle fünf Knoten mit nodeId + Stufe + Beweis-Datei, bezeugte
  Cross-Knoten-Matches (Mixarium⟷Rezeptbuch 0.9544, Sage⟷SB·KIMTool
  0.848508), Postfächer, Werkzeuge, offene Hebel. Der „Tresor mit der
  wichtigen Information".
- **Bau-Meldung an SB·KIMTool** (`sbkim/AUSTAUSCH.md`, Sync §11.4): dritter
  Knoten Jasons-Tresor angedockt (`verified-spore`) + Abgleich-Frage, ob A
  ihn ebenfalls reziprok verifizieren/führen will (Drei-Knoten-Netz
  beidseitig bezeugt).

**Offen:** A's Antwort auf die Abgleich-Frage; Jasons → `verified-match`
nach echtem `domainVector`.

### 2026-05-31 · Jasons-Tresor Sync-Quittung (Spore live, Identität unverändert)

**Sitzungs-Rolle:** Andock-Sitzung (Inter-Knoten, Sage-Seite). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Jasons-Tresor (Knoten C) hat einen Sync-Brief geschickt: Identität
**unverändert** (nodeId `7F_zNop…`), Spore jetzt **live** (PR #3, ihr main
`ba1f2d0`), Postfächer aktualisiert, Bitte um Quittung.

- **Gegengeprüft:** Live-`raw/main`-Spore neu geholt, **byte-identisch**
  zur bereits registrierten `sbkim/jason_inbox.json` (`diff` = identisch),
  ✔ VALID. Kein Re-Verify nötig — Erst-Registrierung (PR #234) gilt
  unverändert.
- **Quittung geleistet:** neues Postfach `sbkim/AUSTAUSCH-JasonsTresor.md`
  (Status-Kopf + Verifikations-Quittung + Protokoll). `jason_inbox.verify.md`
  um Nachtrag ergänzt. `status.json` unverändert (Jasons schon
  `verified-spore`, `sporeUrl` zeigt korrekt auf Live-Pages-URL).

**Offen:** `verified-match` nach echtem `domainVector` (Re-Sign oder Sage
rechnet via `tools/embed_helper.html`).

### 2026-05-31 · Dritter Forker-Knoten: Jasons-Tresor als verified-spore registriert

**Sitzungs-Rolle:** Andock-Sitzung (Inter-Knoten, Sage-Seite). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Jasons-Tresor (Knoten C, externes Repo `lausiklauskn-png/Jasons-Tresor`)
hat eine **dauerhaft gesicherte** Spore live gestellt und um Registrierung
als `verified-spore` gebeten (ehrlich kein Match, da `domainVector` noch
`_demo`).

**Reziprok verifiziert** (Sages echter Modul-02-Pfad, über raw/main):
- ✔ VALID: Signatur gültig, **id == base64url(SHA256(rawPub)) unabhängig
  nachgerechnet = gemeldete nodeId `7F_zNop…`**, `publicKey.x` = gemeldet,
  9/9 Pflichtfelder, Manipulationsprobe fällt durch.
- `domainVector` = `_demo` → bewusst **nur `verified-spore`**, kein Match
  (INTERFACES §11.5).

**Nachgezogen:**
- `status.json`: fünfter `endknoten`-Eintrag **Jasons-Tresor**
  (`verified-spore`, `domain: Jasons-Tresor-Bibliothek`, nodeId,
  landingPage). `lastUpdated 2026-05-31`. Damit drei verifizierte
  Forker-Knoten (Sage + SB·KIMTool `verified-match` + Jasons-Tresor
  `verified-spore`) neben den zwei Live-Endknoten.
- Inbox-Konvention (INTERFACES §11.3): `sbkim/jason_inbox.json`
  (signatur-reine 1:1-Kopie) + `sbkim/jason_inbox.verify.md` (Prüf-Vermerk
  inkl. Manipulationsprobe).

**Pages-Befund:** `…github.io/Jasons-Tresor/sbkim/spore.json` im Browser
live, von Sages Container aus 403 (eigene github.io-Egress-Sperre) —
verifiziert über raw/main.

**Offen:** Hochstufung auf `verified-match`, sobald Jasons-Tresor einen
echten `domainVector` (`multilingual-e5-small`, `passage: `-Präfix)
re-signt — oder Sage ihn via `tools/embed_helper.html` rechnet. Dann
Cross-Knoten-Match Sage ⟷ Jasons-Tresor nachrechnen + Score eintragen.

### 2026-05-31 · Sage-Page: Topology-Overlap-Fix + Stationen-Karte (Brücken-Vision)

**Sitzungs-Rolle:** Pflege-Sitzung (Sage-Page-Render + Vision-Karte).
Branch `claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus' Sichttest am DeX-Doppelbildschirm (externer Monitor + Tablet,
2026-05-31): zuerst geprüft, dass alle Andock-Spuren erhalten sind und
der Match noch lebt (Sage ⟷ SB·KIMTool frisch nachgerechnet = 0.848508
✔). Dann zwei Befunde umgesetzt:

1. **Topology-Overlap-Bug behoben.** In der Modul-Topologie lagen die
   Backlog-Knoten 14 (Diffusion) / 15 (Membran) — und künftig 18/19 —
   alle auf col 3 / backlogY und überlappten als Schrift („D#ffi…sion /
   Membran", Pille über „Schablone 4"). `TOPO_LAYOUT` +
   `TOPO_LAYOUT_PORTRAIT` hatten Mehrfach-Belegung derselben Zelle +
   duplizierte Keys. Fix: Backlog-Knoten werden jetzt gleichmäßig über
   die Breite verteilt (Landscape) bzw. 3-pro-Zeile mit Umbruch
   (Portrait) — kollisionsfrei, skaliert mit beliebiger Anzahl.
   `node --check` grün. (Commit a93f1f9)
2. **Neue „Stationen"-Karte** (span-12): demonstrative Darstellung der
   Brücken-Vision aus dem realen Stand — zwei Knoten (Sage + SB·KIMTool),
   Datei-Dead-Drop-Brücke, echter Match 0.85 via Synchronisations-
   Vereinbarung (INTERFACES §11); Ziel-Trias „finden ohne zu suchen"
   (Mensch findet Mensch / Mensch↔KI-Agent / Agent findet Agent;
   PWA↔PWA, Seite↔Seite, Programm↔Programm). Lebenszyklus-Karte mit
   Demo-Notiz auf zweiten lebendigen Knoten gebracht (statt riskantem
   SVG-Umbau). Reines HTML + bestehende CSS-Variablen, kein neues JS.

**Umgebungs-Befund (ehrlich):** Die Remote-Umgebung hat ihren Read-/
stdout-Kanal über weite Strecken verstümmelt (Truncation, Ellipsen).
Deshalb nur kleine, an eindeutigen Ankern gesetzte additive Edits,
jeweils per `node --check` + article-Balance verifiziert — KEIN
riskanter Umbau der animierten Lebenszyklus-SVG. Klaus' Browser-
Sichttest der neuen Karte + des Topology-Fixes steht aus.


### 2026-05-31 · Sage-Page: SB·KIMTool als verified-match + Andock-Lehren

**Sitzungs-Rolle:** Pflege-Sitzung (Sage-Page-Render-Logik + Doku). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Die heute erzielten Andock-Erfolge auf der Sage-Page sichtbar gemacht
(data-driven aus `status.json`) + Lehren dokumentiert:

- **`index.html` Render-Logik** (zwei kleine, node-check-grüne Edits):
  `renderEndknoten` kennt jetzt `verified-match` („Lebendig · echter Match
  0.85") und `verified-spore` („Lebendig · Identität verifiziert"); der
  Real-Anteil-Zähler wertet `verified-match`/`verified-spore`/`live-channel`
  als lebendig. Folge: SB·KIMTool·Point rendert in der Endknoten-Karte als
  vierter **lebendiger** Knoten mit Score 0.85.
- **`status.json`** SB·KIMTool-Eintrag um `landingPage` ergänzt (eigene
  github.io-Landing-Page als zusätzlicher Verbindungs-Punkt — Werkzeug-
  Knoten, kein PWA-Endknoten).
- **`docs/sessions/LEHREN_ANDOCK_BROWSER_KOMPLEXITAET.md`** — Lehren für
  Tool-Nachbau + besseren Handshake/Matching für Mein-Rezeptbuch +
  Mein-Mixarium trotz Browser-Komplexität (headless-Embedding-403 →
  Browser-Weg, byte-identische kanonische Form, SW-Phantom-Cache-Workaround,
  BroadcastChannel statt Clipboard, Identitäts-Sicherung, gestufte
  Andock-Stufen, Inbox-Konvention + MR/MM-Re-Migrations-To-dos).

**Umgebungs-Befund (ehrlich):** Die Remote-Umgebung hat ihren stdout-/
Read-Kanal über weite Strecken der Sitzung verstümmelt. Deshalb wurden
bewusst NUR verifizierbare Änderungen vorgenommen (JSON validiert,
inline-JS `node --check` grün). Der **visuelle Text-Überlappungs-Bug aus
Klaus' Screenshot** (Backlog-Badges „14 Diffusion"/„15 Membran"
überlappen) konnte NICHT sicher lokalisiert werden (weder Topology-
`paintNode` noch `.lamp`-CSS sind die Quelle) und bleibt offen für eine
Folge-Sitzung mit stabiler Umgebung — KEIN Blind-Edit am 271-KB-Live-File.


**Format:** Der jüngste Eintrag steht ausführlich oben. Alle älteren
Sitzungen sind in `docs/sessions/archiv/` abgelegt — der Index
darunter verlinkt jedes Übergabeprotokoll. Neue Sitzungen tragen
sich oben mit vollem Text ein und verschieben den dann jeweils
vorletzten in den Archiv-Index. Ziel: PULS.md bleibt unter 3000
Zeilen (Schutz-Klausel oben, 2026-05-17 — NICHT herabsetzen).

### 2026-05-30 · Spec-Sitzung „Andock-Konventionen" — INTERFACES §11 (netzweit)

**Sitzungs-Rolle:** Spec-Sitzung (heilige Tafel). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

SB·KIMTool hat ihren eingefrorenen Rückbrief A–E geliefert (Postfach
§10). Daraus ist **INTERFACES §11 „Andock-Konventionen"** entstanden —
netzweit gültig, nicht mehr nur bilateral:

- **§11.1** Kanonische Signier-Form (Norm + Pseudocode + Determinismus-
  Klausel; byte-deckungsgleich Modul 02 ↔ A's `verify_foreign_spore.mjs`).
- **§11.2** Verifizierer-Paar (WebCrypto/Modul 02 + `tools/verify_remote_spore.mjs`
  ↔ A's `node:crypto`), 4 Pflicht-Prüfpunkte.
- **§11.3** Inbox-Konvention (`<gegenseite>_inbox.json` signatur-rein +
  `.verify.md` Pflichtfelder, Namens-Symmetrie).
- **§11.4** Sync-Vertrag (7 Regeln; Regel 7 für N>2 verallgemeinert;
  `status.json`-Pflichtfelder; `matchScore` Pflicht bei `verified-match`;
  `pingStatus`-Stufen).
- **§11.5** 9 Pflicht-Spore-Felder + **Sage-Entscheidung: gestufter
  `domainVector` angenommen** (optional `verified-spore`, Pflicht
  `verified-match`; `_demo` bis echtes Embedding).

§10-Changelog-Zeile ergänzt. Postfach: Abgleich-Antwort A–E (5× Ja) +
Bau-Protokoll-Zeile + Status-Kopf gestempelt. KEIN PROTOCOL_VERSION-Bump
(Konventions-Tafel, die Form ist bereits gelebt — kein Schema-Bruch).

**Offen:** A's Lese-Quittung zu §11 (Sync §6.2). Danach gilt die Tafel
für jeden künftigen Forker/Knoten als Andock-Vorlage.

### 2026-05-30 · Match bestätigt + neue Identität — SB·KIMTool `verified-match` 0.848508

**Sitzungs-Rolle:** Andock-Sitzung #4 (Inter-Knoten-Austausch). Branch
`claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

SB·KIMTool hat re-signt + einen Update-Brief geschickt. Zwei Änderungen,
beide reziprok geprüft und nachgezogen:

1. **Neue, dauerhaft gesicherte Identität.** Alte nodeId `eC3jzoo9…` war
   ungesichert/verloren → neue **`CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY`**.
   Neue Spore mit echtem Modul-02-Pfad verifiziert: Signatur ✔, id unabhängig
   nachgerechnet ✔ MATCH, `_demo` entfernt, Manipulationsprobe fällt durch.
2. **Echter Match bestätigt.** Cosine gegen die **publizierte** Spore =
   **0.848508 ≥ 0.80** (identisch zu ihrem `test/match.test.js`).

**Nachgezogen:** `status.json` — neue nodeId, `previousNodeIds:["eC3jzoo9…"]`,
`pingStatus: "verified-match"`, `matchScore: 0.848508`, Kategorien
(stamm/gast) übernommen. Inbox `sbkim/point_inbox.json` +
`point_inbox.verify.md` aktualisiert. Postfach: Verifikations-Quittung +
Status-Kopf + Protokoll-Zeilen.

**Pages-Befund (geklärt):** `…github.io/SB-KIMTool-Point/sbkim/spore.json`
liefert von **unserem** Container aus weiterhin 403 — das ist **unsere
eigene Egress-Sperre für `github.io`** (blockt auch huggingface/jsdelivr,
daher lief das Embedding nur in Klaus' Browser), KEIN Problem ihrer
Pages-Seite. `sporeUrl` bleibt auf `raw/main` (HTTP 200, gleiche signierte
Bytes).

**Offen (nicht-blockierend):** Spec-Sitzung „Andock-Konventionen"
(INTERFACES: Verifizierer-Paar / Inbox-Konvention / Sync-Vertrag).
Der bilaterale Andock Sage ⟷ SB·KIMTool ist damit **vollständig**:
Identität beidseitig signatur-verifiziert + echter semantischer Match.

### 2026-05-30 · Erster echter Cross-Knoten-Match — Sage ⟷ SB·KIMTool 0.8485 ✔

**Sitzungs-Rolle:** Andock-Sitzung #3 (Inter-Knoten-Austausch), Folge zu
#2. Branch `claude/sbkim-point-docking-exchange-eAyD2`. KEIN Modul-Code.

Klaus hat den echten `domainVector` für SB·KIMTool im Browser erzeugt
(`tools/embed_helper.html`, byte-gleich Modul 03: `multilingual-e5-small`,
`passage: `-Präfix, mean/normalize). Geprüft: 384 Floats, L2-Norm
1.00000002. **Echter Cross-Knoten-Match-Score gegen Sages echten
`domainVector` (cosine): 0.8485 — ÜBER der 0.80-Schwelle.** Erster
echter semantischer Match im Netz (nicht Identität allein, sondern
Inhalt).

Geliefert für SB·KIMTool: `sbkim/fuer-SB-KIMTool-Point/domainVector.real.json`
(fertiger Vektor) + `.README.md` (Reproduktion + Match-Beweis + Re-Sign-
Anleitung). Postfach-Nachtrag + Status-Kopf aktualisiert.

**Offen:** SB·KIMTool muss re-signen (nur sie halten `SBKIM_NODE_KEY`):
Vektor rein, `_demo` raus, neu signieren, republish. Danach reziprok
verifizieren + `pingStatus` `verified-spore` → echter Match-Stand
(Vorschlag `verified-match`, Score 0.8485). Plus weiter offen:
Spec-Sitzung „Andock-Konventionen" (INTERFACES); ihr Pages-Endpoint 403.

### 2026-05-30 · Andock-Folge SB·KIMTool·Point — Brief beantwortet, Sync-Vertrag, Embedding-Helfer

**Sitzungs-Rolle:** Andock-Sitzung #2 (Inter-Knoten-Austausch). Branch
`claude/sbkim-point-docking-exchange-eAyD2` (Folge-PR). KEIN Modul-Code.

**Auslöser:** SB·KIMTool·Point hat einen strukturierten Brief geschickt
(reziproke Verifikation Sages Spore ✔ VALID; Bitte um echten
`domainVector`; Vorschlag Synchronisations-Vertrag §4; drei Abgleich-
Fragen §5). Klaus trug ihn ins Postfach.

**Getan (alles in `sbkim/AUSTAUSCH.md` beantwortet + Artefakte):**

- **Reziproke Inbox** (ihre Konvention übernommen): `sbkim/point_inbox.json`
  (signatur-reine Kopie ihrer Spore) + `sbkim/point_inbox.verify.md`
  (Prüf-Vermerk ✔ VALID + Manipulationsprobe `Signatur ungültig`). Andock
  jetzt **beidseitig** bestätigt.
- **Echter `domainVector` — ehrliche Lage:** huggingface.co **und**
  jsdelivr sind **auch bei uns headless 403** (gleiche Wand wie bei
  SB·KIMTool). Headless-Embedding fällt beidseits aus. Liefere stattdessen
  `tools/embed_helper.html` — Browser-Werkzeug, **byte-gleich Modul 03**
  (`@xenova/transformers@2.17.2`, `Xenova/multilingual-e5-small`,
  `pooling:"mean"`, `normalize:true`, Präfix `passage: `). Klaus erzeugt
  den Vektor im Browser, wir tragen ein. Rezeptur dokumentiert.
- **Sync-Vertrag** (ihre §4, sieben Regeln): **bilateral angenommen** +
  ins Postfach gespiegelt. §5: dreimal **Ja** (headless-Verifizierer-Paar,
  Inbox-Konvention, Sync-Vertrag).

**Anpassungs-Antrag an Klaus (Tafel-Evolutions-Klausel):** Die drei
angenommenen Konventionen netzweit verbindlich zu machen, berührt die
heilige Tafel `docs/INTERFACES.md`. Vorschlag: eigene **Sage-Spec-Sitzung
„Andock-Konventionen"** (Verifizierer-Paar WebCrypto+node:crypto /
Inbox-Konvention `*_inbox.json`+`*.verify.md` / Sync-Vertrag §4). Bis
dahin gelten alle drei **bilateral** Sage⇄SB·KIMTool. Nicht stillschweigend
in INTERFACES gezogen.

**Offen / nächste Schritte:** (1) Klaus erzeugt echten Vektor via
`tools/embed_helper.html`, SB·KIMTool re-signt → echter Match, `pingStatus`
hochstufen. (2) Spec-Sitzung „Andock-Konventionen" (INTERFACES). (3) ihr
Pages-Endpoint (403).

### 2026-05-30 · Andock-Austausch SB·KIMTool·Point — Postfach + Brücke + Werkzeuge

**Sitzungs-Rolle:** Andock-Sitzung (Inter-Knoten-Austausch). Branch
`claude/sbkim-point-docking-exchange-eAyD2`, PR #224 (Draft). KEIN
Modul-Code geändert — nur additive Andock-Werkzeuge + Postfach.
Übergabeprotokoll: [→ Archiv](sessions/archiv/2026-05-30_andock-austausch-sb-kimtool-point.md).

**Auslöser:** SB·KIMTool·Point (externes Repo
`lausiklauskn-png/SB-KIMTool-Point`) hat ein Andock-Postfach
`sbkim/AUSTAUSCH.md` + Vertrag `docs/ANDOCK.md` angelegt und 5 Fragen
gestellt. Klaus' Auftrag: antworten + Austausch starten, dann freie
Hand für das Ziel „direkte Repo-zu-Repo-Kommunikation über SBKIM".

**Getan:**

- Spiegel-Postfach `sbkim/AUSTAUSCH.md` angelegt: Status-Kopf-Zeile B
  (Prüf-Rhythmus = pro Andock-Sitzung, Empfangsmodus; „zuletzt gelesen
  2026-05-30"), alle 5 Fragen direkt beantwortet, ehrliche
  Now/Not-now-Trennung.
- **Befund Modul 02:** Die Karten-/Tabellen-Zeile trägt „Code-Stub",
  aber `SbkimSpore.verifyForeignSpore` ist **voll implementiert und
  live-erprobt** (Cross-Knoten-Handshake 2026-05-16). Doku-Rückstand,
  kein Code-Stand — Kandidat für eine eigene Pflege-Sitzung
  (status.json + Karte 02 nachziehen).
- **Konkreter Blocker an SB·KIMTool gemeldet:** ihr ANDOCK-§2-Schema
  lässt zwei unserer `REQUIRED_SPORE_FIELDS` aus — `createdAt` +
  `embeddingModel`. Bewiesen: deren Schema wörtlich → INVALID
  (`Pflichtfeld fehlt: createdAt`).
- **Andock-Werkzeuge gebaut** (`tools/`, fahren den ECHTEN Modul-02-
  Verifizierer headless über Node v22, keine Drift):
  `verify_remote_spore.mjs` (prüft Spore per URL/Datei),
  `make_example_spore.mjs` (+ Referenz `sbkim/example_sbkimtool_spore.json`),
  `tools/README.md`. Beweis: eigene Spore ✔ 9/9, Referenz ✔ 9/9.
- **Kopierbarer Spore-Generator für SB·KIMTool**:
  `sbkim/fuer-SB-KIMTool-Point/generate_spore.mjs` — nach deren ANDOCK
  §2–§5, ergänzt um die zwei Pflichtfelder, mit `SBKIM_NODE_KEY`-Handling
  (ANDOCK §3) und flüchtigem Test-Fallback. Getestet: persistenter
  Schlüssel → nodeId stabil über Läufe → ✔ VALID; flüchtig → ✔ VALID
  (klar als Test markiert).
- **Brücke statt Zwang (Klaus' Leitlinie):** die Krypto-Schicht hängt
  an SB·KIMTools noch unveröffentlichter Spore — NICHT erzwungen.
  Stattdessen die im Protokoll vorgesehene Datei-Dead-Drop-Brücke
  verifiziert: bidirektional lebend (wir lesen ihr Repo HTTP 200; sie
  lesen unseres über die Branch-Raw-URL HTTP 200; `main` erst nach
  Merge).

**Nachtrag 2026-05-30 (selbe Sitzung):** SB·KIMTool hat ihre Spore
veröffentlicht. **Verifiziert ✔ VALID** (Signatur gültig, `id ==
base64url(SHA256(rawPub))` unabhängig nachgerechnet, 9/9 Pflichtfelder,
`domainVector` `_demo`). `nodeId: eC3jzoo9…i0zdw`. Als **vierter
Endknoten** in `status.json` registriert (`pingStatus:
"verified-spore"`, `sporeUrl` = raw main, da Pages noch 403). Postbox-
Quittung + Frage-1/4-Antwort in `sbkim/AUSTAUSCH.md`.

**Offen / nächste Schritte:** PR #224 nach `main` mergen (stabile URL) —
Klaus' Zuruf. Zwei nicht-blockierende Hinweise an SB·KIMTool: Pages-
Endpoint liefert noch 403 (Pages aktivieren); `stamm/guestCategories`
fehlen in ihrer Spore. Echter Match braucht echten `domainVector`
(Live-Modul 03) beidseits — `verified-spore` ist erst Identitäts-Andock,
kein semantischer Handshake.

### 2026-05-29 · Pflege Truhe — Eingang in die Truhe (zweite Seite / Werkzeug-Screen)

**Sitzungs-Rolle:** Pflege-Sitzung (Sage-Page-Render, KEIN Modul-Code).
Branch `claude/pflege-truhe-eingang`. Klaus-Wunsch 2026-05-29.

**Was getan:**

1. **Klick auf die Truhe = Eingang in die Truhe:** öffnet jetzt eine
   eigene zweite Seite `#screen-vorteilspack` via `goScreen('vorteilspack')`
   — genau wie die Einladungs-Tür zur Einladung und das Schwarze Loch
   zum Observatorium führt. Vorher klappte das Grid inline darunter auf.
2. **Werkzeug-Inhalt im Screen:** Tool-Grid (19 Tiles) + Tier-Pillen +
   Bild-Hero (`.vp-screen-hero`, das gesendete PNG) leben jetzt im
   Screen. Die Übersichts-Karte ist nur noch der Eingang (Bild +
   Caption + Feenstaub/Nähe-Licht-FX + Klick-Flash).
3. `'vorteilspack'` in die `SCREENS`-Liste aufgenommen; Truhe-Klick mit
   kurzem Flash-Delay vor der Navigation (reduced-motion: sofort).

**Tests:** `node --check` grün, Smoke 19/19 grün, HTML parst, IDs
eindeutig. **Offen:** Klaus' Browser-Sichttest.

**Nächster Schritt:** Klaus' Hard-Reload-Sichttest (Klick → zweite Seite).

### 2026-05-29 · Pflege Truhe — Tür-FX + Karten-Reihenfolge

**Sitzungs-Rolle:** Pflege-Sitzung (Sage-Page-Render, KEIN Modul-Code).
Branch `claude/pflege-truhe-tuer-fx`. Klaus-Wunsch 2026-05-29.

**Was getan:**

1. **Truhe wie die Einladungs-Tür gestaltet:** Bild als Hintergrund-
   Layer `.vp-truhe-img` (analog `.einladung-door`); **Feenstaub-
   Canvas** `.vp-dust`, der der Maus folgt (teal-gold Partikel);
   **Nähe-Licht** — der Goldlicht-Glow wird heller, je näher die Maus
   am geöffneten Deckel ist (kontinuierlich per `pointermove`-
   Distanz); **Klick-Flash** beim Öffnen. Logik in
   `docs/observatorium/vorteilspack.js`, CSS in `index.html`.
2. **Karten-Reihenfolge:** Schwarz-Loch-Karte (Browser-Observatorium)
   ans Ende verschoben, Truhe-Karte davor.
3. Klick öffnet weiterhin das Tool-Grid darunter.

**Tests:** `node --check` grün, Smoke 19/19 grün, HTML parst.
**Offen:** Klaus' Browser-Sichttest (Feenstaub + Nähe-Licht + Öffnen
nicht headless prüfbar).

**Nächster Schritt:** Klaus' Hard-Reload-Sichttest auf der Sage-Page.

### 2026-05-29 · Bau Observatoriums-Vorteilspack — Truhe-Karte komplett (Symbole + Bild + Grid + Modal)

**Sitzungs-Rolle:** Bau-Sitzung Observatoriums-Vorteilspack-Truhe.
Branch `claude/bau-observatoriums-vorteilspack`. Basiert auf
Brief `BRIEF_BAU_OBSERVATORIUMS_VORTEILSPACK.md` + Klaus'
Vision-Erweiterung 2026-05-29 (zwei additive Punkte: Truhe als
gerendertes Bild-Asset, Werkzeug-Symbol pro Modul).

**Was getan:**

1. **19 selbst-gezeichnete Werkzeug-Symbole** in
   `assets/tool-symbols/NN_modul.svg` — gegenständlich (Lupe auf
   Buch, Bronze-Kapsel, Sextant, Apotheker-Waage, Doppelschlüssel,
   Sanduhr mit Blättern, Marionettenkreuz, Mycel-Schraubenschlüssel,
   Verdienst-Orden, Wasserschleuse, Eisen-Riegel, Sonar-Wellen,
   Wappenschild, Lack-Siegel, Kristallkugel, Multitool, Zauberstab
   mit Kompass …). Monochrom (`currentColor`, stroke 1.5, keine
   Füllflächen), keine Icon-Library. Alle 19 XML-wohlgeformt.
2. **Vorschau-Kontaktbogen** `assets/tool-symbols/_vorschau.html` —
   zeigt alle 19 Symbole in Tier-Färbung (Gold/Türkis/Violet) für
   Klaus' Optik-Sichttest im Browser.
3. **Truhe-Bild geliefert + eingebunden:** Klaus' Bild
   `assets/observatorium-truhe.png` (1401×1123, ≈5:4). Als
   `<picture>` (webp-bevorzugt, png-Fallback) in die neue Karte
   eingebunden. Kein webp-Werkzeug im Container → PNG, `<picture>`
   nimmt künftige webp automatisch.
4. **Eingriff A — Truhe-Karte in `index.html` gebaut:** neue Karte
   `#observatorium-vorteilspack` nach der Browser-Observatorium-Karte
   (beide Schicht 4). Truhe-Stage (Bild + Veil-Overlay + Glow +
   Schlüssel-Puls), Klick öffnet → Tool-Grid (19 Tiles, Tier-Badge +
   Symbol + Status), Tile-Klick → Modal mit neun Sektionen + Vibe-
   Prompt + Clipboard (Code lazy-fetch, Fallback execCommand). Tier-
   Filter-Pillen. **Tafel-Evolution:** Bild ist bereits offen → Deckel
   als Dim-Veil der sich hebt, kein `rotateX`-Klapp.
5. **JS-Modul** `docs/observatorium/vorteilspack.js` (node-testbar
   exportiert), CSS inline in `index.html`. **Konzept-Karte** voll
   gefüllt (Symbol-Liste, Bild-Asset, Tier-Liste, Bauzustand).

**Tests:** `node --check` JS grün; Smoke
`tests/smoke_observatorium_truhe.mjs` **19/19 grün** (19 Tools,
Tier 3/7/9, 19 Symbole, alle Code-/Karten-/Smoke-Pfade existieren,
Vibe-Prompt-Aufbau). **Klaus' Browser-Sichttest steht aus**
(Animation + Optik nicht headless prüfbar).

**Was offen:**

- Klaus' Sichttest der Truhe-Karte (Sage-Page, Galaxy Tab S6).
- `tests/manual_check.html`-Panel bewusst NICHT ergänzt: die Truhe ist
  eine Sage-Page-Render-Feature (kein Modul), Sichttest läuft direkt
  auf der Sage-Page; das headless-Smoke deckt die Datenbank ab.
- 19 statt „20" Tiles: Modul 13 ist kein Modul (Sammel-Karte).
- Vorbestand: `PULS.md` über 3000-Zeilen-Grenze (eigene Archiv-Pflege).

**Nächster sinnvoller Schritt:** Klaus' Hard-Reload-Sichttest auf der
Sage-Page; bei Symbol-/Optik-Korrekturwünschen Nachzug-Pflege.

### 2026-05-28 · Pflege Brief-Multisuchfeld — Klaus' UI-Festlegungen einarbeiten

**Sitzungs-Rolle:** Pflege-Sitzung (reine Brief-Doku, KEIN Modul-
Code, KEIN Endknoten-Eingriff). Branch
`claude/pflege-brief-suchfeld-multi-ui-festlegungen`.

**Anlass:** Parallel zur Plansitzung in PR #189 lief eine zweite
Plansitzung (PR #191, Branch `claude/multisearch-field-spec-ER2BL`)
mit identischer Aufgabe. Klaus hat das Doppel-Arbeitsmuster (vor
dem er bei der 2026-05-27-Tafel-Pflege gewarnt hatte) bemerkt und
entschieden: **Inhalte aus PR #191 in die #189-Briefe einarbeiten
als separate Pflege-PR**, nicht parallele Brief-Versionen behalten.
PR #191 wurde geschlossen.

**Klaus' Festlegungen aus PR #191 (per `AskUserQuestion`),
einzuarbeiten:**

1. **UI-Modus-Wechsel:** Symbol-Schalter UNTER der Texteingabe IM
   Suchfeld nebeneinander (kein zusätzlicher Höhen-Bedarf),
   Tooltip-Pflicht in Klaus-Sprache (keine Modul-IDs), Klick wechselt
   grau → modus-spezifische Aktiv-Farbe, Multi-Aktiv erlaubt,
   Default Lokal + Mycel aktiv (Web NICHT aktiv).
2. **Treffer-UI:** unified-Liste mit Quellen-Marker (NICHT drei
   separate Sektionen wie im #189-Brief vorgeschlagen).
3. **Lokal-Sprung:** direkter Anchor-Sprung wenn nur Lokal aktiv +
   Score ≥ 0.95 (sonst Liste).
4. **Mycel-Treffer-Pflicht-Darstellung:** Score-Ring (Pepo-Demo-
   Pattern) + Drei-Layer-Bars für `matchDimensions` (fachlich /
   technisch / skalierung) + Gesamt-Score. Im #189-Brief stand das
   als „optional pro Endknoten" — jetzt PFLICHT.
5. **Web-Modus:** mischt Externer Mycel-Hub + Sage-`status.json` +
   externe Web-API in derselben unified-Liste (Drei-Quellen-Mix mit
   Quellen-Marker pro Treffer).

**Was getan:**

- **Neuer „Pflege 2026-05-28"-Block** am Anfang von
  `docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md` (zwischen
  Branch-Vorschlag und Brief-Codeblock) — verankert Klaus' drei
  UI-Festlegungen als Tafel-Charakter mit verbindlicher Lesart für
  die Spec-Sitzung. Inkl. Daten-Schnittstellen-Vorschlag (Modul 15
  Sub b `queryResult.payload.results[].dimensions` optional, Modul
  04.C `withDimensions:true` Opt-In) + Sub-(a)-Vorab-Pflege-Hinweis
  (NICHT nötig, PR #190 hat die Spec abgeschlossen).
- **Brief-Codeblock Abschnitt C** mit „Klaus-Korrektur 2026-05-28"
  ergänzt — die ursprüngliche „Variante D — Drei Sektionen
  gestapelt"-Empfehlung ist als VERWORFEN markiert; die Symbol-
  Schalter-Form als verbindlicher Ersatz benannt. Variante D bleibt
  als Vergleichs-Anker stehen, damit die Spec-Sitzung den Begründungs-
  Kontext kennt.
- **Brief-Codeblock Abschnitt J** komplett überarbeitet — Score-
  Ring + Drei-Layer-Bars sind jetzt PFLICHT für Mycel-Treffer
  (statt offen), unified-Liste statt Sektionen, Lokal-Sprung-
  Verhalten verankert. Treffer-Schema mit vier Quellen-Marker-
  Varianten (→ Geschwister / → Externer Hub / → Sage-Mycel / ⌖
  Web). Daten-Schnittstellen-Erweiterung als Spec-Entscheidung
  ausgewiesen.
- **`BRIEF_SPEC_18_SUB_A_VORAB.md` bewusst unangetastet** — die
  Spec-Sitzung 18 Sub (a) ist über PR #190 abgeschlossen, der Brief
  hat keinen weiteren Spec-Wert. Pflege wäre Doku-Schmuck.

**Was offen blieb:**

- **Folge-Spec-Sitzung Multisuchfeld** (Branch
  `claude/spec-suchfeld-multi`) — Klaus startet sie mit dem
  gepflegten Brief. Sie verarbeitet Klaus' UI-Festlegungen aus dem
  Pflege-Block + entscheidet die offenen Punkte aus dem Brief-
  Codeblock + legt eine Karte (Modul 20 oder Erweiterung Modul 18
  / Modul 04) an. Brief-Codeblock unverändert für Copy-Paste.
- **Tafel-Pflege CLAUDE.md Pipeline 5h.1 / 5i.1 / 5i.2** bleibt
  separate Folge-Sitzung mit Klaus' explizitem OK (steht so
  bereits im #189-Brief § Pipeline-Anpassungs-Antrag).

**Heilige Tafeln eingehalten:**

- KEIN Modul-Code in `src/modules/`.
- KEIN Endknoten-Eingriff.
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- KEINE Tafel-Umsortierung CLAUDE.md (Pipeline-Anpassungs-Antrag
  bleibt im Brief, eigene Folge-Pflege-Sitzung mit Klaus' OK).
- KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Brief-Pflege ist kein
  Sicherheits-Modul-Update).

**Tafel-Beobachtung (Doppel-Arbeit-Lehre):** PR #189 und PR #191
liefen am 2026-05-28 parallel an derselben Aufgabe und produzierten
zwei Brief-Versionen mit denselben Dateinamen. Klaus' Verifikations-
Block (CLAUDE.md § „Vor dem nächsten Sitzungs-Brief") verlangt
PR-Listen-Check; bei Sitzungen, die NICHT aus `Befehl schreiben`
hervorgehen (Plansitzungen via direkte Briefing-Anweisung), ist
dieser Check aktuell nicht explizit gefordert. **Folge-Lehre:**
auch Plansitzungen sollten am Anfang `git fetch origin && git
log --oneline origin/main -10` ausführen, um parallele Sitzungen
zu erkennen. Die hier durchgeführte Verifikation („grep für
Brief-Dateinamen") fand den parallelen Brief nicht, weil PR #189
noch ungemerged war zum Zeitpunkt des Lokal-Branch-Anlegens.

**Nächster sinnvoller Schritt:** Klaus liest den gepflegten Brief
und startet die Spec-Sitzung Multisuchfeld (Branch
`claude/spec-suchfeld-multi`). Pipeline-Sequenz bleibt 5h.1 →
5i.1 → 5i.2 (Sub-(a)-Vorab-Spec fertig in #190, jetzt Sub-(a)-Bau-
Sitzung Vorrang vor Spec-Sitzung Multisuchfeld? — Klaus entscheidet
die Reihenfolge in seiner Antwort).

**Übergabeprotokoll:**
`docs/sessions/archiv/2026-05-28_pflege-brief-suchfeld-multi-ui-festlegungen.md`.

### 2026-05-28 · Brief-Anlage MR + MM Modul-18-Einbau (Mini-Sitzungs-Briefe)

**Sitzungs-Rolle:** Brief-Anlage. Branch
`claude/briefe-mr-mm-modul-18-einbau`. Reine Doku — Klaus hat
nachgefragt, ob die Endknoten-Re-Migration nicht schon passiert
ist. Klärung: 5e-Re-Aktivierung (Modul 15/16/17) ist 2026-05-26 in
MR PR #249 + MM PR #58 durch (siehe
`2026-05-26_endknoten-sichttest-cross-knoten-sub-e.md`), aber
**Modul 18 fehlt in MR + MM**. Klaus' Live-Screenshots 2026-05-28
bestätigen LEBT/VERKEHR/FREMD/SIEGEL-Widget aktiv in beiden
Endknoten — SIEGEL-Klick triggert aktuell den Fallback „Modul 18
noch nicht verfügbar".

**Was getan:**

1. **`docs/sessions/BRIEF_BAU_MR_MODUL_18.md`** angelegt. Kompakter
   Mini-Sitzungs-Brief für `lausiklauskn-png/Mein-Rezeptbuch`:
   drei Eingriffe (Datei kopieren + Skript-Tag + `SbkimToolPwa.init`-
   Aufruf NACH `SbkimSiegel.init`), Pflicht-Disziplin, Sichttest-
   Schritte für Klaus' Tab.
2. **`docs/sessions/BRIEF_BAU_MM_MODUL_18.md`** analog für
   `lausiklauskn-png/Mein-Mixarium`.
3. Beide Briefe explizit abgegrenzt gegen die 5e-Re-Aktivierung:
   „Nicht zu verwechseln mit PR #249/#58 vom 2026-05-26 — die hatten
   Modul 15+16+17; dieser Brief füllt **nur** die Modul-18-Lücke."
4. Klare Konventions-Anker für die Endknoten-Sitzungen: KEIN
   Modul-Code-Eingriff (1:1 Kopie), KEIN `PROTOCOL_VERSION`-Bump,
   KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag, KEIN automatischer Andock-
   Trigger.

**Auslöser-Kontext:** Klaus hat nach dem Sichttest Bau 18 Sub (a)
Vorab + Brief Observatoriums-Vorteilspack nachgefragt, ob die
Re-Migration schon passiert sei (PRs #249/#58 von Mai 2026 noch
erinnert). Klärung: die große 5e-Re-Aktivierung ist durch; jetzt
steht nur noch der **Modul-18-Mini-Einbau** aus (Pipeline 5h.1-Folge).

**Pflicht-Disziplin eingehalten (dieser PR):**

- ✓ KEIN Modul-Code-Eingriff.
- ✓ KEIN Eingriff in `src/modules/`.
- ✓ KEIN externer Repo-Eingriff (GitHub-MCP-Tools nur auf
  Sage-Protokol — die Mini-Sitzungen pro Endknoten startet Klaus
  in der jeweiligen externen Repo-Sitzung mit dem Brief als Prompt).
- ✓ KEIN `PROTOCOL_VERSION`-/Pie-Update.
- ✓ KEINE Tafel-Umsortierung CLAUDE.md.

**Nächster Schritt:** Klaus startet pro externes Repo eine eigene
Claude-Code-Sitzung mit dem jeweiligen Brief als Prompt — analog
zum 5e-Re-Aktivierungs-Workflow von 2026-05-25. Nach Modul-18-Einbau
+ Sichttest in beiden Endknoten ist Pipeline-Phase A Schritt 5h.1-
Folge geschlossen. Danach: Truhe-Bau-Sitzung
(`claude/bau-observatoriums-vorteilspack`, Brief in PR #195).

---

### 2026-05-28 · Plansitzung Observatoriums-Vorteilspack (Truhe-Brief)

**Sitzungs-Rolle:** Brief-Anlage-Sitzung (kleine Sitzung). Branch
`claude/brief-observatoriums-vorteilspack`. Reine Doku/Spec-Arbeit,
KEIN Modul-Code, KEIN Sage-Page-Eingriff.

**Anlass:** Klaus' Vision 2026-05-28 nach grünem Sichttest Bau 18
Sub (a) Vorab (PR #194): eine **Toolbox-Truhe im Sage-Page-
Observatorium** mit allen SBKIM-Tools als kopierfertige
„Verpackungen". Alte Seemannskiste + Schlüssel-Schritt-Mechanik
(analog Einladungs-Tür Scene 5/5b), Container-Größe wie Schwarz-
Loch-/Sonnen-Karte (~280 px). Klaus' Wort: **„Vorteilspack"** —
die Truhe ist die Sage-Page-Sichtbarkeit des Starter-Bundles
(Phase B Schritt 8), Klick-und-Kopier-Pfad statt git-clone.

**Was getan:**

1. **Brief** `docs/sessions/BRIEF_BAU_OBSERVATORIUMS_VORTEILSPACK.md`
   voll angelegt. Inhalt:
   - Pflicht-Verifikations-Schritt (CLAUDE.md, Konzept-Karte,
     Schwester-Konzept Starter-Bundle, Einladungs-Optik, Schwarz-
     Loch-Container-Größe, alle Modul-Karten).
   - Pflicht-Disziplin (KEIN `src/modules/`-Eingriff, KEIN
     `PROTOCOL_VERSION`-Bump, KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag,
     KEIN Endknoten-Eingriff, KEIN Modul-19-Bau, KEINE Tafel-
     Umsortierung).
   - Sage-Page-Karte-Vorschlag mit Truhe-Stage (280 px) + Schlüssel
     davor + Klick-Mechanik in vier Phasen.
   - Tool-Tile-Außen-Sicht (Tier-Badge + Icon + Name + Aufgabe +
     Status-Marker) + Tool-Modal-Inhalt (neun Sektionen pro Tool).
   - Tier-Vorschlag (Bau-Sitzung muss final entscheiden):
     - **Must-have (3):** 01 Storage, 02 Spore, 15 Membran.
     - **Basic (7):** 03 Embedding, 04 Match, 05 Anastomose, 07
       Apoptose, 16 Siegel, 17 Floating-Widget, 18 Tool-PWA Sub (a)
       Vorab.
     - **Pro (8+):** 00 Doku-Fenster, 06 Heterokaryose, 08 UI-Demo,
       09 Einbau-Anleitung, 10/11/12 Schutz-Backlog, 14 Diffusion-
       Backlog, 19 Andock-Wizard (Konzept).
   - Vibe-Coding-Prompt-Paket-Template pro Tool — Klaus copy-paste-
     fähig in eine KI-Sitzung, die KI baut dann das Tool im Repo
     ein.
   - Code-Inhalt-Strategie: **Hybrid** empfohlen — statische
     Metadaten + lazy-fetch von `src/modules/NN_modul.js` beim
     Kopier-Klick.
   - Klärung Beziehung zum Starter-Bundle (Phase B Schritt 8):
     Truhe = klick-und-kopier; Starter-Bundle = git-clone.

2. **Konzept-Karte** `docs/components/_observatoriums_vorteilspack.md`
   als Schablone angelegt mit Vokabular, Klaus-Festlegungen 2026-05-28
   (fünf Tafel-Punkte), sechs Sub-Bereiche (a–f) mit Spec-Skizze +
   offenen Spec-Punkten, Strikte Tabus, Bauzustand-Tabelle.

3. **CLAUDE.md Pflege** § „Vision-Anker-Vorbereitung":
   - Neue Zeile für Observatoriums-Vorteilspack-Truhe.
   - Pipeline-Position: NACH MR + MM Endknoten-Re-Migration,
     parallel zu Phase B Schritt 7 möglich.
   - **KEINE Tafel-Umsortierung** der Phase-A/B-Reihenfolge.

**Pflicht-Disziplin eingehalten:**

- ✓ KEIN Code in `src/modules/`.
- ✓ KEIN Sage-Page-Eingriff in `index.html` (kommt erst in der
  Bau-Sitzung).
- ✓ KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.
- ✓ KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Truhe ist Distributions-/
  Render-Schicht, kein Sicherheits-Modul).
- ✓ KEINE Pipeline-Umsortierung (Truhe ist Vision-Anker-
  Vorbereitung, Pipeline-Phase-frei).
- ✓ KEIN Endknoten-Eingriff.

**Was offen:**

1. **Bau-Sitzung Observatoriums-Vorteilspack-Truhe** — eigener
   Branch `claude/bau-observatoriums-vorteilspack`, NACH MR + MM
   Re-Migration. Brief liegt.
2. **Tier-Liste final** entscheiden in der Bau-Sitzung (Vorschlag
   im Brief, aber Klaus' Veto möglich).
3. **Asset-Frage** (Schlüssel-WebP-Reuse oder eigene CSS-/SVG-
   Variante) wird in der Bau-Sitzung gelöst.
4. **Tool-Datenbank-Quelle** (Build-Time-JSON oder Runtime-Fetch)
   wird in der Bau-Sitzung gelöst.

**Nächster Schritt:** Endknoten-Re-Migration MR + MM als zwei
eigene Sitzungen in den externen Repos starten. Truhe-Bau-Sitzung
folgt **NACH** MR + MM.

---

### 2026-05-28 · Pflege Modul-18-Lade-Puls (Schritt 3 + 4)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-modul18-lade-puls`. Reines CSS in Modul 18: der Lade-Status
(`.sbkim-tool-pwa-status[data-kind="loading"]`) pulsiert jetzt — deckt
**Schritt 3** (Embedding-Download) **und Schritt 4** (Handshake-Wartezeit,
bis 5 min) ab. Opacity-Animation auf dem Compositor (läuft trotz Haupt-
Thread-Last, stoppt bei echtem Einfrieren). `prefers-reduced-motion`
respektiert. Nutzt das vorhandene `data-kind`-Attribut → keine JS-Logik-
Änderung. `node --check` grün, Smoke 19/19. **KEIN** VERSION-Bump.

---

### 2026-05-28 · Pflege Modul-18-Match-Schritt Embedding-Fortschritt

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-modul18-embedding-fortschritt`. Folge zu #205/#206: der
Embedding-Fortschritts-Event (`sbkim:embedding-progress`, Modul 03) wird
jetzt auch im **Modul-18-Wizard Schritt 3 (Match)** angezeigt — derselbe
Live-Balken statt des statischen „lädt …". Genau der Pfad, den Klaus beim
Andocken/Handshake (Siegel → Andocken) benutzt. `init()` registriert einen
`onEmbeddingProgress`-Listener, gated auf `currentStep===3 &&
embeddingReady==="loading"` (bedient nur das eigene Lade-Fenster, nicht den
Sage-Identitäts-Wizard). Smoke Probe 19 NEU (Listener-Registrierung) →
19/19 grün. `node --check` 18 grün. **KEIN** VERSION-Bump.

---

### 2026-05-28 · Pflege Sage-Andock-Einstiege (Discoverability)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-sage-andock-einstiege`. Klaus' Befund: der Identitäts-
Wizard (`#andock`, „Identität/Spore/Backup") hatte **keinen sichtbaren
Einstieg** — nur die Hash-URL oder der (bedingte) Schwarz-Loch-Erst-Klick.
Auf einem Hybrid-Knoten (Sage = Hub UND Endknoten) muss man seine
Identität/Spore aber auffindbar erzeugen + verwalten können.

**Fix (Sage-lokal, Modul 16 unangetastet):** zwei sichtbare Einstiege zum
`openAndockWizard()`:
1. **Untere Karte** „Sage als Knoten · eigene Identität & Spore" (über der
   „Endknoten anschließen"-Karte) mit Knopf „🔑 Identität & Spore erzeugen
   / verwalten →". Klärt explizit den Unterschied zur Spore-Vorlage-für-
   fremde-PWAs-Karte.
2. **Link im Siegel-Modal** — per MutationObserver wird in das Modul-16-
   Siegel-Modal (`#sbkim-siegel-modal`) ein „🔑 Eigene Identität & Spore"-
   Link injiziert, sobald es im DOM auftaucht. Das geteilte Sicherheits-
   Modul 16 bleibt **unverändert** (#andock ist Sage-page-spezifisch). Der
   Wizard (z-index 100000) legt sich über das Siegel-Modal (99998).

`index.html`-Script-Block `node --check` grün. **KEIN** VERSION-Bump,
**KEIN** Eingriff in Modul 16 (kein Re-Sync, kein Aspekte-Eintrag nötig).
Sichttest ungeprüft.

---

### 2026-05-28 · Pflege Handshake-Timeout-Override (interaktiv großzügig)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-handshake-timeout-override`. Auslöser: Klaus' Befund —
der Live-Cross-Tab-Handshake bricht nach 4 s ab („Channel-Reply > 4000
ms"); früher war der Timeout zum Testen auf 5–10 min hochgesetzt, der
Re-Sync auf `main` (QUERY_TIMEOUT_MS=4000) hat das überschrieben.
Wurzel-Erklärung in `docs/OBSERVATORIUM_BROWSER.md` Lehre 1 + 3:
BroadcastChannel ist same-origin **und** same-instance, und Mobile-Chrome
verwirft/drosselt Hintergrund-Tabs → Empfänger-Listener weg → Timeout.

**Fix:** Modul 05 `handshake(targetSpore, ownDomainVector?, options?)`
bekommt `options.timeoutMs`-Override (Channel-Reply + HTTP-Abort).
Protokoll-Default bleibt `QUERY_TIMEOUT_MS = 4000` für automatisierte
Pfade (forker-sicher). Threaded durch `_doHandshake` → `sendViaChannel`
→ `postChannelEnvelope`. Modul 18 interaktiver Wizard
`triggerStepFourHandshake` reicht `HANDSHAKE_CHANNEL_TIMEOUT_MS = 300000`
(5 min) — Mensch wartet + Schließen-X vorhanden. Smoke Probe 18 prüft
jetzt zusätzlich `timeoutMs > 4000` im handshake-Aufruf (18/18 grün).
INTERFACES § 1 Modul 05 + Karte 05 nachgezogen. `node --check` 05+18 grün.
**KEIN** VERSION-Bump. Sichttest: der eigentliche Erfolg hängt am
Mobile-Workaround (beide Tabs sichtbar, DeX-Splitscreen) — der Timeout
gibt nur Luft, ersetzt aber keinen verworfenen Tab.

---

### 2026-05-28 · Pflege Embedding-Lade-Puls (UX, Folge zu #205)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-embedding-puls`. Klaus' Wunsch: „lasse ihn pulsen solange
es nicht eingefroren ist". Der Lade-Indikator im Sage-Andock-Wizard
Schritt 2 pulsiert jetzt (CSS-Opacity-Animation `sage-andock-pulse`,
Klasse `.is-loading`) während des Embedding-Ladens. Opacity läuft auf dem
Compositor → pulsiert auch weiter, während der Haupt-Thread am Modell
rechnet, **stoppt aber, wenn die Seite echt eingefroren ist** — genau der
„lebt noch vs. hängt"-Indikator. Klasse wird in Success- + Catch-Pfad
entfernt; `setAndockOutput` lässt sie unangetastet (nur ok/err). `prefers-
reduced-motion` respektiert (kein Puls). Reines CSS+JS in index.html,
Script-Block `node --check` grün. KEIN VERSION-Bump.

---

### 2026-05-28 · Pflege Embedding-Download-Fortschritt (UX)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-embedding-fortschritt`. Auslöser: Klaus' Live-Befund —
nach tiefem Browser-Löschen lädt das 30-MB-Embedding-Modell neu, **ohne
jeden Fortschritts-Hinweis** („lädt ewig, frustrierend, nichts zu sehen").

**Fix:** Modul 03 `init()` reicht jetzt einen `progress_callback` an
transformers.js `pipeline(...)` und sendet den Download-Fortschritt als
window-Event **`sbkim:embedding-progress`** (`detail` = transformers.js-
Daten: `status`/`file`/`progress`/`loaded`/`total`). Fail-soft +
konsumentenfrei (Event-Bus-Stil analog Modul 17). Der Sage-Andock-Wizard
(Schritt 2 „Spore erzeugen") lauscht darauf und zeigt einen Live-
Balken („Embedding-Modell lädt … ████░░ 45 % (model.onnx, ~30 MB)").
Listener wird in Success- + Catch-Pfad sauber entfernt.

**Kein** Modell-Wechsel (Klaus' Frage): `Xenova/multilingual-e5-small`
bleibt — 384-dim ist protokoll-fest (INTERFACES §0, Modul 04/05), und ein
Wechsel bräuchte mycel-weite Lockstep-Migration aller Knoten + Re-
Embedding. Der lange Ladevorgang ist einmalig (gecacht); nur nach Cache-
Wipe sichtbar. Begründung im Chat festgehalten.

**Tests:** `node --check` Modul 03 grün, index.html-Wizard-Script-Block
grün, Regression Modul-18-Smoke 18/18 grün. **KEIN** VERSION-Bump.
**Offen / Folge-Kandidat:** Modul-18-Wizard (Match-Schritt) kann denselben
`sbkim:embedding-progress`-Event konsumieren — noch nicht verdrahtet.
Sichttest ungeprüft (wartet auf Klaus' Browser-Lauf).

---

### 2026-05-28 · Pflege Sage-Identitäts-Wizard z-index (UX-Fix)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-sage-andock-wizard-zindex`. Auslöser: Klaus' Live-
Sichttest 2026-05-28 — der Sage-Identitäts-Wizard (`sage-andock-modal`,
„Identität erzeugen / Spore erzeugen + herunterladen / Backup") war mit
`z-index: 300` hinter dem Siegel-Modal (99998) und dem Modul-18-Wizard
(10000) vergraben und praktisch unauffindbar. Klaus landete wiederholt
auf den falschen Modals (Modul-18-Wizard, Siegel-Modal, „Spore-Vorlage
erzeugen"-Karte für fremde PWAs).

**Fix:** `.sage-andock-modal` z-index 300 → **100000** (über Siegel,
Membran-Fremd-Alert 99999, Modul-18). Der Identitäts-Wizard ist eine
bewusste User-Geste (`#andock` / Schwarz-Loch-Klick) und muss beim
Öffnen vorn liegen. Eine CSS-Zeile in `index.html`.

**Offen / nächster Schritt:** Sichttest ungeprüft — nach Merge +
Hard-Reload `#andock` öffnet den Identitäts-Wizard vorn → Schritt 1/2
(Identität + Spore erzeugen) → nodeId → Commit `sbkim/spore.json` →
End-to-End-Handshake MM↔Sage. **Discoverability bleibt offen**
(der Wizard hat keinen sichtbaren Knopf, nur Hash/Schwarz-Loch-Klick)
— Kandidat für Folge-Pflege.

---

### 2026-05-28 · Pflege 05+18 Handshake — Eigenvektor-Auflösung (Lösung 1, korrigiert PR #201)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-05-18-handshake-eigenvektor`. Korrigiert den Ansatz von
PR #201 nach MM-Bausitzungs-Bericht + tieferer Wurzel-Analyse.

**Wurzel:** `_doHandshake` sendet `ownDomainVector` als
`request.domainVector` **und** die signierte eigene Spore als
`senderSpore` — beide müssen denselben Vektor tragen. PR #201 ließ
Modul 18 einen frischen `embedPassage(domainKeywords)` rechnen, was vom
signierten Spore-`domainVector` (`embedPassage(domainDescription + '. '
+ domainKeywords)`) abweicht → inkonsistenter Request. Außerdem braucht
der Handshake die eigene Spore ohnehin (Signieren), die den kanonischen
Vektor schon trägt.

**Entscheidung (Klaus): Lösung 1** — Modul 05 löst den Eigenvektor
selbst aus der eigenen Spore auf (forker-sicher: `handshake(fremdSpore)`
ist immer korrekt, single source of truth).

**Was getan:** Modul 05 `_doHandshake`: `ownDomainVector` optional, bei
Weglassen `loadOwnDomainVector(opSlot)` → `ownSpore.domainVector`; keine
Spore → klare `AnastomoseDependenciesError`. Modul 18
`triggerStepFourHandshake` wieder schlank (`handshake(foreignSpore)`,
kein embedPassage). INTERFACES § 1 Modul 05 Tafel + Modul-05-Karte +
Modul-18-Karte nachgezogen. Smoke Probe 18 umgestellt (handshake ohne
2. Arg + kein embedPassage in Schritt 4) → **18/18 grün**. `node --check`
05 + 18 grün. `smoke_bau05y` nicht lauffähig (fake-indexeddb fehlt im
Sandbox) — Live-Pfad über Klaus' Sichttest.

**Backward-kompatibel:** explizit übergebener Vektor (Test
`manual_check.html` `mainVec`) wird weiter honoriert.

**Offen:** Sage-Knoten braucht eine Laufzeit-Eigen-Spore (Sage-Andock-
Wizard `generateOwnSpore`) — separater Setup-Schritt. Danach Schritt-4-
Sichttest. Sporen-Reinigung/Neubildung (Klaus' Frage) = eigenes Thema
(Modul 18 Sub f/g). Übergabeprotokoll:
`docs/sessions/archiv/2026-05-28_pflege-05-18-handshake-eigenvektor.md`.

---

### 2026-05-28 · Pflege Modul 18 Sub (a) Handshake — ownDomainVector (Folge-Wurzel-Fix)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-modul-18-handshake-domainvector`. Folge zum Match-Embed-
Fix (PR #199).

**Wurzel-Diagnose:** Nach dem Match-Fix lief Schritt 3 grün (Sage-Page
86 %, Mein-Mixarium 85 % + Drei-Bars), aber Schritt 4 (Handshake) warf
„ownDomainVector muss Float32Array(384) sein — Aufruf von handshake".
`triggerStepFourHandshake` rief `SbkimAnastomose.handshake(foreignSpore)`
mit nur einem Argument; `handshake(targetSpore, ownDomainVector)`
erwartet als 2. Arg einen eigenen Domain-Vektor `Float32Array(384)`
(Modul 05 § `_doHandshake`). Gleiche Bug-Klasse wie PR #199, eine
Stufe weiter. Reproduzierbar auf Sage-Page **und** Mein-Mixarium.

**Was getan:** `triggerStepFourHandshake` leitet den eigenen Domain-
Vektor jetzt kanonisch ab via `SbkimEmbedding.embedPassage(
domainKeywords.join(", "))` (analog Spore-`domainVector` /
`manual_check.html` `mainVec`) und reicht ihn als 2. Argument an
`handshake`. Verfügbarkeits-Check + Leere-Stichworte-Guard. Smoke Probe
18 NEU (treibt bis Schritt 4, prüft `handshake` bekommt Float32Array(384)
als Arg 2) → **18/18 grün**. `node --check` 18 + 05 grün.

**Pflicht-Disziplin:** KEIN Eingriff in Modul 03 / Modul 05 (Surfaces
korrekt). KEIN VERSION-Bump, KEIN ZERTIFIKAT_ASPEKTE-Eintrag, KEIN
Endknoten-Eingriff.

**Offen / nächster Schritt:** Sichttest ungeprüft — wartet auf Klaus'
Browser-Lauf Schritt 4. Danach MR + MM Sync (Modul-18-Datei jetzt inkl.
Match-Fix + Handshake-Fix). Übergabeprotokoll:
`docs/sessions/archiv/2026-05-28_pflege-modul-18-handshake-domainvector.md`.

---

### 2026-05-28 · Pflege Modul 18 Sub (a) Match-Schritt — Embedding-Pflicht-Aufruf (Wurzel-Fix)

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-modul-18-match-embed-6XM5l`. Wurzel-Fix für Klaus'
Live-Befund in Schritt 3 (Match) nach PR #198.

**Wurzel-Diagnose (Bug-Kette):** `computeAndRenderMatch` in
`src/modules/18_tool_pwa.js` reichte die **String**-Outputs von
`textBlob` direkt an `SbkimMatch.matchDimensions` — das erwartet aber
vier `Float32Array(384)` (Modul 04 § `assertVector`) → synchroner
`InvalidVectorError` („Parameter 'queryVec' muss Float32Array sein,
war: String"). Das Embedding (Modul 03) wurde lazy initialisiert,
aber die vier Textblobs nie zu Vektoren gemacht — der
`embedQueryBatch`-Aufruf fehlte komplett. Reproduzierbar in Sage-Page
UND Mein-Rezeptbuch (1:1-Sync) → Wurzel im Sage-Quellcode.

**Was getan:**

1. **Eingriff A** — `computeAndRenderMatch` ruft jetzt **vor**
   `matchDimensions` zwingend `SbkimEmbedding.embedQueryBatch([...])`
   für die nicht-null Textblobs auf. Null-Safe-Mapping (null-Spalten
   bleiben null, gehen NICHT in den Batch; alle vier null →
   Vorab-Fehlermeldung statt `DimensionsAllNullError`). Lade-Hinweis
   sofort: „Embedding-Modell wird geladen (ca. 30 MB beim ersten
   Aufruf …)". **KEIN künstlicher Timeout** (kein `Promise.race`).
2. **Eingriff B** — Karte 18 § Sub (a) § Match-Schritt: neuer Block
   „Embedding-Pflicht-Aufruf vor `matchDimensions`" + § Bauzustand-
   Zeile „Pflege Match-embedQueryBatch-Pflicht — 2026-05-28".
3. **Test** — `smoke_bau18_sub_a_vorab.mjs` Probe 15 additiv
   verschärft (`embedQueryBatch(Strings)` VOR `matchDimensions`,
   `matchDimensions` bekommt nur Float32Array/null) — **17/17 grün**.
   Regression `smoke_bau15b` 31/31, `smoke_bau16_sub_e_bronze` 16/16,
   `smoke_bau17_floating_widget` 36/36 grün. `node --check` 18 + 04
   grün.

**Pflicht-Disziplin:** KEIN Eingriff in Modul 03 / Modul 04 (Surfaces
korrekt). KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
Bump, KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Render-Schicht-Pflege), KEIN
Endknoten-Eingriff (MR + MM eigene Sync-Sitzung nach Sichttest grün).

**Offen / nächster Schritt:** Sichttest ungeprüft — wartet auf Klaus'
Galaxy-Tab-S6-Browser-Lauf (erster echter 30-MB-Embedding-Download im
Match-Schritt). Danach MR + MM Sync-Sitzungen. Übergabeprotokoll:
`docs/sessions/archiv/2026-05-28_pflege-modul-18-match-embed.md`.

---

### 2026-05-28 · Sichttest-Nachzug Bau 18 Sub (a) Vorab — Panel 18 grün 10/10

**Sitzungs-Rolle:** Sichttest-Nachzug-PR. Branch
`claude/bau-18-sichttest-nachzug`. Reine Doku-Pflege nach Klaus'
grünem Live-Sichttest am Tab — kein Code-Eingriff.

**Was getan:**

1. **Klaus' Sichttest Panel 18 Knöpfe 1–10 alle grün** am Galaxy
   Tab S6 (DeX-Chrome, Termux-`localhost:8000/tests/manual_check.html`
   nach Hard-Reload). Reihenfolge: Setup → Test 1 (Surface) → Test 2
   (init fail-soft) → Test 3 (ready-heal) → Test 4 (NotReadyError) →
   Test 5 (Modal Schritt 1 sichtbar) → Test 6 (Live-Spore-Fetch +
   verifyForeignSpore + Foreign-Spore-Preview) → Test 7
   (InvalidUrlArgError) → Test 8 (close() mit confirm()-Dialog) →
   Test 9 (matchThreshold-Clamp) → Test 10 (externalHubUrl-
   Spiegelung).
2. **Live-Cross-Knoten-Spore-Read belegt:** Test 6 hat live gegen
   `https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json`
   gefetched, `SbkimSpore.verifyForeignSpore` lief durch, Foreign-
   Spore-Preview rendert volle Mixarium-Identität:
   - Domain `lausiklauskn-png.github.io`
   - Knoten-ID `B7Fke9CYTR1BrC3x…` (Kurzform aus 64-Zeichen-ID)
   - Domain-Stichworte: Cocktail, Drink, Mocktail, Limonade, Smoothie,
     Aperitif, Sake
   - Stamm-Kategorien: Cocktails, Mocktails, Alkfr. Cocktails,
     Smoothies & Shakes, Limonaden, Tees & Kaffees, Bowlen, Sirup & Basis
   - Gast-Kategorien: Knabbereien, Fingerfood

   Das ist der **erste produktive Cross-Knoten-Spore-Read aus
   Modul 18**.
3. **Test 8 confirm()-Bestätigungs-Dialog korrekt:** weil Modal in
   Schritt 2 war (`hasUnsubmittedInput` liefert true für Schritt 2/3),
   feuerte `close()` den nativen Browser-`confirm("Andock-Wizard
   schließen? Eingaben gehen verloren.")`. Klaus drückte „OK" →
   Modal sauber geschlossen, `is_open_after: false`, `current_step: 0`.
4. **Drei Sichttest-Screenshots** im Repo unter
   `docs/sessions/archiv/screenshots/`:
   - `2026-05-28_panel18_test5_modal_schritt1.jpg`
   - `2026-05-28_panel18_test6_spore_geladen.jpg`
   - `2026-05-28_panel18_test8_close_confirm.jpg`
5. **Doku-Pflege:**
   - Karte 18 § Bauzustand: neue Zeile „Sichttest grün — 2026-05-28
     — Sichttest-Nachzug Bau 18 Sub (a) Vorab" am Listen-Ende mit
     voller Belegung der zehn Test-Knöpfe + Live-Spore-Fetch +
     Screenshots + Pipeline-5h.1-Abschluss.
   - INTERFACES.md § 1 Modul 18 Geprüft-Zeile: dritte Datums-Zeile
     für Sichttest-Nachzug.

**Pflicht-Disziplin eingehalten:**

- KEIN Code-Eingriff (Doku-Pflege only).
- KEIN `status.json`-Score-Wechsel (Modul 18 bleibt `score:"stub"` —
  Konvention analog Modul 17: nach Bau + Sichttest grün bleibt
  `stub`, weil nur Sub (a) Vorab implementiert ist; Voll-Bau 18
  Pipeline 5h.2 entscheidet später, ob `score:"fertig"`).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag.

**Pipeline-Stand:** Phase A Schritt **5h.1 abgeschlossen** (Bau 18
Sub (a) Vorab voll-geprüft auf Tab). Nächster Schritt: Endknoten-Re-
Migration **MR + MM** als zwei eigene Sitzungen pro Endknoten-Repo
(Briefe in der Bau-Sitzungs-Antwort 2026-05-28).

---

### 2026-05-28 · Bau-Sitzung 18 Sub (a) Vorab (Andocken-Pfad allein)

**Sitzungs-Rolle:** Bau-Sitzung (Pipeline-Phase A Schritt **5h.1**),
Folge von Spec-Sitzung 18 Sub (a) Vorab (PR #190). Branch
`claude/bau-18-sub-a-vorab-Ze6Xf`.

**Anlass:** Spec-Sitzung 18 Sub (a) Vorab vom 2026-05-28 hat
Endknoten-Init-Schema + `openAndockTab(url?)`-Signatur + Embedding-
Lazy-Trigger + Match-Schwelle-UI + Stepper-Modal-Form festgelegt.
Diese Bau-Sitzung schreibt den Modul-Code, der den fail-soft-Hook
im Modul-16-Sub-(e)-Bronze-Modal (PR #180) produktiv macht und das
Multisuchfeld mit einer realen Andock-Surface versorgt.

**Was getan:**

1. **`src/modules/18_tool_pwa.js`** voll angelegt (~1 000 Zeilen
   inkl. Inline-CSS) mit:
   - Public-Surface `SbkimToolPwa = {init, openAndockTab, close,
     isOpen, _meta}` + Selbstcheck-Zeile
     `MODUL 18 TOOL-PWA bereit, Sub (a) Vorab, Funktionen:
     init/openAndockTab/close/isOpen` beim Skript-Laden.
   - Zwei Errors (Factory-Stil analog Modul 15/16):
     `ToolPwaNotReadyError` (mit Liste der fehlenden Felder im
     Message) + `ToolPwaInvalidUrlArgError`.
   - `init(options)` Promise<void>, idempotent + fail-soft.
     Pflicht-Felder `endpoint`+`domain`+`domainKeywords` fehlen
     → `console.warn` + `_meta.ready=false` + `_meta.missingFields[]`,
     KEIN Throw. `matchThreshold > PROVIDER_MIN_MATCH (0.80)` →
     clamp + warn. `externalHubUrl` Read-Anker (KEIN Hub-Fetch
     in Sub (a) Vorab). `repoUrl` Auto-Erkennung aus
     `location.origin` + erstem Pfad-Segment.
   - `openAndockTab(url?)` mit Sync-Validierung **vor** await
     (ready-Check + `new URL(url)`-Validierung). Async: Modal-
     Self-Mount in `document.body` (Override via `opts.mountTarget`)
     mit MutationObserver-Fallback (10 s Timeout). Bereits-offen +
     gleiche URL → no-op; bereits-offen + andere URL → Reset auf
     Schritt 2.
   - Vier-Schritt-Stepper-UI (URL/Spore/Match/Handshake):
     - Schritt 1: Text-Input + „Weiter →"-Knopf, URL-Validierung
       sichtbar im Fehler-Label.
     - Schritt 2: `fetch(joinUrl(url, "sbkim/spore.json"))` +
       `SbkimSpore.verifyForeignSpore` (Signatur-Fail kein
       „Trotzdem"-Knopf). Foreign-Spore-Preview (Domain /
       Knoten-ID-kurz / Domain-Stichworte / Kategorien).
     - Schritt 3: Match-Check mit Lazy-Embedding (Re-Use bei
       `SbkimEmbedding._meta.ready===true` ODER `isReady()===true`,
       sonst `SbkimEmbedding.init()` mit 30 s Time-out-Warnung +
       Retry-Knopf). `SbkimMatch.matchDimensions` → Drei-Schichten-
       Bars fachlich/prozess/skalierung mit Bar-Farben grün/gelb/rot.
       Bei `overall >= matchThreshold` → grün + „Weiter zum
       Handshake". Bei `overall < matchThreshold` → gelb/rot +
       „Trotzdem andocken". Bei `DimensionsAllNullError` → Fehler
       OHNE „Trotzdem"-Knopf.
     - Schritt 4: `SbkimAnastomose.handshake(foreignSpore)` →
       grünes Häkchen + auto-Close 2 s. Fehler-Fall: konkrete
       Meldung + Retry-Knopf.
   - `close()` mit `confirm()`-Bestätigung bei offenen Wizard-
     Eingaben (Schritt 1 mit URL-Text ODER Schritt 2/3); no-op
     bei Schritt 0/4.
   - `isOpen()` boolean (aus `_meta.modalOpen`).
   - `_meta` 13 Felder gemäß INTERFACES § 1 Modul 18, defensive
     Kopie pro Lese-Zugriff (Array-Mutation am Snapshot beeinflusst
     Closure-State NICHT — getestet in Smoke 11).
   - Inline-CSS via `<style>`-Inject im `<head>` (Konvention
     analog Modul 17 — Drei-Zeilen-Einbau-Konvention für
     Endknoten). `z-index: 10000` (> Modul-17-Modal-9999, Spec
     § Risiken Modal-Konflikt-Mitigation).

2. **`index.html`** erweitert: NEUER `<script>`-Tag vor
   `sbkim-init.js`. Sage-Page macht KEINEN `SbkimToolPwa.init()`-
   Aufruf (Sub (a) Vorab ist Endknoten-Pflicht — Sage-Page hat
   keine Andock-Geste, der Andock-Wizard auf der Schwarz-Loch-
   Karte ist eigenständig).

3. **`tests/manual_check.html` Panel 18** angelegt mit 11 Knöpfen:
   - Setup-Knopf (`SbkimToolPwa.init({endpoint, domain,
     domainKeywords})` mit Test-Werten).
   - Test 1: Surface + Selbstcheck-Hinweis.
   - Test 2: `init({})` ohne opts → warn + `ready=false`.
   - Test 3: `init({…vollständig…})` → `ready=true`.
   - Test 4: `openAndockTab()` ohne ready → `ToolPwaNotReadyError`.
   - Test 5: `openAndockTab()` mit ready → Modal Schritt 1.
   - Test 6: `openAndockTab("https://…")` → Schritt 2 direkt.
   - Test 7: `openAndockTab("not-a-url")` → `ToolPwaInvalidUrlArgError`.
   - Test 8: `close()` schließt Modal.
   - Test 9: `matchThreshold > 0.80` → clamp + warn.
   - Test 10: `externalHubUrl` als string → `_meta` gespiegelt
     (kein Hub-Fetch).
   - Reset-Knopf für sauberen Vorzustand vor Test 4.
   - Selbstcheck-Hinweis.

4. **Headless-Smoke `tests/smoke_bau18_sub_a_vorab.mjs`** mit 17
   Proben (15 vom Brief gefordert + 2 zusätzliche Härtungen):
   - Surface (Probe 1).
   - init fail-soft (Probe 2).
   - init grün (Probe 3).
   - openAndockTab ohne ready → Error (Probe 4).
   - openAndockTab mit ready → Modal Schritt 1 (Probe 5).
   - openAndockTab mit url → Schritt 2 (Probe 6).
   - openAndockTab mit ungültiger url → Error (Probe 7).
   - close (Probe 8).
   - matchThreshold-Clamp (Probe 9).
   - externalHubUrl-Spiegelung + kein Hub-Fetch (Probe 10).
   - _meta-Defensiv-Kopie (Probe 11).
   - modalOpen-Toggle (Probe 12).
   - currentStep-Bewegung (Probe 13).
   - missingFields-Reset bei Re-Init (Probe 14).
   - Re-Use-Test SbkimEmbedding._meta.ready (Probe 15) inkl.
     Match-Bars + Schritt-2→3-Übergang.
   - Idempotenz mit identischen opts (Probe 16, Zusatz).
   - repoUrl Auto-Erkennung (Probe 17, Zusatz).
   Lauf: **17/17 grün**.

5. **Doku-Pflege:**
   - **Karte 18 § Bauzustand:** neue Zeile „Bau Sub (a) Vorab —
     2026-05-28 — Bau-Sitzung 18 Sub (a) Vorab" am Listen-Ende.
     Status-Header auf 🟦 **Code-Stub Sub (a) Vorab** + Sub (b)–(i)
     bleibt 🟫 Schablone.
   - **INTERFACES.md § 1 Modul 18:** Status-Block auf
     „Code-Stub (Bau Sub (a) Vorab)" geändert, Geprüft-Zeile
     mit voll-Begründungs-Block ergänzt (alle Tabus + Pflicht-
     Disziplinen sichtbar verankert).
   - **`status.json` Modul 18:** von `score:"schablone"` auf
     `score:"stub"` gehoben (Konvention analog Modul 17 nach
     Bau-Sitzung 17). `abhaengig: ["02","03","04","05","16"]`
     ergänzt. `scripts/update_puls_pie.py` ausgeführt — Pie zeigt
     jetzt 7 Schablone / 9 Code-Stub / 5 Fertig (Modul 18 wechselt
     von Schablone-7-Bucket in Code-Stub-9-Bucket).

**Pflicht-Disziplin eingehalten:**

- KEIN Code für Sub (b)–(i). NUR Sub (a) Vorab-Surface.
- KEIN Endknoten-Eingriff (MR + MM Re-Migration ist eigene Folge-
  Sitzung pro Endknoten-Repo).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump (Sub (a) Vorab ist RAM-only Render-Schicht).
- KEINE neuen Module (KEIN Modul 19, KEIN Vision-Anker-5-
  Container).
- KEINE Tafel-Umsortierung CLAUDE.md (5h → 5h.1+5h.2-Pflege ist
  eigene Folge-Sitzung).
- KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Modul 18 ist Wartungs-/
  Andock-Schicht, kein Sicherheits-Modul).
- KEIN automatisches Andock-Triggern. KEIN Hub-Fetch. KEIN
  `matchThreshold > PROVIDER_MIN_MATCH`.

**Was offen:**

- **Sichttest ungeprüft** — wartet auf Klaus' Browser-Lauf Panel 18
  Knöpfe 1–10 (Galaxy Tab S6 / DeX-Chrome). Konvention CLAUDE.md
  „Klaus' Browser-Sichttest ist nicht ersetzbar".
- **Endknoten-Re-Migration MR + MM** — eigene Folge-Sitzungen pro
  Endknoten-Repo. Sobald Klaus' Sichttest Panel 18 grün ist,
  startet die MR-Folge-Sitzung (Brief in dieser Sitzungs-Antwort).
- **Sub (b)–(i) Voll-Spec + Voll-Bau** — Pipeline 5h.2, NACH App-
  Freigabe.
- **PR #190 (Spec-Sitzung 18 Sub (a) Vorab)** noch offen — wurde
  in diese Bau-Branch fast-forward-gemergt, damit der Bau auf der
  Spec aufsetzt. Klaus entscheidet die Merge-Reihenfolge.

**Nächster Schritt:** Klaus' Sichttest Panel 18 Knöpfe 1–10. Bei
grünem Sichttest startet MR-Folge-Sitzung (Brief in der Chat-
Antwort).

---

### 2026-05-28 · Spec-Sitzung 18 Sub (a) Vorab (Andocken-Pfad allein)

**Sitzungs-Rolle:** Spec-Sitzung (Pipeline-Phase A Schritt **5h.1**),
reine Doku/Spec-Arbeit, KEIN Modul-Code. Branch
`claude/spec-18-sub-a-vorab-2oi16`.

**Anlass:** Klaus' Klärung 2026-05-28 in der Plansitzung Multisuchfeld:
Modul 18 Sub (a) Andocken-Pfad **vor** dem Multisuchfeld umsetzen
(Pipeline-Vorrang). Vorab-Spec **nur für Sub (a)** schließt zwei Lücken:
(1) Bronze-Modal-`[Andocken]`-Knopf in Modul 16 Sub (e) (PR #180)
greift live, sobald `SbkimToolPwa.openAndockTab` existiert; (2)
Multisuchfeld-Spec setzt Sub (a) als Andock-Geste voraus.

**Was getan:**

1. **Karte 18 § Sub (a) Andocken** voll gefüllt mit Klaus' sechs
   Entscheidungspunkten:
   - **Endknoten-Init-Schema** — Pflicht-Felder
     `endpoint`+`domain`+`domainKeywords`; Optional `stammCategories`/
     `guestCategories`/`matchThreshold`/`externalHubUrl`/`repoUrl`/
     `mountTarget`. Fail-soft mit `console.warn` bei fehlenden Pflicht-
     Feldern (KEIN Throw aus `init()`, `_meta.ready=false`,
     `openAndockTab()` wirft dann `ToolPwaNotReadyError` sync).
     Idempotenz: identische opts → no-op; geänderte Pflicht-Felder →
     `console.warn` (laufender Identitäts-Wechsel ist Voll-Spec-18-
     Sub-(c)-Aufgabe).
   - **`openAndockTab(url?: string): Promise<void>`-Signatur** —
     sync vor `await`: `_meta.ready`-Check + URL-Validierung; async:
     öffnet Modal mit Wizard-Schritt 1 (leer) ODER Schritt 2 (URL
     vorbelegt). Resolved sobald Modal sichtbar gemountet ist,
     NICHT erst nach Wizard-Abschluss. Zweiter Aufruf mit gleicher
     `url` → no-op; andere `url` → Reset auf Schritt 2.
   - **Embedding-Lazy-Trigger** — Lazy on demand beim ersten
     `openAndockTab()`-Aufruf (NICHT bei `init()`), Re-Use wenn
     `SbkimEmbedding._meta.ready===true` aus 04.C-Pfad. User-
     sichtbarer Spinner in Wizard-Schritt 3 verbindlich, 30 s
     Time-out-Warnung, fail-soft Retry.
   - **Match-Schwelle-UI** — Drei-Schichten-Darstellung
     `fachlich`/`prozess`/`skalierung` via `SbkimMatch.matchDimensions`
     (Modul 04.A); Bar-Farben grün/gelb/rot bei `≥matchThreshold`/
     `≥SCHICHT_MIN_MATCH`/`<SCHICHT_MIN_MATCH`. „Trotzdem andocken"-
     Knopf bei `overall<matchThreshold`. `opts.matchThreshold`
     override-bar, geclampt auf `[0, PROVIDER_MIN_MATCH=0.80]` —
     Bauer kann reduzieren, NICHT erhöhen (Spec-Tabu, wer strenger
     filtern will baut Modul-10-Reputation).
   - **Modal-Form** — Stepper-UI mit vier Schritt-Punkten oben
     („① URL — ② Spore — ③ Match — ④ Handshake"), Single-Pane-Body,
     „← Zurück" + „Weiter →"-Footer. Bestätigungs-Modal bei
     Schluss mit Eingaben; automatischer Modal-Close 2 s nach
     erfolgreichem Handshake.
   - **Andocken aus Multisuchfeld-Discovery** — `openAndockTab(url)`-
     URL-Parameter-Pfad; URL-Vorbelegung springt zu Schritt 2;
     Erkennungs-Heuristik liegt beim Aufrufer (Sub (i) / Multisuchfeld),
     nicht in Sub (a) Vorab.
   - **SB-KIMTool-Point-Integration** — `opts.externalHubUrl` als
     optionaler `string|null`-Parameter, Default `null`. Sub (a)
     Vorab ruft KEINEN Hub-Fetch (nur Read-Anker `_meta.externalHubUrl`
     für Sub (i) + Multisuchfeld). Multi-Hub-Array bleibt Voll-Spec 18.

2. **Karte 18 § Schnittstelle** Sub (a) Vorab-Vertrag verankert:
   `init`+`openAndockTab`+`close`+`isOpen`+`_meta` als Sub-(a)-Vorab-
   final. Zwei Errors benannt (`ToolPwaNotReadyError` +
   `ToolPwaInvalidUrlArgError`). `_meta`-Schema voll spec'd (13 Read-
   Anker-Felder). Wizard-interne Fehler als UI-Hinweise pro Schritt
   (NICHT als JS-Errors aus `openAndockTab`).

3. **Karte 18 § Strikte Tabus** Sub (a) Vorab-Block verankert
   (KEIN automatisches Andock-Triggern, KEIN Hub-Fetch, KEIN
   `matchThreshold > PROVIDER_MIN_MATCH`, KEIN Re-Init ohne `warn`,
   KEIN Modul-Pflicht-Check beim Bronze-Klick, KEIN PII-Render).

4. **Karte 18 § Modal-Form** Sub (a) Vorab-Stepper-UI verankert;
   Sub (b)–(i)-Tab-Container bleibt Voll-Spec 18-Aufgabe.

5. **Karte 18 § Bauzustand** neue Zeile „Spec Sub (a) Vorab gefüllt
   2026-05-28" — Sub (b)–(i) bleiben unverändert als Skizze.

6. **INTERFACES.md § 1 Modul 18** als neuer Eintrag angelegt (war
   vorher nicht da): Status `entwurf (Sub (a) Vorab)`, Sub (b)–(i)
   explizit „Spec ausstehend" für Voll-Spec 18. Voll-Block mit
   Bietet/Nutzt/Storage/Events/Fehlerverhalten/Selbstcheck/Strikte
   Tabus/Hook-Punkte/Risiken/Geprüft.

7. **Karte 18 § Status-Header** auf 🟨 Spec Sub (a) Vorab gefüllt
   gehoben (vorher 🟫 Schablone).

**Heilige Tafeln eingehalten:**

- KEIN Modul-Code in `src/modules/` (Spec-Sitzung).
- KEIN Endknoten-Eingriff.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE Voll-Spec der Sub-Bereiche (b)–(i) — explizit ausgeklammert
  (Voll-Spec 18 Pipeline-Schritt 5h.2 NACH App-Freigabe).
- KEINE Tafel-Umsortierung CLAUDE.md — Klaus' OK zur 5h → 5h.1+5h.2-
  Aufteilung liegt vor (Plansitzung 2026-05-28), aber CLAUDE.md-Pflege
  ist eigene Folge-Sitzung mit eigenem PR.
- KEINE neuen Karten in `docs/components/` (Karte 18 bestand bereits).
- KEIN `status.json`-/Pie-Update — Modul 18 bleibt `score:"schablone"`
  (Sub (a) allein ist noch kein „spec"-Voll-Stand; Voll-Spec 18 hebt
  später auf `score:"spec"`).
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Spec, kein Sicherheits-Modul-
  Update).
- KEINE PII in der Spec.

**Was offen blieb:**

- **Folge-Bau-Sitzung Sub (a) Vorab** — implementiert
  `src/modules/18_tool_pwa.js` mit nur `init`+`openAndockTab`+
  `close`+`isOpen`+`_meta`. CSS + Panel 18 in `tests/manual_check.html`
  + Headless-Smoke. Pipeline-Schritt 5h.1 abgeschlossen wenn Sichttest
  grün. Brief-Codeblock dafür in der Chat-Antwort dieser Sitzung
  (Klaus' Konvention 2026-05-21).
- **Endknoten-Re-Migration mit Modul 18 Sub (a)** — Mein-Rezeptbuch +
  Mein-Mixarium bekommen `<script src="sbkim/18_tool_pwa.js">` +
  `SbkimToolPwa.init({…})`-Aufruf. Sichttest: Bronze-Modal-
  `[Andocken]`-Knopf greift live, öffnet 4-Schritt-Wizard.
- **Multisuchfeld-Spec-Sitzung** (Schwester-Brief
  `BRIEF_SPEC_SUCHFELD_MULTI.md`, Pipeline-Schritt 5i.2) kann erst
  danach starten — Sub (a) Vorab ist Voraussetzung für Extern-/Hub-
  Treffer-Andock-Knopf.
- **Voll-Spec-Sitzung 18** (Sub b–i) bleibt Pipeline-Phase 6 (NACH
  App-Freigabe), Pipeline-Schritt 5h.2.
- **Eigene Folge-Pflege CLAUDE.md** Pipeline-Reihenfolge Phase A
  anpassen (5h → 5h.1 + 5h.2) — Klaus' OK liegt aus 2026-05-28-
  Plansitzung vor, aber eigene Pflege-Sitzung mit eigenem PR.
- **Offene Fragen für Voll-Spec 18** (in Karte 18 § Sub (a) am
  Ende notiert): Sub-(b)-Heterokaryose-Slot-Wechsel während offener
  Sub-(a)-Wizard-Sitzung? Sub-(c)-Identitäts-Wechsel-Interferenz?
  Sub-(i)-Spore-Discovery-Render-Form? Multi-Hub-Setups
  (`externalHubUrl: string[]`)? Re-Handshake-Verhalten bei
  bestehendem Sibling-Eintrag mit derselben `nodeId`?

**Nächster sinnvoller Schritt:** Klaus mergt PR dieser Spec-Sitzung,
dann Folge-Bau-Sitzung 18 Sub (a) Vorab (Brief-Codeblock in der
Chat-Antwort dieser Sitzung).

**Übergabeprotokoll:**
`docs/sessions/archiv/2026-05-28_spec-18-sub-a-vorab.md`.

---

### 2026-05-28 · Plansitzung Multisuchfeld — zwei Spec-Briefe (Sub (a) Vorab + Multisuchfeld)

**Sitzungs-Rolle:** Plansitzung (Spec-Brief-Schreiben, kein Modul-
Code, kein Endknoten-Eingriff, kein `status.json`-Update). Branch
`claude/multisearch-field-spec-DXrva`.

**Anlass:** Klaus' Wunsch 2026-05-28: das Endknoten-Suchfeld soll
**multi-modal** sein — Lokal (Modul 04.C) + Cross-Knoten Mycel
(Modul 15 Sub b) + **EXTERN** Internet (mit Klaus' Begriff
„Spuren"). Bisherige Dual-Modus-Briefe MR/MM (Pipeline-Schritt 5i)
decken nur Lokal + Mycel.

**Klaus' Klärung in der Sitzung:**

1. **Sitzungs-Scope:** „vor dem Suchfeld 18 umsetzen und in Den
   Plan Repo Idee SB-KIMTOOL-Point mit einbeziehen" — Modul 18
   Sub (a) Andocken-Pfad muss VOR dem Multisuchfeld umgesetzt
   werden (Pipeline-Vorrang), und SB-KIMTool-Point (Externer
   Mycel-Hub, Phase B Schritt 9) soll im Plan einbezogen werden.
2. **UI-Modus:** Klaus bat um Empfehlung („denke an Nutzer Die
   coole Ideen schätzen") — Empfehlung im Brief verankert:
   Variante D (drei Sektionen gestapelt + Auto-Klassifikation +
   Knopf für Extern). Macht Vier-Schichten-Lesart visuell sichtbar.
3. **Extern-Backend:** „Mehrere Backends parallel — Klaus
   entscheidet später" — Spec listet DuckDuckGo Instant Answer +
   Brave Search + generischer Fetch-Helper parallel + Anti-
   Tracking-Disziplin.

**Was getan:**

1. **Verifikations-Pflicht-Schritt** (CLAUDE.md-Pflege 2026-05-27
   nach Klaus' Doppel-Arbeit-Befund): `main` aktuell (PR #187 +
   #188 gemerged), Branch `claude/multisearch-field-spec-DXrva`
   ausgecheckt, CLAUDE.md komplett gelesen (vor allem § Vier-
   Schichten-Lesart 2026-05-27 + § Pipeline Phase A/B/D), PULS
   § Schnellüberblick + jüngste Sitzungs-Einträge, status.json,
   Karte 18 (9 Sub-Bereiche + § Such-Feld-Integration-Pattern),
   Karte 16 § Sub (e) (`[Andocken]`-Knopf + fail-soft-Check),
   beide Dual-Modus-Briefe MR/MM. **Kein Doppel-Arbeit-Befund** —
   `BRIEF_SPEC_SUCHFELD_MULTI.md` existiert noch nicht.

2. **Brief 1 angelegt: `docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md`**
   — Pipeline-Vorrang-Brief (Klaus' Klärung „vor dem Suchfeld 18").
   Drei offene Spec-Punkte aus Karte 18 § Sub (a) final-zu-legen
   (Endknoten-Init-Schema + Embedding-Lazy-Trigger + Match-Schwelle-
   UI), plus drei Folge-Entscheidungen (Modal-Form, Andocken aus
   Multisuchfeld-Discovery, SB-KIMTool-Point-Integration via
   `externalHubUrl`-Param). Sub-Bereiche (b)–(i) explizit
   ausgeklammert (Voll-Spec 18 nach App-Freigabe).
   - Pipeline-Antrag: Schritt 5h → 5h.1 (Sub a Vorab) + 5h.2
     (Voll-Spec 18). 5h.1 vor 5i Such-Feld-Integration.
   - Folge-Bau-Sitzung implementiert `src/modules/18_tool_pwa.js`
     mit `init` + `openAndockTab` + `close` + `isOpen` + `_meta`.
     Modul 16 fail-soft-Check (PR #180) greift dann produktiv.

3. **Brief 2 angelegt: `docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md`**
   — Multisuchfeld-Spec (drei Modi + UI + Backend-Mehrwahl + SB-
   KIMTool-Point-Bezug). Inhalt:
   - **Tafel-Konflikt-Lösung verankert:** Empfangsmodus-Prinzip
     gilt für Mycel-Schicht (Schicht 1); Extern-Such ist Pilz-
     Schicht-Operation (Schicht 2) und tafel-konform unter vier
     Bedingungen (nur User-Geste, eine Anfrage pro Aufruf, kein
     Persist ohne OptIn, kein User-Profiling).
   - **UI-Empfehlung Variante D** (drei Sektionen gestapelt +
     Klassifikations-Indikator + Auto-Lokal/Mycel + Extern hinter
     Knopf). Vier-Schichten-Lesart visuell sichtbar. Drei
     alternative UI-Varianten (Auto / Dropdown / Tab-Reiter)
     explizit als ablehnungswürdig dokumentiert.
   - **Drei externe Backends parallel** mit Anti-Tracking-
     Disziplin: DuckDuckGo Instant Answer (kein API-Key), Brave
     Search (API-Key User-Pflicht analog 04.B), generischer
     Fetch-Helper (User-konfigurierbar mit einheitlichem Response-
     Schema). Voll-Spec entscheidet Default.
   - **„Spuren"-Begriff** mit drei Lesarten ausgelegt
     (Suchhistorie / Sporen-Spuren / Internet-Spuren). Spec-
     Sitzung klärt mit Klaus per Rückfrage.
   - **„Andocken"-Knopf in Extern-/Hub-Treffer** auf
     `SbkimToolPwa.openAndockTab(url)` (Voraussetzung 5h.1
     Sub (a) Vorab muss gebaut sein).
   - **SB-KIMTool-Point-Integration** (Klaus' Klärung) als
     vierte Sektion zwischen Mycel und Extern empfohlen — Hub
     `status.json` als Discovery-Quelle, eigene Sektion mit
     `[Andocken]`-Knopf, User-Geste-getriggert.
   - **Strikte Tabus verbindlich verankert** (kein Auto-Polling,
     kein User-Profil, kein Persist ohne OptIn, kein Default-Key,
     kein Crawler, kein Cross-Knoten-Forward, kein Tracking-
     Pixel-Render).
   - Pipeline-Antrag: Schritt 5i → 5i.1 (Dual-Modus, Briefe MR/MM
     bereits angelegt) + 5i.2 (Multisuchfeld). 5i.2 setzt 5h.1
     voraus.

**Heilige Tafeln eingehalten:**

- KEIN Modul-Code in `src/modules/` (Plansitzung).
- KEIN Endknoten-Eingriff.
- KEINE Sage-Page-Änderung in `index.html`.
- KEINE CLAUDE.md-Änderung (Pipeline-Antrag bleibt in beiden
  Briefen als § Pipeline-Anpassungs-Antrag stehen; eigene
  Folge-Pflege-Sitzung mit Klaus' OK).
- KEINE neuen Karten in `docs/components/` (Karte 18 bleibt
  unangetastet — die Spec-Sitzung 18 Sub (a) Vorab erweitert sie
  später, nicht diese Plansitzung).
- KEIN `status.json`-/Pie-Update.
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Plansitzung).
- KEINE PII in beiden Briefen.

**Was offen blieb:**

- **Folge-Spec-Sitzung 18 Sub (a) Vorab** (Brief liegt,
  Branch `claude/spec-18-sub-a-vorab` vom `main` aus nach Merge
  dieser PR).
- **Folge-Spec-Sitzung Multisuchfeld** (Brief liegt, Branch
  `claude/spec-suchfeld-multi`; SETZT VORAUS dass 5h.1 läuft).
- **Eigene Folge-Pflege-Sitzung CLAUDE.md** Pipeline-Reihenfolge
  Phase A anpassen (5h → 5h.1 + 5h.2, 5i → 5i.1 + 5i.2) — Klaus'
  explizites OK in dieser Sitzung gegeben, aber als eigene
  schmale Pflege mit eigenem PR (Tafel-Evolutions-Klausel).
- **„Spuren"-Begriffs-Klärung** mit Klaus in der Spec-Sitzung
  Multisuchfeld (Lesart 1/2/3 — Karte 1 Such-Verlauf-Persist mit
  OptIn ist am wahrscheinlichsten).
- **Vier alternative Bau-Sitzungen** (MR + MM Dual-Modus aus
  bisherigen Briefen 5i.1; MR + MM Multisuchfeld aus 5i.2 nach
  Spec-Sitzung Multisuchfeld). Pipeline-Reihenfolge: 5h.1 →
  5h.1-Bau → 5i.1 (parallel, schon Briefe) → Spec-Sitzung
  Multisuchfeld → 5i.2 (MR + MM).

**Nächster sinnvoller Schritt:** Klaus mergt PR dieser Plansitzung,
dann Folge-Spec-Sitzung 18 Sub (a) Vorab (Pipeline-Vorrang). Brief-
Codeblock dafür in der Chat-Antwort dieser Sitzung ausgegeben
(Klaus' Konvention 2026-05-21).

**Übergabeprotokoll:**
`docs/sessions/archiv/2026-05-28_plansitzung-multisuchfeld.md`.

---

### 2026-05-28 · Sichttest + Folge-Pflegen Einladung (in derselben Bau-Sitzung)

**Sitzungs-Rolle:** Iterative Pflege innerhalb der noch offenen
Bau-Sitzung `claude/bau-einladung-site-8fZyj`. Klaus hat in der Nacht
2026-05-28 die Site auf Galaxy Tab S6 + DeX-Chrome gepullt und Befund
für Befund per Chat gemeldet. Statt einer eigenen Folge-Sitzung wurden
alle Pflegen am selben Branch nachgezogen.

**Was inhaltlich geändert wurde** (Details im Übergabeprotokoll):

1. **Sektion 1** Eröffnungs-Satz: „das nichts will" → „das in
   perfekter Symbiose lebt" (HTML + MD, vier Sprachen).
2. **Sektion 3 Pilz-Karten**: drei KI-Bilder von Klaus integriert
   (Hände-mit-Sporen, Premium-Pilz, Synapsen-Pilz) ersetzen die
   prozeduralen WebGL-Mini-Szenen. Pixelgenau via `object-fit: contain`,
   Hover-3D weg, Mouse-getriggerter Feenstaub am Cursor pro Karte.
3. **Sektion 5 Schlüssel**: mehrfach iteriert — B1-Vortex-Hintergrund
   + B2-Schlüssel-Vollansicht via mix-blend-mode (Schwarz transparent),
   Stop-Motion-Rotation verworfen, schwarzes Loch verworfen
   (Notlösung), Maus-Interaktion verworfen. Text mit Haarlinien-
   Outline + verstärktem Schatten.
4. **Sektion 6 Lichtung**: Vignette entfernt (Wald komplett sichtbar),
   Text mit `text-stroke` + verstärkten Shadows. Afterword unter den
   CTA-Buttons heller.
5. **Sektion 5b NEU — Tür-Sequenz**: Pinned-Scroll-Animation 320vh
   mit fünf Phasen (groß rechts zoom → fährt zur Mitte → ruht → Zoom
   auf Lichtspalt → Tür transparent + Flash → Flash sanft auf 0).
   Lichtungs-Foto als Stage-Background schimmert in Phase 4 durch.
6. **Übergang 5b→6**: harter schwarzer Balken (scene-fade-top von 6)
   entfernt — die Tür-Sequenz fadet schon zum Lichtungs-Foto.
7. **DE Mit-Bauer-Sprache**: „Mensch-Mit-Bauer" und „Agent-Mit-Bauer"
   (holprig) ersetzt durch „Menschen, die mitbauen" und „Agenten, die
   mitbauen" (Variante A, gleichwertig). EN/FR/ES unverändert.
   Bug-Fix: `&amp;`-Entity in `s4.eyebrow`.
8. **Übergänge insgesamt**: JS-eingefügte `.scene-fade-top/-bot` für
   sanftere Sektion-Wechsel. Mycel-Opacity-Lerp halbiert.
9. **Kamerafahrten**: Sektion 1/5/6 mit seitlichen Kamerafahrten
   (links/rechts/oben) zur Mitte hin.
10. **Feenstaub-Verstärkung**: Cross-Star-Funken auf allen drei Foto-
    Sektionen + Schlüssel-Sporen zweifarbig.
11. **Drei Lossless-WebP-Foto-Hintergründe** vendoriert (Mycel-Boden,
    Vortex, Lichtung) plus Tür-Bild und B2-Schlüssel und 4 Rotations-
    Frames (im Archiv).

**Sage-Page-Mount der Einladung (Klaus' Anweisung 2026-05-28):**

Ursprünglich als eigene Folge-Pflege-Sitzung geplant, von Klaus zum
Schluss explizit für diese Bau-Sitzung autorisiert (Tafel-Evolutions-
Klausel auf „KEINE Sage-Page-Änderung in `index.html`"). Neue Karte
zwischen Lesematerial- und Andock-Karte: Tür-Bild semi-transparent
Default, bei Hover über 1.8s langsam voll sichtbar (Klaus' Wunsch:
„erst bei längerem draufbleiben"). Mouse-Move spawnt Cross-Star-
Feenstaub am Cursor. Klick → Tür-Öffnungs-Animation → Navigation zu
`docs/einladung/index.html`. Vision-Karte Bauzustand aktualisiert.

**Heilige Tafeln (Stand 2026-05-28):**

- KEIN Modul-Code geändert in `src/modules/` (nur Doku + Einladung).
- KEIN Endknoten-Eingriff.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE Pipeline-Umsortierung Phase A/B/C.
- Sage-Page-Tafel ANGEPASST: Mount der Einladungs-Türschwelle in
  `index.html` durch Klaus' explizite Anweisung autorisiert.

**Verifikations-Status:**

- ✅ Klaus' Browser-Sichttest auf Galaxy Tab S6 erfolgt.
- ✅ Headless-Smoke 9/9 nach jeder Pflege grün.
- ✅ PDF nach DE-Änderungen re-erzeugt (32 Seiten, ~750 KB).
- ✅ Sage-Page-Mount visuell geprüft (Idle + Hover-Screenshots).
- ✅ Klaus' OK auf Sage-Page-Mount (2026-05-28).

**Nächster sinnvoller Schritt:** PR #188 aus Draft auf Ready for
Review setzen; Klaus mergt nach Bedarf. Sitzung damit abschluss-bereit.

**Übergabeprotokoll erweitert:**
`docs/sessions/archiv/2026-05-27_bau-einladung-site.md` § „Folge-
Pflegen 2026-05-28".

---

### 2026-05-27 · Bau-Sitzung Einladungs-Site (Mycel-Vision)

**Sitzungs-Rolle:** Bau-Sitzung Einladungs-Site (gestalterischer
Bau plus schlanke Tafel-Pflege; kein Modul-Code, kein Endknoten-
Eingriff, keine Sage-Page-Änderung in `index.html`, keine
Pipeline-Umsortierung). Branch `claude/bau-einladung-site-8fZyj`.

**Anlass:** Plansitzung 2026-05-27 (siehe Eintrag unten) hat das
Drei-Format-Einladungs-Artefakt + Karte + CLAUDE.md-Pflege als
Bau-Auftrag beschrieben (`docs/sessions/BRIEF_BAU_EINLADUNG_SITE.md`).

**Was getan:**

1. **Recherche-Phase** — `docs/einladung/recherche.md` mit zehn
   Vorbild-Pattern-Quellen (Lusion, Active Theory, Bruno Simon,
   Apple Vision Pro, Stripe-Mesh-Gradient, Codrops Refraction /
   GPGPU / Cells-Collide / Variable Fonts 2026, Omega Clearspace,
   Lusion-Scroll-Sync). Pro übernommenes Pattern Quelle + Sektion-
   Zuordnung benannt. Tech-Stack-Entscheidung pro Pattern
   tabellarisch.
2. **Artefakt 1 `docs/einladung/index.html`** — Single-File-PWA-Stil
   mit sechs Sektionen, lokal vendoriertem three.js@0.160 (importmap)
   + GSAP@3.12 + ScrollTrigger + Fraunces-Variable + Inter-Variable
   (alles unter `docs/einladung/vendor/`). Sechs Welten:
   (1) Eröffnung — Voll-WebGL-Partikel-Wolke 50k/15k mit Vertex-Drift-
   Shader, (2) Mycel — InstancedBufferAttribute-Punktwolke +
   LineSegments-Hyphen, (3) Pilz — drei Mini-WebGL-Canvases mit
   eigenen ShaderMaterials (matt-organisch / metall-lamelliert /
   iridescent-kristallin), (4) Mit-Bauer — Print-Magazin DOM/CSS +
   SVG-Sternenfeld 220 Punkte ohne Zentrum, (5) Observatorium —
   Schlüssel-Mesh mit custom Iridescence-Refraction-Fragment-Shader
   + Tür-Backdrop-Shader, (6) Lichtung — Stripe-style Mesh-Gradient
   mit vier wandernden Blob-Mittelpunkten. Mehrsprachig DE/EN/FR/ES
   (Browser-Sprache initial), Sprachenwahl + Audio-Mute fixed in der
   Ecke, `prefers-reduced-motion`-Respekt.
3. **Artefakt 2 `docs/einladung/einladung.md`** — kanonische Inhalts-
   Fassung in vier Sprachen, identische Anker-IDs wie HTML-Site,
   Anhang mit Modul-Referenzen für KI-Agenten beim Andocken.
4. **Artefakt 3 `docs/einladung/einladung.pdf`** — 34-Seiten
   Print-Magazin-Druckfassung (770 KB), erzeugt via `_pdf.mjs`
   (Markdown → marked → HTML + `print.css` → Headless-Chromium
   `page.pdf()`). Marginalia-Spalte mit Schichten-Numeralen
   (·, I, II, III, IV, ✦, ◇), justifizierter Fließtext, Sprach-
   Trenner-Seiten mit Blockquote-Lead + Datum-Block, Colophon-
   Schluss-Seite. **Reproduzierbar** via `_pdf.mjs`-Skript.
5. **Artefakt 4 `docs/components/_vision_einladung.md`** — Spec-Anker
   analog `_mycel_hub.md` / `_starter_bundle.md`, mit Vokabular-Block,
   sechs-Sektionen-Plan, Bauzustand-Tabelle, Vendor-Tabelle,
   Reproduzierbarkeits-Bash-Block, Querverweisen.
6. **Artefakt 5 CLAUDE.md-Pflege** drei Edits:
   - § „Was dieses Repo ist" → neuer Unter-Abschnitt „Vier-Schichten-
     Lesart (Pflege 2026-05-27)" mit Mycel / Pilz / Mit-Bauer /
     Observatorium-Definitionen, Multi-KI-Klarstellung,
     Identitäts-Frage offen.
   - § Pipeline-Reihenfolge → neue **Phase D** zweigeteilt (D.1
     Agent-Bootstrap-Mechanik-Spec, D.2 Pilz-Schicht-Wirtschafts-
     Spec) + Vision-Anker-Vorbereitungs-Block; nicht-blockierend für
     A/B/C; D.2 bewusst offen bis reale Pilz-Bauten existieren.
   - § Die zehn Module → neuer Vision-Anker-Karten-Block (Einladung +
     Starter-Bundle + Externer Mycel-Hub) vor dem Modul-Erläuterungs-
     Block.
7. **Headless-Smoke-Test** `docs/einladung/_smoke.mjs` — startet
   lokalen HTTP-Server, lädt `index.html` via Headless-Chromium, prüft
   sechs Sektionen, drei Fruchtkörper-Canvases, Grad-Canvas, 220
   Sternenfeld-Punkte, Sprach-Wechsel DE/EN/FR, Null-Console-Fehler.
   **Ergebnis: 9/9 grün.**
8. **README** `docs/einladung/README.md` mit Datei-Tabelle, Reproduzier-
   Befehlen, Privacy-Klausel.
9. **`.gitignore`** ergänzt um `docs/einladung/_print_render.html`
   (ephemere Render-Vorlage).

**Recherche-Quellen** (siehe `docs/einladung/recherche.md` für
Details + Pattern-Übernahme-Hinweis pro Sektion): Lusion-Studio
(Awwwards Site of the Month) + Lusion-Scroll-Sync-Demo · Active
Theory · Bruno Simon (Tutorial-Beschreibung; Direkt-Fetch lieferte
403 in Sandbox) · Apple Vision Pro Produkt-Page · Stripe-Mesh-
Gradient · Codrops Multiside-Refraction / Warping-Text-Glass-Torus /
GPGPU-Dreamy-Particles / Cells-Collide-Organic-Particles · Omega
Clearspace (WebGPU Showcase) · Variable-Font-Typografie-Trends 2026
(Creative Boom / Kittl).

**Pflicht-Klauseln eingehalten (Klaus' Schärfung 2026-05-27):**

- ✅ **Anti-08/15** — keine Bootstrap-Defaults, keine Tailwind-
  Grundlayouts, keine generischen Stripe-Hero-Clones (Sektion 6 ist
  warm-ocker-moos statt Stripe-blau-violett), keine Fade-In-Only-
  Animationen (Fade-In nur als Akzent NEBEN den WebGL-Kamera-Fahrten),
  keine Stockfotos, keine Emoji-Dekoration (alle Symbole als SVG-
  Punkte / Marginalia-Numeralen), Variable-Font-Pflicht erfüllt.
- ✅ **WebGL-Untergrenze 3 von 6 Sektionen** — überschritten:
  Sektionen 1, 2, 5, 6 (vier echte WebGL-Sektionen) plus drei
  eingebettete WebGL-Mini-Canvases in Sektion 3 = sieben WebGL-
  Schichten gesamt. Custom Fragment-Shader (Iridescence, Refraction-
  Approximation, Mesh-Gradient, Sporen-Halo), GPU-instanced Punkte,
  LineSegments. Sektion 4 ist bewusst DOM/CSS auf Print-Magazin-
  Niveau (Variable-Font-opsz + dreispaltige Komposition + SVG-
  Sternenfeld).
- ✅ **Sechs Welten, nicht ein Pattern sechsmal** — jede Sektion
  eigene visuelle Sprache (organischer Mycel-Boden / verzweigtes
  Hyphen-Geflecht / drei ungleiche Fruchtkörper-Materialien /
  Print-Magazin-Komposition / Kristall-Schlüssel mit Tür-Spalt /
  warmer Mesh-Gradient-Lichtung). Vorbild Apple Vision Pro Produkt-
  Page eingehalten.
- ✅ **Niveau-Bezug zum Repo** — Sage-Page-Niveau (Schwarzes Loch,
  Galaxien, Sonne) getoppt; plumpe Karten der Sage-Page sind nicht
  Vorbild geworden.

**Heilige Tafeln eingehalten:**

- KEIN Modul-Code in `src/modules/`.
- KEIN Endknoten-Eingriff (MR / MM unangetastet).
- KEINE Sage-Page-Änderung in `index.html` (Sage-Page-Mount der
  Einladung ist explizit als Folge-Pflege-Sitzung markiert).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- KEINE Pipeline-Umsortierung Phase A/B/C — Phase D wird ADDITIV
  angehängt, nicht-blockierend.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Einladung ist kein Sicherheits-
  Modul-Update).
- KEINE PII (keine E-Mail-Adressen, kein Klar-Name in der Einladung).
- KEIN externer Tracker / Analytics-Snippet / Auto-Play-Audio.
- KEIN Crawler / Pulsation / Eigenanfragen ins offene Netz.

**Vendor-Footprint** (`docs/einladung/vendor/`, alle lokal —
keine CDN-Abhängigkeit zur Laufzeit, kein Tracker):

- `three.module.min.js` ~670 KB (MIT)
- `gsap.min.js` ~72 KB
- `ScrollTrigger.min.js` ~43 KB
- `fonts/fraunces-full.woff2` ~120 KB (SIL OFL)
- `fonts/fraunces-full-italic.woff2` ~150 KB
- `fonts/inter-wght.woff2` ~48 KB

Total ~1.1 MB für vier-Sprach-Drei-Format-Einladung mit sieben
WebGL-Szenen + Variable-Font-Typografie.

**Was offen blieb:**

- **Klaus' Browser-Sichttest** — die Einladungs-Site lebt nur dann
  „echt", wenn Klaus sie auf Galaxy-Tab-S6 (DeX und Tablet-Modus)
  geöffnet hat. Headless-Smoke 9/9 grün ist Logik-Bestätigung, nicht
  Sicht-Bestätigung. Wartet auf Klaus.
- **Sage-Page-Mount** der Einladung — eigene Folge-Pflege-Sitzung,
  nicht-blockierend für Phase A/B/C. Die Einladung lebt zunächst
  eigenständig unter `/docs/einladung/`. Brief-Codeblock kann nach
  Klaus' Sichttest angelegt werden.
- **Mycel-Hub-Mount** — eigene Folge-Pflege-Sitzung NACH Phase B
  Schritt 9 (Externer Mycel-Hub Bau).
- **Sprach-Erweiterung** über DE/EN/FR/ES hinaus (IT / PL / TR / ZH /
  JA / …) — eigene Sprach-Pflege-Sitzungen pro Sprache, wenn Bedarf
  entsteht. Markdown ist Quelle der Wahrheit; HTML-i18n-Strings + PDF
  re-generieren.

**Nächster sinnvoller Schritt:** Klaus' Browser-Sichttest auf Galaxy
Tab S6 (DeX + Tablet). Erst danach lohnt eine Folge-Pflege-Sitzung
(Sage-Page-Mount).

**Übergabeprotokoll:**
`docs/sessions/archiv/2026-05-27_bau-einladung-site.md`.

---

### 2026-05-27 · Plansitzung Mycel-Vision-Erweiterung (Einladung)

**Sitzungs-Rolle:** Plansitzung (Brainstorming + Strategie-
Entscheidung, kein Modul-Code, kein Tafel-Bau, kein
`status.json`-Update). Branch
`claude/mycel-distribution-strategy-65F5G`.

**Anlass:** Klaus hat die Mycel-Vision in mehreren Etappen erweitert
und um drei substantielle Aussagen ergänzt — Vier-Schichten-Lesart
mit **Observatorium** als schlüssel-geschütztem Forschungs-Ort,
Multi-KI-Modell-Klarstellung (Anthropic / Gemini / OpenAI / EU-
Modelle alle gleichwertig im Mycel), Menschen-Begeisterungs-Schicht
als Pflicht (mehrsprachig + optisch lesbar). Plus eine KI-Agent-
Mit-Bauer-These mit fünf Reife-Fragen und Klaus' Mut-Klausel zur
Gestaltung der Einladungs-Site.

**Begriffs-Entscheidung:** Klaus hat in zwei Iterationen
„Einladung" gewählt (vorher abgelehnt: Manifest / Charta /
Sporenkarte / Horizont; angeboten als „nicht festlegend":
Lichtung / Aussaat / Einladung). Begründung: schlicht, ehrlich,
ohne Programm-Anspruch.

**Was getan:**

- Plan-File ausgearbeitet (außerhalb Repo,
  `~/.claude/plans/du-bist-eine-plansitzung-peppy-book.md`) mit
  Vier-Schichten-Lesart, KI-Agent-Ebene mit fünf Reife-Fragen,
  Verhältnis zur bestehenden Pipeline (Phase A/B/C unverändert,
  Phase D neu nicht-blockierend), Gestaltungs-Auftrag mit
  Tech-Stack + sechs Sektionen + Recherche-Pflicht.
- Brief `docs/sessions/BRIEF_BAU_EINLADUNG_SITE.md` geschrieben.
  Fünf Artefakte definiert: `docs/einladung/index.html` (3D-
  Einladungs-Site, six Sektionen, three.js + GSAP + Custom-Shader +
  Lottie + optionaler Ambient-Sound, mobile-tauglich, reduced-
  motion-Respekt, mehrsprachig DE/EN/FR/ES Start),
  `docs/einladung/einladung.md` (Maschinen-lesbar),
  `docs/einladung/einladung.pdf` (Print-Layout),
  `docs/components/_vision_einladung.md` (schlanker Spec-Anker),
  CLAUDE.md-Pflege drei Edits (§ „Was dieses Repo ist" mit
  Vier-Schichten-Sicht, § Pipeline neue Phase D zweigeteilt
  D.1 Agent-Bootstrap-Mechanik / D.2 Pilz-Schicht-Wirtschaft,
  § Modul-Tabelle Vision-Anker-Block).
- Brief enthält Pflicht-Recherche-Phase mit zehn empfohlenen
  Vorbild-Sites (awwwards / Bruno Simon / Lusion / Active Theory /
  Spline / Stripe / Linear / Apple Product Pages / Resn).
- Übergabeprotokoll
  `docs/sessions/archiv/2026-05-27_plansitzung-mycel-vision-
  einladung.md`.

**Heilige Tafeln eingehalten:**

- KEIN Modul-Code in `src/modules/` (Plansitzung).
- KEIN Endknoten-Eingriff.
- KEINE Sage-Page-Änderung in `index.html`.
- KEINE CLAUDE.md-Änderung in dieser Sitzung (Tafel-Pflege
  passiert in der Folge-Bau-Sitzung als Artefakt 5).
- KEINE neuen Karten in `docs/components/` (Karte
  `_vision_einladung.md` wird in der Folge-Sitzung angelegt).
- KEINE Pipeline-Umsortierung (Phase A/B/C unverändert).
- KEIN `status.json`-/Pie-Update.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.

**Was offen blieb:**

- **Folge-Sitzung Bau-Einladungs-Site** (Brief liegt, Branch
  `claude/bau-einladung-site` vom `main` aus nach Merge).
- **PDF-Erzeugungs-Pfad** wird in der Bau-Sitzung gewählt
  (pandoc vs. Headless-Chrome vs. manueller Print); falls alle
  scheitern, ende mit Artefakt 3 offen markiert.
- **Sage-Page-Mount der Einladung** ist explizit aus dem Scope
  ausgenommen — eigene Sage-Page-Pflege-Sitzung NACH der Bau-
  Sitzung; die Einladungs-Site lebt zunächst eigenständig unter
  `/einladung/`.
- **Mycel-Hub-Einbau der Einladung** — eigene Folge-Pflege-
  Sitzung nach Phase B Schritt 9 (Externer Mycel-Hub Bau).

**Nächster sinnvoller Schritt:** Folge-Sitzung Bau-Einladungs-Site
mit Brief `docs/sessions/BRIEF_BAU_EINLADUNG_SITE.md`.

**Übergabeprotokoll:**
`docs/sessions/archiv/2026-05-27_plansitzung-mycel-vision-einladung.md`.

### 2026-05-26 · Pflege 16 Modal-Local-Time (Sub-(e)-Folge-Pflege 3/3)

**Sitzungs-Rolle:** Pflege-Sitzung Render-Kosmetik. Branch
`claude/pflege-16-modal-local-time`. Dritte und letzte der drei
Sage-Sub-(e)-Folge-Pflegen aus dem Endknoten-Sichttest-Bilanz vom
2026-05-26.

**Anlass:** Klaus' Befund DeX-Chrome auf Galaxy Tab S6 in MESZ
(UTC+2):

> Datum/Uhrzeit ist nicht aktuell, ich vermute nicht
> Mitteleuropäische Zeit, eher Amerikan.

Das SBKIM-Siegel-Modal zeigte „Bezeugt seit 2026-05-26, 19:10 Uhr"
statt der lokalen Zeit 21:10. Ursache: `renderModalContents()` in
Modul 16 hat den `dateLine.textContent` per
`new Date(snap.certifiedAt).toISOString().slice(0, 10)` +
`iso.slice(11, 16)` gebaut — UTC-ISO-Substrings.

**Fix in `src/modules/16_siegel.js`** Zeilen ~872–885 (kleiner
Eingriff, additiv):

UTC-ISO-Slice durch lokale Date-Methoden ersetzt — `date.getFullYear()`,
`String(date.getMonth() + 1).padStart(2, "0")`, `getDate()`,
`getHours()`, `getMinutes()` mit `padStart(2, "0")`. Format-
Konvention `YYYY-MM-DD, HH:MM Uhr` bleibt (ISO-Datum + lokale
Stunden/Minuten — kein Optik-Wechsel auf `toLocaleString`-Style,
weil Klaus' Doku-Pattern überall ISO-Datum verwendet). Fail-soft-
Fallback: bei `NaN`-Date wird der Roh-`certifiedAt` direkt
angezeigt.

`_meta.certifiedAt` bleibt UTC-ISO (Spec-Vertrag aus § Persistenz
unverändert — nur die Render-Schicht konvertiert).

**Was getan:**

- `src/modules/16_siegel.js` Zeile 872–885 minimal-patch.
- Karte 16 § Sub (c) Modal-Body Punkt 1 um Anzeige-Konvention-
  Block erweitert (lokale Date-Methoden + Begründung).
- Karte 16 § Bauzustand neue Zeile „Pflege Modal-Local-Time".
- INTERFACES.md § 1 Modul 16 Geprüft-Zeile + § 10
  Änderungsprotokoll-Eintrag.
- Headless-Smoke `smoke_bau16_sub_e_bronze.mjs` um Probe 16
  erweitert (16/16 grün).
- Regression `smoke_bau15b` 31/31 + `smoke_bau17` 36/36 grün.
- node --check Modul 16 grün.
- status.json Modul 16 unverändert (`stub`); Pie nicht
  regeneriert.

**Heilige Tafeln eingehalten:**

- KEIN funktionaler Vertrags-Eingriff (Public Surface unverändert;
  `_meta.certifiedAt`-Format bleibt UTC-ISO).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Schicht-Pflege, kein
  Sicherheits-Modul-Update).
- KEIN Endknoten-Eingriff.
- KEINE Tafel-Umsortierung CLAUDE.md.

**Alle drei Sage-Sub-(e)-Folge-Pflegen abgeschlossen:**

| # | Pflege | PR | Status |
|---|---|---|---|
| 1 | Modul 17 Bronze/Gold-Render | #185 | ✅ gemerged |
| 2 | Endknoten-Modul-05-Update | extern (MR + MM) | offen — eigene Sitzungen |
| 3 | Modul 16 Modal-Local-Time | dieser PR | ✅ in Arbeit |

**Was offen blieb:**

- **Endknoten-Sammel-Update-PR pro MR + MM**: nach Sage-Pflegen 1+3
  + Endknoten-Modul-05-Update (Pflege 2) alle Updates in einem
  Endknoten-PR pro Repo nachziehen.
- **Klaus' Browser-Sichttest** Modal-Datum lokal in DeX-Chrome
  nach Endknoten-Update + Modal-Click.

**Nächster sinnvoller Schritt:** Pflege Endknoten-Modul-05-Update
(Pflege 2/3) — zwei externe Bau-Sitzungen MR + MM. Brief liegt:
`BRIEF_PFLEGE_ENDKNOTEN_MODUL_05_UPDATE.md`. Codeblock für MR
wurde bereits im Sage-Chat ausgegeben.

**Übergabeprotokoll:** `docs/sessions/archiv/2026-05-26_pflege-16-modal-local-time.md`.

---

### 2026-05-26 · Pflege Modul 17 Widget Bronze/Gold-Render

**Sitzungs-Rolle:** Pflege-Sitzung Render-Schicht. Branch
`claude/pflege-17-widget-bronze-gold-render`. Folge-Pflege zu Sub-(e)-
Sichttest-Bilanz vom selben Tag (Befund 1).

**Anlass:** Sichtbarer SIEGEL-Slot im Floating-Widget rendert
stufen-unabhängig als Gold-Medaillon mit ★ — Klaus visuell kein
Unterschied zwischen MR (pre-Handshake, sollte Bronze sein) und MM
(post-Handshake, ist Gold). Modul 16 setzt `data-stufe="bronze"`/
`"gold"` korrekt am unsichtbaren `#sbkim-siegel-badge`-Proxy-Span im
Widget-Inneren (Spec-konform), aber der sichtbare Slot-Button daneben
hat keine Stufen-Logik. Architektur-Pfad (ii) aus Brief gewählt:
Modul 17 nutzt lookup auf `SbkimSiegel._meta.siegelStufe` (Modul-16-
Getter aus Bau 16 Sub e) im `mountSiegelSlot()`-Aufruf — robust gegen
Event-Reihenfolge (Modul 16 init vor Modul 17 dispatch).

**Was geändert wurde:**

- **`src/modules/17_floating_widget.js`** additiv: drei neue
  Konstanten (`SIEGEL_STUFE_BRONZE`/`SIEGEL_STUFE_GOLD`/
  `SIEGEL_STUFENWECHSEL_MS=600`), drei neue Helper (`getSiegelStufe()`
  fail-soft Default `"bronze"` / `applySiegelStufeToSlot(stufe)` /
  `playSiegelStufenwechselAnimation()`), `mountSiegelSlot()` +
  `buildWidget()`-Init-Pfad rufen `applySiegelStufeToSlot(getSiegelStufe())`
  nach Slot-Mount, `onHandshake()` schaltet bei `outcome:"established"`
  + `siegelMounted===true` + `siegelStufeRendered!=="gold"` auf Gold
  + 600 ms `.sbkim-widget-siegel-stufenwechsel`-Klasse (idempotent —
  zweiter Handshake re-animiert nicht). `_meta` um Getter
  `siegelStufeRendered` (string\|null) erweitert.
- **`buildCss()`** erweitert um drei Regeln + `@keyframes
  sbkim-widget-siegel-stufenwechsel-gold`: Bronze-Filter
  `saturate(0.6) brightness(0.85)` am Slot::before + `.sbkim-widget-
  siegel-glyph`, Bronze-Hover-glow `rgba(140,110,47,0.55)`, Gold =
  Default-Render kein Override, Animation analog index.html `siegel-
  stufenwechsel-gold`.
- **Panel 17** in `tests/manual_check.html` um Test 13 (Initial-
  Bronze-Attribut + _meta-Spiegelung) + Test 14 (sbkim:handshake
  established → Gold + Animations-Klasse + 700-ms-Re-Check)
  erweitert; Header-Status auf „Code-Stub + Pflege Sub-(e)-Render
  2026-05-26".
- **Headless-Smoke** `tests/smoke_bau17_floating_widget.mjs` um vier
  neue Proben 32–35 erweitert: 36/36 grün.
- **Karte 17** § Bauzustand neue Zeile „Pflege Sub-(e)-Visueller
  Slot-Render".
- **INTERFACES.md** § 1 Modul 17 Bietet-Block + Vier-Slot-Layout +
  Geprüft-Zeile erweitert; § 10 Änderungsprotokoll neue Zeile.

**Was geprüft:**

- node --check `17_floating_widget.js` + alle 13 Inline-`<script>`-
  Blöcke in `tests/manual_check.html` grün.
- smoke_bau17_floating_widget.mjs 36/36 grün.
- smoke_bau15b_membran.mjs 31/31 grün (Regression).
- smoke_bau16_sub_e_bronze.mjs 15/15 grün (Regression).

**Heilige Tafeln eingehalten:**

- KEIN Modul-16-Eingriff (Modul 16 setzt `data-stufe` korrekt am
  Proxy-Span — Spec-Konformität bestätigt).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN Endknoten-Eingriff (eigene Folge-PRs pro Endknoten-Repo).
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Render-Schicht-Pflege).
- KEINE Tafel-Umsortierung CLAUDE.md.
- KEINE Sage-Page-Änderung (`index.html` unangetastet).

**Was offen:**

- Klaus' Sichttest Panel 17 Tests 13 + 14 auf der Sage-Page.
- Endknoten-Re-Migration: Mein-Rezeptbuch + Mein-Mixarium müssen
  `sbkim/17_floating_widget.js` auf den neuen Sage-Commit nachziehen
  — eigene Folge-PRs pro Endknoten-Repo.
- Visueller Vergleich: MR (Bronze, kein Verkehr) vs. MM (Gold,
  post-handshake) sollte sichtbar unterscheidbar werden.

**Nächster sinnvoller Schritt:** Merge PR, dann Endknoten-Update-
Sitzungen (Mein-Rezeptbuch + Mein-Mixarium) auf den neuen Sage-
Commit ziehen. Optional kombinieren mit Pflege Modul-05-Update
(zweite Folge-Pflege aus dem Sichttest-Befund 2) — ein gemeinsamer
Endknoten-Update-PR pro Repo.

`status.json` Modul 17 unverändert (Score bleibt `"stub"`,
additive Render-Pflege); `python3 scripts/update_puls_pie.py`
aufgerufen (Pie-Verteilung unverändert).

---

### 2026-05-26 · Endknoten-Sichttest Cross-Knoten Sub (e) + drei Folge-Briefe

**Sitzungs-Rolle:** Pflege-Sitzung Sichttest-Bilanz. Branch
`claude/sichttest-sub-e-endknoten-bilanz`. Pipeline-Phase A
Schritt 5e abgeschlossen.

**Anlass:** Nach Merge MR PR #249 + MM PR #58 (Re-Aktivierung Modul
15+16 in beiden Endknoten) + Folge-Fix-PRs für badgeSelector-Konfig
(Sage-Default `.lamps` Endknoten-untauglich → Fix `#sbkim-siegel-
badge` Widget-Proxy) hat Klaus den vollen Sub-(e)-Sichttest in beiden
Endknoten gefahren. Live-Cross-Knoten-Handshake bewiesen.

**Vier Sichttest-Hauptpunkte (DeX-Chrome auf Galaxy Tab S6):**

| Punkt | MR | MM |
|---|---|---|
| 1 Initial-Bronze visuell + Modal-Hinweis + Aspekt-4-pending | ✅ | ✅ |
| 2 Cross-Knoten-Handshake via Eruda (BC-Bridge) | — (passiver Empfänger) | ✅ `outcome:"established", score:0.9544` |
| 3 Bronze→Gold via manuellem Eruda-Dispatch + Modal-Refresh | ✅ `stufe:gold` | ✅ `stufe:gold` |
| 4 RAM-only-Persistenz (Tab-Reload → Bronze) | (nicht erneut getestet) | (nicht erneut getestet) |

**Spec-Konforme Beobachtungen:**

- Modul 16 isCertified=true in beiden PWAs (alle sieben Pflicht-
  Module live).
- Modal-Render korrekt: Bronze-Hinweis-Block + `[Andocken]`-Knopf
  + Modul-18-Info-Notiz in Bronze; Hinweis-Block weg + Aspekt 4
  datiert in Gold.
- Aspekt 4 „Mycel-Verbindung etabliert (erster Handshake)" zeigt
  „pending" in Bronze, Datum in Gold (per Spec).
- VERKEHR-Slot in MM-Widget zeigt `handshake outgoing established`-
  Event live (Widget-Event-Bus aus Bau 17 funktioniert).

**Drei eigenständige Folge-Befunde** (eigene Pflege-Sitzungen
geplant, Briefe in dieser Sitzung mit angelegt):

1. **Widget-SIEGEL-Slot stufen-unabhängig** — Modul 17 rendert Slot-
   Button immer als Gold-Medaillon mit ★. Modul 16's `data-stufe`-
   Attribut wirkt nur am unsichtbaren Widget-Proxy-Span im Inneren,
   nicht am sichtbaren Button. Visueller Bronze/Gold-Unterschied
   im Slot fehlt. Brief: `BRIEF_PFLEGE_17_WIDGET_BRONZE_GOLD_RENDER.md`.

2. **Endknoten-`sbkim/05_anastomose-v2.js` ist prä-Bau-17** — dispatcht
   KEIN `sbkim:handshake`-window-Event automatisch beim erfolgreichen
   Cross-Knoten-Handshake. Bronze→Gold-Wechsel nur via manuellem
   Eruda-Dispatch testbar. Fix: Endknoten-Modul-05 auf Sage-main-
   Stand updaten (analog Modul 15/16/17/sw — eigene PR pro Endknoten).
   Brief: `BRIEF_PFLEGE_ENDKNOTEN_MODUL_05_UPDATE.md`.

3. **Modal-„Bezeugt seit … Uhr"-Datum zeigt UTC** statt MESZ-lokal.
   Modul 16 `certifiedAt` wird in `mountSiegelModal()` ohne
   `toLocaleString("de-DE")`-Konvertierung gerendert. Klaus' Befund:
   „Datum/Uhrzeit ist nicht aktuell, ich vermute nicht
   Mitteleuropäische Zeit, eher Amerikan." Brief:
   `BRIEF_PFLEGE_16_MODAL_LOCAL_TIME.md`.

**Was getan:**

- Karte 16 § Bauzustand Zeile „In Endknoten eingebaut" gefüllt mit
  vollem Sichttest-Bericht + drei Folge-Befunde.
- INTERFACES.md § 1 Modul 16 Geprüft-Zeile + § 10 Änderungsprotokoll
  um Endknoten-Sichttest-Eintrag erweitert.
- status.json Modul 16 `siegel`-Text um Cross-Knoten-Sichttest-Befund
  erweitert (Score bleibt `"stub"` — Knöpfe 1–8 + Folge-Befunde offen).
- Drei Folge-Briefe in `docs/sessions/` angelegt.
- PULS.md Schnellüberblick Modul-16-Zeile aktualisiert + dieser
  Sitzungs-Eintrag oben.
- Übergabeprotokoll.

**Heilige Tafeln eingehalten:**

- KEIN Modul-Code-Eingriff in Sage (Sichttest-Bilanz ist Doku-
  Pflege, Folge-Pflegen kommen in eigenen PRs).
- KEIN Endknoten-Eingriff (MR + MM Re-Aktivierung lief in eigenen
  Sitzungen + PRs).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE Tafel-Umsortierung CLAUDE.md.
- KEIN neuer ZERTIFIKAT_ASPEKTE-Eintrag (Sichttest-Bilanz ist
  keine Sicherheits-Modul-Pflege).

**Nächste Schritte (priorisiert):**

1. **Pflege 17 Widget-SIEGEL-Slot Bronze/Gold-Render** (Sage-Bau-
   Sitzung, Modul 17 erweitern um Stufen-Listener + CSS-Anpassung
   des sichtbaren Slot-Buttons).
2. **Pflege Endknoten-Modul-05 Update** (zwei externe Bau-Sitzungen
   pro MR + MM, Volldatei-Replace aus Sage-main).
3. **Pflege 16 Modal lokale Zeit** (kleine Sage-Pflege, ein
   `toLocaleString`-Aufruf in `mountSiegelModal()`).
4. Optional: Sichttest Bau-16-Basis Knöpfe 1–8 nachholen.

**Übergabeprotokoll:** `docs/sessions/archiv/2026-05-26_endknoten-sichttest-cross-knoten-sub-e.md`.

---

### 2026-05-26 · Sichttest 16 Sub (e) grün (4/4)

**Sitzungs-Rolle:** Pflege-Sitzung Sichttest-Nachzug. Branch
`claude/sichttest-16-sub-e-v25wR`. Pipeline-Phase A Schritt 5g
(Folge zu Bau 16 Sub e aus PR #180).

**Anlass:** Klaus hat unmittelbar nach Merge von PR #180 die vier
neuen Panel-16-Knöpfe 9–12 auf seinem Galaxy Tab S6 (DeX-Chrome,
Termux `python3 -m http.server 8000` nach Hard-Reload) live
durchgeklickt. Alle vier grün. Diese Pflege-Sitzung zieht den Befund
in Karte 16 + INTERFACES.md + status.json + PULS nach.

**Sichttest-Befunde (4/4 grün):**

| Test | Ergebnis | Status-Chip |
|---|---|---|
| 9 Bronze-Initial | `badge_data_stufe:"bronze"`, `aria_label:"SBKIM-Siegel · Mycel suchend"`, `title:null` (Doppel-Tooltip-Klausel Pflege 17), `mycel_connected:false`, `mycel_connected_at:null`, `siegel_stufe_getter:"bronze"` | „Sub (e) Bronze-Initial OK" |
| 10 Bronze→Gold via synthetischem Handshake (zweimal idempotent grün dank `_resetMycelConnectedForTest`) | `stufe_vor:"bronze"` → `stufe_nach:"gold"`, `aria_label_nach:"SBKIM-Siegel · Mycel verbunden"`, `mycel_connected_nach:true`, `mycel_connected_at_nach:"2026-05-26T16:27:22.973Z"`, `klasse_stufenwechsel_gold:true` | „Sub (e) Bronze→Gold OK" |
| 11 Idempotenz (zweiter Handshake) | `erste_welle === zweite_welle === "2026-05-26T16:27:56.565Z"`, `datum_unveraendert:true`, `klasse_nach_zweitem_dispatch:false`, `stufe_nach_zweitem_dispatch:"gold"` | „Idempotent OK" |
| 12 Bronze-Klick öffnet Modal | `modal_offen:true`, `hinweis_block_im_dom:true`, `hinweis_block_sichtbar:true`, `andock_button_im_modal:true`, `aspekt_4_pending_marker:true`, `letzter_aspekt_text_kopf:"pending· 16· Mycel-Verbindung etabliert (erster Handshake)…"`, `aspekte_anzahl:4` | „Bronze-Klick OK" |

**Was getan:**

- **Karte 16 § Bauzustand:** „Sichttest Sub (e) — folgt"-Zeile durch
  volle 4/4-grün-Sichttest-Zeile mit allen Knopf-Outputs ersetzt.
- **INTERFACES.md § 1 Modul 16 Geprüft-Zeile** um vierten Eintrag
  „2026-05-26 (Sichttest Bau 16 Sub (e) — Klaus, DeX-Chrome auf
  Galaxy Tab S6: Panel 16 Knöpfe 9–12 4/4 grün)" erweitert.
- **INTERFACES.md § 10 Änderungsprotokoll** neue Tabellen-Zeile
  „Sichttest 16 Sub (e) grün" mit vollem Bericht.
- **`status.json` Modul 16** `siegel`-Text um Sub-(e)-Sichttest-Befund
  erweitert; **Score BLEIBT `"stub"`** — Sub-(e)-Sichttest deckt
  nur Knöpfe 9–12 ab, Knöpfe 1–8 (Bau-16-Basis) bleiben ungeprüft
  (eigener späterer Sichttest-Nachzug nötig, bevor Score auf
  `"fertig"` wechseln kann).
- **`python3 scripts/update_puls_pie.py`** aufgerufen — Pie-
  Verteilung unverändert, weil Score-Wechsel nicht stattfindet.
- **PULS.md** § Schnellüberblick Modul-16-Zeile aktualisiert (Spec +
  Code + Manueller Sichttest); dieser Sitzungs-Eintrag oben in
  § Sitzungs-Einträge.

**Heilige Tafeln dieser Sitzung eingehalten:**

- KEIN Modul-Code-Eingriff in `src/modules/16_siegel.js`
  (Sichttest-Pflege ist reine Doku).
- KEIN Endknoten-Eingriff.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE Tafel-Umsortierung CLAUDE.md.
- KEIN „Sicherheits-Module pflegen Aspekte"-Aspekt (CLAUDE.md
  § Pflicht-Konvention gilt nicht — diese Pflege ist Sichttest-
  Nachzug, kein neues Sicherheits-Modul / keine Sub-Funktion).

**Was offen blieb:**

- **Sichttest Bau-16-Basis (Knöpfe 1–8)** weiterhin ungeprüft —
  eigener Sichttest-Nachzug nötig (Setup + Test 1 PFLICHT_MODULE-
  Spec + Test 2 Snapshot-Schema + Test 3 Badge im DOM + Modal +
  Test 4 Modal-Render + Test 5 repoUrl-Auto-Erkennung + Test 6
  First-Boot-Flag + Test 7/8 Hinweis-Knöpfe). Erst wenn Voll-
  Sichttest grün ist, kann Modul 16 Score auf `"fertig"`
  wechseln (analog Konvention 04.B/04.C).
- **Endknoten-Re-Aktivierung Modul 15+16+04.C** in Mein-Rezeptbuch
  + Mein-Mixarium (Pipeline-Phase A Schritt 5e). Setzt aktuellen
  Stand voraus — Sub (e) Sichttest grün stellt sicher, dass die
  Endknoten beim ersten Cross-Knoten-Handshake live Bronze→Gold
  wechseln werden.

**Nächster sinnvoller Schritt:** Endknoten-Re-Aktivierung Mein-
Rezeptbuch + Mein-Mixarium (Pipeline-Schritt 5e, eigene Folge-
Sitzung pro Endknoten-Repo).

**Übergabeprotokoll:** `docs/sessions/archiv/2026-05-26_sichttest-16-sub-e-gruen.md`.

---

### 2026-05-26 · Bau-Sitzung 16 Sub (e) Bronze/Gold-Stufung

**Sitzungs-Rolle:** Bau-Sitzung. Branch `claude/bau-16-sub-e-bronze-1UeT1`.
Pipeline-Phase A Schritt 5g. Brief: PR #179 / `BRIEF_BAU_16_SUB_E_BRONZE.md`.

**Anlass:** Klaus' Tafel-Spec-Pflege 2026-05-26 (PR #175) hatte das
SIEGEL zweistufig spezifiziert — Bronze („Mycel suchend") wenn Surface-
Check grün, aber noch kein Cross-Knoten-Handshake; Gold („Mycel
verbunden") sobald erster `sbkim:handshake outcome:"established"`-Event
ankommt. Diese Bau-Sitzung implementiert die Spec-Erweiterung Karte 16
§ Sub (e) Mycel-Verbindungs-Stufe.

**Was getan:**

- **`src/modules/16_siegel.js` additiv erweitert** (KEIN Bruch
  bestehender Public-Surface, KEIN Refactoring):
  - Closure-State `mycelConnected:false` + `mycelConnectedAt:null`
    (RAM-only — Tab-Reload startet wieder Bronze, gewollt).
  - Closure-interne Helper `siegelStufe()` (gibt `"bronze"`/`"gold"`),
    `applyStufeToBadge()` (setzt `data-stufe`-Attribut + stufen-
    spezifisches `aria-label`, entfernt `title`-Attribut),
    `playStufenwechselAnimation()` (`stufenwechsel-gold`-Klasse 600 ms),
    `onHandshakeEvent(event)` (idempotent + fail-soft via
    `event?.detail?.outcome !== "established"` → no-op),
    `registerHandshakeListener()`, `isAspect4(a)`.
  - `mountBadge()` um EINEN Aufruf `applyStufeToBadge()` vor
    `attachBadgeClickHandler` erweitert (additiv, eine Zeile).
  - `init()` um EINEN Aufruf `registerHandshakeListener()` vor dem
    `ready=true`-Flag erweitert (Listener registriert nach Badge-Mount
    nur bei grünem Surface-Check).
  - `buildBadgeElement()` setzt initiales aria-label auf
    „SBKIM-Siegel · Mycel suchend" + KEIN title-Attribut mehr (Pflege
    17 Tooltips-Konvention).
  - `mountSiegelModal()` um `bronzeHinweisBlock` zwischen Header und
    dateLine erweitert (display:none Default).
  - Neuer Helper `renderBronzeHinweisBlock(modalRoot)`: in Gold-Stufe
    display:none, in Bronze-Stufe display:block mit Hinweis-Text +
    `[Andocken]`-Knopf; Andock-Click fail-soft via
    `global.SbkimToolPwa?.openAndockTab`-Check (bei Fehlen Info-Notiz
    „Modul 18 noch nicht verfügbar — Andocken via Sage-Page-Andock-
    Wizard.").
  - `renderModalContents()` aspectsList-Loop um Aspekt-4-Pending-Marker
    erweitert: `isAspect4(a) && mycelConnected !== true` → since-Span
    zeigt „pending" italic + grau statt Datum.
  - `ZERTIFIKAT_ASPEKTE` um Aspekt 4 am Listen-Ende ergänzt
    (`since:"2026-05-26"`, `module:"16"`, `aspect:"Mycel-Verbindung
    etabliert (erster Handshake)"`).
  - Test-Brücke `_resetMycelConnectedForTest()` (Test-only, Panel 16
    Knopf 12 + Smoke-Test).
  - `_meta` um drei Live-Getter erweitert: `mycelConnected` (boolean),
    `mycelConnectedAt` (string|null ISO-8601), `siegelStufe`
    (`"bronze"|"gold"`).
- **`index.html` additiv erweitert**:
  - Zwei neue `:root`-Variablen `--siegel-bronze: #8C6E2F` +
    `--siegel-bronze-glow: rgba(140,110,47,0.45)`.
  - Drei neue CSS-Regeln im Badge-Block:
    `#sbkim-siegel-badge[data-stufe="bronze"]` (filter
    saturate-brightness), `:hover`-Variante mit Bronze-Glow-Drop-
    Shadow, `[data-stufe="gold"]` als no-op-Anker,
    `.stufenwechsel-gold` (animation 600 ms).
  - Neuer `@keyframes siegel-stufenwechsel-gold` (0→1.15→1.0 mit
    Gold-Glow-Box-Shadow + Drop-Shadow-Filter im Mittelpunkt).
- **Panel 16** in `tests/manual_check.html` um vier Knöpfe 9–12
  erweitert (Sub-(e)-Bronze-Initial / synthetischer Handshake → Gold
  + Stufenwechsel-Klasse / Idempotenz-Test / Bronze-Klick → Modal-
  Hinweis-Block + [Andocken] + Aspekt-4-Pending). Panel-Header-Text
  um Bau-16-Sub-(e)-Block erweitert.
- **Headless-Smoke** `tests/smoke_bau16_sub_e_bronze.mjs` (Node 22)
  mit minimalem DOM-Stub inkl. Descendant-Combinator-Support +
  textContent-Getter/Setter: 15 Proben, **15/15 grün**.
- **Regression**: smoke_bau04a 19/19 + smoke_bau04b 30/30 +
  smoke_bau04c 43/43 + smoke_bau15b 31/31 + smoke_bau17 32/32 grün.
- **node --check** für `16_siegel.js` + alle 13 Inline-`<script>`-
  Blöcke in `tests/manual_check.html` grün.
- **Doku-Pflege**: Karte 16 § Bauzustand neue Zeile, INTERFACES.md
  § 1 Modul 16 Bietet-/Events-/Geprüft-Block + § 10 Änderungsprotokoll
  voll gespiegelt. status.json Modul 16 `siegel`-Text aktualisiert
  (`score:"stub"` bleibt bis Sichttest grün, analog 04.B/04.C-
  Konvention).

**Heilige Tafeln dieser Sitzung eingehalten:**

- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN Auto-Andocken (Empfangsmodus-Prinzip wahren) — Aspekt 4 nur
  via empfangenem `sbkim:handshake`-Event aktiviert.
- KEIN Persistent-Store für mycelConnected (RAM-only, gewollt).
- KEIN Modul-18-Code-Bau (fail-soft-Check).
- KEIN Modul-05/17-Eingriff (Custom-Event existiert seit Bau 17).
- KEIN Endknoten-Eingriff (Re-Aktivierung folgt als Pipeline-
  Schritt 5e).
- KEINE Sage-Page-Änderung außer index.html CSS-Variablen +
  Badge-Regeln (Block 2 des Briefs).

**Was offen blieb:**

- Sichttest Panel 16 Knöpfe 9–12 (Klaus' Browser-Lauf) — ungeprüft,
  wartet auf DeX-Chrome am Galaxy Tab S6.
- Endknoten-Re-Aktivierung Mein-Rezeptbuch + Mein-Mixarium mit
  Sub-(e)-Pfad (Pipeline-Schritt 5e, eigene Folge-Sitzung pro
  Endknoten).
- Bau Modul 18 Tool-PWA-Container (Pipeline-Schritt 5h) — der
  fail-soft `[Andocken]`-Knopf bleibt vorerst auf Info-Notiz-Pfad.

**Nächster sinnvoller Schritt:** Sichttest-Pflege-Sitzung „Sichttest
16 Sub e grün" nach Klaus' Browser-Lauf Panel 16 Knöpfe 9–12
(analog Pfad PR #178 für 04.C).

**Headless-Bilanz:** 15/15 grün (Bau 16 Sub e) + Regression 04.A
19/19 + 04.B 30/30 + 04.C 43/43 + 15.B 31/31 + 17 32/32 grün.

**Übergabeprotokoll:** `docs/sessions/archiv/2026-05-26_bau-16-sub-e-bronze.md`.

---

### 2026-05-26 · Pflege Sichttest 04.C grün (5/5)

**Sitzungs-Rolle:** Pflege-Sitzung Sichttest-Nachzug. Branch
`claude/sichttest-04c-gruen`. **KEIN Modul-Code-Eingriff** —
reine Doku-Pflege nach Klaus' Live-Probe.

**Anlass:** Klaus hat unmittelbar nach Merge von PR #177 (Bau 04.C)
den Sichttest auf seinem Galaxy Tab S6 (DeX-Chrome, Termux-
`python3 -m http.server 8000`-Setup) durchgeführt. Alle fünf neuen
Panel-04-Knöpfe live grün.

**Sichttest-Befunde (5/5 grün):**

| Test | Resultat |
|---|---|
| 11 Happy-Path | `treffer_anzahl:2`, Top (0.9501, "rez-1") + Mittel (0.8627, "rez-2"), Unter-Schwelle (0.50) weggefiltert. Status-Chip „queryLocal Happy-Path OK". |
| 12 Schwelle-Cut | `treffer_anzahl:0`, KEIN Throw, alle drei Items unter 0.80 (0.30/0.55/0.78). Status-Chip „Schwelle-Cut OK". |
| 13 Top-k-Cut | k=2 von 5, genau T1 (0.9488) + T2 (0.9144), drei verworfen. Status-Chip „Top-k-Cut OK". |
| 14 Provider-Pfad | `setLocalCorpus(corpus)` → `provider_registriert:true`, queryLocal OHNE options.corpus liefert „Über Provider" (0.9318) + „Auch da" (0.8643). Status-Chip „Provider-Pfad OK". |
| 15 Leerer Korpus | beide Pfade leere Liste (`mit_options_corpus_leer:0`, `ohne_provider:0`), `provider_registriert:false` (Cleanup OK). Status-Chip „leerer Korpus OK". |

**Vorgeschichte / Sichttest-Setup-Befund:** Klaus' lokales `main` war
divergiert nach Squash-Merge von PR #177. HEAD lag auf altem
Feature-Branch `claude/pflege-17-tooltips-und-heartbeat`, zusätzlich
lokales `main` hatte zwei nicht-pushed-erscheinende Modul-17-UX-
Pflege-Commits (`19a8a66`+`3b10a9d`, 2026-05-25) — beide aber als
gemergede PRs auf `origin/main` mit anderem SHA (Squash-Effekt).
Lösung-Pfad: `git checkout main` → `git log --oneline
origin/main..main` (Diagnose) → `git reset --hard origin/main`
(sicher, weil Inhalte beweisbar schon auf origin lagen). Danach
Server neu + Hard-Reload → Panel 04 zeigte 15 Knöpfe statt 10.

**Was diese Pflege getan hat:**

1. **Karte 04 § Bauzustand** — neue Zeile „Sichttest (Bau 04.C)"
   mit allen fünf Score-Werten + Vorgeschichte-Block + Konsequenz-
   Marker.
2. **`status.json`** Modul 04 `score:"stub"` → `"fertig"`; `siegel`-
   Text aktualisiert mit Sichttest-Befund + Headless-Smoke 43/43-
   Bilanz + Cross-Knoten-Such-Lücke-Geschlossen-Marker; `kurz` um
   „sichtgetestet 2026-05-26" erweitert.
3. **PULS.md** § „Als nächstes ✨" Modul-04-Zeile von 🟦 auf 🟩
   gewechselt; voller Sichttest-Block ergänzt.
4. **`update_puls_pie.py`** aufgerufen → Pie regeneriert
   (21 Module, 🟫 8 / 🟧 0 / 🟨 0 / 🟦 8 / 🟩 5 — Fertig 4→5).
5. **Übergabeprotokoll** `docs/sessions/archiv/2026-05-26_pflege-
   sichttest-04c-gruen.md` angelegt.

**Was diese Pflege NICHT getan hat:**

- KEIN Modul-Code-Eingriff in `src/modules/`.
- KEINE Endknoten-Sitzung.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE INTERFACES.md-Änderung (Sichttest-Befund ist Karten-Doku,
  kein Vertrags-Eingriff).
- KEINE Tafel-Umsortierung.

**Offen / Nächster sinnvoller Schritt:**

1. **Bau 16 Sub (e) Bronze/Gold-SIEGEL-Stufung** (Pipeline-Schritt
   5g) — Modul 16 lauscht auf `sbkim:handshake outcome:"established"`,
   schaltet `_meta.mycelConnected:true`, re-rendert Badge in Gold.
   Aspekt 4 in `ZERTIFIKAT_ASPEKTE`. Spec liegt (Karte 16 § Sub e
   aus Tafel-Spec-Pflege 2026-05-26). Sage-Protokol-interne Sitzung,
   kein externer Endknoten betroffen.
2. **Re-Aktivierung Modul 15+16+04.C in Mein-Rezeptbuch**
   (Pipeline-Schritt 5e + Vorbereitung 5i). Externe Sitzung in
   Mein-Rezeptbuch-Repo. Brief `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md`
   liegt im Sage-Protokol-Archiv als Vorlage. Setzt PR #177-Merge
   voraus (erledigt).
3. **Re-Aktivierung Modul 15+16+04.C in Mein-Mixarium** — analog,
   Brief `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md` liegt.

**Sitzungs-PR:** Branch `claude/sichttest-04c-gruen`, Draft-PR folgt
nach Commit + Push.

---

### 2026-05-26 · Bau 04.C `queryLocal` + Such-Feld-Vorbereitung + Hub-Vorlage

**Sitzungs-Rolle:** Hauptsitzung Bau-Phase-A-Such-Feld-Sprint
(Pipeline-Schritt 5f + Vorbereitung 5i + Vorbereitung Phase B
Schritt 9). Branch `claude/bau-04c-suchfeld-hub-mjSYl`. **Modul-04-
Code-Eingriff additiv + drei Doku-Blöcke + drei Folge-Briefe.**

**Auslöser:** Tafel-Spec-Pflege Mycel-Vision (2026-05-26) hat Karte
04 § Sub (c) `queryLocal` voll spec'd; Modul 15 Sub (b) wartet seit
Bau 15.B 2026-05-25 fail-soft auf `SbkimMatch.queryLocal`. Diese
Sitzung schließt die Lücke und legt die Vorlagen für die externen
Folge-Sitzungen an (Endknoten + Hub).

**Was getan (fünf Blöcke, fünf Commits):**

**Block 1 — Bau Modul 04 Sub (c) `queryLocal`** (Pipeline-Phase A 5f):

- `src/modules/04_match.js` additiv erweitert (keine bestehende
  Funktion verändert): fünf neue Fehler-Factories sync (EmptyQueryError,
  QueryTooLongError, InvalidKError, EmbeddingNotAvailableError,
  InvalidCorpusError); neue Closure-State `_localCorpusProvider`;
  sync-Helper `validateCorpus` (Array-Check + Item-Schema-Check pro
  Eintrag); neue async-Funktion
  `queryLocal(text, k?, options?) → Promise<Array<{label,score,anchorId}>>`
  (Default k=5, hartcodierte Schwelle PROVIDER_MIN_MATCH=0.80, Korpus
  zwei Pfade options.corpus + Provider, Embedding via Modul 03
  `embedQuery`, Top-k-Cut nach Filter+Sort, leerer Korpus + alle-
  unter-Schwelle → leere Liste ohne Throw, EmbeddingFailedError async
  rethrow + Bad-Shape-Check); neue Public-Funktion
  `setLocalCorpus(corpusOrProvider)` (sync, idempotent, akzeptiert
  Array/Function/null, defensive Array-Kopie via Array.from).
- **Selbstcheck-Zeile auf fünf Funktionen erweitert.** `_meta` um
  `queryLocalDefaultK:5` + `queryLocalMaxTextLen:4096` + Live-Getter
  `localCorpusRegistered` erweitert.
- **Panel 04** in `tests/manual_check.html` um fünf Knöpfe erweitert
  (Test 11 Happy-Path Mini-Korpus / Test 12 Schwelle-Cut alle < 0.80
  / Test 13 Top-k-Cut k=2 von 5 / Test 14 Provider-Pfad via
  setLocalCorpus / Test 15 leerer Korpus kein Throw). SbkimEmbedding
  wird im Test-Setup gemockt (deterministischer LCG-Referenz-Vektor
  384-dim, KEINE Modell-Lade). Korpus-Vektoren via
  `mixedVec04C(ref, target, seed)` mit exakt vorhersagbarem Cosinus.
  Selbstcheck-Hinweis-Knopf-Text aktualisiert auf fünf Funktionen.
- **Headless-Smoke** `tests/smoke_bau04c_query_local.mjs` mit 12
  Probengruppen: **43 Sub-Proben, 43 grün, 0 rot.** Regression:
  smoke_bau04a 19/19, smoke_bau04b 30/30, smoke_bau15b 31/31,
  smoke_bau17 32/32 weiterhin grün.
- **Karte 04** § Bauzustand neue Zeile „Bau Sub (c) `queryLocal`";
  § Manueller Test um Knöpfe 11–15 erweitert (10 Bau-04.B-Knopf
  beibehalten); § Schnittstelle Selbstcheck-Format-Zeile aktualisiert.
- **INTERFACES.md §1 Modul 04** Bietet-Block um zwei neue
  Funktionen + Fehlerverhalten um zehn Zeilen + Garantien-Block um
  queryLocal-Lokalität + setLocalCorpus-Idempotenz + Geprüft-Zeile +
  Selbstcheck-Zeile erweitert. § 10 Änderungsprotokoll-Eintrag.
- **`status.json` Modul 04** bleibt `score:"stub"` (analog Bau 04.B,
  Score-Wechsel folgt nach Klaus' Sichttest). `siegel` + `kurz`
  erweitert. `update_puls_pie.py` NICHT aufgerufen (keine Score-
  Änderung).
- **PROTOCOL_VERSION / DB_VERSION / BACKUP_FORMAT_VERSION** unverändert.

**Block 2 — Karte 18 § Such-Feld-Integration-Pattern voll** (Klaus'
Stichwort/Semantik-Heuristik):

Drei-Signal-Klassifikator (alle drei für „Stichwort" gelten): Wort-
Anzahl ≤ 3, kein Fragezeichen, kein Bridge-Word aus deutscher Liste
(welcher/welches/welche/passt/zu/für/mit/ohne/wie/wann/warum/was/wer/wo,
case-insensitiv, ganzes Wort).

- Stichwort → lokale Substring-Filter-Suche (endknoten-spezifisch),
  KEIN Modul-03/04-Aufruf.
- Semantik → `queryLocal` + Cross-Knoten-Query via BroadcastChannel
  `sbkim-membrane` (postMessage op:"query" pro Geschwister, 3 s
  Timeout, op:"queryResult" sammeln).

Code-Schnipsel: classifySearch + runSearch + sendCrossKnotenQuery
(BroadcastChannel-basiert, same-origin Mycel). UI-Pattern mit zwei
Sektionen („Lokal" + „Aus dem Mycel"), Treffer-Spalten
Label/Score/Geschwister-Verweis. Anker-Pfad-Konvention
`#anchor=<anchorId>` + scrollToAnchor-Hook-Beispiel. Edge-Cases
(leeres Feld, 0 lokale Treffer, Modul 03 nicht geladen, kein
Geschwister, Timeout pro Geschwister, fremdes module-04c-not-available,
> 4096 Zeichen, Debounce-Pflicht).

**Block 3 — SB-KIMTool-Point Hub-Landing-Page-Vorlage:**

`docs/components/_sb_kim_tool_point_template/` mit fünf Dateien:

- `index.html` — Single-file Hub-Landing-Page (GitHub-Pages-fähig),
  Mount-Anker `<section id="andock-wizard">` + `<section id="endknoten">`,
  Floating-Widget-Mount-Skripte auskommentiert. Rendert Endknoten-
  Liste fail-soft via fetch("status.json"). Sage-Tonalität, kein
  Marketing-Glanz. Verweis auf Sage-Protokol als Spec-Quelle.
- `status.json` — Skelett mit leerer endknoten-Liste, Hub-Spore-
  Platzhalter, Pflicht-Modul-Liste (02/17/19).
- `README.md` — Forker-Aufruf, Pflege-Konvention (keine PII, keine
  Spec-Spiegelung, kein Auto-Merge).
- `sbkim/spore.json` — Hub-Spore-Skelett, Domain „Mycel-Hub",
  nodeType „hybrid".
- `EINBAU.md` — Sieben-Schritte-Anleitung für Klaus' Folge-Sitzung
  im externen Repo.

**KEIN Push ins externe Repo** `lausiklauskn-png/SB-KIMTool-Point` —
die Vorlage bleibt in Sage-Protokol, das Hub-Repo wird in eigener
Folge-Sitzung befüllt.

**Block 4 — Drei Folge-Briefe in `docs/sessions/`:**

- `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` — Such-Feld-Dual-Modus in
  Mein-Rezeptbuch (Klaus' Folge-Sitzung im externen Repo).
- `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md` — Such-Feld-Dual-Modus in
  Mein-Mixarium.
- `BRIEF_BAU_HUB_SB_KIMTOOL_POINT_INITIAL.md` — Initial-Bau im
  externen Hub-Repo (Vorlage aus `_sb_kim_tool_point_template/`
  einsetzen + Module 02/17 kopieren + Hub-Spore generieren).

Jeder Brief enthält Pflichtlese-Liste, Block-Struktur, Heilige Tafeln,
PR-Konvention, Endstand-Codeblock für die jeweils übernächste Sitzung.

**Block 5 — PULS.md + Übergabeprotokoll + Brief-Codeblock im Chat:**

- PULS.md neuer Sitzungs-Eintrag oben (dieser hier).
- Übergabeprotokoll
  `docs/sessions/archiv/2026-05-26_bau-04c-suchfeld-und-hub-vorlage.md`.
- `update_puls_pie.py` NICHT aufgerufen (keine status.json-Modul-
  Score-Änderung).
- „Vorgeschlagene nächste Schritte"-Block + Brief-Codeblock im Chat
  (Konvention CLAUDE.md Pflicht-5 + Pflicht-6).

**Tests bestanden:**

- `node --check src/modules/04_match.js` grün.
- `node tests/smoke_bau04c_query_local.mjs` — 43/43 grün.
- Regression: smoke_bau04a 19/19, smoke_bau04b 30/30,
  smoke_bau15b 31/31, smoke_bau17 32/32 weiterhin grün.
- Alle 13 Inline-`<script>`-Blöcke in `tests/manual_check.html`
  syntaktisch validiert.
- `python3 -c "import json; json.load(open('status.json'))"` valid.
- `python3 -c "import json; json.load(open('docs/components/_sb_kim_tool_point_template/status.json'))"` valid.
- `python3 -c "import json; json.load(open('docs/components/_sb_kim_tool_point_template/sbkim/spore.json'))"` valid.

**Was offen / nächster sinnvoller Schritt:**

- **Klaus' Sichttest 04.C** (Panel 04 Knöpfe 11–15 in Browser, nach
  Hard-Reload — der SbkimEmbedding-Mock ist Side-Effect, wer Panel 03
  danach läuft, muss reloaden).
- **Bau-Sitzung 16 Sub (e) Bronze/Gold-SIEGEL-Stufung** (Pipeline-
  Schritt 5g). Wartet nicht auf Bau 04.C-Sichttest — Modul 16
  unabhängig.
- **Externe Folge-Sitzungen** in MR/MM für Such-Feld-Dual-Modus
  (Briefe liegen) — Klaus startet die im jeweiligen Repo.
- **Externer Hub-Initial-Bau** in SB-KIMTool-Point (Brief liegt) —
  Klaus' Folge-Sitzung, Phase B (nach App-Freigabe).

**Sitzungs-PR:** Branch `claude/bau-04c-suchfeld-hub-mjSYl`,
Draft-PR folgt nach Push.

---

### 2026-05-26 · Doku-Pflege — PULS-Archiv-Auslagerung + Hub-Naming `SB-KIMTool-Point`

**Sitzungs-Rolle:** Pflege-Sitzung (Doppel-Scope, beide Doku-only).
Branch `claude/pflege-puls-archiv-und-naming-hub`. **KEIN Modul-
Code-Eingriff.**

**Anlass:** Klaus' Anweisungen nach PR #175-Merge:

1. **Naming-Festlegung Externer Mycel-Hub.** Nach kurzer Diskussion
   verschiedener Optionen (Mycel-Hafen / SBKIM-Hafen / Sporen-Hafen /
   Fruchtkoerper / Tool-Point-Dok / Node-Harbor / Knot-Harbor /
   Mycelium-Dock) hat Klaus **`SB-KIMTool-Point`** als finalen Repo-
   Namen gewählt und das Repo direkt als `lausiklauskn-png/SB-KIMTool-
   Point` public + leer angelegt. Begründung: `SB-KIM` referenziert
   das Akronym mit Bindestrich-Lesbarkeit; `Tool-Point` bezeichnet
   den zentralen Sammelpunkt für Modul-18-Tool-PWAs.
2. **PULS-Archiv-Auslagerung.** PULS.md war bei 5370 Zeilen
   (Schutz-Klausel 3000) — alte Sitzungs-Einträge mussten ins
   Archiv.

**Was getan (zwei zusammengefasste Pflegen in einem PR):**

**A) Hub-Naming-Festlegung:**

- `CLAUDE.md` § Pipeline-Schritt 9 — Repo-URL konkret eingetragen
  (`lausiklauskn-png/SB-KIMTool-Point`, angelegt 2026-05-26 public
  + leer).
- `docs/components/_mycel_hub.md` — Header-Block mit konkretem
  Repo-Pfad + URL; § Repo-Struktur-Skizze von `sbkim-hub/` auf
  `SB-KIMTool-Point/` umbenannt; § Spec-Punkte „Repo-Name + Owner"
  von offenen Vorschlägen auf Klaus' Festlegung umgeschrieben;
  § Bauzustand-Tabelle um „Repo-Name + Owner festgelegt 2026-05-26"-
  Zeile erweitert.
- `docs/components/19_andock_wizard.md` § Schnittstelle — Beispiel-
  `hubRepo`-Option erweitert um konkrete Hub-URL.
- `docs/components/_starter_bundle.md` § Konfig-Template — Beispiel-
  Hub-URL auf `https://lausiklauskn-png.github.io/SB-KIMTool-Point/`.
- `docs/sessions/BRIEF_SPEC_19_ANDOCK_WIZARD.md` — Hub-Repo-Pfad
  konkret eingetragen.
- `status.json` `mycelHubBacklog[mycel-hub]`-Eintrag — Name auf
  „Externer Mycel-Hub — Repo lausiklauskn-png/SB-KIMTool-Point",
  Kurz-Beschreibung um konkrete URL erweitert.

**Was NICHT geändert wurde (Design-Entscheidung):**

- Pool-Name `mycelHubBacklog` in `status.json` + `update_puls_pie.py`
  bleibt (logischer Cluster-Name für drei Items: Modul 19 + Starter-
  Bundle + Externer Hub).
- Karten-Datei `docs/components/_mycel_hub.md` bleibt unter dem
  Rollen-Namen (Konzept-Karte beschreibt die Rolle „Externer Mycel-
  Hub", der Repo-Name ist eine Instanz).
- `INTERFACES.md` § 10 Änderungsprotokoll-Eintrag (historisches
  Protokoll mit „sbkim-hub-Vorschlag") bleibt unverändert.
- Sitzungs-Archiv-Dateien (`docs/sessions/archiv/*.md`) bleiben
  unverändert (historische Dokumente, read-only).

**B) PULS-Archiv-Auslagerung (delegiert an Subagent):**

- 33 Sitzungs-Einträge vom 2026-05-25 / 2026-05-24 / 2026-05-22 /
  2026-05-21 / 2026-05-20 aus dem Body gelöscht (≈ 3260 Zeilen
  Volltext entfernt).
- Im Archiv-Index-Tabelle (Z. 5276 ff in der alten PULS.md, jetzt
  Z. 2043 ff) 33 neue 1-Zeilen-Einträge nach „Neueste oben"-
  Konvention eingefügt (vor den bestehenden 87 Zeilen). Archiv-
  Index-Tabelle: 87 → 120 Zeilen.
- Eine fehlende Archiv-Datei retroaktiv angelegt:
  `docs/sessions/archiv/2026-05-24_pflege-16-wappen-korona.md`
  (Mini-Pflege Modul 16 Wappen-Wechsel + Korona-Redesign, PR #154,
  hatte historisch kein Übergabeprotokoll). Inhalt aus dem ehemaligen
  PULS-Body-Eintrag übernommen.
- **PULS.md jetzt 2138 Zeilen** (vorher 5370). Schutz-Klausel
  3000 wieder eingehalten.

**Im Body bleiben:** nur die zwei 2026-05-26-Sitzungs-Einträge
(Tafel-Spec-Pflege Mycel-Vision + Pflege Modul 17 Tooltips/
Heartbeat) plus diese neue Pflege-Sitzung (drei Einträge gesamt).

**Verifikation:**

- ✅ `wc -l docs/PULS.md` → 2138 (< 3000 Schutz-Klausel)
- ✅ `grep -c sbkim-hub` in nicht-historischen Doku-Dateien (außerhalb
  archiv/ + INTERFACES.md + PULS.md) → 0 Treffer
- ✅ `python3 -c "import json; json.load(open('status.json'))"` → JSON
  valid
- ✅ Karten + Briefe enthalten konkreten Repo-Pfad `lausiklauskn-png/
  SB-KIMTool-Point` mit URL

**Was offen / nächster sinnvoller Schritt:**

- **Pipeline-Phase A Schritt 5f — Bau-Sitzung 04.C `queryLocal`.**
  Kritisch, weil Modul 15 Sub (b) ohne 04.C nicht funktioniert.
  Brief liegt: `docs/sessions/BRIEF_BAU_04C_QUERY_LOCAL.md`.
- Spec-Sitzung Externer Mycel-Hub (Pipeline-Phase B Schritt 9): das
  jetzt angelegte leere Repo `lausiklauskn-png/SB-KIMTool-Point`
  wartet auf Spec + Bau (Modul 19 Andock-Wizard + initiale Hub-
  Landing-Page). Erfolgt erst NACH App-Freigabe (Phase B).

**Sitzungs-PR:** Branch `claude/pflege-puls-archiv-und-naming-hub`,
Draft-PR folgt nach Commit + Push.

---

### 2026-05-26 · Tafel-Spec-Pflege Mycel-Vision (Klaus' Vision-Korrektur)

**Sitzungs-Rolle:** Hauptsitzung Tafel-Spec-Pflege. Branch
`claude/tafel-spec-mycel-vision`. **Reine Doku-Pflege**, KEIN
Modul-Code-Eingriff.

**Anlass:** Klaus' Vision-Klärung 2026-05-26 in mehreren Etappen:

1. **Such-Feld als bidirektionales Cross-Knoten-Matching-Anker** —
   Klaus' Kern-Intuition: User tippt in Mein-Rezeptbuch „welcher Wein
   passt zu Lasagne" → Cross-Knoten-Query an Mein-Mixarium → Treffer
   kommen zurück → Verweis ins andere PWA. Genau das, was das
   `sbkim_paper.pdf` als „Semantisches Bidirektionales KI-Matching"
   beschreibt — und was Klaus' externes
   [Semantic Match Demo](https://github.com/lausiklauskn-png/semantic-match-demo)
   als UI-Pattern enthält.
2. **Modul 04.C `queryLocal` fehlt** — kritischer Blocker. Modul 15
   Sub (b) hat den Empfänger-Pfad gebaut (`op:"query"` /
   `op:"queryResult"`), antwortet aber mit
   `error:"module-04c-not-available"`.
3. **Modul 15 + 16 Rückbau in Endknoten zurücknehmen** — Klaus hat
   15+16 aus MR + MM zurückgebaut. Mit Floating-Widget (Modul 17) ist
   die UX gelöst → 15+16 wieder rein, plus zusätzlich Modul 18 (Tool-
   PWA-Container) und Modul 19 (Andock-Wizard kopierbar).
4. **Mehrstufen-Architektur:** Sage-Protokol → SBKIM-Starter-Bundle
   (eigenes Repo) → Externer Mycel-Hub (eigenes Repo) → Forker-PWAs
   (Pepo Semantic Match Demo, Muttis Rezeptbuch, etc.).
5. **Modul 16 Aspekt 4 + Bronze-Stufe** — zweistufiger SIEGEL (Bronze
   „Mycel suchend" / Gold „Mycel verbunden") löst Henne-Ei-Problem
   (Andocken erreichbar ohne Voraus-Voll-SIEGEL).
6. **Auto-Andocken NEIN** — Empfangsmodus-Prinzip wahren. Andocken
   nur via Modul 18 Sub (a) explizite Geste.

Klaus' Anweisung: **„bevor wir bauen nachdenken"** — daher diese eine
große Tafel-Spec-Pflege, die die komplette erweiterte Vision
dokumentiert, BEVOR irgendetwas gebaut wird.

**Pepo-Demo-Studie (vorab):**

WebFetch auf `lausiklauskn-png/semantic-match-demo` (index.html +
hub.html + protocol/sbkim-node.html + SBKIM_Paper_DE.html):

- ✅ **Übernehmbar als Pattern-Vorlage:** Symmetrie-Anforderung
  (beide Parteien beschreiben Fähigkeit UND Bedarf, Vier-Feld-
  Eingabe), Score-Ring (0–100% mit Farb-Schwellen ≥70/40-69/<40),
  Drei-Dimensionen-Anzeige (fachlich/prozess/skalierung — entspricht
  Modul 04.A `matchDimensions`), Match-/Differenz-Listen, Confirm-
  Workflow.
- ❌ **NICHT übernehmbar:** WebRTC/PeerJS-Transport (Demo nutzt
  PeerJS, Sage nutzt postMessage + BroadcastChannel), Claude-API
  als zentrale Match-Engine (Demo rechnet alles per Claude,
  Sage rechnet lokal via Modul 03 + 04 + optional Stufe-B-LLM via
  04.B), Tablet-Hub-Vermittler-Modell (Demo hat Tablet als zentralen
  Hub, Sage hat dezentrale Peers).

Klaus' Klärung 2026-05-26: die Demo war Vorlage für eine andere
Firma, nicht Sage-Spec — aber die bidirektionale Match-Vision ist
identisch. Sage-Mycel ist die eigenständige dezentrale Implementation.

**Was diese Sitzung getan hat:**

1. **Karte 04 § Sub (c) `queryLocal` voll spec'd** — Signatur, Default
   `k=5`, hartcodierte Schwelle `PROVIDER_MIN_MATCH=0.80`, Korpus zwei
   Pfade (`options.corpus` + `_corpusProvider`-Callback via
   `setLocalCorpus`), Embedding via Modul 03 `embedQuery`, Top-k-Cut,
   fünf Fehler-Pfade, Strikte Tabus, Cross-Knoten-Search-Hook auf
   Modul 15 Sub (b) ohne Code-Update. Selbstcheck-Zeile künftig fünf
   Funktionen.
2. **Karte 16 § Sub (e) Mycel-Verbindungs-Stufe** voll spec'd —
   zweistufiger SIEGEL Bronze/Gold via `sbkim:handshake`-Listener,
   RAM-only `_meta.mycelConnected`, visuelle Unterscheidung gedämpfter
   Bronze-Ton via saturate(0.6)-filter + Stufenwechsel-Animation
   600 ms. Aspekt 4 „Mycel-Verbindung etabliert (erster Handshake)"
   in ZERTIFIKAT_ASPEKTE-Liste. § Strikte Tabus Klausel angepasst
   (Bronze/Gold-Stufung erlaubt seit 2026-05-26; Silber/Platin
   bleiben verboten).
3. **Karte 18 Sub-Bereiche von 5 (a–e) auf 9 (a–i) erweitert** —
   neue Sub (b) Heterokaryose (ersetzt alte „Sporen-Installation");
   neue Sub (f) Sporen-Regeneration; (g) Re-Embedding; (h) Manueller
   Handshake-Trigger; (i) Spore-Discovery (Sage / Externer Hub /
   Manuelle-URL). Neuer Karten-Abschnitt § Such-Feld-Integration-
   Pattern (Pepo-Demo-Studie als Referenz, Sender-Helper-Code-Pattern,
   UI-Pattern, Anker-Pfad-Konvention).
4. **Drei neue Stub-Karten:**
   - `docs/components/19_andock_wizard.md` (Andock-Wizard kopierbar)
   - `docs/components/_starter_bundle.md` (Modul-Distributions-Repo)
   - `docs/components/_mycel_hub.md` (öffentliches Observatorium light)
5. **Drei neue Briefe:**
   - `BRIEF_BAU_04C_QUERY_LOCAL.md` (Phase-A-Bau-Sitzung)
   - `BRIEF_SPEC_19_ANDOCK_WIZARD.md` (Phase-B-Spec-Sitzung)
   - `BRIEF_SPEC_18_TOOL_PWA.md` aktualisiert (9 Sub-Bereiche +
     Such-Pattern-Pflicht)
6. **CLAUDE.md § Pipeline-Reihenfolge erweitert** um Phase A
   (5e–5j: Re-Aktivierung MR/MM + Bau 04.C + Bau 16 Sub e +
   Spec/Bau 18 + Such-Feld-Helper + Migration), Phase B (7–9:
   Modul 19 + Starter-Bundle + Externer Mycel-Hub), Phase C
   (10–12: Pepo + Muttis Rezeptbuch + Cross-Knoten-Such-Test).
   § Modul-Tabelle Eintrag 18 auf 9-Sub-Schema; Eintrag 19 NEU.
7. **`status.json`** neuer `mycelHubBacklog`-Pool mit Modul 19 +
   `starter-bundle` + `mycel-hub` (alle `score:"schablone"`); Modul
   18-Eintrag um 9-Sub-Hinweis erweitert; `lastUpdated:"2026-05-26"`.
   `scripts/update_puls_pie.py` um `mycelHubBacklog`-Pool erweitert.
   Pie regeneriert (21 Module, 🟫 8 / 🟧 0 / 🟨 0 / 🟦 9 / 🟩 4).
8. **INTERFACES.md § 10 Änderungsprotokoll-Eintrag** mit vollem
   Tafel-Spec-Pflege-Resultat.

**Was diese Sitzung NICHT getan hat:**

- KEIN Modul-Code in `src/modules/`.
- KEIN Endknoten-Eingriff (externe Repos unangetastet).
- KEINE Sage-Page-Änderung (`index.html` nur als Code-Vorlage für
  Modul 19 referenziert, nicht modifiziert).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- KEIN Modul-02/05/15/17-Code-Eingriff.
- KEINE Tafel-Umsortierung CLAUDE.md außer additiver Pipeline-
  Erweiterung (Phasen A/B/C ergänzt, alte Schritte 1–6 unverändert).

**Offen / Nächster sinnvoller Schritt:**

1. **Sichttest dieser Pflege durch Klaus** (Karten lesen, oder
   zumindest § Klaus-Festlegungen-Blöcke pro Karte; Pipeline-
   Reihenfolge in CLAUDE.md prüfen). Bei „grün" mergen.
2. **Phase A Pipeline-Schritt 5f starten** — Bau-Sitzung 04.C
   `queryLocal` (Brief `BRIEF_BAU_04C_QUERY_LOCAL.md` liegt). Kritisch,
   weil Modul 15 Sub (b) ohne 04.C nicht funktioniert.
3. **Phase A Pipeline-Schritt 5e + 5g + 5h + 5i + 5j folgen** —
   Re-Aktivierung MR/MM + Bronze-Stufe-Bau + Modul 18 + Such-Feld-
   Helper + Endknoten-Migration.
4. **Phase B Spec-Sitzung 19 Andock-Wizard** (Brief
   `BRIEF_SPEC_19_ANDOCK_WIZARD.md` liegt) — NACH App-Freigabe.
