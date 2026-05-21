# Modul 09 — Einbau in bestehende PWA

> **Status:** 🟨 Spec fertig  ·  **Schicht:** Anleitung (kein JS-Modul)  ·  **Anker:** Sage-Page → Karte 4, Eintrag 09 · Karte 10 (Andocken)
> **Datei:** diese Karte *ist* die Anleitung — kein JS unter `src/`
>
> _Wie aus dem Sage-Protokol-Hub (Spec + Code-Stubs) ein produktiv
> andockendes Rezeptbuch oder Mixarium wird. Module kopieren, Spore mit
> `domainVector` erzeugen, Service-Worker registrieren, ersten
> Handshake auslösen._

---

## Im Mycel-Bild

Andocken ist die **Initiations-Phase** im Pilz-Modell: ein neuer Pilz
schiebt seine erste Hyphen ins Substrat. Vier Dinge passieren in dieser
einen Bewegung — alle vier müssen gelingen, sonst ist der Pilz nicht da:

1. **Singleton-Identität** anlegen (Modul 02 erzeugt ein Ed25519-
   Schlüsselpaar in der Browser-IndexedDB; die `nodeId` ist deterministisch
   aus dem Public Key abgeleitet).
2. **Domänen-Vektor erzeugen** (Modul 03 läuft einmalig, `embedPassage`
   über die Domänen-Stichwörter ergibt 384 Floats, L2-normalisiert).
3. **Spore publizieren** (Modul 02 baut die signierte Visitenkarte, der
   Andocker kopiert sie nach `<endknoten>/sbkim/spore.json` und deployt).
4. **Empfangsmund öffnen** (Modul 05 + `sbkim-sw.js` registriert: der
   Service-Worker fängt POSTs auf `/sbkim/anastomosis` ab, reicht sie an
   die Page, die Page antwortet signiert).

Erst wenn alle vier stehen, ist der Endknoten **andockbar**. Wer
einen Schritt überspringt, hat einen Pilz ohne Mund, ohne Visitenkarte
oder ohne Identität — und das Mycel zieht vorbei.

**Wichtig:** die Singleton-Identität ist an den **Origin** gebunden.
Eine PWA unter `https://klaus.github.io/rezeptbuch/` und eine unter
`https://klaus.github.io/mixarium/` sind aus Sicht des Browsers zwei
verschiedene Origins mit zwei verschiedenen IndexedDBs — sie erhalten
zwei verschiedene `nodeId`-Werte, zwei verschiedene Spores, zwei
verschiedene Schlüsselpaare. Das ist Spec-Wille, kein Bug.

---

## Visualisierung

```mermaid
flowchart TB
  A1[1 · Dateien kopieren<br/>7 Module + SW]
  A2[2 · script-Tags<br/>in index.html<br/>01→02→03→04→05→07→00]
  A3[3 · SW registrieren<br/>navigator.serviceWorker<br/>.register]
  A4[4 · init aufrufen<br/>SbkimAnastomose.init]
  A5[5 · domainVector erzeugen<br/>embedPassage<br/>über Stichwörter]
  A6[6 · Spore erzeugen<br/>generateOwnSpore<br/>mit domainVector]
  A7[7 · Spore deployen<br/>sbkim/spore.json<br/>commit + push]
  A8[8 · Ersten Handshake<br/>handshake peer, vec]
  A9[9 · Apoptose+Doku<br/>SbkimApoptose.init<br/>+SbkimDoku.init<br/>+TTL-Sweep]

  A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7 --> A8 --> A9

  classDef step fill:#CA8A04,color:#fff,stroke:#fff,stroke-width:1px
  class A1,A2,A3,A4,A5,A6,A7,A8,A9 step
```

Die neun Schritte sind **linear** und einmalig pro Endknoten. Schritte
1–4 sind Einbau (Code), Schritte 5–7 sind Identitäts- und Spore-Aufbau
(Daten), Schritt 8 ist der erste Live-Test gegen ein Geschwister,
**Schritt 9 schaltet Vermächtnis-Empfang (Apoptose) und das versteckte
5-Klick-Doku-Fenster scharf** (Pflege-Sitzung 2026-05-15, jetzt
verbindlich im Andock-Pfad).

---

## Zweck

Diese Karte beschreibt, wie ein in Sage-Protokol entwickeltes Modul
oder die Gesamtschicht in eine bestehende PWA eingebaut wird. Adressaten
sind die Endknoten-Apps des Betreibers:

- **Rezeptbuch** (Domäne: Kochrezepte)
- **Mixarium** (Domäne: Cocktails / Drinks)

Anders gesagt: hier steht, wie aus dem Sage-Protokol-Hub (Spec +
Code-Stubs) eine produktiv andockende Endknoten-PWA wird. Die Anleitung
orientiert sich an `sbkim_integration.md`, ist aber auf den Reife- und
Bauzustand dieses Repos abgestimmt — die Code-Module 01/02/03/04/05
sind als Stubs verfügbar, der Service-Worker liegt als `src/sbkim-sw.js`
bereit, die Anastomose ist als Variante A · Page-Hosted gebaut.

**Was diese Karte nicht macht:** den Bau der Module selbst beschreiben
— das steht in den jeweiligen Karten 01–05. Karte 09 ist die
*Bündel-Anleitung* für den Andocker, nicht die Modul-Doku.

---

## Verantwortlichkeiten

**Macht:**
- Module 01/02/03/04/05/07/00 als `<script>`-Tags in den Endknoten
  einbauen (Reihenfolge verbindlich; Modul 00 zuletzt, weil es die
  anderen fail-soft als optionale Lese-Quellen prüft).
- Service-Worker `sbkim-sw.js` im Endknoten-Root deployen und mit
  korrektem Scope registrieren.
- Domänen-Stichwörter sammeln, `domainVector` einmalig mit
  `SbkimEmbedding.embedPassage` erzeugen.
- Spore mit `domainVector` über `SbkimSpore.generateOwnSpore` bauen und
  unter `sbkim/spore.json` statisch deployen.
- Ersten Handshake gegen ein bekanntes Geschwister auslösen und das
  Ergebnis sichtprüfen.
- Bei Domain- oder Domänenwechsel: Spore neu generieren und neu
  deployen (Identität bleibt, nur Meta-Felder ändern sich).

**Macht nicht:**
- **Keine Modul-Änderungen.** Karte 09 baut nur ein, modifiziert nicht.
  Wer einen Bug in Modul 01–05 findet, hebt eine Bau-Sitzung im
  Sage-Protokol-Repo, nicht im Endknoten-Repo.
- **Kein Singleton-Bruch.** Eine PWA = eine Identität. Wer eine zweite
  Identität braucht, legt eine zweite PWA an (anderer Origin).
- **Keine Eigenanfragen ins offene Netz.** Der erste Handshake (Schritt
  8) wird vom Andocker **explizit** mit einer bekannten Peer-URL
  ausgelöst — kein Crawler, keine Discovery, keine Pulsation.
- **Kein Auto-Update der Spore.** Wenn die Domäne sich ändert, deployt
  der Andocker eine neue Spore manuell — kein automatisches
  Re-Publishing.
- **Keine Test-Knöpfe in der Produktiv-App.** `tests/manual_check.html`
  bleibt im Sage-Protokol-Repo.
- **Keine `info`-Logs für Match-Treffer.** Nur Fehler. Selbstcheck-
  Zeilen beim Modul-Laden sind okay (passieren einmalig).
- **Kein Auto-Reveal der Doku.** Die 5-Klick-Geste aus Modul 00 ist
  Pflicht (sobald Modul 00 spezifiziert ist).

---

## Vor dem Einbau zu klärende Werte (pro Endknoten)

| Wert | Rezeptbuch | Mixarium |
|---|---|---|
| `<DOMAIN>` (Spore-Feld `domain`) | (TBD — z.B. `rezeptbuch.example.org`) | (TBD — z.B. `mixarium.example.org`) |
| `<ENDPOINT>` (Spore-Feld `endpoint`, **mit trailing slash**) | (TBD — z.B. `https://klaus.github.io/rezeptbuch/`) | (TBD — z.B. `https://klaus.github.io/mixarium/`) |
| `<KNOTENNAME>` (optional, Spore-Feld `nodeName`) | `Rezeptbuch Klaus` | `Mixarium Klaus` |
| `<KNOTENTYP>` (Spore-Feld `nodeType`) | `hybrid` | `hybrid` |
| `<DOMÄNEN-BESCHREIBUNG>` (Spore-Feld `domainDescription`, 1–3 Sätze) | (TBD) | (TBD) |
| `<DOMÄNEN-STICHWORTE>` (Spore-Feld `domainKeywords`, 5–15 Begriffe) | (TBD — z.B. `["Backen", "Saucen", "Hauptgang", "Hefeteig", "Kuchen", …]`) | (TBD — z.B. `["Gin", "Whisky", "Shaker", "Sour", "Tonic", …]`) |
| `<INDEX-DATEI>` | `index.html` | `index.html` |
| `<REPO-NAME>` (Project-Site-Pfad) | `rezeptbuch` | `mixarium` |
| `<DB_SUFFIX>` (PWA-Suffix für `SbkimStorage.init`, Pattern `^[a-z0-9_-]+$`) | `rezeptbuch` | `mixarium` |
| `<PEER-SPORE-URL>` (Geschwister beim ersten Handshake) | URL der Mixarium-Spore | URL der Rezeptbuch-Spore |

Die Werte sammelt der Betreiber **vor** Schritt 5 (Spore-Erzeugung).
Ohne sie schlägt `generateOwnSpore` mit `InvalidSporeMetaError` fehl.

**`<DB_SUFFIX>` (Pflege PWA-Suffix 2026-05-16):** GitHub-Pages-Project-
Sites teilen denselben **Origin** (`https://<benutzer>.github.io/`) —
IndexedDB ist im Browser pro Origin, nicht pro Pfad. Ohne PWA-Suffix
teilen sich `Mein-Mixarium` und `Mein-Rezeptbuch` unter
`lausiklauskn-png.github.io` dieselbe `sbkim`-Datenbank und damit
dieselbe `nodeId` — Cross-Knoten-Handshake ist dann technisch unmöglich
(beobachtet 2026-05-16 nach erstem Live-Andock, siehe Karte 01 §
DB-Namen-Konvention und PULS § Empfehlung Hauptsitzung). Der Suffix
wird in Schritt 4 an `SbkimStorage.init` weitergegeben und öffnet die
DB unter dem Namen `sbkim_<DB_SUFFIX>` — eigene Identität pro PWA.
Erlaubte Zeichen: Kleinbuchstaben, Ziffern, `_` und `-`. Wer den Suffix
weglässt (Default `init()` ohne Optionen), bleibt auf der Default-DB
`sbkim` — sinnvoll für **eine** PWA pro Origin (eigene Subdomain,
Custom-Domain, lokales Sage-Werkstatt-Repo).

---

## Datei-Pfad-Konvention im Endknoten

Klaus' Endknoten sind **Single-File-PWAs** (`index.html` auf GitHub
Pages, kein Build-Schritt). Die Konvention ist:

```
<endknoten-repo>/
├── index.html                ← bestehende PWA, sieben SBKIM-Module als <script>-Blöcke eingebettet
├── sbkim-sw.js               ← Service-Worker (Variante A · Page-Hosted), separate Datei (technisch nötig)
├── app-sw.js                 ← OPTIONAL: bestehender App-SW des Endknotens (Variante 3b)
└── sbkim/
    └── spore.json            ← deployt, eine statische Datei mit dem Spore-JSON
```

**Variante 3b (App-SW-Koexistenz):** falls die Endknoten-PWA schon einen
eigenen Service-Worker betreibt (`app-sw.js` o.ä.), liegt dieser
**ebenfalls im Repo-Root** — nicht im `sbkim/`-Ordner. Nur dann ist
`importScripts('./sbkim-sw.js')` aus dem App-SW heraus ein relativer
Geschwister-Pfad und löst korrekt auf. Liegt `app-sw.js` z.B. unter
`/<repo>/js/app-sw.js` und `sbkim-sw.js` im Root, lautet der korrekte
Import-Pfad `importScripts('../sbkim-sw.js')` — sauberer ist, beide SW-
Dateien im Repo-Root nebeneinander zu führen.

**Variante 3c (nachrangig, Übergangslösung):** SBKIM-SW unter
`<endknoten>/sbkim/sbkim-sw.js` registrieren mit Scope-Einschränkung
`/<repo>/sbkim/`. Verträgt sich neben einem bestehenden `app-sw.js`
im Repo-Root, weil die beiden Scopes disjunkt sind (App-SW deckt
`/<repo>/`, SBKIM-SW nur `/<repo>/sbkim/`). **Nicht empfohlen** —
spätere Schutz-Module (11 Rate-Limit, 12 Blocklist) wollen Pfade
unterhalb von `/<repo>/` ohne `/sbkim/`-Präfix abfangen und können
das in dieser Variante nicht. Details und Code-Block in § Schritt 3c.

### Wann welche Variante?

