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
| **1** | **Widget-Shell** — Self-Mount, Drag, klein→groß, leicht transparent, eigenes Textfeld (UX-Erhalt), Sprach-Knopf (Modul 21), interne Suche (Modul 04 `queryLocal`) + Richter (Modul 04 `hybridMatch`), EU-Politik-Auswahl, X-Schließen, Persistenz. | ✅ |
| **2 A** | **KI-Such-Brücke · Gratis-Kopier-Pfad** — Suchfeld baut Prompt → KI-Anbieter-Wahl (Claude/ChatGPT/Perplexity + EU: Mistral/Aleph Alpha) → Prompt kopieren + Anbieter öffnen → KI-Antwort (JSON) einfügen → `parseAiAnswer` (Code-Fence + URL-Müll säubern) → semantisch sortieren. Kein Schlüssel. | ✅ **diese Sitzung** |
| **2 B** | **KI-Such-Brücke · API-Modus + Widget-Tresor** — eigener Widget-Tresor (Shamir 2/3 + eigenes Passwort + 🔐-Symbol, Krypto-Kern aus Modul 20/02), direkter Browser-API-Aufruf mit Websuche → Antwort **automatisch** ins Widget. App-Schlüssel-Durchreichung (`init({apiKey})`) zuerst, sonst Tresor. **Sicherheits-sensibel.** | ⏳ eigene Folge-Sitzung |
| **3** | **PWA-/Suchfeld-Kopplung** über Modul 15 Membran — Host-Suchfeld erkennen, Inhalt lesen, aus dem Suchfeld interagieren. **Sicherheits-sensibel** (Host-Inhalt = `untrusted external data`). | ⏳ eigene Folge-Sitzung |

Increment 1 baut ein **vollständig nutzbares Standalone-Such-Tool**. Increment 2
löst Klaus' Internet-Vision (2026-06-21): das Widget **sucht nicht selbst**, es
**baut den Prompt und ordnet die Antwort** — die KI ist die Suchmaschine der Wahl,
der Nutzer (Stufe A) oder ein Schlüssel (Stufe B) ist die Brücke. Increment 3 ist
additiv (Korpus-Quelle + Interaktions-Richtung), ohne die Shell umzubauen.

### Increment 2 — KI-Such-Brücke (Klaus' Festlegung 2026-06-21)

**Warum:** Echte Inline-Web-Treffer scheiterten an der Browser-Wand (CORS) und an
gesperrten öffentlichen SearXNG-Instanzen. Eine KI mit Websuche liefert die
Quellen aber als **Text** — der per Einfügen (Stufe A) oder per API (Stufe B)
hereinkommt, ohne CORS-Problem. Erst wenn die Antwort **zurück ins Widget**
kommt, zündet das Vektor-Sortieren (am realen Test 2026-06-21 bestätigt: 15
ChatGPT-Quellen wurden nach Bedeutung sortiert, die „Nest entfernen"-Seite
korrekt nach unten, obwohl sie „Wespen"+„Hausmittel" enthielt).

**Stufe A (gebaut):** `buildPrompt(query)` (Code-Block-Regel → ChatGPT-Copy-Knopf
+ saubere URLs) · KI-Anbieter-`<select>` (`AI_PROVIDERS`, bei `euPolicy:"bindend"`
nur EU-Anbieter) · „🤖 Prompt → KI" (Clipboard + Anbieter best-effort öffnen) ·
Einfüge-`<textarea>` + „↓ Antwort sortieren" → `parseAiAnswer` → in die vorhandene
Sortiermaschine. `parseAiAnswer` verträgt Code-Fences + säubert URL-Müll
(unsichtbare Zitat-Artefakte, im Test gesehen).

**Stufe B (Spec, NICHT gebaut) — drei Sub-Schritte:**

