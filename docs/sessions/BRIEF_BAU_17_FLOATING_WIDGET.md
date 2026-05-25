# Brief — Bau-Sitzung 17 Floating-Widget

**Anlass:** Spec-Sitzung 17 vom 2026-05-25 hat die Karte 17 voll
spezifiziert (PR „Spec-Sitzung 17 Floating-Widget", Pipeline-Schritt
5b). Bau-Sitzung 17 ist Pipeline-Schritt 5c — baut
`src/modules/17_floating_widget.js`, verdrahtet die fünf Pflicht-
Custom-Events in Modul 02/05/15/16, baut Panel 17 in
`tests/manual_check.html`.

**Vor App-Freigabe pflichtig** (Pipeline-Schritt 5d Endknoten-Re-
Migration setzt voraus, dass Modul 17 gebaut + sichtgetestet ist).

**Klaus-Festlegung 2026-05-25 (Tafel-Evolutions-Klausel):**

- Vier-Slot-Live-Status-Dashboard (LEBT/VERKEHR/FREMD/SIEGEL) statt
  zwei Plaketten — siehe Karte 17 § Vier-Slot-Layout.
- Sage-Page behält Navleisten-Lampen + Siegel-Badge (sage-page-
  spezifischer Pfad), Endknoten bekommen das Widget.
- Modul-15-+-16-Backends bleiben unverändert.

**Branch-Vorschlag:** `claude/bau-17-floating-widget`

**Voraussetzungen:**

- Karte 17 + INTERFACES.md § 1 Modul 17 verbindlich auf main (Stand
  2026-05-25 nach Spec-Sitzung 17).
- Modul 15 + 16 Code-Stubs liegen (PR #159 + PR #152 + PR #154 alle
  gemerged) — bleiben Backends, werden NICHT umgeschrieben.

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung)

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Bau-Sitzung 17 Floating-Widget. Pipeline-Schritt 5c
(CLAUDE.md § Pipeline-Reihenfolge). KEIN Endknoten-Eingriff,
KEIN Sage-Page-Eingriff (Sage-Page behält Navleisten-Lampen, Klaus-
Festlegung 2026-05-25).

