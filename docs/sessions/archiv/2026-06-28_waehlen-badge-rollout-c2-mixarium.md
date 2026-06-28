# Übergabeprotokoll — „Wählen"-UI Badge: C.1 + C.2 Mixarium-Rollout

**Datum:** 2026-06-28 (Folge-Sitzung Nacht)
**Branch:** `claude/waehlen-badge-relatedness-v2-bww1q5`
**Rolle:** Bausitzung (Rollout, kein Modul-Kern-Eingriff)
**Brief:** `BRIEF_WAEHLEN_BADGE_RELATEDNESS_V2` (Strang C abschließen + D vorbereiten)

## Was getan

### Strang C.1 — #483 einsortieren → bereits erledigt
- `git fetch origin main`: PR #483 (Badge Modul 23) ist in Sage main (`b972454`),
  #485 (Mess-Knopf) ebenfalls (`a3bf1a9`).
- Drift-Guard Sage main intern grün: `src/modules/{04_match,23_rendezvous,
  23_rendezvous_ui}.js` byte-identisch zu `sbkim-bundle/modules/…`.
- Inhalt bestätigt: `relatedness`/`RELATEDNESS_CENTER` (04), `relatednessForCards`
  (23), Badge + „🧬 nur verwandte" (23 UI).
- → keine offene Aktion. Sage main trägt das Badge.

### Strang C.2 — Mixarium-Rollout → Draft-PR
- `Mein-Mixarium` drei `sbkim/`-Module byte-1:1 aus Sage `origin/main`
  (`git cat-file -p`) übernommen:
  - `sbkim/04_match.js` ← `src/modules/04_match.js` (`ec64226c…`) — behebt Drift
    (alte Version OHNE `relatedness`).
  - `sbkim/23_rendezvous.js` ← `src/modules/23_rendezvous.js` (`69f1ee79…`).
  - `sbkim/23_rendezvous_ui.js` ← `src/modules/23_rendezvous_ui.js` (`9150f482…`).
- md5-Drift-Guard gegen Sage main: **3/3 MATCH**.
- Lade-Reihenfolge bestätigt: `04_match.js` (Z. 13077) vor `23_rendezvous.js`
  (Z. 13087) in `index.html`.
- QC ↔ index byte-Parität geprüft (`md5sum index.html QC_…`: identisch);
  `sbkim/`-Module liegen außerhalb der Spiegelung, Script-Tags unverändert.
- Commit + Push, **Draft-PR `Mein-Mixarium#81`** (Merge entscheidet Klaus).
- Auto-Subscription auf PR #81; CI: `total_count:0` (kein PR-Gate; „SBKIM
  Netz-Wächter" = Schedule, `pages-build-deployment` = main-only). Stündlicher
  Selbst-Check-in via CronCreate gesetzt.

### Strang C.3 — family-project → bewusst ausgelassen
- family fährt eigenes Raum-UI (kein `23_rendezvous_ui.js`) → Badge = Consumer-
  Refactor, eigener Brief/Scope (nicht mit C.2 mischen).

### Strang D — `RELATEDNESS_CENTER` v2 → blockiert
- Setzt Klaus' Mess-Knopf-Ergebnis (Panel 04, `freigabeReif:true`) voraus.
- Keine Konstanten-Änderung vorgenommen → SIGNAL §11.6 nicht ausgelöst.

## Verträge gewahrt
- Reine Anzeige-Schicht; `relatedness()` gatet nichts; `PROVIDER_MIN_MATCH`
  (0.80) unberührt; Kern-Module 02/05/05b/23 unangetastet; Modul 04 nur als
  byte-Kopie übernommen.

## Sichttest-Stand
- Headless/md5-Drift-Guard grün. **Browser-Sichttest (Badge je Knoten im
  „Wer ist im Raum?"-Overlay) wartet auf Klaus** — sowohl Sage-Page (Strang B,
  schon in main) als auch Mixarium (nach Merge #81).

## Nächster sinnvoller Schritt
1. Klaus: Mixarium-PR #81 prüfen/mergen + Badge im Browser sichten.
2. Klaus: v2-Mess-Lauf (Panel 04) → Strang D Konstante netzweit setzen.
3. Folge-Sitzung: family-project-Badge (Consumer-Refactor, eigener Brief).
