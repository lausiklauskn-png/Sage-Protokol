# Übergabeprotokoll · 2026-05-15 · Bau-Sitzung Modul 06 Heterokaryose

**Sitzungs-Rolle:** Bau-Sitzung (eine Sitzung, eine Phase). Bau-Phase
für Modul 06; die Spec lag aus der Spec-Sitzung 06 vom selben Tag
(PR #34) vollständig vor (Karte 06 + INTERFACES.md §0 / §1 Modul 06 /
§2 Heterokaryose / §3 / §4 / §6).
**Branch:** `claude/bau-06-heterokaryose-FN221`
**Format:** angelehnt an `docs/sessions/BRIEFING_TEMPLATE.md` §C und
am Übergabeprotokoll der Bau-Sitzung 07 vom 2026-05-14 (zweite
Komposition-Bau-Referenz nach Bau-Sitzung 05 vom 2026-05-14 — IIFE,
`window.Sbkim*`, kanonischer Sign/Verify-Pfad bewusst dupliziert,
Service-Worker-Variante A, Panel-Verdrahtung).
**Modul:** 06_heterokaryose

---

## Auftrag

Eine Phase (Bau), fünf Stränge plus acht verbindliche Pflichtfragen:

1. **`src/modules/06_heterokaryose.js` schreiben** — IIFE mit
   `window.SbkimHeterokaryose`, fünf öffentliche Funktionen aus
   INTERFACES.md §1 Modul 06, fünf benannte Error-Klassen, kanonischer
   Sign/Verify-Pfad als vierter Duplikations-Pfad (gleicher Stil wie
   Modul 02 / 05 / 07), Persistenz ausschließlich über `SbkimStorage`,
   Selbstcheck synchron beim Skript-Laden, `node --check` grün.
2. **`src/sbkim-sw.js` um den `/sbkim/heterokaryosis`-Pfad erweitern**
   — analog zu `/sbkim/anastomosis` und `/sbkim/legacy` aus Bau-
   Sitzungen 05/07, Variante A · Page-Hosted via MessageChannel.
   Body-Schutz (≤ 64 KiB → 413), POST + JSON-Content-Type (sonst
   405/415), `postMessage` an die Page mit neuem Typ
   `SBKIM_HETEROKARYOSIS_REQUEST` und `MessageChannel`-Port, 503 bei
   keiner aktiven Page.
3. **`src/modules/01_storage.js` additive Migration** — `DB_VERSION`
   1 → 2, neuer Store `sbkim_hetero_inbox` (Komposit-Schlüssel
   `<peerNodeId>|<ts>`).
4. **`src/modules/07_apoptose.js` Cleanup-Reihenfolge** — neuer Schritt
   `sbkim_hetero_inbox` zwischen `sbkim_legacy_inbox` und
   `sbkim_spore`.
5. **`tests/manual_check.html` Panel 06 füllen** mit ~13 Test-Punkten
   aus Karte 06 § „Manueller Test", inklusive Setup-Knopf (Identität,
   Domain-Vektor, drei In-Memory-Pseudo-Geschwister mit/ohne
   `heterokaryosisOptIn`-Flag).
6. **`status.json` Modul 06** von `score:"spec"` auf `score:"stub"`
   heben, Pie via `python3 scripts/update_puls_pie.py` regenerieren
   (Spec fertig 2 → 1, Code-Stub 7 → 8).
7. **Karten 01/06/07 + INTERFACES.md §1 Modul 01/06/07** + §6
   Änderungsprotokoll-Zeile nachziehen.
8. **Sitzungs-Abschluss:** PULS-Eintrag, Übergabeprotokoll (diese
   Datei).

Acht verbindliche Pflichtfragen (aus dem Briefing):

- **Frage 1:** Sign/Verify-Pfad duplizieren oder importieren?
  → **duplizieren** (vierter Pfad, Single-File-PWA-Stil).
- **Frage 2:** Test-Brücken-Surface.
  → `_invokeReceiveHeterokaryosisDirect`, `_buildSignedHeterokaryosisRequest`,
  `_verifyResponseSignature`, `_addPseudoSibling` (mit
  `heterokaryosisOptIn`-Flag-Argument, Storage-basiert),
  `_clearPseudoSiblings`, `_setReceiverHttpStatus`, plus Krypto-Helfer.