Der Pre-Flight-Check aus § Schritt 3 liefert das Verzweigungs-Ergebnis;
diese Tabelle macht die Auswahl auf einen Blick sichtbar:

| Variante | Pre-Flight-Ergebnis | Eigenschaften | Empfehlung |
|---|---|---|---|
| **3a** Standalone-SBKIM-SW im Repo-Root | `getRegistration('./')` → `null` (kein aktiver App-SW) | Frischer SW, Scope `/<repo>/`, `SBKIM_SW_STANDALONE=true` (`skipWaiting`/`clients.claim` greifen), ein einziger SW-Eintrag in DevTools | ⭐ Default, sofern kein App-SW existiert |
| **3b** `importScripts('./sbkim-sw.js')` in bestehendem App-SW | `getRegistration('./')` → aktive Registrierung mit Scope `/<repo>/` (typisch `app-sw.js`) | Ein SW-Eintrag (App-SW), beide fetch-Listener-Reihen im selben Worker, `SBKIM_SW_STANDALONE=false`, App-Update-Banner unangetastet, additiver Patch (zwei Zeilen in `app-sw.js`) | ⭐ Default, sofern App-SW existiert (Option α aus Befund 2026-05-15) |
| **3c** SBKIM-SW unter `/sbkim/sbkim-sw.js` mit Scope `/<repo>/sbkim/` | App-SW im Root vorhanden, Patch in `app-sw.js` aus Variante 3b aber unerwünscht (z.B. fremder Pflege-Hoheit) | Zwei separate SW-Einträge, disjunkte Scopes; Schutz-Module 11/12 werden später unter `/<repo>/sbkim/` nicht abfangen können | nachrangig (β) — nur Übergangslösung |

**Variante 3a und 3b sind die zwei produktiven Pfade.** Variante 3c ist
dokumentiert für Sonderfälle (App-SW darf nicht modifiziert werden,
Eilig-Andock unter Zeitdruck), bleibt aber Übergangslösung — ein
späterer Wechsel auf 3b ist Pflicht, sobald Schutz-Module 11/12 ziehen.

**Warum so:**

- **`sbkim-sw.js` muss eine separate Datei sein.** Browser registrieren
  Service-Worker nur über eine URL; inline-Registrierung gibt es nicht.
- **`sbkim-sw.js` liegt im Endknoten-Root** (neben `index.html`), damit
  der Default-Scope `/<repo>/` ist. Dann fängt der SW alle eingehenden
  POSTs unter `/<repo>/sbkim/anastomosis` ab. Liegt der SW unter
  `/<repo>/sbkim/sbkim-sw.js`, ist der Scope nur `/<repo>/sbkim/` — das
  funktioniert für Anastomose, blockiert aber spätere Schutz-Module
  (11/12), die unterhalb des Repo-Roots ohne `/sbkim/`-Präfix
  abfangen wollen.
- **Die sieben JS-Module werden als Inline-`<script>`-Blöcke in
  `index.html` eingebaut**, weil Klaus' Stil Single-File-PWA ist.
  Wenn ein Endknoten später aus mehreren Dateien wächst und Inline-
  Einbettung unübersichtlich wird, ist eine alternative Layout
  zulässig: `<endknoten>/sbkim/01_storage.js`, `02_spore.js`, … —
  in `index.html` dann als `<script src="sbkim/01_storage.js"></script>`
  eingebunden. Reihenfolge bleibt verbindlich (01 → 02 → 03 → 04 → 05).
- **`sbkim/spore.json` ist eine statische Repo-Datei**, die der Andocker
  einmalig aus dem laufenden Browser kopiert (Schritt 7). GitHub Pages
  liefert sie ohne Konfiguration aus.

**Service-Worker-Scope-Falle:** GitHub-Pages-Project-Sites laufen unter
`https://klaus.github.io/<repo>/`. Wer den SW unter
`/<repo>/sbkim-sw.js` registriert (Empfehlung), bekommt automatisch
Scope `/<repo>/`. Wer fälschlich `/<repo>/sbkim/sbkim-sw.js`
registriert, bekommt Scope `/<repo>/sbkim/` — Anastomose funktioniert,
spätere Erweiterungen leiden. Wer noch enger registriert, fängt nichts
mehr ab. **Verbindliche Konvention: SW immer im Repo-Root.**

---

## Andock-Schritt-Pfad (neun Schritte)

Die Schritte sind nummeriert. Klaus geht sie in dieser Reihenfolge
durch. Jeder Schritt nennt **was zu tun ist**, **was im DevTools-
oder Repo-Zustand sichtbar werden muss** und **welcher Fehler
typischerweise auftritt**.

### Schritt 1 — Dateien kopieren

Aus dem Sage-Protokol-Repo in den Endknoten-Repo:

```
sage-protokol/src/modules/01_storage.js       → <endknoten>/sbkim/01_storage.js  (oder inline, siehe Schritt 2)
sage-protokol/src/modules/02_spore.js         → <endknoten>/sbkim/02_spore.js
sage-protokol/src/modules/03_embedding.js     → <endknoten>/sbkim/03_embedding.js
sage-protokol/src/modules/04_match.js         → <endknoten>/sbkim/04_match.js
sage-protokol/src/modules/05_anastomose.js    → <endknoten>/sbkim/05_anastomose.js
sage-protokol/src/sbkim-sw.js                 → <endknoten>/sbkim-sw.js  (Repo-Root, NICHT in sbkim/)
```

**Sichtkontrolle:** sechs Dateien im Endknoten-Repo. Größen-Plausibilität:
`05_anastomose.js` ist die größte (~30 KB), `04_match.js` die kleinste
(~5 KB), `sbkim-sw.js` ~5 KB.

**Häufiger Fehler:** `sbkim-sw.js` versehentlich im `sbkim/`-Ordner
ablegen. Folge: Scope-Falle, eingehende POSTs werden nicht abgefangen.
Datei in den Repo-Root verschieben.

**Sage-Observatorium selbst ist auch ein Endknoten — wer sich am
Sage-Mycel andockt, bekommt es als Geschwister.** Mit der Spec-
Sitzung V1 Sage-Hybrid (Brief 01 der V1-Sammelspec-Kaskade,
2026-05-18) hat das Sage-Protokol-Repo eine eigene Domäne
(`Mycel-Bibliothek`, siehe INTERFACES §6 Endknoten-Liste) und gilt
gleichberechtigt neben Rezeptbuch und Mixarium. Sages eigene
`init()`-Kette aller SBKIM-Module und die Andock-Geste an der
Schwarz-Loch-Karte werden in einer Folge-Bau-Sitzung „Sage-Page-
Refactor V1" gebaut (in der `BRIEF_99_SAMMELSPEC_ABSCHLUSS`-Liste
enumeriert, sobald die V1-Sammelspec-Kaskade schließt). Karte 09
beschreibt den Andock-Pfad für Endknoten-PWAs allgemein; die
Sage-spezifische Andock-Architektur (`IndexedDB`-Suffix `sbkim_sage`,
App-SW Variante 3a, lazy-load Modul 03) ist in INTERFACES §6.1
Sage-Endknoten — Sage-Page-Architektur dokumentiert.

### Schritt 2 — `<script>`-Tags in `index.html`

In der bestehenden `index.html` vor `</body>` einfügen. Reihenfolge
**verbindlich** — jedes Modul erwartet seine Vorgänger auf `window`:

```html
<script src="sbkim/01_storage.js"></script>
<script src="sbkim/02_spore.js"></script>
<script src="sbkim/03_embedding.js"></script>
<script src="sbkim/04_match.js"></script>
<script src="sbkim/05_anastomose.js"></script>
<script src="sbkim/07_apoptose.js"></script>     <!-- Vermächtnis-Empfang + TTL-Sweep -->
<script src="sbkim/00_doku_fenster.js"></script> <!-- 5-Klick-Statusfenster -->
```

Alternativ (Inline-Single-File-Stil, Klaus-Default für kleine
Endknoten): den Inhalt der sieben JS-Dateien direkt in sieben
`<script>`-Blöcke kopieren — keine `src`-Attribute, in derselben
Reihenfolge.

**Reihenfolge-Begründung:** Modul 07 nutzt 01/02/05 (Storage,
Spore-Identität, Geschwister-Liste); Modul 00 nutzt 01 (Pflicht)
und liest 02/05/07 fail-soft. **Modul 00 zuletzt**, weil es die
anderen Module beim `init()` und `getStatusSnapshot()` als
optionale Lese-Quellen prüft — fehlen sie auf `window`, zeigt das
Doku-Fenster „Modul nicht geladen" und bleibt benutzbar.

**Sichtkontrolle:** Beim ersten Laden der App in DevTools → Konsole
müssen sieben Zeilen erscheinen (eine pro Modul, beim Skript-Laden;
03 erst nach dem `init()`-Aufruf in Schritt 5):

```
MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear
MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache
MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold, Schwelle: PROVIDER_MIN_MATCH=0.80
MODUL 05 ANASTOMOSE bereit, Funktionen: init/handshake/receiveHandshake/listSiblings/forgetSibling
MODUL 07 APOPTOSE bereit, Funktionen: init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings
MODUL 00 DOKU-FENSTER bereit, Funktionen: init/open/close/isOpen/getStatusSnapshot/recordSighttest
```

Modul 03 (Embedding) meldet sich **nach** `init()` (Schritt 5), nicht
beim Skript-Laden — der asynchrone Modell-Download würde die "bereit"-
Meldung verfälschen.

**Häufiger Fehler:** Reihenfolge vertauscht (z.B. 05 vor 02, oder 00
vor 07). Folge: `AnastomoseDependenciesError` beim `init()`-Aufruf
in Schritt 4 bzw. „SbkimApoptose nicht geladen"-Tooltip am
TTL-Sweep-Knopf im Doku-Fenster aus Schritt 9. Tags in korrekte
Reihenfolge bringen.

### Schritt 3 — Service-Worker einbinden

Vor dem `init()`-Aufruf aus Schritt 4 muss `sbkim-sw.js` im
Endknoten-Scope laufen. **Wie** sie dort hinkommt, hängt davon ab,
ob die Endknoten-PWA schon einen eigenen Service-Worker betreibt
(typisch: App-Offline-Cache, Push-Benachrichtigungen). Karte 09
verzweigt deshalb in **Pre-Flight-Check → 3a oder 3b**.

#### Pre-Flight-Check — App-SW erkennen

Vor jedem Andock-Versuch genau einmal aufrufen, **bevor** Variante
3a oder 3b gewählt wird:

```js
const existing = await navigator.serviceWorker.getRegistration("./");
if (existing && existing.active) {
  // App-SW erkannt → Variante 3b
} else {
  // kein App-SW → Variante 3a (bisheriges Verhalten)
}
```

Der Check liefert ein **klares Verzweigungs-Ergebnis**: gibt es im
aktuellen Scope (`./` = Repo-Root, identisch zum Scope, den
`register('sbkim-sw.js')` belegen würde) bereits eine aktive
Registrierung, dann nimmt der Andocker **Variante 3b**. Andernfalls
**Variante 3a**.

**Wichtig:** Die Karte sagt nur, **welcher Fall welche Variante
triggert** — die Entscheidung trifft der Andocker einmal beim Einbau,
nicht zur Laufzeit jeder PWA-Sitzung.

#### Schritt 3a — Variante „PWA ohne eigenen SW"

In einem `<script>`-Block in `index.html`, **vor** dem `init()`-Aufruf
aus Schritt 4:

```html
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sbkim-sw.js").then(function (reg) {
      console.info("SBKIM-SW registriert, Scope:", reg.scope);
    }).catch(function (err) {
      console.error("SBKIM-SW Registrierung fehlgeschlagen:", err);
    });
  } else {
    console.warn("Browser ohne Service-Worker — eingehender Handshake nicht möglich.");
  }
</script>
```

`sbkim-sw.js` läuft alleinstehend: `SBKIM_SW_STANDALONE = true`
(Default, siehe § Service-Worker-Hinweis), `skipWaiting` /
`clients.claim` greifen → offene Tabs kommen sofort unter SW-
Kontrolle.

**Sichtkontrolle:** Konsolen-Zeile `SBKIM-SW registriert, Scope:
https://klaus.github.io/<repo>/`. Der Scope-String **muss** mit dem
Repo-Pfad enden, sonst ist die Scope-Falle aktiv.

**Sichtprüfung in DevTools:** Application → Service Workers → Status
"activated and is running", Scope = `/<repo>/`, Source =
`sbkim-sw.js`.

**Häufiger Fehler:** SW unter `file://` oder `http://` getestet. Browser
verweigern die Registrierung dann. Lösung: lokal mit `python3 -m
http.server` oder über GitHub Pages testen (HTTPS oder `localhost` sind
die einzigen zulässigen Origins für Service-Worker).

#### Schritt 3b — Variante „PWA mit eigenem App-SW"

