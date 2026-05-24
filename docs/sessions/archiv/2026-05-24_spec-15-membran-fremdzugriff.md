# Übergabeprotokoll · 2026-05-24 · Spec-Sitzung 15 — Membran Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe

**Sitzungs-Rolle:** Spec-Sitzung.
**Branch:** `claude/spec-15-membran-fremdzugriff-0R5iQ`.
**Vorgänger:** Pflege-Hauptsitzung Karte-15-Hochstufung (2026-05-24,
PR #140, Brief `docs/sessions/BRIEF_SPEC_15_MEMBRAN.md`).
**Folger:** Bau-Sitzung 15 (Brief `docs/sessions/BRIEF_BAU_15_MEMBRAN_FREMDZUGRIFF.md`).

---

## Was war zu tun

Brief `BRIEF_SPEC_15_MEMBRAN.md` hatte sieben primäre Punkte für
Sub (e) und zwei sekundäre für Sub (a)+(b). Anlass: Klaus' Wunsch
nach **dritter Navleisten-Lampe** in der Sage-Page, die bei
Fremdzugriff rot leuchtet und Klick öffnet ein Fremdzugriff-Fenster.
Hintergrund: Google I/O 2026 Gemini-3.5-Flash-Default-Modell auf
Android-Tablet macht KI-Browser-Agenten-Beobachtung akut.

## Was getan

**Karte 15 (`docs/components/15_membran.md`):**

- Status-Zeile: `🟫 Schablone` → `🟨 Spec fertig (Sub (e), Sub (a)+(b) grob)`.
- Sub (e) komplett ausgeschrieben (statt nur Anker-Form-Stub):
  - Schnittstelle `window.SbkimMembrane.fremdzugriff.{list,subscribe,clear,_recordForTest}`
    mit Verträgen pro Funktion.
  - `FremdzugriffEntry`-Schema verbindlich (sieben Felder, drei
    `kind`-Werte, drei `decision`-Werte, kind-spezifische `details`-
    Mindest-Form).
  - **Persistenz-Entscheidung: RAM-only** mit Drei-Sätze-Begründung;
    `sessionStorage` + IndexedDB-Store + TTL begründet verworfen.
  - Ringbuffer-Verhalten (FIFO, `MEMBRANE_FREMDZUGRIFF_BUFFER_MAX=50`,
    älteste zuerst, Lampen-Lebenszyklus).
  - „Fremd"-Definition formal (postMessage `event.origin`-Check;
    SW-Fetch-Listener-Reihenfolge `request.url`-Origin →
    `Sec-Fetch-Site` → `Referer` für endpoint-probes;
    `BroadcastChannel('sbkim-membrane')`-Brücke SW→Page; `read()`
    immer Fremdzugriff).
  - Lampe in der Navleiste mit DOM-Vorlage, CSS-Variable
    `--lamp-alert: #DC2626`, zwei neuen CSS-Klassen
    `.lamp.fremd-alert` (Dauer) + `.lamp.fremd-pulse` (Puls).
  - **Modal-Entscheidung: eigenständig in der Sage-Page** (Modul-00-
    Reuse und Slide-Card begründet verworfen).
  - Architektur-Trennung Detektions-Schicht (drei Eintrags-Pfade) /
    Anzeige-Schicht (Lampe + Modal).
  - Strikte Tabus erweitert (Lampe blockiert nicht, PII-Schutz,
    RAM-only, Same-Origin nicht-Fremd, Lampe pulst bei JEDER
    decision).
  - Bau-Sitzung-Hinweise (keine Stores, kein DB-Version-Bump, keine
    benannten Error-Klassen, `index.html`-Eingriff-Vorlage, Panel-15-
    Skizze).
- Sub (a) Read-API: globaler Name `window.SbkimMembrane` fixiert,
  Sub-(e)-Hook in `read()` verbindlich, offen-Block für Sub (a) finale
  Spec.
- Sub (b) postMessage-Brücke: Konfigurations-Pfad fixiert
  (`init({allowedOrigins})` im Andocker, strict String, kein Wildcard),
  Sub-(e)-Hook verbindlich, offen-Block für Sub (b) finale Spec.
- „Für Sub (e)"-Offen-Block als gelöst markiert mit
  Sub-(e)-Block-Verweis.
- Bauzustand-Tabelle: neue Zeile „Spec gefüllt 2026-05-24".

**INTERFACES.md:**

- §0 Konstanten-Block: neue Konstante
  `MEMBRANE_FREMDZUGRIFF_BUFFER_MAX = 50` mit Erklär-Block.
