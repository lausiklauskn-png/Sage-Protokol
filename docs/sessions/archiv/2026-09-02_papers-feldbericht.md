# Übergabeprotokoll · 2026-09-02 · Papers auf den heutigen Stand

**Rolle:** Bausitzung · **Zweig:** `claude/sbkim-papers-update-swrhy6` · **PR #929** (Entwurf)
**Auftrag:** der Brief „Papers auf den heutigen Stand bringen", nach dem
genehmigten Plan in [`../../papers/REVISION_2026-09-02.md`](../../papers/REVISION_2026-09-02.md).

---

## Stundennachweis

**Gemessen an den Commits dieser Sitzung**, nicht geschätzt:

| | |
|---|---|
| Erster Commit | `ef81cd6` · 2026-09-02 15:30 UTC |
| Letzter Commit | `98ce1b2` · 2026-09-02 15:37 UTC |
| **Spanne** | **6 Minuten**, 2 Commits |

⚠ **Diese 6 Minuten sind NICHT der Aufwand, und die Zahl steht nur hier, damit
niemand sie für einen hält.** Die Arbeit vor dem ersten Commit hinterlässt
keine Spur in der Quelltext-Verwaltung: die Pflichtlektüre, die drei
Literatursuchen, das Vergleichen der vier Paper-Dateien, das Schreiben von
zwei neuen Abschnitten in zwei Sprachen. Alles davon liegt **vor** 15:30.

**Eine Sitzung, die ihre Arbeit in einem Commit ablegt, misst mit der
Commit-Spanne ihren Ablage-Vorgang, nicht ihre Arbeit.** Die Methode taugt für
Tage mit vielen Commits; für diese Sitzung ist sie blind. Nachrechenbar wäre
sie erst mit einer Uhr, die niemand gedrückt hat.

> Die ehrliche Auskunft ist deshalb: **nicht gemessen.** Nicht „6 Minuten",
> und auch keine Schätzung, die sich daneben besser läse.

⚠ **Und die Spanne ist ohnehin nicht Klaus' Arbeitszeit.** Beide überschneiden
sich, sind aber nicht dasselbe.

---

## Was getan wurde

Beide Papers tragen die Fassung **v0.2** und sind von Vorschlag auf
**Feldbericht** umgestellt. Neun Abschnitte statt sieben, DE und EN parallel
(je 9 × h2, 16 × h3).

| Schritt aus dem Auftrag | Stand |
|---|---|
| 1 · toter Verweis | war mit PR #928 schon erledigt, nachgeprüft |
| 2 · § 5 auf heutigen Stand | ✅ jetzt § 6 „Das laufende Netz" |
| 3 · § 6.1 aufteilen | ✅ jetzt § 7.1, vier Zeilen statt einem Satz |
| 4 · Vorarbeiten nennen | ✅ § 2.1 / 2.2 |
| 5 · „Wie das entstanden ist" | ✅ § 5 |
| 6 · „Zur Entstehung dieses Textes" | ✅ § 9 |
| 7 · eine Quelle statt zwei | ✅ `docs/papers/` gilt, `sbkim-demo/` zeigt darauf |
| 8 · Skill-Zielsatz | ✅ präzisiert, die acht Durchgänge unverändert |
| 9 · Zenodo-DOI | **bewusst nicht.** Wartet auf den Sichttest |

---

## Die Funde, die im Plan noch nicht standen

### 1 · Eine Datei an zwei Orten hat an einem davon andere Nachbarn

Die „Live-Demo Layer 1/2"-Verweise standen wortgleich in allen vier
Paper-Dateien und zeigten auf `index.html` und `sbkim-network.html`. Unter
`sbkim-demo/` liegen beide; unter `docs/papers/` liegt keine von beiden.
**Dieselbe Zeile war an einem Ort richtig und am anderen tot.** Und tot
ausgerechnet in der Fassung, die zur Quelle erklärt wurde.

> Ein Verweis ist keine Eigenschaft des Textes. Er ist eine Eigenschaft des
> Textes **an seinem Ort**. Wer eine Datei kopiert, kopiert seine Ziele nicht mit.

### 2 · Die zwei Fassungen trugen verschiedene Titel

Nicht nur verschiedene Prüfsummen, was der Plan schon festhielt:

| Ort | Titel |
|---|---|
| `docs/papers/` | „Ein Protokoll für Semantisches Bidirektionales **KI-Matching**" |
| `sbkim-demo/` | „Ein Offenes Protokoll für Semantisches Bidirektionales **Wissensintegriertes** Matching" |

Das ist die Drift in ihrer schlimmsten Form: **zwei verschiedene Zitationen
desselben Papiers**, bei denen sich hinterher nicht mehr klären ließe, welche
gemeint war. Gültig ist die erste Lesart; so steht der Name auch in den
übrigen Depots.

### 3 · Zusammenlegen hätte etwas weggeworfen

Die Demo-Fassungen trugen die **besseren Druck-Regeln** (`break-inside`,
`orphans`, `widows`). Sie sind übernommen worden, bevor die Dateien zu Zeigern
wurden. **Genau dafür stand „vorher vergleichen" im Auftrag**, und es hat sich
gelohnt: die schlechtere Fassung war die, die überleben sollte.

---

## Die Zahl, die zweimal richtig ist

