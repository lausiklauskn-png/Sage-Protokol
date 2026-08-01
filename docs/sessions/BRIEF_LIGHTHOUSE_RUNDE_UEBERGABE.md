# Übergabe: Lighthouse-Runde — was fertig ist und wie es weitergeht

**Angelegt:** 2026-08-01 · **Für:** die parallele Sitzung mit größerem Kontextfenster,
die die Lighthouse-Runde für die übrigen Apps übernimmt.
**Von:** der Sitzung, die die drei Küchen-Apps und die Sage-Page gemacht hat.

> **Es gibt genau ZWEI Dateien zur Lighthouse-Runde — mehr nicht:**
>
> | Datei | Was sie ist |
> |---|---|
> | **dieser Brief** | der Stand: was gemessen, gefunden und behoben wurde, und wie man weitermisst. Fang hier an. |
> | `BRIEF_LIGHTHOUSE_SBKIM_MODULE.md` | ein **Arbeitsauftrag**, kein Bericht: die zwei Befunde in den geteilten SBKIM-Modulen, mit fertigem Fix und Rollout-Reihenfolge. Erst lesen, wenn diese Runde dran ist (§ 4.1). |
>
> Ein dritter Brief (`BRIEF_NACH_LIGHTHOUSE_RUNDE.md`) wurde am 2026-08-01 hier
> **eingeschmolzen und gelöscht** — er war ein älteres Teilstück dieses Briefes und
> kannte die Muttis-Klammern und die Mixarium-Runde noch nicht. In der Git-Historie
> liegt er weiter; im Arbeitsverzeichnis würde er nur die Frage aufwerfen, welcher
> von beiden gilt.

---

## 0. Zuerst: frisch holen, bevor irgendetwas gebaut wird

**Am 2026-08-01 haben vier Repos je vier bis sechs Merges bekommen** —
Mein-Rezeptbuch, Muttis-Rezeptbuch, Mein-Mixarium und Sage-Protokol. Wer auf einem
Klon von vorher aufsetzt, baut auf totem Stand und wundert sich, dass Aenderungen
„nicht ankommen". Also **vor jeder Arbeit an einem dieser Repos**:

```bash
git -C <repo> fetch origin main --quiet
git -C <repo> checkout -B <branch> origin/main
```

