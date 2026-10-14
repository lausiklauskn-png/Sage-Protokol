# PULS-Auslagerung 2026-10-14 — „Der Rand rechts war die Rollbalken-Rinne — und die Verläufe bekommen Korn“

**Ausgelagert am 2026-10-14**, weil `docs/PULS.md` über der 3000-Zeilen-Grenze stand
(3065 Zeilen vor dem Eintrag „Prüfung vor dem KI-Richter, Reinigung vor der Texterkennung“). Die Schutz-Klausel im Kopf von PULS.md
verlangt **auslagern statt kürzen**: hier steht der Eintrag **wortwörtlich**.

---

## 2026-09-18 · Der Rand rechts war die Rollbalken-Rinne — und die Verläufe bekommen Korn

**Klaus:** *„Man sieht aber auf der rechten Seite immer einen Rand bei
Vollbildansicht … Die Bewegung soll bleiben, es soll nichts verändert werden.
Höchstens die Größe über den Bildschirmrand hinausgehen."* Und: *„bei einigen
Bildern die Farbverläufe … sind sehr deutlich als Vektor zu sehen … nicht
flüssig."*

### Der Streifen ist gemessen, nicht geraten

Neun Bildschirmfotos (2560x1440), je die größte Stelle rechts, an der noch
Inhalt steht:

| | Kante | Streifen |
|---|---|---|
| sieben von neun Aufnahmen | **2526** von 2560 | **33 Geräte-Pixel** |
| zwei Aufnahmen | 2559 | 0 (dort reicht eine helle Stelle bis an den Rand) |

Der Übergang ist eine **harte Stufe**, kein Verlauf: `… 29 · 24 · 4 · 4 · 4 …`.
Drei Sachen sagen zusammen, was der Streifen ist:

- er ist in zwei Aufnahmen mit **verschiedenem Inhalt und verschiedener
  Scroll-Lage** Wert für Wert derselbe;
- seine Helligkeit ist **nicht flach, sondern in der Mitte am höchsten**
  (1·3·2·3 … 4·4·4 … 3·2) — ein senkrechter Verlauf;
- genau diesen Verlauf hat das fest stehende `#stage-canvas`, das als einziges
  `100vw` breit ist und deshalb bis an den Fensterrand reicht.

**Der Streifen ist die Rinne des Rollbalkens, und was darin steht, ist das
Canvas.** Die Sektionen werden in `clientWidth` gelegt — ohne die Rinne. Das
Foto hört auf, der Verlauf des Canvas läuft weiter: die Kante.

⚠ **DIE WERKZEUGLEISTE DES BROWSERS REICHT BIS GANZ RECHTS** (gemessen bei
y=10…160: bis x=2558 gleichmäßig). Der Streifen beginnt erst im Seiten-Bereich.
Damit ist ein Fensterrand oder der Schreibtisch dahinter ausgeschlossen.

⚠ **UND EINE ZWISCHENMESSUNG WAR FALSCH.** Ein erster Lauf meldete die Kante
bei 94,8 % (133 px). Das war die **Vignette**, die zum Rand hin dunkler wird —
mein Kanten-Sucher nahm „weicht um mehr als 2 ab" und schlug im Verlauf an. Erst
die Suche nach der harten Stufe gab die Zahl, die in allen Aufnahmen gleich ist.
*Ein Schwellwert, der auf einen Verlauf trifft, misst den Verlauf.*

### ⚠ EINE ABSOLUT GESETZTE SCHICHT KANN DIE RINNE NICHT FÜLLEN

Sie wird am Rand des Scroll-Bereichs abgeschnitten; nur fest stehende Schichten
werden dort gezeichnet — deshalb sieht man dort das Canvas und nicht das Foto.
Die Rinne breiter zu überdecken hilft also **nicht**. Sie muss weg:

```css
html { scrollbar-width: none; }             /* Firefox + Chrome ab 121 */
html::-webkit-scrollbar { width: 0; height: 0; }
```

