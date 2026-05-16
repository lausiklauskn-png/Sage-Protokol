# Mini-Pflege 2026-05-17 — Sage-Page Live-Status für Topologie + Lebenszyklus

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase (reine UI-
Pflege in `index.html`). Branch
`claude/pflege-sage-page-live-status`. Folge-Pflege zur Live-Andock-
Sitzung Cross-Knoten-Handshake (PR #65).

**Anlass:** Klaus' Beobachtung beim Browser-Sichttest 2026-05-16:

1. In der **Modul-Topologie** sind Module 00, 01, 03 mit Gold-Ring
   („bereit zum Bau") markiert, obwohl sie schon `score: "stub"`
   (Code-Stub) sind — nur Modul 09 sollte echt noch nextup sein.
2. **„Modul-Topologie sollte Live sein"** — ist sie auch (Farben
   kommen aus `status.json.modules[*].score`), aber die nextup-
   Heuristik produziert falsche Markierungen.
3. **Lebenszyklus-Animation** (Spore→Einbettung→Anastomose→Antwort)
   ist reine Demo-Choreographie ohne Bezug zum echten Modul-Status —
   Klaus' Wunsch: diese sollte den Live-Stand der korrespondierenden
   Module sichtbar machen.

---

## Auftrag

1. `isNextUp()`-Vakuum-Falle in `index.html` (Zeile 1136) fixen.
2. Lebenszyklus-Phase-Pills mit Live-Modul-Status-Badges anreichern
   (Phase 0 Spore → Modul 02, Phase 1 Einbettung → 03, Phase 2
   Anastomose → 05, Phase 3 Antwort → 04 Match).
3. Reine UI-Pflege; kein Modul-Code, kein `status.json`, kein
   INTERFACES.md.

---

## Was getan

### 1. `isNextUp()` präzisiert

**Vorher:**
```js
function isNextUp(m, byId) {
  if (m.score === 'fertig') return false;
  if (BACKLOG_IDS.has(m.id)) return false;
  const deps = m.abhaengig || [];
  return deps.every(d => (byId[d] && byId[d].score === 'fertig'));
}
```

**Problem:** `[].every(...) === true` (vakuum-truthy). Module ohne
Abhängigkeiten (Modul 00, 01, 03 haben alle `abhaengig: []`) werden
immer als nextup markiert, solange sie nicht „fertig" sind. Auch
wenn sie längst `score: "stub"` sind.

**Nachher:**
```js
function isNextUp(m, byId) {
  // nextup = bereit für den NÄCHSTEN Bau-Schritt.
  //   Schablone    → spec ausstehend     → nicht nextup (im Backlog-Filter)
  //   Werkstatt    → spec im Entwurf      → nextup (Spec-Sitzung an der Reihe)
  //   Spec fertig  → Bau ausstehend       → nextup (Bau-Sitzung an der Reihe)
  //   Code-Stub    → Sichttest/Pflege     → NICHT mehr "bereit zum Bau"
  //   Fertig       → nichts ausstehend    → nicht nextup
  if (m.score !== 'spec' && m.score !== 'werkstatt') return false;
  if (BACKLOG_IDS.has(m.id)) return false;
  const deps = m.abhaengig || [];
  return deps.every(d => (byId[d] && (byId[d].score === 'fertig' || byId[d].score === 'stub')));
}
```

**Effekt:** in Topologie + Modul-Liste ist jetzt nur noch Modul 09 mit
Gold-Ring markiert. Header-Zahl wechselt von „4 bereit zum Bau" auf
„1 bereit zum Bau".

### 2. Lebenszyklus-Phase-Pills mit Live-Modul-Status

Neue Render-Funktion `renderCyclePhases(s)` in `renderAll()`-Pipeline,
plus Mapping-Konstante:

```js
const CYCLE_PHASE_MOD = { '0': '02', '1': '03', '2': '05', '3': '04' };

function renderCyclePhases(s) {
  const modById = {};
  (s.modules || []).forEach(m => { modById[m.id] = m; });
  document.querySelectorAll('.phase-pill[data-phase]').forEach(pill => {
    const phase = pill.getAttribute('data-phase');
    const modId = CYCLE_PHASE_MOD[phase];
    const mod = modId && modById[modId];
    pill.querySelectorAll('.phase-mod-badge').forEach(b => b.remove());
    if (!mod) return;
    const badge = document.createElement('span');
    badge.className = 'phase-mod-badge';
    badge.setAttribute('data-mod-score', mod.score);
    badge.title = mod.id + ' · ' + (mod.name || '') + ' · ' + (mod.siegel || mod.score);
    badge.textContent = mod.id + ' · ' + (mod.score || '?');
    pill.appendChild(badge);
  });
}
```

CSS-Klasse `.phase-mod-badge` mit `data-mod-score`-Attribute, Status-
Punkt-Farbe aus den schon vorhandenen `--status-{schablone,werkstatt,
spec,stub,fertig}`-CSS-Custom-Properties. Re-Render entfernt zuerst
bestehende Badges → idempotent.

**Effekt:** unter jeder Phase-Pill erscheint ein Mini-Badge
`02 · stub`, `03 · stub`, `05 · stub`, `04 · stub` (mit
korrespondierender Status-Farbe). Sobald in `status.json` ein
Modul-Score sich ändert (z.B. Modul 05 auf `"fertig"` hochgestuft),
färbt sich der Badge beim nächsten Page-Load automatisch um.

### 3. Automatik für künftige Module

Sobald eine zukünftige Pflege-/Bau-Sitzung in `status.json` einen
neuen Modul-Score setzt, wird:
- Topologie-Knoten neu eingefärbt (war schon so)
- Modul-Liste-Status-Badge aktualisiert (war schon so)
- nextup-Gold-Ring korrekt gesetzt oder weggenommen (jetzt **neu**)
- Phase-Pill-Badge des korrespondierenden Moduls neu gefärbt (jetzt **neu**)

Alles ohne `index.html`-Eingriff.

---

## Bewusst nicht angefasst

- **SVG-Animations-Knoten** (Heim/Rezept/Mixar/Buch + Phase-Pulse-
  Wellen) unverändert. Die SVG-Farben (gelb/gold) bleiben symbolisch
  (Spore-Wurf, semantische Berechnung) — Phase-Modul-Bezug zeigt sich
  jetzt im Pill-Badge unter der SVG, nicht in der SVG selbst.
  Vollständige SVG-Refactoring wäre eine eigene größere Pflege.
- **Sichtbarkeits-Lampen Demo-Anker** (Topbar `lamp-alive` /
  `lamp-traffic`) unverändert — eigene Modul-15-Spec.
- **`status.json`** unverändert.
- **`docs/sage_page_pflege.md`** unverändert (kein neuer ID-Vertrag —
  `.phase-mod-badge` ist eine CSS-Hilfsklasse, nicht ein
  status.json-Renderer-Anker).
- **Modul-Code** unverändert (`src/modules/00–08`).
- **INTERFACES.md** unverändert.
- **`PROTOCOL_VERSION` bleibt `"0.1"`.**
- **`update_puls_pie.py`** NICHT aufgerufen — kein Modul-Score-Wechsel.

---

## Validierung

- **HTML-Parse via Python `html.parser`:** OK.
- **JS-Syntax via `node --check`** auf den extrahierten Inline-
  `<script>`-Block (Zeile 968–1868 in `index.html`): OK.
- **Idempotenter Re-Render:** `renderCyclePhases()` entfernt zuerst
  alle bestehenden `.phase-mod-badge`-Elemente, dann setzt neu —
  keine Duplikate bei wiederholtem `renderAll()`-Aufruf.
- **Cross-Reading:** `CYCLE_PHASE_MOD`-Mapping konsistent mit
  Phase-Pill-Texten (1 Spore → 02, 2 Einbettung → 03, 3 Anastomose
  → 05, 4 Antwort → 04 Match).
- **Browser-Sichttest** ungeprüft, weil headless gebaut — wartet auf
  Klaus' Sichttest im Browser.

---

## Was offen blieb

- **Klaus' Sichttest** im Browser dieser Pflege — sollte
  zeigen: Topologie nur noch Modul 09 mit Gold-Ring; Phase-Pills mit
  Modul-ID-Badges in Code-Stub-Blau (alle 02/03/05/04 sind `stub`).
- **Tablet-Neustart-Sichttest** für SW-Bridge-Phantom-Cache-Bug
  (aus Cross-Knoten-Handshake-Sitzung) — unverändert offen.
- **Spec-Sitzung Modul 15 Sichtbarkeits-Lampen + Events-Strom** —
  die nächste echte Live-Erweiterung. Diese Sage-Page-Pflege hat
  sichtbar gemacht, dass Topologie + Modul-Liste schon live sind;
  Modul 15 würde echten Events-Live-Strom dazubringen.
- **`domainKeywords`-Hartkodierung** in Endknoten-`sbkim-init.js`
  unverändert offen.
- **SVG-Animations-Farben aus status.json ableiten** (komplette
  Animation als Live-Daten) wäre eine eigene größere Pflege —
  niedrig priorisiert, weil die Phase-Pill-Badges schon den Live-
  Status sichtbar machen.

---

## Nächster sinnvoller Schritt

1. **Klaus' Sichttest** im Browser — Topologie + Modul-Liste +
   Lebenszyklus-Phase-Pills.
2. **Spec-Sitzung Modul 15 Sichtbarkeits-Lampen + Events-Strom**
   (~60 Min headless). Mit dem gerade-gelaufenen Cross-Knoten-
   Handshake als Anker für die zweite Lampe („Verkehr") klar.
3. **Tablet-Neustart-Sichttest** für SW-Bridge-Phantom-Cache.
4. **Optional (Niedrig)**: Sage-Page-SVG-Animation komplett live —
   die Pulse-Welle-Farben aus Modul-Status ableiten. Größere
   Pflege, nicht jetzt nötig.

---

**Branch:** `claude/pflege-sage-page-live-status`.
**Vorgänger:** Cross-Knoten-Handshake etabliert (PR #65, gemerged).
**Klaus' Wunsch „lässt sich automatisch einbauen?" — Antwort:**
ja, jetzt erledigt. Künftige Modul-Status-Updates erscheinen sofort
in Topologie + Modul-Liste + nextup-Markierung + Phase-Pill-Badges,
ohne Sage-Page-Code-Eingriff.
