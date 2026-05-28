# Übergabeprotokoll — Plansitzung Multisuchfeld + Modul 18 Sub (a) Vorab

**Datum:** 2026-05-28
**Sitzungs-Rolle:** Plansitzung (reine Doku/Spec-Vorbereitung, KEIN
Modul-Code, KEIN Endknoten-Eingriff).
**Branch:** `claude/multisearch-field-spec-ER2BL`

---

## Anlass

Klaus hat zwei Themen 2026-05-28 zur Spec-Vorbereitung mitgegeben:

- **Thema A — Multisuchfeld:** Suchfeld in den Endknoten-PWAs
  (Mein-Rezeptbuch, Mein-Mixarium) soll **multi-modal** sein: Lokal
  (Modul 04.C) · Mycel (Modul 15 Sub b op:"query") · Extern
  (Internet / Spuren).
- **Thema B — Modul 18 Sub (a) Vorab:** Der `[Andocken]`-Knopf im
  Modul 16 Sub (e) Bronze-Hinweis-Modal hängt fail-soft auf
  `SbkimToolPwa.openAndockTab`. Voll-Spec Modul 18 mit allen 9 Sub-
  Bereichen kommt nach App-Freigabe (Phase A 5h); Sub (a) Vorab
  schließt die Lücke jetzt.

Klaus' Befund 2026-05-27: vorherige Folge-Sitzungen haben aus
veralteten Stub-Listen kopiert und Doppel-Arbeit + Überschneidungen
produziert. Diese Sitzung beginnt deshalb mit einem strikten
Verifikations-Pflicht-Block.

---

## Verifikations-Pflicht (vor Brief-Schreiben)

1. `git fetch origin && git checkout main && git pull origin main`
   — main aktuell, **PR #187 + #188 gemerged** (Plansitzung
   Einladungs-Site + Bau Einladungs-Site mit Sage-Page-Mount).
2. CLAUDE.md komplett gelesen — Vier-Schichten-Lesart (Pflege
   2026-05-27) + Phase D (D.1 Agent-Bootstrap-Mechanik, D.2
   Pilz-Schicht-Wirtschaft) sind neu drin und für diese Plansitzung
   relevant (Tafel-Lösung Empfangsmodus-Konflikt für Web-Modus
   nutzt Schicht-2-Pilz-Akquise).
3. docs/PULS.md § Schnellüberblick + jüngste drei Sitzungs-Einträge:
   - 2026-05-28 Sichttest + Folge-Pflegen Einladung (in derselben
     Bau-Sitzung).
   - 2026-05-27 Bau-Sitzung Einladungs-Site.
   - 2026-05-27 Plansitzung Mycel-Vision-Erweiterung.
4. status.json modules + toolPwaBacklog gelesen. Modul 18 ist
   `score:"schablone"` mit 9 Sub-Bereichen.
5. Karte 18 Tool-PWA-Container KOMPLETT gelesen inkl. § Such-Feld-
   Integration-Pattern (Pepo-Demo-Studie + Dual-Modus-Klassifikation
   + Sender-Helper-Pattern + Edge-Cases). Karte ist die Vorlage für
   den Multisuchfeld-Brief — Multisuchfeld erweitert die Dual-Modus-
   Vorlage um den Web-Modus.
6. Karte 16 § Sub (e) — Modal-Bronze-Hinweis-Block mit `[Andocken]`-
   Knopf + fail-soft-Check `typeof window.SbkimToolPwa?.openAndockTab
   === "function"` bereits seit PR #180 (Bau 16 Sub e) eingebaut.
7. Bestehende Suchfeld-Briefe MR + MM (`BRIEF_BAU_ENDKNOTEN_SUCHFELD_
   MR.md` + `_MM.md`) decken nur Lokal + Mycel — Web-Modus ist die
   neue Erweiterung.

**Befund:** kein `BRIEF_SPEC_SUCHFELD_MULTI.md` existiert noch —
Multisuchfeld-Brief ist eine NEUE Aufgabe, keine Doppel-Arbeit.
Modul 18 Sub (a) Vorab-Brief existiert ebenfalls noch nicht.

