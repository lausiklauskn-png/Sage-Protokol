# Übergabeprotokoll — Bau 22 Mehrfach-Suche (App/Knoten/Internet + Richter-Schalter)

**Datum:** 2026-06-21
**Rolle:** Bau-Sitzung Modul 22 (Folge zu Increment 1 + Sage-Korpus)
**Branch:** `claude/bau-22-mehrfachsuche`

---

## Auftrag (Klaus)

Mehrfach-Suche: drei **getrennt wählbare** Such-Bereiche (mehrere zugleich
ankreuzbar) — **Knoten** (im Mycel), **App/Seite** (lokal), **Internet** (Netz).
Getrennt + nutzer-gewählt → kein Widerspruch zum Empfangsmodus, weil das Widget
ein **Pilz-Werkzeug (Schicht 2)**, kein Mycel-Knoten ist. Dazu: der **KI-Richter
abschaltbar** (Default aus → läuft „über die Bedeutung" = semantischer Cosinus,
gratis). Internet als semantischer Re-Ranker über viele Roh-Treffer (BLP-Muster:
Eingang → in-App-Sortiermaschine).

## Getan

- **Modul 22 — Mehrfach-Suche-Engine** (`runMultiSearch`): Bereiche
  `app`/`knoten`/`internet`, je Cosinus-Kandidaten (`queryCorpus` über Modul 04),
  zusammengeführt + nach Score sortiert, **Quellen-Badge** pro Treffer. Internet
  separat (Kandidaten ODER `webLink`).
- **KI-Richter an/aus** (`richter`-Option/Toggle, Default false): aus →
  `mode:"semantisch"` (gratis); an + Key → ein `hybridMatch`-Aufruf über die
  zusammengeführte Spitze, fail-soft zurück auf semantisch.
- **Internet-Bereich:** ohne `searxngUrl` → `webLink` (neuer Tab, DuckDuckGo);
  mit `searxngUrl` → `fetchSearxngResults` (~50, `format=json`) → `embedPassageBatch`
  (Modul 03) → `queryCorpus` → semantische Web-Treffer inline. Fetch-Fehler →
  Fallback `webLink`.
- **Knoten-Korpus** `sbkim/sage-knoten-korpus.js` (6 verbundene Knoten, rein
  lokale Sporen-Daten, keine Netz-Anfrage). `prepareNodeCorpus` lazy.
- **UI:** Bereichs-Checkboxen + Richter-Toggle + SearXNG-URL-Feld (nur sichtbar
  wenn Internet aktiv) + Quellen-Badges + Web-Link-Karte. Drag ignoriert die neuen
  Controls (`isInteractiveTarget`).
- **Wiring:** `sbkim-init.js` mountet mit `prepareCorpus` (App) + `prepareNodeCorpus`
  (Knoten); `index.html` lädt beide Korpus-Dateien. Panel 22 (`manual_check.html`)
  aktualisiert (App-Suche semantisch + Internet-webLink + erweitertes `_meta`).
- **Tafel-Versöhnung** Empfangsmodus/Pilz in CLAUDE.md § „Was du nicht tust"
  ausdrücklich festgehalten.
- **Docs:** Karte 22 § Mehrfach-Suche; INTERFACES § Modul 22 (Optionen/`_meta`/
  `SearchResult`-Modi); CLAUDE.md Modul-Tabelle.

## Geprüft

- `node --check` für `22_such_widget.js`, `sbkim-init.js`, `sage-knoten-korpus.js` grün.
- `node tests/smoke_bau22_such_widget.mjs` → **79/79**.
- Regression `smoke_bau17` 36/36, `smoke_bau21` 45/45 grün.
- Panel-22-Inline-Script `node --check` grün.

## Offen

1. **Klaus' Browser-Sichttest** der Mehrfach-UI (Checkboxen, Richter-Schalter,
   Internet-neuer-Tab) — headless ersetzt ihn nicht.
2. **Eigene SearXNG-Instanz** für den Internet-Re-Ranker (öffentliche Instanzen
   blocken JSON/CORS meist). Anleitung als Folge-Notiz möglich.
3. **Sage cap/needs** in die Spore (BLP-Drei-Schichten-Bitte) — Spore Re-Sign.
4. **Increment 2** — Widget-Kopplung über Modul 15 („passt in jede App").

## Nächster sinnvoller Schritt

Klaus' Sichttest der drei Bereiche + Richter-Schalter; danach SearXNG-Instanz-
Anleitung oder Increment 2.

## Sicherheit / Tabus

App + Knoten rein lokal (keine Netz-Anfrage; Empfangsmodus voll gewahrt). Internet
= bewusster, nutzer-ausgelöster Pilz-Egress (Schicht 2), CLAUDE.md-konform. Richter-
Schlüssel BYOK, nie persistiert. Modul 03/04/21 nur über Schnittstellen. Kein
IndexedDB, kein PROTOCOL_VERSION-Bump. SearXNG-Treffer (Web-Inhalt) sind faktisch
`untrusted external data` — werden nur als Such-Korpus eingebettet, nie als
Anweisung ausgeführt.
