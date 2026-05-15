# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Sage-Page Modul 14

**Sitzungs-Rolle:** Pflege-Sitzung (eine Sitzung, ein klar abgegrenzter
Scope). Schließt die offene Querschnitts-Frage „Sage-Page sichtbar
machen für Modul 14" aus der Hauptsitzung 14-Diffusion-Stub (gleicher
Tag). Reine Sage-Page-Render-Erweiterung in `index.html`. **Keine
§1-Vertragsänderung**, **keine `status.json`-Änderung**, **keine
Code-Änderung an Modulen 00/01/02/03/04/05/07**, **kein JS-Code in
`src/`**, **keine Karten-Änderung 10/11/12/14**, **kein
`update_puls_pie.py`-Aufruf**.

**Branch:** `claude/sage-page-diffusion-backlog-Poh4p`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und
an die Pflege-Sitzungen vom 2026-05-15 (insbesondere
`2026-05-15_pflege-09-app-sw-koexistenz.md` als Stil-Vorbild — reine
Pflege ohne Modul-Eingriff, additive Erweiterung).
**Modul:** keine (Sage-Page `index.html` ist Observatorium, kein
Endknoten-JS-Modul).

---

## Auftrag

Eine Phase, klarer Scope:

`diffusionBacklog[]` in `index.html` sichtbar machen, parallel zur
existierenden `schutzBacklog[]`-Darstellung. Modul 14 (Diffusion) ist
seit PR #29 (Hauptsitzung 14-Diffusion-Stub, gleicher Tag) als
`status.json.diffusionBacklog[0]` definiert, aber die Sage-Page hat
das Feld bisher nicht gerendert — der PULS-Pie zeigt seit dem
`update_puls_pie.py`-Lauf in PR #29 schon „14 Module · Schablone 5",
aber `index.html` zählte weiter 13 Zellen. Diese Pflege schließt
die Sicht-Diskrepanz.

---

## Was getan wurde

### 1. Variante-Entscheidung: kombiniert (c) erweitert + (a) sekundär

Der Brief empfahl Variante (a) (Sub-Sektion in Karte 13 Eigenschutz),
ließ aber die Entscheidung pragmatisch an die Sitzung anhand der
echten Sage-Page-Struktur. Die Sage-Page hat drei Stellen, an denen
Backlog-Module relevant sind:

- **Karte 4 Module-Bento** (`#module-grid`) — datengetrieben aus
  `s.modules` + `s.schutzBacklog`. Pflicht-Update, weil sonst Pie
  und Zellen-Zahl auseinanderlaufen.
- **Karte 14 Bau-Puls** (`#baupuls-grid` + `#bp-pie`) —
  datengetrieben aus `s.modules` + `s.schutzBacklog`. Pflicht-Update,
  weil sonst die Center-Zahl im Pie (`total = all.length`) bei 13
  bleibt statt auf 14 zu zeigen.
- **Karte 13 Eigenschutz** — hardgecodete HTML-Liste mit Modul
  10/11/12. Hier passt die Brief-Empfehlung (Variante a): ein
  zweiter paralleler Block für Diffusion-Backlog.

**Variante reiner (a)** wäre nicht ausreichend gewesen — sie hätte
nur Karte 13 erweitert, die zwei datengetriebenen Karten 4 und 14
hätten weiter veraltete Zählung gezeigt. **Variante reiner (b)**
(eigene Karte 15) hätte den Bento um eine Karte aufgebläht, wo der
Eintrag heute genau **ein** Modul ist (Modul 14). **Variante reiner
(c)** (nur Bau-Puls erweitern) hätte Karte 4 Module-Bento und Karte
13 Eigenschutz veraltet gelassen.

**Gewählt: kombiniert (c) erweitert + (a) sekundär.** Beide
datengetriebenen Karten (4 + 14) ziehen `diffusionBacklog[]` parallel
zu `schutzBacklog[]` nach (gleicher Render-Stil, gleicher
Divider-Pattern); Karte 13 Eigenschutz bekommt zusätzlich einen
zweiten parallelen `.schutz-backlog`-Block (gleiche CSS-Klasse,
sprachliche Trennung „reaktiv" vs. „proaktiv").

### 2. `index.html`-Render-Code-Änderungen

