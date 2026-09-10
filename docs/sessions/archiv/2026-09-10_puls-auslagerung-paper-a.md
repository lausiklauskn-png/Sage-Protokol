# Zwei PULS-Einträge — ausgelagert am 2026-09-10

*Ausgelagerte PULS-Einträge — **Wortlaut unverändert**. Sie standen bis zum
2026-09-10 in [`docs/PULS.md`](../../PULS.md) und wurden von dort ins Archiv
verschoben, weil die Datei nach dem Eintrag jener Nacht bei **3.077 von 3.000
Zeilen** stand. Die Schutz-Klausel im Kopf der PULS verlangt **auslagern statt
kürzen** und verbietet, die Grenze herabzusetzen — hier ist nichts
zusammengefasst und nichts weggelassen. In der PULS steht an ihrer Stelle ein
Zeiger auf diese Datei.*

⚠ **Warum diese Datei das Datum ihrer AUSLAGERUNG trägt und nicht das der
Einträge:** eine Datei
[`2026-09-03_puls-eintraege-zwei-sitzungen.md`](2026-09-03_puls-eintraege-zwei-sitzungen.md)
gibt es hier bereits, aus einer früheren Auslagerung. Der erste Anlauf hat sie
gleichnamig überschrieben und damit einen Prüf-Beleg still ersetzt; das ist
zurückgeholt worden. **Ein Archiv, das sich selbst überschreibt, ist keins.**

> **Zu den Verweisen im Wortlaut:** die Links wurden geschrieben, als der Text
> in `docs/PULS.md` stand. Sie zeigen von hier aus eine Ebene zu tief.

---

## Stand 2026-09-03 (Bau) · 🗄 PULS ausgelagert — 2.927 → 2.079 Zeilen

**Übergabeprotokoll:** [`sessions/archiv/2026-09-03_puls-auslagerung.md`](sessions/archiv/2026-09-03_puls-auslagerung.md)

**Rolle:** Bausitzung. Auftrag: die Datei stand bei **2.927 von 3.000 Zeilen**,
die Schutz-Klausel im Kopf verlangt **auslagern statt kürzen** und verbietet,
die Grenze herabzusetzen. Kein Modul-Code angefasst, kein `status.json`, kein
Pie-Block.

| | |
|---|---|
| vorher | **2.927** Zeilen |
| nach dem Auslagern | **2.079** Zeilen |
| ausgelagert | **848** Zeilen Wortlaut in drei Archiv-Dateien |
| mit diesem Eintrag | **2.163** Zeilen — das ist der Stand, den `wc -l` meldet |
| Luft bis zur Grenze | **837** Zeilen |

### Was wohin ging

Ausgelagert wurden **alle Sitzungs-Einträge außer dem obersten**. Der neueste
bleibt in voller Länge stehen; er trägt den Stand, den eine Folge-Sitzung
zuerst braucht.

| Archiv-Datei | Einträge | Zeilen |
|---|---|---|
| `sessions/archiv/2026-09-03_puls-eintraege-zwei-sitzungen.md` | DOI ist da · PDFs für Zenodo | 250 |
| `sessions/archiv/2026-09-02_puls-eintrag-papers-feldbericht.md` | Papers als Feldbericht | 322 |
| `sessions/archiv/2026-08-26_puls-eintraege-drei-sitzungen.md` | Forschungsaufgaben · lückenlose Dokumentation · Unterlagen der Reihe nach | 306 |

Im PULS steht an jeder Stelle ein **Zeiger-Block** mit Überschrift, Zeilenzahl,
Weg zum Wortlaut und — neu gegenüber den früheren Auslagerungen — dem Weg zum
**Übergabeprotokoll** derselben Sitzung, wo es eines gibt.

### Gemessen, nicht behauptet: es fehlt nichts

Jede nicht-leere Zeile der alten Datei wurde gegen die neue Datei **und** gegen
die drei Archiv-Dateien geprüft: **0 Zeilen ohne Fundstelle.**

⚠ **Und die Prüfung ist nicht blind.** Dieselbe Prüfung, gegen ein um 50 Zeilen
beschnittenes Archiv gefahren, meldet **37** fehlende Zeilen. Ohne diese
Gegenprobe wäre „0 fehlt" nur ein grüner Haken — eine Prüfung, die dir recht
gibt, ist der Ort, an dem man am genauesten hinsieht.

### Ein Befund, der auch die früheren Auslagerungen betrifft

Die Verweise **im ausgelagerten Wortlaut** waren relativ zu `docs/` geschrieben.
Aus `docs/sessions/archiv/` lösen sie nicht auf — `](papers/REVISION_2026-09-02.md)`
zeigt dort ins Leere. Dasselbe gilt für die beiden **früheren** Auslagerungs-Dateien
(2026-08-23 und 2026-08-24); dort steht der Fehler seit dem 2026-09-02.

Die Links wurden **nicht umgeschrieben**: eine ausgelagerte Fassung, die sich vom
Original unterscheidet, wäre keine Auslagerung mehr, und der Kopf behauptet
„Wortlaut unverändert". Stattdessen trägt jede der **fünf** Dateien jetzt einen
Kasten, der die Lesart nennt (`docs/` davorstellen). **Eine benannte Lücke ist
Arbeit, eine stille ist Schaden.**

### Nicht geprüft

