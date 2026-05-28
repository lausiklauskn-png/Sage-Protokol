# Übergabeprotokoll · 2026-05-28 · Sichttest-Nachzug Bau 18 Sub (a) Vorab

**Branch:** `claude/bau-18-sichttest-nachzug`
**Pipeline-Schritt:** Phase A **5h.1 — Sichttest** (Nachzug nach
Bau-Sitzung 18 Sub (a) Vorab PR #193 + Spec-Sitzung 18 Sub (a) Vorab
PR #190).
**Sitzungs-Rolle:** Sichttest-Nachzug-PR. Doku-Pflege only, kein
Code-Eingriff.
**Auslöser:** Klaus' grüner Live-Sichttest am Galaxy Tab S6 (DeX-
Chrome) für Panel 18 Knöpfe 1–10. CLAUDE.md-Konvention: nach Klaus'
grünem Browser-Sichttest folgt ein eigener Nachzug-PR mit Bau-
zustand-Tabellen-Update und Sichttest-Beweis-Screenshots im Repo.

---

## Was getan

### 1. Klaus' Sichttest 10/10 grün

Reihenfolge auf dem Tab:

| # | Knopf | Output / Erfolgs-Indikator |
|---|---|---|
| 0 | Setup: `init({…vollständig…})` | `ready=true`, alle Pflicht-Felder gespiegelt, `repoUrl` auto-erkannt aus `http://localhost:8000/tests/`, `missingFields: []` |
| 1 | Surface + Selbstcheck | `public_surface=[close,init,isOpen,openAndockTab]`, beide `error_factories` als Function vorhanden, `meta_typeof=object` |
| 2 | `init({})` ohne Pflicht-Felder | `ready_vorher: true`, `ready_nachher: false`, `missing_fields: [endpoint,domain,domainKeywords]` |
| 3 | `init({…vollständig…})` | `ready: true`, `missing_fields: []` — Re-Init heilt sauber |
| 4 | `openAndockTab()` ohne ready | `error.name === "ToolPwaNotReadyError"` mit voller Liste der fehlenden Felder im `message` |
| 5 | `openAndockTab()` mit ready | Modal sichtbar gemountet (siehe `screenshots/2026-05-28_panel18_test5_modal_schritt1.jpg`); `modal_im_dom: true`, `style_im_head: true`, `current_step: 1`, `modal_open: true`, `is_open: true`, `last_fetch_url: null` |
| 6 | `openAndockTab("https://lausiklauskn-png.github.io/Mein-Mixarium/")` | **Live-Spore-Fetch erfolgreich** (siehe `screenshots/2026-05-28_panel18_test6_spore_geladen.jpg`); Stepper-Schritt 1 ✓ + Schritt 2 aktiv; Foreign-Spore-Preview rendert volle Mixarium-Identität (Knoten-ID `B7Fke9CYTR1BrC3x…`, sieben Domain-Stichworte, alle Stamm-/Gast-Kategorien); `current_step: 2`, `last_fetch_url` gespiegelt |
| 7 | `openAndockTab("not-a-url")` | `error.name === "ToolPwaInvalidUrlArgError"` mit ungültigem URL-Argument im `message` |
| 8 | `close()` mit offenen Wizard-Eingaben | Browser-`confirm("Andock-Wizard schließen? Eingaben gehen verloren.")` ausgelöst (siehe `screenshots/2026-05-28_panel18_test8_close_confirm.jpg`); Klaus drückte „OK" → Modal sauber zu, `was_open: true`, `is_open_after: false`, `current_step: 0`, `dom_present: false` |
| 9 | `matchThreshold > 0.80` | `match_threshold: 0.8` (geclampt) |
| 10 | `externalHubUrl` als String | `external_hub_url: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/"` — Read-Anker, **kein** Hub-Fetch |

Alle Status-Lampen auf grün, alle Output-Blöcke matchen die `erwartung`-Felder aus dem Test-Code.

### 2. Bemerkenswerte Live-Befunde

- **Erster produktiver Cross-Knoten-Spore-Read aus Modul 18.** Test 6
  hat live über das Live-Netz gegen `https://lausiklauskn-png.github.io/Mein-Mixarium/sbkim/spore.json`
  gefetched. Modul 02 `SbkimSpore.verifyForeignSpore` hat die Ed25519-
  Signatur der Mixarium-Spore verifiziert. Der Foreign-Spore-Preview
  hat alle Pflicht-Felder lesbar gerendert.
- **`confirm()`-Bestätigungs-Dialog spec-konform.** Test 8 hat den
  nativen Browser-`confirm` ausgelöst, weil das Modal in Schritt 2
  offen war (`hasUnsubmittedInput` liefert `true` für Schritt 2/3 —
  Spec § Sub (a) close()).
