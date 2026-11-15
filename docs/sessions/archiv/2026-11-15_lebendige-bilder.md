# Übergabe 2026-11-15 — Lebendige Bilder: Schwarzes Loch, Observatorium, Meilensteine, Sonne, Einladung

**Rolle:** Hauptsitzung · **Zweig:** `ccr-4030296b-rvc4hb` · **PR:** #1166

## Auftrag

Klaus: die Seiten optisch verbessern, ohne sie neu zu bauen. Im Lauf der Sitzung dazu, in dieser Reihenfolge:
das Schwarze Loch steuerbar und besser dargestellt · auf dem Tab S6 herunterrechnen oder notfalls als Video ·
Higgsfield als Videogrundlage · das Schwarze Loch in den Farben des Browsers, um den es in der Karte geht ·
der Raum hinter dem Ereignishorizont neu, als bewegte Ansicht mit Mini-Universen · die Meilenstein-Bilder
bleiben, nur Lichter und Wellen sollen leben · beim Antippen soll die Kachel größer werden, nicht kleiner ·
die Sonne als echtes Video ohne scharfen Ring, mit etwas, das sie umkreist (5 bis 8 Sekunden je Runde) ·
hinter der Sonne ein anderes Universums-Bild.

## Getan

- `assets/schwarzes-loch.js` (neu): WebGL2-Darstellung mit gekrümmten Lichtwegen. Drei Stufen: live mit
  nachgeregelter Auflösung · Film · unverändert (CSS-Fassung). Vollbild mit Reglern, Kinoflug, Farbschalter.
- `index.html`: Einbau in die Observatoriums-Karte; Observatorium mit Film und gemalten Mini-Universen;
  Meilenstein-Kacheln mit Film und Wachsen beim Öffnen; Sonne mit Film, ohne Ring, mit drei kreisenden Galaxien;
  Sonnen-Galerie mit dem Säulen-Bild als Hintergrund und gemalten Stationen.
- `docs/einladung/index.html`: Film über Tür (Szene 5b) und Lichtung (Szene 6); die Schleife aus Szene 1 gilt
  jetzt für alle drei.
- `tests/smoke_lebendig.mjs` und `tests/gegenprobe_lebendig.sh`.
- `docs/PULS.md`: Eintrag; ein Eintrag vom 2026-10-13 wortgleich nach
  `docs/sessions/archiv/2026-11_puls-auslagerung-29.md`.

## Nicht getan, mit Grund

- Discovery-Seite: nicht angefasst, die Sitzung ging in die Startseite.
- `sicherheit.html`, Modul-Code, Anleitungstexte: nicht angefasst (Klaus 2026-11-15).
- Kein Upload zu Higgsfield: der Upload-Host ist in der Umgebung gesperrt. Die Startbilder wurden stattdessen
  über ihre öffentliche Adresse im Depot eingelesen.

## Gemessen

Siehe PULS-Eintrag vom selben Tag. Am Tablet ist nichts gemessen; die Live-Rechnung lief hier nur im
Software-Renderer.

## Offen

- Sichttest am Tablet (Chrome und DeX): Bildrate des Schwarzen Lochs, Filme, Kachel, Sonne.
- Discovery-Seite.
- Die offenen Punkte der Film-Sitzung vom selben Tag (`2026-11-15_film-sequenzen.md`).
