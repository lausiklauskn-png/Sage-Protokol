# Modul 24 — OCR-/Bild-Eingabe (image / handwriting → text)

**Status:** Code-Stub 2026-07-01 (Strang B1, Brief 2026-07-01). Headless-Smoke
`tests/smoke_bau24_ocr_eingabe.mjs` **41/41 grün**. Browser-Sichttest (Panel 24 +
echter Schlüssel) wartet auf Klaus.

## Was es ist

Eine **input-agnostische Bild-Eingabe-Schicht** — das **Geschwister von Modul 21**
(Spracheingabe). Sie nimmt ein Bild (Foto / Handschrift / Screenshot / PDF-Seite)
und liefert **nur Text** zurück. Die eigentliche Suche (Modul 03 Embedding + Modul 04
`queryLocal`/`queryLocalJudged`) bleibt unberührt — OCR ist nur eine weitere Art,
Text in ein Suchfeld/Eingabefeld zu bekommen.

Muster **1:1 wie Modul 21**: input-agnostisch, fail-soft, Anbieter-steckbar, BYOK,
EU-Politik per Knoten.

## Anbieter (steckbar, `PROVIDERS`)

| id | Anbieter | Region | Schlüssel | Anmerkung |
|---|---|---|---|---|
| `mistral` | Mistral OCR (`mistral-ocr-latest`) | EU (Frankreich) | BYOK | **Favorit** (Klaus, Brief 2026-07-01). ~2–4 $/1000 Seiten. |
| `google` | Google Cloud Vision, EU-Endpunkt (`eu-vision.googleapis.com`) | EU | BYOK | `DOCUMENT_TEXT_DETECTION`. |
| `browser` | Shape Detection API (`TextDetector`) | Browser | — | Experimentell, keine EU-Residenz-Garantie, fail-soft wenn nicht unterstützt. |

## EU-Politik (per Knoten, wie Modul 21)

- **`bindend`** — nur EU-Anbieter erlaubt (`mistral`/`google`); `browser` fällt raus.
  Für DSGVO-Knoten (z.B. BookLedgerPro).
- **`frei`** (Default) — alle Anbieter, EU als wählbare Option (Sage / Mixarium / Rezeptbuch).

`pickProvider` bevorzugt den **Favorit `mistral`**, sonst den ersten erlaubten;
ein `preferred` gewinnt, wenn erlaubt.

## Public surface (`window.SbkimOcr`)

```
init(config?)                          -> meta            (setzt euPolicy)
getProviders()                         -> Array<{id,label,region,needsKey}>
availableProviders(euPolicy?)          -> Array<id>
pickProvider(euPolicy?, preferred?)    -> id | null
isFileSupported(mimeType)              -> boolean
isBrowserOcrSupported()                -> boolean
recognize(image, options?)             -> Promise<{ available, text|reason, provider }>
recognizeBrowser(image, options?)      -> Promise<{ available, text|reason }>
ocrErrorHint(err)                      -> string (deutsch, user-facing)
InvalidEuPolicyError                   -> ErrorFactory (sync throw nur bei Aufrufer-Konfig)
```

- **`recognize(image, options)`** — `image` = base64-String, data-URL oder
  `{content, mimeType}`. `options`: `provider?`, `apiKey?` (BYOK), `euPolicy?`,
  `model?`, `mimeType?`, `enforceMime?`, `timeoutMs?`. Wählt den Anbieter
  (`options.provider` | Politik-Default), baut den Request, `fetch` mit Timeout,
  extrahiert den Text. **Fail-soft** auf allen Pfaden (kein Schlüssel / kein Bild /
  Anbieter bei `bindend` nicht erlaubt / HTTP-Fehler / Netz-Fehler / Abbruch →
  `{available:false, reason:<deutsch>}`, **kein Throw**).

## Strikte Tabus / Leitplanken

- **Kein Schlüssel im Code** (BYOK, RAM-only beim Aufrufer). **Kein PII.**
- Liefert **nur Text** — greift nicht in Modul 03/04/05 ein, kein Schwellen-/
  Riegel-Bezug (`PROVIDER_MIN_MATCH` / 0.80-Andock unberührt).
- Kein Bundler, kein Laufzeit-CDN, kein `PROTOCOL_VERSION`-/`DB_VERSION`-Bump
  (nicht protokoll-aktiv).
- Nur `InvalidEuPolicyError` wirft sync (klarer Aufrufer-Konfig-Fehler); sonst fail-soft.

## Rollout (Strang B2, eigene Folge-Schritte, Brief 2026-07-01)

Byte-gleich als Texterkennungs-Eingabe in die Apps:
- Sage Such-Tool (Modul 22) + Pinnwand → „Foto/Handschrift → Suchtext".
- Mein-Mixarium / Mein-Rezeptbuch → „Rezept/Handschrift scannen → neuer Eintrag"
  (per-Repo-Disziplin: Mixarium md5-identisch, Rezeptbuch QC + `build.py`).
- family-project (Workflow).
- BookLedgerPro → Beleg-OCR: Mistral OCR als EU-Option **neben** Google Vision.
- Muttis-Rezeptbuch → erst wenn Repo im Scope.

## Bauzustand

| Schritt | Datum | Sitzung | Ergebnis |
|---|---|---|---|
| Code + Smoke | 2026-07-01 | Bau-Sitzung B1 (Brief 2026-07-01) | `src/modules/24_ocr_eingabe.js` angelegt (Anbieter-Abstraktion mistral/google/browser, EU-Politik, BYOK, fail-soft). `tests/smoke_bau24_ocr_eingabe.mjs` **41/41 grün** (Export/Meta, EU-Politik+pickProvider, isFileSupported, Mistral-/Google-Happy-Path + Request-Bau, data-URL-Entpackung, Fail-soft ×4, bindend-schließt-browser-aus, InvalidEuPolicyError, ocrErrorHint, Browser-fail-soft, init-euPolicy). `index.html` lädt das Skript (KEIN Auto-Init), Panel 24 in `tests/manual_check.html` (3 Logik-Knöpfe + 1 Live-Knopf „OCR erkennen"). `status.json` Modul 24 `score:"stub"`. **Browser-Sichttest wartet auf Klaus.** |
