# Brief — Bau-Sitzung 15.B Membran Sub (a) + Sub (b)

**Anlass:** Spec-Sitzung 15.B vom 2026-05-25 (vorheriger Sitzungs-
Eintrag in PULS.md) hat Karte 15 § Sub (a) Read-API und § Sub (b)
postMessage-Brücke vollständig spezifiziert — finales
`MembraneSnapshot`-Schema mit Siegel-Hook-Feld, finale postMessage-
Envelope mit vier `op`-Werten (sporeRef/query/hint/queryResult) und
expliziten Payload-Schemata, Allowlist strict String fail-soft,
Rate-Limit-Hook für Modul 11 als optionaler Hook, Nonce-Pflicht mit
30 s Replay-Dedupe. Bau-Sitzung 15.B implementiert die Spec —
Modul-Code in `src/modules/15_membran.js`, Panel-15-Erweiterung in
`tests/manual_check.html`, Headless-Smoke-Test im Node-Stub.

**Branch (Vorschlag):** `claude/bau-15b-membran`

**Voraussetzungen:**

- PR aus Spec-Sitzung 15.B (Pipeline-Schritt 4) ist auf `main`.
  Karte 15, INTERFACES § 1 Modul 15, PULS.md, status.json sind
  konsistent mit der finalen Sub-(a)+(b)-Spec.