- **Frage 3:** Service-Worker dritter fetch-Listener-Pfad.
  → parallel zu den ersten zwei, Variante A Page-Hosted,
  `SBKIM_SW_STANDALONE` unangetastet.
- **Frage 4:** `DB_VERSION` 1 → 2.
  → additive Migration, `oldVersion < 2`-Block, kein Datenverlust.
- **Frage 5:** Karte 07 Cleanup-Reihenfolge.
  → `sbkim_hetero_inbox` zwischen Schritt 3 und 4 (vor
  Identitäts-Schicht). Karte 07 + INTERFACES.md §1 Modul 07 + Code
  ziehen mit.
- **Frage 6:** Synchroner Selbstcheck.
  → `console.info("MODUL 06 HETEROKARYOSE bereit, Funktionen:
  init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/
  forgetHeterokaryosis");`
- **Frage 7:** Anker-Quelle.
  → ausschließlich Spore-Single-Anker-Fallback. Wenn
  `senderSpore.domainVector` vorhanden → 1 Anker; sonst leeres Array.
  Kein `sbkim_hetero_outbox`-Code (Spec-Sitzung 08).
- **Frage 8:** Panel 06.
  → 14 Knöpfe (Setup + 12 Test-Punkte + Selbstcheck), Knopf-Stil
  exakt wie Panel 07, alle Inline-Scripts via `node --check`
  syntaktisch validiert.

Vorgaben aus den vorigen Sitzungen, die diese Sitzung übernimmt:

- **Fünf-Funktionen-API verbindlich** (Spec-Sitzung 06):
  `init/requestHeterokaryosis/receiveHeterokaryosis/listHeterokaryosis/
  forgetHeterokaryosis`.
- **`receiveHeterokaryosis` wirft NIEMALS** (Outcome statt Throw,
  analog `verifyForeignSpore`, `receiveHandshake`, `receiveLegacy`).
- **Singleton-Identität** aus Modul 02 — `"main"` in `sbkim_keys` und
  `sbkim_spore`.
- **Spore-Verifikation** strikt über `SbkimSpore.verifyForeignSpore`.
- **Persistenz strikt über `SbkimStorage`** — kein direkter
  `indexedDB.open` in 06.
- **Modul 06 ruft `SbkimAnastomose.handshake` NICHT auf** — eigener
  HTTP-POST gegen `/sbkim/heterokaryosis`.
- **Pull-Pattern, kein Push, keine Pulsation** — `init()` registriert
  nur den MessageChannel-Listener.
- **Kanonischer Sign/Verify-Pfad** als vierter Duplikations-Pfad
  (Konvention seit Bau-Sitzung 07).
- **`PROTOCOL_VERSION = "0.1"`** und alle anderen §0-Konstanten bleiben
  unverändert. `HETERO_MAX_ANCHORS = 5` ist bereits in §0 +
  `status.json.config` gesetzt (Spec-Sitzung 06).

---

## Was getan wurde

### 1. `src/modules/06_heterokaryose.js` geschrieben

IIFE-Modul wie 01/02/04/05/07: klassisches `<script>`-Tag, kein
ESM-Import, exportiert `window.SbkimHeterokaryose` mit den fünf
öffentlichen Surface-Einträgen aus der Spec.

**Implementierungs-Details:**

- **Fünf benannte Error-Klassen** mit deutschsprachiger Message:
  `HeterokaryoseDependenciesError`, `UnknownSiblingError`,
  `HeterokaryoseTimeoutError`, `HeterokaryoseNetworkError`,
  `HeterokaryoseSignatureInvalidError`. `NoIdentityError` aus Modul 02
  wird unverändert durchgereicht.
- **Kanonischer Sign/Verify-Pfad** als vierter Duplikations-Pfad —
  `canonicalize`, `base64urlEncode`, `base64urlDecode`, `signEnvelope`,
  `verifyEnvelope`, `canonicalJsonBytesWithoutSignature`. Single-File-
  PWA-Stil, kein Eingriff in 02/05/07. Konvention seit Bau-Sitzung 07.
