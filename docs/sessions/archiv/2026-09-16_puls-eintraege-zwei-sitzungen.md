# PULS-Einträge zweier Sitzungen vom 2026-09-16 — ausgelagert am 2026-09-18

**Wortlaut unverändert.** Diese zwei Einträge standen bis zum 2026-09-18 in
`docs/PULS.md` in voller Länge (188 Zeilen). Die Datei stand bei 3.117 von
3.000 — **ausgelagert, nicht gekürzt**; die Grenze wird nicht herabgesetzt.

---

## 2026-09-16 · Die Spur bleibt am Rezept — und die Kennung überlebt das Umbenennen

**Sitzungs-Rolle:** Hauptsitzung (Fortsetzung). **Repos:** Mein-Rezeptbuch,
Muttis-Rezeptbuch, Mein-Mixarium.

**Klaus' Bitte:** *„das Rezept Export, dass es die Spuren trägt. Denn wenn ich es
wieder einfüge, soll die Spur mit drin bleiben."* — und sein eigener Einwand
unmittelbar danach: *„wenn wir das hinzufügen machen, dann haben wir zwei Spuren
drin … das könnte einen Konflikt geben."*

### Der Einwand war richtig, und er löst sich an einer Unterscheidung auf

| | was es ist | wie viele |
|---|---|---|
| **die Spore** | *wer bin ich* — die Identität der App in diesem Browser | **genau eine** je App, kommt **nie** aus einer Datei |
| **die Herkunft** | *woher kommt dieses Rezept* | eine je Rezept, wird nur **angehängt** |

Ein Rezept trägt deshalb keine Spore, sondern einen Vermerk (`r.herkunft`).
Hundert Rezepte dürfen hundert Herkünfte tragen — das ist Auskunft, keine
Kollision. Eine Import-Datei ist `untrusted external data`; sie darf nie ändern,
**wer diese App ist**.

### Und die eigentliche Ursache lag woanders als vermutet

Klaus' doppelte Rezepte kamen nicht von der fehlenden Spur, sondern aus dem
Import: er **warf die mitgebrachte Nummer weg** und verglich am **Namen**.

| | vorher | jetzt |
|---|---|---|
| ein Rezept umbenannt, alte Datei importiert | kam als **zweites** dazu | an `r.uid` erkannt — **kein Doppel** |
| zwei verschiedene Rezepte, gleicher Name | das zweite verschwand **still** | beide landen |
| Datei ohne `uid` (alles vor v10) | — | geht weiter den alten Namens-Weg |

`r.id` bleibt die lokale Nummer, `r.uid` ist die Identität des Rezepts. Zwei
Dinge, zwei Felder. Die Kette `r.herkunft` ist auf **5** Stationen gedeckelt
(`HERK_MAX`), ohne Wiederholung direkt hintereinander, mit `herkGekuerzt: true`
wo gekürzt wurde; trifft dasselbe Rezept auf zwei Wegen ein, gewinnt die längere
Kette.

⚠ **NUR DIE KENNUNG, NIE EIN GERÄTENAME.** Ein Gerätename ist ein Hinweis auf
eine **Person** und wandert mit jedem Rezept zu Fremden. NETZWEIT § 2, an einer
neuen Tür.

### ⚠ Der Befund, der eine halbe Reparatur war

Es gibt **zwei** Import-Wege: `importData(e)` nennt seine Liste `imported`, der
Tresor-Weg `importJsonFromVault(input)` nennt sie `recs`. Meine Bestandsaufnahme
suchte nach der ersten Form — **in Mein Rezeptbuch war damit eine halbe
Reparatur gemergt**, der Tresor-Weg verglich weiter am Namen, und genau dort
liegen Klaus' Sicherungen. Aufgefallen beim Nachziehen nach Muttis Rezeptbuch,
wo `existingNames` **zweimal** stand.

*„0 Treffer" ist erst dann eine Aussage, wenn man belegt hat, dass man überall
hineingesehen hat.* Repariert an der Ursache: das Zusammenführen steht jetzt an
**einer** Stelle (`_zusammenfuehren`), beide Wege gehen hindurch, und ein Wächter
besteht darauf, dass der Dubletten-Riegel **genau einmal** im Code steht.

### ⚠ Und derselbe geerbte Riegel log in Mixarium über sich selbst

