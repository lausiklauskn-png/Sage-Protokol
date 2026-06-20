# Modul 19 — Andock-Wizard (kopierbar)

> **Status:** 🟩 Fertig (Bau 2026-06-20 — Klaus-Vorziehen aus Phase B, weil
> die Andock-Funktion nachweislich läuft) ·
> **Schicht:** Andock-UI-Komponente als kopierbares JS-Modul, extrahiert
> aus dem bestehenden Sage-Page-Andock-Wizard. Einsatz: Sage-Protokol UND
> **Externer Mycel-Hub** (siehe [`_mycel_hub.md`](_mycel_hub.md)).
> **Datei (Code):** `src/modules/19_andock_wizard.js` (gebaut 2026-06-20).
> Reine Eingabe→Text-Hilfe: Repo-URL + Domain + Knotentyp → unsignierte
> Spore-Vorlage + `status.json`-Zeile + vorgelinkter PR. **Kein Signieren**
> (Modul 02), **kein Storage, kein Netz**. Public surface
> `repoToPagesUrl / repoToNodeName / buildSporeTemplate / buildStatusLine /
> buildPrUrl / generate / mount / _meta`; `mount()` ist Browser-only, die
> Kern-Funktionen sind headless testbar. Headless-Smoke
> `tests/smoke_bau19_andock_wizard.mjs` **15/15 grün**. Browser-Sichttest
> der `mount()`-UI steht aus.

---

## Im Mycel-Bild

Bisher gibt es genau **eine** Stelle im Sage-Universum, an der ein
neuer Knoten ans Mycel andocken kann: die Sage-Page Schwarz-Loch-Karte.
Drei Eingabefelder (Repo-URL, Domain, Knotentyp), ein Klick auf
„Spore-Vorlage erzeugen" — die Sage spuckt eine Spore-Datei + einen
vorgelinkten `status.json`-PR aus, und der Forker kann seinen Knoten
ans Netz bringen.

Modul 19 macht aus dieser Wizard-Logik ein **kopierbares JS-Modul**:
dieselbe Drei-Felder-Eingabe, dieselbe Spore-Vorlage-Generierung,
derselbe `status.json`-PR-Vorschlag — aber als eigenständiges
`<script>`-Modul, das in eine beliebige Page einsetzbar ist. Damit
kann der Externe Mycel-Hub (siehe `_mycel_hub.md`) den Wizard
einbetten, ohne den Sage-Page-Code zu klonen.

## Vokabular

- **Andock-Wizard** — UI-Komponente mit drei Eingabefeldern
  (Repo-URL · Domain · Knotentyp) + „Spore-Vorlage erzeugen"-Knopf,
  die einen frischen Spore-JSON-Template + einen vorgelinkten
  GitHub-PR auf `status.json` ausgibt.
- **Kopierbares Modul** — `src/modules/19_andock_wizard.js` ist
  Single-File-JS-Modul, das als `<script>`-Tag in jede Page eingebunden
  werden kann. Keine Build-Pipeline, kein NPM, kein Bundler.
- **Mount-Anker** — CSS-Selektor, an dem der Wizard sein DOM-Element
  anhängt (analog Modul 16 `badgeSelector` / Modul 17 `containerSelector`).

## Warum jetzt (Hochstufungs-Begründung)