⚠ **WAS ES KOSTET, und es wird nicht verschwiegen:** mit der Rinne geht die
Anzeige, wie weit man auf acht Bildschirmlängen gekommen ist. Gescrollt wird
weiter mit Rad, Finger, Tastatur und Trackpad. Ein eigener schmaler
Fortschritts-Strich am Rand wäre der Ersatz — **nicht gebaut**, weil Klaus
ausdrücklich gesagt hat, es solle sich sonst nichts ändern.

Zweiter Riegel für Browser, die die Rinne trotzdem stehen lassen: jede
Voll-Schicht wird um genau diese Rinne verlängert
(`right: min(0px, calc(100% - 100vw))`), die Tür-Bühne über ihre Breite
(`width: max(100%, 100vw)`), weil `right` an einem sticky-Kasten nicht greift.

### Die Kamerafahrten standen auf 0,22 % Überhang

Aus den Keyframes gerechnet, nicht aus dem Bild geraten:

| Fahrt | knappster Überhang vorher | nachher |
|---|---|---|
| `scene1-camera` | **0,22 %** (rechts) | **3,01 %** |
| `scene5-breath` | **0,22 %** (links) | **3,01 %** |
| `scene6-drift` | **1,15 %** (unten) | **3,01 %** |

0,22 % sind bei 2560 px **5,6 Pixel** — davon legt Teilpixel-Rundung einen
Haarstrich frei. Die Fahrten sind unverändert: gleiche Richtung, gleiche Dauer,
gleiche Kurve, nur um 0,04–0,06 vergrößert. Genau das, was Klaus erlaubt hat.

### Die Stufen in den Verläufen

Ein Bildschirm kennt je Kanal 256 Werte; eine lange, sehr dunkle Rampe über
12vh hat auf 200 Pixeln vielleicht acht davon — und jeder Sprung ist eine
Kante. Zwei Griffe, und sie wirken an verschiedenen Stellen:

- die **Rampe** der Sektion-Übergänge ist ausgerollt: 12 Stützstellen statt 2,
  unten dicht, oben weit. Das hilft **nur** den CSS-Verläufen dieser Seite.
- ein feines **Korn** über allem (`.korn`, SVG-Rauschen als Daten-Adresse,
  5,5 % über `mix-blend-mode: overlay`). Das hilft **auch** in den Fotos
  selbst, deren Verläufe hier niemand ändern kann.

⚠ **BENANNTE GRENZE:** dass die Stufen auf Klaus' Schirm wirklich verschwinden,
ist **nicht gemessen** — Banding hängt an der Farbtiefe des Geräts. Gemessen
ist, dass das Korn da ist, obenauf liegt, mischt, Rauschen trägt und keine
Klicks abfängt.

### ⚠ UND DANN WAR ES SCHLIMMER — der erste Bau hat die Ursache VERGRÖSSERT

Klaus nach dem Sichttest: *„jetzt noch schlimmer als vorher … es sieht immer
noch so aus, als wenn alles zu weit nach links gerückt ist. Sowohl die festen
Container als auch die beweglichen."*

**Er hatte recht, und der Fehler war meiner.** Gemessen bei drei
Fensterbreiten, `documentElement.scrollWidth` gegen `clientWidth`:

| | Seite breiter als das Fenster |
|---|---|
| vor dem ersten Bau | **7,3 %** |
| nach dem ersten Bau | **10,6 %** |
| nach der Berichtigung | **0,0 %** |

**Der Mechanismus, und er ist der eigentliche Befund dieser Sitzung.** Eine
Kamerafahrt vergrößert ihre Schicht und schiebt sie; was dabei über die
Sektion hinausragt, zählt als **Scroll-Überlauf des Dokuments**. Ein Browser,
der eine zu breite Seite ins Fenster einpasst, zeichnet dann **alles kleiner
und linksbündig** — und rechts bleibt ein Streifen. Genau das hatte Klaus
fotografiert.

**Und die Zahl passt:** seine Inhaltskante in Sektion 1 lag bei **90,2 %** der
Bildbreite, und `100 / 110,6 = 90,4 %`.