**`FALLBACK_STATUS`-Objekt** um `diffusionBacklog: []` ergänzt. Falls
`status.json` nicht lädt, läuft die Sage-Page weiter ohne
`undefined`-Zugriffe.

**`renderModules(s)`** bekommt einen dritten Block nach dem
bestehenden Schutz-Backlog-Block:

```js
if (s.diffusionBacklog && s.diffusionBacklog.length) {
  const div = document.createElement('div');
  div.className = 'backlog-divider';
  div.textContent = 'Diffusion-Backlog · proaktiv · spec ausstehend, Priorität niedrig';
  grid.appendChild(div);
  s.diffusionBacklog.forEach(m => grid.appendChild(buildModCard(m, true)));
}
```

Der bestehende Schutz-Backlog-Divider wurde zur sprachlichen
Parallelität auf „Schutz-Backlog · **reaktiv** · spec ausstehend,
Priorität niedrig" erweitert (das Wort „reaktiv" hinzugefügt).

**`renderBauPuls(s)`** analog:

- `allMods` (lokale Variable für `byId`-Lookup) bekommt
  `...(s.diffusionBacklog || [])` zusätzlich.
- Nach dem bestehenden Schutz-Backlog-Divider-Block wird ein
  zweiter Block für Diffusion gerendert, gleiche Pattern.
- Schutz-Backlog-Divider-Text auf „Schutz-Backlog · **reaktiv** ·
  Priorität niedrig" angehoben (sprachliche Parallelität).

**`renderBauPulsPie(s)`** `all`-Array um `diffusionBacklog`
erweitert:

```js
const all = [...(s.modules || []), ...(s.schutzBacklog || []), ...(s.diffusionBacklog || [])];
```

Pie-Center-Zahl `total = all.length` zeigt jetzt **14** (vorher 13);
Legende-Count `counts.schablone` zeigt **5** (vorher 4); andere
Score-Verteilungen unverändert. Pie-Berechnung selbst (Bogenmaß,
Donut-Loch, Text-Anchor) unangetastet.

**`BACKLOG_IDS`-Set** von `new Set(['10', '11', '12'])` auf
`new Set(['10', '11', '12', '14'])` erweitert. `isNextUp(m, byId)`
liefert für Modul 14 jetzt `false` → Modul 14 bekommt **kein**
goldenes „Bereit-Symbol ✨" (analog 10/11/12 — Backlog-Module sind
nicht „bereit zum Anpacken" im Sinne der Bau-Puls-Karte).

**`SLUG_MAP`** und **`slugForId(id)`-Map** beide um
`'14': 'diffusion'` ergänzt → Klick auf Modul 14 in der Bau-Puls-
Karte öffnet `docs/components/14_diffusion.md`. Im `openModuleDetail`-
Backlog-Pfad funktioniert das ohnehin schon, weil dieser Pfad
`m.name.toLowerCase().replace(/\W+/g, '_')` nutzt — „Diffusion" → 
„diffusion" matcht den Dateinamen direkt.

### 3. `index.html`-HTML-Änderungen

**Karte 4 Module-Bento-Titel** von

> Module · 10 Haupt + 3 Schutz-Backlog

auf

> Module · 10 Haupt + 3 Schutz + 1 Diffusion (Backlog)

angehoben (Konsistenz mit der neuen Render-Logik).

**Karte 13 Eigenschutz** bekommt einen zweiten `<div
class="schutz-backlog">`-Block direkt nach dem bestehenden, gleiche
CSS-Klasse (also gleicher visueller Stil — dasselbe `rgba(0,0,0,0.25)`-
Background, dasselbe gestrichelte Border, dieselbe `--muted`-
Schriftfarbe). Inhalt:

```html
<div class="schutz-backlog">
  <strong>Diffusion-Backlog · proaktiv (Wuchs durch Empfehlung, drehbuchkonform):</strong>
  <ul>
    <li><a href="docs/components/14_diffusion.md">Modul 14 — Diffusion</a> · konsensuell-empfehlende Spore-Diffusion über Handshake-Erweiterung (Pfad 2 verbindlich gewählt); Pfad 1 (passiv via <code>/sbkim/spore.json</code>) bleibt Default parallel, Pfad 3 (parasitär) verworfen wegen Empfangsmodus-Prinzip</li>
  </ul>
  Gegenstück zum Schutz-Backlog: Schutz wehrt ab, wenn das Netz groß
  genug ist, dass Apoptose und Match-Filter allein nicht mehr reichen;
  Diffusion beschleunigt das Wachstum durch geteilte Erinnerung an
  gemeinsame Berührungen. Wird gezogen ab Netz ≥ 10 aktive Geschwister
  ODER erstem erfolgreichen Live-Andock + spürbarem Wachstums-Bedürfnis.
</div>
```

