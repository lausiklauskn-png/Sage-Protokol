# Übergabeprotokoll · 2026-05-15 · Pflege-Sitzung Karte 09 App-SW-Koexistenz

**Sitzungs-Rolle:** Pflege-Sitzung (eine Sitzung, ein klar abgegrenzter
Scope). Karte 09 Schritt 3 wird in 3a/3b aufgesplittet plus
Pre-Flight-Check; `src/sbkim-sw.js` bekommt einen
`SBKIM_SW_STANDALONE`-Schalter (Default `true`, rückwärtskompatibel);
Karte 09 § Risiken & offene Punkte bekommt das achte Risiko
„App-SW-Überschreibung"; INTERFACES.md §6 + PULS + Karte-09-Bauzustand-
Tabelle ziehen mit. **Keine §1-Vertragsänderung**, **keine Code-Änderung
an Modulen 00/01/02/03/04/05/07**, **keine Score-Änderung in
`status.json`**.
**Branch:** `claude/pflege-09-app-sw-koexistenz-SMR78`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §B und
an die Pflege-Sitzungen vom 2026-05-15 (insbesondere Schritt-9-Doku-
TTL als direktes Vorbild — Karte-09-Pflege ohne Modul-Eingriff, plus
hier zusätzlich ein gezielter SW-Lebenszyklus-Eingriff).
**Modul:** 09_einbau_pwa (Anleitung, kein JS-Modul) plus
`src/sbkim-sw.js` (Service-Worker, Lebenszyklus-Pflege).

---

## Auftrag

Eine Phase, klarer Scope, kein Modul-Bau, aber gezielter SW-Eingriff:

1. **Karte 09 § Andock-Schritt-Pfad Schritt 3** aufsplitten in
   **Pre-Flight-Check** (Einleitungs-Block) + **Variante 3a** (PWA
   ohne eigenen SW, bisheriges Verhalten unverändert) + **Variante
   3b** (PWA mit eigenem App-SW: `importScripts('./sbkim-sw.js')`
   im bestehenden App-SW).
2. **`src/sbkim-sw.js`** umbauen: `skipWaiting` / `clients.claim`
   von **unbedingt** auf **optional** via `SBKIM_SW_STANDALONE`-
   Flag (Default `true` → rückwärtskompatibel, `false` für Variante
   3b). fetch-Listener-Pfad **unverändert**.
3. **Karte 09 § Service-Worker-Hinweis** `install`/`activate`-
   Vertragsblock anpassen (beide Modi explizit, fetch-Listener-
   Reihenfolge dokumentieren).
4. **Karte 09 § Risiken & offene Punkte** um achtes Risiko
   **„App-SW-Überschreibung"** erweitern (Stil analog Service-
   Worker-Scope-Falle).
5. **Karte 09 § Datei-Pfad-Konvention** um optionalen `app-sw.js`-
   Block (Variante 3b) ergänzen.
6. **Karte 09 § Sichtkontrolle** um fünften (variantenspezifischen)
   Pflicht-Punkt erweitern (Variante-3b-Zwei-Browser-Test).
7. **Karte 09 § Bauzustand** „Pflege App-SW-Koexistenz"-Zeile am
   Ende der Pflege-Zeilen (vor TBD-Einbau-Zeilen).
8. **INTERFACES.md §6** Änderungsprotokoll-Zeile am unteren Ende
   (Konventions-Stil, neueste unten). **Keine §1-Vertragsänderung.**
9. **PULS** Sitzungs-Eintrag oben, Schnellüberblicks-Zeile Modul
   09 Anmerkungs-Spalte erweitern. **`update_puls_pie.py` NICHT
   aufrufen** (keine Score-Änderung).
10. **`node --check src/sbkim-sw.js`** grün.
11. **Übergabeprotokoll** (diese Datei).
12. **Commit + Push** + Draft-PR.

---

## Was getan wurde

### 1. Hintergrund — das stillste Andock-Risiko

Die vorherige Karte-09-Schritt-3-Logik unconditional `register
('sbkim-sw.js')` plus `sbkim-sw.js`-`install`/`activate`-Handler mit
unbedingtem `self.skipWaiting()` und `self.clients.claim()` hat einen
**stillen Blocker** für Endknoten mit eigenem App-SW erzeugt:

