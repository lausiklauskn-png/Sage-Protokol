# Übergabeprotokoll · 2026-09-14 · Modul 23 UI netzweit ausrollen

**Rolle:** Haupt-Sitzung, Rollout. Skill `netzweiter-modul-rollout`.
**Zweig:** `claude/modul-23-ui-rollout-ftcvpf` (in 18 App-Repos + Sage).

---

## Auftrag und was daraus wurde

Auftrag war das Ausrollen des Sprach-Hakens in „die sechzehn Apps".
**Gemessen sind es achtzehn.** Klaus hat den Umfang mitten in der Sitzung
erweitert: *„nicht nur auf die Apps ausrollen sondern prüfen ob
Aktualisierungen in der Geschenkbox und em Sageprotokolbauplan für das Mycel
und das Siegel notwendig sind"* — und genau dort lagen die zwei Funde, die der
Rollout allein nicht gefunden hätte.

## 1 · Der Rollout

### Gemessen VOR dem Kopieren, gegen `origin/main`

| Generation | Zeilen | Repos |
|---|---|---|
| `4882c3b68203` | 2249 | Mein-Mixarium · Mein-Rezeptbuch · family-project |
| `b496bc86b5b2` | 2279 | 13 weitere |
| `d344a851a025` | 2424 | PWA-Toolpoint · kim-hub-company |
| **`709c4364026e`** | **2960** | der Kanon |

**Company-Brain und Privat-Brain tragen `23_rendezvous.js`, nicht die UI** —
nachgesehen, nicht angenommen; sie sind nicht im Umfang.

### Der Diff wurde gelesen, nicht überschrieben

235–236 entfernte Zeilen je Generation, und die Zahl ist in allen dreien fast
gleich — weil es dieselben deutschen Literale sind, die jetzt in `T(...)`
stecken. **Belegt statt vermutet:** für jede entfernte Zeile mit einem Literal
ab 12 Zeichen wurde geprüft, ob ihr Text im Kanon noch vorkommt. **0 ohne
Entsprechung**, in allen drei Generationen. Also reiner Kanon-Fortschritt, keine
repo-eigene Zeile.

### Elf sha-Pins — und einer war nur mit 16 Zeichen zu finden

| Repo | Datei |
|---|---|
| Alis-Moderaum · Mein-Workfloh-Page · Perfect-Skin-Beauty · Perfect-Skin-Fashion · PWA-Toolpoint | `tools/drift-guard.mjs` |
| Kim-Bell · Kimboard · Kimseek · Mein-WorkFloh | `test/smoke.test.js` |
| kim-hub-company | `tools/sbkim-drift.mjs` |
| **SB-KIMTool-Point** | `test/kopien_drift.test.js` — **16-Zeichen-Form** |

⚠ **Der letzte ist die Falle aus dem Rezept, und sie hat zugeschnappt.** Eine
Suche nach der vollen sha meldete für SB-KIMTool-Point „kein Pin". Erst die
Suche nach dem 8-Zeichen-Präfix fand ihn. Danach netzweit gegengeprüft:
**keine alte sha mehr irgendwo.**

⚠ **Loader ≠ Modul:** in SB-KIMTool-Point wurde `assets/rendezvous-init.js`
**nicht** angefasst — die echte Kopie liegt unter `web/tools/`.

### Neun CACHE_VERSION erhöht

Nur dort, wo das Modul wirklich im Vorrat des Service-Workers steht (je
Dateinamen geprüft, nicht geraten). Die neue Zahl wurde aus `origin/main`
abgeleitet, nicht aus der eigenen Datei — NETZWEIT § 3a, nachdem am 2026-09-07
zwei Sitzungen unabhängig dieselbe Nummer vergeben hatten.

### Proben je Repo — zwei rote, beide vorbestehend

Der Rückgabewert stammt jeweils aus der Prüfung selbst, nicht aus einer Pipe.

| | |
|---|---|
| grün | 16 Repos |
| **SB-KIMTool-Point** | `npm test` exit 1 — 130 bestanden, **2 fehlgeschlagen** |
| **Tomys-Hub** | 8 von 10 grün, **2 rot** |
| **family-project** | ⊘ `playwright-core` fehlt — **nicht lauffähig, nicht rot** |

**Belegt statt behauptet:** für beide rote Repos wurde ein frischer Klon von
**unberührtem** `origin/main` gezogen und dort dieselbe Suite gefahren —
dieselben Fehlschläge, dieselben Namen. Ursache in allen vier Fällen ist die
Umgebung (fehlende Pakete, Playwright-Frist), nicht der Rollout.

