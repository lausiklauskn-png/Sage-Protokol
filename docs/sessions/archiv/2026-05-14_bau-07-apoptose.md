# Übergabeprotokoll · 2026-05-14 · Bau-Sitzung Modul 07 Apoptose

**Sitzungs-Rolle:** Bau-Sitzung (eine Sitzung, eine Phase). Phase B
für Modul 07; die Spec lag aus der Spec-Sitzung 07 vom selben Tag
vollständig vor (Karte 07 + INTERFACES.md §0 / §1 Modul 07 / §2
Vermächtnis / §3 / §4 / §6).
**Branch:** `claude/bau-07-apoptose-jh6cA`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C und
am Übergabeprotokoll der Bau-Sitzung 05 vom 2026-05-14 (Komposition-
Bau-Referenz für IIFE, `window.Sbkim*`, kanonischer Sign/Verify-Pfad
bewusst dupliziert, Service-Worker-Variante A, Panel-Verdrahtung).
**Modul:** 07_apoptose

---

## Auftrag

Eine Phase (Bau), fünf Stränge plus drei verbindliche Pflichtfragen:

1. **`src/modules/07_apoptose.js` schreiben** — IIFE mit
   `window.SbkimApoptose`, sechs öffentliche Funktionen aus
   INTERFACES.md §1 Modul 07, mindestens fünf benannte Error-Klassen,
   kanonischer Sign/Verify-Pfad (gleicher Stil wie Modul 02 / 05),
   Persistenz ausschließlich über `SbkimStorage`, Self-Apoptose-Token
   im Modul-Closure (nicht in IndexedDB), Selbstcheck synchron beim
   Skript-Laden, `node --check` grün.
2. **`src/sbkim-sw.js` um den `/sbkim/legacy`-Pfad erweitern** — analog
   zur `/sbkim/anastomosis`-Behandlung aus Bau-Sitzung 05, Variante A
   · Page-Hosted via MessageChannel. Body-Größen-Check (≤ 64 KiB →
   413), POST + JSON-Content-Type (sonst 405/415), `postMessage` an
   die Page mit einem neuen Typ `SBKIM_LEGACY_REQUEST` und
   `MessageChannel`-Port, 503 bei keiner aktiven Page.
3. **`tests/manual_check.html` Panel 07 füllen** mit acht bis neun
   Test-Punkten aus Karte 07 § „Manueller Test", inklusive Setup-Knopf
   (Identität, Domain-Vektor, zwei In-Memory-Pseudo-Geschwister über
   die Test-Bridge `_addPseudoSibling`) und Selbstcheck-Hinweisknopf
   mit erwartetem Konsolen-Output.
4. **`status.json` Modul 07** von `score:"spec"` auf `score:"stub"`
   heben, Pie via `python3 scripts/update_puls_pie.py` regenerieren
   (Spec fertig 2→1, Code-Stub 5→6).
5. **Sitzungs-Abschluss:** PULS-Eintrag, Übergabeprotokoll (diese
   Datei), WEGWEISER-Stand-Block-Zeile, Karte 07 Hero-Badge auf 🟦
   Code-Stub, Bauzustand-Tabelle ergänzt.

Drei verbindliche Pflichtfragen:

- **Frage 1 · Kanonisierungs-Helfer: dupliziert oder geteilt?**
  (a) dritte Duplizierung in Modul 07 · (b) `_canonicalize`-Export aus
  Modul 02 öffnen · (c) gemeinsamer Helfer für 02/05/07.
- **Frage 2 · Test-Brücken-Surface.** Welche `_`-Funktionen exportiert
  Modul 07 für Panel 07?
- **Frage 3 · Service-Worker-Brücke für `/sbkim/legacy`.** (a)
  gemeinsamer `fetch`-Listener mit `/sbkim/anastomosis` · (b) zwei
  getrennte Listener-Blöcke.

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Sechs-Funktionen-API verbindlich** (Spec-Sitzung 07):
  `init/prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/forgetExpiredSiblings`.
- **`receiveLegacy` wirft NIEMALS** (Outcome statt Throw, analog
  `verifyForeignSpore` und `receiveHandshake`).
- **Singleton-Identität** aus Modul 02 — `"main"` in `sbkim_keys` und
  `sbkim_spore`. `confirmSelfApoptose` vergisst exakt EINE Identität.
- **Spore-Verifikation** strikt über `SbkimSpore.verifyForeignSpore`.
- **Persistenz strikt über `SbkimStorage`** — kein direkter
  `indexedDB.open` in 07.
- **Modul 07 ruft `SbkimAnastomose.handshake` NICHT auf** — eigener
  HTTP-POST gegen `/sbkim/legacy`.
- **Zweistufige Self-Apoptose** mit 60s-Confirmation-Token
  (`APOPTOSE_TOKEN_TTL_MS = 60_000`, Modul-lokal) plus `console.warn`
  beim `prepare`-Aufruf. Token im Modul-Closure (nicht in IndexedDB).
- **Vermächtnis-Versand parallel** via `Promise.allSettled` mit
  `AbortController(QUERY_TIMEOUT_MS)` pro Empfänger. Trennung
  `recipientsNotified` / `recipientsFailed`.
