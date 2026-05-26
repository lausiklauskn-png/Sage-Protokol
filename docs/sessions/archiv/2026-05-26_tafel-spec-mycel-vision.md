# Übergabeprotokoll — Tafel-Spec-Pflege Mycel-Vision (Klaus' Vision-Korrektur)

**Datum:** 2026-05-26
**Sitzungs-Rolle:** Hauptsitzung Tafel-Spec-Pflege (reine Doku-Pflege)
**Branch:** `claude/tafel-spec-mycel-vision`
**Auslöser:** Klaus' Vision-Klärung 2026-05-26 in mehreren Etappen
(Such-Feld als bidirektionales Cross-Knoten-Matching-Anker; mehrstufige
Mycel-Architektur Sage → Starter-Bundle → Externer Hub → Forker-PWAs;
Modul 04.C fehlt als kritischer Blocker; zweistufiger SIEGEL gegen
Henne-Ei-Problem).

---

## Was getan wurde

### Pepo-Demo-Studie (vorab)

WebFetch auf `lausiklauskn-png/semantic-match-demo`:

- ✅ **Übernehmbar als Pattern-Vorlage:** Symmetrie-Anforderung
  (Vier-Feld-Eingabe), Score-Ring (0–100% mit Farb-Schwellen), Drei-
  Dimensionen-Anzeige (entspricht Modul 04.A `matchDimensions`),
  Match-/Differenz-Listen, Confirm-Workflow.
- ❌ **NICHT übernehmbar:** WebRTC/PeerJS-Transport (Sage nutzt
  postMessage), Claude-API als zentrale Match-Engine (Sage rechnet
  lokal), Tablet-Hub-Vermittler-Modell (Sage hat dezentrale Peers).

Klaus' Klärung: Demo war Vorlage für eine andere Firma, nicht Sage-
Spec — aber die bidirektionale Match-Vision ist identisch.

### Karte 04 § Sub (c) `queryLocal` voll spec'd

- Signatur: `queryLocal(text, k?, options?) → Promise<Array<{label,score,anchorId}>>`
- Async (Modul 03 lazy), Default `k=5`, hartcodierte Schwelle
  `PROVIDER_MIN_MATCH=0.80`.
- Korpus zwei Pfade: `options.corpus` (Vorrang, für Tests) ODER
  registrierter `_corpusProvider`-Callback via
  `SbkimMatch.setLocalCorpus(corpus)`.
- Embedding via Modul 03 `embedQuery`.
- Top-k-Cut nach Filter+Sort.
- Fünf Fehler-Pfade benannt (EmptyQueryError / QueryTooLongError /
  InvalidKError / EmbeddingNotAvailableError / InvalidCorpusError;
  leerer Korpus + alle-unter-Schwelle resolved mit `[]`).
- Performance-Reserve < 10000 Korpus-Einträge.
- Cross-Knoten-Search-Hook auf Modul 15 Sub (b) ohne Code-Update
  (`typeof window.SbkimMatch.queryLocal === "function"`-Prüfung
  greift fail-soft automatisch sobald 04.C da ist).
- Selbstcheck-Zeile künftig fünf Funktionen.

### Karte 16 § Sub (e) Mycel-Verbindungs-Stufe voll spec'd

