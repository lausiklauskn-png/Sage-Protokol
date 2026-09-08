# Wer löscht die Vorräte der Geschwister?

Gemessen gegen `origin/main` jedes Depots.

**26 von 33 Depots** tragen mindestens eine Stelle, die
jeden fremden Vorrat des Ursprungs löscht.

Ursprung: **3 belegt eigen** (CNAME) · **30 ungeprüft**

⚠ **„ungeprüft" heisst ungeprüft, nicht „geteilt".** Eine `CNAME` zu haben
belegt einen eigenen Ursprung; sie nicht zu haben belegt nichts —
family-project und Company-Brain liefern über eigene Adressen aus und haben
keine. Von hier aus ist die Auslieferung nicht nachsehbar: der Egress-Proxy
sperrt `github.io`, und die Pages-Einstellung geben die GitHub-Werkzeuge
dieser Sitzung nicht her.

**Diese Frage beantwortet Klaus, nicht das Werkzeug.** Wo die Doku eine
Adresse nennt, steht die Zeile als Belegstelle darunter — zitiert, nicht
ausgewertet.

## Alis-Moderaum

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar
  > geteilten `github.io`-Adresse, damit sich Warenkörbe/Artikel nicht gegenseitig

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `sw.js:96` · Sorte A · Filter: `k !== CACHE_VERSION`
- ✗ `warehouse.html:3458` · Sorte B · Filter: `kein Filter`

## BookLedgerPro

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `src/ui/shell.js:388` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:224` · Sorte A · Filter: `k !== CACHE_NAME`

## Company-Brain

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar
  > Läuft unter einer **eigenen Adresse** (`company-brain.family-projekt.de`, siehe

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **0**

- ✗ `sw.js:28` · Sorte A · Filter: `k !== CACHE`

## Jasons-Tresor

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **2**

- ✗ `index.html:3093` · Sorte B · Filter: `kein Filter`
- ✗ `jasons-bibliothek/index.html:3093` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:71` · Sorte A · Filter: `k === CACHE ? … :`

## Kim-Bell

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `index.html:251` · Sorte B · Filter: `kein Filter`
- ✗ `sbkim-sw.js:70` · Sorte A · Filter: `k !== CACHE_VERSION`

## Kimboard

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1** · richtig gefiltert: 1

- ✓ `index.html:2897` · Sorte B · Filter: `startsWith("sbkim-pinnwand-")`
- ✗ `index.html:4386` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:114` · Sorte A · Filter: `k !== CACHE_VERSION`

## Kimhub

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar
  > `github.io`-Adresse läse ihn sonst jede Geschwister-App mit) · die **Form
  > stehen auf `lausiklauskn-png.github.io`. Ein Riegel, der diese Adresse

Sorte A (läuft von allein): **2** · Sorte B (⟳ / Knopf): **1**

- ✗ `ansicht.js:3981` · Sorte B · Filter: `kein Filter`
- ✗ `company-sw.js:44` · Sorte A · Filter: `k !== CACHE_VERSION`
- ✗ `sw.js:31` · Sorte A · Filter: `k !== CACHE_VERSION`

## Kimseek

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `modules/22_such_widget.js:4679` · Sorte B · Filter: `kein Filter`
- ✗ `sbkim-sw.js:75` · Sorte A · Filter: `k !== CACHE_VERSION`

## Kuechenzettel

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **0**

- ✗ `sw.js:29` · Sorte A · Filter: `k !== CACHE_VERSION`

## Mein-Mixarium

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **2**

- ✗ `QC_Mixarium_20_04_26.html:13157` · Sorte B · Filter: `kein Filter`
- ✗ `app-sw.js:95` · Sorte A · Filter: `k !== PRECACHE`
- ✗ `index.html:13157` · Sorte B · Filter: `kein Filter`

## Mein-Rezeptbuch

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **2**

- ✗ `QC_MeinRezb_24_04_26.html:14174` · Sorte B · Filter: `kein Filter`
- ✗ `app-sw.js:45` · Sorte A · Filter: `k !== CACHE`
- ✗ `index.html:14186` · Sorte B · Filter: `kein Filter`

## Mein-Rezeptbuch-Page

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar
  > Diese Seite ist **noch nicht** auf familyproject.de veröffentlicht – sie liegt als Entwurf/Beispiel

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **0**

- ✗ `sw.js:28` · Sorte A · Filter: `k !== CACHE`

## Mein-Tresor

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **2**

- ✗ `index.html:3411` · Sorte B · Filter: `kein Filter`
- ✗ `jasons-bibliothek/index.html:3411` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:71` · Sorte A · Filter: `k === CACHE ? … :`