- Typische Endknoten-PWA: `navigator.serviceWorker.register('./app-sw.js')`
  mit Default-Scope `/<repo>/` (App-Offline-Cache, ggf. Push-Pfade).
- Karte-09-Schritt-3: `navigator.serviceWorker.register('sbkim-sw.js')`
  — **gleicher Scope** `/<repo>/`.
- Konsequenz: zweite Registrierung im selben Scope **ersetzt** die
  erste; `sbkim-sw.js` übernimmt sofort dank `skipWaiting` +
  `clients.claim`. App-SW ist weg. App-Offline-Pfade tot. Push-
  Pfade tot. **Stillschweigend**: keine Fehlermeldung in der
  Konsole, der Andock-Pfad meldet im Gegenteil `SBKIM-SW
  registriert, Scope: …` als grünen Punkt.

Klaus' Endknoten (Rezeptbuch + Mixarium) haben sehr wahrscheinlich
beide einen App-SW. Das war der Hintergrund der Frage, die diese
Pflege-Sitzung schließt.

### 2. Karte 09 Schritt 3 aufgesplittet

**Neuer Einleitungs-Block „Pre-Flight-Check — App-SW erkennen"**:

```js
const existing = await navigator.serviceWorker.getRegistration("./");
if (existing && existing.active) {
  // App-SW erkannt → Variante 3b
} else {
  // kein App-SW → Variante 3a (bisheriges Verhalten)
}
```

Vor jedem Andock-Versuch genau einmal — liefert **ein** klares
Verzweigungs-Ergebnis. Karte sagt: welcher Fall welche Variante
triggert; Andocker entscheidet einmal beim Einbau (nicht zur Laufzeit
jeder PWA-Sitzung).

**Variante 3a — PWA ohne eigenen SW** (Schritt 3a):

Bisheriges Verhalten unverändert. Code-Block wie vor der Pflege:
`navigator.serviceWorker.register("sbkim-sw.js")` mit Konsolen-Zeile
`SBKIM-SW registriert, Scope: …`. `sbkim-sw.js` läuft alleinstehend,
`SBKIM_SW_STANDALONE = true` (Default), `skipWaiting` +
`clients.claim` greifen → offene Tabs kommen sofort unter SW-
Kontrolle. Sichtprüfung im DevTools: Source = `sbkim-sw.js`.

**Variante 3b — PWA mit eigenem App-SW** (Schritt 3b):

Zwei Zeilen ganz oben in `app-sw.js`, **vor** dem bestehenden Code:

```js
self.SBKIM_SW_STANDALONE = false;
importScripts('./sbkim-sw.js');
```

Im Endknoten-`index.html` reicht der bestehende
`register('./app-sw.js')`-Aufruf — **kein** zusätzlicher SBKIM-
Register-Aufruf. Konsolen-Zeile `SBKIM-SW geladen via importScripts
(Variante 3b)` (vom Andocker in `app-sw.js` direkt nach
`importScripts` gesetzt). Sichtprüfung im DevTools: **eine**
Registrierung mit Source = `app-sw.js` (nicht zwei, nicht
`sbkim-sw.js` als Source — das wäre die App-SW-Überschreibung).

**Häufige-Fehler-Diagnosen** im Variante-3b-Block ergänzt:

- App-SW erkannt aber Variante 3a benutzt → Verweis auf achtes
  Risiko.
- `importScripts` wirft `NetworkError` → Pfad-Auflösung; beide
  SW-Dateien im Repo-Root.
- App-SW hat `event.respondWith` ohne Pass-Through → Verweis auf
  fetch-Listener-Reihenfolge im § Service-Worker-Hinweis.

### 3. `src/sbkim-sw.js` umgebaut

**Neuer Modul-Anfangs-Schalter:**

```js
const SBKIM_SW_STANDALONE = (typeof self.SBKIM_SW_STANDALONE !== "undefined")
  ? self.SBKIM_SW_STANDALONE
  : true; // Default: Variante 3a
```

`install`- und `activate`-Handler:

