# 2026-09-18 · Einladungsseite: der Rand rechts und die Stufen in den Verläufen

**Rolle:** Bau-Sitzung · **Zweig:** `claude/sage-protokoll-image-sequence-4s744y`
**Auftrag (Klaus, zwei Sachen):**

> „Man sieht aber auf der rechten Seite immer einen Rand bei Vollbildansicht.
> Das soll vermieden werden … Die Bewegung soll bleiben, es soll nichts
> verändert werden. Höchstens die Größe über den Bildschirmrand hinausgehen
> für die Hintergrundbilder."
>
> „Genauso bei einigen Bildern die Farbverläufe … sind sehr deutlich als
> Vektor zu sehen … nicht flüssig."

Mitten in der Sitzung kam ein dritter Befund dazu:

> „Es sieht so aus, als wenn auch die feststehenden Container, wo die Texte
> drin sind und den Schatten haben, dass die nicht mittig sind. Also
> linksbündig oder zu weit nach links oder zu klein."

---

## Was gemessen wurde

### 1 · Der Streifen rechts

Neun Bildschirmfotos (2560x1440) ausgewertet, je die größte Stelle rechts, an
der noch Inhalt steht:

| | Kante | Streifen |
|---|---|---|
| sieben von neun | **2526** von 2560 | **33 Geräte-Pixel** |
| zwei | 2559 | 0 |

Der Übergang ist eine harte Stufe (`… 29 · 24 · 4 · 4 · 4 …`), kein Verlauf.
Der Streifen ist in zwei Aufnahmen mit verschiedenem Inhalt und verschiedener
Scroll-Lage **Wert für Wert derselbe**, und seine Helligkeit ist nicht flach,
sondern in der Mitte am höchsten — ein senkrechter Verlauf. Genau diesen
Verlauf hat das fest stehende `#stage-canvas`, das als einziges `100vw` breit
ist.

**Befund:** der Streifen ist die Rinne des Rollbalkens; was darin steht, ist
das Canvas. Die Sektionen werden in `clientWidth` gelegt, also ohne die Rinne.

Die Werkzeugleiste des Browsers reicht dagegen bis x=2558 — ein Fensterrand
oder der Schreibtisch dahinter ist damit ausgeschlossen.

### 2 · Der Überhang der Kamerafahrten

Aus den Keyframes gerechnet:

| Fahrt | knappster Überhang vorher | nachher |
|---|---|---|
| `scene1-camera` | 0,22 % (rechts) | 3,01 % |
| `scene5-breath` | 0,22 % (links) | 3,01 % |
| `scene6-drift` | 1,15 % (unten) | 3,01 % |

0,22 % sind bei 2560 px 5,6 Pixel.

### 3 · Die Mittigkeit (Klaus' dritter Befund)

Vier Fensterbreiten gemessen — `.inner` ist an jeder **exakt mittig**. Links
steht die Textspalte, weil Sektion 4 drei Spalten hat
(`Marginalie 0,8fr | Text 2,2fr | Sternenfeld 1,4fr`):

| Fenster | Textspalte (Mitte) | Fenstermitte | Versatz |
|---|---|---|---|
| 1440 | 648 | 720 | 72 px links |
| 1969 | 913 | 985 | 72 px links |

Dazu lässt `align-items: start` das Sternenfeld (336 px hoch) oben stehen,
während die Textspalte 528 px lang ist — die untere Hälfte der rechten Spalte
ist leer. **Nichts daran ist kaputt; deshalb ist nichts daran geändert.**

---

## ⚠ DIE BERICHTIGUNG — der erste Bau hat es verschlimmert

Klaus nach dem Sichttest: *„jetzt noch schlimmer als vorher … alles zu weit
nach links gerückt."* Er hatte recht.

| `documentElement.scrollWidth` gegen `clientWidth` | |
|---|---|
| vor dem ersten Bau | **7,3 %** |
| nach dem ersten Bau | **10,6 %** |
| nach der Berichtigung | **0,0 %** |

**Der Mechanismus:** eine Kamerafahrt vergrößert ihre Schicht und schiebt
sie; was über die Sektion hinausragt, zählt als **Scroll-Überlauf des
Dokuments**. Ein Browser, der eine zu breite Seite ins Fenster einpasst,
zeichnet alles kleiner und linksbündig — rechts bleibt ein Streifen. Klaus'
Inhaltskante in Sektion 1 lag bei **90,2 %**, und `100/110,6 = 90,4 %`.

Ich hatte den Überhang von 0,22 % auf 3,01 % gehoben — **die Abhilfe gegen
den Haarstrich war die Ursache des Streifens.**

⚠ **KEINE PROBE KONNTE ES SEHEN.** Headless Chromium passt eine zu breite
Seite nie ins Fenster ein. Der Streifen ist dort unsichtbar, mit und ohne
Fehler. Gefunden hat es Klaus' Sichttest und danach eine Zahl, nach der
vorher niemand gefragt hatte.

### Klaus' eigener Vorschlag war der bessere Bau

> *„Das ist ja nicht schlimm, dass die Seite breiter ist als das Fenster, wenn
> das der Hintergrundeffekt ist … er müsste eher sogar noch breiter sein."*
> *„Kannst du es nicht auch so bauen, dass sie sich automatisch an die
> Bildschirmbreite anpassen … dass sie sich dann breiter ziehen."*

