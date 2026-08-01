# Brief für die nächste Sitzung — nach der Lighthouse- und Kopfleisten-Runde

**Angelegt:** 2026-08-01 · **Vorherige Sitzung:** Lighthouse-Messung + Behebung an
Mein-Rezeptbuch, Muttis-Rezeptbuch, Mein-Mixarium.

---

## Was in der Sitzung davor passiert ist (alles gemergt)

Es fing mit einer Frage an: *hält der Code einer Messung mit Googles Lighthouse
stand?* Gemessen wurde wirklich — Lighthouse 13.4.1, Desktop-Preset, gegen die
lokal ausgelieferte `index.html`. Nicht geschätzt.

| | Mein-Rezeptbuch | Muttis-Rezeptbuch |
|---|---|---|
| Leistung | 28 → **46** | 67 → 66 |
| Bedienbarkeit | 88 → **96** | 87 → **95** |
| Gute Praxis | 96 → 96 | 96 → 96 |
| Auffindbarkeit | 82 → **91** | 80 → **90** |

**Gemergte PRs:** Mein-Rezeptbuch #357, #358, #359, #360 · Muttis-Rezeptbuch
#170, #171, #172, #173 · Mein-Mixarium #172, #173 · Sage-Protokol #771 (Brief).

### Die vier Funde, der Reihe nach

1. **Eruda wurde bei jedem Start geladen** (nur Mein-Rezeptbuch). Ein festes
   `<script src="https://cdn.jsdelivr.net/npm/eruda@3">` im Kopf holte rund ein
   halbes Megabyte von einem fremden Server — bei *jedem* Start. Der Kommentar
   darüber sagte bereits „wird erst beim Hervorholen initialisiert"; die Absicht
   war richtig, die Datei wurde trotzdem immer geholt. Folgen: nicht offline-fähig
   beim ersten Laden, eine Anfrage an einen Dritt-Anbieter pro Besucher, und ein
   SyntaxError in der Konsole. Jetzt wird sie wirklich erst auf Abruf geholt.
   Messbar: Blockierzeit 850 → 350 ms.

2. **Toter Cloudflare-Rest** (nur Muttis-Rezeptbuch). `<script
   src="/cdn-cgi/scripts/…/email-decode.min.js">` — beim Speichern einer über
   Cloudflare ausgelieferten Kopie mitgeschrieben. Auf GitHub Pages gibt es den
   Pfad nicht: 404 bei jedem Aufruf. Geprüft, dass nichts daran hing (kein
   einziges `__cf_email__`), dann entfernt.

3. **Farbe als Zierton, benutzt als Schrift.** `--br3` war für Ränder und Flächen
   gedacht, wurde aber ~200× als Schriftfarbe verwendet. Im voreingestellten
   Theme „iridescent" ergibt das `#ddd0ff` auf Weiß = **1,44:1**. Neue Variable
   `--dim` pro Theme im selben Farbklang, Ziel 4,6:1; `--br3` bleibt unverändert
   für das, wofür es gedacht war. Klaus' Entscheidung: nur echte Inhalte heilen,
   die geisterhaften Platzhalter für leere Rezept-Karten bleiben blass.
   Dazu `--fill` für Flächen mit weißer Schrift (9 von 13 Themes lagen unter 4,5:1).

