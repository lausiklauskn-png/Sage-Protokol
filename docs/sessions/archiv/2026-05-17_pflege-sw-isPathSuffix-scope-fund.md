# Pflege 2026-05-17 — A/B-Test PR #70 + Architekturfund `isPathSuffix` scope-unbewusst

**Sitzungs-Rolle:** Folge-Sitzung zur Phantom-Clients-Pflege (PR #70).
Klaus + Bausitzung am Tablet via Termux/Chrome/Eruda. Test der gemergten
Fix-Version, Diagnose tiefer SW-Cache-Probleme, schließlich Architekturfund:
PR #70 fixt einen echten Phantom-Bug, aber nicht den, der den eigentlichen
Same-Origin Cross-PWA Handshake-Test scheitern lässt. **Aus dieser Sitzung
ist KEIN PR entstanden** — nur Befund, Übergabeprotokoll und Folge-Brief.

**Branch dieser Sitzung:** `claude/fix-test-panel-button-7-Iwf1E` (am
Anfang von Klaus' Sitzungs-Setup vergeben; nicht thematisch passend, weil
die Sitzung sich vom ursprünglichen Knopf-7-Auftrag zu einem ausführlichen
A/B-Test eskaliert hat).

---

## 1. Vorgeschichte (Pflichtkontext)

### Vor heute

- **2026-05-16:** Cross-Knoten-Handshake live etabliert (PR #65), aber
  Phantom-Cache-Bug in SW-Bridge bemerkt → mit direktem `receiveHandshake`-
  Aufruf umgangen.
- **2026-05-17 morgens:** Klaus' Tablet-Reboot-Sichttest bestätigt: Phantom
  überlebt Hardware-Reboot → Bug muss im SW-Code selbst sein, nicht in
  Browser-Caches.
- **2026-05-17 mittags:** PR #70 gemerged (`bd895d3`). Änderungen in
  `src/sbkim-sw.js`:
  - `clients.matchAll`: `includeUncontrolled: true` → `false`
  - Neue Loop-Logik „alle controlled Clients der Reihe nach, erster der
    nicht ‚toNodeId stimmt nicht‘ sagt gewinnt".
  - Falle: alle ablehnen → letzte Page-Antwort zurückgeben.

### Klaus' Setup heute Nachmittag

- Galaxy Tab S6, Chrome auf Android, Termux, Eruda für PWA-Debug.
- Zwei Endknoten-PWAs auf `lausiklauskn-png.github.io`:
  - `https://lausiklauskn-png.github.io/Mein-Mixarium/`
  - `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/`
- Beide nutzen Variante 3b (eigener `app-sw.js` + `importScripts('./sbkim-sw.js')`).
- Identitäten vom Worst-Case-Wipe-Test:
  - Mein-Mixarium: `1kpcdq_heJnlJXMFCZAhGbKg5KRl2YcBJXZhZrspXnM`
  - Mein-Rezeptbuch: `ktlJBO3W_oGbY4hlj9KW-JDYkvEfYAVves62XDbm_AM`

---

## 2. A-Test (alter SW, vor Update-Eskalation)

**Ziel:** Phantom-Symptomatik beim alten SW (vor PR #70-Deployment) reproduzieren.

**Setup:**
- Beide Endknoten-Tabs offen in Chrome.
- Persist-Flag in beiden IDBs `true`.
- Spore.json an Pages aktuell, Match IDB↔Pages: `true` in beiden Tabs.

**Befehl** (Mein-Rezeptbuch-Tab, Eruda Console):
```js
(async()=>{
  var own = await SbkimSpore.getOwnSpore();
  var peer = await fetch('https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json?nc='+Date.now()).then(r=>r.json());
  var ownVec = Float32Array.from(own.domainVector);
  var result = await SbkimAnastomose.handshake(peer, ownVec);
  console.info('A-Test (alter SW):', JSON.stringify(result, null, 2));
})();
```

**Ergebnis:**
```
Own id: ktlJBO3W_…
Peer id: 1kpcdq_…
{
  "outcome": "rejected",
  "reason": "toNodeId stimmt nicht zum Empfänger"
}
```

**Interpretation (damals):** Mein-Mixariums SW fängt mit `includeUncontrolled:true`
den Rezeptbuch-Tab als Phantom-Client und leitet die Nachricht dorthin →
Rezeptbuchs `receiveHandshake` rejected, weil toNodeId (`1kpcdq_…`) nicht zur
Rezeptbuch-Identität passt.

→ Phantom-Symptom reproduziert. **Das war die Beweis-Routine, die Klaus für
zukünftige Endknoten-Betreiber im Doku-Pfad wollte.** Sie ist gültig.

---

## 3. PR #70 Deployment + B-Test-Versuche (Eskalation)

### Schritt 1: Sporen-Wiederbeschaffung

Vorab IDB-Persist erzwingen (`navigator.storage.persist()`), dann
`__sbkimErzeugeSpore()` in beiden Tabs aufgerufen. **Befund:** Funktion ist
idempotent — wenn bereits eine Identität in der IDB liegt, wird sie
wiederverwendet (nur `createdAt` + `signature` neu). Bytes 11077 (Mixarium)
und 11247 (Rezeptbuch) identisch zu früheren Werten → keine neuen Identitäten.

Sporen wurden via Download in den jeweiligen Endknoten-Repo kopiert und
gepushed:
```
cp ~/storage/downloads/mixarium-spore.json ~/Mein-Mixarium/sbkim/spore.json
cp ~/storage/downloads/rezeptbuch-spore.json ~/Mein-Rezeptbuch/sbkim/spore.json
# (jeweils danach: git add + commit + push)
```

**Anmerkung zu „Eigene Spore"-Feldnamen:** Das Spore-Objekt
nennt die nodeId im JSON unter dem Feld **`id`**, NICHT `nodeId`
(siehe `src/modules/02_spore.js:346` `id: identity.nodeId`). `s.nodeId`
ist deshalb in der Page-Konsole `undefined` — das ist normal, nicht Bug.

### Schritt 2: sbkim-sw.js in beide Endknoten nachgezogen

```bash
cd ~/Sage-Protokol && git checkout main && git pull
cp src/sbkim-sw.js ~/Mein-Mixarium/sbkim/sbkim-sw.js
cp src/sbkim-sw.js ~/Mein-Rezeptbuch/sbkim/sbkim-sw.js
# jeweils: git add + commit + push
```

Verifikation via Eruda: Pages serviert die neue `sbkim-sw.js` mit
`includeUncontrolled: false`-Marker (Bytes ~9876).

### Schritt 3: B-Test scheitert weiter

Erwartung: nach Tab-Schließen + Neu-Öffnen sollte der neue SW aktiv sein.
Tatsächlich: weiterhin `outcome:"rejected", reason:"toNodeId stimmt nicht
zum Empfänger"`.

### Schritt 4: SW-Update-Eskalation (Chrome cached zäh)

Versuch 1: SW_VERSION-Bump v20→v21 in Mein-Mixariums `app-sw.js` (Klaus hat
eigene SW_VERSION-Konvention drin). Pages-Build durch, Tab-Reload zeigt
Auto-Reload-Logik (`SW_UPDATED`-Broadcast funktioniert). **Trotzdem
Phantom-Symptom.**

Versuch 2: Cache-Bust-Querystring an importScripts:
```js
importScripts("./sbkim-sw.js?v=v22")  // statt nur "./sbkim-sw.js"
```
Plus SW_VERSION v22-Bump. **Kein Effekt** — Chrome ignoriert/strippt
Querystring beim SW-Script-Cache.

Versuch 3: Dateiname ändern (nuklear):
```bash
cp sbkim/sbkim-sw.js sbkim/sbkim-sw-v23.js
sed -i 's|importScripts("./sbkim-sw.js?v=v22")|importScripts("./sbkim-sw-v23.js")|g' app-sw.js
# plus SW_VERSION v22 → v23
```
Pages-Build, Tab-Reload, SW-Check zeigt: `Active script: app-sw.js, state:
activated, SW_VERSION: mixarium-sw-v23, importScripts: "./sbkim-sw-v23.js"`.
**Neuer SW installiert + aktiviert.**

Versuch 4: Distinguishing-Test (Mein-Mixarium-Tab geschlossen) — sollte mit
NEUEM SW `HTTP 503 — keine aktive controlled Page-Instanz` liefern.
**Stattdessen weiterhin: `outcome:"rejected", reason:"toNodeId stimmt nicht
zum Empfänger"`.** Symptom unverändert.

Versuch 5: Holzhammer — `caches.delete()` für alle Caches + Unregister via
chrome://serviceworker-internals/ + Force-Stop Chrome via App-Switcher +
Restart. **Symptom unverändert.**

### Schritt 5: Probe-Fetch entlarvt den eigentlichen Responder

Mein-Mixarium-Tab geschlossen, nur Rezeptbuch-Tab offen, Probe-Fetch
mit absichtlich ungültigem Body:
```js
fetch('https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/anastomosis?nc='+Date.now(), {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({probe: 1})
});
```

**Response:** `HTTP 200`, Body enthält:
```json
{
  "fromNodeId": "ktlJBO3W_oGbY4hlj9KW-JDYkvEfYAVves62XDbm_AM",
  "receiverSpore": { "domainDescription": "Klaus Rezeptbuch …" }
}
```

**Bombe:** Der Probe ging an `/Mein-Mixarium/...`, aber der Responder ist
Mein-Rezeptbuch (sieht man am `fromNodeId` und `receiverSpore` mit
„Klaus Rezeptbuch"-Domain).

→ **Mein-Rezeptbuchs SW fängt den /Mein-Mixarium/-Fetch ab**, nicht
Mein-Mixariums SW. Damit war die ganze Update-Eskalation an Mein-Mixariums
SW irrelevant für dieses Test-Szenario.

---

## 4. Architekturfund (eigentliche Wurzel)

### Spec-Klärung

> **Subresource-Fetches von einem controlled client gehen durch dessen
> kontrollierenden SW — NICHT durch den SW, dessen Scope die URL trifft.**

Konkret:
- Mein-Rezeptbuch-Tab ist controlled von Mein-Rezeptbuchs SW (Scope
  `/Mein-Rezeptbuch/`).
- Wenn Rezeptbuch-Tab `fetch('/Mein-Mixarium/sbkim/anastomosis')` macht,
  feuert das fetch-Event in **Mein-Rezeptbuchs** SW.
- Der Mein-Mixarium-SW (Scope `/Mein-Mixarium/`) kriegt dieses Event NIE,
  egal ob Mein-Mixarium-Tab offen ist oder nicht.

Diese Spec-Detail wurde während der ersten Phantom-Clients-Pflege (PR #70)
falsch verstanden — wir gingen davon aus, dass Mein-Mixariums SW intercepted
und dann ein Phantom-Client wählt. In Wahrheit interceptet schon der
Sender-SW falsch.

### Bug in `src/sbkim-sw.js`

```js
function isPathSuffix(pathname, endpointPath) {
  // Erlaubt sowohl exakt /sbkim/<endpoint> als auch <scope>/sbkim/<endpoint>
  // (z.B. /rezeptbuch/sbkim/legacy bei GitHub-Pages-Project-Sites).
  if (pathname === endpointPath) return true;
  return pathname.endsWith(endpointPath);   // ← zu permissiv
}
```

`isPathSuffix("/Mein-Mixarium/sbkim/anastomosis", "/sbkim/anastomosis")` →
`true`, weil Path auf `/sbkim/anastomosis` endet. Mein-Rezeptbuchs SW
matcht damit Cross-PWA-Pfade.

### Vollständige Fehlerkette

1. Rezeptbuch-Tab → `fetch('/Mein-Mixarium/sbkim/anastomosis')`.
2. Mein-Rezeptbuchs SW (kontrolliert den Tab) bekommt fetch-Event.
3. `app-sw.js`-Listener (GET-only) lässt POST durch.
4. `sbkim-sw.js`-Listener prüft `isPathSuffix(...)` → `true`.
5. `handleBridge` ruft `clients.matchAll({type:"window", includeUncontrolled:false})`
   → findet Rezeptbuch-Tab (einziger Controlled Client).
6. Sendet Nachricht an Rezeptbuch-Tab via MessageChannel.
7. Rezeptbuch-Tabs `receiveHandshake` prüft `request.toNodeId` (`1kpcdq_…`)
   vs. own (`ktlJBO3W_…`) → Mismatch → Rejection.
8. Response geht über MessageChannel-Port zurück an Mein-Rezeptbuchs SW.
9. SW sendet als HTTP-Response zurück an den Fetch-Caller.

→ Selbst bei perfekt installiertem PR #70-Fix in Mein-Mixarium nie aktiv,
weil Mein-Mixariums SW gar nicht zu Wort kommt.

### PR #70's Fix in Perspektive

PR #70 ändert `includeUncontrolled:true` → `false` und macht eine
Client-Iteration. **Korrekt für sein Szenario:** Wenn Mein-Mixariums SW
mehrere Mein-Mixarium-Tabs hätte und einer alte Identität trägt, würde der
neue Code den falschen überspringen statt blind den ersten zu nehmen.

**Irrelevant für same-origin cross-PWA Handshake:** Weil schon der falsche
SW abfängt (Sender, nicht Receiver), kommt es nicht zu der Client-Wahl in
Receiver-SW. Der Sender-SW (Rezeptbuch) hat sowieso nur seinen eigenen Tab
als Controlled Client.

---

## 5. Fix-Vorschlag für die Folge-Sitzung

### Ziel

Jeder SBKIM-SW darf nur Pfade abfangen, die **innerhalb seines eigenen
Scope** liegen. Cross-PWA-Pfade fallen durch (kein `respondWith`) → gehen
ins Netzwerk → erhalten dort 404 von statischem Pages.

### Code (Vorschlag, von Spec-Sitzung zu bestätigen)

```js
// Statt isPathSuffix(...):
function isOwnEndpoint(pathname, endpointPath) {
  // Eigener Scope-Pfad als URL-pathname (z.B. "/Mein-Mixarium/" oder "/")
  var scopePath = new URL(self.registration.scope).pathname;
  var expected;
  if (scopePath === "/") {
    expected = endpointPath;                              // z.B. "/sbkim/anastomosis"
  } else {
    expected = scopePath.replace(/\/$/, "") + endpointPath; // z.B. "/Mein-Mixarium/sbkim/anastomosis"
  }
  return pathname === expected;
}
```

Im fetch-Listener `isPathSuffix(...)` durch `isOwnEndpoint(...)` ersetzen
für `ANASTOMOSIS_PATH`, `LEGACY_PATH`, `HETEROKARYOSIS_PATH`.

### Folgen

- **Mein-Rezeptbuch-Tab → `/Mein-Mixarium/sbkim/anastomosis`:**
  Mein-Rezeptbuchs SW prüft `isOwnEndpoint("/Mein-Mixarium/sbkim/anastomosis", "/sbkim/anastomosis")`
  mit eigenem scopePath `/Mein-Rezeptbuch/` → erwartet
  `/Mein-Rezeptbuch/sbkim/anastomosis`, bekommt `/Mein-Mixarium/sbkim/anastomosis` → `false`.
  Kein `respondWith`, Event fällt durch zu nächstem Listener / Network.
- **Same-origin Cross-PWA Handshake via SW-Bridge ist damit **architekturisch
  nicht mehr möglich** (war auch vorher kaputt, fiel nur nicht so auf).
- Spec-Sitzung Modul 05 sollte BroadcastChannel-Bridge oder direkten
  `receiveHandshake`-Aufruf als alternative Architektur erwägen.

### NICHT angefasst

- `clients.matchAll`-Loop-Logik aus PR #70 bleibt (korrekt für sein Szenario).
- `SBKIM_SW_STANDALONE`-Flag.
- Modul 05 `05_anastomose.js` `receiveHandshake`.
- INTERFACES.md (es sei denn, dort wird `isOwnEndpoint`-Konvention
  hinzugefügt als § „Scope-Hygiene").

---

## 6. Pflege-Lektionen für Folge-Sitzungen

### A. Diagnose-Pflicht — NICHT raten

Wenn ein Symptom auftritt, das nicht erwartet ist:

1. **Welcher SW intercepted?** `navigator.serviceWorker.controller.scriptURL`
   im Tab, der die Fetch initiiert. Das ist der entscheidende SW. NICHT
   der SW im Ziel-Scope.
2. **Hat der laufende SW den erwarteten Bytecode?** Distinguishing-Test
   (Receiver-Tab schließen, Probe-Fetch, Antwort vergleichen):
   - Alter SW: Phantom-Rejection (`toNodeId stimmt nicht`)
   - Neuer SW: HTTP 503 (`keine aktive controlled Page-Instanz`)
3. **Pages serviert die erwartete Datei?** `fetch(url+'?nc='+Date.now())`,
   auf bekannte Strings prüfen.
4. **Chrome's interner Cache?** chrome://serviceworker-internals/ →
   komplette Registrierung anschauen. Unregister bei Verdacht.
5. **Alle Tabs wirklich zu?** Tab-Übersicht prüfen — „Neuer Tab"-Karten
   und Karten zu PWA-URLs sehen ähnlich aus.
6. **Identität in IDB?** `await SbkimSpore.getOwnSpore()` → `.id` lesen.
   Bei `undefined` Verdacht auf Eviction.

Wenn alle 6 Punkte konsistente Daten geben und das Symptom unklar bleibt
→ **Sitzung sauber beenden**, Befund in PULS.md, eigene Spec-Sitzung
triggern. Nicht stundenlang in Cache-Hacks verbeißen wie heute.

### B. SW-Update-Konvention (Empfehlung für alle Endknoten)

- `app-sw.js` MUSS `SW_VERSION`-Konstante haben.
- Bei JEDER Änderung in `app-sw.js` ODER `sbkim-sw.js` (importScripts-Target)
  MUSS SW_VERSION inkrementiert werden.
- Empfehlung: kleines `bump-sw.sh`-Skript pro Endknoten-Repo:
  ```bash
  #!/bin/bash
  cur=$(grep -oE "[a-z]+-sw-v[0-9]+" app-sw.js | head -1)
  num=$(echo $cur | grep -oE '[0-9]+$')
  new=$(echo $cur | sed "s/v$num/v$((num+1))/")
  sed -i "s/$cur/$new/g" app-sw.js
  echo "Bumped: $cur → $new"
  git add app-sw.js && git commit -m "SW_VERSION $cur → $new"
  ```
- Chrome detektiert `importScripts`-Bytes-Change NICHT als SW-Update.
  Empfehlung: bei wirklich kritischen Änderungen Datei umbenennen
  (z.B. `sbkim-sw-v23.js`) statt nur Inhalt zu ändern.

### C. Persist + Backup als Standardpfad für Endknoten-Betreiber

- `navigator.storage.persist()` einmal manuell aufrufen (oder im Modul 01
  Init-Pfad automatisch — bereits live seit Stufe-1-Pflege).
- Modul 00 zeigt „Backup empfohlen"-Tipp wenn `storagePersisted: false`.
- `__sbkimErzeugeSpore()` ist idempotent — Wiederausführen löscht keine
  bestehende Identität.

### D. Same-Origin Cross-PWA: architekturisch nicht via SW-Bridge

Klaus' Test-Setup (zwei PWAs auf `lausiklauskn-png.github.io`) kann
Cross-PWA Handshake **nicht** via SW-Bridge testen. Folge-Sitzungen
sollten das **nicht weiter zu lösen versuchen**, sondern eine der
folgenden Optionen erwägen:

- **A:** BroadcastChannel-Bridge für same-origin (Sender postet auf
  Channel, Receiver lauscht). Müsste in Modul 05 als Fallback-Pfad rein.
- **B:** Test auf zwei wirklich getrennten Domains (Custom-Domain
  oder Zweit-GitHub-Account für Mein-Mixarium).
- **C:** Direkter `SbkimAnastomose.receiveHandshake(...)`-Aufruf in
  Receiver-Tab via Channel/postMessage. Klaus' Workaround vom 16.5.

---

## 7. Folge-Sitzungs-Brief (für die nächste Pflege-Sitzung)

Der vollständige Brief liegt im Chat-Verlauf dieser Sitzung. Kurzform für
das Archiv:

**Branch:** `claude/pflege-sw-isPathSuffix-scope-fix`
**Typ:** Pflege-Sitzung, headless, EINE Phase. Nur `src/sbkim-sw.js` +
Doku-Verschiebungen.

**Pflichtlektüre (in der Reihenfolge):**
1. `CLAUDE.md`
2. `docs/PULS.md` (besonders der oberste Eintrag — diese Sitzung — und
   der darunter, PR #70)
3. Dieses Übergabeprotokoll (`docs/sessions/archiv/2026-05-17_pflege-sw-isPathSuffix-scope-fund.md`)
4. `docs/sessions/archiv/2026-05-17_pflege-sw-phantom-clients-fix.md` (PR #70)
5. `docs/INTERFACES.md`
6. `docs/components/09_einbau_pwa.md`
7. `src/sbkim-sw.js` komplett
8. `src/modules/05_anastomose.js` Zeilen 540-660

**Aufgabe:** `isPathSuffix` durch scope-bewusste Variante ersetzen (siehe
§5). `node --check src/sbkim-sw.js` muss grün sein. Klaus muss nach Merge
die neue `sbkim-sw.js` in beide Endknoten kopieren + Mein-Mixariums
`app-sw.js` SW_VERSION bumpen + Mein-Rezeptbuchs `app-sw.js` evtl. um
SW_VERSION-Konvention erweitern.

**Was die Sitzung NICHT macht:**
- Spec-Erweiterung Modul 05 (BroadcastChannel-Bridge) — eigene Spec-Sitzung.
- Endknoten-Bytecode-Cache-Diskussionen — siehe §6 für Konvention.
- Modulübergreifende Refactors.

**Erwartetes Ergebnis:** Same-origin Cross-PWA Handshake liefert HTTP 404
(richtiges Verhalten — Sender-SW lässt Cross-Scope-Path durch, Pages hat
keinen Endpoint). Same-PWA Handshake (Mein-Mixarium ↔ Mein-Mixarium über
SW-Bridge) funktioniert wie zuvor.

---

## 8. Klaus' Repo-Stand am Sitzungsende

### Mein-Mixarium (`~/Mein-Mixarium/`)
- `sbkim/sbkim-sw.js`: aus PR #70 (mit `includeUncontrolled:false`-Fix + Loop)
- `sbkim/sbkim-sw-v23.js`: Kopie der gleichen Datei (für Chrome-Cache-Bypass)
- `app-sw.js`: SW_VERSION `'mixarium-sw-v23'`, importScripts `"./sbkim-sw-v23.js"`
- `sbkim/spore.json`: nodeId `1kpcdq_heJnlJXMFCZAhGbKg5KRl2YcBJXZhZrspXnM`
- Letzter Push-Commit: `8eac7d2` Rename sbkim-sw.js → sbkim-sw-v23.js

### Mein-Rezeptbuch (`~/Mein-Rezeptbuch/`)
- `sbkim/sbkim-sw.js`: aus PR #70 (mit Fix)
- `app-sw.js`: unverändert (1215 Bytes, KEINE SW_VERSION-Konvention,
  GET-only fetch-Listener, importScripts `"./sbkim-sw.js"`)
- `sbkim/spore.json`: nodeId `ktlJBO3W_oGbY4hlj9KW-JDYkvEfYAVves62XDbm_AM`

### Klaus' Chrome-Stand
- Mein-Mixarium SW manuell deregistriert via chrome://serviceworker-internals/
  am Sitzungsende.
- Mein-Rezeptbuch SW lebt.
- IDBs in beiden Endknoten intakt mit `Storage persist-Status: true`.
- Drei Tabs offen am Ende: Mein-Rezeptbuch + „Neuer Tab" + Sage-Page-Chat.

### Sage-Protokol
- Branch: `claude/fix-test-panel-button-7-Iwf1E` mit `origin/main` gemerged.
- PR #70 (`bd895d3`) auf main.
- Diese Sitzung commit: TBD (siehe nächster Commit nach diesem Schreiben).
- KEIN neuer PR aus dieser Sitzung — nur PULS.md-Update +
  Übergabeprotokoll + CLAUDE.md-Schutzklausel.

---

## 9. Nächster sinnvoller Schritt

1. **Klaus:** Den vollständigen Brief (Chat-Antwort) als ersten Prompt der
   Folge-Sitzung kopieren.
2. **Folge-Sitzung** auf Branch `claude/pflege-sw-isPathSuffix-scope-fix`
   den Scope-Fix bauen, PR als Draft eröffnen.
3. **Nach Merge:** Klaus zieht neue `sbkim-sw.js` in beide Endknoten nach,
   bumpt SW_VERSION in `app-sw.js` (oder benennt importScripts-Target neu).
4. **Distinguishing-Test wiederholen** — erwartet HTTP 404 für Cross-PWA-Pfade.
5. **Spec-Sitzung Modul 05** (eigener Brief, später): BroadcastChannel-
   Bridge für same-origin Cross-PWA, falls Test-Setup das braucht.

---

**Vorgänger:** Pflege-Sitzung Phantom-Clients (PR #70, 2026-05-17 morgens).
**Branch dieser Sitzung:** `claude/fix-test-panel-button-7-Iwf1E`.
