# Bauregel: Mycel im Hintergrund, als Werkzeug

**Gilt ab 2026-11-04 für jede App, deren Nutzer etwas anderes tun wollen als ein Netz zu bedienen.**
Klaus, 2026-11-04: *„Ich meine das Modul schon mit einbauen, aber im Hintergrund, besser gesagt, als
Werkzeug."*

Die Module bleiben vollständig in der App. Was wegfällt, ist das, was ständig auf dem Bildschirm steht:
das schwebende Fenster (Modul 17) und das große Siegel über dem Inhalt. Die Funktion bleibt erhalten.
Sie steht dort, wo man Werkzeuge sucht: in den Einstellungen.

## Warum

- Wer Workflow PDF, die Familienakte oder BookLedger benutzt, will ein Dokument bearbeiten oder eine
  Rechnung buchen. Ein schwebendes Netz-Fenster lenkt davon ab und erklärt sich nicht von selbst.
- Gemessen am Auslieferungsprüfer (PWA-Toolpoint, 2026-09-08): die volle Modul-Kette kostet 30 bis
  60 ms Blockierzeit. Ohne Modul 17 fallen 79 KB weg.
- Jede sichtbare Oberfläche muss bei jeder Kanon-Änderung in rund 20 Repos nachgezogen werden.
  Weniger Oberfläche heißt weniger Nacharbeit.

## Wann diese Regel NICHT gilt

Apps, deren Zweck das Netz selbst ist, behalten die volle Oberfläche: Sage-Protokol, die Mycel-Karte,
Kimboard, Kimseek, SB·KIMTool·Point. Dort ist das Netz der Inhalt.

## Die fünf Pflichten

### 1 · Die Module sind da und laufen

Alle Module aus Liste A in [`PFLICHT_MODULE.md`](PFLICHT_MODULE.md) bleiben Pflicht (01, 02, 03, 04,
05, 05b, 07, 15), dazu 16, 23 und `noble-secp256k1`. Byte-1:1 aus `src/modules/`, im Offline-Vorrat,
Kette in der Leerlaufpause. **Modul 17 entfällt.** 23-UI bleibt, wenn die App „Mit dem Netz verbinden"
anbietet. Ohne 23-UI gibt es kein Verbinden von Hand, also nur, wenn die App das bewusst nicht anbietet.

### 2 · Die Anker stehen von Anfang an im HTML

Modul 17 hat bisher die Anker angelegt, an die sich 15 und 16 hängen. Ohne 17 muss die Seite sie
selbst mitbringen, sonst hängen Lampe und Siegel **lautlos** ins Leere (Falle 3 in `PFLICHT_MODULE.md`).

- ein Platz für das Siegel, übergeben mit `SbkimSiegel.init({ badgeSelector: … })`
- ein Platz für die Fremd-Lampe, übergeben mit `lampSelector` an Modul 15
- ein Platz mit `data-sbkim-mycel-platz` für den Verbinden-Knopf von 23-UI

⚠ **Die Anker liegen in einem Behälter, den es beim Laden schon gibt.** Baut die App ihre
Einstellungen erst beim Öffnen (Single-Page-App), findet das Modul den Anker beim Start nicht. Der
Behälter steht deshalb verborgen im HTML, und die Einstellungsseite zeigt ihn an der richtigen Stelle.
Vorbild: der verborgene Installieren-Behälter in BookLedgerPro (`#install-quelle`).

⚠ **Das Siegel braucht Maße aus dem CSS** (z. B. 28 × 28 px), sonst ist es 0 × 0 groß (Sende-Prüfer,
2026-09-29).

### 3 · Das Siegel bleibt nachprüfbar

In den Einstellungen steht ein Abschnitt **„Netz"** (englisch „Network"). Darin:

- das Siegel klein, mit seinem Zustand (ohne · Bronze · Gold), daneben ein Satz, was es bedeutet
- ein Knopf **„jetzt prüfen"**, der Modul 16 die Pflicht-Module wirklich nachsehen lässt
- zugeklappt hinter ⓘ: was das Mycel ist, dass es Apps miteinander verbindet, dass sie sich ohne
  Server finden und Fragen austauschen können, und was dabei **nicht** hinausgeht

⚠ **Ein Bild mit Erklärtext ohne Prüfung ist nur eine Behauptung.** Der Wert des Siegels ist, dass es
nachsieht. Ein Siegel, das als Grafik eingebaut ist, ohne dass Modul 16 läuft, verstößt gegen diese
Regel.

### 4 · Eine Warnung erscheint von selbst

Die Fremd-Lampe (Modul 15) ist ein Sicherheitssignal. Solange alles ruhig ist, bleibt sie verborgen.
Meldet die Membran einen Fund (`sbkim:fremd-alert`), muss ein sichtbares Zeichen erscheinen, auch wenn
die Einstellungen zu sind: ein Punkt am Einstellungen-Knopf oder ein Hinweis oben. Ein Tipp darauf
öffnet den Abschnitt „Netz".

⚠ Eine Warnung, die nur in einer geschlossenen Seite steht, ist so gut wie keine.

### 5 · Das Netz ist aus, bis man es einschaltet

- Beim Laden geht **kein** Websocket und keine Anfrage an ein Relais hinaus. Eine Probe zählt das.
- Verbinden, Identität, eigene Spore, Andock-Wizard und Gerätename stehen im Abschnitt „Netz" und
  laufen erst auf ausdrücklichen Tipp.
- Die Wahl wird gemerkt. Wer einmal verbunden hat, ist nach dem Neuladen wieder verbunden, sonst nicht.