| | |
|---|---|
| die **Schicht** darf und soll breiter sein | `inset: -8%` — in Prozent, passt sich jeder Bildschirmbreite an |
| die **Seite** darf es nicht | `overflow: clip` an den drei Foto-Sektionen |

Die Kamerafahrten stehen deshalb wieder auf ihren **ursprünglichen Werten**.
Der Spielraum gehört in den Kasten, nicht in die Bewegung: ein größeres
`scale` zoomt das Bild, um ein Randproblem zu lösen, und hält nur, solange
niemand an den Keyframes dreht.

⚠ **Nicht an die Tür-Sektion** — sie trägt eine sticky-Bühne.

### Der Deckungs-Wächter misst jetzt die Matrix

Die erste Fassung rechnete aus den Keyframes und hätte nach der Berichtigung
0,22 % gemeldet, während wirklich 8,8 % gedeckt sind. Gemessen wird jetzt der
gezeichnete Kasten (Matrix aus `getComputedStyle` an der laufenden Animation,
plus Größe und Lage), fünf Punkte je Fahrt: **8,83 · 8,62 · 9,59 %**.

⚠ **Und ein Gegenprobe-Fall war danach selbst überholt** und rutschte durch:
er setzte EINE Fahrt auf `scale(1.0)` — seit der Spielraum am Kasten steht,
nimmt das der Schicht ihren Überhang nicht. Gemeldet vom Lauf, nicht vom
Nachdenken.

## Was gebaut wurde

| Datei | Was |
|---|---|
| `docs/einladung/index.html` | Rinne abgestellt · Voll-Schichten verlängert · Tür-Bühne `max(100%, 100vw)` · Überhang der drei Fahrten erhöht · ausgerollte Rampe (`--rampe-ab`) · Korn-Schicht (`.korn`) |
| `docs/einladung/_smoke.mjs` | elf neue Wächter |
| `docs/einladung/_gegenprobe.sh` | **neu** — zehn Fälle, jeder muss GENAU seinen Wächter umwerfen |

---

## Geprüft

```bash
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node docs/einladung/_smoke.mjs
bash docs/einladung/_gegenprobe.sh
npm test
```

**20 grün · 0 ROT** · Gegenprobe **10 gefangen · 0 durchgerutscht · 0 aus
falschem Grund · 0 tote Anker**. Beide Rückgabewerte direkt gelesen, nicht
hinter einer Pipe. Der Baum trug vor und nach dem Lauf nur die eigenen Dateien.

---

## Was NICHT gemessen ist — benannte Grenzen

1. **Ob der Streifen auf Klaus' Gerät wirklich weg ist.** Headless Chromium hat
   Überlagerungs-Rollbalken; die Rinne ist dort immer 0, mit und ohne Regel.
   Gemessen ist, dass die Regel steht und umfallen kann. **Sein Sichttest ist
   nicht ersetzbar.**
2. **Ob die Stufen in den Verläufen verschwinden.** Banding hängt an der
   Farbtiefe des Schirms. Gemessen ist, dass das Korn da ist, obenauf liegt,
   mischt, Rauschen trägt und keine Klicks abfängt.
3. **`.vignette` und `.korn` stehen fest** — ihr umgebender Kasten IST das
   Fenster, die gestellte Rinne erreicht sie nicht. Für sie gilt dieselbe eine
   Zeile; gemessen ist sie nicht.
4. **Der Preis der abgestellten Rinne:** keine Anzeige mehr, wie weit man auf
   acht Bildschirmlängen gekommen ist. Ein eigener schmaler Fortschritts-Strich
   wäre der Ersatz — nicht gebaut, weil Klaus gesagt hat, sonst solle sich
   nichts ändern.

---

## Zwei eigene Fehler, beide im Prüfwerkzeug

- **Die Gegenprobe log über ihren eigenen Rückgabewert.** Das `trap … EXIT`
  gibt den Wert von `rm -rf` zurück, und der ist immer 0 — gemeldet wurde
  Erfolg, während ein Anker tot war. Jetzt steht ein ausdrückliches `exit`
  dahinter.
- **Ein Anker traf zweimal.** `right: min(0px, calc(100% - 100vw))` steht in
  der Voll-Schicht-Regel **und** in `.korn`.

Und **zwei eigene Wächter waren blind:** `keineRinne` misst in dieser Umgebung
nichts (daneben steht jetzt `rinneAbgestellt`), und `vollbildFest` war trivial
grün — er ist raus und steht als benannte Grenze da.

Dazu eine falsche Zwischenmessung: ein erster Kanten-Sucher meldete 94,8 %
(133 px). Das war die Vignette, die zum Rand hin dunkler wird — der Schwellwert
schlug im Verlauf an. *Ein Schwellwert, der auf einen Verlauf trifft, misst den
Verlauf.*

---

## Nächste Schritte

1. **Klaus' Sichttest am Tablet** — ist der Streifen weg, sind die Stufen weg?
   Nur er kann das sehen.
2. Bleibt der Streifen: dann ist es nicht die Rinne. Dann braucht es EINE Zahl
   von seinem Gerät (`innerWidth`, `clientWidth`, `devicePixelRatio`), und die
   Frage ist in einem Griff beantwortet statt in neun Bildschirmfotos.
3. Wenn er die leere rechte Spalte in Sektion 4 stört: Sternenfeld
   `position: sticky` mitlaufen lassen — eine Zeile. **Seine Entscheidung.**
