# BRIEF für die nächste Sitzung — nach A16 + Netz-/Icon-Entwirrung + Kimseek-Netz-Finder, 2026-07-12

**Freibrief gilt** (siehe `CLAUDE.md` § Freibrief): eigenständig bauen + eigene PRs selbst
mergen, wenn getestet (Smoke/Drift grün), abgegrenzt und nicht architektonisch zweifelhaft;
bei echtem Zweifel erst Klaus fragen; **nie stillschweigend** (Commit/PULS dokumentieren).
Netzweit für alle Repos. Erst mergen → dann prüft Klaus live (Pages deployt von `main`,
Hard-Reload nach Pull).

## Was diese lange Sitzung fertig gemacht hat (alles gemergt auf `main`)

1. **A16 — Lernender Sortierer** (Modul 22): display-only Re-Ranker, lernt aus der 📌-Merkliste,
   begrenzter Nudge (≤3 Plätze), Kalt-Start = Identität, fail-soft. **Phase B**: Treffer-Bewertung
   **👍 sehr gut / 🙂 okay / 👎 nein** nach dem Seiten-Öffnen, an genau dem geprüften Treffer;
   gestufte + negative Gewichte. Kanon Sage #637/#639, Rollout such-tool/SB-KIMTool-Point/Kimseek.
2. **Netz-Benennung entwirrt** (#640): Such-Bereich „Netz" → **„Internet"** (+ Klartext-Hinweis
   Web ≠ Knotennetz); Rendezvous-Panel „Mit dem Netz verbinden" → **„Mit dem Knotennetz verbinden"**.
   Netzweit alle 10 Modul-23-UI-Kopien + 4 Modul-22-Kopien.
3. **Icon-Entwirrung** (#641): „Nur neu anmelden" 📌→**🙋** (Klaus' Wahl: kleines Winkel-/Melde-
   Männchen, NICHT Megafon), „offene nochmal fragen" 🔄→**🔁**. Damit bleiben **📌=Merken** und
   **🔄=neu laden** eindeutig der Suche. Netzweit alle 23-UI-Apps (inkl. Mein-Tresor + Jasons-Tresor,
   die dabei **auf Kanon-Stand gehoben** wurden — vorher zurück).
