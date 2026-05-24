# Bau-Sitzung 15 — Membran Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe

**Datum:** 2026-05-24
**Rolle:** Bau-Sitzung
**Branch:** `claude/bau-15-membran-fremdzugriff-RIl3a`
**Brief:** `docs/sessions/BRIEF_BAU_15_MEMBRAN_FREMDZUGRIFF.md`
**Vorgänger:** Spec-Sitzung 15 (Sub (e) voll, Sub (a)+(b) grob) vom 2026-05-24
**Nachfolger:** Klaus' Browser-Sichttest (Tablet) ODER Bau-Sitzung 15.SW (SW-endpoint-probe-Detektor)

---

## Auftrag

Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe aus Spec-Sitzung 15
implementieren — `src/modules/15_membran.js` neu anlegen, `index.html`
um Lampen-DOM/CSS erweitern, Panel 15 in `tests/manual_check.html`
ergänzen. Sub (a) `read()` + Sub (b) postMessage-Listener als
Skelette mit Sub-(e)-Hooks.

## Was wurde getan

### 1. `src/modules/15_membran.js` neu angelegt (~580 Zeilen)

API exakt aus INTERFACES.md §1 Modul 15 gespiegelt:

- `window.SbkimMembrane.init({bufferMax?, lampSelector?, mountModal?, allowedOrigins?})` —
  idempotent, fail-soft für Lampe-Miss (DOMContentLoaded-Re-Try).
- `SbkimMembrane.read()` → `Promise<MembraneSnapshot>` — fail-soft
  Snapshot pro Quelle. Geschwister via `nodeIdHash = base64url-sha256(nodeId)`
  anonymisiert (WebCrypto, fail-soft pro Sibling). Tabu `sbkim_keys`
  strikt eingehalten. Jeder `read()` schreibt einen Sub-(e)-Eintrag
  (`kind:"membrane-read"`, `decision:"accepted"`, `origin:null`).
- `SbkimMembrane.fremdzugriff.list()` → defensive Kopie, älteste zuerst.
- `SbkimMembrane.fremdzugriff.subscribe(cb)` → idempotenter
  `unsubscribeFn`; cb-Throws gefangen + still verworfen.
- `SbkimMembrane.fremdzugriff.clear()` → leert Buffer + nimmt
  `.fremd-alert`; no-op bei leerem Buffer.
- `SbkimMembrane.fremdzugriff._recordForTest(entry)` → Test-Brücke
  mit Pflichtfeld-Validation (`kind`/`decision` aus `VALID_KINDS`/
  `VALID_DECISIONS`); ungültige Form ignoriert via `console.warn`.

**Ringbuffer:** `let buffer = []` als Closure-State (Karte 15
Persistenz-Entscheidung RAM-only); FIFO-Verdrängung via
`buffer.splice(0, buffer.length - bufferMax)`; `MEMBRANE_FREMDZUGRIFF_BUFFER_MAX = 50`
gespiegelt aus §0.

**Sub (b) postMessage-Listener** in `init()` registriert:

- Same-Origin (`event.origin === window.location.origin`) → KEIN
  Eintrag (Karte 15 § Fremd-Definition).
- Nicht-allowlisted Cross-Origin → `decision:"rejected-allowlist"`.
- Allowlisted Cross-Origin mit bekanntem `type` „sbkim/membrane/v1"
  ODER mit unbekanntem `type` → `decision:"ignored"` (Bedien-Pfad /
  `"accepted"` wartet auf Spec-Sitzung 15.B; Bau-Sitzung 15 darf
  laut Brief NICHT spekulieren).
- `details:{op, nonce}` aus Payload; `payload` selbst NIE im
  Eintrag (PII-Tabu).

**BroadcastChannel('sbkim-membrane')-Subscription** für SW-endpoint-
probes — Channel wird in `init()` fail-soft angelegt. Nachrichten
mit `type:"SBKIM_MEMBRANE_PROBE"` und gültigem `entry`-Feld werden
als `kind:"endpoint-probe"`-Eintrag in den Buffer geschoben.
**SW-seitiger Sender in `src/sbkim-sw.js` bewusst NICHT in dieser
Bau-Sitzung** — Brief erlaubt explizit SEKUNDÄR-Ausgliederung als
eigene Bau-Sitzung 15.SW. Page-Seite ist bereit, sobald 15.SW den
SW-Listener nachzieht.

**Modal-Mount + Click-Handler:**

