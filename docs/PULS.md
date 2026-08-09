# PULS — lebender Status

**Format:** Jede Sitzung trägt unten einen Eintrag ein (neueste oben).
**Pflichtfelder pro Eintrag:** Datum · Sitzungs-Rolle · was getan · was offen · nächster sinnvoller Schritt.
**Begrenzung:** Diese Datei darf 3000 Zeilen nicht überschreiten. Älteres ins
`docs/sessions/archiv/`-Verzeichnis als Übergabeprotokoll auslagern.
**Schutz-Klausel (2026-05-17):** Die 3000-Zeilen-Grenze wurde bewusst hochgesetzt
(vorher 400) — Pflege-Sitzungen werden umfangreicher dokumentiert, weil
Architekturfunde und Diagnose-Routinen Platz brauchen. **Diese Grenze NICHT
wieder herabsetzen, auch nicht zum Token-Sparen.** Wenn 3000 Zeilen nahen,
auslagern statt kürzen.

---

## Modulstand heute

<!-- Pie-Block ab hier wird automatisch aus status.json generiert.
     Nicht von Hand bearbeiten. Erzeugen mit:
     python3 scripts/update_puls_pie.py
     Aufruf-Pflicht: nach jeder status.json-Änderung. Siehe CLAUDE.md. -->
```mermaid
pie showData
  title Modulstand 2026-07-29 (27 Module)
  "🟫 Schablone" : 6
  "🟧 In Werkstatt" : 0
  "🟨 Spec fertig" : 0
  "🟦 Code-Stub" : 0
  "🟩 Fertig" : 21
```

Farb-Mapping verbindlich in [INTERFACES.md §5](INTERFACES.md). Live-Bau-Puls
auf der [Sage-Page](../index.html) (Karte "Bau-Puls").

## Stand 2026-08-09 — Die Sage-Page blendet wieder ein (Klaus' Entscheidung)

**Rolle:** Pflege-Sitzung. Klaus' Wort: *„Nicht verschlechtern nur zu Testzwecken."* Danach
ausdrücklich: *„Einblendung aus PR #788 wieder herstellen."*

PR #788 hatte am 2026-08-07 die Einblende-Animation des Start-Bildschirms abgeschaltet
(`.screen.active.erstanzeige { animation: none }`), weil `fade-in` bei `opacity: 0` startet und
der Hero-Text darin das LCP-Element ist. Rückgängig gemacht sind genau diese zwei Stellen — die
CSS-Regel und die Klasse am `<main>`.

### Was es kostet — gemessen, abwechselnd, je drei Läufe

| | Leistung | LCP |
|---|---|---|
| **alt** (Einblendung aus) | 72 · 73 · 75 | 4,9 · 6,4 · 5,6 s |
| **neu** (Einblendung an) | 72 · 72 · 72 | 7,3 · 7,6 · 7,5 s |

Barrierefreiheit 100, Gute Praxis 96, SEO 100, CLS 0 — in allen sechs Läufen gleich.

**Die Note kostet es rund einen Punkt** (Median 73 → 72). **Der LCP kostet rund zwei Sekunden**
(Median 5,6 → 7,5 s). Das ist der Preis, und er steht damit hier.

### Zwei Dinge, die gegen mich selbst sprechen

**1. Meine Vorhersage war falsch.** Ich hatte Klaus „ungefähr sieben Punkte" angekündigt —
gestützt auf die Zahlen aus PR #788 (dort: 69·71 → 77·77). Gemessen sind es **etwa eins**. Die
alte Messung und die heutige widersprechen sich also deutlich. Warum, weiß ich nicht sicher:
die Bau-Maschine hat an verschiedenen Tagen verschiedene Grundwerte, und ob damals wirklich
abwechselnd gemessen wurde, steht dort nicht. **Wer die Note aus #788 als Argument verwenden
will, misst sie vorher nach.**

**2. Der erste Mess-Anlauf war falsch aufgesetzt.** Er startete alt und neu **gleichzeitig** —
beide auf demselben Prozessor, also beide verfälscht. Abgebrochen und sauber wiederholt
(abwechselnd, immer nur eine Messung zur Zeit). Genau davor warnt Regel 2 der Bauregeln.

### Ein Nebenbefund, der zum Nachdenken taugt

Mit Einblendung ist der LCP **stabil** (7,3 · 7,6 · 7,5), ohne sie **streut** er
(4,9 · 6,4 · 5,6). Das ist logisch: die Animation gibt dem größten Anstrich einen festen
Zeitpunkt; ohne sie hängt er davon ab, was gerade sonst fertig wird. Der abgeschaltete Zustand
war also nicht nur schneller, sondern auch **launischer** — und die 4,9 s aus dem besten Lauf
waren nie der Normalfall.

### Offen

- **Klaus' Blick auf die Live-Seite** — ob die Einblendung wieder so wirkt, wie sie soll.
- **Was die Sage-Page am Handy wirklich bremst** (PageSpeed 2026-08-09: **63** am Handy,
  **97** am Computer — dieselbe Messung, zwei Geräte, kein Vorher/Nachher) ist damit **nicht**
  beantwortet. Die Einblendung ist ein kleiner Posten. Der Bericht nennt die großen; gelesen
  hat sie noch niemand.

## Stand 2026-08-08 (2) — Postfach-Verjährung: Sages zwei größte Briefkästen von 1091 auf 324 Zeilen

**Rolle:** Pflege-Sitzung (Klaus' Freigabe: „Verjährung anwenden — kein Vorzug, Vorschlag
Sage zuerst"). Erste Anwendung von **INTERFACES §11.6.1** außerhalb von Mein-Tresor, wo die
Regel entstanden ist. Sage ist der Kanon-Knoten und trug die beiden größten Postfächer des
ganzen Netzes.

| Postfach | vorher | nachher | zusammengefasst |
|---|---|---|---|
| `sbkim/AUSTAUSCH.md` (⇄ SB·KIMTool·Point) | 653 | **204** | 11 Abschnitte + 17 Verlaufs-Zeilen |
| `sbkim/AUSTAUSCH-BookLedgerPro.md` | 438 | **120** | 8 Briefe + 6 Verlaufs-Einträge |

**Zusammengefasst wurde nur, was beide Bedingungen erfüllt:** älter als 30 Tage (alle
Einträge 2026-05-30 bis 2026-06-22) **und** von der Gegenstelle quittiert — Point führt
`ack["Sage-Protokol"] = 46`, BookLedgerPro führt `ack["Sage"] = 31`. Beides nachgesehen,
nicht angenommen.

**Nicht angetastet:** die Datenverträge (`SIGNAL.json`, `spore.json`, `*_inbox.json`,
`*.verify.md` — `git diff` darauf ist leer), die Status-Köpfe, der **Sync-Vertrag** in
`AUSTAUSCH.md` (ein Vertrag, keine Quittung) und **drei offene Bitten** an
SB·KIMTool·Point, auf die nie geantwortet wurde: Siegel-PNG gesucht · Speicher-Lehre 9 zur
Prüfung · Standalone-Such-Tool. Im Postfach der Gegenstelle nachgesehen — keine Antwort,
also bleiben sie stehen.

### Befund beim Nachprüfen (nicht nur umgeschichtet)

- **Sage schuldet BookLedgerPro noch `capVector`/`needsVector`.** Am 2026-06-21 zugesagt;
  die committete `sbkim/spore.json` trägt bis heute **weder das eine noch das andere**
  (nachgesehen: `domainVector` + `snippetVectors`, sonst nichts). Der Punkt stand bisher als
  Nebensatz in zwei Briefen — jetzt steht er als eigener **OFFEN-Block ganz oben** im
  Postfach, mit dem Weg dahin (Re-Sign über Modul 02 an Klaus' Tablet, der private Schlüssel
  lebt in der Browser-Identität). Solange gilt der vereinbarte `domainVector`-Rückfall.
- **Der Status-Kopf log leicht:** er nannte `ack[BookLedgerPro] = 15`, während `SIGNAL.json`
  18 führt. Auf 18 berichtigt.

### Hinweis an Klaus (nicht stillschweigend übergangen)

**Diese Datei ist bei 8405 Zeilen** — die Schutz-Klausel im Kopf nennt 3000 als Grenze und
sagt: „auslagern statt kürzen". Der Überlauf ist also nicht neu und nicht durch diese
Sitzung entstanden, aber er steht seit Längerem unbenannt da. Eine eigene Auslagerungs-
Sitzung nach `docs/sessions/archiv/` wäre fällig — **nicht** hier nebenbei, das wäre genau
das falsche Aufräumen, vor dem die Regel warnt.

### Offen / nächster Schritt

1. **Die übrigen Knoten mit großen Postfächern** — SB·KIMTool·Point (573 + 471),
   Jasons-Tresor (362), BookLedgerPro (630 auf deren Seite). Jeder räumt **nur im eigenen**
   Depot; das Muster steht jetzt zweimal vor.
2. **Sages cap/needs-Re-Sign** an Klaus' Tablet — der einzige echte Rückstand, den diese
   Prüfung zutage gefördert hat.
3. **PULS-Auslagerung** (siehe Hinweis oben).

## Stand 2026-08-08 — CLAUDE.md: die Falle im Abzweigen selbst

**Rolle:** Pflege-Sitzung (Klaus' Anweisung: „CLAUDE.md Absatz auch noch machen").

`git checkout -B <branch> origin/main` — der Befehl, den die Sitzungsstart-Pflicht
oben verlangt — hängt den **Upstream** des Branches auf `origin/main` um. Eine
Prüfung „habe ich alles veröffentlicht?", die gegen `@{upstream}` rechnet,
vergleicht danach mit `main` und meldet **sauber**, während der gleichnamige
Remote-Branch einen anderen Stand trägt.

Real passiert am 2026-08-08: die Sitzung meldete alle 31 Repos sauber, der
Stop-Hook fand im selben Moment einen unveröffentlichten Commit. Die Prüfung war
nicht falsch gerechnet — sie zielte aufs Falsche und gab der Sitzung recht.

Aufgenommen als eigener Unterabschnitt in CLAUDE.md § Sitzungsstart-Pflicht, mit
den zwei Befehlen, die wirklich tragen (`rev-list origin/<branch>..HEAD` +
`status --porcelain`) und der Einordnung des `--force-with-lease`-Pushes nach
einem Squash-Merge (erlaubt, solange der Branch nur gemergte Historie trägt).

**Tafel-Änderung, nicht stillschweigend:** CLAUDE.md ist eine heilige Tafel. Der
Absatz kam auf Klaus' ausdrückliche Anweisung; die Sitzung hatte den Befund
vorher benannt und um Erlaubnis gefragt (Tafel-Evolutions-Klausel).

**Gilt netzweit**, steht aber vorerst nur hier — die Übertragung in die anderen
Repo-CLAUDE.md ist ein eigener Schritt und wurde nicht mitgemacht.

---

## Stand 2026-08-07 — LCP 7,3 → 4,6 s: es war das Einblenden des Bildschirms

**Rolle:** Mess-/Pflege-Sitzung. Auslöser war die offene Frage aus dem
Übergabe-Brief in family-project: die gemeldete Skript-Zeit
(`docs/observatorium/vorteilspack.js`, 24,5 s) passe nicht zur gemeldeten
Blockierzeit (100 ms), eine der beiden Zahlen müsse in die Irre führen.

### Der Widerspruch war keiner — drei Fallen

- **Die 24,5 s sind keine Ausführungszeit.** Die Spalte `total` in
  „Skript-Ausführungszeit reduzieren" ist die Hauptthread-Zeit, die dem
  **Aufgabenbaum** des Skripts zugerechnet wird, samt Layout und Malen. Die
  Ausführung steht daneben: **1.052 ms**, Parsen 5 ms.
- **TBT deckt nur ein Fenster ab** (zwischen FCP und TTI). Klein heißt nicht
  „Hauptthread frei".
- **Lighthouse misst voreingestellt `simulate`.** Im selben Bericht steht LCP
  **7.563 ms simuliert** neben **847 ms beobachtet**; die LCP-Aufschlüsselung
  rechnet beobachtet, die Kennzahl oben simuliert.

### Die Ursache: eine einzige CSS-Regel

Der LCP ist `p.hero-claim`, **reiner Text**, TTFB 22 ms — die ganze Zeit ist
Render-Verzögerung. Der Text liegt in `.screen.active`, und dessen
`fade-in`-Animation startet bei `opacity: 0`. Der größte Anstrich wartet also
auf das Ende der Einblendung.

`<main id="screen-overview">` trägt `active` **fest im HTML**, und **kein
einziges Skript** setzt die Klasse je auf einen anderen Bildschirm. Die
Einblendung spielt also genau einmal: auf der Seite, die ohnehin schon da ist.
Ein Übergang *in die Sicht hinein* für etwas, das nicht von außen kommt.

**Behoben** mit einer Regel + einer Klasse: `.screen.active.erstanzeige {
animation: none }`, Marker am Start-Bildschirm. Bildschirme, die später aktiv
werden, blenden unverändert ein.

| gegen `origin/main`, Handy, im Wechsel | Leistung | FCP | LCP |
|---|---|---|---|
| vorher | 69 · 71 | 2,6 · 2,7 s | 7,6 · 7,3 s |
| nachher | **77 · 77** | 2,7 · 2,7 s | **4,6 · 4,7 s** |

Der **erste** Anstrich ist unverändert. Nur der **größte** rückt um 2,7 s vor.

### Zwei Fehlschlüsse auf dem Weg — festgehalten, damit sie niemand wiederholt

Der Verdacht fiel zuerst auf die acht dauernd laufenden Animationen
(`non-composited-animations`). Alle abzuschalten brachte tatsächlich 82 statt
66. Die naheliegenden Schuldigen waren es aber **beide Male nicht**:

| Fassung (Wegwerf-Kopie unter `/tmp`) | Leistung | LCP |
|---|---|---|
| nur die 6 Animationen unterhalb des Bildschirms aus | 72 · 72 | 7,3–7,5 s — **unverändert** |
| nur der Puls der Verkehrs-Lampe aus | 70 · 71 · 70 | 7,3–7,6 s — **unverändert** |
| nur das Einblenden aus | **77 · 79 · 76 · 77** | **4,5–5,0 s** |

Die Lampen-Animation über `box-shadow` sah teuer aus (wachsender Schein,
nicht kompositierbar) und ist auf 9 × 9 Pixeln schlicht zu klein, um zu zählen.
**Vom Mechanismus auf die Größenordnung zu schließen ist der Fehler**, der
zweimal hintereinander passiert ist. Nur die Gegenprobe entscheidet — und
zwar auch die auf den *Vorschlag*, nicht nur die auf die Ursache.

### Offen

- **Klaus' Browser-Sichttest.** Die Seite erscheint jetzt ohne die halbe
  Sekunde Einblenden. Wirkt das zu abrupt?
- **PageSpeed** an der live ausgelieferten Seite. Alle Zahlen hier sind lokal.
- Die zwei Lampen-Animationen (Verkehr, Siegel) bleiben unangetastet — sie
  kosten messbar nichts. Klaus' Wunsch, den Verkehrs-Puls durch einen kurzen
  Farbwechsel zu ersetzen, steht als **Geschmacks**-Änderung offen, nicht als
  Reparatur.

---

## Stand 2026-08-04 (später) — Kontrast: 21 von 26 Beanstandungen behoben

**Rolle:** Pflege-Sitzung (Klaus' Auftrag: „die 12 MB Bilder mit dem Kontrast").

### Die 12 MB Bilder gibt es nicht mehr — sie waren schon erledigt

Der Auftrag stammte aus einem Befund am **alten** Stand: fünf PNG-Dateien mit
rund 12 MB hingen in der Startseite. Auf `origin/main` liegen dort längst
WebP-Fassungen — **zusammen 408 KiB**:

| Datei | Größe |
|---|---|
| `assets/meilenstein-2026-07-23-web.webp` | 117 KiB |
| `assets/meilenstein-2026-07-10-web.webp` | 97 KiB |
| `assets/meilenstein-2-web.webp` | 67 KiB |
| `assets/meilenstein-1-web.webp` | 63 KiB |
| `assets/meilenstein-web.webp` | 61 KiB |

Nichts zu tun. Festgehalten, damit die nächste Sitzung nicht dieselbe Sackgasse
sucht — und als Beleg für die Sitzungsstart-Pflicht ganz oben in CLAUDE.md: der
Befund war eine Aussage über einen Stand, der schon nicht mehr galt.

### Der Kontrast: `--dim` war die Ursache für 21 der 26 Fundstellen

Gemessen gegen den Seitengrund `#08081A`:

| | vorher | Verhältnis | nötig | jetzt |
|---|---|---|---|---|
| `--dim` | 0.36 | **3,08 : 1** | 4,5 : 1 (ab 0.47) | **0.50 → 4,99 : 1** |

Betroffen waren `.card-tag`, `.mod-num` und `.module-list-divider`. Der Wert
0.50 statt der nötigen 0.47 gibt etwas Luft und hält die Abstufung sauber:
voll 1.0 > `--muted` 0.62 > `--dim` 0.50.

### Neuer Wächter — und warum es ihn brauchte

`tests/smoke_lighthouse_module.mjs` rechnete schon Kontrast, aber über
`--sbkim-widget-fg-dim` — die Variable des **Widget-Moduls**. Die Seite hat eine
eigene, gleichnamige Idee (`--dim` in `index.html`), und die war **nie gedeckt**.
Der Test liest sie jetzt direkt aus `index.html` (keine zweite Zahlenliste, die
auseinanderläuft) und prüft dreierlei: `--dim` ≥ 4,5 : 1, `--muted` ≥ 4,5 : 1,
und dass `--dim` leichter bleibt als `--muted` — sonst „repariert" eine spätere
Sitzung den Kontrast, indem sie beide gleichzieht, und die Seite verliert ihre
Tiefe.

**Gegenprobe:** `--dim` auf 0.36 zurück → die Probe fällt durch mit
„abgeblendete Seiten-Schrift 3.08:1 (Soll 4.5)". 23 grün statt 17.

### Gemessen (drei Läufe, Bau-Maschine)

| | Wert |
|---|---|
| Leistung | 72 · 72 · 72 |
| Barrierefreiheit | 93 (unverändert — siehe unten) |
| CLS | 0 |

Die Zahl bleibt bei 93, weil vier Fundstellen offen sind. Das ist **kein**
Fehlschlag der Reparatur: 21 von 26 sind weg, die restlichen vier hängen an
einer heiligen Tafel.

### ⚠ OFFEN — Anpassungs-Antrag an Klaus (Tafel-Evolutions-Klausel)

Die vier verbliebenen Fundstellen sind `.badge`-Elemente in der Modul-Liste.
Sie tragen die **Status-Farben** aus `docs/INTERFACES.md §5` — der Tafel, die
sich selbst als „die **eine Quelle**" bezeichnet und exakte Hex-Werte nennt,
„identisch verwendet" in Markdown-Karten, Mermaid-Diagrammen, dem PULS-Pie und
der Sage-Page.

Gemessen gegen `#08081A`:

| Status | Hex | Verhältnis | |
|---|---|---|---|
| schablone | `#92400E` | **2,79 : 1** | zu dunkel |
| stub | `#2563EB` | **3,83 : 1** | zu dunkel |
| werkstatt | `#EA580C` | 5,57 : 1 | ok |
| fertig | `#16A34A` | 6,01 : 1 | ok |
| spec | `#CA8A04` | 6,74 : 1 | ok |
| nextup | `#F4B435` | 10,78 : 1 | ok |

Zwei von sechs Farben sind auf dunklem Grund nicht lesbar genug. **Nicht
stillschweigend geändert** — die Tafel bindet die Werte. Klaus entscheidet;
drei Wege standen in der Chat-Antwort (Farben aufhellen / Abzeichen umbauen /
liegen lassen).

### ✅ Erledigt am selben Tag — Klaus: „machen wir bei Sage Protokoll die Statusfarben"

**Barrierefreiheit jetzt 100** (von 93 über 97 auf 100, drei Läufe bestätigt).

**Was gemacht wurde.** Der Kern des Befundes war eine **Doppelrolle**: dieselbe
Farbe ist *Füllung* (Punkt, Modul-Lampe, Mermaid-Knoten) **und** *Schrift* im
`.badge`. Als Füllung ist ein dunkles Braun gut; als Schrift auf Dunkel fällt es
durch. Ein Hexwert kann beide Rollen nicht gleich gut bedienen — das ist keine
Meinung, sondern die Rechnung.

Beide durchgefallenen Farben sind auf **demselben Farbton** aufgehellt worden:

| Status | alt | neu | Badge-Schrift | Weiß auf Füllung |
|---|---|---|---|---|
| schablone | `#92400E` | **`#A9714B`** | 2,88 → **5,01 : 1** | 7,09 → 4,08 |
| stub | `#2563EB` | **`#4479EE`** | 3,95 → **5,07 : 1** | 5,17 → 4,03 |

Die anderen vier bleiben unverändert. Zwei Nebenbedingungen wurden mitgeprüft:

- **Unterscheidbarkeit.** Braun wird beim Aufhellen zu Orange — und Orange ist
  schon `werkstatt`. Deshalb ein gedämpftes Erdbraun (ΔE 49,7 zu `#EA580C`),
  kein helles Orange.
- **Weiß auf Füllung** (Mermaid) sinkt zwar, liegt mit 4,08 / 4,03 aber
  **über** `werkstatt` (3,56), `fertig` (3,30), `spec` (2,94) und `nextup`
  (2,15). Die Diagramme werden dadurch nicht schlechter, sondern gleichmäßiger.

**Tafel zuerst, dann Code** (INTERFACES-Regel eingehalten): `docs/INTERFACES.md
§5` trägt jetzt die neuen Werte, die Messung, die Regel für Folge-Sitzungen
(„eine Status-Farbe wird in **beiden** Rollen gemessen") und eine **Abgrenzung**
— die `classDef`-Zeilen in den Komponenten-Karten (00/03/08/12/14/15) benutzen
dieselben Hexwerte für *Diagramm-Rollen* (`agent`, `pwa`, `store`, …), haben mit
Modul-Status nichts zu tun und bleiben unangetastet. Nachgezogen wurden
`index.html` (CSS-Variablen + `STATUS_META` + Lampen-Schein) und
`docs/ARCHITEKTUR.md` (Bau-DAG). Der PULS-Pie führt keine Hexwerte.

**Die letzten drei Punkte** (97 → 100) waren etwas anderes:
`link-in-text-block` (Gewicht 7) — der Verweis in `.legal-line` hob sich
**allein durch die Farbe** ab. Jetzt unterstrichen. Übrig bleibt nur
`label-content-name-mismatch` mit **Gewicht 0** — kostet keinen Punkt.

**Wächter** (`tests/smoke_lighthouse_module.mjs`, 23 → **40 Proben**): liest die
sechs Werte **aus `index.html`** (keine zweite Liste = keine zweite Wahrheit),
rechnet jede als Badge-Schrift nach, vergleicht CSS-Variable gegen `STATUS_META`
(die stehen 2000 Zeilen auseinander und driften sonst lautlos) und prüft den
Farbabstand schablone↔werkstatt.

**Gegenprobe, beide Richtungen:** `#92400E` zurückgesetzt → 2 rot (Kontrast +
Abweichung zur JS-Karte). Braun „repariert" zu Orange `#E86A18` → 1 rot
(ΔE 9,4). Der Wächter greift also wirklich, nicht nur formal.

**Nebenbefund, nicht geändert:** `--status-nextup` steht in `index.html` auf
`#F4B435`, die Tafel nennt `#F59E0B`. Beide bestehen den Kontrast; es ist eine
reine Doku-Drift. Nicht angefasst, weil es eine Farbe ändern würde, die Klaus
sieht — eigener kleiner Folge-Schritt.

**Werkzeug verbessert:** `family-project/tools/lh-messen.mjs` nennt jetzt **alle**
durchgefallenen Prüfungen der Barrierefreiheit statt einer fest eingebauten
Auswahl. Die alte Liste hat genau die Beanstandung versteckt, die man noch nicht
kannte — bei 97 statt 100 suchte man im Dunkeln.

---

## Stand 2026-08-04 — Sage-Page: CLS 0,328 → 0, Leistung 45 → 67

**Rolle:** Bau-/Pflege-Sitzung (Sage-Page-Leistung). Zwei Eingriffe, jeder einzeln gemessen.

### 1. Der CLS kam nicht von der Schrift — er kam vom eigenen Siegel

Der Bericht nannte nur `div.wrap 0,326`. Das ist der Container, nicht die Ursache.
Ein `PerformanceObserver` auf `layout-shift`, der **vor** dem Laden hängt und das Feld
`sources` ausliest (gedrosselt wie die echte Messung), zeigte etwas Eindeutiges:
**ein einziger Sprung, bei 17,4 s.**

`fonts.ready` lag bei **15,5 s** — also *davor*. Der Verdacht auf die Google-Fonts-
Einbindung war damit **widerlegt**, bevor eine Zeile Code geschrieben wurde.

Der Sprung kam vom **SBKIM-Siegel selbst**. Modul 16 hängt sein 40 px hohes Badge erst
nach dem ganzen Modul-Stapel in `.lamps`. Die Topbar (`flex-wrap`) wuchs dadurch um eine
Zeile — die Messung zeigt den „Frisch laden"-Knopf um **72 px nach unten** in eine neue
Reihe rutschen — und schob `div.wrap` um **32 px**. Ein Viertel der Leistungsnote, aus
einem Element, das die Seite sich selbst anheftet.

Modul 16 kennt für genau diesen Fall einen **vor-injizierten Anker** (Option β, im
Modul-Kopf dokumentiert). `index.html` legt ihn jetzt leer in `.lamps`, `sbkim-init.js`
zeigt mit `badgeSelector` darauf. Der Platz steht ab der ersten Zeichnung.

**Das Sicherheits-Modul bleibt unangetastet.** Anti-Greenwashing gilt weiter: ohne
Zertifizierung füllt Modul 16 den Anker nicht — es wird kein Siegel gezeigt, nur Platz
gehalten.

### 2. Schriften selbst gehostet

Vorher blockierte ein `<link>` auf `fonts.googleapis.com` das erste Zeichnen um rund
750 ms, samt DNS/TLS und einem **zweiten** Ursprung für die Dateien selbst. Genau das
steckte in Klaus' Server-Messung als „Verzögerung beim Rendering des Elements"
**1.950 ms** am LCP-Element `p.hero-claim` — reiner Text.

Jetzt liegen vier `woff2` unter `assets/fonts/` (es sind **variable** Schriften, eine
Datei je Schnitt deckt 300–700 bzw. 400–500 ab), die `@font-face`-Regeln stehen im
vorhandenen `<style>`. Vorabgeholt werden nur die beiden `latin`-Dateien (52 KiB); die
`latin-ext`-Fassung holt der Browser nur, wenn ein Zeichen aus ihrem `unicode-range`
vorkommt — bei deutschem Text nie.

**Nebenbefund, der die alte Messlage erklärt:** auf der Bau-Maschine kam Google Fonts
**nie an**. `fonts.ready` bei 15,5 s, und *keine einzige* Schrift geladen. Die Seite hat
also durchweg in der Systemschrift gezeichnet. Jetzt sind beide Schriften nach **789 ms**
da. Die Seite hält ihr Offline-Versprechen erstmals auch bei den Schriften.

### 3. Verworfen — den Modul-Stapel zurückstellen

Aufgabe 2 des Briefs (BLP-Muster: 25 Modul-Dateien ans `load`-Ereignis, `async=false` für
die Reihenfolge) wurde gebaut und gemessen: **LCP 7,6 s → 8,4 s, kein Punkt gewonnen**,
reproduzierbar über drei Läufe. **Zurückgenommen.** Der Grund gehört in den nächsten Brief:
der kritische Pfad ist real, aber am Ende des `<body>` blockieren die Skripte das Zeichnen
schon heute nicht — sie später zu holen verschiebt nur ihre Kosten hinter den LCP-Zeitpunkt.

### Zahlen (Bau-Maschine, je 3 Läufe, gleiche Maschinenlage)

| Zustand | Leistung | CLS | LCP |
|---|---|---|---|
| `origin/main` | 45 · 45 · 45 | 0,328 | 7,1 s |
| nur Platz-Anker | 61 · 61 · 59 | **0** | 7,1 s |
| + Schriften selbst gehostet | **66 · 67 · 69** | **0** | 7,6 s |
| (verworfen) + Stapel zurückgestellt | 62 · 63 · 64 | 0 | 8,4 s |

Der Ausgangswert wurde in derselben Maschinenlage frisch nachgemessen (`git archive
origin/main`), nicht aus dem alten Protokoll übernommen — eine erste Messreihe hatte
zwischen 34 und 60 geschwankt, das war Maschinenlärm.

### Beweise

- **CLS-Ursache:** ein einziger Sprung, mit Quell-Element und Zeitpunkt. Gegenprobe nach
  dem Eingriff: **0,0000 aus 0 Sprüngen.**
- **Siegel funktional gegengeprüft** (Chromium, `serviceWorkers: "block"`): Anker gefüllt,
  `role=button`, `tabindex=0`, `data-stufe="gold"`, 40 × 40 px, Modal öffnet auf Klick,
  **keine Seitenfehler**.
- **Tests 64 von 66 grün.** Die zwei roten (`smoke_bau23_0b_identitaet`,
  `smoke_bau23c_ki_richter`) sind per Gegenprobe **auch auf blankem `origin/main` rot** —
  vorbestehend. Nebenbei: 21 Tests scheiterten zunächst nur an der fehlenden
  Test-Abhängigkeit `fake-indexeddb`; nach `npm install fake-indexeddb --no-save` laufen sie.
  **Das gehört in die Sitzungs-Vorbereitung** — sonst hält man 21 gesunde Tests für kaputt.

### Was offen blieb / nicht geprüft

- **Klaus' Browser-Sichttest.** Besonders: sitzt das Siegel in der Topbar noch richtig, und
  wirkt die Seite mit der jetzt wirklich geladenen Geist-Schrift wie gewohnt?
- **Nachmessung am echten Server** — der Ausgangs-Proxy dieser Umgebung verweigert
  `github.io` (403). Alle Zahlen stammen von der Bau-Maschine.
- **Der Schrift-Gewinn ist lokal untertrieben.** Die Bau-Maschine erreichte Google Fonts
  gar nicht, der Ausgangszustand hat die 52 KiB also nie bezahlt. Trotzdem stieg die Note
  von 61 auf 67. Am Server, wo die Schriften wirklich über den fremden Ursprung kommen,
  sollte der Gewinn **größer** sein — belegt ist das aber erst nach Klaus' Messung.
- **`docs/papers/sbkim-paper-de.html` und `-en.html`** binden weiterhin Google Fonts ein
  (andere Familien: Source Serif 4, Source Code Pro, Inter). Bewusst nicht angefasst —
  eigener Umfang.
- **BookLedgerPro `wss://relay.family-projekt.de/` nicht auflösbar:** Klaus' Antwort
  (2026-08-04) — **das Relais soll wieder aufgesetzt werden, nichts ändern.** Bleibt
  unverändert stehen.
- **Kritischer Pfad / Hauptthread** der Sage-Page bleibt offen (Klaus' Bericht: 2.662 ms
  bzw. 4,4 s). Der einfache Weg (Zurückstellen) ist gemessen widerlegt; der nächste Ansatz
  müsste an der Menge ansetzen, nicht am Zeitpunkt.

**Nächster sinnvoller Schritt.** Klaus' Server-Messung abwarten und gegen die 67 halten —
erst danach lohnt der nächste Leistungs-Eingriff.

---

## Stand 2026-08-03 — Lampen-Leiste barrierefrei (netzweit) + Sage-Page-Bilder 16,2 MB → 0,7 MB

**Rolle:** Bau-/Pflege-Sitzung (Kanon Modul 17 + 23 UI, netzweiter Rollout, Bild-Pflege).

**Was getan.**

*Modul 17 + 23 UI — drei Mängel, jeder einzeln gemessen.* Lighthouse meldete an
BookLedgerPro Kontrast und Berührungsziele an der Lampen-Leiste.
1. **Berührungsziele:** Lampen-Knöpfe 54,5 × 18,6 px, die kleinen `−`/`✕` 18 × 18 px —
   Norm ist 24 × 24. Jetzt `min-height: 24px` an den Slots (NUR die Höhe; ein `min-width`
   bräche das Zusammenschieben im minimierten Zustand) und 24 × 24 an den Knöpfen.
2. **Der 🌐-Knopf lag AUF der Leiste.** Auf 412 px Breite reicht die Leiste bis nach links;
   der Knopf unten links lag mitten auf der LEBT-Lampe, nur 8,2 px blieben frei. Das war die
   eigentliche Ursache dafür, dass der Prüfer beide Elemente zugleich meldete. **Klaus'
   Entscheid:** der Knopf rückt unter 560 px hoch (Modul 23 UI, eingehängte Medien-Abfrage
   mit `!important`, weil die Position inline am Element steht).
3. **Dadurch wurde ein verdeckter Mangel sichtbar:** der Knopf schrieb in der Akzentfarbe
   der App — bei BookLedgerPro dunkles Petrol auf dunklem Grund, **1,35:1** statt 4,5:1.
   Jetzt dieselbe Schriftfarbe wie das Panel, Akzent bleibt als Rahmen.

*Befund beim Rollout (wichtig).* Mein-Rezeptbuch, Muttis-Rezeptbuch und Mein-Mixarium trugen
seit 2026-06-28 einen **eigenen** Fix, der nie in den Kanon zurückkam: app-eigene
`localStorage`-Schlüssel (`WIDGET_SCOPE`). Ein byte-1:1-Rollout hätte ihn stillschweigend
ausgebaut. Er wurde **zuerst in den Kanon geholt** — der Kanon ist jetzt die Obermenge, die
übrigen zehn Träger bekommen den Fix mit dazu. (CLAUDE.md § Fremdnutzer-Brille verlangt genau
das.) Gefunden wurden zwei Träger übrigens **nur** über einen Inhalts-Abgleich aller
`.js`-Dateien: Kim-Bell und Mein-WorkFloh führen das Modul unter dem Namen
`sbkim-floating-widget.js` — die Suche nach Dateinamen hätte sie übersehen.

*Sage-Page-Bilder.* Klaus' Bericht: 17,4 MB Gesamt-Nutzlast, davon 16,2 MB Bilder. Die
Meilenstein-Kacheln luden Bildschirmfotos mit 1254 × 1254 und je ~2,2 MB — dargestellt als
312 × 312 große Kachel-Hintergründe. Über den vorhandenen Chromium in WebP umgerechnet
(kein cwebp/PIL/sharp in dieser Umgebung): **16.236 KiB → 688 KiB**. Die Originale bleiben
liegen, sie sind aus Doku-Dateien verlinkt; geändert wurde nur, worauf die Seite zeigt.

**Zahlen.**

| | vorher | nachher |
|---|---|---|
| BookLedgerPro Barrierefreiheit | 92 | **100** |
| BookLedgerPro Leistung (Median aus 3) | 88 | **91** |
| BookLedgerPro LCP (echt gedrosselt, je 5 Läufe) | 1.748 ms | **1.028 ms** |
| Sage-Page LCP | 48,8 s | **7,1 s** |
| Sage-Page Bilder | 16,2 MB | **0,7 MB** |

**Tests.** `smoke_bau17` 38/38, `smoke_bau23_rendezvous_ui` **91/91** (4 neue Proben für die
Ausweich-Regel; **Gegenprobe**: ohne den Fix fallen genau diese 4), `smoke_bau23_rendezvous`
59/59, `smoke_bundle_connect` 21/21. Die DOM-Attrappe im 23-UI-Smoke kannte kein
`setAttribute`/`getElementById` — nachgezogen. Netzweite Verifikation nach den Merges:
**29/29 Dateien in 15 Repos tragen den Kanon, 0 Abweichungen.**

**Was offen blieb.**
- **Klaus' Browser-Sichttest** überall. Besonders: sitzt der 🌐-Knopf auf dem Handy gut, und
  sehen die verkleinerten Sage-Page-Kacheln noch scharf aus?
- **Der Ausgangs-Proxy dieser Umgebung verweigert `github.io` (403)** — die Nachmessung am
  echten Server konnte ich nicht selbst machen. Alle Zahlen stammen von der Bau-Maschine.
- **Sage-Page CLS 0,328** — das ist jetzt der mit Abstand größte Posten (ein Viertel der
  Note) und der Grund, warum die Leistung trotz LCP 48,8 s → 7,1 s nur von 44 auf 45 steigt.
  Der Sprung kommt laut Bericht aus `div.wrap`; der Verdacht liegt auf der **Google-Fonts-
  Einbindung** (blockiert 780 ms, Schrift tauscht nach dem ersten Anstrich). Nicht angefasst
  — das gehört gemessen, nicht geraten.
- **Sage-Page lädt ~25 Modul-Dateien und Dutzende `spore.json`/`SIGNAL.json` sofort**
  (kritischer Pfad 2.662 ms). Eigene Sitzung wert.
- **BookLedgerPro:** die Konsole meldet `wss://relay.family-projekt.de/` als nicht
  auflösbar. Kostet Punkte bei „Gute Praxis"; **Infrastruktur-Frage an Klaus**, bewusst
  nichts geändert.

### Nachtrag — Klaus' Server-Messung der Sage-Page (2026-08-03, 23:03, mobil)

Die erste Messung **am echten Server** nach dem Merge (PageSpeed Insights,
`lausiklauskn-png.github.io/Sage-Protokol/`, Mobil):

| | Server 23:03 | Bau-Maschine |
|---|---|---|
| Leistung | **47** | 45 |
| Barrierefreiheit | 93 | 93 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |
| FCP | 4,2 s | — |
| LCP | 9,2 s | 7,1 s |
| TBT | **0 ms** | 50 ms |
| CLS | **0,326** | 0,328 |

**Was das belegt — und was nicht.**

- **Server und Bau-Maschine liegen für diese Seite eng beieinander** (47 gegen 45,
  CLS 0,326 gegen 0,328). Damit ist die lokale Messanlage für die Sage-Page
  belastbar; man muss nicht für jeden Schritt auf Klaus warten. Das ist dasselbe
  Bild wie beim Schaufenster (zwei Punkte Abstand).
- **Der CLS ist am Server bestätigt.** 0,326 — das ist ein Viertel der Note und
  mit Abstand der größte verbliebene Posten. Die Diagnose stimmt also, sie war
  kein Artefakt der Bau-Maschine.
- **TBT ist am Server 0 ms** (lokal 50). Der Hauptthread ist nicht das Problem.
- **Ehrlich offen:** es gibt **keine** Server-Zahl von VOR der Bild-Pflege. Die
  Verbesserung LCP 48,8 s → 7,1 s ist damit **nur auf der Bau-Maschine belegt**,
  nicht am Server. Was ohne Messung feststeht: die Seite holt jetzt **0,7 MB statt
  16,2 MB** Bilder — das ist eine Eigenschaft der Dateien, keine Schätzung.
- Der LCP liegt am Server 2 s höher als lokal (9,2 gegen 7,1 s). Das passt zu
  echter Latenz und dem, was der kritische Pfad zeigt (2.662 ms, ~25 Modul-Dateien
  und Dutzende `spore.json`-Abrufe beim Start).

**Nächster sinnvoller Schritt.** Sage-Page CLS 0,326 einkreisen (zuerst messen, welches
Element wann springt), dann die Schrift-Einbindung entscheiden. Der Wert ist jetzt
beidseitig — lokal und am Server — bestätigt.

---

## Stand 2026-08-02 — Pinnwand: Lighthouse-Verbesserungen aus Kimboard nachgezogen

**Rolle:** Pflege-Sitzung · **Branch:** `claude/mein-rezeptbuch-lighthouse-w26lsr`

**Was getan.** Die drei Befunde aus Klaus' Kimboard-Lighthouse-Bericht (dort PR
#83) auf die **Pinnwand** übertragen — sie hatte dieselben Stellen, weil
Kimboard aus ihr hervorgegangen ist.

1. **Das Logo war 474 KiB groß für ein 64-Pixel-Bild.** Oben hing
   `icon-512.png`, dargestellt mit 64 px; dazu `icon-192.png` (77 KiB) als
   Tab-Symbol. Neu: **`icon-128.png` (37 KiB) für beides** — gleiche Adresse,
   ein Download. Die Datei ist **byte-gleich** zu Kimboards (die Symbole sind
   in beiden Repos dieselben, sha256 stimmt überein). Die großen Dateien
   bleiben unberührt; sie gehören ins Manifest, wo das Betriebssystem sie beim
   Installieren wirklich braucht.
2. **Die Seite sprang beim Laden.** Die Relais-Leiste stand **leer** im HTML
   und wurde erst von `relayPills()` gefüllt — also erst, wenn die Modul-Kette
   geladen war. Neu steht sie fertig im HTML, im voreingestellten Zustand,
   wörtlich so wie der Code sie gleich darauf erzeugt. Dazu `#me`/`#selftest`
   auf ihre Endbreite festgehalten (die Kennung wächst von 1 auf 13 Zeichen).
3. **Die App-Schale holte Dinge doppelt.** Das Dokument kam dreimal
   (Navigation auf `/`, plus `./` und `./index.html` im Vorrat — für den Cache
   drei Adressen, dieselbe Datei), und der Vorrat holte beide großen Symbole,
   die die Seite gar nicht zeigt. `CACHE_VERSION` v19 → v20.

Nebenbei: fünf Bedienelemente hatten keinen Namen für Vorlese-Programme
(`boardkey`, `qmsg`, `judgeprov`, `judgekey`, `webllmmodel`), und die Seite
hatte keinen `<main>`-Bereich. Beides ergänzt, sichtbar ändert sich nichts.

**Gemessen** (Erstbesuch, leeres Profil, Server mit GitHub-Pages-Kopfzeilen —
`max-age` + ETag):

| | vorher | nachher |
|---|---|---|
| vom Server ausgeliefert | 820 KiB | **227 KiB** (−593, −72 %) |
| Layout-Sprung (CLS) | 0,178 | **0,002** |

**Gegenproben.** (a) Offline starten `/`, `/index.html` und `/impressum.html`
alle drei aus dem Cache, Relais-Leiste sofort da. (b) Ein zusätzliches Relais
im `RELAY_POOL`, ohne das HTML nachzuziehen, macht **drei Proben rot** — die
neue Probe 7 schlägt also wirklich an, sie ist nicht nur grün. (c) Das
Vorher/Nachher wurde am **selben** Server gemessen, per `git stash` umgeschaltet.

**Preis der Lösung, offen benannt.** Die Relais-Liste steht jetzt an **zwei**
Stellen (HTML + `RELAY_POOL`). Wer eine ändert und die andere vergisst, baut
eine stille Lüge in die Seite — sie zeigte beim Start etwas anderes als eine
Sekunde später. `pinnwand/_smoke.mjs` **Probe 7** vergleicht beide und wird
rot. Diese Probe gehört untrennbar zur Lösung.

**Eine eigene Fehlannahme, korrigiert.** In Kimboard war zwischenzeitlich eine
Verzögerung eingebaut (Vorrat erst nach `load`). Grundlage war eine Messung von
3529 KiB — gegen einen Prüf-Server **ohne** Cache-Kopfzeilen. Gegen einen
Pages-ähnlichen Server war der Unterschied dann **exakt null**: der Browser legt
gleichzeitige Anfragen für dieselbe Adresse von selbst zusammen. Die
Verzögerung wurde wieder ausgebaut. **Merksatz** (steht im Kopf beider `sw.js`):
*einen Prüf-Server ohne Cache-Kopfzeilen zu benutzen, misst nicht die Seite,
sondern den Prüf-Server.*

**✅ NACHGETRAGEN 2026-08-02 19:55 — Klaus' Messung bei Googles PageSpeed
(mobil), an der live deployten Seite:**

| Leistung | Barrierefreiheit | Best Practices | SEO |
|---|---|---|---|
| **100** | **100** | **96** | **100** |

Damit ist der Browser-Lauf erledigt und die Vorhersage bestätigt — die
headless gemessene Ersparnis (820 → 227 KiB) und der beseitigte Sprung
(0,178 → 0,002) schlagen tatsächlich durch. Die fehlenden 4 Punkte bei „Best
Practices" sind aller Wahrscheinlichkeit nach genau die **Relais-Fehler in der
Konsole**, die bewusst NICHT angefasst wurden (die Meldung „WebSocket
connection failed" kommt vom Browser selbst und ist aus dem Code nicht zu
unterdrücken). Das ist keine Nachlässigkeit, sondern die benannte Grenze —
und sie kostet vier Punkte.

**Was offen bleibt.**
- **Die Relais-Fehler in der Konsole** (`nos.lol`, `damus`, `nostr.band`,
  `primal`, `family-projekt.de`) wurden **nicht** angefasst: die Meldung
  „WebSocket connection failed" kommt vom Browser selbst und ist aus dem Code
  nicht zu unterdrücken. Vier der fünf sind bekannte, funktionierende
  öffentliche Relais. `relay.family-projekt.de` ist das bekannte tote eigene
  und liegt weiter bei Klaus.
- Ein Rest-Sprung von 0,002 kommt von zwei Auswahlfeldern, die beim Füllen ein
  paar Pixel breiter werden. Dafür müsste eine Breite geraten werden.

**Nächster sinnvoller Schritt.** Klaus misst die Pinnwand bei PageSpeed nach.
Danach dieselben drei Stellen an den übrigen Endknoten prüfen — das Muster
(zu großes Logo · leere Bereiche, die später gefüllt werden · `./` und
`./index.html` beide im Vorrat) ist offenbar netzweit kopiert worden.

**Prüfungen:** `node pinnwand/_smoke.mjs` **67/67** (vorher 62/62, fünf neue),
`node tests/smoke_pinnwand_dm.mjs` 16/16.

---

## Stand 2026-07-31 — Tafel-Anpassung: Vektoren für den offenen Marktplatz

**Rolle:** Pflege-Sitzung · **Branch:** `claude/modul23-stufe2b-rollout-vpzaar`

**Was getan.** Die Tafel in `docs/components/_toolpoint_marktplatz.md` („Keine
Vektoren im Listing — `passageVec` lazy zur Laufzeit") wurde **mit Klaus'
ausdrücklicher Zustimmung** angepasst, nicht still umgangen. Neu gilt gestaffelt:
unter ~20 Einträgen weiter lazy (so bleiben die Sage-Korpora), für den **offenen
Marktplatz** vorberechnete Vektoren in einer getrennten, faul geladenen
Katalog-Datei mit Modell-Kennung und Rückfall auf den lazy Weg.

**Warum.** Die alte Fassung entstand für 14 Sage-Knoten. `markt.html:396` rechnet
die Passagen-Vektoren bei **jedem Besuch neu** (nur RAM); bei 100 fremden Apps
sind das grob 3–8 Sekunden pro Besuch, wachsend. Wer sich listen lässt, um
gefunden zu werden, verliert genau daran. Beide Sorgen der alten Tafel bleiben
bedient: `listings.js` wächst nicht (getrennte Datei), und die Modell-Kennung plus
ein Quellen-Hash halten das Paket re-embedding-fest. Gemessen: ein 384er-Vektor ist
als JSON 8.025 Bytes, int8-quantisiert ~530 Bytes, Cosinus-Fehler unter 0,00005.

**Zusammenhang.** Vorbedingung für Stufe 1 des family-project-Vorhabens
„Katalog-Spore" (fremde Apps sollen gefunden werden, auch wenn sie geschlossen
sind). Stufe 4 dieses Plans ist bereits gebaut: Melde-Knopf an jedem
Marktplatz-Eintrag + Haftung für fremde Links im Impressum (family-project PR #136,
22/22 grün).

**Was offen.** Stufe 1 (Vektor-Paket) ist noch nicht gebaut, nur die Tafel ist frei.
Weiter offen: Spore-Adresse je Eintrag, täglicher Wächter mit gestufter Reaktion,
Lighthouse-Güte, längerer Relais-Blick, Gast-Pillen auf der Mycel-Karte,
Aufräum-Frist auf dem Relais.

**Befund am Rande (nicht behoben):** Diese Datei hat **7816 Zeilen** und liegt damit
weit über der eigenen 3000-Zeilen-Grenze aus dem Kopf-Abschnitt. Die Tafel verlangt
Auslagern ins Archiv statt Kürzen. Das ist eine eigene Pflege-Sitzung wert.

**Nächster sinnvoller Schritt.** Stufe 1 in family-project: geteilter Codec
(`assets/vec-codec.js`) mit Headless-Test, danach die Leseseite in `markt.html`.

## Stand 2026-07-30 (späte Nacht) — Die halbe Kennung heißt jetzt so (11 Repos)

**Rolle:** Bau-Sitzung (Fortsetzung 0b) · **Branch:** `claude/halbe-kennung-benennen`
**Gemergt:** Sage #759 · Kimboard #64 · Kimseek #51 · BookLedgerPro #294 ·
Mein-Tresor #86 · Jasons-Tresor #144 · family-project #129 · Mein-Rezeptbuch #355 ·
Muttis-Rezeptbuch #168 · Mein-Mixarium #169 · Tomys-Hub #132

### Der Befund kam aus Klaus' Browser (18:54/18:55)

Drei Stellen gaben **drei verschiedene Antworten auf dieselbe Frage**:

| Stelle | Aussage |
|---|---|
| Statuszeile | `Meine Kennung: noch keine (erst verbinden)` |
| Einspielen | „In diesem Browser liegt schon eine Kennung. Einspielen ERSETZT sie." |
| Sicherung | erst **nach** dem Passwort: „Identität 'main' hat noch keine Spore" |

Alle drei hatten recht. Es ist ein **Zwischenzustand**: der Schlüssel liegt im
Browser, die Visitenkarte (Spore) fehlt noch. Nur hatte ihn niemand benannt —
und ausgerechnet die Sicherung meldete ihn erst, nachdem Klaus zweimal ein
Passwort getippt hatte.

### Was gebaut wurde

Alles in `src/modules/23_rendezvous_ui.js` (Kanon, jetzt sha `f2cf79c9defb`):

- `readIdentityState()` liest zusätzlich `getOwnSpore()` → `hasSpore`
- die Statuszeile nennt den Zustand — **„⚠ Angefangene Kennung: der Schlüssel
  liegt hier, die Visitenkarte (Spore) fehlt noch."** — samt Ausweg (einmal
  „🌐 Mit dem Knotennetz verbinden", oder im Siegel Schritt 2 „Spore erzeugen")
- `openBackupForm()` prüft **vor** der Passwort-Eingabe statt danach

REINE UI-Schicht über die **öffentlichen** Flächen von Modul 02. Kern-Module
01/02/05/05b/23 unangetastet, kein `PROTOCOL_VERSION`-/`DB_VERSION`-Bump,
0.80-Andock-Riegel unberührt, fail-soft ohne Modul 02.

### Beweis

| Lauf | Ergebnis |
|---|---|
| `smoke_bau23_0b_identitaet.mjs` | **49/49** (Proben `0b/8` neu) |
| **GEGENPROBE** `SBKIM_0B_SABOTAGE_HALF=1` (neu) | **45/49 — genau die vier neuen fallen** |
| GEGENPROBE `SBKIM_0B_SABOTAGE=1` | 45/49 |
| GEGENPROBE `SBKIM_0B_SABOTAGE_WATCH=1` | 47/49 |
| `smoke_bau23_rendezvous_ui` / `_rendezvous` / `bau23c` / `bundle_connect` | 87 · 59 · 28 · 21 |
| Kimboard · Kimseek | 6/6 · 11/11 (sha-Pins nachgezogen) |
| **GEGENPROBE Drift-Guard** (eine Zeile an die Kimboard-Kopie angehängt) | **5/6 — er beißt** |
| BookLedgerPro · Mein-Tresor · Jasons-Tresor · Mein-Rezeptbuch | 2153/0 · 53/0 · 59/0 · 7/0 |
| Mein-Mixarium (4 Suiten) | 8 · 11 · 14 · 7 |
| Tomys-Hub (8 Suiten) | 35 · 38 · 19 · 15 · 9 · 16 · 31 · 11 |

**Netzweite Nachprüfung auf `main`** (die Lehre aus dem Nachzug-Fehler): alle
**12 Träger** der Datei auf `f2cf79c9defb` — Sage `src/` + `sbkim-bundle/` und
die zehn Apps. Company-Brain, Privat-Brain, SB-KIMTool-Point und Mein-WorkFloh
wurden **ausdrücklich mitgeprüft** und tragen die UI-Datei nicht (0 Kopien) —
keine stillschweigende Auslassung.

**Gegenprobe, dass der parallel gelaufene 2b-Rollout nicht überschrieben wurde:**
`23_rendezvous.js` = `3caa0bb1fbe7` und `16_siegel.js` = `4e11ef0d0390` stehen
in allen Apps unverändert auf `main`.

**Nicht geprüft — ehrliche Grenzen:**

- **Muttis-Rezeptbuch** hat keine Test-Suite; **family-project** braucht
  `playwright-core` und hat keine `package.json`. Beide tragen eine per sha256
  gegen den Kanon geprüfte byte-identische Kopie.
- **Tomys-Hub `smoke-spore-download.cjs`** fällt weiterhin (Playwright-Timeout).
  **Vorbestehend** — in der vorigen Runde auf blankem `origin/main` gegengeprüft.
- **Der echte Browser-Pfad** — wartet auf Klaus.

### Klaus' 0b-Sichttest ist grün (18:57)

Sein Bild von 18:57 schließt den offenen Sichttest aus dem Nachmittag positiv ab:
`Meine Kennung: zmNI_S_bB7BimoGBTmd8l_FCOAqdNRDxiKnaEt3o2B0`, `Letzte Sicherung:
2026-07-30`, `✓ Sicherung erzeugt: sbkim-sicherung-kimboard-2026-07-30.json`,
Chrome meldet „Datei heruntergeladen (25,42 KB)". Und: **kein Aufräum-Knopf** —
bei einem Fach bleibt er weg, genau wie gebaut. Offen bleibt nur noch
**📥 Sicherung einspielen** mit genau dieser Datei.

Übergabeprotokoll: `docs/sessions/archiv/2026-07-30_halbe-kennung-benennen.md`.

## Stand 2026-07-30 (Nacht) — Schutz-Plan Stufe 2b NETZWEIT ausgerollt (13 Repos)

**Rolle:** Bau-Sitzung (Rollout aus `BRIEF_MODUL23_STUFE2B_ROLLOUT.md`).
**Branch:** `claude/modul23-stufe2b-rollout-vpzaar` (überall gleich).

### Was getan — Kartenechtheit + Flut-Deckel in ALLE Apps

Modul 23 (`23_rendezvous.js`, sha `3caa0bb1…`) + Modul 16 (`16_siegel.js`,
sha `4e11ef0d…`) byte-1:1 aus dem Kanon in **13 Repos** gebracht — alle 12 aus
dem Brief **plus** SB-KIMTool-Point (Forker-Vorlage, Befund siehe unten). Jede
App prüft jetzt Raum-Karten vor der Anzeige: **Bindung** (`spore.id===nodeId`)
+ **Ed25519** je Karte (Modul 02) + **Flut-Deckel** (200/Durchlauf, 3/Absender),
fail-soft (`cardsVerified:false` wenn Prüfer fehlt). Das ist der eigentliche
Spam-/Sybil-Schutz, nach dem Klaus fragte.

**Gemergt (14 PRs, alle squash, Freibrief):** Kimboard #63 · Kimseek #50 ·
BookLedgerPro #293 · Mein-Tresor #85 · Jasons-Tresor #143 · family-project #128 ·
Mein-Rezeptbuch #354 · Muttis-Rezeptbuch #167 · Mein-Mixarium #168 · Tomys-Hub
#131 · Company-Brain #10 · Privat-Brain #66 · SB-KIMTool-Point #138.
**Netz-Verifikation: 12/12 tragen den Kanon auf main, 0 Fehler.**

**sha-Pins nachgezogen:** Kimboard/Kimseek `test/smoke.test.js` (16+23),
Company-Brain `tools/drift-guard.mjs` (23). **Befund Privat-Brain:** dessen
`tools/drift-guard.mjs` pinnt auch `16_siegel.js` — der Brief nannte nur 23;
der 16-Pin war mechanisch zwingend mitzuziehen (sonst fällt der Drift-Guard).

### Zwei Befunde

1. **SB-KIMTool-Point (über den Brief-Scope hinaus, bewusst):** Der Brief nannte
   es nur als Siegel-Aspekt-Sonderfall und warnte, `assets/sbkim-siegel.js` nicht
   blind zu ersetzen — das ist aber nur der **Loader** (unberührt gelassen). Die
   echte Modul-Kopie liegt in `web/tools/`, mit `sbkim-rendezvous.js` auf der
   **alten** Gen `9f3a2085`. Nur den Siegel-Aspekt nachzutragen hätte das Siegel
   **lügen** lassen (Anti-Greenwashing-Leitplanke). Als Forker-Vorlage gehört der
   Schutz genau hier zuerst hin. Darum beide Dateien byte-1:1. `node --test` →
   120/120 grün (inkl. `kanon_import.test.js`, der byte-1:1 gegen den Kanon prüft).
2. **Parallel-Sitzung:** während des Rollouts mergte eine andere Sitzung
   „Aufräum-Knöpfe" (#758/#759 in Sage, analog in 10 Apps) — betraf nur
   `23_rendezvous_ui.js`, **nicht** meine Ziel-Dateien. Die 10 betroffenen App-
   Branches sauber neu von origin/main aufgesetzt (force-with-lease), 23_ui der
   Parallel-Sitzung unberührt übernommen. Kein Datei-Konflikt im Kern.

### Tests (ehrlich)

Kimboard 6/6 · Kimseek 11/11 · BookLedgerPro 2153/0 · Mein-Tresor 53/0 ·
Jasons-Tresor 59/0 · Mein-Rezeptbuch 7/0 · Mein-Mixarium 8·11·14·7 · Tomys-Hub
35·38·19·15·9·16·31·11 · Company-/Privat-Brain Drift-Guard grün (8 bzw. 15
byte-1:1) · SB-KIMTool-Point 120/120. Sage-Suite 59·87·**16**·42·21. Die
**Gegenprobe** (`smoke_bau23b_kartenechtheit.mjs` Probe 5: ohne Prüfer bleibt die
faule Karte sichtbar, `cardsVerified:false`; Probe 2/3/4: mit Prüfer fällt die
untergeschobene/ungültige Karte raus) grün.

**Bekannte Grenzen (nicht durch Rollout verursacht):** family-project ohne
`package.json`/playwright nicht lauffähig; Muttis-Rezeptbuch ohne Test-Suite
(Beweis = sha256-Kopie); Tomys `smoke-spore-download.cjs` + Company-/Privat-Brain
e2e = vorbestehender Playwright-Timeout (gegengeprüft).

### Was offen / nächster Schritt

- **Klaus' Browser-Sichttest** — headless ersetzt ihn nicht. Nach Deploy in
  einer App „👥 Wer ist im Raum?" öffnen; faule/fremde Karten dürfen nicht mehr
  erscheinen, ehrliche Zähler sichtbar.
- Sichttest 0b (Sicherung anlegen/einspielen → alte Kennung zurück) steht noch.
- Danach-Liste aus dem Brief (Stufe 0c, Sage `sicherheit.html`, Wizard-Init-
  Heilung im Kanon-`siegel-inhalt.js`, PULS-Archivierung, Stufe 3).

## Stand 2026-07-30 (Abend) — Nachzug: fünf vergessene Apps + Netz-Prüfung

**Rolle:** Bau-Sitzung (Fortsetzung 0b). **Gemergt:** BookLedgerPro #290 (Wizard
ins Siegel) · #291 (offline-Schale) · Kimseek #48 · Mein-Rezeptbuch #352 ·
Muttis-Rezeptbuch #165 · Mein-Mixarium #166 · Tomys-Hub #129.

### Der Befund, der die Sitzung verlängert hat

Klaus' Frage „hast du wirklich **alle** Repos aktualisiert?" war berechtigt.
**Nein.** Der 0a/0b-Rollout ging an fünf Apps, weil der ursprüngliche Auftrag
fünf nannte — **fünf weitere** trugen weiter den alten Panel-Stand und legten beim
Seiten-Start wortlos neue Kennungen an: **Kimseek, Mein-Rezeptbuch,
Muttis-Rezeptbuch, Mein-Mixarium, Tomys-Hub**. Alle fünf sind jetzt auf
`c78d18d0…`, `ensureIdentity` überall raus, Mixarium hat seine Wappen-Gravur
(`ribbonText: "Mein Mixarium"` — es war die letzte App ohne).

**Lehre:** ein Auftrag, der eine App-Liste nennt, ist keine Erlaubnis, den Rest
des Netzes stehen zu lassen. Wer eine geteilte Datei anfasst, prüft **alle**
Träger — `git ls-tree` über jedes Repo, sha vergleichen, Tabelle zeigen.

### BookLedgerPro: Siegel vervollständigt (nach Skill `status-leiste-siegel`)

BLP war die einzige App mit Modul 16 **ohne** Modal-Inhalt. Es bekam
`sbkim/siegel-inhalt.js` (1:1 aus dem Sage-Kanon, nur `WIZ` angepasst) mit allen
fünf Bausteinen inkl. **Identitäts-Wechsler**. Der Skill deckte zwei Lücken auf:
**`ribbonText` fehlte** (Wappen-Band leer) und **`sicherheit.html` fehlte** (toter
Knopf im Schutz-Block) — beides behoben. Dazu Nachzug: `21_spracheingabe.js` +
beide `23_rendezvous*.js` fehlten in `CORE_ASSETS` → **offline war das ganze
Netz-Panel weg**; nachgetragen, `CACHE_VERSION` v213 → v215.

### Die Netz-Prüfung — und der eigentliche Befund

**Schutz-Plan Stufe 2b (Kartenechtheit + Flut-Deckel, gebaut 2026-07-29) liegt
NUR in Sage. Keine einzige App hat sie.** In jeder echten App nimmt `discover()`
Karten weiterhin ungeprüft entgegen: jeder kann sich unter fremdem Namen ins Brett
hängen, ein Fluter kann den Raum füllen. **Das ist der Spam-/Sybil-Schutz, nach dem
Klaus gefragt hat** — er ist gebaut und getestet, nur nicht ausgerollt.

**Drei Generationen von Modul 23 im Umlauf:** Kanon `3caa0bb1` · die meisten Apps
`9f3a2085` · Mein-Tresor + Jasons-Tresor `bbdf02a8` (zwei Generationen zurück, ohne
`rankCardsByQuery`). Ebenso fehlt **allen** Apps der Siegel-Aspekt vom 2026-07-29
(Modul 16: Kanon `4e11ef0d`, Apps `a581461a`).

**Vollständige Tabelle, Vorgehen, Test-Erwartungen je Repo, bekannte Grenzen und
alle sha-Werte:** `docs/sessions/BRIEF_MODUL23_STUFE2B_ROLLOUT.md` — der Brief ist
so geschrieben, dass die nächste Sitzung **ohne Rückfrage** durchziehen kann.

### Schutz-Plan, Stand

| Stufe | Was | Stand |
|---|---|---|
| 1 + 2 | Grundschutz (Kimboard) | ✅ |
| **2b** | Kartenechtheit + Flut-Deckel | ✅ gebaut · ❌ **nur in Sage** |
| **0a** | Kennung + Speicher sichtbar | ✅ netzweit (11 Apps) |
| **0b** | Kennung reparierbar, keine stumme Neu-Anlage | ✅ netzweit (11 Apps) |
| 3 | Bekannte bevorzugen | ⏳ nach 2b-Rollout |
| 4 · 4d/4e · 5 · 6 | Themen-Mycel · Wächter-Quorum · Stufen-Schalter · Rollout | ⏳ |

### Offen

1. **Klaus' Browser-Sichttest 0b** — Sicherung anlegen, später einspielen.
2. **Stufe-2b-Rollout** (der neue Brief) — vor Stufe 3.
3. Sage fehlt `sicherheit.html`; Sages `siegel-inhalt.js` ist hinter Mein-Tresor
   (Wizard-Init-Heilung vom 2026-07-19).
4. PULS-Archivierung (7573 Zeilen gegen 3000er-Klausel, alt).

---

## Stand 2026-07-30 (Nachmittag) — Stufe 0b gebaut: die Kennung ist jetzt REPARIERBAR

**Rolle:** Bau-Sitzung (Brief `BRIEF_STUFE0B_IDENTITAET_HALTBAR.md`).
**Branch:** `claude/stufe-0b-identitaet-reparierbar` · **6 PRs gemergt**
(Sage #752, Kimboard #58, BookLedgerPro #286, Mein-Tresor #80, Jasons-Tresor #138,
family-project #123).

### Zwei Belege von Klaus, die diesen Bau ausgelöst haben

**Lauf 16:54–16:57 (Mycel-Rekord `20260730T145936`, erster Lauf NACH den Fixes):**

- **Der Handshake läuft sauber.** Sage ⟷ SB-KIMTool-Point, **fünf** Antworten,
  jede `outcome: "established"`, Score **0.8635**. Kein „connection is closing",
  kein `decision: null`, keine zweite Kennung mitten im Lauf. Erster Live-Beleg,
  dass **Fix 1** im Browser greift.
- **Aber beide Schubladen waren LEER.** Klaus' Bild 16:54 zeigt
  `Meine Kennung: noch keine (erst verbinden)` bei `Speicher dauerhaft: ja`;
  16:55 dann `✓ Identität erzeugt: bAf_3wjfRXMlz3B11_v-…` (Spore 14:54:56 UTC),
  16:57 dasselbe für den Point (`aNoV2w6NAIHDzVvl…`, 14:57:08 UTC).
  **Die App legt wortlos neu an** — genau Punkt 3 des 0b-Briefs, an Klaus'
  eigenem Lauf belegt. **0a hat den Fehler beim ersten Blick sichtbar gemacht.**

**Lauf 14:59–15:11 (Rekord `20260730T151140`) — der ernüchternde Teil:**

- **Kimboard hat SEINE Kennung erneut verloren.** `XFi3xrd7xMSuaf` (04:45 UTC,
  noch live um 05:01) ist weg; um **15:09:38 UTC** entsteht `e8UwgMlxrmSjetpO`
  — die **dritte** Kimboard-Kennung binnen zwei Tagen. Klaus' Bild 17:08 zeigt
  wieder `Speicher dauerhaft: ja`.
- **Ehrlich zur Ursache:** das ist **kein Beweis, dass die Härtung nicht wirkt**,
  aber auch **kein Beweis, dass sie wirkt**. Zwei Wege bleiben offen: (a) das
  Fenster vom 05:01 lief noch mit **altem** Code (Klaus hatte es nicht
  geschlossen) und eine schon **vorgemerkte** `deleteDatabase()` ist später
  gefallen; (b) eine andere, noch unbekannte Ursache. Die Frage lässt sich aus
  den Rekorden **nicht** entscheiden — darum ist die Antwort nicht „noch eine
  Ursachensuche", sondern **Reparierbarkeit**.
- Nebenbefund: Kimboards Andock-Anfragen an Sage (Ereignis 34 + 54) blieben
  **ohne Antwort** — dazu passt die bekannte Rest-Grenze „Antworter-Tab muss
  vorn und wach sein". **Nicht** in diesem Auftrag, eigenes Thema.

### Was gebaut wurde (Modul 23 UI, Kanon → 5 Apps + Bundle)

Neuer Kasten **„🪪 Kennung sichern"** im Netz-Panel, direkt unter den
0a-Statuszeilen:

1. **💾 Sicherung anlegen** — verschlüsselte Datei über Modul 02 `exportBackup`
   (PBKDF2-SHA256 600k + AES-GCM-256). Passwort **zweifach** eingegeben,
   **nirgends** gespeichert (Test prüft das). Solange keine Sicherung angelegt
   wurde, **warnt** der Hinweis: „Für diesen Knoten liegt hier noch KEINE
   Sicherung."
2. **📥 Sicherung einspielen** — `importBackup`. Liegt schon eine Kennung im
   Fach, kommt **erst die Warnung**, dann das ausdrückliche „Ja, ersetzen".
   Danach ist die **alte** Kennung zurück (das ist die Gegenprobe des Briefs).
   Falsches Passwort → ehrliche Fehlermeldung, kein stiller Erfolg.
3. **Schluss mit stummer Neu-Anlage** — war die Schublade leer, hat „🌐 Mit dem
   Knotennetz verbinden" bisher **wortlos** eine neue Identität erzeugt. Jetzt
   fragt es **einmal**: neu anlegen ODER Sicherung einspielen, mit der Warnung
   „eine neue Kennung ist NICHT dieselbe wie eine frühere". Ist eine Kennung da,
   ändert sich **nichts** (kein zusätzlicher Klick); lässt sich der Stand nicht
   lesen, läuft der alte Weg unverändert (ein Lese-Problem darf keine neue Hürde
   bauen).
4. **🧹 Fächer aufräumen** — die schon entstandenen Mehrfach-Fächer entfernen,
   das aktive bleibt. Mit Rückfrage, als **Knopf**, keine Konsole.

**Dateiname der Sicherung** (Klaus' Rückfrage): `sbkim-sicherung-<app>-<datum>.json`
— der App-Teil ist der `dbSuffix` des Knotens, also `kimboard`,
`bookledgerpro-sbkim`, `meintresor`, `jasonstresor`, `familyprojekt`. Damit ist
jede Datei ohne Umbenennen zuzuordnen, und mehrere Stände derselben App
sortieren sich nach Datum.

**Die ehrliche Grenze steht sichtbar in der Oberfläche**, nicht nur in der Doku:
„Eine Räumung durch den Browser lässt sich nicht verhindern — nur
unwahrscheinlicher machen (App auf den Startbildschirm legen) und der Verlust
reparierbar halten (Sicherung)."

### Abgrenzung

REINE UI-Schicht über die **öffentlichen** Flächen von Modul 02. Die Kern-Module
**01/02/05/23 bleiben unangetastet**, kein `PROTOCOL_VERSION`-/`DB_VERSION`-Bump,
der 0.80-Andock-Riegel unberührt. Konsequent fail-soft: ohne Modul 02 sagen die
Knöpfe das **ehrlich** — kein toter Knopf, kein Crash (Fremdnutzer-/Marktplatz-Brille).

**Nachtrag am selben Tag — der Brief hatte recht, die Sitzung hatte unrecht.**
Diese Sitzung hatte zunächst notiert, „kein App-Klebstoff übergibt
`ensureIdentity:true`" — das war **falsch** (ein `grep` mit `head -5` wurde von
`ensureIdentityStores`-Treffern aus Modul 02 zugeschüttet, die eigentlichen
Fundstellen fielen unter den Tisch). Tatsächlich fuhren **alle fünf** Apps
`ensureIdentity: true` bei `SbkimRendezvous.init()` — Kimboard, BookLedgerPro,
Mein-Tresor, Jasons-Tresor, family-project. Die App legte damit **beim
Seiten-Start** wortlos eine neue Kennung an, sobald die Schublade leer war; das
Tor im Verbinden-Knopf kam **zu spät**.

**Behoben** (5 PRs: Kimboard #59, BookLedgerPro #287, Mein-Tresor #81,
Jasons-Tresor #139, family-project #124): `ensureIdentity` ist aus dem
App-Klebstoff **entfernt**. Die Kennung entsteht nur noch auf ausdrückliche
Nutzer-Entscheidung im Netz-Panel. Ist eine Kennung vorhanden, ändert sich
nichts — sie wird beim Start unverändert gelesen. Nur Klebstoff, eine Zeile je
App; Kern-Module unangetastet. Suiten grün (Kimboard 6/6, Mein-Tresor 53/0,
Jasons-Tresor 59/0, BookLedgerPro 2153/0, `node --check` überall).

**Lehre für die nächste Sitzung:** ein `grep`-Ergebnis mit `head -N` ist **kein
Beweis für Abwesenheit**. Wer „X kommt nirgends vor" schreibt, zählt vorher die
Treffer ungekürzt.

### Beweis

| Lauf | Ergebnis |
|---|---|
| `tests/smoke_bau23_0b_identitaet.mjs` | **34/34 grün** |
| **GEGENPROBE** `SBKIM_0B_SABOTAGE=1` (Tor ausgehebelt) | **30/34 — fällt** |
| `smoke_bau23_rendezvous_ui.mjs` | 87/87 (regress-frei) |
| `smoke_bau23_rendezvous.mjs` · `smoke_bau23c_ki_richter.mjs` · `smoke_bundle_connect.mjs` | 59/59 · 28/28 · 21/21 |
| Kimboard `npm test` (Drift-Guard) | 6/6 |
| Mein-Tresor · Jasons-Tresor · BookLedgerPro | 53/0 · 59/0 · 2153/0 |

**Nicht geprüft (ehrlich):** family-projects Suite braucht `playwright-core` und
ließ sich hier nicht installieren (kein `package.json`) — dort ist die Änderung
eine per sha256 geprüfte byte-identische Kopie. Und: der **echte Browser-Pfad**
(Datei-Download, Datei-Auswahl, echte AES-Krypto, IndexedDB) **wartet auf Klaus'
Browser-Lauf**. Headless ersetzt ihn nicht.

### Offen / nächster Schritt

1. **Klaus' Sichttest (nicht ersetzbar):** in EINER App zuerst **💾 Sicherung
   anlegen**, dann später **📥 einspielen** → die alte Kennung muss zurück sein.
   Vorher alle offenen Fenster neu laden (alter Code läuft in offenen Fenstern
   weiter — die Lehre vom 30.07.).
2. **Stufe 0c** (neuer Brief): Sicherung **anbieten, sobald** eine Kennung
   entsteht, statt sie nur zu erwähnen — und die Wiederherstellung an derselben
   Stelle. Erst danach ist der Kreis wirklich zu.
3. Der **stumme Antworter** (Kimboard→Sage ohne Antwort) bleibt eigenes Thema.

Übergabeprotokoll: `docs/sessions/archiv/2026-07-30_stufe-0b-identitaet-reparierbar.md`.

**Befund am Rande (nicht in diesem Auftrag, gehört aber gemeldet):** diese Datei
hat **7573 Zeilen** — die Schutz-Klausel im Kopf nennt **3000** als Grenze und
verlangt „auslagern statt kürzen". Der Überlauf bestand schon vor dieser Sitzung
(7459 Zeilen auf `main`). Das Auslagern älterer Stände ins Archiv ist eine eigene
Pflege-Sitzung — hier bewusst **nicht** nebenbei erledigt, aber auch nicht
stillschweigend übergangen.

---

## Stand 2026-07-30 (früh) — URSACHE GEFUNDEN: unser Code löschte die Identität, nicht der Browser

**Rolle:** Fortsetzung derselben Bau-Sitzung (Klaus: „entscheide selber, es geht nichts verloren").
Branch netzweit `claude/stufe-0a-identitaetskennungen-78ulx5`.

**Klaus' Messung hat den Bug gefangen.** Über Nacht verloren Kimboard (`zv5jVTBnjIS…` →
`XFi3xrd7x…`) UND Mein-Tresor (`X0Mal…` → `11hoBL…` → `50RfCiT9r…`) ihre Kennung — **obwohl
„Speicher dauerhaft: ja" stand** und Klaus nichts gelöscht hat. Entscheidende Zusatz-Angaben:
er war im **gleichen** Browser-Modus, die Apps waren die ganze Nacht **offen**, und heute früh
war die Kennung noch **angezeigt** — der Hard-Reload legte den Verlust erst offen (die Anzeige
kam aus dem Arbeitsspeicher der alten Seite; die offenen Fenster liefen zudem noch mit dem
**alten** Code, weil neuer Code erst beim Neuladen ins Fenster kommt).

**Der Ausschluss-Beweis:** „es ging sofort, kein Modell geladen." Das ~30-MB-Sprachmodell liegt
im **selben** verwalteten Speicher wie die Kennungen. Hätte der **Browser** geräumt, wäre es
mit weg. Es war da — und localStorage (Tresor-Fächer, Gerätename „Klaus Tablet") ebenfalls.
Gelöscht wurde **nur** die Kennungs-Datenbank. Also: **kein Browser-Eviction.**
Modul 07 (Apoptose) ebenfalls entlastet — dessen `init()` macht nachweislich **keinen**
Verfalls-Sweep („keine TTL-Sweeps in init()", wörtlich im Modul).

**Die Ursache (im Code gefunden, `01_storage.js`):** die Selbst-Heilung vom 11.07. löscht eine
DB, die sie für „identitäts-leeren Schrott" hält (fehlender Store `sbkim_keys`). Fährt ein
**anderes Fenster** derselben Origin gleichzeitig einen Schema-Umbau, ist `objectStoreNames`
**transient unvollständig** → Fehlurteil „leer" → die DB **mit** Identität wird gelöscht.
**Verschärfend:** `indexedDB.deleteDatabase()` ist unumkehrbar und wirkt bei `onblocked`
**verzögert** — die Löschung bleibt im Browser **vorgemerkt** und greift, sobald die letzte
Verbindung fällt (Tab schläft über Nacht ein). Genau der beobachtete Ablauf, und es erklärt,
warum **nie ein Fehler sichtbar** war. Dazu fehlte am Lösch-Aufruf der Fehler-Zweig — eine
blockierte Löschung ließ die Promise-Kette **still sterben**.

**Härtung (Modul 01):** vor JEDEM Selbst-Heilungs-Löschen eine **zweite, unabhängige
Gegenprobe** (`confirmIdentityStoreMissing`). Widerspricht sie — oder ist sie blockiert/unklar
— wird **nicht gelöscht**, sondern ehrlich abgelehnt. **Löschen ist unumkehrbar, ein ehrlicher
Fehler ist reparierbar.** Fehler-Zweig ergänzt. Kein `DB_VERSION`-/Schema-/API-Bump; 02/23 unberührt.

**BEWEIS mit Gegenprobe (der Kern der Ehrlichkeit):** neuer
`tests/smoke_pflege_01_kein_loeschen_im_zweifel.mjs` **4/4 grün**. Mit der Härtung **entfernt**
fällt derselbe Test auf **2/4** mit `WEG — Datenverlust!` — der Bug ist damit **reproduziert**
UND die Heilung **belegt**, nicht bloß plausibel. Probe 4 zeigt: der echte Leer-Fall heilt sich
weiterhin selbst. Regress-frei: M01-Suite 11/21/7/6, reopen-retry 3/3, a14 4/4, bau02y 33/33.

**Netzweit gemergt (13 PRs):** Sage #750 · Mein-Tresor #79 · Kimboard #57 · BookLedgerPro #285
(CI grün) · Jasons-Tresor #137 · family-project #122 · Kimseek #47 · Company-Brain #9 ·
Privat-Brain #65 · Mein-Rezeptbuch #351 · Mein-Mixarium #165 · Muttis-Rezeptbuch #164 ·
Tomys-Hub #128. sha-Pins nachgezogen; vier Repos brauchten einen Rebase (Pin-Konflikt).

**Nebenbefund geklärt (Klaus' Frage „Kimboard liest Mein-Tresors Browser?"): NEIN.** Der
Analyse-Rekord 05:01 beweist das Gegenteil: Mein-Tresors Karte wurde **04:43** angeheftet (App
war offen) und **18 Minuten später** gelesen — sie hängt am **Relais**, nicht im Browser. Und
Kimboards Handshake an sie ergab `decision: null` (**keine Antwort**) — könnte Kimboard den
Nachbar-Speicher lesen, wäre er gelungen. Apps können sich gegenseitig **nicht** in die
Schublade schauen; der Raum zeigt Karten der letzten ~30 Min (so gebaut). Ebenso sind die
„3 bzw. 4 Kennungen" auf der Karte **Karten-Gedächtnis** eines durchgehenden Rekorder-Laufs,
keine 4 lebenden Identitäten.

**Klaus' Entscheid:** alte Kennungen werden **nicht** gejagt (Testphase, nichts verkauft,
nichts verloren) — Ursache beheben schlägt Identitäten retten.

**Browser-Sichttest wartet auf Klaus:** dieselbe App in zwei Fenstern öffnen → Kennung muss
stabil bleiben, kein Handshake-Fehler. **Wichtig:** nach jedem Update **alle offenen Fenster
neu laden**, sonst arbeitet der alte Code weiter.

**Offen (0b):** Sicherung + Wiederherstellen im Panel, Aufräum-Weg für die schon entstandenen
Mehrfach-Fächer, und **Schluss mit stummer Neu-Anlage** (die App legt beim Öffnen wortlos eine
neue Identität an, wenn die Schublade leer ist — künftig fragt sie).

---

## Stand 2026-07-29 (tiefe Nacht) — Fix-Bau: Identitäts-Churn gefunden und netzweit geheilt („connection is closing")

**Rolle:** Bau-Sitzung (Fortsetzung derselben Sitzung wie Stufe 0a, Klaus' ausdrückliches
„startet den Fixbau jetzt"). Branch netzweit `claude/stufe-0a-identitaetskennungen-78ulx5`.

**Der Befund — Klaus hat den Identitätsverlust LIVE reproduziert.** Direkt nach dem
0a-Merge maß Klaus an Mein-Tresor: Kennung `X0MalwVNjV…` → nach kurzer Zeit `11hoBLLRZ7…`,
obwohl „Speicher dauerhaft: **ja**" stand und nichts gelöscht wurde. Seine Screenshots
zeigen die rauchende Pistole: **`(InvalidStateError) Failed to execute 'transaction' on
'IDBDatabase': The database connection is closing.`** Analyse-Rekord
`mycelanalyse20260729T191549.json`: Mein-Tresor mit **drei** lebenden Kennungen gleichzeitig
im Raum (nmRebxCn/X0Mal/11hoBL), Kimboard ×2, Handshakes an alte Karten-Fächer scheiterten.

**Die Ursache (im Code belegt, `01_storage.js`):** Ist dieselbe App auf derselben Origin in
**zwei Fenstern** offen (bei Klaus: Browser-Tab + Brett-Fenster), feuert der Browser
`onversionchange` → `db.close()`. Modul 01 gab die **tote** gecachte Verbindung weiter;
`db.transaction()` wirft dann synchron den InvalidStateError. Zwei Folgen: (a) der
Handshake bricht; (b) ein so fehlgeschlagener Identitäts-**Lese**vorgang wird als „keine
Identität" missverstanden → `getOrCreateIdentity` würfelt eine **neue** Kennung; das alte
Fach bleibt liegen (nichts gelöscht — mehrere Fächer, nach Reload gewinnt das alte).
Persistenz („ja") schützt davor NICHT — es ist kein Räum-, sondern ein Parallelzugriffs-Problem.

**Der Fix (Modul 01, additiv — bewusste Kern-Modul-Pflege auf Klaus' „startet den Fixbau"):**
Neuer `beginTx`-Helfer mit genau **einem Reopen-Retry**: `onversionchange` invalidiert
`dbPromise`/`currentDb` schon immer — der zweite Versuch bekommt eine frische Verbindung.
`get`/`put`/`del`/`all`/`clear` laufen jetzt durch `beginTx`. Schlägt auch der Retry fehl →
**ehrlicher Fehler**, nie stilles `undefined` (kein fälschliches „keine Identität" mehr).
Kein `DB_VERSION`-/Schema-/API-Bump; Module 02/23 unberührt.

**Beweis:** Neuer `tests/smoke_pflege_01_reopen_retry.mjs` **3/3** — reproduziert den Bug
(transaction() wirft „connection is closing") und belegt Selbstheilung + Ehrlichkeits-
Gegenprobe. Regress-frei: M01-Pflege-Suite 11/21/6/7, bau02y 33/33, bau23 59/59,
bundle-Drift-Guard 21/21.

**Netzweiter Rollout — alle 12 Modul-01-Träger + Bundle, alle gemergt:** Sage #748 ·
Mein-Tresor #78 · Kimboard #56 · BookLedgerPro #284 (CI grün) · family-project #121 ·
Jasons-Tresor #136 · Mein-Rezeptbuch #350 · Mein-Mixarium #164 · Muttis-Rezeptbuch #163 ·
Tomys-Hub #127 · Kimseek #46 · Company-Brain #8 · Privat-Brain #64. sha-Pins nachgezogen
(Kimboard/Kimseek `test/smoke.test.js`, Company-/Privat-Brain `tools/drift-guard.mjs`).
Ehrlich: Company-/Privat-Brain e2e-Suiten brauchen `playwright-core` (Container-Grenze,
vorbestehend); deren Drift-Guards 8/8 bzw. 15/15 byte-identisch.

**Für Klaus' Wieder-Test (nach Hard-Reload):** dieselbe App in **einem** Fenster → Kennung
muss stabil bleiben; zweites Fenster derselben App darf keinen Handshake-Fehler und keine
neue Kennung mehr erzeugen. Alte Geister-Karten verschwinden ~30 Min nach dem letzten
Anheften von selbst. **Browser-Sichttest wartet auf Klaus.** Noch offen (0b): Aufräum-Weg
für die schon entstandenen Mehrfach-Fächer (aktive Kennung behalten, alte Fächer entfernen)
— gehört zu 0b, nach Klaus' Messung.

---

## Stand 2026-07-29 (Nacht) — Stufe 0a/0c/0d/0e gebaut: Kennung + Speicher sichtbar, Widersprüche geheilt

**Rolle:** Bau-Sitzung (Stufe 0 aus `docs/sessions/BRIEF_STUFE0_IDENTITAET_HALTBAR.md`).
Branch netzweit `claude/stufe-0a-identitaetskennungen-78ulx5` (je Repo frisch von `origin/main`).

**Was getan.**

- **0a — messen, bevor repariert wird.** Das Netz-Panel (Modul 23 UI,
  `23_rendezvous_ui.js`) zeigt jetzt zwei ehrliche Zeilen: **„Meine Kennung: …"**
  (aus Modul 02 `getOwnSpore()`) und **„Speicher dauerhaft: ja/nein/unbekannt"**
  (aus Modul 01 `SbkimStorage._meta.storagePersisted`). Bei „nein" erscheint ein
  Satz in Klaus-Sprache (installieren macht ihn dauerhaft; Sicherung schützt
  zusätzlich). Reine Anzeige, konsequent fail-soft (fehlt ein Wert → „unbekannt"/
  „noch keine", nie ein Fehler). Beide Werte existierten schon im Code, sie wurden
  nur nicht gezeigt. Kern-Module **23/01/02 unangetastet** — die Änderung sitzt in
  der UI-Glue-Datei, die byte-1:1 in allen fünf Apps liegt: **zuerst im Sage-Kanon
  `src/modules/23_rendezvous_ui.js`**, dann byte-kopiert nach `sbkim-bundle/` +
  BookLedgerPro + Mein-Tresor + Jasons-Tresor + family-project + Kimboard
  (`modules/`). Kimboards sha256-Drift-Guard-Pin nachgezogen.
- **0c — BookLedgerPro-Schubladen-Widerspruch geheilt.** `sbkim/sbkim-init.js`
  rief Modul 23 mit `dbSuffix:"bookledgerpro"`, während die App-Identität in
  `bookledgerpro-sbkim` liegt (`index.html:54` + `DB_SUFFIX`). Beide Modul-23-Aufrufe
  nutzen jetzt die Variable `DB_SUFFIX` (= `bookledgerpro-sbkim`) → keine Phantom-DB
  `sbkim_bookledgerpro` mehr, die vorhandene Identität bleibt auffindbar.
- **0d — die zwei Tresore wieder unterscheidbar.** Der 🌐-Anmelde-Pfad in beiden
  `sbkim/sbkim-init.js` bettete den **generischen, zeichengleichen** Satz ein →
  Live-Cosinus exakt 1,0. Jetzt liest jeder Tresor seine **reiche, app-eigene**
  Beschreibung (identisch zum Andock-Wizard `assets/siegel-inhalt.js` WIZ). Jasons
  `scripts/generate_spore.mjs` mitgezogen. Gegenprobe headless: der Einbettungs-Text
  war vorher **byte-identisch** (= gemessener Cosinus 1,0), ist jetzt **verschieden**
  → echter e5-Cosinus < 1,0. **Der reale Browser-Cosinus wartet auf Klaus' Lauf**
  (kein e5-Modell headless). Die committete `spore.json` wurde **nicht** überschrieben
  (ihr echter Browser-Vektor darf nicht durch einen Demo-Stub ersetzt werden).
- **0e — Register ehrlich.** `status.json` (neues Top-Feld `identityNote` + Notiz am
  BLP-Eintrag) und `sbkim/NETZ-STAND.md` trennen jetzt **committete** (Register-)
  gegenüber **lebender** (Raum-)Identität; BLP läuft **live v0.2** (Register führt
  v0.1). Werte aus Klaus' Analyse übernommen, **nicht** neu verifiziert (Live-Sporen
  liegen in Klaus' Downloads).

**Beweis (headless).** Sage `smoke_bau23_rendezvous_ui.mjs` **87/87** (vorher 83, +4
neue 0a-Proben) · `smoke_bundle_connect` 21/21 · `smoke_bau23_rendezvous` 59/59 ·
`smoke_bau23b_kartenechtheit` 16/16. Kimboard `node --test` **6/6** (Drift-Guard-Pin
+ zwei vorher fehlende Modul-Kopien `echtheit.js`/`relay_rotation.js` in die Manifest-
Liste nachgetragen — main war dort **schon rot**, jetzt grün). Mein-Tresor 53/53 ·
Jasons-Tresor 59/59 · BookLedgerPro `tests/run.mjs` 2153/0 · family-project Nicht-
Browser-Smokes grün (`smoke_all.mjs` braucht playwright-core, im Container nicht
installiert — reiner Browser-Test, keine Regression durch die Anzeige-Änderung).

**⛔ STOPP nach 0a — bewusst, kein Zweifel.** 0b (Identität haltbar machen:
Installations-Hinweis + Sicherungs-Angebot + Wiederherstellen im Panel) wartet auf
**Klaus' Messung über Nacht** (öffnen → Kennung notieren → Hard-Reload → gleich? →
nächster Tag → gleich?). Erst das Ergebnis entscheidet, was 0b tun muss.

**Browser-Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf.**

**Nächster sinnvoller Schritt.** Klaus misst über Nacht (0a). Ergebnis → 0b bauen
(installieren/Sicherung/Wiederherstellen). Danach Stufe 3 „Bekannte bevorzugen".

---

## Stand 2026-07-29 (Abend) — Befund aus Klaus' Mycel-Analyse: **die Identität überlebt die Sitzung nicht**

**Rolle:** Analyse-Sitzung (kein Code). Klaus lieferte seinen Mycel-Analyse-Rekord
(`mycel-analyse-20260729T174256.json`, Rekorder v1.3, 17:29:47–17:42:56 UTC, 43 Ereignisse)
mit der Vermutung, es seien „einige Sporen verloren gegangen oder vielleicht sogar in
Identitäten". **Die Vermutung bestätigt sich — mit einer anderen Ursache als zunächst
angenommen.**

**Was gemessen wurde.** Fünf Knoten waren live (BookLedgerPro · Jasons Tresor · Mein Tresor ·
Family Projekt · Kimboard, alle mit Gerätenamen „· Klaus Tablet"); die zehn übrigen
Register-Knoten waren schlicht nicht geöffnet (kein Befund). **Alle fünf Sporen sind
kryptografisch gültig** — mit `node:crypto` nachgerechnet: 5/5 Ed25519-Signatur gültig, 5/5
`nodeId === base64url(SHA-256(publicKey.x))`, alle `protocolVersion 0.2`, `nodeType hybrid`,
korrekte verschiedene Endpunkte. **Nichts gefälscht** — und die am selben Tag gebaute
Stufe-2b-Prüfung hätte keine davon fälschlich abgewiesen.

**Der Befund:** **keine einzige** lebende Kennung steht im Register, auch nicht in
`previousNodeIds` — BLP `6oKgwHRp…` (Register `MyHVM7Pd…`), Jasons `zHqjzJX5…` (`lbUthjt-…`),
Mein-Tresor `nmRebxCn…` (`feV3o4qJ…`), Family `eg23tVHt…` (`XoYhjpgm…`), Kimboard `vPg4z2Ci…`
(`1f9Jb7c3…`). Über die Läufe hinweg wechselt sie nachweislich: BLP 11.07. `itzsPCHy…` →
23.07. `ZAOvf9tZ…` → 29.07. `6oKgwHRp…`; Family 23.07. `xMRGRZEw…` → 29.07. `eg23tVHt…`.
**Der schärfste Einzelbeleg:** bei Family ist der Domänen-Vektor **exakt identisch** zum
committeten (cos 1.0000) und die Beschreibung ebenfalls — es ist **nur der Schlüssel** weg.
Kein Re-Embedding, keine Textänderung kann das erklären.

**Korrigierte Erst-Annahme (wichtig):** die Sitzung schrieb zunächst, die Apps würden sich
„beim Verbinden neu erfinden" — **das ist falsch und wurde gegenüber Klaus korrigiert.**
`connectAndAnnounce` (`23_rendezvous.js:581-612`) nimmt eine vorhandene Identität und meldet
sie an; `generateOwnSpore` (`02_spore.js:689-696`) signiert mit **derselben** nodeId neu; der
Knopf „🧹 Aufräumen & neu anmelden" ruft `repairAndReconnect()` **ohne** `newIdentity` und ist
**nicht** schlüssel-löschend; `cleanupSharedOrigin` löscht nur `sbkim`, nie `sbkim_<suffix>`;
vier Apps haben vier eigene Schubladen. Klaus hat auf Rückfrage nichts zurückgesetzt.
**Schluss:** der Schlüssel geht **zwischen** den Sitzungen aus dem Browser-Speicher verloren.

**Der zu prüfende Verdacht:** `navigator.storage.persist()` wird gerufen
(`01_storage.js:363`), das Ergebnis liegt in `_meta.storagePersisted` — und wird **nirgends
angezeigt** (nur im Membran-Schnappschuss, `15_membran.js:1035-1041`). Auf Android-Chrome
antwortet `persist()` für eine bloß im Tab geöffnete `github.io`-Seite typischerweise `false`;
dann darf das System räumen. **Verdacht, kein Beweis** — messbar, sobald der Wert sichtbar ist.

**Zweiter, unabhängiger Befund — die zwei Tresore sind für das Mycel EIN Knoten:**
cos(Jasons live, Mein-Tresor live) = **exakt 1.000000** (alle anderen Live-Paare 0.82–0.86).
Ursache gefunden: `sbkim/sbkim-init.js:107-108` ist in beiden Repos zeichengleich (derselbe
generische `domainDescription` + dieselben neun Keywords), und der Einbettungstext besteht
**nur** aus diesen beiden Feldern (`:116`) — der einzige Unterscheider `domain` geht nicht in
den Vektor. Die guten, verschiedenen Beschreibungen liegen seit 19.07. in beiden Repos
(`sbkim/spore.json`, `assets/siegel-inhalt.js:41`); der 🌐-Anmelde-Pfad liest sie **nie**.

**Dritter Befund — Schubladen-Widerspruch in BookLedgerPro:**
`window.SBKIM_DB_SUFFIX = "bookledgerpro-sbkim"` (`index.html:54`) gegen den Modul-23-Aufruf
`dbSuffix: "bookledgerpro"` (`sbkim/sbkim-init.js:239`, `:242`). Der Schlüssel bleibt richtig
liegen, aber die Hygiene-/Migrations-Proben fragen eine nicht existierende DB ab, legen sie
kurz an und löschen sie wieder — der Schutzmechanismus läuft ins Leere.

**Vierter Befund:** 12 Andock-Anfragen, **3 Antworten**, alle von BookLedgerPro. Bekannte
Rest-Grenze (Antworter-Tab muss vorn und wach sein) — auf einem Tablet kann von fünf offenen
Apps immer nur eine antworten. Eigenes Thema.

**Klaus' Entscheid:** Stufe 0 **nicht** mehr in dieser Sitzung bauen, sondern detailgetreu
festhalten und frisch starten — weil Stufe 0a eine **Messung** ist, deren Ergebnis über Nacht
entsteht und erst dann bestimmt, was 0b tun muss. Diese Sitzung liefert daher nur
Dokumentation, keinen Code.

**Offen / nächster Schritt:** [`docs/sessions/BRIEF_STUFE0_IDENTITAET_HALTBAR.md`](sessions/BRIEF_STUFE0_IDENTITAET_HALTBAR.md)
— vollständiger Auftrag mit Faktenblatt (alle Messwerte, damit nichts neu hergeleitet werden
muss), Anker-Tabelle je Repo und Akzeptanzkriterien. Reihenfolge:
`0a Kennung + Speicher-Status sichtbar machen (alle Repos) → ⛔ Klaus misst über Nacht → 0b
Identität haltbar machen`; `0c` (BLP-Schubladen-Fix), `0d` (Tresore trennen) und `0e`
(Register ehrlich) laufen unabhängig. **Stufe 0 kommt vor Stufe 3 des Schutz-Plans** — ohne
stabile Identität sind „Bekannte bevorzugen", Bezeugung und der geschlossene Kreis wertlos.
Übergabeprotokoll: `docs/sessions/archiv/2026-07-29_mycel-analyse-identitaetsverlust.md`.

## Stand 2026-07-29 — Schutz-Plan **Stufe 2b**: Echtheit der Karten im Rendezvous-Raum

**Rolle:** Bau-Sitzung Modul 23 (Schutz-Plan Stufe 2b, Fortsetzung von Stufe 1+2 in
Kimboard). **Befund, der den Bau ausgelöst hat:** `discover()` hat fremde Visitenkarten
**ungeprüft** angezeigt — es wurde nur geschaut, ob die Felder da sind, **nie** ob die
Spore echt ist (`verifyForeignSpore` fehlte ganz) und **nie** ob die Karte überhaupt ihre
eigene Spore trägt. Jeder konnte sich unter fremdem Namen ins Brett hängen; ein Fluter
konnte den Raum beliebig füllen.

**Gebaut (Tafeln zuerst, dann Code — CLAUDE.md § Heilige Tafeln):**
`docs/INTERFACES.md` (neue Konstanten + verbindlicher Block „ECHTHEIT DER KARTEN") und
`docs/components/23_rendezvous.md` (§ Echtheit der Karten) **vor** dem Eingriff nachgezogen.
Dann `src/modules/23_rendezvous.js`:
- **Bindungs-Prüfung** `card.spore.id === card.nodeId` — eine Karte kann keine fremde
  Spore unter eigenem Namen tragen. Braucht keine Krypto, wirkt also **immer**.
- **Ed25519-Prüfung je Karte** über Modul 02 `verifyForeignSpore` (neuer, getrennter
  Resolver `resolveVerifier()` — der alte verlangt nur `getOwnSpore`, eine App darf ein
  Spore-Modul ohne Prüfer mitbringen). Läuft **nach** dem Lauschfenster, weil die Prüfung
  async ist und der Empfangs-Callback sie nicht abwarten kann.
- **Mengen-Deckel:** `RDV_CARDS_MAX = 200` je Durchlauf, `RDV_CARDS_PER_SENDER_MAX = 3`
  Identitäten je Nostr-Absender. Still verwerfen — der Fluter erfährt nichts.
- **Ehrlich statt still:** fehlt der Prüfer, läuft der Raum weiter, meldet die Karten aber
  als `cardsVerified: false` **UNGEPRÜFT**; `rejected` zählt, wie viele rausfielen.

**TABU eingehalten:** `PROVIDER_MIN_MATCH`/0.80-Andock-Riegel unberührt, Kern-Module
02/05/05b unangetastet (nur öffentliche Flächen genutzt), kein PROTOCOL_VERSION-Bump.

**Beweis:** neuer `tests/smoke_bau23b_kartenechtheit.mjs` **16/16 grün** — mit einem
Prüfer-Mock, der die Prüfung wirklich durchläuft. Wichtig: die bestehenden 59 Proben in
`smoke_bau23_rendezvous.mjs` fahren einen Mock **ohne** `verifyForeignSpore` und liefen
darum am fail-soft-Pfad vorbei; der neue Test schließt genau diese Lücke. Probe 5 ist
zugleich die **Gegenprobe**: dieselbe faule Karte bleibt sichtbar, sobald der Prüfer fehlt.
Regress-frei: `smoke_bau23_rendezvous` 59/59, `..._ui` 83/83, Drift-Guard
`smoke_bundle_connect` 21/21 (Byte-Kopie `sbkim-bundle/modules/23_rendezvous.js` mitgezogen),
Siegel-Smokes 9/9 · 9/9 · 5/5 · 16/16.

**Pflicht-Konvention erfüllt:** `ZERTIFIKAT_ASPEKTE`-Eintrag 2026-07-29 / Modul 23 in
`src/modules/16_siegel.js` ergänzt (Schutz-Modul-Pflege → Aspekt, CLAUDE.md).

**Offen:** Klaus' Browser-Sichttest (Raum öffnen, Karten erscheinen weiterhin, Badge-Anzeige
unverändert) — **ungeprüft, wartet auf Klaus' Browser-Lauf**. Nächste Stufen aus dem
Schutz-Plan: 3 (Bekannte bevorzugen), 4 (Themen-Mycel + Steckbrief), 4d/4e (Wächter-Quorum
+ KI-Richter), 5 (Stufen-Schalter mit strikter Trennung), 6 (netzweiter Rollout).

## Stand 2026-07-25 — WorkFloh als 15. Endknoten registriert (Nachzug aus WorkFloh-Sitzung)

**Rolle:** Registrierungs-Nachzug (Haupt-Bau lief im Repo Mein-WorkFloh). **Getan:**
Mein-WorkFloh wurde SBKIM-Endknoten (SBKIM-Kern byte-1:1 aus Kim-Bell/Sage-Kanon,
Netz-Panel Modul 23 + Siegel/Andock-Wizard, DB-Suffix `workfloh`). Hier in Sage:
`status.json` um den **15. Endknoten „WorkFloh"** ergänzt (Werbetechnik-Auftrags-
abwicklung, `https://lausiklauskn-png.github.io/Mein-WorkFloh/`) + `sbkim/NETZ-STAND.md`
(Zeile + neue Legende `awaiting-browser-spore`). Die **Mycel-Karte liest `status.json`
automatisch** → WorkFloh erscheint beim nächsten Laden. **Ehrlich:** `pingStatus:
awaiting-browser-spore`, **kein** `matchScore` — die committete WorkFloh-Spore ist eine
Platzhalter-Spore (headless VALID, aber `domainVector` = `_demo`-Stub, ephemere nodeId).
**Offen:** Klaus erzeugt im WorkFloh-Browser über den Andock-Wizard die echte Identität +
den echten Vektor + committet `spore.json`; danach Folge-Sitzung: echte nodeId + Cross-
Knoten-Match/Live-Handshake nachziehen. **Nächster Schritt:** WorkFloh-PR mergen (Freibrief),
dann Klaus' Browser-Andock.

**✅ HOCHSTUFUNG (gleicher Tag, Klaus' Browser-Andock — WorkFloh ist funktionierender
Knoten):** Klaus hat im WorkFloh-Browser über den Andock-Wizard die **echte v0.2-Spore**
erzeugt+committet (nodeId **6YOPHbnK…**, echter `domainVector` 384-dim L2=1 + 3 Schnipsel,
kein `_demo`; headless reziprok **✔ VALID**). `status.json` + `NETZ-STAND.md` auf echte
nodeId + **`verified-match` 0.833465** gehoben. **Live-Beleg** (Mycel-Analyse 18:21–18:33):
„WorkFloh · Klaus Tablet" live im Raum `sbkim-rdv` mit 13 weiteren Knoten. Echte Matches:
**Tomys-Hub 0.8335 · Kimseek 0.8110** ≥ 0.80 (fachverwandt Werbetechnik/Druck); Sage 0.7824
< 0.80 → kein direkter Sage-Match (fachfremd zum Hub, wie Tomys). Zwei bezeugte Cross-Knoten-
Matches nachgetragen. Netzweit belegt: WorkFloh auch in SB-KIMTool-Point + family-project als
funktionierende PWA mit Siegel + Link registriert.

**✅✅ RE-SIGNATUR (gleicher Tag, 19:36 — Bedeutungstext-Umbau löst den Sage-Match):** Der
Live-Handshake WorkFloh↔Sage scheiterte zunächst (Sage-Cosinus 0.7824 < 0.80). Klaus hat den
`domainDescription` nach dem **Rezeptbuch-Muster** umgestaltet (WorkFloh als „Endknoten im
SBKIM-Mycel auf Grundlage des Sage-Protokolls", semantisch verbunden mit Tomys/BLP/Kimseek/Point,
wandelbares Branchen-Tool) und die Spore **neu signiert** (nodeId unverändert `6YOPHbnK…`, neuer
`domainVector` + 6 Schnipsel, reziprok VALID). **Wirkung gemessen:** Sage↔WorkFloh **0.7824 →
0.906269** = direkter Hub-Match; **12 Knoten ≥ 0.80** (Sage 0.906 · Point 0.897 · Muttis 0.878 ·
Rezeptbuch 0.876 · Tomys 0.860 · Kimseek 0.860 · Kim-Bell 0.849 · Jasons 0.849 · Family 0.846 ·
Mein-Tresor 0.845 · Mixarium 0.826 · Kimboard 0.817; nur Private Brain 0.771 drunter). **✅ LIVE-
HANDSHAKE** (Mycel-Analyse 2026-07-25 19:37 + 19:43): **WorkFloh ⟷ Sage BEIDSEITIG `established`**
übers echte Relais + Tablet⟷Handy `established`. `status.json`/`NETZ-STAND` + bezeugte Matches auf
0.906269 + Live-`established` nachgezogen. **Lehre:** die Infrastruktur-Rahmung im Domänen-Text
hebt fachfremde Knoten zuverlässig über den 0.80-Hub-Riegel (Rezeptbuch-Beleg bestätigt am
zweiten Fall).

## Stand 2026-07-24 (Abend) — PULS-Archivierung Mai (Klaus' Wahl: Option A)

Die Datei war auf ~10 020 Zeilen gewachsen (Schutz-Klausel nennt 3000). Klaus wählte **Option A**:
**nur die ältesten** Einträge auslagern, Juni + Juli bleiben inline. Die **51 Mai-Sitzungen (26.–31.05.)**
aus § „Sitzungs-Einträge" sind nach [`docs/sessions/archiv/2026-05_puls-auslagerung.md`](sessions/archiv/2026-05_puls-auslagerung.md)
verschoben (2 942 Zeilen), an der Schnittstelle bleibt ein Zeiger, im Archiv-Index eine Sammel-Zeile.
**PULS 10 020 → 7 111 Zeilen.** Nichts geht verloren (Git-Historie + Archiv-Datei). Vision-Anker (05-17/18/28)
+ alle Struktur-Sektionen unberührt. **Rest:** Juni könnte in einer Folge-Sitzung ebenso ausgelagert werden
(wäre „Option B"), wenn Klaus es noch schlanker will.

## Stand 2026-07-24 (Nachmittag, Folge) — OCR-Markdown-Putz (Klaus' Befund aus dem Live-Lauf)

Direkt nach dem OCR-Live-Beweis fiel Klaus beim **Internet-Weg** auf: der Mistral-OCR-**Markdown-Rausch**
(`![img-0.jpeg](img-0.jpeg)`, `#`/`##`-Überschriften) wandert wörtlich in die Google-Anfrage. Google
ignoriert das Meiste („Es fehlt: …") und fand trotzdem das richtige Rezept — aber die Anfrage ist unsauber.

- **Fix in Modul 24** (`src/modules/24_ocr_eingabe.js`): neuer Helfer `cleanOcrText` — Bild-Platzhalter
  `![…](…)` raus, Link `[Text](url)` → nur der Text, Überschriften-Marker `#`…`######` am Zeilenanfang weg,
  Mehrfach-Leerraum/Leerzeilen zusammengezogen; **der eigentliche Text bleibt vollständig**. Angewandt im
  `recognize`-Pfad (mistral + google), Browser-Klartext ist praktisch No-Op. Konsequent **fail-soft**
  (Nicht-Strings unberührt, kein Throw). Hilft **beiden** Wegen — interne Knoten-Suche UND Internet/Google.
- **Byte-Kopien** `such-tool/` + `pinnwand/` mitgezogen (beide nutzen Modul 24), **SW-Cache** gebumpt
  (`sbkim-such-tool-v4`, `sbkim-pinnwand-v19`). Sage-Hauptseite hat keinen SW → Hard-Reload reicht.
- **TABU gewahrt:** `PROVIDER_MIN_MATCH`/0.80-Riegel + PROTOCOL_VERSION unberührt, additive Fläche
  (`SbkimOcr.cleanOcrText`). Smoke `smoke_bau24` **52/52** (neue Probe 13, Klaus' echtes Rezept-Beispiel),
  Drift-Guards `standalone_such_tool` 49/49 + `pinnwand_dm` 16/16.
- **Browser-Sichttest des geputzten Textes wartet auf Klaus** (nach Hard-Reload: Foto → Feld sollte jetzt
  ohne `![img…]`/`#` sein).

## Stand 2026-07-24 (Nachmittag) — Demo-Anteil 2 % → **0 %**: die letzten drei Module grün (00·21·24)

Klaus hat nach der Arbeit die drei Rest-Module am Tablet durchgetestet — **Demo-Anteil steht jetzt
auf 0 %** (alle 27 Module non-stub, Fertig 21/21 im Modul-Kern; real 390 / max 390).

- **00 Doku-Fenster** — die echte **5-Klick-Geste öffnet das Doku-Fenster LIVE** (SBKIM-Knotenstand
  mit nodeId/Domäne/Protokoll 0.2/Geschwister/Vermächtnis-Inbox/Speicher, „Geöffnet 12:06"). Setup
  dokuReady · Test 2 Fenster öffnet + Snapshot vollständig (0 Fehler) · Test 4 Quota-Warnzeile 81 %
  sichtbar · Test 5 TTL-Sweep entfernt beide alten Geschwister. **Voll live-grün.**
- **21 Spracheingabe** — Logik grün (Sprachen DE/EN/RU, EU-Politik frei=[browser,eu]/bindend=[eu],
  pickEngine, `browserSupport:true`); Browser-Erkennung **live gestartet mit Mikro-Freigabe** (de-DE);
  EU-Engine fail-soft abbrechbar. **Ehrliche Grenze:** die Web-Speech-Transkription selbst ist ein
  Browser-Feature, EU-STT bleibt BYOK (optional).
- **24 OCR** — Logik grün (Anbieter mistral/google/browser + EU-Politik, isFileSupported png/jpeg/pdf,
  ocrErrorHint 3 Hinweise); OCR-Erkennen fail-soft abbrechbar. **Ehrliche Grenze:** Live-OCR bewusst
  BYOK — mistral/google brauchen Bezahl-Schlüssel, Browser-Shape-Detection hier nicht unterstützt
  (`browserOcrSupport:false`); der eigentliche Erkenn-Lauf ist ungetestet-aber-fail-soft. Score
  „fertig" mit diesem Vermerk (Klaus' Drive-to-0, Modul-Logik voll bewiesen; upgradebar sobald ein
  echter OCR-Schlüssel läuft).

`status.json`: Score `stub`→`fertig` für **00·21·24**. Pie: Fertig 18→**21**, Code-Stub 3→**0**.
Zusammen mit dem Vormittags-Strang (01/02/06/07/08/20/25) sind damit **alle 10 einst-stub-Module
auf „fertig"** — der Demo-Anteil-Ring steht auf **0 %**.

**Nächster sinnvoller Schritt:** nichts Dringendes mehr am Demo-Anteil. Wenn Klaus mag: (1) den
24-OCR-Live-Lauf mit echtem Schlüssel nachholen (macht den Vermerk voll), (2) die große `PULS.md`
(~10 000 Zeilen) in einer eigenen Pflege-Sitzung ins Archiv auslagern.

## Stand 2026-07-24 (Vormittag) — Demo-Anteil 8 % → 2 %: sieben Module auf „fertig" (Klaus-Browser-Sichttest)

Interaktive Sichttest-Sitzung mit Klaus am Tablet (deployte
`tests/manual_check.html`). Ziel: die stub-Module auf „fertig" bringen und damit
den Demo-Anteil senken (die 8 % kamen **allein** von den 10 stub-Modulen — jeder
stub verliert 3 der 10 Punkte; alle 14 Endknoten zählen schon voll live).

**Fünf Module heute im Browser durchgetestet — alle Panel-Tests grün:**

- **01 Storage** — init (DB v10, 14 Stores) · round-trip · UnknownStoreError · ensureStore
  happy-path (v10→11) + idempotent + InvalidStoreNameError · **versions-fail-soft** (v11→12,
  Re-Init nach Reload sauber, kein `VersionError` — der alte Wackel-Punkt ist bestätigt geheilt).
- **02 Spore** — Identität stabil (gleiche nodeId) · Sign+Verify · Manipulation erkannt
  („Signatur ungültig") · Export v2/PBKDF2-600k/AES-GCM. Backup-**Restore** nicht per Panel
  (Klaus wollte keine Datei einlesen) — **real bewiesen** durch den netzweiten Spore-/
  Identitäts-Austausch (mehrfach, alle Repos). „Backup einlesen"-Rot = kein Test (keine Datei gewählt).
- **06 Heterokaryose** — Tests 1–12 alle grün (shared/`anchor_count:1` nach #724-Fix · opt-out ·
  opt-out-local · UnknownSiblingError · alle rejected-Pfade mit richtigem Grund · Signatur ·
  MAX_ANCHORS=5 neueste-zuerst · list ohne Vektoren · forget idempotent · endpoint_unsupported).
- **07 Apoptose** — Tests 1–8 alle grün (Vermächtnis-Round-Trip · Signatur · Version · TTL-Cleanup ·
  listLegacy · Self-Apoptose completed/Stores leer/`NoIdentityError` · Token-Ablauf · unbekannter Sender).
- **08 UI-Demo** — Tests 1–6 alle grün (add+list · remove idempotent · überschreiben · OutboxFullError ·
  Validierung 6 Fälle · setSiblingHeteroOptIn strikt boolean).

**Zwei weitere geflippt (waren schon dokumentiert grün, nur nie im Score umgestellt):**
**20 Schlüssel-Safe** (Panel 20 GRÜN 2026-07-17) · **25 Pseudonymisierung** (Panel 25 GRÜN 2026-07-17).

**Ergebnis:** `status.json` — Score `stub`→`fertig` für **01·02·06·07·08·20·25** (7 Module).
Pie: Fertig 11→**18**, Code-Stub 10→**3**. **Demo-Anteil rechnerisch 8 % → 2 %**
(real 381 / max 390; identisch zur `index.html`-`computeScore`-Formel). Pie-Block via
`scripts/update_puls_pie.py` neu gezogen.

**Offen (die letzten ~2 %) — drei stub-Module, brauchen Sondertests am Tablet:**
`00 Doku-Fenster` (5-Klick-Trick auf der echten Sage-Seite) · `21 Spracheingabe`
(Live-Mikro; Logik-Knöpfe gehen ohne, echter Sprech-Test braucht Mikro — gratis) ·
`24 OCR` (echter BYOK-OCR-Schlüssel für den Live-Erkenn-Test). **Nächster Schritt:** Panel 21
(3 Logik-Knöpfe + gratis Browser-Mikro-Test), Panel 24 (3 Logik-Knöpfe), 00 auf der Seite → 0 %.

## Stand 2026-07-23 (Abend, Meilenstein-Strang) — A18-Siegel-Modal + Multi-Knoten-Mesh-Meilenstein + Galerie-Fix

Interaktiver Strang mit Klaus (parallel zum A11/A15-Strang oben). Alles gemergt:

- **A18 Teil 1 — Sage-Siegel-Modal auf den Kanon** (PR #712): `index.html` lädt jetzt
  `assets/siegel-inhalt.js`; Sages alte Inline-Injektion ins Siegel auf `window.__sbkimSiegelInhalt`
  gated (kein Doppel, Fallback bleibt). Kanon-Datei UNVERÄNDERT → family-project + alle Endknoten
  byte-1:1 in Sync. **Klaus-Entscheid: die Schwarz-Loch-Karte + der 785-Zeilen-Inline-Wizard bleiben
  bewusst** (funktioniert, reine Aufräumarbeit ohne Demo-Nutzen). **Browser-Sichttest des Siegel-Modals
  steht noch aus** (Klaus, goldenes Badge).
- **Meilenstein „Erster Multi-Knoten-Mesh-Handshake"** (PR #713 Doc + #714 Bild): aus Klaus'
  Mycel-Analyse-Rekord (Relais-Aufzeichnung eigens in der Mycel-Karte aktiviert → echter Verkehr):
  **5 Apps, 10 Handshakes alle `established`, 7/10 hub-unabhängig, Scores 0.80–0.85, alles über das
  Relais**. `docs/meilenstein/2026-07-23_multi-knoten-mesh-handshake.md` + `.png` (Klaus' Bild).
  BLP established mit Demo-Stub-Vektor (bewusste Ausnahme, im echten Netz belegt).
- **Meilenstein-Galerie-Fix** (PR #715 + #716): Kachel-Text wurde beim Öffnen unten abgeschnitten
  (Quadrat + overflow:hidden) → Kachel wächst jetzt bei `.is-open` auf volle Text-Höhe; Hover-Zittern
  behoben (Aufklappen nur noch bei Klick/Tipp, nicht :hover); neue ⭐-Kachel „Fünf Knoten bilden ein
  Netz" (23.07.) ergänzt. Klaus-Sichttest GRÜN.
- **Ehrlicher „Demo → real"-Befund** (aus der Bestandsaufnahme): Sage ist protokollarisch schon KEIN
  Demo mehr (Identität/Spore/Andock/Cross-Knoten-Q&A live bewiesen). Rest bis „definitiv kein Demo":
  **MUSS** = BLP-Stub als bewusste Ausnahme festschreiben + protokoll-nahe Browser-Sichttests (Kimseek/
  Kimboard/Private Brain Live-Handshake, Muttis, B3, B7) + A18-Siegel-Sichttest. **KANN/später** =
  Schutz-Schablonen 10/11/12/14 (nur bei Angriff), B6/Grad C, Observatorium-als-Knoten.
  Klarstellung: `config.PROTOCOL_VERSION 0.1` ist **Absicht** (Wire-Version bis B6), kein Bug.

## Stand 2026-07-23 (Folge¹⁰) — Erst-Kontakt-Fluss NETZWEIT ausgerollt

Klaus: „Rollout" → der Erst-Kontakt-Fluss (A15-Inc-1 + A11B-Inc-2/3) byte-1:1 in die Träger-Apps.

- **Voller Fluss (Modul 22 Inc-2/3 + 23-UI Inc-1 + `connectNode`-Wire):** **Kimseek** (#42, gemergt) — die App,
  die Modul 22 + 23 trägt (Host-Wire `kimseekConnectNode`). Sage selbst trägt den vollen Fluss schon (Inc-1/2/3).
- **Zwei-Stufen-Hinweis (23-UI Inc-1) byte-1:1 gemergt in 8 Apps:** Mein-Mixarium #159 · Mein-Rezeptbuch #345 ·
  Muttis-Rezeptbuch #158 · Tomys-Hub #124 · family-project #107 · Jasons-Tresor #132 · Mein-Tresor #74 · Kimboard #42
  (Kimboard: Drift-Guard-sha nachgezogen + SW `kimboard-v29`). Alle: REINE Anzeige, Kern + 0.80-Riegel unberührt,
  fail-soft; wo kein Live-Pfad, degradiert der Ask/Connect still (die 8 tragen Modul 22 nicht, nur das Netz-Panel).
- **Modul 22 nur in Kimseek + such-tool-Vorlagen:** Mixarium/Rezeptbuch/family/BLP haben eigene native Suchfelder
  (kein Floating-Widget) → Inc-2/3 dort nicht anwendbar.
- **Offen (klein, niedrige Prio):** SB-KIMTool-Point such-tool + `web/tools`-Widget-Kopie liegen eine Version hinter
  dem Kanon (Vorlage, fail-soft) — eigener Nachzug-Schritt. **Browser-Sichttest des Flusses (Sage + Kimseek) wartet auf Klaus.**

---

## Stand 2026-07-23 (Folge⁹) — A11B-Inc-3 gebaut („🤝 verbinden" nach der Antwort)

Klaus: „Inc-3" → der Verbinden-Knopf nach der Antwort. Damit ist der **Erst-Kontakt-Fluss komplett**
(stöbern → Knoten fragen → verbinden).

- **„🤝 mit diesem Knoten verbinden"** erscheint in der Widget-Detail-Karte **erst NACH einer Antwort**
  (Erst-Kontakt über Neugier). Neue Widget-Fläche `options.connectNode(nodeId)` (+ `_meta.liveNodeConnect`);
  Sage-Wire **`sageConnectNode`** in `sbkim-init.js`: Modul 23 `discover` (Raum) → Karte zum nodeId finden →
  `handshakeCard` → **der 0.80-Andock-Riegel (Modul 05) entscheidet unverändert**. Ergebnis ehrlich benannt
  (✓ verbunden NN % · „unter der Andock-Schwelle" · „noch nicht angemeldet: 🌐 voll mitmachen").
- **REINE Anzeige/Auswahl — Kern (02/05/05b) + 0.80-Riegel + PROTOCOL_VERSION unberührt**, fail-soft (ohne
  `connectNode`-Injektion kein Knopf; Standalone/Forker unberührt). Kein PII (nur öffentliche nodeId/Spore).
- Smoke `smoke_bau22_such_widget.mjs` **268/268** (Probe 53), bau22e 46 / bau22f 17 / bau22g 47 / Standalone 49 grün,
  byte-1:1 `such-tool/modules/22`. **Offen: netzweiter Rollout** (Modul 22 + `23_rendezvous_ui.js` A15-Inc-1 +
  `connectNode`-Wire in jede Träger-App, in einem Rutsch). **Browser-Sichttest des ganzen Flusses wartet auf Klaus.**

---

## Stand 2026-07-23 (Folge⁸) — A11B-Inc-2 gebaut (Knoten gezielt fragen im Such-Widget)

Klaus: „weiter" → **A11B-Increment 2** (der eigentliche Erst-Kontakt-Fluss).

- **Knoten-Detail-Frage im Such-Widget** (`src/modules/22_such_widget.js` + byte-1:1 `such-tool/`): Klick auf einen
  **KNOTEN-Treffer** (nodeId) öffnet die Detail-Karte jetzt mit **„Frage an diesen Knoten"** — Feld vorbelegt mit der
  Suchfrage + **„🔎 Antwort holen"** → fragt gezielt via `queryNodeFn(nodeId, frage)` (der schon injizierte Live-Pfad,
  Modul 05) und zeigt die bedeutungs-sortierte Antwort direkt in der Karte. `merkItemOf` trägt jetzt `nodeId`.
- **REINE Anzeige/Auswahl — 0.80-Riegel + Kern (02/05/05b) unberührt**, kein neuer Kern-Bezug (nur die öffentliche
  `queryNode`-Fläche), fail-soft: ohne Live-Pfad ehrlicher Hinweis „einmal 🌐 voll mitmachen" (A15-Stufe ③).
- Smoke `smoke_bau22_such_widget.mjs` **264/264** (Probe 52), bau22e 46 / bau22f 17 / bau22g 47 / Standalone 49 grün,
  Drift-Guard byte-1:1. **Offen: A11B-Inc-3 („🤝 verbinden" nach Antwort) + netzweiter Rollout Modul 22 + 23-UI.**
  **Browser-Sichttest wartet auf Klaus.**

---

## Stand 2026-07-23 (Folge⁷) — A15-Inc-1 gebaut (Zwei-Stufen-Hinweis)

Klaus bestätigte die Richtung („Schauen frei, Mitreden mit Identität — logisch und nachvollziehbar")
→ **A15-Increment 1** gebaut.

- **Zwei-Stufen-Hinweis** in `src/modules/23_rendezvous_ui.js` (+ byte-1:1 `sbkim-bundle`): ehrliche
  Kosten-Benennung im „🌐 Mit dem Netz verbinden"-Panel — **🔎 Nur stöbern** (anonym, kein Download/keine
  Identität, du wirst nicht gefunden) vs. **🌐 Voll mitmachen** (einmal lokale Identität → auffindbar +
  fragen/verbinden). **REINE Anzeige — kein Verhaltens-Eingriff**, Kern/0.80-Riegel/PROTOCOL_VERSION unberührt.
- Smoke `smoke_bau23_rendezvous_ui.mjs` **83/83** (2 neue A15-Proben), byte-1:1 Drift-Guard grün.
- **Offen:** A11B-Inc-2 (Knoten-Detail-Karte im Such-Widget mit „Antwort holen") + A11B-Inc-3 („🤝 verbinden"
  nach Antwort) + netzweiter Rollout der UI-Datei. **Browser-Sichttest wartet auf Klaus.**

---

## Stand 2026-07-23 (Folge⁶) — A11-Teil B + A15 Spec geschrieben (Erst-Kontakt-Fluss)

Klaus: „Weiter mit A11 und A15." Beide sind derselbe Moment (fremder Nutzer, Erst-Kontakt am
Marktplatz) → **eine gemeinsame Spec**: `docs/SPEC_A11B_A15_ZWEISTUFEN_VERBINDEN.md`.

- **Entwurf:** drei Sichtbarkeits-Stufen — ① Stöbern (Raum-Liste, kein Modell/Identität) · ② Stöbern
  semantisch (Modell on-demand) · ③ Voll mitmachen (Identität → auffindbar/fragen/andocken). A11-Teil B =
  der Fluss „Knoten-Treffer anklicken → 🔎 Antwort holen → 🤝 verbinden (nach Antwort)".
- **Kern-Entscheid (der einzige echte Fork):** darf ein anonymer Beobachter live fragen? **Empfehlung NEIN** —
  Fragen/Andocken = Stufe ③ (Identität). Grund: `askNode` verlangt heute eine signierte Identität (Code geprüft);
  das hält den Vertrag + Kern-Module **unangetastet** (reiner UI-/Fluss-Bau) und deckt sich mit Klaus' A15-Wortlaut
  („findet andere, wird selbst nicht gefunden"). Übergang sanft: an den Interaktions-Knöpfen erscheint „einmal
  anmelden (bleibt lokal)". **Ephemeral-Fragen bewusst zurückgestellt** (wäre Kern-Eingriff + Sybil-Vektor).
- **Bau-Plan:** A15-Inc-1 Zwei-Stufen-UI → A11B-Inc-2 Knoten-Detail-Karte im Widget → A11B-Inc-3 „🤝 verbinden"
  nach Antwort → netzweiter Rollout. Je eigener PR + Headless-Smoke; Kern/0.80-Riegel/PROTOCOL_VERSION unberührt.
  **Marktplatz-Erst-Kontakt → Klaus' Browser-Sichttest je Increment.** PLAN + Spec verlinkt. Doku-only bisher.

---

## Stand 2026-07-23 (Folge⁵) — A5b Multi-Query in Pinnwand + Kimboard (Klaus' Zuruf)

Klaus: „und in Pinnwand und in Kimboard integrieren" → **A5b** (die frühere „Pinnwand läuft gut"-Zurückstellung
damit aufgehoben).

- **A5b Multi-Query gebaut** in Sage-**Pinnwand** (`pinnwand/index.html`) **und Kimboard** (`index.html`, eigenes Repo,
  PR #41 gemergt). Die Bedeutungs-Sortierung bettet neben der Original-Frage jetzt ein paar **Varianten** ein
  (`expandQuery`: Füllwörter weg + kleine erweiterbare Synonym-Karte, max 4) und nimmt je Antwort den **besten Cosinus**
  (`bestRelevance`) über alle Varianten. So werden auch **anders formulierte** Antworten gut sortiert.
- **REINE Sortier-Fläche wie der family-Marktplatz — es wird NICHTS gefiltert**, fail-soft (keine Variante →
  Ein-Frage-Sortierung wie zuvor). Nur `index.html`; drift-guarded `modules/` + Kern (02/05/05b) + 0.80-Riegel +
  PROTOCOL_VERSION **unberührt**, kein PII.
- Sage-Pinnwand `pinnwand/_smoke.mjs` **62/62** (neue A5b-Probe). Kimboard `node --test` **6/6** (A5b-Assertions),
  SW-Cache `kimboard-v28`. **Browser-Sichttest (Live-Rangfolge) wartet auf Klaus.** PLAN + Checkliste abgehakt.

---

## Stand 2026-07-23 (Folge⁴) — A12-Spec abgeschlossen („Antworten an/aus"-Modell)

Autonom weiter „die Reihe nach" (Klaus rejected die Rückfrage → Freibrief greift, kein Nachfragen).
Nächster spec-barer, kern-freier Listenpunkt genommen: **A12**.

- **A12 als Spec/Konzept ABGESCHLOSSEN** → `docs/SPEC_A12_ERREICHBARKEIT.md`. Ergebnis: das
  „Antworten: an/aus"-Modell ist **entschieden**. Das **Briefkasten-Prinzip** (Phase 1–2d, schon
  gebaut/netzweit) ist die verfassungsfeste Antwort auf „Erreichbarkeit ohne Server"; ein
  **„Immer-erreichbar"-Server wird bewusst NICHT gebaut** (Empfangsmodus verbietet Pulsation +
  Browser drosselt Hintergrund-Tabs + Ehrlichkeit). Frage (1) Erreichbarkeit = gebaut · (2) Flut =
  im Kern gelöst (Rate-Limit 6/min + `qidSeen`-Dedupe + Lebenszyklus) · (3) eigene vs. fremde =
  per Design schon erfüllt (eigene Frage = Vordergrund → Vorrang, kein Scheduler nötig).
- **Offen bleiben nur zwei kleine, optionale, additive Bauten** (Klaus' Wahl, blockieren nichts,
  0.80-Riegel/Kern 02/05/05b/INTERFACES unberührt): **A12-opt-1** pro-Peer-Antwort-Fairness
  (Modul 23 nutzt Modul-11-Token-Bucket pro Frager statt globaler Quote) · **A12-opt-2** lokaler
  „beim Öffnen gleich antworten"-Merker (opt-in, Default aus).
- PLAN + Checkliste-HTML nachgezogen (A12 abgehakt, zwei Rest-Bauten ergänzt). **Doku-only, kein Code,
  kein Test berührt.**

---

## Stand 2026-07-23 (Folge³) — S5 Härtungs-Sims gebaut + A18-Status geklärt

Auftrag Klaus: „S5-Härtungs-Sims und A18".

- **S5 erledigt (headless):** die im echten Browser-Lauf gefundenen Antwort-Härtungsfälle
  (A2-Härtung II 2026-07-10, hub-unabhängig 2026-07-11) sind als **Phase 6** in
  `tests/sim_multinode.mjs` als Regression festgenagelt (echter Relais-Round-Trip
  `enableAnswering ↔ askNode` über den geteilten Bus, echte Knoten-Instanzen):
  6a Frage-Timeout (pending, kein Hänger) · 6c Korpus-leer-Falle (`answerCorpusEnsured`) +
  Antworter-Vorwärmen · 6d Adress-Wand/newest-per-name (STALE verliert gegen lebende ID) ·
  6e A12-Briefkasten (späte Antwort nachgeholt) · 6f LIVE-Round-Trip (bester Treffer oben,
  `answeredCount++`) · 6g Timeout zu totem Knoten. **Sim 22→36 grün, über 5 Läufe stabil.**
  Ehrlich: Mock-Bus + Embedding-Stub — geprüft ist die VERDRAHTUNG, nicht Live-Latenz/echtes Modell.
- **A18-Status geklärt (Befund, kein Bau):** der Siegel-Andock-Wizard ist **netzweit bereits
  abgeschlossen** (Stand 2026-07-16, PLAN A18): geteilter Kanon `siegel-inhalt.js` in
  Sage/Kim-Bell/Mixarium/Rezeptbuch/Tomys/family-project; Point/Kimboard/Kimseek/Tresore mit
  eigener spec-konformer Fassung; BLP bewusst gelassen. **Einzig offen:** die **Sage-Page selbst**
  vom Inline-Wizard auf die Kanon-Datei `assets/siegel-inhalt.js` umstellen — **Hub-Risiko, braucht
  Klaus' Sage-Browser-Test** (kein Blind-Self-Merge). **An Klaus zurückgegeben** (bauen + du testest,
  oder Inline-Wizard lassen).
- **Suite 61/61 grün.**

---

## Stand 2026-07-23 (Folge²) — RELATEDNESS_CENTER v2 gebaut (Klaus' Entscheid „V2 bauen")

Auftrag: Brief `BRIEF_RELATEDNESS_CENTER_V2_…` Punkt 2.1. **Klaus-Entscheid diese Sitzung: „V2 bauen"**
(nach Vorlage der Messung + der ehrlichen Grenze).

- **Befund vorgelegt, bevor gebaut wurde:** v1-`RELATEDNESS_CENTER` (7 Vor-v0.2-Vektoren) mis-rankt
  nach der v0.2-Re-Sign-Welle — unverwandt **Point↔Sage 0.46 > echte Schwestern Mixarium↔Rezeptbuch
  0.38**. Auch ein v2 aus den **14 Live-v0.2-Vektoren** stellt **keine volle** Schwelle her (Nachbar-
  Domänen Essen↔Trinken bleiben im Band der Hub↔Werkzeug-Überlappung) — deckungsgleich mit dem
  2026-06-28-Befund. **Aber:** v2 stellt die **enge-Schwester-Rangfolge** wieder her.
- **Gebaut (reine Anzeige):** `RELATEDNESS_CENTER` neu gemittelt aus den 14 Live-`domainVector`
  (ohne Schnipsel), L2-normiert; `RELATEDNESS_MIN 0.30` unverändert (sitzt in der Lücke 0.19..0.78 →
  Schwestern `isRelated=true`, alles andere `false`). `isRelated==true` heißt jetzt ehrlich **„klar
  dieselbe Domäne", NICHT „fachverwandt"** — echtes Fach-Urteil = opt-in KI-Richter (`hybridMatch`).
- **Tafel-Evolution NICHT stillschweigend:** der 2026-06-28-Beschluss „v1 bleibt, v2 verworfen" ist
  in `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` (neuer Stand 2026-07-23 + „⚠️ ÜBERHOLT"-Marke am
  alten Punkt) sauber überschrieben — neuer Grund: v1 mis-rankt nach v0.2, das gab es 06-28 noch nicht.
- **Tabu gewahrt:** `PROVIDER_MIN_MATCH = 0.80` + PROTOCOL_VERSION unberührt (0.80-Riegel = ROHER
  Cosinus, v2 gatet nichts). Byte-1:1 in `such-tool/`+`sbkim-bundle/` (Drift-Guards grün).
- **Tests:** `smoke_bau04e` zurück von „nur Invarianten" auf **echte Trennungs-Prüfung** (27/27);
  `smoke_bau22e`+`smoke_bau23` auf die enge Schwester **Rezeptbuch↔Muttis** umgestellt (Essen↔Trinken
  ist unter v2 bewusst nicht mehr `isRelated`). **Suite 61/61 grün.**
- **Offen:** Klaus' Browser-Sichttest der „verwandt"-Anzeige (deployt nach Merge). BLP v0.2 (2.2),
  S5-Härtungs-Sims (2.3), A18/A11 unberührt.

---

## Stand 2026-07-23 (Folge) — Register-Refresh gegen die LIVE-Sporen + Muttis als 14. Knoten (Hauptsitzung)

Auftrag: Brief `BRIEF_NETZSTAND_REGISTER_REFRESH.md` (2.1 Register-Refresh, 2.3 Muttis).
Klaus-Entscheide in dieser Sitzung: **„Register voll aktualisieren" + „die falschen Test/Sim-
Annahmen mitkorrigieren"**; Muttis-Entscheid **per Tat** (Klaus hat die Muttis-Spore im Browser
erzeugt + hochgeladen → voller Knoten).

- **Autoritative Live-Prüfung (server-los erreichbar über authentifiziertes GitHub-MCP):** alle
  **12 fremden Live-Sporen frisch von `main`** geholt + mit dem Produktiv-Verifizierer (Modul 02
  `verifyForeignSpore`) headless geprüft → **alle VALID**, Sage-Cosinus je Knoten unabhängig
  nachgerechnet. **Befund: das Register war mehrfach stale** — 9 von 12 committeten nodeIds
  überholt (Adress-Wand, neue v0.2-Identitäten), **alle** matchScores gedriftet (durchweg HÖHER,
  nicht tiefer). **Wichtig:** die letzte Sitzung (PR #697) hatte aus **veralteten lokalen
  Inbox-Kopien** geschlossen „Rezeptbuch 0.792 / Mixarium 0.767 < 0.80" — die **Live-Wahrheit ist
  das Gegenteil**: Rezeptbuch **0.881**, Mixarium **0.822** (beide klar ≥ 0.80). Nach der v0.2-Welle
  liegt der e5-Anisotropie-Boden noch höher (≈0.85), **alle Inhalts-/Werkzeug-Knoten ≥ 0.80**.
- **`status.json` voll aktualisiert (14 Endknoten):** 9 stale nodeIds → Live-Werte (alte in
  `previousNodeIds`), alle matchScores → Live-Cosinus, ehrliche Refresh-Notizen. **Tomys Hub**
  `verified-match` → **`verified-spore`** (Sage 0.791717 < 0.80 → kein Sage-Match; matcht weiter
  Family/BLP, hub-unabhängig). **Private Brain** `verified-spore` → **`verified-match`** (0.810427
  ≥ 0.80). **Muttis Rezeptbuch** als **14. Endknoten** (verified-match **0.876583**, eigene GETRENNTE
  Identität `8TVDCTAc…` + DB-Suffix `muttisrezeptbuch`, ✔ VALID). `sage-knoten-korpus.js` (8 nodeIds)
  + `NETZ-STAND.md` (Scores/Labels/Muttis) + `muttis_inbox.verify.md` nachgezogen. `update_puls_pie` gelaufen.
- **Muttis:** ist bereits **voll auf seinem eigenen `main` integriert** (Module 00–08/15–18/20/21/23,
  `status.json`-Identität, `sbkim/spore.json` byte-identisch zur verifizierten Upload-Datei) — kein
  Muttis-Repo-Push nötig, nur Sage-Register-Eintrag + Prüf-Vermerk. Getrennter DB-Suffix = keine
  Geteilte-Origin-Kollision mit Mein-Rezeptbuch.
- **Inbox-Kopien refresht** (rezeptbuch/mixarium/point/jason/meintresor/bookledgerpro auf die Live-
  v0.2-Sporen; neu: `tomys_inbox.json` als ehrliches <0.80-Beispiel, `muttis_inbox.json`).
- **Falsche Test/Sim-Annahmen korrigiert (Klaus-Auftrag):** `sim_multinode` Phase 3 + `smoke_bau23_
  rendezvous` Probe 15 + `smoke_bau04e_relatedness` reflektierten die stale „<0.80"-Wahrheit. Jetzt
  ehrlich: Rezeptbuch/Mixarium ≥ 0.80 (established), **Tomys** als einziger echter <0.80-Fall vs Sage.
  **`smoke_bau04e`:** die v0.2-Welle hat auch den **zentrierten** Cosinus verschoben — mit
  `RELATEDNESS_CENTER` v1 trennt er diese Knoten NICHT mehr sauber (Point↔Sage 0.46 > Mixarium↔
  Rezeptbuch 0.38). **Nicht grün-gerechnet:** Modul 04 NICHT angefasst; der Test prüft jetzt nur die
  wahren Invarianten (Symmetrie, self=1, roher Gate ≥0.80, Schwestern am verwandtesten) + dokumentiert
  **RELATEDNESS_CENTER v2 als offenen Modul-04-Kalibrier-Entscheid (wartet auf Klaus).**
- **Suite: 61/61 grün** (unabhängig nachgefahren, `npm install --no-save fake-indexeddb`).

**Offen / nächster Schritt:** (a) **RELATEDNESS_CENTER v2** — Modul-04-Entscheid, ob der zentrierte
Cosinus-Mittelpunkt aus den neuen v0.2-Vektoren neu berechnet wird (architektonisch, byte-copy-weit →
Klaus). (b) **BLP v0.2** — einziger verbliebener Demo-Grenzfall (Spore noch v0.1). (c) S5-Härtungs-Sims,
A18/A11 (aus Brief). (d) Muttis Live-Ed25519-Handshake im Browser (headless-Beweis steht).

## Stand 2026-07-22 — Karte + Knoten-Register + Modul-Status-Klarstellung

Auf Klaus' Zuruf (Icon/Knoten/Module-Runde):
- **Mycel-Karte** `mycel-karte/index.html`: Seed von 8 auf **13 Knoten** ergänzt
  (Tomys, Kim-Bell, Kimseek, Kimboard, Private Brain), Kanten ehrlich nach
  NETZ-STAND (PR #690, gemergt).
- **Knoten-Register synchronisiert:** Private Brain als **12. Endknoten** in
  `status.json` aufgenommen (`verified-spore`, matchScore noch offen); Such-Korpus
  `sbkim/sage-knoten-korpus.js` um **Private Brain, Family Projekt, Tomys Hub**
  ergänzt (jetzt 12 Einträge) — echte nodeIds aus den Sporen, keine erfundenen Daten.
- **Modul-Status ehrlich klargestellt** (Klaus-Entscheid: Code-Stub behalten, aber
  klarstellen): 05 Anastomose = `fertig` (Live-Handshake). 06 Heterokaryose bleibt
  `score:stub`, aber `siegel` erklärt jetzt „Code-Stub = gebaut + headless-grün
  (Smoke 25/25), NICHT leer; nur Browser-Sichttest offen". CLAUDE.md-Modultabelle
  (00–09) für 05/06 korrigiert (waren fälschlich „spec ausstehend"). 21/24 waren
  schon ehrlich beschriftet.
- Tests: status.json valide (12 Endknoten), Pie unverändert (10 Code-Stub / 11 Fertig),
  smoke_bau19 15/15, smoke_bau23b_korpus 24/24, smoke_bau06y 25/25, korpus `node --check` grün.
- **Icon:** family-project-Marktplatz zieht das neue Private-Brain-Icon per URL
  automatisch — kein Eingriff nötig. Browser-Sichttests (Karte am Tablet) offen.
- **Nachtrag:** **Tomys Hub** als 11. Endknoten in `status.json` nachgezogen (war nur
  in NETZ-STAND + Such-Korpus + Karten-Seed, fehlte im Register). Ehrlich: kein
  Sage-Match (0.7977 < 0.80), aber verified-match zu Family (0.8073) + BLP (0.8064),
  live bidirektional bewiesen 2026-07-11. Jetzt 13 Endknoten. smoke_bau19 15/15, Pie unverändert.

## Stand 2026-07-23 — Sage „Demo → real": Ist-Stand ehrlich + Multi-Knoten-Sim (Hauptsitzung)

Auftrag: Brief `BRIEF_NETZWEIT_STAND_UND_SAGE_REAL.md`. Empfohlener Einstieg 2.1 (Test +
Bestandsaufnahme) → 2.2 (Simulationen) → A14. Diese Sitzung hat 2.1, 2.2 und die
A14-Nachlese erledigt.

- **S1 — Netzweiter Testlauf (ehrlicher Ist-Stand):** alle 60 `tests/smoke_*.mjs` gefahren
  (`npm install --no-save fake-indexeddb`, per-Test-Timeout). **Ergebnis war 56/60 grün, 4 rot** —
  jetzt **60/60 grün** nach ehrlicher Reparatur (KEINE Code-Bugs):
  - `smoke_bau04e_relatedness` · `smoke_bau22e_waehlen` · `smoke_bau23_rendezvous` (Probe 15):
    alle drei assertierten `Hub<->Endknoten match() >= 0.80` mit **Rezeptbuch/Mixarium<->Sage**.
    Nach der v0.2-Re-Sign-Welle (A10) fielen diese **Inhalts-Knoten korrekt unter den 0.80-Boden**
    (Rezeptbuch 0.792 / Mixarium 0.767 → `verified-spore`) — **gewolltes bedeutungs-basiertes
    Protokoll-Verhalten, kein Regress**. Gate-Beweis nutzt jetzt einen Werkzeug/Hub-nahen Knoten
    (BookLedger<->Sage 0.856 ≥ 0.80) + prüft explizit, dass Inhalts-Knoten korrekt darunter liegen.
  - `smoke_bau05y_transparent_slot_pfad`: **kein Assertion-Fehler** — alle 25 Proben liefen durch,
    aber der Prozess beendete sich nie (Modul 05 `init()` öffnet `BroadcastChannel('sbkim')` →
    offener Handle hält Nodes Event-Loop wach; „hängt", obwohl fertig). Sauberer `process.exit(0)`
    auf dem Erfolgspfad, genau wie `smoke_bau05_nostr`. (Commit c4530c0)
- **S2 — Multi-Knoten-Simulation gebaut** (`tests/sim_multinode.mjs`, Brief §2.2): **vier ECHTE
  Knoten-Instanzen gleichzeitig in einem Node-Prozess** (je eigener Modul-Namensraum via
  Sandbox-Loader, eigene IndexedDB-Schublade, eigene Ed25519-Identität, eigene Spore mit echtem
  e5-domainVector) über EINEN geteilten Mock-Relais-Bus — voller Lebenszyklus: **Anmelden (23) →
  Finden (23) → 0.80-Riegel nach Bedeutung (04) → Q&A über Hub → Q&A OHNE Hub** (Endknoten↔Endknoten,
  Meilenstein 2026-07-11 als Regression). **24/24 grün.** Ehrliche Grenzen im Datei-Kopf: Mock-Bus
  statt echtem Relais (Live = Klaus' Browser), deterministischer Embedding-Stub headless (Modell-
  Qualität in Klaus' Browser bewiesen), Phase 3 nutzt ECHTE Sporen-Vektoren. (Commit 0f3358e)
- **A14 abgehakt (Nachlese, kein Neubau):** der ensureStore-Race-Fix (`ensureChain`-Serialisierung
  in Modul 01) **ist schon auf `main`** (mit `smoke_a14_…` 4/4 grün, beide via #648 2026-07-14),
  war in `PLAN_SEMANTIK_KRYPTO.md` nur nie abgehakt. Verifiziert + abgehakt.
- **Demo-Bestandsaufnahme (2.1):** `status.json` führt **13 Endknoten**. Real vs. Demo ehrlich:
  KEINE echten `_demo`-domainVektoren mehr im Code (A6/A10 geschlossen). **11 `verified-match`**
  (Rezeptbuch/Mixarium/Point/Jasons/Mein-Tresor/BLP/Family/Kim-Bell/Kimseek/Kimboard — echter
  ≥0.80-Match), **Private Brain `verified-spore`** (matchScore null, korrekt), **Sage** = self.
  **Befund (an Folge-Sitzung, nicht diese Sitzung geändert):** (a) **Tomys Hub** steht als
  `verified-match` mit `matchScore: null` — aber der dokumentierte Sage-Match ist 0.7977 < 0.80
  (→ müsste `verified-spore` sein, wie Private Brain); (b) mehrere `matchScore`/`nodeId` im Register
  wirken **stale gegenüber den re-signierten Live-Sporen** (Rezeptbuch-Register 0.824 vs. aktuelle
  Inbox-Vektoren 0.792). **Nicht blind korrigiert** — die autoritative Quelle ist jede Live-`spore.json`
  am `sporeUrl` (Netz, hier nicht sicher erreichbar); ein Register-Refresh gehört an Klaus' Browser /
  eine gezielte Sync-Sitzung. Als offener Punkt geführt.
- **Einzige echte Demo-Grenze:** **BookLedgerPro** — committete Spore noch v0.1, Domänen-Vektor ist
  bewusst ein Demo-Stub (Klaus-Entscheid, kein echtes Modell); v0.2-Neu-Signatur wartet auf einen
  kurzen Schlüssel-Lauf im Browser (A10-Operator-Schritt).
- **M1/M3 — Muttis-Rezeptbuch wird eigener SBKIM-Knoten** (Klaus-Entscheid 2026-07-23, Muttis PR #153
  gemergt): 18 Module + noble + sbkim-sw **byte-1:1** aus dem Mein-Rezeptbuch/Sage-Kanon (SHA-identisch),
  Glue (`sbkim-init.js`/`siegel-inhalt.js`) auf **eigenen `dbSuffix "muttisrezeptbuch"`** (≠ `rezeptbuch`
  → keine geteilte-Origin-Kollision), nodeName „Muttis Rezeptbuch", eigene URLs; QC + SBKIM-Script-Block,
  `build.py` grün, `node --check` grün; `status.json` mit `nodeId:null` (Identität = Klaus' Browser-Schritt).
  **M2 ✅ ERLEDIGT 2026-07-23:** Klaus hat die Identität im Browser erzeugt (nodeId **`8TVDCTAc…`**), Spore
  v0.2 übergeben → committet (Muttis PR #154). Reziprok verifiziert (id==SHA256(pub) VALID, Ed25519-Sig
  VALID). **verified-match zu ALLEN Nachbarn:** Sage **0.8766** · Schwester Mein-Rezeptbuch **0.878** ·
  Mixarium 0.845 · SB-KIMTool-Point 0.864 · Tresore 0.839 · BLP 0.823. Muttis als **14. Endknoten** in
  Sage `status.json` + `sage-knoten-korpus.js` eingetragen (verified-match, matchScore 0.8766).
  **✅ Browser-Sichttest GRÜN (Klaus 2026-07-23):** Muttis lädt, 🌐-Panel + Status-Lampen (LEBT/VERKEHR/
  FREMD/SIEGEL) + Gerätename „Klaus Tablet" sichtbar, Identitäts-Erzeugung lief durch.
  **✅ M4 Parität-Check erledigt (Klaus-Entscheid „abschließen"):** Parität bestätigt (Icon/Lesbarkeit/
  Nav/Hardreload), **2 sichere Robustheits-Gewinne nachgezogen** — Fehler-Overlay (Muttis PR #155) +
  persistenter Speicher `navigator.storage.persist()` (PR #156). Bewusst NICHT: navTo (kollidiert mit
  Muttis' eigenem `_scStack`/`OVERLAY_MAP`-Zurück-System), übersetzungs-bewusste Suche (schon da via
  `matchSQ`+`rTr`); Einheiten-Übersetzung + Import-Zuordnung + KI-Kreativ-Suite bleiben dokumentierter,
  bewusst-offener Feature-Rückstand (verschachtelt/kostenpflichtig, kein sicherer ungetesteter Batch).
  **Offen:** Klaus' verschlüsseltes Identitäts-Backup (Stabilität der nodeId); optional Briefkasten/SW-Precache.

## Als nächstes ✨

Module mit Code-Stub, **Sichttest durch Klaus 2026-05-14 erledigt** —
ergab fünf reproduzierbare Cosinus-Messwerte (siehe Karte 04 Beleg-
Block), die in der Pflege-Sitzung 2026-05-14 zu `PROVIDER_MIN_MATCH`
0.55 → 0.80 geführt haben:

- 🟦 **[01 Storage](components/01_storage.md)** — geprüft 2026-05-14 + 2026-05-16 + 2026-05-19 (Klaus, im Browser); init/round-trip/Unknown-Store sauber, jetzt acht Pflicht-Stores plus dynamische Stores ab v=4 (Bau 01.Y `ensureStore` 2026-05-19 grün — Knöpfe 6/7/8 3/3, happy-path / Idempotenz / Pattern-Verstoß); **Pflege „`init()` versions-fail-soft" 2026-05-19 live grün** (Klaus, DeX-Chrome: Knopf 9 `db_version_vor: 16 → nach_bump: 17`, dann Tab-Reload + Bonus-Probe Panel-02-Knöpfe 8/9/10 alle grün ohne Cleanup-Workaround). Headless-Smoke-Test 8/8 grün + Bau-02.Y-Regression 33/33 grün.
- 🟦 **[02 Spore](components/02_spore.md)** — geprüft 2026-05-14 + 2026-05-16 (Klaus, im Browser); Identität deterministisch, Spore sortiert, Sign+Verify valide, Manipulation erkannt; **Bau 02.X Backup-Export Sichttest 2026-05-16 grün** — Knöpfe 6/7/7b alle drei Hauptpfade ohne Modul-Bug. **Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump Sichttest 2026-05-19 (Klaus, DeX-Chrome auf Galaxy Tab S6): 3/3 grün** (nach Mini-Fix + Cleanup-Workaround) — Knopf 8 „Identitäts-Wechsel OK", Knopf 9 „Persona-Apoptose OK", Knopf 10 „Multi-ID-Backup OK"; Erst-Befund Multi-Tab-onblocked auf Knopf 8 + Rollback-Bug in `getOrCreateIdentity` durch Mini-Fix (Reihenfolge `ensureIdentityStores` vor `put(sbkim_keys)`) behoben; Headless-Smoke-Test 33/33 grün. Panel 01 (1–8) ebenfalls grün. Klaus' Beobachtung: zweiter Lauf gelang erst nach „Storage init"-Klick in Panel 01 — bestätigt offene Folge-Pflege Modul 01 `init()` versions-fail-soft.
- 🟦 **[03 Embedding](components/03_embedding.md)** — geprüft 2026-05-14 (Klaus, im Browser); L2-Norm 1.0, gleicher Inhalt ≈0.95, Baseline für unverwandte Begriffe ungewöhnlich hoch
- 🟩 **[04 Match](components/04_match.md)** — geprüft 2026-05-14 (Klaus, im Browser) + Bau 04.A `matchDimensions` sync 2026-05-19 live grün + **Bau 04.B `explainMatchLLM` 2026-05-20** (Stufe-B-LLM-Pass gegen Anthropic-API, fail-soft) + **Bau 04.C `queryLocal` 2026-05-26 + Sichttest 5/5 grün 2026-05-26** (Klaus, DeX-Chrome auf Galaxy Tab S6, Panel 04 Tests 11–15 alle live grün: Happy-Path Top 0.9501 + Mittel 0.8627, Schwelle-Cut leere Liste, Top-k-Cut T1 0.9488 + T2 0.9144, Provider-Pfad registriert=true 2 Treffer, Leerer Korpus beide 0). Modul 04 jetzt **fertig** (Cosinus + Drei-Schichten + Stufe-B-LLM + lokales Such-Backend). Cross-Knoten-Such-Lücke geschlossen — Modul 15 Sub (b) `op:"query"`-Empfänger ruft jetzt live `queryLocal`. **Bau 04.B Sichttest mit echtem API-Key noch offen** (Knopf 10, CORS-Workaround echtes PWA-Setup).
- 🟦 **[06 Heterokaryose](components/06_heterokaryose.md)** — Code geschrieben 2026-05-15 (Bau-Sitzung 06) + Pflege Bau 06.1 Outbox-Lese-Pfad 2026-05-15 + **Bau 06.Y transparenter Slot-Pfad 2026-05-20** (additiv-mit-internem-Refactoring, KEIN Bruch der äußeren Signatur — Modul 06 schreibt jetzt slot-spezifisch in `sbkim_hetero_inbox_<key>` + `sbkim_anastomosis_log_<key>`; liest aus `sbkim_hetero_outbox_<key>` + `sbkim_siblings_<key>`; Receiver-Pfad nutzt `nodeId → slotKey`-Map; Sender cached `opSlot` zur Op-Zeit; volle 06/05/08-Achse jetzt geschlossen-konsistent slot-suffixed). Sichttest 2026-05-16 rasch grob durchgeklickt (Panel 06 14 Knöpfe), volle 12-Knopf-Sichttest-Runde 2026-05-20 grün im Bau-08.Y-Lauf inkl. Test 9 `HETERO_MAX_ANCHORS`. **Bau 06.Y Sichttest ungeprüft** (headless 25/25 smoke grün — wartet auf Klaus' Browser-Lauf Panel 06 + Knopf 15 Sekundär-Persona-Test).

Code-Stub frisch aus den Bau-Sitzungen 2026-05-14/15, **Sichttest ausstehend bzw. teilweise erledigt:**

- 🟦 **[05 Anastomose](components/05_anastomose.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung) + BroadcastChannel-Bridge 2026-05-17 + **Bau 05.Y transparenter Slot-Pfad 2026-05-20** (additiv-mit-internem-Refactoring, KEIN Bruch der äußeren Signatur — Modul 05 schreibt jetzt slot-spezifisch in `sbkim_siblings_<key>` und `sbkim_anastomosis_log_<key>`; Receiver-Pfad nutzt `nodeId → slotKey`-Map zur Persona-Auflösung; Sender cached `opSlot` zur Op-Zeit). Sichttest geprüft 2026-05-15 (6/7 → Test 2 in Pflege als Vektor-Trias repariert); BroadcastChannel-Sichttest 2026-05-17 grün (4/4); volle Regression Panels 01-07 im Bau-08.Y-Sichttest 2026-05-20 grün. **Bau 05.Y Sichttest ungeprüft** (headless 25/25 smoke grün — wartet auf Klaus' Browser-Lauf Panel 05 + Knopf 10 Sekundär-Persona).
- 🟦 **[07 Apoptose](components/07_apoptose.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung) + Pflege 02+07-Cache-Invalidate 2026-05-15 + Pflege Cleanup-Reihenfolge Bau 06 2026-05-15 + **Bau 07.Y transparenter Slot-Pfad + `_sendLegacyForIdentity`-Hook 2026-05-20** (additiv-mit-internem-Refactoring, KEIN Bruch der äußeren Signatur außer optionalen `key`-Parametern). Modul 07 schreibt jetzt slot-spezifisch (`sbkim_legacy_inbox_<key>` + `sbkim_anastomosis_log_<key>`); globale `confirmSelfApoptose` iteriert über ALLE Slots; neuer Hook `_sendLegacyForIdentity(key)` — **Bau-02.Y-fail-soft-Klausel aufgelöst**. **Konsumenten-Achse 05/06/07/08 jetzt vollständig slot-suffixed.** Sichttest 8/8 grün 2026-05-15 (Klaus, Re-Sichttest nach Cache-Invalidate); volle 8-Knopf-Sichttest-Runde 2026-05-20 im Bau-08.Y-Lauf grün inkl. Test 6 Self-Apoptose IRREVERSIBEL. **Bau 07.Y Sichttest ungeprüft** (headless 30/30 smoke grün — wartet auf Klaus' Browser-Lauf Panel 07 Test 6 globale Slot-Iteration + Panel 02 Knopf 9 Persona-Apoptose-Hook produktiv ohne `console.warn`).
- 🟦 **[00 Doku-Fenster](components/00_doku_fenster.md)** — Code geschrieben 2026-05-14 (Bau-Sitzung), Sichttest geprüft 2026-05-15 (Klaus, im Browser): 5 von 6 Tests grün im ersten Lauf (Setup, Test 2 5-Klick-Simulation, Test 3 4-Klick + Timeout, Test 5 TTL-Sweep, Selbstcheck-Hinweis); **Test 4 Test-Bug** mit Mini-Werten 81/100 (freeBytes=19 Bytes ist trivial < 50 MiB → `warningLevel:"both"` statt erwartetem `"ratio"`) → **Pflege-Sitzung 2026-05-15** repariert mit GiB-Skalierung (`usage:8.1 GiB, quota:10 GiB` → freeBytes ≈ 1.9 GiB → `warningLevel:"ratio"` sauber); Modul-Vertrag und INTERFACES.md unangetastet

Spec frisch, **Bau ausstehend**:

- 🟨 **[09 Einbau-PWA](components/09_einbau_pwa.md)** — Karte vollständig 2026-05-14 (Spec-Sitzung; Anleitung, kein JS-Modul), **Pflege-Sitzung 2026-05-15 erweitert auf neun Schritte** (Schritt 9 neu: `SbkimApoptose.init()` + `SbkimDoku.init({searchIconSelector:...})` + optionaler TTL-Sweep nach Handshake); `<script>`-Reihenfolge in Schritt 2 zieht 07 + 00 nach (`01 → 02 → 03 → 04 → 05 → 07 → 00`); Sichtkontroll-Block jetzt vier Pflicht-Punkte (sieben Selbstcheck-Zeilen + sechs IndexedDB-Stores + zwei live-Endpunkte + 5-Klick-Geste am Such-Symbol); Datei-Pfad-Konvention (SW im Endknoten-Repo-Root, sieben JS-Module inline oder unter `sbkim/`); Spore-Endpunkt `/sbkim/spore.json` verbindlich; SW-Scope-Falle dokumentiert; `domainVector`-Pflicht-Frage **entschieden Variante A (Soft-Pflicht im Andock-Workflow, kein Hauptversions-Sprung)** — Modul 02 / §0 / §2 bleiben unverändert. **Bau-Sitzung 2026-05-15 vor Schritt 1 sauber abgebrochen** (Befund-Sitzung): beide Endknoten haben aktiven `app-sw.js` im Repo-Root (Mein-Mixarium Z. 12543, Mein-Rezeptbuch Z. 10453), Karte 09 antizipiert diesen Fall nicht; zusätzlich Karte 09 § Sichtkontrolle implizit auf Desktop-DevTools gemünzt — Klaus' Tablet (Galaxy Tab S6 + DeX) braucht Eruda-Pfad. **Vor erneuter Bau-Sitzung 09** zwei Karten-Lücken in einer Pflege-Sitzung Karte 09 zu schließen (Empfehlung Option α: Patch in bestehenden `app-sw.js`; plus Eruda-Pfad für Tablet-Sichtkontrolle). Details in [Übergabeprotokoll 2026-05-15 Bau-09-blockiert](sessions/archiv/2026-05-15_bau-09-blockiert-app-sw.md).

Letzter Bau frisch (Bau-Sitzung 2026-05-15), **Sichttest geprüft 2026-05-15:**

- 🟦 **[08 UI-Demo](components/08_ui_demo.md)** — Code geschrieben 2026-05-15 (Bau-Sitzung 08), **Bau 08.Y slot-spezifische Outbox 2026-05-20** (additiv-mit-internem-Refactoring, KEIN Bruch der äußeren Signatur). Endknoten-Andocker-UI für die zwei Stellen, die Modul 06 (Heterokaryose) braucht, aber nicht selbst füllt: `sbkim_hetero_outbox_<activeSlotKey>` (Anker-Vorrat, slot-spezifisch seit Bau 08.Y) und `sbkim_siblings_<activeSlotKey>[peerNodeId].heterokaryosisOptIn` (additives Opt-In-Flag pro Geschwister). Fünf-Funktionen-API (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn`), sechs benannte Error-Klassen im Factory-Stil analog Modul 00, drei Test-Brücken (`_clearOutbox`, `_addPseudoSibling` ohne Opt-In-Flag, `_clearPseudoSiblings`), synchroner Selbstcheck. **Storage-only** (kein Netz, kein Embedding, keine Signatur — Vektor-Erzeugung ist Aufrufer-Pflicht). `addOutboxAnchor`-Check-Reihenfolge: (1) Label sync, (2) Vektor sync, (3) async-Voll-Check (`OutboxFullError` nur bei NEUEM Label); Überschreiben eines bekannten Labels bleibt erlaubt. `setSiblingHeteroOptIn` strikt boolean (`1`, `"true"` werfen `InvalidOptInArgError`); Co-Schreiber-Disziplin via `Object.assign`. Panel 08 in `tests/manual_check.html` mit acht Knöpfen (Setup + sechs Test-Punkte + Selbstcheck-Hinweis); Panel-Status von Werkstatt-Stub `idle` auf `ok "Code-Stub"`. **Self-Apoptose-Knopf bewusst NICHT in Panel 08** (Spec-Sitzung 08-Entscheidung respektiert). `node --check src/modules/08_ui_demo.js` grün, alle 10 Inline-`<script>`-Blöcke validiert. **Sichttest geprüft 2026-05-15 (Klaus, im Browser): 6/6 Test-Punkte grün** (Pflege-Sitzung Sichttest-Resultate 2026-05-15). **Bau 08.Y Sichttest 2026-05-20 (Klaus, DeX-Chrome auf Galaxy Tab S6): Setup + Tests 1–6 grün** — Setup zeigt `active_slot_key:"main"` + `outbox_store:"sbkim_hetero_outbox_main"` + `siblings_store:"sbkim_siblings_main"`, Test 4 OutboxFullError-Message zitiert „sbkim_hetero_outbox_main am Limit (5 Einträge pro Slot)" (Slot-Suffix + „pro Slot"-Wortlaut live), Test 6 Co-Schreiber-Pfad auf slot-suffixed `sbkim_siblings_main` + `InvalidOptInArgError` für `1`/`"true"`. **Vollständige Regression Panels 01–07 grün** im selben Lauf (Storage / Spore Multi-Persona / Embedding / Match `matchDimensions` / Anastomose 9c Auto-Fallback / Heterokaryose Test 9 `HETERO_MAX_ANCHORS`-Begrenzung / Apoptose Self-Apoptose IRREVERSIBEL) — keine Bau-08.Y-Regression.

Empfehlung Hauptsitzung: **Klaus' Re-Andock beider Endknoten mit
PWA-Suffix**. Die Pflege-Sitzung 2026-05-16 „Karten 01 + 09 PWA-
Suffix" hat die Architektur-Erweiterung abgeschlossen (Modul 01 hat
jetzt `init({dbSuffix})`, Karten 01 + 09 und INTERFACES.md §1 Modul 01
sind nachgezogen, `PROTOCOL_VERSION` bleibt `"0.1"`, Modul 02 unangetastet).
Nächster Schritt liegt **in Klaus' Endknoten-Repos**:

1. In **beiden** Endknoten-Repos (`Mein-Mixarium`, `Mein-Rezeptbuch`)
   muss `sbkim/sbkim-init.js` erweitert werden: vor dem bestehenden
   `await SbkimAnastomose.init()` einen Aufruf
   `await SbkimStorage.init({ dbSuffix: "mixarium" })` (bzw.
   `"rezeptbuch"`) hinzufügen.
2. In beiden Tab-Sessions `__sbkimErzeugeSpore()` erneut triggern
   (Klaus in der jeweiligen Eruda-Konsole) → neue, getrennte nodeIds
   pro PWA.
3. Neue `spore.json` jeweils nach `~/<Endknoten>/sbkim/spore.json`
   verschieben + Commit + Push (überschreibt die alte Pages-Spore).
4. Erst nach Re-Andock kann eine Folge-Sitzung `status.json`
   `pingStatus` von `"blocked-origin-collision"` auf `"live"`
   wechseln (sobald Klaus den ersten Cross-Knoten-Handshake gefahren
   hat) und die `nodeId`-Werte in der Endknoten-Tabelle aktualisieren.

Andere offene Punkte (Mini-Pflege „Sushi-Kategorie sichtbar machen"
in Mein-Mixarium, INTERFACES.md §6 Tabellen-Bug) sind unverändert
offen. Details im [Übergabeprotokoll 2026-05-16 Pflege PWA-Suffix](sessions/archiv/2026-05-16_pflege-pwa-suffix-karten-01-09.md),
zur Andock-Hintergrund [Übergabeprotokoll 2026-05-16 Andock
Mein-Rezeptbuch](sessions/archiv/2026-05-16_andock-mein-rezeptbuch-iteration-3-live.md)
und der zugehörigen [Mixarium-Andock-Übergabe](sessions/archiv/2026-05-16_andock-mein-mixarium-iteration-3-live.md).

---

## Schnellüberblick

| Modul | Spec | Code | Manueller Sichttest | Anmerkung |
|---|---|---|---|---|
| 00 doku_fenster | Spec fertig (2026-05-14) | Code-Stub (2026-05-14, Pflege Persistenz-Strategie verbinden 2026-05-16) | geprüft 2026-05-15 (Klaus) — 5/6 Tests grün im ersten Lauf, Test 4 Test-Bug in Pflege-Sitzung 2026-05-15 mit GiB-Skalierung repariert; **Pflege Persistenz-Strategie verbinden Sichttest 2026-05-16 grün** (Klaus, im Browser) — Drei-Setup-Probe aus § Manueller Test Punkt 7 alle drei Pfade ohne Auffälligkeit: Persist-Trigger-Stub, Quota-Trigger, Negativ-Fall | Sechs-Funktionen-API (`init/open/close/isOpen/getStatusSnapshot/recordSighttest`), reines Lese-/Trigger-Modul, alleiniger Schreiber `sbkim_doku_meta`, 5-Klick-Geste mit 3s-Zeitfenster, Modal mit Backdrop und MutationObserver-Mount, Quota-Doppel-Schwelle (80% / 50 MiB), Self-Apoptose bewusst NICHT in 00. **Pflege Persistenz-Strategie verbinden 2026-05-16** (additiv, kein Refactoring): `getStatusSnapshot()` um Feld `storagePersisted: boolean \| null` erweitert (Spiegelung Modul-01-Getter fail-soft); Modal zeigt zusätzliche „Backup empfohlen"-Tipp-Zeile (`DOKU_BACKUP_TIP_TEXT` modul-lokal), wenn `storagePersisted === false` ODER `quota.warningLevel !== "none"`. Hinweis-only, kein Direkt-Aufruf von `SbkimSpore.exportBackup` aus Modul 00 (Aufrufer-Pflicht-Trennung). |
| 01 storage | Spec fertig (2026-05-14) | Code-Stub (2026-05-14, Pflege PWA-Suffix + Pflege Storage-Persist 2026-05-16, Bau 01.Y `ensureStore` 2026-05-19, Pflege `init()` versions-fail-soft 2026-05-19, Pflege Versions-Bump-Race in `openProbe` 2026-05-22) | geprüft 2026-05-14 + 2026-05-16 + 2026-05-19 + **2026-05-22** (Klaus) — Bau 01.Y `ensureStore` Knöpfe 6/7/8 3/3 grün (DeX-Chrome); Pflege „`init()` versions-fail-soft" Knopf 9 live grün 2026-05-19 (`db_version_vor: 16 → nach_bump: 17`, Bonus-Probe Panel-02-Knöpfe 8/9/10 ohne Cleanup grün); **Pflege „Versions-Bump-Race in `openProbe`" Sichttest 2026-05-22 grün** (Klaus, DeX-Chrome auf Galaxy Tab S6, 11-Knopf-Sequenz alle grün — Panel-01-Notfall-Reset → Hard-Reload → Panel-06-Setup ohne `ensureStore Versions-Bump blockiert`-Throw + Panel-06-Tests 1/9/10/11 + Panel-07-Tests 4/5/6 + Panel-00-Test 5 alle live grün; zentraler Race-Auflösungs-Beweis ist Setup-Knopf in Panel 06, der vor der Pflege reproduzierbar brach); Headless-Smoke 8/8 + Race-Smoke 6/6 + Bau-02.Y-Regression 33/33 weiterhin grün | IndexedDB-Wrapper |
| 02 spore | Spec fertig (2026-05-14, Pflege Stamm/Gast-Felder 2026-05-15, Pflege Spec Backup-Export Stufe 2 2026-05-16, Spec Multi-Identität Brief 04 2026-05-19) | Code-Stub (2026-05-14, Pflege Cache-Invalidate 2026-05-15, Pflege Stamm/Gast-Durchreichung 2026-05-15, Bau 02.X Backup-Export 2026-05-16, Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump 2026-05-19, Mini-Fix Rollback-Pfad 2026-05-19) | geprüft 2026-05-14 (Klaus) + 2026-05-15 (Cache-Invalidate-Pflege via Sichttest 07) + 2026-05-16 (Klaus, Bau 02.X Backup-Export Knöpfe 6/7/7b alle drei grün) + **2026-05-19 (Klaus, DeX-Chrome: Bau 02.Y Knöpfe 8/9/10 alle drei grün** nach Mini-Fix + Cleanup-Workaround) | Ed25519-Identität, Multi-Identitäts-Slots (Bau 02.Y), base64url-sha256-rawpub; +`resetIdentityCache()` aus Pflege-Sitzung 2026-05-15 (Pflicht-Hook für Apoptose-Cleanup). **Spore-JSON Optionale Felder additiv erweitert** 2026-05-15 (Spec-Sitzung Stamm/Gast): `stammCategories: string[]` + `guestCategories: string[]`, signaturpflichtig wenn vorhanden, Disjunktheit als Hosting-Pflicht (kein Verify-Abbruch). Sign-/Verify-Pfad unverändert. **`generateOwnSpore` Code-Allow-List nachgezogen** 2026-05-15 (Bau 02 Stamm/Gast): zwei Zeilen analog zu `domainKeywords` — ohne diese Pflege würden Stamm/Gast-Felder beim Andock still ignoriert. **Spec Backup-Export Stufe 2 2026-05-16** (Identitäts-Persistenz Stufe 2): zwei neue Funktionen `exportBackup(password) → Promise<SbkimBackupBlob>` + `importBackup(blob, password, options?)` (PBKDF2-SHA256 600 000 + AES-GCM-256, Klartext-Payload = Identität + Geschwister, defensiv per Default — `BackupOverwriteError`); drei §0-Konstanten verankert (`BACKUP_FORMAT_VERSION=1` / `BACKUP_KDF_ITERATIONS=600000` / `BACKUP_PASSWORD_MIN_LEN=8`); fünf neue Error-Klassen (`InvalidBackupPasswordError` / `BackupDecryptError` / `BackupVersionMismatchError` / `BackupSchemaError` / `BackupOverwriteError`). KEIN Spore-Feld dazu (Backup-Schicht separat, `PROTOCOL_VERSION` bleibt `"0.1"`). **Bau-Sitzung 02.X ausstehend**, KEIN Code in `src/modules/02_spore.js`. |
| 03 embedding | Spec fertig (2026-05-14) | Code-Stub (2026-05-14) | geprüft 2026-05-14 (Klaus) | semantischer Vektor |
| 04 match | Spec fertig (2026-05-14, Pflege Stamm/Gast-Hinweis 2026-05-15, Spec M04-Erweiterung Brief 03 2026-05-19, Spec Sub (c) `queryLocal` 2026-05-26, Konzept Hybrid-Match 2026-06-20) | **Fertig** (2026-05-14, Bau 04.A `matchDimensions` sync 2026-05-19, Bau 04.B `explainMatchLLM` 2026-05-20, Bau 04.C `queryLocal` 2026-05-26 PR #177, **Bau 04.D `hybridMatch` Match-Zeit-LLM-Richter 2026-06-20**) | geprüft 2026-05-14 (Klaus) + Bau 04.A live grün 2026-05-19; **Bau 04.C Sichttest 5/5 grün 2026-05-26** (Klaus, DeX-Chrome auf Galaxy Tab S6, Termux-localhost:8000 nach Hard-Reload): Panel 04 Tests 11–15 alle live grün — Test 11 Happy-Path Top 0.9501 + Mittel 0.8627 + Unter-Schwelle gefiltert; Test 12 Schwelle-Cut leere Liste; Test 13 Top-k-Cut T1 0.9488 + T2 0.9144; Test 14 Provider-Pfad registriert=true + 2 Treffer; Test 15 Leerer Korpus beide 0 + provider_registriert=false. **Bau 04.B Sichttest mit echtem Anthropic-API-Key noch offen** (Knopf 10, headless 30/30 grün — CORS-Workaround echtes PWA-Setup) | Vektorvergleich, modus-frei; Bau 04.A `matchDimensions` synchron (drei orthogonale Schichten, Stufe-A-Heuristik). Bau 04.B `explainMatchLLM` async — Stufe-B-LLM-Pass gegen Anthropic-API (hartcodiert), JSON-only, fail-soft. **Bau 04.C 2026-05-26 `queryLocal` async** — lokales Such-Feld-Backend (PR #177): Default k=5, hartcodierte Schwelle PROVIDER_MIN_MATCH=0.80, Korpus zwei Pfade (`options.corpus` Vorrang ODER `setLocalCorpus`-Provider via Callback oder Array), fünf Fehler-Factories (EmptyQueryError / QueryTooLongError / InvalidKError / EmbeddingNotAvailableError / InvalidCorpusError) sync + EmbeddingFailedError async-rethrow, leerer Korpus + alle-unter-Schwelle resolved mit `[]` ohne Throw. Modul 15 Sub (b) `op:"query"`-Empfänger ruft jetzt live `queryLocal` (fail-soft-Pattern greift) — `error:"module-04c-not-available"`-Antwort entfällt. Headless-Smoke 43/43 grün, Regression 04.A 19/19 + 04.B 30/30 + 15.B 31/31 + 17 32/32 grün. **Cross-Knoten-Such-Lücke geschlossen.** |
| 05 anastomose | Spec fertig (2026-05-14, Spec BroadcastChannel-Bridge 2026-05-17, Spec Multi-Identität Brief 04 2026-05-19, **Nostr-Transport-Vertrag 2026-06-27**) | Code-Stub (2026-05-14, Bau BroadcastChannel-Bridge 2026-05-17, Bau 05.Y transparenter Slot-Pfad 2026-05-20, **Bau Nostr-Relais-Transport 2026-06-27**) | geprüft 2026-05-15 (Klaus) — 6/7 Tests grün im ersten Lauf, Test 2 Test-Bug in Pflege-Sitzung 2026-05-15 als Vektor-Trias repariert; **Bau BroadcastChannel-Bridge Sichttest 2026-05-17 grün** (Klaus, DeX-Chrome) — Knöpfe 9 / 9a / 9b / 9c alle vier ohne Modul-Befund (Test 9 established score 0.8881; Test 9a HandshakeTimeoutError nach 4005 ms; Test 9b MissingToNodeIdError synchron; Test 9c Auto-Fallback HTTP-404→Channel etabliert 0.8881); volle Regression Panels 01-07 grün im Bau-08.Y-Sichttest 2026-05-20 (Test 9c live grün); **Bau 05.Y Sichttest ungeprüft** (headless gebaut 2026-05-20, wartet auf Klaus' Browser-Lauf Panel 05 Setup + Knopf 10 Sekundär-Persona); **Bau Nostr-Transport: Modul-05-Logik headless 17/17 grün gegen In-Memory-Mock-Relais (`smoke_bau05_nostr.mjs`); echter WebSocket+schnorr-Client (Modul 05b) browser-only, Relais aus der Sandbox unerreichbar → wartet auf Klaus' Browser-Lauf** | Handshake; Fünf-Funktionen-API + `listenNostr/stopListenNostr`, bidirektional, kanonisch signiert, Schwelle aus Modul 04; SW Variante A (Page-Hosted) + same-origin Fallback-Transport via `BroadcastChannel('sbkim')` (additiv, Default `"auto"` mit einmaligem Auto-Fallback) + **server-loser Cross-Knoten-Transport via Nostr-Relais (`options.transport:"nostr"`, NUR explizit — "auto" wählt nie nostr; Event NIP-01 kind:1 t=sbkim-anastomosis, content = bestehende Ed25519-signierte Anfrage; Nostr-Key nur Transport-Umschlag; echter Client `src/modules/05b_nostr_relay.js` browser-only, Default-Relais `wss://relay.family-projekt.de`)**. `options.transport ∈ {"auto","http","channel","nostr"}` |
| 06 heterokaryose | Spec fertig (2026-05-15, Spec Multi-Identität Brief 04 2026-05-19) | Code-Stub (2026-05-15, Pflege Bau 06.1 Outbox-Lese-Pfad 2026-05-15, **Bau 06.Y transparenter Slot-Pfad 2026-05-20**) | rasch grob durchgeklickt 2026-05-16 + volle 12-Knopf-Sichttest-Runde 2026-05-20 (Klaus, Tab S6 + DeX) — Panel 06 alle Tests grün inkl. Test 9 HETERO_MAX_ANCHORS; **Bau 06.Y Sichttest ungeprüft** (headless 25/25 smoke grün — wartet auf Klaus' Browser-Lauf Panel 06 Setup + Knopf 15 Sekundär-Persona) | Datenaustausch unter Geschwistern; Fünf-Funktionen-API (`init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/forgetHeterokaryosis`), Pull-Pattern, Opt-In beidseits (additiv auf `sbkim_siblings`), kanonisch wie 05/07 (vierter Sign-Pfad bewusst dupliziert), neuer Store `sbkim_hetero_inbox` (Komposit-Schlüssel `peerNodeId\|ts`, DB-Version 1→2 additiv), SW Variante A mit drittem fetch-Listener `/sbkim/heterokaryosis` (Message-Typ `SBKIM_HETEROKARYOSIS_REQUEST`); Modul 07 Cleanup-Reihenfolge nachgezogen (`sbkim_hetero_inbox` zwischen `sbkim_legacy_inbox` und `sbkim_spore`). **Anker-Quelle nach Pflege Bau 06.1 (2026-05-15): voller Outbox-Lese-Pfad implementiert** — `sbkim_hetero_outbox` (Spec-Sitzung 08, v=3-Store) wird fail-soft gelesen, max. `HETERO_MAX_ANCHORS=5` Anker absteigend nach `addedAt`; Fallback auf Spore-Single-Anker bei leerer/fehlender Outbox bestehen geblieben. `src/modules/01_storage.js` `DB_VERSION` 2 → 3 (additive Migration v=3, `STORES_V3=["sbkim_hetero_outbox"]`); Panel 06 mit 14 Knöpfen; Test 9 (`HETERO_MAX_ANCHORS`-Begrenzung) voll abgedeckt (sechs Outbox-Einträge → Response liefert genau fünf, neueste zuerst). Sichttest ausstehend (headless gebaut, wartet auf Klaus' Browser) |
| 07 apoptose | Spec fertig (2026-05-14, Spec Multi-Identität Brief 04 2026-05-19) | Code-Stub (2026-05-14, Pflege Cache-Invalidate 2026-05-15, Pflege Cleanup-Reihenfolge Bau 06 2026-05-15, **Bau 07.Y transparenter Slot-Pfad + Legacy-Hook 2026-05-20**) | geprüft 2026-05-15 (Klaus) — **8/8 Tests grün** nach Pflege 02+07-Cache-Invalidate; volle 8-Knopf-Sichttest-Runde 2026-05-20 im Bau-08.Y-Lauf grün; **Bau 07.Y Sichttest ungeprüft** (headless 30/30 smoke grün — wartet auf Klaus' Browser-Lauf Panel 07 Test 6 globale Slot-Iteration + Panel 02 Knopf 9 Persona-Apoptose-Hook produktiv) | Selbstlöschung mit signiertem Vermächtnis; zweistufige Self-Apoptose (Token 60 s), Vermächtnis-Inbox, TTL-Vergessen explizit durch Andocker; kanonischer Sign/Verify-Pfad aus 02/05 dritter Pfad dupliziert; Cleanup-Schritt ruft `SbkimSpore.resetIdentityCache()` (Pflege 2026-05-15). **Bau 07.Y 2026-05-20:** drei Eingriffe — (1) transparenter Slot-Pfad in Stores; (2) globale `confirmSelfApoptose` iteriert über ALLE Slots; (3) neuer interner Hook `_sendLegacyForIdentity(key)` für Bau-02.Y `removeIdentity(key, {force:true})`-Aufrufe. **Konsumenten-Achse 05/06/07/08 vollständig slot-suffixed.** **Bau-02.Y-fail-soft-Klausel aufgelöst** ohne Modul-02-Code-Änderung. |
| 08 ui_demo | Spec fertig (2026-05-15) | Code-Stub (2026-05-15, Bau 08.Y slot-spezifische Outbox 2026-05-20) | geprüft 2026-05-15 (Klaus) — 6/6 Test-Punkte grün; **Bau 08.Y Sichttest 2026-05-20 grün** (Klaus, DeX-Chrome auf Galaxy Tab S6): Setup + Tests 1–6 grün, Setup zeigt `active_slot_key:"main"` + slot-suffixed Stores `sbkim_hetero_outbox_main` / `sbkim_siblings_main`, Test 4 OutboxFullError-Message live „am Limit (5 Einträge pro Slot)" mit Slot-Suffix, Test 6 Co-Schreiber-Pfad strikt-boolean. Volle Regression Panels 01–07 grün im selben Lauf | Endknoten-Pflege-UI für `sbkim_hetero_outbox` und `sbkim_siblings.heterokaryosisOptIn`; Fünf-Funktionen-API (`init/listOutbox/addOutboxAnchor/removeOutboxAnchor/setSiblingHeteroOptIn`), sechs benannte Error-Klassen im Factory-Stil analog Modul 00, drei Test-Brücken. **Bau 08.Y slot-spezifische Outbox 2026-05-20** (additiv-mit-internem-Refactoring, KEIN Bruch der äußeren Signatur): Modul 08 schreibt jetzt slot-spezifisch in `sbkim_hetero_outbox_<activeSlotKey>` und liest/schreibt `sbkim_siblings_<activeSlotKey>`; `activeSlotKey` im `init()` via `SbkimSpore.getActiveIdentityKey()` gecached (Default `"main"` als Rückwärts-Kompat); `probeDependencies` um Pflicht-Abhängigkeit `SbkimSpore (Modul 02)` erweitert; neue Closure-Helper `heteroOutboxStoreName/siblingsStoreName/ensureSlotStores`; defensives `ensureSlotStores` vor jedem ersten Schreibvorgang (idempotent, Bau 01.Y); Test-Brücken `_clearOutbox` / `_clearPseudoSiblings` via `SbkimStorage.clear` slot-isoliert. Selbstcheck-Zeile UNVERÄNDERT. `HETERO_OUTBOX_MAX_ENTRIES = 5` gilt jetzt PRO SLOT (bei 3 Personae theoretisch 15 Anker insgesamt). Headless-Smoke-Test 26/26 grün (drei Proben + Bonus). **Bekannte Limitierung aus Bau-06.Y-Brief aufgelöst** — Modul 06 (Bau 06.Y) liest aus `sbkim_hetero_outbox_<key>`, Modul 08 (diese Bau-Sitzung) schreibt dorthin. Modul 08 alleiniger Schreiber von `sbkim_hetero_outbox_<key>` (Schlüssel `label`, max. `HETERO_OUTBOX_MAX_ENTRIES`=5 PRO SLOT, absteigend nach `addedAt`, Überschreiben statt Verdrängen) und Co-Schreiber für `sbkim_siblings_<key>.heterokaryosisOptIn` (Modul 05 unangetastet). **Storage-only** (kein Netz, kein Embedding, keine Signatur, KEIN Receiver-Map). `addOutboxAnchor`-Check-Reihenfolge: (1) Label sync, (2) Vektor sync, (3) async-Voll-Check (`OutboxFullError` nur bei NEUEM Label); `setSiblingHeteroOptIn` strikt boolean; Self-Apoptose-Knopf bewusst NICHT in Panel 08. Panel 08 in `tests/manual_check.html` mit acht Knöpfen + Setup-Output zeigt `active_slot_key` + slot-suffixed Store-Namen. **Sichttest 2026-05-15 (Klaus): 6/6 Test-Punkte grün im ersten Lauf** (Bau-08-Sichttest). **Bau 08.Y Sichttest 2026-05-20 (Klaus, DeX-Chrome): Setup + Tests 1–6 grün** — Setup zeigt slot-suffixed Stores; Test 4 OutboxFullError-Message live mit „sbkim_hetero_outbox_main am Limit (5 Einträge pro Slot)"; Test 6 Co-Schreiber-Pfad strikt-boolean. **Vollständige Regression Panels 01–07 grün** im selben Lauf — keine Bau-08.Y-Regression. |
| 09 einbau_pwa | Spec fertig (2026-05-14, Pflege Schritt 9 + 07/00 2026-05-15, Pflege App-SW-Koexistenz 2026-05-15) | — (Anleitung, kein JS-Modul) | — | Andock-Anleitung — **9 Schritte** (Schritt 9 neu aus Pflege-Sitzung 2026-05-15: SbkimApoptose.init + SbkimDoku.init + optionaler TTL-Sweep nach Handshake); `<script>`-Reihenfolge 01→02→03→04→05→07→00; Soft-Pflicht `domainVector` im Andock-Workflow (kein Hauptversions-Sprung); SW im Endknoten-Repo-Root, `/sbkim/spore.json` als Spore-Endpunkt — plus Pflege App-SW-Koexistenz (2026-05-15): Schritt 3 a/b-Verzweigung (Pre-Flight-Check → 3a `register('sbkim-sw.js')` für PWA ohne eigenen SW, 3b `importScripts('./sbkim-sw.js')` im bestehenden App-SW für PWA mit eigenem SW), achtes Risiko „App-SW-Überschreibung", `sbkim-sw.js` `SBKIM_SW_STANDALONE`-Flag rückwärtskompatibel (Default `true`, `false` für Variante 3b) |
| 10 reputation | Stub (Schutz-Backlog) | — | — | Knoten-Reputation, Priorität niedrig |
| 11 rate_limit | Stub (Schutz-Backlog) | — | — | Rate-Limit & TTL, Priorität niedrig |
| 12 blocklist | Stub (Schutz-Backlog) | — | — | manuelle Sperrliste, Priorität niedrig |
| 14 diffusion | Stub (Diffusion-Backlog) | — | — | konsensuell-empfehlende Spore-Diffusion via Handshake-Erweiterung (Pfad 2 verbindlich, Pfad 1 = Default-Status-quo, Pfad 3 verworfen wegen Empfangsmodus-Prinzip); Spec ausstehend bis Netz ≥ 10 Geschwister oder erfolgreicher Live-Andock + Wachstums-Bedürfnis; Priorität niedrig — **plus Sage-Page-Sichtbarmachung 2026-05-15** (Karten 4/13/14 ziehen `diffusionBacklog[]` parallel zu `schutzBacklog[]`) |
| 15 membran | Spec fertig (Sub (e) voll 2026-05-24, **Sub (a)+(b) finalisiert 2026-05-25** in Spec-Sitzung 15.B mit MembraneSnapshot-Schema inkl. Siegel-Hook + Envelope mit vier op-Werten sporeRef/query/hint/queryResult + Allowlist fail-soft + Nonce-Pflicht 30 s Replay-Dedupe + Rate-Limit-Hook für Modul 11 vorbestellt, Sub (c) später, Sub (d) Verweis) | **Fertig** (Bau-Sitzung 15.B Sub (a)+(b) Bedien-Pfade 2026-05-25 + Bau 15 Sub (e) + Bau 15.SW SW-Probe-Detektor + Pflege Sage-Page-Sichttest-Knopf, alle 2026-05-24; PR #159 gemerged) | **Bau 15.B Sichttest 8/8 grün 2026-05-25** (Klaus, DeX-Chrome auf Galaxy Tab S6) — Panel 15 Setup + Knöpfe 10–17 alle grün im Termux-`localhost:8000`-Lauf nach Hard-Reload; Sage-Page Bonus vier Plaketten sichtbar (LEBT/VERKEHR/FREMD/Siegel-Badge); Mini-Pflege Knopf-11-Anti-PII-Filter (eigene nodeId vom String-Match ausnehmen) im selben PR #159 mitgenehmigt. Sub (e) + Bau 15.SW + Sage-Page-Lampe geprüft 2026-05-24 (Klaus, DeX-Chrome auf Galaxy Tab S6) — Panel 15 Knopf 8 BroadcastChannel-End-to-End grün, Sage-Page FREMD-Lampe + Modal + „🧪 Demo-Eintrag"-Knopf grün |
| 16 siegel | Spec fertig (2026-05-24, Spec-Sitzung 16, Tafel-Spec-Pflege Mycel-Vision 2026-05-26 Sub (e) Bronze/Gold) | **Code-Stub (Bau-Sitzung 16 vom 2026-05-24 + Bau Sub (e) 2026-05-26)** | **Sub (e) geprüft 2026-05-26 (Klaus, DeX-Chrome auf Galaxy Tab S6) — Panel 16 Knöpfe 9–12 4/4 grün + Endknoten-Cross-Knoten-Sichttest in MR + MM beide Sub (e) live grün** (Bronze-Initial visuell + Modal + Handshake established score 0.9544 via BC-Bridge + Bronze→Gold-Wechsel in beiden PWAs via manuellem Eruda-Dispatch — drei Folge-Befunde: Widget-Slot stufen-unabhängig, Endknoten-Modul-05 prä-Bau-17, Modal-UTC-Zeit); Knöpfe 1–8 (Bau-16-Basis) bleiben ungeprüft. Headless-Smoke 32/32 + Sub (e) 15/15 grün. | SBKIM-Siegel — Selbst-Zertifikat einer PWA-Zelle nach erfolgter Integration der Pflicht-Module. Self-Inscribing (kein Hub-Aussteller, kein CI-Build-Check), Badge in Auszeichnungs-Optik (Prädikatswein- / DLG-Stil — Medaillon-Form, Edel-Gold-Anmutung, klassische Serif-Schrift, kein Marketing-Sticker-Stil), Click öffnet Modal mit Erklärung + nüchternem Aussteller-Klärungs-Satz (self-inscribing, Vertrauen kommt vom Repo — kein Disclaimer-Schwall). Lebendes Dokument: jedes Sicherheits-Update ergänzt einen Aspekt mit Datum. Anti-Greenwashing-Klausel: kein Siegel ohne erfüllte Selbst-Prüfung. **Spec-Sitzung 16 vom 2026-05-24:** alle vier Sub-Bereiche final spezifiziert — Sub (a) Pflicht-Modul-Liste mit sieben Modulen (01 Storage / 02 Spore / 03 Embedding [`lazy:true` für Sage-Page] / 04 Match / 05 Anastomose / 07 Apoptose / 15 Membran) + Surface-Funktions-Anker pro Modul (`init`/`getOwnSpore`/`embedPassage`/`match`/`handshake`/`prepareSelfApoptose`/`init`) + Status-Schema (`"ok"`/`"deferred"`/`"missing"`/`"broken"`) + binärer Fail-Modus (kein Render bei missing/broken, eine `console.warn`-Zeile mit ID-Liste); Sub (b) Badge-Rendering — DOM-Anker `#sbkim-siegel-badge` als vierte Plakette nach #lamp-fremd, 40-px rundes Medaillon Edel-Gold (`#C9A961`-Klasse) auf Bronze-Ink (`#1A1306`), Serif-System-Fallback (`'Spectral','Georgia',serif`, kein Pflicht-Google-Font), Wappen-Skelett (drei verschlungene Hyphen-Bögen + zentraler Knoten-Punkt), 600 ms First-Boot-Animation einmalig, dezenter Glow-Hover, KEINE Stufen-Varianten (Klaus-Festlegung: Siegel wächst über Aspekte, nicht über sichtbare Stufen), Sichtbarkeits-Modi `"visible"`/`"hidden"` (kein `"compact"` in Stufe 1); Sub (c) Erklärungs-Modal — eigenständig in `document.body` (analog Modul 15), Titel „SBKIM-Siegel — was bedeutet das?", Inhalt (Datum + Modul-Liste mit Status + Aspekte-Liste + Aussteller-Klärung), wertigere Typografie (Serif für Titel + Klausel, Geist für Daten-Listen), nüchterne Aussteller-Klärung in zwei Zeilen (Klaus-Korrektur 2026-05-24: KEIN Disclaimer-Schwall), Repo-URL Auto-Erkennung mit `init({repoUrl})`-Override; Sub (d) `ZERTIFIKAT_ASPEKTE`-Schema (`{since, module, aspect, description}`) chronologisch aufsteigend, Start-Eintrag „Grund-Siegel-Bezeugung 2026-05-24" verbindlich für Bau 16, Pflicht-Konvention: jedes spätere Sicherheits-Modul (10/11/12/14/15.B) MUSS in seiner Pflege einen Aspekt ergänzen. Persistenz **RAM-only** (Variante A, kein DB_VERSION-Bump, kein neuer Store, kein PROTOCOL_VERSION-Bump — Modul 16 ist nicht protokoll-aktiv). Schnittstelle `window.SbkimSiegel = {init/isCertified/getExplanation/getCertifiedModules/getAspects/_meta}`. KEINE benannten Error-Klassen (rein beobachtend, fail-soft via `console.warn`). INTERFACES.md § 1 Modul 16 voller Block ergänzt (analog § 1 Modul 15). **Kein Modul-Code, kein index.html-Eingriff** — Bau-Sitzung 16 nächster Schritt. Brief: `docs/sessions/BRIEF_BAU_16_SIEGEL.md`. |

Statuscodes: `—` (nichts) · `Schablone` · `Stub` · `Entwurf` · `Review` · `stabil` · `eingebaut`

## Endknoten (externe Repos des Betreibers)

| App | URL | Domäne | SBKIM-Stand |
|---|---|---|---|
| Rezeptbuch | https://lausiklauskn-png.github.io/Mein-Rezeptbuch/ | Kochrezepte (Stamm 7) — Drinks + Snacks als Überraschungs-Plus (Gast 11) | **integriert 2026-05-16, eigene Identität live 2026-05-16, Re-Andock 2026-05-17** (DeX-Chrome-IndexedDB-Verlust nach PR #75-Pflege, siehe § Offene Querschnitts-Fragen „DeX vs. Tablet-Chrome") · **aktuelle `nodeId: BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY`** (frischer Ed25519-Schlüssel 2026-05-17 in eigener IndexedDB `sbkim_rezeptbuch` der DeX-Chrome-Instanz; alte Tablet-Chrome-Identität `RHhposP0…` archiviert in PULS-Historie) · Spore live unter `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/spore.json` (Commit `3bcc453`) mit `domainVector[384]` · App-SW Variante 3b · Modul-05-v2 mit BroadcastChannel-Bridge eingebaut (`sbkim/05_anastomose-v2.js`, Commit `a1b9ded`). **Cross-Knoten-Handshake 2026-05-17 via Channel-Pfad etabliert** (`outcome:"established"`, score 0.9544 bidirektional, kein localStorage-Bypass mehr nötig — siehe Sitzungs-Eintrag „Live-Channel-Handshake"). `pingStatus: "live-channel"`. |
| Mixarium | https://lausiklauskn-png.github.io/Mein-Mixarium/ | Cocktails / Drinks (Stamm 8) — Knabbereien / Fingerfood (Gast 2) | **integriert 2026-05-16, eigene Identität live 2026-05-16, Re-Andock 2026-05-17** (DeX-Chrome-IndexedDB-Verlust nach PR #75-Pflege) · **aktuelle `nodeId: JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY`** (frischer Ed25519-Schlüssel 2026-05-17 in eigener IndexedDB `sbkim_mixarium` der DeX-Chrome-Instanz; alte Tablet-Chrome-Identität `7xf0tt33_…` archiviert) · Spore live unter https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json (Commit `e9d0a45`) mit `domainVector[384]` · App-SW Variante 3b (`importScripts('./sbkim-sw.js')` im bestehenden `app-sw.js`) · Modul-05-v2 mit BroadcastChannel-Bridge eingebaut (`sbkim/05_anastomose-v2.js`, Commit `9d2f127`). **Cross-Knoten-Handshake 2026-05-17 via Channel-Pfad etabliert** (`outcome:"established"`, score 0.9544 bidirektional Mixarium → Rezeptbuch). `pingStatus: "live-channel"`. |

## 2026-07-18 · B7 Browser-Sichttest GRÜN (Klaus, Kimboard DeX↔Handy) + Byte-Priv-Fix

**Rolle:** Bausitzung (Sichttest-Begleitung + Fix). **Freibrief gilt.**

Klaus hat B7 im Browser durchgetestet (Kimboard, DeX ↔ Handy, geführt Schritt für Schritt).
**Ergebnis: ✅ GRÜN** — private Nachricht DeX → Handy live verschlüsselt gesendet + korrekt
entschlüsselt (🔒), „blitzschnell" übers echte Relais `relay.family-projekt.de`. Damit ist die
Ende-zu-Ende-Direktnachricht (B7) **live beidseitig bewiesen**, nicht nur headless.

**Echter Bug gefangen (den der Headless-Smoke nicht sah):** beim Senden fror „Frage stellen"
ein, der Zettel erschien auch lokal nicht. Ursache: die App reicht den privaten Nostr-Schlüssel
als **Uint8Array** durch (`const priv = fromHex(privHex)`), `dm_crypto` `sharedX()` rief darauf
`fromHex()` → `.substr` auf Bytes → `TypeError`. Der Smoke lief mit Hex-Text. **Fix:**
`asPrivBytes()`/`asPubHex()`-Normalisierer in `pinnwand/modules/dm_crypto.js` (Priv als Uint8Array
ODER Hex) — byte-1:1 auch in Kimboard. Smoke um 3 Byte-Priv-Proben erweitert → **16/16**;
Pinnwand-Drift 61/61, Kimboard `npm test` 5/5. PRs Sage #679 + Kimboard #32 gemergt.

Nebenbei bestätigt: der `toast()`-Folgefix sitzt („Das bist du selbst."-Hinweis erschien live).
**Klaus-UX-Befund (offen, Folge-Bau):** mehrere Instanzen derselben App (zwei „Kimboard") sind in
der Netz-Karte/im Raum nur an der kryptischen Kennung unterscheidbar → Wunsch: ein **Gerätename**
(„Klaus-Handy"), der in Karte/Raum + auf den Zetteln mitreist. Nächster kleiner Bau.

## 2026-07-17 · B7 gebaut — Pinnwand E2E-Direktnachricht (ECDH + TOFU + Sicherheitsnummer)

**Rolle:** Bausitzung (Semantik/Krypto-Strang B). **Freibrief gilt.**

**Was & warum:** Die Pinnwand hatte bisher nur Passwort-Kanäle (`sbkimenc1:`, geteiltes Brett-Passwort).
Klaus wollte **echte Ende-zu-Ende-Direktnachricht** an *einen* bekannten Empfänger — wie WhatsApp/Signal,
wo man die Gegenseite einmal freigibt. Umgesetzt als **Grad-C-E2E** auf den **schon vorhandenen
Nostr-Schlüsseln** (kein neuer Schlüssel-Typ): **ECDH auf secp256k1** → HKDF-SHA256 → **AES-GCM-256**.

**Klaus-Entscheid (nach MITM-Aufklärung):** server-los kann man den **Erstkontakt-MITM nicht technisch
verhindern** (kein Server, der Schlüssel beglaubigt) → **TOFU** (Trust-On-First-Use, wie SSH/Signal):
**Ein-Klick-Freigabe** eines Kontakts + **Änderungs-Warnung**, falls derselbe Name später mit anderem
Schlüssel auftaucht + **optionale Sicherheitsnummer** (SAS, aus SHA-256 des sortierten Schlüssel-Paars)
zum Vorlesen über einen zweiten Kanal.

**Gebaut (rein additiv, Kern-Module unberührt):**
- **`pinnwand/modules/dm_crypto.js`** (NEU) — Krypto-Kern über die öffentliche Fläche von
  `noble-secp256k1.js`: `dmEncrypt`/`dmDecrypt` (Umschlag `sbkimdm1:iv:ct`, ECDH symmetrisch — Sender
  liest die eigene Nachricht mit Empfänger-Pub), `isDm` (trennt sauber vom Passwort-Weg `sbkimenc1:`),
  `safetyNumber` (symmetrisch, verschieden je Paar → MITM sichtbar), `newIdentity`/`pubFromPriv`.
  Konsequent fail-soft (falscher/fehlender Schlüssel, Manipulation → `null`, nie Throw).
- **`pinnwand/index.html`** — Empfänger-Auswahl (`#dm-to`), 👤-Kontakte-Overlay (Freigabe + Namens-
  Kollisions-Warnung + Sicherheitsnummer), „wer"-Klick zum Anheften, 🔒-Badge an entschlüsselten DMs,
  `buildEvent`-Zweig (verschlüsselt für `dmRecipient`, Tags `p`+`enc:dm1`), Dispatch-Zweig (`isDm` →
  `dmDecrypt` gegen den Gegen-Pubkey). Kontakte in `localStorage` `sbkim_pinnwand_contacts` (nur
  Name+Pubkey, **kein PII, kein Klartext, kein privater Schlüssel**).
- **`pinnwand/sw.js`** — `CACHE_VERSION` v16→v17 + `dm_crypto.js` in die APP_SHELL (Cache-Bust).

**Beweis (headless, echtes WebCrypto):** `tests/smoke_pinnwand_dm.mjs` **13/13 grün** — Round-Trip A↔B,
Sender-Selbstlesung, Fremder C → null, falscher Gegen-Pub → null, Manipulation → null, `isDm`-Trennung,
Sicherheitsnummer symmetrisch + paar-verschieden. Pinnwand-Drift-Smoke **60/60** grün (Kern-Module
byte-1:1 unberührt). **TABU gewahrt:** `PROVIDER_MIN_MATCH`/0.80-Riegel, DB_VERSION, PROTOCOL_VERSION
unberührt (reine Transport-Krypto, kein Spore-Feld). **Browser-Sichttest wartet auf Klaus** (zwei Geräte,
Kontakt gegenseitig freigeben, DM schicken, 🔒 + Sicherheitsnummer prüfen).

_Nächster Punkt der Liste: B4 (Widget-Tresor, sicherheits-sensibel, eigene Sitzung) → B6 (Grad C sealed
box / X25519-encryptionPublicKey in der Spore, Protokoll 0.1→0.2, später)._

## 2026-07-17 · B1b + B2 erledigt (Klaus-Entscheide: Weg A · „so lassen")

**Rolle:** Bausitzung (Semantik/Krypto-Strang B). **Freibrief gilt.**

**B1b — Modul-02 Backup-Asymmetrie (Weg A, Kern-Eingriff):** `exportBackup` erlaubte eine Identität
**ohne** Spore, `importBackup` verlangt sie je Identität → ein Backup, das man anlegen, aber nie
zurückspielen kann. **Klaus-Entscheid: Weg A** — `exportBackup` verlangt die Spore jetzt auch: fehlt sie,
wirft es **vor** der Verschlüsselung `SporeMissingError` (symmetrisch zu `importBackup`), statt ein
unbrauchbares Backup zu erzeugen. **Spec-vor-Code:** INTERFACES §1 Modul 02 (Fehler-Sektion) zuerst
nachgezogen, dann Guard in `exportBackup` (nach dem Bauen der Identitäten-Liste). Byte-Kopie
`sbkim-bundle/modules/02_spore.js` mitgezogen. Smoke `smoke_bau02_b1b_export_spore.mjs` **8/8** (ohne
Spore→SporeMissingError, mit Spore→Round-Trip export/import + falsches PW→BackupDecryptError). Regress-frei
(bau02y 33/33, bau20_safe_real 14/14, spore_v02 17/17). Modul 20 behält seinen `NoSporeError`-Guard
(Safe-spezifische Meldung). **Real verhaltensneutral** (Identitäten haben immer eine Spore) — es ist eine
Ehrlichkeits-/Korrektheits-Härtung. **Folge-Schritt:** netzweiter Byte-Re-Sync von Modul 02 in die Apps
(Kern-Modul; nur additiver Guard).

**B2 — Modul-20-Feinpunkte (Klaus: „so lassen", rein dokumentarisch):** (1) Ed25519 `extractable:true`
bleibt — nötig, damit Backup/Safe/Identitäts-Umzug den privaten Schlüssel sichern können; at-rest immer
passwort-verschlüsselt. (2) Shamir 2-von-3-Default im Modal fest; `init({shamirN,shamirK})` app-weit
konfigurierbar, keine Pro-Nutzer-N/k-UI. Kein Code-Eingriff — festgehalten in der Modul-20-Karte § B2.

_Nächster Punkt der Liste: B7 (Pinnwand-Krypto-Entscheid) → B4 (Widget-Tresor, sicherheits-sensibel) → B6
(Grad C sealed box, später). Offen aus B3: Browser-Sichttest je Knoten + optionale Verschlüsselung des
Haupt-App-KI-Schlüssels; aus B1b: netzweiter Modul-02-Re-Sync._

## 2026-07-17 · B3 ERLEDIGT — Modul-20-Safe netzweit verteilt (9 Knoten + Sage-Page)

**Rolle:** Bausitzung (Semantik/Krypto-Checkliste, Strang B). **Freibrief gilt** (CLAUDE.md § Freibrief).

**Klaus-Entscheid vorweg (statt „BLP zuerst"):** Kanon-Stack-Endknoten zuerst; BLP separat, weil
BLP eine **eigene, reife Krypto** (`src/core/vault.js`/`shamir.js`/`crypto.js`) + nur eine minimale
SBKIM-Fassung (`src/sbkim/*`, kein Modul 01/02) hat — Sages Modul 20 hängt an Modul 01/02, wäre in
BLP byte-1:1 unmöglich und redundant. **Umfang:** Safe + verschlüsselte BYOK-KI-Schlüssel-Ablage.

**Befund beim Verteilen (ehrlich):** die verschlüsselte KI-Richter-Schlüssel-Ablage (🔒 im Tresor
merken / 🔓 entsperren, Modul 23 UI) lag in den Endknoten über `23_rendezvous_ui.js` **byte-1:1 zum
Kanon schon** vor; `window.SbkimSafe` entsteht beim Laden (Geheimnis-Pfad braucht kein `createVault`).
Der **einzige** Defekt war das **je eine Version alte Modul 20** (fehlende B1-`NoSporeError`-Härtung
im Identitäts-Vault-Pfad). „Verteilung" = Modul 20 auf Kanon heilen + `SbkimSafe.init()` in die
Init-Kette + SW-Cache-Bump + echter Headless-Smoke (WebCrypto: putSecret/getSecret Round-trip,
falsches PW → null, kein Klartext im Blob, frisches Salt/IV, Heal-Beweis).

**Getan (je eigener PR, selbst gemergt nach Headless grün — Freibrief):**
**Geheilt (stale Modul 20 → Kanon), je Smoke 11/11:**
- **Rezeptbuch #332** (`sbkim/20`→Kanon, `SbkimSafe.init()` in `sbkim-init.js`, `app-sw.js` mrz-v52→v53;
  QC unangetastet → kein `build.py`) · **Mixarium #145** (`app-sw.js` mixarium-sw-v71→v72; md5 index==QC identisch)
  · **family-project #88** (sw family-projekt-v50→v51; init lag schon vor; smoke_all 94/100 = pre-existing) ·
  **Tomys-Hub #113** (sw tomy-hub-v24→v25) · **Kimboard #30** (`modules/20`, sw kimboard-v22→v23) ·
  **Kimseek #34** (sw kimseek-v26→v27) · **SB-KIMTool-Point #129** (`web/tools/sbkim-safe.js`; kein SW-Bump —
  Hub ohne SW; npm test 114/2 = 2 pre-existing).

**Ergänzt (Modul 20 fehlte GANZ — additiv + fail-soft, Spiegel + eigener Daten-Tresor unberührt):**
- **Mein-Tresor #65** (`sbkim/20` neu + Script-Tag; npm test 53/53) · **Jasons-Tresor #123** (dito; npm test 59/59).

**Sage-Page selbst:** lädt den Kanon-Modul 20 (`src/modules/20…`, immer aktuell) + KI-Richter-UI schon →
**keine Änderung nötig** (init an der Hub-Seite wäre Hub-Risiko, für den Geheimnis-Pfad nicht nötig).

**Grenzen/bewusst NICHT:** Kern 01/02 nur genutzt; `PROVIDER_MIN_MATCH`/0.80-Riegel + `DB_VERSION` +
`PROTOCOL_VERSION` unberührt; kein PII, kein Klartext-Schlüssel. Der **Haupt-App-KI-Schlüssel**
(Rezeptbuch `claudeKey9m`, Mixarium `mxkey9m`) liegt weiter im **Klartext-`localStorage`**
(persistiert schon über Hard-Reload) — dessen optionale Verschlüsselung ist ein **separater, größerer
Härtungs-Schritt** (App liest ihn an vielen Stellen; bräuchte Passwort pro Sitzung), Klaus-Entscheid offen.

**Kern-Befund (ehrlich):** die verschlüsselte KI-Richter-Schlüssel-Ablage (🔒/🔓) lag über das
byte-Kanon-`23_rendezvous_ui.js` in fast allen Knoten **schon** verdrahtet; das Safe-Modul (20) war nur
je eine Version alt (fehlende B1-`NoSporeError`-Härtung) ODER fehlte bei den Tresoren ganz. B3 = auf
Kanon bringen/ergänzen, nicht neu bauen.

**Offen (Folgepunkte, kein Blocker):**
- **Browser-Sichttest** (Live-🔒/🔓 mit echtem KI-Schlüssel) je Knoten wartet auf Klaus.
- **BLP separat** (app-eigener Tresor `core/vault.js`/`shamir.js` — kein Modul-20-Ziel).
- **Haupt-App-KI-Schlüssel** (Rezeptbuch `claudeKey9m`, Mixarium `mxkey9m`) liegt weiter im
  Klartext-`localStorage` (persistiert schon) — optionale Verschlüsselung = eigener, größerer
  Härtungs-Schritt (App liest ihn an vielen Stellen; bräuchte Passwort pro Sitzung), Klaus-Entscheid offen.

## 2026-07-17 · B1-Sichttest fing echten Safe-Bug — reproduziert + behoben (Modul 20 + echter Smoke)

**Rolle:** Sichttest-Begleitung + Bug-Fix (Freibrief). **Genau der Wert des Browser-Sichttests:** Klaus' B1-Lauf
an Panel 20 fand einen Bug, den der Mock-Smoke (19/19) NICHT sah.

**Bug:** `SbkimSafe.createVault` gelang, aber `unlock` mit **korrektem** Passwort gab `false` (Knopf 4 rot;
Shamir/Recovery/falsch-Passwort korrekt grün). **Ursache (reproduziert mit fake-indexeddb + realen Modulen):**
`SbkimSpore.exportBackup` sichert eine Identität **ohne Spore**, aber `importBackup` **verlangt** je Identität eine
Spore (`BackupSchemaError: identities[0].spore fehlt`) — ein Safe, der sich anlegen, aber nie entsperren lässt. Die
Panel-20-Test-Brücke erzeugte nie eine Spore; echte Apps tun es (Andock-Wizard) → im Feld unauffällig, aber ein
**Fremdnutzer-Footgun**.

**Warum der Mock-Smoke blind war:** `smoke_bau20_safe.mjs` **mockt** `exportBackup`/`importBackup` + Storage → die
reale Krypto+Storage-Runde lief nie.

**Fix (diese Sitzung):**
1. **Modul 20 `createVault`**: wirft bei fehlender Spore einen klaren **`NoSporeError`** (Fremdnutzer-Schutz statt
   stillem unlock-Fehlschlag). Fail-soft: greift nur, wenn Modul 02 `getOwnSpore` anbietet (reine `putSecret`-Nutzung
   unberührt — Smoke 18/18). Kern-Module 01/02 **nicht** angefasst.
2. **Test-Brücke** Panel 20 „Setup" erzeugt eine Spore wie eine echte App (idempotent).
3. **Neuer echter Smoke** `tests/smoke_bau20_safe_real.mjs` **14/14** — fake-indexeddb + reale Module 01/02/20,
   deckt beide Pfade (ohne Spore → NoSporeError; mit Spore → createVault→lock→unlock(korrekt)=true / (falsch)=false /
   recover). Aufruf: `npm install --no-save fake-indexeddb && node tests/smoke_bau20_safe_real.mjs`.

**Kern-Asymmetrie als B1b (Klaus-Entscheid) notiert:** die saubere Lösung (export verlangt Spore ODER import
toleriert sie fehlend) liegt in **Modul 02 (Kern, TABU „nur nutzen")** — Richtungsentscheid vor einem Kern-Eingriff.

**Beweis:** neuer Smoke 14/14 · Mock-Smoke 19/19 (Guard übersprungen, da Mock kein `getOwnSpore`) · putSecret 18/18 ·
`node --check` grün. **✅ Klaus-Re-Sichttest Panel 20 GRÜN (2026-07-17):** Reset → Safe anlegen (3 Anteile,
`entsperrt:true`) → „Entsperren (richtiges Passwort)" = **entsperrt** (Statusfeld grün). **B1 damit erledigt.**
Nächster Schritt: **B3** (Modul-20-Safe netzweit verteilen, BookLedgerPro zuerst).

## 2026-07-17 · A3 abgeschlossen — netzweiter Rollout der Identitäts-Härtung verifiziert (kein Bau nötig)

**Rolle:** Verifikation + Doku-Abschluss (Freibrief; Klaus: „baue A3, dann sind wir fertig").

**Befund (gegen `origin/main` geprüft, nicht behauptet):** A3 war im PLAN noch `[~]` (Rollout „offen"),
ist aber faktisch **schon netzweit ausgerollt**. Der volle Fix — Modul 01 `migrateIdentityFrom` + Modul 23
ruft ihn in `repairAndReconnect`/`ensureIdentity` (mit `hasMigrate`-Fähigkeitsprüfung) — liegt deployt auf
`main` bei **allen 13 modularen Knoten**: Mein-Mixarium · Mein-Rezeptbuch · Tomys-Hub · family-project ·
Kim-Bell (`modules/sbkim-*.js`) · Kimboard · Kimseek · SB-KIMTool-Point (`web/tools/sbkim-*.js`) ·
Mein-Tresor · Jasons-Tresor · Company-Brain · Privat-Brain (+ Sage-Kanon).
- **BookLedgerPro** trägt eine **eigene, selbst-isolierte** SBKIM-Fassung (`src/sbkim/*`, `DB_SUFFIX='bookledgerpro'`),
  nutzt den geteilten `sbkim`-Topf NIE → Migration N/A (kein Loch).
- **odysseus** ist kein SBKIM-Knoten (eigenes `static/js/storage.js`).

**Ziel im Feld bestätigt:** Klaus' Mycel-Analyse 2026-07-16 (Nacht) zeigt pro Knoten eine **eigene, stabile,
verschiedene nodeId** (Sage `nysOZE3V…` · Jasons `fnzoLJMX…` · Mein-Tresor `wS7oxsky…` · Tomys/Kim-Bell live) —
genau das A3-Ziel „jede App EINE eigene stabile ID". Ein dedizierter A3-Browser-Sichttest ist damit praktisch
erbracht; formal optional.

**Ergebnis:** A3 als **erledigt (2026-07-17)** markiert (PLAN + Checkliste + Reihenfolge). **Kein Code gebaut** —
ehrlich: es gab nichts zu bauen, der Rollout war schon vollständig. Semantik-Strang A ist damit im Kern fertig;
offen bleibt nur die A10-Welle (Klaus' Schlüssel). Nächster Schritt: **B1** (Safe-Sichttest, Klaus) → **B3**.

## 2026-07-17 · A19 — UX-Fix Such-Widget: „✓ kopiert"-Rückmeldung + App-Suche-ohne-Netz geprüft

**Rolle:** Bau (Freibrief, Klaus wählte A19). Modul 22 (Such-Widget) + Byte-Kopie such-tool.

**Befund 1 — „Block kopieren" ohne sichtbare Rückmeldung → gebaut:** der Knopf setzte zwar schon einen Hint,
der wurde aber übersehen (Klaus: „ein Link ohne sichtbares Ergebnis"). Jetzt zeigt der Knopf beim Klick kurz
**„✓ kopiert!"** (grün, ~1,6 s) direkt an der Klickstelle; dieselbe Rückmeldung am „📋 Frage kopieren"-Knopf.
Fail-soft (`global.setTimeout`-guard), keine neue CSS-Klasse (inline).

**Befund 2 — „Treffer erst nach Netz-Anmeldung" → geprüft, KEIN Bug:** die **App-Suche ist rein lokal**
(`window.SAGE_SUCHKORPUS`, lazy via Modul 03) und läuft ohne Verbindung; sie zeigt beim ersten Gebrauch schon
den Hinweis „Suchindex wird vorbereitet …" (`ensureCorpusPrepared`). Nur der **Knoten-Bereich holt LIVE-Treffer**
übers Relais (`queryNode`, Modul 05) — verbindungs-pflichtig by design (Empfangsmodus). Klaus' Beobachtung
bezog sich auf diese (korrekt) verbindungs-pflichtigen Live-Knoten-Treffer.

**Beweis:** `smoke_bau22_such_widget.mjs` **260/260**, Standalone-Drift-Guard **49/49**, byte-identisch (md5 gleich),
`node --check` grün. **Browser-Sichttest der Kopier-Rückmeldung wartet auf Klaus.**

## 2026-07-17 · Klaus-Sichttest A7–A9 grün + Test-Seiten-Fix (Panel-Knöpfe) + zwei UX-Befunde

**Rolle:** Sichttest-Begleitung + kleiner Fix (Freibrief).

**A7–A9 (Klaus, Live am Tablet, Sage-Suchfeld):**
- **A7 ✅ grün** — „wie schütze ich mich vor fremden Zugriffen" → nach Bedeutung sortierte Treffer mit
  Prozent, Schutz-Module oben (Membran 88 % · Rate-Limit 84 % · Schlüssel-Safe 84 %) + echte **KNOTEN**-
  Treffer (Mein-Tresor 82 % · Jasons-Tresor 81 % · BookLedgerPro 81 % · Kimboard/Kim-Bell/Kimseek). App-
  Hybrid+Multi-Query läuft sichtbar.
- **A8 + A9 abgehakt (Klaus' Zuruf)** — Umschalter „🧬 verwandt (genau)" + KI-Richter-Feld sind live vorhanden;
  ehrlich vermerkt: der Umschalt-/KI-Effekt wurde im Bild nicht eigens umgelegt (Logik headless bewiesen,
  `smoke_bau22e` 45/45). In PLAN + `checkliste_semantik_krypto.html` abgehakt (2026-07-17).

**Test-Seiten-Fix (`tests/manual_check.html`, PR #665 gemergt):** Befund aus Klaus' Sichttest — Panel 24 + 25
zeigten **keine Knöpfe**. Ursache: beide registrieren ihre Knöpfe via `SbkimUI.addButton` **bevor** `window.SbkimUI`
definiert war → ReferenceError. `SbkimUI`-Helfer vor Panel 24 verschoben (einmalig). Latenter Panel-24-Bug
(nie browser-getestet) mitbehoben. Nach Cache-Bust (06:53) erscheinen die Knöpfe bei Panel 24 **und** 25 —
Fix browser-bestätigt. **✅ B5-Browser-Sichttest Panel 25 GRÜN (Klaus 2026-07-17):** Round-trip live korrekt
(„Max Mustermann" → `[[KUNDE_1]]`, EMAIL/IBAN als Token, **Betrag 100 EUR bleibt**, `rehydrate == Original`,
Anker-Tresor sauber getrennt). B5 ist damit headless **und** im Browser bewiesen.

**Zwei UX-Befunde (Fremdnutzer-Brille, als A19 im PLAN notiert):**
1. **„🖨 Block kopieren" ohne sichtbare Rückmeldung** (Klaus: „ein Link ohne sichtbares Ergebnis") → kurze
   Bestätigung „✓ kopiert" einbauen.
2. **Treffer erst nach Netz-Anmeldung sichtbar** (Klaus: „erst nachdem ich alle im Netz angemeldet habe, konnte
   ich was sehen") → prüfen, ob **App-Treffer** (lokaler Korpus) auch ohne Verbindung erscheinen. Beides berührt
   Modul 22 + byte-Kopien (Drift-Guard) → eigener abgegrenzter Bau (A19).

**Nächster Schritt:** A19-Fix (kleiner Modul-22-Bau) oder B-Strang (B3 Modul-20-Verteilung) — Klaus' Wahl.

## 2026-07-16 · B5 — E2E Grad B Pseudonymisierung gebaut (Modul 25 `SbkimPseudonym`)

**Rolle:** Bau-Sitzung (Freibrief; Klaus wählte per AskUserQuestion „B5 zuerst", Sage-Page-Wizard-Umstellung A18-Rest bewusst später/inline).

**Was getan:** B5 aus `docs/PLAN_SEMANTIK_KRYPTO.md` gebaut — der „empfohlene Sofortweg"
für Vertraulichkeit (`docs/E2E-VERTRAULICHKEIT.md §1.1`) als neues **Modul 25
`SbkimPseudonym`** (`src/modules/25_pseudonym.js`).
- **Reiner Text-/Objekt-Transform, BUILD-FREI:** keine Krypto-Primitive, **KEIN
  Spore-Feld, `protocolVersion` bleibt 0.1**, **kein Draht-Vertrag** → INTERFACES
  unberührt (die Spec §1.1 ist die Vorgabe). Briefkasten bleibt lesbar/auditierbar,
  Ed25519-Signatur prüfbar.
- `pseudonymize(text, options)` / `pseudonymizeObject(obj, options)` ersetzen sensible
  Werte durch **lesbare, stabile Token** (`[[KUNDE_1]]`, `[[IBAN_1]]`, `[[EMAIL_1]]`):
  explizite Werte (Namen) + eingebaut EMAIL/IBAN (TEL opt-in) + `customPatterns`;
  gleicher Wert → gleiches Token (stabil über `options.map`), bestehende Token nie
  verschachtelt. `rehydrate`/`rehydrateObject` kehren um; `serializeVault`/`parseVault`
  für den **separaten/menschlichen Anker-Tresor-Handover** (verlässt den öffentlichen
  Kanal NIE). Anker-Tresor at-rest optional über Modul 20 `putSecret` (entkoppelt).
- Konsequent **fail-soft** (kein Throw außer `InvalidPseudonymArgError`). **Kein PII im Code.**
- Karte `docs/components/25_pseudonym.md`, Panel 25 in `tests/manual_check.html`,
  E2E-Spec §1.1 mit Umsetzungs-Notiz, status.json + Pie (26→27 Module, Code-Stub 9→10) +
  CLAUDE.md-Modultabelle nachgezogen.

**Beweis:** Headless-Smoke `tests/smoke_bau25_pseudonym.mjs` **36/36 grün**
(Round-trip Namen/EMAIL/IBAN, stabile/aufsteigende Token, Objekt-Transform mit Zahl-Erhalt,
Vault-Round-trip, fail-soft, Invarianten `protocolVersion 0.1`). `node --check` grün.

**Ehrliche Grenze:** Pseudonymisierung ≠ Verschlüsselung — Metadaten/Beträge leaken
weiter → echte Zielform bleibt **Grad C = B6** (versiegelter Umschlag, Protokoll-Sprung).

**Manual-Check:** Panel 25 in `tests/manual_check.html` **ungeprüft, wartet auf Klaus'
Browser-Lauf** (headless ist grün; die Modul-Logik ist bewiesen, die Panel-Optik nicht).

**Nächster sinnvoller Schritt:** siehe „Vorgeschlagene nächste Schritte" im Chat —
schnelle Tablet-Haken (A7–A9, B1), die A10-v0.2-Welle (Klaus' Schlüssel), oder A3-Rollout.
B3 (Modul-20-Verteilung, BLP zuerst) wäre der natürliche B-Strang-Anschluss.

## 2026-07-16 · A18 Siegel-Wizard — per-Slot-nodeId zurückportiert + family-project + NETZWEIT ABGESCHLOSSEN

**Rolle:** Bau/Rollout (Freibrief). **Klaus-Sichttest der 4 Kanon-Endknoten GRÜN** (Wizard vor Siegel, ✍, 🛡).
**Erledigt (je eigener PR, selbst-gemergt):**
- **per-Slot-nodeId in den Kanon** (Point-Muster): `refreshWizardIdentities` löst je Slot die nodeId read-only via
  idempotentem `getOrCreateIdentity` auf (`Fach · nodeId`, volle nodeId im Hover). Kanon PR #660 → byte-1:1 in
  Kim-Bell #26 · Mixarium #144 · Tomys #112 · Rezeptbuch #331.
- **family-project** (PR #87): Kanon-Wizard **additiv** ergänzt (hatte keinen; Rendezvous-Panel + `__fpErzeugeSpore`
  unangetastet), `sicherheit.html` + SW-Bump.
**Netzweiter Befund (Siegel-Wizard, 2026-07-16) — ABGESCHLOSSEN:** Geteilter Kanon = Sage · Kim-Bell · Mixarium ·
Rezeptbuch · Tomys · family-project. Eigene, spec-konforme (fertige) Umsetzungen, **bewusst NICHT angefasst:**
SB-KIMTool-Point (voraus) · Kimboard/Kimseek (eigene 352-Z.-Fassung) · **Mein-Tresor + Jasons-Tresor** (Siegel-Dialog
im index + voller Wizard auf `werkzeuge/andock.html`, `npm test` 53/53 — Kanon wäre nur Dopplung). BLP bewusst gelassen.
**Einzig offen:** Sage-Page selbst auf `siegel-inhalt.js` umstellen (Hub-Risiko, Klaus' Sage-Browser-Test). Details:
`docs/PLAN_SEMANTIK_KRYPTO.md` A18.

## 2026-07-16 · A18 Siegel-Wizard-Rollout — Tomys-Hub + Mein-Rezeptbuch auf den Kanon

**Rolle:** Bau/Rollout (Freibrief). Fortsetzung der A18-Welle (Kanon `assets/siegel-inhalt.js`).
**Erledigt (je eigener PR, selbst-gemergt nach headless grün + Drift-Guard):**
- **Tomys-Hub** (PR #111): alte Selbst-Injektion aus `sbkim/sbkim-init.js` entfernt, `sbkim/siegel-inhalt.js`
  byte-1:1 (nur `WIZ`), `__tomyErzeugeSpore` erhalten (Modul 23), `sicherheit.html` ergänzt (aus Kim-Bell re-geskinnt),
  SW `tomy-hub-v22→v23`.
- **Mein-Rezeptbuch** (PR #330): alte `SIEGEL-NEUGESTALTUNG`-IIFE entfernt, Kanon-Datei byte-1:1, `__sbkimErzeugeSpore`
  **inkl. Inhalts-Vektor-Logik** erhalten, QC-Quelle + `build.py` (index.html neu), SW `mrz-v50→v51`.

Damit stehen **alle 4 klassischen Endknoten** (Kim-Bell · Mixarium · Tomys · Rezeptbuch) auf dem einheitlichen Wizard.
**Bewusst NICHT autonom angeglichen (Freibrief-Grenze — architektonisch tiefgreifend, erst Klaus):** **BLP**
(10 000+-Zeilen inline-`mycelknoten.html`, kein geteiltes Siegel-Modal), **SB-KIMTool-Point** (schon voraus:
per-Slot-nodeId-Wechsler, Rückportierung Point→Kanon statt Downgrade), **family-project** (Rendezvous-Ursprung, eigenes
Muster). Details + Entscheid siehe `docs/PLAN_SEMANTIK_KRYPTO.md` A18. **Alle Sichttests: ungeprüft, wartet auf Klaus.**

## 2026-07-14 · A10-Nachzug: SB-KIMTool-Point als 2. v0.2-Knoten fertig (Doku-Sync von der Toolpoint-Sitzung)

**Rolle:** Cross-Repo-Status-Sync (aus der SB-KIMTool-Point-Sitzung heraus). Nur `docs/PLAN_SEMANTIK_KRYPTO.md`
+ `docs/checkliste_semantik_krypto.html` (A10 „Offen bleibt"-Zeile + Footer + Stand-Datum). **Kein Code.**

- **SB-KIMTool-Point (2. Hub) ist der ZWEITE v0.2-Knoten im Netz** (nach Sage). Kanon-Identität `CyunQNDR…`
  per neuem Browser-Knopf **„Kanon-Schlüssel importieren"** (node_key.enc.json → Modul-02-`importBackup`,
  kein Netz-Churn) zurückgeholt + verbunden (Mycel-Karte bestätigt); Spore v0.2 mit voller Beschreibung, 3
  Satz-Schnipsel, `node --test` 120/120.
- **Herkunfts-Prüfung (Klaus' Frage „war Sage die Vorlage?"):** JA für den A10-Kern — Toolpoints
  `web/tools/sbkim-spore.js` (02) und `sbkim-embedding.js` (03) sind **byte-1:1 mit Sages** `src/modules/02+03`
  (`diff -q` identisch); der ✍-„Spore neu signieren"-Knopf folgt Sages `sageReSignWithDescription`. **Toolpoint-
  ORIGINAL** ist nur der **„Kanon-Schlüssel importieren"-Knopf** (node_key.enc.json → Browser-Backup → importBackup) —
  den hat Sage NICHT (Sage rettete seine Identität über eine Backup-Datei/Schritt 4). Kandidat, um bei Bedarf als
  Vorlage zu Knoten mit gleicher node_key-Lage zurückzufließen.
- **Ehrliche Match-Neueinstufung bei Toolpoint:** reiche Beschreibung → Infrastruktur-Nähe (Sage 0.862 / Tresore
  0.862 / family 0.849 ↑), Inhalts-Knoten trennen sich (Rezeptbuch 0.796 · Mixarium 0.767 < 0.80 → verified-spore).
  Toolpoints SIGNAL seq 34 bittet Rezeptbuch/Mixarium um reziproke Neu-Einstufung.
- **Offen:** Endknoten-Rollout v0.2 (Mixarium/Rezeptbuch/BLP) + reziproke Neu-Einstufung — je Folge-Sitzung/Repo.

## 2026-07-14 · Welle Spore v0.2 — Sages Live-Spore neu signiert (ERSTE v0.2-Spore im Netz) + Identität aus Backup gerettet

**Rolle:** Operator-Begleitung (Klaus am Browser) + Verifikation/Commit (Freibrief). **Ereignis:**
Klaus hat Sages Spore über den Siegel-Knopf „✍ Semantik → Spore neu signieren" live auf **v0.2**
gehoben. Diese Sitzung hat die Datei verifiziert und committet.

**Verlauf (bemerkenswert — ehrlicher Netz-/Hub-Test):**
- Klaus hatte zuvor **alle Browser-Daten gelöscht** und dabei befürchtet, Sages Identität sei weg.
- Beim Backup-Zurückspielen (🔑-Wizard Schritt 4) meldete der Browser „Identität mit diesem Schlüssel
  existiert bereits" → **die Identität hatte überlebt bzw. wurde aus dem verschlüsselten Backup vom
  2026-05-21 sauber wiederhergestellt**. Der Backup-Weg (AES-GCM-256/PBKDF2) ist damit **live bewiesen**.
- Danach v0.2-Neu-Signatur: **nodeId `nysOZE3V…` unverändert**, 11 Satz-Schnipsel, domainVector L2=1.

**Verifikation dieser Sitzung (Beweis):** hochgeladene `spore.json` reziprok geprüft — protocolVersion
**0.2** ✓, id == base64url(SHA256(rawPub)) ✓, id == committet ✓, publicKey identisch ✓, **Ed25519-Signatur
gültig** ✓, domainVector L2=1.000000 ✓, **11/11 snippetVectors je 384-dim** ✓, kein PII. Committet nach
`sbkim/spore.json`; `status.json` (top `protocolVersion` 0.1→0.2, Sage-Eintrag `reSignedAt`+Note),
`NETZ-STAND.md` (Sages Live-Spore jetzt v0.2 = erste im Netz) + SIGNAL seq 45→46 nachgezogen.

**Peer-Quer-Check (2026-07-14):** committete vs. live veröffentlichte nodeIds — **8/10 stimmen** live
überein (Rezeptbuch, Mixarium, Jasons-Tresor, Mein-Tresor, SB-KIMTool-Point, Family, Kimseek, Kimboard);
BookLedgerPro + Kim-Bell von hier nicht abrufbar (kein Beweis für Abweichung). Netz konsistent.

**Was BLEIBT:** übrige Live-Sporen noch 0.1 (kompatibel) → optionaler Neu-Signatur-Knopf pro Endknoten
(Folge-Sitzung/Repo); Verwandt-Anzeige aus Schnipseln (Consumer 04/22/23), sobald ≥ 2 Knoten v0.2 tragen
— jetzt trägt **einer** (Sage); Tablet-Sichttests A7·A8·A9·B1.

## 2026-07-14 · Welle Spore v0.2 (Rollout-Teil) — Werkzeug verifiziert + App-Knopf emittiert jetzt Schnipsel

**Rolle:** Rollout/Test (Freibrief). **Auftrag:** Brief `BRIEF Welle Spore v0.2` (Operator + Rollout +
Sichttests A7·A8·A9·B1). **Leitplanken gewahrt:** kein privater Schlüssel im Repo, kein PII, 0.80-Riegel
unberührt, headless = Beweis.

**Was getan:**
- **Re-Sign-Werkzeug end-to-end verifiziert:** `tests/smoke_resign_spore_v02.mjs` **10/10 grün**
  (nach `npm install --no-save fake-indexeddb`, wie der Test-Kopf verlangt). Beweist: JWK-Schlüssel +
  Schnipsel → gültige v0.2-Spore (protocolVersion 0.2, echter domainVector 384 erhalten, snippetVectors
  angehängt, id/Identität stabil, echter Modul-02-Verifizierer ✔ VALID) **und** reziproke Sicherheit
  (falscher Schlüssel → Abbruch exit 3, ohne Schlüssel → Abbruch exit 2). Klaus' Operator-Schritt ist
  damit ein sauberer Ein-Klick/Ein-Befehl — de-riskt.
- **App-Knopf „✍ Semantik → Spore neu signieren" (Sage-Page `index.html`) auf v0.2 vervollständigt:**
  `sageReSignWithDescription` bettet die Beschreibung jetzt zusätzlich **satz-weise** ein
  (`SbkimEmbedding.embedSnippets`) und reicht `snippetVectors` an `generateOwnSpore` → der im Browser
  erzeugte Download ist eine **vollständige v0.2-Spore mit Schnipseln** in EINER Aktion (besser als der
  Zwei-Schritt-Operator-Pfad embed_helper + Node-Skript). **Fail-soft:** schlägt das Schnipsel-Einbetten
  fehl, wird ohne Schnipsel weiter signiert (v0.2 bleibt). Erfolgs-Meldung nennt jetzt Protokoll-Version
  + Schnipsel-Zahl. **REINE Anzeige/Verwandt-Messung — gatet nichts, 0.80-Riegel unberührt,
  Kern-Module 02/03 nur über ihre öffentliche Fläche genutzt.**
- **Smokes grün (Beweis):** `smoke_bau03_snippets` 32/32, `smoke_bau02_spore_v02` 17/17,
  `smoke_resign_spore_v02` 10/10.

**Was BLEIBT (blockiert — nicht headless machbar):**
- **Sages Live-`spore.json` auf v0.2 neu signieren** braucht den **privaten Schlüssel** (nur bei Klaus:
  App-Knopf im Browser mit lebender Identität ODER `SBKIM_NODE_KEY` + `tools/resign_spore_v02.mjs`).
  Der committete Stand bleibt bis dahin **0.1 — handshake-kompatibel**, nichts ist kaputt.
- **Endknoten-Rollout des App-Knopfs** (je eigene Folge-Sitzung/Repo, wie Modul-23-Rollout).
- **Peer-Quittungen** (kommen, wenn Knoten neu signieren) → `ack` + NETZ-STAND/status nachziehen.
- **Sichttests A7·A8·A9·B1** — nur Klaus' Tablet, ungeprüft.

**Nächster sinnvoller Schritt:** Klaus signiert Sages Spore neu (App-Knopf **oder** Skript), committet die
**öffentliche** `spore.json`; danach kann die Verwandt-Anzeige aus Schnipseln (Consumer 04/22/23) als
eigener Folge-Bau gemessen werden, sobald ≥ 2 Knoten v0.2-Sporen tragen.

## 2026-07-14 · Bau-Sitzung Spore v0.2 — `embedSnippets` (A10) + Code-`PROTOCOL_VERSION` 0.2 (A6) + Re-Sign-Werkzeug

**Rolle:** Bau (Code nach fertiger Spec, Freibrief). **Auftrag:** Brief `BRIEF_BAU_SPORE_V02.md`
(Bau-Teil der Spec-Sitzung 2026-07-14). **Leitplanken gewahrt:** 0.80-Andock-Riegel unberührt
(Modul 05 nicht angefasst), kein PII, kein privater Schlüssel im Repo, Headless = Beweis.

**Was gebaut (Code):**
- **Modul 03** `src/modules/03_embedding.js` — neuer Helfer `embedSnippets(text|string[], opts?)`:
  Satz-Zerlegung (an `.!?…` + Zeilenumbrüchen, fail-soft), je Satz `embedPassage` → L2-Vektor,
  bis `SPORE_SNIPPET_MAX`=20 in Satz-Reihenfolge, `text` = gekürzter Quell-Satz (≤160, kein PII);
  leer → `[]`, reine Berechnung (kein Spore-Schreibvorgang). Test-Brücken `_splitIntoSentences` +
  `_prepareSnippetTexts`, `_meta.sporeSnippetMax/Granularity`.
- **Modul 02** `src/modules/02_spore.js` — `PROTOCOL_VERSION "0.1" → "0.2"` (A6-Code-Schließung);
  `generateOwnSpore` nimmt optional `snippetVectors` additiv in den kanonischen Sign-/Verify-Pfad
  (`sanitizeSnippetVectors`: harte Kürzung auf 20, `vec`-Länge≠384 → `InvalidSporeMetaError`, leer →
  Feld weg = 0.1-kompatibel). `regenerateOwnSpore` trägt Schnipsel beim Neu-Signieren mit.
  `verifyForeignSpore` bleibt major-tolerant (0.1 ↔ 0.2 gegenseitig gültig, sanfter Übergang).
- **A6-Schließung:** kein `_demo`-domainVector-Pfad (Grep-belegt); Live-Knoten tragen schon echte
  e5-Vektoren (verified-match). Der Code-Stempel wandert bei der Neu-Signatur in jede spore.json.

**Byte-Kopien / Drift-Guards** nachgezogen: `sbkim-bundle/modules/02+03`, `such-tool/modules/03`,
`pinnwand/modules/03` — alle byte-1:1, Guards grün.

**Neu-Signier-Werkzeug (beides, Klaus-Entscheid):**
- `tools/resign_spore_v02.mjs` — Termux/Node, Schlüssel aus `SBKIM_NODE_KEY` (JWK oder 32-Byte-Seed);
  übernimmt den echten domainVector, bumpt → 0.2, hängt browser-gerechnete `snippetVectors` an,
  signiert kanonisch, **self-verify mit dem echten Modul-02-Verifizierer** (✔ VALID). Bricht bei
  fremdem Schlüssel/ohne Schlüssel ab. Nur öffentliche spore.json wird geschrieben.
- `tools/embed_helper.html` — Browser-Hälfte: Abschnitt „A10 — snippetVectors" zerlegt den
  Domänen-Text satz-weise und rechnet die echten e5-Vektoren → `snippets.json` für `--snippets`.

**Headless-Beweis (grün):** `smoke_bau03_snippets.mjs` 32/32 · `smoke_bau02_spore_v02.mjs` 17/17 ·
`smoke_resign_spore_v02.mjs` 10/10. Regress-frei: `smoke_bau02y` 33/33, `smoke_a3_contextual_chunking`
20/20, `smoke_bau03_worker` 15/15, `smoke_bundle_connect` 21/21 (Drift-Guards), `smoke_standalone_such_tool`
49/49, `pinnwand/_smoke` 60/60, `smoke_bau15b_membran` 35/35, `smoke_bau19_andock_wizard` 15/15,
`smoke_bau23_rendezvous` 58/58 u.a.

**Offen / nächster Schritt:** Die **eigentliche Neu-Signatur der LIVE-Sporen** braucht den privaten
Schlüssel jedes Knotens (nur bei Klaus) — Knopf pro App bzw. `resign_spore_v02.mjs` mit `SBKIM_NODE_KEY`.
Das ist Klaus' Operator-Schritt (wie der Browser-Sichttest). Bis dahin bleiben die Live-Sporen auf 0.1
(handshake-kompatibel, sanfter Übergang). **Browser-Sichttest der Schnipsel-Anzeige wartet auf Klaus.**

---

## 2026-07-14 · Spec-Sitzung Spore v0.2 — echte Vektoren (A6) + Schnipsel-Vektoren (A10), Protokoll 0.1→0.2

**Rolle:** Spec (Spec-vor-Code, Freibrief). **Auftrag:** Brief `BRIEF Spore v0.2` (2026-07-12,
Klaus-Entscheid: A6 + A10 in EINEN Protokoll-Sprung + EINE Neu-Signier-Welle). **NUR Tafel, KEIN
Modul-Code** — der Bau folgt in der Bau-Sitzung.

**Klaus-Entscheide (AskUserQuestion 2026-07-14):** (1) Schnipsel = **Satz, max 20**; (2) Übergang
0.1→0.2 **sanft** (alte 0.1-Sporen kurz weiter tolerieren); (3) Neu-Signatur = **beides** (Knopf pro
App + Termux/Node-Skript).

**Was getan (nur `docs/INTERFACES.md` + Plan/Checkliste):**
- **§0:** `PROTOCOL_VERSION "0.1" → "0.2"`; neue Konstanten `SPORE_SNIPPET_MAX=20` +
  `SPORE_SNIPPET_GRANULARITY="sentence"`.
- **§2 Spore-JSON:** neues **optionales** Feld `snippetVectors : object[]` (`{vec:number[384], text?}`,
  bis 20, signaturpflichtig wenn vorhanden, fail-soft); § „Spore v0.2" (A6-Schließung + sanfter Übergang
  + Welle-Form); `protocolVersion`-Wert in allen vier Schema-Blöcken auf `"0.2"`.
- **§4 Versionierungs-Regeln:** Klarstellung, dass 0.1↔0.2 wechselseitig kompatibel bleiben (gleiche
  Hauptversion „0", nur optionales Feld) → sanfter Übergang ist automatisch.
- **Modul 02:** `generateOwnSpore` nimmt `meta.snippetVectors` (harte Kürzung auf Max, `vec`-Längen-Check).
- **Modul 03:** neuer Helfer `embedSnippets(text|string[], opts?)` (Satz-Zerlegung → Passage-Vektoren).
- **§10 Änderungsprotokoll:** Zeile 2026-07-14 Spore v0.2.
- **Plan + interaktive Checkliste:** A6 + A10 auf `[~]` (Spec fertig, Bau offen).

**Wichtiger Befund (ehrlich):** **A6 ist im Code faktisch schon erledigt** — kein `_demo`-domainVector-Pfad
mehr in Modul 02/03, und `status.json` führt JEDEN Live-Knoten mit echtem 384-dim-e5-Vektor (verified-match).
v0.2 macht die Erwartung nur zur Tafel. Die teure Neu-Signier-Welle wird **real von A10 (snippetVectors)**
getrieben — das ist das einzige neue Feld.

**Was offen (= Bau-Sitzung Spore v0.2, Brief `BRIEF_BAU_SPORE_V02.md`):** Modul 03 `embedSnippets` bauen +
Modul 02 Assembly/Verify v0.2 + Headless-Smoke; `PROTOCOL_VERSION` im Code 0.1→0.2; byte-gleiche App-Kopien
(Drift-Guards); Re-Sign-Automatik (Knopf pro App + `npm run`-Skript, `npm run verify` ✔); dann die EINE Welle
(alle Knoten neu signieren) + `NETZ-STAND.md`. Kein PII, privater Schlüssel NIE ins Repo; 0.80-Riegel unberührt.

**Manual-Check:** reine Doku-Änderung (kein Code) — `npm test` bleibt der bestehende grüne Baseline-Beweis
(zur Bestätigung mitlaufen lassen). Browser-Sichttest: N/A (keine UI berührt).

## 2026-07-12 · Tooltip-Texte gekürzt (Klaus: „viel zu lang, kein Modul-Kram")

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus — die Tooltips waren zu lang/technisch („Modul 21",
Cosinus-Details). „Die meisten wollen nur wissen, WOFÜR es ist; an/aus erklärt sich selbst."

**Was getan:** alle `title`-Texte in **Modul 23 UI** (23 Stück) + **Modul 22** (11 Stück) auf knappe
„wofür"-Sätze gekürzt — kein „Modul XX", keine Technik. Beispiele: „Frage einsprechen (Spracheingabe,
Modul 21)…" → **„Frage einsprechen"**; der lange KI-Richter-Absatz → **„KI bewertet die Antworten
(eigener Schlüssel)"**. Byte-Kopien `such-tool/22` + `sbkim-bundle/23_ui`. Smokes bau22 260/bau22e
45/bau22f 17/bau22g 47/bau23_ui 81, Drift 49+21 grün. **Rollout:** Modul 22 (4 Kopien) + Modul 23 UI
(10 Kopien).

## 2026-07-12 · Eigener Tooltip statt nativem `title` (Modul 23 UI) — Split-Screen-Fix

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Screenshot — im Rendezvous-Panel landete der
native Browser-Tooltip (🎤-Knopf `title`) im Split-Screen/DeX halb **hinter dem Panel**. Ursache:
native `title`-Tooltips platziert der Browser selbst; per CSS nicht steuerbar.

**Was getan (Modul 23 UI):** `adoptTips(panelEl)` beim Panel-Mount stellt alle `title` auf einen
**eigenen Tooltip** um: Text → `data-sbtip`, natives `title` entfernt, Hover/Focus → ein am
`<body>` verankerter Tooltip (`position:fixed`, z-index max, unter dem Element, in den Viewport
geklemmt). Damit kontrolliert die App die Platzierung — nie mehr hinter dem Container. DOM-only,
fail-soft. Byte-Kopie `sbkim-bundle/modules/23_ui`. Smoke bau23_ui 81/81, Drift 21/21.

**Netzweiter Rollout:** alle 10 Modul-23-UI-Kopien. **Offen:** dynamisch gesetzte Titel (Blase bei
eingehendem Andock, kurze Toggle-Meldungen) bleiben vorerst nativ — unkritisch (kurz, am Rand).
Modul 22 (Suche) könnte denselben Helfer bekommen, falls dort auch gemeldet.

## 2026-07-12 · Icon-Entwirrung + ehrlicher Leer-Hinweis + Bereich-ausblenden (Klaus' Verwechslungs-Befund II)

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Screenshots — gleiche Zeichen für verschiedene
Funktionen (📌 „Merken" vs. „Nur neu anmelden"; 🔄 Hard-Reload vs. „nochmal fragen") + „Knoten
findet nichts" (Kimseek speist keinen Korpus). Klaus' Wahl (Chat, da Frage-Dialog buggte):
🙋 statt 📣 für „neu anmelden", Rest wie vorgeschlagen.

**Was getan:**
- **Modul 23 UI (Icons):** „Nur neu anmelden" 📌→**🙋** (sich melden/winken), „offene nochmal
  fragen" 🔄→**🔁** (auch die zugehörigen Briefkasten-Hinweise). Damit bleiben 📌=Merken und
  🔄=neu laden eindeutig der Suche vorbehalten. Reine Beschriftung.
- **Modul 22 (Ehrlichkeit):** neuer `areaHasSource(id)` + `unpopulatedAreaNote()` — ein
  angehakter, aber **nicht bestückter** Bereich meldet jetzt ehrlich „Hier nicht bestückt: „App"
  hat hier keinen eigenen Inhalt / „Knoten" ist hier nicht mit dem Netz verbunden" statt stumm
  „Keine Treffer." (fail-soft, reine Anzeige).
- **Modul 22 (`areasHidden`-Option):** eine App ohne eigenen Inhalt kann einen Bereich ganz
  ausblenden (`init({areasHidden:{app:true}})`) — ausgeblendet = keine Checkbox + zwangs-aus.
- **Funktions-Audit bestätigt:** KI-Richter ist wasserdicht (Anbieter+Schlüssel+Modell erreichen
  Modul 04); App/Knoten funktionieren korrekt, **wenn** die App den Korpus liefert (Sage: ja).
- Byte-Kopien `such-tool/modules/22` + `sbkim-bundle/modules/23_ui`; Smokes bau22 260/bau22e
  45/bau22f 17/bau22g 47/bau23_ui 81, Drift 49+21 — grün.

**Kimseek (Folge, eigener PR):** „App" ausgeblendet (kein eigener Inhalt), „Knoten" live ans
gemeinsame Netz verdrahtet (queryNode via Anastomose + Knoten-Korpus aus dem Rendezvous-Raum).

**Netzweiter Rollout:** Modul 23 UI (Icons) → alle 8 Apps + Tresore; Modul 22 → such-tool +
SB-KIMTool-Point + Kimseek. **Offen:** Mein-Tresor + Jasons-Tresor (ältere 23-UI) separat.
Browser-Sichttest wartet auf Klaus.

## 2026-07-12 · Namens-Entwirrung „Netz" — Internet vs. Knotennetz (Klaus' Verwechslungs-Befund)

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Screenshot — im Such-Widget (Kimseek) hieß der
**Internet-Suchbereich „Netz"**, und das schwebende Modul-23-Panel heißt **„Mit dem Netz
verbinden"** (= Knotennetz). Zwei verschiedene Dinge, beide „Netz" → Verwechslungsgefahr.
Klaus' Entscheid (AskUserQuestion): **beide umbenennen** + Hinweistext schärfen.

**Was getan:**
- **Modul 22:** Internet-Bereichs-Checkbox „Netz" → **„Internet"**; Treffer-Badge `SOURCE_LABELS`
  „Netz" → „Internet"; „↗ Im Netz weitersuchen" → „↗ Im Internet weitersuchen". Neuer,
  nur-bei-aktivem-Internet-Bereich sichtbarer **Klartext-Hinweis** („Internet = Suche im Web,
  nicht das Knotennetz. Mit SearXNG-URL: Treffer direkt hier. Ohne: Suchmaschine im neuen Tab.").
- **Modul 23 UI:** Panel/Blase/Knopf „🌐 Mit dem Netz verbinden" → **„🌐 Mit dem Knotennetz
  verbinden"** (alle Anzeige-Stellen). Reine Beschriftung — Rendezvous-Logik unberührt.
- Byte-Kopien in-repo (`such-tool/modules/22`, `sbkim-bundle/modules/23_ui`) + Smoke
  `smoke_bau23_rendezvous_ui` an den neuen Text angepasst.

**Kimseek-Audit (Klaus: „Kimseek soll Grundlage für den family-project-Machtplatz-Suchmaschine sein"):**
Kimseek war bei **16 von 17 Modulen** byte-identisch zum Kanon — nur **Modul 04 (Richter)** hing
zurück. **Nachgezogen (PR #26 gemergt):** Bau-04.H Sicherheits-/Konsequenz-Bewertung (Richter
wägt „gefahr/unsicher/sicher" mit). Kimseek jetzt in allen 17 Modulen auf Kanon-Stand.

**Tests:** bau22 260, bau22e 45, bau22f 17, bau22g 47, bau23_ui 81, Drift `such-tool` 49 +
`sbkim-bundle` 21 — alle grün. **Netzweiter Rollout:** Modul 22 (4 Kopien) + Modul 23 UI
(10 Kopien, davon Mein-Tresor + Jasons-Tresor auf älterem Stand — separat prüfen).

**Was offen / nächster Schritt:** **Browser-Sichttest durch Klaus** (nicht ersetzbar). Modul-23-UI-
Rollout an die 10 Kopien; die 2 Tresor-Apps tragen eine ältere 23-UI-Version — dort erst prüfen,
ob byte-1:1-Kanon oder nur die Beschriftung.

## 2026-07-12 · A16 Phase B — Treffer-Bewertung (👍 sehr gut · 🙂 okay · 👎 nein) füttert den Sortierer

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Wunsch nach A16 — nicht nur „gemerkt = gut",
sondern **nach der Gegenprüfung** bewerten, *wie* gut ein Treffer war (Geist echter Lernprogramme:
Antwort holen → Seite anschauen → zurück → zufrieden?). Klaus' Design-Wahl (AskUserQuestion):
**Bewertung nach dem Seiten-Öffnen**, an genau dem geprüften Treffer, **drei Stufen**.

**Was getan (Kanon Modul 22):**
- **Bewertungs-Zeile „Hat's getroffen? 👍 sehr gut · 🙂 okay · 👎 nein"** erscheint an GENAU dem
  Treffer, dessen Seite geöffnet wurde — sowohl in der Detail-Karte (nach „↗ Seite öffnen") als
  auch an der Trefferzeile in der Liste. Sichtbar beim Zurückkommen (`visibilitychange`/`focus`).
  Schon bewertet → „Bewertet: … (ändern)".
- **Zwei neue LS-Keys** (kein PII, nur Text/Link/Note): `sbkim_search_widget_feedback`
  (key→{rating,titel,text,source}) + `_pending` (geöffnet, noch nicht bewertet).
- **Lern-Verrechnung:** `computeRerankerModel(merkliste, feedback)` verrechnet jetzt auch die
  Bewertungen — **gestuft** (`feedbackWeight`: gut +2, okay +1, **nein −2**). Modell-Gewichte
  dürfen negativ werden; der Boost ist jetzt **vorzeichen-tragend** ∈ [−1,1] (👎 → Treffer **sinkt**,
  begrenzt ≤ 3 Plätze — Nudge, kein Umbruch). `retrainReranker()` lernt aus Merkliste **und**
  Bewertungen.
- Surface `+recordFeedback/getFeedback/feedbackWeight`, `_meta.feedbackCount/pendingFeedbackCount`.
- **REINE ANZEIGE/Lern-Eingabe** — gatet nichts, 0.80-Riegel + Modul 04/05 unberührt, kein
  PROTOCOL_VERSION-Bump. Fail-soft ohne localStorage.

**Tests:** Smoke `smoke_bau22g_lern_reranker.mjs` **47/47** (jetzt inkl. Phase B: gestufte Gewichte,
negatives Signal senkt begrenzt, positiv+negativ zusammen, fail-soft). Regress-frei: bau22 260,
bau22e 45, bau22f 17. Byte-Kopie `such-tool/modules/22` gezogen, Drift-Guard **49/49**.

**Netzweiter Rollout:** Kanon Sage `src` + `such-tool` → SB-KIMTool-Point `such-tool/modules/22`
+ Kimseek `modules/22` (je SW-Bump, Kimseek Drift-SHA nachgezogen).

**Was offen / nächster Schritt:** **Browser-Sichttest durch Klaus** (nicht ersetzbar) — suchen →
Treffer öffnen → zurück → 👍/🙂/👎 → erneut suchen: gut-bewertete/ähnliche Treffer stehen höher,
👎-Treffer tiefer. Offene A16-Folgefrage (aus dem A16-Brief): soll der Lern-Boost auch die
**Knoten-Rangfolge** (A11 „🔎 Antwort holen") beeinflussen — heute nur die lokale Treffer-Liste.

## 2026-07-12 · A16 — Lernender Sortierer (display-only Re-Ranker, on-device) in Modul 22

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Wunsch (Geist der BLP-„selbstlernenden
Kalkulation", auf die SUCHE): das mitgelieferte Sortierprogramm soll mit jedem 📌-Merken
**besser** werden. Der rohe e5-small-Cosinus sortiert flach (A11-Befund: Treffer 0.81–0.83).

**Was getan (Kanon Modul 22):**
- **Neuer LS-Key** `sbkim_search_widget_reranker` (pro App/Origin) — gelerntes Modell
  `{tokens, sources, n}` aus der 📌-Merkliste. KEIN PII (nur Token/Quelle/Gewicht, wie die
  Merkliste selbst schon speichert).
- **Reine Funktionen:** `computeRerankerModel(merkliste)` (Wortzerleger auf Titel/Text →
  Token-Gewichte + Quelle-Gewichte, Stoppwörter raus) + `learnedRerank(treffer,{model?})` —
  **stabile, BEGRENZTE Umsortierung**: effektiver Sortier-Schlüssel `index − boost·3`, ein
  Volltreffer steigt höchstens 3 Plätze. Boost ∈ [0,1] aus Token-Übereinstimmung (saturierend)
  + Quelle. **Kalt-Start / leeres / kaputtes Modell → Identität** (gleiche Reihenfolge, gleiche
  Objekte). Entfernt NICHTS, fügt NICHTS hinzu.
- **Training-Hook:** `retrainReranker()` hängt an `addMerk`/`removeMerk`/`clearMerkliste` —
  das Modell lernt bei jedem Merken/Entfernen neu (fail-soft, ohne localStorage kein Bruch).
- **Angewandt in `displayTreffer`** NUR auf die grobe „verbunden"-Standardsicht; die explizite
  „verwandt"-/KI-Sortierung bleibt unberührt. **REINE ANZEIGE — gatet nichts, 0.80-Andock-
  Riegel (Modul 05) + Modul 04 unberührt, kein PROTOCOL_VERSION-Bump.**
- Surface `+learnedRerank/computeRerankerModel/trainReranker/getRerankerModel`,
  `_meta.rerankerReady/rerankerTrained/rerankerTokens`.
- **Ehrliche Grenzen:** lernt pro Gerät (nicht netzweit geteilt); nur positives Signal (📌);
  negatives „passt nicht" bewusst Phase B.2 (kostet ein UI-Element mehr — offene Frage an Klaus).

**Tests:** neuer Smoke `smoke_bau22g_lern_reranker.mjs` **33/33** (Kalt=Identität · Pin-nudged-
hoch · Nudge-kein-Umbruch/Aufstieg≤3 · fail-soft kaputte Gewichte · Quell-Signal). Regress-frei:
bau22 260/260, bau22e 45/45, bau22f 17/17. Byte-Kopie `such-tool/modules/22` gezogen, Drift-Guard
`smoke_standalone_such_tool.mjs` **49/49**.

**Netzweiter Rollout (Modul 22 lebt nur an 4 Orten, nicht in den Rezept-Apps):** Kanon Sage
`src` + `such-tool` (dieser PR) → externe Byte-Kopien **SB-KIMTool-Point** `such-tool/modules/22`
+ **Kimseek** `modules/22` (je eigener PR, SW-Cache-Bump, Kimseek Drift-Guard-SHA nachgezogen).

**Was offen / nächster Schritt:** **Browser-Sichttest durch Klaus** (nicht ersetzbar) — im
Such-Widget etwas suchen, einen Treffer 📌-merken, erneut suchen: der gemerkte/ähnliche Treffer
steht sichtbar weiter oben. Optional Phase B.2 (sichtbares „👎 passt nicht") auf Klaus' Zuruf.

## 2026-07-12 · Briefkasten entdoppeln (B) + Mikrofon/Modul 21 nachgezogen (C) — netzweit

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Tablet-Screenshots nach A17 — (1) der
Briefkasten stand voll **doppelter** Fragen (Zähler „Antworten abholen (13)"), (2) das 🎤 im
Netz-Panel meldete „Modul 21 nicht geladen — bitte tippen" (toter Knopf).

**Was getan:**
- **B — Briefkasten (Modul 23 UI, A12) entdoppeln + 🗑/↗ je Eintrag.** `recordOpenQuestion`
  fasst offene Fragen jetzt nach `(Frage-Text, Ziel-Name)` zusammen (normalisiert
  trim+lowercase) statt nach der jedes Mal neuen `qid` → aus 13 identischen wird EIN Eintrag
  mit Versuchszähler (`tries`). Der Briefkasten rendert je Gruppe eine interaktive Karte mit
  „×N · zuletzt vor …", einem **🗑-Knopf je Eintrag** (nur diese Gruppe) und — falls die
  Adresse bekannt ist — **„↗ App öffnen" je Eintrag** (endpoint beim Schreiben mit abgelegt,
  Selbst-Suche ohne Warten). Reine Anzeige/Speicher: kein PROTOCOL_VERSION-Bump, kein PII,
  Kern 02/05/05b + 0.80-Riegel unberührt. Smoke `smoke_bau23_rendezvous_ui.mjs` **81/81**;
  Drift-Guard `smoke_bundle_connect.mjs` 21/21 (byte-1:1 `sbkim-bundle`). Kanon PR #635.
- **C — Mikrofon/Modul 21 (Spracheingabe) fehlte in den Apps.** Audit ergab: **6 von 7 Apps**
  luden `21_spracheingabe.js` gar nicht (nur Kimseek hatte es). Datei byte-1:1 aus dem Kanon
  nachgezogen + `<script>`-Tag ergänzt. Jetzt startet 🎤 die Erkennung (Browser-Web-Speech)
  oder gibt ehrlich Bescheid, wenn ein EU-Schlüssel nötig ist — kein toter Knopf mehr.
- **Netzweiter Rollout (7 Apps, je eigener PR, alle gemergt):** Mixarium #127 (B+C, QC-Spiegel,
  SW v58→v59), Rezeptbuch #315 (B+C, QC + build.py, SW mrz-v43→v44), family-project #66 (B+C,
  SW v23→v24), BookLedgerPro #271 (B+C, SW v206→v207, `node tests/run.mjs` 2123/0),
  Tomys-Hub #104 (B+C, SW tomy-hub-v14→v15, smoke-workfloh 31/31), Kimboard #23 (B+C, modules/,
  Drift-Guard-SHA nachgezogen, smoke 5/5), Kimseek #23 (nur B — hatte 21 schon; Drift-Guard-SHA
  23_ui nachgezogen, smoke 4/4). Alle byte-1:1 verifiziert (23_ui md5 `156d3932…`, 21 md5
  `6912ea55…` netzweit identisch).

**Kimseek-Nebenbefund (nicht gefixt, bewusst):** in Kimseek lädt `index.html` das Modul 21
**nach** Modul 23 — funktional egal, weil `SbkimSpeech` erst zur Laufzeit im Voice-Click-Handler
aufgelöst wird (alle Skripte dann geladen). Ein Reorder wäre eine nicht-byte-1:1-Änderung ohne
Nutzen gewesen.

**Was offen / nächster sinnvoller Schritt:** **A16 Lernender Sortierer** (eigener Brief
`docs/sessions/BRIEF_A16_LERNENDER_SORTIERER.md`) — display-only Re-Ranker in Modul 22, lernt
aus der 📌-Merkliste, on-device, fail-soft. Danach optional/auf Zuruf: Modell selbst hosten
(Ladezeit/Offline, `/models/…`-Pfad in Modul 03 existiert). **Browser-Sichttest B+C wartet auf
Klaus** (läuft nach Merge auf den live-deployten Seiten — Hard-Reload nach Pull).

## 2026-07-12 · Rendezvous UI — Partner-Link „↗ App öffnen" + Diagnose „nur wer könnte antworten"

**Rolle:** Bau (Freibrief). **Klaus' Live-Befund nach A17:** friert nicht mehr ein (✅), aber
die Suche zeigt oft **nur, WER antworten könnte**, nicht die Antwort selbst; Briefkasten voll
**doppelter** Fragen. **Diagnose (ehrlich):** server-los kommt die Antwort nur, wenn der
Gegen-Tab offen+vorn+wach ist — auf einem Gerät unmöglich, wenn man selbst vorn ist → System
zeigt die Rangfolge + legt die Frage in den Briefkasten (daher Doppel).

**Gebaut + netzweit (Freibrief):** jede Raum-Karte trägt jetzt **„↗ App öffnen"** (Adresse aus
Spore-`endpoint`, neuer Tab, fail-soft ohne endpoint) → Selbst-Suche ohne Warten; die „keine
Antwort"-Meldung ist ehrlich („Knoten nicht offen/wach") + verweist auf den Link. Reine Anzeige,
Kern 02/05/05b + 0.80-Riegel unberührt. Smoke `smoke_bau23_rendezvous_ui` **73/73** (+4).
Kanon PR #632; Rollout 7/7: Mixarium #126 (SW v57→58), Rezeptbuch #314 (v42→43),
family #65 (v22→23), BLP #270 (v205→206), Tomys #103 (v13→14), Kimboard #22 (v14→15, sha),
Kimseek #22 (v11→12, sha). Der Rollout brachte auch die A17-Drosselung in die Apps mit.

**Offen (Brief `docs/sessions/BRIEF_BRIEFKASTEN_DEDUP_UND_MODUL21_MIC.md`):**
- **Briefkasten entdoppeln + Löschen je Eintrag + Partner-Link je Eintrag** (A12, Modul 23 UI).
- **Mikrofon/Modul 21:** in Mixarium (& weiteren Apps) fehlt `21_spracheingabe.js` → 🎤 meldet
  „Modul 21 nicht geladen". Datei + Script-Tag nachziehen, netzweit.
- Danach A16 (lernender Sortierer). Optional: Modell selbst hosten (Ladezeit/Offline).

## 2026-07-12 · A17 Last-Schoner — Embedding im Web-Worker (gegen Tablet-Einfrieren)

**Rolle:** Bau (Freibrief). **Auslöser:** Klaus' Tablet fror mehrfach ein / stürzte ab
bei wiederholten Cross-Knoten-Suchen mit zwei Modellen. **Ursache:** das e5-Modell rechnet
bei JEDER Suche — bisher **im Anzeige-Faden**, der dabei steht. Klaus' Ansage: die
„vernünftige" Variante, **kein Liliput** (Bauzeit ist nicht das Problem).

**Getan:**
- **Modul 03** rechnet Embeddings jetzt in einem **Inline-Blob-Web-Worker** (Hintergrund-
  Faden) statt im Haupt-Faden. Neue Innereien: `makeCfg`/`workerSource`/`ensureWorker`/
  `postToWorker`/`onWorkerMessage`/`failWorker` + `loadMainPipe` (Rückfall) + `computeVectors`
  (zentrale Rechen-Stelle, Worker zuerst). `embedSingle`/`embedBatch`/`embedContentVector`
  laufen alle darüber. `isReady()` kennt den Worker; `_workerState()`-Test-Brücke; `_meta.workerMode`.
- **Streng fail-soft:** kein Worker (Node/alter Browser/CSP) → transparenter Rückfall auf den
  Haupt-Faden = **byte-gleiche Vektoren**; Worker-Fehler mitten im Betrieb fällt sauber zurück;
  `init({worker:false})` schaltet ab. Kern-Module 02/05/05b unberührt, kein PROTOCOL_VERSION-/
  DB_VERSION-Bump, 0.80-Riegel nicht angefasst.
- **Byte-1:1** in sbkim-bundle/such-tool/pinnwand (Drift-Guards grün). Neuer Smoke
  `smoke_bau03_worker.mjs` **15/15** (Worker-Nutzung · Parität Worker==Haupt-Faden · Fail-soft ·
  Fehler-Recovery · worker:false). Regress: `smoke_a3` 20/20, `smoke_bundle_connect` 21/21,
  `smoke_standalone_such_tool` 49/49, `pinnwand/_smoke` 60/60.
- Dazu (im selben Branch, PR #630 gewachsen): die kleine **Drosselung** in Modul 23 UI
  („Antwort holen" entprellt — kein Doppel-Start, 4 s Abkühlung) als Ergänzung.

**Offen / nächster Schritt:**
- **Netzweiter Byte-Rollout** von Modul 03 in die Apps — ✅ **erledigt 2026-07-12** (7/7 gemergt,
  Subagenten): Mixarium PR #125 (SW v56→57), Rezeptbuch #313 (v41→42), family-project #64 (v21→22),
  BookLedgerPro #269 (v204→205), Tomys-Hub #102 (v12→13), Kimboard #21 (v13→14, sha-Guard),
  Kimseek #21 (v10→11, sha-Guard). Alle 7 hatten Modul 03 byte-identisch zum Vor-Worker-Kanon
  (kein Fork) → saubere Byte-Kopie.
- **Browser-Sichttest (kein Einfrieren mehr) wartet auf Klaus** — headless beweist die Logik,
  das echte Tablet-Verhalten sieht nur Klaus.
- **Selbst-Hosten des Modells** (Flaschenhals/Offline, `/models/…`-Pfad existiert schon in
  Modul 03) ist ein **separater, optionaler** Hebel — löst NICHT das Einfrieren, auf Klaus' Zuruf.
- Danach **A16** (lernender Sortierer, Brief liegt).

## 2026-07-11 · A11 Teil A (Bau 23.C) — Auto-Knoten-Auswahl + „🔎 Antwort holen"

**Rolle:** Bausitzung (Modul 23), Freibrief, Plan-Modus vorab (Plan freigegeben). Auslöser:
Klaus' Live-Test KimSeek→Mixarium — „bei 100 Knoten weiß ich nicht, wen ich frage; das soll
automatisch gehen, und der Knopf gehört unter die Frage, nicht als ❓ neben Andocken".

Neu: Modul 23 `rankCardsByQuery(cards, queryVec, {raw?})` rankt die Raum-Karten nach Passung
der getippten Frage zu jedem Knoten-`domainVector` (Modul 04 `relatedness`, zentriert; DOM-frei,
fail-soft). UI: Primärknopf **„🔎 Antwort holen"** direkt am Frage-Feld — bettet die Frage ein
(Modul 03), liest den Raum, zeigt die Karten **nach Passung sortiert** (🔎-Badge) und fragt den
**bestpassenden Knoten automatisch**; bleibt er stumm → **nächstbester** als Nachfass (sonst
A12-Briefkasten). Per-Karte-Knopf bleibt als manueller Override „❓ gezielt fragen".
**REINE Anzeige/Auswahl** — 0.80-Andock-Riegel + Kern 02/05/05b unberührt, kein PROTOCOL-Bump,
Empfangsmodus. Smokes `smoke_bau23c_rank_by_query` 15/15, `smoke_bau23_rendezvous_ui` 65/65,
Regress grün, Bundle-Drift-Guard 21/21. PR #626 gemergt.
**✅ Netzweiter Rollout ERLEDIGT 2026-07-11** (byte-gleich, je eigener PR gemergt): Mixarium #123
(SW v54→55), Rezeptbuch #311 (mrz-v39→40), family-project #62 (v19→20), BookLedgerPro #267
(v202→203, tests/run.mjs 2123 grün), Tomys-Hub #100 (v10→11), Kimboard #19 (v11→12, Drift grün),
Kimseek #19 (v8→9, Drift grün) — 7 Apps + Sage-Kanon/Bundle.
**✅✅ LIVE BEWIESEN (Klaus' Browser 2026-07-11):** KimSeek fragte „Erfrischendes ohne Alkohol"
→ „🔎 Antwort holen" wählte **automatisch** Mixarium (Frage-Passung 0.42) → Mixarium antwortete
aus seinem Buch (Melya/Tropical Sunrise Bowl/Fruit Shake/Kräuter-Nektar/Bora Bora, 32 s). Kein
Karten-Anklicken nötig. Rest-Grenze wie gehabt: e5-small-Cosinus flach (0.81–0.83) → Feinsortierung
noch grob (genau der Hebel für A16). **Offen:** **Teil B** = lernender Sortierer (Plan-Punkt A16,
Brief liegt: `docs/sessions/BRIEF_A16_LERNENDER_SORTIERER.md`); A11-Teil-B (Suchergebnis→Andocken-
Kopplung Modul 22↔23) weiter offen.

## 2026-07-11 · A4 Teil 2 (Bau 04.H) — KI-Richter wägt Sicherheit/Konsequenz mit

**Rolle:** Bausitzung (Modul 04), Freibrief. Auslöser: Klaus „ok 1." → A4 Teil 2.

Der opt-in KI-Richter (`hybridMatch`/`queryLocalJudged`) beurteilte bisher nur die
**thematische** Passung. Klaus' Referenzfall (Hund-Katze-/**Permethrin**): ein Mittel,
das thematisch perfekt zur Frage „Zecken-/Flohmittel für Hund UND Katze" passt, aber für
Katzen **giftig** ist, ranke oben — falsch. Jetzt wägt der Richter **Sicherheit + Konsequenz**:

- **Prompt** um generische Sicherheits-/Konsequenz-Anweisung erweitert (kein Stoff-Hardcode):
  thematisch nah + schädlich → `passt=false` → **herabgestuft**.
- **Neue optionale, additive Verdikt-Marke `sicherheit`** (`gefahr`/`unsicher`/`sicher`) in
  Schema, `attestation.verdicts` + `queryLocalJudged`-Kandidaten → macht die Konsequenz
  **sichtbar** (markieren).
- **Fail-soft + rückwärts-kompatibel:** fehlt/unbekannt → `null`, nie ein Grund das Urteil zu
  verwerfen (alte Richter/Kopien liefern es nicht).
- **REINE Anzeige/Urteil — gatet nichts:** `PROVIDER_MIN_MATCH` + 0.80-Andock-Riegel (Modul 05)
  unberührt. **Nur Such-Flächen**, nicht Sortier-Flächen.

Smoke `smoke_bau04h_safety_verdict.mjs` **22/22**; voller Sweep 0 echte Fehlschläge (13 Env-Skips
`fake-indexeddb`/`playwright`, vorbestehend). Byte-Kopien `such-tool/modules/04` +
`sbkim-bundle/modules/04` mitgezogen; dabei den pre-existing Drift `sbkim-bundle/modules/23_rendezvous(_ui)`
(aus A12 #620/#582 nie gesynct) byte-1:1 geheilt (Bundle-Drift-Guard wieder grün). PR #624 gemergt.
**Offen:** Browser-Sichttest mit echtem KI-Schlüssel (Klaus); UI-Anzeige des ⚠️-Markers (Modul 22) +
netzweiter Byte-Rollout des 04-Updates in die App-Repos. PLAN A4 auf `[x]` gesetzt.

## 2026-07-11 · Rendezvous-UX + A12 Briefkasten (Erreichbarkeit trotz Zeitverzögerung)

**Rolle:** Bausitzung (Modul 23 + UI), Freibrief. Auslöser: Klaus' Live-Test Tomys ↔ family.

**Was getan (alles netzweit gemergt, Klaus prüft live):**
- **Empfänger-Hinweis bei eingehendem Handshake** (Modul 23 UI): das „Mit dem Netz verbinden"-Panel
  zeigt „🤝 X hat sich mit dir verbunden", wenn ein fremder Knoten live andockt (`sbkim:handshake`
  `direction:"incoming"`). Löste Klaus' Befund „Handshake gemacht, aber Gegenseite merkt nichts".
  **✅ Browser-Sichttest GRÜN (Klaus 2026-07-11):** beidseitig sichtbar (Screenshot). Kanon-Smoke 41/41.
  Netzweit: 8 Repos.
- **A12 Briefkasten** (Klaus' Befund: Frage fällt in ein Zeitlimit, wenn der Antworter beim Fragen zu ist):
  - **Phase 1 Transport** (`23_rendezvous.js`): Antworter-**Lookback** (`enableAnswering` hört 30 min zurück
    → holt liegengebliebene Fragen beim Einschalten nach) + **`fetchAnswers`** (Frager liest späte Antworten
    nach); `askNode`-Timeout gibt `{pending:true, qid}` zurück. Smoke `smoke_bau23b_query.mjs` **28/28**.
  - **Phase 2 UI** (`23_rendezvous_ui.js`): offene Fragen gemerkt (localStorage, dbSuffix), **sichtbarer
    📬-Zähler an der Blase**, **Auto-Nachlese beim Öffnen**, Knopf „📬 Antworten abholen", Quittung offen/
    beantwortet. Smoke `smoke_bau23_rendezvous_ui.mjs` **50/50**.
  - **Phase 2b Rollout:** beide Module byte-1:1 in 7 Träger + Kim-recorded-sha (beide) + SW-Cache-Bumps.
  - **LEHRE (Klaus):** ein Briefkasten scheitert am **Lesen**, nicht am Schreiben (wie der git-Briefkasten,
    wo Briefe ungelesen liegen) — darum Lesen **sichtbar** (Zähler) + **automatisch** (beim Öffnen) gemacht,
    nicht hinter einem Knopf versteckt. Reale Grenze: **Aufbewahrungsdauer des Relais** (offener Folge-Check).

**Kern (02/05/05b + `PROVIDER_MIN_MATCH` 0.80) unberührt, reine Anzeige/Transport, fail-soft.
Browser-Sichttest des Briefkastens wartet auf Klaus (Live nach Deploy).**

---

## 2026-07-11 · A5 — Multi-Query-Rollout in die Apps (Mixarium · Rezeptbuch · family · BLP)

**Rolle:** Bausitzung A-Serie (A5). Freibrief gilt (siehe CLAUDE.md § Freibrief).

**Was getan (alle 4 PRs gemergt, Klaus prüft live):**
- **Mixarium** (PR #119, `c36f524`) + **Rezeptbuch** (PR #307, `372b837`): natives Sinn-Suchfeld `semRun`
  auf **Multi-Query** gehoben — Frage über app-eigene `SEM_SYN`-Karte auffächern (`expandQuerySimple`) →
  `queryLocalMulti` (RRF) statt reinem `queryLocal`. Hybrid war schon da. Gratis-Pfad; Richter-Pfad bleibt
  bewusst Single-Query (Modul 04 byte-frozen). Mixarium: `index.html` byte-gleich zur QC (md5). Rezeptbuch:
  QC-Quelle + `build.py`.
- **family-project** (PR #58, `cd9e733`): **Marktplatz-Suchfeld** `markt.html` (Klaus' Befund — im Erst-Mapping
  übersehen!) ist eine **Sortier-Fläche** → Multi-Query als Sortier-Verbesserung (bester Cosinus über die
  Frage-Varianten, versteckt nichts, Klaus-Entscheid). PLUS Cross-Knoten-**Antwort-Pfad** `15_membran.js`
  (`op:"query"`) → `queryWithInclusion` (A4+A1) nachgezogen. SW-Cache v15→v16.
- **BookLedgerPro** (PR #263, `886c57f`): eigene Nutzer-Suche war **schon** hybrid+synonym-fähig (kein Eingriff);
  Cross-Knoten-Antwort-Pfad `15_membran.js` nachgezogen. SW-Cache v198→v199.
- **Pinnwand:** bewusst gelassen (eigene Sortier-Suche läuft gut, Klaus-Entscheid). Offener Folgepunkt A5b.

**Verifikation:** je App eigener Headless-Smoke grün (Verdrahtungs-Guard über die ausgelieferte Synonym-Karte):
Mixarium `smoke_a5_suchfeld_multiquery` 8/0, Rezeptbuch 8/0, family `smoke_a5_markt_sortierung` 6/0 +
`smoke_a5_antwortpfad` 6/0, BLP `smoke_a5_antwortpfad` 6/0 + Haupt-Suite 2123/0. Kern (02/05/05b +
`PROVIDER_MIN_MATCH` 0.80) unberührt, kein PROTOCOL_VERSION-Bump. **Browser-Sichttest wartet auf Klaus (Live-Seiten).**

**Realitäts-Abgleich (Tafel-Evolutions-Klausel):** der Brief nahm 5 vergleichbare Suchfelder an — die Apps sind
heterogen (Such- vs. Sortier-Flächen, teils kein Suchfeld, teils eigener Such-Stack). Detail + A5b in
`docs/PLAN_SEMANTIK_KRYPTO.md`.

---

## 2026-07-11 · Schlüssel-Tresor: KI-Richter-Schlüssel verschlüsselt merken + Vergessen-Schutz, netzweit

**Rolle:** Bausitzung (Modul 20 + Netz-Panel + netzweiter Rollout + neuer Skill).

**Was getan:**
- **Modul 20 (Safe) kann Geheimnisse:** `putSecret/getSecret/hasSecret/removeSecret`
  (PBKDF2-SHA256 600k → AES-GCM-256, frisches Salt/IV, kein Klartext at rest,
  unabhängig vom Identitäts-Vault). Bereits als PR #612 auf `main`.
- **Vergessen-Schutz (Klaus 2026-07-11, diese Runde):** BYOK-Schlüssel ist gratis
  neu holbar (jeder Nutzer holt SEINEN selbst — kein Support/keine Last für Klaus),
  „Passwort vergessen" ist also **kein Datenverlust**. Zwei offline-taugliche
  Bausteine, KEINE E-Mail/KEIN Server/KEIN PII: (1) ehrlicher `FORGOT_HINT`,
  (2) optionale **Merkhilfe** `putSecret(...,{hint})` + `getSecretHint(name)`
  (unverschlüsselt, app-eigen via dbSuffix → kein Cross-App-Leck, NIE das Passwort;
  wird beim Entsperren in die Passwort-Frage eingeblendet). Shamir 2-von-3 bleibt
  für *wertvolle, nicht ersetzbare* Geheimnisse (nicht für gratis-KI-Schlüssel).
- **Netz-Panel (Modul 23 UI):** „🔒 im Tresor merken" / „🔓 Tresor entsperren" am
  KI-Richter, `safeMod()`-Guard (fail-soft ohne Modul 20). E-Mail-Recovery bewusst
  verworfen (bräche offline + kein-PII; würde Fremdnutzer eine E-Mail abverlangen).
- **Netzweiter Rollout** byte-1:1 in alle 9 Apps (Mixarium/Rezeptbuch/Tomys/BLP/
  family/Kimboard/Kimseek/Kim-Bell/SB-KIMTool): Modul 20 neu geladen (nach 01),
  23_ui + 16 nachgezogen; Mixarium-QC + Rezeptbuch-QC (build.py) synchron gehalten;
  Drift-sha256 in Kimboard/Kimseek/Kim-Bell aktualisiert.
- **Skill** `verschluesselter-schluessel-tresor` angelegt (Sage `.claude/skills/`) —
  Rezept fürs Merken jedes BYOK-Geheimnisses in neuen Apps (inkl. Vergessen-Schutz).

**Was getestet:** `smoke_bau20_secret.mjs` 18/18, `smoke_bau23c_ki_richter.mjs` 28/28
(echtes WebCrypto + Bedien-Verdrahtung inkl. Merkhilfe). App-Drift-Guards grün
(Kimboard 5/5, Kimseek 4/4, Kim-Bell 4/4, Rezeptbuch 6/6, BLP 2123/0, SB-KIMTool
node --test 103/103 — Probe 27 im Such-Widget-Smoke ist **vorbestehend rot auf main**,
unabhängig vom Tresor).

**✅ Browser-Sichttest GRÜN (Klaus 2026-07-11):** Tomys Hub live — KI-Richter an,
Schlüssel eingetippt, „🔒 im Tresor merken" → Bestätigung „🔒 Schlüssel verschlüsselt
im Tresor gemerkt … Passwort vergessen? Kein Drama — hol dir beim Anbieter gratis
einen neuen Schlüssel und leg ihn neu ab." sichtbar wie gebaut (Vergessen-Hinweis
live). „Alles funktioniert" (Klaus). Tresor netzweit gemergt (11 PRs auf `main`).

**Was offen / nächster Schritt:** Merkhilfe/Tresor ggf. auch an anderen BYOK-Feldern
(Suche/OCR) — bei Bedarf. Weiter mit der A-Serie (A4 Teil 2 / A5 / A6 / A7–A9) —
Brief `docs/sessions/BRIEF_A_SERIE_A4BIS_WEITER.md`.

---

## 2026-07-11 · Offline-Modell-Quelle (Modul 03) upstreamed + netzweit ausgerollt (A6-Baustein)

**Rolle:** Bausitzung (Upstream + byte-1:1-Rollout, Klaus' ausdrückliche Freigabe
„Ja, upstreamen"). Spec-vor-Code light: additiv, Default byte-gleich, Headless-Beweis.

**Was:** Das in **family-project** bewährte **Offline-first**-Feature aus dem Fork in den
**Kanon** `src/modules/03_embedding.js` gehoben (Klaus' Entscheid nach dem Drift-Audit).
Das Embedding-Modell wird vom **eigenen Server** (`<origin>/models/…`) statt HuggingFace
geladen, wenn es dort liegt — `detectModelSource()` entscheidet per **Body-Probe** (ein
SPA-Server liefert für fehlende Dateien die index.html mit 200+HTML statt 404; nur echtes
JSON `{`… gilt als `local`), konsequent **fail-soft** (jeder Fehler → `remote`).
`configureModelSource()` setzt `transformers.js env` passend. Surface `+getModelSource`/
`+_detectModelSource`, `_meta.localModelRoot`/`localModelProbe`.

**Strikt additiv:** ohne lokales Modell (Default) byte-gleiches Verhalten — gleiches Modell,
gleiche Vektoren. **Kein** Spore-Feld, **kein** PROTOCOL_VERSION-/DB_VERSION-Bump,
Match-Schwelle (04/05) unberührt.

**Beweis (headless):** neuer Smoke `tests/smoke_a6_offline_model_source.mjs` **11/11**
(fail-soft-Kette · SPA-HTML-Falle → remote · echtes JSON → local · `!res.ok`/Throw →
remote · Surface/`_meta`). Regressionsfrei: `smoke_a3_contextual_chunking`,
`smoke_bundle_connect`, `smoke_standalone_such_tool`, `pinnwand/_smoke` 60/60.
(`smoke_inhaltstreuer_domainvektor` ist unabhängig rot — fehlendes npm-Paket
`fake-indexeddb`, schon auf main, nicht diese Sitzung.)

**Kanon-Merge:** Sage PR #604 (src + sbkim-bundle + such-tool + pinnwand byte-1:1,
Drift-Guards grün). **Neuer Kanon-03 = `36e87c26` (sha256 `60d6f516`).**

**Netzweiter byte-1:1-Rollout (alle gemergt):** Mixarium #114 · Rezeptbuch #302 ·
BookLedgerPro #259 · Tomys-Hub #90 · Kimboard #11 · Kimseek #11 · Kim-Bell #19 ·
SB-KIMTool-Point #108 (beide Kopien: `web/tools/sbkim-embedding.js` + `such-tool/modules`).
family-project war schon Kanon (Quelle). Jede berührte Datei per Blob-SHA `36e87c26`
bestätigt; Repo-Tests grün (BLP 2123/0, SB-KIMTool 103/103, Rezeptbuch 6/6, Mixarium-Smokes,
Kim-Bell 4/4, Kimboard 5/0, Kimseek 4/0).

**Nebenbefund + repariert:** Kimboard/Kimseek Drift-Guard (`test/smoke.test.js`) war auf
`main` bereits **rot** — der A14-Rollout hatte `01_storage.js` aktualisiert, aber den
aufgezeichneten sha256 (`28299cb8`) nicht nachgezogen (Ist: `e507aec1`). In denselben PRs
mitrepariert → beide wieder grün.

**Browser-Sichttest** (echtes lokales Modell vom eigenen Server laden) ungeprüft — wartet
auf Klaus' Browser-Lauf.

## 2026-07-11 · Netzweiter Modul-Drift-Audit — BLP 03+05 nachgezogen, family-project 03 als Fork markiert

**Rolle:** Bausitzung (Sauberkeits-Audit + byte-1:1-Sync, Klaus' Freibrief „entscheide
selbst die Reihenfolge, solange die Modul-01-Fehler weg sind — sauberes Coden").

**Anlass:** Nach dem A14-Abschluss die Basis netzweit geprüft — sind die übrigen
geteilten Kern-Module (02/03/05/05b/23) noch überall byte-1:1 zum Kanon? Vergleich per
git-Blob-SHA auf `origin/main`.

**Ergebnis:** Modul 01 (A14) + 04 (Hybrid/BM25+Multi-Query) sind netzweit **synchron**.
Zwei echte Drifts gefunden, unterschiedlicher Natur:

- **BookLedgerPro — reiner Rückstand (behoben, PR #258):** `03_embedding.js` (fehlte A3
  Contextual Chunking) + `05_anastomose.js` (fehlte der Query-über-Relais-Transport
  `queryNostr`) waren strikte Teilmengen des Kanons (255 bzw. Netto-Rückstand, keine
  BLP-eigene Logik). Byte-1:1 nachgezogen (03=858819b1, 05=6bb282c1), `node tests/run.mjs`
  2123/0 grün. **Datenschutz-Hinweis:** `05` ist Empfangsmodus — aktiviert nichts von
  selbst; BLPs Buchhaltungs-Korpus geht erst übers Relais, wenn die App das Antworten
  ausdrücklich verdrahtet (tut sie nicht).

- **family-project — echter App-Fork (NICHT angefasst, Entscheid an Klaus):**
  `03_embedding.js` ist **Kanon + eigenes Feature** (self-hosted Offline-Modell:
  `detectModelSource`/`getModelSource` + Body-Probe gegen SPA-`try_files`, damit
  transformers.js das Modell vom eigenen Server statt HuggingFace lädt). family hat A3
  Contextual Chunking bereits; die 62 Zusatzzeilen sind das Offline-Feature. Blind
  überschreiben würde es löschen → bewusst gelassen. **Offene Frage an Klaus:** soll das
  Offline-Self-Hosting nach oben in den Kanon `src/modules/03_embedding.js` (und damit in
  alle Apps) gehoben werden? Das ist netzweit nützlich (offline-first), aber ein
  Architektur-Schritt mit eigener Spec-/Bau-Sitzung.

**Nächster sinnvoller Schritt:** entweder das family-Offline-Feature upstreamen (Klaus'
Entscheid) oder A5-Rest (Multi-Query im Such**feld** der Apps verdrahten — Modul 04 trägt
`expandQuerySimple`/`queryLocalMulti` schon überall, die App-Suchfelder rufen aber nur
`queryLocal({hybrid:true})`, noch nicht die Multi-Query-Erweiterung).

## 2026-07-11 · A14-Rollout ABGESCHLOSSEN — Rest-Knoten + eingebettete Kopien netzweit nachgezogen

**Rolle:** Bausitzung (Rollout-Abschluss, eng abgegrenzt, byte-1:1).

**Was getan:** Der A14-Fix (`ensureStore`-Race, Kanon Sage PR #600) war noch
NICHT überall angekommen. Prüfung netzweit über die **git-Blob-SHA** auf
`origin/main` (GitHub-Code-Suche war stale und unbrauchbar — Blob-SHA ist der
verlässliche Vergleich): Kanon-fixiert = `66b31066…`, Vor-Fix = `43a6ad59…`.

Sieben Repos trugen noch den **exakten** Vor-Fix-Stand und wurden byte-1:1 auf
den gehärteten Kanon gehoben (alle gemergt):

| Repo | Datei | PR |
|---|---|---|
| Sage-Protokol | `sbkim-bundle/modules/01_storage.js` | #601 — Drift-Guard war rot, jetzt grün |
| Mein-Rezeptbuch | `sbkim/01_storage.js` | #301 |
| BookLedgerPro | `sbkim/01_storage.js` | #257 |
| Jasons-Tresor | `sbkim/01_storage.js` | #118 |
| Mein-Tresor | `sbkim/01_storage.js` | #60 |
| SB-KIMTool-Point | `web/tools/sbkim-storage.js` (+ Einbettung `jasons-bibliothek/index.html`) | #107 |
| Kim-Bell | `modules/sbkim-storage.js` (+ Drift-sha256 in `test/smoke.test.js`) | #18 |

**Verifikation:** jede geänderte Datei per Blob-SHA byte-identisch zum Kanon
(`66b31066…`) bestätigt; jedes Repo lädt das Modul als eigene `<script src>`
(kein verstecktes Inline-Duplikat im Haupt-App-Pfad). Repo-Tests grün:
SB-KIMTool-Point 103/103 (inkl. Einbettungs-Drift-Guard test 32, den der Fix
zunächst rot zog → Einbettung nachgezogen), BookLedgerPro 2123/0, Jasons 59/59,
Mein-Tresor 53/53, Mein-Rezeptbuch 6/6, Kim-Bell 4/4 (aufgezeichneter sha256
nachgezogen), Sage `smoke_bundle_connect` Drift-Guard wieder grün.

**Bewusst NICHT angefasst (Brief „divergiert → erst Ursache klären"):** die
**getrimmten Inline-Kopien** des Moduls in den *Knoten-Demo-Seiten*
`BookLedgerPro/sbkim/mycelknoten.html` und `SB-KIMTool-Point/web/tools/mycelknoten.html`.
Sie weichen von der Standalone-Serialisierung ab (Header getrimmt, ~976 vs.
1297 Zeilen), tragen aber denselben Race und werden von keinem Drift-Guard
gedeckt → **eigener, browser-verifizierter Folge-Fix** (chirurgisches Einsetzen
der zwei `ensureChain`-Hunks in den Inline-Block, nicht blind überschreiben).

**Nicht betroffen (kein Storage-Modul auf main):** Kimhub, Kimsync, mycel-karte,
ISD-Page-Entwurf, Mein-WorkFloh, die `-Page`-Repos, Muttis-Rezeptbuch(-Seite),
yamilet-Promptgenerator. Mixarium/Tomys-Hub/family-project/Kimboard/Kimseek
waren schon in der Vorsitzung fixiert (bestätigt: Blob = `66b31066…`).

**Browser-Sichttest ungeprüft** — wartet auf Klaus' Browser-Lauf (der Race
zeigte sich am Galaxy Tab bei wiederholtem Slot-/Modul-Wechsel).

## 2026-07-11 · A14 — `ensureStore`-Race gehärtet (Modul 01, netzweit)

**Rolle:** Bausitzung (Kern-Modul 01, eng abgegrenzt).

**Befund (reproduziert, headless):** Zwei GLEICHZEITIGE `ensureStore`-Aufrufe
(z.B. Modul 05 `ensureSlotStores` neben Modul 07 Apoptose im selben Tick) lasen
beide dasselbe `db.version`, errechneten beide `db.version + 1` und öffneten
beide `indexedDB.open(name, N)`. Der zweite Open traf die schon auf N gehobene
DB → **kein** `onupgradeneeded`, resolved aber trotzdem → sein Store wurde nie
angelegt, `KNOWN_STORES` behauptete ihn dennoch → nächster Zugriff warf
`NotFoundError: One of the specified object stores was not found`. Repro:
8/8 Trials fielen auf dem unveränderten Modul.

**Fix:** Serieller Anker `ensureChain` in `src/modules/01_storage.js` reiht
jeden Versions-Bump strikt hinter den vorigen — jeder Lauf sieht ein frisches
`db.version` (Idempotenz-Check + korrekter nächster Bump). Rein interne
Serialisierung, die öffentliche `ensureStore`-Signatur (`Promise<void>`) bleibt
unberührt; ein Fehlerpfad vergiftet die Kette nicht (Rejection wird abgefangen,
an den Aufrufer aber durchgereicht). **KEIN** DB_VERSION-/PROTOCOL_VERSION-Bump.

**Beweis:** neuer Smoke `tests/smoke_a14_ensurestore_concurrent_race.mjs` **4/4
grün** (gleichzeitig 2/3 Stores + Modul-05-`ensureSlotStores`-Muster + zwei
Wellen). Non-vakuum verifiziert: dieselben 4 Proben fielen 4/4 auf dem
unveränderten Modul. Regression frei: `smoke_pflege_01_init_fail_soft` 11/11,
`_repoint_migrate` 21/21, `_shared_topf_isolation` 7/7,
`_versions_bump_race` 6/6.

**Offen / nächster Schritt:** byte-1:1-Rollout des gehärteten Modul 01 in die
Konsumenten-Repos (Tomys-Hub, Mixarium, family-project, Kimboard, Kimseek — alle
waren byte-identisch zum Vor-Fix-Stand). Browser-Sichttest ungeprüft — wartet
auf Klaus' Browser-Lauf (der Race zeigte sich am Galaxy Tab bei wiederholtem
Slot-/Modul-Wechsel).

## 2026-07-11 · ✅ Browser-Reihen-Test GRÜN — Identitäts-Isolierung 11/11 live bewiesen

**Rolle:** Begleit-/Sichttest-Sitzung (Klaus am Tablet, Freibrief galt). **Abschluss von A13.**
Klaus hat den Browser komplett geleert + alle Apps deinstalliert (außer Mycel-Karte, reiner
Beobachter), dann **jede App einzeln** geöffnet → Hard-Reload (Strg+Shift+R, frischer SW) →
„🌐 Mit dem Netz verbinden". **Ergebnis: 11/11 Apps zeigten je eine EIGENE, verschiedene nodeId —
keine einzige Kollision.**

| App | nodeId (Anfang) | App | nodeId (Anfang) |
|---|---|---|---|
| Mein Mixarium | `1zh_Xkqfq` | Mein-Tresor | `PwZkKkaUm` |
| Mein Rezeptbuch | `26HBrV80y` | Kimseek | `29NnYnLK` |
| BookLedgerPro | `itzsPCHy2` | Kimboard | `9Xlas1Gj9` |
| family-project | `c-lFJKXPJ` | Tomys-Hub | `s2-oNG-Eke` |
| SB-KIMTool-Point | `VXbd6kIqFi` | Kim-Bell | `fRx3M_xo7` |
| Jasons-Tresor | `FBTYVnW3i` | | |

**Kern-Beweis:** das frühere Kollisions-Paar **SB-KIMTool-Point `VXbd6kIqFi` ↔ family-project
`c-lFJKXPJ`** (teilten sich vorher dieselbe nodeId `3Qo4OKI…`, last-writer-wins) ist jetzt sauber
getrennt. Der Isolierungs-Fix (PR #595: Idempotenz-Guard + `window.SBKIM_DB_SUFFIX`) hält netzweit
im echten Browser, nicht nur headless. **A13 vollständig geschlossen** (PLAN nachgezogen).
Nebenbeobachtung (harmlos, kein Befund): SB-KIMTool-Point zeigte zwei Ladebalken beim ersten
Verbinden = das ~30 MB Embedding-Modell wird einmal in die eigene Schublade geladen, **nicht**
eine zweite Identität (Panel bestätigte „✓ Identität erzeugt" genau einmal).

**Zweiter, unabhängiger Beleg — Mycel-Karten-Aufzeichnung** („Mycel-Karte Analyse-Rekorder v1.3",
Klaus, 08:00–08:47 Uhr desselben Tages, 38 Ereignisse): die Live-Karte hat mitgeschrieben, welche
Identität jeder Knoten im gemeinsamen Raum (`sbkim-rdv`) trägt. Maschinell ausgewertet: **(1) keine
einzige nodeId hing je an zwei Apps** (keine Kollision), **(2) kein Knoten zeigte je mehrere/wechselnde
IDs** (jede App durchgehend genau eine). End-Schnappschuss: 9 Knoten gleichzeitig live, jeder mit
eigener ID — **exakt dieselben** wie im Reihen-Test (family `c-lFJKXPJ`, toolpoint `VXbd6kIqFi`,
jtresor `FBTYVnW3i`, mtresor `PwZkKkaUm`, tomyhub `s2-oNG-Eke`, kimseek `29NnYnLK`, kimboard
`9Xlas1Gj9`, kimbell `fRx3M_xo7`, blp `itzsPCHy2`). Dass die 08-Uhr-Aufzeichnung dieselben IDs sah
wie der 10:25-Test, belegt zusätzlich **stabile, persistente Identitäten** (überleben Zeit + Neuladen,
ohne zu wandern). Damit ist die Isolierung **doppelt bewiesen** — manueller Reihen-Test + Live-Karten-Log.

**Offen / nächster Schritt:** **A14** (vorbestehende `ensureSlotStores`-Race, Modul 05/01 — nicht
durch A13 verursacht) separat untersuchen · **A15** (Zwei-Stufen-Verbinden: 🔎 stöbern anonym ↔
🌐 voll mitmachen) + **A11** (Suchergebnis→Andocken) als Marktplatz-Folge · Tomys-Hub-Spore
veröffentlichen (braucht „📥 Spore herunterladen"-Knopf — kleiner Bau).

## 2026-07-11 · Identitäts-Isolierung gehärtet — Doppel-Laden + globales App-Suffix, netzweit 11/11

**Rolle:** Bausitzung (Anschluss, gleiche Sitzung). Freibrief galt. **Auslöser:** Klaus' Live-Sichttest
zeigte, dass mehrere PWAs auf der geteilten github.io-Origin sich EINE Identität über den geteilten Topf
`sbkim` teilten (SB-KIMTool-Point + family-project zeigten dieselbe nodeId `3Qo4OKI…`, last-writer-wins;
SBK „erbte" family-projects Identität und umgekehrt). Tomys-Hub war die Ausnahme (sauber isoliert).

**Zwei Wurzeln, beide gefixt (Modul 01, PR #595 gemergt):**
- **(A) Doppel-Laden:** lädt eine Seite das Storage-Modul ein ZWEITES Mal (SB-KIMTool-Point:
  `assets/sbkim-siegel.js` zieht `web/tools/sbkim-storage.js` dynamisch nach), lief die IIFE erneut und
  SETZTE den State zurück → der gesetzte `dbSuffix` ging verloren → Rückfall auf den geteilten Topf.
  Fix: Idempotenz-Guard `if (global.SbkimStorage) return;` — zweites Laden ist No-Op.
- **(B) Reihenfolge:** öffnete irgendein Modul den Storage VOR `init({dbSuffix})`, wurde der Default `sbkim`
  geöffnet. Fix: Default-DB-Name kommt aus dem globalen App-Suffix `window.SBKIM_DB_SUFFIX` (App setzt es
  ganz früh) → JEDER Storage-Zugriff landet reihenfolge-unabhängig in `sbkim_<suffix>`, selbst nach Reset.
Additiv + rückwärtskompatibel; DB_VERSION 4 unberührt. Smoke `smoke_pflege_01_shared_topf_isolation.mjs`
**7/7** (Doppel-Laden No-Op + zwei Apps getrennte Schubladen + keine Kollision + rückwärtskompat.), regress-frei.

**Netzweiter Rollout ERLEDIGT — 11/11 Apps** (je eigener PR gemergt): jede App bekam die neue Modul-01-Version
**+** `window.SBKIM_DB_SUFFIX="<suffix>"` nachweislich VOR dem ersten SBKIM-Script (Offset-Beleg je HTML):
Kim-Bell (#17, kimbell) · Mein-Mixarium (#112, mixarium, index==QC md5-sync) · Mein-Rezeptbuch (#300,
rezeptbuch via QC+build.py) · Kimboard (#9) · Kimseek (#9) · SB-KIMTool-Point (#106, toolpoint, 4 HTMLs +
jasons-bibliothek-Embed) · Mein-Tresor (#59) · Jasons-Tresor (#117) · BookLedgerPro (#256, Suffix
`bookledgerpro-sbkim` = Identitäts-Store; Rendezvous-Variante `bookledgerpro` wird fail-soft auf dieselbe
Schublade geheilt) · family-project (#51, 6 HTMLs) · Tomys-Hub (#86, tomyhub). **Mycel-Karte** ist reiner
Beobachter (nur WebSocket-Lausch, keine Identität, kein Storage) → kein Fix nötig, geprüft.

**Offen / nächster Schritt:** Klaus' **Browser-Reihen-Test** (leerer Browser, eine App nach der anderen:
Hard-Reload → „🌐 Mit dem Netz verbinden" → jede App eine eigene, verschiedene nodeId). Kein „Aufräumen"
nötig (Browser geleert). **A14** (vorbestehende `ensureSlotStores`-Race, Modul 05/01 — Tomys verbund-E2E
15/16, nicht durch diesen Fix verursacht) separat untersuchen. **A15** (Zwei-Stufen-Verbinden, Klaus' Idee)
+ **A11** (Suchergebnis→Andocken) als Marktplatz-Folge.

## 2026-07-11 · Modul-01 Selbst-Heilung — netzweiter Rollout 11/11 (Aufräum-Rettung repariert)

**Rolle:** Bausitzung (Anschluss an den 11/11-Re-Sync, gleiche Sitzung). Freibrief galt.
**Auslöser (Klaus' Live-Sichttest 2026-07-11):** nach dem Re-Sync + komplettem Browser-
Speicher-Löschen brach die „🧹 Aufräumen & neu anmelden"-Rettung (Modus B) auf **Mein
Rezeptbuch** + **BookLedgerPro** ab mit „Pflicht-Stores fehlen in existing DB (v=7): sbkim_keys,
…"; zugleich teilten **Kim-Bell + SB-KIMTool-Point** dieselbe Identität (`28MUVbD7…`, aus dem
geteilten `sbkim`-Topf). Weil der Speicher vorher leer war → **echter Kern-Zustand, keine
Alt-Verschmutzung**: auf der geteilten Pages-Origin kann durch openProbe-Bump-Race eine
versioniert-aber-store-lose DB entstehen; Modul 01 warf hart `StorageOpenError` und reparierte
nicht → Rettung konnte nie durchlaufen.

**Fix (Sage-Kanon, PR #592 gemergt):** fehlt unter den Pflicht-Stores der Identitäts-Store
`sbkim_keys`, kann die DB **keine Identität tragen** → gefahrloser Neu-Aufbau (löschen, frisch
unter DB_VERSION öffnen) statt Fehler. Ist `sbkim_keys` da und nur ein anderer Store fehlt →
weiter fail-fast (kein stiller Datenverlust). Open-Körper nach `openFreshAtDbVersion()`
ausgegliedert (Initial-Pfad unverändert). `DB_VERSION` 4 unberührt, kein Schema-Bruch.
`sbkim-bundle/modules/01_storage.js` byte-1:1 mitgezogen. Smoke `smoke_pflege_01_init_fail_soft`
**11/11** (Probe 3 Selbst-Heilung + Probe 4 fail-fast-Grenze neu), regress-frei.

**Netzweiter Rollout ERLEDIGT — alle 11 Endknoten byte-1:1 auf die neue Kanon-Version**
(je eigener PR, gemergt, headless grün, SW-Cache-Bumps wo cache-first):
Mein-Mixarium (#111, SW v49→v50) · Mein-Rezeptbuch (#299, SW network-first) · family-project
(#50, SW v13→v14) · BookLedgerPro (#255, SW v196→v197, 2123/2123) · SB-KIMTool-Point (#105,
+ Embed jasons-bibliothek) · Jasons-Tresor (#116, 2 Kopien, 59/59) · Mein-Tresor (#58, 2 Kopien,
53/53) · Kimseek (#8, SW v6→v7) · Kimboard (#8, SW v6→v7) · Tomys-Hub (#85, SW v6→v7) ·
Kim-Bell (#16, SW v14→v15). **Live-Beleg:** Tomys-Hub-Verbund-E2E heilt jetzt den zuvor roten
Fall „Identität aus leerer DB laden" (16/16, vorher 15/16).

**Offen / nächster Schritt:** Klaus' Browser-Reihen-Test — pro App Hard-Reload +
„🌐 Mit dem Netz verbinden": jede App zeigt eine **eigene, verschiedene** nodeId (eigene
Schublade `sbkim_<app>`); „🧹 Aufräumen & neu anmelden" läuft jetzt sauber durch. Tomys-Hub
(`tomyhub`) + family-project (`familyprojekt`) bekommen ihre lebende Identität in Klaus'
Browser (eigene Instanz; Tomys Gerät bliebe ein separater Knoten). Optionale veröffentlichte
`sbkim/spore.json` nur auf Wunsch (öffentliche Spore committen, privater Schlüssel bleibt im Browser).

## 2026-07-11 · Identitäts-Isolierung KOMPLETT — Kim-Bell + SB-KIMTool-Point voll re-synct (11/11)

**Rolle:** Bausitzung (Brief `BRIEF_KIMBELL_SBK_VOLLER_RESYNC.md`). Freibrief galt.
Die zwei bewusst ausgelassenen Knoten (pre-A4-Baseline) auf den **vollen Sage-Kanon**
gehoben — **kein** 01+23-only-Bump (der hätte einen Mischversions-Knoten erzeugt),
sondern Modul für Modul jede geladene Datei = Kanon.

- **Kim-Bell** (PR #15 gemergt, `c081ee5`): alle 13 geladenen `modules/sbkim-*.js` auf
  Kanon (10 geändert; apoptose/nostr-relay/noble waren schon Kanon). Drift-Guard-sha256
  (`test/smoke.test.js`) nachgezogen, SW `kim-bell-v13→v14`. **node --test 4/4 grün.**
- **SB-KIMTool-Point** (PR #104 gemergt, `f27784e`): `web/tools/*` 12 Module auf Kanon;
  `such-tool/modules/03_embedding.js` auf Kanon + SW `sbkim-such-tool-v2→v3`;
  `jasons-bibliothek/index.html` eingebettete Module 01+02 mitgezogen (Embed-Byte-Guard
  `test/jason_lib.test.js` gewahrt). **npm test 103/103 grün.**
- Bringt beiden: Modul-23 Identitäts-Schutz (Weg A), Bau-23.B-Korpus-Kopplung, Spore
  `regenerateOwnSpore` + Embedding-Felder, `embedContentVector`/Contextual-Chunking (03).
- **Verträge unberührt:** PROTOCOL_VERSION 0.1 · DB_VERSION 4 · PROVIDER_MIN_MATCH 0.80.
  Alt-Dateinamen bleiben, nur Inhalt = Kanon. Kein PII.
- **Bewusst unberührt:** SBK-Ein-Datei-Spiegel `andock.html`/`mycelknoten.html` (eigene
  sha-Guard, Kanon-Quelle = Sages Ein-Datei-Tools, nicht `src/modules`) → Folge-Schritt bei Bedarf.

**Damit ist der Identitäts-Isolierungs-Rollout netzweit 11/11.** Offen: **Klaus-Sichttest**
(eigene stabile nodeId je App + Handshake ✓) läuft post-Merge auf den deployten Seiten
(GitHub Pages von `main`, „erst mergen, dann sieht Klaus es"). PLAN A3 (Medium-Härtung) bleibt.

## 2026-07-11 · Identitäts-Isolierung — Modul-01-Härtung (dbSuffix-Re-Point) + Migration (voller Fix, Klaus' Wahl)

**Rolle:** Bausitzung (Brief `BRIEF_IDENTITAETS_ISOLIERUNG_MODUL01_MIGRATION.md`). Freibrief galt;
Klaus hat ausdrücklich den **vollen Fix** (Modul 01 + Migration) gewählt. Kern-Modul-Umbau
(Modul 01 = Speicher-Fundament) — headless dreifach abgesichert, DANN netzweit.

**Warum:** Der A3-Guard (unten) verhindert nur den *Verlust* der Identität, behebt die
*Kollision* nicht — nodeId `2zgB0…` wurde von zwei Apps geteilt (eine Identität im geteilten
Topf `sbkim`), Handshakes „Request-Signatur ungültig". Wurzel: `init()` ist init-once; ein
späterer `init({dbSuffix})` mit abweichendem Namen wurde blind abgewiesen → landete etwas ohne
Suffix zuerst im geteilten `sbkim`, blieb es dort.

**Gebaut — Teil 1 (Modul 01 `init` Re-Point):** ein Folge-`init({dbSuffix})` mit ABWEICHENDEM
Suffix wird nicht mehr blind abgewiesen. Ist die offene DB **identitäts-leer** (`sbkim_keys`
count 0) → Verbindung sauber schließen (`closeConnectionAndWait`), `dbPromise=null`, mit neuem
Suffix neu öffnen (sicheres Re-Point). Trägt sie Identität ODER Probe unsicher → weiter
fail-fast. `DB_VERSION` unberührt, gleicher/kein Suffix byte-gleich. `_meta.dbSuffixRepointPolicy
= "empty-safe"`.

**Gebaut — Teil 2 (`SbkimStorage.migrateIdentityFrom(oldDbName)`):** raw-IndexedDB-Kopie aller
`sbkim_*`-Stores (keys+spore+meta+identitäts-Stores) aus einer fremden DB in die aktive —
**nur fehlende Schlüssel** (kein Überschreiben). Fehlende Stores additiv via `ensureStore`.
Fail-soft (resolves immer Summary; sync-Wurf nur bei Bad-Arg). Identität isoliert UND behalten.

**Gebaut — Guard (Modul 23):** `repairAndReconnect` **migriert** im Alt-Fall die Identität aus
`sbkim` in die eigene Schublade und **löscht dann** den geteilten Topf (Kollision aufgelöst +
Identität behalten); scheitert die Migration / fehlt der Pfad → reiner Schutz als Fallback.
`ensureIdentity` (Modus A) migriert ebenfalls, bevor es eine neue Identität erzeugt. Rückgabe
um `migratedIdentity`, `_meta` um `hasMigrate` erweitert. Kern-Module 02/05/05b UNANGETASTET.

**Tests:** neu `smoke_pflege_01_repoint_migrate.mjs` **21/21** (Re-Point leer/mit-Identität/
gleicher-Suffix + Migration kopiert/kein-Überschreiben/fehlende-Quelle/gleiche-DB/Bad-Arg) ·
`smoke_bau23d_migrate.mjs` **22/22** (Migration erfolgreich→Topf löschen · noop/Wurf/kein-Pfad→
Schutz-Fallback · Schublade-trägt-Identität · ensureIdentity-Migrate · `hasMigrate`). Regress-frei:
bau23c 16/16, bau23 58/58, bau23_ui 32/32, bau23b_korpus 24/24, bau23b_query 23/23, bau02y 33/33,
pflege_01_fail_soft 8/8, versions_bump_race 6/6, slot-Pfade 05y/06y/07y/08y, query-relais 18/18,
bundle-drift **21/21**. `sbkim-bundle/modules/{01,23}` byte-1:1 mitgezogen.

**Netzweiter Rollout ERLEDIGT für 9 Endknoten** (byte-1:1 Modul 01 + 23 aus dem Kanon, je eigener
PR gemergt, SW-Cache gebumpt wo cache-first, Repo-Tests grün): **Kimseek** (#7, 4/4) · **Kimboard**
(#7, 5/5) · **Mein-Mixarium** (#110, 14/14, md5-Mirror grün, sw-v49) · **Tomys-Hub** (#84, tomy-hub-v6)
· **family-project** (#49, smoke_spore 6/6, sw-v13) · **Mein-Rezeptbuch** (#298, 13/13, mrz-v36) ·
**Jasons-Tresor** (#115, 59/59, 2 Modul-01-Kopien) · **Mein-Tresor** (#57, 53/53, 2 Kopien) ·
**BookLedgerPro** (#254, 2123/2123, v196). In jedem war Modul 01 == alter Kanon → sauberes Delta.

**Bewusst NICHT partiell gebumpt — Kim-Bell + SB-KIMTool-Point** (Entscheid dokumentiert, nicht
stillschweigend): ihr Modul 01 (`sbkim-storage.js`) ist zwar sauberes Alt-Kanon-Delta, aber ihr
**Modul 23 (`sbkim-rendezvous.js`) liegt ~237–239 Zeilen hinter dem Kanon** (fehlt u.a. die
Bau-23.B-Korpus-Kopplung, ist prä-A4). Ein 01+23-only-Bump auf Kanon wäre ein 237-Zeilen-Multi-
Versions-Sprung bei Modul 23, während Match/Spore/Anastomose alt bleiben → **Mischversions-Knoten**
(genau die im A3-Eintrag benannte Falle). Darum brauchen diese zwei einen **vollen Modul-Re-Sync**
als eigenen Durchgang (Brief `BRIEF_KIMBELL_SBK_VOLLER_RESYNC.md`). Architektur-tiefgreifend →
Klaus-Sichttest nach dem Re-Sync Pflicht.

**Sofort-Entlastung für Klaus (heute, ohne Rollout):** pro App EINMAL frische eigene Identität
erzwingen (Notfall-/„nur neu anmelden") + hart neu laden löst die Kollision pro App. **Browser-
Sichttest (jede App EINE eigene stabile ID, Handshake ✓ etabliert) wartet auf Klaus** — auf den
9 gemergten Apps läuft der Fix jetzt live nach hartem Neuladen.

## 2026-07-11 · A3 (Medium härten) — Identitäts-Wurzel: „Aufräumen" schützt jetzt die Identität (Weg A)

**Rolle:** Bausitzung (Brief A3 Medium-Härtung + Identitäts-Wurzel). Freibrief galt;
Weg-Wahl A von Klaus bestätigt („weiter mit dem Bau").

**Befund (aus dem Code verifiziert):** Das gemeldete Symptom „🧹 Aufräumen & neu anmelden
erzeugt eine neue Identität" hat seine Wurzel in Modul 01: `SbkimStorage.init()` ist
**init-once** (Z. 355–371) — der erste Aufruf beansprucht den DB-Namen **synchron und
endgültig**; ein späterer `init({dbSuffix})` mit abweichendem Namen wird **abgewiesen**
(`InvalidDbSuffixError`, in den App-Inits per `catch` verschluckt). Ruft also irgendetwas
`init()` **ohne** Suffix zuerst, landet die Identität im **geteilten** Topf `sbkim` (Modul 02
schreibt ausschließlich über `SbkimStorage`). `cleanupSharedOrigin()` löschte genau diesen
Topf → Identität weg → neue beim Neu-Anmelden.

**Gebaut (Modul 23, Kern 01/02/05 unangetastet):** `repairAndReconnect` ist jetzt
**identitäts-schonend**. Neue read-only IndexedDB-Probe `dbHasIdentity(dbName)` (öffnet lesend,
prüft nicht-leeren `sbkim_keys`, löscht eine evtl. angelegte Phantom-DB wieder). Modus B löscht
`sbkim` **nur**, wenn die eigene Schublade `sbkim_<suffix>` die Identität schon trägt; sonst
bleibt `sbkim` stehen (`cleanupSharedOrigin({deleteSharedDb:false})`) → kein Identitätsverlust,
keine ungewollte neue Identität. Im Zweifel (Probe-Fehler) fail-safe nicht löschen.
`newIdentity:true` erzwingt weiter die volle Reinigung. Rückgabe um `protectedIdentity` +
`identityNote` erweitert. Spam-Schutz (`underRateLimit` 6/min) + Karten-Frische
(`freshSec`-TTL + newest-per-name) waren bereits live verdrahtet — nur bestätigt.

**Tests:** neuer `smoke_bau23c_identity_protect.mjs` **16/16** (4 Fälle: im Topf→geschützt ·
eigene Schublade→gelöscht · newIdentity→volle Reinigung · nichts da→frisch). Regress-frei:
bau23 58/58, bau23_ui 32/32, bau23b_query 23/23, bundle-drift 21/21. `sbkim-bundle/modules/
23_rendezvous.js` byte-1:1 mitgezogen.

**Rollout 2026-07-11 ERLEDIGT für 9 von 11 Knoten** (je eigener PR gemergt): Kimseek, Kimboard,
Mein-Mixarium, Mein-Rezeptbuch, Tomys-Hub, Jasons-Tresor, Mein-Tresor, family-project (SW→v12),
BookLedgerPro (SW→v195, 2123/2123). Bei Kimseek/Kimboard den bereits roten Drift-Guard mitgeheilt.
**Kim-Bell + SB-KIMTool-Point** standen auf pre-A4-Baseline (Kim-Bell 9/13 Module älter) → brauchten
vollen Modul-Re-Sync (eigener Durchgang), kein 23-only-Bump. **✅ ERLEDIGT 2026-07-11** (voller
Re-Sync, PR #15 Kim-Bell + PR #104 SB-KIMTool-Point gemergt — siehe obersten PULS-Eintrag). **Rollout
damit netzweit 11/11.**

**Offen / nächster Schritt:** **netzweiter byte-1:1-Rollout** des neuen Modul 23 in die 10
Endknoten (Kim-Bell `sbkim-rendezvous.js`, Kimseek/Kimboard/Mixarium/family/Tomys
`23_rendezvous.js`, + Rezeptbuch/BLP/Tresor/Point) inkl. SW-Cache-Bumps wo cache-first —
eigener Folge-Durchgang. Optionale Vertiefung: Migration einer bereits im `sbkim` liegenden
Alt-Identität (bzw. Modul-01-Härtung für nachträglichen Suffix) + NIP-09-Retraktion eigener
Alt-Präsenz-Karten. **Browser-Sichttest (wiederholtes „Aufräumen" behält EINE Identität) wartet
auf Klaus.**

## 2026-07-10 · ⭐⭐ MEILENSTEIN GESCHLOSSEN — bidirektionale Cross-Knoten-Suche LIVE beidseitig + Rendezvous-Härtung netzweit

**Der große Punkt.** Die volle **bidirektionale, server-lose Cross-Knoten-
Bedeutungs-Suche** ist in Klaus' Browser **live in beide Richtungen** bewiesen
(Splitscreen, beide deployte `main`, Relais `wss://relay.family-projekt.de`):
- **Sage → Mixarium:** „Cocktails mit anderen Waldfrüchten" → 5 Drinks aus
  Mixariums Buch (Tropical Creamwave 0.83 …), 39 s.
- **Mixarium → Sage:** „wer weiß was über Pilze" → 4 Module aus Sages Bibliothek
  (Reputation/Membran/Heterokaryose/Match), 0,5 s.

Damit ist die in `MEILENSTEIN_SEMANTISCHE_SUCHE.md` als „noch nicht end-to-end
gezeigt" geführte Hälfte **geschlossen** (Doc + CLAUDE.md-Tafel nachgezogen).

**Was den Durchbruch möglich machte — Rendezvous-Härtung (Modul 23 + UI):**
Klaus' Mycel-Karte + Analyse-JSON zeigten die Ursache der Fehlversuche:
wiederholtes „🧹 Aufräumen & neu anmelden" hinterlässt Alt-Identitäten, deren
Präsenz-Kärtchen ~30 min weiterleben → die Frage zielte auf eine **verwaiste,
nicht-lauschende ID** → Timeout. Fix:
- **`discover()` zeigt pro Knoten-NAME nur die neueste Karte** (`collapseByName`,
  Default an) — tote Alt-Kärtchen verschwinden, „Fragen" trifft die lauschende ID.
- **`enableAnswering()` heftet beim Einschalten eine frische Karte** unter der
  lauschenden ID ans Brett.
- **Flying-Widget:** „Mit dem Netz verbinden" frei verschiebbar (Kopfzeile) +
  „–" minimierbar, Position gemerkt (Klaus' Wunsch, verdeckte sonst die Seite).
- **Mycel-Karte** läuft als eigene installierbare PWA (`…github.io/mycel-karte/`).

Smokes: `smoke_bau23_rendezvous` **58/58** (Probe 6b „Mixarium ×2 → newest-per-
name"), 23_ui 32/32, bau23b 23+24, Bundle 21. **Netzweit ausgerollt** (byte-gleich,
je eigener PR): Sage + Mixarium + Rezeptbuch + Jasons-Tresor + Mein-Tresor +
Tomys-Hub + family-project + BookLedgerPro + Kimboard + Kimseek = **10 Knoten**
(SW-Bumps Kimboard v3/Kimseek v3). Kern 02/05/05b + 0.80-Riegel unberührt.

**Rest-Grenze (ehrlich):** die Antwort kommt zuverlässig nur, wenn der Antworter-
Tab **vorn + wach** ist (Handy/Tablet drosseln Hintergrund-Tabs); Wiederhol-Frage
auf gealterte Karte → „Visitenkarte veraltet". **Nächster Schliff:** bei
veralteter Karte automatisch neu lesen + einmal nachfragen (Teil von A3).

## 2026-07-10 · A4 Teil 1 — Ausschluss-/Negations-Filter (Bau 04.I): „alkoholfrei" / „ohne Erdbeeren" filtern wirklich

**Klaus' Live-Befund nach A2:** Die semantische Suche liefert bei „alkoholfreies
Erfrischungsgetränk" auch Drinks mit Wodka, und ein Allergiker, der „ohne Erdbeeren"
sucht, bekommt trotzdem Erdbeer-Rezepte oben. Grund: **Ähnlichkeit ist kein
Constraint.** Der Cosinus rankt einen Erdbeer-Drink NAH an „Erdbeere", auch wenn man
ihn ausschließen will; „alkoholfrei" nennt eine **Klasse** (der Wodka steht in der
Zutatenliste, nicht im Fragetext).

**Gebaut (Modul 04, deterministisch/offline, KEIN LLM):**
- `parseExclusions(text)` — liest Verneinungen: „ohne X", „kein(e) X", „X-frei"
  (zuckerfrei/laktosefrei), „allergisch gegen X", Alkohol-Klasse („alkoholfrei",
  „ohne Alkohol", „alcohol-free", „non-alcoholic", „virgin"), EN „without/no X";
  mehrere Begriffe („ohne Erdbeeren und Himbeeren") werden alle erfasst.
- `contentExcluded(text, ex)` / `applyExclusions(cands, ex, getText?)` — filtert
  Kandidaten deterministisch über ihren Inhalt (Alkohol-Lexikon per Wortgrenze,
  freie Begriffe per Stamm-Teilstring).
- `queryLocal(text,k,{exclude:true|<ex>})` filtert **VOR** dem Ranking. Ohne
  `exclude` **byte-gleich**; `PROVIDER_MIN_MATCH` + Andock-Riegel (Modul 05)
  **unberührt** (der Filter entfernt nur, senkt keine Schwelle).

**Live verdrahtet:** Modul 22 (Widget-Suche — einmal aus der Original-Frage geparst,
konsistent über Multi-Query-Varianten) + Modul 23 (Antworter auf fremde Knoten-Fragen).

**Tests:** `smoke_bau04i_exclusions.mjs` **34/34** grün (beide Klaus-Fälle bewiesen);
regress-frei: 04c 45, 04d 68, 04f 32, 04g 36, 22 260, 22f 17, 23 55, 23b 23,
Bundle-Connect 21, Standalone-Drift 49 — alle grün. Byte-Kopien
`such-tool/modules/04+22`, `sbkim-bundle/modules/04+23` mitgezogen (Drift-Guard grün).

**Netzweiter Rollout ERLEDIGT (2026-07-10, je eigener PR gemergt):** A4 + A2-Härtung II
byte-gleich in **10 Knoten** — Mixarium, Rezeptbuch, Kimboard, Kimseek, Tomys-Hub,
family-project, BookLedgerPro, Jasons-Tresor, Mein-Tresor, SB-KIMTool-Point (such-tool)
— plus Sage-Kanon. Bei den weit zurückliegenden Kopien (BLP/Tresor/SBK) zugleich voller
Modul-Sync auf `main` (reine ältere Sage-Kopien, keine App-Modifikation; BLP `node
tests/run.mjs` 2123 grün). SW-Cache-Bumps wo cache-first (Kimboard v2/Kimseek v2/BLP
v194/SBK such-tool v2). **„Im Netz anmelden" damit netzweit aktualisiert** (A2-Härtung II
reiste in jedem 23-Update mit). **family-project-Website geprüft:** keine Links zu alten/
toten Tools (Sage-Einladung, Tomys-Hub/showcase, mycel-karte — alle aktuell).

**Pinnwand bewusst NICHT** (Architektur-Merke): Ausschluss-Filter gehört auf Korpus-SUCH-
Flächen (entfernt Kandidaten), nicht auf die Q&A-Thread-Sortierung der Pinnwand („nichts
wegfiltern" — jede Antwort bleibt sichtbar, Verneinung erledigt dort der KI-Richter).

**Offen:** Browser-Sichttest (Klaus, live an Sage/Mixarium); **A4 Teil 2** KI-Richter
B3 (Eignung/Sicherheit, Hund-Katze-/Permethrin-Fall).

## 2026-07-10 · ⭐ A2 LIVE GRÜN — erster server-loser Cross-Knoten-Frage→Antwort-Lauf (Sage ↔ Mixarium)

**Meilenstein (Klaus' Browser).** Sage fragte „Alkoholfreies Erfrischungsgetränk" → **Mein-Mixarium
antwortete aus SEINEM eigenen Buch** mit 5 bedeutungs-sortierten Drinks (Tropische Kokostraum-Bowl
„Alkohol frei" 0.86 … Tropical Creamwave 0.85), server-los übers Relais `wss://relay.family-projekt.de`
in **10,7 s**, beidseitig „✓ ANDOCK ETABLIERT". Damit ist **A1 + A2** der Plan-Liste live bewiesen
(`docs/PLAN_SEMANTIK_KRYPTO.md`).

**Was den Durchbruch möglich machte (alles heute):**
1. **Saubere, getrennte Sporen** — der ganze netzweite `saubere-netz-anmeldung`-Rollout (eigene
   Schublade + Modus A/B in allen 12 Knoten). Ohne saubere Identität lief A2 vorher ins Leere.
2. **A2-Härtung II** (PR #575 Sage + #104 Mixarium): der Antworter **wärmt Modell+Korpus beim
   „💬 Antworten: an" im Hintergrund vor**, Frage-Timeout 15 s → 60 s. Vorher: „Keine Antwort in 15 s",
   weil Mixarium sein ~30-MB-Modell erst bei der ersten Frage lud.
3. **Inhalt-zuerst-Reihenfolge** (Klaus' Befund → **Browser-Lehre 12**): erst Buch füllen, dann Spore
   erzeugen/anmelden — sonst steht ein leerer Knoten im Raum.

**Ergebnis-Ehrlichkeit:** die Trefferliste ist **bedeutungs-sortiert** (semantisch nah an „alkoholfrei
+ erfrischend"), **kein harter Alkohol=0-Filter**. Treffer 1 ist explizit „Alkohol frei"; 2–5 (Sunrise
Bowl, Kräuter-Nektar, Raspberry Cooler, Creamwave) sind dem Namen nach plausibel alkoholfrei, aber
nicht garantiert. Ein garantierter Alkohol-frei-Filter wäre **Plan-Punkt A4 (KI-Richter Sicherheit/
Eignung)** — natürlicher nächster Schritt.

**Offen / nächste Schritte:** A2-Härtung II in die übrigen Knoten nachziehen (byte-gleich); dann A3
(Medium härten) / A4 (KI-Richter, u.a. harter Alkohol-frei-Filter) / A5 (Hybrid+Multi-Query-Rollout).

## 2026-07-10 · A1-Härtung — Korpus-leer-Falle im Frage→Antwort-Pfad (Modul 23) abgesichert

**Rolle:** Bau-Sitzung (Freibrief gilt). **Branch:** `claude/a1-query-answer-security-qa26ts`.
Umsetzung von Schritt 1 aus `BRIEF` A1 (2026-07-10).

**Ehrlichkeit zuerst — was A1 wirklich ist:** A1 war headless bereits ~90 % gebaut (Bau 23.B,
2026-07-06), nur über einen besseren Weg als der Plan-Text sagte. **Der Netz-Transport für
„Frage → Antwort über das Netz" lebt in Modul 23** (`enableAnswering`/`askNode`, Tag `sbkim-qry`),
NICHT in Modul 15 `op:"query"` (das ist der Same-Browser-Zwilling, kein Netz-Pfad). Plan +
Karte im PLAN_SEMANTIK_KRYPTO.md sind entsprechend korrigiert; A1 headless-fertig, Live = A2.

**Der eine echte Riss (behoben):** die **Korpus-leer-Falle**. `enableAnswering()` beantwortet
eine Frage über `queryLocal` — echte Treffer gibt es aber nur, wenn Modul 04 vorher einen lokalen
Korpus registriert bekam (`setLocalCorpus`). Bisher tat das **ausschließlich das Such-Widget
(Modul 22) lazy bei der ersten Widget-Suche** → wer „💬 Antworten" AN-schaltete, aber nie selbst
suchte, antwortete mit **leerer Liste trotz vorhandener Daten** (live zugeschlagen, siehe
2026-07-02-Eintrag).

**Was gebaut (headless, per Freibrief):**
1. **Korpus-Kopplung gehärtet (Modul 23):** neue Konfig `prepareCorpus` (app-eigener async-Provider);
   `enableAnswering()` koppelt den lokalen Korpus jetzt **aktiv** an Modul 04 (`ensureAnswerCorpus` →
   `setLocalCorpus`), unabhängig davon, ob je eine Widget-Suche lief. Konsequent **fail-soft** (ohne
   Provider / ohne `setLocalCorpus` / bei Provider-Fehler → ehrlich leer, kein Bruch), idempotent,
   rein lokal. Neue `_meta.hasPrepareCorpus`/`answerCorpusEnsured`. **Kern-Module 02/05/05b unangetastet,
   0.80-Riegel + PROTOCOL_VERSION „0.1" unberührt, kein PII.** UI-Modul (`23_rendezvous_ui.js`) reicht
   `prepareCorpus` durch; `sbkim-init.js` verdrahtet einen **gecachten, geteilten** Korpus-Provider
   (`sageEnsureSuchkorpus`) für Modul 22 UND Modul 23 → kein doppelter ~30-MB-Modell-Bau.
2. **Byte-Kopien** `sbkim-bundle/modules/23_rendezvous.js` + `23_rendezvous_ui.js` mitgezogen (Drift-Guard grün).
3. **Neuer Smoke** `tests/smoke_bau23b_korpus.mjs` **24/24** — beweist die Falle (leer vor AN) + Heilung
   (echte SAGE_SUCHKORPUS-Treffer nach AN, auch ohne Widget-Suche) + End-to-end askNode + drei Fail-soft-Pfade.
4. **Panel 23** in `tests/manual_check.html`: Knopf „💬/❓ Antworten AN + Frage (Korpus-Kopplung 23.B)" —
   zeigt Klaus die Heilung im Browser (Knopf statt Konsole).
5. Plan A1 abgehakt (headless) + Modul-Referenz korrigiert; dieser PULS-Eintrag.

**Smokes einzeln grün (ehrlich):** `smoke_bau23b_korpus.mjs` 24/24 (neu), `smoke_bau23b_query.mjs` 23/23,
`smoke_bau23_rendezvous.mjs` 55/55, `smoke_bau23_rendezvous_ui.mjs` 32/32, `smoke_bundle_connect.mjs` 21/21.
⚠️ `smoke_query_ueber_relais.mjs` **nicht ausgeführt** — braucht `fake-indexeddb`, in dieser Sandbox
nicht installiert (Sage hat keine package.json/node_modules). Umgebungs-Lücke, **nicht** von dieser
Änderung berührt; auf einer Node-Umgebung mit dem Paket läuft er wie zuvor.

**Offen / nächster sinnvoller Schritt:**
- **A2 (Live, zwingend Klaus):** zwei Apps über `wss://relay.family-projekt.de` — eine fragt „kuchen",
  die andere hat Antworten AN → bedeutungs-sortierte Treffer aus fremdem Inhalt. Relay in der Sandbox
  unerreichbar. Vorschlag Sage ↔ Mein-Mixarium (beide fahren Modul 23 live). Brief liegt.
- **Rollout der Härtung** (byte-gleich) in die anderen Modul-23-Apps (MR/MM/family) + dort `prepareCorpus`
  im Rendezvous-Init verdrahten — Folge-Schritt (diese Sitzung: Sage + Bundle).

## 2026-07-08 · Mycel-Karte v1.4 — Nach-Fusion (Klaus' Durchspiel-Befund: namenlose Knoten-Pillen)

**Klaus' Durchspiel-Lauf mit v1.3:** Fusion wirkt (keine Namens-Zwillinge mehr),
ABER zwei namenlose Pillen „Knoten SAri-w…"/„Knoten bGH3UB…" blieben stehen —
das sind die lebenden IDs von Sage/BLP, die über den KANAL (Handshake) ankamen,
BEVOR das Relais ihre Visitenkarte lieferte; v1.3 fusionierte nachträglich nicht.
**Fix v1.4 `migrateLiveNode()`:** trifft der Name später ein, wandert die
namenlose Pille samt Fäden (heat/active gerettet, Duplikat-Kanten verschmolzen)
restlos in die Seed-Pille; liveIdMap wird umgezogen. Headless-Browser-Test am
exakten Klaus-Szenario grün (2 namenlose Pillen → 0, Faden mitgewandert).
**Weitere Durchspiel-Befunde eingeordnet (kein Karten-Bug):** (1) Mixarium meldet
sich korrekt als „Mein Mixarium" an (sbkim-init.js) — „Mixarium als Rezeptbuch"
war Alt-Stand vor v1.3 bzw. die namenlose-Pillen-Verwechslung. (2) „Wer ist im
Raum zeigt meist nur Sage+BLP": Visitenkarten altern (30-Min-Frische) und die
EIGENE Karte wird nie gelistet — „Nur neu anmelden" frischt auf; Verhalten,
kein Verlust. (3) family-projekt.de: der Verbinden-Knopf sitzt auf der
Unterseite netzwerk.html (Nav „Netzwerk"), Domain und Repo sind dieselbe Seite.
**Analyse-JSON:** liegt in Klaus' Downloads — Sitzung kann sie erst lesen, wenn
Klaus sie in den Chat anhängt oder in den Obsidian-Vault legt (Git-Sync).

## 2026-07-08 · Mycel-Karte v1.3 — Namens-Fusion gegen Doppel-Pillen + Analyse-Rekorder 🔬

**Klaus' Live-Relais-Sichttest GRÜN mit Befunden** (7 Screenshots): Relais an,
echte „Hier bin ich"-Karten + Handshakes sichtbar (Ereignisse bis 48) — ABER
Doppel-Pillen („Mein Rezeptbuch"/„Mein Mixarium"/„BookLedgerPro" je 2×,
„Sage-Protokoll" neben Seed „Sage") und der aktive Cluster hing neben dem
statischen Stern. **Ursache:** v1.2 legte für jede lebende nodeId eine NEUE
Pille an, statt sie mit der Seed-Pille zu verschmelzen; der 30-min-Nachlauf
des REQ holte zudem alte Anmeldungen mit frischen IDs nach.
**Fix v1.3:** (1) **Namens-Fusion** — Presence-nodeName wird normalisiert auf
die Seed-Pille abgebildet (`SEED_ALIASES`), lebende IDs werden Aliasse EINER
Pille (Anzeige „×N" bei mehreren, z.B. Tablet+Handy); `liveIdMap` löst auch
Handshake-IDs auf → Fäden glühen jetzt an den richtigen Seed-Kanten
(Sage↔Rezeptbuch statt Zwillings-Cluster). Unbekannte Namen bekommen weiter
ehrlich eine eigene Pille. (2) **🔬 Analyse-Rekorder** (Klaus: „ich spiele alles
durch und du schaust zu"): Kopfleisten-Knopf Start/Stopp; zeichnet ALLE Roh-
Ereignisse auf (Relais/Kanal/Fenster/Fusion-Entscheidungen/Handshake-Auflösung
+ Start/Stopp-Schnappschüsse von Knoten/Kanten/liveIdMap); Stopp lädt
`mycel-analyse-<zeit>.json` herunter → Klaus schickt sie der Sitzung zur Auswertung.
**Headless-Browser-Test grün:** Fusion (3 bekannte Namen → 0 Zwillinge, ×2-Alias,
Fremd-App bekommt eigene Pille), Handshake landet an Seed-Kante, Rekorder-Download
mit Schnappschüssen, 0 Seitenfehler. **Klaus' Durchspiel-Lauf mit Rekorder steht aus.**

## 2026-07-08 · Mycel-Karte v1.2 — Relais-Lauscher 📡 + App-Leiste (Klaus' Befund: „Karte sieht meine Aktionen nicht")

**Klaus' Sichttest v1.1 GRÜN** (Demo, Optik, Themen). Sein Folge-Befund: Aktionen in
Andock-Tool/Suche/Pinnwand erscheinen nicht auf der Karte. **Diagnose (ehrlich):**
Knoten unversehrt (diese Sitzung hat keine App angefasst; Identitäten liegen in
Klaus' Browser-IndexedDB). Die Karte lauschte nur auf BroadcastChannel (gleiche
Origin, gleicher Browser) — aber Rendezvous/Modul-23-Andocks + Pinnwand laufen
übers NOSTR-RELAIS, und family-projekt.de ist eine andere Origin. Das Ohr saß
am falschen Kanal.
**Fix v1.2:** (1) **📡 Relais-Knopf** in der Kopfleiste — NUR LESEN, nutzer-
ausgelöst (Pilz-Werkzeug Schicht 2, kein Auto-Start = keine Pulsation): WebSocket
zu `wss://relay.family-projekt.de`, REQ kinds:[1] #t: sbkim-rdv/-anastomosis/
-anastomosis-reply/-query/-query-reply, since −30 min. Presence-Karten →
Knoten erscheint mit echtem nodeName + Puls; Handshakes → Kanten-Flash/aktiver
Faden; fail-soft (Relais weg → Hinweis, Karte läuft weiter). (2) **App-Leiste**
im Regler-Panel: 6 Mycel-Apps nebeneinander öffnen (je _blank) mit Hinweis,
in jeder App „🌐 Mit dem Netz verbinden" zu drücken — das „Hier bin ich" bleibt
bewusst Handarbeit (Verfassung: kein Auto-Funk beim Laden).
**Headless-Browser-Test grün:** App-Leiste 6/6 _blank, Relais-Fail-Soft (Sandbox
blockt wss — Label fällt sauber auf „Relais aus" zurück, 0 Seitenfehler), Karte
danach voll bedienbar. **Live-Relais-Sichttest wartet auf Klaus** (Sandbox kann
das echte Relais nicht erreichen — bekannte Grenze, siehe Modul 05b Kopf).

## 2026-07-08 · Mycel-Karte v1.1 + echter Browser-Test + Sage-Page-Knopf + PWA-Gründung

**Getan (Freibrief, Fortsetzung):** (1) **v1.1 der Karte** (PR #548): family-Themen
◐ Dunkel/Neon/Hell in der Kopfleiste (Farbwelten 1:1 aus family-project), Partikel-
Hintergrund mit Parallaxe/Funkeln (ohne three.js), Fäden bei etabliertem Handshake
dauerhaft kräftig in Akzentfarbe (heat-Puls bei Verkehr). (2) **Echter Browser-Test
(headless Chromium/Playwright)** fand die Wurzel von Klaus' DeX-Befund „Container
passt sich nicht an": `<canvas>` mit `inset:0` dehnt sich als replaced element NICHT —
Fix `width/height:100%` + `fitCanvas()`-Wächter pro Frame (DPR-Wechsel beim
Monitor-Umzug). Re-Test grün: 900→1700px sofort angepasst, Themen schalten, Probelauf
läuft, 0 Seitenfehler. (3) **Sage-Page-Knopf**: goldene Pille „🍄 Mycel-Live-Karte
öffnen ↗" unter der Modul-Topologie (Klaus' Platzwahl), `target=_blank` fürs
DeX-Zweitfenster. (4) **PWA-Gründung** in Klaus' neuem Repo `mycel-karte` (privat):
Karte + Manifest + SW (cache-first, relativ = umbenennungs-sicher) + generiertes
App-Icon + README mit Markt-Vision (family-project-App-Markt, nummerierte PWAs)
und Umbenennungs-Checkliste; Stand v1.1 nachgezogen (SW v2). **Klaus' Sichttest
der v1.1 + PWA-Installation stehen aus.**

## 2026-07-08 · Sichttest-Nachzug Mycel-Live-Karte: Pillen auf Obsidian-Maß (Klaus' Befund, DeX)

**Klaus' Sichttest (DeX-Chrome, live-deployte Seite): Karte läuft** — Kräfte-Graph, Regler,
Probelauf (Demo-Knoten schwebte korrekt herein) live bestätigt; ein anfängliches
Abschneide-Bild war laut Klaus ein DeX-Browser-Darstellungsproblem (Vollbild sauber).
**Befund:** Pillen in der Grundeinstellung zu groß — das Netz wird wachsen.
**Fix (dieser Nachzug):** Pillenradius Hub 20→9 / Knoten 13→5 (Obsidian-Maß), Labels
10px/dezenter, Fäden 0.8px, Halo/Ringe schlanker, SPRING_LEN 150→115 (kompakter),
Größen-Regler jetzt bis 3× (Spielraum nach oben), Start/Zurücksetzen zentriert
via `centerView()`. Headless: node --check grün. **Re-Sichttest wartet auf Klaus.**
**Parallel:** Klaus' neues Repo `mycel-karte` (privat) für die eigenständige
Mycel-Karten-PWA angelegt — Bau läuft in dieser Sitzung, Vision: Eingangs-App zum
family-project-App-Markt (nummerierte PWAs). Doku dort im README.

## 2026-07-08 · Bau Mycel-Live-Karte (`mycel-karte/`) — Klaus' Obsidian-Graph-Inspiration (Freibrief)

**Rolle:** Bau-Sitzung (Fortsetzung der Obsidian-Skills-Sitzung). **Branch:** `claude/obsidian-skills-integration-8pg6xy`. **Freibrief:** Klaus ausdrücklich („lege sofort los, alle Freiheiten, selbstständig merken/umsetzen").

**Auslöser:** Klaus sah im Obsidian-Graphen seines neuen Vaults dasselbe Knoten-und-Kanten-Muster wie im Mycel und wünschte: dieselbe lebendige Darstellung für Sage — mit Reglern (Pillengröße, Farben), Ton bei Aktionen (laut/leise), Vollbild, eigenes Fenster für den Zweitbildschirm (DeX), um z.B. Mixarium ↔ Rezeptbuch live agieren zu sehen.

**Gebaut:** `mycel-karte/index.html` — eigenständige Einzeldatei-Seite (kein Build, kein CDN, keine Fremd-Bibliothek; eigene Kräfte-Physik + Canvas):
- **Kräfte-Graph** mit den 8 bekannten Netz-Knoten (statischer Samen aus PULS/NETZ-STAND, ehrlich beschriftet) + bekannten Andock-Kanten; Pillen ziehbar, Rad/Pinch-Zoom, Hub verankert.
- **Lauscht NUR (Empfangsmodus, reine Anzeige, gatet nichts):** Fenster-Events `sbkim:alive/handshake/fremd-alert/postmessage/nostr-listening` + BroadcastChannel `sbkim` (`SBKIM_ANASTOMOSE_REQUEST/RESPONSE` mit from/to-Flash) + `sbkim-membrane`. Da alle Apps auf derselben Origin (`lausiklauskn-png.github.io`) laufen, sieht die Karte echten Cross-Tab-Verkehr. Lebende nodeIds werden als neue Pillen „Knoten abcdef…wxyz" ergänzt (ehrlich gekürzt, kein Namens-Raten).
- **Regler-Panel:** Pillengröße (0.5–2×), Ton-Lautstärke 0–100 (WebAudio-Töne: Anfrage-Tick, Handshake-Zweiklang, Ablehnungs-Brummen; 0 = stumm, erst nach Nutzer-Geste), drei Farbwähler (Pillen/Fäden/Hintergrund), Zurücksetzen, ⛶ Vollbild. Einstellungen persistiert (`localStorage sage_mycel_karte_settings`).
- **🎬 Probelauf-Knopf:** simulierte Ereignis-Sequenz, IMMER sichtbar als „PROBELAUF — simuliert" gebadged + gestrichelte Log-Einträge (Ehrlichkeit: kein Fake-Live).
- **Ereignis-Protokoll** unten links (letzte 40, aria-live), Kanal-Lampe + Ereignis-Zähler im Kopf.

**Verifiziert (headless):** Script-Block `node --check` fehlerfrei; Mini-Logik-Smoke 4/4 grün (edgeKey symmetrisch, hexToRgb + fail-soft, Live-ID-Kürzung). **Klaus' Browser-Sichttest UNGEPRÜFT — wartet auf Tablet-Lauf** (`https://lausiklauskn-png.github.io/Sage-Protokol/mycel-karte/` nach Merge).

**Bewusste Entscheidungen (Freibrief, dokumentiert):** (1) Eigenständige Seite statt Sage-Page-Einbau — der Mount auf der Sage-Page (Klick → eigenes Fenster) ist eigener Folge-Schritt mit eigenem Brief (`BRIEF_MYCEL_LIVE_KARTE_FOLGE.md`), um `index.html` nicht im Nebenscope anzufassen. (2) Handgebaute Physik statt vendoriertem D3 — ~80 Zeilen, hält die Einzeldatei-Disziplin. (3) Obsidians Graph-Code NICHT kopiert (proprietär) — nur das offene Force-Directed-Prinzip.

**Offen / nächste Schritte:** siehe `docs/sessions/BRIEF_MYCEL_LIVE_KARTE_FOLGE.md` (Sichttest → Sage-Page-Mount → Live-Cross-App-Beweis mit Karte im Zweitfenster).

## 2026-07-07 · Werkzeug-Übernahme: Obsidian Agent-Skills nach `.claude/skills/` (Klaus' Auftrag)

**Rolle:** Pflege-Sitzung (kein Modul-Code). **Branch:** `claude/obsidian-skills-integration-8pg6xy`.

**Getan:**
- Die fünf Agent-Skills aus [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)
  (MIT-Lizenz, Steph Ango/@kepano) **byte-gleich kopiert** nach `.claude/skills/`:
  `obsidian-markdown` · `obsidian-bases` · `json-canvas` · `obsidian-cli` · `defuddle`
  (je `SKILL.md` + Referenz-Dateien). Lizenz mitgenommen (`.claude/skills/LICENSE-obsidian-skills`),
  Herkunft + Pflege-Regel in `.claude/skills/README.md`.
- **Wirkung:** Claude-Code-Sitzungen an diesem Repo laden die Skills automatisch und können
  damit Obsidian-Formate erzeugen/bearbeiten (Obsidian-Markdown mit Wikilinks/Callouts,
  `.base`-Datenbank-Views, `.canvas`-Karten, Obsidian-CLI, Web→Markdown via defuddle).
- **Verifiziert (in der Sitzung):** Skills real angewendet — Beispiel-`.md`/`.canvas`/`.base`
  erzeugt und nach den Skill-Checklisten validiert (Canvas-JSON: IDs eindeutig + Kanten
  aufgelöst; Base-YAML parsebar; alles grün). Beispiele gingen als Dateien an Klaus,
  **nicht** ins Repo committet.
- **Ziel-Wahl dokumentiert:** Klaus wollte zunächst ein neues eigenes Repo; das Anlegen
  scheiterte an GitHub-Rechten (403, Integration darf keine Repos erstellen). Klaus'
  Zweit-Entscheid per AskUserQuestion: **Sage-Protokol**.

**Kein App-/Modul-Code berührt** — reiner `.claude/`-Zugang + diese PULS-Zeilen.
`tests/manual_check.html` unberührt (keine Prüfung nötig, keine Code-Änderung).

**Offen / nächster sinnvoller Schritt:** Nichts blockiert. Optional später: Skills-Kopie
per Pflege-Sitzung aktualisieren, wenn kepano das Quell-Repo weiterentwickelt
(Pflege-Regel in `.claude/skills/README.md`).

## 2026-07-06 · Bau 23.B — Cross-Knoten-Frage (Knoten fragt Knoten) + Such-UX-Runde in den Endknoten

**Rolle:** Hauptsitzung (Freibrief gilt). **Branch:** `claude/semantic-search-judge-fix-bqx85p` (netzweit gleicher Name in Sage/MR/MM/family/WorkFlohs).

**Getan (alles headless getestet, per Freibrief selbst gemergt):**
1. **Bau 23.B — bidirektionale Bedeutungs-Suche end-to-end (Modul 23):** neue Flächen `enableAnswering`/`disableAnswering`/`askNode` — ein Knoten stellt einem anderen LEBENDEN Knoten eine Suchfrage server-los über das Relais (Tag `sbkim-qry`), der Gegenknoten antwortet mit Top-k seiner lokalen Bedeutungs-Suche (Modul 04 `queryLocal`, app-registrierter Korpus). Tafel zuerst (INTERFACES §1 Modul 23 § Bau 23.B). Verfassungstreu: Fragen nutzer-ausgelöst, Antworten = Antwortrecht (Default AUS, bewusster Schalter, nicht persistiert); Schutz: qid-Dedupe + Rate-Limit 6/min + k-Cap 5 + Text-Kappung 300. **v1 ehrlich offen: Zettel unsigniert** (Identitäts-Wahrheit bleibt beim signierten Handshake + 0.80-Riegel; Antworten advisory) — Signatur = notierter Folge-Schritt. Smoke `smoke_bau23b_query.mjs` **23/23** (zwei vm-Instanzen + Mock-Relais); Regression bau23 55/55 + bau23_ui 32/32. UI: Frage-Feld + „💬 Antworten: an/aus" + „❓ Fragen" je Raum-Karte. Byte-Kopien: sbkim-bundle + MR + MM (+UI) + family (Modul; heilt dort den alten 23er-Drift vor `relatednessForCards`). **Live-Beweis (zwei Apps, echtes Relais) wartet auf Klaus.**
2. **Endknoten-Such-UX (MR #289/#290 + MM #99/#100 + Folge, alle gemergt):** 💡-Sinn-Suche hat jetzt sichtbaren Lade-Hinweis („wird vorbereitet … ~30 MB") + Vorab-Laden beim Einschalten + Zähler „✨ N nach Bedeutung" + **💡-Sinn-Badge** an Nur-Bedeutungs-Treffern; **⚖️ KI-Richter opt-in** (nutzt vorhandenen App-Schlüssel `claudeKey9m`/`mistralKey9m` bzw. `mxkey9m`, fail-soft auf gratis). Modul 04 netzweit: `anthropic-dangerous-direct-browser-access`-Header im claude-Richter (sonst CORS im Browser; Sage #539). WorkFlohs: Suchleiste jetzt auch im Kunden-Tab (Mein-WorkFloh #147 + Tomys-Hub #72, Parallel-Regel).
3. **Bestandsaufnahme aller 21 Session-Repos:** jede echte Sinn-Suche (Sage-Widget/Pinnwand, BLP, family-Markt, Point) hat bereits Lade-Hinweise; Muttis/Tresore = bewusst simple Textfilter; Kim-Repos leer. Nichts weiter zu übertragen.

**Befunde/offen:**
- **PULS.md ist >8000 Zeilen** — die 3000er-Schutz-Klausel ist gerissen; eigene Archiv-Pflege-Sitzung nötig (auslagern, nicht kürzen).
- Schnipsel-Mittel-Lead bleibt geparkt (dünne Marge 0.0188, Datenvertrag-Eingriff) bis das Netz mehr echte Knoten hat.
- Increment 2B (Widget-Schlüssel-Tresor + Auto-KI-Aufruf) + Increment 3 (Membran-Kopplung) = eigene Folge-Sitzungen (sicherheits-sensibel bzw. eigener Scope) — Brief liegt: `docs/sessions/BRIEF_BIDIREKTIONAL_LIVE_UND_INCREMENTE.md`.
- Klaus' Sichttests ausstehend: 💡/⚖️/Badge in MR+MM, Kunden-Suche WorkFlohs, **Bau 23.B live** (❓/💬 im Raum-Panel, zwei Geräte).

**Nachtrag 2026-07-07 — Discovery-Seite Schluss-Text (PR #543, gemergt):** Klaus fand den
Schluss-Bild-Text (`docs/discovery/index.html` § „Das gelebte Leben") als KI-geschrieben
erkennbar (er war die Bild-Generierungs-Beschreibung). Aus mehreren Chat-Vorschlägen hat
Klaus diesen Wortlaut freigegeben, 1:1 eingebaut: Überschrift „Wie tief das Leben verbunden
ist." + „Wer durch einen Wald geht, sieht viele einzelne Bäume, hört einen Bach, vielleicht
ein Tier. Was keiner sieht: die feinen Fäden, die das alles zusammenhalten." Reine
Text-Änderung, keine Byte-Kopien betroffen (grep leer). Sichttest = Lesen auf der Live-Seite.

## 2026-07-05 · Bedeutungs-Suche im normalen Suchfeld beider Endknoten (opt-in 💡, gratis/offline)

**Rolle:** Feature-Bau in den Endknoten-Apps (Klaus' Richtungswunsch). **Freibrief gilt.**
Klaus' Einwand nach dem 04.G-Fix: der Such-Nutzen gehöre **in das Suchfeld, das er
benutzt** (die Rezept-/Drink-Suche), nicht in ein verstecktes SBKIM-Tool — „damit ich
weniger suchen muss". Befund: das normale Suchfeld war reiner **Wort-Abgleich**
(`matchSQ` → `.includes`), fand also „Eierschecke" bei „Kuchen" NICHT.

**Gebaut (beide Apps identisch):** kleiner **💡-Schalter** (`#semBtn`) neben dem Suchfeld,
Default **AUS**, gemerkt in `localStorage` (Rezeptbuch `mrSemOn` / Mixarium `mxsem9m`).
AN = eine **semantische Suche** ergänzt Treffer nach **Sinn** (Modul 03 Embedding + Modul 04
`queryLocal({hybrid:true})`). `matchSQ` in `wordMatchSQ` (exakt, unverändert) + semantischen
Zusatz (`SEM_ON && SEM_IDS.has(r.id)`) getrennt. **Rein additiv/Inklusion** — Wortsuche
bleibt exakt + sofort, `alcAllowed`/Andock-Riegel/`PROVIDER_MIN_MATCH` unberührt, konsequent
**fail-soft** (jeder Fehler → reine Wortsuche).

**Effizienz-Kernentscheidung:** `embedPassage` cacht NICHT → der sbkim-init-Korpus-Provider
re-embeddet bei jedem Aufruf (langsam pro Tastendruck). Darum baut die App den Korpus **einmal
selbst** (`SEM_CORPUS`, gecacht, Signatur über die Rezept-id-Menge; ~30 MB Modell einmalig beim
ersten Einschalten) und reicht ihn per `options.corpus` an `queryLocal` — pro Suche wird nur die
**Anfrage** embeddet. Debounce 350 ms + Staleness-Guard (`SQ!==term`).

**Live:** Rezeptbuch **PR #288** (QC→`build.py`, `CACHE` mrz-v31→v32, index.html im SHELL-Precache)
· Mixarium **PR #98** (QC→index byte-identisch md5 `fdbd502…`, `SW_VERSION` v44→v45). Verifikation
headless: alle inline-`<script>` node --check sauber (Rezeptbuch 9/9, Mixarium 8/8), Semantik-Block
standalone node --check grün.

**Ehrliche Grenze:** das GRATIS-Netz wirft breiter und kann ohne den (opt-in) KI-Richter Lockeres
reinnehmen (0.80-Anisotropie-Boden, siehe LEHRE-Doc). Wortsuche bleibt exakt.

**Offen / nächster Schritt:** Klaus' **Browser-Sichttest** beider 💡-Schalter (fühlt es sich gut an?
Trennschärfe okay?). Danach je nach Rückmeldung: Sinn-Treffer-Kennzeichnung / strengeres Netz,
ODER KI-Richter (opt-in) an die App-Suche zum Schärfen, ODER RELATEDNESS_CENTER v2 (gratis).
Brief: `docs/sessions/BRIEF_NAECHSTE_SITZUNG_2026-07-05.md`.

## 2026-07-05 · Trennschärfe (Aufgabe 1): async-Provider-Bug in `queryLocalJudged` (Bau 04.G) gefixt

**Rolle:** Bau-/Fix-Sitzung (Branch `claude/cross-node-search-verification-nmt3bd`, von aktuellem
`main` #535). **Freibrief gilt.** Aufgabe 1 aus `BRIEF_NAECHSTE_SITZUNG_2026-07-02.md` (Trennschärfe
via opt-in KI-Richter).

**Prüf-Befund vor dem Bau (Klaus' Auftrag „prüf genau, wir sind schon weiter"):** Der Brief
empfahl, den KI-Richter in den Cross-Knoten-Antwort-Pfad einzubauen. Prüfung ergab: das ist
**schon gebaut** — `queryLocalJudged` (Bau 04.G, Strang A2) komponiert Vorfilter (`queryLocal`)
+ Richter (`hybridMatch`, opt-in/BYOK, fail-soft), ist exportiert, byte-kopiert (such-tool +
sbkim-bundle), im `op:"query"`-Empfänger von Modul 15 verdrahtet (`setQueryJudge`) und hat einen
Siegel-Aspekt. Kein Neubau nötig.

**Der echte Rest — ein LIVE-Bug (gefunden + gefixt):** `queryLocalJudged` löste den
registrierten Korpus-Provider **ohne `await`** auf (Z. ~1773) — exakt der async-Provider-Bug,
den PR #533 in `queryLocal` fixte, in der Schwester-Funktion 04.G aber übersehen wurde. Der
Cross-Knoten-Empfänger (Modul 15) übergibt `queryLocalJudged` nur die Richter-Config, **keinen
Korpus** → die Funktion nutzt den registrierten Provider, und der ist auf den Endknoten **async**
(baut den Korpus faul via Modul 03). Folge ohne Fix: ein Promise landet als Korpus in `queryLocal`
→ `InvalidCorpusError` → der Empfänger fällt auf eine **leere Fehler-Antwort** (`module-04c-query-failed`)
zurück. Heißt: sobald Klaus den KI-Richter live einschaltet, käme **nichts** statt geurteilter Treffer.

**Fix (rein additiv, Leitplanken unberührt):** `await` + try/catch (fail-soft parity mit
`queryLocal`) in `queryLocalJudged`, byte-1:1 in `src/modules/04_match.js` +
`such-tool/modules/04_match.js` + `sbkim-bundle/modules/04_match.js` (alle drei md5-gleich).
`PROVIDER_MIN_MATCH` (0.80) / Andock-Riegel (Modul 05) / PROTOCOL_VERSION unberührt.

**Tests:** Regressions-**Probe 8** (async Provider via `setLocalCorpus`, ohne `options.corpus`)
in `smoke_bau04g_query_local_judged.mjs` — vorher blind (alle Proben nutzten explizites `corpus:`).
Beweis geführt: gegen die un-gefixte Kopie wird Probe 8 rot (wirft), mit Fix **36/36 grün** (vorher 28).
Regressionsfrei: Drift-Guards such-tool 49/49 + sbkim-bundle 21/21, smoke_bau04c 45/45, 04d 68/68,
04f 32/32, 15b 35/35, 22 260/260, 22e 45/45, 22f 17/17.

**Endknoten-Rollout ERLEDIGT (gleiche Sitzung, Klaus-Freigabe „1"):** die Byte-Kopie
`sbkim/04_match.js` byte-1:1 aus der Sage-Quelle in **Mein-Mixarium (PR #97, SW mixarium-sw-v43→v44)**
+ **Mein-Rezeptbuch (PR #287, CACHE mrz-v30→v31)** nachgezogen, beide Branches sauber von `origin/main`
aufgesetzt (Rezeptbuch-Decoy-Falle umgangen). Diff je 0 zu Sage, await=2/non-await=0, Endknoten-Smokes
grün (Mixarium 14/14+7/7, Rezeptbuch 13/13+13/13), Mixarium index==QC md5 unverändert. Beide gemergt.

**Offen / nächster Schritt:** Klaus' **Browser-Sichttest** mit echtem Schlüssel — KI-Richter live
einschalten, „kuchen" → „Hühnerfrikassee" muss rausfallen. Der Fix greift jetzt auf allen drei
`main`-Deployments (Sage + beide Endknoten). Danach optional RELATEDNESS_CENTER v2 (gratis-Pfad).

## ✅ 2026-07-02 · MEILENSTEIN: Cross-Knoten-Antwort-Kette LIVE bewiesen (Klaus-Browser, Rezeptbuch)

**Rolle:** Bau-/Sichttest-Sitzung. Klaus hat die **komplette lokale Bedeutungs-Such-Kette
live in seinem Browser** (Rezeptbuch, Eruda-Konsole) bestätigt — der Endbeweis, den kein
Headless-Test liefern kann.

**Bewiesener Pfad (echte Daten):** `window.R` (47 echte Rezepte, via Live-Getter) →
`SbkimMatch.setLocalCorpus`-Provider baut den Korpus **faul** (Modul 03 e5-small,
384-dim, im Browser geladen) → `queryLocal("kuchen", {hybrid:true})` liefert **echte
Rezeptnamen** mit Score:
```
[MR-SBKIM] queryLocal-Korpus aus 47 Rezepten gebaut
TREFFER: Eierschecke 0.81 · Erdbeer-Joghurt-Torte 0.78 · Karottenkuchen 0.80 · Stollen 0.80 · Hühnerfrikassee 0.80
```
Damit sind **alle heute gebauten Teile live grün**: window.R-Getter, der `queryLocal`-
`await`-Fix (async-Provider), der Korpus-Provider, A1-Hybrid. Serverlos, im Browser.

**Weg dahin — drei Live-Befunde nacheinander gefixt (jeder nur im Browser sichtbar):**
1. Eruda-Blase versteckt → standardmäßig sichtbar gemacht (PR #91/#281).
2. `queryLocal` warf `Korpus muss ein Array sein, war: Promise` → **echter Vertrags-Bug**:
   async-Provider wurde nicht `await`et. Fix + Regressions-Probe 8c (PR #533/#92/#282).
3. Korpus „0 Rezepte" trotz `window.R.length`=70 → **alle 70 waren blank-Slots**; nach
   Rezept-Import 47 echte → Korpus baut korrekt. (Kein Bug — richtige Filterung.)

**⚠️ Ehrlich offen — Trennschärfe (Klaus' scharfe Beobachtung):** der Gratis-Cosinus hat
den bekannten Anisotropie-Boden ~0.80 — **„Hühnerfrikassee" landet bei 0.80 gleichauf mit
echten Kuchen**. Das Werkzeug **findet** die Kuchen (4/5 Treffer korrekt), kann Fremdes aber
nicht sauber **abweisen**. Trennschärfe ist die nächste Kalibrier-Baustelle (KI-Richter opt-in
/ RELATEDNESS_CENTER v2) — **Klaus-Entscheid 2026-07-02: erstmal so lassen, Meilenstein
sichern, Trennschärfe eigene Folge-Sitzung.** Passt zur LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.

## 2026-07-02 · Folge-Bau: window.R-Fix + Rezept-Korpus — Cross-Knoten-Antwort in beiden Endknoten funktional

**Rolle:** Bau-Sitzung (Branch `claude/sage-search-rollout-2tlm28`). Umsetzung der
Schritte 1–3 aus `BRIEF_KORPUS_WINDOWR_ENDKNOTEN.md` (Klaus-Auftrag „Folgebau 1,2,3").

**Behobene Lücke:** In beiden Endknoten lasen Korpus-Provider (+ Rezeptbuchs Domänen-Vektor)
`window.R`, aber `window.R` war **nie gesetzt** (top-level `let R` hängt nicht am window) →
Cross-Knoten-Korpus lief **live leer**. Der A1/A4-Empfänger antwortete daher trotz korrekter
Verdrahtung mit leerer Liste.

**Was gebaut (beide Endknoten, gemergt):**
- **Mixarium (PR #90):** `R` als LIVE `window.R` via `Object.defineProperty`-Getter (QC +
  `index.html` byte-identisch). Der bestehende Provider `buildMixariumQueryCorpus` (mit
  `text`-Feld seit PR #89) sieht damit echte Drinks. `SW_VERSION` v38→v39. Smoke
  `smoke_windowr.mjs` 7/7.
- **Rezeptbuch (PR #280):** derselbe `window.R`-Getter (QC → `build.py`-Rebuild) **+ neuer
  Rezept-Korpus-Provider** `buildRezeptbuchQueryCorpus` in `sbkim-init.js` (fehlte ganz):
  `{label, passageVec, text, anchorId}` aus Name+Geschmack+Zutaten+Kategorie, `text` für
  A1/BM25, lazy/fail-soft/Deckel 80/kein PII, Muster von Mixarium gespiegelt. `CACHE`
  mrz-v27→v28. Smoke `smoke_windowr_corpus.mjs` 13/13.

**Der Getter-Trick:** ein einmaliges `window.R = R` wäre stale (R wird beim Laden reassigned).
Der Getter `Object.defineProperty(window,'R',{get:()=>R})` schließt über die Bindung → liefert
immer das aktuelle R und repariert **alle** `window.R`-Leser (auch Rezeptbuchs `sampleContent`).

**Leitplanken:** `PROVIDER_MIN_MATCH` (0.80)/Andock-Riegel (Modul 05) unberührt, kein
PROTOCOL_VERSION-Bump, kein PII. Mixarium `index.html`==QC md5 verifiziert; Rezeptbuch
`index.html`==deterministischer build.py-Rebuild.

**⚠️ Offen — Klaus' Browser-Sichttest (Schritt 4, PFLICHT):** Von einem Knoten (Sage/
Rendezvous) eine cross-phrased Frage an Mixarium/Rezeptbuch stellen → kommen jetzt echte
Drinks/Rezepte bedeutungs-sortiert zurück? Erst dieser Live-Lauf beweist die Fütterung
(window.R populiert + ~30 MB Embedding). Bis dahin: headless grün, Live „ungeprüft".

## 2026-07-02 · KORREKTUR + Rezeptbuch-A1/A4-Rollout — „Rezeptbuch hat kein SBKIM" war FALSCH (Wrong-Branch-Artefakt)

**Rolle:** Bau-/Korrektur-Sitzung (Branch `claude/sage-search-rollout-2tlm28`). Auslöser:
Klaus' Hinweis, dass Rezeptbuch **immer wieder** falsch als „kein SBKIM" eingeschätzt wird.

**⚠️ Richtigstellung des Eintrags direkt darunter:** Die Aussage „Mein-Rezeptbuch trägt gar
kein SBKIM → nichts zu rollen" war **FALSCH**. Ursache — ein **wiederkehrendes Wrong-Branch-
Artefakt**: der auf GitHub eingestellte **Default-Branch von Mein-Rezeptbuch ist NICHT `main`**,
sondern ein toter **Vor-SBKIM-Branch** (`claude/recipe-book-app-update-fGP7B`, ohne `sbkim/`).
Automatisch angelegte Session-Branches (auch `claude/sage-search-rollout-2tlm28`) zweigen von
diesem Decoy ab und sind **bit-identisch** mit ihm → jede Sitzung, die den ausgecheckten Stand
liest, „sieht" kein SBKIM. **`main` trägt die volle SBKIM-Integration** (Module 00–08, 15, 16,
17, 18, 23, Briefkästen, Spore) — die **Modul-09-Migration hat längst stattgefunden**.

**Netzweite Lehre (verankert):** In `Mein-Rezeptbuch/CLAUDE.md` steht jetzt ganz oben eine
Pflicht-Regel „🚨 IMMER gegen `main` prüfen — der Default-Branch ist ein toter Decoy" (fetch
`origin/main`, Branch von `main` neu aufsetzen, nie gegen Default/Session-Branch urteilen).

**Was gebaut (Rezeptbuch, PR #279 gemergt) — additiv, fail-soft:**
- **Modul 04 byte-1:1 aus Sage** synchronisiert. Rezeptbuch stand auf Bau **04.A — OHNE
  `queryLocal`**. Der `op:"query"`-Empfänger (`15_membran.js`) rief also ein **fehlendes**
  `queryLocal` und antwortete stets `module-04c-not-available` — **echter Vertrags-Bug, jetzt
  behoben** + A1/A4-Fähigkeit (BM25/`queryLocalMulti`/`expandQuerySimple`) dazu.
- `15_membran.js` — fail-soft `queryWithInclusion` (A4 koch-eigene Synonym-Karte → A1 Hybrid-
  Multi → Cosinus) im Empfänger.
- `app-sw.js` CACHE `mrz-v26`→`mrz-v27`. `index.html`/QC unberührt (nur separate `sbkim/*.js`,
  Rebuild deterministisch identisch verifiziert).
- Headless-Smoke `Mein-Rezeptbuch/tests/smoke_rollout_a1a4.mjs` **13/13 grün**.

**⚠️ Offen (Folge-Bau, Klaus-Entscheid „jetzt mergen + Korpus als Folge-Bau, Mixarium mit
aufnehmen"):** Voll funktional wird die Cross-Knoten-Antwort erst mit einem **Rezept-Korpus**,
den `sbkim-init.js` noch **nicht** anlegt (`SbkimMatch.setLocalCorpus` fehlt). Dazu die
**latente `window.R`-Lücke**: `window.R` wird **nirgends zugewiesen** (top-level `let R`),
obwohl mehrere Stellen es lesen (auch der Domänen-Vektor `sampleContent`) → Korpus/Content
sehen zur Laufzeit `[]`. **Betrifft Mein-Mixarium gleichermaßen** (dessen Korpus-Provider,
2026-06-28 gebaut, liest ebenfalls `window.R` → vermutlich leerer Korpus live). Folge-Bau:
`window.R` sauber exponieren (Live-Getter, übersteht Reassignment) + Rezept-Korpus-Provider
in beiden Apps + Klaus' Browser-Test. Brief unten.

## 2026-07-02 · A1/A4-Rollout in die Endknoten — Mixarium gebaut+gemergt, Rezeptbuch+Pinnwand geprüft/begründet

**Rolle:** Bau-/Rollout-Sitzung (Branch `claude/sage-search-rollout-2tlm28`). Brief:
Rollout der App-Integration (A1 Hybrid + A4 Multi-Query, PR #528) in die Endknoten.
Freibrief gilt. **Kern-Befund:** die drei Rollout-Ziele haben sehr unterschiedliche
Ausgangslagen — nur eines trägt einen SBKIM-Such-Pfad, den A1/A4 verbessern.

**Investigation (die Voraussetzung fürs „prüfen ob einzubauen"):**
- **Mein-Mixarium** — trägt Modul 04 (`sbkim/04_match.js`, war stale bei Bau 04.D). Sein
  **einziger** SBKIM-Such-Pfad ist der **Cross-Knoten-Antwort-Empfänger** (`op:"query"` in
  `sbkim/15_membran.js`) + der Korpus-Provider (`sbkim/sbkim-init.js`). **Kein** nutzer-
  sichtbares SBKIM-Suchfeld (die Drink-Suche der App ist reiner Textfilter, nicht SBKIM).
  → A1/A4 gelten dem **Antwort-Pfad** (Mycel-Kern-Nutzen: Cross-Knoten-Suche). **ROLLOUT.**
- **Mein-Rezeptbuch** — ~~trägt gar kein SBKIM~~ **← FALSCH, siehe Korrektur-Eintrag oben
  (2026-07-02 Wrong-Branch-Artefakt).** Diese Aussage entstand, weil gegen den Session-/
  Default-Branch statt gegen `main` geprüft wurde. **`main` trägt volle SBKIM-Integration;
  Modul-09-Migration längst erfolgt. A1/A4 dort ausgerollt (PR #279).**
- **Pinnwand** (`pinnwand/`) — trägt Modul 03 (Embedding) + inline **whitened Cosinus**-
  Rangfolge + opt-in KI-Richter; **kein Modul 04**, **keine 0.80-Schwelle** (zeigt ALLE
  Einträge, nur sortiert). → A1s Gewinn ist **INKLUSION über einen Filter-Boden** — den es
  in der Pinnwand nicht gibt (nichts wird ausgeschlossen). A4 (Synonym-Varianten) dupliziert,
  was das reine Bedeutungs-Embedding schon leistet, und widerspräche der Pinnwand-These
  „Bedeutung über Stichwörter". → **Bewusst ausgelassen** (kein Nutzen, würde Design
  verwässern). Ehrliche Beschriftung (Cosinus=Rangfolge) steht bereits (PR #498).

**Was gebaut (Mixarium, additiv, minimal-invasiv) — PR #89 gemergt:**
- **A1** — `sbkim/04_match.js` **byte-1:1 aus Sage `src/modules/04_match.js`** synchronisiert
  (reiner additiver Superset: BM25/`queryLocalMulti`/`expandQuerySimple` dazu, keine app-
  eigenen Änderungen — byte-bewiesen durch Sages `smoke_bau22f`/`smoke_bau04f`).
- `sbkim/sbkim-init.js` — Korpus-Items tragen jetzt ein `text`-Feld (roher Passage-Text),
  damit BM25 Zutaten/Geschmack trifft, nicht nur den Drink-Namen.
- `sbkim/15_membran.js` — neuer fail-soft-Helfer `queryWithInclusion` (A4 Synonym-
  Auffächerung über kleine getränke-eigene `MX_QUERY_SYNONYMS` → A1 Hybrid-`queryLocalMulti`
  mit RRF; Stufe für Stufe Rückfall Multi → Hybrid-Single → einfacher Cosinus). Der
  `op:"query"`-Empfänger nutzt ihn.
- `app-sw.js` — `SW_VERSION` v37→v38 (Cache-Bust der geänderten Modul-Dateien).

**Leitplanken gewahrt:** REINE INKLUSIONS-Verbesserung — `PROVIDER_MIN_MATCH` (0.80) =
Vektor-Boden UND Andock-Riegel (Modul 05) **unberührt**, kein PROTOCOL_VERSION-Bump, kein
Netz/LLM. `index.html` == `QC_Mixarium_20_04_26.html` byte-identisch **unverändert** (nur
separate `sbkim/*.js` geändert, keine `<script>`-Tags). Kern-Module nicht angefasst.

**Tests:** Neuer Headless-Smoke `Mein-Mixarium/tests/smoke_rollout_a1a4.mjs` **14/14 grün**
(gegen Mixariums AUSGELIEFERTES Modul 04) — Cross-Phrasing-Rettung („limo"→„limonade" via
BM25-Variante bei orthogonalem Cosinus), fail-soft bei fremder Frage, Rückwärts-Kompatibilität
für Korpus ohne `text`. `node --check` alle geänderten Dateien grün. Sage-Quelle unberührt →
Drift-Guards weiter grün (`smoke_standalone_such_tool` 49/49, `smoke_bundle_connect` 21/21,
`smoke_bau22f` 17/17). **Browser-Sichttest (live Cross-Knoten-Antwort) wartet auf Klaus**
(Mixarium `main` deployt, PR #89 gemergt).

**Offen / nächster Schritt:** (1) Klaus' Live-Sichttest der Mixarium-Cross-Knoten-Antwort.
(2) Rezeptbuch bleibt ohne SBKIM — falls es je ein Mycel-Knoten werden soll, ist das eine
eigene Modul-09-Migrations-Sitzung. (3) Optional A4-Aufsatz LLM-Varianten-Generator (BYOK,
opt-in) in Sage Modul 22 — als eigene Folge-Sitzung.

## 2026-07-02 · App-Integration A1 (Hybrid) + A4 (Multi-Query) ins Suchfeld (Modul 22)

**Rolle:** Bau-Sitzung (Branch `claude/sage-app-integration-a1-a4-f4dy8b`). Brief:
`docs/sessions/BRIEF_A_APP_INTEGRATION.md`. Freibrief gilt (Sofort-Start, kein „1/2/3/4?").
Die zwei gemessen-positiven Hebel (A1 Bau 04.F, A4 Bau 04.H) endlich ins echte Suchfeld
verdrahtet, damit Nutzer den Vorteil bekommen.

**Was getan (additiv, minimal-invasiv):** In `src/modules/22_such_widget.js` die
Sortiermaschine `queryCorpus` (bisher `queryLocal(q, k, {corpus})` — reiner Cosinus)
umgebaut:
- **A1:** Vorfilter auf **`{corpus, hybrid:true}`** (BM25+Vektor-Fusion) gehoben. Fail-soft:
  ohne `text`-Feld fällt BM25 in Modul 04 auf `label` zurück.
- **A4:** vor der Suche `expandVariants()` → `match.expandQuerySimple(q, {synonyms})` mit
  einer **kleinen, app-eigenen Synonym-Karte** (`DEFAULT_SYNONYMS`, bidirektional, Rezept-/
  Getränke-Domäne + allgemeine Umschreibungen), dann **`queryLocalMulti(varianten, k,
  {corpus, hybrid:true})`** (RRF-Fusion) statt `queryLocal`. Ohne `queryLocalMulti` fällt es
  auf hybrid-`queryLocal` zurück; bei jedem A1/A4-Fehler auf den einfachen Cosinus-Pfad.
- Gilt einheitlich für App-, Knoten- **und** Internet-Korpus (alle über `queryCorpus`).
- `init({synonyms})` ersetzt die Default-Karte (App kennt ihre Domäne besser);
  `init({queryExpand:false})` schaltet A4 ab (hybrid bleibt). Neue `_meta`-Marker
  `hybridPrefilter/queryExpand/synonymCount`.
- Byte-Kopie `such-tool/modules/22_such_widget.js` mitgezogen (Drift-Guard byte-1:1);
  `such-tool/sbkim-sw.js` `CACHE_VERSION` v1→v2 (Modul 22 wird cache-first precacht).

**Leitplanken gewahrt:** REINE Vorfilter-/Anzeige-Verbesserung — `PROVIDER_MIN_MATCH`
(0.80) + Andock-Riegel (Modul 05) **unberührt**, kein PROTOCOL_VERSION-/DB_VERSION-Bump,
KI-Richter (`richterRerank`, A2) bleibt unverändert daneben (opt-in). Kern-Module 04/05
nicht angefasst (nur öffentliche Flächen genutzt). Der Widget-End-Sort bleibt Cosinus —
der Gewinn ist **INKLUSION** (cross-phrased Treffer, die der 0.80-Cosinus-Boden ausschließt,
werden über den BM25-Pfad AUFGENOMMEN), nicht Umsortierung.

**Tests:** Neuer Headless-Smoke `tests/smoke_bau22f_app_integration.mjs` **17/17 grün** —
Cross-Phrasing-Rettung (Frage „torte" findet Doku „kuchen"; Kontrolle: reiner
`queryLocal('torte',hybrid)` rettet 0) + Spy beweist `queryLocalMulti({hybrid:true})` mit
Synonym-Variante + fail-soft (`queryExpand:false`, Leer-Frage). Regress-frei:
`smoke_bau22` 260/260, `smoke_bau22e` 45/45, `smoke_bau04f` 32/32, `smoke_bau04d` 68/68,
Drift-Guards `smoke_standalone_such_tool` 49/49, `smoke_bundle_connect` 21/21.
**Browser-Sichttest wartet auf Klaus** (nach Merge live; Pages deployt von main).

**Offen / nächster Schritt:** Rollout byte-gleich in `pinnwand/` (hat KEIN Modul 04 —
prüfen ob sinnvoll) + Endknoten-PWAs Mixarium/Rezeptbuch (eigenes Suchfeld — separat
prüfen ob A1/A4 passt). LLM-Varianten-Generator (A4 opt-in-Aufsatz, BYOK) später.

## 2026-07-02 · Namens-Tafel — „Kim"-Produktfamilie festgehalten

**Rolle:** Pflege-Sitzung (Branch `claude/pinnwand-spelling-fix-2ikwzy`).
**Was getan:** Auslöser war Klaus' Rechtschreib-Prüfung „Pinwand vs. Pinnwand".
Befund: der gesamte App-/Doku-Inhalt nutzt bereits durchgehend **„Pinnwand" (zwei n)**
— 364 Treffer, 0× falsches „Pinwand"; einziges Ein-n „Pinwand" ist der **leere Repo-Name**.
Daraus wurde ein Branding-Gespräch: Dachmarke **Kim** (aus KI-Matching/SBKIM),
Regel `Kim` + kurzes hartes Wort. Festgelegt: **Kimboard** (Pinnwand-App),
**Kimseek** (Suche/Modul 22), **Kimsync** (Finden & Verständigen), Merge-Name
**Kim**/**Kimhub** offen. Zwei-Ebenen-Prinzip: Protokoll bleibt Mycel/Spore,
Apps tragen die Kim-Marke (Fruchtkörper-Schicht). Neue Tafel:
[`docs/NAMENSGEBUNG_KIM_FAMILIE.md`](NAMENSGEBUNG_KIM_FAMILIE.md).
**Was offen:** (1) Klaus benennt leeres Repo `Pinwand` → `Kimboard` in GitHub-Settings
(kein Rename-Zugriff aus der Sitzung). (2) App-Inhalts-Umbenennung Pinnwand→Kimboard
aufgeschoben ins eigene Kimboard-Repo. (3) Web-Freiheits-Check für Kimseek/Kimsync/Kimhub.
**Nächster Schritt:** Namens-Freiheit von Kimseek/Kimsync prüfen, wenn Klaus grünes Licht gibt.

## 2026-07-01 · A4 — Query-Expansion / Multi-Query in Modul 04 (Strang A, additiv)

**Rolle:** Bau-Sitzung (Branch `claude/semantic-matching-quality-a3-jb0aut`). Nächster Hebel
A4 nach A1 (positiv gemessen) + A3 (negativ gemessen). Klaus wählte „1" (A4 bauen).

**Was getan (Bau 04.H, additiv):**
- `expandQuerySimple(text, {synonyms?, maxVariants?})` — freie/offline Varianten-Erzeugung
  (Original zuerst, dedupe, Deckel; ohne Synonym-Karte → `[text]`; kein Netz/LLM).
- `queryLocalMulti(queries, k, options)` — sucht mit JEDER Variante (`queryLocal`, options
  inkl. `hybrid` durchgereicht) und verschmilzt die Rang-Listen via **RRF** (dieselbe Fusion
  wie A1, nur über Varianten). `score` = bester Cosinus, `matchedQueries` = #Varianten;
  fail-soft je Variante (werfende Variante übersprungen).
- **Leitplanken:** bestehende `queryLocal`/hybrid-Pfade **byte-gleich**; `PROVIDER_MIN_MATCH`
  (0.80) + Andock-Riegel (Modul 05) unberührt; **kein** PROTOCOL_VERSION-/DB_VERSION-Bump.
- **Panel 04 „A4-NACHMESSUNG"**-Knopf (deterministischer Hash-Mock, lokal gesichert+restauriert,
  andere Tests unberührt) misst, wie viele Ziele die Multi-Query rettet, die die Einzel-Frage
  verpasst. Cache-Bust `?v=a4-20260701`.
- **Tests:** Headless `tests/smoke_a4_query_expansion.mjs` **16/16 grün**; Regression
  04a/04c/04d/04e/04f/04g grün; Drift-Guards such-tool (49/49) + sbkim-bundle (21/21) byte-1:1
  (Modul 04 byte-kopiert; pinnwand hat kein Modul 04). Doku: INTERFACES §1 Modul 04, Karte 04.

**GEMESSEN POSITIV (Klaus, Browser 2026-07-01, Panel 04 A4-NACHMESSUNG):** Multi-Query rettet
**4/4** Ziele, die die Einzel-Frage (andere Formulierung) verpasst (z. B. „auto reparatur" →
„kfz reparatur"). Dritter gemessener Hebel: **A1 positiv (4/4), A3 negativ (Δ −0.11), A4 positiv
(4/4)** — A1 und A4 wirken beide durch einen ZUSÄTZLICHEN Zugang zum Treffer, A3 drehte am selben
Signal und verschlechterte.

**Ehrlich offen:** die freie Synonym-Karte ist begrenzt; der starke Varianten-Generator wäre ein
**opt-in LLM-Aufsatz** (BYOK) — die Fusion (`queryLocalMulti`) bleibt gleich. **Nächster Schritt:**
App-Integration im Suchfeld (Modul 22) mit Synonym-Karte und/oder opt-in LLM-Generator; oder A5/A6
bzw. App-UX-Wünsche.

## 2026-07-01 · A3 — Contextual Chunking in Modul 03 `embedContentVector` (Strang A, additiv)

**Rolle:** Bau-Sitzung (Branch `claude/semantic-matching-quality-a3-jb0aut`). Nächster Hebel
A3 nach A1 (Hybrid BM25+Vektor) + A2 (KI-Richter im Antwort-Pfad). Klaus-Freibrief für die
Sitzungs-Entscheidung („entscheide selber, solange sinnvoll und logisch").

**Was getan:**
- `embedContentVector` (Modul 03) bekommt **additiven Kontext-Vorspann**: `opts.context`
  (global) + pro-Schnipsel `{ …, context }` (überschreibt global) stellt jedem Inhalts-
  Schnipsel VOR dem Einbetten einen kurzen Domänen-/Dokument-Kontext voran (Anthropic
  „Contextual Retrieval", deterministisch/offline/gratis). Ohne Kontext **byte-gleiches**
  Verhalten (Rückwärts-Kompat bewiesen). Rückgabe-Feld `contextUsed`; Test-Brücke
  `_assembleContentTexts` (reine Text-Assemblierung, headless prüfbar).
- **Leitplanken gewahrt:** gatet nichts, `PROVIDER_MIN_MATCH = 0.80`/Andock-Riegel (Modul 05)
  unberührt, **kein** PROTOCOL_VERSION-/DB_VERSION-Bump, **kein** Spore-Feld.
- **Panel 04 „A3-NACHMESSUNG"**-Knopf (Browser): Baseline (ohne Kontext) vs. A3 (mit
  Domänen-Vorspann) über dieselbe Mittelung + zentrierten Cosinus (`relatedness`, v1),
  zeigt Lücken-Delta. Reine Messung, setzt keine Konstante. Cache-Bust `?v=a3-20260701`.
- **Tests:** Headless `tests/smoke_a3_contextual_chunking.mjs` **20/20 grün**; Rückwärts-
  Kompat `smoke_inhaltstreuer_domainvektor.mjs` **25/25 grün**; Drift-Guards such-tool
  (49/49) + sbkim-bundle (21/21) + pinnwand (60/60) byte-1:1 grün (Modul 03 byte-kopiert).

**GEMESSEN (Klaus, Browser, 2026-07-01 Abend): NEGATIV.** Panel 04 `A3-NACHMESSUNG` mit echten
transformers.js-Vektoren: Baseline-Lücke −0.0135, A3-Lücke −0.1210, **Δ −0.1075 → A3
verschlechtert die Trennung.** Ursache: pro-Knoten unterschiedliche Domänen-Vorspänne schieben
auch echte Verwandte (rezept↔mix) auseinander; die Anisotropie ist durch keinen gratis Cosinus-
Trick am Domänen-Zentroid heilbar (der „verwandt"-Weg bleibt der KI-Richter). **Konsequenz:** A3
wird **NICHT** netzweit verdrahtet, bleibt harmloses additives opt-in-Werkzeug (byte-gleich ohne
Kontext). Ehrlicher Negativ-Befund wie beim v2-Center. Doku: LEHRE § „Stand 2026-07-01 (Abend) —
A3 im Browser gemessen: NEGATIV". **Nächster Hebel: A4 (Query-Expansion), orthogonaler Recall-Hebel.**

**Kontrast A1 GEMESSEN POSITIV (Klaus, Browser 2026-07-01, neuer Panel-04-Knopf A1-NACHMESSUNG):**
Hybrid BM25+Vektor rettet **4/4** Wort-Treffer unter dem 0.80-Vektor-Boden, die die reine Vektor-
Suche verliert — **0 Fehl-Rettungen** (Kontroll-Fall ohne Wort-Bezug korrekt NICHT gehoben). Der
saubere Beweis, dass A1 verbessert (zweites Signal dazu), während A3 verschlechtert (am selben
Signal gedreht). A1-NACHMESSUNG-Knopf deterministisch (Mock wie Test 20, kein Modell-Lade).

**Nächster sinnvoller Schritt:** (1) Klaus: Panel 04 Baseline + A3-NACHMESSUNG im Browser
laufen lassen → Delta ablesen. (2) Bei positivem Delta: `embedContentVector`-Aufrufer
(Modul 02 `regenerateOwnSpore`-Pfad / Andock) optional mit Knoten-Titel als Kontext
verdrahten (eigene Folge-Sitzung, netz-koordiniert). (3) family-project OCR-Rollout
(Strang B2, offener „nicht vergessen"-Faden).

## 2026-07-01 · B2-Rollout — OCR ins Such-Widget (Modul 22) + Sage Such-Tool

**Rolle:** Bau-Sitzung (Branch `claude/b2-ocr-suchwidget`). Strang-B2-Rollout App 3/5 (Sage
Such-Tool), nachdem App 1 (Mein-Rezeptbuch #273) + App 2 (Mein-Mixarium #85) live sind.

**Was getan:** Modul 22 (Such-Widget) bekommt einen **📷-OCR-Knopf** neben dem 🎤-Sprach-Knopf —
**Foto/Handschrift → Suchtext** via Modul 24 (`SbkimOcr`), im selben Muster wie die Sprach-Eingabe.
Öffnet Datei-Wähler → Mistral OCR (EU, BYOK, Schlüssel RAM-only via prompt) → `appendToField` hängt
den erkannten Text ans Suchfeld. EU-Politik des Widgets (`optEuPolicy`) gilt; konsequent fail-soft
(kein Modul 24 / kein Schlüssel / Fehler → Hinweis, kein Throw). Modul 24 nach `such-tool/modules/`
byte-kopiert + in `such-tool/index.html` geladen; Sage-Page lädt Modul 24 bereits (aus B1).

**Beweis (headless):** `smoke_bau22` **260/260** (+3 Proben: OCR-Knopf gerendert / Klick ohne Modul 24
wirft nicht / „Modul 24"-Hinweis). Drift-Guard `smoke_standalone_such_tool` **49/49** (Modul 24 als
Pflicht-Datei + byte-1:1 + im index.html geladen). `smoke_bau22e` 45/45, `smoke_bundle_connect` 21/21.
`node --check` 22 grün.

**TABU:** rein additiv (DOM-Knopf + fail-soft-Handler), kein Eingriff in Suche/Match/Andock; Modul 24
nur über öffentliche `recognize`-Fläche; kein Schlüssel im Code, kein PII.

**Nächster Schritt:** B2 App 4 (Pinnwand) + App 5 (BookLedgerPro, EU-Option neben Google Vision).
Browser-Sichttest (📷-Knopf im Widget + Mistral-Schlüssel) wartet auf Klaus.

## 2026-07-01 · Modul 24 — OCR-/Bild-Eingabe (Strang B1, Geschwister von Modul 21)

**Rolle:** Bau-Sitzung (Branch `claude/b1-ocr-eingabe-modul`, von frischem `main`). Klaus: „weiter"
→ gewählt: **Strang B1**, das OCR-Eingabe-Modul.

**Was getan:** neues `src/modules/24_ocr_eingabe.js` (`SbkimOcr`) — input-agnostische Bild/Handschrift-→-
Text-Schicht, **1:1 nach dem Muster von Modul 21**. Liefert nur Text; Suche (03/04) unberührt. Drei
steckbare Anbieter: **`mistral`** (Mistral OCR `mistral-ocr-latest`, EU, **Favorit**) · `google` (Cloud
Vision EU-Endpunkt, `DOCUMENT_TEXT_DETECTION`) · `browser` (Shape Detection, experimentell). EU-Politik
`frei`/`bindend` per Knoten; konsequent **fail-soft** (kein Schlüssel/Bild/Netz/HTTP → deutscher Hinweis,
kein Throw außer `InvalidEuPolicyError`); **BYOK, kein Schlüssel im Code, kein PII**. Surface
`init/getProviders/availableProviders/pickProvider/isFileSupported/isBrowserOcrSupported/recognize/
recognizeBrowser/ocrErrorHint`. `index.html` lädt das Skript (KEIN Auto-Init); Panel 24 in
`manual_check.html` (3 Logik-Knöpfe + Live-Knopf „OCR erkennen": Bild wählen + Anbieter/Schlüssel via
prompt → Text ins Feld). Karte 24 + `status.json` (Modul 24, `score:"stub"`) + Pie regeneriert (26 Module)
+ CLAUDE.md-Modul-Tabelle nachgezogen.

**Beweis (headless):** `tests/smoke_bau24_ocr_eingabe.mjs` **41/41 grün** (Export/Meta, EU-Politik +
pickProvider, isFileSupported, Mistral-/Google-Happy-Path + Request-Bau, data-URL-Entpackung, Fail-soft
×4, bindend-schließt-browser-aus, InvalidEuPolicyError, ocrErrorHint, Browser-fail-soft, init-euPolicy).
`node --check` grün, Panel-24-Inline-Skript validiert.

**TABU:** `PROVIDER_MIN_MATCH`/0.80-Andock-Riegel unberührt, kein PROTOCOL_VERSION-/DB_VERSION-Bump,
kein Eingriff in andere Module.

**Offen / nächster Schritt:** (1) Browser-Sichttest Panel 24 (+ echter Mistral-Schlüssel) — wartet auf
Klaus. (2) **INTERFACES.md §1 formaler Modul-24-Eintrag** als Folge-Pflege (Leaf-Modul, kein Modul hängt
dran — bewusst nachgezogen, nicht stillschweigend ausgelassen). (3) **Strang B2**: Rollout byte-gleich in
die Apps (Such-Tool/Pinnwand, Mixarium/Rezeptbuch, family-project, BLP als EU-Option) — braucht Klaus'
Reihenfolge-Wahl.

## 2026-07-01 · Modul-15-Verdrahtung — KI-Richter im Cross-Knoten-Antwort-Pfad (Strang A2, Folge)

**Rolle:** Bau-Sitzung (Branch `claude/a2b-membran-judged-verdrahtung`, von `main` nach 04.G-Merge).
Klaus: „Weiter" → gewählt: die Modul-15-Verdrahtung von `queryLocalJudged` (der logische Anschluss).

**Was getan:** der `op:"query"`-Empfänger in `src/modules/15_membran.js` (Membran Sub b) nutzt jetzt
**opt-in** den KI-Richter. Neue Konfig `queryJudge` (Default `null` = AUS → byte-gleich, roher
`queryLocal`); gesetzt via `init({queryJudge:{apiKey,…}})` ODER Setter `setQueryJudge(cfg)` → Empfänger
ruft `SbkimMatch.queryLocalJudged` (Vorfilter + Richter, BYOK, fail-soft) und antwortet mit der
umsortierten Kandidaten-Liste. Schlüssel RAM-only/nie im Code; `_meta.queryJudgeConfigured` (Boolean,
kein Leak). Pflicht-Aspekt in `16_siegel.js` `ZERTIFIKAT_ASPEKTE` ergänzt (Schutz-Modul-Konvention).
Karte 15 + INTERFACES §1 nachgezogen.

**Beweis (headless):** `tests/smoke_bau15b_membran.mjs` **35/35 grün** (+4 A2-Proben: Flag konfiguriert /
Richter-Pfad genutzt / setQueryJudge(null)-Reset / roher Vorfilter ohne Richter). `node --check` 15+16 grün.

**Branch-Hygiene-Notiz:** die Sitzung hatte den Branch versehentlich von stale `origin/main` (nur bis
04.F) abgezweigt; vor dem Commit auf frisches `main` (inkl. 04.G) rebased (stash → checkout -B → pop,
konfliktfrei), sonst hätte `queryLocalJudged` gefehlt.

**TABU:** `PROVIDER_MIN_MATCH` (0.80) + 0.80-Andock-Riegel (Modul 05) unberührt; Modul 04 nur über die
öffentliche `queryLocalJudged`-Fläche genutzt (kein Eingriff); kein PROTOCOL_VERSION-/DB_VERSION-Bump.

**Was offen / nächster Schritt:** Browser-Sichttest (reine Empfänger-Logik; optionaler Panel-15-Knopf
als Folge-Pflege). Damit ist die antwortende Seite (queryLocal → Hybrid → Richter) komplett. Danach:
Strang B1 (OCR-Modul) oder A3 (Schnipsel-Chunking) — Klaus' Wahl.

## 2026-07-01 · Bau 04.G — queryLocalJudged (Strang A2: KI-Richter fest im Antwort-Pfad)

**Rolle:** Bau-Sitzung (Branch `claude/a2-queryjudged-verankerung`, von `main` nach A1-Merge).
Klaus: „entscheide selber" → gewählt: **Strang A2** als direkte Fortsetzung von A1 auf demselben
Strang (Trefferqualität, antwortende Seite), sauber in Modul 04 (keine Modul-Vermischung).

**Was getan:**
- Neue async-Funktion `queryLocalJudged(text, k, options?)` in `src/modules/04_match.js` — komponiert
  **Vorfilter** (`queryLocal`, A1-Hybrid durchgereicht) + **Richter** (`hybridMatch`, opt-in/BYOK):
  1. queryLocal liefert lokale Top-k (server-los). 2. Nur mit `options.apiKey` urteilt der Richter über
  die Finalisten und sortiert um (`passt` zuerst, dann Richter-Score). 3. Fail-soft: kein Schlüssel /
  leerer Vorfilter / Richter nicht erreichbar → roher Vorfilter, kein Throw.
- Richter beurteilt den Passage-**Text** → queryLocalJudged löst den Korpus identisch zu queryLocal auf
  und baut die Text-Karte (anchorId bevorzugt, sonst label). Treffer tragen additiv
  `passt`/`judgeScore`/`begruendung`; `score` bleibt der Cosinus. Bezeugung (`attestation`) durchgereicht.
- **Kein anderes Modul angefasst** — die Verdrahtung in Modul 15 (`op:"query"`-Empfänger) bleibt eigener,
  klar abgegrenzter Folge-Schritt. `_meta` + Selbstcheck + Doku (Karte 04, INTERFACES §1) nachgezogen.
  Byte-Kopien `such-tool/` + `sbkim-bundle/` mitgezogen (Drift-Guard grün). Panel 04 **Test 21**.

**Beweis (headless):** neuer `tests/smoke_bau04g_query_local_judged.mjs` **28/28 grün** (Opt-in-aus ohne
fetch-Call, leerer Vorfilter, Richter-Umsortierung + Bezeugung, Fail-soft, Passage-Text erreicht Richter,
Hybrid-Durchreichung). Regression 04c/04d/04e/04f grün, Drift-Guard standalone 46/46 + bundle 21/21.

**TABU:** `PROVIDER_MIN_MATCH` (0.80) + Andock-Riegel (Modul 05) unberührt; kein Schlüssel im Code;
kein PROTOCOL_VERSION-/DB_VERSION-Bump; kein Modul-Eingriff außer 04.

**Was offen / nächster Schritt:** Browser-Sichttest Panel 04 Test 21 (+ echter Richter-Schlüssel) —
**wartet auf Klaus**. Danach: Modul-15-Verdrahtung von `queryLocalJudged` in den Cross-Knoten-Antwort-Pfad
(eigener Schritt, Modul-15-Scope) ODER Strang B1 (OCR-Modul) / A3 (Schnipsel-Chunking).

## 2026-07-01 · Bau 04.F — Hybrid BM25+Vektor in Modul 04 (Strang A1 der Semantik-Matching-Werkzeugkiste)

**Rolle:** Bau-Sitzung (Branch `claude/semantic-matching-mistral-ocr-raxbb9`). Auftrag:
Brief 2026-07-01 „Semantische Matching-Qualität (Strang A) + Mistral-OCR-Eingabe (Strang B)".
Diese Sitzung setzt **Strang A1** um — den im Brief als **größten Hebel** benannten Schritt.

**Was getan:**
- **BM25 (lokal, offline, deterministisch) + Reciprocal Rank Fusion** in `src/modules/04_match.js`
  ergänzen den reinen e5-Cosinus (dessen Anisotropie-Boden ~0.82 Bedeutung nicht trennt, siehe
  `LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`). Drei neue Funktionen: `tokenizeBM25`, `bm25Scores`
  (exportiert für Panel-04-Messung), intern `rrfScore`. `k1=1.5`/`b=0.75`/`RRF_K=60`.
- **`queryLocal` opt-in `options.hybrid`:** ohne Flag byte-gleiches Bau-04.C-Verhalten (nur
  Cosinus); mit `hybrid:true` fusioniert es BM25+Vektor via RRF. Aufnahme = (cos ≥ 0.80 **ODER**
  bm25 > 0) → der **Kern-Hebel**: ein Eintrag unter dem Vektor-Boden mit exaktem Wort-Treffer wird
  jetzt gefunden. Treffer tragen additiv `bm25`+`fused`; `score` bleibt der Cosinus.
- **Korpus-Schema additiv:** optionales `text`-Feld (BM25-Doc; Fallback `label`), `validateCorpus`
  prüft es nur wenn vorhanden — Bestands-Korpora bleiben gültig.
- **Doku nachgezogen:** Karte 04 § Bauzustand (Bau 04.F + Sichttest-Zeile), INTERFACES.md §1
  (queryLocal-Signatur + Selbstcheck-Zeile). Byte-Kopien `such-tool/` + `sbkim-bundle/` mitgezogen
  (Drift-Guard grün).
- **TABU eingehalten:** `PROVIDER_MIN_MATCH` (0.80) unverändert = Vektor-Pfad-Boden UND Andock-
  Riegel (Modul 05 unberührt); kein Netz/LLM/Schlüssel in BM25; kein PROTOCOL_VERSION-/DB_VERSION-
  Bump; kein Modul-Eingriff außer 04.

**Beweis (headless):** neuer `tests/smoke_bau04f_hybrid_bm25.mjs` **32/32 grün**. Regression:
smoke_bau04c 43/43, 04d 68/68, 04e 29/29, standalone-Drift 46/46, bundle-connect 21/21, 05_nostr
17/17 (konsumiert Modul 04). (Die restlichen Smokes brauchen `fake-indexeddb`/transformers.js — im
frischen Klon nachinstalliert, Modul-01/05–08-Tests danach grün; nichts durch Bau 04.F berührt.)

**✅ Browser-Sichttest GRÜN (Klaus, 2026-07-01, Termux + `python3 -m http.server`):** Panel 04
**Test 20** „Hybrid BM25+Vektor" live bestätigt. Frage „wespen hausmittel": Standard (nur Cosinus)
liefert nur B (0.8645) + C (0.8369), „A (unter Boden)" (cos 0.7091) fehlt; **Hybrid** stellt A mit
`bm25 1.3938`/`fused 0.03227` an die Spitze (vor C 0.03226 und B 0.01639). Kern-Hebel im Browser
bewiesen — der lexikalische Pfad holt den Unter-Boden-Treffer zurück, 0.80-Andock-Riegel unberührt.
PR #509 damit headless (32/32) UND Browser grün → merge-reif.

**Was offen / nächster sinnvoller Schritt:**
- **Schritt-0-Baseline-Messung** (KALIBRIER-BODEN / SCHWELLEN-ANALYSE / VERFAHREN-VERGLEICH) bleibt
  als Instrument in Panel 04 — optional für die spätere A5-Modellwechsel-Entscheidung.
- **Panel-04-Knopf für Hybrid** in `tests/manual_check.html` (Test 20: `queryLocal({hybrid:true})`
  vs. Default am Mini-Korpus) — Folge-Pflege, headless deckt die Logik schon ab.
- **Strang A2/A3/A4** (Richter fest im Antwort-Pfad / Schnipsel-Chunking / Query-Expansion) +
  **Strang B1** (OCR-Modul, Geschwister von Modul 21) — je eigener Bau, warten auf Klaus'
  Richtungsentscheide (Pipeline-Position, A5-Modellwechsel-Timing, B2-Rollout-Reihenfolge).

## 2026-06-29 · status.json auf neuesten Stand — Module 20–23 ergänzt (live laufende Module sichtbar)

**Rolle:** Pflege (Branch `claude/pinnwand-verwandt-ki-iyzpi7`). Auf Klaus' Zuruf „Sage auf
den neuesten Stand, an die live laufenden Module denken".

**Befund:** `status.json` (die maschinenlesbare Quelle der Wahrheit, von der Sage-Page +
PULS-Pie + andere Repos gespiegelt werden) war hinter dem Code zurück — die `modules`-Liste
endete bei 17, dated 2026-06-27, **ohne** die neueren/live laufenden Module **20 Safe / 21
Sprache / 22 Such-Widget / 23 Rendezvous**.

**Getan:**
- `status.json`: vier `modules`-Einträge ergänzt (20/21/22/23, je `score:"stub"`, mit ehrlichem
  `siegel`-Stand inkl. der **Live-Beweise** — 22 Browser-Sichttest mehrfach grün, **23 LIVE
  Cross-App Sage↔Mixarium „ANDOCK ETABLIERT"**). `lastUpdated` → 2026-06-29.
- `scripts/update_puls_pie.py` ausgeführt → Pie **21 → 25 Module** (Code-Stub 6 → 10).
- Sage-Page (`index.html`) liest `status.json` **live** (`fetch` + „MODUL-STATUS live aus
  status.json") → spiegelt die neuen Module automatisch, kein hartcodierter Zähler zu ändern.

**Nachgezogen (gleicher Tag, Klaus-Befund auf der Live-Seite):** (a) Erst-Eintrag aller vier
Module als `stub` ließ den **Demo-Anteil 8 → 11 %** steigen. Korrektur: **22 Such-Widget + 23
Rendezvous → `fertig`** hochgestuft (beide auf Klaus' Browser-/LIVE-Cross-App-Sichttest grün,
analog 04/05/15) → Demo-Anteil zurück auf **9 %**, Pie Fertig 9 → 11 / Code-Stub 10 → 8. 20/21
bleiben `stub` (nur headless, kein Browser-Test). (b) Stale Anzeige-Feld `status.json.branch`
`claude/semantic-agent-network-Y03Vg` → **`main`** (zeigt im Sage-Page-Header; die echte Arbeit
lief immer über `main`-PRs, das Feld war nur kosmetisch und stiftete Verwirrung).

**Offen / Sichttest:** Sage-Page zeigt die vier Module bereits (Klaus 2026-06-29, Screenshot:
20/21/22/23 im Graph, „15 Module"). Test der Modul-Logik 20–23 über `tests/manual_check.html`
(Panels 20–23 liegen). Kein Protokoll-Code berührt, kein SIGNAL-Bump.

## 2026-06-28 (tiefe Nacht, Folge²) · Pinnwand — ehrliche Beschriftung (Cosinus = Rangfolge) + Drift-Guard geheilt

**Rolle:** Pflege (Branch `claude/pinnwand-verwandt-ki-iyzpi7`).

**Auftrag** (Brief `BRIEF_PINNWAND_VERWANDT_KI.md`): Die Pinnwand aufs „verwandt · KI"-
Muster bringen wie Modul 22. **Befund nach Code-Lesen:** die Pinnwand hat das Muster im
Kern **schon** — und ist sogar weiter als Modul 22:
- **Gratis-Pfad:** opt-in „🧠 nach Bedeutung sortieren", schon **zentrierter (whitened)
  Cosinus** (`relevance()`→`whiten()`), mit **seiten-lokalem, wachsendem** Schwerpunkt
  (`accumulate`/`meanVec`, ab ≥3 Texten) — bewusst **nicht** der netzweite
  `RELATEDNESS_CENTER` (für freien Q&A-Text korrekt+besser, siehe LEHRE 2026-06-28 Nacht).
- **KI-Richter:** schon **opt-in/BYOK/fail-soft** — Dropdown Claude/Gemini/OpenRouter (Cloud)
  + WebLLM (gratis im Browser), Schlüssel RAM-only (nur mit Häkchen lokal), Urteil hat Vorrang
  vor Cosinus, Begründung je Treffer. **Gatet nichts.**

**Klaus-Entscheid (AskUserQuestion):** (1) **nur ehrliche Beschriftung**, KEIN neuer
„· KI"-Schalter (wäre redundant zum bestehenden Richter-Dropdown); (2) **Schnipsel-Mittel-Lead
weiter liegen lassen**.

**Getan (reine Anzeige + Test-Health, kein Kontrakt berührt):**
- **Ehrliche Beschriftung** in `pinnwand/index.html`: Cosinus-Status jetzt klar als
  **Bedeutungs-Rangfolge** (an: „Zahl = Nähe zur Frage, kein Verwandt-Urteil — das liefert
  der ⚖️ KI-Richter"); Footer um den ehrlichen Cosinus=Rangfolge-vs-Richter=Urteil-Kontrast
  geschärft (Messreihe trennt verwandt/unverwandt gratis nicht zuverlässig → Urteil = Richter).
  Deckt sich mit LEHRE „Cosinus = Rangfolge, KI-Richter = Wahrheit".
- **Drift-Guard geheilt:** `pinnwand/modules/03_embedding.js` war hinter `src/modules/03_embedding.js`
  zurück (PR #477 `embedContentVector` nur in `src/`) → byte-1:1 re-synct. Pinnwand nutzt die
  Funktion nicht (inert), aber `_smoke.mjs` jetzt **58/58 grün** (vorher 57/58).

**✅ Browser-Sichttest GRÜN (Klaus 2026-06-29):** Cosinus-Sortierung live mit Score-Badges;
„Hänchen … echte Alkoholcocktails" 0.16 steht über harmlosen Treffern → beweist sichtbar, dass
der gratis Cosinus eine **Rangfolge** ist, kein Absichts-Urteil (genau die geschärfte Lesart).
KI-Richter-Lauf an der Pinnwand selbst noch offen (Default aus). Kern-Logik
(Embedding/Richter/Relays) unverändert.

## 2026-06-28 (tiefe Nacht, Folge) · Bau 22 „verwandt · KI" — Verwandtschafts-Maß opt-in vom KI-Richter

**Rolle:** Bau (Branch `claude/relatedness-ki-richter-optin-vn8x40`).
Brief: `BRIEF_RELATEDNESS_KI_RICHTER_OPTIN.md`. Freibrief galt. Plan-vor-Code:
drei Richtungs-Entscheide vorab an Klaus gestellt (AskUserQuestion) — Antworten:
„· KI" unter „verwandt", alt bleibt · Modul 23 vorerst nur Cosinus · erst nur
KI-Richter.

**Getan (Modul 22 only, gemäß Klaus' Entscheid):**
- Dritter Schalter **„· KI"** im Such-Widget (nur im verwandt-Modus sichtbar,
  Default aus). An + Schlüssel → das „verwandt"-Ranking kommt vom **KI-Richter**
  (`hybridMatch`, vorhandenes Anbieter/Schlüssel-Feld wiederverwendet) statt vom
  zentrierten Cosinus; Anzeige nach KI-Score, `isRelated` aus `passt`, Badge
  „🧬 NN % · KI", `begruendung` als Zeile, Block-Kopf „(KI-Richter)". Aus →
  gratis Cosinus, jetzt ehrlich als **Rangfolge** beschriftet.
- **REINE Anzeige — gatet nichts:** `PROVIDER_MIN_MATCH` 0.80 + Andock + Modul
  04/05 unberührt (nur öffentliche `hybridMatch`-Fläche, war schon da). Urteil
  RAM-only, an die Frage gebunden, bei neuer Suche zurückgesetzt, **nicht**
  persistiert (nur die Schalter-Wahl `kiRelated`). EU-Politik gilt, fail-soft
  (kein Schlüssel/Urteil → Cosinus). Alter „KI-Richter"-Schalter unberührt daneben.
- Surface `+setKiRelated/getKiRelated`, `rankView(…, {…, kiByKey?})`,
  `_meta.kiRelated/kiRelatedActive`, `init({kiRelated?})`.
- Smoke `smoke_bau22e_waehlen.mjs` **45/45** (neue Proben 8–11), `smoke_bau22`
  257/257, Standalone-Drift-Guard 46/46. Byte-Kopie `such-tool/modules/22…`
  byte-1:1. Doku: Karte 22 § „verwandt · KI", INTERFACES §1 Modul 22, LEHRE-Doc.

**Offen / nächster Schritt:** (1) **Browser-Sichttest (KI-Schlüssel live)** wartet
auf Klaus — erst nach Merge auf der live-deployten Seite prüfbar. (2) Pinnwand
(eigener `.a-judge`) auf dasselbe „· KI"-Muster bringen — eigene Folge-Sitzung.
(3) `Schnipsel-Mittel`-Lead bleibt liegen (erst nur KI-Richter). Modul 23
(Raum-Badge) bewusst bei Cosinus belassen (Klaus-Entscheid).

## 2026-06-28 (tiefe Nacht) · Kalibrier-Abschluss: „verwandt" → KI-Richter (Ur-Vision), v2-Center verworfen

**Rolle:** Bau/Diagnose (Branch `claude/kalibrierung-rollout-drei-knoten-p1e3i3`).
Brief: `BRIEF_KALIBRIERUNG_ROLLOUT_DREI_KNOTEN.md` (Schritt 1 BLOCKER = Klaus' Panel-04-Messung). Freibrief galt.

**Getan (Messreihe im Browser, Klaus' Galaxy-Tab, mit echten Inhalts-Vektoren):**
- Drei Mess-Knöpfe in Panel 04 gebaut/gemergt (reine Messung, setzen keine Konstante):
  `RELATEDNESS_CENTER v2 messen` (PR #485 vorhanden) → ergänzt um **`SCHWELLEN-ANALYSE`**
  (PR #493, volle Matrix v1+v2) + **`VERFAHREN-VERGLEICH`** (PR #494, mitteln/Schnipsel-Max/
  Schnipsel-Mittel). Cache-Bust an Modul-03/04-Skript-Tags (PR #492) — Browser lud sonst
  altes `03_embedding.js` ohne `embedContentVector`.
- **Befund:** v2-Center `freigabeReif: false`; **keine** Schwelle trennt verwandt/unverwandt
  (Überlappung: unverwandt `tresor↔point` 0.81 > verwandt `rezept↔mix` 0.80, sowohl v1 als
  v2). Ursache: **Mitteln** der Schnipsel zu einem Domänen-Vektor bläht den zentrierten
  Cosinus auf (einzelne Texte zentriert ~−0.14, gemittelt ~0.70). `Schnipsel-Mittel` trennt
  zwar (Lücke +0.0188 @ ~0.55), aber **dünne Marge** + bräuchte **Schnipsel-Vektoren in der
  Spore** (Datenvertrag-Eingriff Modul 02).

**Klaus' Richtungs-Entscheid (2026-06-28):** Cosinus bleibt der gratis/offline **„verbunden"-
Vorfilter** (ehrliche Rangfolge, kein Wahrheits-Stempel); das echte **„verwandt"** liefert
der **KI-Richter** (Modul 04 `hybridMatch`, opt-in/BYOK) — zurück zur Ur-Idee „Semantisches
Bidirektionales KI-Matching" (Evolutions-Klausel: der bessere Weg qualifiziert sich). Voll
dokumentiert in [`docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`](LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md)
§ „Stand 2026-06-28 (tiefe Nacht)".

**Konsequenz:** `RELATEDNESS_CENTER` bleibt **v1** (v2 verworfen). **Keine netzweite
Konstante geändert** ⇒ **kein** SIGNAL/Rollout (Brief-Schritte 2+3 entfallen — sie setzten
einen neuen Center voraus). `PROVIDER_MIN_MATCH = 0.80` unverändert. Reine Anzeige bleibt
reine Anzeige (0.80-Andock-Riegel unberührt).

**Offen / nächster Schritt:** (1) Optional: das „verwandt"-Badge (Modul 22/23) auf den
KI-Richter-Pfad umstellen (opt-in) — eigene Bau-Sitzung, sicherheits-/UX-sensibel. (2)
`Schnipsel-Mittel`-Lead an mehr echten Knoten gegenprüfen, falls „verwandt" doch gratis
werden soll. (3) Hygiene: netzweite md5-Konsistenz `04_match.js` (unverändert v1) als reiner
Drift-Check. **Browser-Sichttest der drei Mess-Knöpfe lief grün (Klaus 2026-06-28).**

## 2026-06-28 (Nacht) · „Wählen"-UI Folge: Strang D Mess-Knopf + Strang C als blockiert dokumentiert

**Rolle:** Pflege/Bau (Branch `claude/relatedness-badge-rollout-84fg17`).
Brief: Badge-UI netzweit ausrollen (C) + `RELATEDNESS_CENTER` v2 aus größerem
Korpus (D). Freibrief galt.

**Befund vorab (gegen `origin/main` geprüft, nicht aus dem Working-Tree):**
Der Brief nimmt an, der Vorgänger-PR #483 (Strang-B-Badge in Modul 23) sei
„nach Merge auf main". **Er ist NICHT gemerged** — offener Draft auf
`claude/waehlen-ui-relatedness-display-xatbi1`. Damit lebt `relatednessForCards`
+ das Badge-UI nur im ungemergten Branch (Sage-main-`smoke_bau23` = 40, nicht
55). Klaus per AskUserQuestion gefragt → „keine Präferenz" → Urteil unter
Freibrief.

**Strang C (Badge netzweit ausrollen) — als blockiert dokumentiert, NICHT
live gerollt:**
- md5-Befund: Sage-main Modul-23-Dateien (`23_rendezvous.js`,
  `23_rendezvous_ui.js`) sind **bereits byte-identisch** mit Mixariums Kopien
  → eine Kopie HEUTE ändert nichts; das Badge kommt erst rein, wenn #483 in
  Sage main ist.
- **Eigentliche Lücke:** Mixariums `sbkim/04_match.js` **driftet** gegen
  Sage main (alte Version OHNE `relatedness()`/`RELATEDNESS_CENTER`). Selbst
  mit Badge-Code bliebe das Badge in Mixarium **stumm**, bis dieses Modul
  nachgezogen wird — das ist der echte Strang-C-Kern, nicht die Lade-Reihenfolge.
- **Lade-Reihenfolge ist überall schon korrekt** (Modul 04 vor Modul 23):
  Mixarium `index.html` (04 Z.13077 < 23 Z.13087), family-project
  `index.html`/`netzwerk.html` (04 < 23). family-project fährt sein **eigenes**
  Raum-UI (kein `23_rendezvous_ui.js`) → Badge dort = Teil des Consumer-Refactors
  (eigener Folge-Schritt). Rezeptbuch fährt den Raum noch gar nicht.
- **Entscheidung:** kein Live-Push unverifizierten Badge-UI in die deployte
  Mixarium-PWA vor Klaus' Browser-Sichttest. Remediation (mechanisch, sobald
  #483 in main): in Mixarium `04_match.js` + beide Modul-23-Dateien auf
  Sage-main-Stand ziehen, Drift-Guard, eigener Rollout-PR.

**Strang D (`RELATEDNESS_CENTER` v2) — Mess-Knopf gebaut, Konstante NICHT
geändert:**
- `tests/manual_check.html` Panel 04: neuer Knopf **„RELATEDNESS_CENTER v2
  messen (größeres Korpus → Literal + Referenz-Fälle)"**. Bettet einen breiten,
  diversen 32-Text-Korpus ein (Modul 03 `embedPassageBatch`), L2-mittelt +
  re-normiert → v2-Kandidat; gibt das **kopierfertige Float32Array-Literal**
  (48 Zeilen / 384 Zahlen, 1:1 in `04_match.js` einsetzbar) ins `<pre>` aus,
  plus eine **Referenz-Fall-Tabelle** (Schwestern Rezeptbuch↔Mixarium oben,
  Hub↔Endknoten Sage↔BLP unten) unter v1 UND v2 nebeneinander +
  Freigabe-Flag `freigabeReif`. **Reine Messung — ÄNDERT KEINE Konstante**,
  kein Vertrag/`PROTOCOL_VERSION` berührt, Modul 04 nur gelesen.
- Headless-Smoke unverändert grün (nur `manual_check.html` angefasst): 04a 19,
  04b 30, 04c 43, 04d 68, 04e 29, 23 40 — alle 0 rot. Button-Logik headless
  mit Stub-Vektoren strukturell geprüft (48 Zeilen, 384 Zahlen, 4 Referenz-
  Zeilen, Ordnungs-Objekt).

**Offen / nächster Schritt:**
1. Klaus' Browser-Lauf: Mess-Knopf klicken → v2-Literal + Referenz-Tabelle
   lesen; bei `freigabeReif:true` Konstante bewusst netzweit setzen (SIGNAL
   §11.6, dann ALLE Knoten identisch nachziehen).
2. **#483 ist inzwischen gemerged** (2026-06-28 19:43, b972454) → Sage main hat
   das Badge. DANACH Strang-C-Rollout (Mixarium `04_match` + Modul-23-Dateien
   byte-1:1) — jetzt nicht mehr blockiert, eigene Folge-Sitzung.
3. Browser-Sichttest beider Stränge wartet auf Klaus.


## 2026-06-28 (Nacht) · „Wählen"-UI Folge — Verwandtschafts-Badge im Rendezvous-Raum (Modul 23) + Pinnwand-Befund

**Rolle:** Bausitzung (Branch `claude/waehlen-ui-relatedness-display-xatbi1`). Brief
`docs/sessions/BRIEF_WAEHLEN_UI_FOLGE_PINNWAND_M23.md`. Freibrief gilt (CLAUDE.md § Freibrief).

**Was getan (zwei abgegrenzte Stränge, reine Anzeige):**

- **Strang B — Modul 23 (Rendezvous-Raum) Verwandtschafts-Badge: gebaut.** Der
  Zwei-Maß-Schalter aus Bau 04.E jetzt am zweiten Einbau-Ort.
  - Modul 23 (`src/modules/23_rendezvous.js`): neue pure Funktion
    `relatednessForCards(cards, ownSpore)` hängt je Karte einen **zentrierten**
    Verwandtschafts-Score (`SbkimMatch.relatedness`, whitened-light) + `isRelated`
    (≥ `RELATEDNESS_MIN` 0.30) an; `discover()` reicht das durch. Modul 04 ist
    **optionale** Anzeige-Abhängigkeit (`_meta.hasMatch`), fail-soft ohne sie /
    ohne `domainVector`. Mutiert die Karten-Liste nicht. Surface
    `+relatednessForCards`.
  - UI (`src/modules/23_rendezvous_ui.js`): Badge pro Knoten
    („🧬 verwandt 0.72" vs „· verbunden …") + „🧬 nur verwandte"-Schalter
    (Default aus, `_meta.relatedOnly`).
  - **REINE Anzeige — gatet nichts, 0.80-Andock-Riegel (Modul 05) unberührt,
    Kern-Module 02/05/05b unangetastet, Modul 04 nur gelesen.** Byte-1:1-Kopien
    `sbkim-bundle/modules/23…` nachgezogen (Drift-Guard grün).
  - Smoke `tests/smoke_bau23_rendezvous.mjs` **55/55** (echte Knoten-Vektoren:
    Schwester Rezeptbuch verwandt, Hub Sage/BookLedger nicht + fail-soft +
    Andock-Regression), `tests/smoke_bau23_rendezvous_ui.mjs` **32/32**,
    `tests/smoke_bundle_connect.mjs` 21/21.
- **Strang A — Pinnwand: bewusst KEIN Eingriff (begründet).** Die Pinnwand
  zentriert bereits (`relevance`/`whiten` mit wachsendem, **seiten-lokalem**
  Schwerpunkt) — das ist für freien Q&A-Text **passender** als der netzweite
  `RELATEDNESS_CENTER` (Mittel über 7 Domänen-Vektoren). Der KI-Richter ist dort
  schon opt-in. Den netzweiten Mittelwert aufzudrücken würde es **verschlechtern**.
  Dokumentiert in `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` (Stand 2026-06-28
  Nacht) statt stillschweigend umgangen.

**Was offen:** Browser-Sichttest des Badges + des Filters wartet auf Klaus
(zwei Geräte am echten Relais, Raum lesen → Badge je Knoten). Pinnwand bleibt
unverändert. `RELATEDNESS_CENTER` weiterhin v1 aus 7 Vektoren (eigener
Folge-Schritt „größeres Referenz-Korpus", unberührt).

**Nächster sinnvoller Schritt:** Klaus' Browser-Sichttest des Raum-Badges; danach
Rollout des Badge-UI in die anderen PWAs (Modul 23 wird ohnehin byte-1:1 kopiert).

---

## 2026-06-28 (Nacht) · E2E-Vertraulichkeits-Doku aus PR #302 gerettet (reine Doku)

**Rolle:** Pflege (Branch `claude/e2e-doku-uebernahme`). Auf Klaus' Wunsch.

- **PR #302 war nicht mergereif:** unverwandte Git-Historie zum heutigen `main`
  (kein gemeinsamer Vorfahr, verschiedene Wurzel-Commits → `refusing to merge
  unrelated histories`) **und** Scope-Widerspruch (Beschreibung „doc-only, 4
  Dateien", real 10 Dateien inkl. 10.231-Zeilen-`mycel-knoten.html` + andock.html
  + Siegel-PNG/SVG = ganzes BLP-App-Bundle).
- **Klaus' Entscheid:** nur den **Doku-Teil** behalten (E2E-Verschlüsselung war
  geplant), nichts an der App. → **nur** `docs/E2E-VERTRAULICHKEIT.md` (Spec-
  Entwurf, Protokoll bleibt `0.1`, keine Tafel) + Sitzungs-Archiv übernommen,
  sauber ab aktuellem `main`. Das App-Bundle + Mailbox-Brief (`AUSTAUSCH-`,
  `fuer-BookLedgerPro/`) bewusst **nicht** übernommen (würden auf nicht
  existierende Dateien zeigen / die App ändern). Toter Datei-Link in der Doku
  neutralisiert (Hinweis auf PR-#302-Branch).
- **Folge:** PR #302 kann geschlossen werden (Inhalt gerettet bzw. bewusst
  verworfen). E2E bleibt Entwurf bis Knoten-Go (BLP deployt) — unverändert.

---

## 2026-06-28 (Nacht) · „Wählen"-UI — Umschalter verbunden ↔ verwandt im Such-Widget (Modul 22)

**Rolle:** Bausitzung (Branch `claude/brief-ui-selection-neh6gx`). Brief
`docs/sessions/BRIEF_WAEHLEN_UI_GROB_GENAU.md`. Freibrief gilt (CLAUDE.md § Freibrief).

- **Das Zwei-Maß-Design aus Bau 04.E in eine sichtbare Auswahl verdrahtet** (Klaus'
  Idee „zwei Messungen wählen"). Modul 22 bekommt einen **Umschalter** in der
  Optionen-Zeile: **„🧬 verwandt (genau)"** + **„nur verwandte"**.
  - **„verbunden" (grob, Default):** Treffer in roher Cosinus-Reihenfolge (gewohnt).
  - **„verwandt" (genau):** nach **zentriertem** Cosinus (Modul 04 `relatedness()`)
    umsortiert — echte Themen-Verwandte oben, fremde Domänen unten; 🧬-Badge je
    Treffer; „nur verwandte" blendet Fremde ganz aus.
- **Reine Anzeige-Schicht** — `relatedness()` **gatet nichts**, Andock-Handshake
  (Modul 05, `PROVIDER_MIN_MATCH` 0.80) **unberührt** (Regressionscheck grün).
  **Modul 04 nicht angefasst** (nur die öffentliche Fläche genutzt). Query-Vektor
  (Modul 03 `embedQuery`, RAM-only) + Treffer-`passageVec` reisen durch die
  Kandidaten; **nichts davon persistiert** (kein PII, keine Vektor-Last in LS).
  Konsequent **fail-soft** (ohne Modul 04 / queryVec / passageVec → degradiert auf
  „verbunden"). User-Wahl persistiert in `sbkim_search_widget_view`.
- **Surface** `+setViewMode/getViewMode/setRelatedOnly/rankView` (rankView = reine,
  headless testbare Funktion), `_meta.viewMode/relatedOnly/hasQueryVec`,
  `init({viewMode?,relatedOnly?})`.
- **Smoke** neu `tests/smoke_bau22e_waehlen.mjs` **27/27** — an den **echten**
  committeten Knoten-Domänen-Vektoren: Schwestern (Jason↔MeinTresor) /
  Essen-Trinken (Mixarium↔Rezeptbuch) oben, Hub↔Endknoten (Sage↔BLP) raus.
  Regression grün: `smoke_bau22` 257/257, `smoke_bau04e` 29/29, `smoke_bau04d`
  68/68, Standalone-Drift-Guard 46/46. Byte-identische Kopie `such-tool/modules/22…`
  mitgezogen. INTERFACES §1 Modul 22 + Karte 22 nachgezogen.
- **Pinnwand-Befund (nicht gebaut, Folge-Sitzung):** sortiert ebenfalls „nach
  Bedeutung" (`.a-score`-Cosinus + opt. `.a-judge`) → würde vom selben Zwei-Maß-
  Schalter profitieren; bewusst abgegrenzt (kein Zwang laut Brief, saubere PR-Grenze).
- **Offen / nächster Schritt:** **Browser-Sichttest des Umschalters wartet auf Klaus**
  (headless ersetzt ihn nicht) — Widget öffnen, „🧬 verwandt" ankreuzen, prüfen ob
  echte Verwandte hochsortieren. Danach optional Pinnwand-Folge-Sitzung + Modul-23-
  UI-Verwandtschafts-Badge.
- **Manual-Check:** `tests/manual_check.html` Panel 22 lädt das geänderte Modul
  unverändert; der Umschalter ist Teil der Live-Widget-UI (kein neuer Panel-Knopf
  nötig) — Sichttest läuft am echten Widget, wartet auf Klaus.

---

## 2026-06-28 (Abend) · Kalibrierung abgeschlossen — zentrierter Cosinus (Bau 04.E) + BLP-Rollout + Mixarium-Merge

**Rolle:** Hauptsitzung (Branch `claude/rest-rollout-threshold-calibration-l6c92u`).

- **BookLedgerPro Inhalts-Vektor** ausgerollt + **gemergt** (PR #240): byte-1:1 sbkim/02+03
  aus Sage, `sampleContent()` aus statischen Standard-Konto-Labels (SKR03 + KS_SEED, kein PII).
  Live BLP↔Sage-Handshake beidseitig „ETABLIERT" (Klaus, Browser).
- **Kalibrierung abgeschlossen (Bau 04.E, Klaus' Entscheidung „zentrierten Cosinus jetzt bauen"):**
  Messung roh-Boden `mean 0.8214 sd 0.0236`. **Schwelle 0.80 bewusst NICHT angehoben** — sie ist
  der **Andock-Boden** (gatet den Handshake, Modul 05); anheben würde jeden Hub↔Endknoten-Andock
  abreißen. Stattdessen **additiv** `SbkimMatch.relatedness()` (zentrierter Cosinus, **gatet nichts**)
  + `isRelated()` gegen `RELATEDNESS_MIN = 0.30`. `match()`/`PROVIDER_MIN_MATCH` unverändert.
  Smoke `tests/smoke_bau04e_relatedness.mjs` **29/29** (echt 0.72–1.0, Boden −0.20…0.002).
  Drift-Kopien `such-tool/` + `sbkim-bundle/` byte-1:1 (auch 03 nachgezogen — war vor-bestehend ab).
  INTERFACES §0/§1 + LEHRE-Stand + NETZ-STAND + status.json (`RELATEDNESS_MIN`) nachgezogen.
- **Mein-Mixarium** war das fehlende Rollout-Repo → PR #80 geprüft + gemergt.
- **Offen:** `MEAN_VECTOR` v1 aus 7 Vektoren (größeres Korpus = Folge); `relatedness`-Score in
  UI/Ranking verdrahten (Folge). **Browser-Live-Match wartet auf Klaus** (Score in echter Anzeige).
- **Manual-Check:** `tests/manual_check.html` von dieser Änderung nicht berührt (Modul 04 additiv,
  kein Panel-Umbau) — headless-Smoke ist der Beleg; Score-Anzeige im Browser wartet auf Klaus.

---

## 2026-06-28 · Inhalts-Vektor-Rollout (Rezeptbuch) + Schwellen-Kalibrier-Instrument

**Rolle:** Hauptsitzung (Branch `claude/threshold-calibration-rollout-0rq08m`).

**Was getan:**
- **Mein-Rezeptbuch ausgerollt** (Draft-PR #269, wartet auf Klaus' Merge + Browser-Re-Sign):
  `sbkim/02_spore.js` + `sbkim/03_embedding.js` **byte-1:1 aus Sage** `src/modules/`
  (md5-geprüft identisch; Diff zur Vorversion = **exakt** der Inhalts-Vektor-Block, kein
  Repo-Drift). `sbkim-init.js` `__sbkimErzeugeSpore` sampelt jetzt bis zu 32 echte Rezepte
  (`window.R`: Kategorie+Name, nur unkritische Labels, **kein PII**) → `embedContentVector`
  → domainVector aus dem Inhalt. Greift **nur im Auto-Pfad** (öffentlicher Knopf „Mit dem
  Netz verbinden" via `createIdentity`); das Siegel-Semantik-Textfeld bleibt bewusst
  Beschreibungs-Vektor (Hülle nach Nutzer-Wahl). `embeddingSource`/`embeddingVersion`
  mit-signiert, fail-soft, `index.html` unverändert (externes `<script>`, `app-sw`
  network-first → kein Cache-Bust). SIGNAL Rezeptbuch seq 7→8.
- **Schwellen-Kalibrier-Instrument gebaut** (Sage): Test-Bridge-Knopf
  „KALIBRIER-BODEN messen" im Modul-04-Panel (`tests/manual_check.html`) misst im Browser
  den Rausch-Boden aus 8 unverwandten Zufallstexten (roh + zentriert/Mean-Abzug) + gibt
  eine Schwellen-Empfehlung `mean+2·sd` aus. `LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`
  Stand-2026-06-28-Block ergänzt (Tafel-Evolutions-Klausel, explizit).
- **Korrektur eines eigenen Fehlers (Achtsamkeit):** zunächst aus einem **veralteten
  lokalen Checkout** behauptet, Mein-Rezeptbuch habe „kein origin/main / null SBKIM-Code".
  Falsch. Nach `git fetch origin main` + `git ls-tree` je Repo verifiziert: Rezeptbuch ist
  ein sauberer byte-1:1-Fall; **Mein-Tresor + Jasons-Tresor + BookLedgerPro ebenso** (alle
  haben `sbkim/02+03` = clean pre-content Sage-Module + `sbkim-init.js` mit Browser-e5-
  Spore-Pfad). Aussage „bespoke / kein Browser-e5" zurückgezogen.

**Was offen:**
- **Schwelle 0.80 neu setzen:** wartet auf Klaus' Browser-Messung (Knopf laufen lassen →
  `status.json` `config.PROVIDER_MIN_MATCH` bewusst setzen). Headless nicht messbar.
- **Re-Sign Rezeptbuch im Browser** (Klaus) → dann verified-match vorher (0.824068)/nachher.
- **Tresore + BLP ausrollen:** byte-1:1 wie Rezeptbuch möglich; offen ist der **Daten-
  Entscheid**, was `sampleContent()` bei sensiblen Apps liefert (Brief erlaubt Fach-Namen/
  Kategorien; freie Fach-Namen bei Tresoren bleiben heikel — eigene Folge-Sitzung). BLP
  (Konto-Kategorien, non-PII) ist der nächste klare Kandidat.
- **SB-KIMTool-Point:** Demo-Hub (`sandbox/`, aufgezeichneter Lauf) — Inhalts-Vektor-
  Anwendbarkeit am echten Pfad bestätigen, nicht annehmen.
- **PULS-Überlauf:** Datei ist 7066 Zeilen (> 3000-Schutzgrenze) — Archivierung steht aus
  (eigene Pflege-Sitzung, nicht in dieser).

**Nächster sinnvoller Schritt:** Klaus mergt PR #269 + re-signt Rezeptbuch im Browser;
parallel Kalibrier-Boden messen; dann BLP ausrollen + Tresor-Daten-Entscheid.

## 2026-06-28 · Inhalts-treuer Domänen-Vektor (von der Hülle zum Inhalt)

**Rolle:** Bausitzung. · **Branch:** `claude/content-based-domain-vector-w3qx62`

**Was getan:**
- **Modul 03 `embedContentVector(samples, opts?)`** — baut EINEN repräsentativen,
  L2-normalisierten Vektor aus bis zu 32 echten Inhalts-Schnipseln (Schwerpunkt
  auf der Einheits-Kugel). Fail-soft (leere Einträge übersprungen, alle leer →
  `EmptyInputError`, Nicht-Array → `EmbeddingError`), Deckel via `opts.max`.
  KEINE Match-Rechnung (Modul-Grenze klar dokumentiert — bleibt Modul 04).
- **Modul 02 `regenerateOwnSpore(updates, key?)`** — gleiche `nodeId`, neu
  signiert; nicht genannte Felder bleiben erhalten. Additive, signaturpflichtige
  Spore-Felder `embeddingSource` (`content|description`) + `embeddingVersion`
  (Re-Embedding-Zähler/Drift) in die `generateOwnSpore`-Allow-List aufgenommen
  (auch `embeddingCapabilities`/`embeddingNeeds`, sonst Datenverlust beim
  Re-Sign). PROTOCOL_VERSION bleibt `"0.1"` (rein additiv).
- **Bundle `sbkim-connect.js`** — `createIdentity` nimmt optionalen
  `sampleContent()`-Callback; Inhalts-Vektor so leicht wie der Beschreibungs-
  Vektor, fail-soft Fallback auf die Beschreibung. Byte-1:1-Kopien 02/03
  nachgezogen (Drift-Guard grün).
- **Spec-Karten** 02 + 03 nachgezogen, **Meilenstein-Doku** angelegt
  (`docs/MEILENSTEIN_VON_DER_HUELLE_ZUM_INHALT.md`, Bild-Platzhalter für Klaus).
- **Headless-Smoke** `tests/smoke_inhaltstreuer_domainvektor.mjs` **25/25 grün**
  (inkl. Demo Kuchen-vs-Sushi: Inhalts-Cosinus 0.03 bei identischer Beschreibung).
  `smoke_bundle_connect` 21/21 + `smoke_bau02y` 33/33 weiter grün.

**Klaus' Entscheide diese Sitzung (auf „keine Präferenz" → empfohlene Defaults):**
Inhalt entscheidend + Beschreibung nur Fallback bei leerem Knoten · bis 32
Einträge sampeln, nur unkritische Labels (sensible Apps nur Fach-Namen) ·
0.80-Schwelle nach Umstellung bewusst neu kalibrieren (zentrierter Cosinus) —
als eigene Folge-Sitzung mit Browser-Messwerten.

**Was offen:**
- **Browser-Live-Match** mit dem echten e5-Modell (~30 MB) — wartet auf Klaus'
  Browser-Lauf. Headless beweist Mathematik + Spore-Verdrahtung, nicht echte
  Vektor-Lagen.
- **0.80-Schwelle neu kalibrieren** (zentrierter Cosinus) — eigene Folge-Sitzung.
- **Netzweiter Rollout**: jeder Knoten reicht `sampleContent()` durch + re-signt
  im Browser (Reihenfolge wie Modul 23: Mixarium → Rezeptbuch → Tresore → BLP →
  SB-KIMTool-Point). Verified-match vorher/nachher ehrlich vergleichen.

**Nächster sinnvoller Schritt:** Klaus' Browser-Sichttest in Sage (Andock-Wizard
mit `sampleContent` aus dem Glossar-/Tafel-Korpus), dann Schwellen-Kalibrierung,
dann Endknoten-Rollout.

## 2026-06-28 · SBKIM-Verbinden-Bundle (Drop-in-Kit) gebaut

**Rolle:** Bausitzung (Rollout-Enabler, Klaus' Festlegung „erst Bundle"). ·
**Branch:** `claude/module-23-rendezvous-rollout-zqaa8u`

Damit die 5 stack-losen Repos (Rezeptbuch, SB-KIMTool-Point, Mein-/Jasons-Tresor,
BookLedgerPro) das „🌐 Mit dem Netz verbinden" **einheitlich und leicht** bekommen,
gibt es jetzt ein kopier-fertiges **Drop-in-Bundle**: `sbkim-bundle/`.

- `sbkim-bundle/modules/` — **byte-1:1**-Kopien der 9 nötigen Module (01/02/03/04/
  05/05b/noble-secp256k1/23/23_ui). Drift-Guard im Smoke.
- `sbkim-bundle/sbkim-connect.js` — **Ein-Aufruf-Glue** `SbkimConnect.init({nodeName,
  endpoint, domain, domainDescription, domainKeywords, …})`: Storage→Spore→
  Anastomose→Auto-Lauschen (Empfangsmodus) + öffentlicher Rendezvous-Knopf
  (createIdentity aus der Konfig gebaut). Fail-soft, nichts wirft.
- `sbkim-bundle/README.md` (2-Schritt-Anleitung + Eigenheiten je App-Typ) +
  `beispiel.html` (Minimal-Seite).
- Smoke `tests/smoke_bundle_connect.mjs` **21/21 grün** (Drift-Guard 9/9 +
  Verdrahtung + createIdentity + fail-soft).

**Folge (nächste Sitzungen, je eigener PR):** Repo-für-Repo den Bundle einbauen
(Reihenfolge offen — Klaus), dann **Sage + SB-KIMTool-Point aktualisieren** (alter
committeter Pfad → Randnotiz, **neuer Meilenstein** „server-los nur mit Tablet+Handy,
simuliert → live"). §11.6 SIGNAL seq 38.

## ✅ 2026-06-28 · Rendezvous LIVE CROSS-APP BEWIESEN (Sage ↔ Mixarium, beidseitig)

**Klaus' Browser-Sichttest grün** — der server-lose Live-Cross-Knoten-Handshake
läuft jetzt **zwischen zwei Apps, die beide das geteilte Modul 23 fahren**:

- **Sage → Mein Mixarium:** „✓ ANDOCK ETABLIERT mit Mein Mixarium! 🎉"
- **Mein Mixarium → Sage:** „✓ ANDOCK ETABLIERT mit Sage-Protokoll! 🎉"
- Alle drei Knoten (Sage, Mixarium, family) sahen sich gegenseitig im gemeinsamen
  Raum (`sbkim-rdv`); jeweils die **lebende** ID gehandshaket. Adress-Wand gelöst.
- Der 0.80-Bedeutungs-Riegel trennt korrekt: Mixarium ↔ family 0.7753 →
  rejected-local (kein Fehler, Drinks vs. Werkzeuge).

Damit ist das Akzeptanzkriterium des Modul-23-Briefs erfüllt: Modul 23 in Sage
spec'd + gebaut (Smoke 40/40 + UI 23/23), family-project als Konsument (Smoke
77/77), **mindestens ein Endknoten ausgerollt + cross-App-Rendezvous LIVE
bewiesen**. Hebt zugleich Sages Meilenstein-Doku-Vorbehalt („bidirektionale
Cross-Knoten-Verbindung noch nicht end-to-end gezeigt") auf — jetzt app-zu-app
über das produktive Modul gezeigt. §11.6 SIGNAL seq 37.

**Offen:** family #16 (Refactor auf das geteilte Modul) — Klaus' Wort; family
läuft live unverändert auf Inline-Code. Stack-lose Endknoten (Rezeptbuch,
SB-KIMTool-Point, Tresore, BookLedgerPro) brauchen erst den Andock-Stack.

## Pflege 2026-06-28 · Sage-Page-Mount des Rendezvous-Knopfs

**Rolle:** Folge-Pflege (Live-Test-Enabler) · **Branch:** `claude/module-23-rendezvous-rollout-zqaa8u`

Klaus' Live-Test (Mixarium ↔ family) hat das Rendezvous-Verfahren live bestätigt:
Mixarium fand family's **lebende** Visitenkarte im Raum und handshakte die lebende
ID — der Handshake lief korrekt in den lokalen Bedeutungs-Riegel (Mixarium↔family
0.7753 < 0.80, kein Fehler, Drinks vs. Werkzeuge zu verschieden). Für ein grünes
„✓ ETABLIERT" fehlte ein **≥0.80-Partner**, der auch live im Raum ist.

**Getan:** `sbkim-init.js` mountet jetzt `SbkimRendezvousUI` (öffentlicher 🌐-Knopf,
nodeName „Sage-Protokoll", `createIdentity` = `sageCreateRendezvousIdentity` über
`generateOwnSpore` mit der Andock-Wizard-CONFIG). Sage ist Hybrid und matcht
**family 0.829** und **Mixarium 0.806** (beide ≥0.80) → Sage kann der grüne
Gegenpart sein. Modul-Skripte lagen seit #473 schon geladen; nur der `init`-Aufruf
kam dazu. Headless-Chromium (SW geblockt) **6/6 grün** (Knopf mountet, Panel
toggelt, _meta.nodeName „Sage-Protokoll"). §11.6 SIGNAL seq 36.

**Offen:** Live-Test **Sage ↔ family** (oder Sage ↔ Mixarium) für das grüne
„ETABLIERT" — nach Merge + Pages-Deploy, Hard-Reload. Wartet auf Klaus.

## Bau-Sitzung 2026-06-28 · Modul 23 Rendezvous (gemeinsamer Raum)

**Rolle:** Bausitzung (Spec + Bau Modul 23) · **Branch:** `claude/module-23-rendezvous-rollout-zqaa8u`

**Auslöser:** am 2026-06-28 wurde der server-lose Live-Cross-Knoten-Handshake
bewiesen (Klaus' Browser-Lauf Tablet↔Handy: „✓ ANDOCK ETABLIERT mit Family
Projekt (lebende ID)"). Der Durchbruch war das **Rendezvous** (Klaus' Entwurf) —
es lebte aber nur als family-spezifischer Inline-Code in
`family-project/sbkim/sbkim-init.js`. Alle anderen Knoten lauschen zwar (Stufe 2),
sind aber nicht auffindbar. Ziel: das Rendezvous zu einem sauberen, geteilten
**Modul 23** machen und ins ganze Netz ausrollen.

**Was getan (Sage-Keystone, Schritt 1+2 des Briefs):**
- **Spec:** `docs/components/23_rendezvous.md` + INTERFACES.md §1 Modul 23
  (Surface, Tag `sbkim-rdv`, Presence-Schema, Verfassungs-Klausel, Daten-
  verträge 1:1 aus dem Prototyp).
- **Bau:** `src/modules/23_rendezvous.js` — konfig-getrieben (nodeName + Clients
  injiziert, KEINE family-Hardcodes), DOM-frei, fail-soft. Surface
  `SbkimRendezvous = { init/configure/announce/connectAndAnnounce/discover/
  handshakeCard/_meta }`. Reiner Tool-Code über die öffentlichen Flächen von
  Modul 05 (handshake/listenNostr) + 05b (publish/subscribe) + 02 (getOwnSpore);
  diese Kern-Module **unangetastet**.
- **Test:** Headless-Smoke `tests/smoke_bau23_rendezvous.mjs` **40/40 grün**
  (Mock-Relais + Mock-Spore + Mock-Anastomose; Karte heften, Raum lesen/dedupen/
  eigene filtern, Handshake an lebende Karte, fail-soft ohne Relais/bei Timeout).
- **Geteiltes UI** `src/modules/23_rendezvous_ui.js` (`SbkimRendezvousUI`) —
  Klaus-Entscheid 2026-06-28: öffentlicher, einheitlicher **Floating-Knopf**
  (kein `?dev`-Gate), byte-1:1 kopierbar, parametrisiert via
  `init({nodeName, createIdentity?})`. DOM-only, fail-soft, idempotent,
  createElement-basiert (stub-/real-DOM-fest). Komponiert nur Modul 23.
  Headless-Smoke `tests/smoke_bau23_rendezvous_ui.mjs` **23/23 grün**.
- **Mount:** Skript-Load beider in `index.html` (KEIN Auto-Init) + Panel 23 in
  `tests/manual_check.html` (Knöpfe mit Mock-Relais + „UI 🌐-Knopf mounten").

**Was offen:**
- **family-project refaktorieren** — Inline-Rendezvous-Code durch
  `SbkimRendezvous`-Aufrufe ersetzen (family wird Konsument). ⑥ + 🌐 müssen live
  weiterlaufen.
- **Endknoten-Ausrollung** — Modul 23 byte-1:1 in jede PWA + app-eigenes UI.
  Reihenfolge: Mein-Rezeptbuch zuerst, dann Mixarium, SB-KIMTool-Point,
  BookLedgerPro, Tresore. **Ein PR pro Repo.**
- **Klaus-Entscheidungen vor dem Rollout** (Brief §6): Andock-Tool öffentlich
  oder erst nach Rollout? UI-Einstiegspunkt pro App? nodeNames bestätigen?
- **Live-Cross-App-Sichttest** (zwei Geräte/Tabs, echtes Relais) — wartet auf
  Klaus. Headless ersetzt ihn nicht.

**Nächster sinnvoller Schritt:** family-project auf Modul 23 umstellen (Smoke
grün halten), dann Mein-Rezeptbuch ausrollen — nach Klärung der UI-Entscheidungen.

## Bau-Sitzung 2026-06-27 · Modul 05 Nostr-Relais-Transport (Stufe 2)

**Branch:** `claude/spore-generation-network-receipt-eyzz27` · **DRAFT-PR**
(sicherheits-sensibel, NICHT gemergt — braucht Klaus' Browser-Beweis gegen
das Live-Relais).

**Was gebaut (additiv, alte Pfade unberührt):**

- `src/modules/05_anastomose.js`: neuer Transport `"nostr"` in
  `ALLOWED_TRANSPORTS`. `handshake({transport:"nostr"})` (Sender) +
  `listenNostr()`/`stopListenNostr()` (Empfänger, explizit — KEIN Auto-Start
  in `init()`, Empfangsmodus). Einspielbarer Relay-Client über
  `_setNostrRelayClient(client|null)` (Default: `global.SbkimNostrRelay`).
  Event NIP-01 kind:1, tags `[["t","sbkim-anastomosis"],["d",<ZielId>],["x",<nonce>]]`,
  `content` = bestehende Ed25519-signierte Anfrage (kein neues Format).
  Verify-/sibling-/Log-Pfad = bestehender `consumeResponse`/`receiveHandshake`.
  **Sicherheit:** untrusted content wird vor Reaktion verifiziert (Spore +
  Ed25519 + Version + toNodeId-Map); Self-Hit ignoriert; Replay (doppelte
  nonce) abgelehnt; created_at-Zeitfenster ±15 min. `"auto"` wählt **nie**
  nostr.
- `src/modules/05b_nostr_relay.js` (**neu, browser-only**): echter
  WebSocket+`schnorr`-Client (Interface `{publish, subscribe}`), ephemerer
  Nostr-Key NUR als Transport-Umschlag, Default-Relais
  `wss://relay.family-projekt.de`, self-mountet `global.SbkimNostrRelay`.
  Kopf-Kommentar „Browser-Sichttest wartet auf Klaus".
- `src/modules/noble-secp256k1.js` (**neu**): 1:1-Kopie aus
  `pinnwand/modules/` (Schnorr/BIP340, lokal vendoriert, kein CDN).
- `tests/smoke_bau05_nostr.mjs` (**neu**): In-Memory-Mock-Relais.

**Headless-Beweis (echte Logik):**

- `smoke_bau05_nostr.mjs` **17/17 grün** — established Round-Trip via
  Mock-Relais inkl. nonceEcho/Verify/Sibling, verfälschter content
  abgelehnt, Replay abgelehnt (genau eine Antwort), fremde nodeId ignoriert,
  kein Relay-Client → sauberes `rejected` ohne Throw.
- Regression alle grün: 05y 25/25, 06y 25/25, 07y 30/30, 08y 26/26,
  15b 31/31, 16_sub_e_bronze 16/16, 16_andock 9/9.

**Ehrlich offen (wartet auf Klaus' Browser-Lauf):** der echte
WebSocket+schnorr-Client (Modul 05b) gegen das live laufende Relais. Das
Relais ist aus der Bau-Sandbox **nicht erreichbar** (wss blockiert) — nur
die Modul-05-Logik gegen das Mock-Relais ist bewiesen, NICHT der echte
Netz-Transport. Nächster Schritt: Modul 05b im Browser laden, zwei Knoten
gegen `wss://relay.family-projekt.de` (oder lokales Relais) andocken,
`listenNostr()` auf einem, `handshake({transport:"nostr"})` auf dem anderen.

## Offene Querschnitts-Fragen

- **DeX-Chrome vs. Tablet-Chrome — zwei getrennte Browser-Instanzen**
  (eingetragen 2026-05-17, Mini-Pflege „Live-Channel-Handshake"). Auf
  Klaus' Galaxy Tab S6 mit Samsung DeX laufen Chrome am externen
  Monitor und Chrome am Tablet-Display als **faktisch zwei getrennte
  Browser-Instanzen** — eigene IndexedDB, eigene Service-Worker, eigene
  PWA-Liste. Eine in DeX angedockte Spore-Identität ist im Tablet-Modus
  nicht da; eine im Tablet installierte PWA bleibt nach DeX-
  Deinstallation weiter da. **Konsequenz für BroadcastChannel:** Channel-
  Bridge funktioniert nur, wenn beide Tabs in **derselben** Instanz
  laufen. Klaus' Endknoten-IndexedDB war am 2026-05-17 verloren
  (Ursache nicht abschließend geklärt — vermutlich Chrome-Update,
  versehentliches „Site-Daten löschen", oder Storage-Quota), beide
  Endknoten wurden in DeX-Chrome neu angedockt mit neuen nodeIds
  (`BSWxXm…` Rezeptbuch + `JOlHK3…` Mixarium). **Generalisierung:**
  dasselbe Phänomen tritt auf bei Chrome-Profil-Wechsel, Inkognito-
  Modus, Standalone-PWA vs. Tab-Modus. Tech-Note für Andocker /
  Programmierer in [`docs/OBSERVATORIUM_BROWSER.md`](OBSERVATORIUM_BROWSER.md)
  § Lehre 1. **Status:** dokumentiert, kein Code-Eingriff nötig —
  Workaround ist Single-Instance-Disziplin oder Backup-Import.

- **SW-Bridge-Phantom-Cache-Bug in Modul 05** (eingetragen 2026-05-16,
  Live-Andock-Sitzung Cross-Knoten-Handshake; **2026-05-17 vollständig
  aufgelöst — Status: Architektur-Grenze sauber benannt, Code-Eingriffe
  abgeschlossen, Endknoten-Pflege erledigt, Live-Cross-Knoten-Handshake
  via BroadcastChannel-Pfad bewiesen**). Beim
  Cross-Knoten-Handshake via `SbkimAnastomose.handshake(peerSpore,
  ownVec)` schickt Modul 05 einen POST an `peer.endpoint +
  "/sbkim/anastomosis"`. Der Phantom-Effekt — `outcome:"rejected",
  reason:"toNodeId stimmt nicht zum Empfänger"` trotz korrekter
  Identität im aktiven Tab — hatte **zwei Wurzeln**:
  1. **`clients.matchAll({includeUncontrolled:true})`** lieferte
     Pages, die der SW nicht kontrolliert (Phantom-Cache aus
     anderen Pfaden derselben Origin). → **gefixt in PR #70
     (2026-05-17 morgens, `bd895d3`)**: `includeUncontrolled:false`
     + Loop-Logik „alle controlled Clients der Reihe nach".
  2. **`isPathSuffix` scope-unbewusst** — fing JEDEN Pfad ab, der
     auf `/sbkim/<endpoint>` endet, also auch Cross-Scope-Pfade,
     wo ein Mein-Rezeptbuch-Tab `fetch('/Mein-Mixarium/sbkim/
     anastomosis')` macht und Mein-Rezeptbuchs SW (als Controller
     des Senders) abfängt statt durchzulassen. → **gefixt in
     Pflege 2026-05-17 (dieser Eintrag, Branch
     `claude/fix-sw-scope-paths-I70qE`)**: `isOwnEndpoint(...)`
     leitet erwarteten Pfad aus `self.registration.scope` ab,
     strikte Gleichheit; Cross-Scope-Fetches fallen durch
     (→ Network → 404).
  **Spec-Klarheit (Architektur-Grenze, kein Bug):** same-origin
  cross-PWA Handshake via SW-Bridge bleibt damit **konzeptuell
  unmöglich** — Subresource-Fetches gehen durch den SW des Senders,
  nicht des Empfängers. Für Klaus' heutiges Test-Setup (beide PWAs
  auf `lausiklauskn-png.github.io`) braucht es eine andere
  Architektur. **Empfehlung für Folge-Spec-Sitzung Modul 05:**
  BroadcastChannel-Bridge als Fallback-Pfad — Sender postet Request
  auf `BroadcastChannel('sbkim')`, Receiver lauscht. Brief-Skelett
  im Übergabeprotokoll [2026-05-17 Pflege Scope-Fix](sessions/archiv/2026-05-17_pflege-sw-isPathSuffix-scope-fix.md)
  § 7. **Erledigt (Klaus-Sichttest 2026-05-17 nachmittags):**
  Endknoten-Pflege mit File-Rename in beiden Repos (Mein-Rezeptbuch
  `cbc2531` → `sbkim-sw-v2.js`, Mein-Mixarium `9b32dc7` →
  `sbkim-sw-v24.js` + SW_VERSION-Bump); Distinguishing-Test im
  Mein-Rezeptbuch-Tab lieferte **POST → HTTP 405** und **GET → HTTP
  404** direkt von GitHub Pages (nginx-Antworten, kein Bridge-JSON
  mehr). Architektur-Grenze von beiden Seiten bestätigt.
  **Vollständig erledigt 2026-05-17 abends (Mini-Pflege „Live-Channel-
  Handshake"):** Klaus hat in DeX-Chrome beide Endknoten neu angedockt
  und neue spore.json gepusht (Mein-Rezeptbuch `3bcc453` nodeId
  `BSWxXm…`, Mein-Mixarium `e9d0a45` nodeId `JOlHK3…`). Erster regulärer
  `SbkimAnastomose.handshake(peerSpore, ownVec)`-Aufruf zwischen den
  beiden Endknoten via Eruda — **`outcome:"established"`, score 0.9544
  in beide Richtungen, `sbkim_siblings` bidirektional gefüllt, kein
  localStorage-Bypass mehr nötig.** HTTP-Pfad scheitert weiterhin mit
  405/404 von Pages, Auto-Fallback in `handshake()` greift,
  Channel-Bridge routet zwischen den beiden DeX-Chrome-Tabs derselben
  Origin. Pflege-Kette PR #65 → #70 → #71 → #72 → #73 → #74 → #75 →
  #76 → diese Mini-Pflege vollständig geschlossen.

- **`domainKeywords`-Hartkodierung in Endknoten-`sbkim-init.js`**
  (eingetragen 2026-05-16). Klaus' Mein-Mixarium-`sbkim-init.js` hat
  `domainKeywords = ["Cocktail", "Drink", "Mocktail", "Limonade",
  "Smoothie", "Aperitif", "Sake"]` hartkodiert — die echten App-
  Kategorien sind aber `stammCategories = ["Cocktails", "Mocktails",
  "Alkfr. Cocktails", "Smoothies & Shakes", "Limonaden", "Tees &
  Kaffees", "Bowlen", "Sirup & Basis"]`. „Aperitif" und „Sake" sind
  in den `domainKeywords` aber nicht als App-Ordner präsent. Klaus'
  Beobachtung (Live-Andock-Sitzung) deckt eine Inkonsistenz auf:
  `domainKeywords` sollte aus den echten App-Kategorien abgeleitet
  werden, nicht aus einer alten Zwischen-Sitzung hartkodiert. Folge-
  Pflege Mein-Mixarium-/Mein-Rezeptbuch-`sbkim-init.js`: `domainKeywords`
  aus `stammCategories`/`guestCategories` zur Init-Zeit generieren
  (z.B. via App-DB-Lookup oder mindestens als konsistente Liste).
  **Konsequenz heute:** der semantische Embedding-Vektor ist robust
  genug, dass der Cross-Knoten-Handshake trotz Inkonsistenz mit
  `outcome:"established"` läuft — aber für saubere Match-Scores in
  einem wachsenden Netz wäre die Bereinigung wertvoll. Status:
  Folge-Pflege ausstehend, niedrig priorisiert.

- **Endknoten-Repo-Hygiene gegen parallele Auto-PRs** (eingetragen
  2026-05-16). Während der Live-Andock-Sitzung lief eine PARALLELE
  Claude-Sitzung mit Branch `claude/add-recipe-remove-scramble-5xx9Y`
  und hat PR #238 „Buchstabensalat-Fix im Rezept-hinzufügen-Button"
  in Mein-Rezeptbuch gemerged. Dieser PR hatte aber eine ältere
  Basis-Version der `index.html` genommen und dabei **alle 8 SBKIM-
  `<script>`-Tags + Eruda** still entfernt. Das hat den Handshake-
  Test in Mein-Rezeptbuch ~1 h lang blockiert (SBKIM-Module gar nicht
  geladen). Nachgepflegt durch Wieder-Einfügen vor `</body>` an Zeile
  14802. **Schutz-Vorschlag (Folge-Pflege):** SBKIM-Sentinel-File in
  jedem Endknoten-Repo (z.B. `sbkim/.sentinel`) und/oder GitHub-Action
  in beiden Endknoten-Repos, die prüft: (a) `grep -c "sbkim/" index.html
  >= 8`, (b) `sbkim/sbkim-init.js` enthält `SbkimStorage.init` UND
  `SbkimAnastomose.init`, (c) `sbkim/01_storage.js` enthält `dbSuffix`.
  Soll künftige Auto-PRs auf Endknoten verhindern, die die SBKIM-
  Andock-Schicht still wegfegen. Status: Folge-Pflege-Vorschlag,
  niedrig priorisiert.

- **Sichtbarkeits-Lampen in der Endknoten-PWA** (eingetragen
  2026-05-16, Klaus-Vorschlag nach Pflege PWA-Suffix). Idee von
  Klaus: zwei kleine Lampen oben rechts in der PWA, eine zeigt
  „Knoten lebt" (Identität geladen, Storage offen, Module geladen),
  die zweite blinkt kurz bei jedem Anastomose- oder Heterokaryose-
  Verkehr („gerade kommuniziert"). Soll für Endknoten-Nutzer und im
  Observatorium **sichtbar** machen, dass das Netz lebt — viel
  zugänglicher als das 5-Klick-Doku-Fenster oder Eruda. Setzt
  Modul 00 (Doku-Fenster) als Datenquelle voraus und braucht zwei
  bis drei CustomEvents in Modul 05/06 (`sbkim:handshake-start`/
  `sbkim:handshake-end`/`sbkim:hetero-pull-start`/…). **Status:**
  Spec ausstehend; eigene kleine Karte (vermutlich Karte 15 oder
  ein additiver Block in Karte 00). Spec-Sitzung sinnvoll, **nach**
  dem ersten erfolgreichen Cross-Knoten-Handshake — dann ist klar,
  was die zweite Lampe tatsächlich anzeigen soll. Geschätzt ~60 Min
  headless für Spec, ähnlich für Bau-Stub.

- **Andock-Bundle (`sbkim-bundle.js`)** als künftiger Ein-Datei-
  Andock-Pfad (eingetragen 2026-05-16, Klaus-Vorschlag nach
  Pflege PWA-Suffix). Heutiger Karte-09-Pfad (9 Schritte mit awk,
  Termux, Eruda, Spore-mv) ist Pionier-Tanz — funktioniert für
  Klaus, aber kein Nicht-Programmierer würde das nachmachen. Vision:
  Endknoten-Betreiber kopiert **eine** Datei (`sbkim-bundle.js`) +
  fügt **einen** `<script>`-Tag ein. Das Bundle erzeugt beim ersten
  Laden Identität, Domain-Vektor, Spore, klinkt sich beim Service-
  Worker ein und macht den Status sichtbar (s. Lampen oben). **Setzt
  voraus:** drei oder mehr Endknoten im Netz, damit der Aufwand
  spürbar wird (heute mit zwei reicht der Direkt-Pfad mit Klaus).
  **Status:** Spec ausstehend; eigene Karte (vermutlich Karte 16 oder
  09.2). Ist eine echte Architektur-Frage (Bundling-Strategie,
  Versions-Update-Pfad, wie liefert der Bundle die Andock-Konfig),
  keine reine Pflege.

- ~~**Identitäts-Persistenz**~~ — **final gelöst 2026-05-16 durch
  drei aufeinander folgende Sitzungen am selben Tag** (Pflege
  Storage-Persist, Spec+Bau Backup-Export, Pflege Persistenz-
  Strategie verbinden). Klaus' Befürchtung: tiefes Browserspeicher-
  Löschen tötet die nodeId. Drei Stufen, die zusammen die echte
  „Spur stirbt nicht"-Architektur ergeben — alle drei jetzt geschlossen:
  (1) ~~**`navigator.storage.persist()`** beim `Storage.init` — bittet
  den Browser, IndexedDB von normalem Aufräumen auszunehmen.
  Modul-01-Folge-Pflege, headless möglich, ~30 Min.~~ — **gelöst
  2026-05-16 durch Pflege-Sitzung „Storage-Persist".** Modul 01
  ruft nach erfolgreichem DB-Open `navigator.storage.persist()` an
  (fail-soft); `_meta.storagePersisted` zeigt `true`/`false`/`null`
  als Live-Zustand. Details im [Übergabeprotokoll 2026-05-16 Pflege
  Storage-Persist](sessions/archiv/2026-05-16_pflege-01-storage-persist.md).
  (2) ~~**Backup-Export passwort-verschlüsselt** in Modul 02 — Klaus
  speichert eine `*.sbkim-backup.json` woanders und kann sie bei
  Browser-Wechsel zurückimportieren. Modul-02-Folge-Spec, ~60 Min.~~
  — **gelöst 2026-05-16 durch Spec-Sitzung Backup-Export Stufe 2 + Bau
  02.X Backup-Export** (selbiger Tag): Spec verankerte `exportBackup` /
  `importBackup` + drei §0-Konstanten + fünf Error-Klassen
  (PBKDF2-SHA256 600 000 + AES-GCM-256, Backup-Inhalt = Identität +
  Geschwister Pflicht-Frage 1 Variante b, Import-Überschreibung
  defensiv Pflicht-Frage 3 Variante a). Bau 02.X zog den Code
  additiv in `src/modules/02_spore.js` nach (drei Helper-Reuse-
  Entscheidungen: bestehende kanonische Sort + base64url-Helper +
  `resetIdentityCache`-Hook werden wiederverwendet, KEIN Refactoring;
  Panel 02 in `tests/manual_check.html` um drei Knöpfe „Backup
  exportieren" / „Backup einlesen" / „Identität ersetzen —
  unwiderruflich" erweitert). Details im
  [Übergabeprotokoll 2026-05-16 Spec Backup-Export](sessions/archiv/2026-05-16_spec-02-backup-export.md)
  und [Bau 02.X Backup-Export](sessions/archiv/2026-05-16_bau-02x-backup-export.md).
  **Sichttest** durch Klaus im Browser steht aus (headless gebaut —
  Tab-S6-PBKDF2-Aufruf-Zeit, AES-GCM-Verhalten in Safari iOS).
  (3) ~~**Quota-Frühwarnung im Doku-Fenster** — schon spezifiziert
  (Modul 00, `DOKU_QUOTA_WARN_RATIO=0.80` / `…_BYTES=50 MiB`); zeigt
  Warnzeile, bevor der Browser aufräumt.~~ — **final gelöst
  2026-05-16 durch Pflege-Sitzung „Persistenz-Strategie verbinden".**
  Modul 00 zeigt jetzt zusätzlich eine deutschsprachige
  „Backup empfohlen"-Tipp-Zeile (`DOKU_BACKUP_TIP_TEXT` modul-lokal),
  wenn `SbkimStorage._meta.storagePersisted === false` ODER
  `quota.warningLevel !== "none"`. `getStatusSnapshot()` spiegelt
  `storagePersisted: boolean | null` als neues Feld (fail-soft mit
  `typeof`-Check; `null` und `true` triggern nicht, nur explizites
  `false`). Hinweis-only, kein Direkt-Aufruf von
  `SbkimSpore.exportBackup` aus Modul 00 — Aufrufer-Pflicht-Trennung
  (Modul 00 bleibt reines Lese-/Trigger-Modul). **Sichttest geprüft
  2026-05-16** (Klaus, im Browser) — Drei-Setup-Probe aus Karte 00 §
  Manueller Test Punkt 7 alle drei Pfade grün (Persist-Trigger,
  Quota-Trigger, Negativ-Fall). Details im
  [Übergabeprotokoll 2026-05-16 Pflege Persistenz-Strategie
  verbinden](sessions/archiv/2026-05-16_pflege-persistenz-strategie-verbinden.md).
  **Architektur-Anmerkung:** *Nicht* als Selbst-Heilung über
  hartcodierten Schlüssel (Sicherheits-Bruch — jeder Repo-Forker
  hätte die Identität). `getOrCreateIdentity` legt bei leerem
  Storage eine **neue** Identität an (neue nodeId); erhalten bleibt
  der alte Knoten nur über Backup-Restore. Die Tipp-Zeile macht den
  Restore-Pfad sichtbar, klickt aber den Panel-02-Knopf nicht
  automatisch.

- ~~**IndexedDB-Origin-Kollision bei GitHub-Pages-Project-Sites**~~ —
  **gelöst 2026-05-16 durch Pflege-Sitzung „Karten 01 + 09 PWA-
  Suffix".** Variante (a) aus dem ursprünglichen Eintrag (PWA-Suffix
  in Storage-DB-Name) umgesetzt: Modul 01 akzeptiert jetzt optional
  `init({ dbSuffix: "<wert>" })` und öffnet die DB unter dem Namen
  `sbkim_<dbSuffix>` statt der Default-DB `sbkim`. Pattern für
  Suffix: `^[a-z0-9_-]+$` (sonst synchroner `InvalidDbSuffixError`).
  Modul 02 unangetastet (`IDENTITY_KEY = "main"` weiterhin Singleton-
  Schlüssel innerhalb der jeweiligen DB — Trennung passiert eine
  Schicht tiefer, auf DB-Namen-Ebene). Modul 05 unangetastet
  (`SbkimAnastomose.init()` weiterhin ohne Optionen; Idempotenz von
  `Storage.init` macht den zwei-Aufruf-Pfad sauber). Karten 01 + 09
  + INTERFACES.md §1 Modul 01 + §6 nachgezogen. `PROTOCOL_VERSION`
  bleibt `"0.1"`. Klaus' Re-Andock beider Endknoten (in beiden
  `sbkim-init.js` `SbkimStorage.init({dbSuffix})` vor
  `SbkimAnastomose.init()` einfügen + `__sbkimErzeugeSpore()`
  triggern + neue Spore deployen) steht aus — danach wechselt
  `status.json` `pingStatus` von `"blocked-origin-collision"` auf
  `"live"` für beide Endknoten in einer Folge-Sitzung. Variante
  (b) (eigene Subdomain mit Custom Domain) bleibt als langfristige
  Option dokumentiert. Details im
  [Übergabeprotokoll 2026-05-16 Pflege PWA-Suffix](sessions/archiv/2026-05-16_pflege-pwa-suffix-karten-01-09.md);
  Reproduktion der ursprünglichen Kollision im
  [Übergabeprotokoll 2026-05-16 Andock Mein-Rezeptbuch](sessions/archiv/2026-05-16_andock-mein-rezeptbuch-iteration-3-live.md).
- ~~**Karten-Lücke Karte 09 / Tablet-Sichtkontrolle**~~ — **gelöst
  2026-05-15 durch Pflege-Sitzung Karte 09 „App-SW-Koexistenz +
  Tablet-Sichtkontrolle" (diese Sitzung).** Karte 09 § Sichtkontrolle
  hat jetzt einen § Tablet-Variante-Sub-Block mit Eruda-Pfad
  (in-Page-DevTools-Polyfill, gepinnt auf `eruda@3`, jsdelivr-CDN,
  touch-bedienbar). Mapping der vier Pflicht-Punkte auf Eruda-Tabs
  (Console / Resources→IndexedDB / Network / 5-Klick-Geste).
  Verbindlicher Hinweis „nach Sichtkontrolle wieder entfernen —
  kein Produktiv-Einbau, kein SBKIM-Modul, kein Datenschutz-Stein".
  Details im Übergabeprotokoll
  [2026-05-15 Pflege Karte 09 App-SW + Tablet](sessions/archiv/2026-05-15_pflege-karte-09-app-sw-tablet.md).
- ~~**Karten-Lücke Karte 09 / Andocken in PWA mit bestehendem
  Service-Worker**~~ — **gelöst in zwei Pflege-Sitzungen 2026-05-15:**
  (a) Pflege App-SW-Koexistenz (PR #31, 2026-05-15) hat Schritt 3
  in 3a/3b verzweigt mit Pre-Flight-Check
  (`navigator.serviceWorker.getRegistration('./')`),
  Variante 3b = `importScripts('./sbkim-sw.js')` in bestehendem
  App-SW (= Option α), `SBKIM_SW_STANDALONE`-Flag in
  `src/sbkim-sw.js` (Default `true`, `false` für 3b), achtes
  Risiko „App-SW-Überschreibung" in § Risiken; (b) Pflege Karte 09
  „App-SW-Koexistenz + Tablet-Sichtkontrolle" (diese Sitzung,
  2026-05-15) hat zusätzlich **Variante 3c** als nachrangige
  Übergangslösung dokumentiert (SBKIM-SW unter `/sbkim/` mit Scope-
  Einschränkung = Option β; Option γ „App-SW ersetzen" entspricht
  der heutigen falschen Anwendung von Variante 3a auf eine PWA mit
  App-SW und ist als achtes Risiko bereits dokumentiert) plus eine
  Tabelle „Wann welche Variante?" als Andock-Entscheidungshilfe.
  Details im Übergabeprotokoll
  [2026-05-15 Pflege Karte 09 App-SW + Tablet](sessions/archiv/2026-05-15_pflege-karte-09-app-sw-tablet.md).
- ~~Werden Domain-URLs der Endknoten-Apps in `docs/PULS.md` /
  `status.json` aufgenommen oder nur lokal in deren `index.html`?~~ —
  **teilweise gelöst 2026-05-15** in abgebrochener Bau-Sitzung 09:
  Pages-URLs in PULS-Tabelle „Endknoten" und `status.json`
  `endknoten[*].url` eingetragen (`integrated:false` bleibt — Andock
  nicht erfolgt). Eintrag in `docs/INTERFACES.md` weiterhin offen.
- Werden Domain-URLs der Endknoten-Apps in `docs/INTERFACES.md` aufgenommen
  oder nur lokal in deren `index.html`? → Entscheidung steht aus.
- Embedding-Modell: bleibt es bei Default `Xenova/multilingual-e5-small`?
  → ja, bis Gegenargument. Quelle: `sbkim_integration.md` §4.1.
- ~~Speicherort der Spore bei GitHub Pages: `/.well-known/sbkim/spore.json`
  oder Alias `/sbkim/spore.json`?~~ — **gelöst 2026-05-14 in Spec-Sitzung
  09:** verbindlicher Andock-Default ist `/sbkim/spore.json` (Alias aus
  §3 INTERFACES). Begründung in `docs/components/09_einbau_pwa.md`
  Schritt 7: GitHub-Pages-Project-Sites haben mit `.well-known/` die
  Jekyll-Dot-Ordner-Falle, `/sbkim/spore.json` bündelt zudem alle
  SBKIM-Pfade unter `/sbkim/` (semantisch sauber).
- **Wording-Diskrepanz**: `CLAUDE.md` führt SBKIM als
  "Semantisch-Biologisch Koordiniertes Inter-Knoten-Mycel" — das Paper
  (Kap. 1.2) führt es als "Semantisch-Empfangendes Bidirektionales
  KI-Matching". Das Observatorium (`index.html`, `status.json`) übernimmt
  die Paper-Variante. CLAUDE.md sollte in einer separaten Sitzung
  nachgezogen werden.
- ~~**A1–B3-Notations-Überlappung Sage ↔ Mixarium**~~ — **gelöst
  2026-05-14 in Spec+Bau-Sitzung Modul 04.** Die Synthese „Hops tragen
  die Funktionen" steht jetzt verbindlich in
  [`docs/components/04_match.md` § A1–B3-Synthese](components/04_match.md):
  Pfad A = Curator → Auditor → Devil's Advocate (Anbieter-Seite
  verfeinert die Antwort); Pfad B = Interviewer → Matcher → Critic
  (Anfrage-Seite verfeinert die Frage), mit Apoptose bei B4 im
  Negativ-Fall. Sage zeigt die *Geometrie* der Hop-Position, Mixarium
  zeigt die *Rolle* — beide Notationen bleiben gültig, sie beschreiben
  dieselbe Wanderung aus zwei Winkeln. Kein eigenes Mapping-Dokument
  nötig.
- ~~**Spore-Persistenz-Strategie verteilt**~~ — **final gelöst
  2026-05-16 durch die vier aufeinander folgenden Sitzungen zur
  Identitäts-Persistenz** (Pflege Storage-Persist, Spec+Bau Backup-
  Export, Pflege Persistenz-Strategie verbinden). „Stille Löschung
  ohne Vermächtnis" (Karte 07 § Risiken) war nicht in einem
  einzelnen Modul lösbar — vier Stellen mussten beim Bauen
  zusammenpassen; alle vier stehen jetzt:
  - ~~**Modul 01 Storage:** `navigator.storage.persist()` beim `init()`
    + `navigator.storage.estimate()` für Quota-Frühwarnung —
    offen.~~ — **gelöst 2026-05-16** (Pflege Storage-Persist):
    `navigator.storage.persist()` fail-soft im Init-Pfad,
    `_meta.storagePersisted` als Live-Zustand-Getter. Quota-Estimate
    liegt seit Bau 00 (2026-05-14) in Modul 00.
  - **Modul 02 Spore:** Backup-Export (passwort-verschlüsselt) als
    Recovery-Pfad für Browser-Wechsel und manuelles Löschen —
    **Spec fertig 2026-05-16** (Spec-Sitzung Backup-Export Stufe 2):
    `SbkimBackupBlob`-Format (PBKDF2-SHA256 mit `BACKUP_KDF_ITERATIONS=600000`
    + AES-GCM-256), Klartext-Payload = Identität + bekannte Geschwister
    (Pflicht-Frage 1 Variante b), Import per Default defensiv
    (`BackupOverwriteError`, Pflicht-Frage 3 Variante a), drei
    §0-Konstanten verankert. **Code-Stub fertig 2026-05-16** (Bau 02.X
    Backup-Export, selbiger Tag): additiv in `src/modules/02_spore.js`
    — fünf Error-Klassen + drei modul-lokale Konstanten + drei §0-
    Konstanten gespiegelt + neuer Closure-Helper
    `derivePbkdf2AesGcmKey` (PBKDF2 → AES-GCM-256); drei Helper-Reuse-
    Entscheidungen (`canonicalize`/`canonicalJsonBytes`, `base64urlEncode`/
    `Decode`, `resetIdentityCache`) — kein Refactoring der bestehenden
    Funktionen. Panel 02 in `tests/manual_check.html` um drei Knöpfe
    erweitert (Export / Einlesen / Identität-ersetzen-force).
    Sichttest durch Klaus im Browser steht aus.
  - **Modul 00 Doku-Fenster:** stille Frühwarnung bei < X% Speicher
    (X als gemeinsame Konstante in §0) — **gelöst 2026-05-14 durch
    Spec-Sitzung 00:** `DOKU_QUOTA_WARN_RATIO = 0.80` UND
    `DOKU_QUOTA_WARN_BYTES = 52428800` (50 MiB) verbindlich in §0
    eingetragen (Doppel-Schwelle; Warnzeile bei Überschreitung einer
    der beiden). Konsistenter Schwellwert-Anker für Modul 01 und
    Modul 02. **Plus Pflege Persistenz-Strategie verbinden 2026-05-16:**
    Modul 00 zeigt jetzt zusätzlich eine deutschsprachige
    Backup-Tipp-Zeile (`DOKU_BACKUP_TIP_TEXT` modul-lokal), wenn
    `_meta.storagePersisted === false` ODER `quota.warningLevel !==
    "none"`. `getStatusSnapshot()` spiegelt `storagePersisted` als
    neues Feld (fail-soft). Hinweis-only, kein Direkt-Aufruf von
    `SbkimSpore.exportBackup` aus Modul 00.
  - **Modul 07 Apoptose:** Risiko-Vermerk „stille Löschung" (steht
    jetzt in Karte 07 § Risiken).

  **Die vier Stellen sind jetzt konsistent:** Quota-Schwellwert (zwei
  Zahlen in §0, Modul 00 Code-Befehl), Backup-Format (`SbkimBackupBlob`
  PBKDF2/AES-GCM, Modul 02 Code + Panel 02), Warntext (`DOKU_BACKUP_
  TIP_TEXT` deutsch, Modul 00), Risiko-Vermerk (Karte 07 § Risiken).
  Sichttest durch Klaus im Browser steht für Modul 02 + Modul 00 noch
  aus (beide headless gebaut).
- ~~**Spore-Diffusion: passiv (Pfad 1) vs. konsensuell-empfehlend
  (Pfad 2) vs. parasitär-mitreisend (Pfad 3)?**~~ — **gelöst
  2026-05-15 in Hauptsitzung 14-Diffusion-Stub durch Anlage
  [`docs/components/14_diffusion.md`](components/14_diffusion.md)**.
  Frage entstand in der abgebrochenen Bau-Sitzung Modul 09 vom
  2026-05-15 (siehe parallele Pflege-Sitzung Karte 09 „App-SW-
  Koexistenz" auf eigenem Branch). Verbindliche Auswahl: **Pfad 2
  (konsensuell-empfehlend)** über `recommendedPeers: SporeRef[]` als
  optionales Handshake-Antwort-Feld (max. 2 Einträge), Empfänger
  speichert als Lead mit TTL, opt-in pro Empfehlung — drehbuchkonform,
  weil jede Übergabe im Konsens. **Pfad 1 (passiv via
  `/sbkim/spore.json`)** bleibt Default-Mechanismus parallel.
  **Pfad 3 (parasitär-mitreisend)** explizit verworfen, weil er das
  Empfangsmodus-Prinzip aus `CLAUDE.md` und `sbkim_paper.pdf`
  („Kein Crawler, keine Pulsation, keine Eigenanfragen ins offene
  Netz") bricht. Modul 14 bleibt Stub bis Netz wächst (Schwelle siehe
  Diffusion-Backlog unten); Karte 05 wird in der Stub-Sitzung
  NICHT angefasst.
- ~~**Sage-Page sichtbar machen für Modul 14**~~ — **gelöst
  2026-05-15 durch Pflege-Sitzung Sage-Page Modul 14.**
  `index.html` rendert jetzt `diffusionBacklog[]` parallel zu
  `schutzBacklog[]` in zwei datengetriebenen Karten (Karte 4
  Module-Bento, Karte 14 Bau-Puls jeweils mit parallelem Divider
  „Diffusion-Backlog · proaktiv · Priorität niedrig"), Pie zählt
  jetzt 14 Module mit 5 Schablonen. Zusätzlich bekommt Karte 13
  Eigenschutz einen zweiten parallelen `schutz-backlog`-Block
  „Diffusion-Backlog · proaktiv (Wuchs durch Empfehlung)"
  sprachlich klar abgegrenzt vom Schutz-Backlog-Block („reaktiv");
  `schutz-pilz`-Schlussspruch um die Diffusion-Zeile erweitert
  („wächst, indem er Notizen über Nachbarn weitergibt, nicht ins
  Leere pulst"). Schema-Beispiel in Karte 7 zeigt jetzt
  `diffusionBacklog: []` parallel zum `schutzBacklog: []`-Kommentar.
  `status.json` unverändert (PR #29 hatte die Daten schon geliefert).
  `update_puls_pie.py` NICHT erneut aufgerufen (keine Modul-Daten-
  Änderung). Details im Übergabeprotokoll
  [2026-05-15 Pflege Sage-Page Modul 14](sessions/archiv/2026-05-15_pflege-sage-page-modul-14.md).

## Schutz-Backlog (aus Sage-Page Karte 13, 2026-05-10)

Drei strukturelle Lücken im Schutz-Modell sind beim Aufbau des
Observatoriums sichtbar geworden. Stubs sind angelegt; gezogen werden sie
ab spürbarem Wachstum:

- `docs/components/10_reputation.md` — Knoten-Reputation
- `docs/components/11_rate_limit.md` — Rate-Limit & TTL
- `docs/components/12_blocklist.md` — manuelle Blocklist

Eigenschutz-Karte der Sage-Page macht das Backlog für jeden Besucher
sichtbar und verlinkt direkt auf die Stubs.

### Diffusion-Backlog (aus Hauptsitzung 14-Diffusion-Stub, 2026-05-15)

Schutz und Diffusion sind zwei verschiedene Backlog-Kategorien. Der
Schutz-Backlog (10/11/12) ist **reaktiv** — er wehrt Schaden ab, wenn
das Netz groß genug ist, dass Apoptose und Match-Filter allein nicht
mehr reichen. Der Diffusion-Backlog ist **proaktiv** — er beschleunigt
das Wachstum durch konsensuelle Empfehlung beim Handshake, ohne das
Empfangsmodus-Prinzip zu brechen.

- `docs/components/14_diffusion.md` — konsensuell-empfehlende Spore-
  Diffusion via Handshake-Erweiterung (`recommendedPeers: SporeRef[]`
  als optionales Feld in der `HandshakeResponse`, max. 2 Einträge,
  Empfänger speichert als Lead mit TTL, opt-in pro Empfehlung)

Pfad-Auswahl verbindlich Pfad 2 (konsensuell-empfehlend);
Pfad 1 (passiv via `/sbkim/spore.json`) bleibt Default-Mechanismus
parallel; Pfad 3 (parasitär-mitreisend) verworfen wegen
Empfangsmodus-Prinzip aus `CLAUDE.md` + `sbkim_paper.pdf`.

Modul 14 wird gezogen, sobald **Netz ≥ 10 aktive Geschwister ODER
Bau-Sitzung Modul 09 erfolgreich abgeschlossen UND spürbares
Wachstums-Bedürfnis** — parallel zur 10/11/12-Logik.

`status.json` führt Modul 14 als eigenes Feld `diffusionBacklog[]`
parallel zu `schutzBacklog[]` (proaktiv vs. reaktiv); `scoreModel.
maxScoreNote` bleibt unangetastet (Backlog zählt nicht zum maxScore).
Das Pie-Skript `scripts/update_puls_pie.py` zählt beide Backlog-
Kategorien jetzt mit.

### Membran-Backlog (aus Hauptsitzung 15-Membran-Stub, 2026-05-18)

Schutz, Diffusion und Membran sind drei verschiedene Backlog-Kategorien.
Schutz (10/11/12) ist **reaktiv** — wehrt Schaden ab, wenn Apoptose
und Match-Filter allein nicht mehr reichen. Diffusion (14) ist
**proaktiv nach innen** — beschleunigt Wachstum durch konsensuelle
Empfehlung beim Handshake. Membran (15) ist **proaktiv nach außen** —
regelt die Außenhülle zwischen PWA-Zelle und Browser-Umgebung:
KI-Browser-Agenten (Anthropic Browser Use, OpenAI Operator, Comet,
Dia, Arc-Nachfolger) und Cross-Origin-App-zu-App-Brücken im selben
Browser ohne Server-Hop.

- `docs/components/15_membran.md` — Außenhülle des Knotens mit vier
  Sub-Bereichen: (a) Read-API für In-Browser-Agenten (lesend, keine
  Keys, `nodeIdHash` statt `nodeId` für Geschwister), (b) App-zu-App-
  Brücke via `postMessage` mit strikter Origin-Allowlist
  (`type:"sbkim/membrane/v1"`, `op:"sporeRef"|"query"|"hint"`, **kein**
  `handshake`), (c) signiertes Capability-Token analog Modul 02-Ed25519
  (später), (d) Backup-Datei als manueller App-Transport — existiert
  bereits in Modul 02 Bau 02.X, Karte 15 verweist nur.

Auswahl-Stufen verbindlich (a) + (b) Pflicht, (c) später, (d) nur
dokumentiert. Empfangsmodus-Prinzip bleibt absolut: Membran initiiert
nichts, sie hat nur Rezeptoren und Kanäle, kein `op:"handshake"` in
Sub (b), kein `scope:"write"` in Sub (c) Stufe 3.

Modul 15 wird gezogen, sobald **mindestens zwei** der folgenden
Bedingungen erfüllt sind (höhere Schwelle als 14, weil Membran-Bau
neue Angriffsfläche eröffnet):

- KI-Browser real verfügbar (Anthropic Browser Use SDK oder OpenAI
  Operator öffentlich mit dokumentiertem JS-Bridge-Mechanismus)
- App-zu-App-Wunsch konkret (Klaus oder Drittnutzer äußern Bedürfnis
  nach Cross-Origin-Konversation ohne Server)
- Dritter Endknoten ausserhalb `github.io` will sich andocken

`status.json` führt Modul 15 als eigenes Feld `membranBacklog[]`
parallel zu `schutzBacklog[]` und `diffusionBacklog[]`; `scoreModel.
maxScoreNote` präzisiert „Schutz-Backlog (10-12), Diffusion-Backlog (14)
und Membran-Backlog (15) zählen nicht mit". Das Pie-Skript
`scripts/update_puls_pie.py` zählt alle drei Backlog-Kategorien jetzt
mit (15 Module / 5 Schablonen seit dieser Sitzung).

---

## Vision-Anker (langfristig, kein Bau-Auftrag)

**Was ist das?** Visionen, die in Sitzungen aufgekommen sind und
nicht verloren gehen sollen, ohne dass sie sofort Spec oder Bau
auslösen. Sie warten auf eine Reifezeit oder einen passenden
Auslöser. Pflege-Disziplin: Vision wird hier festgehalten, mit
Datum + Sitzungs-Bezug + ungefährer Größenordnung. Wer sie ziehen
will, formuliert daraus einen Spec-Sitzungs-Brief.

### 2026-05-28 · Sporenpflege-Lehre — Schlüssel = Auffindbarkeit

**Eingetragen:** Pflege-Sitzung 05+18 Handshake-Eigenvektor 2026-05-28,
aus Klaus' Erkenntnis: „Sporenpflege ist wichtig, sonst kann man im
Netz nicht wiedergefunden werden oder muss sich neu einbetten und
handshaken."

**Die Lehre (Baumeister-Klärung):** Eine SBKIM-Zelle ist **zwei
Dinge** — das **Ed25519-Schlüsselpaar** (`sbkim_keys`, slot=main) ist
die *wahre Identität*, die `spore.json` nur die *signierte
Visitenkarte*. Die `nodeId` = `base64url(sha256(publicKey))` hängt
**ausschließlich** am Schlüssel. Daraus folgt die Auffindbarkeits-
Hierarchie:

| Pflege | nodeId bleibt? | Re-Handshake nötig? | Modul |
|---|---|---|---|
| **Schlüssel-Backup** (kritisch) | ja | nur bei Schlüsselverlust | 02 Backup / 18 Sub (d) |
| **Re-Spore / Re-Embedding** (Domänenwechsel) | ja | nein — Geschwister behalten dich | 18 Sub (f)+(g) |
| **Voll-Reset** (Notfall, neuer Schlüssel) | **nein, neu** | ja, überall | — |

**Drei Verlust-Fälle:**

1. **Schlüsselpaar weg** (IndexedDB gelöscht, neues Gerät, **anderer
   Browser** — DeX-Chrome ≠ Tablet-Chrome, getrennte Speicher!) →
   neue nodeId → für alle ein Fremder, überall neu handshaken. **Die
   eigentliche Gefahr.** Schutz: Schlüssel-Backup.
2. **Domäne/Stichworte geändert** → `domainVector` veraltet → neu
   einbetten + neu signieren (Sub f/g). nodeId bleibt.
3. **Protokoll-Version springt** → Spore-Format/Signatur ungültig →
   neu signieren.

**Größenordnung:** eigene Bau-Sitzung „Modul 18 Sub (d)+(f)+(g) —
Sporenpflege" (Brief liegt: `docs/sessions/BRIEF_PFLEGE_18_SPORENPFLEGE.md`).
Backup-/Restore zuerst (kritisch), dann Re-Spore + Re-Embedding, alles
über Test-Bridge-Knöpfe (kein Konsolen-Hack). Pipeline: nach App-
Freigabe-Strang, parallel zu Modul-18-Voll-Spec (5h.2) möglich.

### 2026-05-17 · Sage als Hybrid-Knoten (Variante I)

**Eingetragen:** Mini-Pflege „Vision-Anker" 2026-05-17 (Folge zu
Live-Channel-Handshake, PR #77 `7c08b88`). Klaus' Bild: die
Ameisenkönigin bleibt eine Ameise, auch wenn sie sich nicht vom
Fleck bewegt. Sage-Protokol kann Hub bleiben **und** zugleich ein
vollwertiger Endknoten werden — selbstreferenziell wie ein Mycel,
das seine eigene Karte ist.

**Was sich ändert (Spec-Sitzungs-Aufgabe, nicht jetzt umsetzen):**

- **CLAUDE.md** umschreiben — Satz „Es ist kein Endknoten" fällt;
  Sage wird als „Hub und Knoten zugleich" neu eingeführt.
- **INTERFACES.md § Endknoten-Liste** nimmt Sage als dritten Knoten
  auf, neben Mein-Rezeptbuch und Mein-Mixarium.
- **`status.json` § endknoten** bekommt einen `sage`-Eintrag mit
  eigener Domäne, nodeId (nach erstem Andocken), `pingStatus`.
- **Sage-Page (`index.html`)** muss alle SBKIM-Module mit voller
  `init()`-Kette laden (aktuell vermutlich nur Doku-Render). Modul
  03 Embedding (~30 MB) lädt erst beim ersten Andocken — UX-
  Vorwarnung in der Andock-Geste.
- **Sage's Domäne klären:** `domain` / `domainDescription` /
  `domainKeywords` / `domainVector`. Vorschläge im Spec-Brief:
  „Mycel-Bibliothek" / „SBKIM-Glossar" / „Sage-Observatorium".
  Stamm-/Gast-Kategorien? Brieferer Vorschlag: Stamm = Protokoll-
  Doku / Mycel-Vokabular; Gast = Glossar-Wartung / Schwesternetz-
  Beobachtungen.
- **IndexedDB-Suffix `sbkim_sage`** (analog `sbkim_rezeptbuch` /
  `sbkim_mixarium`).
- **App-SW-Variante 3a** (Standalone `sbkim-sw.js` im Sage-Page-
  Root, weil aktuell kein App-SW existiert).
- **Schwarz-Loch-Karte:** Klick könnte zukünftig nicht nur die
  Doku-md öffnen, sondern auch einen Andock-Wizard für Sage's
  Spore-Erzeugung anbieten (Hand in Hand mit Variante III unten).
- **Karte 09 § Schritt 1** wird neu eingefügt: „Sage-Observatorium
  selbst ist auch ein Endknoten — wer sich am Sage-Mycel andockt,
  bekommt es als Geschwister."

**Größenordnung:** Spec-Sitzung erster Aufgabe ~3-4 Stunden für
gründliche Klärung (kein Bau-Code, nur Verträge); danach Bau-
Sitzung ~2-3 Stunden für Sage-Page-Refactor + SW-Anlage + Andock-
Geste.

**Status:** **Strang 1 der V1-Sammelspec realisiert (2026-05-18, Brief
01 der V1-Sammelspec-Kaskade) + Sammelspec-Abschluss (Brief 99)
abgeschlossen (2026-05-19).** Sage als dritter Endknoten in
INTERFACES §6 Endknoten-Liste + §6.1 Sage-Page-Architektur aufgenommen
(Domäne `Mycel-Bibliothek`, IndexedDB-Suffix `sbkim_sage`, App-SW
Variante 3a, volle init()-Kette mit lazy Modul-03, Andock-Geste an
Schwarz-Loch-Karte als Wizard-Hinweis). CLAUDE.md auf „Hub und Knoten
zugleich" umgeschrieben, Karte 09 § Schritt 1 erweitert, `status.json`
um `sage`-Endknoten-Eintrag (`pingStatus:"pending-first-andock"`,
`nodeId:null`) ergänzt. `PROTOCOL_VERSION` bleibt `"0.1"` (additiv).
Die V1-Sammelspec-Kaskade ist mit BRIEF_99-Abschluss vollständig
geschlossen — Brief 02 (Plattform-Matrix, PR #97), Brief 03 (M04-
Erweiterung, PR #98) und Brief 04 (Multi-Identität, PR #99) sind alle
gemerged. **Sage-Page-Refactor** (volle init()-Kette + Andock-Wizard
+ Schichten-Lampen + Identitäts-Wechsler-UX in `index.html`) steht
als **Position 1 der Bau-Sitzungs-Brief-Pipeline** aus Brief 99
(siehe § Sitzungs-Einträge „Abschluss — V1-Sammelspec-Kaskade
(Brief 99)") und ist die empfohlene erste Bau-Sitzung der nächsten
Welle.

### 2026-05-17 · Niedrigeres Onboarding (Variante III-Ausbau)

**Eingetragen:** Mini-Pflege „Vision-Anker" 2026-05-17. Klaus'
Kritik trifft hart und stimmt: **Karte 09's 9 Schritte schrecken
ab.** Wer SBKIM ausprobieren will, ohne Klaus-Niveau zu haben,
scheitert vermutlich an Schritt 3 (Service-Worker) oder Schritt 5
(Embedding-Setup). Verbreitung steht im Konflikt mit Andock-Hürde.

**Drei Ausbau-Pfade als langfristiger Plan:**

1. **Andock-Wizard als Standalone-PWA.** Eine eigene Page (z.B.
   `https://lausiklauskn-png.github.io/Sage-Protokol/andock/`)
   führt durch alle 9 Schritte als geführte UI, mit Pre-Flight-
   Checks und Auto-Generierung der Endknoten-Repo-Dateien.
   Klaus' Worte: „klick hier und da, dann bekommst du Spore und
   Knoten".
2. **SBKIM-PWA-Distribution mit GitHub-Identität als Geschenk-
   Paket.** Eine GitHub-Action erzeugt für einen Nutzer
   automatisch ein Endknoten-Repo (Fork eines Templates), inkl.
   konfigurierter Spore-Identität, gebrandet auf den GitHub-User-
   Namen als Identitäts-Brücke. Wer „SBKIM-Knoten werden"
   klickt, hat 30 Sekunden später eine eigene Pages-PWA live.
3. **Eigener Browser-Wrapper (Fern-Vision).** Eine Electron- /
   Tauri- / Capacitor-PWA mit SBKIM eingebacken — eigener
   „agressiverer" Browser (Klaus' Wortwahl), der die Browser-
   Eigenheiten aus § Browser-Observatorium umgeht (keine
   IndexedDB-Reklamation, kein DeX/Tablet-Split, keine SW-
   Cache-Verwirrung). Sehr ambitioniert, vermutlich nur nach
   Variante 2-Reifezeit denkbar.

   > **2026-05-18 · Konkretisierung Mini-Browser-Pfad:** Realisierbar
   > mit **Tauri** (Rust + System-WebView, ~10-30 MB Binaries für
   > Windows/macOS/Linux aus einer Codebase) — schlanker als Electron
   > (~80-200 MB) und nicht „eigener Browser von Grund auf"
   > (Chromium-Code ~30 Mio Zeilen, unrealistisch). Liefert: eigene
   > IndexedDB im App-Daten-Verzeichnis (kein Browser-Reklamations-
   > Risiko, löst Lehre 1 + Spore-Verlust 2026-05-17), Tray-Icon-Modus
   > für Hintergrund-Empfang (Antwort auf Anker 4 Königin-Frage „wer
   > empfängt, wenn der Tab zu ist"), Doppelklick-Installer (`.msi` /
   > `.dmg` / `.AppImage`). **Onboarding-Bild:** 1 Klick Installer →
   > Tray-Icon → empfangsbereit, ~2 Minuten von Link bis Knoten.
   > **Mobile bleibt außen vor** — Tauri ist Desktop-only; für
   > Android/iOS bräuchte es Capacitor (separate Initiative). **Drei
   > gleichwertige Onboarding-Pfade** (Klaus 2026-05-18): Wizard
   > (Pfad 1, browserintern, ~5-8 Min), GitHub-Generator (Pfad 2,
   > eigene Pages-URL, ~10-15 Min), Mini-Browser (Pfad 3, Desktop-
   > App, ~2 Min) — Karte 09 zeigt alle drei, Interessent wählt selbst.
   > **Plattform-Architektur, Stack-Trade-offs, Verbindung zu V4/V5/V7
   > vertieft als eigener Vision-Anker 8** (Folge-Pflege 2026-05-18,
   > diese Notiz hält nur die Pfad-Optik fest).

**Verhältnis zu Modul 10/11/12:** Sobald SBKIM-Distribution für
Nicht-Klaus-Kreise relevant wird, werden die Schutz-Backlog-
Module **akut** (Reputation, Rate-Limit, Blocklist) — heute
schlummern sie als Stubs, weil das Netz klein und vertrauenswürdig
ist. Wer SBKIM in die Welt entlässt, muss diese drei vorher bauen.

**Größenordnung:** Variante 1 wäre ~10-15 Stunden (UX + Code +
Test). Variante 2 ~15-25 Stunden (GitHub-Action-Template + Repo-
Generator + Onboarding-Flow). Variante 3 ist eine eigene Bau-
Saison, nicht in Stunden messbar.

**Status:** Reif für Vor-Diskussion, aber nicht für Spec.

### 2026-05-17 · Browser-Observatorium-Universum (visuelle Variante)

**Eingetragen:** Mini-Pflege „Vision-Anker" 2026-05-17. Aus dem
Stil-Sitzungs-Gespräch zur Schwarz-Loch-Karte (PR #77): das
Browser-Observatorium kann nicht nur als Markdown-Doku in
`docs/OBSERVATORIUM_BROWSER.md` leben, sondern als **bildlich-
animiertes Mini-Universum** in der Sage-Page direkt.

**Konzept-Skizze:**

- **Eigener Screen `screen-observatorium`** in der Sage-Page,
  analog zu `screen-cycle`, `screen-module`, `screen-data`,
  `screen-warum`. Erreichbar durch Klick auf die Schwarz-Loch-
  Karte (anstelle der direkten GitHub-Navigation).
- **Sieben Sterne / Galaxien** für die sieben Lehren — jeder mit
  zartem Twinkling (CSS-Keyframes mit `opacity`-Pulse + leichter
  `box-shadow`-Atmung) und Parallax bei Maus-Bewegung
  (`requestAnimationFrame`-geglättet, Tiefen-Ebenen ähnlich wie
  in Mac-/Linux-Desktop-Hintergründen). Galaxien für die
  größeren Lehren (Browser-Instanzen, IndexedDB), Sterne für die
  schmaleren (Eruda, Termux). Label-Tags beim Hover.
- **Nebel-Hintergründe** als gestapelte `radial-gradient`s mit
  `mix-blend-mode: screen`, Sage-Theme-Farben (Cyan + Lila +
  Gold). Drift-Animation ~120 s, wirkt lebendig ohne Hektik.
- **Klick auf einen Stern** öffnet ein Lehre-Modal — gerenderter
  Text aus der `OBSERVATORIUM_BROWSER.md`, eingebettet in einen
  kleineren Nebel (Teleskop-Zoom-Effekt). Esc / Klick außerhalb
  schließt zurück zum Universum.
- **„Reiner Text"-Link** in einer Ecke des Universum-Screens als
  Wahl für Programmierer-Direktzugriff zur md.
- **Tablet-/Touch-tauglich:** Sterne klickbar, Parallax via
  `DeviceOrientationEvent` auf Mobile (subtile Neigungs-
  Sensitivität). `prefers-reduced-motion: reduce` respektiert.
- **Wahrheits-Quelle bleibt die md.** Universum liest die md
  clientseitig mit minimalem md-Parser (~80 Zeilen JS, keine
  externe Bibliothek wie `marked.js` — Single-File-PWA-Stil ist
  Konvention). Pflege geht in der md; jede neue Lehre dort wird
  automatisch zu einem neuen Stern.

**Pädagogischer Hintergrund:** Klaus' Beobachtung — komplexe
Themen durch Bilder zugänglich machen, ohne den Text-Pfad zu
verlieren. Spricht jüngere Leser und Bilder-Menschen an, die
sich von reinen Tech-Notes abschrecken lassen würden. Pflegt sich
automatisch, sobald die md-Quelle gepflegt wird.

**Größenordnung:** Eigene Bau-Sitzung „Browser-Observatorium-
Universum", ~6-10 Stunden für den initialen Bau (Layout + sieben
Sterne + Modal + minimaler md-Parser + Touch-Anpassung). Iteration
nötig — visueller Eindruck zeigt sich erst beim Testen.

**Status:** Reif für eigene Bau-Sitzung, jederzeit zwischen V1
und V3-Bau einschiebbar.

### 2026-05-17 · Königin-Relay (Modul 13?) — Mailbox für offline-Geschwister

**Eingetragen:** Mini-Pflege „Vision-Anker Königin-Relay" 2026-05-17
(Folge zu Bau Browser-Observatorium-Universum, PR #79 + Lehre 8,
PR #80 + Cursor-Variante PR #81). Klaus' fundamentale Architektur-
Frage nach den Pages-Live-Tests: **„Was, wenn ich einmal Browser A
nehme und ein andermal Browser B? Ist die Spore nur zu finden, wenn
der Browser offen ist? Ist sie empfangsbereit, wenn der Browser
nicht geöffnet ist?"**

Ehrliche Antwort: aktuelle SBKIM-Architektur sagt **„Wer nicht da
ist, schweigt"** (Empfangsmodus-Prinzip aus dem SBKIM-Paper). Browser-
PWAs sind nicht für dauerhaft laufende Dienste gebaut — Pages leben
nur solange die Tabs offen sind, Service-Worker werden nach Stunden
suspendiert. Browser-Wechsel = neue Identität (IndexedDB ist pro
Browser-Instanz). Das ist konzeptuell sauber für ein peer-to-peer
Mycel, aber eine harte Grenze für Verbreitung.

Klaus' Bild: **Königin wie bei Bienen.** Eine Königin ist Bezugspunkt,
nicht Daten-Eigentümer. Übertragen auf SBKIM könnte das ein
**„Königin-Relay" als optionales neues Modul (13?)** sein.

### Modell

- Eine Königin ist eine **Mailbox** für Geschwister.
- Sie speichert **nicht** private Schlüssel — nur **verschlüsselte
  Handshake-Envelopes** (Public-Key-Verschlüsselung mit dem
  Empfänger-publicKey, sodass nur dieser sie öffnen kann).
- Wenn Knoten A handshaken will mit B, und B ist offline → A schickt
  verschlüsselten Envelope an die Königin → Königin hält ihn fest →
  B kommt nächstes Mal online → fragt bei der Königin „Post für
  mich?" → bekommt den Envelope → entschlüsselt mit eigenem privaten
  Schlüssel → antwortet.
- **Privacy gewahrt:** Königin sieht nur verschlüsselte Daten,
  nicht den Inhalt.
- **Optional:** Knoten ohne Königin-Anbindung funktionieren wie
  bisher (direkter Channel-Bridge, same-instance). Königin ist
  „kann", nicht „muss".
- **Mehrere Königinnen möglich** → kein Single Point of Failure.
  Knoten registriert sich bei `N` Königinnen seines Vertrauens.
- **Analogie:** E-Mail-Relay, Matrix-Server, Bluesky-Relay — alle
  privacy-wahrend, alle Mailbox-Buffer-Modelle.

### Implementations-Optionen

1. **Server-Königin:** Node.js / Python / Go-Server, klassische
   Backend-Architektur. Wer hostet? Klaus selbst auf einem Raspi,
   ein Verein, ein Hoster. Geld + Vertrauen erforderlich.
2. **PWA-Königin mit Push-API:** browserseitige Königin, läuft im
   Service-Worker mit WebPush-Notifications. Komplexer, aber
   serverlos auf manchen Hostern. Push-Triggers können den
   Receiver-Tab automatisch öffnen.
3. **Eigenes-Gerät-Königin:** Klaus' Raspi zuhause mit immer-online
   Status. Selbst-souverän, aber technisch anspruchsvoll.

### Anknüpfung an V1 (Sage als Hybrid)

V1 macht Sage zu einem Knoten — das ist ein **erster Schritt in
Königin-Richtung.** Wenn Sage selbst Mailbox-Funktion bekäme, wäre
sie die erste Königin. Aber Sage liegt auf GitHub Pages — statisch,
kann nicht aktiv empfangen. Eine echte Königin braucht einen aktiv
laufenden Prozess. V1 ist daher Vorbereitung, nicht selbst Königin.

### Was Königin-Relay LÖST

- Empfang ohne offene Tabs (Mailbox puffert)
- Browser-Wechsel-Problem (Identität bleibt portabel über `exportBackup`,
  Königin-Verbindung über die Identität)
- Reputation / Schutz-Backlog (Module 10/11/12) könnten am Königin-
  Layer leben

### Was Königin-Relay BEDINGT (Trade-offs)

- **Privacy-Annahmen:** Königin kann Metadaten sammeln (wer schreibt
  wann an wen). Kein perfektes Privacy-Modell, aber besser als zentraler
  Server mit Klartext.
- **Hosting-Frage:** wer betreibt Königin-Knoten? Vertrauen + Geld.
- **Single Point of Failure** nur wenn jemand sich auf nur eine
  Königin verlässt. Mit `N`-Königin-Strategie vermieden.
- **Implementations-Aufwand:** signifikant, vermutlich >50 Stunden
  für initiale Spec + Bau + Königin-Implementierung.

### Status

**Reif für Spec-Sitzung-Diskussion**, aber NICHT für sofortige
Spec-Sitzung. Wartezeit empfohlen, damit:

- V1 (Sage als Hybrid) erst spezifiziert + gebaut wird → Sage-als-
  Knoten-Erfahrung sammeln
- IndexedDB-Persist-Schutz (Mini-Pflege offen) ergibt Praxis-Daten
  über Identitäts-Stabilität
- Klaus' Klarheit über Königin-Vertrauen-Modell reift (wer betreibt?
  Wer vertraut wem? Mehrere Hosts oder einzeln?)

Spec-Sitzung-Aufgabe **nach** der V1-Sage-Hybrid-Spec, NICHT
parallel.

### 2026-05-17 · Identitäts-Container — Rucksack, Safe, Chipkarte, Mini-Browser

**Eingetragen:** Mini-Pflege „Vision-Anker Königin-Relay" 2026-05-17,
Folge-Frage Klaus: „und die mitgeführte eigene Mini-Browser-Version
geht wirklich nicht effektiv, oder sowas wie ein Rucksack oder Safe
oder Chipkarte mit der ich mich beim Aufwachen oder Anmelden neu
identifiziere?"

Die Antwort hat **vier Konzept-Pfade**, die SBKIM in unterschiedlichen
Tiefen erweitern könnten:

1. **Rucksack/Safe (Datei) — schon implementiert.** Modul 02 hat
   `SbkimSpore.exportBackup(password)` + `importBackup(blob, password)`
   seit Bau 02.X (PR mit dem Identitäts-Backup-Stufe-2-Modul). Der
   Backup-Blob ist eine `.json`-Datei, PBKDF2-SHA256-600.000-Runden +
   AES-GCM-256-verschlüsselt. Was fehlt: **UX-Konzept eines
   „Identitäts-Containers"** — der Backup-Blob als „digitaler
   Reisepass", den Klaus auf USB / Cloud / lokal trägt. Beim Anmelden
   in einem neuen Browser: Datei rein, Klaus ist wieder er selbst.
   **Mini-Pflege „Identitäts-Container-UX"** könnte das polieren:
   sprechender Dateiname (z.B. `klaus-spore-2026-05-17.json`),
   Hinweis-Pfad im Doku-Fenster („Backup machst du regelmäßig"), Datei-
   Schloss-Visualisierung.

2. **Chipkarte / Hardware-Wallet — Hardware-basiert.** WebAuthn /
   FIDO2 ist der Browser-Standard für Hardware-/Biometrie-basierte
   Authentifizierung. Der private Schlüssel liegt im Sicherheits-
   Modul des Geräts (Smartphone-Secure-Enclave, YubiKey, Trezor) und
   verlässt es nie. SBKIM-Identität könnte WebAuthn-basiert sein
   statt IndexedDB-basiert — Identität ist an Hardware gebunden,
   nicht an Browser. Aber: WebAuthn ist primär für Login-Auth, nicht
   für signierte Mycel-Nachrichten. Anpassung nötig. **Größere
   Spec-Initiative**, vermutlich Modul 14 oder höher.

3. **Mini-Browser (Variante III aus bestehendem Vision-Anker).**
   Native App-Wrapper (Tauri / Electron / Capacitor) mit
   eingebakkener Identität. App läuft im Hintergrund, persistent,
   empfängt auch bei „aufgewachtem" Gerät ohne offene Tabs. **Schon
   als Vision-Anker drin (Variante III-Ausbau, dritter Pfad).** Diese
   Frage bestärkt: Mini-Browser ist nicht nur Onboarding-Hilfe,
   sondern auch **Hintergrund-Empfänger** und **Identitäts-Container.**

4. **Passkey-Sync (modern).** Apple iCloud-Keychain, Google Password
   Manager, 1Password synchronisieren Passkeys plattformübergreifend.
   Wer in einem Browser angemeldet ist, hat dort automatisch Zugriff
   auf seine Identitäten. Wäre eine **plattform-abhängige** Lösung
   (Apple ↔ Apple, Google ↔ Google), kein peer-to-peer, aber sehr
   pragmatisch für die meisten Nutzer.

### Verbindung zu Königin-Relay (Anker oben)

Königin-Relay und Identitäts-Container lösen unterschiedliche
Probleme:

- **Königin-Relay:** **„Wie empfange ich, wenn der Browser nicht
  offen ist?"** → Mailbox-Modell, ein Knoten irgendwo ist online
  und puffert verschlüsselte Envelopes
- **Identitäts-Container:** **„Wie nehme ich meine Identität von
  Browser A zu Browser B mit?"** → Datei / Hardware / Sync

Sie können kombiniert werden: Klaus' Identität liegt als Backup-Datei
(Rucksack), er importiert sie bei jedem neuen Browser-Anmeldung, und
seine Königin (verschlüsselte Mailbox) hat die ausstehenden Handshakes
für ihn parat.

### Status

Pfad 1 (Rucksack-UX): **Mini-Pflege möglich** ohne große Architektur-
Änderung. Sinnvoller Folge-Schritt nach Storage-Persist-Schutz.

Pfade 2/3/4: **Spec-Sitzungs-Diskussionen**, jeweils signifikanter
Aufwand. Reihenfolge:
- Pfad 3 (Mini-Browser) zuerst — schon als V3-Ausbau-Vision drin,
  kombiniert mit dem Onboarding-Wizard.
- Pfad 4 (Passkey-Sync) als pragmatische Brücke — vermutlich
  zwischen V3-Mini-Browser-Spec und Königin-Relay-Spec.
- Pfad 2 (Hardware-Wallet) als ferne Vision — nur falls SBKIM in
  einem sicherheits-kritischen Kontext eingesetzt würde.

**Status:** Reif für Vor-Diskussion, **nicht** für Spec. Wartet auf:
- V1-Sage-Hybrid-Erfahrung
- Storage-Persist-Schutz-Praxis (Mini-Pflege offen)
- Klaus' Bauchgefühl, welcher Pfad sich am stimmigsten anfühlt

### 2026-05-18 · Multi-Identität in der IndexedDB (Modul 02 Erweiterung)

**Eingetragen:** Mini-Pflege „Vision-Anker Multi-Identität" 2026-05-18.
Klaus' Folge-Gedanke nach dem Schlaf, klar abgegrenzt zu Lehre 1
(Browser-Instanzen-Trennung). Worüber Lehre 1 als **Verlust-Risiko**
sprach (zwei Browser-Instanzen erzeugen ungewollt zwei separate
Identitäten), wird hier als **Feature** umgekehrt: **bewusst mehrere
Identitäten in derselben IndexedDB**.

Klaus' Bild: „mehrere Identitäten in mehreren Ebenen im Browser oder
auf dem Tablet oder im Rechner, je nach Arbeitsoberfläche."

### Konzept

- **Heute:** Modul 02 hat einen Singleton-Slot `sbkim_keys["main"]`.
  Eine PWA = eine Identität pro Browser-Instanz.
- **Vision:** Modul 02 unterstützt **mehrere Identitäten** in derselben
  IndexedDB:
  ```
  sbkim_keys["main"]       → Klaus' Default-Identität
  sbkim_keys["beruflich"]  → Klaus' berufliche Persona
  sbkim_keys["test"]       → Test-Knoten
  ```
  Plus aktive-Identität-Marker `sbkim_meta["active-identity"]`, der
  bestimmt, welche Identität Module 05/06/07 gerade nutzen.

### Schritte (Spec-Aufgabe — nicht jetzt umsetzen)

- **Modul 02 erweitern:**
  - `getOrCreateIdentity(key?)` (Default `"main"`)
  - `setActiveIdentity(key)` (wechselt aktive Identität)
  - `listIdentities()` (alle vorhandenen)
  - `removeIdentity(key)` (vorsichtig, mit Bestätigung)
- **Aktive Identität als Konvention:** Module 05/06/07 lesen
  `sbkim_meta["active-identity"]` und verwenden den entsprechenden
  Identitäts-Slot.
- **UI zum Wechseln:** im Doku-Fenster oder als eigener Identity-
  Picker; vielleicht im Universum als „Welche-Identität-bin-ich"-
  Bewegung in der Sage-Page.
- **Pages-`spore.json`:** kann nur eine Identität öffentlich
  darstellen. Optionen:
  - Nur aktive Identität in `spore.json`
  - Liste-Schema (mehrere Identitäten, peer findet die passende
    über `toNodeId`-Filter)
- **Geschwister-Netze pro Identität:** Modul 05 muss `sbkim_siblings`
  pro Identitäts-Slot verwalten — `sbkim_siblings_main`,
  `sbkim_siblings_beruflich` etc.

### Trade-offs

- **IndexedDB-Verlust löscht alle Identitäten gleichzeitig** — kein
  Backup-Schutz gegenüber Browser-Reklamation. Daher Vision-Anker 5
  (Identitäts-Container) als Backup-Strategie bleibt parallel sinnvoll.
- **Verwirrungs-Risiko:** welche Identität ist gerade aktiv? UI muss
  das klar machen.
- **Spec-Aufwand:** signifikant — Modul 02 grundlegend erweitert,
  Module 05/06/07 ziehen nach. ~3-5 Stunden Spec, ~10-15 Stunden Bau.

### Verbindung zu anderen Vision-Ankern

- **V1 (Sage als Hybrid-Knoten):** Sage selbst könnte mehrere
  Identitäten haben — Hub-Identität für Spec-Verträge, Endknoten-
  Identität für Mycel-Beziehungen, Glossar-Identität für
  Wörterbuch-Pflege.
- **V3 (Niedrigeres Onboarding):** Multi-Identität-Wahl als Teil
  des Andock-Wizards. Andocker entscheidet beim ersten Klick:
  „eine Identität oder mehrere Personae?"
- **V4 (Königin-Relay):** Königin muss pro-Identität-Mailboxes
  verwalten. Klaus' Königin sieht: „Post für `klaus-beruflich`",
  „Post für `klaus-test`".
- **V5 (Identitäts-Container):** jeder Backup-Container könnte
  mehrere Identitäten enthalten. „Klaus' kompletter Rucksack" =
  alle Identitäten in einer Datei.

### Status

**Strang 3 der V1-Sammelspec realisiert (2026-05-19, Brief 04 der V1-
Sammelspec-Kaskade) + Sammelspec-Abschluss (Brief 99) abgeschlossen
(2026-05-19).** INTERFACES.md § 9 „Identitäts-Map (Multi-Identität,
Brief 04)" als verbindliche Spec-Klausel (sieben Sub-§ von Slot-Schema
bis M04-Verbindung); Modul 02 um fünf neue / erweiterte API-Funktionen
erweitert (`getOrCreateIdentity(key?)`, `setActiveIdentity(key)`,
`getActiveIdentityKey()`, `listIdentities()`,
`removeIdentity(key, options?)`); identitäts-spezifische Stores pro
Persona (`sbkim_siblings_<key>`, `sbkim_anastomosis_log_<key>`,
`sbkim_legacy_inbox_<key>`, `sbkim_hetero_inbox_<key>`,
`sbkim_hetero_outbox_<key>`); Persona-Isolation als verbindliche
Klausel (ein Geschwister gehört einer Persona, nicht dem ganzen
Knoten); Strategie A für Pages-`spore.json` gewählt (nur aktive
Identität, `PROTOCOL_VERSION` bleibt `"0.1"`); Strategie B als Folge-
Spec-Option benannt (Bump auf 0.2, NICHT gewählt). Apoptose-Granularität
entschieden: `confirmSelfApoptose` global, per-Persona-Apoptose über
`SbkimSpore.removeIdentity(key, {force:true})` mit internem Hook
`_sendLegacyForIdentity` in Modul 07. Multi-Identitäts-Backup
„kompletter Rucksack" als Empfehlung verankert; `BACKUP_FORMAT_VERSION`-
Bump 1→2 für die Bau-Folge-Sitzung 02.Y vermerkt (KEIN
`PROTOCOL_VERSION`-Eingriff). Die V1-Sammelspec-Kaskade ist mit
BRIEF_99-Abschluss (2026-05-19) vollständig geschlossen. **Bau-
Folge-Sitzungen** für Multi-Identität (01.Y `ensureStore`, 02.Y Multi-
Identitäts-API + Backup-Schema-Bump, 05.Y / 06.Y / 07.Y transparenter
Slot-Pfad, Endknoten-Migration) stehen in der **Bau-Sitzungs-Brief-
Pipeline** aus Brief 99 (siehe § Sitzungs-Einträge „Abschluss — V1-
Sammelspec-Kaskade (Brief 99)") und sind die nächste Welle nach
Kaskaden-Abschluss; Reihenfolge ist Klaus' Entscheidung.

**Bau 01.Y `ensureStore` 2026-05-19 abgeschlossen** (erste Bau-Sitzung
der Pipeline, Klaus' Wahl „Infrastruktur zuerst"). Modul 01 hat jetzt
die achte öffentliche Funktion `ensureStore(storeName: string) →
Promise<void>` für die dynamische Anlage identitäts-spezifischer
Stores ab DB-Version 4 (Option A aus § 9.5). Versions-Bump-Choreografie
linear via `db.version + 1`, fail-soft `onversionchange`-Handler auf
jeder neuen Verbindung, synchroner Pattern-Check
`^sbkim_[a-z0-9_]+$` (`InvalidStoreNameError`), async Bump-Fehler
`EnsureStoreError` mit `cause`-Property. **`DB_VERSION` von 3 auf 4**
(`STORES_V4 = []` als leere Liste — v=4 markiert den Übergang zu
„dynamische Stores via `ensureStore`", legt keinen festen Pflicht-
Store an); **`PROTOCOL_VERSION` bleibt `"0.1"`**;
**`BACKUP_FORMAT_VERSION` bleibt `1`** (Bump 1→2 erst in Bau 02.Y).
KEINE Modul-02/05/06/07-Änderung, KEINE identitäts-spezifischen
Stores angelegt — das ist Aufrufer-Pflicht in den Folge-Bau-Sitzungen.
Drei neue Panel-01-Knöpfe in `tests/manual_check.html` für die Drei-
Stufen-Probe (happy-path / Idempotenz / Pattern-Verstoß), Sichttest
2026-05-19 (Klaus, DeX-Chrome) 3/3 grün. Übergabeprotokoll
[2026-05-19_bau-01y-ensure-store.md](sessions/archiv/2026-05-19_bau-01y-ensure-store.md).

**Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump 2026-05-19
abgeschlossen** (zweite Bau-Sitzung der Pipeline, Klaus' Wahl
„logische Reihenfolge — Infrastruktur weiter"). Modul 02 hat jetzt die
vollständige Multi-Identitäts-API aus Brief 04 — fünf neue / erweiterte
Funktionen (`setActiveIdentity` / `getActiveIdentityKey` /
`listIdentities` / `removeIdentity` plus optionaler `key`-Parameter auf
`getOrCreateIdentity` / `generateOwnSpore` / `getOwnSpore`) — und
schreibt identitäts-spezifische Stores pro Persona über
`SbkimStorage.ensureStore(...)` aus Bau 01.Y. Das Backup-Wrapper-Schema
ist von **`BACKUP_FORMAT_VERSION = 1` auf `2`** gebumpt (Multi-
Identitäts-Backup „kompletter Rucksack" aus § 9.6 Pkt. 2; Pflicht-Feld
`payload.identities[]` im Klartext-Payload); alte v=1-Backups bleiben
über `importBackup` lesbar (Liste `BACKUP_FORMAT_VERSION_READ_OK =
[1, 2]`; Rückwärts-Kompat zu Klaus' Mein-Mixarium- / Mein-Rezeptbuch-
Backups vom 2026-05-16). **`PROTOCOL_VERSION` bleibt `"0.1"`**;
**`DB_VERSION` bleibt `4`** (neue Stores entstehen dynamisch).
**`sbkim_meta` wird in Modul 02 lazy über `ensureStore` angelegt** —
KEIN Modul-01-Eingriff nötig (Brief 04 hat den Marker spezifiziert,
aber Modul 01 keinen Pflicht-Store eingebaut; Bau-01.Y-Option-A deckt
den Pfad). KEINE Modul-05/06/07-Änderung (transparenter Slot-Pfad kommt
in 05.Y / 06.Y / 07.Y). `_sendLegacyForIdentity`-Hook in Modul 07
fail-soft (typeof-check, console.warn — Bau 07.Y bringt Implementation).
Drei neue Panel-02-Knöpfe in `tests/manual_check.html` (Identität
anlegen + wechseln / removeIdentity force-Fallback / Backup mit
Multi-Identität); Headless-Smoke-Test 33/33 grün; **Browser-Sichttest
2026-05-19 (Klaus, DeX-Chrome auf Galaxy Tab S6): 3/3 grün** nach
Mini-Fix (Reihenfolge in `getOrCreateIdentity` umgekehrt — atomarer
Pfad ohne Rollback) und Cleanup-Workaround. Erst-Befund Multi-Tab-
`onblocked` aus Brief antizipiert. Klaus' Beobachtung: zweiter Lauf
gelang erst nach Panel-01-„Storage init"-Klick — bestätigt offene
Folge-Pflege Modul 01 `init()` versions-fail-soft.
Übergabeprotokoll
[2026-05-19_bau-02y-multi-identitaet.md](sessions/archiv/2026-05-19_bau-02y-multi-identitaet.md).

**Folge-Pflege „Modul 01 `init()` versions-fail-soft" 2026-05-19
abgeschlossen** (PR Pflege 01-init eigener PR; Brief PR #106 als
Spec-Vorlage). `DB_VERSION = 4` ist jetzt Mindest-Schema-Version
(nicht „immer-anstreben"). `init()` öffnet die DB zweiphasig:
Probe-Open ohne Version + Entscheidung — bei `wasCreated` (DB
versehentlich angelegt) → `deleteDb` + regulärer Initial-Pfad;
`existing < DB_VERSION` → Migrations-Pfad; `existing >= DB_VERSION`
→ Pflicht-Store-Check + `KNOWN_STORES`-Erweiterung um dynamische
Stores + `openExact` ohne `onupgradeneeded`. Bei fehlendem Pflicht-
Store: `StorageOpenError` mit Liste (manuell zerstörte DB nicht
reparierbar). `_meta.dbVersionPolicy = "fail-soft-min-schema"` als
Read-Anker. Klaus' Cleanup-Workaround „Browserdaten löschen +
Storage init klicken" entfällt — Test-Stores aus früheren Sichttests
blockieren `init()` nicht mehr. Smoke-Test 8/8 grün, Bau-02.Y-
Regression-Test 33/33 weiterhin grün. **Tafel-Evolutions-konform**:
die Brief-02.Y-Tafel „KEIN Modul-01-Eingriff" war scope-disziplin
für Bau 02.Y; diese Pflege ist die explizite Folge-Sitzung mit
eigenem Brief + eigenem PR (CLAUDE.md § Heilige Tafeln § Tafel-
Evolutions-Klausel aus PR #105). Browser-Sichttest des Panel-01-
Knopf-9 ausstehend. Übergabeprotokoll
[2026-05-19_pflege-01-init-fail-soft.md](sessions/archiv/2026-05-19_pflege-01-init-fail-soft.md).

### 2026-05-18 · SBKIM-Browser-Extension — „Lampe in der Toolbar"

**Eingetragen:** Mini-Pflege „Vision-Anker Extension" 2026-05-18.
Klaus' Folge-Vision parallel zur Multi-Identität-Idee (Anker 6),
gleicher Tag, gleicher Schlaf-Klarheit-Moment: ein **kleines Tool
oben in der Browser-Navigationsleiste**, das den SBKIM-Status
sichtbar macht.

### Konzept

Zwei Lampen am Toolbar-Icon:

1. **Status-Lampe:** zeigt, dass das Protokoll lebt — Spore
   existiert, Knoten empfangsbereit. Grün/grau (an/aus).
2. **Aktivitäts-Lampe:** zeigt Handshake-Aktivität — gelb beim
   Andocken, blinkt während Verbindung, grün bei established,
   rot bei Fehler.

Klaus' Bild: „kleines Tool, das jeder in seinem Browser oben in
der Navigationsleiste installiert. Status- und Aktivitäts-Lampe
direkt sichtbar, ohne die Sage-Page öffnen zu müssen."

### Antwort kompakt: Technisch möglich — aber Mobile-Browser außen vor

**Manifest V3** ist das richtige Werkzeug. Desktop-Browser
(Chrome, Firefox, Edge, Brave, Opera, Safari) unterstützen MV3-
Extensions vollständig. **Mobile-Browser unterstützen keine
Extensions** — Klaus' eigenes DeX-/Tablet-Chrome-Setup bleibt
außen vor (Workaround: Kiwi Browser auf Android, Chromium-fork
mit Extension-Support).

### Plattform-Tabelle

| Plattform | Extension möglich? |
|---|---|
| Desktop Chrome / Edge / Brave / Opera / Firefox | ✓ |
| Desktop Safari (macOS) | ✓ (Xcode + App Store nötig) |
| Mobile Chrome (Android) — Klaus' Setup | ❌ |
| DeX-Chrome — Klaus' Setup | ❌ |
| Mobile Safari (iOS) | ✓ (eigenes Format) |
| Mobile Firefox (Android) | (eingeschränkt) |
| Kiwi Browser (Android) | ✓ |

### Architektur-Skizze

- **Manifest V3** mit `action` (Toolbar-Icon),
  `background.service_worker`, `externally_connectable` für Sage-
  PWA-Origin
- **Toolbar-Icon-Varianten:** `icon-aus.png` / `icon-lebt.png` /
  `icon-andockt.png` / `icon-etabliert.png` / `icon-fehler.png`
- `chrome.action.setIcon()` wechselt Icon je nach SBKIM-Status
- **Kommunikation Sage-PWA ↔ Extension** via
  `chrome.runtime.sendMessage` (Manifest deklariert PWA-Origin als
  `externally_connectable`)
- **Modul 13 „Extension-Bridge"** (neu zu spezifizieren) — sendet
  Status-Updates an Extension, wenn vorhanden; degradiert sauber,
  wenn nicht installiert
- **Popup HTML** für detaillierte Ansicht: Geschwister-Liste,
  Handshake-Log, Backup-Export-Trigger, Identitäts-Wechsler
- **Storage:** `chrome.storage.local` für UX-State (keine
  Identitäts-Schlüssel — die bleiben in der PWA-IndexedDB; Extension
  ist Anzeige + Steuerung, nicht Identitäts-Träger)

### Verbindung zu anderen Vision-Ankern

- **V2 (Niedrigeres Onboarding):** Extension ist **eine** UX-
  Vereinfachung, ergänzt die drei gleichwertigen Pfade (Wizard /
  GitHub-Generator / Mini-Browser) — kein Ersatz für den Andock-
  Schritt, aber laufende Status-Sichtbarkeit
- **V4 (Königin-Relay):** Extension zeigt Königin-Status („Königin
  erreichbar, X Nachrichten warten")
- **V5 (Identitäts-Container):** Backup-Export-Button im Popup,
  Identitäts-Rucksack einen Klick weg
- **V6 (Multi-Identität):** Identitäts-Wechsler im Popup — bewusste
  Persona-Wahl per Mini-Dropdown am Toolbar

### Abgrenzung Extension ↔ Mini-Browser (Anker 2 Pfad 3)

Komplementär, nicht konkurrierend:

- **Extension:** für Nutzer, die ohnehin Desktop-Chrome/Firefox
  nutzen. Niedrige Hürde (Install in einer Minute), nutzt
  existierenden Browser. Identität bleibt in PWA-IndexedDB
  (Reklamations-Risiko bleibt).
- **Mini-Browser (V2 Pfad 3):** für Nutzer, die einen dedizierten
  Knoten wollen (immer-on, Tray-Icon, eigene IndexedDB). Löst das
  Reklamations-Risiko, ist aber Desktop-App-Installation.

Beide können denselben Modul-13-Status-Bridge nutzen.

### Größenordnung

- Spec ~3-5 Stunden
- Bau Chrome-Extension ~15-25 Stunden
- Cross-Browser-Anpassungen (Firefox/Edge/Safari) ~10-15 Stunden
- App-Store-Distribution: Chrome Web Store ($5 einmalig), Firefox
  AMO (gratis), Apple Developer ($99/Jahr für Safari/iOS)

### Status

**Reif für Spec-Diskussion nach V1** (Sage als Hybrid-Knoten) und
nach einer Konsolidierungsphase der Marathon-Resultate. Komplementär
zu Anker 8 (Mini-Browser): Extension bedient Browser-Nutzer,
Mini-Browser bedient dedizierte Knoten — beide nutzen denselben
Modul-13-Bridge. Anschluss auch an Anker 9 (M04-Erweiterung): die
drei Match-Schichten + Brücke werden im Lampen-Popup-Detail sichtbar
gemacht, sobald Stufe B vorliegt.

### 2026-05-18 · Eigener Mini-Browser — Tauri-App als dedizierter Knoten

**Eingetragen:** Mini-Pflege „Vision-Anker Mini-Browser" 2026-05-18,
Folge-Pflege am selben Tag (nach PR #84 Anker 7). Klaus' parallele
zweite Browser-Identifikations-Schicht-Vision — bei PR #84 zunächst
als Notiz an Anker 2 Pfad 3 angehängt, hier per Klaus' Folge-
Entscheidung **als eigenständiger achter Vision-Anker vertieft**.

Klaus' Bild: „eigener kleiner Browser, von dem aus die Kommunikation
startet — muss nicht groß oder komplex sein. Läuft im Hintergrund,
eigene IndexedDB, unabhängig von Chrome."

### Konzept

Standalone-Desktop-App, die nur die Sage-PWA hostet:

- **Eigene IndexedDB** im App-Daten-Verzeichnis (`%APPDATA%/sbkim-node`
  / `~/Library/Application Support/sbkim-node` / `~/.config/sbkim-node`)
  → kein Browser-Reklamations-Risiko mehr (Lehre 1 + Spore-Verlust
  2026-05-17 strukturell gelöst).
- **Tray-Icon-Modus** für Hintergrund-Empfang — Browser-Tab nicht nötig,
  Knoten bleibt empfangsbereit, solange der Computer läuft.
- **Doppelklick-Installer** (`.msi` Windows, `.dmg` macOS, `.AppImage`
  Linux) — Onboarding ~2 Minuten von Link bis empfangsbereit.
- **Klein, fokussiert** — keine Tabs, keine Adressleiste, kein
  Browser-Chrome-Drumherum. Hostet `index.html` + Sage-PWA, sonst nichts.

### Antwort kompakt: Tauri ist der richtige Stack

**Tauri** (Rust-Backend + System-WebView) liefert das, was Klaus will,
ohne „eigenen Browser von Grund auf bauen" (Chromium-Code ~30 Mio
Zeilen, unrealistisch):

- ~10-30 MB Binaries pro Plattform (vs. Electron ~80-200 MB, weil
  Electron Chromium komplett mitliefert; Tauri nutzt das OS-eigene
  WebView2 / WKWebView / WebKitGTK)
- Cross-Platform aus einer Rust-Codebase
- Native System-Tray-Integration eingebaut
- Auto-Update-Mechanismus (signed releases)
- Aktive Community, MIT-Lizenz, Mozilla-finanziert mitentwickelt

### Plattform-Tabelle

| Plattform | Mini-Browser möglich? |
|---|---|
| Windows Desktop | ✓ (`.msi` via Tauri, nutzt WebView2) |
| macOS Desktop | ✓ (`.dmg` via Tauri, nutzt WKWebView) |
| Linux Desktop | ✓ (`.AppImage` via Tauri, nutzt WebKitGTK) |
| Android — Klaus' Setup | ❌ (Tauri-Mobile-Support unreif; Capacitor wäre separate Initiative) |
| iOS | ❌ (siehe Android) |
| DeX-Chrome — Klaus' Setup | ❌ (kein Desktop-OS im Tauri-Sinn) |

### Architektur-Skizze

- **Tauri-App-Shell:** Rust-Backend, hostet `index.html` der Sage-PWA
  lokal aus dem App-Bundle (kein Web-Server nötig — `tauri://localhost`
  als interne Origin)
- **IndexedDB:** WebView nutzt eigene IndexedDB-Instanz im App-Daten-
  Verzeichnis, isoliert vom System-Browser
- **Tray-Icon:** identische Lampen-Zustände wie Anker 7 Extension
  (aus / lebt / andockt / etabliert / fehler) — Wiederverwendung der
  Icon-Assets
- **Tray-Menü:** „Sage öffnen" / „Backup exportieren" / „Identität
  wechseln" (V6-Verbindung) / „Knoten beenden"
- **Modul-13-Bridge:** dieselbe wie für die Extension — PWA sendet
  Status-Updates an Tauri-Backend via `window.__TAURI__.event.emit()`,
  Backend aktualisiert Tray-Icon und Menü-Status
- **System-Autostart:** Toggle in Tray-Menü („mit System starten ✓") —
  Tauri-Auto-Launch-Plugin
- **Update:** Tauri-Updater prüft GitHub-Releases-Endpoint, signiert
  mit Tauri-Private-Key, User klickt „Update installieren"

### Verbindung zu anderen Vision-Ankern

- **V2 (Niedrigeres Onboarding):** Mini-Browser IST Pfad 3 der drei
  gleichwertigen Onboarding-Pfade (Wizard / GitHub-Generator / Mini-
  Browser). V2 Pfad 3 ist die **Onboarding-Optik** („Wie kommt jemand
  rein?"), Anker 8 ist die **Plattform-Architektur** dahinter
  („Welcher Stack, welche Trade-offs, welche Bau-Schritte?").
- **V4 (Königin-Relay):** Mini-Browser ist der **wahrscheinlichste
  Hintergrund-Empfänger** für Königin-Mailbox-Polling. Browser-Tab kann
  geschlossen sein, Tauri-App läuft im Tray weiter, holt Nachrichten
  im 5-Minuten-Takt.
- **V5 (Identitäts-Container):** Mini-Browser ist der **wahrscheinlichste
  Träger** für File-System-basierte Backup-Verschlüsselung — Tauri
  hat Datei-System-Zugriff via Rust-Backend, kann verschlüsselte
  Identitäts-Container in eine `.sbkim`-Datei exportieren.
- **V6 (Multi-Identität):** Tray-Menü-Eintrag „Identität wechseln"
  zeigt Persona-Dropdown direkt am System-Tray.
- **V7 (Extension):** komplementär, nicht konkurrierend (siehe nächster
  Abschnitt).

### Abgrenzung zu Anker 7 (Extension)

| Aspekt | Extension (V7) | Mini-Browser (V8) |
|---|---|---|
| Zielgruppe | Nutzer mit existierendem Browser | Nutzer wollen dedizierten Knoten |
| Installation | Browser-Store, 1 Klick | Doppelklick-Installer |
| Identitäts-Speicher | Browser-IndexedDB (Reklamations-Risiko bleibt) | App-Daten-Verzeichnis (kein Risiko) |
| Hintergrund-Empfang | Nein (Tab muss offen sein) | Ja (Tray-Modus) |
| Mobile | Eingeschränkt (Kiwi-Workaround Android) | Nein (Desktop-only) |
| Bau-Aufwand | ~15-25 h MVP | ~30-50 h MVP |
| Stack-Lernen | Manifest V3 (JS, bekannt) | Tauri/Rust (neu für Klaus) |

Beide können denselben **Modul-13-Status-Bridge** nutzen — derselbe
PWA-Code spricht beide an, je nach Umgebung (Browser-Extension oder
Tauri-Window).

### Abgrenzung zu Anker 2 Pfad 3 Tauri-Notiz

Anker 2 Pfad 3 hält den Mini-Browser als **einen von drei gleichwertigen
Onboarding-Pfaden** fest (Wahl-Optik für Karte 09). Anker 8 ist die
**eigenständige Plattform-Vision** dahinter — Architektur, Verbindungen
zu V4/V5/V6/V7, eigene Spec-Reife. Beide bleiben parallel im Repo;
Pfad-3-Notiz verweist auf Anker 8 für die Tiefe.

### Größenordnung

- Spec ~5-8 Stunden (mehr als Extension, weil Plattform-Stack neu)
- Bau Tauri-App MVP ~30-50 Stunden (Rust-Lernkurve eingerechnet)
- Cross-Platform-Build (Windows + macOS + Linux) ~10-15 Stunden
  zusätzlich (CI-Setup, plattformspezifische Eigenheiten)
- **Code-Signing:**
  - Apple Developer Program ($99/Jahr) — sonst macOS Gatekeeper-Warnung
  - Windows Code-Signing-Zertifikat (~$200-400/Jahr) — optional, sonst
    SmartScreen-Warnung beim ersten Start
  - Linux: keine Signatur nötig
- **Distribution:** GitHub Releases (kostenlos) oder eigene Site;
  Tauri-Updater zeigt auf JSON-Manifest mit signierten Binaries

### Status

**Reif für Spec-Diskussion**, parallel zu V7 (Extension). Höhere
Bau-Hürde als Extension (Rust-Stack neu, Code-Signing-Kosten), aber
**langfristig stabilster Endknoten-Pfad** — strukturelle Antwort auf
Lehre 1, Spore-Verlust 2026-05-17 und Anker 4 Königin-Frage „wer
empfängt, wenn der Tab zu ist". Anschluss an Anker 9 (M04-Erweiterung):
Tray-Modus + User-API-Key-Pattern (aus der Plattform-Demo `index.html`)
machen den Mini-Browser zum natürlichen Träger der LLM-Stufe-B-Calls.
Neun Vision-Anker stehen jetzt parallel im Repo — V1 bleibt Klaus'
nächste Spec-Wahl, alle anderen reifen im Hintergrund.

### 2026-05-18 · M04-Erweiterung — drei Schichten + Brücke + doppelte Spore

**Eingetragen:** Mini-Pflege „Vision-Anker M04-Erweiterung" 2026-05-18,
am selben Tag wie Anker 7 + 8. Klaus' Brainstorming hat die **Brücke
zwischen SBKIM-Paper (Plattform-Form, Mai 2026) und Mycel-Form**
sichtbar gemacht: die strukturierten Match-Felder aus dem Paper sind
nie verworfen worden, sondern leben im Mycel-Sage in vereinfachter Form
weiter — Modul 04 matcht heute aber nur **einseitig per Cosinus** über
ein einzelnes Spore-Embedding, die drei Dimensionen + Brücke + volle
Bidirektionalität fehlen noch.

### Konzept

Modul 04 hat heute eine schlanke API:

```
match(queryVec, passageVec) -> number   // Cosinus-Ähnlichkeit
isAboveProviderThreshold(score) -> bool // PROVIDER_MIN_MATCH=0.80
```

Eine Spore (Modul 02) trägt **ein** Embedding. Das ist eine ehrliche
Vorauswahl, aber strukturarm: kein Aufschluss, warum etwas matcht,
keine Brücken-Vorschläge, kein Gegenseitigkeits-Test.

Die Erweiterung übernimmt drei Bausteine aus dem ursprünglichen
SBKIM-Paper für die Mycel-Form:

1. **Drei-Schichten-Bewertung** (statt Single-Score):
   - **Fachlich** (Domain) — was kannst du / was suchst du inhaltlich?
   - **Prozess** — wie arbeitest du? (Rhythmus, Methodik, Verbindlichkeit)
   - **Skalierung** — auf welcher Größenebene? (einzelner Knoten,
     Cluster, Netz)
   Die drei Schichten sind orthogonal; jede liefert einen eigenen Score
   plus Begründung.

2. **Brücken-Feld** — nicht nur „match oder nicht", sondern „was würde
   es vollständig machen". Wenn Knoten A in zwei Schichten matcht, in
   der dritten aber eine Lücke hat, schlägt das System einen
   **Brücken-Knoten C** vor (Anknüpfung an Modul 06 Heterokaryose:
   Brücken-Feld kann aktive Vermittlung anstoßen).

3. **Doppelte Spore** — `capabilities` **und** `needs` auf beiden Seiten.
   Modul 02 bekommt einen zweiten Embedding-Slot, Modul 04 prüft beide
   Richtungen (A-cap × B-needs und A-needs × B-cap). Volle Bidirektionalität
   war schon im ersten Paper-Pitch Kern, in Mycel heute noch reduziert.

### Match-Pipeline (Vision)

- **Stufe A — lokal, kostenlos** (heute schon da, leicht erweitert):
  WebGPU-Embedding → Cosinus-Vergleich. Score < `PROVIDER_MIN_MATCH` →
  Apoptose. Aufschlüsselung pro Schicht: `match()` läuft dreimal, je
  Spore-Achse, gibt `{ fachlich, prozess, skalierung }`-Vektor zurück
  statt einer Zahl.

- **Stufe B — optional, LLM, User-eigener API-Key** (neu): bei
  `Score ≥ Schwelle` läuft ein zweiter Pass über einen Claude-API-Call,
  der die drei Schichten **erklärt** und einen **Brücken-Vorschlag**
  liefert. Pattern übernimmt die Layer-1-Demo der SBKIM-Plattform-
  `index.html` (claude-sonnet-4, `max_tokens` ~1024, JSON-only-Output,
  strenge Validation). Stufe B ist **opt-in pro Knoten** — wer keinen
  Key hinterlegt, bleibt bei Stufe A.

### Architektur-Skizze

- **Modul 02 Spore-Schema:** zweites Embedding-Feld (`embeddingNeeds`
  parallel zu `embedding`). Additiv — alte Sporen bleiben gültig, alter
  Slot heißt dann implizit `embeddingCapabilities`. `PROTOCOL_VERSION`
  bleibt `0.1` solange das alte Feld weiter akzeptiert wird; sonst
  Minor-Bump.
- **Modul 04 API-Erweiterung:**
  - `match(query, passage) -> number` bleibt erhalten (alte Aufrufer)
  - `matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds)
    -> { fachlich, prozess, skalierung, overall }` neu, additiv
  - `explainMatchLLM({…}, apiKey) -> Promise<{ schichten, bruecke,
    erklaerung }>` — Stufe B, optional, fehlertolerant
- **Sage-Page-Erweiterung:** Match-Karte zeigt drei Schicht-Lampen
  statt eines Scores; Brücken-Vorschlag-Slot, falls vorhanden.
- **Anti-Missbrauch:** Brücken-Vorschlag ist **lokal**, nicht im Netz
  geteilt — vermeidet Spore-Leakage auf Drittknoten.

### Verbindung zu anderen Vision-Ankern

- **V1 (Sage als Hybrid-Knoten):** die drei Schichten + Brücke gehören
  als integraler Teil in die V1-Spec, nicht als separate spätere
  Erweiterung. Hybrid-Knoten ist der natürliche Ort, an dem Stufe-B
  überhaupt aufgesetzt wird (Endknoten + Spec-Hub gleichzeitig).
- **V4 (Königin-Relay, Modul 13?):** der Brücken-Vorschlag könnte
  einen Knoten C **vermitteln** — Königin-Mailbox als Transport.
- **V5 (Identitäts-Container):** API-Key gehört in den verschlüsselten
  Container, nicht in plain IndexedDB.
- **V6 (Multi-Identität):** doppelte Spore (cap + needs) **pro Persona** —
  jede Persona hat eigene Schichten, eigene Schwelle, eigenen Key.
- **V7 (Extension):** Match-Details (drei Schichten + Brücke) im
  Popup-Detailfenster — Lampe färbt sich pro Schicht.
- **V8 (Mini-Browser):** natürlicher Träger der LLM-Stufe-B-Calls —
  Tray-Modus kann längere Match-Pässe im Hintergrund fahren, User-Key
  liegt in App-Daten-Verzeichnis (kein Browser-Reklamations-Risiko).
- **Modul 06 (Heterokaryose):** Brücken-Feld ist der Anlass für aktive
  Verbindungs-Vermittlung — heterokaryose-outbox bekommt einen neuen
  Eintrags-Typ „Brücken-Vorschlag".

### Historie — Paper ↔ Mycel

Der ursprüngliche SBKIM-Pitch (Frühjahr 2026, Plattform-Form) trug die
drei Schichten und das Brücken-Feld als **Kern-Innovation** (Paper
Section 3.3 „Bidirektionales Matching mit drei Dimensionen"). Beim
Pivot zur Mycel-Form (Mai 2026, Beginn dieses Repos) wurde Modul 04
bewusst **minimal** angelegt — einfacher Cosinus, eine Schwelle —, um
zuerst die Infrastruktur (Storage, Spore, Embedding, Anastomose,
Apoptose) tragfähig zu bekommen. Die strukturierte Tiefe blieb als
**implizite Vision** im Paper; Anker 9 macht sie explizit und nennt
sie als Bau-Ziel der V1-Sammelspec.

### Größenordnung

- Spec ~3-5 Stunden (Schema-Erweiterung Modul 02, API Modul 04,
  Stufe-B-Prompt-Design)
- Bau Stufe A erweitert (dimensions-Aufschlüsselung): ~2-3 Stunden
- Bau Stufe B (LLM-Call + JSON-Validation + Fehlerbehandlung): ~5-8 Stunden
- Sage-Page-Karten 04 + Match-Demo Erweiterung: ~3-5 Stunden
- Migrations-Pflege Spore-Schema (alte Sporen anpassen): ~2 Stunden

### Status

**Strang 2 der V1-Sammelspec realisiert (2026-05-19, Brief 03 der
V1-Sammelspec-Kaskade) + Sammelspec-Abschluss (Brief 99) abgeschlossen
(2026-05-19).** Spec-Sitzung 2026-05-19 hat die drei Schichten +
Brücken-Feld + doppelte Spore + Stufe-A/Stufe-B-Match-Pipeline
verbindlich in INTERFACES.md verankert (§0 drei neue Konstanten
`SCHICHT_MIN_MATCH=0.60` / `STUFE_B_DEFAULT_MODEL` /
`STUFE_B_MAX_TOKENS`; §1 Modul 02 Bietet-Block-Spore-Schema-
Erweiterungs-Hinweis; §1 Modul 04 zwei neue API-Funktionen
`matchDimensions` + `explainMatchLLM` + vier neue Sub-Blöcke; §2
Spore-JSON-Felder `embeddingCapabilities` + `embeddingNeeds`;
§7 LLM-Stufe-B-Ehrlichkeits-Klausel neu; §8 Anti-Missbrauch-Klausel
neu; §9 Änderungsprotokoll, war §7 vor Brief 03, nach Brief 04 jetzt
§10) plus Karten 02 / 04 / 06 nachgezogen. **PROTOCOL_VERSION bleibt
`"0.1"`** — alle neuen Felder und Funktionen sind additiv, alte
Sporen ohne `embeddingNeeds` bleiben gültig (signalisieren „nur
Anbieter-Modus"). Die V1-Sammelspec-Kaskade ist mit BRIEF_99-Abschluss
(2026-05-19) vollständig geschlossen. **Bau** folgt nach Kaskaden-
Abschluss in eigenen Bau-Sitzungen aus der Bau-Sitzungs-Brief-Pipeline
(siehe § Sitzungs-Einträge „Abschluss — V1-Sammelspec-Kaskade
(Brief 99)"): Bau 04.A Stufe A erweitert (`matchDimensions` sync,
~2-3 h), Bau 04.B Stufe B (`explainMatchLLM` + User-Key-Verwaltung,
~5-8 h), Sage-Page-Karten 04 / Schichten-Lampen (Teil des Sage-
Page-Refactor, ~6-10 h gesamt), Migrations-Pflege Spore-Schema
(~2 h) — Reihenfolge Klaus' Entscheidung.

### 2026-05-18 · Sonnen-Galaxie — Sage-Geschichts-Galerie

**Eingetragen:** Mini-Pflege „Vision-Anker Sonnen-Galaxie" 2026-05-18,
**mid-Pflege re-gerahmt** auf Klaus' Wunsch. Erstrahmung als
„wissenschaftliche Papers-Bibliothek" wurde verworfen; tatsächliches
Konzept: **Sage-Geschichts-Galerie** — Stationen der Entwicklung des
Protokolls und seiner Namensgebung, biographisch-erzählerisch. Klaus'
O-Ton: „eher in die Richtung was macht man, wenn man auf eine Antwort
wartet? Man macht sich selber an die Arbeit. Die Pflege der Dokumente
und der Bau neuer Galaxien kann getrennt von einem Automatismus
erfolgen. So wie jetzt auch." Das eingecheckte EN-Paper
(`docs/papers/sbkim-paper-en.html`) bleibt als **eine** Station unter
mehreren — wissenschaftlicher Niederschlag der Reise, nicht
Selbstzweck.

**Heilige Tafel — Privatheits-Klausel:** **Die Sonnen-Galaxie erwähnt
Everlast GmbH NICHT.** Klaus' Wunsch ausdrücklich. Stationen, die im
realen Werdegang einen kommerziellen Kontext hatten, werden in der
Galaxie ausschließlich in ihrer technisch-konzeptionellen Form
erzählt. Gilt heilig auch für Folge-Mini-Pflegen, die neue Galaxien
nachziehen.

### Konzept

**Sonnen-Karte** als optisches Pendant zur Schwarz-Loch-Karte, nur
invertiert. Wo dort ein dunkler Akkretionsstrudel das Chrome-Logo
verschluckt, leuchtet hier eine **wärme-goldene Korona** mit einem
**dunklen, pulsierenden Sonnenkern** in der Mitte — der Kern ist das
direkte Pendant zum schwarzen Loch (Klaus' Worte: „analog zum schwarzen
Loch von Chrome, aber in einer Art Sonne, nicht so'n komisches Loch in
der Mitte"). Auf der Sonnenscheibe wandern **Sonnenflecken** (dunkle
Punkte in unregelmäßiger Außenform), die eigenständig pulsieren und
driften. Mouse-Hover verstärkt alle Pulse — Korona schneller,
Sonnenflecken schneller, Sonnenscheibe heller. Karte sitzt **weiter
oben** auf der Sage-Page als die Schwarz-Loch-Karte (vor der Reading-
Karte, „Vision und für Neugierige").

**Klick auf die Sonne** öffnet ein neues Vollbild-Universum — analog zum
Observatorium-Screen, mit eigener `papers-screen`-Klasse und
geordneterer Choreographie:

- **Hintergrund:** warm-goldene Nebel statt magenta/cyan; Sterne via
  Canvas; Maus-Schweif erlaubt (Komet-Optik aus Observatorium
  übernehmen, gerne).
- **Galaxien-Bewegung — geordnet, nicht wandernd:** „nicht
  durcheinander, sondern schön im Kreis oder in einer Ellipsenform und
  sich selber noch mal innerhalb der Ellipsenform um sich selber
  drehen." Konkret: eine **gemeinsame Bahn-Ellipse** um ein zentrales
  Sonnen-Zentrum, alle Paper-Galaxien gleichmäßig phasen-verteilt
  (3 Papers → 0°/120°/240°), gleiche Umlaufzeit (~ 40–60 s). Zusätzlich
  dreht jede Galaxie um die **eigene Achse** (das existierende
  `@keyframes galaxy-spin` reicht). Variante als Ausbaustufe: jede
  Galaxie auf eigener Ellipse mit unterschiedlicher Neigung, damit die
  Konstellation einen leichten 3D-Eindruck bekommt.
- **Galaxien-Inhalt:** ein Eintrag pro Paper. Status-Klassen
  steuern die Optik:
  - `paper-galaxy.live`     — voller Glanz (publiziert)
  - `paper-galaxy.draft`    — gedämpft, leicht schwankende Helligkeit
    (in Arbeit)
  - `paper-galaxy.geplant`  — sehr dimm, fast nur Umriss (Platzhalter
    für künftige Papers)
- **Klick auf Galaxie:** Modal analog `universe-modal`, mit
  Paper-Titel, Kurzbeschreibung, Status-Badge, Link zur HTML-Ansicht
  (`docs/papers/<file>.html` als Tab-Öffner mit `target="_blank"`).
  Bei `geplant`-Galaxie: keine Datei, nur Erläuterungs-Text.

### Stationen-Inventar (Start-Konfiguration · 5 Galaxien)

| Galaxie | Station | Status | Anker-Datei (sofern vorhanden) |
|---|---|---|---|
| 1 | **SBKIM-Namensgebung** — woher der Name kam, was die einzelnen Buchstaben in der Reise getragen haben | text-nur, **inhaltlich gefüllt** | (Modal-Body-Text, Pflege 2026-05-18) |
| 2 | **Zwei Seiten einer Medaille** — das bidirektionale Match-Prinzip biographisch erzählt: wann und warum die Idee aufkam, Anbieter und Sucher zugleich zu denken | text-nur, **inhaltlich gefüllt** | (Modal-Body-Text, Pflege 2026-05-18) |
| 3 | **Sage-Protokol-Geburt** — der Pivot von Plattform-Form zu Mycel-Form, Geburt dieses Repos | text-nur, **inhaltlich gefüllt** | (Modal-Body-Text, Pflege 2026-05-18) |
| 4 | **Wissenschaftlicher Niederschlag — das englische SBKIM-Paper** | live | `docs/papers/sbkim-paper-en.html` |
| 5 | **Wissenschaftlicher Niederschlag — das deutsche SBKIM-Paper** | live | `docs/papers/sbkim-paper-de.html` |

**Wachstums-Disziplin:** Pflege der Stationen und Bau neuer Galaxien
laufen als **getrennte Mini-Pflegen**, nicht als Automatismus. Wie
bisher: Klaus liefert den nächsten Inhalt, eine Mini-Pflege schreibt
ihn ein, Bau-Sitzung rendert ihn. Wenn weitere Stationen dazukommen,
skaliert die Bahn-Ellipse ihre Phasen automatisch (`360° / n` pro
Galaxie). Stationen können **textuell** (nur Modal-Body) oder
**dokumentengestützt** (mit Datei-Anker wie das EN-Paper) sein —
beides gleichwertig in der Galaxie.

### Heute schon erledigt

- **Ordner `docs/papers/`** angelegt (trägt das EN-Paper als
  dokumentengestützte Station 4; weitere Stationen brauchen den
  Ordner nicht).
- **`docs/papers/sbkim-paper-en.html`** eingecheckt — Klaus' Upload des
  englischen SBKIM-Papers (23 KB, sieben Sektionen).
- **CSS-Skizze für Sonnen-Karte** in dieser Sitzung kurz angetestet,
  dann **bewusst zurückgerollt** — Klaus' Disziplin „Brief schreiben,
  Bau in eigener Sitzung" hat Vorrang.
- **Mid-Pflege Re-Framing:** Konzept von „Papers-Bibliothek" auf
  „Geschichts-Galerie" verschoben (Folge-Commit auf PR #88). Optik
  bleibt vollständig (Sonnen-Karte, Ellipsen-Bahn, Eigenrotation,
  Sonnenflecken); nur die Daten und die Sprache haben sich gewandelt.

### Architektur-Skizze (für Bau-Sitzung)

**`index.html` — sieben Eingriffe, alle additiv:**

1. **CSS-Block** „Sonnen-Galaxie · Papers-Bibliothek" vor dem
   `.blackhole-card`-Block (~Z. 403). Spezifika:
   - `.sun-card` als `radial-gradient`-Hintergrund mit warm-dunklem
     Boden (Pendant zu `.blackhole-card`'s lila-schwarz).
   - `.sun-stage` Grid wie `.blackhole-stage`, Hover-Scene-Scale.
   - `.sun-scene` mit drei gestapelten Schichten:
     `.sun-corona` (radial, pulsierend), `.sun-corona-2` (conic,
     rotierend), `.sun-disk` (dunkler Sonnenkern, pulsierend) und drei
     `.sun-spot.s1/.s2/.s3` (Sonnenflecken in unregelmäßigen Drift-
     Bahnen).
   - Vier Keyframes: `sun-corona-pulse`, `sun-corona-spin`,
     `sun-disk-pulse`, `sun-spot-drift-1/2/3`.
   - Hover: alle Animations-Dauern halbieren (analog Black-Hole-Card,
     `bh-chrome` 11s→5.5s).
   - `prefers-reduced-motion: reduce` schaltet alle Animationen ab.

2. **CSS-Block** „Papers-Galaxie-Screen" für den neuen Screen.
   `.papers-screen` analog `.observatorium-screen` aber warm-goldener
   Tonalität (Nebel `rgba(244,180,53,…)` statt `rgba(255,70,180,…)`).
   `.paper-galaxy` analog `.universe-galaxy` plus drei Status-Klassen
   (`.live`, `.draft`, `.geplant`).

3. **HTML-Block** Sonnen-Karte vor `.card.reading` (~Z. 751):
   ```html
   <article class="card span-12 sun-card" data-back-anchor="papers">
     <span class="card-tag">Wissenschaftliche Grundlage · Papers-Bibliothek</span>
     <a class="sun-stage" href="#papers"
        onclick="goScreen('papers', 'papers'); return false;"
        aria-label="Papers-Bibliothek öffnen — Sonnen-Galaxie">
       <div class="sun-scene" aria-hidden="true">
         <div class="sun-corona"></div>
         <div class="sun-corona-2"></div>
         <div class="sun-disk"></div>
         <div class="sun-spot s1"></div>
         <div class="sun-spot s2"></div>
         <div class="sun-spot s3"></div>
       </div>
       <div class="sun-caption">
         <h3>Auf welcher Grundlage Sage steht</h3>
         <p>Zwei wissenschaftliche Papers tragen die Form. Das englische
         beschreibt SBKIM als bidirektionales Matching-Protokoll mit drei
         Dimensionen. Das deutsche folgt. Ein drittes Paper stellt das
         Mycel-Prinzip dem SBKIM-Matching gegenüber.</p>
         <p class="sun-hint">Klicke in die Sonne → die Papers tanzen
         als Galaxien um sie herum.</p>
       </div>
     </a>
   </article>
   ```

4. **HTML-Block** Papers-Galaxie-Screen nach `</main>` von
   `screen-observatorium` (~Z. 1121), analog zum Observatorium-Screen,
   eigene IDs (`screen-papers`, `papers-stage`, `papers-galaxies`,
   `paper-modal`, …).

5. **`SCREENS`-Array** (Z. ~1179) um `'papers'` erweitern.

6. **`goScreen()`** (Z. ~1226): Aufruf `setupPapersGalaxy()` wenn
   `id === 'papers'`. **`applyHashScreen()`** (Z. ~2482): bei
   `h === 'papers'` zurück-Anker `'papers'` mitgeben.

7. **JS-Block** nach `closeUniverseModal()` (~Z. 2479):
   `STATIONS_DATA`-Array (s. Inventar oben), `setupSonnenGalaxie()` mit
   einmaliger Initialisierung-Schranke, Ellipsen-Bahnen-Rendering,
   `openStationModal(idx)`, `closeStationModal()`. Bewegungs-Mathe:
   ```
   const ANG_SPEED = (2 * Math.PI) / 50;   // 50 s Umlaufzeit
   const t = now / 1000;
   STATIONS_DATA.forEach((s, i) => {
     const phase = (i / STATIONS_DATA.length) * Math.PI * 2;
     const x01 = 50 + Math.cos(t * ANG_SPEED + phase) * 30;
     const y01 = 50 + Math.sin(t * ANG_SPEED + phase) * 18;
     // Eigenrotation läuft via CSS-@keyframes galaxy-spin
   });
   ```
   Station-Eintrag hat zwei Varianten:
   - **textuell:** `{ title, summary, status: 'text' }` — Modal zeigt
     nur den `summary`-Body, keinen Datei-Link.
   - **dokumentengestützt:** `{ title, summary, status: 'live', href }` —
     Modal zeigt Body + „Original-Dokument öffnen →"-Link auf `href`
     (z.B. `docs/papers/sbkim-paper-en.html`).

**`status.json` — optionaler Eintrag:** ein neues Feld `historie` mit
Liste der Stationen (Titel, Status, optional Datei). Pflege-frei, weil
selten geändert; macht die Geschichts-Galerie auch maschinen-lesbar.

**`docs/papers/README.md`** als Erklärung der Bibliothek (was das
EN-Paper hier soll: dokumentengestützte Station der Sonnen-Galaxie) +
Verweis auf Vision-Anker 10.

### Sonnenflecken-Pattern (Klaus' Wunsch konkret)

Klaus' Worte: „mit Sonnenflecken, die ebenfalls größer und kleiner mit
unregelmäßiger Außenform pulsieren". Drei `.sun-spot`-Elemente mit
unterschiedlichen Größen (18 / 12 / 9 % der Scene-Breite), an
unterschiedlichen Positionen (top:33%/48%/38%, left:30%/55%/50%), jede
mit eigener `@keyframes sun-spot-drift-X`-Animation (unterschiedliche
Dauern 11/9/13 s, unterschiedliche Translate-Vektoren, leichte
Skalierung 0.7–1.15). Bei Hover Dauer halbieren — passt visuell zum
Sonnen-Stress-Erlebnis (Klaus' Worte: „bei Mouseover stärkeres
Pulsieren").

### Verbindung zu anderen Vision-Ankern

- **Anker 1 (Sage als Hybrid-Knoten):** das Observatorium kann privat
  bleiben, weil die Sonnen-Galerie öffentlich die Geschichte des
  Protokolls erzählt — wer die Reise versteht, versteht auch, **warum**
  Sage als Hybrid-Knoten sinnvoll wird.
- **Anker 9 (M04-Erweiterung):** Station „Zwei Seiten einer Medaille"
  ist die biographische Quelle für die bidirektionale Match-Erweiterung
  (Anbieter ↔ Sucher, doppelte Spore). Reift Anker 9 in V1, dann zieht
  Station 2 als Erzähl-Anker mit.
- **Schwarz-Loch-Karte (`.blackhole-card`):** optisches Pendant der
  Sonnen-Karte. Beide sitzen in derselben Bento-Reihe, aber an
  gegenüberliegenden Positionen (Sonne weiter oben für „Wo das Protokoll
  herkam", Loch weiter unten für „Was wir auf dem Weg gelernt haben").
  Sie ergänzen sich choreographisch: Sonne ist hell und erzählerisch
  (Werdegang), Schwarzes Loch ist dunkel und wirbelnd (Bau-Lehren).

### Größenordnung

- Bau-Sitzung CSS + HTML + JS für Sonnen-Karte: ~2 Stunden
- Bau-Sitzung Papers-Galaxie-Screen + Modal + Bewegungs-Loop: ~2-3 Stunden
- Status.json-Erweiterung + papers/README.md: ~0.5 Stunden
- Manueller Sichttest (Klaus, Browser): ~0.5 Stunden
- **Insgesamt eine Bau-Sitzung: ~5-6 Stunden**

Aufteilbar in zwei Bau-Sitzungen, falls eine zu lang wird:
- **Bau-Sitzung 10a:** Sonnen-Karte + Status.json + README (~3 h)
- **Bau-Sitzung 10b:** Papers-Galaxie-Screen + Modal + Bewegungs-Loop (~3 h)

### Status

**Realisiert PR #90 (Bau) + Pflege PR #92 (Stationen 1–3
inhaltlich gefüllt) + Pflege 2026-05-18 (Station 5 · DE-Paper
ergänzt)**. Sonnen-Karte sitzt zwischen Andock-Karte und Reading-
Karte (`data-back-anchor="sonnen"`); Geschichts-Galerie-Screen lebt
unter `#sonnen` und zeigt **fünf Stationen** auf einer gemeinsamen
Ellipsen-Bahn (`ANG_SPEED = 2π/50` s, Ellipse 30 vw × 18 vh,
gleichmäßige Phasen-Verteilung über `STATIONS_DATA.length` — bei 5
sind das 72° pro Galaxie) mit Eigenrotation via `@keyframes
galaxy-spin`. **Alle fünf Stationen sind inhaltlich gefüllt:**
Station 1 (Namensgebung), Station 2 (Zwei Seiten einer Medaille —
biographische Quelle für Anker 9), Station 3 (Sage-Protokol-Geburt
— Pivot Plattform → Mycel) als textuelle Erzählung im Modal-Body;
Station 4 (EN-Paper, `status: 'live'`) zusätzlich mit `href` auf
`docs/papers/sbkim-paper-en.html`; Station 5 (DE-Paper, `galaxy-
quasar`, `status: 'live'`) zusätzlich mit `href` auf `docs/papers/
sbkim-paper-de.html`. Das Placeholder-Hint-Banner ist via expliziten
`placeholder`-Flag gesteuert — neue text-only-Stationen können beim
Anlegen `placeholder: true` setzen, gefüllte tragen den Flag nicht.
`docs/papers/README.md` führt jetzt beide Paper-Dateien.

**Pflege-Disziplin Everlast GmbH:** jede Folge-Mini-Pflege, die Inhalt
für Stationen 1–3 liefert, **prüft vor dem Commit**, dass der Text
keine Erwähnung von Everlast GmbH enthält. Die heilige Tafel ganz oben
in diesem Anker ist verbindlich.

---

## Sitzungs-Einträge

### 2026-06-28 (Sichttest) · ✅ Badge Browser-Sichttest GRÜN (Klaus) — Sage ↔ Mixarium

Klaus' Live-Cross-App-Sichttest (Galaxy Tab S6, Splitscreen, beide auf
deployter `main`): das **Verwandtschafts-Badge / „Wählen"-Tool** ist in
**Sage UND Mein-Mixarium grün**. Schließt die offenen „wartet auf Klaus"-
Punkte für PR #483 (Sage Badge) und PR #81 (Mixarium-Rollout).

Belegt (7 Screenshots):
- **Anmelden** beidseits („✓ Du bist im Raum"; Sage `FQhis3sdg…`,
  Mixarium `7ikXSF1785…`).
- **„Wer ist im Raum?"** → jeder sieht den anderen mit Badge
  **„· verbunden -0.17"** + Andocken-Knopf.
- **Andocken** → beidseitig **„✓ ANDOCK ETABLIERT"** (server-loser
  Live-Cross-Knoten-Handshake).
- **„nur verwandte: an"** → „Keiner der 1 Knoten ist (im engen Maß)
  verwandt …" — Filter blendet korrekt aus.

Bestätigt die Verträge: (1) **reine Anzeige, gatet nichts** — Andock klappt
trotz -0.17 (Match 0.848 ≥ 0.80, 0.80-Riegel unberührt); (2) **korrekte
Diskriminierung** — Hub (Sage) ↔ Endknoten (Mixarium) = „verbunden, nicht
verwandt" (verschiedene Domänen). Läuft noch auf `RELATEDNESS_CENTER` **v1**;
v2-Kalibrierung weiter offen (wartet auf Klaus' Panel-04-Mess-Lauf).

### 2026-06-28 (Folge) · „Wählen"-UI Badge: C.1 eingeordnet + C.2 Mixarium-Rollout (PR) · D blockiert

Folge-Sitzung zum Brief `BRIEF_WAEHLEN_BADGE_RELATEDNESS_V2` (Branch
`claude/waehlen-badge-relatedness-v2-bww1q5`). Drei Stränge:

- **Strang C.1 — #483 einsortieren: erledigt (war bereits gemerged).** Beim
  Sitzungsstart `git fetch origin main` zeigte: PR #483 (Verwandtschafts-Badge
  Modul 23, Strang B) **ist** in Sage main (Commit `b972454`), ebenso #485
  (Strang-D-Mess-Knopf, `a3bf1a9`). Die Brief-„Stand"-Annahme („#483 nicht
  gemerged") war zum Brief-Zeitpunkt richtig, ist überholt. Sage main ist
  intern konsistent: `src/modules/{04_match,23_rendezvous,23_rendezvous_ui}.js`
  byte-identisch zu `sbkim-bundle/modules/…` (Drift-Guard grün), enthält
  `relatedness`/`RELATEDNESS_CENTER`/`relatednessForCards`/Badge-UI. → C.1 hat
  keine offene Aktion; Sage main trägt das Badge.
- **Strang C.2 — Mixarium-Rollout: gebaut, Draft-PR, wartet auf Klaus.**
  In `Mein-Mixarium` drei `sbkim/`-Module byte-1:1 auf Sage-main-Stand gezogen:
  `04_match.js` (behebt den **Drift** — alte Version hatte kein `relatedness`),
  `23_rendezvous.js`, `23_rendezvous_ui.js`. md5-Drift-Guard gegen Sage main
  grün für alle drei. Lade-Reihenfolge bestätigt (04 Z. 13077 vor 23 Z. 13087
  in `index.html`). QC ↔ index byte-Parität unberührt (sbkim/-Module außerhalb
  der Spiegelung; Script-Tags unverändert). **Reine Anzeige — gatet nichts,
  0.80-Riegel unberührt, kein Funktions-Eingriff.** Draft-PR
  `Mein-Mixarium#81` (Merge entscheidet Klaus; Browser-Sichttest Badge je
  Knoten im Raum wartet auf Klaus).
- **Strang C.3 — family-project: bewusst nicht angefasst.** family fährt ein
  eigenes Raum-UI (kein `23_rendezvous_ui.js`) → Badge dort = Consumer-Refactor,
  eigener Brief/Scope.
- **Strang D — `RELATEDNESS_CENTER` v2: blockiert.** Setzt Klaus' Mess-Knopf-
  Ergebnis (Panel 04, „RELATEDNESS_CENTER v2 messen …", `freigabeReif:true`)
  voraus. Ohne sein Browser-Mess-Ergebnis keine Konstanten-Änderung. SIGNAL
  §11.6 (netzweit) erst bei tatsächlicher Konstanten-Setzung Pflicht — diese
  Sitzung änderte keine Konstante, also kein SIGNAL nötig.

**Offen / nächster Schritt:** (1) Klaus Sichttest Badge in Sage-Page (Strang B,
schon in main) + Mixarium-PR #81 (nach Merge). (2) Klaus' v2-Mess-Lauf →
Strang D Konstante netzweit setzen. (3) family-Badge eigener Brief.

### 2026-06-26 · Such-Tool KI-Richter: mehrere Gratis-Anbieter (Gemini + OpenRouter) + Pinnwand-Gemini-404-Fix + Icon

Live-Sitzung mit Klaus (Fortsetzung Toolpoint). Mehrere Auslieferungen, alle nach
`main` gemerged:

- **Pinnwand Gemini-Richter 404-Fix** (PR #455): fester veralteter Modellname
  `gemini-2.0-flash` → HTTP 404. `resolveGeminiModel()` wählt nun dynamisch ein
  `flash`-Modell aus dem Konto (`v1beta/models`), Fallback `gemini-flash-latest`.
- **Pinnwand-Baum-Icon** (PRs #451–#455): Glas-Squircle (Samsung-Form, schmaler
  grüner Rand + 45°-Glaskante + Spiegelstreifen), von Klaus freigegeben.
- **Such-Tool KI-Richter Mehr-Anbieter** (dieser Eintrag): Modul 04
  `HYBRID_PROVIDERS` + **Gemini** (dynamische Modell-Wahl, 404-fest, Fence-Strip
  vor JSON.parse) + **OpenRouter** (Gratis-Modelle) → 6 Anbieter; `hybridMatch`
  löst `provider.resolveModel` async auf. Modul 22 UI: Richter-Anbieter-Dropdown
  (EU-Politik-gefiltert) + RAM-only Schlüsselfeld (BYOK) + optionales Modellfeld;
  `richterRerank` reicht `model` durch. Byte-identische `such-tool/modules/04+22`
  aktualisiert. Smokes: 04d **68/68** (Gemini-Probe), bau22 **245/245** (Probe 5b),
  Standalone **46/46**, alle 04a/b/c grün.

**Offen:** Tresor-Auto-Speicher der Richter-Schlüssel (sicherheits-sensibel,
Increment 2 B — eigene Folge-Sitzung). Browser-Sichttests (Gemini live im
Such-Tool + Icon auf dem Startbildschirm) warten auf Klaus. **Nächster Schritt
Toolpoint-Strang:** semantische Frage→Antwort übers eigene Relay (Brief
`BRIEF_TOOLPOINT_SEMANTIK_UEBER_EIGENES_RELAY.md`).

### 2026-06-25 · Toolpoint-Relay (Relay-zuerst) — Architektur-Notiz + Betreiber-Anleitung

Bau-/Umsetzungs-Sitzung zum Brief „Eigenes Relay als Fundament des Toolpoint".
Klaus' Entscheide live geklärt: **Hosting = VPS** (Heim-Pi verworfen:
Heim-IP/CGNAT/Bastelei), **Versprechen-Wortlaut = „server-los" mit Erklärung**,
**Custom-Relay-Eingabe in der Pinnwand-UI = Folge-Bau** (jetzt nur eigenes Relay
fest in `RELAY_POOL`), **Relay-Domain-Name noch offen** (Platzhalter
`relay.<deine-domain>`).

**Kern-Klärung (gehört prominent in die Doku):** zwei Versprechen sauber trennen —
(1) **App-Versprechen** local-first bleibt unangetastet wahr (App-Daten erreichen
das Relay nie); (2) **Netz-Transport** war nie server-los (heute fremde Relays),
eigenes Relay *verlagert* die Metadaten vom Fremden zu Klaus statt sie zu brechen.
Ehrliche Garantie-Lage: Inhalt per E2E **garantiert blind**, Metadaten nur
**log-frei + prüfbar** (volle Garantie erst per Mixnet), IP nur per Tor (Nutzer,
nicht Betreiber). → **Dreistufiges, prüfbares Versprechen** („prüf mich" statt
„vertrau mir").

**Gebaut (zwei Discovery-Notizen, unverlinkt/Parkplatz):**
`docs/discovery/notiz-toolpoint-relay.md` (Architektur/Entscheidungen, ganzer
Bogen, Garantie-Tabelle, Andock-Punkt) + `docs/discovery/anleitung-eigenes-relay.md`
(VPS-Betreiber-Anleitung: strfry via Docker + Caddy Auto-TLS, log-freie Konfig,
öffentlich-prüfbar machen, `wss://`-Test, Pinnwand-Andock). Pinnwand spricht
Nostr (NIP-01); Andock-Punkt `RELAY_POOL` `pinnwand/index.html:355` (föderiert
dazu), Pool-Filter `:364` blockt Custom-Relays (Folge-Bau). KEIN Code geändert.

**✅ RELAY IST LIVE (gemeinsam mit Klaus aufgesetzt, selbe Sitzung):**
Domain `family-projekt.de` (INWX) + VPS Hetzner CX23 Falkenstein (~7 €/Mo) →
`wss://relay.family-projekt.de`. **nostr-rs-relay** (container-freundlicher als
strfry) hinter **Caddy** (Auto-TLS Let's Encrypt), beide in Docker `logging:none`.
Beweis NIP-11 über https grün (`{"name":"Toolpoint-Relay", restricted_writes:false}`).
Pinnwand verdrahtet: eigenes Relay als erster föderierter `RELAY_POOL`-Eintrag
(`pinnwand/index.html:355`), Smoke 58/58 grün.

**✅ CROSS-KNOTEN-TRANSPORT BEWIESEN (selbe Sitzung, Klaus' Sichttest):** zwei
getrennte Knoten (Spore `913db955…` + `4577385…`) tauschen Zettel cross-node in
der Pinnwand mit NUR `relay.family-projekt.de` aktiv — Klaus: „blitzartig, so
schnell wie die öffentlichen". Fremd-Relay-Metadaten-Abhängigkeit aufgelöst.
Meilenstein-Doku §4 nachgezogen. **Weiterhin offen:** semantische
**Frage→Antwort** über dieses Medium (Modul 04.C `queryLocal` + 15 `op:"query"`).

**Offen (Folge):** (1) semantische Frage→Antwort übers eigene Relay verdrahten
(die Bedeutungs-Hälfte über den nun bewiesenen Transport). (2) Log-Freiheit
**öffentlich prüfbar** machen (Konfig ins `SB-KIMTool-Point` spiegeln + `RUST_LOG`
klein). (3) Toolpoint-Seite mit getrennten Räumen (braucht Repo-Zugriff). (4)
ufw-Firewall auf dem VPS nachziehen (in der Live-Sitzung zugunsten Tempo defer'd).
**Nächster sinnvoller Schritt:** Pinnwand mit dem neuen Relay deployen, dann
Zwei-Geräte-Cross-Node-Test.

### 2026-06-25 · PARKPLATZ Verschlüsselung/Privatheit — Brainstorm-Brief für Folge-Sitzung

Lange Pinnwand-Fortsetzung (PRs #439–#448, alle squash auf `main`): Baum-Icon +
Topbar-Logo, löschbare Suchen, Vergrößern/Vollbild/Hard-Reload-Knöpfe, Mikrofon
an allen Texteingabe-Feldern, „KI-Modelle löschen", mehr Richter-Anbieter
(Gemini + OpenRouter mit Live-Gratis-Liste), mehrere wählbare breit gestreute
Relays, und privates Brett per **gemeinsamem Passwort** (AES-GCM + PBKDF2).

**Parkplatz/Brainstorm:** Klaus' treffender Befund — das gemeinsame Passwort hat
das **Verteilungs-Problem** (Passwort muss out-of-band geschickt werden →
Schwachstelle). Er will den **Public-Key-Weg (WhatsApp/Signal-Stil)** untersuchen:
jeder hat ein Schlüsselpaar (die **Spore IST schon eins**; noble kann
`getSharedSecret`/ECDH), man tauscht nur öffentliche Schlüssel, kein Passwort.
Ehrliche Gabelung: **offenes Entdeckungs-Brett ⟂ Ende-zu-Ende-Geheimhaltung**
(Fremde-Finden braucht lesbaren Inhalt) vs. **privat-an-Bekannte** (Public-Key
voll möglich). Relevanter Alt-Entwurf: offener **PR #302 E2E-Vertraulichkeit**
(sealed-box X25519). **Bewusst KEIN Code** bis Klaus' Richtungsentscheid (Krypto
sicherheits-sensibel). Brief:
`docs/sessions/BRIEF_PINNWAND_VERSCHLUESSELUNG_BRAINSTORM.md`.

### 2026-06-24 · Pinnwand-PWA: Baum-Icon + löschbare Suchen + Werkzeug-Knöpfe + Cache-Fix

**Rolle:** Bau-Sitzung (Freibrief, Klaus zweifach „selbstständig merken"). Klaus'
Befund „alte Version hängt" war **kein Branch-Problem** (verifiziert: kein
gh-pages, Pages liest `main`, moderne Marker nachweislich in `main`) — sondern
der **Service-Worker cachte cache-first ohne Versions-Bump**. Behoben:
- **SW Cache-Bust + Navigation netz-zuerst** (#438), Cache-Version jetzt **v4**
  (jeder Asset-Wechsel zählt hoch). „Alte Schale hängt" damit dauerhaft gelöst.
- **Hard-Reload-Knopf 🔄** in der App: Service-Worker abmelden + alle Caches
  leeren + neu laden — Klaus kann den Cache jederzeit selbst sprengen.

**Icon:** Klaus wählte zuletzt das **Lebensbaum-Icon** (ohne Text-Variante);
vorher Pin-Spore A. Pillow LANCZOS 512+192, App-Icon + Favicon (#436/#439/dieser).

**Bedien-Wünsche (alle in `pinnwand/index.html`, Render-Schicht):**
- **Suchen löschbar:** ✕-Kreuz pro Frage blendet lokal aus + `🧹 leeren` blendet
  alle aktuellen aus; persistent (`localStorage` `sbkim_pinnwand_hidden`), Filter
  in `renderQuestion`. EHRLICH: öffentliche Relay-Notizen sind nicht echt
  löschbar — lokales, persistentes Ausblenden (im UI/Footer benannt).
- **Vergrößern-Knopf 🔍:** 3 Text-Stufen, persistent (`data-scale`).
- **Vollbild-Knopf ⛶:** Fullscreen-API-Toggle.

Smoke `pinnwand/_smoke.mjs` **49/49**, `node --check` sauber.

**Offen:** Klaus' Sichttest der neuen Knöpfe + Optik (Effekte ihm noch zu dezent
→ ggf. Aurora kräftiger). Cross-Knoten/Relevanz-Rückmeldung weiter als Folge.

### 2026-06-24 · SITZUNGS-ABSCHLUSS Pinnwand (Klaus macht morgen weiter)

**Stand:** Pinnwand-PWA fertig auf `main` (PRs #421–#436, alle squash). Voller
Bogen: Boden-Beweis Medium → Frage→Antwort → Whitening → KI-Richter (Cloud +
gratis WebLLM) → eigenständige installierbare PWA `pinnwand/` (moderne Optik +
echtes Pin-Spore-Icon). Übergabe:
`docs/sessions/archiv/2026-06-24_nostr-pinnwand-test.md`. Folge-Brief:
`docs/sessions/BRIEF_PINNWAND_FOLGE.md`.

**Offen (Klaus' Sichttest, morgen):** PWA-Optik/Animation flüssig + Geschmack;
Icon/Favicon live; WebLLM-Gerätelauf (welche Modell-Klasse trägt das Tab S6).
**Smokes grün:** nostr-test 31 + 57 + 10, pinnwand 41. Sage-Smokes unberührt.
**Offene Fremd-PRs:** #401 (Discovery-Bilder), #302 (E2E-Spec) — alt, andere
Sitzungen, unberührt gelassen; nur möglicher PULS-Rebase-Konflikt.

### 2026-06-24 · Pinnwand-PWA: moderner Look aus den ChatGPT-Mockups (ohne Messenger-Optik)

**Rolle:** Bau-Sitzung (Freibrief). Klaus schickte 5 ChatGPT-Mockups (dunkel-
türkis / hell-warm / hell+dunkel-clean) + Wunsch „kombiniere alle, NICHT wie
WhatsApp, modern mit Effekten/Animation, da steckt mehr dahinter".

**Was getan (`pinnwand/index.html`, nur Render-Schicht — Engine unberührt):**
Kombinierter moderner Skin in echtem CSS: **animierter holografischer Aurora-
Hintergrund** (`body::before`, langsam wandernde Verläufe, GPU-schonend),
pulsierendes Logo, glasige Karten mit Hover-Lift, **leuchtender „?"-Knoten** +
Akzent-Kante an Frage-Karten, **farb-gestufte Score-Pillen** (grün/amber/rot
nach Wert, JS setzt Ton), lebendiger Gradient-Button, Fokus-Glow. **Anti-
WhatsApp:** statt Gesichts-Avataren ein **Netz-Knoten-Punkt** vor der Identität
(`.who::before`, Farbe = Frage violett / Antwort blau) — on-theme, kein
Messenger. `prefers-reduced-motion` schaltet Animationen ab. Smoke **41/41**,
`node --check` sauber.

**Offen:** Optik-Sichttest wartet auf Klaus (Geschmack). Icon-Prompts + Stil-
Prompts laufen separat — Klaus testet ChatGPT-Bilder, wir wählen Icon + ob noch
näher an einen Mockup. Mögliche Folge: Graph als zweite Gestalt, Relevanz-
Rückmeldung, Optik-Feinschliff nach Klaus' Bild-Wahl.

### 2026-06-24 · Pinnwand als eigene installierbare PWA (`pinnwand/`)

**Rolle:** Bau-Sitzung (Freibrief). Klaus' Wunsch: die fertige Pinnwand als
**eigene, downloadbare PWA** in eigenem Ordner (wie `such-tool/`), moderner Look
(inspiriert vom MYZEL-Mockup, aber nicht steampunk — modern, mehrere Geschmäcker),
weiter hier verbesserbar.

**Was getan (neuer Ordner `pinnwand/`, Geschwister zu `such-tool/`):**
- Vollständige **installierbare PWA**: `index.html` (Engine der Frage→Antwort-Seite
  1:1 übernommen — Nostr/Krypto/Auto-Reconnect/Whitening/Richter cloud+webllm),
  `manifest.json` (display standalone, Icons 192/512 + maskable), `sw.js`
  (App-Schale cache-first, Fremd-Origin durchgereicht — Relays/CDN/WebLLM/API),
  `impressum.html` (Datenschutz-Vorlage, **keine PII**, „Brett ist öffentlich"-Warnung),
  Icons per Node-zlib generiert (moderner Knoten-Netz-Look), `modules/`
  (byte-Kopien noble + 03_embedding, Drift-Guard).
- **Moderner Skin:** Verlaufs-Hintergrund, Topbar mit Logo, weichere Karten —
  bewusst aufgeräumt statt Steampunk. SW-Registrierung, `viewport-fit=cover`,
  Apple-PWA-Meta.
- Smoke `pinnwand/_smoke.mjs` **41/41** (Installierbarkeit + Drift-Guard + SW +
  Engine mitgekommen). `node --check` index/sw/03 sauber. Sage-Smokes unberührt
  (such-tool 46/46).

**Ehrlich offen:** Installations-Sichttest (PWA „zum Startbildschirm",
Offline-Start) + die WebLLM-Stufe warten auf Klaus' Gerät. NICHT in Sage-Page
verlinkt (Klaus' Wort abwarten). Folge möglich: Graph-Ansicht als „zweite
Gestalt" (später, Klaus' Mockup), Relevanz-Rückmeldung.

**Nächster Schritt:** Klaus öffnet `pinnwand/` über Pages, prüft Optik + „zum
Startbildschirm hinzufügen" (Installierbarkeit), meldet Geschmack/Feinschliff.

### 2026-06-24 · Nostr KI-Richter Stufe 2: freier WebLLM-Pfad (Modell-Wahl Trabant→Mercedes)

**Rolle:** Bau-Sitzung (Freibrief). Klaus' Geräte-Check ergab überraschend
**WebGPU-Adapter nutzbar = ja** auf dem Galaxy Tab S6 (8 Kerne, ~4 GB grob,
11 GB Kontingent). Klaus' Argument: sein altes Gerät ist die **Untergrenze** —
läuft es dort, haben neuere Geräte Luft → Modell-Wahl bis hoch, nicht nur klein.

**Was getan (`frage-antwort.html`):** dritter, **gratis** Richter-Backend WebLLM
(KI im Browser, kein Schlüssel, kein Cent). Steckbar neben Cloud (`getVerdicts`
verzweigt claude|webllm, gleiches Verdikt-Schema, gleiche Verneinungs-Prompt +
`parseJudgeJson`). Lazy-Import `esm.run/@mlc-ai/web-llm`, `CreateMLCEngine` mit
Fortschritts-Callback, `engine.chat.completions`. **Modell-Auswahl
Trabant→Mercedes:** Qwen2.5 0.5B/1.5B(Default)/3B/7B + Llama 3.1 8B.
„Modell laden"-Knopf (einmaliger Download → Cache), fail-soft (kein WebGPU /
Lade-Fehler → Hinweis, gratis Embedding bleibt). Footer + RICHTER-STUFEN.md
(Stufe 2 „gebaut") nachgezogen.

**EHRLICH — nicht headless testbar:** mein Cloud-Container hat keine GPU/Browser,
ich konnte WebLLM NICHT real laufen lassen (nur Struktur-Smoke + `node --check`).
WebLLM hat geräte-/modell-spezifische Eigenheiten (f16-Support, exakte Modell-
Kennungen) — der **erste Browser-Lauf bei Klaus ist der echte Test**, wir tunen
Modell-ID/Klasse mit seinem Feedback. Nicht gleichwertig zur Cloud (kleines
Modell, langsamer) — gratis Boden, nicht „dasselbe". Smoke `_smoke_frage_antwort`
**57/57**, Boden 31/31, Geräte-Check 10/10.

**Nächster Schritt:** Klaus lädt auf dem Tablet erst „VW Golf" (1.5B, sicher),
dann „großer VW" (3B, am Limit) → meldet, ob/wie schnell es läuft. Danach
Modell-Liste justieren. Optional später: Relevanz-Rückmeldung.

### 2026-06-24 · Nostr-Test: Geräte-Check (kann mein Gerät WebLLM?)

**Rolle:** Bau-Sitzung (Freibrief). Klaus' Frage „checke mein System / was sind
die Voraussetzungen". Ehrlich: die Sitzung läuft in der Cloud, kann Klaus'
Tablet NICHT messen — daher ein Browser-Werkzeug, das auf SEINEM Gerät misst.

`geraete-check.html` (self-contained, kein CDN): misst WebGPU-Adapter (echter
`requestAdapter`, nicht nur Präsenz), `deviceMemory`, `hardwareConcurrency`,
`storage.estimate`. Verdikt je Stufe: Stufe 1 (Embedding) + Cloud-Richter laufen
fast überall (Klaus' Tablet bewiesen); **Stufe 2 WebLLM** braucht WebGPU +
~2–4 GB → auf dem Galaxy Tab S6 (2019) grenzwertig/unwahrscheinlich. Ehrlich:
Werte sind Näherungen; Dateien löschen hilft beim Modell-Download, aber WebGPU/
GPU-Alter kann man nicht „freilöschen". Verlinkt aus `frage-antwort.html`.
Smoke `_smoke_geraete_check.mjs` **10/10**; Regress 53/53 + 31/31.

### 2026-06-24 · Nostr KI-Richter: Sichttest GRÜN + Schlüssel merken (opt-in)

**Rolle:** Bau-Sitzung (Freibrief).

**SICHTTEST CLOUD-RICHTER GRÜN (Klaus 2026-06-24):** Claude-Haiku-Richter live
über eigenen Schlüssel. „echte Alkoholcocktails" fiel ans Ende (0.10) mit Grund
*„NICHT alkoholfrei – direkte Verneinung der Bedingung"*. **Krön-Beleg
(Weltwissen):** dieselbe Speise, drei Essig-Formulierungen → drei Werte:
„naturtrüber, garantiert alkoholfrei" **0.80**, „verlorenes Essigwasser" **0.60**,
**„vergorener Essig" 0.20** mit Grund *„Vergorener Essig enthält Alkohol,
widerspricht alkoholfrei-Anforderung"*. Sogar „Bierbrause enthält oft
Alkoholspuren" (0.30). Genau Klaus' Vorhersage, bestätigt durch das Modell.
Damit ist der ganze Bogen sichtbar: Medium + Vektor-Kalibrierung + Absicht/
Verneinung/Weltwissen.

**Schlüssel-Persistenz (Klaus' Befund: Key nach Reload weg):** Häkchen „auf
diesem Gerät merken" (Default an) → Schlüssel im `localStorage` (Klartext, nur
Gerät), Wiederherstellung beim Laden (`restoreJudge`), Häkchen weg → sofort
gelöscht (`persistJudge`). Ehrlich: Klartext; der verschlüsselte Weg wäre der
Tresor (Modul 20), für die Testseite bewusst die einfache Bequemlichkeit.
Smoke **53/53**, Boden 31/31, `node --check`-sauber.

**Kosten-Klärung (Klaus' Sorge „teuer"):** die 2,69 USD auf dem Schlüssel sind
der kumulierte Gesamt-Verbrauch seit 21.06, NICHT ein Such-Aufruf; ein
Haiku-Richter-Aufruf über wenige kurze Antworten ist ein Bruchteil eines Cents.
Der gratis Weg dagegen: Stufe 2 WebLLM (nächster Stich).

**Nächster Schritt:** freier WebLLM-Pfad (Stufe 2, kein Cent/Suche) ODER
Relevanz-Rückmeldung.

### 2026-06-24 · Nostr Frage→Antwort: KI-Richter Stufe 1 (Cloud BYOK) + drei freie Stufen

**Rolle:** Bau-Sitzung (Freibrief). Anschluss an den Whitening-Fix: Klaus sah,
dass der Vektor „Alkoholcocktails" bei einer „alkoholfrei"-Frage nicht aussortiert
(Embedding misst Thema, nicht Absicht/Verneinung). Lange Klaus-Diskussion über
(a) tiefen Inhalt schlägt Hülle, (b) ob das System „von selbst lernt" (nein —
e5 ist eingefroren; was sich besserte war der Mittelwert-Schätzer; echtes Lernen
nur via Relevanz-Rückmeldung/Query-Schärfung, bewusst gebaut), (c) Bezahl-Frage
(„arme Oma").

**Was getan (`frage-antwort.html`):**
- **KI-Richter Stufe 1 (Cloud, BYOK):** steckbare Provider-Abstraktion (gespiegelt
  aus Modul 04 `hybridMatch`) — `claude` (Anthropic, Browser-CORS-Header) +
  `mistral` (EU). Prompt bewusst auf **Verneinung/Absicht** getrimmt
  (`buildJudgePrompt`), robustes `parseJudgeJson` (Code-Fence/Prosa-tolerant),
  Richter-Urteil (⚖️-Badge + Begründung) hat Vorrang vor dem Cosinus. **Opt-in,
  Default aus** — gratis Embedding-Weg bleibt Voreinstellung. **Schlüssel NUR
  im Speicher** (kein localStorage, kein Code, kein Tracker).
- **Drei-Stufen-Doku öffentlich** (`RICHTER-STUFEN.md`): (1) gratis/überall
  lokales Embedding+Whitening, (2) gratis/gerät-hungrig WebLLM im Browser
  (nächster Stich, im UI vorgemerkt+deaktiviert), (3) bezahlt/stärkste Cloud.
  Plus Vision: Pilz-Schicht trägt Kosten für die, die nicht können.
- **Embedding-Modell-Einordnung** (Klaus' Frage „gibt's bessere, z.B. chinesische?"):
  ja — BGE-M3/GTE (China), Jina (EU), e5-base/large; netzweit-koordinierter Hebel,
  ersetzt aber nicht den Richter. Festgehalten in der Chat-Antwort.

**Tests:** Headless `_smoke_frage_antwort.mjs` **48/48** (Richter-UI, Provider,
CORS-Header, Key-nur-im-Speicher, Verneinungs-Prompt, fail-soft). Parse+Ranking
separat numerisch geprüft (5/5 + Ranking). Boden 31/31. `node --check`-sauber.

**Was offen:** Browser-Sichttest des Cloud-Richters wartet auf Klaus (eigener
Schlüssel). **WebLLM-Pfad (Stufe 2)** ist der nächste Bau — läuft nicht auf dem
Galaxy Tab S6 (WebGPU), daher auf PC zu testen. **Relevanz-Rückmeldung** als
„lernt mit jeder Antwort" ist ein eigener Folge-Stich.

**Nächster Schritt:** Klaus testet den Cloud-Richter (Schlüssel eingeben →
„Richter anwenden" → „Alkoholcocktails" sollte trotz Themen-Nähe nach unten).
Danach WebLLM (Stufe 2) oder Relevanz-Rückmeldung.

### 2026-06-24 · Nostr Frage→Antwort: Anisotropie-Fix (whitened Cosinus) — Klaus' Befund

**Rolle:** Bau-Sitzung (Freibrief). Klaus' Sichttest der Bedeutungs-Sortierung
zeigte das erwartete Problem: Scores klebten bei 0.80–0.84, Reihenfolge verkehrt
(„Alkoholcocktails" 0.84 oben, „Salat+Melonenbowle" 0.80 unten, obwohl die Frage
„leicht + alkoholfrei" war). Klaus erkannte: es misst die **Hülle** (gleiche
Sprache/Stil), nicht den Inhalt — und erinnerte korrekt an die frühere
„Rechenproblematik" + Lösung.

**Diagnose:** genau der Befund aus `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`
(**Anisotropie**): roher e5-Cosinus hat einen hohen Boden (~0.82), weil das
Modell alle Vektoren in einen engen Kegel legt. Mein `dot()` rechnete rohen
Cosinus — mathematisch korrekt, aber das von der Lehre als untauglich entlarvte
Verfahren.

**Fix (whitened Cosinus, self-contained):** vor dem Cosinus den Mittelwert-
Vektor abziehen + re-normieren (`whiten`/`meanVec`/`relevance`), Score = zentriert.
Statt einer netzweiten Konstante (liefert erst Bau „Modul 04 Whitening") ein
**wachsender Referenz-Schwerpunkt** (`accumulate`) aus allen eingebetteten Texten
der Seite. Fallback auf rohen Cosinus, solange < 3 Vektoren gesammelt.
**Numerisch belegt** (synthetische Anisotropie-Probe): roh 0.91–0.999 → zentriert
+0.997 (passend) … −0.93 (Alkohol/schwer) — Spreizung + korrekte Reihenfolge.
Footer nennt Whitening + Lehre. Smoke `_smoke_frage_antwort.mjs` **38/38**,
Boden 31/31. `node --check`-sauber.

**Ehrlich:** lokaler Schwerpunkt aus wenigen Texten ist ein grober μ-Schätzer
(die saubere, netzweite Konstante kommt mit Modul 04 Whitening). Browser-
Sichttest der neuen Reihenfolge wartet auf Klaus.

**Nächster Schritt:** Klaus' Sichttest — passende Antwort sollte jetzt oben,
Alkohol/schwer unten stehen, Scores gespreizt (auch negativ möglich = unverwandt).

### 2026-06-24 · Nostr Frage→Antwort: Bedeutungs-Sortierung eingebaut (Hälften verdrahtet)

**Rolle:** Bau-Sitzung (Freibrief). Auf Klaus' „lass uns das einbauen" — die
beiden im Meilenstein bewiesenen Hälften (Semantik + Medium) erstmals **in
einer Seite verdrahtet**.

**Was getan (`frage-antwort.html` + vendoriertes Modul 03):**
- **Modul 03 Embedding byte-kopiert** nach `docs/discovery/nostr-test/03_embedding.js`
  (Drift-Guard im Smoke). Seite lädt es als klassisches Script.
- **Antworten nach Bedeutung sortieren:** Modul 03 bettet Frage (`embedQuery`) +
  Antworten (`embedPassage`) ein, Cosinus = Skalarprodukt normierter Vektoren
  (gleiche Mathematik wie Modul 04, **ohne** dessen 0.80-Korpus-Schwelle —
  im Thread wird **sortiert, nicht weggefiltert**). Score-Badge pro Antwort
  (Nähe zur Frage), höchste oben. Re-Sort bei neuer Antwort/Frage.
- **Architektur-Entscheidung (passt zur Pilz-/Empfangsmodus-Tafel):** das
  Embedding-Modell (~30 MB, CDN) lädt **erst auf bewusste Nutzer-Aktion**
  (Knopf „🧠 nach Bedeutung sortieren"). Ohne Knopfdruck bleibt die Seiten-Schale
  CDN-frei; alles fail-soft (Modell-Fehler → bleibt Ankunfts-Reihenfolge,
  Status-Hinweis). Footer ehrlich nachgezogen.
- Smoke `_smoke_frage_antwort.mjs` **35/35** (Drift-Guard Modul 03 + semantische
  Anker + „sortiert, filtert nicht"). Boden-Smoke 31/31. Inline-Module +
  Modul 03 `node --check`-sauber.

**Tafel-Spannung benannt (nicht still umgangen):** der Nostr-Test galt als
„kein Runtime-CDN". Bedeutungs-Sortierung braucht das Modell zwingend (genau wie
Such-Tool/Sage-Page). Gelöst über **nutzer-ausgelöstes** Laden — die Schale
bleibt CDN-frei, das CDN ist benannt + sichtbar + opt-in (Pilz-Schicht-Prinzip).

**Was offen:** Browser-Sichttest der Sortierung wartet auf Klaus (Modell-Download
+ Reihenfolge live). Weiter öffentlich, keine Haltbarkeit, kein Spam-Schutz,
kein Sende-Queue.

**Nächster Schritt:** Klaus' Sichttest — Frage stellen, mehrere verschieden gute
Antworten, „nach Bedeutung sortieren" → passendste oben. Danach ggf. Cross-Knoten
(Modul 04.C `queryLocal` gegen echten App-Korpus, `notiz-bauplan-live-suche.md`).

### 2026-06-24 · Nostr Frage→Antwort GRÜN + Auto-Reconnect (Klaus' Gerätetest)

**Rolle:** Bau-Sitzung (Freibrief).

**FRAGE→ANTWORT-BEWEIS GRÜN (Klaus' Gerätetest 2026-06-24, 19:54):** Tablet
(Spore `2e084f93…7fae`) stellt Frage „was ist ein leichtes Sommeressen…" →
erscheint auf dem Handy → Handy (Spore `e87a1618…b365`) antwortet „Salat mit
gurken Melonenbowle" → Antwort erscheint **korrekt eingerückt unter der Frage**
auf dem Tablet (über NIP-01 `e`-Tag-Threading). Geräteübergreifend, server-los,
über ein geborgtes Brett. Klaus: „sobald die Relais verbunden sind, ist die
Antwort schlagartig da."

**Befund + Fix (Auto-Reconnect):** Klaus beobachtete, dass bei Relay-Abbruch
manuell aktualisiert werden musste (Mobil: Tab im Hintergrund → Socket stirbt,
kein Selbst-Reconnect). Behoben auf BEIDEN Seiten (`index.html` +
`frage-antwort.html`): Relay-Verbindungen jetzt als `conns`-Map mit
**Backoff-Reconnect** (2s→4s→…→20s gedeckelt, Backoff bei `onopen` zurück) +
`scheduleReconnect` aus `onclose`/`onerror` + **`visibilitychange`-Reconnect**
(Tab wieder sichtbar → tote Sockets sofort neu). `liveSockets` über
`Object.values(conns)`. Smokes verankern den Reconnect (Boden 31/31,
Frage→Antwort 25/25). Inline-Module `node --check`-sauber.

**Ehrlich offen:** Wer postet, während kein Relay verbunden ist, muss die
Eingabe weiter wiederholen (kein Sende-Queue/Re-Broadcast — bewusst nicht
gebaut, Test-Scope). Antworten weiter ohne Bedeutungs-Sortierung (Modul 03/04 =
nächster Stich). Weiter öffentlich, keine Haltbarkeit, kein Spam-Schutz.

### 2026-06-24 · Nostr Frage→Antwort übers Brett (Stich 2 nach Boden-Beweis)

**Rolle:** Bau-Sitzung (Freibrief). Auf Klaus' „beides — Doku, dann bauen".
Zwei Teile, je eigener PR: (1) Meilenstein-Doku nachgezogen (Medium-Hälfte
bewiesen, PR #424); (2) dieser Bau.

**Was getan (`docs/discovery/nostr-test/frage-antwort.html`, self-contained):**
- Nächster Stich auf dem grünen Medium: nicht nur posten/lesen, sondern eine
  **Frage** aufs Brett legen und **Antworten** einsammeln. NIP-01-konform:
  Antwort = Notiz mit zusätzlichem `["e", frageId]`-Tag (Standard-Reply-Bezug).
  Client partitioniert eingehende Notizen: ohne e-Tag = Frage (Top-Level), mit
  e-Tag = Antwort (gruppiert unter ihre Frage). Verwaiste Antworten (Antwort vor
  Frage angekommen) werden gepuffert und nachgereicht.
- Eigenes Topic-Tag `#sbkim-frage-antwort-test` (getrennt vom Pinnwand-Brett).
  **Teilt die Identität** mit dem Pinnwand-Test (`localStorage`-Key
  `sbkim_nostr_test_priv`) → gleiche Spore über beide Seiten. Krypto erneut
  lokal vendoriert (geteilte `noble-secp256k1.js`). Pro-Frage-Antwortfeld,
  Krypto-Selbsttest, Relay-Status, ehrlicher Footer. Quer-Links beide Seiten.
- Smoke `_smoke_frage_antwort.mjs` **23/23 grün** (NIP-01-Reply-Mechanik
  kryptographisch belegt: Frage ohne e-Tag, Antwort referenziert Frage-id, beide
  Signaturen verifiziert, zwei verschiedene Identitäten + Seiten-Struktur).
  Boden-Smoke weiter **29/29 grün**.

**Was offen / ehrlich:** Antworten erscheinen in **Ankunfts-Reihenfolge, noch
nicht nach Bedeutung** — die semantische Sortierung (Modul 03/04) über das Brett
ist der nächste Stich. Weiter öffentlich, keine Haltbarkeit, kein Spam-Schutz.
**Geräteübergreifender Sichttest wartet auf Klaus** (Handy fragt → Tablet
antwortet → erscheint beim Frager).

**Nächster sinnvoller Schritt:** Klaus' Frage→Antwort-Gerätetest. Bei grün:
Antworten nach Bedeutung sortieren (lokal Modul 03/04) + grobe Tags am Pin fürs
Vorfiltern → Anschluss `notiz-bauplan-live-suche.md`.

### 2026-06-24 · Nostr-Pinnwand-Test — gerätegreifender Boden-Beweis (Medium)

**Rolle:** Bau-Sitzung (Freibrief). **Auf `main` gemerged** (PR #421, squash).
Eigenständiger Test-Stich, KEIN Produktiv-Modul.

**Ziel:** beweisen, dass ein Zettel aus Browser A über ein geborgtes dummes
Brett (Nostr-Relays) in Browser B / auf einem anderen Gerät auftaucht —
server-los, Klaus betreibt nichts. Vorbedingung für die offene Cross-Knoten-
Pinnwand (siehe `notiz-briefkasten-pinnwand.md`).

**Was getan (alles unter `docs/discovery/nostr-test/`):**
- **`noble-secp256k1.js`** lokal vendoriert (kein Runtime-CDN). **Befund &
  Abweichung vom Brief:** der Brief nennt „@noble/secp256k1 v2, async Schnorr"
  — aber **v2 hat Schnorr/BIP340 entfernt** (ausgelagert nach `@noble/curves`,
  kein `schnorr`-Export mehr). Nostr (NIP-01) braucht Schnorr mit x-only
  pubkeys. Daher **v1.7.1** vendoriert: letzte Single-File-, dependency-freie
  ESM-Variante mit async Schnorr via WebCrypto. Einzige Anpassung ggü.
  Original: Bare-Import `'crypto'` entfernt + Node-Zweig `node: undefined`
  (browser-tauglich). Begründung im Datei-Kopf.
- **`index.html`** — minimaler NIP-01-Client: Schlüsselpaar in `localStorage`
  (x-only pubkey), Event mit sha256-id + Schnorr-Sig, drei freie Relays
  (damus/nos.lol/nostr.band) mit Status-Punkten, Textfeld + „Aufs Brett legen",
  Live-Liste eingehender Zettel, Krypto-Selbsttest beim Laden, ehrlicher Footer.
- **`_smoke.mjs`** — **29/29 grün**: Krypto dependency-frei + voller Nostr-
  Krypto-Roundtrip (x-only/sha256/Schnorr sign+verify + Negativprobe) + Seite
  self-contained mit UI-Ankern und Relay-/Tag-Konfiguration. Relay-Round-Trip
  NICHT vorausgesetzt (Repo hat kein Playwright; Browser-DOM-Lauf via echtem
  Modul-Import + Datei-Analyse ersetzt).

**BODEN-BEWEIS GRÜN (Klaus' Gerätetest 2026-06-24, 19:27):** Handy (Spore
`e87a1618…b365`) tippt „Salate" → erscheint live im Tablet-Browser (andere
Spore `2e084f93…7fae`, andere Identität) als eingehender Zettel via
`relay.damus.io`. Zwei getrennte Geräte, zwei Schlüsselpaare, ein geborgtes
dummes Brett dazwischen — Klaus betreibt nichts. Damit steht die im Meilenstein
(`MEILENSTEIN_SEMANTISCHE_SUCHE.md`) noch als „offen" markierte Vorbedingung
(Browser fragt Browser server-los) **direkt über das Medium** — nicht mehr nur
über die KI-Brücke als Behelf. Krypto-Selbsttest OK, 2/3 Relays verbunden
(`relay.nostr.band` drosselte — egal, ein Relay reicht). Ehrlich: beweist nur
das Medium (öffentlich, keine Haltbarkeit, kein Spam-Schutz). Nicht in
Sage-Page/Discovery verlinkt (Notiz-Charakter, Brief-Leitplanke).

**Nächster sinnvoller Schritt:** Klaus' geräteübergreifender Sichttest. Bei
grün: Frage→Antwort übers Brett + grobe Tags fürs Vorfiltern (Sortierung bleibt
lokal, Modul 03/04) — Anschluss an `notiz-bauplan-live-suche.md`.

### 2026-06-23 · Discovery-Expedition: Hero-Animation-Feinschliff (Live-Sichttest mit Klaus)

**Rolle:** Bau-Sitzung (Freibrief). Direkt im Anschluss an den Seiten-Bau,
iterativ an Klaus' Galaxy-Tab-S6-Browser feinjustiert. **Auf `main` gemerged**
(PRs #402–#408, je squash). Klaus' Schluss-Urteil: „sehr gut gearbeitet".

**Was getan (Hero-Eröffnungssequenz, alles WebGL + Bild-Assets):**
- **Kometen statt Spiegel-Kugel:** 5–6 → **3 Kometen** mit Feenstaub-Schweif,
  fliegen auf die zentrale Erde zu und schlagen ein (Funken-Bursts), längere
  Pausen (weniger ablenkend). `depthTest:false`+`renderOrder` → Kometen VOR der
  Erde.
- **Zwei-Stufen-Erde:** dunkle, unbewohnliche Früh-Erde (`erde-dunkel.webp`,
  **aus `erde-blau.webp` abgeleitet** = deckungsgleich, glutrot) während der
  Einschläge → **fließende Überblendung zu Blau beim Hochscrollen** (uHabitable
  scroll-gesteuert, ~1.7 vh, smoothstep, Schicht-für-Schicht heller). Voller
  runder Planet via Rund-Maske (kein „zerschossener Fußball", kein schwarzer
  Halo). Erde sichtbar & vorn (renderOrder 5 vor Nebel −10).
- **Vergrößerter Nebel-Hintergrund** (`galaxie-hintergrund.webp`, JWST-Motiv),
  langsam driftend/zoomend; flach/breit (104×44) statt vertikal gestreckt.
- **Galaxien-Sterne funkeln** verstärkt, wenn die Erde zentriert (uTwinkle).
- **Wandernder Schnebel:** Sternenstaub-Auftreffpunkt wandert per Lissajous
  ununterbrochen über die Erde, liegt vor ihr (renderOrder 8).
- **Klick-Funken/Halo** genau am Klickpunkt (`burstAtScreen`, verglüht wieder).
- **Kamera** zentriert, weniger Abwärts-Blick → Erde voll im Bild.
- **Scroll-Glättung** (#411): scroll-gesteuerte Effekte über sanft nachgezogenen
  `smoothScroll` (Lerp) → weiche statt zackige Übergänge.
- **Sage-Page-Einbettung** (#410): eigene Discovery-Karte in `index.html` neben
  der Einladungs-Karte — Galaxie-Hintergrund + Erde im Dauerwechsel dunkel↔blau
  (CSS) + Hero-Text + Link auf die Discovery-Seite.
- Neue Hero-Assets: `erde-dunkel.webp`, `erde-blau.webp`, `galaxie-hintergrund.webp`
  (altes `planet-blau.webp` entfernt). Headless-Smoke `docs/discovery/_smoke.mjs`
  durchgehend **11/11 grün**.

**Was offen / nächster Schritt:** **Texte** mit Klaus durchgehen (Hero-Titel,
Untertitel, Galerie, versteckte Botschaften) — Klaus wollte das „gleich"
besprechen, Sitzung endete vorher. Brief liegt:
`docs/sessions/BRIEF_DISCOVERY_TEXTE_FEINSCHLIFF.md`. Sage-Page-Verlinkung ist
**erledigt** (#410); optional bleibt: die 4 Storyboard-Standbilder zusätzlich
einweben.

### 2026-06-23 · Discovery-Expedition: Bau der WebGL-Schöpfungs-Seite + 15 KI-Bilder

**Rolle:** Bau-Sitzung (Freibrief). PR #402 (Draft). Branch
`claude/discovery-expedition-imagery-3t3dya`.

**Was getan:**
- **Neue eigenständige Seite `docs/discovery/index.html`** in Einladungs-Qualität:
  vendorierte three.js + GSAP + Fonts werden aus `docs/einladung/vendor`
  **geteilt** (kein zweites Paket, Repo bleibt schlank). Eröffnungs-Animation
  (prozedurales WebGL): Kosmos-Tiefe → Galaxien entzünden sich gestaffelt +
  verbinden sich (Filament-Linien) → Element-Wanderung (Sternenstaub-Strom
  Richtung Erde) → goldenes Mycel wächst am Erd-Horizont. Storyboard-Untertitel
  in vier Phasen, „Überspringen"-Knopf, erstes Scrollen überspringt sanft.
  Danach Wissenschafts-Anker (Nukleosynthese/Sternenstaub, Pilze halfen dem
  Leben an Land) → Pilz-Galerie (11 Fähigkeiten, Staun-Text + leiser
  SBKIM-Spiegel + ehrliche Caveats) → Schluss-Bild → würdevolle, andeutende
  „versteckte Botschaften". Robust: `prefers-reduced-motion` (statische
  Komposition, kein Loop), WebGL-Context-Loss-Guard, Tablet-DPR-Deckel,
  graceful Bild-Fallback (museale Platzhalter-Kachel statt 404-Bruchbild).
- **15 KI-Bilder** von Klaus entgegengenommen, mit Pillow auf ≤1600px/webp q82
  verkleinert (je ~70–460 KB statt ~2,9 MB PNG, gesamt 3,6 MB) und in
  `assets/discovery/` abgelegt: 11 Pilz-Motive (mykorrhiza, physarum,
  radiotroph, weissfaeule, plastik, flechte, armillaria, biolumineszenz,
  ophiocordyceps, mitbauer, hyphendruck) + 4 Storyboard-Szenen (galaxien,
  elemente-erde, kosmos-mycel, schlussbild). Ophiocordyceps auf Klaus'
  Korrektur neu generiert (naturgetreue Ameise + schlanker Fruchtkörper-Stiel
  statt „Monsterkäfer" mit Schirm-Pilz).
- **Doku-Karte** `_discovery_expedition.md`: alle 15 Bilder eingebettet
  (inline an den Fähigkeiten + Storyboard-Block), als „KI-generiert"
  gekennzeichnet, Status-Header auf „✅ vorhanden" + Verweis auf die Seite.
- **Headless-Smoke** `docs/discovery/_smoke.mjs` **11/11 grün** (Canvas,
  11 Galerie-Kacheln, Storyboard, Hero-Reveal, keine unerwarteten Fehler/404;
  geduldete fehlende-Bild-404 werden über den Response-Status gefiltert).

**Leitplanken eingehalten:** nur Doku + Assets + Vision-Seite, **kein**
Modul-Code, **kein** Protokoll-Bump; keine PII; Bilder als „KI-generiert".
Discovery-**Mechanik** (Verzeichnis/Gossip) bleibt eine spätere Spec/Bau-Sitzung
Modul 14.

**Was offen / nächster Schritt:**
- **Klaus' Browser-Sichttest** (Galaxy Tab S6, Tablet- und DeX-Modus):
  Eröffnungs-Animation flüssig? Galerie-Bilder + Schluss-Bild laden? Reduced-
  Motion-Pfad? Performance? — headless ersetzt das nicht.
- Optional (Folge-Pflege): Sage-Page-Mount/Verlinkung der Discovery-Seite;
  ob die 4 Storyboard-Standbilder zusätzlich in die Hero-/Anker-Sektionen der
  Seite eingewoben werden sollen (aktuell rein prozedurales WebGL + nur
  schlussbild als Foto auf der Seite).
- Nach grünem Sichttest: PR #402 ready setzen + mergen (Freibrief).

### 2026-06-23 · Discovery-Expedition: Storyboard der Eröffnungs-Animation + Schluss-Bild

**Rolle:** Vision-Pflege (Klaus' Erweiterung). Hintergrund-Animation erzählt:
**Galaxien-Geburt (aufblitzen, verbinden, Nebel — Schöpfungs-Prinzip) → Hinwendung
zur Erde → Leben durch Mensch+Pilze+Organismen → traumhaftes Schluss-Bild** mit
fluoreszierenden Pilzen (tiefe Verbundenheit allen Lebens). Künstlerische Freiheit:
etwas übertrieben/fantasievoll, Abstände/Tempo verdichtet, aber wissenschaftlich
nicht falsch; teleologische Andeutung („das Universum wollte die Erde") bleibt
emotionale Andeutung, keine Behauptung.

**Was getan:** `_discovery_expedition.md` § Gestaltung um „Storyboard der
Eröffnungs-Animation" (4 Schritte) + „Künstlerische Freiheit" erweitert; vier neue
Hintergrund-/Szenen-Bild-Prompts (Galaxien-Geburt, Elemente Richtung Erde, Übergang
Kosmos→Mycel, Schluss-Bild „gelebtes Leben"). Kein Code.

**Was offen:** Bilder generieren (Klaus) → Bau-Sitzung baut Seite.

### 2026-06-23 · Discovery-Expedition: Gestaltungs-/Hintergrund-Vision festgehalten (Schöpfungs-Doku)

**Rolle:** Vision/Doku-Pflege. Klaus' Richtung für die künftige Discovery-Seite:
soll der Einladungs-Site **in nichts nachstehen, eher besser** — es ist eine
**Dokumentation der Schöpfung** (Schöpfer/Jehova würdigen). Hintergrund-Gedanke:
**Kosmos → Elemente (Nukleosynthese, „Sternenstaub") → Erde → Leben → Pilze als
Symbiose-Ermöglicher.** Andeutend, würdevoll, mit Hintergrund-Animationen +
dezenten „versteckten Botschaften".

**Was getan:** In `docs/components/_discovery_expedition.md` Abschnitt
„Gestaltung & Hintergrund-Vision" ergänzt (Anspruch, roter Faden, wissenschaftlicher
Anker, fünf Gestaltungs-Ebenen, Technik-Anker three.js+GSAP, Haltung). Bau-Brief
`BRIEF_DISCOVERY_EXPEDITION_BILDER.md` erweitert: Ziel ist eine **eigenständige,
hochwertige Discovery-Seite** (z. B. `docs/discovery/index.html`, WebGL wie die
Einladung), nicht nur Markdown; Phasen (Bilder → Seite), teilbar in zwei Sitzungen.

**Was offen:** Bilder generieren (Klaus) → Folge-Sitzung baut Seite. Kein Code.

### 2026-06-23 · Discovery-Expeditionskonzept (Modul-14-Erweiterung + Vision-Karte + Pilz-Doku)

**Rolle:** Doku/Vision. Klaus' Wunsch: das Discovery-Konzept (wie Knoten einander
finden, ohne Empfangsmodus zu brechen) schriftlich + eine Vision-Karte mit
faszinierenden Pilz-Fähigkeiten als Mitmach-Motivation.

**Was getan:**
- **Modul 14 (Diffusion)** um Abschnitt „Discovery / Expedition — foraging-Bild"
  erweitert: erkunden→verstärken→absterben = Modul 14 + Apoptose (07) + Reputation
  (10); Empfangsmodus-Auflösung (kein Knoten-Crawler — Empfehlung entlang Fäden
  ODER freiwilliges Verzeichnis als Pilz-Organ); drei Discovery-Formen.
- **Neue Vision-Karte** `docs/components/_discovery_expedition.md`: kuratierte,
  ehrliche Pilz-Fähigkeiten-Doku (Mykorrhiza/„Wood Wide Web", Schleimpilz/Physarum,
  radiotrophe Pilze, Weißfäule, Plastik-Fresser, Flechten/Extremophile, Armillaria,
  Biolumineszenz, Ophiocordyceps als Gegenbeispiel, Mit-Bauer-Kultur, Hyphen-Druck)
  + Spiegel-Tabelle zu SBKIM + **fertige Bild-Prompts pro Pilzart** (einheitlicher
  Gold-/Dunkel-Stil). Querverweis aus Modul 14.
- **Folge-Brief** `docs/sessions/BRIEF_DISCOVERY_EXPEDITION_BILDER.md` für die
  Bild-Sitzung (Klaus generiert Bilder → einbetten + Einladungs-Site verfeinern).

**Was offen:** Bildmaterial (eigene Folge-Sitzung, Brief liegt). Discovery-MECHANIK
(Verzeichnis/Gossip) bleibt spätere Spec/Bau Modul 14. Kein Code geändert.

### 2026-06-23 · Positionierung „Warum diese App statt KI?" + Server-Seiten-Frage (Doku)

**Rolle:** Doku/Strategie. Klaus' ehrliche Frage: man kann die Web-Suche auch in
jeder KI machen — was ist das Alleinstellungsmerkmal? Soll Mitmachen motivieren.

**Was getan:** Neue Doku [`docs/WARUM_SBKIM_STATT_KI.md`](WARUM_SBKIM_STATT_KI.md)
— ehrliche Positionierung: (1) Solo-Web-Suche ist KEIN USP; (2) echte Unterschiede:
server-los/privat + lokale Bedeutungs-Maschine (gratis ohne KI), anbieter-neutral/
forkbar, **dezentrale Knoten-Suche (Mycel)** ohne zentralen Index; (3) Wert
entsteht erst **eingebaut in Fach-Apps** + mit wachsendem Netz. **Server-Seiten-
Frage beantwortet:** ja, jede Internetseite kann mitmachen — die Module sind
Client-JS (egal ob GitHub Pages/PHP/Node/WordPress), Server hostet nur Dateien +
`spore.json` + SW; optional eigener Pilz-Server (Proxy/SearXNG). Ehrliche Grenze:
volle Cross-Origin-Live-Vernetzung server-los + **Discovery** (wie findet ein
Knoten fremde Knoten) noch offen. Geld/öffentlich bleibt Klaus' offene Entscheidung
(Phase D.2; offen-forkbar passt zur Philosophie, Geld in der Pilz-Schicht).
Querverweis aus dem Meilenstein-Dokument ergänzt.

**Was offen:** Discovery-Schicht-Konzept (Verzeichnis/Gossip) als künftige
Design-Frage; Geschäftsmodell (Phase D.2). Kein Code geändert.

### 2026-06-23 · Modul 22: 🔊 Vorlesen sprachbewusst (DE/EN/RU automatisch)

**Rolle:** Pflege Modul 22. Klaus' Frage: das Vorlesen klingt „intern" — geht
Multi-Language? **Klärung:** das 🔊 nutzt die **Browser-Sprachausgabe**
(`speechSynthesis`, lokale Geräte-Stimmen) — gratis/offline, aber Geräte-Qualität,
nicht KI. Eine natürliche KI-Stimme bräuchte BYOK + Proxy + Geld (Opt-in, später).
**Klaus-Wahl: „Browser-Stimme: Sprache fixen"** → umgesetzt: `detectLangCode`
(Kyrillisch→ru / deutsche Sonderzeichen+Stoppwörter→de / englische Stoppwörter→en)
+ `pickVoiceFor` wählt die passende System-Stimme; `readAloud` setzt `u.lang` +
`u.voice`. So wird die Zusammenfassung in der **richtigen Sprache** gesprochen.

**Tests:** `smoke_bau22_such_widget.mjs` **237/237** (Probe 51 erweitert: TTS-Stub,
de-Sprache + passende Stimme), Standalone **46/46**. Karte 22 nachgezogen.
Selbstständig gemerged (Freibrief).

**Was offen:** Klaus' Sichttest (Vorlesen in korrekter Sprache). KI-Neural-Stimme
als Opt-in bleibt offene Folge-Option (BYOK + Pilz-Server).

### 2026-06-23 · Modul 22: Schärfen-Mikrofon + KI-Zusammenfassung „warum diese Reihenfolge" (+ 🔊 Vorlesen)

**Rolle:** Pflege/Bau Modul 22 + `such-tool/`. Zwei Klaus-Wünsche aus der Nutzung.

**Was getan:**
1. **🎤 am Schärfen-Feld** — `onVoiceClick(targetEl)` verallgemeinert +
   `appendToField`; eigener Sprach-Knopf neben dem „Schärfen"-Feld (Modul 21),
   Kontext einsprechbar wie das Such-Feld.
2. **KI-Zusammenfassung mit Begründung** — `buildAiPrompt` fordert jetzt ein
   JSON-Objekt `{"zusammenfassung","treffer":[…]}`: 2–4 Sätze in der Sprache der
   Frage, **warum** diese Reihenfolge/Auswahl (kurze inhaltliche Begründung), damit
   man nicht alle Seiten öffnen muss. `parseAiAnswer` verträgt Objekt **und**
   Array (rückwärtskompatibel); `parseAiSummary`/`extractAiSummary` zieht die
   Zusammenfassung; Render als Block **über** den Treffern mit **🔊 Vorlesen**
   (`speechSynthesis`, server-los, fail-soft). Zusammenfassung wird mit der letzten
   Suche persistiert (Reload-Schutz).

**Tests:** `smoke_bau22_such_widget.mjs` **235/235** (Probe 51 neu), Standalone
`smoke_standalone_such_tool.mjs` **46/46**. Karte 22 + INTERFACES nachgezogen.
Selbstständig gemerged (Klaus' Freibrief „merge ohne Rückfrage").

**Was offen:** Klaus' Sichttest am Tablet — Schärfen einsprechen; bei einer
Internet-/KI-Suche erscheint oben die Zusammenfassung + 🔊 Vorlesen.

### 2026-06-23 · such-tool: goldener Pilz als Badge-Symbol + Favicon + PWA-Icons (Klaus-Bild)

**Rolle:** Pflege Modul 22 / `such-tool/`. Klaus schickte ein Bild eines goldenen
Pilzes und bat, den Fliegenpilz (🍄) im Badge zu ersetzen und ihn als Favicon +
PWA-App-Icon (Desktop-Installation) zu nehmen.

**Was getan:** Aus Klaus' Bild (1448×1086) per Pillow zentriert quadratisch
zugeschnitten + skaliert → `such-tool/icon-192.png` + `icon-512.png` neu (ersetzen
die alten zlib-Platzhalter; Favicon + apple-touch-icon + Manifest-Icons zeigen jetzt
den goldenen Pilz). Badge in `such-tool/index.html`: `🍄`-Emoji → rundes
`<img class="badge-mush" src="./icon-192.png">` (1.5em, dezenter Gold-Glow).

**Tests:** Standalone-Smoke `smoke_standalone_such_tool.mjs` **46/46** (Icons
vorhanden, Manifest 192/512 + maskable). Module unberührt.

**Was offen:** Klaus' Sichttest am Tablet (Badge + Favicon + Installations-Icon
Desktop). Hinweis: nach Merge die PWA per 🔄 / Cache-leeren aktualisieren, damit
das neue Icon greift (Icons werden vom Browser/Service-Worker gecacht).

### 2026-06-22 · Bau 22 Folge-Fix 2: Lehre App-Link, KI öffnen + Web kopieren + Frage sichern (PR #393)

**Rolle:** Bau-Sitzung Modul 22, nach Klaus' Live-Sichttest (PR #392 gemerged).
**Schlüssel-Befund (Klaus, am Tablet gezeigt):** ob ein externer Link die PWA
killt, hängt davon ab, **welche App das Ziel öffnet** — nicht „Prompt vs. Link":
- Ziel mit eigener App (`chatgpt.com` → ChatGPT-App) → öffnet als **App-Link in
  eigenem Task**, parallel; die PWA läuft weiter, Inhalt bleibt.
- Ziel ohne eigene App (`google.com/search`) → öffnet in **Chrome** = gleiche
  Engine wie die PWA → Kollision im Splitscreen → PWA neu geladen, Inhalt weg.

**Klaus-Entscheidung (AskUserQuestion): „KI öffnen + Web kopieren".** Umgesetzt:
- **„🤖 Prompt → KI (öffnen + kopieren)"** öffnet die KI **und** kopiert den Prompt
  (App-Weg parallel; ohne App sichern Clipboard + persistQuery + Reload-Schutz).
- **Netz-Karte** bietet **beide Wege zur Wahl** (Klaus: App soll mich selbst wählen
  lassen): 📋 Frage kopieren UND ↗ Im Browser öffnen.
- **`persistQuery`:** getippte Frage sofort in `localStorage` (`…lastsearch.query`)
  gesichert → überlebt Neustart auch ohne gerenderte Treffer.
- **Unangetastet:** Öffnen echter Treffer-Artikel (Reload-Schutz holt Liste zurück);
  Splitscreen manuell; Vollbild ⛶ bleibt.
- **🔄 App-aktualisieren-Knopf (neu, Klaus' Wunsch):** leert Cache Storage + meldet
  den Service-Worker ab + lädt neu (`hardReload`) — die installierte PWA holt die
  neueste Version ohne Browser-Menü. Opt-in (`init({reloadButton:true})`), in
  `such-tool/` an; Surface `reload()`.

**Tests:** `smoke_bau22_such_widget.mjs` **227/227** (Probe 27 = Netz-Karte
kopieren ODER öffnen; Probe 49 = KI-Prompt öffnet KI + kopiert + Frage-Sicherung/
Restore; Probe 50 = 🔄 Hard-Reload opt-in), Standalone **46/46**. Karte 22 (Lehre
App-Link + 🔄) + INTERFACES + PULS nachgezogen.

**Was offen:** Klaus' Sichttest nach App-Update — KI öffnet parallel + Prompt
kopiert; Web-Karte kopiert; Frage nach Neustart wieder da. Vergleich (Form 1/2/3)
+ Pilz-Server/Geld weiterhin offen.

### 2026-06-22 · Bau 22 Folge-Fix: Reload-Schutz (letzte Suche überlebt PWA-Neustart) + Such-Tool-Lupe

**Rolle:** Bau-Sitzung Modul 22, direkte Folge nach Merge PR #391 + Klaus' Live-
Sichttest der installierten `such-tool/`-PWA.

**Was getan:** (1) **Such-Werkzeug-Lupe** in der Sage-Page-Liste *PWAs im Mycel*
(`renderVorteilspackPwas`, relativer Link `such-tool/`, „PWA · öffnen +
installieren") — Klaus' Wunsch, die App mit einem Klick zu öffnen/installieren
(war Teil von PR #391). (2) **Reload-Schutz (neuer Fix):** Klaus' Live-Befund — im
Splitscreen auf einen Web-Treffer („in Google öffnen") tippen → Android startet die
PWA neu → Trefferliste (RAM) weg, Panel blank. Fix: die **letzte Suche** (Frage +
Treffer + `webLink`, nur Text+Link, keine PII) wird nach jedem Render in
`localStorage` `sbkim_search_widget_lastsearch` gespiegelt und beim Mount
(`restoreLastSearch`) automatisch wiederhergestellt — Treffer + Frage sind nach dem
Neustart wieder da. ✕ (dockToTop) löscht sie (frischer Start), – behält sie. Ergänzt
die Merkliste (bewusste Dauer-Ablage), ersetzt sie nicht.

**Tests:** `smoke_bau22_such_widget.mjs` **213/213** (Probe 48 neu), Standalone
`smoke_standalone_such_tool.mjs` **46/46** (Drift-Guard). Karte 22 + INTERFACES
nachgezogen.

**Was offen:** Klaus' Browser-Sichttest des Reload-Schutzes (nach Hard-Reload der
PWA): Web-Treffer öffnen im Splitscreen → zurück → Treffer wieder da. Vergleich
(Form 1/2/3) + Pilz-Server/Geld (Phase D.2) weiterhin Klaus-Entscheid.

**Nächster Schritt:** Reload-Schutz-PR mergen (nach Klaus' OK / Sichttest), App
aktualisieren, gegentesten.

### 2026-06-22 · Bau 22 Folge: Splitscreen-Fix + Vollbild-Modus + Merken-Liste

**Rolle:** Bau-Sitzung Modul 22 (Folge des Brainstorms 2026-06-22,
`BRIEF_BAU_22_VOLLBILD_MERKEN.md`). Freibrief.

**Was getan:** drei abgegrenzte Features (je eigener Commit), alle auf
`src/modules/22_such_widget.js` + byte-genaue Standalone-Kopie
`such-tool/modules/22_such_widget.js` (Drift-Guard):

1. **Splitscreen-Fix.** Ein einmaliger Window-Listener (`resize` +
   `orientationchange`) klemmt die gezogene (freie) Position über
   `clampPositionIntoView` zurück in den sichtbaren Bereich (24 px Rand-Reserve).
   Heilung schon beim Mount; geklemmte Position persistiert; fail-soft ohne
   `addEventListener`. Smoke Probe 45.
2. **Vollbild-Modus (⛶).** „Ein Werkzeug, zwei Gestalten": Pille bleibt
   Standard-Start; ⛶-Knopf im Panel-Kopf lässt das Panel den Viewport füllen
   (CSS `.sbkim-sw-fullscreen`, zweite Anzeige derselben Treffer, kein
   Kern-Umbau). NICHT persistiert (kein Auto-Vollbild). Verlassen via ⛶→🗗,
   Minimieren (–), X. Auf `such-tool/` automatisch verfügbar. Surface
   `enterFullscreen/exitFullscreen/toggleFullscreen/isFullscreen`,
   `_meta.fullscreen`. Smoke Probe 46.
3. **Merken-Liste (📌).** Haken pro Treffer → Gemerktes in `localStorage`
   (`sbkim_search_widget_merkliste`, nur Text+Link, KEINE PII, kein Protokoll),
   **gruppiert unter der Suchfrage** als Überschrift; Haken weg → Eintrag weg;
   alle Treffer-Arten mit Badge. Tool-eigene **Detail-Karte** (Overlay) beim
   Tippen: Titel/Beschreibung/URL + [📌 Merken] + [↗ Seite öffnen neuer Tab];
   Linksklick öffnet Karte, Rechtsklick bleibt „in neuem Tab". **Merkliste-
   Overlay** (📌-Kopf-Knopf), gruppiert, je Eintrag öffnen/entfernen + „Alles
   entfernen". Surface `openMerkliste/closeOverlays/getMerkliste/clearMerkliste`,
   `_meta.merkCount/merkOverlayOpen/detailOverlayOpen`. Smoke Probe 47.

INTERFACES § Modul 22 + Karte 22 + `manual_check` Panel 22 (Vollbild- +
Merken-Knöpfe) nachgezogen. Headless-Smoke `smoke_bau22_such_widget.mjs`
**208/208**, Standalone `smoke_standalone_such_tool.mjs` **46/46**.

**Was offen:** **Klaus' Browser-Sichttest** aller drei Features am Galaxy Tab S6
(headless ersetzt ihn nicht) — Splitscreen-Rückklemmung im DeX-Fenster,
⛶-Vollbild, 📌-Merken + Detail-Karte. **Vergleich/Splitscreen-zwei-Spalten**
(Form 1/2/3) und **Pilz-Server/Geld-Modell** (Phase D.2) bleiben offen für Klaus
(Richtungsentscheid, nicht in dieser Sitzung).

**Nächster Schritt:** Klaus testet im Browser → bei grün pro Feature mergen.
Danach Klaus' Form-Wahl für den Vergleich.

### 2026-06-22 · Sitzungs-Abschluss: Briefkasten + Brainstorm-Brief (Vollbild/Merken/Pilz-Wirtschaft)

**Rolle:** Abschluss der Such-Werkzeug-Sitzung (nach PR #388 Resize + PR #389
Standalone-PWA, beide gemerged).

**Was getan:** (1) **Briefkasten** an SB-KIMTool-Point gepflegt — Brief „Standalone-
Such-Tool: so wird der Download eine echte eigenständige PWA" in `sbkim/AUSTAUSCH.md`
(eigener-Ordner-Bau + Scope-Falle + Resize-Abgleich, Rück-Quittung erbeten),
`sbkim/SIGNAL.json` seq 31→32 (Push IST das Signal). (2) **Brainstorm mit Klaus** für
die Folge-Sitzung festgehalten in `docs/sessions/BRIEF_BAU_22_VOLLBILD_MERKEN.md`:
„ein Werkzeug, zwei Gestalten" (Begleiter klein / Suchraum Vollbild, NICHT auto-start),
**Merken-Liste** (Haken pro Treffer, gruppiert nach Suchfrage, localStorage Text+Link,
für Web/App/Knoten), **Treffer-Detail-Karten-Overlay** ([Merken]/[Seite öffnen neuer
Tab]; echte Seite nicht einbettbar), **Splitscreen-Fix** (Pille ins Sichtfeld
zurück-klemmen), **Vergleich** (Form 1 zwei Spalten/Server vs. Form 2 neuer Tab vs.
Form 3 eigener eingebetteter Server — Klaus' Wahl offen), **KI-Recherche** (automatisch
nur Claude server-los, Rest CORS-blockiert), **Pilz-Server + Geld-Modell** (serverless,
BYOK gratis / Pro = Server-Dienst, PayPal-Einmalkauf statt Pro-Klick; Kopier-Schutz =
Dienst verkaufen, nicht Code).

**Was offen:** Klaus' **Installations-Sichttest** `such-tool/` am Tablet (Seite rendert
live; „App installieren"-Geste final bestätigen). **Vergleichs-Form** (1/2/3) =
Richtungsentscheid für Klaus. Folge-Sitzung baut Splitscreen-Fix → Vollbild → Merken.

**Nächster Schritt:** Folge-Sitzung mit `BRIEF_BAU_22_VOLLBILD_MERKEN.md` (Codeblock im
Brief). Vorher Klaus' Vergleichs-Form-Wahl.

### 2026-06-22 · Strang C: eigenständige Such-Tool-PWA (such-tool/, Vorlage)

**Rolle:** Bau-Sitzung (Folge der Resize-Pflege). Klaus' Wahl: „Vorlage als
eigener Ordner".

**Was getan:** Self-contained Ordner `such-tool/` als **eigenständige,
installierbare PWA** und 1:1-kopierbare Vorlage (für SB-KIMTool-Point + Forker):
`index.html` (lädt die 4 komponierten Module, registriert SW, mountet das Widget
mit Internet/KI-Brücke an), `manifest.json` (display standalone, Icons 192+512
any+maskable), `sbkim-sw.js` (App-Schale cache-first, Fremd-Origin durchgereicht,
fetch-Handler für Installierbarkeit), `impressum.html` (Datenschutz + Impressum-
**Vorlage mit Platzhaltern**, keine PII hartcodiert), `icon-192/512.png` (Lupe,
per Node-zlib generiert), `modules/` (byte-genaue Kopien von src/modules
03/04/21/22). **Kern-Lehre dokumentiert:** ein bloßer Download (file://) wird nie
eine App — eine echte PWA braucht Hosting + Manifest + SW + eigenen Scope (Befund
am SB-KIMTool-Point). Konzept-Karte `docs/components/_standalone_such_tool.md`
(inkl. Scope-Falle + Monetarisierung-Vorgriff Phase D.2). **KI-Anbieter-
Recherche:** nur **Claude** geht server-los automatisch (CORS-Header); Gemini/
ChatGPT/Perplexity CORS-blockiert → Kopier-Pfad (schon da) oder späterer Proxy.

**Was offen:** Klaus' **Installations-Sichttest** am Tablet (App installieren →
eigenes Fenster, Offline-Start). Brief an SB-KIMTool-Point (Reproduktions-Rezept)
im Chat ausgegeben. Stränge B (B3-Richter) bleibt offen.

**Test:** `tests/smoke_standalone_such_tool.mjs` **46/46 grün** (Pflicht-Dateien,
Drift-Guard Modul-Kopien byte-identisch, Manifest installierbar-tauglich, SW
fetch-Handler + App-Schale, index.html-Verdrahtung, Impressum-Platzhalter).
Modul-22-Smoke unverändert 162/162.

**Nächster Schritt:** Installations-Sichttest; SB-KIMTool-Point übernimmt die
Vorlage; danach Strang B oder Pilz-Server-Konzept (Phase D.2).

### 2026-06-22 · Pflege Modul 22: Such-Panel größer ziehbar (Resize-Griff)

**Rolle:** Pflege-Sitzung Modul 22 (Strang A aus Klaus' Drei-Wege-Wahl —
bestätigt: „A — Panel größer ziehbar").

**Was getan:** Klaus' Befund — das untere Lesefeld (Treffer-Liste) im Such-Widget
ist zu eng. Ein **Resize-Griff unten rechts** (`.sbkim-sw-resize`,
`cursor: nwse-resize`) zieht jetzt gleichzeitig **Panel-Breite** (`panelWidth`,
240…760 px) und **Lesefeld-Höhe** (`resultsHeight`, 120…0.72·vh px). Größe
**persistiert** in `localStorage` `sbkim_search_widget_size` (User-Wahl heilig —
übersteht Re-Init, überschreibt `init({panelWidth,resultsHeight})`).
**Drag-Konflikt sauber getrennt:** Griff-`pointerdown` ruft `stopPropagation()`
(Verschiebe-Drag springt nicht zugleich an), `.sbkim-sw-resize` zählt als
interaktives Ziel, und beim Resize-Start stellt das Widget auf **freie Position**
um (obere-linke Ecke verankert → Griff wächst natürlich nach unten-rechts). Nur
bei `allowDrag:true` (gepinnte Widgets bleiben fest). Surface `+getSize/setSize`,
`_meta.panelWidth/resultsHeight`. Modul 17 unangetastet. Doku nachgezogen
(Karte 22, INTERFACES § Modul 22, CLAUDE.md-Zeile 22), Panel-22-Knopf
„Größe ziehbar: setSize + Reset" in `manual_check.html`.

**Browser-Sichttest grün (Klaus 2026-06-22, Galaxy-Tab-S6):** Griff ziehbar,
**gezogene Größe bleibt nach Hard-Reload erhalten** (Persistenz live bestätigt).
Lesefeld-Höhe ist eine Maximal-Höhe (wächst mit der Treffermenge) — von Klaus
als gewollt bestätigt. PR #388 gemerged.

**Was offen:** Stränge B (B3 Sicherheits-Richter, architektonisch —
Modul-04-Querschnitt, mit Klaus abstimmen) und C (Standalone-PWA-Download)
bleiben offen.

**Test:** Headless-Smoke `tests/smoke_bau22_such_widget.mjs` **162/162 grün**
(Probe 44 neu: Resize-Pfad + Persistenz über Re-Init + Min-Klemmung + Reset) +
Browser-Sichttest grün.

**Nächster Schritt:** Klaus' Wahl Strang B oder C.

### 2026-06-21 · Meilenstein-Serie auf der Sage-Page + Gute-Nacht-Karte an BookLedgerPro

**Rolle:** Pflege/Abschluss (Folge der Bau-22-Sitzung). Interaktiv mit Klaus am
Galaxy-Tab-S6, mehrere Sichttest-Runden.

**Getan:**
- **Meilenstein-Serie** auf der Sage-Page: aus der Einzel-Karte wurde ein
  **separater Bild-Container** (Werkzeugkiste-Karten-Stil) **direkt unter dem
  schwarzen Loch** — drei Kacheln nebeneinander (am Handy untereinander), je ein
  Bild: **01** „Das Mycel verbindet sich nach Bedeutung" (17.05.2026, Mixarium ⟷
  Rezeptbuch), **02** „Über den Ursprung hinaus" (20.06.2026, BookLedgerPro =
  erster eigenständiger Fremd-Knoten), **03** ⭐ „Bedeutung wird suchbar"
  (21.06.2026, semantische Suche). Klaus' drei generierte Bilder eingebaut
  (`assets/meilenstein-1.png` / `-2.png` / `meilenstein.png`).
- **Befund + Fix:** die Sektion lag ohne `span-12` im 12-Spalten-`.bento` und wurde
  auf ~1/12 Breite gequetscht (einbuchstabige Zeilen, scheinbar langgezogene
  Bilder) → in einen `card span-12`-Container gelegt, Kacheln quadratisch
  (`aspect-ratio 1/1`, keine Verzerrung). `meta-footer` + `legal-line` lagen aus
  demselben Grund gequetscht → ebenfalls `span-12`.
- **Lesbarkeit (Klaus-Wunsch):** weißer Text klein (0.6rem) + 4-Zeilen-Clamp
  (verdeckt das Bild kaum), wächst bei Hover (Maus) **oder** Antippen (`is-open`,
  Touch) auf volle Größe; Hinweiszeile entfernt (das „…" reicht).
- **PRs #383–#386 gemerged** (Serie, Bild-2-Tausch, Container-Fix, Text/​Aufklapp).
- **Briefkasten:** Gute-Nacht-/Dankeschön-Karte an **BookLedgerPro** ins Postfach
  (`AUSTAUSCH-BookLedgerPro.md`) — ihre geteilte Sprach-Schicht war der Funke fürs
  Such-Werkzeug; sie sind „Über den Ursprung hinaus". `SIGNAL.json` seq 30→31
  (das Pushen ist das Signal), lockere Rück-Quittung erbeten.

**Offen / nächster Schritt:** siehe Folge-Brief
`docs/sessions/BRIEF_BAU_22_B3_UND_VERTEILUNG.md` (B3 Richter / Breitziehen /
Standalone-PWA). **PULS-Überlauf** (5921 > 3000) — eigene Auslagerungs-Wartung
(NICHT kürzen). Klaus' Browser-Sichttest der finalen Kacheln war diese Sitzung
**grün** (mehrere Runden live bestätigt).

### 2026-06-21 · Bau 22 Such-Werkzeug: Stufe A→B (KI-Brücke · Tresor · Auto-Aufruf · Meilenstein · Verteilung)

**Rolle:** Bau/Pflege Modul 22, langer Increment-Marathon. Alle PRs gemerged
(#351–#379). Detail im Übergabeprotokoll
`docs/sessions/archiv/2026-06-21_bau-22-stufe-b-und-verteilung.md`.

**Getan (Kurzfassung):**
- **Stufe A — KI-Such-Brücke** (Gratis-Kopier-Pfad): `buildPrompt`/`parseAiAnswer`/
  `setAiAnswer`; KI-Anbieter ChatGPT/Claude/**Gemini**/Perplexity (Mistral +
  Aleph Alpha bewusst RAUS, Klaus-Entscheid). Live grün.
- **Prompt-Reife:** **Bedeutung-zuerst** (nicht Breite), **Schärfen-Feld**,
  **Recall-Lehre** (NoBite-Befund), **Agenten-Visitenkarte**-Präambel.
- **Treffer-UI:** 10 + ▾-Pfeil, **Prozent**, Inhalts-**Snippet**, **🖨 Block
  kopieren**, **Fortschrittsbalken**.
- **Stufe B1 — Widget-Tresor** (self-contained, Klaus: „eigenes Schloss"):
  PBKDF2 ≥600k + AES-GCM-256 + Shamir 2/3, 🔐-Modal-UI. **B2 — automatischer
  Claude-Aufruf** mit Web-Suche, **CORS LIVE bestätigt** (große offene Frage
  positiv beantwortet); Referenzfall **Hund + Katze bestanden** (Permethrin/
  Katzen-Konsequenz selbst erkannt, amtliche Quellen).
- **X leert Inhalt / – behält.** Such-Tool als **Kachel in der Werkzeugkiste**.
  **`llms.txt`** (Agenten-Einladung). **Meilenstein-Doku**
  `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` + ⭐-Anker in CLAUDE.md. Referenz-Fälle-
  Karte. **`impressum.html`** Datenschutz um Such-Tool/KI-Aufrufe ergänzt.
- Headless-Smoke Modul 22 **148/148**; Vorteilspack-Truhe **22/22**.

**Offen:** (1) Klaus-Browser-Sichttests der neuen Felder (Tresor-UI,
Fortschrittsbalken). (2) **B3** sicherheits-/eignungs-bewusster Richter
(Unsicheres rot/herabstufen, Sicheres hoch). (3) **Such-Panel breiter ziehbar**
(Klaus: Lesefeld eng). (4) **Standalone-Single-File-PWA-Download** + eigene
Fußzeile. (5) **Endknoten-Einbau-Test** (Mixarium/Rezeptbuch, extern). (6) volle
**bidirektionale Cross-Knoten-Suche** server-los noch NICHT end-to-end
(Meilenstein §4). (7) **PULS-Überlauf** 5882 > 3000 — Archiv-Auslagerung als
Wartung. (8) **PR #302** (BLP-E2E-Antwort, Draft 2026-06-19) offen — Klaus-
Entscheid. (9) **SB-KIMTool-Point-Brief** (Such-Tool + Breitziehen + Impressum) —
Klaus relayt (siehe Folge-Brief).

**Nächster sinnvoller Schritt:** B3 (Richter) ODER Breitziehen ODER Standalone-
PWA — siehe `docs/sessions/BRIEF_BAU_22_B3_UND_VERTEILUNG.md`.

### 2026-06-21 · Bau 22 Mehrfach-Suche: drei Bereiche (App/Knoten/Internet) + Richter-Schalter

**Rolle:** Bau-Sitzung Modul 22 (Folge). Klaus' Vision: **Mehrfach-Suche** — drei
getrennt ankreuzbare Such-Bereiche, dazu der KI-Richter als abschaltbarer Schalter.
Branch `claude/bau-22-mehrfachsuche`. **Sichttest Increment-1 + Sage-Korpus vorab
grün** (Klaus, Browser: Blase, Sprache, semantische Treffer Membran 0.88).

**Getan:**
- **Modul 22 erweitert** auf Mehrfach-Suche: drei Bereiche `app`/`knoten`/`internet`
  (Checkboxen, mehrere zugleich, Treffer zusammengeführt + Herkunfts-Badge), alle
  über **dieselbe Sortiermaschine** (Modul 03 Embedding + Modul 04 Matcher) — das
  BLP-Zwei-Stufen-Muster (Eingang → in-App-Matcher).
- **KI-Richter an/aus-Schalter, Default AUS** (gratis, rein semantisch „über die
  Bedeutung" = Cosinus; AN nur mit BYOK-Schlüssel → bidirektionales `hybridMatch`
  über die zusammengeführte Spitze, ein Aufruf, fail-soft zurück auf semantisch).
- **Internet-Bereich (Pilz-Egress):** ohne SearXNG-URL → „↗ neuer Tab" (DuckDuckGo,
  Widget lädt nichts); mit eigener SearXNG-URL → ~50 Roh-Treffer holen → einbetten
  (Modul 03) → semantisch sortieren → nur die besten inline (Klaus' 100-Treffer-
  Re-Ranker-Idee). Fetch/CORS scheitert → Fallback neuer Tab.
- **Knoten-Bereich:** `sbkim/sage-knoten-korpus.js` (6 verbundene Knoten, rein
  lokale Sporen-Daten → KEINE Netz-Anfrage). Lazy-Embedding via Modul 03.
- **Tafel-Versöhnung Empfangsmodus/Pilz** in CLAUDE.md § „Was du nicht tust"
  ausdrücklich festgehalten (Klaus 2026-06-21): Empfangsmodus beschränkt die
  Mycel-Schicht 1; ein Pilz-Werkzeug (Schicht 2) darf auf bewusste, getrennt
  gewählte Nutzer-Aktion ins Netz suchen. App+Knoten bleiben rein lokal.
- `sbkim-init.js` mountet das Widget jetzt mit `prepareCorpus` (App) +
  `prepareNodeCorpus` (Knoten); `index.html` lädt beide Korpus-Dateien.
- **Headless-Smoke 79/79** (Bereiche, Richter-Schalter, Internet neuer-Tab +
  SearXNG-Re-Ranker, Quellen-Badge, fail-soft). Karte 22 + INTERFACES gespiegelt,
  Panel 22 aktualisiert.

**Offen:** (1) **Klaus' Browser-Sichttest** der Mehrfach-UI (Checkboxen, Richter-
Schalter, Internet-neuer-Tab). (2) **Eigene SearXNG-Instanz** für den Internet-
Re-Ranker (Anleitung als Folge-Notiz möglich). (3) Sage cap/needs (BLP-Bitte).
(4) Increment 2 Widget-Kopplung über Modul 15.

**Nächster sinnvoller Schritt:** Klaus' Sichttest der drei Bereiche + Richter-
Schalter; danach SearXNG-Instanz-Anleitung oder Increment 2.



### 2026-06-21 · Bau 22 B-Schritt: Sage-Page-Korpus + Widget-Mount + Lazy-Embedding

**Rolle:** Bau-Sitzung Modul 22 (Folge zu Increment 1). Klaus' Wahl **B**: erst
einen echten Such-Korpus bauen, dann das Widget auf der Sage-Page mounten.
Branch `claude/bau-22-sage-korpus`.

**Getan:**
- **`sbkim/sage-suchkorpus.js`** — durchsuchbarer Korpus der Sage „Mycel-
  Bibliothek" = SBKIM-Werkzeuge (Module 00–22) als `{label,text,anchorId}`,
  Bedeutungs-Text mit Alltags-Synonymen (Recall-Lehre 3). 22 Einträge.
  Klaus' Festlegung 2026-06-21 (erster Korpus = Tool-Bibliothek; Glossar/Doku
  später). KEIN `passageVec` hier — lazy zur Laufzeit.
- **Modul 22 additiv erweitert** (`prepareCorpus`-Lazy-Provider): läuft EINMAL
  beim ersten `expand()` oder der ersten Suche, baut den Korpus (Embedding via
  Modul 03), ruft `setCorpus` + cacht; fail-soft (Hinweis, `corpusReady` bleibt
  false bei Fehler → Retry). `_meta.corpusReady` ergänzt. Generisch/reusable
  für alle Endknoten.
- **`sbkim-init.js`** — Widget am Ende der Init-Kette gemountet:
  `SbkimSearchWidget.init({euPolicy:"frei", queryLabel:"Sage", prepareCorpus:
  sageBuildSuchkorpus})`. `sageBuildSuchkorpus()` embeddet die Korpus-Texte via
  Modul 03 `embedPassageBatch` (löst den einmaligen ~30-MB-Modell-Download erst
  beim ersten Gebrauch aus — Seitenstart bleibt leicht). Kein Richter-Schlüssel
  → reiner Vorfilter (`nur-vorfilter`).
- **`index.html`** lädt `sbkim/sage-suchkorpus.js` (vor `sbkim-init.js`).
- **Headless-Smoke 64/64** (9 neue Proben: prepareCorpus lazy/einmalig/Cache/
  fail-soft). Karte 22 + INTERFACES gespiegelt.

**Nebenbei (Klaus' Auftrag): Briefkasten BookLedgerPro** — eigener PR #344
(gemerged). BLP SIGNAL seq 16–18 quittiert (ack=18): Drei-Schichten cap/needs
LIVE (BLP-Spore trägt nun signierte capVector+needsVector je 384-dim). Reziprok
✔ VALID, domainVector-Cosinus neu 0.813525 ≥ 0.80 → verified-match hält. Vertrag
`matchDimensions` akzeptiert; Sage-eigene cap/needs offen (Spore Re-Sign via
Modul 02, privater Schlüssel in Klaus' Browser → eigene Folge-Sitzung). Bis
dahin domainVector-Rückfall (Nur-Anbieter-Modus).

**Offen:** (1) **Klaus' Browser-Sichttest** Sage-Page: 🔍-Blase erscheint, erste
Suche zeigt „Suchindex wird vorbereitet …" (Modell-Download), dann findet z.B.
„wie schütze ich mich vor fremden Zugriffen" → Modul 15 Membran. (2) **Sage cap/
needs** in die Spore (Drei-Schichten, BLP-Bitte) — Spore Re-Sign am Tablet.
(3) Increment 2 Widget-Kopplung über Modul 15. (4) Korpus-Erweiterung um Glossar/
Doku (Klaus' Option B/C, später).

**Nächster sinnvoller Schritt:** Klaus' Sage-Page-Sichttest (Blase + erste Suche
mit Modell-Download). Danach Korpus-Erweiterung oder Increment 2.

### 2026-06-21 · Bau 22: Such-Widget (Increment 1 — Widget-Shell, Schritt 2 des Such-Werkzeugs)

**Rolle:** Bau-Sitzung Modul 22 (neu). Schritt 2 des SBKIM-Such-Werkzeugs nach
Modul 21 Spracheingabe. Branch `claude/bau-22-such-widget-ws7xfh`.

**Vision (Klaus 2026-06-21):** ein **separates**, frei bewegliches Floating-Such-
Tool (eigenes Modul, weitere Pläne) — klein im Ruhezustand, wächst nur bei
Interaktion, erzeugt ein eigenes Textfeld, leicht transparent, lässt sich über
andere Suchfelder/PWAs legen und koppelt sich dann mit der Wirts-PWA (Host lesen
+ aus dem Suchfeld interagieren). Komponiert Sprache (21) + interne Suche (04
queryLocal) + Richter (04 hybridMatch) + EU-Politik-Auswahl.

**Getan (Increment 1 — Widget-Shell):**
- **Komponenten-Karte** `docs/components/22_such_widget.md` gefüllt (Architektur,
  Zustände klein/groß, Transparenz, Drag/Self-Mount/X/Persistenz, EU-Politik,
  Kopplungs-Modell für Increment 2, Risiken, Strikte Tabus). INTERFACES § 1
  Modul 22 gespiegelt (Surface + options + SearchResult + localStorage-Schema +
  Tabus + Smoke-Stand).
- **`src/modules/22_such_widget.js`** (`window.SbkimSearchWidget`): self-mountende
  Pille in `<body>` (MutationObserver-Fallback), **Ruhezustand 🔍-Blase →
  Interaktions-Panel** via `data-state`, leicht transparent (`rgba(...,0.90/0.92)`
  + backdrop-blur), **Drag** (Pointer-Events, 5 px Threshold, Viewport-Clamping —
  Mechanik aus Modul 17 wiederverwendet, 17 unangetastet), **X-Schließen** +
  `show`/`hide`, `expand`/`collapse`, **eigenes Textfeld mit UX-Erhalt** (Feld nie
  mit `value:''` neu gebaut; erkannter Text an LIVE-Wert angehängt). **Komponierte
  Suche** `runSearch` (Spiegelung `sbkimHybridSearch`): Vorfilter `queryLocal` →
  opt-in Richter `hybridMatch` → fail-soft, sechs Modi. **EU-Politik** `frei`/
  `bindend` einheitlich für Sprach-Engine (Modul 21 `pickEngine`) UND Richter
  (`euOnly`); Klick-Chip wechselt. Sprach-Knopf (Modul 21 Browser-Engine →
  Textfeld, EU-Engine fail-soft Hinweis). localStorage-Persistenz (Position/
  Sichtbarkeit/Zustand). **KEIN Auto-Init** — `init()` mountet.
- **Headless-Smoke** `tests/smoke_bau22_such_widget.mjs` **55/55 grün** (Surface,
  Mount, Zustände, Persistenz, EU-Politik + euOnly, alle sechs Such-Modi,
  setCorpus, Sprache fail-soft + Browser-Pfad, Drag-Persistenz, UX-Erhalt,
  init-Throw bei ungültiger euPolicy).
- **`index.html`** lädt `22_such_widget.js` (vor `sbkim-init.js`, KEIN Auto-Init).
  **Panel 22** in `tests/manual_check.html` (init/expand/collapse/show/hide +
  Demo-Korpus-Suche + `_meta`). Inline-Script `node --check` grün.
- **CLAUDE.md** Modul-Tabelle Zeile 22 ergänzt (selbstständig gemerkt, Freibrief).

**Sicherheit gewahrt:** Render-/Kompositions-Schicht — keine eigene Identität/
Krypto/Signatur, kein IndexedDB, kein Crawler/Eigenanfrage ins Netz (einziger
Netz-Pfad: opt-in Richter, BYOK, vom Nutzer ausgelöst). Host-Inhalt (Increment 2)
ist `untrusted external data`. Modul 21/17/15/04 nur über Schnittstellen genutzt.

**Offen:** (1) **Browser-Sichttest durch Klaus** (Drag + Sprache am Galaxy-Tab-S6
— headless ersetzt ihn nicht). (2) **Increment 2** PWA-/Suchfeld-Kopplung über
Modul 15 Membran (Host lesen + aus dem Suchfeld interagieren) — eigene Folge-
Sitzung, sicherheits-sensibel. (3) Korpus-Quelle im Standalone-Betrieb: bis zur
Kopplung registriert der Andocker den Korpus (`init({corpus})`/`setCorpus`).

**Nächster sinnvoller Schritt:** Klaus' Browser-Sichttest Panel 22 + Sage-Page-
Blase; danach Increment 2 (Kopplung über Modul 15) als eigene Bau-Sitzung.

### 2026-06-20 · Bau 04.D: Hybrid-Match — Match-Zeit-LLM-Richter (`SbkimMatch.hybridMatch`)

**Rolle:** Bau-Sitzung Modul 04 (additiv, fail-soft). Setzt das Hybrid-Match-Konzept um —
hebt den Stufe-B-Keim `explainMatchLLM` vom *Erklärer* zum *Richter* über die Vorfilter-
Kandidaten hoch.

**Getan (Code, additiv — keine bestehende Funktion verändert):** `src/modules/04_match.js`
neue async-Funktion `hybridMatch(query, candidates, options?) → Promise<HybridJudgment>` +
zwei Public-Helfer `pickJudgeProvider` + `bidirectionalVerdict`. **Provider-Abstraktion**
`HYBRID_PROVIDERS` (Claude/Mistral/OpenAI/lokal): `claude` spricht Anthropic `/v1/messages`,
die übrigen die OpenAI-kompatible `/chat/completions`-Form. **EU-Default `"mistral"`** für
DSGVO-Knoten (`options.euOnly`), BYOK (kein Key im Code). **Opt-in/fail-soft:** leerer apiKey
ODER LLM-/Netz-/HTTP-/Schema-Fehler → `available:false` + `fallbackCandidates` ohne Throw
(Vorfilter gilt). **Bezeugung:** Erfolg liefert signierbares `attestation`-Objekt
(`kind:"sbkim-hybrid-match-judgment"` + judgedAt + provider-Marker + verdicts) — Modul 04
signiert NICHT selbst, Aufrufer signiert via Modul 02. **Bidirektional-Default streng „both"**
(Klaus 2026-06-20). Selbstcheck-Zeile auf sechs Funktionen. Zwei neue Fehler-Factories
`InvalidCandidatesError` + `InvalidProviderError`.

**Tests:** Headless-Smoke `tests/smoke_bau04d_hybrid_match.mjs` **62/62 grün** (Mock-LLM via
fetch-Stub, Anthropic- + OpenAI-Form: Richter-Happy-Path, Fail-soft, Opt-in-aus, Anbieter-
Abstraktion, EU-Default, Bidir-Kombinator, Sync-Throws, AbortError). Regression 04.A 19/19 +
04.B 30/30 + 04.C 43/43 + 15.B 31/31 + 17 36/36 grün. `node --check` grün, 16 Inline-Script-
Blöcke validiert. **Panel 04** Knöpfe 16–19 (Mock-LLM via temporärem `window.fetch`-Override).

**Doku:** INTERFACES.md § 1 Modul 04 (Bietet/Fehlerverhalten/Garantien/Selbstcheck/Geprüft) +
§ 7.1 Hybrid-Match-Richter-Ergänzung; Karte 04 § Hybrid-Match-Schicht + Manueller Test 16–19 +
Bauzustand; HYBRID-MATCH-KONZEPT.md Status + Bau-Parameter-Entscheidungen.

**TABU eingehalten:** KEINE Schwellen-Änderung, KEIN Whitening-Flip von matchDimensions/
queryLocal (separater Anisotropie-Hebel, koordinierte Klaus-Entscheidung); KEIN PROTOCOL_-/
DB_VERSION-Bump; KEIN Modul-Eingriff außer 04. `status.json` unverändert (Modul 04 war + bleibt
`fertig`; additiv).

**Folge (gleiche Sitzung):** kopierbare Einbau-Anleitung `docs/HYBRID-MATCH-EINBAU.md`
angelegt (Helfer `sbkimHybridSearch` = Vorfilter + Richter + Fail-soft; BLP-Pilot, Klaus'
Wahl 2026-06-20). **Befund dabei:** Modul 02 hat heute KEINE öffentliche „signiere-
beliebiges-Objekt"-Funktion (Signieren lebt nur intern in `generateOwnSpore`) — die
Bezeugung (`attestation` signiert in die Inbox) braucht eine kleine Folge-Sitzung Modul 02
(`SbkimSpore.signPayload(obj)` o.ä.). Bis dahin `attestation` roh ablegen; der Richter
läuft auch ohne Signatur voll.

**Sichttest GRÜN (Klaus, Browser, 2026-06-20):** Panel 04 Knöpfe 16–19 alle vier grün
am Galaxy Tab S6 bestätigt — 16 Richter Happy-Path (Wein passt / Auspuff passt-nicht +
attestation), 17 Fail-soft (kein Throw, 3 Fallback), 18 Opt-in-aus (kein Netz-Aufruf),
19 Bidir streng true&false=false + EU-Default mistral / US-Default claude. Der Richter ist
damit browser-bewiesen, nicht nur headless.

**Observatorium-Werkstatt angelegt (2026-06-21, Klaus' Wahl + Benennung):** neue Geschwister-Doku
`docs/OBSERVATORIUM_WERKSTATT.md` für Nicht-Browser-Bau-Lehren + offene Bau-Problematiken
(parallel zum Browser-Observatorium, Schicht-4-Werkstattraum). Saat: Lehre 1 „Interop ist
Vertrag, nicht Kopie" (BLP), Lehre 2 „Reasoning-LLM ≠ Bild-API" (Vision an OCR-Vorstufe),
offene Bau-Problematik 1 „Modul 02 hat keinen öffentlichen Signier-Helfer". Reziproker
Cross-Link im Browser-Observatorium-Kopf.

**BLP-Pilot ERLEDIGT + quittiert (2026-06-21):** BookLedgerPro hat den Hybrid-Match-Richter
gebaut (deren SIGNAL seq 14, **Option 1 BLP-native nach Sage-Spec** — Vorfilter über eigenes
`embed.js`, Richter über eigenes `mistral.js`, kein neuer CDN). Erster Mistral-Lauf
`available:true` mit sinnvollen Urteilen, **Fail-soft im Browser bestätigt**, vier QA-Fixes
(IDs nie erfinden / Top-k statt Schwelle / Synonyme / Domänen-Regel `passt=false`). Reine
Status-Meldung, nichts Offenes. Sage quittiert `ack[BookLedgerPro]=14`, SIGNAL seq 27→28.
Lehre 1 (Interop ist Vertrag) → **VALIDIERT**; vier Prompt-Härtungs-Lehren gesichert
(Werkstatt Lehre 3 + Einbau-Anleitung § Richter-Prompt-Härtung). Erster Knoten mit
laufendem Mistral-Richter im Mycel.

**Bau 21 Spracheingabe (2026-06-21, Klaus-Wahl „Modul 21 zuerst" + EU-Politik „frei"):**
`src/modules/21_spracheingabe.js` neu — input-agnostische Sprach-Eingabe-Schicht (BLP-Muster
SIGNAL seq 15 nachgebaut, Sage-native nach Vertrag). Dual-Engine Browser Web-Speech + EU Cloud
Speech-to-Text (BYOK), mehrsprachig DE/EN/RU (`SPEECH_LANGS` + `alternativeLanguageCodes`),
konsequent fail-soft. **EU-Politik per Knoten:** `bindend` (nur EU, z.B. BLP) ↔ `frei` (Default,
EU wählbar — Sage/Mixarium/Rezeptbuch). Surface `SbkimSpeech` (init/getLanguages/availableEngines/
pickEngine/makeBrowserRecognizer/startRecording/recognizeEU/speechErrorHint). Headless-Smoke
`tests/smoke_bau21_spracheingabe.mjs` **45/45 grün**; `index.html` lädt das Skript (KEIN Auto-Init),
Panel 21 in `manual_check.html`; Karte `docs/components/21_spracheingabe.md`. **Sichttest 21
LOGIK GRÜN (Klaus, Browser, 2026-06-21):** Panel 21 drei Logik-Knöpfe bestätigt — Sprachen
DE/EN/RU + alternativeCodes, EU-Politik frei=[browser,eu]/bindend=[eu], pickEngine (frei→eu /
bindend→eu / default→browser), `browserSupport:true` (Galaxy Tab Chrome kann Web-Speech).
Live-Mic + EU-Engine optional/ungetestet. Nächste Schritte des Such-Werkzeugs: Such-Ansicht
(komponiert 03/04/21 + Knoten-Suche + EU-Politik-Auswahl), dann Einbau in PWAs + Landing-Pages.

**Offen / nächster Schritt:** **Schritt 2 = SBKIM-Such-Widget (Floating-Tool), eigene Bau-Sitzung**
— Klaus' Vision 2026-06-21: Schritt 2 wird NICHT eine statische Ansicht, sondern ein **separates,
frei bewegliches Floating-Widget** (Klaus hat weitere Pläne damit). Klein im Ruhezustand, wächst nur
bei Interaktion, erzeugt eigenes Textfeld, leicht transparent, lässt sich **über fremde Suchfelder /
PWAs legen** und koppelt sich dann mit der Host-PWA (liest Inhalt + interagiert aus dem Suchfeld) —
Modul-15-Membran-Territorium. Komponiert Spracheingabe (21) + interne Suche (03/04 queryLocal) +
externe KI (04 hybridMatch) + Knoten-Suche, EU-Politik „frei". Drag-Mechanik aus Modul 17
wiederverwenden. **Brief: `docs/sessions/BRIEF_BAU_SUCH_WIDGET.md`** (Modul 22, spec-first dann bauen).
Weiter offen:
Modul-02-Signier-Helfer (Werkstatt offene Bau-Problematik 1,
schaltet Bezeugung frei); Drei-Schichten-Differenzierung im Live-Richter (Werkstatt Bau-Problematik 2);
optional OCR-Vorstufe-Spec (BLP-getrieben: Vision → Embedding →
Richter); Anisotropie-Hebel (Whitening +
Schwellen-Neukalibrierung, netzweit, eigene koordinierte Entscheidung); Bau-Zeit-
Authoring-Helfer (Konzept § Bau-Parameter 6).

### 2026-06-20 · Brainstorming + Konzept: Hybrid-Match (KI-Richter + lokaler Fallback)

**Rolle:** Hauptsitzung (Brainstorming → Konzept-Spec, kein Code). Anschluss an den
Anisotropie-Befund: Klaus' Lösung — SBKIM war als *KI-Matching* gedacht; der echte Sinn-
Richter ist eine **LLM**, nicht das kleine e5-Modell.

**Konsens (Hybrid, Option C):** dreigeteilte Rollen — (1) **Bau-Zeit-Authoring** mit der
besten KI des Entwicklers (DSGVO-unkritisch, Entwickler-Akt), (2) **geteilte Vergleichs-
Koordinate** immer vom EINEN netzweiten Embedding-Modell (lokal e5, sonst nicht vergleichbar),
(3) **Match-Zeit-LLM-Richter** opt-in/BYOK, Knoten-eigener EU-Anbieter (Mistral etc.).
**Fail-soft (Klaus' Anker):** LLM nicht erreichbar → lokales Modell entscheidet weiter.
**Bidirektional:** jede Seite urteilt mit ihrer eigenen KI. **Keim existiert:** Modul 04
Sub-B `explainMatchLLM` vom Erklärer zum Richter hochstufen.

**Getan:** `docs/HYBRID-MATCH-KONZEPT.md` (Konzept-Spec mit Rollen-Tafel + Ablauf + offenen
Bau-Parametern), `docs/sessions/BRIEF_BAU_HYBRID_MATCH.md` (Bau-Brief, copy-paste).

**Offen / nächster Schritt:** Bau-Sitzung `claude/bau-04d-hybrid-match` (additiv, fail-soft,
Anbieter-Abstraktion + Mock-Smoke). Separater netzweiter Hebel bleibt: Whitening +
Schwellen-Neukalibrierung von Modul 04 (eigene Entscheidung).

### 2026-06-20 · Architektur-Befund: e5-Anisotropie — Match-Schwelle misst den Boden (Klaus)

**Rolle:** Hauptsitzung (Analyse + Doku). Klaus' Skepsis: warum erzielt eine Buchhaltungs-App
(BookLedgerPro) 0.81 zur Mycel-Bibliothek (Sage), obwohl inhaltlich nichts gemein? Befund:
**berechtigt.**

**Beleg (`tools/match_baseline.mjs`, echte Knoten-Vektoren):** roher e5-Cosinus hat einen
hohen **Boden** — unverwandte Domänen mean **0.8215** (sd 0.0223). Schwelle 0.80 liegt
**unter** dem Boden. Nach Mittelwert-Abzug (Whitening-light) bleiben nur die Tresor-Schwestern
(1.0) und Rezeptbuch↔Mixarium (0.70) positiv; **alle Sage↔Endknoten gehen negativ** (BookLedger
−0.16, Rezeptbuch −0.25). Ursache: **Anisotropie** von `multilingual-e5-small` (+ gleiche
Sprache/Stil/`passage:`-Präfix). Der hohe Roh-Wert misst das Modell, nicht die Themen-Nähe.

**Getan (nichts stillschweigend umgestempelt — Verfahren ist netzweit, Klaus entscheidet):**
- `tools/match_baseline.mjs` — headless Boden-Analyse (roh + zentriert + Stats), reproduzierbar.
- `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` — Lehre + Fix-Konzept (Whitening-Referenz-Impl
  + Schwellen-Kalibrierung + Browser-Instrument für Zufallstext-Boden) für nachfolgende Bauten.
- `sbkim/NETZ-STAND.md` „Offene Hebel": Befund + Drei-Stufen-Plan eingetragen.
- Sage-Page Sonnen-Galaxie: neue Geschichts-Station „Der hohe Boden" (Entstehungsgeschichte).

**Offen / nächster Schritt (Klaus' Entscheidung, netzweit):** (1) Schwelle mit Zufallstext-
Boden neu kalibrieren, (2) Modul 04 auf whitened Cosinus (Mean-Vektor als netzweite Konstante),
(3) alle Matches einmal sauber neu rechnen. Bis dahin: Sage↔X-Matches als „boden-nah/schwach"
markiert, nicht umgestempelt.

### 2026-06-20 · BookLedgerPro → verified-match (Cosinus 0.810579)

**Rolle:** Hauptsitzung (Briefkasten). BLP hat auf Sages e5-small-Antwort reagiert: echten
`domainVector` eingebettet (App-Andock, Modell einmalig geladen), Spore neu signiert,
SIGNAL seq 11, Bitte um Cosinus-Rechnung.

**Getan:**
- Frische BLP-Spore aus `raw/main` reziprok verifiziert (`tools/verify_remote_spore.mjs`,
  echter Modul-02-Pfad) → ✔ VALID (9/9, id==SHA256(pub), Ed25519, Manipulation fällt durch).
- `domainVector` jetzt echt (384-dim, L2=1.000000). **Cosinus Sage ⟷ BookLedgerPro =
  0.810579 ≥ 0.80 → `verified-match`** (Modul 04). Ehrlich: knapp über Schwelle
  (Buchhaltung domänenfern), nachrechenbar.
- Netzweit nachgezogen: `status.json` (pingStatus→verified-match, matchScore 0.810579,
  demoVector entfernt), `sbkim/bookledgerpro_inbox.json` (frische Spore) + `.verify.md` neu,
  `NETZ-STAND.md` (Knoten-Zeile + Offener-Hebel), `SIGNAL.json` seq 26→27 +
  `ack[BookLedgerPro]=11`, Postfach-Antwort-Brief.
- **Sechs Nachbarn jetzt `verified-match`** (Rezeptbuch, Mixarium, SB·KIMTool·Point,
  Jasons-Tresor, Mein-Tresor, BookLedgerPro).

**Offen / nächster Schritt:** nichts Blockierendes. Optional: BLP-Quittung abwarten
(`ack[Sage]`), Verschlüsselungs-Achse BookLedgerPro ⟷ Tresore als eigene Cosinus-Messung.

### 2026-06-20 · Live-Module 16/17/18/19 fertig + erste Seite vervollständigt + Modul 19 gebaut (Klaus)

**Rolle:** Hauptsitzung. Klaus-Befund: in der Truhe (und auf der ersten Seite) waren
16/17/18/19 nicht als fertig sichtbar, obwohl sie in BLP / Mein-Rezeptbuch / Mein-Mixarium
deployt sind. Auftrag: prüfen, dann „nach Regeln oder aktualisieren"; außerdem „baue alle
Extraktionen, sobald ein Werkzeug nachweislich funktioniert".

**Geprüft (echte Deployments):** BLP-Komplett-Knoten (`mycelknoten.html`) bündelt live
`SbkimSiegel` (16) + `SbkimWidget` (17) — beide laufen. Modul 18 (Tool-PWA-Andock-Container
Sub a) ist gebaut + im Einsatz. Andock-Funktion (19) läuft via andock.html + Sage-Page-Wizard.

**Getan:**
- `status.json`: **16/17/18 stub → fertig, 19 schablone → fertig** (mit ehrlichen Notizen:
  18 = Andock-Container Sub (a) fertig, Sub (b)–(i) späterer Ausbau). Pie neu via
  `update_puls_pie.py` → **Fertig 9 / Code-Stub 6 / Schablone 6** (vorher 5/9/7). `lastUpdated`
  2026-06-20.
- **Erste Seite (`renderModuleList`)** rendert jetzt auch `siegelBacklog` (16),
  `toolPwaBacklog` (18) und `mycelHubBacklog` (nur Modul 19, Konzept-Repos gefiltert) —
  vorher fehlten 16/18/19 dort ganz. Module werden mit **Namen** (nicht nur Nummer) gezeigt;
  bei Wort-IDs entfällt die Nummern-Box.
- **Modul 19 gebaut** (Phase-B-Vorzug, Klaus-Auftrag): `src/modules/19_andock_wizard.js`
  aus der Sage-Page extrahiert — reine Eingabe→Text-Hilfe (Spore-Vorlage + status.json-Zeile
  + PR-Link), kein Signieren/Storage/Netz, `mount()` Browser-only. Smoke
  `tests/smoke_bau19_andock_wizard.mjs` **15/15 grün**. Truhe-Kachel 19 zeigt jetzt auf den
  Code (kopier-/herunterladbar, nicht mehr Schablone).
- **Topologie-Grafik (Nachzug, Klaus-Befund):** `renderTopology` ließ Module ohne
  `TOPO_LAYOUT`-Eintrag still weg — 16/17/18/19 (auch 17!) fehlten in der Grafik. Fix:
  alle Modul-Gruppen einbezogen + **Auto-Platzierung** für Module ohne festes Layout
  (Zusatz-Zeile „weitere Module" unten, viewBox wächst mit, zukunftssicher). Modul-Liste
  war bereits komplett + benannt (gegen status.json verifiziert: 19 Zeilen, alle benannt,
  16/17/18/19 = fertig) — der sichtbare Rest ist Pages-/Browser-Cache (Hard-Reload).

**Offen / nächster Schritt:** Klaus' Browser-Sichttest (Truhe + erste Seite nach Hard-Reload;
Modul-19-`mount()`-UI). Optional: Panel 19 in `manual_check.html`, Sage-Page-Wizard auf das
Modul 19 umstellen (statt inline `generateSpore`).

### 2026-06-20 · Vorteilspack-Truhe: Komplett-Werkzeuge + Download + „Werkzeuge"-Filter (Klaus)

**Rolle:** Hauptsitzung (Pflege Observatoriums-Vorteilspack). Klaus' Befund: in der
Werkzeugkiste sind nicht alle Werkzeuge „nutzbar"/aktuell — „Andock" ließ sich nicht
kopieren (Kachel 19 ist Schablone, `code:null`), und es fehlte die Kategorie **fertiger
Ein-Datei-Werkzeuge**. Ziel: alle Werkzeuge sollen 1:1 kopier- UND herunterladbar sein.

**Befund (warum „nicht live"):** Der Service-Worker `sbkim-sw.js` cached bewusst nichts
(nur die `/sbkim/*`-Brücke) — „veraltet"-Eindruck kommt vom Browser-HTTP-Cache
(Hard-Reload, Lehre 4). Die Truhe holt Modul-Code bereits live per `fetch()` → was im Repo
liegt, ist immer der kopierte Stand.

**Getan:**
- Zwei fertige **Ein-Datei-PWAs** ins Repo: `docs/observatorium/tools/andock.html`
  (Andock-Werkzeug) + `mycelknoten.html` (Komplett-Knoten mit Live-Lampen). **BLP-Branding
  entfernt → generisch** (`MeinKnoten`-Platzhalter), **Siegel-Band leer** (netzweite Regel
  2026-06-20). `docs/observatorium/tools/README.md` als Karte/Doku.
- `vorteilspack.js`: neuer Tier **`komplett`** (sortiert zuerst), beide Werkzeuge als
  `kind:"html"`-Tiles (live-`fetch` für Kopieren + Download). Neuer **Download-Knopf**
  („Datei herunterladen") im Modal für ALLE Tools mit Code. `buildEinbau`/`buildVibe`
  haben jetzt einen html-Zweig (Ein-Datei-PWA-Wortlaut statt Andocker-Skript).
- `index.html`: neue Filter-Pillen **„Werkzeuge (alle)"** (Default) + **„Komplett-Werkzeug"**
  neben Must-have/Basic/Pro; Filter-Logik auf „alle"-Default umgestellt; CSS-Farben +
  Tier-Farbe `komplett`.
- Smoke `tests/smoke_observatorium_truhe.mjs` auf **22/22 grün** nachgezogen — dabei fiel
  auf, dass der NETZ-Eintrag schon vorher **nicht** im Test berücksichtigt war (Test stand
  auf 19, Array hatte 20); jetzt korrekt 20 Modul-Tools + 2 Komplett-Werkzeuge.

**Offen / nächster Schritt:** Klaus' Browser-Sichttest am Galaxy Tab S6 (Truhe öffnen →
Filter „Werkzeuge (alle)"/„Komplett-Werkzeug" → Komplett-Werkzeug-Kachel → Kopieren +
Herunterladen). Relay-Brief an SB·KIMTool·Point (externer Mycel-Hub), damit dessen
Werkzeugliste dieselben zwei Komplett-Werkzeuge führt (Chat-Brief unten ausgegeben).

**Nachtrag (Klaus-Befund 2026-06-20, Sichttest):** In der Truhe zeigten nur 04 + NETZ
„Fertig", obwohl der Bau-Puls (status.json) **5 fertige Module** führt (03/04/05/09/15).
Ursache: die `status`-Werte in `vorteilspack.js` waren fest verdrahtet + abgedriftet.
Fix: (1) die vier stale Werte (03/05/15 stub→fertig, 09 schablone→fertig) korrigiert,
(2) **`applyLiveStatus()` ergänzt** — die Truhe holt den Status jetzt live aus `status.json`
(dieselbe Quelle wie die erste Seite, alle Modul-Gruppen) und patcht Badges + Modal-Daten;
fail-soft, fest verdrahteter Wert bleibt Fallback. Damit kann der Truhe-Status nicht mehr
von der ersten Seite abweichen. Smoke 22/22 grün.

### 2026-06-20 · Modul 20 umbenannt „Tresor" → „Safe" + kein Startup-Prompt (Klaus)

**Rolle:** Hauptsitzung (Pflege/Umbenennung). Klaus-Klarstellung: der App-interne
SBKIM-Identitäts-Speicher soll **„Safe"** heißen (NICHT „Tresor"), um Verwechslung mit
dem bestehenden JSON-Backup-„Tresor" (Mein-Rezeptbuch/Mein-Mixarium) und BLPs eigenem
„Tresor"/Geheim-Fach zu vermeiden — die bleiben „Tresor". Außerdem: **keine Abfrage beim
Seitenstart**, der Safe wird auf Abruf aus den Einstellungen geöffnet.

**Getan (Modul frisch, keine Live-Daten → sauberer Zeitpunkt):**
- Dateien umbenannt: `20_schluessel_tresor.{js,md}` → `…_safe.*`,
  `smoke_bau20_tresor.mjs` → `…_safe.mjs`. Global `SbkimVault` → **`SbkimSafe`**,
  Store `sbkim_vault` → `sbkim_safe`. Alle deutschen „Tresor"→„Safe" für unser Modul
  (Mein-Tresor/Jasons-Tresor/„Tresor-im-Tresor"/BLP bewusst geschützt).
- Verhalten: `autoPrompt` Default **false**; neues **`open()`** öffnet das Safe-Modal
  auf Abruf (Host hängt einen „Safe"-Knopf in seine Einstellungen). `init` löst KEIN
  Startup-Modal mehr aus.
- INTERFACES §1 Modul 20 + Karte 20 (§3 „auf Abruf" + Namens-Klarstellung + §6 Schnittstelle)
  + CLAUDE.md Zeile 20 + `index.html`/`manual_check.html` nachgezogen.
- Smoke `tests/smoke_bau20_safe.mjs` **19/19 grün**; Modul-16-Regression 16/16 grün.

**Offen / nächster Schritt:** Klaus' Browser-Sichttest (Panel 20). Sage-Page-Einbau eines
„Safe"-Knopfs in die Einstellungen (auf Abruf) — eigene Folge-Sitzung. Relay-Briefe
(netzweite Verteilung, BLP zuerst) verwenden „Safe" für unser Modul, „Tresor" für deren
eigene. Offen aus Schritt 2: Mixarium-Band, BLP-Wächter-Quittungen.

### 2026-06-20 · Bau-Sitzung Modul 20 Schlüssel-Tresor (Code-Stub, Shamir 2/3)

**Rolle:** Hauptsitzung (Bau). Klaus-OK: „315 mergen + bauen", Shamir **2 von 3**,
Key-Extractability über Passwort, BLP-nodeId `MyHVM7Pd…` kanonisch.

**Getan:** `src/modules/20_schluessel_tresor.js` voll angelegt. Krypto-Kern
wiederverwendet Modul 02 `exportBackup`/`importBackup` (PBKDF2+AES-GCM) — der Tresor
speichert nur den Blob (Store `sbkim_vault`, Modul 01 `ensureStore`). **Shamir's Secret
Sharing über GF(256)** (eigene Implementierung), `recoverPassword` (2 von 3). Auto-Abfrage-
Modal (zweistufiges Passwort + „Anteile gesichert"-Bestätigung vor Schließen). Schnittstelle
`SbkimVault`. Headless-Smoke `tests/smoke_bau20_tresor.mjs` **19/19 grün** (Shamir jede
2er-Teilmenge rekonstruiert, 1 Anteil nicht; Tresor create/unlock/recover mit gemocktem
Modul 02 + In-Memory-Storage). INTERFACES §1 Modul 20 + Karte 20 (Code-Stub) + CLAUDE.md
Zeile 20 nachgezogen. `index.html` lädt das Skript (KEIN Auto-Init), Panel 20 in
`manual_check.html` (7 Sichttest-Knöpfe).

**Offen / nächster Schritt:** **Klaus' Browser-Sichttest** (Panel 20: Shamir-Selbsttest +
Tresor anlegen/entsperren/recover; Modal-UI). Danach Entscheidung **Sage-Page-Auto-Prompt-
Wiring** (`SbkimVault.init({autoPrompt:true})` in `sbkim-init.js` — bewusst noch NICHT
aktiv, weil es bei jedem Seitenstart ein Passwort verlangt). Dann netzweite Verteilung
(Relay-Briefe, BLP zuerst). `status.json`-Score bleibt vorerst (Konvention: erst nach
Klaus' Sichttest). Offen aus Schritt 2: Mixarium-Band, BLP-Wächter-Quittungen.

### 2026-06-20 · Spec-Karte Modul 20 Schlüssel-Tresor (Identitäts-Tresor + Shamir)

**Rolle:** Hauptsitzung (Spec). Auslöser: Klaus' Auftrag — jeder Knoten soll seine
SBKIM-Identität (nodeId + privater Schlüssel + Spore) in einem lokal verschlüsselten
Tresor IM Repo sichern (Auto-Abfrage, zweistufiges Passwort), Recovery via Shamir über
das Passwort. Vorbilder: Mein-Tresor, BLP „Geheim-Fach" (Screenshots 2026-06-20).
Richtungsentscheid (AskUserQuestion): **Spec zuerst**, **Shamir über das Passwort**.

**Getan:** Spec-/Konzept-Karte `docs/components/20_schluessel_tresor.md` geschrieben
(Zweck/Problem Identitäts-Wandern; Krypto-Kern = Modul 02 PBKDF2+AES-GCM; Auto-Prompt
zweistufig; Shamir k-von-N über das Passwort mit aktiver Einforderung; Datenschutz-Klausel;
vorgeschlagene Schnittstelle `SbkimVault`; Verhältnis zu Modul 01/02/16/09; offene Bau-
Punkte; Pipeline). CLAUDE.md Modultabelle Zeile 20 ergänzt. **Befund:** BLP-App zeigt
nodeId `ZrBxTuAr…` vs. bei Sage registriert `MyHVM7Pd…` → Identitäts-Wandern, genau das
Problem, das der Tresor löst (in BLP-Sonderbrief zur Klärung aufgenommen).

**Offen / nächster Schritt:** **Klaus prüft die Spec-Karte** → dann Bau-Sitzung Modul 20
(`claude/bau-20-schluessel-tresor`). Relay: BLP-Sonderbrief + Mycel-/Datenschutz-Klärung
(im Chat ausgegeben). Schritt 2 weiter offen: Mixarium-Band, BLP-Wächter-Quittungen.

### 2026-06-20 · Siegel-Band: offen lassen statt Auto-Label (Klaus-Entscheidung)

**Rolle:** Hauptsitzung (Bau Modul 16). Mein-Rezeptbuch hatte upstream eine
**Auto-Ableitung** des Band-Texts aus dem Repo-Namen erbeten; ich hatte sie zunächst
gebaut. **Klaus-Entscheidung 2026-06-20:** lieber **offen lassen statt vorausfüllen**
(„Vermerk müsste reichen") — ein geratener Repo-Slug (`SAGE-PROTOKOL`) wirkt auf einer
Auszeichnung falsch; das Ribbon ist das SELF-INSCRIBING-Element.

**Getan:** Auto-Ableitung wieder entfernt. Ohne `init({ribbonText})` bleibt das Band
**offen (leer)** + einmaliger `console.info`-Vermerk („Band offen gelassen — ribbonText
setzen"). Expliziter Wert übersteuert (XML-escaped, Render-Zeit). Sage setzt explizit
`"SAGE OBSERVATORIUM"` in `sbkim-init.js`. So entsteht nie ein mitkopiertes Fremd-Label,
ohne zu raten. `_meta.ribbonText` = effektiver Wert (`""` wenn offen). INTERFACES §1 M16 +
Karte 16 § Sub (b) nachgezogen. Smokes: offen-Default 5/5, ribbon 9/9, andock 9/9,
Sub-(e) 16/16 grün; `node --check` grün.

### 2026-06-20 · Quittung: Mein-Rezeptbuch Siegel-Band korrigiert (Schritt 2)

**Rolle:** Hauptsitzung (Quittungs-Verarbeitung). Mein-Rezeptbuch hat (von Klaus relayt)
den Siegel-Band-Fix umgesetzt: `assets/sbkim-siegel-wappen.svg` Band `MEIN-TRESOR` →
`MEIN-REZEPTBUCH` (PR #262 → main `f0278ab`). **Live auf raw/main verifiziert** (Band =
`MEIN-REZEPTBUCH`). In NETZ-STAND „Offene Hebel" vermerkt. **Mein-Mixarium offen** (Brief
relayt). BookLedgerPro-Wächter-Nachrüstung offen. Dauerlösung via Modul-16 `ribbonText`
optional pro Endknoten.

### 2026-06-20 · Fix: Andock-Wizard war hinter dem Siegel-Modal verdeckt (z-index)

**Rolle:** Hauptsitzung (Bugfix). Branch `claude/bookledgerpro-sage-onboard-1cdzif`.
Befund Klaus (Browser-Sichttest): „🔌 Fremden Knoten andocken"-Knopf ist da, Klick öffnet
sichtbar nichts. **Ursache:** Modul-18-Wizard `z-index:10000`, Siegel-Modal `z-index:99998`
→ der Wizard mountete hinter dem Siegel-Modal. **Fix:** `onAndockClick` schließt das
Siegel-Modal (`closeModal()`) beim Öffnen des Wizards → Wizard wird sichtbar. Smokes grün
(Andock 9/9, Sub-(e) 16/16, Ribbon 9/9), `node --check` grün. **Sichttest erneut durch Klaus.**

### 2026-06-20 · Sage-Page-Verdrahtung: Andock-Knopf live (andockTool:true)

**Rolle:** Hauptsitzung (Verdrahtung). Branch
`claude/bookledgerpro-sage-onboard-1cdzif`. Schritt 1 der „der Reihe nach"-Liste.

**Getan:** `sbkim-init.js` — `SbkimSiegel.init({…})` um `andockTool: true` erweitert.
Modul 18 (`SbkimToolPwa`) war bereits eingebunden (`index.html` Z. 4367) und mit Sages
endpoint/domain/keywords initialisiert. Der Andock-Knopf „🔌 Fremden Knoten andocken"
erscheint damit live im Siegel-Modal der Sage-Page; Klick öffnet den KI-unabhängigen
Modul-18-Wizard. Ordering unkritisch (Knopf prüft Modul 18 lazy beim Klick).
`node --check` grün.

**Offen / nächster Schritt:** **Sichttest durch Klaus** (Sage-Page Siegel-Badge klicken
→ Modal → „🔌"-Knopf sichtbar → Repo-URL eingeben → Handshake durchspielen). Nicht
headless — wartet auf Galaxy-Tab-S6-Browser. Danach Schritt 2 (Briefe relayen) / Schritt 3
(downloadbarer Siegel-Block).

### 2026-06-20 · Bau Modul 16: optionaler Andock-Knopf (KI-unabhängig) + Freibrief-Erneuerung

**Rolle:** Hauptsitzung (Bau Modul 16). Branch
`claude/bookledgerpro-sage-onboard-1cdzif`. Auslöser: Klaus' Wunsch — separates
Andocken als **zusätzliche** Option im Siegel, **KI-unabhängiger Handshake**.
Richtungsentscheid (AskUserQuestion): Modul 18 wiederverwenden; erst #308 mergen,
dann bauen (beides erfüllt).

**Getan (additiv, opt-in):** Modul 16 `init({andockTool:true})` → optionaler
Knopf „🔌 Fremden Knoten andocken →" im Modal, öffnet den Modul-18-Wizard
`SbkimToolPwa.openAndockTab()` (URL → Spore → verify → match → Handshake via
Modul 05). Reiner Browser-Pfad, keine KI nötig. Fail-soft wenn Modul 18 fehlt
(Hinweis statt Throw). Default `false` → DOM-Element nur bei opt-in; der „🔑"-
Identitäts-Pfad bleibt unberührt (zwei Richtungen: 🔑 = Selbst/erzeugen,
Andock = Gegenstelle/verbinden). `_meta.andockToolEnabled`-Getter. INTERFACES §1
Modul 16 (options-Form + _meta) + Karte 16 § Sub (b) nachgezogen. Smoke
`tests/smoke_bau16_andock.mjs` 9/9 grün; Regression Ribbon 9/9 + Sub-(e) 16/16
grün; `node --check` grün.

**Identitäts-Entscheid (Klaus 2026-06-20):** stabile Einzel-Identität pro App
bleibt Leitbild (eine App = eine nodeId). Multi-Identität (Modul 02, gebaut)
bleibt Reserve für die spätere Agenten-Schicht — **nicht** im Siegel sichtbar.

**Freibrief erneuert (Klaus 2026-06-20):** automatisches Merken erlaubt, wenn
sinnvoll + nützlich für die App, ohne Nachfrage; an jede Folge-Sitzung
weiterzugeben. In `CLAUDE.md § Freibrief` als Bekräftigung verankert.

**Offen / nächster Schritt:** (1) Sichttest durch Klaus (Sage-Page Siegel-Modal
mit `andockTool:true` — wartet auf Browser-Lauf; headless grün). (2) Sage-Page +
Endknoten: Modul 18 laden + `andockTool:true` setzen, damit der Knopf real
sichtbar wird (eigene Folge-/Migrations-Sitzungen). (3) Fix-/Nachrüst-Briefe
(Siegel-Band, BLP-Wächter) relayen. (4) Vision: downloadbarer Komplett-Siegel-
Block aus Sage (ein Copy-Paste, richtig konfiguriert).

### 2026-06-19 · Design-Fix Modul 16: konfigurierbarer Siegel-Band-Text + Siegel-Befund

**Rolle:** Hauptsitzung (Bau Modul 16, Design-Fix). Branch
`claude/bookledgerpro-sage-onboard-1cdzif`. Auslöser: Klaus' Befund — Siegel
in Mein-Rezeptbuch + Mein-Mixarium zeigt „MEIN-TRESOR".

**Befund (netzweit, belegt):** Das Siegel passt sich NICHT automatisch an. Der
Band-Text (unteres SVG-`textPath`) ist statisch. Ausgelesene Bänder:
Mein-Rezeptbuch `MEIN-TRESOR` ❌, Mein-Mixarium `MEIN-TRESOR` ❌, Mein-Tresor
`MEIN-TRESOR` ✔, Jasons-Tresor `JASONS-TRESOR` ✔, Sage `SAGE OBSERVATORIUM` ✔.
Ursache: Rezeptbuch/Mixarium rendern das Siegel als statisches
`<img src="assets/sbkim-siegel-wappen.svg">` und haben die SVG-Datei von
Mein-Tresor kopiert, das Band nie angepasst. (Mein-Tresors `sbkim/16_siegel.js`
ist leer/14 B — Mein-Tresor hat Siegel + Andocken bespoke inline gebaut.)

**Briefkasten-Aktivierungs-Audit (alle Knoten):** Wächter (`sbkim-watch.yml`)
vorhanden bei MR/MM/Mein-Tresor/Jasons/Point, **fehlt bei BookLedgerPro**.
📬-Leser (liest beim Browser-Öffnen) vorhanden bei MR/MM/Mein-Tresor/Jasons,
**fehlt bei Point (Hub) + BookLedgerPro**.

**Getan (Design-Fix, additiv):** Modul 16 `init({ribbonText})` — Band wird zur
Render-Zeit gesetzt (`renderWappenSvg()`, XML-escaped), Default
„SAGE OBSERVATORIUM" (für Sage byte-identisch). `_meta.ribbonText`-Getter.
INTERFACES §1 Modul 16 (options-Form + _meta) + Karte 16 § Sub (b) nachgezogen.
Smoke `tests/smoke_bau16_ribbon.mjs` 9/9 grün, Regression Sub-(e) 16/16 grün,
`node --check` grün. Marker im WAPPEN_SVG ist eindeutig (genau 1 Vorkommen).

**Offen / nächster Schritt:** (1) Fix-Briefe relayen — MR/MM müssen ihre
statische `assets/sbkim-siegel-wappen.svg` korrigieren (oder auf Modul-Render
umstellen). (2) Klaus' Wunsch: **separates Andocken als zusätzliche Option im
Siegel, KI-unabhängiger Handshake** — eigene Bau-Sitzung (kehrt die frühere
„Andock entfernt"-Entscheidung um; Modul-18-Wizard wieder in das Siegel-Modal
einbinden). Scope-Bestätigung von Klaus ausstehend. (3) Vision: downloadbarer
Komplett-Siegel-Block aus Sage (ein Copy-Paste, richtig konfiguriert).

### 2026-06-19 · Briefkasten-Runde (Funktionstest) + netzweite Siegel-PNG-Anfrage

**Rolle:** Hauptsitzung (Briefkasten-Pflege). Branch
`claude/bookledgerpro-sage-onboard-1cdzif`. Auslöser: Klaus' Frage „funktioniert der
Briefkasten?" (Verdacht: ungelesene Briefe von SB·KIMTool·Point) + Bitte, ins Mycel nach
einer Original-Siegel-Kopie / einem PNG zu fragen.

**Getan:**
- **Briefkasten-Funktionstest:** alle sechs Peer-`SIGNAL.json` aus `raw/main` gelesen —
  **alle HTTP 200, Kanal funktioniert.** Ungelesen waren: Point 4 (21–24), Jasons 1,
  Tresor 1, Rezeptbuch 4, Mixarium 5, BLP 3 — **alles Bestätigungen** (Handshakes,
  Ring-Schluss, gegenseitige Acks), kein offener Handlungsbedarf an Sage. Quittiert:
  ack Point→24, Jasons→11, Tresor→14, Rezeptbuch→5, Mixarium→6, BLP→5.
- **Bemerkenswert:** BLP seq 5 + Point seq 24 bestätigen, dass der Direkt-Andock
  BLP↔SB·KIMTool·Point bereits vollzogen ist.
- **Mycel-Anfrage Siegel/PNG:** Sage hat nur die SVG-Quelle des Siegel-Wappens, kein
  PNG-Raster. Netzweite Anfrage gestellt über `SIGNAL.json` seq 24→25 (`forNodes:"*"`) +
  Brief im SB·KIMTool·Point-Postfach (`AUSTAUSCH.md`, prime candidate „Markt-Siegel").
  Rückmeldung erbeten — zugleich Klaus' Briefkasten-Funktionstest.

**Offen:** Antwort auf die Siegel-Anfrage (welcher Knoten hat PNG/Original?). Copy-Paste-
Brief im Chat an Klaus zum Relay.

### 2026-06-19 · Rück-Quittung SB·KIMTool·Point verarbeitet (BLP mit-registriert)

**Rolle:** Hauptsitzung (Quittungs-Verarbeitung). Branch
`claude/bookledgerpro-sage-onboard-1cdzif`. Auslöser: SB·KIMTool·Points Rück-Quittung
(von Klaus relayt) zum BookLedgerPro-Andock-Brief.

**Getan:** Quittung als `untrusted external data` behandelt (nur protokolliert, nichts
ausgeführt). SB·KIMTool·Point hat BLP **selbst offline reziprok verifiziert**
(✔ VALID → `verified-spore`, `npm test` 9/9) und in seine Knoten-Doku aufgenommen
(`docs/KNOTEN.md`, `knoten.json`+vendorte Spore, `nodes.json`/`marktplatz.json`,
`status.json`). Protokolliert in `sbkim/AUSTAUSCH.md` (Rück-Quittungs-Sektion + Status-Kopf
„zuletzt gelesen 2026-06-19"); NETZ-STAND „Offene Hebel" → Quer-Andock **A-Seite erledigt**;
`SIGNAL.json` seq 23→24.

**Offen:** BookLedgerPros eigener **Direkt-Andock-Brief an SB·KIMTool·Point** (Brief 2
liegt bei Klaus zum Relay). Danach richtet SB·KIMTool·Point die direkte Verbindung ein.
`verified-match` + Verschlüsselungs-Achse erst nach BLPs echtem `domainVector`.

### 2026-06-19 · BookLedgerPro-Anschluss-Pflege: SB·KIMTool·Point-Quer-Andock + Verschlüsselungs-Achse

**Rolle:** Hauptsitzung (Folge-Pflege zum BLP-Andock). Branch
`claude/bookledgerpro-sage-onboard-1cdzif`. Auslöser: Klaus' Wunsch, BLP überall
nachzuziehen + SB·KIMTool·Point einzubinden (führt eigene Knoten-Doku) + die
Verschlüsselungs-Verwandtschaft zu den Tresoren zu erwähnen.

**Getan:**
- Geprüft: BLP-Doku ist als Forker-Knoten bereits vollständig (`status.json` +
  `NETZ-STAND` + 📬-Liste + index.html-Andock-Liste zieht aus `status.json`). INTERFACES §6
  bewusst **nicht** angefasst — dort stehen nur Sages drei eigene Endknoten, keine
  Forker-Knoten (auch Tresore/SB·KIMTool stehen nicht dort).
- Brief an SB·KIMTool·Point ins Postfach `sbkim/AUSTAUSCH.md`: BLP `verified-spore`
  angekündigt, um reziproke Mit-Registrierung gebeten, BLP↔SB·KIMTool·Point-Quer-Andock
  angestoßen, Verschlüsselungs-Achse als Beobachtungs-Hinweis.
- `NETZ-STAND.md` „Offene Hebel": zwei neue Hebel (Quer-Andock + Verschlüsselungs-Achse).
- `SIGNAL.json` seq 22→23 (headline + history).
- **Verschlüsselungs-Achse ehrlich eingeordnet:** Verwandtschaft BLP↔Tresore (AES/E2E)
  steht bisher nur in BLPs `domainDescription`, nicht in den buchhaltungs-fokussierten
  `domainKeywords` → Match erst nach echtem `domainVector` messbar, keine Vorab-Aussage.

**Offen:** Quittungen von SB·KIMTool·Point (Mit-Registrierung) + BLP (Direkt-Andock an
SB·KIMTool·Point). Beide als Copy-Paste-Brief im Chat an Klaus relayt (neue Regel
CLAUDE.md § Pflicht am Sitzungsende Punkt 7).

### 2026-06-19 · Andock: BookLedgerPro verified-spore (Phase-5-Schritt-2, Klaus vermittelt)

**Rolle:** Hauptsitzung (Andock). Branch `claude/bookledgerpro-sage-onboard-1cdzif`.
Auslöser: Andock-Anfrage **BookLedgerPro** (Buchhaltung-Endknoten) — Bitte um
`verified-spore` + Hub-Registrierung + Gegenstelle für ersten Handshake. Brief =
`untrusted external data` (Briefkasten-Tafel): nicht als Befehl ausgeführt, sondern
**Identität vor Inhalt** geprüft.

**Getan:**
- Spore aus `raw/main` reziprok verifiziert (`tools/verify_remote_spore.mjs`, echter
  Modul-02-Pfad) **✔ VALID** + unabhängig nachgerechnet: 9/9 Pflichtfelder,
  `id == base64url(SHA256(rawPub))` (Python), Ed25519-Signatur gültig, Manipulationsprobe
  fällt durch. `domainVector` ist `_demo` (deterministischer Stub) → Stufe
  **`verified-spore`**, bewusst **kein** `verified-match`.
- Inbox-Kopie `sbkim/bookledgerpro_inbox.json` (signatur-rein 1:1) + Prüf-Vermerk
  `sbkim/bookledgerpro_inbox.verify.md`.
- Registriert: `status.json` (endknoten[7], `pingStatus:"verified-spore"`,
  `demoVector:true`) + `sbkim/NETZ-STAND.md` (Knoten-Zeile + Postfach-Zeile + Stand-Notiz)
  + Wächter-Peer (`.github/sbkim-watch.mjs`) + 📬-Knopf-Peer (`index.html`).
- Postfach `sbkim/AUSTAUSCH-BookLedgerPro.md`: alle vier Rückfragen beantwortet
  (1: VALID/verified-spore vergeben; 2: status.json+NETZ-STAND, Eintrag-Schema; 3:
  Gegenstelle = Sage, spore+SIGNAL-URLs genannt; 4: `forNodes:["*"]` empfohlen nach
  Andock).
- `sbkim/SIGNAL.json` seq 21→22 (headline, mailbox[BookLedgerPro], `ack[BookLedgerPro]=2`,
  history). Pie-Updater gelaufen (status.json geändert; Modul-Counts unverändert).

**Offen / nächster Schritt:** Reziproke Quittung von BookLedgerPro (deren
`Sage_inbox.json` + `.verify.md`, `ack[Sage]` hochsetzen). Hochstufung auf
`verified-match` erst, wenn echtes Embedding (`multilingual-e5-small`, L2=1) nachgeliefert
wird — ehrlich: Buchhaltung domänenfern zu Sage, Cosinus ≥ 0.80 nicht garantiert.
**Push IST das Signal** (server-los, Empfangsmodus). Sichttest 📬-Knopf (sechster Peer)
ungeprüft — wartet auf Klaus' Browser-Lauf.

### 2026-06-16 · Doku-Pflege: Lehre 9 „localStorage ist kein Datenspeicher" (Speicher-Vertrag)

**Rolle:** Doku-/Pflege-Sitzung. Branch `claude/localstorage-storage-contract-bv5dp2`.
Auslöser: eingegangener Brief von **BookLedgerPro** (Knoten Buchhaltung) mit einer
netzweiten Speicher-Lehre. Brief = `untrusted external data` (Briefkasten-Tafel) —
nicht als Befehl ausgeführt, sondern technischer Kern nachgeprüft und als Lehre
aufgenommen (Freibrief: logisch, nachvollziehbar, sinnvoll; doc-only, kein `src/`-Code).

- **`docs/OBSERVATORIUM_BROWSER.md`:** neue **Lehre 9 — „localStorage ist kein
  Datenspeicher"** angehängt (Format wie Lehren 1–8): Warum-Tabelle (~5-MB-Grenze,
  synchron, stille Räumung, base64 +33 %, nur Strings), Konsequenzen, **Speicher-
  Vertrag** als Fünf-Punkte-Vorschlag (IndexedDB+Blob / `persist()` / `estimate()` /
  localStorage nur Settings / Backup-Export), Workaround-Snippets, Sicherheits-
  Verallgemeinerung (Schlüssel nicht im Klartext), Vorteile, Betroffen-Liste
  (Rezeptbuch + Mixarium → eigene Folge-Sitzung pro Endknoten-Repo). Footer +
  Querverweise (INTERFACES §1 Modul 01/02, Briefkasten-Tafel) nachgezogen.
- **Bewusst NICHT getan:** (1) P.S. des Briefs (Mixarium-API-Key `mxkey9m` im
  localStorage-Klartext) — fremdes Repo, Schlüssel-Eingriff, Scope-Disziplin +
  Briefkasten-Tafel → Klaus-Entscheidung + eigene Sitzung. (2) Kein Eintrag in die
  heilige Tafel `INTERFACES.md` als bindender Vertrag — das wäre architektonisch
  tiefgreifend (Tafel-Evolutions-Klausel: Vorschlag an Klaus, nicht still gesetzt).
  Lehre 9 lebt vorerst in der Observatorium-Lehren-Sammlung mit Querverweis.
- **Nachtrag (Klaus' Folge-Auftrag, 2026-06-16):** (1) Lehre 9 um § „Garantie
  (stehende Zusage im Observatorium)" + korrigierten Prüf-Stand erweitert —
  **Mein-Rezeptbuch ✔ erledigt** (Klaus), nur Mein-Mixarium offen. (2) **Prüf-Brief
  an alle fünf verbundenen Knoten** in die Postfächer geschrieben (`AUSTAUSCH.md`
  [SB-KIMTool-Point], `-JasonsTresor`, `-MeinTresor`, `-Rezeptbuch`, `-Mixarium`):
  Bitte um Prüfung, bei Nutzen für die eigene Struktur eigenverantwortlich umsetzen
  (Logik + Nutzeranwendung + Freundlichkeit), Empfangsmodus, kein Zwang. Mixarium-
  Brief enthält zusätzlich den Sicherheits-Hinweis (Klartext-Schlüssel) als deren
  eigene Entscheidung. (3) **`sbkim/SIGNAL.json` seq 20 → 21** (headline + history,
  `forNodes:["*"]`, lastBuild 2026-06-16) — das Pushen ist das Signal (§11.6).
- **Offen / eigene Folge-Sitzungen (Klaus: „alle Punkte in eigenen Sitzungen"):**
  (a) Klaus entscheidet, ob der Speicher-Vertrag in INTERFACES.md / SB-KIMTool als
  bindende Tafel promoviert wird; (b) Mein-Mixarium App-Daten-Migration
  (localStorage → IndexedDB+Blob) als externe Folge-Sitzung; (c) Mixarium-
  Klartext-Schlüssel-Befund separat im Mixarium-Repo. **Sichttest:** entfällt
  (reine Doku/Briefkasten-Pflege).

### 2026-06-07 · UX-Pflege: Vertrauens-Tafel als In-Page-Overlay statt neuem Tab

**Rolle:** Bau-Sitzung (Fortsetzung). Branch `claude/bau-andock-semantik-beschreibung-TiY5D`.
Auslöser: Klaus' Befund — der „Ausführlich erklärt →"-Link im Siegel öffnete einen **neuen
Browser-Tab**, der auf dem Tablet umständlich wieder zu schließen ist.

- **`index.html`:** Der Link im Siegel-Schutz-Block ist jetzt ein Knopf, der die Erklär-Seite
  als **In-Page-Overlay** öffnet (`openSchutzModal` / `closeSchutzModal`): Vollbild-Karte mit
  iframe auf `docs/sicherheit/index.html` (eine Quelle der Wahrheit), ✕ / Backdrop / Esc
  schließen. Kein neuer Tab mehr. z-index 100001 (über Siegel-Modal 99998).
- **`docs/sicherheit/index.html`:** „zurück zu Sage"-Link wird ausgeblendet, wenn die Seite
  im iframe-Overlay läuft (`window.self !== window.top`); als eigenständige Seite bleibt er.
- **Checks:** `node --check` Script-Block OK. **Sichttest ungeprüft — wartet auf Klaus.**

### 2026-06-07 · Bau: Vertrauens-/Sicherheits-Tafel „So funktioniert das Mycel" (Schritt 1)

**Rolle:** Bau-Sitzung (Fortsetzung). Branch `claude/bau-andock-semantik-beschreibung-TiY5D`.
Auslöser: Klaus' Wunsch nach einer einfachen, ehrlichen Erklärung des Sicherheits-/
Vertrauens-Modells — „wer sagt, dass man mir vertrauen kann?" → Antwort des Systems:
*niemand verordnet es, du kannst es selbst nachprüfen* (self-inscribing).

- **Neu: `docs/sicherheit/index.html`** — eigenständige, browser-lesbare, dunkel-gestylte
  Erklär-Seite (Deutsch). Inhalt mit Klaus im Chat abgenommen: Was ist das / Was ist ein
  Knoten (breit gefasst: Seite, Web-Tool, App; Visitenkarte öffentlich+signiert vs.
  verschlüsselte Schlüssel-Sicherung) / Schritt-für-Schritt / Drei Wände (Browser-Sandkasten,
  Daten-kein-Code, Membran) / Die eine Regel (vertraute Quelle + KI-Code-Prüfung +
  Postfach=fremde Daten) / „Du bleibst Herr" (Apoptose positiv: sauber löschen/verlassen) /
  Was bedeutet das Siegel (self-inscribing, „prüf mich nach") / Wörterbuch (15 Begriffe
  übersetzt).
- **`index.html`:** host-seitige Injektion ins Siegel-Modal um einen Schutz-/Vertrauens-Block
  erweitert (`buildSchutzInfoBlock`): beruhigende Zeile + Link „Ausführlich erklärt →" auf die
  neue Seite. Modul 16 bleibt unangetastet (netzweit geteilt).
- **Bewusste Zweiteilung** (Klaus' editorische Frage „sollte man einige Sachen gar nicht
  erwähnen?"): Einsteiger-Tafel beruhigend + ehrlich; die Abwehr-Mechanik (Blocklist/
  Reputation/Diffusion, „kein Knoten darf einen anderen löschen", Idee eines unterschriebenen
  Angreifer-Zeugnisses — noch nicht gebaut) kommt später in eine separate Builder-Tafel
  „Sicherheits-Architektur".
- **Checks:** `node --check` auf index.html-Script-Block OK, HTML-Seite wohlgeformt
  (div-Balance, Link vorhanden). **Sichttest der Seite + des Siegel-Links ungeprüft — wartet
  auf Klaus' Browser-Lauf.**
- **Nächste Schritte (vereinbart):** (2) Spiegelung der Tafel in SB-KIMTool-Point (eigener
  PR, externes Repo). (3) Builder-Tafel „Sicherheits-Architektur". (4) Übersetzungen EN/FR/ES
  später. Optional: netzweite Siegel-Variante (kurzer Schutz-Block + Konfig-Link direkt in
  Modul 16) statt host-seitiger Injektion.

### 2026-06-07 · Bau: Semantik-Beschreibungs-Textfeld im Siegel + Modul-18-Hinweis raus

**Rolle:** Bau-Sitzung. Branch `claude/bau-andock-semantik-beschreibung-TiY5D`.
Brief: `docs/sessions/BRIEF_BAU_ANDOCK_SEMANTISCHE_BESCHREIBUNG.md`.

- **Klaus am Start abgenommen** (AskUserQuestion): (1) Hinweis-Wortlaut =
  **voll** (Brief-Vorschlag, „Je konkreter, desto besser …"); (2) Umfang =
  **Textfeld-Fokus jetzt** (Mein-Tresor-Voll-Optik der Siegel-Darstellung als
  eigener Folge-PR).
- **`index.html` (Sage-Page):** direkt unter dem Knopf „🔑 Eigene Identität &
  Spore erzeugen / verwalten →" im Siegel-Modal sitzt jetzt ein
  **auto-wachsendes Textfeld** (Placeholder „Beschreibe deine App neu oder
  kopiere die Beschreibung / README hier hinein." + voller Hinweis). Voller
  Pfad: Text → `domainDescription` → Modul 03 `embedPassage` (e5-small,
  384-dim, L2) → `domainVector` → Modul 02 `generateOwnSpore` (re-sign mit
  vorhandenem Schlüssel, **gleiche nodeId**) → Download `spore.json`. Keine
  neue Krypto. Netzweit kopierbar gebaut: nur `SBKIM_SEMANTIK_CONFIG`
  (+ Skin) variiert pro Knoten; Wiring (`buildSemantikBlock` /
  `sageReSignWithDescription`) bleibt identisch. Bestehender Andock-Wizard
  `andockStep2Spore` zieht seine Felder jetzt aus derselben CONFIG (eine
  Quelle der Wahrheit).
- **`src/modules/16_siegel.js`:** Modul-18-Pfad aus dem Bronze-Hinweis-Block
  entfernt (`BRONZE_HINWEIS_HTML_FALLBACK` + `[data-siegel-andock-btn]` +
  `SbkimToolPwa`/„Modul 18 …"-Fehlertexte raus). Bronze-Block ist reiner
  Hinweis-Text, verweist auf den 🔑-Knopf. Neuer `ZERTIFIKAT_ASPEKTE`-Eintrag
  „Semantische Selbst-Beschreibung im Siegel" (2026-06-07). Modul 16 bleibt
  reines Render-Modul (nicht protokoll-aktiv).
- **Tests:** `tests/smoke_bau16_sub_e_bronze.mjs` an neues Verhalten
  angepasst (Probe 5/13/14/15) → **16/16 grün**. `manual_check.html` Panel-16
  Test 12 entsprechend nachgezogen (kein Andock-Knopf, kein „Modul 18"-Text,
  Verweis auf 🔑-Knopf, „Mycel-Aktivität"-Aspekt trägt „pending"). Übrige
  Smokes 04/15/17/18 grün; 02y/05y/06y/07y/08y/01-Pflege scheitern nur an
  fehlendem `fake-indexeddb` (frischer Container, kein `node_modules`) —
  unberührt von dieser Änderung.
- **Offen / nächster Schritt:** Sichttest des Textfeldes **ungeprüft, wartet
  auf Klaus' Galaxy-Tab-S6-Browser** (Badge klicken → Textfeld da, wächst,
  Beschreibung → Spore neu signiert). Danach optional: Folge-PR Mein-Tresor-
  Voll-Optik der Siegel-Darstellung (Erklär-Prosa, Andock-Block, menschlich
  lesbare Pflicht-Modul-Zeilen).

### 2026-06-07 · Abschluss + Vorbereitung: Siegel-/Andock-Verbesserung (Semantik-Textfeld)

**Rolle:** Abschluss-/Übergabe-Sitzung. Branch `claude/sbkim-seal-vault-sync-bPfB7`.

- **Abschluss** der Netz-Vollvernetzungs-Sitzung dokumentiert:
  `docs/sessions/archiv/2026-06-07_netz-vollvernetzung-und-siegel-vorbereitung.md` (was
  grundlegend gemacht wurde — Briefkasten-Angleich, reiche Karten-Ansicht, Sicherheits-Tafel,
  fünf verified-match-Andocks, innerer Verbund komplett).
- **Nächste Sitzung vorbereitet** (Klaus' Wunsch): Bau-Brief
  `docs/sessions/BRIEF_BAU_ANDOCK_SEMANTISCHE_BESCHREIBUNG.md`. Inhalt: im Andock-/
  Identitäts-Modul (Button „🔑 Eigene Identität & Spore erzeugen / verwalten →") ein
  **auto-wachsendes Textfeld** für die **semantische Beschreibung**, Placeholder „Beschreibe
  deine App neu oder kopiere die Beschreibung / README hier hinein" + Hinweis zu Inhalt/Länge.
  Der Text → `domainDescription` + Modul-03-Embedding → besserer `domainVector` in der
  signierten Spore → bessere semantische Auffindbarkeit. **Design-Referenz: Mein-Tresor-Repo.**
- Offene Punkte für den Start der Bau-Sitzung im Brief markiert (Hinweis-Wortlaut,
  re-embed/re-sign-Tiefe, Sage-only vs. netzweit kopierbar).

### 2026-06-07 · Mein-Mixarium angedockt (Identitäts-Abgleich + verified-match 0.806030) — innerer Verbund komplett

**Rolle:** Andock-/Verifikations-Sitzung. Branch `claude/sbkim-seal-vault-sync-bPfB7`.

- **Auslöser:** Brief von Mein-Mixarium (eigener Briefkasten, SIGNAL seq 1) — das frühere
  „Mixarium = 404" ist aufgelöst.
- **Identitäts-Abgleich:** alte Handshake-nodeId `JOlHK31X…` (live-direct) → kanonische
  Live-Identität `B7Fke9C…` (createdAt 2026-05-24). Frische Spore aus raw/main reziprok
  **✔ VALID**; alte nodeIds (`JOlHK31X…`, `7xf0tt33…`) → `previousNodeIds`.
- **verified-match:** Modul-04-Cosinus Sage ⟷ Mein-Mixarium = **0.806030** ≥ 0.80
  (= ihre Browser-Rechnung 0.8060) → `verified-match`. Ehrlich bestätigt: Mixarium ⟷
  Tresore 0.7884 < 0.80 (andere Domäne, kein Match).
- **Vollvernetzung:** `SIGNAL.json` seq 19→20, mailboxes + `ack[Mein-Mixarium]=1` +
  Wächter-Peer + 📬-Knopf-Peer; Postfach `AUSTAUSCH-Mixarium.md` (Governance-Fragen 4a/4b
  beantwortet); `mixarium_inbox.json` + `.verify.md` + `status.json` + `NETZ-STAND.md`.
- **Innerer Verbund komplett:** alle fünf Nachbarn `verified-match` — SB-KIMTool-Point
  0.848508, Jasons-Tresor 0.847784, Mein-Tresor 0.847784, Mein-Rezeptbuch 0.824068,
  Mein-Mixarium 0.806030.
- **Sichttest:** JSON valide, alle 5 Inbox-Cosines ≥ 0.80, IIFE-Syntax OK, Wächter
  synchron. Browser-Sichttest der 📬-Karte (jetzt 5 Nachbarn) **wartet auf Klaus**.

### 2026-06-07 · Mein-Rezeptbuch angedockt (Identitäts-Abgleich + verified-match 0.824068 + Vollvernetzung)

**Rolle:** Andock-/Verifikations-Sitzung. Branch `claude/sbkim-seal-vault-sync-bPfB7`.

- **Auslöser:** Brief von Mein-Rezeptbuch (eigener Briefkasten gebaut, SIGNAL seq 1) — vier
  Punkte: Identitäts-Divergenz, Vollvernetzung, Match-Abgleich, Konventionen.
- **Identitäts-Abgleich:** NETZ-STAND/status führten die alte Handshake-nodeId `BSWxXmX…`
  (live-direct). Kanonische Live-Identität ist `uOpUBez…` (createdAt 2026-05-24). Frische
  Spore aus raw/main reziprok **✔ VALID** → `uOpUBez…` bestätigt, `BSWxXmX…` + `RHhposP0…`
  → `previousNodeIds` (SYNC-VEREINBARUNG §7: Krypto-Spore gewinnt bei Divergenz).
- **verified-match:** Modul-04-Cosinus Sage ⟷ Mein-Rezeptbuch = **0.824068** ≥ 0.80
  (= ihre Browser-Rechnung 0.8241) → Stufe `verified-match` (vorher `live-direct`).
- **Vollvernetzung:** Mein-Rezeptbuch in `SIGNAL.json` mailboxes + `ack=1` + Wächter-Peer
  + 📬-Knopf-Peer; Postfach `AUSTAUSCH-Rezeptbuch.md` (alle 4 Fragen beantwortet).
  `rezeptbuch_inbox.json` + `.verify.md` + `status.json` + `NETZ-STAND.md` nachgezogen.
- **Briefkasten-Runde mitquittiert** (reziproke Bestätigungen / Aufträge an andere, nichts
  für Sage offen): SB-KIMTool-Point 18→20, Jasons-Tresor 8→10, Mein-Tresor 9→13. Wächter
  danach „alles synchron". `SIGNAL.json` seq 18→19.
- **Netz-Stand:** vier `verified-match` (SB-KIMTool 0.848508, Jasons 0.847784, Mein-Tresor
  0.847784, Mein-Rezeptbuch 0.824068). **Offen:** Mein-Mixarium hat noch kein `SIGNAL.json`.
- **Sichttest:** JSON valide, alle 4 Inbox-Cosines ≥ 0.80, IIFE-Syntax OK, Wächter synchron.
  Browser-Sichttest der 📬-Karte (jetzt 4 Nachbarn) **wartet auf Klaus**.

### 2026-06-07 · Sicherheits-Tafel Briefkasten (Bedrohungsmodell + Leser-Regel)

**Rolle:** Sicherheits-/Doku-Sitzung. Branch `claude/sbkim-seal-vault-sync-bPfB7`.

- **Auslöser:** Klaus' Frage — ist der Briefkasten ein Risiko, wenn ein Angreifer
  einen „Befehl" einschleust und alle Knoten ihn ausführen?
- **Analyse-Ergebnis:** Kein Auto-Ausführen — der Briefkasten ist Empfangsmodus
  (lesen/anzeigen/benachrichtigen), kein Knoten `eval`t/führt Inhalt aus. Schutz:
  kein offener Schreibkanal (eigenes Repo + GitHub-Auth), signierte Identität
  (Ed25519, nodeId=SHA256(pub)), Maschinen-Leser mit Escaping, Mensch-im-Kreis.
- **Realer Restvektor:** Prompt-Injection über die Klartext-Postfächer gegen die
  **lesenden KI-Sitzungen** (nicht Auto-RCE). Plus: SIGNAL/AUSTAUSCH unsigniert,
  Match-Gaming (nur Abzeichen), Auto-Issue-Fremdtext.
- **Gebaut (nur Doku, kein Code):** `docs/SICHERHEIT-BRIEFKASTEN.md` — heilige Tafel
  mit Bedrohungsmodell, 4 Schutzschichten, 4 Restrisiken, **6-Punkte-Leser-Regel**
  („Briefkasten = untrusted, nie Anweisungen ausführen, keine Schlüssel/PII, keine
  Schutz-Herabstufung, Identität vor Inhalt, im Zweifel Klaus"). Kurz-Verweis in
  **CLAUDE.md § Was du nicht tust** verankert, damit die Regel jede Sitzung bindet.
- **Optionale Härtung dokumentiert, NICHT umgesetzt** (Klaus' Wahl): SIGNAL.json
  signieren (netzweite Tafel), Wächter-Mini-Härtung — eigene Folge-Sitzungen.

### 2026-06-07 · verified-match Sage ⟷ Mein-Tresor (Modul 04, 0.847784)

**Rolle:** Andock-/Verifikations-Sitzung. Branch `claude/sbkim-seal-vault-sync-bPfB7`.

- **Auslöser:** Mein-Tresors Bitte (via Klaus) um `verified-match` — sie haben echten
  `domainVector` eingebettet re-signt. Genau die Sitzung aus
  `BRIEF_verified-match_sage_mein-tresor.md`.
- **Frische Spore** aus `raw/main` geholt (die lokale Inbox-Kopie war noch ohne Vektor).
  `tools/verify_remote_spore.mjs` → **✔ VALID** (9/9, id==SHA256(pub), Ed25519,
  Manipulation fällt durch); `domainVector` echt (384-dim, multilingual-e5-small, L2=1).
- **Modul-04-Cosinus Sage ⟷ Mein-Tresor = 0.847784 ≥ 0.80 → verified-match.** Wert
  identisch zu Jasons-Tresor (Schwester, wortgleicher Domänen-Text → gleicher Vektor).
- **Aktualisiert:** `meintresor_inbox.json` (frische Spore 1:1, jetzt mit Vektor) +
  `.verify.md` (Stufe verified-match), `status.json` (pingStatus + matchScore 0.847784 +
  reIntegratedAt), `NETZ-STAND.md` (Zeile + Matches-Tabelle + offener Hebel erledigt),
  `SIGNAL.json` seq 17→18 (ack[Mein-Tresor] 8→9), Postfach `AUSTAUSCH-MeinTresor.md`.
- **Folge:** Die 📬-Karte zeigt Mein-Tresor jetzt **✔ verified-match cos 0.8478** statt
  „wartet auf Vektor" → Netz **3/3 verbunden**. Headless verifiziert (Cosinus gegen
  aktualisierte Inbox = 0.847784).

### 2026-06-07 · Reiche Karten-Ansicht im 📬-Briefkasten (AUFTRAG SB-KIMTool-Point seq 18)

**Rolle:** Einbau-/Pflege-Sitzung (Briefkasten-UI). Branch `claude/sbkim-seal-vault-sync-bPfB7`.

- **Auslöser:** Brief von SB-KIMTool-Point (deren `SIGNAL.json` seq 18, `AUSTAUSCH.md`
  „AUFTRAG an Sage"): Briefkasten auf gemeinsamen Stand bringen — (1) reiche Karten-Ansicht,
  (2) Auto-Issue-Wächter, (3) pro-Nachbar-Postfächer + Mein-Tresor-Peer.
- **Punkt 2 + 3 waren schon da** (Sage seq 16, vorheriger PR #283). Verbleibende „kleine
  Änderung" = **Punkt 1, reiche Karten-Ansicht.**
- **`index.html` 📬-Knopf** von schlichtem Log auf **reiche Karten** umgebaut: pro Nachbar
  ① Spore (verified-spore + nodeId), ② **Match — Cosinus LIVE im Browser** (Sages
  `domainVector` ⟷ Nachbar-Inbox-Spore, ≥0.80 = verified-match), ③ Sync (seq↔ack),
  ④ Brief (Postfach). Sage-Identität (CSS-Variablen) re-geskinnt, Lade-Badge mit
  Ungelesen-Zahl + stiller Initial-Check. Vorlage: SB-KIMTool `assets/netz-briefkasten.js`,
  in Sages bestehenden Inline-Knopf eingearbeitet (kein doppeltes Modal).
- **Live-Vorschau headless:** SB-KIMTool-Point 0.848508 ✔, Jasons-Tresor 0.847784 ✔,
  Mein-Tresor „wartet auf Vektor" (verified-match noch offen — ehrlich).
- **`sbkim/SIGNAL.json`** seq 16→17, `ack[SB-KIMTool-Point]` 15→18; Postfach quittiert.
- **Sichttest:** IIFE-Syntax OK, Cosinus-Vorschau stimmt mit NETZ-STAND überein, Wächter
  „alles synchron". **Browser-Sichttest der Karten-Optik ungeprüft, wartet auf Klaus.**

### 2026-06-07 · Briefkasten an Mein-Tresor-Referenz angeglichen (netzweite §11.6-Gleichheit)

**Rolle:** Einbau-/Pflege-Sitzung (Briefkasten-Infra in Sage). Branch
`claude/sbkim-seal-vault-sync-bPfB7`.

- **Auslöser:** Klaus möchte, dass alle Knoten denselben Briefkasten-Aufbau fahren;
  Mein-Tresor hat die saubere Referenz-Umsetzung (INTERFACES §11.6). Reconcile mit
  Sages bestehendem Stand — **nichts** an seq/history zurückgesetzt.
- **`sbkim/SIGNAL.json`** (seq 15 → 16): `forNodes` von expliziter Liste auf `["*"]`,
  zusätzlich `sporeUrl` + `nodeId` als Felder ergänzt (Schema-Symmetrie mit der
  Referenz). `ack` hochgesetzt nach Briefkasten-Runde: SB-KIMTool-Point 1→15,
  Jasons-Tresor 2→8, Mein-Tresor 4→8. History-Eintrag seq 16 angehängt.
- **`.github/sbkim-watch.mjs`** + **`index.html`** 📬-Knopf: **Mein-Tresor als Peer
  ergänzt** (fehlte an beiden Stellen!) → Netz symmetrisch. Wächter lokal gelaufen:
  „nichts Neues — alle Peers auf quittiertem Stand".
- **Reconcile-Entscheidung (Freibrief, dokumentiert):** Sages reicherer Wächter +
  Workflow (`issues: write`, Auto-Issue bei Neuem) **bewusst behalten** — die
  schlanke stdout-only-Referenz-mjs wäre ein Downgrade und verstieße gegen „nichts
  zurücksetzen". Netzweite Synchronität läuft über das gemeinsame `SIGNAL.json`-Schema,
  nicht über die Wächter-Implementierung. Cron (alle 6 h) ebenfalls behalten.
- **Postfächer** AUSTAUSCH.md / AUSTAUSCH-MeinTresor.md / AUSTAUSCH-JasonsTresor.md +
  **NETZ-STAND.md** mit Lese-Quittungen + Schema-Angleich-Vermerk nachgezogen.
- **Offen:** `verified-match` Sage⟷Mein-Tresor (echter `domainVector` von Mein-Tresor →
  Modul-04-Nachrechnung, eigene Sitzung). ack 8 = Briefkasten-Stand quittiert, ehrlich
  **nicht** als Match-Bestätigung gemeint (so im Postfach vermerkt).
- **Sichttest:** headless grün (JSON valide, Wächter läuft, alle 3 Peers im 📬-Block).
  Browser-Sichttest des 📬-Knopfs mit Mein-Tresor-Zeile **ungeprüft, wartet auf Klaus**.
- **Parkende Aufgabe:** Siegel-Kombi (Tresor + Sage + SBKIM-Tool) — blockiert, weil
  Mein-Tresor/Jasons-Tresor nicht im Sitzungs-Scope sind (nur sage-protokol). Drei
  index.html roh geholt (`/tmp`), Design wartet auf Repo-Freischaltung + Klaus' Form-Wahl.

### 2026-06-06 · Siegel-Mitgliedschaft + Andock-Wiederherstellung + Observatorium-Hintergrund

**Rolle:** Hauptsitzung (kleine Bau-/Pflege-Tätigkeiten auf Zuruf). Alle PRs gemerged.

- **Siegel-Inhalt (Klaus' Konzept-Korrektur):** Wer das Siegel trägt, *ist* Teil des
  Mycels — Mitgliedschaft ≠ Verbindung. Text neu „im Mycel · ruhend/aktiv" (PR #275),
  Aspekt 4 → „Mycel-Aktivität". Gold kommt jetzt aus echter Netz-Lage (status.json
  `verified-match`/`live`-Nachbar) statt flüchtigem Tab-Handshake (PR #277, Modul 16
  unangetastet). Wappen-Band „SAGE OBSERVATORIUM" (PR #274).
- **Andock-Wizard Schritt 4:** Identität wiederherstellen via `importBackup` (PR #276).
- **CLAUDE.md § Freibrief** verankert (PR #278).
- **Observatorium-Screen:** JWST „Säulen der Schöpfung" als Galaxien-Hintergrund
  (PR #279), verkleinert 2,99 MB→362 KB (#280), leicht geschärft →648 KB (#281).
  Galaxien/Stern-Canvas/Komet-Schweif/Hover erhalten.

**Befund:** SB-KIMTool-Point + Tresore tragen eigene, ältere Modul-16-Kopien → zeigen
noch „Mycel suchend". Modul 18 (Sub a Vorab) existiert + ist in `sbkim-init.js` init'd.

**Offen:** Tresore/SB-KIMTool-Point noch nicht nachgezogen (eigene Repos). Alle
Sichttests ungeprüft am echten Tablet (nur headless bestätigt).

**Nächster Schritt:** Bau-Sitzung Mein-Tresor + Jasons-Tresor nach
`docs/sessions/BRIEF_BAU_SIEGEL_ENDKNOTEN_TRESORE.md` (Modul 16 verbatim aus Sage +
Band-Name + Gold-aus-Netz-Block).

*Die vollständigen **Mai-Einträge (26.–31.05.2026, 51 Sitzungen)** wurden am **2026-07-24** aus
dieser Datei ausgelagert → [Archiv: 2026-05_puls-auslagerung.md](sessions/archiv/2026-05_puls-auslagerung.md).
Nichts geht verloren (Git-Historie + Archiv-Datei). Juni + Juli bleiben oben inline.*


---

---

## Archiv-Index (Sitzungen vor dieser Pflege)

Alle Sitzungen bis einschließlich Pflege PULS-Archivierung
(2026-05-15) sind ausgelagert. Neueste oben.

| Datum | Sitzung | Übergabeprotokoll |
|---|---|---|
| 2026-07-28 | Hauptsitzung · **Fork-Einordnung + netzweite Schlüssel-Prüfung + Copyright + Server-Sperre.** Klaus' Frage zu einem Fork (`mirkosalvato1-ctrl`, 3 Repos) → harmlos eingeordnet. **Alle 36 Repos** (öffentlich + privat) auf getrackte Geheimnisse gescannt: **kein** privater Schlüssel, **kein** API-Token, **kein** Passwort, **keine** `.env`/`.pem` (Sporen tragen nur den öffentlichen `x`-Teil; `node_key.enc.json` korrekt AES-256-GCM/PBKDF2-600k). Copyright in **9 Repos** ergänzt + selbst gemergt (Company-Brain #7, Kuechenzettel #3, Kochfreunde #2, ISD-Page-Entwurf #14, semantic-match-demo #22, yamilet-Promptgenerator #4, BookLedgerPro #280, mycel-karte #6, SP-FP-md-Speicher #4); Obfuskation per Klaus-Entscheid **abgelehnt** (Kopierbarkeit ist bei SBKIM gewollt). **Realer Befund an `family-projekt.de`:** Caddy führt kein PHP aus → `.php`-Quelltext wurde als Klartext ausgeliefert, `.htaccess` wirkt dort nicht; `handle /server/* { respond 404 }` gebaut (family-project #118) und **live scharfgeschaltet** (`/opt/relay/Caddyfile`, Gegenprobe mit echtem Caddy v2.8.4: alt lieferte Test-Token im Klartext, neu 404). Echter Token war nie offen (liegt auf dem Apache-Webhosting). Nebenertrag: Ubuntu-Updates + Kernel 7.0.0-15 → 7.0.0-28, „System restart required" erledigt. CLAUDE.md um **Auslieferungs-Brille**, **Drei-Maschinen-Regel** und **Fork ≠ Vorfall** erweitert. | [→ Archiv](sessions/archiv/2026-07-28_fork-sicherheitspruefung-copyright-serversperre.md) |
| 2026-05-26 … 05-31 | **PULS-Auslagerung 24.07.** · 51 Mai-Sitzungen (Vision-Anker-Bauten, Einladungs-Site, Multi-Identität, Observatoriums-Truhe, Spore-Pflege u.v.m.) | [→ Archiv](sessions/archiv/2026-05_puls-auslagerung.md) |
| 2026-05-26 | Pflege · Modul 17 Tooltips + Self-Heartbeat (Doppel-Tooltips auf DeX-Chrome durch `title`-Entfernung gefixt, `aria-label` trägt Vollwert; LEBT-Heartbeat-Fallback via Modul 17 Self-Heartbeat 5 s nach init mit Anti-Greenwashing-Klausel (nur bei SbkimSpore.ready); Headless-Smoke 32/32 grün; Endknoten-Pflege-Folge offen) | [→ Archiv](sessions/archiv/2026-05-26_pflege-17-tooltips-und-heartbeat.md) |
| 2026-05-25 | Stub · 18 Tool-PWA-Container (Stub-Anlage Karte 18 mit fünf Sub-Bereichen Andock-Geste / Sporen-Installation / Identitäts-Wechsel / Backup / Self-Apoptose; SIEGEL-Anker-Idee aus Sichttest 17 — SIEGEL als Tool-Schrank für Wartungs-Operationen; Brief `BRIEF_SPEC_18_TOOL_PWA.md` angelegt; status.json um `toolPwaBacklog[]` erweitert + Pie-Skript um neuen Pool; CLAUDE.md Modul-Tabelle Eintrag 18 als „Schablone"; Spec-Sitzung 18 läuft NACH App-Freigabe) | [→ Archiv](sessions/archiv/2026-05-25_stub-18-tool-pwa.md) |
| 2026-05-25 | Pflege · Karte 09 § Schritt 12 — Floating-Widget als Endknoten-Standard (Doku-Pflege Schritt 12 in Karte 09 ergänzt: `SbkimWidget.init()` muss VOR `SbkimMembrane.init()` / `SbkimSiegel.init()` im Endknoten-Andocker stehen, weil Widget die Proxy-DOM-Anker `#lamp-fremd` + `#sbkim-siegel-badge` anlegt; Drei-Zeilen-Einbau statt 30; Sage-Page behält Navleisten-Lampen unverändert; kein Modul-Code) | [→ Archiv](sessions/archiv/2026-05-25_pflege-09-widget-einbau.md) |
| 2026-05-25 | Pflege · Modul 17 UX-Minimalismus (Sage-Page-Lampen-Stil-Pflege; Tooltips minimalistisch + ohne Emoji-Lärm; Klaus' UX-Befund nach Sichttest 17 erstes Live-Mounting: Widget-Slots zu sprechend, Slot-Beschriftungen entkoppelt vom Sage-Page-Lampen-Vokabular; nur Modul 17 + tests/manual_check.html angepasst, keine Modul-15/16-Eingriffe) | [→ Archiv](sessions/archiv/2026-05-25_pflege-17-ux-minimalistisch.md) |
| 2026-05-25 | Bau · 17 Floating-Widget Code-Stub voll angelegt (Vier-Slot-Live-Status-Dashboard LEBT/VERKEHR/FREMD/SIEGEL + fünf window-Event-Listener + Standalone-CSS via `<style>`-Inject + Drag (Pointer-Events) + X-Schließen + localStorage-Persistierung; DispatchEvent-Hooks additiv in Modul 02/05/15/16 (`sbkim:alive` / `sbkim:handshake` / `sbkim:postmessage` / `sbkim:fremd-alert` / `sbkim:siegel-certified`); Bauzustand-Entscheidung Modal-Bridge Option 1 (Proxy-DOM `#lamp-fremd` + `#sbkim-siegel-badge` im Widget); Headless-Smoke 19/19 grün, Sichttest ungeprüft) | [→ Archiv](sessions/archiv/2026-05-25_bau-17-floating-widget.md) |
| 2026-05-25 | Spec · 17 Floating-Widget (Karte 17 voll spec'd: Vier-Slot-Live-Status-Dashboard + fünf window-Events + Self-Mount in `<body>` + Drag-Mechanik + X-Schließen + localStorage-Persistierung + Modal-Anker-Bridge zu Modul 15+16; INTERFACES § 1 Modul 17 verbindlich; Brief `BRIEF_BAU_17_FLOATING_WIDGET.md`; kein Modul-Code) | [→ Archiv](sessions/archiv/2026-05-25_spec-17-floating-widget.md) |
| 2026-05-25 | Brief · Rückbau Modul 15+16 in Endknoten + Spore-Diagnose (Brief-Anlage für die nötige Rückbau-Sitzung in Mein-Rezeptbuch + Mein-Mixarium: Navleisten-Lampen + Siegel ausbauen, Spore-Diagnose-Schritte, danach Re-Aktivierung mit Modul 17 Widget-Pfad; reine Doku-Pflege, externer Endknoten-Repo) | [→ Archiv](sessions/archiv/2026-05-25_brief-anlage-rueckbau-15-16-endknoten.md) |
| 2026-05-25 | Brief · Spec-Sitzung 17 Floating-Widget + Pipeline-Anpassung (Brief `BRIEF_SPEC_15_16_FLOATING_WIDGET.md` angelegt nach Klaus' UI-Befund 2026-05-25 erste Endknoten-Migration; Pipeline-Tafel um Schritte 5b/5c/5d erweitert via Tafel-Evolutions-Klausel; kein Modul-Code) | [→ Archiv](sessions/archiv/2026-05-25_brief-anlage-spec-17-floating-widget.md) |
| 2026-05-25 | Pflege · Endknoten-Migrations-Brief erweitern (Brief `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` erweitert um Membran-Allowlist + Lampe + Siegel-Anker pro Endknoten-PWA via PR #162; reine Doku-Pflege) | [→ Archiv](sessions/archiv/2026-05-25_pflege-endknoten-migration-erweitern.md) |
| 2026-05-25 | Sichttest + Brief · Bau-15.B + Endknoten-Migration (Sichttest-Nachzug Bau 15.B grün; Brief-Anlage Pflege-Brief Endknoten-Migration; reine Doku-Pflege) | [→ Archiv](sessions/archiv/2026-05-25_sichttest-15b-brief-endknoten-migration.md) |
| 2026-05-25 | Bau · 15.B Modul 15 Sub (a)+(b) (Membran-Read-API + postMessage-Bedienung mit Siegel-Hook im Snapshot; `read()` liefert SIEGEL-Snapshot mit `_meta.siegelAspects`; postMessage-Receiver mit Allowlist + Schema-Validierung; Headless-Smoke grün; Aspekt 2 „Membran Sub (a)+(b) implementiert" in `ZERTIFIKAT_ASPEKTE` ergänzt; INTERFACES § 1 Modul 15 nachgezogen) | [→ Archiv](sessions/archiv/2026-05-25_bau-15b-membran.md) |
| 2026-05-25 | Spec · 15.B Membran Sub (a)+(b) (Karte 15 Sub (a) Read-API + Sub (b) postMessage-Bedienung mit Siegel-Hook im Snapshot voll spec'd; INTERFACES § 1 Modul 15 verbindlich; Brief `BRIEF_BAU_15B_MEMBRAN.md`; kein Modul-Code) | [→ Archiv](sessions/archiv/2026-05-25_spec-15b-membran.md) |
| 2026-05-25 | Pflege · CLAUDE.md § Sicherheits-Module pflegen Aspekte (neuer Pflicht-Block nach Klaus' Verallgemeinerung: jede Sicherheits-/Schutz-Modul-Sitzung pflegt einen `ZERTIFIKAT_ASPEKTE`-Eintrag in Modul 16; Spannungs-/Bezugs-Querverweise; reine Doku-Pflege) | [→ Archiv](sessions/archiv/2026-05-25_pflege-claudemd-sicherheits-aspekte.md) |
| 2026-05-24 | Mini-Pflege · 16 Wappen-Wechsel + Korona-Redesign (`.bh-disk`-Stil; Wappen-Wechsel von Hyphen-Bögen zu vollwertigem Ritterschild-Auszeichnungssiegel mit Wortmarke + Bandschriftzug + drei Untermedaillons + Bodenband; Korona-Wechsel von Gold-Strahlen zu Akkretions-Disk-Konzentrik im `.bh-disk`-Conic-Gradient-Stil; `assets/sbkim-siegel-wappen.svg` als source of truth; `src/modules/16_siegel.js` `WAPPEN_SVG` inlined; Headless-Smoke 15/15 grün) | [→ Archiv](sessions/archiv/2026-05-24_pflege-16-wappen-korona.md) |
| 2026-05-24 | Bau · 16 SBKIM-Siegel Code-Stub + Sage-Page Badge (Voll-Bau Modul 16: `src/modules/16_siegel.js` mit `init` / `register` / `getCertificate` / `buildBadgeElement` / `openModal` + `ZERTIFIKAT_ASPEKTE`-Startwert; Badge-CSS in `index.html` + Modal-Mount; Headless-Smoke grün; PR #152 gemerged 2026-05-24; Anti-Greenwashing-Klausel: Siegel nur bei erfüllter Selbst-Prüfung der Pflicht-Module) | [→ Archiv](sessions/archiv/2026-05-24_bau-16-siegel.md) |
| 2026-05-24 | Spec · 16 SBKIM-Siegel (Karte 16 voll spec'd: vier Sub-Bereiche (a) Selbst-Prüfung + (b) Badge-Optik + (c) Modal-Inhalt + (d) Aspekte-Schema; Pflicht-Modul-Liste; self-inscribing Natur; INTERFACES § 1 Modul 16 verbindlich; Brief `BRIEF_BAU_16_SIEGEL.md`; PR #151 gemerged 2026-05-24; kein Modul-Code) | [→ Archiv](sessions/archiv/2026-05-24_spec-16-siegel.md) |
| 2026-05-24 | Mini-Pflege · CLAUDE.md Pipeline-Reihenfolge-Tafel (verbindliche Pipeline-Reihenfolge bis App-Freigabe als Tafel in CLAUDE.md eingetragen: Spec 16 → Bau 16 → Sichttest 16 → Spec 15.B → Endknoten-Migration → App-Freigabe; Begründungs-Block + Wer-darf-umsortieren-Klausel; reine Doku-Pflege) | [→ Archiv](sessions/archiv/2026-05-24_pflege-claude-md-pipeline-reihenfolge.md) |
| 2026-05-24 | Mini-Pflege · status.json Endknoten-Daten nachgezogen (Endknoten-Re-Docking-Werte in status.json nachgezogen; Pie regeneriert; reine Doku-Pflege) | [→ Archiv](sessions/archiv/2026-05-24_pflege-status-json-endknoten-redock.md) |
| 2026-05-24 | Mini-Pflege · Modul 16 SBKIM-Siegel Stub (Karte 16 Stub angelegt mit vier Sub-Bereichen + Pflicht-Modul-Liste-Skizze; status.json `siegelBacklog[]`; CLAUDE.md Modul-Tabelle Eintrag 16 als „Stub, Priorität hoch"; reine Doku-Pflege) | [→ Archiv](sessions/archiv/2026-05-24_pflege-modul-16-siegel-stub.md) |
| 2026-05-24 | Sichttest-Nachzug · Karte 15 Sub (e) Fremd-Lampe live grün (Klaus' Sichttest auf Sage-Page: rote Fremd-Lampe in Navleiste sichtbar + Klick öffnet Fremdzugriff-Modal mit Liste der Detektor-Ereignisse; Sichttest-Knopf in Panel 15 grün; reine Sichttest-Bestätigung) | [→ Archiv](sessions/archiv/2026-05-24_sichttest-15-fremd-lampe-gruen.md) |
| 2026-05-24 | Mini-Pflege · Sage-Page Fremd-Lampe Sichttest-Knopf (neuer Test-Bridge-Knopf in Panel 15 für die Fremd-Lampe; `tests/manual_check.html` erweitert; reine Test-UI-Pflege) | [→ Archiv](sessions/archiv/2026-05-24_pflege-fremd-lampe-test-knopf.md) |
| 2026-05-24 | Bau · 15.SW Membran Sub (e) SW-Probe-Detektor (`sbkim-sw.js` um SW-Probe-Erkennung erweitert: ungewöhnliche Fetch-Patterns vom Service-Worker werden als Fremdzugriff-Kandidat markiert; Headless-Smoke grün) | [→ Archiv](sessions/archiv/2026-05-24_bau-15sw-membran-sw-probe.md) |
| 2026-05-24 | Bau · 15 Membran Sub (e) Fremdzugriff-Detektor (Voll-Bau Sub (e): `src/modules/15_membran.js` mit `detectForeignAccess` + rote Lampe `#lamp-fremd` in Navleiste + Modal mit Fremdzugriff-Liste; Karte 15 + INTERFACES § 1 Modul 15 nachgezogen; Headless-Smoke grün) | [→ Archiv](sessions/archiv/2026-05-24_bau-15-membran-fremdzugriff.md) |
| 2026-05-24 | Spec · 15 Membran Sub (e) Fremdzugriff-Detektor (Karte 15 Sub (e) voll spec'd: Detektor-Schema + rote Lampe + Modal-Inhalt; Brief `BRIEF_BAU_15_MEMBRAN_FREMDZUGRIFF.md`; kein Modul-Code) | [→ Archiv](sessions/archiv/2026-05-24_spec-15-membran-fremdzugriff.md) |
| 2026-05-24 | Pflege · Karte 15 Hochstufung + Sub (e) (Karte 15 Priorität niedrig → hoch nach Gemini-3.5-Flash-Auslöser auf I/O 2026; neuer Sub-Bereich (e) Fremdzugriff-Detektor + Lampe; CLAUDE.md Modul-Tabelle nachgezogen; reine Doku-Pflege) | [→ Archiv](sessions/archiv/2026-05-24_pflege-modul-15-hochstufung.md) |
| 2026-05-22 | Pflege · Modul 01 Versions-Bump-Race in `openProbe` (Folge-Pflege zur Pflege 2026-05-19; `openProbe` mit Versions-Bump-Race-Fix: parallel laufende `ensureStore`-Aufrufe konnten in seltenen Fällen mit `VersionError` kollidieren — jetzt sequentialisiert via internem Queue + Single-Flight-Pattern; Headless-Smoke grün; PROTOCOL_VERSION unverändert) | [→ Archiv](sessions/archiv/2026-05-22_pflege-01-versions-bump-race.md) |
| 2026-05-21 | Sichttest-Folge · Bau Sage-Page-Refactor live (Klaus' Browser-Sichttest 2026-05-21 auf Galaxy Tab S6 DeX-Chrome: Sage-Page live grün — Module-Bento alle drei LED-Lampen je Modul rendern, Schwarz-Loch-Karte Andock-Wizard öffnet, Identität → Spore-Generierung mit lazy Modul-03-Embedding + Backup grün; PRs #127–#134 als kleine Sichttest-Nachzüge; PROTOCOL_VERSION unverändert) | [→ Archiv](sessions/archiv/2026-05-21_bau-sage-page-refactor-sichttest.md) |
| 2026-05-20 | Sichttest-Nachzug · Bau-Pipeline vollständig (Klaus' Browser-Sichttest aller Bau-Sitzungen der Multi-Identitäts-Pipeline 01.Y / 02.Y / 04.A / 04.B / 05.Y / 06.Y / 07.Y / 08.Y; alle Panel-Knöpfe der jeweiligen Module grün; PROTOCOL_VERSION/DB_VERSION/BACKUP_FORMAT_VERSION unverändert) | [→ Archiv](sessions/archiv/2026-05-20_sichttest-nachzug-bau-pipeline-vollstaendig.md) |
| 2026-05-20 | Brief · Bau-Sitzung Endknoten-Migration Multi-Identität (Brief `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` angelegt für die produktive Migration von Mein-Rezeptbuch + Mein-Mixarium auf die Multi-Identitäts-API nach Bau-Pipeline 01.Y / 02.Y / 04.A / 04.B / 05.Y / 06.Y / 07.Y / 08.Y) | (Brief im Repo: docs/sessions/BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md) |
| 2026-05-20 | Bau · 04.B `explainMatchLLM` in Modul 04 (Stufe B des Drei-Schichten-Match-Modells: optionaler LLM-Aufruf mit Cap+Needs-Vergleich; JSON-Schema-Output; User-Key-Test-Brücke (löst sich erst mit Vision-Anker 5 Identitäts-Container); Headless-Smoke grün; PROTOCOL_VERSION unverändert) | [→ Archiv](sessions/archiv/2026-05-20_bau-04b-explain-match-llm.md) |
| 2026-05-20 | Bau · 07.Y transparenter Slot-Pfad + `_sendLegacyForIdentity`-Hook (Modul 07 Apoptose um identitäts-spezifischen Slot-Pfad erweitert; `_sendLegacyForIdentity`-Hook für Single-Identitäts-Apoptose via `removeIdentity(key, {force:true})`; Headless-Smoke grün) | [→ Archiv](sessions/archiv/2026-05-20_bau-07y-transparent-slot-pfad-und-legacy-hook.md) |
| 2026-05-20 | Bau · 06.Y transparenter Slot-Pfad (Modul 06 Heterokaryose um identitäts-spezifischen Slot-Pfad erweitert: `sbkim_hetero_inbox_<key>` + `sbkim_hetero_outbox_<key>`; Receiver-Map nodeId→key; Headless-Smoke grün) | [→ Archiv](sessions/archiv/2026-05-20_bau-06y-transparent-slot-pfad.md) |
| 2026-05-20 | Bau · 05.Y transparenter Slot-Pfad (Modul 05 Anastomose um identitäts-spezifischen Slot-Pfad erweitert: `sbkim_siblings_<key>` + `sbkim_anastomosis_log_<key>` + `sbkim_legacy_inbox_<key>`; Headless-Smoke grün) | [→ Archiv](sessions/archiv/2026-05-20_bau-05y-transparent-slot-pfad.md) |
| 2026-05-20 | Bau · 08.Y slot-spezifische Outbox in Modul 08 (Bau-Sitzung; Branch `claude/bau-08y-slot-spezifische-outbox-j6mJF`; vierte Konsumenten-Bau-Sitzung der Bau-Sitzungs-Brief-Pipeline aus Brief 99; Modul 08 schreibt jetzt slot-spezifisch in `sbkim_hetero_outbox_<activeSlotKey>` und liest/schreibt `sbkim_siblings_<activeSlotKey>`; `activeSlotKey` im `init()` via `SbkimSpore.getActiveIdentityKey()` einmalig gecached (Default `"main"` als Rückwärts-Kompat); löst die in Bau-06.Y-Brief dokumentierte bekannte Limitierung auf; INTERFACES § 1 Modul 08 + Karte 08 + Panel 08 in `tests/manual_check.html` Setup-Output nachgezogen; Selbstcheck UNVERÄNDERT; `HETERO_OUTBOX_MAX_ENTRIES = 5` gilt jetzt PRO SLOT; Headless-Smoke 26/26 grün; Sichttest-Nachzug-Sitzung am 2026-05-20 als Folge; PROTOCOL_VERSION/DB_VERSION/BACKUP_FORMAT_VERSION unverändert; KEIN Eingriff in Modul-00/01/02/03/04/05/06/07-Code) | (zusammen mit [Sichttest-Nachzug](sessions/archiv/2026-05-20_bau-08y-sichttest-nachzug.md) im Archiv) |
| 2026-05-18 | Mini-Pflege · Vision-Anker M04-Erweiterung als neunter Anker (Brainstorming Paper-↔-Mycel-Brücke + Sorge ums Freigeben; PULS § Vision-Anker um neunten Anker erweitert — drei Schichten + Brücke + doppelte Spore, Stufe A lokal + Stufe B optional LLM; Anker 7 + 8 Status-Verweise ergänzt; PR-#85-Sitzungs-Eintrag auch ins Archiv; Großbrief V1-Sammelspec vorbereitet mit Scope-Erweiterung um Anker 9 / Anker 6 / Plattform-Matrix; kein Modul-Code, kein INTERFACES-Eingriff) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-vision-anker-m04-erweiterung.md) |
| 2026-05-21 | Bau · Sage-Page-Refactor — Sage als dritter Endknoten bau-fertig (Bau-Sitzung; Branch `claude/bau-sage-page-refactor`; Sage-Page lädt alle SBKIM-Module mit fail-soft init()-Kette unter IndexedDB-Suffix `sbkim_sage`; eigener Standalone-`sbkim-sw.js` Variante 3a; Schwarz-Loch-Karte öffnet beim ersten Klick einen Mini-Andock-Wizard Identität → Spore mit lazy-Modul-03-Embedding → Backup; Module-Bento mit drei LED-Lampen pro Modul Spec/Code/Sichttest; PR #125 gemerged 2026-05-21; Sichttest-Folge mit PRs #127–#134 schloss die Sichttest-Schleife) | [→ Archiv](sessions/archiv/2026-05-21_bau-sage-page-refactor.md) |
| 2026-05-18 | Mini-Pflege · Vision-Anker Multi-Identität in der IndexedDB (sechster Vision-Anker als Feature-Inversion von Lehre 1 — bewusste Persona-Trennung statt zufällige Browser-Instanzen-Trennung; PULS § Vision-Anker erweitert; kein Modul-Code, keine INTERFACES.md-Änderung) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-vision-anker-multi-identitaet.md) |
| 2026-05-19 | Bau · 04.A `matchDimensions` synchron in Modul 04 (PR #110 gemerged 2026-05-19; erste Bau-Sitzung der M04-Erweiterung aus Brief 03; additiv ohne Refactoring der bestehenden `match`/`isAboveProviderThreshold`; `matchDimensions(queryCap, queryNeeds, passageCap, passageNeeds)` synchron mit Drei-Schichten-Heuristik + `availableLanes ∈ {0,1,2}` + `bruecke:null`; `DimensionsAllNullError` sync bei allen vier null; Stufe-A-Heuristik gemäß Karte 04 (alle drei Schichten gleich dem Lane-Cosinus, echte semantische Differenzierung kommt in Stufe B via `explainMatchLLM` Bau 04.B). Smoke-Test 19/19 grün. Sichttest 2026-05-19 (Klaus, DeX-Chrome): grün geprüft. PROTOCOL_VERSION/DB_VERSION/BACKUP_FORMAT_VERSION unverändert. KEIN Modul-Code in 00/01/02/03/05/06/07/08, KEIN Schema-Eingriff, KEINE Sage-Page-Änderung) | [→ Archiv](sessions/archiv/2026-05-19_bau-04a-match-dimensions.md) |
| 2026-05-17 | Mini-Pflege · Vision-Anker Königin-Relay (Modul 13?) (PR #82, Branch `claude/pflege-vision-anker-koenigin-relay`; Klaus' Architektur-Frage „Was, wenn ich einmal einen Browser nehme und ein andermal einen anderen? Ist die Spore nur zu finden, wenn der Browser offen ist?" als vierter Vision-Anker eingetragen — „Königin-Relay" als optionales Mailbox-Modul für offline-Geschwister, privacy-wahrend (verschlüsselte Envelopes), drei Implementations-Optionen (Server/PWA-mit-Push/Eigenes-Gerät), Status reif für Spec-Diskussion nach V1. Modul-Karten/INTERFACES/status.json unangetastet) | [→ Archiv](sessions/archiv/2026-05-17_mini-pflege-vision-anker-koenigin-relay.md) |
| 2026-05-17 | Mini-Pflege · Vision-Anker (V1 / V3 / Universum) | Drei langfristige Vision-Anker (Sage als Hybrid-Knoten, Niedrigeres Onboarding, Browser-Observatorium-Universum) als neuer PULS-Block § Vision-Anker eingetragen — keine Spec, kein Bau-Code, nur Sammel-Anker für Folge-Sitzungen. Vision-Anker 1 (V1 Sage-Hybrid) wurde später (2026-05-18/19) durch die V1-Sammelspec-Kaskade Brief 01–04 realisiert. | [→ Archiv](sessions/archiv/2026-05-17_mini-pflege-vision-anker.md) |
| 2026-05-17 | Mini-Pflege · Observatorium-Lehre 8 + 8. Galaxie | Klaus' DeX-Cursor-Overlay-Befund (System-Cursor durch keine CSS-`cursor`-Property überschreibbar; sieben Workaround-Varianten alle ignoriert) als Lehre 8 in `docs/OBSERVATORIUM_BROWSER.md` eingetragen + achte Galaxie `galaxy-edgeon` (taumelnde Disk-Galaxie mit `@keyframes galaxy-precess`) als Sage-Page-Begleit-Anker. Modul-Code/INTERFACES.md/status.json unangetastet. | [→ Archiv](sessions/archiv/2026-05-17_mini-pflege-observatorium-lehre-8.md) |
| 2026-05-17 | Mini-Pflege · Live-Channel-Handshake + Browser-Observatorium | Live-Beweis Cross-Knoten-Handshake ohne localStorage-Bypass: Modul-05-v2 mit BroadcastChannel-Bridge in beiden Endknoten (Mein-Mixarium + Mein-Rezeptbuch), File-Rename als Cache-Bust. Beide Endknoten in DeX-Chrome neu angedockt mit neuen nodeIds (alte 2026-05-16-Identitäten durch IndexedDB-Verlust nicht mehr da). Erster regulärer Cross-Knoten-Handshake: `outcome:"established"`, score 0.9544261159927087 bidirektional via Auto-Fallback HTTP→Channel-Bridge. Pflege-Kette PR #65 → #70 → #71 → #72 → #73 → #74 → #75 → #76 vollständig geschlossen. Plus Browser-Observatorium-Sitzung mit Mini-Pflege auf der Sage-Page. status.json unverändert. | [→ Archiv](sessions/archiv/2026-05-17_live-channel-handshake.md) |
| 2026-05-17 | Mini-Pflege · Bau-Sichttest BroadcastChannel-Bridge grün | Folge-Eintrag zur Bau-Sitzung BroadcastChannel-Bridge (PR #75 `b8c8f41`). Klaus hat Panel 05 Knöpfe 9 / 9a / 9b / 9c im Browser durchgeklickt — alle vier grün im ersten Lauf (Termux-`python3 -m http.server 8000` auf Galaxy Tab S6 + DeX, Modell vom CDN-Fallback `cdn.jsdelivr.net` gezogen). Test 9 Channel-Pfad established score 0.8881, Test 9a HandshakeTimeoutError nach 4005 ms, Test 9b MissingToNodeIdError synchron, Test 9c Auto-Fallback HTTP-404→Channel etabliert 0.8881. Score-Stabilität bestätigt zwischen Test 9 und 9c. PROTOCOL_VERSION unverändert; status.json unverändert (Sichttest-Bestätigung, kein Score-Wechsel). | [→ Archiv](sessions/archiv/2026-05-17_mini-pflege-bau-05-sichttest-gruen.md) |
| 2026-05-17 | Bau-Sitzung Modul 05 · BroadcastChannel-Bridge implementiert | Bau-Sitzung zur Spec-Sitzung BroadcastChannel-Bridge (PR #75, `b8c8f41`). Additiver Channel-Pfad in `src/modules/05_anastomose.js` ohne Refactoring der bestehenden Pfade — zwei neue Error-Klassen (`InvalidTransportError` + `MissingToNodeIdError`), drei Konstanten (`ALLOWED_TRANSPORTS`, `BROADCAST_CHANNEL_NAME`, `REPLY_CHANNEL_PREFIX`), Closure-Helfer `setupBroadcastChannelBridge()` + `postChannelEnvelope()` + `sendViaChannel()` + `parseTransport()` + `shouldAutoFallback()`. `handshake()` um optionalen `options.transport`-Parameter mit Default `"auto"` erweitert; Auto-Fallback bei HTTP-Defekt-Signalen (4xx/5xx, non-JSON, Schema-Lücke, outcome unklar). Channel-Pfad: BroadcastChannel('sbkim') als Main-Channel, Reply-Channel via `nonce`-Ableitung, Receiver-Filter `toNodeId === own.nodeId && fromNodeId !== own.nodeId`, Cleanup in finally. HandshakeRequest/Response-Schema unverändert. Panel 05 in `tests/manual_check.html` um vier Knöpfe 9 / 9a / 9b / 9c erweitert. Karte 09 § Schritt 4 um Andock-Hinweis „Beide Tabs offen halten" erweitert. `node --check` grün, Smoke-Test im Node-VM-Kontext alle fünf Proben grün. PROTOCOL_VERSION bleibt `"0.1"`, status.json unverändert. | [→ Archiv](sessions/archiv/2026-05-17_bau-05-broadcastchannel-bridge.md) |
| 2026-05-19 | Pflege · Modul 01 `init()` versions-fail-soft (PR #107 gemerged 2026-05-19, `main` `b9e1a8f`; Sichttest-Nachzug PR #108, `main` `af4fdff`). Folge-Pflege auf Klaus' Bau-02.Y-Sichttest. DB_VERSION ist jetzt Mindest-Schema-Version, nicht „immer-anstreben". init() öffnet die DB zweiphasig (Probe + Entscheidung), respektiert existing > DB_VERSION ohne VersionError. Bei fehlendem Pflicht-Store: StorageOpenError mit Liste. Vier neue Closure-Helper (openProbe / checkRequiredStores / openExact / deleteDb); `_meta.dbVersionPolicy = "fail-soft-min-schema"` als Read-Anker. Karte 01 § Versionsmigration neuer Sub-Block + § Risiken zwei neue Punkte + § Manueller Test Knopf 9 + § Bauzustand. **Sichttest 2026-05-19 (Klaus, DeX-Chrome): live grün** — `db_version_vor: 16 → nach_bump: 17`, Bonus-Probe Panel-02-Knöpfe 8/9/10 alle grün ohne Cleanup-Workaround. Headless-Smoke 8/8 grün, Bau-02.Y-Regression 33/33 weiterhin grün. Tafel-Evolutions-konform (PR #105). PROTOCOL_VERSION/DB_VERSION/BACKUP_FORMAT_VERSION unverändert | [→ Archiv](sessions/archiv/2026-05-19_pflege-01-init-fail-soft.md) |
| 2026-05-19 | Bau · 02.Y Multi-Identitäts-API + Backup-Schema-Bump in Modul 02 (PR #104 gemerged 2026-05-19, `main` `63e8fd1`; zweite Bau-Sitzung der Pipeline aus Brief 99 — Klaus' Wahl „logische Reihenfolge — Infrastruktur weiter". Modul 02 hat fünf neue/erweiterte Funktionen (`setActiveIdentity` / `getActiveIdentityKey` / `listIdentities` / `removeIdentity` plus optionaler `key`-Parameter auf `getOrCreateIdentity` / `generateOwnSpore` / `getOwnSpore`); identitäts-spezifische Stores via `SbkimStorage.ensureStore` aus Bau 01.Y. **`BACKUP_FORMAT_VERSION` 1 → 2** (Multi-Identitäts-Backup „kompletter Rucksack"); alte v=1-Backups bleiben lesbar. `sbkim_meta` lazy via `ensureStore` (KEIN Modul-01-Eingriff). KEINE Modul-05/06/07-Änderung. Drei neue Panel-02-Knöpfe + Mini-Fix Rollback-Pfad (Reihenfolge `ensureIdentityStores` vor `put(sbkim_keys)`). Sichttest 2026-05-19 (Klaus, DeX-Chrome): 3/3 grün nach Mini-Fix + Cleanup-Workaround. Headless-Smoke 33/33 grün. Klaus' Befund: zweiter Lauf gelang erst nach Panel-01-„Storage init"-Klick — Folge-Pflege Modul 01 init() versions-fail-soft bestätigt. PROTOCOL_VERSION/DB_VERSION unverändert) | [→ Archiv](sessions/archiv/2026-05-19_bau-02y-multi-identitaet.md) |
| 2026-05-19 | Meta-Pflege · Tafel-Evolutions-Klausel + Modul-01-init-Folge-Pipeline (PR #105 gemerged 2026-05-19, `main` `60ea3f6`; nach Klaus' Anweisung: heilige Tafeln aufheben wenn alte Regel neuer notwendiger Arbeit widerspricht — Klaus EXPLIZIT auf Anpassungs-Bedarf hinweisen statt stoisch befolgen oder stillschweigend umgehen. **CLAUDE.md § Heilige Tafeln** um Sub-Sektion „Tafel-Evolutions-Klausel (Pflege 2026-05-19)" erweitert: drei Disziplin-Regeln, Bezeichnungs-Konvention „Diese-Sitzung-nicht"-Tafeln vs. absolute Verbote, Bezugs-Beispiel Modul-01-init-Befund. **INTERFACES.md § 9.5** um Folge-Befund 2026-05-19 erweitert. **PULS § Vision-Anker 6 § Status** um Folge-Pflege-Block. Ältester Sitzungs-Eintrag im selben PR ins Archiv ausgelagert; PULS unter 3000-Zeilen-Schutz-Klausel. PROTOCOL_VERSION/DB_VERSION/BACKUP_FORMAT_VERSION unverändert) | [→ Archiv](sessions/archiv/2026-05-19_pflege-tafel-evolution-modul01-pipeline.md) |
| 2026-05-19 | Brief · Pflege Modul 01 `init()` versions-fail-soft angelegt (PR #106 gemerged 2026-05-19, `main` `42a04e0`; Brief BAU_PFLEGE_01_INIT_FAIL_SOFT.md für die folgende Pflege-Sitzung; sechs Punkte a-f spezifiziert; Heilige Tafeln scope-genau; Lösungs-Skizze openProbe(name); Stolperfallen dokumentiert; Zeitschätzung 2-3 h) | (Brief im Repo: docs/sessions/BRIEF_BAU_PFLEGE_01_INIT_FAIL_SOFT.md) |
| 2026-05-18 | Mini-Pflege · Sonnen-Galaxie Station 5 (DE-Paper) erweitert (PR; deutsches SBKIM-Paper als HTML als fünfte Station eingefügt; Galaxie-Form `galaxy-quasar` mit Lichtstrahl-Beams; Bahn-Ellipse skaliert auf fünf Phasen à 72°; `STATIONS_DATA[4]` mit 4 Erzähl-Absätzen; Privatheits-Klausel eingehalten) | [→ Archiv](sessions/archiv/2026-05-18_pflege-sonnen-station-5-de-paper.md) |
| 2026-05-19 | Bau · 01.Y `ensureStore` in Modul 01 (PR #102 gemerged 2026-05-19, `main` `8a07ed5`; INTERFACES § 1 Modul 01 Bietet-Block um `ensureStore(storeName: string) → Promise<void>` als achte Funktion erweitert mit voller Garantien-Erklärung — Idempotenz, synchroner Pattern-Check `^sbkim_[a-z0-9_]+$` (`InvalidStoreNameError`), async `EnsureStoreError` mit `cause`-Property aus IDBOpenDBRequest, kein `UnknownStoreError`, strikt additiv, Aufrufer trägt Identitäts-Konvention; Storage-Block `DB-Version` 3 → 4 mit `STORES_V4 = []`-Begründung; Selbstcheck auf acht Funktionen; Geprüft-Zeile um 2026-05-19; § 9.5 Stand-Hinweis am Ende; § 10 Änderungsprotokoll-Zeile. **Code in `src/modules/01_storage.js`** additiv: `DB_VERSION = 4`; modul-lokale `STORE_NAME_PATTERN`; Factory-Funktionen `InvalidStoreNameError` + `EnsureStoreError`; neuer Modul-State `currentDb` als sync-lesbarer Anker; Helper `attachVersionChangeHandler(db)` (fail-soft `db.close()` + Cache-Invalidierung); neue Funktion `ensureStore(name)` mit synchronem Pattern-Check + Idempotenz-Check + Versions-Bump-Choreografie via `db.version + 1` + `KNOWN_STORES.push` zur Laufzeit; `_meta.dbVersion` als Getter (Live-Zustand), `_meta.dbVersionInitial` als Build-Konstante, `_meta.knownStores` als Getter (Snapshot pro Aufruf), `_meta.ensureStorePattern` als Read-Anker. **Karte 01** nachgezogen (§ Schnittstelle / § Stores / § Versionsmigration / § Konfigurationswerte / § Fehlerverhalten / § Risiken / § Manueller Test / § Bauzustand). **Panel 01 in `tests/manual_check.html`** drei neue Knöpfe (Knopf 6 happy-path, Knopf 7 Idempotenz, Knopf 8 Pattern-Verstoß). **Sichttest 2026-05-19 (Klaus, DeX-Chrome auf Galaxy Tab S6, Termux-`python3 -m http.server 8000`-Setup): 3/3 grün** — Knopf 6 `db_version` 4 → 5, Idempotenz greift (Knopf 7 5/5/5), Knopf 8 `InvalidStoreNameError` synchron geworfen. **KEINE Modul-02/05/06/07-Änderung** (transparenter Slot-Pfad kommt in 02.Y / 05.Y / 06.Y / 07.Y), keine identitäts-spezifischen Stores angelegt (Aufrufer-Pflicht). **`PROTOCOL_VERSION` bleibt `"0.1"`, `BACKUP_FORMAT_VERSION` bleibt `1` (Bump 1→2 erst in Bau 02.Y), `DB_VERSION` von 3 auf 4**. `node --check` grün; Cleanup-Hinweis: Test-Stores `sbkim_test_*` bleiben in der DB, Klaus löscht via DevTools manuell — Modul 01 bietet keinen `dropStore`-Pfad) | [→ Archiv](sessions/archiv/2026-05-19_bau-01y-ensure-store.md) |
| 2026-05-19 | Abschluss · V1-Sammelspec-Kaskade (Brief 99 · PR #100 gemerged 2026-05-19, `main` `80994fd`; schließt die vier Strang-Etappen Brief 01 V1-Sage-Hybrid PR #96 + Brief 02 Plattform-Matrix PR #97 + Brief 03 M04-Erweiterung PR #98 + Brief 04 Multi-Identität PR #99; KEINE neuen §-Inhalte in dieser Abschluss-Sitzung — INTERFACES § 10 Änderungsprotokoll um eine Abschluss-Zeile „Sammelspec-Abschluss (Brief 99)" erweitert; **PROTOCOL_VERSION bleibt `"0.1"`** + **BACKUP_FORMAT_VERSION bleibt `1`** als Snapshot-Stand verbindlich dokumentiert; Bau-Sitzungs-Brief-Pipeline für die nächste Welle benannt (KEINE Spec-Kaskade — jeder Bau eigene Bau-Sitzung mit eigenem PR; Reihenfolge ist Klaus' Entscheidung): Bau Sage-Page-Refactor → Bau 01.Y `ensureStore` in Modul 01 → Bau 02.Y Multi-Identitäts-API + Backup-Schema-Bump in Modul 02 → Bau 04.A Stufe A erweitert in Modul 04 → Bau 04.B Stufe B in Modul 04 → Bau 05.Y / 06.Y / 07.Y transparenter Slot-Pfad → Bau Multi-Identitäts-Migration der Endknoten; Konsistenz-Prüfung VOR dem Eingriff (Kaskaden-Konvention 5) abgehakt — alle vier Strang-PRs gemerged, INTERFACES § 0 / § 1 / § 2 / § 6 / § 7 / § 8 / § 9 / § 10 auf Brief-04-Stand geprüft, PROTOCOL_VERSION-Status-Snapshot `"0.1"`; KEIN Modul-Code, KEINE Sage-Page-Änderung, KEINE CLAUDE.md-/Karte-09-/`status.json`-Änderung — Brief 99 ist Doku-Pflege; Vision-Anker 1 / 6 / 9 § Status nachgezogen auf „Strang X realisiert + Sammelspec-Abschluss (Brief 99) abgeschlossen") | [→ Archiv](sessions/archiv/2026-05-19_abschluss-v1-sammelspec.md) |
| 2026-05-19 | Spec · Multi-Identität — Strang 3 (Brief 04) der V1-Sammelspec-Kaskade (Brief 04 · PR #99 gemerged 2026-05-19, `main` `59e3998`; INTERFACES § 1 Modul 02 um fünf neue / erweiterte API-Funktionen erweitert (`getOrCreateIdentity(key?)`, `setActiveIdentity(key)`, `getActiveIdentityKey()`, `listIdentities()`, `removeIdentity(key, options?)`), Singleton-Klausel durch Identitäts-Slot-Vertrag ersetzt (Default-Slot „main" verbindlich, beliebig viele weitere Slots, `sbkim_meta["active-identity"]` als String-Marker), Selbstcheck auf zwölf Funktionen erweitert, Fehlerverhalten um `UnknownIdentityError` + `RemoveActiveIdentityError` erweitert; § 1 Modul 05 / 06 / 07 auf identitäts-spezifische Store-Pattern (`sbkim_siblings_<key>`, `sbkim_anastomosis_log_<key>`, `sbkim_legacy_inbox_<key>`, `sbkim_hetero_inbox_<key>`, `sbkim_hetero_outbox_<key>`) umgestellt mit Identitäts-Cache- und Receiver-Map-nodeId→key-Konvention; § 2 Spore-JSON Multi-Identitäts-Hinweis-Block (Strategie A gewählt — nur aktive Identität in `spore.json`, `PROTOCOL_VERSION` bleibt `"0.1"`; Strategie B NICHT gewählt — würde auf `"0.2"` bumpen); § 9 Identitäts-Map als neue verbindliche Spec-Klausel mit sieben Sub-§ (9.1 Slot-Schema, 9.2 identitäts-spezifische Stores + Persona-Isolation, 9.3 active-identity-Marker, 9.4 Receiver-Pfad, 9.5 Migrations-Strategie Option A/B, 9.6 Trade-off-Klausel, 9.7 Verbindung zur M04-Erweiterung); § 9 Änderungsprotokoll auf § 10 nachnummeriert; Apoptose-Granularität entschieden — `confirmSelfApoptose` global, `removeIdentity(key, {force:true})` ist Single-Identitäts-Apoptose mit Hook `_sendLegacyForIdentity` in Modul 07; Karten 02 / 05 / 06 / 07 nachgezogen; `PROTOCOL_VERSION` bleibt `"0.1"`, `BACKUP_FORMAT_VERSION` bleibt `1` (Bump 1→2 in Bau-Folge-Sitzung 02.Y); BRIEF_99 `docs/sessions/BRIEF_99_SAMMELSPEC_ABSCHLUSS.md` angelegt; kein Modul-Code, keine Sage-Page-Änderung) | [→ Archiv](sessions/archiv/2026-05-19_spec-multi-identitaet.md) |
| 2026-05-19 | Spec · M04-Erweiterung — Strang 2 (Brief 03) der V1-Sammelspec-Kaskade (Brief 03 · PR #98 gemerged 2026-05-19, `main` `27d6a19`; INTERFACES § 0 um drei §0-Konstanten erweitert (`SCHICHT_MIN_MATCH=0.60`, `STUFE_B_DEFAULT_MODEL="claude-sonnet-4"`, `STUFE_B_MAX_TOKENS=1024`), § 1 Modul 02 Bietet-Block-Spore-Schema-Erweiterungs-Hinweis (`embeddingCapabilities` Alias + `embeddingNeeds` neu), § 1 Modul 04 um zwei neue Funktionen + vier neue Sub-Blöcke (Drei-Schichten-Modell mit Mittelwert-vs-Min-Begründung, Brücken-Feld-Spec mit BridgeProposal, Schwellen-Vertrag mit 5 Auswertungs-Regeln, Stufe-B-Vertrag mit JSON-Schema und Beispiel-Output mit zwei Personas) + Fehlerverhalten-Tabelle um sieben neue Zeilen + Garantien um vier neue Punkte erweitert, § 2 Spore-JSON Optionale Felder um die zwei neuen Vektor-Felder erweitert, § 7 LLM-Stufe-B-Ehrlichkeits-Klausel (vier verbindliche Sätze: Stufe B opt-in, Stufe A rückgrat-tragend lokal, kein Knoten zu Drittanbieter gezwungen, Knoten ohne Stufe B = vollwertige Netz-Teilnehmer), § 8 Anti-Missbrauch-Klausel (drei verbindliche Sätze: Brücken-Vorschlag lokal, `candidateScope:"netz"` formal nicht aktivierbar bis Anker 10-12, Modul 06 filtert Outbox-Einträge), § 7 Änderungsprotokoll auf § 9 nachnummeriert; Karten 02 (M04-Sub-Block mit Migrations-Tabelle vier Spore-Zustände + Bauzustand-Hinweis für Bau-Folge-Sitzung) / 04 (vier neue Sub-Blöcke parallel zu INTERFACES + Stamm/Gast-Block unverändert) / 06 (Brücken-Vorschlag-Eintrags-Typ-Sub-Block + vier-stufige Filter-Logik) nachgezogen; PROTOCOL_VERSION bleibt `"0.1"` (additive Felder + additive Funktionen, kein altes Feld zur Pflicht erhoben); kein Modul-Code in `src/`, keine Sage-Page-Änderung; Brief 04 `docs/sessions/BRIEF_04_multi_identitaet.md` angelegt) | [→ Archiv](sessions/archiv/2026-05-19_spec-m04-erweiterung.md) |
| 2026-05-18 | Spec · Plattform-Matrix — Strang 2 der V1-Sammelspec-Kaskade (Brief 02 · PR #97 gemerged — `main` `69077db`; INTERFACES § 6.2 Plattform-Matrix mit fünf Profilen × sechs Spalten + Sage-Anmerkung, § 6.3 Plattform-Ehrlichkeits-Klausel als verbindliche Spec-Klausel mit Begründung aus Klaus' Lehre 1, § 6.4 Vision-Bezüge als Querverweis-Matrix mit sieben Ankern; § 6.1 Plattform-Matrix-Stub auf Verweis umgeschrieben; Anti-Vorgriff auf V4 / V5 / V7 / V8 / V9 / V6 streng eingehalten; `PROTOCOL_VERSION` bleibt `"0.1"`; CLAUDE.md / Karte 09 / `status.json` unangetastet — Brief 02 lebt rein in INTERFACES; Brief 03 `docs/sessions/BRIEF_03_m04_erweiterung.md` angelegt) | [→ Archiv](sessions/archiv/2026-05-18_spec-plattform-matrix.md) |
| 2026-05-18 | Spec · V1 Sage-Hybrid — Strang 1 der V1-Sammelspec-Kaskade (Brief 01 · PR #96 gemerged — `main` `a3e0072`; INTERFACES § 6 Endknoten-Liste neu mit Sage als drittem Endknoten + § 6.1 Sage-Page-Architektur mit IndexedDB-Suffix `sbkim_sage` / App-SW Variante 3a / volle init()-Kette / Andock-Geste an Schwarz-Loch-Karte; CLAUDE.md auf „Hub und Knoten zugleich"; Karte 09 § Schritt 1 erweitert; `status.json` § endknoten um sage-Eintrag mit `pingStatus:"pending-first-andock"`; Domäne „Mycel-Bibliothek" gewählt; `PROTOCOL_VERSION` bleibt `"0.1"`; Sage-Page-Refactor folgt als Bau-Sitzung in BRIEF_99-Liste; Brief 02 `docs/sessions/BRIEF_02_plattform_matrix.md` angelegt) | [→ Archiv](sessions/archiv/2026-05-18_spec-v1-sage-hybrid.md) |
| 2026-05-18 | Meta-Pflege · V1-Sammelspec als Brief-Kaskade sequenziert (PR #93 + Konvention-6-Refactor PR #95 — sechs heilige Tafeln: ein Strang = ein PR, Brief als Datei im Repo, einheitlicher Bauplan, BRIEF_99-Abschluss, verteilte Konsistenz-Prüfung, Auslöser-Befehl im Chat statt Brief-Volltext; Strang-Reihenfolge Brief 01 V1-Sage-Hybrid → Brief 02 Plattform-Matrix → Brief 03 M04-Erweiterung → Brief 04 Multi-Identität → BRIEF_99-Abschluss; Brief 01 `docs/sessions/BRIEF_01_v1_sage_hybrid.md` als erste Brief-Datei angelegt; PROTOCOL_VERSION bleibt `"0.1"` solange Stränge additiv; kein Modul-Code, kein INTERFACES-Eingriff in der Meta-Pflege selbst) | [→ Archiv](sessions/archiv/2026-05-18_meta-pflege-v1-sammelspec-kaskade.md) |
| 2026-05-18 | Hauptsitzung · Modul 15 Membran — Backlog-Stub angelegt (KI-Browser-Schnittstelle + App-zu-App-Brücke; vier Sub-Bereiche a/b Pflicht, c später, d nur Verweis; status.json `membranBacklog[]`, scripts/update_puls_pie.py mit-zählend, PULS-Schnellüberblick + neue Sektion „Membran-Backlog", CLAUDE.md-Modul-Tabelle erweitert + Karte 14 nachgeholt, INTERFACES.md Block nach Modul 09, Sage-Page Karten 4/13/14 + FALLBACK_STATUS; Vokabular „Cells" als Mycel-Anker = Zellmembran) | [→ Archiv](sessions/archiv/2026-05-18_haupt-15-membran-stub.md) |
| 2026-05-18 | Mini-Pflege · Sonnen-Galaxie Stationen 1–3 inhaltlich gefüllt (PR #92 — drei Erzähl-Texte je 4 Absätze, basierend auf Hero-Claim/CLAUDE.md/PULS § Anker 9; `openStationModal()` jetzt 1:1 wie `openUniverseModal()` mit `|`-Splitting + Markdown-Parser; Placeholder-Hint-Logik auf expliziten `s.placeholder`-Flag umgestellt; Privatheits-Klausel eingehalten) | [→ Archiv](sessions/archiv/2026-05-18_pflege-sonnen-stationen-erzaehl-texte.md) |
| 2026-05-18 | Bau-Sitzung · Vision-Anker 10 Sonnen-Galaxie · Sage-Geschichts-Galerie (PR #90 — alle sieben Eingriffe aus PULS § Anker 10 § Architektur-Skizze additiv in `index.html` umgesetzt: CSS Sonnen-Karte mit Korona/Disk/12-Sommersprossen, CSS Geschichts-Galerie-Screen mit `#02020c`-BG und warm-goldenen Nebeln, HTML Sonnen-Karte vor `.card.reading`, HTML `#screen-sonnen` nach Observatorium, `SCREENS`-Array, `goScreen()` + `applyHashScreen()`, JS-Block mit `STATIONS_DATA` + `setupSonnenGalaxie()` 1:1 wie Observatorium für Stars/Maus/Komet-Schweif/Wake-Boost; Optik-Korrekturen mid-PR Klaus eingearbeitet — Kern verschwommen, 12 wabernde Sommersprossen statt 3 großer Flecken, dunkler statt brauner Hintergrund, Ring dreht sich nicht mehr sondern pulst nur bei Hover; `docs/papers/README.md` angelegt; Privatheits-Klausel eingehalten) | [→ Archiv](sessions/archiv/2026-05-18_bau-vision-10-sonnen-galaxie.md) |
| 2026-05-18 | Mini-Pflege · Vision-Anker Sonnen-Galaxie als zehnter Anker (Geschichts-Galerie · PR #88 — Anker 10 in PULS § Vision-Anker eingefügt, mid-Pflege re-gerahmt von „Papers-Bibliothek" auf „Sage-Geschichts-Galerie"; heilige Privatheits-Klausel „Everlast GmbH NICHT erwähnen"; `docs/papers/sbkim-paper-en.html` als dokumentengestützte Station 4 eingecheckt; Brief für Bau-Sitzung in `docs/sessions/BRIEF_BAU_SONNEN_GALAXIE.md` abgelegt und auf Geschichts-Galerie umgeschrieben; CSS-Probelauf testweise eingefügt und disziplin-konform zurückgerollt) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-vision-10-sonnen-galaxie.md) |
| 2026-05-18 | Mini-Pflege · PULS-Auslagerung (8 ältere Sitzungs-Einträge aus dem Body in den Archiv-Index ausgelagert; Doppelung Body↔Index beseitigt; PULS 3256 → 2337 Zeilen netto −919; Konvention pro Sitzung wieder angewandt; reine Doku-Pflege, kein Modul-Code, kein `update_puls_pie.py`-Aufruf) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-puls-auslagerung.md) |
| 2026-05-18 | Mini-Pflege · Vision-Anker Mini-Browser (Tauri-App) als achter Anker (PR #85 — eigener achter Anker für die dedizierte Desktop-App; Konzept Tauri-Stack ~10-30 MB, eigene IndexedDB im App-Daten-Verzeichnis, Tray-Icon-Modus für Hintergrund-Empfang, Doppelklick-Installer .msi/.dmg/.AppImage, Auto-Update via Tauri-Updater; Verbindungen zu V2-Pfad-3 / V4 Königin-Hintergrund / V5 Backup-Datei / V6 Identitäts-Wechsler im Tray / V7 gleiche Modul-13-Bridge; Abgrenzung zu V7 Extension; Desktop-only — Mobile/DeX außen vor; PR-#84-Sitzungs-Eintrag dort ins Archiv ausgelagert) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-vision-anker-mini-browser.md) |
| 2026-05-18 | Mini-Pflege · Vision-Anker Extension („Lampe in der Toolbar") + Mini-Browser-Konkretisierung Anker 2 Pfad 3 (PR #84 — siebter Vision-Anker; Manifest V3, Modul-13-Bridge, Plattform-Tabelle Desktop ja / Mobile nein, drei gleichwertige Onboarding-Pfade; Mini-Browser-Konkretisierung später per Folge-Pflege als eigener Anker 8 vertieft) | [→ Archiv](sessions/archiv/2026-05-18_mini-pflege-vision-anker-extension.md) |
| 2026-05-17 | Spec · Modul 05 BroadcastChannel-Bridge als same-origin Fallback (additiver Transport additiv zum HTTP-Pfad; `handshake(...)` um optionalen `options.transport`-Parameter erweitert mit Default `"auto"`; Wrapper-Envelope mit `replyChannelName` aus nonce; `BroadcastChannel('sbkim')` als gemeinsamer Channel pro Origin; `toNodeId` Pflicht im Channel-Pfad; Receiver-Tab muss offen sein, kein Wake-Lock; E1–E7-Entscheidungstabelle mit Begründungen; HandshakeRequest/Response-Schema unverändert; `PROTOCOL_VERSION` bleibt `"0.1"`; KEIN Code, KEIN Eingriff in Karte 09 — Bau-Sitzung folgt) | [→ Archiv](sessions/archiv/2026-05-17_spec-05-broadcastchannel-bridge.md) |
| 2026-05-17 | Pflege · Modul 05/SW Scope-Fix `isOwnEndpoint` (`sbkim-sw.js` `isPathSuffix` durch scope-bewusste `isOwnEndpoint` ersetzt — leitet erwarteten Pfad aus `self.registration.scope` ab, strikte Gleichheit; behebt falsch-positiven Cross-Scope-Intercept; Variante 3c bewusst nicht abgedeckt; Same-origin cross-PWA via SW-Bridge bleibt konzeptuell unmöglich, Folge-Spec Modul 05 BroadcastChannel-Bridge empfohlen; Klaus muss `sbkim-sw.js` mit Cache-Bust in beide Endknoten nachziehen) | [→ Archiv](sessions/archiv/2026-05-17_pflege-sw-isPathSuffix-scope-fix.md) |
| 2026-05-17 | Test-Erkenntnis · A/B-Test PR #70 + Architekturfund `isPathSuffix` scope-unbewusst (kein PR; Befund: PR #70's `includeUncontrolled:false`-Fix korrekt für sein Szenario, aber irrelevant für same-origin cross-PWA, weil Sender-SW vor Receiver-SW intercepted; voller Cache-Eskalations-Trace inkl. File-Rename + chrome://serviceworker-internals/) | [→ Archiv](sessions/archiv/2026-05-17_pflege-sw-isPathSuffix-scope-fund.md) |
| 2026-05-17 | Pflege · Modul 05/SW Phantom-Clients-Fix (`sbkim-sw.js` `clients.matchAll` von `includeUncontrolled:true` auf `false` umgestellt + neue Loop-Logik „alle controlled Clients der Reihe nach, erster der nicht ‚toNodeId stimmt nicht‘ sagt gewinnt"; behebt den SW-Bridge-Phantom-Cache-Bug aus Cross-Knoten-Handshake-Sitzung; Klaus muss neue `sbkim-sw.js` in beide Endknoten-Repos kopieren + pushen) | [→ Archiv](sessions/archiv/2026-05-17_pflege-sw-phantom-clients-fix.md) |
| 2026-05-17 | Mini-Pflege · Score-Realität — Module 03/05/09 auf `fertig` hochgestuft (Live-Beweis Cross-Knoten-Handshake 2026-05-16); Endknoten-`pingStatus`-Bonus aktiviert (`live-direct` zählt 15 statt 8); Demo-Ring auf zwei Bögen umgestellt (grün-schimmernd wächst auf 85 %, bunt schrumpft auf 15 %); update_puls_pie.py aufgerufen | [→ Archiv](sessions/archiv/2026-05-17_pflege-score-realitaet.md) |
| 2026-05-17 | Mini-Pflege · Rechtschreibung „Protokoll" mit zwei L (deutsches Wort) — Eigenname „Sage-Protokol" (englisch) bleibt; `Mycel-Protokoll` + generisches `Protokoll` (Footer-Label, Card-Tag, Markdown) korrigiert; 7 Dateien; Repo-URLs unverändert; KEIN Modul-Code-Eingriff | [→ Archiv](sessions/archiv/2026-05-17_pflege-rechtschreibung-protokoll.md) |
| 2026-05-17 | Mini-Pflege · Sage-Page Live-Status für Topologie + Lebenszyklus (`isNextUp()`-Vakuum-Falle gefixt — nur Module mit `score:"spec"\|"werkstatt"` zählen als nextup; neue `renderCyclePhases()`-Funktion bindet Phase-Pills an Modul-02/03/05/04-Live-Status; automatisch sichtbar bei künftigen Modul-Status-Änderungen in `status.json`) | [→ Archiv](sessions/archiv/2026-05-17_pflege-sage-page-live-status.md) |
| 2026-05-16 | Live-Andock · Cross-Knoten-Handshake etabliert (`outcome:"established"` zwischen Mein-Mixarium `7xf0tt33_…` und Mein-Rezeptbuch `RHhposP0…`; Origin-Kollision via dbSuffix aufgelöst; Modul 01 in Endknoten nachgezogen; PR #238-Schaden in Mein-Rezeptbuch-`index.html` repariert; Match-Score Cocktails↔Kochrezepte ≥ 0.8; SW-Bridge-Phantom-Cache-Bug umgangen via direktem `receiveHandshake`-Aufruf, Folge-Pflege offen) | [→ Archiv](sessions/archiv/2026-05-16_cross-knoten-handshake-etabliert.md) |
| 2026-05-16 | Pflege · Sage-Page Vollumbau / Redesign (Geist-Typografie, Force-Graph-Topologie ersetzt Pie-Doppelung, Lesematerial-Karte, Sichtbarkeits-Lampen-Demo-Anker, scroll-aware Lebenszyklus, neue Pflege-Konvention `docs/sage_page_pflege.md`) | [→ Archiv](sessions/archiv/2026-05-16_pflege-sage-page-redesign.md) |
| 2026-05-16 | Mini-Pflege · Test-Panel Knopf-7-pendingBackup-Reset (Reset-Zeile aus Handler-Anfang in `tests/manual_check.html` entfernt, `pendingBackup = null` jetzt direkt vor `importBackup`-Aufruf nach erfolgreicher File-Wahl; File-Picker-Cancel löst keine State-Änderung mehr aus, Stash überlebt doppelten Knopf-7-Klick ohne File-Wahl; KEIN Modul-Code-Eingriff, KEIN INTERFACES.md-Eingriff, KEIN Score-Wechsel) | [→ Archiv](sessions/archiv/2026-05-16_pflege-test-panel-knopf-7-pendingBackup.md) |
| 2026-05-16 | Pflege · Phase-1 Sichttest-Resultate Karten 02/06/01 (Klaus' Sichttest 2026-05-16: Bau-02.X-Knöpfe 6/7/7b grün + Panel 06 rasch grob + Panel 01 Knopf 5 `_meta.storagePersisted: true` in Karten 02/06/01 § Bauzustand + PULS Schnellüberblick nachgezogen; Test-Panel-UX-Befund Knopf 7 pendingBackup-Stash-Reset offen als Mini-Pflege) | [→ Archiv](sessions/archiv/2026-05-16_pflege-phase1-sichttest-karten-02-06-01.md) |
| 2026-05-16 | Pflege · Persistenz-Strategie verbinden (Identitäts-Persistenz Stufe 3 — Modul 00 „Backup empfohlen"-Tipp-Zeile bei `storagePersisted === false` ODER Quota-Warn; `getStatusSnapshot()` um `storagePersisted` erweitert, kein Direkt-Aufruf von Modul 02; alle drei Stufen final gelöst) | [→ Archiv](sessions/archiv/2026-05-16_pflege-persistenz-strategie-verbinden.md) |
| 2026-05-16 | Bau · Modul 02 Backup-Export Code-Stub (Bau 02.X — `exportBackup`/`importBackup` additiv in `src/modules/02_spore.js`, fünf Error-Klassen, drei Helper-Reuse-Entscheidungen, drei Panel-02-Knöpfe; Identitäts-Persistenz Stufe (2) damit gelöst) | [→ Archiv](sessions/archiv/2026-05-16_bau-02x-backup-export.md) |
| 2026-05-16 | Spec · Modul 02 Backup-Export (Identitäts-Persistenz Stufe 2 — `exportBackup`/`importBackup` passwort-verschlüsselt, PBKDF2 600 k + AES-GCM-256, drei §0-Konstanten, fünf neue Error-Klassen; Bau-Sitzung 02.X folgt) | [→ Archiv](sessions/archiv/2026-05-16_spec-02-backup-export.md) |
| 2026-05-16 | Pflege · Storage-Persist (Identitäts-Persistenz Stufe 1, `navigator.storage.persist()` fail-soft im Init-Pfad von Modul 01) | [→ Archiv](sessions/archiv/2026-05-16_pflege-01-storage-persist.md) |
| 2026-05-16 | Pflege · Karten 01 + 09 PWA-Suffix (IndexedDB-Origin-Kollision gelöst durch `SbkimStorage.init({dbSuffix})`) | [→ Archiv](sessions/archiv/2026-05-16_pflege-pwa-suffix-karten-01-09.md) |
| 2026-05-16 | Bau · 09 Iteration 3 — Mein-Rezeptbuch live angedockt + Architektur-Lücke entdeckt | [→ Archiv](sessions/archiv/2026-05-16_andock-mein-rezeptbuch-iteration-3-live.md) |
| 2026-05-16 | Bau · 09 Iteration 3 — Mein-Mixarium live angedockt (status.json + PULS) | [→ Archiv](sessions/archiv/2026-05-16_andock-mein-mixarium-iteration-3-live.md) |
| 2026-05-15 | Bau · Stamm/Gast-Durchreichung in `generateOwnSpore` (Folge-Bau, Modul 02) | [→ Archiv](sessions/archiv/2026-05-15_bau-02-stamm-gast-felder-durchreichung.md) |
| 2026-05-15 | Spec · Stamm/Gast-Felder in Spore-JSON (additiv, kein Hauptversions-Sprung) | [→ Archiv](sessions/archiv/2026-05-15_spec-stamm-gast-spore-felder.md) |
| 2026-05-15 | Bau · Live Andock Iteration 2 — Eruda in beiden Endknoten + Architektur-Konzept Stamm/Gast | [→ Archiv](sessions/archiv/2026-05-15_live-andock-eruda-stamm-gast.md) |
| 2026-05-15 | Pflege · Karte 09 App-SW-Koexistenz + Tablet-Sichtkontrolle (Variante 3c + Eruda-Block) | [→ Archiv](sessions/archiv/2026-05-15_pflege-karte-09-app-sw-tablet.md) |
| 2026-05-15 | Pflege · Sichttest-Resultate (Sage-Page mehrschichtig + Panel 08 — beide grün) | [→ Archiv](sessions/archiv/2026-05-15_pflege-sichttest-resultate.md) |
| 2026-05-15 | Pflege · PULS-Archivierung (4758 → 426 Zeilen, Sitzungs-Einträge in Archiv-Index, Konvention für Folgesitzungen) | [→ Archiv](sessions/archiv/2026-05-15_pflege-puls-archivierung.md) |
| 2026-05-15 | Pflege · Sage-Page Lebenszyklus mehrschichtig (Phase-4-Fix + Schicht „Knoten-Leben" + Klick-Lernpfad + reichere Animationen) | [→ Archiv](sessions/archiv/2026-05-15_pflege-sage-page-lebenszyklus-mehrschichtig.md) |
| 2026-05-15 | Bau 08 · Modul 08 UI-Demo (Endknoten-Pflege-UI für `sbkim_hetero_outbox` + `heterokaryosisOptIn`) | [→ Archiv](sessions/archiv/2026-05-15_bau-08-ui-demo.md) |
| 2026-05-15 | Pflege · Bau 06.1 Outbox-Lese-Pfad in Modul 06 + DB-Version 2 → 3 | [→ Archiv](sessions/archiv/2026-05-15_pflege-bau-06.1-outbox-lese-pfad.md) |
| 2026-05-15 | Pflege · Sage-Page Phasen-Animation + Wanderung-Erweiterung + Initialstart-Zentrierung | [→ Archiv](sessions/archiv/2026-05-15_pflege-sage-page-lebenszyklus-phasen.md) |
| 2026-05-15 | Pflege · Sage-Page Design-Fix (Modul-Bento-Wrap, Lebenszyklus-Hub-Bootstrap, Initialstart-viewBox) | [→ Archiv](sessions/archiv/2026-05-15_pflege-sage-page-design-fix.md) |
| 2026-05-15 | Spec · Modul 08 UI-Demo gefüllt | [→ Archiv](sessions/archiv/2026-05-15_spec-08-ui-demo.md) |
| 2026-05-15 | Bau · Modul 06 Heterokaryose Code-Stub | [→ Archiv](sessions/archiv/2026-05-15_bau-06-heterokaryose.md) |
| 2026-05-15 | Spec · Modul 06 Heterokaryose gefüllt | [→ Archiv](sessions/archiv/2026-05-15_spec-06-heterokaryose.md) |
| 2026-05-15 | Pflege · Sage-Page Modul 14 Sichtbarmachung (`diffusionBacklog[]` parallel zu `schutzBacklog[]`) | [→ Archiv](sessions/archiv/2026-05-15_pflege-sage-page-modul-14.md) |
| 2026-05-15 | Pflege · Karte 09 App-SW-Koexistenz (Variante 3b importScripts, `SBKIM_SW_STANDALONE`-Flag) | [→ Archiv](sessions/archiv/2026-05-15_pflege-09-app-sw-koexistenz.md) |
| 2026-05-15 | Hauptsitzung · Modul 14 Diffusion — Backlog-Stub angelegt (Pfad 2 verbindlich) | [→ Archiv](sessions/archiv/2026-05-15_haupt-14-diffusion-stub.md) |
| 2026-05-15 | Bau-Sitzung Modul 09 — BLOCKIERT vor Schritt 1 (App-SW-Konflikt in beiden Endknoten) | [→ Archiv](sessions/archiv/2026-05-15_bau-09-blockiert-app-sw.md) |
| 2026-05-15 | Pflege · Karte 09 Schritt 9 — `SbkimApoptose.init` + `SbkimDoku.init` + optionaler TTL-Sweep | [→ Archiv](sessions/archiv/2026-05-15_pflege-09-schritt-9-doku-ttl.md) |
| 2026-05-15 | Pflege · Modul 02 + Modul 07 Cache-Invalidate (`resetIdentityCache()` als Cleanup-Schritt 6) | [→ Archiv](sessions/archiv/2026-05-15_pflege-02-07-cache-invalidate.md) |
| 2026-05-15 | Pflege · Modul 07 Test 6 bestätigt (Re-Sichttest nach Cache-Invalidate) | [→ Archiv](sessions/archiv/2026-05-15_pflege-07-test6-bestaetigt.md) |
| 2026-05-15 | Pflege · Modul 05 Test 2 Vektor-Trias (Tarantino → Steuerrecht / Eisenbahn / Quantenfeld) | [→ Archiv](sessions/archiv/2026-05-15_pflege-05-test2-vektor-trias.md) |
| 2026-05-15 | Pflege · Modul 00 Test 4 Quota-Werte (GiB-Skalierung statt Mini-Bytes) | [→ Archiv](sessions/archiv/2026-05-15_pflege-00-test4-quota.md) |
| 2026-05-14 | Bau · Modul 00 Doku-Fenster (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-00-doku-fenster.md) |
| 2026-05-14 | Spec · Modul 00 Doku-Fenster (Spec fertig) | [→ Archiv](sessions/archiv/2026-05-14_spec-00-doku-fenster.md) |
| 2026-05-14 | Bau · Modul 07 Apoptose (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-07-apoptose.md) |
| 2026-05-14 | Spec · Modul 07 Apoptose (Spec fertig) | [→ Archiv](sessions/archiv/2026-05-14_spec-07-apoptose.md) |
| 2026-05-14 | Spec · Modul 09 Einbau-PWA (Spec fertig) | [→ Archiv](sessions/archiv/2026-05-14_spec-09-einbau-pwa.md) |
| 2026-05-14 | Bau · Modul 05 Anastomose (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-05-anastomose.md) |
| 2026-05-14 | Spec · Modul 05 Anastomose (Spec fertig) | [→ Archiv](sessions/archiv/2026-05-14_spec-05-anastomose.md) |
| 2026-05-14 | Pflege · Match-Kalibrierung (`PROVIDER_MIN_MATCH` 0.55 → 0.80) | [→ Archiv](sessions/archiv/2026-05-14_pflege-match-kalibrierung.md) |
| 2026-05-14 | Spec+Bau · Modul 02 Spore (Spec + Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_spec-bau-02-spore.md) |
| 2026-05-14 | Spec+Bau · Modul 04 Match (Spec + Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_spec-bau-04-match.md) |
| 2026-05-14 | Bau · Modul 03 Embedding (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-03-embedding.md) |
| 2026-05-14 | Bau · Modul 01 Storage (Code-Stub) | [→ Archiv](sessions/archiv/2026-05-14_bau-01-storage.md) |
| 2026-05-14 | Spec · Modul 01 Storage + Modul 03 Embedding | [→ Archiv](sessions/archiv/2026-05-14_spec-01-storage-und-03-embedding.md) |
| 2026-05-14 | Plan-Sitzung · Spec-Brief 01 Storage + 03 Embedding | [→ Archiv](sessions/archiv/2026-05-14_plan-spec-01-storage-und-03-embedding.md) |
| 2026-05-10 | Hauptsitzung · Site-Echo + Bau-Puls + Brand-Icon | [→ Archiv](sessions/archiv/2026-05-10_site_echo.md) |
| 2026-05-10 | Hauptsitzung · Sage·Observatorium (Landing Page) | [→ Archiv](sessions/archiv/2026-05-10_observatorium.md) |
| 2026-05-10 | Hauptsitzung · Skelett-Anlage (Repo-Initiale, zehn Karten-Schablonen, Memory-Schicht) | [→ Archiv](sessions/archiv/2026-05-10_skelett-anlage.md) |
