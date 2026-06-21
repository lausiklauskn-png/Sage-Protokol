# Modul 22 — Such-Widget (Floating Search-Tool)

> **Status:** 🟦 Code-Stub 2026-06-21 (Bau-Sitzung 22, **Increment 1 — Widget-Shell**) ·
> Widget-Backlog · **Priorität hoch** (Schritt 2 des SBKIM-Such-Werkzeugs nach
> Modul 21 Spracheingabe) · **Schicht:** Render-/Kompositions-Schicht (kein
> protokoll-aktives Modul) · **Anker:** frei bewegliches Floating-Such-Tool,
> self-mountend in `<body>`.
>
> **Datei (Code):** `src/modules/22_such_widget.js` · Headless-Smoke
> `tests/smoke_bau22_such_widget.mjs` · Panel 22 in `tests/manual_check.html` ·
> Skript-Load in `index.html` (KEIN Auto-Init).
> **Browser-Sichttest wartet auf Klaus' Galaxy-Tab-S6.**
>
> Auslöser: Klaus' Such-Werkzeug-Vision 2026-06-21 — ein **separates**, frei
> bewegliches Such-Tool, das sich über andere Suchfelder/PWAs legen lässt und
> sich beim Auflegen mit der jeweiligen PWA koppelt. Modul 21 (Spracheingabe)
> war Schritt 1; dieses Widget ist Schritt 2.

---

## Im Mycel-Bild

Modul 17 (Floating-Widget) ist ein **Sichtkästchen** — es zeigt, ob die Hyphe
atmet. Modul 22 ist ein **Tast-Organ**: ein kleines, frei bewegliches Werkzeug,
das der Betreiber über die Fläche schiebt und auf ein fremdes Suchfeld **legen**
kann. Im Ruhezustand ist es ein winziger, leicht durchscheinender Knoten; sobald
man es berührt, wächst es zu einem Eingabe-Mund, der hört (Sprache), sucht
(lokal), urteilt (Richter) und antwortet. Getrennt von der Wirts-PWA, bis es
aufgelegt wird — dann **koppelt** es (Increment 2) und nutzt alles, was es kann,
in Kombination mit dieser PWA.

---

## Vokabular

