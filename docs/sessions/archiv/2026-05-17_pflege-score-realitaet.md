# Mini-Pflege 2026-05-17 — Score-Realität anheben, Demo-Ring inverten

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase. Branch
`claude/pflege-score-realitaet`. Folge-Pflege zur Live-Andock-Sitzung
Cross-Knoten-Handshake (PR #65) und Sage-Page Live-Status (PR #66).

**Anlass:** Klaus' Beobachtung zur Sage-Page: „Demo-Anteil 33 % zeigt
zu wenig Realität an. 09 Einbau-PWA ist nachweislich an zwei
Endknoten vollzogen, 03 Embedding und 05 Anastomose haben im
Cross-Knoten-Handshake live gewirkt." Plus Wunsch zur Ring-
Visualisierung: grüner schimmernder Bogen wächst, bunter Bogen
schrumpft.

**Klaus' Bild für die Score-Hochstufung:**

> „Wenn künstliche Befruchtung die Fortpflanzung einer Art bewiesen
> hat, ist die Methode bewiesen — auch wenn nicht jedes Detail des
> Embryos perfekt ist."

Übersetzt: Live-Beweis 2026-05-16 reicht für `score: "fertig"` bei
03, 05, 09. SW-Bridge-Phantom-Cache ist ein nebensächlicher Fehler
im Empfänger-Pfad, kein Hauptbeweis-Bruch.

---

## Auftrag

A) **`pingStatus`-Bonus aktivieren** in `index.html` `computeScore()`:
   integrierte Endknoten mit `live`/`live-direct` zählen 15 statt 8
   (= im `scoreModel` schon vorgesehene `endknotenIntegratedAndPing`).

B) **Module-Hochstufung in `status.json`:**
   - 03 Embedding: `stub` → `fertig`
   - 05 Anastomose: `stub` → `fertig`
   - 09 Einbau-PWA: `spec` → `fertig`

C) **Ring inversion:** grüner Bogen wächst auf `realPct`, bunter
   schrumpft auf `demoPct`; zusammen voller Kreis.

D) **PULS-Pie** über `update_puls_pie.py` aktualisieren.

---

## Was getan

### 1. `status.json` Score-Anhebungen

**03 Embedding** (`stub` → `fertig`):
- siegel: „Live im Cross-Knoten-Handshake 2026-05-16"
- kurz: ergänzt um Live-Beweis-Satz (Domain-Vektor beider Endknoten
  erzeugt, Match-Score ≥ 0.80 ermöglicht)

**05 Anastomose** (`stub` → `fertig`):
- siegel: „Cross-Knoten-Handshake live 2026-05-16"
- kurz: ergänzt um `outcome:"established"` zwischen Mein-Mixarium
  und Mein-Rezeptbuch, plus SW-Bridge-Phantom-Cache-Workaround als
  offene Folge-Pflege

**09 Einbau-PWA** (`spec` → `fertig`):
- siegel: „Live bei zwei Endknoten 2026-05-16"
- kurz: ergänzt um Andock-Beleg an Mein-Mixarium + Mein-Rezeptbuch

**`lastUpdated`** auf `2026-05-17`.

### 2. `scripts/update_puls_pie.py`

Aufgerufen, PULS § Modulstand-Pie-Block automatisch nachgezogen.

**Neue Verteilung (14 Module gesamt):**
- 🟫 Schablone: **4** (Backlog 10/11/12 + 14, unverändert)
- 🟧 In Werkstatt: 0
- 🟨 Spec fertig: 0
- 🟦 Code-Stub: **7** (00, 01, 02, 04, 06, 07, 08)
- 🟩 Fertig: **3** (03, 05, 09)

Vorher: 0 Werkstatt, 1 Spec, 9 Stub, 0 Fertig — also drei Stufen
hochgestuft.

### 3. `index.html` `computeScore()` erweitert

**Vorher:**
```js
(s.endknoten || []).forEach(e => { real += e.integrated ? 8 : 0; });
```

**Nachher:**
```js
(s.endknoten || []).forEach(e => {
  if (!e.integrated) return;
  const live = e.pingStatus === 'live' || e.pingStatus === 'live-direct';
  real += live ? 15 : 8;
});
```

Zusätzlich: `demo`-Wert wird jetzt aus `realPct` invers berechnet,
`animateRing` bekommt **zwei** Parameter (`realPct`, `demoPct`).

