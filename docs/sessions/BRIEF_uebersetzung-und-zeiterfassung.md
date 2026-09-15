# Brief für die nächste Sitzung — den Wizard übersetzen, und die Zeiterfassung zusammenführen

**Absender:** Haupt-Sitzung 2026-09-15 (Komma-Reparatur + Klaus' Sichttest).
**Branch:** frisch von `origin/main`.
**Dieser Brief ersetzt** `docs/sessions/BRIEF_uebersetzung-wizard.md` (2026-09-14).
Jener bleibt als Beleg liegen; sein Auftrag ist hier enthalten und um das
erweitert, was seither gemessen wurde.

> **Zwei Aufträge, nicht einer.** Die Übersetzung ist der ursprüngliche
> (Abschnitt A). Klaus hat am 2026-09-15 einen zweiten gestellt: die
> Zeiterfassung zusammenführen (Abschnitt B). Er ist keine Nebensache — er ist
> ein Forschungsbefund über die eigene Messmethode.

---

## STAND — was in den letzten zwei Tagen wirklich passiert ist

### 2026-09-14 · A18: der Wizard wird Kanon

Der Andock-Wizard wurde aus zwanzig App-Kopien herausgelöst und zu **einem**
Kanon-Modul gemacht.

| | |
|---|---|
| `src/modules/16b_andock_wizard.js` | Ablauf, **alle** Anzeigetexte, Prüfungen · Marke `SBKIM — Modul 16b —` |
| `siegel-inhalt.js` (je App) | `window.SBKIM_SIEGEL_WIZ` — die Identität · bleibt in `NIE_VERTEILEN` |

Tafel: **`docs/INTERFACES.md` §11.9**.
**Der Befund, der es nötig machte:** über die 20 Kopien standen **zwölf**
verschiedene Code-Fassungen im Netz. Danach: **19 Kopien, alle gleich.**

**Gemessen am 2026-09-14:** `node tests/run_alle.mjs` → 105 grün · 0 rot ·
0 nicht lauffähig · `smoke_kanon_wizard.mjs` → 46 grün (Quelltext **und**
Browser) · `gegenprobe_kanon_wizard.sh` → 24 gefangen · 0 durchgerutscht ·
0 tote Anker.

**Commit-Spanne des Tages: 07:04–23:06 UTC, 197 Commits über 22 Depots.**

### 2026-09-15 · Das fehlende Komma

Derselbe Rollout hat die Wizard-Zeile an die Nachlade-Ketten **angehängt** —
und der Zeile davor kein Komma gegeben:

```
"./assets/siegel-inhalt.js"
"./assets/sbkim-andock-wizard.js"     ← das Komma fehlte
```

**Zwei Formen, zwei sehr verschiedene Schäden:**

| in der Kette steht | JavaScript liest | Wirkung |
|---|---|---|
| `["a","b"]` unter `["c","d"]` | **Zugriff**, kein Fehler | zwei Einträge werden still zu einem `undefined`; die Kette stirbt am letzten Glied — Module laden, Wizard und Konfiguration nicht |
| `"a"` unter `"b"` | **echter Syntaxfehler** | der ganze Skript-Block stirbt — keine Module, keine Lampen, kein Siegel |

**Gemessen im echten Browser, sieben Apps, je drei Stände** (Werkzeug:
`tools/wizard-laedt-pruefen.mjs`, Wegwerf-Worktrees an `A18^`, `A18`,
`origin/main`):

| Stand | Speicher · Siegel · Lampen | Skriptfehler |
|---|---|---|
| vor A18 | ✓ ✓ ✓ | — |
| A18 (14.09.) | **✗ ✗ ✗** | `Unexpected string` |
| nach der Reparatur | ✓ ✓ ✓ | — |

Betroffen waren **sieben** Apps, **vier** davon total (Alis-Moderaum,
Perfect-Skin-Beauty, Perfect-Skin-Fashion, Mein-Workfloh-Page), **drei** nur an
Konfiguration und Wizard (Mein-Mixarium, Mein-Rezeptbuch, Mein-WorkFloh).
Behoben in allen sieben, aus `origin/main` gegengemessen: **21/21 nicht
ausgenommene Seiten liefern Konfiguration UND Kanon aus**, echter
Rückgabewert 0.

**Commit-Spanne des Tages: 09:13–09:42 UTC, 24 Commits über 8 Depots.**
⚠ **Diese Zahl ist falsch klein** — siehe Abschnitt B.

### Was an diesem Tag SONST noch herauskam

- **Sieben leere Pull Requests.** Ein Push lief mit `-q … 2>/dev/null` in einer
  Wiederholungsschleife; die Zurückweisung (non-fast-forward) war unsichtbar,
  die Schleife schlief viermal, das folgende `echo` zeigte den **lokalen**
  Commit und sah aus wie Erfolg. Sieben PRs wurden aus veralteten Zweigen
  erzeugt, waren **leer**, und liessen sich mergen. **Gefunden hat es der neue
  Wächter**, der gegen `origin/main` lief und rot blieb, während acht PRs
  „merged" meldeten. Ersetzt durch sieben echte PRs, jeder mit vorher geprüftem
  `git diff --stat origin/main origin/<zweig>`.
- **`tools/wizard-trennen.mjs` liess sich seit dem 2026-09-14 nicht parsen** —
  kaputt in genau dem Commit, der es angelegt hat. Repariert; `tests/smoke_werkzeuge_parsen.mjs`
  fährt seitdem `node --check` über jedes Werkzeug und jede Probe.
- **Klaus' Widerspruch** *„Alle hatten SBKIM UND NICHT ERST SEIT GESTERN"* —
  und er hatte recht: SBKIM liegt in diesen vier Apps seit dem **2026-08-16**.
  Mein Satz *„die vier Apps, die seit gestern gar kein SBKIM hatten"* war
  falsch formuliert. Die **Messung** stimmte (das A18-Fenster war rund ein Tag),
  die **Wortwahl** nicht. Herkunft des Befundes: `klaus`.
- **Klaus' Sichttest** an allen sieben Apps: grün. Jede trägt ihren eigenen
  Text im Siegel, jede hat den Wizard.

### Aus dem Sichttest gemessen — zwei Sachen, die offen sind

**Kennung im Browser gegen Kennung im Register** (`status.json`):

| App | gleich? |
|---|---|
| Mein Mixarium · Alis Moderaum · Perfect Skin Fashion · Perfect Skin Beauty · Muster Werbetechnik | ✓ |
| **Mein Rezeptbuch** · **Mein WorkFloh** | ✗ andere |

Fünf von sieben stimmen überein — am 2026-09-10 waren es netzweit **zwei von
fünfzehn**. Das Register führt die **committete**, der Browser die **lebende**
Identität; Klaus' Regel vom 2026-09-10 lautet *„die Neuere ist die Richtige,
auch bei der Kennung"*. Die zwei nachzuziehen kostet ein Neu-Signieren und
rechnet alle 21 `matchScore`-Werte neu. **Klaus' Entscheidung, nicht die einer
Sitzung.**

**Vier Knoten haben KEINE Sicherung ihrer Kennung** (aus Klaus' Bildern
abgelesen): Muster Werbetechnik · Mein Rezeptbuch · **Mein Mixarium** · Mein
WorkFloh. Alis, PSF und PSB tragen `2026-09-14`.
Bei **Mixarium** wiegt es am schwersten: seine Kennung
`6U3aniLM3Rps…` ist in `status.json` **und in den Proben genagelt** — es ist
die, die am 2026-09-10 den Sprung 0,826 → 0,883 überlebt hat.
Klaus ist darauf hingewiesen; **eine Sitzung kann den Knopf nicht drücken.**

### ✅ NACHTRAG desselben Tages — Muster Werbetechnik ist über dem Boden

Klaus hat noch am 2026-09-15 über das Siegel neu signiert und die Spore
geschickt. Geprüft (8 Prüfungen, 0 rot: Signatur VALID reziprok ·
`id == base64url(SHA256(rawPub))` · kein `d` · `key_ops` nur `["verify"]` ·
384 Stellen · L2 = 1.000000044 · kein `_demo` · Text **byte-gleich mit beiden
Wegen zur Spore**), abgelegt als `Mein-Workfloh-Page/sbkim/spore.json`, die
alte daneben als `spore-vorgaenger-2026-08-16.json`.

**Die abgelegte Spore hing bis dahin auf der ALTEN Kennung** — das Register
führte seit dem 2026-09-10 schon die neue. **Depot und Register stimmen jetzt
zum ersten Mal überein.**

| | gegen Sages Spore |
|---|---|
| vorher (421 Zeichen) | 0.793613 |
| **jetzt (864 Zeichen)** | **0.907431** — über `PROVIDER_MIN_MATCH = 0.80` |

**Von den fünf Knoten unter dem Boden sind VIER übrig:** Alis Moderaum
0.793347 · Perfect Skin Fashion 0.793030 · Tomys Hub 0.786371 · Perfect Skin
Beauty 0.783216. **Für alle vier ist derselbe Hebel gemessen:** nicht Länge,
sondern dass der Text das Protokoll **nennt**.

⚠ Der Eintrag trägt `matchScoreQuelle: "depot-2026-09-15"` und damit einen
**anderen Maßstab** als die übrigen zwanzig (`raum-2026-09-10`).
⚠ **Die fehlende Sicherung bleibt.** Neu signieren ist nicht dasselbe wie
sichern — die Warnung im Verbinden-Fenster steht weiter.

### ⚠ UND ZWEI REGELN ZIEHEN BEIM PULS GEGENEINANDER

Beim Auslagern (2.983 → 2.904) wurde `smoke_sbkim_name.mjs` rot, zu Recht: ihre
vierte Prüfung ist eine **Gegenrichtung** und verlangt, dass `docs/PULS.md` den
alten Befund zur falschen SBKIM-Auflösung **weiter festhält** — Tilgen wäre der
Schaden, den sie verhindert.

> „PULS über 3000 Zeilen wird ausgelagert" gegen „PULS muss diesen Befund
> behalten".

Aufgelöst ohne eine der beiden zu beugen: ausgelagert wurde ein Eintrag, der den
Befund **nicht** trägt. **Wer das nächste Mal auslagert, sieht vorher nach,
welcher Eintrag ihn trägt** (`grep -n "Semantisch-Empfangendes" docs/PULS.md`).

### Ein Nebenbefund, nicht von A18

`modules/noble-secp256k1.js` steht in der Nachlade-Kette und wird dort als
gewöhnliches Skript geladen — es ist aber ein ES-Modul und wirft
`Unexpected token 'export'`. **Vorher wie nachher** (in allen drei gemessenen
Ständen), die Kette läuft fail-soft weiter, Siegel und Spore sind da
(`SbkimSpore.generateOwnSpore` vorhanden, `window.nobleSecp256k1` nicht).
**Nicht untersucht**, ob dadurch etwas fehlt. Eigene Runde.

---

## A · AUFTRAG EINS: `TEXTE.en` füllen

Genau **eine** Datei ändert sich: `src/modules/16b_andock_wizard.js`.
Danach `node tools/kanon-verteilen.mjs --nur 16b --schreiben`, und alle 19
Knoten haben es. **Das ist der ganze Sinn von A18** — vorher wären es 19 Pull
Requests gewesen.

### Der Rahmen steht

```js
var TEXTE = {};      // TEXTE.en = { "deutscher Satz": "english sentence" }
var TEXTE_DE = [ … ] // 76 Einträge, die DATEN-TAFEL
function T(de) { … } // schlüssellos: der deutsche Satz IST der Schlüssel
```

Rangfolge der Sprache: `SBKIM_SIEGEL_WIZ.lang` → `<html lang>` → `de`.

### ⚠ NEU GEMESSEN AM 2026-09-15 — die Falle ist eine andere als gedacht

Der alte Brief sagte: *„vorher nachsehen, welche Apps `lang="en"` tragen."*
**Gemessen: keine einzige.** Statisch trägt kein `index.html` und kein
`start.html` im Netz `lang="en"`.

**Aber zehn Apps setzen `<html lang>` zur LAUFZEIT**, sobald der Nutzer eine
Sprache wählt:

| Datei | Zeile |
|---|---|
| `Alis-Moderaum/app.js` | 448 |
| `Perfect-Skin-Fashion/app.js` | 299 |
| `New-Perfect-Skin-Beauty-/script.js` | 296 |
| `PWA-Toolpoint/assets/sprache.js` | 97 |
| `Mein-Mixarium/index.html` | 6100 |
| `Mein-Rezeptbuch/QC_MeinRezb_24_04_26.html` | 6230 |
| `Mein-WorkFloh/index.html` | 1041 |
| `Muttis-Rezeptbuch/index.html` | 4694 |
| `Mein-Mixarium-Page/assets/app.js` | 51 |
| `Tomys-Hub/workfloh/index.html` | 978 |

**Daraus folgt beides, und beides gehört gemessen statt angenommen:**

1. **Für einen Besucher, der nichts wählt, ändert sich nichts.** Die tragende
   Zusicherung *„OHNE EINSTELLUNG ÄNDERT SICH NICHTS"* hält.
2. **Sobald jemand EN wählt, schaltet der Wizard mit** — in diesen zehn Apps.
   Das ist gewollt. Es ist trotzdem eine **Verhaltensänderung**, und sie wird
   im Browser nachgemessen, nicht vorausgesetzt.

### ⚠ Und Englisch ist nicht die einzige Sprache im Netz

Mixarium, Mein-Rezeptbuch und Muttis-Rezeptbuch tragen **acht** (de, en, ru,
zh, es, fr, it, pt), Perfect Skin Fashion vier (DE/EN/RU/ES).
Wer `ru` wählt, bekommt den Wizard **auf Deutsch** — `TEXTE.ru` gibt es nicht,
und `T()` fällt fail-soft zurück. **Das ist richtig so und muss dastehen**:
eine halb übersetzte Oberfläche, die sich für ganz übersetzt hält, wäre der
schlimmere Zustand. Ob weitere Tabellen folgen, entscheidet Klaus.

### Was die Wächter erzwingen

Drei gibt es schon (`tests/smoke_kanon_wizard.mjs`):

1. jedes `T("…")`-Argument steht in `TEXTE_DE`
2. jeder Eintrag aus `TEXTE_DE` wird benutzt
3. **jeder Anzeigetext geht durch `T()`** ← der wichtige

**Ein vierter kommt dazu**, die Entsprechung von 1 und 2 auf der englischen
Seite: jeder Schlüssel in `TEXTE.en` steht in `TEXTE_DE`, und keiner fehlt.
Ein Schlüssel, den es nicht gibt, ist stiller toter Text; ein fehlender ist ein
deutscher Satz mitten im Englischen.

**Ein fünfter ist neu vorzuschlagen:** dass ein Wechsel auf `en` im echten
Browser wirklich englische Texte zeigt — und ein Wechsel zurück deutsche. Wer
nur eine Richtung misst, hat einen Wächter, der auch dann grün bleibt, wenn die
Rückkehr kaputt ist. *(Dieselbe Lehre wie „ein Wächter auf ‚X zählt nicht
mehr' ist zu wenig".)*

### Zwei Apps haben einen Bauweg, der nicht vergessen werden darf

- **Mein-Rezeptbuch:** Quelle ist `QC_MeinRezb_24_04_26.html`, danach
  `python3 build.py` → `index.html`. Wer nur `index.html` anfasst, verliert es
  beim nächsten Bau.
- **Mein-Mixarium:** `index.html` und `QC_Mixarium_20_04_26.html` sind
  **byte-identisch** zu halten, `md5sum` vergleichen.

### Fallen, die in dieser Arbeit schon zugeschnappt sind

- **Hinzufügen statt Ändern.** Wer für einen Gegenprobe-Fall einen `T()`-Aufruf
  **wegnimmt**, macht seinen Tafel-Eintrag tot — dann feuert Wächter 2 statt
  Wächter 3, und der Fall beweist etwas anderes, als er behauptet. Vier Fälle
  sind genau daran gescheitert.
- **Die Wegwerf-Kopie braucht `node_modules`.** Fehlt es, meldet der
  Browser-Teil „nicht lauffähig", und **jeder** Fall, dessen Wächter dort lebt,
  bleibt grün. Drei Fälle massen dadurch nichts.
- **Ein Regex-Fenster (`[\s\S]{0,140}?`) misst den ABSTAND**, nicht die Sache.
  Gemessen wird der **Block**.
- **Ein Name, der der Anfang eines anderen ist**, misst nicht, was er zu messen
  glaubt. Wortgrenze.
- **Ein Erklär-Kommentar hat schon einen tadellosen Code angeklagt.** Gezählt
  wird im Code, nicht in der Datei.
- **Ein toter Anker ist kein blinder Wächter** (`docs/LEHREN.md` § 11). Eine
  Prüfung hat drei Ausgänge, nicht zwei.
- ⚠ **`docs/LEHREN.md` § 10:** eine Gegenprobe, die den **echten** Baum
  sabotiert, kann ihre Sabotage in einen **Commit** schieben. Während eines
  Laufs nicht committen; vor jedem Commit die **Dateiliste** ansehen.
- ⚠ **`docs/LEHREN.md` § 12 (neu, 2026-09-15):** wer an einer Nachlade-Kette
  etwas ANHÄNGT, prüft die Zeile DAVOR. Und: **ein Push ohne sichtbare Ausgabe
  ist ein Schweigen, kein Erfolg.**

### Werkzeuge

```bash
node tools/kanon-verteilen.mjs --nur 16b             # nachsehen
node tools/kanon-verteilen.mjs --nur 16b --schreiben # verteilen
node tools/wizard-laedt-pruefen.mjs                  # LÄDT jede Seite im echten Browser
node tools/wizard-trennung-pruefen.mjs ../<repo>     # misst eine einzelne
node tests/smoke_werkzeuge_parsen.mjs                # parst jedes Werkzeug
```

---

## B · AUFTRAG ZWEI: die Zeiterfassung zusammenführen (Klaus 2026-09-15)

### Klaus' Wort — der Auftrag im Wortlaut

> *„Zurzeit wird die Zeit für meine Arbeit im Kim Hub Company gestoppt, was ich
> allerdings, da ich nicht immer da arbeite, manchmal vergesse zu stoppen und
> auch zu aktualisieren. … entweder arbeite ich in Kim Hub Company oder an den
> anderen Apps, aber die Arbeitszeit ist ja dieselbe, die ich benötige für die
> Arbeit."*

> *„Jetzt weiß ich, dass auch ein fehlerhaftes Ergebnis ein gutes Ergebnis sein
> kann aus der Forschung, weil man dann weiß, was man falsch macht."*

> *„Auch wenn ich mal auf der Toilette bin, auch wenn ich einmal vor dem
> Computer einschlafe, es ist alles Arbeit. Denn woher weiß man, dass der
> Forscher, der seinen Testlauf laufen lassen muss, nicht in der Nähe sein muss,
> um den Computer anzulassen … Eine überwachende Funktion ist auch Arbeit. …
> Arbeit ist Arbeit, gerade in dem Gebiet."*

> *„Deswegen sollten wir vielleicht überlegen, ob wir die Zeiterfassung anders
> gestalten, über die Historie oder so, wie wir es ursprünglich gemacht hatten.
> … Das nehmen wir jetzt als Lernphase."*

### Der Befund: die Historien-Methode liegt an ZWEI aufeinanderfolgenden Tagen daneben — in entgegengesetzte Richtungen

`Kimhub/tools/zeiten-sammeln.mjs` misst die Spanne vom **ersten bis zum letzten
Commit eines Tages** und schreibt selbst in den Kopf:

> *„Das ist eine UNTERGRENZE der Arbeitszeit, kein Aufwand: Lesen, Nachdenken
> und Verwerfen vor dem ersten Commit fehlen darin. Eine lange Pause zwischen
> zwei Commits zaehlt darin voll mit."*

**Beide Hälften dieser Warnung sind an zwei aufeinanderfolgenden Tagen
eingetreten, gemessen über alle 22 Depots:**

| Tag | Commits | Depots | Commit-Spanne | Was wirklich war |
|---|---|---|---|---|
| 2026-09-14 | 197 | 22 | **16 h 02 min** (07:04–23:06 UTC) | Pausen zählen voll mit → **zu viel** |
| 2026-09-15 | 24 | 8 | **0 h 29 min** (09:13–09:42 UTC) | Klaus' Bildschirmfotos tragen **12:41–12:54 UTC** → mindestens **3 h 12 min** liegen NACH dem letzten Commit → **zu wenig** |

**Der 15. ist der schärfere Fall.** Die gesamte Arbeit dieses Tages nach 09:42
— das Nachmessen in drei Browser-Ständen, Klaus' Widerspruch, sein Sichttest an
sieben Apps, der Kennungs-Abgleich gegen das Register — **hinterlässt keinen
einzigen Commit** und ist für `zeiten-sammeln.mjs` unsichtbar. Aus einem
Arbeitstag werden 29 Minuten.

⚠ **Das trifft den Forschungsdatensatz unmittelbar — und dort steht ein
Widerspruch, der beim Nachmessen am 2026-09-15 herausfiel.**

`forschung/METHODE.md` § 3 sagt, `beginn` und `ende` seien *„erste und letzte
Handlung der Sitzung, in UTC | **Uhr der Sitzung**"*.
`forschung/STAND_V1_V2.md` nennt dieselben Zahlen *„98,1 h (**Commit-Spannen**,
nicht Klaus' Arbeitszeit)"*.

**Die Daten geben dem zweiten recht, und zwar unübersehbar.** Zwei Einträge vom
2026-09-08 melden **eine Minute**:

| Eintrag | beginn–ende | Minuten |
|---|---|---|
| `2026-09-08-tresor-rezeptbuch-design` | 16:27–16:28 | **1** |
| `2026-09-08-chefcode-aenderbar` | 16:53–16:54 | **1** |
| `2026-09-09-sichttest-und-quellmessung` | 09:17–09:55 | 38 |

Eine Sitzung, die Befunde hervorbringt, dauert keine Minute. Das sind zwei
Commits, die eine Minute auseinanderliegen — also die **Commit-Spanne**, nicht
die Uhr der Sitzung.

**Damit sagt die Methode etwas anderes als der Datensatz tut**, und die Summe
(100,8 h über 22 Einträge) trägt beide Fehlerrichtungen aus der Tabelle oben in
sich. Der Eintrag für den 2026-09-15 würde **29 Minuten** melden.

**Das gehört in Auftrag B mit hinein:** bevor eine neue Zeiterfassung gebaut
wird, ist zu klären, ob `beginn`/`ende` künftig wirklich die Uhr der Sitzung
tragen — und ob die 22 vorhandenen Einträge dann noch mit den neuen
vergleichbar sind. **Eine halb umgestellte Reihe sähe einheitlich aus, ohne es
zu sein.** Die Vorhersagen V1 und V2 hängen nicht an diesem Feld (sie zählen
Herkünfte, keine Minuten) — die Summenzeile schon.

### Was heute existiert, und was jedes davon NICHT kann

| Werkzeug | misst | Grenze |
|---|---|---|
| **Stechuhr** (`Kimhub/ansicht.js`, `localStorage`) | Klaus' Zeit, von ihm gedrückt | nur Kimhub · nur EIN Browser (DeX und Tablet sind zwei) · **eine Sitzung kann sie nicht drücken** (NETZWEIT § 6b) · Klaus vergisst sie |
| **`tools/zeiten-sammeln.mjs`** | Commit-Spanne je Tag | nur Kimhub · nichts vor dem ersten und nach dem letzten Commit · Pausen zählen voll |
| **`werkstatt/buchhaltung/fahrtenbuch.json`** | bezahlte Agenten-Fahrten | nur Kimhub · steht im `.gitignore`, liegt nur auf Klaus' Gerät |
| **`forschung/sitzungen.json`** | `spanne` je Sitzung | = Commit-Spanne, siehe oben |

⚠ **Und drei davon leben im `.gitignore`.** `zeiten.json`, `fahrtenbuch.json`
und die Stechuhr im `localStorage` reisen **nicht mit**. Eine Auswertung in
einer anderen Umgebung sieht sie nie — der Forschungsdatensatz aber schon
(`forschung/sitzungen.json` steht bewusst **nicht** im `.gitignore`).

### Die Frage, die zu entscheiden ist

**Nicht zu entscheiden von einer Sitzung — vorzulegen.** Drei Wege, jeder mit
seinem Preis, keiner umsonst:

1. **Historie als alleinige Grundlage, aber über ALLE Depots statt nur Kimhub.**
   Nachprüfbar, reist mit, braucht keine Disziplin.
   **Preis:** der Schwanz fehlt weiter (der 15. bliebe 29 Minuten), und die
   Pausen zählen weiter voll.
2. **Anwesenheit im Browser automatisch erfassen** (Maus, Tastatur,
   `visibilitychange`), wie Klaus es beschreibt.
   **Preis:** misst den **Browser**, nicht die Arbeit. Termux, Lesen am Tablet,
   Nachdenken ohne offene Seite fallen heraus — und ein Tab, der über Nacht
   offen bleibt, meldet acht Stunden Arbeit. Klaus' eigenes Argument
   („überwachende Funktion ist auch Arbeit") spricht **für** großzügiges Zählen,
   macht aber genau diesen Fehler teuer.
3. **Beide, getrennt geführt und benannt zusammengerechnet** — Historie als
   nachprüfbarer Boden, erfasste Anwesenheit als Aufschlag, jede Zeile mit ihrer
   Herkunft.
   **Preis:** zwei Quellen, die auseinanderlaufen können, und die Pflicht,
   Überschneidungen **einmal** zu zählen — die Regel dafür steht schon in
   Kimhubs Verfassung (*„dieselbe Stunde zählt EINMAL"*, Vereinigung der
   Zeiträume, Korrektur wird **beziffert**).

**Was in jedem Fall gilt und nicht verhandelbar ist:**

- **Die zu hohe Zahl ist der teuerste Fehler.** Sie fällt bei der ersten
  Rückfrage um, und dann fallen die richtigen Zeilen mit. Deshalb heisst das
  Feld `spanne` und nicht `gearbeitet`.
- **Eine geratene Zahl klingt genau wie eine gemessene.** Wo nichts gemessen
  wurde, steht „nicht gemessen" — nicht „0".
- **Wo gekürzt oder geschätzt wurde, steht dass gekürzt wurde.**

### ⚠ Und das ist selbst ein Forschungsergebnis

Klaus hat es benannt: *„auch ein fehlerhaftes Ergebnis kann ein gutes Ergebnis
sein."* Hier ist der Fall konkret:

> **Eine Messmethode, die in ihrem eigenen Kopf-Kommentar korrekt vor ihren
> beiden Fehlerrichtungen warnt, ist trotzdem an zwei aufeinanderfolgenden Tagen
> in beide gelaufen — und niemand hat es an der Zahl gemerkt.** Gemerkt hat es
> der Betreiber, weil ihm das Stoppen der Uhr lästig wurde. Herkunft: `klaus`.

Das gehört als eigener Befund in `forschung/sitzungen.json` und ist stärkeres
Material als eine Methode, die auf Anhieb funktioniert hätte.

---

## C · DIE FORSCHUNG — was offen ist

### Die vorregistrierte Schwelle ist überschritten, die Auswertung fehlt

`forschung/METHODE.md` § 6: *„Ausgewertet wird bei zwanzig Sitzungen, vorher
nicht."* Der Datensatz trug am 2026-09-08 zwanzig; `forschung/STAND_V1_V2.md`
hält den Zahlenstand fest und sagt ausdrücklich: **das ist nicht die
Auswertung.**

**Heute nachgerechnet über alle 22 Einträge** (2026-09-15, aus
`forschung/sitzungen.json`):

| | Zahl | Anteil |
|---|---|---|
| Sitzungen | 22 | |
| Befunde | 340 | |
| `hinsehen` | 148 | **43,5 %** |
| `gegenprobe` | 85 | 25,0 % |
| `klaus` | 58 | 17,1 % |
| `regel` | 49 | **14,4 %** |
| **blinde Wächter** | **146** | **42,9 %** |

| | Wortlaut | Gemessen | Hält |
|---|---|---|---|
| **V1** | `regel` liegt **unter** `hinsehen` | 14,4 % gegen 43,5 % | **ja** |
| **V2** | blinde Wächter fallen **nicht unter 10 %** | 42,9 % | **ja** |

⚠ **Das ist wieder nur der Zahlenstand.** Die Auswertung — trägt der Zuschnitt
der Herkünfte, sind die Sitzungen vergleichbar, ordnet dieselbe Hand ein, die
die Vorhersage schrieb — **steht weiter aus.** Sie ist eine eigene Strecke.

### Für diese Sitzung fehlt der Eintrag noch

`forschung/sitzungen.json` endet bei `2026-09-09-sichttest-und-quellmessung`.
Die Sitzungen vom **2026-09-14** (A18) und **2026-09-15** (Komma) stehen noch
nicht darin. Die Zahlen dafür liegen in diesem Brief; das Werkzeug ist
`node tools/sitzung-eintragen.mjs <eintrag.json>`, danach
`node tools/forschung-bauen.mjs`.

**Befunde des 2026-09-15 mit Herkunft**, zum Eintragen:

| Befund | Herkunft | Wächter blind? |
|---|---|---|
| Das fehlende Komma trifft sieben Apps | `klaus` (er meldete das Siegel-Verhalten) | **ja** — 414 Prüfungen liefen, keine lud eine Seite |
| `wizard-trennen.mjs` parst nicht | `hinsehen` | **ja** — kein Wächter fuhr `node --check` |
| Sieben leere Pull Requests | `regel` (der neue Wächter blieb rot) | nein |
| Eine Messung nur in EINE Richtung geprüft (`top < 0`, nie `top > Höhe`) | `hinsehen` | **ja** |
| Wortwahl „seit gestern kein SBKIM" falsch | `klaus` | — (kein Wächter zuständig) |
| Vier Knoten ohne Sicherung, zwei Kennungen abweichend | `hinsehen` (aus Klaus' Bildern) | nein |
| `noble-secp256k1` lädt in der Kette nicht | `hinsehen` | **ja** |
| Zeiterfassung läuft in beide Fehlerrichtungen | `klaus` | **ja** — die Warnung stand im Kopf der Datei |

---

## D · WAS SONST OFFEN IST (unverändert, damit es nicht verlorengeht)

- **44 Kanon-Dateien im Netz hängen zurück**, einzelne um über 300 Zeilen.
  Gemeldet, nicht nachgezogen. Je Generationen-Sprung ein Probenlauf im
  Ziel-Repo.
- **45 blinde Gegenprobe-Fälle in PWA Toolpoint** (voller Lauf 2026-09-14:
  **414 gefangen · 45 blind · 3 tote Anker**, echter Rückgabewert 1). Sieben
  sind eingeordnet (fünf tote Anker, zwei auch auf `origin/main` blind), die
  übrigen 38 sind eine eigene Aufgabe.
- **Zwei `jasons-bibliothek/`-Spiegel** (Jasons-Tresor, Mein-Tresor) laden kein
  SBKIM — Unterordner ohne eigenes `assets/`. **Vorbestehend, nicht von A18**,
  als benannte Ausnahme in `tools/wizard-laedt-pruefen.mjs` eingetragen.
- **Die zwei Kennungen** (Rezeptbuch, WorkFloh) und **die vier fehlenden
  Sicherungen** — Klaus' Entscheidung bzw. Klaus' Knopfdruck.

---

## BENANNTE GRENZEN

- **Klaus' Browser-Sichttest ist nicht ersetzbar.** Wer etwas Ansehbares gebaut
  hat, legt ihm die **Adresse im Chat** hin, unaufgefordert.
- **Der Egress-Proxy sperrt `family-projekt.de`, `pwa-toolpoint.de` und
  `lausiklauskn-png.github.io`** (HTTP 000, gemessen 2026-09-15). Lokal
  servieren und headless messen, nicht live abrufen.
- **Chromium liegt unter `/opt/pw-browsers/chromium-<nnnn>/chrome-linux/chrome`**
  — der Ordnername trägt eine Nummer, nicht nur `chromium`. `playwright-core`
  je Repo einmal nachinstallieren. Fehlt es, ist eine Probe **NICHT LAUFFÄHIG,
  nicht rot**.
- **Eine Sitzung kann die Stechuhr nicht drücken** und kein Programm auf Klaus'
  Gerät starten (NETZWEIT § 6b). Nachschlagen, nicht neu entdecken.
- **`siegel-inhalt.js` und `pruefer-siegel-inhalt.js` werden NIE verteilt.**
- **In `sbkim-connect.js` steigt `init()` bei fehlendem `SbkimStorage` mit einem
  blanken `return` aus. Das ist bekannt und bleibt.**

---

## PFLICHTLEKTÜRE

1. `CLAUDE.md`
2. `docs/PULS.md` (Kopf)
3. `docs/INTERFACES.md` **§11.9** — die Trennlinie
4. `docs/LEHREN.md` **§ 10, § 11, § 12** — die Gegenprobe-Falle · toter Anker
   gegen blinden Wächter · das fehlende Komma
5. `docs/sessions/archiv/2026-09-14_andock-wizard-kanon.md`
6. `docs/sessions/archiv/2026-09-15_komma-und-sichttest.md`
7. `src/modules/16b_andock_wizard.js`
8. **Für Auftrag B:** `Kimhub/forschung/METHODE.md` · `Kimhub/forschung/STAND_V1_V2.md`
   · `Kimhub/tools/zeiten-sammeln.mjs` · Kimhubs `CLAUDE.md` § „JEDE SCHICHT IST
   AUCH EIN STUNDENNACHWEIS"

## ABSCHLUSS

`docs/PULS.md` fortschreiben (Grenze 3000, **auslagern** statt kürzen — sie
steht bei **2.904**) · Übergabeprotokoll in `docs/sessions/archiv/` ·
`sbkim/SIGNAL.json` `seq`+1 (steht bei **83**), danach das JSON auf Heilheit
prüfen · vollen Lauf fahren und den **echten** Rückgabewert nennen (`| tail` ist
zum Lesen da, nicht zum Urteilen) · `node tools/wizard-laedt-pruefen.mjs` aus
`origin/main` · nächsten Brief als Codeblock im Chat · **Klaus die Adresse für
den Sichttest hinlegen** · den Sitzungs-Eintrag in
`Kimhub/forschung/sitzungen.json` nachtragen.
