# 2026-10-15 · Sammel-Brief Schritt 2, Paket A1 — Bau 23.R nachgezogen

**Rolle:** Hauptsitzung · **Brief:** `docs/sessions/BRIEF_2026-10-15_EIN_BRIEF_ALLE_ARBEITEN.md`, Schritt 2, nur Paket A1.

## Startprüfung
- Offene PRs in PWA-Toolpoint, SB-KIMTool-Point, Kimseek: keine. Klone frisch von `origin/main`.

## Getan
| Repo | vorher | nachher | PR |
|---|---|---|---|
| PWA-Toolpoint | 02 `6789fe6e903a` · 16 `d84fa539e76e` · 23 `9464fba75e5a` · 23-UI `a81fc9081271` | Kanon (23 `05a6eb42ec68`), Cache v91, 244 `?v=` mitgezogen | #167 |
| SB-KIMTool-Point | dieselben vier, in `web/tools/` | Kanon, Cache v11; `jasons-bibliothek` 02 neu eingebettet | #186 |
| Kimseek | dieselben vier | Kanon, Cache v63 | #92 |

Nachgezogen mit `node tools/kanon-verteilen.mjs --nachbarn <A1> --schreiben`; Herkunfts-Riegel: keine Handarbeit.

## Gemessen
- PWA-Toolpoint `npm test` **2425/2425 · 0 nicht abgeschlossen**.
- SB-KIMTool-Point `npm test` **140 bestanden · 0 fehlgeschlagen** — beim ersten Lauf **1 rot** (`jason_lib.test.js`: Modul 02 nicht byte-genau eingebettet), nach dem Neu-Einbetten grün.
- Kimseek `npm test` **12 bestanden**.
- Gegenprobe von Hand je Repo (alte 23-Fassung zurückgelegt): Kimseek `not ok 8 - Drift-Guard`, SB-KIMTool-Point `not ok 1 - Drift-Guard`, PWA-Toolpoint `❌ byte-1:1 sbkim/23_rendezvous.js`. Baum danach wiederhergestellt.
- Auf `main` nachgezählt: alle drei `23_rendezvous` = Kanon `05a6eb42ec68`, `RDV_LABEL_MAX = 200`; Verteiler „0 hängen zurück".
- Glue: Knotenkarte (`esc`), Briefkasten (`esc`, `seq` als Zahl), `brain.html` (`esc`) — fremder Text nie roh als HTML.

## Benannt, nicht geändert
- SB-KIMTool-Point `web/tools/mycelknoten.html`: 02/16 eingebettet, **kein 23**. 16 nachzuziehen ließe das Siegel eine Prüfung behaupten, die die Seite nicht leistet.
- SB-KIMTool-Point `sbkim/SIGNAL.json` steht seit 2026-08-15 (seq 36), nicht angefasst.

## Nicht gemessen
- Tablet, ein Raum mit echten fremden Knoten.

## Spanne
Arbeitsbeginn am Zweig (Reflog) 09:00:14Z; Paket A1 von 09:12:11Z (Merge der Freigabe) bis 09:16:48Z (letzter Merge). Gemessen am Commit-Zeitstempel in Unix-Zeit (zwei Zeitzonen in den Ausgaben).

## Offen
- Schritt 2, Pakete A2–A4.
