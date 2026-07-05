# BRIEF — nächste Sitzung (Stand 2026-07-05, nach Bedeutungs-Suche-Einbau)

```
Neue Sitzung — Sage-Protokol (+ Endknoten Rezeptbuch/Mixarium). Freibrief gilt (CLAUDE.md § Freibrief).

════════════════════════════════════════════════════════════════════
STAND — Bedeutungs-Suche LIVE in beiden Apps + KI-Richter-Fix netzweit
════════════════════════════════════════════════════════════════════
Zwei Dinge gebaut, headless getestet, gemergt, live auf main (GitHub Pages):

1) KI-Richter async-Provider-Fix (Modul 04 `queryLocalJudged` / Bau 04.G):
   queryLocalJudged awaitete den registrierten async Korpus-Provider NICHT —
   exakt der Bug, den PR #533 in queryLocal fixte, in 04.G übersehen. Der
   Cross-Knoten-Antwort-Pfad (Modul 15 op:"query") hätte LEER geantwortet,
   sobald der KI-Richter live an ist. Gefixt (await + try/catch, fail-soft
   parity) + Regressions-Probe 8 (async Provider, vorher blind).
   Live: Sage #536 (+Doku #537) · Mixarium #97 (SW mixarium-sw-v44) ·
   Rezeptbuch #287 (CACHE mrz-v31). Byte-Kopien such-tool/sbkim-bundle mit.

2) Bedeutungs-Suche im NORMALEN Suchfeld beider Apps (Klaus' Wunsch:
   "such-Nutzen gehört in die Rezepte, nicht versteckt hinten; weniger suchen"):
   kleiner 💡-Schalter neben dem Suchfeld, Default AUS, gemerkt in localStorage
   (Rezeptbuch mrSemOn / Mixarium mxsem9m). AN = semantische Zusatz-Treffer nach
   SINN (Modul 03 Embedding + Modul 04 queryLocal hybrid), rein additiv/Inklusion
   — die Wortsuche (wordMatchSQ) bleibt exakt + sofort, alcAllowed/Andock-Riegel
   unberührt, konsequent fail-soft. Effizienz: Korpus wird EINMAL app-seitig
   eingebettet (SEM_CORPUS, ~30 MB Modell einmalig beim ersten Einschalten,
   danach gecacht), pro Suche nur die Anfrage embeddet; Debounce 350 ms +
   Staleness-Guard. Live: Rezeptbuch #288 (build.py, CACHE mrz-v32) ·
   Mixarium #98 (index==QC md5, SW v45).

⏳ OFFEN — Klaus' Browser-Sichttest (der eigentliche Beweis, headless kann ihn
   nicht liefern). Zu klären: (a) 💡 antippen, "kuchen" (Rezeptbuch) / eine Idee
   (Mixarium) suchen → kommen Sinn-Treffer (Eierschecke/Stollen) zusätzlich mit?
   Fühlt sich der Schalter + der einmalige ~30-MB-Ladevorgang gut an? (b) Trenn-
   schärfe: das GRATIS-Netz kann ohne KI-Richter Lockeres reinnehmen (bekannter
   0.80-Anisotropie-Boden). Klaus' Rückmeldung steuert die nächste Aufgabe.

════════════════════════════════════════════════════════════════════
AUFGABE (eine wählen — nach Klaus' Sichttest-Rückmeldung priorisieren)
════════════════════════════════════════════════════════════════════
1. SICHTTEST-FEEDBACK EINARBEITEN (wahrscheinlich zuerst): Klaus' Urteil zur
   💡-Suche umsetzen. Kandidaten: kleines 💡-Kennzeichen direkt an den Sinn-
   Treffern (wordMatchSQ trennt schon exakt↔semantisch — Marker im Karten-Render
   möglich); ODER strengeres Netz (k kleiner / Score-Schwelle statt Top-12);
   ODER Zähler-Hinweis "N nach Bedeutung" im srchCnt. Je Repo Byte-Disziplin:
   Rezeptbuch QC→build.py + CACHE bumpen; Mixarium QC→index md5-gleich + SW bumpen.

2. KI-RICHTER IN DIE APP-SUCHE (opt-in/BYOK) zum Schärfen: den jetzt gefixten
   queryLocalJudged an das 💡-Suchfeld hängen, sodass MIT Schlüssel Fremdes
   (Hühnerfrikassee bei "kuchen") rausfällt. Default aus, fail-soft auf die
   gratis Bedeutungs-Suche. Nur, wenn Klaus echte Präzision will (kostet Schlüssel).

3. RELATEDNESS_CENTER v2 (gratis Trennschärfe OHNE Schlüssel): die zentrierte
   Verwandtschafts-Kalibrierung nachziehen (docs/LEHRE-EMBEDDING-MATCH-
   KALIBRIERUNG.md), damit das gratis Netz schärfer trennt — die dauerhaft
   schlüssellose Antwort auf die Trennschärfe-Frage.

4. GEGENTEST Cross-Knoten-Richter-Pfad (aus Vor-Brief, noch gültig): Eruda-
   Konsole in Rezeptbuch/Mixarium, SbkimMatch.queryLocalJudged("kuchen",8,
   {hybrid:true,apiKey:"…",provider:"gemini"}) → beweist den gefixten Richter-
   Pfad live (Hühnerfrikassee bekommt passt:false).

════════════════════════════════════════════════════════════════════
PFLICHTLEKTÜRE (in dieser Reihenfolge)
════════════════════════════════════════════════════════════════════
CLAUDE.md · docs/PULS.md (oberste 2 Einträge: Bedeutungs-Suche + 04.G-Fix) ·
docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md (erklärt den 0.80-Anisotropie-Boden!) ·
docs/components/04_match.md.
Endknoten-Suche (das neue Feature): Rezeptbuch + Mixarium index.html Funktionen
doSearch / matchSQ / wordMatchSQ + semSchedule/semRun/semEnsureCorpus/toggleSem/
updateSemBtn (💡-Schalter #semBtn in der srch-bar) + sbkim/sbkim-init.js
(Korpus-Provider buildRezeptbuchQueryCorpus / buildMixariumQueryCorpus).
SBKIM-Kern: sbkim/04_match.js (queryLocal / queryLocalJudged / hybridMatch).

⚠️ BRANCH-DISZIPLIN: IMMER von origin/main branchen. Der Rezeptbuch-GitHub-
   Default ist ein toter Vor-SBKIM-Decoy (kein sbkim/) → git checkout -B
   <branch> origin/main, sonst baust du ins Leere. Sage + Mixarium-Default = main.
⚠️ DEPLOY-DISZIPLIN: GitHub Pages serialisiert Deploys PRO KONTO → Änderungen
   bündeln, nicht viele Einzel-Merges hintereinander.
⚠️ ENDKNOTEN-BAU-REGELN: Mixarium hat KEINEN Build (index.html == QC byte-
   identisch, md5 prüfen) + SW_VERSION in app-sw.js bumpen. Rezeptbuch: QC ändern
   → python3 build.py → index.html; app-sw.js CACHE bumpen (index.html ist im
   SHELL-Precache, sonst alter Shell). Nach QC-Änderung die Pflicht-Checkliste ausgeben.

Selbst-Merge nach grünen Tests (Draft→ready→squash), dann prüft Klaus live.
Offener Fremd-PR Sage #401 (Discovery-Bildmaterial, Draft, 2026-06-23) — NICHT
unsers, unabhängig, kann liegen. Am Sitzungsende: PULS fortschreiben, Übergabe-
protokoll, diesen Brief-Typ neu ausgeben (Kette reißt nie ab).
```
