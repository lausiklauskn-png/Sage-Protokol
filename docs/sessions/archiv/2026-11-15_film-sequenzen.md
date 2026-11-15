# Übergabe 2026-11-15 — Film-Sequenzen auf Startseite, Paper und Einladung

**Rolle:** Hauptsitzung · **Zweig:** `ccr-58a0ff2c-wquyk7`

## Auftrag

Klaus: die Seiten interessant, spannend und lehrreich gestalten, mit Videosequenzen. Dazu im Lauf der Sitzung:
das Observatorium ist der Punkt, aus dem Claude beim Bau von Apps Nutzen zieht; die Bauanleitungen werden
nicht korrigiert, sie dienen im Hintergrund anderen App-Bauten.

## Getan

- Fünf Clips erzeugt (Higgsfield, 210 von 300 freigegebenen Credits), auf 960×540 ohne Ton verkleinert:
  `assets/video/{observatorium,mycel,sternbild,siegel,fernrohr}.mp4` mit je einem Standbild `.webp`.
- `assets/sequenz.js`: baut aus `<figure class="sequenz">` einen Clip mit Stationen. Ohne Skript bleibt die
  Liste als Text lesbar.
- `index.html`: drei Sequenzen (Observatorium nach dem Kopf, Sternbild in Warum-Tour 01, Siegel in 04).
- `paper.html`: Fernrohr-Sequenz über dem Blatt, im Druck ausgeblendet.
- `docs/einladung/index.html`: Mycel-Film in Szene 1 über dem Standbild, ohne neuen Text (keine neuen
  Übersetzungs-Schlüssel).
- `tests/smoke_sequenz.mjs` mit Gegenprobe an einer Kopie (vier Fälle).
- „kein Cloud“ → „keine Cloud“ in der Warum-Tour.

## Nicht getan, mit Grund

- `sicherheit.html` unverändert: sie ist die Vorlage, die `tools/sicherheit-verteilen.mjs` in alle Träger kopiert.
- Kein Anleitungstext, kein Prompt, kein Modul-Code angefasst.
- `mycel.mp4` liegt zweimal im Depot (einmal für die Einladung), weil die Einladung nur aus ihrem eigenen
  Ordner lädt.

## Gemessen

Siehe PULS-Eintrag vom selben Tag. Die 6 roten Proben des Gesamtlaufs sind auf dem unveränderten Stand
ebenfalls rot (fehlende Nachbar-Klone, fehlendes Chromium am erwarteten Pfad).

## Offen

- Sichttest am Tablet (Chrome und DeX).
- Entscheidung zu Clips in `sicherheit.html`.
- `<dt>Protokoll</dt>` neben „Bewusst mit einem L“: Absicht oder Schreibfehler.
- Die Umgebung „Standard“ erlaubt seit dieser Sitzung den Host `d8j0ntlcm91z4.cloudfront.net` (Clip-Abruf).
