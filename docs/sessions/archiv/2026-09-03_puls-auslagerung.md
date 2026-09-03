# Übergabeprotokoll · 2026-09-03 · PULS ausgelagert

**Rolle:** Bausitzung · **Zweig:** `claude/puls-auslagern-jvs1ko`
**Auftrag:** `docs/PULS.md` stand bei 2.927 von 3.000 Zeilen. Die Schutz-Klausel
im Kopf der Datei verlangt **auslagern statt kürzen** und verbietet ausdrücklich,
die Grenze herabzusetzen.

---

## Gemessen

| | |
|---|---|
| PULS vorher | **2.927** Zeilen |
| nach dem Auslagern | **2.079** Zeilen |
| ausgelagerter Wortlaut | **848** Zeilen in drei Archiv-Dateien |
| PULS mit dem neuen Eintrag | **2.163** Zeilen |
| Luft bis zur Grenze | **837** Zeilen |
| `npm test` | **92 Proben — 92 grün, 0 rot, 0 nicht lauffähig** |

Alle Zahlen mit `wc -l` bzw. dem eigenen Rückgabewert der Prüfung gemessen.
**Kein `| tail`** — die Falle ist in dieser Woche zweimal zugeschnappt, der
Rückgabewert von `npm test` wurde deshalb ohne Pipe abgefragt (`> datei; echo $?`).

## Was ausgelagert wurde

Alle Sitzungs-Einträge **außer dem obersten**. Der neueste bleibt in voller
Länge stehen — er trägt den Stand, den eine Folge-Sitzung zuerst braucht.

| Archiv-Datei | Einträge | Zeilen |
|---|---|---|
| `2026-09-03_puls-eintraege-zwei-sitzungen.md` | DOI ist da · PDFs für Zenodo | 250 |
| `2026-09-02_puls-eintrag-papers-feldbericht.md` | Papers als Feldbericht | 322 |
| `2026-08-26_puls-eintraege-drei-sitzungen.md` | Forschungsaufgaben · lückenlose Dokumentation · Unterlagen der Reihe nach | 306 |

Im PULS steht an jeder Stelle ein Zeiger-Block nach dem Muster der beiden
früheren Auslagerungen — Überschrift, Zeilenzahl, Weg zum Wortlaut. **Neu:**
zusätzlich der Weg zum **Übergabeprotokoll** derselben Sitzung. Für den Eintrag
„Forschungsaufgaben" steht dort ausdrücklich **keins** — er war die Fortsetzung
derselben Sitzung, sein Wortlaut im Archiv ist die einzige Fassung.

## Der Beweis, dass nichts fehlt — und die Gegenprobe dazu

Jede nicht-leere Zeile der alten Datei wurde gegen die neue Datei **und** gegen
die drei Archiv-Dateien geprüft: **0 Zeilen ohne Fundstelle.**

Dieselbe Prüfung, gegen ein um 50 Zeilen beschnittenes Archiv gefahren, meldet
**37** fehlende Zeilen. **Ohne diese Gegenprobe wäre „0 fehlt" nur ein grüner
Haken** — die Prüfung hätte auch dann 0 gemeldet, wenn sie gar nichts vergleicht.

## Zwei eigene Fehler, beide gemessen aufgefallen

**1 · Eine Zahl, die sich selbst verschiebt.** Der neue PULS-Eintrag nennt die
Zeilenzahl der Datei, in der er steht. Die Berichtigung der Tabelle fügte eine
Zeile hinzu — die genannte Zahl war im selben Moment falsch, in dem sie richtig
gemeint war. Zweimal nachgezogen, bis `wc -l` und der Text übereinstimmten. Eine
Zahl im Text, die von der Länge des Textes abhängt, ist nach jeder Änderung neu
zu messen; sie sieht sonst genauso gemessen aus wie vorher.

**2 · Ein Beispiel in Link-Form ist ein Link.** Der Hinweiskasten erklärte die
Lesart der Verweise an einem Beispiel und schrieb es dabei als
Markdown-Verweis — die eigene Verweis-Prüfung meldete es in **fünf** Dateien
als toten Link, zu Recht. Es ist derselbe Fehler, der netzweit schon
aufgeschrieben ist: *wer über einen kaputten Pfad schreibt, setzt ihn nicht in
Verweis-Form.* Das Beispiel ist jetzt beschrieben statt gesetzt. **Nicht der
Prüfer wurde nachsichtig gemacht.**

## Ein Befund, der auch die früheren Auslagerungen betrifft

Die Verweise **im ausgelagerten Wortlaut** waren relativ zu `docs/` geschrieben.
Aus `docs/sessions/archiv/` lösen sie nicht auf. Das gilt genauso für die beiden
**früheren** Auslagerungs-Dateien (2026-08-23, 2026-08-24) — dort steht der
Fehler seit dem 2026-09-02.

Die Links wurden **nicht umgeschrieben**: eine ausgelagerte Fassung, die sich
vom Original unterscheidet, ist keine Auslagerung mehr, und der Kopf jeder Datei
behauptet „Wortlaut unverändert". Stattdessen trägt jede der **fünf** Dateien
jetzt einen Kasten mit der Lesart (`docs/` davorstellen). Eine benannte Lücke
ist Arbeit, eine stille ist Schaden.

## Was NICHT geprüft ist

- **Kein Browser-Sichttest.** Diese Sitzung hat ausschließlich Markdown bewegt;
  `tests/manual_check.html` wurde nicht geöffnet und ist von dieser Änderung
  auch nicht berührt. Kein Modul-Code, kein `status.json`, kein Pie-Block —
  `scripts/update_puls_pie.py` meldet „bereits aktuell".
- Die Zeiger-Tabellen sind **nicht durchgeklickt**. Geprüft ist maschinell, dass
  jeder relative Verweis auf eine **existierende Datei** zeigt (0 tote Verweise,
  eigener Rückgabewert) — nicht, wie GitHub sie darstellt.
- **zenodo.org und doi.org sind aus dieser Umgebung gesperrt** (403). Die
  DOI-Nummern in den Zeiger-Tabellen sind aus dem ausgelagerten Text übernommen,
  **nicht aufgelöst**.
- **Kein Briefkasten-Signal.** Diese Sitzung hat keinen Andock-Bezug und meldet
  keiner Gegenstelle etwas; `sbkim/SIGNAL.json` bleibt unangetastet. Ein `seq`+1
  ohne Inhalt wäre ein Signal, hinter dem nichts steht.

## Offen (unverändert von der Vorsitzung)

- Im Zenodo-Eintrag von Paper A: der Doppel-Titel in einem Feld · `Version 1.0`
  statt `1.0`. Beides ändert Klaus selbst, ohne neue Version.
- Die **englische Fassung** von Paper A ist von niemandem außer der Sitzung vom
  2026-09-03 gegengelesen.
- **Kimhub PR #75** (Regel 6) liegt als Entwurf — 1093 grün, Gegenprobe
  421 gefangen / 0 durchgerutscht / 0 tote Anker. Klaus hat nicht entschieden.
