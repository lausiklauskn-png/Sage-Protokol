# Übergabeprotokoll 2026-08-24 · Die Historie und die Gedankenstriche

**Zweig:** `claude/research-funding-paper-delivery-vuppnj`
**Rolle:** Fortsetzung der Antragsmappen-Arbeit.
**Aufträge:** drei an einem Tag, alle von Klaus, alle im Chat gesprochen.

> **Nachgetragen.** Die Arbeit dieser Sitzung ist als PR #913 gemergt und steht
> in `docs/PULS.md` unter „Die Historie ausgelesen, Gedankenstriche raus". Das
> Übergabeprotokoll fehlte, obwohl der Anker es unter § „Pflicht am Sitzungsende"
> als Punkt 2 verlangt. Es hier nachzutragen kostet nichts; es zu unterlassen
> hätte die Kette an genau der Stelle reißen lassen, an der eine Folge-Sitzung
> nachsieht.

---

## 0 · Der Befund, der über allem steht: zwei Sitzungen liefen parallel

Während diese Sitzung die Historie baute, arbeitete eine **zweite** Sitzung
Klaus' gelbe Markierungen ab (PR #915). Beide wussten voneinander nichts.

Es ist gutgegangen, weil sie verschiedene Dateien anfassten. Aber es war nah
daran, teuer zu werden: Der Zweig dieser Sitzung war von `761174e` abgezweigt,
und nachdem `main` auf `7b1b775` weitergerückt war, zeigte
`git diff --stat origin/main origin/<zweig>` **11 Dateien, 284 Zusätze, 1.321
Löschungen**. Ein Merge hätte die Arbeit der Nachbarsitzung zurückgedreht,
einschließlich eines ganzen neuen Wächters (`tests/smoke_lizenz_konsistenz.mjs`).

**Gemerkt beim Nachsehen nach dem Push, nicht davor.** Genau die Falle, vor der
`docs/LEHREN.md` § 1 und der Skill `veroeffentlichung-pruefen` warnen. Behoben,
indem der Zweig frisch von `main` aufgesetzt wurde; er trägt seitdem nur noch
Zusätze.

**Die Lehre, wörtlich:** eine Zahl aus `git diff --stat` gegen `origin/main`
ist keine Formalie am Ende, sondern die einzige Stelle, an der eine
Parallel-Sitzung überhaupt sichtbar wird. Ein Zweig, der Löschungen zeigt, die
man nicht selbst vorgenommen hat, dreht fremde Arbeit zurück.

---

## 1 · Gedankenstriche

Klaus: *„Nimm bitte alle Gedankenstriche von dir heraus. […] Es gibt Sätze."*

**613 Striche aufgelöst**, in elf Dateien, mit `tools/gedankenstriche-aufloesen.mjs`.
Entschieden wird an dem, was **rechts** vom Strich steht: Konjunktion wird
Komma, Hauptsatz-Anfang wird Punkt mit Großschreibung, Aufzählung wird
Doppelpunkt.

**Geprüft wird nicht „es steht kein Strich mehr da".** Das wäre mit einem
`sed`-Befehl zu haben und bewiese nichts über den Text danach. Geprüft wird die
**Wortfolge** vorher und nachher, samt der Auflage, dass jede geänderte
Großschreibung eine bewusste ist.

### Drei eigene Fehler dabei, jeder von einer Prüfung gefunden

