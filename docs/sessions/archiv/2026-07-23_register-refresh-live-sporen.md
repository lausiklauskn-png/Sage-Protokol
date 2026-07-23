# Übergabeprotokoll — Register-Refresh gegen die Live-Sporen (+Muttis) · 2026-07-23

**Rolle:** Hauptsitzung. **Auftrag:** Brief `BRIEF_NETZSTAND_REGISTER_REFRESH.md`
(2.1 Register-Refresh, 2.3 Muttis). **PR #701 gemergt.**

## Klaus-Entscheide dieser Sitzung
- „**Register voll aktualisieren**" + „**die falschen Test/Sim-Annahmen mitkorrigieren**".
- Muttis **per Tat**: Klaus hat die Muttis-Spore im Browser erzeugt + hochgeladen → voller Knoten.

## Was getan
1. **Autoritative Live-Prüfung.** Alle 12 fremden Live-Sporen frisch von `main` über das
   authentifizierte GitHub-MCP geholt + mit dem Produktiv-Verifizierer (Modul 02
   `verifyForeignSpore`) headless geprüft → **alle ✔ VALID**; Sage-Cosinus je Knoten unabhängig
   nachgerechnet (Python + `tools/match_baseline.mjs`).
2. **Befund:** das Register (`status.json`) war mehrfach stale — 9 von 12 committeten nodeIds
   überholt (Adress-Wand, v0.2-Identitäten), **alle** matchScores gedriftet (durchweg HÖHER nach
   der v0.2-Welle). Die letzte Sitzung (PR #697) hatte aus **veralteten lokalen Inbox-Kopien**
   fälschlich „Rezeptbuch/Mixarium < 0.80" geschlossen und in Tests+Sim gebaut — **Live-Wahrheit
   ist das Gegenteil** (Rezeptbuch 0.881, Mixarium 0.822).
3. **`status.json` voll aktualisiert (14 Endknoten):** 9 nodeIds + alle Scores → Live-Werte
   (alte in `previousNodeIds`); **Tomys** verified-match → **verified-spore** (Sage 0.7917 < 0.80,
   matcht Family/BLP); **Private Brain** verified-spore → **verified-match** (0.810427);
   **Muttis-Rezeptbuch** als 14. Endknoten (verified-match 0.8766, GETRENNTE Identität +
   DB-Suffix `muttisrezeptbuch`). `sage-knoten-korpus.js`, `NETZ-STAND.md`,
   `muttis_inbox.verify.md`, Inbox-Kopien (+ `tomys_inbox`, `muttis_inbox`), `update_puls_pie`.
4. **Muttis** ist auf seinem eigenen `main` bereits voll integriert (Module + Identität +
   `sbkim/spore.json` byte-identisch zur Upload-Datei) — kein Muttis-Repo-Push nötig.
5. **Test/Sim korrigiert:** `sim_multinode` Phase 3 + `smoke_bau23_rendezvous` Probe 15 nutzen
   **Tomys** als ehrliches <0.80-Beispiel; `smoke_bau04e_relatedness` auf die wahren Invarianten
   reduziert + **RELATEDNESS_CENTER v2** als offenen Modul-04-Kalibrier-Entscheid dokumentiert
   (Modul 04 NICHT angefasst — kein Grün-Rechnen).
6. **Merge-Konflikt** mit parallel gemergten PR #699/#700 (die nur Muttis addierten, ohne
   Refresh) sauber aufgelöst: main-Base + mein 12-Knoten-Refresh, einzelner Muttis-Eintrag.

## Beweis / Grenzen
- Alle 12 Live-Sporen ✔ VALID; Suite **61/61 grün** (unabhängig, nach Merge nachgefahren).
- **Nicht headless:** Live-Ed25519-Handshakes im Browser (Muttis + re-signierte Knoten) — warten
  auf Klaus. **RELATEDNESS_CENTER v2** bewusst offen (architektonisch/byte-copy-weit → Klaus).

## Nächster sinnvoller Schritt
1. **RELATEDNESS_CENTER v2** — Modul-04-Entscheid (Klaus): Mittelpunkt aus den v0.2-Vektoren neu
   berechnen? (byte-copy-weit, betrifft „verwandt"-Anzeige aller Apps.)
2. **BLP v0.2** — einziger verbliebener Demo-Grenzfall (Spore noch v0.1) → Live-Re-Sign im Browser.
3. **S5-Härtungs-Sims** (Brief §2.2), dann **A18** (Siegel-Wizard-Rollout) / **A11**.
