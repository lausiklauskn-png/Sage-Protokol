# PULS — lebender Status

**Format:** Jede Sitzung trägt unten einen Eintrag ein (neueste oben).
**Pflichtfelder pro Eintrag:** Datum · Sitzungs-Rolle · was getan · was offen · nächster sinnvoller Schritt.
**Begrenzung:** Diese Datei darf 400 Zeilen nicht überschreiten. Älteres ins
`docs/sessions/archiv/`-Verzeichnis als Übergabeprotokoll auslagern.

---

## Schnellüberblick

| Modul | Spec | Code | Manueller Sichttest | Anmerkung |
|---|---|---|---|---|
| 00 doku_fenster | leere Schablone | — | — | "5-Klick versteckte Doku" in Suchleiste |
| 01 storage | leere Schablone | — | — | IndexedDB-Wrapper |
| 02 spore | leere Schablone | — | — | Ed25519-Identität |
| 03 embedding | leere Schablone | — | — | semantischer Vektor |
| 04 match | leere Schablone | — | — | Vektorvergleich |
| 05 anastomose | leere Schablone | — | — | Handshake |
| 06 heterokaryose | leere Schablone | — | — | Datenaustausch |
| 07 apoptose | leere Schablone | — | — | Selbstlöschung |
| 08 ui_demo | leere Schablone | — | — | Test-Oberfläche |
| 09 einbau_pwa | leere Schablone | — | — | Anleitung Rezeptbuch/Mixarium |
| 10 reputation | Stub (Schutz-Backlog) | — | — | Knoten-Reputation, Priorität niedrig |
| 11 rate_limit | Stub (Schutz-Backlog) | — | — | Rate-Limit & TTL, Priorität niedrig |
| 12 blocklist | Stub (Schutz-Backlog) | — | — | manuelle Sperrliste, Priorität niedrig |

Statuscodes: `—` (nichts) · `Schablone` · `Stub` · `Entwurf` · `Review` · `stabil` · `eingebaut`

## Endknoten (externe Repos des Betreibers)

| App | Domain | Domäne | SBKIM-Stand |
|---|---|---|---|
| Rezeptbuch | (TBD) | Kochrezepte | nicht integriert |
| Mixarium | (TBD) | Cocktails / Drinks | nicht integriert |

## Offene Querschnitts-Fragen

- Werden Domain-URLs der Endknoten-Apps in `docs/INTERFACES.md` aufgenommen
  oder nur lokal in deren `index.html`? → Entscheidung steht aus.
- Embedding-Modell: bleibt es bei Default `Xenova/multilingual-e5-small`?
  → ja, bis Gegenargument. Quelle: `sbkim_integration.md` §4.1.
- Speicherort der Spore bei GitHub Pages: `/.well-known/sbkim/spore.json`
  oder Alias `/sbkim/spore.json`? → siehe `docs/components/02_spore.md`
  und `docs/components/09_einbau_pwa.md`, sobald die geschrieben sind.
- **Wording-Diskrepanz**: `CLAUDE.md` führt SBKIM als
  "Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel" — das Paper
  (Kap. 1.2) führt es als "Semantisch-Empfangendes Bidirektionales
  KI-Matching". Das Observatorium (`index.html`, `status.json`) übernimmt
  die Paper-Variante. CLAUDE.md sollte in einer separaten Sitzung
  nachgezogen werden.

## Schutz-Backlog (aus Sage-Page Karte 13, 2026-05-10)

Drei strukturelle Lücken im Schutz-Modell sind beim Aufbau des
Observatoriums sichtbar geworden. Stubs sind angelegt; gezogen werden sie
ab spürbarem Wachstum:

- `docs/components/10_reputation.md` — Knoten-Reputation
- `docs/components/11_rate_limit.md` — Rate-Limit & TTL
- `docs/components/12_blocklist.md` — manuelle Blocklist

Eigenschutz-Karte der Sage-Page macht das Backlog für jeden Besucher
sichtbar und verlinkt direkt auf die Stubs.

---

## Sitzungs-Einträge

### 2026-05-10 · Hauptsitzung · Sage·Observatorium (Landing Page)

**Getan:**
- `index.html` (Single-File, 14 Karten + 4 Detail-Screens) als Sage·
  Observatorium gebaut. Hybrid-Layout: Bento-Hauptscreen + Detail-Tour
  für Lebenszyklus, Modul-Detail, Datenquelle.
- Visuelles System: Glass-Cards, Drift-Orbs, Score-Ring mit Count-Up,
  Sonar-Pulses am Hub, Particle-Streams Indigo/Gold/Teal, Space Grotesk
  + Space Mono via Google Fonts. `prefers-reduced-motion` respektiert.
- 14 Karten: Hero · Demo-Anteil-Ring · Lebenszyklus · Module (10+3) ·
  Schichten-Bars · Endknoten · Datenquelle · Glossar · Schläfer-Modus ·
  Andocken (Live-Generator) · Wanderung (Mechanik) · Initialstart
  (Cold-Start) · Eigenschutz (Penicillin-Schicht) · Pulse-Footer.