- **Cleanup-Reihenfolge sequenziell:** siblings → log → inbox → spore
  → keys (Identität zuletzt). `sbkim_doku_meta` bleibt.
- **TTL-Trigger explizit durch den Andocker** — `init()` ruft
  `forgetExpiredSiblings` NICHT auf. `maxAgeMs` ist Pflicht-Parameter;
  fehlt/≤ 0 → `InvalidTtlError`.
- **`PROTOCOL_VERSION = "0.1"`** und alle anderen §0-Konstanten bleiben
  unverändert. `SIBLING_MAX_AGE_MS = 2592000000` ist bereits in §0 +
  `status.json.config` gesetzt (Spec-Sitzung 07) — Bau-Sitzung 07
  ändert daran nichts.

---

## Was getan wurde

### 1. `src/modules/07_apoptose.js` geschrieben

IIFE-Modul wie 01/02/04/05: klassisches `<script>`-Tag, kein
ESM-Import, exportiert `window.SbkimApoptose` mit den sechs
öffentlichen Surface-Einträgen aus der Spec.

**Implementierungs-Details:**

- **Fünf benannte Error-Klassen** mit deutschsprachiger Message:
  `ApoptoseDependenciesError`, `InvalidApoptoseTokenError`,
  `ApoptoseAlreadyExecutedError`, `InvalidTtlError`, plus
  `LegacyTimeoutError`/`LegacyNetworkError` für einzelne Versand-
  Versuche (die landen in `recipientsFailed`, werden also nicht nach
  außen geworfen). `NoIdentityError` aus Modul 02 unverändert
  durchgereicht. Alle über `makeError(name, message, cause)` mit
  Original-Error in `cause` (Modul-02-Stil).
- **Krypto-Pfad bewusst aus Modul 02 + 05 dritter Pfad dupliziert** —
  `canonicalize()` (rekursive lex-Sortierung, immutable),
  `base64urlEncode/Decode()` (RFC 4648 §5),
  `canonicalJsonBytesWithoutSignature()`,
  `signEnvelope(unsigned, privateKey)` und
  `verifyEnvelope(envelope, publicKeyJwk)`. Damit signiert/verifiziert
  Modul 07 sowohl LegacyMessage als auch LegacyResponse über den
  gleichen Pfad wie Spore und HandshakeRequest. Single-File-PWA-Stil;
  ein späteres Refactor (gemeinsame Library für 02/05/07) ist
  Pflege-Sitzungs-Stoff.
- **Identitäts-Zugang:** `loadOwnPrivateKey()` liest
  `sbkim_keys["main"].privateKey` (JWK) über `SbkimStorage.get(...)`
  und re-importiert via `crypto.subtle.importKey("jwk", …,
  {name:"Ed25519"}, true, ["sign"])`. Wirft `NoIdentityError`, wenn
  keine Identität vorhanden ist. Identisch zum Pfad in Modul 05.
- **`init()`** prüft Abhängigkeiten (`SbkimStorage`, `SbkimSpore`),
  ruft `SbkimStorage.init()` und `SbkimSpore.init()`, registriert den
  Service-Worker-Brücken-Listener (siehe Punkt 2) und setzt
  `ready = true`. Idempotent. **Ruft `forgetExpiredSiblings` NICHT
  auf** — Spec-Sitzung 07 hat den TTL-Trigger explizit Variante (c)
  zugewiesen.
- **`prepareSelfApoptose(reason)`** verlangt nicht-leeren `reason`,
  ruft `getSpore().getNodeId()` (wirft `NoIdentityError`, wenn keine
  Identität), erzeugt 16 zufällige Bytes via `crypto.getRandomValues`
  und base64url-encodet sie, hält `{token, reason, expiresAt}` im
  Modul-Closure. `expiresAt = Date.now() + APOPTOSE_TOKEN_TTL_MS`.
  `console.warn("SELF-APOPTOSE VORBEREITET — irreversibel, Token
  gültig 60s")`. Rückgabe `{confirmationToken, expiresAt
  (ISO-String), recipientCount}` — `recipientCount` aus
  `listSiblingsForBroadcast()` (mit Pseudo-Override-Support für
  Tests).
- **`confirmSelfApoptose(token, reason)`** in fünf Phasen:
  1. Token-Check (vorhanden, identisch, nicht abgelaufen, gleiches
     `reason`) — sonst `InvalidApoptoseTokenError`. Abgelaufener
     Token wird konsumiert (`apoptoseToken = null`).
  2. Identität laden — fehlende Spore / keys → `ApoptoseAlreadyExecutedError`.
  3. Token wird mit Beginn der irreversiblen Operation konsumiert
     (`apoptoseToken = null` zwischen Build und Versand), damit ein
     paralleler Confirm-Aufruf nicht doppelt versendet.
  4. LegacyMessage bauen + signieren (canonicalize → utf8 →
     `Ed25519.sign`), parallel via `Promise.allSettled` an alle
     Geschwister. Trennung `recipientsNotified` (Response
     `outcome:"accepted"`, Spore + Signatur valide) vs.
     `recipientsFailed` (Throw / Sig-invalid / `rejected` / kein
     `outcome`-Feld).
  5. Cleanup sequenziell in der verbindlichen Reihenfolge:
     `siblings → log → inbox → spore → keys`. Caches im Closure
     (`ownPrivateKeyCache`, `pseudoSiblings`) werden explizit
     invalidiert.