---

## Klaus' Festlegungen 2026-05-28 (per AskUserQuestion)

### A) UI-Modus-Wechsel im Suchfeld

Klaus' Antwort: „Symbolschalter innerhalb des Suchfeldes unter der
Texteingabe nebeneinander es ist hochgenug dafür nicht höher machen
keinen zusätzlichen Platz dafür verwende, im Suchfeld integrieren.
nofalls mit symbolen arbeiten und tooltips erklären wo die suche
Stattfindet, bei klick verändert sich die Farbe der Symbole.von
grau in die jeweilige aktive Farbe."

**Brief-Anker:**

- Drei Symbol-Schalter UNTER der Texteingabe IM Suchfeld
  nebeneinander.
- Kein zusätzlicher Höhen-Bedarf (Suchfeld bleibt schmal).
- Tooltips beschreiben die Such-Quelle (nicht das technische Modul).
- Default-Farbe grau, Klick wechselt auf modus-spezifische
  Aktiv-Farbe.
- Multi-Aktiv erlaubt (mehrere Modi gleichzeitig).
- Mindestens ein Schalter muss aktiv sein (letzter ist nicht
  deaktivierbar — UI-Disziplin).

**Symbol-Vorschlag in der Brief-Tabelle:** Lupe-Solid (Lokal, Mycel-
Grün) · Mycel-Symbol drei verschlungene Hyphen-Bögen (Mycel, Gold)
· Globus (Web, Stahl-Blau). Bau-Sitzung entscheidet finale Glyphen.

### B) Modul 18 Sub (a) Vorab

Klaus' Antwort: **Ja, Sub (a) vorab-Brief.**

**Brief-Anker:**

- Eigener Brief `BRIEF_SPEC_18_SUB_A_VORAB.md` neben dem
  Multisuchfeld-Brief.
- Minimal-API `SbkimToolPwa.openAndockTab(url?)` + `init`/`close`/
  `isOpen`/`_meta`.
- Vier-Schritt-Andock-Workflow aus Karte 18 § Sub (a).
- Drei offene Spec-Punkte für die Spec-Sitzung:
  1. Embedding-Lazy-Trigger (a/b/c, Empfehlung b — lazy beim
     Match-Check).
  2. Match-Schwelle-UI (a/b/c, Empfehlung b — Drei-Stufen).
  3. Endknoten-Init-Schema (a/b/c, Empfehlung c — Mischung Spore-
     Default + Override).
- Strikte Abgrenzung: KEINE Sub-(b)–(i)-Funktionen, KEIN
  Tab-Switch, kein voller Tool-PWA-Container.

### C) Treffer-UI

Klaus' Antwort: „Lokal soll gleich zum Ergebnis Springen,
(Rezept/Getränk) Mycell soll Die Drei Layer mit %tualen
übereinstimmung der Suche wie geplant Semantisch Technisch und noch
eine übereinstimmung die zeigt wie Hoch die übereinstimmungen mit
der semantischen suche sind. Schon wie geplant eine Semantische
Bidirektionales KI Matching/Mycel" sollte auch übers internet
Verbundene Sporen/Knoten finden. Ansonsten unified-Liste, bei klick
auf web sollten schon externe Knoten mit angeführt werden sollte
auch gehen."

**Brief-Anker:**

- Unified-Liste mit Quellen-Marker (drei Treffer-Quellen in
  derselben Liste, jede mit Marker).
- Lokal-Treffer springen direkt zum Anchor, wenn (a) nur Lokal
  aktiv ist UND (b) Score ≥ 0.95 ist UND (c) es genau einen
  Treffer gibt. Sonst Liste.
- Mycel-Treffer mit:
  - **Score-Ring** (Pepo-Demo-Pattern aus Karte 18 §): Kreis
    0–100 %, Farbe nach Schwelle (gold ≥ 70 / bronze 40–69 / rot
    < 40).
  - **Drei-Layer-Bars** für `matchDimensions` aus Modul 04.A
    (fachlich/technisch/skalierung).
  - **Gesamt-Score** als zentrale Zahl im Ring + zusätzlicher
    Klein-Text-Marker.
