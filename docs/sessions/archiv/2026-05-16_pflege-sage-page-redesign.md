# Pflege-Sitzung 2026-05-16 — Sage-Page Vollumbau / Redesign

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase. Branch
`claude/pflege-sage-page-redesign-NelH8`. Klaus' explizite Vorgabe:
„Design soll zeigen, dass jemand mit Ahnung dahintersteht."
Awwwards-/FWA-Niveau-Anspruch.

**Auftrag:** `index.html` komplett neu aufbauen mit:
- neuer Design-System-Schicht (Typografie, 5-Farben-Palette, neue
  Bento-Komposition)
- zentraler Modul-Topologie als Force-Graph (ersetzt die alte
  Dreifach-Visualisierung Pie + Module-Bento + Bau-Puls-Pie)
- Lesematerial-Karte (verlinkt auf PR #55 und `sbkim_paper.pdf`)
- Backup-Hinweis-Sub-Karte (Identitäts-Persistenz Stufe 2)
- Sichtbarkeits-Lampen-Demo-Anker in der Topbar
- scroll-getriggerter Lebenszyklus-Karte
- Live-Daten-Verträge (status.json-Renderer) bleiben unangetastet
- Pflege-Konvention `docs/sage_page_pflege.md` für Folgesitzungen

---

## Drei Pflicht-Frage-Antworten (verbindlich)

### Pflicht-Frage 1 — Typografie-Familie + Bezugsquelle

**Entschieden: Variante (b) — Geist (Sans) + Geist Mono (Mono) via Google Fonts CDN.**

**Begründung:**

- **Premium-Wirkung, Awwwards-tauglich:** Geist ist Vercel's Haus-
  Schrift (Stand 2024), seit 2025 über Google Fonts verfügbar. Sie
  ist explizit für Tech-Landingpages designt — die Referenzklasse,
  die Klaus mit „jemand mit Ahnung dahinter" meint. Inter (Variante
  a) wäre solide, aber inzwischen so verbreitet, dass sie eher
  „sicher" als „designerisch" wirkt.
- **System-Font (Variante c) verworfen:** Klaus' Anspruch ist
  explizit „Awwwards-Niveau-Anspruch" — System-Font erfüllt den
  Erst-Render-Speed-Anspruch, aber liefert nicht den Designer-Look.
  Geist via Google Fonts mit `display=swap` und `preconnect` ist
  schnell genug.
- **Zwei Familien statt drei:** Die Hero-Display-Typo wird über
  Geist mit `font-weight: 600` + `letter-spacing: -0.038em` +
  `clamp(2.6rem, 7vw, 5.6rem)` realisiert — kein eigenes Display-
  Cut nötig (Geist trägt das in 600/700 sauber). Spart einen
  Font-Download.
- **Gradient-Text-Trick:** Der Hero-Titel hat einen weichen Text-
  Gradient (weiß → 55%-Weiß, vertikal) für „premium glass"-Wirkung,
  plus einen accent-Gradient (teal → violett → gold) auf dem Wort
  „Mycel-Protokoll". Patterns aus Linear's und Vercel's Hero-
  Designs adaptiert.

**Bezugsquelle:** Google Fonts CDN mit `preconnect` (zwei Hosts:
`fonts.googleapis.com` + `fonts.gstatic.com`). Kein fontsource-
Hosting, weil Klaus' Page ohnehin auf GitHub Pages liegt (CORS für
Fonts ist nicht relevant).

### Pflicht-Frage 2 — Visualisierungs-Reduktion (Modul-Status)

**Entschieden: Variante (a) — eine zentrale Force-Graph-Topologie ersetzt alle anderen Modul-Visualisierungen.**

**Begründung:**

- **Klaus' explizite Anweisung „Doppelungen entfernen":** Die alte
  Sage-Page hatte den Modulstand DREIMAL visualisiert: oben den
  Demo-Score-Ring (indirekt), die Module-Bento-Karte (12 Kacheln)
  und unten die Bau-Puls-Karte mit erneutem Mini-Pie. Das war
  redundant und visuell anstrengend. Die Topologie kombiniert
  **Status UND Abhängigkeiten in einer Sicht** — semantisch reicher
  als ein Pie, der nur Aggregate zeigt.