```js
self.addEventListener("install", (event) => {
  if (SBKIM_SW_STANDALONE) {
    event.waitUntil(self.skipWaiting());
  }
});

self.addEventListener("activate", (event) => {
  if (SBKIM_SW_STANDALONE) {
    event.waitUntil(self.clients.claim());
  }
});
```

Default `true` garantiert: Variante 3a verhält sich **genau wie
bisher** (rückwärtskompatibel). Variante 3b setzt vor
`importScripts('./sbkim-sw.js')` das Flag auf `false`, sbkim-sw.js
übernimmt dann nicht — der App-SW behält seinen Lebenszyklus.

**fetch-Listener-Pfad unverändert.** `/sbkim/anastomosis` und
`/sbkim/legacy` werden weiter wie bisher abgefangen. Kommentar im
fetch-Handler erweitert um die fetch-Konvention: `event.respondWith()`
ausschließlich für SBKIM-Pfade — alle anderen Events fallen durch
(Variante 3b: an den App-SW-Listener; Variante 3a: an den Default-
Network-Pfad).

**Header-Kommentar erweitert** um die zwei Lade-Pfade (3a `register`,
3b `importScripts`), inklusive Code-Beispiel für jede Variante.

**`node --check src/sbkim-sw.js`** grün.

### 4. Karte 09 § Risiken & offene Punkte — achtes Risiko

**App-SW-Überschreibung** als achtes Risiko ergänzt, direkt nach
Service-Worker-Scope-Falle (Stil analog dem Vorbild):

- **Beschreibung:** Schritt-3-`register` ersetzt bestehenden App-SW
  im selben Scope wegen unbedingtem `skipWaiting`/`clients.claim`
  in `sbkim-sw.js`. Folge: App-Cache, Offline-Funktion, Push-Pfade
  verschwinden stillschweigend.
- **Erkennung:** DevTools → Application → Service Workers zeigt
  `sbkim-sw.js` statt `app-sw.js` als aktiven Worker; Konsolen-Zeile
  `SBKIM-SW registriert, Scope: …` erscheint, App-SW-Selbstcheck-
  Zeile fehlt.
- **Lösung:** Variante 3b (`importScripts('./sbkim-sw.js')` im
  bestehenden App-SW) plus `self.SBKIM_SW_STANDALONE = false`
  davor. `sbkim-sw.js` ist seit Pflege App-SW-Koexistenz so
  geschrieben, dass `skipWaiting` / `clients.claim` nur unter
  `SBKIM_SW_STANDALONE === true` greifen.
- **Konvention:** vor Schritt 3 **immer** Pre-Flight-Check; bei
  vorhandenem aktiven App-SW **immer** Variante 3b. Variante 3a
  nur wenn Pre-Flight-Check `null` liefert.

### 5. Karte 09 § Service-Worker-Hinweis — Lebenszyklus + fetch-Reihenfolge

**Lebenszyklus-Block** zeigt jetzt **beide** Modi explizit:

- Default `SBKIM_SW_STANDALONE = true` (Variante 3a): `install` ruft
  `self.skipWaiting()`, `activate` ruft `self.clients.claim()`.
- `SBKIM_SW_STANDALONE = false` (Variante 3b): `install` und
  `activate` rufen weder `skipWaiting` noch `clients.claim` — der
  bestehende App-SW behält die volle Lebenszyklus-Steuerung.

**fetch-Block** zeigt jetzt explizit: nur `/sbkim/anastomosis` und
`/sbkim/legacy` werden abgefangen, alle anderen Anfragen gehen an
den App-SW-Listener weiter (Variante 3b) bzw. an den Default-
Network-Pfad (Variante 3a). Der SBKIM-SW ist **kein Cache-Layer**.

**Neuer Block „fetch-Listener-Reihenfolge"** dokumentiert:

- `importScripts` lädt den `fetch`-Listener aus `sbkim-sw.js` **vor**
  den App-SW-`fetch`-Listenern, sofern `importScripts` in `app-sw.js`
  ganz oben steht (vor App-SW-`addEventListener('fetch', …)`-Zeilen).
- Browser ruft `fetch`-Listener **in Registrier-Reihenfolge** auf;
  erster Listener, der `event.respondWith()` aufruft, gewinnt.