**Score-Rechnung heute:**
- realScore = Hub(10) + Module(7 × 7 + 3 × 10 = 79) + Endknoten(2 × 15 = 30) = **119**
- maxScore = 10 + 10 × 10 + 2 × 15 = **140**
- realPct = round(100 × 119 / 140) = **85 %**
- demoPct = **15 %** (matched Klaus' Prognose)

### 4. Ring-Inversion: zwei Bögen

**SVG erweitert:** neuer Bogen `#demo-ring-real` mit grünem Gradient
und SVG-Glow-Filter `<filter id="ring-real-glow">` (Gaussian Blur
stdDeviation 2.4).

**CSS:**
```css
.ring-fg-real {
  stroke: url(#ring-real-grad);
  stroke-dasharray: 0 565.48;
  animation: ring-real-shimmer 3.6s ease-in-out infinite;
}
.ring-fg {
  stroke: url(#ring-grad);
  stroke-dasharray: 0 565.48;
}
@keyframes ring-real-shimmer { 0%, 100% { opacity: 0.78; } 50% { opacity: 1; } }
```

**JS `animateRing(realPct, demoPct)`:**
```js
const realLen = C * realPct / 100;
const demoLen = C * demoPct / 100;
ringReal.style.strokeDasharray = realLen + ' ' + (C - realLen);
ringReal.style.strokeDashoffset = '0';
ringDemo.style.strokeDasharray = demoLen + ' ' + (C - demoLen);
ringDemo.style.strokeDashoffset = (-realLen).toString();
```

Der bunte Bogen wird via negativem `strokeDashoffset` hinter den
grünen Bogen rotiert — beide ergeben den vollen Kreis. Schimmer-
Animation gibt dem grünen Bogen subtilen Lebens-Eindruck.

**Visuell heute:** ~85 % grüner schimmernder Bogen, ~15 % bunter
Rest, Demo-Zahl „15 %" in der Mitte.

---

## Bewusst nicht angefasst

- **Modul 06 Heterokaryose** bleibt `stub` — nur rasch grob
  durchgeklickt, kein Live-Beweis.
- **Modul 00/01/02/04/07/08** bleiben `stub`.
- **`scoreModel`-Formel** im JSON unverändert (`100 * (1 - realScore /
  maxScore)`); die UI-Logik bleibt formel-konform.
- **INTERFACES.md** unverändert — Score-Bewertung ist Sage-Page-UI-
  Frage, kein Modul-Vertrag.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.
- **Modul-Code** in `src/modules/*` unverändert.
- **Endknoten-Repos** unverändert (kein Score-Konzept dort).
- **`docs/sage_page_pflege.md`** unverändert — neue IDs (`demo-ring-real`,
  `ring-real-grad`, `ring-real-glow`) sind reine UI-Hilfsanker, kein
  status.json-Renderer-Vertrag.

---

## Validierung

- **`status.json` valid JSON** (`python3 -c "import json; json.load(...)"`).
- **`scripts/update_puls_pie.py`** erfolgreich (7 Stub, 3 Fertig).
- **HTML-Parse** via Python `html.parser`: OK.
- **Inline-JS** via `node --check` auf Zeile 980–1906: OK.
- **Manuelle Score-Berechnung** in Python: realScore=119, max=140,
  realPct=85, demoPct=15 → matched Klaus' Prognose.
- **Cross-Reading:** Topologie-Knoten 03/05/09 bekommen Grün-Farbe
  aus `--status-fertig: #16A34A` (war schon im CSS); Modul-Liste-
  Badges ebenso; Phase-Pill-Modul-Badges (Phase 0/1/2 → 02/03/05)
  zeigen Phase 1 + 2 jetzt grün (03 und 05 fertig), Phase 0 (02)
  bleibt blau (Spore-Modul noch stub).

---

## Was offen blieb

- **Klaus' Browser-Sichttest** dieser Pflege — Demo-Ring zwei Bögen
  (~85 % grün schimmernd, ~15 % bunt), Topologie drei Grün-Knoten
  (03/05/09), Phase-Pills 03 + 05 jetzt grün.
- **Tablet-Neustart-Sichttest** für SW-Bridge-Phantom-Cache
  unverändert offen.
- **Spec-Sitzung Modul 15 Sichtbarkeits-Lampen + Events-Strom** —
  jetzt mit konkretem Verkehrs-Konzept (Cross-Knoten-Handshake
  als Live-Datenquelle) sinnvoll.
- **`domainKeywords`-Hartkodierung** in Endknoten unverändert.
- **Modul 06 voller Test-1–9-Lauf** wartet auf Klaus' Tablet-Sitzung
  (würde 06 dann auf `fertig` bringen → Demo-Anteil ~13 %).

---

## Nächster sinnvoller Schritt

1. **Klaus' Browser-Sichttest** dieser Pflege.
2. **Tablet-Neustart-Sichttest** für SW-Bridge-Phantom-Cache.
3. **Spec-Sitzung Modul 15 Sichtbarkeits-Lampen + Events-Strom**.

---

**Branch:** `claude/pflege-score-realitaet`.
**Vorgänger:** Live-Andock Cross-Knoten-Handshake (PR #65), Sage-Page
Live-Status (PR #66), Rechtschreibung „Protokoll" (PR #67).
**Klaus' Analogie:** „künstliche Befruchtung beweist die Methode,
auch wenn der Embryo nicht perfekt ist" — Live-Beweis reicht für
`fertig`, Detail-Bugs sind eigene Folge-Pflegen.
