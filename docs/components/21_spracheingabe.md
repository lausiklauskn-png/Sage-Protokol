# Modul 21 — Spracheingabe (Speech input)

> **Status:** Code-Stub 2026-06-21 (Bau-Sitzung 21). `src/modules/21_spracheingabe.js`,
> Headless-Smoke `tests/smoke_bau21_spracheingabe.mjs` **45/45 grün**, Panel 21 in
> `tests/manual_check.html`, Skript-Load in `index.html` (KEIN Auto-Init).
> **Browser-Sichttest (Live-Mikrofon + EU-Engine) wartet auf Klaus.**
>
> Auslöser: BookLedgerPro-Rückmeldung (SIGNAL seq 15, `docs/SBKIM-SUCHE-MUSTER.md`) —
> als Sage-native Umsetzung nach dem Vertrag (Observatorium-Werkstatt Lehre 1).

## Zweck

Eine **input-agnostische Sprach-Eingabe-Schicht** für das SBKIM-Such-Werkzeug.
Sie liefert nur **Text** — die eigentliche Suche (Modul 03 Embedding + Modul 04
`queryLocal` / `hybridMatch`) bleibt unberührt. Sprechen statt tippen, mehr nicht.

## Zwei Engines (umschaltbar, kein Bundler, kein Laufzeit-CDN)

| Engine | Backend | Schlüssel | Datenschutz |
|---|---|---|---|
| **browser** | Web Speech API | keiner | Audio → Browser-Hersteller; EU-Vorbehalt offengelegt |
| **eu** | Google Cloud Speech-to-Text, EU-Endpunkt (`eu-speech.googleapis.com`) | BYOK, lokal | EU-Datenresidenz, opt-in |

## EU-Politik (per Knoten, Klaus' Festlegung 2026-06-21)

- **`"bindend"`** → nur die EU-Engine erlaubt (z.B. **BookLedgerPro**).
- **`"frei"`** (Default) → beide Engines, **EU als wählbare Option** — für
  **Sage / Mein-Mixarium / Mein-Rezeptbuch**. EU ist nicht erzwungen, aber anbietbar.

`availableEngines(euPolicy)` setzt das um: `"bindend"` → `["eu"]`, `"frei"` →
`["browser","eu"]`. Gesetzt via `SbkimSpeech.init({ euPolicy })`.

## Mehrsprachig

`SPEECH_LANGS` (Array, erweiterbar): DE / EN / RU. Die EU-Engine bekommt
`alternativeLanguageCodes` (alle übrigen Codes) für Sprach-Misch-Toleranz.

## Fail-soft (Pflicht)

Fehlendes Mikrofon / kein Schlüssel / Netz weg → ruhiger deutscher Hinweis
(`speechErrorHint`), **nie ein Throw**. Das Textfeld bleibt immer nutzbar.
Einziger Sync-Throw: `InvalidEuPolicyError` bei klar ungültiger `euPolicy`
(Aufrufer-Konfig-Bug).

## UX-Lehre (von BLP übernommen, „teuer gelernt")

Wer die Such-Ansicht bei jedem Ergebnis neu zeichnet, darf das Eingabefeld
**nicht** mit `value:''` neu bauen — sonst verschwindet der gesprochene Text.
Eingabe in einem State (`_query`) halten, nur beim Schließen/Öffnen zurücksetzen.
(Gilt für die komponierende Such-Ansicht, nicht für dieses Modul selbst.)

## Public surface (`window.SbkimSpeech`)

`init(config?)` · `getLanguages()` · `alternativeCodes(code)` ·
`availableEngines(euPolicy?)` · `pickEngine(euPolicy?, preferred?)` ·
`isBrowserSupported()` · `makeBrowserRecognizer(opts)` · `startRecording(options?)` ·
`recognizeEU(audio, options)` · `speechErrorHint(err)` · `InvalidEuPolicyError` · `_meta`.

## Einordnung im Such-Werkzeug (Folge-Schritte)

Modul 21 ist **Schritt 1**. Das **SBKIM-Such-Werkzeug** (kopierbar, einbaubar in
PWA-Suchfelder + Landing-Pages) komponiert anschließend:

1. **Spracheingabe** (dieses Modul) — Eingang.
2. **Interne Suche** — Modul 03 Embedding + Modul 04 `queryLocal`.
3. **Externe KI-Suche** — Modul 04 `hybridMatch` (Richter, EU als wählbarer Provider).
4. **Knoten-Suche** — Cross-Knoten (Nachbar-Sporen als Korpus).

Die EU-Politik gilt einheitlich für Sprach-Engine **und** Richter-Provider:
bindend wo der Knoten es verlangt (BLP), sonst frei wählbar mit EU als Option.

Querverweise: [`HYBRID-MATCH-EINBAU.md`](../HYBRID-MATCH-EINBAU.md) ·
[`04_match.md`](04_match.md) · Observatorium-Werkstatt Lehre 1.
