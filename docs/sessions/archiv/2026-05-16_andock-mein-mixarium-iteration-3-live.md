# Übergabeprotokoll · 2026-05-16 · Bau-Sitzung 09 Iteration 3 — Mein-Mixarium live angedockt

**Sitzungs-Rolle:** Bau-Sitzung Modul 09 (Live-Andock-Versuch, dritte
Iteration), mit Klaus am Tablet via Termux, **nicht headless**. Erster
Endknoten (Mein-Mixarium) folgt erstmals der vollständigen Karte-09-
Anleitung (Schritte 1–7 + 9a, Schritt 8 Cross-Handshake verschoben auf
Folge-Sitzung). Mein-Rezeptbuch ist bewusst auf eine Folge-Sitzung
verschoben — Zeit-Budget der Sitzung war zwei Stunden.

**Branch:** `claude/andock-mein-mixarium-iteration-3-live`

**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §D
(Einbau-Sitzung) — Klaus arbeitet im externen Endknoten-Repo
`Mein-Mixarium`, Sage-Protokol bekommt nur das Statussynchronisations-
Update (`status.json` + PULS + Übergabeprotokoll). Plus zwei
Folge-Pflege-Sitzungen aus dem ersten Teil der Sitzung
(Spec Stamm/Gast + Bau 02 Stamm/Gast-Durchreichung) waren zwingend,
um diesen Andock vollständig zu machen — beide schon gemerged
(PR #46 + #47).

**Modul:** 09 (Andock-Anleitung; Sage-Protokol-seitig nur
Beobachter), und alle sieben SBKIM-Modul-Files (00/01/02/03/04/05/07)
sowie `sbkim-sw.js` werden in `Mein-Mixarium` kopiert.

---

## Auftrag

Klaus hatte zwei Stunden für „SBKIM-Integration beenden und live
im Observatorium". Die zwei Stunden in der Praxis:

**Stunde 1 (rund 35 Min):**
- Spec-Sitzung „Stamm/Gast-Felder in Spore-JSON" (PR #46, gemerged).
- Folge-Bau „Stamm/Gast-Durchreichung in `generateOwnSpore`" (PR #47,
  gemerged). Beide Pflege-Sitzungen waren Voraussetzung — die
  vorherige Konzept-Sitzung „Live Andock Iteration 2" hatte Karte +
  Konzept geliefert, aber der Code-Pfad fehlte noch.

**Stunde 2 (rund 85 Min):**
- Andock Mein-Mixarium nach Karte 09 — diese Sitzung, dieses
  Übergabeprotokoll.

Mein-Rezeptbuch + Cross-Knoten-Handshake + Eruda-Rückbau blieben
außerhalb des Zeit-Budgets und sind Folge-Sitzung.

---

## Was getan wurde

### 1. Vorbereitung — Termux-Setup im Mein-Mixarium-Pfad

