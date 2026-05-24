# 2026-05-24 · Mini-Pflege — CLAUDE.md Pipeline-Reihenfolge-Tafel verankert

**Sitzungs-Rolle:** Pflege-Sitzung. Branch
`claude/pflege-claude-md-pipeline-reihenfolge`. Anschluss nach PR #149
(status.json-Pflege).

## Anlass

Klaus' Frage 2026-05-24: „ist 4. mit vermerkt wegen der Wichtigkeit
der Reihenfolge?"

Hintergrund: in den vorgeschlagenen-nächsten-Schritten-Listen meiner
letzten Sitzungs-Antworten stand die Pipeline-Reihenfolge (Spec 16 →
Bau 16 → Sichttest → Spec 15.B → Endknoten-Migration → App-Freigabe;
Schutz-Module 11/12/10 organisch danach). Diese Reihenfolge ist
**verbindlich für die nächsten Wochen**, weil sie Klaus' strategische
Festlegung zur App-Freigabe widerspiegelt.

Sie stand aber **verstreut**:

- `docs/sessions/BRIEF_SPEC_16_SIEGEL.md` (Hintergrund-Block)
- `docs/components/16_siegel.md` § „Reihenfolge im Brief-99-Pipeline"
- `docs/PULS.md` Sitzungs-Einträge (als „Vorgemerkt"-Block)

Eine neue Sitzung beim Pflicht-Lesen liest nur CLAUDE.md + PULS-
Schnellüberblick + INTERFACES.md + die eigene Modul-Karte. Die
Reihenfolge war damit **nicht garantiert sichtbar** — eine Sitzung
musste zufällig den richtigen Brief lesen, um sie zu erfahren.

## Lösung

Eine **zentrale verbindliche Tafel in CLAUDE.md**, direkt nach der
Modul-Tabelle (vor „Wenn du blockiert bist"). Damit ist die
Reihenfolge **Pflicht-Leseliste** und garantiert sichtbar.

## Geänderte Dateien

- `CLAUDE.md` neuer Block „Pipeline-Reihenfolge bis App-Freigabe
  (verbindlich, 2026-05-24)"
- `docs/PULS.md` Sitzungs-Eintrag oben
- `docs/sessions/archiv/2026-05-24_pflege-claude-md-pipeline-reihenfolge.md`
  (dieses Protokoll)

## CLAUDE.md-Block im Detail

Drei Sektionen:

### 1. Tabelle mit sechs Schritten

| # | Sitzung | Branch | Brief liegt? |
|---|---|---|---|
| 1 | Spec-Sitzung 16 SBKIM-Siegel | `claude/spec-16-siegel` | ✅ `BRIEF_SPEC_16_SIEGEL.md` |
| 2 | Bau-Sitzung 16 | `claude/bau-16-siegel` | ⏳ in Spec 16 |
| 3 | Sichttest 16 | (Nachzug-PR) | — |
| 4 | Spec-Sitzung 15.B Membran | `claude/spec-15b-membran` | ⏳ in Spec 16 / Bau 16 |
| 5 | Endknoten-Migration | `claude/migration-<endknoten>` | ⏳ `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` (wird vor Schritt 5 erweitert) |
| 6 | Klaus' App-Freigabe | — | — |

Danach organisch: Modul 11 Mini, Modul 12 Mini, Modul 10 Voll-Bau
(frühestens bei N ≥ 10 aktive Geschwister).

### 2. Begründung der Reihenfolge

- 16 vor 15.B → 15.B-Sub-(a)-Read braucht Siegel-Schema
- 16 vor Freigabe → Vertrauens-Signal für Forker/Endnutzer (Klaus'
  Strategie)
- Schutz-Module nach Freigabe → CLAUDE.md-Spec „erst wenn Apoptose+
  Match-Filter nicht mehr reichen", außerdem Spec-getrieben ohne
  reale Angriffsfläche → falsche Form
- Endknoten-Migration nach Bau 16 + Spec 15.B → ein Migrations-
  Schritt für beide UI-Erweiterungen (Lampe + Siegel)

### 3. Wer darf umsortieren

- Klaus per Chat → eigene Pflege-Sitzung zieht CLAUDE.md nach
- Sitzung mit Block-Befund (Tafel-Evolutions-Klausel) → mit
  explizitem Anpassungs-Antrag an Klaus
- **NIEMAND stillschweigend** — wer Bau-/Spec-Brief schreibt, der
  abweicht, MUSS begründen

## Disziplin

- KEIN Code-Eingriff, nur CLAUDE.md + PULS-Sitzungs-Eintrag.
- KEINE Doppel-Verankerung — Karte 16 § Reihenfolge und Brief #148
  § Hintergrund bleiben unverändert. CLAUDE.md ist zusätzliche
  zentrale Pflicht-Tafel.
- **Tafel-Evolutions-Klausel** (CLAUDE.md § „Heilige Tafeln") explizit
  referenziert: die Reihenfolge ist eine Tafel und darf von einer
  neuen Erkenntnis weiterentwickelt werden — aber nur mit explizitem
  Anpassungs-Antrag, nicht stillschweigend.

## Sichttest

Nicht nötig — keine Code-Änderung. Klaus' Pflicht-Leseliste in
CLAUDE.md ist visuell prüfbar (Tabelle erscheint nach Modul-Tabelle,
vor „Wenn du blockiert bist").

## Vorgemerkt

- Klaus startet Spec-Sitzung 16 mit Brief-Codeblock aus
  `BRIEF_SPEC_16_SIEGEL.md` (auf `main` seit PR #148).
- Branch dort: `claude/spec-16-siegel`.
- Die Spec-Sitzung 16 darf die CLAUDE.md-Reihenfolge-Tafel um die
  Bau-16-Brief-URL aktualisieren, sobald sie den Bau-Brief angelegt
  hat (Spalte „Brief liegt?" Schritt 2 von ⏳ auf ✅).

## Nächster sinnvoller Schritt

PR mergen → fertig. Tagesabschluss.