| Fehler | Wer ihn fand |
|---|---|
| Die erste Fassung verdoppelte ein Wort („ist Gegenstand ist Gegenstand") | die Wortfolgen-Prüfung |
| Die Aufräum-Regel `/ {2,}/g` fraß die **Einrückung** von Fortsetzungszeilen, wodurch vier Zeilen aus der Antragsmappe fielen | die Vollständigkeits-Prüfung der Mappe |
| Das Werkzeug lief über die **Byte-Kopien** aus Kimhub mit | das Nachsehen im eigenen Diff |

Der dritte ist der lehrreichste. `docs/werkstatt/WERKSTATTREGELN.md` und
`grundsaetze.md` tragen ihre Quell-Prüfsummen in `werkstatt/README.md`. Wer sie
hier anfasst, lässt die Momentaufnahme still vom Original weglaufen und macht
die Prüfsummen falsch. Zurückgenommen mit `git checkout --`. **Dort bleiben die
Striche, bis sie in Kimhub geändert und neu kopiert werden**, und dieser Satz
steht im Brief, damit die nächste Sitzung ihn nicht für Nachlässigkeit hält.

Die zweite Ausnahme sind zwei **wörtliche Zitate** dieser Regeln. Wer die
Zeichensetzung eines Zitats anpasst, fälscht es.

---

## 2 · Klaus' Markierungen

Hundert Stück, aus der Mappe ausgelesen: 44 grün, 40 gelb, 16 rot. Vollständig
mit seinen Notizen in `docs/sessions/2026-08-24_markierungen-klaus.md`.

**Alle sechzehn roten erledigt.** Elf davon waren in Paper A die
Gedankenstriche selbst, also derselbe Auftrag von der anderen Seite. Die
vierzig gelben blieben liegen, weil Klaus sagte: *„die roten schon mal raus,
über gelb reden wir später."* Sie wurden am selben Tag von der Nachbarsitzung
abgewogen, mit dem Ergebnis, dass nichts gestrichen wurde.

### Was an der Markierungs-Oberfläche zuerst nicht funktionierte

Klaus: *„Ich hab die Regeln nicht verstanden. […] Du hast da stehen nur Zahlen,
deswegen konnt ich das nicht erkennen, was Du damit meinst."*

Zwei Ursachen, beide meine: Die Bedeutung stand nur im `title`-Attribut, und
auf einem Tablet gibt es kein Überfahren mit der Maus. Die Farben waren als
**Emoji** gesetzt, und fehlt die Schrift, steht dort gar nichts. Behoben mit
Wörtern auf den Knöpfen („bleibt", „du entscheidest", „kann weg"), einem in CSS
gezeichneten Farbtupfer statt eines Emojis, und einer sichtbaren Legende.

**Merksatz:** eine Erklärung, die ein Gerät des Nutzers nicht anzeigen kann, ist
keine Erklärung.

---

## 3 · Die Historie

Klaus: *„Nimm bitte eine vollständige Dokumentation der gesamten History vor.
[…] Wichtig ist, dass wenn Du Zeiten findest, schreib Zeiten auf."* Dazu die
Auflage *„Kopieren nur, klonen nichts, mach nichts zusätzlich dazu."*

### Der Befund, der die ganze Messung fast wertlos gemacht hätte

**Achtzehn der dreiunddreißig Klone waren flach** und trugen nur die letzten
fünfzig Commits; mehrere zeigten denselben Tag als ersten und letzten. Eine
Aussage über „fünf Monate Zusammenarbeit" auf so einem Klon wäre keine Messung
gewesen, sondern eine Behauptung mit Zahlen davor. Erst `git fetch --unshallow`
über alle Depots, dann gemessen. Der Bestand wuchs dabei von rund 4.750 auf
5.823 Commits, und der erste Tag rückte auf den 10.03.2026 zurück.

| | |
|---|---|
| Commits | **5.823** |
| Depots · Zweige | 33 · 1.388 |
| Tage mit Arbeit | **128**, vom 10.03. bis 24.08.2026 |
| Zeilen dazu · entfernt | 1.852.315 · 292.930 |
| Merges | 396 |
| Commits nie auf `main` | **1.662**, die Sackgassen |

**`docs/historie/historie.json` liegt im Depot**, weil der nächste Container
wieder flach anfängt. Wer die Daten neu holen will, unshallowt vorher, sonst
schrumpft die Historie still auf fünfzig Commits je Depot, und die Zahlen sehen
danach genauso überzeugend aus wie vorher.

### Was der Bericht zeigt

`docs/historie/historie.html`, 7,8 MB: jeder Commit, Tag für Tag, mit Uhrzeit,
filterbar nach sieben Marken. Dazu die vier Rollen, die Klaus ausdrücklich
verlangt hat (*„auch die Rolleverteilung […] mit Erklärung wer welche Aufgabe
hatte und wie er sie erfüllt hat und mit welchem Erfolg"*), jede mit Aufgabe,
Erfüllung, **einer gemessenen Zahl und der Grenze dieser Zahl**.

### Drei Ehrlichkeits-Sätze, und warum sie bewacht werden

Der Bericht soll einem Gutachter vorgelegt werden. Ein Dokument, das seine
eigenen Grenzen verschweigt, ist im Antragswesen gefährlicher als eines, das
eine Zahl weniger nennt. Deshalb steht im Bericht selbst, dass die Marken
**Untergrenzen** sind und keine Vollerhebung, dass die Tages-Spanne eine Spanne
ist und keine Arbeitszeit, und dass achtzehn Klone flach waren. **Drei der neun
Gegenproben-Fälle zielen genau auf diese Sätze**, nicht auf Funktion: wer einen
davon herausnimmt, muss auffallen.

### Zwei blinde Wächter, beide von der Gegenprobe entlarvt

**Der Sackgassen-Wächter fand `data-main="nein"` in der eigenen CSS-Regel**
(`li.c[data-main="nein"]{…}`) und war deshalb wahr, als kein einziger Commit
mehr so gekennzeichnet war. Er zählt jetzt gegen die gemessene Zahl.

**Ein Gegenproben-Fall selbst war schlecht gebaut:** er fasste nur eine von zwei
Stellen an, die Zusicherung hielt weiter, und er rutschte zu Recht durch.
Benannt statt versteckt, dann repariert.

### Der Fehler, der die Daten fast unbrauchbar gemacht hätte

`git log --shortstat` hängt seine Statistik-Zeile **hinter** die formatierte
Ausgabe. Stand der Trenner am Ende des Formats, landete diese Zeile am Kopf des
nächsten Abschnitts: jeder Commit außer dem letzten je Depot trug „2 files c"
als Kennung, und alle Zeilenzahlen waren null. Behoben, indem der Trenner an den
**Anfang** des Formats rückte. Der Wächter „jeder Commit trägt eine echte
Kennung" prüft seitdem gegen `/^[0-9a-f]{9}$/`.

---

## 4 · Was gemessen wurde

```
node tests/run_alle.mjs              87 grün, 0 rot, 0 nicht lauffähig
node tests/gegenprobe_antragsmappe   32 von 32 gefangen
node tests/gegenprobe_historie        9 von  9 gefangen
Gedankenstriche im neuen Brief        0, nachgezählt
Zweig gegen main                      nur Zusätze, keine Löschung
```

**Nicht gemessen:** Klaus' Sichttest am Tablet. Besonders das Ziehen mit dem
Finger und ob Androids eigene Kopieren-Leiste der Farbleiste in die Quere kommt.
Headless ist grün, das ersetzt ihn nicht.

---

## 5 · Was offen bleibt

- **`docs/PULS.md` steht bei 2.985 Zeilen.** Fünfzehn unter der Grenze. Die
  nächste Sitzung lagert aus, **bevor** sie schreibt.
- Der **Werkzeug-Widerspruch in Paper A**. Vier Stellen sagen im Präsens, die
  Rollen hätten keine Werkzeuge; Kimhubs Verfassung sagt seit dem 2026-08-23 das
  Gegenteil. Klaus' Entscheidung, und sie gehört getroffen, **bevor** die Papers
  eine Zenodo-Nummer bekommen: eine Zenodo-Fassung bleibt stehen.
- Die **Striche in den zwei Byte-Kopien**, die nur über Kimhub zu lösen sind.
- Die **Chat-Archive**, die Klaus hat und die nicht in Git stehen. Die Historie
  misst, was committet wurde, nicht was besprochen wurde.
- Klaus' eigene Punkte: die Anmeldung nach § 5c, Steuerberater, ELSTER-Zertifikat,
  ORCID und Zenodo.

**Der Brief für die nächste Sitzung:**
`docs/sessions/BRIEF_nach_historie_und_gelber_runde.md`