- **fetch-Wrapper `doFetch`** statt direktem `fetch`-Aufruf: wenn
  `receiverHttpStatusOverride` gesetzt ist, simuliert er eine Response
  mit dem überschriebenen Status. Erlaubt Test 12 (HTTP 404 →
  `endpoint_unsupported`) headless. Konsumiert den Override (einmalig).
- **`requestHeterokaryosis(peerNodeId)`** Schritt-für-Schritt:
  1. Sibling-Lookup (`sbkim_siblings.get(peerNodeId)`) → fehlt →
     `UnknownSiblingError` (synchroner Throw).
  2. Lokale Opt-In-Vorprüfung (`sibling.heterokaryosisOptIn === true`)
     → fail-soft → `outcome:"opt-out-local"` ohne Netz.
  3. Identität + eigene Spore + Privatschlüssel laden.
  4. HeterokaryosisRequest bauen (sieben Pflichtfelder inkl.
     `toNodeId`), kanonisch signieren.
  5. `doFetch` POST mit `AbortController(QUERY_TIMEOUT_MS)`. Timeout
     → `HeterokaryoseTimeoutError`. Netz-Fehler →
     `HeterokaryoseNetworkError`. HTTP 404 → `outcome:"endpoint_unsupported"`
     (kein Throw).
  6. `consumeResponse`: `verifyForeignSpore(response.receiverSpore)`,
     `verifyEnvelope(response, receiverSpore.publicKey)`. Signatur-/
     Spore-Fehler → `HeterokaryoseSignatureInvalidError`.
  7. Outcome-Verzweigung: `"shared"` → Inbox-Eintrag schreiben
     (`sbkim_hetero_inbox[peerNodeId|ts]`), Log `"hetero-pulled"`,
     Return mit `anchorCount`. `"opt-out"` → Log, Return.
     `"rejected"` → Log, Return mit `reason`.
- **`receiveHeterokaryosis(incomingRequest)`** wirft NIEMALS —
  Verifikations-Pfad in acht Schritten exakt nach INTERFACES.md §2
  Heterokaryose:
  1. Form-Check (Pflichtfelder, inkl. `toNodeId`).
  2. `verifyForeignSpore(senderSpore)`.
  3. Hauptversions-Check.
  4. Request-Signatur gegen `senderSpore.publicKey`.
  5. `toNodeId === getNodeId()`?
  6. Sibling-Filter (`sbkim_siblings.get(senderId)`)?
  7. Opt-In-Filter (`siblingEntry.heterokaryosisOptIn === true`)? Sonst
     `outcome:"opt-out"` (KEIN `reason`-Feld, minimale Antwort), Log
     `"hetero-served"` wird NICHT geschrieben — nur Log
     `"hetero-opt-out"` (Spec § Heterokaryose-Pfad Schritt 11).
  8. Anker-Quelle lesen, max. `HETERO_MAX_ANCHORS`, Response bauen
     mit `outcome:"shared"`, Log `"hetero-served"`.
- **Anker-Quelle (Spec-Wille-Erst-Iteration):** `readOwnAnchors()`
  liest die eigene Spore via `getOwnSpore()`. Wenn
  `ownSpore.domainVector` ein Array mit ≥ 1 Element ist (Spec verlangt
  384 floats, wir kopieren das ganze Array) → 1 Anker mit
  `label:"(domain)"`. Sonst leeres Array → `outcome:"shared"` mit
  `anchors:[]` (**Degraded-Modus**). Keine `sbkim_hetero_outbox`-
  Implementierung, kein Stub-Anlegen, kein Store-Register — Spec-
  Sitzung 08.
- **`listHeterokaryosis()`** liefert alle Einträge aus
  `sbkim_hetero_inbox` als `{peerNodeId, ts, anchorCount, receivedAt}`-
  Form; `anchors`-Inhalt und `signature` werden bewusst weggelassen
  (Lese-Helfer für UI, eine Detail-View gehört in Modul 08).
- **`forgetHeterokaryosis(peerNodeId, ts)`** löscht den Eintrag mit
  Komposit-Schlüssel via `SbkimStorage.del`; idempotent
  (`SbkimStorage.del` wirft nicht bei unbekanntem Schlüssel).