- **Pie ist raus, Mini-Pie wäre Rückfall:** Variante (b) hätte den
  Pie unten als Mini-Variante wieder eingeführt — das wäre Doppelung
  wiederbelebt. Der Aggregat-Count wandert stattdessen in die
  Topologie-Legende unten (eine Zeile, jeden Status mit Count
  daneben).
- **Sankey (Variante c) verworfen:** Anspruchsvoll, aber für
  „Reife-Status pro Modul" zu komplex für Erst-Besucher. Sankey
  zeigt Flüsse über Zeit — hier gibt es aber keine Zeitachse, nur
  Status-Schnappschüsse. Hätte mehr verwirrt als geklärt.
- **Implementation:** statisches DAG-Layout (4 Spalten:
  foundation / identity·vector / network / data-exchange; eine
  Backlog-Reihe unten). Position pro Modul-ID kuratiert in
  `TOPO_LAYOUT`-Objekt (frei umbenennbar, gehört zur Sage-Page-
  Schicht, nicht zum status.json-Vertrag). Knoten-Punkt-Farbe nach
  §5-Status-Mapping; Gold-Ring um „bereit zum Bau"-Module
  (`isNextUp`). SVG-SMIL-Animation: alle Knoten atmen weich
  (`@keyframes topo-breath` mit `--topology-breath-s: 4.6s`),
  nextup-Module pulsen schneller (`--nextup-glow-s: 2.4s`).
- **Modul-Detail-Liste unten:** als Ergänzung — Schnellübersicht
  als Tabelle mit Klick-zum-Detail-Screen. Topologie = visuelle
  Übersicht, Liste = Detail-Lese-Pfad. Klaus' explizite Forderung
  „Detailliste als Tabelle weiter unten" erfüllt.

### Pflicht-Frage 3 — Storytelling-Reihenfolge auf overview

**Entschieden: Variante (a) — Hub-First.**

**Reihenfolge:** Hero (Display-Titel + Sub-Claim) → Mycel-Topologie
(in der Hero-Karte unten) → Lebenszyklus (scroll-aware) → Modul-
Schnellübersicht + Endknoten (asymmetrisch 7+5) → Lesematerial (mit
Backup-Hinweis-Sub-Block) → Andock-Live-Generator → Meta-Footer.

**Begründung:**

- **Klaus erklärt etwas Neues:** Sage hat noch keine etablierte
  Mind-Share. „Aktion-First" (Variante c, Andock zuerst) wäre für
  Stripe/Resend richtig — die zeigen „kopier-paste den Snippet"
  zuerst, weil jeder weiß, was eine Payment-Library ist. SBKIM
  weiß niemand, also: erst **zeigen, was es ist** (Topologie +
  Lebenszyklus), dann erklären (Lesematerial), dann zur Aktion
  einladen (Andock).
