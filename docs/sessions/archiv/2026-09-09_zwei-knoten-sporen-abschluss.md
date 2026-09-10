# Abschlussprotokoll 2026-09-09/10 — zwei Knoten, zwei Sporen, ein fehlendes Werkzeug

**Sitzungs-Rolle:** Haupt-Sitzung · **Zweig:** `claude/zwei-knoten-sporen-abschluss-3um9e8`

## Stundennachweis — gemessen, nicht geschätzt

| | |
|---|---|
| erster Commit dieser Sitzung | 2026-09-09 13:15:12 +0200 (Kimhub #179) |
| letzter Commit | 2026-09-10 00:03:10 +0000 (PWA-Toolpoint) |
| **Spanne** | **rund 10 h 48 min** |

⚠ **Was diese Zahl NICHT ist.** Sie ist nicht Klaus' Arbeitszeit, und sie ist
nicht durchgehende Arbeit: darin liegen zwei lange Gegenprobe-Läufe, ein
Container-Neustart und die Wartezeit auf Klaus' Browser. Die Zeit **vor** dem
ersten Commit hinterlässt keine Spur und ist deshalb nicht mitgezählt. Wer mehr
behauptet, schätzt.

⚠ **Und in der Spanne liegen zwei Merges, die nicht aus dieser Sitzung kamen** —
`kim-hub-company` #54 und `PWA-Toolpoint` #98. Sie stehen hier, weil sie den
Stand bewegt haben, auf dem gemessen wurde, nicht als eigene Arbeit.

## Was getan wurde

### 1 · Companys Siegel wird gebaut wie bei PWA Toolpoint (Kimhub #179)

Klaus: *„Kim hub campany das Siegel ist jetzt völlig verworren … Also genauso
wie bei Tool PWA Toolpoint machen."*

Der bisherige Weg ließ **Modul 17** sein eigenes Fenster bauen und machte dessen
verborgenen Stellvertreter-Container sichtbar. Dabei ist die teuerste Sorte
Messfehler unterlaufen: das Wappen war mit **28×28** gemessen und als „behoben"
gemeldet — gemessen war der Anker **im Versteck**. Die Zahl war richtig, der
Schluss daraus falsch.

Jetzt bringt die **Seite** die Lampen-Leiste mit (`LEBT · VERKEHR · FREMD`), und
Modul 16 hängt sein Wappen dort hinein. Modul 17 wird gar nicht mehr geladen.

Gemessen an der gebauten Seite: Leiste 234×34 in der Kopfzeile, Wappen 28×28
**innerhalb** der Leiste, Themenwechsel färbt mit (`#161c22` → `#ffffff`), Klick
öffnet das Siegel-Modal mit dem Andock-Wizard, keine Seitenfehler.

**Falle 3 aus Sages LEHREN gilt dort nicht mehr** — benannt, nicht umfahren: an
ihre Stelle tritt die umgekehrte Zusicherung (17 darf **nicht** in der Kette
stehen), mit Wächter und Gegenprobe-Fall. Der alte Fall zeigte danach ins Leere
und meldete TOTER ANKER; er ist ersetzt, nicht gelöscht.

### 2 · Ein Drift-Guard sagt „unverändert", nicht „aktuell" (kim-hub-company #53)

Klaus hat **denselben Befund zweimal** geschickt: *„und die Agentenpillen die
sind immmer noch nicht in der Startposition."* Die Arbeit war getan — in
**Kimhubs** `ansicht.js`. Nach kim-hub-company kopiert war nur `index.html`.

**Und alle Wächter waren grün.** Der Drift-Guard vergleicht jede Kopie mit
**ihrem eigenen** Fingerabdruck; eine Datei, die niemand angefasst hat, ist
„unverändert" — auch wenn die Quelle längst weiter ist. Es ist die Frage nach
der **Abwandlung**, nicht die nach dem **Stand**.

Derselbe Satz hat in derselben Woche schon zweimal zugeschnappt
(`PWA-Toolpoint/sbkim/15_membran.js`, und einmal `ansicht.js`). **Beim dritten
Mal ist es keine Unachtsamkeit mehr, sondern ein fehlendes Werkzeug** —
`tools/aus-kimhub-holen.mjs` holt seitdem alle gepinnten Kopien auf einmal und
liest seine Liste aus dem Drift-Guard statt einer zweiten.

### 3 · Die Spore des Auslieferungsprüfers (Sage #962, PWA-Toolpoint #99)

Klaus hat sie im Browser des Prüfers erzeugt.

| | |
|---|---|
| Signatur | **✔ VALID** (headless reziprok, Sages Modul-02-Pfad) |
| Kennung | `yF1ONN8LQskao9MoTyRADywKYIHLr0BM9CUXQj5X9GM` = SHA-256 des rohen öffentlichen Schlüssels |
| Sage-Cosinus | **0.840471** (offline nachgerechnet) |
| Marktplatz ⟷ Prüfer | 0.817974 |
| Vektor | L2 = 1, 384 Zahlen |

⚠ **Der erste Prüfversuch meldete „ungültig", und die Signatur war
einwandfrei.** Sortiert waren nur die **obersten** Schlüssel; `canonicalize` in
Modul 02 sortiert **rekursiv**. Eine falsche Kanonisierung sieht genauso aus wie
eine gefälschte Spore — und das wäre hier die teuerste Fehlauskunft gewesen, weil
sie Klaus' echte Identität als Fälschung ausgewiesen hätte. Gegenprobe zur
Methode: dieselbe Prüfung sagt zur Marktplatz-Spore ebenfalls VALID.

## Befunde, die keiner Aufgabe zuzuordnen sind

### A · Ein Endpunkt, der auf eine SEITE zeigt, hat keinen Sporen-Ort

Modul 15 baut die Adresse als `endpoint + "/sbkim/spore.json"`. Für den Prüfer
ergibt das `…/auslieferungspruefer.html/sbkim/spore.json` — **diese Adresse
liefert nichts aus**, und auf GitHub Pages kann sie es nicht. Die abgelegte
Spore ist damit **Beleg, nicht Sender**.

Das schärft die Lehre vom 2026-09-02, statt ihr zu widersprechen: neu ist, dass
ein Knoten hier **gar keinen** abholbaren Ort hat, und das gilt für jeden
Knoten, dessen Endpunkt eine Seite statt eines Verzeichnisses ist.

**Vorschlag:** ein optionales `sporePath` neben dem Endpunkt im Kanon, Vorgabe
unverändert. **Kein** Eingriff in eine Kopie — der ergäbe eine dritte
Modul-Generation. **Offen, Klaus entscheidet.**

### B · Ein Wächter, der `main` nach Kalender rot macht (PWA-Toolpoint)

`origin/main` war **schon vor diesem Zweig ROT** — 714/716, auf einem frischen
Auszug gemessen, nicht angenommen. „Fund der Woche" ist in `index.html`
eingebacken und wechselt wöchentlich; der Wächter vergleicht ihn mit dem, was das
Werkzeug **heute** rechnet. Der Arbeitsablauf, der das nachzieht, feuert aber nur
auf einen Push an `listings.js` oder `wache-hand.json` — **es gibt keinen
Zeitplan**. Also wird `main` jede Woche von allein rot und bleibt es bis zum
nächsten Push.

Nachgezogen mit dem eigenen Werkzeug. Der Wächter ist **nicht** angefasst — er
hat recht, es fehlt der Auslöser. Ein wöchentlicher `schedule` wäre die
Reparatur; das ist eine eigene Sitzung.

### C · Toolpoints Gegenprobe sabotiert den ECHTEN Baum

Anders als Kimhubs (die eine Wegwerf-Kopie anlegt) schreibt Toolpoints `probe()`
per `sed -i` in die Arbeitsdatei und stellt sie danach zurück. **Wird der Lauf
unterbrochen, bleibt die Sabotage liegen.** Genau das ist hier passiert: nach
einem abgebrochenen Lauf stand eine erfundene Zeile in `assets/studio.js`, und
`npm test` meldete daraufhin vier rote Proben, die niemandem gehörten.

Zwei Lehren daraus, beide teuer bezahlt:

- **`| tail` ist zum Lesen da, nicht zum Urteilen** — der Lauf lief über eine
  Minute lang unsichtbar hinter einer Pipe, und der Rückgabewert wäre der von
  `tail` gewesen. Die Regel steht in Kimhubs Verfassung dreimal; sie ist
  trotzdem noch einmal zugeschnappt.
- **Vor einem Lauf, der den Arbeitsbaum anfasst, wird festgeschrieben.** Mit
  einem Commit dahinter ist eine liegengebliebene Sabotage in `git status`
  sichtbar und mit einem Griff zurückzuholen.

## Was offen ist

1. Der **Live-Handshake** beider Toolpoint-Knoten — den sieht nur Klaus' Browser.
2. Der Kanon-Vorschlag **`sporePath`** (Befund A).
3. Ein **wöchentlicher Auslöser** für Toolpoints statische Liste (Befund B).
4. Die **45 abweichenden Modul-Kopien** netzweit aus dem Lauf vom 2026-09-09.
5. Warum die **Lighthouse-Zahlen der PWA-Toolpoint-Startseite** gefallen sind
   (99·100·96·100, CLS 0,062 gegen die dokumentierten 100·100·100, CLS 0).
   **Nicht untersucht** — die Messung fiel nebenbei an.
6. Klaus' **Sichttest** an Kim Hub Company nach dem Umbau des Siegels.

## Was NICHT gemessen ist

Wie es am Tablet aussieht und sich anfühlt. Alle Zahlen oben kommen aus einem
headless Browser oder aus einer Offline-Rechnung. **Klaus' Browser-Sichttest ist
nicht ersetzbar.**
