# EINBAU.md — SB-KIMTool-Point Erst-Iteration

Anleitung für Klaus' (oder einen Maintainer's) erste Bau-Sitzung im
externen Repo [`lausiklauskn-png/SB-KIMTool-Point`](https://github.com/lausiklauskn-png/SB-KIMTool-Point).

**Diese Vorlage liegt in Sage-Protokol unter
`docs/components/_sb_kim_tool_point_template/`. Sie wird in einer
eigenen Sitzung im SB-KIMTool-Point-Repo eingesetzt — NICHT in
Sage-Protokol selbst.**

## Voraussetzungen

- Hub-Repo `lausiklauskn-png/SB-KIMTool-Point` ist angelegt
  (public, leer). ✓ erledigt 2026-05-26.
- Klaus hat Schreibrechte am Hub-Repo. ✓ (eigener Account).
- Modul 19 Andock-Wizard ist gebaut (Pipeline-Phase B Schritt 7) —
  **andernfalls** wird die Andock-Sektion in `index.html` als
  „noch nicht gebaut"-Placeholder gerendert.

## Schritte

### 1. Vorlage ins Hub-Repo kopieren

Diese fünf Dateien aus Sage-Protokol
`docs/components/_sb_kim_tool_point_template/` ins Hub-Repo Root
kopieren:

```
index.html
status.json
README.md
EINBAU.md            ← optional (Anleitung wandert mit)
sbkim/spore.json
```

### 2. Module aus Sage-Protokol übernehmen

Aus `src/modules/` ins Hub-Repo-Verzeichnis `modules/`:

```
src/modules/02_spore.js          → modules/02_spore.js
src/modules/17_floating_widget.js → modules/17_floating_widget.js
```

Sobald Modul 19 gebaut ist:

```
src/modules/19_andock_wizard.js  → modules/19_andock_wizard.js
```

Optional für Cross-Knoten-Such-Tests (Phase C):

```
src/modules/01_storage.js
src/modules/03_embedding.js
src/modules/04_match.js
src/modules/05_anastomose.js
src/modules/16_siegel.js
```

### 3. `index.html` aktivieren

In `index.html` die zwei auskommentierten `<script>`-Tags
einkommentieren:

```html
<script src="modules/17_floating_widget.js"></script>
<script src="modules/19_andock_wizard.js"></script>
```

(Modul 19 erst nach Bau-Phase B einkommentieren.)

### 4. Hub-Spore initial erzeugen (optional)

Wenn der Hub selbst als SBKIM-Knoten am Mycel teilnehmen soll
(Floating-Widget zeigt LEBT-Lampe), einmaliger Boot-Schritt:

```js
// In Browser-Konsole, beim ersten Laden:
await SbkimStorage.init({ dbSuffix: "hub" });
await SbkimSpore.init();
const spore = await SbkimSpore.generateOwnSpore({
  domain: "Mycel-Hub",
  nodeType: "hybrid",
  endpoint: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",
  nodeName: "SB-KIMTool-Point (Hub)",
  domainDescription: "Externer SBKIM-Mycel-Hub — Forker-Observatorium light.",
  domainKeywords: ["SBKIM", "Mycel", "Forker-Hub", "Observatorium", "Andocken", "Spore", "Endknoten"],
});
console.log(JSON.stringify(spore, null, 2));
// → Inhalt nach sbkim/spore.json kopieren + committen.
```

### 5. GitHub-Pages aktivieren

Repo-Settings → Pages → Source: `main` Branch, `/` (root).
URL: `https://lausiklauskn-png.github.io/SB-KIMTool-Point/`

### 6. Initial-Commit

```sh
git add index.html status.json README.md sbkim/ modules/
git commit -m "SB-KIMTool-Point initial — Hub-Landing-Page + Hub-Spore + Modul 02/17"
git push -u origin main
```

### 7. Verifikation

1. Öffne die Hub-URL im Browser.
2. „Andocken"-Sektion zeigt entweder den Wizard (wenn Modul 19 da)
   oder den Placeholder.
3. „Angedockte Endknoten"-Sektion zeigt „noch keine Forker
   registriert".
4. Footer verweist auf Sage-Protokol als Spec-Quelle.
5. Wenn Modul 17 eingebunden ist: Floating-Widget mountet
   unten rechts.

## Was diese Erst-Iteration NICHT macht

- **Keine Spec-Spiegelung** aus Sage-Protokol (keine Karten, keine
  INTERFACES.md).
- **Keine Anti-Spam-Module** (Modul 10/11/12 — folgen mit
  wachsendem Forker-Netz).
- **Keine Cross-Knoten-Such-Tests** automatisch (Phase C).
- **Keine Klaus-Endknoten** im Default in der Hub-`status.json`.

## Folge-Schritte

- **Pepo Semantic Match Demo andocken** (Phase C Schritt 10).
- **Muttis Rezeptbuch andocken** (Phase C Schritt 11).
- **Cross-Knoten-Such-Test** über mehrere Origins (Phase C
  Schritt 12).

Siehe `CLAUDE.md` § Pipeline-Reihenfolge Phase C im Sage-Protokol-Repo.
