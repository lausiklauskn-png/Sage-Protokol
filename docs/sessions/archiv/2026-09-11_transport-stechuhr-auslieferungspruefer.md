# Abschlussprotokoll 2026-09-11 — Transport, Stechuhr, und drei Prüfer-Berichte

**Sitzungs-Rolle:** Haupt-Sitzung · **Zweig:** `claude/zwei-knoten-sporen-abschluss-3um9e8`

Fortsetzung von [`2026-09-10_khc-neu-signiert.md`](2026-09-10_khc-neu-signiert.md).

## Stundennachweis — gemessen, nicht geschätzt

| | |
|---|---|
| erster Commit dieser Sitzung | **2026-09-10 22:39** (Kimboard `b3e22fe` · Sage `8e4fc1e`) |
| letzter Commit | **2026-09-11 00:54** (Sage `6d55393`) |
| **Spanne** | **2 h 15 min** |
| Umfang | **16 PRs** in **6 Depots**, alle gemergt |

⚠ **Was diese Zahl NICHT ist.** Sie ist nicht Klaus' Arbeitszeit. Die Zeit vor
dem ersten Commit — lesen, prüfen, Gegenprobe-Fälle von Hand nachstellen —
hinterlässt keine Spur und ist deshalb nicht mitgezählt. Wer mehr behauptet,
schätzt.

⚠ **Und die Grenze der Grenze:** wo diese Sitzung anfängt, ist an den Commits
nicht scharf abzulesen. Genommen ist der erste, der zu einer Bitte aus diesem
Gespräch gehört. Eine Minute früher anzusetzen wäre geraten.

## 1 · Der Default-Satz zählt sechs (Kimboard · Sage)

Klaus' zweite eigene Poststelle (`relay.pwa-toolpoint.de`) steht in beiden
Listen, und die Vorauswahl umfasst jetzt **sechs** Relais statt fünf.

⚠ **EINE ZAHL, EINE STELLE.** `VORGEWAEHLT = 6` in `Kimboard/index.html`;
`ROT_COUNT_DEFAULT` **liest sie ab**, statt sie zu wiederholen. Die
Rotations-Automatik war beim ersten Anlauf zu Recht rot — zwei Stellen, die
dieselbe Zahl behaupten, laufen auseinander.

⚠ **UND DER TEST-ANKER STARB AN DER REPARATUR.** Er suchte `slice(0, N)`; seit
die Zahl eine benannte Konstante ist, gibt es das Muster nicht mehr. Gelesen
wird jetzt die **Konstante**. Vier neue Wächter in
`tests/smoke_vorgezeichnet.mjs` (26 grün), jeder von Hand nachgestellt.

## 2 · Der Mitschnitt hat einen Transport (mycel-karte)

Klaus: *„den Mitschnitt abspielen sollte eine Pausetaste welche anstelle der
Playtaste auftaucht, darunter eine kleine Vor zurück und eine Schnellvorspulen
taste und zurück."*

Aus **▶ Mitschnitt abspielen** wird **⏸ Pause**, sobald etwas läuft, und
**▶ Weiter**, wenn es angehalten ist — derselbe Knopf. Darunter **◀ ▶** ein
Ereignis, **⏪ ⏩** zehn, **⏹** beendet, dazwischen der Stand.

⚠ **DIE ERFUNDENE KENNUNG BRAUCHTE EINE DRITTE STELLE.** Sie trug Durchlauf und
laufende Nummer; das reichte, solange es nur vorwärts ging. Seit ◀ den Stand
zurückdreht, wird **dasselbe Ereignis im selben Durchlauf** noch einmal
gesendet — `schonGesehen` hätte es still weggeworfen, die Karte bliebe stumm,
und der Knopf sähe kaputt aus.

⚠ **ANGEHALTEN IST NICHT BEENDET.** Der Riegel des Rekorders hing an
`replayTimer`, und der ist während einer Pause null: er hätte genau dann wieder
mitgeschrieben, und in der Aufzeichnung stünde die Kopie einer Kopie. Er fragt
jetzt nach `replayGeladen`.