Die nach Mixarium kopierte Gegenprobe prüfte ihre Ausgangslage mit
`grep -q "0 ROT"` — und **„10 ROT" enthält „0 ROT"**. Genau der Fehler, der in
Mixariums eigener `CLAUDE.md` schon einmal steht, nur eine Datei weiter.
**Eine Lehre, die nur in der Doku steht, wandert beim Kopieren nicht mit.**

### Gemessen

| App | Probe | Gegenprobe | Bestands-Probe |
|---|---|---|---|
| Mein-Rezeptbuch | **37 grün · 0 ROT** | 12 · 0 · 0 · 0 | `smoke_kategorien` 145 grün |
| Muttis-Rezeptbuch | **37 grün · 0 ROT** | 12 · 0 · 0 · 0 | `smoke_kategorien` 141 grün |
| Mein-Mixarium | **37 grün · 0 ROT** | 12 · 0 · 0 · 0 | `smoke_kategorien` 150 grün |

Alle Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe. In Mixarium
zusätzlich `md5sum` von `index.html` und QC-Datei vor und nach dem Lauf gleich
(`a9ed2fd5…`); der Baum war nach jeder Gegenprobe sauber. Gemergt und **auf
`main` nachgezählt**, nicht der Merge-Meldung geglaubt.

### Was offen ist

**Klaus' Browser-Sichttest an allen drei Apps** — er läuft nach dem Merge auf
der Live-Seite und ist nicht ersetzbar.

Vier Funde dieser Sitzung gehören **nicht** zu ihrem Auftrag und sind deshalb
nicht verfolgt, sondern eingereiht: Privat-Brains abbrechendes `npm test` ·
BookLedgerPros ungeklärte −0,001525 · Rezeptbuch und Mixarium, die Sage noch als
`verified-spore` führen · family-projects flatterndes `smoke_hintergrund`. Sie
stehen ab heute in **[`docs/PFLEGE-LISTE.md`](PFLEGE-LISTE.md)**.

⚠ **Die Datei ist neu, und ihr Anlass gehört dazu.** Klaus: *„du findest immer
wieder neue Punkte, das sollten wir dann angehen in einer Pflegesitzung. Merk
dir die Punkte, schreib sie auf."* Die Tafel „mitziehen heißt nicht abbrechen"
stand längst da — es fehlte der **Ort**, an dem eingereiht wird. Bis heute
landete ein solcher Fund im Übergabeprotokoll der Sitzung, die ihn gemacht hat,
also dort, wo ihn nur findet, wer schon davon weiß.

### Nächster sinnvoller Schritt

Das Thema der nächsten Sitzung nennt Klaus selbst; die groben Arbeiten an
Mixarium, beiden Rezeptbüchern, Siegel und Mycel sind mit dieser Sitzung
abgeschlossen.

---

## 2026-09-16 · Vierzig Stände ungelesen — und keine einzige offene Bitte darin

**Klaus:** *„dann mach jetzt den Briefkasten"*. Sieben Gegenstellen hingen mit ihren
Quittungen zurück, die älteste Schlagzeile stammte aus dem Juli.

| Gegenstelle | ihr `seq` | Sages `ack` | ungelesen |
|---|---|---|---|
| SB-KIMTool-Point | 36 | 24 | **12** |
| Mein-Rezeptbuch | 13 | 5 | 8 |
| Mein-Mixarium | 14 | 6 | 8 |
| BookLedgerPro | 23 | 18 | 5 |
| Family Projekt | 7 | 2 | 5 |
| Jasons-Tresor | 14 | 11 | 3 |
| Mein-Tresor | 17 | 14 | 3 |
| | | | **40** |

### Der Befund: die Post war alt, aber sie war nicht unerledigt

Vierzig Stände, und darin **drei** ausdrückliche Bitten an Sage. Alle drei waren bereits
erfüllt — zwei davon, ohne dass jemand etwas getan hätte:

| Bitte | Stand |
|---|---|
| Rezeptbuch (15.07.): „Inbox auf `MT1I-y89…` aktualisieren" | **überholt** — Sage führt `r-k1NyHe…`, die nodeId aus deren **eigenem** `main` |
| Mixarium (15.07.): „führt uns unter `dJ7H5Bpj…`" | **überholt** — Sage führt `6U3aniLM…`, ebenso |
| Family Projekt (27.06.): „schickt die Quittung zurück" | **lag seit dem 27.06. in unserem Postfach**; deren `ack[Sage]=43` belegt, dass sie gelesen wurde |

