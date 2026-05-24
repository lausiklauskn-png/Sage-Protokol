# Brief — Bau-Sitzung 15 Membran (Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe)

**Anlass:** Spec-Sitzung 15 vom 2026-05-24 hat Sub (e) vollständig
spezifiziert (Karte 15 + INTERFACES.md §0 + §1-Modul-15-Block).
Diese Bau-Sitzung implementiert das Modul, hängt die Lampe in
`index.html` ein und baut Panel 15 in `tests/manual_check.html`.

**Branch (Vorschlag):** `claude/bau-15-membran-fremdzugriff` (oder
auf Klaus' Wahl ein anderer kurzer Branch-Name).

**Voraussetzungen:**

- Spec-Sitzung 15 ist gemerged (PR mit Karte 15 + INTERFACES.md +
  status.json `score:"spec"`).
- **Sage-Page-Refactor** (`BRIEF_BAU_SAGE_PAGE_REFACTOR.md`,
  PR #125 gemerged 2026-05-21) ist Stand `main` — Lampe ist additiv,
  Refactor wäre konfliktreicher zuerst.
- Keine parallele offene PR-Schicht im `index.html`-Lampen-Bereich
  rund um Zeile 700 (`<div class="lamps">`).

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung)

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md (Schnellüberblick + jüngster Sitzungs-Eintrag 2026-05-24 Spec-Sitzung 15)
3. docs/INTERFACES.md (§ 0 Konstante MEMBRANE_FREMDZUGRIFF_BUFFER_MAX + § 1 Modul-15-Block)
4. docs/components/15_membran.md (Sub (e) komplett; Sub (a)+(b) Grob-Spec — nur Sub-(e)-Hook-Stellen relevant)
5. index.html (NUR Zeile ~15-40 :root-Block + Zeile ~110-118 .lamps/.lamp-CSS + Zeile ~700-705 Navleisten-DOM; KEIN Ganz-Datei-Lesen)
6. src/modules/08_ui_demo.js (NUR als Code-Stil-Vorbild für Factory-Error-Klassen / Test-Brücken-Pattern / Closure-Struktur — kein Inhalt übernehmen)
7. tests/manual_check.html (NUR Panel 08 als Vorbild für neues Panel 15 — Setup-Knopf + nummerierte Test-Knöpfe + <pre>-Output-Pattern)

Deine Aufgabe:

PRIMÄR — Sub (e) Bau (Pflicht):

1. **`src/modules/15_membran.js` neu anlegen** mit der API aus
   INTERFACES.md § 1 Modul 15:
   - `window.SbkimMembrane = { init, read, fremdzugriff: {list, subscribe, clear, _recordForTest} }`
   - **Sub (e) komplett implementieren** (Ringbuffer, Listener-Liste,
     Lampen-Toggle, Modal-Mount, Click-Handler, BroadcastChannel-
     Subscription für endpoint-probes vom SW).
   - **Sub (a) `read()`-Skelett** mit Sub-(e)-Hook (Eintrag mit
     `kind:"membrane-read"`); Snapshot-Felder fail-soft aus
     SbkimSpore / SbkimAnastomose / SbkimStorage._meta / navigator.storage
     (alle optional, null bei Fehlern). Finale Feld-Spec wartet auf
     Spec-Sitzung 15.B — Bau-Sitzung 15 baut die Minimal-Skelett-
     Variante aus Karte 15 § Sub (a) Anker-Form.
   - **Sub (b) postMessage-Listener-Skelett** mit Sub-(e)-Hook
     (Eintrag mit `kind:"membrane-postmessage"`, `decision` aus
     Allowlist-Check). Allowlist aus `init({allowedOrigins})`-Option;
     leere Liste = alle Cross-Origin-Messages werden als
     `rejected-allowlist` eingetragen + verworfen. Bedienung (Antwort
     senden) bleibt Spec-Sitzung 15.B vorbehalten — Stufe 1 reicht das
     Filter + Sub-(e)-Eintrag.
   - **Selbstcheck-Zeile** beim Skript-Laden:
     `console.info("MODUL 15 MEMBRAN bereit, Funktionen: init/read/fremdzugriff.{list,subscribe,clear,_recordForTest}");`
   - KEINE benannten Error-Klassen für Sub (e) (rein beobachtend,
     fail-soft via console.warn).
   - Modul-lokale Konstanten: `AGENT_HINT_MAX_LEN = 64`.
   - `node --check src/modules/15_membran.js` muss grün sein.

2. **`index.html` Lampen-Eingriff** (drei kleine additive Schritte):
   - `:root`-Block: `--lamp-alert: #DC2626;` ergänzen.
   - CSS: zwei neue Regeln `.lamp.fremd-alert { … }` (analog
     `.lamp.alive` mit `--lamp-alert` + Glow) und `.lamp.fremd-pulse
     { animation: lamp-pulse var(--lamp-pulse-ms) ease-out; }`
     (oder eigene `@keyframes` mit roter Farbe).
   - DOM in `<div class="lamps">` direkt nach `#lamp-traffic`
     ergänzen:
     ```html
     <span class="lamp" id="lamp-fremd" title="Fremdzugriff — rot bei Zugriff von außen (Klick öffnet Liste)"></span>
     <span class="lamp-label">fremd</span>
     ```
   - Beim Page-Load `SbkimMembrane.init({ lampSelector: '#lamp-fremd' })`
     aufrufen (im bestehenden Init-Script-Block der Sage-Page, mit den
     anderen SBKIM-init-Calls).

3. **Modal-Mount + Click-Handler** (im Modul, nicht in `index.html`):
   - `mountFremdzugriffModal()` als Closure-Helper: erzeugt ein
     verstecktes `<div>` in `document.body` mit Backdrop, Header,
     Aufräumen-Knopf, Tabelle, ✕-Knopf.
   - Click auf Lampe → Modal anzeigen + initialer
     `list()`-Snapshot rendern + `subscribe(cb)` für Live-Updates;
     beim Schließen `unsubscribe()`.
   - Esc + Backdrop-Klick + ✕-Klick alle drei schließen.
   - Aufräumen-Knopf ruft `clear()` → Tabelle wird leer + Lampe
     erlischt; Modal bleibt offen (Klaus sieht den Aufräum-Erfolg).

4. **`tests/manual_check.html` Panel 15 ergänzen** (analog Panel 08):
   - Setup-Knopf: `SbkimMembrane.init({ lampSelector: '#fake-lamp' })`
     mit einem versteckten `<span id="fake-lamp">` im Panel (damit
     Sub (e) lampSelector-Hook ohne Sage-Page-Lampe testbar ist;
     Sub-(e)-Toggle wird im Browser-DevTools sichtbar via
     classList).
   - Test 1: `_recordForTest({...})` mit drei Test-Einträgen
     (`membrane-read`, `membrane-postmessage`, `endpoint-probe`) →
     `list()`-Output sollte drei Einträge zeigen, älteste zuerst.
   - Test 2: `subscribe(cb)` registrieren, einen weiteren
     `_recordForTest` triggern → Counter inkrementiert.
   - Test 3: `clear()` → `list()` leer.
   - Test 4: Ringbuffer-Voll-Probe — 60 `_recordForTest`-Einträge,
     `list().length` sollte exakt `MEMBRANE_FREMDZUGRIFF_BUFFER_MAX`
     (50) sein, die ältesten 10 verdrängt.
   - Test 5: Sub (a) `read()` → Sub-(e)-Buffer hat einen Eintrag mit
     `kind:"membrane-read"`.
   - Test 6: Sub (b) — `window.postMessage({type:"sbkim/membrane/v1", op:"sporeRef", ...}, "*")`
     vom Panel aus (same-origin, da Test-Page selbst) → KEIN Eintrag
     (same-origin). Dann via `iframe`-Test oder mit
     `window.dispatchEvent(new MessageEvent('message', {origin: 'https://foo.example', data: {...}}))`
     einen Fremd-Origin simulieren → Eintrag mit
     `decision:"rejected-allowlist"` (Allowlist war leer beim Setup).
   - Test 7 (Bonus): Init mit `allowedOrigins: ["https://foo.example"]`
     → derselbe Fremd-Origin-MessageEvent → Eintrag mit
     `decision:"accepted"` oder `"ignored"` (je nach `data.type`).
   - Selbstcheck-Hinweis: in der Browser-Console steht
     `MODUL 15 MEMBRAN bereit …`.

SEKUNDÄR — wenn Zeit + Token reichen:

5. **`src/sbkim-sw.js` Erweiterung für endpoint-probe-Detektor**
   (Sub (e) SW-Hook): neuer Listener auf `fetch`-Events für die
   SBKIM-Endpunkte, der via `BroadcastChannel('sbkim-membrane')` einen
   `SBKIM_MEMBRANE_PROBE`-Eintrag postet, wenn Cross-Origin-Referer /
   Sec-Fetch-Site != "same-origin" erkannt wird. Falls Token knapp
   werden, ALS EIGENE SW-Bau-Sitzung 15.SW ausgliedern — der
   Page-seitige BroadcastChannel-Listener im Modul ist dann schon
   bereit, der SW-Sender kommt nach.

ZURÜCKGEHALTEN — diese Bau-Sitzung NICHT:

- Sub (a) finale Feld-Liste (Spec-Sitzung 15.B).
- Sub (b) Bedienungs-Pfad (Antwort senden, op:"sporeRef"-Semantik,
  op:"query"-Brücke zu Modul 04 — Spec-Sitzung 15.B).
- Sub (c) Capability-Token (Spec-Sitzung 15.C).
- Sub (d) Backup-Datei (existiert bereits in Modul 02 Bau 02.X).
- Endknoten-Migration (Modul 09 § Schritt 10 — eigene Folge-Sitzung
  nach Bau-Sitzung 15).

Was du nicht tust:
- Kein Eingriff in Modul-Karten 00/01/02/03/04/05/06/07/08/09 (nur
  Querverweis-Bullets am Ende von Karte 15 aktualisieren falls nötig
  — die standen schon).
- Kein neuer Storage-Store (Persistenz RAM-only laut Spec).
- Kein `DB_VERSION`-Bump in Modul 01.
- Kein `PROTOCOL_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.
- Kein Eingriff in das Empfangsmodus-Prinzip — Sub (e) ist und bleibt
  passiv beobachtend.

Wenn die Spec lückenhaft ist:
- HALTE AN. Schreibe die offene Frage in PULS.md ans Ende und ende
  die Sitzung. Eine Spec-Klärung ist kein Bau-Job.

Pflicht am Ende:
- src/modules/15_membran.js angelegt (Sub (e) komplett + Sub (a)+(b) Skelett mit Sub-(e)-Hooks)
- index.html um drei kleine additive Eingriffe erweitert (--lamp-alert + zwei CSS-Klassen + Lampen-Span + Label)
- tests/manual_check.html Panel 15 ergänzt mit Setup + ≥6 Test-Knöpfen
- Sichttest durch Klaus VORGEMERKT (headless Bau, wartet auf Klaus' Browser-Lauf am Tablet)
  ODER explizit als "ungeprüft, weil ..." markiert
- Karte 15 § Bauzustand-Tabelle Zeile "Code geschrieben" mit Datum
- INTERFACES.md § 1 Modul 15 Status: entwurf → entwurf (Code-Stub) ODER ergänzt um Geprüft-Datum
- status.json membranBacklog[0].score "spec" → "stub" (wenn Sub (e) komplett implementiert ist),
  dann python3 scripts/update_puls_pie.py aufrufen
- PULS.md-Tabellenzeile 15 nachgezogen + Sitzungs-Eintrag oben
- Übergabeprotokoll in docs/sessions/archiv/YYYY-MM-DD_bau-15-membran-fremdzugriff.md
- Commit + Push auf claude/bau-15-membran-fremdzugriff
- Brief-Codeblock für die nächste Sitzung (typisch: Sichttest-Folge oder Spec-Sitzung 15.B)
  in der Chat-Antwort wortwörtlich ausgeben (CLAUDE.md § Pflicht am Sitzungsende Punkt 6)
- "Vorgeschlagene nächste Schritte"-Block in der finalen Chat-Antwort
```

---

## Hintergrund (für Klaus)

**Was die Bau-Sitzung NICHT entscheidet:** ob der Detektor echte
Gemini-3.5-Flash-Aufrufe erkennt. Das ist Sichttest am Tablet, mit
einem KI-Browser-Agent, der auf Klaus' Sage-Page läuft — und nur er
kann das testen.

**Was die Bau-Sitzung LIEFERT:** einen lauffähigen Sub-(e)-Detektor
mit Lampe und Modal, der für jeden synthetischen oder echten
Fremdzugriff einen Eintrag in einen Ringbuffer schreibt, die Lampe
rot setzt und ein Modal-Fenster mit der Liste zeigt. Plus das
Skelett für Sub (a) Read-API und Sub (b) postMessage-Listener, damit
ein KI-Browser-Agent eine echte Read-API findet und seine
postMessages registriert werden.

**Reihenfolge der Folge-Sitzungen:**

1. **Diese Bau-Sitzung 15** — Sub (e) Code + Lampe + Panel 15.
2. **Sichttest** durch Klaus am Tablet (DeX-Chrome + Tablet-Chrome,
   beide Browser-Instanzen — siehe `docs/OBSERVATORIUM_BROWSER.md`).
3. **Optional: SW-Bau-Sitzung 15.SW** für endpoint-probe-Detektor in
   `src/sbkim-sw.js` (falls in Bau-Sitzung 15 ausgelagert).
4. **Spec-Sitzung 15.B** (Sub (a)+(b) finale Spec) — wartet auf
   Endknoten-Wunsch.
5. **Einbau-Sitzung 15** in Endknoten-PWAs (Rezeptbuch + Mixarium)
   — analog Modul 09-Pfad. Lampe + Detektor übernehmen, Allowlist im
   Andocker konfigurieren.

**Warum Bau-Sitzung 15 jetzt:** Spec ist fertig, Sage-Page-Refactor
ist gemerged (PR #125), keine offenen parallelen `index.html`-PRs.
Bau ist ~3-4 Stunden headless, schafft sofort sichtbaren Wert für
Klaus (rote Lampe in der Navleiste).
