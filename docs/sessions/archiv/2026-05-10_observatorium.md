# Übergabeprotokoll · 2026-05-10 · Sage·Observatorium

**Sitzungs-Rolle:** Hauptsitzung (Landing-Page-Bau)
**Branch:** `claude/semantic-agent-network-Y03Vg`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` (Block A)

---

## Auftrag

Sage-Protokol braucht eine sichtbare Außenseite. GitHub Pages ist auf
`main` aktiviert, der erste Deploy ist gefailed, weil keine `index.html`
im Root liegt. Die Page soll mehr sein als ein Lückenfüller: ein
**Observatorium**, das das Grundgerüst von SBKIM zeigt, das Pulsleben
des Systems beobachtbar macht und anderen Repos als Datenquelle dient.

---

## Was getan wurde

### 1. `index.html` — Sage·Observatorium

Single-File, 14 Karten in Hybrid-Layout (Bento-Hauptscreen + 3 Detail-
Screens). Komplett inline (HTML + CSS + JS), keine externen Skripte
außer Google Fonts.

**Bento-Karten (overview):**

1. **Hero** — Wordmark `SAGE·OBSERVATORIUM`, Untertitel mit Paper-
   Wording aus Kap. 1.2 ("Semantisch-Empfangendes Bidirektionales
   KI-Matching").
2. **Demo-Anteil-Ring** — Score-Ring mit Count-Up-Animation,
   Berechnungs-Tooltip. Liest `status.json` und berechnet
   `100 × (1 − realScore / 140)`.
3. **Lebenszyklus-Loop** — SVG mit Hub-Sonar-Pulses, vier Particle-
   Streams (Indigo/Gold/Teal), Phase-Pill-Loop alle 2.4s. CTA →
   Detail-Tour.
4. **Module-Bento** — 10 MVP-Module + 3 Schutz-Backlog-Module mit
   Status-Badges und Klick-zu-Detail.
5. **Schichten-Bars** — UI / Netzwerk / Kern als animierte Progress-
   Bars, berechnet aus den Modul-Scores.
6. **Endknoten-Tafel** — Rezeptbuch / Mixarium als Kacheln, Live-Ping
   beim Page-Load (Timeout aus `config.QUERY_TIMEOUT_MS`).
7. **Datenquelle** — Code-Snippet zum Einbinden von `status.json` in
   andere Repos. CTA → Schema-Doku-Screen.
8. **Mini-Glossar** — 9 Begriffe inline, kurze Definitionen.
9. **Schläfer-Modus** — zwei Knoten-Sprites (lebendig + Schläfer) mit
   Atemkreis-Animation. Klick auf Schläfer triggert Wake-up-Animation.
10. **Andocken / Live-Generator** — drei Eingabefelder (Repo-URL,
    Domain, Knotentyp) → generiert Spore-JSON + GitHub-PR-Vorlinker
    (`quick_pull`-URL mit vor-ausgefülltem Diff für `status.json`).
    Copy-Button und Download-Button. Selbstreferenz-Block: "Diese
    Page ist die Vermittlungsstelle, kein Single Point of Failure."
11. **Wanderung** — Mini-Netz-SVG, zwei Suchpartikel (Pfad A
    erfolgreich → Mycel-Faden bleibt; Pfad B Apoptose, fadet aus).
    Phase-Pill-Loop alle 3s.
12. **Cold-Start** — Drei-Knoten-Schema (Hub + Mixarium + Rezeptbuch)
    mit atmendem Mycel-Faden. Drei Sätze Erklärung. Negativ-
    Abgrenzung am Fuß ("keine öffentlichen Suchmaschinen").
13. **Eigenschutz** — vier Mini-Sektionen (Signatur · Apoptose-als-
    Penicillin · Dezentralität · Match-Filter) im 2×2-Grid. Schutz-
    Backlog-Block mit Verlinkung auf die drei Stubs. Penicillin-
    Hinweis am Rand.
14. **Pulse-Footer** — Branch / Protokoll-Version / Schema / Update-
    Datum aus `status.json`. Link zu GitHub.

**Detail-Screens:**

- `#screen-cycle` — Lebenszyklus-Detail-Tour, vier Phasen, Steuerung
  ◀⏸▶↺ und Tastatur (←→Space), Auto-Toggle, biologische Hintergründe
  + Mechanik-Snippets + Modul-Chips.
- `#screen-module` — Modul-Detail mit Status, Score, Abhängigkeiten,
  Link zur Komponenten-Karte. Wird beim Klick auf eine Modulkarte
  geöffnet.
- `#screen-data` — vollständige Schema-Doku für `status.json` mit
  JS/Python/curl-Beispielen.

**Visuelles System:**

- Tokens: `--bg #05050F`, `--accent #6366F1`, `--violet #8B5CF6`,
  `--gold #F59E0B`, `--teal #14B8A6`, `--text #EEEEFF`, `--rose #F43F5E`.
- Schriften: Space Grotesk + Space Mono via Google Fonts.
- Glass-Cards (`backdrop-filter: blur(24px)`).
- 3 Drift-Orbs als Hintergrund-Atmosphäre, dezenter Grid-Mask.
- `prefers-reduced-motion: reduce` schaltet alle Animationen ab.

### 2. `status.json` erweitert

