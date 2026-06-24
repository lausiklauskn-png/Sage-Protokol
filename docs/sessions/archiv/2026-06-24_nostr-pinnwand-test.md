# Übergabeprotokoll — 2026-06-24 · Nostr-Pinnwand: vom Boden-Beweis zur PWA

**Rolle:** Bau-Sitzung (Freibrief), sehr lang, viele kleine PRs (alle squash auf
`main`, #421–#436). Klaus testete durchgehend geräteübergreifend live mit.
**Charakter:** Discovery/Notiz — NICHT in Sage-Page verlinkt (Klaus' Wort
abwarten). Kein `src/`-Modul-Code, kein Protokoll-Bump, keine PII.

## Der Bogen in einem Satz

Aus einem reinen Medium-Test (driftet ein Zettel server-los von Browser A zu B?)
wurde eine eigenständige, installierbare **Pinnwand-PWA** mit semantischer
Frage→Antwort-Suche (Embedding + Whitening + KI-Richter Cloud/WebLLM).

## Was gebaut + bewiesen wurde (chronologisch)

1. **Boden-Beweis Medium (PR #421):** `docs/discovery/nostr-test/` — minimaler
   NIP-01-Nostr-Client, Krypto **lokal vendoriert** (`noble-secp256k1.js`
   **v1.7.1** — Befund: v2 hat Schnorr entfernt; einzige Anpassung Bare-Import
   raus). **GRÜN** (Klaus' Handy↔Tablet, „Salate" driftet via relay.damus.io).
2. **Meilenstein nachgezogen (#424):** `MEILENSTEIN_SEMANTISCHE_SUCHE.md` §4 —
   Medium-Hälfte ✅ bewiesen, ehrlich getrennt von der Semantik-Hälfte.
3. **Frage→Antwort (#425):** `frage-antwort.html` — NIP-01-Reply via `e`-Tag,
   Thread-Gruppierung, gepufferte verwaiste Antworten. **GRÜN** (Tablet fragt,
   Handy antwortet, erscheint korrekt eingerückt).
4. **Auto-Reconnect (#426):** Relays verbinden bei Abbruch neu (Backoff +
   `visibilitychange`) — Klaus' Mobil-Befund.
5. **Bedeutungs-Sortierung (#427):** Modul 03 Embedding byte-vendoriert, Cosinus,
   Modell lädt nur auf Knopfdruck (Pilz-Prinzip).
6. **Anisotropie-Fix / Whitening (#428):** Klaus' Befund „Scores kleben 0.80–0.84,
   misst die Hülle". Lösung aus `LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`:
   zentrierter (whitened) Cosinus, wachsender Referenz-Schwerpunkt. Numerisch
   belegt. **GRÜN** — passender Treffer stieg nach oben.
7. **KI-Richter Stufe 1 Cloud (#429, #430, #431):** steckbar (`getVerdicts`),
   Claude (Mistral RAUS — Klaus), Verneinungs-Prompt, `parseJudgeJson`, ⚖️-Badge
   + Begründung, Vorrang vor Cosinus. Schlüssel-Link + opt-in „merken". **GRÜN
   mit Glanz:** „vergorener Essig 0.20 — enthält Alkohol, widerspricht
   alkoholfrei" (Weltwissen + Verneinung, das der Vektor nicht kann).
8. **Geräte-Check (#432):** `geraete-check.html` — misst WebGPU/RAM/Speicher auf
   Klaus' Gerät (ich kann es aus der Cloud nicht). Ergebnis: WebGPU **ja**.
9. **KI-Richter Stufe 2 WebLLM frei (#433):** dritter Backend, gratis, lokal im
   Browser, Modell-Wahl Trabant→Mercedes (Qwen 0.5/1.5/3/7B, Llama 8B). **NICHT
   headless testbar** (Container ohne GPU) — wartet auf Klaus' Gerätelauf.
10. **Pinnwand-PWA (#434):** eigener Ordner `pinnwand/` (wie `such-tool/`) —
    installierbar (manifest + SW + Icons), Engine 1:1, eigener Download.
11. **Moderner Look (#435):** aus Klaus' 5 ChatGPT-Mockups kombiniert, **ohne
    WhatsApp-Avatare** (Netz-Knoten-Punkt statt Gesicht), Aurora-Hintergrund,
    glasige Karten, „?"-Knoten, farb-gestufte Score-Pillen, `prefers-reduced-motion`.
12. **Echtes Icon (#436):** Klaus' Pin-Spore-Icon (kein Text, maskable) →
    Pillow LANCZOS auf 512+192, App-Icon + Favicon.

## Drei freie Stufen (Klaus' „arme Oma"-Frage, dokumentiert in `RICHTER-STUFEN.md`)

1. gratis/überall: lokales Embedding + Whitening.
2. gratis/gerät-hungrig: WebLLM im Browser (kein Cent, lokal, langsamer/schwächer).
3. bezahlt/stärkste: Cloud (Claude, eigener Schlüssel, Bruchteil-Cent/Suche).
Plus Vision: Pilz-Schicht trägt Kosten für die, die nicht können.

## Ehrliche offene Punkte (Klaus' Sichttests)

- **Optik der PWA** (Aurora/Animation flüssig auf dem Tablet? Geschmack?) — wartet.
- **Icon + Favicon** live — wartet.
- **WebLLM-Gerätelauf** (erst „VW Golf" 1.5B, dann 3B): lädt es? wie schnell?
  welche Modell-Kennung trägt sein Tab S6? — **headless nicht testbar**, Modell-
  Liste/IDs mit seinem Feedback justieren.
- **Smokes grün:** `nostr-test/_smoke.mjs` 31, `_smoke_frage_antwort.mjs` 57,
  `_smoke_geraete_check.mjs` 10, `pinnwand/_smoke.mjs` 41. Sage-Smokes unberührt.

## Wichtige Lehren für die nächste Sitzung

- **Pages-Deploy-Verzug:** mehrere schnelle Merges → Pages verwirft Zwischen-
  Builds, neue Seiten brauchen 1–2 min + Hard-Reload (Klaus' 404 war das).
- **WebLLM ist von der Cloud-Session nicht testbar** (keine GPU/Browser) — alles
  WebLLM-bezogene ist „blind gebaut", Klaus' Lauf ist der Wahrheitstest.
- **Embedding ≠ Absicht:** Vektor misst Thema (auch whitened), Verneinung/Welt-
  wissen kann nur der Richter. Tiefer Inhalt (Klaus' Erkenntnis) hebt beides.
- **Keine Gesichts-Avatare** (WhatsApp-Look) — Identität als Knoten-Punkt.

## Nächster sinnvoller Schritt

Klaus' Sichttest-Rückmeldung abwarten (Optik/Icon/WebLLM), dann je nachdem:
(a) Optik-Feinschliff, (b) WebLLM-Modell-Liste justieren, (c) Graph-Ansicht als
„zweite Gestalt", (d) Relevanz-Rückmeldung („lernt mit jeder Antwort"),
(e) Cross-Knoten `queryLocal` gegen echten App-Inhalt (`notiz-bauplan-live-suche.md`).