- Web-Modus mischt **Externer-Hub** (`<externalHubUrl>/status.json`)
  + **Sage-`status.json`** + **externe Web-API** (Adapter-
  Schnittstelle, Endknoten-Bauer wählt).
- Klick auf Web-Treffer öffnet in neuem Tab (`target="_blank"
  rel="noopener noreferrer"`).

---

## Tafel-Lösung Empfangsmodus-Konflikt

**Konflikt:** CLAUDE.md § „Was du nicht tust" verbietet „Crawler,
keine Pulsation, keine Eigenanfragen ins offene Netz". Web-Modus
fetcht aber das offene Netz.

**Lösung (Vier-Schichten-Lesart, CLAUDE.md § Pflege 2026-05-27):**

- **Schicht 1 Mycel** = Empfangsmodus + Antwortrecht. Empfangsmodus-
  Prinzip gilt für **diese** Schicht.
- **Schicht 2 Pilz** = Fruchtkörper oberirdisch. „Akquise gehört
  in die Pilz-Schicht, nicht ins Mycel."

**Extern-Such ist Pilz-Schicht-Akquise** — oberirdisch (sichtbar,
vom User initiiert), User-Geste-getriggert (jeder Fetch ein Klick),
kein Hintergrund-Crawl, kein Auto-Polling. Damit Tafel
**eingehalten, nicht umsortiert**: das Mycel bleibt Empfangsmodus,
die Pilz-Schicht darf akquirieren, weil sie per Definition genau das
ist.

**Konsequenz für Brief:** Web-Symbol ist **initial OFF**, muss
explizit vom User aktiviert werden — das ist die Permission-
Schwelle (User-Geste = Pilz-Schicht-Disziplin).

---

## Was getan

### 1. BRIEF_SPEC_SUCHFELD_MULTI.md angelegt

Voll-Skelett der Multisuchfeld-Spec, ~440 Zeilen, mit Sektionen:

- Anlass, Pipeline-Stellung (Phase A neue Schritte 5k + 5l), Branch-
  Vorschlag `claude/spec-suchfeld-multi`.
- **Tafel-Lösung Empfangsmodus-Konflikt** (Vier-Schichten-Lesart).
- **Drei Such-Modi formell** (Lokal · Mycel · Extern) mit Backend +
  Trigger + Verhalten + Empfangsmodus-Konformitäts-Check.
- **UI-Modus-Wechsel** mit Klaus' Festlegungen + Symbol-Tabelle +
  Multi-Aktiv-Logik + localStorage-Persistenz.
- **Treffer-UI** mit Lokal-Sprung-Anker, Mycel-Drei-Layer-Anzeige
  (Score-Ring + Bars + Gesamt-Score), Web-Modus-Drei-Quellen-Mix,
  ASCII-Diagramm der unified-Liste.
- **Externe-Such-Backend-Frage offen** mit API-Tabelle (DuckDuckGo /
  Brave / Bing / Generischer Adapter / Anthropic-Bridge), Spec-
  Empfehlung Adapter-Schnittstelle.
- **Anti-Tracking-Pflicht** als Tafel-Charakter.
- **Schnittstelle / API** mit Option A vs. B, Spec-Empfehlung
  eigenes Modul 20 statt 04.D-Erweiterung.
- **Strikte Tabus** (verbindlich).
- **Zehn offene Spec-Punkte** die in der Voll-Spec-Sitzung entschieden
  werden.
- **Folge-Briefe** nach Spec-Sitzung (Bau Modul 20 + zwei Endknoten-
  Bau-Briefe + optional 04.D-Pflege).
- **Brief-Codeblock** wortwörtlich für den ersten Prompt der Folge-
  Spec-Sitzung.
- Querverweise + Bauzustand-Tabelle.

### 2. BRIEF_SPEC_18_SUB_A_VORAB.md angelegt

Vorab-Spec für Modul 18 Sub (a), ~250 Zeilen, mit Sektionen:

