# Übergabeprotokoll · 2026-05-14 · Bau-Sitzung Modul 05 Anastomose

**Sitzungs-Rolle:** Bau-Sitzung (eine Sitzung, eine Phase). Phase B
für Modul 05; die Spec lag aus der Spec-Sitzung 05 vom selben Tag
vollständig vor.
**Branch:** `claude/bau-05-anastomose-FrQKF`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C und
am Übergabeprotokoll der Spec+Bau-Sitzung 02 vom 2026-05-14 (Bauart-
Referenz für IIFE, `window.Sbkim*`, Panel-Verdrahtung, status.json +
Pie).
**Modul:** 05_anastomose

---

## Auftrag

Eine Phase (Bau), drei Stränge:

1. **`src/modules/05_anastomose.js` schreiben** — IIFE mit
   `window.SbkimAnastomose`, fünf öffentliche Funktionen aus
   INTERFACES.md §1 Modul 05, sechs benannte Error-Klassen,
   kanonischer Sign/Verify-Pfad (gleicher Stil wie Modul 02), Match
   ausschließlich über `SbkimMatch.isAboveProviderThreshold`,
   Persistenz ausschließlich über `SbkimStorage`, Selbstcheck synchron
   beim Skript-Laden, `node --check` grün.
2. **Service-Worker-Variante entscheiden und bauen** — die Spec-Sitzung
   hatte Variante A (Page-Hosted via MessageChannel) vs. Variante B
   (SW-Hosted) offen gelassen. Diese Sitzung entscheidet und
   begründet. SW-Code unter `src/sbkim-sw.js`.
3. **Panel 05 in `tests/manual_check.html` verdrahten** mit acht
   Test-Punkten aus Karte 05 § „Manueller Test", inklusive Setup-
   Knopf (einmalig Embedding + zwei Knoten), Re-Handshake-Idempotenz,
   `forgetSibling`-Idempotenz, `listSiblings`-Form-Check und
   Selbstcheck-Konsolen-Hinweis.
4. **`status.json` Modul 05** von `spec` auf `stub` heben, Pie via
   `python3 scripts/update_puls_pie.py` regenerieren (Spec fertig 1
   → 0, Code-Stub 4 → 5).
5. **Sitzungs-Abschluss:** PULS-Eintrag, Übergabeprotokoll (diese
   Datei), WEGWEISER-Stand-Block-Zeile, Karte 05 Hero-Badge auf 🟦
   Code-Stub, Bauzustand-Tabelle ergänzt.

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Fünf-Funktionen-API verbindlich** (Spec-Sitzung 05):
  `init/handshake/receiveHandshake/listSiblings/forgetSibling`.
- **PROVIDER_MIN_MATCH = 0.80** (Pflege-Sitzung 2026-05-14) —
  niemals literal in 05, nur über
  `SbkimMatch.isAboveProviderThreshold`.
- **Singleton-Identität** aus Modul 02 — `"main"` in `sbkim_keys` und
  `sbkim_spore`. Multi-Identität würde die 02-Spec brechen.
- **Spore-Verifikation** strikt über `SbkimSpore.verifyForeignSpore` —
  bei `{valid:false}` Abbruch.
- **Persistenz strikt über `SbkimStorage`** — kein direkter
  `indexedDB.open` in 05.
- **Stores aus Karte 05 / §1 Vertrag:** `sbkim_siblings` (peerNodeId
  → {nodeId, domain, endpoint, pubKey, since}) und
  `sbkim_anastomosis_log` (ts → {ts, peerId, outcome}). Log
  anonymisiert: kein domainVector, kein Score-Profil.
- **`receiveHandshake` wirft NIEMALS** — alles als
  `HandshakeResponse{outcome:"rejected", reason:"<deutsch>"}`. Analog
  Modul 02 `verifyForeignSpore`.
- **Bidirektionale Eintragung** nur bei beidseitigem Match.
  Reentry-Idempotenz: `since` bleibt eingefroren, Log bekommt
  `outcome:"re-handshake"`. `forgetSibling` auf unbekannte ID wirft
  nicht.
