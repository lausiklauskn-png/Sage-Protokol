# PULS-Auslagerung — ausgelagert am 2026-09-17

Wortgleich aus `docs/PULS.md` genommen, damit die Datei unter ihrer
3000-Zeilen-Grenze bleibt. **Nichts gekürzt** — nur verschoben.

⚠ Der Name trägt bewusst ein Datum statt einer laufenden Nummer: die Reihe
`…-auslagerung-15` ist **zweimal** vergeben (`2026-09-16_puls-auslagerung-15.md`
und `…-15-teil2.md`). Vor dem Schreiben wurde geprüft, dass dieser Name frei
ist — wegen des Vorfalls vom 2026-09-10, bei dem eine gleichnamige Neuschrift
eine vorhandene Archiv-Datei ersetzt hat.

---

## 2026-09-16 · Der Wächter, der den Fund von heute ohne Zutun gemeldet hätte

**Klaus:** *„ja, bau den Herkunfts-Wächter noch ein."* Er stand als offener
Punkt im Eintrag darunter — dass vier Kopien Handarbeit trugen, hatte ein Blick
gefunden, kein Werkzeug.

### Die Frage ist nicht „ist die Kopie alt?", sondern „war sie je Kanon?"

Vor jedem Schreiben hält `tools/kanon-verteilen.mjs` den sha der Kopie gegen
**Sages eigene Historie**. Jede Fassung, die der Kanon je hatte, steht dort.
Steht er nicht darin, ist die Kopie nie so aus Sage herausgegangen.

**An den echten vier nachgestellt** (Fassungen von vor dem Merge aus der
Historie geholt, in einen Wegwerf-Ordner, Verteiler darauf angesetzt):

| | |
|---|---|
| gemeldet | `33d6fe0c5057` · `0f8a3f69de61` ×2 · `8a07567f98ce` |
| **nicht** gemeldet | Kimboard und Kimseek auf `fbf9f42d8a27` — echte Kanon-Generation |
| Schlusszeile | `6 haengen zurueck · ⛔ 4 mit HANDARBEIT` |

**Die vier und nur die vier**, beide Richtungen an echten Daten.

### Drei Ausgänge, nicht zwei

war Kanon · Handarbeit · **nicht prüfbar**. Der dritte ist kein Beiwerk: ein
Werkzeug, das bei fehlender Auskunft „Handarbeit" meldet, hielte beim ersten
frischen Klon den ganzen Rollout auf.

⚠ **ER WAR ZUERST NUR BEHAUPTET.** Im Code stand er, gemessen wurden nur die
ersten beiden — sein Gegenprobe-Fall fiel deshalb am **Nachbar**-Wächter, mit
dessen Namen in der roten Zeile. Erst eine eigene Zusicherung hat ihn gedeckt.

### ⚠ Die Suche kennt ALLE Pfade, unter denen eine Datei je lag

Modul 15 lag vor `src/modules/` in `sbkim-bundle/modules/`. Wer nur den
heutigen Pfad durchsucht, meldet jede ältere Generation als Handarbeit — genau
dieser Fehler ist beim Messen von Hand passiert, und aufgedeckt hat ihn eine
**Kontrolle mit bekannter Antwort**. Ein eigener Gegenprobe-Fall nagelt es fest.

### Der Weg daran vorbei heißt absichtlich nicht `--force`

`--handarbeit-gesichert` ist nach einem Umzug nötig, sonst wäre der Riegel eine
Sackgasse. Der Rückgabewert ist **1**, auch im Schreib-Gang: ohne das endete ein
Lauf, der vier Kopien zurückhält, mit 0 — und „0" heißt in jeder Kette
„alles erledigt".

### Benannte Grenze

⚠ **Der Klon ist flach** (gemessen: `is-shallow-repository` = true). Was hinter
der Abschneide-Grenze liegt, sieht die Prüfung nicht; eine sehr alte
Kanon-Generation kann dort fälschlich als Handarbeit erscheinen. **Der Lauf
schreibt das dazu** und nennt `git fetch --unshallow` als Gegenprobe — ein
Verdacht, der seine eigene Unsicherheit verschweigt, wird beim dritten Mal
überlesen.

Dazu eine Grenze der **Anzeige**: der Fall zum dritten Ausgang druckt weiter die
rote Zeile eines Nachbarn, weil `bekannt.size === 0` abzuschalten zwangsläufig
überall wirkt. Von Hand nachgestellt, dass die gemeinten zwei Zusicherungen
fallen; das steht im Fall daneben.

### Gemessen

| | vorher | nachher |
|---|---|---|
| `smoke_kanon_verteilen.mjs` | 53 grün | **65 grün · 0 rot** |
| `gegenprobe_kanon_verteilen.sh` | 21 gefangen | **28 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `node tests/run_alle.mjs` | 107/107 | **107 Proben · 107 grün · 0 rot · 0 nicht lauffähig** |

⚠ **Und ein eigener Wächter suchte Kleinschreibung**, während das Werkzeug
`HANDARBEIT VERMUTET` schreibt — rot, ohne dass eine Zusicherung gefallen wäre.
*Ein Wächter nagelt eine Aussage fest, keine Schreibweise.*

### Was offen bleibt

Unverändert: `smoke_hintergrund` in family-project flattert · **sieben
Gegenstellen mit ungelesener Post** seit Juli · Privat-Brains
`modules/net-widget.js` und seine 4 roten Zeilen · SB-KIMTool-Points 2 · der
Rezept-Export ohne Spore · Mein WorkFlohs ausgeschaltetes
`sampleContent()`-Gerüst · **Klaus' Browser-Sichttest**.

**Nächster sinnvoller Schritt:** der Briefkasten — sieben Gegenstellen, deren
`ack` teils zwölf Stände zurückhängt, ist der größte unbearbeitete Posten im
Netz.