- `sbkim-sw.js` ruft `event.respondWith()` **ausschließlich** für die
  SBKIM-Pfade — alle anderen Events fallen durch.

### 6. Karte 09 § Datei-Pfad-Konvention

Im Repo-Layout-Block:

```
<endknoten-repo>/
├── index.html
├── sbkim-sw.js
├── app-sw.js                 ← OPTIONAL: bestehender App-SW (Variante 3b)
└── sbkim/
    └── spore.json
```

Hinweis-Absatz: Variante 3b braucht beide SW-Dateien im Repo-Root
nebeneinander, damit `importScripts('./sbkim-sw.js')` aus dem
App-SW heraus ein relativer Geschwister-Pfad ist. Bei
`/<repo>/js/app-sw.js` wäre `importScripts('../sbkim-sw.js')`
korrekt, aber sauberer ist Repo-Root für beide.

### 7. Karte 09 § Sichtkontrolle — fünfter Pflicht-Punkt

**Nur Variante 3b** — Zwei-Browser-Test der App-SW-Koexistenz:

- Konsolen-Zeile `SBKIM-SW geladen via importScripts (Variante 3b)`
  (vom Andocker in `app-sw.js` direkt nach `importScripts` gesetzt),
  **nicht** `SBKIM-SW registriert, Scope: …`.
- DevTools → Application → Service Workers zeigt **genau eine**
  Registrierung mit Source = `app-sw.js`, Status "activated and is
  running", Scope = `/<repo>/`.
- `POST /sbkim/anastomosis` aus zweitem Tab liefert 200.
- App-Offline-Pfade des App-SW unverändert (Cache-First-Routing
  bedient weiter beim Reload-im-Flugmodus).

Wartet auf Klaus' nächsten Live-Andock-Versuch (Bau-Sitzung 09
zweite Iteration).

### 8. Karte 09 § Bauzustand-Tabelle

