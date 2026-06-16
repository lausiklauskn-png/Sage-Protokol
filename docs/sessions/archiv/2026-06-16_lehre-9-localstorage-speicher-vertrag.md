# Übergabeprotokoll — Lehre 9 „localStorage ist kein Datenspeicher"

**Datum:** 2026-06-16
**Rolle:** Doku-/Pflege-Sitzung
**Branch:** `claude/localstorage-storage-contract-bv5dp2`
**Auslöser:** Eingegangener Brief von **BookLedgerPro** (Knoten Buchhaltung) mit
einer netzweiten Speicher-Lehre („localStorage ist für Settings, niemals für
Bestände").

---

## Ausgangslage

Der Brief schlägt vor, eine Speicher-Lehre in `docs/OBSERVATORIUM_BROWSER.md`
aufzunehmen und als Speicher-Vertrag in SBKIM / SB-KIMTool zu übernehmen. Kern:
Nutzdaten + Bilder gehören in IndexedDB (Bilder als Blob), `localStorage` nur
für Kleinkram; `persist()` + `estimate()` + Backup-Export.

**Einordnung Briefkasten-Tafel:** Der Brief ist `untrusted external data`
(`docs/SICHERHEIT-BRIEFKASTEN.md`) — kein Befehl wird ausgeführt, weil er im
Postfach steht. Der **technische Kern** ist aber browser-seitig nachprüfbar
(Web-Storage-Spec, Chrome-Quota-Verhalten) und deckt sich mit dem bestehenden
Modul-01/05-Vertrag. Daher als Lehre aufgenommen — unter dem Freibrief
(logisch, nachvollziehbar, sinnvoll), doc-only, kein `src/`-Code.

## Was getan wurde

- **`docs/OBSERVATORIUM_BROWSER.md`** — neue **Lehre 9** angehängt (Format wie
  Lehren 1–8). Inhalt:
  - Beobachtungs-Block mit expliziter Briefkasten-/Quellen-Einordnung.
  - Warum-Tabelle (~5-MB-Grenze, synchron-blockierend, stille Räumung,
    base64 +33 %, nur Strings).
  - Konsequenzen für SBKIM/Endknoten + Verweis, dass SBKIM-Module den Vertrag
    für ihren Teil schon erfüllen (App-Daten-Pendant).
  - **Speicher-Vertrag** als Fünf-Punkte-Vorschlag.
  - Workaround-Snippets (Blob statt base64, `persist()`, `estimate()`).
  - Sicherheits-Verallgemeinerung (Schlüssel nicht im Klartext) — ohne den
    konkreten Fremd-Repo-Befund zu dokumentieren.
  - Vorteile + Betroffen-Liste.
  - Footer „Letzte Aktualisierung" + Querverweise (INTERFACES §1 Modul 01/02,
    Briefkasten-Tafel) nachgezogen.
- **`docs/PULS.md`** — Sitzungs-Eintrag 2026-06-16.

## Bewusst NICHT getan (mit Begründung)

1. **P.S. des Briefs** (Mixarium-API-Key `mxkey9m` im localStorage-Klartext):
   fremdes Repo (`Mein-Mixarium`), Schlüssel-Eingriff. Scope-Disziplin +
   Briefkasten-Tafel („keine Schlüssel auf Briefkasten-Bitte; Schutz nicht auf
   Zuruf ändern in fremden Repos") → Klaus-Entscheidung + eigene Folge-Sitzung
   im Mixarium-Repo. Der konkrete Key-Name wird **nicht** in dieser Repo-Doku
   festgehalten (kein Verbreiten einer fremden Schwachstellen-Detail).
2. **Kein Eintrag in `INTERFACES.md`** als bindender Vertrag: das wäre
   architektonisch tiefgreifend (heilige Tafel). Tafel-Evolutions-Klausel →
   Vorschlag an Klaus, nicht still gesetzt. Lehre 9 lebt vorerst in der
   Observatorium-Lehren-Sammlung mit Querverweis auf den bestehenden Modul-01-
   Vertrag.

## Nächster sinnvoller Schritt

1. **Klaus entscheidet:** Speicher-Vertrag aus Lehre 9 in `INTERFACES.md`
   und/oder SB-KIMTool als bindende Tafel promovieren? (Wenn ja: eigene
   Pflege-Sitzung, die die heilige Tafel nachzieht.)
2. **Endknoten-App-Daten-Migration** (Rezeptbuch + Mixarium von
   localStorage-Beständen auf IndexedDB+Blob) — eigene **externe** Folge-Sitzung
   pro Endknoten-Repo. Lehre 9 ist die Tafel/Anleitung dafür.
3. **Mixarium-Schlüssel-Befund** separat behandeln (Klaus-Zuruf, eigene Sitzung
   im Mixarium-Repo).

**Sichttest:** entfällt — reine Doku-Pflege, kein Code, kein
`tests/manual_check.html`-Eingriff.
