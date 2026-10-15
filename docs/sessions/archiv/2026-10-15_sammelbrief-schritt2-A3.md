# 2026-10-15 · Sammel-Brief Schritt 2, Paket A3 — Bau 23.R nachgezogen

**Rolle:** Hauptsitzung · **Brief:** `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, Schritt 2, nur Paket A3.

## Startprüfung
- Offene PRs: Sage, Mein-Tresor, Jasons-Tresor, Company-Brain — keine.
- Alle drei Repos per `add_repo` geholt, keines abgelehnt. Klone frisch von `origin/main`. Sage vor dem Verteiler auf 3000 Commits vertieft.

## Getan
| Repo | vorher | nachher | PR |
|---|---|---|---|
| Mein-Tresor | 02 `6789fe6e903a` (`web/tools/sbkim-spore.js` `5be1ae8e9280`) · 16 `d84fa539e76e` · 23 `9464fba75e5a` · 23-UI `a81fc9081271` | Kanon (23 `05a6eb42ec68`), Cache v27 | #134 |
| Jasons-Tresor | 02 `6789fe6e903a` (auch `web/tools/`) · 16 `d84fa539e76e` · 23 `9464fba75e5a` · 23-UI `a81fc9081271` | Kanon, Cache v27 | #186 |
| Company-Brain | 02 `0dcde79489a5` · 23 `9464fba75e5a` | Kanon, Pins in `tools/drift-guard.mjs`, Cache `v0-10` | #24 |

Nachgezogen mit `node tools/kanon-verteilen.mjs --nachbarn <ordner> --nur 02_spore,16_siegel,23_rendezvous`, erst ohne, dann mit `--schreiben`, ein Lauf. 05b lag überall schon auf Kanon `37eee5b196b3`, die 05b-Ausnahme griff nicht. Herkunfts-Riegel: keine Handarbeit. Company-Brain trägt kein 16 und kein 23-UI; das Panel steht in `modules/rendezvous-init.js`.

## Gemessen
- Mein-Tresor `npm test` 53 grün · 0 rot; Jasons-Tresor 59 grün · 0 rot; je `tests/smoke_b3_safe_secret.mjs` Rückgabewert 0.
- Company-Brain: `drift-guard` Rückgabewert 0; `e2e-test` 8, `e2e-compressed` 3, `e2e-features` 10, `e2e-advanced` 14, `e2e-embedding` 7, `e2e-relay` 10, `e2e-mikrofon-sprachen` 9, je 0 rot. `e2e-ki-reinigung` nicht lauffähig (Rückgabewert 2, Workflow-PDF-Klon für pdf-lib fehlt).
- Mein-Tresor und Jasons-Tresor `index.html` im Chromium (eigener Server, Port 0): `SbkimRendezvous`, `SbkimRendezvousUI`, `SbkimNostrRelay`, `SbkimSiegel`, `SbkimSpore`, `[data-sbkim-netz-box]` da, keine Seiten- und Konsolenfehler.
- Gegenprobe von Hand (alte 23-Fassung zurück): Company-Brain `❌ byte-1:1 modules/23_rendezvous.js`, rc=1. Die Tresore haben keinen eigenen Wächter → Verteiler meldet „hängt zurück". Bäume danach wiederhergestellt (sha = Kanon, `drift-guard` wieder 0).
- Auf `main` nachgezählt: alle drei 23 = `05a6eb42ec68`, `RDV_LABEL_MAX = 200`, 02 = `0cbf0664e2a7`; 16 in beiden Tresoren = `7c12bc487d44`. Danach Zweige mit `--force-with-lease=refs/heads/<zweig>:<sha>` gehoben.
- Glue: `sbkim/sbkim-init.js` beider Tresore ohne `innerHTML`; Company-Brain `renderRoom` setzt den fremden Namen über `esc()`, Antworten über `textContent`.
- Eingebettete Kanon-Kopien in `*.html`: keine.

## Benannt, nicht nachgezogen
- Mein-Tresor und Jasons-Tresor: 01 (`web/tools/sbkim-storage.js`, 159 Zeilen), 03 (60, auch `web/tools/sbkim-embedding.js`), 04 (264, Bau 04.J braucht die Prüfliste), 05 (255).
- `web/tools/sbkim-spore.js` lädt keine Seite (`werkzeuge/andock.html` lädt nur `sbkim-embedding.js`). Mitgezogen, weil der Verteiler es als Träger von 02 zählt.

## Nicht gemessen
- Tablet, `company-brain.family-projekt.de` nach dem Deploy, ein Raum mit echten fremden Knoten.

## Spanne
Erster Befehl der Sitzung 11:43:26Z (Unix 1792064606), letzter Merge des Pakets (Company-Brain #24) 11:49:09Z (Unix 1792064949): 5 min 43 s. In Unix-Zeit gerechnet.

## Offen
- Schritt 2, Paket A4 (Alis-Moderaum, Perfect-Skin-Fashion, Perfect-Skin-Beauty, Knoten „Muster Werbetechnik", `docs/observatorium/tools/mycelknoten.html`).

## Forschung
Kimhub-Eintrag `2026-10-15-sammelbrief-schritt2-a3` (Arm `voll`, 4 Befunde), Kimhub #381; dort `node tests/alle.mjs` 3747 grün · 0 ROT, `NUR_ANKER` 1428 · 0 tot. Sages `run_alle.mjs`: 120 Proben, 117 grün, 1 rot (`smoke_service_worker_parst`, auch auf `main` rot), 2 nicht lauffähig (`bau24r_reinigung_browser`, `vorrat_wirkung`: Nachbar-Klone fehlen).
