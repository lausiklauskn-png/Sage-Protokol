# Ein Papier bei Zenodo veröffentlichen — der Weg, Schritt für Schritt

**Stand 2026-09-03.** Geschrieben, nachdem der Weg für das SBKIM-Papier einmal
gegangen war und dabei **zwei Sitzungen** gekostet hat, weil der entscheidende
Schritt erst am Ende gefunden wurde.

Diese Datei gilt für Paper A, B und C gleichermaßen.

---

## ⚠ Was eine Sitzung hier NICHT tun kann

**Gemessen am 2026-09-03 aus dieser Umgebung:**

| Adresse | Antwort |
|---|---|
| `https://zenodo.org/` | keine Verbindung |
| `https://doi.org/…` | keine Verbindung |

Der Ausgangs-Vermittler lässt beide nicht durch. **Eine Sitzung kann deshalb
nichts hochladen, nichts reservieren und nichts veröffentlichen** — und sie kann
auch nicht nachsehen, ob ein Eintrag richtig aussieht.

Daraus folgt die Arbeitsteilung, und sie ist keine Bequemlichkeit:

| Klaus, im Browser | die Sitzung, im Depot |
|---|---|
| DOI **reservieren** | HTML und PDF bauen |
| Dateien **hochladen** | den DOI in die Dateien eintragen |
| Angaben ausfüllen, **veröffentlichen** | den DOI an allen vier Stellen nachziehen |

**Wer eine Aussage über die Zenodo-Seite trifft, ohne sie gesehen zu haben,
rät.** Das gehört dazugesagt.

---

## Die Reihenfolge, und warum sie nicht tauschbar ist

> **Der DOI wird RESERVIERT, bevor die Dateien hochgehen.**

Zenodo sagt es selbst: *„Reservieren Sie eine DOI, damit sie vor dem Hochladen
in die Dateien eingefügt werden kann."*

Der Grund ist der, an dem die erste Sitzung gescheitert ist: **das gedruckte
Papier muss seinen eigenen DOI tragen.** Wer erst hochlädt, bekommt den DOI erst
danach — und müsste die Datei mit dem eingetragenen DOI noch einmal hochladen.
Ein DOI ist unveränderlich; was einmal darunter liegt, bleibt dort.

---

## Schritt 1 · Klaus: den Eintrag anlegen und den DOI reservieren

1. Bei **zenodo.org** anmelden.
2. **New upload** wählen.
3. Noch **nichts** hochladen.
4. Bei **Digital Object Identifier** auf **„Reserve DOI"** drücken.
5. Die Nummer erscheint, etwa `10.5281/zenodo.22277738`. **Diese Nummer in den
   Chat kopieren.**

Hier hört Klaus' Arbeit für den Moment auf.

---

## Schritt 2 · Die Sitzung: den DOI eintragen und die Dateien bauen

```bash
node tools/paper-md-zu-html.mjs docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.md \
     --ziel docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.html \
     --doi 10.5281/zenodo.NNNNNNNN

node tools/paper-md-zu-html.mjs docs/papers/rules-and-principles-in-ai-agent-systems.md \
     --ziel docs/papers/rules-and-principles-in-ai-agent-systems.html \
     --sprache en --doi 10.5281/zenodo.NNNNNNNN

node tools/paper-zu-pdf.mjs docs/papers/regeln-und-grundsaetze-in-ki-agentensystemen.html \
     --ziel /tmp/regeln-und-grundsaetze-in-ki-agentensystemen.pdf
node tools/paper-zu-pdf.mjs docs/papers/rules-and-principles-in-ai-agent-systems.html \
     --ziel /tmp/rules-and-principles-in-ai-agent-systems.pdf

node tools/paper-pdf-pruefen.mjs /tmp/regeln-und-grundsaetze-in-ki-agentensystemen.pdf
node tools/paper-pdf-pruefen.mjs /tmp/rules-and-principles-in-ai-agent-systems.pdf
node tests/smoke_paper_a.mjs
```

**Ohne `--doi` schreibt der Erzeuger einen Platzhalter, der als solcher zu lesen
ist,** und warnt auf der Kommandozeile. Ein leeres Feld sähe aus wie ein
Dokument ohne DOI; ein stiller Platzhalter sähe aus wie eines mit.

⚠ **Das PDF wird NICHT ins Depot gelegt.** Die beiden SBKIM-Papers liegen dort
auch nur als HTML — das PDF entsteht aus ihr und wäre eine zweite Fassung
desselben Textes. Es wird gebaut, hochgeladen und liegt danach in Klaus'
Download-Ordner.

---

## Schritt 3 · Klaus: hochladen und veröffentlichen

1. **BEIDE PDF-Dateien** in denselben Zenodo-Eintrag hochladen, die deutsche
   und die englische. Sie sind **ein** Werk in zwei Sprachen, so wie beim
   SBKIM-Papier: ein Eintrag, zwei Dateien, ein DOI. Zwei getrennte Einträge
   machten aus einer Arbeit zwei, und wer die eine zitiert, hätte die andere
   nicht mit erfasst.
2. Die Angaben ausfüllen:

| Feld | Wert für Paper A |
|---|---|
| Resource type | **Preprint** |
| Title | Regeln und Grundsätze: Zwei Arten, ein KI-System zu lenken, und warum keine allein genügt |
| Authors | Klaus Nitzsche |
| Description | die Zusammenfassung aus dem Papier (Abschnitt „Zusammenfassung", 322 Wörter) |
| License | **Creative Commons Attribution 4.0 International (CC BY 4.0)** |
| Keywords | die sieben unten, zum Abschreiben |
| Language | Deutsch (die englische Fassung liegt als zweite Datei bei) |

### Die Schlagwörter stehen HIER und nicht im Papier

**Klaus 2026-09-03:** *„aus dem Paper habe ich sie streichen lassen, da waren
sie nicht richtig"* — und dazu: *„ich habe ein Konto bei Zenodo, dort sollen die
Schlagwörter rein."*

Die Wörter selbst sind also in Ordnung, **nur ihr Platz war falsch**. Ein
Schlagwort ist kein Bestandteil des Textes, sondern eine Angabe des Eintrags:
es dient dem Finden, nicht dem Lesen. Im PDF steht es niemandem zur Verfügung,
der sucht; im Zenodo-Formular schon.

Zum Abschreiben, wie sie bis zum 2026-09-03 im Papier standen:

```
Lenkung von KI-Systemen
Regeln und Standards
grundsatzbasierte Regel
Mehr-Agenten-Systeme
Ausführungszeit-Alignment
Betreiber-Steuerung
Feldbeobachtung
```

Weil der Eintrag **beide Sprachfassungen** trägt, lohnen die englischen
Entsprechungen daneben — gesucht wird international, und ein deutsches
Schlagwort findet kein englischsprachiger Leser:

```
AI system steering
rules versus standards
principle-based rule
multi-agent systems
run-time alignment
operator control
field observation
```

> ⚠ **Und was hier vorher stand, war ein Missverständnis meinerseits.** Ich
> hatte „da waren sie nicht richtig" als „inhaltlich falsch" gelesen und
> daraufhin geschrieben, es dürfe keine Ersatzliste geben. Gemeint war „an der
> falschen Stelle". Die Liste steht deshalb wieder da, nur an dem Ort, an den
> sie gehört.

3. **Publish** drücken.

Nach dem Veröffentlichen gibt es **zwei** DOIs, und sie haben verschiedene
Aufgaben — die Zuordnung steht ausführlich in
[`README.md`](README.md) § „Die DOIs":

| | wofür |
|---|---|
| **Versions-DOI** (der reservierte) | steht **im Papier selbst** |
| **Concept-DOI** (legt Zenodo dazu an) | für dauerhafte Verweise: führt immer zur neuesten Fassung |

**Beide Nummern in den Chat kopieren.**

---

## Schritt 4 · Die Sitzung: den DOI überall nachziehen

Beim SBKIM-Papier waren es **vier** Stellen. Für Paper A:

| Wo | Was |
|---|---|
| `regeln-und-grundsaetze-in-ki-agentensystemen.html` | die `paper-doi`-Zeile (kommt aus `--doi`) |
| `docs/papers/README.md` | der Abschnitt zu den DOIs |
| `index.html` | die Geschichts-Galerie, wenn Paper A dort eine Station bekommt |
| `docs/PULS.md` | im Eintrag zur Veröffentlichung |

Danach `node tests/smoke_paper_a.mjs` — die Probe verlangt, dass der DOI
entweder echt ist **oder** ausdrücklich als fehlend vermerkt.

---

## Die Fallen, jede einmal bezahlt

- **Chromium kommt aus dem Container nicht an Google Fonts** und setzt dann
  **still** eine Ersatzschrift ein; `curl` kommt durch. `paper-zu-pdf.mjs` löst
  das und bricht ab, wenn die Schrift fehlt — wer ein eigenes Werkzeug baut,
  tappt hinein.
- **Der Prüfer läuft VOR dem Druck.** Schlägt eine Prüfung fehl, wird **kein**
  PDF geschrieben: ein halb richtiges PDF sieht aus wie ein Nachweis.
- **Ein unbekanntes Papier wird abgewiesen.** `paper-zu-pdf.mjs` führt je Papier
  eine Erwartung (Titel, Abschnittszahl). Wer ein neues Papier druckt, trägt es
  dort ein — sonst druckte das Werkzeug ungeprüft.
- **Der Geometrie-Prüfer über-meldet.** `paper-umbruch-pruefen.mjs` misst das
  Druck-Layout des Browsers und meldete für Paper A **acht** zerrissene
  Tabellen. Im fertigen PDF war **keine** davon zerrissen — `break-inside:avoid`
  greift erst beim echten Druck. Der Prüfer sagt das in seinem eigenen Kopf:
  ein Hinweis, kein Beweis. **Der Beweis ist `paper-pdf-pruefen.mjs` am
  fertigen PDF.**
- **`pdftotext` fehlt im frischen Container.** Ohne es ist der PDF-Prüfer
  **nicht lauffähig, nicht grün**. Abhilfe: `apt-get update && apt-get install
  -y poppler-utils`.
