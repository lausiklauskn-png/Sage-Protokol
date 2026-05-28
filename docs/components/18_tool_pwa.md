# Modul 18 — Tool-PWA-Container (SIEGEL-Anker)

> **Status:** 🟨 Spec Sub (a) Vorab gefüllt (2026-05-28, Pipeline-Schritt
> 5h.1) · Sub (b)–(i) Schablone (2026-05-26, Tafel-Spec-Pflege Mycel-Vision) ·
> Tool-PWA-Backlog · **Priorität:** Sub (a) Vorab vor App-Freigabe
> (Andock-Pfad für SIEGEL-Bronze-Hinweis-Block + Multisuchfeld);
> Sub (b)–(i) NACH App-Freigabe (Pipeline-Schritt 5h.2)  ·  **Schicht:**
> Wartungs- + Andock-Schicht für Endknoten-PWAs, getriggert durch
> Klick auf SIEGEL-Slot im Floating-Widget (Modul 17) ODER auf den
> Multisuchfeld-Treffer-`[Andocken]`-Knopf.
> **Datei (Code):** `src/modules/18_tool_pwa.js` (existiert noch nicht
> — Bau-Sitzung 18 Sub (a) Vorab folgt mit nur `init`+`openAndockTab`+
> `close`+`isOpen`+`_meta`. Voll-Bau Modul 18 NACH App-Freigabe.)

---

## Im Mycel-Bild

Wenn das SBKIM-Siegel auf einer Endknoten-PWA leuchtet, hat sich die
Hyphe als zugehörig zum Mycel bezeugt. Ein Klick auf das Siegel öffnet
einen **Tool-Schrank** an der Hyphe: drinnen liegen alle Werkzeuge, die
ein Knoten zur Selbstpflege braucht — Andock-Geste, Sporen-Installation,
Identitäts-Wechsel, Backup, Selbstlöschung. Der Schrank ist nicht das
Mycel und auch nicht der Pilz selbst — er ist die **Wartungs-Schicht**,
sichtbar an einem klar erkennbaren Anker (Siegel-Klick).

## Vokabular

- **Tool-PWA-Container** — Wartungs- + Andock-Modal-Suite, die per
  Klick auf den SIEGEL-Slot (Modul 17) geöffnet wird. Ersetzt das
  schmale Sub-(c)-Erklärungs-Modal von Modul 16 durch einen tiefer
  geführten Wizard-artigen Container.
- **Self-Inscribing-Tool** — Tool, das die Selbst-Bezeugung sichtbar
  und bedienbar macht. Klaus-Festlegung 2026-05-25: SIEGEL ist nicht
  nur Status-Anzeige, sondern auch **Aktions-Anker**.
- **Wartungs-Aktion** — eine der Operationen, die im Tool-PWA-
  Container ausgelöst werden können (siehe § Sub-Bereiche unten).
- **Andock-Anker** — die Geste, die die PWA zum SBKIM-Knoten macht
  (Identität + Spore + erste Anastomose). Analog Sage-Page-Andock-
  Wizard (siehe `index.html` § Schwarz-Loch-Karte).

## Warum jetzt (Hochstufungs-Begründung)

Klaus' Idee bei Sichttest 17 (2026-05-25): „SIEGEL sollte einen
abgerundeten Container haben, soll später als Tool gestalltete PWA
für das Andocken und Installieren der Sporen gestaltet werden". Damit
wandert Funktionalität, die bisher Sage-Page-spezifisch war (Andock-
Wizard, Identitäts-Container-Vision-Anker 5), in einen Endknoten-
einheitlichen Container, der via SIEGEL-Klick erreichbar ist.

Vorerst eine Idee — Endknoten-Re-Migration mit Standard-Modul-16-Modal
ist OK, der Tool-PWA-Container kommt **nach App-Freigabe** als Pflege.

---

## Zweck (knapp, Spec-Vorbereitung)

Der Tool-PWA-Container kapselt **Wartungs-Aktionen** einer SBKIM-Endknoten-
PWA in einem klar geführten UI:

1. Endknoten-Bauer muss kein eigenes Wartungs-UI schreiben.
2. Forker bekommen mit drei Zeilen Einbau (Modul 17 Widget + Modul 18
   Tool-PWA) ein voll bedienbares SBKIM-Toolset.
3. Endnutzer hat **eine** klar erkennbare Geste (Klick auf SBKIM-
   Siegel) für alle Wartungs-Operationen — keine versteckte 5-Klick-
   Geste, keine DevTools-Konsole.

---

## Klaus-Festlegungen 2026-05-25 + 2026-05-26 (vor Spec-Sitzung)

Klaus hat in der Stub-Anlage-Sitzung + der Tafel-Spec-Pflege Mycel-
Vision (2026-05-26) Spec-Punkte vorab festgelegt:

1. **Sub-Bereiche: alle neun** (erweitert von 5 auf 9 in Tafel-Spec-
   Pflege 2026-05-26) sind Pflicht-Bestandteil des Tool-PWA-
   Containers (a–i, siehe § Sub-Bereiche unten). Die Spec-Sitzung 18
   entscheidet nur noch die internen Details pro Sub-Bereich (Modal-
   Form, Schema, Risiken).
2. **Code lebt als Modul 18 in Sage-Protokol** — analog Modul 17.
   Jeder Endknoten kopiert die Datei (`src/modules/18_tool_pwa.js`)
   in sein eigenes `sbkim/`-Verzeichnis. Eigene Mini-Repo-Variante
   ist KEIN Ziel.
3. **Empfangsmodus-Prinzip wahren:** Andocken (Sub a) ist eine
   explizite User-Geste, **kein Auto-Polling** (Klaus' Klärung
   2026-05-26 als Antwort auf seine eigene Henne-Ei-Frage). Der
   Bronze-Stufen-SIEGEL (Modul 16 Sub e seit 2026-05-26) macht das
   SIEGEL klickbar auch ohne Mycel-Verbindung — d.h. Andock-Geste
   ist über SIEGEL-Klick → Modul 18 Sub (a) sofort erreichbar.

Diese Festlegungen sind Tafel-Charakter und bleiben in der Voll-
Spec-Sitzung 18 fix; die offenen Punkte unter „§ Sub-Bereiche (Spec-
Skizze, offen)" werden in der Voll-Spec auf Basis dieser drei
Festlegungen detailliert.

---

## Sub-Bereiche (Spec-Skizze, erweitert von 5 auf 9 in 2026-05-26)

Diese Liste ist eine **Vorschlags-Skizze** — die volle Spec-Sitzung 18
entscheidet die internen Details. Klaus' Festlegung 2026-05-26:
**alle neun Sub-Bereiche** sind Pflicht-Bestandteil des Tool-PWA-
Containers; optional ist nur die UI-Sichtbarkeit pro Tab.

### Sub (a) — Andocken (URL eingeben, Spore fetchen, Match-Check, Handshake)

> **Status:** 🟨 **Spec Sub (a) Vorab gefüllt 2026-05-28** (Spec-Sitzung
> 18 Sub (a) Vorab, Pipeline-Schritt 5h.1). Sub-Bereiche (b)–(i) bleiben
> Skizze; Voll-Spec 18 folgt NACH App-Freigabe (Pipeline-Schritt 5h.2).

Explizite Andock-Geste in vier Schritten:

1. **URL eingeben** (Geschwister-Repo, z.B.
   `https://lausiklauskn-png.github.io/Mein-Mixarium/`).
2. **Spore fetchen** (`fetch(url + "/sbkim/spore.json")`).
3. **Match-Check** (`SbkimMatch.matchDimensions(ownCap, ownNeeds,
   foreignCap, foreignNeeds)` → `overall ≥ matchThreshold`).
4. **Handshake** (`SbkimAnastomose.handshake(foreignSpore)`).

Sichtbar wie der Sage-Page-Andock-Wizard (`index.html` § Schwarz-Loch-
Karte), aber als modulares Tool **innerhalb** der Endknoten-PWA.

**Klaus' Klärung 2026-05-26 (Empfangsmodus-Prinzip):** Andocken ist
explizite User-Geste, **kein Auto-Polling**. Bronze-SIEGEL-Stufe
(Modul 16 Sub e) macht den SIEGEL klickbar auch ohne Mycel-
Verbindung, damit Andocken ohne Voraus-Voll-SIEGEL möglich ist.

#### Endknoten-Init-Schema (final, Spec-Sitzung 18 Sub (a) Vorab 2026-05-28)

Der Endknoten-Bauer übergibt Spore-Daten + Andock-Konfig via
`SbkimToolPwa.init(opts)`. **`opts` ist Pflicht** (init() ohne
Parameter wirft KEIN Throw, sondern resolved fail-soft mit
`_meta.ready=false` + `console.warn`).

**Pflicht-Felder in `opts`** (alle drei zusammen Voraussetzung für
`_meta.ready=true`):

| Feld | Typ | Beschreibung |
|---|---|---|
| `endpoint` | `string` | Eigener Endknoten-Origin + Pfad, z.B. `"https://lausiklauskn-png.github.io/Mein-Rezeptbuch/"`. Wird im Andock-Wizard als Absender-Identität angezeigt. |
| `domain` | `string` | Eigene Domain (z.B. `"Kochrezepte"`, `"Cocktails"`). Aus der eigenen Spore. |
| `domainKeywords` | `string[]` | Eigene Domain-Stichworte. Für den Match-Check (Lane 1 + Lane 2 der `matchDimensions`-Berechnung). |

