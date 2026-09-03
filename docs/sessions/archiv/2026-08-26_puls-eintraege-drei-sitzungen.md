# PULS-Einträge vom 2026-08-26 — drei Sitzungen

*Ausgelagerte PULS-Einträge — **Wortlaut unverändert**. Sie standen bis zum
2026-09-03 in [`docs/PULS.md`](../../PULS.md) und wurden von dort ins Archiv
verschoben, weil die Datei bei **2.927 von 3.000 Zeilen** stand. Die
Schutz-Klausel im Kopf der PULS verlangt **auslagern statt kürzen** — hier ist
nichts zusammengefasst, nichts weggelassen. Im PULS steht an ihrer Stelle ein
Zeiger auf diese Datei.*

*Übergabeprotokolle: [`2026-08-26_lueckenlose-dokumentation.md`](2026-08-26_lueckenlose-dokumentation.md) und [`2026-08-26_unterlagen-der-reihe-nach.md`](2026-08-26_unterlagen-der-reihe-nach.md). Für den dritten Eintrag (Forschungsaufgaben) gibt es **kein eigenes Übergabeprotokoll** — er war die Fortsetzung derselben Sitzung; sein Wortlaut hier ist die einzige Fassung.*

> **Zu den Verweisen im Wortlaut:** die Links wurden geschrieben, als der Text in
> `docs/PULS.md` stand, und sind deshalb relativ zu **`docs/`** gemeint. Aus diesem
> Verzeichnis lösen sie nicht auf. Wer einem folgen will, stellt `docs/` davor —
> ein Verweis auf `papers/…` meint `docs/papers/…`. Verweise auf `http…` und auf
> Nachbardateien in diesem Verzeichnis stimmen. **Der Wortlaut wurde dafür NICHT
> angefasst**: eine ausgelagerte Fassung, die sich vom Original unterscheidet, wäre
> keine Auslagerung mehr.

---

## Stand 2026-08-26 (Bau, 3.) · 🔬 Forschungsaufgaben, und jede Sitzung wird eine Messung

**Rolle:** Fortsetzung derselben Sitzung, nach Klaus' Rückfragen. PR #923
(Sage) und PR #67 (Kimhub).

### Klaus hatte recht zu fragen

Er las im heruntergeladenen PDF, dass vier Dinge fehlen, und bat um eine
Nachprüfung. **Sein PDF war älter als das Depot**: es führte das Blatt zum
Stand der Technik als fehlend, während es am selben Tag entstanden war.
Nachgesehen über den ganzen Baum:

| | Stand |
|---|---|
| Blatt „Stand der Technik" | **existiert**, `docs/ABGRENZUNG.md` |
| Englische Projektseite | **existiert nicht**, kein Entwurf |
| Paper C · KI-Kompetenz | **existiert nicht**, Gerüst in `PLAN_PAPERS.md` |
| Paper B · Wirkung | **existiert nicht**, Gerüst in `PLAN_PAPERS.md` |

Einen DOI gibt es auch nicht.

### Abteilung 7: die Forschungsaufgaben

`docs/unterlagen/06_FORSCHUNGSAUFGABEN.md`, erzeugt aus
`tools/forschungsaufgaben-bauen.mjs`. Sieben Aufgaben mit Frage, Beleg,
Abhängigkeit und Reihenfolge, dazu die drei Stränge.

**Zwei Dinge werden darin getrennt gehalten**, weil ihre Vermischung das Blatt
wertlos machte: ob ein **Beleg im Depot liegt** (messbar) und ob die **Aufgabe
erledigt** ist (nicht messbar). **Keine der sieben ist erledigt.** Der
Zenodo-Upload ist der deutlichste Fall: die Papers liegen seit Mai vor,
hochgeladen ist nichts, und eine Nummer wäre ohnehin keine Datei.

### Eine Zahl, die ihre eigene Historie mitzählt

Nach dem Merge stand die Unterlagen-Mappe als geändert da: 238 auf 239
Stände. Der Merge hatte ein Sitzungsprotokoll abgelegt, und die
Bestandsaufnahme zählt genau das mit. **Kein Fehler, eine Eigenschaft**, und
sie steht jetzt im Blatt: das Blatt ist nach jedem Commit veraltet, bis es neu
gebaut wird, und der Wächter sagt das auch.