- Anlass, Pipeline-Stellung (Phase A neuer Schritt 5m), Grund für
  Vorab statt Voll-Spec.
- **Was Sub (a) Vorab umfasst** — Minimal-API + Vier-Schritt-
  Andock-Workflow + Modal-Form-Skizze.
- **Drei offene Spec-Punkte** (Embedding-Lazy-Trigger / Match-
  Schwelle-UI / Endknoten-Init-Schema) mit Optionen + Spec-
  Empfehlung pro Punkt.
- **Strikte Tabus** (KEINE Sub b–i, KEIN Tab-Switch).
- **Was die Spec-Sitzung zu entscheiden hat** (acht Punkte).
- **Folge-Briefe** (Bau-Sitzung Sub a + optional Karte-09-Pflege +
  Endknoten-Bau-Briefe).
- **Brief-Codeblock** wortwörtlich für den ersten Prompt der Folge-
  Spec-Sitzung.
- Querverweise + Bauzustand-Tabelle.

### 3. PULS-Eintrag

Neuer Sitzungs-Eintrag oben in `docs/PULS.md` § Sitzungs-Einträge
mit Klaus' Festlegungen + Tafel-Lösung + getan + offen + nächster
Schritt.

### 4. Übergabeprotokoll

Diese Datei.

---

## Was offen blieb

- **Spec-Sitzung Multisuchfeld** (Branch
  `claude/spec-suchfeld-multi`) — Klaus startet sie. Sie
  entscheidet die zehn offenen Spec-Punkte, legt Modul-Karte 20
  (oder 04.D-Erweiterung) an, ergänzt INTERFACES.md + status.json +
  CLAUDE.md.
- **Spec-Sitzung Modul 18 Sub (a) Vorab** (Branch
  `claude/spec-18-sub-a-vorab`) — Klaus startet sie. Sie entscheidet
  die drei offenen Spec-Punkte + ergänzt Karte 18 § „Sub (a) Vorab-
  Spec (final)" + INTERFACES.md + status.json + CLAUDE.md
  Pipeline 5m.
- **Klaus' Browser-Sichttest** ist KEINE Pflicht in dieser
  Plansitzung (reine Brief-Anlage, kein Bau, kein UI).

---

## Heilige Tafeln eingehalten

- KEIN Modul-Code in `src/modules/`.
- KEIN Endknoten-Eingriff (MR / MM unangetastet).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- KEINE Tafel-Umsortierung CLAUDE.md (die neuen Pipeline-Schritte
  5k/5l/5m werden erst in den jeweiligen Folge-Spec-Sitzungen
  nach Klaus' Bestätigung in die Tabelle eingetragen — Tafel-
  Evolutions-Klausel: neue Erkenntnis darf alte Tafel
  weiterentwickeln, aber nur mit explizitem Anpassungs-Antrag).
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Brief-Anlage ist kein
  Sicherheits-Modul-Update — Konvention CLAUDE.md § „Sicherheits-
  Module pflegen Aspekte").
- KEINE PII (kein E-Mail, kein Klar-Name in Briefen oder
  Übergabeprotokoll).

---

## Nächster sinnvoller Schritt

Klaus startet eine der zwei Spec-Sitzungen. **Empfehlung:
Multisuchfeld zuerst** (Schritt 5k), weil Web-Modus-Spec mehr
Architektur-Klärungen braucht (Modul-Ortung 20 vs. 04.D, Adapter-
Schnittstelle, Drei-Pfad-Web-Suche). Sub-(a)-Vorab-Spec (Schritt
5m) kann parallel laufen — die zwei Sitzungen schneiden sich nicht
(Multisuchfeld berührt Modul 20 / 04 / 15; Sub-(a)-Vorab berührt
Modul 18 / 16 / 05).

Alternativ: Klaus startet die Sub-(a)-Vorab-Sitzung zuerst, wenn
ihm der produktive Andock-Knopf in MR + MM dringender ist (kleinere
Spec-Sitzung, schneller fertig — typisch 1–2 Stunden).