⚠ **UND `hidden` VERLIERT GEGEN JEDE KLASSE MIT `display`.** Die Transportreihe
trägt `.btnrow` (`display:flex`). Kimhubs Lehre vom 2026-08-22, an einer
anderen Tür.

### Die Entscheidung ist hin und zurück gegangen — und beides steht da

Klaus bat zuerst darum, dass ⏩ **durchläuft** (PR #27). Auf die Nachfrage, welche
Fassung gelten soll, hat er sich für die **erste** entschieden: spulen, hinsehen,
dann ⏸/▶ drücken (PR #28). **Eine Entscheidung, die nur ihr Ergebnis zeigt, sieht
aus wie eine, die nie zur Debatte stand** — die nächste Sitzung, die „wer
vorspult, will doch weitersehen" denkt, baut sie sonst ohne es zu wissen ein
zweites Mal um. Beides steht deshalb in `mycel-karte/CLAUDE.md`.

⚠ **DAS ANHALTEN SITZT IN DER FUNKTION, NICHT AM KNOPF.** Am Knopf wäre es eine
Regel je Griff; zwei Regeln für denselben Griff sind zwei, die man sich merken
muss, und die zweite lernt niemand.

## 3 · Sages Startseite: jeder Einstieg einmal

Klaus: *„im Sage Protokol gibt es zweimal Suche, ich würde das Flying widget
wegnehmen und mycelkarte öffnen gibt es auch zweimal."* Beide Doppelungen sind
weg; die Pinnwand hat dabei eine eigene Karte in der PWA-Liste bekommen, damit
kein Einstieg verloren geht.

### Und die eingebettete Mycel-Karte wird jetzt ABGELEITET

*„die sage-Mycel karte hat nicht die selben funktionen wie die PWA App."*
`tools/mycelkarte-uebernehmen.mjs` erzeugt `mycel-karte/index.html` aus dem
Quell-Depot und wendet dabei **genau vier** benannte Abweichungen an. Wird ein
Anker nicht gefunden, schreibt es **gar nichts**.

✅ **DER WÄCHTER HAT AM SELBEN ABEND ZUM ERSTEN MAL GEFANGEN** — das Quell-Depot
war zweimal gewandert (Transport hin und zurück), und die Kopie stand still.
Nachgezogen mit `--schreiben`. **Das ist der Beleg, dass die Frage „ist die
Kopie noch die Kopie?" trägt, wo eine Liste von Fähigkeiten verrottet wäre:**
sie zählt nichts auf und altert deshalb nicht.

## 4 · „Die Zeiten stimmen nicht überein" (Kimhub · kim-hub-company)

Klaus las **63:18:42** in der Kachel gegen **62 h 18 min 42 s** in der Stoppuhr.

**Sie stimmten überein.** Die Kachel zählt gestempelt **und** gefahren, die
Stoppuhr nur das Gestempelte seit dem letzten ⟲ — die Differenz ist das
Gefahrene. Nur konnte er das nicht nachsehen: die **Aufteilung** hing an einer
Zeile mit `data-chef="geld"`, und mit gesetztem Chef-Code stand dort **nichts**.

⚠ **BEIDE ZUSICHERUNGEN WAREN SCHON AUFGESCHRIEBEN** — „die Aufteilung steht
IMMER da" und „die Stechuhr steht bewusst nicht in dieser Liste". Gebrochen
wurden sie trotzdem, weil zwei verschiedene Angaben in **einem** Element saßen.
**Eine Zusicherung bindet nicht das Element, sondern die Angabe.**

### Und die Stechuhr läuft jetzt auch zugeklappt

*„lass die Stechuhr nach dem Starten im Button Stechuhr direkt laufen. wenn der
Button zusammengeklappt ist. Bedienbar."* Zeit und Knopf stehen im `<summary>`;
der kompakte Knopf **drückt den großen**, statt einen zweiten Weg zu bauen.

⚠ **KEIN `display:flex` AUF DEM `<summary>`** — ein Flex-Container schluckt die
Leerzeichen zwischen den Kindern („und ernichtkann", 2026-08-23).

⚠ **EIN GEGENPROBE-FALL IST HIER NICHT MESSBAR, und das steht als benannte
Grenze da.** Gemessen am 2026-09-10: ein `<button>` in einem `<summary>` klappt
in diesem Chromium **gar nicht** um, auch ohne den
`preventDefault`/`stopPropagation`-Riegel. Der Riegel bleibt — andere Maschinen
klappen sehr wohl um.

## 5 · Die Bauzeit-Kachel sagt jetzt, warum sie leer ist

*„und bauzeit am Repo ist noch nicht eingetragen und die Untergrenze aus der
Githistorie"* — die Kachel zeigte ein **–**, darunter die **Einheit** einer Zahl,
die es nicht gab. Drei Lagen mit eigener Marke: verschlossen · nicht gesammelt
(mit dem Weg) · gesammelt (Herkunft, Tage **und Stand**).

⚠ **DIE SEITE KANN DIE ZAHL NICHT SELBST HOLEN** — sie braucht die Git-Historie,
und dorthin kommt kein Browser (NETZWEIT § 6b).

⚠ **UND DIE PROBE MASS DABEI DIE ECHTE DATEI.** Der Fall „noch nicht gesammelt"
meldete **171 h 10 min**, weil beim Bauen des Wächters `zeiten-sammeln.mjs`
gelaufen war und die Datei in die Ausgangslage wanderte.

## 6 · Klaus' drei Auslieferungsprüfer-Berichte — vier Urteile

Klaus: *„Wenn es sinnvoll ist, die Sachen hier zu beheben, die mein
Auslieferungsprüfer geprüft hat, dann macht das. Wenn Du das für nicht sinnvoll
hältst, dann lass es."* Die Entscheidung lag bei der Sitzung; hier steht sie
mit Begründung.

| | Befund | Urteil |
|---|---|---|
| Sage | 1 Sache an 3 Stellen · `href="#"` | **behoben** — drei echte Ziele, danach **0 Befunde** |
| Toolpoint | `lorem ipsum` | **behoben** — es stand in der Beschreibung des Prüfers **selbst** |
| Family Projekt | `family-projekt.de holt von aussen` (4×) | **behoben im Prüfer** — er liest jetzt `canonical`/`og:url` der geprüften Datei |
| Family Projekt | `cid:` (8×) | **behoben im Prüfer** — `cid:` zeigt in dieselbe Datei |
| Toolpoint | `du@example.com` | **gelassen** — RFC 2606 reservierte Beispiel-Domäne, in einem `placeholder` die richtige Wahl |
| Toolpoint | 27 App-Symbole von fremden Adressen | **gelassen** — es sind die Symbole der gelisteten Apps; sie zu kopieren wäre eine Rechtsfrage und erzeugte veraltete Bilder |

⚠ **DAS `href` WEGZULASSEN WAR DER ZWEITE FEHLVERSUCH.** Der Prüfer meldet ein
`<a>` **ohne** href genauso — und zu Recht: in der ausgelieferten Datei führt
beides nirgends hin.

⚠ **UND MEIN WÄCHTER DAZU WAR ZWEIMAL BLIND.** Er fand `<a download>` als
**Zeichenkette in einem `<script>`**, und beim zweiten Anlauf hätte er seine
eigenen Erklär-Kommentare mitgezählt. Er misst jetzt das Markup ohne Kommentare
und ohne Skripte — genau wie der Prüfer selbst.

## Was gemessen wurde

| Depot | Messung |
|---|---|
| **Sage-Protokol** | `node tests/run_alle.mjs` — **100 Proben · 100 grün · 0 rot · 0 nicht lauffähig** · zwei Gegenproben **12/12** und **12/12** |
| **Kimhub** | `node tests/alle.mjs` — **2223 grün · 0 ROT · 0 nicht lauffähig** |
| **PWA-Toolpoint** | `npm test` **772/772** · `smoke_pruefer.mjs` **216 grün · 0 ROT** |
| **mycel-karte** | **63 + 71 + 7 grün · 0 ROT** · Gegenproben **35/35** und **37/37** · im Browser **40 + 34 + 12 grün** |
| **kim-hub-company** | `npm test` **68 grün · 0 ROT** · `npm run gegenprobe` **40 gefangen · 0 durchgerutscht** |
| **Kimboard** | `node tests/alle.mjs` — **31 Prüfungen grün** · `smoke_vorgezeichnet.mjs` **26 grün** |

**Der Köder trägt den Wächter:** beide Prüfer-Fassungen melden auf
`koeder.html` **je fünf Befunde, jede Art genau einmal**. Ohne die neue
`cid:`-Zeile wären es zwei `FREMDE-ADRESSE`-Befunde und die Probe fiele um —
von Hand nachgestellt: **2 statt 1**.

## Was NICHT gemessen ist

- **Klaus' Browser-Sichttest steht für alles von heute Abend aus.** Headless
  beweist die Logik, nicht wie es sich am Tablet anfühlt.
- **`tests/manual_check.html`** — diese Sitzung hat es nicht angefasst.
- **Ob die Transportknöpfe am Tablet mit dem Finger gut zu treffen sind.**
  Gemessen ist nur ihr Verhalten im Browser.
- **Der Prüfer unter paralleler Last.** `smoke_pruefer.mjs` läuft als
  Kindprozess **ohne eigene Frist**; eine Zeitüberschreitung sieht dort aus wie
  ein Befund (gemessen 2026-09-10: 737 · 737 · 738 am selben Baum).

## Fehler dieser Sitzung — vollständig

| Was | Woran es lag |
|---|---|
| 21 Proben als „rot" gemeldet (Kimboard) | `playwright-core` fehlte — **nicht lauffähig, nicht rot** |
| toter Test-Anker nach `VORGEWAEHLT` | er suchte `slice(0, N)`, das es nicht mehr gibt |
| zweimal deutsche Anführungszeichen in JS-Literalen | die Probe war nicht mehr zu parsen |
| drei blinde Wächter in `smoke_mycelkarte_kopie.mjs` | ein Name, der Präfix eines anderen ist — sie verlangen jetzt die öffnende Klammer |
| `page.fill` lief in eine Frist | das Feld saß in einem geschlossenen Raum |
| Chef-Zustand zu früh gelesen | `waitForFunction` auf `data-chef-lage === "zu"` |
| Feldname geraten (`z3.gesammelt`) | er heißt `erzeugt` — **nachgesehen statt angenommen** |
| `FALLB_FILTER` vererbt | **zum dritten Mal** dieselbe Falle |
| Wächter maß im angehaltenen Zustand | dort sagen beide Knöpfe „▶ Start", auch ein kaputter |
| dead-link-Wächter fand Code statt Markup | Kommentare **und** Skripte werden jetzt gestrippt |
| `#koederKnopf` von `window.confirm` blockiert | headless verwirft Dialoge — der Abschnitt räumt jetzt selbst auf |

## Offen

1. **`docs/PULS.md` steht bei exakt 3000 Zeilen.** Der Eintrag zum 2026-09-11
   steht drin; **der nächste Eintrag muss zuerst auslagern** — archivieren, nie
   kürzen. Dieses Protokoll ist deshalb **nicht** in PULS verlinkt, und das ist
   benannt statt still.
2. **`smoke_pruefer.mjs` braucht eine eigene Frist am Kindprozess.**
3. **Fünf Knoten unter 0,80** (Private Brain 0.800773).
4. **Aufgabe 3 der Liste** — „Den Fall der PWA-Toolpoint-Startseite untersuchen"
   (99 · 100 · 96 · 100 mit CLS 0,062 statt der dokumentierten 100/100/100).
