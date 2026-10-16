# Übergabe 2026-10-16 · Überblick „Mit dem Mycel verbinden“ und Siegel

**Rolle:** Hauptsitzung · **Auftrag:** `docs/sessions/BRIEF_2026-10-17_ueberblick_mycel_siegel.md`
**Arm:** voll (CLAUDE.md, Regeln, Skills `menschlich-schreiben`, Pflichtleseliste)

## Klaus' Entscheidungen

| Frage | Antwort |
|---|---|
| `sicherheit.html` erweitern oder neue Seite? | **erweitern** |
| Deutsch allein oder DE+EN? | **Deutsch und Englisch** |
| mitten in der Sitzung | neue Schutzschichten hinein · **Wort-Links mit Rückweg** · **warum Schutz nötig ist**, aus den Papers |

## Was getan wurde

- `sicherheit.html` (Sage-Wurzel) als Überblick in Stichworten, 14 Abschnitte, zwei Sprachblöcke,
  Wort-Sprünge mit „↩ zurück“. Knopf- und Lampennamen aus Modul 16, 16b, 17, 23-UI, 23b gelesen.
- `tests/smoke_sicherheit_seite.mjs` (28) + Gegenprobe (23/23); `--traeger` für Kopien.
- `tools/sicherheit-verteilen.mjs` + `tools/lib/cache-bump.mjs` (Kopie aus dem Kanon-Verteiler,
  Pflege-Liste § 36); `tests/smoke_sicherheit_verteilen.mjs` (17) + Gegenprobe (11/11).
- Verteilt in 27 Träger, je PR gemergt, auf `main` nachgezählt 27/27. Liste und Nummern: PULS.
- `docs/PFLICHT_MODULE.md` § sicherheit.html nachgezogen; Pflege-Liste § 36, § 37.

## Was dabei schieflief

- Der zweite Lauf des Werkzeugs überschrieb family-projects Sprachriegel (Erkennungsmerkmal
  `data-i18n` war nach dem ersten Lauf weg). Aus Git zurückgeholt; seitdem Marken
  `APP-EIGEN-KOPF/-FUSS`, die jeder Lauf mitträgt.
- Drei rote Zeilen der eigenen Probe an family-projects Kopie waren Fehler der Probe (relative
  eigene Datei als „fremd“ gezählt, Wegwerf-Kopie ohne die Datei, Sprach-Schlüssel nicht ersetzt).
- Ein blinder Wächter in der Verteil-Probe (V3b), gefunden von der Gegenprobe.
- Die family-project-Probe fand echte deutsche Knopf-Namen im englischen Teil; jetzt
  `lang="de" translate="no"` mit englischer Bedeutung dahinter.

## Offen

- Klaus' Sichttest am Tablet (Sprünge, Rückweg, iframe im Siegel, Sprache).
- Vier Träger ohne ihr eigenes Aussehen der Seite (§ 37) · Cache-Bump doppelt (§ 36).
- family-project: toter Anker „der Knopf waehlt nicht mehr ausdruecklich“ in
  `tests/gegenprobe_uebersetzung.sh` (zielt auf `assets/app.js`, nicht von hier).
- Modul 17: VERKEHR-Lampe ist gold, ihr Hinweistext sagt „grün“ (nicht geändert, Kanon).
