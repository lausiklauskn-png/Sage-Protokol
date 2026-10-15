# 2026-10-15 · Sammel-Brief Schritt 1: `kanon-verteilen` zieht den Cache-Stand mit

**Rolle:** Hauptsitzung · **Brief:** `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, nur Schritt 1.

## Startprüfung
- Sage frisch von `origin/main` (`1a8d3f9`). Offene PRs in Sage: keine.

## Getan
- `tools/kanon-verteilen.mjs`: `cacheBump` meldet, ob gebumpt wurde; nach allen Schreibvorgängen
  je Träger ruft `cacheStandNachziehen` dessen `tools/cache-stand.mjs` auf (nur `--schreiben`, nur
  nach einem Bump, nur wenn die Datei da ist). Nachsehen-Gang: eine Zeile, was geschähe.
  Fehlschlag: laut, am Schluss wiederholt, Rückgabewert 1; die übrigen Träger laufen weiter.
- Probe `tests/smoke_kanon_cachestand.mjs` (15), Gegenprobe `tests/gegenprobe_kanon_cachestand.sh` (6 Fälle).
- Pflege-Liste #13 → Erledigt. PULS-Eintrag. PR #1094, gemergt (`9588259`), auf `main` nachgezählt.

## Gemessen
- Probe 15 grün · 0 ROT. Gegenprobe 6 gefangen · 0 durchgerutscht · 0 tote Anker. Erster Lauf:
  1 Fall aus falschem Grund (stderr bei Rückgabewert 0 nicht gelesen) → `spawnSync`, nachgefahren.
- Wegwerf-Klone von Workflow-Calculate und Workflow-Needs mit `16_siegel.js` auf Sage `e9df076`:
  alter Verteiler → `CACHE`-Zeile rot in beiden; neuer → 305 · 0 ROT bzw. 283 · 0 ROT.
- `run_alle.mjs`: 116 grün · 2 rot (`smoke_geraetename_netzweit`, `smoke_service_worker_parst`,
  Nachbarn fehlen, auch auf `main` rot, Pflege-Liste #12) · 2 nicht lauffähig.
- Echte Träger nicht angefasst. Tablet nicht gemessen (nicht betroffen).

## Offen
- Schritt 2 (Gruppe A, Bau 23.R) und folgende.
