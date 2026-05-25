# Übergabeprotokoll — Spec-Sitzung 17 Floating-Widget

**Datum:** 2026-05-25
**Sitzungs-Rolle:** Spec-Sitzung 17 (Pipeline-Schritt 5b — CLAUDE.md § Pipeline-Reihenfolge)
**Branch:** `claude/spec-17-floating-widget-vywVo`
**Brief:** `docs/sessions/BRIEF_SPEC_15_16_FLOATING_WIDGET.md` (PR #163, gemerged) + Klaus-Zusatz-Wunsch 2026-05-25 (Vier-Slot-Live-Dashboard)
**Folge-Brief:** `docs/sessions/BRIEF_BAU_17_FLOATING_WIDGET.md` (in dieser Sitzung angelegt)

---

## Was getan

Reine Spec-Sitzung. Karte 17, INTERFACES.md § 1 Modul 17, Event-Schema-Verweise in INTERFACES § 1 Modul 02/05/15/16, § 10 Änderungsprotokoll, Verweis-Blöcke in Karten 02/05/15/16, `status.json`, `CLAUDE.md`, PULS.md, Übergabeprotokoll und Bau-17-Brief. **Kein Modul-Code, kein Backend-Eingriff, keine Sage-Page-Änderung.**

### 1. Neue Karte `docs/components/17_floating_widget.md`

Volle Spec mit folgender Struktur:

- **Mycel-Bild** (Sichtkästchen mit vier Fenstern)
- **Vokabular** (Floating-Widget, Status-Slot, Event-Bus, Anti-Greenwashing pro Slot, Klaus-Festlegung 2026-05-25)
- **Warum jetzt** (Hochstufungs-Begründung: erste Endknoten-Migration ungeeignet, Eruda-Pattern als Vorbild)
- **Vier-Slot-Layout** (verbindlich): Tabelle Slot → Aktiv-Quelle (Modul) → Aktiv-Zustand → Inaktiv-Zustand → Anti-Greenwashing. Maße Desktop/Mobile, Z-Index-Konvention (Widget 9990, Modals 9999, Eruda 9999999).
- **Event-Bus-Schema** (verbindlich): fünf Pflicht-Custom-Events auf `window` mit Dispatcher + Detail-Form + Trigger-Zeitpunkt. PII-Disziplin (KEINE Inhalte, nur Counts + Status-Flags). Konvention: `bubbles:false`, `cancelable:false`, Anti-Greenwashing nur bei realer Operation, Render-Drossel auf Konsumenten-Seite.
- **UX-Regeln**: Default-Sichtbarkeit alle vier Slots immer im DOM (außer SIEGEL bei `isCertified()===false`, binär), Tap-Verhalten pro Slot (LEBT/VERKEHR neue Modals von Modul 17; FREMD/SIEGEL Proxy-Click auf bestehende Modul-15-/16-Modals), Drag-Mechanik (Pointer-Events, 5 px Threshold, freies Drag empfohlen), X-Schließen + vier Wiederherstellungs-Pfade.
- **Schnittstelle** (final): `window.SbkimWidget = {init/show/hide/isVisible/getPosition/_meta}`. options-Form mit `slots`-Whitelist, `defaultCorner`/`defaultOffset`, `allowClose`/`allowDrag`/`rememberHidden`/`zIndex`/`theme`. `PositionSnapshot` + `localStorage`-Schema (`sbkim_widget_visible` + `sbkim_widget_position`).
- **Modal-Bridge** (Slot-Klick → bestehende Modals via Proxy-Click oder ggf. neuer Modul-15/16-API in Folge-Pflege).
- **Strikte Tabus**: KEINE Identität / Krypto / IndexedDB / Netz / Auto-Verhalten / Modal-Override / PROTOCOL_VERSION-Bump / Pflicht-Module-Liste. Anti-Greenwashing-Klausel für SIEGEL binär.
- **Persistenz**: `localStorage`-only für Visible + Position (Render-Schicht ohne Storage-Modul-Abhängigkeit); VERKEHR-Mini-Log RAM-only FIFO 10.
- **Sage-Page-Pfad bleibt erhalten** (Klaus-Festlegung 2026-05-25): Sage-Page behält Navleisten-Lampen + Siegel-Badge, Endknoten bekommen Widget. Zweigleisigkeit ist Spec-Wille.
- **Risiken**: Slot-Event-Drift, localStorage-Verlust, Eruda-Kollision, Mobile-Footprint, Slot-Anti-Greenwashing-Verwechslung, Event-Spamming. Jeweils mit Mitigation.
- **Verbindung zu anderen Karten**: 02 (LEBT) · 05 (VERKEHR Sub) · 15 (VERKEHR Sub + FREMD) · 16 (SIEGEL) · 09 (Einbau drei Zeilen statt 30) · 00 (optionale Wiederherstellungs-Geste).
- **Manueller Test** (Vorbereitung Bau-Sitzung 17): zehn Test-Punkte für Panel 17.
- **Selbstcheck-Konvention**: `MODUL 17 FLOATING-WIDGET bereit, Funktionen: init/show/hide/isVisible/getPosition`.
- **Folge-Pflege-Liste**: sieben Punkte (Bau 17, Event-Hooks pro Modul, Sichttest 17, Endknoten-Re-Migration, Karte 09 schrumpfen, Modul-00-Geste-Hook).
- **Bauzustand-Tabelle**: Stub-Anlage (Brief-Pflege, 2026-05-25 PR #163) → Spec gefüllt (diese Sitzung) → Code geschrieben (Bau-Sitzung 17, offen) → Sichttest (offen) → Endknoten (offen).

### 2. `docs/INTERFACES.md` § 1 Modul 17 voll spezifiziert

~280 Zeilen, gespiegelt aus Karte 17. Alle Pflicht-Blöcke (Bietet, options-Form, PositionSnapshot, Vier-Slot-Layout, Event-Bus-Schema mit Tabelle, Nutzt, Storage, Events, Selbstcheck, Versionierungs-/Sichtbarkeits-Vertrag, Fehlerverhalten, Datenformate, Garantien für 00/02/05/09/15/16, Tabus, Hook-Punkte, Risiken, Geprüft). Status `entwurf`.

### 3. § 1 Modul 02 + 05 + 15 + 16 Events-Blöcke erweitert

Pro Modul der `feuert:`-Block um die jeweiligen Pflicht-Custom-Events erweitert (Vorbestellung Modul 17, Bau-Sitzung 17 oder eigene Mini-Pflege):

- **Modul 02:** `sbkim:alive` einmalig nach `init()` + `getOrCreateIdentity()` mit `{since, nodeId}`.
- **Modul 05:** `sbkim:handshake` pro abgeschlossenem Handshake mit `{outcome, peerNodeId, direction}`.
- **Modul 15 (Sub b):** `sbkim:postmessage` pro eingehender `message` mit `{op, direction, decision}` (KEIN payload, KEIN origin — PII-Schutz).
- **Modul 15 (Sub e):** `sbkim:fremd-alert` pro Ringbuffer-Neueintrag mit `{kind, decision, bufferSize}` (KEIN origin, KEIN agentHint, KEIN endpoint im Custom-Event — die stehen im Sub-(e)-Buffer).
- **Modul 16:** `sbkim:siegel-certified` einmalig nach `init()` wenn `isCertified()===true` mit `{certifiedAt, repoUrl}`.

**KEIN Code-Eingriff** in den `src/modules/<modul>.js`-Dateien — nur Schnittstellen-Doku in INTERFACES.md. Der tatsächliche `dispatchEvent`-Aufruf kommt in Bau-Sitzung 17 (oder eigenen Folge-Pflege-Sitzungen pro Modul).

### 4. § 10 Änderungsprotokoll-Eintrag

2026-05-25 Spec-Sitzung 17 Floating-Widget mit Voll-Begründung (Pipeline-Schritt 5b, Tafel-Evolutions-Klausel, alle Pflicht-Stellen genannt, Klaus-Zusatz-Wunsch Vier-Slot-Dashboard ersetzt 2-Plaketten-Vorschlag).

### 5. Verweis-Blöcke in Karten

- `docs/components/15_membran.md` § Sub (e): neuer Sub-Block „Floating-Widget-Pfad (seit Spec-Sitzung 17, 2026-05-25)" nach „Warum jetzt".
- `docs/components/16_siegel.md` § Sub (b): neuer Sub-Block „Floating-Widget-Pfad (seit Spec-Sitzung 17, 2026-05-25)" nach „Anti-Greenwashing-Anker (binär)".
- `docs/components/02_spore.md` § Bauzustand: neue Zeile „Verweis Floating-Widget (Modul 17)".
- `docs/components/05_anastomose.md` § Bauzustand: neue Zeile „Verweis Floating-Widget (Modul 17)".

Pattern: Ein-Satz-Verweis + Hook-Beschreibung + „KEIN Eingriff in `src/modules/<modul>.js` durch Spec-Sitzung 17 selbst".

### 6. `status.json` § modules[] um Modul 17 erweitert

Neuer Eintrag (`id:"17"`, `score:"spec"`, `siegel:"Spec fertig"`, `abhaengig:["02","05","15","16"]`, langer `kurz`-Block). `lastUpdated:"2026-05-25"`. `python3 scripts/update_puls_pie.py` aufgerufen — neuer Pie-Stand: 17 Module, 🟫 4 · 🟧 0 · 🟨 1 · 🟦 8 · 🟩 4.

### 7. `CLAUDE.md` § Modul-Tabelle Eintrag 17 aktualisiert

Auf „**Spec fertig** (2026-05-25, Spec-Sitzung 17)" gesetzt mit kompletter Zusammenfassung (Vier-Slot-Dashboard, Event-Bus-Schema, Modul-15-+-16-Backends unverändert, Sage-Page-Pfad bleibt).

### 8. Brief Bau-Sitzung 17 angelegt

`docs/sessions/BRIEF_BAU_17_FLOATING_WIDGET.md` — ~250 Zeilen Brief-Codeblock mit allen Bau-Anweisungen, Anti-Greenwashing-Disziplin, Pflicht-Liste der dispatchEvent-Hooks in Modul 02/05/15/16, Panel-17-Test-Punkte, strikte Tabus, Pflicht am Ende.

### 9. PULS.md-Eintrag

Oben neuer Block „2026-05-25 · Spec-Sitzung 17 Floating-Widget" mit allen Details. Pie-Block via `update_puls_pie.py` automatisch nachgezogen.

---

## Klärungs-Entscheidungen (Klaus-Zusatz-Wunsch + Brief-Architektur-Fragen A–F)

| Frage | Entscheidung | Begründung |
|---|---|---|
| A. Event-Bus-Form | Custom DOM Events (`window.dispatchEvent`) | Module-Entkopplung: Widget kennt nur Event-Namen, keine Modul-Referenz. Anbieter dispatcht je eine `dispatchEvent`-Zeile, ein-Satz-Hook pro Modul. |
| B. Module 02/05/15 § Tafel | Event-Schema in Karte 17 + INTERFACES § 1 Modul 17 festgelegt + ein-Satz-Verweis in Karten 02/05/15/16. Code-Pflege (dispatchEvent-Aufrufe) ist Bau-Sitzung 17 oder eigene Folge-Pflege pro Modul. | Spec-Sitzung schreibt KEINEN Code. Saubere Trennung Spec-Bau. |
| C. Layout | 4 Slots horizontal nebeneinander (~200 px × 48 px), Mobile bleibt horizontal mit 36 px-Slots (kein Karussell). | Karussell wäre Anti-UX (Klaus muss klicken um Slot zu sehen). Horizontal passt auch auf 320 px-Screens. |
| D. Default-Sichtbarkeit | ALLE 4 Slots immer im DOM (Ausnahme SIEGEL bei `isCertified()===false`). | Leerer/grauer Slot = „Funktion bekannt, gerade nicht aktiv" — ehrliches UX-Signal. Verschwindende UI wäre verwirrend. |
| E. Tap-Verhalten | LEBT-Tap → neues Status-Modal (Modul 17 baut). VERKEHR-Tap → neues Mini-Log-Modal (RAM-only FIFO 10). FREMD-Tap → bestehendes Modul-15-Sub-(e)-Modal. SIEGEL-Tap → bestehendes Modul-16-Sub-(c)-Modal. | LEBT/VERKEHR brauchen eigene leichte Modals (existierende Module liefern keinen passenden Modal). FREMD/SIEGEL bleiben unverändert via Proxy-Click (Modul-15-+-16-Backends bleiben). |
| F. Brief-Punkt 3 (2-Plaketten-Vorschlag) | Abgelöst durch Vier-Slot-Live-Dashboard via Tafel-Evolutions-Klausel. Pille-Maße + Layout entsprechend angepasst. | Klaus' Live-Sichttest-Wunsch 2026-05-25 (Dashboard statt zwei Plaketten) ist gewichtigere Erkenntnis. Vier Slots machen den SBKIM-Lauf sichtbar (atmet/redet/hört/bezeugt), zwei Plaketten wären dekorativ. |

---

## Was NICHT getan

- KEIN Modul-Code in `src/modules/17_floating_widget.js` (Spec-Sitzung, kein Bau — kommt in Bau-Sitzung 17).
- KEIN Endknoten-Eingriff (extern, eigene Folge-Sitzung pro Repo).
- KEIN Modul-02/05/15/16-Backend-Code-Eingriff — `src/modules/02_spore.js` / `05_anastomose.js` / `15_membran.js` / `16_siegel.js` alle unangetastet. Event-Hook-Code ist Bau-Sitzung 17 oder eigene Folge-Pflege-Sitzungen.
- KEIN Sage-Page-Eingriff (`index.html` unangetastet — Sage-Page behält Navleisten-Lampen + Siegel-Badge, Klaus-Festlegung 2026-05-25).
- KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump (Modul 17 ist nicht protokoll-aktiv).
- KEINE Tafel-Umsortierung in CLAUDE.md § Pipeline-Reihenfolge (PR #163 hat sie bereits am 2026-05-25 verankert; Spec-Sitzung 17 ist genau Pipeline-Schritt 5b).
- KEINE Karte-09-Vereinfachung (Schritt 10 + 11 schrumpfen + Schritt 12 anlegen ist eigene Folge-Pflege nach Bau 17).
- KEIN Panel 17 in `tests/manual_check.html` (Bau-Sitzung 17 baut die Test-Knöpfe).
- KEIN ZERTIFIKAT_ASPEKTE-Eintrag in `src/modules/16_siegel.js` durch Spec-Sitzung 17 selbst — Spec-Sitzung schreibt KEINEN Code (`src/modules/16_siegel.js` unangetastet). Wenn Bau-Sitzung 17 Modul 17 als sicherheits-relevant betrachtet (es ist Render-Schicht, nicht Sicherheits-Modul), kann sie einen Aspekt-Eintrag in ihrer Pflege ergänzen. Brief-Punkt 13 lässt das offen.

---

## Nächster sinnvoller Schritt

**Bau-Sitzung 17 (Pipeline-Schritt 5c).** Brief liegt unter
`docs/sessions/BRIEF_BAU_17_FLOATING_WIDGET.md`. Klaus' Wahl: dispatchEvent-
Hooks in Modul 02/05/15/16 als Teil von Bau 17 mit-erledigen
(empfohlen — eine Sitzung statt vier) oder pro Modul eine eigene Mini-
Pflege-Sitzung. Empfehlung: Bau-Sitzung 17 macht alles in einem PR,
damit der Sichttest in Panel 17 sofort alle vier Slots leuchten sieht.

Danach:

- **Sichttest 17** (Pipeline-Schritt 5c Abschluss) — Klaus, Panel 17
  in `tests/manual_check.html` mit zehn Test-Punkten. Sage-Page-
  Bonus: vier Plaketten in Navleiste bleiben (kein Widget auf
  Sage-Page).
- **Endknoten-Re-Migration mit Widget** (Pipeline-Schritt 5d) — pro
  Endknoten-Repo eine eigene Folge-Sitzung mit neuem Mini-Brief
  (drei Zeilen Einbau-Anweisung statt 30).
- **Pflege Karte 09 § Schritt 10 + 11 + Schritt 12 anlegen** — eigene
  Mini-Pflege-Sitzung nach Bau 17, schrumpft die Einbau-Anleitung.
- **Klaus' App-Freigabe** (Pipeline-Schritt 6) — die drei Apps mit
  Floating-Widget sichtbar öffentlich verteilen.
