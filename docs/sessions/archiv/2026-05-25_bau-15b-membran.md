# Übergabeprotokoll — Bau-Sitzung 15.B Membran (Sub (a) Read-API + Sub (b) postMessage-Brücke)

**Datum:** 2026-05-25
**Sitzungs-Rolle:** Bau-Sitzung (Pipeline-Schritt 4 → Bau)
**Branch:** `claude/membrane-build-15b-7g9Ll`
**Brief:** `docs/sessions/BRIEF_BAU_15B_MEMBRAN.md` (aus Spec-Sitzung 15.B)
**Vorlauf:** Spec-Sitzung 15.B (gleichentägig) hat Karte 15 § Sub (a)+(b) +
INTERFACES § 1 Modul 15 voll spezifiziert und den Brief angelegt.

---

## Anlass

Spec-Sitzung 15.B vom 2026-05-25 hat Karte 15 § Sub (a) Read-API und
§ Sub (b) postMessage-Brücke vollständig spezifiziert — finales
`MembraneSnapshot`-Schema mit Siegel-Hook-Feld, finale postMessage-
Envelope mit vier `op`-Werten (sporeRef/query/hint/queryResult), Allowlist
strict String fail-soft, Rate-Limit-Hook für Modul 11 vorbestellt, Nonce-
Pflicht mit 30 s Replay-Dedupe. Bau-Sitzung 15.B implementiert die Spec
1:1 — Modul-Code in `src/modules/15_membran.js`, Panel-15-Erweiterung in
`tests/manual_check.html`, Headless-Smoke in `tests/smoke_bau15b_membran.mjs`.

Klaus' App-Freigabe (Pipeline-Schritt 6) braucht Modul 15 produktiv mit
Sub (a)+(b), sonst sind die Endknoten ohne Membran-Allowlist + Read-API
für Browser-Agenten unterwegs.

---

## Was getan

### 1. `src/modules/15_membran.js` — Sub (a) `read()` voll

- **Snapshot-Schema 1:1 aus Karte 15 § Sub (a) MembraneSnapshot:**
  - **Identitäts-Block:** `protocolVersion` immer §0-`"0.1"`-Konstante
    (nicht aus Spore gelesen — aktiver Stand). `nodeId` Klartext eigene
    Identität, `domain`, `sporeUrl`, `domainKeywords[]`,
    `stammCategories[]`, `guestCategories[]` aus Spore via
    `SbkimSpore.getNodeId()` + `SbkimSpore.getOwnSpore()`, fail-soft pro
    Feld (Feld-Wert auf `null`/`[]` wenn Modul 02 fehlt oder die Daten
    nicht enthält).
  - **Geschwister-Block** anonymisiert: `siblings:[{nodeIdHash, since,
    status}]` mit `nodeIdHash = base64url-sha256(nodeId)` via bestehendem
    Helper `hashNodeIdToBase64url`. KEIN `score`, KEIN `lastSeen`
    (Empfehlungs-Pfad-Tabu, Spec 15.B).
  - **Storage-Block:** `{quotaWarningLevel, storagePersisted}`.
    `storagePersisted` Spiegelung Modul-01-Getter; `quotaWarningLevel`
    aus `navigator.storage.estimate()` über bestehende Helper
    `computeQuotaWarningLevel` (Doppelschwelle 80 %/50 MiB).
  - **Siegel-Block neu:** `siegel:{isCertified, repoUrl,
    certifiedModules:[{id,name,surfaceFn,lazy,status}]} | null`.
    Resolver prüft `typeof SbkimSiegel === "object"` +
    `SbkimSiegel._meta.ready === true` + Funktions-Anker; bei nein →
    `null`. Bei ja → defensive Kopie aus
    `SbkimSiegel.getExplanation()` ohne zweiten Klon (Spec 15.B-Detail:
    Modul 16 liefert schon defensive Kopie).
