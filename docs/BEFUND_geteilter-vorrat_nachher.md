> **Abschluss-Lauf vom 2026-09-08 (abends), nach der Reparatur.** Der Bericht
> vom Vormittag steht unverändert in `BEFUND_geteilter-vorrat.md`; dieser hier
> ist derselbe Scan nach allen Merges, mit der reparierten Einstufung
> (`tests/smoke_vorrat_scan.mjs`). Sages `mycel-karte/index.html` lag beim
> Lauf noch im Zweig.

# Wer löscht die Vorräte der Geschwister?

Gemessen gegen `origin/main` jedes Depots.

**3 von 30 Depots auf dem geteilten oder ungeprüften Ursprung**
tragen mindestens eine Stelle, die jeden fremden Vorrat des Ursprungs löscht: Kimhub, Sage-Protokol, kim-hub-company.

Auf **eigenem** Ursprung (CNAME) tragen 2 Depots dieselbe Form (PWA-Toolpoint, Perfect-Skin-Beauty) — dort liegt kein Geschwister, das sie treffen könnten. Kein Befund, aber benannt:
wer eines davon auf den geteilten Ursprung zieht, zieht die Stelle mit.

Ursprung: **3 belegt eigen** (CNAME) · **28 belegt geteilt** (Pages-Lauf) · **2 ungeprüft**

Die Pages-Belege stammen aus `docs/daten/auslieferung.json` (GitHub-API,
Stand 2026-09-08). Eine `CNAME` belegt einen eigenen Ursprung; ein Lauf
„pages build and deployment" belegt, dass Pages baut und ausliefert. Beides
zugleich gibt es — family-project liefert über Hetzner UND über Pages.

> **Korrektur 2026-09-08.** Hier stand: *„Von hier aus ist die Auslieferung
> nicht nachsehbar: der Egress-Proxy sperrt `github.io`, und die
> Pages-Einstellung geben die GitHub-Werkzeuge dieser Sitzung nicht her."*
> Der zweite Halbsatz war falsch — die Werkzeuge liefern die Pages-Läufe.
> Ich hatte eine Grenze erklärt, die keine war.

Zwei Stellen zählen als **○ gewollt** und nicht als Befund: Klaus' eigenes
Aufräum-Werkzeug `tools/speicher.html` (löscht, was er anhakt — das ist der
Zweck) und der Selbsttreffer dieses Scanners in seinem Doku-Beispiel.

## Alis-Moderaum

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 99 Läufe, zuletzt 2026-09-08T15:05:43Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 2

- ✓ `sw.js:105` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "alis-moderaum-")`
- ✓ `warehouse.html:3459` · Sorte B · Filter: `startsWith("alis-moderaum-")`

## BookLedgerPro

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 1315 Läufe, zuletzt 2026-09-08T15:06:58Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 2

- ✓ `src/ui/shell.js:388` · Sorte B · Filter: `startsWith("blpr-")`
- ✓ `sw.js:235` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "blpr-")`

## Company-Brain

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 22 Läufe, zuletzt 2026-09-08T14:46:39Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 1

- ✓ `sw.js:37` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "company-brain-")`

## Jasons-Tresor

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 230 Läufe, zuletzt 2026-09-08T14:46:20Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 3

- ✓ `index.html:3093` · Sorte B · Filter: `startsWith("jasons-tresor-")`
- ✓ `jasons-bibliothek/index.html:3093` · Sorte B · Filter: `startsWith("jasons-tresor-")`
- ✓ `sw.js:80` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "jasons-tresor-")`

## Kim-Bell

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 55 Läufe, zuletzt 2026-09-08T14:46:11Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 2

- ✓ `index.html:251` · Sorte B · Filter: `startsWith("kim-bell-")`
- ✓ `sbkim-sw.js:79` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "kim-bell-")`

## Kimboard

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 130 Läufe, zuletzt 2026-09-08T14:46:26Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 3

- ✓ `index.html:2897` · Sorte B · Filter: `/webllm|mlc/i.test(k) — gezielt`
- ✓ `index.html:4386` · Sorte B · Filter: `startsWith("kimboard-")`
- ✓ `sw.js:123` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "kimboard-")`

## Kimhub

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 153 Läufe, zuletzt 2026-09-08T13:35:51Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **1** · richtig gefiltert: 2

