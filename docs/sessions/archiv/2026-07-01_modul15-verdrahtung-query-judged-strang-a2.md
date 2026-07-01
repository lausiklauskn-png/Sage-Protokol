# Übergabeprotokoll 2026-07-01 · Modul-15-Verdrahtung — KI-Richter im Antwort-Pfad (Strang A2, Folge)

**Rolle:** Bau-Sitzung · **Branch:** `claude/a2b-membran-judged-verdrahtung` (von `main` nach 04.G-Merge)
**Auftrag:** Klaus „Weiter" → `queryLocalJudged` (Bau 04.G) in den Cross-Knoten-Antwort-Pfad (Modul 15
Sub b, `op:"query"`) verdrahten. **Freibrief gilt.**

## Was getan

`src/modules/15_membran.js` — **additiv, Default-Verhalten byte-gleich**:
- Neue modul-lokale Konfig `queryJudge` (Default `null` = Richter AUS → roher `SbkimMatch.queryLocal`).
- `init({queryJudge:{apiKey,provider?,euOnly?,hybrid?,endpoint?,model?}})` **und** Laufzeit-Setter
  `setQueryJudge(cfg)`. Gesetzt → der `op:"query"`-Empfänger ruft `SbkimMatch.queryLocalJudged`
  (Vorfilter + Richter, opt-in/BYOK, fail-soft) und sendet die umsortierte Kandidaten-Liste als
  `queryResult`.
- `_meta.queryJudgeConfigured` (Boolean-Getter, **kein** Schlüssel-Leak). Schlüssel RAM-only, nie im
  Code, kein Persist/Log. Selbstcheck-Zeile um `setQueryJudge` erweitert.
- **Modul-16-Pflicht:** `ZERTIFIKAT_ASPEKTE`-Eintrag „2026-07-01 / Modul 15 / KI-Richter im Cross-
  Knoten-Antwort-Pfad (opt-in)".
- Doku: Karte 15 (Bauzustand-Zeile), INTERFACES §1 (Selbstcheck + queryJudge-Note).

## Beweis (headless)

- `tests/smoke_bau15b_membran.mjs` **35/35 grün** (+4 A2-Proben: Flag konfiguriert / Richter-Pfad genutzt
  (JUDGED-Treffer) / setQueryJudge(null)-Reset / roher Vorfilter ohne Richter (VORFILTER-Treffer)).
- Regression: 04g 28/28, 04f 32/32, 16_sub_e 16/16, Drift-Guards standalone/bundle grün. `node --check` 15+16 grün.

## Branch-Hygiene (Lehre)

Der Branch war versehentlich von **stale `origin/main`** (nur bis 04.F) abgezweigt — `git checkout -B`
ohne vorheriges `git fetch`. Vor dem Commit auf frisches `main` (inkl. 04.G) rebased (stash → checkout -B
origin/main → stash pop, konfliktfrei). **Lehre:** vor `checkout -B <branch> origin/main` immer erst
`git fetch origin main`.

## Leitplanken

`PROVIDER_MIN_MATCH` (0.80) + 0.80-Andock-Riegel (Modul 05) unberührt. Modul 04 nur über öffentliche
`queryLocalJudged`-Fläche (kein Eingriff). Kein Schlüssel im Code. Kein PROTOCOL_VERSION-/DB_VERSION-Bump.

## Nächster sinnvoller Schritt

1. **Browser-Sichttest** (reine Empfänger-Logik; optionaler Panel-15-Knopf als Folge-Pflege) — wartet auf Klaus.
2. Damit ist die **antwortende Seite komplett** (queryLocal → A1-Hybrid → A2-Richter, opt-in).
3. Danach **Strang B1** (OCR-Modul, Geschwister von Modul 21) oder **A3** (Schnipsel-Chunking) — Klaus' Wahl.
