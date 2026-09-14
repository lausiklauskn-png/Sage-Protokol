# Brief für die nächste Sitzung — den Andock-Wizard übersetzen (A18, zweite Hälfte)

**Absender:** Haupt-Sitzung 2026-09-14 (A18). **Branch:** frisch von `origin/main`.

---

## STAND (gemessen, nicht angenommen)

Der Andock-Wizard ist seit dem 2026-09-14 **Kanon**:

| | |
|---|---|
| `src/modules/16b_andock_wizard.js` | Ablauf, **alle** Anzeigetexte, Prüfungen · Marke `SBKIM — Modul 16b —` |
| `siegel-inhalt.js` (in jeder App) | `window.SBKIM_SIEGEL_WIZ` — die Identität · bleibt in `NIE_VERTEILEN` |

Tafel: **`docs/INTERFACES.md` §11.9**. Der Rahmen fürs Übersetzen steht schon:
`TEXTE_DE` (Daten-Tafel, 76 Einträge), `T()`/`Tf()`, Rangfolge
`cfg.lang` → `<html lang>` → `de`.

**Gemessen:**

- `node tests/run_alle.mjs` → **105 grün, 0 rot, 0 nicht lauffähig**
- `tests/smoke_kanon_wizard.mjs` → **46 grün** (Quelltext **und** echter Browser)
- `tests/gegenprobe_kanon_wizard.sh` → **24 gefangen, 0 durchgerutscht, 0 tote Anker**
- `node tools/kanon-verteilen.mjs --nur 16b` → **19 Kopien, alle gleich, 0 hängen zurück**
- jeder der 19 Knoten einzeln im Browser geprüft
  (`node tools/wizard-trennung-pruefen.mjs ../<repo>`)

**Alle 20 PRs sind gemergt.**

---

## AUFGABE: `TEXTE.en` füllen — und sonst nichts

Genau **eine** Datei ändert sich: `src/modules/16b_andock_wizard.js`. Danach
`node tools/kanon-verteilen.mjs --schreiben`, und alle 19 Knoten haben es.

**Das ist der ganze Sinn von A18** — vorher wären es 19 Pull Requests gewesen.

### Die tragende Zusicherung, die NICHT fallen darf

**OHNE EINSTELLUNG ÄNDERT SICH NICHTS.** Sobald `TEXTE.en` existiert, greift sie
bei `<html lang="en">` — das ist gewollt, aber es ist eine **Verhaltensänderung
für jede App, deren Seite `lang="en"` trägt**. Vorher nachsehen, welche das sind:

```bash
for r in ../*/; do grep -l 'html lang="en"' $r/index.html 2>/dev/null; done
```

Ist eine dabei, die **nicht** englisch werden soll, gehört das besprochen, bevor
die Tabelle kommt — **nicht** danach repariert.

### Was die drei Wächter erzwingen

1. jedes `T("…")`-Argument steht in `TEXTE_DE`
2. jeder Eintrag aus `TEXTE_DE` wird benutzt
3. **jeder Anzeigetext geht durch `T()`** ← der wichtige

Für die Übersetzung kommt ein **vierter** dazu, und er ist die Entsprechung
von 1 und 2 auf der englischen Seite: jeder Schlüssel in `TEXTE.en` steht in
`TEXTE_DE`, und keiner fehlt. Ein Schlüssel, den es nicht gibt, ist stiller
toter Text; ein fehlender ist ein deutscher Satz mitten im Englischen.

---

## FALLEN, die in dieser Arbeit schon zugeschnappt sind

- **Hinzufügen statt Ändern.** Wer für einen Gegenprobe-Fall einen `T()`-Aufruf
  **wegnimmt**, macht seinen Tafel-Eintrag tot — dann feuert Wächter 2 statt
  Wächter 3, und der Fall beweist etwas anderes, als er behauptet. Vier Fälle
  sind genau daran gescheitert.
- **Die Wegwerf-Kopie braucht `node_modules`.** Fehlt es, meldet der
  Browser-Teil „nicht lauffähig", und **jeder** Fall, dessen Wächter dort lebt,
  bleibt grün. Drei Fälle maßen dadurch nichts.
- **Ein Regex-Fenster (`[\s\S]{0,140}?`) misst den ABSTAND**, nicht die Sache.
  Kommt eine Zeile dazwischen, wird die Prüfung rot, ohne dass eine Zusicherung
  gefallen wäre. Gemessen wird der **Block**.
- **Ein Name, der der Anfang eines anderen ist**, misst nicht, was er zu messen
  glaubt (`refreshWizardIdentitiesAbgeschaltet` enthält
  `function refreshWizardIdentities`). Wortgrenze.
- **Und einmal andersherum:** ein **Erklär-Kommentar** hat einen tadellosen Code
  angeklagt. Gezählt wird im Code, nicht in der Datei.
- ⚠ **`docs/LEHREN.md` § 10:** eine Gegenprobe, die den **echten** Baum
  sabotiert, kann ihre Sabotage in einen **Commit** schieben, wenn parallel
  committet wird. Während eines Laufs nicht committen; vor jedem Commit die
  **Dateiliste** ansehen.

---

## WERKZEUGE, die es jetzt gibt

```bash
node tools/kanon-verteilen.mjs --nur 16b            # nachsehen
node tools/kanon-verteilen.mjs --nur 16b --schreiben # verteilen
node tools/wizard-trennung-pruefen.mjs ../<repo>     # misst im echten Browser
node tools/wizard-trennen.mjs ../<repo>              # nur noch für NEUE Apps
```

---

## BENANNTE GRENZEN

- **Klaus' Browser-Sichttest ist nicht ersetzbar.** Headless ist die Logik
  bewiesen, nicht das Gefühl.
- Der Egress-Proxy sperrt `family-projekt.de` und `pwa-toolpoint.de` (HTTP 000).
  Lokal servieren und headless messen, nicht live abrufen.
- **Zwei Wächter in PWA Toolpoint sind blind** („Preis auf der Seite (Stufe 1
  verletzt)" und „Platzreserve der Lampen entfernt") — **schon auf `origin/main`
  gemessen**, also nicht von A18 verursacht. Eigene Aufgabe.
- Die **44 netzweit zurückhängenden Kanon-Dateien** sind weiterhin gemeldet und
  nicht nachgezogen; je Generationen-Sprung ein Probenlauf im Ziel-Repo.

---

## PFLICHTLEKTÜRE

1. `CLAUDE.md`
2. `docs/PULS.md` (Kopf)
3. `docs/INTERFACES.md` **§11.9** — die Trennlinie
4. `docs/LEHREN.md` **§ 10** — die Gegenprobe-Falle
5. `docs/sessions/archiv/2026-09-14_andock-wizard-kanon.md` — warum es so gebaut ist
6. `src/modules/16b_andock_wizard.js`

## ABSCHLUSS

`docs/PULS.md` fortschreiben (Grenze 3000, **auslagern** statt kürzen — sie steht
bei 2.981) · Übergabeprotokoll · `sbkim/SIGNAL.json` `seq`+1 (steht bei **82**),
danach das JSON auf Heilheit prüfen · vollen Lauf fahren und den **echten**
Rückgabewert nennen (`| tail` ist zum Lesen da, nicht zum Urteilen) · nächsten
Brief als Codeblock im Chat · Klaus die Adresse für den Sichttest hinlegen.
