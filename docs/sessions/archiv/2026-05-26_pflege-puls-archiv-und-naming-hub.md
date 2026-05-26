# Übergabeprotokoll · 2026-05-26 · Doku-Pflege PULS-Archiv-Auslagerung + Hub-Naming `SB-KIMTool-Point`

**Sitzungs-Rolle:** Pflege-Sitzung (Doppel-Scope, beide Doku-only).
**Branch:** `claude/pflege-puls-archiv-und-naming-hub`.
**Anlass:** Klaus' zwei Anweisungen nach PR #175-Merge.

## Was getan

### A) Hub-Naming-Festlegung

Klaus hat das öffentliche Hub-Repo als `lausiklauskn-png/SB-KIMTool-Point`
public + leer angelegt (https://github.com/lausiklauskn-png/SB-KIMTool-Point).
Naming-Diskussion lief durch mehrere Optionen
(Mycel-Hafen / SBKIM-Hafen / Tool-Point-Dok / Node-Harbor / Mycelium-Dock /
Knot-Harbor / Fruchtkoerper / Sporen-Hafen). Klaus' Entscheidung
`SB-KIMTool-Point` referenziert das SBKIM-Akronym + den Sammelpunkt-Charakter
für Modul-18-Tool-PWAs.

Aktualisierte Dateien:
- `CLAUDE.md` § Pipeline-Schritt 9 — Repo-URL konkret
- `docs/components/_mycel_hub.md` — Header / Repo-Struktur-Skizze /
  Spec-Punkte Repo-Name+Owner / Bauzustand-Tabelle
- `docs/components/19_andock_wizard.md` § Schnittstelle — `hubRepo`-Option-Beispiel
- `docs/components/_starter_bundle.md` § Konfig-Template — Hub-URL-Beispiel
- `docs/sessions/BRIEF_SPEC_19_ANDOCK_WIZARD.md` — Hub-Repo-Pfad
- `status.json` `mycelHubBacklog[mycel-hub]` — Name + Kurz-Beschreibung

**Design-Entscheidung, was NICHT umbenannt wurde:**
- Pool-Name `mycelHubBacklog` (logischer Cluster für drei Items)
- Karten-Datei `_mycel_hub.md` (beschreibt die Rolle, nicht den Repo-Namen)
- `INTERFACES.md` § 10 Änderungsprotokoll (historisches Dokument)
- Sitzungs-Archiv-Dateien (read-only)

### B) PULS-Archiv-Auslagerung (Subagent-delegiert)

PULS.md war bei 5370 Zeilen (Schutz-Klausel max 3000). 33 Sitzungs-Einträge
vom 2026-05-25 / 2026-05-24 / 2026-05-22 / 2026-05-21 / 2026-05-20 wurden
aus dem Body gelöscht und als 1-Zeilen-Einträge im Archiv-Index-Tabelle
nachgetragen. Archiv-Index: 87 → 120 Zeilen.

Eine fehlende Archiv-Datei wurde retroaktiv angelegt:
- `docs/sessions/archiv/2026-05-24_pflege-16-wappen-korona.md` (Modul 16
  Wappen-Wechsel + Korona-Redesign, PR #154, hatte historisch kein
  Übergabeprotokoll). Inhalt aus dem ehemaligen PULS-Body-Eintrag übernommen.

**Im Body bleiben:** drei 2026-05-26-Sitzungs-Einträge (Tafel-Spec-Pflege
Mycel-Vision + Pflege Modul 17 Tooltips/Heartbeat + diese Pflege-Sitzung).

**PULS.md jetzt 2240 Zeilen** (< 3000 Schutz-Klausel).

## Verifikation

- ✅ `wc -l docs/PULS.md` → 2240
- ✅ `grep` auf `sbkim-hub` in nicht-historischen Doku-Dateien (außerhalb
  archiv/ + INTERFACES.md + PULS.md) → 0 Treffer
- ✅ `python3 -c "import json; json.load(open('status.json'))"` → JSON valid
- ✅ Karten + Briefe enthalten konkreten Repo-Pfad `lausiklauskn-png/SB-KIMTool-Point`

## Was offen

- **Sichttest** ungeprüft (reine Doku-Pflege, keine Sage-Page-/Modul-
  Code-Änderung — Klaus' Browser-Sichttest nicht erforderlich).
- Diese Pflege-Sitzung selbst wird im nächsten Auslagerungs-Schwung
  (vermutlich bei ≥ 2900 Zeilen wieder fällig) mit ausgelagert.

## Nächster sinnvoller Schritt

**Pipeline-Phase A Schritt 5f — Bau-Sitzung 04.C `queryLocal`.**
Kritisch, weil Modul 15 Sub (b) ohne 04.C nicht funktioniert.
Brief liegt: `docs/sessions/BRIEF_BAU_04C_QUERY_LOCAL.md`.

Spätere Sitzung: **Spec-Sitzung Externer Mycel-Hub** (Phase B Schritt 9) —
das angelegte leere Repo `lausiklauskn-png/SB-KIMTool-Point` wartet auf
Spec + initiale Hub-Landing-Page + Modul-19-Einbettung. Erfolgt erst NACH
App-Freigabe (Phase B).
