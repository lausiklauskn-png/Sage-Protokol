# PULS-Einträge vom 2026-08-24 — vier Sitzungen, wortgleich ausgelagert

*Ausgelagert am 2026-09-03. Diese vier Einträge standen bis dahin in
`docs/PULS.md` in voller Länge (327 Zeilen). Die Datei stand bei 2.916 von
3.000 Zeilen, und die Regel in `CLAUDE.md` lautet: bei Überschreiten ins
Archiv **auslagern, nicht kürzen**. Der Wortlaut unten ist unverändert.*

*Dasselbe war am 2026-09-02 mit den fünf Einträgen vom 2026-08-23 geschehen
(`2026-08-23_puls-eintraege-fuenf-sitzungen.md`). Die Übergabeprotokolle
dieser vier Sitzungen liegen daneben in diesem Verzeichnis und beschreiben
dieselben Tage aus der Sicht der jeweiligen Sitzung; hier steht, was im PULS
stand.*

---

## Stand 2026-08-24 (Bau, 3.) · ⏱ Die Arbeitstage einzeln, für das Finanzamt

**Rolle:** Fortsetzung. Zweig `claude/research-funding-paper-delivery-vuppnj`.
Klaus: *„Kannst Du diese Tage einzeln auflisten, sodass wenn das Finanzamt mal
nachfragen sollte, ob ich wirklich so lange an den einzelnen Tagen gearbeitet
habe?"* Dazu: *„Excel und PDF und in die historie html"*, *„im Stil einer
täglichen Dokumentation"*.

**Zuerst ausgelagert, dann geschrieben.** Die Datei stand bei 2.985 Zeilen. Die
sechste Auslagerung nimmt den 15. bis 17.08. wortwörtlich heraus, jetzt 2.662.

### Der Befund, der das Blatt gerettet hat, kam vor dem Bauen

**48 Einträge stammen von `github-actions[bot]`**, 32 davon nachts um drei.
Ungefiltert wiese das Blatt **64,9 Stunden zu viel** aus, und zwar an genau der
Stelle, an der eine Prüfung zuerst hinsieht: eine Zeile „erster Eintrag 03:04"
an einem Tag, an dem in Wahrheit ab neun gearbeitet wurde. **Ein einziger
solcher Fund macht die ganze Aufstellung wertlos, auch die richtigen Zeilen
darin.** Eine Zahl, die man selbst nach unten korrigiert hat, trägt weiter als
eine, die jemand anders nach unten korrigieren muss.

### Die Spalten sagen, was sie messen

Keine heißt „gearbeitet". Sie heißen *erster Eintrag*, *letzter Eintrag*,
*Spanne*, *aktive Zeit*. „19,9 h gearbeitet" wäre eine Behauptung; „Spanne vom
ersten bis zum letzten Eintrag: 19,9 h" ist eine aus fremden Zeitstempeln
nachprüfbare Tatsache. **Die Überschrift trägt die Ehrlichkeit**, damit
darunter kein Absatz voller Einschränkungen stehen muss.

| | |
|---|---|
| Tage mit Arbeit | **128**, 10.03. bis 24.08.2026 |
| Spanne, aufsummiert | **1.935,9 h** |
| aktive Zeit, ohne Pausen | **1.186,6 h** |
| Einträge gezählt · herausgerechnet | 5.775 · 48 |

Der **22.08. war Samstag**: gemessene Spanne **19,9 h**. Klaus hat denselben Tag
unabhängig davon mit „zwanzig Stunden" angegeben. Die Methode trifft den einen
Tag, an dem die Antwort von außen bekannt ist.

### Was gebaut wurde

