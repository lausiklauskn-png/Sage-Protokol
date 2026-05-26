# Brief — Bau-Sitzung 16 Sub (e) Bronze/Gold-SIEGEL-Stufung

**Anlass:** Tafel-Spec-Pflege Mycel-Vision 2026-05-26 (PR #175) hat
Karte 16 § Sub (e) Mycel-Verbindungs-Stufe voll spec'd. Bau 04.C
(PR #177) + Sichttest 04.C (PR #178) sind erledigt — die Cross-Knoten-
Such-Lücke ist geschlossen. Jetzt ist Pipeline-Schritt **5g** dran:
das SIEGEL bekommt eine zweistufige Lebendigkeit (Bronze „Mycel
suchend" → Gold „Mycel verbunden").

**Pipeline-Stellung:** Phase A (vor App-Freigabe) — Pipeline-Schritt
5g (siehe CLAUDE.md § Pipeline-Reihenfolge).

**Branch-Vorschlag:** `claude/bau-16-sub-e-bronze`

**Voraussetzungen (alle erfüllt):**

- Tafel-Spec-Pflege Mycel-Vision (PR #175) gemerged → Karte 16 § Sub
  (e) liegt auf `main`.
- Bau 04.C (PR #177) + Sichttest 04.C (PR #178) gemerged → Modul 04
  ist `fertig`, Cross-Knoten-Such-Pattern live.
- Modul 16 ist `score:"stub"` mit voller Code-Stub-Struktur (PR #152
  + #154) — Bau-Sitzung erweitert additiv.
- Modul 05 dispatcht `sbkim:handshake` mit `detail.outcome` (live
  seit Bau 17, `src/modules/05_anastomose.js:294` —
  `dispatchHandshakeEvent`). Listener-Quelle bestätigt.

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung 16 Sub e)

```
Du bist eine Bau-Sitzung in Sage-Protokol.

Sitzungs-Rolle: Bau-Sitzung 16 Sub (e) Bronze/Gold-SIEGEL-Stufung —
Modul 16 wird zweistufig. Bronze („Mycel suchend") wenn Surface-Check
grün, aber noch kein Cross-Knoten-Handshake. Gold („Mycel verbunden")
sobald erster sbkim:handshake outcome:"established" empfangen wird.
Pipeline-Schritt 5g, Phase A vor App-Freigabe.

Branch: claude/bau-16-sub-e-bronze (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md § Heilige Tafeln + § Pipeline-Reihenfolge + § „Sicherheits-
   Module pflegen Aspekte" (Pflicht-Konvention, gilt auch für diese
   Bau-Sitzung — Aspekt 4 hinzufügen).
2. docs/PULS.md jüngsten Sitzungs-Eintrag „Pflege Sichttest 04.C grün"
   und den vorigen „Bau 04.C `queryLocal`".
3. docs/components/16_siegel.md KOMPLETT — § Sub (e) voll spec'd
   2026-05-26 (Z. 444-602), alle anderen Sub-Bereiche liefern Kontext
   (Surface-Check, Badge, Modal, Aspekte).
4. docs/components/05_anastomose.md § Event-Bus-Schema (sbkim:handshake-
   Custom-Event existiert seit Bau 17, KEIN Modul-05-Eingriff nötig).
5. src/modules/16_siegel.js KOMPLETT (additive Erweiterung um Sub e).
6. src/modules/05_anastomose.js § dispatchHandshakeEvent (Z. 290-310)
   — nur LESEN, KEIN Eingriff. Verifiziere dass das Event-Detail-
   Schema `{ outcome, peerNodeId, direction }` ist (Listener-Vertrag).
7. src/modules/17_floating_widget.js § sbkim:handshake-Listener — nur
   LESEN als Pattern-Vorlage für den Modul-16-Listener (analog idempotent
   + fail-soft).
8. index.html — Badge-CSS-Block (`#sbkim-siegel-badge`-Regeln + `:root`
   `--siegel-*`-Variablen) als Anker für die neuen CSS-Erweiterungen.
9. tests/manual_check.html Panel 16 (Knöpfe 1-8 bestehend, neue Knöpfe
   9-12 für Sub e).

Deine Aufgabe (vier Blöcke, je 1 Commit, 1 gemeinsamer PR):

### Block 1: Modul 16 Code-Erweiterung um Sub (e)

In `src/modules/16_siegel.js` additiv (KEINE bestehende Funktion
verändern, KEIN Refactoring):

A. **`_meta`-Erweiterung:**
   - `_meta.mycelConnected: false` (boolean, RAM-only — Tab-Reload
     startet wieder Bronze, gewollt).
   - `_meta.mycelConnectedAt: null` (string|null, ISO-Datum
     `new Date().toISOString()` beim ersten `outcome:"established"`).

B. **Neue Funktion `siegelStufe()` (intern):**
   ```js
   function siegelStufe() {
     if (_meta.mycelConnected === true) return "gold";
     return "bronze";
   }
   ```
   KEIN export auf public surface — bleibt closure-intern, weil die
   Stufe nur das Render-Ergebnis bedient. _meta.mycelConnected ist
   der publizierte Anker.

C. **Window-Event-Listener auf `sbkim:handshake` in `init()`:**
   - Genau analog zum Pattern in Modul 17 (siehe Pflichtlese 7):
     `window.addEventListener("sbkim:handshake", handler)`.
   - Handler: `event?.detail?.outcome !== "established"` → no-op
     (fail-soft, kein Throw bei fehlendem detail).
   - Idempotent: `if (_meta.mycelConnected) return;`.
   - Set `_meta.mycelConnected = true` + `_meta.mycelConnectedAt =
     new Date().toISOString()`.
   - rerenderBadge() aufrufen + Stufenwechsel-Animation triggern
     (siehe Block 2 CSS).

D. **`data-stufe`-Attribut auf Badge-Element setzen:**
   - In der bestehenden Badge-Render-Funktion: `badge.setAttribute(
     "data-stufe", siegelStufe())`.
   - Beim Stufenwechsel: `data-stufe` von "bronze" auf "gold"
     wechseln + Klasse `stufenwechsel-gold` für 600 ms hinzufügen
     dann entfernen (analog zur First-Boot-Animation in Sub b).

E. **Wappen-SVG-Farbe je nach Stufe:**
   - In Bronze: alle `fill="#C9A961"` → `fill="#8C6E2F"` (oder via
     CSS-Variable, siehe Block 2).
   - In Gold: bleibt `#C9A961` (Default).
   - Spec-Quelle Karte 16 § Sub (e) § Visuelle Unterscheidung.

F. **Tooltip-Text je nach Stufe:**
   - Bronze: `aria-label="SBKIM-Siegel · Mycel suchend"`.
   - Gold: `aria-label="SBKIM-Siegel · Mycel verbunden"` (default
     bisher war „SBKIM-Siegel — Klick für Erklärung", das bleibt
     als Fallback für undefined Stufe).
   - KEIN `title`-Attribut (Konvention aus Pflege 17 Tooltips —
     Doppel-Tooltip-Problem auf DeX-Chrome). aria-label trägt vollen
     Text.

G. **Aspekt 4 in `ZERTIFIKAT_ASPEKTE`-Liste ergänzen:**
   - Code-versioniert (kein Runtime-Add). Position: am Listen-Ende.
   - Spec-Quelle Karte 16 § Sub (e) § Aspekt-4-Eintrag (Z. 584-602)
     UND § Sub (d) § Aspekt 4 — Mycel-Verbindung etabliert (Z. 649-671).
   - Schema:
     ```js
     {
       since:       "2026-05-26",
       module:      "16",
       aspect:      "Mycel-Verbindung etabliert (erster Handshake)",
       description: "Diese App hat in der aktuellen Session mindestens einen erfolgreichen Cross-Knoten-Handshake durchgeführt. SIEGEL-Stufe Gold.",
     }
     ```

H. **Modal-Render-Erweiterung (Sub c):**
   - Aspekt 4 ist **dynamisch sichtbar**: in Gold mit Datum (`since`),
     in Bronze mit Marker „pending" (z.B. grauer Text statt Datum,
     Karte 16 § Sub d Sonderfall Z. 660-671). Default: sichtbar mit
     grauem „pending"-Marker, damit User einen Andock-Anker hat.
   - In Bronze: zusätzlicher Hinweis-Block oberhalb der Aspekte-
     Liste (Karte 16 § Sub e § Klick-Verhalten in Bronze, Z. 559-571):
     > „**Mycel suchend** — diese App ist SBKIM-fähig, aber noch
     > nicht mit Geschwister-Knoten verbunden. Klick auf [Andocken]
     > (Modul 18) um eine Verbindung herzustellen."
   - `[Andocken]`-Knopf: fail-soft-Check `typeof
     window.SbkimToolPwa?.openAndockTab === "function"`.
     - Wenn vorhanden (Modul 18 später gebaut): Klick öffnet Modul 18
       Sub (a).
     - Wenn nicht (heute der Fall): Klick zeigt Info-Notiz im Modal
       „Modul 18 noch nicht verfügbar — Andocken via Sage-Page-Andock-
       Wizard." (analog Spec Z. 569-571).
   - In Gold: Hinweis-Block + [Andocken]-Knopf ENTFÄLLT, Modal zeigt
     nur die Aspekte-Liste mit allen vier Aspekten + Datum.

I. **Selbstcheck-Hinweis-Block:**
   - Modul-16-Selbstcheck-Zeile bleibt UNVERÄNDERT (Sub e ändert keine
     Public-Surface-Funktion).
   - `_meta` Live-Getter erweitert (siehe Block A).

### Block 2: CSS-Erweiterung in `index.html`

In der `:root`-Variable-Liste + Badge-CSS-Block ergänzen:

```css
:root {
  /* bestehend: --siegel-gold, --siegel-gold-glow, --siegel-bronze-ink, ... */
  --siegel-bronze:      #8C6E2F;
  --siegel-bronze-glow: rgba(140, 110, 47, 0.45);
}

#sbkim-siegel-badge[data-stufe="bronze"] {
  /* gedämpfter Bronze-Ton — Wappen-SVG-Glyph wird per JS-Code-Block
     E auf #8C6E2F gesetzt, ODER über CSS-Variable, falls SVG inline
     eingebaut ist (Bau-Sitzung entscheidet je nach aktueller Render-
     Struktur). */
  filter: saturate(0.6) brightness(0.85);
}

#sbkim-siegel-badge[data-stufe="gold"] {
  /* Default-Render — keine Override-Pflicht. */
}

@keyframes siegel-stufenwechsel-gold {
  0%   { transform: scale(1.00); box-shadow: 0 0 0 0 var(--siegel-gold-glow); }
  40%  { transform: scale(1.15); box-shadow: 0 0 24px 4px var(--siegel-gold-glow); }
  100% { transform: scale(1.00); box-shadow: 0 0 0 0 var(--siegel-gold-glow); }
}

#sbkim-siegel-badge.stufenwechsel-gold {
  animation: siegel-stufenwechsel-gold 600ms ease-out;
}
```

KEIN `<style>`-Inject aus Modul 16 selbst — die Spec sagt: CSS lebt
in `index.html`. Damit Klaus die Optik im Repo sehen kann ohne
Modul-16-Code zu lesen.

### Block 3: Panel 16 in `tests/manual_check.html`

Erweitere Panel 16 (Modul 16 Sub e) um vier Knöpfe nach den bestehenden
Knöpfen 1-8:

- **Knopf 9 — Setup Sub (e) Bronze-Initial:**
  Triggert SbkimSiegel.init() falls noch nicht gelaufen, prüft
  `_meta.mycelConnected === false`, prüft `data-stufe` auf Badge ist
  „bronze", prüft Tooltip-Text ist „SBKIM-Siegel · Mycel suchend".
  Status-Chip „Sub (e) Bronze-Initial OK".

- **Knopf 10 — Synthetischer Handshake-Event:**
  Dispatcht `window.dispatchEvent(new CustomEvent("sbkim:handshake",
  { detail: { outcome: "established", peerNodeId: "test-peer",
  direction: "outgoing" } }))`. Erwartung: `_meta.mycelConnected
  === true`, `_meta.mycelConnectedAt` ist ISO-String, Badge
  `data-stufe="gold"`, Stufenwechsel-Animation lief (Klasse
  `stufenwechsel-gold` für 600 ms aktiv — Test prüft nur, dass die
  Klasse einmal gesetzt wurde, nicht das genaue Timing). Status-Chip
  „Sub (e) Bronze→Gold OK".

- **Knopf 11 — Idempotenz:**
  Zweiter Dispatch desselben Events. Erwartung: `_meta.mycelConnectedAt`
  bleibt UNVERÄNDERT (kein zweites Datum), keine zweite Animation,
  Badge bleibt Gold. Status-Chip „Idempotent OK".

- **Knopf 12 — Bronze-Klick öffnet Modal mit Hinweis-Block:**
  Setzt `_meta.mycelConnected` zurück auf false (Test-Brücke
  `_resetMycelConnectedForTest()` ergänzen), re-rendert Badge,
  öffnet Modal via SbkimSiegel.getExplanation()-Anker, prüft dass
  der „Mycel suchend"-Hinweis-Block + [Andocken]-Knopf sichtbar sind
  (DOM-Selektor-Check). Status-Chip „Bronze-Klick OK".

Selbstcheck-Hinweis-Knopf (bestehend) Text aktualisieren — falls die
Selbstcheck-Zeile sich nicht ändert (siehe Block 1 I), bleibt der
Hinweis-Knopf-Text unverändert. Nur falls die Selbstcheck-Zeile
ergänzt wurde (z.B. um „Stufe: bronze|gold"), den Hinweis nachziehen.

### Block 4: Tests + Doku-Pflege

A. **Headless-Smoke-Test** `tests/smoke_bau16_sub_e_bronze.mjs`:
   - Setup: lade `src/modules/16_siegel.js` via Function-Constructor
     (analog Smoke 04.C).
   - 12-15 Proben:
     · `_meta.mycelConnected` initial false.
     · `siegelStufe()` initial "bronze".
     · DispatchEvent sbkim:handshake outcome:"established" → mycelConnected
       wird true, mycelConnectedAt ISO-String.
     · siegelStufe() → "gold".
     · Zweiter Dispatch → mycelConnectedAt UNVERÄNDERT (Idempotenz).
     · Dispatch mit outcome:"rejected" → kein-Op, mycelConnected bleibt false.
     · Dispatch ohne detail → kein-Op, kein Throw.
     · Dispatch mit detail:null → kein-Op.
     · ZERTIFIKAT_ASPEKTE hat 4 Einträge, vierter ist Aspekt 4 mit
       since:"2026-05-26" module:"16".
   - JSDOM oder Mock-DOM für `window.dispatchEvent` /
     `window.addEventListener` (analog Smoke 17 Pattern, siehe
     `tests/smoke_bau17_floating_widget.mjs`).
   - **Regression:** alle anderen Smokes (04.A 19/19, 04.B 30/30, 04.C
     43/43, 15.B 31/31, 17 32/32) bleiben grün.
   - `node --check src/modules/16_siegel.js` grün.
   - Alle Inline-`<script>`-Blöcke in `tests/manual_check.html`
     syntaktisch validiert.

B. **Karte 16 § Bauzustand** neue Zeile „Bau Sub (e) Bronze/Gold-
   Stufung" mit Code-Details + Smoke-Bilanz + Sichttest-Status
   (ungeprüft, wartet auf Klaus' Browser-Lauf Panel 16 Knöpfe 9-12).

C. **INTERFACES.md § 1 Modul 16** voll gespiegelt:
   - Bietet-Block um `_meta.mycelConnected` + `_meta.mycelConnectedAt`
     erweitert.
   - § Events-Block ergänzt: „Lauscht auf sbkim:handshake (Bau 17
     Custom-Event aus Modul 05). Handler-Vertrag: idempotent, fail-
     soft, RAM-only."
   - § 10 Änderungsprotokoll-Eintrag mit vollem Bau-Resultat.

D. **`status.json` Modul 16:** bleibt `score:"stub"` ODER wechselt
   nach Sichttest? — analog Konvention aus 04.B und 04.C: bleibt
   `"stub"` bis Klaus' Sichttest 9-12 grün ist. Nach Sichttest eigene
   Pflege-PR „Sichttest 16 Sub e grün" analog PR #178.
   `python3 scripts/update_puls_pie.py` (auch ohne Score-Änderung
   sicher aufrufen — Score-Texte können sich ändern).

E. **PULS.md Sitzungs-Eintrag** oben in § Sitzungs-Einträge.

F. **Übergabeprotokoll** `docs/sessions/archiv/YYYY-MM-DD_bau-16-sub-e-bronze.md`.

G. **Commit + Push** auf `claude/bau-16-sub-e-bronze`.

H. **Draft-PR** anlegen.

I. **„Vorgeschlagene nächste Schritte"-Block** im Chat (Sichttest 16 Sub e
   + Re-Aktivierung Modul 15+16+17+04.C in MR/MM + Bau 16 Sub e in
   Endknoten-PWAs).

J. **Brief-Codeblock für die nächste Sitzung** im Chat ausgeben (typisch
   Pipeline-Schritt 5e Re-Aktivierung MR, oder Sichttest-Nachzug 16 Sub e
   nach Klaus' Browser-Lauf).

---

Heilige Tafeln dieser Sitzung:

- **Modul-Code-Eingriff NUR in `src/modules/16_siegel.js`.** Andere
  Module unangetastet (00/01/02/03/04/05/06/07/08/15/17/18/19).
- **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.**
  Sub e ist additiv, RAM-only, kein neues Datenformat.
- **KEIN Auto-Andocken.** Aspekt 4 wird via empfangenem
  sbkim:handshake-Event aktiviert. KEIN Modul-16-Polling, KEIN
  Modul-16-eigener fetch. Empfangsmodus-Prinzip wahren.
- **KEIN Persistent-Store für mycelConnected.** Tab-Reload startet
  wieder Bronze, gewollt. Wer mehr will, baut Modul 10 Reputation.
- **KEIN Modul-18-Code-Bau.** Der [Andocken]-Knopf in Bronze-Modal
  ist fail-soft — `typeof window.SbkimToolPwa?.openAndockTab` Check,
  bei Fehlen Info-Notiz. Modul 18 selbst kommt in Pipeline-Phase A
  Schritt 5h.
- **KEIN Endknoten-Eingriff in dieser PR.** Mein-Rezeptbuch +
  Mein-Mixarium bleiben außen vor. Re-Aktivierung läuft als eigene
  Folge-Sitzung pro Endknoten-Repo (Pipeline-Schritt 5e+5i).
- **KEINE Tafel-Umsortierung CLAUDE.md.** Die Pflicht-Konvention
  „Sicherheits-Module pflegen Aspekte" ist schon in CLAUDE.md (PR
  Pipeline-Tabelle Schritt 3a) — diese Bau-Sitzung respektiert sie
  und ergänzt Aspekt 4.
- **KEINE Sage-Page-Änderung außer index.html CSS-Variablen +
  Badge-Regeln** (Block 2).
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Sitzung liest)

### Warum diese Bau-Sitzung jetzt

Klaus' Vision-Klärung 2026-05-26 (Tafel-Spec-Pflege Mycel-Vision)
hat ein Henne-Ei-Problem gelöst: das SIEGEL erscheint **schon Bronze**
nach Surface-Check, sodass Klick → Modul-18-Andock-Geste möglich
wird. Vorher hätte das SIEGEL erst nach erstem Handshake voll
erscheinen müssen — aber ohne Andocken kein erster Handshake.

Modul 04.C ist gemerged + sichtgetestet. Modul 05 dispatcht das
`sbkim:handshake`-Event live (seit Bau 17). Das Modul-16-Sub-e ist
der **kleinste fehlende Baustein** für die zweistufige Sichtbarkeit.

### Was nach dieser Bau-Sitzung kommt

- **Klaus' Sichttest 16 Sub e** (Panel 16 Knöpfe 9-12) — eigene
  Pflege-PR analog PR #178.
- **Re-Aktivierung Modul 15+16+17+04.C in Mein-Rezeptbuch** (extern,
  Pipeline-Schritt 5e + 5i). Brief liegt schon:
  `docs/sessions/BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md`.
- **Analog für Mein-Mixarium** (Pipeline-Schritt 5j).
- **Spec + Bau Modul 18 Tool-PWA-Container** (Pipeline-Schritt 5h)
  — sobald gebaut, kann der [Andocken]-Knopf im Bronze-Modal echte
  Modul-18-Andock-Geste öffnen statt der Info-Notiz.

### Klaus-Disziplin: Sage-Protokol-only

Diese Bau-Sitzung ist **Sage-Protokol-only**. Externe Endknoten-
Re-Aktivierung läuft in eigenen Folge-PRs pro Endknoten-Repo.
