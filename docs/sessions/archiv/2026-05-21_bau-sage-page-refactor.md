# Übergabeprotokoll — Bau-Sitzung Sage-Page-Refactor

**Datum:** 2026-05-21
**Sitzungs-Rolle:** Bau-Sitzung (kein Spec — Brief 01 V1-Sage-Hybrid
hat INTERFACES § 6 / § 6.1 / § 6.2 spezifiziert; Brief 99 Sammelspec-
Abschluss hat die Bau-Pipeline benannt). KEIN Modul-Code-Eingriff in
`src/modules/*.js`. KEIN Spec-Eingriff.
**Branch:** `claude/bau-sage-page-refactor`. Brief PR #125 (`bf391bb`)
als Vorlage. Erste Bau-Sitzung der Brief-99-Pipeline.

**Voraussetzungen:** V1-Sammelspec-Kaskade Brief 01–04 + 99 gemerged
(PR #96 / #97 / #98 / #99 / #100). Bau 01.Y (PR #102), Bau 02.Y
(PR #104), Pflege 01-init-fail-soft (PR #107/#108), Bau 04.A (PR #110),
Bau 04.B (PR #122), Bau 05.Y / 06.Y / 07.Y / 08.Y alle gemerged. Brief
BAU_SAGE_PAGE_REFACTOR PR #125 gemerged.

---

## Kern (drei Sätze)

Die Sage-Page lädt jetzt selbst alle SBKIM-Module mit fail-soft init()-
Kette unter dem IndexedDB-Suffix `sbkim_sage`, hat einen eigenen
Standalone-`sbkim-sw.js` im Repo-Root (Variante 3a aus Karte 09
§ Schritt 3), und der Klick auf die Schwarz-Loch-Karte öffnet beim
ersten Mal einen Mini-Andock-Wizard (Identität → Spore mit lazy-Modul-
03-Embedding → Backup). Die Module-Bento-Karte zeigt pro Modul drei
kleine Schichten-Lampen (Spec / Code / Sichttest) gefärbt aus
`status.json § modules[i].score`. **KEIN Modul-Code-Eingriff, KEIN
Spec-Eingriff, KEIN Schema-Bump** — der gesamte Refactor lebt in
`index.html`, drei neuen Dateien (`sbkim-sw.js`, `sbkim-init.js`,
`sbkim/spore.json`) und einer kleinen `status.json`-Pflege.

---

## Sechs Punkte a–f

### a) `sbkim-sw.js` im Sage-Page-Repo-Root

Wortgleiche Kopie von `src/sbkim-sw.js`, Header-Kommentar um Sage-
spezifischen Block ergänzt (kennzeichnet die Kopie + Cache-Bust-Hinweis
für Pflege-Sitzungen, die `src/sbkim-sw.js` ändern). Variante 3a aus
Karte 09, weil Sage-Page keinen App-SW betreibt. `SBKIM_SW_STANDALONE`
bleibt Default `true` — `skipWaiting` / `clients.claim` greifen.

### b) Neun `<script>`-Tags in `index.html`

Vor `</body>`, Reihenfolge `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08`,
dann `sbkim-init.js`. Modul 03 (Embedding, ~30 MB) lädt das Modell
**lazy** — `init()` läuft erst im Andock-Wizard (Schritt 2 vor dem
ersten `embedPassage`-Aufruf). Sage-Page bleibt für reinen Doku-Hub-
Besuch leicht.

### c) Neue Datei `sbkim-init.js` im Repo-Root

Closure-IIFE mit DOM-Ready-Trigger. Ruft sequenziell:

1. `SbkimStorage.init({dbSuffix: "sage"})` — Pflicht-Erstes.
2. `SbkimSpore.init()` — KEIN `getOrCreateIdentity` hier; der Andock-
   Wizard ruft das explizit auf Klaus' Klick (Erst-Andocken sichtbar).
3. **Modul 03 NICHT init()** — lazy.
4. `SbkimAnastomose.init()` — SW-Message-Listener + BroadcastChannel-
   Bridge.
5. `SbkimHeterokaryose.init()`.
6. `SbkimApoptose.init()` — Vermächtnis-Empfang.
7. `SbkimUiDemo.init()` — Outbox-Pflege.
8. `SbkimDoku.init({searchIconSelector: "#sage-search-icon"})` — Sage-
   Page hat kein klassisches PWA-Such-Symbol; Modul 00 läuft fail-soft
   weiter, der Andock-Wizard ist die Sage-spezifische Mini-Geste.
9. `navigator.serviceWorker.register("sbkim-sw.js")`.

**Fail-soft pro Modul** mit `console.warn`. Ein fehlschlagender Modul-
`init()` bricht die Kette NICHT — Sage-Page bleibt als Doku-Hub
ladbar. Custom-Event `sbkim-sage-ready` dispatcht am Ende für Folge-
UI-Hooks (Andock-Wizard-Identitäts-Wechsler-Refresh).

### d) `sbkim/spore.json` als statisches Skeleton

`id` / `publicKey` / `domainVector` / `signature` / `createdAt`
**null** als Slot bis zur ersten Browser-Sichttest-Andockung. Alle
Meta-Felder befüllt aus INTERFACES § 6 Tabellen:

- `domain: "Mycel-Bibliothek"`
- `domainDescription: "Lebendiges SBKIM-Vokabular und Protokoll-Doku:
  Glossar, INTERFACES, ARCHITEKTUR, Karten 00-15, PULS — die Karte,
  die sich selbst kennt."`
- `domainKeywords`, `stammCategories`, `guestCategories` aus
  INTERFACES § 6
- `endpoint: "https://lausiklauskn-png.github.io/Sage-Protokol/"`
- `nodeType: "hybrid"`, `protocolVersion: "0.1"`,
  `embeddingModel: "Xenova/multilingual-e5-small"`

Vollständige signierte Spore kommt nach Klaus' Andock-Wizard-Lauf als
Download (`spore.json` via Blob + `<a download>`). Klaus committet
die finale Spore danach manuell hierhin. **Origin-Limitierung
(Stolperfalle 3 Brief):** Sage-Page kann nicht zur Laufzeit in das
eigene Repo schreiben.

### e) Andock-Wizard im Schwarz-Loch-Karten-Klick

Modal-Dialog (`#sage-andock-modal`), Style analog zum Universe-/Station-
Modal (Backdrop + zentrierter Card mit Backdrop-Blur). Klick-Handler:

```js
async function bhStageClick(event) {
  if (event) event.preventDefault();
  try {
    const hasIdentity = await sageHasIdentity(); // listIdentities().length > 0
    if (!__sageAndockOpenedOnce && !hasIdentity) {
      __sageAndockOpenedOnce = true;
      openAndockWizard();
      return false;
    }
  } catch (_e) { /* fail-soft */ }
  goScreen('observatorium', 'blackhole');
  return false;
}
```

Erst-Klick öffnet den Wizard, falls keine Identität existiert. Folge-
Klicks (oder Klicks bei bestehender Identität) öffnen wie zuvor den
Browser-Observatorium-Screen. Beide Pfade koexistieren (Stolperfalle 4
Brief).

**Drei Wizard-Schritte:**

1. **Identität erzeugen** via `SbkimSpore.getOrCreateIdentity()` —
   nodeId sichtbar im Output.
2. **Spore mit Domain-Vektor erzeugen** —
   `SbkimEmbedding.init()` (lazy, ~30 MB lädt jetzt), dann
   `embedPassage(domainDescription + ". " + domainKeywords.join(", "))`,
   dann `generateOwnSpore({domain, endpoint, nodeType, nodeName,
   domainDescription, domainKeywords, domainVector, stammCategories,
   guestCategories})`, dann Download als `spore.json`.
3. **Backup machen** via `SbkimSpore.exportBackup(window.prompt(...))`
   → Download als `sage-backup-<ts>.sbkim.json`.

**Plus Identitäts-Wechsler** als Dropdown unten —
`SbkimSpore.listIdentities()` + `SbkimSpore.setActiveIdentity(key)`.
Klein und versteckt; Sage hat in der Regel nur eine Identität (Brief
§ Identitäts-Wechsler-UX).

**Variante III-Standalone-Andock-Wizard (Vision-Anker 2)** bleibt
explizit eigene Spec-Sitzung; Wizard-Footer verweist auf
[Karte 09](../../components/09_einbau_pwa.md) für den vollen
Andock-Pfad.

### f) Schichten-Lampen an Modul-Bento-Karte

Drei kleine LED-Dots pro `.mod-row` (Spec / Code / Sichttest), Farbe
aus `status.json § modules[i].score`:

- `schablone` → braun
- `werkstatt` → orange
- `spec` → gelb (Spec-Lampe an)
- `stub` → blau (Spec + Code an)
- `fertig` → grün (alle drei an)

Tooltip-Title zeigt `siegel`-Feld. **CSS-only Style + Vanilla-JS Hook
über MutationObserver auf `#module-list`** (kein Eingriff in die
bestehende `renderModuleList`-Closure — `STATE` / `renderModuleList`
sind im Haupt-Script-Block nicht über `window` erreichbar; eigener
`fetch('status.json')` parallel zum Haupt-loadStatus). Mobile-Layout
(≤540 px) blendet die Lampen aus.

---

## Heilige Tafeln eingehalten

- **KEIN Modul-Code-Eingriff.** `src/modules/*.js` und
  `src/sbkim-sw.js` unangetastet. Sage-Page-Root-`sbkim-sw.js` ist
  additive Kopie (kein Symlink, kein Build-Schritt — Single-File-PWA-
  Konvention).
- **IndexedDB-Suffix `sbkim_sage`** in `sbkim-init.js`
  (`SbkimStorage.init({dbSuffix: "sage"})`) — analog
  `sbkim_rezeptbuch`/`sbkim_mixarium`, keine Origin-Kollision wenn
  parallel installiert.
- **App-SW Variante 3a.** Standalone `sbkim-sw.js` im Sage-Page-Root.
- **Domäne „Mycel-Bibliothek"** aus INTERFACES § 6. `domainVector`
  als statische Spore-JSON-Slot bis Klaus' Browser-Sichttest.
- **Andock-Geste an der Schwarz-Loch-Karte** — Karte visuell
  unverändert (CSS unangetastet); nur Klick-Handler ersetzt.
- **Identitäts-Wechsler-UX** klein im Wizard-Footer.
- **Schichten-Lampen** rein visuelle Erweiterung; keine eigene
  Schicht-Logik, nur Lesen aus `status.json`.
- **`PROTOCOL_VERSION` / `DB_VERSION` / `BACKUP_FORMAT_VERSION`
  unverändert** (`"0.1"` / `4` / `2`).

## Was NICHT angefasst

- **`src/modules/*.js`** (Modul-Code).
- **`src/sbkim-sw.js`** (SW-Quelle).
- **INTERFACES.md** (Spec).
- **Endknoten-Migration** von Mein-Rezeptbuch / Mein-Mixarium (eigene
  Bau-Sitzung aus Brief Pipeline PR #123).

## Zwei UI-Texte korrigiert (Reflektion der V1-Spec)

- „Hub · kein Endknoten" → „Hub · und Knoten zugleich".
- „Sage ist kein Endknoten — nur Vermittlungsstelle." → „Sage selbst
  ist seit V1-Sage-Hybrid (Brief 01) der dritte Knoten, neben
  Rezeptbuch und Mixarium. Hub und Knoten zugleich."

Beide Korrekturen sind Reflektion der **bereits verbindlichen**
INTERFACES § 6 Tafel — keine neue Spec, nur Konsistenz.

## `status.json` § endknoten[sage] gepflegt

- `integratedAt: "2026-05-21"` (Bau-Datum, Sichttest steht aus).
- `pingStatus: "pending-first-sichttest"` (neuer Zwischen-Zustand
  zwischen `pending-first-andock` und `live` — signalisiert „Bau
  fertig, wartet auf Klaus' Browser-Lauf").
- `nodeId: null` bleibt bis zum ersten Sichttest.
- `lastUpdated: "2026-05-21"`.
- Pie-Block via `scripts/update_puls_pie.py` regeneriert (Modulstand
  unverändert: 5/0/0/7/3 — Sage-Eintrag ist Endknoten-Pflege).

## Karte 09 § Bauzustand-Tabelle

Neue Zeile „Sage als dritter Endknoten bau-fertig (Sichttest
ungeprüft)" mit voller Sechs-Punkte-a–f-Abdeckung.

## Ältester Sitzungs-Eintrag ins Archiv-Index ausgelagert

Bau 04.A `matchDimensions` (104 Zeilen) + Königin-Relay-Vision-Anker
(64 Zeilen) wandern als kompakte Tabellenzeilen in den Archiv-Index.
PULS-Zeilenzahl 2987 — unter 3000-Schutz-Klausel.

---

## Manueller Sichttest

**Ungeprüft, wartet auf Klaus' Browser-Lauf** (Stolperfalle 6 Brief —
Sichttest braucht Klaus, nicht headless). Die Bau-Sitzung schließt
mit „Sichttest ungeprüft" wie im Brief vorgesehen.

**Klaus' Sichttest-Schritte:**

1. **Service-Worker-Cleanup** (Stolperfalle 1 Brief, Cache-Bust):
   `chrome://serviceworker-internals/` öffnen → alle Sage-Protokol-
   Worker Unregister → „Clear site data" für die Sage-Origin → Tab
   schließen → Tab neu öffnen. Falls aus früheren Sichttests ein
   App-SW (`SBKIM_SW_STANDALONE` aus Pflege App-SW-Koexistenz)
   noch hängt, sauber deregistrieren.
2. **Sage-Page öffnen** → DevTools-Konsole prüfen: Selbstcheck-Zeilen
   `MODUL 00/01/02/04/05/06/07/08 … bereit, Funktionen: …` (Modul 03
   meldet sich erst nach `init()`), dann `SBKIM-Sage-Init: Init-Kette
   abgeschlossen (dbSuffix=sage).`, dann `SBKIM-Sage-Init:
   Service-Worker registriert, Scope: https://…/Sage-Protokol/`.
3. **Schwarz-Loch-Karte klicken** → Andock-Wizard-Modal erscheint
   (NICHT der Observatorium-Screen — das ist der Erst-Klick-Pfad bei
   leerer IndexedDB).
4. **Knopf 1 „Identität erzeugen"** → Output zeigt
   `nodeId: <43-Zeichen-base64url>`.
5. **Knopf 2 „Spore erzeugen + herunterladen"** → Output zeigt erst
   „Lade Modul 03 (Embedding-Modell, ~30 MB) …" (5–15 s beim ersten
   Lauf, danach cached), dann „Erzeuge Domain-Vektor (384 floats) …",
   dann „Signiere Spore …", dann „Spore erzeugt + heruntergeladen
   (nodeId=…, signatur-länge=86). Committe nach sbkim/spore.json."
   Browser bietet `spore.json` zum Download an.
6. **Heruntergeladene `spore.json` ins Repo committen:** alte
   Skeleton-Datei `sbkim/spore.json` mit der heruntergeladenen
   ersetzen, Commit „Sage-Page erste Spore live (Sichttest 2026-05-
   xx)", Push. GitHub Pages deployt nach 1–2 min.
7. **Knopf 3 „Backup-Blob erzeugen"** → `window.prompt` fragt
   Passwort (≥ 8 Zeichen) → Output „Backup heruntergeladen …".
   Klaus verwahrt die `.sbkim.json`-Datei sicher.
8. **DevTools → Application → IndexedDB → `sbkim_sage`** prüfen:
   Stores `sbkim_keys` (Schlüssel `"main"` mit Keypair), `sbkim_spore`
   (`"main"` mit signierter Spore inkl. domainVector), `sbkim_meta`
   (`"active-identity"` = `"main"`).
9. **Identitäts-Wechsler-Dropdown** zeigt `main (aktiv)`.
10. **Folge-Klick auf die Schwarz-Loch-Karte** öffnet den Browser-
    Observatorium-Screen (NICHT erneut den Wizard — `bhStageClick`-
    Logik mit `__sageAndockOpenedOnce` + `hasIdentity`).
11. **Module-Bento-Zeilen** zeigen jeweils drei LED-Dots: Modul
    03/05/09 mit allen drei grün (`score: "fertig"`), Module 00–08
    sonst mit ersten zwei farbig (`score: "stub"` → blau), Sichttest-
    LED bleibt grau.
12. **`status.json § endknoten[sage]`-Promotion in Folge-Pflege-
    Sitzung:** `nodeId` auf den Wert aus Schritt 4 setzen,
    `pingStatus: "live"`, neue `spore.json` aus Schritt 6 committed.

---

## Nächster sinnvoller Schritt

**Klaus' Browser-Sichttest** (siehe oben). Blockiert die `pingStatus`-
Promotion auf `"live"` und die `nodeId`-Eintragung in `status.json
§ endknoten[sage]`. Danach eigene Mini-Pflege-Sitzung „Sage-Page-
Sichttest grün" mit `pingStatus: "live"` + signierter
`spore.json`-Commit + Sichttest-LED auf grün in der Bento-Tabelle.

**Folge-Sitzungen aus Brief-99-Pipeline (Reihenfolge ist Klaus'
Entscheidung):**

- Bau Multi-Identitäts-Migration der Endknoten (Brief PR #123 — Mein-
  Rezeptbuch + Mein-Mixarium auf Multi-Identitäts-Pfad).
- Mini-Pflege Sage-Page-Sichttest grün (nach Klaus' Browser-Lauf).

---

## PR

Branch `claude/bau-sage-page-refactor`, Draft-PR „Bau Sage-Page-
Refactor — Sage als dritter Endknoten bau-fertig (Sichttest ungeprüft)"
mit Klaus-Sichttest-Hinweis im Body.
