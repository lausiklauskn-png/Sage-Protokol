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

## Bau 24.R — Reinigung vor dem Senden (Klaus 2026-10-14)

Bis hierher ging die ORIGINALDATEI an Mistral/Google (Foto samt EXIF/Ort, PDF samt
verstecktem Text). Seitdem sendet `recognize` nie das Original:

| Eingang | was hinausgeht |
|---|---|
| JPEG | **Bildpunkte 1:1**, nur Metadaten-Abschnitte (`WFP.Reinigung.jpegOhneMeta`) und alles hinter dem Bildende weg (Klaus: „nur das Bösartige neu, den Rest 1:1") |
| anderes Foto / JPEG nicht sauber zerlegbar / Reinigung nicht ladbar | in **voller Größe** neu gezeichnet (≤ 6000 px), PNG bleibt verlustfrei PNG (über 8 MB → JPEG 92 %) |
| PDF | je Seite (≤ 10) mit pdf.js gezeichnet, **300 dpi nach der echten Seitengröße** (≤ 5000 px), versteckter Text in der Kopie zugedeckt, JPEG 92 % ohne Metadaten, `isEvalSupported:false` |
| nicht lesbar / kein Browser / PDF-Leser nicht erreichbar | **nichts** (`nichtsGesendet:true`, Grund im Hinweis) |

pdf.js und `reinigung.js` kommen von `/Workflow-PDF/` (gleiche Adresse auf github.io,
wie in den Rezeptbüchern), einstellbar über `init({ pfade: { pdfjs, reinigung } })`.
Versteckter Text → `options.onVersteckt(liste)` (false = nichts senden). Der erkannte
Text geht durch `window.PrueferMail`: Ergebnis trägt `textGeprueft`, `kiAnweisung`
([{zeile, kennung, inhalt}]) und `entfernt`; `ohneZeilen(text, zeilen)` nimmt die
gemeldeten Zeilen heraus. Aufrufer (Modul 22, Pinnwand) halten je einmal per `confirm` an.

**Gemessen 2026-10-14** (Tesseract auf dem Gerät als Messgerät, kleine blassgraue
Schrift 4,5–6 pt, 20 Zeilen): 1400 px/JPEG 85 % → 9 Zeilen falsch; 2000 px/JPEG 92 % → 1;
300 dpi/JPEG 92 % → 0; PNG ohne Gewinn (beim Scan fünfmal so groß). Mit den alten
Einstellungen las die Probe die IBAN einer 5-pt-Zeile falsch („DESO 3708 004 …").
⚠ Grenzen: Mistral/Google selbst sind nicht gemessen (kein Schlüssel im Behälter) ·
Text über einem Foto bleibt · schräger Text wird nicht beurteilt · nur 10 PDF-Seiten.
Proben: `smoke_bau24_ocr_eingabe` · `smoke_bau24r_reinigung_browser` (braucht ../Workflow-PDF) ·
Gegenprobe `tests/gegenprobe_bau04j_24r.mjs`.

## Strikte Tabus / Leitplanken

- **Kein Schlüssel im Code** (BYOK, RAM-only beim Aufrufer). **Kein PII.**
- **Nie das Original senden** (Bau 24.R) — lieber nichts als ungereinigt.
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