- Zweistufiger SIEGEL: Bronze („Mycel suchend") + Gold („Mycel
  verbunden").
- Modul 16 lauscht auf `sbkim:handshake outcome:"established"`,
  schaltet `_meta.mycelConnected:true`, re-rendert Badge.
- Visuelle Unterscheidung: gedämpfter Bronze-Ton (`#8C6E2F`) via
  saturate(0.6)-filter; Stufenwechsel-Animation 600 ms.
- Klick in Bronze öffnet Erklär-Modal mit Hinweis-Block + [Andocken]-
  Knopf (Modul 18 Sub (a) sobald gebaut).
- RAM-only-Persistenz (analog Modul 16 Persistenz-Klausel).
- Aspekt 4 „Mycel-Verbindung etabliert (erster Handshake)" in
  ZERTIFIKAT_ASPEKTE-Liste mit dynamischer Render-Variante (vor
  Handshake als „pending" markiert).
- § Strikte Tabus Klausel „Keine Stufen-Varianten" auf „Bronze/Gold-
  Stufung erlaubt seit 2026-05-26" angepasst (Tafel-Anpassung mit
  explizitem Anpassungs-Antrag; Silber/Platin/weitere bleiben
  verboten).

### Karte 18 Sub-Bereiche von 5 auf 9 erweitert + Such-Feld-Pattern

Vorher (5): a Andock-Geste / b Sporen-Installation / c Identitäts-
Wechsel / d Backup / e Self-Apoptose.

Nachher (9):
- (a) Andocken (URL eingeben, Spore fetchen, Match-Check, Handshake)
- (b) NEU Bidirektionaler Sporen-Informationsaustausch (Heterokaryose,
  ersetzt alte „Sporen-Installation")
- (c) Identitäts-Wechsel (unverändert)
- (d) Backup-Export + -Import (unverändert)
- (e) Self-Apoptose (unverändert)
- (f) NEU Sporen NEU generieren (`domainKeywords` ändern, neu
  signieren)
- (g) NEU Re-Embedding (Modul 03 lazy, Spore + Korpus neu rechnen)
- (h) NEU Manueller Handshake-Trigger aus Sibling-Liste (triggert
  SIEGEL Bronze→Gold-Wechsel)
- (i) NEU Spore-Discovery (Hub-Anfrage an Sage-`status.json` ODER
  Externer-Mycel-Hub-`status.json` ODER User-URL-Input)

Neuer Karten-Abschnitt § Such-Feld-Integration-Pattern mit:
- Pepo-Demo-Studie als Referenz (übernehmbar vs. nicht-übernehmbar)
- Sender-Helper-Code-Pattern (postMessage `op:"query"` an Sibling-
  Spore-Origin)
- UI-Pattern: lokale Treffer + Cross-Knoten-Treffer mit Verweis-Link
- Anker-Pfad-Konvention (URL-Fragment `#anchor=...`)

§ Schnittstelle `options.enabledTabs` von 5 auf 9 Werte erweitert +
`externalHubUrl` neu.

### Drei neue Stub-Karten

1. `docs/components/19_andock_wizard.md` — Andock-Wizard als
   kopierbares JS-Modul, extrahiert aus dem bestehenden Sage-Page-
   Wizard-Code (`index.html` Karte 4, Z. ~969–991). Einsatz: Sage UND
   Externer Mycel-Hub.
2. `docs/components/_starter_bundle.md` — Modul-Distributions-Repo,
   eigenes GitHub-Repo `sbkim-starter` (Name-Vorschlag). Pflicht-
   Module-Kern (01/02/03/04/05/07/15/16/17) + Optional-Module
   (06/08/18); Modul 19 NICHT im Bundle (gehört zum Hub). Tag-
   basierte Versionierung statt NPM.
3. `docs/components/_mycel_hub.md` — Externer Mycel-Hub als
   öffentliches Observatorium light für Forker-PWAs, eigenes
   GitHub-Repo `sbkim-hub` (Name-Vorschlag). Eigene `status.json`,
   eingebetteter Modul-19-Andock-Wizard.

### Drei neue Briefe

1. `BRIEF_BAU_04C_QUERY_LOCAL.md` (Phase-A-Bau)
2. `BRIEF_SPEC_19_ANDOCK_WIZARD.md` (Phase-B-Spec)
3. `BRIEF_SPEC_18_TOOL_PWA.md` aktualisiert (9 Sub-Bereiche + Such-
   Pattern-Pflicht in Spec-Aufgabe A)

### CLAUDE.md § Pipeline-Reihenfolge erweitert

Phase A (vor App-Freigabe, additiv zur bestehenden Pipeline):
- 5e Re-Aktivierung Modul 15+16 in MR/MM
- 5f Bau Modul 04.C `queryLocal`
- 5g Bau Modul 16 Sub (e) Bronze-Stufung
- 5h Spec + Bau Modul 18 Tool-PWA-Container (9 Sub)
- 5i Such-Feld-Integration-Pattern + Sender-Helper im Endknoten
- 5j Endknoten-Migration mit Modul 18 + Such-Feld

Phase B (nach App-Freigabe):
- 7 Spec + Bau Modul 19 Andock-Wizard
- 8 SBKIM-Starter-Bundle-Repo
- 9 Externer Mycel-Hub-Repo

Phase C (Forker-Test):
- 10 Pepo Semantic Match Demo via Starter-Bundle integrieren
- 11 Muttis Rezeptbuch via Starter-Bundle integrieren
- 12 Cross-Knoten-Such-Test Forker → Klaus' Mycel

§ Modul-Tabelle Eintrag 18 auf 9-Sub-Schema; Eintrag 19 NEU.

### status.json + Pie-Skript

- `lastUpdated:"2026-05-26"`.
- Neuer `mycelHubBacklog`-Pool mit drei Schablonen (Modul 19 +
  starter-bundle + mycel-hub).
- Modul 18-Eintrag um 9-Sub-Hinweis erweitert.
- `scripts/update_puls_pie.py` um `mycelHubBacklog`-Pool erweitert.
- `python3 scripts/update_puls_pie.py` aufgerufen.
- **Pie regeneriert: 21 Module total** (vorher 18) — 🟫 Schablone 8,
  🟧 In Werkstatt 0, 🟨 Spec fertig 0, 🟦 Code-Stub 9, 🟩 Fertig 4.

### INTERFACES.md § 10 Änderungsprotokoll

Voller Tafel-Spec-Pflege-Eintrag mit allen Karten-Erweiterungen +
neuen Karten + Briefen + CLAUDE.md/`status.json`-Änderungen.

---

## Was NICHT getan wurde (Disziplin)

- **KEIN Modul-Code** in `src/modules/`.
- **KEIN Endknoten-Eingriff** — externe Repos (Mein-Rezeptbuch /
  Mein-Mixarium) unangetastet.
- **KEINE Sage-Page-Änderung** — `index.html` nur als Code-Vorlage
  für Modul 19 referenziert, nicht modifiziert.
- **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump**.
- **KEIN Modul-02/05/15/17-Code-Eingriff**.
- **KEINE Tafel-Umsortierung CLAUDE.md** außer additiver Pipeline-
  Erweiterung (Phasen A/B/C ergänzt, alte Schritte 1–6 unverändert).

---

## Verifikation

- ✅ `python3 -c "import json; json.load(open('status.json'))"` — JSON
  valid.
- ✅ `python3 scripts/update_puls_pie.py` — Pie regeneriert, 21
  Module gezählt.
- ✅ Alle neuen Stub-Karten haben Vokabular + Bauzustand-Tabelle +
  Querverweise.
- ✅ CLAUDE.md Pipeline-Tabelle hat alle Phasen A/B/C als Schritt-
  Listen.
- ✅ Briefe 04.C + 18 + 19 haben Brief-Codeblock-Sektion.
- ✅ Übergabeprotokoll vollständig nach BRIEFING_TEMPLATE.md Konvention.

---

## Offene Punkte (Klaus muss entscheiden)

1. **Sichttest dieser Pflege** — Karten lesen (oder zumindest §
   Klaus-Festlegungen-Blöcke pro Karte); Pipeline-Reihenfolge in
   CLAUDE.md prüfen — passt sie zur Vision? Bei „grün" mergen.
2. **Repo-Namen finalisieren** (Spec-Sitzungen Phase B entscheiden):
   - `sbkim-starter` vs. `sbkim-bundle` vs. `sbkim-toolkit`
   - `sbkim-hub` vs. `sbkim-mycel-hub` vs. `mycel-observatorium`
3. **Hub-Pflege-Modell** (Spec-Sitzung Externer Mycel-Hub
   entscheidet): A) Klaus pflegt selbst / B) Community-Maintainer-Liste
   / C) Voll-Selbstpflege via Schutz-Module 10/11/12.

---

## Nächster sinnvoller Schritt

**Pipeline-Phase A Schritt 5f — Bau-Sitzung 04.C `queryLocal`.**

Brief liegt: `docs/sessions/BRIEF_BAU_04C_QUERY_LOCAL.md`. Branch-
Vorschlag: `claude/bau-04c-query-local`. Kritisch, weil Modul 15
Sub (b) ohne 04.C nicht funktioniert (bisher
`error:"module-04c-not-available"`).

Danach:
- Phase A Schritt 5e (Re-Aktivierung MR/MM)
- Phase A Schritt 5g (Bau 16 Sub e Bronze-Stufe)
- Phase A Schritt 5h (Spec+Bau Modul 18)
- Phase A Schritt 5i (Such-Feld-Helper in Endknoten)
- Phase A Schritt 5j (Endknoten-Migration mit Modul 18)
- Pipeline-Schritt 6 (App-Freigabe)
- Phase B (Modul 19 + Starter-Bundle + Externer Hub)
- Phase C (Pepo + Muttis Rezeptbuch + Cross-Knoten-Such-Test)