- **Hauptversion-Mismatch** → sofortiger Abbruch
  (`ProtocolVersionMismatchError` ausgehend; eingehend
  `outcome:"rejected", reason:"Inkompatible Hauptversion: <x.y>"`).
- **`fetch` mit `AbortController(QUERY_TIMEOUT_MS=4000)`** für
  outgoing POST.

---

## Was getan wurde

### 1. `src/modules/05_anastomose.js` geschrieben

IIFE-Modul wie 01/02/04: klassisches `<script>`-Tag, kein ESM-Import,
exportiert `window.SbkimAnastomose` mit den fünf öffentlichen
Surface-Einträgen aus der Spec.

**Implementierungs-Details:**

- **Sechs benannte Error-Klassen** mit deutschsprachiger Message:
  `AnastomoseDependenciesError`, `InvalidPeerSporeError`,
  `ProtocolVersionMismatchError`, `HandshakeTimeoutError`,
  `HandshakeNetworkError`, `HandshakeSignatureInvalidError`. Alle
  über `makeError(name, message, cause)` mit Original-Error in
  `cause` (Modul 02 Stil).
- **Krypto-Pfad bewusst aus Modul 02 dupliziert** —
  `canonicalize()` (rekursive lex-Sortierung, immutable),
  `base64urlEncode/Decode()` (RFC 4648 §5),
  `canonicalJsonBytesWithoutSignature()`,
  `signEnvelope(unsigned, privateKey)` und
  `verifyEnvelope(envelope, publicKeyJwk)`. Damit signiert/verifiziert
  Modul 05 sowohl HandshakeRequest als auch HandshakeResponse über
  den gleichen Pfad wie die Spore. Single-File-PWA-Stil; ein
  späteres Refactor (gemeinsame Library) ist Pflege-Sitzungs-Stoff.
- **Identitäts-Zugang:** `loadOwnPrivateKey()` liest
  `sbkim_keys["main"].privateKey` (JWK) über
  `SbkimStorage.get(...)` und re-importiert via
  `crypto.subtle.importKey("jwk", …, {name:"Ed25519"}, true,
  ["sign"])`. Modul 02 exportiert keinen Sign-Helfer; den privateKey
  über den offiziellen Storage-Pfad zu holen ist die saubere
  Alternative zum Singleton-Bruch.
- **`init()`** prüft Abhängigkeiten (`SbkimStorage / SbkimSpore /
  SbkimMatch` auf `window`, WebCrypto), ruft `SbkimStorage.init()`
  und `SbkimSpore.init()`, stellt via
  `SbkimSpore.getOrCreateIdentity()` die Identität sicher,
  registriert den Service-Worker-Brücken-Listener (siehe Punkt 2)
  und setzt das interne `ready`-Flag. Idempotent.
- **`handshake(targetSpore, ownDomainVector)`** in vier Phasen:
  1. `SbkimSpore.verifyForeignSpore(targetSpore)` — bei
     `{valid:false}` → `InvalidPeerSporeError`.
  2. Hauptversions-Check explizit (zusätzlich zum verifyForeignSpore-
     internen Check) — bei Mismatch
     `ProtocolVersionMismatchError`, ohne Netz-Aufruf.
  3. Lokaler Vor-Check, wenn `targetSpore.domainVector` vorhanden:
     `SbkimMatch.match(ownDomainVector, peerVec)`; bei
     `!isAboveProviderThreshold` → `{outcome:"rejected-local",
     score}` + Log `"abgelehnt: lokal"`. Kein Netz-Aufruf, kein
     Throw.
  4. HandshakeRequest bauen (alphabetisch sortiert via
     `canonicalize`), kanonisch signieren mit
     `loadOwnPrivateKey()`, POST mit
     `AbortController(QUERY_TIMEOUT_MS)`. Bei AbortError →
     `HandshakeTimeoutError` + Log `"timeout"`; bei sonstigem Netz-
     Fehler → `HandshakeNetworkError`.
  5. `consumeResponse()` verifiziert `receiverSpore` über
     `SbkimSpore.verifyForeignSpore` und die Response-Signatur über
     `verifyEnvelope`. Bei `outcome:"established"` →
     `sbkim_siblings.put` + Log `"established"`, Rückgabe
     `{outcome:"established", peerNodeId, peerDomain, score}`. Bei
     `outcome:"rejected"` → Log `"abgelehnt: peer"`, Rückgabe
     `{outcome:"rejected", reason, score?}` (kein Throw — semantische
     Ablehnung ist Outcome).
