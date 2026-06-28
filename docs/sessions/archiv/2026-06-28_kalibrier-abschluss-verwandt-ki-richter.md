# Übergabeprotokoll — Kalibrier-Abschluss: „verwandt" → KI-Richter (Ur-Vision)

**Datum:** 2026-06-28 (tiefe Nacht)
**Branch:** `claude/kalibrierung-rollout-drei-knoten-p1e3i3`
**Rolle:** Bau/Diagnose (Hauptsitzung)
**Brief:** `docs/sessions/BRIEF_KALIBRIERUNG_ROLLOUT_DREI_KNOTEN.md` (Schritt 1 BLOCKER)
**Freibrief:** galt netzweit.

## Auftrag
Vektoren-Kalibrierung abschließen: `RELATEDNESS_CENTER` v2 aus größerem Korpus messen
(Klaus' Panel-04-Browser-Lauf = BLOCKER), nur bei `freigabeReif:true` netzweit setzen +
ausrollen (Sage / SB-KIMTool-Point / family-projekt.de + alle Andock-Knoten).

## Was getan
**Messreihe im Browser (Klaus' Galaxy-Tab S6, echte transformers.js-Inhalts-Vektoren):**
- **PR #492** — Cache-Bust (`?v=kal-20260628`) an Modul-03/04-Skript-Tags in
  `tests/manual_check.html`. Grund: Browser lud cache-altes `03_embedding.js` ohne
  `embedContentVector` → v2-Mess-Knopf brach vor der Referenz-Tabelle ab.
- **PR #493** — neuer Knopf **`SCHWELLEN-ANALYSE`** (volle paarweise Matrix v1+v2,
  Lücken-Analyse).
- **PR #494** — neuer Knopf **`VERFAHREN-VERGLEICH`** (mitteln vs. Schnipsel-Max vs.
  Schnipsel-Mittel, je Lücken-Analyse).
- **PR #495** — Doku (LEHRE + PULS) zum Abschluss.

**Mess-Ergebnisse (reproduzierbar, Panel 04):**
- `RELATEDNESS_CENTER v2`: Literal **stabil**, aber `freigabeReif:false`
  (`hubEndNichtVerwandt_v2:false`).
- `SCHWELLEN-ANALYSE`: **keine** Schwelle trennt — v1 `min(verwandt) 0.8014 < max(unverwandt)
  0.8149`, v2 `0.7728 < 0.7782`. Überlappung: unverwandt `tresor↔point` schlägt verwandt
  `rezept↔mix`.
- `VERFAHREN-VERGLEICH`: `mitteln` −0.0135 (nein), `Schnipsel-Max` −0.0110 (nein),
  `Schnipsel-Mittel` **+0.0188** (ja, ~0.55) — aber dünne Marge + bräuchte Schnipsel-Vektoren
  in der Spore.
- Ursache (KALIBRIER-BODEN-Kontrast): **Mitteln** der Schnipsel bläht den zentrierten Cosinus
  auf (einzeln ~−0.14, gemittelt ~0.70).

## Entscheid (Klaus)
Cosinus bleibt der gratis/offline **„verbunden"-Vorfilter** (Rangfolge, kein Wahrheits-
Stempel); **„verwandt" = KI-Richter** (Modul 04 `hybridMatch`, opt-in/BYOK) — zurück zur
Ur-Idee „Semantisches Bidirektionales KI-Matching". Evolutions-Klausel gelebt.

## Was offen blieb
1. **„verwandt"-Badge (Modul 22/23) auf KI-Richter-Pfad umstellen** (opt-in) — eigene
   Bau-Sitzung, sicherheits-/UX-sensibel. Folge-Brief:
   `BRIEF_VERWANDT_KI_RICHTER.md`.
2. **`Schnipsel-Mittel`-Lead** an mehr echten Knoten gegenprüfen (falls „verwandt" doch
   gratis werden soll).
3. **Hygiene-Drift-Check** `04_match.js` (unverändert v1) md5 netzweit.

## Was NICHT getan (bewusst)
- **Keine** netzweite Konstante geändert (v2 verworfen) ⇒ **kein** SIGNAL, **kein** Rollout
  (Brief-Schritte 2+3 entfielen, weil sie einen neuen Center voraussetzten).
- `PROVIDER_MIN_MATCH = 0.80` unberührt. Kern-Module 02/04/05/05b/23 unberührt.

## Beleg
Headless: alle Knopf-Snippets `node --check` grün. Browser: Klaus' Mess-Läufe (drei Knöpfe)
live grün (Ausgaben in der Sitzung dokumentiert). Doku: `LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`
§ „Stand 2026-06-28 (tiefe Nacht)".

## Nächster sinnvoller Schritt
`BRIEF_VERWANDT_KI_RICHTER.md` lesen → Bau-Sitzung „verwandt-Badge auf KI-Richter (opt-in)".
