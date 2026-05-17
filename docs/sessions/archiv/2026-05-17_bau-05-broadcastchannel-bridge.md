# Bau 2026-05-17 — Modul 05 BroadcastChannel-Bridge implementiert

**Sitzungs-Rolle:** Bau-Sitzung, headless, EINE Phase. Branch
`claude/bau-05-broadcastchannel-bridge-xVjoF` (Harness-vergebener
Name; thematisch identisch zum im Brief vorgesehenen
`claude/bau-05-broadcastchannel-bridge`). Direkte Folge zur Spec-
Sitzung BroadcastChannel-Bridge (PR #74, `a5bbd60`).

---

## 1. Vorgeschichte (Kurzform)

Sieben Sitzungen seit 2026-05-16 am SW-/Channel-Pfad:

| Datum | Sitzung | PR | Befund |
|---|---|---|---|
| 2026-05-16 | Live-Andock Cross-Knoten-Handshake | #65 | Etabliert via direktem `receiveHandshake`-Aufruf (localStorage-Bypass). SW-Bridge-Phantom-Cache-Bug entdeckt. |
| 2026-05-17 morgens | Phantom-Clients-Fix | #70 | `includeUncontrolled:false` + Loop. Korrekt aber nicht hinreichend. |
| 2026-05-17 mittags | A/B-Test-Erkenntnis | — | `isPathSuffix` scope-unbewusst. **Architektur-Klarheit:** same-origin cross-PWA via SW-Bridge konzeptuell unmöglich. |
| 2026-05-17 nachmittags | Scope-Fix `isOwnEndpoint` | #72 | Cross-Scope-Pfade fallen sauber durch. |
| 2026-05-17 nachmittags | Klaus-Sichttest Endknoten | #73 | POST → 405, GET → 404 direkt von Pages. Architektur-Grenze beidseitig verifiziert. |
| 2026-05-17 abends | Spec BroadcastChannel-Bridge | #74 | INTERFACES.md + Karte 05 additiv um Channel-Fallback-Transport erweitert. |
| **2026-05-17 nach #74** | **Bau BroadcastChannel-Bridge** | **diese Sitzung** | **Channel-Pfad in `src/modules/05_anastomose.js` implementiert.** |

Stand `main` beim Sitzungsstart: `a5bbd60` (Sage-Protokol nach
PR #74-Merge). `PROTOCOL_VERSION = "0.1"` unverändert.

---

## 2. Pflicht-Diagnostik vor Code-Eingriff (Brief § 3)

Alle fünf Punkte grün:

1. `a5bbd60` ist auf `main` ✓ (`git log --oneline -1` → „Spec Modul 05: BroadcastChannel-Bridge als same-origin Fallback (#74)").
2. Karte 05 § BroadcastChannel-Bridge auf `main` lesbar ✓ (Zeile 469 in `docs/components/05_anastomose.md`).
3. INTERFACES.md §3 zweiter Sub-Block „Same-origin Fallback-Transport für Modul 05" da ✓ (Zeile 1818 ff. — `channel-bridge  : BroadcastChannel('sbkim')`).
4. `src/modules/05_anastomose.js` hat die bestehenden Test-Brücken `_invokeDirect` + `_setOwnDomainVector` ✓.
5. `tests/manual_check.html` Panel 05 hatte neun Knöpfe (Setup + Tests 1–7 + Selbstcheck) ✓ — nach dieser Sitzung 13.

---

## 3. Was geändert

### 3.1 `src/modules/05_anastomose.js` (additiv, KEIN Refactoring der bestehenden Pfade)

**Zwei neue Error-Klassen** (Factory-Stil `makeError(name, message,
cause)`, analog zu den sechs bestehenden):

- `InvalidTransportError` — `options.transport` außerhalb
  `{"auto","http","channel"}`, oder `options` selbst kein Objekt.
- `MissingToNodeIdError` — Channel-Pfad ohne `request.toNodeId`;
  wird synchron vor jeglichem BroadcastChannel-Bau geworfen.

**Drei Transport-Konstanten + eine Schema-Pflichtfeld-Liste:**

```js
var ALLOWED_TRANSPORTS = ["auto", "http", "channel"];
var BROADCAST_CHANNEL_NAME = "sbkim";
var REPLY_CHANNEL_PREFIX = "sbkim:reply:";
var RESPONSE_REQUIRED_FIELDS = [
  "fromNodeId", "nonceEcho", "outcome", "protocolVersion",
  "receiverSpore", "signature", "timestamp", "toNodeId",
];
```

**`setupBroadcastChannelBridge()`** (Closure, eager in `init()`
direkt nach `setupServiceWorkerBridge()` aufgerufen — E3):

- Strukturanalog zu `setupServiceWorkerBridge`.
- Einmaliger Main-Channel-Listener via `channelBridgeRegistered`-
  Flag (kein Doppel-Abo bei `init()`-Idempotenz).
- Defensiver `typeof BroadcastChannel === "undefined"`-Check
  (headless Node ohne BroadcastChannel-API → leerer Return, kein
  Throw, kein Log-Spam).
- Filter: `event.data.type === "SBKIM_ANASTOMOSE_REQUEST"` +
  `payload.toNodeId === ownId` + `payload.fromNodeId !== ownId`
  (Self-Hit-Schutz, E7) + `replyChannelName.startsWith("sbkim:reply:")`
  (Plausibilität).
- Ruft `receiveHandshake(payload)` (unverändert), fängt synthetisch
  defensiv (Spec: wirft nie). Postet Response-Envelope auf
  dediziertem `BroadcastChannel(replyChannelName)`, schließt diesen
  im `finally` (E6).

**`postChannelEnvelope(request)`** (Closure, neue Test-Brücke
exponiert):

- Synchrone Vor-Checks: `request.toNodeId` (sonst
  `MissingToNodeIdError`) + `request.nonce` (sonst
  `HandshakeNetworkError`).
- Defensiver `typeof BroadcastChannel === "undefined"`-Throw
  (`HandshakeNetworkError`) für reine Node-Umgebungen ohne API.
- `replyChannelName = REPLY_CHANNEL_PREFIX + request.nonce`.
- Reply-Channel **vor** dem Main-Channel öffnen (verhindert Race:
  Receiver könnte den Reply posten, bevor wir lauschen).
- Timeout `QUERY_TIMEOUT_MS` (4000 ms — keine neue Konstante, E4)
  via `setTimeout`+`clearTimeout`; bei Timeout
  `HandshakeTimeoutError` mit Message „Channel-Reply > 4000 ms
  ausgeblieben".
- Reply-Listener filtert `event.data.type ===
  "SBKIM_ANASTOMOSE_RESPONSE"` + `payload.nonceEcho ===
  request.nonce` (Doppelt-Bindung gegen Cross-Talk; Mismatch
  → `HandshakeSignatureInvalidError`).
- `finally`: Reply-Channel-`close()` (E6).

**`sendViaChannel(targetSpore, request, preScore, httpCause)`**
(Closure, intern aufgerufen von `handshake()`):

- Ruft `postChannelEnvelope(request)`.
- Bei `HandshakeTimeoutError`-Catch: schreibt Log-Zeile
  `"timeout-channel"` auf `targetSpore.id`.
- Wenn `httpCause` gesetzt (Auto-Fallback-Kette) und der Fehler
  keinen `cause` hat → hängt `httpCause` an als `err.cause`.
- Bei Erfolg: konsumiert die Response via `consumeResponse`
  (verifyForeignSpore + verifyEnvelope + sibling-put + Log
  „established"/„abgelehnt"). **`receiveHandshake` und
  `consumeResponse` bleiben unverändert.**

**`parseTransport(options)`** und **`shouldAutoFallback(httpResponse,
parsedJson)`** als reine Hilfsfunktionen:

- `parseTransport`: Allow-List-Check; `InvalidTransportError` bei
  unbekanntem Wert oder Array/Nicht-Objekt-Container; bei
  `options === undefined` → `transportDefault`-Closure.
- `shouldAutoFallback`:
  - Kein Response-Objekt (Netz-/DNS-Fehler vorher gefangen) →
    `false` (Karte 05 § Auto-Fallback Punkt 3: bei DNS-Fehler ist
    Channel chancenlos).
  - HTTP 4xx/5xx → `true`.
  - `Content-Type` ohne `application/json` → `true`.
  - JSON null oder ohne Pflichtfelder → `true`.
  - `outcome` außerhalb `{"established","rejected"}` → `true`.
  - Sonst `false` (HTTP-Antwort verwertbar, kein Fallback).

**`handshake(targetSpore, ownDomainVector, options?)`** —
Signatur additiv erweitert. Schritte 1–5 unverändert
(Spore-Verify, Versions-Check, lokaler Vor-Check, Request-Build mit
kanonischer Signatur). Neue Logik:

- **Schritt 5b:** `transport === "channel"` überspringt den
  HTTP-Pfad komplett, ruft `sendViaChannel(targetSpore, request,
  preScore, null)`.
- **Schritt 6:** Fetch wird wie bisher mit `AbortController(QUERY_TIMEOUT_MS)`
  versucht. Bei Netz-/DNS-/Abort-Fehler ohne HTTP-Status wird wie
  bisher geworfen (`HandshakeTimeoutError` / `HandshakeNetworkError`)
  — kein Auto-Fallback (Karte 05 § Auto-Fallback Punkt 3).
- **Schritt 6b–6c:** Body wird IMMER versucht als JSON zu parsen
  (vorher: Throw bei `!response.ok`). Bei `transport === "auto"`
  und `shouldAutoFallback(...)` → `sendViaChannel` mit
  synthetischem HTTP-`cause` (Message enthält Status + Content-Type).
- **Schritt 6d:** Bei `transport === "http"` bleibt das alte
  Verhalten — Throw bei `!response.ok` oder fehlendem JSON.
- **Schritt 7:** `consumeResponse(targetSpore, httpJson, preScore)`
  unverändert.

**Drei neue Test-Brücken im Public-Surface:**

- `_setTransport(t)` — Default-Transport-Setter; analog
  `_setOwnDomainVector` ein Closure-Setter, Allow-List-Check via
  `InvalidTransportError`. `null`/`undefined` setzt auf `"auto"`
  zurück.
- `_clearChannelState()` — setzt `transportDefault = "auto"`.
  Der Main-Channel-Listener bleibt registriert (BroadcastChannel-
  Receiver-Disziplin lebt über die Tab-Lebensdauer, E6).
- `_postChannelEnvelope(request)` — direkter Zugriff auf den
  Sender-Roh-Pfad; für Panel-Tests ohne `consumeResponse`/sibling-
  put.

**Vier neue `_meta`-Felder:** `responseRequiredFields`,
`allowedTransports`, `broadcastChannelName`, `replyChannelPrefix`.

### 3.2 `docs/components/09_einbau_pwa.md`

- **§ Schritt 4** unter den Sichtkontroll-Punkt: neuer Sub-Block
  **„Same-origin Cross-PWA-Handshake — Andock-Hinweis"** mit drei
  Bullet-Punkten (beide PWA-Tabs offen halten, HTTP-Pfad bleibt
  Standard mit einmaligem Auto-Fallback, Architektur-Hintergrund
  + Verweis auf Karte 05 § BroadcastChannel-Bridge).
- **§ Sichtkontrolle 5- auf 6-Punkt-Block:** neuer Punkt 6 „(Nur
  same-origin Test-Setup) BroadcastChannel-Bridge-Sichttest" — vier
  Sub-Bullets (beide Tabs offen, Selbstcheck-Knopf in jedem Tab,
  Erwartung `outcome:"established"` mit gegenseitiger sibling-
  Eintragung, Tab-zu-Standalone-Erwartung `HandshakeTimeoutError`
  + Log `"timeout-channel"`).
- Karte 05 § BroadcastChannel-Bridge und INTERFACES.md §3 sind
  **nicht** angetastet (Spec-Stand aus PR #74 verbindlich).

### 3.3 `tests/manual_check.html` Panel 05

Vier neue Knöpfe (Position direkt nach „Selbstcheck Konsole prüfen";
Panel-Knopf-Zahl 9 → 13):

- **Test 9 „Channel-Pfad established (alt → main, intra-tab)":**
  alt baut signierten Request via `_buildSignedRequest`, postet via
  `_postChannelEnvelope` auf `BroadcastChannel('sbkim')`. mains
  Receiver-Listener (eager in `init()`) filtert via `toNodeId`,
  ruft `receiveHandshake`, signiert die Response, postet sie auf
  dem Reply-Channel. Pass-Check: `outcome === "established"` +
  Response-Signatur valide + `alt.nodeId` in `listSiblings()`.
- **Test 9a „Channel-Pfad — toNodeId-Mismatch-Timeout":** Request
  mit fremdem `toNodeId` (zufällige b64url-Zeichenkette). mains
  Receiver filtert raus, kein anderer Receiver, Timeout nach ~4 s.
  Pass-Check: `HandshakeTimeoutError` + `dt >= 3500 ms`.
- **Test 9b „Channel-Pfad — MissingToNodeIdError synchron":**
  `_buildSignedRequest(..., undefined)` baut Request OHNE `toNodeId`.
  `_postChannelEnvelope(request)` wirft `MissingToNodeIdError`,
  bevor ein BroadcastChannel geöffnet wird. Pass-Check: korrekter
  Fehlername + `request.toNodeId === undefined`.
- **Test 9c „Auto-Fallback-Beweis (HTTP 404 → Channel etabliert)":**
  Startet einen Pseudo-Peer-Echo (kurzlebiger BroadcastChannel-
  Listener mit alt404-`nodeId`-Filter + kanonisch signierter
  Response). `targetSpore.endpoint = location.origin +
  "/nicht-vorhanden-fuer-test-9c/"` (404 same-origin).
  `handshake(alt404Spore, mainVec, {transport:"auto"})` → HTTP
  scheitert, Auto-Fallback greift, Pseudo-Echo antwortet,
  `outcome:"established"`. Pass-Check: kein Throw + `outcome ===
  "established"` + `peerNodeId === alt404NodeId`. Hinweis im Output:
  Pseudo-Peer-Echo ist Test-Helfer — in Klaus' Live-Setup ist das
  das zweite Endknoten-Tab.

Mini-Helfer `startPeerEcho(peer)` ist nur im Panel-Scope, nicht im
Modul — Test-Helfer, kein Produktiv-Code.

### 3.4 Karte 05 § Bauzustand

Neue Zeile zwischen „Spec BroadcastChannel-Bridge" und „Sichttest":

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Code BroadcastChannel-Bridge | 2026-05-17 | Bau BC-Bridge | (zwei Error-Klassen, drei Konstanten, vier Closures, Schnittstellen-Erweiterung um `options.transport`, drei neue Test-Brücken; Karte 09 § Schritt 4 + § Sichtkontrolle Punkt 6 nachgezogen; Panel 05 um Knöpfe 9 / 9a / 9b / 9c; `PROTOCOL_VERSION` bleibt `"0.1"`; status.json nicht geändert) |

### 3.5 `docs/PULS.md`

- Tabelle Schnellüberblick Modul 05 nachgezogen: Spec-Fertigstellung
  + Bau-Datum, Sichttest-Hinweis für Knöpfe 9 / 9a / 9b / 9c,
  Anmerkungs-Zeile um Channel-Fallback-Hinweis ergänzt.
- Neuer Sitzungs-Eintrag oben mit vollem Text (sieben Sektionen,
  Code-Eingriffe + Karte-09 + Panel-05 + Validierung + Offene
  Punkte + Klaus-Pflichtaufgaben).

---

## 4. Was nicht angefasst (Disziplin gemäß Brief § 2.3 / § 2.6)

- `receiveHandshake` unverändert.
- `HandshakeRequest` / `HandshakeResponse`-Schema unverändert.
  `PROTOCOL_VERSION = "0.1"`.
- `forgetSibling` / `listSiblings` unverändert.
- Kanonischer Sign/Verify-Pfad unverändert (keine zweite
  Implementation).
- `src/sbkim-sw.js` nicht angetastet (PR #72 `isOwnEndpoint`-Scope-
  Fix bleibt).
- Karte 05 § BroadcastChannel-Bridge + INTERFACES.md §1 Modul 05 /
  §3 / §6 nicht angetastet (Spec-Stand aus PR #74 verbindlich;
  E1–E7 nicht erneut diskutiert).
- Andere Modul-Karten und -Codes (00 / 01 / 02 / 03 / 04 / 06 / 07
  / 08) nicht angetastet.
- `status.json` nicht geändert; `update_puls_pie.py` NICHT
  aufgerufen.

---

## 5. Validierung

- **`node --check src/modules/05_anastomose.js`** grün.
- **Alle 10 Inline-`<script>`-Blöcke** in `tests/manual_check.html`
  per `node --check` einzeln validiert — alle grün.
- **Node-VM-Smoke-Test** der Channel-Plumbing-Logik (kein DOM,
  Node 18+ `globalThis.BroadcastChannel`):
  - `_setTransport('foobar')` → `InvalidTransportError` ✓
  - `_postChannelEnvelope({nonce:'xyz'})` ohne `toNodeId` →
    `MissingToNodeIdError` ✓
  - Round-Trip `_postChannelEnvelope` ↔ Test-Receiver → `outcome:
    "established"` ✓
  - Timeout-Fall (kein Receiver) → `HandshakeTimeoutError` nach
    ~4005 ms ✓
  - `nonceEcho`-Mismatch → `HandshakeSignatureInvalidError` ✓

Browser-Sichttest des Panels (Knöpfe 9 / 9a / 9b / 9c) ist headless
nicht durchführbar (Embedding ~30 MB + IndexedDB + WebCrypto Ed25519
benötigt). Wartet auf Klaus' Browser-Lauf nach Bau-PR-Merge.

---

## 6. Klaus-Pflichtaufgaben nach Merge dieser Bau-PR

1. **`src/modules/05_anastomose.js` in beide Endknoten kopieren**
   (`Mein-Mixarium/sbkim/` + `Mein-Rezeptbuch/sbkim/`). Cache-Bust
   via File-Rename oder Query-Param je nach SW-Setup. Commit + Push
   in beiden Endknoten-Repos.
2. **Beide PWA-Tabs öffnen** (Mein-Rezeptbuch + Mein-Mixarium auf
   `lausiklauskn-png.github.io`). `__sbkimErzeugeSpore()` nur, falls
   nötig.
3. **In einem Tab regulärer `SbkimAnastomose.handshake(peerSpore,
   ownVec)`-Aufruf** über Eruda (Default `transport:"auto"` reicht;
   HTTP scheitert auf GitHub Pages 405/404, Channel-Fallback greift).
   **Erwartet `outcome:"established"` über den Channel-Pfad** —
   das ist das eigentliche Ziel der gesamten Kette PR #65 → #74 →
   diese Bau-PR.
4. **Falls Timeout statt `established`:** Receiver-Tab-Pflicht
   prüfen (beide Tabs wirklich offen? Modul 05 geladen + `init()`
   durch? `SBKIM-Init grün` in beiden Konsolen sichtbar?). Bei
   verbleibenden Fragen Folge-Pflege-Sitzung.

---

## 7. Konvention für die übernächste Sitzung (Wiederholung — IMMER drinhalten)

Wenn Klaus am Sitzungsende der **Folge-Sitzung** `Befehl schreiben`
tippt, formuliert die Folge-Sitzung **vor** dem Brief:

1. **Offene PRs auflisten** in Sage-Protokol (und ggf. Endknoten).
2. **Pro PR eine Einordnung** (mergen / schließen / lassen +
   Konflikt-Risiko, typisch PULS.md / INTERFACES.md).
3. **Den Brief gegen `main`-Stand schreiben**, nicht gegen die
   eigene Branch-Erwartung. Voraussetzungen aus ungemergten PRs
   **explizit** nennen.
4. **Bei mehreren offenen PRs** Merge-Empfehlung vor dem Brief
   vorlegen; der Brief kommt erst nach Klaus' Bestätigung der
   Merge-Strategie (oder explizit „Brief auf aktuellem Stand,
   keine Merges").

Brief-Stil: sachlich, ohne Imponiergehabe, mit konkreten Datei-/
Zeilen-Referenzen. Sektionen 0 (Pflichtlektüre) → 1 (Was geschah) →
2 (Aufgabe) → 3 (Pflicht-Diagnostik bei Bau-Sitzung) → 4 (Pflicht
am Sitzungsende) → 5 (Was blockiert nächsten Schritt) →
**6 (diese Konvention wiederholen!)** → 7 (Klaus-Pflichtaufgaben).

**Pflicht am ENDE des Briefs:** Den vollständigen Brief NOCHMAL in
einem einzigen kopierbaren Markdown-Codeblock (Outer-Fence mit vier
Backticks, damit interne ```js-Blöcke nicht schließen). Klaus liest
den Brief am Tab und kopiert ihn von dort in die nächste Sitzung —
der Codeblock ist sein Anker.

---

## 8. Nächster sinnvoller Schritt

1. **Klaus:** Diese Bau-PR mergen.
2. **Klaus:** Endknoten-Pflege (Schritte aus § 6 oben). Sichttest
   im Browser über das Doku-Fenster bzw. die Eruda-Konsole im
   Tablet-Setup.
3. **Falls Sichttest grün:** Folge-Mini-Pflege „Live-Cross-Knoten-
   Handshake protokolliert" mit Klaus' Output (nodeIds, score,
   Log-Zeile, Zeitmessung) und Update der Endknoten-Tabelle in PULS
   (`pingStatus: "live-direct" → "live-channel"` o.ä.).
4. **Falls Sichttest rot:** Folge-Pflege-Sitzung mit Diagnostik —
   Receiver-Tab-Pflicht, `init()`-Output, BroadcastChannel-Browser-
   Support, ggf. Eruda-Mapping für Channel-Sichtkontrolle nachziehen.

---

**Vorgänger:** Spec-Sitzung BroadcastChannel-Bridge (PR #74,
`a5bbd60`). Pflege Scope-Fix (PR #72) + Klaus-Sichttest Endknoten-
Hygiene (PR #73). Bau-Sitzung 05 (2026-05-14) für den Modul-05-
Grundvertrag bleibt verbindlich; diese Sitzung erweitert ihn additiv
um den Channel-Fallback-Transport.

**Branch:** `claude/bau-05-broadcastchannel-bridge-xVjoF`.