- **MessageChannel-Brücke** wie Modul 05/07: in `init()` registriert,
  hört auf Message-Typ `SBKIM_HETEROKARYOSIS_REQUEST`, ruft
  `receiveHeterokaryosis` mit dem Body auf, schickt Antwort über den
  Port.
- **Test-Brücken** (alle mit Unterstrich-Präfix, nur für Panel 06):
  `_invokeReceiveHeterokaryosisDirect` (Alias auf
  `receiveHeterokaryosis`), `_buildSignedHeterokaryosisRequest(toNodeId)`
  (Build + Sign ohne Versand), `_verifyResponseSignature(resp, jwk)`,
  `_addPseudoSibling({nodeId,domain,endpoint,pubKey,since,
  heterokaryosisOptIn})` (schreibt direkt in `sbkim_siblings`, weil
  Modul 06 Storage-basiert liest — kein in-memory-Override wie Modul
  07), `_clearPseudoSiblings()` (löscht die in dieser Test-Session
  gemerkten IDs aus `sbkim_siblings`), `_setReceiverHttpStatus(status|
  null)` (fetch-Override für 404-Test), plus Krypto-Helfer
  `_canonicalize`/`_base64urlEncode`/`_base64urlDecode`/`_signEnvelope`/
  `_verifyEnvelope`.

`node --check src/modules/06_heterokaryose.js` grün.

### 2. `src/sbkim-sw.js` erweitert

Drei fetch-Listener-Pfade statt zwei:

- `HETEROKARYOSIS_PATH = "/sbkim/heterokaryosis"`,
  `HETEROKARYOSIS_REQUEST_TYPE = "SBKIM_HETEROKARYOSIS_REQUEST"`.
- fetch-Listener-Block nach `LEGACY_PATH` analog mit `handleBridge`.
- Header-Kommentar auf drei Pfade aktualisiert (`/sbkim/anastomosis →
  SBKIM_ANASTOMOSIS_REQUEST`, `/sbkim/legacy → SBKIM_LEGACY_REQUEST`,
  `/sbkim/heterokaryosis → SBKIM_HETEROKARYOSIS_REQUEST`).
- Body-Schutz (405/415/413/503) identisch zu den ersten zwei Pfaden —
  `handleBridge` ist die gemeinsame Implementierung.
- `SBKIM_SW_STANDALONE`-Schalter aus Pflege App-SW-Koexistenz
  unangetastet.

`node --check src/sbkim-sw.js` grün.

### 3. `src/modules/01_storage.js` additive Migration

- `DB_VERSION` von `1` auf `2` angehoben.
- `KNOWN_STORES` aus `STORES_V1` + `STORES_V2` zusammengesetzt
  (`STORES_V1` = die sechs Stores aus Bau-Sitzung 01; `STORES_V2 =
  ["sbkim_hetero_inbox"]`).
- `applyMigration(db, v)` bekommt einen `v=2`-Block, der nur
  `STORES_V2` durchläuft und `createObjectStore` aufruft, falls nicht
  vorhanden.
- Header-Kommentar aktualisiert (DB_VERSION: 2; additive Migration in
  Bau-Sitzung 06).

Bestehende PWAs mit DB-Version 1 bekommen den neuen Store beim
nächsten Lade durch den `onupgradeneeded`-Pfad — additiv, kein
Datenverlust-Risiko.

`node --check src/modules/01_storage.js` grün.

### 4. `src/modules/07_apoptose.js` Cleanup-Reihenfolge

- Konstante `HETERO_INBOX_STORE = "sbkim_hetero_inbox"` neu.
- `CLEANUP_ORDER` von fünf auf sechs Einträge erweitert; Position 4
  zwischen `INBOX_STORE` und `SPORE_STORE`:
  ```
  SIBLINGS_STORE,
  LOG_STORE,
  INBOX_STORE,
  HETERO_INBOX_STORE,    // ← neu
  SPORE_STORE,
  KEYS_STORE,
  ```
- `confirmSelfApoptose` löscht jetzt sechs Stores statt fünf,
  gefolgt von `resetIdentityCache()` (Pflege-Sitzung 2026-05-15 bleibt
  unangetastet).
