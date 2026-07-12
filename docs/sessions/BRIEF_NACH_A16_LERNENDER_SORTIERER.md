# BRIEF für die nächste Sitzung — nach A16 (Lernender Sortierer), 2026-07-12

**Freibrief gilt** (siehe `CLAUDE.md` § Freibrief): eigenständig bauen + eigene PRs selbst
mergen, wenn getestet (Headless/Smoke/Drift grün), abgegrenzt und nicht architektonisch
zweifelhaft; bei echtem Zweifel erst Klaus fragen; **nie stillschweigend** (Commit/PULS
dokumentieren). Netzweit für alle Repos. Erst mergen → dann prüft Klaus live (Pages deployt
von `main`, Hard-Reload nach Pull).

## Was diese Sitzung fertig gemacht hat (alles gemergt auf `main`)
**A16 — Lernender Sortierer (display-only Re-Ranker) in Modul 22.** Das mitgelieferte
Sortierprogramm lernt jetzt aus der 📌-Merkliste und gibt passenden Kandidaten einen kleinen,
**begrenzten** Nudge nach oben (Sortier-Schlüssel `index − boost·3`, max. 3 Plätze).
- Neuer LS-Key `sbkim_search_widget_reranker` (Token/Source→Gewicht, **kein PII**).
- Reine Funktionen `computeRerankerModel(merkliste)` + `learnedRerank(treffer,{model?})`;
  `retrainReranker()` hängt an `addMerk`/`removeMerk`/`clearMerkliste`; angewandt in
  `displayTreffer` **nur** auf die grobe „verbunden"-Sicht (verwandt/KI unberührt).
- **Kalt-Start / kaputtes Modell → Identität.** Entfernt nichts, **0.80-Riegel + Modul 04/05
  unberührt, kein PROTOCOL_VERSION-Bump.** Surface `+learnedRerank/computeRerankerModel/
  trainReranker/getRerankerModel`, `_meta.rerankerReady/rerankerTrained/rerankerTokens`.
- Smoke `smoke_bau22g_lern_reranker.mjs` **33/33**; bau22 260, bau22e 45, bau22f 17,
  Drift-Guard `such-tool` 49/49.
- **Netzweiter Rollout (Modul 22 lebt nur an 4 Orten):** Kanon Sage `src` + `such-tool`
  (PR #637), **SB-KIMTool-Point** `such-tool/modules/22` (PR #113, SW v3→v4), **Kimseek**
  `modules/22` (PR #24, Drift-SHA nachgezogen `357992c5…`, SW v13→v14). Alle byte-1:1
  (md5 `adfa5f53…`). **Nicht** in den Rezept-Apps (die haben kein Modul 22, nur eigene
  Suchfelder an Modul 04).

## Offene PRs
- Keine aus dieser Kette (alle 3 gemergt). **#401** (Draft „Discovery-Expedition Bildmaterial")
  ist eine **fremde Sitzung — liegen lassen**, nicht anfassen.

## Was als Nächstes zu bauen ist (Reihenfolge)
1. **Klaus' Browser-Sichttest A16** (nicht ersetzbar, blockiert nichts): im Such-Widget suchen,
   einen Treffer 📌-merken, erneut suchen → der gemerkte/ähnliche Treffer steht sichtbar weiter
   oben. Läuft auf den deployten Seiten (Such-Tool / Kimseek). Findet Klaus etwas → Folge-Fix.
2. **A16 Phase B.2 (optional, auf Klaus' Zuruf): negatives Signal „👎 passt nicht".** Heute nur
   positives Signal (📌). Ein sichtbares „passt nicht" pro Treffer würde ein Negativ-Gewicht in
   `sbkim_search_widget_reranker` speisen (Kandidat leicht nach unten). Kostet **ein UI-Element
   mehr** — deshalb erst nach Klaus' Ja. *Offene Frage an Klaus (aus dem A16-Brief):* reicht das
   positive Signal, oder soll gleich „👎" dazu?
3. **A16 Folge-Frage (aus dem Brief):** soll der Lern-Boost auch die **Knoten-Rangfolge**
   (A11 „🔎 Antwort holen") beeinflussen, oder vorerst nur die **lokale Treffer-Liste**? Heute
   nur die lokale Liste (`displayTreffer`).
4. **Optional / auf Zuruf: Modell selbst hosten** (Flaschenhals/Offline). `/models/…`-Pfad in
   Modul 03 existiert (`detectModelSource`). Löst NICHT das Einfrieren (das ist der Worker, A17
   erledigt) — rein Ladezeit/Offline/HuggingFace-Unabhängigkeit. Klaus muss die Modell-Dateien
   einmal hosten.

## Rollout-Muster (bewährt)
Kanon-Bau → Smoke grün → byte-1:1 `such-tool` (+ `sbkim-bundle`/`pinnwand` **nur wo das Modul
lebt**) → Drift-Guards grün → Kanon-PR mergen → **netzweiter Rollout** (je Repo:
`git checkout -B claude/<branch> origin/main`, byte-copy Kanon, SW-Cache +1, Kimseek/Kimboard
recorded-sha im Drift-Guard `test/smoke.test.js` aktualisieren, node --check/Test, Commit,
Draft-PR → ready → squash-merge). **Wichtig:** vor dem Rollout mit `search_code
filename:<modul>.js user:lausiklauskn-png` prüfen, **wo das Modul überhaupt lebt** — nicht jedes
Modul ist in jeder App (Modul 22 z.B. nur in Sage/such-tool/SB-KIMTool-Point/Kimseek).
Commit-Trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` +
`Claude-Session: <aktuelle Session-URL>`. Nie Modell-ID in Artefakte.

## Pflichtlektüre vor Arbeit
1. `CLAUDE.md` (§ Freibrief, § Was du nicht tust, § Fremdnutzer-Brille).
2. `docs/PULS.md` — oberster Eintrag 2026-07-12 (A16 Lernender Sortierer).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — A16 (abgehakt), Rest offen.
4. Dieser Brief.
5. Code der Scheibe: `src/modules/22_such_widget.js` (A16-Block direkt nach `getMerkliste`,
   `displayTreffer` ~Z. 3090, Surface/`_meta` ~Z. 4360).

## Abschluss-Befehl (die Kette reißt nie ab)
Am Sitzungsende: `docs/PULS.md` fortschreiben, PLAN abhaken, **neuen Folge-Brief** anlegen +
vollständig als Codeblock im Chat ausgeben, Pflichtlektüre + diesen Abschluss-Befehl wiederholen.
Freibrief gilt.
