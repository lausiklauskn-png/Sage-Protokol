# Übergabeprotokoll 2026-09-15 — das fehlende Komma, Klaus' Sichttest, und ein Befund über die eigene Zeitmessung

**Rolle:** Haupt-Sitzung. **Branch:** `claude/andock-wizard-merge-gokcps`.
**Anlass:** Klaus meldete am Morgen, im Mixarium-Siegel fehle die Beschreibung.

---

## 1 · Zeiten dieser Sitzung — und warum die Zahl darunter falsch ist

| | |
|---|---|
| erster Commit | **2026-09-15 09:13 UTC** |
| letzter Commit | **2026-09-15 09:42 UTC** (= 11:42 MESZ, Sage #1004) |
| Commits · Depots | **24 · 8** |
| **Commit-Spanne** | **0 h 29 min** |
| letzte belegte Handlung | **2026-09-15 ~12:54 UTC** (Klaus' Bildschirmfoto Mein WorkFloh, 14:54 MESZ) |
| **Arbeit nach dem letzten Commit** | **mindestens 3 h 12 min**, ohne jede Spur in der Historie |

⚠ **Die Commit-Spanne ist hier die falsche Zahl, und das ist der Befund.** Alles
nach 09:42 UTC — das Nachmessen in drei Browser-Ständen, Klaus' Widerspruch,
sein Sichttest an sieben Apps, der Kennungs-Abgleich gegen `status.json`, dieser
Brief — hinterlässt keinen Commit und wäre für `Kimhub/tools/zeiten-sammeln.mjs`
unsichtbar gewesen. **Was hier als Beleg dient, sind Klaus' Bildschirmfotos**,
weil sie eine Uhrzeit tragen.

**Was NICHT gemessen ist:** was Klaus vor dem ersten Commit gelesen hat, und
was er nach 12:54 UTC noch getan hat. Eine geratene Zahl klingt genau wie eine
gemessene; deshalb steht hier keine.

---

## 2 · Was getan wurde

### Die Ursache, gemessen statt vermutet

Der A18-Rollout vom 2026-09-14 hat die Wizard-Zeile an die Nachlade-Ketten
angehängt, ohne der Zeile davor ein Komma zu geben.

| in der Kette | JavaScript liest | Wirkung |
|---|---|---|
| `["a","b"]` unter `["c","d"]` | **Zugriff**, kein Fehler | zwei Einträge werden still zu einem `undefined` |
| `"a"` unter `"b"` | **Syntaxfehler** | der ganze Skript-Block stirbt |

**Gemessen im echten Browser, vier Apps, je drei Stände** (Worktrees an `A18^`,
`A18`, `origin/main`; Chromium unter `/opt/pw-browsers/chromium-1194/…`):

| Stand | Speicher · Siegel · Lampen · Konfig · Kanon | Skriptfehler |
|---|---|---|---|
| vor A18 | ✓ ✓ ✓ ✗ ✗ | `Unexpected token 'export'` (vorbestehend) |
| A18 | ✗ ✗ ✗ ✗ ✗ | **`Unexpected string`** |
| heute | ✓ ✓ ✓ ✓ ✓ | `Unexpected token 'export'` (vorbestehend) |

Konfiguration und Kanon fehlen im Vor-Stand zu Recht: die Datei
`sbkim-andock-wizard.js` entstand erst mit A18.

### Behoben

Neun Dateien in sieben Depots bekamen das Komma; `tools/wizard-trennen.mjs`
setzt es seitdem selbst. Mixarium-Spiegel md5-geprüft
(`70fb71cf041d7df31074b7267105f7e1`), Mein-Rezeptbuch über `python3 build.py`
byte-identisch nachgebaut.

### Gebaut

| | |
|---|---|
| `tools/wizard-laedt-pruefen.mjs` | **lädt** jede Nachbar-Seite im echten Browser und prüft, ob Konfiguration UND Kanon ankommen. Benannte Ausnahmen mit Grund, in **beide** Richtungen geprüft |
| `tests/smoke_werkzeuge_parsen.mjs` | `node --check` über jedes `.mjs/.js/.cjs` unter `tools/` und `tests/` |
| `docs/LEHREN.md` § 12 | „Ein fehlendes Komma hat zwei Sprengweiten" |
| `docs/LEHREN.md` § 1, Nachtrag | „eine unterdrückte Fehlerausgabe macht aus dem Push ein Schweigen" |
| `CLAUDE.md`, Kanon-Abschnitt | „Wer an einer Nachlade-Kette etwas ANHÄNGT, prüft die Zeile DAVOR" |

### Gegengemessen aus `origin/main`

`node tools/wizard-laedt-pruefen.mjs` → **21/21** nicht ausgenommene Seiten
liefern Konfiguration UND Kanon aus, echter Rückgabewert **0**.
`node tests/run_alle.mjs` → **106 grün · 0 rot · 0 nicht lauffähig**, echter
Rückgabewert **0**. In allen acht Depots kein Zweig mit unmergter Arbeit.

---

## 3 · Eigene Fehler dieser Sitzung

### Sieben leere Pull Requests

Der Push lief als `git push -q … 2>/dev/null` in einer Wiederholungsschleife.
Die Zurückweisung (non-fast-forward — die Fernzweige trugen noch die
A18-Commits) war durch `-q` **und** `2>/dev/null` unsichtbar; die Schleife
schlief viermal und gab auf, das folgende `echo` zeigte den **lokalen** Commit
und sah aus wie Erfolg. Sieben PRs entstanden aus veralteten Zweigen, waren
**leer**, und liessen sich mergen.

**Gefunden hat es der neue Wächter**, der gegen `origin/main` lief und rot
blieb, während acht PRs „merged" meldeten. Behoben: Zweige aus frischem
`origin/main` neu aufgesetzt, mit `--force-with-lease` und **sichtbarer
Ausgabe** gepusht, vor jedem neuen PR `git diff --stat origin/main
origin/<zweig>` als nicht leer belegt, sieben Ersatz-PRs erstellt und gemergt.

### Eine Messung, die nur in eine Richtung prüfte

Ein Wegwerf-Skript meldete den Siegel-Dialog bei `y 1963…5563` und ich nannte
ihn „ausserhalb des sichtbaren Bereichs". **Falsch:** der Dialog ist
`fixed, inset 0, 360×740` — richtig; `y = 1963` war scrollbarer Inhalt
**innerhalb** eines Scroll-Behälters (`top = 74`, `h = 592`,
`scrollHeight = 1970`). Das Skript prüfte ausserdem nur `top < 0`, nie
`top > Schirmhöhe`, und druckte „✓ vollständig im Schirm" neben die Warnung.

### Eine falsche Wortwahl, von Klaus berichtigt

Im Chat stand *„die vier Apps, die seit gestern gar kein SBKIM hatten"*. Klaus:
*„Alle hatten SBKIM UND NICHT ERST SEIT GESTERN."* **Gemessen:** SBKIM liegt in
diesen vier Apps seit dem **2026-08-16**. Die Messung stimmte, der Satz las
sich falsch. Berichtigt.

---

## 4 · Klaus' Sichttest — sieben Apps, alle grün

Klaus hat sieben Bildschirmfotos geschickt (14:41–14:54 MESZ). Jede App zeigt
das Verbinden-Fenster, die eigene Kennung und den Siegel-Dialog mit dem
Andock-Wizard und der **eigenen** Bedeutungs-Beschreibung.

**Daraus gemessen — Kennung im Browser gegen `status.json`:**

| App | gleich? |
|---|---|
| Mein Mixarium · Alis Moderaum · Perfect Skin Fashion · Perfect Skin Beauty · Muster Werbetechnik | ✓ |
| Mein Rezeptbuch · Mein WorkFloh | ✗ andere |

Fünf von sieben — am 2026-09-10 waren es netzweit zwei von fünfzehn.

**Vier Knoten ohne Sicherung ihrer Kennung:** Muster Werbetechnik, Mein
Rezeptbuch, **Mein Mixarium**, Mein WorkFloh. Bei Mixarium ist die Kennung
`6U3aniLM3Rps…` in `status.json` und in den Proben genagelt.

**Zwei Bilder zeigen den Browser-Übersetzer in Aktion** (Perfect Skin Beauty
auf Russisch, Alis Moderaum mit „VON IN RU IST" statt DE/EN/RU/ES). Wer dort
Formulierungen beurteilt, schaltet ihn erst ab.

---

## 5 · Der Befund über die eigene Zeitmessung

Klaus hat am Nachmittag einen zweiten Auftrag gestellt: die Zeiterfassung
zusammenführen. Sein Grund, im Wortlaut:

> *„entweder arbeite ich in Kim Hub Company oder an den anderen Apps, aber die
> Arbeitszeit ist ja dieselbe, die ich benötige für die Arbeit."*
> *„Eine überwachende Funktion ist auch Arbeit. … Arbeit ist Arbeit, gerade in
> dem Gebiet."*

**Gemessen über alle 22 Depots:**

| Tag | Commits | Depots | Commit-Spanne | Fehlerrichtung |
|---|---|---|---|---|
| 2026-09-14 | 197 | 22 | 16 h 02 min (07:04–23:06 UTC) | Pausen zählen voll → **zu viel** |
| 2026-09-15 | 24 | 8 | 0 h 29 min (09:13–09:42 UTC) | Arbeit nach dem letzten Commit fehlt → **zu wenig** |

⚠ **`Kimhub/tools/zeiten-sammeln.mjs` warnt in seinem eigenen Kopf-Kommentar vor
genau beiden Richtungen** — und ist an zwei aufeinanderfolgenden Tagen in beide
gelaufen, ohne dass es an der Zahl auffiel. Gemerkt hat es der Betreiber, weil
ihm das Stoppen der Stechuhr lästig wurde.

**Und im Forschungsdatensatz steht dazu ein Widerspruch.** `forschung/METHODE.md`
§ 3 sagt, `beginn`/`ende` kämen aus der **Uhr der Sitzung**;
`forschung/STAND_V1_V2.md` nennt dieselben Zahlen **Commit-Spannen**. Die Daten
geben dem zweiten recht: zwei Einträge vom 2026-09-08 melden **eine Minute**
(16:27–16:28 und 16:53–16:54). Eine Sitzung mit Befunden dauert keine Minute —
das sind zwei Commits eine Minute auseinander. Summe über 22 Einträge: 100,8 h.
**Gefunden beim Nachprüfen einer Behauptung, die ich selbst in den Brief
geschrieben hatte.** Herkunft: `hinsehen`.

Drei Wege sind im Brief vorgelegt (Historie über alle Depots · automatische
Anwesenheit im Browser · beide getrennt geführt und benannt zusammengerechnet),
jeder mit seinem Preis. **Entschieden wird das von Klaus, nicht von einer
Sitzung.**

---

## 6 · Für die Übersetzung neu gemessen

**Keine** App im Netz trägt statisch `html lang="en"` — die tragende Zusicherung
„ohne Einstellung ändert sich nichts" hält.
**Zehn Apps setzen `<html lang>` zur Laufzeit**, sobald der Nutzer eine Sprache
wählt: Alis-Moderaum `app.js`:448 · Perfect-Skin-Fashion `app.js`:299 ·
New-Perfect-Skin-Beauty- `script.js`:296 · PWA-Toolpoint `assets/sprache.js`:97 ·
Mein-Mixarium `index.html`:6100 · Mein-Rezeptbuch `QC_MeinRezb_24_04_26.html`:6230 ·
Mein-WorkFloh `index.html`:1041 · Muttis-Rezeptbuch `index.html`:4694 ·
Mein-Mixarium-Page `assets/app.js`:51 · Tomys-Hub `workfloh/index.html`:978.

Die Falle ist damit eine andere als im Brief vom 2026-09-14 beschrieben.

---

## 7 · Forschungsstand, nachgerechnet

Über alle 22 Einträge in `Kimhub/forschung/sitzungen.json` (2026-09-15):
340 Befunde · `hinsehen` 43,5 % · `gegenprobe` 25,0 % · `klaus` 17,1 % ·
`regel` 14,4 % · **blinde Wächter 146 = 42,9 %**. V1 hält, V2 hält.

Die **Auswertung** steht weiter aus (`forschung/STAND_V1_V2.md` sagt das selbst).
Die Sitzungen vom 2026-09-14 und 2026-09-15 sind noch **nicht** eingetragen; die
Befunde mit ihrer Herkunft stehen im Brief.

---

## 8 · Offen

- die Übersetzung (`TEXTE.en`) — der Hauptauftrag des Folge-Briefs
- die Zeiterfassung zusammenführen — Klaus entscheidet den Weg
- zwei abweichende Kennungen (Rezeptbuch, WorkFloh) — Klaus entscheidet
- ~~vier fehlende Sicherungen~~ — **erledigt am 2026-09-15, Klaus’ Angabe**
  („Sicherungen sind alle angelegt“). **Nicht gemessen:** der Vermerk
  lebt im Browser-Speicher, eine Sitzung kann ihn nicht lesen.
- `noble-secp256k1` lädt in der Kette nicht — vorbestehend, nicht untersucht
- 44 netzweit zurückhängende Kanon-Dateien
- 38 blinde Gegenprobe-Fälle in PWA Toolpoint
- zwei `jasons-bibliothek/`-Spiegel ohne SBKIM — vorbestehend, benannte Ausnahme

**Folge-Brief:** `docs/sessions/BRIEF_uebersetzung-und-zeiterfassung.md`
