# Übergabeprotokoll — „Wählen"-UI: Umschalter verbunden ↔ verwandt (Modul 22)

- **Datum:** 2026-06-28 (Nacht)
- **Rolle:** Bausitzung
- **Branch:** `claude/brief-ui-selection-neh6gx`
- **Brief:** `docs/sessions/BRIEF_WAEHLEN_UI_GROB_GENAU.md`
- **Freibrief:** gilt (CLAUDE.md § Freibrief) — additiv, getestet, abgegrenzt.

## Was getan

Das in Bau 04.E (PR #480) gebaute **zweite Maß** (`relatedness()`, zentrierter
Cosinus) in eine **sichtbare Auswahl** im Such-Widget (Modul 22) verdrahtet —
genau Klaus' Idee „zwei Messungen wählen".

**Umschalter** in der Optionen-Zeile des Widgets:

- **„🧬 verwandt (genau)"** schaltet die Anzeige-Sicht:
  - **„verbunden" (grob, Default):** Treffer in roher Cosinus-Reihenfolge (gewohnt).
  - **„verwandt" (genau):** nach `relatedness()` absteigend umsortiert; echte
    Themen-Verwandte oben, fremde Domänen unten; 🧬-Badge je Treffer.
- **„nur verwandte"** (nur im verwandt-Modus sichtbar): blendet nicht-`isRelated`
  (fremde) Domänen ganz aus.

**Disziplin gewahrt:**

- **Reine Anzeige-Schicht** — `relatedness()` gatet nichts. Andock-Handshake
  (Modul 05, `PROVIDER_MIN_MATCH` 0.80) unberührt (Regressionscheck grün). **Modul 04
  nicht angefasst** (nur öffentliche Fläche `relatedness`/`isRelated` genutzt).
- Query-Vektor (Modul 03 `embedQuery`, RAM-only) + Treffer-`passageVec` reisen durch
  die Kandidaten; **nichts davon persistiert** (kein PII, keine Vektor-Last in LS).
- **Fail-soft** durchgehend (ohne Modul 04 / queryVec / passageVec → „verbunden");
  `relatedness()` `InvalidVectorError` pro Treffer abgefangen.
- User-Wahl persistiert in `sbkim_search_widget_view`; Default „verbunden".

## Geänderte/neue Dateien

- `src/modules/22_such_widget.js` — Umschalter-UI + `rankView`/`displayTreffer` +
  `setViewMode`/`getViewMode`/`setRelatedOnly` + `_meta` + passageVec-Durchreichung +
  `computeQueryVec` + Persistenz + CSS-Badge/Row.
- `such-tool/modules/22_such_widget.js` — byte-identische Kopie (Drift-Guard).
- `tests/smoke_bau22e_waehlen.mjs` — neu, 27/27.
- `docs/INTERFACES.md` §1 Modul 22 (Surface + `_meta` + options + Smoke-Stand).
- `docs/components/22_such_widget.md` — neuer § Anzeige-Sicht.
- `docs/PULS.md` — neuer Tageseintrag.
- `CLAUDE.md` — Modul-22-Statuszeile.

## Tests

- `smoke_bau22e_waehlen.mjs` **27/27** (an echten Knoten-Domänen-Vektoren).
- Regression: `smoke_bau22` 257/257 · `smoke_bau04e` 29/29 · `smoke_bau04d` 68/68 ·
  Standalone-Drift-Guard 46/46.
- **Manual-Check:** `tests/manual_check.html` Panel 22 lädt das geänderte Modul
  unverändert; der Umschalter ist Teil der Live-Widget-UI (kein neuer Panel-Knopf
  nötig). **Browser-Sichttest wartet auf Klaus** (headless ersetzt ihn nicht).

## Offene Punkte / nächster sinnvoller Schritt

1. **Browser-Sichttest des Umschalters** (Klaus): Widget öffnen → „🧬 verwandt"
   ankreuzen → prüfen, ob echte Verwandte hochsortieren, Fremde unten/ausgeblendet.
2. **Pinnwand-Folge-Sitzung** (optional): denselben Zwei-Maß-Schalter auf die
   Pinnwand übertragen (`.a-score` roh → zentriert, Richter opt-in). Befund: ja,
   profitiert; bewusst abgegrenzt gelassen.
3. **Modul-23-UI-Verwandtschafts-Badge** (optional): pro Knoten im Rendezvous-Raum
   den zentrierten Verwandtschafts-Score zeigen (zweiter Einbau-Ort aus dem Brief).
