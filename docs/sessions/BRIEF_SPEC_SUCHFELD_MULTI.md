# Brief — Spec-Sitzung Multisuchfeld (Lokal · Mycel · Extern)

**Anlass:** Klaus' Vision-Klärung 2026-05-27 + 2026-05-28: das
Suchfeld in den Endknoten-PWAs (Mein-Rezeptbuch, Mein-Mixarium,
Sage-Page) soll **multi-modal** sein — drei Such-Modi parallel
erreichbar:

1. **Lokal** — `SbkimMatch.queryLocal` (Modul 04.C, fertig 2026-05-26).
2. **Mycel** — Cross-Knoten via `BroadcastChannel('sbkim-membrane')`
   `op:"query"` (Modul 15 Sub b, fertig 2026-05-25).
3. **Extern** — Web-Such über externe API + Spore-Discovery via
   Sage-`status.json` / Externen-Mycel-Hub-`status.json`.

Bisher decken die Briefe `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md` +
`_MM.md` nur **Lokal + Mycel** ab (Dual-Modus aus Karte 18 § Such-
Feld-Integration-Pattern). Der Extern-Modus ist neu.

**Sitzung läuft als reine Spec-Sitzung** — keine Modul-Code-
Änderungen, keine Endknoten-Eingriffe. Ergebnis ist eine Voll-Spec,
die zwei Bau-Briefe nachzieht (Endknoten-Suchfeld-Erweiterung
MR + MM, eigene Folge-Sitzungen).

**Pipeline-Stellung:** Phase A — neue Schritte **5k** (Spec-Sitzung
Multisuchfeld) und **5l** (Endknoten-Erweiterung Multisuchfeld in
MR + MM, eigene Sitzung pro Endknoten-Repo). Nicht-blockierend für
App-Freigabe (Schritt 6), aber als Klarheits-Anker für Forker
empfohlen vorher zu klären.

**Branch-Vorschlag:** `claude/spec-suchfeld-multi`

---

## Tafel-Lösung Empfangsmodus-Konflikt

CLAUDE.md § „Was du nicht tust" verbietet ausdrücklich „Crawler,
keine Pulsation, keine Eigenanfragen ins offene Netz". Der
Empfangsmodus mit Antwortrecht ist das Mycel-Grundprinzip.

Die neue **Vier-Schichten-Lesart** (CLAUDE.md § Pflege 2026-05-27)
löst den Konflikt sauber:

- **Schicht 1 Mycel** = Empfangsmodus + Antwortrecht (server-los,
  peer-to-peer). Das Empfangsmodus-Prinzip gilt für **diese**
  Schicht.
- **Schicht 2 Pilz** = Fruchtkörper oberirdisch — menschliche Sucher
  (Konsumenten-PWAs), kommerzielle Pilze, Agent-Fruchtkörper. **Akquise
  gehört in die Pilz-Schicht, nicht ins Mycel.**

**Extern-Such ist Pilz-Schicht-Akquise**:

- Oberirdisch (sichtbar, vom User initiiert).
- Sichtbar (UI-Symbol, Tooltip benennt die Such-Quelle).
- **User-Geste-getriggert** (jeder einzelne externe Fetch ist
  ein expliziter Such-Klick, kein Daemon, kein Auto-Polling).
- Kein Hintergrund-Crawl.
- Kein Auto-Hinterher-Embedding ohne User-Wissen.

Damit ist die Tafel **eingehalten**, nicht umsortiert: das Mycel
(Schicht 1) bleibt Empfangsmodus; die Pilz-Schicht (Schicht 2) darf
oberirdisch akquirieren, weil sie per Definition genau das ist.

---

## Drei Such-Modi formell

### Modus 1 — Lokal (`SbkimMatch.queryLocal`)

- **Backend:** Modul 04.C `queryLocal(text, k?, options?)` (fertig).
- **Trigger:** Symbol-Klick „Lupe lokal" (oder Default-Auswahl).
- **Verhalten:** Top-k Embedding-basierter Match über lokalen
  Korpus, Schwelle `PROVIDER_MIN_MATCH=0.80`.
- **Empfangsmodus-Konformität:** ✓ — bleibt im PWA-eigenen Speicher.
- **Klaus' UX-Wunsch:** „Lokal soll gleich zum Ergebnis Springen"
  (Sprung-Verhalten — siehe § UI-Pattern unten).

### Modus 2 — Mycel (`BroadcastChannel` op:"query")

- **Backend:** Modul 15 Sub (b) `op:"query"`-Empfänger (fertig);
  ruft intern Modul 04.C `queryLocal` im Empfänger-Knoten.
- **Trigger:** Symbol-Klick „Lupe Mycel".
- **Verhalten:** Sender-Helper (im Endknoten-Code) postet
  `op:"query"` an alle Geschwister; Geschwister antworten mit
  `op:"queryResult"`. Pro Geschwister 3 s Timeout, fail-soft.
- **Empfangsmodus-Konformität:** ✓ — bleibt im same-origin-Browser-
  Mycel; eine Geste, ein Roundtrip pro Such-Klick.