| Quelle | Zahl |
|---|---|
| `papers/REVISION_2026-09-02.md` | 5.823 |
| `historie/arbeitstage-zahlen.html` | 5.775 |

**Beide stimmen.** Die Differenz sind 48 zeitgesteuerte Läufe, und `PULS.md`
hält das seit dem 2026-08-26 fest. Die Papers nennen deshalb **beide Zahlen**
mit ihrer Bedeutung; eine allein wäre je nach Wahl zu hoch oder zu niedrig.

> Beinahe wäre eine der beiden ungeprüft in ein veröffentlichtes Papier
> gewandert. Gefunden nur, weil das Prüfblatt vor dem Schreiben aufgeschlagen
> wurde statt danach.

---

## Was die Probe gefunden hat

`smoke_antragsmappe` wurde **ROT**: fünf Gedankenstriche in `ABGRENZUNG.md`,
alle fünf aus dieser Sitzung. Klaus' Regel vom 2026-08-24 verbietet sie in
seinen eigenen Texten, der Skill `menschlich-schreiben` sagt dasselbe, und der
Wächter setzt es durch. Aufgelöst zu Sätzen; die erzeugten Blätter der
Antragsmappe neu gebaut.

> **Bemerkenswert ist nicht der Fehler, sondern dass ihn kein Mensch finden
> musste.** Der Wächter stand da, bevor die Zeile geschrieben wurde. Das ist
> der Fall, für den die Gegenproben-Disziplin dieses Depots gebaut ist.

Nebenbei sichtbar geworden: **die Probe baut die Antragsmappe neu**, wenn eine
Quelle sich geändert hat. Der erste volle Lauf danach meldete deshalb noch
2 ROT, der zweite 0. Nicht weil etwas flatterhaft wäre, sondern weil der
erste Lauf die Blätter erst erzeugte. Wer nur einen Lauf macht und die Zahl
nimmt, misst den Zwischenstand.

---

## Gemessen

| | |
|---|---|
| `node tests/run_alle.mjs` | **89 Proben · 89 grün · 0 rot · 0 nicht lauffähig** |
| HTML beider Papers | wohlgeformt, gleiche Gliederung |
| relative Verweise in den vier Paper-Dateien | jeder löst auf eine vorhandene Datei auf |
| klickbarer Verweis auf `semantic-match-demo` | **keiner**, im ganzen Baum |

**Nicht gemessen:** wie die Papers im Browser aussehen. Das ist Klaus'
Sichttest und nicht ersetzbar. `tests/manual_check.html` wurde nicht geöffnet;
diese Sitzung hat kein Modul-JS in `src/` angefasst, nur Doku, die Papers und
die Stations-Texte in `index.html`.

---

## Was offen bleibt

1. **Klaus' Sichttest der v0.2.** Der DOI hängt daran.
2. **`git grep "semantic-match-demo" -- docs/papers sbkim-demo` gibt 1**, nicht
   die im Auftrag erwartete 0. Der Treffer steht in `REVISION_2026-09-02.md`
   in einem Zitat-Block und ist die Aufzeichnung dessen, *was* der tote
   Verweis war. Kein klickbarer Verweis, nachgemessen. Ihn zu entfernen hieße,
   den Befund zu löschen. **Klaus entscheidet.**
3. **Der Anspruchs-Satz in `ABGRENZUNG.md` § 4** steht weiter da und ist nur
   eingeordnet. Ob er ganz fällt, ist nicht entschieden.
4. **Abschnitte 1–4 und § 7.2–7.4 der Papers** sind ungeprüft, wie vorgegeben.
5. **Die Literatursuche bleibt zu dünn für eine Veröffentlichung.** Drei
   Suchen, an Titeln und Zusammenfassungen geprüft, nicht an den Volltexten.
   `arxiv.org` und die Verlagsseiten sind aus dieser Umgebung gesperrt.
6. **`PULS.md` steht bei 2.879 von 3.000 Zeilen.** Die nächste größere Sitzung
   lagert aus, statt zu kürzen.

---

## Die offene Frage aus dem Auftrag, beantwortet

*Verlangt eine der Vorarbeiten dieselbe Symmetrie? Bewerten beide Seiten mit
eigenen Kriterien, ohne dass eine Plattform beide kennt?*

**Ja, die erste Hälfte.** Reziproke Empfehlungssysteme verlangen ausdrücklich,
dass beide Seiten zustimmen. Sie setzen dafür eine Plattform voraus, die beide
kennt, und ein Kandidatenfeld, das feststeht. Semantische Überlagerungsnetze
brauchen keine Plattform, kennen aber nur eine Richtung. Agent Cards nennen,
was einer **kann**, und schweigen darüber, was er **sucht**.

**Die Lücke liegt damit nicht bei einem Bestandteil, sondern in der Verbindung
aller drei in einem laufenden Betrieb.** Das steht als **Beobachtung** im Text
und nicht als Anspruch, und der Feldbericht hängt nicht daran. Der Auftrag
erlaubte, den Anspruch stärker ausfallen zu lassen, falls dort eine Lücke
bleibt. Er ist bewusst **nicht** stärker ausgefallen: eine Beobachtung aus drei
Suchen trägt keinen Anspruch, und der Feldbericht steht auch ohne sie.
