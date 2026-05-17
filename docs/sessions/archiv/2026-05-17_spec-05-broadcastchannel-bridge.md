# Spec 2026-05-17 — Modul 05 BroadcastChannel-Bridge als same-origin Fallback

**Sitzungs-Rolle:** Spec-Sitzung, headless, EINE Phase. Branch
`claude/spec-broadcastchannel-bridge-3HUAH` (vom Harness vergebener
Name; thematisch identisch mit dem im Sitzungs-Brief vorgesehenen
`claude/spec-05-broadcastchannel-bridge`). Folge-Sitzung zur Pflege
Scope-Fix 2026-05-17 (PR #72 `b4b0c72` + Endknoten-Sichttest PR #73
`1c09f8f`).

---

## 1. Vorgeschichte (Pflichtkontext)

### Vier Sitzungen in zwei Tagen am SW-Pfad

| Datum | Sitzung | PR | Befund |
|---|---|---|---|
| 2026-05-16 | Live Andock Cross-Knoten-Handshake | #65 | Cross-Knoten-Handshake live etabliert per **direktem `receiveHandshake`-Aufruf** (localStorage-Bypass), nicht via regulärem `handshake()`. SW-Bridge-Phantom-Cache-Bug entdeckt. |
| 2026-05-17 morgens | Phantom-Clients-Fix | #70 | `clients.matchAll` von `includeUncontrolled:true` auf `false` + Loop-Logik. Korrekt für sein Szenario, aber nicht hinreichend. |
| 2026-05-17 mittags | Test-Erkenntnis A/B-Test | — | A/B-Test entlarvte zweite Wurzel: `isPathSuffix` scope-unbewusst. **Architektur-Klarheit:** Subresource-Fetches gehen durch den SW des Senders, nicht des Empfängers. Same-origin cross-PWA via SW-Bridge ist **konzeptuell unmöglich**. Kein PR aus dieser Sitzung. |
| 2026-05-17 nachmittags | Scope-Fix `isOwnEndpoint` | #72 | `isPathSuffix` ersetzt durch scope-bewusste `isOwnEndpoint(...)`. Cross-Scope-Pfade fallen sauber durch zum Netzwerk. |
| 2026-05-17 nachmittags | Klaus-Sichttest Endknoten-Hygiene | #73 | Endknoten nachgezogen (Mein-Rezeptbuch `cbc2531` → `sbkim-sw-v2.js`, Mein-Mixarium `9b32dc7` → `sbkim-sw-v24.js`). Distinguishing-Test grün: POST → HTTP 405, GET → HTTP 404 direkt von GitHub Pages. **Architektur-Grenze beidseitig verifiziert.** |

### Stand vor dieser Spec-Sitzung

- Klaus' Test-Setup: beide Endknoten auf `lausiklauskn-png.github.io`
  (gleiche Origin). Cross-Knoten-Handshake via regulärem
  `SbkimAnastomose.handshake(peerSpore, ownVec)` endet mit HTTP 405/404
  vom Pages — **nicht** mit `outcome:"established"`.
- Workaround bleibt aktiv: localStorage + direkter
  `receiveHandshake`-Aufruf liefert `outcome:"established"`. Für
  regulären Betrieb nicht tragbar.
- Cross-Domain-Setups (verschiedene Origins) bleiben über den
  HTTP/SW-Bridge-Pfad funktionsfähig — der ist NICHT verloren,
  sondern nur für same-origin tot.

### Architektur-Lücke, die diese Sitzung schließt

Klaus' Use-Case braucht einen **alternativen Transport**, der nicht
durch den Sender-SW abgefangen wird. **BroadcastChannel** ist die
naheliegende Wahl: Browser-Standard, kein Server, kein DNS, kein
neuer SW-Pfad. Sender postet auf `BroadcastChannel('sbkim')`,
Receiver lauscht, Antwort via dedizierten Reply-Channel zurück.

---

## 2. Was geändert — Spec-Erweiterung (additiv, kein Code in `src/`)