⚠ **Beim Aufschreiben dieser Erklärung ein Beinahe-Fehler**, und er ist der
lehrreichere: die Backticks um einen Dateinamen standen in einem
Template-Literal und haben es geschlossen. Der Bau brach mit einem
Syntaxfehler ab, **und die Proben blieben grün**. Sie messen das Erzeugnis,
und das Erzeugnis war noch das alte, in sich stimmige. **Ein Werkzeug, das gar
nicht läuft, hinterlässt keine Spur in einer Probe, die nur sein Erzeugnis
ansieht.** Gesehen nur, weil die Fehlermeldung zufällig über der grünen Zeile
stand.

### Und Kimhub zeichnet ab heute jede Sitzung auf

Klaus: *„handhabe ab dem heutigen Zeitpunkt jede Sitzung so wie ein
Forschungsprojekt, mit dokumentierten Messungen."* Gebaut in Kimhub
(`forschung/`), PR #67. Gemessen wird, **woher jeder Befund kam**: `regel` ·
`gegenprobe` · `hinsehen` · `klaus`.

Auf seine Frage *„Ist da schon Forschung, wenn dokumentiert?"* war die Antwort
**nein**. Was fehlte, war eine Vorhersage, die scheitern kann und **vor** den
Daten dasteht. Sie steht seitdem fest, mit Wortlaut-Riegel.

> **Für die nächste Sitzung, netzweit:** wer hier arbeitet, trägt sich am Ende
> in `Kimhub/forschung/sitzungen.json` ein. Sonst stirbt der Datensatz nach
> einem Eintrag, und die Vorhersage wird nie auswertbar.

**Gemessen:** 93 Proben grün, 0 rot · fünf Gegenproben einzeln nacheinander,
alle vollständig (11 · 35 · 14 · 17 · 13).

**Offen:** Klaus' Sichttest · Paper C, englische Seite, Paper B · die
Entscheidungen aus `BRIEF_nach_bestandsaufnahme.md` § 1.

---

## Stand 2026-08-26 (Bau, 2.) · 📚 Die lückenlose Dokumentation

**Rolle:** Fortsetzung. Zweig `claude/dokumentation-bestandsaufnahme-ph81s1`,
PR #922. Auftrag aus `BRIEF_lueckenlose_dokumentation.md`, dazu drei
Nachforderungen von Klaus im Lauf der Sitzung.

**Zuerst ausgelagert, dann geschrieben.** Die Datei stand bei 2.833 Zeilen. Die
siebte Auslagerung nimmt beide Einträge vom 19.08. wortwörtlich heraus, jetzt
2.709.

### Die Frage des Briefes, beantwortet, und sie war falsch gestellt

Fällt die Protokoll-Dichte, weil die Dokumentation nachlässt, oder weil die
Sitzungen länger wurden? Beides ergibt dieselbe Kurve, wenn man Einträge je
Protokoll zählt. **Tage lassen sich dagegen zählen:** von 128 Arbeitstagen
tragen **48** ein Protokoll, das sind 38 Prozent.

Der April löst sich dabei auf. Seine 551 Einträge liegen in **Mein-Rezeptbuch
(288), Muttis-Rezeptbuch (206) und Mein-Mixarium (55)**; Sage-Protokol hatte in
diesem Monat **einen**. Die Protokollpflicht ist eine Sage-Regel. Das erste
Protokoll überhaupt stammt vom **10.05.**, in den App-Depots beginnt die Praxis
Ende Mai. **Im April gab es sie nirgends.**

> Der Befund davor verglich netzweite Einträge gegen Protokolle eines einzigen
> Depots. Beide Zahlen waren richtig, ihr Verhältnis war es nicht. **Eine
> Differenz aus zwei ungleichen Messungen ist keine Messung**, und diesmal
> stand sie im eigenen Brief.

### Was gebaut wurde

| | |
|---|---|
| `tools/bestand-rechnen.mjs` | die **eine** Quelle der Rechnung |
| `tools/bestand-bauen.mjs` | schreibt beide Blätter, Zeitraum und Umfang aus `git log` |
| `docs/unterlagen/04_BESTAND.md` | Abteilung 5: was es gibt, wo, seit wann, welche Lücke |
| `docs/unterlagen/05_APRIL.md` | Abteilung 6: der April, als Rekonstruktion gekennzeichnet |
| `docs/ABGRENZUNG.md` | Abteilung 2 der Antragsmappe, vor Paper A |
| `tests/smoke_bestand.mjs` · `smoke_zahlen.mjs` | zwei neue Wächter, beide mit Gegenprobe |

