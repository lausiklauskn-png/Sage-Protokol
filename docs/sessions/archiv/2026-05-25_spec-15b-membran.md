# Übergabeprotokoll — Spec-Sitzung 15.B Membran Sub (a) + Sub (b)

**Datum:** 2026-05-25
**Sitzungs-Rolle:** Spec-Sitzung (Pipeline-Schritt 4)
**Branch:** `claude/spec-15b-membran-zsvuy`
**Anschluss nach:** PR #157 (Brief Spec-Sitzung 15.B) + PR #156
(Pflege CLAUDE.md § Sicherheits-Module pflegen Aspekte) + PR #154
(Pflege Modul 16 Wappen/Korona) + PR #152 (Bau-Sitzung 16).

---

## Auftrag

Pipeline-Schritt 4 aus CLAUDE.md § „Pipeline-Reihenfolge bis App-
Freigabe (verbindlich, 2026-05-24)": Karte 15 Sub (a) Read-API +
Sub (b) postMessage-Brücke **vollständig spezifizieren**. Grob-Spec
aus Spec-Sitzung 15 vom 2026-05-24 hat die Anker fixiert (globaler
Name, Allowlist-Konfigurationspfad, Sub-(e)-Hooks); finale Detail-
Spec war ausstehend und blockiert die Endknoten-Migration
(Pipeline-Schritt 5) sowie die App-Freigabe (Pipeline-Schritt 6).

Zusätzlicher Anlass: **Siegel-Hook im `read()`-Snapshot** —
INTERFACES § 1 Modul 16 § Garantien-Block (Spec-Sitzung 16 vom
2026-05-24) hatte das Snapshot-Feld
`siegel: { isCertified, repoUrl, certifiedModules }` **vorbestellt**
für Spec-Sitzung 15.B.

---

## Was getan

### 1. Karte 15 § Sub (a) Read-API finalisiert

`docs/components/15_membran.md` Sub (a) Block (Zeilen ~141+) komplett
neu geschrieben:

- **Status-Header**: 🟨 Spec fertig (Sub (e) 2026-05-24, Sub (a)+(b)
  finalisiert 2026-05-25).
- **Globaler Name** `window.SbkimMembrane` bleibt fixiert (Grob-Spec
  2026-05-24, Spec 15.B bestätigt).
- **Snapshot-Schema** komplett mit allen Pflicht-Feldern:
  - Identitäts-Block: `protocolVersion / nodeId / domain / sporeUrl /
    domainKeywords / stammCategories / guestCategories` (alle drei
    Spore-Listen mitgegeben — sie sind ohnehin public in der Spore-
    JSON).
  - Geschwister-Block ANONYMISIERT: `siblings:[{nodeIdHash, since,
    status}]` — `nodeIdHash = base64url-sha256(nodeId)` OHNE Per-
    Session-Salt. KEIN `score`/`lastSeen` (zu nah am Empfehlungs-
    Pfad, Tabu).
  - Storage-Block: `{quotaWarningLevel, storagePersisted}` Doppel-
    schwelle-Mapping (Modul 00 § getStatusSnapshot).
  - **Siegel-Block neu** (Vorbestellung aus INTERFACES § 1 Modul 16):
    `siegel: { isCertified, repoUrl, certifiedModules:[{id,name,
    surfaceFn,lazy,status}] } | null`. Drei Pflicht-Fälle:
    - `null` wenn Modul 16 fehlt/nicht initialisiert (Agent kann
      „Modul 16 nicht da" von „nicht zertifiziert" unterscheiden).
    - voll mit `isCertified:false` wenn Modul 16 ready aber rot
      (transparent für Agent, Badge bleibt anti-greenwashing
      nicht im DOM — Modul 16 § Sub (a) binärer Fail-Modus).
    - voll mit `isCertified:true` wenn ready+grün.
    - `certifiedModules`-Eintrag **voll** (id/name/surfaceFn/lazy/
      status), KEINE reduzierte `{id,status}`-Form — Agent darf
      sehen welcher Surface-Funktions-Anker erwartet wurde.
- **Quota-Verhalten finalisiert**: `read()` ist IMMER verfügbar,
  Quota-Warnung blockt nicht. Empfangsmodus-Prinzip — `read()` ist
  Beobachtungs-Schicht, kein Storage-Schreiber.
