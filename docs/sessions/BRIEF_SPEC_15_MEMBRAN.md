# Brief — Spec-Sitzung 15 Membran (Schwerpunkt Sub (e) Fremdzugriff-Lampe)

**Anlass:** Pflege-Hauptsitzung 2026-05-24 hat Karte 15 von Priorität
niedrig auf **hoch** gestuft, nachdem Google auf der I/O 2026 Gemini
3.5 Flash als Default-Modell in Gemini-App + Google-Suche (AI Mode)
ausgerollt hat — agentisch, „act, not just answer". Klaus hat
zugleich gewünscht: eine **dritte Lampe** in der Sage-Page-Navleiste
(rechts neben „lebt" + „verkehr"), die **rot leuchtet bei Fremd-
zugriff**, mit Klick auf die Lampe → **Fenster auf, das zeigt was
gerade passiert**. Diese Spec-Sitzung füllt die Form für Sub (e),
nimmt Sub (a)+(b) als sekundäre Voll-Spec mit, hält Sub (c) und (d)
zurück.

**Branch (Vorschlag):** `claude/spec-15-membran-fremdzugriff` (oder
auf Klaus' Wahl ein anderer kurzer Branch-Name; das Repo erwartet
einen frischen Branch pro Sitzung — siehe CLAUDE.md § „Bau-Sitzung").

---

## Brief-Codeblock (für den ersten Prompt der Spec-Sitzung)

```
Du bist eine Spec-Sitzung in Sage-Protokol.

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md
2. docs/PULS.md (Schnellüberblick + jüngster Sitzungs-Eintrag 2026-05-24)
3. docs/ARCHITEKTUR.md
4. docs/INTERFACES.md (§ 0 Konstanten, § 1 Modul-Verträge — du wirst hier ein neues § 1 Modul-15-Block ergänzen)
5. docs/components/15_membran.md (deine Karte, inkl. Hochstufungs-Notiz 2026-05-24 + neuer Sub (e))
6. index.html (NUR die Navleiste rund um Zeile 700: `<div class="lamps">` mit `#lamp-alive` und `#lamp-traffic` — das ist der Anker-Punkt für die dritte Lampe; NICHT die ganze Datei lesen)

Deine Aufgabe:

PRIMÄR — Sub (e) Fremdzugriff-Detektor + Navleisten-Lampe füllen:

1. Lampen-Anker in der Sage-Page:
   - dritte Lampe als `<span class="lamp" id="lamp-fremd" title="...">` direkt nach `#lamp-traffic`
   - Label `<span class="lamp-label">fremd</span>`
   - CSS-Variable `--lamp-alert` (Vorschlag `#DC2626`) zu den
     bestehenden in `:root` ergänzen; CSS-Regel `.lamp.fremd-alert`
     analog zu `.lamp.alive` mit Glow + optionalem Puls
   - Click-Handler öffnet das Fremdzugriff-Fenster
2. Fremdzugriff-Fenster (Modal):
   - Entscheidung: Wiederverwendung von Modul-00-Doku-Fenster ODER
     eigenes Modal in der Sage-Page ODER Slide-Card. Spec wählt
     EINE Variante mit kurzer Begründung.
   - Inhalt: Tabelle der `FremdzugriffEntry` mit Spalten
     Zeit / kind / origin / endpoint / decision; oberhalb ein
     „Aufräumen"-Knopf (`SbkimMembrane.fremdzugriff.clear()`).
3. JS-API in `window.SbkimMembrane.fremdzugriff`:
   - `list()` → Array `FremdzugriffEntry[]` (Ringbuffer, Vorschlag N=50)
   - `subscribe(cb)` → ruft `cb(entry)` bei jedem neuen Eintrag, gibt
     `unsubscribeFn` zurück (für die Lampen-Pulse-Animation und das
     Live-Update im Modal)
   - `clear()` → leert den Buffer (für den „Aufräumen"-Knopf)
   - Optional: `_recordForTest(entry)` als Test-Brücke (Pattern
     analog Modul 08 Test-Brücken `_clearOutbox` etc.)
4. `FremdzugriffEntry`-Schema fixieren:
   - Felder `at`, `kind`, `origin`, `agentHint`, `endpoint`,
     `decision`, `details`
   - `kind ∈ {"membrane-read", "membrane-postmessage", "endpoint-probe"}`
   - `decision ∈ {"accepted", "ignored", "rejected-allowlist"}`
   - PII-Tabus aus Karte 15 § Sub (e) Strikte Tabus übernehmen
5. Persistenz-Entscheidung treffen:
   - RAM-only / `sessionStorage` / IndexedDB-Store mit TTL — eine
     Variante wählen, andere zwei kurz begründet verwerfen
6. „Fremd"-Definition formalisieren:
   - `event.origin !== window.location.origin` für postMessage
   - Für Endpoint-Probes (Service-Worker-Fetch): Referer / Sec-Fetch-
     Site-Header prüfen; same-origin → kein Eintrag
7. INTERFACES.md spiegeln:
   - Neuer § 1-Block „Modul 15 — Membran"; bietet:
     `window.SbkimMembrane.fremdzugriff.{list,subscribe,clear}` (Sub (e) Stufe 1)
     plus `window.SbkimMembrane.read()` als Anker für Sub (a) (kann Stub bleiben mit „spätere Spec" markiert)
   - Schreibt: ggf. neuer Store (falls IndexedDB-Variante gewählt)
   - Fehler-Klassen-Block (nur falls Sub (e) welche braucht — vermutlich KEINE, da rein beobachtend)
   - Konstanten in § 0: `MEMBRANE_FREMDZUGRIFF_BUFFER_MAX` (Default 50)

SEKUNDÄR — wenn Zeit + Token reichen:

- Sub (a) Read-API in Spec-Detail füllen (Feld-Liste in `read()`,
  Anonymisierungs-Tiefe, Quota-Verhalten — siehe Karte 15 § Für Sub (a))
- Sub (b) postMessage-Brücke mit Allowlist-Format + Konfigurations-
  pfad (Andocker vs. Karten-15-Hardcode) — siehe Karte 15 § Für Sub (b)

ZURÜCKGEHALTEN — diese Spec-Sitzung NICHT:

- Sub (c) Capability-Token (Stufe 3, wartet auf Sub (a)+(b))
- Sub (d) Backup-Datei (existiert bereits, nur Querverweis-Pflege)
- Bau-Sitzung 15: KEIN `src/modules/15_membran.js`, KEIN Eingriff in
  `index.html`-Lampe — das ist Bau-Sitzung 15 nach dieser Spec-Sitzung

Was du nicht tust:
- Kein Modul-Code in src/
- Kein Eingriff in index.html
- Keine Berührung anderer Modul-Karten (außer Querverweis-Bullets
  am Ende von Karte 15)
- Kein Eingriff in das Empfangsmodus-Prinzip — Membran bleibt passiv,
  die Lampe BEOBACHTET, sie blockiert nicht

Pflicht am Ende:
- Karte docs/components/15_membran.md voll für Sub (e), grob für Sub
  (a)+(b) wenn Zeit reichte
- INTERFACES.md § 0 + § 1 Modul-15-Block ergänzt
- PULS.md-Tabellenzeile 15 nachgezogen + Sitzungs-Eintrag oben
- status.json `membranBacklog[0].score` ggf. von "schablone" auf
  "spec" hochziehen WENN Sub (e) vollständig spezifiziert wurde
  (dann auch `python3 scripts/update_puls_pie.py` aufrufen)
- Übergabeprotokoll in docs/sessions/archiv/YYYY-MM-DD_spec-15-membran-fremdzugriff.md
- Brief für die Folge-Bau-Sitzung 15 anlegen
  (docs/sessions/BRIEF_BAU_15_MEMBRAN_FREMDZUGRIFF.md)
- Commit + Push auf claude/spec-15-membran-fremdzugriff
- Brief-Codeblock für die Bau-Sitzung in der Chat-Antwort wortwörtlich
  ausgeben (CLAUDE.md § Pflicht am Sitzungsende Punkt 6)
- „Vorgeschlagene nächste Schritte"-Block in der finalen Chat-Antwort
```

---

## Hintergrund (für Klaus, falls er den Brief vor der Spec-Sitzung
liest)

**Was die Spec-Sitzung NICHT entscheidet:** ob Gemini 3.5 Flash
tatsächlich mit-liest. Das ist ein Sichttest am Tablet, nicht eine
Spec-Frage. Die Spec entscheidet nur, **wie die Beobachtungs-Schicht
aussieht**, wenn so etwas passiert — und gibt Klaus damit ein
Instrument in die Hand, das Phänomen sichtbar zu machen.

**Was die Spec-Sitzung KANN, wenn Zeit reicht:** auch Sub (a) und
Sub (b) ausfüllen — die liegen schon als Anker-Form in der Karte
und brauchen nur noch Detail-Entscheidungen. Wenn nicht, gibt es
später eine eigene Spec-Sitzung 15.B nur für (a)+(b).

**Reihenfolge der Folge-Sitzungen:**

1. **Diese Spec-Sitzung 15** — Form festlegen (Sub (e) Pflicht,
   Sub (a)+(b) optional).
2. **Bau-Sitzung 15** — `src/modules/15_membran.js` implementieren
   (Sub (e)-Teil; (a)+(b) nur falls in Spec gefüllt), Lampe in
   `index.html` einbauen, `tests/manual_check.html` um Panel 15 mit
   Knöpfen ergänzen.
3. **Sichttest** durch Klaus am Tablet (DeX-Chrome + Tablet-Chrome,
   beide Browser-Instanzen — siehe `docs/OBSERVATORIUM_BROWSER.md`).
4. **Einbau-Sitzung 15** in Endknoten-PWAs (Rezeptbuch + Mixarium)
   — analog Modul 09-Pfad. Lampe + Detektor übernehmen.

**Warum nicht direkt bauen ohne Spec?** Karte 15 ist die erste
Karte, die in die UI-Schicht der Sage-Page hineinreicht (alle bisherigen
Module sind reine JS-Module ohne `index.html`-Eingriff). Eine Spec
erzwingt, dass die Modal-Variante, die Persistenz-Schicht und die
Lampen-Pulse-Semantik einmal sauber überlegt sind, bevor Code dafür
geschrieben wird — sonst entstehen drei Halb-Lösungen parallel und
müssen zurückgerollt werden.