- **Kein Browser-Lauf.** Diese Sitzung hat nur Markdown bewegt; `tests/manual_check.html`
  wurde nicht geöffnet.
- Die Zeiger-Tabellen sind **nicht** durchgeklickt worden. Geprüft ist, dass jede
  verlinkte Datei existiert (siehe unten) — nicht, wie GitHub sie darstellt.
- **zenodo.org und doi.org sind aus dieser Umgebung gesperrt** (403). Die DOI-Nummern
  in den Zeiger-Tabellen sind aus dem ausgelagerten Text übernommen, **nicht aufgelöst**.

### Offen (unverändert von der Vorsitzung)

- Im Zenodo-Eintrag von Paper A: Doppel-Titel in einem Feld · `Version 1.0` statt
  `1.0`. Beides ändert Klaus selbst, ohne neue Version.
- Die **englische Fassung** von Paper A ist von niemandem außer der Sitzung vom
  2026-09-03 gegengelesen.
- **Kimhub PR #75** (Regel 6) liegt als Entwurf — 1093 grün, Gegenprobe 421/0/0.
  Klaus hat nicht entschieden.

### Nächster sinnvoller Schritt

Die Datei hat wieder Luft; das Auslagern ist bis auf Weiteres **kein** Thema.
Der nächste Griff ist eine der drei offenen Sachen oben — die Zenodo-Angaben
sind Klaus' Handgriff, das Gegenlesen der englischen Fassung ist der einzige
Punkt, an dem eine Sitzung etwas Nachprüfbares beitragen kann.

---


## Stand 2026-09-03 (Bau) · ✅ PAPER A IST VERÖFFENTLICHT

**Das zweite Papier dieses Depots ist draußen.** „Regeln und Grundsätze — zwei
Arten, ein KI-System zu lenken", beide Sprachfassungen in **einem** Zenodo-Eintrag.

```
Eintrag        zenodo.org/records/22286072
Versions-DOI   10.5281/zenodo.22286072     (steht in beiden PDFs)
Concept-DOI    10.5281/zenodo.22286071     (führt immer zur neuesten Fassung)
```

Vorabdruck, Version 1.0, offen zugänglich, CC BY 4.0. Verknüpft mit dem
SBKIM-Papier (`References` auf `10.5281/zenodo.22277738`).

### Der Concept-DOI ist um eins kleiner — zweimal gemessen, nicht zugesichert

Bei Paper A wie beim SBKIM-Papier liegt die Werknummer eins unter der
Fassungsnummer (22286071/22286072 und 22277737/22277738). **Zwei Fälle sind
eine Beobachtung, keine Regel von Zenodo.** Abgelesen wurde sie deshalb am Satz
„Alle Versionen zitieren?" im Kasten *Versionen*, nicht gerechnet.

Er existiert **auch bei einer einzigen Version**. Das ist sein Zweck: Verweise,
die heute gesetzt werden, sollen die nächste Fassung überstehen.

### Wo die Nummern jetzt stehen

| Stelle | Was |
|---|---|
| beide Markdown-Quellen | die `paper-doi`-Zeile, von dort in die HTML und ins PDF |
| `docs/papers/README.md` | eigener Abschnitt „Paper A", beide Nummern mit Rolle |
| `index.html`, Station 9 und 10 | im Erzähl-Text der Galerie |
| `docs/papers/ZENODO_WEG.md` | die Messung vom 03.09. |

### Gemessen nach der Änderung

| Probe | |
|---|---|
| `smoke_paper_a.mjs` | 26 grün, 0 rot |
| `smoke_paper_css.mjs` | 20 grün, 0 rot |
| `smoke_antragsmappe.mjs` | grün |
| `gegenprobe_paper_a.mjs` | 18 von 18 gefangen, 0 durchgerutscht, 0 tote Anker |
| Galerie headless (Chromium) | 10 Prüfungen grün, kein JS-Fehler, zehn Stationen |

⚠ Der erste Aufruf der Papier-Probe endete auf `… | tail -12; echo exit=$?` —
der gemeldete Rückgabewert war der von `tail`. Wiederholt ohne Pipe. Die Falle
steht seit Monaten in `CLAUDE.md` und ist trotzdem zugeschnappt.

### Offen: zwei Angaben im Zenodo-Eintrag

Beides ist ohne neue Version und ohne neue DOI änderbar (Zenodo sperrt die
Dateien, die Angaben nicht):

1. **Der Titel trägt beide Sprachen in einem Feld** — englischer und deutscher
   Titel hintereinander. Der deutsche gehört als *Translated title* darunter.
   So erscheint der Doppel-Titel in jeder Zitation.
2. **Das Versions-Feld enthält `Version 1.0`**, Zenodo setzt das Wort selbst
   davor. Angezeigt wird deshalb „Version Version 1.0".

### Nicht geprüft

Die englische Fassung ist von niemandem außer dieser Sitzung gegengelesen.
zenodo.org und doi.org sind aus dieser Umgebung gesperrt — jede Aussage über
die Eintragsseite stammt aus Klaus' Bildschirmfotos, nicht aus einem Abruf.

### Nächster sinnvoller Schritt

`docs/PULS.md` steht bei 2.927 von 3.000 Zeilen. **Die nächste Sitzung
lagert ins Archiv aus — auslagern, nicht kürzen** (Schutz-Klausel oben).

---

