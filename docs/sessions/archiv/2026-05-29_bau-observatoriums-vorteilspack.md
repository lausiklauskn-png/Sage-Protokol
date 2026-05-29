# Übergabeprotokoll — Bau Observatoriums-Vorteilspack-Truhe (vollständig)

**Datum:** 2026-05-29
**Sitzungs-Rolle:** Bau-Sitzung Observatoriums-Vorteilspack-Truhe
(Vision-Anker Schicht 4 — Werkzeugkiste).
**Branch:** `claude/bau-observatoriums-vorteilspack`
**Grundlage:** `docs/sessions/BRIEF_BAU_OBSERVATORIUMS_VORTEILSPACK.md`
+ Klaus' Vision-Erweiterung 2026-05-29 (zwei additive Punkte).

---

## Ausgangslage

Klaus hat den Bau der Observatoriums-Vorteilspack-Truhe beauftragt und
zwei neue Punkte zur Plansitzung 2026-05-28 ergänzt:

1. **Truhe-Bild als gerendertes Asset** statt CSS-Holz-Optik
   (`assets/observatorium-truhe.webp`, `<picture>`/`<img>` + CSS-
   Deckel-Overlay für die Klick-Animation).
2. **Werkzeug-Symbol pro Modul** — gegenständliche, selbst-gezeichnete
   SVGs statt 📦-Platzhalter, monochrom in Tier-Farbe.

## Pflicht-Verifikation (durchgeführt)

- `git fetch origin` ✅
- Branch `claude/bau-observatoriums-vorteilspack` frisch von
  `origin/main` ✅
- **Bild-Gate geprüft:** Bild fehlte zunächst → STOP + Nachfrage
  (Brief § Verifikations-Schritt 4). Klaus hat das Bild daraufhin
  geliefert (1401×1123, ≈5:4) → eingebunden als
  `assets/observatorium-truhe.png`. Gate erfüllt, Bau fortgesetzt.

## Was gebaut wurde (image-unabhängig, ohne Bild-Gate)

### Eingriff B — Werkzeug-Symbole (vollständig)

- **19 SVGs** in `assets/tool-symbols/NN_modul.svg`:
  00 Lupe-auf-Buch · 01 Bronze-Kapsel+Kristall · 02 Samenkapsel+Stempel
  · 03 Sextant+Vektorpfeil · 04 Apotheker-Waage · 05 verflochtene
  Hyphen+Knoten · 06 Doppelschlüssel · 07 Sanduhr+Blätter · 08
  Marionettenkreuz · 09 Mycel-Schraubenschlüssel · 10 Verdienst-Orden+
  Sternenkrone · 11 Wasserschleuse · 12 Eisen-Riegel+Vorhängeschloss ·
  14 Sonar-Wellen · 15 Wappenschild+Geflecht · 16 Lack-Siegel+Petschaft
  · 17 Kristallkugel · 18 Multitool · 19 Zauberstab+Kompass.
- **Stil exakt nach Brief:** stroke-width 1.5, gerundete Kanten, keine
  Füllflächen, monochrom `stroke="currentColor"` (Tile setzt Tier-
  Farbe per CSS). Keine externe Icon-Library — alles selbst gezeichnet.
- Alle 19 **XML-wohlgeformt** (geprüft mit `xml.dom.minidom`).
- **Vorschau-Kontaktbogen** `assets/tool-symbols/_vorschau.html`:
  zeigt alle 19 in Tier-Färbung (Gold/Türkis/Violet), gruppiert nach
  Tier, mit Modul-Name + Bedeutungs-Anker. Klaus' Optik-Sichttest-
  Artefakt (im Browser öffnen).

### Eingriff A — Truhe-Karte in `index.html` (vollständig)

- **Neue Sage-Page-Karte** `#observatorium-vorteilspack` nach der
  Browser-Observatorium-Karte (beide Schicht 4 — thematisch benachbart;
  Bau-Sitzung-Entscheidung statt „zwischen 13/14", da diese Karten in
  der realen Seite anders heißen).
- **Truhe-Stage:** `<picture>` (webp-bevorzugt, png-Fallback) +
  `.vp-lid-overlay` (Dim-Veil) + `.vp-glow` + `.vp-key-pulse`. Klick
  (oder Enter/Space) öffnet → Tool-Grid fadet/expandiert.
- **Tafel-Evolution:** geliefertes Bild zeigt die Truhe bereits offen
  → literaler Deckel-Klapp (`rotateX`) ersetzt durch Veil-der-sich-hebt
  + Goldlicht-Glow. Dokumentiert in Konzept-Karte § Festlegung 6.
- **Tool-Grid:** 19 Tiles, sortiert nach Tier (Must-have→Basic→Pro)
  dann Modul-Nr; je Tile Symbol-SVG (Tier-getönt) + Tier-Badge + Name
  + Ein-Zeilen-Task + Status-Marker (🟩/🟦/🟫). Tier-Filter-Pillen.
