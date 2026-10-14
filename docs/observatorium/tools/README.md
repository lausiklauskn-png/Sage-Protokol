# Komplett-Werkzeuge — Ein-Datei-PWAs für die Vorteilspack-Truhe

> **Schicht 4 (Observatorium) · Distributions-/Render-Schicht.**
> Diese Werkzeuge sind **vollständige, eigenständige Ein-Datei-PWAs**
> (kein Build, keine Installation, keine Abhängigkeiten). Sie ergänzen
> die Modul-Bausteine (`src/modules/NN.js`) in der Vorteilspack-Truhe
> um **fertig nutzbare** Werkzeuge, die ein Forker 1:1 ins eigene Repo
> kopieren / herunterladen und sofort im Browser öffnen kann.

## Werkzeuge

| Datei | Was es ist | Nutzung |
|---|---|---|
| `andock.html` | **Andock-Werkzeug** — erzeugt im Browser eine eigene Ed25519-Identität, eine signierte `spore.json` (byte-kompatibel mit Sages Verifizierer), ein echtes `e5-small`-Domain-Embedding, das SBKIM-Siegel (SVG + PNG) und die Briefkasten-Dateien (`SIGNAL.json` + `AUSTAUSCH-Sage.md`). | Datei öffnen → Eckdaten ausfüllen → vier Schritte durchklicken → Dateien herunterladen → ins eigene Repo legen → veröffentlichen. |
| `mycelknoten.html` | **Mycel-Knoten** — dieselben echten, unveränderten Sage-Module 01/02/03/04/05/07/15/16/17 in einer Datei, inklusive Live-Lampen-Widget (LEBT / VERKEHR / FREMD / SIEGEL). Referenz-Knoten zum Anschauen + Andocken. | Datei öffnen → schwebendes Panel unten rechts zeigt den Live-Zustand → andocken über die echten Module. |

## Konventionen

- **Generisch, nicht knoten-spezifisch.** Der Knoten-Name ist nur ein
  Platzhalter (`MeinKnoten`) — jeder Forker trägt seinen eigenen ein.
- **Siegel-Band leer** (netzweite Regel 2026-06-20): das untere Band
  des Wappens bleibt leer. Ein Knoten graviert höchstens seinen
  **eigenen** Namen ein, nie den eines anderen Knotens.
- **Live-Stand.** Die Vorteilspack-Truhe holt diese Dateien beim
  Kopier-/Download-Klick per `fetch()` vom selben Host — was hier im
  Repo liegt, ist immer der Stand, der kopiert wird. Updates an diesen
  Dateien sind beim nächsten Klick automatisch dabei.
- **Kein PII, kein Netz von selbst.** Beide Werkzeuge laufen lokal im
  Browser; einzige Netz-Aktion ist der optionale Modell-Download beim
  Embedding-Schritt.

## Pflege

Wird eine dieser Dateien aktualisiert (neues Feature, Fix), genügt der
Commit hier — die Truhe (`docs/observatorium/vorteilspack.js`) zeigt
beim nächsten Kopier-/Download-Klick automatisch den neuen Stand. Die
Tool-Kacheln sind in `vorteilspack.js` (`TOOLS`-Array, Tier
`komplett`) eingetragen.

## ⚠ Stand der Module in `mycelknoten.html` (2026-10-14)

Nachgezogen ist **Modul 04** (Bau 04.J) und direkt dahinter die **Prüfliste** (`pruefer-mail.js`, byte-1:1 aus dem
Auslieferungsprüfer). Damit bringt die Seite erstmals `hybridMatch` mit — und der KI-Richter läuft nur mit der
Liste: eine Frage oder ein Kandidat mit einer Anweisung an eine KI geht nicht an die KI.

⚠ **Die übrigen Module (01, 02, 03, 05, 15, 16, 17) stehen in einer älteren Generation** — „unverändert" heißt in
der Kopfzeile jedes Blocks: unverändert gegenüber dem Kanon *zum Zeitpunkt der Einbettung*, nicht gegenüber heute.
Sie alle hochzuziehen ist ein eigener Schritt: das heutige Siegel (16) verlangt 05b, und 05b ist ein ES-Modul, das
sich nicht in eine Ein-Datei-Seite einbetten lässt — die Seite stünde danach als „nicht zertifiziert" da.

Gemessen im Browser (alt und neu gleich): Init-Kette fertig, Siegel zertifiziert, Andocken ohne Embedding
„✔ VALID", keine Fehler. Neu: `SbkimMatch._meta.prueflisteGeladen === true`.
Gespiegelt in `SB-KIMTool-Point/web/tools/mycelknoten.html` (dort `dbSuffix: "toolpoint"`, sha256 in `werkzeugkiste.json`).