### `docs/INTERFACES.md` §1 Modul 05 Vertrag

- **Bietet-Block** um optionalen dritten Parameter
  `options?: { transport?: "auto"|"http"|"channel" }` erweitert
  (Default `"auto"`). HandshakeRequest/Response-Schema **unverändert**.
- **Nutzt-Block** um `BroadcastChannel('sbkim')` + Reply-Channel-Pfad
  (`BroadcastChannel("sbkim:reply:" + nonce)`) ergänzt; Timeout aus
  bestehendem `QUERY_TIMEOUT_MS` (4000 ms), keine neue Konstante.
- **Selbstcheck-Kommentar:** Schwelle/Endpunkt/Version/Transport-Hinweise
  bleiben außerhalb der Selbstcheck-Zeile (Versions-/Transport-
  Konvention aus §0/§3/Karte 05).
- **Fehlerverhalten** um zwei Zeilen erweitert: Channel-Timeout →
  `HandshakeTimeoutError` (Log `"timeout-channel"`, bei Auto-Fallback
  HTTP-Fehler als `cause`); Channel-Reply-Signatur ungültig →
  `HandshakeSignatureInvalidError`.
- **SW-Vertrag-Block** um Architektur-Grenze-Hinweis ergänzt
  (Spec-Klarheit aus PR #72/#73).
- **Neuer Sub-Block „BroadcastChannel-Bridge"** mit:
  - Channel-Name verbindlich.
  - Envelope-Schema (Request/Response-Wrapper, NICHT signiert —
    inneres HandshakeRequest/Response bleibt unverändert kanonisch
    signiert).
  - Receiver-Pflicht: eager in `init()`, Filter `toNodeId === own.nodeId`
    + `fromNodeId !== own.nodeId`, Aufruf `receiveHandshake(payload)`,
    Response auf dediziertem Reply-Channel posten + sofort schließen.
  - Sender-Pfad: Reply-Channel **vor** dem Posten öffnen, Main-Channel
    posten, Reply-Channel-Listener mit Timeout, finally-Cleanup,
    `nonceEcho`-Doppelt-Bindung.
  - `toNodeId` als **Pflichtfeld** im Channel-Pfad (im HTTP-Pfad
    bleibt optional). Synchroner `MissingToNodeIdError` ohne.
  - Self-Hit-Schutz: Receiver ignoriert eigene Nachrichten.
  - Cleanup-Regeln (Main-Channel über Tab-Lebensdauer, Reply-Channels
    pro Handshake in finally).
  - „Wer-nicht-da-ist-schweigt"-Konvention (kein Wake-Lock).
- **Geprüft-Zeile** um 2026-05-17 (Spec-Sitzung BroadcastChannel-Bridge)
  erweitert.

### `docs/INTERFACES.md` §3 Endpunkt-Pfade

Zweiter Sub-Block „Same-origin Fallback-Transport für Modul 05":

```
channel-bridge  : BroadcastChannel('sbkim')       (Anastomose-Fallback, same-origin)
reply-channel   : BroadcastChannel('sbkim:reply:' + nonce)
                                                  (pro Handshake, lebt nur bis Reply/Timeout)
```

Verbindlich **nur** für Modul 05 (Anastomose) — Heterokaryose (06)
und Legacy (07) bleiben HTTP-only (Begründung in Karte 05 §
BroadcastChannel-Bridge).

### `docs/INTERFACES.md` §6 Änderungsprotokoll

Neue Zeile am Ende:
`| 2026-05-17 | Spec-Sitzung BroadcastChannel-Bridge | …`

### `docs/components/05_anastomose.md`

- **§ Schnittstelle:** `handshake`-Signatur und Schritt-für-Schritt-Doc
  um Channel-Pfad + Auto-Fallback-Trigger erweitert (Schritt 5 + 5b).
- **§ Service-Worker-Hinweis:** Architektur-Grenze-Block (PR #72/#73-
  Beleg, Distinguishing-Test 405/404), Verlinkung zum
  Scope-Fix-Übergabeprotokoll.
- **Neue Hauptsektion „BroadcastChannel-Bridge (same-origin Fallback)"**:
  - Motivation (Klaus' Test-Setup, SW-Bridge konzeptuell tot).
  - Vertrag (Channel-Name, Envelope-Schemas, Receiver-Pflicht,
    Sender-Pfad, Pflichtfeld-Schärfung `toNodeId`, Self-Hit-Schutz,
    Cleanup, „Wer-nicht-da-ist-schweigt").
  - Auto-Fallback-Logik (Bedingungen wann Fallback ausgelöst wird, wann
    nicht; cross-domain bleibt unverändert HTTP-only).
  - **E1–E7-Entscheidungstabelle** mit Begründungen.
  - „Was diese Spec NICHT regelt"-Block (kein Bau-Code, kein Karte-09-
    Eingriff, kein Schema-Bump, kein SW-Pfad-Eingriff).
- **§ Fehlerverhalten** um drei Zeilen
  (Channel-Timeout + Auto-Fallback-`cause`, `nonceEcho`-Mismatch,
  synchrones `MissingToNodeIdError`).
- **§ Manueller Test** um Punkt 9 (Channel-Pfad, Sub-Tests 9a/9b/9c
  inkl. Auto-Fallback-Beweis und Voraussetzungs-Hinweis „Zwei Tabs
  derselben Origin offen").
- **§ Risiken** um Receiver-Tab-Pflicht (neuer Punkt).
- **§ Bauzustand**-Zeile „Spec BroadcastChannel-Bridge".

---

## 3. Sieben Entscheidungen E1–E7 (verbindlich)

| # | Frage | Entscheidung | Begründung (Kurzform; ausführlich in Karte 05) |
|---|---|---|---|
| **E1** | Channel-Name | `BroadcastChannel('sbkim')` | Ein gemeinsamer Channel pro Origin; Filtern via `toNodeId`. Versionierung über `payload.protocolVersion`, nicht über den Channel-Namen — analog HTTP-Pfad. Variante b (`sbkim:` + ownNodeId) ist fragil (Typo verfehlt Receiver still). Variante c (`sbkim:anastomose:v1`) vermischt Versions-Schichten. |
| **E2** | Auto-Fallback oder explizit? | α (Auto-Fallback) als Default, mit optionaler `options.transport`-Override | Erfüllt Klaus' Praxisfall direkt: zwei same-origin PWAs, ein `handshake()`-Aufruf → `outcome:"established"`. Override bleibt für Test/Diagnose. γ (nur Channel) bricht cross-domain — verworfen. |
| **E3** | Receiver-Init | Eager in `init()`. | Konsistent zu SW-Bridge-Init in `init()` und Karte-09-Andock-Pflicht. Lazy beim ersten `handshake()` würde Empfänger-Tab-Pflicht erst zur Laufzeit aktivieren — zu spät. |
| **E4** | Timeout & Failure | Timeout: `QUERY_TIMEOUT_MS` (4000 ms). Bei Timeout `HandshakeTimeoutError` (Throw). Log `"timeout-channel"`. Bei Auto-Fallback HTTP-Fehler als `cause`. | Konsistent zum HTTP-Pfad: Transport-Timeout ist Error, kein semantisches Outcome. Keine neue Konstante (Bau-Sitzung darf nicht improvisieren). |
| **E5** | Message-Format | Wrapper-Envelope mit `replyChannelName` aus nonce; inneres Schema unverändert; Envelope NICHT signiert. | `BroadcastChannel` unterstützt kein `MessagePort`-Transfer. Reply MUSS per dediziertem Channel. nonce-basierter Reply-Channel-Name vermeidet Kollisionen zwischen parallelen Handshakes. Inneres Schema unverändert → keine zweite Sign-Konvention, kein Drift-Risiko. |
| **E6** | Cleanup | Main-Channel über Tab-Lebensdauer; Reply-Channels pro Handshake, Close in `finally` (Sender + Receiver). | Browser räumt Main-Channel beim Tab-Close auf. Reply-Channels MÜSSEN aktiv geschlossen werden, sonst Memory-Leak / Cross-Talk-Risiko. |
| **E7** | Replay/Self-Hit-Schutz | `toNodeId` Pflicht im Channel-Pfad (HTTP-Pfad bleibt optional); Receiver-Filter `toNodeId === own.nodeId` + `fromNodeId !== own.nodeId`. Aktiver Replay-Schutz bleibt Schutz-Backlog Modul 11. | Im Channel-Pfad sind alle Tabs same-origin „im selben Raum" — ohne `toNodeId`-Filter würde JEDER PWA-Tab antworten. Self-Hit-Filter ist Pflicht, weil Sender + Receiver im gleichen Tab leben können (Klaus' Workaround-Setup). |

---

## 4. Was NICHT angefasst (Disziplin gemäß Brief)

- `src/modules/05_anastomose.js` — Bau-Sitzung folgt separat.
- `src/sbkim-sw.js` — SW-Pfad ist mit `isOwnEndpoint` aus PR #72
  abgeschlossen. **Nicht angefasst.**
- `receiveHandshake`-Signatur — bleibt; der Channel-Receiver ruft
  denselben am Ende auf wie der SW-Bridge.
- Andere Modul-Karten (00/01/02/03/04/06/07/08).
- `docs/components/09_einbau_pwa.md` — der Andock-Hinweis „Beide Tabs
  offen halten für same-origin Channel" folgt in der Bau-Sitzung
  zusammen mit dem Code-Eingriff. Spec ohne Code paaren wäre für den
  Andocker verwirrend.
- `PROTOCOL_VERSION` bleibt `"0.1"` — additive Transport-Erweiterung,
  keine Schema-Änderung.
- `status.json` unverändert — Modul 05 bleibt `score:"fertig"`
  (additive Spec-Erweiterung am Vertrag, keine Funktionalitäts-
  Regression; Bau erst danach setzt den Fallback live).
  `update_puls_pie.py` NICHT aufgerufen.

---

## 5. Validierung

- **Pflichtlektüre-Vollständigkeit:** CLAUDE.md, PULS.md (oberste
  Einträge + § Offene Querschnitts-Fragen „SW-Bridge-Phantom-Cache-Bug"),
  beide Pflege-Übergabeprotokolle (2026-05-17 Scope-Fix +
  Scope-Fund), INTERFACES.md §0 / §1 Modul 05 / §2 / §3 / §4, Karte 05
  komplett, `src/modules/05_anastomose.js` (Kontext, nicht zur Änderung),
  `src/sbkim-sw.js` (Kontext) gelesen.
- **Schema-Konsistenz:** HandshakeRequest/HandshakeResponse-Pflicht-
  und Optional-Felder unverändert. `toNodeId` ist in §2 HandshakeRequest
  als optional spezifiziert; die Pflicht-Schärfung im Channel-Pfad
  ist eine **Transport-Vorbedingung** (Sender-seitige Validierung),
  keine Schema-Änderung — das `MissingToNodeIdError` greift VOR dem
  Bauen des Requests.
- **Cross-Referenz-Konsistenz:** Karte 05 + INTERFACES.md + PULS-
  Eintrag verweisen aufeinander (Karte 05 → INTERFACES.md §1 Modul 05;
  INTERFACES.md §6 → Karte 05; PULS → Übergabeprotokoll).
- **E1–E7 alle mit Begründung versehen**, damit die Bau-Sitzung ohne
  Rückfrage starten kann.

---

## 6. Klaus' Pflichtaufgaben nach Merge

Keine Endknoten-Pflege. Diese Spec ist kein Endknoten-Eingriff.

Der Spec-Stand muss vor der nachfolgenden Bau-Sitzung gemerged sein,
damit die Bau-Sitzung gegen `main` arbeiten kann. Empfehlung: PR als
Draft eröffnen, Klaus reviewt + merged, dann Bau-Sitzung als nächste
Phase.

---

## 7. Folge-Sitzungs-Brief — Bau-Sitzung Modul 05 (Skelett)

Der vollständige Brief wird beim nächsten `Befehl schreiben` aus
einer eigenen Pflicht-PR-Audit-Sequenz heraus formuliert. Kurzform für
das Archiv:

**Branch-Vorschlag:** `claude/bau-05-broadcastchannel-bridge`.
**Typ:** Bau-Sitzung, EINE Phase. Code in
`src/modules/05_anastomose.js` (additiv, kein Refactoring), plus
Karte 09 Andock-Hinweis-Erweiterung, plus Panel 05 Test-Knopf 9 in
`tests/manual_check.html`.

**Pflichtlektüre:**

1. `CLAUDE.md`
2. `docs/PULS.md` (oberste Einträge, besonders dieser Spec-Eintrag)
3. Dieses Übergabeprotokoll (`docs/sessions/archiv/2026-05-17_spec-05-broadcastchannel-bridge.md`)
4. `docs/INTERFACES.md` §0 + §1 Modul 05 (komplett, inkl. neuer
   BroadcastChannel-Bridge-Sub-Block) + §3 Endpunkt-Pfade
5. `docs/components/05_anastomose.md` komplett (inkl. neuer
   Hauptsektion BroadcastChannel-Bridge + E1–E7-Tabelle)
6. `docs/components/09_einbau_pwa.md` (kompletter Schritt-Pfad, damit
   der Andock-Hinweis konsistent einsortiert wird)
7. `src/modules/05_anastomose.js` komplett (Sender + Receiver +
   `setupServiceWorkerBridge` als Vorbild für `setupChannelBridge`)
8. `tests/manual_check.html` Panel 05 (Test-Brücken `_invokeDirect`
   + `_setOwnDomainVector` als Vorbild für Channel-Test-Helper)

**Aufgabe der Bau-Sitzung:**

1. **Sender-Pfad** in `handshake(...)`:
   - Optionalen dritten Parameter `options.transport` parsen
     (Default `"auto"`, Allow-List `"auto"|"http"|"channel"`,
     sonst `InvalidTransportError`).
   - HTTP-Pfad unverändert lassen, aber Auto-Fallback-Bedingungen
     prüfen (Status-Code, Content-Type, JSON-Schema-Pflichtfelder,
     `outcome`-Allow-List).
   - Channel-Pfad als Helper-Closure `sendViaChannel(request)`:
     Reply-Channel öffnen, Main-Channel posten, Reply-Channel-Listener
     mit Timeout, finally-Cleanup, `nonceEcho`-Doppelt-Bindung.
   - `MissingToNodeIdError` synchron vor dem Channel-Bau, wenn
     `request.toNodeId` fehlt und transport ∈ {"auto" (Fallback-Phase),
     "channel"}.
2. **Receiver-Pfad:** neuer Closure-Helper `setupBroadcastChannelBridge()`,
   analog zur bestehenden `setupServiceWorkerBridge()`. Eager in
   `init()` aufrufen. Filter `type === "SBKIM_ANASTOMOSE_REQUEST"`,
   `payload.toNodeId === own.nodeId`, `payload.fromNodeId !== own.nodeId`.
   Bei Erfüllung: `receiveHandshake(payload)`, Response-Envelope auf
   dediziertem `BroadcastChannel(replyChannelName)` posten, schließen.
3. **Karte 09 § Schritt 9** (oder eigenes neues Schritt-Detail-
   Element): Andock-Hinweis „Beide Tabs offen halten für same-origin
   Channel-Empfang" mit Bezug zum E3-Eager-Init.
4. **Panel 05 in `tests/manual_check.html`** um Test-Knöpfe 9a/9b/9c
   ergänzen (Setup unverändert, Three-Sub-Test-Pfad: established über
   Channel / `toNodeId`-Mismatch-Timeout / Auto-Fallback-Beweis).
   Test-Brücke `_setTransport(t)` oder analog zur bestehenden
   `_setOwnDomainVector`-Brücke.

**Was die Bau-Sitzung NICHT anfasst:**

- Schema-Erweiterung HandshakeRequest/Response.
- `PROTOCOL_VERSION`.
- `src/sbkim-sw.js` (SW-Pfad abgeschlossen).
- Andere Module außer 05 / 09 / Panel 05 in manual_check.html.
- `status.json` (Modul 05 bleibt `fertig`, additive Code-Erweiterung
  vom Vertrag her erwartet — Score-Wechsel nur bei Funktionalitäts-
  Verlust nach unten).

**Klaus' Pflicht nach Merge der Bau-PR:**

1. **Endknoten nachziehen:** `src/modules/05_anastomose.js` in
   `Mein-Mixarium/sbkim/` und `Mein-Rezeptbuch/sbkim/` kopieren,
   Cache-Bust (File-Rename oder Query-Param je nach SW-Setup),
   Commit + Push.
2. **Sichttest:** Beide PWA-Tabs öffnen, `__sbkimErzeugeSpore()` bei
   Bedarf, dann in einem Tab regulärer
   `SbkimAnastomose.handshake(peer, ownVec)` zwischen Mein-Rezeptbuch
   und Mein-Mixarium. **Erwartet `outcome:"established"` über den
   Channel-Pfad.** Das ist das eigentliche Ziel: erster Cross-Knoten-
   Handshake ohne localStorage-Bypass.

---

## 8. Konvention für die übernächste Sitzung (IMMER drinhalten)

Wenn Klaus am Sitzungsende der **Bau-Sitzung** `Befehl schreiben`
tippt, formuliert die Bau-Sitzung **vor** dem Brief:

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
2 (Aktueller Repo-Stand) → 3 (Aufgabe) → 4 (Pflicht-Diagnostik bei
Bau-Sitzung) → 5 (Was blockiert nächsten Schritt) →
**6 (diese Konvention wiederholen!)** → 7 (Klaus-Pflichtaufgaben).

---

## 9. Klaus' Repo-Stand am Sitzungsende

### Sage-Protokol

- Branch dieser Sitzung: `claude/spec-broadcastchannel-bridge-3HUAH`.
- Commits dieser Sitzung: einer (siehe `git log` nach dem
  Übergabeprotokoll-Schreiben).
- PR als Draft eröffnet (URL siehe Chat-Antwort am Sitzungsende).
- `main`-Stand zum Zeitpunkt der Sitzungs-Eröffnung: `1c09f8f`
  (PULS-Update nach PR #73-Merge).

### Endknoten (unverändert ggü. PR #73-Sichttest)

- **Mein-Mixarium** main: `9b32dc7` (`sbkim-sw-v24.js`, SW_VERSION
  `mixarium-sw-v24`).
- **Mein-Rezeptbuch** main: `cbc2531` (`sbkim-sw-v2.js`).

Keine Endknoten-Pflege durch diese Spec-Sitzung erforderlich.

---

## 10. Nächster sinnvoller Schritt

1. **Klaus:** Diesen Spec-PR mergen.
2. **Bau-Sitzung Modul 05** mit dem Brief aus §7 anstoßen.
3. **Nach Merge der Bau-PR:** Klaus zieht
   `src/modules/05_anastomose.js` in beide Endknoten nach,
   führt den Sichttest aus §7 Klaus-Pflicht durch — erwartet
   den **ersten Cross-Knoten-Handshake mit `outcome:"established"`
   ohne localStorage-Bypass.**

---

**Vorgänger:** Pflege Scope-Fix (PR #72) + Klaus-Sichttest
Endknoten-Hygiene (PR #73). Spec-Sitzung 05 (2026-05-14) für den
Modul-05-Grundvertrag bleibt verbindlich; diese Sitzung erweitert
ihn additiv um den Channel-Fallback-Transport.

**Branch:** `claude/spec-broadcastchannel-bridge-3HUAH`.