Der bestehende Schutz-Backlog-Strong-Header von

> Offene Punkte (spec ausstehend, durch Vermächtnis-Modell teil-abgedeckt):

auf

> Schutz-Backlog · reaktiv (spec ausstehend, durch Vermächtnis-Modell teil-abgedeckt):

angehoben — sprachliche Parallelität zum neuen Diffusion-Header,
sichtbarer Strukturanker „reaktiv" vs. „proaktiv".

**`.schutz-pilz`-Schlussspruch** um eine zweite Zeile erweitert:

> Und er wächst, indem er Notizen über Nachbarn weitergibt — nicht,
> indem er ins Leere pulst.

(Das ist eine direkte Spiegelung des „Im-Mycel-Bild"-Absatzes aus
`docs/components/14_diffusion.md`, sprachlich konsistent mit dem
bestehenden Pilz-Vorbild-Wording.)

**Karte 7 Datenquelle Schema-Beispiel** zeigt jetzt zwei Zeilen für
beide Backlog-Felder parallel:

```jsonc
  "schutzBacklog": [/* Module 10-12 (reaktiv), zählen NICHT in Score */],
  "diffusionBacklog": [/* Modul 14 (proaktiv), zählt NICHT in Score */],
```

Statt der bisherigen einen Zeile. Das ist der Schema-Doku-Anker für
andere Repos, die `status.json` über `fetch` konsumieren.

### 4. Was nicht geändert wurde (bewusst)

- **Keine `status.json`-Änderung.** PR #29 (Hauptsitzung 14-Diffusion-
  Stub, gleicher Tag) hatte das `diffusionBacklog`-Feld inkl. Modul-
  14-Eintrag schon vollständig angelegt. Diese Pflege liest nur.
- **`scripts/update_puls_pie.py` NICHT aufgerufen.** Keine Modul-
  Daten-Änderung — der PULS-Mermaid-Pie ist seit PR #29 schon auf
  „14 Module · Schablone 5".
- **Keine Code-Änderung an Modulen 00/01/02/03/04/05/07.** Diese
  Pflege ist Sage-Page-Render, keine Endknoten-Modul-Pflege.
- **Kein JS-Code in `src/`.** Die Sage-Page (`index.html`) ist im
  Repo-Root, Endknoten-Module liegen in `src/modules/`. Diese Pflege
  fasst `src/` nicht an.
- **Keine `INTERFACES.md` §1-Vertragsänderung.** Modul 14 ist Stub,
  hat keine öffentliche Schnittstelle; die Sage-Page ist
  Observatorium, kein Vertrag. Nur §6 Änderungsprotokoll-Zeile
  ergänzt (Konventions-Stil, neueste unten).
- **Keine Komponenten-Karten-Änderung 10/11/12/14.** Stubs
  unangetastet — insbesondere `docs/components/14_diffusion.md` §
  Status-Zeile sagt weiter „Sage-Page → noch nicht sichtbar (Folge-
  Pflege)". Aus Scope-Disziplin (Briefing-Verbot: „Keine Änderung
  an Komponenten-Karten 10/11/12 oder 14") wird diese Zeile in der
  jetzigen Pflege **nicht** nachgezogen; eine Mini-Folge-Pflege
  „Karte 14 Status-Zeile nachziehen" oder die spätere Spec-Sitzung
  14 kann das erledigen.
- **Keine Karten-05-Eingriffe.** Die `recommendedPeers`-Handshake-
  Erweiterung ist eine eigene spätere Spec-Sitzung — Modul 14 ist
  noch Schablone, kein Spec.
- **Keine Bento-Architektur-Umbau.** Bestehende Karten-Reihenfolge
  unverändert; keine neue Karte 15 „Diffusions-Backlog" eingefügt
  (Variante b verworfen).
