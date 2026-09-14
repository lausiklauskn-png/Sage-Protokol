# PULS-Auslagerung vom 2026-09-14 (vierte)

Beim Eintrag zum Sprach-Haken für Modul 16 und 17 stand `docs/PULS.md` bei
**2.965 von 3.000** Zeilen. Die Grenze wird **nicht herabgesetzt** und der
Wortlaut **nicht gekürzt** — die beiden ältesten Einträge in voller Länge ziehen
hierher um. Im PULS steht an ihrer Stelle ein Zeiger, damit eine stille Lücke
gar nicht erst entstehen kann.

---

## Stand 2026-09-11 (Haupt-Sitzung) · ✅ KEIN LINK FÜHRT MEHR NIRGENDWOHIN

Klaus hat drei Berichte seines **Auslieferungsprüfers** geschickt und die
Entscheidung überlassen, was davon zu beheben ist. Einer betraf diese Seite:

> „1 Sache an 3 Stellen · Dieser Link führt nirgendwohin · ein Knopf, der
> nichts tut" — die Marke oben links und zwei Platzhalter, die das Skript erst
> später füllt.

**Alle drei tragen jetzt ein echtes Ziel**, das auch ohne Skript etwas öffnet:

| | vorher | jetzt |
|---|---|---|
| Marke oben links | `href="#"` | `#screen-overview` — den Abschnitt gibt es wirklich |
| „PR auf status.json öffnen" | `href="#"` | die Datei auf GitHub; das Skript ergänzt die vorausgefüllte Nachricht |
| Komponenten-Karte | `href="#"` | `docs/components/` — das Skript schärft auf die Datei des Moduls |

⚠ **DAS `href` WEGZULASSEN WAR DER ZWEITE FEHLVERSUCH.** Der Prüfer meldet ein
`<a>` **ohne** href genauso wie eines mit `#`, und zu Recht: in der
ausgelieferten Datei führt beides nirgends hin. Eine Rückfalllinie, die
wirklich irgendwohin führt, ist keine Krücke — sie ist das, was ein Link sein
soll. Gemessen: der Prüfer meldet über diese Seite jetzt **0 Befunde**.

⚠ **UND MEIN WÄCHTER DAZU WAR ZWEIMAL BLIND.** Beim ersten Lauf fand er
`<a download>` — das steht als **Zeichenkette in einem `<script>`**, also im
Code, nicht im Markup; der Prüfer überspringt Skripte aus genau diesem Grund.
Beim zweiten hätte er seine eigenen Erklär-Kommentare mitgezählt, in denen
`href="#"` wörtlich steht. Er misst jetzt das Markup ohne Kommentare und ohne
Skripte. `tests/smoke_startseite_einstiege.mjs` (16 grün) ·
`tests/gegenprobe_startseite_einstiege.mjs` (**12 gefangen · 0
durchgerutscht**).

### Die eingebettete Mycel-Karte — der Ableiter-Wächter hat zum ersten Mal gefangen

Der gestern gebaute Wächter ist rot geworden, und zwar zu Recht: die Karte im
Quell-Repo ist seither zweimal gewandert (Transportknöpfe hin und zurück).
`node tools/mycelkarte-uebernehmen.mjs --schreiben` — nachgezogen, 24 grün.

**Das ist der Beleg, dass die Frage „ist die Kopie noch die Kopie?" trägt, wo
eine Liste von Fähigkeiten verrottet wäre.** Sie zählt nichts auf und altert
deshalb nicht.

### Was NICHT geändert wurde, und warum

Die beiden anderen Berichte betrafen **PWA Toolpoint**; dort lagen zwei der
vier Befundarten beim **Prüfer**, nicht an den Seiten (eigene Adresse einer
gespeicherten Datei · `cid:` aus einer `.mhtml`). Behoben in
`PWA-Toolpoint#105` und `Kimhub#182`. Unangetastet blieben `du@example.com`
(RFC-2606-Beispieladresse, korrekt) und die 27 App-Symbole des Marktplatzes
(sie gehören den gelisteten Apps; eine Kopie veraltet still).

### Nächster sinnvoller Schritt

Klaus' Browser-Sichttest auf der Sage-Page — und der Prüfer noch einmal über
`family-projekt.de`, jetzt mit der neuen Fassung: aus 12 Stellen sollten 0
werden.

---

## Stand 2026-09-10 (Haupt-Sitzung, Nacht) · ✅ DOPPELTE EINSTIEGE WEG, EINGEBETTETE KARTE NACHGEZOGEN

Drei Befunde von Klaus, alle drei am Bildschirm gefunden, keiner von einer Probe:

> *„im Sage Protokol gibt es zweimal Suche, ich würde das Flying widget
> wegnehmen und mycelkarte öffnen gibt es auch zweimal"* ·
> *„und die sage-Mycel karte hat nicht die selben funktionen wie die PWA App"* ·
> *„den Mitschnitt abspielen sollte eine Pausetaste welche anstelle der
> Playtaste auftaucht, darunter eine kleine Vor zurück und eine
> Schnellvorspulen taste und zurück"*

### 1 · Die doppelten Einstiege

Die Lasche am rechten Rand (`.tool-launcher`) trug 🔍 Suche und 📌 Pinnwand;
das Such-Werkzeug stand damit **zweimal** auf der Seite — einmal dort, einmal
als Karte in der PWA-Liste. „Mycel-Karte öffnen" stand unter der
**Modul**-Topologie und noch einmal unter der eingebetteten Live-Karte.

