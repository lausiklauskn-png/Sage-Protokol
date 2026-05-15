# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Sage-Page Lebenszyklus mehrschichtig

**Sitzungs-Rolle:** Pflege-Sitzung Sage-Page, headless, EINE Phase.
Datei-Scope: ausschließlich `index.html` (Detail-Tour
`#screen-cycle`) plus `docs/PULS.md`-Sitzungs-Eintrag und dieses
Übergabeprotokoll. **Keine** Änderung an `src/modules/*`,
`tests/manual_check.html`, `docs/INTERFACES.md`, `status.json`,
anderen Komponenten-Karten, Pie.

**Branch:** `claude/sage-page-lifecycle-multilayer-IstaL`

**Anlass:** Klaus' Screenshots vom 2026-05-15 ~21:11 (Galaxy Tab S6
+ DeX, Chrome) auf `lausiklauskn-png.github.io/Sage-Protokol/`. Drei
Screenshots:

1. **Phase 4 · Antwort fließt direkt zurück:** Punkt sitzt nahe
   Knoten A (links). Klar erkennbar: er ist gerade losgeflogen und
   wandert nach rechts zu Knoten B. **Gegen den Beschreibungstext**
   („Antwort fließt direkt zurück") — falsche Animations-Richtung.
2. **Phase 4 (zweiter Screenshot, ~3 Sekunden später):** Punkt
   sitzt nahe Knoten B (rechts), Knoten A pulst groß im Hintergrund
   weiter (aber Knoten A pulst die ganze Zeit, nicht erst beim
   Eintreffen).
3. **Module-Bento + Backlog-Listen:** Modul 08 noch als
   `Spec fertig` angezeigt (Cache vor Bau 08, kein
   Bug-relevanter Punkt).

Klaus' begleitende Anmerkungen aus dem Dialog 2026-05-15:
- Vier Phasen sind für einen Andock-Interessenten zu dünn. Module
  02-08 + Schutz-Backlog 10/11/12 + Diffusion 14 stehen heute in
  Karte 4 / Karte 14 nur als Liste, nicht als Wanderung.
- Animations-Idee: Tropfen mit Schweif, Funken-Blitze beim
  Informationsaustausch, einzeln anklickbar als Lernpfad.
- Page soll näher an „Prospekt, der überzeugen soll" werden.

---

## Befund vor der Pflege

Der Detail-Tour-SVG-Generator `drawTourSvg(idx)` (Stand vor dieser
Sitzung, Z. 3312–3336) rendert für **alle vier Phasen** dieselbe
SVG-Struktur:

```js
function drawTourSvg(idx) {
  const svg = document.getElementById('tour-svg');
  svg.innerHTML = '';
  const colors = ['#F59E0B', '#6366F1', '#8B5CF6', '#14B8A6'];
  const c = colors[idx];
  svg.innerHTML = `
    <defs>...</defs>
    <circle cx="200" cy="200" r="60" .../>
    <circle cx="600" cy="200" r="60" .../>
    <circle cx="200" cy="200" r="60" fill="none" ...>
      <animate ... r=60→180 .../>
    </circle>
    <line x1="260" y1="200" x2="540" y2="200" .../>
    <circle r="5" fill="${c}">
      <animateMotion dur="3s" repeatCount="indefinite" path="M 260,200 L 540,200"/>
    </circle>
    ...
  `;
}
```

Zwei strukturelle Probleme:

1. **Falscher Vektor in Phase 4.** `<animateMotion ... path="M
   260,200 L 540,200"/>` lässt das Element von (260,200) nach
   (540,200) wandern — also vom rechten Rand von Knoten A
   (cx=200, r=60 → Rand bei x=260) zum linken Rand von Knoten B
   (cx=600, r=60 → Rand bei x=540). Das ist A → B. Phase 4 will
   aber B → A.
2. **Keine Phasen-Unterscheidung.** Alle Phasen haben dieselbe
   Geometrie und dieselbe Animation; nur die Farbe variiert. Die
   Tour zeigt also viermal in Folge dasselbe Bild. Klaus' Wahrnehmung
   „4 Phasen sind zu dünn" hat hier eine konkrete technische Ursache.

Der Bug betrifft **nur** die Detail-Tour (`#screen-cycle`), nicht die
Karte 3 (Bento-Lebenszyklus-Loop). PR #38 hatte die Bento-Karte
sauber mit Phase 3 / Phase 4 als unterschiedliche `<g
class="phase-fx">`-Gruppen aufgebaut und dort Phase 3 mit Pfad
`M 446,72 Q 270,30 118,82` (Mixar → Heim, B → A) korrekt animiert.
Die Detail-Tour wurde damals nicht angefasst.

---

## Was getan wurde

### 1. Detail-Tour-Datenstruktur auf zwei Schichten umgebaut

**Vorher:** `const TOUR = [...]` mit vier flachen Phasen-Objekten.

**Nachher:** `const LAYERS = { layer1: {label, phases}, layer2:
{label, phases} }`:

- **`layer1` „Anfrage-Reise"** — vier Phasen, übernommen unverändert
  (Bio, Mech, Code, Module-Chips).
- **`layer2` „Knoten-Leben"** — fünf Phasen neu:
  1. **Knoten entsteht** (Module 02, 03, 01) — Ed25519-Identität
     wird generiert, `domainVector` via Embedding gebildet, Spore
     signiert.
  2. **Andocken (Anastomose)** (Module 05, 04, 02) — Handshake mit
     signiertem Token, Cosine-Match ≥ `PROVIDER_MIN_MATCH = 0.80`,
     Sibling-Eintrag in `sbkim_siblings`.
  3. **Austauschen (Heterokaryose)** (Module 06, 08) — Pull-Pattern,
     beidseitiges Opt-In, bis zu `HETERO_MAX_ANCHORS = 5` Anker je
     Antwort, Inbox `sbkim_hetero_inbox` füllt sich.
  4. **Empfehlen (Diffusion)** (Module 14, 05) — `recommendedPeers:
     SporeRef[]` (max. 2) als optionales Handshake-Antwort-Feld;
     Pfad 2 aus dem Diffusion-Backlog (Pfad 1 passiv via
     `/sbkim/spore.json` bleibt parallel).
  5. **Vergessen (Apoptose)** (Module 07, 01) —
     `SIBLING_MAX_AGE_MS = 2592000000` (30 Tage) als TTL; Self-
     Apoptose zweistufig mit 60-s-Token, signiertes Vermächtnis →
     `/sbkim/legacy`.

Beide Schichten halten dieselben Pflichtfelder (`h`, `bio`, `mech`,
`modules`, `code`), damit `renderTour()` für beide Layer mit derselben
Logik arbeitet.

### 2. Tab-Umschalter zwischen den beiden Schichten

In `#screen-cycle` zwischen `<h2>` und `tour-stage` neu:

```html
<div class="tour-tabs" role="tablist" aria-label="Lebenszyklus-Schicht wählen">
  <button class="tour-tab active" id="tour-tab-layer1" data-layer="layer1" role="tab"
          aria-selected="true" onclick="setTourLayer('layer1')">Anfrage-Reise</button>
  <button class="tour-tab" id="tour-tab-layer2" data-layer="layer2" role="tab"
          aria-selected="false" onclick="setTourLayer('layer2')">Knoten-Leben</button>
</div>
```

JS-Funktion `setTourLayer(layer)`:

- Wenn `layer === currentLayer` → no-op.
- `currentLayer = layer`, `tourIdx = 0`.
- `clickedPerLayer[layer].clear()` (Reset bei Schicht-Wechsel, wie
  Bau-Entscheidung 3 im Briefing).
- Laufende Gesamt-Sequenz wird abgebrochen (`learnSequenceTimer`
  geleert).
- Tab-Klassen und `aria-selected` aktualisiert.
- `renderTour()` rendert die erste Phase der neuen Schicht.

### 3. Klick-Lernpfad mit Phase-Pills

Nach `tour-controls` neu:

```html
<div class="tour-phases" id="tour-phases" aria-label="Klick-Lernpfad — jede Phase einzeln">
  <!-- per JS gefüllt -->
</div>
<p class="tour-learnpath-hint" id="tour-learnpath-hint">&nbsp;</p>
```

JS-Funktion `renderTourPhasePills()` (aus `renderTour()` aufgerufen):

- Pro Phase einen `<button class="tour-phase-pill">` mit Klick-
  Listener `onPhasePillClick(i)`.
- `.visited`-Klasse wenn `clickedPerLayer[currentLayer].has(i)`.
- `.active`-Klasse wenn `i === tourIdx`.
- Beschriftung: `${i+1} · ${phase.h ohne "Phase N · "}`.

JS-Funktion `onPhasePillClick(idx)`:

- Stoppt Auto-Loop (`tourTimer = null`, `tour-auto`-Checkbox auf
  `false`).
- Wenn Gesamt-Sequenz läuft: bricht sie ab und leert das Klick-Set
  (`wasInSequence`-Guard verhindert direkten Re-Trigger).
- Adde `idx` zur `clickedPerLayer[currentLayer]`-Set.
- `tourIdx = idx; renderTour();` — Phase wird einzeln gerendert.
- Wenn dieser Klick gerade die letzte fehlende Phase war
  (`before < total && size === total`): `playFullSequence()`.

JS-Funktion `playFullSequence()`:

- Startet mit Phase 0 (`tourIdx = 0; renderTour();`).
- Setzt `learnSequenceTimer = setInterval(..., 3200)` (gleicher
  Takt wie Bento-Lebenszyklus aus PR #38, „Lehr-Reihenfolge").
- Jeder Tick: `seqIdx++`, wenn `seqIdx >= phases.length` → stop,
  `clickedPerLayer.clear()`, `renderTour()`.
- Wenn der Nutzer während der Sequenz die Schicht wechselt
  (`currentLayer !== layerAtStart`), bricht der Timer sauber ab.

Hint-Zeile `#tour-learnpath-hint` zeigt:
- Wenn `clicked.size === 0`: „Lernpfad: jede Phase einzeln anklicken
  — am Ende läuft die Gesamt-Sequenz von alleine."
- Während Lernpfad-Aufbau: „Noch N Phase(n) bis zur Gesamt-Sequenz."
- Während Gesamt-Sequenz: „Gesamt-Sequenz läuft — alle Phasen einmal
  in Reihenfolge."
- Nach Sequenz-Ende: zurück zum Anfangs-Text.

### 4. Reichere Animations-Primitive

Drei wiederverwendbare JS-Helper, die SVG-Markup-Strings produzieren
(eingefügt in `drawTourSvg.innerHTML`):

**`dropletWithTrail(fromX, fromY, toX, toY, color, durSec, dropRadius, beginSec)`**

```js
function dropletWithTrail(fromX, fromY, toX, toY, color, durSec, dropRadius, beginSec) {
  const dur = durSec || 2.4;
  const begin = beginSec || 0;
  const r = dropRadius || 5;
  const len = Math.hypot(toX - fromX, toY - fromY);
  const trailLen = Math.min(70, len * 0.35);
  return `
    <path d="M ${fromX},${fromY} L ${toX},${toY}"
          stroke="${color}" stroke-width="2.2" fill="none"
          opacity="0.55" stroke-linecap="round"
          stroke-dasharray="${trailLen} ${len + trailLen}"
          stroke-dashoffset="${trailLen}">
      <animate attributeName="stroke-dashoffset"
               from="${trailLen}" to="${-len}"
               dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
    </path>
    <circle r="${r}" fill="${color}" filter="url(#tour-glow)">
      <animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite"
                     path="M ${fromX},${fromY} L ${toX},${toY}"/>
      <animate attributeName="opacity" values="0;1;1;0"
               keyTimes="0;0.08;0.92;1"
               dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
    </circle>
  `;
}
```

Idee: der `<path>` mit `stroke-dasharray="trailLen len+trailLen"`
zeichnet einen Schweif der Länge `trailLen`, der über die Gesamt-
Pfad-Länge `len` wandert (animierter `stroke-dashoffset`). Synchron
dazu wandert der `<circle>` per `<animateMotion>` denselben Pfad mit
derselben `dur` und `begin`. Effekt: ein leuchtender Tropfen mit
einem nachgezogenen Streifen.

Der Glow-Filter `tour-glow` (3px Gauss-Blur) ist in den `<defs>` des
SVG-Generators einmal definiert.

**`sparkBolt(ax, ay, bx, by, color, periodSec)`**

```js
function sparkBolt(ax, ay, bx, by, color, periodSec) {
  const per = periodSec || 2.0;
  return `
    <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"
          stroke="${color}" stroke-width="3" opacity="0" stroke-linecap="round">
      <animate attributeName="opacity"
               values="0;1;0.15;0.9;0;0" keyTimes="0;0.04;0.10;0.16;0.22;1"
               dur="${per}s" repeatCount="indefinite"/>
    </line>
    <line x1="${ax}" y1="${ay + 5}" x2="${bx}" y2="${by - 5}"
          stroke="${color}" stroke-width="1.5" opacity="0" stroke-linecap="round">
      <animate attributeName="opacity"
               values="0;0.8;0;0.55;0;0" keyTimes="0;0.06;0.12;0.19;0.26;1"
               dur="${per}s" repeatCount="indefinite"/>
    </line>
  `;
}
```

Zwei kurz aufzuckende `<line>`-Strecken (Haupt + Begleit) mit
gestaffelter `opacity`-Animation: erste Aufzuckung bei ~4 % des
Zyklus, zweite bei ~16 %; dazwischen kurze Pausen. Bewusst billig
(keine Bezier, kein WebGL, kein JS-Frame-Loop).

**`nodePulse(cx, cy, fromR, toR, color, durSec, beginSec)`**

```js
function nodePulse(cx, cy, fromR, toR, color, durSec, beginSec) {
  const dur = durSec || 1.6;
  const begin = beginSec || 0;
  return `
    <circle cx="${cx}" cy="${cy}" r="${fromR}" fill="none" stroke="${color}" stroke-opacity="0.55">
      <animate attributeName="r" from="${fromR}" to="${toR}"
               dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" from="0.55" to="0"
               dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
    </circle>
  `;
}
```

Expandierender Ring um einen Knoten, mit Opazitäts-Fade. Wird in
Phase 4 (Layer 1) zweimal verschachtelt aufgerufen (`beginSec=2.2`
und `2.3`), damit der Knoten-A-Puls genau dann zündet, wenn der
Tropfen aus Phase 4 dort ankommt.

### 5. Phasen-spezifische SVG-Inhalte pro (Layer, Phase)

**Layer 1 „Anfrage-Reise":**

- **Phase 1** Spore aussenden: Sonar-Puls (zwei verschachtelte
  `nodePulse`) an A; drei `dropletWithTrail`-Sporen in
  verschiedene Richtungen rechts/oben/unten; Knoten B als
  gestrichelter Schemen (noch unbekannt).
- **Phase 2** Anfrage einbetten: orbitierender Vektor-Ring um A
  (`<animateTransform type="rotate"`), sechs pulsierende Vektor-
  Punkte auf dem Ring; „vec[384]"-Beschriftung; B leise im
  Hintergrund.
- **Phase 3** Anastomose: wachsender Mycel-Faden A → B
  (`stroke-dashoffset`-Animation), Funken-Blitz dazwischen,
  synchrone `nodePulse` an beiden Knoten; „cos(dvA, dvB) ≥ 0.80".
- **Phase 4** (BUG-FIX): `dropletWithTrail(bx-rNode-4, by,
  ax+rNode+4, ay, ...)` — Tropfen wandert vom rechten Rand B zum
  linken Rand A (eindeutig B → A); zwei `nodePulse` an Knoten A
  mit `beginSec=2.2`/`2.3` zünden beim Eintreffen; „Mixar → Heim ·
  plus Hops-Sporen".

**Layer 2 „Knoten-Leben":**

- **Phase 1** Knoten entsteht: A materialisiert sich (Opazitäts-
  Fade 0 → 1 in 0.9 s der 3 s-Periode), Identity-Ring rotiert,
  sechs Vektor-Punkte orbitieren mit verzögertem Auftauchen;
  „ed25519 · domainVector"; B steht stumm daneben.
- **Phase 2** Andocken: zwei `sparkBolt` (versetzt), synchrone
  `nodePulse` an beiden Knoten, wachsender Mycel-Faden; „handshake
  · signiert · Match ≥ 0.80".
- **Phase 3** Austauschen: Request-Tropfen A → B (gold), 1.2 s
  versetzt Antwort-Tropfen B → A (teal/violet je nach Phasen-
  Farbe), kleiner Inbox-Stapel aus fünf rechteckigen Anker-Markern
  füllt sich am Knoten A; „pull · opt-in beidseits", „inbox · ≤ 5
  anchors".
- **Phase 4** Empfehlen: dritter, kleiner Knoten C (cx=400, cy=80,
  r=22) taucht oben mitte auf; `dropletWithTrail` B → A trägt die
  Empfehlung; gepunktete `<path>`-Bezier-Linie A → C entsteht
  zeitversetzt; „recommendedPeers".
- **Phase 5** Vergessen: Knoten B fadet auf 18 % Opazität ab,
  Mycel-Faden A ↔ B fadet mit; Sanduhr-Symbol (eigener `<g>`-
  Block mit `<path>`-Pfeil-Polygon) oben über B blinkt; rosa
  Vermächtnis-Tropfen B → A; „TTL · 30 d", „legacy · signiert".

### 6. CSS-Block für Tabs, Phase-Pills, Hint

Eingefügt nach `.tour-controls` in `<style>`. Stil analog zu
`.phase-strip`/`.phase-pill`: Pills haben dezent dunklen Hintergrund
+ Border; `.active` ist gold (gleich wie Bento-Phase-Pills);
`.visited` ist Indigo-getönt; Tabs haben Violet-Border, wenn aktiv.
`.tour-learnpath-hint` ist eine `min-height: 1.2em`-Zeile in `--muted`-
Farbe, damit das Layout nicht springt, wenn der Hint leer ist.

### 7. `renderTour`-Robustheit

`STATE.status.modules`-Lookup mit Null-Guard, damit ein vorzeitiger
Cycle-Screen-Aufruf (etwa via Bento-Card-Button vor `loadStatus()`-
Abschluss) nicht crasht. Vorher implizit (TOUR.modules-Array immer
gefüllt, fanden alle Module); jetzt explizit ein `STATE.status &&
STATE.status.modules ? ... : null` davor.

---

## Was bewusst nicht geändert wurde

- **Karte 3 (Bento-Lebenszyklus-Loop)** in der Übersicht unverändert
  — PR #38 hat sie korrekt B → A für Phase 3 angelegt. Die zweite
  Schicht und der Klick-Lernpfad gehören in die Detail-Tour, nicht
  in eine Bento-Übersichtskarte.
- **Karte 11 (Wanderung)** unverändert — PR #38 hat dort Hetero-
  karyose + Apoptose + Abwehr in einer einzigen 4-Phasen-Sequenz mit
  Legende aufgebaut. Eine zweite Schicht dort wäre redundant zur
  Detail-Tour und würde den Karten-Stil aufweichen.
- **`src/modules/*`** — alle 10 JS-Module Code-Stub unverändert.
  Sage-Page ist nicht protokoll-aktiv.
- **`status.json`** — Modul-Stand unverändert.
- **Pie-Regeneration** entfällt — kein Score-Wechsel.
- **`docs/INTERFACES.md`** — keine Schnittstellen-Änderung. Sage-Page
  ist nicht in §1 / §6.
- **Komponenten-Karten** — keine eigene Sage-Page-Karte vorhanden;
  diese Pflege berührt keine Modul-Karte.
- **`tests/manual_check.html`** — Werkstatt ist eigener Pfad.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.
- **Kein Netz-Aufruf** in `index.html` — Empfangsmodus-Prinzip.

---

## Frischer-Kopf-Befund

Klaus' Beobachtung „Punkt fliegt von A nach B trotz Text ‚Antwort
fließt zurück'" hat eine konkrete, eindeutige technische Ursache
(`<animateMotion path="M 260,200 L 540,200"/>` ist A → B, nicht
B → A). Das ist kein Wahrnehmungsfehler und kein subtiles SMIL-
Browser-Detail — der Vektor steht im Quelltext falsch.

Der zweite Befund (alle Phasen sehen gleich aus) erklärt, warum
Klaus die vier Phasen als „zu dünn" empfindet: die Detail-Tour
zeigte tatsächlich viermal dieselbe Bewegung in vier verschiedenen
Farben. Das war wahrscheinlich ein historischer Platzhalter, der
nie ausgebaut wurde — der Auto-Loop sorgte mit dem 6-Sekunden-Takt
für Fortschritt im Begleittext, aber das SVG selbst hatte nichts zu
zeigen.

Die Schicht-2 + Klick-Lernpfad-Erweiterung hat den Code-Pfad
`drawTourSvg` ohnehin angefasst — Phase-4-Fix und Schicht-2-Bau
fügen sich darin natürlich zusammen.

---

## Was offen blieb

- **Klaus' Sichttest Sage-Page Lebenszyklus mehrschichtig** im
  Tablet-Browser ausstehend.
- **Eigene Sage-Page-Karte in `docs/components/`** — heute gibt es
  keine; die Sage-Page sammelt nur Modul-Verweise. Wenn die Page
  weiter wächst (PR #33 Diffusion-Sichtbarmachung, PR #37 Bento-
  Wrap, PR #38 Lebenszyklus-Phasen, jetzt Schicht-2 + Lernpfad),
  wird eine eigene Karte sinnvoll — als Pflege-Sitzung „Sage-Page-
  Karte anlegen" zu einem späteren Zeitpunkt.
- **Animations-Sync-Qualität:** wie schon in PR #38 dokumentiert,
  laufen die SMIL-Animationen kontinuierlich im eigenen Loop und
  sind beim Phase-Wechsel nicht zwingend im Frame 0. Da `drawTourSvg`
  bei jedem Phasen-Wechsel das gesamte SVG neu rendert
  (`svg.innerHTML = ...`), startet die Animation der neu gerenderten
  Phase tatsächlich bei Frame 0 (anders als bei der `.phase-fx`-
  Opacity-Toggle-Lösung der Bento-Karte). Sync sollte hier also
  besser sein — Klaus' Sichttest bestätigt.

---

## Nächster sinnvoller Schritt

Mehrere gleichberechtigt (aus dem zweiten Brief der Pflege-Sitzung):

1. **Klaus' Sichttest Sage-Page** im Tablet-Browser (nicht headless)
   — Phase-4-Richtung + Schicht-Tabs + Klick-Lernpfad bis zur
   Gesamt-Sequenz + Tropfen-Schweif + Funken-Blitz.
2. **Klaus' Sichttest Panel 08** im Browser (offen seit Bau 08).
   *Nicht headless.*
3. **Bau-Sitzung Modul 09 zweite Iteration** mit Klaus am Live-
   Andock-Versuch. *Nicht headless.* Wartet auf Pflege Karte 09.
4. **Mini-Pflege Panel 07 Test 6** (`allEmpty`-Check um
   `sbkim_hetero_inbox` erweitern). *Headless möglich.*
5. **Pflege-Sitzung „PULS-Archivierung"** — überfällig. *Headless
   möglich.*
6. **Pflege-Sitzung Karte 09 „App-SW-Koexistenz + Tablet-
   Sichtkontrolle"** — Voraussetzung für Bau-Sitzung 09 zweite
   Iteration. *Headless möglich.*

---

## Pflicht-Häkchen am Sitzungsende

- [x] Neuer Sitzungs-Branch `claude/sage-page-lifecycle-multilayer-IstaL`
      (vorhanden, kein Branch-Wechsel nötig)
- [x] `index.html` Detail-Tour Tab-Umschalter + Phase-Pills + Hint
- [x] `index.html` CSS-Block `.tour-tabs` / `.tour-tab` /
      `.tour-phases` / `.tour-phase-pill` / `.tour-learnpath-hint`
- [x] `index.html` LAYERS-Datenstruktur mit `layer1` (4 Phasen) +
      `layer2` (5 Phasen)
- [x] `index.html` Klick-Lernpfad-State (`currentLayer`, `tourIdx`,
      `clickedPerLayer`, `learnSequenceTimer`) + Funktionen
      (`setTourLayer`, `onPhasePillClick`, `playFullSequence`,
      `renderTourPhasePills`)
- [x] `index.html` SVG-Primitive `dropletWithTrail`, `sparkBolt`,
      `nodePulse`
- [x] `index.html` `drawTourSvg(layer, idx)` mit phasenspezifischen
      Inhalten (4 + 5 = 9 verschiedene SVG-Vorlagen)
- [x] **Phase-4-Vektor-Umkehr** (Layer 1 Phase 4 nutzt
      `dropletWithTrail(bx-rNode-4, by, ax+rNode+4, ay, ...)` — B → A)
- [x] **Knoten-A-Puls beim Eintreffen** in Phase 4 (zwei
      verschachtelte `nodePulse` mit `beginSec=2.2`/`2.3`)
- [x] HTML-Tag-Bilanz geprüft (section 22/22, main 5/5, svg 14/14,
      g 18/18, script 1/1, style 1/1, div 178/178, button 29/29)
- [x] Inline-`<script>`-Block via `node --check` syntaktisch
      validiert (1470 Zeilen, grün)
- [x] **Keine `src/modules/*`-Änderung**
- [x] **Keine `tests/manual_check.html`-Änderung**
- [x] **Keine `docs/INTERFACES.md`-Änderung**
- [x] **Keine `status.json`-Änderung**, **kein Pie-Regenerate**
- [x] **Keine Modul-Karten-Änderung** (keine eigene Sage-Page-Karte
      vorhanden — Anlegen als offene Frage notiert)
- [x] PULS Sitzungs-Eintrag oben (Anlass / Befund / Getan / Was
      bewusst nicht / Frischer-Kopf / Offen / Nächster Schritt)
- [x] Übergabeprotokoll (diese Datei)
- [ ] Commit + Push auf `claude/sage-page-lifecycle-multilayer-IstaL`
      (folgt)
- [ ] Draft-PR gegen `main` (folgt)
