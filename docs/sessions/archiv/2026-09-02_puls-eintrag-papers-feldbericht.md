# PULS-Eintrag vom 2026-09-02 — die Papers als Feldbericht

*Ausgelagerte PULS-Einträge — **Wortlaut unverändert**. Sie standen bis zum
2026-09-03 in [`docs/PULS.md`](../../PULS.md) und wurden von dort ins Archiv
verschoben, weil die Datei bei **2.927 von 3.000 Zeilen** stand. Die
Schutz-Klausel im Kopf der PULS verlangt **auslagern statt kürzen** — hier ist
nichts zusammengefasst, nichts weggelassen. Im PULS steht an ihrer Stelle ein
Zeiger auf diese Datei.*

*Übergabeprotokolle derselben Sitzung: [`2026-09-02_papers-feldbericht.md`](2026-09-02_papers-feldbericht.md) und [`2026-09-02_sporen-befund-und-doi.md`](2026-09-02_sporen-befund-und-doi.md).*

> **Zu den Verweisen im Wortlaut:** die Links wurden geschrieben, als der Text in
> `docs/PULS.md` stand, und sind deshalb relativ zu **`docs/`** gemeint. Aus diesem
> Verzeichnis lösen sie nicht auf. Wer einem folgen will, stellt `docs/` davor —
> ein Verweis auf `papers/…` meint `docs/papers/…`. Verweise auf `http…` und auf
> Nachbardateien in diesem Verzeichnis stimmen. **Der Wortlaut wurde dafür NICHT
> angefasst**: eine ausgelagerte Fassung, die sich vom Original unterscheidet, wäre
> keine Auslagerung mehr.

---

## Stand 2026-09-02 (Bau) · 📄 Die Papers auf den heutigen Stand, als Feldbericht

