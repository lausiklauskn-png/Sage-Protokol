# Übergabeprotokoll · 2026-08-23: Antragsmappe und Paper-A-Zusammenfassung

**Rolle:** Bausitzung. Zweig `claude/research-funding-paper-delivery-vuppnj`,
frisch von `origin/main`.

**Auftrag aus dem Brief vom 2026-08-23** (Zweig
`claude/research-funding-next-steps-ib58w2`): Punkt 2 (Paper A kürzen) und
Punkt 3 (die Auslieferung, eine Datei, zwei Abteilungen). Punkt 1 und 4 sind
Klaus' Sache; aus Punkt 1 folgte eine Richtigstellung, siehe unten.

---

## 1 · Paper A: die 47-%-Stelle aus der Zusammenfassung heraus

**Klaus' Befund war richtig, und er war größer als er aussah.** Die
Zusammenfassung rechnete mit vier Begriffen, die bis dahin nirgends erklärt
waren, *die sechs Regeln*, *Schicht*, *Deckel von fünf Euro*, *Fehlschicht*.
Nachgezählt: **das Wort „Schicht" kam im ganzen Papier zum ersten Mal in dieser
Rechnung vor**, Zeile 50 von 1.833. Wer bis dahin gelesen hatte, wusste nicht,
dass es ein gebautes Werkzeug gibt.

**Getan, wie im Brief verlangt: gekürzt, nicht erweitert:**

- Prozentzahl, Cent-Beträge, Token-Schwellen und Schicht-Vergleiche sind aus
  der Zusammenfassung **raus**. Übrig bleibt der Satz, der die These trägt.
  **Nichts geht verloren:** der ganze Rechenweg steht unverändert in § 3.8
  (nachgesehen, nicht angenommen: 47 %, 41 Token, 327 Schichten, 0,31 %
  stehen dort alle).
- **Davor** steht jetzt ein Absatz, der das Werkzeug einführt: Sage-Protokol
  seit dem 10.03.2026, darauf die Werkstatt, fünf Rollen, ein Durchgang heißt
  Schicht, Deckel fünf Euro, mitgeschrieben werden Aufrufe, Token, Kosten,
  Dauer.
- **Und die Unterscheidung, die der Brief verlangt:** *die Dokumentation reicht
  über fünf Monate, die Messung über Tage.* Sie steht jetzt in der
  Zusammenfassung, bevor die erste Zahl fällt.
- Der Anschlussabsatz sagte danach ein zweites Mal „berichtet über fünf Monate
  Betrieb", umformuliert, damit die Angabe einmal dasteht und nicht wie eine
  zweite Auskunft wirkt.

---

## 2 · Die Auslieferung: die Arbeits-Mappe

**Eine Datei, zwei Abteilungen**, jede einzeln herausnehmbar:

| | Abteilung 1 · privat | Abteilung 2 · einreichbar |
|---|---|---|
| Inhalt | `FORSCHUNGSFOERDERUNG.md` | ENTSTEHUNG · PAPER A · FORSCHUNGSKORPUS · PLAN_PAPERS · die vier Werkstatt-Unterlagen |
| Knöpfe | eigener Download, eigener Druck | eigener Download, eigener Druck |
| Kopf | eigener, mit Datum und Herkunft | eigener, mit Datum und Herkunft |

**Drei Entscheidungen, jede mit Grund:**

1. **Die Mappe wird ERZEUGT, nicht gepflegt**, `tools/antragsmappe-bauen.mjs`
   aus den neun `.md`-Quellen. Von Hand gepflegt stünden dieselben Sätze
   zweimal im Depot und liefen auseinander; der Antrag zitierte irgendwann eine
   Fassung, die es nicht mehr gibt.
2. **Drucken über eine Klasse am `<html>`**, nicht über eine zweite Fassung des
   Textes. `html.nur-privat .abteilung:not(#privat){display:none}` und das
   Gegenstück. Gemessen wird im Browser die **Höhe** der anderen Abteilung im
   Augenblick des Druckens, nicht ein Attribut: `hidden` verliert gegen jede
   Klasse mit `display`.
3. **Kein einziger relativer Verweis.** Jeder Verweis aus den Quellen wird
   umgeschrieben: Ziel in der Mappe → interner Anker, sonst → volle
   GitHub-Adresse. Auf dem Tablet liegt die heruntergeladene Datei unter
   `content://…` und hätte kein Verzeichnis, gegen das ein relativer Pfad
   auflöst, der Browser meldete ERR_FILE_NOT_FOUND. 109 Adressen geprüft.

**Zwei Fallen, beide beim Bauen zugeschnappt und behoben:**