**Optionale Felder in `opts`** (Sub (a) Vorab verankert die Signatur;
unbenutzte Felder werden in `_meta` als Read-Anker gespiegelt):

| Feld | Typ | Default | Beschreibung |
|---|---|---|---|
| `stammCategories` | `string[]` | `[]` | Eigene Stamm-Kategorien (aus Spore). Render-Anker im Wizard. |
| `guestCategories` | `string[]` | `[]` | Eigene Gast-Kategorien (aus Spore). Render-Anker im Wizard. |
| `matchThreshold` | `number` | `PROVIDER_MIN_MATCH` (0.80) | Override für die Match-Schwelle. **Empfangsmodus: Default bleibt 0.80**, Endknoten-Bauer kann reduzieren (nicht erhöhen — § Strikte Tabus). |
| `externalHubUrl` | `string \| null` | `null` | URL des Externen Mycel-Hubs (Karte `_mycel_hub.md`, Phase B). Sub (a) Vorab verarbeitet ihn NICHT (gehört Sub (i) Spore-Discovery in Voll-Spec 18); er wird ausschließlich in `_meta.externalHubUrl` gespiegelt, damit Sub (i) und das Multisuchfeld später ohne Re-Init darauf zugreifen können. **Multi-Hub-Setups** (Array) bleiben Voll-Spec 18 vorbehalten — Sub (a) Vorab akzeptiert nur `string \| null`. |
| `repoUrl` | `string` | Auto-Erkennung über `location.origin` + erstes Pfad-Segment | Source-Repo-URL für Aussteller-Klärung im Andock-Wizard-Bestätigungsschritt (analog Modul 16 § Repo-URL-Quelle). |
| `mountTarget` | `HTMLElement \| null` | `document.body` | Mount-Anker für das Modal. Default Self-Mount in `<body>` (analog Modul 15/16/17). |

**Fail-soft-Verhalten bei fehlenden Pflicht-Feldern:**

- **KEIN Throw aus `init()`**. `init()` resolved immer (Promise<void>).
- **`console.warn`-Zeile** mit der ID-Liste der fehlenden Felder:
  ```
  SbkimToolPwa.init fail-soft: Pflicht-Felder fehlen — endpoint, domainKeywords. Andocken bleibt inaktiv bis init({endpoint, domain, domainKeywords}) sauber durchläuft.
  ```
- **`_meta.ready` bleibt `false`**. `openAndockTab()` wirft dann
  beim Aufruf **synchron** (vor dem `await`) `ToolPwaNotReadyError`
  mit derselben ID-Liste in der Message.
- **Re-Init mit voll-Pflicht-Feldern** ist erlaubt — siehe Idempotenz
  unten. Das ist der einzige Weg, `_meta.ready` von `false` auf
  `true` zu heben.

**Idempotenz von `init()`** (analog Modul 16 + 17):

- **Zweiter `init()`-Aufruf mit identischen `opts` → no-op.** Resolved
  direkt mit dem gecachten `_meta`-Stand.
- **Zweiter `init()`-Aufruf mit veränderten `opts` →** Spec-Sitzung
  18 Sub (a) Vorab-Entscheidung: **identitäts-bezogene Re-Init**:
  - Pflicht-Felder unverändert (endpoint+domain+domainKeywords)
    + nur optionale Felder geändert → `_meta` wird sauber neu
    gesetzt (`matchThreshold` / `externalHubUrl` / `repoUrl` /
    `stammCategories` / `guestCategories` werden überschrieben),
    Modal-Mount unverändert.
  - Pflicht-Feld geändert → `console.warn` + neue `_meta`-Werte
    (no Throw). Endknoten-Bauer ist verantwortlich dafür, dass
    Pflicht-Felder bei Boot stabil sind; ein laufender Identitäts-
    Wechsel (Modul 02 `setActiveIdentity`) ist Voll-Spec-18 Sub
    (c)-Aufgabe und nicht Sub (a) Vorab.
- **Vor `init()`-Aufruf von `openAndockTab()`** → wirft synchron
  `ToolPwaNotReadyError` (Spec-Konvention analog Modul 15
  `MembraneNotReadyError`).

**Surface-Signatur für Sub (a)-Trigger** (verbindlich):

```js
openAndockTab(url?: string): Promise<void>
```

- **Sync vor `await`:** Validiert `_meta.ready === true` (wirft sonst
  `ToolPwaNotReadyError` sync). Validiert `url`, wenn übergeben
  (muss `string` mit gültigem `URL`-Konstruktor sein; sonst wirft
  `ToolPwaInvalidUrlArgError` sync).
- **Promise resolved** wenn das Modal geöffnet ist und Wizard-
  Schritt 1 sichtbar gemountet ist. NICHT erst nach Wizard-Abschluss.
- **`url` Parameter optional:** wenn übergeben, springt der Wizard
  direkt zu Schritt 2 (Spore-Fetch) mit `url` als Eingabe-Wert
  (URL-Vorbelegung). Wenn weggelassen, startet Wizard mit leerem
  URL-Eingabefeld in Schritt 1.
- **Modal ist bereits offen:** zweiter `openAndockTab()`-Aufruf
  mit gleicher `url` → no-op (Modal bleibt offen, kein Reset).
  Mit anderer `url` → Wizard-Reset auf Schritt 2 mit neuer URL.
- **PWA-Vertrag mit Modul 16:** der Bronze-Hinweis-Block-Knopf
  (Modul 16 § Sub (e), PR #180) ruft `SbkimToolPwa.openAndockTab()`
  ohne Argument. Modul 18 öffnet dann den leeren Wizard.

#### Embedding-Lazy-Trigger (final, Spec-Sitzung 18 Sub (a) Vorab 2026-05-28)

**Entscheidung: Lazy on demand beim ersten `openAndockTab()`-Aufruf**,
NICHT bei `init()`. Begründung:

- Endknoten ohne Andock-Bedarf (User öffnet das Tool-PWA nie) müssen
  die ~30 MB Modul-03-Modell-Last nicht zwangsweise tragen.
- `init()` ist Boot-Pfad-Operation — schneller App-Start wichtiger
  als Pre-Loading.
- Bronze-SIEGEL-Stufe (Modul 16 Sub e) wird auch ohne Modul 03 sichtbar
  (Surface-Check ist `lazy:true`-tolerant für 03).

**Konkret:**

1. **`init()`:** lädt Modul 03 NICHT proaktiv. `_meta.embeddingReady`
   wird `null` (unbekannt) gesetzt.
2. **`openAndockTab()`-Aufruf:** öffnet das Modal sofort (Schritt 1
   URL-Eingabe sichtbar) — das Modal **wartet nicht** auf Modul 03.
3. **Wizard-Schritt 3 (Match-Check):** ERST hier wird Modul 03 lazy
   geladen, falls noch nicht geschehen:
   - **Re-Use-Check** zuerst: Wenn `window.SbkimEmbedding._meta.ready
     === true` (Endknoten hat Modul 03 bereits über Modul 04.C-Pfad
     geladen; siehe Bau 04.C 2026-05-26 Endknoten-Korpus), **kein
     Re-Load** — Modul 18 nutzt den vorhandenen Embedder direkt.
   - Wenn Modul 03 noch nicht geladen → `await
     SbkimEmbedding.init()` (typisch 5–30 s je nach Netz).
4. **User-sichtbarer Progress-Indicator** (verbindlich) bei lazy
   Load:
   - **Spinner-Icon** im Schritt-3-Panel mit Text „Embedding-Modul
     lädt … (~30 MB, einmalig pro Tab-Session)".
   - **Disable** des „Weiter"-Knopfs während des Loads.
   - **Time-out-Warnung** nach 30 s („Lädt länger als erwartet —
     Netz prüfen?").
   - **Fail-soft-Behandlung** bei `EmbeddingLoadError`: Wizard-
     Schritt 3 zeigt Fehlermeldung, „Erneut versuchen"-Knopf
     ruft `SbkimEmbedding.init()` nochmal.

**`_meta.embeddingReady` Read-Anker** (Tests):
- `null` → noch nie aufgerufen
- `"loading"` → Lazy-Load läuft
- `true` → bereit (auch wenn über externe Init-Quelle)
- `"failed"` → Load fehlgeschlagen, retry möglich

#### Match-Schwelle-UI (final, Spec-Sitzung 18 Sub (a) Vorab 2026-05-28)

**Entscheidung: Differenzierte Drei-Schichten-Darstellung +
UI-Warnung mit Trotzdem-Andocken-Knopf** (NICHT hart abbrechen).

Begründung:

- `matchDimensions` (Modul 04.A, gebaut 2026-05-19) liefert vier
  Werte zurück: `overall` + drei Schichten (`fachlich`, `prozess`,
  `skalierung`). Diese Granularität für den User sichtbar zu machen
  ist die Stelle, an der die volle 04.A-Spec-Arbeit zur Wirkung
  kommt.
- Hartes Abbrechen würde Andocken zwischen sinnvollen Geschwister-
  Knoten verhindern, die in einer Schicht stark sind aber in
  anderen schwach (z.B. Mein-Rezeptbuch ↔ Mein-Mixarium fachlich
  unter 0.80, prozessual über 0.80).
- Der „Trotzdem"-Knopf gibt dem User Bauer-Verantwortung — analog
  Modul 04.B § Anti-Missbrauch-Klausel (`overrideRecommendation`
  ist Vorschlag, nicht Pflicht).

**UI-Darstellung im Wizard-Schritt 3** (verbindlich für Sub (a) Vorab-Bau):

```
┌─ Schritt 3: Match-Check ────────────────────────────────┐
│ Foreign-Spore: Mein-Mixarium                            │
│                                                          │
│  overall:     0.62  ⚠️  unter Schwelle (0.80)            │
│                                                          │
│  fachlich:    0.45  ▒▒░░░░░░░░░░░░░░░░░░  rot           │
│  prozess:     0.78  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░  gelb          │
│  skalierung:  0.63  ▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░  gelb          │
│                                                          │
│  ⚠️ Andocken trotz niedrigem fachlichen Match möglich,    │
│     aber riskant — geringe Schnittmenge zwischen den     │
│     Domain-Stichworten.                                  │
│                                                          │
│  [ Trotzdem andocken ]   [ Abbrechen ]   [ ← Zurück ]    │
└──────────────────────────────────────────────────────────┘
```

**Farb-Schwellen pro Bar:**
- `≥ matchThreshold` (Default 0.80) → grün (teal)
- `≥ SCHICHT_MIN_MATCH` (0.60) → gelb
- `< SCHICHT_MIN_MATCH` (0.60) → rot

**Schwellen-Verhalten:**

- `overall ≥ matchThreshold` → Schritt 3 zeigt **grün**, „Weiter
  zum Handshake"-Knopf direkt sichtbar (kein „Trotzdem"-Block).
- `overall < matchThreshold` → Schritt 3 zeigt **gelb/rot** je
  Schicht, „Trotzdem andocken"-Knopf + Warnungstext (Spec-Wortlaut
  Bau-Sitzung 18 Sub (a) Vorab entscheidet final).