Hat der Pre-Flight-Check einen aktiven App-SW gefunden (`app-sw.js`
o.ä.), darf der Endknoten **keinen zweiten `register`-Aufruf**
absetzen — das würde den App-SW im selben Scope ersetzen und den
App-Offline-Cache + Push-Pfade verlieren (siehe § Risiken & offene
Punkte „App-SW-Überschreibung").

Statt dessen ergänzt der Endknoten in seinem bestehenden `app-sw.js`
**zwei Zeilen ganz oben**, vor dem bestehenden Code:

```js
// in app-sw.js, ganz oben, vor dem bestehenden Code:
self.SBKIM_SW_STANDALONE = false;
importScripts('./sbkim-sw.js');
```

Im Endknoten-`index.html` reicht dann der **bestehende**
`register('./app-sw.js')`-Aufruf — **kein** zusätzlicher SBKIM-
Register-Aufruf. Der fetch-Listener für `/sbkim/anastomosis` und
`/sbkim/legacy` wird durch `importScripts` im selben SW-Kontext
mit-registriert; alle anderen Pfade fallen durch in den App-SW-Cache-
/Routing-Code (siehe fetch-Listener-Reihenfolge im § Service-Worker-
Hinweis).

`self.SBKIM_SW_STANDALONE = false` ist die einzige verbindliche
Konfiguration: dadurch verzichten die `install`/`activate`-Handler
in `sbkim-sw.js` auf `skipWaiting` / `clients.claim`, und der App-SW
behält die Steuerung seines eigenen Lebenszyklus.

**Sichtkontrolle:** Konsolen-Zeile `SBKIM-SW geladen via importScripts
(Variante 3b)`. Die Zeile loggt `sbkim-sw.js` nicht selbst (die Datei
hat keinen Top-Level-`console.info`); der Andocker setzt sie in
`app-sw.js` **direkt nach** dem `importScripts`-Aufruf:

```js
// in app-sw.js, direkt nach importScripts:
console.info("SBKIM-SW geladen via importScripts (Variante 3b)");
```

**Sichtprüfung in DevTools:** Application → Service Workers zeigt
**eine** Registrierung (Source = `app-sw.js`), Status "activated and
is running", Scope = `/<repo>/`. Nicht zwei Worker und nicht
`sbkim-sw.js` als Source — das wäre die App-SW-Überschreibung
(siehe § Risiken).

**Häufige Fehler:**

- **App-SW erkannt, aber Variante 3a benutzt.** Der Andocker hat den
  Pre-Flight-Check übersprungen und `register('sbkim-sw.js')` trotzdem
  gerufen — der App-SW wird im selben Scope ersetzt, App-Offline-Cache
  und Push-Pfade verschwinden. Siehe § Risiken & offene Punkte
  „App-SW-Überschreibung". Fix: zur Variante 3b zurückkehren, App-SW
  einmal neu deployen (oder beim Andocker im Browser unter Application
  → Service Workers den falschen Worker entregistrieren und Tab neu
  laden).
- **`importScripts` wirft `NetworkError`.** Pfad falsch oder Datei
  nicht im Repo-Root deployt. `importScripts('./sbkim-sw.js')` ist
  relativ zum App-SW selbst — Voraussetzung: `app-sw.js` und
  `sbkim-sw.js` liegen **beide** im Endknoten-Repo-Root (siehe §
  Datei-Pfad-Konvention). Fix: SW-Datei dorthin verschieben, Tab neu
  laden.
- **App-SW hat `event.respondWith` ohne Pass-Through.** Wenn die
  bestehenden App-SW-`fetch`-Listener jedes Event mit
  `event.respondWith()` beantworten (statt für unbekannte Pfade
  durchzufallen), kommt der sbkim-sw.js-Listener bei SBKIM-Pfaden
  nie zum Zug. Siehe fetch-Listener-Reihenfolge im § Service-Worker-
  Hinweis. Fix: `importScripts('./sbkim-sw.js')` **vor** allen
  App-SW-`addEventListener('fetch', …)`-Aufrufen platzieren (Browser
  ruft Listener in Registrier-Reihenfolge auf — wer zuerst
  `respondWith` aufruft, gewinnt) **und** App-SW-Listener so
  schreiben, dass sie SBKIM-Pfade explizit nicht anfassen.

#### Schritt 3c — Variante „nachrangig: SBKIM-SW unter /sbkim/ mit Scope-Einschränkung"

Nur wählen, wenn **weder** Variante 3a noch 3b passen — etwa weil der
bestehende `app-sw.js` aus Pflege-Hoheitsgründen nicht modifiziert
werden darf, oder ein Eilig-Andock unter Zeitdruck ohne SW-Patch
nötig ist. **Diese Variante bricht die Service-Worker-Scope-Konvention
aus § Risiken bewusst** und ist als Übergangslösung markiert.

`sbkim-sw.js` liegt in dieser Variante **nicht** im Repo-Root, sondern
unter `<endknoten>/sbkim/sbkim-sw.js`. In `index.html`:

```html
<script>
  if ("serviceWorker" in navigator) {
    // Pfad relativ zu index.html — landet als /<repo>/sbkim/sbkim-sw.js
    // mit Scope /<repo>/sbkim/ (disjunkt zum App-SW-Scope /<repo>/).
    navigator.serviceWorker.register("sbkim/sbkim-sw.js", { scope: "sbkim/" })
      .then(function (reg) {
        console.info("SBKIM-SW (Variante 3c) registriert, Scope:", reg.scope);
      })
      .catch(function (err) {
        console.error("SBKIM-SW (3c) Registrierung fehlgeschlagen:", err);
      });
  }
</script>
```

`SBKIM_SW_STANDALONE` bleibt `true` (Default) — der Standalone-Worker
verwaltet seinen eigenen Lebenszyklus, der App-SW im Root unverändert
daneben. Beide SWs koexistieren mit disjunkten Scopes.

**Vor- und Nachteile:**

- **Vorteil:** `app-sw.js` bleibt vollständig unangetastet (keine
  fremde Editier-Hoheit, kein zwei-Zeilen-Patch, kein Re-Deploy nötig).
- **Nachteil:** Spätere Schutz-Module (11 Rate-Limit, 12 Blocklist)
  fangen Pfade unterhalb des Repo-Roots ohne `/sbkim/`-Präfix ab —
  unter Scope `/<repo>/sbkim/` ist das unmöglich.
- **Nachteil:** Klaus muss `sbkim-sw.js` ins Unterverzeichnis kopieren
  (entgegen der § Schritt 1 Konvention). Spore-Endpunkt
  `/sbkim/spore.json` ist davon unberührt — der ist eine statische
  Datei, der SW-Scope ist davon unabhängig.
- **Nachteil:** Migration zurück auf 3b kostet eine Folge-Pflege —
  alten 3c-SW unregistrieren, App-SW patchen, Tab neu laden.

**Sichtkontrolle:** DevTools → Application → Service Workers zeigt
**zwei** Registrierungen — `app-sw.js` (Scope `/<repo>/`) und
`sbkim/sbkim-sw.js` (Scope `/<repo>/sbkim/`). Konsolen-Zeile
`SBKIM-SW (Variante 3c) registriert, Scope:
https://klaus.github.io/<repo>/sbkim/`.

**Häufiger Fehler:** Variante 3c gewählt, obwohl App-SW patchbar wäre.
Spätere Pflege-Sitzung muss die Migration auf 3b nachholen. Klaus
sollte 3c nur als bewusste Übergangs-Entscheidung wählen, nicht aus
Bequemlichkeit.

### Schritt 4 — `SbkimStorage.init({dbSuffix})` + `SbkimAnastomose.init()`

Im selben Script-Block oder direkt danach:

```html
<script>
  (async function () {
    // (1) PWA-Suffix VOR Anastomose.init setzen — sonst öffnet Modul 01
    // intern die Default-DB "sbkim", die auf GitHub-Pages-Project-Sites
    // mit anderen Endknoten unter demselben Origin kollidiert (siehe
    // § Vor dem Einbau zu klärende Werte).
    await SbkimStorage.init({ dbSuffix: "<DB_SUFFIX>" });

    // (2) Anastomose-Init zieht Storage/Spore/Identität intern nach.
    // SbkimStorage.init ist idempotent: Modul 05 ruft es selbst nochmal,
    // bekommt aber dasselbe dbPromise zurück (also dieselbe PWA-DB).
    await SbkimAnastomose.init();
    console.info("SBKIM-Init grün — Storage, Spore, Match bereit.");
  })();
</script>
```

`SbkimAnastomose.init()` ruft intern `SbkimStorage.init()`,
`SbkimSpore.init()`, prüft `SbkimMatch` auf `window`, stellt via
`SbkimSpore.getOrCreateIdentity()` die Singleton-Identität sicher und
registriert den `navigator.serviceWorker.addEventListener("message",
…)`-Listener für die Page-Brücke des Service-Workers.

**Warum zwei Aufrufe statt einem?** Modul 01 ist die einzige Stelle, die
den DB-Namen kennt. Wer dort einen Suffix setzen will, ruft
`SbkimStorage.init({dbSuffix:…})` **zuerst** — bevor Modul 05 (und
später 06/07/00) den internen `SbkimStorage.init()`-Aufruf nachzieht.
Idempotenz garantiert, dass alle Folge-Aufrufe dieselbe DB benutzen.
Ein abweichender Suffix bei einem späteren init-Aufruf wirft
`InvalidDbSuffixError` (kein stilles Ignorieren — Karte 01 §
DB-Namen-Konvention). Wer **keine** PWA-Suffix-Trennung braucht (eine
PWA pro Origin, eigene Subdomain), ruft `SbkimAnastomose.init()` ohne
vorherigen Storage-Aufruf und bleibt auf der Default-DB `sbkim`.

**Sichtkontrolle:** Konsolen-Zeile `SBKIM-Init grün — Storage, Spore,
Match bereit.` Außerdem in DevTools → Application → IndexedDB →
`sbkim_<DB_SUFFIX>` (z.B. `sbkim_mixarium` bzw. `sbkim_rezeptbuch`)
muss der Store `sbkim_keys` existieren mit Eintrag `"main"` (das
Singleton-Keypair). Wer ohne Suffix andockt, sieht die DB unter dem
Namen `sbkim`.

**Same-origin Cross-PWA-Handshake — Andock-Hinweis (Bau-Sitzung
BroadcastChannel-Bridge 2026-05-17).** `SbkimAnastomose.init()`
registriert nicht nur die Service-Worker-Page-Brücke, sondern (eager,
ab dieser Bau-Sitzung) auch einen Receiver auf
`BroadcastChannel('sbkim')` — den **same-origin Fallback-Transport**
für den Fall, dass zwei SBKIM-PWAs auf derselben Origin laufen (z.B.
`<user>.github.io/Mein-Rezeptbuch/` + `<user>.github.io/Mein-Mixarium/`
auf GitHub Pages). Konsequenz für die Andock-Bedienung:

- **Beide PWA-Tabs müssen offen sein**, wenn der Handshake über den
  Channel-Pfad laufen soll. Geschlossener Receiver-Tab → kein Listener
  auf `BroadcastChannel('sbkim')` → Sender-Timeout nach 4 s
  (`HandshakeTimeoutError`, Log-Zeile `"timeout-channel"`). Kein
  Wake-Lock, kein Auto-Start — konsistent zur SW-Pfad-Linie „503, wenn
  keine Page aktiv".
- **HTTP-Pfad bleibt der Standard.** `SbkimAnastomose.handshake(peer,
  ownVec)` versucht zuerst den regulären POST gegen
  `peer.endpoint + "/sbkim/anastomosis"`. Erst wenn der HTTP-Pfad
  klare Defekt-Signale liefert (4xx/5xx, non-JSON-Antwort, Antwort
  ohne HandshakeResponse-Pflichtfelder, `outcome` außerhalb
  `{"established","rejected"}`), fällt der Aufruf **einmalig** auf den
  Channel-Pfad zurück. Cross-domain (verschiedene Origins) bleibt
  unverändert HTTP-only.
- **Architektur-Hintergrund:** GitHub-Pages-same-origin Handshake via
  SW-Bridge ist konzeptuell unmöglich (Subresource-Fetches gehen
  durch den SW des Senders, nicht des Empfängers — siehe Karte 05
  § Service-Worker-Hinweis § Architektur-Grenze). Der Channel-Pfad
  ist die single-tab-vermeidende Lösung.

Details und E1–E7-Entscheidungstabelle: Karte 05 § BroadcastChannel-
Bridge.

**Häufiger Fehler:** `InvalidDbSuffixError` — `<DB_SUFFIX>` enthält
Zeichen außerhalb `^[a-z0-9_-]+$` (Großbuchstaben, Punkt, Umlaut, …)
oder ist leer. Eintrag in § Vor dem Einbau zu klärende Werte
korrigieren. — `AnastomoseDependenciesError` mit Liste fehlender
Module → Reihenfolge der `<script>`-Tags in Schritt 2 korrigieren.
— `CryptoUnavailableError` → Browser zu alt für WebCrypto Ed25519
(Chrome < 113, Firefox < 130, Safari < 17). Endknoten-PWA bleibt
lauffähig, aber SBKIM-Funktionen sind dann deaktiviert.

### Schritt 5 — `domainVector` erzeugen

**Erst hier wird Modul 03 (Embedding) initialisiert** — der Download
des transformers.js-Modells ist ~30 MB, das passiert einmalig pro
Browser-Profil und wird vom Browser gecacht. Eine UX-Vorwarnung
("Erste Andock-Initialisierung kann eine Minute dauern") ist sinnvoll
für den Andocker.

```html
<script>
  (async function () {
    // Modul 03 einmalig laden — ~30 MB Modell-Download (gecacht ab dann)
    await SbkimEmbedding.init();

    var domainKeywords = ["Backen", "Saucen", "Hauptgang", "Hefeteig",
                          "Kuchen", "Suppen", "Hauptgericht", "Beilage"];
    var domainText = domainKeywords.join(", ");

    // 384-dim L2-normalisierter Vektor — passage-Modus, weil das die
    // andockende Seite ist (Anbieter der Domäne)
    var vec = await SbkimEmbedding.embedPassage(domainText);
    console.info("Domain-Vektor erzeugt: " + vec.length + " Floats, Norm ~1.0");

    // Vektor wird in Schritt 6 in die Spore eingebaut. Hier bereits
    // im Speicher halten, damit Schritt 6 ihn direkt benutzen kann.
    window.__sbkimDomainVector = vec;
  })();
</script>
```

**Sichtkontrolle:** Konsolen-Zeile `MODUL 03 EMBEDDING bereit,
Funktionen: …, Modell: Xenova/multilingual-e5-small, Dim: 384` (kommt
nach `init()` von Modul 03). Danach `Domain-Vektor erzeugt: 384 Floats,
Norm ~1.0`.

**Häufiger Fehler:** `ModelLoadError` → Netzwerk-Block, Browser-
Cache-Quote überschritten, oder die transformers.js-CDN ist nicht
erreichbar. Im DevTools → Network nach dem `multilingual-e5-small`-
Asset suchen; bei Statuscode 4xx Netz-Setup prüfen.

**`embedPassage` vs. `embedQuery`:** beim Andocken ist der Endknoten
der *Anbieter* der Domäne, also `embedPassage`. Der `domainVector` in
der Spore ist ein Passage-Vektor; Modul 04 vergleicht später
`match(queryVec, passageVec)` — modus-frei, aber die Parameternamen
sind Lese-Hilfe.

### Schritt 6 — `generateOwnSpore` mit `domainVector`

**Soft-Pflicht des Andock-Workflows:** der `domainVector` ist im
Spore-Schema (§2 INTERFACES) *optional*, aber im Andock-Workflow von
Karte 09 **verbindliche Pflicht**. Ohne ihn kann der Empfänger nicht
matchen und antwortet `outcome:"rejected", reason:"kein domainVector
verfügbar"`. Wer die Anleitung befolgt, hat den Vektor.

```html
<script>
  (async function () {
    var vec = window.__sbkimDomainVector;
    if (!vec) {
      throw new Error("Domain-Vektor fehlt — Schritt 5 nicht erfolgreich.");
    }

    var spore = await SbkimSpore.generateOwnSpore({
      domain: "rezeptbuch.example.org",
      endpoint: "https://klaus.github.io/rezeptbuch/",  // mit trailing slash
      nodeType: "hybrid",
      nodeName: "Rezeptbuch Klaus",                     // optional
      domainDescription:
        "Hausgemachte Kochrezepte, vom Hefeteig bis zur Sauce.",
      domainKeywords: ["Backen", "Saucen", "Hauptgang", "Hefeteig",
                       "Kuchen", "Suppen", "Hauptgericht", "Beilage"],
      domainVector: Array.from(vec),                    // 384 floats als plain array
    });

    console.info("Spore erzeugt, nodeId =", spore.id);
    console.info("Spore signiert, Signatur-Länge =", spore.signature.length);
  })();
</script>
```

**Sichtkontrolle:** Konsolen-Zeile `Spore erzeugt, nodeId =
<43-Zeichen-base64url>` und `Spore signiert, Signatur-Länge = 86`
(Ed25519-Signaturen sind 64 Bytes → 86 base64url-Zeichen ohne Padding).
In DevTools → Application → IndexedDB → `sbkim` → `sbkim_spore` ist
jetzt ein Eintrag mit Schlüssel `"main"` und einem vollständigen
Spore-Objekt sichtbar.

**Häufiger Fehler:** `InvalidSporeMetaError: Pflichtfeld fehlt:
endpoint` → die Pflichtfelder `domain`, `nodeType`, `endpoint`
vollständig setzen. `domainVector`-Länge ≠ 384 → Schritt 5 nicht
korrekt durchgelaufen (kein L2-normalisierter 384-dim Vektor).

### Schritt 7 — Spore deployen unter `sbkim/spore.json`

Die Spore ist jetzt in IndexedDB. Sie muss als **statische Datei** im
Endknoten-Repo unter `sbkim/spore.json` deployt werden, damit andere
Knoten sie per `fetch` abrufen können. GitHub Pages liefert sie dann
ohne weitere Konfiguration aus.

**Pragmatischer Weg:**

```js
// In der DevTools-Konsole der laufenden Endknoten-PWA:
copy(JSON.stringify(await SbkimSpore.getOwnSpore(), null, 2));
```

`copy()` ist eine DevTools-Builtin und legt das JSON in die
Zwischenablage. Im Endknoten-Repo eine Datei `sbkim/spore.json` anlegen
(falls noch nicht vorhanden, Ordner `sbkim/` mit anlegen), den
Zwischenablage-Inhalt einfügen, committen, pushen. GitHub Pages
deployt die neue Spore nach 1–2 Minuten.

**Verbindlicher Endpunkt:** `/sbkim/spore.json`. Das ist der Alias
aus [`INTERFACES.md` §3](../INTERFACES.md). Der Default
`/.well-known/sbkim/spore.json` ist für GitHub-Pages-Project-Sites
**nicht** verbindlich — Jekyll (GitHub Pages' Default-Build) ignoriert
Ordner, die mit `.` beginnen, es sei denn, eine `.nojekyll`-Datei oder
eine explizite `_config.yml` mit `include: [".well-known"]` liegt im
Repo. Der Alias `/sbkim/spore.json` umgeht das Risiko und bündelt
außerdem alle SBKIM-Pfade unter `/sbkim/` (semantisch sauber).

**Sichtkontrolle:** Im Browser
`https://klaus.github.io/<repo>/sbkim/spore.json` öffnen — das JSON
muss als Klartext erscheinen, mit `id`, `domain`, `signature`,
`domainVector` (384 Zahlen), `protocolVersion: "0.1"` usw. Falls 404:
GitHub-Pages-Build läuft noch, oder die Datei wurde nicht ins Repo
gepusht.

**Häufiger Fehler:** Spore ohne `domainVector` deployt (z.B. weil
Schritt 5 übersprungen wurde). Andere Knoten lehnen den Handshake mit
`reason:"kein domainVector verfügbar"` ab. Lösung: Schritt 5 + 6 + 7
neu durchlaufen.

### Schritt 8 — Ersten Handshake auslösen

Jetzt ist der Endknoten andockbar. Erster Live-Test gegen ein bekanntes
Geschwister (typisch: Klaus betreibt Rezeptbuch + Mixarium parallel und
docken sie aneinander an):

```html
<script>
  async function ersterHandshake() {
    var vec = window.__sbkimDomainVector;
    if (!vec) {
      throw new Error("Schritte 1–7 nicht durchgelaufen.");
    }

    // Spore des Geschwisters laden (Rezeptbuch holt Mixarium-Spore,
    // oder umgekehrt — beide müssen Schritt 7 abgeschlossen haben).
    var peer = await fetch(
      "https://klaus.github.io/mixarium/sbkim/spore.json"
    ).then(function (r) { return r.json(); });

    console.info("Peer-Spore geladen, nodeId =", peer.id);

    // Handshake auslösen — bidirektional, beide Seiten landen in
    // sbkim_siblings, wenn beide Domain-Vektoren über die Schwelle 0.80
    // hinweg matchen.
    var result = await SbkimAnastomose.handshake(peer, vec);
    console.info("Handshake-Ergebnis:", result);

    // Liste der Geschwister anzeigen
    var siblings = await SbkimAnastomose.listSiblings();
    console.info("Verbundene Geschwister:", siblings);
  }

  // Knopf in der Doku-Konsole oder DevTools direkt:
  // ersterHandshake();
</script>
```

**Sichtkontrolle:** Konsolen-Zeile `Handshake-Ergebnis:
{outcome: "established", peerNodeId: "<43-Zeichen>", peerDomain:
"mixarium.example.org", score: 0.8x}`. Danach in DevTools → Application
→ IndexedDB → `sbkim` → `sbkim_siblings` ein Eintrag mit Schlüssel =
peer-nodeId und Wert `{nodeId, domain, endpoint, pubKey, since}`. In
`sbkim_anastomosis_log` ein neuer Eintrag mit `outcome: "established"`.

**Häufige Fehler:**

- `HandshakeNetworkError`: das Peer-Geschwister ist nicht erreichbar
  (4xx/5xx) oder CORS-Block. GitHub Pages liefert keine offenen
  CORS-Header für `fetch`-POSTs — der eingehende POST läuft über den
  Service-Worker des **Empfängers**, der hat den selben Origin wie
  die abgerufene Spore. Der ausgehende POST geht aber direkt vom
  Browser an `https://klaus.github.io/<peer>/sbkim/anastomosis`. Bei
  Cross-Repo-Zugriff (Rezeptbuch → Mixarium beide unter
  `klaus.github.io`) ist der Origin gleich — kein CORS-Problem.
  Bei wirklich fremden Origins muss der Empfänger CORS-Header
  liefern; das ist Sache eines späteren Pflege-Schritts.
- `outcome: "rejected", reason: "kein domainVector verfügbar"`:
  Peer-Spore hat keinen `domainVector` (Schritt 5 dort übersprungen).
  Lösung: Peer-Andocker fragen, Schritt 5–7 dort nachzuholen.
- `outcome: "rejected", reason: "score unterhalb Schwelle"`: die
  Domänen passen semantisch nicht (Score < 0.80). Das ist
  **erfolgreiches Funktionieren** — das Mycel verbindet nur nahe
  Themen. Kein Bug.
- `HandshakeTimeoutError`: Peer hat keinen aktiven Tab offen. Service-
  Worker antwortet mit 503, Modul 05 wirft Timeout. Lösung: Peer-
  Endknoten im Browser öffnen, dann erneut handshaken.

### Schritt 9 — Apoptose + Doku-Fenster scharf schalten

Nach dem ersten erfolgreichen Handshake aus Schritt 8 ist der
Endknoten **andockbar**, aber zwei sichtbare Pflege-Funktionen
fehlen noch: **Vermächtnis-Empfang** (eingehende
„Domain stillgelegt"-Botschaften gestorbener Geschwister) und das
**versteckte 5-Klick-Doku-Fenster** für Klaus' Sichtkontrolle.

```html
<script>
  (async function () {
    // 9a. Apoptose-Modul scharf schalten — Vermächtnis-Empfang.
    // Modul 07 setzt einen MessageChannel-Listener auf den
    // Service-Worker, damit eingehende /sbkim/legacy-POSTs in
    // sbkim_legacy_inbox landen. Ohne init() kommen Vermächtnisse
    // nicht in der Inbox an.
    await SbkimApoptose.init();
    console.info("SBKIM-Apoptose grün — Vermächtnis-Empfang aktiv.");

    // 9b. Doku-Fenster anschalten — versteckte 5-Klick-Geste am
    // Such-Symbol der PWA. Klaus klickt das Such-Symbol fünfmal
    // binnen 3 Sekunden, das modale Statusfenster geht auf.
    // searchIconSelector ist der CSS-Selektor des Such-Symbols
    // im Endknoten — pro PWA verschieden.
    await SbkimDoku.init({
      searchIconSelector: "#search-icon",   // Rezeptbuch: anpassen
      // Optional: revealClicks (Default 5), revealWindowMs (Default 3000),
      // windowTitle (Default "SBKIM-Knotenstand"), mountTarget (Default body).
    });
    console.info("SBKIM-Doku grün — 5-Klick-Geste am Such-Symbol aktiv.");

    // 9c (optional, empfohlen). TTL-Sweep nach jedem Handshake.
    // Modul 07 macht keinen Selbst-Sweep (kein setInterval, keine
    // Pulsation). Der Andocker ruft forgetExpiredSiblings explizit —
    // entweder hier nach jedem ersterHandshake() oder als manueller
    // Klick im Doku-Fenster (Modul 00 hat den Knopf eingebaut).
    // Empfehlung für statische Endknoten: nach jedem Handshake.
    var SIBLING_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;  // §0
    var removed = await SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS);
    if (removed.length > 0) {
      console.info("TTL-Sweep: stille Geschwister vergessen:", removed);
    }
  })();
</script>
```

**Sichtkontrolle:**

- Konsolen-Zeilen `SBKIM-Apoptose grün — Vermächtnis-Empfang aktiv.`
  und `SBKIM-Doku grün — 5-Klick-Geste am Such-Symbol aktiv.`.
- In DevTools → Application → IndexedDB → `sbkim` → `sbkim_doku_meta`
  ein Eintrag mit Schlüssel `"meta"`, Wert
  `{moduleId:"meta", schemaVersion:1, lastOpenedAt:null}`.
- Klaus klickt das Such-Symbol fünfmal binnen 3 s — das modale
  Doku-Fenster (Backdrop + zentrierter Window-Box) geht auf,
  zeigt Knoten-ID, Domäne, Geschwister-Liste, Vermächtnis-Inbox,
  Speicher-Stand, drei Aktion-Knöpfe (Stille Geschwister vergessen
  / Inbox aktualisieren / Schließen). Klick auf den Backdrop oder
  Esc-Taste schließt.
- Nach `lastOpenedAt`-Update (beim ersten Öffnen des Fensters) hat
  `sbkim_doku_meta["meta"].lastOpenedAt` einen ISO-8601-String,
  nicht mehr `null`.

**Häufiger Fehler:** `searchIconSelector` matcht kein DOM-Element
(z.B. weil das Such-Symbol erst dynamisch nachgeladen wird oder
einen anderen Selektor hat). Modul 00 macht `console.warn` und
versucht via `MutationObserver` einen Re-Mount, gibt nach 10 s
auf. Fix: korrekten Selektor in `init()`-Aufruf setzen, Tab neu
laden.

**Häufiger Fehler 2:** TTL-Sweep wird nie gerufen, weil der
Andocker Schritt 9c überspringt **und** Klaus das Doku-Fenster
nie öffnet. Folge: stille Geschwister bleiben monatelang in
`sbkim_siblings`, deren Domain ist längst tot, ihre Antworten
laufen in `HandshakeTimeoutError`. Fix: entweder 9c einbauen oder
sich angewöhnen, das Doku-Fenster regelmäßig zu öffnen + den
TTL-Sweep-Knopf zu klicken.

**Was Schritt 9 NICHT macht:**

- **Kein Self-Apoptose-Knopf.** Self-Apoptose (`prepareSelfApoptose`
  / `confirmSelfApoptose`) ist irreversibel und gehört in einen
  separaten Service-Pfad (z.B. eine versteckte Service-Seite), nicht
  in den Standard-Andock-Pfad und auch nicht ins Doku-Fenster.
  Karte 07 § Schnittstelle dokumentiert die Zwei-Stufen-API; Klaus
  ruft sie bei tatsächlicher Domain-Stilllegung händisch in der
  DevTools-Konsole.
- **Keine `SbkimAnastomose.handshake`-Automatik.** Schritt 8
  bleibt ein expliziter Klaus-Trigger (oder ein Endknoten-eigener
  „Andocken"-Knopf). Modul 09 macht keinen Background-Handshake.
- **Kein Heterokaryose-Pfad** (Modul 06 ist späte Phase, Schablone).

---

## Sichtkontrolle nach dem Andocken (Pflicht)

Drei Dinge müssen sichtbar werden, sonst ist der Endknoten **nicht**
fertig andockend:

1. **In DevTools → Konsole** beim Laden der PWA sieben Selbstcheck-
   Zeilen `MODUL XX … bereit, Funktionen: …` (01, 02, 04, 05, 07, 00
   beim Skript-Laden; 03 nach `init()`). Außerdem `SBKIM-SW
   registriert, Scope: …`, `SBKIM-Init grün — …`,
   `SBKIM-Apoptose grün — Vermächtnis-Empfang aktiv.` und
   `SBKIM-Doku grün — 5-Klick-Geste am Such-Symbol aktiv.`.

2. **In DevTools → Application → IndexedDB → `sbkim`** sechs Stores:
   `sbkim_keys` (Schlüssel `"main"` mit Keypair), `sbkim_spore`
   (Schlüssel `"main"` mit der signierten Spore inkl. `domainVector`),
   `sbkim_siblings` (anfangs leer, nach Schritt 8 mit dem ersten Peer
   gefüllt), `sbkim_anastomosis_log` (nach Schritt 8 mit `established`-
   Eintrag), `sbkim_legacy_inbox` (leer; nach eingehendem Vermächtnis
   eine Zeile pro gestorbenem Geschwister), `sbkim_doku_meta`
   (Schlüssel `"meta"` aus Schritt 9; nach erstem Doku-Fenster-Öffnen
   ist `lastOpenedAt` ein ISO-8601-String statt `null`).

3. **Im Browser** Klartext-Spore unter
   `https://klaus.github.io/<repo>/sbkim/spore.json` — `id`, `domain`,
   `endpoint`, `domainVector` (384 Zahlen), `signature`. Wer
   `https://klaus.github.io/<repo>/sbkim/anastomosis` per GET aufruft,
   bekommt 405 (Method Not Allowed) — bestätigt, dass der Service-
   Worker den Pfad abfängt. **`https://klaus.github.io/<repo>/sbkim/legacy`**
   per GET liefert ebenfalls 405 (gemeinsamer Service-Worker-`fetch`-
   Listener mit `/sbkim/anastomosis` seit Bau-Sitzung 07).

4. **Klaus klickt das Such-Symbol fünfmal binnen 3 Sekunden** —
   das modale Doku-Fenster (Backdrop + zentrierter Window-Box,
   `position:fixed;inset:0;background:rgba(0,0,0,0.55)`) geht auf,
   zeigt Knoten-ID-Kurzform, Domäne, Knotentyp, Geschwister-Liste
   (nach Schritt 8 mindestens ein Eintrag), Vermächtnis-Inbox,
   Speicher-Stand mit Quota-Warnzeile bei > 80% oder < 50 MiB frei,
   drei Aktion-Knöpfe (Stille Geschwister vergessen / Inbox
   aktualisieren / Schließen). Esc oder Klick auf den Backdrop
   schließt.

### Tablet-Variante — Eruda als in-Page-DevTools

Die vier Pflicht-Punkte setzen Desktop-DevTools voraus (Konsole +
Anwendung → IndexedDB + Netzwerk). Klaus arbeitet auf einem **Samsung
Galaxy Tab S6 + DeX** im Android-Chrome — dort gibt es weder
`Strg+Shift+I` noch ein „Entwicklertools"-Menü, und Remote-USB-
Debugging über einen zweiten Rechner fällt aus. Für die Andock-
Sichtkontrolle ist **Eruda** (in-Page-DevTools-Polyfill) der
pragmatische Pfad: ein einzelnes Script-Tag im `<head>` der Endknoten-
PWA, danach erscheint ein kleiner Floating-Button im Tab, der per
Antippen Console + Resources/IndexedDB + Network touch-bedienbar
einblendet.

```html
<!-- in index.html, nur während der Andock-Sichtkontrolle -->
<script src="https://cdn.jsdelivr.net/npm/eruda@3"></script>
<script>eruda.init();</script>
```

Eruda ist auf Major-Version `eruda@3` **gepinnt**, damit der Sichttest
reproduzierbar bleibt; ein späterer Sprung auf `@4` darf nur in einer
eigenen Pflege-Sitzung passieren. Subresource Integrity (SRI) ist
nicht erforderlich — Eruda läuft nur im Sichttest-Modus, ist nach
Andock wieder zu entfernen, und der Endknoten ist im Sichttest ohnehin
unter Klaus' direkter Beobachtung.

**Mapping der vier Pflicht-Punkte auf Eruda:**

1. **Sieben Selbstcheck-Zeilen** → Eruda-Tab **Console** öffnen. Die
   `MODUL XX … bereit, …`-Zeilen plus `SBKIM-SW …` / `SBKIM-Init grün …`
   / `SBKIM-Apoptose grün …` / `SBKIM-Doku grün …` erscheinen dort
   genau wie in Desktop-DevTools.
2. **Sechs IndexedDB-Stores** → Eruda-Tab **Resources** → **IndexedDB**
   → `sbkim` aufklappen. `sbkim_keys`, `sbkim_spore`, `sbkim_siblings`,
   `sbkim_anastomosis_log`, `sbkim_legacy_inbox`, `sbkim_doku_meta`
   müssen sichtbar sein, mit jeweils Schlüsseln und Einträgen wie in
   den vier Pflicht-Punkten beschrieben.
3. **Zwei live-Endpunkte** → Eruda-Tab **Network** öffnen, dann in
   einem zweiten Browser-Tab `https://klaus.github.io/<repo>/sbkim/
   anastomosis` per GET ansteuern (z.B. via Adress-Leiste). Eintrag
   im Network-Tab muss Status `405` zeigen; analog für
   `/sbkim/legacy`. Spore-GET über `/sbkim/spore.json` liefert `200`.
4. **5-Klick-Geste** → das Doku-Fenster öffnet sich auch unter Eruda
   regulär. Eruda und das Doku-Fenster sind zwei separate Overlays,
   sie kollidieren nicht (Eruda ist `z-index` über allem, das Doku-
   Fenster liegt darunter, beide bleiben benutzbar).

**Nach erfolgreichem Andock entfernen.** Die zwei Eruda-Script-Tags
werden aus `index.html` wieder herausgenommen, bevor die Produktiv-
PWA deployt wird. Eruda ist **kein** Produktiv-Bestandteil, **kein**
SBKIM-Modul und **kein** Datenschutz-Stein — es ist ein temporäres
Sichttest-Werkzeug für den Endknoten-Andocker, vergleichbar mit
einem aufgehängten Putzgerüst. Dauerhafter Eruda-Einbau gehört in
keine produktive PWA.

5. **(Nur Variante 3b)** Zwei-Browser-Test der App-SW-Koexistenz —
   wartet auf Klaus' nächsten Live-Andock-Versuch (Bau-Sitzung 09
   zweite Iteration):
   - Konsolen-Zeile `SBKIM-SW geladen via importScripts (Variante 3b)`
     (vom Andocker in `app-sw.js` direkt nach `importScripts`-Aufruf
     gesetzt), **nicht** `SBKIM-SW registriert, Scope: …` (das wäre
     Variante 3a und würde den App-SW überschreiben).
   - DevTools → Application → Service Workers zeigt **genau eine**
     Registrierung mit Source = `app-sw.js`, Status "activated and is
     running", Scope = `/<repo>/`.
   - `POST /sbkim/anastomosis` aus einem zweiten Tab liefert 200
     (App-SW lässt durch, weil er für SBKIM-Pfade kein `respondWith`
     aufruft; sbkim-sw.js-Listener antwortet).
   - App-Offline-Pfade des App-SW funktionieren unverändert (z.B.
     bestehender Cache-First-Routing-Code im App-SW wird beim
     Reload-im-Flugmodus weiterhin bedient).

6. **(Nur same-origin Test-Setup)** BroadcastChannel-Bridge-Sichttest
   — wenn zwei SBKIM-PWAs auf derselben Origin laufen (z.B.
   `<user>.github.io/Mein-Rezeptbuch/` + `<user>.github.io/Mein-Mixarium/`
   bei Klaus' aktuellem GitHub-Pages-Setup):
   - **Beide PWA-Tabs offen halten.** Geschlossener Receiver-Tab →
     kein Channel-Listener → Sender-Timeout nach 4 s. Begründung in
     Karte 05 § BroadcastChannel-Bridge § Wer-nicht-da-ist-schweigt.
   - In jedem Tab den **BroadcastChannel-Selbstcheck-Knopf** klicken
     (siehe Panel 05 in `tests/manual_check.html` Knöpfe 9 / 9a / 9b /
     9c im Sage-Protokol-Repo; im Endknoten-Eruda manuell via Console:
     `await SbkimAnastomose.handshake(peerSpore, ownVec, {transport:"channel"})`
     mit der Spore des **anderen** Endknoten-Tabs).
   - **Erwartung im Erfolgsfall:** `outcome:"established"` zurück und
     im DevTools-IndexedDB beider Tabs steht der jeweils andere
     `nodeId` als sibling. Im Log-Store `sbkim_anastomosis_log` eine
     `"established"`-Zeile.
   - **Erwartung im Tab-zu-Standalone-Fall:** Wenn nur ein Tab offen
     ist, läuft der Channel-Pfad in einen `HandshakeTimeoutError`
     (Log `"timeout-channel"`). Das ist kein Bug, sondern die
     dokumentierte „Wer nicht da ist, schweigt"-Disziplin.

---

## Service-Worker-Hinweis

**Pfad-Konvention:**
`<endknoten>/sbkim-sw.js` im Repo-Root, neben `index.html`. Bei
Variante 3a (Schritt 3a) registriert der relative Pfad
`navigator.serviceWorker.register("sbkim-sw.js")` automatisch den
korrekten Scope `/<repo>/` (bei GitHub-Pages-Project-Sites). Bei
Variante 3b (Schritt 3b) liegt zusätzlich `app-sw.js` im Repo-Root,
und `importScripts('./sbkim-sw.js')` zieht den SBKIM-Listener-Code
in den App-SW-Kontext (siehe § Datei-Pfad-Konvention).

**Browser-Voraussetzungen:**
- HTTPS oder `localhost` — Service-Worker funktionieren **nicht** unter
  `file://`. Wer lokal testen will, nutzt `python3 -m http.server` und
  öffnet `http://localhost:8000/<endknoten>/index.html`.
- Browser mit WebCrypto Ed25519 (Chrome ≥ 113, Firefox ≥ 130, Safari
  ≥ 17). Ältere Browser scheitern in Schritt 4 mit
  `CryptoUnavailableError`.

**Lebenszyklus (`SBKIM_SW_STANDALONE`-gesteuert):**
- **Default `SBKIM_SW_STANDALONE = true` (Variante 3a):**
  - `install`: `self.skipWaiting()` — neue SW-Version übernimmt sofort,
    keine Wartephase.
  - `activate`: `self.clients.claim()` — bereits offene Tabs kommen
    sofort unter SW-Kontrolle (sonst erst beim nächsten Reload).
- **`SBKIM_SW_STANDALONE = false` (Variante 3b, App-SW-Koexistenz):**
  - `install` / `activate` rufen weder `skipWaiting` noch
    `clients.claim` — der bestehende App-SW behält die volle
    Lebenszyklus-Steuerung (sein `skipWaiting`/`clients.claim` greifen
    nach wie vor, App-Offline-Cache und Push-Pfade bleiben
    unangetastet). Der Andocker setzt `self.SBKIM_SW_STANDALONE = false`
    in `app-sw.js` **vor** `importScripts('./sbkim-sw.js')`, siehe
    Schritt 3b.
- **`fetch` (beide Varianten gleich):** nur Pfade, die auf
  `/sbkim/anastomosis` oder `/sbkim/legacy` enden, werden abgefangen.
  Andere Anfragen (App-Assets, Bilder, JS) gehen unverändert ans Netz
  bzw. an den App-SW-Listener weiter — der SBKIM-SW ist **kein Cache-
  Layer**.

**fetch-Listener-Reihenfolge (wichtig für Variante 3b):**

- `importScripts` lädt den `fetch`-Listener aus `sbkim-sw.js` **vor**
  den App-SW-`fetch`-Listenern, sofern der `importScripts`-Aufruf in
  `app-sw.js` ganz oben steht (vor den App-SW-`addEventListener('fetch',
  …)`-Zeilen).
- Der Browser ruft `fetch`-Listener **in Registrier-Reihenfolge** auf.
  Der erste Listener, der `event.respondWith()` aufruft, gewinnt — die
  anderen werden für dieses Event übersprungen.
- `sbkim-sw.js` ruft `event.respondWith()` **ausschließlich** für die
  SBKIM-Pfade (`/sbkim/anastomosis`, `/sbkim/legacy`, später ggf.
  `/sbkim/heterokaryosis` für Modul 06) auf. Für jeden anderen Pfad
  fasst sbkim-sw.js das Event **nicht** an, damit der App-SW-Listener
  drankommt und seinen Cache-/Routing-Code anwenden kann. Diese
  Konvention macht App-SW-Koexistenz erst möglich.

**Vertrag (siehe Karte 05 § Service-Worker-Hinweis + INTERFACES.md §3):**
- POST + `Content-Type: application/json` + Body ≤ 64 KiB.
- Andere Methode → 405 (mit `Allow: POST`-Header).
- Falscher Content-Type → 415.
- Body zu groß → 413.
- Kein gültiges JSON → 400.
- Kein aktiver Tab → 503 (Spec: "Wer nicht da ist, schweigt").
- Page antwortet nicht binnen 4 s (`QUERY_TIMEOUT_MS`) → 503.

**Was der SW nicht macht:**
- Keine Krypto, kein State, keine eigene IndexedDB.
- Kein App-Asset-Caching (Offline-Modus ist Sache einer eigenen
  Pflege-Sitzung — die wirft sich nicht mit dem SW von Modul 05).
- Kein Auto-Tab-Öffnen, kein Wake-Lock.
- Kein Replay-Cache (gehört in Modul 11, Schutz-Backlog).

**Update-Verhalten:** Wenn eine neue Version von `sbkim-sw.js`
deployt wird (z.B. nach einem Pflege-Update von Modul 05), übernimmt
sie beim nächsten Reload sofort dank `skipWaiting()`. Klaus kann beim
ersten Reload nach dem Update einen kurzen 503-Spike sehen, wenn ein
fremder Handshake genau in die Übergangs-Sekunde fällt — das ist okay,
der Sender bekommt einen `HandshakeTimeoutError` und re-handshakt
beim nächsten Klick automatisch idempotent.

---

## Nach dem Einbau zu pflegen

- **`docs/PULS.md` im Sage-Protokol-Repo:** Endknoten-Tabelle
  aktualisieren ("integriert: ja, Stand 2026-MM-DD").
- **`status.json` im Sage-Protokol-Repo:** `endknoten[].integrated →
  true`, `url` füllen.
- **Bei Domain- oder Domänenwechsel:** Spore neu generieren (Schritt
  5–6 wiederholen mit neuen Werten) und neu deployen (Schritt 7).
  Identität (`nodeId`, `publicKey`) bleibt — nur die Meta-Felder ändern
  sich.
- **Bei Protokoll-Versions-Update im Sage-Protokol-Repo:** Endknoten
  nachziehen, indem die fünf Modul-Dateien + `sbkim-sw.js` erneut
  kopiert werden. Wenn der Sprung von Nebenversion (z.B. `0.1 → 0.2`)
  bleibt, ist das kompatibel — Spore muss nicht neu deployt werden.
  Bei Hauptversionssprung (`0.x → 1.0`) ist die alte Spore inkompatibel;
  Schritte 5–7 neu durchlaufen.
- **Bei Schlüsselverlust:** der private Key liegt in der Browser-
  IndexedDB des Andockers. Wird die geleert (manuell, durch
  Browser-Cleanup, Inkognito), ist die Identität tot. Eine
  Neuerzeugung mit Schritten 4–7 ergibt eine **neue** Identität —
  andere Knoten sehen den Endknoten als anderen Knoten. Backup gibt
  es nicht (Modul 02 Spec, bewusst). Wer das nicht will, betreibt
  Hardware-Schlüssel-Backup außerhalb des Browsers — nicht Teil
  dieses Protokolls.

---

## Was nicht in den Endknoten gehört

- **Keine Test-Knöpfe** aus `tests/manual_check.html` in die
  Produktiv-App übernehmen — die gehören ins Sage-Protokol-Repo.
- **Keine `console.info`-Logs** für jeden Match-Treffer im Betrieb.
  Selbstcheck-Zeilen beim Modul-Laden sind okay (einmalig pro
  PWA-Start), `info`-Logs für jede Anastomose nicht. Nur Fehler
  loggen.
- **Kein Auto-Reveal der Doku** — die 5-Klick-Geste aus Modul 00 ist
  Pflicht (sobald Modul 00 spezifiziert ist).
- **Kein periodischer Hintergrund-Ping** — keine Pulsation, keine
  Heartbeat-Anastomosen, keine Eigenanfragen ins offene Netz. Der
  Endknoten ist im Empfangsmodus mit Antwortrecht.
- **Kein Crawler** über `sbkim_siblings`-Liste fremder Knoten — Modul
  05 listet nur **eigene** Geschwister, nicht die der Peers.
- **Kein Singleton-Bruch** — Modul 02 unterstützt keine Multi-
  Identität (`"main"` ist Pflicht-Schlüssel). Wer eine zweite
  Identität braucht, legt eine zweite PWA an.

---

## Risiken & offene Punkte

### `domainVector`-Pflicht-Frage — Entscheidung dieser Sitzung

Die Spec-Sitzung 05 (2026-05-14) hatte die Frage offen gelassen:
`domainVector` in der Spore — **optional** (aktueller Stand §2) oder
**Pflicht** mit Hauptversions-Sprung `0.1 → 1.0`?

**Entscheidung dieser Sitzung: Variante A · Soft-Pflicht im Andock-
Workflow.** `domainVector` bleibt im Spore-Schema (§2 INTERFACES)
*optional* — kein Hauptversions-Sprung. Karte 09 macht es im Andock-
Workflow zur **verbindlichen Pflicht**: Schritt 5–7 erzeugen,
einbauen und deployen den Vektor. Wer die Anleitung befolgt, hat ihn.

**Begründung:**

1. **Klaus' Netz ist klein** (drei Nutzer, zwei Endknoten, beide vom
   selben Betreiber). Ein Hauptversions-Sprung `0.1 → 1.0` zieht §0,
   §2, §4, Modul 02 (`generateOwnSpore`/`validateSporeMeta`), Karte 02
   und `status.json.config.PROTOCOL_VERSION` nach — fünf Stellen,
   eine Folge-Pflege-Sitzung. Das ist *asymmetrisch teuer* für ein
   Risiko, das in der Praxis kein zweiter Andocker noch verursacht
   hat. Karte 09 ist neu und die *eine* Stelle, die der Andocker
   garantiert liest — Soft-Pflicht hier ist 100% wirksam, sofern die
   Anleitung befolgt wird.
2. **Modul 05 lehnt schon korrekt ab.** Wer trotzdem eine Spore ohne
   `domainVector` deployt, bekommt vom Empfänger
   `outcome:"rejected", reason:"kein domainVector verfügbar"` —
   Spec-konform, Schaden bleibt am Verursacher. Das ist nicht
   stillschweigender Fehler-Modus, sondern lautes "fehlt".
3. **`protocolVersion: "0.x"` bedeutet "Erprobungs-Modus"** (§4
   INTERFACES). Der natürliche Anlass für einen Sprung auf `1.0` ist
   nicht jetzt, sondern wenn ein **zweiter Betreiber** andockt oder
   ein nicht-aktualisierter Endknoten dauerhaft im Netz hängt —
   beides aktuell nicht. Bis dahin sind alle Spores im Netz von Klaus,
   und Klaus folgt der Anleitung.
4. **Variante B macht alle bestehenden Spores inkompatibel** — auch
   die provisorischen aus Karte 10 (Live-Generator der Sage-Page,
   die `domainVector` noch nicht setzt). Variante A bricht nichts.
5. **Folgesitzung möglich.** Wenn das Netz wächst (drei+ Betreiber,
   Endknoten, die nicht von Klaus stammen), kann die Pflicht-Hebung
   später noch in einer eigenen Pflege-Sitzung „Hauptversions-Sprung
   0.1 → 1.0" sauber durchgezogen werden — mit Migrations-Plan,
   `verifyForeignSpore`-Update, Karte-02-Nachzieher und der
   `domainVector`-Pflicht im Schema. Diese Sitzung schließt diese
   Folgesitzung als Option *nicht* aus; sie schiebt sie nur auf, bis
   das Netz die Investition rechtfertigt.

**Konsequenz für die Implementierung:** Karte 09 Schritte 5–7 sind
**verbindliche Pflicht**. Modul 02 (`generateOwnSpore`) ändert sich
**nicht** (validateSporeMeta-Pfad bleibt wie er ist). Modul 05
(`receiveHandshake`) lehnt weiterhin korrekt ab — auch das bleibt
unverändert.

### Weitere Risiken

- **CORS bei fremden-Origin-fetch.** Bei Cross-Repo-Zugriff zwischen
  Endknoten desselben Betreibers (z.B. Rezeptbuch ↔ Mixarium beide
  unter `klaus.github.io`) ist der Origin gleich — kein CORS-Problem.
  Bei echten fremden Origins (anderer GitHub-Account, eigene Domain)
  muss der Empfänger CORS-Header liefern; GitHub Pages tut das nicht
  automatisch. Konsequenz: erst-Spec-konformes Andocken funktioniert
  **innerhalb eines Betreibers**; cross-Betreiber-Anastomose braucht
  eine Folge-Pflege-Sitzung mit CORS-Pfad (oder ein Proxy).

- **Service-Worker-Scope-Falle.** Wer den SW unter
  `<endknoten>/sbkim/sbkim-sw.js` deployt statt im Repo-Root,
  bekommt Scope `/<repo>/sbkim/` — Anastomose funktioniert dort noch,
  aber spätere Schutz-Module (11 Rate-Limit, 12 Blocklist) können
  Pfade unterhalb von `/<repo>/` ohne `/sbkim/`-Präfix nicht
  abfangen. **Konvention dieser Karte: SW immer im Repo-Root.**
  Wer es trotzdem anders macht, hat ein latentes Blocker-Risiko bei
  späterem Modul-Einbau.

- **App-SW-Überschreibung.** Schritt 3 (vor Pflege App-SW-Koexistenz
  2026-05-15: unkonditional `register('sbkim-sw.js')`) ersetzt einen
  bestehenden App-SW im selben Scope, weil `sbkim-sw.js` historisch
  `skipWaiting`/`clients.claim` unconditional gerufen hat. Folge: der
  App-SW eines Endknotens mit Offline-Cache und/oder Push-Pfaden
  verschwindet beim ersten Andock-Versuch **stillschweigend** — Klaus
  bemerkt es erst, wenn die App offline nicht mehr lädt oder Push-
  Benachrichtigungen ausbleiben. **Erkennung:** DevTools → Application
  → Service Workers zeigt nach dem Andock `sbkim-sw.js` als aktiven
  Worker (statt `app-sw.js`); in der Konsole steht
  `SBKIM-SW registriert, Scope: /<repo>/` — aber die `app-sw.js`-
  Selbstcheck-Zeile fehlt. **Lösung:** Variante 3b
  (`importScripts('./sbkim-sw.js')` im bestehenden App-SW) plus
  `self.SBKIM_SW_STANDALONE = false` davor. `sbkim-sw.js` ist seit
  Pflege App-SW-Koexistenz so geschrieben, dass `skipWaiting` /
  `clients.claim` nur unter `SBKIM_SW_STANDALONE === true` (Default)
  greifen — Variante 3b setzt das Flag auf `false`, der App-SW behält
  seinen Lebenszyklus. **Konvention:** vor Schritt 3 **immer** den
  Pre-Flight-Check
  (`navigator.serviceWorker.getRegistration('./')`) laufen lassen; bei
  vorhandenem aktiven App-SW **immer** Variante 3b. Variante 3a darf
  nur laufen, wenn der Pre-Flight-Check `null` (oder eine inaktive
  Registrierung) liefert.

- **Embedding-Modell-Lade-Zeit beim ersten Andock.** Modul 03 lädt
  `Xenova/multilingual-e5-small` einmalig pro Browser-Profil
  (~30 MB, transformers.js-CDN). Das dauert je nach Verbindung
  10–60 Sekunden. **UX-Hinweis im Andocker-Workflow:** vor Schritt 5
  einen sichtbaren "lade Embedding-Modell, einmalig …"-Status zeigen.
  Spätere Aufrufe der PWA nutzen den Browser-Cache und sind
  sub-Sekunde.

- **Spore-Drift bei Domänen-Wandel.** Wenn die Endknoten-Domäne sich
  ändert (Klaus erweitert Rezeptbuch um vegane Rezepte, der bisherige
  Domain-Vektor passt nicht mehr), muss Schritt 5–7 wiederholt werden:
  neue Stichwörter → neuer `domainVector` → neue Spore generieren →
  neu deployen. **Identität bleibt** (gleicher private Key, gleiche
  `nodeId`, gleicher Public Key) — andere Knoten erkennen weiterhin
  „derselbe Knoten, neue Domäne". Bestehende Geschwister-Einträge
  bleiben gültig, aber bei der nächsten erfolgreichen Anastomose wird
  der `since`-Wert nicht überschrieben (Reentry-Idempotenz). Wer
  völlig neu starten will, muss IndexedDB leeren — neuer Knoten,
  alte Geschwister vergessen.

- **Eingebauter `domainVector` ist nicht aktualisierbar ohne Re-Deploy.**
  Modul 05 liest den `domainVector` ausschließlich aus der **statisch
  deployten** Spore (`/sbkim/spore.json`) oder aus der `senderSpore` im
  HandshakeRequest. Eine Live-Modifikation des Vektors im Endknoten-
  IndexedDB ohne Re-Deploy hat keinen Effekt auf eingehende
  Handshakes — der Service-Worker liefert die deployte Spore-Datei aus.
  Konsequenz: jeder Schritt-5-Re-Run zieht einen Schritt-7-Re-Deploy
  nach.

- **`endpointPaths`-Override im Spore-Schema.** §2 INTERFACES erlaubt
  ein optionales Feld `endpointPaths`, mit dem ein Endknoten von den
  §3-Default-Pfaden abweichen kann (z.B. wenn der Hoster `/sbkim/`
  blockiert). Diese Anleitung nutzt das **nicht** — beide Endknoten
  von Klaus folgen den Standard-Pfaden. Wer das Override braucht,
  ist ein Sonderfall für eine eigene Pflege-Sitzung.

- **Lücke 01–05 ohne Andock-Blocker:** beim Durchgehen der Code-
  Module wurde **keine fehlende Helfer-Funktion** identifiziert, die
  einen Andocker blockieren würde. Alle benötigten Surface-Einträge
  sind exportiert: `SbkimStorage.{init, get, put, del, all}`,
  `SbkimSpore.{init, getOrCreateIdentity, getNodeId, getPublicKeyJwk,
  generateOwnSpore, getOwnSpore, verifyForeignSpore}`,
  `SbkimEmbedding.{init, isReady, embedQuery, embedPassage}`,
  `SbkimMatch.{match, isAboveProviderThreshold, PROVIDER_MIN_MATCH}`,
  `SbkimAnastomose.{init, handshake, receiveHandshake, listSiblings,
  forgetSibling}`. Die in Modul 05 als inoffiziell markierten
  Test-Brücken (`_invokeDirect`, `_buildSignedRequest`,
  `_verifyResponseSignature`, `_setOwnDomainVector`) **gehören
  nicht** in den Produktiv-Andock-Workflow — sie sind für `tests/
  manual_check.html` Panel 05 und dürfen im Endknoten ignoriert
  werden.

- **`forgetSibling` als manuelle Operation.** Wenn ein Geschwister
  dauerhaft inaktiv wird (Tab dauerhaft zu, App stillgelegt), bleibt
  es bis zu einem manuellen `await SbkimAnastomose.forgetSibling(
  nodeId)` in `sbkim_siblings`. Modul 05 vergisst von selbst nicht
  (TTL ist Aufgabe von **Modul 07 Apoptose**, sobald spezifiziert).
  Der Andocker sollte dem Betreiber einen UI-Pfad anbieten, um
  forgetSibling auszulösen — oder bewusst auf Modul 07 warten. Bis
  dahin: manuelle DevTools-Konsolen-Operation.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Site-Echo | 2026-05-10 | Site-Echo | Hero, Bio-Metapher, Schritt-Flow, Querverweise |
| Spec gefüllt | 2026-05-14 | Spec 09 | Acht-Schritt-Andock-Pfad mit konkreten Konsolen-Befehlen, Datei-Pfad-Konvention (SW im Repo-Root, JS-Module inline oder `sbkim/`), Spore-Endpunkt `/sbkim/spore.json` (Alias verbindlich), SW-Scope-Falle dokumentiert, Sichtkontrolle (3 Pflicht-Punkte: Konsolen-Selbstchecks · IndexedDB-Stores · live-Spore-URL), Service-Worker-Hinweis mit Lebenszyklus, Risiken-Block (CORS · Scope-Falle · 30 MB Modell · Spore-Drift · domainVector-Live-Update · Lücke-Befund · forgetSibling), `domainVector`-Pflicht-Frage **entschieden Variante A (Soft-Pflicht im Andock-Workflow, kein Hauptversions-Sprung)** mit fünf Begründungen |
| Pflege Schritt 9 + 07/00 | 2026-05-15 | Pflege 09-Schritt-9-Doku-TTL | Karte 09 § Andock-Schritt-Pfad von **acht** auf **neun** Schritte erweitert. Schritt 2 (`<script>`-Tags) zieht Modul 07 (Apoptose) und Modul 00 (Doku-Fenster) in der verbindlichen Reihenfolge nach (`01 → 02 → 03 → 04 → 05 → 07 → 00`); Sichtkontroll-Block in Schritt 2 zeigt jetzt sechs Selbstcheck-Zeilen statt vier (03 weiterhin nach `init()`). **Neuer Schritt 9 „Apoptose + Doku-Fenster scharf schalten"** mit drei Sub-Punkten: 9a `await SbkimApoptose.init()` (Vermächtnis-Empfang über MessageChannel-Listener auf Service-Worker), 9b `await SbkimDoku.init({searchIconSelector:"#search-icon"})` (5-Klick-Geste am PWA-Such-Symbol; per Endknoten anpassen), 9c (optional, empfohlen) `await SbkimApoptose.forgetExpiredSiblings(SIBLING_MAX_AGE_MS)` als Andocker-Automatik nach jedem Handshake — schließt offene Frage aus Spec-Sitzung 07 (Karte 09 Schritt 9 TTL-Sweep-Aufruf). Sichtkontroll-Block § Sichtkontrolle nachgezogen: jetzt vier Pflicht-Punkte (statt drei) — sieben Selbstcheck-Zeilen in DevTools-Konsole + sechs IndexedDB-Stores (mit `sbkim_doku_meta["meta"]` schon nach Schritt 9 gefüllt) + zwei live-Endpunkte (`/sbkim/spore.json` GET 200 + `/sbkim/anastomosis` und neu `/sbkim/legacy` GET 405) + 5-Klick-Geste am Such-Symbol öffnet das Modal. Zwei „Häufiger Fehler"-Diagnosen in Schritt 9 (searchIconSelector matcht nichts → MutationObserver-Re-Mount mit 10s-Safety; TTL-Sweep nie gerufen → stille Geschwister bleiben in `sbkim_siblings`). Visualisierungs-Mermaid-Flowchart von acht auf neun Knoten erweitert (A1–A9). Karte 09 § Datei-Pfad-Konvention von „fünf JS-Module" auf „sieben JS-Module" nachgezogen. Karte 09 § Verantwortlichkeiten Macht-Block ergänzt um Modul 07 + 00 mit Hinweis „Modul 00 zuletzt, fail-soft als optionale Lese-Quellen". Self-Apoptose-Knopf bewusst NICHT in Schritt 9 — Karte 07 hat ihn als zweistufig+irreversibel spezifiziert, gehört in einen separaten Service-Pfad. Modul 06 Heterokaryose ebenfalls bewusst NICHT in Schritt 9 (Karte 06 ist Schablone, Spec späte Phase). INTERFACES.md §6 Änderungsprotokoll-Zeile (neueste unten); Karte 09 status.json unverändert (bleibt `score:"spec"` / `siegel:"Spec fertig"` — die Erweiterung ist additiv im Andock-Pfad, kein Modul-Bau). |
| Pflege App-SW-Koexistenz + Tablet-Sichtkontrolle (Eruda) | 2026-05-15 | Pflege 09-App-SW-Koexistenz-Tablet | Drei Stränge ergänzt, **kein Modul-Eingriff**: (1) **§ Datei-Pfad-Konvention** um **dritte Variante 3c** (SBKIM-SW unter `sbkim/sbkim-sw.js` mit Scope `/<repo>/sbkim/`) als nachrangige Übergangslösung erweitert; neue Tabelle „Wann welche Variante?" mit drei Zeilen (Pre-Flight-Ergebnis → Eigenschaften → Empfehlung-Stern bei 3a/3b, β-Hinweis bei 3c). (2) **§ Schritt 3c** als neuer Sub-Block nach 3b: Code-Block (`register("sbkim/sbkim-sw.js", { scope: "sbkim/" })`), Vor-/Nachteil-Vergleich (App-SW unangetastet ↔ Schutz-Module 11/12 später blockiert), Sichtkontrolle-Hinweis (zwei SW-Registrierungen mit disjunkten Scopes), expliziter „nur Übergangslösung"-Vermerk inkl. späterer Migrations-Pflicht auf 3b. (3) **§ Sichtkontrolle § Tablet-Variante (Eruda)** als neuer Sub-Block nach den vier Pflicht-Punkten: Eruda-Script-Tag `eruda@3` gepinnt (CDN jsdelivr, SRI nicht erforderlich, Sichttest-Modus); Mapping der vier Pflicht-Punkte auf Eruda-Tabs (Console / Resources→IndexedDB / Network / 5-Klick-Geste); Verbot „nach Sichtkontrolle wieder entfernen — kein Produktiv-Einbau, kein SBKIM-Modul, kein Datenschutz-Stein". Pre-Flight-Check, `SBKIM_SW_STANDALONE`-Flag und `src/sbkim-sw.js` aus Pflege App-SW-Koexistenz **unverändert** (PR #31 funktional korrekt). **Keine Code-Änderung an Modulen 00/01/02/03/04/05/07.** **Keine Änderung an `docs/INTERFACES.md`** (Karte 09 ist Anleitung, kein Modul-Vertrag — §1/§3/§6 unverändert). **`status.json` Modul 09 unverändert** (bleibt `score:"spec"` / `siegel:"Spec fertig"`, Pie nicht regeneriert — die Pflege ist additiv im Andock-Pfad, kein Modul-Bau, kein Score-Wechsel). **Schließt die zwei Karten-Lücken aus der abgebrochenen Bau-Sitzung 09 vom 2026-05-15** und entblockt die zweite Bau-Iteration mit Klaus am Live-Andock. |
| Pflege App-SW-Koexistenz | 2026-05-15 | Pflege 09-App-SW-Koexistenz | Karte 09 § Andock-Schritt-Pfad **Schritt 3 in 3a/3b aufgesplittet** plus neuer **Pre-Flight-Check** als Einleitungs-Block (`navigator.serviceWorker.getRegistration('./')` — Verzweigungs-Ergebnis ist die Auswahl 3a oder 3b). **Variante 3a (PWA ohne eigenen SW):** unverändert bisheriges Schritt-3-Verhalten (`register('sbkim-sw.js')` + Konsolen-Zeile `SBKIM-SW registriert, Scope: …`). **Variante 3b (PWA mit eigenem App-SW):** Endknoten setzt in `app-sw.js` ganz oben `self.SBKIM_SW_STANDALONE = false; importScripts('./sbkim-sw.js');` — **kein** zweiter `register`-Aufruf, der bestehende `register('./app-sw.js')` reicht. Konsolen-Zeile `SBKIM-SW geladen via importScripts (Variante 3b)`, DevTools zeigt **eine** Registrierung (App-SW), nicht zwei. **Achtes Risiko „App-SW-Überschreibung"** in § Risiken & offene Punkte ergänzt: Beschreibung (Schritt-3-`register` ersetzt bestehenden App-SW im selben Scope wegen unbedingtem `skipWaiting`/`clients.claim` in `sbkim-sw.js`), Erkennung (DevTools zeigt `sbkim-sw.js` statt `app-sw.js` als aktiven Worker), Lösung (Variante 3b + `SBKIM_SW_STANDALONE=false`), Konvention (Pre-Flight-Check vor Schritt 3 ist Pflicht). **§ Service-Worker-Hinweis** `install`/`activate`-Vertragsblock erweitert — `skipWaiting`/`clients.claim` jetzt unter `SBKIM_SW_STANDALONE`-Schalter (Default `true` → Variante 3a bisher; `false` → Variante 3b lässt App-SW seinen Lebenszyklus); fetch-Listener-Reihenfolge dokumentiert (Browser ruft Listener in Registrier-Reihenfolge, erster `respondWith` gewinnt — sbkim-sw.js fasst nur `/sbkim/*`-Pfade an, alle anderen Events fallen an den App-SW-Listener durch). **§ Datei-Pfad-Konvention** um optionalen Block `app-sw.js` im Repo-Root ergänzt (sauberer relativer `importScripts('./sbkim-sw.js')`-Pfad nur dann garantiert). **§ Sichtkontrolle nach dem Andocken** um fünften (variantenspezifischen) Pflicht-Punkt erweitert: Variante-3b-Zwei-Browser-Test (eine Registrierung im DevTools, Konsolen-Zeile, `POST /sbkim/anastomosis` liefert 200, App-Offline-Pfade unverändert) — wartet auf Klaus' nächsten Live-Andock-Versuch. **`src/sbkim-sw.js` umgebaut** — `SBKIM_SW_STANDALONE`-Flag am Modul-Anfang (Default `true`, rückwärtskompatibel); `install`/`activate`-Handler rufen `skipWaiting`/`clients.claim` nur unter `SBKIM_SW_STANDALONE === true`; fetch-Listener-Pfad für `/sbkim/anastomosis` und `/sbkim/legacy` unverändert; Header-Kommentar erweitert um beide Lade-Pfade. **INTERFACES.md §6** Änderungsprotokoll-Zeile am unteren Ende (neueste unten, Konventions-Stil); keine §1-Vertragsänderung (das Flag ist SW-intern, kein öffentlicher Funktions-Export wandert). **Keine Code-Änderung an Modulen 00/01/02/03/04/05/07** (deren Code unverändert). **`status.json` Modul 09 unverändert** (bleibt `score:"spec"` / `siegel:"Spec fertig"`, Pie nicht regeneriert — die Pflege ist additiv im Andock-Pfad, kein Modul-Bau, kein Score-Wechsel). |
| Pflege PWA-Suffix | 2026-05-16 | Pflege PWA-Suffix Karten 01+09 | Folge-Pflege nach Live-Andock-Sitzung 2026-05-16 (Mein-Mixarium + Mein-Rezeptbuch live SBKIM-integriert, aber identische `nodeId` wegen IndexedDB-Origin-Kollision auf GitHub-Pages-Project-Sites — beide Endknoten unter `lausiklauskn-png.github.io`, IndexedDB ist im Browser pro Origin, nicht pro Pfad). **§ Vor dem Einbau zu klärende Werte** um neue Zeile `<DB_SUFFIX>` erweitert (Beispielwerte: `rezeptbuch` / `mixarium`); Erklärungs-Block direkt darunter zur IndexedDB-Origin-Kollision und zur Default-Variante (ohne Suffix, eine PWA pro Origin). **§ Schritt 4** umbenannt von „`SbkimAnastomose.init()`" auf „`SbkimStorage.init({dbSuffix})` + `SbkimAnastomose.init()`", Code-Block jetzt mit zwei sequenziellen `await`-Aufrufen (Storage zuerst mit `dbSuffix`, dann Anastomose); neue Erklärungs-Absätze („Warum zwei Aufrufe statt einem?" und Sichtkontrolle-Hinweis auf DB-Namen `sbkim_<DB_SUFFIX>`); „Häufiger Fehler"-Block um `InvalidDbSuffixError` ergänzt. Begründung: Modul 01 ist die einzige Stelle, die den DB-Namen kennt — wer Suffix setzen will, muss `SbkimStorage.init` ZUERST aufrufen; Idempotenz garantiert, dass der interne `Storage.init()`-Aufruf in `SbkimAnastomose.init` dasselbe `dbPromise` benutzt. **Modul 05 bleibt unangetastet** (`SbkimAnastomose.init()` weiterhin ohne Optionen — keine Vertrags-Ausweitung in INTERFACES.md §1 Modul 05). **Keine Hauptversions-Erhöhung** (`PROTOCOL_VERSION` bleibt `"0.1"`). Hinweis für Klaus' Re-Andock: in beiden Endknoten-Repos muss `sbkim-init.js` um den `SbkimStorage.init({dbSuffix:…})`-Aufruf erweitert werden (vor dem bestehenden `SbkimAnastomose.init`), DANN `__sbkimErzeugeSpore` neu triggern — neue nodeIds entstehen pro PWA, alte Pages-Spores werden überschrieben. |
| **Sage als dritter Endknoten bau-fertig** (Sichttest ungeprüft) | 2026-05-21 | Bau Sage-Page-Refactor | Sage-Page selbst befolgt jetzt Karte 09 als dritter Endknoten neben Rezeptbuch + Mixarium. **Sechs Eingriffe nur in `index.html` und neuen Sage-Page-Root-Dateien, KEIN `src/modules/*.js`-Eingriff, KEIN Spec-Eingriff:** (a) `sbkim-sw.js` als Kopie von `src/sbkim-sw.js` im Sage-Page-Repo-Root angelegt (Variante 3a aus § Schritt 3 — Sage-Page hat keinen App-SW; bei Pflege-Sitzungen, die `src/sbkim-sw.js` ändern, ist diese Kopie nachzuziehen — Cache-Bust via File-Rename oder `CACHE_NAME`-Bump bei künftigen Bumps). (b) Neun `<script>`-Tags in `index.html` vor `</body>` (alle Module 00–08 inkl. 03, das als lazy-Modul nur seinen Selbstcheck nach `init()` emittiert; Reihenfolge analog Karte 09 § Schritt 2 mit 00 zuerst wegen Closure-Reihenfolge und 08 als letztes Modul vor `sbkim-init.js`). (c) Neue Datei `sbkim-init.js` im Sage-Page-Repo-Root: ruft `SbkimStorage.init({dbSuffix:"sage"})` → 02 → 05 → 06 → 07 → 08 → 00; fail-soft pro Modul mit `console.warn` (Sage-Page bleibt als Doku-Hub ladbar bei einzelnem Modul-Bruch — Klaus' Doku-Hub-Bedürfnis); registriert `sbkim-sw.js` als Service-Worker am Ende; Custom-Event `sbkim-sage-ready` für die Andock-Wizard-Logik. (d) `sbkim/spore.json` als statisches **Skeleton** committet (`id/publicKey/domainVector/signature/createdAt: null` als Slot bis Klaus' erstem Browser-Sichttest; `domain`/`domainDescription`/`domainKeywords`/`stammCategories`/`guestCategories`/`endpoint`/`nodeType` befüllt aus INTERFACES § 6 Tabellen). Vollständige signierte Spore kommt nach Klaus' Andock-Wizard-Lauf als Download — Klaus committet sie dann manuell hierhin (Stolperfalle 3 Brief: Origin-Limitierung, keine Laufzeit-Schreibung in `sbkim/spore.json`). (e) **Andock-Wizard-Modal** als zusätzlicher Pfad auf der bestehenden Schwarz-Loch-Karte: Klick auf die Karte öffnet beim ersten Mal (falls keine Identität existiert) den Wizard — drei Schritte (Identität via `getOrCreateIdentity`, Spore-Erzeugung mit lazy Modul-03-Init + `embedPassage` + `generateOwnSpore` + Spore-JSON-Download, Backup via `exportBackup(passwordPrompt)`) plus Identitäts-Wechsler (`listIdentities` + `setActiveIdentity` Dropdown); Folge-Klicks öffnen wie zuvor den Browser-Observatorium-Screen (`goScreen('observatorium')`). Variante III-Vollwizard aus Vision-Anker 2 ist NICHT Gegenstand — hier nur Sage-spezifische Mini-Geste. (f) **Schichten-Lampen** an jeder Modul-Bento-Zeile (Karte „Module · Schnellübersicht"): drei kleine LED-Dots (Spec / Code / Sichttest), Farbe aus `status.json § modules[i].score`, Tooltip mit `siegel`-Feld; eigener `fetch('./status.json')` + MutationObserver-Hook auf `#module-list` (kein Eingriff in die bestehende `renderModuleList`-Closure). **Zwei UI-Texte aus Vor-V1-Zeit korrigiert** („Hub · kein Endknoten" → „Hub · und Knoten zugleich" und „Sage ist kein Endknoten — nur Vermittlungsstelle" → „Sage selbst ist seit V1-Sage-Hybrid der dritte Knoten") — Reflektion der bereits in INTERFACES § 6 verbindlich verankerten Spec, kein neuer Spec-Eingriff. **`status.json § endknoten[sage]`** auf `integratedAt: "2026-05-21"` und `pingStatus: "pending-first-sichttest"` (neuer Zwischen-Zustand zwischen `pending-first-andock` und `live`) gesetzt; `nodeId: null` bleibt bis zu Klaus' Browser-Sichttest. **`PROTOCOL_VERSION` / `DB_VERSION` / `BACKUP_FORMAT_VERSION` unverändert.** **Sichttest ungeprüft** — wartet auf Klaus' Browser-Lauf mit Service-Worker-Cleanup (Stolperfalle 1 Brief), Andock-Wizard-Durchklick, Spore-Erzeugung und Backup. |
| Werte für Rezeptbuch eingetragen | — | — | TBD — Klaus trägt nach |
| Werte für Mixarium eingetragen | — | — | TBD — Klaus trägt nach |
| Erstmaliger Einbau Rezeptbuch | — | — | — |
| Erstmaliger Einbau Mixarium | — | — | — |

---

**Querverweise**

- **Abhängigkeiten (Bau-DAG):** keine — Karte 09 hängt formal an gar
  nichts und ist auch von gar nichts abhängig. Inhaltlich ist sie die
  Bündel-Anleitung für 01/02/03/04/05 + den Service-Worker.
- **Wird genutzt von:** Endknoten-Repos (Rezeptbuch, Mixarium) — nicht
  intern im Sage-Protokol-Repo. Auch von Modul 07 (Apoptose),
  sobald spezifiziert — Vermächtnis-Deploy folgt einem ähnlichen
  Schritt-Pfad wie Spore-Deploy.
- **Setzt voraus (inhaltlich):**
  [Modul 01 Storage](01_storage.md) ·
  [Modul 02 Spore](02_spore.md) ·
  [Modul 03 Embedding](03_embedding.md) ·
  [Modul 04 Match](04_match.md) ·
  [Modul 05 Anastomose](05_anastomose.md) ·
  Service-Worker `src/sbkim-sw.js`
- **Verwandt:** [Modul 00 Doku-Fenster](00_doku_fenster.md) — wird im
  Endknoten als 5-Klick-Status-Anzeige eingebaut, sobald spezifiziert ·
  [Modul 07 Apoptose](07_apoptose.md) — Selbstlöschung und Vermächtnis-
  Deploy als spätere Erweiterung des Andock-Workflows
- **Site-Karte:** [Karte 4 · Module-Bento](../../index.html#screen-overview),
  Eintrag 09 · [Karte 10 · Andocken](../../index.html#screen-overview)
  (Live-Generator, provisorisch ohne `domainVector`)
- **Glossar:** [Endknoten](../GLOSSAR.md), [Hub](../GLOSSAR.md),
  [Andocken](../GLOSSAR.md), [smartSearch](../GLOSSAR.md),
  [Singleton-Identität](../GLOSSAR.md)
- **Integration:** `sbkim_integration.md` (Originalleitfaden — diese
  Karte ist sein lebender Nachfolger, abgestimmt auf den Reifezustand
  des Repos)
- **Schnittstellen:** [`INTERFACES.md` §0 Konstanten](../INTERFACES.md),
  [`§1 Modul 02_spore / 03_embedding / 05_anastomose`](../INTERFACES.md),
  [`§2 Spore-JSON`](../INTERFACES.md),
  [`§3 Endpunkt-Pfade`](../INTERFACES.md),
  [`§4 Versionierungs-Regeln`](../INTERFACES.md)