- **Sub-(e)-Hook erweitert:** `details:{fieldsRequested:null,
  snapshotByteLen:JSON.stringify(snapshot).length}`. Daten-Volumen-
  Beobachtung möglich (Karte 13 Eigenschutz — Anomalie-Spur).
- **Quota blockt `read()` NICHT** (Empfangsmodus-Prinzip).

### 2. `src/modules/15_membran.js` — Sub (b) postMessage-Bedien-Pfad voll

**Empfänger-Kette (Reihenfolge verbindlich, Spec 15.B):**

1. `event.origin === window.location.origin` → still verworfen, KEIN
   Sub-(e)-Eintrag (same-origin gilt nicht als Fremd).
2. `data.type !== "sbkim/membrane/v1"` → `decision:"ignored"`.
3. `event.origin` nicht in `allowedOrigins` → `decision:"rejected-allowlist"`,
   KEINE Antwort.
4. `nonce` fehlt oder nicht String → `decision:"ignored"`.
5. **Replay-Dedupe:** `seenNonces` RAM-Map (`nonce → receivedAt`),
   FIFO-Eviction nach 30 s via `pruneSeenNonces(nowMs)`. Bei bekanntem
   Nonce <30 s alt: still verwerfen, KEIN doppelter Sub-(e)-Eintrag,
   KEINE Antwort.
6. **Rate-Limit-Hook:** optional an `window.SbkimRateLimit?.checkOrigin(origin)`.
   Fail-soft wenn Modul 11 fehlt (kein Throw, kein warn). `"throttled"`
   → `decision:"ignored"` + `details.throttled:true`.
7. **Op-Dispatch** (Whitelist `{sporeRef, query, hint, queryResult}`,
   unbekannte op insb. `"handshake"` → `decision:"ignored"`):
   - **`sporeRef`** — Schema-Check (`nodeId/sporeUrl/domain` alle Strings
     nicht-leer). OK → RAM-Cache `recentSporeRefs[origin] = {nodeId,
     sporeUrl, domain, receivedAt}` (FIFO max 16 via Map.delete + set
     für Insertion-Order). `decision:"accepted"`. Schema-Fehler →
     `decision:"ignored"`, KEINE Antwort.
   - **`hint`** — Schema-Check (`vector` Array Länge 384, `label` String,
     `ttlMs` Number >0). OK + `SbkimDiffusion?.recordLead` vorhanden →
     Delegation mit `{vector, label, ttlMs, sourceOrigin: event.origin}`.
     `decision:"accepted"`. OK aber Modul 14 fehlt → frequenz-gedrosselte
     `console.info`-Zeile (einmal pro Session, Bool-Guard
     `diffusionMissingNotified`) + `decision:"ignored"`. Schema-Fehler
     → `decision:"ignored"`. KEINE Antwort (fire-and-forget).
   - **`query`** — Schema-Check (`text` String nicht-leer, `k` Number
     Default 5). OK + `SbkimMatch?.queryLocal` vorhanden → `await
     SbkimMatch.queryLocal(text, k)` + Reply via
     `event.source.postMessage({type, op:"queryResult", fromOrigin,
     nonce:crypto.randomUUID(), inReplyTo:<request-nonce>,
     payload:{results, error:null}}, event.origin)`.
     `decision:"accepted"`. OK aber Modul 04.C fehlt → Reply mit
     `payload:{results:[], error:"module-04c-not-available"}`,
     `decision:"ignored"`. Schema-Fehler → `decision:"ignored"`, KEINE
     Antwort. Falls `queryLocal` wirft → fail-soft Reply mit
     `error:"module-04c-query-failed"`, `decision:"ignored"`.
   - **`queryResult`** — `inReplyTo` (Envelope-Feld; Payload-Fallback
     für legacy Sender) gegen RAM-Map `pendingQueries[nonce] = {origin,
     sentAt, resolve}` (TTL 30 s via `prunePendingQueries(nowMs)`)
     matchen. Match → `pending.resolve(payload)` + Map-Eintrag löschen,
     `decision:"accepted"`. Kein Match → `decision:"ignored"`.

