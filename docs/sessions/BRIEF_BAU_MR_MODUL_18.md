# Brief — Mein-Rezeptbuch · Modul-18-Einbau (Sub a Vorab)

**Sitzungs-Rolle:** Bau-Sitzung im externen Repo
`lausiklauskn-png/Mein-Rezeptbuch`. Pipeline-Phase A Schritt
**5h.1-Folge** (Modul-18-Einbau nach Bau Sub (a) Vorab in Sage-PR
#193 + Sichttest-Nachzug PR #194).

**Nicht zu verwechseln** mit der **Re-Aktivierung MR PR #249**
(2026-05-26, Pipeline Schritt 5e) — die hat Modul 15+16+17 + sbkim-
sw.js eingespielt. Modul 18 fehlt seitdem; dieser Brief füllt diese
Lücke mit einem Mini-Eingriff (1 neue Datei + 2 Andocker-Zeilen).

**Auslöser:** Modul 16 Sub (e) Bronze-Modal-`[Andocken]`-Knopf (Sage
PR #180) zeigt aktuell in MR den Fallback-Text „Modul 18 noch nicht
verfügbar". Sobald Modul 18 im MR-Repo da ist, schaltet der Klick
produktiv auf den Andock-Wizard (Klaus' Sichttest 2026-05-28 hat
den Wizard im Sage-Page-Panel 18 live bestätigt — Foreign-Spore-
Read gegen MM-Spore erfolgreich).

---

## Pflicht-Verifikations-Schritt (vor dem Code-Schreiben)

1. `git fetch origin && git checkout main && git pull origin main`
   im `Mein-Rezeptbuch`-Repo.
2. Prüfe, dass Modul 15/16/17 + `sbkim-sw.js` schon da sind
   (PR #249 vom 2026-05-26, plus `badgeSelector`-Fix-PR):
   ```bash
   ls sbkim/15_membran.js sbkim/16_siegel.js sbkim/17_floating_widget.js sbkim/sbkim-sw.js
   ```
   Alle vier müssen existieren. Wenn nicht: falsche Branch, abbrechen.
3. **Sage-Repo** Sub-(a)-Vorab-Stand lesen (read-only):
   - `src/modules/18_tool_pwa.js` (~1448 Zeilen) — diese Datei wird
     1:1 ins MR-Repo kopiert.
   - `docs/components/18_tool_pwa.md` § Sub (a) Andocken — für
     Verständnis der Surface.
   - `docs/INTERFACES.md` § 1 Modul 18 — Pflicht-Init-Felder
     (`endpoint` + `domain` + `domainKeywords`).

---

## Pflicht-Disziplin (verbindlich)

- **KEIN Eingriff in den Modul-Code** (`sbkim/18_tool_pwa.js` ist 1:1
  Kopie aus Sage-Repo `main`).
- **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.** Modul 18 Sub (a) Vorab ist RAM-only Render-Schicht.
- **KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag** (Modul 18 ist Wartungs-/
  Andock-Schicht, kein Sicherheits-Modul).
- **KEIN Eingriff in Module 15/16/17/Storage**. Die existierende
  Andocker-Reihenfolge `SbkimWidget.init` → `SbkimMembrane.init` →
  `SbkimSiegel.init` bleibt; Modul 18 kommt **NACH** `SbkimSiegel.init`.
- **KEIN automatischer Andock-Trigger** aus dem MR-Andocker. Modul
  18 ist nur **geladen + bereit**, wird **nicht von selbst geöffnet**.

---

## Deine Aufgabe — drei Eingriffe

### Eingriff 1 — `sbkim/18_tool_pwa.js` kopieren

Datei aus Sage-Repo `main`:

```
https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/src/modules/18_tool_pwa.js
```

1:1 nach `sbkim/18_tool_pwa.js` im MR-Repo. **Inhalt NICHT
verändern**, auch nicht Selbstcheck-Zeile oder Konstanten. Modul
18 lebt im Endknoten genau wie im Sage-Repo.

### Eingriff 2 — `sbkim/sbkim-init.js` erweitern

Zwei Stellen pflegen:

#### Stelle A — `<script>`-Tag (HTML-Andocker)

Falls die Andocker-Datei ein HTML-Snippet ist (`<script src="…">`-
Liste): Modul 18 nach Modul 17 ergänzen, **vor** dem
`sbkim-init.js`-Aufruf, ungefähr so:

```html
<script src="sbkim/15_membran.js"></script>
<script src="sbkim/16_siegel.js"></script>
<script src="sbkim/17_floating_widget.js"></script>
<script src="sbkim/18_tool_pwa.js"></script>   <!-- NEU -->
<script src="sbkim/sbkim-init.js"></script>
```

Falls der Andocker rein JS-basiert ist (kein HTML-Skript-Tag), nur
Eingriff B nötig.

#### Stelle B — `SbkimToolPwa.init({…})`-Aufruf

NACH dem `await SbkimSiegel.init({…})`-Aufruf. Werte aus eigener
`sbkim/spore.json` lesen (MR-Spore enthält domain + endpoint +
domainKeywords + stammCategories + guestCategories):

```js
// ... bestehender Code ...
await SbkimWidget.init({ /* ... */ });
await SbkimMembrane.init({ /* ... */ });
await SbkimSiegel.init({
  badgeSelector: "#sbkim-siegel-badge",
  repoUrl: "https://github.com/lausiklauskn-png/Mein-Rezeptbuch",
});

// NEU: Modul 18 Tool-PWA Sub (a) Vorab
await SbkimToolPwa.init({
  endpoint:        "https://lausiklauskn-png.github.io/Mein-Rezeptbuch/",
  domain:          "rezeptbuch",
  domainKeywords:  ownSpore.domainKeywords || [],
  stammCategories: ownSpore.stammCategories || [],
  guestCategories: ownSpore.guestCategories || [],
  repoUrl:         "https://github.com/lausiklauskn-png/Mein-Rezeptbuch",
});
```

`ownSpore` ist die schon geladene Spore — falls noch nicht da im
Andocker, vorher lesen via `await fetch("sbkim/spore.json").then(r =>
r.json())`. Oder Werte direkt hartcodiert eintippen (Werte aus
`sbkim/spore.json` ablesen).

**`externalHubUrl` weglassen** für jetzt (Default `null`, Read-Anker
für spätere Multisuchfeld-Spec).

### Eingriff 3 — Hard-Reload + Sichttest

Klaus' Sichttest auf Tab nach Push:

1. **Hard-Reload** im Mein-Rezeptbuch-Tab (Cache leeren).
2. **Konsolen-Selbstcheck:** Eruda öffnen, suche
   ```
   MODUL 18 TOOL-PWA bereit, Sub (a) Vorab, Funktionen: init/openAndockTab/close/isOpen
   ```
3. **Bronze-SIEGEL-Klick:** im Floating-Widget auf den ★-Slot
   klicken → Modul 16 Bronze-Modal öffnet sich → `[Andocken]`-Knopf
   klicken → **Modul-18-Andock-Wizard öffnet sich** (statt Fallback-
   Text). Stepper-Schritt 1 sichtbar (URL-Eingabe leer).
4. **Optional Live-Cross-Knoten-Test:** URL
   `https://lausiklauskn-png.github.io/Mein-Mixarium/` eingeben →
   Weiter → Spore-Fetch sollte gegen MM live durchgehen.
5. Bei Erfolg: Sichttest grün, fertig.

---

## Pflicht am Sitzungsende

- `sbkim/18_tool_pwa.js` als neue Datei.
- `sbkim/sbkim-init.js` mit zwei Erweiterungen (Skript-Tag +
  `SbkimToolPwa.init`-Aufruf).
- Commit + Push auf `claude/mr-modul-18-einbau`.
- Draft-PR mit Test-Plan-Liste (drei Eingriff-Punkte + Sichttest-
  Schritte für Klaus).
- Übergabeprotokoll im MR-Repo unter `docs/sessions/archiv/` (falls
  das Repo diese Konvention hat — sonst PULS oder README).
- „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort:
  Klaus' Sichttest abwarten, dann PR mergen.

---

## Querverweise

- Sage-Repo Sub-(a)-Vorab-Stand: PR #190 (Spec, gemergt 2026-05-28)
  + PR #193 (Bau, gemergt 2026-05-28) + PR #194 (Sichttest-Nachzug).
- Sage-Karte Modul 18: `docs/components/18_tool_pwa.md` § Sub (a).
- Sage-INTERFACES § 1 Modul 18: Pflicht-Init-Felder + Surface-Vertrag.
- Vorgänger-Re-Aktivierung MR (Modul 15+16+17): MR PR #249 vom
  2026-05-26, plus `badgeSelector`-Fix-PR vom 2026-05-26.
- Live-Sichttest Sub (a) Vorab in Sage-Panel 18: Sichttest-Nachzug
  Übergabe `2026-05-28_sichttest-bau-18-sub-a-vorab.md`, drei
  Screenshots in `docs/sessions/archiv/screenshots/`.