- `fullName` von "Semantisch-Biologisch Koordiniertes Inter-Knoten-
  Mycel" auf Paper-Variante "Semantisch-Empfangendes Bidirektionales
  KI-Matching" geändert (Heilige-Tafel-Quelle: Paper Kap. 1.2).
- `nodeTypes`-Mapping eingeführt: schablone=0 / werkstatt=3 / spec=5
  / stub=7 / fertig=10. Damit ist die Score-Berechnung in der Page
  rein datengetrieben.
- `scoreModel`-Block ergänzt mit Formel und Grenzen.
- `schutzBacklog`-Array eingeführt: Module 10/11/12 mit Status
  "spec ausstehend, Priorität niedrig" — zählen NICHT in den Demo-
  Anteil, sind aber in der Modul-Bento sichtbar.
- Modul-Einträge um `score`-Feld erweitert (statt der alten
  `spec`/`code`-Spalten, die in `siegel` zusammengefasst sind).

### 3. `.nojekyll`

Leere Datei im Root, verhindert Jekyll-Build von GitHub Pages.

### 4. Schutz-Backlog-Stubs

- `docs/components/10_reputation.md` — Knoten-Reputation, Status,
  Zweck, fünf konkrete offene Fragen, Querverweise auf Modul 06/07/12.
- `docs/components/11_rate_limit.md` — Rate-Limit & TTL, fünf offene
  Fragen, Beispiel-Defaults, Querverweise auf Modul 05/10.
- `docs/components/12_blocklist.md` — manuelle Blocklist, fünf offene
  Fragen, API-Skizze, Querverweise auf Modul 01/06/10.

Jeder Stub hat einen "Anker"-Vermerk auf die Eigenschutz-Karte 13 der
Observatorium-Page, damit die Verbindung zwischen Page und Stubs
explizit ist.

### 5. `docs/PULS.md` erweitert

- Schnellüberblick-Tabelle um drei Zeilen 10/11/12 erweitert
  (Schutz-Backlog markiert).
- Statuscodes-Liste um `Stub` ergänzt.
- Querschnitts-Fragen-Block: Wording-Diskrepanz CLAUDE.md ↔ Paper
  vermerkt (für separate Sitzung).
- Schutz-Backlog-Block am Ende ergänzt mit Verlinkung auf die drei
  Stubs.
- Heutiger Sitzungs-Eintrag oben mit "Getan / Offen / Nächster Schritt".

---

## Was offen bleibt

1. **CLAUDE.md Modul-Tabelle** muss von 00-09 auf 00-12 erweitert
   werden. Der Text "Die acht Module" widerspricht der Tabelle (10
   Einträge) und wird beim Erweitern auf 13 mitgefixt. Eigener Commit,
   weil Heilige-Tafel-Datei.
2. **Wording-Diskrepanz** in CLAUDE.md selbst (Kurzform stimmt nicht
   mit Paper Kap. 1.2 überein) — separater Auftrag, weil Sitzungs-
   Anker-Datei.
3. **Modul 02 (Spore)** wird später das Krypto-Schema (Ed25519)
   liefern. Bis dahin trägt die Andock-Karte den Disclaimer
   "provisorisch unsigniert".
4. **Modul 05 (Anastomose)** wird die manuelle PR-Mechanik der
   Andock-Karte später durch automatischen Sporen-Drop ersetzen.

---

## Nächster sinnvoller Schritt

- **Spec-Sitzung Modul 01 (Storage)** starten — IndexedDB-Wrapper ist
  Voraussetzung für 02, 05, 07, 12.
- **Parallel Spec-Sitzung Modul 03 (Embedding)** — unabhängig von 01.
- Danach Spec-Sitzung Modul 02 (Spore), die auf Storage aufsetzt.

Sobald Module 01-04 spec-fertig sind, sinkt der Demo-Anteil auf der
Page automatisch beim nächsten Reload.

---

## Sichttest

- Lokal: `python3 -m http.server` im Root → `http://localhost:8000/`.
- Demo-Ring zeigt erwarteten Wert (~91% bei aktuellem `status.json`).
- Lebenszyklus-Loop läuft, Particle-Streams fließen, Phase-Label
  wechselt synchron alle 2.4s.
- Modul-Karten 00-09 + Schutz-Backlog 10-12 mit Status-Badges sichtbar.
- Endknoten-Tafel zeigt beide als gestrichelt + "Noch nicht
  angeschlossen" (kein Live-Ping möglich, weil `url: null`).
- Andock-Generator: Beispiel-Repo "lausiklauskn-png/rezeptbuch" +
  Domain "Kochrezepte" → valide spore.json, PR-Vorlinker öffnet
  GitHub-Edit-View korrekt.
- Detail-Tour startet bei Klick auf "Schritte erklären", Tastatur-
  Steuerung funktioniert.
- Wanderungs-Karte: beide Pfade laufen parallel, Mycel-Faden bleibt
  sichtbar, Apoptose-Pfad fadet aus.
- Cold-Start-Karte: Drei-Knoten-Schema rendert, Mycel-Faden atmet.
- Eigenschutz-Karte: vier Sektionen im 2×2-Grid, Stubs verlinkt.

---

## Commit-Hash

(wird nach Push ergänzt — siehe `git log` auf Branch
`claude/semantic-agent-network-Y03Vg`)