- Header-Kommentar im Cleanup-Block aktualisiert (Vermerk auf
  Bau-Sitzung 06 + Cleanup-Pflege 07).

**Folge für Panel 07 Test 6:** das Pass-Check-Feld `stores_alle_leer`
zählt aktuell `keys + sporeR + siblingsR + logR + inboxR` (= 5
Stores); nach Bau 06 wäre `sbkim_hetero_inbox` zusätzlich zu prüfen.
Das ist eine eigene Mini-Pflege Panel-07 (additiv); bis dahin bleibt
Test 6 funktional grün — nur die Detail-Prüfung „auch hetero-inbox
leer" fehlt. **Diese Bau-Sitzung hat Panel 07 NICHT angefasst** —
Spec-Disziplin Bau 06 baut Bau 07 nicht um.

`node --check src/modules/07_apoptose.js` grün.

### 5. `tests/manual_check.html` Panel 06

Panel 06 von „noch nicht gebaut" auf 🟦 Code-Stub mit 14 Knöpfen:

- **Setup:** Identität + Spore (mit Dummy-`domainVector` 384 floats
  für Single-Anker), zwei Pseudo-Geschwister mit Flag-State (`PSEUDO_OPT_IN`
  mit `heterokaryosisOptIn:true`, `PSEUDO_OPT_OUT` mit `:false`).
- **Test 1 (Lokaler Pull-Round-Trip):** Singleton ≈ Selbst-Sender;
  Self-Eintrag mit Flag=true in `sbkim_siblings`, signierter Request →
  `_invokeReceiveHeterokaryosisDirect` → `outcome:"shared"`. Signatur-
  Verify, Inbox-Schreiben (manuell, weil `_invokeDirect` den
  Inbox-Pfad des Senders nicht durchläuft).
- **Test 2 (Opt-Out beim Empfänger):** Self-Eintrag mit Flag=false →
  `outcome:"opt-out"` ohne `reason`-Feld.
- **Test 3 (Opt-Out lokal):** `requestHeterokaryosis(PSEUDO_OPT_OUT)` →
  `outcome:"opt-out-local"` ohne Netz-Aufruf.
- **Test 4 (Unbekannter Sibling):** `requestHeterokaryosis("UNBEKANNT…")` →
  `UnknownSiblingError`.
- **Test 5 (Sender kein Geschwister):** eigener Eintrag aus
  `sbkim_siblings` entfernt → `outcome:"rejected", reason: "Sender
  ist kein Geschwister"`.
- **Test 6 (toNodeId-Mismatch):** Request mit absichtlich falschem
  `toNodeId` (anderer Pseudo-Knoten) → `outcome:"rejected", reason:
  "toNodeId stimmt nicht zum Empfänger"`.
- **Test 7 (Versions-Mismatch):** `protocolVersion: "1.0"` nach dem
  Signieren überschreiben → `outcome:"rejected", reason: "Inkompatible
  Hauptversion: 1.0"`.
- **Test 8 (Signatur-Manipulation):** `nonce` nach dem Signieren
  überschreiben → `outcome:"rejected", reason: "Request-Signatur
  ungültig"`.
- **Test 9 (HETERO_MAX_ANCHORS-Begrenzung):** teil-abgedeckt — nur 1
  Anker aus Spore-Single-Anker-Fallback. Schema-Konformität geprüft
  (`{label, vector[384]}`, `length ≤ 5`). Voller 5-von-7-Begrenzungs-
  Test folgt mit Spec-Sitzung 08 (Outbox-Befüller).
- **Test 10 (listHeterokaryosis):** drei Inbox-Einträge direkt
  einsetzen (zwei vom gleichen Peer mit unterschiedlichem ts), prüfen
  dass alle drei mit `{peerNodeId, ts, anchorCount, receivedAt}` in
  der Lese-Antwort sind und `anchors`/`signature` weggelassen werden.
- **Test 11 (forgetHeterokaryosis):** Eintrag setzen → forget →
  Liste leer; zweiter forget-Aufruf wirft nicht (idempotent).
- **Test 12 (endpoint_unsupported):** `_setReceiverHttpStatus(404)` →
  `requestHeterokaryosis(PSEUDO_OPT_IN)` → `outcome:"endpoint_unsupported"`
  ohne Throw, ohne Netz-Aufruf.
