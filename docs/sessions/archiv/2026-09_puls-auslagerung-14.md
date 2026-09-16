# PULS-Auslagerung 14 — ausgelagert am 2026-09-16

Wortgleich aus `docs/PULS.md` genommen, damit die Datei unter ihrer
3000-Zeilen-Grenze bleibt. **Nichts gekürzt** — nur verschoben.

## Stand 2026-09-14 (Haupt-Sitzung, A18, Abschluss) · ⚠ TOTER ANKER ALS BLINDER WÄCHTER GELESEN

**Rolle:** Haupt-Sitzung, Abschluss von A18.

**Getan.** PWA Toolpoints `probe_befehl()` kannte weiter nur zwei Ausgänge,
während `probe()` seit demselben Tag drei hat. Der Python-Block darin wirft zwar
„ANKER NICHT GEFUNDEN", aber `eval` schluckt den Rückgabewert, und der Smoke lief
danach trotzdem. **Fünf Fälle meldeten sich dadurch als „BLIND", obwohl ihre
Wächter tadellos sind** — ihr Anker zeigte auf `assets/siegel-inhalt.js`, wo der
Wizard-Code bis A18 lag. Alle fünf auf `assets/sbkim-andock-wizard.js`
nachgezogen (die Konfiguration heißt dort `c` statt `WIZ`) und einzeln von Hand
nachgestellt.

**⚠ Und ich habe denselben Fehler gemacht wie das Werkzeug.** Im Text von PR #113
stand „sechs Fälle einzeln gegen `origin/main` nachgestellt — alle sechs waren
dort ebenso blind". Mit der berichtigten Probe gemessen waren sie es nicht alle:
ein Teil waren **tote Anker**. Berichtigt in PR #113 und im Brief
`docs/sessions/BRIEF_uebersetzung-wizard.md`, der zwei falsche Namen trug.

**Gemessen.**

| | |
|---|---|
| `node tests/run_alle.mjs` (Sage) | **105 grün · 0 rot · 0 nicht lauffähig**, echter exit 0 |
| `npm test` (PWA Toolpoint) | **863/863 · 0 nicht abgeschlossen**, echter exit 0 |
| Gegenprobe PWA Toolpoint (voller Lauf) | **414 gefangen · 45 blind · 3 tote Anker**, echter exit 1 |
| `node tools/kanon-verteilen.mjs --nur 16b` | **19 Kopien, alle gleich, 0 hängen zurück** |

Von den 45 blinden liegen **sieben** in A18-Dateien: fünf waren die toten Anker
oben, **zwei sind auch auf `origin/main` blind** (beide sabotieren
`assets/pruefer-sbkim-init.js`) und damit nicht von A18 verursacht.

**Offen.** Die übrigen **38 blinden Fälle** in PWA Toolpoint — eigene Aufgabe,
außerhalb dieses Umbaus. Die **44 netzweit zurückhängenden Kanon-Dateien**
weiterhin gemeldet, nicht nachgezogen.

**Nächster Schritt.** Die Übersetzung (`TEXTE.en` in
`src/modules/16b_andock_wizard.js`) — Brief liegt bereit.

**Alle 20 A18-PRs sind gemergt.**

---

## Stand 2026-09-14 (Haupt-Sitzung, A18, Nachtrag) · ⚠ EINE SABOTAGE GING IN EINEN COMMIT

**Rolle:** Haupt-Sitzung, unmittelbar nach dem A18-Rollout.

PWA Toolpoints Gegenprobe sabotiert den **echten** Arbeitsbaum. Sie lief im
Hintergrund, während parallel `git add -A && git commit` lief — und
**`assets/karte.js` ging mit einer Sabotage in den Commit und auf den Zweig**
(`if (g[k] !== true)` → `if (g[k] === undefined)`).

⚠ **DER LAUF KONNTE ES NICHT MELDEN.** Die Gegenprobe legt die Datei nach jedem
Fall zurück; `npm test` danach war grün (863/863). Im **Commit** stand sie
trotzdem — ein Zustand, den es im Arbeitsbaum nur für Sekunden gab.

**Gefunden hat es die DATEILISTE des Commits**, nicht eine Probe: dort stand ein
Name, der mit der Änderung nichts zu tun hatte.

**Behoben:** `git checkout origin/main -- …`, `--amend`, `--force-with-lease`.
Der PR war gepusht, aber **nicht gemergt** — sonst stünde die Sabotage auf
`main`. Danach 863/863 grün, und der Zweig trägt genau die sieben Dateien, die
zu A18 gehören.