- §1 Modul-15-Block komplett umgeschrieben:
  - Status: `schablone` → `entwurf`.
  - Bietet-Block voller API-Vertrag (`init`, `fremdzugriff.*`, `read()`-
    Skelett, postMessage-Envelope, options-Form mit `bufferMax` +
    `lampSelector` + `mountModal` + `allowedOrigins`).
  - `FremdzugriffEntry`-Form verbindlich.
  - Nutzt-Block (Browser-APIs + Modul-Abhängigkeiten für Sub (a)).
  - Storage-Block: KEINE neuen Stores, KEIN DB-Version-Bump.
  - Events-Block (eingehende `message`, BroadcastChannel-Probe,
    Click-Lampe, Esc/Backdrop, KEINE CustomEvents).
  - Selbstcheck mit Funktions-Liste.
  - Versionierungs-Block (Sub (e) RAM-only, session-only).
  - Fehlerverhalten-Block (alles fail-soft, KEINE benannten
    Error-Klassen für Sub (e)).
  - Garantien-Block für 00/09/12/14/Sage-Page (Sub (e) Anzeige-only,
    Sub (a)+(b) Tabu-Wiederholung, Sage-Page-DOM-Eingriff-Vorlage).
  - Tabus-Block (sieben Punkte).
  - Hook-Punkte zu Modul 10/11/12.
  - Risiken-Block mit Sub-(e)-Mitigationen.
  - Geprüft: 2026-05-18 + 2026-05-24.

**status.json:**

- `membranBacklog[0].score`: `"schablone"` → `"spec"`.
- `.siegel` + `.kurz` nachgezogen mit Spec-Inhalt + Hinweis auf
  Brief BAU_15.

**PULS.md:**

- Tabellen-Zeile 15 vollständig nachgezogen (Spec-Status, Sub-(e)-
  voll, Sub-(a)+(b)-grob, kein Modul-Code, Brief-Verweis).
- Neuer Sitzungs-Eintrag oben mit den sieben Spec-Entscheidungen +
  Was-angefasst + Was-NICHT-gemacht + Offene-Folgepunkte +
  Nächster-sinnvoller-Schritt.
