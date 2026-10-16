# PULS-Auslagerung 2026-10-16 — vier Einträge vom 2026-10-11

**Ausgelagert am 2026-10-16**, weil `docs/PULS.md` mit dem Eintrag „S4 Sperrliste“ über der
3000-Zeilen-Grenze gestanden hätte (2984 vorher). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier stehen die Einträge **wortwörtlich**.

---

## 2026-10-11 · Sitzungsabschluss

Drei Aufträge, PRs #1066–#1068 gemergt und auf `main` nachgezählt.
Forschungseintrag `2026-10-11-sage-truhe-raster-mycel-anker-kopfleiste` in
`Kimhub/forschung/sitzungen.json` (Kimhub PR #360): 68 min, 9 Befunde.
Übergabeprotokoll: `docs/sessions/archiv/2026-10-11_truhe-pwa-raster.md`.
Auf Klaus' Wunsch kein Brief für eine Folge-Sitzung.

**Nachtrag:** Klaus' Sichttest des Mycel-Knopfs bestanden („klappt
einwandfrei"). Truhe-Raster und Kopfleiste am Handy nicht ausdrücklich
bestätigt.

## 2026-10-11 · Kopfleiste am Handy in zwei Zeilen, Meta-Angaben entfernt

**Rolle:** Pflege-Sitzung (Auftrag von Klaus, Bildschirmfoto vom Handy).

**Befund:** Branch/Protokoll/Schema/Update standen doppelt, als Zeile in der
Kopfleiste und als eigener Kasten über dem Impressum. Am Handy brauchte die
Kopfleiste vier Zeilen.

**Getan (`index.html`):** beide Meta-Anzeigen samt `renderTopbar`/`renderFooter`
und ihrem CSS entfernt. Unter 560 px: Lampen ohne Wörter, größere Punkte,
„Installieren" nur als ⬇. Ein Tipp auf eine Lampe zeigt ihren Titel 4 s lang
(FREMD behält seinen eigenen Klick dazu).

**Gemessen** (Playwright): 360 · 390 · 412 px → zwei Zeilen, kein
waagerechtes Überlaufen; der Lampen-Hinweis erscheint unter der Lampe.
`npm test` 109 grün · 2 rot (die bekannten, Nachbar-Repos fehlen) · 1 nicht
lauffähig.

## 2026-10-11 · Mycel-Knopf dockt in Sages Leiste neben dem Siegel an

**Rolle:** Pflege-Sitzung (Auftrag von Klaus, zwei Bildschirmfotos vom Tablet).

**Befund:** Sage bot keinen `data-sbkim-mycel-platz` an. Hochgezogen schwebte
der Knopf nur in Pixel-Abstand über der Leiste und lag im schmalen Fenster
unter den Lampen.

**Getan:** `index.html`: Platz direkt hinter der Lampen-/Siegel-Gruppe.
`23_rendezvous_ui.js`: eine gemerkte `oben`-Lage plus angebotener Platz dockt
beim Laden an, statt weiter zu schweben. Bundle-Kopien (`sbkim-bundle*/`)
nachgezogen. Bauplan in `INTERFACES.md` („Die Leiste nimmt den Mycel-Knopf
automatisch auf").

**Gemessen:** Playwright an Sage, 1100 px und 1700 px, alte `oben`-Lage
vorbelegt → Knopf jeweils im Platz, 32 px rechts vom Siegel-Rand.
`smoke_bau23_mycel_platz` 19/19, Gegenprobe: 4b fällt ohne die Regel rot.
`bauvorlagen`, `andocken_oben`, `bau23_rendezvous_ui` grün.

**Offen:** Kanon-Verteilung von `23_rendezvous_ui.js` in die Apps; jede App
braucht dazu ihren eigenen Platz in der Leiste.

## 2026-10-11 · Truhe: die Mycel-PWAs stehen als Raster, nicht als Spalte

**Rolle:** Pflege-Sitzung (Auftrag von Klaus, mit Bildschirmfoto vom Tablet).

**Befund:** Im Truhe-Screen (`#vp-pwa-themes`) stand jedes Thema als eigener
Block in einer eigenen Zeile. Alle 24 Themen tragen genau **eine** Karte, das
Raster darin hatte also eine Karte links und daneben leere Spalten. Ergebnis:
eine lange, linksbündige Spalte.

**Getan:** nur CSS in `index.html`. Die Themen-Blöcke selbst bilden jetzt das
Raster (`auto-fill`, mind. 260 px). Über `subgrid` stehen Etikett und Karte
einer Zeile auf gleicher Höhe, alle Karten einer Zeile sind gleich hoch, die
Adresse sitzt unten. Ohne `subgrid` bleibt es ein normales Raster. Kein JS
geändert.

**Gemessen** (Playwright, Chromium): 1280 px → vier Spalten, 390 px → eine
Spalte. Kein waagerechtes Überlaufen bei beiden Breiten. `npm test`: 109 grün,
2 rot, 1 nicht lauffähig. Die zwei roten (`smoke_geraetename_netzweit`,
`smoke_service_worker_parst`) sind auf `origin/main` ohne diese Änderung
genauso rot, weil die Nachbar-Repos nicht neben Sage liegen.
`tests/manual_check.html`: ungeprüft, weil nur das Aussehen eines Screens
geändert wurde und keine Modul-Logik.

**Offen:** Sichttest am Tablet durch Klaus.
