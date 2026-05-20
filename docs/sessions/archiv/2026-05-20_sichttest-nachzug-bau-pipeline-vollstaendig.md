# Sichttest-Nachzug 2026-05-20 — Bau-Pipeline vollständig

**Sitzungs-Rolle:** Sichttest-Pflege-Sitzung (kein Code, kein Spec —
Doku-Nachzug nach Klaus' Browser-Sichttests). Branch
`claude/sichttest-nachzug-bau-pipeline-vollstaendig-j6mJF`, vom
main aus angelegt nach Merge PR #122 (Bau 04.B) + PR #123
(Brief Endknoten-Migration Multi-Identität).

---

## 1. Was geschah

Klaus hat in der Bau-Pipeline-Welle 2026-05-20 alle sieben
abgeschlossenen Bau-Sitzungen (Bau 01.Y → 02.Y → 04.A → 04.B →
05.Y → 06.Y → 07.Y → 08.Y) plus Sichttest-Nachzug von 08.Y
durchgemerged. Diese Pflege-Sitzung zieht die ausstehenden
Sichttest-Vermerke in den Modul-Karten + PULS.md nach und fixt
einen vergessenen Selbstcheck-Hinweistext in `tests/manual_check.html`.

Setup: Galaxy Tab S6 + DeX, Chrome auf Android, lokaler HTTP-Server
via Termux `python3 -m http.server 8000` gegen frisch geklontes
Sage-Protokol-Repo (Commit-Stand `9f4d565` = `main` nach
PR-#122-Merge).

---

## 2. Sichttest-Befunde aus Klaus' Browser-Lauf 2026-05-20

### Panel 01 Storage

`db_version: 7`. Store-Liste enthält die slot-suffixed Pflicht-
Stores `sbkim_siblings_main` (Schreiber Bau 05.Y),
`sbkim_anastomosis_log_main` (Schreiber Bau 05.Y + 06.Y),
`sbkim_hetero_inbox_main` (Schreiber Bau 06.Y),
`sbkim_hetero_outbox_main` (Schreiber Bau 08.Y),
`sbkim_legacy_inbox_main` (Schreiber Bau 07.Y). Default-Slot
`"main"` aktiv. Alle Selbstchecks grün. Knöpfe 1–8 grün.

### Panel 02 Spore

Knopf 8 „Identität anlegen + wechseln" grün — `getNodeId()`
wechselt von `main`-Persona auf `test`-Persona,
`setActiveIdentity('test')` setzt `sbkim_meta["active-identity"]`,
`listIdentities` zeigt `[main, test]`. Knöpfe 9/10 in dieser
Sitzung nicht erneut geklickt (bereits 2026-05-19 grün belegt im
Karte-02-Bauzustand). Identitäts-Wechsel ist Voraussetzung für
Bau-05.Y/06.Y/07.Y/08.Y Slot-Pfade.

### Panel 04 Match — Bau 04.B grundbelegt

**Cache-Befund:** zunächst nur 9 Knöpfe sichtbar (Service-Worker
hatte alte HTML-Version aus pre-Bau-04.B-Stand gecached). Klaus'
Workaround: `chrome://serviceworker-internals/` Unregister + „Clear
site data" + Tab-Reopen. Nach Cleanup: 10 Knöpfe sichtbar.

Knopf 10 `explainMatchLLM` live grün — `window.prompt`-Dialog
nimmt API-Key entgegen, Stufe-B-LLM-Call an Anthropic-API
(`https://api.anthropic.com/v1/messages`) wird abgesetzt, valides
JSON-Response wird strict-validiert, `ExplainResult{available:true,
analysisStrings, candidatesList, …}` zurückgeliefert.
Selbstcheck-Konsolen-Zeile zeigt alle vier Funktionen
(`match/isAboveProviderThreshold/matchDimensions/explainMatchLLM`).
KEIN localStorage-Schreibvorgang, KEINE Persistenz des API-Keys.

### Panel 05 Anastomose — Bau 05.Y grundbelegt

Panel 05 sichtbar mit allen 13 Knöpfen inkl. Knopf 10
„Sekundär-Persona-Vorbereitung Bau 05.Y". Selbstcheck-Konsolen-
Zeile grün.

### Panel 06 Heterokaryose — Bau 06.Y teilbelegt

Panel 06 sichtbar mit allen 15 Knöpfen inkl. Knopf 15 „Sekundär-
Persona-Vorbereitung Bau 06.Y". Selbstcheck-Konsolen-Zeile grün.
Voller Test-1–9-Lauf in dieser Sitzung NICHT durchgeklickt —
Klaus hat Schwerpunkt auf Panel 04 Bau 04.B gelegt. Slot-suffixed-
Stores des Receiver-Pfads sind durch Panel 01-Vermerk und
Headless-Smoke `tests/smoke_bau06y_transparent_slot_pfad.mjs`
(25 grün) **indirekt grundbelegt**; volle Re-Verifikation offen.

### Panel 07 Apoptose — Bau 07.Y grundbelegt

Test 6 Self-Apoptose IRREVERSIBEL grün — über alle Slots iteriert,
per-Slot `_sendLegacyForIdentity` ausgeführt, per-Slot Cleanup
über `CLEANUP_ORDER_BASES`, globaler Marker `sbkim_meta["active-
identity"]` zurückgesetzt, `SbkimSpore.resetIdentityCache()`
gerufen. Nach Test 6 stieg `db_version` von 7 auf 17 (per-Slot-
Stores via `ensureStore`-Bumps neu erzeugt, Modul-01 versions-
fail-soft toleriert das).

### Panel 08 UI-Demo — Bau 08.Y grundbelegt

Bereits am 2026-05-20 in eigener Sichttest-Nachzug-Sitzung PR #117
voll dokumentiert (`outbox_store: "sbkim_hetero_outbox_main"`,
`active_slot_key: "main"`, `db_version: 7→17`). Diese Pflege-
Sitzung zieht nur die übrigen Karten 04/05/06/07 + 02 + 01 nach.

---

## 3. Was eingetragen

- **`tests/manual_check.html`** Knopf „Selbstcheck Konsole prüfen"
  Hinweistext erweitert: „mit `match/isAboveProviderThreshold/
  matchDimensions/explainMatchLLM`" (war noch auf drei Funktionen
  vor Bau 04.B).
- **`docs/components/01_storage.md`** § Bauzustand neue Zeile
  „Sichttest Bau-Pipeline-vollständig" mit `db_version: 7` +
  slot-suffixed-Stores-Liste.
- **`docs/components/02_spore.md`** § Bauzustand neue Zeile
  „Sichttest-Nachzug Bau-Pipeline" mit Knopf-8-Identitäts-Wechsel-
  Re-Verifikation.
- **`docs/components/04_match.md`** § Bauzustand Bau 04.B Zeile
  um „Sichttest 2026-05-20 grundbelegt"-Anhang erweitert.
- **`docs/components/05_anastomose.md`** § Bauzustand Bau 05.Y
  Zeile um „Sichttest 2026-05-20 grundbelegt"-Anhang erweitert.
- **`docs/components/06_heterokaryose.md`** § Bauzustand Bau 06.Y
  Zeile um „Sichttest 2026-05-20 teilbelegt"-Anhang erweitert
  (Selbstcheck nur — voller 12-Test-Lauf offen).
- **`docs/components/07_apoptose.md`** § Bauzustand Bau 07.Y
  Zeile um „Sichttest 2026-05-20 grundbelegt"-Anhang erweitert.
- **`docs/PULS.md`** neuer Top-Eintrag „2026-05-20 · Sichttest-
  Nachzug Bau-Pipeline vollständig" über dem Brief-Eintrag. Zwei
  ältere Inline-Einträge (2026-05-17 Vision-Anker + Observatorium-
  Lehre 8) in den Archiv-Index ausgelagert, um unter der 3000-
  Zeilen-Schutz-Klausel zu bleiben.

---

## 4. Was NICHT angefasst

- Modul-Code in `src/`. Sage-Page `index.html`. INTERFACES.md.
  CLAUDE.md. `status.json`.
- `PROTOCOL_VERSION` / `DB_VERSION` / `BACKUP_FORMAT_VERSION`
  unverändert.
- `update_puls_pie.py` NICHT aufgerufen (`status.json` unverändert).

---

## 5. Bekannte Folge-Aufgaben

1. **Endknoten-Migration ausführen** in zwei externen Bau-
   Sitzungen (Mein-Mixarium + Mein-Rezeptbuch). Brief liegt im
   Sage-Protokol-Repo bereit (PR #123 gemerged):
   `docs/sessions/BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md`.
2. **Vision-Anker 5 Identitäts-Container Spec-Sitzung** (optional,
   parallel) — löst die `window.prompt`-Test-Brücke aus Bau 04.B
   mit produktivem sicheren Pfad.
3. **Folge-Sichttest Panel 06 12-Test-Lauf** — Multi-Slot-Persona-
   Setup mit Knopf 15 + Tests 1–9 voll durchklicken.

---

## 6. PR

Branch `claude/sichttest-nachzug-bau-pipeline-vollstaendig-j6mJF`.
Draft-PR „Sichttest-Nachzug Bau-Pipeline vollständig".