- ✗ `ansicht.js:4232` · Sorte B · Filter: `kein Filter`
- ✓ `company-sw.js:54` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "kim-hub-company-")`
- ✓ `sw.js:45` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "kimhub-werkstatt-")`

## Kimseek

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 75 Läufe, zuletzt 2026-09-08T14:46:14Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 2

- ✓ `modules/22_such_widget.js:4693` · Sorte B · Filter: `Wirt setzt window.SBKIM_VORRAT_PRAEFIX — ohne Wert wird nichts gelöscht`
- ✓ `sbkim-sw.js:84` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "kimseek-")`

## Kuechenzettel

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 10 Läufe, zuletzt 2026-09-08T15:05:46Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 1

- ✓ `sw.js:47` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "kuechenzettel-")`

## Mein-Mixarium

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 649 Läufe, zuletzt 2026-09-08T14:46:29Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 3

- ✓ `QC_Mixarium_20_04_26.html:13157` · Sorte B · Filter: `includes("mixarium-sw-")`
- ✓ `app-sw.js:107` · Sorte A · Filter: `includes(VORRAT_KENNUNG = "mixarium-sw-")`
- ✓ `index.html:13157` · Sorte B · Filter: `includes("mixarium-sw-")`

## Mein-Rezeptbuch

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 685 Läufe, zuletzt 2026-09-08T14:53:46Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 3

- ✓ `QC_MeinRezb_24_04_26.html:14174` · Sorte B · Filter: `startsWith("meinrezeptbuch-")`
- ✓ `app-sw.js:54` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "meinrezeptbuch-")`
- ✓ `index.html:14186` · Sorte B · Filter: `startsWith("meinrezeptbuch-")`

## Mein-Rezeptbuch-Page

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 22 Läufe, zuletzt 2026-09-08T14:46:57Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 1

- ✓ `sw.js:37` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "rezeptbuch-page-")`

## Mein-Tresor

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 407 Läufe, zuletzt 2026-09-08T14:46:23Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 3

- ✓ `index.html:3411` · Sorte B · Filter: `startsWith("mein-tresor-")`
- ✓ `jasons-bibliothek/index.html:3411` · Sorte B · Filter: `startsWith("mein-tresor-")`
- ✓ `sw.js:80` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "mein-tresor-")`

## Mein-WorkFloh

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 186 Läufe, zuletzt 2026-09-08T14:46:48Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 2

- ✓ `index.html:2961` · Sorte B · Filter: `startsWith("workfloh-")`
- ✓ `sw.js:76` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "workfloh-")`

## Mein-Workfloh-Page

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 19 Läufe, zuletzt 2026-09-08T14:46:54Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 1

- ✓ `sw.js:70` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "werbetechnik-page-")`

## Muttis-Rezeptbuch

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 227 Läufe, zuletzt 2026-09-08T14:53:51Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 4

- ✓ `QC_MR_08_04_26.html:11046` · Sorte B · Filter: `startsWith("muttisrezeptbuch-")`
- ✓ `app-sw.js:47` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "muttisrezeptbuch-")`
- ✓ `index.html:11058` · Sorte B · Filter: `startsWith("muttisrezeptbuch-")`
- ✓ `sw.js:38` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "handbuch-")`

## PWA-Toolpoint

Ursprung: **eigen** (pwa-toolpoint.de) — CNAME auf origin/main · Pages baut darauf (zuletzt 2026-09-08T08:54:19Z)

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `assets/thema.js:89` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:74` · Sorte A · Filter: `k !== CACHE_VERSION`

## Perfect-Skin-Beauty

Ursprung: **eigen** (perfectskinbeauty.de) — CNAME auf origin/main · Pages baut darauf (zuletzt 2026-08-22T07:32:39Z)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **1**

- ✗ `script.js:633` · Sorte B · Filter: `kein Filter`

## Privat-Brain

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 83 Läufe, zuletzt 2026-09-08T14:46:42Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 4

- ✓ `index.html:2680` · Sorte B · Filter: `startsWith("private-brain-")`
- ✓ `modules/pinnwand-widget.js:740` · Sorte B · Filter: `/webllm|mlc/i.test(k) — gezielt`
- ✓ `modules/pinnwand-widget.js:1575` · Sorte B · Filter: `startsWith("private-brain-")`
- ✓ `sw.js:59` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "private-brain-")`

## SB-KIMTool-Point

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 430 Läufe, zuletzt 2026-09-08T14:46:45Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 3

- ✓ `such-tool/modules/22_such_widget.js:4693` · Sorte B · Filter: `Wirt setzt window.SBKIM_VORRAT_PRAEFIX — ohne Wert wird nichts gelöscht`
- ✓ `such-tool/sbkim-sw.js:61` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "sbkim-such-tool-")`
- ✓ `web/tools/sbkim-such-widget.js:4693` · Sorte B · Filter: `Wirt setzt window.SBKIM_VORRAT_PRAEFIX — ohne Wert wird nichts gelöscht`