Das gilt doppelt, wenn zwei Sitzungen parallel an denselben Repos arbeiten. Und es
gilt auch fuer die **Aussage ueber** einen Stand: nie „App X hat Feature Y nicht"
schreiben, ohne vorher gefetcht zu haben. Ein lokaler Klon ohne `fetch` ist kein
Beweis. (Steht so auch in Sages `CLAUDE.md` unter „Sitzungsstart-Pflicht".)

---

## 1. Was schon erledigt ist (alles gemergt, nichts offen)

Gemessen mit **Lighthouse 13.4.1**, Desktop-Preset, gegen die lokal ausgelieferte
`index.html`. Echte Läufe, keine Schätzungen — vorher **und** nachher.

| App | Leistung | Bedienbarkeit | Gute Praxis | Auffindbarkeit |
|---|---|---|---|---|
| Mein-Rezeptbuch | 28 → **46** | 88 → **96** | 96 → 96 | 82 → **91** |
| Muttis-Rezeptbuch | 67 → 66 | 87 → **95** | 96 → 96 | 80 → **90** |
| Mein-Mixarium | ~64 | 83 → **96** | 92 → **96** | 82 → **91** |
| Sage-Page | — | — | — | — (nur Frisch-Knopf ergänzt) |

**Gemergte PRs:** Mein-Rezeptbuch #357 #358 #359 #360 #361 · Muttis-Rezeptbuch
#170 #171 #172 #173 #174 #175 · Mein-Mixarium #172 #173 #174 #175 ·
Sage-Protokol #771 #772 #773.

---

## 2. Die zehn Fund-Muster — als Prüfliste für jede weitere App

Das ist der eigentliche Wert dieser Übergabe. Jeder Punkt wurde in mindestens
einer App real gefunden, nicht theoretisch hergeleitet.

### 2.1 Ein fremder Server bei jedem Start

- **Eruda** hing als festes `<script src="https://cdn.jsdelivr.net/npm/eruda@3">`
  im Kopf (Mein-Rezeptbuch **und** Mixarium; in Mixarium lief zusätzlich sofort
  `eruda.init()`). Rund ein halbes Megabyte pro Start.
- **Google Fonts** (`fonts.googleapis.com`, Inter) in Mixarium.

Drei Folgen, jedes Mal dieselben: die App ist beim **ersten** Laden nicht
offline-fähig, jeder Besucher schickt eine Anfrage an einen Dritt-Anbieter, und
der Start wartet darauf. In Mein-Rezeptbuch brach das Eruda-Skript zusätzlich mit
einem SyntaxError ab.

**Fix Eruda:** auf Abruf nachladen (`hole()`-Promise, `onerror` → fail-soft), die
vorhandene Hervorhol-Geste als Auslöser lassen. Messbar: Blockierzeit 850 → 350 ms.
**Fix Fonts:** die drei `<link>` entfernen — die Schrift-Stacks tragen bereits
`system-ui, -apple-system, 'Segoe UI', Roboto` als Rückfall. Es fällt nichts aus,
es sieht nach System-Schrift aus.

> **Suchbefehl:** `grep -rn "cdn.jsdelivr\|fonts.googleapis\|unpkg.com\|cdnjs" --include=*.html <repo>`

### 2.2 Toter Cloudflare-Rest → 404 bei jedem Aufruf

`<script data-cfasync="false" src="/cdn-cgi/scripts/…/email-decode.min.js">` —
in **Muttis-Rezeptbuch und Mein-Mixarium** gefunden. Der kam nie aus dem Projekt,
sondern wurde beim Speichern einer über Cloudflare ausgelieferten Kopie
mitgeschrieben. Auf GitHub Pages gibt es den Pfad nicht.

**Vor dem Entfernen prüfen:** `grep -c '__cf_email__' <datei>` muss **0** sein —
sonst hängen verschleierte Mail-Adressen daran.

> **Suchbefehl:** `grep -rn "cdn-cgi" --include=*.html <repo>`

### 2.3 `charset` zu spät

In Mixarium stand `<meta charset="UTF-8">` hinter den eingebetteten Start-Bildern
bei **Byte 2982**. Die Grenze liegt bei **1024** — danach rät der Browser die
Kodierung und liest die Seite neu.

**Fix:** als allererste Zeile nach `<head>`, Kommentar dahinter (ein Kommentar
davor schiebt es wieder über die Grenze — das ist mir einmal passiert).

> **Prüfung:**
> ```python
> s = open('index.html', encoding='utf-8').read()
> print(len(s[:s.find('<meta charset')].encode('utf-8')))   # muss < 1024 sein
> ```

### 2.4 Zoom gesperrt

`<meta name="viewport" … maximum-scale=1 …>` — wer schlecht sieht, kann die Seite
nicht vergrößern. **Nur das Haupt-Tag anfassen**; die Export-Vorlagen für gedruckte
Bücher haben eigene viewport-Tags in JS-Template-Strings und bleiben, wie sie sind.

### 2.5 Keine Kurzbeschreibung

`<meta name="description">` fehlte in allen dreien.

### 2.6 Keine Haupt-Landmarke

Vorlesewerkzeuge konnten den Hauptinhalt nicht ansteuern. **Fix ohne DOM-Umbau:**
`role="main"` auf den sichtbaren Screen, und `showSc()` reicht die Rolle weiter:

```js
document.querySelectorAll('.sc[role="main"]').forEach(s => s.removeAttribute('role'));
if (sc) { sc.setAttribute('role', 'main'); … }
```

Ein Wrapper-`<div>` wäre riskant gewesen: die Druck-Regel `body>*:not(#manualOv)`
hängt an der direkten Kindschaft.

### 2.7 Zierton als Schriftfarbe (der größte Einzelfund)

`--br3` war als **dekorativer Hellton** gedacht (Ränder, Flächen), wurde aber
**~200× als Schriftfarbe** benutzt. Im voreingestellten Theme „iridescent" ist das
`#ddd0ff` auf Weiß = **1,44:1** — die Meta-Zeile unter jedem Namen war praktisch
unsichtbar. Und zwar in **jedem** Theme, auch im Standard (2,33:1).

**Fix — zweite Variable statt umgefärbter:**

| | |
|---|---|
| `--dim` | **neu**, abgeschwächte aber lesbare Schrift. Pro Theme im selben Farbklang berechnet, Ziel 4,6:1 gegen den Papier-Ton *dieses* Themes. |
| `--fill` | **neu**, Füllfarbe für Flächen mit weißer Schrift (aktive Pille, Leerzustands-Knopf). 9 von 13 Themes lagen unter 4,5:1. |
| `--br3` | **unverändert** für Ränder, Flächen, Eingabe-Platzhalter und die bewusst geisterhaften leeren Karten. |

**Klaus' Entscheidung dazu (2026-08-01):** *nur echte Inhalte* heilen. Die 70
geisterhaften Platzhalter-Karten (`.rname.em`, 1,44:1) bleiben blass — das ist
Absicht, kein Fehler. **Nicht „reparieren".**

**Wichtig bei der Berechnung:** die Sättigung deckeln (ich habe 0.62 genommen),
sonst wird aus einem zarten Korall-Ton ein Alarm-Rot. In Mixarium ergab die
ungedeckelte Rechnung `#e60009`; mit Deckel `#d13a40`.

**Drei Sonderfälle, die keine Theme-Variable lösen kann:**
- **Versions-Plakette:** ihr Hintergrund ist *fest* hell (`#f5efe8`). Eine
  Theme-Farbe wird dort in hellen Themes zu blass und in dunklen zu hell → fester
  dunkler Ton (`#5a4632`).
- **`opacity` auf geerbter Schriftfarbe:** `.cdiv-sub` hatte `.6` = 4,21:1 → `.78`.
  `.empty-state__desc` hatte `--br3` **und** `opacity:.65` = 1,26:1 → Textfarbe
  mit nur *einer* Abschwächung.
- **Fallback-Schreibweise** `color:var(--br3,#a08060)` wird von einem simplen
  `replace('color:var(--br3)')` **nicht** erfasst. Extra suchen.

### 2.8 Kopfleiste: feste Schrift auf wechselndem Hintergrund

Schrift- und Pillenfarbe der Kopfleiste standen fest auf die dunkelbraune
Standard-Leiste eingestellt (`#f0e6d8`, `#c4a07a`, `rgba(255,255,255,.13)`). Jedes
Thema färbte nur den **Hintergrund** um. Geflickt wurde bisher Thema für Thema
(`neon`, `spektral`, `iridescent`) — womit der Fehler mit jedem neuen Thema
zurückkam.

**Fix — vier Variablen statt Einzel-Flicken:** `--hdr-fg` · `--hdr-halo` ·
`--hdr-scrim` (Schleier nur links hinter dem Titel, rechts bleibt die Farbe frei) ·
`--hdr-pill-bg/-fg/-line/-halo`. Genau ein Thema dreht sie um: **Holografisch**
(durchgehend hell). Flache dunkle Leisten (Nacht, Neon, Modern, Frühling) schalten
nur den Schleier ab, weil er dort wie ein Schmutzfleck aussähe.

> **⚠️ NICHT ANFASSEN:** die Kopf-Knöpfe stehen nach vier Runden mit Klaus bei
> `--hdr-pill-bg: rgba(0,0,0,.07)` und **ohne** Lichtkante, auch im Holo-Thema.
> Ein Prüfwerkzeug misst nur Fläche gegen Schrift und zählt den Schatten nicht mit;
> über hellen Leisten liegt die Fläche damit weit unter 4,5:1. **Das ist Klaus'
> ausdrückliche Entscheidung zugunsten des Aussehens**, im Quelltext kommentiert.
> Wer sie „repariert", macht sie rückgängig.

### 2.9 `aria-hidden` ohne `inert`

Mixariums Begrüßungs-Overlay `#mxAniOv` trug `aria-hidden="true"`, enthielt aber
einen „Überspringen"-Knopf, der mit der Tabulator-Taste weiter erreichbar war.
**Fix:** `inert` dazu, und beim Zeigen `removeAttribute('inert')`.

### 2.10 Fehlende schließende Klammer — der teuerste Fund

**Muttis-Rezeptbuch hatte fünf CSS-Regeln, die mit `;` statt `}` endeten:**
`.txt-import-zone` · `.txt-paste-area` · `.txt-hint` · `.txt-analyze-btn` ·
`.txt-reset-btn`. In den Schwester-Apps sind dieselben Regeln korrekt geschlossen —
beim Kopieren gingen die Klammern verloren.

Folge: der Browser las **alles Nachfolgende als Inhalt dieser einen Regel**. Der
Kopf-Stilblock parste statt 1046 nur **796** Regeln — **245 Regeln waren stumm**.
Deshalb kamen dort weder die Kopfleisten- noch die Farb-Arbeit an, obwohl beides
im Quelltext stand und in den Schwester-Apps wirkte.

Nichts stürzte ab, nichts meldete einen Fehler. Es sah nur so aus, als würden
Änderungen „nicht ankommen" — und die naheliegende Erklärung („da wurde etwas
vertauscht") war falsch.

> **Prüfung im echten Browser (das ist der Beweis, nicht das Lesen):**
> ```js
> const ss = document.styleSheets[0];
> console.log(ss.cssRules.length, ss.cssRules[ss.cssRules.length-1].cssText.slice(0,120));
> ```
> Ist die **letzte** geparste Regel nicht die letzte im Quelltext, steckt davor
> eine offene Klammer.
>
> **Statischer Zähler** (Kopf-Stilblock, ohne Kommentare, `@media` ausgenommen):
> Tiefe mitzählen; geht sie außerhalb einer `@`-Regel auf 2, ist die umschließende
> Regel offen. Treffer in den **Export-Vorlagen** sind Fehlalarme — `${…}` im
> Template-String zählt als Klammer.

---

## 3. Wie gemessen wird (lief in dieser Umgebung)

```bash
mkdir -p /tmp/lh && cd /tmp/lh && npm i lighthouse --silent
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome

cd <app> && setsid python3 -m http.server 8199 >/dev/null 2>&1 &
sleep 2

cd /tmp/lh && node node_modules/lighthouse/cli/index.js \
  http://localhost:8199/index.html --preset=desktop \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=/tmp/lh/x.json --quiet \
  --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage"
```

Auswerten — alles mit `score < 1` **und** `weight > 0`:

```js
const r = require('/tmp/lh/x.json');
for (const cat of Object.keys(r.categories))
  for (const ref of r.categories[cat].auditRefs) {
    const a = r.audits[ref.id];
    if (a && a.score !== null && a.score < 1 && ref.weight > 0)
      console.log(cat, '|', ref.id, '|', a.title);
  }
```

**Themen-Durchlauf** (so wurde die Kopfleiste geprüft): Playwright, pro Thema
`localStorage` setzen, **neu laden**, `.top-hdr` fotografieren, die Bilder
untereinander legen und ansehen. Die Theme-Schlüssel unterscheiden sich pro App:
`mtheme9m` (Mein-Rezeptbuch) · `mtheme9` (Muttis) · `mxtheme9m` (Mixarium).
Nur `data-theme` per JS zu setzen reicht **nicht** — die App setzt es beim Start
selbst wieder.

**Rechnen statt schätzen:** WCAG-Kontrast ist
`(heller+0.05)/(dunkler+0.05)` über der relativen Leuchtdichte. Ein Wert unter
4,5 ist ein Befund, auch wenn er „noch geht".

---

## 4. Was noch offen ist

### 4.1 Die SBKIM-Modul-Runde (eigener Brief liegt)

Zwei Befunde gehören nicht den Apps, sondern den geteilten Modulen. Der
vollständige Auftrag **mit fertigem Fix, Reihenfolge und der Liste aller 14 Apps**
steht in **`docs/sessions/BRIEF_LIGHTHOUSE_SBKIM_MODULE.md`**:

- `17_floating_widget.js` — Lampen-Beschriftungen auf hellen Seiten zu blass
  (4,11:1 und 2,36:1), weil `--sbkim-widget-bg` `rgba(0,0,0,0.45)` ist.
- `23_rendezvous_ui.js` — der „🔑 Schlüssel holen"-Link wird ohne `href` erzeugt.

**Achtung:** `17_floating_widget.js` weicht in Mein-Rezeptbuch bereits um 166
Diff-Zeilen von Sage ab. Vor dem Überkopieren prüfen, in welche Richtung.

Diese vier Beschriftungen sind der **einzige** verbliebene Kontrast-Befund in
allen drei Küchen-Apps.

### 4.2 Die ungemessenen Apps

Gemessen wurden nur die drei Küchen-Apps. **Ungeprüft:** Mein-WorkFloh,
BookLedgerPro, Tomys-Hub, family-project, Kimboard, Kimseek, Kim-Bell,
Privat-Brain, Company-Brain, Jasons-Tresor, Mein-Tresor, SB-KIMTool-Point,
Alis-Moderaum, mycel-karte, die Perfect-Skin-Repos und die `*-Page`-Repos.

**Klaus' Ausnahme 2026-08-01: Kimhub und Küchenzettel auslassen** — die liegen
auf Eis.

### 4.3 Eine Kleinigkeit

In Mein-Rezeptbuch ist auf dem Server ein Zweig `claude/lesbare-nebenschrift`
stehengeblieben. Er zeigt auf denselben Stand wie das Gemergte; löschen ließ er sich
aus der Sitzung heraus nicht (die Gegenstelle nimmt keine Lösch-Pushes an). Schadet
nichts, kann bei Gelegenheit über die GitHub-Oberfläche weg.

### 4.4 Die Ladezeit

`index.html` ist bei Mein-Rezeptbuch **4,8 MB in einer Datei**. Das ist der Preis
der Offline-Fähigkeit und wurde bewusst nicht angetastet. Wer daran will, braucht
Klaus' ausdrückliches Wort — es ändert die Bauweise.

---

## 5. Repo-Eigenheiten, die man einmal falsch macht

| App | Regel |
|---|---|
| **Mein-Rezeptbuch** | Der GitHub-**Default-Branch ist ein toter Decoy** (Vor-SBKIM-Stand). Immer `git fetch origin main` und den Arbeits-Branch mit `git checkout -B <branch> origin/main` neu aufsetzen. Änderungen in `QC_MeinRezb_*.html`, dann `python3 build.py`. |
| **Muttis-Rezeptbuch** | Änderungen in `QC_MR_*.html`, dann `python3 build.py`. |
| **Mein-Mixarium** | **Kein** Build. `index.html` muss **byte-identisch** zur QC-Datei sein — `cp` und `md5sum` verifizieren. |
| **alle** | Selbst-Merge-Freibrief gilt netzweit (Klaus 2026-06-28): eigene PRs nach dem Test selbst mergen, Draft → ready → squash. Nicht bei echtem Zweifel. |

---

## 6. Nebenbei entstanden: der Frisch-Knopf

Auf Klaus' Wunsch hat jede der drei Apps **und** die Sage-Page jetzt ein 🔄 in der
Kopfleiste, das Service-Worker abmeldet, alle Zwischenspeicher leert und neu lädt.
In den PWAs gab es die Funktion schon, aber nur drei Ebenen tief in den
Einstellungen; der Kopf-Knopf ruft dieselbe Funktion auf (keine zweite Kopie der
Logik). Die Sage-Page hatte gar keine — dort neu gebaut, mit Notbremse nach 2,5 s.

**Wer hat schon eine Cache-leerende Neuladen-Funktion** (Stand 2026-08-01,
gegrept nach `serviceWorker.getRegistrations`): Alis-Moderaum, BookLedgerPro,
Company-Brain, Jasons-Tresor, Kim-Bell, Kimboard, Kimseek, Mein-Tresor,
Mein-WorkFloh, Privat-Brain, SB-KIMTool-Point, Tomys-Hub, family-project,
mycel-karte — plus die vier von heute. **Ob der Knopf dort auch erreichbar sitzt
oder wie hier vergraben ist, wurde nicht geprüft.**

---

## 7. Die Lehre, die sich durch alles zieht

Nichts davon war kaputt. Nichts stürzte ab, nichts warf einen Fehler, den jemand
gesehen hätte. Ein Skript, das immer geladen wird, obwohl der Kommentar daneben
das Gegenteil behauptet. Ein 404, der bei jedem Aufruf passiert und niemanden
stört. Eine Schriftfarbe von 1,44:1, die man erst bemerkt, wenn man sie
nachrechnet. Ein fehlendes Zeichen, das ein Viertel einer Stilvorlage abschaltet.

**Es funktionierte alles, und es taugte nichts.** Sichtbar wurde es erst durch
Messen — und zweimal erst dadurch, dass Klaus Bildschirmfotos geschickt hat.
Das Muster ist immer dasselbe: ein Flicken pro Symptom schreibt den Fehler fort,
eine Variable an der richtigen Stelle beendet ihn.

---

## Pflichtlektüre vor der Arbeit

1. `CLAUDE.md` des jeweiligen Repos.
2. `docs/PULS.md` (Sage) bzw. der Stand des Repos.
3. Dieser Brief.
4. `docs/sessions/BRIEF_LIGHTHOUSE_SBKIM_MODULE.md`, wenn die Modul-Runde dran ist.

## Abschluss-Befehl

`docs/PULS.md` fortschreiben, „Nächste Schritte"-Block in die Chat-Antwort, und
den nächsten Brief als Codeblock im Chat ausgeben — die Kette reißt nie ab.
