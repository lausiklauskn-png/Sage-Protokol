# Brief — Spec-Sitzung 18 Sub (a) Vorab (Andocken-Pfad allein)

**Anlass:** Klaus' Klärung 2026-05-28 in der Plansitzung
Multisuchfeld: **Modul 18 Sub (a) Andocken-Pfad soll vor dem
Multisuchfeld umgesetzt werden** (Pipeline-Vorrang). Voll-Spec aller
neun Sub-Bereiche (Karte 18 § Sub-Bereiche a–i) ist zu groß für eine
einzelne Spec-Sitzung; eine **Vorab-Spec nur für Sub (a)** schließt
zwei konkrete Lücken sofort:

1. Der `[Andocken]`-Knopf im Modul-16-Bronze-Modal (Karte 16 § Sub e,
   live seit PR #180) zeigt heute „Modul 18 noch nicht verfügbar".
   Sobald `SbkimToolPwa.openAndockTab()` existiert, greift der bereits
   gebaute fail-soft-Check in Modul 16 produktiv — ohne weiteren
   Modul-16-Eingriff.
2. Das Multisuchfeld-Spec (Schwester-Brief
   `BRIEF_SPEC_SUCHFELD_MULTI.md`) setzt Sub (a) als Andock-Geste
   voraus, damit ein User aus dem Extern-/Hub-Discovery-Pfad direkt
   ein neues Geschwister andocken kann.

**Sitzungs-Typ:** Spec-Sitzung, **kein Modul-Code**. Schwester der
Voll-Spec-Sitzung 18 (kommt nach App-Freigabe). Sub-Bereiche (b)–(i)
werden in dieser Sitzung **explizit ausgeklammert**.

**Pipeline-Stellung:** Phase A Pipeline-Schritt **5h.1** (Klaus'
Bestätigung 2026-05-28 zur Tafel-Anpassung). Der bisherige
Phase-A-Schritt 5h wird in zwei Stufen geteilt:

- **5h.1** Spec + Bau Sub (a) Vorab (diese Sitzung + Folge-Bau)
- **5h.2** Voll-Spec + Voll-Bau Modul 18 (alle Sub-Bereiche, NACH
  App-Freigabe — Pipeline-Phase 6 / nach 5i abgeschlossen)

Tafel-Aktualisierungs-Antrag an Klaus separat (siehe § Tafel-
Aktualisierungs-Antrag unten); diese Sitzung schreibt KEINEN
CLAUDE.md-Eingriff selbst.

**Branch-Vorschlag:** `claude/spec-18-sub-a-vorab`

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Spec-Sitzung Modul 18 Sub (a) Andocken (Vorab — nur
Sub a, nicht b–i). Reine Doku/Spec-Arbeit, KEIN Modul-Code in src/.

PFLICHT-VERIFIKATIONS-SCHRITT (vor dem Spec-Schreiben):

1. git fetch origin && git checkout main && git pull origin main
   — sicherstellen dass main aktuell ist.
2. CLAUDE.md komplett, vor allem § Pipeline-Reihenfolge Phase A
   (Schritt 5h Voll-Spec 18) und § Pipeline-Reihenfolge Phase B
   (Schritt 9 Externer Mycel-Hub SB-KIMTool-Point).
3. docs/components/18_tool_pwa.md komplett — vor allem § Sub (a)
   Andocken (4-Schritt-Workflow + 3 offene Spec-Punkte) und §
   Such-Feld-Integration-Pattern (für Bezug zum Multisuchfeld-Brief).
4. docs/components/16_siegel.md § Sub (e) — Bronze-Hinweis-Block +
   [Andocken]-Knopf + fail-soft-Check auf SbkimToolPwa.openAndockTab.
5. docs/components/_mycel_hub.md — Externer Mycel-Hub als
   Discovery-Endpunkt für Sub (a) (Klaus' Klärung 2026-05-28: Sub (a)
   bekommt SB-KIMTool-Point-Bezug in Form des optionalen
   externalHubUrl-Parameters).
6. docs/INTERFACES.md § Module-Surface-Konventionen.
7. docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md (Schwester-Brief,
   liefert UI-Bezug für Sub (a) als Andock-Geste aus dem Discovery-
   Sektions-Knopf).

PFLICHT-DISZIPLIN:

- KEIN Modul-Code in src/.
- KEIN Endknoten-Eingriff.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE Voll-Spec der Sub-Bereiche (b)–(i). Diese Sitzung ist
  scope-disziplin: NUR Sub (a). Wenn ein Spec-Punkt aus (b)–(i)
  nötig ist, als „offene Frage für Voll-Spec 18" notieren.
- KEINE Tafel-Umsortierung CLAUDE.md ohne Klaus' Bestätigung —
  Klaus hat in der Plansitzung 2026-05-28 die Aufteilung 5h → 5h.1
  + 5h.2 explizit angeordnet. Die CLAUDE.md-Pflege ist eigene
  Folge-Pflege-Sitzung mit Klaus' OK; diese Sitzung schreibt
  CLAUDE.md NICHT.

DEINE AUFGABE — Drei offene Spec-Punkte aus Karte 18 § Sub (a)
final festlegen (alle anderen Punkte aus (b)–(i) liegenlassen):

1. **Endknoten-Init-Schema** — wie übergibt der Endknoten-Bauer
   die eigene Spore + Andock-Konfig an `SbkimToolPwa.init(opts)`?
   Spec entscheidet:
   - Pflicht-Felder in `opts` (typisch: endpoint, domain,
     domainKeywords, optional stammCategories/guestCategories,
     optional externalHubUrl).
   - Fail-soft-Verhalten bei fehlenden Feldern (console.warn?
     Throw? Default-Fallback?).
   - Idempotenz von init() (zweimal aufrufen → no-op?).
   - Surface-Funktionsname für Sub (a)-Trigger: `openAndockTab()`
     ist Modul-16-Vertrag (Karte 16 § Sub (e) Klick-Verhalten);
     Spec muss exakte Signatur festlegen (`openAndockTab(url?:
     string): Promise<void>` empfohlen).

2. **Embedding-Lazy-Trigger** — wann lädt Modul 03 (~30 MB)? Spec
   entscheidet:
   - Beim ersten `openAndockTab()`-Aufruf (lazy on demand)?
   - Beim init() proaktiv (eager, längerer App-Boot)?
   - Erst beim Klick auf „Match-Check"-Schritt im Andock-Wizard?
   - User-sichtbarer Progress-Indicator („Embedding-Modul lädt
     …" Spinner) verbindlich?
   - Wenn Embedding bereits über Modul 04.C registriert ist
     (Bau 04.C 2026-05-26 Endknoten-Korpus), Re-Use statt
     Re-Load.

3. **Match-Schwelle-UI** (`PROVIDER_MIN_MATCH` = 0.80, hartcodiert
   in Modul 04) — was passiert, wenn die Foreign-Spore unter der
   Schwelle liegt? Spec entscheidet:
   - Hartes Abbrechen mit Fehler-Modal („Match-Score 0.62 — zu
     niedrig für Andocken")?
   - UI-Warnung + Trotzdem-Handshake-Knopf („Match-Score 0.62 —
     trotzdem andocken? [Riskant]"-Block)?
   - Differenzierte Darstellung mit Drei-Schichten-Ansicht
     (matchDimensions aus Modul 04.A: fachlich/prozess/skalierung)
     + User-Entscheidungs-Begründungs-Hinweis?
   - Soll der Schwellen-Wert per `opts.matchThreshold` override-
     bar sein (User-Bauer-Pflicht)? Default bleibt 0.80.

Zusätzlich entscheiden:

4. **Modal-Form für Sub (a)** — wie sieht der 4-Schritt-Wizard
   aus? Spec entscheidet:
   - Stepper-UI (4 Schritte als Tabs/Punkte oben, „Weiter"-Knopf)?
   - Akkordeon (offene Sektion pro Schritt, voriger Schritt
     bleibt sichtbar)?
   - Single-Pane mit Live-Status-Updates pro Schritt?
   - Empfohlen ist Stepper analog Sage-Page-Andock-Wizard
     (index.html § Schwarz-Loch-Karte, Z. ~969–991) — aber
     **bewusst ohne** den Repo-URL-PR-Anker (das wird Modul-19-
     Pflicht in Phase B).

5. **Andocken aus Multisuchfeld-Discovery** — Klaus' Klärung
   2026-05-28: das Multisuchfeld zeigt Treffer aus dem
   Externen-Hub (SB-KIMTool-Point) UND aus dem Internet. Wenn ein
   Treffer ein potenzielles Andock-Ziel ist (= eine andere
   SBKIM-PWA), soll der Treffer einen „[Andocken]"-Knopf
   tragen, der direkt `SbkimToolPwa.openAndockTab(url)` aufruft.
   Spec entscheidet:
   - URL-Vorbelegung im Wizard-Schritt 1 (User muss nicht selbst
     tippen).
   - Erkennungs-Heuristik für „SBKIM-fähiges Treffer" — typisch
     `fetch(url + "/sbkim/spore.json")`-Probe vor dem Anbieten
     des Andocken-Knopfs (Sub (i) Spore-Discovery in Voll-Spec
     wird das übernehmen; Sub (a) Vorab bekommt nur die
     `openAndockTab(url)`-Signatur).

6. **SB-KIMTool-Point-Integration** (Klaus' Klärung 2026-05-28).
   Sub (a) Vorab muss die Andocken-Geste aus dem Externen Mycel-
   Hub-Discovery-Pfad unterstützen — d.h. `opts.externalHubUrl`
   ist ein optionaler Parameter, der der Spore-Discovery-Sektion
   (Sub i) den Hub-Endpunkt vorgibt. Spec entscheidet:
   - Default-Wert (null, oder fester URL
     `https://lausiklauskn-png.github.io/SB-KIMTool-Point/`?).
   - Format (`string` URL oder `string[]` für Multi-Hub-Setups?).
   - Sub (a) Vorab implementiert NICHT den Discovery-Fetch
     (das ist Sub i in Voll-Spec) — aber die `openAndockTab(url)`-
     Signatur muss URL-Parameter akzeptieren, damit Sub i und
     Multisuchfeld den Andock-Knopf einfach verdrahten können.

PFLICHT AM SITZUNGSENDE (CLAUDE.md § Pflicht am Sitzungsende):

- docs/components/18_tool_pwa.md erweitern: § Sub (a) Andocken
  mit den entschiedenen Punkten füllen; § Schnittstelle
  `openAndockTab(url?)` ergänzen; § Bauzustand „Spec Sub (a)
  Vorab gefüllt 2026-05-28 (oder Datum der Sitzung)"-Eintrag.
  Sub-Bereiche (b)–(i) bleiben UNVERÄNDERT als Skizze.
- docs/INTERFACES.md § 1 Modul 18: nur Sub (a)-Vertrag voll
  spezifizieren (Surface, Options, Errors). Sub (b)–(i) bleiben
  „Spec ausstehend".
- status.json modules-Eintrag Modul 18 bleibt `score:"schablone"`
  (Sub (a) allein ist noch kein „spec"-Voll-Stand).
- PULS-Eintrag mit Datum + getan + offen + nächster Schritt.
- Übergabeprotokoll docs/sessions/archiv/YYYY-MM-DD_spec-18-
  sub-a-vorab.md.
- Brief-Codeblock für die Folge-Bau-Sitzung Sub (a) Vorab in
  der finalen Chat-Antwort als Codeblock ausgeben (Klaus'
  Konvention 2026-05-21).
- Commit + Push auf claude/spec-18-sub-a-vorab.
- Draft-PR im Sage-Protokol-Repo.
- „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort.
```

---

## Hintergrund

Klaus' Andocken-Knopf-Schmerz: das SBKIM-Siegel-Modal zeigt seit Bau
16 Sub (e) (PR #180) einen `[Andocken]`-Knopf, der heute leer in die
Luft greift („Modul 18 noch nicht verfügbar"). Bei jedem
Bronze-Initial-Sichttest sieht Klaus diesen toten Knopf — eine
sichtbare Lücke im Mycel-Versprechen.

Eine Voll-Spec-Sitzung 18 mit allen neun Sub-Bereichen ist
substantiell — alleine das Such-Feld-Integration-Pattern in Karte 18
hat in der Tafel-Spec-Pflege 2026-05-26 eine eigene volle Sektion
(Klassifikations-Funktion + Sender-Helper-Code + UI-Pattern + Edge-
Cases) bekommen. Sub (b)–(i) sind ähnlich umfangreich. Eine
Vorab-Spec **nur für Sub (a)** ist die saubere Lösung.

**Pipeline-Vorrang vor Multisuchfeld** (Klaus' Klärung 2026-05-28):
Klaus hat in der Plansitzung 2026-05-28 explizit gesagt „vor dem
Suchfeld 18 umsetzen". Begründung (rekonstruiert):

- Der `[Andocken]`-Knopf im SBKIM-Siegel ist der visibelste tote
  Pfad in den live-Endknoten.
- Multisuchfeld-Extern-Modus zeigt Treffer aus dem Internet — wenn
  einer davon eine andere SBKIM-PWA ist, soll der User direkt
  andocken können. Ohne Sub (a) wäre dieser Treffer-Knopf nutzlos.
- SB-KIMTool-Point-Discovery (Externer Mycel-Hub, Phase B) braucht
  Sub (a) als Andock-Ziel-API. Klaus' Wunsch: SB-KIMTool-Point-Bezug
  schon in der Sub (a) Vorab-Spec verankern (`externalHubUrl`-Param).

## Tafel-Aktualisierungs-Antrag (an Klaus, eigene Folge-Pflege)

CLAUDE.md § Pipeline-Reihenfolge Phase A muss aktualisiert werden:

- **Aktuell** Schritt 5h: „Spec + Bau Modul 18 Tool-PWA-Container"
- **Neu** Aufteilung in:
  - **5h.1** Spec + Bau Modul 18 Sub (a) Vorab (Andocken-Pfad
    allein, Pipeline-Vorrang vor 5i Such-Feld-Integration und
    vor 5h.2 Voll-Spec)
  - **5h.2** Voll-Spec + Voll-Bau Modul 18 (alle Sub-Bereiche
    a–i, NACH App-Freigabe / Phase 6)
- **5i** Such-Feld-Integration-Pattern in Endknoten — wird auf
  **5i.1 Dual-Modus** (Briefe MR/MM bereits angelegt) +
  **5i.2 Multisuchfeld inkl. Extern** (siehe Schwester-Brief
  `BRIEF_SPEC_SUCHFELD_MULTI.md`) erweitert. 5i.2 setzt 5h.1
  voraus (Sub (a) Vorab muss laufen, damit der „Andocken"-Knopf
  im Extern-Treffer funktioniert).

Diese CLAUDE.md-Pflege ist **eigene Folge-Sitzung** — die aktuelle
Spec-Sitzung 18 Sub (a) Vorab macht sie NICHT. Klaus' explizite
Bestätigung der Aufteilung 2026-05-28 (im Chat dokumentiert in
PULS-Eintrag dieser Sitzung) ist der Anpassungs-Anker.

## Heilige Tafeln dieser Sitzung

- KEIN Modul-Code in `src/modules/18_tool_pwa.js`.
- KEIN Endknoten-Eingriff.
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- KEINE Voll-Spec der Sub-Bereiche (b)–(i).
- KEINE CLAUDE.md-Tafel-Umsortierung (eigene Folge-Pflege).
- KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Sub (a) Vorab ist Spec, kein
  Sicherheits-Modul-Update).

## Nach dieser Sitzung

- **Folge-Bau-Sitzung Sub (a) Vorab** — implementiert
  `src/modules/18_tool_pwa.js` mit nur `init` + `openAndockTab` +
  `close` + `isOpen` + `_meta`. CSS + Panel 18 in
  `tests/manual_check.html` + Headless-Smoke. Pipeline-Schritt
  5h.1 abgeschlossen.
- **Endknoten-Re-Migration mit Modul 18 Sub (a)** — Mein-Rezeptbuch
  + Mein-Mixarium bekommen `<script src="sbkim/18_tool_pwa.js">`
  + `SbkimToolPwa.init({…})`-Aufruf. Sichttest: Bronze-Modal-
  `[Andocken]`-Knopf greift live, öffnet 4-Schritt-Wizard.
- **Multisuchfeld-Spec-Sitzung** (Schwester-Brief
  `BRIEF_SPEC_SUCHFELD_MULTI.md`) kann erst danach in die
  Bau-Phase, weil sie Sub (a) Vorab als Voraussetzung hat
  (Extern-Treffer-„Andocken"-Knopf).
- **Voll-Spec-Sitzung 18** (Sub b–i) bleibt Phase 6 (nach
  App-Freigabe), Pipeline-Schritt 5h.2.

---

**Endstand-Codeblock für die Folge-Bau-Sitzung** (wird in der
Spec-Sitzung 18 Sub (a) Vorab am Ende geschrieben — Klaus kopiert
ihn als nächsten Brief):

```
[Wird in der Spec-Sitzung 18 Sub (a) Vorab am Sitzungsende als
Brief-Codeblock erzeugt, Konvention 2026-05-21.]
```
