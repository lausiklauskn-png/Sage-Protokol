# Abschlussbrief — 2026-09-16 · mit Stundennachweis

**Rolle:** Hauptsitzung. **Depots:** Sage-Protokol · Privat-Brain ·
Mein-Rezeptbuch · Muttis-Rezeptbuch · Mein-Mixarium · Kimhub (Forschung).

---

## 1 · Was diese Sitzung getan hat

Vier Aufträge, in der Reihenfolge, in der Klaus sie gestellt hat.

### Der Briefkasten war voll und trotzdem ohne offene Bitte

**40 ungelesene Stände**, der älteste aus dem Juli — das sah alarmierend aus.
Gemessen: **keine einzige Bitte war unerfüllt.** Zwei Identitäts-Bitten waren
von der Neu-Signier-Welle der Gegenstellen drei Tage später selbst überholt, und
family-projects Quittung lag seit dem 27.06. beantwortet im eigenen Postfach.
Offen war nur die **Zahl**: alle sieben liegen jetzt über 0.80, fünf von sieben
reproduzieren den Registerwert exakt.

⚠ **Und die Zahl misst die ABGELEGTE Spore, nicht die im Raum.** Wer den
Netz-Auftritt beurteilt, braucht einen Mycel-Mitschnitt.

### Das Mycel-Fenster spricht Deutsch und Englisch

98 Einträge, schlüssellos — der deutsche Satz IST der Schlüssel. **Das Siegel
war schon zweisprachig** (byte-1:1 aus Sage); offen war nur das app-eigene
Fenster.

Der Fund, auf den es ankam: **das Panel wird beim LADEN gebaut, nicht beim
Öffnen.** Mit `<html lang="en">` danach stand es vollständig auf Deutsch,
obwohl Tabelle und `T()` tadellos waren. Ein Wächter auf die Tabelle hätte das
nie gesehen — er liest den Quelltext, hier ging es um den Schirm.

### Die Spur bleibt am Rezept

Klaus' Einwand — *„dann haben wir zwei Spuren drin"* — löst sich an einer
Unterscheidung auf: **eine Spore je App** (wer bin ich, kommt nie aus einer
Datei) gegen **eine Herkunft je Rezept** (woher kommt das hier, wird nur
angehängt). Dazu `r.uid` als Identität, die Umbenennen und Gerätewechsel
übersteht.

**Die eigentliche Ursache seiner Doppel lag woanders als vermutet:** der Import
warf die mitgebrachte Nummer weg und verglich am **Namen**.

### Der Einstellungs-Bildschirm sprach stellenweise nur Deutsch

Klaus mit Bild aus der englischen Oberfläche. Übersetzt wird nur, was eine `id`
trägt **und** in der Namensliste des Setzers steht — fehlt eines, bleibt die
Zeile **still deutsch**. Gemessen: **13 · 5 · 14** Beschriftungen ohne
Schlüssel in den drei Apps. Alle nachgetragen, in acht Sprachen.

---

## 2 · Die zwei Befunde, die über ihren Auftrag hinausreichen

**Beide sind halbe Reparaturen, die schon gemergt waren.**

| | |
|---|---|
| **Zwei Import-Wege** | `importData` nennt seine Liste `imported`, der Tresor-Weg `importJsonFromVault` nennt sie `recs`. Die Bestandsaufnahme suchte nach der ersten Form und fand die zweite **nie** — der Tresor-Weg verglich weiter am Namen, und dort liegen Klaus' Sicherungen. Aufgefallen erst beim Nachziehen in die Schwester-App |
| **Ein geerbter Riegel** | die kopierte Gegenprobe prüfte ihre Ausgangslage mit `grep -q "0 ROT"` — und „10 ROT" enthält „0 ROT". Genau dieser Fehler stand in der Ziel-App **schon aufgeschrieben**, nur eine Datei weiter |

> **Eine Lehre, die nur in der Doku steht, wandert beim Kopieren nicht mit.**

