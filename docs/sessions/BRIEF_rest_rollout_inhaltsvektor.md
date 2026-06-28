# Brief — Rest-Rollout Inhalts-Vektor + Schwelle setzen (Folge zu 2026-06-28)

**Branch:** `claude/threshold-calibration-rollout-0rq08m` (je Repo **frisch auf
origin/main** setzen!). **Freibrief gilt** (siehe jeweilige CLAUDE.md).

**ACHTSAMKEIT (Lehre aus der Vorgänger-Sitzung, festgehalten):** VOR jedem
Urteil/Bau `git fetch origin main` + `git ls-tree -r origin/main` ausführen —
**NIE** aus dem Working-Tree schließen. Ein veralteter lokaler Checkout führte
2026-06-28 zu einer falschen Tatsachen-Behauptung („Repo hat null SBKIM-Code"),
die erst nach origin/main-Prüfung korrigiert wurde. Keine Aussage ohne Prüfung.

## Stand (erledigt 2026-06-28)
- **Mein-Rezeptbuch ausgerollt** — Draft-PR #269 (byte-1:1 `sbkim/02+03` aus Sage
  + `sampleContent` aus `window.R`; Auto-Pfad nutzt Inhalts-Vektor, Siegel-
  Semantik-Textfeld bleibt bewusst Beschreibung). Wartet auf Klaus' Merge + Re-Sign.
- **Sage Kalibrier-Instrument** — Draft-PR #478 (Knopf „KALIBRIER-BODEN messen"
  im Modul-04-Panel `tests/manual_check.html`; misst Boden roh+zentriert +
  `mean+2·sd`-Empfehlung). `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` Stand-Block.
- **Verifiziert je origin/main:** Mein-Tresor, Jasons-Tresor, BookLedgerPro sind
  ALLE byte-1:1-Fälle (`sbkim/02+03` = clean pre-content Sage-Module, `sbkim-init.js`
  mit Browser-e5-Spore-Pfad). SB-KIMTool-Point = `sandbox/`-Demo-Hub (Pfad
  bestätigen, nicht annehmen).

## Daten-Entscheid sensible Apps (FESTGELEGT 2026-06-28, Klaus bestätigt)
Siehe `docs/MEILENSTEIN_VON_DER_HUELLE_ZUM_INHALT.md` § Datenschutz:
- **BookLedgerPro** — Inhalts-Vektor **nur** aus Konto-/Kategorie-Labels des
  Standard-Kontenrahmens (non-PII). Niemals Beträge/Belege/Buchungstexte.
- **Mein-Tresor / Jasons-Tresor** — **kein** Fach-Inhalt-Sampling; behalten den
  Beschreibungs-Vektor (`embeddingSource:"description"`), bis Klaus eine
  unkritische, fest vorgegebene Kategorie-Taxonomie freigibt.

## Ziel dieser Sitzung
1. **BookLedgerPro ausrollen** — byte-1:1 `sbkim/02+03` aus Sage (md5-Drift-Guard)
   + `sampleContent` aus Konto-/Kategorie-Labels. Eigener Draft-PR. Merge: BLP-
   Freibrief erlaubt, Re-Sign im Browser bleibt Klaus.
2. **Mein-Tresor / Jasons-Tresor** — `sbkim/02+03` byte-1:1 aus Sage **synchron
   ziehen** (bringt `regenerateOwnSpore`/`embedContentVector` ins Netz, Drift-Guard),
   aber `sampleContent` **NICHT** aktivieren (Daten-Entscheid oben). Eigener Draft-PR.
3. **Schwelle setzen** — sobald Klaus den Kalibrier-Boden gemessen hat:
   `status.json` `config.PROVIDER_MIN_MATCH` BEWUSST setzen (absolut `mean+2·sd`
   ODER zentrierter Cosinus in Modul 04 — Klaus' Verfahrens-Entscheid). Tafel
   dokumentieren.
4. **verified-match vorher/nachher** je re-signtem Knoten in `NETZ-STAND`.

## Leitplanken
384-dim, L2, e5-small, `embedPassage`-Pfad. Additive Felder `embeddingSource`/
`embeddingVersion`, kein PROTOCOL_VERSION-Sprung. Kein PII. Empfangsmodus
unberührt (Re-Embedding nutzer-ausgelöst). Kopieren statt klonen (byte-1:1,
md5-Drift-Guard). Merge: Sage Freibrief; Endknoten/Tresore/BLP nach jeweiliger
CLAUDE.md; Re-Sign immer Klaus.

## Pflichtlektüre VOR der Arbeit
1. Dieser Brief. 2. `docs/MEILENSTEIN_VON_DER_HUELLE_ZUM_INHALT.md` (Datenschutz-
   Entscheid). 3. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` (Stand-Block).
4. `docs/PULS.md` (oberster Eintrag). 5. Pro Repo CLAUDE.md + `sbkim/SIGNAL.json`.
6. Referenz-Diff: Mixarium PR #80 / Rezeptbuch PR #269 (das Muster).

## Abschluss-Pflicht
PULS/SIGNAL je gebautem Repo (§11.6 seq +1), „Nächste Schritte"-Block im Chat,
neuen Brief als Codeblock im Chat. Kern-Match-Änderung schließt mit
„Browser-Live-Match wartet auf Klaus".