Sage-Protokol-Repo lokal geklont (`gh repo clone
lausiklauskn-png/Sage-Protokol` in Klaus' Termux). Mein-Mixarium-
Repo lag schon lokal aus Live Andock Iteration 2. `gh auth status`
zeigte gültigen Login als `lausiklauskn-png` mit `repo`+`workflow`
scopes. `git config --global user.email` und `user.name` waren aus
früherer Sitzung gesetzt.

### 2. Schritt 1 — Module kopieren (Karte 09 § 1)

```bash
mkdir -p ~/Mein-Mixarium/sbkim
cp ~/Sage-Protokol/src/modules/{00_doku_fenster,01_storage,02_spore,03_embedding,04_match,05_anastomose,07_apoptose}.js ~/Mein-Mixarium/sbkim/
cp ~/Sage-Protokol/src/sbkim-sw.js ~/Mein-Mixarium/
```

Sieben Modul-Dateien (00, 01, 02, 03, 04, 05, 07) im
`~/Mein-Mixarium/sbkim/`-Unterordner. **`sbkim-sw.js` bewusst im
Repo-Root**, nicht im `sbkim/`-Ordner — Karte 09 § Service-Worker-
Scope-Falle. Modul 06 (Heterokaryose) und 08 (UI-Demo) wurden bewusst
**nicht** kopiert — die Erst-Iteration (Schritte 1–9 aus Karte 09)
listet sie nicht; sind späte-Phase-Module.

### 3. Schritt 2 — `<script>`-Tags in `index.html` (Karte 09 § 2)

Mein-Mixarium hat **5 Vorkommen** von `</body>` (Diagnose:
`grep -c '</body>'`). Davon ist nur das letzte das echte HTML-Body-
Schluss-Tag; die übrigen vier sind in JS-Template-Strings (typisch
für eine PWA mit dynamischem Rendering von Newsletter-Templates o.ä.).

`sed -i 's#</body>#...#'` hätte nur das **erste** Vorkommen
ersetzt — falsche Stelle. Stattdessen zwei-Pass-`awk`:

```bash
awk '{lines[NR]=$0} /<\/body>/{last=NR} END{for(i=1;i<=NR;i++){print lines[i]; if(i==target) print TAG}}' …
```

Erster Pass: alle Zeilen sammeln, letztes `</body>` merken. Zweiter
Pass: Zeilen wieder ausgeben, vor dem letzten `</body>` die sieben
SBKIM-Tags einfügen:

```html
<script src="sbkim/01_storage.js"></script>
<script src="sbkim/02_spore.js"></script>
<script src="sbkim/03_embedding.js"></script>
<script src="sbkim/04_match.js"></script>
<script src="sbkim/05_anastomose.js"></script>
<script src="sbkim/07_apoptose.js"></script>
<script src="sbkim/00_doku_fenster.js"></script>
```

**Reihenfolge verbindlich** (Karte 09 § 2): 01→02→03→04→05→07→00.
Sichtprüfung via `grep -c 'src="sbkim/'` → 7. Termux nutzte
`~/tmp.html` als Zwischendatei (Termux hat kein `/tmp/`).

Achter Tag (`<script src="sbkim/sbkim-init.js">`) folgt in Schritt 4.

### 4. Schritt 3 — App-SW Variante 3b (Karte 09 § 3b)

Pre-Flight: Mein-Mixarium hat aktiven `app-sw.js` im Repo-Root
(Klaus' bestehender App-Update/Cache-SW; war auch der Anlass für die
Pflege-Sitzung Karte 09 App-SW-Koexistenz, 2026-05-15). Karte 09
sagt für diesen Fall **Variante 3b**: keinen zweiten `register`-
Aufruf, sondern `importScripts('./sbkim-sw.js')` im bestehenden
App-SW.

Drei Zeilen oben in `app-sw.js` per `printf | cat`-Konkatenation
eingefügt (vor dem bestehenden Code):

```js
self.SBKIM_SW_STANDALONE = false;
importScripts("./sbkim-sw.js");
console.info("SBKIM-SW geladen via importScripts (Variante 3b)");
```

`SBKIM_SW_STANDALONE = false` schaltet im `sbkim-sw.js` die
`skipWaiting`+`clients.claim`-Logik ab (App-SW behält Lifecycle-
Steuerung). `importScripts` zieht die Anastomose-/Apoptose-/
Heterokaryose-fetch-Listener in den App-SW-Kontext.

Sichtprüfung via `head -5 ~/Mein-Mixarium/app-sw.js`: erste drei
Zeilen wie spezifiziert, ursprüngliche `app-sw.js`-Logik ab Zeile 4.

### 5. Schritt 4 — `sbkim-init.js` mit Auto-Init + Spore-Trigger

Statt einen langen Inline-`<script>`-Block in `index.html`
einzubauen, als eigene Datei `~/Mein-Mixarium/sbkim/sbkim-init.js`
angelegt (Heredoc `cat > FILE << 'EOF' ... EOF`). Vorteile:
debug-freundlich, version-controlled, Rezeptbuch kann analog
weiterverwenden.

Inhalt (45 Zeilen):

- **Auto-Init beim Page-Load** (IIFE-async):
  ```js
  await SbkimAnastomose.init();   // Karte 09 § 4
  await SbkimApoptose.init();     // Karte 09 § 9a
  ```
- **`window.__sbkimErzeugeSpore()`** als globaler Trigger für
  Schritt 5+6 (Embedding-Init + Vektor + Spore). Klaus ruft ihn in
  der DevTools-Konsole nach erstem Page-Load auf — danach ist die
  Spore signiert in IndexedDB. Im sbkim-init.js sind die
  Stamm/Gast-Werte **hartkodiert** nach Klaus' echten Mixarium-
  Ordnernamen (aus dem Screenshot der Mein-Mixarium-PWA):
  ```js
  stammCategories = ["Cocktails", "Mocktails", "Alkfr. Cocktails",
                     "Smoothies & Shakes", "Limonaden",
                     "Tees & Kaffees", "Bowlen", "Sirup & Basis"];
  guestCategories = ["Knabbereien", "Fingerfood"];
  domainKeywords  = ["Cocktail", "Drink", "Mocktail", "Limonade",
                     "Smoothie", "Aperitif", "Sake"];
  ```
- **Pflichtfelder** für `generateOwnSpore`:
  ```js
  domain:    "lausiklauskn-png.github.io"
  endpoint:  "https://lausiklauskn-png.github.io/Mein-Mixarium/"
  nodeType:  "hybrid"
  nodeName:  "Mixarium Klaus"
  domainDescription: "Klaus Mixarium - Cocktails, Mocktails, Smoothies und mehr; Knabbereien als Begleit-Plus."
  ```
- **Vektor-Quelle**: `embedPassage(stammCategories + guestCategories
  + domainKeywords joined as ", "-Liste)`. Single domainVector
  (Stamm+Gast gemittelt) — siehe Spec-Sitzung 2026-05-15 Entscheidung 3.

Achter `<script>`-Tag `<script src="sbkim/sbkim-init.js"></script>`
direkt **nach** `<script src="sbkim/00_doku_fenster.js"></script>`
via awk eingefügt (eindeutiger Anker als „vor `</body>`"). Total
acht SBKIM-Script-Tags in `index.html`.

### 6. Schritte 5 + 6 — Spore live erzeugen (in Eruda-Konsole)

Klaus committed + pushed (`b792576..dbbee2f main -> main`), Pages-
Build durch, Mein-Mixarium-PWA neu geladen. Eruda-Konsole zeigte alle
sieben Modul-Selbstchecks beim Page-Load:

```
MODUL 01 STORAGE bereit, Funktionen: init/getStore/get/put/del/all/clear
MODUL 02 SPORE bereit, Funktionen: init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/generateOwnSpore/getOwnSpore/verifyForeignSpore/resetIdentityCache
MODUL 04 MATCH bereit, Funktionen: match/isAboveProviderThreshold, Schwelle: PROVIDER_MIN_MATCH=0.8
MODUL 05 ANASTOMOSE bereit, Funktionen: init/handshake/receiveHandshake/listSiblings/forgetSibling
MODUL 07 APOPTOSE bereit, Funktionen: init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings
MODUL 00 DOKU-FENSTER bereit, Funktionen: init/open/close/isOpen/getStatusSnapshot/recordSighttest
```

Plus die drei `sbkim-init.js`-Init-Zeilen:

```
SBKIM-Init grün — Storage, Spore, Match bereit.
SBKIM-Apoptose grün — Vermächtnis-Empfang aktiv.
SBKIM-Andock bereit. Spore erzeugen mit __sbkimErzeugeSpore() in der DevTools-Konsole.
```

Modul 03 (Embedding) meldete sich erwartungsgemäß erst nach
`__sbkimErzeugeSpore()`-Aufruf mit `Modell: Xenova/multilingual-
e5-small, Dim: 384`. Der Embedding-Modell-Download dauerte
ca. 1.5 Min (~30 MB, einmalig).

**Ergebnis aus der Konsole:**
```
Domain-Vektor erzeugt: 384 Floats
Spore erzeugt, nodeId = 1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0
Signatur-Länge = 86
```

nodeId ist 43 Zeichen base64url (= SHA-256 des öffentlichen
Schlüssels, ohne Padding). Signatur ist 64 Bytes Ed25519, base64url
codiert ohne Padding = 86 Zeichen. Beides exakt schema-konform.

### 7. Schritt 7 — Spore deployen als `sbkim/spore.json`

In Eruda One-Liner zur Erzeugung eines Browser-Downloads getriggert:

```js
SbkimSpore.getOwnSpore().then(s=>{const t=JSON.stringify(s,null,2);
  const b=new Blob([t],{type:"application/json"});
  const u=URL.createObjectURL(b);
  const a=document.createElement("a");
  a.href=u; a.download="spore.json";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(u);
})
```

Chrome speicherte `spore.json` in `/storage/emulated/0/Download/`.
Termux brauchte einmalig Android-Permission via `termux-setup-
storage` → Android-System-Settings „Zugriff auf alle Dateien" →
Termux-Toggle aktivieren (`MANAGE_EXTERNAL_STORAGE`). Danach Symlink
`~/storage/downloads/`.

```bash
mv ~/storage/downloads/spore.json ~/Mein-Mixarium/sbkim/spore.json
```

`head -3` bestätigte: `createdAt` von `2026-05-16T00:54:25.118Z`,
`domain: "lausiklauskn-png.github.io"` — Datei korrekt.

Commit + Push (`dbbee2f..d8dd3b3 main -> main`).

### 8. Schritt 7e — Live-URL-Verifikation

Pages-Build nach 1–2 Min durch. Im Browser
`https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json`
geöffnet — JSON kam als Klartext mit allen erwarteten Feldern:

**Pflichtfelder** (alphabetisch sortiert wie kanonisch verlangt):
- `createdAt`, `domain`, `embeddingModel`, `endpoint`, `id`,
  `nodeType`, `protocolVersion`, `publicKey`, `signature`.

**Optionale** (alle in dieser Iteration mitgesendet):
- `domainDescription`, `domainKeywords`, `domainVector` (384 Floats
  sichtbar in der Klartext-Ausgabe), `nodeName`,
  **`stammCategories`** (8 Strings), **`guestCategories`** (2
  Strings).

`publicKey` ist Ed25519 JWK (`kty:"OKP"`, `crv:"Ed25519"`,
`x:"G2902bVigKIYp1phzBdBgOOTNGfJOvpAM5XDNIMWt_s"`). `signature` ist
86 Zeichen base64url. Felder kanonisch alphabetisch.

### 9. Sage-Protokol-Sicht-Stand nachgezogen

**`status.json`** Endknoten[Mixarium] erweitert:
- `integrated: false` → `true`
- Neu: `integratedAt: "2026-05-16"`, `nodeId`,
  `sporeUrl`, `stammCategories`, `guestCategories`,
  `pingStatus: "pending-peer"` (Schema-Erweiterung; drückt aus, dass
  das andere Pages-Knoten-Pendant noch fehlt für einen Live-Cross-
  Handshake — `pingStatus: "live"` kommt erst nach Andock
  Rezeptbuch + erfolgreichem Handshake).
- `lastUpdated: "2026-05-15"` → `"2026-05-16"`.

**`update_puls_pie.py`** ausgeführt. Pie-Inhalt unverändert (keine
Modul-Score-Änderung); nur das Datum im Titel-String von
2026-05-15 auf 2026-05-16 gezogen.

**`docs/PULS.md`** § Endknoten-Tabelle Mein-Mixarium-Zeile
umformuliert (von „nicht integriert · Eruda eingebaut" auf
„integriert 2026-05-16 · nodeId · Spore-URL · Stamm[8]+Gast[2] ·
pending-peer"). § Sitzungs-Einträge rotiert (diese Sitzung oben,
Bau 02 Stamm/Gast-Durchreichung als Archiv-Index-Zeile).

**§ Empfehlung Hauptsitzung** umformuliert auf „Andock Mein-
Rezeptbuch" als nächsten Schritt.

---

## Was bewusst nicht angefasst wurde

- **`src/modules/*`** in Sage-Protokol — unverändert. Module 02 +
  Stamm/Gast-Durchreichung kamen schon in PR #47 (gemerged).
- **`tests/manual_check.html`** — unverändert. Andock-Sitzung ist
  Live-Test in der Endknoten-PWA, nicht in der Sage-Werkstatt.
- **`docs/INTERFACES.md`** — unverändert. Andock in einem Endknoten
  ist Vertrags-Anwendung, kein Vertrags-Eingriff.
- **`docs/components/09_einbau_pwa.md` (Karte 09)** — unverändert.
  Sie hat sich live bewährt, keine Lücken aufgetaucht. Wenn der
  Andock Mein-Rezeptbuch in der Folge-Sitzung was zeigt, was Karte 09
  vermissen lässt, wird das dort eingebaut.
- **`docs/components/02_spore.md` / `04_match.md`** — unverändert.
  Karten-Pflege kam in PR #46 + #47.
- **`index.html` (Sage-Page)** — unverändert. Sage-Page rendert
  datengetrieben aus `status.json`. Wenn die Page mit dem neuen
  `pingStatus`-Feld nicht umgehen kann, ist das harmlos (Feld wird
  einfach ignoriert). Eine Folge-Pflege „Sage-Page rendert
  integrierte Endknoten mit nodeId-Chip" wäre möglich, ist aber
  nicht dringend.
- **Mein-Rezeptbuch** — komplett unverändert. Andock als
  eigene Folge-Sitzung. Der Pfad ist identisch, nur Stamm/Gast-Werte
  + `nodeName`/`endpoint` anders.
- **`PROTOCOL_VERSION`** bleibt `"0.1"`.

---

## Validierung

- **`status.json` valid JSON** (`python3 -c "import json;
  json.load(open('status.json'))"`).
- **`update_puls_pie.py`** ausgeführt — Pie-Inhalt unverändert
  (keine Modul-Score-Änderung), nur das Datum-Stempel im
  Pie-Titel ist auf 2026-05-16 nachgezogen.
- **Spore-JSON live-erreichbar** auf der Pages-URL, alle Felder
  kanonisch alphabetisch.
- **Eruda-Konsole** zeigt alle sieben Modul-Selbstchecks + drei
  `sbkim-init.js`-Init-Zeilen ohne Fehler.
- **App-SW Variante 3b live aktiv** — `console.info("SBKIM-SW
  geladen via importScripts (Variante 3b)")` aus `app-sw.js`
  bestätigt (sichtbar in der Service-Worker-Konsole / unter
  Application → Service Workers im DevTools-Äquivalent).

---

## Was offen blieb

### Folge-Sitzung „Andock Mein-Rezeptbuch"

Gleicher Pfad wie diese Sitzung, andere Werte:

- **Stamm-Kategorien** = Rezeptbuch-Speisen-Ordner. Vor dem Andock
  noch genau sichten (Eruda in Mein-Rezeptbuch zeigt die Liste);
  vorläufiger Stand aus früheren Sichtkontrollen: `["Vorspeisen",
  "Suppen", "Fleisch", "Fisch", "Vegetarisch"]` + ggf. weitere.
- **Gast-Kategorien** = `["Begleitgetränke"]`. Später erweitern um
  `"Weinkarte"`, sobald Klaus den Ordner anlegt.
- **`domain`** = `lausiklauskn-png.github.io` (gleich für beide
  Endknoten weil beide Pages-Project-Sites unter derselben
  Github-Domain).
- **`endpoint`** = `https://lausiklauskn-png.github.io/Mein-
  Rezeptbuch/`.
- **`nodeName`** = `Rezeptbuch Klaus`.
- **`domainDescription`** + **`domainKeywords`** entsprechend an
  Rezeptbuch angepasst.

Termux-Setup ist schon eingespielt (gh auth, git config,
termux-setup-storage). Repo lag schon lokal aus Live Andock
Iteration 2 (Eruda-Einbau). Schritte sind klar; ~45–60 Min
geschätzt.

### Cross-Knoten-Handshake (Karte 09 Schritt 8)

Nach Andock Rezeptbuch. In einem der zwei Endknoten in Eruda:

```js
fetch("https://lausiklauskn-png.github.io/Mein-Rezeptbuch/sbkim/spore.json")
  .then(r => r.json())
  .then(peer => SbkimAnastomose.handshake(peer, window.__sbkimDomainVector))
```

Bei Erfolg (`outcome:"established", score >= 0.80`) landet der
andere Knoten in `sbkim_siblings`. Dann analog vom Rezeptbuch-
Knoten gegen den Mixarium-Knoten. Bidirektional.

Nach erfolgreichem Handshake `status.json` Endknoten[*].pingStatus
auf `"live"` setzen.

### Eruda-Rückbau

Nach dem ersten Cross-Knoten-Handshake (= alles funktioniert). Zwei
Zeilen aus beiden `index.html` raus, dazu ein `sed`-Befehl pro Repo:

```bash
sed -i '/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/eruda@3"><\/script>/d; /<script>eruda\.init();<\/script>/d' index.html
```

Plus Commit und Push pro Endknoten.

### Mini-Pflege „Sushi-Kategorie sichtbar machen" in Mein-Mixarium

Entkoppelt. Die `fid_17763323516422`-Geister-Kategorie in
Mein-Mixarium-Daten reaktivieren (UI zeigt dann die 6 Sushi-Items
als „Knabbereien"- oder „Fingerfood"-Einträge im neuen Gast-Bereich)
oder die 6 Items löschen (sie sind im Rezeptbuch parallel
vorhanden). Klaus' Wahl.

### Mini-Pflege INTERFACES.md §6 Tabellen-Bug

Aus Squash-Merge von PR #45 (zwei Sitzungs-Einträge in einer Zeile
verschmolzen). Niedrige Dringlichkeit, eigene kleine Pflege-Sitzung.

### Sage-Page rendert integrierte Endknoten

`status.json` hat jetzt das neue Feld `pingStatus` und additive
Felder (`nodeId`, `sporeUrl`, `stammCategories`,
`guestCategories`). Wenn die Sage-Page in der Endknoten-Karte einen
nodeId-Chip oder Stamm/Gast-Counts rendern soll, ist das eine
Folge-Pflege Sage-Page. Aktuell rendert sie die Endknoten
vermutlich nur als „integriert/nicht" — das ist OK, das neue
`pingStatus`-Feld stört nicht.

### Klaus' Sichttest Panel 06 (Heterokaryose)

Weiterhin offen aus früheren Sitzungen.

---

## Nächster sinnvoller Schritt

1. **Andock Mein-Rezeptbuch** mit Klaus am Termux. *Nicht headless.*
   Karte 09 analog, ~45–60 Min, weil Klaus den Pfad kennt.
2. **Cross-Knoten-Handshake** (Karte 09 § 8) zwischen Mixarium und
   Rezeptbuch nach Schritt 1.
3. **Eruda-Rückbau** in beiden Endknoten nach erfolgreichem Handshake.
4. **Mini-Pflege „Sushi-Kategorie sichtbar machen"** in Mein-
   Mixarium — parallel zu Schritt 1 möglich.
5. **Mini-Pflege INTERFACES.md §6 Tabellen-Bug** — niedrige
   Dringlichkeit.
6. **Klaus' Sichttest Panel 06** — weiterhin offen.

---

## Material aus der Sitzung

**Klaus' Hardware:** Samsung Galaxy Tab S6 + DeX, Android-Chrome,
Termux mit `gh`+`git` + Android `MANAGE_EXTERNAL_STORAGE`-Permission
(einmalig vergeben für `mv ~/storage/downloads/...`).

**Andock-Pfad (zusammengefasst, eine Zeile pro Karte-09-Schritt):**

```
1. mkdir + cp Module → ~/Mein-Mixarium/sbkim/ + sbkim-sw.js root
2. awk: 7 <script>-Tags vor letztem </body>
3. printf + cat: 3 Zeilen oben in app-sw.js (Variante 3b)
4. cat << EOF: sbkim-init.js + awk: 8. <script>-Tag
   (sbkim-init.js triggert Anastomose.init + Apoptose.init beim Load)
5-6. In Eruda: __sbkimErzeugeSpore() → Modell + Vektor + signierte Spore
7. In Eruda: Download-Blob → ~/storage/downloads/spore.json
   → mv nach ~/Mein-Mixarium/sbkim/spore.json
   → git add + commit + push
8. — verschoben auf Folge-Sitzung (braucht zweiten Endknoten)
9. — bereits in sbkim-init.js erledigt (Apoptose.init beim Load)
   (Doku-Fenster Selektor noch nicht verdrahtet — Folge-Pflege)
```

**Commits in Mein-Mixarium-Repo (chronologisch):**
- `dbbee2f` — SBKIM-Andock Iteration 3: Module + sbkim-sw.js +
  app-sw.js Variante 3b + sbkim-init.js mit Stamm/Gast (11 files,
  4007 insertions).
- `d8dd3b3` — Spore deployen Iteration 3 — Mein-Mixarium (nodeId
  1h5OPqqq...) (1 file, 431 insertions).

**Mein-Mixarium-Spore (jetzt live unter
https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json):**

```json
{
  "createdAt":         "2026-05-16T00:54:25.118Z",
  "domain":            "lausiklauskn-png.github.io",
  "domainDescription": "Klaus Mixarium - Cocktails, Mocktails, Smoothies und mehr; Knabbereien als Begleit-Plus.",
  "domainKeywords":    ["Cocktail", "Drink", "Mocktail", "Limonade", "Smoothie", "Aperitif", "Sake"],
  "domainVector":      [/* 384 Float-Werte, L2-normalisiert, embedPassage des Texts aus den 13 Kategorien+Keywords */],
  "embeddingModel":    "Xenova/multilingual-e5-small",
  "endpoint":          "https://lausiklauskn-png.github.io/Mein-Mixarium/",
  "guestCategories":   ["Knabbereien", "Fingerfood"],
  "id":                "1h5OPqqq3lPJPPxdXIyAjkzdHgYCfkuHx5ZEjZguOq0",
  "nodeName":          "Mixarium Klaus",
  "nodeType":          "hybrid",
  "protocolVersion":   "0.1",
  "publicKey":         { "alg":"Ed25519", "crv":"Ed25519", "ext":true, "key_ops":["verify"], "kty":"OKP", "x":"G2902bVigKIYp1phzBdBgOOTNGfJOvpAM5XDNIMWt_s" },
  "signature":         "VvFT5TpQkQMrYRRjXPllOrLd4iCJdx-wZKsbFGTlGmVMGazQTgDTdDTWNwtA3Bf9aIEe8CP1SgZJCpFOLlj6AA",
  "stammCategories":   ["Cocktails", "Mocktails", "Alkfr. Cocktails", "Smoothies & Shakes", "Limonaden", "Tees & Kaffees", "Bowlen", "Sirup & Basis"]
}
```
