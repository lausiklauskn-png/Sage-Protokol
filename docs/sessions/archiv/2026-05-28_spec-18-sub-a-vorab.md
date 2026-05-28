# Übergabeprotokoll — Spec-Sitzung 18 Sub (a) Vorab (Andocken-Pfad allein)

**Datum:** 2026-05-28
**Sitzungs-Rolle:** Spec-Sitzung (Pipeline-Phase A Schritt **5h.1**)
**Branch:** `claude/spec-18-sub-a-vorab-2oi16`
**Anschluss nach:** PR #189 (Plansitzung Multisuchfeld — Brief
`BRIEF_SPEC_18_SUB_A_VORAB.md` angelegt) + PR #180 (Bau 16 Sub e
Bronze/Gold-Modal mit fail-soft-`[Andocken]`-Knopf).

---

## Auftrag

Sub (a) Andocken aus Karte 18 § Sub-Bereiche **vorab** voll
spezifizieren, **ohne** die übrigen acht Sub-Bereiche (b)–(i) anzufassen.
Auslöser: Klaus' Klärung 2026-05-28 in der Plansitzung Multisuchfeld
— **„vor dem Suchfeld 18 umsetzen"**. Vorab-Spec schließt zwei
konkrete Lücken sofort:

1. Der `[Andocken]`-Knopf im Modul-16-Bronze-Modal (PR #180, Karte 16
   § Sub e) zeigt aktuell „Modul 18 noch nicht verfügbar". Sobald
   `SbkimToolPwa.openAndockTab()` existiert, greift der dort
   eingebaute fail-soft-Check produktiv — ohne weiteren Modul-16-
   Eingriff.
2. Das Multisuchfeld-Spec (Schwester-Brief
   `BRIEF_SPEC_SUCHFELD_MULTI.md`, Pipeline-Schritt 5i.2) setzt
   Sub (a) als Andock-Geste für Extern-/Hub-Treffer voraus.

Pipeline-Stellung: Phase A Schritt **5h.1** (Klaus' Bestätigung
2026-05-28 zur Aufteilung 5h → 5h.1 + 5h.2). Voll-Spec-Sitzung 18 für
Sub (b)–(i) folgt als Pipeline-Schritt 5h.2 NACH App-Freigabe.

---

## Was getan

### 1. Karte 18 § Sub (a) Andocken voll gefüllt

`docs/components/18_tool_pwa.md` Sub (a)-Block (Z. ~101+) komplett
spezifiziert. Sechs Entscheidungspunkte aus dem Brief beantwortet:

#### 1.1 Endknoten-Init-Schema

- **Pflicht-Felder** in `opts`: `endpoint` (string), `domain` (string),
  `domainKeywords` (string[]). Alle drei zusammen Voraussetzung für
  `_meta.ready=true`.
- **Optionale Felder**: `stammCategories`, `guestCategories`,
  `matchThreshold` (Default `PROVIDER_MIN_MATCH=0.80`, geclampt
  auf `[0, 0.80]`), `externalHubUrl` (`string | null`, Default
  `null`), `repoUrl` (Auto-Erkennung), `mountTarget` (`HTMLElement | null`,
  Default `document.body`).
- **Fail-soft-Verhalten**: fehlende Pflicht-Felder → `console.warn`
  mit konkreter Feld-Liste; KEIN Throw aus `init()`. `_meta.ready`
  bleibt `false`; `openAndockTab()` wirft dann synchron
  `ToolPwaNotReadyError`.
- **Idempotenz**: identische opts → no-op; geänderte Optional-Felder
  → `_meta` überschreiben (Modal-Mount unverändert); geänderte
  Pflicht-Felder → `console.warn` + neue `_meta`-Werte (laufender
  Identitäts-Wechsel ist Voll-Spec-18-Sub-(c)-Aufgabe, nicht Sub (a)
  Vorab).
- **Surface-Signatur Sub (a)-Trigger**: `openAndockTab(url?: string):
  Promise<void>`.

#### 1.2 `openAndockTab(url?: string): Promise<void>`-Signatur final

- **Sync vor `await`**: Validiert `_meta.ready === true` (sonst
  `ToolPwaNotReadyError`); wenn `url` übergeben, validiert sie als
  String mit gültigem `URL`-Konstruktor (sonst
  `ToolPwaInvalidUrlArgError`).
- **Promise resolved** wenn das Modal geöffnet ist und Wizard-
  Schritt 1 (bzw. 2 bei URL-Argument) sichtbar gemountet ist.
  NICHT erst nach Wizard-Abschluss.
