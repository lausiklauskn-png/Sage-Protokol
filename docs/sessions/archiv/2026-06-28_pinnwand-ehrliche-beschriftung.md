# Übergabeprotokoll — Pinnwand „verwandt · KI" (ehrliche Beschriftung statt neuem Schalter)

**Datum:** 2026-06-28 (tiefe Nacht, Folge²)
**Rolle:** Pflege-Sitzung (Pinnwand-PWA)
**Branch:** `claude/pinnwand-verwandt-ki-iyzpi7`
**Brief:** `docs/sessions/BRIEF_PINNWAND_VERWANDT_KI.md`
**Freibrief:** galt (CLAUDE.md § Freibrief, netzweit). Plan-vor-Code: Befund + zwei
Richtungs-Entscheide vorab an Klaus (AskUserQuestion).

## Auftrag

Die Pinnwand (`pinnwand/index.html`, Nostr-Q&A-Brett) auf dasselbe „verwandt · KI"-Muster
bringen wie Modul 22 — opt-in, BYOK, fail-soft, ohne den Gratis-Pfad zu entfernen. Der Brief
warnte ausdrücklich: **erst prüfen, was die Pinnwand heute wirklich tut** — evtl. ist nur
ehrliche Beschriftung nötig, kein neuer Schalter.

## Befund (Plan-vor-Code)

Die Pinnwand trägt das Muster im Kern **schon** und ist sogar weiter als Modul 22:

- **Gratis-Pfad:** opt-in-Knopf „🧠 Antworten nach Bedeutung sortieren". Score = **zentrierter
  (whitened) Cosinus** (`relevance(qVec, aVec, mean)` → `whiten()`), mit **seiten-lokalem,
  wachsendem** Schwerpunkt (`accumulate`/`meanVec`, ab ≥3 Texten) — bewusst **nicht** der
  netzweite `RELATEDNESS_CENTER` (für freien Q&A-Text korrekt + besser; LEHRE 2026-06-28 Nacht).
- **KI-Richter:** schon **opt-in / BYOK / fail-soft** — Anbieter-Dropdown Claude/Gemini/OpenRouter
  (Cloud) + WebLLM (gratis im Browser), Schlüssel RAM-only (nur mit Häkchen „auf diesem Gerät
  merken" in `localStorage`), „⚖️ Richter anwenden", Urteil hat Vorrang vor Cosinus, Begründung
  je Treffer. **Gatet nichts.**

Eine frühere Sitzung kam deshalb zum Schluss „an der Pinnwand bewusst KEIN Eingriff" (LEHRE,
2026-06-28 Nacht). Der Brief reöffnete das mit zwei expliziten Fragen an Klaus.

## Klaus' Entscheide (AskUserQuestion, vorab)

1. **Pinnwand:** **nur ehrliche Beschriftung** — KEIN neuer „· KI"-Schalter (wäre redundant
   zum schon-opt-in Richter-Dropdown).
2. **Schnipsel-Mittel-Lead:** **weiter liegen lassen** (heute liefert der KI-Richter das
   verlässliche verwandt-Urteil).

## Getan (reine Anzeige + Test-Health, kein Kontrakt berührt)

- **Ehrliche Beschriftung** in `pinnwand/index.html`:
  - Cosinus-Status (aus): „… Bedeutungs-Rangfolge lädt Modell …".
  - Cosinus-Status (an): „an — Bedeutungs-Rangfolge (Zahl = Nähe zur Frage, kein
    Verwandt-Urteil — das liefert der ⚖️ KI-Richter)".
  - Footer: Cosinus explizit als **Rangfolge** (kein Verwandt-/Unverwandt-Urteil; Messreihe
    trennt das gratis nicht zuverlässig) gegen den **KI-Richter** als echtes Urteil gestellt.
  - Deckt sich mit LEHRE „Cosinus = Rangfolge, KI-Richter = Wahrheit" — dieselbe Lesart wie
    Such-Widget (Modul 22) + Raum (Modul 23).
- **Drift-Guard geheilt:** `pinnwand/modules/03_embedding.js` hing hinter `src/modules/03_embedding.js`
  zurück (PR #477 fügte `embedContentVector` nur in `src/` hinzu). Byte-1:1 re-synct; die Pinnwand
  nutzt die Funktion nicht (inert). `pinnwand/_smoke.mjs` jetzt **58/58 grün** (vorher 57/58).

## Tests

- `node pinnwand/_smoke.mjs` → **58/58 grün** (Drift-Guard wieder byte-identisch).
- `<script>`-Tag-Balance in `index.html` geprüft (3/3).

## Nicht angefasst (bewusst)

- Kein neuer Schalter, keine Kern-Logik (Embedding / Richter / Relais / Krypto) geändert.
- `RELATEDNESS_CENTER` bewusst NICHT in die Pinnwand gedrückt (falscher Schwerpunkt für freien
  Q&A-Text).
- Schnipsel-Mittel-Lead bleibt liegen.
- INTERFACES / Modul-04-Code unberührt (nur öffentliche Flächen gelesen).

## Browser-Sichttest — ✅ GRÜN (Klaus 2026-06-29)

Klaus hat die gemergte Pinnwand live geöffnet (Hard-Reload, Bedeutungs-Sortierung an): die
Cosinus-Sortierung läuft mit Score-Badges. Härtefall „…was kann ich **alkoholfreies** dazu
trinken" → „Hänchen in Cocktailsahnesoße und **echte Alkoholcocktails**" landet bei **0.16**
ÜBER mehreren harmlosen alkoholfreien Treffern. Das ist der **sichtbare Beweis**, dass der
gratis Cosinus eine **Rangfolge** ist (Thema-Nähe), kein Absichts-/Verwandt-Urteil — genau die
geschärfte Beschriftung. KI-Richter-Lauf an der Pinnwand selbst noch offen (Default aus).

## Nächster sinnvoller Schritt
- Optional: Pinnwand-Doku-Karte anlegen, falls gewünscht (heute existiert keine numerierte
  Komponenten-Karte für die Pinnwand — sie lebt als eigenständige PWA unter `pinnwand/`).