### 3. `init()` Allowlist-Validierung fail-soft

Filter nicht-String-Einträge ODER Einträge ohne `http://`/`https://`-Präfix
via `isHttpOrigin(s)`-Helper + `console.warn` pro entferntem Eintrag
(Format: `[SbkimMembrane] Allowlist-Eintrag verworfen (Format ungültig):
"…"`). KEIN sync Throw — Andocker-Init bleibt funktional bei Tippfehler.

### 4. `SbkimMembrane._meta` erweitert

Neue Getter:
- `recentSporeRefsCount` (Map-Größe)
- `pendingQueriesCount` (Map-Größe)
- `seenNoncesCount` (Map-Größe)
- `siegelAvailable` (prüft `SbkimSiegel._meta.ready === true` defensiv)
- `recentSporeRefsSnapshot` (defensive Kopie der Map als Objekt)
- Konstanten-Anker `protocolVersion`/`replayDedupeTtlMs`/
  `recentSporeRefsMax`/`embeddingDim` (read-only)

Neue Test-Brücke:
- `_registerPendingQueryForTest(nonce, origin) → Promise<payload>` —
  injiziert einen pending-Eintrag mit Resolver, der bei einer passenden
  `queryResult`-Message resolved. Notwendig, weil Sub (b) Empfänger-
  Schicht ist und keine Sender-API auf der Public-Surface anbietet.

### 5. Selbstcheck-Zeile UNVERÄNDERT

`MODUL 15 MEMBRAN bereit, Funktionen: init/read/fremdzugriff.{list,
subscribe,clear,_recordForTest}` — Sub (a)+(b) ergänzen KEINE neuen
Public-Surface-Funktionen, nur read() + postMessage-Listener gefüllt.

### 6. `src/modules/16_siegel.js` — Pflicht-Konvention CLAUDE.md

`ZERTIFIKAT_ASPEKTE`-Eintrag additiv am Listen-Ende:

```js
{
  since:       "2026-05-25",
  module:      "15",
  aspect:      "Sub (a) Read-API + Sub (b) postMessage-Brücke",
  description: "Finale Bedien-Pfade: MembraneSnapshot mit Siegel-Hook,
    vier op-Werte (sporeRef/query/hint/queryResult) mit Nonce-Pflicht,
    fail-soft Allowlist, Rate-Limit-Hook für Modul 11.",
}
```

KEIN Eingriff in `PFLICHT_MODULE`, Surface oder bestehende Aspekte.

### 7. Panel 15 in `tests/manual_check.html` — Knöpfe 10–17

- **10:** Sub (a) read() vollständig — Snapshot-JSON (max 50 Zeilen
  Preview), Pflicht-Felder-Check, siegel-Form-Check, Sub-(e)-Hook mit
  `snapshotByteLen>0`.
- **11:** Sub (a) Anti-PII-Probe — JSON enthält weder `sbkim_keys` noch
  `privateKey` noch Geschwister-`nodeId` im Klartext noch
  `navigator.userAgent`.
- **12:** Sub (b) op:sporeRef Probe (Allowlist OK → `accepted` +
  `recentSporeRefsCount` steigt + Cache-Snapshot zeigt Eintrag).
- **13:** Sub (b) op:query Probe (Modul 04.C fehlt → `decision:"ignored"`;
  Reply geht an `event.source`, bei `dispatchEvent` `source=null` →
  Reply-Pfad ist im Headless-Smoke abgedeckt).
- **14:** Sub (b) op:hint Probe — OK-Schema mit Modul-14-fehlt-Pfad +
  Schema-Fehler (vector len ≠ 384) → beide `ignored`. `console.info`
  einmal pro Session (Frequenz-Drossel).
- **15:** Sub (b) Replay-Probe — gleicher Nonce zweimal → 1 Eintrag
  nach erstem Aufruf, 1 nach Replay (keine Verdopplung).