| | |
|---|---|
| `tools/arbeitstage-rechnen.mjs` | die **eine** Quelle der Rechnung |
| `tools/arbeitstage-bauen.mjs` | Blatt + zwei Tabellenblätter |
| `tools/arbeitstage-pdf.mjs` | druckt über Chromium, 301 Seiten |
| `docs/historie/arbeitstage.html` | Übersicht **und** Tag für Tag, nichts gekürzt |
| `docs/historie/arbeitstage-tage.csv` | eine Zeile je Tag, für Excel |
| `docs/historie/arbeitstage-taetigkeiten.csv` | eine Zeile je Eintrag |
| `historie.html` § Arbeitszeit | derselbe Stand, aus derselben Quelle |

**Die Probe baut die Rechnung nicht nach.** Sie wäre sonst grün, wenn beide
denselben Denkfehler machen. Teil A misst die **Regeln** an erfundenen Tagen mit
bekannter Antwort, samt der Grenzfälle genau auf der Lücken-Schwelle und eine
Minute darüber. Teil B misst, ob das Blatt wiedergibt, was das Modul rechnet.

**Der BOM.** Beim Herunterladen geht `charset=utf-8` verloren, Androids
Betrachter rät dann Latin-1 und aus jedem Umlaut werden zwei Zeichen. Blatt,
Historie, Antragsmappe und beide Tabellen tragen ihn jetzt. Geprüft an den
**Bytes**, im Browser zusätzlich am gezeichneten Text.

**Das ⓘ „Verbindung ist nicht sicher" bleibt.** Das sagt Chrome über den *Weg*,
nicht über die Datei, und erscheint bei jedem `http://` und jeder lokalen Datei.
Keine Änderung am Dokument entfernt es. Ein Schloss gibt es nur über `https`.

**Gemessen:** 88 von 88 Proben grün · Gegenprobe Arbeitstage 16 von 16 ·
Gegenprobe Historie 9 von 9 · Gegenprobe Antragsmappe 32 von 32.

**Offen:** Klaus' Sichttest am Tablet · der Werkzeug-Widerspruch in Paper A ·
die Anmeldung nach § 5c.

---

## Stand 2026-08-24 (Bau, 2.) · 🟡 Die gelbe Runde, und zwei Funde daneben

**Rolle:** Fortsetzung. Zweig `claude/yellow-markings-funding-application-h9n5sr`.
Auftrag: Klaus' **vierzig gelbe Markierungen** in der Antragsmappe. Gelb heißt
„kann bleiben oder weg, Claude wägt ab", darüber steht „im Zweifel bleiben".
**Nichts wurde gestrichen.**