### Der Sprach-Haken wurde gefahren, nicht geglaubt

Jede der 18 Kopien wurde in einem Mini-DOM **geladen** und gefragt:

```
<html lang="de">  →  _meta.lang = "de"
<html lang="en">  →  _meta.lang = "en",  langKeys = 237
```

**18/18.** Das Modul gibt unter `lang="en"` sogar seine eigene Bereitschaftszeile
auf Englisch aus.

## 2 · „Ausgerollt" heißt noch nicht „ändert etwas"

Gemessen, welche App `<html lang>` beim Sprachwechsel mitzieht (Datei + Zeile):

| | Apps |
|---|---|
| ✅ **9** — Haken greift heute | Alis-Moderaum `app.js:448` · Perfect-Skin-Beauty `script.js:419` · Perfect-Skin-Fashion `app.js:299` · family-project `assets/app.js:51` · Mein-Mixarium `index.html:6100` · Mein-Rezeptbuch `index.html:6242` · Muttis-Rezeptbuch `index.html:4694` · Mein-WorkFloh `index.html:1041` · Tomys-Hub `workfloh/index.html:978` |
| ⏸ **9** — bleibt deutsch | Jasons-Tresor · Kim-Bell · Kimboard · Kimseek · Mein-Tresor · Mein-Workfloh-Page · PWA-Toolpoint · SB-KIMTool-Point · kim-hub-company |

⚠ **Kimboard sah zuerst wie ein Treffer aus** — `index.html:4179` setzt ein
`lang`-Attribut, aber am **Mikrofon-Feld**, nicht am Dokument. Nachgesehen,
statt den Treffer zu zählen.

⚠ **Perfect-Skin-Beauty startet mit `<html lang="ru">`.** Das Modul kennt zwei
Sprachen; `ru` fällt fail-soft auf Deutsch. Beim ersten Laden steht das Fenster
dort also deutsch, bis der Besucher wechselt. **Nicht angefasst** — es ist eine
Beobachtung über eine bestehende Seite, keine Aufgabe dieser Sitzung. Im PR
benannt.

## 3 · Klaus' Nachtrag — zwei Lücken, beide stumm

### 🔴 `SbkimConnect.init({lang})` wurde still verschluckt

Die Geschenkbox verspricht einem Fremden **genau ein `init()`** — das ist ihr
ganzer Zweck. Bis heute reichte dieses `init()` das Feld `lang` **nicht** an das
Fenster durch. Kein Fehler, keine Warnung: `<html lang>` wirkte weiter, also war
nichts kaputt. Es war nur nicht erreichbar, und nirgends stand etwas dazu.

Behoben in **beiden** Bauvorlagen (byte-gleich), mit vier Wächtern in
`tests/smoke_bundle_connect.mjs` und einer neuen Gegenprobe.

⚠ **Der zweitwichtigste Wächter misst das Gegenteil:** ohne Angabe darf die
Kiste `lang` **nicht** setzen. Ein erfundener Standard überstimmte `<html lang>`
— eine englische Seite, die das Attribut korrekt mitzieht, wäre dann wieder
deutsch, **und zwar wegen der Kiste**. Ein Wächter nur auf „durchgereicht" wäre
dafür blind.

### 🔴 `docs/INTERFACES.md` kannte den Sprach-Haken nicht

Die verbindliche Tafel nannte
`init({ nodeName, createIdentity?, corner?, accent? })` — `lang?` fehlte. PR #986
und #988 haben das Modul und beide Bauvorlagen geändert, **ohne die Tafel
anzufassen**. Die Schnittstelle war vier Tage lang breiter als ihre Beschreibung.

> Die Verfassung sagt es andersherum: *„Wer eine Schnittstelle ändert, zieht
> **zuerst dort** nach, **dann** den Code. Andersrum entstehen Widersprüche
> zwischen Modulen."* Hier lief es verkehrt, und **es ist niemandem aufgefallen**
> — auch mir nicht, bis Klaus ausdrücklich nach den Bauplänen fragte.
> Nachgetragen, samt dem Vermerk, dass es nachgetragen wurde.

### Außerdem nachgezogen