- **Pie-Block via `python3 scripts/update_puls_pie.py` automatisch
  nachgezogen** — Daten 4/0/1/7/3 (eine „Spec fertig" mehr, ein
  „Schablone" weniger).
- **Zwei ältere Sitzungs-Einträge ins Archiv ausgelagert**
  (2026-05-18 Vision-Anker M04-Erweiterung + 2026-05-20 Bau 08.Y
  slot-spezifische Outbox in Modul 08), weil das Hinzufügen des
  Sub-(e)-Spec-Eintrags PULS.md über die 3000-Zeilen-Schutz-Klausel
  geschoben hätte. Archiv-Index-Tabelle entsprechend ergänzt;
  Verweise auf die zugehörigen Übergabeprotokolle.

**Neue Dateien:**

- `docs/sessions/BRIEF_BAU_15_MEMBRAN_FREMDZUGRIFF.md` (Brief für die
  Folge-Bau-Sitzung 15 mit Brief-Codeblock zum copy-paste).
- `docs/sessions/archiv/2026-05-24_spec-15-membran-fremdzugriff.md`
  (dieses Übergabeprotokoll).

## Was bewusst NICHT gemacht

- **Kein Modul-Code in `src/modules/15_membran.js`** — Bau-Sitzung 15.
- **Kein Eingriff in `index.html`** — Bau-Sitzung 15. DOM/CSS-Vorlagen
  liegen in Karte 15 + INTERFACES.md zum copy-paste bereit.
- **Kein Eingriff in andere Modul-Karten** (kein Querverweis-Update
  in Karten 00/05/09 — die standen schon aus der Hauptsitzung
  2026-05-18 / Pflege 2026-05-24).
- **Kein Eingriff in Empfangsmodus-Prinzip** — Sub (e) ist und
  bleibt passiv beobachtend.
- **Kein Sub (c) Capability-Token-Eingriff** (Stufe 3, wartet auf
  Sub (a)+(b) finale Spec).
- **Kein Sub (d) Backup-Datei-Eingriff** (existiert bereits in Modul
  02 Bau 02.X, Karte 15 verweist nur).

## Spec-Entscheidungs-Tabelle

| Brief-Frage | Entscheidung | Begründung kurz |
|---|---|---|
| Modal-Form (Modul-00-Reuse / eigenes / Slide-Card) | **eigenes Modal in der Sage-Page** | Modul 00 lebt in Endknoten-PWAs, nicht der Sage-Page; Slide-Card hat kein etabliertes Pattern; eigenes Modal in `15_membran.js`-Closure analog Modul-00-Modal-Lifecycle. |
| Persistenz (RAM / sessionStorage / IndexedDB+TTL) | **RAM-only** | Klaus' „lebende Schau ≠ Audit-Archiv"; IndexedDB wäre `DB_VERSION`-Bump für Anzeige-Schicht; `sessionStorage` öffnet Storage-Pfad ohne klaren Nutzen. |
| Ringbuffer-Größe N | **50** | Aus Brief-Vorschlag, in §0 als `MEMBRANE_FREMDZUGRIFF_BUFFER_MAX` verankert. |
| Lampen-Pulse-Verhalten | **Dauer-Rot + Puls pro Eintrag** | Dauer-Rot macht „etwas ist passiert" persistent sichtbar; Puls macht Live-Vorgang unmittelbar wahrnehmbar. `clear()` setzt aus. |
| `kind`-Werte | `membrane-read` / `membrane-postmessage` / `endpoint-probe` | Genau die drei Detektions-Pfade (Sub (a) read-API + Sub (b) postMessage + SW-Fetch-Listener). |
| `decision`-Werte | `accepted` / `ignored` / `rejected-allowlist` | Drei klar trennbare Outcomes; rejected-allowlist nur für Sub (b) verwendet. |
| `agentHint`-Form | `navigator.userAgent.slice(0, 64)` | Klartext (Klaus soll lesen), kurz (keine PII-Aufblähung), nur ein navigator-Feld (kein Plugin-Fingerprint). |
| Sub (e) Error-Klassen | **KEINE benannten Error-Klassen** | Rein beobachtend, fail-soft via console.warn analog Modul-00 `recordSighttest`-Pattern. |
| Globaler Name (Sub (a) Frage 1) | **`window.SbkimMembrane`** | Konvention `Sbkim*` wie alle anderen Module; `fremdzugriff`-Namespace als Unter-Objekt. |
| Sub (b) Allowlist-Konfig | **Andocker-Init `SbkimMembrane.init({allowedOrigins})`** | Jeder Knoten bestimmt seine eigene Liste; statisch (kein Membran-Self-Service); strict String, kein Wildcard. |
| Sub (b) decision bei rejected-allowlist | **Lampe pulst trotzdem** | Klaus soll Abweisungen sehen → Phishing-Hinweis (Karte 15 § Risiken „Allowlist-Drift"). |
| Endpoint-Probe-Definition | **SW-Hook + BroadcastChannel('sbkim-membrane')** | SW kann Sec-Fetch-Site/Referer prüfen; Page-Schicht hat keinen direkten Zugriff auf Cross-Origin-Fetches. |

## Offene Folgepunkte

- **Bau-Sitzung 15** ziehen — Brief liegt fertig
  (`docs/sessions/BRIEF_BAU_15_MEMBRAN_FREMDZUGRIFF.md`).
- **Spec-Sitzung 15.B** (Sub (a)+(b) finale Spec) bleibt offen — kein
  Zeitdruck, zieht erst bei Endknoten-Wunsch oder dritter
  Endknoten-Andock-Anlass.
- **Folge-Pflege Karte 09** (Andock-Anleitung) — Schritt 10 optional
  „Membran-Allowlist setzen + Lampe in PWA-Header anhängen". Eigene
  Pflege-Sitzung nach Bau-Sitzung 15.

## Nächster sinnvoller Schritt

Bau-Sitzung 15 ziehen. **Wichtig:** Sage-Page-Refactor
(`BRIEF_BAU_SAGE_PAGE_REFACTOR.md` aus Brief-99-Pipeline) und
Bau-Sitzung 15 berühren beide `index.html`. Saubere Reihenfolge:
**erst Sage-Page-Refactor mergen, dann Bau-Sitzung 15** (Lampe ist
additiv, Refactor ändert die Sage-Page-Struktur substanzieller).
Aktuell ist Sage-Page-Refactor bereits gemerged (PR #125, 2026-05-21),
also kann Bau-Sitzung 15 direkt ziehen.

## PR-Status

Branch `claude/spec-15-membran-fremdzugriff-0R5iQ` mit dieser Spec-
Sitzung gepusht; Draft-PR „Spec-Sitzung 15 — Membran Sub (e)
Fremdzugriff-Detektor + Navleisten-Lampe" angelegt. Keine
parallelen offenen PRs (Stand 2026-05-24 Sitzungs-Start).

## Bezugs-Dokumente

- Karte 15 (gefüllt): `docs/components/15_membran.md`
- INTERFACES.md (gespiegelt): § 0 + § 1 Modul-15-Block
- Brief Spec-Sitzung 15: `docs/sessions/BRIEF_SPEC_15_MEMBRAN.md`
- Brief Folge-Bau-Sitzung 15: `docs/sessions/BRIEF_BAU_15_MEMBRAN_FREMDZUGRIFF.md`
- Pflege-Hauptsitzung Karte-15-Hochstufung 2026-05-24 (Anlass):
  `docs/sessions/archiv/2026-05-24_pflege-modul-15-hochstufung.md`
