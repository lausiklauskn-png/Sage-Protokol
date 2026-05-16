# Übergabeprotokoll · 2026-05-16 · Bau-Sitzung 09 Iteration 3 — Mein-Rezeptbuch live + Architektur-Lücke entdeckt

**Sitzungs-Rolle:** Bau-Sitzung Modul 09 (Live-Andock-Versuch, dritte
Iteration, zweiter Endknoten — Mein-Rezeptbuch), mit Klaus am Tablet
via Termux, **nicht headless**. Direkt nach Mein-Mixarium-Andock in
derselben Klaus-Sitzung.

**Branch:** `claude/andock-mein-rezeptbuch-iteration-3-live`

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §D
(Einbau-Sitzung) — gleicher Stil wie das Mixarium-Übergabeprotokoll
vom selben Tag. Zusätzlich: **Architektur-Lücke** wurde während der
Sitzung sichtbar (IndexedDB-Origin-Kollision bei Pages-Project-Sites)
— diese Sitzung dokumentiert sie als offene Frage und schlägt
Fix-Optionen vor, **fixt sie aber nicht** (Folge-Pflege-Sitzung).

**Modul:** 09 (Andock-Anleitung; Sage-Protokol-seitig nur Beobachter)
+ Schreib-Pflege in `status.json`, PULS, und neue Querschnitts-Frage.

---

## Auftrag

