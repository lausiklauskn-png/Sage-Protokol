# Modul 00 — Doku-Fenster ("5-Klick versteckte Funktion")

**Status:** Schablone (Spec ausstehend)
**Datei (Code):** `src/modules/00_doku_fenster.js`
**Abhängigkeiten:** keine (kann jederzeit gebaut werden)

---

## Zweck

In den Endknoten-PWAs (Rezeptbuch, Mixarium) liegt das SBKIM-System
zunächst unsichtbar im Hintergrund. Damit der Betreiber und vertraute
Mitnutzer den **Entwicklungsstand des Knotens** einsehen können, ohne
dass ein zufälliger Nutzer davon irritiert wird, gibt es eine versteckte
Enthüllungs-Geste: **fünf Klicks auf das Such-Symbol** der App öffnen
ein Statusfenster.

Das Fenster ist **kein Datenexport**. Es zeigt nur:

- Knoten-ID (Kurzform)
- Knotentyp und Domäne
- Welche Module aktiv sind und wie sie sich melden
- Letzte Anastomose-Versuche (anonymisiert: nur Zähler, kein Inhalt)
- Aktuelle Liste der Geschwisterknoten (nur Anzahl + Domänen)
- Letzter Sichttest pro Modul (Datum + ✓/✗)

---

## Verantwortung

**Macht:**
- Klickzähler auf das vorhandene Such-Symbol/Icon (kein neues Element)
- Bei Erreichen der Schwelle (`DOKU_REVEAL_CLICKS`, default 5):
  modales Fenster mit Status öffnen
- Status zur Laufzeit aus den anderen Modulen ziehen (nur Lesen)
- Schließen-Knopf, Klickzähler reset bei Schließen

**Macht nicht:**
- Kein Daten-Export (nichts wird heruntergeladen, nichts gesendet)
- Keine Konfigurations-Änderungen
- Keine personenbezogenen Daten
- Kein Login, kein Schutz — die Geste *ist* der Schutz

---

## Schnittstelle

*(noch zu spezifizieren — Spec-Sitzung füllt aus)*

```
init(options: {
  searchIconSelector: string,        // CSS-Selektor des Such-Symbols
  revealClicks?: number,             // Default: 5
  windowTitle?: string,              // Default: "SBKIM-Knotenstand"
})

renderStatus() → HTMLElement
  // baut das Status-Fenster aus aktuellem Knotenzustand
```

---

## Konfigurationswerte (zentral)

```
DOKU_REVEAL_CLICKS = 5     // siehe ARCHITEKTUR.md §7
```

---

## Manueller Test (gehört in tests/manual_check.html)

1. Test-PWA mit eingebautem Modul 00 öffnen.
2. Such-Symbol fünfmal anklicken.
3. Erwartung: Statusfenster erscheint, zeigt mindestens Knoten-ID und
   "Modul X aktiv / inaktiv"-Liste.
4. Schließen, viermal klicken: nichts. Fünftes Klick: erscheint wieder.
5. Erwartung: keine Konsolen-Fehler.

---

## Risiken / Edge Cases

- Such-Symbol existiert in jedem Endknoten unter anderem Selektor →
  `searchIconSelector` muss konfigurierbar bleiben.
- Mobile Touch: 5 schnelle Taps. Schwelle für "schnell genug" definieren?
- Versehentliches 5-faches Klicken durch Endnutzer → harmlos, keine
  Datenpreisgabe, nur unerwartetes Fenster. Akzeptabel.

---

## Querverweise

- `docs/ARCHITEKTUR.md` §7 (Konfigurationswerte)
- `sbkim_integration.md` — kein direkter Bezug, dieses Modul ist
  Sage-Protokol-Eigenleistung
- Andere Module: liest Status, ändert nichts

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Karte angelegt | 2026-05-10 | Skelett | leere Schablone |
| Spec gefüllt | — | — | — |
| Code geschrieben | — | — | — |
| Sichttest | — | — | — |
| In Endknoten eingebaut | — | — | — |