- **Such-Widget** — ein self-mountendes, drag-fähiges Floating-Tool. **Eigenes
  Modul**, nicht in eine bestehende Ansicht eingebaut (Klaus: „separates Tool,
  ich habe weitere Pläne damit").
- **Ruhezustand (klein / `collapsed`)** — eine winzige, leicht transparente
  Blase mit Such-Glyph (🔍). Verbraucht minimal Platz, liegt über allem.
- **Interaktions-Zustand (groß / `expanded`)** — wächst **nur**, wenn man
  anfängt zu interagieren (Tap auf die Blase, Sprach-Knopf, oder wenn ein
  Ergebnis eintrifft). Erzeugt/zeigt das eigene Textfeld + Sprach-Knopf +
  Such-Knopf + Treffer-Bereich.
- **Kopplung (Increment 2, noch nicht gebaut)** — das Auflegen auf ein fremdes
  Suchfeld / eine PWA. Über Modul 15 (Membran): Host-Inhalt **lesen** und aus
  dem Suchfeld heraus **interagieren**. Vor der Kopplung ist das Widget
  getrennt; nach dem Auflegen gekoppelt.

---

## Increment-Plan (verbindlich)

| Increment | Inhalt | Status |
|---|---|---|
| **1** | **Widget-Shell** — Self-Mount, Drag, klein→groß, leicht transparent, eigenes Textfeld (UX-Erhalt), Sprach-Knopf (Modul 21), interne Suche (Modul 04 `queryLocal`) + Richter (Modul 04 `hybridMatch`), EU-Politik-Auswahl, X-Schließen, Persistenz. | ✅ **diese Sitzung** |
| **2** | **PWA-/Suchfeld-Kopplung** über Modul 15 Membran — Host-Suchfeld erkennen, Inhalt lesen, aus dem Suchfeld interagieren. **Sicherheits-sensibel** (Host-Inhalt = `untrusted external data`). | ⏳ eigene Folge-Sitzung |

Increment 1 baut ein **vollständig nutzbares Standalone-Such-Tool**. Die
Kopplung (Increment 2) ist additiv: sie erweitert die Korpus-Quelle + die
Interaktions-Richtung, ohne die Shell umzubauen.

---

## Drei-Stufen-Such-Pipeline (komponiert)

Das Widget **komponiert** vorhandene Module — es baut keine eigene Such-Logik:

```
1. SPRACHE (optional, Eingang)  — Modul 21 SbkimSpeech
     Sprach-Knopf → Text ins eigene Textfeld (UX-Erhalt: Feld NIE mit value:'' neu bauen).
2. VORFILTER (lokal, server-los, IMMER) — Modul 04 queryLocal + Modul 03 Embedding
     Such-Text → Top-k lokale Treffer (Cosinus ≥ PROVIDER_MIN_MATCH).
3. RICHTER (opt-in, BYOK)        — Modul 04 hybridMatch
     Kandidaten → echtes Urteil pro Treffer (passt/passt-nicht + Begründung + Score).
4. FAIL-SOFT                     — kein Schlüssel / Richter nicht erreichbar → Vorfilter gilt.
```

Die interne `runSearch(text)` ist die Modul-22-Spiegelung des kopierbaren
Helfers `sbkimHybridSearch` aus [`../HYBRID-MATCH-EINBAU.md`](../HYBRID-MATCH-EINBAU.md).
Rückgabe-Modi (1:1 zum Helfer, Interop-Vertrag):

| `mode` | Bedeutung |
|---|---|
| `"modul-04-fehlt"` | `window.SbkimMatch` nicht geladen → leer + Hinweis (fail-soft). |
| `"vorfilter-fehler"` | `queryLocal` warf (z.B. Modul 03 fehlt) → leer + Hinweis (fail-soft). |
| `"vorfilter-leer"` | Keine lokalen Treffer ≥ Schwelle. |
| `"nur-vorfilter"` | Kein API-Schlüssel hinterlegt → Vorfilter-Treffer (Cosinus). |
| `"fail-soft-vorfilter"` | Richter nicht erreichbar → Vorfilter-Treffer + `reason`. |
| `"richter"` | Echtes Urteil — nur passende Treffer, nach Score sortiert, optional `attestation`. |

**Egal welcher Modus — der Nutzer bekommt immer etwas Sinnvolles.** Der Richter
verbessert, ist aber nie eine Eintritts-Barriere.

---

## EU-Politik-Auswahl (Klaus' Festlegung 2026-06-21, einheitlich mit Modul 21)

Das Widget trägt eine **EU-Politik** (`euPolicy`), die einheitlich für
**Sprach-Engine** (Modul 21) **und** **Richter-Provider** (Modul 04) gilt:

- **`"frei"`** (Default) — beide Sprach-Engines wählbar (Browser + EU), Richter
  mit frei wählbarem Provider; EU ist anbietbar, nicht erzwungen. Für
  **Sage / Mein-Mixarium / Mein-Rezeptbuch**.
- **`"bindend"`** — nur die EU-Sprach-Engine, Richter erzwingt `euOnly:true`.
  Für Knoten, die es verlangen (z.B. **BookLedgerPro**).

Mapping:

| `euPolicy` | Sprach-Engine (`SbkimSpeech.availableEngines`) | Richter (`hybridMatch` `euOnly`) |
|---|---|---|
| `"frei"` | `["browser","eu"]` | `euOnly = optEuOnly ?? false` (EU wählbar) |
| `"bindend"` | `["eu"]` | `euOnly = true` (erzwungen) |

---

## Zustände klein / groß + Transparenz

- **Footprint Ruhe (`collapsed`):** ~44 px Blase, Such-Glyph mittig, leicht
  transparenter Hintergrund (`rgba(...,0.90)` + `backdrop-filter: blur`).
  **Leicht, nicht stark transparent** (Klaus: „leicht transparent"). Drag-fähig.
- **Footprint Interaktion (`expanded`):** ~320 px breites Panel: Kopfzeile
  (Drag-Griff + Minimieren + X), Eingabe-Zeile (Textfeld + 🎤 Sprach-Knopf +
  🔍 Such-Knopf), EU-Politik-Chip, Treffer-Liste.
- **Wachstum nur bei Interaktion:** Tap auf die Blase, Fokus aufs Textfeld,
  Sprach-Knopf, oder ein eintreffendes Ergebnis lässt das Widget auf `expanded`
  wachsen. `collapse()` schrumpft zurück auf die Blase.
- **Default-Position:** `bottom-right`, 16 px Rand-Abstand (`init({defaultCorner})`
  überschreibbar). Z-Index `9985` — **unter** Modul 17 (9990) und Modals (9999),
  damit beide Floating-Tools koexistieren.

## Drag / Self-Mount / X / Persistenz (Mechanik aus Modul 17 wiederverwendet)

- **Self-Mount** in `document.body` mit `MutationObserver`-Fallback (Pattern aus
  Modul 17 — falls `body` beim `init()` noch fehlt).
- **Drag** via Pointer-Events (Touch + Maus), 5 px Threshold, freies Pixel-Drag
  mit Viewport-Clamping (24 px immer sichtbar). Drag startet nur außerhalb der
  interaktiven Controls (Textfeld, Knöpfe) — kurze Taps bleiben Klicks.
- **X-Schließen** blendet das Widget aus (`localStorage` `sbkim_search_widget_visible
  = "false"`), wiederherstellbar via `SbkimSearchWidget.show()`. User-Wahl ist
  heilig (`rememberHidden` Default `true`).
- **Persistenz (`localStorage`):** Position, Sichtbarkeit, Zustand
  (collapsed/expanded). Reine UX-Preferences, kein IndexedDB, kein Protokoll.
  Das **Textfeld-Wert** wird **nicht** persistiert (RAM-only `_query`).

### `localStorage`-Schema

| Schlüssel | Wert | Default |
|---|---|---|
| `sbkim_search_widget_visible` | `"true"` \| `"false"` | `"true"` |
| `sbkim_search_widget_position` | JSON eines `PositionSnapshot` | `{corner:"bottom-right",offsetX:16,offsetY:16}` |
| `sbkim_search_widget_state` | `"collapsed"` \| `"expanded"` | `"collapsed"` |

## UX-Lehre „Eingabe-Erhalt" (von BLP/Modul 21 übernommen)

Das Textfeld wird **einmal** angelegt und **nie** mit `value:''` neu gebaut.
Erkannter Sprach-Text wird **angehängt** (bestehender Wert bleibt). Der Wert
lebt zusätzlich in `_query` (RAM); Re-Render der Treffer berührt das Feld nicht.
Nur `collapse()`/`hide()` setzt nicht zurück — der Wert bleibt erhalten, bis der
Nutzer ihn selbst löscht. (Modul 21 Karte § UX-Lehre.)

---

## Schnittstelle (Increment 1)

```js
window.SbkimSearchWidget = {
  // Async-Init: mountet das Widget in <body>, liest localStorage, setzt
  // EU-Politik + Korpus + Richter-Optionen. Idempotent (zweiter Aufruf no-op).
  init: function (options) { /* Promise<void> */ },

  show: function () {},          // einblenden + persistieren
  hide: function () {},          // ausblenden + persistieren
  isVisible: function () {},     // boolean (aus DOM-State)

  expand: function () {},        // klein → groß
  collapse: function () {},      // groß → klein
  isExpanded: function () {},    // boolean

  getPosition: function () {},   // PositionSnapshot (defensive Kopie)

  // Korpus-Quelle setzen (Array von {label, text?, passageVec, anchorId?}).
  // Reicht an SbkimMatch durch + hält eine lokale Kopie für queryLocal.
  setCorpus: function (corpus) {},

  // Komponierte Suche (Sprache→Vorfilter→Richter→Fail-soft). Auch direkt
  // aufrufbar (Tests). Liefert { mode, treffer, reason?, attestation? }.
  search: function (text) { /* Promise<SearchResult> */ },

  _meta: { /* Read-Only-Anker für Tests */ },
};
```

### `options`-Form (`init()`)

```js
{
  euPolicy?: "frei" | "bindend",     // Default "frei"
  corpus?:   Array<{ label, text?, passageVec, anchorId? }>,  // lokaler Such-Korpus
  apiKey?:   string,                 // BYOK Richter-Schlüssel (opt-in; ohne → nur Vorfilter)
  provider?: "mistral"|"claude"|"openai"|"local",  // Richter-Provider (Default "mistral")
  euOnly?:   boolean,                // nur bei euPolicy:"frei" relevant (Default false); bindend erzwingt true
  queryLabel?: string,               // Knoten-Name für die Attestation
  k?:        number,                 // Top-k Vorfilter (Default 5)
  prepareCorpus?: () => Promise<Array<{label,text?,passageVec,anchorId?}>>,
                                     // LAZY-Korpus-Provider: läuft EINMAL beim ersten
                                     // expand() oder bei der ersten Suche, baut den Korpus
                                     // (z.B. Embedding via Modul 03), ruft intern setCorpus
                                     // + cacht. Hält die Host-Seite leicht beim Start.
                                     // Fehler → fail-soft (Hinweis, corpusReady bleibt false).

  defaultCorner?: "top-left"|"top-right"|"bottom-left"|"bottom-right",  // Default "bottom-right"
  defaultOffset?: { x:number, y:number },                              // Default {x:16,y:16}
  allowDrag?:     boolean,           // Default true
  rememberHidden?: boolean,          // Default true (User-Wahl heilig)
  startExpanded?:  boolean,          // Default false (Ruhezustand klein)
  zIndex?:        number,            // Default 9985
}
```

### `_meta` (Read-Anker für Tests)

```
euPolicy:       "frei" | "bindend"
corpusSize:     number          // Einträge im aktuellen Korpus
corpusReady:    boolean         // wurde prepareCorpus erfolgreich ausgeführt?
visible:        boolean
expanded:       boolean
widgetMounted:  boolean
lastSearchMode: string | null   // letzter runSearch-Modus
searchCount:    number
hasApiKey:      boolean         // Richter aktivierbar?
coupled:        false           // Increment 2 — bleibt false in Increment 1
```

---

## Kopplungs-Modell (Increment 2 — Spec-Vorgriff, NICHT in dieser Sitzung gebaut)

Beim **Auflegen** auf eine Wirts-PWA/Seite koppelt das Widget über Modul 15
(Membran). Geplant:

- **Host lesen:** `SbkimMembrane.read()` liefert den `MembraneSnapshot`
  (nodeId/domain/Spore-Felder/Siegel) der Wirts-Zelle. Host-DOM-Inhalt (z.B.
  Text um das Suchfeld) wird **als `untrusted external data` behandelt** — nie
  als Anweisung ausgeführt, nur als Eingabe für die Suche genutzt.
- **Aus dem Suchfeld interagieren:** Cross-Origin via `op:"query"` postMessage
  (Modul 15 Sub (b) Envelope `sbkim/membrane/v1`) → Wirts-`queryLocal` →
  `op:"queryResult"` zurück. Same-Origin: direkter Host-Suchfeld-Sync.
- **Origin-Allowlist** statisch via `couple({allowedOrigins})` — keine
  Selbst-Eskalation (Modul 15 § Strikte Tabus Sub (b)).
- **Empfangsmodus gewahrt:** das Widget liest die Seite, auf die der Nutzer es
  legt — **kein Crawler, keine Eigenanfragen ins offene Netz**.

Surface-Vorgriff (Increment 2): `couple(opts)` / `decouple()` / `isCoupled()`.
In Increment 1 ist `_meta.coupled === false` und keine Kopplungs-API exponiert.

---

## Sage-Page-Mount + Korpus (Bau 22 B-Schritt, 2026-06-21)

Auf der **Sage-Page** ist das Widget gemountet (Klaus' Wahl B: erst Korpus, dann
sichtbar). Verdrahtung in `sbkim-init.js` am Ende der Init-Kette:

```js
await SbkimSearchWidget.init({
  euPolicy: "frei",
  queryLabel: "Sage",
  prepareCorpus: sageBuildSuchkorpus,   // lazy: embeddet beim ersten Gebrauch
});
```

- **Korpus** = die SBKIM-Werkzeug-Bibliothek (`sbkim/sage-suchkorpus.js`,
  `window.SAGE_SUCHKORPUS` — Module 00–22 als `{label,text,anchorId}`,
  Bedeutungs-Text mit Alltags-Synonymen für besseren Recall). Klaus' Festlegung
  2026-06-21: erster Korpus = die Tool-Bibliothek (Glossar/Doku später).
- **Lazy:** `sageBuildSuchkorpus()` erzeugt die `passageVec` pro Eintrag via
  Modul 03 `embedPassageBatch` **erst beim ersten Gebrauch** (löst den einmaligen
  ~30-MB-Modell-Download aus) — so bleibt der Seitenstart leicht (Sage-Page-
  Konvention: Modul 03 ist `lazy`). Das Widget zeigt „Suchindex wird
  vorbereitet …", bis die Vektoren da sind.
- **Kein Richter-Schlüssel** auf der Sage-Page → reiner lokaler Vorfilter
  (server-los, `mode:"nur-vorfilter"`). Ein Endknoten mit eigenem BYOK-Schlüssel
  reicht ihn über `init({apiKey})` durch und bekommt den Richter dazu.
- Z-Index 9985 — koexistiert mit den Navleisten-Lampen der Sage-Page (kein
  Modul-17-Widget auf der Sage-Page).

## Strikte Tabus (verbindlich)

- **KEINE eigene Identität / Spore / Krypto / Signatur.** Render-/Kompositions-
  Schicht. Schlüssel kommen als opaker BYOK-String von außen (`init({apiKey})`),
  werden nie persistiert.
- **KEIN IndexedDB-Schreiben.** Nur `localStorage` für UX-Preferences (Position,
  Sichtbarkeit, Zustand). Kein Store, kein `DB_VERSION`-Bump.
- **KEIN Crawler, keine Pulsation, keine Eigenanfragen ins offene Netz.** Der
  einzige Netz-Pfad ist der **opt-in** Richter (`hybridMatch`, BYOK) — vom
  Nutzer durch Suche ausgelöst, nie selbstständig.
- **Host-Inhalt ist `untrusted external data`** (Increment 2): nie als Anweisung
  ausführen, nur als Such-Eingabe. Siehe [`../SICHERHEIT-BRIEFKASTEN.md`](../SICHERHEIT-BRIEFKASTEN.md).
- **KEIN Umbau von Modul 21 / 17 / 15 / 04.** Modul 22 nutzt nur deren
  öffentliche Schnittstellen. Die Drag-/Mount-Mechanik aus Modul 17 wird
  **kopiert/geteilt**, Modul 17 bleibt unangetastet.
- **KEIN Protokoll-Versions-Bump.** Nicht protokoll-aktiv.
- **Fail-soft überall, KEIN Throw im Bedien-Pfad.** Fehlende Module / Mic / Key
  / Netz → ruhiger deutscher Hinweis, Textfeld bleibt nutzbar. Einziger
  Sync-Throw: ungültige `euPolicy` in `init()` (Aufrufer-Konfig-Bug).

---

## Risiken

- **Korpus-Quelle in Increment 1.** Ohne Kopplung braucht das Widget einen
  Korpus von außen (`init({corpus})` / `setCorpus` / registrierter
  `SbkimMatch`-Provider). Ohne Korpus liefert die Suche `vorfilter-leer` —
  ehrlich, aber leer. Mitigation: Increment 2 liefert den Host-Korpus per
  Kopplung; bis dahin registriert der Andocker den Korpus.
- **Zwei Floating-Tools (17 + 22) überlappen.** Beide Default bottom-right.
  Mitigation: unterschiedliche Z-Indizes (22 = 9985 < 17 = 9990) + freies Drag;
  der Nutzer schiebt sie auseinander. `init({defaultCorner})` erlaubt
  unterschiedliche Ecken.
- **Richter-Schlüssel im RAM.** `apiKey` lebt als opaker String in der Closure,
  wird nie persistiert, nie geloggt, nie in der Attestation gespiegelt.
- **`localStorage`-Verlust** (Inkognito, iOS-7-Tage-Reset) → Default-Position +
  sichtbar + collapsed. Akzeptiert (vernünftiger Default).

---

## Querverweise

[`21_spracheingabe.md`](21_spracheingabe.md) (Eingang) ·
[`17_floating_widget.md`](17_floating_widget.md) (Drag/Mount-Mechanik) ·
[`15_membran.md`](15_membran.md) (Kopplung Increment 2) ·
[`04_match.md`](04_match.md) § Sub (c) `queryLocal` + § Hybrid-Match ·
[`../HYBRID-MATCH-EINBAU.md`](../HYBRID-MATCH-EINBAU.md) (Helfer + Prompt-Härtung) ·
[`../SICHERHEIT-BRIEFKASTEN.md`](../SICHERHEIT-BRIEFKASTEN.md) (untrusted external data).