`docs/MYCEL-GESCHENKBOX.md` · `sbkim-bundle/README.md` ·
`sbkim-bundle-voll/README.md` · `docs/PFLICHT_MODULE.md` — überall mit der
ehrlichen Zeile, dass ein **Voll-Knoten auf Englisch heute gemischtsprachig**
ist (23-UI englisch, 16 und 17 deutsch) und dass die Sprache in den Apps **nicht
von selbst** kommt.

### Kein Siegel-Aspekt — eine Entscheidung, keine Auslassung

`ZERTIFIKAT_ASPEKTE` gilt für **Schutz-Module** (10/11/12/14/15.B). 23-UI ist
Oberfläche. Ein Aspekt ohne Schutz-Änderung ließe das Siegel etwas behaupten,
das nicht dazugehört — die Anti-Greenwashing-Leitplanke aus Karte 16 gilt in
beide Richtungen.

## 4 · Eigene Fehler

**Mein Harnisch war zuerst falsch, und der Fehlschlag sah aus wie ein Befund.**
Die drei ersten Sprach-Wächter meldeten rot. Nicht der Code war schuld: mein
Stub hatte `SbkimStorage` weggelassen, und `init()` steigt ohne es mit einem
blanken `return` aus, **bevor** der UI-Mount kommt. Eine Aussage über die Probe,
die wie eine über den Code aussah. Der Grund steht jetzt als Kommentar in der
Probe, damit die nächste Sitzung nicht dieselbe Viertelstunde verliert.

## 5 · Gemessen (Sage, am Ende)

| | |
|---|---|
| `node tests/run_alle.mjs` | **101 Proben — 101 grün, 0 rot, 0 nicht lauffähig** |
| `tests/smoke_bundle_connect.mjs` | **25 grün, 0 rot** (4 neu) |
| `tests/gegenprobe_bundle_sprache.mjs` (neu) | **4 gefangen · 0 durchgerutscht · 0 aus dem falschen Grund** |
| `tests/gegenprobe_bau23_sprache.sh` | **9 gefangen · 0 durchgerutscht · 0 tote Anker** |
| `tests/gegenprobe_bauvorlagen.mjs` | **7/7 bemerkt, kein blinder Fleck** |
| Netzweit | **18/18 tragen `709c4364026e` auf `origin/main`** |

⚠ Der erste Lauf meldete **77 grün / 24 nicht lauffähig** — `node_modules` fehlte
im Behälter. `npm install` geholt, dann die Zahl oben. **Nicht lauffähig ist
nicht grün**, und eine Zahl ohne die Pakete sagt über zwei Dutzend Proben nichts.

Die neue Gegenprobe läuft je Fall an einer **Wegwerf-Kopie** (`mktemp -d`) — ein
abgebrochener Lauf hinterlässt kein sabotiertes Modul im Depot.

## 6 · Offen

- 🔴 **Der Verbinden-Knopf erscheint nicht, wenn `SbkimStorage` fehlt** — obwohl
  der Kommentar daneben „soll **immer** erscheinen" zusichert. **Nicht behoben,
  Frage an Klaus**, weil es eine Verhaltensfrage im Störfall ist. Volltext in
  `docs/PULS.md` § Offene Querschnitts-Fragen.
- **Klaus' Browser-Sichttest steht aus** — `family-projekt.de` auf Englisch ist
  der richtige Ort, weil der Befund dort entstand.
- **`16_siegel.js` (47 Texte) und `17_floating_widget.js` (19)** bleiben deutsch.

## 7 · Geänderte Dateien (Sage)

```
docs/INTERFACES.md              der Sprach-Haken als Vertrag
docs/MYCEL-GESCHENKBOX.md       was die Kiste zur Sprache mitbringt
docs/PFLICHT_MODULE.md          Hinweis für den, der eine App andockt
docs/PULS.md                    Eintrag + offene Frage + drei Auslagerungen
docs/sessions/archiv/2026-09-14_puls-auslagerung-3.md   (neu)
docs/sessions/archiv/2026-09-14_modul23-ui-rollout.md   (dieses)
sbkim-bundle/README.md          „Deutsch oder Englisch"
sbkim-bundle/sbkim-connect.js   lang wird durchgereicht
sbkim-bundle-voll/README.md     dito + Gemischtsprachigkeit benannt
sbkim-bundle-voll/sbkim-connect.js   byte-gleich
sbkim/SIGNAL.json               seq 74 → 75
tests/smoke_bundle_connect.mjs  vier Sprach-Wächter
tests/gegenprobe_bundle_sprache.mjs  (neu)
```