Neue Zeile **am Ende der Pflege-Zeilen** (chronologisch nach
„Pflege Schritt 9 + 07/00", vor den TBD-Einbau-Zeilen):

- Datum: 2026-05-15
- Sitzung: Pflege 09-App-SW-Koexistenz
- Anmerkung: ausführliche Sechs-Punkte-Zusammenfassung mit
  Schritt 3 a/b · Pre-Flight-Check · achtes Risiko · `sbkim-sw.js`
  `SBKIM_SW_STANDALONE`-Flag · `importScripts`-Lösungs-Anker für
  PWAs mit eigenem App-SW · `status.json` unverändert.

### 9. INTERFACES.md §6 Änderungsprotokoll

Eine neue Zeile am unteren Ende (Konventions-Stil, neueste unten,
direkt nach Pflege-Sitzung 07-Test6-bestaetigt): „Pflege-Sitzung
09-App-SW-Koexistenz · `sbkim-sw.js` `SBKIM_SW_STANDALONE`-Flag
(Default `true`, optional `false` für Variante 3b · additiv,
rückwärtskompatibel) · keine §1-Vertragsänderung". Inhaltlich:
zusammenfassende Beschreibung aller Karte-09-Änderungen plus dem
SW-Code-Eingriff plus dem Hinweis, dass `status.json` Modul 09
unverändert bleibt.

**§1 Modul 09 unverändert.** Modul 09 ist Anleitung-Vertrag — die
Pflege ist additiv im Andock-Pfad, keine öffentliche Funktion
wandert, kein neuer Vertrag.

### 10. PULS.md

**Schnellüberblicks-Zeile Modul 09** Anmerkungs-Spalte erweitert:
„… plus Pflege App-SW-Koexistenz (2026-05-15): Schritt 3
a/b-Verzweigung (Pre-Flight-Check → 3a / 3b), achtes Risiko
‚App-SW-Überschreibung', `sbkim-sw.js` `SBKIM_SW_STANDALONE`-Flag
rückwärtskompatibel". Spec-Spalte ergänzt um „Pflege App-SW-
Koexistenz 2026-05-15".

**Neuer Sitzungs-Eintrag oben** (`## Sitzungs-Einträge` direkt
nach der Überschrift, vor Pflege Schritt 9): „2026-05-15 ·
Pflege-Sitzung · Karte 09 App-SW-Koexistenz" mit Getan / Was nicht
geändert / Frischer-Kopf-Befund / Was offen blieb / Nächster
sinnvoller Schritt.

**Modulstand-Pie unverändert.** `status.json` nicht angefasst,
`update_puls_pie.py` **nicht** aufgerufen (keine Score-Änderung —
die Pflege ist additiv im Andock-Pfad, kein Modul-Bau).

### 11. Sichttest

**Headless:** `node --check src/sbkim-sw.js` grün — der `if
(SBKIM_SW_STANDALONE) …`-Guard in beiden Lebenszyklus-Handlern
parst sauber, der `(typeof self.SBKIM_SW_STANDALONE !==
"undefined") ? … : true`-Ausdruck am Modul-Anfang ebenfalls.

**Browser-Sichttest** der Variante 3b wartet auf Klaus' nächsten
Live-Andock-Versuch (Bau-Sitzung 09 zweite Iteration). Sichtkontroll-
Block § Sichtkontrolle Punkt 5 (variantenspezifisch) hält die
Pflicht-Punkte schon fest:

- Konsolen-Zeile `SBKIM-SW geladen via importScripts (Variante 3b)`.
- DevTools → Application → Service Workers: eine Registrierung,
  Source = `app-sw.js`.
- `POST /sbkim/anastomosis` liefert 200 (App-SW lässt durch,
  sbkim-sw.js antwortet).
- App-Offline-Pfade des App-SW unverändert.

---

## Was nicht geändert wurde (bewusst)

- **Keine Code-Änderung an Modulen 00/01/02/03/04/05/07.** Diese
  Pflege betrifft ausschließlich den Service-Worker-Lebenszyklus
  (`src/sbkim-sw.js`) und Karte 09. Modul-APIs bleiben unangetastet.
- **Kein neuer Scope.** Variante 3b ist `importScripts` im
  **bestehenden** App-SW — kein zweiter `register`-Aufruf, kein
  zweiter SW. Die Service-Worker-Scope-Falle (siebtes Risiko)
  bleibt verbindlich.
- **Kein Vertrags-Verlust für Variante 3a.** Default
  `SBKIM_SW_STANDALONE = true` ist äquivalent zum bisherigen
  Verhalten — eine bestehende Endknoten-PWA, die `sbkim-sw.js`
  schon einsetzt, ändert nichts und braucht keine Migration.
- **`status.json` Modul 09 unverändert.** Bleibt `score:"spec"` /
  `siegel:"Spec fertig"`; Pie nicht regeneriert.
  `update_puls_pie.py` **nicht** aufgerufen.
- **Keine INTERFACES.md §1-Vertragsänderung.** Das Flag ist
  SW-intern, kein neuer öffentlicher Funktions-Export. Nur §6
  Änderungsprotokoll-Zeile ergänzt.
- **Kein `self.skipWaiting()` / `self.clients.claim()` entfernt** —
  sie bleiben im Code, nur jetzt unter `SBKIM_SW_STANDALONE`-
  Schalter. Default-Verhalten unverändert.
- **Kein fetch-Listener-Pfad geändert.** Modul 07's
  `/sbkim/legacy`-Brücke und Modul 05's `/sbkim/anastomosis`-Brücke
  bleiben Wort-für-Wort wie sie sind.
- **Sage-Page (`index.html`) nicht angefasst.** Diese Pflege
  betrifft Endknoten-Andock-Pfad, nicht das Observatorium.
- **Parallel offene Pflege-Sitzung Sage-Page Modul 14 nicht
  angefasst.** Eigener Branch, eigener Scope.

---

## Frischer-Kopf-Befund: stillstes Andock-Risiko geschlossen, additiv

Diese Pflege schließt das **stillste** Andock-Risiko im Karte-09-Pfad:
bestehender App-SW + Karte-09-Schritt-3 = schweigende Überschreibung
des App-SW. Klaus hat sehr wahrscheinlich in beiden Endknoten
(Rezeptbuch + Mixarium) einen App-SW (Offline-Cache, Add-to-Home-
Screen-PWA-Konventionen) — der bisherige Schritt 3 hätte ihn beim
ersten Andock-Versuch ohne Vorwarnung kassiert.

Die Lösung ist **additiv und rückwärtskompatibel**:

- Default `SBKIM_SW_STANDALONE = true` = exakt das bisherige
  Verhalten. Variante-3a-Andocker müssen nichts ändern.
- Variante 3b = zwei-Zeilen-Ergänzung in `app-sw.js`
  (`SBKIM_SW_STANDALONE = false` + `importScripts`). Kein zweites
  `register`, kein zweiter Scope, keine Migration.
- INTERFACES.md §1 unverändert. Kein neuer öffentlicher Funktions-
  Export wandert. Das Flag ist SW-intern.

Der Pflege-Stil (Pflege Schritt 9 vom 2026-05-15 als Vorbild) ist
weitgehend eingehalten: Karte 09 ist Anleitung, `status.json` bleibt
`score:"spec"`, Pie nicht regeneriert, INTERFACES.md §1 unverändert.
Der **einzige Unterschied**: Pflege Schritt 9 war reine Anleitungs-
Erweiterung, diese hier ergänzt auch einen **SW-Code-Eingriff**
(`src/sbkim-sw.js`). Das ist der Auftrag — „Pflege, kein Modul-Bau,
aber gezielter Eingriff in `sbkim-sw.js`, weil der bestehende Andock-
Pfad einen bisher unsichtbaren Blocker hat".

---

## Was offen blieb

- **Klaus' Live-Andock-Versuch (Bau-Sitzung 09 zweite Iteration)**
  bleibt der nächste produktive Schritt. Variante-3b-Sichtkontrolle
  (fünfter Pflicht-Punkt) wartet auf den realen Browser-Test.
  Headless: `node --check` grün, syntaktisch trägt der
  `SBKIM_SW_STANDALONE`-Schalter; ob Klaus' App-SW + `importScripts`-
  Pfad-Auflösung auf GitHub-Pages-Project-Sites genau wie erwartet
  aufgehen, kann erst der Live-Versuch zeigen.

- **`SBKIM_SW_STANDALONE`-Default `true` oder `false`** als
  Konventions-Frage. Default `true` wurde gewählt, weil:
  1. **Rückwärtskompatibilität.** Eine bestehende Live-PWA mit
     `sbkim-sw.js` aus Variante 3a (sofern es schon eine gibt —
     aktuell nicht) ändert nichts.
  2. **Wenig-Schritte-Prinzip für Variante 3a.** Wer keinen App-SW
     hat, soll ohne Flag-Konfiguration loslegen können.
  3. **Variante 3b ist explizit aktiviert.** Andocker muss
     `SBKIM_SW_STANDALONE = false` setzen — bewusster Schritt statt
     Default-Magie.
  Falls Klaus' Live-Andock-Versuch zeigt, dass `false` der bessere
  Default ist (z.B. weil beide Endknoten App-SWs haben und niemand
  sonst Variante 3a nutzt), kann eine Folge-Mini-Pflege „App-SW-
  Koexistenz Default-Umkehr" das in zwei Zeilen erledigen.

- **Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-
  Andock-Versuch** bleibt empfohlener Haupt-Pfad. Karte 09 ist
  jetzt vollständig: neun Schritte (Pflege Schritt 9) + Schritt-3-
  Verzweigung mit Pre-Flight-Check (diese Pflege). Klaus' nächste
  Sitzung kann die ganze Anleitung mit App-SW-Erkennung durchgehen.

- **Folge-Pflege „App-SW-Koexistenz Sicht-Validierung"** kann
  laufen, falls die Live-Sicht (5. Pflicht-Punkt) ergibt, dass z.B.
  die Konsolen-Zeile in `app-sw.js` anders heißen soll oder DevTools
  tatsächlich zwei Worker zeigt trotz `importScripts`.

- **PULS-400-Zeilen-Konvention.** PULS.md ist mittlerweile > 2800
  Zeilen — eine Aufräum-Pflege-Sitzung „PULS archivieren" wäre
  fällig, sobald sich ein angemessener Schnitt findet (typisch:
  alle Sitzungs-Einträge vor einem Tag in einen Monatsarchiv-Block
  ziehen, oberster Eintrag behalten). Diese Aufräumarbeit gehört
  nicht in diese Sitzung — Pflege Schritt 9 hat sie ebenfalls
  liegen lassen.

---

## Nächster sinnvoller Schritt

1. **Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-
   Andock-Versuch** zwischen Rezeptbuch und Mixarium. Erstmals
   beide Andock-Varianten im Browser durchspielen; insbesondere
   Variante 3b mit Pre-Flight-Check und `importScripts`-Konvention.
2. Optional: **Folge-Pflege „App-SW-Koexistenz Sicht-Validierung"**,
   falls der Live-Versuch eine offene Frage aufwirft.
3. Headless-Alternativen (in fallender Priorität):
   - **Hauptsitzung Modul 14 Diffusion-Stub** (entblockt die
     parallel offene Pflege-Sitzung Sage-Page-Modul-14, eigener
     Branch).
   - **Spec-Sitzung Modul 06 Heterokaryose** (06 ist Schablone
     und Lead-Pool-Konsument).

---

## Checkliste (Pflicht am Sitzungs-Ende)

- [x] **Karte 09 § Andock-Schritt-Pfad Schritt 3** aufgesplittet:
      Pre-Flight-Check + Variante 3a + Variante 3b mit Sichtkontrollen
      und drei Häufige-Fehler-Diagnosen
- [x] **`src/sbkim-sw.js` umgebaut**: `SBKIM_SW_STANDALONE`-Flag
      am Modul-Anfang (Default `true`), `install`/`activate` unter
      Schalter, fetch-Pfad unverändert, Header-Kommentar erweitert,
      fetch-Konvention im Listener-Kommentar dokumentiert
- [x] **`node --check src/sbkim-sw.js`** grün
- [x] **Karte 09 § Service-Worker-Hinweis** Lebenszyklus-Block
      auf zwei Modi erweitert + fetch-Listener-Reihenfolge-Block
      ergänzt + Pfad-Konvention um Variante-3b-Hinweis
- [x] **Karte 09 § Risiken & offene Punkte** achtes Risiko
      **„App-SW-Überschreibung"** im Stil analog Service-Worker-
      Scope-Falle ergänzt
- [x] **Karte 09 § Datei-Pfad-Konvention** um optionalen
      `app-sw.js`-Block (Variante 3b) ergänzt mit Pfad-Hinweis
- [x] **Karte 09 § Sichtkontrolle nach dem Andocken** fünften
      (variantenspezifischen) Pflicht-Punkt für Variante 3b
      ergänzt
- [x] **Karte 09 § Bauzustand-Tabelle** „Pflege App-SW-
      Koexistenz"-Zeile chronologisch nach „Pflege Schritt 9 +
      07/00", vor TBD-Einbau-Zeilen
- [x] **INTERFACES.md §6** Änderungsprotokoll-Zeile am unteren
      Ende ergänzt (neueste unten, Konventions-Stil)
- [x] **§1 unverändert** — kein neuer öffentlicher Funktions-
      Export wandert
- [x] **Keine Code-Änderung an Modulen 00/01/02/03/04/05/07**
- [x] **`status.json` Modul 09 unverändert** (`score:"spec"` /
      `siegel:"Spec fertig"`); `update_puls_pie.py` NICHT
      aufgerufen
- [x] **Test-Datei nicht geändert**
- [x] **PULS Sitzungs-Eintrag oben** mit Was getan / Was nicht
      geändert / Frischer-Kopf-Befund / Was offen blieb /
      Nächster Schritt
- [x] **PULS-Schnellüberblicks-Zeile Modul 09** auf „Spec fertig
      (2026-05-14, Pflege Schritt 9 + 07/00 2026-05-15, Pflege
      App-SW-Koexistenz 2026-05-15)" gehoben
- [x] **Übergabeprotokoll** (diese Datei)
- [ ] **Commit + Push** auf `claude/pflege-09-app-sw-koexistenz-
      SMR78` (folgt)
- [ ] **Draft-PR gegen `main`** (folgt)