4. **Ehrlicher Leer-Hinweis** (Modul 22, #641): ein angehakter, aber nicht bestückter Bereich meldet
   „Hier nicht bestückt: „App" hat hier keinen eigenen Inhalt / „Knoten" ist hier nicht mit dem Netz
   verbunden" statt stumm „Keine Treffer". Neue `init`-Option **`areasHidden`** (Bereich ausblenden).
5. **Kimseek = echter Netz-Finder** (#28): „App" ausgeblendet (kein eigener Inhalt), **„Knoten" live
   ans gemeinsame Netz verdrahtet** — Knoten-Korpus aus dem Rendezvous-Raum (`discover()`,
   Sporen-`domainVector`) + `queryNode` live übers Relais (Anastomose). Fail-soft.
6. **Kimseek Modul 04** (#26): Richter-Sicherheits-/Konsequenz-Bewertung nachgezogen → Kimseek in
   allen 17 Modulen kanon-gleich.
7. **Funktions-Audit bestätigt**: KI-Richter greift wirklich (Anbieter+Schlüssel+Modell erreichen
   Modul 04); App/Knoten funktionieren, **wenn** die App den Korpus liefert.

**Netzweit gemergt:** Sage #637/#639/#640/#641 · Kimseek #24/#25/#26/#27/#28 · SB-KIMTool-Point
#113/#114/#115/#116 · Mixarium #127/#128/#129 · Rezeptbuch #315/#316/#317 · family #66/#67/#68 ·
Tomys #104/#105/#106 · Kimboard #23/#24/#25 · Mein-Tresor #61 · Jasons-Tresor #119.

## Offene PRs
- Keine aus dieser Kette (alle gemergt). **#401** (Draft „Discovery-Expedition") ist eine **fremde
  Sitzung — liegen lassen**.

## Was als Nächstes zu tun ist (Reihenfolge)

1. **Klaus' Browser-Sichttest** (nicht ersetzbar, blockiert nichts) auf den deployten Seiten
   (Hard-Reload nach Pull): (a) Icons 🙋/🔁 richtig; (b) **Kimseek: „Knoten" ankreuzen + suchen →
   findet er echte Knoten aus dem Raum?** (braucht: vorher „Mit dem Knotennetz verbinden" drücken,
   damit Karten im Raum sind); (c) A16-Bewertung 👍/🙂/👎 nudget bei erneuter Suche sichtbar; (d)
   ehrlicher Leer-Hinweis erscheint statt „Keine Treffer".
2. **OFFEN — Tooltip-/Hinweistext-Bug (Klaus 2026-07-12):** Klaus meldete, im „Mit dem Knotennetz
   verbinden"-Panel taucht beim Hovern der Hinweistext **hinter dem Container** auf. Befund bisher:
   die Panel-Hinweise sind **native `title`-Tooltips** (können eigentlich nicht hinter Container),
   kein eigener Tooltip im Code gefunden. **Nächster Schritt:** Klaus um einen Screenshot des genauen
   Moments bitten (welches Element, hover vs. immer-sichtbar) — dann gezielt fixen. NICHT blind an
   z-index/overflow schrauben. (Modul 23 UI Panel-`z-index` 2147483600; Modul 22 Widget 9985.)
3. **A16 offene Frage** (aus `BRIEF_NACH_A16…`): soll der Lern-Boost auch die **Knoten-Rangfolge**
   („🔎 Antwort holen") beeinflussen, oder nur die lokale Treffer-Liste (heute)?
4. **Kimseek Live-Knoten verfeinern** (Folge): der Knoten-Korpus wird beim ersten Suchen einmal
   aus dem Raum gebaut und gecacht (`nodeCorpusReady`). Wer später mehr Knoten trifft, sieht sie erst
   nach Reload. Optional: bei „Knoten leer" ein Hinweis „erst „Mit dem Knotennetz verbinden" drücken".

## Rollout-Muster (bewährt, heute vielfach gefahren)
Kanon-Bau (Sage `src/modules`) → Smoke grün → byte-1:1 `such-tool` + `sbkim-bundle` (wo betroffen) →
Drift-Guards grün → Kanon-PR mergen → **netzweiter Rollout via Subagenten** (je Repo:
`git checkout -B claude/<branch> origin/main`, byte-copy Kanon, SW-Cache +1,
Kimboard/Kimseek recorded-sha im Drift-Guard `test/smoke.test.js` aktualisieren, node --check/Test,
Commit, Draft-PR → ready → squash-merge). **Vor dem Rollout mit `search_code filename:<modul>.js
user:lausiklauskn-png` prüfen, WO das Modul lebt.** Modul-22-Kopien: Sage src + such-tool +
SB-KIMTool-Point such-tool + Kimseek. Modul-23-UI-Kopien: Sage src + sbkim-bundle + Mixarium/
Rezeptbuch/family/Tomys (`sbkim/`) + Kimboard/Kimseek (`modules/`) + Mein-Tresor/Jasons-Tresor
(`sbkim/`). **Rezeptbuch:** immer gegen `origin/main` (Default-Branch ist Decoy). **Mixarium:**
index.html/QC nur anfassen, wenn index.html geändert wird (Module liegen in `sbkim/`). Commit-Trailer:
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` + `Claude-Session: <Session-URL>`. Nie
Modell-ID in Artefakte.

## Hinweis Tool-Bug (Client)
Klaus berichtet: der `AskUserQuestion`-Dialog bleibt bei ihm hängen und ploppt wiederholt auf
(blockiert seine Arbeit). **Konsequenz:** `AskUserQuestion` sparsam einsetzen; wo möglich Vorschlag
im Chat machen + auf Klaus' Text-Antwort reagieren, statt den Dialog zu öffnen.

## Pflichtlektüre vor Arbeit
1. `CLAUDE.md` (§ Freibrief, § Was du nicht tust, § Fremdnutzer-Brille).
2. `docs/PULS.md` — oberste Einträge 2026-07-12.
3. Dieser Brief + `docs/sessions/BRIEF_NACH_A16_LERNENDER_SORTIERER.md`.
4. Code der Scheibe: `src/modules/22_such_widget.js` (Bereiche/`areaHasSource`/`unpopulatedAreaNote`/
   `learnedRerank`/Feedback), `src/modules/23_rendezvous_ui.js` (Icons/Panel).

## Abschluss-Befehl (die Kette reißt nie ab)
Am Sitzungsende: `docs/PULS.md` fortschreiben, PLAN abhaken, **neuen Folge-Brief** anlegen +
vollständig als Codeblock im Chat ausgeben, Pflichtlektüre + diesen Abschluss-Befehl wiederholen.
Freibrief gilt.