**Zuerst PR #913 gemergt.** Er lag als Entwurf und trug die Markierungs-Akte, die
Mappe und die Historie, also die ganze Grundlage dieser Runde. Ein Auftrag, der
einen ungemergten PR voraussetzt, stößt den Merge an, statt gegen eine Basis zu
arbeiten, die es auf `main` nicht gibt (Anker, § „Vor dem nächsten Sitzungs-Brief").

**1 · Die acht mit Notiz.** Alle erledigt. Der schwerste war Klaus' Berichtigung
zu *„ein Werkzeug, das nie ‚nein' sagt"*: **es sagt nein, es hört nur nicht auf.**
Nicht die Willfährigkeit ist das Suchtmerkmal, sondern die **Ausdauer**, und das
ist zugleich die messbarere Frage. „Sagt zu oft ja" ist eine Behauptung über
Haltung; „hört nicht auf, nachdem ein Mensch aufgehört hätte" ist an Runden,
Dauer und Kosten zählbar, und die Daten liegen im Fahrtenbuch. Weitergetragen
nach **Paper B** (dort fiel die Zeile „ohne Nein") und **Paper C** (das
Gegenstück: selbst zu entscheiden, wann Schluss ist, ist eine Kompetenz, die es
vorher nicht brauchte, weil die eigene Erschöpfung sie erledigte).

**2 · Die zweiunddreißig ohne Notiz.** Sie liegen auf Zahlen und Fristen.
Gestrichen wäre der falsche Griff gewesen, ein Fahrplan ohne Zahlen ist nicht
besser, nur nicht mehr nachprüfbar. Stattdessen **nachgeprüft und mit Herkunft
versehen** — was bestätigt wurde und was ausdrücklich ungeprüft blieb, steht
jeweils dran, und die gesperrten Quellen sind benannt.

> *(Hier ist gekürzt.* **Was gemessen und getan wurde, steht oben; was daraus
> für Klaus' Lage folgt, gehört nicht in ein öffentliches Depot.** *Der Befund
> bleibt, der Rat ist heraus — die Regel dazu steht in `CLAUDE.md`.)*

> ⚠ **Der Brief an diese Sitzung stimmte an einer Stelle nicht.** Er sagte, die
> vierzig gelben stünden vollständig in der Markierungs-Akte. Das gilt nur für
> die acht mit Notiz; der Wortlaut der übrigen liegt in Klaus' Browser und im
> Chat. Gearbeitet wurde deshalb an den **benannten Themen**, und das ist
> hingeschrieben statt stillschweigend gleichgesetzt.

**3 · Die Lizenz-Tafel war in beide Richtungen falsch.** Klaus' Notiz *„andere
Repos wurden auch zu Open Source erklärt"* stimmte. Gemessen gegen `origin/main`
aller 33 Depots: **6 MIT · 26 eigene · 1 ohne** statt 3 · 28 · 2. Zwei
verschiedene Ursachen, und beide sind eine Lehre wert:

| | |
|---|---|
| **zu wenig MIT** | `Kim-Bell`, `Kimseek`, `Kimboard` bekamen MIT am **2026-08-23**, am Tag der Zählung. Gezählt vorher, geändert danach, **nachgezählt nie** |
| **zu viel „ohne"** | `BookLedgerPro` trägt seit dem 2026-08-16 eine Lizenz. Im Container lag ein alter Klon. Die Falle aus dem Anker: eine Aussage ohne `fetch` ist kein Befund |

Und die eine verbliebene Null ist keine Nachlässigkeit: `Meine-In-and-Out-Book`
hat **überhaupt keinen Commit**. Ein leeres Depot ohne Lizenz ist ein anderer
Sachverhalt als Quelltext ohne Lizenz.

**4 · Klaus' Zuruf mitten in der Sitzung:** *„die ganze mögliche KIM-Familie
sollte mitwirken."* Drei sind drin. **Zwei können nicht**, beide Gründe gemessen:
Kimhub trägt Rechnungsdaten in der Historie (`werkstatt/buchhaltung/*.json`,
eingecheckt 20.08., entfernt 22.08.; **ein Fork nimmt die Historie mit**), und in
Kim-sync liegt `Company-Brain/VISION.md`, das selbst **„Sichtbarkeit: privat"**
trägt. **Eine MIT-Lizenz hätte es mit freigegeben.** Der Handgriff hätte fünf
Minuten gedauert und wäre still gewesen. Klaus hat entschieden: Kimhub bleibt zu.

> *(Hier ist gekürzt.* **Was gemessen und getan wurde, steht oben; was daraus
> für Klaus' Lage folgt, gehört nicht in ein öffentliches Depot.** *Der Befund
> bleibt, der Rat ist heraus — die Regel dazu steht in `CLAUDE.md`.)*


**6 · Ein neuer Wächter samt Gegenprobe.** `tests/smoke_lizenz_konsistenz.mjs`
bewacht **nicht** die Lizenzen im Netz (das kann eine Probe hier nicht, und eine
Probe, die still ins Netz greift, misst irgendwann etwas anderes als das, was sie
zu messen glaubt). Bewacht wird **die Sorte Fehler, die wirklich passiert ist**:
eine Tafel, die nur zur Hälfte nachgezogen wird, und ein Urteil, das in zwei
Dateien auseinanderläuft. `gegenprobe_lizenz_konsistenz.mjs` fährt **beide
Richtungen** (zu viel MIT und zu wenig), weil eine Prüfung mit nur einer Richtung
gegen den Fehler von 2026-08-24 blind gewesen wäre.

**Gemessen (echter Rückgabewert, nicht hinter `| tail`):**

| | |
|---|---|
| `node tests/run_alle.mjs` | **87 grün, 0 rot, 0 nicht lauffähig** |
| `gegenprobe_antragsmappe` | 32 von 32 gefangen |
| `gegenprobe_historie` | 9 von 9 gefangen |
| `gegenprobe_lizenz_konsistenz` | 8 von 8 gefangen |

**Kein Gedankenstrich im neuen Text**, gegen den eigenen Diff nachgezählt: 0.

**Offen:**
- **Klaus' Sichttest** der Mappe am Tablet, besonders Ziehen mit dem Finger und
  Androids Kopieren-Leiste. Von hier aus ungeprüft, nicht grün.
- **Der Werkzeug-Widerspruch in Paper A** (vier Stellen sagen, die Rollen hätten
  keine Werkzeuge; Kimhubs Verfassung sagt seit 2026-08-23 das Gegenteil).
  Unverändert Klaus' Entscheidung, drei Wege im Protokoll vom 2026-08-23.
- **Klaus’ eigene Punkte, dazu ORCID und Zenodo.** Nur Klaus,
  und der erste Punkt ist seit heute der eiligste.
- **Nebenbefund, nicht angefasst:** `Kim-sync/CLAUDE.md` beschreibt den eigenen
  Inhalt falsch („enthält nur README, LICENSE, RECHTE.md").

**Nächster Schritt:** Anmeldung nach § 5c rückwärts vom 30.11.2026 planen.

---

## Stand 2026-08-24 (Bau) · 📜 Die Historie ausgelesen, Gedankenstriche raus

**Rolle:** Fortsetzung. Zweig `claude/research-funding-paper-delivery-vuppnj`.
Drei Aufträge von Klaus an einem Tag.

**1 · Gedankenstriche.** *„Nimm bitte alle Gedankenstriche von dir heraus. Es
gibt Sätze."* 613 Striche aufgelöst, in elf Dateien, mit
`tools/gedankenstriche-aufloesen.mjs`. Entschieden wird an dem, was rechts
steht: Konjunktion wird Komma, Hauptsatz-Anfang wird Punkt, Aufzählung wird
Doppelpunkt. **Geprüft wird nicht „es steht kein Strich mehr da"**, sondern die
**Wortfolge** vorher und nachher, samt der Auflage, dass jede geänderte
Großschreibung eine bewusste ist.

**Drei eigene Fehler dabei, jeder von einer Prüfung gefunden:** die erste
Fassung verdoppelte ein Wort · die Aufräum-Regel fraß die **Einrückung** von
Fortsetzungszeilen, wodurch vier Zeilen aus der Antragsmappe fielen · und das
Werkzeug lief über die **Byte-Kopien** aus Kimhub mit, deren Prüfsummen in
`werkstatt/README.md` stehen. Zurückgenommen. Dort bleiben die Striche, bis sie
in Kimhub geändert und neu kopiert werden.

**2 · Klaus' Markierungen.** 100 Stück, ausgelesen aus der Mappe. **Alle
sechzehn roten erledigt**; elf davon waren in Paper A die Gedankenstriche
selbst. Die **vierzig gelben stehen offen**, Klaus: *„die roten schon mal raus,
über gelb reden wir später."* Vollständig mit seinen Notizen in
[`docs/sessions/2026-08-24_markierungen-klaus.md`](sessions/2026-08-24_markierungen-klaus.md).

**3 · Die Historie.** *„Nimm bitte eine vollständige Dokumentation der gesamten
History vor."* **Achtzehn der dreiunddreißig Klone waren flach** und trugen nur
die letzten fünfzig Commits. Erst nachgeholt, dann gemessen:

| | |
|---|---|
| Commits | **5.823** |
| Depots · Zweige | 33 · 1.388 |
| Tage mit Arbeit | **128**, vom 10.03. bis 24.08.2026 |
| Zeilen dazu · entfernt | 1.852.315 · 292.930 |
| Commits nie auf `main` | **1.662** (die Sackgassen) |

Daraus `docs/historie/historie.html` (7,9 MB): jeder Commit, Tag für Tag, mit
Uhrzeit, filterbar nach sieben Marken. Vier Rollen mit Aufgabe, Erfüllung,
gemessener Zahl **und der Grenze dieser Zahl**.

**Die Daten liegen als `docs/historie/historie.json` im Depot**, weil der
nächste Container wieder flach anfängt. Wer sie neu holen will, braucht erst
`git fetch --unshallow` über alle Depots.

**Ein blinder Wächter, von der Gegenprobe entlarvt:** „Commits ohne main sind
gekennzeichnet" fand `data-main="nein"` in der **CSS-Regel** und war deshalb
wahr, als kein einziger Commit mehr so gekennzeichnet war.

**Gemessen:** 86 von 86 Proben grün · Gegenprobe Antragsmappe 32 von 32 ·
Gegenprobe Historie 9 von 9.

**Offen:** die vierzig gelben Markierungen · der Werkzeug-Widerspruch in
Paper A · die Chat-Archive, die Klaus hat und die nicht in Git stehen · die
Striche in den zwei Byte-Kopien.

**Nächster sinnvoller Schritt:** Klaus sieht die Historie an; dann die gelbe
Runde, unter der Regel „im Zweifel bleiben".

---

## Stand 2026-08-24 (Bau) — ✎ Markieren in der Antragsmappe (Kürzen)

**Rolle:** Fortsetzung. Zweig `claude/research-funding-paper-delivery-vuppnj`.
**Klaus' Bitte:** in der Mappe mit der Maus etwas markieren können, grün oder
rot, und die Markierungen später auslesen, um zu sehen, wo etwas zu verbessern
ist.

**Gebaut:** `tools/antragsmappe-markieren.mjs`. Text ziehen → Farbleiste →
🟩 *gut so* · 🟨 *unklar* · 🟥 *ändern*, dazu eine Notiz. Der Knopf in der
Kopfleiste öffnet die Tafel; von dort geht die Liste als `.md`-Datei oder in
die Zwischenablage — eine Auslese nach Quelldatei und Farbe, mit dem markierten
Satz, dem Abschnitt und der Notiz.

**Der wichtigste Riegel ist nicht die Farbe, sondern was sie NICHT tut:**
Markierungen werden **nie gedruckt und nie mitgeladen**. Die Einreich-Abteilung
geht zur Behörde; ein „muss geändert werden"-Streifen darin wäre das Gegenteil
dessen, wofür sie da sind — und der Fehler fiele niemandem auf, bis er draußen
ist. Gemessen wird an den **Bytes der heruntergeladenen Datei** und an der
**Hintergrundfarbe im Druck-Medium**, nicht an einer CSS-Regel im Quelltext.

**Geankert wird am Text, nicht an der Stelle.** Die Mappe wird neu gebaut,
sobald sich eine `.md` ändert — eine Markierung an „Absatz 412" säße danach
lautlos woanders. Gespeichert werden Quelldatei, markierter Text und das
wievielte Vorkommen. Findet sich das nicht mehr, heißt die Markierung
**verwaist** und wird gemeldet, statt zu verschwinden. Ebenso beim Speicher:
wirft `localStorage`, sagt die Tafel es — wer fünfzig Stellen markiert und es
erst beim nächsten Öffnen merkt, hat umsonst gearbeitet.

**Zwei Fehler in meinen eigenen Wächtern, beide von der Sache selbst
aufgedeckt:**

1. Die Probe markierte die Zeile „Quelle: …" statt echten Text — 33 Zeichen.
   Aufgefallen erst, als der Längen-Vergleich am Ende darüber stolperte. *Eine
   Probe, die die falsche Stelle nimmt, misst nicht, was sie zu messen glaubt.*
2. „Schrift und Grund sind verschieden" lief **nur im hellen Thema** und war
   dort immer grün — im dunklen hätte fast weiße Schrift auf hellgrünem Grund
   gestanden. **Die Gegenprobe hat es gefangen.** Gemessen wird jetzt der
   Kontrast nach WCAG, in hell **und** dunkel: 🟩 10,3 · 🟨 12,0 · 🟥 8,6 zu 1.

Dazu ein dritter, im Wächter der Mappe selbst: er las `data-quelle` auch aus
den Wähler-Zeichenketten des neuen Skripts und suchte danach eine Datei, deren
Name aus einem Stück JavaScript bestand. Jetzt strukturell auf `<article>`.

**Gemessen:** 85 von 85 Proben grün, 0 rot, 0 nicht lauffähig · Gegenprobe
**25 von 25 gefangen** (acht davon neu, alle zur Markier-Schicht).
**Klaus' Sichttest am Tablet steht aus** — besonders, ob sich mit dem Finger
bequem ziehen lässt und ob Androids eigene Kopieren-Leiste der Farbleiste in
die Quere kommt.

**Nachtrag desselben Tages — Klaus hat es ausprobiert, und zweimal lag ich
falsch:**

1. **Die Farben bedeuten etwas anderes, als ich angenommen hatte.** Es geht
   nicht ums Verbessern, sondern ums **Kürzen**: *„Rot kann komplett weg, Gelb
   kann bleiben oder auch weg — entscheidest du mit, Grün soll bleiben. Lieber
   bleiben als weg."* Beschriftung, Legende und Auslese sind nachgezogen; die
   Schlüssel heißen weiter `gruen/gelb/rot`, vorhandene Markierungen behalten
   also ihre Farbe. **Gelb bleibt** (meine Entscheidung, wie erbeten): ohne
   Gelb landet jede unsichere Stelle bei Rot, und Rot heißt „weg" — das kippt
   gegen Klaus' eigene Regel. Der Grundsatz *im Zweifel bleiben* reist jetzt in
   der ausgelesenen Liste mit, weil die ohne diesen Chat gelesen wird.

2. **Man konnte nicht erkennen, was die Knöpfe bedeuten.** Klaus: *„Du hast da
   stehen nur Zahlen, deswegen konnte ich nicht erkennen, was du damit
   meinst."* Zwei eigene Fehler steckten darin: die Bedeutung stand nur im
   `title` — **auf einem Tablet gibt es kein Hover**, dort ist ein Tooltip
   unerreichbar. Und die Farben waren **Emoji**; fehlt die Schrift des Geräts,
   wird aus „🟩 1 · 🟨 1 · 🟥 1" schlicht „1 · 1 · 1". Seitdem trägt jeder
   Knopf ein **Wort**, der Farbtupfen ist eine **gezeichnete CSS-Fläche**, und
   die Tafel hat eine sichtbare **Legende**. Gemessen wird die Erkennbarkeit,
   nicht die Regel: Wort vorhanden, Tupfen mit Größe und Grundfarbe, Knopf
   mindestens 44 px hoch.

Die Auslese nennt jetzt zusätzlich, **wie viel** je Farbe betroffen ist —
„zwölf Stellen" sagt beim Kürzen nichts, „zwölf Stellen, zusammen 4.800
Zeichen" schon.

**Und ein schlechter Gegenprobe-Fall, benannt statt versteckt:** „Die Auslese
sagt nicht mehr, was die Farben bedeuten" rutschte zuerst durch — zu Recht, er
hatte nur eine von zwei Stellen angefasst und die Zusicherung stand weiter.
Sabotiert wird die **Zusicherung**, nicht eine Zeile.

**Gemessen nach dem Nachtrag:** 85 von 85 Proben grün · Gegenprobe **31 von 31
gefangen**.

**Nächster sinnvoller Schritt:** Klaus markiert; dann die ausgelesene Liste in
den Chat geben, damit eine Sitzung die roten Stellen abarbeitet — unter der
Regel „im Zweifel bleiben".

---

