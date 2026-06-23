# Übergabeprotokoll — 2026-06-23 · Discovery-Seite: Hero-Animation-Feinschliff

**Rolle:** Bau-Sitzung (Freibrief). Live-Sichttest mit Klaus am Galaxy Tab S6.
**Ergebnis auf `main`** (PRs #402–#408, je squash). Klaus: „sehr gut gearbeitet, Danke."

---

## Ausgangslage

Direkt nach dem Bau der Discovery-Seite (`docs/discovery/index.html`, PR #402).
Klaus hat die Eröffnungs-Animation iterativ am Tablet geprüft; pro Befund ein
kleiner Branch → PR → squash auf `main`, dann Termux-Pull + Hard-Reload zum
Anschauen.

## Iterationen (chronologisch)

1. **#402** — Bau der Seite + 15 KI-Bilder + Galerie + erste WebGL-Eröffnung.
2. **Erd-Kugel raus** (#29d26ad, Teil von #403-Vorlauf) — der prozedurale blaue
   Planet wirkte wie ein „blauer Spiegel"-Ball; entfernt.
3. **#403** — Halo weg / Kometen vor der Erde / Schnebel wandert. Kometen mit
   Feenstaub-Schweif + Einschlag-Funken; texturierter Billboard-Planet.
4. **#404** — fließender dunkel→blau-Übergang (statt Dia-Schlag): scroll-gesteuert
   ~1.7 vh, smoothstep, Schicht-für-Schicht heller.
5. **#405** — Erde voll im Bild (Kamera weniger Abwärts-Blick) + Nebel flacher
   (104×44, nicht vertikal gestreckt) + ruhiger.
6. **#406** — dunkle Erde deckungsgleich zur blauen: `erde-dunkel.webp` **aus
   `erde-blau.webp` abgeleitet** (abgedunkelt + Glut-Ton) → exakt gleiche Größe/
   Position, perfekte Überblendung. (Grund: die ursprünglich gelieferte
   Dunkel-Erde hatte reine-schwarz-Schattenseite → Disc nicht messbar/skalierbar.)
7. **#407** — dunkle Erde heller + garantiert vorn (renderOrder Erde 5 / Nebel −10);
   Klick-Funken/Halo zurück, jetzt **am Klickpunkt** (`burstAtScreen`).
8. **#408** — Schweif/Schnebel wieder vor der Erde (dust renderOrder 8 > Erde 5).
9. **#409** — Sitzungs-Doku (PULS + dieses Protokoll + Text-Feinschliff-Brief).
10. **#410** — **Sage-Page-Einbettung**: eigene Discovery-Karte neben der
    Einladungs-Karte (`index.html`) — Galaxie-Hintergrund + Erde im Dauerwechsel
    dunkel↔blau (CSS-Crossfade) + Hero-Text + Link auf die Discovery-Seite.
11. **#411** — **Scroll-Glättung**: scroll-gesteuerte Effekte (Erde dunkel→blau,
    Schleier) über sanft nachgezogenen `smoothScroll` (Lerp 0.09/Frame) → weiche
    statt zackige Übergänge.

## Endstand der Hero-Animation

- **Render-Reihenfolge:** Nebel (−10) < Erde (5) < Schnebel/Sternenstaub (8) <
  Kometen + Funken (20, depthTest:false).
- **Erzählung:** Nebel-Hintergrund (JWST, langsam driftend) → Galaxien entzünden
  sich + funkeln (uTwinkle beim Zentrieren) → 3 Kometen mit Feenstaub-Schweif
  schlagen auf die dunkle, glutrote Früh-Erde ein → beim Hochscrollen wird
  dieselbe Erde fließend blau/bewohnlich → goldenes Mycel wächst unten.
- **Interaktion:** Klick/Tipp im Hero = Funken-/Halo-Ausbruch am Klickpunkt.
- **Assets:** `erde-dunkel.webp` (abgeleitet), `erde-blau.webp`,
  `galaxie-hintergrund.webp`. (`planet-blau.webp` entfernt.)
- **Smoke** `docs/discovery/_smoke.mjs` durchgehend **11/11 grün**.

## Offen / nächster Schritt

- **Texte** mit Klaus durchgehen (Hero-Titel, Untertitel, Galerie-Texte,
  versteckte Botschaften) — war ausdrücklich als nächstes angekündigt, Sitzung
  endete davor. Brief: `docs/sessions/BRIEF_DISCOVERY_TEXTE_FEINSCHLIFF.md`.
- ✅ **Sage-Page-Einbettung erledigt** (#410) — Discovery-Karte neben der
  Einladung.
- Optional: Storyboard-Standbilder (galaxien/elemente-erde/kosmos-mycel)
  zusätzlich in Hero/Anker einweben.

## Konventions-Notiz für Folge-Sitzungen

Klaus pullt/anschaut über **`main`** (nicht über Feature-Branches) — er hatte
Branch-Verwirrung, daher wurde die Seite früh auf `main` gemerged und seither
jede Iteration als kleiner Branch → PR → squash auf `main`. Termux-Anschau-Befehl
(wiederholbar): `git reset --hard origin/main` + `python3 -m http.server 8000` +
`termux-open-url .../docs/discovery/index.html`, dann Hard-Reload.