Branch: claude/bau-17-floating-widget (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md komplett (§ Pipeline-Reihenfolge, § Heilige Tafeln, §
   Sicherheits-Module pflegen Aspekte).
2. docs/PULS.md jüngste 2026-05-25-Sitzungs-Einträge.
3. docs/components/17_floating_widget.md KOMPLETT (~570 Zeilen, alle
   Spec-Punkte — Vier-Slot-Layout, Event-Bus-Schema, UX-Regeln,
   strikte Tabus, Bauzustand).
4. docs/INTERFACES.md § 1 Modul 17 KOMPLETT.
5. docs/INTERFACES.md § 1 Modul 02 + 05 + 15 + 16 Events-Blöcke
   (dort sind die zu dispatchenden Custom-Events spezifiziert).
6. src/modules/15_membran.js + src/modules/16_siegel.js Selbstcheck-
   Zeilen + init()-Signaturen + Modal-Mount-Pattern (Karte 15 § Sub
   (e) Modal-Mount-Pfad, Karte 16 § Sub (c) Modal-Mount).
7. src/modules/02_spore.js init() + getOrCreateIdentity() Endstelle
   (für den sbkim:alive-Hook).
8. src/modules/05_anastomose.js handshake() + receiveHandshake() —
   Endstellen pro outcome (für den sbkim:handshake-Hook).
9. tests/manual_check.html Panel-15- und Panel-16-Layout-Pattern
   (für Panel-17-Aufbau).

Deine Aufgabe (in dieser Reihenfolge):

A. **Modul-Datei `src/modules/17_floating_widget.js` schreiben.**
   IIFE-Pattern wie andere Module (00/01/02/04/05/06/07/08/15/16).
   Public Surface auf `window.SbkimWidget` = {init, show, hide,
   isVisible, getPosition, _meta}. Implementation:

   - **init(options?)**: idempotent. Liest localStorage für
     `sbkim_widget_visible` + `sbkim_widget_position`. Mountet die
     Pille in `document.body` (MutationObserver-Re-Try wenn body
     noch nicht da, analog Modul 00). Injiziert Standalone-CSS via
     `<style>`-Element ans Ende von `<head>` (KEIN Shadow-DOM in
     Stufe 1 — Spec-Empfehlung Karte 17 § Layout, weil bestehende
     Modul-15-/16-Modals in document.body mounten). Registriert
     fünf Event-Listener auf `window` (`sbkim:alive` / `:handshake` /
     `:postmessage` / `:fremd-alert` / `:siegel-certified`).
     Default-Position bottom-right + 16 px Abstand, wenn keine
     localStorage-Position vorhanden.
   - **show() / hide() / isVisible()**: sync, mit localStorage-
     Persistenz (außer bei `rememberHidden:false`).
   - **getPosition()**: sync, defensive Kopie.
   - **_meta**: Read-Anker für Tests — slots[], eventCounts,
     trafficLogSize, widgetMounted, firstBootShown.

   Vier-Slot-DOM (alle vier im DOM, Ausnahme SIEGEL bei
   `isCertified()===false` — dann nicht gemountet):
   - `<button id="sbkim-widget-slot-lebt" class="sbkim-widget-slot lebt">`
   - `<button id="sbkim-widget-slot-verkehr" class="sbkim-widget-slot verkehr">`
   - `<button id="sbkim-widget-slot-fremd" class="sbkim-widget-slot fremd">`
   - `<button id="sbkim-widget-slot-siegel" class="sbkim-widget-slot siegel">`
     (Letzteres nur wenn `sbkim:siegel-certified` gefeuert hat
     UND `SbkimSiegel.isCertified() === true` zum Render-Zeitpunkt.)

   Drag-Mechanik via Pointer-Events (Karte 17 § Drag-Mechanik).
   X-Knopf oben-rechts der Pille. Modal-Bridge für FREMD/SIEGEL via
   Proxy-Click auf `#lamp-fremd` / `#sbkim-siegel-badge` falls im
   DOM (fail-soft via typeof / querySelector-null-Check).

   Neue Modals (Modul 17 baut selbst):
   - **LEBT-Modal**: einfaches kleines Modal in document.body mit
     Uptime-Counter (ms seit `sbkim:alive`), Modul-02-Init-Status
     (boolean), nodeId-Präfix (erste 12 Zeichen). Backdrop + Esc +
     ✕ schließen.
   - **VERKEHR-Modal**: zeigt RAM-only FIFO 10 der letzten
     `sbkim:handshake` + `sbkim:postmessage`-Events. Tabelle mit
     [Zeit, Quelle, Richtung, Decision]. Backdrop + Esc + ✕.

   KEINE benannten Error-Klassen (Render-Schicht, fail-soft via
   `console.warn`). Selbstcheck-Zeile am Skript-Ende:
   `console.info("MODUL 17 FLOATING-WIDGET bereit, Funktionen:
   init/show/hide/isVisible/getPosition");`

B. **DispatchEvent-Hooks in Modul 02/05/15/16 einbauen.**
   Pro Modul jeweils EINE Zeile ergänzen (additiv, KEIN
   Refactoring der Public-Surface):

   - **src/modules/02_spore.js**: am Ende von `getOrCreateIdentity()`
     (nach erfolgreicher Identitäts-Erzeugung + Storage-Persistenz),
     einmaliger Flag-Schutz (`if (!aliveDispatched)`), dann
     `window.dispatchEvent(new CustomEvent("sbkim:alive",
     { detail: { since: new Date().toISOString(), nodeId: <nodeId> }}))`.
     Selbstcheck-Zeile unverändert lassen.
   - **src/modules/05_anastomose.js**: am Ende von `handshake()`
     (nach Result-Resolve, vor return), `window.dispatchEvent(new
     CustomEvent("sbkim:handshake", { detail: { outcome:
     result.outcome, peerNodeId: result.peerNodeId || null,
     direction: "outgoing" }}))`. Analog am Ende von
     `receiveHandshake()` mit `direction: "incoming"`.
   - **src/modules/15_membran.js**:
     - **Sub (b)**: in der Empfänger-Kette NACH Allowlist + Schema +
       Replay-Dedupe (an der Stelle, wo `decision` final feststeht),
       `window.dispatchEvent(new CustomEvent("sbkim:postmessage",
       { detail: { op: data.op, direction: "incoming", decision }}))`.
     - **Sub (e)**: in `recordEntry(entry)` NACH dem Buffer-Push und
       Listener-Aufruf, `window.dispatchEvent(new CustomEvent(
       "sbkim:fremd-alert", { detail: { kind: entry.kind, decision:
       entry.decision, bufferSize: buffer.length }}))`.
   - **src/modules/16_siegel.js**: am Ende von `init()` (nach
     `metaSnapshot` gesetzt + Badge-Render), wenn
     `metaSnapshot.isCertified === true`, einmaliger Flag-Schutz,
     dann `window.dispatchEvent(new CustomEvent(
     "sbkim:siegel-certified", { detail: { certifiedAt:
     metaSnapshot.certifiedAt, repoUrl: metaSnapshot.repoUrl }}))`.

   PII-Disziplin streng nach Karte 17 § Event-Bus-Schema:
   - Detail-Form nur Counts + Status-Flags + IDs.
   - KEINE Spore-Inhalte, KEINE query-text, KEINE hint-vector,
     KEINE postMessage-payload, KEIN navigator.userAgent.
   - peerNodeId in sbkim:handshake ist Klartext (Andocker sieht ihn
     ohnehin in sbkim_siblings).

C. **Standalone-CSS im Widget-Modul.**
   CSS wird via `<style>`-Element bei `init()` ans Ende von
   `<head>` injiziert (KEINE externe CSS-Datei, KEIN inline-style
   im DOM-Element). Konvention:

   - CSS-Variablen modul-lokal mit Präfix `--sbkim-widget-*`
     (`--sbkim-widget-bg`, `--sbkim-widget-fg`, `--sbkim-widget-accent`,
     etc.). KEIN `:root`-Eingriff.
   - Vier-Slot-Layout: flex-Container, 4 Slot-Buttons à 40 px,
     4 px Gap. Pille ~ 200 × 48 px. X-Knopf oben-rechts ~ 12 px.
   - Theme-Support: `prefers-color-scheme: dark` als Default. Option
     `theme:"dark"|"light"` überschreibt via Klasse am Pillen-Element.
   - Animation-Klassen: `.lebt-pulse` (Atmung, ähnlich
     `.lamp-breath` aus Sage-Page-CSS — aber MODUL-LOKAL, KEIN
     Import), `.verkehr-pulse` (kurzer Gold-Puls,
     `--sbkim-widget-pulse-ms`), `.fremd-alert` (Dauer-Rot mit
     Glow), `.fremd-pulse` (Puls bei Neueintrag), `.siegel-first-boot`
     (600 ms First-Boot-Animation einmalig pro Session — analog
     Modul 16).
   - Z-Index: 9990 (überschreibbar via `init({zIndex})`).

D. **Panel 17 in `tests/manual_check.html`.**
   Zehn Test-Knöpfe analog Panel 15/16 (Karte 17 § Manueller Test):

   1. Setup (`SbkimWidget.init({})`, Slots-Output, `_meta`-Dump).
   2. LEBT-Slot grün (`window.dispatchEvent(new CustomEvent(
      "sbkim:alive", { detail: {...} }))`, Slot prüfen).
   3. VERKEHR-Slot pulst (drei Events feuern, Slot-Pulse +
      Mini-Log-Inhalt prüfen).
   4. FREMD-Slot rot (zwei `sbkim:fremd-alert`-Events,
      Slot-Zustand + bufferSize prüfen).
   5. SIEGEL-Slot erscheint mit Modul-16-Stub (window.SbkimSiegel
      mocken, `sbkim:siegel-certified` feuern).
   6. SIEGEL-Slot erscheint NICHT bei `isCertified()===false`.
   7. Drag funktioniert (Pointer-Events simulieren, Position +
      localStorage prüfen).
   8. X-Schließen + Reload-Wiederherstellung (Klick auf X,
      localStorage-Wert prüfen).
   9. Wiederherstellung via `SbkimWidget.show()`.
   10. Slot-Whitelist (`init({slots:["lebt","siegel"]})`, andere
       Slots fehlen).

   Setup-Block sollte einen optionalen „Mock-Modul-16-Stub
   anlegen"-Knopf bieten, damit Test 5 + 6 ohne echtes Modul 16
   im Panel 17 laufen können.

E. **ZERTIFIKAT_ASPEKTE-Eintrag in Modul 16.**
   CLAUDE.md § „Sicherheits-Module pflegen Aspekte" verlangt, dass
   spätere Sicherheits-Module einen Aspekt-Eintrag ergänzen. Modul
   17 ist **kein** Sicherheits-Modul (Render-Schicht); trotzdem
   sinnvoll für die Sichtbarmachung im Siegel-Modal, weil das
   Widget die Live-Schau-Schicht für die anderen Sicherheits-Module
   ist. **Empfehlung:** einen Eintrag ergänzen:

   ```js
   {
     since:       "2026-05-25",
     module:      "17",
     aspect:      "Floating-Widget mit Vier-Slot-Live-Status",
     description: "Live-Status-Dashboard (LEBT/VERKEHR/FREMD/SIEGEL) als Endknoten-Standard; macht den SBKIM-Lauf sichtbar ohne Navleisten-Mount-Pflicht.",
   },
   ```

   Klärung: Spec-Sitzung 17 hat diesen Aspekt NICHT ergänzt (kein
   Code-Eingriff). Bau-Sitzung 17 entscheidet final.

F. **Headless-Smoke-Test schreiben.**
   `tests/smoke_bau17_floating_widget.mjs` analog
   `tests/smoke_bau15b_membran.mjs`. Node `vm.createContext` mit
   DOM-Stub. Mindestens 15 Probe-Punkte (Slot-Mount pro Slot, Event-
   Detail-Schema-Check pro Event, localStorage-Persistierung,
   Anti-Greenwashing SIEGEL ohne isCertified, Modal-Bridge fail-soft
   wenn #lamp-fremd fehlt, VERKEHR-FIFO max 10, Drag-Position-
   Persistierung, show/hide/isVisible-Idempotenz, Selbstcheck-Zeile).
   Smoke-Test muss vor Sichttest grün laufen (analog Bau 15.B 31/31
   grün vor Sichttest).

Was du nicht tust:

- KEINE Sage-Page-Änderung (`index.html` unangetastet — Sage-Page
  behält Navleisten-Lampen + Siegel-Badge).
- KEINE Endknoten-Sitzung (extern, eigene Folge-Sitzung pro Repo).
- KEINE Karte-09-Vereinfachung (eigene Folge-Pflege nach dieser
  Bau-Sitzung).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump
  (Modul 17 ist nicht protokoll-aktiv).
- KEINE neuen IndexedDB-Stores. Nur localStorage für UX-
  Preferences.
- KEINE Tafel-Umsortierung CLAUDE.md.
- KEIN Refactoring der bestehenden Public-Surface von Modul
  02/05/15/16 (nur additive dispatchEvent-Zeilen). Selbstcheck-
  Zeilen MÜSSEN unverändert bleiben.
- KEIN Override der Modul-15-/16-Modals.
- KEIN Auto-Render des SIEGEL-Slots ohne `isCertified()===true`
  (Anti-Greenwashing binär).

Pflicht am Ende:

- `src/modules/17_floating_widget.js` voll angelegt + Selbstcheck.
- `node --check src/modules/17_floating_widget.js` grün.
- DispatchEvent-Hooks in Modul 02/05/15/16 (vier Code-Stellen
  additiv). Selbstcheck-Zeilen UNVERÄNDERT.
- `node --check` für alle vier modifizierten Module grün.
- Panel 17 in `tests/manual_check.html` mit 10 Test-Knöpfen +
  Selbstcheck-Hinweis. Alle Inline-`<script>`-Blöcke `node --check`-
  validiert.
- Headless-Smoke `tests/smoke_bau17_floating_widget.mjs` grün
  (≥ 15/15).
- ZERTIFIKAT_ASPEKTE-Eintrag in `src/modules/16_siegel.js` ergänzt
  (siehe Pflicht-Konvention CLAUDE.md § Sicherheits-Module pflegen
  Aspekte — Spec-Sitzung 17 hat diesen Aspekt offen gelassen,
  Bau-Sitzung 17 entscheidet final).
- Karte 17 § Bauzustand-Tabelle um Zeile „Code geschrieben |
  2026-MM-DD | Bau-Sitzung 17 | ..." erweitert.
- INTERFACES.md § 1 Modul 17 Status-Zeile + Geprüft-Zeile um
  Bau-Sitzung 17 erweitert.
- INTERFACES.md § 1 Modul 02/05/15/16 Events-Block-Hinweise
  aktualisieren (von „Vorbestellung" auf „live").
- INTERFACES.md § 10 Änderungsprotokoll-Eintrag.
- status.json § modules[] Modul-17-Eintrag: `score:"stub"`,
  `siegel:"Code-Stub"`. `python3 scripts/update_puls_pie.py`
  aufrufen.
- CLAUDE.md § Modul-Tabelle Eintrag 17 aktualisieren (von „Spec
  fertig" auf „Code-Stub").
- PULS.md Sitzungs-Eintrag oben.
- Übergabeprotokoll
  `docs/sessions/archiv/YYYY-MM-DD_bau-17-floating-widget.md`.
- Commit + Push auf `claude/bau-17-floating-widget`.
- Draft-PR anlegen.
- „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort
  (Sichttest 17 + Endknoten-Re-Migration + Karte 09 schrumpfen).
- Brief-Codeblock für Sichttest-Sitzung 17 (oder Endknoten-Re-
  Migration) im Chat ausgeben (Konvention CLAUDE.md Pflicht-6).
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Bau-Sitzung
liest)

