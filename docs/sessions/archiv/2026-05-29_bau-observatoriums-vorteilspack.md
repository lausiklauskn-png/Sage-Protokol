# Übergabeprotokoll — Bau Observatoriums-Vorteilspack (Teil 1: Werkzeug-Symbole + Bild-Spec)

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
- **Bild-Gate geprüft:** `assets/observatorium-truhe.webp` **fehlt**,
  ebenso `docs/einladung/vendor/img/observatorium-truhe.webp` und jedes
  andere `*truhe*`-Asset. → Brief § Verifikations-Schritt 4 verlangt
  hier **STOP + Nachfrage** (Bild ist Klaus' externe Lieferung).

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

### Eingriff A — Truhe-Bild (nur Spec, Bau blockiert)

- Bild **nicht** eingebunden — Bild fehlt (STOP-Gate).
- Voller Bild-Prompt + Negativ-Hinweise + Alternativ-Variationen in
  der Konzept-Karte § Truhe-Bild-Asset dokumentiert, damit nichts
  verloren geht und Klaus / der Bild-Generator den Prompt parat hat.

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

1. **Bild-Gate:** `assets/observatorium-truhe.webp` muss von Klaus
   geliefert werden, dann baut die Folge-Sitzung Eingriff A (die
   `index.html`-Truhe-Karte mit Stage + Animation + Grid + Modal +
   Clipboard). Symbol-Set ist bereit und wird vom Grid referenziert.
2. **19 statt 20 Tiles:** Modul 13 ist kein Modul (Eigenschutz-
   Sammelkarte). Brief nennt „20" als Rundung; maßgeblich sind 19.
3. **Symbol-Optik-Sichttest** durch Klaus steht aus (nicht headless
   prüfbar) — `_vorschau.html` im Browser öffnen.
4. **Vorbestand-Befund (nicht in dieser Sitzung gelöst):** `PULS.md`
   ist mit ~4156 Zeilen über der eigenen 3000-Zeilen-Schutzgrenze.
   Braucht eine eigene Archiv-Auslagerungs-Pflege (Risiko: PULS-
   Konflikte mit parallelen PRs — separat behandeln).

## Nächster sinnvoller Schritt

Klaus liefert `assets/observatorium-truhe.webp` (oder gibt Go für
Fallback-Bau ohne Bild) → Folge-Bau-Sitzung Eingriff A auf demselben
Branch. Symbol-Set + Konzept-Karte sind die Vorlage.
