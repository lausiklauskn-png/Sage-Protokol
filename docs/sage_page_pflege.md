# Sage-Page · Pflege-Konvention

**Stand:** 2026-05-16 (Pflege-Sitzung Sage-Page Redesign)
**Datei:** `index.html` (Single-File-PWA, kein Build-Step)
**Zielgruppe:** jede Folge-Sitzung, die `index.html` anfasst.

Diese Datei ist die Lebensader für die Sage-Page-Pflege. Ohne sie
ist jeder Vollumbau eine Falle. **Lies sie zuerst, bevor du etwas
in `index.html` änderst.**

---

## 1. Grundprinzip

Die Sage-Page ist die **Vermittlungsstelle** des SBKIM-Protokolls,
nicht das Produkt selbst (die echten Endknoten sind die Endknoten-
PWAs Mein-Mixarium und Mein-Rezeptbuch). Sie hat zwei Pflichten:

1. **Live-Datenquelle `status.json` lesbar machen** — sowohl für
   Menschen (Topologie, Modul-Liste, Endknoten-Tabelle) als auch
   für Maschinen (das Schema selbst wird auf dem Data-Screen
   dokumentiert).
2. **Andock-Pfad zeigen** — der Live-Generator am Ende der
   Übersichts-Seite gibt einem neuen Endknoten-Betreiber eine
   Spore-Vorlage und einen Link in den Status-PR-Editor.

Alles andere (Lebenszyklus-Animation, Warum-Storyline, Detail-Tour,
Über-Modal) ist erklärende Hülle.

---

## 2. ID-Vertrag — was darf NICHT umbenannt werden

Die folgenden HTML-IDs werden vom JavaScript-Renderer (`loadStatus()` +
Sub-Renderer in `<script>`) als Anker benutzt. Umbenennen erzwingt
**immer** die parallele JS-Anpassung — sonst läuft die Page weiter,
aber zeigt nur Fallback-/Leerstand-Daten.

### 2.1 Topbar + Footer (Metadaten aus `status.json`)

| ID                | Datenfeld                            | Schreiber          |
|-------------------|--------------------------------------|--------------------|
| `topbar-meta`     | `lastUpdated` + `protocolVersion` + `branch` | `renderTopbar()`  |
| `ft-branch`       | `branch`                             | `renderFooter()`   |
| `ft-proto`        | `protocolVersion`                    | `renderFooter()`   |
| `ft-schema`       | `schemaVersion`                      | `renderFooter()`   |
| `ft-update`       | `lastUpdated`                        | `renderFooter()`   |

### 2.2 Modul-Topologie (zentrale Visualisierung)