- **Tool-Modal:** neun Sektionen pro Werkzeug (Header, Was, Wie,
  Einbau, Vibe-Coding-Prompt, Kopieren [Code + Vibe], Test-Modul,
  Querverweise). ESC/Backdrop/X schließen.
- **Clipboard:** Modul-Code per Lazy-`fetch()` (Hybrid, Brief § 6 C) +
  Vibe-Prompt; Fallback `execCommand("copy")` für unsichere Kontexte;
  Toast-Bestätigung.
- **JS-Modul** `docs/observatorium/vorteilspack.js` (node-testbar
  exportiert, DOM-Wiring document-guarded), eingebunden via
  `<script src>` vor `</body>`. CSS inline in `index.html`.
- Bild als `assets/observatorium-truhe.png` (kein webp-Werkzeug im
  Container). Voller Bild-Prompt + Negativ-Hinweise + Alternativ-
  Variationen in der Konzept-Karte § Truhe-Bild-Asset gesichert.

### Tests

- `node --check docs/observatorium/vorteilspack.js` grün.
- `node tests/smoke_observatorium_truhe.mjs` → **19/19 grün**
  (19 Tools, Tier 3/7/9, 19 Symbole, alle Code-/Karten-/Smoke-Pfade
  existieren, Bild liegt vor, Vibe-Prompt-Aufbau).
- Klaus' Browser-Sichttest (Animation + Optik) **steht aus**.

### Doku

- `docs/components/_observatoriums_vorteilspack.md`: neue §§
  Klaus-Festlegungen 2026-05-29, Werkzeug-Symbol-Liste (Tabelle),
  Truhe-Bild-Asset; Sub-(a)/(b)-Entscheidungen markiert; Bauzustand-
  Tabelle ergänzt.
- `CLAUDE.md` Vision-Anker-Vorbereitung-Block: Bauzustand-Notiz
  2026-05-29 (keine Tafel-Umsortierung).
- `docs/PULS.md`: Sitzungs-Eintrag oben.

## Tabus eingehalten

KEIN `src/modules/`-Eingriff · KEIN Version-Bump · KEIN
`ZERTIFIKAT_ASPEKTE`-Eintrag · KEIN Endknoten-Eingriff · KEIN
Modul-19-Bau · KEINE Tafel-Umsortierung · KEIN `docs/einladung/`-
Eingriff · KEINE externe Icon-Library.

## Offene Punkte / Befunde

1. **Klaus' Browser-Sichttest** der Truhe-Karte steht aus (Animation +
   Optik nicht headless prüfbar). Sichttest-Pfad: Hard-Reload Sage-Page
   → bis Observatorium-Karte scrollen → Truhe + Schlüssel sichtbar →
   Schlüssel/Truhe klicken → Tool-Grid mit 19 Tiles + Symbolen → Tile-
   Klick → Modal mit neun Sektionen + Copy-Knopf.
2. **`manual_check.html`-Panel bewusst NICHT ergänzt:** die Truhe ist
   eine Sage-Page-Render-Feature (kein Modul mit Test-Bridge). Sichttest
   läuft direkt auf der Sage-Page; das headless-Smoke deckt die
   Tool-Datenbank ab. (Abweichung vom Brief § Bauer-Schritt 5,
   begründet.)
3. **19 statt „20" Tiles:** Modul 13 ist kein Modul (Eigenschutz-
   Sammelkarte). Brief nennt „20" als Rundung; maßgeblich sind 19.
4. **webp:** kein Konvertier-Werkzeug im Bau-Container → Bild liegt als
   `.png`; das `<picture>` bevorzugt eine künftige `.webp`. Optionale
   Folge-Pflege: webp erzeugen (kleiner).
5. **Init-Globals im Vibe-Prompt generisch** (`Sbkim<Modul>.init`) statt
   pro Modul exakt — bewusst, um keine falschen API-Namen zu behaupten;
   der Prompt verweist auf Karte + INTERFACES für die Pflichtfelder.
6. **Vorbestand-Befund:** `PULS.md` ist über der 3000-Zeilen-
   Schutzgrenze. Eigene Archiv-Auslagerungs-Pflege nötig (separat,
   Konflikt-Risiko mit parallelen PRs).

## Nächster sinnvoller Schritt

Klaus' Hard-Reload-Sichttest der Truhe-Karte auf der Sage-Page. Bei
Symbol-/Optik-/Text-Korrekturwünschen ein Nachzug-Pflege-PR. Danach
optional: webp-Konvertierung, und (eigene Sitzung) Modul-19-Bau, der
das Platzhalter-Tile in der Truhe mit echtem Code füllt.
