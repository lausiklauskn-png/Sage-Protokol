# BRIEF — Netzstand-Folge: Register-Refresh · S5-Härtungs-Sims · Muttis-Entscheid · A11/A18

**Für die Nachfolge-Sitzung. Geschrieben 2026-07-23. Sage ist der Hub.**

> Freibrief gilt (siehe `CLAUDE.md § Freibrief`): selbstständig bauen/merken/mergen,
> solange logisch, nachvollziehbar, nützlich; echtes Zweifeln → erst Klaus fragen;
> nie stillschweigend. Selbst-Merge netzweit. Klaus' Browser-Sichttest bleibt der
> letzte Beweis — headless ersetzt ihn nicht.

## 0. Pflichtlektüre zuerst (in dieser Reihenfolge)
1. `CLAUDE.md` (Sage) — Verfassung, Freibrief, „von origin/main frisch abzweigen".
2. `docs/PULS.md` — Stand 2026-07-23 (S1/S2 + Demo-Bestandsaufnahme + Register-Drift).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — A/B-Abhak-Liste.
4. `docs/checkliste_netzstand_sage_real.html` — Klaus' Fortschritts-Ansicht.
5. `status.json` — ehrlicher Real-Anteil.

**Sitzungsstart-Pflicht:** `bash "$CLAUDE_PROJECT_DIR/.claude/hooks/refresh-origin-main.sh"`;
für JEDES angefasste Repo `git fetch origin && git checkout -B <branch> origin/main`.
`npm install --no-save fake-indexeddb` für den Testlauf.

## 1. Ausgangslage (2026-07-23 erledigt, alles gemergt PR #697)
- Sage-Suite **60/60 grün** (4 rote Suiten ehrlich repariert — veraltete 0.80-Annahme
  nach A10 + ein Harness-Hang durch offenen BroadcastChannel; kein Code-Bug).
- **Multi-Knoten-Sim** `tests/sim_multinode.mjs` **24/24** (Anmelden→Finden→0.80-Riegel→
  Q&A über Hub + Q&A OHNE Hub). Reproduzierbarer Netz-Regressionstest.
- **A14** verifiziert erledigt (Fix schon auf main) + abgehakt.
- **Demo-Bestandsaufnahme:** keine echten `_demo`-Vektoren mehr; einzige Demo-Grenze BLP.

## 2. Was als Nächstes ansteht (Vorschlag-Reihenfolge)

### 2.1 Register-Refresh in `status.json` (Befund dieser Sitzung, headless-fähig soweit möglich)
- **Tomys Hub** steht `pingStatus: verified-match` mit `matchScore: null` — dokumentiert
  ist aber Sage-Match **0.7977 < 0.80** (CLAUDE.md-Meilenstein). Konsistent zu Private Brain
  müsste das **`verified-spore`** sein (verified-match zu Family/BLP, aber NICHT zu Sage).
  → Prüfen + korrigieren (Klaus kurz bestätigen lassen, da Register-Aussage).
- Mehrere `matchScore`/`nodeId` wirken **stale** gegenüber den re-signierten Live-Sporen
  (z.B. Register-Rezeptbuch 0.824 vs. aktuelle Inbox-Vektoren 0.792). **Autoritativ ist
  jede Live-`spore.json` am `sporeUrl`** — braucht Netz (Klaus' Browser oder ein
  Sync-Schritt, der die Live-Sporen holt) + `tools/match_baseline.mjs` neu rechnen.
  Nach Änderung: `python3 scripts/update_puls_pie.py`.

### 2.2 S5 — Härtungs-Fälle als Sims sichern (Brief §2.2, offen)
In der Sim-Familie festschreiben (aus A2/A3-Historie), damit sie nicht zurückfallen:
Antworter-Vorwärmen, Frage-Timeout, saubere Sporen, newest-per-name im Raum. Ausbau von
`sim_multinode.mjs` oder eigene `tests/sim_haertung.mjs`. **Ehrlich:** Sim ≠ Live.

### 2.3 Muttis-Rezeptbuch (M1 — Entscheid an Klaus, architektonisch)
Muttis-Rezeptbuch (`origin/main`, v9.2) hat **KEIN SBKIM**. Mein-Rezeptbuch (öffentlicher
Klon) trägt die volle Integration. **Frage an Klaus (erst fragen — schwer umkehrbar):**
soll Muttis ein **eigener SBKIM-Knoten** werden (eigene Identität + eigener DB-Suffix,
NICHT derselbe wie Mein-Rezeptbuch — geteilte-Origin-Kollision!) oder **privat/kein Knoten**
bleiben? Wird es Knoten: Modul-Rollout byte-1:1 aus Mein-Rezeptbuch (00–08, 15–17, 23,
Siegel-Wizard A18), eigenes `sbkim/spore.json` + Briefkasten + Register-Eintrag. Muttis nutzt
`build.py` (QC ändern → `python3 build.py`). **Unabhängig davon** (reversibel, headless):
Parität Muttis ↔ Mein-Rezeptbuch verifizieren (Icon, iridescent-Lesbarkeit, Hardreload,
Navigation) und Fehlendes gezielt nachziehen.

### 2.4 Übrige A/B-Punkte (aus `PLAN_SEMANTIK_KRYPTO.md`)
- **A18** — kanonischen Siegel-Andock-Wizard netzweit ausrollen (Skill `status-leiste-siegel`).
- **A11** — Such-Ergebnis → Frage → optional Andocken (Teil B, Marktplatz-Kopplung 22↔23).
- **A12** — „Antworten: an/aus"-Modell (Spec). **A15** — Zwei-Stufen-Verbinden (Spec+Bau).
- **B6** — E2E Grad C versiegelter Umschlag (der eigentliche „real"-Krypto-Baustein; Bump-
  Entscheid zuerst). **B4** — Widget-Tresor (sicherheits-sensibel, eigene Sitzung).
- **A5b** — Multi-Query in Pinnwand (optional, ~30 Min).
- **BLP v0.2** — die eine echte Demo-Grenze schließen: LIVE-Spore mit privatem Schlüssel
  neu signieren (Operator-Schritt Klaus' Browser).

### 2.5 Netzweite Pflege (Brief §4)
Icon-Rollout-Kontrolle, Hardreload-Parität, Fremdnutzer-/Marktplatz-Brille, Briefkasten-Sync
(§11.6) — nach Bedarf.

## 3. Nutzbare Skills
`saubere-netz-anmeldung` · `status-leiste-siegel` · `verschluesselter-schluessel-tresor` ·
`geraetename`.

## 4. Abschluss-Pflicht (Kette reißt nie ab)
1. `docs/PULS.md` fortschreiben (bei `status.json`-Änderung vorher `update_puls_pie.py`).
2. Erledigte A/B-Punkte in `PLAN_SEMANTIK_KRYPTO.md` + Checkliste abhaken.
3. Übergabeprotokoll in `docs/sessions/archiv/`.
4. **Neuen Brief** schreiben + **vollständig als Codeblock im Chat** ausgeben.
5. „Nächste Schritte"-Block (2–4 Punkte) direkt in der Chat-Antwort.
6. Commit + Push je abgegrenzter Aufgabe; eigene PRs selbst mergen (Freibrief).

**Empfohlener Einstieg:** 2.1 Register-Refresh (Tomys-Status + stale Scores) → 2.3 Muttis-
Entscheid an Klaus stellen → 2.2 S5-Härtungs-Sims → dann A18/A11.
