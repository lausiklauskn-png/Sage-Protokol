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

## Nachtrag am selben Tag: zwei weitere Aufträge

**Mycel-Knopf in der Leiste (PR #1067).** Sage bot keinen
`data-sbkim-mycel-platz` an; der Knopf schwebte nur über der Leiste. Platz
direkt hinter Lampen und Siegel gesetzt; eine gemerkte obere Lage dockt beim
Laden an. Bauplan in `docs/INTERFACES.md` („Die Leiste nimmt den Mycel-Knopf
automatisch auf"), Wächter `smoke_bau23_mycel_platz` Fall 4b mit Gegenprobe.

**Kopfleiste am Handy (PR #1068).** Branch/Protokoll/Schema/Update oben und
unten entfernt. Unter 560 px Lampen ohne Wörter, Tipp zeigt die Bedeutung,
„Installieren" nur als ⬇. Gemessen bei 360/390/412 px: zwei Zeilen.

**Forschungseintrag:** `Kimhub/forschung/sitzungen.json` —
`2026-10-11-sage-truhe-raster-mycel-anker-kopfleiste` (Kimhub PR #360).

## Offen
- Sichttest am Tablet und Handy durch Klaus.
- Kanon-Verteilung von `23_rendezvous_ui.js`; jede App braucht ihren eigenen
  Platz in der Leiste.
- Die zwei roten Proben brauchen die Nachbar-Repos.
