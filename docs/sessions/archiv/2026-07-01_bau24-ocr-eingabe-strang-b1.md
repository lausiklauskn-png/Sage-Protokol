# Übergabeprotokoll 2026-07-01 · Modul 24 — OCR-/Bild-Eingabe (Strang B1)

**Rolle:** Bau-Sitzung · **Branch:** `claude/b1-ocr-eingabe-modul` (von frischem `main`, vorher `git fetch`)
**Auftrag:** Klaus „weiter" → Strang **B1**: neues OCR-Eingabe-Modul (Geschwister von Modul 21), Mistral-OCR-Favorit.
**Freibrief gilt.**

## Was getan

- Neues `src/modules/24_ocr_eingabe.js` (`SbkimOcr`) — input-agnostische **Bild/Handschrift → Text**-Schicht,
  Muster 1:1 wie Modul 21. Liefert nur Text; Suche (03/04) unberührt.
- Drei steckbare Anbieter (`PROVIDERS`): **`mistral`** (Mistral OCR `mistral-ocr-latest`, EU, Favorit) ·
  `google` (Cloud Vision EU-Endpunkt `eu-vision.googleapis.com`, `DOCUMENT_TEXT_DETECTION`) · `browser`
  (Shape Detection `TextDetector`, experimentell).
- **EU-Politik** `frei`/`bindend` per Knoten (`init({euPolicy})`); `pickProvider` bevorzugt den Favorit.
- **Fail-soft** durchgehend (kein Schlüssel/Bild/Netz/HTTP → `{available:false, reason:<deutsch>}`, kein
  Throw außer `InvalidEuPolicyError`). **BYOK**, kein Schlüssel im Code, kein PII.
- `image` = base64 / data-URL / `{content,mimeType}`. `recognize` baut anbieter-spezifischen Request,
  `fetch` mit AbortController-Timeout, extrahiert Text.
- `index.html` lädt das Skript (KEIN Auto-Init). Panel 24 in `tests/manual_check.html` (3 Logik-Knöpfe +
  Live-Knopf „OCR erkennen": Bild wählen + Anbieter/Schlüssel via prompt → Text ins Feld #panel-24-text).
- `status.json` Modul 24 `score:"stub"` + `scripts/update_puls_pie.py` (26 Module, Code-Stub 9).
- Doku: Karte `docs/components/24_ocr_eingabe.md`, CLAUDE.md-Modul-Tabelle Zeile 24.

## Beweis (headless)

- `tests/smoke_bau24_ocr_eingabe.mjs` **41/41 grün** (12 Probengruppen). `node --check` grün; Panel-24-
  Inline-Skript validiert.

## Leitplanken

`PROVIDER_MIN_MATCH`/0.80-Andock-Riegel unberührt. Kein Schlüssel im Code. Kein PROTOCOL_VERSION-/
DB_VERSION-Bump. Kein Eingriff in andere Module (Leaf, `abhaengig:[]`).

## Branch-Hygiene

Diesmal korrekt: `git fetch origin main` **vor** `git checkout -B <branch> origin/main` (Lehre aus der
Modul-15-Sitzung).

## Nächster sinnvoller Schritt

1. **Browser-Sichttest Panel 24** (+ echter Mistral-Schlüssel) — wartet auf Klaus.
2. **INTERFACES.md §1 formaler Modul-24-Eintrag** (Folge-Pflege; Leaf-Modul, bewusst nachgezogen).
3. **Strang B2** — Rollout byte-gleich in die Apps (Such-Tool/Pinnwand, Mixarium/Rezeptbuch,
   family-project, BLP als EU-Option neben Google Vision). Braucht Klaus' Reihenfolge-Wahl.