- Keine parallel offene PR-Schicht in `src/modules/15_membran.js`.
- **Klaus' verbindliche Festlegungen aus Karte 15 § Sub (a)+(b)**
  sind Bau-Vorgaben — die Sitzung füllt die Code-Form, aber NICHT
  die Anker (globaler Name `window.SbkimMembrane`, strict-String-
  Allowlist, vier `op`-Werte ohne `handshake`, Nonce-Pflicht,
  Persistenz RAM-only, fail-soft Validierung).

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung)

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md (besonders § „Was du tust (Pflicht-Konventionen)" — Sicherheits-Module pflegen Aspekte!)
2. docs/PULS.md (Schnellüberblick + jüngste Sitzungs-Einträge 2026-05-25 zu Spec-Sitzung 15.B)
3. docs/INTERFACES.md (§ 1 Modul 15 — voller Block aus Spec-Sitzung 15.B + § 1 Modul 16 § Garantien-Block für den Siegel-Hook)
4. docs/components/15_membran.md (deine Karte, KOMPLETT lesen — Sub (a)+(b) sind die Vertragsgrundlage; Bau-Sitzung 15.B implementiert die Spec 1:1)
5. docs/components/16_siegel.md (NUR § Schnittstelle + § Sub (a) Pflicht-Modul-Liste — Snapshot-Hook braucht das Schema)
6. src/modules/15_membran.js (voller Code-Stand aus Bau 15 vom 2026-05-24; Sub (e) ist fertig, Sub (a) read() ist Skelett, Sub (b) postMessage-Listener ist Skelett — du füllst beide Bedien-Pfade)
7. src/modules/16_siegel.js (NUR Public Surface `isCertified` / `getExplanation` / `getCertifiedModules` — für den Snapshot-Hook; KEIN Code-Eingriff)
8. tests/manual_check.html (NUR Panel 15 als bestehende Test-Bridge — du erweiterst mit neuen Knöpfen für Sub (a)+(b)-Pfade)

Deine Aufgabe:

PRIMÄR — Bau-Sitzung 15.B vollständig durchziehen:

1. **`src/modules/15_membran.js` Sub (a) read() finalisieren:**
   - Snapshot-Schema 1:1 aus Karte 15 § Sub (a) MembraneSnapshot füllen:
     - Identitäts-Block: `protocolVersion` (immer §0-Wert "0.1"), `nodeId` Klartext, `domain`, `sporeUrl`, `domainKeywords[]`, `stammCategories[]`, `guestCategories[]` aus Spore. Fail-soft pro Feld (Modul-02-Lese-Pfad bestehend halten).
     - Geschwister-Block: `siblings:[{nodeIdHash, since, status}]` — `nodeIdHash = base64url-sha256(nodeId)` (bestehender Helper), KEIN `score`, KEIN `lastSeen`.
     - Storage-Block: `{quotaWarningLevel, storagePersisted}` (bestehende `computeQuotaWarningLevel`-Logik + Modul-01-Spiegelung).
     - **Siegel-Block** neu: `siegel:{isCertified, repoUrl, certifiedModules:[{id,name,surfaceFn,lazy,status}]} | null`. Resolver: prüfe `typeof window.SbkimSiegel === "object"` + `SbkimSiegel._meta.ready === true`; falls nein → `null`. Sonst `{isCertified: SbkimSiegel.isCertified(), repoUrl: SbkimSiegel.getExplanation().repoUrl, certifiedModules: SbkimSiegel.getExplanation().modules}` (defensive Kopie, weil getExplanation() schon defensive Kopie liefert — kein zweiter Klon nötig).
   - Sub-(e)-Hook-Eintrag erweitern: `details:{fieldsRequested:null, snapshotByteLen: JSON.stringify(snapshot).length}` (war bisher nur `{fieldsRequested:null}`).
   - **Anti-PII-Test im Smoke-Suite verankern**: assert `snapshot` enthält weder String `"sbkim_keys"` noch andere Geschwister-nodeIds im Klartext.

2. **`src/modules/15_membran.js` Sub (b) postMessage-Bedien-Pfad finalisieren:**
   - **Envelope-Validierung erweitern**: prüfe `nonce` ist String (Pflichtfeld); fehlend → `decision:"ignored"`.
   - **Allowlist-Validierung in init()** ergänzen: filter nicht-String-Einträge ODER Einträge ohne `http://`/`https://`-Präfix aus + `console.warn` pro entferntem Eintrag (Format: `[SbkimMembrane] Allowlist-Eintrag verworfen (Format ungültig): "..."`). KEIN sync Throw.
   - **Replay-Dedupe**: modul-lokale RAM-Map `seenNonces` (Map von nonce → receivedAt), FIFO-Eviction nach 30 s. Bei bekanntem Nonce <30 s alt: still verwerfen, KEINE Antwort, KEIN doppelter Sub-(e)-Eintrag.
   - **Rate-Limit-Hook**: vor jeder op-Verarbeitung `if (typeof window.SbkimRateLimit?.checkOrigin === "function") { const verdict = window.SbkimRateLimit.checkOrigin(event.origin); if (verdict === "throttled") { record({..., decision:"ignored", details:{op, nonce, throttled:true}}); return; } }`. Fail-soft wenn Modul 11 fehlt (kein Throw, kein warn).
   - **`op:"sporeRef"`-Pfad**: Schema-Check (`payload.nodeId/sporeUrl/domain` alle String). Bei OK → RAM-Cache `recentSporeRefs[event.origin] = {nodeId, sporeUrl, domain, receivedAt}` (Map, max. 16 Origins FIFO). decision:"accepted". Bei Schema-Fehler → decision:"ignored", KEINE Antwort.
   - **`op:"hint"`-Pfad**: Schema-Check (`payload.vector` Array Länge 384, `payload.label` String, `payload.ttlMs` Number >0). Wenn OK + `window.SbkimDiffusion?.recordLead` existiert → aufrufen mit `{vector, label, ttlMs, sourceOrigin: event.origin}`, decision:"accepted". Wenn OK aber Modul 14 fehlt → `console.info`-Zeile mit Frequenz-Drosselung (einmal pro Sitzung) + decision:"ignored". Bei Schema-Fehler → decision:"ignored". KEINE Antwort (fire-and-forget).
   - **`op:"query"`-Pfad**: Schema-Check (`payload.text` String, `payload.k` Number Default 5). Wenn OK + `window.SbkimMatch?.queryLocal` existiert → `await SbkimMatch.queryLocal(text, k)`, dann `event.source.postMessage({type:"sbkim/membrane/v1", op:"queryResult", fromOrigin: window.location.origin, nonce: crypto.randomUUID(), inReplyTo: payload-nonce, payload:{results, error:null}}, event.origin)`, decision:"accepted". Wenn OK aber Modul 04.C fehlt → Antwort mit `{results:[], error:"module-04c-not-available"}`, decision:"ignored". Bei Schema-Fehler → decision:"ignored", KEINE Antwort.
   - **`op:"queryResult"`-Pfad**: modul-lokale RAM-Map `pendingQueries` (Map von nonce → {origin, sentAt, resolve}, TTL 30 s). Wenn `inReplyTo` zu bekanntem Eintrag passt → resolve Promise mit `payload`, decision:"accepted", Eintrag aus Map entfernen. Wenn kein Match → decision:"ignored".
   - **Wechsel decision:"ignored" → "accepted"** im bestehenden Skelett: aktuell setzt der Code stur `decision:"ignored"` bei type-OK + Allowlist-OK (Bau-15-Kommentar verweist auf Spec-Sitzung 15.B). Dieser Wechsel ist Bau-15.B-Pflicht.
   - **KEIN `op:"handshake"`-Pfad** — die op-Validierung muss explizit ein Set `{sporeRef, query, hint, queryResult}` matchen; unbekannte op-Werte → decision:"ignored".

3. **`SbkimMembrane._meta` erweitern**: 
   - `recentSporeRefsCount` (getter, Map-Größe)
   - `pendingQueriesCount` (getter, Map-Größe)
   - `seenNoncesCount` (getter, Map-Größe)
   - `siegelAvailable` (getter, ob Modul 16 ready)
   Defensive Kopien wo nötig (Snapshot-Pattern).

4. **Selbstcheck-Zeile** prüfen — Wortlaut bleibt unverändert (`init/read/fremdzugriff.{list,subscribe,clear,_recordForTest}`), weil Sub (a)+(b) keine NEUEN Public-Surface-Funktionen ergänzen, nur die bestehenden read() + postMessage-Listener füllen.

5. **`src/modules/16_siegel.js`** — **PFLICHT-KONVENTION aus CLAUDE.md § „Was du tust"**: `ZERTIFIKAT_ASPEKTE`-Eintrag am Listen-Ende ergänzen (additiv, KEIN Re-Ordering, KEIN Eingriff in Surface):
   ```js
   {
     since:       "<HEUTE-YYYY-MM-DD>",
     module:      "15",
     aspect:      "Sub (a) Read-API + Sub (b) postMessage-Brücke",
     description: "Finale Bedien-Pfade: MembraneSnapshot mit Siegel-Hook, vier op-Werte (sporeRef/query/hint/queryResult) mit Nonce-Pflicht, fail-soft Allowlist, Rate-Limit-Hook für Modul 11.",
   },
   ```
   Beschreibung max. 240 Zeichen. KEIN Eingriff in PFLICHT_MODULE (Bau 15.B ist kein neues Pflicht-Modul, nur Erweiterung von Modul 15).

6. **Panel 15 in `tests/manual_check.html` erweitern** mit neuen Knöpfen für Sub (a)+(b)-Pfade:
   - **Knopf 10** „Sub (a) read() vollständig" — ruft `await SbkimMembrane.read()`, zeigt Snapshot-JSON (pretty-printed, max. 50 Zeilen), prüft alle Pflicht-Felder vorhanden + `siegel:null`/`siegel:{...}`-Logik.
   - **Knopf 11** „Sub (a) Anti-PII-Probe" — ruft `read()` + assertet via String-Suche, dass JSON weder `"sbkim_keys"` noch eine bekannte Geschwister-nodeId-Plaintext enthält.
   - **Knopf 12** „Sub (b) op:sporeRef Probe" — synthetisches `window.dispatchEvent(new MessageEvent("message", {data:{type:"sbkim/membrane/v1", op:"sporeRef", fromOrigin:"https://example.com", nonce:crypto.randomUUID(), payload:{nodeId:"abc", sporeUrl:"https://example.com/sbkim/spore.json", domain:"Test"}}, origin:"https://example.com"}))` ODER über `_recordForTest`-äquivalente Sub-(b)-Bridge (Bau-Sitzung wählt). Prüft: `SbkimMembrane._meta.recentSporeRefsCount === 1`, Sub-(e)-Eintrag mit decision="accepted" wenn Allowlist OK ODER decision="rejected-allowlist" wenn nicht.
   - **Knopf 13** „Sub (b) op:query Probe (Modul 04.C fehlt)" — synthetische `query`-Message, erwartet `queryResult`-Antwort mit `error:"module-04c-not-available"`. Test-Brücke: temporär `window.SbkimMatch.queryLocal` weg-stubben.
   - **Knopf 14** „Sub (b) op:hint Probe (Modul 14 fehlt)" — synthetische `hint`-Message, erwartet `console.info`-Zeile + decision="ignored".
   - **Knopf 15** „Sub (b) Replay-Probe" — gleicher Nonce zweimal innerhalb 30 s, erwartet zweiter still verworfen (kein doppelter Sub-(e)-Eintrag).
   - **Knopf 16** „Sub (b) Allowlist-fail-soft" — `await SbkimMembrane.init({allowedOrigins:["https://gut.example", 42, null, "ohne-präfix.example"]})`, erwartet drei `console.warn`-Zeilen + finale `_meta.allowedOrigins` = `["https://gut.example"]`.
   - **Knopf 17** „Sub (b) Rate-Limit-Hook" — `window.SbkimRateLimit = {checkOrigin: () => "throttled"}`-Stub setzen, synthetische Message, erwartet decision="ignored" + `details.throttled === true`.
   - Selbstcheck-Hinweis bleibt unverändert.
   - Setup-Output erweitern um Sub-(a)+(b)-Diagnose: `siegelAvailable`, `recentSporeRefsCount`, `pendingQueriesCount`, `seenNoncesCount`.

7. **Headless-Smoke-Test** in Node (analog Bau 15: `vm.createContext` mit DOM-/`crypto`-/`navigator`-Stubs). Mindest-Abdeckung:
   - Sub (a) Snapshot-Schema: alle Pflicht-Felder, `siegel:null`-Pfad, `siegel:{...}`-Pfad, Anti-PII (`JSON.stringify(snapshot)` enthält weder `"sbkim_keys"` noch fremde nodeIds).
   - Sub (a) Sub-(e)-Hook mit `snapshotByteLen`-Feld.
   - Sub (b) op-Tabelle: sporeRef Schema-OK/Fehler, query Modul-04.C-fehlt-Pfad, hint Modul-14-fehlt-Pfad, queryResult-Match/no-Match, handshake-Tabu (unbekannte op → ignored).
   - Sub (b) Allowlist fail-soft: gemischte Liste filtert sauber.
   - Sub (b) Nonce-Replay-Dedupe.
   - Sub (b) Rate-Limit-Hook fail-soft (Modul 11 fehlt → läuft normal weiter) + Throttle-Pfad.
   - Sub (b) recentSporeRefs FIFO-Eviction bei 17. Eintrag.

8. **Karte 15 § Bauzustand** Zeile „Code geschrieben (Sub (a)+(b) Bedien-Pfade)" ergänzen (Datum, Sitzung, Anmerkung mit Schlüssel-Entscheidungen).

9. **INTERFACES.md § 1 Modul 15** Status bleibt `entwurf` mit Update-Anmerkung „Bau-Sitzung 15.B 2026-05-25 — Code-Stub mit voll-Spec-Bedien-Pfaden" (oder Status auf `review` ziehen — Bau-Sitzung 15.B entscheidet).

10. **PULS.md** Tabellenzeile 15 nachziehen + Sitzungs-Eintrag oben.

11. **status.json** `membranBacklog[0].siegel` aktualisieren: "Code-Stub voll (Bau 15.B Sub (a)+(b) Bedien-Pfade vom <heute>) + Bau 15 Sub (e) + Bau 15.SW SW-Probe + Pflege Sage-Page-Sichttest-Knopf" (alle vorherigen Pflege-Notizen behalten, Bau-15.B-Zeile vorn anfügen). `python3 scripts/update_puls_pie.py` aufrufen falls nötig (vermutlich nicht — score bleibt "stub").

SEKUNDÄR — wenn Zeit + Token reichen:

12. **Sender-Helper-Knopf** als Bonus in Panel 15 — sendet eine synthetische `sporeRef`-Message an `window` self via `BroadcastChannel('sbkim')` (same-origin Fallback) für Klaus' Sichttest. KEINE neue Public-Surface-Funktion.

13. **Selbstcheck-Zeile** ggf. erweitern, falls neue Public-Surface (z.B. wenn Bau-Sitzung 15.B doch eine `sender`-API für Andocker-Convenience anbietet — Spec lässt das offen, aber Empfehlung: NICHT in Bau 15.B, eigene Folge-Pflege).

ZURÜCKGEHALTEN — diese Bau-Sitzung NICHT:

- Eingriff in Modul 14 (Diffusion) — hint-Pfad ist fail-soft, Modul 14 bleibt Stub. Bau-Sitzung 14 ist eigene Pipeline-Position (nach App-Freigabe).
- Eingriff in Modul 11 (Rate-Limit) — checkOrigin-Hook ist optional, Modul 11 bleibt Stub. Bau-Sitzung 11 nach App-Freigabe.
- Eingriff in Modul 04 (Match) für `queryLocal` — Modul 04.C Search-API ist eigene Spec-/Bau-Sitzung (kein Pipeline-Schritt definiert).
- Eingriff in Modul 16 außer `ZERTIFIKAT_ASPEKTE`-Eintrag (Pflicht-Konvention).
- Eingriff in Sub (e) Detektor-Schicht (Ringbuffer, Modal, Lampe) — Bau 15 hat das fertig.
- Eingriff in `src/sbkim-sw.js` Sub-(e)-SW-Probe-Detektor — Bau 15.SW hat das fertig.
- Eingriff in `index.html` (kein neues DOM-Element, kein neuer Lampen-Zustand).
- Eingriff in `sbkim-init.js` (außer ggf. die `allowedOrigins`-Liste der Sage-Page setzen — aber das ist eigene Pflege nach Endknoten-Migration).
- Endknoten-Migration in Mein-Rezeptbuch / Mein-Mixarium — Pipeline-Schritt 5, eigene Folge-Sitzung pro Endknoten.
- `PROTOCOL_VERSION`-Bump oder `DB_VERSION`-Bump.

Was du nicht tust:

- KEINE Modifikation am MembraneSnapshot-Schema oder Envelope-Schema. Wenn ein Feld nicht ermittelbar ist, fail-soft auf null/[] — KEIN Schema-Bruch.
- KEINE neue op-Variante außerhalb {sporeRef, query, hint, queryResult}. `op:"handshake"` bleibt Tabu.
- KEIN Persistent-Log für Sub (b). Persistenz bleibt RAM-only.
- KEIN sync Throw aus init() oder dem postMessage-Listener — alles fail-soft via console.warn/console.info.
- KEINE Sender-API auf `window.SbkimMembrane` (Sub (b) ist Empfänger-Schicht; Sender-Pattern liegt beim Andocker).
- KEINE PII im Sub-(e)-Buffer (kein voller payload, nur op+nonce+throttled-Flag).
- KEIN `op:"handshake"`-Empfänger-Pfad. Wenn ein Handshake-Versuch kommt, Schema-Validierung schlägt zu und Eintrag landet als `decision:"ignored"`.
- KEIN Auto-Handshake bei `sporeRef`/`hint`.

Pflicht am Ende:

- `src/modules/15_membran.js` voll erweitert (Sub (a) read() finalisiert, Sub (b) Bedien-Pfade pro op gebaut, Allowlist fail-soft, Nonce-Dedupe, Rate-Limit-Hook, RAM-Caches).
- `src/modules/16_siegel.js` `ZERTIFIKAT_ASPEKTE`-Eintrag ergänzt (Pflicht-Konvention CLAUDE.md).
- Panel 15 in `tests/manual_check.html` um Knöpfe 10–17 erweitert.
- Headless-Smoke-Test grün im Node-Stub.
- `node --check src/modules/15_membran.js` grün.
- `node --check src/modules/16_siegel.js` grün.
- Karte 15 § Bauzustand Zeile „Code geschrieben (Sub (a)+(b))" mit Datum + Anmerkung.
- INTERFACES.md § 1 Modul 15 Status-Update.
- PULS.md Tabelle 15 + Sitzungs-Eintrag oben.
- status.json `membranBacklog[0].siegel`-Text aktualisiert.
- Übergabeprotokoll in `docs/sessions/archiv/YYYY-MM-DD_bau-15b-membran.md`.
- Commit + Push auf `claude/bau-15b-membran`.
- Draft-PR anlegen.
- Sichttest-Anweisung-Codeblock für Klaus in der Chat-Antwort wortwörtlich + komplett ausgeben (Panel 15 Knöpfe 10–17 als kompakte Schritt-Liste).
- „Vorgeschlagene nächste Schritte"-Block in der finalen Chat-Antwort (mindestens: Klaus' Sichttest, Endknoten-Migration Pipeline-Schritt 5, App-Freigabe Pipeline-Schritt 6).
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Bau-Sitzung
liest)

