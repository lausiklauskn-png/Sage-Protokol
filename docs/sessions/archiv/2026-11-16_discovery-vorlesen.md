# Übergabe 2026-11-16 — Discovery liest vor, Fenster gekürzt, Proben finden den Browser

**Rolle:** Hauptsitzung · **Zweig:** `ccr-659615b3-s4u859`

## Auftrag

Startbrief nach #1177 bis #1184. In der Sitzung von Klaus entschieden: Discovery-Vorlesen bestellen und
bauen (genannt: rund 17 Credits) · gekürzt wird das Fenster „Was bringt mir das?“ · Geschenkbox-Seite
mit den Filmen, dem Fernrohr-Knopf zur Discovery und dem Weg ins Sage-Protokol.

## Getan

Siehe PULS-Eintrag vom 2026-11-16 „Discovery liest vor …“. Dateien: `docs/discovery/index.html`,
`docs/discovery/audio/00.mp3` bis `15.mp3`, `docs/discovery/_smoke.mjs`, `index.html`,
`tests/smoke_bau23_mycel_platz.mjs`, `tests/smoke_bau23_uebersetzung.mjs`,
`tests/smoke_bau24r_reinigung_browser.mjs`, `tests/smoke_sbkim_demo_knoten.mjs`,
`pinnwand/_smoke_mikrofon.mjs`, `docs/PFLEGE-LISTE.md`, `docs/PULS.md`,
`docs/sessions/archiv/2026-11_puls-auslagerung-39.md`.

## Wie das Vorlesen gebaut ist

- 16 Stationen in der Reihenfolge der Seite; Station n spielt `audio/NN.mp3`. Die Texte sind die der
  Seite; Gedankenstriche wurden für den Sprecher zu Kommas, Überschriften bekamen einen Punkt.
- Tonspuren: Higgsfield `text2speech_v2`, Variante `elevenlabs`, Stimme „Arthur“ (preset). Im Depot
  als Mono-MP3 mit 48 kbit/s, Lautheit −16 LUFS. Die Originale liegen in Klaus' Higgsfield-Konto.
- Ändert sich ein Text der Seite, muss die Tonspur der Station neu gesprochen werden; eine Prüfung,
  die Text und Ton vergleicht, gibt es nicht.
- Der Knopf überspringt beim ersten Tipp die Eröffnungs-Animation. Steht die Seite schon weiter unten,
  beginnt das Vorlesen an der Station in der Fenstermitte.

## Nicht getan, mit Grund

- Erklärvideo der Tour: von der Parallel-Sitzung gebaut (#1185); der eigene Film ist verworfen.
- Tür-Film der Einladung (Klaus' Sichttest): braucht einen neuen Clip; Kosten genannt, Ja steht aus.
- „Wie zwei sich finden“ in 1080p: 57 s zu 16 Credits je Sekunde, Guthaben 84,04.
- `docs/einladung/_pdf.mjs` und `sbkim-demo/papiere/_pdf.mjs`, `docs/discovery/_vorsehung_pdf.mjs`,
  `tools/breite-messen.mjs`, `tools/widget-breite-messen.mjs`: tragen weiter einen Browser-Pfad mit
  Build-Nummer. Nicht geändert (ein Lauf der PDF-Skripte überschreibt Dateien).
- Punkte 5, 6, 8 und 9 des Startbriefs: nicht angefasst.

## Offen

- Klaus' Ohr und Blick: Vorlesen auf der Discovery-Seite am Handy, Fenster „Was bringt mir das?“.
- Tür-Film: Tür zu, Schlüssel bleibt stecken, dreht links herum, Tür geht auf.
- Lebenszyklus-Bildschirm behalten oder herausnehmen.
- Forschungseintrag in Kimhub: siehe PULS-Nachtrag.
