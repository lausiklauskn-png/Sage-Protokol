# Übergabeprotokoll — Der automatische Rollout (2026-09-14, Nacht)

**Rolle:** Haupt-Sitzung. **Auftrag von Klaus**, nachdem er nach dem Ziel
gefragt und festgestellt hatte, dass sich die Sitzungen aneinanderreihen.
**Branch:** `claude/sichttest-andock-werkzeug-r5dezp`.

---

## Warum es dieses Werkzeug gibt

Klaus' Frage war: *„Wie lange arbeiten wir noch an diesem Ziel?"* Die Antwort
lautete 5–6 Sitzungen — und beim Nachrechnen kam heraus, **dass nicht die
Änderungen teuer sind, sondern das Verteilen.**

Am selben Tag: **23 Pull Requests für zwei übersetzte Wörter im Wappen.** Der
Preis fällt bei jeder weiteren Kanon-Änderung wieder an, und es stehen noch
mindestens fünf an.

`tools/kanon-verteilen.mjs` nimmt diesen Preis weg, ohne eine einzige Tafel
anzugreifen.

---

## Die drei Entscheidungen, an denen alles hängt

### 1 · Die Liste wird GEFUNDEN, nicht gepflegt

Das folgt direkt aus einem Schaden desselben Tages: **BookLedgerPro fiel aus dem
Rollout**, weil nach der *erwarteten* Vorgänger-Fassung gesucht wurde — es hing
eine Generation weiter zurück. Eine von Hand gepflegte Liste hätte denselben
Fehler gemacht, nur dauerhaft.

**Folge für Klaus:** wer eine neue App oder Seite baut, trägt sie **nirgends
ein**. Sie ist dabei, sobald sie ein Modul trägt. Gemessen: **Mein-Workfloh-Page
trägt 13 Kanon-Dateien** — eine „Internetseite" ist für das Werkzeug dasselbe
wie eine App. Es unterscheidet nur *trägt Module* von *trägt keine*.

### 2 · Erkannt wird am INHALT, nicht am Dateinamen

Jedes Modul trägt `SBKIM — Modul NN` im Kopf. Damit lösen sich die drei
Siegel-Dateien von SB-KIMTool-Point **von selbst** auseinander:

| Datei | Marke | Folge |
|---|---|---|
| `web/tools/sbkim-siegel.js` | ja | die Kopie — wird bedient |
| `assets/sbkim-siegel.js` | nein | Loader — bleibt |
| `sandbox/16_siegel.js` | nein | Fassung des Modells — bleibt |

Eine Namens-Suche hätte alle drei getroffen oder zwei verfehlt. Kim-Bell und
Mein-WorkFloh nennen dasselbe Modul `sbkim-siegel.js` — auch das ist egal.

⚠ **Modul 20 schreibt einen Doppelpunkt** statt des Gedankenstrichs
(`SBKIM — Modul 20:`). Wer das Muster auf `—` verengt, verliert es **still**.

### 3 · `siegel-inhalt.js` wird NIE verteilt

**Der gefährlichste Fund des Bauens.** Die erste Fassung verteilte sie mit — und
sie trägt die **komplette App-Identität**:

```
domain · endpoint · nodeName · domainDescription · domainKeywords
stammCategories · guestCategories · backupPrefix
```

Ein Überschreiben hätte **jeder App Sages Namen und Sages Bedeutungs-Vektor
gegeben** — der Schaden vom 2026-08-16 in Alis Moderaum, nur zwanzigfach und
ohne dass jemand hinsieht.

**Gefunden hat es nicht das Nachdenken, sondern ein Diff zweier Repos**, bevor
das Werkzeug zum ersten Mal schreiben durfte.

---

## Der Befund aus dem ersten Lauf

| | |
|---|---|
| Repos mit Kanon-Dateien | **22** |
| Kopien schon gleich | **282** |
| **hängen zurück** | **44** |

Einzelne um über 300 Zeilen: `15_membran.js` in Tomys-Hub und Privat-Brain
(361), `03_embedding.js` in SB-KIMTool-Point (367).

**Das hat vorher niemand gesehen** — ein Drift-Guard sagt „unverändert", nicht
„aktuell". Genau der Satz, der in derselben Woche schon dreimal zugeschnappt ist.

⚠ **Ein Generationen-Sprung wird als solcher benannt** (ab 50 Zeilen). Eine
Meldung, die zwei und zweihundert Zeilen gleich schreibt, lädt dazu ein, beides
gleich zu behandeln — ein Sprung braucht einen Probenlauf im Ziel-Repo.

**Nicht nachgezogen.** Das Werkzeug meldet; das Nachziehen ist eine bewusste
Entscheidung.

---

## ⚠ Vier von fünf Gegenprobe-Fällen rutschten beim ersten Lauf durch

Und **keiner davon war ein Fehler im Werkzeug** — alle vier waren Lücken im
Wegwerf-Netz der Probe:

| Fall | warum er nichts maß |
|---|---|
| Sperrliste ausgebaut | die Identitäts-Datei lag außerhalb des Kanon-Pfades — der Riegel kam nie dran |
| zweiter Riegel ausgebaut | der erste deckte ihn |
| Doppelpunkt-Marke verengt | im Test-Netz gab es kein Modul mit `:` |
| Vorrat-Prüfung ausgebaut | es gab nur **einen** Worker, und die Datei stand drin |

Das Netz trägt jetzt ein Modul mit Doppelpunkt, eine Ziel-Datei **mit** Marke,
die Identitäts-Datei **im** Kanon-Pfad und einen zweiten Worker **ohne** die
Datei im Vorrat.

⚠ **Ein Fall ist ersatzlos entfallen, als benannte Grenze.** Beide Riegel lesen
dieselbe Liste; der erste Fall nimmt sie weg und fängt damit beide. Ein Fall nur
für den zweiten blieb zu Recht grün — **er hätte bewiesen, was er nicht misst.**
Dieselbe Lehre wie bei `umask` + `chmod` im Schlüssel-Ablagefach.

⚠ **Ein gerades Anführungszeichen hat die Probe zerlegt** — `"…Modul 20:" (…)`
beendet die JS-Zeichenkette. Dieselbe Falle wie in `manual_check.html`, wo zwei
Panels elf Tage lang tot dastanden.

---

## Gemessen

| | |
|---|---|
| `tests/smoke_kanon_verteilen.mjs` | **20 grün, 0 rot** |
| `tests/gegenprobe_kanon_verteilen.sh` | **4 gefangen · 0 durchgerutscht · 0 tote Anker** |
| voller Lauf | **104 Proben grün, 0 rot, 0 nicht lauffähig** |

⚠ Die Probe **fährt das echte Werkzeug** an einem Wegwerf-Netz aus einem Sage
und drei Apps. Ein Wächter, der den Quelltext liest, misst nicht, ob er läuft.

---

## Was offen bleibt

1. **Die 44 Rückstände** — gemeldet, nicht nachgezogen. Je Generationen-Sprung
   ein Probenlauf im Ziel-Repo.
2. **Der Automat öffnet keine PRs.** Er tut die Datei-Arbeit; Branch, Commit und
   PR bleiben ein eigener Schritt. Eine Action, die ihn zeitgesteuert ruft,
   bräuchte ein Token mit Schreibrecht auf alle Repos — **Klaus' Entscheidung.**
3. **A18** (Wizard zusammenführen, dann übersetzen) unberührt.
4. **`docs/PULS.md`** musste zweimal auslagern und steht bei 2.957 Zeilen.