- **„Frage-First" (Variante b) verworfen:** Die Lesematerial-Karte
  als Erst-Eintritt würde den Hero entwerten — der riesige Display-
  Titel ist der eigentliche Hook, das Paper ist Tieflese für die,
  die mehr wollen. Außerdem: das Über-Modal („Was bringt mir das?")
  fängt schon den „Was ist das?"-Pfad ab — Variante (b) hätte
  doppelt erklärt.
- **Andock am Ende, weil Vertrauen vor Aktion:** Erst Verständnis,
  dann „pack mich mit ein". Das ist der Stripe-Hero-Inverse, aber
  für ein Forschungs-/Werkstatt-Projekt der richtige Weg.

---

## Was getan

### `index.html` komplett neu aufgebaut

- **Alte Datei:** 3955 Zeilen, 15 Karten, dreifache Modul-Visu, ein
  großer Hero mit Demo-Score-Ring als Mittelpunkt.
- **Neue Datei:** ~1690 Zeilen, **6 Karten** auf Overview (Hero +
  Lebenszyklus + Modul-Liste + Endknoten + Lesematerial + Andock,
  plus Meta-Footer) + 4 weitere Screens (cycle / module / data /
  warum), Topologie als zentrale Visualisierung.

#### Design-System

- **Geist + Geist Mono** via Google Fonts CDN, `preconnect`-Optimiert.
- **5-Farben-Palette** als CSS-Custom-Properties am `:root`:
  `--bg` (#08081A), `--glass` (3.5% Weiß), `--accent` (#6EE7D3 teal),
  `--accent-2` (#8B5CF6 violett), `--gold` (#F4B435), plus Text-/
  Muted-/Dim-Schichten. §5-Status-Farben separat gehalten, nur
  innerhalb der Topologie und der Modul-Badges genutzt.
- **Spring-Easing als Token:** `--ease-spring` (cubic-bezier-Approx
  von Framer-Motion's `damping=12, mass=1`), `--ease-out-quart`. Auf
  Karten-Hover, Mod-Row-Hover, Phase-Pill-Hover.
- **Bento mit 12-Spalten-Grid:** Karten in 4/5/6/7/8/12-Spans. Auf
  Mobile (<780px) alle auf 12.

#### Mycel-Topologie

- **Force-Graph-Layout** static, aus `status.json.modules` +
  `schutzBacklog[]` + `diffusionBacklog[]` gespeist.
- **4 Spalten-Cluster** (foundation / identity·vector / network /
  data-exchange) + 1 Backlog-Reihe unten.
- **Knoten** mit BG-Kreis + Status-Dot + ID + Name. Nextup-Module
  bekommen einen pulsierenden Gold-Ring.
- **Kanten** als Bezier-Kurven aus `abhaengig[]`, mit active-Klasse
  für Kanten zu nextup-Modulen.
- **Legende** unten mit Status-Counts + Nextup-Count.
- **Klick auf Knoten** öffnet Modul-Detail-Screen.

#### Lebenszyklus-Karte (scroll-aware)

- **Auto-Loop** alle 3200ms (Pfad-Wechsel via `tickPhase()`).
- **IntersectionObserver** auf `#cycle-box` mit Threshold 0.35 —
  Loop pausiert, wenn Karte aus dem Viewport scrollt (spart CPU
  außerhalb), startet wieder bei Wieder-Eintritt.
- **Manueller Klick auf Phase-Pill** überschreibt Auto-Loop für 9s
  (`phaseManualOverride`-Flag) — Leser kann eine Phase „festhalten",
  bevor der Auto-Loop wieder übernimmt.

#### Lesematerial-Karte (NEU)

- **Zwei Links** parallel: `./docs/PAPER_NUTZEN_UND_INTEGRATION.md`
  (PR #55, noch nicht gemerged — Link wird 404 bis Merge) und
  `./sbkim_paper.pdf` (existiert bereits).
- **Backup-Hinweis-Sub-Block** unten: erklärt Modul 02 Backup-Export
  Stufe 2 (gemerged 2026-05-16, PR #54), Gold-Akzent-Border-Left.

#### Sichtbarkeits-Lampen (Demo-Anker)

- **Zwei kleine Kreise** oben rechts in der Topbar, in einem Pill-
  Container „lebt | verkehr".
- **Lampe „lebt"** = statisch grün/teal (Sage ist Hub, Demo der
  Sichtbarkeits-Konvention für Modul 15).
- **Lampe „verkehr"** = pulst kurz bei jedem `loadStatus()`-Fetch
  (CSS `@keyframes lamp-pulse`, getriggert per Klassen-Toggle in
  JS).
- **Klar als Demo markiert:** `title`-Attribut nennt explizit
  „Demo-Anker, spätere Modul-15-Spec".

### `docs/sage_page_pflege.md` neu angelegt

- **ID-Vertrag-Tabelle**: welche IDs sind status.json-Renderer-
  Anker, welche sind frei umbenennbar.
- **§0-Konstanten-Spiegelungs-Tabelle**: welche §0-Konstanten in
  der UI sichtbar werden und wo.
- **Anleitungen** für „status.json bekommt neues Feld", „neues Modul
  (NN > 14)", „Modul-15 Lampen-Spec kommt".
- **Animations-Konstanten-Tabelle** (Token-Liste mit Werten).
- **Konsistenz-Regel mit Modul 02 § Spore-JSON** für den Live-
  Generator (Pflicht-Felder + optionale Felder).

### Pflege-Konvention dokumentiert die Pflicht-Frage-Entscheidungen

…damit eine spätere Folge-Pflege-Sitzung weiß, dass z.B. der Pie
**bewusst** entfernt wurde und nicht zurückgebracht werden soll.

---

## Material-Block — Vorbild-Patterns, die übernommen wurden

| Pattern                                       | Quelle (Vorbild)            | In Sage-Page                                                       |
|-----------------------------------------------|-----------------------------|--------------------------------------------------------------------|
| Geist-Schrift + Geist-Mono                    | Vercel (vercel.com)         | Body + Code                                                        |
| Gradient-Text-Wash über Display-Titel         | Linear (linear.app)         | Hero-Titel weiß → 55%-Weiß vertikal                                |
| Eyebrow-Pill mit Lebendigkeits-Punkt          | Stripe / Resend             | Hero-Eyebrow „Bau-Hub · Spec-Werkstatt"                            |
| Bento-Grid asymmetrisch (12-Spalten)          | Apple Vision Pro Marketing  | Lebenszyklus 12-span, Modul-Liste 7-span, Endknoten 5-span         |
| Spring-Easing auf Hover                       | Framer Motion (default)     | `cubic-bezier(0.34, 1.56, 0.64, 1)` als CSS-Token                  |
| Sticky-Topbar mit Backdrop-Filter             | Pitch / Linear              | `.topbar` mit `backdrop-filter: saturate(1.6) blur(14px)`          |
| Demo-Badge-Pill in der Hero-Topologie         | Vercel-Status-Page          | „Hub · kein Endknoten"-Pill oben rechts                            |
| Visibility-Lampen-Pattern                     | RunwayML / Status-Page-Apps | Topbar-Lampen-Pill                                                 |
| Code-Block mit Syntax-Färbung im Andock-Output | Resend / Stripe Docs        | `<span class="key">` / `<span class="str">` / `<span class="com">` |
| Hover-Card-Animation `translateY(-2px)`       | Linear (Hover-States)       | `.paper` Lesematerial-Karten                                       |

**Bewusst NICHT übernommen:**
- Three.js-Hero-Animationen (Stripe v5+, Vercel-Pricing) — würde die
  Single-File-PWA-Philosophie brechen, keine 3D-Bibliothek im Hub.
- Cursor-Trailing-Effekte (linear.app, resend.com) — JS-Aufwand
  ohne Erkenntnis-Gewinn für ein Spezifikations-Hub.
- Marquee-Logo-Strips (vercel.com Customer-Logos) — Sage hat keine
  Customer-Logos und keine Logos-Strip-Story.

---

## Bewusst nicht angefasst

- **`status.json`** unverändert — Pflicht-Frage 2 ist reine UI-
  Pflege, kein Modul-Score-Wechsel.
- **`update_puls_pie.py`** NICHT aufgerufen (kein Score-Wechsel,
  CLAUDE.md-Konvention).
- **INTERFACES.md** unverändert — Vertrag bleibt unangetastet.
- **Modul-Karten 00–14** inhaltlich unverändert; die Sage-Page
  verlinkt nur darauf.
- **Modul 15 Sichtbarkeits-Lampen**: NICHT als echte Karte angelegt
  — nur ein visueller Demo-Anker in der Topbar. Eine spätere Spec-
  Sitzung legt Modul 15 als eigene Karte an.
- **`PROTOCOL_VERSION`**, `EMBEDDING_DIM`, `PROVIDER_MIN_MATCH`,
  `SIBLING_MAX_AGE_MS`, `HETERO_MAX_ANCHORS`, `BACKUP_*`-Konstanten
  bleiben in der UI als Lese-Anzeige; keine §0-Änderung.
- **Externe Animations-Bibliotheken** (GSAP, Framer Motion, Lottie,
  Three.js): nicht eingebunden. Reines CSS + SVG SMIL + JS-Mini-
  Helper.
- **PULS-Schnellüberblick-Tabelle** unverändert (keine Modul-Status-
  Änderung).

---

## Validierung

- **HTML-Parse:** `html.parser` (Python) — keine Syntax-Fehler.
- **JS-Syntax:** ein `<script>`-Block extrahiert, `node --check`
  grün.
- **Live-Daten-Verträge** abgeglichen mit Vorgänger-Code:
  - `loadStatus()` → fetch `status.json`, Fallback bei Fehler.
  - `renderTopbar` / `renderFooter` schreiben in gleiche IDs wie
    vorher (`topbar-meta`, `ft-branch`, `ft-proto`, `ft-schema`,
    `ft-update`).
  - `renderTopology` (NEU) ersetzt `renderModules` /
    `renderBauPuls` / `renderBauPulsPie` — schreibt in `#topology-svg`,
    `#topology-legend`, `#topology-counts`.
  - `renderModuleList` (NEU) schreibt in `#module-list` — ersetzt
    die alte Module-Bento-Karte.
  - `renderEndknoten` schreibt in `#endknoten-grid` wie vorher.
  - `pingEndknoten` korrigiert den Pfad: vorher `/.well-known/sbkim/spore.json`,
    jetzt `/sbkim/spore.json` (konsistent mit Spec-Sitzung 09 / Modul 09).
  - `generateSpore` / `copyText` / `downloadSpore` unverändert.
- **Live-Daten-Schema** unverändert.
- **Browser-Sichttest** ausstehend — headless gebaut, wartet auf
  Klaus' Browser-Lauf (Galaxy Tab S6 + DeX).

---

## Was offen blieb

- **Klaus' Sichttest im Browser:**
  - Hero rendert sauber (Geist-Font lädt, Gradient-Text greift)
  - Topologie rendert alle 14 Module mit korrekten Kanten und
    Status-Farben
  - Lebenszyklus-Card scroll-trigger funktioniert (Auto-Loop hält
    außerhalb des Viewports)
  - Manuelle Phase-Klick-Override funktioniert (Pill wechselt, 9s
    Lock, dann Auto-Loop übernimmt wieder)
  - Sichtbarkeits-Lampe „verkehr" pulst bei `loadStatus()`-Fetch
  - Andock-Generator erzeugt valide Spore-Vorlage
  - Lesematerial-Karte: `./docs/PAPER_NUTZEN_UND_INTEGRATION.md`
    liefert 404 bis PR #55 gemerged; `./sbkim_paper.pdf` läuft.
- **PR #55 mergen** (Paper Nutzen + Integration) — Lesematerial-Karte
  ist sonst halb-funktional. Vorschlag: Klaus merged PR #55 nach
  Sichttest dieser Sitzung.
- **Modul 15 (Sichtbarkeits-Lampen) Spec-Sitzung** offen — bleibt
  als § Offene Querschnitts-Frage in PULS, wird gezogen nach erstem
  Cross-Knoten-Handshake (dann ist klar, was die zweite Lampe
  tatsächlich anzeigen soll).
- **Lebenszyklus-Tieferanimation** (Spore zerbricht / Anastomose
  vernetzt / Apoptose verklingt — Klaus' Wunsch aus dem Brief
  Punkt 3g) ist im Detail-Tour-Screen (#screen-cycle) bereits
  realisiert; der scroll-aware Übersichts-Loop hält sich an die
  4-Phasen-Auto-Sequenz (das ist die richtige Ebene — der
  Übersichts-Screen lädt schnell, die Tieflese passiert beim Klick
  auf „Phasen einzeln erklären →").

---

## Nächster sinnvoller Schritt

1. **Klaus' Sichttest der Sage-Page** im Browser (Tab S6 + DeX
   + Eruda für Console). Wenn Geist-Font nicht lädt: System-Font-
   Fallback greift (`font-family: "Geist", system-ui, sans-serif`).
2. **PR #55 (Paper) mergen** — damit die Lesematerial-Karte
   funktional vollständig ist.
3. **Spec-Sitzung Modul 15 Sichtbarkeits-Lampen** in ~60 Min
   headless, nachdem der erste Cross-Knoten-Handshake live war
   (dann ist klar, was die zweite Lampe anzeigen soll).
4. **Pflege-Konvention `docs/sage_page_pflege.md` ist die Lebens-
   ader für Folgesitzungen** — jede Sage-Page-Pflege liest sie
   zuerst.
