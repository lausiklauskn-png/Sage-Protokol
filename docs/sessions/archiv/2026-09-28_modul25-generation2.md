# 2026-09-28 · Modul 25, Generation 2

**Rolle:** Bausitzung (Brief: Sende-Prüfer als eigene App). **Branch:** `claude/sende-pruefer-standalone-app-w78vsp`.

## Getan
- `src/modules/25_pseudonym.js` neu: Kern des Sende-Prüfers, Platzhalter `⟦TYP-n⟧`, sechs Sorten, `find`/`findLeak`/`isIban`, alte `[[TYP_n]]` weiter lesbar, Lookbehind-Muster fail-soft.
- `tests/smoke_bau25_pseudonym.mjs` neu (52 grün), `tests/gegenprobe_bau25_pseudonym.mjs` neu (15/15).
- Panel 25, Karte 25, MODUL-STAND, E2E-VERTRAULICHKEIT, status.json nachgezogen.

## Gemessen
`npm test` 109 grün · 0 rot · Gegenprobe 15 gefangen · 0 blind · Panel 25 im Chromium 4/4 grün.

## Nicht gemessen
Klaus' Sichttest Generation 2 · ein Browser ohne Lookbehind (`_meta.ausgefallen`) · Einsatz in einer App.

## Offen / nächste Schritte
1. Sende-Prüfer trägt Modul 25 byte-1:1 (Kanon-Pin), eigene Kopie der Muster fällt weg.
2. Modul 26 (Eingang, Kern des Auslieferungsprüfers) — eigene Sitzung.
3. Gestaltung, Impressum/Datenschutz, Marktplatz-Einträge des Sende-Prüfers (Brief).
