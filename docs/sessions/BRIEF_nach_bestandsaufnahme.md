# Brief an die nächste Sitzung: die vier Entscheidungen und die eine Lücke

**Datum:** 2026-08-26
**Stand:** alles Genannte liegt auf `main` (bis PR #922).
**Vorgänger:** `BRIEF_lueckenlose_dokumentation.md` ist abgearbeitet, das
Ergebnis steht in `archiv/2026-08-26_lueckenlose-dokumentation.md`.

> ## ⚠ ZUERST, JEDES MAL
>
> **`git fetch origin` und frisch von `origin/main` abzweigen.** In vier Tagen
> liefen **zweimal** zwei Sitzungen parallel, beim zweiten Mal bauten beide
> dasselbe. Beide Male gemerkt beim Push, nicht davor.
>
> **Und der Klon im Container ist FLACH.** Er trägt nur die letzten fünfzig
> Einträge. Wer einen Zeitraum aus `git log` liest, ohne vorher
> `git fetch --unshallow` auszuführen, bekommt eine Zahl, die am Klon
> abgeschnitten ist und **wie eine Messung aussieht**. Genau das ist am
> 2026-08-26 passiert: `LEHREN.md` stand mit „2026-08-22 bis 2026-08-22" da.
> `tools/bestand-bauen.mjs` bricht deshalb ab, andere Werkzeuge nicht.
>
> **Vor jedem PR:** `git diff --numstat origin/main origin/<zweig>` und die
> Löschungen ansehen.
>
> **`docs/PULS.md` steht bei 2.849 Zeilen.** Wer viel zu schreiben hat, lagert
> **vorher** aus. Die siebte Auslagerung ist das Muster.

---

## 1 · Vier Entscheidungen, die nur Klaus treffen kann

Keine davon ist eine Bau-Aufgabe. Alle vier blockieren etwas.

### A · Die Gedankenstriche in den beiden SBKIM-Papers

`docs/papers/sbkim-paper-de.html` (20) und `-en.html` (17). Sie sind eine
**v0.1-Vorabveröffentlichung von Mai 2026** und werden in `INTERFACES.md` mit
Paragraphennummern zitiert (§ 3.3, § 3.4).

**Ein stilles Umschreiben erzeugte zwei Fassungen mit derselben Nummer.** Das
ist dieselbe Sorte Schaden wie zwei Steuerberater-Blätter: nicht ein
Widerspruch, sondern eine Doppelung, von der die eine Seite nichts weiß.

Drei Wege, und der mittlere ist der wahrscheinliche:

| | |
|---|---|
| **stehen lassen** | eine datierte Fassung folgt ihrer Form. Im Englischen ist der Gedankenstrich ohnehin üblich |
| **v0.2 auflegen** | die deutsche Fassung überarbeiten, Nummer hochsetzen, `INTERFACES.md` nachziehen |
| **beide überarbeiten** | dann müssen DE und EN gemeinsam gehen, sonst laufen sie auseinander |

**Was NICHT geht:** die deutsche ändern und die englische lassen.

### B · Der Werkzeug-Widerspruch in Paper A

Steht seit dem 23.08. offen und gehört **vor** die Zenodo-Nummer: eine
Zenodo-Fassung bleibt stehen.

### C · Die Kleinunternehmerregelung

Sie steht im Frageblatt für den Steuerberater nur als Aufzählungspunkt unter
Frage 7. **Der Fragebogen zur steuerlichen Erfassung verlangt dafür ein Kreuz.**
Benannt seit dem 26.08., nicht behoben, weil es eine Frage an den
Steuerberater ist und keine an eine Sitzung.

### D · Welches Datum als Betriebseröffnung trägt

10.03. (Anstoß, danach 26 Tage nichts) oder 06.04. (127 Arbeitstage in 141
Kalendertagen, neunmal unterbrochen, längste Unterbrechung drei Tage). Der
Fahrplan neigt zum 06.04. **Der Steuerberater entscheidet.**

## 2 · Die eine Lücke, die eine Sitzung schließen kann

### Die englische Projektseite

Eine Seite. **Grundlage für den OTF-Antrag**, und sie existiert nicht. Von
allem Offenen ist es das Einzige, was ohne Klaus' Entscheidung gebaut werden
kann.

Was schon da ist und übersetzt werden will: `docs/ABGRENZUNG.md` (die Frage,
die eine Gutachterin zuerst stellt), das englische SBKIM-Paper, die Zahlen der
Vorleistung aus `docs/unterlagen/04_BESTAND.md`.

**Was daran nicht zu unterschätzen ist:** eine englische Seite ist keine
Übersetzung der deutschen. Der OTF fragt nach anderen Dingen als eine deutsche
Fördergeberin, und die Fremdnutzer-Brille gilt hier doppelt.

## 3 · Was NICHT ansteht

- **Kein zweites Werkzeug für die Bestandsaufnahme.** Sie wird erzeugt. Wer
  eine Zahl darin ändern will, ändert `tools/bestand-rechnen.mjs`.
- **Kein Umschreiben der Byte-Kopien** unter `docs/werkstatt/`. Ihre 18
  Gedankenstriche sind die einzigen in der Antragsmappe, und ihre Prüfsummen
  stehen in `werkstatt/README.md`. Geändert wird in Kimhub, dann neu kopiert.
- **Keine Sammel-Bereinigung der 7.238 Gedankenstriche** in den lebenden
  Arbeitstexten. Das sind Verfassungen, Verträge und Briefe, keine Unterlagen.
  Ein Sammellauf darüber wäre ein unprüfbarer Diff über 250 Dateien.

## 4 · Die Regeln, die hier zuletzt Geld und Zeit gekostet haben

**Ein flacher Klon liefert Zahlen, die wie Messungen aussehen.** Siehe oben.

**Ein Wächter nagelt eine Aussage fest, keine Wörter.** Zweimal an einem Tag
gebraucht: einmal, als eine Prüfung ihr Datum in einem fremden Abschnitt fand,
einmal, als ein Wächter rot wurde, **weil eine Lücke geschlossen worden war**.

**Ein Wächter, der nur das Falsche verbietet, misst nicht, ob das Richtige
dasteht.** „Behauptet keine einzelne Lücke" blieb grün, als aus neun
Unterbrechungen vier wurden.

**Anführungszeichen machen einen Satz nicht zum Zitat.** Ein erfundener
Regeltext in Anführungszeichen kam durch den Gedankenstrich-Wächter, **weil**
er in Anführungszeichen stand.

**Eine feste Zahl neben einer wachsenden Liste prüft nur sich selbst.** „Neun
Quelldateien" wurde rot, als eine zehnte dazukam. Eine Namensliste sagt, welche
fehlt.

**Ein Wächter ohne Gegenprobe ist nur ein grüner Haken.** Vier von fünf
blinden Flecken dieser Sitzung hat die Gegenprobe gefunden, keiner fiel beim
Schreiben auf.

**Nie zwei Gegenproben nebeneinander.** Sie verderben einander die Ausgangslage,
und eine abgebrochene lässt ihre Sabotage stehen.

**`| tail` ist zum Lesen da, nicht zum Urteilen.**

**Keine Gedankenstriche. Es gibt Sätze.**

## 5 · Pflichtlektüre vor der Arbeit

1. `CLAUDE.md`
2. `docs/PULS.md`, der Eintrag vom 26.08. (Bau, 2.)
3. `docs/sessions/archiv/2026-08-26_lueckenlose-dokumentation.md`
4. Diesen Brief
5. **Nur** die Doku und den Code der zugewiesenen Scheibe

## 6 · Pflicht am Ende

1. `docs/PULS.md` fortschreiben, **vorher** auslagern, wenn es eng wird.
2. Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_<thema>.md`.
3. `node tests/run_alle.mjs` **und** die Gegenproben, einzeln, nacheinander,
   mit echtem Rückgabewert.
4. Vorgeschlagene nächste Schritte direkt in die Chat-Antwort, 2 bis 4 Punkte.
5. Diesen Brief fortschreiben, damit die Kette nicht abreißt.
