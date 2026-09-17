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

## Zwei Nachträge von Klaus am selben Tag

**1 · Der Erklär-Satz ist raus** (Sage #1036 nicht betroffen, Toolpoint #124,
family #310). Klaus über „Die Unterlage ist auf Deutsch und wird bewusst nicht
übersetzt: eine selbst gemachte englische Fassung … sähe verbindlich aus, ohne es
zu sein": *„Das ist eine Erklärung, die du gegeben hast."*

⚠ **Entscheidung 3 aus der Tabelle oben ist damit überholt und hier ersetzt, nicht
stillschweigend getauscht.** Sie hiess „Deutsch, mit dem Übersetzer-Hinweis wie bei
Impressum und Datenschutz". Sie heisst jetzt: **Deutsch, und der Weg zum
Browser-Übersetzer steht nur in der ENGLISCHEN Fassung** — auf Deutsch wäre er Text
ohne Auskunft, denn wer die Datei öffnet, sieht ihre Sprache. Die Bedienhilfe
musste bleiben: der Sprachriegel sperrt Google, sobald jemand eine Sprache gewählt
hat.

Die Wächter nageln seitdem die **Entscheidung** fest (kein Absatz begründet das
Nicht-Übersetzen) statt den alten Satz zu verlangen — ein Wächter am Wortlaut
verböte genau das Richtigstellen, das ihn nötig gemacht hat.

**2 · Punkt 2 rückt auf Seite 2 des Ausdrucks** (Sage #1036, Kopien in #124/#310).
Klaus mit Bild aus der Druckvorschau: *„rückst du den Punkt 2 … mit dem Unterstrich
auf die zweite Seite … Du veränderst keine weitere Seite, nur die Seite 1 und 2."*

| | |
|---|---|
| `.training h2{break-after:avoid}` | eine Überschrift bleibt bei ihrem Text — holt Punkt 2 auf Seite 2, gilt bei jeder Seitenhöhe |
| `.training h2.bogen2{…}` | die vier Überschriften der Abschnitte 2–5 rücken enger. **Der Platz kommt aus dem zweiten Bogen, nicht aus Rand oder Schriftgrösse** — ein schmalerer Rand hätte jede Seite verändert |

**Gemessen** (Chromium, A4, 14 mm, alle vier Druckwege, Seite für Seite als Text
verglichen): Schulung — Seite 1 endet nach Abschnitt 1, Seite 2 beginnt mit Punkt 2
und endet mit derselben Zeile wie vorher, **Seiten 3–7 Zeile für Zeile
unverändert**. Beides/Strg+P: Seiten 3–8 unverändert. Bescheinigung und
Lösungsschlüssel: unverändert.

⚠ **Klaus' Ausdruck hat NEUN Seiten, diese Messung sieben** — sein Browser druckt
mit anderen Rändern. Wie die Zeilen bei ihm fallen, ist **nicht gemessen** und sieht
nur er.

**3 · Zwei weitere Umbrüche am selben Nachmittag** (Sage #1037, Toolpoint #125,
family #311).

| Klaus' Wort | gebaut | gemessen |
|---|---|---|
| *„den Bereich Hochrisikoanwendung … auf die nächste Seite 4"* | `.training .bogen4{break-inside:avoid}` hält Überschrift, Absatz und Eskalationsregel als **ein** Block | Seite 3 endet nach „Was ein Verstoß kostet", Seite 4 beginnt mit „Hochrisiko-Anwendungen". **Seiten 1, 2 und 5–7 unverändert**, am Bildschirm jede Position auf dem Pixel gleich |
| *„setzt du Seite 8 mit auf Seite 7 … oder als Fußnote kleiner"* | `#result` kompakter, Überschrift auf Fußnoten-Grösse, die `.ref`-Absätze auf 8,4 pt | bei **22 mm** Rand **9 → 8 Seiten**, Seiten 1–7 unverändert |

⚠ **Beim zweiten wurde Klaus' Seitenrand nachgestellt, statt über ihn zu raten.**
Sein Ausdruck hat neun Seiten, die Messung bei 14 mm sieben — dort gibt es das
Problem gar nicht. Ausprobiert: 14 · 18 · 20 · 22 · 25 mm. Bei 22 mm entstehen
dieselben neun Seiten wie bei ihm; dort wurde gemessen. Bei 25 mm reicht es nicht,
und diese Zeile bleibt stehen: *eine Regel gilt unter den Bedingungen, unter denen
sie gemessen wurde.*

⚠ **Beide Eingriffe sind so zugeschnitten, dass sie nur die genannten Seiten
berühren** — der Block konnte rutschen, weil die Seite dahinter ohnehin mit einem
erzwungenen Umbruch beginnt, und die Fußnoten-Regeln fassen nichts an, was vor dem
Ergebnis-Feld steht. Ein Wächter in Toolpoints Smoke besteht auf beidem.

⚠ **UND EIN DOKU-COMMIT WAR DABEI FAST VERLOREN.** Der Eintrag zu den zwei
Nachträgen war gepusht, aber **ohne PR** — dann kam die nächste Aufgabe, der Zweig
wurde mit `checkout -B … origin/main` neu gesetzt, und der Commit hing nur noch im
Reflog. Gefunden hat es die nächste Doku-Änderung, die ihren eigenen Anker nicht
mehr fand (`AssertionError`), nicht ein Blick. Zurückgeholt mit `git cherry-pick`
aus dem Reflog. *Ein Push ohne PR ist keine Veröffentlichung* — und `checkout -B`
räumt genau das weg, was noch keinen Weg nach `main` hat.

Neue Kennzahlen der Unterlage: **228 Zeilen, 34 093 Bytes,
`md5 7640d7a132b36ebf52ddd7d051646ca2`** (angekommen war sie mit `cc9f4b2b…` und
190 Zeilen). Pin in Toolpoints Smoke nachgezogen, dazu sechs Wächter auf das, was
die Kopie **tragen** muss — ein Pin sagt „unverändert", nicht „trägt noch, was es
tragen soll". Cache: Toolpoint v61, family v121. `npm test` 872 → **923/923**.

## Stundennachweis (Spanne der Sitzung, aus den Commits)

Erster Commit `7deda8a` (PWA-Toolpoint) 2026-09-17 09:38 UTC, letzter der Sage-Commit
dieses Protokolls. Was vor dem ersten Commit lag (Lesen, Bauen, Messen) hinterlässt
keine Spur und wird nicht mitgezählt. **Das ist nicht Klaus' Arbeitszeit.**