Dazu ein dritter, an der eigenen Messung: mein erster Sprach-Wächter fragte nach
dem **Namen** der Kennung statt nach der **Wirkung** und meldete drei Zeilen als
„nicht übersetzt", die sehr wohl übersetzt werden. *Ein Wächter auf den Namen
misst nicht, was ein Nutzer erlebt — und er meldet in die falsche Richtung.*

---

## 3 · Gemessen

| Depot | Proben | Gegenprobe |
|---|---|---|
| Sage-Protokol | `run_alle` **107 grün · 0 rot · 0 nicht lauffähig** | — |
| Privat-Brain | `e2e-netwidget-sprache` **17 grün** | **9 · 0 · 0 · 0** |
| Mein-Rezeptbuch | 37 + 145 + 41 = **223 grün** | 12 + 7 = **19 · 0 · 0 · 0** |
| Muttis-Rezeptbuch | 37 + 141 + 17 = **195 grün** | 12 + 7 = **19 · 0 · 0 · 0** |
| Mein-Mixarium | 37 + 150 + 50 = **237 grün** | 12 + 7 = **19 · 0 · 0 · 0** |
| **zusammen** | **779 Zusicherungen, 0 ROT** | **66 Fälle, 66 gefangen, 0 durchgerutscht** |

Alle Rückgabewerte **direkt** gelesen, nicht hinter einer Pipe. Mixariums
`md5sum` von `index.html` und QC-Datei vor und nach jedem Lauf gleich. Jeder
Merge auf `main` **nachgezählt**, nicht der Meldung geglaubt.

⚠ **Die Zahlen davor bleiben daneben stehen, weil sie die Funde gemacht haben:**
die Herkunfts-Gegenprobe meldete zuerst 11 gefangen · 1 toter Anker, der
Sprach-Wächter zuerst 29 grün · 2 ROT, seine Gegenprobe 6 gefangen · 1 aus
falschem Grund.

---

## 4 · Stundennachweis 2026-09-16

**Gemessen aus der Git-Historie über alle 21 Depots**, entdoppelt, in Klaus'
Zeit (MESZ). Eine Pause von mehr als 45 Minuten trennt zwei Blöcke.

| Block | von | bis | Dauer | Commits | Depots |
|---|---|---|---|---|---|
| 1 | 01:14 | 02:20 | **1 h 06 min** | 26 | 19 |
| 2 | 10:38 | 15:20 | **4 h 42 min** | 17 | 3 |
| 3 | 16:16 | 23:54 | **7 h 38 min** | 117 | 21 |
| | | | **13 h 26 min** | **160** | **21** |

Spanne von der ersten bis zur letzten Spur: **22 h 40 min** (01:14–23:54),
davon **9 h 14 min** Pausen über 45 Minuten.

### ⚠ Was diese Zahl IST — und was sie nicht ist

**Sie ist eine Untergrenze der dokumentierten Arbeit an den Depots.** Das ist
dieselbe Größe, die `Kimhub/tools/zeiten-sammeln.mjs` „Bauzeit" nennt, nur über
alle Depots statt über eines.

- **Nicht enthalten:** Lesen, Nachdenken, Verwerfen und Absprechen **vor** dem
  ersten Commit eines Blocks. Das hinterlässt keine Spur und wird deshalb nicht
  mitgezählt. Wer mehr behauptet, schätzt.
- **Voll enthalten:** jede Pause **unter** 45 Minuten innerhalb eines Blocks.
- **Die 45 Minuten sind gesetzt, nicht gemessen.** Sie trennen die drei Blöcke
  des Tages sauber; eine andere Schwelle ergäbe eine andere Zahl. Sie steht hier,
  damit jeder nachrechnen kann.

