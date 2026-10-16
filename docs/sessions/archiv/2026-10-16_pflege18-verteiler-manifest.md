# Übergabe · Pflege-Liste § 18: Verteiler zieht Manifest und Proben-Pin mit (2026-10-16)

**Rolle:** Hauptsitzung. Auftrag: Punkt 4 aus `docs/sessions/archiv/2026-10-15_s5-teil2-rollout.md`.

## Getan

| Was | Wo |
|---|---|
| `?v=` auch in `manifest.json` / `*.webmanifest` | `tools/kanon-verteilen.mjs`, `traegerDateien` |
| volle alte Cache-Kennung in `tests/`, `test/` | `tools/kanon-verteilen.mjs`, `probenDateien` + `cacheBump` |
| Wächter + Gegenprobe | `tests/smoke_kanon_mitziehen.mjs`, `tests/gegenprobe_kanon_mitziehen.sh` |
| Pflege-Liste § 18 erledigt, § 22 neu, PULS | dieser Commit |

## Gemessen

- `smoke_kanon_mitziehen` 16 grün; gegen den alten Verteiler 4 ROT. Gegenprobe 7 gefangen · 0 durch · 0 tot.
- Kopien von In-and-Out-Book und Kim-sync, Modul 16 auf `58f263c`: alter Verteiler je 1 ROT in der App-Probe, neuer 231/0 und 336/0.
- `run_alle` 122 grün · 2 rot (Nachbar-Klone fehlen) · 2 nicht lauffähig.

## Was schieflief (Belegmaterial)

- Die erste Fassung zog `tests/cache-stand.json` mit. `smoke_kanon_cachestand` wurde rot (3 ROT). Ausgenommen, Fall in Probe und Gegenprobe.

## Nicht gemessen

- An einem echten Rollout.

## Offen

1. Pflege-Liste § 22.
2. S3 (andere Sitzung), S4 (Klaus' Entscheid), Sichttest Bürgen am Tablet.

## Forschungseinträge (Pflicht, am Ende jedes Briefs)

> Klaus 2026-10-16: *„Das ist wichtig, sonst muss ich es belegen können, dass hier was gelaufen ist."*

Jeder Lauf dieser Sitzung bekommt **einen eigenen Eintrag** in
`Kimhub/forschung/sitzungen.json`, nicht einen für alle Läufe zusammen:

```bash
node tools/sitzung-eintragen.mjs <eintrag.json>   # prüft und hängt an
node tools/forschung-bauen.mjs                    # baut forschung/index.html
node tests/alle.mjs forschung                     # muss grün sein
```

- `arm` setzen (`voll` · `nur-regeln` · `nur-grundsaetze` · `nackt`).
- `beginn`/`ende` **gemessen**: aus dem Reflog (Arbeitsbeginn am Zweig) und dem letzten Commit.
  Den Beginn aufrunden, das Ende abschneiden.
- `befunde` mit `herkunft` (`regel` · `gegenprobe` · `hinsehen` · `klaus`) und `waechterBlind`, wo es zutrifft.
- Danach Commit, Push, PR und Merge in Kimhub. Dann auf `main` nachsehen, ob der Eintrag angekommen ist.

**Dieser Abschnitt steht am Ende JEDES Briefs**, wörtlich, auch im nächsten.