⚠ **DIE PINNWAND HING NUR AN DER LASCHE.** Wer sie ohne Ersatz entfernt, nimmt
ihr den einzigen Weg von dieser Seite aus — aufgeräumt und dabei eine stille
Sackgasse gebaut. Sie steht jetzt als Karte neben dem Such-Werkzeug, in
derselben Liste, in der man Werkzeuge sucht.

Von den zwei Karten-Knöpfen blieb der unter der **Einbettung**: dort ist die
Karte auch zu sehen, und ein Vollbild-Knopf bedeutet dort etwas. Der andere
stand unter der Modul-Topologie und zeigte auf etwas anderes als das, was
darüber steht.

Neu: `tests/smoke_startseite_einstiege.mjs` (12 grün) ·
`tests/gegenprobe_startseite_einstiege.mjs` (**9 gefangen · 0 durchgerutscht ·
0 aus dem falschen Grund · 0 tote Anker**). Der teuerste Fall darin ist nicht
die Dopplung, sondern das Zumauern: „die Pinnwand-Karte fällt weg".

### 2 · Die eingebettete Karte hing ZWEI Baustufen zurück

Gemessen, bevor gebaut wurde:

| | Kopie | PWA |
|---|---|---|
| Ein Tipp auf eine Pille | **0** | 1 |
| Doppeltipp auf eine Pille | 2 | 0 |
| `btnReplay` | **0** | 6 |
| `kkRaum` | **0** | 2 |

Kein Einzeltipp, keine Wiedergabe, keine Auskunft in der Knoten-Karte.
**Nichts schlug fehl — sie zeigte nur weniger.**

⚠ **UND `tests/smoke_mycelkarte_kopie.mjs` WAR DABEI GRÜN.** Er fragte nach
Fähigkeiten vom **11. August** und wusste von den neueren nichts. *Ein
Wächter, der nur den Stand seines Bautags kennt, verrottet mit der Kopie.*

Zwei Abhilfen, und die zweite ist die, die nicht altert:

- **`tools/mycelkarte-uebernehmen.mjs`** leitet die Kopie ab und legt genau die
  vier bewussten Abweichungen darauf (Titel · Kopfzeile · Rück-Link · kein
  Manifest/Worker). Findet ein Anker seine Stelle nicht, **schreibt es gar
  nichts**. *Eine Handarbeit neben einem Ableiter ist eine zweite Fassung, die
  auseinanderläuft* — genau das ist hier **zweimal** passiert (2026-08-11 und
  heute). Eine Regel, an die man sich erinnern muss, ist keine.
- Der Wächter fragt jetzt zusätzlich, ob die Kopie **genau das ist, was der
  Ableiter erzeugt**. Diese Frage zählt nichts auf und altert deshalb nicht.
  ⚠ Sie ist **nur messbar, wenn der Klon von `mycel-karte` daneben liegt**; in
  einem frischen Behälter sagt die Probe „nicht messbar" statt eines grünen
  Hakens. Ein Haken, der von seinem Fehlen nicht zu unterscheiden ist, ist
  keine Deckung.

⚠ **UND DIE NEUE GEGENPROBE HAT DREI BLINDE WÄCHTER ENTLARVT** — alle drei aus
demselben Grund: `schonGesehenAlt` **enthält** `schonGesehen`. Wer den Namen
ohne seine öffnende Klammer sucht, findet die umbenannte Fassung mit und bleibt
grün, während die Funktion weg ist. Dieselbe Familie wie `.gitignore` statt
`.git`. Betroffen waren `schonGesehen`, `fuelleRegister` und `zeigeSymbol`;
`schonGesehen` war seit dem 2026-08-11 blind.
`tests/gegenprobe_mycelkarte_kopie.mjs`: **12 gefangen · 0 durchgerutscht ·
0 aus dem falschen Grund · 0 tote Anker**.

### 3 · Pause, Schritt und Spulen (im Repo `mycel-karte`, gemergt als #25)

Aus **▶** wird **⏸ Pause**, sobald etwas läuft, darunter `⏪ ◀ Ereignis 42/191
▶ ⏩ ⏹`. Vier Dinge daran sind Absicht: **⏩ überspringt nichts** (sonst zeigte
die Karte weniger, als ihr Stand behauptet) · **⏪ bewegt das Band, nicht die
Karte** (sie ist ein Gedächtnis und vergisst nicht — das steht dran) · die
erfundene Kennung brauchte eine **dritte Stelle**, sonst frisst `schonGesehen`
jeden Rücklauf · **angehalten ist nicht beendet**, sonst schriebe der Rekorder
in der Pause wieder mit.
Gemessen im echten Browser: **31 grün · 0 ROT**, Gegenprobe **35/35**.

### Was offen bleibt

- **`docs/PULS.md` stand bei 3.077 von 3.000 Zeilen** — zwei Einträge vom
  2026-09-03/04 sind ins Archiv ausgelagert, **nicht gekürzt**; die Datei steht
  jetzt bei 2.939. Beim nächsten Mal wieder auslagern.
- Fünf Knoten liegen unter 0.80; Private Brain bei 0.800773.
- PWA-Toolpoints `smoke_pruefer.mjs` braucht seine eigene Kindprozess-Frist.

### Nächster sinnvoller Schritt

Klaus' Browser-Sichttest auf der Sage-Page: steht die Suche nur noch einmal da,
ist die Pinnwand über die PWA-Liste erreichbar, und trägt die eingebettete
Karte Pause/Schritt/Spulen?