- `DimensionsAllNullError` aus `matchDimensions` → Schritt 3 zeigt
  Fehlermeldung „Match konnte nicht berechnet werden — eigene oder
  fremde `domainKeywords` fehlen". Kein „Trotzdem"-Knopf (keine
  Berechnungsgrundlage).

**`opts.matchThreshold` Override-Regel:**

- Default `PROVIDER_MIN_MATCH` (0.80, hartcodiert in Modul 04).
- Endknoten-Bauer kann **reduzieren** (z.B. 0.60), um in
  einem speziellen Forker-Mycel das Andocken zwischen mehr
  Geschwistern zu erlauben.
- Endknoten-Bauer kann **NICHT erhöhen** (Spec-Wille: 0.80 ist
  obere Grenze in Sub (a) Vorab — wer strenger filtern will, baut
  eine Modul-10-Reputation-Schicht). Sub (a) Vorab erzwingt das
  via Sanity-Check: `if (opts.matchThreshold > PROVIDER_MIN_MATCH)
  → console.warn + setze auf PROVIDER_MIN_MATCH`.

#### Modal-Form Sub (a) (final, Spec-Sitzung 18 Sub (a) Vorab 2026-05-28)

**Entscheidung: Stepper-UI** (4 Schritte als Punkte oben, „Weiter"-
Knopf pro Schritt). Analog Sage-Page-Andock-Wizard (`index.html`
§ Schwarz-Loch-Karte, Z. ~969–991), aber **bewusst ohne** den
Repo-URL-PR-Anker (das wird Modul-19-Pflicht in Phase B).

**Layout-Anker:**

- Vier Schritt-Punkte oben als horizontaler Stepper:
  `① URL — ② Spore — ③ Match — ④ Handshake`.
- **Aktiver Schritt** in Edel-Gold (`var(--siegel-gold)`-Klasse
  aus Modul 16 § Sub b CSS-Variablen).
- **Erledigte Schritte** mit Häkchen-Glyph.
- **Künftige Schritte** in dunklem Bronze-Ink, nicht-klickbar.
- **Body**: pro Schritt eigenes Panel (Single-Pane, kein Akkordeon).
  Voriger Schritt **nicht sichtbar** (Stepper-Disziplin), aber per
  „← Zurück"-Knopf erreichbar.
