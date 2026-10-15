# 2026-10-15 · Sammel-Brief Schritt 2, Paket A4 — Bau 23.R nachgezogen, Schritt 2 erledigt

**Rolle:** Hauptsitzung · **Brief:** `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, Schritt 2, nur Paket A4.

## Startprüfung
- `refresh-origin-main.sh`: 4 Repos, 0 veraltet. Alle Klone frisch von `origin/main` abgezweigt.
- Offene PRs: Sage, Alis-Moderaum, Perfect-Skin-Fashion, Perfect-Skin-Beauty — keine.
- Die drei Repos lagen der Sitzung schon bei, keines abgelehnt. Sage vor dem Verteiler auf 3000 Commits vertieft (nicht flach).

## Getan
| Repo | vorher | nachher | PR |
|---|---|---|---|
| Alis-Moderaum | 02 `6789fe6e903a` · 05b `030aa2d26014` · 16 `d84fa539e76e` · 23 `3caa0bb1fbe7` · 23-UI `fc47f16b24d5` | Kanon (23 `05a6eb42ec68`), Cache `alis-moderaum-v25` | #72 |
| Perfect-Skin-Fashion | dieselben fünf Fassungen | Kanon, kein Service-Worker | #44 |
| Perfect-Skin-Beauty | dieselben fünf Fassungen | Kanon, kein Service-Worker | #72 |

Nachgezogen mit `node tools/kanon-verteilen.mjs --nachbarn <ordner> --nur 02_spore,05b_nostr_relay,16_siegel,23_rendezvous`, erst ohne, dann mit `--schreiben`, ein Lauf. 05b lag auf der Juni-Fassung `030aa2d26014` → die 05b-Ausnahme griff. Pins in `tools/drift-guard.mjs` (je 5) vom Verteiler nachgezogen. Herkunfts-Riegel: keine Handarbeit. Eingebettete Kanon-Kopien in `*.html`: keine.

## Gemessen
- `npm test` vor und nach dem Nachziehen, je Rückgabewert 0: Alis-Moderaum 55/55 → 55/55 · Perfect-Skin-Fashion 66 grün → 66 grün · Perfect-Skin-Beauty 18 + 25 → 18 + 25 (dazu je die SBKIM-Proben, z. B. Alis 85 grün, PSB 69 grün).
- `npm run gegenprobe`: 18/18 · 17/17 · 19/19 Fehler bemerkt.
- Gegenprobe von Hand (alte 23-Fassung von `origin/main` zurück): in allen drei `✗ ABGEWICHEN: modules/23_rendezvous.js`, Drift-Guard rc=1. Danach wiederhergestellt (sha `05a6eb42ec68`, Drift-Guard rc=0).
- `index.html` je im Chromium (eigener Server, Port 0, Fremd-Abrufe abgebrochen), gewartet bis Siegel und 23-UI geladen sind: `SbkimRendezvous`, `SbkimRendezvousUI`, `SbkimNostrRelay`, `SbkimSiegel`, `SbkimSpore` da — vorher wie nachher gleich.
- Seitenfehler `Unexpected token 'export'` in allen drei, **auch auf `main`**: die Nachlade-Kette lädt `modules/noble-secp256k1.js` (ES-Modul) als klassisches Skript. 05b importiert noble selbst.
- Erster Browser-Lauf wartete nur auf `SbkimRendezvous` und meldete Siegel/UI als fehlend — die Kette pausiert zwischen den Dateien. Mit Warten auf das Kettenende verschwand der Befund, vorher wie nachher.
- Auf `main` nachgezählt: 02 `0cbf0664e2a7`, 05b `37eee5b196b3`, 16 `7c12bc487d44`, 23 `05a6eb42ec68` (`RDV_LABEL_MAX = 200`), 23-UI `efecd89ea80d` in allen drei; Alis `alis-moderaum-v25`. Danach Zweige mit `--force-with-lease=refs/heads/<zweig>:<sha>` gehoben.
- Glue `assets/*.js` (ohne den Wizard): kein `innerHTML`.

## Knoten „Muster Werbetechnik"
- Mitschnitt `mycel-karte/mitschnitt/mycel-lauf-2026-09-10.json`: Spore `Gq_Mt8o_QCDBU-vTcQFAmJzHA2el8ATwISSMq6_w_uc`, `nodeName` „Muster Werbetechnik", `endpoint` `https://lausiklauskn-png.github.io/Mein-Workfloh-Page/`.
- Repo nur gelesen (öffentlich, anonymer Klon): `sbkim/spore.json` trägt dieselbe `id`. Repo = **Mein-Workfloh-Page**, DB-Schublade `workflohpage`.
- Trägt 02 `6789fe6e903a`, 05b `030aa2d26014`, 16 `d84fa539e76e`, 23 `3caa0bb1fbe7`, 23-UI `fc47f16b24d5` — dieselbe Generation wie die drei A4-Apps.
- **Nicht angefasst:** der Brief nennt „NIE anfassen: reine Werbe-/Landing-Seiten (*-Page …)". Das Repo ist eine Vorlage-PWA und ein arbeitender Knoten. Frage an Klaus.

## `docs/observatorium/tools/mycelknoten.html`
- Eingebettet: 01, 02, 03, 04, 05, 07, 15, 16, 17. **Kein 23.**
- 02 eingebettet 1171 Zeilen gegen Kanon 1357 (198 Diff-Zeilen), 16 1201 gegen 1704 (581 Diff-Zeilen).
- Nicht nachgezogen (Regel: trägt eine Seite 02/16 ohne 23, wird 16 nicht nachgezogen — sonst behauptete das Siegel eine 23.R-Prüfung).
- `innerHTML`: Tabellenköpfe fest; `renderModalRow` setzt fremde Werte über `textContent`; Modul-Liste über `escapeAttr`.

## Benannt, nicht nachgezogen
- 03 (60 Zeilen) und 04 (109 Zeilen) hängen in allen drei zurück.

## Nicht gemessen
- Tablet, die Live-Seiten nach dem Deploy, ein Raum mit echten fremden Knoten.

## Spanne
Erster Befehl der Sitzung 12:01:48Z (Unix 1792065708), letzter Merge des Pakets (Alis-Moderaum #72) 12:07:25Z (Unix 1792066045): 5 min 37 s. In Unix-Zeit gerechnet.

## Offen
- ~~Mein-Workfloh-Page: nachziehen ja/nein (Klaus).~~ Erledigt, siehe Nachtrag.
- Schritt 3 des Sammel-Briefs (Gruppe B: In-and-Out-Book, Kim-sync).

## Forschung
Kimhub-Eintrag `2026-10-15-sammelbrief-schritt2-a4` (Arm `voll`, 4 Befunde), Kimhub #382; Nachbar-Klone vorher mit `--shallow-since=2026-08-20` vertieft. Dort `node tests/alle.mjs` 3747 grün · 0 ROT · 0 nicht lauffähig, `NUR_ANKER` 1428 · 0 tot. Sages `run_alle.mjs`: 120 Proben, 117 grün, 1 rot (`smoke_service_worker_parst`, auch auf `main` rot), 2 nicht lauffähig (`bau24r_reinigung_browser`, `vorrat_wirkung`: Nachbar-Klone fehlen).

## Nachtrag (selbe Sitzung): Mein-Workfloh-Page nachgezogen
Klaus: nachziehen. Mein-Workfloh-Page #38 (gemergt): 02, 05b, 16, 23, 23-UI auf den Kanon vom Abend (23 `bc8cc295b449`, S1/S2/S5 Teil 1, wie die übrigen 28 Träger seit #1118), Cache `werbetechnik-page-v28`. `npm test` rc 0 vorher wie nachher, Gegenprobe 18/18, Drift-Guard mit alter 23 rot. Auf `main` nachgezählt, dann Zweig gehoben. Merge 22:41:38 (Ortszeit), Unix 1792096898.