- **Sub-(e)-Hook erweitert**: `details:{fieldsRequested:null,
  snapshotByteLen:JSON.stringify(snapshot).length}` (vorher nur
  `{fieldsRequested:null}`). `snapshotByteLen` ermöglicht Daten-
  Volumen-Beobachtung.
- **Strikte Tabus erweitert**: NIEMALS `sbkim_keys`, NIEMALS
  Geschwister-nodeId-Klartext (eigene nodeId OK), NIEMALS
  `score`/`lastSeen`, NIEMALS `navigator.userAgent` im Snapshot
  (im Sub-(e)-Buffer als `agentHint` getrennt), NIEMALS Klaus'
  API-Key (Modul 04.B). NIEMALS schreiben/signieren/Handshake
  auslösen.

### 2. Karte 15 § Sub (b) postMessage-Brücke finalisiert

`docs/components/15_membran.md` Sub (b) Block (Zeilen ~198+) komplett
neu geschrieben:

- **Envelope-Schema verbindlich**: `{type:"sbkim/membrane/v1", op,
  fromOrigin, nonce:crypto.randomUUID(), inReplyTo?, payload}`. Code-
  Beispiel mit allen Empfänger-Pfaden (same-origin/Allowlist/type/
  Rate-Limit/op-Validierung).
- **Op-Tabelle final** mit vier Werten + expliziten Payload-Schemata
  + Antwort-Pflicht + Sub-(e)-Decision-Mapping:
  - `sporeRef.payload={nodeId, sporeUrl, domain}` (fire-and-forget,
    RAM-Cache `recentSporeRefs[origin]` max. 16 FIFO).
  - `query.payload={text, k(Default 5)}` (Antwort via `op:
    "queryResult"` mit `inReplyTo:<nonce>`; fail-soft wenn Modul
    04.C `queryLocal` fehlt → `error:"module-04c-not-available"`).
  - `hint.payload={vector:number[384], label, ttlMs}` (fire-and-
    forget, delegiert an `SbkimDiffusion?.recordLead` falls Modul 14
    vorhanden, sonst `console.info` + `decision:"ignored"`).
  - `queryResult.payload={results, error}` (Empfänger matched
    `inReplyTo` gegen RAM-Map `pendingQueries[nonce]` TTL 30 s).
  - **`handshake` Tabu** (verbindlich, Anastomose bleibt bei
    Modul 05).
- **Strikte Tabus erweitert**: kein `op:"handshake"`, statische
  Allowlist, Nonce-Pflicht, kein Persistent-Log, kein Auto-Handshake
  bei `sporeRef`/`hint`, kein Stub-Store `sbkim_diffusion_leads`
  durch Modul 15 wenn Modul 14 fehlt.
- **Konfigurations-Pfad final**: `SbkimMembrane.init({allowedOrigins:
  [...]})` mit strict-String-Format (exakter Origin-Match, kein
  Wildcard, kein `*self*`-Sonderwert). **Validierungs-Strenge: fail-
  soft** — `console.warn` pro entferntem Eintrag, KEIN sync Throw
  (Andocker-Init bleibt funktional).
- **Sender-Mechanismus dokumentiert (NICHT Modul-Pflicht)**: drei
  Optionen für den Andocker (`window.open()`-Popup,
  `iframe.contentWindow`, `BroadcastChannel('sbkim')`-Fallback für
  same-origin Sichttest). Modul 15 ist nur Empfänger.
- **Rate-Limit-Hook vorbestellt für Modul 11**: optionaler
  `window.SbkimRateLimit?.checkOrigin(origin) → "ok"|"throttled"`-
  Aufruf vor Bedienung; fail-soft wenn Modul 11 fehlt; Drosselungs-
  Marker `details.throttled:true` macht Modul-11-Verwerfungen im
  Fremdzugriff-Modal sichtbar.
- **Hook für Sub (e) bestätigt**: jede eingehende Message →
  `kind:"membrane-postmessage"`-Eintrag mit `details:{op, nonce}`
  (+ optional `throttled:true`), **NIEMALS** voller Payload.

### 3. „Was eine spätere Spec-Sitzung füllen müsste"-Sektionen
gefüllt