## Mein-WorkFloh

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `index.html:2961` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:67` · Sorte A · Filter: `k !== CACHE`

## Mein-Workfloh-Page

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **0**

- ✗ `sw.js:61` · Sorte A · Filter: `k !== CACHE`

## Muttis-Rezeptbuch

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **2** · Sorte B (⟳ / Knopf): **2**

- ✗ `QC_MR_08_04_26.html:11046` · Sorte B · Filter: `kein Filter`
- ✗ `app-sw.js:38` · Sorte A · Filter: `k !== CACHE`
- ✗ `index.html:11058` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:32` · Sorte A · Filter: `name !== CACHE_NAME`

## New-Perfect-Skin-Beauty-

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **1**

- ✗ `script.js:504` · Sorte B · Filter: `kein Filter`

## PWA-Toolpoint

Ursprung: **eigen** (pwa-toolpoint.de) — CNAME auf origin/main

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `assets/thema.js:89` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:74` · Sorte A · Filter: `k !== CACHE_VERSION`

## Perfect-Skin-Beauty

Ursprung: **eigen** (perfectskinbeauty.de) — CNAME auf origin/main

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **1**

- ✗ `script.js:633` · Sorte B · Filter: `kein Filter`

## Privat-Brain

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **2** · richtig gefiltert: 1

- ✗ `index.html:2680` · Sorte B · Filter: `kein Filter`
- ✓ `modules/pinnwand-widget.js:739` · Sorte B · Filter: `startsWith("private-brain-")`
- ✗ `modules/pinnwand-widget.js:1574` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:50` · Sorte A · Filter: `k !== CACHE`

## SB-KIMTool-Point

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **2**

- ✗ `such-tool/modules/22_such_widget.js:4541` · Sorte B · Filter: `kein Filter`
- ✗ `such-tool/sbkim-sw.js:52` · Sorte A · Filter: `k !== CACHE_VERSION`
- ✗ `web/tools/sbkim-such-widget.js:4679` · Sorte B · Filter: `kein Filter`

## Sage-Protokol

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **2** · Sorte B (⟳ / Knopf): **8** · richtig gefiltert: 1

- ✗ `index.html:5247` · Sorte B · Filter: `kein Filter`
- ✗ `mycel-karte/index.html:320` · Sorte B · Filter: `kein Filter`
- ✓ `pinnwand/index.html:1687` · Sorte B · Filter: `startsWith("sbkim-pinnwand-")`
- ✗ `pinnwand/index.html:2239` · Sorte B · Filter: `kein Filter`
- ✗ `pinnwand/sw.js:75` · Sorte A · Filter: `k !== CACHE_VERSION`
- ✗ `sbkim-bundle-voll/modules/22_such_widget.js:4679` · Sorte B · Filter: `kein Filter`
- ✗ `sbkim-demo/aktualisieren.js:78` · Sorte B · Filter: `kein Filter`
- ✗ `src/modules/22_such_widget.js:4679` · Sorte B · Filter: `kein Filter`
- ✗ `such-tool/modules/22_such_widget.js:4679` · Sorte B · Filter: `kein Filter`
- ✗ `such-tool/sbkim-sw.js:52` · Sorte A · Filter: `k !== CACHE_VERSION`
- ✗ `tools/speicher.html:221` · Sorte B · Filter: `kein Filter`

## Tomys-Hub

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **0** · Sorte B (⟳ / Knopf): **1** · richtig gefiltert: 5

- ✓ `bookledger/sw.js:21` · Sorte A · Filter: `startsWith("yami-bookledger-")`
- ✗ `index.html:334` · Sorte B · Filter: `kein Filter`
- ✓ `promptgenerator/sw.js:25` · Sorte A · Filter: `startsWith("yami-promptgen-")`
- ✓ `showcase/sw.js:26` · Sorte A · Filter: `startsWith("yami-showcase-")`
- ✓ `sw.js:28` · Sorte A · Filter: `startsWith("yami-hub-")`
- ✓ `workfloh/sw.js:27` · Sorte A · Filter: `startsWith("yami-workfloh-")`

## family-project

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar
  > Vorschau (GitHub Pages):** `https://lausiklauskn-png.github.io/family-project/`

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `assets/app.js:622` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:80` · Sorte A · Filter: `k !== CACHE_VERSION`

## kim-hub-company

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **2** · Sorte B (⟳ / Knopf): **1**

- ✗ `ansicht.js:3981` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:51` · Sorte A · Filter: `k !== CACHE_VERSION`
- ✗ `werkzeuge/buendel-pruefer/sw.js:23` · Sorte A · Filter: `n === VORRAT ? … :`

## mycel-karte

Ursprung: **ungeprueft** — keine CNAME — die Auslieferung ist von hier aus nicht nachsehbar

Sorte A (läuft von allein): **1** · Sorte B (⟳ / Knopf): **1**

- ✗ `index.html:312` · Sorte B · Filter: `kein Filter`
- ✗ `sw.js:19` · Sorte A · Filter: `k !== CACHE_VERSION`