- **Kein neuer visueller Stil.** Diffusion-Block in Karte 13 nutzt
  exakt die `schutz-backlog`-CSS-Klasse (gleiche Borders, gleiche
  Schriftgröße, gleiche Dim-Farbe). Karte 4 + Karte 14 nutzen die
  bestehenden `.backlog-divider` und `.bp-divider`-Klassen
  unverändert. Akzent-Farben aus den bestehenden CSS-Variablen,
  Reduce-Motion-Konvention respektiert (kein neuer Animations-Code).
- **`tests/manual_check.html` unangetastet.** Diese Pflege betrifft
  die Sage-Page (Observatorium), nicht den Modul-Test-Pfad.
- **`computeScore` und `renderBars` unverändert.** Beide operieren
  weiter ausschließlich auf `s.modules` (10 Haupt-Module) — Backlog
  zählt weiter nicht in den Reife-Prozentsatz, konsistent mit
  `scoreModel.maxScoreNote`. Würde die Pflege das anders machen,
  wäre der Sage-Page-Prozentwert in zwei Versionen sichtbar (`status.
  json`-`maxScoreNote` vs. JS-Berechnung) — bewusst vermieden.

### 5. Sichttest

**Headless durch Code-Lesen** verifiziert:

- `fetch('status.json', { cache: 'no-cache' })` lädt das aktuelle
  `status.json` (PR #29-Daten inkl. `diffusionBacklog[]`). Bei
  Fehler greift `FALLBACK_STATUS` mit `diffusionBacklog: []` → keine
  `console.error`.
- `renderModules(s)` durchläuft `s.modules` (10 Karten), dann den
  bestehenden `schutzBacklog`-Block (3 Karten), dann den neuen
  `diffusionBacklog`-Block (1 Karte für Modul 14). Jede Karte ruft
  `buildModCard(m, true)` für Backlog-Module — bestehende Funktion,
  rendert wie 10/11/12.
- `renderBauPuls(s)` analog, plus `renderBauPulsPie(s)` mit
  `total = 14`, `counts.schablone = 5`.
- `BACKLOG_IDS.has('14') === true` → `isNextUp` liefert für Modul 14
  `false` → kein `s-nextup`-CSS-Klassen-Anhang, kein goldener
  Outline.
- `SLUG_MAP['14'] === 'diffusion'` → Klick öffnet
  `docs/components/14_diffusion.md`.
- Karte 13 Eigenschutz rendert zwei parallel-stilisierte
  `schutz-backlog`-Blöcke (CSS-Klasse unverändert; gleiche Borders,
  gleiche Schriftgröße).
- Karte 7 Schema-Beispiel zeigt beide Backlog-Felder parallel.

**Browser-Sichttest** durch Klaus erfolgt beim nächsten Sage-Page-
Reload. Falls die zwei `schutz-backlog`-Blöcke in Karte 13 optisch
unbalanciert wirken, ist eine Mini-Folge-Pflege „Karte 13 visuelle
Entzerrung" denkbar — aber erst nach Sicht-Befund, nicht spekulativ.

---

## Frischer-Kopf-Befund: reines Anzeige-Diff geschlossen, additiv und sprachlich klar

Die Sage-Page-Modul-14-Diskrepanz war ein **reiner Anzeige-Effekt**:
Der PULS-Mermaid-Pie sagte seit PR #29 schon „14 Module · Schablone
5", aber die `index.html`-Bau-Puls-Karte zeigte weiter 13 Zellen mit
4 Schablonen, weil `renderBauPuls(s)` und `renderBauPulsPie(s)` das
neue Feld `diffusionBacklog[]` nicht kannten. Ein Besucher der
Sage-Page, der die PULS-Mermaid daneben gehalten hätte, wäre kurz
verwirrt gewesen („wo ist das 14.?").

Mit dieser Pflege sind alle drei Zähl-Anker wieder im Gleichschritt:

- **PULS-Mermaid-Pie** (statisch aus `status.json` via
  `update_puls_pie.py`): 14 Module · Schablone 5.
- **Sage-Page-Bau-Puls-Pie** (live aus `status.json` im Browser):
  14 Module · Schablone 5.
- **Sage-Page-Bau-Puls-Zellen** (live aus `status.json` im Browser):
  10 Haupt-Zellen + 3 Schutz-Backlog-Zellen + 1 Diffusion-Backlog-
  Zelle = 14.

Die sprachliche Trennung „reaktiv" vs. „proaktiv" zieht sich jetzt
durch alle vier Sichtbar-Stellen: Karte 4 Module-Bento (Divider-
Wording), Karte 13 Eigenschutz (zwei `schutz-backlog`-Strong-Header),
Karte 14 Bau-Puls (Divider-Wording), Karte 7 Schema-Doku
(Kommentar-Wording). Das ist konsistent mit der `status.json`-
Architektur-Entscheidung aus PR #29 (`schutzBacklog` und
`diffusionBacklog` sind bewusst getrennte Felder, nicht zusammen-
gemischt).

Die Pflege ist **additiv und rückwärtskompatibel**:

- **Fail-Soft:** `FALLBACK_STATUS` hat jetzt `diffusionBacklog: []` —
  Sage-Pages mit alter `status.json` (vor PR #29) crashen nicht,
  zeigen einfach keinen Diffusion-Divider.
- **Keine API-Änderung:** `buildModCard`, `buildBPCell`,
  `openModuleDetail`, `isNextUp`, `renderBauPulsPie`-Funktions-
  signaturen unverändert. Nur Aufrufer-Logik erweitert.
- **CSS unangetastet.** Keine neuen Klassen, keine neuen Selektoren.
  Diffusion-Block in Karte 13 nutzt `schutz-backlog`-Klasse direkt.
- **Bento-Anzahl der Karten unverändert.** 14 Karten + Pulse-Footer
  bleiben (kein Variante-b-Aufblähen). Variante (b) wäre die
  einzige gewesen, die die Bento-Architektur angefasst hätte — sie
  wurde verworfen.

---

## Was offen blieb

- **Karte 14 § Status-Zeile** sagt noch „Sage-Page → noch nicht
  sichtbar (Folge-Pflege)". Diese Zeile darf jetzt auf
  „Sage-Page → sichtbar in Karten 4/13/14 (Pflege 2026-05-15)"
  angehoben werden. Aus Scope-Disziplin lässt diese Pflege die
  Karte 14 unangetastet (Briefing-Verbot: „Keine Änderung an
  Komponenten-Karten 10/11/12 oder 14"). Eine **Mini-Folge-Pflege
  „Karte 14 Status-Zeile nachziehen"** kann das in zwei Zeilen
  erledigen; alternativ macht es die spätere Spec-Sitzung 14 mit.
- **Sichttest Sage-Page in Klaus' Browser.** Diese Pflege ist
  headless gelaufen; Code-Lesen verifiziert das Render-Verhalten.
  Die visuelle Balance der drei Karten (Karte 4 mit drei Divider-
  Blöcken nacheinander, Karte 13 mit zwei `schutz-backlog`-Blöcken
  + Schlussspruch, Karte 14 Bau-Puls mit zwei Divider-Blöcken
  unter den Hauptzellen) wartet auf Klaus' nächsten Sage-Page-
  Reload. Falls die Karte 13 optisch zu „schwer" wirkt, ist eine
  **Mini-Folge-Pflege „Karte 13 visuelle Entzerrung"** denkbar —
  aber spekulativ, deshalb hier nicht vorbereitet.
- **PULS-400-Zeilen-Konvention** weiter offen. PULS.md überschreitet
  die 400-Zeilen-Konvention seit längerem deutlich (vor dieser
  Pflege ca. 3170 Zeilen, nach dieser Pflege mehr). Eine separate
  Pflege **„PULS archivieren"** bleibt fällig — sie wird in
  früheren Pflege-Sitzungen schon mehrfach erwähnt.
- **Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-
  Andock-Versuch** bleibt der empfohlene Haupt-Pfad (Karte 09 ist
  jetzt vollständig: neun Schritte + Pre-Flight + 3a/3b,
  `sbkim-sw.js` hat den `SBKIM_SW_STANDALONE`-Schalter, Klaus'
  Endknoten haben App-SWs → Variante 3b). **Nicht headless** —
  Klaus klickt am Browser, kopiert Konsolen-Ausgaben in den Chat,
  die Sitzung wertet aus.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-
   Andock-Versuch** zwischen Rezeptbuch und Mixarium. Erstmals
   beide Andock-Varianten im Browser durchspielen; Variante 3b mit
   Pre-Flight-Check und `importScripts`-Konvention. **Nicht
   headless** — sobald Klaus Zeit am Tablet hat.
2. **Spec-Sitzung Modul 06 Heterokaryose** (Schablone, Lead-Pool-
   Konsument von Modul 14). *Headless möglich.* Sinnvoll, wenn
   Klaus Live-Andock-Zeit knapp ist.
3. **Mini-Folge-Pflege „Karte 14 Status-Zeile nachziehen"** —
   zwei Zeilen, *headless möglich*, niedrige Dringlichkeit.
4. **Pflege „PULS archivieren"** — niedrige Dringlichkeit,
   *headless möglich*, aber überfällig.
5. Bei Sage-Page-Sichtprüfung-Befund (Klaus' Browser): optional
   **Mini-Pflege „Karte 13 visuelle Entzerrung"** falls die zwei
   parallelen Backlog-Blöcke optisch unbalanciert wirken.

---

## Checkliste (Pflicht am Sitzungs-Ende)

- [x] **`index.html` `renderModules(s)`** um `diffusionBacklog`-
      Pfad parallel zu `schutzBacklog` erweitert; Schutz-Divider
      sprachlich auf „reaktiv" gehoben (Parallelität)
- [x] **`index.html` `renderBauPuls(s)`** analog erweitert
      (`allMods`, Divider, Zellen-Render); Pie zählt jetzt 14
- [x] **`index.html` `renderBauPulsPie(s)`** `all`-Array um
      `diffusionBacklog` erweitert (Center-Zahl + Legende-Counts)
- [x] **`BACKLOG_IDS`-Set** um `'14'` erweitert (Modul 14 bekommt
      kein „Bereit-Symbol ✨")
- [x] **`SLUG_MAP` + `slugForId(id)`** um `'14': 'diffusion'`
      ergänzt (Klick öffnet `docs/components/14_diffusion.md`)
- [x] **`FALLBACK_STATUS`** um `diffusionBacklog: []` ergänzt
      (Fail-Soft bei `status.json`-Lade-Fehler)
- [x] **Karte 4 Module-Bento-Titel** auf „Module · 10 Haupt + 3
      Schutz + 1 Diffusion (Backlog)" gehoben
- [x] **Karte 13 Eigenschutz** um zweiten parallelen
      `.schutz-backlog`-Block für Diffusion erweitert; Schutz-
      Header sprachlich auf „reaktiv" gehoben; `.schutz-pilz`-
      Schlussspruch um Diffusion-Zeile erweitert
- [x] **Karte 7 Schema-Beispiel** zeigt jetzt beide Backlog-
      Felder parallel als Kommentare
- [x] **Keine `status.json`-Änderung**; `update_puls_pie.py`
      NICHT aufgerufen
- [x] **Keine §1-Vertragsänderung**; INTERFACES.md §6
      Änderungsprotokoll-Zeile am unteren Ende ergänzt (neueste
      unten, Konventions-Stil)
- [x] **Keine Karten-Änderung 10/11/12/14**
- [x] **Kein JS-Code in `src/`**
- [x] **`tests/manual_check.html` unangetastet**
- [x] **PULS Sitzungs-Eintrag oben** mit Getan / Variante-
      Begründung / Was nicht geändert / Frischer-Kopf-Befund / Was
      offen blieb / Nächster Schritt
- [x] **PULS Offene Querschnitts-Frage „Sage-Page sichtbar
      machen für Modul 14"** durchgestrichen und mit Verweis auf
      diese Pflege markiert
- [x] **PULS Schnellüberblicks-Zeile Modul 14** um „plus Sage-
      Page-Sichtbarmachung 2026-05-15" erweitert
- [x] **Übergabeprotokoll** (diese Datei) in
      `docs/sessions/archiv/2026-05-15_pflege-sage-page-modul-14.md`
- [ ] **Commit + Push** auf
      `claude/sage-page-diffusion-backlog-Poh4p` (folgt)
- [ ] **Draft-PR gegen `main`** (folgt)