- **`url`-Parameter optional**: wenn übergeben, springt der Wizard
  direkt zu Schritt 2 (Spore-Fetch) mit `url` als Eingabe-Wert.
  Ohne Argument startet Wizard mit leerem URL-Feld in Schritt 1.
- **Modal-bereits-offen-Verhalten**: gleicher `url` → no-op;
  anderer `url` → Reset auf Schritt 2 mit neuer URL.
- **Modul-16-Vertrag** (PR #180) bleibt: Bronze-Hinweis-Block-Knopf
  ruft `SbkimToolPwa.openAndockTab()` ohne Argument — Wizard öffnet
  dann leer in Schritt 1.

#### 1.3 Embedding-Lazy-Trigger

**Entscheidung: Lazy on demand beim ersten `openAndockTab()`-Aufruf**,
NICHT bei `init()`. Begründung: Endknoten ohne Andock-Bedarf laden
30 MB nicht zwangsweise; `init()` bleibt Boot-Pfad-schnell.

- **`init()`** lädt Modul 03 NICHT proaktiv. `_meta.embeddingReady=null`.
- **`openAndockTab()`** öffnet das Modal **sofort** — wartet NICHT
  auf Modul 03.
- **Wizard-Schritt 3 (Match-Check)** lädt Modul 03 lazy, falls noch
  nicht da. **Re-Use-Check zuerst**: wenn
  `window.SbkimEmbedding._meta.ready === true` (z.B. Modul 04.C-
  Pfad seit Bau 04.C 2026-05-26), KEIN Re-Load.
- **Progress-Indicator verbindlich**: Spinner-Icon im Schritt-3-
  Panel mit Text „Embedding-Modul lädt … (~30 MB, einmalig pro
  Tab-Session)". „Weiter"-Knopf disabled während Load.
  30 s Time-out-Warnung. Fail-soft mit „Erneut versuchen"-Knopf.
- **`_meta.embeddingReady`** Read-Anker für Tests:
  `null|"loading"|true|"failed"`.

#### 1.4 Match-Schwelle-UI

**Entscheidung: Differenzierte Drei-Schichten-Darstellung +
UI-Warnung mit Trotzdem-Andocken-Knopf** (NICHT hart abbrechen).
Begründung: `matchDimensions` (Modul 04.A) liefert vier Werte
(`overall` + drei Schichten); diese Granularität sichtbar zu machen
ist die Stelle, an der 04.A-Spec zur Wirkung kommt. Hartes
Abbrechen würde sinnvolles Andocken zwischen Schwester-Knoten
(z.B. Mein-Rezeptbuch ↔ Mein-Mixarium) verhindern, die in einer
Schicht stark sind aber in anderen schwach.

- **UI im Wizard-Schritt 3**: ASCII-Skizze in Karte 18 verankert.
- **Bar-Farben pro Schicht**:
  - `≥ matchThreshold` (Default 0.80) → grün (teal)
  - `≥ SCHICHT_MIN_MATCH` (0.60) → gelb
  - `< SCHICHT_MIN_MATCH` (0.60) → rot
- **Schwellen-Verhalten**:
  - `overall ≥ matchThreshold` → grün, direkter „Weiter zum
    Handshake".
  - `overall < matchThreshold` → gelb/rot Bars + „Trotzdem
    andocken"-Knopf + Warnungstext.
  - `DimensionsAllNullError` → Fehlermeldung, KEIN „Trotzdem"-Knopf.
- **`opts.matchThreshold` Override**: Default `PROVIDER_MIN_MATCH`,
  Endknoten-Bauer kann **reduzieren** (z.B. 0.60), kann NICHT
  erhöhen — Sanity-Check setzt > 0.80 auf 0.80 + `console.warn`.
  Strikte Tabu-Linie: wer strenger filtern will, baut Modul-10-
  Reputation, nicht Modul-18-Schwelle.

#### 1.5 Modal-Form Sub (a)

**Entscheidung: Stepper-UI** mit vier Schritt-Punkten oben
(`① URL — ② Spore — ③ Match — ④ Handshake`), Single-Pane-Body,
„← Zurück" + „Weiter →"-Footer.

- Aktiver Schritt in Edel-Gold (`var(--siegel-gold)` aus Modul 16
  § Sub b); erledigte Schritte mit Häkchen-Glyph; künftige in dunklem
  Bronze-Ink, nicht-klickbar.
- Voriger Schritt **nicht sichtbar** (Stepper-Disziplin), aber per
  „← Zurück"-Knopf erreichbar.
- **Schluss-Verhalten**: Backdrop-Klick / Esc / ✕ schließen. Bei
  offenen Wizard-Eingaben → Bestätigungs-Modal. Nach erfolgreichem
  Handshake → 2 s Bestätigung + auto-Close.
- **Theme**: PWA-Theme-CSS-Variablen analog Modul 16/17.
- **Bewusst ohne Repo-URL-PR-Anker** aus dem Sage-Page-Andock-Wizard
  (`index.html` § Schwarz-Loch-Karte) — das wird Modul-19-Pflicht
  in Phase B.

#### 1.6 Andocken aus Multisuchfeld-Discovery

- **`openAndockTab(url)`-Vertrag** mit dem Multisuchfeld: Treffer-
  Knopf ruft `SbkimToolPwa.openAndockTab(treffer.url)` direkt.
- **URL-Vorbelegung**: wenn `url` übergeben, vorbelegt + Sprung zu
  Schritt 2.
- **Erkennungs-Heuristik** für SBKIM-fähige Treffer liegt beim
  Aufrufer (`fetch(url + "/sbkim/spore.json")`-Probe in Multisuchfeld-
  Render oder Sub (i) Spore-Discovery in Voll-Spec 18), NICHT in
  Sub (a) Vorab. Sub (a) Vorab macht die echte Spore-Validierung
  in Wizard-Schritt 2 — der Aufrufer ist verantwortlich, „andocken"-
  fähige URLs zu liefern.
- **Fail-soft bei nicht-SBKIM-URL**: Schritt-2-Fehlermeldung
  („Spore-Datei nicht gefunden / nicht lesbar / nicht signiert");
  User wechselt via „← Zurück" zu Schritt 1.

#### 1.7 SB-KIMTool-Point-Integration

- **`opts.externalHubUrl`** als optionaler Parameter:
  - Default `null` (kein fester URL — Forker mit eigenem Hub müssen
    sonst overriden).
  - Format `string | null` (Single-Hub; Multi-Hub-Array bleibt
    Voll-Spec 18).
- **Sub (a) Vorab implementiert NICHT den Hub-Fetch** — `externalHubUrl`
  ist Read-Anker (`_meta.externalHubUrl`) für Sub (i) Spore-Discovery
  in Voll-Spec 18 und für das Multisuchfeld.
- **`openAndockTab(url)`-Signatur akzeptiert URL-Parameter**, damit
  Sub (i) und das Multisuchfeld den Andock-Knopf einfach verdrahten
  können (`fetch(externalHubUrl + "/status.json")` → `endknoten[]`
  → pro Eintrag `[Andocken]`-Knopf, der `openAndockTab(eintrag.endpoint)`
  ruft).

#### 1.8 Verhaltens-Tabu Auto-Polling

Klaus-Festlegung 2026-05-26 bleibt verbindlich: Sub (a) Vorab macht
KEINEN eigenen Sporen-Discovery-Fetch, KEINE Wiederhol-Versuche,
KEINEN periodischen Re-Check, öffnet sich NICHT automatisch beim
Boot. Drei Trigger-Quellen:
1. Modul-16-Bronze-Modal-`[Andocken]`-Knopf-Klick (PR #180).
2. Multisuchfeld-Treffer-`[Andocken]`-Knopf-Klick (Spec 5i.2).
3. Programmatischer `SbkimToolPwa.openAndockTab()`-Aufruf im
   Endknoten-UI.

### 2. Karte 18 § Schnittstelle Sub (a) Vorab-Vertrag

`docs/components/18_tool_pwa.md` § Schnittstelle Block komplett neu
geschrieben:

- **Surface Sub (a) Vorab final**: `init` + `openAndockTab` + `close` +
  `isOpen` + `_meta`. Sub (b)–(i) explizit als „Spec ausstehend in
  Voll-Spec 18" notiert.
- **Errors**: `ToolPwaNotReadyError` (aus `openAndockTab` sync vor
  `await`, mit Liste der fehlenden init-Felder in Message);
  `ToolPwaInvalidUrlArgError` (aus `openAndockTab(url)` sync, wenn
  url kein gültiger URL-String).
- **Wizard-interne Fehler** als UI-Hinweise pro Schritt (Tabelle mit
  Schritt → Verhalten), NICHT als JS-Errors aus `openAndockTab`.
- **`_meta` Read-Anker** komplett spec'd (13 Felder: `ready`,
  `endpoint`, `domain`, `domainKeywords`, `stammCategories`,
  `guestCategories`, `matchThreshold`, `externalHubUrl`, `repoUrl`,
  `embeddingReady`, `modalOpen`, `currentStep`, `lastFetchUrl`,
  `missingFields`).
- **`init(options)`-Form** Sub (a) Vorab-relevant aktualisiert (Sub
  (b)–(i)-Felder als auskommentierte Skizze; eine separate
  options-Form-Sektion mit Spec-Status-Marker).

### 3. Karte 18 § Strikte Tabus Sub (a) Vorab-Block

`docs/components/18_tool_pwa.md` § Strikte Tabus aufgeteilt in:

- **Sub (a) Vorab-Tabus (verbindlich)**: 7 Punkte (KEINE eigene
  Identität / KEIN Auto-Andock-Triggern / KEIN Hub-Fetch in Sub (a)
  Vorab / KEIN matchThreshold > PROVIDER_MIN_MATCH / KEIN Re-Init
  ohne console.warn / KEIN Modul-Pflicht-Check beim Bronze-Klick /
  KEIN PII-Render).
- **Sub (b)–(i)-Tabus (Spec-Vorbereitung)**: alte vier Punkte aus der
  Schablone behalten (KEINE Modul-Vorgaben / KEIN Backup-Passwort-
  Persist / KEIN Auto-Confirm bei Self-Apoptose / KEIN Bypass für
  Anti-Greenwashing-Klausel).

### 4. Karte 18 § Modal-Form Sub (a) Vorab-Stepper

`docs/components/18_tool_pwa.md` § Modal-Form aufgeteilt:

- **Sub (a) Vorab final**: Stepper-UI verankert.
- **Sub (b)–(i) Spec-Vorbereitung**: Tab-Container-Skizze behalten
  als Aufgabe für Voll-Spec 18; Verhältnis Sub-(a)-Wizard zu
  Sub-(b)–(i)-Tab-Layout als offene Frage notiert.

### 5. Karte 18 § Bauzustand und Status-Header

- **Status-Header** auf 🟨 Spec Sub (a) Vorab gefüllt (2026-05-28,
  Pipeline-Schritt 5h.1) gehoben (vorher 🟫 Schablone). Sub (b)–(i)
  bleiben Schablone.
- **Bauzustand-Zeile** „Spec Sub (a) Vorab gefüllt — 2026-05-28 —
  Spec-Sitzung 18 Sub (a) Vorab" am Listen-Ende ergänzt; alte Zeilen
  unverändert.

### 6. INTERFACES.md § 1 Modul 18 als neuer Eintrag

`docs/INTERFACES.md` § 1 unmittelbar nach Modul 17-Block (vor `## 2.
Datenformate (Querschnitt)`) neuer Modul-18-Vertrag-Block angelegt:

- **Status**: `entwurf (Sub (a) Vorab — Spec-Sitzung 18 Sub (a) Vorab
  vom 2026-05-28)`. Sub (b)–(i) explizit „Spec ausstehend in Voll-
  Spec 18".
- **Bietet (öffentlich) — Sub (a) Vorab**: `init` / `openAndockTab` /
  `close` / `isOpen` / `_meta` mit Inline-Doku.
- **options-Form Sub (a) Vorab-relevant**: Pflicht- und Optional-
  Felder, Sub (b)–(i)-Felder als Spec-Vorbereitung notiert.
- **Sub-Bereiche (b)–(i) Spec ausstehend**-Liste mit Verweis auf
  Voll-Spec 18 Pipeline-Schritt 5h.2.
- **Nutzt — Sub (a) Vorab**: Modul 02 (verifyForeignSpore + getOwnSpore),
  Modul 03 (lazy in Wizard-Schritt 3, Re-Use wenn 04.C ready), Modul
  04 (matchDimensions + providerMinMatch), Modul 05 (handshake),
  Browser-API (fetch + document.body).
- **Storage — Sub (a) Vorab**: KEINE eigenen Stores (RAM-only Closure-
  State analog Modul 16).
- **Events — Sub (a) Vorab**: keine eigenen — kein Dispatch, kein
  Abonnement. Andock-Trigger ausschließlich via öffentlich
  aufrufbares `openAndockTab()`.
- **Fehlerverhalten — Sub (a) Vorab**: zwei Errors aus `openAndockTab`
  + sieben Wizard-interne UI-Fehler.
- **Selbstcheck**: `MODUL 18 TOOL-PWA bereit, Sub (a) Vorab, Funktionen:
  init/openAndockTab/close/isOpen`.
- **Strikte Tabus — Sub (a) Vorab**: 6 verbindliche Punkte (gespiegelt
  aus Karte).
- **Hook-Punkte**: Modul 16 Sub (e) PR #180 fail-soft-Knopf;
  Multisuchfeld 5i.2; Sub (i) Spore-Discovery liest
  `_meta.externalHubUrl`.
- **Risiken**: 5 Punkte (URL-Spoofing / Embedding-Load-Fehler /
  Match-Schwelle-Override / Modal-Konflikt mit Modul 16 / Sub-(b)–(i)-
  Wechselwirkung).
- **Geprüft**: 2026-05-28 mit Spec-Snapshot.

### 7. `status.json` unverändert

Modul 18 bleibt `score:"schablone"`. Sub (a) allein ist noch kein
„spec"-Voll-Stand — Voll-Spec 18 (Pipeline-Schritt 5h.2) hebt es
später auf `score:"spec"`. `scripts/update_puls_pie.py` NICHT
aufgerufen (kein Score-Wechsel; Mermaid-Pie-Block in PULS.md
unverändert).

### 8. PULS.md Eintrag

Sitzungs-Eintrag „2026-05-28 · Spec-Sitzung 18 Sub (a) Vorab
(Andocken-Pfad allein)" am Anfang von `## Sitzungs-Einträge`
eingefügt (über dem 2026-05-28 Plansitzung-Multisuchfeld-Eintrag).

---

## Was NICHT angefasst

- KEIN Modul-Code in `src/modules/18_tool_pwa.js` (Datei existiert
  nicht; Bau-Sitzung 18 Sub (a) Vorab folgt).
- KEIN Endknoten-Eingriff (Mein-Rezeptbuch / Mein-Mixarium ziehen
  nach Bau Sub (a) Vorab in eigener Folge-Sitzung nach).
- KEINE `PROTOCOL_VERSION` / `DB_VERSION` / `BACKUP_FORMAT_VERSION`-
  Änderung (Sub (a) Vorab ist RAM-only Render-Schicht).
- KEINE Voll-Spec der Sub-Bereiche (b)–(i) — bewusst ausgeklammert.
  Offene Fragen für Voll-Spec 18 in Karte 18 § Sub (a) am Ende
  notiert (Heterokaryose-Slot-Wechsel-Interferenz, Identitäts-
  Wechsel-während-Wizard, Sub-(i)-Render-Form, Multi-Hub-Setups,
  Re-Handshake bei bestehendem Sibling).
- KEINE CLAUDE.md-Pflege — Klaus' OK zur Aufteilung 5h → 5h.1 + 5h.2
  liegt aus der Plansitzung 2026-05-28 vor, aber das Tafel-Update
  ist eigene Folge-Sitzung mit eigenem PR.
- KEINE Sage-Page-Änderung in `index.html`.
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag (Spec, kein Sicherheits-Modul-
  Update — Sub (a) Vorab ergänzt keinen Aspekt; Bau-Sitzung 18 Sub
  (a) Vorab ist auch kein Sicherheits-Modul, sondern ein Wartungs-
  /Andock-Modul).
- KEIN `update_puls_pie.py`-Lauf (kein Score-Wechsel).
- KEIN Modul-15/16/17-Code-Eingriff (Modul 16 fail-soft-Hook
  existiert seit PR #180; Modul 18 muss nur die erwartete Surface
  liefern).

---

## Nächster sinnvoller Schritt

**Folge-Bau-Sitzung 18 Sub (a) Vorab.** Implementiert
`src/modules/18_tool_pwa.js` mit nur Sub (a)-Surface
(`init`+`openAndockTab`+`close`+`isOpen`+`_meta`) + CSS für Stepper-
UI + Panel 18 in `tests/manual_check.html` (Setup + Andock-Modal-
Öffnen + URL-Eingabe + Spore-Fetch + Match-Bars + Handshake-
Simulation) + Headless-Smoke-Test. Pipeline-Schritt 5h.1
abgeschlossen wenn Klaus' Sichttest grün.

Brief-Codeblock für die Folge-Bau-Sitzung ist in der finalen Chat-
Antwort der Spec-Sitzung ausgegeben (Klaus' Konvention 2026-05-21).

**Danach:**

- Endknoten-Re-Migration mit Modul 18 Sub (a) (MR + MM bekommen
  `<script src="sbkim/18_tool_pwa.js">` + `SbkimToolPwa.init({…})`-
  Aufruf).
- Multisuchfeld-Spec-Sitzung (Pipeline-Schritt 5i.2, Brief
  `BRIEF_SPEC_SUCHFELD_MULTI.md` liegt) startet erst danach.
- Eigene Folge-Pflege-Sitzung CLAUDE.md Pipeline-Reihenfolge Phase
  A anpassen (5h → 5h.1 + 5h.2) mit Klaus' OK.
- Voll-Spec-Sitzung 18 (Sub b–i) Pipeline-Schritt 5h.2 NACH App-
  Freigabe.