`docs/components/15_membran.md` Sub-(a)+(b)-Punkte (Zeilen ~640+)
als entschieden markiert mit Verweis auf den verbindlichen Vertrag
im Sub-(a)+(b)-Block oben. Alle vier Sub-(a)-Fragen + alle fünf
Sub-(b)-Fragen + zusätzliche Spec-Sitzungs-15.B-Entscheidungen
(Op-Tabelle, Nonce-Pflicht, Antwort-Pfad) gespiegelt.

### 4. Karte 15 § Bauzustand neue Zeile

Neue Zeile „Spec gefüllt (Sub (a)+(b) final) | 2026-05-25 | Spec-
Sitzung 15.B | ..." mit voller Spec-Anmerkung (Snapshot-Schema,
Sub-(e)-Hook-Erweiterung, op-Tabelle, Allowlist fail-soft,
Rate-Limit-Hook, Nonce-Dedupe, Tabus).

### 5. INTERFACES.md § 1 Modul 15 nachgezogen

`docs/INTERFACES.md` § 1 Modul 15 (Zeilen 2157+) erweitert:

- **Status-String** aktualisiert: Spec-Sitzung 15.B vom 2026-05-25,
  Sub (a)+(b) voll-Spec.
- **Bietet-Block** Sub (a) und Sub (b) komplett neu mit voll-
  spezifiziertem `MembraneSnapshot`-Schema (inkl. Siegel-Hook-Feld)
  und postMessage-Envelope + Op-Tabelle (inkl. `queryResult` als
  vierter Op-Variante + Verhalten bei kein-Match für `inReplyTo`).
- **options-Form** `allowedOrigins` ergänzt um Validierungs-Hinweis
  (fail-soft, KEIN sync Throw).
- **Garantien-Block** erweitert um Sub-(a)-Anti-PII-Tabus,
  Siegel-Hook-Vertrag (3-Fall-Logik), Quota-Verhalten (nicht-
  blockend), Sub-(b)-Allowlist-Format + fail-soft Validierung,
  Op-Tabelle-Vertrag, Nonce-Pflicht, Rate-Limit-Hook, RAM-only-
  Caches.
- **Tabus** Block erweitert: keine `sbkim_keys`, keine Geschwister-
  nodeId-Klartext (mit Salt-Verzicht-Begründung), keine
  score/lastSeen, keine navigator.userAgent in Snapshot, kein
  API-Key, kein op:"handshake", strict-String-Allowlist, fail-soft
  Validierungs-Strenge, Nonce-Pflicht, kein Auto-Handshake, kein
  op:"hint" mit Schreib-Recht ohne Modul 14, kein Persistent-Log,
  PII-Schutz im Sub-(e)-Buffer mit `throttled:true`-Marker.
- **Datenformate** explizit: `MembraneSnapshot` Pflicht-Felder,
  postMessage-Envelope, vier Payload-Schemata.
- **Hook-Punkte** erweitert: Modul 11 (Rate-Limit), Modul 14
  (Diffusion), Modul 04.C (Search-API), Modul 16 (Siegel) — alle
  als VORBESTELLT in Spec-Sitzung 15.B markiert.
- **Fehlerverhalten** erweitert um Schema-Fehler-Pfade, Replay-
  Dedupe-Pfad, Modul-14/04.C-Fail-soft-Pfade, init-Allowlist-
  Validierungs-Pfad, Rate-Limit-Throttle-Pfad, Modul-16-fehlt-Pfad
  (`siegel:null`), Quota-Pfad (kein Block).
- **Geprüft-Datum** ergänzt: 2026-05-25 (Spec-Sitzung 15.B).

### 6. Brief BAU 15.B angelegt

`docs/sessions/BRIEF_BAU_15B_MEMBRAN.md` neu angelegt mit voll-
ausgeschriebenem Codeblock für die nächste Bau-Sitzung (Pipeline-
Schritt 4 → Bau, der dann Pipeline-Schritt 5 freischaltet):

- Branch-Vorschlag `claude/bau-15b-membran`.
- Voraussetzung: PR aus Spec-Sitzung 15.B auf `main`.
- Aufgaben-Liste 11 Pflicht-Schritte + 2 Sekundär-Schritte +
  Zurückgehalten-Liste + Was-du-nicht-tust-Liste.
- **Pflicht-Konvention aus CLAUDE.md** (Sicherheits-Module pflegen
  Aspekte): `ZERTIFIKAT_ASPEKTE`-Eintrag in `src/modules/16_siegel.js`
  am Listen-Ende mit Datum + „15" + ein-Satz-Beschreibung.