### Spec-Sitzung 15.B Stand 2026-05-25

Sub (a) und Sub (b) sind beide final spezifiziert. Die Bau-Sitzung
15.B implementiert die Spec **1:1**:

- **Sub (a)** legt das vollständige `MembraneSnapshot`-Schema fest
  (Identitäts-Block + Geschwister-Block ANONYMISIERT + Storage-Block +
  Siegel-Block). Anti-PII-Tabus erweitert (eigene nodeId Klartext OK,
  Geschwister-nodeIds nur als Hash, navigator.userAgent + API-Key
  verboten). Quota blockt `read()` nicht. Siegel-Hook ist Spiegel
  des Modul-16-Surface, drei Pflicht-Fälle (null/grün/rot).
- **Sub (b)** legt die postMessage-Envelope + vier `op`-Werte fest
  (sporeRef/query/hint/queryResult, `handshake` als Tabu). Allowlist
  strict String + fail-soft Validierung. Nonce-Pflicht mit 30 s
  Replay-Dedupe. Rate-Limit-Hook für Modul 11 als optionaler Pfad
  (fail-soft wenn Modul 11 fehlt). Hint/Query-Fail-Pfade für noch
  nicht implementierte Module 14/04.C.

### Was die Bau-Sitzung NICHT entscheidet