- **16:** Sub (b) Allowlist-fail-soft — gemischte Liste `["https://gut.example",
  42, null, "ohne-präfix.example", "https://auch-gut.example"]` →
  3 console.warn-Zeilen + finale Allowlist mit 2 Einträgen.
- **17:** Sub (b) Rate-Limit-Hook — `window.SbkimRateLimit = {checkOrigin:
  () => "throttled"}`-Stub → `decision:"ignored"` + `details.throttled:true`.
- Setup-Output erweitert um `siegelAvailable`, `recentSporeRefsCount`,
  `pendingQueriesCount`, `seenNoncesCount`.
- Default `allowedOrigins` in `ensureSetup()` jetzt
  `["https://peer-a.example", "https://peer-b.example"]`.

### 8. Headless-Smoke `tests/smoke_bau15b_membran.mjs` — 31/31 grün

Stubs für DOM (`window`/`document`/`addEventListener`),
`navigator.storage`, `crypto`. Modul-Laden via `new Function`-Injection
(analog Bau 15-Pattern). Suite:

- Init ready.
- Sub (a) Schema-Pflichtfelder.
- Sub (a) `protocolVersion = "0.1"`.
- Sub (a) `siegel = null` wenn Modul 16 fehlt.
- Sub (a) Anti-PII — kein `sbkim_keys` im JSON.
- Sub (a) Sub-(e)-Hook geschrieben mit `snapshotByteLen>0`.
- Sub (a) `siegel` voll wenn Modul 16 ready (Stub).
- Sub (a) `siegelAvailable` `_meta`-Getter.
- Sub (a) `siegel = null` nach Modul-16-Reset.
- Sub (a) Anti-PII — Geschwister-`nodeId` NICHT im Klartext (Stub-
  Anastomose mit `SECRET_PEER_NODEID_*`).
- Sub (a) siblings anonymisiert (`{nodeIdHash, since, status}` × 2).
- Sub (b) Allowlist fail-soft — 3 warns + Allowlist nach Filter.
- Sub (b) sporeRef OK → accepted + recentSporeRefs-Cache.
- Sub (b) sporeRef Schema-Fehler → ignored.
- Sub (b) query Modul-04.C fehlt → fail-soft reply
  (`error:"module-04c-not-available"`) + Sub-(e) ignored.
- Sub (b) query Modul 04.C vorhanden → accepted (Stub mit
  `queryLocal` → results.len=1).
- Sub (b) hint Schema-Fehler → ignored.
- Sub (b) hint Modul-14-fehlt-Info einmal pro Sitzung (zweiter Hint
  feuert KEIN zweites `console.info`).
- Sub (b) hint Modul 14 vorhanden → accepted + `recordLead` aufgerufen
  mit `sourceOrigin`.
- Sub (b) queryResult Match → Pending-Promise resolved.
- Sub (b) queryResult no-Match → ignored.
- Sub (b) Replay-Dedupe — zweiter Nonce-Aufruf still verworfen.
- Sub (b) handshake-Tabu → unbekannte op → ignored.
- Sub (b) Rate-Limit throttled → ignored + `details.throttled:true`.
- Sub (b) Nonce fehlend → ignored.
- Sub (b) Origin nicht in Allowlist → rejected-allowlist.
- Sub (b) recentSporeRefs FIFO bei 17. Eintrag (max 16).

### 9. Doku + Status

- **Karte 15 § Bauzustand** Zeile „Code geschrieben (Sub (a)+(b)
  Bedien-Pfade)" mit voller Anmerkung (siehe oben).
- **INTERFACES.md § 1 Modul 15 Status** auf `review` gezogen (war
  `entwurf`); „Geprüft"-Zeile um „2026-05-25 (Bau-Sitzung 15.B)"
  erweitert.
- **PULS.md** Tabellenzeile 15 nachgezogen + Sitzungs-Eintrag oben
  (vor Spec-Sitzung 15.B vom selben Tag).
