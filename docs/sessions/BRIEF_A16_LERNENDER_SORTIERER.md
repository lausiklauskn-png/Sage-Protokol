# BRIEF — A16: Lernender Sortierer (selbst-verbessernd, on-device)

**Stand 2026-07-11.** Klaus' Wunsch: das mitgelieferte Sortierprogramm soll mit jedem
Ja/Nein **besser werden** (Geist der BLP-„selbstlernenden Kalkulation", aber auf die
SUCHE). A11 (Auto-Knoten-Auswahl „🔎 Antwort holen") ist gebaut, netzweit ausgerollt und
in Klaus' Browser live bewiesen — dabei zeigte sich die Grenze: der rohe e5-small-Cosinus
sortiert flach (Treffer 0.81–0.83, „Melya"/„Kräuter-Nektar" für „erfrischend" nicht ideal).
A16 ist der Hebel dagegen.

## Pflichtlektüre (in dieser Reihenfolge)
1. `CLAUDE.md` (Verfassung, § Freibrief — gilt).
2. `docs/PULS.md` (oberster Block: A11 Teil A + Rollout + Live-Beweis).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` → Punkt **A16** (Beschreibung) + A11.
4. Code der Scheibe: `src/modules/22_such_widget.js` — v.a. `queryCorpus` (~Z. 2534),
   `rankView` (~Z. 3029, Vorbild für display-only Re-Ranking), Merkliste `loadMerkliste`/
   `addMerk`/`getMerkliste` (~Z. 3374/3401/3437), LS-Keys (~Z. 58–65).

## Was gebaut werden soll
Ein **display-only, fail-soft Re-Ranker in Modul 22** (NEBEN `rankView`, NICHT in Modul 04 —
der Protokoll-Kern bleibt zustandslos + Drift-Guard-sicher). Er gibt den `queryCorpus`-
Kandidaten einen **kleinen Boost** nach gelernten Mustern.
- **Lern-Signal (positiv):** die 📌-Merkliste (`sbkim_search_widget_merkliste`). Ein gemerkter
  Treffer `{query → titel/url/source}` ist ein positives Beispiel.
- **Modell (einfach, erklärbar):** neuer LS-Key `sbkim_search_widget_reranker` (pro App/Origin):
  Token/Source → Gewicht, aus gemerkten Treffern gelernt (Tokenisierung wie ein simpler
  Wortzerleger auf Titel/Text). Beim Ranken kleiner Boost für Kandidaten, deren Tokens/Source
  zu früher Gemerktem passen.
- **Nudge, kein Umbruch:** verändert NIE die Mitgliedschaft, kreuzt NIE den 0.80-Riegel;
  stabile Sortierung, nur ein leichtes Hochziehen. Kalt-Start = Identität (wie heute).
- **Negatives Signal (optional, Phase B.2):** ausdrückliches „nicht passend" — erst nach dem
  Positiven (heute gibt es nur „Haken weg = löschen", kein gespeichertes Negativ).

## Datenverträge / TABU (nicht brechen)
- Modul 04 (`queryLocal`/`match`/`PROVIDER_MIN_MATCH`) **unberührt**; kein PROTOCOL_VERSION-Bump.
- Kein PII im neuen LS-Key (nur Token/Source/Gewicht, wie die Merkliste: nur Text/Link).
- Byte-Kopie `such-tool/modules/22_such_widget.js` mitziehen (Drift-Guard
  `smoke_standalone_such_tool.mjs`).

## Akzeptanzkriterien (headless zuerst)
- Neuer Smoke `smoke_bau22g_lern_reranker.mjs`: (1) Kalt-Start = Identität (Eingabe-Reihenfolge
  unverändert); (2) nach einem 📌-Pin wird ein passender Kandidat sichtbar hochgenudged;
  (3) kreuzt nie den 0.80-Riegel / entfernt nichts; (4) fail-soft bei kaputten/fehlenden Gewichten.
- Regress-frei: `smoke_bau22*`, Drift-Guards grün.
- Danach: netzweiter Byte-Rollout wie bei A11 (7 Apps, SW-Bump, Kimboard/Kimseek sha-Guard).
- Browser-Sichttest durch Klaus (nicht ersetzbar).

## Reihenfolge
1. Kanon-Bau Modul 22 (Re-Ranker + Training aus Merkliste) + Smoke grün.
2. Byte-Kopie such-tool + Drift-Guard grün → PR → merge.
3. Netzweiter Rollout (Subagenten pro Repo, wie A11) → merge.
4. PULS/PLAN A16 abhaken.

## Offene Fragen an Klaus
- Reicht dir das **positive** Signal (📌-Merken) zum Start, oder willst du gleich ein sichtbares
  „👎 passt nicht" dazu (kostet ein UI-Element mehr)?
- Soll der Lern-Boost auch die **Knoten-Rangfolge** (A11 „Antwort holen") beeinflussen, oder
  vorerst nur die **lokale Treffer-Liste** im Such-Widget?

## Freibrief
Gilt (siehe `CLAUDE.md` § Freibrief): eigenständig bauen + eigene PRs mergen, wenn getestet
(Smoke/Drift grün), abgegrenzt und nicht architektonisch zweifelhaft; bei echtem Zweifel erst
Klaus fragen; nie stillschweigend (Commit/PULS dokumentieren).

## Abschluss-Befehl (Kette reißt nie ab)
Am Sitzungsende: PULS fortschreiben, A16 in PLAN abhaken, neuen Folge-Brief anlegen +
vollständig als Codeblock im Chat ausgeben, Pflichtlektüre + diesen Abschluss-Befehl wiederholen.