- **B1 — Widget-Tresor (Fundament). ✅ B1a Kern gebaut (2026-06-21).** Eigenes,
  **getrenntes, in-Widget portables** Schloss (Klaus' Entscheidung 2026-06-21):
  eigenes Passwort + **Shamir 2-von-3** + (B1b) **🔐-Symbol**. Speichert die
  API-Schlüssel verschlüsselt in localStorage (`sbkim_search_widget_vault`),
  **keine** Abhängigkeit zu Modul 01/02/20 → überall hin kopierbar. Krypto
  spiegelt Modul 20/02: PBKDF2-SHA256 (≥600k) → AES-GCM-256, Salt 16 / IV 12,
  base64url; Recovery via Shamir 2-von-3 (GF256, eigene Portierung). Surface
  `hasVault/isVaultUnlocked/createVault/unlockVault/lockVault/deleteVault/
  setVaultSecret/recoverVaultPassword`, `_meta.hasVault/vaultUnlocked`. Passwort
  wird **nie gehalten**, Schlüssel nur im RAM nach Entsperren, falsches Passwort →
  `false` (kein Oracle), Klartext-Schlüssel nie im Speicher. Headless-Smoke 119/119
  (Probe 39 Roundtrip + kein Leck + fail-soft, Probe 40 Shamir 2/3). **Offen B1b:**
  Modal-UI (Passwort anlegen/entsperren + Anteile-Sicherung) + 🔐-Knopf →
  Klaus-Sichttest. Sicherheits-Modul → Pflicht-`ZERTIFIKAT_ASPEKTE`-Eintrag in
  Modul 16 (mit B1b). **✅ B1b UI gebaut (2026-06-21):** 🔐-Knopf im Kopf öffnet die
Tresor-Sektion; je nach Zustand Anlegen (Passwort + Schlüssel → 3 Anteile zum
Sichern), Entsperren, oder Sperren/Löschen. Headless-Smoke 125/125 (Probe 41 UI-
Fluss). **Browser-Sichttest wartet auf Klaus.** ZERTIFIKAT_ASPEKTE-Eintrag (Modul
16) noch offen — eigener kleiner Schritt.
- **B2 — Automatischer KI-Aufruf. ✅ Probe gebaut (2026-06-21, nur Claude).**
  Direkter Browser-Aufruf der gewählten KI **mit Websuche** → Antwort automatisch
  ins Widget (kein Kopieren mehr). `autoSearch(query)` + „⚡ Automatisch"-Knopf;
  Schlüssel aus B1-Tresor ODER `init({apiKey})`; Modell via `init({aiModel})`.
  **Probe-Umfang:** nur **Claude** (`api.anthropic.com` + Header
  `anthropic-dangerous-direct-browser-access` + `web_search`-Tool) — der einzige
  Anbieter mit dokumentiertem Browser-Direkt-Weg. Alles **fail-soft**: CORS/Key/
  Netz-Fehler → ruhiger Hinweis + Fallback auf den **Kopier-Pfad (Stufe A)**, kein
  Throw. Headless-Smoke 145/145 (Probe 42: Request-Form + Parse/Sort + fail-soft +
  Rohantwort-Diagnose). **✅ Browser-Sichttest grün (Klaus 2026-06-21):** ⚡
  Automatisch → Claude rief sich selbst auf, durchsuchte live das Netz, lieferte
  JSON → 30 NETZ-Treffer automatisch sortiert (90–85 %), ganz ohne Kopieren.
  **CORS funktioniert** (Browser darf Claude direkt anrufen) — die große offene
  B2-Frage ist positiv beantwortet. `max_tokens` auf 8192 nötig (4096 schnitt die
  Antwort ab). Gehen weitere Anbieter (Gemini etc.) im Browser, folgen sie als
  eigener Schritt.
- **B3 — „Warum/worin"-Begründung mit eigenen Such-Schichten.** Pro Treffer ein
  Satz „passt, weil …" + Aufschlüsselung, **worin** Übereinstimmung (Klaus' Frage:
  warum 82 % vs 70 %). Braucht den KI-Richter (Modul 04 `hybridMatch`, BYOK).
  **Wichtig:** die heutigen drei Richter-Schichten (`fachlich`/`prozess`/
  `skalierung`) sind fürs **Knoten-Andocken** getunt, NICHT für Web-Treffer — für
  die Suche brauchen wir **eigene Schichten** (z.B. *Thema · Absicht · Angebot*).
  Das ist eine Modul-04-Änderung (Querschnitt → bewusst, eigener Schritt). Außerdem
  filtert der heutige Richter auf `passt` — fürs „alle 10 erklären" muss er einen
  Erklär-Modus ohne Filter bekommen.

App-Schlüssel-Durchreichung + Sicherheit: Schlüssel nur lokal, **nie ins Mycel,
nie auf GitHub**, nur an den gewählten Anbieter; bei verteilten Apps trägt jeder
seinen eigenen ein (nie im Code).