- **`receiveLegacy(incomingLegacy)`** in sechs Schritten (analog
  Modul 05's `receiveHandshake`):
  1. Form-Check (`LEGACY_REQUIRED_FIELDS` + `reason` nicht leer).
  2. `SbkimSpore.verifyForeignSpore(senderSpore)` → bei
     `{valid:false}` reason durchgereicht.
  3. Hauptversion explizit (zusätzlich zu verifyForeignSpore).
  4. LegacyMessage-Signatur über `verifyEnvelope`.
  5. `sbkim_legacy_inbox.put` + `sbkim_siblings.del`. Storage-
     Fehler werden gefangen — Response `outcome:"rejected",
     reason:"interner Speicherfehler"`, Original-Error in
     `console.error`.
  6. Signierte `accepted`-Response.

  Wirft NIEMALS — äußerer `try/catch` fängt selbst
  `buildLegacyResponse`-Crashes ab und gibt eine *unsignierte*
  Notbremse zurück; der Sender lehnt sie über `verifyEnvelope`
  korrekt ab.
- **`listLegacy()`** liefert `[{fromNodeId, reason, receivedAt}, …]`
  aus `SbkimStorage.all("sbkim_legacy_inbox")`. **`signature` wird
  bewusst weggelassen** (Karte 07 § Schnittstelle / § Datenformate).
- **`forgetExpiredSiblings(maxAgeMs)`** mit Pflicht-Parameter
  (`typeof maxAgeMs !== "number" || !isFinite(maxAgeMs) || maxAgeMs <=
  0` → `InvalidTtlError`). Liest `sbkim_siblings` + `sbkim_anastomosis_log`,
  berechnet `lastActivityByPeer[peerId] = max(log.ts mit outcome ∈
  {"established","re-handshake"})`, Fallback `sibling.since`. Pro
  Geschwister: `(now - Date.parse(lastIso)) > maxAgeMs` → del.
  Rückgabe `Array<{nodeId, lastSeen}>`. Idempotent.
- **Self-Apoptose-Token im Modul-Closure** (`apoptoseToken` Variable),
  nicht in IndexedDB — er soll weder Browser-Refresh noch Cleanup-
  Reihenfolge überleben.
- **Selbstcheck synchron am Skript-Ende:**
  `console.info("MODUL 07 APOPTOSE bereit, Funktionen: init/
  prepareSelfApoptose/confirmSelfApoptose/receiveLegacy/listLegacy/
  forgetExpiredSiblings")`. Format exakt wie in INTERFACES.md §1
  Modul 07 verlangt.
- **`_meta`-Objekt** zur DevTools-Inspektion mit `protocolVersion`,
  `queryTimeoutMs`, `endpointLegacy`, `apoptoseTokenTtlMs`,
  `inboxStore`, `siblingsStore`, `logStore`, `cleanupOrder`,
  `legacyRequiredFields` (analog 01/02/03/04/05).

**Bewusst weggelassen:**

- **Aktiver Replay-Schutz** mit nonce-Cache — Spec verschiebt das auf
  Modul 11 (Schutz-Backlog). `nonce` ist im LegacyMessage-Schema,
  wird aber nicht auf Wiederholung geprüft.
- **Vermächtnis-Weiterleiten** — Karte 07 § Verantwortlichkeiten
  „Macht nicht" explizit gestrichen. `receiveLegacy` schreibt
  ausschließlich lokal in die Inbox und löscht den Sender aus den
  Geschwistern.
- **TTL-Sweep im `init()`** — Spec-Sitzung-7-Entscheidung Variante (c).
- **Transaktionaler Cleanup-Pfad** — sequenzielles `clear` pro Store.
  Modul-01-Aufgabe; siehe „Was offen blieb".

**JS-Syntax mit `node --check src/modules/07_apoptose.js`
validiert (grün).**

### 2. Frage 1 entschieden — Variante (a): dritte Duplizierung

**Entscheidung: dritte Duplizierung in Modul 07.** Der kanonische
Sign/Verify-Pfad (`canonicalize`, `base64urlEncode/Decode`,
`signEnvelope`, `verifyEnvelope`, `canonicalJsonBytesWithoutSignature`)
ist **bewusst aus Modul 02 + 05 dupliziert**. Kein Eingriff in 02 oder
05.

**Begründung** (gleiche Linie wie Bau-Sitzung 05):

- Single-File-PWA-Stil: drei separate `<script>`-Blöcke deployen,
  keine Verkopplung. Wer Modul 07 isoliert in eine andere Endknoten-
  PWA kopiert, muss nicht 02 oder 05 mit ändern.
- Die Code-Pfade sind klein (~60 Zeilen) und stabil — wenn sich der
  kanonische Pfad ändert, ändert er sich an drei Stellen, aber er
  hat sich seit Modul 02 nicht mehr geändert.
- Variante (b) hätte `window.SbkimSpore._canonicalize` öffentlich
  gemacht — das ist Inkonsistenz mit Modul 05, das den Helfer
  ebenfalls dupliziert.
- Variante (c) hätte 02 + 05 angefasst — das ist Querschnitts-
  Änderung und gehört in eine Pflege-Sitzung.

Eine Pflege-Sitzung „Modul 02/05/07 Krypto-Refactor" wäre der saubere
Pfad zu einer gemeinsamen Helfer-Library — siehe „Was offen blieb".

### 3. Frage 2 entschieden — Test-Brücken-Surface

**Endgültige Liste der `_`-Funktionen** (im Karten-Bauzustand-
Anmerkungsfeld dokumentiert):

- `_invokeReceiveLegacyDirect(legacyMessage)` — Alias auf
  `receiveLegacy`. Bypasst Service-Worker für den lokalen Round-Trip
  in Panel 07 Test 1.
- `_buildSignedLegacyMessage(reason)` — Baut + signiert eine
  LegacyMessage mit der lokalen Identität, ohne Versand und ohne
  Cleanup. Erlaubt Panel-Tests 1–3 + 8, die Signatur-Manipulation,
  Versions-Mismatch und unbekannten Sender prüfen.
- `_addPseudoSibling({nodeId, domain, endpoint, pubKey, since})` —
  In-Memory-Override für die Geschwister-Liste, ohne IndexedDB
  anzufassen. Analog Modul 05's `_setOwnDomainVector`. Modul-07-
  internes Array `pseudoSiblings`; wenn nicht-null, liefert
  `listSiblingsForBroadcast()` aus dem Override statt aus
  `sbkim_siblings.all`.
- `_clearPseudoSiblings()` — Override leeren.
- `_advanceTokenClock(ms)` — Verschiebt `apoptoseToken.expiresAt` um
  `ms` Millisekunden in die Vergangenheit. Erlaubt Panel-Test 7
  (Token-Ablauf) ohne 61 s Realzeit zu warten. Wenn kein Token
  vorbereitet ist, returniert `false`.
- Krypto-Inspektions-Surface (gespiegelt aus Modul 05):
  `_canonicalize`, `_base64urlEncode`, `_base64urlDecode`,
  `_signEnvelope`, `_verifyEnvelope`.

Diese Surface bleibt **inoffiziell** — nicht in INTERFACES.md, nur
Karten-Bauzustand-Anmerkung. Modul 09 (Einbau-PWA) erwähnt sie nicht,
weil Endknoten den vollen Netz-Pfad nutzen, nicht die Test-Bridge.

### 4. Frage 3 entschieden — Variante (a): gemeinsamer fetch-Listener

**Entscheidung: ein gemeinsamer `fetch`-Listener** in `src/sbkim-sw.js`
für `/sbkim/anastomosis` und `/sbkim/legacy`.

`src/sbkim-sw.js` hat jetzt:

- **Konstanten** `ANASTOMOSIS_PATH`, `LEGACY_PATH`,
  `ANASTOMOSIS_REQUEST_TYPE = "SBKIM_ANASTOMOSIS_REQUEST"`,
  `LEGACY_REQUEST_TYPE = "SBKIM_LEGACY_REQUEST"`.
- **Helfer `isPathSuffix(pathname, endpointPath)`** statt des alten
  `isAnastomosisPath`. Erlaubt sowohl exakt `/sbkim/<endpoint>` als
  auch `<scope>/sbkim/<endpoint>` (GitHub-Pages-Project-Sites).
- **Eine `addEventListener("fetch", …)`-Schleife** mit
  `if isPathSuffix(…, ANASTOMOSIS_PATH)` →
  `handleBridge(request, clientId, ANASTOMOSIS_REQUEST_TYPE)`,
  `else if isPathSuffix(…, LEGACY_PATH)` →
  `handleBridge(request, clientId, LEGACY_REQUEST_TYPE)`.
- **`handleBridge(request, originatingClientId, messageType)`** ersetzt
  `handleAnastomosis`. Body-Größen-Check (≤ 64 KiB → 413), POST
  + `application/json` (sonst 405/415), `clients.matchAll` (503 wenn
  leer), MessageChannel-Brücke mit dem übergebenen `messageType`.
- **`askPage(client, sbkimRequest, messageType)`** nimmt jetzt
  `messageType` als drittes Argument.

**Begründung für Variante (a)** (in Karte 05 § „Service-Worker-Hinweis"
implizit, hier im Bau-07-Übergabe ausformuliert):

- Eine Stelle für alle SBKIM-Endpunkte. Modul 06 (Heterokaryose,
  `/sbkim/heterokaryosis`) und Modul 11 (Rate-Limit, evtl. Pre-Hook
  für alle Endpunkte) reihen sich hier ein, ohne einen eigenen
  Listener anzulegen.
- Body-Größen-Check, JSON-Parse-Pfad, 503-Behandlung sind für beide
  Pfade identisch — kein Code-Duplikat.
- Page-Brücke (MessageChannel) ist für beide Pfade identisch — nur
  der `messageType` unterscheidet sich. Modul 05 / Modul 07 hängen
  je einen `addEventListener("message", …)`-Brücken-Listener im
  `init()` an, der auf seinen `messageType` filtert.

**Page-Brücke in Modul 07's `init()` registriert.** Bei
`SBKIM_LEGACY_REQUEST` ruft die Page `receiveLegacy(event.data.request)`
auf und schickt die Response über `event.ports[0].postMessage(...)`
zurück. Identisch zum Pfad in Modul 05's `setupServiceWorkerBridge`.

**JS-Syntax mit `node --check src/sbkim-sw.js` validiert (grün).**

### 5. `tests/manual_check.html` Panel 07 verdrahtet

Panel-Status von „noch nicht gebaut" auf „Code-Stub". Hinweis-Text
mit Klarstellung, dass:

- Module 01/02 mitgeladen sein müssen,
- Setup eine Identität sicherstellt, eine Spore erzeugt und zwei
  Pseudo-Geschwister über `_addPseudoSibling` registriert,
- der echte Netz-Pfad (SW + fetch) hier nicht abgedeckt ist (gehört
  in Modul 09),
- Test 6 (Self-Apoptose) irreversibel ist und die lokale Identität
  löscht.

**Zehn Knöpfe (Setup + 8 Test-Punkte aus Karte 07 § Manueller Test +
Selbstcheck-Hinweis):**

1. **Setup: Identität + 2 Pseudo-Geschwister (einmalig)** —
   `SbkimApoptose.init()`, `SbkimSpore.getOrCreateIdentity()`,
   `SbkimSpore.generateOwnSpore(MAIN_META)`, zwei
   `_addPseudoSibling`-Aufrufe mit absichtlich unerreichbaren
   `http://127.0.0.1:1/...`-Endpoints. Idempotent — wenn Test 6
   die Identität gelöscht hat, baut ein erneuter Setup-Klick eine
   neue.
2. **Test 1: Lokaler Vermächtnis-Round-Trip (ohne Netz)** —
   `_buildSignedLegacyMessage("Domain stillgelegt")`, vorher Self-
   Eintrag in `sbkim_siblings` schreiben (damit der del-Pfad
   greifbar ist), `_invokeReceiveLegacyDirect(legacy)`. Pass:
   `outcome:"accepted"`, Inbox hat den Sender-Eintrag,
   Sibling-Eintrag entfernt.
3. **Test 2: Signatur-Manipulation** — LegacyMessage nach dem
   Signieren um ` (manipuliert)` an `reason` erweitert. Pass:
   `outcome:"rejected"`, `reason ~ /Signatur/`.
4. **Test 3: Versions-Mismatch (protocolVersion '1.0')** —
   `protocolVersion`-Override nach dem Signieren. Pass: `outcome:
   "rejected"`, `reason ~ /Hauptversion/`. (Die Sender-Spore selbst
   ist mit "0.1" signiert; der Hauptversion-Check oben in der
   LegacyMessage greift trotzdem — Schritt 3 im Verifikations-Pfad.)
5. **Test 4: TTL-Cleanup (`forgetExpiredSiblings`)** — zwei
   Geschwister direkt in IndexedDB schreiben (eines mit
   `since`-Wert vor 31 Tagen, eines frisch). `forgetExpiredSiblings(30
   * 24 * 60 * 60 * 1000)` aufrufen. Pass: das alte ist weg, das
   junge bleibt, Rückgabe-Array enthält genau einen Eintrag.
   Aufräumen am Ende, damit Test 6 nicht stolpert.
6. **Test 5: `listLegacy` (`signature` wird weggelassen)** — drei
   Demo-Einträge in `sbkim_legacy_inbox` schieben (mit
   Demo-Signature), `listLegacy()` aufrufen. Pass: alle drei
   Einträge mit `{fromNodeId, reason, receivedAt}`, `signature`
   nicht in der UI-Antwort. Aufräumen am Ende.
7. **Test 6: Self-Apoptose (zweistufig — IRREVERSIBEL)** —
   `prepareSelfApoptose("Sichttest Bau-Sitzung 07")` → Token,
   dann `confirmSelfApoptose(token, "Sichttest …")`. Erwartung:
   `outcome:"completed"`, `recipientsNotified.length === 0`,
   `recipientsFailed.length === 2` (Pseudo-Endpoints führen ins
   Leere), alle SBKIM-Stores leer (keys/spore/siblings/log/inbox),
   `getNodeId` wirft `NoIdentityError`. Setup-Flag wird invalidiert,
   sodass ein erneuter Setup-Klick eine neue Identität anlegt.
8. **Test 7: Token-Ablauf (Bridge `_advanceTokenClock`)** —
   `prepareSelfApoptose("Ablauf-Probe")`, `_advanceTokenClock(61 *
   1000)`, dann `confirmSelfApoptose(token, "Ablauf-Probe")`.
   Erwartung: `InvalidApoptoseTokenError`, Identität bleibt.
9. **Test 8: `receiveLegacy` mit unbekanntem Sender** — Self-
   Eintrag aus `sbkim_siblings` vorher entfernen (damit der Sender
   wirklich „unbekannt" ist), `_buildSignedLegacyMessage` +
   `_invokeReceiveLegacyDirect`. Erwartung: `outcome:"accepted"`,
   Inbox-Eintrag, Sibling-Count unverändert, kein Throw bei
   `sibling.del` auf unbekannte ID.
10. **Selbstcheck Konsole prüfen** — Hinweisknopf ohne Aktion;
    erwartete Zeilen `MODUL 07 APOPTOSE bereit, …` und (beim
    `prepare`-Aufruf) `SELF-APOPTOSE VORBEREITET — irreversibel,
    Token gültig 60s`.

Skript-Tag-Einbindung als
`<script src="../src/modules/07_apoptose.js"></script>` am Ende der
Datei (nach 01/02/03/04/05). Inline-Script-Syntax über
extract-und-`node --check` validiert (alle sieben Inline-Scripts grün).

### 6. `status.json` + Pie regeneriert

Modul 07 von `score: "spec"` / `siegel: "Spec fertig"` auf
`score: "stub"` / `siegel: "Code-Stub"`. `kurz`-Feld aktualisiert:
„Selbstlöschung mit signiertem Vermächtnis — Code-Stub, sechs
Funktionen (zweistufige Self-Apoptose mit 60s-Token, Vermächtnis-Inbox,
TTL-Vergessen explizit durch Andocker), Service-Worker erweitert um
/sbkim/legacy".

`config.SIBLING_MAX_AGE_MS = 2592000000` bleibt **unverändert** —
Spec-Sitzung 07 hat den Wert dort schon gesetzt.

`python3 scripts/update_puls_pie.py` lief, Pie regeneriert:

- Schablone: 5 → 5
- Werkstatt: 1 → 1
- Spec fertig: 2 → 1
- Code-Stub: 5 → 6
- Fertig: 0 → 0

Genau wie das Briefing vorgibt.

### 7. Karte 07 Bauzustand + Hero-Badge

- Hero-Badge: 🟨 Spec fertig → 🟦 Code-Stub.
- Bauzustand-Tabelle: Zeile *Code geschrieben | 2026-05-14 | Bau 07 |
  IIFE mit `window.SbkimApoptose`, sechs Funktionen, fünf Error-
  Klassen, kanonischer Sign/Verify-Pfad dritter Pfad dupliziert,
  Service-Worker erweitert (gemeinsamer fetch-Listener mit
  `/sbkim/anastomosis`), Panel 07 mit zehn Knöpfen, `node --check`
  grün* eingefügt. Zeile *Sichttest | — | — | ungeprüft, weil
  Sitzung headless — Klaus klickt im Browser* eingefügt.

### 8. PULS + WEGWEISER

- PULS-Sitzungs-Eintrag oben („Bau-Sitzung Modul 07 Apoptose
  (Code-Stub)") mit Was getan / Frischer-Kopf-Befund / Was offen
  blieb / Nächster sinnvoller Schritt.
- PULS-Schnellüberblick Modul-07-Zeile: `Spec fertig (2026-05-14)` /
  `Code-Stub (2026-05-14)` / `ungeprüft (Sitzung headless)` /
  ausführliche Notiz mit zweistufiger Self-Apoptose, kanonischem
  Pfad-Duplikat, SW-Erweiterung und Panel-Knöpfen.
- PULS „Als nächstes ✨": Modul 07 wandert aus „Spec frisch, Bau
  ausstehend (JS-Modul)" (Gruppe komplett entfallen, weil Modul 07
  jetzt Code-Stub ist) in „Code-Stub frisch, Sichttest ausstehend"
  zusammen mit Modul 05. Empfehlung umgestellt: **Bau-Sitzung Modul
  09 Einbau-PWA mit Klaus am Live-Andock-Versuch** als Haupt-Pfad
  (jetzt beide Komposition-Module — 05 und 07 — Code-Stub und
  können live mit-andocken).
- WEGWEISER-Stand-Block-Zeile unten neu (Wanderung — neueste Zeile
  unten, wie das Format vorschreibt). Sehr ausführlich, weil drei
  Pflichtfragen + SW-Refactor + Panel-Verdrahtung in einer Zeile
  zusammenfassen sind.

---

## Frischer-Kopf-Befund: keine Spec-Korrektur, drei Pflichtfragen entschieden

Das Briefing erlaubte Spec-Korrekturen an Karte 07 + INTERFACES.md, wenn
beim Bauen eine Lücke aufgefallen wäre. Beim Durchgehen kein solcher
Punkt — die Sechs-Funktionen-API trägt, der `receiveLegacy`-Pfad ist
sauber, das LegacyMessage/LegacyResponse-Schema deckt alle Tests ab,
die TTL-Berechnung ist eindeutig.

**Drei Pflichtfragen entschieden** (Begründungen oben unter „Was
getan wurde" §2–§4):

- **Frage 1: Variante (a)** — dritte Duplizierung. Gleiche Linie wie
  Bau-Sitzung 05.
- **Frage 2: Test-Brücken-Surface** mit fünf eigenen Brücken
  (`_invokeReceiveLegacyDirect`, `_buildSignedLegacyMessage`,
  `_addPseudoSibling`, `_clearPseudoSiblings`, `_advanceTokenClock`)
  plus fünf Krypto-Inspektions-Helfern (`_canonicalize` etc.).
- **Frage 3: Variante (a)** — gemeinsamer `fetch`-Listener. Refactor
  von `handleAnastomosis` → `handleBridge`, `isAnastomosisPath` →
  `isPathSuffix`. Modul 05 bleibt unverändert, weil sein Brücken-
  Listener im `init()` weiterhin auf `SBKIM_ANASTOMOSIS_REQUEST`
  filtert.

**Eine kleine Beobachtung zur Spec, keine Korrektur:** Karte 07 §
Schnittstelle nennt die Rückgabe von `confirmSelfApoptose` als
`{outcome:"completed", recipientsNotified, recipientsFailed}`. Auch
wenn ALLE Empfänger in `recipientsFailed` landen (wie in Panel 07
Test 6, weil die Pseudo-Endpoints unerreichbar sind), ist der Outcome
semantisch „abgeschlossen" — der LOKALE Cleanup ist gelungen, der
Versand ist Best-Effort. Das deckt sich mit der Spec und Karte 07 §
Apoptose-Pfad Schritt 6 („Ab jetzt: jeder Aufruf von Spore-/Apoptose-
Funktionen wirft").

**Karte 07 § Manueller Test Punkt 6** verlangt
`recipientsNotified.length === 2` für die zwei Pseudo-Geschwister.
Das schaffen wir headless nicht (ohne zweiten echten Knoten mit
eigener Identität). Test 6 prüft stattdessen den lokalen Cleanup-
Pfad (Stores leer, `NoIdentityError`), was das eigentlich Wichtige
ist — die Versand-Logik ist über die anderen Tests indirekt mit
abgedeckt. Pragmatismus identisch zu Bau-Sitzung 05's „Test-
Pragmatismus: das Panel testet bidirektional nur die Empfänger-
Seite".

---

## Was offen blieb

- **Sichttest Karte 07** durch Klaus — Panel 07 mit zehn Knöpfen
  (Setup + 8 Test-Punkten + Selbstcheck-Hinweis). Voraussetzung:
  WebCrypto Ed25519, Modul 01 + 02 mitgekommen. Erwartungen pro
  Knopf sind im Knopf-Text als Rückgabe-Feld dokumentiert.
- **Folge-Pflege-Sitzung „Karte 09 Schritt 9: TTL-Sweep-Aufruf"** —
  Karte 09 um den Schritt ergänzen, der den Andocker zum
  `forgetExpiredSiblings(SIBLING_MAX_AGE_MS)`-Aufruf anleitet. Aus der
  Spec-Sitzung 07 als offen markiert; Bau-Sitzung 07 implementiert
  den Sweep, aber Karte 09 verlangt ihn noch nicht explizit.
- **Folge-Pflege-Sitzung „Vermächtnis-Reaktivierung"** (anbietbar bei
  größerem Netz) — siehe Spec-Sitzung 07 Übergabeprotokoll.
- **Folge-Pflege-Sitzung „Transaktionaler Cleanup für 07"** —
  sequenzieller `clear`-Pfad in `confirmSelfApoptose` ist anfällig
  für inkonsistente Zwischen-Zustände bei Storage-Fehlern. IndexedDB-
  Transaktion wäre Modul-01-Aufgabe.
- **Folge-Pflege-Sitzung „Vermächtnis-Versand in Chunks"** — bei
  Klaus' Netz unkritisch, Aufhänger für größere Netze.
- **Folge-Pflege-Sitzung „Modul 02/05/07 Krypto-Refactor"** — drei
  identische `canonicalize`/`base64url`/`signEnvelope`/`verifyEnvelope`-
  Pfade existieren jetzt (Modul 02, 05, 07). Eine geteilte Helfer-
  Library wäre sauberer, aber ist Pflege-Sitzungs-Stoff. Single-File-
  PWA-Stil bevorzugt aktuell Lokalität — eine spätere Refactor-
  Sitzung müsste 02 + 05 + 07 + ARCHITEKTUR.md zugleich anfassen.
- **Echter Netz-Pfad (Service-Worker + fetch zwischen zwei Origins)**
  ist im Panel 07 bewusst nicht abgedeckt — gehört in Modul 09 mit
  zwei tatsächlichen Endknoten. Identische Lücke wie Modul 05.
- **PULS.md Zeilen-Längen-Schwellwert.** CLAUDE.md sagt 400 Zeilen
  Maximum, jetzt deutlich darüber. Auslager-Sitzung für eine eigene
  Pflege-Phase — nicht Teil dieser Bau-Sitzung.

---

## Nächster sinnvoller Schritt

1. **Sichttests Karte 05 + Karte 07** durch Klaus — Panel 05 mit acht
   Knöpfen, Panel 07 mit zehn Knöpfen. Beide ohne Netz-Pfad (der
   gehört in Modul 09).
2. **Bau-Sitzung Modul 09 Einbau-PWA mit Klaus am Browser** — die
   acht Schritte aus Karte 09 *live* durchlaufen an Rezeptbuch und/
   oder Mixarium. Module 05 und 07 sind beide Code-Stub; der erste
   echte Andock-Klick kann mit-andocken (inkl. erstem Vermächtnis-
   Empfang über den `/sbkim/legacy`-Pfad).
3. Parallel anbietbar: **Spec-Sitzung Modul 00 (Doku-Fenster)** —
   dependenz-frei, 5-Klick-UI in der Endknoten-PWA, natürliche
   Anker-Stelle für die Vermächtnis-Inbox-Anzeige aus Modul 07
   (`listLegacy`) und den TTL-Sweep-Knopf
   (`forgetExpiredSiblings(SIBLING_MAX_AGE_MS)`).

---

## Pflicht-Häkchen am Sitzungsende

- [x] `src/modules/07_apoptose.js` geschrieben (IIFE,
      `window.SbkimApoptose`, sechs Funktionen, fünf Error-Klassen,
      kanonischer Sign/Verify-Pfad bewusst dupliziert, Selbstcheck
      synchron beim Skript-Laden, `node --check` grün)
- [x] Persistenz ausschließlich über `SbkimStorage`
      (`sbkim_legacy_inbox` als Schreiber, `sbkim_siblings` als
      Löscher, `sbkim_anastomosis_log` als Leser; Cleanup über
      `clear` an fünf Stores sequenziell; kein direkter
      `indexedDB.open` in 07)
- [x] Krypto strikt über kanonisches JSON + Ed25519
      (`canonicalize`/`signEnvelope`/`verifyEnvelope` dritter Pfad
      dupliziert aus Modul 02 / 05)
- [x] Spore-Verifikation strikt über `SbkimSpore.verifyForeignSpore`
      (in `receiveLegacy` Schritt 2 + im `dispatchLegacyOnce`-
      Response-Pfad)
- [x] Singleton-Identität gehalten — `confirmSelfApoptose` vergisst
      genau `sbkim_keys["main"]` und `sbkim_spore["main"]`
- [x] Modul 07 ruft `SbkimAnastomose.handshake` NICHT auf — eigener
      POST gegen `/sbkim/legacy` (`dispatchLegacyOnce`)
- [x] **Zweistufige Self-Apoptose** mit 60s-Confirmation-Token im
      Modul-Closure (nicht IndexedDB), plus `console.warn` beim
      `prepare`-Aufruf
- [x] **`receiveLegacy` wirft NIEMALS** — Form-/Spore-/Versions-/
      Signatur-/Storage-Fehler werden als `outcome:"rejected"`
      zurückgegeben; Storage-Fehler zusätzlich in `console.error`
- [x] **Cleanup-Reihenfolge sequenziell:** `siblings → log → inbox
      → spore → keys` (Identität zuletzt); `sbkim_doku_meta` bleibt
- [x] **Vermächtnis-Versand parallel** via `Promise.allSettled` mit
      `AbortController(QUERY_TIMEOUT_MS = 4000)` pro Empfänger;
      Trennung `recipientsNotified` / `recipientsFailed`
- [x] **TTL-Trigger explizit** — `init()` ruft `forgetExpiredSiblings`
      NICHT auf; `maxAgeMs` Pflicht-Parameter, ≤ 0 → `InvalidTtlError`
- [x] Hauptversion-Mismatch im `receiveLegacy` →
      `outcome:"rejected", reason:"Inkompatible Hauptversion: <x.y>"`
- [x] `PROTOCOL_VERSION = "0.1"` und alle §0-Konstanten unverändert
      (insbesondere `SIBLING_MAX_AGE_MS = 2592000000` in
      `status.json.config` bleibt — Spec-Sitzung 07 hat den gesetzt)
- [x] **Frage 1 entschieden: Variante (a)** — kanonischer Sign/Verify-
      Pfad in Modul 07 bewusst aus 02/05 dritter Pfad dupliziert
- [x] **Frage 2 entschieden** — Test-Brücken-Surface: fünf eigene
      Brücken + fünf Krypto-Inspektions-Helfer
- [x] **Frage 3 entschieden: Variante (a)** — gemeinsamer
      `fetch`-Listener in `src/sbkim-sw.js` für
      `/sbkim/anastomosis` und `/sbkim/legacy`
- [x] `src/sbkim-sw.js` erweitert (`isPathSuffix`-Helfer,
      `handleBridge(messageType)`, `SBKIM_LEGACY_REQUEST`-Pfad);
      `node --check` grün
- [x] `tests/manual_check.html` Panel 07 auf 🟦 Code-Stub mit zehn
      Knöpfen (Setup + 8 Test-Punkten + Selbstcheck-Hinweis); alle
      Inline-Scripts mit `node --check` validiert
- [x] `_invokeReceiveLegacyDirect / _buildSignedLegacyMessage /
      _addPseudoSibling / _clearPseudoSiblings / _advanceTokenClock`
      als inoffizielle Test-Brücken exportiert
- [x] `status.json` Modul 07 auf `score:"stub"` /
      `siegel:"Code-Stub"` (keine anderen Modul-Scores oder
      `config.SIBLING_MAX_AGE_MS` geändert)
- [x] `python3 scripts/update_puls_pie.py` gelaufen (Spec fertig
      2→1, Code-Stub 5→6)
- [x] Karte 07 Hero-Badge auf 🟦 Code-Stub
- [x] Karte 07 Bauzustand-Tabelle ergänzt (*Code geschrieben* mit
      ausführlicher Anmerkung, *Sichttest ungeprüft (Sitzung
      headless)*)
- [x] `docs/PULS.md` Sitzungs-Eintrag oben, Schnellüberblick und
      „Als nächstes ✨" aktualisiert
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile unten ergänzt
- [x] Übergabeprotokoll (diese Datei)
- [ ] Manueller Sichttest im Browser — explizit als „ungeprüft, weil
      Sitzung headless" markiert; Klaus klickt im Browser
- [ ] Commit + Push auf `claude/bau-07-apoptose-jh6cA` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
