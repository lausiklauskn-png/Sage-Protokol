# Übergabeprotokoll — 2026-09-17 · Die KI-Schulung nach Art. 4 EU AI Act steht auf beiden Seiten

**Rolle:** Hauptsitzung nach `docs/sessions/BRIEF_KI_SCHULUNG_AI_ACT.md`.
**Repos:** PWA-Toolpoint (PR #123, gemergt `ef8239a`) · family-project (PR #309,
gemergt `8006319`) · Sage-Protokol (dieses Protokoll, PULS, Pflege-Liste, Brief).

---

## Auftrag

Die Unterlage `docs/schulung/EU_AI_Act_Art4_KI_Schulung.html` auf PWA Toolpoint und
family-projekt.de veröffentlichen, hinter dem Auslieferungsprüfer. Klaus im Chat
dazu: *„an ein angepasstes Icon denken für die HTML"* — und, als Nachtrag für danach,
*„eine Möglichkeit suchen, auf meinem Hetzner Server Dateien hochzuladen von meinem
Rezeptbuch. JSON-Dateien, die als Rezepte eingefügt werden können von anderen …
kostenlos"*, präzisiert zu *„kostenlos mit Vorbehalt … vielleicht unter einem
Spendenbutton"* und *„es soll auch in family projekt.de"*.

## Was gebaut wurde

### PWA Toolpoint (main `ef8239a`)

| | |
|---|---|
| `ki-schulung.html` | eigene Seite an der Wurzel: Sprachriegel, Kopf-Werkzeuge, Rahmen-Text DE/EN (`assets/i18n-schulung.js`), Knöpfe „Unterlage öffnen" und „Als Datei speichern", Kaffeekasse aus `assets/config/kaffeekasse.js`, Service-Worker-Anmeldung, eigenes Zeichen inline |
| `schulung/EU_AI_Act_Art4_KI_Schulung.html` | byte-gleiche Kopie, `md5 cc9f4b2b7a7d0b6f3f69130cd7c7f795`, in `tests/smoke.mjs` gepinnt |
| `assets/ki-schulung-karte.png` | 512 px, aus dem SVG mit Chromium gerendert |
| `assets/config/listings.js` | `eigen-ki-schulung`, `own: true`, `seit: 2026-09-17`, `sichttest: "ausstehend"`, Kategorie „Vorlage", am Ende der Zeitachse |
| `sw.js` · `sitemap.xml` | beide Dateien im Vorrat, v58 → v59, jede `?v=` auf 59 (gegen `origin/main` geprüft) |
| `tests/smoke.mjs` · `tests/gegenprobe.sh` | 20 Wächter, 13 Fälle |

### family-project (main `8006319`)

| | |
|---|---|
| `werkzeuge/ki-schulung.html` | FP_TOOL-Landingpage: vier Teile als Merkmale, Downloads (Datei, Original im Depot, zwei EU-Quellen), vier Vertrauens-Zeilen mit dem, was die Unterlage **nicht** ist, Spenden-Knopf scharf (`FP_SPENDEN`) |
| `schulung/EU_AI_Act_Art4_KI_Schulung.html` | byte-gleiche Kopie |
| `assets/config/werkzeuge.js` | Karte hinter „Deine App zum Knoten" |
| `assets/config/listings.js` | `markt-ki-schulung` **direkt hinter** `markt-auslieferungspruefer` |
| `forschung/messziele.json` | Ziel `eigen-ki-schulung` (pwa-toolpoint.de/ki-schulung.html), damit der Toolpoint-Eintrag Messwerte bekommt |
| `sw.js` · `sitemap.xml` | v118 → v119, ASSET_V 119, Vorrat, Sitemap |
| `tests/smoke_all.mjs` · `tests/smoke_statische_listen.mjs` | acht neue Prüfungen an der Seite, Sitemap-Pflicht |

### Die vier Fragen des Briefes

| | entschieden | warum |
|---|---|---|
| 1 Reihenfolge | **Zeitachse behalten** | ein Gegenprobe-Fall zeigt: `seit: 2026-08-20` wirft den Reihenfolge-Wächter um. In family-project steht die Schulung wörtlich hinter dem Prüfer |
| 2 Anzahl | **eine** | angekommen ist eine |
| 3 Sprache | **Deutsch** | der Rahmen ist zweisprachig, die Unterlage nicht; der englische Hinweis nennt den langen Druck auf den Sprachknopf |
| 4 Name | **`ki-schulung.html`** | gleicher Name, zwei Orte, gleicher Ordner `schulung/` für die Kopie |

Alle vier als Vorschlag im Brief, keine als stille Entscheidung — Klaus kann jede
umstimmen; die Stellen sind im Code kommentiert.

## Gemessen

