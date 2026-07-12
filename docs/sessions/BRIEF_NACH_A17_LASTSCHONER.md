# BRIEF für die nächste Sitzung — nach A17 Last-Schoner (2026-07-12)

**Freibrief gilt** (siehe `CLAUDE.md` § Freibrief): eigenständig bauen + eigene PRs selbst
mergen, wenn getestet (Headless/Smoke/Drift grün), abgegrenzt und nicht architektonisch
zweifelhaft; bei echtem Zweifel erst Klaus fragen; **nie stillschweigend** (Commit/PULS
dokumentieren). Netzweit für alle Repos. Erst mergen → dann prüft Klaus live (Pages deployt
von `main`).

## Was diese Sitzung fertig gemacht hat (alles gemergt auf `main`)
1. **A17 Last-Schoner — Embedding im Web-Worker (Modul 03).** Das e5-Modell rechnet jetzt in
   einem Inline-Blob-Web-Worker statt im Anzeige-Faden → **kein Tablet-Einfrieren mehr**
   (Klaus live bestätigt: „läuft flüssig"). Streng fail-soft (kein Worker → Haupt-Faden,
   byte-gleiche Vektoren; `init({worker:false})` schaltet ab). Smoke `smoke_bau03_worker.mjs`
   15/15. Kanon PR #630; netzweit 7/7 (Mixarium #125, Rezeptbuch #313, family #64, BLP #269,
   Tomys #102, Kimboard #21, Kimseek #21). Dazu die kleine „Antwort holen"-Drosselung (Modul 23 UI).
2. **Partner-Link „↗ App öffnen" (Modul 23 UI).** Jede Raum-Karte trägt einen direkten Link
   zur App/PWA des Knotens (Spore-`endpoint`, neuer Tab, fail-soft) + ehrliche „Knoten nicht
   offen/wach"-Meldung. Kanon PR #632; netzweit 7/7 (Mixarium #126, Rezeptbuch #314, family #65,
   BLP #270, Tomys #103, Kimboard #22, Kimseek #22). Smoke 73/73. Reine Anzeige — 0.80-Riegel
   + Kern 02/05/05b unberührt, kein PROTOCOL_VERSION-Bump.

**Wichtige Diagnose (Klaus' Befund „zeigt nur, WER antworten könnte"):** server-los kommt die
Cross-Knoten-Antwort NUR, wenn der Gegen-Tab offen + vorn + wach ist. Auf einem Gerät unmöglich,
während man selbst vorn ist → System zeigt Rangfolge + legt die Frage in den Briefkasten (daher
Doppel). Der Partner-Link ist die Selbst-Such-Abhilfe. Das ist die bekannte serverlose Grenze,
kein Bug.

## Offene PRs
- **#401** (Draft „Discovery-Expedition Bildmaterial", Branch `…imagery-hawd8z`) — **fremde
  Sitzung, NICHT von dieser Kette. Liegen lassen**, nicht mergen/anfassen.

## Was als Nächstes zu bauen ist (Reihenfolge)
Detail-Brief liegt: **`docs/sessions/BRIEF_BRIEFKASTEN_DEDUP_UND_MODUL21_MIC.md`** (verbindlich lesen).

1. **C — Mikrofon/Modul 21 fehlt** (kleiner, klarer „toter Knopf"). Mixarium (& evtl. weitere)
   laden `21_spracheingabe.js` nicht → 🎤 meldet „Modul 21 nicht geladen". Audit pro App
   (Datei vorhanden? `<script>` geladen vor 22/23?), byte-1:1 aus Kanon `src/modules/21_spracheingabe.js`
   nachziehen + Script-Tag + SW-Bump + Kimboard/Kimseek sha-Guard. Fail-soft-Meldung ehrlich halten.
2. **B — Briefkasten (A12) entdoppeln + Löschen je Eintrag + Partner-Link je Eintrag**
   (`src/modules/23_rendezvous_ui.js`, `recordOpenQuestion` ~Z.131 + Render der offenen Fragen).
   Gleiche `(frage, ziel)` → 1 Gruppe mit `tries`/`lastTs`; 🗑 pro Gruppe; „↗ App öffnen" je Eintrag
   (endpoint beim Schreiben mit ablegen). Reine Anzeige/Speicher, kein PII, kein Protokoll-Bump.
   Smoke erweitern, byte-1:1 sbkim-bundle, netzweiter Rollout.
3. **A16 — Lernender Sortierer** (eigener Brief `docs/sessions/BRIEF_A16_LERNENDER_SORTIERER.md`):
   display-only Re-Ranker in Modul 22, lernt aus der 📌-Merkliste, on-device, fail-soft.
4. **Optional / auf Zuruf: Modell selbst hosten** (Flaschenhals/Offline). `/models/…`-Pfad in
   Modul 03 existiert schon (`detectModelSource`). Löst NICHT das Einfrieren (das ist der Worker) —
   rein Ladezeit/Offline/HuggingFace-Unabhängigkeit. Klaus muss die Modell-Dateien einmal hosten.

## Rollout-Muster (bewährt, 2× am 2026-07-12 gefahren)
Kanon-Bau → Smoke grün → byte-1:1 `sbkim-bundle` (+ `such-tool`/`pinnwand` wo betroffen) →
Drift-Guards grün → Kanon-PR mergen → **netzweiter Rollout via 7 Subagenten** (je Repo:
`git checkout -B claude/a-series-semantic-search-gqn379 origin/main`, byte-copy Kanon, SW-Cache
+1, Kimboard/Kimseek recorded-sha im Drift-Guard aktualisieren, node --check/Test, Commit,
Draft-PR → ready → squash-merge). Force-with-lease NUR wenn `git diff origin/main..origin/<branch>
--stat` leer (nur gemergte Historie). App-03-Pfad: `sbkim/` (Mixarium/Rezeptbuch/family/BLP/Tomys)
bzw. `modules/` (Kimboard/Kimseek). Rezeptbuch: immer gegen `origin/main` (Default-Branch ist Decoy),
`index.html` via build.py nicht anfassen. Commit-Trailer:
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` +
`Claude-Session: https://claude.ai/code/session_01Nk46c9S8ivUBCBz18yq3Hq`. Nie Modell-ID in Artefakte.

## Pflichtlektüre vor Arbeit
1. `CLAUDE.md` (§ Freibrief, § Was du nicht tust, § Fremdnutzer-Brille).
2. `docs/PULS.md` — oberste Einträge 2026-07-12 (Partner-Link + A17).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — Punkt A17 (erledigt), A16 (offen).
4. Dieser Brief + `docs/sessions/BRIEF_BRIEFKASTEN_DEDUP_UND_MODUL21_MIC.md`.
5. Code der Scheibe: `src/modules/23_rendezvous_ui.js` bzw. `src/modules/21_spracheingabe.js`.

## Abschluss-Befehl (die Kette reißt nie ab)
Am Sitzungsende: `docs/PULS.md` fortschreiben, PLAN abhaken, **neuen Folge-Brief** anlegen +
vollständig als Codeblock im Chat ausgeben, Pflichtlektüre + diesen Abschluss-Befehl wiederholen.
Freibrief gilt.