⚠ **DIE NEU-SIGNIER-WELLE HAT DIE BITTEN EINGEHOLT, DREI TAGE NACHDEM SIE GESCHRIEBEN
WURDEN.** Beide Knoten haben am 18.–20.07. erneut signiert und dabei wieder eine andere
nodeId bekommen. Eine Bitte, die man am 15.07. gelesen und befolgt hätte, wäre am 20.07.
falsch gewesen. **Gegengeprüft, nicht angenommen:** für alle sieben Gegenstellen wurde die
Live-nodeId aus deren `origin/main:sbkim/spore.json` gegen Sages `status.json` gehalten —
**siebenmal von sieben identisch.**

### Was wirklich offen war, war eine Zahl

Zwei Gegenstellen haben Sage im Juli auf `verified-spore` **herabgestuft** und dabei richtig
gerechnet: Rezeptbuch `0.792393`, Mixarium `0.766963` — beide unter 0.80, gemessen gegen die
damaligen Sporen. Gegen die **heute** committeten Sporen beider Seiten (384-dim, L2 = 1.000000,
Skalarprodukt, Modul 04):

| Gegenstelle | cos heute | Register-Spalte | Δ |
|---|---|---|---|
| SB-KIMTool-Point | 0.893026 | 0.893026 | ±0.000000 |
| Mein-Mixarium | **0.883142** | 0.817718 | **+0.065424** |
| Mein-Rezeptbuch | 0.874048 | 0.874048 | ±0.000000 |
| Jasons-Tresor | 0.872405 | 0.872405 | ±0.000000 |
| Mein-Tresor | 0.866101 | 0.866101 | ±0.000000 |
| BookLedgerPro | 0.853980 | 0.855505 | −0.001525 |
| Family Projekt | 0.842038 | 0.842038 | ±0.000000 |

**Fünf von sieben treffen die Register-Spalte auf sechs Stellen** — das ist die Gegenprobe
zur Messung, nicht ein Zufall. **Mixarium ist erklärt:** deren Spore wurde am 2026-09-10
ersetzt, die Commit-Nachricht nennt den Sprung selbst (0.826040 → 0.883142); 0.817718 ist
überholt, nicht falsch gewesen.

⚠ **BOOKLEDGERPROS −0.001525 IST NICHT ERKLÄRT.** Deren Spore ist seit dem 2026-06-21
unverändert; ob Sages eigener Vektor sich am 2026-09-10 bewegt hat, war **nicht zu belegen —
der Klon ist flach**, der Vorgänger-Stand liegt hinter der Abschneide-Grenze. Beide Zahlen
stehen deshalb nebeneinander im NETZ-STAND. *Eine geratene Ursache klingt genau wie eine
gemessene.*

### Was getan wurde

- **`ack` nachgezogen** für alle sieben (24→36 · 11→14 · 14→17 · 5→13 · 6→14 · 18→23 · 2→7).
- **Quittung in jedes der sieben eigenen Postfächer** — mit Inhalt, Folge und dem gemessenen
  Cosinus, und mit dem Satz, dass die Post bei uns lag. Bei Rezeptbuch und Mixarium steht die
  **Bitte um reziproke Neu-Einstufung** dabei.
- **NETZ-STAND.md** trägt den Befund samt Gegenprobe und der benannten Grenze.
- `sbkim/SIGNAL.json` seq 89 → **90**.

### Was offen bleibt

- **Der Netz-Stand ist an zwei Stellen asymmetrisch:** Rezeptbuch und Mixarium führen Sage
  weiter auf `verified-spore`. Die Rechnung ist symmetrisch, bei ihnen muss dasselbe
  herauskommen — **entschieden wird das dort, nicht hier.**
- **Sages eigene `ack` bei den Gegenstellen hängen ihrerseits zurück** (sie quittieren Sage bei
  seq 18–46, Sage steht bei 90). Das ist deren Seite; die Quittung liegt bereit.
- BookLedgerPros Abweichung — auflösbar mit `git fetch --unshallow`.

**Nächster sinnvoller Schritt:** Private Brain zweisprachig (Klaus' Entscheidung vom selben
Tag), danach der Rezept-Export mit Spore.

---