- **status.json** `membranBacklog[0].siegel`-Text aktualisiert
  (Bau-15.B-Eintrag vorn angefügt). Pie-Skript aufgerufen → score
  bleibt `"stub"`, kein Modul-Zähler-Wechsel.

---

## Disziplin gehalten

- KEIN Eingriff in `src/sbkim-sw.js` (Bau 15.SW fertig 2026-05-24).
- KEIN Eingriff in Sub (e) Detektor-Schicht (Ringbuffer, Modal, Lampe,
  BroadcastChannel-Subscription) — Bau 15 fertig 2026-05-24.
- KEIN Eingriff in `index.html` oder `sbkim-init.js`.
- KEIN Eingriff in Modul 14 (Diffusion), Modul 11 (Rate-Limit),
  Modul 04 (Match).
- KEIN Eingriff in Modul 16 außer `ZERTIFIKAT_ASPEKTE`-Eintrag.
- KEINE Sender-API auf `window.SbkimMembrane` (Sub (b) ist Empfänger-
  Schicht; Sender-Pattern liegt beim Andocker, Karte 15 § Sender-
  Mechanismus).
- KEINE Schema-Bruch — alle Fail-Pfade auf `null`/`[]` oder
  `decision:"ignored"`.
- KEIN `op:"handshake"`-Pfad — die op-Validierung filtert ihn als
  unbekannte op (ignored).
- KEIN sync Throw aus `init()` oder dem postMessage-Listener.
- KEIN Persistent-Log für Sub (b) — Persistenz bleibt RAM-only.
- KEINE Tafel-Umsortierung.
- KEIN `PROTOCOL_VERSION`-Bump, KEIN `DB_VERSION`-Bump.

---

## Erkenntnisse / Bau-Detail-Entscheidungen

- **Sender-API NICHT auf Public-Surface.** Sub (b) ist Empfänger-
  Schicht; Sender-Pattern liegt beim Andocker (Karte 15 § Sender-
  Mechanismus, drei Optionen `window.open()` / `iframe.contentWindow` /
  `BroadcastChannel`). Stattdessen Test-Brücke `_meta._registerPendingQueryForTest`
  für queryResult-Match-Pfad — Sichttest-Werkzeug, nicht produktive
  Sender-API.
- **`inReplyTo` aus Envelope.** Sender-Konvention legt `inReplyTo` auf
  Envelope-Ebene (`data.inReplyTo`), nicht in `payload`. Wir lesen es
  primär aus Envelope und reichen es als Fallback an `dispatchOp` via
  Payload-Augmentation. Das deckt legacy-Sender ab, ohne die Spec zu
  brechen.