⚠ **ICH HABE DEN ÜBERHANG VON 0,22 % AUF 3,01 % GEHOBEN — und damit den
Überlauf von 7,3 % auf 10,6 %.** Die Abhilfe gegen den Haarstrich war die
Ursache des Streifens. Beide Male ging es um dieselbe Zahl, nur in
verschiedene Richtungen gelesen.

⚠ **UND KEINE PROBE KONNTE ES SEHEN.** Headless Chromium passt eine zu breite
Seite **nie** ins Fenster ein — es zeichnet sie einfach und clippt. Der
Streifen ist dort unsichtbar, mit und ohne Fehler. Gefunden hat es Klaus'
Sichttest und danach eine Zahl, nach der vorher niemand gefragt hatte.
*Der Sichttest ist nicht ersetzbar, und diesmal hat er es bewiesen.*

### Die Berichtigung — Klaus' eigener Vorschlag war der bessere Bau

Er schrieb: *„Das ist ja nicht schlimm, dass die Seite breiter ist als das
Fenster, wenn das der Hintergrundeffekt ist … er müsste eher sogar noch
breiter sein."* Und: *„Kannst du es nicht auch so bauen, dass sie sich
automatisch an die Bildschirmbreite anpassen … dass sie sich dann breiter
ziehen."*

**Beides stimmt, und beides ist jetzt so gebaut** — nur an zwei verschiedenen
Stellen, und der Unterschied ist die ganze Sache:

| | |
|---|---|
| die **Schicht** darf und soll breiter sein als das Fenster | `inset: -8%` — auf jeder Seite 8 % Spielraum, in Prozent, passt sich also jeder Bildschirmbreite von selbst an |
| die **Seite** darf es nicht | `overflow: clip` an den drei Foto-Sektionen schneidet ab, was übersteht |

⚠ **DER SPIELRAUM GEHÖRT IN DEN KASTEN, NICHT IN DIE BEWEGUNG.** Ein größeres
`scale` schafft denselben Spielraum, zoomt dabei aber das Bild — es ändert die
Bildwirkung, um ein Randproblem zu lösen. Und es hält nur, solange niemand an
den Keyframes dreht. Deshalb stehen die **Kamerafahrten wieder auf ihren
ursprünglichen Werten** (1.08 → 1.04 usw.); die Bewegung ist wieder genau die,
die Klaus kannte.

⚠ **NICHT AN DIE TÜR-SEKTION.** Sie trägt eine `position: sticky`-Bühne, und
`overflow` an einem Vorfahren macht ihn zum Scroll-Bereich — dann pinnt sie
dort, wo niemand es erwartet. Dieselbe Falle, die am `<body>` schon einmal
aufgeschrieben ist. Eigener Wächter, eigener Gegenprobe-Fall.

### Der Deckungs-Wächter misst jetzt die MATRIX, nicht die Keyframes

Die erste Fassung rechnete den Überhang aus den Keyframe-Werten. Das war
richtig, solange der Spielraum dort stand — mit `inset: -8%` weiß eine solche
Rechnung nichts von dem Spielraum und hätte 0,22 % gemeldet, während wirklich
8,8 % gedeckt sind.

Gemessen wird jetzt der **gezeichnete** Kasten: `getComputedStyle` liefert an
der laufenden Animation die Matrix, dazu kommen Größe und Lage der Schicht,
und daraus die vier Kanten. Fünf Punkte je Fahrt.

| Fahrt | Deckung an der knappsten Stelle |
|---|---|
| Sektion 1 | **8,83 %** |
| Sektion 5 | **8,62 %** |
| Sektion 6 | **9,59 %** |

### ⚠ Und ein Gegenprobe-Fall war nach der Berichtigung selbst überholt

„Die Fahrten haben gar keinen Überhang mehr" setzte **eine** Fahrt auf
`scale(1.0)`. Solange der Spielraum in der Bewegung stand, nahm das der
Schicht ihren Überhang; seit er am Kasten steht, nicht mehr. Der Fall
rutschte durch — **gemeldet vom Lauf, nicht vom Nachdenken.** Er nimmt jetzt
Spielraum und Bewegung auf einmal.