**Rolle:** Bausitzung nach dem Brief „Papers auf den heutigen Stand bringen".
Grundlage war der genehmigte Plan in [`papers/REVISION_2026-09-02.md`](papers/REVISION_2026-09-02.md)
(PR #927). Ergebnis: **PR #929**, Entwurf.

### Was getan

Beide SBKIM-Papers sind von Vorschlag auf **Feldbericht** umgestellt. Neun
Abschnitte statt sieben, DE und EN parallel.

⚠ **Nachtrag am selben Tag, auf Klaus'"'"' Einwand:** das Paper vom Mai ist **nie
veröffentlicht** worden, es lag als Entwurf im Depot. Alle Berichtigungs-Vermerke
(„Berichtigt am", „Zurückgenommen am") sind deshalb wieder aus den Papers heraus.
Sie hätten einem Leser eine frühere öffentliche Ausgabe suggeriert, die es nie
gab. Die Geschichte steht jetzt in **Station 8 der Geschichts-Galerie**; die
Papers tragen „September 2026 · Erstveröffentlichung".

| Abschnitt | Was |
|---|---|
| § 2.1 / 2.2 **neu** | die Vorarbeiten: reziproke Empfehlungssysteme, semantische Überlagerungsnetze (~2008), Agent Cards. Die Vergleichstabelle behauptet in keiner Spalte mehr, SBKIM sei allein |
| § 5 **neu** | wie das entstanden ist, aus der Geschichts-Galerie und dem Meilenstein § 2 |
| § 6 **überarbeitet** | 33 Depots statt zwei HTML-Dateien, mit der Messung vom 10.07.2026 |
| § 7.1 **aufgeteilt** | zwei Teilprobleme belegt, zwei offen, dazu die Wach-Tab-Grenze |
| § 8 **zurückgenommen** | der Neuheits-Anspruch fällt |
| § 9 **neu** | zur Entstehung des Textes |

Dazu: **eine Quelle statt zwei** (`docs/papers/` gilt, `sbkim-demo/` zeigt
darauf), `ABGRENZUNG.md` nachgezogen, und im Skill `menschlich-schreiben` der
präzisierte Zielsatz. **Kein Zenodo-DOI.** Er wartet auf Klaus' Sichttest.

### Drei Funde, die im Plan noch nicht standen

1. **Zwei weitere tote Verweise**, ausgerechnet in der zur Quelle erklärten
   Fassung: die „Live-Demo Layer 1/2"-Verweise in
   `docs/papers/sbkim-paper-{de,en}.html` zeigten auf `index.html` und
   `sbkim-network.html`, die es in dem Ordner nicht gibt. **In der
   Demo-Fassung liefen dieselben Verweise**, deshalb fielen sie beim ersten
   Durchgang nicht auf. Eine Datei an zwei Orten hat an einem davon andere
   Nachbarn.
2. **Die beiden Fassungen trugen verschiedene TITEL**, nicht nur verschiedene
   Prüfsummen: „Semantisches Bidirektionales **KI-Matching**" gegen
   „Semantisches Bidirektionales **Wissensintegriertes** Matching". Das ist
   die Drift in ihrer schlimmsten Form, weil sie zwei Zitationen erzeugt.
3. **Die Demo-Fassungen hatten die besseren Druck-Regeln.** Übernommen, bevor
   die Dateien zu Zeigern wurden. **Ohne den Vergleich hätte das
   Zusammenlegen sie verloren.** Genau dafür stand „vorher vergleichen" im
   Auftrag.

### Die Zahl, die zweimal richtig ist

Der Plan nennt 5.823 Commits, `historie/arbeitstage-zahlen.html` nennt 5.775.
Beide stimmen; die Differenz sind **48 zeitgesteuerte Läufe**, und diese Datei
hält das schon fest. **Die Papers nennen beide** mit ihrer Bedeutung. Eine
allein wäre je nach Wahl zu hoch oder zu niedrig.

### Was die Probe gefunden hat, und sie hatte recht

`smoke_antragsmappe` schlug an: in `ABGRENZUNG.md` standen nach der Bearbeitung
**fünf Gedankenstriche**. Klaus' Regel vom 2026-08-24 verbietet sie in seinen
eigenen Texten, und der Wächter setzt sie durch. Aufgelöst zu Sätzen, die
erzeugten Blätter der Antragsmappe neu gebaut.

> Bemerkenswert daran ist nicht der Fehler, sondern dass ihn **kein Mensch**
> finden musste. Der Wächter stand da, bevor die Zeile geschrieben wurde.

### Gemessen

| | |
|---|---|
| `node tests/run_alle.mjs` | **89 Proben · 89 grün · 0 rot · 0 nicht lauffähig** |
| HTML beider Papers | wohlgeformt, gleiche Gliederung (9 × h2, 16 × h3) |
| relative Verweise in den vier Paper-Dateien | jeder löst auf eine vorhandene Datei auf |
| `git grep "semantic-match-demo" -- docs/papers sbkim-demo` | **1**, siehe unten |

### Was offen ist

- **Klaus' Sichttest der v0.2 im Browser.** Nicht ersetzbar, und der DOI hängt
  daran.
- **`git grep` gibt 1 statt der erwarteten 0.** Der Treffer steht in
  `REVISION_2026-09-02.md` in einem Zitat-Block und ist die Aufzeichnung
  dessen, *was* der tote Verweis war. **Kein klickbarer Verweis, das ist
  nachgemessen.** Ihn zu entfernen hieße, den Befund zu löschen. Klaus
  entscheidet.
- **Der Anspruchs-Satz in `ABGRENZUNG.md` § 4** steht weiter da und ist nur
  eingeordnet. Ob er ganz fällt, ist nicht entschieden.
- **Abschnitte 1–4 und § 7.2–7.4 der Papers** sind ungeprüft geblieben, wie im
  Auftrag vorgegeben.
- **Die Literatursuche bleibt zu dünn für eine Veröffentlichung.** Drei
  Suchen, an Titeln und Zusammenfassungen geprüft, nicht an den Volltexten;
  `arxiv.org` und die Verlagsseiten sind aus dieser Umgebung gesperrt.

### Drei weitere Runden am selben Abend, alle aus Klaus' Sichttest

**1 · Die Berichtigungs-Vermerke mussten wieder raus.** Klaus: *„Ich habe noch
nichts veröffentlicht. Das ist das erste Mal."* Das Mai-Paper lag als Entwurf im
Depot. Ein Kasten „Berichtigt am 2. September" behauptet damit eine frühere
öffentliche Aussage, die es nie gab. Vier Kästen je Sprache heraus, dazu die
Fassungs-Notiz. Das Datum heißt jetzt **September 2026 · Erstveröffentlichung**.
Die Geschichte steht in **Station 8** der Geschichts-Galerie.

**2 · Die Verweise waren dreimal kaputt, jedes Mal anders.**

| Runde | Fehler | Warum er durchkam |
|---|---|---|
| vormittags | Ziel gibt es im Ordner nicht | in der Demo-Fassung derselben Datei lief es |
| abends | Ziel richtig, aber **relativ** | im Depot richtig, als Einzeldatei tot (`FORBIDDEN`) |
| danach | Adresse richtig, aber `target="_blank"` | eingebetteter Betrachter verschluckt den Klick lautlos |

> **Ein Verweis ist keine Eigenschaft des Textes. Er ist eine Eigenschaft des
> Textes an seinem Ort.** Ein veröffentlichtes Papier hat keinen festen Ort.

Neu: **`tests/smoke_papers_verweise.mjs`**. Prüft nicht, ob am Zielpfad eine
Datei liegt (das sagt nur etwas über dieses Depot), sondern ob der Verweis von
überall trägt: absolut · kein `target="_blank"` · und die Adresse steht auch als
**lesbarer Text** da, weil auf Papier niemand klicken kann. Vier Gegenproben von
Hand gefahren, alle vier fallen um, Datei danach per `md5sum` byte-gleich.

**3 · Die Netz-Karte ist ein Beleg, keine Demo** (Klaus' Einwand). Beim
Nachprüfen im Quelltext wurde der Punkt stärker als gestellt:

| | |
|---|---|
| Relais | **fünf**, davon **drei fremde** (`damus.io`, `nos.lol`, `primal.net`) |
| Senden | **kann sie nicht.** Einziger Aufruf ist `["REQ"`, null `["EVENT"` |
| Probelauf | vorhanden, im Quelltext als Simulation gekennzeichnet |

**Ein Instrument, das nur lauschen kann, kann den Verkehr nicht hergestellt
haben, den es anzeigt.** Steht als § 6.3 im Papier, samt Probelauf-Knopf. Ein
Prüfer findet den sonst selbst und hält die Auskunft für gestellt.

⚠ **Und ein Befund gegen die naheliegende Annahme.** Klaus schlug vor, beides
zusammen anzuführen (Tablet als Hub, zwei Geräte als Verkäufer und Käufer). Der
Aufbau stimmt, **der Transport ist ein anderer**: die Vorführungen laufen über
**WebRTC** mit dem Vorgabe-Vermittler von PeerJS, drei CDN-Bibliotheken und einem
**bezahlten Anthropic-Schlüssel**. Das laufende Netz läuft über **Nostr-Relais**,
ohne beides. Beides in einen Topf zu werfen hätte zwei Systeme als eines
ausgegeben. § 6.3 stellt sie gegenüber.

Daraus ein Satz, der vorher nirgends stand: **das Verfahren ist an keinen
Transport gebunden, zwei haben es getragen.**

### Und ein Abschnitt, der ganz gefehlt hat

**§ 3.5 „Die Selbstbeschreibung folgt dem Inhalt"** ist neu in beiden Papers.
Nachgeprüft, dass es fehlte: „Spore" kam dreimal vor, „Version" einmal, und
§ 3.4 beschrieb das Protokoll als zustandslos. Dass der Vektor einer Partei aus
ihrem Bestand gerechnet wird und mit ihm wandert, stand nirgends.

Belegt in `docs/INTERFACES.md` und `src/modules/02_spore.js`:
`embedContentVector` liefert `source:"content"` · `embeddingSource` hält fest,
woher der Vektor stammt · `embeddingVersion` steigt bei geändertem Vektor
(Drift-Merkmal) und die Spore wird neu signiert · `SPORE_SNIPPET_MAX = 20`
satz-granulare Vektoren neben dem Gesamtvektor · `PROVIDER_MIN_MATCH = 0.80`
bei gemessenem Boden mean 0,8214 sd 0,0236.

Klaus' Kochbuch-Beispiel steht als Beispiel im Papier: ein Buch, das nur noch
Sushi führt, wird für eine Sushi-Anfrage höher bewertet als eines mit drei
Sushi-Rezepten unter zweihundert. **Ein wandernder Vektor ist kein Mangel,
sondern die Funktion.**

Zwei Sätze stehen dabei, weil sie sonst fehlten: die Zustandslosigkeit aus
§ 3.4 bleibt unberührt (es ändert sich die Beschreibung, nicht das Verfahren),
und der hohe Boden begrenzt die Eigenschaft (kleine Änderungen bewegen den
Vektor, aber nicht den Platz in der Liste).

**Station 8 der Geschichts-Galerie** ist entsprechend nachgezogen.

Gemessen nach allen Runden: **90 Proben, 90 grün, 0 rot.**

### ✅ Gemerged am 2026-09-02, 19:42 UTC

**PR #929, Squash auf `main` als `80276d4`.** Klaus hat die drei Adressen im
Papier an seinem Tablet bestätigt und die Freigabe gegeben. Gegen `main` selbst
nachgeprüft, nicht gegen die Zweig-Erwartung: beide Papers, der neue Wächter,
§ 3.5, das Datum „September 2026 · Erstveröffentlichung" und Station 8 liegen
dort. Rest-Unterschied Zweig gegen `main`: keiner. Proben auf dem `main`-Stand:
**90 grün, 0 rot.**

**Stundennachweis**, gemessen an den Commits: erster `ef81cd6` 15:30 UTC,
letzter `e5a8dfc` 19:41 UTC, **Spanne 4 h 10 min**, 12 Commits (squash-gemergt).
⚠ Das ist die Spanne des Ablegens, nicht der Aufwand: Pflichtlektüre,
Literatursuchen und das Schreiben der neuen Abschnitte liegen davor und
hinterlassen keine Spur. Und sie ist nicht Klaus' Arbeitszeit.

### 🔴 PR #401 muss GESCHLOSSEN werden, nicht gemergt

Beim Pflicht-Check vor dem Sitzungsbrief gefunden. **Der einzige offene PR**,
Entwurf vom 2026-06-23, „Discovery-Expedition: Bildmaterial".

| Gemessen | |
|---|---|
| `main` ist voraus | **51 Commits** |
| `git diff main..zweig` | 562 Dateien, 9.276 Zugänge, **176.893 Abgänge** |
| eigene Bilder in `main`? | **alle fünf liegen dort** |
| byte-gleich? | **nein**, `main` hat neuere (17.08.) und größere Fassungen |

Der Zweig trägt nichts, was `main` fehlt. Ein Merge würde rund
**177.000 Zeilen zurückdrehen**, darunter die heutige Arbeit, und fünf Bilder
durch zwei Monate ältere, kleinere ersetzen.

> Das ist die Squash-Merge-Falle: `git log main..zweig` zeigt Commits, deren
> Inhalt längst in `main` ist. Erst `git diff --stat` zeigt die Richtung.

**Nicht von dieser Sitzung geschlossen** — das Schließen eines fremden PR ist
Klaus' Entscheidung.

### 🔴 Spät am Abend gemessen: die Spore im Netz ist nicht die Spore im Depot

Klaus hat mit dem Analyse-Rekorder der Mycel-Karte zwei Mitschnitte aufgenommen,
20:42 und 20:49 UTC. Sie enthalten, was Sage und Mein Mixarium wirklich ins Netz
gestellt haben.

| | Depot-Datei | auf der Leitung |
|---|---|---|
| Sage, Beschreibung | 2.527 Zeichen | 160 |
| Mixarium, Beschreibung | 1.476 Zeichen | 88, **anderer Text** |
| `embeddingSource` | fehlt in **allen 18** Depot-Sporen | vorhanden |
| Signatur · `createdAt` · Kennung | | jeweils andere |

Mixariums Leitungs-Text ist kein Anfang seines Depot-Textes, sondern ein eigener
Satz. Die Spore, die ein Knoten ankündigt, entsteht **im Browser**; die Datei im
Depot ist Ablage, kein Sender.

**Die Kernaussage stand schon im Depot** — `docs/OBSERVATORIUM_BROWSER.md` sagt
seit Mai *„Pages-deployte `spore.json` ist ein Snapshot einer einzigen
Andock-Session."* Ich habe an diesem Abend das Gegenteil behauptet und Klaus
darauf eine signierte Datei erzeugen lassen, die nichts sendet.

Zwei Fehlschlüsse davor, beide von der zweiten Messung widerlegt: eine
angebliche Kappung bei 160 Zeichen (`SNIPPET_TEXT_MAX`) — Sages erster Satz ist
zufällig genau so lang, Mixariums 88 Zeichen zeigen es. Und ein angeblicher
Protokoll-Fehler — es geht nichts verloren, es geht etwas **anderes** hinaus.

Aufgeschrieben in [`LEHREN.md` § 9](LEHREN.md), als Regel benannt in
`CLAUDE.md` § Was du tust.

**Nicht gemessen:** wo im Browser der Text herkommt, ob dieses Feld selbst eine
Längengrenze hat, und ob die anderen 16 Knoten sich genauso verhalten.

### 🔴 Sages Netz-Identität ist eine andere als die im Depot

Die neu signierte Spore trägt `BgjXhSAp…` statt `nysOZE3V…`. **Nicht
eingespielt.** Der Handschlag mit family-project lief damit erfolgreich
(`established`, eine Sekunde) — das Protokoll arbeitet, nur unter der falschen
Kennung. Zurückzuholen ist sie über den Identitäts-Wechsler aus der
verschlüsselten Sicherung; das gehört in den Browser, nicht in eine Sitzung.

### Ausgelagert

Diese Datei stand bei 3.000 Zeilen, der Grenze. Die fünf Einträge vom
2026-08-23 sind **wortgleich** nach
`sessions/archiv/2026-08-23_puls-eintraege-fuenf-sitzungen.md` gezogen; hier
stehen fünf Verweis-Zeilen. Stand jetzt: 2.856 Zeilen.

### Der Grundsatz noch einmal, und diesmal für beide

Die erste Fassung von `NETZWEIT § 6a` band nur die Sitzung und endete mit einer
Schuldzuweisung an die eigene Adresse. Klaus hat beides gestrichen:

> *„dass ich weder durch deine Fragestellung noch dass Du durch meine
> Fragestellung vom Ziel abgelenkt werden … Schuldzuweisung selber bringt nichts.
> Das ist unsinnig."*

Und der Grund, warum es nicht bei einer einseitigen Regel bleiben kann, kam
gleich mit: **die Sitzung arbeitet nach Anleitung.** Wo die Anleitung hinzeigt,
geht sie hin — eine Frage ist für sie faktisch eine Anleitung. Eine Regel, die
nur eine Seite bindet, während die andere die Richtung vorgibt, wirkt nicht.

Seitdem steht in `NETZWEIT.md` ein eigener Abschnitt **§ Für wen sie gelten**:
die Regeln sind die gemeinsame Arbeitsgrundlage, nicht eine Dienstanweisung. Eine
Bitte, die gegen eine Regel steht, wird **benannt** — von der Sitzung, statt sie
stumm zu umfahren, und von Klaus, wenn er sie ausdrücklich aussetzen will. Das
ist die Tafel-Evolutions-Klausel an einer anderen Tür.

Der Satz, der die Schuldzuweisung ersetzt und von beiden kommen darf:
**„Wo wollten wir eigentlich hin?"**

### Für die nächste Sitzung

Der Brief steht in
[`sessions/BRIEF_nach_papers_veroeffentlichung.md`](sessions/BRIEF_nach_papers_veroeffentlichung.md).
Drei offene Punkte, alle im Browser: der Zenodo-DOI, Sages Netz-Identität, und
die Beschreibung, die in die App gehört und nicht in die Datei.

### Die PDFs für Zenodo — und zwei Funde beim Bauen

Zenodo schreibt kein Format vor; ein Preprint gehört trotzdem als PDF hinein,
weil HTML dort nur zum Herunterladen angeboten wird. Beide Fassungen gebaut,
A4, Schriften eingebettet.

**Die Schriften fehlten zuerst.** Chromium kam durch den Proxy nicht an Google
Fonts (`ERR_CONNECTION_RESET`) und setzte still Liberation Serif ein — das PDF
hätte anders ausgesehen als die Seite im Browser. `curl` kommt durch; die acht
lateinischen Schnitte liegen jetzt als `data:`-URI in einer **Arbeitskopie**,
das Depot bleibt unberührt.

**Der Titel strandete ein Wort** (#937): in echter Druckbreite stand
„Bidirektionales" allein auf einer Zeile. Das `<br>` stammte aus der Zeit vor der
Namensberichtigung. Ohne ihn drei ausgewogene Zeilen statt vier — gemessen
*und* als Bild angesehen.

⚠ **Und der PDF-Prüfer hat zuerst gelogen.** Er meldete „§ 3.5 fehlt, Kürzel
nicht aufgelöst, Adresse nicht lesbar" — alles drei falsch. Er las die
**eingebetteten Schriftdaten**; die 15.168 „Textzeichen" waren Fonttabellen.
Beinahe wäre gemeldet worden, die PDFs seien kaputt. Geprüft wird jetzt **vor**
dem Druck im geladenen Dokument, mit Abbruch: Titel löst das Kürzel auf ·
§ 3.5 steht im Text · die verlangte Schrift ist wirklich geladen.

### Sitzungs-Abschluss

Dreizehn Merges auf `main`, 13:30 bis 23:46 UTC. Übergabeprotokoll des Abends:
[`sessions/archiv/2026-09-02_sporen-befund-und-doi.md`](sessions/archiv/2026-09-02_sporen-befund-und-doi.md)
(der erste Teil steht in `2026-09-02_papers-feldbericht.md`).
Proben: **90 grün, 0 rot, 0 nicht lauffähig.**

### Nächster sinnvoller Schritt

Zwei Dinge, in dieser Reihenfolge. **Erst** die Beschreibung dort eintragen, wo
sie hingeht — in der App selbst, nicht in der Datei — und die Identität
zurückholen; beides läuft im Browser. **Dann** der Zenodo-DOI, der auf den
Sichttest gewartet hat und ihn bekommen hat.