- **Modul-14-fehlt-`console.info` einmal pro Session.** Bool-Guard
  `diffusionMissingNotified` (Karte 15 § Sub (b) Hint-Pfad „Frequenz-
  drossel ist OK"). Wiederholte hints feuern KEIN zweites Info.
- **`recentSporeRefs` FIFO-Eviction via Map.delete + set.** Map iteriert
  in Insertion-Order — bei Re-Insertion (gleicher Origin) erst löschen,
  damit der neue Eintrag ans Ende kommt. Verhindert
  Falsche-Reihenfolge-Bug.
- **`seenNonces` Lazy-Pruning.** Wir prunen nicht pro `setInterval`
  (kein langlebiger Timer), sondern bei jedem incoming-Message via
  `pruneSeenNonces(nowMs)`. Speichert eine RAM-Map-Eviction-Latenz von
  30 s im Worst-Case (Map wächst bei viel Verkehr, aber jeder
  postMessage triggert Cleanup).
- **Allowlist-Validierung filtert in `init()`.** Spec-Wille (Karte 15
  § Konfigurations-Pfad „Validierung fail-soft"): falsche Origins
  werden VOR der ersten Message gefiltert, damit der Empfänger nie
  einen Type-Error wirft. `JSON.stringify` für die warn-Message macht
  den verworfenen Wert lesbar (auch bei `null`/`42`/Objects).

---

## Was offen blieb

- **Klaus' Sichttest Panel 15 Knöpfe 10–17** in DeX-Chrome auf Galaxy
  Tab S6. Headless-Smoke deckt alle Logik-Pfade ab, aber Browser-
  Sichttest ist nicht ersetzbar (CLAUDE.md § „Klaus' Browser-Sichttest
  ist nicht ersetzbar").
- **Endknoten-Migration** Pipeline-Schritt 5 — `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md`
  muss um Sub-(b)-Allowlist + Siegel-Anker pro Endknoten-PWA erweitert
  werden (eigene Folge-Pflege-Sitzung); danach pro Endknoten-Repo
  eine externe Migrations-Sitzung.
- **Klaus' App-Freigabe** Pipeline-Schritt 6.
- **Sender-API auf Public-Surface?** — Spec lässt das offen. Empfehlung:
  NICHT in Bau 15.B (Empfänger-Schicht), eigene Folge-Pflege wenn
  Endknoten-Migration zeigt, dass Andocker dafür Boilerplate brauchen.
- **PULS.md 3000-Zeilen-Grenze** überschritten (4622 Zeilen nach
  dieser Sitzung; war 4399 vorher). Pre-existing — eigene Auslagerungs-
  Pflege-Sitzung fällig, um ältere Einträge nach `docs/sessions/archiv/`
  zu schieben (CLAUDE.md § „auslagern statt kürzen").

---

## Nächster sinnvoller Schritt

1. **PR mergen** + Klaus' Sichttest Panel 15 Knöpfe 10–17 (alle acht
   neuen Knöpfe + Setup-Output-Check). Sage-Page Bonus-Check (Sub (e)
   bleibt unverändert): FREMD-Lampe + Modal + Demo-Knopf sollten
   weiter grün sein (Bau 15.B berührt das Sub-(e)-Modul nicht).
2. **Pflege-Sitzung Brief Endknoten-Migration** — `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md`
   um Sub-(b)-Allowlist (`SbkimMembrane.init({allowedOrigins:[…]})`)
   und Siegel-Badge-Anker pro Endknoten-PWA erweitern.
3. **Endknoten-Migration** Pipeline-Schritt 5 — pro Endknoten eine
   externe Sitzung in `Mein-Rezeptbuch` / `Mein-Mixarium`.
4. **App-Freigabe** Pipeline-Schritt 6.

Optional (orthogonal): Auslagerungs-Pflege für PULS.md, sobald
3000-Zeilen-Grenze wieder als blockierend wahrgenommen wird.

---

## Geänderte Dateien

- `src/modules/15_membran.js` — Sub (a) read() voll, Sub (b)
  postMessage-Dispatcher voll, Allowlist fail-soft in init(),
  RAM-Caches + Helpers + _meta-Erweiterung.
- `src/modules/16_siegel.js` — `ZERTIFIKAT_ASPEKTE` um Bau-15.B-Eintrag
  ergänzt (additiv).
- `tests/manual_check.html` — Panel 15 Knöpfe 10–17 + Setup-Output-
  Erweiterung + default `allowedOrigins` für Tests.
- `tests/smoke_bau15b_membran.mjs` — neu angelegt (31/31 grün).
- `docs/components/15_membran.md` — § Bauzustand Zeile „Code
  geschrieben (Sub (a)+(b))" mit Anmerkung.
- `docs/INTERFACES.md` — § 1 Modul 15 Status `entwurf` → `review` +
  Geprüft-Datum.
- `docs/PULS.md` — Tabellenzeile 15 + Sitzungs-Eintrag oben.
- `status.json` — `membranBacklog[0].siegel`-Text aktualisiert.
- `docs/sessions/archiv/2026-05-25_bau-15b-membran.md` — dieses
  Protokoll.
