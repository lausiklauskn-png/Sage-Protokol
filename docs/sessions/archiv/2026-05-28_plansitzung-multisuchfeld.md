# Übergabeprotokoll — 2026-05-28 · Plansitzung Multisuchfeld (zwei Spec-Briefe)

**Sitzungs-Rolle:** Plansitzung. Reine Spec-Brief-Arbeit, kein Modul-
Code, kein Endknoten-Eingriff, kein `status.json`-Update, keine
CLAUDE.md-Tafel-Umsortierung (nur Anpassungs-Antrag in beiden
Briefen).

**Branch:** `claude/multisearch-field-spec-DXrva`

**Sitzungs-Zeit:** Klaus' Sitzungs-Beginn-Zeit nicht im ersten
Prompt angegeben (Konvention 2026-05-27 für Zeit-Abschätzung).

---

## Anlass

Klaus' Wunsch 2026-05-28 in der Plansitzung: das Endknoten-Suchfeld
soll **multi-modal** sein. Bisher decken die Briefe
`BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` + `_MM.md` (Pipeline-Schritt
5i.1 Dual-Modus) nur Lokal (Modul 04.C `queryLocal`) und Cross-
Knoten Mycel (Modul 15 Sub b `op:"query"`). Klaus will als dritte
Schicht **EXTERN** (Internet, Klaus' Begriff „Spuren").

Tafel-Konflikt: CLAUDE.md § „Was du nicht tust" verbietet Crawler /
Pulsation / Eigenanfragen ins offene Netz. Auflösung über die
Vier-Schichten-Lesart (CLAUDE.md-Pflege 2026-05-27): Empfangsmodus-
Prinzip gilt für die **Mycel-Schicht** (Schicht 1); Akquise gehört
in die **Pilz-Schicht** (Schicht 2). Extern-Such ist Pilz-Schicht-
Operation und tafel-konform unter vier Bedingungen (User-Geste,
eine Anfrage pro Aufruf, kein Persist ohne OptIn, kein Profiling).

## Klaus' Klärungen in der Sitzung

Drei Fragen via `AskUserQuestion` gestellt + Klaus' Antworten:

1. **Sitzungs-Scope:** „vor dem Suchfeld 18 umsetzen und in Den
   Plan Repo Idee SB-KIMTOOL-Point mit einbeziehen"
   → Modul 18 Sub (a) Andocken-Pfad muss **VOR** dem Multisuchfeld
   umgesetzt werden (Pipeline-Vorrang). SB-KIMTool-Point (Externer
   Mycel-Hub, Phase B Schritt 9) muss im Plan einbezogen werden.
   → Konsequenz: zwei Briefe statt einer; Sub (a) Vorab-Brief
   erstellt zusätzlich zum Multisuchfeld-Brief.

2. **UI-Modus-Wechsel:** „Was würdest du empfehlen, denke an
   Nutzer Die coole Ideen schätzen."
   → Klaus bat um Empfehlung. Vorschlag: **Variante D — drei
   Sektionen gestapelt mit Auto-Klassifikation + Knopf für Extern**.
   Begründung im Brief: macht Vier-Schichten-Lesart visuell sichtbar
   (User sieht Lokal / Mycel / Extern als drei Schichten),
   empfangsmodus-konform (Extern bleibt User-Geste), keine UI-
   Friction, erweiterbar (Score-Ring aus Pepo-Demo passt rein).

3. **Extern-Backend:** „Mehrere Backends parallel — Klaus
   entscheidet später"
   → Spec listet drei Pfade gleichwertig + Anti-Tracking-Disziplin;
   Voll-Spec entscheidet Default. Drei Pfade: DuckDuckGo Instant
   Answer API (kein API-Key), Brave Search API (User-Pflicht-Key
   analog 04.B), generischer Fetch-Helper (User-konfigurierbar).

## Verifikations-Pflicht-Schritt (CLAUDE.md-Pflege 2026-05-27)

Klaus' Befund 2026-05-27: vorherige Folge-Sitzungen haben aus
veralteten PULS-Einträgen + alten Stub-Listen kopiert → Doppel-
Arbeit. Diese Sitzung hat **vor** dem Schreiben verifiziert:

- `git fetch origin && git checkout main && git pull origin main`
  ausgeführt. main aktuell (HEAD `412a963` Bau Einladungs-Site,
  PR #188; davor `b41f5be` Plansitzung Mycel-Vision, PR #187).
- CLAUDE.md komplett gelesen, vor allem § Vier-Schichten-Lesart
  (Pflege 2026-05-27) + § Pipeline Phase A / B / C / D.
- `docs/PULS.md` § Schnellüberblick + die zwei jüngsten Sitzungs-
  Einträge (2026-05-28 Sichttest Einladung, 2026-05-27 Bau-
  Einladung, 2026-05-27 Plansitzung Mycel-Vision).
- `status.json` modules + toolPwaBacklog.
- `docs/components/18_tool_pwa.md` komplett (670 Zeilen — 9 Sub-
  Bereiche a–i + § Such-Feld-Integration-Pattern mit Dual-Modus-
  Klassifikation + Such-Helper + Sender-Helper + UI-Pattern +
  Anker-Pfad + Edge-Cases).
- `docs/components/16_siegel.md` § Sub (e) Bronze-Hinweis-Block +
  `[Andocken]`-Knopf + fail-soft-Check auf
  `SbkimToolPwa.openAndockTab` (PR #180 Bau Sub (e)).
- `docs/sessions/BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` + `_MM.md`
  (bestehende Dual-Modus-Briefe).

**Befund:** `BRIEF_SPEC_SUCHFELD_MULTI.md` existiert NICHT.
`BRIEF_SPEC_18_SUB_A_VORAB.md` existiert NICHT. Keine Doppel-
Arbeit, beide Briefe können neu angelegt werden.

## Was getan

### Brief 1 — `docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md`

Spec-Sitzung-Brief für Modul 18 Sub (a) Vorab (Andocken-Pfad
allein, Pipeline-Vorrang vor Multisuchfeld).

**Inhalt:**

- Anlass: zwei konkrete Lücken (Modul-16-Bronze-Modal-`[Andocken]`-
  Knopf ist tot; Multisuchfeld-Extern-Treffer-„Andocken"-Knopf
  braucht Sub (a) als Voraussetzung).
- Pflichtleseliste mit sieben Anker-Dokumenten (CLAUDE.md,
  Karte 18, Karte 16 Sub (e), Karte `_mycel_hub.md`, INTERFACES,
  Schwester-Brief `BRIEF_SPEC_SUCHFELD_MULTI.md`, etc.).
- Drei offene Spec-Punkte explizit final-zu-legen:
  1. **Endknoten-Init-Schema** — wie übergibt der Bauer Spore +
     Andock-Konfig an `SbkimToolPwa.init(opts)`.
  2. **Embedding-Lazy-Trigger** — wann lädt Modul 03 (~30 MB).
  3. **Match-Schwelle-UI** — UI-Verhalten bei `match() <
     PROVIDER_MIN_MATCH` (0.80).
- Drei Folge-Entscheidungen:
  4. **Modal-Form** (Stepper-UI empfohlen analog Sage-Page-Andock-
     Wizard, aber ohne Repo-URL-PR-Anker).
  5. **Andocken aus Multisuchfeld-Discovery** — `openAndockTab(url)`-
     Signatur akzeptiert URL-Parameter.
  6. **SB-KIMTool-Point-Integration** (Klaus' Klärung 2026-05-28)
     — `opts.externalHubUrl` als optionaler Parameter.
- Sub-Bereiche (b)–(i) explizit ausgeklammert (Voll-Spec 18 nach
  App-Freigabe, Pipeline-Phase 6).
- Pipeline-Anpassungs-Antrag (Schritt 5h → 5h.1 + 5h.2).
- Heilige Tafeln (KEIN Modul-Code, KEIN Endknoten, KEIN VERSION-
  Bump, KEINE CLAUDE.md-Pflege in der Spec-Sitzung selbst).

### Brief 2 — `docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md`

Spec-Sitzung-Brief für das Multisuchfeld (drei Modi + UI + Backend-
Mehrwahl + SB-KIMTool-Point-Bezug).

**Inhalt-Skelett (12 Aufgaben-Blöcke A–L):**

- **A. Drei Such-Modi formell verankern** (Lokal / Cross-Knoten /
  Extern).
- **B. Tafel-Konflikt-Auflösung verankern** (Vier-Schichten-Lesart
  als Spec-Basis, vier Bedingungen für Extern-Such als Pilz-
  Schicht-Operation).
- **C. UI-Modus-Wechsel (Empfehlung Variante D)** mit Skizze
  (drei Sektionen gestapelt, Klassifikations-Indikator, Backend-
  Dropdown im Extern-Block). Drei Alternativen explizit
  abgelehnt mit Begründung.
- **D. Klassifikation erweitern** um optionale dritte Stufe
  „Welt-Frage" (Heuristik via Substring oder lokal+mycel=0).
- **E. Schnittstelle / API** (Hybrid empfohlen: `runSearch` für
  Auto + `queryExternal` für User-Geste).
- **F. „Spuren"-Begriff klären** mit drei Lesarten (Such-
  historie / Sporen-Spuren / Internet-Spuren).
- **G. Externe-Such-Backend-Spec** mit drei Pfaden parallel +
  Anti-Tracking-Disziplin (DDG / Brave / generischer Fetch-
  Helper).
- **H. „Andocken"-Knopf in Extern-/Hub-Treffer** (Voraussetzung
  5h.1 Sub (a) Vorab).
- **I. SB-KIMTool-Point-Integration** (Klaus' Klärung) als
  vierte Sektion zwischen Mycel und Extern empfohlen.
- **J. UI-Pattern: drei (oder vier) Sektionen mit Score-Ring +
  Quelle-Marker** (Pepo-Demo-Stil).
- **K. Edge-Cases** (Endknoten-Pflicht-Tabelle mit 8 Lagen).
- **L. Strikte Tabus verbindlich verankern** (7 Tabus).

- Pipeline-Anpassungs-Antrag (Schritt 5i → 5i.1 + 5i.2; 5i.2
  setzt 5h.1 voraus).
- Heilige Tafeln (KEIN Modul-Code, KEIN Endknoten, KEIN Crawler,
  KEINE CLAUDE.md-Pflege in der Spec-Sitzung selbst).

## Heilige Tafeln eingehalten

- ✅ KEIN Modul-Code in `src/modules/` (Plansitzung).
- ✅ KEIN Endknoten-Eingriff (Mein-Rezeptbuch + Mein-Mixarium
  unangetastet).
- ✅ KEINE Sage-Page-Änderung in `index.html`.
- ✅ KEINE CLAUDE.md-Änderung (Pipeline-Anpassungs-Antrag bleibt
  in beiden Briefen als § Pipeline-Anpassungs-Antrag stehen;
  eigene Folge-Pflege-Sitzung mit Klaus' OK).
- ✅ KEINE neuen Karten in `docs/components/`.
- ✅ KEIN `status.json`-/Pie-Update.
- ✅ KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.
- ✅ KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Plansitzung, kein
  Sicherheits-Modul-Update).
- ✅ KEINE PII in beiden Briefen.
- ✅ KEIN Crawler / Pulsation / Eigenanfragen ins offene Netz —
  beide Briefe verankern Pilz-Schicht-User-Geste-Disziplin.

## Was offen blieb

- **Folge-Spec-Sitzung 18 Sub (a) Vorab** — Brief liegt, Branch
  `claude/spec-18-sub-a-vorab` vom `main` aus nach Merge.
  Pipeline-Vorrang vor Multisuchfeld.
- **Folge-Spec-Sitzung Multisuchfeld** — Brief liegt, Branch
  `claude/spec-suchfeld-multi`. SETZT VORAUS, dass 5h.1 (Sub a
  Vorab Spec + Bau) läuft.
- **Eigene Folge-Pflege-Sitzung CLAUDE.md** Pipeline-Reihenfolge
  Phase A anpassen (5h → 5h.1 + 5h.2; 5i → 5i.1 + 5i.2). Klaus
  hat in dieser Sitzung explizit OK gegeben („vor dem Suchfeld 18
  umsetzen") — als eigene schmale Pflege mit eigenem PR
  durchführen (Tafel-Evolutions-Klausel).
- **„Spuren"-Begriffs-Klärung** mit Klaus in der Spec-Sitzung
  Multisuchfeld (drei Lesarten im Brief; Lesart 1 „Such-Verlauf-
  Persist mit OptIn" wahrscheinlich, aber Klaus entscheidet).
- **PULS-Auslagerung** — PULS.md ist nach dieser Sitzung 3330
  Zeilen lang (Schutz-Klausel 3000 — bereits VOR dieser Sitzung
  192 Zeilen überschritten, jetzt 330). Eigene Auslagerungs-
  Pflege-Sitzung nötig (separat).

## Nächster sinnvoller Schritt

Klaus mergt PR dieser Plansitzung. Danach:

1. **Folge-Spec-Sitzung 18 Sub (a) Vorab** mit Brief
   `BRIEF_SPEC_18_SUB_A_VORAB.md` — Pipeline-Vorrang, kein Modul-
   Code.
2. **Folge-Bau-Sitzung 18 Sub (a) Vorab** danach — implementiert
   `src/modules/18_tool_pwa.js`.
3. **Endknoten-Re-Migration mit Modul 18 Sub (a)** (MR + MM, eigene
   externe Bau-Sitzungen) — Bronze-Modal-Andocken-Knopf greift live.
4. **Folge-Spec-Sitzung Multisuchfeld** mit Brief
   `BRIEF_SPEC_SUCHFELD_MULTI.md` — kann erst NACH (3) laufen.
5. **Folge-Bau-Sitzungen MR + MM Multisuchfeld** parallel.
6. **Cross-Knoten-Tri-Modus-Sichttest** (Klaus, in MR und MM
   parallel — Lokal + Mycel + Extern + Andocken bei SBKIM-fähigem
   Extern-/Hub-Treffer).

## Verweise

- **Brief 1:** `docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md`
- **Brief 2:** `docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md`
- **Karte 18:** `docs/components/18_tool_pwa.md` (Schablone, 9 Sub-
  Bereiche, § Such-Feld-Integration-Pattern)
- **Karte 16:** `docs/components/16_siegel.md` § Sub (e) Bronze/
  Gold mit `[Andocken]`-fail-soft-Check
- **Karte `_mycel_hub.md`:** `docs/components/_mycel_hub.md`
  (Externer Mycel-Hub SB-KIMTool-Point)
- **CLAUDE.md § Vier-Schichten-Lesart** (Pflege 2026-05-27): Mycel
  / Pilz / Mit-Bauer / Observatorium — Tafel-Basis für die Extern-
  Such-Erlaubnis.
- **Bestehende Dual-Modus-Briefe:**
  `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` + `_MM.md` (Vorgänger-
  Iteration 5i.1, decken Lokal + Mycel).
