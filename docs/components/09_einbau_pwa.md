# Modul 09 — Einbau in bestehende PWA (Anleitung)

**Status:** Schablone (Spec ausstehend)
**Datei (Code):** keine — diese Karte *ist* die Anleitung
**Abhängigkeiten:** alle Module, sobald sie eine erste stabile Version haben

---

## Zweck

Diese Karte beschreibt, wie ein in Sage-Protokol entwickeltes Modul
oder die Gesamtschicht in eine bestehende PWA eingebaut wird. Adressaten
sind die Endknoten-Apps des Betreibers:

- **Rezeptbuch** (Domäne: Kochrezepte)
- **Mixarium** (Domäne: Cocktails / Drinks)

Die Anleitung orientiert sich an `sbkim_integration.md`, ist aber auf
den Reife- und Bauzustand dieses Repos abgestimmt.

---

## Vor dem Einbau zu klärende Werte (pro Endknoten)

| Wert | Rezeptbuch | Mixarium |
|---|---|---|
| `<DOMAIN>` | (TBD) | (TBD) |
| `<KNOTENNAME>` | "Rezeptbuch Klaus" | "Mixarium Klaus" |
| `<KNOTENTYP>` | hybrid | hybrid |
| `<DOMÄNEN-BESCHREIBUNG>` | TBD (1–3 Sätze) | TBD (1–3 Sätze) |
| `<DOMÄNEN-STICHWORTE>` | TBD (5–15 Begriffe) | TBD (5–15 Begriffe) |
| `<INDEX-DATEI>` | `index.html` | `index.html` |
| `<SUCH-SYMBOL-SELEKTOR>` (für Modul 00) | TBD | TBD |
| `<LOKALE-SUCHFUNKTION>` (Name in der App) | TBD | TBD |

---

## Einbau-Schritte (Skizze, Spec füllt aus)

1. **Modul-Snippets aus `src/modules/` kopieren** in die Endknoten-PWA
   (eingebettet in den `<script>`-Block oder als externe `.js`-Dateien).
2. **Initialisierungs-Block** vor `</body>` einfügen
   (`Sbkim.init({...})`-Aufruf mit obigen Werten).
3. **Spore generieren** (einmalig) und unter
   `/.well-known/sbkim/spore.json` ablegen (oder Alias für GitHub Pages).
4. **Suchfunktion einklinken** — `smartSearch()`-Wrapper um die
   bestehende lokale Suche.
5. **Doku-Fenster aktivieren** — Modul 00 mit dem Such-Symbol-Selektor.
6. **Sichttest in Endknoten-PWA** — 5-Klick-Doku öffnet sich, Spore
   abrufbar, eine Test-Anfrage von außen wird korrekt beantwortet
   oder ignoriert.

---

## Nach dem Einbau zu pflegen

- `docs/PULS.md` in Sage-Protokol: Endknoten-Tabelle aktualisieren
  ("integriert: ja, Stand 2026-MM-DD").
- Bei Domain- oder Domänenwechsel: Spore neu generieren und neu
  deployen.
- Bei Protokoll-Versions-Update in Sage-Protokol: Endknoten nachziehen.

---

## Was nicht in den Endknoten gehört

- Keine Test-Knöpfe aus `tests/manual_check.html` in die
  Produktiv-App übernehmen.
- Keine Konsolen-Logs auf `info`-Level für jeden Match (nur Fehler).
- Kein Auto-Reveal der Doku — die 5-Klick-Geste ist Pflicht.

---

## Querverweise

- `sbkim_integration.md` (Originalleitfaden)
- `docs/components/00_doku_fenster.md` (Doku-Modul)
- `docs/INTERFACES.md` (Modul-Verträge)

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Spec gefüllt | — | — | — |
| Werte für Rezeptbuch eingetragen | — | — | — |
| Werte für Mixarium eingetragen | — | — | — |
| Erstmaliger Einbau Rezeptbuch | — | — | — |
| Erstmaliger Einbau Mixarium | — | — | — |
