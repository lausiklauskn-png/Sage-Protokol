# 2026-10-11 · Truhe: Mycel-PWAs als Raster

**Rolle:** Pflege-Sitzung · **Zweig:** `ccr-b453740c-04cy9k`

## Auftrag
Klaus: die PWA-Werkzeuge im Werkzeug-Container sind schlecht angeordnet, alle
linksbündig in einer Spalte, das nimmt viel Platz weg.

## Ursache
`renderVorteilspackPwas` gruppiert nach Thema. Jedes Thema hatte einen eigenen
Block über die volle Breite, und jedes Thema trägt genau eine Karte. Die Karte
stand links, der Rest der Zeile war leer.

## Getan
Nur CSS in `index.html`: `#vp-pwa-themes` ist jetzt selbst das Raster, die
Themen-Blöcke fließen nebeneinander. `subgrid` hält Etiketten und Karten einer
Zeile auf gleicher Höhe, mit Rückfall auf ein normales Raster.

## Geprüft
- Screenshot bei 1280 px (4 Spalten) und 390 px (1 Spalte), kein Überlaufen.
- `npm test`: 109 grün · 2 rot · 1 nicht lauffähig. Die beiden roten sind auf
  `origin/main` genauso rot, weil die Nachbar-Repos fehlen.
- `tests/manual_check.html`: ungeprüft, weil nur Darstellung geändert wurde.

## Offen
Sichttest am Galaxy Tab durch Klaus.
