# Übergabeprotokoll — Bau 21 Spracheingabe + Hybrid-Match-Einbau + BLP-Runden + Such-Werkzeug-Vision

**Datum:** 2026-06-21
**Rolle:** Hauptsitzung (Koordination + ein Modul-Bau) Sage-Protokol
**Branches/PRs (alle gemerged in main):** #331–#341
**Ausgangspunkt:** Bau 04.D Hybrid-Match browser-grün (Sichttest Klaus 2026-06-20/21).

---

## Was getan wurde (chronologisch)

1. **Hybrid-Match Einbau-Anleitung** `docs/HYBRID-MATCH-EINBAU.md` (#331) —
   kopierbarer Helfer `sbkimHybridSearch` (Vorfilter + Richter + Fail-soft),
   BLP-Pilot, EU-Politik. Ehrlicher Befund: Modul 02 hat keinen öffentlichen
   Signier-Helfer (Bezeugung offen).
2. **Sichttest 04.D grün** (#332) — Klaus, Panel 04 Knöpfe 16–19 alle vier grün.
3. **Anbieter-Klarstellung** (#333) — Google Vision ist KEIN Richter (Bild-API),
   gehört an die OCR-Vorstufe vor Modul 03.
4. **Lehre „Interop ist Vertrag, nicht Kopie"** (#334) — native spec-treue
   Umsetzung statt byte-Vendoring, wenn Knoten Bordmittel hat.
5. **Observatorium-Werkstatt angelegt** (#335) — Geschwister-Doku zum Browser-
   Observatorium für Nicht-Browser-Bau-Lehren; umbenannt (#336) auf Klaus' Wort.
6. **BLP-Briefkasten-Runden:** seq 14 (Hybrid-Richter gebaut, Option 1 native,
   Fail-soft browser-bestätigt, vier QA-Fixes) quittiert (#337); seq 15 (Sprach-
   Eingabe-Muster `src/ai/speech.js`) quittiert (#339). Lehre 1 → VALIDIERT,
   Lehre 3 (Prompt-Härtung), Bau-Problematik 1+2 in der Werkstatt.
7. **Bau 21 Spracheingabe** (#340) — `src/modules/21_spracheingabe.js`, Dual-
   Engine (Browser Web-Speech + EU Cloud STT BYOK), DE/EN/RU, fail-soft,
   EU-Politik frei/bindend. Headless-Smoke 45/45 grün, Panel 21, Karte,
   CLAUDE.md-Tabelle.
8. **Sichttest 21 Logik grün** (#341) — Klaus, Panel 21 drei Logik-Knöpfe,
   `browserSupport:true`.

## Werkstatt-Stand (docs/OBSERVATORIUM_WERKSTATT.md)

- Lehre 1: Interop ist Vertrag, nicht Kopie — **VALIDIERT** (BLP).
- Lehre 2: Reasoning-LLM ≠ Bild-API (Vision an OCR-Vorstufe).
- Lehre 3: Richter-Prompt-Härtung (vier BLP-Felderfahrungen).
- Offene Bau-Problematik 1: Modul 02 hat keinen öffentlichen Signier-Helfer.
- Offene Bau-Problematik 2: Drei-Schichten-Differenzierung nicht im Live-Richter
  (`hybridMatch` urteilt holistisch; `explainMatchLLM` separat).

## Klaus' Vision für Schritt 2 (Such-Widget)

Schritt 2 wird ein **separates, frei bewegliches Floating-Widget** (Klaus hat
weitere Pläne): klein im Ruhezustand, wächst bei Interaktion, eigenes Textfeld,
leicht transparent, lässt sich über fremde Suchfelder/PWAs legen und koppelt
sich dann mit der Host-PWA (liest Inhalt + interagiert aus dem Suchfeld) —
Modul-15-Membran-Territorium. Komponiert 21 + 03/04 + Knoten-Suche, EU-Politik
„frei". Drag aus Modul 17 wiederverwenden.

## Nächster sinnvoller Schritt

**Bau-Sitzung Such-Widget (Modul 22)** nach `docs/sessions/BRIEF_BAU_SUCH_WIDGET.md`
— spec-first (Karte 22 + INTERFACES), dann Widget-Shell (Drag, klein→groß,
transparent, eigenes Textfeld, Modul 21 + queryLocal + hybridMatch); PWA-Kopplung
(Membran) als Increment 2.

## Offen

- Browser-Sichttest Live-Mikrofon + EU-Engine Panel 21 (optional, Klaus).
- Modul-02-Signier-Helfer (Bezeugung).
- Fremde offene Draft-PR #302 (E2E-Vertraulichkeit) — Klaus' Entscheidung,
  konfligiert evtl. mit PULS/AUSTAUSCH.

## Hinweis

Freibrief galt (CLAUDE.md § Freibrief): alle PRs dieser Sitzung selbst
gemerged (Doku + Bau 21 headless-grün). Klaus' Browser-Sichttests separat.