- **`receiveHandshake(request)`** in neun Schritten:
  1. Form-Check (alle Pflichtfelder vorhanden) → sonst
     `outcome:"rejected", reason:"Form ungültig: Pflichtfeld
     fehlt: <name>"`.
  2. `SbkimSpore.verifyForeignSpore(senderSpore)` → `{valid:false}`
     ⇒ reason durchgereicht.
  3. Hauptversion explizit.
  4. Request-Signatur über `verifyEnvelope(request,
     senderSpore.publicKey)`.
  5. `toNodeId`-Check (nur wenn der Sender ihn mitgeschickt hat) —
     Mismatch zur eigenen `getNodeId()` →
     `"toNodeId stimmt nicht zum Empfänger"`.
  6. `domainVector` aus `request.domainVector` *oder*
     `senderSpore.domainVector`; sonst
     `"kein domainVector verfügbar"`.
  7. Eigener `loadOwnDomainVector()` — liest aus
     `getOwnSpore().domainVector` oder dem
     `_setOwnDomainVector`-Override (Test). Sonst `"kein
     domainVector verfügbar (lokal)"`.
  8. `SbkimMatch.match(ownVec, peerVec)`; bei
     `!isAboveProviderThreshold` →
     `outcome:"rejected", reason:"score unterhalb Schwelle"`,
     `score` mitgeschickt, Log `"abgelehnt: score"`.
  9. Sonst `upsertSibling` (Reentry-idempotent),
     Log `"established"` bzw. `"re-handshake"`, signierte Response
     `{outcome:"established", score, …}`.

  Wirft NIEMALS — der äußere `try/catch` fängt selbst Storage-
  Crashes ab und versucht eine signierte Rejection zu bauen; nur bei
  totalem Empfänger-Ausfall (auch Sign scheitert) wird eine
  *unsignierte* Notbremse zurückgegeben, die der Sender über
  `verifyEnvelope` korrekt ablehnt.
- **`listSiblings()`** liefert
  `[{nodeId, domain, since, pubKey}, …]` aus `SbkimStorage.all(
  "sbkim_siblings")`. Reihenfolge ist die natürliche Storage-Reihen-
  folge (Schlüssel-Sortierung nach nodeId).
- **`forgetSibling(nodeId)`** prüft Existenz via `get` und überspringt
  den `del`-Aufruf bei unbekannter ID — `forgetSibling` wirft also
  niemals bei Idempotenz.
- **Log-Schlüssel-Eindeutigkeit:** `nextLogKey()` hängt einen
  `+N`-Sub-Counter an den ISO-Timestamp, wenn die Millisekunde
  wiederholt belegt wird. Das `ts`-Feld im Wert bleibt die reine
  ISO-Zeit. Sortierreihenfolge bleibt lexikographisch korrekt.
  Notwendig, weil Re-Handshakes in derselben ms (Test 5) sonst den
  vorigen Log-Eintrag überschreiben würden.
- **Selbstcheck synchron am Skript-Ende:**
  `console.info("MODUL 05 ANASTOMOSE bereit, Funktionen: init/
  handshake/receiveHandshake/listSiblings/forgetSibling")`. Format
  exakt wie in INTERFACES.md §1 Modul 05 verlangt.
- **`_meta`-Objekt** zur DevTools-Inspektion mit
  `protocolVersion`, `queryTimeoutMs`, `endpointAnastomosis`,
  `embeddingDim`, `siblingsStore`, `logStore`,
  `requestRequiredFields` (analog 01/02/03/04).

**Bewusst weggelassen:**

- **Aktiver Replay-Schutz** mit nonce-Cache — Spec verschiebt das auf
  Modul 11 (Schutz-Backlog). `nonce` ist im Schema, wird aber nicht
  auf Wiederholung geprüft. Re-Handshake-Idempotenz fängt den
  doppelten Klick sauber ab.
