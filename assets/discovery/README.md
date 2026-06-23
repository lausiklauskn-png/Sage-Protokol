# assets/discovery/ — Bildmaterial der Discovery-Expedition

Hier liegen die **KI-generierten** Pilz-Bilder für die Discovery-Expeditions-Seite
(`docs/discovery/index.html`) und die Vision-Karte
(`docs/components/_discovery_expedition.md`).

## Erwartete Dateien

Die Galerie lädt automatisch `assets/discovery/<name>.webp`. Solange eine Datei
fehlt, zeigt die Seite eine **museale Platzhalter-Kachel** (kein Bruchbild) mit
dem Pilz-Namen und dem Hinweis „KI-Bild folgt". Sobald die Datei mit dem
richtigen Namen abgelegt ist, erscheint das Bild ohne weitere Code-Änderung.

| Dateiname | Motiv (Prompt-Nr. in der Vision-Karte) |
|---|---|
| `mykorrhiza.webp`     | 1 · Mykorrhiza-Netz / Wood Wide Web |
| `physarum.webp`       | 2 · Schleimpilz / Netz-Optimierung |
| `radiotroph.webp`     | 3 · Radiotropher Pilz (Tschernobyl) |
| `weissfaeule.webp`    | 4 · Weißfäule / Lignin-Abbau |
| `plastik.webp`        | 5 · Plastik-Fresser (Mykoremediation) |
| `flechte.webp`        | 6 · Flechte / Extremophil |
| `armillaria.webp`     | 7 · Größtes Lebewesen (Armillaria) |
| `biolumineszenz.webp` | 8 · Biolumineszenz / Foxfire |
| `ophiocordyceps.webp` | 9 · Ophiocordyceps (mit Bedacht) |
| `mitbauer.webp`       | 10 · Mit-Bauer der Zivilisation |
| `hyphendruck.webp`    | 11 · Hyphen-Druck |
| `schlussbild.webp`    | 15 · Schluss-Bild „gelebtes Leben" (Herz-Bild) |

Optional, für die Eröffnungs-Animation (aktuell prozedural per WebGL gelöst,
Bilder nicht nötig, aber als Standbilder willkommen):
`galaxien.webp` · `elemente-erde.webp` · `kosmos-mycel.webp`.

## Konventionen

- **Format:** `.webp`, lange Kante möglichst ≤ ~1600 px, Ziel-Dateigröße je
  Bild deutlich unter den ~2 MB der `assets/meilenstein-*.png` — das Repo soll
  nicht aufblähen. (Pillow-Beispiel: `pip3 install pillow`, dann verkleinern +
  `.save(..., 'webp', quality=82)`.)
- **Kennzeichnung:** Alle Bilder sind als **„KI-generiert"** zu behandeln; die
  Seite zeigt das als Bildunterschrift.
- **Keine PII** in Dateinamen oder Bildinhalten.

> Stand 2026-06-23: Verzeichnis angelegt, Seite + Galerie gebaut; die echten
> KI-Bilder von Klaus werden in einer Folge-Iteration abgelegt (einfach die
> Dateien mit den obigen Namen hier hineinlegen).