- **Selbstcheck-Hinweis:** Konsolen-Zeile prüfen lassen.

Knopf-Stil exakt wie Panel 07 (`SbkimUI.setStatus`, JSON als
`output.textContent`). Alle 9 Inline-`<script>`-Blöcke via `node --check`
syntaktisch validiert.

### 6. Karten + INTERFACES.md nachgezogen

- **Karte 01** § Stores um `sbkim_hetero_inbox`-Zeile (Schreiber 06,
  Komposit-Schlüssel-Hinweis) und um Schema-Hinweise-Block (additives
  `heterokaryosisOptIn`-Feld auf `sbkim_siblings`, zwei Schreiber für
  `sbkim_anastomosis_log`); § Versionsmigration v=1/v=2-Tabelle und
  `DB_VERSION = 2` durchgezogen; § Bauzustand „Pflege Bau 06
  Store-Anmeldung"-Zeile.
- **Karte 06** Hero-Badge 🟦 Code-Stub; Datei-Pfad-Zeile ohne
  „ausstehend"; § Bauzustand „Code geschrieben"-Zeile mit Datum +
  acht Bau-Pflicht-Entscheidungen + Test-Brücken-Surface +
  Anker-Quelle-Notiz (Spore-Single-Anker-Fallback / Degraded-Modus); §
  Manueller Test Punkt 9 als „teil-abgedeckt" markiert.
- **Karte 07** § Schnittstelle (`confirmSelfApoptose`-Block) + §
  Apoptose-Pfad Sender-Seite Schritt 5 (Cleanup-Reihenfolge) um neuen
  `sbkim_hetero_inbox`-Cleanup-Schritt erweitert (sechs Stores statt
  fünf); § Bauzustand „Pflege Cleanup-Reihenfolge Bau 06"-Zeile.
- **INTERFACES.md** §1 Modul 01 § Storage um Schreiber-Spalten (06
  für `sbkim_anastomosis_log` und `sbkim_hetero_inbox`), additive
  `heterokaryosisOptIn`-Erweiterung, Komposit-Schlüssel-Notiz und
  Schema-Hinweise-Block. §1 Modul 06 Storage-Block um
  Bau-Iteration-Anker-Quelle-Notiz (Spore-Single-Anker-Fallback);
  `Geprüft`-Block zusätzlich „2026-05-15 (Bau-Sitzung 06 — Code-Stub
  belegt; Anker-Quelle in der Erst-Bau-Iteration ausschließlich
  Spore-Single-Anker-Fallback / Degraded-Modus)". §1 Modul 07 § Storage
  um `sbkim_hetero_inbox` als Löscher-Store erweitert + §
  Cleanup-Reihenfolge sechs Schritte plus `resetIdentityCache`. §6
  Änderungsprotokoll-Zeile „Bau-Sitzung 06" am Ende (UNTER der
  Spec-Sitzung-06-Zeile vom 2026-05-15).

### 7. `status.json` + Pie + PULS

- **`status.json`** Modul 06 von `score:"spec"` / `siegel:"Spec
  fertig"` auf `score:"stub"` / `siegel:"Code-Stub"`; `kurz`
  aktualisiert (Bau-Stand inkl. Degraded-Modus-Vermerk); `lastUpdated`
  bleibt `2026-05-15`. `config.HETERO_MAX_ANCHORS = 5` unverändert.
- **`scripts/update_puls_pie.py`** aufgerufen (Pflicht). Pie
  regeneriert: Schablone 4 → 4, Werkstatt 1 → 1, **Spec fertig 2 → 1**,
  **Code-Stub 7 → 8**, Fertig 0 → 0; 14 Module gesamt unverändert.