| | vorher | nachher |
|---|---|---|
| PWA Toolpoint `npm test` | 872/872 | **915/915 · 0 nicht abgeschlossen** |
| Drift-Guard | 13 byte-identisch | 13 byte-identisch |
| Gegenprobe, die 13 neuen Fälle (Wegwerf-Kopie) | — | **13 gefangen · 0 blind · 0 tote Anker** |
| family `smoke_all` | 110/110 | **121/121** |
| family `smoke_cache_version` · `statische_listen` · `kein_sprung` | 11 · 30 · 40 | 12 · 32 · 42 |
| Auslieferungsprüfer (JS + Python), vier neue Dateien | — | **0 Befunde** (eigener Wirt erlaubt) |

Rückgabewerte direkt gelesen (Datei, dann `$?`), nicht hinter einer Pipe. Baum vor
und nach den Gegenprobe-Läufen sauber, weil die Läufe in einer Kopie liefen.

**Die 13 Fälle wurden einzeln nachgestellt und die roten Zeilen gelesen.** Jeder trägt
den Namen seiner Zusicherung. Zwei Fälle an `listings.js` reißen zusätzlich den
Wächter „statische Liste ist auf dem Stand von listings.js" mit — erwartbar, weil
die Gegenprobe die statische Liste nicht neu schreibt; die eigene rote Zeile steht
trotzdem daneben.

**Vorbestehend rot in family-project, vorher wie nachher identisch:**
`smoke_markt_vecpack` (1) und `smoke_start` (2) — WebSocket zum Relais wird vom Proxy
der Umgebung gesperrt, three.js initialisiert headless nicht; `smoke_wortkarte`
**nicht lauffähig** (Playwright sucht `chromium_headless_shell-1243`, installiert ist
1194). `smoke_hintergrund` war im Ausgangslauf 1 rot, danach 0 — die Flatter-Probe
aus Pflege-Liste 4, hier zum zweiten Mal beobachtet.

**Der Prüfer-Befund, den der Brief vorhersagte, kam nicht:** die zwei `<a href>` auf
die EU-Seiten und der Platzhalter „z. B. Musterfirma GmbH" bleiben still — die
Unterlage ist für beide Fassungen „sauber". Gefunden hat er stattdessen zwei
eigene Fehler in `ki-schulung.html`: ein verstecktes `<a href="#">` für die
Kaffeekasse (jetzt wird der Knopf erst erzeugt, wenn es eine Adresse gibt) und
`og:image:alt="KI-Schulung: …"`, dessen Doppelpunkt der Prüfer als Adress-Schema
liest. Das Erste war zu Recht gemeldet; das Zweite ist ein Befund über den Prüfer
(Pflege-Liste 7).

## Was NICHT gemessen ist

- **Klaus' Sichttest** an https://pwa-toolpoint.de/ki-schulung.html und
  https://family-projekt.de/werkzeuge/ki-schulung.html — `sichttest: "ausstehend"`
  steht auf der Toolpoint-Karte, bis er sie gesehen hat.
- Der **volle** Gegenprobe-Lauf in PWA Toolpoint (rund eine Stunde). Gefahren sind
  die 13 neuen Fälle.
- PageSpeed / Lighthouse der neuen Seiten — kommt mit dem nächtlichen Lauf über das
  neue Messziel.
- Ob Caddy die Datei `schulung/…html` schon ausliefert: der Auto-Pull auf dem Server
  zieht `main` alle zwei Minuten; aus dieser Umgebung ist die Adresse nicht
  erreichbar (Proxy).

## Funde nebenbei — eingereiht, nicht repariert

Vier Punkte in `docs/PFLEGE-LISTE.md` (6–9): der Prüfer selbst steht nicht in
Toolpoints Sitemap und meldet keinen Service-Worker an (`offline: false` auf seiner
Karte, obwohl er „läuft auch ohne Netz" wirbt) · der Prüfer liest „Wort:" in einem
`meta content` als Adress-Schema · Toolpoints Prüfer-Messwerte stehen auf dem
2026-09-08 fest, weil das Messziel `eigen-toolpoint-pruefer` abgeschaltet ist und
die Markt-Messung unter einem anderen Namen läuft · `smoke_wortkarte` in
family-project ist an eine Browser-Fassung gebunden, die nur `npx playwright install`
holt.

## Stundennachweis (Spanne der Sitzung, aus den Commits)

Erster Commit `7deda8a` (PWA-Toolpoint) 2026-09-17 09:38 UTC, letzter der Sage-Commit
dieses Protokolls. Was vor dem ersten Commit lag (Lesen, Bauen, Messen) hinterlässt
keine Spur und wird nicht mitgezählt. **Das ist nicht Klaus' Arbeitszeit.**
