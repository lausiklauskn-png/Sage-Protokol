# Übergabeprotokoll · 2026-05-18 · Spec — Plattform-Matrix (Brief 02 der V1-Sammelspec-Kaskade)

## Sitzungs-Rahmen

- **Rolle:** Spec-Sitzung (kein Code, kein Modul-Eingriff).
- **Branch:** `claude/spec-v1-plattform-matrix-pYusR` (Harness-
  Suffix; im Brief als `claude/spec-v1-plattform-matrix` geführt).
- **Auslöser:** Auslöser-Befehl aus dem Chat-Tab (Klaus-Regel
  Kaskaden-Konvention 6, 2026-05-18) plus
  `docs/sessions/BRIEF_02_plattform_matrix.md` als verbindlicher
  Brief-Volltext.
- **Quell-Spec:** `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
  § STRANG 4 (heraus-geschnitten als Brief 02 in der V1-Sammelspec-
  Kaskade — PULS § Archiv-Index „Meta-Pflege · V1-Sammelspec als
  Brief-Kaskade sequenziert").
- **Etappe in der Kaskade:** Brief 02 von 4 (Plattform-Matrix).
  Vorgänger: Brief 01 V1 Sage-Hybrid (PR #96, gemerged 2026-05-18,
  `main` bei `a3e0072`). Folge-Etappen: Brief 03 M04-Erweiterung,
  Brief 04 Multi-Identität, dann BRIEF_99-Abschluss.

## Was getan wurde

### 1. INTERFACES.md — drei neue Sub-Sektionen unter § 6

- **§ 6.1 Plattform-Matrix-Stub umgeschrieben** (Brief 01 hatte
  hier einen Verweis-Stub auf Brief 02 hinterlassen). Der Stub
  zeigt jetzt auf § 6.2 als realisierte Plattform-Matrix.
- **§ 6.2 Plattform-Matrix** (neu) — verbindliche Aufzählung der
  fünf Plattform-Profile, unter denen Endknoten heute laufen
  oder künftig laufen werden:

  | Plattform | IndexedDB | SW | Spore-Empfang | Identitäts-Backup | Stufe B | Beispiel-Knoten |
  |---|---|---|---|---|---|---|
  | Desktop-Browser | pro Profil | browser-SW | nur Tab offen | optional Container | ja (eigener Key) | Klaus' Sage-Page-Test |
  | DeX-Tablet | pro Profil | browser-SW | nur Tab offen | optional Container | ja | Mein-Mixarium / Mein-Rezeptbuch DeX-Chrome |
  | PWA-installiert | pro Profil | App-SW | Tab fest, längere Lebenszeit | optional Container | ja | Mein-Mixarium + Mein-Rezeptbuch (Variante 3b) |
  | Mini-Browser (V8) | eigene DB (App-Dir) | App-eigener | Tray-Modus, Hintergrund-OK | Datei-System | ja (Key im App-Dir) | Vision-Anker 8 |
  | Extension (V7) | Browser-DB geteilt mit PWA | Background-SW | Popup-Trigger, begrenzt | keine eigene, nutzt PWA-Container | ja im Popup | Vision-Anker 7 |

  Spalten-Glossar (IndexedDB / SW / Spore-Empfang / Identitäts-
  Backup / Stufe B / Beispiel-Knoten) mit präziser Begriffs-
  Festlegung pro Spalte. Sage-Anmerkung unter der Tabelle: Sage
  nimmt heute zwei Profile ein (Desktop-Browser vor Installation,
  PWA-installiert nach „Zur Startseite hinzufügen") — **nicht als
  eigene Zeile** in der Matrix, weil die Matrix Plattform-Profile
  beschreibt, nicht Endknoten. Pflicht-Frage-Anker für künftige
  Profile (neue Zeile muss alle sechs Spalten ehrlich belegen,
  Beispiel-Knoten-Feld konkret).

- **§ 6.3 Plattform-Ehrlichkeits-Klausel** (neu) — verbindliche
  Spec-Klausel mit vorgegebenem Wortlaut aus Brief 02:

  > „Sporen-Verhalten ist plattform-ehrlich: jede Spore trägt
  > implizit ihre Plattform (durch ihren `endpoint` und das
  > beobachtete Empfangs-Verhalten), kein Knoten lügt über
  > Hintergrund-Empfang oder Schlüssel-Sicherheit. Plattformen
  > mit ‚nur Tab offen' (Desktop-Browser, DeX-Tablet, PWA-
  > installiert) oder ‚Popup-Trigger' (Extension) sind ehrlich
  > offline-anfällig — Hintergrund-Empfang ist Vision-Anker 4
  > (Königin-Relay) vorbehalten und kein Pflicht-Bestandteil
  > des Protokolls."

  Zweiter Absatz: Begründung aus Klaus' Lehre 1 (Browser-
  Instanzen-Trennung, Pages-Live-Tests 2026-05-17, PULS § Anker
  1 Bezugs-Block). Bezugs-Dokumente
  `docs/OBSERVATORIUM_BROWSER.md` § Lehre 1 + PULS § Offene
  Querschnitts-Fragen „DeX-Chrome vs. Tablet-Chrome — zwei
  getrennte Browser-Instanzen". Verbindlich für jede künftige
  Plattform-Profil-Erweiterung.

- **§ 6.4 Vision-Bezüge** (neu) — Querverweis-Matrix mit sieben
  V1-Sammelspec-relevanten Vision-Ankern als zweizeilige Tabelle
  plus Erläuterungs-Absatz pro Anker:

  | V1 (Sage-Hybrid) | V9 (M04) | V6 (Multi-Id.) | V7 (Extension) | V8 (Mini-Browser) | V4 (Königin) | V5 (Container) |
  |---|---|---|---|---|---|---|
  | Träger | Stufe-B-Ort | Persona-Quelle | Toolbar-Lampe | Tray-Träger | Mailbox | Key-Speicher |

  Pro-Anker-Erläuterung benennt die Rolle im Plattform-Matrix-
  Kontext, NICHT die Spec des Ankers selbst. Anti-Vorgriff auf
  V4 / V5 / V7 / V8 / V9 / V6 streng eingehalten: Matrix
  verweist, spezifiziert nicht. Brief 03 (M04-Erweiterung) erbt
  die Spalte „Stufe B" als Schnittstellen-Eckdatum und füllt die
  Schichten + Brücke konkret.

### 2. INTERFACES.md — § 7 Änderungsprotokoll

- Neuer Eintrag „2026-05-18 · Spec-Sitzung Plattform-Matrix
  (Brief 02)" mit den drei Punkten a–c (§ 6.2 / § 6.3 / § 6.4)
  sowie Verweis auf Brief-01-PR (#96) als Vorgänger und auf den
  hier entstehenden Brief 03 (M04-Erweiterung). Der Eintrag
  steht direkt unter dem Brief-01-Eintrag (chronologisch).

### 3. PULS.md — neuer Sitzungs-Eintrag

- Neuer Top-Eintrag „2026-05-18 · Spec — Plattform-Matrix (Brief
  02 der V1-Sammelspec-Kaskade)" mit den vier Punkten a–d,
  Vorgänger-Verweis auf Brief 01, Heilige-Tafeln-Block,
  Konsistenz-Prüfungs-Notiz (PR #96 gemerged, PR #89 offen aber
  kollidiert nicht), Sichttest-Vermerk („ungeprüft, weil reine
  Doku-Pflege"), Nächster-Schritt-Vermerk (Klaus mergt + Brief
  03 starten).
- **Brief-01-Sitzungs-Eintrag in den Archiv-Index ausgelagert**
  (Vorletzten-Auslagerungs-Konvention) — Voll-Eintrag im
  Übergabeprotokoll `2026-05-18_spec-v1-sage-hybrid.md`, im
  Archiv-Index als Tabellenzeile oben mit Quintessenz-Stichworten
  + Verlinkung.
- Vision-Anker 1 § Status NICHT erneut angefasst (Brief 01 hat
  ihn auf „Strang 1 realisiert" gesetzt; Brief 02 ist Strang 4,
  ohne Bezug zum V1-Status-Block).
- Vision-Anker 4 / 5 / 7 / 8 / 9 / 6 unangetastet — Matrix
  verweist, spezifiziert nicht.

### 4. Brief 03 als letzte Datei-Aktion angelegt

- `docs/sessions/BRIEF_03_m04_erweiterung.md` mit Aufgabe Strang
  2 (M04-Erweiterung — drei Schichten + Brücke + doppelte Spore)
  aus BRIEF_SPEC_V1_SAMMELSPEC herausgeschnitten.
- **Pflichtleseliste** aktualisiert: eigener PR (Brief 02) +
  INTERFACES-Stand nach Brief 02 + Karten 02 / 04 / 06 + Briefe
  01 und 02 als Vorgänger-Belege + PULS-Anker-Querverweise (V9
  Haupt-Anker, plus V4 / V6 / V7 / V8 als Bezugs-Anker).
- **Kaskaden-Konvention 5** (Vorgänger-Konsistenz-Prüfung)
  explizit gefordert: Brief 03 muss prüfen, dass keine
  Korrekturen an Brief 01 (Endknoten-Liste) oder Brief 02
  (Plattform-Matrix) nötig sind, bevor M04-Spore-Schema und
  Match-API erweitert werden.
- **PROTOCOL_VERSION-Disziplin** geerbt: bleibt 0.1, solange
  `embeddingNeeds` und neue Match-Funktionen additiv sind; falls
  M04 ein altes Feld zur Pflicht erhebt (z.B. embedding →
  embeddingCapabilities als Pflicht-Rename), bumpt Brief 03 auf
  0.2 und nennt das explizit.
- **Kaskaden-Konvention 6** (Auslöser-Befehl im Chat) propagiert
  in Brief 03's „Pflicht am Ende" für die Brief-04-Sitzung.

## Heilige Tafeln eingehalten

- **INTERFACES verbindlich.** Brief 02 lebt rein in INTERFACES;
  CLAUDE.md / Karte 09 / `status.json` bleiben unangetastet
  (Brief 01 hat sie auf den Endknoten-Stand gebracht). Die
  Plattform-Matrix ist Spec-Block, kein Sage-Page-Karten-Eintrag
  oder Modul-Code.
- **PROTOCOL_VERSION-Disziplin:** Bleibt `"0.1"` — Strang 4 ist
  dokumentarisch additiv. Beim INTERFACES-Editieren ergab sich
  kein impliziter Pflicht-Hop, der einen 0.2-Bump rechtfertigen
  würde. Falls eine Folge-Sitzung beim M04- oder Multi-Identitäts-
  Bau feststellt, dass ein Plattform-Profil eine bisher
  übersehene Spore-Eigenschaft braucht, ist die Korrektur an
  Brief 02 in einem separaten Commit auf einem späteren Branch
  vorzunehmen (Konvention 5).
- **Plattform-Ehrlichkeits-Klausel als heilige Tafel der Matrix:**
  Eigener § 6.3-Absatz mit dem Brief-02-vorgegebenen Wortlaut +
  Begründung aus Lehre 1. Verbindlich für jede künftige
  Plattform-Profil-Erweiterung.
- **Anti-Vorgriff auf Anker 4 / 5 / 7 / 8 / 9 / 6:** Matrix-
  Zeilen (Mini-Browser V8, Extension V7) und Querverweis-Matrix
  in § 6.4 referenzieren die Anker, ohne sie zu spezifizieren.
  Königin-Relay (V4), Identitäts-Container (V5), Stufe B (V9),
  Multi-Identität (V6) haben eigene Spec-Sitzungen oder bleiben
  Vision.
- **Privatheit:** Anker 9 § Sorge ums Freigeben bleibt offen —
  Plattform-Matrix lässt die Lizenz-Frage unberührt.
- **Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention
  5):** Vier Punkte abgehakt — (1) Brief-01-PR #96 ist
  gemerged, `main`-Stand bei `a3e0072`; (2) INTERFACES § 6
  Endknoten-Liste + § 6.1 Sage-Endknoten — Sage-Page-Architektur
  + § 7 Änderungsprotokoll auf Brief-01-Stand; (3) V1-Endknoten-
  Eintrag aus Brief 01 in der Plattform-Matrix-Zeile gespiegelt
  (Sage = Desktop-Browser-Profil bzw. PWA-installiert-Profil je
  nach Andock-Zustand); (4) Keine Korrektur an Brief 01 nötig;
  (5) PR #89 (Karte 15 Membran als Stub, Draft, head
  `claude/browser-use-indexeddb-Jopiy`) bleibt unangetastet —
  eigener Modul-15-Block nach Modul 09 in INTERFACES, kollidiert
  nicht mit § 6.2 / § 6.3 / § 6.4 unter § 6.

## Was NICHT angefasst wurde

- **Modul-Code in `src/`** — Spec geht der Implementierung
  voraus. Kein Eingriff in irgendeinem Modul.
- **Sage-Page `index.html`** — Sage-Page-Refactor ist Bau-
  Sitzung nach Kaskaden-Abschluss (BRIEF_99-Liste). Plattform-
  Matrix-Zeile für Sage bleibt heute rein dokumentarisch.
- **Sage-Page-Karten** — KEINE Karte-15-/Karte-16-Erweiterung
  um eine „Plattform-Matrix"-Visualisierung. Sage-Page-Karten
  gehören zu Bau-Sitzungen.
- **M04-Erweiterung** (Spore-Schema, Match-API, Brücken-Feld) —
  das ist Brief 03. Karte 04 und Karte 02 bleiben unangetastet.
- **Multi-Identität-Spec** (`sbkim_keys`-Multi-Slots,
  `active-identity`-Marker) — Brief 04.
- **Königin-Relay-Spec** (Anker 4) — eigene Spec-Sitzung,
  bedingt Anker 13. Plattform-Matrix verweist nur.
- **Identitäts-Container-Spec** (Anker 5) — Matrix-Spalte
  „Identitäts-Backup" referenziert „Container" nur als Verweis.
- **Extension- oder Mini-Browser-Spec** (Anker 7 / 8) — Matrix-
  Zeilen referenzieren die Anker, Bau-Sitzungen kommen später.
- **CLAUDE.md** — Brief 01 hat sie auf „Hub und Knoten zugleich"
  umgeschrieben. Brief 02 ändert nichts.
- **Karte 09** (`docs/components/09_einbau_pwa.md`) — Brief 01
  hat § Schritt 1 erweitert. Brief 02 ändert nichts.
- **`status.json`** — Brief 01 hat Sage als drittes
  `endknoten[]`-Element aufgenommen. Brief 02 ändert nichts.
- **`update_puls_pie.py`** NICHT aufgerufen — keine
  `status.json`-Score-Wechsel.
- **`tests/manual_check.html`** unangetastet — kein Modul-
  Eingriff, keine UI-Erweiterung.

## Was offen blieb (für Folge-Sitzungen)

- **Brief 03 (M04-Erweiterung) als nächste Etappe.** Auslöser-
  Befehl im Chat-Tab; Brief-Datei
  `docs/sessions/BRIEF_03_m04_erweiterung.md` liegt im Repo.
  Pflichtleseliste enthält Brief 02-PR als gemerged-Voraussetzung.
- **Brief 04 (Multi-Identität)** folgt als vierte Etappe; Brief
  03 propagiert die Auslöser-Konvention 6 in seine „Pflicht am
  Ende".
- **BRIEF_99 (Sammelspec-Abschluss)** schließt die Kaskade nach
  Brief 04. Erst danach beginnt die Sage-Page-Refactor-Bau-
  Sitzung (`index.html`-Eingriff mit voller init()-Kette +
  Andock-Wizard an Schwarz-Loch-Karte).
- **Vision-Anker 4 / 5 / 7 / 8** bleiben Vision; eigene Spec-
  Sitzungen kommen nicht in der V1-Sammelspec-Kaskade, sondern
  in späteren Pflege-/Spec-Sitzungen (sobald Reife-Kriterien
  greifen — z.B. Königin-Relay nach erstem mehrtägigem Live-
  Cross-Knoten-Netz).
- **Mobile-PWA-Profil als Plattform-Matrix-Erweiterung** —
  wenn Klaus' Tablet-Chrome-Setup in ein dediziertes Plattform-
  Profil wandert (z.B. mit WebPush-Hintergrund), kann eine
  Folge-Pflege eine sechste Matrix-Zeile hinzufügen. Heute
  nicht akut — DeX-Tablet ist eine Zeile, Mobile-Browser
  würde eine weitere ergeben, sobald ein konkreter Beispiel-
  Knoten dort lebt.

## Nächster sinnvoller Schritt

**Auslöser-Befehl für Brief 03** (Kaskaden-Konvention 6, im
Chat-Tab am Sitzungs-Ende):

```
Lies docs/sessions/BRIEF_03_m04_erweiterung.md vollständig und
führe den Brief als nächste Sitzung in der V1-Sammelspec-
Kaskade aus. Konventionen siehe PULS § Archiv-Index „Meta-
Pflege · V1-Sammelspec als Brief-Kaskade sequenziert" (sechs
heilige Tafeln). Branch laut Brief (claude/spec-v1-m04-
erweiterung, vom main aus anlegen).
```

**Reihenfolge-Hinweis:** Brief 03 setzt Brief-02-PR (diese
Sitzung) als gemerged voraus. Wenn Klaus die Kaskade pausieren
will, kann die Brief-02-PR auf `main` ruhen, und Brief 03 wird
zu einem späteren Zeitpunkt gestartet — INTERFACES § 6.2 / 6.3 /
6.4 bleiben gültig, weil sie additiv sind.

## Manueller Sichttest

**Ungeprüft, weil reine Doku-Pflege.** Kein Modul-Code in
`src/`, kein `tests/manual_check.html`-Eingriff, keine Sage-
Page-Änderung, `status.json` unverändert,
`update_puls_pie.py` NICHT aufgerufen. INTERFACES.md ist
Spec-Tafel, kein Sichttest-pflichtiger Artefakt.

## Verlinkte Artefakte

- **Brief-Datei:** `docs/sessions/BRIEF_02_plattform_matrix.md`
- **Vorgänger-Brief:** `docs/sessions/BRIEF_01_v1_sage_hybrid.md`
- **Folge-Brief:** `docs/sessions/BRIEF_03_m04_erweiterung.md`
- **Quell-Spec:** `docs/sessions/BRIEF_SPEC_V1_SAMMELSPEC.md`
  § STRANG 4
- **INTERFACES neue Sub-Sektionen:** § 6.2 Plattform-Matrix,
  § 6.3 Plattform-Ehrlichkeits-Klausel, § 6.4 Vision-Bezüge
- **PULS-Eintrag:** § Sitzungs-Einträge, neuer Top-Eintrag
  „2026-05-18 · Spec — Plattform-Matrix"
- **Vorgänger-PR:** #96 „Spec: V1 Sage-Hybrid — Strang 1 der
  V1-Sammelspec-Kaskade" (gemerged 2026-05-18)
- **Paralleler PR:** #89 „Karte 15 Membran als Stub" (Draft,
  offen, kollidiert nicht)
- **PULS § Vision-Anker:** 1 (V1 Sage-Hybrid), 4 (Königin-
  Relay), 5 (Identitäts-Container), 6 (Multi-Identität), 7
  (Extension), 8 (Mini-Browser), 9 (M04-Erweiterung)
- **Bezugs-Dokumente:**
  - `docs/OBSERVATORIUM_BROWSER.md` § Lehre 1 (Browser-
    Instanzen-Trennung, Begründung der Plattform-Ehrlichkeits-
    Klausel)
  - PULS § Offene Querschnitts-Fragen „DeX-Chrome vs. Tablet-
    Chrome — zwei getrennte Browser-Instanzen"