- **Der Download hätte tote Knöpfe mitgenommen.** Die herausgenommene Datei
  trägt kein Skript; die Knöpfe darin sähen aus wie Hilfe und täten nichts.
  Sie werden jetzt aus der Kopie entfernt, und eine Prüfung besteht darauf.
- **Der Download-Weg kann gesperrt sein** (in einem veröffentlichten Artifact
  ist er es). Schlägt er fehl, nennt die Seite den Weg, der bleibt, den
  Druck-Knopf daneben. Ein toter Knopf mit Erklärung wäre die schlimmere Sorte.

**Ehrlich dazugesagt, in der Mappe selbst:** „privat" heißt *gehört nicht in
die Mappe, die zur Behörde geht*, **nicht** geheim. Der Text liegt als
der Fahrplan in einem öffentlichen Depot, und die Mappe liegt
daneben. Die fünf persönlichen Angaben (§ 9) stehen absichtlich in keiner von
beiden.

---

## 3 · Was die Wächter gefunden haben, und was an ihnen selbst falsch war

Der erste und wichtigste Wächter ist keine Optik-Prüfung, sondern eine
**Nachzählung**: jede der **2.799** nicht-leeren Quellzeilen muss mit ihrem
Klartext in der Ausgabe wiederauftauchen. Eine Ansicht ist keine zweite
Fassung, aber ein Leser, der eine Zeile verschluckt, macht sie dazu.

**Drei echte Fehler im Leser, alle von dieser Nachzählung gefunden:**

| Was | Wirkung |
|---|---|
| Kursiv brach am Zeilenumbruch ab | rohe Sternchen auf dem Schirm, z. B. bei *Förderung von Wissenschaft und Forschung* |
| Fett vertrug kein Kursiv darin | „**Zu *specification gaming* …**" blieb komplett roh |
| Der Code-Platzhalter war „Leerzeichen + Zahl + Leerzeichen" | **jede nackte Zahl im Text** wäre durch einen Code-Schnipsel ersetzt oder gelöscht worden |

Der dritte ist der schlimmste und stand nur im eigenen Nachlesen. Keine Probe
hätte ihn zu diesem Zeitpunkt gefunden.

**Und drei Fehler in den Wächtern selbst**, jeder hätte für sich allein
ausgereicht, die Arbeit falsch zu bewerten:

- **Jedes Tag durch ein Leerzeichen zu ersetzen** machte aus „keine KIs**.**"
  ein „keine KIs." mit Lücke. **320 Zeilen** wurden als fehlend gemeldet, die
  alle dastanden. Ein Wächter, der aus dem eigenen Messfehler rot wird, ist
  genauso wertlos wie einer, der blind grün ist.
- **Den Unterstrich als Auszeichnung zu behandeln** zerlegte Dateinamen
  (`MEILENSTEIN_SEMANTISCHE_SUCHE.md`, `__20k.html`), weitere 70 Fehlalarme.
- **„Der Download enthält die andere Abteilung nicht" am Wortlaut geprüft**
  wurde rot, sobald der Fahrplan in § 11 die Mappe selbst beschreibt und dabei
  das Wort „Forschungsunterlagen" benutzt. Es wird jetzt **strukturell**
  geprüft: genau EIN `<section data-abteilung>`, und es ist das richtige.
  *Ein Wächter nagelt eine Aussage fest, keine Wörter*, dieselbe Lehre wie in
  Kimhub am 2026-08-22, hier zum zweiten Mal.

Nachtrag zum letzten Punkt: die erste strukturelle Fassung zählte auch den
CSS-Wähler `[data-abteilung="privat"]` im Stilblock mit und meldete den
Fahrplan doppelt, ohne dass etwas doppelt dastand.

**Drei Proben, nicht eine**, weil sie verschieden brechen:

```bash
node tests/smoke_antragsmappe.mjs           # liest die Datei
node tests/smoke_antragsmappe_browser.mjs   # ÖFFNET sie wirklich
node tests/gegenprobe_antragsmappe.mjs      # 17 eingebaute Fehler
```

Die Browser-Probe gibt es, weil eine Prüfung, die eine Datei **liest**, nicht
misst, ob sie **läuft**, genau diese Lücke hat in Kimhub am 2026-08-23 eine
Werkbank stillgelegt, während alle Prüfungen grün blieben.

**Gemessen: 84 von 84 Proben grün, 0 rot, 0 nicht lauffähig · Gegenprobe 17 von
17 gefangen.**

---

## 4 · Eine Richtigstellung, die aus Punkt 1 des Briefes folgte

`FORSCHUNGSFOERDERUNG.md` § Weg 2 sagte: *„Kimhub führt bereits ein Fahrtenbuch
mit Zeiten, dazu die Belege."* Das stimmt, nur **seit dem 22.08.2026**, also
seit einem Tag. Der Satz stand neben der Aussage, es lägen fünf Monate
Vorleistung vor, und las sich dadurch, als sei die ganze Zeit gestundet worden.

