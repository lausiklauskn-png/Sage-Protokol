# Brief an die nächste Sitzung: nach der Historie und der gelben Runde

**Datum:** 2026-08-24
**Stand:** alles Genannte liegt auf `main` (PR #913 und #915, beide gemergt).

> **Zwei Sitzungen liefen an diesem Tag parallel**, und das ist der erste
> Hinweis, den dieser Brief geben muss. Die eine baute die Historien-Auslese
> (#913), die andere arbeitete Klaus' gelbe Markierungen ab (#915). Beide
> wussten voneinander nichts. Es ist gutgegangen, weil sie verschiedene Dateien
> anfassten; ein Brief, der in der Zwischenzeit geschrieben wurde, war beim
> Abschicken schon in seinem Kernpunkt überholt. **Wer hier arbeitet, holt
> zuerst `origin/main`.**

---

## Pflichtlektüre, in dieser Reihenfolge

1. `CLAUDE.md`
2. `docs/PULS.md`, die Einträge vom 2026-08-23 und 2026-08-24
3. `docs/sessions/archiv/2026-08-24_gelbe-runde.md`, was aus den vierzig
   gelben Markierungen wurde
4. `docs/sessions/2026-08-24_markierungen-klaus.md`, die Liste selbst
5. `docs/historie/historie.html` im Browser öffnen

---

## ⚠ ZUERST: `docs/PULS.md` steht bei 2.985 Zeilen

**Fünfzehn unter der Grenze.** Die Schutz-Klausel sagt: auslagern statt kürzen,
und die Grenze **nicht** herabsetzen. Wer schreibt, ohne vorher auszulagern,
reißt sie im ersten Absatz.

**Also: erst auslagern, dann schreiben.** Verfahren wie bei den vier
Auslagerungen davor: die ältesten Sitzungs-Einträge nach
`docs/sessions/archiv/2026-08_puls-auslagerung-N.md`, wortwörtlich, mit Zeiger
an der Schnittstelle und einer Zeile im Archiv-Index. Die stehenden Abschnitte
(„Als nächstes", „Schnellüberblick", „Endknoten", „Offene Querschnitts-Fragen")
bleiben.

---

## 1 · Was jetzt offen ist

In der Reihenfolge, in der es drängt.

### Die Anmeldung nach § 5c ist der eiligste Punkt

Rückwärts vom 30.11.2026 gerechnet, weil daran **zwei** Wege zugleich hängen.
Ein Behörden-Schritt hat Vorlaufzeit, und dafür braucht
es ein Zertifikat, das per Brief kommt. Das ist der Schritt, der still zum
Engpass wird.

### Der Werkzeug-Widerspruch in Paper A

Vier Stellen sagen, die Rollen hätten keine Werkzeuge. Kimhubs Verfassung sagt
seit dem 2026-08-23 das Gegenteil, auf Klaus' Wort, mit Messung. Für den
beobachteten Zeitraum stimmt der Satz, aber er steht im **Präsens**, und das
Papier verlinkt das Depot.

**Unverändert Klaus' Entscheidung.** Drei Wege stehen im Übergabeprotokoll vom
2026-08-23. Das gehört geklärt, **bevor** die Papers eine Zenodo-Nummer
bekommen: eine Zenodo-Fassung bleibt stehen.

### Klaus' Sichttest der Antragsmappe am Tablet

Besonders das Ziehen mit dem Finger und ob Androids eigene Kopieren-Leiste der
Farbleiste in die Quere kommt. Headless ist grün, das ersetzt ihn nicht.

### Was nur er tun kann

Steuerberater (A2) · ein Behörden-Schritt mit Vorlaufzeit (A2b) · Stundenaufzeichnung ab sofort
(D2, der einzige Punkt ohne Vorlaufzeit) · ORCID und Zenodo (A1, B1, erst nach
dem Werkzeug-Widerspruch).

### Nebenbefund, nicht angefasst

`Kim-sync/CLAUDE.md` beschreibt den eigenen Inhalt falsch. Was mit
`Company-Brain/VISION.md` dort geschehen soll, ist Klaus' Entscheidung.

---

## 2 · Die Historien-Dokumentation, und wie man sie anfasst

| | |
|---|---|
| `tools/historie-auslesen.mjs` | liest alle Depots, alle Zweige, **nur lesend** |
| `docs/historie/historie.json` | 6,5 MB, 5.823 Commits mit Datum, Uhrzeit, Nachricht |
| `tools/historie-marken.mjs` | die Einordnung, **eine** Quelle für Bericht und Probe |
| `tools/historie-bericht-bauen.mjs` | macht daraus die Seite |
| `docs/historie/historie.html` | 7,8 MB, 128 Tagesabschnitte, filterbar |
| `tests/smoke_historie.mjs` | prüft **jede Zahl** gegen die Daten |
| `tests/gegenprobe_historie.mjs` | neun eingebaute Fehler, alle gefangen |

**Gemessen:** 33 Depots · 5.823 Commits · 1.388 Zweige · 128 Tage mit Arbeit,
10.03. bis 24.08.2026 · 1.852.315 Zeilen dazu, 292.930 entfernt · 396 Merges ·
**1.662 Commits liegen nie auf `main`**, das sind die Sackgassen.

> ### ⚠ DER PUNKT, DER EINE FOLGE-SITZUNG SONST TEUER KOSTET
>
> **Die Klone in einem frischen Container sind FLACH.** Achtzehn der
> dreiunddreißig trugen nur die letzten fünfzig Commits; mehrere zeigten
> denselben Tag als ersten und letzten. Eine Aussage über „fünf Monate
> Zusammenarbeit" auf so einem Klon wäre keine Messung gewesen, sondern eine
> Behauptung mit Zahlen davor.
>
> Vervollständigt wurde mit `git fetch --unshallow` je Depot, das dauert
> Minuten. **Deshalb liegt `historie.json` im Depot und wird nicht bei jedem
> Lauf neu geholt.**
>
> · **Bericht ändern** → `tools/historie-bericht-bauen.mjs` ändern, neu bauen.
> · **Daten neu holen** → vorher wieder unshallowen, sonst schrumpft die
>   Historie still auf fünfzig Commits je Depot.

---

## 3 · Was die Historie für Paper A hergibt

Klaus' gelbe Notiz an der Zusammenfassung wollte die Historie rekonstruiert
haben. Sie liegt vor, und der Verlauf berührt die These des Papiers
unmittelbar. Anteil der Commits je Monat:

| Monat | Commits | Wächter-Arbeit | gemessen statt behauptet | Selbstkorrektur |
|---|---|---|---|---|
| April | 551 | 2 % | 1 % | 7 % |
| Mai | 747 | 37 % | 3 % | 3 % |
| Juni | 1.437 | 45 % | 4 % | 3 % |
| Juli | 1.811 | 30 % | 5 % | 3 % |
| August | 1.275 | 55 % | **50 %** | 8 % |

**Vorsicht damit, und der Satz gehört mit ins Papier.** Die Tabelle zählt
**Wörter in Commit-Nachrichten**. Der Sprung bei „gemessen" von 5 auf 50 Prozent
kann heißen, dass mehr gemessen wurde, **oder** dass ausführlicher darüber
geschrieben wurde. Beides ist eine Veränderung, aber nicht dieselbe. Wer die
Zahl ohne diesen Satz verwendet, behauptet mehr, als gemessen ist.

Dasselbe gilt für die **Marken** im Bericht: sie sind **Untergrenzen**, keine
Vollerhebung. Ein Commit, der einen Fehler behebt, ohne es zu sagen, wird nicht
gezählt.

---

## 4 · Die Regeln, die an diesem Tag dazugekommen sind

**Keine Gedankenstriche.** Klaus am 2026-08-24: *„Nimm bitte alle
Gedankenstriche von dir heraus. […] Es gibt Sätze."* 613 sind aufgelöst.
`tests/smoke_antragsmappe.mjs` hält die Regel für die Quellen der Antragsmappe
fest; für jeden anderen Text gilt sie trotzdem.

**Zwei Ausnahmen, und beide sind keine Nachsicht:**

- `docs/werkstatt/WERKSTATTREGELN.md` und `grundsaetze.md` sind **Byte-Kopien
  aus Kimhub**, deren Quell-Prüfsummen in `werkstatt/README.md` stehen. Wer sie
  hier anfasst, lässt die Momentaufnahme still vom Original weglaufen und macht
  die Prüfsummen falsch. **Wer die Striche dort loswerden will, ändert sie in
  Kimhub und kopiert neu.**
- Zwei wörtliche Zitate dieser Regeln folgen ihrer Quelle. Wer die
  Zeichensetzung eines Zitats anpasst, fälscht es.

**Die Farben der Markierung** (Klaus 2026-08-24): grün soll bleiben, gelb kann
bleiben oder weg und Claude wägt ab, rot kann komplett weg. **Im Zweifel
bleiben.**

---

## Pflicht am Ende der nächsten Sitzung

1. **Erst `docs/PULS.md` auslagern, dann schreiben.** Siehe oben.
2. Übergabeprotokoll in `docs/sessions/archiv/`.
3. Proben: `node tests/run_alle.mjs`, dazu die drei Gegenproben
   (`antragsmappe`, `historie`, `lizenz_konsistenz`). **Echter Rückgabewert,
   nicht hinter `| tail`.**
4. **Keine Gedankenstriche.** Es gibt Sätze.
5. Vorgeschlagene nächste Schritte direkt in die Chat-Antwort, 2 bis 4 Punkte.
6. Diesen Brief fortschreiben, damit die Kette nicht abreißt.
