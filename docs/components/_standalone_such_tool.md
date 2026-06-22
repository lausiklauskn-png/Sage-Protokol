# Standalone-Such-Tool — eigenständige installierbare PWA (Vorlage)

> **Status:** 🟦 Code-Stub 2026-06-22 (Strang C des Such-Werkzeugs). Self-contained
> Ordner `such-tool/` — eigene `index.html` + `manifest.json` + Service-Worker +
> Modul-Kopien + Icons. **1:1 in ein eigenes Repo kopierbar** → eigene App mit
> eigener URL und eigener Installation. Smoke `tests/smoke_standalone_such_tool.mjs`
> **46/46 grün**. **Browser-/Installations-Sichttest wartet auf Klaus.**
>
> Auslöser: Klaus' Wunsch nach einem **herunterladbaren / eigenständig
> installierbaren** Such-Werkzeug (Werkzeugkiste, Strang C) — und der Befund am
> SB-KIMTool-Point, dass ein bloßer „Download-Knopf" **keine** eigenständige App
> erzeugt.

---

## Die Kern-Lehre: warum ein „Download" allein keine App ist

Eine heruntergeladene Einzeldatei, **lokal** über `file://` geöffnet, darf vom
Browser **keinen Service-Worker** registrieren → es gibt kein „Zum Startbildschirm
hinzufügen", keine Installation. Es bleibt eine Seite, keine App.

**Eine eigenständige, installierbare PWA braucht vier Dinge ZUSAMMEN, unter einer
eigenen Adresse/Scope:**

1. **Über https gehostet** (z. B. GitHub Pages).
2. Eigenes **`manifest.json`** (`name`, Icons 192 + 512, `start_url`, `scope`,
   `display: "standalone"`).
3. Eigener **Service-Worker mit `fetch`-Handler** (Chrome verlangt ihn für die
   Installierbarkeit).
4. Eine eigene **Start-URL/Scope**, getrennt von einem etwaigen Hub.

Ein Knopf, der nur Code kopiert oder eine Datei zum lokalen Öffnen ausliefert,
erfüllt **keinen** dieser Punkte. Darum „bleibt das Tool im Hub" und wird keine
eigene App.

---

## Aufbau des Ordners `such-tool/`

```
such-tool/
  index.html            Standalone-Seite: lädt die 4 Module, registriert den SW,
                        mountet das Widget (Internet/KI-Brücke an, App/Knoten aus),
                        eigener Footer (Datenschutz + Link Impressum).
  manifest.json         name/short_name, start_url ".", scope ".", display
                        standalone, theme/background, Icons 192+512 (any+maskable).
  sbkim-sw.js           Service-Worker: cacht die App-Schale (cache-first), reicht
                        Fremd-Origin (CDN-Modell, KI-/Sprach-API) DURCH (nie cachen).
                        Offline-Navigation → ./index.html. CACHE_VERSION bumpen bei
                        Schalen-Änderung.
  impressum.html        Impressum/Datenschutz-Vorlage. Kontakt sind PLATZHALTER
                        ([…]) — keine PII hartcodiert (Sage-Konvention). Betreiber
                        füllt sie vor Veröffentlichung.
  icon-192.png          App-Icon (Lupe auf dunklem Grund), maskable-tauglich.
  icon-512.png
  modules/              Kopien von src/modules — die EINZIGEN Module, die das
    03_embedding.js     Widget komponiert: 03 (Embedding) ← 04 (Match) ←
    04_match.js         22 (Widget) → 21 (Sprache). KEIN 01/02 nötig (kein
    21_spracheingabe.js IndexedDB, keine Identität).
    22_such_widget.js
```

### Modul-Abhängigkeitsgraph (geprüft)

- Modul 22 → `SbkimEmbedding` (03), `SbkimMatch` (04), `SbkimSpeech` (21).
- Modul 04 → `SbkimEmbedding` (03) only.
- Modul 03, 21 → keine SBKIM-Abhängigkeit.
- **Kein** Modul 01 (Storage) / 02 (Spore) nötig — die Standalone-Seite hat keine
  Identität und kein IndexedDB.

### Drift-Guard

`modules/*.js` sind **Kopien**. `src/modules` bleibt die Quelle der Wahrheit.
`tests/smoke_standalone_such_tool.mjs` Probe 2 prüft **byte-identisch** — wer
03/04/21/22 in `src/modules` ändert, MUSS die Kopien hier nachziehen (sonst rot).

```
cp src/modules/{03_embedding,04_match,21_spracheingabe,22_such_widget}.js such-tool/modules/
```

---

## So wird daraus eine eigene App (zwei Wege)

- **(A) Eigener Ordner** (so wie hier, `such-tool/` in Sage): über GitHub Pages
  erreichbar unter `…/Sage-Protokol/such-tool/`. Direkt installierbar (Add to
  Home Screen). Achtung **Service-Worker-Scope-Falle**: ein Hub-SW im Repo-Root
  darf den Unterordner-SW nicht überschatten — der Tool-SW muss aus
  `/such-tool/` registriert werden (sein Scope ist dann `/such-tool/`).
- **(B) Eigenes Repo:** den Ordner-Inhalt in das Root eines neuen Repos kopieren,
  GitHub Pages aktivieren → eigene URL, eigene App-Identität, keine Scope-Falle.
  **Empfohlen für eine verkaufbare eigenständige App.**

---

## Verteilung / Monetarisierung (Vorgriff, Phase D.2)

Server-lose PWAs lassen sich nicht „einsperren" (Code liegt offen). Der saubere
Weg passt zur Vier-Schichten-Lesart: **das kostenlose Tool ist das Schaufenster
(Funnel), bezahlt wird der gehostete Pilz-Server** (kommerzielle Pilz-Schicht 2) —
z. B. ein Gemini-Grounding-/SearXNG-Proxy, der die „⚡ Automatisch"-Web-Suche für
weitere Anbieter (über CORS hinaus) liefert. Gratis = BYOK + Kopier-Pfad; Pro =
„du tippst nur, der Server sucht". Details: eigene Konzept-Sitzung (Pipeline
Phase D.2 „Pilz-Wirtschaft").

---

## Offen / Sichttest

- **Klaus' Installations-Sichttest** am Galaxy-Tab-S6: `…/such-tool/` öffnen →
  Chrome-Menü „App installieren" / „Zum Startbildschirm" → startet als eigene App
  (eigenes Fenster, ohne Browser-Leiste)? Offline-Start nach Installation?
  Headless ersetzt das nicht.
- **KI-Anbieter automatisch:** nur Claude geht server-los (CORS). Gemini/ChatGPT/
  Perplexity nur über Kopier-Pfad oder einen späteren Proxy (Phase D.2).

## Querverweise

[`22_such_widget.md`](22_such_widget.md) · [`21_spracheingabe.md`](21_spracheingabe.md) ·
[`04_match.md`](04_match.md) · [`03_embedding.md`](03_embedding.md) ·
[`09_einbau_pwa.md`](09_einbau_pwa.md) § Service-Worker-Scope-Falle.
