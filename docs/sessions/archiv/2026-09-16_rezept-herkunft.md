# Übergabeprotokoll — 2026-09-16 · Herkunft am Rezept und eine stabile Kennung

**Rolle:** Hauptsitzung (Fortsetzung derselben Sitzung, die den Briefkasten
geleert und Privat-Brains Mycel-Fenster zweisprachig gemacht hat).
**Repos:** Mein-Rezeptbuch · Muttis-Rezeptbuch · Mein-Mixarium.

---

## Auftrag

Klaus, wörtlich: *„nachdem wir Private Brain mit Übersetzung ausgestattet haben,
müssen wir noch zwingend das Rezept Export, äh, dass es die Spuren trägt. Denn
wenn ich es wieder einfüge, soll die Spur mit drin bleiben."*

Und sein eigener Einwand, unmittelbar danach: *„Ach so, stopp, es gibt ein
Problem und zwar, wenn wir das hinzufügen machen, dann haben wir zwei Spuren
drin … Das könnte einen Konflikt geben."*

Nach der Abwägung hat er **Weg 3** gewählt — Herkunft ans Rezept als gedeckelte
Kette — und die zwei übrigen Punkte dazu: die mitgebrachte Kennung nicht mehr
wegwerfen, und der Import soll sagen, was unsichtbar mitkommt.

---

## Was gebaut wurde

### 1 · Identität und Herkunft sind getrennt

| | was es ist | wie viele |
|---|---|---|
| **die Spore** | *wer bin ich* — die Identität der App in diesem Browser | **genau eine** je App, kommt **nie** aus einer Datei |
| **die Herkunft** | *woher kommt dieses Rezept* | eine je Rezept, wird nur **angehängt** |

Damit ist Klaus' Konflikt aufgelöst: hundert Rezepte dürfen hundert Herkünfte
tragen. Eine Import-Datei ist `untrusted external data` und darf nie ändern, wer
die App ist.

### 2 · `r.uid` — die Identität, die Umbenennen übersteht

Der Hinzufügen-Weg warf bis dahin die mitgebrachte Nummer weg und verglich am
**Namen**:

```js
newRecs.forEach((r,i)=>{r.id=maxId+i+1;});   // die mitgebrachte Nummer flog weg
```

Daraus kamen beide Fehler, die Klaus erlebt hat — ein umbenanntes Rezept kam als
zweites dazu, und zwei verschiedene Rezepte mit gleichem Namen ließen das zweite
still verschwinden. `r.id` bleibt die **lokale** Nummer, `r.uid` ist die
**Identität**. Dateien ohne `uid` (alles vor v10) gehen weiter den alten
Namens-Weg.

### 3 · Die Kette

`r.herkunft` ist eine Liste von Stationen `{k, d}` — gedeckelt auf **5**
(`HERK_MAX`), keine Wiederholung direkt hintereinander, `herkGekuerzt: true` wo
gekürzt wurde. Trifft dasselbe Rezept auf zwei Wegen ein, **gewinnt die längere
Kette** — sie weiß mehr.

⚠ **Nur die Kennung, nie ein Gerätename.** Ein Gerätename ist ein Hinweis auf
eine **Person** und wandert mit jedem Rezept zu Fremden (NETZWEIT § 2).
`lokal-…` ist kein Beweis, sondern eine ehrliche Marke dieses Browsers — und sie
sagt es im Namen.

### 4 · Der Import sagt, was unsichtbar mitkommt

> ℹ️ **2** ohne Kategorie — sie erscheinen unter „Ohne Kategorie"

Dazu bringt `onMerge` fehlende **Ordner** aus der Datei mit; vorhandene werden
nicht überschrieben. Ohne das zeigte ein mitgebrachtes Rezept auf einen Ordner,
den es hier nicht gibt — Klaus' „unsichtbarer Ordner", an seiner Quelle statt an
der Anzeige.

---

## Die zwei Befunde, die über den Auftrag hinausreichen

### ⚠ Eine halbe Reparatur war schon gemergt

Es gibt **zwei** Import-Wege: `importData(e)` nennt seine Liste `imported`, der
Tresor-Weg `importJsonFromVault(input)` nennt sie `recs`. Die Bestandsaufnahme
suchte nach der ersten Form und fand die zweite nie — in Mein Rezeptbuch war
damit eine **halbe** Reparatur gemergt, und der Tresor-Weg verglich weiter am
Namen. Dort liegen Klaus' Sicherungen.

Aufgefallen beim Nachziehen nach Muttis Rezeptbuch, wo `existingNames`
**zweimal** stand. *„0 Treffer" ist erst dann eine Aussage, wenn man belegt hat,
dass man überall hineingesehen hat.*