Die Bestandsaufnahme zeigt **dieselbe Liste zweimal**: nach Vorgehen und
chronologisch. Zwei Listen wären eine Drift-Quelle mit Ansage.

### Vier Widersprüche, alle in Unterlagen, die aus dem Haus gehen

| stand da | gemessen |
|---|---|
| „27 Tage nichts" | **26** |
| „140 Kalendertage" | **141** |
| „genau **eine** Lücke von vier Tagen" | **neun** Unterbrechungen, die längste **drei** Tage |
| 5.823 und 5.775, beide „Einträge" | beide richtig, die Differenz sind die 48 zeitgesteuerten Läufe |

**Die dritte war die gefährlichste.** Neben dem Text liegt die Tages-Tabelle,
in der jeder die Unterbrechungen nachzählen kann. Eine Zahl, die man selbst
berichtigt, trägt weiter als eine, die jemand anders berichtigt.

Dazu eine Angabe, die **wahr ist und beim Nachprüfen falsch aussieht**: der
Forschungskorpus nennt die Demo „erster lauffähiger Stand vom 10. März 2026".
Der Inhalt stimmt, der Ordner kam am **2026-08-15** ins Depot (#855), weil er
bis dahin an eine konkrete Anfrage gebunden war. Beides steht jetzt da.

Und in `ENTSTEHUNG.md` war „mehr als doppelte Arbeitszeit" seit dem 24.08.
nachrechenbar: die **Spanne** ergibt 81,1 Stunden je Woche (2,03-fach), die
**aktive Zeit** 49,7 (1,24-fach). Klaus' Schätzung trifft die erste. Wer sie im
Antrag verwendet, schreibt dazu, welche gemeint ist.

### Fünf eigene Fehler, jeder von einer Gegenprobe gefunden

- **Ein flacher Klon liefert Zeiträume, die wie Messungen aussehen.** Der erste
  Lauf gab für `LEHREN.md` „2026-08-22 bis 2026-08-22" aus. Der Container-Klon
  trug nur die letzten fünfzig Einträge. **Nichts daran sah falsch aus.** Das
  Werkzeug bricht jetzt ab, statt zu stempeln. Dieselbe Falle steht seit dem
  24.08. in der Historie, wo achtzehn Klone vor dem Auslesen vervollständigt
  wurden. Hier hatte niemand daran gedacht.
- **Der Wächter dazu fand sein Datum woanders** im Blatt, in einem Abschnitt
  aus einer anderen Rechnung, und blieb grün, während jede Zeitraum-Angabe
  gestempelt war.
- **Zwei Kennzahlen mit demselben Namen** fing keine Prüfung. Genau der Fehler,
  gegen den das Blatt gebaut ist.
- **Die Zahl der Unterbrechungen** wurde nie gegen den Text geprüft. Ein
  Wächter, der nur das Falsche verbietet, misst nicht, ob das Richtige dasteht.
- **Ein erfundenes Zitat** in `werkstatt/BEFUND.md`: die Regel heißt „Du hast
  keine Werkzeuge", der längere Satz in Anführungszeichen stand so in keiner
  Quelle. Der Gedankenstrich-Wächter ließ ihn durch, **weil** er in
  Anführungszeichen stand.

### Zwei Wächter, die zu eng gemessen haben

Die Zahl der Quelldateien stand als `9` daneben und wurde beim Einbau des
Abgrenzungs-Blattes rot. Sie prüfte damit nur sich selbst. Jetzt steht dort
eine **Namensliste**, und ein Ausfall sagt, welche Datei fehlt.

Der Lücken-Wächter zählte das Wort „existiert nicht" und wurde rot, **weil eine
Lücke geschlossen wurde**. Die zweite Fassung zählte mehr Wörter und war zu
nachsichtig: die Gegenprobe ersetzte eine Zeile durch „in Arbeit", und die
anderen trugen die Zahl allein. Jetzt braucht **jede Zeile** der Tabelle einen
Stand aus einer anerkannten Liste.

### Gedankenstriche, netzweit gemessen (Klaus' Frage)

| was aus dem Haus geht | sichtbar | wovon |
|---|---|---|
| Unterlagen-Mappe, sechs Abteilungen | **0** | |
| Fragen-Blatt | **0** | |
| Antragsmappe | 18 | **alle** aus den zwei Byte-Kopien aus Kimhub, Prüfsummen in `werkstatt/README.md` |
| Historie | 5.349 | **alle** aus zitierten Commit-Betreffen, eigener Rahmen **0** |
| Arbeitszeit-Nachweis | 847 | dasselbe, eigener Rahmen **0** |
| SBKIM-Papers DE/EN | 20 / 17 | **v0.1-Vorabveröffentlichung, Mai 2026**, in `INTERFACES.md` mit Paragraphennummern zitiert |

Im Depot insgesamt: **13.131**, davon 7.238 in lebenden Arbeitstexten (Doku
4.943, Briefe 1.674, Wurzel 316, Skills 305). Das sind keine Unterlagen.

**Die Papers sind die eine offene Entscheidung.** Eine datierte v0.1 still
umzuschreiben, während `INTERFACES.md` sie mit Paragraphennummern zitiert,
erzeugte zwei Fassungen mit derselben Nummer. Das braucht eine v0.2 und Klaus'
Wort.

### Klaus' Downloads, geprüft

Elf Dateien von seinem Gerät, byte-weise gegen das Depot gehalten: **neun
identisch**, BOM vorhanden, PDFs vollständig. Zwei sind **ältere Downloads**:
`antragsmappe.html` steht auf Stand 23.08., `historie.html` stammt von vor der
BOM-Reparatur am 24.08. Kein Fehler, aber der Beleg dafür, dass eine
heruntergeladene Datei keinen Rückweg hat. Beide tragen ihr Erzeugungsdatum im
Dokument, deshalb war es überhaupt zu sehen.

Dazu `klauszeit.txt`, der Export von Kimhubs Stechuhr: **zweimal gedrückt, 16
Sekunden**. Als Zeitquelle unbrauchbar, und genau deshalb wird der Nachweis aus
den Einträgen gerechnet. Steht so in der Bestandsaufnahme.

**Gemessen:** 92 Proben grün, 0 rot, 0 nicht lauffähig · Gegenproben einzeln
nacheinander: Antragsmappe 35 von 35, Unterlagen 14 von 14, Bestand 17 von 17,
Zahlen 13 von 13 · neun PDFs neu gebaut, vier davon neu.

**Offen:** Klaus' Sichttest · die Gedankenstriche in den beiden Papers
(braucht v0.2 und sein Wort) · der Werkzeug-Widerspruch in Paper A · die
Literatursuche zum Abgrenzungs-Blatt · die englische Projektseite · die
Anmeldung nach § 5c.

---

## Stand 2026-08-26 (Bau) · 📁 Die Unterlagen der Reihe nach

**Rolle:** Fortsetzung. Zweig `claude/research-funding-paper-delivery-vuppnj`.
Klaus: *„Gib mir bitte aus allen Sitzungen der Reihe nach die Download-Dokumente:
Fahrplan, Fragen-Blatt, Behörden-Blatt, Arbeitszeit-Nachweis,
Forschungsunterlagen inkl. Papers, und was noch fehlt für die Erreichung bei den
entsprechenden Stellen. Schaue gründlich nach, gegebenenfalls passe an."*

### ⚠ Zum zweiten Mal an drei Tagen: eine Sitzung lief parallel

Während dieser Bau lief, hat eine **zweite Sitzung dasselbe gebaut** (PR #917
bis #919): ein Fragen-Blatt, mit eigener Probe und
Gegenprobe. Gemerkt beim Push, nicht davor.

**Ihres gewinnt, und das ist keine Höflichkeit.** Es ist gründlicher:
Sachverhalt in sieben Sätzen, sieben nummerierte Fragen, 75 Rechnungen, echte
Zahlen. Meines ist **gelöscht**; Abteilung 3 der neuen Mappe zeigt jetzt auf
das Fragen-Blatt. Zwei Blätter zur selben Auskunft wären zwei
Quellen der Wahrheit gewesen, und die eine wüsste nichts von der anderen.

**Beim Zusammenführen fiel eine Lücke in ihrem Blatt auf:** die
**Kleinunternehmerregelung** steht dort nur als Aufzählungspunkt unter Frage 7,
nicht als eigene Frage. Der Fragebogen zur steuerlichen Erfassung verlangt aber
ein Kreuz. Benannt, nicht umfahren.

**Und ihr Text hat einen Messfehler in meinem Wächter aufgedeckt:**
`klartext()` entfernte Sternchen **auch innerhalb eines Code-Abschnitts**. An
`docs/historie/arbeitstage.*` meldete er eine Zeile als fehlend, die
vollständig dastand. Dieselbe Sorte wie beim Unterstrich in Dateinamen, nur ein
Zeichen weiter. Behoben, und beide Mappen-Proben sind dadurch genauer.

### Der Bestand, nachgesehen statt angenommen

**Drei der fünf gab es, zwei nicht** (das Frageblatt kam parallel dazu). Fahrplan (`FORSCHUNGSFOERDERUNG.md`),
Arbeitszeit-Nachweis (`historie/arbeitstage.*`) und Forschungsunterlagen
(Antragsmappe, Abteilung 2) lagen vor. **Fragen-Blatt und
Behörden-Blatt existierten überhaupt nicht.**

Neu, unter `docs/unterlagen/`: Übersicht mit „Was noch fehlt" · die Schritte in
der Reihenfolge ihrer Abhängigkeiten · Vorbereitung für die Behörde. Zusammengebaut zu die Unterlagen-Mappe, vier Abteilungen, **jede
einzeln herunterzuladen und einzeln zu drucken**.

### Der Widerspruch, den das gründliche Nachsehen gefunden hat

**Schritt B4 des Fahrplans stand gegen § 4 derselben Datei.** B4 verlangte
Lizenz-Dateien für `BookLedgerPro` und `Meine-In-and-Out-Book`; § 4 hatte am
2026-08-24 nachgemessen, dass `BookLedgerPro` seit dem 16.08. eine trägt (im
Container lag ein veralteter Klon) und `Meine-In-and-Out-Book` ein leeres Depot
ohne einen einzigen Commit ist. **§ 4 war gemessen, B4 abgeschrieben.**
Nachgezogen, mit dem Grund daneben.

### Ein Werkzeug für zwei Mappen, nicht zwei Werkzeuge

`antragsmappe-bauen.mjs` kannte eine Mappe, und **zwei Druckregeln nannten deren
Abteilungen mit Namen**. Sie werden jetzt aus der Liste erzeugt. Eine dritte
Abteilung wäre sonst stumm nicht druckbar gewesen: der Knopf hätte gearbeitet,
das Blatt hätte alles gezeigt.

**Und dabei ist ein echter Fehler entstanden, den die Gegenprobe gefunden hat:**
die Anker-Karte galt zuerst über **beide** Mappen. Ein Verweis aus der
Unterlagen-Mappe auf `FORSCHUNGSFOERDERUNG.md` wurde damit zu `#q-docs-...`,
dessen Ziel nur in der **anderen** Datei steht. Ein Sprung ins Leere, der
aussieht wie ein Verweis. Anker jetzt je Mappe.

### Fünf blinde Wächter, alle von der Gegenprobe entlarvt

| | |
|---|---|
| Der Download-Wächter **klonte die Abteilung selbst** statt den Knopf zu drücken | er maß seine eigene Funktion |
| „keine Abschrift des Formulars" | fand den Satz im **Warnkasten des Generators** |
| „keine steuerliche Beratung" | fand ihn im **anderen** Blatt |
| „Was noch fehlt" mit `/i` | fand „was noch fehlt" klein in der Einleitung derselben Abteilung |
| der Anker-Fall | sabotierte nichts, weil es gar keinen relativen Verweis mehr gab |

Die drei mittleren sind dieselbe Sorte: **die Prüfung findet ihren Satz
woanders.** Gemessen wird jetzt im Abschnitt, zu dem die Aussage gehört, und
beim letzten am **Inhalt** statt an der Überschrift.

**Nebenbefund:** vier Gedankenstriche in der Markier-Legende. Der bestehende
Wächter misst die **Quellen**, der neue die **Ansicht** und ist damit strenger.
Aufgelöst.

**Gemessen:** 90 von 90 Proben grün · Gegenprobe Unterlagen 14 von 14 ·
Antragsmappe 32 von 32 · Historie 9 von 9 · Arbeitstage 16 von 16 ·
Frageblatt der Nachbarsitzung unberührt grün.

**PDFs:** `unterlagen.pdf` (15 Seiten) und je Abteilung eines, über
`tools/html-zu-pdf.mjs --nur <id>`. Das setzt **dieselbe** Klasse wie der Knopf
in der Seite, statt eine zweite Auswahl-Logik zu bauen.

**Offen:** Klaus' Sichttest · der Werkzeug-Widerspruch in Paper A (**vor**
Zenodo) · das Blatt „Stand der Technik und Abgrenzung", das es noch gar nicht
gibt und das jeder Leser zuerst braucht · die Anmeldung nach § 5c.