### Klaus' zweiter Befund: „die Container sind nicht mittig"

**Gemessen bei vier Fensterbreiten — `.inner` ist an jeder exakt mittig**
(Mitte des Kastens = Mitte des Fensters, auf den Pixel). Links steht die
**Textspalte**, und das ist die Drei-Spalten-Anlage von Sektion 4
(`Marginalie 0,8fr | Text 2,2fr | Sternenfeld 1,4fr`):

| Fenster | Textspalte | Fenstermitte | Versatz |
|---|---|---|---|
| 1440 | 384…912 (Mitte 648) | 720 | 72 px links |
| 1969 | 649…1177 (Mitte 913) | 985 | 72 px links |

Dazu: `align-items: start` lässt das Sternenfeld (336 px hoch) oben stehen,
während die Textspalte 528 px lang ist — **die untere Hälfte der rechten
Spalte ist leer**. Genau die Stelle, die Klaus fotografiert hat.

**Nichts daran ist kaputt, und deshalb ist nichts daran geändert.** Der
Vorschlag steht in der Chat-Antwort: das Sternenfeld `position: sticky`
mitlaufen lassen, dann ist die rechte Spalte nie leer. Das ist eine Änderung
an der Komposition — die entscheidet Klaus, nicht die Sitzung.

### Geprüft

```bash
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node docs/einladung/_smoke.mjs
bash docs/einladung/_gegenprobe.sh
```

Zuletzt gemessen (2026-09-18): **20 grün · 0 ROT** · Gegenprobe **10 gefangen ·
0 durchgerutscht · 0 aus falschem Grund · 0 tote Anker**. Beide Rückgabewerte
**direkt** gelesen, nicht hinter einer Pipe.

⚠ **Die Zahlen davor bleiben daneben stehen, weil sie die Funde gemacht
haben:** der erste Gegenprobe-Lauf meldete **9 gefangen · 1 toter Anker** —
`right: min(0px, calc(100% - 100vw))` steht **zweimal** (Voll-Schicht-Regel und
`.korn`), der Anker traf also nicht eindeutig. Und er meldete dabei
**Rückgabewert 0**: das `trap … EXIT` gibt den Wert von `rm -rf` zurück, und
der ist immer 0. *Eine Gegenprobe, die ihren eigenen Rückgabewert überschreibt,
meldet Erfolg über sich selbst.* Beides berichtigt.

⚠ **UND ZWEI EIGENE WÄCHTER WAREN BLIND.** `keineRinne` misst in dieser
Umgebung **nichts** — headless Chromium hat Überlagerungs-Rollbalken, die Rinne
ist dort immer 0, mit und ohne Regel. Daneben steht jetzt `rinneAbgestellt`,
das die Regel selbst misst und umfallen kann. Und `vollbildFest` (`.vignette`,
`.korn`) war trivial grün: ihr umgebender Kasten IST das Fenster, die gestellte
Rinne erreicht sie nicht. Er ist raus und steht als **benannte Grenze** da,
statt als grüner Haken.

### Im Forschungsdatensatz stehen ZWEI Einträge zu diesem Tag

`Kimhub/forschung/sitzungen.json` — `2026-09-18-einladung-rand-und-verlaeufe`
(die Runde mit der falschen Diagnose) und
`2026-09-18-einladung-ueberlauf-berichtigung` (diese hier).

⚠ **Der erste wird NICHT berichtigt, und das ist der Punkt.** Er trägt den
Befund, aus dem diese Runde entstand; ihn im Nachhinein richtigzustellen hieße,
den Befund durch seine Reparatur zu ersetzen. Von den elf Befunden des zweiten
tragen **vier** die Herkunft `klaus` — sein Sichttest hat die falsche Diagnose
umgeworfen, **und der Bau-Vorschlag kam von ihm**. Datensatz danach:
**33 Sitzungen · 430 Befunde · 174 an blinden Wächtern (40,5 %)**.

---