- **Stepper-Animation sichtbar.** Schritt-1-Punkt cyan/grün als „done"
  nach Übergang zu Schritt 2, Schritt-2-Punkt gold als „active".
- **Modal-Optik passt.** Backdrop blendet alles dahinter sauber aus,
  Modal-Panel mit dunklem Hintergrund + goldenem Akzent, Buttons
  „← URL ändern" (ghost) + „Weiter zum Match-Check →" (primary gold).

### 3. Screenshots im Repo

```
docs/sessions/archiv/screenshots/
├── 2026-05-28_panel18_test5_modal_schritt1.jpg
├── 2026-05-28_panel18_test6_spore_geladen.jpg
└── 2026-05-28_panel18_test8_close_confirm.jpg
```

### 4. Doku-Pflege

- **`docs/components/18_tool_pwa.md` § Bauzustand:** neue Zeile
  „Sichttest grün — 2026-05-28 — Sichttest-Nachzug Bau 18 Sub (a)
  Vorab" am Listen-Ende. Volle Bestätigung der zehn Test-Knöpfe +
  Live-Spore-Fetch-Befund + Screenshot-Pfade + Pipeline-5h.1-Abschluss.
- **`docs/INTERFACES.md` § 1 Modul 18 Geprüft-Zeile:** dritte Datums-
  Zeile für Sichttest-Nachzug mit Live-Belegung.
- **`docs/PULS.md`:** neuer Sitzungs-Eintrag oben (kompakt, vor dem
  Bau-Sitzungs-Eintrag).

---

## Pflicht-Disziplin eingehalten

- ✓ KEIN Code-Eingriff (Doku-Pflege only).
- ✓ KEIN `status.json`-Score-Wechsel. Modul 18 bleibt `score:"stub"`.
  Konvention analog Modul 17: nach Bau + Sichttest grün bleibt `stub`,
  weil nur Sub (a) Vorab implementiert ist; Voll-Bau 18 Pipeline 5h.2
  entscheidet später, ob `score:"fertig"`.
- ✓ KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.
- ✓ KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag (Doku-Pflege, kein Sicherheits-
  Modul-Update).
- ✓ KEINE Tafel-Umsortierung CLAUDE.md.
- ✓ KEIN Endknoten-Eingriff (Re-Migration MR + MM ist eigene Folge-
  Sitzung pro Endknoten-Repo).

---

## Pipeline-Stand

**Phase A Schritt 5h.1 — Bau Modul 18 Sub (a) Vorab — abgeschlossen.**

Reihenfolge:

- ✓ Spec-Sitzung 18 Sub (a) Vorab (PR #190, gemergt 2026-05-28).
- ✓ Bau-Sitzung 18 Sub (a) Vorab (PR #193, gemergt 2026-05-28).
- ✓ Sichttest grün 10/10 (diese Sitzung, 2026-05-28).
- ⏳ Endknoten-Re-Migration **MR** (`lausiklauskn-png/Mein-Rezeptbuch`,
  externes Repo). Brief in der Bau-Sitzungs-Antwort 2026-05-28.
- ⏳ Endknoten-Re-Migration **MM** (`lausiklauskn-png/Mein-Mixarium`,
  externes Repo). Brief in der Bau-Sitzungs-Antwort 2026-05-28.

---

## Nächster sinnvoller Schritt

**Endknoten-Re-Migration MR + MM** als zwei eigene Sitzungen in den
externen Endknoten-Repos starten. Sie kopieren `src/modules/18_tool_pwa.js`
1:1 ins jeweilige `sbkim/`-Verzeichnis und ergänzen den `sbkim-init.js`
um `await SbkimToolPwa.init({…})` nach `SbkimSiegel.init`.

Klaus' Bronze-SIEGEL-Klick wird dann in den Endknoten-PWAs den Andock-
Wizard direkt aufmachen (statt der bisherigen „Modul 18 noch nicht
verfügbar"-Fallback-Notiz aus PR #180).

---

## Querverweise

- Bau-Sitzung Übergabe: `docs/sessions/archiv/2026-05-28_bau-18-sub-a-vorab.md`.
- Spec-Sitzung Übergabe: `docs/sessions/archiv/2026-05-28_spec-18-sub-a-vorab.md`.
- Karte 18: `docs/components/18_tool_pwa.md` § Bauzustand-Zeile
  „Sichttest grün 2026-05-28".
- INTERFACES § 1 Modul 18: dritte Geprüft-Zeile mit 2026-05-28-
  Sichttest-Block.
- Screenshots: `docs/sessions/archiv/screenshots/2026-05-28_panel18_*.jpg`.