**Aufgeschrieben** als [`docs/LEHREN.md` § 10](LEHREN.md) und in PWA Toolpoints
eigener Verfassung. Die bekannte Falle war bisher nur die **liegengebliebene**
Sabotage nach einem Abbruch; der Weg in einen Commit stand nirgends.

**Nächster sinnvoller Schritt:** unverändert — Klaus' Sichttest, dann `TEXTE.en`.

## Stand 2026-09-14 (Haupt-Sitzung, A18) · ✅ EIN WIZARD STATT ZWÖLF — UND DER AUTOMAT TRÄGT IHN

**Rolle:** Haupt-Sitzung. **Auftrag:** A18, den Andock-Wizard zusammenführen.
Klaus' Weg: **erst zusammenführen, dann übersetzen** — nicht umgekehrt und nicht
beides in einem Zug.

### Die Messung zuerst — und sie war schlimmer als der Brief annahm

Der Brief nannte „20 Fassungen, 272 gemeinsame Zeilen". Gemessen über alle
20 Dateien auf `origin/main`, Kommentare und ID-Präfix herausgerechnet:

| | |
|---|---|
| Dateien | **20** · 407–589 Zeilen |
| verschiedene Fassungen des Rumpfs | **15** |
| verschiedene Fassungen, **nur Code** | **12** |
| größte byte-gleiche Gruppe | **6** |

**Zwölf Fassungen eines Werkzeugs, das eine einzige sein sollte.**

### Was auseinandergelaufen war — und was davon Absicht war

| Abweichung | in wie vielen | Entscheidung |
|---|---|---|
| eigenes ID-Präfix (`almwiz-`, `kbdwiz-`, `kswiz-`, `mwpwiz-`, `psbwiz-`, `psfwiz-`, `pbwiz-`) | 7 | vereinheitlicht |
| Baustein 5 (Identitäts-Wechsler) fehlt **ganz** | 2 (Kimseek, Privat-Brain) | Kanon hat ihn |
| „der Vorschlag der App gewinnt" fehlt | 9 | Kanon hat ihn |
| `backupPrefix` hart eingetippt statt aus der Konfiguration | 6 | aus der Konfiguration |
| Wizard-Init-Heilung fehlt | 1 (family-project) | Kanon hat sie |
| Herkunfts-Zeile **unter** statt **über** dem Feld | 19 | **über** — die bessere Fassung gewinnt |
| Satz über die Membran im Schutz-Block | 1 (Privat-Brain) | **bedingt** übernommen |

⚠ **NUR EINE EINZIGE ABWEICHUNG WAR INHALT**, alle anderen waren Generationen.
Privat-Brains Membran-Satz ist wahr — aber nur, wo **Modul 15 geladen ist**. Er
hängt jetzt an `window.SbkimMembrane` und wird sonst nicht behauptet. *Ein
Schutz, den man zusichert, ohne ihn zu haben, ist schlimmer als keiner: er
beruhigt.*

⚠ **DAS EIGENE ID-PRÄFIX WAR KEINE ABSICHT**, und der Beleg dafür ist der Fall,
in dem es je gebraucht worden wäre: **PWA Toolpoint trägt ZWEI Knoten auf einer
Adresse** — und beide benutzen dasselbe `sbwiz-`.

### Die Trennlinie (Tafel: [`INTERFACES.md` §11.9](INTERFACES.md))

| | |
|---|---|
| **Kanon** `src/modules/16b_andock_wizard.js`, Marke `SBKIM — Modul 16b —` | Ablauf, **alle** Anzeigetexte, Prüfungen |
| **App-eigen** `siegel-inhalt.js` | `window.SBKIM_SIEGEL_WIZ` — die Identität, wird **nie** verteilt |

⚠ **DIE KONFIGURATION WIRD SPÄT GELESEN.** Gemessen: in Sages `index.html` steht
`assets/siegel-inhalt.js` in Zeile 4974 und `sbkim-init.js` in 4987 — der
Klebstoff kommt **danach**. Wer den Wert beim Laden fängt, fängt `undefined`.

⚠ **OHNE KONFIGURATION WIRD KEIN KNOPF GEBAUT**, sondern eine Zeile, die sagt,
was fehlt.

### Die Texte sind für die Übersetzung vorbereitet — und ändern nichts

Schlüssellos: der deutsche Satz **ist** der Schlüssel. `TEXTE_DE` ist die
Daten-Tafel (76 Einträge), `T()` fällt fail-soft auf Deutsch zurück, Rangfolge
`cfg.lang` → `<html lang>` → `de`. **Solange keine Tabelle vorliegt, ändert sich
nichts** — Zeichen für Zeichen dasselbe Deutsch.