Klaus' Vision-Korrektur 2026-05-26: **mehrstufige Mycel-Architektur** —
Sage-Protokol (Klaus' Endknoten + Spec-Hub) → SBKIM-Starter-Bundle
(Forker-Distribution) → **Externer Mycel-Hub** (öffentliches
Observatorium light für Forker) → Forker-PWAs (Muttis Rezeptbuch,
Pepo, etc.).

Der Externe Mycel-Hub braucht denselben Andock-Wizard wie die
Sage-Page, aber als **eigenes Repo** (trennt Forker-Last von Klaus'
Sage). Statt den Sage-Page-Wizard-Code zu kopieren (Drift-Risiko),
wird der Wizard zu einem kopierbaren JS-Modul (Modul 19) extrahiert.

---

## Zweck (knapp, Spec-Vorbereitung)

Andock-Wizard kapselt die **vier Eingabe-Schritte** für einen neuen
SBKIM-Knoten:

1. Repo-URL (GitHub-URL der eigenen PWA)
2. Domain (z.B. „Kochrezepte", „Cocktails")
3. Knotentyp (hybrid · consumer · provider)
4. Optional: Stamm-/Gast-Kategorien

Output:
- **Spore-JSON-Template** mit allen Pflicht-Feldern (analog Modul 02
  `getOwnSpore()`-Schema, aber als Template **ohne** `nodeId` /
  `publicKey` — die werden beim ersten Boot der PWA selbst-generiert)
- **Vorgelinkter GitHub-PR** auf `status.json` des Hub-Repos (Sage-
  Protokol ODER Externer Mycel-Hub) mit den Forker-Daten als
  `endknoten`-Eintrag-Patch
- **Anleitung** (3–5 Zeilen) wie der Forker die Spore in sein Repo
  einbaut + `sbkim/`-Verzeichnis anlegt + Service-Worker registriert
  (Querverweis auf Karte 09 Einbau-PWA)

---

## Sub-Bereiche (Spec-Vorbereitung)

Diese Liste ist eine **Vorschlags-Skizze** — die volle Spec-Sitzung 19
entscheidet, welche Sub-Bereiche Pflicht sind.

### Sub (a) — Drei-Felder-Eingabe + Validierung

- Repo-URL: `https?://` Pflicht, GitHub-Pages-URL bevorzugt
- Domain: 3–60 Zeichen, deutsch, keine Sonderzeichen außer Bindestrich
- Knotentyp: `hybrid` (Default) · `consumer` · `provider`

### Sub (b) — Spore-Vorlage erzeugen

Ruft auf:
- `SbkimSpore.makeSporeTemplate({repoUrl, domain, nodeType})` — Modul 02
  liefert ein Spore-JSON-Template (ohne `nodeId`/`publicKey`/`signature`,
  die werden beim ersten PWA-Boot generiert).
- UI zeigt das Template als formatierten JSON-Block mit Copy-Knopf +
  Download-als-`spore.json`-Knopf.

### Sub (c) — PR-Vorschlag auf `status.json`

- UI zeigt den exakten `endknoten[]`-Patch-Block, der in `status.json`
  ergänzt werden muss.
- Vorgelinkter GitHub-PR-Link
  (`https://github.com/<owner>/<hub-repo>/edit/main/status.json`)
  als anklickbarer Link mit Pre-Filled-PR-Body.

### Sub (d) — Andock-Hilfe (3–5 Zeilen)

- Verlinkt Karte 09 Einbau-PWA für den Vollständigen Andock-Workflow.
- Verlinkt den **SBKIM-Starter-Bundle**-Repo (siehe `_starter_bundle.md`)
  als komplette Modul-Distribution.

### Sub (e) — Hub-Adressierung (mehrere Hubs)

- Forker kann zwischen Sage-Protokol (Klaus' Mycel) und Externem
  Mycel-Hub (Forker-Mycel) wählen. Default: Externer Hub
  (entlastet Klaus' Sage).
- Spec-Sitzung 19 entscheidet, ob ein Forker an **mehrere** Hubs
  gleichzeitig andocken kann oder ob nur einer aktiv ist.

---

## Modal-Form (Spec-Vorbereitung)

Skizze: ein eingebettetes Card-Element (analog Sage-Page Karte 4
„Andock · 3 Klicks bis zum Spore-Vorschlag"), KEIN Modal. Andock-
Wizard ist eine **stets sichtbare Sektion** auf der Hub-Page, kein
versteckter Tool-Schrank. Begründung: Forker brauchen den Wizard als
ersten Schritt — er gehört auf die Landing-Page des Hubs, nicht hinter
einen Klick.

---

## Schnittstelle (Spec-Skizze)

```js
window.SbkimAndockWizard = {
  // mountAnchor: CSS-Selektor für das Container-Element, in das der
  //   Wizard sein DOM einsetzt.
  // hubRepo:     "lausiklauskn-png/Sage-Protokol" oder
  //              "lausiklauskn-png/SB-KIMTool-Point" oder
  //              "<forker>/<eigener-hub>" — bestimmt das PR-Ziel.
  // hubStatusJsonUrl: optional, sonst aus hubRepo abgeleitet.
  init: function (options) { /* Promise<void>, idempotent */ },

  // Sync, void. Setzt Eingabe-Felder zurück, leert Output.
  reset: function () { /* void */ },

  // Sync, options-Snapshot. Defensive Kopie.
  _meta: { /* Read-Anker */ },
};
```

**options-Form (Spec-Vorbereitung):**

```js
{
  mountAnchor: string,                    // Pflicht, CSS-Selektor
  hubRepo: string,                        // Pflicht, "owner/repo"
  hubStatusJsonUrl?: string,              // optional Override
  defaultNodeType?: "hybrid"|"consumer"|"provider", // Default "hybrid"
  starterBundleUrl?: string,              // optional, Link auf Bundle-Repo
}
```

---

## Strikte Tabus (Spec-Vorbereitung)

- **KEINE eigene Identität.** Modul 19 ist Render-Schicht — ruft
  Modul 02 für Spore-Template-Erzeugung.
- **KEIN Auto-PR-Erstellen.** Wizard zeigt nur den **Link** auf den
  PR-Edit-View; Forker klickt selbst.
- **KEINE Spore mit `nodeId`/`publicKey`/`signature` im Template.**
  Diese drei Felder erzeugt die Forker-PWA beim ersten Boot selbst
  (Identitäts-Generierung lokal, KEIN Hub-Aussteller).
- **KEINE Validierung der Forker-Repo-URL.** Wizard prüft nur
  Syntax (`https://` Prefix). Ob die URL existiert oder eine echte
  PWA ist, ist Forker-Pflicht.
- **KEIN PROTOCOL_VERSION-/DB_VERSION-Bump.** Modul 19 ist nicht
  protokoll-aktiv.

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Stub angelegt | 2026-05-26 | Tafel-Spec-Pflege Mycel-Vision | Klaus' Vision-Korrektur 2026-05-26: mehrstufige Mycel-Architektur (Sage → Starter-Bundle → Externer Mycel-Hub → Forker-PWAs). Externer Hub braucht den Sage-Page-Andock-Wizard als kopierbares Modul. Diese Karte ist Vorbereitungs-Spec mit Vokabular + Sub-Bereiche-Skizze. Volle Spec-Sitzung 19 folgt nach App-Freigabe (Pipeline-Phase B). Brief: `docs/sessions/BRIEF_SPEC_19_ANDOCK_WIZARD.md`. |
| Spec gefüllt | — | Spec-Sitzung 19 | folgt — alle Sub-Bereiche final entscheiden + Schnittstelle festlegen + PR-Template-Form klären. |
| Code geschrieben | — | Bau-Sitzung 19 | folgt — `src/modules/19_andock_wizard.js` + CSS + Panel 19 in `tests/manual_check.html` + Headless-Smoke. Bestehender Sage-Page-Wizard-Code (`index.html` Karte 4, Z. ~969–991) als Vorlage. |
| Im Externen Mycel-Hub eingebaut | — | Hub-Folge-Sitzung | folgt — siehe `_mycel_hub.md`. |

---

**Querverweise**

- **Abhängigkeiten:** Modul 02 (Spore-Template-Erzeugung) · Modul 09
  (Einbau-PWA-Anleitung als verlinkte Hilfe).
- **Wird genutzt von:** Sage-Protokol Sage-Page (ersetzt langfristig
  den inline-Wizard-Code in `index.html`) · Externer Mycel-Hub (siehe
  [`_mycel_hub.md`](_mycel_hub.md)) · SBKIM-Starter-Bundle (siehe
  [`_starter_bundle.md`](_starter_bundle.md)).
- **Verwandt:** [Modul 09](09_einbau_pwa.md) (manueller Andock-
  Workflow, Modul 19 ist die UI-Version davon) · [Modul 18](18_tool_pwa.md)
  (Tool-PWA-Container, hat Andock-Geste als Sub (a) — Modul 18 und
  Modul 19 sind **getrennte UIs**: Modul 18 läuft INNERHALB einer
  Endknoten-PWA für Wartung, Modul 19 läuft AUF EINEM HUB für
  Neu-Forker).
- **Architektur-Mehrstufe:** [`_starter_bundle.md`](_starter_bundle.md)
  (Modul-Distributions-Repo) · [`_mycel_hub.md`](_mycel_hub.md)
  (öffentliches Observatorium light).