## Die Mycel-Karte ist der Leitstand

Klaus, 2026-11-04: *„Das Myzel soll für uns in der Myzel-Karte sichtbar sein … damit wir sehen, welche
Apps miteinander verbunden sind, interagieren und ob die überhaupt funktionieren oder ob eine
ausgefallen ist im Hintergrund. Denn das sieht man ja nicht immer auf Anhieb, wenn man damit arbeitet."*

In den Apps ist das Netz verborgen, **sichtbar ist es an einer Stelle: auf der Mycel-Karte**
(eigenes Depot `mycel-karte`, eingebettet in `family-project/mycelkarte.html`). Daraus folgt:

- **Auf unseren eigenen Geräten ist das Netz eingeschaltet.** Pflicht 5 gilt für fremde Nutzer und für
  den ersten Start. Klaus und Jens schalten es in jeder App einmal ein, die App merkt es sich und meldet
  sich danach bei jedem Start still im Raum an. Nur so taucht sie auf der Karte auf.
- **Jede App braucht einen Gerätenamen** (z. B. „Workflow PDF Pro · Klaus-Tablet"). Sonst stehen zwei
  Geräte mit derselben App auf der Karte nur als Kennung da.
- **Ausfall muss auf der Karte zu sehen sein.** Eine App, die sich nicht mehr meldet, darf nicht einfach
  verschwinden. Sie bleibt stehen und wird als „zuletzt gesehen vor …" gekennzeichnet. Ob die Karte das
  heute schon tut, ist **nicht nachgesehen** (das Depot `mycel-karte` lag in dieser Sitzung nicht vor).
  Das ist der erste Prüfpunkt beim Rollout.
- Die Karte bleibt **reine Anzeige**: sie lauscht und sendet nie. Das steht schon heute auf ihrer Seite.

## Geltungsbereich: alle Apps, mit denen wir weiterarbeiten

Klaus, 2026-11-04: *„Und wir werden das dann auf alle brauchbaren Apps, alle Apps, die wir benutzen für
die Weiterarbeit, so anwenden."*

Gemeint ist die Kernliste aus der Entscheidungsgrundlage vom 2026-11-04. Nach heutigem Stand sind das
Workflow PDF Pro, Meine Familienakte, Auslieferungsprüfer und Sende-Prüfer, Private Brain Pro,
BookLedgerPro und BookLedger Basic, Mein WorkFloh, Tomys Hub, Workflow Calculate, Workflow Needs und
Datei-Post. Was nach hinten gestellt ist (Lernrepos, Doppelungen), wird nicht umgebaut.

**Reihenfolge beim Rollout:** zuerst die Mycel-Karte prüfen (zeigt sie einen Ausfall?), dann eine App
als Vorlage vollständig umbauen und messen, dann die übrigen nach derselben Vorlage. Ein Rollout ohne
geprüfte Karte hätte keine Stelle, an der man sieht, ob er gelungen ist.

## Was unverändert gilt

Eigene Schublade (`window.SBKIM_DB_SUFFIX` im Kopf) · eigene Identität und Spore · Gerätename nur im
Verbinden-Panel und nie in einer kopierten Panel-Datei · `sicherheit.html` neben der Siegel-Seite ·
`ribbonText` gesetzt · Sprache an 23-UI und 16 durchgereicht · Cache-Bump bei jeder geänderten
`CORE`-Datei.

## Vorbilder im Netz

| App | was sie davon schon so macht |
|---|---|
| Sende-Prüfer, Workflow Calculate, Workflow Needs | feste Leiste ohne Modul 17, eigene Anker, beim Laden kein Netz |
| BookLedgerPro (Pro-Umbau 11) | Mycel-Seite als einfacher Kasten, Siegel klein in der Leiste |
| Private Brain Pro | das Mycel öffnet sich aus dem Siegel, die eigene Pille ist ausgeblendet |
| PWA-Toolpoint (Marktplatz) | ohne Modul 17, die Kopfleiste trägt die Anker |

Keine davon erfüllt bisher alle fünf Pflichten. Am weitesten fehlt Pflicht 4 (Warnung bei
geschlossenen Einstellungen).

## Beim Bauen abzuhaken

- [ ] Liste A + 16 + 23 (+ 23-UI) byte-1:1, Modul 17 **nicht** geladen
- [ ] Anker für Siegel, Fremd-Lampe und Verbinden-Knopf stehen beim Laden im HTML
- [ ] `badgeSelector` und `lampSelector` übergeben, Siegel mit Maßen aus dem CSS
- [ ] Abschnitt „Netz" in den Einstellungen: Siegel, „jetzt prüfen", Erklärung hinter ⓘ
- [ ] Fund der Membran erzeugt ein sichtbares Zeichen außerhalb der Einstellungen
- [ ] beim Laden kein Netzverkehr (gemessen, nicht angenommen)
- [ ] Ladezeit vorher und nachher gemessen, beide Zahlen mit Datum
- [ ] Probe **und Gegenprobe**: Anker entfernt → Siegel fehlt mit eigener roter Zeile; Warnweg entfernt →
      rote Zeile; Netz beim Laden → rote Zeile

## Offen

- Ob ein gemeinsamer Klebstoff („Netz-Abschnitt") als Kanon-Datei in `src/modules/` gebaut wird, damit
  nicht jede App ihre eigene Fassung schreibt. Das wäre die Gegenregel zu „Nacharbeit in 20 Repos".
  Entscheidung bei Klaus.
- Am Tablet ist keine der Vorbild-Apps mit dieser Regel gemessen.