- **PULS.md** Schnellüberblicks-Zeile Modul 06 von „Spec fertig
  (2026-05-15)" auf „Spec fertig (2026-05-15) / Code-Stub
  (2026-05-15)" mit erweitertem Anmerkungs-Text (Bau-Stand inkl.
  Degraded-Modus-Vermerk und Test-9-Teilabdeckung). § Als nächstes ✨
  Modul 06 aus „Spec frisch, Bau ausstehend"-Bucket entfernt, in
  „Code-Stub frisch, Sichttest ausstehend"-Bucket aufgenommen (zwischen
  05 und 07, parallel zu 00 und 07). Neuer Sitzungs-Eintrag oben in
  § Sitzungs-Einträge (über der Spec-Sitzung-06-Zeile vom 2026-05-15).

---

## Was nicht geändert wurde (bewusst)

- **Keine Spec-Änderung in Karte 06 oder INTERFACES.md §1 Modul 06 /
  §2 Heterokaryose.** Spec liegt fest seit Spec-Sitzung 06 (PR #34,
  gemerged 2026-05-15). Karte 06 § Manueller Test Punkt 9 hat eine
  additive Notiz „teil-abgedeckt in der Erst-Bau-Iteration" — das
  ist Implementierungs-Detail, kein Vertrags-Eingriff.
- **Keine Karte-05-Schnittstellen-Änderung.** Modul 05's API bleibt
  fünf-funktional. Karte 05 § Bauzustand unangetastet.
- **Keine `sbkim_hetero_outbox`-Implementierung.** Spec-Sitzungs-08-
  oder Pflege-Modul-02-Arbeit. Kein Stub-Anlegen, kein Store-Register
  (KNOWN_STORES bleibt sechs+eins; nicht sechs+zwei).
- **Keine Karten-10/11/12/14-Änderung** (Hook-Verweise in Karte 06
  unangetastet).
- **Keine §0-Konstanten-Erweiterung** über `HETERO_MAX_ANCHORS = 5`
  hinaus (war schon da nach Spec-Sitzung 06).
- **Kein Hauptversions-Sprung.** `PROTOCOL_VERSION` bleibt `"0.1"`.
- **Kein Selbst-Sweep / keine Pulsation in `init()`** — registriert
  nur den MessageChannel-Listener und prüft Abhängigkeiten.
- **Keine Sage-Page-(`index.html`)-Änderung.** Karte 4 / Karte 14 /
  Pie ziehen datengetrieben aus `status.json` nach — die
  Hochstufung Modul 06 auf `score:"stub"` reflektiert sich automatisch
  beim nächsten Reload (blaue Zelle, Code-Stub-Legende +1).
- **Panel 07 unangetastet.** Test 6 hat ein additives `hetero_inbox_leer`-
  Feld nötig, das ist aber eine eigene Mini-Pflege Panel-07 — Bau 06
  baut Bau 07 nicht um (Spec-Disziplin).

---

## Frischer-Kopf-Befund

**Acht Bau-Pflicht-Entscheidungen alle entscheidbar — keine Spec-Lücke.**

Das Briefing nannte acht Bau-Pflicht-Fragen, die alle in der Bau-
Sitzung entscheidbar waren — keine Frage 7-mäßige Spec-Klarheit-
Notbremse nötig.

Drei Notenstellen aufgefallen:

1. **Test-Brücken-Asymmetrie zwischen Modul 06 und Modul 07.** Modul
   07's `_addPseudoSibling` ist ein **in-memory-Override** für die
   Versand-Liste (`listSiblingsForBroadcast()` liest entweder Storage
   oder den Override). Modul 06 dagegen liest **Storage-basiert** für
   den Sibling-Filter — der Override müsste also direkt in
   `sbkim_siblings` schreiben. Das macht Bau 06's `_addPseudoSibling`
   tatsächlich (kein gemeinsamer Test-Bridge-Helfer mit 07).
   Konsequenz: nach Panel 06 Tests sind die Pseudo-Sibling-Einträge
   echt im Storage — `_clearPseudoSiblings` muss sie ausräumen.
   **Folge für Panel 07 Test 1:** wenn beide Panels nacheinander
   laufen, könnten die 06-Pseudos die 07-Tests beeinflussen
   (`sbkim_siblings`-Zustand). `_clearPseudoSiblings` von Modul 06
   räumt aber alle in dieser Test-Session gesetzten IDs wieder weg,
   und der Setup-Knopf in Panel 06 ruft `_clearPseudoSiblings`
   am Anfang. Keine echte Kollision.
