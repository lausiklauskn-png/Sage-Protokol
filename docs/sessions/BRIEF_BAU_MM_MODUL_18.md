# Brief — Mein-Mixarium · Modul-18-Einbau (Sub a Vorab)

**Sitzungs-Rolle:** Bau-Sitzung im externen Repo
`lausiklauskn-png/Mein-Mixarium`. Pipeline-Phase A Schritt
**5h.1-Folge** (Modul-18-Einbau nach Bau Sub (a) Vorab in Sage-PR
#193 + Sichttest-Nachzug PR #194). Identisch zu Mein-Rezeptbuch-
Brief (`BRIEF_BAU_MR_MODUL_18.md`), nur Werte unterscheiden sich.

**Nicht zu verwechseln** mit der **Re-Aktivierung MM PR #58**
(2026-05-26, Pipeline Schritt 5e) — die hat Modul 15+16+17 + sbkim-
sw.js eingespielt. Modul 18 fehlt seitdem; dieser Brief füllt diese
Lücke mit einem Mini-Eingriff (1 neue Datei + 2 Andocker-Zeilen).

**Auslöser:** Modul 16 Sub (e) Bronze-Modal-`[Andocken]`-Knopf (Sage
PR #180) zeigt aktuell in MM den Fallback-Text „Modul 18 noch nicht
verfügbar". Sobald Modul 18 im MM-Repo da ist, schaltet der Klick
produktiv auf den Andock-Wizard.

---

## Pflicht-Verifikations-Schritt (vor dem Code-Schreiben)

1. `git fetch origin && git checkout main && git pull origin main`
   im `Mein-Mixarium`-Repo.
2. Prüfe, dass Modul 15/16/17 + `sbkim-sw.js` schon da sind
   (PR #58 vom 2026-05-26, plus `badgeSelector`-Fix-PR):
   ```bash
   ls sbkim/15_membran.js sbkim/16_siegel.js sbkim/17_floating_widget.js sbkim/sbkim-sw.js
   ```
   Alle vier müssen existieren. Wenn nicht: falsche Branch, abbrechen.
3. **Sage-Repo** Sub-(a)-Vorab-Stand lesen (read-only):
   - `src/modules/18_tool_pwa.js` (~1448 Zeilen) — wird 1:1 ins
     MM-Repo kopiert.
   - `docs/components/18_tool_pwa.md` § Sub (a) Andocken.
   - `docs/INTERFACES.md` § 1 Modul 18 — Pflicht-Init-Felder
     (`endpoint` + `domain` + `domainKeywords`).

---

## Pflicht-Disziplin (verbindlich)

- **KEIN Eingriff in den Modul-Code** (`sbkim/18_tool_pwa.js` ist 1:1
  Kopie aus Sage-Repo `main`).
- **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag.**
- **KEIN Eingriff in Module 15/16/17/Storage.** Andocker-Reihenfolge
  bleibt: `SbkimWidget.init` → `SbkimMembrane.init` →
  `SbkimSiegel.init` → **Modul 18 NEU danach**.
- **KEIN automatischer Andock-Trigger.**

---

## Deine Aufgabe — drei Eingriffe

### Eingriff 1 — `sbkim/18_tool_pwa.js` kopieren

Datei aus Sage-Repo `main`:

```
https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/src/modules/18_tool_pwa.js
```

1:1 nach `sbkim/18_tool_pwa.js` im MM-Repo. **Inhalt NICHT
verändern**.

### Eingriff 2 — `sbkim/sbkim-init.js` erweitern

#### Stelle A — `<script>`-Tag

Falls HTML-Skript-Tag-Andocker:

```html
<script src="sbkim/15_membran.js"></script>
<script src="sbkim/16_siegel.js"></script>
<script src="sbkim/17_floating_widget.js"></script>
<script src="sbkim/18_tool_pwa.js"></script>   <!-- NEU -->
<script src="sbkim/sbkim-init.js"></script>
```

#### Stelle B — `SbkimToolPwa.init({…})`-Aufruf

NACH `await SbkimSiegel.init({…})`. Werte aus eigener
`sbkim/spore.json` (Cocktail-Domain):

```js
await SbkimWidget.init({ /* ... */ });
await SbkimMembrane.init({ /* ... */ });
await SbkimSiegel.init({
  badgeSelector: "#sbkim-siegel-badge",
  repoUrl: "https://github.com/lausiklauskn-png/Mein-Mixarium",
});

// NEU: Modul 18 Tool-PWA Sub (a) Vorab
await SbkimToolPwa.init({
  endpoint:        "https://lausiklauskn-png.github.io/Mein-Mixarium/",
  domain:          "mixarium",
  domainKeywords:  ownSpore.domainKeywords || [],
  stammCategories: ownSpore.stammCategories || [],
  guestCategories: ownSpore.guestCategories || [],
  repoUrl:         "https://github.com/lausiklauskn-png/Mein-Mixarium",
});
```

`ownSpore` ist die schon geladene Spore — sonst vorher fetchen.

**`externalHubUrl` weglassen** für jetzt.

### Eingriff 3 — Hard-Reload + Sichttest

1. Hard-Reload im Mein-Mixarium-Tab.
2. Eruda → Konsole → Selbstcheck-Zeile
   `MODUL 18 TOOL-PWA bereit, Sub (a) Vorab, …` muss da sein.
3. Bronze-SIEGEL-Klick → Modul-16-Bronze-Modal → `[Andocken]`-Knopf
   klicken → **Modul-18-Andock-Wizard öffnet sich** (statt Fallback-
   Text). Stepper-Schritt 1 sichtbar.
4. Optional Live-Cross-Knoten-Test: URL
   `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/` eingeben →
   Weiter → Spore-Fetch gegen MR.
5. Bei Erfolg: Sichttest grün.

---

## Pflicht am Sitzungsende

- `sbkim/18_tool_pwa.js` als neue Datei.
- `sbkim/sbkim-init.js` mit zwei Erweiterungen.
- Commit + Push auf `claude/mm-modul-18-einbau`.
- Draft-PR mit Test-Plan.
- Übergabeprotokoll im MM-Repo.

---

## Querverweise

- Sage-Repo Sub-(a)-Vorab-Stand: PR #190 + PR #193 + PR #194.
- Sage-Karte Modul 18: `docs/components/18_tool_pwa.md` § Sub (a).
- Vorgänger-Re-Aktivierung MM (Modul 15+16+17): MM PR #58 vom
  2026-05-26.
- Live-Sichttest Sub (a) Vorab in Sage-Panel 18: drei Screenshots
  in Sage `docs/sessions/archiv/screenshots/`. **Test 6 hat live
  gegen MM-Spore gefetched** — Foreign-Spore-Preview mit Mixarium-
  Domain, Knoten-ID `B7Fke9CYTR1BrC3x…`, sieben Domain-Stichworte
  voll gerendert.
