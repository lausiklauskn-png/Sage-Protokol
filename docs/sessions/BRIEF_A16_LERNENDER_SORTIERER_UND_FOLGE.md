# BRIEF für die nächste Sitzung — nach Briefkasten-Dedup (B) + Modul 21 (C), 2026-07-12

**Freibrief gilt** (siehe `CLAUDE.md` § Freibrief): eigenständig bauen + eigene PRs selbst
mergen, wenn getestet (Headless/Smoke/Drift grün), abgegrenzt und nicht architektonisch
zweifelhaft; bei echtem Zweifel erst Klaus fragen; **nie stillschweigend** (Commit/PULS
dokumentieren). Netzweit für alle Repos. Erst mergen → dann prüft Klaus live (Pages deployt
von `main`, Hard-Reload nach Pull).

## Was diese Sitzung fertig gemacht hat (alles gemergt auf `main`)
1. **B — Briefkasten (Modul 23 UI, A12) entdoppeln + 🗑/↗ je Eintrag.** `recordOpenQuestion`
   fasst offene Fragen nach `(Frage-Text, Ziel-Name)` zusammen (statt jeder neuen `qid`) →
   EIN Eintrag mit `tries`-Zähler statt Doppel. Briefkasten rendert je Gruppe eine
   interaktive Karte mit „×N · zuletzt vor …", 🗑 je Eintrag, „↗ App öffnen" je Eintrag
   (endpoint beim Schreiben abgelegt). Reine Anzeige/Speicher — kein PROTOCOL_VERSION-Bump,
   kein PII, Kern 02/05/05b + 0.80-Riegel unberührt. Kanon PR #635, Smoke 81/81, Drift 21/21.
2. **C — Mikrofon/Modul 21 nachgezogen.** 6 von 7 Apps luden `21_spracheingabe.js` nicht
   (nur Kimseek hatte es). Byte-1:1 aus Kanon + Script-Tag ergänzt. 🎤 ist kein toter Knopf
   mehr (startet Web-Speech oder ehrliche „braucht EU-Schlüssel/Browser unterstützt nicht"-
   Meldung).
3. **Netzweiter Rollout (alle gemergt):** Mixarium #127, Rezeptbuch #315, family #66,
   BookLedgerPro #271, Tomys-Hub #104, Kimboard #23, Kimseek #23 (nur B). Byte-1:1 netzweit
   verifiziert (23_ui md5 `156d3932…`, 21 md5 `6912ea55…`).

## Offene PRs
- Keine aus dieser Kette (alle 8 gemergt). **#401** (Draft „Discovery-Expedition Bildmaterial")
  ist eine **fremde Sitzung — liegen lassen**, nicht anfassen.

## Was als Nächstes zu bauen ist (Reihenfolge)
1. **A16 — Lernender Sortierer** (eigener Brief `docs/sessions/BRIEF_A16_LERNENDER_SORTIERER.md`):
   display-only Re-Ranker in Modul 22, lernt aus der 📌-Merkliste, on-device, fail-soft.
   REINE Anzeige — gatet nichts, 0.80-Riegel + Kern unberührt. Smoke erweitern, byte-1:1
   `sbkim-bundle`/`such-tool`/`pinnwand` wo betroffen, netzweiter Rollout.
2. **Optional / auf Zuruf: Modell selbst hosten** (Flaschenhals/Offline). `/models/…`-Pfad in
   Modul 03 existiert schon (`detectModelSource`). Löst NICHT das Einfrieren (das ist der
   Worker, A17 erledigt) — rein Ladezeit/Offline/HuggingFace-Unabhängigkeit. Klaus muss die
   Modell-Dateien einmal hosten.
3. **Klaus' Browser-Sichttest B+C** auf den Live-Seiten (Mixarium/Rezeptbuch/…): 🎤 startet
   oder meldet ehrlich; Briefkasten zeigt EINEN Eintrag je Frage mit 🗑 + „↗ App öffnen".

## Rollout-Muster (bewährt, 8× am 2026-07-12 gefahren)
Kanon-Bau → Smoke grün → byte-1:1 `sbkim-bundle` (+ `such-tool`/`pinnwand` wo betroffen) →
Drift-Guards grün → Kanon-PR mergen → **netzweiter Rollout via Subagenten** (je Repo:
`git checkout -B claude/<branch> origin/main`, byte-copy Kanon, SW-Cache +1,
Kimboard/Kimseek recorded-sha im Drift-Guard `test/smoke.test.js` aktualisieren, node --check
/Test, Commit, Draft-PR → ready → squash-merge). App-Modul-Pfad: `sbkim/`
(Mixarium/Rezeptbuch/family/BLP/Tomys) bzw. `modules/` (Kimboard/Kimseek). **Mixarium:** QC-Datei
byte-identisch spiegeln (`cp index.html QC_*.html`). **Rezeptbuch:** Script-Tag in die QC-Datei,
dann `python3 build.py`; immer gegen `origin/main` (Default-Branch ist Decoy). Commit-Trailer:
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` +
`Claude-Session: <aktuelle Session-URL>`. Nie Modell-ID in Artefakte.

## Pflichtlektüre vor Arbeit
1. `CLAUDE.md` (§ Freibrief, § Was du nicht tust, § Fremdnutzer-Brille).
2. `docs/PULS.md` — oberster Eintrag 2026-07-12 (Briefkasten-Dedup + Modul 21).
3. `docs/PLAN_SEMANTIK_KRYPTO.md` — A16 (offen).
4. Dieser Brief + `docs/sessions/BRIEF_A16_LERNENDER_SORTIERER.md`.
5. Code der Scheibe: `src/modules/22_such_widget.js` (A16) bzw. `src/modules/23_rendezvous_ui.js`.

## Abschluss-Befehl (die Kette reißt nie ab)
Am Sitzungsende: `docs/PULS.md` fortschreiben, PLAN abhaken, **neuen Folge-Brief** anlegen +
vollständig als Codeblock im Chat ausgeben, Pflichtlektüre + diesen Abschluss-Befehl wiederholen.
Freibrief gilt.