- `mountFremdzugriffModal()` als Closure-Helper, erzeugt in
  `document.body` ein verstecktes `<div id="sbkim-membran-modal">`
  mit Backdrop, Header (Titel + ✕), Summary (Count + Aufräumen-
  Knopf), Tabelle mit 5 Spalten (Zeit / kind / origin / endpoint /
  decision), Tipp-Zeile „leere Tabelle = Lampe geht aus".
- Layout via Inline-Style (Sage-Page-Palette: bg `#10102A`, line
  `rgba(255,255,255,0.18)`, font system-ui; Aufräumen-Knopf in
  Alert-Rot mit reduziertem Alpha).
- Tabellen-Rows via `textContent` statt `innerHTML` — XSS-Schutz
  für fremde Strings aus postMessage / SW-Probe.
- Click auf Lampe → Modal öffnen + Snapshot rendern + subscribe;
  Esc + Backdrop + ✕ alle drei schließen mit Listener-Abmeldung.
- `Aufräumen`-Knopf ruft `clear()` → Tabelle leer + Lampe aus
  (Modal bleibt offen, Klaus sieht den Aufräum-Erfolg).

**Lampen-Steuerung:**

- `updateLampAlertState()` toggelt `.fremd-alert` je nach
  `buffer.length`.
- `pulseLamp()` triggert `.fremd-pulse` via force-reflow-Pattern
  (analog Modul 05 `.traffic-pulse`); Klasse nach `LAMP_PULSE_MS = 600`
  wieder abgenommen, damit jeder neue Eintrag erneut pulst.

**KEINE benannten Error-Klassen** — Karte 15 § Bau-Hinweise „rein
beobachtend, fail-soft via console.warn". Selbstcheck beim
Skript-Laden:

```
MODUL 15 MEMBRAN bereit, Funktionen: init/read/fremdzugriff.{list,subscribe,clear,_recordForTest}
```

`node --check src/modules/15_membran.js` grün.

### 2. `index.html` — drei additive Schritte

- `:root` um `--lamp-alert: #DC2626;` ergänzt.
- Zwei neue CSS-Regeln:
  - `.lamp.fremd-alert` — Dauer-Rot mit `box-shadow`-Glow + `::after`
    Atmungs-Animation analog `.lamp.alive` (aber mit
    `--lamp-alert` statt `--accent`).
  - `.lamp.fremd-pulse` — kurzer Puls via eigene `@keyframes
    lamp-alert-pulse` (rote box-shadow-Welle).
- DOM in `<div class="lamps">` nach `#lamp-traffic`:
  `<span class="lamp" id="lamp-fremd" title="…"></span>` +
  `<span class="lamp-label">fremd</span>`.
- `<script src="src/modules/15_membran.js">` vor `sbkim-init.js`
  eingehängt.
- `sbkim-init.js` um `SbkimMembrane.init({lampSelector:'#lamp-fremd'})`-
  Aufruf in der Init-Kette ergänzt (nach 08 UI-Demo, vor 00 Doku;
  Sub (e) hat keine Pflicht-Modul-Abhängigkeiten).

### 3. `tests/manual_check.html` — Panel 15 ergänzt

Neue `<section class="panel" data-module="15_membran">` mit
verstecktem `<span id="panel-15-fake-lamp" style="display:none;">`
(damit Sub (e) `lampSelector`-Hook ohne Sage-Page-Lampe testbar
ist — Klassen-Toggle ist im DevTools-Element-Inspector am Span
beobachtbar).

**Setup-Knopf** ruft `init({lampSelector:'#panel-15-fake-lamp', allowedOrigins:[], mountModal:false})` + `clear()`;
Output zeigt `bufferMax`, `bufferLength`, Lampen-Klassen, Modal-
Status, Allowlist.

**Sieben Test-Knöpfe:**

1. `_recordForTest`-Probe (drei Einträge, Reihenfolge älteste
   zuerst, defensive Kopie, Lampe `.fremd-alert`).
2. `subscribe(cb)` + Counter (zwei Einträge → Counter=2,
   `unsubscribe()` → dritter Eintrag erhöht NICHT; zweiter
   unsubscribe idempotent; `subscribe(null)` liefert no-op-
   `unsubscribeFn`).
3. `clear()` + Lampe aus.
4. Ringbuffer-Voll-Probe (60 Einträge → `list().length === 50`,
   älteste 10 verdrängt, jüngster `Probe-59`, ältester `Probe-10`).
5. `read()`-Snapshot + Sub-(e)-Hook + Tabu-Check (kein `sbkim_keys`/
   `privateKey`, Geschwister nur `nodeIdHash`).