Klaus hatte in der vorherigen Sitzung Mein-Mixarium live integriert
(Übergabeprotokoll `2026-05-16_andock-mein-mixarium-iteration-3-
live.md`). Mein-Rezeptbuch war noch offen. Klaus hat in derselben
Klaus-Sitzung („Stunde 2") direkt weitergemacht. Plan-Plan war
~30–45 Min für Rezeptbuch, dann Schluss.

---

## Was getan wurde

### 1. Sage-Protokol-Klon aktualisiert + Module kopiert

```bash
cd ~/Sage-Protokol && git pull        # zog PR #47 (Stamm/Gast-
                                       # Durchreichung in 02_spore.js)
                                       # und PR #48 (Mixarium-Andock-
                                       # Doku) nach
cd ~
mkdir -p ~/Mein-Rezeptbuch/sbkim
cp ~/Sage-Protokol/src/modules/{00_doku_fenster,01_storage,02_spore,03_embedding,04_match,05_anastomose,07_apoptose}.js ~/Mein-Rezeptbuch/sbkim/
cp ~/Sage-Protokol/src/sbkim-sw.js ~/Mein-Rezeptbuch/
```

Sieben Modul-Files im `~/Mein-Rezeptbuch/sbkim/`-Unterordner +
`sbkim-sw.js` im Repo-Root.

### 2. Schritte 2–4 (Script-Tags, App-SW, sbkim-init.js)

Analog zu Mixarium. awk vor letztem `</body>`, printf+cat oben in
`app-sw.js`, Heredoc für `sbkim-init.js`, awk für 8. Tag.

**Rezeptbuch-spezifische Werte in `sbkim-init.js`:**

```js
stammCategories = ["Vorspeisen", "Suppen", "Fleisch", "Fisch",
                   "Vegetarisch", "Kuchen", "Desserts"];   // 7
guestCategories = ["Getränke", "Smoothies & Shakes", "Mocktails",
                   "Alkfr. Cocktails", "Limonaden", "Tees & Kaffees",
                   "Cocktails", "Bowlen", "Sirup & Basis",
                   "Knabbereien", "Fingerfood"];           // 11
domainKeywords  = ["Rezept", "Kochen", "Essen", "Hauptgang",
                   "Beilage", "Backen", "Saucen"];         // 7
domain          = "lausiklauskn-png.github.io"
endpoint        = "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/"
nodeName        = "Rezeptbuch Klaus"
domainDescription = "Klaus Rezeptbuch - Hausgemachte Kochrezepte
                     vom Hefeteig bis zur Sauce, plus Begleitgetränke
                     und Knabbereien als Ueberraschungs-Plus."
```

**Hintergrund Stamm/Gast-Verteilung:** Klaus hatte vor der Sitzung
Screenshots seines Rezeptbuch geschickt — alle 18 Ordner. Stamm =
die 7 Speisen-Ordner (Kerngebiet „Essen"). Gast = die 11 Drinks-/
Snack-Ordner („Überraschungs-Plus" zur Speise — Würth-Logik:
Schrauben = Stamm, Werkzeug = Gast). Sehr asymmetrische
Stamm/Gast-Verteilung im Vergleich zu Mixarium (8 vs. 2) — das
ist ehrlich zur Datenrealität: Klaus' Rezeptbuch enthält
faktisch ein kleines Mixarium nebenbei.

### 3. Commit + Push + Live-Reload + Spore-Generierung

- **Klaus hatte die App vom Home-Screen deinstalliert** (nicht nur
  entfernt) und neu via URL aufgerufen, um sicherzugehen, dass der
  neue Service-Worker frisch installiert wird.
- Eruda-Konsole nach Reload: alle sieben Modul-Selbstchecks plus
  drei `sbkim-init.js`-Init-Zeilen grün.
- `__sbkimErzeugeSpore()` in Eruda. **Embedding-Modell-Cache war
  aus Mixarium-Sitzung gecacht** (gleicher Origin, Browser-HTTP-
  Cache greift) → kein Re-Download, Spore in wenigen Sekunden
  erzeugt.

### 4. Spore deployen

- Eruda-One-Liner zum Browser-Download → `~/storage/downloads/
  spore.json` (Chrome überschreibt bei gleichem Dateinamen — die
  Mixarium-Spore war eh schon nach `~/Mein-Mixarium/sbkim/` `mv`d,
  also lokal keine Kollision).
- `mv ~/storage/downloads/spore.json ~/Mein-Rezeptbuch/sbkim/
  spore.json` + Commit + Push.
- Pages-Build durch. Live-URL
  `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/
  spore.json` zeigt das JSON mit allen Pflicht- + optionalen
  Feldern (Stamm[7], Gast[11], domainVector[384],
  domainKeywords[7], plus Rezeptbuch-spezifische
  domainDescription).

### 5. ARCHITEKTUR-LÜCKE entdeckt — IndexedDB-Origin-Kollision

**Klaus' aufmerksame Beobachtung:** „Meine Spore wurde einfach
überschrieben, wahrscheinlich auch die vom Mixarium" — und die
**nodeId in der Rezeptbuch-Spore ist identisch zu Mixarium**
(`1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0`). Klaus hatte die
App **deinstalliert** und trotzdem dieselbe Identität bekommen.

**Ursache (technisch):**

- GitHub-Pages-Project-Sites teilen den **Origin**
  `lausiklauskn-png.github.io`. Nur der Pfad unterscheidet die
  PWAs (`/Mein-Mixarium/` vs. `/Mein-Rezeptbuch/`).
- IndexedDB ist im Browser **pro Origin**, nicht pro Pfad. Beide
  PWAs greifen auf dieselbe IndexedDB-Datenbank zu.
- Modul 01 öffnet die DB unter dem festen Namen `sbkim` (Konstante
  `DB_NAME` in `src/modules/01_storage.js`).
- Modul 02 speichert die Identität unter
  `sbkim_keys["main"]` (`IDENTITY_KEY = "main"` in
  `src/modules/02_spore.js`).
- Folge: erste PWA, die `getOrCreateIdentity` ruft, erzeugt das
  Ed25519-Keypair. Zweite PWA findet es und übernimmt es.

**Konsequenzen für die zwei deployten Spore-Files:**

| Feld | Mixarium | Rezeptbuch |
|---|---|---|
| `id` (nodeId) | `1h5OPqqq...0Oq0` | `1h5OPqqq...0Oq0` **gleich!** |
| `publicKey.x` | `G2902bVigK...Wt_s` | `G2902bVigK...Wt_s` **gleich!** |
| `signature` | verschieden (anderer Inhalt → anderer Sig-Hash) | verschieden |
| `domain` | `lausiklauskn-png.github.io` | dito |
| `endpoint` | `.../Mein-Mixarium/` | `.../Mein-Rezeptbuch/` |
| `nodeName` | `Mixarium Klaus` | `Rezeptbuch Klaus` |
| `stammCategories` | 8 Drinks-Kategorien | 7 Speisen-Kategorien |
| `guestCategories` | 2 (Knabbereien, Fingerfood) | 11 (Drinks + Snacks) |
| `domainVector` | aus Mixarium-Text | aus Rezeptbuch-Text |

**IndexedDB-Sicht-Stand:**

`sbkim_spore["main"]` wird beim zweiten `generateOwnSpore`-Aufruf
**überschrieben**. Konsequenz: die App, die zuletzt erzeugte,
sieht ihre eigene Spore in IndexedDB. Die andere App sieht die
**fremde** Spore, bis sie selbst `generateOwnSpore` neu aufruft.
Die deployten Pages-Spore-Files sind aber unabhängig davon und
bleiben mit ihren originalen Werten.

**Cross-Knoten-Handshake:**

`SbkimAnastomose.handshake(peer, …)` würde fehlschlagen, weil
`peer.id === ownNode.id`. Modul 05 spec sagt nicht explizit, wie
auf Self-Handshake reagiert wird (kein expliziter Self-Detect-
Check). Mathematisch würde der Match-Score 1.0 sein (gleiche
Domain-Vektor-Vergleich macht keinen Sinn, weil der Vektor
unterschiedlich ist — aber id und publicKey sind gleich, was
beim `verifyForeignSpore` als gültig durchläuft). Praktisch
würde `sbkim_siblings[ownNode.id]` mit der eigenen ID als
Schlüssel landen — semantisch sinnlos, technisch funktionierend.

**Pragmatischer Status für jetzt:** beide Endknoten sind
**deployed**, ihre Spore-Files sind live. Cross-Handshake ist
nicht sinnvoll testbar bis die Architektur-Lücke geschlossen ist.
`status.json` markiert beide mit
`pingStatus: "blocked-origin-collision"`.

### 6. Fix-Optionen für die Folge-Pflege-Sitzung

**Option (a) — PWA-Suffix in Storage** (Empfehlung):

Modul 01 + 09 + ggf. 02 erweitern:

- **Karte 09 § Andock-Schritt-Pfad Schritt 4** ergänzen:
  `SbkimAnastomose.init({ dbSuffix: "mixarium" })` (oder analog
  via `SbkimStorage.setDbName("sbkim_mixarium")` vor `init`).
- **Modul 01 (`src/modules/01_storage.js`)** öffnet die DB als
  `sbkim_<suffix>` oder konfigurierbar. Default-Verhalten ohne
  Suffix bleibt `sbkim` (rückwärtskompatibel).
- **Modul 02 (`src/modules/02_spore.js`)** muss nicht
  notwendigerweise geändert werden, weil `sbkim_keys["main"]`
  jetzt in einer PWA-spezifischen DB liegt.
- **Karte 01 § Stores** erweitert um den Hinweis „DB-Name
  optional via Andocker-Konfig konfigurierbar".
- **`PROTOCOL_VERSION` bleibt `"0.1"`** — additiv, kein
  Hauptversions-Sprung.

Schätzaufwand: 45–60 Min headless. Nach Pflege Klaus' Re-Andock
beider Endknoten (Spore neu erzeugen, neu deployen) → 30 Min mit
beiden.

**Option (b) — Eigene Subdomains**:

Pages-Project-Sites unterstützen das nicht direkt. Klaus müsste
Custom Domain mit DNS-Trickserei einrichten (CNAME-Records auf
`mixarium.lausiklauskn.de` etc.). Aufwand: deutlich höher,
externes Domain-Hosting nötig.

**Empfehlung Option (a).** Variante (b) bleibt als langfristige
Option, falls Klaus die Endknoten irgendwann unter eigener Domain
betreiben will.

### 7. Sage-Protokol-Sicht-Stand nachgezogen

- **`status.json`** Endknoten[Rezeptbuch] auf `integrated: true`
  + additive Felder (`integratedAt`, `nodeId`, `sporeUrl`,
  `stammCategories`, `guestCategories`, `pingStatus: "blocked-
  origin-collision"`). Mein-Mixarium `pingStatus` von
  `"pending-peer"` auf `"blocked-origin-collision"` geändert.
- **PULS § Endknoten-Tabelle** beide Zeilen erweitert mit
  Stamm/Gast-Aufstellung + Hinweis auf geteilte nodeId.
- **PULS § Offene Querschnitts-Fragen** neue Frage „IndexedDB-
  Origin-Kollision bei GitHub-Pages-Project-Sites" oben
  eingetragen, mit zwei Fix-Optionen und Verweis auf dieses
  Übergabeprotokoll.
- **PULS § Empfehlung Hauptsitzung** umformuliert auf
  „Folge-Pflege Karten 01 + 09 PWA-Suffix" als nächsten
  sinnvollen Schritt.
- **PULS § Sitzungs-Einträge** rotiert (diese Sitzung oben,
  Mixarium-Andock als Index-Zeile in §Archiv-Index).

---

## Was bewusst nicht angefasst wurde

- **`src/modules/*`** unverändert. Module 01 + 02 brauchen die
  Architektur-Erweiterung, aber das ist Folge-Pflege.
- **Karten 01 + 09** unverändert. Erweiterung kommt in Folge-
  Pflege-Sitzung.
- **`tests/manual_check.html`**, **`docs/INTERFACES.md`** unverändert.
- **`update_puls_pie.py`** nicht aufgerufen (kein Modul-Score-
  Wechsel; `lastUpdated` auf `2026-05-16` bleibt aus Mixarium-
  Update).
- **`index.html` (Sage-Page)** unverändert.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.
- **Mini-Pflege „Sushi-Kategorie sichtbar machen"** in Mein-
  Mixarium und **INTERFACES.md §6 Tabellen-Bug** weiterhin offen.

---

## Validierung

- **`status.json` valid JSON** (`python3 -c "import json;
  json.load(open('status.json'))"`); beide Endknoten als
  `integrated: true`.
- **Spore-JSON live-erreichbar** auf der Pages-URL
  `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/
  spore.json` (Klaus' Screenshot bestätigt das).
- **Eruda zeigt alle sieben Modul-Selbstchecks** + drei Init-
  Zeilen in der Rezeptbuch-PWA grün.
- **Architektur-Lücke verifiziert**: Klaus' Beobachtung der
  identischen nodeId in beiden Spore-Files ist reproduzierbar
  und durch IndexedDB-pro-Origin-Verhalten erklärt.

---

## Was offen blieb

### Folge-Pflege „Karten 01 + 09 PWA-Suffix" (HÖCHSTE PRIORITÄT)

Architektur-Erweiterung, damit beide Endknoten unabhängige
Identitäten haben können. Variante (a) aus § 6 oben.

### Klaus' Re-Andock beider Endknoten

Nach Schritt 1: in beiden PWAs `__sbkimErzeugeSpore()` neu
aufrufen (mit dem PWA-Suffix-Konfig). Neue nodeIds entstehen,
neue Spore-Files werden deployed (überschreiben die alten).
~30 Min mit beiden Endknoten.

### Cross-Knoten-Handshake (Karte 09 § 8)

Nach Re-Andock möglich. `SbkimAnastomose.handshake` von einem
PWA gegen die Peer-Spore-URL des anderen. Bei Erfolg
`sbkim_siblings[peerNodeId]` befüllt + `status.json` Endknoten[*]
.pingStatus auf `"live"`.

### Eruda-Rückbau

Nach erfolgreichem ersten Cross-Knoten-Handshake. Zwei Zeilen
aus beiden `index.html` raus, ein `sed`-Befehl pro Repo.

### Mini-Pflege „Sushi-Kategorie sichtbar machen" in Mein-Mixarium

Entkoppelt. Klaus' Wahl.

### Mini-Pflege INTERFACES.md §6 Tabellen-Bug

Aus PR #45 Squash-Merge. Niedrige Dringlichkeit.

### Klaus' Sichttest Panel 06 (Heterokaryose)

Weiterhin offen aus früheren Sitzungen.

---

## Nächster sinnvoller Schritt

1. **Folge-Pflege „Karten 01 + 09 PWA-Suffix"** — *headless
   möglich*. Karten + Modul 01 (+ ggf. 02) erweitern.
   Schätzaufwand ~45–60 Min.
2. **Re-Andock beider Endknoten** mit frischen, separaten
   Identitäten — Klaus am Termux, nach Schritt 1.
3. **Cross-Knoten-Handshake** — Karte 09 § 8, nach Schritt 2.
4. **Eruda-Rückbau** — nach Schritt 3.
5. **Mini-Pflege „Sushi-Kategorie sichtbar machen"** — entkoppelt.
6. **Mini-Pflege INTERFACES.md §6 Tabellen-Bug** — niedrige
   Dringlichkeit.

---

## Material aus der Sitzung

**Mein-Rezeptbuch-Spore** (jetzt live unter
`https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/spore.json`):

```json
{
  "createdAt":         "2026-05-16T01:43:14.330Z",
  "domain":            "lausiklauskn-png.github.io",
  "domainDescription": "Klaus Rezeptbuch - Hausgemachte Kochrezepte vom Hefeteig bis zur Sauce, plus Begleitgetränke und Knabbereien als Ueberraschungs-Plus.",
  "domainKeywords":    ["Rezept", "Kochen", "Essen", "Hauptgang", "Beilage", "Backen", "Saucen"],
  "domainVector":      [/* 384 Floats, anders als Mixarium-Vektor wegen anderer Kategorien-Text */],
  "embeddingModel":    "Xenova/multilingual-e5-small",
  "endpoint":          "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/",
  "guestCategories":   ["Getränke", "Smoothies & Shakes", "Mocktails", "Alkfr. Cocktails", "Limonaden", "Tees & Kaffees", "Cocktails", "Bowlen", "Sirup & Basis", "Knabbereien", "Fingerfood"],
  "id":                "1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0",   /* GLEICH wie Mixarium! Origin-Kollision */
  "nodeName":          "Rezeptbuch Klaus",
  "nodeType":          "hybrid",
  "protocolVersion":   "0.1",
  "publicKey":         { "alg":"Ed25519", "crv":"Ed25519", "ext":true, "key_ops":["verify"], "kty":"OKP", "x":"G2902bVigKIYp1phzBdBgOOTNGfJOvpAM5XDNIMWt_s" },  /* GLEICH wie Mixarium! */
  "signature":         "<unterschiedlich zu Mixarium-Signatur, weil unterschiedlicher Inhalt>",
  "stammCategories":   ["Vorspeisen", "Suppen", "Fleisch", "Fisch", "Vegetarisch", "Kuchen", "Desserts"]
}
```

**Commits in Mein-Rezeptbuch-Repo** (chronologisch):
- `2c8e141` — SBKIM-Andock Iteration 3: Module + sbkim-sw.js +
  app-sw.js Variante 3b + sbkim-init.js mit Stamm/Gast
  (Rezeptbuch Klaus) — die Andock-Dateien.
- `04ac4c2` — SBKIM-Andock Iteration 3: + Spore (Rezeptbuch Klaus)
  — die signierte Spore.

**Klaus' Beobachtungs-Zitat:**

> „Meine Spore wurde einfach überschrieben warscheinlich auch
> die vom Mixarium. Name spore.json ich habe nur diese gefunden.
> nicht das wir hier nur die Spore sehen die garkeine verbindung
> zur App hat oder sehe ich das falsch"

Klaus hat das Kernproblem als Erster gesehen. Genau richtig
beobachtet — die Spore ist nicht „losgelöst von der App", aber
sie teilt sich die Identität mit der **anderen** App. Die App-
Spezifika (Stamm/Gast/endpoint/Beschreibung) sind in beiden
Spore-Files korrekt unterschiedlich; nur die Identität ist
geteilt.

**Wichtige Lehre für Karte 09:** „Vor dem Einbau zu klärende
Werte" muss um `<DB_SUFFIX>` (oder ähnliches) erweitert werden,
sobald Variante (a) aus § 6 spezifiziert ist. Pages-Project-
Sites sind ein häufiger Fall für SBKIM-Knoten in der Praxis,
das Konstrukt sollte robust sein.
