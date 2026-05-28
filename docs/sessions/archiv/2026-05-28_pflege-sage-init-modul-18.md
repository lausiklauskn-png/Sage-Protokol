# Übergabeprotokoll · 2026-05-28 · Pflege Sage-Init Modul 18 + Drei-Pfad-Verhalten Modul 16

**Branch:** `claude/pflege-sage-init-modul-18`
**Sitzungs-Rolle:** Pflege-Sitzung. Refinement von PR #197 +
Folge-Pflege zu Klaus' Sage-Page-Sichttest 2026-05-28 18:00.
**Auslöser:** Klaus' Sichttest am Sage-Page-Tab nach PR #197:
Bronze-Modal verschwand korrekt, **aber kein Modul-18-Andock-Wizard
erschien**. Erwartung: Bronze weg + Wizard zeigt URL-Eingabe.

---

## Wurzel-Diagnose

PR #197 schloss das Bronze-Modal **immer** nach `openAndockTab()`,
auch wenn der Aufruf eine Exception warf.

Sage-Page-Spezifikum:
- `index.html` lädt `src/modules/18_tool_pwa.js` (Skript-Tag da).
- `sbkim-init.js` ruft `SbkimSpore.init`, `SbkimMembrane.init`,
  `SbkimSiegel.init` auf, **aber NICHT `SbkimToolPwa.init`**.
  Ursprüngliches Brief-Tabu der Bau-Sitzung 18 Sub a Vorab.
- Konsequenz: `SbkimToolPwa._meta.ready === false`.
- Klick auf `[Andocken]` im Bronze-Modal → `openAndockTab()` wirft
  `ToolPwaNotReadyError` SYNC vor await.
- PR-#197-`closeModal()` fängt das in `try/catch` und schließt
  das Modal. Aber Wizard öffnet nie.

Klaus' Klärung im Chat 2026-05-28: „Weil die Sage Page ist selber
auch eine ein Endknoten. Also müsste das dann auch funktionieren."
Spore-JSON bestätigt: Sage hat `nodeType:"hybrid"`. Das Brief-Tabu
ist überschrieben durch Klaus' aktuelle Festlegung
(CLAUDE.md § Tafel-Evolutions-Klausel).

---

## Was getan

### Eingriff A — `sbkim-init.js`

Nach `SbkimSiegel.init` ein `SbkimToolPwa.init({…})`-Block ergänzt
mit Werten aus eigener `sbkim/spore.json`:

- `endpoint: "https://lausiklauskn-png.github.io/Sage-Protokol/"`
- `domain: "Mycel-Bibliothek"`
- `domainKeywords: ["SBKIM-Glossar", "Mycel-Vokabular",
  "Protokoll-Doku", "Heilige Tafeln", "Karten",
  "Schwesternetz-Beobachtungen"]`
- `stammCategories` + `guestCategories` ebenfalls aus Spore
- `repoUrl: "https://github.com/lausiklauskn-png/Sage-Protokol"`
- `externalHubUrl` weggelassen (Default `null`).

Fail-soft-Eingriff: `initModule()`-Wrapper aus `sbkim-init.js` fängt
Wurf des `init()`-Aufrufs ab und gibt nur `console.warn`.

### Eingriff B — `src/modules/16_siegel.js` Drei-Pfad-Logik

`andockBtn`-Click-Handler von zwei Pfaden auf drei Pfade erweitert.
PR-#197-Verhalten war: closeModal() **immer**. Neues Verhalten:

| Pfad | Bedingung | Verhalten |
|---|---|---|
| 1 | `openAndockTab()` wirft nicht | Wizard öffnet, Bronze-Modal schließt sich (analog PR #197 grünes Verhalten). |
| 2 | `openAndockTab()` wirft `ToolPwaNotReadyError` | Bronze-Modal bleibt offen, Info-Hinweis „Modul 18 ist geladen, aber im Andocker nicht initialisiert" wird im Hinweis-Block eingeblendet. |
| 3 | `SbkimToolPwa` fehlt komplett | Bestehende Fallback-Info-Notiz `BRONZE_HINWEIS_HTML_FALLBACK`. |

Pfad 2 ist neu — gibt dem User direktes Feedback bei
Konfigurations-Lücken (statt „Modal verschwindet ohne Reaktion").

### Eingriff C — Karte 16 § Sub (e) Klick-Verhalten

Block „Bronze-Modal schließt sich beim erfolgreichen Andock-Pfad…"
durch volles Drei-Pfad-Verhalten-Block ersetzt mit Begründung +
Pflege-Querverweis.

---

## Tests

- `node --check src/modules/16_siegel.js` ✓
- `node --check sbkim-init.js` ✓
- `tests/smoke_bau16_sub_e_bronze.mjs` **16/16 grün** (keine neuen
  Proben — der Drei-Pfad ist UX-Verhalten, die existierenden Proben
  prüfen Stufenwechsel + Aspekt-4-Render unverändert).

---

## Pflicht-Disziplin eingehalten

- ✓ KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.
- ✓ KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag.
- ✓ KEIN Eingriff in Modul 15/17/18/Storage.
- ✓ KEIN Eingriff in das Modul-18-Surface (nur Aufruf-Hinzufügung
  im Sage-Andocker).
- ✓ KEINE Tafel-Umsortierung CLAUDE.md.
- ✓ Tafel-Evolution: Sage-Page-`SbkimToolPwa.init()`-Tabu aus
  Bau-Sitzung-18-Brief explizit überschrieben mit Klaus' Klärung
  („Sage ist selber Endknoten"), Hintergrund in Karte 16 verankert.

---

## Was offen blieb

1. **Klaus' Sichttest auf Sage-Page** — nach Hard-Reload sollte
   der Bronze-`[Andocken]`-Klick BEIDES auslösen: Bronze-Modal weg
   + Modul-18-Andock-Wizard erscheint (Stepper-Schritt 1).
2. **MR-Sync** — neue `16_siegel.js` in MR-Repo kopieren (eigene
   Sync-Sitzung). Da MR Modul 18 schon initialisiert (PR #252),
   greift dort Pfad 1 sauber.
3. **MM-Combined-Sync** — Modul 18 NEU einbauen + Modul 16
   überschreiben (analog MR, eigene Sitzung).

---

## Querverweise

- Vorgänger: PR #197 (closeModal-Always-Fix, nicht ausreichend).
- Bau Modul 18 Sub (a) Vorab: PR #193 (Brief-Tafel verbot
  Sage-init, jetzt überschrieben).
- Klaus' Sichttest-Screenshots 2026-05-28 17:51 + 18:00 (Sage +
  MR-Tab nebeneinander).
- Klaus' Chat-Klärung „Sage ist selber ein Endknoten".
