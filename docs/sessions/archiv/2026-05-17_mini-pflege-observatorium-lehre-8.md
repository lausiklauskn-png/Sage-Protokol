# Mini-Pflege 2026-05-17 — Observatorium-Lehre 8 + 8. Galaxie

**Sitzungs-Rolle:** Mini-Pflege, headless. Branch
`claude/pflege-observatorium-lehre-8`. Folge zur Bau-Sitzung
Browser-Observatorium-Universum (PR #79 `d9ac013`).

---

## 1. Was geschah

Beim Sichttest des Universum-Phase-1-Builds auf Klaus' Galaxy Tab S6 +
Samsung DeX zeigte sich: der **Mauszeiger über der Universum-Fläche
lässt sich nicht ausblenden**, egal welcher Workaround. Sieben
verschiedene CSS-`cursor`-Strategien probiert (Phasen 1.2 → 1.11),
alle ignoriert. Nur `cursor: pointer` (Browser-Default für klickbare
`<button>`-Elemente) wird respektiert.

Endgültige Diagnose: **DeX-Android zeichnet einen System-Cursor-Overlay
über jeden Web-Inhalt**, der von HTML-/CSS-Eigenschaften nicht
überschrieben werden kann. Im Gegensatz zu Desktop-Chrome (Windows /
Mac / Linux), wo `cursor: none` strikt respektiert wird, akzeptiert
DeX-Chrome nur semantisch sinnvolle Interaktions-Cursor (`pointer`).

Konsequenz für SBKIM-Andocker / Programmierer: **Custom-Cursor-Designs
müssen zusätzlich zum System-Cursor gezeichnet werden, nicht als
Ersatz.** Klaus' Komet-Schweif (im Universum implementiert) ist genau
diese Strategie — eine eigene visuelle Geste, die zusätzlich zur
System-Maus über die Stage zieht.

## 2. Was eingetragen

### 2.1 `docs/OBSERVATORIUM_BROWSER.md`

Neuer Block **„Lehre 8 — DeX-Cursor-Overlay ist nicht überschreibbar"**
mit:

- Beobachtung (Datum, Hardware, Software-Stack)
- **Tabelle der sieben versuchten Workarounds** mit jeweiligem
  Ergebnis in DeX-Chrome
- Befund (semantische Cursor-Akzeptanz, System-Overlay)
- Konsequenzen (Custom-Cursor-Designs müssen Additionen sein, nicht
  Ersätze; Pointer Lock als einzige drastische Alternative)
- Workarounds (Canvas-Cursor-Effekte zusätzlich, akzeptieren,
  Lehre-8-Galaxie als visuelle Erinnerung)
- Vorteile-Vermerk (eigene Geste gewinnt trotzdem, Konsistenz-Befund
  über Plattformen)

Folgt der Pflege-Konvention dieser Datei (lebende Sammlung, neue
Lehren bekommen eigenen `## Lehre N`-Block mit Beobachtung +
Phänomenologie + Konsequenzen + Workarounds + Vorteile).

### 2.2 `index.html` — achte Galaxie im Universum

**Neue Form `galaxy-edgeon`** als taumelnde Disk-Galaxie:

```css
.galaxy-edgeon .galaxy-body {
  background: radial-gradient(ellipse 80% 60% at center, /* türkis-blaue Disk */);
  animation: galaxy-precess 15s ease-in-out infinite !important;
}
@keyframes galaxy-precess {
  0%   { transform: perspective(220px) rotateX(8deg)  rotate(0deg); }
  25%  { transform: perspective(220px) rotateX(74deg) rotate(90deg); }
  50%  { transform: perspective(220px) rotateX(8deg)  rotate(180deg); }
  75%  { transform: perspective(220px) rotateX(74deg) rotate(270deg); }
  100% { transform: perspective(220px) rotateX(8deg)  rotate(360deg); }
}
```

Die Galaxie rotiert um ihre eigene Achse UND kippt zyklisch zwischen
8° und 74° `rotateX` — sie erscheint zyklisch flacher und runder wie
eine Frisbee in Sicht-Drehung. Klaus' Bild: visuelle Erinnerung daran,
dass nicht alles, was man festhalten will, sich festhalten lässt.

**Daten-Struktur `OBSERVATORIUM_LEHREN`** um achten Eintrag erweitert:

```js
{ n: 8, name: 'DeX-Cursor-Overlay', shape: 'galaxy-edgeon', size: 'medium',
  kurz: 'DeX-Android zeichnet einen **System-Cursor-Overlay** ... |
        **Workaround:** keine technische Lösung; eigene Cursor-Effekte ...
        diese Galaxie taumelt zur Erinnerung, dass nicht alles, was man
        festhalten will, sich festhalten lässt.' }
```

Memory-Konstellation hat jetzt **acht** wandernde Galaxien statt
sieben. Hint-Bar unten zeigt nach wie vor „Sieben Galaxien · sieben
Lehren …" — könnte in einer Folge-Mini-Pflege auf „Acht …" aktualisiert
werden, ist aber kein Bruch (Hint ist beschreibend, nicht strikt).

### 2.3 `docs/PULS.md`

Neuer Top-Sitzungs-Eintrag mit kurzem Verlauf, was eingetragen wurde,
und Hinweis auf den offenen Folge-Punkt **„Storage-Persist-Schutz"**.

## 3. Was NICHT angefasst

- Modul-Code (`src/modules/*.js`).
- INTERFACES.md (Spec-Stand bleibt fest).
- `status.json` (Visionen sind keine Modul-Stände).
- Sieben bestehende Galaxien des Universums (Phase 1 aus PR #79 final).
- **IndexedDB-Persist-Schutz** (`navigator.storage.persist()` in
  `SbkimStorage.init()`) — bleibt offene Folge-Mini-Pflege „Storage-
  Persist-Schutz", weil das ein Modul-01-Eingriff ist und nicht zum
  Observatorium-Bau gehört.

`update_puls_pie.py` NICHT aufgerufen (keine Modul-Daten-Änderung).

## 4. Validierung

- `index.html` Inline-Script per `node --check` syntaktisch validiert.
- Achte Galaxie wird beim Universum-Aufruf automatisch erzeugt
  (datengetrieben aus `OBSERVATORIUM_LEHREN`-Array).
- Modal-Kurzfassung zur Galaxie 8 enthält den philosophisch-poetischen
  Schlusssatz, der Klaus' Wort „nicht alles, was man festhalten will,
  sich festhalten lässt" einrahmt.
- PULS unter 3000-Zeilen-Schutz.
- **Browser-Sichttest ausstehend** — Klaus prüft die achte Galaxie
  und ihre Taumel-Animation beim nächsten Universum-Aufruf.

## 5. Nächster sinnvoller Schritt

1. **Klaus:** Diese Mini-Pflege-PR mergen.
2. **Klaus optional:** Universum aufrufen, achte Galaxie suchen
  (taumelnde türkis-blaue Disk-Galaxie), Modal lesen.
3. **Folge-Mini-Pflege „Storage-Persist-Schutz":**
   `navigator.storage.persist()` in `SbkimStorage.init()` einbauen,
   damit künftige Andocks „persistent granted" bekommen und Chrome
   sie nicht mehr reklamiert. Adressiert Klaus' heutigen Spore-Verlust
   in DeX-Chrome (siehe Mini-Pflege Live-Channel-Handshake-Eintrag in
   PULS).
4. **Variante I-Spec-Sitzung „Sage als Hybrid-Knoten"** wartet
   weiterhin (siehe § Vision-Anker), kann jederzeit nach Klaus' Wahl
   angestoßen werden.

## 6. Konvention für die übernächste Sitzung (IMMER drinhalten)

Wenn Klaus am Sitzungsende der **Folge-Sitzung** `Befehl schreiben`
tippt, formuliert die Folge-Sitzung **vor** dem Brief:

1. **Offene PRs auflisten** in Sage-Protokol (und ggf. Endknoten).
2. **Pro PR eine Einordnung** (mergen / schließen / lassen +
   Konflikt-Risiko, typisch PULS.md / INTERFACES.md).
3. **Den Brief gegen `main`-Stand schreiben**, nicht gegen die
   eigene Branch-Erwartung. Voraussetzungen aus ungemergten PRs
   **explizit** nennen.
4. **Bei mehreren offenen PRs** Merge-Empfehlung vor dem Brief
   vorlegen; der Brief kommt erst nach Klaus' Bestätigung der
   Merge-Strategie.

Brief-Stil sachlich, ohne Imponiergehabe, mit konkreten Datei-/
Zeilen-Referenzen.

**Pflicht am ENDE des Briefs:** Vollständiger Brief NOCHMAL in einem
einzigen kopierbaren Markdown-Codeblock (Outer-Fence mit vier
Backticks, damit interne ```js-Blöcke nicht schließen). Klaus liest
den Brief am Tab und kopiert ihn in die nächste Sitzung.

---

**Vorgänger:** Bau Browser-Observatorium-Universum (PR #79,
`d9ac013`); Mini-Pflege Live-Channel-Handshake + Browser-Observatorium
(PR #77, `7c08b88`); Bau BroadcastChannel-Bridge (PR #75, `b8c8f41`).

**Branch:** `claude/pflege-observatorium-lehre-8`.
