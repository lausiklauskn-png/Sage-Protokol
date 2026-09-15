# PULS-Auslagerung — 2026-09-14, Sichttest-Nachlese

**Ausgelagert am 2026-09-15**, weil `docs/PULS.md` auf die Grenze von 3000
Zeilen zulief (2.983). **Nichts wurde gekuerzt** — der Eintrag steht hier
wortgleich, wie er im PULS stand.

> ⚠ **Beim ersten Anlauf wurde zu viel ausgelagert**, und `smoke_sbkim_name.mjs`
> wurde zu Recht rot: ihre vierte Pruefung ist eine **Gegenrichtung** und
> verlangt, dass `docs/PULS.md` den alten Befund zur falschen SBKIM-Aufloesung
> **weiter festhaelt** — Tilgen waere der Schaden, den sie verhindert. Die
> 3000-Zeilen-Regel und dieser Waechter ziehen also gegeneinander; aufgeloest
> wurde es, indem ein Eintrag ausgelagert wurde, der den Befund **nicht** traegt.

---

## Stand 2026-09-14 (Haupt-Sitzung, Sichttest-Nachlese) · ⚠ DIE LAMPEN, DIE KLAUS SIEHT, KOMMEN NICHT AUS MODUL 17

**Rolle:** Haupt-Sitzung. Aufgabe 1 des Briefs (Sichttest-Nachlese). Aufgabe 2
(Andock-Werkzeug im Siegel) wartet unberührt auf Klaus' Entscheidung.
**Kein Modul-Code angefasst** — `16_siegel.js` und `17_floating_widget.js`
liegen byte-gleich auf `origin/main` (7589f18d59dc · 3f757b35cea5).

### Was gemessen wurde

Die zwei Domänen sind aus dieser Sitzung nicht abrufbar (Proxy, HTTP 000 —
gegengeprüft). Gemessen wurde stattdessen **lokal im echten Browser**
(playwright-core + Chromium) an frischen `git archive`-Auszügen von
`origin/main`, mit gesetzter Sprachwahl im `localStorage`:

| Seite | `<html lang>` | Modul 17 | was SICHTBAR dasteht |
|---|---|---|---|
| family-projekt.de | en | geladen, `_meta.lang === "en"` | **LEBT · VERKEHR · FREMD · SIEGEL** |
| pwa-toolpoint.de | en | **nicht geladen** | **lebt · verkehr · fremd** |
| …/auslieferungspruefer.html | en | geladen, en | **ALIVE · TRAFFIC · FOREIGN · SEAL** |

**Der Sprach-Haken arbeitet** — am Prüfer gemessen. Was auf den beiden Seiten
deutsch bleibt, ist **app-eigener Klebstoff**, vom Modul-Rollout grundsätzlich
nicht erreichbar:

- **family-project** ruft in `sbkim/sbkim-init.js` `SbkimWidget.hide()`. Die
  sichtbare Leiste ist `assets/status-widget.js` — Etiketten fest im Code,
  **0 Treffer** auf `documentElement.lang`, `T(`, `TEXTE`.
- **pwa-toolpoint** lädt Modul 17 auf der Startseite bewusst nicht (eigene
  `.lamps`-Leiste); die Etiketten stehen als Markup in `index.html`, die
  Tooltips ebenfalls deutsch.

Dieselbe Lage wie beim Gerätenamen (NETZWEIT §2) und beim Andock-Werkzeug.

### ⚠ Und das WAPPEN im Siegel trägt zwei deutsche Anzeigetexte

Gemessen an allen drei Seiten, in jeder Stufe: im Wappen stehen
**`OFFIZIELLE BESTÄTIGUNG`** und **`SIEGEL`** deutsch da, während alles andere
Englisch spricht. Sie stecken als Markup in der Konstante `WAPPEN_SVG` und
gehen nicht durch `T()`. (`SBKIM` ist Eigenname, der `ribbonText` wird vom Host
graviert und war korrekt gesetzt.)

**Das ist NICHT dieselbe Frage wie die ZERTIFIKAT_ASPEKTE**: deren deutscher
Wortlaut ist die Urkunde und steht nur im Code, übersetzt wird an der
Anzeige-Stelle. Hier steht er **in der Anzeige**. Ob ein Wappen als Emblem
deutsch bleibt oder mitspricht, **ist hier nicht entschieden** — die Frage geht
an Klaus, die Lage ist in INTERFACES § Modul 16 SPRACHE benannt.

### Warum kein Wächter es gefangen hat

Abschnitt 3 der Probe misst **zeilenweise** und nur Zeilen mit einer
Anzeige-Zuweisung. `WAPPEN_SVG` ist eine `var`-Zuweisung mit Markup, eingesetzt
wird sie über eine **Variable** — auf deren Zeile steht keine Zeichenkette. Für
beide Filter unsichtbar. Das ist seine **dritte** benannte Grenze; zwei standen
schon da.

**Abschnitt 4 ist neu** und gleicht das Wappen gegen die Tafel ab: jeder Text
darin muss in INTERFACES benannt sein. Er entscheidet **nichts** über die
Übersetzungsfrage — er verhindert nur, dass ein Text **unbenannt** bleibt.

⚠ **Die Wegwerf-Kopie der Gegenprobe kannte `docs/` nicht.** Abschnitt 4 liest
INTERFACES; ohne die Zeile in `frisch()` war die Kopie **schon ohne Eingriff
rot**, und damit maßen alle 25 Fälle nichts. Die Ausgangslage-Prüfung hat es
beim ersten Lauf gefangen — die Positivlisten-Falle, zum wiederholten Mal.

⚠ **Eine eigene These wurde von der Messung widerlegt**, und das steht hier,
weil sie fast in den Bericht gewandert wäre: aus einem ersten Lauf
(„★ SEAL" beim Prüfer) hatte ich geschlossen, das Wappen erscheine nur in
Gold-Stufe. Nachgemessen: **alle drei stehen auf Bronze und zeigen dasselbe
Wappen.** Der Unterschied waren zwei verschiedene Elemente, nicht zwei Stufen.

**Gemessen:** `smoke_bau1617_sprache.mjs` **68 grün** (vorher 64) ·
`gegenprobe_bau1617_sprache.sh` **27 gefangen, 0 durchgerutscht, 0 tote Anker**
(vorher 25) · voller Lauf **103 Proben grün, 0 rot, 0 nicht lauffähig**
(Rückgabewert direkt gemessen, nicht hinter einer Pipe).

### Was offen ist

- **Aufgabe 2** — das Andock-Werkzeug im Siegel (20 Dateien, 407–540 Zeilen,
  272 gemeinsam): unberührt, wartet auf Klaus' Entscheidung zwischen
  „20 einzeln" und „erst zusammenführen, dann übersetzen".
- **Die zwei Wappen-Texte**: Entscheidung Klaus (Emblem deutsch ⟷ mitsprechen).
- **Der app-eigene Klebstoff** der Lampen in family-project und PWA-Toolpoint:
  nicht angefasst, keine Entscheidung getroffen.
- Der **Sichttest selbst** steht weiter aus — er ist durch nichts zu ersetzen.

---
