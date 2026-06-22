# Übergabeprotokoll 2026-06-22 — Such-Werkzeug: Resize, Standalone-PWA, Brainstorm

**Rolle:** Lange interaktive Such-Werkzeug-Sitzung mit Klaus (Galaxy-Tab-S6, Termux +
Chrome). Drei Bau-Blöcke + ein ausführlicher Brainstorm.

## Gebaut & gemerged
1. **PR #388 — Modul 22 Such-Panel größer ziehbar (Resize-Griff).** Breite
   (`panelWidth` 240…760) + Lesefeld-Höhe (`resultsHeight` 120…0.72·vh) gleichzeitig
   ziehbar, Persistenz `localStorage` `sbkim_search_widget_size`, Drag-Konflikt getrennt.
   Surface `+getSize/setSize`. Smoke 162/162. **Browser-Sichttest grün** (Größe bleibt
   nach Hard-Reload; Höhe = Maximal-Höhe, wächst mit Treffermenge — von Klaus gewollt).
2. **PR #389 — `such-tool/` eigenständige, installierbare PWA + 1:1-Vorlage.**
   index.html + manifest.json + sbkim-sw.js (fetch-Handler) + impressum.html
   (Platzhalter, keine PII) + Icons (Node-zlib) + modules/ (Kopien 03/04/21/22).
   Konzept-Karte `_standalone_such_tool.md`. Smoke 46/46 (inkl. Drift-Guard).
   **Kern-Lehre:** Download (file://) wird nie eine App — PWA braucht Hosting + Manifest
   + SW + eigenen Scope. **Installations-Sichttest am Tablet offen** (Seite rendert live).

## Termux-Lehren (für die nächste Sitzung wertvoll)
- **Kein `/tmp` in Termux** → `nohup … >/tmp/…` bricht ab. Logs nach `~/…` schreiben.
- **`python3 -m http.server` ist single-threaded** → hängt, wenn Browser + Service-Worker
  parallel viele Dateien holen (Symptom: Hintergrund lädt, Inhalt bleibt leer). Lösung:
  threaded + IPv6-fähig:
  `python3 -c "import socket,http.server as h; h.ThreadingHTTPServer.address_family=socket.AF_INET6; h.ThreadingHTTPServer(('::',8000),h.SimpleHTTPRequestHandler).serve_forever()"`
- Branch-Wechsel zum Testen: `git checkout -f <branch>` + `git reset --hard origin/<branch>`,
  dann `git branch --show-current` + `ls <ordner>` zur Kontrolle, bevor der Server startet.
- Browser aus Termux öffnen: `am start -a android.intent.action.VIEW -d "<url>"`.

## Briefkasten
- `sbkim/AUSTAUSCH.md`: Brief an SB-KIMTool-Point (Standalone-Tool eigener-Ordner-Bau +
  Scope-Falle + Resize-Abgleich, Rück-Quittung erbeten).
- `sbkim/SIGNAL.json`: seq 31 → 32 (Push = Signal).

## Brainstorm → Folge-Sitzung
Voll festgehalten in `docs/sessions/BRIEF_BAU_22_VOLLBILD_MERKEN.md`. Kern:
- **„Ein Werkzeug, zwei Gestalten":** Begleiter (Pille, Standard) ↔ Suchraum (⛶ Vollbild,
  auf Wunsch, NICHT auto-start).
- **Merken-Liste:** Haken pro Treffer, gruppiert nach Suchfrage, localStorage (Text+Link),
  für Web/App/Knoten.
- **Treffer-Detail-Karte (Overlay):** [📌 Merken] + [↗ Seite öffnen im neuen Tab]; die
  echte fremde Seite ist **nicht einbettbar/umfärbbar**, Merken läuft aus unserem Overlay.
- **Splitscreen-Fix:** Pille bei Viewport-Änderung ins Sichtfeld zurück-klemmen.
- **Vergleich (offen, Klaus-Wahl):** Form 1 (zwei Spalten/Server) · Form 2 (neuer Tab) ·
  Form 3 (eigener eingebetteter Server).
- **KI-Recherche:** automatisch nur **Claude** (CORS); Gemini/ChatGPT/Perplexity nur
  Kopier-Pfad oder Proxy.
- **Pilz-Server + Geld:** serverless empfohlen (skaliert, gratis bei wenig Last);
  Kostentreiber = KI-Aufrufe; **BYOK gratis / Pro = Server-Dienst**; **PayPal-Einmalkauf**
  statt Pro-Klick; **Kopier-Schutz = Dienst verkaufen, nicht offenen Code** (Freischaltung
  an Server binden).

## Nächster sinnvoller Schritt
1. Klaus' **Installations-Sichttest** `such-tool/` (App installieren → eigenes Fenster).
2. Klaus' **Vergleichs-Form-Wahl** (1/2/3) — Richtungsentscheid.
3. Folge-Sitzung mit `BRIEF_BAU_22_VOLLBILD_MERKEN.md`: Splitscreen-Fix → Vollbild →
   Merken-Liste (je eigener PR, Sichttest abwarten).
