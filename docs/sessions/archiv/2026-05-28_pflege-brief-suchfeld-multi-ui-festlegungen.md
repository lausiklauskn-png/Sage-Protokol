# Übergabeprotokoll — Pflege Brief-Multisuchfeld (Klaus' UI-Festlegungen)

**Datum:** 2026-05-28
**Sitzungs-Rolle:** Pflege-Sitzung (reine Brief-Doku, KEIN Modul-
Code, KEIN Endknoten-Eingriff).
**Branch:** `claude/pflege-brief-suchfeld-multi-ui-festlegungen`

---

## Anlass

Parallel zur Plansitzung in PR #189 (gemerged 2026-05-28) lief eine
zweite Plansitzung auf Branch `claude/multisearch-field-spec-ER2BL`
mit identischer Aufgaben-Definition (Multisuchfeld-Brief +
Sub-(a)-Vorab-Brief). Beide Sitzungen erzeugten Dateien gleichen
Namens. PR #191 wurde am 2026-05-28 erstellt, traf auf Merge-
Konflikt und wurde nach Klaus' Entscheidung geschlossen — nicht
gemerged, nicht reopened.

Klaus' Anweisung 2026-05-28 nach Aufdeckung der Doppel-Arbeit (per
`AskUserQuestion` Option B): **„Inhalte aus #191 in #189-Briefe
einarbeiten (Pflege-PR)"** — separat von PR #191, auf die jetzt
gemergten #189-Brief-Dateien als Pflege-PR.

---

## Klaus' Festlegungen aus PR #191 (Anker für die Pflege)

Diese Festlegungen wurden in PR #191 per `AskUserQuestion` getroffen.
PR #189 hat sie nicht — der Brief dort empfiehlt UI-Varianten, die
diesen Festlegungen widersprechen oder sie offen lassen.

1. **UI-Modus-Wechsel:** „Symbolschalter innerhalb des Suchfeldes
   unter der Texteingabe nebeneinander es ist hochgenug dafür nicht
   höher machen keinen zusätzlichen Platz dafür verwende, im
   Suchfeld integrieren. nofalls mit symbolen arbeiten und tooltips
   erklären wo die suche Stattfindet, bei klick verändert sich die
   Farbe der Symbole. von grau in die jeweilige aktive Farbe."

2. **Treffer-UI:** „Lokal soll gleich zum Ergebnis Springen,
   (Rezept/Getränk) Mycell soll Die Drei Layer mit %tualen
   übereinstimmung der Suche wie geplant Semantisch Technisch und
   noch eine übereinstimmung die zeigt wie Hoch die übereinstimmungen
   mit der semantischen suche sind. Schon wie geplant eine
   Semantische Bidirektionales KI Matching/Mycel" sollte auch übers
   internet Verbundene Sporen/Knoten finden. Ansonsten unified-
   Liste, bei klick auf web sollten schon externe Knoten mit
   angeführt werden sollte auch gehen."

3. **Modul 18 Sub (a) Vorab:** „Ja, Sub (a) vorab-Brief" — wurde
   durch PR #189 (Brief) und PR #190 (Spec-Sitzung) bereits
   umgesetzt. Sub-(a)-Brief-Pflege NICHT mehr nötig.

**Bestätigung im Pflege-Verlauf (Klaus 2026-05-28 Folge-Antwort):**

> „Das soll so sein ; Symbol-Schalter unter Texteingabe +
> Klick-Farbwechsel; unified-Liste; Score-Ring + matchDimensions-
> Bars für Mycel-Treffer inkl Tooltips auch bei aktiv inaktiv/Suche,
> wenn aktiv und wenn nichtaktiv"

Daraus die **Tooltip-Schärfung**: Tooltips müssen in **allen
Schalter-Zuständen** verfügbar sein (aktiv, inaktiv, während
laufender Suche). Wortlaut-Variation pro Zustand ist Spec-Pflicht.

---

## Was getan

### 1. Pflege-Block am Brief-Anfang

Zwischen Branch-Vorschlag und Brief-Codeblock in
`docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md` ein neuer Abschnitt
**„Pflege 2026-05-28 — Klaus' UI-Festlegungen aus paralleler
Plansitzung"**. Inhalt:

- **Festlegung 1 — Symbol-Schalter IM Suchfeld:** Drei Schalter
  unter Texteingabe (Lupe-Lokal · Mycel-Glyph · Globus-Web), Klick-
  Farbwechsel grau → modus-spezifische Aktiv-Farbe, Tooltips in
  allen Zuständen (Klaus' Schärfung), Multi-Aktiv erlaubt, Default
  Lokal + Mycel aktiv (Web NICHT aktiv), `localStorage`-Persistenz
  pro PWA-Origin.
- **Festlegung 2 — Treffer-UI:** unified-Liste mit Quellen-Marker,
  Lokal-Sprung-Verhalten bei nur-Lokal-aktiv + Score ≥ 0.95,
  Mycel-Treffer-Pflicht-Darstellung (Score-Ring + Drei-Layer-Bars
  matchDimensions + Gesamt-Score), Web-Modus mischt drei Quellen
  in derselben Liste.
- **Daten-Schnittstellen-Erweiterungs-Vorschlag:** Modul 15 Sub b
  `queryResult.payload.results[i].dimensions?` optional + Modul 04.C
  `queryLocal(text, k, {withDimensions:true})` Opt-In.
- **Festlegung 3 — Web-Modus-Drei-Quellen-Mix:** DuckDuckGo / Brave
  / generischer Adapter (drei Backend-Pfade aus #189-Brief
  Abschnitt G) PLUS Externer Mycel-Hub `status.json` + Sage-
  `status.json` als Mycel-Extension-Pfade in derselben unified-Liste.
- **Sub-(a)-Vorab-Pflege-Hinweis:** NICHT nötig, PR #190 hat die
  Spec abgeschlossen.

### 2. Brief-Codeblock Abschnitt C (Klaus-Korrektur)

„Variante D — Drei Sektionen gestapelt mit Auto-Klassifikation +
Extern hinter Knopf" als **VERWORFEN** markiert. Symbol-Schalter-
Form als verbindlicher Ersatz benannt. Variante D bleibt als
Vergleichs-Anker stehen, damit die Spec-Sitzung den Begründungs-
Kontext kennt.

### 3. Brief-Codeblock Abschnitt J (Klaus-Korrektur)

Komplett überarbeitet:

- **Unified-Liste statt Sektionen.**
- **Vier Quellen-Marker:** → Geschwister-Name (Mycel) / → Externer
  Hub / → Sage-Mycel / ⌖ Web · API-Name.
- **Score-Ring + Drei-Layer-Bars + Gesamt-Score PFLICHT** für
  Mycel-Treffer (nicht offen pro Endknoten).
- **Lokal-Sprung-Verhalten verankert** (nur Lokal aktiv + Score ≥
  0.95 → direkter Anchor-Sprung, sonst Liste).
- **Daten-Schnittstellen-Erweiterungs-Hinweis** als Spec-
  Entscheidung markiert.

### 4. Sub-(a)-Vorab-Brief bewusst unangetastet

`docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md` braucht keine Pflege
— Spec-Sitzung 18 Sub (a) ist über PR #190 abgeschlossen, Karte 18
+ INTERFACES.md sind gepflegt. Eine Brief-Pflege ohne offene Folge-
Sitzung wäre Doku-Schmuck.

### 5. PULS-Eintrag

Neuer Sitzungs-Eintrag oben in `docs/PULS.md` § Sitzungs-Einträge
mit Klaus' Festlegungen, Was getan, Was offen, Tafel-Beobachtung
zur Doppel-Arbeit-Lehre.

### 6. Übergabeprotokoll

Diese Datei.

---

## Tafel-Beobachtung — Doppel-Arbeit-Lehre

PR #189 und PR #191 liefen am 2026-05-28 parallel an derselben
Aufgabe und produzierten zwei Brief-Versionen mit denselben
Dateinamen. Klaus' Verifikations-Block (CLAUDE.md § „Vor dem
nächsten Sitzungs-Brief") verlangt explizit PR-Listen-Check —
allerdings nur als Pflicht in Sitzungen, die aus `Befehl schreiben`
hervorgehen.

**Folge-Lehre für künftige Plansitzungen** (auch wenn nicht aus
`Befehl schreiben` startend):

- Am Sitzungs-Anfang `git fetch origin && git log --oneline
  origin/main -10` ausführen, parallele Sitzungs-PRs erkennen.
- `gh pr list --state open` (oder MCP-Äquivalent) zusätzlich zur
  Datei-Existenz-Prüfung, weil ungemergte Branches die Dateien
  noch nicht in main haben.
- Wenn parallele Sitzung mit identischem Thema erkannt: **stoppen
  und an Klaus melden**, NICHT parallel weiterarbeiten.

Diese Pflege ist die saubere Bereinigung des konkreten Falls;
strukturell könnte die CLAUDE.md-Klausel später um diesen Check-
Pfad ergänzt werden (eigene Folge-Pflege-Sitzung mit Klaus' OK).

---

## Was offen blieb

- **Folge-Spec-Sitzung Multisuchfeld** (Branch
  `claude/spec-suchfeld-multi`) — Klaus startet sie mit dem
  gepflegten Brief. Der Brief-Codeblock ist intern konsistent (UI-
  Festlegungen im Pflege-Block am Anfang + Klaus-Korrektur-Hinweise
  in Abschnitt C/J).
- **Pipeline-Reihenfolge:** Klaus entscheidet Sub-(a)-Bau-Sitzung
  Vorrang oder Multisuchfeld-Spec-Vorrang. Beide Sitzungen sind
  scope-disjunkt; eine kann der anderen vorausgehen.
- **CLAUDE.md-Tafel-Pflege Pipeline 5h.1 / 5i.1 / 5i.2** bleibt
  separate Folge-Sitzung mit Klaus' explizitem OK (steht so im
  #189-Brief § Pipeline-Anpassungs-Antrag).

---

## Heilige Tafeln eingehalten

- KEIN Modul-Code in `src/modules/`.
- KEIN Endknoten-Eingriff (MR / MM unangetastet).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- KEINE CLAUDE.md-Umsortierung.
- KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Brief-Pflege ist kein
  Sicherheits-Modul-Update).
- KEINE PII.
