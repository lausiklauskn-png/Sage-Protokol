# BRIEF — S5-Härtungs-Sims · A18 Siegel-Wizard netzweit · BLP v0.2 · A11

**Für die nächste Sitzung. Geschrieben 2026-07-23. Sage ist der Hub.**

> **Freibrief gilt** (siehe `CLAUDE.md § Freibrief`): selbstständig bauen/merken/mergen,
> solange logisch, nachvollziehbar, nützlich; echtes Zweifeln (mehrdeutig, schwer umkehrbar,
> architektonisch tiefgreifend) → **erst Klaus fragen**; nie stillschweigend. Selbst-Merge
> netzweit. Klaus' Browser-Sichttest bleibt der letzte Beweis — headless ersetzt ihn nicht.

## 0. Pflichtlektüre + Sitzungsstart (in dieser Reihenfolge)
1. `CLAUDE.md` — Verfassung, Freibrief, „von `origin/main` frisch abzweigen".
2. `docs/PULS.md` — **oberster Eintrag „Stand 2026-07-23 (Folge²)"** (RELATEDNESS_CENTER v2).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — A/B-Abhak-Liste (offene: A5b, A11, A12, A15, A18, B4, B6).
4. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` — **Stand 2026-07-23** (v2-Supersession) für Kontext.
5. `status.json` (14 Endknoten) + `tools/match_baseline.mjs`.

**Sitzungsstart-Pflicht:** `bash .claude/hooks/refresh-origin-main.sh`; für JEDES angefasste Repo
`git fetch origin && git checkout -B <branch> origin/main`. `npm install --no-save fake-indexeddb`
für den Testlauf (`node tests/*.mjs`, Suite 61/61 grün).

## 1. Ausgangslage (2026-07-23 erledigt, gemergt PR #706)
- **RELATEDNESS_CENTER v2 gebaut** (Klaus' Entscheid „V2 bauen"): Mittelpunkt neu aus den 14 Live-
  v0.2-`domainVector` gemittelt, weil v1 nach der v0.2-Re-Sign-Welle mis-rankte (Point↔Sage 0.46 >
  Schwestern 0.38). **Reine Anzeige, gatet nichts**, 0.80-Riegel + PROTOCOL_VERSION unberührt,
  byte-1:1 in allen 3 Kopien. **Ehrliche Grenze:** v2 trennt nur enge Schwestern sauber; echtes
  Fach-„verwandt" bleibt der opt-in KI-Richter. Tafel-Evolution (2026-06-28 „v1 bleibt" überholt)
  in der LEHRE-Doku dokumentiert. `smoke_bau04e/22e/23` nachgezogen. **Suite 61/61 grün.**
- **Rest-Grenze:** Klaus' Browser-Sichttest der „verwandt"-Anzeige läuft nach dem Merge auf `main`.

## 2. Was zu tun ist (Vorschlag-Reihenfolge)

### 2.1 S5 — Härtungs-Fälle als Sims sichern (headless, ohne Klaus — empfohlener Einstieg)
Aus der A2/A3-Historie in die Sim-Familie festschreiben, damit sie nicht zurückfallen: Antworter-
Vorwärmen, Frage-Timeout, saubere Sporen, newest-per-name im Raum. Ausbau von
`tests/sim_multinode.mjs` oder eigene `tests/sim_haertung.mjs`. **Ehrlich:** Sim ≠ Live (Mock-Bus,
deterministischer Embedding-Stub).

### 2.2 A18 — kanonischen Siegel-Andock-Wizard netzweit ausrollen
Skill `status-leiste-siegel` + `assets/siegel-inhalt.js`. Pro Repo eine Sitzung; byte-1:1,
Fremdnutzer-/Marktplatz-Brille (fail-soft, klar benennen). Reihenfolge/Stand in
`PLAN_SEMANTIK_KRYPTO.md` A18.

### 2.3 BLP v0.2 — die letzte echte Demo-Grenze schließen (Operator-Schritt Klaus)
BookLedgerPro ist der **einzige** Knoten noch auf `protocolVersion 0.1`. Live-Re-Sign mit privatem
Schlüssel in Klaus' Browser (Siegel → Spore neu signieren). Danach headless verifizieren +
Register-Score/Notiz nachziehen.

### 2.4 A11 — Such-Ergebnis → Frage → optional Andocken (Marktplatz-Kopplung Modul 22 ↔ 23)
Teil B aus `PLAN_SEMANTIK_KRYPTO.md`. Spec + Bau. Setzt nichts Blockierendes voraus.

### 2.5 Kleinkram / optional
- **A5b** Multi-Query in der Pinnwand (~30 Min). **B6** E2E Grad C (Bump-Entscheid zuerst).
- `docs/checkliste_netzstand_sage_real.html` bei Gelegenheit auf den 14-Knoten-Stand nachziehen.

## 3. Empfohlener Einstieg
**2.1 S5-Härtungs-Sims** (headless, ohne Klaus) → **2.2 A18-Rollout**. **2.3 BLP v0.2** ist ein
Klaus-Browser-Schritt, wann immer er mag.

## 4. Nutzbare Skills
`saubere-netz-anmeldung` · `status-leiste-siegel` · `verschluesselter-schluessel-tresor` · `geraetename`.

## 5. Abschluss-Pflicht (Kette reißt nie ab)
1. `docs/PULS.md` fortschreiben (bei `status.json`-Änderung vorher `python3 scripts/update_puls_pie.py`).
2. Erledigte A/B-Punkte in `PLAN_SEMANTIK_KRYPTO.md` + Checkliste abhaken.
3. Übergabeprotokoll in `docs/sessions/archiv/`.
4. **Neuen Brief** schreiben + **vollständig als Codeblock im Chat** ausgeben.
5. „Nächste Schritte"-Block (2–4 Punkte) direkt in der Chat-Antwort.
6. Commit + Push je abgegrenzter Aufgabe; eigene PRs selbst mergen (Freibrief).