### Warum die fünf dispatchEvent-Hooks im selben PR

Wer die vier Hooks (Modul 02 alive, Modul 05 handshake, Modul 15 Sub
b postmessage + Sub e fremd-alert, Modul 16 siegel-certified) in
**separaten** Mini-Pflege-Sitzungen baut, sieht im Sichttest 17 vier
graue Slots — das Widget ist da, aber blind. Klaus' Sichttest-Pflicht:
mindestens drei der vier Slots müssen bei normalem Andock-Lauf
leuchten (LEBT direkt nach Page-Load, VERKEHR bei jedem Channel-
Handshake, SIEGEL einmalig bei Page-Load). FREMD bleibt sage-page-
typisch grau (kein realer Fremdzugriff im DeX-Chrome-Setup ohne
externen Browser-Agent). Empfehlung: Hooks **in der Bau-Sitzung 17
mit-erledigen** — ein PR, ein Sichttest, alle Slots live.

### Endknoten-Einbau ist NACH Bau 17

Pipeline-Schritt 5d (Endknoten-Re-Migration) läuft pro Endknoten-Repo
als eigene Sitzung. Drei-Zeilen-Einbau-Anweisung in Karte 09 § Schritt
12 (neu, eigene Folge-Pflege nach Bau 17). Endknoten-Bau-Sitzungen
sind extern (Mein-Rezeptbuch + Mein-Mixarium + ggf. weitere) und
brauchen Klaus' Browser-Sichttest pro Repo.