| ID                | Datenfeld                            | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `topology-svg`    | `modules[]` + `schutzBacklog[]` + `diffusionBacklog[]` (Position via DAG aus `abhaengig`) | `renderTopology()` |
| `topology-legend` | gleiche Felder, Aggregat-Counts pro `score` | `renderTopology()` |
| `topology-counts` | gleiche Felder, Header-Zähler (z.B. „10 Module · 4 Backlog") | `renderTopology()` |

### 2.3 Modul-Schnellübersicht (Tabelle, weiter unten)

| ID                | Datenfeld                            | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `module-list`     | `modules[]` + Backlogs (Tabellen-Zeilen) | `renderModuleList()` |

### 2.4 Endknoten-Karte

| ID                | Datenfeld                            | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `endknoten-grid`  | `endknoten[]`                        | `renderEndknoten()`  |

### 2.5 Andock-Generator (Live-Spore-Vorlage)

| ID                | Lese-Feld aus `status.json`          | Notiz               |
|-------------------|--------------------------------------|---------------------|
| `ad-repo`         | (User-Input)                         | Repo-URL            |
| `ad-domain`       | (User-Input)                         | Domain-Text         |
| `ad-type`         | (User-Input)                         | `nodeType`-Select   |
| `ad-status`       | (Status-Indikator)                   | gold-/teal-getönt   |
| `ad-spore`        | `config.EMBEDDING_MODEL` + `protocolVersion` | erzeugter Blob   |
| `ad-line`         | (abgeleitet aus `ad-spore`)          | PR-Edit-Zeile       |
| `ad-pr-link`      | -                                    | URL zu `status.json` Edit-Form |
| `ad-output`       | -                                    | Container, `.live`-Klasse setzbar |

Spore-Felder werden aus **Modul 02 § Spore-JSON** abgeleitet (siehe
INTERFACES.md §2). KEINE Spore-Felder neu erfinden — der Live-
Generator ist nur eine Vorlage für den manuellen Andock-Pfad in
Modul 09.

Pflicht-Felder im generierten Spore-Blob:
`schemaVersion`, `protocolVersion`, `id`, `domain`, `nodeType`,
`endpoint`, `embeddingModel`, `createdAt`.

Optionale Felder (wenn Live-Generator erweitert wird):
`domainKeywords`, `domainVector`, `stammCategories`,
`guestCategories`.

### 2.6 Lebenszyklus-Karte (Übersichts-Screen)

| ID                | Funktion                             | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `cycle-box`       | Phasen-Container, `data-phase` 0..3  | `tickPhase()` + Scroll-Observer |
| `.phase-pill[data-phase]` | Pill-Highlight pro Phase     | `tickPhase()` + Scroll-Observer |
| `wander-svg` / `wander-nodes` / `wander-paths` / `wander-phases` | Wanderung-Visualisierung | `buildWander()` |

Die Lebenszyklus-Karte hat zwei Trigger-Pfade:
1. **Auto-Loop** alle 3200 ms (Default — `tickPhase()` und
   `buildWander`-Phase-Loop).
2. **Scroll-Trigger** via `IntersectionObserver` — wenn die Karte
   im Viewport zentriert ist, hält der Auto-Loop an und der Leser
   kann die Phasen mit der Maus über die Phase-Pills lesen.
   (Re-Aktivierung des Auto-Loops sobald die Karte den Viewport
   verlässt.)

### 2.7 Tour-Screen (`#screen-cycle`)

| ID                | Funktion                             | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `tour-svg`        | Phasen-spezifische SVG-Choreographie | `drawTourSvg()`     |
| `tour-tab-layer1` / `tour-tab-layer2` | Schicht-Wahl     | `setTourLayer()`    |
| `tour-stage`      | Container                            | -                   |
| `tour-pause-btn`  | Play/Pause                           | `tourTogglePause()` |
| `tour-auto`       | Auto-Loop-Checkbox                   | -                   |
| `tour-phases`     | Klick-Lernpfad-Pills                 | `renderTourPhasePills()` |
| `tour-learnpath-hint` | Hint-Text                        | `renderTourPhasePills()` |
| `tour-h` / `tour-bio` / `tour-mech` / `tour-chips` / `tour-code` | Detail-Block | `renderTour()` |

### 2.8 Modul-Detail-Screen (`#screen-module`)

| ID                | Funktion                             | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `md-h`            | Modul-Header `NN — Name`             | `openModuleDetail()` |
| `md-kurz`         | Kurz-Beschreibung                    | `openModuleDetail()` |
| `md-siegel`       | `siegel`-Text                        | `openModuleDetail()` |
| `md-score`        | `score`-Wert                         | `openModuleDetail()` |
| `md-deps`         | Chip-Liste der Abhängigkeiten        | `openModuleDetail()` |
| `md-link`         | Link auf `docs/components/NN_*.md`   | `openModuleDetail()` |

### 2.9 Warum-Screen (`#screen-warum`)

| ID                | Funktion                             | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `demo-questions` / `demo-svg` / `demo-sender` / `demo-particle` / `demo-result` | Live-Demo („probier es aus") | `runDemo()` + `firePartikel()` |
| `wachstum-svg` / `wachstum-counter` | Wachstums-Animation | `startWachstum()` |

### 2.10 Über-Modal

| ID                | Funktion                             | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `ueber-modal`     | Modal-Container, `hidden`-Attribut   | `openUeberModal()` / `closeUeberModal()` |
| `ueber-title`     | Modal-Titel                          | (statisch)          |
| `ueber-close`     | Close-Button                         | -                   |

### 2.11 Sichtbarkeits-Lampen (NEU — Demo-Anker für Modul 15)

| ID                | Funktion                             | Schreiber           |
|-------------------|--------------------------------------|---------------------|
| `lamp-alive`      | „Knoten lebt" — auf Sage immer grün (Hub-Demo) | (statisch) |
| `lamp-traffic`    | „Datenverkehr" — pulst kurz bei jedem `loadStatus()`-Fetch | `loadStatus()` |

**WICHTIG:** Diese Lampen sind ein Demo-Anker, kein Modul 15. Sobald
eine Spec-Sitzung Modul 15 (Sichtbarkeits-Lampen) anlegt, ziehen die
Werte aus einer richtigen Quelle (CustomEvents in Modul 05/06) statt
aus dem statischen Sage-Demo-Verhalten.

---

## 3. Frei umbenennbare IDs / Klassen

Alles, was NICHT in Abschnitt 2 steht, ist visueller Schmuck — Karten-
Klassen (`card`, `card-h`, `bento`, `hero-mycel`, etc.), Animations-
Hilfsklassen (`pulse`, `glow`), Layout-Spans (`span-4`, `span-6`,
`span-8`, `span-12`) — und darf umbenannt werden, ohne dass die Live-
Daten brechen.

---

## 4. §0-Konstanten, die in der UI gespiegelt werden

Diese Werte stehen verbindlich in INTERFACES.md §0 und werden in der
Sage-Page **lesend** angezeigt. Bei einer Änderung dort muss der
UI-Text in `index.html` nachgezogen werden.

| Konstante                  | UI-Stelle                                |
|----------------------------|------------------------------------------|
| `PROTOCOL_VERSION`         | Topbar + Footer + Andock-Spore           |
| `EMBEDDING_DIM`            | Hero-Untertitel + Lebenszyklus-Phase 1   |
| `EMBEDDING_MODEL`          | Andock-Spore                             |
| `PROVIDER_MIN_MATCH`       | Lebenszyklus-Phase 2 + Tour-Layer1-Phase3 |
| `LOCAL_RESULT_THRESHOLD`   | (heute nicht gespiegelt — Reserve)       |
| `QUERY_TIMEOUT_MS`         | `pingEndknoten()` (intern)               |
| `DOKU_REVEAL_CLICKS`       | (Modul 00, im Doku-Fenster sichtbar — Endknoten, nicht Sage) |
| `DOKU_REVEAL_WINDOW_MS`    | (Modul 00, Endknoten)                    |
| `DOKU_QUOTA_WARN_RATIO`    | (Modul 00, Endknoten)                    |
| `DOKU_QUOTA_WARN_BYTES`    | (Modul 00, Endknoten)                    |
| `SIBLING_MAX_AGE_MS`       | Tour-Layer2-Phase5 (TTL · 30 d)          |
| `HETERO_MAX_ANCHORS`       | Tour-Layer2-Phase3 (inbox · ≤ 5 anchors) |
| `HETERO_OUTBOX_MAX_ENTRIES`| (Modul 08, Endknoten)                    |
| `BACKUP_FORMAT_VERSION`    | (Modul 02, Backup-Hinweis-Karte)         |
| `BACKUP_KDF_ITERATIONS`    | (Modul 02, Backup-Hinweis-Karte)         |
| `BACKUP_PASSWORD_MIN_LEN`  | (Modul 02, Backup-Hinweis-Karte)         |

---

## 5. Was tun, wenn `status.json` ein neues Feld bekommt

1. **Schema-Eintrag im Data-Screen** (`#screen-data`) — neue
   Zeile im Beispiel-Block, additiv, kein Eingriff in bestehende
   Zeilen.
2. **Renderer ergänzen** — entweder eine bestehende Render-Funktion
   erweitern (z.B. `renderTopology()` wenn das Feld die Topologie
   betrifft) oder eine neue Render-Funktion in `renderAll()` einhaken.
3. **ID-Vertrag in dieser Datei eintragen** — Tabelle in Abschnitt 2
   ergänzen, damit eine Folgesitzung den Vertrag findet.
4. **Fallback-Status erweitern** — `FALLBACK_STATUS` im JS muss das
   neue Feld kennen, damit die Page auch ohne `status.json` ein
   plausibles Bild zeigt.
5. **Keine §0-Änderung** ohne parallelen INTERFACES.md-§0-Eintrag —
   wenn das neue Feld eine Konstante referenziert, zuerst INTERFACES,
   dann `status.json`, dann UI.

---

## 6. Was tun, wenn ein neues Modul (NN > 14) hinzukommt

1. **`SLUG_MAP`** im JS (in der Sage-Page) um den neuen ID-→-Slug-
   Eintrag erweitern.
2. **Topologie-Layout** in `renderTopology()` — die DAG-Positions-
   Heuristik liest `abhaengig` und legt das neue Modul automatisch
   in die richtige Layer. Falls die Topologie zu dicht wird, kann
   die Layer-Verteilung in `renderTopology()` von Hand kuratiert
   werden (Position-Hint pro `id` als Override).
3. **Wenn das neue Modul in einer der zwei Tour-Schichten erscheinen
   soll** (`LAYERS.layer1.phases` / `LAYERS.layer2.phases`), die
   `modules`-Liste der relevanten Phase um das neue ID erweitern.
4. **Wenn das neue Modul Backlog ist** (10/11/12/14-Stil), in
   `status.json` unter `schutzBacklog[]` ODER `diffusionBacklog[]`
   eintragen — die Topologie und Modul-Liste rendern Backlog-Module
   automatisch separat.
5. **`BACKLOG_IDS`** im JS muss den neuen ID kennen, damit
   `isNextUp()` den nicht fälschlich als Bau-Pfad markiert.

---

## 7. Animations-Konstanten

Die folgenden Werte stehen modul-lokal in der CSS — keine §0-
Konstanten, aber konsistent in der Sage-Page:

| Token                       | Wert                       | Verwendung           |
|-----------------------------|----------------------------|----------------------|
| `--phase-cycle-ms`          | 3200 ms                    | Auto-Loop Lebenszyklus-Karte + Wander-SVG-Loop |
| `--ease-spring`             | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Hover-Spring auf Karten |
| `--ease-out-quart`          | `cubic-bezier(0.25, 1, 0.5, 1)`     | Bento-Karten-Einblendung |
| `--lamp-pulse-ms`           | 600 ms                     | Sichtbarkeits-Lampe „Verkehr" Puls bei Fetch |
| `--topology-breath-s`       | 4.6 s                      | Atmen der Mycel-Topologie (Skalierung der Knoten-Glow) |
| `--nextup-glow-s`           | 2.4 s                      | Gold-Glow der Bereit-zum-Bau-Module |

**KEIN externer Animations-Bibliotheks-CDN** (kein GSAP, Framer
Motion, Lottie, Three.js). Single-File-PWA-Philosophie: pure CSS-
Transitionen, SVG-SMIL-Animationen, JS-Mini-Helper.

---

## 8. Konsistenz mit Modul 02 (Spore-JSON) im Live-Generator

Der Live-Generator (`generateSpore()`) erzeugt eine **Vorlage** für
einen Andock-Spore — der echte Andock-Pfad liegt im Endknoten (Modul
09). Die Vorlage hält sich an INTERFACES.md §2 (Spore-JSON):

- **Pflicht-Felder:** `schemaVersion`, `protocolVersion`, `id`
  (UUID v4), `domain`, `nodeType`, `endpoint`, `embeddingModel`,
  `createdAt`.
- **Optionale Felder** (heute nicht gefüllt, Vorlage minimal):
  `domainKeywords`, `domainVector`, `stammCategories`,
  `guestCategories`.

Achtung: der Live-Generator füllt `domainVector` **nicht**, weil das
ein 384-Float-Vektor aus Modul 03 wäre und die Sage-Page Modul 03
nicht lädt. Der Endknoten-Betreiber muss `domainVector` im echten
Andock-Pfad selbst erzeugen (Modul 09 Schritt 5). Im Live-Generator
wird das Feld als Kommentar im Spore-Blob markiert.

**KEINE Spore-Felder neu erfinden** — Felder kommen aus
INTERFACES.md §2, Punkt.

---

## 9. Eigenarten der jetzigen Implementierung (Stand 2026-05-16)

- **Modul-Topologie als zentrale Visualisierung:** Pflicht-Frage 2
  Variante (a) — ersetzt die alte Dreifach-Visualisierung
  (Pie + Module-Bento + Bau-Puls-Pie). Genau eine Force-Graph-
  Karte oben, genau eine Detail-Liste unten.
- **Pie ist raus.** Wer die Modulstand-Verteilung als Pie sehen
  will: sie liegt in `docs/PULS.md` (automatisch generiert via
  `scripts/update_puls_pie.py`).
- **Drei Karten weniger gegenüber Vorgänger-Version:** die
  Eigenschutz-Karte, die Backlog-Doppelung in der Bau-Puls-Karte
  und der Anteil-Ring (Demo-Score) sind in die Topologie + Modul-
  Liste konsolidiert. Der Anteil-Ring liegt als Mini-Element in
  der Modul-Liste, nicht mehr als eigene Karte.
- **Lesematerial-Karte (NEU):** verlinkt auf
  `docs/PAPER_NUTZEN_UND_INTEGRATION.md` (Klaus' Begleit-Paper,
  PR #55) und auf `sbkim_paper.pdf` (technisches Hauptpaper).
- **Backup-Hinweis-Sub-Karte (NEU):** kleine Box „Identität
  sichern" verweist auf Modul 02 Backup-Export Stufe 2 (gemerged
  2026-05-16) — kein UI-Knopf in der Sage, weil die echte
  Funktion im Endknoten liegt.
- **Sichtbarkeits-Lampen (NEU, Demo-Anker):** zwei Lampen in der
  Topbar als Vorgriff auf Modul 15. Auf Sage selbst ist „Knoten
  lebt" statisch grün (weil Sage Hub ist, kein Endknoten); der
  „Verkehr"-Lampe pulst bei jedem `loadStatus()`-Fetch.

---

## 10. Wenn du nicht weiterkommst

Halte an. Schreibe die offene Frage in `docs/PULS.md` § Offene
Querschnitts-Fragen. Eine Folge-Sitzung mit frischem Kontext löst
sie. Die Sage-Page ist Hülle — sie blockiert keinen Modul-Bau.
