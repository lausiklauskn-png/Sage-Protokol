# 2026-10-15 · Sammel-Brief Schritt 2, Paket A2 — Bau 23.R nachgezogen

**Rolle:** Hauptsitzung · **Brief:** `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, Schritt 2, nur Paket A2.

## Startprüfung
- Offene PRs: Sage keine; family-project #339 (Werbevideo), Kimhub #259/#262 (Sende-Prüfer) — fremde Themen, nicht 23.R. Kim-Bell, kim-hub-company keine.
- Alle vier Repos per `add_repo` geholt, keines abgelehnt. Klone frisch von `origin/main`.

## Getan
| Repo | vorher | nachher | PR |
|---|---|---|---|
| Kim-Bell | 02 `6789fe6e903a` · 16 `d84fa539e76e` · 23 `9464fba75e5a` · 23-UI `a81fc9081271` | Kanon (23 `05a6eb42ec68`), Pins in `test/smoke.test.js`, Cache v53 | #72 |
| kim-hub-company | 02 `6789fe6e903a` · 05b `030aa2d26014` · 16 `d84fa539e76e` · 23 `3caa0bb1fbe7` · 23-UI `fc47f16b24d5` | Kanon, Pins in `tools/sbkim-drift.mjs`, Cache v77 | #75 |
| family-project | wie Kim-Bell | Kanon, Cache v153, `ASSET_V` + 96 `?v=` | #359 |
| Kimhub | trägt keine Modul-Dateien | — | — |

Nachgezogen mit `node tools/kanon-verteilen.mjs --nachbarn <ordner> --nur 02_spore,16_siegel,23_rendezvous` bzw. `…,05b,…` für kim-hub-company; zwei Läufe, damit jeder Träger einmal gebumpt wird. Herkunfts-Riegel: keine Handarbeit.

**05b in kim-hub-company:** Modul 23 wurde zusammen mit 05b weitergebaut (Sage #1074 Netz-Code, #1080 Antwort des Relais). Neues 23 läuft mit altem 05b fail-soft (ohne `pr.antwort` keine Bestätigung), die Bestätigung des Relais und das Zurücksetzen der Relais-Liste wären aber still weggefallen. Deshalb mitgenommen.

## Gemessen
- Kim-Bell `npm test` 4/4. kim-hub-company `npm test` 72 grün · 0 ROT · 0 nicht lauffähig, `sbkim-drift` 13/13, `drift` 27/27. family-project: alle 48 `tests/smoke_*.mjs` Rückgabewert 0; `smoke_angleichen`, `smoke_fremdmarkt` je ein Teil ungemessen (Nachbar-Klon PWA-Toolpoint fehlt).
- Kim-Bell und kim-hub-company `index.html` im Chromium geladen (eigener Server, Port 0): `SbkimRendezvous`, `SbkimRendezvousUI`, `SbkimNostrRelay`, `SbkimSiegel`, `[data-sbkim-netz-box]` da, keine Skriptfehler außer abgewiesenen Netz-Abrufen.
- Gegenprobe von Hand (alte 23-Fassung zurück): Kim-Bell `not ok 1 - Drift-Guard`, kim-hub-company `ABGEWICHEN: sbkim/23_rendezvous.js`, rc=1. family-project hat keinen eigenen Wächter für 23 → Beweis sha256 = Kanon, Gegenprobe über den Verteiler („hängt zurück"). Bäume danach wiederhergestellt.
- Auf `main` nachgezählt: alle drei `23` = `05a6eb42ec68`, `RDV_LABEL_MAX = 200`.
- Glue: family-project `sbkim/sbkim-init.js` fremder Text nur über `esc()`, `mycelkarte.html` ohne `innerHTML`; Kim-Bell `assets/rendezvous-init.js` ohne `innerHTML`.
- Eingebettete Kanon-Kopien in `*.html`: keine.

## Unterwegs
- family-project hat keine `package.json`: `playwright-core` mit `--no-save` installiert (`node_modules` steht im `.gitignore`). Das neue Playwright sucht eine Browser-Fassung, die hier nicht liegt; der erste Lauf wurde angehalten und mit `PW_CHROMIUM` auf `/opt/pw-browsers/chromium-1194` neu gestartet.
- Beim Anhalten traf `pkill -f` die eigene Hülle (Rückgabewert 144). Dieselbe Falle wie in Kimhubs Verfassung. Danach mit PIDs angehalten; Baum geprüft, nur erwartete Dateien geändert.
- `--force-with-lease` beim Heben der Zweige scheiterte zuerst („stale info"), weil `checkout -B` den Upstream auf `main` umhängt (LEHREN § 1). Mit ausdrücklichem erwarteten sha gehoben.

## Benannt, nicht nachgezogen
- Kim-Bell: 01 (133 Zeilen), 04 (264 Zeilen, Bau 04.J braucht die Prüfliste `pruefer-mail.js`), 20 (14 Zeilen).
- kim-hub-company: 03 (60 Zeilen, Modell vom eigenen Server).

## Nicht gemessen
- Tablet, Hetzner nach dem Deploy von family-project, ein Raum mit echten fremden Knoten.

## Spanne
Zweig angelegt (Reflog) 09:26:12Z, letzter Merge des Pakets (family-project #359) 09:38:27Z: 12 min 15 s. In Unix-Zeit gerechnet.

## Offen
- Schritt 2, Pakete A3 (Mein-Tresor, Jasons-Tresor, Company-Brain) und A4.

## Forschung
Kimhub-Eintrag `2026-10-15-sammelbrief-schritt2-a2` (Arm `voll`, 5 Befunde), Kimhub #380; dort `node tests/alle.mjs` 3747 grün · 0 ROT, `NUR_ANKER` 1428 · 0 tot. Sages `run_alle.mjs`: 120 Proben, 117 grün, 1 rot (`smoke_service_worker_parst`, auch auf `main` rot), 2 nicht lauffähig.