### Modal-Bridge ist die heikelste Stelle

Modul 15 + 16 mounten ihre Modals bei click auf `#lamp-fremd` /
`#sbkim-siegel-badge`. Wenn das Widget in `<body>` mountet, gibt es
**keinen** `#lamp-fremd`-DOM-Element auf einer Endknoten-PWA, die
das Widget verwendet (Endknoten haben nur das Widget, KEINE
Navleisten-Lampe — sonst wäre das Doppel-UX). Konsequenz: Bau-
Sitzung 17 muss die Modal-Bridge so bauen, dass Modul 15 + 16
**ihre Modals direkt mounten** können, ohne `#lamp-fremd` /
`#sbkim-siegel-badge` zu brauchen. Drei Optionen:

1. **Proxy-DOM-Element im Widget:** Widget legt unsichtbare Spans
   `<span id="lamp-fremd">` + `<span id="sbkim-siegel-badge">` in
   seinem Inneren an (visibility:hidden). Modul 15 + 16 mounten ihre
   Modals normal — der Click kommt vom Widget per Proxy-Click.
   **Empfehlung Bau-Sitzung 17.**
2. **Neue Public-API auf Modul 15 + 16:** `SbkimMembrane.openFremdModal()`
   + `SbkimSiegel.openModal()`. Sauberer, aber Modul-15-+-16-Spec-
   Erweiterung — eigene Spec-Sitzung wäre fällig.