**KI-Anbieter (Klaus-Entscheidung 2026-06-21): ChatGPT · Claude · Gemini · Perplexity.**
**Gemini (Google) 2026-06-21 dazu** als semantisch starker „KI-Freund" — führt
Anfang 2026 die Benchmarks für abstraktes Schließen (ARC-AGI-2) + MMLU-Pro an, ist
explizit auf „Bedeutung jenseits der bloßen Wörter" gebaut und mehrsprachig stark
(Deutsch). Empfehlung am Referenzfall 2 (Hund+Katze) zu validieren — Benchmark ≠
Garantie (vgl. Mistral: gut in Sprach-Benchmarks, real schwach).
**Mistral + Aleph Alpha bewusst RAUS** aus diesem Widget — Aleph Alpha kann keine
Web-Suche (für ein Such-Werkzeug nutzlos), Mistral lieferte in mehreren Tests
schwach (vgl. Hunde-Zecken-Test: Permethrin/Advantix ohne Katzen-Warnung). **Nur
widget-scoped:** BLP nutzt Mistral weiter intern für seine eigene Sache (Steuer-
Daten) — das bleibt unberührt. Die `euBased`-Mechanik bleibt im Code; käme je ein
brauchbarer web-such-fähiger EU-Anbieter, lässt er sich wieder eintragen. Bei
`euPolicy:"bindend"` fällt die Auswahl mangels EU-Anbieter auf alle zurück (kein
leeres Dropdown).

**Browser-Sichttest Stufe A grün (Klaus 2026-06-21):** Auf der Sage-Page mit
nur **Netz** angekreuzt eine echte ChatGPT-Antwort ins Einfüge-Feld → „↓ Antwort
sortieren" → fünf NETZ-Treffer absteigend sortiert (0.90–0.87, „Hausmittel gegen
Wespen" oben). Der Gratis-Kopier-Pfad arbeitet live. Eng beieinander liegende
Werte sind korrekt, wenn alle Quellen thematisch passen; die Bedeutungs-
Trennung (Off-Topic nach unten) zeigt sich am Referenz-Datensatz mit gemischtem
Intent.

**Treffer-Anzeige (Klaus 2026-06-21, Browser-Sichttest grün):** Viel sammeln +
vorsortieren, **erste 10 zeigen**, Rest hinter „▾ weitere 10 zeigen (noch N)";
Wert als **Prozent** (Cosinus·100, echte Unterschiede); **Inhalts-Snippet** unter
dem Titel. Live bestätigt mit „ich suche ein wirksames Zeckenmittel": 26 NETZ-
Quellen gesammelt, 10 mit 88/88/87 % + Beschreibung gezeigt, Pfeil „noch 16".
**Referenz-Fälle (Maßstab):** feste Test-Fälle in
[`_such_referenzfaelle.md`](_such_referenzfaelle.md) — Wespen (Off-Topic nach
unten) + Hunde-Zecken im Hund-UND-Katze-Haushalt (Permethrin/Katzen-Sicherheit,
B3-Goldstandard). Änderungen werden daran gemessen, nicht am Bauchgefühl.

**Werkzeugkiste (2026-06-21):** Modul 22 ist als eigene Kachel „Such-Werkzeug"
(eigenes 🔍-Symbol, tier basic, status fertig) in der Observatoriums-Vorteilspack-
Truhe (`docs/observatorium/vorteilspack.js`) geführt — eigenständiges Werkzeug mit
kopierbarem Modul-Code + Einbau-Anleitung, zur Verteilung an Forker und das
SBKIM-Tool. Smoke `tests/smoke_observatorium_truhe.mjs` 22/22.

**Vision — Such-Tool als Mycel-Agent:**
[`_vision_such_agent.md`](_vision_such_agent.md) hält Klaus' Vision 2026-06-21 fest
(Manifestation/Brücke der Mycel-Idee, sieben Mycel-Möglichkeiten, die **Agenten-
Visitenkarte**: das Tool beschreibt vor jeder Anfrage sein Ziel; Verstehen beginnt
am Handschlag; eine Identität = Spore; nächster Schritt Visitenkarten-Präambel).

