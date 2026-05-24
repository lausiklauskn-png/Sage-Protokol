# Übergabeprotokoll — Pflege Karte 15 Hochstufung + Sub (e) Fremdzugriff-Lampe

**Datum:** 2026-05-24
**Sitzungs-Rolle:** Pflege-Hauptsitzung (kein Modul-Code in `src/`,
kein UI-Eingriff in `index.html`, kein neuer Modul-Vertrag in
INTERFACES.md — reine Doku-Pflege + Vorbereitungs-Brief).
**Branch:** `claude/gemini-flash-sage-protocol-41Dx5`.
**Brief:** Keiner — Sitzung wurde direkt durch Klaus' Chat-Frage
ausgelöst („Gemeni 3.5 flash darum geht es" + Folge-Anweisung
„stufe es auf Hoch ein. Wichtig noch in der Navileiste eine Lampe …").

---

## Auslöser

Klaus hat in der laufenden Chat-Sitzung gefragt, was Gemini 3.5
Flash sei und wie es zum Sage-Protokol stehe. Antwort (WebSearch
auf Google I/O 2026):

- Google hat auf der I/O 2026 (19./20. Mai) **Gemini 3.5 Flash** als
  neues **Default-Modell** in der **Gemini-App** und in der
  **Google-Suche (AI Mode)** ausgerollt — global.
- Slogan „built to act, not just answer" — agentisch (Schwerpunkt
  Coding + Tool Use).
- Für Entwickler via Google AI Studio, Gemini API, Android Studio.
- Klaus' Erst-Eindruck („Standard für jede App auf dem Tablet")
  wörtlich so nicht angekündigt, aber die Richtung stimmt — Google
  drängt das Modell als Default ins ganze Android-/Such-Ökosystem.

Klaus hat daraufhin entschieden:

1. **Karte 15 (Membran) Priorität niedrig → hoch.**
2. **Neue Sub (e) auf Karte 15:** dritte Lampe in der Sage-Page-
   Navleiste, rechts neben „Lebendig" (grün) + „Verbunden" (grün/
   gelb) — eigentlich `#lamp-alive` „lebt" und `#lamp-traffic`
   „verkehr". Neue Lampe **rot**, zeigt **Fremdzugriff** an
   („von wem auch immer"). Klick auf die Lampe öffnet ein Fenster,
   das zeigt, was gerade passiert.

Diese Sitzung schreibt die Doku nach + legt den Brief für die
spätere Spec-Sitzung 15 an. Code-Bau (Modul-JS + Lampe in
`index.html`) bleibt explizit Folge-Sitzungen vorbehalten.

---

## Was getan wurde

### Doku-Pflege

1. **`CLAUDE.md`** — Modul-Tabelle Zeile 15: Status `Priorität
   niedrig` → `**Priorität hoch** (2026-05-24, Auslöser Gemini 3.5
   Flash)`. Erläuternder Absatz unter „Karten 14 + 15 sind proaktive
   Backlog-Karten" um „Hochstufung Karte 15 — 2026-05-24" ergänzt
   (drei Sätze: Anlass + Sub-(e)-Anker + Bau-Vorbehalt).

2. **`docs/components/15_membran.md`** — fünf additive Eingriffe:
   - Status-Zeile auf „Priorität hoch" + Anker-Erweiterung
     („**Navleisten-Lampe** (Sub (e))").
   - Einleitungs-Absatz um Gemini 3.5 Flash als Auslöser-Beispiel
     erweitert.
   - Neuer Abschnitt **„Hochstufungs-Notiz 2026-05-24 (Auslöser
     Gemini 3.5 Flash)"** direkt unter dem Mycel-Bild — drei
     Absätze, schließt mit „Was sich NICHT ändert" (Empfangsmodus-
     Prinzip bleibt unangetastet).
   - Neuer **Sub (e) — Fremdzugriff-Detektor + Navleisten-Lampe**
     im Sub-Bereiche-Block. Enthält: API-Schablone
     (`window.SbkimMembrane.fremdzugriff.{list,subscribe,clear}` +
     `FremdzugriffEntry`-Schema), Lampen-Anker (Position, Default-/
     Aktiv-Zustand, Click-Verhalten), strikte Tabus (Lampe
     blockiert nicht — Filter gehört in Karte 12; keine PII;
     Ringbuffer statt Audit-Log; same-origin zählt nicht als
     fremd), Architektur-Trennung Detektion vs. Anzeige,
     Hochstufungs-Begründung.
   - Neue offene Fragen-Liste **„Für Sub (e) — Fremdzugriff-
     Detektor + Lampe"** (sechs konkrete Spec-Fragen: Ringbuffer-
     Größe N, Persistenz-Schicht, Modal-Form, Pulse-Verhalten,
     Endpoint-Probe-Erkennung „fremd", `decision: "rejected-
     allowlist"`-Behandlung).
   - Schwellwert-Block (§ Wann ziehen) um Sofort-Ziehung-Klausel
     für Sub (e) ergänzt; Sub (a)+(b)+(c) bleiben an ursprünglicher
     Schwelle hängen.
   - Bauzustand-Tabelle: neue Zeile „Hochstufung + Sub (e) ·
     2026-05-24 · Pflege-Hauptsitzung Gemini-3.5-Flash-Anlass".
   - „Wird genutzt von"-Querverweis um Gemini 3.5 Flash + Klaus'
     Lampen-Schau erweitert.

3. **`status.json`**:
   - `lastUpdated`: 2026-05-21 → 2026-05-24.
   - `membranBacklog[0].siegel`: „Stub (Backlog), Priorität niedrig"
     → „Stub (Backlog), Priorität hoch (2026-05-24, Auslöser
     Gemini 3.5 Flash)".
   - `membranBacklog[0].kurz`: Sub-Bereich-Aufzählung von vier auf
     fünf erweitert (neuer Sub (e) Fremdzugriff-Detektor + rote
     Navleisten-Lampe). Hochstufungs-Notiz mit Reihenfolge-Hinweis
     (Sub (e) sofort, Sub (a)+(b)+(c) weiter an Schwelle).

4. **`docs/PULS.md`**:
   - Tabellen-Zeile „15 membran" um fünften Sub-Bereich +
     Hochstufungs-Notiz + Brief-Verweis erweitert.
   - Neuer Sitzungs-Eintrag oben (vor 2026-05-22 Pflege Modul 01)
     mit Kern-Beschreibung, Was-angefasst-wurde-Liste, „bewusst
     NICHT gemacht"-Block (vier Punkte), offene Spec-Fragen-Verweis,
     nächster sinnvoller Schritt.

5. **Pie-Block in PULS.md** automatisch via `python3 scripts/update_puls_pie.py`
   neu generiert. Daten 5/0/0/7/3 unverändert (Modul 15 zählt
   weiter als Schablone), nur Datum aktualisiert (2026-05-21 →
   2026-05-24).

### Neuer Brief

**`docs/sessions/BRIEF_SPEC_15_MEMBRAN.md`** — Vorbereitungs-Brief
für die spätere Spec-Sitzung 15:

- Schwerpunkt **Sub (e) Fremdzugriff-Lampe** (Pflicht).
- Sekundär Sub (a)+(b) (wenn Zeit + Token reichen).
- Zurückgehalten Sub (c)+(d) und Bau-Sitzung 15.
- Brief-Codeblock im Markdown-Fence (CLAUDE.md § Pflicht am
  Sitzungsende Punkt 6) zur direkten Übernahme in die erste
  Prompt-Zeile der Spec-Sitzung.
- Acht konkrete Sub-(e)-Punkte zum Abarbeiten (Lampen-Anker, Modal,
  JS-API, Schema, Persistenz, „Fremd"-Definition, INTERFACES.md-
  Spiegelung, ggf. neue Konstanten in § 0).
- Klare Tabus (kein src/-Code, kein index.html-Eingriff, kein
  Empfangsmodus-Bruch).
- Pflicht-am-Ende-Liste inkl. Brief-Codeblock für Folge-Bau-Sitzung.

---

## Was bewusst NICHT gemacht wurde

- **Kein `index.html`-Eingriff.** Die dritte Lampe baut erst die
  Bau-Sitzung 15 nach der Spec-Sitzung 15. Diese Sitzung legt nur
  den Spec-Anker — wer jetzt Code schreibt, würde Klaus' Spec-
  Entscheidungen vorgreifen (Modal-Form, Persistenz-Schicht,
  Pulse-Verhalten).
- **Kein `src/modules/15_membran.js`** angelegt. Membran-Code
  wartet auf Spec-Sitzung 15.
- **Kein INTERFACES.md-Eingriff.** Karte 15 spiegelt in INTERFACES
  erst, wenn die Spec gefüllt ist (Spec-Sitzung-15-Pflicht analog
  Spec-Sitzungen 00–09).
- **Kein WebSearch-Befund mit unvollständigem Datum.** Brief und
  Karte 15 zitieren das Google-I/O-2026-Datum (19./20. Mai) wörtlich
  aus den Search-Quellen (Android Authority, Yahoo Tech, 9to5Google,
  MarkTechPost, Google Blog) — keine Spekulation darüber, ob
  Gemini 3.5 Flash bereits im Chrome-Browser auf Tablets aktiv ist
  (Klaus' Sichttest am Tablet beantwortet das, nicht diese Sitzung).
- **Kein Schwesternetz-Schutz-Modul aktiviert.** Karten 10–12
  (Reputation / Rate-Limit / Blocklist) bleiben Priorität niedrig.
  Sub (e) ist explizit **beobachtend**, nicht filternd — Filter-
  Verhalten gehört zu Karten 11+12, nicht zu 15.

---

## Heilige Tafeln — keine Spannungen

Diese Sitzung berührt drei Heilige Tafeln, ohne sie zu spannen:

1. **CLAUDE.md § „Was du nicht tust" — „Kein Modul-Code ohne
   Auftrag".** Pflege-Sitzung, kein Bau-Auftrag — passt.
2. **CLAUDE.md § „Empfangsmodus-Prinzip".** Sub (e) ist passive
   Beobachtung + Anzeige, kein Eigeninitiative-Pfad. Lampe pulst
   bei EINGEHENDEM Fremdzugriff, sie schickt nicht aus.
3. **INTERFACES.md.** Wird in dieser Sitzung **nicht** geändert,
   weil Karte 15 noch keine produktive Schnittstelle bietet —
   Spec-Sitzung 15 spiegelt nach. Keine vorzeitige Spiegelung
   verhindert spätere Widersprüche.

Die Tafel-Evolutions-Klausel (CLAUDE.md 2026-05-19) ist nicht
ausgelöst — kein bestehender Vertrag verbietet die Sub-(e)-Arbeit.

---

## Nächster sinnvoller Schritt

**Spec-Sitzung 15** ziehen, sobald ein Tab/PR-Fenster frei ist.
Brief liegt bereit als `docs/sessions/BRIEF_SPEC_15_MEMBRAN.md`,
Codeblock darin direkt copy-paste-bar in den ersten Prompt der
Spec-Sitzung. Empfohlene Reihenfolge:

1. Spec-Sitzung 15 (Sub (e) Pflicht, (a)+(b) optional).
2. Bau-Sitzung 15 (Modul-Code + Lampe in `index.html` + Panel 15
   in `tests/manual_check.html`).
3. Sichttest durch Klaus am Tablet (DeX-Chrome + Tablet-Chrome,
   beide Browser-Instanzen — `docs/OBSERVATORIUM_BROWSER.md`).
4. Einbau-Sitzung 15 in Endknoten-PWAs (Rezeptbuch + Mixarium)
   analog Modul 09.

Sichttest dieser Pflege-Sitzung selbst: **entfällt** (keine Code-
Änderung, keine UI-Änderung). Klaus' Folge-Browser-Sichttest wird
erst nach Bau-Sitzung 15 fällig.