3. **Modul 17 baut die Modals selbst:** Würde Modul-15-/16-Modal-
   Code duplizieren. Anti-DRY.

Spec-Sitzung 17 hat die Entscheidung offen gelassen (Karte 17 § Modal-
Bridge). **Bau-Sitzung 17 entscheidet final** und dokumentiert die
Wahl in der Karte 17 § Bauzustand-Zeile.

### Nach dieser Bau-Sitzung

1. **Sichttest 17** — Klaus, Panel 17 in `tests/manual_check.html`
   am Tablet (DeX-Chrome, Galaxy Tab S6). Zehn Test-Punkte plus
   Sage-Page-Bonus-Check (vier Plaketten in der Navleiste bleiben).
2. **Endknoten-Re-Migration mit Widget** — neuer kleinerer Brief
   `BRIEF_BAU_ENDKNOTEN_MIGRATION_WIDGET.md` ODER additive
   Erweiterung des bestehenden Briefes. Drei Zeilen pro Endknoten.
3. **Pflege Karte 09 § Schritt 10 + 11 schrumpfen + Schritt 12 anlegen.**
   Eigene Mini-Pflege-Sitzung.
4. **Klaus' App-Freigabe** — drei Apps mit Floating-Widget öffentlich
   verteilen.

### Optionale Folge-Pflegen (außerhalb dieser Bau-Sitzung)

- **Modul 00 Doku-Fenster + Widget-Wiederherstellung verknüpfen**
  (5-Klick-Geste am Such-Symbol öffnet beide). Eigene Pflege-Sitzung.
- **Eruda-Kollisions-Erkennung** (typof `window.eruda !== "undefined"` →
  automatisch `defaultCorner:"bottom-left"`). Eigene Mini-Pflege.
- **Mobile-spezifische Variante** (< 480 px: 36 px Slots vs. eigener
  Karussell-Modus). Eigene Folge-Pflege.