6. postMessage Same/Fremd-Origin via `window.postMessage(...)` +
   `dispatchEvent(new MessageEvent('message', {origin:'https://foo.example', ...}))`.
7. Init mit Allowlist → `ignored`/`rejected-allowlist`-Differenzierung.

**Selbstcheck-Hinweis-Knopf** verweist auf die Konsolen-Zeile +
betont, dass `MEMBRANE_FREMDZUGRIFF_BUFFER_MAX` und `AGENT_HINT_MAX_LEN`
NICHT in der Selbstcheck-Zeile stehen.

### 4. Headless-Smoke 11/11 grün

Node mit DOM-Stub (siehe `/tmp/membran-smoke.js`-Pfad in der
Bau-Sitzung): API-Surface, Reihenfolge älteste zuerst, defensive
Kopie, Lampen-Toggle on/off, Buffer-Voll-Probe 60→50 mit `agentHint
P10..P59`-Verdrängung, subscribe/unsubscribe-Counter, clear, `read()`-
Snapshot-Schema mit Sub-(e)-Hook, ungültige Einträge fail-soft.
Alle 12 Inline-`<script>`-Blöcke in `tests/manual_check.html`
syntaktisch grün.

### 5. Doku-Nachzug

- `status.json` `membranBacklog[0].score` `"spec"` → `"stub"`;
  Pie-Block via `python3 scripts/update_puls_pie.py` aktualisiert
  (8 Code-Stubs statt 7).
- `docs/PULS.md` Tabellenzeile 15 + ausführlicher Sitzungs-Eintrag
  oben.
- `docs/components/15_membran.md` Bauzustand-Tabelle erweitert
  („Code geschrieben" mit Datum + Detail; „Sichttest" als
  „ungeprüft, wartet auf Klaus' Browser-Lauf"; „In Endknoten
  eingebaut" verweist auf Folge-Pflege Karte 09 § Schritt 10).

## Was offen blieb

- **Sichttest in Klaus' Browser** — Panel 15 Setup + Tests 1–7
  (DeX-Chrome Galaxy Tab S6) + Sage-Page-Navleisten-Sichttest.
  Bau-Sitzung 15 endet ausdrücklich mit „ungeprüft, wartet auf
  Klaus' Browser-Lauf".
- **SW-Erweiterung in `src/sbkim-sw.js`** für endpoint-probe-Detektor
  — eigene Bau-Sitzung 15.SW. Page-Seite ist vorbereitet, sobald
  15.SW den SW-Listener nachzieht.
- **Sub (a) finale Spec** — Spec-Sitzung 15.B.
- **Sub (b) Bedienungs-Pfad** — Spec-Sitzung 15.B.
- **Modul 09 § Schritt 10** — eigene Folge-Pflege Karte 09 für
  Membran-Allowlist + Lampe in PWA-Header.

## Nächster sinnvoller Schritt

Klaus-Sichttest in DeX-Chrome auf Galaxy Tab S6:

1. **Panel 15** in `tests/manual_check.html` öffnen — Setup + Tests
   1–7 nacheinander klicken; jeder Test schreibt `OK` (grüne
   Pille) in seine Statusleiste und JSON-Detail in den `<pre>`-
   Output.
2. **Sage-Page** (`index.html`) öffnen — Navleiste oben rechts
   prüfen: nach `lebt` + `verkehr` muss eine dritte Lampe `fremd`
   stehen (default dunkel). In Eruda / DevTools-Konsole:
   `SbkimMembrane.fremdzugriff._recordForTest({kind:"membrane-read", decision:"accepted"})`
   — Lampe wird rot mit Atmung + kurzem Puls; Klick auf Lampe
   öffnet Modal mit Tabelle (1 Zeile). Weiterer `_recordForTest`-
   Aufruf fügt Zeile live nach. `Aufräumen`-Knopf leert Tabelle +
   nimmt Lampe aus. Esc / Backdrop / ✕ schließen Modal.

Sobald Sichttest grün → Folge-Pflege Karte 09 § Schritt 10 + Folge-
Bau 15.SW SW-Sender für endpoint-probes.

## Commit + Push

- Commit: „Bau 15: Modul Membran Sub (e) Fremdzugriff-Detektor +
  Navleisten-Lampe" (Code + index.html + Panel 15 + Doku in einem
  Commit, weil eng gekoppelt).
- Push auf `claude/bau-15-membran-fremdzugriff-RIl3a`.
- Draft-PR anlegen.