2. **Anker-Quelle-Degraded-Modus.** Wenn ein Endknoten in der Praxis
   eine Spore ohne `domainVector` hostet (was Karte 09 als Soft-
   Pflicht empfiehlt, aber nicht erzwingt), liefert Modul 06 eine
   signierte Response mit `outcome:"shared"` und `anchors:[]`. Das ist
   **tolerabel** (der Sibling-/Opt-In-Filter ist passiert, die
   Spore-Signatur ist valide), aber semantisch arm — der Empfänger
   bekommt keine Domain-Information aus dem Pull. Spec-Wille (Karte 06
   § Anker-Quelle) sieht den Outbox-Store als die Lösung; bis dahin
   ist die Erst-Bau-Iteration nur Drift-Detektor (mit einem einzigen
   Anker oder mit gar keinem). Dokumentiert in Karte 06 § Bauzustand
   und im PULS-Eintrag.
3. **Test 9 (`HETERO_MAX_ANCHORS`-Begrenzung) ist nicht voll
   testbar.** Spec-Skizze geht von 7 Pseudo-Ankern in der Outbox aus
   und prüft, dass nur 5 zurückkommen. Mit dem Spore-Single-Anker-
   Fallback kann Panel 06 das nicht 1:1 nachstellen. Panel 06 Test 9
   prüft daher nur Schema-Konformität (`{label, vector[384]}`,
   `length ≤ 5`); der eigentliche Begrenzungs-Test (5 von 7) folgt
   mit Spec-Sitzung 08 (Outbox-Befüller). Notiz in Karte 06 § Manueller
   Test Punkt 9 und im PULS-Eintrag.

---

## Offene Punkte / Folge-Sitzungen

- **Klaus' Sichttest Panel 06** im Browser (analog Klaus' Sichttests
  Module 00/05/07 vom 2026-05-15). Aktuell nur headless durch
  `node --check`-Validierung belegt; der echte Verhalten-Test mit
  Browser-IndexedDB folgt.
- **Klaus' Re-Sichttest Panel 07 Test 6** (Self-Apoptose, jetzt mit
  sechs Stores statt fünf zu prüfen). Eigene Mini-Pflege-Sitzung
  Panel 07 (zwei Zeilen, additiv) wäre sinnvoll, oder im Rahmen der
  nächsten Sichttest-Runde mit Klaus.
- **Spec-Sitzung Modul 08 (UI-Demo)** — Werkstatt-Stub füllen, plus
  `sbkim_hetero_outbox`-Spec (Schreib-Recht durch UI, mehr als ein
  Anker pro Pull). Schließt Test 9 voll ab.
- **Pflege Modul 02 „domainVector als Backup-Anker"** — falls Klaus'
  Sichttest 06 zeigt, dass der Spore-Single-Anker-Fallback nicht
  reicht.

---

## Empfohlener nächster Schritt

**Bau-Sitzung Modul 09 zweite Iteration mit Klaus am Live-Andock-Versuch**
bleibt der empfohlene Haupt-Pfad sobald Klaus Zeit am Tablet hat
(nach Pflege Karte 09 App-SW-Koexistenz + Tablet-Sichtkontrolle — siehe
offene Querschnitts-Frage aus 2026-05-15 Bau-09-blockiert).

Headless sinnvoll, Reihenfolge nach Dringlichkeit:

1. **Spec-Sitzung Modul 08 (UI-Demo + `sbkim_hetero_outbox`-Spec)** —
   füllt Werkstatt-Stub, ergänzt den Outbox-Pfad für Modul 06 und macht
   Panel-06-Test 9 voll testbar.
2. **Mini-Pflege „Panel 07 Test 6 sechs statt fünf Stores"** — zwei
   Zeilen, additiv, niedrige Dringlichkeit.
3. **Mini-Pflege „Karte 14 Status-Zeile nachziehen"** — überfällig,
   zwei Zeilen.
4. **Pflege-Sitzung „PULS-Archivierung"** — überfällig (PULS > 400
   Zeilen seit mehreren Sitzungen).

Klaus' Sichttest-Runde im Browser (00/05/06/07-Re-Tests) bleibt der
Haupt-Pfad, sobald Tablet-Zeit da ist.