Nachgezogen an drei Stellen (§ Weg 2, B3, D2), mit einer Tabelle, die die zwei
Belegsorten und ihre Reichweite trennt. **Dokumentierte Zeit und gemessene Zeit
sind zwei Dinge**, und was älter ist als das Fahrtenbuch, wird **rekonstruiert**,
und gehört als Rekonstruktion gekennzeichnet, nicht als mitlaufende
Aufzeichnung ausgegeben. Eine geratene Stundenzahl in einem Antrag sieht genau
wie eine geführte aus, bis jemand nachfragt.

---

## 5 · Was NICHT getan wurde, und warum

- **Punkt 1 und 4 des Briefes sind Klaus' Sache** (ORCID,
  Zenodo, Vorgespräche). Sie stehen im Fahrplan, abhakbar, und keine Sitzung
  kann sie erledigen.
- **Am Inhalt der Papers wurde sonst nichts geändert**, der Brief sagt
  ausdrücklich: nichts neu bauen, solange Klaus nicht darum bittet.
- **`docs/papers/README.md` nennt Paper A nicht.** Es beschreibt die
  Sonnen-Galaxie-Stationen und sagt „heute stehen hier zwei Dateien". Das ist
  seit dem Paper-Bau überholt. Nicht angefasst: es ist eine andere Baustelle,
  und ein halber Umbau daran wäre schlimmer als der jetzige Stand.

---

## 6 · Der Widerspruch, der besprochen gehört (nicht abgewartet)

**Paper A sagt an vier Stellen, die Rollen hätten keine Werkzeuge.** § 1:
*„Keine hat Werkzeuge — sie kann nichts ausführen, nichts öffnen, nichts
messen."* Das ist Regel 6 und trägt einen der vier durchgeführten Fälle in
§ 3.5. Auch `docs/werkstatt/WERKSTATTREGELN.md` und `BEFUND.md` sagen es.

**Kimhubs eigene Verfassung sagt seit dem 2026-08-23 das Gegenteil**, auf
Klaus' Wort: *„die agenten bekommen die entsprechenden werkzeuge in die hand …
nur leserechte z.bsp. oder Internetzugriff."* Gemessen am selben Tag, an Klaus'
Gerät: ein Werkzeug-Aufruf, `datei_lesen`, 0,36 Cent.

**Die Momentaufnahme in `docs/werkstatt/` ist damit am Tag ihrer Anlage
überholt**. Sie trägt das Datum 2026-08-23 und beschreibt den Stand davor.

**Nicht angefasst, weil es eine inhaltliche Entscheidung ist**, und weil das
Papier eine Feldbeobachtung über einen *vergangenen* Zeitraum ist: für die
beschriebenen fünf Monate stimmt der Satz. **Aber er steht im Präsens**, das
Papier verlinkt das Depot, und ein Gutachter, der hineinsieht, findet den
Widerspruch. Drei Wege, Klaus entscheidet:

1. **Zeitform und Datum**, „im beobachteten Zeitraum hatten die Rollen keine
   Werkzeuge; seit dem 2026-08-23 haben sie lesende". Kleinster Eingriff, macht
   die Aussage wahr, kostet nichts an Beweiskraft.
2. **Als Befund aufnehmen**, die Regel „du hast keine Werkzeuge" ist nicht
   gealtert, sie wurde durch einen **Umbau** abgelöst. § 3.5 sagt selbst, die
   Abhilfe sei *„eine Änderung am Aufbau: der Rolle Werkzeuge geben"*. Genau
   das ist eingetreten. Das ist der stärkere Weg, aber er kostet Arbeit.
3. **Nichts tun** und die Momentaufnahme als solche stehen lassen. Ehrlich nur,
   wenn die Zeitform stimmt, also nicht ohne Weg 1.

---

## Nächste Schritte

1. **Klaus sieht die Mappe im Browser an**. Beide Knöpfe je Abteilung.
   Headless ist grün, aber der Sichttest ist nicht ersetzbar; besonders der
   Download auf dem Tablet ist von hier aus **ungeprüft**.
2. **Den Werkzeug-Widerspruch entscheiden** (Punkt 6). Er betrifft ein Papier,
   das eingereicht werden soll.
3. **Stundenaufzeichnung ab sofort** (Fahrplan D2). Der einzige Punkt ohne
   Vorlaufzeit. Er kostet nichts und verliert mit jedem Tag.
4. **ein Behörden-Schritt mit Vorlaufzeit** (A2b) parallel zum der Termin, der Klaus’ Sache ist. Der Brief
   kommt per Post; das ist der Schritt, der sonst still zum Engpass wird.
