# Pflege 2026-05-17 — Scope-Fix für `isPathSuffix` in `sbkim-sw.js`

**Sitzungs-Rolle:** Pflege-Sitzung, headless, EINE Phase. Branch
`claude/fix-sw-scope-paths-I70qE` (vom Harness vergebener Name; thematisch
identisch mit dem im Sitzungs-Brief vorgesehenen
`claude/pflege-sw-isPathSuffix-scope-fix`).
Folge-Pflege zur Test-Erkenntnis-Sitzung vom 2026-05-17 Nachmittag
(Architekturfund `isPathSuffix` scope-unbewusst, kein PR daraus entstanden).

---

## 1. Vorgeschichte (Kurzfassung — Details in den beiden direkten Vor-Protokollen)

- **2026-05-16:** Cross-Knoten-Handshake live (PR #65). Phantom-Cache-Bug in
  SW-Bridge bemerkt, mit direktem `receiveHandshake`-Aufruf umgangen.
- **2026-05-17 morgens (PR #70, `bd895d3`):** `sbkim-sw.js`
  `clients.matchAll` von `includeUncontrolled:true` auf `false` umgestellt
  + Loop-Logik „alle controlled Clients der Reihe nach". Korrekt für sein
  Szenario.
- **2026-05-17 nachmittags (Test-Erkenntnis-Sitzung):** A-Test mit altem SW
  reproduzierte Phantom-Symptom ✓. B-Test mit neuem SW v23 (nach voller
  Cache-Eskalation: SW_VERSION-Bump, Cache-Bust-Query, File-Rename auf
  `sbkim-sw-v23.js`, chrome://serviceworker-internals/ Unregister +
  Force-Stop) zeigte **dieselbe** Phantom-Rejection. Probe-Fetch entlarvte
  den eigentlichen Responder: Mein-Rezeptbuchs SW fängt den
  `/Mein-Mixarium/...`-Fetch ab, nicht Mein-Mixariums SW.

→ **Wurzel:** `isPathSuffix("/Mein-Mixarium/sbkim/anastomosis",
"/sbkim/anastomosis") === true`, weil der Pfad auf `/sbkim/anastomosis`
endet. Damit fängt JEDER SBKIM-SW JEDEN Pfad ab, der auf einem der drei
Endpoint-Pfade endet — unabhängig vom eigenen Scope.

**Spec-Klarheit:** Subresource-Fetches von einem controlled client gehen
durch DESSEN kontrollierenden SW — NICHT durch den SW, dessen Scope die
URL trifft. Same-origin cross-PWA Handshake via SW-Bridge ist damit
**konzeptuell nicht möglich** (das ist Spec, kein Bug).

---

## 2. Fix in `src/sbkim-sw.js`

### Was geändert

`isPathSuffix(pathname, endpointPath)` ersetzt durch
`isOwnEndpoint(pathname, endpointPath)`. Die neue Funktion leitet den
erwarteten URL-Pfad aus `self.registration.scope` ab und prüft strikt auf
Gleichheit:

```js
function isOwnEndpoint(pathname, endpointPath) {
  const scopePath = new URL(self.registration.scope).pathname;
  const expected = (scopePath === "/")
    ? endpointPath
    : scopePath.replace(/\/$/, "") + endpointPath;
  return pathname === expected;
}
```

Aufrufe in der fetch-Listener-Logik wurden für `ANASTOMOSIS_PATH`,
`LEGACY_PATH`, `HETEROKARYOSIS_PATH` von `isPathSuffix` auf
`isOwnEndpoint` umgestellt. Ausführlicher Kommentar-Block über der
Funktion erklärt die Scope-Hygiene und nennt die Variante-3c-Begrenzung
(siehe unten) explizit.

### Manuell durchgespielt (Pseudo-Trace)

| Konstellation | scopePath | endpointPath | erwarteter Pfad | Anfrage-Pfad | Ergebnis |
|---|---|---|---|---|---|
| Mein-Mixarium-SW intercepted In-Scope-Anfrage | `/Mein-Mixarium/` | `/sbkim/anastomosis` | `/Mein-Mixarium/sbkim/anastomosis` | `/Mein-Mixarium/sbkim/anastomosis` | `true` → `handleBridge` ✓ |
| Mein-Rezeptbuch-SW intercepted Cross-Scope-Anfrage | `/Mein-Rezeptbuch/` | `/sbkim/anastomosis` | `/Mein-Rezeptbuch/sbkim/anastomosis` | `/Mein-Mixarium/sbkim/anastomosis` | `false` → kein respondWith → Network → 404 ✓ |
| Root-Scope (Custom-Domain oder User-Pages) | `/` | `/sbkim/anastomosis` | `/sbkim/anastomosis` | `/sbkim/anastomosis` | `true` → `handleBridge` ✓ |
| LEGACY-Endpoint im Scope | `/Mein-Mixarium/` | `/sbkim/legacy` | `/Mein-Mixarium/sbkim/legacy` | `/Mein-Mixarium/sbkim/legacy` | `true` → `handleBridge` ✓ |
| HETEROKARYOSIS-Endpoint im Scope | `/Mein-Mixarium/` | `/sbkim/heterokaryosis` | `/Mein-Mixarium/sbkim/heterokaryosis` | `/Mein-Mixarium/sbkim/heterokaryosis` | `true` → `handleBridge` ✓ |

### Variante-3c-Begrenzung (bewusst nicht abgedeckt)

In Variante 3c (Karte 09 § Wann welche Variante, „nachrangig /
Übergangslösung") liegt der SBKIM-SW unter `<repo>/sbkim/sbkim-sw.js` mit
Scope `/<repo>/sbkim/`. Dort wäre der erwartete Pfad
`scopePath + tail-of-endpoint` (also nur z.B. `/anastomosis`) statt
`scopePath + endpoint`. Die neue `isOwnEndpoint` würde dort `expected =
"/<repo>/sbkim/sbkim/anastomosis"` konstruieren und nie matchen.

**Konsequenz:** Variante 3c würde mit diesem Fix still durchfallen
(kein respondWith → Network → 404). Klaus' beide Endknoten nutzen
Variante 3b, niemand sonst nutzt 3c produktiv. Karte 09 markiert 3c
explizit als „spätere Wechsel auf 3b ist Pflicht, sobald Schutz-Module
11/12 ziehen". Ein eventueller 3c-Support gehört in eine eigene
Spec-Sitzung, nicht in diese Pflege.

### Validierung

- `node --check src/sbkim-sw.js` grün.
- Manueller Durchspiel-Trace oben.
- Datei wächst von 251 auf 274 Zeilen (rein interne SW-Logik + erweiterter
  Kommentar-Block).
- `tests/manual_check.html` **nicht angepasst** — die Tests dort nutzen
  keinen Service-Worker, sondern die Modul-APIs direkt. Der SW-Pfad ist
  nur in den Endknoten-PWAs aktiv und wird dort manuell von Klaus geprüft.

---

## 3. Was NICHT angefasst wurde (Disziplin gemäß Brief)

- `clients.matchAll`-Logik (PR #70's Fix bleibt — er ist korrekt für sein
  Szenario, vgl. § 4 Test-Erkenntnis-Sitzung).
- `SBKIM_SW_STANDALONE`-Flag.
- `src/modules/05_anastomose.js` (`receiveHandshake` + `buildResponse`
  unverändert).
- `docs/INTERFACES.md` (kein § „Scope-Hygiene-Hinweis" eingefügt — der
  ausführliche Kommentar-Block in `src/sbkim-sw.js` direkt über
  `isOwnEndpoint` ist die Quelle der Wahrheit; INTERFACES.md §3
  Endpunkt-Pfade beschreibt den Vertrag, nicht die SW-Interna).
- `docs/components/09_einbau_pwa.md` (die Andock-Anleitung beschreibt
  Variante 3a/3b mit Scope `/<repo>/` — passt zum Fix; Variante 3c
  unverändert dokumentiert).
- `status.json` (kein Score-Wechsel). `update_puls_pie.py` NICHT
  aufgerufen.
- `PROTOCOL_VERSION` bleibt `"0.1"`.
- Endknoten-Repos (`Mein-Mixarium`, `Mein-Rezeptbuch`) — Klaus' Hand,
  siehe § 4.

---

## 4. Klaus' Pflichtaufgaben nach Merge

Damit der Fix in den Endknoten wirkt:

```bash
# 1. Neue sbkim-sw.js in beide Endknoten kopieren
cd ~/Sage-Protokol && git checkout main && git pull
cp src/sbkim-sw.js ~/Mein-Mixarium/sbkim/sbkim-sw.js
cp src/sbkim-sw.js ~/Mein-Rezeptbuch/sbkim/sbkim-sw.js

# 2a. Mein-Mixarium: SW_VERSION-Bump + optional importScripts-Target neu
cd ~/Mein-Mixarium
# Wenn weiterhin sbkim-sw-v23.js per importScripts: dann auch
# sbkim-sw-v23.js neu kopieren ODER zurück auf sbkim-sw.js + neuer Name.
# Saubere Variante: zurück auf sbkim-sw.js + SW_VERSION v23 → v24
#   sed -i 's|sbkim-sw-v23.js|sbkim-sw.js|' app-sw.js
#   sed -i 's|mixarium-sw-v23|mixarium-sw-v24|' app-sw.js
git add sbkim/sbkim-sw.js app-sw.js
git commit -m "sbkim-sw.js: scope-bewusste isOwnEndpoint nachgezogen, SW_VERSION v24"
git push

# 2b. Mein-Rezeptbuch: hat keine SW_VERSION-Konvention.
# Empfohlen für diese Pflege: einmalig File-Rename als Cache-Bust:
cd ~/Mein-Rezeptbuch
mv sbkim/sbkim-sw.js sbkim/sbkim-sw-v2.js
sed -i 's|sbkim-sw.js|sbkim-sw-v2.js|' app-sw.js   # in importScripts-Zeile
git add sbkim/sbkim-sw-v2.js app-sw.js
git rm sbkim/sbkim-sw.js
git commit -m "sbkim-sw.js: scope-bewusste isOwnEndpoint nachgezogen, File-Rename als Cache-Bust"
git push

# 3. Pages-Build abwarten (~90 s)

# 4. Beide PWA-Tabs schließen + App neu starten

# 5. Distinguishing-Test im Mein-Rezeptbuch-Tab in Eruda:
#    fetch('https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/anastomosis?nc='+Date.now(),
#      {method:'POST', headers:{'Content-Type':'application/json'},
#       body: JSON.stringify({probe:1})})
#      .then(r => r.status + ' ' + r.statusText);
```

**Erwartung diesmal:**
- **Status 404** (HTML von GitHub Pages, kein SW im Path-Suffix mehr) —
  weil Mein-Rezeptbuchs SW den Cross-Scope-Pfad jetzt durchfallen lässt
  und Pages keinen statischen Endpoint dort hat.

Wenn statt 404 weiterhin eine 200-Phantom-Rejection kommt → der alte
Bytecode-Cache lebt noch. Dann § 4.2b File-Rename-Pfad konsequent
nochmal anwenden (anderer Dateiname, neuer SW-Install-Cycle erzwungen).

**Für den eigentlichen same-PWA-Handshake-Test** (Mein-Mixarium ↔
Mein-Mixarium, zwei Tabs derselben PWA) bleibt der PR #70-Pfad aktiv:
controlled Client-Loop wählt den richtigen Tab.

---

## 5. Was diesen Fix NICHT löst

Same-origin cross-PWA Handshake (Klaus' heutiges Test-Setup mit beiden
PWAs auf `lausiklauskn-png.github.io`) bleibt nach diesem Fix
**konzeptuell unmöglich** via SW-Bridge — und das ist korrekt. Der
Receiver-SW kommt nie zu Wort, weil der Sender-SW den Fetch sieht.

Für künftige produktive Cross-Domain-Handshakes (z.B. Mein-Mixarium auf
einer Custom-Domain oder einem zweiten GitHub-Account) funktioniert
SW-Bridge weiterhin wie gehabt — die Domains sind dann unterschiedlich
und der Receiver-SW empfängt direkt.

Für Klaus' lokales Test-Setup (gleiche Origin) braucht es eine andere
Test-Architektur. Empfehlung aus der Test-Erkenntnis-Sitzung
(2026-05-17 Nachmittag, § 3):

- **Option A — BroadcastChannel-Bridge in Modul 05** (empfohlen für eine
  Folge-Spec-Sitzung): Sender postet Request auf
  `BroadcastChannel('sbkim')`, Receiver lauscht und antwortet. Umgeht
  SW-Bridge komplett. Müsste als Fallback-Pfad in `05_anastomose.js`
  eingebaut werden, additiv zum HTTP-Pfad.
- **Option B** — Test auf zwei wirklich getrennten Domains. Setup-
  Aufwand für Klaus.
- **Option C** — Direkter `SbkimAnastomose.receiveHandshake(...)` per
  postMessage von Tab zu Tab (Klaus' Workaround vom 16.5.).

Empfehlung: **Option A als nächste Spec-Sitzung Modul 05** anstoßen,
sobald Klaus den Distinguishing-Test mit dem hier gefixten SW gelaufen
hat und das 404-Verhalten gesehen ist.

---

## 6. Pflege-Lektionen aus dieser Sitzung

- **Diagnose-Pflicht vor Code:** der Brief listete sechs konkrete
  Schritte (§ 5 Brief: welcher SW intercepted? hat er den erwarteten
  Bytecode? Pages serviert was? Chrome-Cache? alle Tabs zu? Identität in
  IDB?). Diese Liste hat sich in den Vor-Sitzungen bewährt — sie ist
  Pflichtroutine vor jedem Code-Eingriff am SW.
- **Architektur-Grenze ehrlich nennen, nicht maskieren:** Same-origin
  cross-PWA Handshake via SW-Bridge ist Spec-bedingt unmöglich. Wir
  fixen den falsch-positiven Intercept, NICHT die fehlende Architektur.
- **Bestehende Schichten nicht umfärben:** PR #70's Fix bleibt, weil er
  für sein Szenario korrekt ist. Eine Pflege, die zwei Bugs auf einmal
  „aufräumt", verliert die Trennschärfe und macht spätere Rückrollen
  schwer.

---

## 7. Brief für die nächste Sitzung

Es gibt **keinen direkten Folge-Pflege-Brief** für `sbkim-sw.js` — die
SW-Schicht ist mit diesem Fix für ihren Verantwortungsbereich (eigener
Scope) abgeschlossen, bis ein neuer Befund kommt.

Empfohlene nächste Sitzung: **Spec-Sitzung Modul 05 — BroadcastChannel-
Bridge als Fallback für same-origin cross-PWA**. Brief-Skelett:

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Pflichtleseliste:
1. CLAUDE.md
2. docs/PULS.md (Schnellüberblick + die drei 2026-05-17-Einträge)
3. docs/INTERFACES.md § Modul 05 + § 2 Anfrage (Query)
4. docs/components/05_anastomose.md
5. src/modules/05_anastomose.js komplett
6. src/sbkim-sw.js komplett (für Kontext zur Architektur-Grenze)
7. docs/sessions/archiv/2026-05-17_pflege-sw-isPathSuffix-scope-fund.md
   (begründet, warum SW-Bridge same-origin cross-PWA nicht trägt)

Aufgabe:
- Karte 05 um § „BroadcastChannel-Bridge (same-origin Fallback)"
  erweitern. Vier-Funktionen-API-Erweiterung skizzieren (Sender postet,
  Receiver lauscht in `init()`, Cleanup in `forgetSibling`).
- INTERFACES.md § Modul 05 + § 3 Endpunkt-Pfade nachziehen
  (Channel-Name verbindlich machen).
- Entscheidung treffen: Fallback automatisch (Sender probiert HTTP
  zuerst, fällt bei `outcome:"rejected"`-Phantom oder 404 auf
  Channel zurück) ODER explizit (Aufrufer wählt Pfad).
- KEIN Code in src/modules/05_anastomose.js.

Was du NICHT tust:
- Kein Bau-Code. Bau-Sitzung folgt separat.
- Keine Umbauten am SW-Pfad — der ist mit isOwnEndpoint abgeschlossen.
- Keine Spec-Erweiterungen an anderen Modulen.

Pflicht am Ende: Karte 05 + INTERFACES.md + PULS-Eintrag +
Übergabeprotokoll + Vorgeschlagene-nächste-Schritte-Block.
```

---

## 8. Klaus' Repo-Stand am Sitzungsende (unverändert ggü. vorheriger Sitzung)

### Mein-Mixarium (`~/Mein-Mixarium/`)
- `sbkim/sbkim-sw.js` und `sbkim/sbkim-sw-v23.js`: aus PR #70 (mit
  Phantom-Clients-Fix, OHNE Scope-Fix dieser Sitzung — wird in Klaus'
  Nachzieh-Schritt aktualisiert).
- `app-sw.js`: SW_VERSION `'mixarium-sw-v23'`,
  importScripts `"./sbkim-sw-v23.js"`.
- `sbkim/spore.json`: nodeId
  `1kpcdq_heJnlJXMFCZAhGbKg5KRl2YcBJXZhZrspXnM`.
- Letzter Push-Commit: `8eac7d2` (Rename
  `sbkim-sw.js` → `sbkim-sw-v23.js`).
- SW manuell deregistriert am Sitzungsende der Test-Erkenntnis-Sitzung
  — d.h. der nächste Tab-Reload registriert frisch.

### Mein-Rezeptbuch (`~/Mein-Rezeptbuch/`)
- `sbkim/sbkim-sw.js`: aus PR #70 (mit Phantom-Clients-Fix, OHNE
  Scope-Fix).
- `app-sw.js`: 1215 Bytes, KEINE SW_VERSION-Konvention, GET-only
  fetch-Listener, importScripts `"./sbkim-sw.js"`.
- `sbkim/spore.json`: nodeId
  `ktlJBO3W_oGbY4hlj9KW-JDYkvEfYAVves62XDbm_AM`.
- SW lebt aktiv.

### Sage-Protokol
- Branch dieser Sitzung: `claude/fix-sw-scope-paths-I70qE`.
- Commit dieser Sitzung: siehe nächster commit nach Schreiben dieses
  Protokolls.
- PR als Draft eröffnet (URL siehe Chat-Antwort am Sitzungsende).

---

## 9. Nächster sinnvoller Schritt

1. **Klaus:** Diesen Fix-PR mergen, danach Schritte aus § 4 in beiden
   Endknoten ausführen, Distinguishing-Test laufen lassen.
2. **Bei 404 als Antwort:** Architektur-Grenze ist sauber verifiziert,
   Sitzung erfolgreich abgeschlossen.
3. **Bei weiterhin 200-Phantom:** File-Rename-Pfad konsequent anwenden
   (§ 4.2b — anderer Dateiname als bisher, das erzwingt SW-Install
   garantiert).
4. **Danach Spec-Sitzung Modul 05** (Brief in § 7) für
   BroadcastChannel-Bridge — das macht Klaus' lokales Test-Setup
   überhaupt erst Cross-PWA-Handshake-fähig.

---

**Branch:** `claude/fix-sw-scope-paths-I70qE`.
**Vorgänger:** Pflege Phantom-Clients (PR #70, 2026-05-17 morgens) +
Test-Erkenntnis-Sitzung (2026-05-17 nachmittags, kein PR).
