# Übergabe 2026-11-16 — „Wie zwei sich finden“ als Film, Schlüssel dreht sich

**Rolle:** Hauptsitzung · **Zweig:** `ccr-60df1e8b-fqbsl0`

## Auftrag

Startbrief nach #1174 bis #1176 (acht offene Punkte). Während der Sitzung Klaus' Sichttest und neue
Wünsche: Schlüssel soll sich drehen, Bart nicht am Griff; „Wie zwei sich finden“ als ein kurzer Film
mit den Blasen aus dem Datei-Organizer und Arthur als Erzähler; Higgsfield freigegeben.

## Getan

Siehe PULS-Eintrag vom 2026-11-16. Dateien: `docs/einladung/demo-zusammenarbeit.html`,
`docs/einladung/vendor/video/wie-zwei-sich-finden.mp4`, `…/wie-zwei-sich-finden.de.vtt`,
`docs/einladung/vendor/img/wie-zwei-sich-finden.webp`, `assets/video/truhe-schluessel.mp4`,
`docs/einladung/index.html`, `docs/einladung/_smoke.mjs`, `tests/smoke_lebendig.mjs`,
`tests/gegenprobe_lebendig.sh`, `tests/smoke_startseite_bedienung.mjs`, `docs/PFLEGE-LISTE.md`,
`docs/PULS.md`, `docs/sessions/archiv/2026-11_puls-auslagerung-35.md`.

## Wie der Film gebaut ist

- Startbild und Brücken-Bild: Higgsfield `gpt_image_2_6`, mit einem Standbild aus
  `discovery-kurzgeschichte.mp4` (Datei-Organizer) als Stil-Vorlage.
- Vier Clips: `seedance_2_5`, `omni_reference`, 720p, ohne Ton. Szene 2 und 3 beginnen auf dem letzten
  Bild der Szene davor, Szene 3 endet auf dem Brücken-Bild, Szene 4 beginnt darauf.
- Sprecher: `text2speech_v2`, Variante `elevenlabs`, Stimme „Arthur“
  (`30fc8796-ceb6-4a66-b3a7-4a145ef7f346`, preset). Die Tonspuren sind 8,7 bis 10,2 s lang; danach
  richten sich die Clip-Längen (11, 9, 10, 10 s).
- Schnitt mit ffmpeg: je Szene Ton mit 0,3 bis 0,4 s Vorlauf, Lautheit auf −16 LUFS, dann aneinander.
- Die Roh-Clips liegen in Klaus' Higgsfield-Konto, im Depot nur der fertige Film.

## Nicht getan, mit Grund

- Ambient-Ton der Einladung: Klaus nennt ihn unpassend; ob er heraus soll, ist gefragt, nicht entschieden.
- `sbkim-demo`: der Film steht dort nicht. Klaus' Bildschirmfoto zeigte die Seite der Einladung.
- Schlüssel-Szene der Einladung, Übergang Schlüssel → Tür: unverändert.
- `smoke_sicherheit_seite` im Gesamtlauf: Ursache nicht gefunden, zweite Beobachtung in der Pflege-Liste.

## Offen

- Klaus' Blick auf den Film (Ton, Tempo, Szene 2: die Lupe liegt auf der eigenen Karte der türkisen
  Blase) und auf den Schlüssel (die Spitze bleibt vor dem Schloss sichtbar).
- Forschungseintrag: Kimhub #467 (gemergt), Abschnitt 2026-11-15T23:38Z bis 2026-11-16T00:17Z. Sage #1177 gemergt.