**Lehre Recall vs. Ranking (Klaus' NoBite-Befund 2026-06-21):** Das Werkzeug
arbeitet zweistufig — **Sammeln (Eingang)** + **Sortieren (Bedeutungs-Maschine)**.
Die Sortier-Maschine kann nur ordnen, was das Sammeln liefert; ein gutes, aber
nicht eingesammeltes Produkt (NoBite/Permethrin) kann sie nicht nach oben holen.
Der Miss lag also in **Stufe 1 (Recall)**, nicht in Stufe 2.

**Schärfung der Lehre (Klaus 2026-06-21): Bedeutung zuerst, nicht Breite.** Nicht
„sammle breit" ist der Kern, sondern „**verstehe zuerst die Absicht, suche dann
nach der Bedeutung**". `buildAiPrompt` weist die KI jetzt an, erst herauszulesen,
was der Nutzer WIRKLICH meint (Ziel, Kontext, Land, Form), und dann nach dieser
**Bedeutung/Semantik** zu suchen — ausdrücklich auch Treffer, die die Wörter nicht
enthalten, aber die Absicht erfüllen (Marken, Wirkstoffe, Nischen-/Spezial-
Anbieter). „Nicht die Breite zählt, sondern die Bedeutungsnähe." Das ist KEINE
Keyword-Denke; die Breite folgt aus dem vollständigen Abdecken der Bedeutung, nicht
umgekehrt. So zündet die Bedeutungs-Sortierung (Stufe 2) auf einem semantisch
gesammelten Korpus.

**Schärfen-Schritt (Klaus 2026-06-21):** Wenige Worte tragen die Absicht oft
nicht. Ein **lokales, gratis Schärfen-Feld** fordert vor dem Prompt aktiv zum
Präzisieren auf (Placeholder: Zweck? · Region/Land? · Art/Form? · Marke/Budget?);
der Kontext wird als „Was ich genau meine" in den Prompt gewoben
(`buildPrompt(query, context)`). Die **tailored** KI-Rückfragen („meinst du Spray
oder Deutschland?") brauchen ein KI-Verständnis der Frage → gehören zu **B2**
(automatischer KI-Aufruf): die KI stellt 1–3 Rückfragen, bevor sie sucht.

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

## Mehrfach-Suche: drei getrennte Bereiche (Bau 22 Mehrfach, 2026-06-21)

Klaus' Vision: das Werkzeug durchsucht **drei getrennt wählbare Bereiche**
(mehrere zugleich ankreuzbar, Treffer zusammengeführt + Herkunfts-Badge). Alle
drei münden in **dieselbe Sortiermaschine** (Modul 03 Embedding + Modul 04
Matcher) — exakt das Zwei-Stufen-Muster von BLP (Eingang teils KI → in-App-
Matcher; bei BLP: Beleg-Foto → OCR → Embedding+Matcher → Konto).

| Bereich | Eingang (Stufe 1) | Sortiermaschine (Stufe 2) | Empfangsmodus |
|---|---|---|---|
| **App** | lokaler Korpus / Host-Inhalt | Cosinus + optional Richter | lokal, server-los ✓ |
| **Knoten** | verbundene Knoten (deren Sporen, lokal bekannt) | Cosinus + optional Richter | lokal, **keine** Netz-Anfrage ✓ |
| **Internet** | ~50 Roh-Web-Treffer (SearXNG) **oder** „↗ neuer Tab" | Cosinus + optional Richter | **Pilz-Egress** (bewusst, nutzer-ausgelöst) |

### KI-Richter an/aus (Klaus 2026-06-21)

Ein **Schalter** im Widget, **Default aus**:

- **Richter AUS** → reine **semantische Suche „über die Bedeutung"** (Embedding-
  Cosinus, Modul 03+04 `queryLocal`). **Gratis, kein Schlüssel, server-los.** Für
  alle, die „nicht so viel Geld haben".
- **Richter AN** (nur sinnvoll mit BYOK-Schlüssel) → KI urteilt zusätzlich
  bidirektional (`hybridMatch`) über die zusammengeführten besten Kandidaten
  (ein Aufruf über die Spitze — die ~100 lokal zu sortieren ist gratis, nur die
  Spitze kostet). Bei Schlüssel-Fehlen/Fehler **fail-soft** zurück auf semantisch.

### Internet-Bereich (Pilz-Egress, semantischer Web-Re-Ranker)

- **Ohne SearXNG-URL:** Internet-Bereich liefert eine **„↗ Im Netz suchen"-Karte**
  (neuer Tab zu DuckDuckGo). Das Widget selbst lädt nichts — sauberster
  „Pilz, kein Crawler".
- **Mit eigener SearXNG-URL** (`init({searxngUrl})` oder Feld im Widget): das
  Widget holt ~`SEARXNG_MAX_RESULTS` Roh-Treffer (`/search?q=…&format=json`),
  **bettet sie ein** (Modul 03) und **sortiert sie semantisch** (Modul 04) — so
  erscheinen **nur die besten** Treffer im Widget statt der überladenen Such-Seite
  (Klaus' Idee: aus ~100 Antworten per Bedeutung die besten herausholen).
  Öffentliche SearXNG-Instanzen blocken JSON/CORS meist → praktisch die **eigene**
  Instanz (Pilz-Server). Fehlt/scheitert der Fetch → Fallback „↗ neuer Tab".
- **Suchmaschine frei wählbar** (`init({webSearchEngine})` oder `<select>` im Widget):
  DuckDuckGo (Default) · Startpage · Ecosia · Brave · Google · Bing. Gilt für den
  „↗ neuer Tab"-Weg; Wahl persistiert (`sbkim_search_widget_engine`).

### Internet-Status + Zukunftsoptionen (Klaus 2026-06-21)

**Entscheidung 2026-06-21 (Klaus):** der Internet-Bereich bleibt **vorerst beim
„↗ neuer Tab"-Link** (Anfrage wird mit der gewählten Suchmaschine als URL
generiert; Klaus testet: Rechtsklick → „in Tab öffnen" funktioniert). **Echte
Inline-Web-Treffer sind aufgeschoben**, bis eine browser-erreichbare Quelle
existiert — alle 7 getesteten öffentlichen SearXNG-Instanzen blocken JSON/CORS
(`HTTP 403`), eine browser-native Web-Suche ist also nicht möglich. Default
`Internet` = **aus**; `App` + `Knoten` = **an** (die lokalen, gratis,
funktionierenden Bereiche — Knoten-Suche im eigenen Netz ist die Priorität).

**Zukunftsoptionen (für eine eigene Folge-Sitzung, NICHT jetzt gebaut):**
1. **Eigener SearXNG-/Proxy-Server** (Pilz-Server, gratis aber Einrichtung) →
   echte Roh-Treffer, semantisch re-rankt (Pfad oben schon gebaut).
2. **Browser-native Konnektoren** zu CORS-offenen Open-Data-APIs (OpenStreetMap
   Orte/Adressen, Open-Meteo Wetter, Wikipedia Wissen) — kein Server, kein
   Schlüssel; nur für diese konkreten Domänen, nicht für allgemeine Web-Suche.
3. **Freie KI-Modelle als wählbare „Such-Engine"** (Klaus' Idee 2026-06-21):
   mehrere kostenlose KI-Modelle zur Auswahl, die die wenigen wirklich nötigen
   Antworten holen und als **prüfbare Quell-Links** bereitstellen (statt einer
   Roh-Trefferliste). Klaus: „vielleicht sogar die bessere Lösung." Offen für
   die Internet-Folge-Sitzung — Abwägung gratis-Kontingent / BYOK / Browser-CORS
   je Anbieter.

### Empfangsmodus-Versöhnung (verbindlich)

Der Internet-Bereich macht eine **Eigen-Anfrage ins Netz** — das wäre für einen
**Mycel-Knoten (Schicht 1)** verboten (Empfangsmodus). Modul 22 ist aber ein
**Pilz-Werkzeug (Schicht 2)**, kein Knoten. Die Vier-Schichten-Lesart (CLAUDE.md)
erlaubt der Pilz-Schicht ausdrücklich Außenwelt-Zugriff, **wenn er benannt,
sichtbar und nutzer-ausgelöst** ist — genau das ist der getrennt angekreuzte,
nutzer-gewählte Internet-Bereich. Festgehalten in CLAUDE.md § „Was du nicht tust"
(Tafel-Versöhnung 2026-06-21). App + Knoten bleiben rein lokal.

### Surface-Erweiterung (Mehrfach-Suche)

`init()`-Optionen zusätzlich: `areas?: {app?,knoten?,internet?: boolean}`,
`richter?: boolean` (Default false), `searxngUrl?: string`, `webSearchEngine?: "duckduckgo"|…` (frei wählbar,
Default DuckDuckGo, im Widget umstellbar + persistiert),
`nodeCorpus?: Array` / `prepareNodeCorpus?: () => Promise<Array>`.
`_meta` zusätzlich: `areas`, `richterOn`, `hasSearxng`, `nodeCorpusSize`.
`SearchResult.mode` ∈ `"leer" | "semantisch" | "richter" | "modul-04-fehlt" |
"fehler"`; `SearchResult.treffer[*].source` ∈ `"app"|"knoten"|"internet"`;
`SearchResult.webLink` = `{query,url}` (Internet ohne SearXNG) oder `null`.

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