- Ob Modul 04.C `queryLocal` jetzt schon gebaut wird (nein — eigene
  Spec-/Bau-Sitzung 04.C, nicht in der Pipeline-Reihenfolge).
- Ob Modul 14 `recordLead` jetzt schon gebaut wird (nein — Pipeline
  organisch nach App-Freigabe).
- Ob die Sage-Page-`sbkim-init.js` jetzt eine `allowedOrigins`-Liste
  setzt (nein — Sage-Page hat keine produktiven Sub-(b)-Pfade, das
  ist Endknoten-Pflege in Pipeline-Schritt 5).
- Ob die Sender-API auf Public-Surface ergänzt wird (nein —
  Sender-Pattern bleibt beim Andocker, Modul 15 ist Empfänger-Schicht).

### Nach der Bau-Sitzung

1. **Klaus' Sichttest** Panel 15 Knöpfe 10–17 in `tests/manual_check.html`
   — alle grün (vermutlich + Hinweis-Knopf für Stub-Pfade).
2. **Endknoten-Migration** in Mein-Rezeptbuch + Mein-Mixarium (Karte
   09 § Schritt 10 + 11 ergänzen: Membran-Allowlist + FREMD-Lampe +
   Siegel-Badge + Sub-(b)-Sender-Pattern pro Endknoten-PWA).
3. **Klaus' App-Freigabe** — mit Siegel sichtbar + Sub-(a)+(b)
   produktiv.

### Warum direkt bauen ohne Klaus-Zwischenrückfrage

Karte 15 ist nach der Spec-Sitzung 15.B vom 2026-05-25 vollständig
spezifiziert. Die verbindlichen Tafeln aus Klaus' Festlegungen sind
in der Spec festgenagelt. Bau-Sitzung 15.B hat klare Vorgaben — die
einzigen Bau-Entscheidungs-Punkte sind:

- Genaue Form der Panel-15-Test-Brücken (Knopf-Wortlaut, Test-
  Daten).
- Frequenz-Drosselung der `console.info`-Zeile bei fehlendem Modul 14
  (Empfehlung: einmal pro Sitzung, Bool-Guard).
- Smoke-Test-Detail-Tiefe.

Diese sind Bau-Detail, kein Spec-Risiko.
