# Übergabeprotokoll — Meta-Pflege: V1-Sammelspec als Brief-Kaskade sequenziert

**Datum:** 2026-05-18
**Sitzungs-Rolle:** Meta-Pflege (headless, kein Modul-Code, keine
Spec-Erfindung).
**Branch:** `claude/meta-v1-spec-cascade-RE14a` (vom `main`-Stand
nach PR #91 + #92 Merges; PR #89 Karte 15 Membran parallel offen
und nicht berührt).

---

## Was getan

Aus der V1-Sammelspec (`docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`,
PR #91-Rekonstruktion) eine **Brief-Kaskade** etabliert: eine Folge-
Sitzung pro Strang, je ein PR, je ein Folge-Brief als Datei im Repo
statt im Chat-Tab. Diese Sitzung speccst nichts; sie definiert die
Konvention, dokumentiert sie und schreibt den ersten Strang-Brief.

### Phase 1 — Lesen (Pflichtleseliste)

- `CLAUDE.md` (Sitzungs-Disziplin, Pflicht am Sitzungsende, PR-
  Status-Pflicht „Vor dem nächsten Sitzungs-Brief").
- `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md` (vollständig — vier
  Stränge, Etappierungs-Vorschlag, Konvention der Heiligen Tafeln).
- `docs/sessions/BRIEF_SPEC_M04_ERWEITERUNG.md` (Header + Codeblock-
  Anfang, Stil-Referenz für den engeren Bruder-Brief).
- `docs/PULS.md` § Vision-Anker 1 (V1 Sage-Hybrid), Anker 9 (M04-
  Erweiterung), Anker 6 (Multi-Identität), plus § Sitzungs-Einträge
  2026-05-18 Mini-Pflege M04-Erweiterung als Brainstorming-Kontext.
- `docs/sessions/BRIEFING_TEMPLATE.md` (Format der Übergabe-
  protokolle).
- `docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md` (Stil-Referenz für
  Briefe im Repo).
- Nicht gelesen: `docs/INTERFACES.md`, Modul-Karten, Modul-Code,
  Sage-Page, paper-en.html (Token-Disziplin — die kommen in die
  Folge-Sitzungen).

### Phase 2 — Chat-Erklärung

5-8-Satz-Absatz in der Chat-Antwort am Sitzungs-Ende geschrieben
(siehe Chat-Tab). Erklärt: was die V1-Sammelspec inhaltlich tut
(vier Stränge in je einem Satz), warum Kaskade statt Marathon,
Strang-Reihenfolge mit Begründung, Brief-Datei-Schema, Kaskaden-
Schluss über Brief 99.

### Phase 3 — PULS-Eintrag

`docs/PULS.md` § Sitzungs-Einträge neuer Top-Eintrag „2026-05-18 ·
Meta-Pflege — V1-Sammelspec als Brief-Kaskade sequenziert" angelegt
(eingefügt vor dem Sonnen-Galaxie-Stationen-Eintrag, ohne den
vorletzten ins Archiv auszulagern — PULS-Zeilen-Status liegt vor
der Pflege bei 2596, nach der Pflege ~2730, deutlich unter der
3000er-Schutz-Klausel). Inhalte:

- Fünf heilige Tafeln der Kaskade (Konvention 1–5 wortgleich/sinnge-
  mäß aus diesem Brief).
- PROTOCOL_VERSION-Disziplin der Kaskade (bleibt 0.1 solange
  additiv).
- Gewählte Strang-Reihenfolge mit Begründung:
  1. Brief 01 — Strang 1 V1 Sage-Hybrid
  2. Brief 02 — Strang 4 Plattform-Matrix
  3. Brief 03 — Strang 2 Anker 9 M04-Erweiterung
  4. Brief 04 — Strang 3 Anker 6 Multi-Identität
  5. Brief 99 — Sammelspec-Abschluss + Bau-Brief-Liste
- Brief-Datei-Liste als Auftragsliste für die folgenden Sitzungen.
- Verweis auf Quell-Spec `BRIEF_SPEC_V1_SAMMELSPEC.md` und auf den
  engeren Bruder-Brief `BRIEF_SPEC_M04_ERWEITERUNG.md` (bleibt als
  Detail-Vorlage liegen, wird als alleinstehende Sitzung nicht mehr
  gezogen — Strang 2 läuft im Kaskaden-Lauf als Brief 03).
- Vermerk: PR #89 (Karte 15 Membran, Draft) berührt eine andere
  Karten-Spur, keine Kollision.

### Phase 4 — Brief 01 als Datei

`docs/sessions/BRIEF_01_v1_sage_hybrid.md` angelegt. Bauplan
parallel zu `BRIEF_BAU_SONNEN_GALAXIE.md`:

- Kopfblock mit Strang-Einordnung (1/4) und Verweis auf Quell-Spec.
- Codeblock mit dem ersten-Prompt-tauglichen Brief: Pflichtleseliste
  (sechs Quellen inkl. PULS § Vision-Anker 1 + PULS § Sitzungs-
  Einträge der Meta-Pflege), drei heilige Tafeln (INTERFACES-
  Disziplin, PROTOCOL_VERSION 0.1 additiv, Plattform-Ehrlichkeit-
  Vorgriff + Privatheit), Konsistenz-Prüfung VOR dem Eingriff
  (Kaskaden-Konvention 5), fünf Aufgaben-Punkte a–e (INTERFACES §
  Endknoten-Liste, `status.json` § endknoten Sage-Slot, CLAUDE.md
  „Hub und Knoten zugleich", Karte 09 § Schritt 1, PULS-Pflege +
  Vision-Anker-1-Status-Wechsel), „Was du NICHT tust" (kein Modul-
  Code, keine Sage-Page-Änderung, keine Plattform-Matrix/M04/
  Multi-Identität-Vorgriffe, kein domainVector-Wert wenn
  unberechnet, kein `update_puls_pie.py`).
- „Pflicht am Ende"-Sektion mit drei Pflichten: (1) übliche PULS-
  Pflege + Übergabe + Commit + Push + Draft-PR; (2) Schreibe als
  letzte Datei-Aktion `BRIEF_02_plattform_matrix.md` mit
  aktualisierter Pflichtleseliste (Brief 01 als Vorgänger, Brief-
  01-PR-Stand prüfen) und Kaskaden-Konvention 5; (3) Vorgeschlagene
  nächste Schritte als Chat-Block mit Brief 02 als ersten Schritt.
- Blockier-Klausel: HALTE AN + offene Frage in PULS § Anker 1.
- Hinweise außerhalb des Briefes: Konvention 1 (ein Strang = ein
  PR), Konvention 2 (Brief als Datei nicht im Chat — mit Lehre-
  aus-PR-#91-Anker), Bruder-Brief-Status, Hinweis auf PR #89
  Parallel-Stand, Sage-Page-Refactor erst nach Kaskaden-Abschluss.

### Phase 5 — Übergabe + PR

- Dieses Übergabeprotokoll
  (`docs/sessions/archiv/2026-05-18_meta-pflege-v1-sammelspec-kaskade.md`).
- Commit + Push auf `claude/meta-v1-spec-cascade-RE14a` (Branch laut
  Sitzungs-Vorgabe; konzeptuell beschreibt Klaus den Branch als
  `claude/pflege-meta-v1-sammelspec-kaskade`, der Harness-Branch ist
  RE14a).
- Draft-PR „Mini-Pflege: V1-Sammelspec als Brief-Kaskade sequenziert
  (Meta)" mit Body, der die Kaskade, die fünf heiligen Tafeln und
  die Brief-Datei-Liste auflistet.
- „Vorgeschlagene nächste Schritte"-Block im Chat am Sitzungs-Ende.

---

## Was offen blieb

Inhaltlich nichts aus dem eigenen Sitzungs-Auftrag — alle fünf
Phasen abgearbeitet. Offen für Folge-Sitzungen:

- Brief 02 (Plattform-Matrix), Brief 03 (M04-Erweiterung), Brief 04
  (Multi-Identität), Brief 99 (Sammelspec-Abschluss) sind noch
  nicht geschrieben — die werden von den jeweiligen Vorgänger-
  Sitzungen erzeugt.
- Anker-Status-Wechsel V1/V9/V6 von „Reif für Spec-Diskussion" auf
  „Strang … realisiert in PR #…" passiert in den Folge-Sitzungen,
  nicht hier.
- PR #89 (Karte 15 Membran, Draft) bleibt unverändert offen und ist
  unabhängig — Klaus entscheidet selbst über Merge / Schließung.

---

## Nächster sinnvoller Schritt

1. PR der Meta-Pflege mergen — damit `BRIEF_01_v1_sage_hybrid.md`
   und der PULS-Eintrag mit der Kaskaden-Konvention auf `main`
   liegen.
2. Neue Spec-Sitzung mit dem Brief-01-Codeblock im ersten Prompt
   auslösen (Branch `claude/spec-v1-sage-hybrid` vom `main`-Stand
   nach Merge).
3. Falls die Brief-01-Sitzung verzögert wird: optional Vision-Anker
   1 § Status in PULS auf „in Brief-Kaskade, Strang 1 wartet auf
   Auslösung" feinjustieren — nicht zwingend, weil die Meta-Pflege
   die Konvention schon hält.

---

## Konventions-Hinweis für Folge-Sitzungen

Jede Folge-Sitzung in der Kaskade liest beim Start:

- `docs/PULS.md` § Sitzungs-Einträge „Meta-Pflege — V1-Sammelspec
  als Brief-Kaskade sequenziert" (Konvention 1–5 + Brief-Datei-
  Liste).
- Den eigenen Brief (`BRIEF_<NN>_<NAME>.md`).
- Den unmittelbaren Vorgänger-Brief plus seinen Merge-Stand auf
  `main` (Konvention 5 — Konsistenz-Prüfung vor dem Eingriff).

Die letzte Folge-Sitzung schreibt KEINEN neuen Strang-Brief mehr,
sondern `BRIEF_99_SAMMELSPEC_ABSCHLUSS.md` mit der Bau-Brief-Liste
als nächste Kaskade.
