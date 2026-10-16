# Übergabe · S5b Teil 1 „Bürgen für fremde Apps“ gebaut und ausgerollt (2026-10-16)

**Rolle:** Hauptsitzung. Auftrag: Sammel-Brief `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`,
erster offener Schritt 5b.

## Startprüfung

Sitzungsliste: nur diese Sitzung lief. Kein offener PR in Sage.

## Getan

| Was | Wo |
|---|---|
| Tafel S5b, S5 an drei Stellen ersetzt (benannt) | `docs/INTERFACES.md` § Modul 23 |
| Haftung je App, 180 Tage, `vouchExpiring`, Widerruf mit `reason`, Widerrufe gespeichert, „antworte nur Verbürgten“, Frage trägt ≤ 4 Bürgschaften | `src/modules/23_rendezvous.js` (+ Bündel) |
| Grund-Feld, Ablauf-Hinweis, Schalter (DE/EN) | `src/modules/23_rendezvous_ui.js` (+ Bündel) |
| Siegel-Aspekt S5b; S5-Aspekt berichtigt | `src/modules/16_siegel.js` (+ Bündel) |
| Probe, Gegenprobe | `tests/smoke_s5b_buergen_maerkte.mjs`, `tests/gegenprobe_s5b_buergen_maerkte.mjs` |
| S5-/S4-Proben auf den neuen Vertrag | `tests/smoke_s5_buergen.mjs`, `tests/gegenprobe_s5_buergen.mjs`, `tests/smoke_s4_sperrliste.mjs` |
| Rollout | 29 Träger, je ein PR (Liste in `docs/PULS.md`) |

## Gemessen

- `smoke_s5b_buergen_maerkte` 44 grün (Oberfläche im Chromium DE/EN, 360 px), Gegenprobe 24/24.
- S5 70 grün, Gegenprobe 31/31 · S4 33 grün, Gegenprobe 15/15 · `smoke_netz_eigen` 69 grün.
- Träger: Proben grün; rot und auf `main` genauso: PWA-Toolpoint `smoke_detail`, BookLedgerPro
  `smoke_a5_antwortpfad`. Einzelheiten in `docs/PULS.md`.
- Auf `main`: 29/29 mit S5b-Code, 28 mit Siegel-Aspekt (Company-Brain ohne Siegel).

## Was schiefging (Befund)

1. E1 (Ablauf-Hinweis nur für eigene Bürgschaften) war zweimal blind: die fremde Bürgschaft kam
   vom selben Bürgen wie eine eigene, die Regel „neueste je Bürge“ verdeckte sie. Gefunden von der
   Gegenprobe, nicht beim Schreiben.
2. Die erste Gegenprobe kopierte `docs/` nicht; Z3 stürzte ab statt rot zu werden.
3. Meine erste Nachzählung auf `main` meldete 0/29; die Schleife war falsch, nicht der Merge.
   Ein Einzelblick und eine zweite Zählung ergaben 29/29.
4. Proben anderer Repos suchen Nachbar-Klone mit Großschreibung (`Workflow-PDF`,
   `Auslieferung-Pruefer`); ohne Link „nicht lauffähig“.

## Nicht gemessen

Tablet; zwei echte Geräte; eine echte Bürgschaft mit 180 Tagen; der Schalter „Nur Verbürgten
antworten“ im echten Raum.

## Offen

- S5b weiter: Netz-Verwaltung als Kanon in Sage (vier Listen), dann Studio in PWA Toolpoint und
  family-project (Plan § S5b). Ablauf-Hinweis im Siegel der App.
- Sammel-Brief Schritt 6 (Paper S).

## Nächste Sitzung

Weiter bei Schritt 5b (Netz-Verwaltung und Studio).
