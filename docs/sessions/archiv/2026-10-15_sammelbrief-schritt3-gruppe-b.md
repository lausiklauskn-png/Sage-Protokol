# 2026-10-15 · Sammel-Brief Schritt 3 — Mein-In-and-Out-Book und Kim-sync als SBKIM-Knoten

**Rolle:** Hauptsitzung · **Brief:** `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, nur Schritt 3 (Gruppe B).

## Startprüfung
- `refresh-origin-main.sh`: 4 Repos, 0 veraltet. Sage frisch von `origin/main` (`4ad6e48`) abgezweigt; Fortschritts-Tabelle: Schritt 2 „erledigt (2026-10-15)“.
- Offene PRs: Sage, Mein-In-and-Out-Book, Kim-sync — keine.
- `add_repo`: Mein-In-and-Out-Book und Kim-sync mit Schreibrecht angehängt, keines abgelehnt. Workflow-Needs und Kimboard nur gelesen (öffentlich, anonymer Klon) als Vorlage bzw. für den noble-Vergleich. Kimhub für den Forschungseintrag angehängt.
- Datei-Post: **nicht** angefasst — der Brief verlangt Klaus' ausdrückliches Ja, das in dieser Sitzung nicht vorlag.

## Getan
| Repo | vorher | nachher | PR |
|---|---|---|---|
| Mein-In-and-Out-Book | kein Knoten (nur Modul 25) | 13 Pflicht-Module Kanon, Schublade `inoutbook`, feste Leiste ohne 17, Cache `inout-v8`, alle `?v=8` | #8 |
| Kim-sync | kein Knoten (noble + echtheit aus Kimboard) | 12 Module Kanon + vorhandenes noble, `pruefer-mail.js`, Schublade `kimsync`, feste Leiste ohne 17, Cache `kimsync-v15` | #19 |

Vorlage: `Workflow-Needs/assets/sbkim-init.js` (dort aus dem Sende-Prüfer). Abweichungen davon, je in der Datei benannt: 05b steht als eigene `<script type="module">`-Zeile in `index.html` statt in der Kette (PFLICHT_MODULE Falle 2); die Module stehen **im** Installations-Vorrat (Falle 4; Workflow-Needs hält sie absichtlich heraus); In-and-Out-Book lädt die Kette mit derselben `?v=` wie Seite und Vorrat. Kim-sync: Leiste immer eingeklappt (die Kopfzeile ist schon voll), ≤ 440 px Lampen senkrecht; `sprache.js` schützt die Modul-Fenster (`[id^='sbkim-']`, `[class*='sbkim-']`, Mycel-/Siegel-Platz, Tooltip von 23-UI) vor der eigenen Übersetzung; Lampen-Texte in DE/EN/RU.

Sage: `sbkim/DB-SUFFIXE.md` um `inoutbook`, `kimsync` und das bisher fehlende `workflowneeds` ergänzt.

## Gemessen
- In-and-Out-Book `npm test`: vorher 158 grün · 0 ROT, nachher **231 grün · 0 ROT**.
- Kim-sync `npm test`: vorher 249 grün · 0 ROT, nachher **336 grün · 0 ROT**; die 249 alten Zeilen unverändert (sortiert verglichen), dazu 87 Knoten-Zeilen.
- Browser (Chromium aus `/opt/pw-browsers`, eigener Server Port 0, Fremd-Abrufe abgebrochen), je 4 Breiten, gewartet auf das **Ende** der Kette: alle Pflicht-Globals da (auch `SbkimNostrRelay`), `SbkimSiegel.isCertified()`, `#sbkim-si-open` → `#sbkim-si-wizard` mit „Spore“, Box „Netz“, Gerätename-Feld, keine Seitenfehler, kein Überlauf, **0 WebSocket-Erzeugungen** (gezählt im Browser) und **0 Abrufe außer Haus** beim Laden.
- Kim-sync ohne Knoten auf `main` gegengemessen: Titelbreite bei 320 px 18 px; mit Pille wären es 18 px Überlauf gewesen, mit senkrechten Lampen 0 px Titel, kein Überlauf.
- Gegenprobe In-and-Out-Book `NUR_FALL="KNOTEN:"`: 14 Fälle. Erster Lauf: 3 blind — der Siegel-Wächter las Text, der auch im Verbinden-Panel steht; der Netz-Wächter zählte nur das Netz-Ereignis (ungültige Adresse kommt nie an); ein CSS-Eingriff an einer Regel, die am Handy überschrieben wird. Geschärft, danach 14/14. Die 6 Altfälle mit nachgezogenem `?v=8`: 6/6.
- Gegenprobe Kim-sync (neu, `tests/gegenprobe-knoten.sh`, `NUR_KNOTEN=1`): 17 Fälle, erst 16 · 1 blind (derselbe tote CSS-Eingriff), geschärft, Fall einzeln 1/1.
- `kanon-verteilen --nachbarn /home/user` ohne `--schreiben`: beide Träger gefunden, alle Knoten-Module gleich Kanon; In-and-Out-Book Modul 25 hängt 86 Zeilen zurück.
- Sage `node tests/run_alle.mjs`: 120 Proben, 117 grün, 1 rot (`smoke_service_worker_parst`, auch auf `main` rot), 2 nicht lauffähig (Nachbar-Klone fehlen).
- Auf `main` nachgezählt (beide): 23 `05a6eb42ec68` mit `RDV_LABEL_MAX = 200`, 05b `37eee5b196b3`, 16 `7c12bc487d44`, 16b `c415eafdb1b6`, Schublade und Cache wie oben; `git diff --stat origin/main origin/<zweig>` leer (nach ausdrücklichem Holen des Fernzweigs). Danach Zweige mit `--force-with-lease=refs/heads/<zweig>:<sha>` gehoben.

## Schief gelaufen
- `tests/gegenprobe.sh` während eines laufenden Gegenprobe-Laufs bearbeitet: bash liest das Skript zeilenweise nach, der Lauf brach mit „unexpected EOF“ ab. Warnzeile in beiden Gegenprobe-Skripten ergänzt.
- Erster `git diff --stat` nach dem Merge meldete Unterschiede: der Fernzweig-Verweis war veraltet, nicht der Inhalt. Erst nach `fetch origin refs/heads/<b>:refs/remotes/origin/<b>` leer.

## Benannt, nicht angefasst
- Datei-Post (kein Ja). In-and-Out-Book Modul 25 (älter als Kanon). Register: Sende-Prüfer, Workflow-Calculate, Workflow-PDF fehlen, Werte nicht gemessen.

## Nicht gemessen
- Tablet. Andock-Wizard bis zur signierten Spore. Ein Beitritt zu einem Netz. Kim-sync auf Russisch: Siegel/Verbinden-Fenster bleiben Deutsch (Module kennen DE/EN).

## Spanne
Erster Befehl 12:29:54Z (Unix 1792067394), letzter Merge (Kim-sync #19) 12:58:50Z (Unix 1792069130): **28 min 56 s**. In Unix-Zeit gerechnet.

## Offen
- Erste Spore je App am Gerät (Siegel → Andock-Wizard), danach ⟳ / Hard-Reload.
- Schritt 4 des Sammel-Briefs (Gruppe C: Klaus fragen).

## Forschung
Kimhub-Eintrag `2026-10-15-sammelbrief-schritt3-gruppe-b` (Arm `voll`).