4. **Kopfleiste** (Klaus' Bildschirmfotos). „Rezeptbuch" war in mehreren Themen
   kaum zu lesen, in Holografisch verschwanden die Pillen ganz. Ursache: Schrift-
   und Pillenfarbe waren fest auf die dunkelbraune Standard-Leiste eingestellt,
   jedes Thema färbte nur den Hintergrund um. Vier Variablen ersetzen die
   bisherigen Einzel-Flicken (`--hdr-fg`, `--hdr-halo`, `--hdr-scrim`,
   `--hdr-pill-*`). Nur ein Thema dreht sie um: Holografisch.

### Ein Punkt, der bewusst gegen die Messung entschieden wurde

Die Kopfleisten-Knöpfe haben auf Klaus' Wunsch in vier Runden Deckung verloren:
`.62` → `.42` → `.21` → **`.07`**, und die Lichtkante ist am Ende **überall**
weg, auch im Holo-Thema (dort trägt die helle Fläche allein die Form). Ein
Prüfwerkzeug misst nur Fläche gegen Schrift und zählt den Schatten nicht mit —
gemessen liegt die Fläche über hellen Kopfleisten weit unter 4,5:1. Gelesen wird
die Schrift trotzdem, weil der Schatten sie trägt. **Das ist eine ausdrückliche
Entscheidung von Klaus zugunsten des Aussehens**, sie steht so im Quelltext
kommentiert. Wer sie in einer späteren Sitzung „repariert", macht sie rückgängig
— erst fragen.

---

## Was offen ist

### 1. Die SBKIM-Modul-Runde (eigener Brief liegt schon)

Zwei Befunde gehören nicht den Apps, sondern den geteilten Modulen — der
vollständige Auftrag mit fertigem Fix, Reihenfolge und der Liste aller 14 Apps
steht in **`docs/sessions/BRIEF_LIGHTHOUSE_SBKIM_MODULE.md`** (PR #771):

- `17_floating_widget.js` — Lampen-Beschriftungen auf hellen Seiten zu blass
  (4,11:1 und 2,36:1 statt 4,5:1), weil `--sbkim-widget-bg` `rgba(0,0,0,0.45)`
  ist und die helle Seite durchscheinen lässt.
- `23_rendezvous_ui.js` — der „🔑 Schlüssel holen"-Link wird ohne `href` erzeugt.

**Achtung:** `17_floating_widget.js` weicht in Mein-Rezeptbuch bereits um 166
Diff-Zeilen von Sage ab. Vor dem Überkopieren prüfen, in welche Richtung.

### 2. Die anderen Apps sind ungemessen

Gemessen wurden nur die beiden Rezeptbücher. Nicht gemessen: Mein-Mixarium (dort
wurde nur die Kopfleiste mitgezogen), Mein-WorkFloh, BookLedgerPro, Tomys-Hub,
family-project, Kimboard, Kimseek, Kim-Bell, die Tresore. Der Cloudflare-Rest und
das `--br3`-Muster können dort genauso stecken — **geprüft ist es nicht.**

So geht die Messung (funktionierte in dieser Umgebung):

```bash
mkdir -p /tmp/lh && cd /tmp/lh && npm i lighthouse --silent
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
cd <app> && python3 -m http.server 8199 &
cd /tmp/lh && node node_modules/lighthouse/cli/index.js \
  http://localhost:8199/index.html --preset=desktop \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=/tmp/lh/x.json --quiet \
  --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage"
```

Die Befunde stehen dann in `x.json` unter `categories[*].auditRefs` — alles mit
`score < 1` und `weight > 0` ansehen.

Für Themen-Vergleiche hilft ein Bildschirmfoto-Durchlauf über alle Themen
(Playwright, `localStorage` setzen und neu laden) — so wurde die Kopfleiste
geprüft. Mein-Mixarium liefert dabei nur Schwarz, weil eine Vollbild-Eröffnung
die Seite verdeckt; dort über die berechneten Stile prüfen.

### 3. Zwei Kleinigkeiten

- In Mein-Rezeptbuch ist auf dem Server ein Zweig `claude/lesbare-nebenschrift`
  stehengeblieben (zeigt auf denselben Stand wie das Gemergte). Löschen ließ er
  sich aus der Sitzung nicht — schadet nichts, kann bei Gelegenheit weg.
- Die Ladezeit der Rezeptbücher bleibt der große offene Punkt: `index.html` ist
  4,8 MB in *einer* Datei. Das ist der Preis der Offline-Fähigkeit und wurde
  bewusst nicht angetastet. Wer daran will, braucht Klaus' ausdrückliches Wort —
  es ändert die Bauweise.

---

## Eine Lehre, die sich durch alle vier Funde zieht

Nichts davon war kaputt. Nichts stürzte ab, nichts warf einen Fehler, den jemand
gesehen hätte. Ein Skript, das immer geladen wird, obwohl der Kommentar daneben
das Gegenteil behauptet. Ein 404, der bei jedem Aufruf passiert und niemanden
stört. Eine Schriftfarbe von 1,44:1, die man erst bemerkt, wenn man sie nachrechnet.
Eine Kopfleiste, die in fünf Themen unlesbar ist, weil jedes neue Thema den
Hintergrund umfärbte und niemand die Schrift darauf.

**Es funktionierte alles, und es taugte nichts.** Sichtbar wurde es erst durch
Messen — und beim letzten Punkt erst dadurch, dass Klaus Bildschirmfotos geschickt
hat. Das Muster ist immer dasselbe: ein Flicken pro Symptom schreibt den Fehler
fort, eine Variable an der richtigen Stelle beendet ihn.

---

## Pflichtlektüre vor der nächsten Sitzung

1. `CLAUDE.md` — die Verfassung, besonders § Fremdnutzer-/Marktplatz-Brille.
2. `docs/PULS.md` — Stand.
3. Dieser Brief.
4. `docs/sessions/BRIEF_LIGHTHOUSE_SBKIM_MODULE.md`, wenn die Modul-Runde dran ist.

## Abschluss-Befehl

`docs/PULS.md` fortschreiben, Übergabeprotokoll in `docs/sessions/archiv/`,
„Nächste Schritte"-Block in die Chat-Antwort, und den nächsten Brief als
Codeblock im Chat ausgeben — die Kette reißt nie ab.