- **Constant-Time-Pfad** — Spec macht das zum bewussten Trade-off
  („Lesbarkeit schlägt Constant-Time"); Modul 11/12 hebt das, wenn
  ein anderes Bedrohungsmodell nötig wird.
- **Crawler / Discovery / Pulsation** — Spec verbietet das explizit.

**JS-Syntax mit `node --check src/modules/05_anastomose.js`
validiert (grün).**

### 2. Service-Worker-Variante entschieden: A (Page-Hosted)

`src/sbkim-sw.js` ist dünn (~120 Zeilen), keine Krypto, kein State:

- `install` + `activate` mit `skipWaiting()`/`clients.claim()` — sofort
  Kontrolle über offene Tabs.
- `fetch`-Listener fängt nur Pfade ab, die auf `/sbkim/anastomosis`
  enden (erlaubt sowohl `/sbkim/anastomosis` als auch
  `/<scope>/sbkim/anastomosis` für GitHub-Pages-Project-Sites).
- **Vertrag aus INTERFACES.md §3 + Karte 05 §
  „Service-Worker-Hinweis":**
  - andere Methode → 405 (mit `Allow: POST`-Header)
  - falscher Content-Type → 415
  - Body > 64 KiB (UTF-8-Bytes) → 413
  - kein gültiges JSON → 400
  - kein aktiver Tab → 503
  - Page antwortet nicht binnen 4 s → 503
- Aktive Tabs werden über `self.clients.matchAll({type:"window",
  includeUncontrolled:true})` gesammelt; bevorzugt der Tab, der den
  Request ausgelöst hat (`originatingClientId`), sonst der erste
  offene.
- `MessageChannel`-Brücke: SW schickt
  `{type:"SBKIM_ANASTOMOSIS_REQUEST", request}` an den Tab,
  `port1` bleibt im SW, `port2` geht zum Tab. Promise wird mit
  `setTimeout(reject, 4000)` getimt-out.
- Page-Listener wird in Modul 05's `init()` via
  `navigator.serviceWorker.addEventListener("message", …)`
  registriert. Bei `SBKIM_ANASTOMOSIS_REQUEST` ruft die Page
  `receiveHandshake(request)` auf und schickt die Response über
  `event.ports[0].postMessage(...)` zurück.

**Begründung für Variante A** (in Karte 05 § „Service-Worker-Hinweis"
ergänzt):

- Modul 03 (`transformers.js`) ist im SW-Scope ohne erheblichen
  Mehraufwand nicht ladbar (kein DOM, anderes Import-Modell). Eine
  SW-Hosted-Variante müsste fertige Domain-Vektoren mitliefern und
  würde damit eine zweite Persistenz-Stelle für ownDomainVector
  brauchen — Komplexität, die hier nicht abgegolten werden muss.
- Single-File-PWA-Stil bedeutet: ein Code-Pfad, ein State, eine
  IndexedDB-Verbindung. Variante B würde zwei Kopien des Codes
  pflegen (Page + SW) und zwei Schichten Cache-Invalidierung.
- „503, wenn keine Page aktiv ist" steht so in der Spec —
  Variante A führt direkt dort hin.
- Modul 11 (Rate-Limit, Schutz-Backlog) kann später dünn auf den
  SW gelegt werden, ohne dass die Page-Logik mitwächst.

`src/sbkim-sw.js` ist als neuer Pfad außerhalb `src/modules/`
angelegt — Service-Worker ist kein klassisches Modul; er wird vom
Endknoten mit `navigator.serviceWorker.register("/sbkim-sw.js")`
registriert. Der konkrete Pfad für Rezeptbuch/Mixarium ist Modul 09.

**JS-Syntax mit `node --check src/sbkim-sw.js` validiert (grün).**

### 3. `tests/manual_check.html` Panel 05 verdrahtet

Panel-Status von „noch nicht gebaut" auf „Code-Stub". Hinweis-Text
mit Lade-Hinweis (Modul 03 ~30 MB beim ersten Klick auf Setup) und
Klarstellung, dass der echte Netz-Pfad (SW + fetch) hier *nicht*
abgedeckt ist — der gehört in Modul 09. Neun Knöpfe (Setup + sieben
Test-Punkte + Selbstcheck):

1. **Setup: Embedding + 2 Knoten (einmalig)** — `SbkimAnastomose.init()`,
   `SbkimEmbedding.init()`, drei Domain-Vektoren ziehen (Main =
   Backen-Schlüsselwörter, Alt = Cocktail-Schlüsselwörter, Fremd =
   „Tarantino Drehbuch Filmkritik Western" für Domain-Mismatch),
   Main-Spore mit `domainVector` regenerieren, Alt-Identität
   in-memory erzeugen (Ed25519-Keypair, kanonisch signierte
   Pseudo-Spore über `SbkimAnastomose._signEnvelope`). Pass-
   Kriterium: zwei verschiedene Vorschau-Vektoren, beide Knoten
   mit ihrer nodeId zurück.
2. **Test 1: Lokaler Zwei-Knoten-Handshake (passt)** —
   `_buildSignedRequest(alt.privKey, alt.spore, altVec, mainNodeId)`
   bauen, `_invokeDirect(request)` aufrufen, Response-Signatur
   via `_verifyResponseSignature(response, mainSpore.publicKey)`
   prüfen. Pass: `outcome:"established"`, Signatur ok,
   `sbkim_siblings` enthält Alt.
3. **Test 2: Domain-Mismatch (Tarantino-Vektor)** — zweiter
   In-Memory-Alt-Knoten mit Filmkritik-Vektor. Pass:
   `outcome:"rejected"`, `reason ~ /score/`, `score < 0.80`,
   Signatur trotzdem ok.
4. **Test 3: Versions-Mismatch (Spore 1.0)** — Alt-Spore mit
   `protocolVersion: "1.0"`. `SbkimSpore.verifyForeignSpore`
   lehnt mit `"Inkompatible Hauptversion: …"` ab, reason wird in
   Response durchgereicht. Pass: `reason ~ /Hauptversion/`.
5. **Test 4: Signatur manipuliert** — Request nach Signieren im
   `fromNodeId` (letztes Zeichen → `A`) verändert. Pass:
   `outcome:"rejected"`, `reason ~ /Signatur/`.
6. **Test 5: Re-Handshake (zweimal nacheinander)** — `since`
   vor und nach prüfen, sibling-Eintrag zählen, letzten Log-
   Eintrag inspizieren. Pass: beide `established`, `since`
   unverändert, sibling einmal, letzter Log `outcome:"re-handshake"`.
7. **Test 6: forgetSibling** — Sibling entfernen + idempotenter
   Aufruf mit nicht-existenter ID. Pass: Alt nicht mehr in
   `listSiblings`, Log unverändert, kein Throw.
8. **Test 7: listSiblings nach zwei Handshakes** — zwei
   verschiedene Alt-Knoten anlegen, beide via `_invokeDirect`
   verbinden. Pass: beide in `listSiblings` mit Form
   `{nodeId, domain, since, pubKey}`.
9. **Selbstcheck Konsole prüfen** — Hinweisknopf ohne Aktion;
   erwartete Zeile `MODUL 05 ANASTOMOSE bereit, Funktionen: …`.

Skript-Tag-Einbindung als
`<script src="../src/modules/05_anastomose.js"></script>` am Ende
der Datei (nach 01/02/03/04). Inline-Script-Syntax via
extrahier-und-`node --check` validiert (alle sechs Inline-Scripts
grün).

### 4. `status.json` + Pie regeneriert

Modul 05 von `score: "spec"` / `siegel: "Spec fertig"` auf
`score: "stub"` / `siegel: "Code-Stub"`. `kurz`-Feld unverändert
(„Handshake zwischen Knoten — kanonisch signiert, bidirektional,
Schwelle aus Modul 04").

`python3 scripts/update_puls_pie.py` lief, Pie regeneriert:

- Schablone: 7 → 7
- Werkstatt: 1 → 1
- Spec fertig: 1 → 0
- Code-Stub: 4 → 5
- Fertig: 0 → 0

Genau wie das Briefing vorgibt.

### 5. Karte 05 Bauzustand + Hero-Badge

- Hero-Badge: 🟨 Spec fertig → 🟦 Code-Stub.
- Bauzustand-Tabelle: Zeile *Code geschrieben | 2026-05-14 | Bau 05 |
  IIFE mit `window.SbkimAnastomose`, sechs Error-Klassen, kanonischer
  Sign/Verify-Pfad, SW Variante A in `src/sbkim-sw.js`, `node --check`
  grün* eingefügt. Zeile *Sichttest | — | — | ungeprüft, weil
  Sitzung headless — Klaus klickt im Browser* eingefügt.
- § „Service-Worker-Hinweis" mit der Variante-A-Entscheidung und vier
  Begründungen fortgeschrieben (Modul-03-SW-Schwierigkeit, Single-
  File-PWA-Stil, 503-Spec-Treue, Modul-11-Hook).

### 6. PULS + WEGWEISER

- PULS-Sitzungs-Eintrag oben („Bau-Sitzung Modul 05 Anastomose
  (Code-Stub)") mit Was getan / Frischer-Kopf-Befund / Was offen
  blieb / Nächster sinnvoller Schritt.
- PULS-Schnellüberblick Modul-05-Zeile: `Spec fertig (2026-05-14)` /
  `Code-Stub (2026-05-14)` / `ungeprüft (Sitzung headless)` /
  „Handshake; Fünf-Funktionen-API, bidirektional, kanonisch signiert,
  Schwelle aus Modul 04; SW Variante A (Page-Hosted)".
- PULS „Als nächstes ✨": Modul 05 wandert aus „Mit Spec fertig" in
  „Code-Stub frisch, Sichttest ausstehend". Empfehlung umgestellt
  auf Spec-Sitzung Modul 07 (Apoptose) oder Modul 09 (Einbau-PWA mit
  domainVector-Pflicht-Frage).
- WEGWEISER-Stand-Block-Zeile unten neu (Wanderung — neueste Zeile
  unten, wie das Format vorschreibt).

---

## Frischer-Kopf-Befund: keine API-Korrektur, zwei Design-Entscheidungen

Das Briefing erlaubte API-Korrekturen, wenn beim Lesen eine Vorgabe
falsch gerichtet auffiel. Beim Durchgehen kein solcher Punkt — die
Fünf-Funktionen-API trägt, die Reentry-Mechanik ist sauber, die
Trennung „Outcome vs. Throw" hat keine Lücken. Zwei Design-
Entscheidungen sind aber zu protokollieren:

### a) Kein Bedarf, Modul 02 zu erweitern

Die Spec-Aussage „Krypto-Operationen über `window.SbkimSpore`"
deutete auf einen Sign-Helfer in Modul 02 hin. Modul 02 exportiert
aber nur `init/getOrCreateIdentity/getNodeId/getPublicKeyJwk/
generateOwnSpore/getOwnSpore/verifyForeignSpore` — keine
`signBytes/verifyBytes`-Paare. Optionen:

1. **Modul 02 erweitern** um `signBytes(bytes) →
   Promise<base64url>` und `verifyBytes(bytes, sig, jwk) →
   Promise<boolean>`. Saubere Trennung der Verantwortung, aber
   Querschnitts-Änderung: INTERFACES.md §1 Modul 02 + Karte 02 + Code.
2. **Modul 05 lädt den privateKey direkt** über
   `SbkimStorage.get("sbkim_keys", "main")` und macht
   `importKey/sign/verify` selbst.

Option 2 gewählt:

- `SbkimStorage` ist die offizielle Single Source für alle
  `sbkim_*`-Stores — Modul 05 darf die offizielle API benutzen.
- Der Krypto-Pfad (canonicalize, base64url) ist ohnehin aus Modul 02
  dupliziert (Briefing-Vorgabe: „bewusst dupliziert, keine geteilte
  Library, Single-File-PWA-Stil"). Den privateKey-Import zu
  duplizieren ist die letzte Stufe dieser bewusst gewählten
  Code-Duplikation.
- Eine Modul-02-Erweiterung wäre formal außerhalb des Bau-05-Auftrags
  und würde drei Stellen statt einer berühren.

Die Refactor-Option (Modul 02 ⇄ Modul 05 Krypto zusammenführen) ist
als Pflege-Sitzungs-Stoff im PULS-Eintrag und in der Karte 05 als
Punkt vermerkt. Sie kann auch warten, bis Modul 06 oder 07 dieselben
Helfer brauchen — dann lohnt sich das Bündeln.

### b) In-Memory-Pseudo-Knoten statt Multi-Identity

Briefing schlug zwei Optionen für den Zwei-Knoten-Test:

1. **Identity-Switcher** in Modul 02 (Schlüssel `"main"` und
   `"alt"`). Würde die Singleton-Spec von 02 brechen (Karte 02 sagt
   explizit: „Singleton-Identität pro PWA: in beiden Stores wird der
   feste Schlüssel `\"main\"` benutzt").
2. **In-Memory-Pseudo-Knoten** — eigenes Keypair + eigene Spore im
   Speicher, kein IndexedDB-Eintrag.

Option 2 gewählt. Konsequenz:

- **Modul 02 bleibt unberührt** — Singleton-Spec hält.
- **Das Panel testet bidirektional nur die Empfänger-Seite** (Main
  hat Alt in `sbkim_siblings`). Die andere Hälfte (Alt hat Main in
  seiner sibling-Liste) ist im Panel nicht abgedeckt, weil Alt
  keine IndexedDB hat. Das ist ein bewusst gewählter Test-
  Pragmatismus, dokumentiert in PULS und Übergabeprotokoll.
- **Der volle bidirektionale Pfad muss in Modul 09** (Einbau-PWA)
  mit zwei tatsächlichen Tabs/Geräten getestet werden — dann beide
  mit echter IndexedDB-Identität.

### c) Service-Worker-Variante A

Die zwei offenen Punkte aus der Spec-Sitzung 05:

- **Service-Worker-Variante:** A (Page-Hosted) gewählt — Begründung
  oben unter „Was getan wurde §2".
- **Replay-Schutz:** wie in der Spec offen gelassen. `nonce` ist im
  Schema, wird aber nicht auf Wiederholung geprüft. Re-Handshake-
  Idempotenz fängt doppelte Klicks. Aktiver nonce-Cache gehört in
  Modul 11.

---

## Was offen blieb

- **Sichttest Karte 05** durch Klaus — Panel 05 mit acht Knöpfen +
  Selbstcheck. Voraussetzung: WebCrypto Ed25519 + Modul 03 lädt
  einmalig ~30 MB. Erwartungen pro Knopf siehe PULS-Eintrag.
- **`domainVector` in der Spore — Pflicht oder optional?** Übernommen
  aus der Anastomose-Spec. Aufhänger für eine Spec-Sitzung Modul 09
  (Einbau-PWA): wenn der Andock-Workflow `domainVector`
  pflicht-macht, ist das ein Hauptversions-Sprung `0.1 → 1.0`.
  Bauplan: §2 Spore-Pflichtfeld ergänzen + §4 erwähnen + Karte 02
  nachziehen + Modul 02 generateOwnSpore: `domainVector` Pflicht statt
  optional.
- **Echter Netz-Pfad (Service-Worker + fetch zwischen zwei Origins)**
  ist im Panel 05 bewusst nicht abgedeckt — er gehört in Modul 09
  mit zwei tatsächlichen Endknoten. Das Panel 05 prüft die
  *Verarbeitungs-Logik* (kanonische Signatur, Versionscheck, Match,
  Reentry, forgetSibling), nicht das Transport-Verhalten.
- **Modul 02 ⇄ 05 Krypto-Refactor** — in einer eigenen Pflege-
  Sitzung optional zusammenführbar (sign/verify-Helfer in 02
  exportieren). Lohnt sich erst, wenn Modul 06 oder 07 dieselben
  Helfer braucht.
- **PULS.md Zeilen-Längen-Schwellwert.** CLAUDE.md sagt 400 Zeilen
  Maximum, jetzt deutlich darüber. Älteres in
  `docs/sessions/archiv/` umzuziehen ist Querschnitts-Aufräum-Arbeit
  für eine eigene Sitzung — nicht Teil dieser Bau-Sitzung. Die
  letzten vier Sitzungen sind genauso vorgegangen.

---

## Nächster sinnvoller Schritt

1. **Sichttest Karte 05** durch Klaus — die acht Knöpfe in Panel 05
   durchgehen. Voraussetzung: WebCrypto Ed25519 und Modul 03
   lädt einmal das Modell (~30 MB).
2. **Spec-Sitzung Modul 07 Apoptose** — Vorbedingungen 01 + 02
   erfüllt, signiertes Vermächtnis braucht den Ed25519-Schlüssel aus
   02. Parallel zur Anastomose lauffähig (Module unabhängig).
3. **Spec-Sitzung Modul 09 Einbau-PWA** — mit der offenen
   `domainVector`-Pflicht-Frage aus der Anastomose-Spec. Anastomose
   ist jetzt Code-Stub; der nächste Schritt ist die Andock-Anleitung,
   über die Rezeptbuch/Mixarium tatsächlich einen `domainVector` in
   ihre Spore bekommen.
4. Parallel anbietbar: **Spec-Sitzung Modul 00 (Doku-Fenster)** —
   dependenz-frei, 5-Klick-UI in der Endknoten-PWA.

---

## Pflicht-Häkchen am Sitzungsende

- [x] `src/modules/05_anastomose.js` geschrieben (IIFE,
      `window.SbkimAnastomose`, fünf Funktionen, sechs Error-Klassen,
      kanonischer Sign/Verify-Pfad, Selbstcheck synchron beim
      Skript-Laden, `node --check` grün)
- [x] Match-Schwelle ausschließlich über
      `SbkimMatch.isAboveProviderThreshold` (kein literales `0.80`
      in 05)
- [x] Spore-Verifikation ausschließlich über
      `SbkimSpore.verifyForeignSpore` (in 05 + buildResponse-Pfad)
- [x] Persistenz ausschließlich über `SbkimStorage`
      (`sbkim_siblings` + `sbkim_anastomosis_log`; kein direkter
      `indexedDB.open` in 05)
- [x] Bidirektionale Eintragung nur bei beidseitigem Match (Sender
      seitig in `consumeResponse`, Empfänger seitig in
      `receiveHandshake`)
- [x] Reentry-Verhalten (`since` eingefroren in `upsertSibling`,
      `re-handshake`-Log)
- [x] `forgetSibling` auf unbekannte nodeId wirft nicht (idempotent)
- [x] Hauptversion-Mismatch → sofortiger Abbruch
- [x] `receiveHandshake` wirft NIEMALS (äußerer `try/catch`)
- [x] `fetch` mit `AbortController(QUERY_TIMEOUT_MS=4000)`
- [x] Service-Worker-Variante entschieden (A · Page-Hosted) und
      begründet (im Protokoll + Karte 05 § „Service-Worker-Hinweis")
- [x] `src/sbkim-sw.js` geschrieben (`node --check` grün)
- [x] `tests/manual_check.html` Panel 05 auf „Code-Stub" mit acht
      Test-Punkten (Setup + sieben Tests + Selbstcheck)
- [x] `_invokeDirect / _buildSignedRequest / _verifyResponseSignature
      / _setOwnDomainVector` als inoffizielle Test-Brücken exportiert
- [x] `status.json` Modul 05 auf `score:"stub"` /
      `siegel:"Code-Stub"` (keine anderen Modul-Scores geändert)
- [x] `python3 scripts/update_puls_pie.py` gelaufen (Spec fertig
      1→0, Code-Stub 4→5)
- [x] Karte 05 Hero-Badge auf 🟦 Code-Stub
- [x] Karte 05 Bauzustand-Tabelle ergänzt (*Code geschrieben*,
      *Sichttest ungeprüft*)
- [x] Karte 05 § „Service-Worker-Hinweis" mit Variante-A-
      Entscheidung fortgeschrieben
- [x] `docs/PULS.md` Sitzungs-Eintrag oben, Schnellüberblick und
      „Als nächstes ✨" aktualisiert
- [x] `docs/WEGWEISER.md` Stand-Block-Zeile unten ergänzt
- [x] Übergabeprotokoll (diese Datei)
- [ ] Manueller Sichttest im Browser — explizit als „ungeprüft, weil
      Sitzung headless" markiert; Klaus klickt im Browser
- [ ] Commit + Push auf `claude/bau-05-anastomose-FrQKF` (folgt)
- [ ] Draft-PR gegen `main`, danach merge (folgt)