Repariert an der **Ursache**: das Zusammenführen steht an **einer** Stelle
(`_zusammenfuehren`), beide Wege gehen hindurch, ein Wächter besteht darauf, dass
der Dubletten-Riegel genau einmal im Code steht. Vier Gegenprobe-Fälle wurden
dabei zu toten Ankern und wurden nachgezogen — die Anker-Prüfung meldete sie als
**tot**, nicht als „nicht gefangen", und das weist in die entgegengesetzte
Richtung.

### ⚠ Eine Lehre wandert beim Kopieren nicht mit

Die nach Mixarium kopierte Gegenprobe prüfte ihre Ausgangslage mit
`grep -q "0 ROT"` — und **„10 ROT" enthält „0 ROT"**. Genau dieser Fehler steht
in Mixariums eigener `CLAUDE.md` schon einmal aufgeschrieben, nur eine Datei
weiter. Gemessen wird jetzt die ganze Schlusszeile.

### ⚠ Drei blinde Stellen, alle von der Gegenprobe entlarvt, keine im Code

| Was | warum es nichts maß |
|---|---|
| „der eigene Ordner wurde nicht überschrieben" | las `find(id).name` — `concat` legt den fremden **daneben**, `find` trifft den ersten. Gemessen wird jetzt zusätzlich, dass keine Kennung doppelt vorkommt |
| „die mitgebrachte Kennung bleibt" | **gab es gar nicht.** Der Fall rutschte durch, weil die Zusicherung fehlte |
| zwei Sabotagen trafen den **Nachbarn** | sabotiert wird jetzt `_knotenKennung()` selbst, damit nur der gemeinte Wächter fallen kann |

---

## Gemessen

| App | Probe | Gegenprobe | Bestands-Probe | Merge |
|---|---|---|---|---|
| Mein-Rezeptbuch | **37 grün · 0 ROT** | 12 · 0 · 0 · 0 | `smoke_kategorien` 145 grün | `e3a2dc8`, `3538f13` |
| Muttis-Rezeptbuch | **37 grün · 0 ROT** | 12 · 0 · 0 · 0 | `smoke_kategorien` 141 grün | `55a609e` |
| Mein-Mixarium | **37 grün · 0 ROT** | 12 · 0 · 0 · 0 | `smoke_kategorien` 150 grün | `c94d3ba` (PR #228) |

Alle Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe. In Mixarium
zusätzlich `md5sum` von `index.html` und QC-Datei vor und nach jedem Lauf gleich
(`a9ed2fd53aec970356d2d015acbde30b`); der Baum war nach jeder Gegenprobe sauber,
und die Dateiliste des Commits wurde vor dem Festschreiben angesehen.

**Auf `main` nachgezählt statt der Merge-Meldung geglaubt:** in Mixarium tragen
QC-Datei und `index.html` auf `origin/main` je 3 × `_zusammenfuehren(`, 1 ×
`_KNOTEN_KEY='mxknoten9m'`, 1 × `knoten:_knotenKennung()` und 8 × `impOhneKat:'`;
beide Proben liegen unter `tests/`.

---

## Was offen ist

**Klaus' Browser-Sichttest an allen drei Apps.** Er läuft nach dem Merge auf der
Live-Seite und ist nicht ersetzbar.

**Der Export ist auf `version: 10` gehoben** und trägt zusätzlich `knoten`.
Ältere Fassungen lesen die Datei weiter (die neuen Felder stören sie nicht), aber
sie **nutzen** sie nicht. *„Von dir zu Mutti und zurück" trägt erst, wenn beide
Bücher es können* — seit heute können es alle drei.

**Vier Funde außerhalb des Auftrags** stehen ab heute in
[`docs/PFLEGE-LISTE.md`](../../PFLEGE-LISTE.md) statt in diesem Protokoll:
Privat-Brains abbrechendes `npm test` · BookLedgerPros ungeklärte −0,001525 ·
Rezeptbuch und Mixarium, die Sage noch als `verified-spore` führen ·
family-projects flatterndes `smoke_hintergrund`.

⚠ **Die Datei ist der eigentliche Ertrag dieses Abschnitts.** Die Tafel
*„mitziehen heißt nicht abbrechen — ein echter Fund wird aufgeschrieben und
eingereiht"* stand längst da; es fehlte der **Ort**, an dem eingereiht wird.
Klaus hat das benannt: *„du findest immer wieder neue Punkte, das sollten wir
dann angehen in einer Pflegesitzung. Merk dir die Punkte, schreib sie auf."*