## Sage-Protokol

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 1365 Läufe, zuletzt 2026-09-08T15:05:53Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **1** · richtig gefiltert: 9

- ✓ `index.html:5247` · Sorte B · Filter: `startsWith("sage-protokol-")`
- ✗ `mycel-karte/index.html:320` · Sorte B · Filter: `kein Filter`
- ✓ `pinnwand/index.html:1687` · Sorte B · Filter: `/webllm|mlc/i.test(k) — gezielt`
- ✓ `pinnwand/index.html:2239` · Sorte B · Filter: `startsWith("sbkim-pinnwand-")`
- ✓ `pinnwand/sw.js:84` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "sbkim-pinnwand-")`
- ✓ `sbkim-bundle-voll/modules/22_such_widget.js:4693` · Sorte B · Filter: `Wirt setzt window.SBKIM_VORRAT_PRAEFIX — ohne Wert wird nichts gelöscht`
- ✓ `sbkim-demo/aktualisieren.js:78` · Sorte B · Filter: `startsWith("sbkim-demo-")`
- ✓ `src/modules/22_such_widget.js:4693` · Sorte B · Filter: `Wirt setzt window.SBKIM_VORRAT_PRAEFIX — ohne Wert wird nichts gelöscht`
- ✓ `such-tool/modules/22_such_widget.js:4693` · Sorte B · Filter: `Wirt setzt window.SBKIM_VORRAT_PRAEFIX — ohne Wert wird nichts gelöscht`
- ✓ `such-tool/sbkim-sw.js:61` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "sbkim-such-tool-")`
- ○ `tools/speicher.html:221` · Sorte B · Filter: `ABSICHT — Klaus' Aufräum-Werkzeug löscht genau die Vorräte, die er anhakt; ursprungsweit ist hier der Zweck`
- ○ `tools/vorrat-scan.mjs:13` · Sorte B · Filter: `SELBSTTREFFER — der Scanner findet sein eigenes Doku-Beispiel`

## Tomys-Hub

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 166 Läufe, zuletzt 2026-09-08T15:05:50Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 6

- ✓ `bookledger/sw.js:21` · Sorte A · Filter: `startsWith("yami-bookledger-")`
- ✓ `index.html:334` · Sorte B · Filter: `startsWith("tomy-hub-")`
- ✓ `promptgenerator/sw.js:25` · Sorte A · Filter: `startsWith("yami-promptgen-")`
- ✓ `showcase/sw.js:26` · Sorte A · Filter: `startsWith("yami-showcase-")`
- ✓ `sw.js:28` · Sorte A · Filter: `startsWith("yami-hub-")`
- ✓ `workfloh/sw.js:27` · Sorte A · Filter: `startsWith("yami-workfloh-")`

## family-project

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 386 Läufe, zuletzt 2026-09-08T14:46:35Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 2

- ✓ `assets/app.js:622` · Sorte B · Filter: `startsWith("family-projekt-")`
- ✓ `sw.js:89` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "family-projekt-")`

## kim-hub-company

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 36 Läufe, zuletzt 2026-09-08T13:22:39Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **1** · richtig gefiltert: 2

- ✗ `ansicht.js:4232` · Sorte B · Filter: `kein Filter`
- ✓ `sw.js:60` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "kim-hub-company-")`
- ✓ `werkzeuge/buendel-pruefer/sw.js:30` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "buendel-pruefer-")`

## mycel-karte

Ursprung: **geteilt** (lausiklauskn-png.github.io) — Pages belegt — 26 Läufe, zuletzt 2026-09-08T15:05:37Z (docs/daten/auslieferung.json, Stand 2026-09-08)

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **0** · richtig gefiltert: 2

- ✓ `index.html:312` · Sorte B · Filter: `startsWith("mycel-karte-")`
- ✓ `sw.js:28` · Sorte A · Filter: `startsWith(VORRAT_PRAEFIX = "mycel-karte-")`