⚠ **UND ES IST NICHT DASSELBE WIE KLAUS' ARBEITSZEIT.** Beide überschneiden
sich, sind aber zwei verschiedene Größen: die Commits markieren, wann die
**Sitzung** etwas abgelegt hat. Klaus' eigene Zeit misst die **Stechuhr** in
Kimhub — und die liegt im `localStorage` seines Browsers. **Eine Sitzung kann
sie nicht drücken**; das ist dieselbe Grenze wie „ein Browser kommt nicht an die
Git-Historie" (NETZWEIT § 6b), nur andersherum.

**Was möglich ist und hiermit getan wurde:** die Untergrenze aus der Historie
jederzeit neu ausrechnen und mit Datum hinschreiben. **Was nicht möglich ist:**
seine Anwesenheit belegen, ohne dass er sie selbst gestempelt hat.

### Die drei Blöcke, dem Inhalt nach

| Block | woran gearbeitet wurde |
|---|---|
| 1 · 01:14–02:20 | Wortkarten-Umzug in vier Trägern, Andock-Wizard auf Englisch, Cache-Bump-Riegel |
| 2 · 10:38–15:20 | Kategorien in den drei Rezept-Apps (zuordnen, umsortieren, Sammel-Eimer) |
| 3 · 16:16–23:54 | Spore-Rollout über 20 Träger · Modul 15 auf Englisch · Herkunfts-Riegel · **diese Sitzung ab 21:50** |

**Diese Sitzung für sich: 21:50–23:54 = 2 h 04 min**, 124 Minuten — so steht sie
auch im Forschungsdatensatz.

---

## 5 · Die Forschung

Der Eintrag liegt in **`Kimhub/forschung/sitzungen.json`** (PR #184, gemergt):
13 Befunde, Herkunft `hinsehen` 6 · `regel` 4 · `gegenprobe` 2 · `klaus` 1,
**neun davon an einem blinden Wächter**.

**Der Datensatz steht damit bei 23 Sitzungen und 353 Befunden — die in
`forschung/METHODE.md` § 6 festgelegte Auswertungs-Schwelle von zwanzig ist
überschritten.** Gegen die zwei vorregistrierten Vorhersagen gerechnet:

| | Vorhersage | gemessen | |
|---|---|---|---|
| **V1** | Anteil `regel` liegt **unter** `hinsehen` | 15,0 % gegen 43,6 % | **trifft zu** |
| **V2** | Anteil blinder Wächter fällt **nicht** unter 10 % | **43,9 %** | **trifft zu** |

Herkunft aller 353 Befunde: `hinsehen` 154 · `gegenprobe` 87 · `klaus` 59 ·
`regel` 53.

⚠ **Das ist die Rechnung, nicht die Auswertung.** Ob daraus ein Ergebnis wird
und wie es formuliert ist, entscheidet Klaus — eine Sitzung, die das allein
erklärt, nimmt der Untersuchung ihre wichtigste Aussage vorweg.

---

## 6 · Was offen ist

**Klaus' Browser-Sichttest** an allen drei Rezept-Apps und an Privat-Brain. Er
läuft nach dem Merge auf der Live-Seite und ist nicht ersetzbar.

Die vier Punkte in **[`docs/PFLEGE-LISTE.md`](../../PFLEGE-LISTE.md)**, dazu
seit heute die anstehende Auswertung der Forschungs-Vorhersagen.

### ⚠ Eine Entscheidung, die benannt gehört: kein zweiter SIGNAL-Bump

`sbkim/SIGNAL.json` steht bei **seq 91** — gesetzt beim ersten Abschluss dieser
Sitzung (Rezept-Herkunft). Die Arbeit danach (Einstellungs-Übersetzung,
Forschungs-Eintrag) betrifft **keine Gegenstelle**: sie ändert weder ein Modul,
noch eine Spore, noch einen Vertrag. Ein zweiter Bump wäre ein Stand, den sieben
Knoten lesen müssten, ohne dass für sie etwas folgt — *ein Postfach, das bei
jeder Änderung klingelt, liest irgendwann niemand mehr.* Deshalb **nicht**
gebumpt, und deshalb steht es hier.