- Andock-Karte 10 mit Live-Generator: Repo-URL/Domain/Knotentyp →
  generiert valide `spore.json` + GitHub-PR-Vorlinker (`quick_pull`-URL,
  vor-ausgefüllter Diff für `status.json`). 3-Klicks-Pfad, kein Backend.
- `status.json` erweitert um `nodeTypes`-Score-Mapping
  (schablone/werkstatt/spec/stub/fertig → 0/3/5/7/10), `scoreModel`,
  `schutzBacklog[]` für die drei Schutz-Module 10-12. `fullName` auf
  Paper-Variante korrigiert.
- `.nojekyll` angelegt (verhindert Jekyll-Build von GitHub Pages).
- Drei Schutz-Backlog-Stubs unter `docs/components/10_reputation.md`,
  `11_rate_limit.md`, `12_blocklist.md` mit Zweck, offenen Fragen,
  Abhängigkeiten und Anker zur Eigenschutz-Karte.
- PULS.md erweitert: drei neue Tabellenzeilen 10/11/12, Schutz-Backlog-
  Block im Querschnitts-Fragen-Bereich, Wording-Diskrepanz vermerkt.

**Offen:**
- CLAUDE.md Modul-Tabelle muss von 00-09 auf 00-12 erweitert werden
  (transparenter Eigen-Commit, "acht Module"-Widerspruch im Text fixen).
- Wording-Diskrepanz CLAUDE.md ↔ Paper bleibt offen (siehe oben).
- Modul 02 (Spore) muss später Krypto-Schema liefern, dann wandert die
  unsignierte Spore aus der Andock-Karte zur signierten Variante. Bis
  dahin: Disclaimer "provisorisch unsigniert" auf der Karte.
- Modul 05 (Anastomose) wird die manuelle PR-Mechanik in der Andock-
  Karte später ersetzen. Bis dahin: 3-Klicks-Pfad bleibt der Standard.

**Nächster sinnvoller Schritt:**
- Spec-Sitzung Modul 01 (Storage) starten — IndexedDB-Wrapper ist
  Voraussetzung für 02, 05, 07, 12.
- Parallel Spec-Sitzung Modul 03 (Embedding) — unabhängig.

**Nachzug 2026-05-10:**
- Eigenschutz-Karte 13 von 4 auf 6 Sektionen erweitert: zusätzlich
  **Vermächtnis-Markierung** (Paper Kap. 16, signiertes Vermächtnis +
  Quorum aus §17) und **Strukturelle Schutzschicht** (Paper §1.4 — kein
  Angreifer-Anreiz, "Mycel frisst nur totes Mycel").
- Stubs Modul 10 (Reputation) und Modul 12 (Blocklist) angepasst: der
  biologische Hauptmechanismus liegt in Modul 07 (Vermächtnis) +
  Heterokaryose-Quorum. Die Stubs sind nicht "der Mechanismus", sondern
  formal-quantitative bzw. manuelle Override-Ergänzungen. Lücken sind
  dadurch kleiner als zunächst angenommen.

---

### 2026-05-10 · Hauptsitzung · Skelett-Anlage

**Getan:**
- Repo-Skelett angelegt: `CLAUDE.md`, `docs/`, `src/`, `tests/`.
- Memory-Schicht aufgesetzt: `PULS.md`, `ARCHITEKTUR.md`, `INTERFACES.md`,
  `GLOSSAR.md`.
- Zehn Komponenten-Karten als leere Schablonen unter `docs/components/`
  angelegt (00 bis 09).
- `BRIEFING_TEMPLATE.md` für Bausitzungen erstellt.
- `tests/manual_check.html` als Stub angelegt.
- Festgelegt: Sage-Protokol ist Spezifikations-/Bau-Hub, nicht Endknoten.
  Endknoten sind Rezeptbuch und Mixarium.
- Festgelegt: Knotentyp aller Endknoten zunächst `hybrid`.
- Festgelegt: PULS.md wird von jeder Sitzung am Ende verpflichtend gepflegt.

**Offen:**
- Alle zehn Komponenten-Karten sind leer. Jede braucht eine Spec-Sitzung
  (kurz, ~20 Min) bevor eine Bau-Sitzung sie umsetzen kann.
- `INTERFACES.md` enthält nur Versionsfeld und Schablone, keine
  Modul-Verträge.

**Nächster sinnvoller Schritt:**
- Eine **Spec-Sitzung für Modul 01 (Storage)** und eine **Spec-Sitzung
  für Modul 03 (Embedding)** parallel starten — die beiden sind
  unabhängig voneinander. Briefing-Vorlage: `docs/sessions/BRIEFING_TEMPLATE.md`.
- Danach Spec-Sitzung Modul 02 (Spore), die auf Storage aufsetzt.
