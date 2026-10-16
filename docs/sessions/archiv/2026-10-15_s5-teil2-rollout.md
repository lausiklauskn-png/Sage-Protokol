# Übergabe · S5 Teil 2 gebaut und in 29 Träger ausgerollt (2026-10-15/16)

**Rolle:** Hauptsitzung nach `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, Zeile 5.
**Vorgänger:** `docs/sessions/archiv/2026-10-15_s5_buergen_teil1.md`.

## Getan

| Was | Wo |
|---|---|
| S5 Teil 2: Bürgen ausstellen, Netzadmin (Sage-Protokol nur im offenen Mycel), Vorrang verbürgter Karten | Sage #1123 |
| Rollout von 23, 23-UI, 16 in alle Träger, je mit Pin und Cache-Bump | 29 PRs, Liste in `docs/PULS.md` |
| Siegel-Aspekt S5 | in 28 Trägern (Company-Brain hat kein Siegel) |
| PULS, Plan, Brief, Pflege-Liste § 18, SIGNAL seq 93 | dieser Commit |

## Gemessen

- `smoke_s5_buergen` 70 grün · Gegenprobe 31/31 · `run_alle` 123 grün · 0 rot · 2 nicht lauffähig.
- Auf `main` jedes Trägers nachgezählt (`git grep`), bevor ein Zweig gehoben wurde:
  23 `00f1f66eb6c8` 29/29 · 23-UI `af3385d97111` 27/27 · 16 `5c8c2b89e86a` 28/28.

## Was schieflief (Belegmaterial)

- Kim-sync: zwei Stellen (`?v=` im Manifest, `kimsync-v19` in `tests/smoke.mjs`) zog der
  Verteiler nicht nach; von Hand nachgezogen. Zum vierten Mal dieselbe Lücke, Pflege-Liste § 18.

## Nicht gemessen

- Tablet. Zwei echte Geräte, die einander bürgen.
- „aufgefallen" bleibt Handarbeit, bis S4 steht.
- Privat-Brain hat keine Bürgen-Oberfläche (Pflege-Liste § 19).

## Offen

1. S3.
2. S4 — wartet auf Klaus' Entscheid: Sperrliste öffentlich (S4) oder nicht (Karte 12).
3. Sichttest Bürgen am Tablet mit zwei Geräten.
4. Wächter im Verteiler für Pflege-Liste § 18.