- Panel-15-Erweiterung mit Knöpfen 10–17 für Sub-(a)+(b)-Sichttests.
- Headless-Smoke-Test-Mindest-Abdeckung mit Anti-PII-Probe.

### 7. PULS.md Sitzungs-Eintrag oben + Tabellen-Zeile 15

PULS.md (oben) neuer Sitzungs-Eintrag „2026-05-25 · Spec-Sitzung
15.B — Modul 15 Sub (a) + Sub (b) finalisiert"; Tabellen-Zeile 15
in „Schnellüberblick" um Spec-Sitzung-15.B-Vermerk erweitert.

### 8. status.json `membranBacklog[0].siegel` aktualisiert

`status.json` membranBacklog Eintrag für Modul 15 um Spec-Sitzung-
15.B-Vermerk vorne erweitert (Code-Stub-Stand bleibt — Bau noch
ausstehend, score bleibt `"stub"`, Pie-Skript NICHT aufgerufen).

---

## Disziplin gehalten

- **KEIN Modul-Code-Eingriff** in `src/modules/15_membran.js` oder
  `src/modules/16_siegel.js` — Spec-Sitzung, Bau ist nächster Schritt.
- **KEIN Eingriff in `tests/manual_check.html`** — Panel 15 bleibt
  unberührt, neue Knöpfe sind Bau-15.B-Aufgabe.
- **KEIN Eingriff in `index.html`** oder `sbkim-init.js` — keine
  neuen Lampen, keine neuen Init-Optionen für die Sage-Page.
- **KEIN Sichttest** — finale Spec ist Doku-Arbeit + Brief-Anlage.
- **KEINE Tafel-Umsortierung** (CLAUDE.md § Pipeline-Reihenfolge
  Schritt 4 bleibt Schritt 4 — Schritte 5/6 unverändert).
- **KEIN `PROTOCOL_VERSION`-Bump** (Modul 15 ist nicht protokoll-
  aktiv; MembraneSnapshot ist Beobachtungs-Schicht).
- **KEIN `DB_VERSION`-Bump** (Persistenz bleibt RAM-only).
- **KEIN `status.json` `score`-Wechsel** für Modul 15 (Code-Stub
  bleibt — Bau 15.B macht den nächsten Stand). Pie-Skript daher
  NICHT aufgerufen.

---

## Was offen blieb

- **Bau-Sitzung 15.B** (Pipeline-Schritt 4 → Bau): `src/modules/
  15_membran.js` Sub (a) read() und Sub (b) postMessage-Bedien-Pfade
  voll implementieren. Brief liegt unter `docs/sessions/
  BRIEF_BAU_15B_MEMBRAN.md`.
- **Klaus' Sichttest 16** (Pipeline-Schritt 3) läuft parallel,
  unabhängig von 15.B-Spec. Wenn Sichttest 16 grün ist und 15.B Bau
  durch, ist die Pipeline bereit für Endknoten-Migration
  (Pipeline-Schritt 5).
- **Endknoten-Migration** (Pipeline-Schritt 5) in Mein-Rezeptbuch +
  Mein-Mixarium — Karte 09 § Schritt 10 + 11 ergänzen (Membran-
  Allowlist + FREMD-Lampe + Siegel-Badge + Sub-(b)-Sender-Pattern
  pro Endknoten-PWA).
- **Klaus' App-Freigabe** (Pipeline-Schritt 6) — vor diesem Schritt
  Pipeline-Schritte 1–5 alle grün.

---

## Nächster sinnvoller Schritt

1. **PR mergen** (diese Spec-Sitzung) — schließt Pipeline-Schritt 4
   Spec-Teil.
2. **Bau-Sitzung 15.B** anstoßen via `Befehl schreiben`-Befehl —
   nutzt den vollständig vorbereiteten Brief aus
   `docs/sessions/BRIEF_BAU_15B_MEMBRAN.md`.
3. Parallel: **Klaus' Sichttest 16** in Sage-Page (Pipeline-
   Schritt 3) durchführen, Befund in Folge-Pflege ggf. ablegen.
4. Nach Bau 15.B + Sichttest 16: **Endknoten-Migration**
   (Pipeline-Schritt 5).