⚠ **DER DRITTE WÄCHTER IST DER WICHTIGE.** Die ersten beiden prüfen, was da ist
(jedes `T()`-Argument steht in der Tafel · jeder Eintrag wird benutzt). Nur der
dritte prüft, was **fehlt**: geht **jeder** Anzeigetext durch `T()`?

### ⚠ Was die eigenen Proben gefunden haben, und das Nachdenken nicht

- **Sechs Apps hatten gar kein `backupPrefix`** — der Name ihrer Sicherung stand
  hart im Wizard-Code. Ohne Nachtrag hätte jede Sicherung geheißen wie jede
  andere. Gefunden von den Proben der Ziel-Repos, nicht beim Bauen.
- **Das Verteil-Werkzeug hat PWA Toolpoints `sw.js` zerlegt.** Es sprang über
  Zeilen, die mit `//` oder `*` **anfangen** — und dort steht mitten in einem
  Block-Kommentar eine Zeile, die mit einem Wort beginnt und den Pfad in
  Rückwärts-Strichen nennt. Ein Service-Worker mit Syntaxfehler ist ein
  Offline-Vorrat, der nicht mehr lädt. **Derselbe Fehler ein zweites Mal** beim
  Cache-Bump: auch er las den Namen aus dem Kommentar und hätte jedem Nutzer
  einen vollen Neu-Download für nichts gekostet.
- **PWA Toolpoints Baustein-5-Wächter war BLIND.** Er suchte
  `andockSwitchIdentity` und `refreshAndockIdentities` — Namen aus Sages altem
  Inline-Wizard, die in der Datei ausschließlich im **Kopf-Kommentar** standen.
  Ein grüner Haken über einer Datei, in der keiner der Namen als Code vorkam.
- **Vier eigene Gegenprobe-Fälle fingen aus dem falschen Grund.** Sie nahmen
  einen `T()`-Aufruf **weg**; damit wurde sein Tafel-Eintrag tot, und Wächter 2
  wurde rot statt Wächter 3. *Hinzufügen statt Ändern, sonst feuert der Nachbar
  zuerst.*
- **Drei Gegenprobe-Fälle maßen gar nichts**, weil der Wegwerf-Kopie
  `node_modules` fehlte: der ganze Browser-Teil meldete „nicht lauffähig", und
  jeder Fall, dessen Wächter dort lebt, blieb grün. Kimhubs **fünfte Art**.
- **Die Rangfolge der Sprache war ungemessen.** Es gab nur eine Seite mit
  `<html lang="en">` und ohne `cfg.lang` — die erste Stufe („die Konfiguration
  gewinnt") konnte kein Fall umwerfen. Jetzt gibt es eine Seite, auf der sich
  beide widersprechen.
- **Sieben tote Anker in kim-hub-companys Gegenprobe**, alle auf den alten
  Wohnort des Wizard-Codes. *Wer Code bewegt, bewegt Anker mit.*

### Gemessen

| | |
|---|---|
| Sage · voller Lauf | **105 Proben grün, 0 rot, 0 nicht lauffähig** |
| `smoke_kanon_wizard.mjs` | **46 grün** (Quelltext **und** echter Browser) |
| `gegenprobe_kanon_wizard.sh` | **24 gefangen · 0 durchgerutscht · 0 tote Anker** |
| die 18 Nachbar-Repos | jeder eigene Lauf grün, jede Gegenprobe ohne Durchrutscher |
| **jeder Knoten im Browser** | **19 × 8 Prüfungen grün** — Konfiguration + Kanon ergeben zusammen ein vollständiges Werkzeug mit der **eigenen** Beschreibung |
| **`kanon-verteilen.mjs --nur 16b`** | **19 Kopien, alle gleich, 0 hängen zurück** |

**Die letzte Zeile ist der Sinn der ganzen Arbeit:** ab jetzt kostet eine
Änderung am Wizard **eine** Datei und **einen** Befehl statt neunzehn Handgriffe.

**Was offen ist:** die **Übersetzung** (nächste Sitzung — `TEXTE.en` füllen, der
Rahmen steht). Klaus' **Browser-Sichttest** am Gerät ist wie immer nicht
ersetzbar. Und die 44 Kanon-Dateien, die netzweit zurückhängen, sind weiterhin
gemeldet und nicht nachgezogen.

**Nächster sinnvoller Schritt:** Klaus sieht sich ein Siegel an; danach
`TEXTE.en`.