- **Footer**: „← Zurück" + „Weiter →" / „Abbrechen" / Schritt-
  spezifische Aktion (z.B. „Andocken bestätigen" in Schritt 4).

**Schluss-Verhalten:**

- Backdrop-Klick / Esc / ✕-Button schließen das Modal.
- Bei offenem Wizard mit Eingaben (z.B. URL eingegeben aber
  noch nicht handshaked): **Bestätigungs-Modal** „Andock-Wizard
  schließen? Eingaben gehen verloren."
- Nach erfolgreichem Handshake (Schritt 4 grün): „Andocken
  erfolgreich"-Bestätigung + automatischer Modal-Close nach
  2 s (oder „Fertig"-Knopf).

**Theme-Pflicht:** Bau-Sitzung 18 Sub (a) Vorab übernimmt die
PWA-Theme-CSS-Variablen analog Modul 16/17 — `var(--bg-1)`,
`var(--text-1)`, `var(--accent)`, plus Siegel-Variablen aus
Modul 16 § Sub b.

#### Andocken aus Multisuchfeld-Discovery (final, Spec-Sitzung 18 Sub (a) Vorab 2026-05-28)

Klaus' Klärung 2026-05-28 (Plansitzung Multisuchfeld): das
Multisuchfeld (Karte 18 § Such-Feld-Integration-Pattern + Schwester-
Brief `BRIEF_SPEC_SUCHFELD_MULTI.md`) zeigt Treffer aus dem Externen
Mycel-Hub (SB-KIMTool-Point) UND aus dem offenen Internet. Wenn ein
Treffer ein potenzielles Andock-Ziel ist, trägt er einen
`[Andocken]`-Knopf.

**Sub (a) Vorab-Vertrag mit dem Multisuchfeld:**

1. **`openAndockTab(url)`** akzeptiert eine URL als optionales
   Argument (siehe Signatur oben). Der Multisuchfeld-`[Andocken]`-
   Knopf ruft `SbkimToolPwa.openAndockTab(treffer.url)` direkt.
2. **URL-Vorbelegung im Wizard-Schritt 1:** wenn `url` übergeben,
   ist das URL-Eingabefeld in Schritt 1 vorbelegt UND der Wizard
   springt direkt zu Schritt 2 (Spore-Fetch). User kann via „←
   Zurück" zu Schritt 1 wechseln, um die URL anzupassen.
3. **Erkennungs-Heuristik im Multisuchfeld**: die Probe
   `fetch(url + "/sbkim/spore.json")` läuft **außerhalb** von Sub
   (a) Vorab — sie ist Render-Pflicht des Multisuchfelds (oder
   später Sub (i) Spore-Discovery in Voll-Spec 18). Sub (a) Vorab
   geht davon aus, dass der Aufrufer „andocken"-fähige URLs liefert,
   und macht die echte Spore-Validierung in Schritt 2.
4. **Fail-soft bei nicht-SBKIM-URL:** wenn `openAndockTab(url)` mit
   einer URL aufgerufen wird, deren `sbkim/spore.json` 404 / non-JSON
   / Signatur-Mismatch liefert, zeigt Schritt 2 die konkrete Fehler-
   meldung („Spore-Datei nicht gefunden / nicht lesbar / nicht
   signiert"). User kann via „← Zurück" zu Schritt 1 wechseln und
   eine andere URL eingeben.

**Spore-Discovery-Implementierung selbst (Hub-Fetch, Externer-Hub-
Crawl, etc.)** ist **NICHT Sub (a) Vorab-Aufgabe** — Sub (a) Vorab
bekommt nur die `openAndockTab(url)`-Signatur, damit Sub (i) und das
Multisuchfeld den Andock-Knopf einfach verdrahten können.

#### SB-KIMTool-Point-Integration (final, Spec-Sitzung 18 Sub (a) Vorab 2026-05-28)

Klaus' Klärung 2026-05-28: Sub (a) Vorab muss die Andock-Geste aus
dem Externen Mycel-Hub-Discovery-Pfad unterstützen.

**`opts.externalHubUrl`** Spec-Anker (siehe Init-Schema oben):

- **Default-Wert:** `null` (kein fester URL — Spec-Sitzung 18 Sub (a)
  Vorab-Entscheidung). Begründung: ein fester URL würde Sub (a) Vorab
  zwingen, Klaus' eigene Hub-Instanz zu verkabeln (`https://
  lausiklauskn-png.github.io/SB-KIMTool-Point/`). Forker mit eigener
  Hub-Instanz müssten dann immer overriden. `null` als Default ist
  neutral — Endknoten-Bauer setzt seinen Hub explizit.
- **Format:** `string | null`. Single-Hub-Setup in Sub (a) Vorab,
  Multi-Hub-Array bleibt Voll-Spec 18 vorbehalten (`string[]`
  Erweiterung als Sub-(i)-Aufgabe).
- **Sub (a) Vorab implementiert NICHT den Discovery-Fetch.** Das
  ist Sub (i) Spore-Discovery in Voll-Spec 18. Sub (a) Vorab:
  - speichert `externalHubUrl` in `_meta.externalHubUrl`
  - spiegelt ihn als Read-Anker (Tests + Multisuchfeld können
    `SbkimToolPwa._meta.externalHubUrl` lesen)
  - der `openAndockTab(url)`-Signatur ist URL-Parameter-kompatibel,
    egal woher die URL kommt (Sub i Hub-Fetch, Multisuchfeld, Klaus'
    manuelle Eingabe, oder Wizard-Schritt 1).

**Vertrag mit Sub (i):** wenn Sub (i) in Voll-Spec 18 spezifiziert
wird, liest sie `SbkimToolPwa._meta.externalHubUrl` und macht den
Hub-`status.json`-Fetch. Jeder Hub-Eintrag rendert einen „Andocken"-
Knopf, der `SbkimToolPwa.openAndockTab(eintrag.endpoint)` ruft.

**Strikte Tabus Sub (a) Vorab** (zusätzlich zu § Strikte Tabus
unten):

- KEIN Hub-Fetch in Sub (a) Vorab. `externalHubUrl` ist NUR Read-
  Anker, kein aktiver Endpunkt-Aufruf.
- KEIN Cross-Origin-Auto-Connect ohne User-Geste. Wizard öffnet
  nur, wenn User auf SIEGEL-Bronze-Knopf oder Multisuchfeld-Treffer
  klickt.

#### Verhaltens-Tabu Sub (a) Vorab (Auto-Polling)

Klaus-Festlegung 2026-05-26 (siehe § Klaus-Festlegungen oben) bleibt
verbindlich: Andocken ist explizite User-Geste, **kein Auto-Polling**.
Sub (a) Vorab:

- macht KEINEN eigenen Sporen-Discovery-Fetch (das ist Sub i)
- macht KEINE Wiederhol-Versuche auf gescheiterten Spore-Fetches
  (User klickt selber „Erneut versuchen")
- macht KEINEN periodischen Match-Re-Check, wenn die Fremd-Spore
  sich ändert
- öffnet sich NICHT automatisch beim ersten App-Boot
- öffnet sich AUSSCHLIESSLICH auf:
  - `SbkimSiegel`-Bronze-Modal-`[Andocken]`-Knopf-Klick (Modul 16
    Sub e fail-soft-Check, PR #180)
  - Multisuchfeld-Treffer-`[Andocken]`-Knopf-Klick (siehe oben)
  - Explizit programmierten Endknoten-Aufruf
    (`SbkimToolPwa.openAndockTab()` im UI-Code)

**Offene Fragen für Voll-Spec 18** (nicht Sub (a) Vorab-Scope):

- Sub-(b) Heterokaryose-Slot-Wechsel-Interferenz mit Sub (a)-Wizard?
- Sub-(c) Identitäts-Wechsel während offener Sub-(a)-Wizard-Sitzung?
- Sub-(i) Spore-Discovery genaue Render-Form (Tab? Akkordeon?).
- Multi-Hub-Setups (`externalHubUrl` als `string[]`?).
- Re-Handshake-Verhalten, wenn bereits ein Sibling-Eintrag mit
  derselben `nodeId` im Sibling-Store steht.

### Sub (b) — Bidirektionaler Sporen-Informationsaustausch (Heterokaryose)

**NEU 2026-05-26 (war vorher als „Sporen-Installation" unter (b)
geführt; Klaus' Vision-Klärung trennt Andocken (a) von Anker-Tausch (b)).**

Anker-Tausch unter bestehenden Geschwistern via Modul 06
(`SbkimHeterokaryose.requestHeterokaryosis` + Co-Schreiber-Flag aus
Modul 08). UI-Liste der Geschwister mit Heterokaryose-Opt-In-Status,
Knopf „Anker anfordern" pro Geschwister, Eingehende-Anker-Inbox
(`sbkim_hetero_inbox_<slotKey>`).

**Offene Spec-Punkte:**

- Soll Modul 18 die `heterokaryosisOptIn`-Flag pro Sibling auch
  toggle-able machen, oder bleibt das ausschließlich Modul-08-UI?
- Wie wird Anker-Inbox visualisiert (Tab in Modul 18 vs. eigene
  Sektion)?

### Sub (c) — Identitäts-Wechsel (Multi-Identität, Brief 04)

Liste aller Identitäts-Slots (`SbkimSpore.listIdentities`), Anzeige
des aktiven Slots, Drop-Down zum Wechsel (`SbkimSpore.setActiveIdentity`),
Knopf „Neue Identität erzeugen". Bei aktivem Slot-Wechsel: Modul-05-
Receiver-Map-Reset-Hinweis (Tab-Reload empfohlen, Karte 02 § Risiken).

**Offene Spec-Punkte:**

- Sollen Slot-Namen frei wählbar sein oder aus einer Liste?
- Soll ein Slot-Tag (Persönlich/Beruflich/Sonstiges) Pflicht sein
  für UX-Klarheit?

### Sub (d) — Backup-Export + -Import

Knöpfe „Backup exportieren" (`SbkimSpore.exportBackup(password)` →
Datei-Download) und „Backup importieren" (`SbkimSpore.importBackup`).
Passwort-Eingabe via `<input type="password">`-Feld. Sichtbarer
Hinweis: „Verwahre das Backup sicher; ohne Passwort kein Zugriff."

**Offene Spec-Punkte:**

- Soll das Backup-Passwort persistiert werden (z.B. WebAuthn)? Oder
  jedes Mal neu eingeben?
- Welcher Dateityp `.sbkimbackup` oder generisches `.json`?

### Sub (e) — Self-Apoptose (irreversibel)

Globale Self-Apoptose-Geste analog Sage-Page (`SbkimApoptose.prepareSelfApoptose`
+ `confirmSelfApoptose`, 60-s-Token-Bestätigung, Vermächtnis-Versand an
alle Geschwister). Achtung-Block: irreversibel.

**Offene Spec-Punkte:**

- Per-Persona-Apoptose (Modul 02 `removeIdentity`) auch erreichbar?
- Soll die Self-Apoptose vor der App-Freigabe sichtbar sein, oder
  hinter einer Experten-Klausel verborgen?

### Sub (f) — Sporen NEU generieren (NEU 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26: ein Endknoten muss
seine Spore im Lauf der Zeit anpassen können — z.B. Kategorien
hinzufügen, `domainKeywords` ändern, neue `embeddingNeeds` setzen.
Sporen-Regeneration ist konzeptionell dasselbe wie Andocken (Sub a),
aber **ohne neue Identität** — Spore-Datei wird mit der bestehenden
`nodeId` neu signiert und auf den Endknoten-Server gelegt.

UI:

1. Aktuelles Spore-JSON anzeigen (Read-Only) mit Diff-Marker.
2. Felder editierbar: `domain`, `domainKeywords`, `stammCategories`,
   `guestCategories`, optional `embeddingCapabilities` /
   `embeddingNeeds`.
3. „Spore neu erzeugen + signieren"-Knopf:
   `SbkimSpore.regenerateOwnSpore(updates)` (ruft intern erneut Modul
   03 lazy für neuen `domainVector` wenn `domainKeywords` geändert
   wurden, signiert mit aktuellem Privat-Schlüssel).
4. Download-Knopf für die neue `spore.json` (Endknoten-Bauer ersetzt
   die alte `sbkim/spore.json` im Repo + committet).

**Offene Spec-Punkte:**

- Soll die Spore-Regeneration auch automatisches Re-Embedding
  triggern (Sub g), oder ist das ein separater Schritt?
- Pflicht-Bestätigung bei `domainKeywords`-Wechsel (alte Geschwister-
  Matches könnten brechen)?
- Wie wird die alte Spore archiviert (lokaler Backup-Schreibpfad)?

### Sub (g) — Re-Embedding (NEU 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26. Wenn das Embedding-
Modell aktualisiert wird (Modul 03 Modell-Wechsel) ODER wenn der
Endknoten neue lokale Inhalte (Rezepte / Cocktails) erzeugt hat,
müssen die Vektoren neu gerechnet werden.

UI:

1. Liste aller embedded Vektoren (Spore + Korpus-Items für `queryLocal`).
2. „Alle neu embedden"-Knopf (`SbkimEmbedding.embedPassage` über
   Modul 03 lazy für jeden Eintrag, sequenziell mit Progress-Bar).
3. „Korpus-Eintrag hinzufügen"-Formular (Label + Text → Modul 03 →
   `passageVec` → Local-Storage / IndexedDB).

**Offene Spec-Punkte:**

- Wie wird der lokale Korpus persistiert? (`SbkimMatch.setLocalCorpus`
  + IndexedDB-Store oder reiner RAM-Pfad?)
- Progress-Bar bei großen Korpora — wie viel UI-Feedback?
- Soll Re-Embedding einen `embeddingVersion`-Marker mit `domainVector`
  abgleichen (Drift-Erkennung), oder ist das Modul-04-Pflicht?

### Sub (h) — Manueller Handshake-Trigger aus Sibling-Liste (NEU 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26. Bestehende Geschwister
können re-handshaked werden, um einen Bronze→Gold-Stufenwechsel im
SIEGEL zu triggern (Modul 16 Sub e). UI-seitig sichtbar als Liste in
Modul 18.

UI:

1. Liste aller Geschwister aus `sbkim_siblings_<slotKey>` (Modul 05).
2. Pro Sibling: Status-Lampe (live / silent / apoptotic), Knopf
   „Handshake versuchen" → `SbkimAnastomose.handshake(siblingSpore)`.
3. Erfolgsfall: `sbkim:handshake outcome:"established"`-Event triggert
   Modul 16 Sub (e) Bronze→Gold-Wechsel.
4. Fehler-Fall: UI zeigt Grund (Timeout / Schwelle / Signatur).

**Offene Spec-Punkte:**

- Soll Modul 18 ein automatisches „re-handshake-on-startup" für alle
  Geschwister anbieten? (Klaus' Empfangsmodus-Klausel sagt: kein
  Auto-Polling — also NEIN als Default.)
- Soll der Handshake-Erfolg in der Sibling-Liste persistiert werden
  (`sbkim_anastomosis_log_<slotKey>`), oder reicht der Bronze→Gold-
  Wechsel-Visual?

### Sub (i) — Spore-Discovery (NEU 2026-05-26)

**Anlass:** Klaus' Vision-Klärung 2026-05-26 (ersetzt die alte Sub (b)
„Sporen-Installation per URL"). Neue Sporen finden via:

1. **Hub-Anfrage an Sage-Page-`status.json`** (Klaus' Mycel — fetch
   `https://lausiklauskn-png.github.io/Sage-Protokol/status.json`,
   `endknoten[]`-Liste extrahieren, jeden Eintrag als potenzielles
   Andock-Ziel anzeigen).
2. **Hub-Anfrage an Externen-Mycel-Hub-`status.json`** (Forker-Mycel
   — siehe [`_mycel_hub.md`](_mycel_hub.md); URL aus Endknoten-
   `init({externalHubUrl})`-Option).
3. **User-URL-Input** (Klaus tippt direkt eine Repo-URL ein, z.B. von
   einem Pepo-Forker-Knoten, der weder in Sage noch im externen Hub
   gelistet ist).

UI:

1. Drei-Tab-Sektion (Sage-Mycel / Externer-Hub / Manuelle-URL).
2. Pro Tab: Liste der gefundenen Sporen + „Andocken"-Knopf
   (triggert Sub a).
3. Pre-Check: Match-Score-Vorschau vor Andocken (Modul 04 + Spore-
   `domainVector`).

**Offene Spec-Punkte:**

- Soll Spore-Discovery die Sporen direkt herunterladen + validieren,
  oder nur die URL-Liste anzeigen?
- Cross-Origin-CORS-Hinweise bei Forker-Hub-`status.json`-Fetch?
- Anti-Spam: wie viele Sporen-Discovery-Aufrufe pro Session?

---

## Such-Feld-Integration-Pattern (NEU 2026-05-26, Tafel-Spec-Pflege Mycel-Vision)

**Anlass:** Klaus' Kern-Vision 2026-05-26: das **Such-Feld in einer
Endknoten-PWA** ist der bidirektionale Cross-Knoten-Matching-Anker.
Beispiel: User tippt in Mein-Rezeptbuch „welcher Wein passt zu
Lasagne" → Sender-Helper sendet `op:"query"` postMessage an alle
Geschwister-Sporen → Modul 15 Sub (b) der Geschwister-Knoten rufen
`SbkimMatch.queryLocal()` (Modul 04.C) → `op:"queryResult"` zurück
→ UI zeigt Cross-Knoten-Treffer mit Verweis-Link.

**Pepo-Demo-Studie (Referenz):**

Klaus' [Semantic Match Demo](https://github.com/lausiklauskn-png/semantic-match-demo)
(extern, NICHT Sage-Protokol-Repo) ist eine **andere Architektur-
Vorlage** für die bidirektionale Match-UI, NICHT für die Transport-
Schicht. Wichtige Übertragbare Pattern:

- **Symmetrie-Anforderung:** beide Parteien beschreiben Fähigkeiten
  UND Bedarf (Vier-Feld-Eingabe). In Sage-Mycel reduziert auf:
  Endknoten haben Spore (= Fähigkeit / Bedarf), Such-Text ist
  implizit „Bedarf" — Such-Pattern ist **eine** Eingabe, nicht vier.
- **Score-Ring (0-100%):** UI-Visualisierung des Match-Scores als
  Kreis-Ring, Farben teal/gold/rot bei ≥70%/40-69%/<40%. Lässt sich
  pro Cross-Knoten-Treffer in Mein-Rezeptbuch-UI rendern.
- **Drei-Dimensionen-Anzeige:** Demo zeigt fachlich/prozess/skalierung
  als drei Bars. Entspricht Modul 04.A `matchDimensions` — bei
  `queryLocal` ist meist nur `fachlich` relevant (Sub-Spec für Modul
  04.C entscheidet).
- **Match-Liste + Differenz-Liste:** zwei Listen pro Cross-Knoten-
  Treffer („was passt" + „was fehlt"). Lässt sich pro Endknoten-PWA
  bauen, ist aber UI-Pflege, nicht Modul-18-Pflicht.

**Nicht übernehmbar:**
- WebRTC/PeerJS-Transport (Demo nutzt PeerJS; Sage nutzt
  postMessage + BroadcastChannel via Modul 15).
- Claude-API als zentrale Match-Engine (Demo rechnet alles per
  Claude-API; Sage rechnet lokal via Modul 03 + 04 + optional
  Stufe-B-LLM via 04.B).
- Tablet-Hub-Vermittler-Modell (Demo hat Tablet als Hub; Sage hat
  dezentrale Peers).

### Dual-Modus-Klassifikation (Stichwort vs. Semantik) — 2026-05-26

Klaus' Heuristik 2026-05-26: nicht jede Eingabe ins Such-Feld ist eine
semantische Anfrage. Wer „Gulasch" tippt, will den vorhandenen Rezept-
Datensatz „Muttis Gulasch" sehen — kein Cross-Knoten-Embedding-Pass.
Wer „welcher Wein passt zu Lasagne?" tippt, **will** semantische
Antwort und braucht den Cross-Knoten-Schritt.

**Klassifikation (3 Signale, alle drei müssen für „Stichwort" erfüllt
sein):**

1. **Wort-Anzahl ≤ 3** (Whitespace-Split, Leerzeilen-Trim).
2. **Kein Fragezeichen** im Text.
3. **Kein Bridge-Word**. Bridge-Words sind die deutschen Wörter, die
   typisch eine semantische Brückenfrage einleiten:
   ```
   welcher, welches, welche,
   passt, zu, für, mit, ohne,
   wie, wann, warum,
   was, wer, wo
   ```
   Match: case-insensitiv, ganzes Wort (`/\b…\b/i`).

Erfüllt eine Eingabe **alle drei** → **Stichwort-Modus** (lokale Filter-
Suche auf die App-eigene Domain-Inhalts-Liste, ohne Modul 03/04). Sonst
→ **Semantik-Modus** (`queryLocal` + Cross-Knoten-Query).

Beispiele:

| Eingabe                                       | Wörter | ? | Bridge | Modus      |
|-----------------------------------------------|--------|---|--------|------------|
| `Gulasch`                                      | 1      | nein | nein | Stichwort  |
| `Spaghetti`                                    | 1      | nein | nein | Stichwort  |
| `Alkoholfreie Nachspeisen`                     | 2      | nein | nein | Stichwort  |
| `Spaghetti welche Sorte`                       | 3      | nein | **ja** (welche) | Semantik   |
| `welcher Wein passt zu Gulasch?`               | 5      | ja | ja   | Semantik   |
| `Hauptgang mit wenig Aufwand`                  | 4      | nein | ja (mit) | Semantik   |
| `Erdbeerkuchen`                                | 1      | nein | nein | Stichwort  |
| `wie mache ich Erdbeerkuchen?`                 | 4      | ja | ja   | Semantik   |

**Klassifikations-Funktion (Endknoten-Pflicht):**

```js
const BRIDGE_WORDS = [
  "welcher","welches","welche",
  "passt","zu","für","mit","ohne",
  "wie","wann","warum",
  "was","wer","wo",
];
const BRIDGE_RE = new RegExp(
  "\\b(?:" + BRIDGE_WORDS.join("|") + ")\\b",
  "i",
);

function classifySearch(text) {
  const trimmed = String(text || "").trim();
  if (trimmed.length === 0) return "leer";
  const wordCount = trimmed.split(/\s+/).length;
  const hasQuestionMark = trimmed.includes("?");
  const hasBridgeWord = BRIDGE_RE.test(trimmed);
  if (wordCount <= 3 && !hasQuestionMark && !hasBridgeWord) {
    return "stichwort";
  }
  return "semantik";
}
```

### Such-Helper (Endknoten-Pflicht, kein Modul-Code)

```js
async function runSearch(text, opts) {
  const mode = classifySearch(text);
  if (mode === "leer")     return { mode, localResults: [], crossResults: [] };
  if (mode === "stichwort") {
    // Stichwort-Modus: lokal-Filter auf die App-eigene Domain-Liste.
    // KEIN queryLocal-Aufruf, KEIN Cross-Knoten-Pass. App ist
    // verantwortlich für die Filter-Funktion (Substring-Match auf
    // Titel / Tags / Kategorie der lokalen Items).
    const localResults = opts.localKeywordFilter(text);
    return { mode, localResults, crossResults: [] };
  }
  // Semantik-Modus: queryLocal + Cross-Knoten parallel.
  const k = opts.k || 5;
  const [localResults, crossResults] = await Promise.all([
    SbkimMatch.queryLocal(text, k),          // Modul 04.C
    sendCrossKnotenQuery(text, k, opts),     // siehe Sender-Helper unten
  ]);
  return { mode, localResults, crossResults };
}
```

`opts.localKeywordFilter` ist eine Endknoten-Funktion, die Synchron
über die App-Daten filtert (z.B. Substring-Match in Titeln). Sie
existiert pro App separat — Mein-Rezeptbuch filtert über Rezept-
Titel + Tags, Mein-Mixarium über Cocktail-Namen + Kategorien.

### Sender-Helper-Code-Pattern (Spec-Vorbereitung)

Im Semantik-Modus muss neben `queryLocal` auch eine `op:"query"`-
Botschaft an die Geschwister-Sporen gehen. Sender-Mechanismus:

```js
async function sendCrossKnotenQuery(text, k, opts) {
  // Geschwister aus Modul 05 sibling-Store lesen (slot-spezifisch).
  const siblings = opts.siblings || [];          // Endknoten lädt einmalig
  if (siblings.length === 0) return [];

  // Pro Geschwister: postMessage op:"query" via BroadcastChannel.
  // Für cross-origin Mycel-Mitglieder (Forker) wäre window.postMessage
  // an ein eingebettetes iframe der Empfehlungs-Pfad (Spec für eine
  // spätere Iteration).
  const channel = new BroadcastChannel("sbkim-membrane");
  const replies = [];
  const TIMEOUT_MS = 3000;

  const collected = await Promise.all(siblings.map(s => sendOne(s)));

  channel.close();
  return collected.flat();

  function sendOne(sibling) {
    return new Promise(resolve => {
      const nonce = crypto.randomUUID();
      const handler = (e) => {
        const env = e.data;
        if (!env || env.type !== "sbkim/membrane/v1") return;
        if (env.op !== "queryResult") return;
        if (env.inReplyTo !== nonce) return;
        channel.removeEventListener("message", handler);
        clearTimeout(timer);
        const results = (env.payload && Array.isArray(env.payload.results))
          ? env.payload.results
          : [];
        resolve(results.map(r => ({
          ...r,
          siblingOrigin: sibling.origin,
          siblingNodeId: sibling.nodeId,
        })));
      };
      const timer = setTimeout(() => {
        channel.removeEventListener("message", handler);
        resolve([]);   // Timeout → leere Liste, kein Fehler
      }, TIMEOUT_MS);
      channel.addEventListener("message", handler);

      channel.postMessage({
        type:       "sbkim/membrane/v1",
        op:         "query",
        fromOrigin: window.location.origin,
        nonce:      nonce,
        payload:    { text: text, k: k },
      });
    });
  }
}
```

Hinweis: dieses Pattern ist **BroadcastChannel-basiert** (same-origin
Mycel, Klaus' Apps auf `lausiklauskn-png.github.io`). Für cross-origin-
Forker entscheidet eine spätere Spec-Sitzung den genauen Transport
(typisch `window.postMessage` an ein iframe der Geschwister-PWA).
**Modul 15 ist nur Empfänger** — der Sender lebt im Endknoten-Code,
nicht in Modul 15.

### UI-Pattern: zwei Sektionen mit Bedienungs-Vokabular

Endknoten-PWA-Such-Feld zeigt **zwei Ergebnis-Sektionen** nach einem
Semantik-Pass:

```
┌─────────────────────────────────────────────────┐
│ Suche: "welcher Wein passt zu Lasagne?"         │
├─────────────────────────────────────────────────┤
│ ▸ Lokal (Mein-Rezeptbuch)                       │
│   — keine Treffer (oder Top-5-Liste)            │
│                                                  │
│ ▸ Aus dem Mycel (Geschwister-Knoten)            │
│   • Chianti Classico (0.91)        → Mixarium   │
│   • Sangiovese (0.88)              → Mixarium   │
│   • Trockene Rotweine (0.84)       → Mixarium   │
└─────────────────────────────────────────────────┘
```

Im Stichwort-Modus wird nur die lokale Sektion gezeigt (kein „Aus dem
Mycel"-Block, weil kein Cross-Knoten-Pass lief).

**Spalten:** Label · Score (optional, 0.00–1.00 oder Prozent-Form) ·
„→ <Geschwister-Name>"-Link.

### Anker-Pfad in Cross-Knoten-Treffer (Konvention)

Cross-Knoten-Treffer-Link öffnet die Geschwister-PWA mit URL-Fragment:

```
https://lausiklauskn-png.github.io/Mein-Mixarium/#anchor=<anchorId>
```

Wobei `anchorId` aus `queryLocal`-Rückgabe der Geschwister-Sporen
stammt (`{label, score, anchorId}`). Geschwister-PWA prüft bei
Boot `window.location.hash`:

```js
window.addEventListener("DOMContentLoaded", () => {
  const m = window.location.hash.match(/^#anchor=(.+)$/);
  if (m) scrollToAnchor(decodeURIComponent(m[1]));
});
```

`scrollToAnchor` ist endknoten-PWA-eigene Funktion (z.B. setzt
`document.querySelector(\`[data-anchor="${id}"]\`).scrollIntoView()`).
**KEINE Modul-18-Pflicht** — das ist UI-Pflege im jeweiligen Endknoten.

### Edge-Cases (Endknoten-Pflicht)

| Lage | Endknoten-Verhalten |
|---|---|
| Such-Feld leer (`text === ""`) | Klassifikation `"leer"`, beide Listen leer, KEIN Embedding-Call, KEIN postMessage. |
| Stichwort liefert 0 lokale Treffer | „keine Treffer" sichtbar, KEIN Auto-Semantik-Pass (User-Geste). UI darf einen Knopf „Auch im Mycel suchen?" anbieten — explizit. |
| Modul 03 noch nicht geladen | `queryLocal` wirft `EmbeddingNotAvailableError` → UI zeigt „Embedding-Modul lädt noch …" und macht die Stichwort-Sektion sichtbar. |
| Kein Geschwister im Sibling-Store | `sendCrossKnotenQuery` liefert `[]` sofort, kein Channel-Open. „Aus dem Mycel"-Sektion zeigt „keine angedockten Geschwister" oder bleibt verborgen. |
| BroadcastChannel-Timeout (kein Geschwister antwortet) | Pro Geschwister 3 s Timeout, dann leere Liste für dieses Geschwister. Andere Geschwister antworten unabhängig. Gesamt-Promise scheitert nie. |
| Cross-Knoten-Antwort mit `error:"module-04c-not-available"` | Geschwister hat 04.C noch nicht geladen — Treffer-Liste leer, Endknoten zeigt „Geschwister-Knoten unterstützt Such-API nicht (Modul 04.C fehlt)". Da Bau 04.C diese Sitzung schließt, sollten alle Endknoten nach Migration den Pfad fahren. |
| Sehr lange Eingabe (> 4096 Zeichen) | `queryLocal` wirft `QueryTooLongError` sync → UI zeigt „Eingabe zu lang, max 4096 Zeichen". Cross-Knoten-Pass wird NICHT versucht (Eingabe muss zuerst gekürzt werden — defensiv-Schutz). |
| Klaus tippt während embedding läuft | Endknoten-eigene Debounce-Logik (typisch 300 ms). Modul 04 hat KEINE eigene Debounce — wer ohne Debounce mit jeder Tastenanschlag-Anfrage Modul 03 ruft, blockiert sich selbst (Modul-03-Lazy gilt nur beim ersten Call, danach Cache-Hit ~10–50 ms). |

### Pattern-Status

Diese Sektion ist **Vorlage für Endknoten-Bauer**, keine Modul-18-
Surface-Spec. Modul 18 selbst bietet Wartungs-Aktionen (Andocken,
Backup, Self-Apoptose etc.); das Such-Feld lebt **außerhalb** von
Modul 18, im endknoten-domain-spezifischen UI. Die Endknoten-Briefe
`BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` und
`BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md` setzen dieses Pattern in den
beiden Endknoten um.

---

## Modal-Form (Sub (a) Vorab final 2026-05-28; Sub (b)–(i) Spec-Vorbereitung)

**Sub (a) Vorab:** Stepper-UI mit vier Schritt-Punkten oben
(`① URL — ② Spore — ③ Match — ④ Handshake`), Single-Pane-Body, „←
Zurück" + „Weiter →"-Footer. Vollständige Spec siehe § Sub (a) §
Modal-Form Sub (a) oben.

**Sub (b)–(i):** Voll-Spec 18 entscheidet die finale Form. Aktueller
Skizzen-Stand:

- Ein voll-Bildschirm-overlay (oder `min(720×80vh, viewport)`) mit
  Tab-Navigation oben — neun Tabs für die neun Sub-Bereiche. Jeder
  Tab ist eigenes Sub-Modal (oder Sub-Pane innerhalb des Containers).
  Schluss-Knopf unten-rechts.
- Sub (a) Vorab-Wizard wird in Voll-Spec 18 in dieses Container-Layout
  eingebettet (Tab „Andocken" zeigt den vier-Schritt-Wizard innen).

**Offene Spec-Punkte für Voll-Spec 18:**

- Container als eigenes Sub-Modal pro Sub-Bereich, oder als ein einziges
  großes Tab-Modal? Komplexität vs. Übersicht.
- Theme: übernimmt die PWA-Theme-CSS-Variablen analog Modul 17.
- Verhältnis Sub (a) Vorab-Wizard zu Sub (b)–(i)-Tab-Layout —
  bleibt der Wizard ein eigenständiges Modal, das aus dem Container
  springt, oder wird er als „Andocken"-Tab im Container eingebettet?

---

## Schnittstelle (Sub (a) Vorab final 2026-05-28; Sub (b)–(i) Spec-Skizze)

**Sub (a) Vorab-Vertrag** (verbindlich für Bau-Sitzung 18 Sub (a)
Vorab — Pipeline-Schritt 5h.1; Sub (b)–(i)-Felder sind weiterhin
Skizze und werden in Voll-Spec 18 final):

```js
window.SbkimToolPwa = {
  // Sub (a) Vorab — final:
  init:           function (options) { /* Promise<void>, idempotent, fail-soft */ },
  openAndockTab:  function (url)     { /* Promise<void> — siehe Signatur unten */ },
  close:          function ()        { /* void (sync) — schließt das Andock-Modal */ },
  isOpen:         function ()        { /* boolean (sync) — true wenn Modal offen */ },
  _meta:          { /* Read-Anker, siehe unten */ },

  // Sub (b)–(i) — Spec ausstehend in Voll-Spec 18 (Pipeline-Schritt 5h.2,
  // NACH App-Freigabe). Möglicher generischer `open(subBereich?)`-Pfad
  // wird dort entschieden. Bis dahin: Sub (a) Vorab ist der einzige
  // Public-Trigger.
};
```

**Sub (a) Vorab-Errors** (verbindlich, Bau-Sitzung 18 Sub (a) Vorab
implementiert sie):

| Error-Klasse | Wirft aus | Pflicht-Felder | Begründung |
|---|---|---|---|
| `ToolPwaNotReadyError` | `openAndockTab` (sync vor `await`) | `message` (mit Liste der fehlenden init-Felder) | Modul 18 wurde nicht (oder nur fail-soft) initialisiert. |
| `ToolPwaInvalidUrlArgError` | `openAndockTab(url)` (sync) | `message` | `url`-Argument ist kein valider `URL`-String. |

**Wizard-interne Fehler** (NICHT als JS-Errors aus `openAndockTab`,
sondern als UI-Hinweise im Wizard-Schritt):

| Lage | UI-Verhalten |
|---|---|
| Spore-Fetch 404 / non-JSON / CORS-Fehler | Schritt 2 Fehlermeldung, „Erneut versuchen" + „URL ändern". |
| Signatur-Mismatch (`SbkimSpore.verifyForeignSpore` fail) | Schritt 2 Fehlermeldung „Spore-Signatur ungültig", KEIN „Trotzdem"-Knopf. |
| Embedding-Lazy-Load fail (`EmbeddingLoadError`) | Schritt 3 Fehlermeldung + „Erneut versuchen"-Knopf. |
| `DimensionsAllNullError` aus `matchDimensions` | Schritt 3 Fehlermeldung, KEIN „Trotzdem"-Knopf. |
| `match < matchThreshold` | Schritt 3 Drei-Schichten-Darstellung + „Trotzdem andocken"-Knopf (siehe § Match-Schwelle-UI). |
| `SbkimAnastomose.handshake` fail | Schritt 4 Fehlermeldung mit konkretem Grund (Timeout / Schwelle / Signatur). |

**Sub (a) Vorab `_meta` Read-Anker** (für Tests + Multisuchfeld):

```js
SbkimToolPwa._meta = {
  ready:            boolean,    // true sobald init() mit gültigen Pflicht-
                                 // Feldern durchgelaufen ist
  endpoint:         string,     // aus opts.endpoint (oder leer wenn fail-soft)
  domain:           string,     // aus opts.domain
  domainKeywords:   string[],   // aus opts.domainKeywords
  stammCategories:  string[],   // aus opts.stammCategories (Default [])
  guestCategories: string[],    // aus opts.guestCategories (Default [])
  matchThreshold:   number,     // aus opts.matchThreshold (Default PROVIDER_MIN_MATCH=0.80,
                                 //  geclampt auf [0, PROVIDER_MIN_MATCH])
  externalHubUrl:   string|null,// aus opts.externalHubUrl (Default null)
                                 // Sub (a) Vorab verarbeitet ihn NICHT
                                 // — nur Read-Anker für Sub i + Multisuchfeld
  repoUrl:          string,     // aus opts.repoUrl (oder Auto-Erkennung)
  embeddingReady:   null|"loading"|true|"failed",
                                 // Lazy-Load-Status für Modul 03
  modalOpen:        boolean,    // true wenn der Andock-Wizard sichtbar ist
  currentStep:      0|1|2|3|4,  // 0 = Modal zu, 1–4 = Wizard-Schritt-Nummer
  lastFetchUrl:     string|null,// URL aus dem letzten openAndockTab()-Aufruf
  missingFields:    string[],   // Pflicht-Felder, die bei init() fehlten
                                 // (leer wenn ready=true)
};
```

**`init(options)`-Form Sub (a) Vorab-relevant** (Sub b–i ergänzen
spätere Felder via Voll-Spec 18):

```js
{
  // Sub (a) Vorab-Pflichtfelder (alle drei zusammen Voraussetzung
  // für _meta.ready=true; fail-soft mit console.warn wenn fehlend):
  endpoint:        string,        // Eigener Endknoten-Origin + Pfad
  domain:          string,        // Aus eigener Spore
  domainKeywords:  string[],      // Aus eigener Spore

  // Sub (a) Vorab-Optionalfelder:
  stammCategories?:  string[],    // Default []
  guestCategories?:  string[],    // Default []
  matchThreshold?:   number,      // Default PROVIDER_MIN_MATCH (0.80);
                                  // wird auf [0, PROVIDER_MIN_MATCH] geclampt
  externalHubUrl?:   string|null, // Default null. Sub (a) Vorab speichert
                                  // nur in _meta, ruft KEINEN Hub-Fetch
  repoUrl?:          string,      // Default Auto-Erkennung
                                  // (location.origin + erstes Pfad-Segment)
  mountTarget?:      HTMLElement|null,  // Default document.body

  // Sub (b)–(i) Felder (Voll-Spec 18 entscheidet die finale Form):
  // bindToSiegelSlot?: boolean,   // Default true (Sub e Verbindung
                                   //  mit SIEGEL-Slot — Voll-Spec)
  // enabledTabs?: (…)[],          // Sub-Bereich-Auswahl pro Endknoten
                                   //  (Voll-Spec 18)
  // theme?: "auto" | "dark" | "light" | "transparent",
}
```

---

## Strikte Tabus (Sub (a) Vorab verbindlich; Sub (b)–(i) Spec-Vorbereitung)

**Sub (a) Vorab-Tabus (verbindlich für Bau-Sitzung 18 Sub (a) Vorab):**

- **KEINE eigene Identität.** Modul 18 ist Render-/Wartungs-Schicht —
  ruft Modul 02 für alle Identitäts-Operationen.
- **KEIN automatisches Andock-Triggern.** Nur auf explizite Geste
  (Knopf-Klick im SIEGEL-Bronze-Modal, im Multisuchfeld-Treffer
  oder via programmatischen `openAndockTab()`-Aufruf im Endknoten-UI).
- **KEIN Hub-Fetch in Sub (a) Vorab.** `externalHubUrl` ist Read-
  Anker, kein aktiver Endpunkt-Aufruf. Hub-Discovery gehört Sub (i)
  in Voll-Spec 18.
- **KEIN `matchThreshold > PROVIDER_MIN_MATCH`.** Endknoten-Bauer
  kann die Schwelle reduzieren (locker), aber NICHT erhöhen
  (strenger). Wer strenger filtern will, baut Modul-10-Reputation.
- **KEIN Re-Init mit veränderten Pflicht-Feldern ohne console.warn.**
  Pflicht-Felder müssen bei Boot stabil sein; ein laufender Identitäts-
  Wechsel ist Voll-Spec-18 Sub (c)-Aufgabe.
- **KEIN Modul-Pflicht-Check beim Bronze-Klick.** Modul 16 ruft den
  fail-soft-Check `typeof window.SbkimToolPwa?.openAndockTab` (PR
  #180). Sub (a) Vorab respektiert das — sie zwingt nicht zu „Modul
  16 grün" als Voraussetzung. Andock-Wizard kann auch in Bronze-
  Stufe geöffnet werden.
- **KEIN PII-Render im Wizard.** Foreign-Spore-Felder werden gerendert
  (nodeId, domain, domainKeywords — alle public in der Spore). KEINE
  IP-Adressen, KEINE Lokal-Identitäts-Daten, KEINE Geschwister-Liste
  im Wizard-Modal.

**Sub (b)–(i)-Tabus (Spec-Vorbereitung — Voll-Spec 18 final):**

- **KEINE Modul-Vorgaben.** Modul 18 ist optional; ein Endknoten kann
  ihn weglassen, dann öffnet SIEGEL-Klick das Modul-16-Sub-(c)-Modal
  wie bisher (Fallback).
- **KEIN Backup-Passwort-Persist** (Sub d). UX-Pflicht: User merkt
  sich Passwort selbst.
- **KEIN Auto-Confirm bei Self-Apoptose** (Sub e). 60-s-Token-
  Bestätigung Pflicht.
- **KEIN Bypass für Anti-Greenwashing-Klausel.** Modul 18 prüft, ob
  Modul 16 (Siegel) zertifiziert ist, bevor der SIEGEL-Slot Voll-
  Container-Modal triggert. (Sub (a) Vorab ist ausgenommen — siehe
  oben.)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-25 | Stub-Anlage Modul 18 | Klaus' Idee bei Sichttest 17 (2026-05-25): SIEGEL soll später als Tool-PWA-Container für Andocken + Sporen-Installation gestaltet werden. Diese Karte ist Vorbereitungs-Spec mit Vokabular + Sub-Bereiche-Skizze + offenen Spec-Fragen. Volle Spec-Sitzung 18 folgt nach App-Freigabe (Pipeline-Schritt 6) und entscheidet die offenen Punkte. Brief: `docs/sessions/BRIEF_SPEC_18_TOOL_PWA.md`. |
| Spec Sub (a) Vorab gefüllt | 2026-05-28 | Spec-Sitzung 18 Sub (a) Vorab | Pipeline-Phase A Schritt **5h.1**. Karte 18 § Sub (a) Andocken voll spec'd: Endknoten-Init-Schema (Pflicht-Felder `endpoint`+`domain`+`domainKeywords`, fail-soft mit `console.warn` bei fehlenden Feldern, Idempotenz mit Sanity-Check auf Pflicht-Feld-Änderung), `openAndockTab(url?: string): Promise<void>`-Signatur (sync Validierung vor `await`, optional URL-Vorbelegung springt zu Schritt 2, `ToolPwaNotReadyError`+`ToolPwaInvalidUrlArgError`), Embedding-Lazy-Trigger (lazy on demand beim ersten `openAndockTab()`-Aufruf nicht bei `init()`, Re-Use wenn `SbkimEmbedding._meta.ready===true` aus 04.C-Pfad, Progress-Indicator in Wizard-Schritt 3 verbindlich), Match-Schwelle-UI (Drei-Schichten-Darstellung `fachlich/prozess/skalierung` via `matchDimensions` aus Modul 04.A + Bar-Farben grün/gelb/rot bei ≥matchThreshold/≥SCHICHT_MIN_MATCH/<SCHICHT_MIN_MATCH, „Trotzdem andocken"-Knopf bei `overall<matchThreshold`, `opts.matchThreshold` override-bar nur reduzierend nicht erhöhend mit Sanity-Check), Modal-Form (Stepper-UI vier Schritt-Punkte oben „① URL — ② Spore — ③ Match — ④ Handshake", Single-Pane-Body, „← Zurück"+„Weiter →"-Footer, Bestätigungs-Modal bei Schluss mit Eingaben, automatischer Modal-Close 2 s nach erfolgreichem Handshake), Andocken aus Multisuchfeld-Discovery (`openAndockTab(url)`-URL-Parameter-Pfad, URL-Vorbelegung springt direkt zu Schritt 2, Erkennungs-Heuristik liegt beim Aufrufer nicht in Sub (a) Vorab), SB-KIMTool-Point-Integration (`opts.externalHubUrl` als optionaler `string|null`-Parameter, Default `null`, Sub (a) Vorab implementiert NICHT den Hub-Fetch — nur Read-Anker für Sub (i) + Multisuchfeld), Verhaltens-Tabu Auto-Polling (kein Auto-Sporen-Discovery-Fetch, keine Wiederhol-Versuche, keine Periodik). § Schnittstelle Sub (a) Vorab-Vertrag verankert (`init`+`openAndockTab`+`close`+`isOpen`+`_meta` als Sub-(a)-Vorab-final; Sub (b)–(i) `open(subBereich?)` bleibt Spec ausstehend); zwei Sub-(a)-Vorab-Errors benannt; `_meta`-Felder voll spec'd (ready/endpoint/domain/domainKeywords/stammCategories/guestCategories/matchThreshold/externalHubUrl/repoUrl/embeddingReady/modalOpen/currentStep/lastFetchUrl/missingFields). § Strikte Tabus Sub (a) Vorab-Block verankert (verbindlich für Bau-Sitzung Sub (a) Vorab); Sub (b)–(i)-Block bleibt Spec-Vorbereitung. § Modal-Form Sub (a) Vorab-Stepper-UI verankert; Sub (b)–(i)-Tab-Container bleibt Voll-Spec 18-Aufgabe. INTERFACES.md § 1 Modul 18 als neuer Eintrag gespiegelt (Status „entwurf Sub (a) Vorab", Sub (b)–(i) explizit „Spec ausstehend"). **`status.json` Modul 18 bleibt `score:"schablone"`** (Sub (a) allein ist noch kein „spec"-Voll-Stand — Voll-Spec 18 hebt es später auf `score:"spec"`). **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.** KEIN Modul-Code in `src/`, KEIN Endknoten-Eingriff, KEINE Tafel-Umsortierung CLAUDE.md (eigene Folge-Pflege-Sitzung mit Klaus' OK für die 5h → 5h.1+5h.2-Aufteilung). KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Spec, kein Sicherheits-Modul-Update). Brief: `docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md`. |
| Tafel-Erweiterung 5→9 Sub-Bereiche | 2026-05-26 | Tafel-Spec-Pflege Mycel-Vision | Klaus' Vision-Klärung 2026-05-26: Sub-Bereiche von 5 (a–e) auf 9 (a–i) erweitert. Sub (a) Andocken erweitert um 4-Schritt-Workflow (URL eingeben, Spore fetchen, Match-Check, Handshake) + Empfangsmodus-Klausel (kein Auto-Polling). Sub (b) NEU: bidirektionaler Sporen-Informationsaustausch (Heterokaryose, ersetzt alte „Sporen-Installation" — die wandert in Sub i). Sub (c)–(e) bleiben (Identitäts-Wechsel / Backup / Self-Apoptose). Sub (f) NEU: Sporen NEU generieren (`domainKeywords` ändern, neu signieren, ohne neue Identität). Sub (g) NEU: Re-Embedding (Modul 03 lazy, Spore + Korpus neu rechnen). Sub (h) NEU: Manueller Handshake-Trigger aus Sibling-Liste (`SbkimAnastomose.handshake`, triggert SIEGEL Bronze→Gold-Wechsel über Modul 16 Sub e). Sub (i) NEU: Spore-Discovery (Hub-Anfrage an Sage-`status.json` ODER Externer-Mycel-Hub-`status.json` ODER User-URL-Input). Neuer Karten-Abschnitt § Such-Feld-Integration-Pattern (Pepo-Demo-Studie als Referenz, Sender-Helper-Code-Pattern, UI-Pattern lokale + Cross-Knoten-Treffer, Anker-Pfad-Konvention). § Schnittstelle `options.enabledTabs` von 5 auf 9 Werte erweitert + `externalHubUrl` neu. **`status.json` Modul 18 bleibt `score:"schablone"`** — Voll-Spec folgt in Spec-Sitzung 18 nach App-Freigabe. Brief: `docs/sessions/BRIEF_SPEC_18_TOOL_PWA.md` aktualisiert. |
| Spec gefüllt | — | Spec-Sitzung 18 | folgt — alle Sub-Bereiche final entscheiden + Schnittstelle festlegen + Modal-Form klären. |
| Code geschrieben | — | Bau-Sitzung 18 | folgt — `src/modules/18_tool_pwa.js` + CSS + Panel 18 in `tests/manual_check.html` + Headless-Smoke. |
| In Endknoten eingebaut | — | Endknoten-Folge-Sitzungen | folgt — Modul 18 in Mein-Rezeptbuch / Mein-Mixarium kopieren + `init()`-Aufruf. |

---

**Querverweise**

- **Abhängigkeiten:** Modul 02 (Spore, Andock + Identitäts-API +
  Backup) · Modul 03 (Embedding, lazy beim Andock) · Modul 04 (Match,
  für Sporen-Installation-Pre-Check) · Modul 05 (Anastomose, Andock-
  Handshake) · Modul 07 (Apoptose, Self-Löschung) · Modul 16 (SBKIM-
  Siegel, Anti-Greenwashing-Klausel) · Modul 17 (Floating-Widget,
  SIEGEL-Slot-Klick triggert `SbkimToolPwa.open()`).
- **Wird genutzt von:** Endknoten-PWAs als Endnutzer-Wartungs-UI ·
  Forker als Standard-Toolset (sechs Zeilen Einbau Modul 17 + Modul 18
  statt eigenes Wartungs-UI schreiben).
- **Verwandt:** Sage-Page-Andock-Wizard (`index.html` § Schwarz-Loch-
  Karte) — Modul 18 ist die modulare Variante davon · Vision-Anker 5
  (Identitäts-Container Rucksack/Safe/Chipkarte, `docs/PULS.md` 2026-05-17)
  — Modul 18 könnte Vorläufer dafür sein, oder davon abgegrenzt
  bleiben (Spec-Sitzung 18 entscheidet).