### Modus 3 — Extern (Web + Forker-Sporen)

- **Backend (offen für Spec-Sitzung):** kombinierter Drei-Pfad-Such:
  - **Pfad 3a — Externer Mycel-Hub `status.json`** (siehe
    `docs/components/_mycel_hub.md`): fetch
    `<externalHubUrl>/status.json`, `endknoten[]`-Liste auswerten,
    `domain` / `stammCategories` / `guestCategories` als String-
    Match gegen Such-Text. **Empfangsmodus-konform** — nur fetch
    der öffentlichen `status.json`-Datei pro User-Klick.
  - **Pfad 3b — Sage-Page `status.json`** (Klaus' Mycel-Anker):
    fetch `https://lausiklauskn-png.github.io/Sage-Protokol/status.json`,
    gleicher Auswerte-Pfad wie 3a. Klaus' Endknoten sind dort
    gelistet — Pepo-Forker und Mutti-Forker werden dort später
    gelistet, sobald angedockt.
  - **Pfad 3c — Externe Web-Such-API** (offen für Spec-Sitzung —
    siehe § Externe-Such-Backend-Frage offen unten): EINE API pro
    User-Klick, kein Daemon. User-Pflicht für API-Key (analog
    Modul 04.B Stufe B opt-in pro Endknoten).
- **Trigger:** Symbol-Klick „Lupe Web" (Globus-Symbol).
- **Verhalten:** Klaus' Wunsch 2026-05-28: „bei klick auf web sollten
  schon externe Knoten mit angeführt werden". Treffer-Liste mischt
  Hub-Treffer (Pfad 3a/3b) UND Web-API-Treffer (Pfad 3c) in
  derselben Sektion, jede Quelle mit Marker („→ Externer Hub" /
  „→ Sage-Mycel" / „⌖ Web · <api-name>").
- **Empfangsmodus-Konformität:** ✓ — User-Geste-getriggert, ein
  Fetch pro Such-Klick, Pilz-Schicht-Akquise.

---

## UI-Modus-Wechsel (Klaus-Festlegung 2026-05-28)

**Form:** **Drei Symbol-Schalter UNTER der Texteingabe IM Suchfeld**
(nebeneinander, ohne zusätzlichen Höhen-Bedarf — das Suchfeld ist
„hoch genug"). Default grau, bei Klick wechselt das jeweilige Symbol
auf seine Aktiv-Farbe.

**Symbol-Vorschlag (Spec-Anker, Bau-Sitzung entscheidet finale
Glyphen):**

| Symbol | Aktiv-Farbe (Spec-Anker) | Tooltip | Modus |
|---|---|---|---|
| 🔍 (Lupe-Solid) | `--accent-local: #2EA77E` (Mycel-Grün) | „Lokal — in dieser App suchen" | Lokal |
| 🕸 (Mycel-Symbol, SVG: drei verschlungene Hyphen-Bögen) | `--accent-mycel: #C9A961` (Edel-Gold aus Modul 16) | „Mycel — bei angedockten Geschwister-Knoten anfragen" | Mycel |
| 🌐 (Globus, SVG) | `--accent-web: #6E8FBF` (Stahl-Blau) | „Web — Externer Mycel-Hub + Sage + Internet" | Extern |

**Multi-Aktiv-Mode:** ein, zwei oder alle drei Symbole gleichzeitig
aktiv (Klaus' Wunsch implizit — „bei klick verändert sich die Farbe"
heißt Toggle, nicht Exclusive-Choice). Mindestens eines muss aktiv
sein — letzter aktiver Schalter ist nicht deaktivierbar (UI-Discipline,
sonst hätte das Suchfeld keinen Modus).

**Default-Auswahl (Spec-Vorbereitung, Bau-Sitzung entscheidet):**

- **Lokal** aktiv (Default-Modus, weil Lokal-Sprung das schnellste
  Ergebnis liefert).
- **Mycel** aktiv (Klaus' Mycel ist mit zwei Endknoten lebend).
- **Extern** **nicht** aktiv (User muss explizit zustimmen, weil
  Pilz-Schicht-Akquise = Internet-Fetch).

**Persistenz:** localStorage pro PWA (`sbkim_search_modes_active`),
keine IndexedDB-Eintragung (UX-only, nicht protokoll-relevant).
**Pro PWA**, weil Mein-Rezeptbuch + Mein-Mixarium getrennte Origin
oder Pfade haben — Konfig nicht teilbar.

**Tooltip-Disziplin:** jedes Symbol hat einen `title`-Attribut +
optional einen Aria-Label-Text. Klaus' Konvention: Tooltip nennt
NICHT das technische Modul (kein „Modul 04.C"), sondern den Zweck
(„Lokal — in dieser App suchen").

**Tabu:** kein vierter Symbol-Schalter („Alle"). Multi-Aktiv ist
implizit (User aktiviert mehrere). Kein „Alle-Tab", weil das die
Pilz-Schicht-Disziplin (Web aktiv ist eine bewusste Geste) verwässert.

---

## Treffer-UI (Klaus-Festlegung 2026-05-28)

Klaus' Vision: **unified-Liste mit Quellen-Marker**, aber mit
Modus-spezifischem Verhalten.

### Lokal-Treffer — Sprung statt Liste

**Klaus' Wunsch:** „Lokal soll gleich zum Ergebnis Springen, (Rezept/
Getränk)".

**Spec-Lösung:**

- **Wenn nur Lokal aktiv ist** UND es genau einen Treffer mit
  Score ≥ 0.95 gibt → **direkter Sprung zum Anchor** (`location.hash =
  "#anchor=<anchorId>"` + `scrollToAnchor()`).
- **Wenn mehrere Lokal-Treffer ≥ 0.80 sind** → unified-Liste anzeigen
  (auch im Lokal-only-Modus, weil mehrere relevante Rezepte ein Sprung
  unmöglich macht).
- **Wenn Lokal + Mycel oder Lokal + Web aktiv ist** → unified-Liste
  anzeigen, KEIN Direkt-Sprung (sonst verliert User die Mycel-/Web-
  Treffer aus dem Blick).

**Sprung-Schwelle 0.95:** Spec-Wahl, weil 0.95 nur bei sehr klarer
Übereinstimmung (z.B. „Gulasch" → „Muttis Gulasch") erreicht wird.
Schwelle bewusst HÖHER als `PROVIDER_MIN_MATCH=0.80`, damit
mehrdeutige Eingaben weiter Listen liefern. **Bau-Sitzung entscheidet
finale Schwelle.**

**Stichwort-Modus-Sonderfall:** wenn `classifySearch()` (Karte 18)
„stichwort" zurückgibt UND der lokale-Filter-Helper einen einzigen
Treffer liefert → ebenfalls direkter Sprung. Sonst Liste.

### Mycel-Treffer — Drei-Layer mit Match-Dimensionen + Score-Ring

**Klaus' Wunsch:** „Mycell soll Die Drei Layer mit %tualen
übereinstimmung der Suche wie geplant Semantisch Technisch und noch
eine übereinstimmung die zeigt wie Hoch die übereinstimmungen mit
der semantischen suche sind."

**Spec-Lösung — Drei-Komponenten-Anzeige pro Mycel-Treffer:**

1. **Score-Ring (Pepo-Demo-Pattern aus Karte 18 § Such-Feld-
   Integration-Pattern):** Kreis-Ring 0–100 % mit Farb-Skala
   - ≥ 70 % → `--accent-mycel: #C9A961` (Gold)
   - 40 – 69 % → `--ring-mid: #B8A05E` (Bronze)
   - < 40 % → `--ring-low: #8C4A4A` (gedämpftes Rot)
   - Zentral-Zahl in % (z.B. „91 %").
2. **Drei Bars für Match-Dimensionen** (Modul 04.A `matchDimensions`):
   - **Fachlich** (semantische Hauptachse) — typisch 0.80–0.95 bei
     gutem Match.
   - **Technisch** (Kategorien-/Prozess-Achse, z.B. „Cocktail" passt
     zu „Wein") — kann niedriger sein.
   - **Skalierung** (Aufwand / Komplexität) — meist neutral.
   Spec-Anker: Bars sind 0.00 – 1.00, gerendert als horizontale
   Balken in Mycel-Gold (`--accent-mycel`), Label links („Fachlich"
   / „Technisch" / „Skalierung"), Score rechts (z.B. „0.88").
3. **Gesamt-Score** (semantischer Übereinstimmungs-Score aus Modul
   04 `match()` Skalarprodukt) — wird im Score-Ring als zentrale Zahl
   angezeigt UND zusätzlich als Klein-Text-Marker („Sem. 0.91").

**Quelle-Marker pro Mycel-Treffer:** „→ <Geschwister-Name>" (z.B.
„→ Mixarium") als anklickbarer Link, Ziel-URL aus Karte 18 § Anker-
Pfad: `https://lausiklauskn-png.github.io/Mein-Mixarium/#anchor=<id>`.

**Daten-Schnittstelle:** Modul 15 Sub (b) `op:"query"`-Antwort
(`payload.results[]`) muss um Felder erweitert werden, die die Drei-
Layer-Anzeige tragen:

```js
queryResult.payload.results[i] = {
  label:       string,           // bisher
  anchorId:    string,           // bisher
  score:       number,           // bisher (Semantik-Score)
  dimensions?: {                 // neu, optional, aus Modul 04.A
    fachlich:    number,
    technisch:   number,
    skalierung:  number,
  },
};
```

**Offene Spec-Punkte:**

- Soll Modul 04.C `queryLocal` automatisch `dimensions` mitliefern?
  Aktuell liefert es nur `{label, anchorId, score}`. Modul 04.A
  `matchDimensions` ist sync-API. Vorschlag: `queryLocal(text, k,
  {withDimensions:true})` als Opt-In.
- Soll der Score-Ring auch für Lokal-Treffer angezeigt werden? Spec-
  Vorschlag: nein (Lokal springt direkt oder zeigt einfache Liste).
- Soll der Quelle-Marker pro Mycel-Treffer einen Geschwister-Avatar
  (gespeichert in `sbkim_siblings.spore.icon`?) zeigen? Spec-Vorschlag:
  Stufe 2, nicht für die erste Iteration.

### Extern-Treffer (Web-Modus)

**Klaus' Wunsch:** „bei klick auf web sollten schon externe Knoten
mit angeführt werden sollte auch gehen". D.h. Web-Modus mischt
mindestens zwei Quellen:

- **Hub-Treffer** aus Pfad 3a/3b (Externer Mycel-Hub + Sage-Page
  `status.json`-Auswertung).
- **Web-API-Treffer** aus Pfad 3c (externe Such-API).

**UI-Pattern:**

| Treffer-Quelle | Marker | Score-Anzeige |
|---|---|---|
| Hub-Treffer (Mycel-extern) | „→ <Knoten-Name> · Externer Hub" | Score-Ring + Drei-Layer-Bars (wenn Hub-`status.json` `domainVector` liefert; sonst nur String-Match-Treffer ohne Score) |
| Sage-Mycel-Treffer (Klaus' Endknoten via Sage-`status.json`) | „→ <Knoten-Name> · Sage-Mycel" | wie Hub-Treffer |
| Web-API-Treffer | „⌖ Web · <api-name>" | nur Snippet (kein Score-Ring, weil API liefert keinen Embedding-Score) |

**Unified-Liste:** alle drei Quellen-Typen werden in dieselbe Liste
gerendert. Reihenfolge: Hub-Treffer (höchster Score) → Sage-Mycel-
Treffer (höchster Score) → Web-API-Treffer.

**Klaus' offener Punkt:** soll bei Klick auf einen Web-API-Treffer
die externe Seite in einem neuen Tab geöffnet werden? Spec-Vorschlag:
ja, `target="_blank" rel="noopener noreferrer"`.

### Unified-Liste mit Quellen-Marker (Gesamt-Verhalten)

**Spec-Anker:**

```
┌─────────────────────────────────────────────────────────────┐
│ Suche: "welcher Wein passt zu Lasagne?"                     │
├─────────────────────────────────────────────────────────────┤
│ [🔍 Lokal]  [🕸 Mycel]  [🌐 Web]  ← Symbol-Schalter         │
├─────────────────────────────────────────────────────────────┤
│ ▸ Aus dem Mycel                                             │
│   ⊙ 91 %  Chianti Classico       Sem. 0.91                  │
│     Fachlich  ████████░░  0.91                              │
│     Technisch ███████░░░  0.78                              │
│     Skalier.  █████░░░░░  0.50                              │
│     → Mixarium                                              │
│                                                              │
│   ⊙ 84 %  Sangiovese                Sem. 0.84               │
│     …                                                        │
│     → Mixarium                                              │
│                                                              │
│ ▸ Aus dem Web                                               │
│   → Pepo-Forker-Knoten · Externer Hub                       │
│     "Italienische Rotweine zu Lasagne"  Sem. 0.79           │
│     Fachlich  ███████░░░  0.79                              │
│     Technisch ████░░░░░░  0.42                              │
│     → forker-pwa.example.com/wine                           │
│                                                              │
│   ⌖ Wikipedia · "Lasagne"                                   │
│     "Lasagne ist eine italienische Pasta…"                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Externe-Such-Backend-Frage (offen für Spec-Sitzung)

Klaus' Begriff „Spuren": noch nicht klar definiert. Zwei Lesarten:

- **Lesart A (technisch):** „Spuren" = Treffer-Snippets aus dem
  Internet, vom User explizit angefordert.
- **Lesart B (philosophisch):** „Spuren" = Pilz-Schicht-Hyphen-
  Reste, die der User auf seinem Weg durch die Vier-Schichten
  hinterlässt. (Hier nicht relevant — diese Lesart gehört in
  Phase D Pilz-Schicht-Wirtschafts-Spec.)

Spec-Sitzung Multisuchfeld klärt: meint Klaus Lesart A für den
technischen Web-Modus.

### API-Optionen (Spec-Sitzung entscheidet)

| API | Pro | Contra |
|---|---|---|
| **DuckDuckGo Instant Answer API** | kostenfrei, kein API-Key, kein Tracking | sehr begrenzte Treffer-Qualität (Instant-Answer-Box nur, keine Voll-Such-Resultate); CORS-Frage offen |
| **Brave Search API** | strukturierte Suche, niedriges Tracking, JSON-Antwort | API-Key Pflicht (kostenfrei bis 2000 Anfragen/Monat); Klaus muss API-Key pro Endknoten verteilen |
| **Bing Web Search API** | hohe Treffer-Qualität, große Indexbasis | API-Key + Microsoft-Account, höheres Tracking-Risiko |
| **Generischer Fetch-Helper** (kein fester API-Provider) | Endknoten-Bauer entscheidet pro Knoten, was er nutzt | keine vereinheitlichte Spec, jeder Forker schreibt eigenen Helper |
| **Klaus' eigene API** (z.B. Anthropic Claude API als Such-Brücke) | volle Kontrolle, semantische Search-Quality, mit Modul 04.B-Pattern (API-Key opt-in) | Kosten pro Anfrage, Latenz, API-Key-Verteilung |

**Spec-Empfehlung (Spec-Sitzung entscheidet):** **Generischer Fetch-
Helper** mit klarer Schnittstelle. Endknoten-Bauer registriert seine
API-Wahl per `init({externalSearchAdapter: function})`. Default-
Adapter ist `null` (Web-Modus deaktiviert, bis Bauer einen Adapter
einreicht).

```js
// Spec-Skizze (Bau-Sitzung entscheidet finale Form)
window.SbkimSearch = {
  init: function (options) {
    // options.externalSearchAdapter: optional async function
    //   adapter(query: string, k: number) => Promise<Array<{
    //     title: string,
    //     snippet: string,
    //     url: string,
    //   }>>
  },
  // ...
};
```

**Vorteil:** Klaus muss keine API-Key-Spec verabschieden, jeder
Endknoten-Bauer wählt selbst (Brave / DuckDuckGo / Klaus' Anthropic-
Bridge / nichts). Spec gibt Schnittstelle vor, nicht Provider.

### Anti-Tracking-Pflicht (verbindlich, vor Spec-Sitzung)

Diese Punkte sind **Tafel-Charakter** und kommen so in die Voll-Spec:

- **Kein User-Agent-Leak** (Web-Modus-Fetch nutzt minimalen User-
  Agent oder lässt ihn unverändert — Endknoten-Adapter-Pflicht).
- **Kein Such-Verlauf-Speicher** (keine localStorage / IndexedDB-
  Persistenz der eingegebenen Such-Texte).
- **Kein User-Verhalten-Profil** (keine Telemetrie, kein Such-
  Häufigkeits-Tracking).
- **Externe-API-Key ist User-Pflicht** (analog Modul 04.B Stufe B —
  kein default-eingebauter API-Key in Modul 18 / Endknoten-PWA).
- **User-Permission pro Aufruf** **NICHT Pflicht** (zu nervig),
  ABER der Web-Symbol-Schalter ist initial OFF und muss explizit
  vom User aktiviert werden — das ist das Permission-Surrogat.

### Modul 00 Doku-Fenster-Pattern als Permission-Pfad?

**Offen für Spec-Sitzung:** soll der Web-Modus beim allerersten
Aktivieren ein Doku-Fenster-Modal anzeigen mit Hinweis-Text
(„Externe Such-API wird kontaktiert. Klaus' Empfangsmodus-Klausel
gilt für das Mycel — der Web-Modus ist Pilz-Schicht-Akquise und
braucht eine bewusste User-Aktivierung.")? Modul 00 hat das 5-
Klick-Geste-Pattern und einen Modal-Mount-Pfad — eine ähnliche
Erst-Aktivierung-Klärung wäre denkbar. Spec-Sitzung entscheidet.

---

## Schnittstelle / API (Spec-Skizze)

**Option A — vereinheitlichende Funktion (Endknoten-Pflicht ist
schlank):**

```js
window.SbkimSearch = {
  init: function (options) { /* Promise<void>, idempotent */ },
  // Eine Funktion für alle aktiven Modi, Endknoten entscheidet
  // welche Modi aktiv sind (siehe options.activeModes).
  search: async function (text, options) {
    // Liefert { mode, localResults, mycelResults, externResults }
    // Treffer-Form siehe § Treffer-UI.
  },
  setActiveModes: function (modes) { /* localStorage-Persistenz */ },
  getActiveModes: function () { /* read-Anker */ },
  _meta: { /* ... */ },
};
```

**Option B — drei separate Funktionen (Endknoten orchestriert):**

```js
window.SbkimSearch = {
  queryLocal:   async function (text, k) { /* wraps Modul 04.C */ },
  queryMycel:   async function (text, k) { /* wraps Modul 15 Sub b sender */ },
  queryExtern:  async function (text, k) { /* wraps Hub-fetch + adapter */ },
  // ...
};
```

**Spec-Empfehlung:** **Option A** für die Such-API + UI-Logik (eine
Funktion, Endknoten ruft sie auf), aber intern delegiert sie an die
drei Modi. Endknoten-Bauer-Aufwand bleibt eine Zeile:
`const r = await SbkimSearch.search(text);` statt drei Promise.all
zu orchestrieren.

**Ortung des Codes:** offen für Spec-Sitzung — **eigenes Modul
`src/modules/20_search.js`** ODER **Erweiterung von Modul 04** (`04.D`-
Erweiterung im selben File). Argumente:

- **Eigenes Modul 20** — saubere Trennung, eigene Tests, eigener
  Score-Ring-CSS-Block. Endknoten-Forker können das Modul allein
  weglassen, wenn sie kein Multisuchfeld wollen.
- **04.D-Erweiterung** — Such-Logik bleibt in Modul 04, das schon
  die Match-Logik kapselt. Modul-Anzahl bleibt klein.

**Spec-Empfehlung:** **eigenes Modul 20** (saubere Trennung, weil
das Modul UI-nahe ist und Modul 04 reine Vektor-Mathe ist).

---

## Tabus (verbindlich, kommen in die Voll-Spec)

- **KEIN Auto-Polling** (kein Daemon-Hintergrund-Such-Worker; jede
  Such-Anfrage ist eine User-Geste).
- **KEIN User-Verhalten-Profil** (kein localStorage-Such-Verlauf,
  kein Klick-Tracking).
- **KEIN Such-Verlauf-Persistenz** ohne explizite User-Zustimmung.
- **KEINE Externe-API-Key-Default-Hardcoding** (Modul-04.B-Stufe-B-
  Pattern: Endknoten-Bauer registriert den Adapter, Modul bringt
  keinen mit).
- **KEINE Wikipedia/Search-Engine-Beziehung als „Default"** — wenn
  Spec-Sitzung Brave / DuckDuckGo / Anthropic auflistet, sind das
  Optionen für den Bauer-Adapter, nicht Modul-eingebaute Default-
  Verbindungen.
- **KEIN User-Agent-Leak** (Web-Modus-Fetch nutzt minimalen User-
  Agent — Endknoten-Adapter-Pflicht).
- **KEIN Modul-15-Eingriff** (Sub (b) ist gebaut und stabil; die
  Sender-Seite lebt im Endknoten-Code via Such-Helper aus Karte 18).
- **KEIN Modul-04-Code-Eingriff** für die Such-Multi-Logik (Modul
  04 bleibt reine Match-/Embedding-Schicht; Modul 20 ruft Modul 04
  als Konsument auf).
- **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump**
  (Multisuchfeld ist UI-Schicht, nicht protokoll-aktiv).
- **KEIN Endknoten-Eingriff in dieser Spec-Sitzung** (Bau-Briefe für
  MR + MM kommen NACH der Spec-Sitzung, eigene Folge-Sitzungen).

---

## Was die Spec-Sitzung zu entscheiden hat

1. **Modul-Ortung:** eigenes Modul 20 oder 04.D-Erweiterung.
2. **`SbkimSearch.search()`-Signatur:** finale Form
   (Option A vs. B, Default-Werte, Error-Klassen).
3. **Externe Such-API-Adapter-Schnittstelle:** finale Adapter-
   Schnittstelle + Beispiel-Adapter-Implementierungen für Brave +
   DuckDuckGo + Anthropic-Bridge (oder bewusst leer lassen — nur
   Schnittstelle, keine Beispiele).
4. **`queryLocal({withDimensions:true})`-Erweiterung:** soll Modul
   04.C den `matchDimensions`-Block opt-in mitliefern? Wenn ja, ist
   das eine Bau-Sitzung 04.D vor Bau-Sitzung Modul 20.
5. **Score-Ring + Drei-Layer-Bar-Render:** CSS-Anker für die
   Pepo-Demo-Optik — eigene CSS-Variablen oder geteilt mit Modul 17
   Widget?
6. **Lokal-Sprung-Schwelle:** 0.95 (Spec-Vorschlag) oder anders?
7. **Default-Active-Modes:** Lokal + Mycel (Spec-Vorschlag) oder
   nur Lokal?
8. **Sage-Page-Such-Feld:** soll Modul 20 auch in der Sage-Page
   eingebaut werden? Klaus' Vision sagt: die Sage-Page hat aktuell
   kein Such-Feld in der Navleiste (Karte 16 § Sub (a) hat das
   bestätigt). Spec-Empfehlung: ja, als Andock-Hilfe für Forker
   („Welche Endknoten gibt es im Mycel?" via Web-Modus Pfad 3b).
9. **Eingrenzung Modul 00 Doku-Fenster-Permission-Modal:** ja /
   nein für Web-Modus-Erst-Aktivierung.
10. **Tabu „kein Such-Verlauf-Speicher" — Ausnahme für `<input>`-
    `autocomplete="off"`?** Bau-Sitzung entscheidet, Spec gibt
    die Richtung vor.

---

## Folge-Briefe (nach Spec-Sitzung)

- **`BRIEF_BAU_MULTISUCHFELD_MODUL_20.md`** — Bau-Sitzung des
  Such-Multi-Moduls (oder 04.D-Erweiterung). Inkl. Panel 20 in
  `tests/manual_check.html` + Headless-Smoke.
- **`BRIEF_BAU_ENDKNOTEN_MULTISUCHFELD_MR.md`** — Mein-Rezeptbuch-
  Erweiterung des bestehenden Suchfelds um Drei-Symbol-Schalter +
  Web-Modus-Adapter (Endknoten-Bauer-Entscheidung welche API).
  **Setzt voraus**, dass der MR-Dual-Modus-Brief (lokal + Mycel)
  zuvor umgesetzt ist — siehe `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md`.
- **`BRIEF_BAU_ENDKNOTEN_MULTISUCHFELD_MM.md`** — analog Mein-
  Mixarium.
- **Optional: `BRIEF_PFLEGE_04D_QUERY_LOCAL_DIMENSIONS.md`** — wenn
  Spec-Sitzung entscheidet, dass `queryLocal({withDimensions:true})`
  Pflicht ist. Modul 04.C-Erweiterung.

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Spec-Sitzung Multisuchfeld — finalisiere die Voll-
Spec für ein Drei-Modi-Such-Modul (Lokal · Mycel · Extern) mit
Symbol-Schalter-UI im Endknoten-Suchfeld. Reine Doku/Spec-Arbeit,
KEIN Modul-Code in src/.

Branch: claude/spec-suchfeld-multi (vom main aus anlegen).

PFLICHT-VERIFIKATIONS-SCHRITT (vor allem anderen):

1. git fetch origin && git checkout main && git pull origin main —
   sicherstellen dass main aktuell ist.
2. CLAUDE.md komplett (vor allem § Vier-Schichten-Lesart 2026-05-27
   + § Pipeline-Reihenfolge mit Phase A 5k/5l NEU + Phase D).
3. docs/PULS.md § Schnellüberblick + JÜNGSTE Sitzungs-Einträge.
4. status.json modules + toolPwaBacklog.
5. docs/sessions/BRIEF_SPEC_SUCHFELD_MULTI.md (dieser Brief — Voll-
   Skelett der Voll-Spec, mit Klaus' Festlegungen 2026-05-28).
6. docs/components/18_tool_pwa.md § Such-Feld-Integration-Pattern
   (Karte 18 hat die Dual-Modus-Pattern-Vorlage — Stichwort vs.
   Semantik, BroadcastChannel-Sender-Helper, Edge-Cases).
7. docs/components/16_siegel.md § Sub (e) — Bronze-Hinweis-Block +
   Andock-Knopf + fail-soft-Check (verlinkt zu Modul 18 Sub a).
8. docs/components/04_match.md § Sub (a) + (c) — matchDimensions +
   queryLocal-API.
9. docs/components/15_membran.md § Sub (b) — postMessage-Envelope
   mit op-Werten sporeRef/query/hint/queryResult.
10. docs/sessions/BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md + _MM.md —
    bestehende Endknoten-Suchfeld-Bau-Briefe (decken Lokal + Mycel,
    Multisuchfeld erweitert um Web-Modus).
11. docs/components/_mycel_hub.md — externer Mycel-Hub-Konzept
    (Web-Modus Pfad 3a fetcht den Hub-status.json).

Deine Aufgabe:

A. **Modul-Ortung entscheiden** — eigenes Modul 20 (src/modules/
   20_search.js) oder Erweiterung Modul 04 (04.D). Spec-Empfehlung:
   eigenes Modul 20.

B. **Voll-Spec Karte 20 anlegen** in docs/components/20_search.md
   (oder 04.md erweitern, je nach A.). Alle Sektionen aus diesem
   Brief ausarbeiten + offene Punkte 1–10 entscheiden.

C. **INTERFACES.md ergänzen** um Modul-20-Block (oder 04.D-Block).

D. **status.json ergänzen** um neuen modules-Eintrag (id:"20",
   score:"schablone"). NICHT versions-bumpen (Multisuchfeld ist
   UI-Schicht).

E. **CLAUDE.md ergänzen** — § Module-Tabelle um Modul 20 Eintrag
   (oder Modul 04.D-Vermerk), § Pipeline 5k/5l in dieser Spec-Sitzung
   bestätigen.

F. **Brief-Codeblock-Block für Folge-Briefe** anlegen — Brief Bau-
   Sitzung Modul 20 + zwei Endknoten-Multisuchfeld-Briefe
   (MR + MM) als Stubs. Klaus' Konvention 2026-05-21: alle Briefe
   wortwörtlich-Codeblock am Sitzungsende ausgeben.

Was du NICHT tust:

- KEIN Modul-Code in src/.
- KEIN Endknoten-Eingriff.
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEINE Tafel-Umsortierung CLAUDE.md ohne Klaus' explizite
  Bestätigung (Tafel-Evolutions-Klausel).
- KEINE Wikipedia-/Brave-/DuckDuckGo-API als Default-Provider
  einbauen (Endknoten-Bauer wählt eigenen Adapter, Spec gibt nur
  Schnittstelle vor).
- KEINE Such-Verlauf-Persistenz (Anti-Tracking-Pflicht).

Sitzungs-Ende-Pflicht (CLAUDE.md § Pflicht am Sitzungsende):

- PULS-Eintrag mit Datum + getan + offen + nächster Schritt
- Übergabeprotokoll docs/sessions/archiv/YYYY-MM-DD_spec-suchfeld-
  multi.md
- Commit + Push + Draft-PR
- "Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort
- Brief-Codeblöcke für die Folge-Sitzungen (Bau Modul 20 + zwei
  Endknoten-Briefe) wortwörtlich in der Chat-Antwort ausgeben.

Klaus' Festlegungen 2026-05-28 (NICHT umsortieren, nur ausarbeiten):

- UI-Modus-Wechsel: Drei Symbol-Schalter UNTER der Texteingabe IM
  Suchfeld (keine Höhen-Erweiterung), Symbol + Tooltip, Klick wechselt
  von Grau zur Aktiv-Farbe. Multi-Aktiv erlaubt, letzter Schalter nicht
  deaktivierbar. Default: Lokal + Mycel aktiv, Web NICHT aktiv.
- Lokal-Treffer: direkter Sprung zum Anchor wenn nur Lokal aktiv UND
  Score ≥ 0.95 (Bau-Sitzung entscheidet finale Schwelle). Sonst Liste.
- Mycel-Treffer: Score-Ring (Pepo-Demo-Pattern) + Drei-Layer-Bars für
  matchDimensions (fachlich/technisch/skalierung) + Gesamt-Score.
- Web-Modus: mischt Externen-Hub + Sage-Page-status.json + externe
  Web-API. Adapter-Schnittstelle für Endknoten-Bauer (Brave / DDG /
  Anthropic / Klaus' eigene API — Bauer-Wahl).
- Tabu: kein Auto-Polling, kein User-Verhalten-Profil, kein Such-
  Verlauf-Speicher, kein User-Agent-Leak, kein Default-API-Key.

Klaus' Arbeitsumgebung-Konvention (seit 2026-05-27): Klaus gibt am
Sitzungs-Beginn Uhrzeit an für Zeit-Abschätzung.
```

---

## Querverweise

- **Karte 04 Match** (`docs/components/04_match.md`) — Sub (a)
  `matchDimensions` liefert die Drei-Layer-Anzeige; Sub (c)
  `queryLocal` ist das Lokal-Backend.
- **Karte 15 Membran** (`docs/components/15_membran.md`) — Sub (b)
  `op:"query"`-Empfänger ist gebaut, Sender-Helper-Pattern in
  Karte 18.
- **Karte 16 Siegel** (`docs/components/16_siegel.md`) — Sub (e)
  Bronze/Gold-Stufe lebt unabhängig vom Multisuchfeld, aber Klaus'
  Web-Modus-Aktivierung könnte später einen Aspekt im Siegel-Modal
  ergänzen („Web-Modus aktiviert seit YYYY-MM-DD").
- **Karte 18 Tool-PWA** (`docs/components/18_tool_pwa.md`) —
  § Such-Feld-Integration-Pattern hat die Dual-Modus-Vorlage
  (Stichwort vs. Semantik) + Edge-Cases. Multisuchfeld erweitert
  das Pattern um den Web-Modus.
- **Karte 17 Floating-Widget** (`docs/components/17_floating_widget.md`)
  — der Such-Modul-Code lebt **außerhalb** des Widgets (im
  Endknoten-Domain-UI), aber CSS-Variablen können geteilt werden.
- **Karte `_mycel_hub.md`** (`docs/components/_mycel_hub.md`) —
  Externer Mycel-Hub bei `lausiklauskn-png/SB-KIMTool-Point`,
  Web-Modus Pfad 3a fetcht den `status.json` des Hubs.
- **Brief Sub-a-Vorab** (`docs/sessions/BRIEF_SPEC_18_SUB_A_VORAB.md`)
  — parallele Spec-Sitzung für `SbkimToolPwa.openAndockTab` (Modul 16
  Sub (e) Bronze-Hinweis-Andock-Knopf wartet fail-soft auf dieses).
- **Pepo Demo Pattern-Referenz** (extern,
  `https://github.com/lausiklauskn-png/semantic-match-demo`) — Score-
  Ring + Drei-Dimensionen-Anzeige als UI-Vorbild.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Brief angelegt | 2026-05-28 | Plansitzung Multisuchfeld-Brief | Klaus' Vision-Klärung 2026-05-28 zur Multi-Modus-Suche festgehalten. Brief skizziert UI-Festlegungen (Symbol-Schalter unter Texteingabe, Drei-Layer-Mycel-Treffer, Lokal-Sprung, Web-Modus mit Hub + API), Empfangsmodus-Lösung über Vier-Schichten-Lesart (Pilz-Schicht-Akquise statt Mycel-Akquise), Tafel-Tabus, offene Spec-Punkte 1–10. KEIN Modul-Code, KEIN Endknoten-Eingriff. |
| Spec-Sitzung Multisuchfeld | — | Spec-Sitzung | folgt — entscheidet Modul-Ortung (20 vs. 04.D), Voll-Spec, Karte 20 anlegen, INTERFACES.md ergänzen, status.json um Modul-20-Eintrag erweitern, CLAUDE.md Pipeline 5k/5l aktualisieren. |
| Bau-Sitzung Modul 20 | — | Bau-Sitzung | folgt — `src/modules/20_search.js` + CSS-Block (Score-Ring + Drei-Layer-Bars) + Panel 20 in `tests/manual_check.html` + Headless-Smoke. |
| Endknoten-Erweiterung MR | — | Bau-Sitzung MR (extern) | folgt — Suchfeld in `Mein-Rezeptbuch` um Drei-Symbol-Schalter + Web-Adapter erweitern. Setzt MR-Dual-Modus-Bau voraus. |
| Endknoten-Erweiterung MM | — | Bau-Sitzung MM (extern) | folgt — analog MR. |
