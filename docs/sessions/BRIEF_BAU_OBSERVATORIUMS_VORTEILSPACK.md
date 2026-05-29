# Brief — Bau-Sitzung Observatoriums-Vorteilspack-Truhe

**Status:** Brief liegt, Bau ungeschehen. Erstellt 2026-05-28 in
Plansitzung „Observatoriums-Vorteilspack" (Klaus' Konzept-Anstoß).
Pipeline-Position: **Vision-Anker-Vorbereitung Schicht 4** — eigene
Bau-Sitzung NACH Phase A 5h.1-Folge (Endknoten-Re-Migration MR + MM)
und parallel zu Phase B Schritt 7 (Modul 19 Andock-Wizard).
Pipeline-Phase-frei wie die Einladungs-Bau-Sitzung 2026-05-27.

**Zielgruppe:** eine eigenständige Bau-Sitzung, die in einem frischen
Branch (`claude/bau-observatoriums-vorteilspack`) die Truhe auf der
Sage-Page baut.

---

## Anlass (Klaus' Vision 2026-05-28)

Klaus' Wort:

> „Können wir im Sage-Protokol Observatorium eine Toolboxtruhe mit den
> Tools die wir für SB-KIMTool-Point bauen machen — mit ausführlicher
> Beschreibung für jedes Tool, der Möglichkeit es per Copy-Paste in
> jedes beliebige Repo zu kopieren. Die Toolbox soll eine alte
> Seemannskiste sein die genauso leicht geöffnet scheint wie die Tür
> zur Einladung mit den selben Design-Funktionen wie die Tür. Nicht so
> groß wie die, eher wie der Container Schwarzes Loch und Sonne. Die
> Tools sollen leicht zu kopieren sein damit man sie in sein eigenes
> Repo einbauen kann."

Vier-Schichten-Lesart (CLAUDE.md § Pflege 2026-05-27, Schicht 4):

> „Observatorium. Schlüssel-geschützter Forschungs-Ort innerhalb
> Sage-Protokol, zugänglich für Mit-Bauer (Mensch und Agent), zum
> Lesen, Nutzen, Erweitern. **Werkstattraum, nicht Bibliothek
> allein.** Der ‚Schlüssel' ist kein Ticket, sondern eine bezeugte
> Bau-Tat."

Die Einladungs-Site (`docs/einladung/`) hat in Scene 5 den Schlüssel
schon visuell verankert (B2-Bild, Sporen-Layer, Float-Effekt) als
Türöffner zum Observatorium. Die **Truhe ist die logische
Fortsetzung dieser Schlüssel-Symbolik im Sage-Protokol-Hub**: der
gleiche Schlüssel, der die Tür öffnet, öffnet auch die Truhe — und
in der Truhe liegen die Tools, die jeder Mit-Bauer mitnehmen kann.

Klaus' Wortwahl: **„Vorteilspack"** statt „Vorzug" / „Vorab" — die
Truhe ist die Sage-Page-Form des Starter-Bundles (Konzept-Karte
`_starter_bundle.md`, Phase B Schritt 8). Sie macht das Starter-
Bundle **vor** dem externen Repo-Bau sichtbar.

---

## Pflicht-Verifikations-Schritt (vor dem Code-Schreiben)

1. `git fetch origin && git checkout main && git pull origin main`.
   Sicherstellen, dass MR + MM Endknoten-Re-Migration in den
   externen Repos gelaufen ist (Klaus' Reihenfolge: „erst MR+MM,
   dann Truhe").
2. **CLAUDE.md komplett** — Vier-Schichten-Lesart-Pflege 2026-05-27
   (§ Schicht 4 Observatorium) ist die ideelle Grundlage.
3. **`docs/components/_observatoriums_vorteilspack.md`** —
   Konzept-Karte, in dieser Brief-Anlage-Sitzung als Schablone
   angelegt, von der Bau-Sitzung voll zu füllen.
4. **`docs/components/_starter_bundle.md`** — Beziehung klären: die
   Truhe ist die **Sage-Page-Sichtbarkeit** des Starter-Bundles.
   Beide enthalten dieselben Module. Truhe = „klick + copy"; Starter-
   Bundle = „git clone" (Phase B Schritt 8).
5. **`docs/einladung/index.html` Scene 5** (Z. 1014–1035): Schlüssel-
   Optik (B2-Bild `vendor/img/scene-5-key.webp`, `.key-host`-Layout,
   `key-canvas` mit Sporen-Layer). Tür-Mechanik aus Scene 5b
   (`scene-doorway`, Z. 1046–1051) als Klick-Animations-Vorlage.
6. **`index.html` § Schwarz-Loch-Karte** (Z. 506–540 `.blackhole-
   card` / `.blackhole-stage`): **Container-Größen-Referenz** mit
   `grid-template-columns: minmax(220px, 320px) 1fr` — Klaus' Wort:
   „nicht so groß wie die Tür, eher wie der Container Schwarzes Loch
   und Sonne". Die `.sun-scene` (Z. 436) hat `max-width: 280px` als
   Vergleichsanker.
7. **Alle Modul-Karten** (`docs/components/0N_*.md` + `1N_*.md`)
   für die Inhalts-Datenbank (Zweck, Abhängigkeiten, Einbau-Reihen-
   folge pro Tool).

---

## Pflicht-Disziplin (verbindlich)

- **KEIN Eingriff in `src/modules/`.** Die Truhe rendert Module per
  Kopier-Knopf, sie verändert KEINE Modul-Datei.
- **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.** Truhe ist Render-Schicht analog Modul 17.
- **KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag.** Truhe ist Wartungs-/
  Distributions-Schicht, kein Sicherheits-Modul.
- **KEIN Endknoten-Eingriff.** Truhe lebt ausschließlich in der
  Sage-Page.
- **KEIN Modul-19-Bau in dieser Sitzung.** Modul 19 Andock-Wizard
  (Phase B Schritt 7) ist eigene Sitzung. Truhe kann das **Tool-
  Tile** für Modul 19 schon vorbereiten (als „Tool kommt — siehe
  Karte 19"-Platzhalter), aber NICHT bauen.
- **KEINE Tafel-Umsortierung CLAUDE.md** (Pipeline-Tabelle bleibt;
  Truhe wird in den Vision-Anker-Vorbereitung-Block eingetragen,
  nicht in die Phase-A/B-Reihenfolge).
- **KEIN automatischer Andock-Trigger** aus der Truhe heraus.
  Tools sind reine Code-Anker, keine Live-Module.

---

## Deine Aufgabe — Truhe + Vorteilspack-Architektur

### 1. Sage-Page-Karte „Observatoriums-Vorteilspack"

Neue Karte zwischen Karte 13 (Eigenschutz) und Karte 14 (Mycel) ODER
nach Karte 14 (je nach scroll-Reihenfolge — die Bau-Sitzung
entscheidet). Anchor-ID `#observatorium-vorteilspack`. Eyebrow:
**„Schicht 4 · Observatoriums-Vorteilspack"**. H2: **„Eine Truhe
voll Werkzeug."** (oder Klaus-Wahl).

Layout: zweispaltig (analog `.blackhole-stage` mit `grid-template-
columns: minmax(220px, 320px) 1fr`):

- **Links:** Truhe-Stage (280 px breit, Aspekt 5:4). Truhe-CSS-
  Holz-Optik + Schlüssel davor. Klick auf Schlüssel öffnet.
- **Rechts:** Caption mit zwei Sätzen Beschreibung + drei Tier-
  Anker (Must-have / Basic / Pro) als Pillen-Links zum Modal-Pfad.

### 2. Optik — Truhe + Schlüssel-Schritt (Klaus' Wahl 2026-05-28)

Geschlossene Truhe:

```
┌────────────────────┐
│  ╔══════════════╗  │  ← Deckel (Holz-Optik, Messing-Beschläge)
│  ║              ║  │
│  ║   ╔══════╗   ║  │  ← Schloss (Messing)
│  ╚══════════════╝  │
│  ║              ║  │  ← Truhen-Körper (dunkles Holz)
│  ║    [≡≡≡]     ║  │  ← Bänder
│  ║              ║  │
│  ╚══════════════╝  │
│         🗝️         │  ← Schlüssel davor (B2-Bild oder SVG)
└────────────────────┘
```

CSS-Stack-Vorschlag:
- Truhen-Körper: `radial-gradient` Holz-Maserung + `box-shadow` für
  3D-Wölbung + `border-radius: 12px 12px 6px 6px`.
- Deckel: separater Layer mit `transform-origin: bottom` für die
  Klick-Animation (Deckel kippt nach hinten auf).
- Messing-Beschläge: `linear-gradient` Gold-Töne, `box-shadow inset`
  für Tiefe.
- Schlüssel: identisch zur Einladungs-Scene-5 (`vendor/img/scene-5-
  key.webp` als Asset wiederverwenden ODER kleinere CSS-Version).

Klick-Mechanik (analog Einladungs-Tür, Scene 5b):

1. **Phase 1** (initial): Truhe geschlossen, Schlüssel davor, leicht
   schwebend (Float-Animation aus Einladung). Cursor wird Pointer
   beim Hover.
2. **Phase 2** (Klick auf Schlüssel): Schlüssel rotiert + bewegt
   sich zum Schloss (analog Scene-5-key-rotation). 600–800 ms.
3. **Phase 3** (Schloss-Klick): Deckel kippt langsam auf
   (`transform: rotateX(-95deg)`, 800 ms `cubic-bezier(0.25, 1, 0.5,
   1)`). Goldlicht-Glow von innen.
4. **Phase 4** (offen): Tool-Grid sichtbar im Inneren der Truhe.
   Wenn Truhe geschlossen war + jetzt offen: Grid fadet hoch (400 ms).

**Reduced-motion:** keine Animation, Truhe öffnet sofort beim Klick.

### 3. Inhalt der Truhe — Tool-Tiles (Tier-System)

Im Inneren der Truhe: Grid mit Tool-Tiles. Jedes Tile ist eine
**„Verpackung"** im Klaus-Stil — Außen sofort erkennbar, was es ist.

**Tile-Außen-Sicht** (was der User in der Truhe sieht):

```
┌─────────────────────────────────┐
│ ╭─────╮  MUST-HAVE              │  ← Tier-Badge (Farbe pro Tier)
│ │  📦  │  Modul 02 — Spore       │
│ ╰─────╯  Eigene Identität +     │  ← Tool-Icon + Ein-Zeilen-Aufgabe
│          Sporen-Verifikation    │
└─────────────────────────────────┘
```

Tier-Farben:
- **Must-have:** Gold (`#F4B435` aus `--gold`) — ohne diese Tools
  kein SBKIM-Knoten.
- **Basic:** Türkis (`#6EE7D3` aus `--accent`) — Standard-Knoten-
  Funktion.
- **Pro:** Violet (`#8B5CF6` aus `--accent-2`) — erweitert, optional.

**Klick auf Tile öffnet Tool-Detail-Modal** (analog Modul 16
Erklärungs-Modal). Modal-Inhalt pro Tool:

1. **Header:** Tier-Badge + Tool-Name + Modul-Nummer + Status
   (Code-Stub / Fertig / Schablone aus `status.json`).
2. **Was das ist (1 Absatz, ~3 Sätze):** Zweck in einfacher Sprache.
3. **Wie es funktioniert (2–3 Absätze):** Mycel-Bild-Erklärung +
   technischer Kern + Selbstcheck-Zeile.
4. **Wie man es einbaut (Schritt-für-Schritt-Liste):**
   - Schritt 1: Datei kopieren (`src/modules/NN_modul.js` → `sbkim/`)
   - Schritt 2: `<script>`-Tag in `sbkim-init.js` ergänzen
     (Reihenfolge-Hinweis).
   - Schritt 3: `await SbkimXxx.init({…})`-Aufruf mit Pflicht-Feldern.
   - Schritt 4: Test-Modul (smoke-Test) kopieren + laufen.
   - Schritt 5: Panel in `manual_check.html` ergänzen (optional).
5. **Vibe-Coding-Prompt-Paket** (Klaus-Stil 2026-05-28): textueller
   Prompt-Block, den Klaus copy-paste in eine Vibe-Coding-Sitzung
   (Claude-Web, andere KI) eingeben kann, damit die das Tool in
   seinem Repo einbaut. Format-Vorschlag:

   ```
   Du baust SBKIM-Modul <NN> <NAME> in mein Repo ein.

   Quelle: https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/
           src/modules/<NN>_<NAME>.js
   Zielpfad: sbkim/<NN>_<NAME>.js (1:1 kopieren, nicht verändern).

   Andocker-Pflege (sbkim/sbkim-init.js):
   1. <script src="sbkim/<NN>_<NAME>.js"></script> ergänzen NACH/VOR
      Modul <X> (Reihenfolge-Hinweis).
   2. NACH/VOR Sbkim<Y>.init: await Sbkim<Modul>.init({…}) mit
      Pflicht-Feldern: <feldA>, <feldB>, <feldC>.

   Abhängigkeiten: <Modul X (Pflicht)>, <Modul Y (Optional)>.

   Test:
   - Kopiere tests/smoke_<modul>.mjs nach tests/.
   - Lauf: node tests/smoke_<modul>.mjs (erwartet N/N grün).

   Sichttest in tests/manual_check.html: Panel <NN> mit ≥5 Knöpfen
   (Setup + 4 Test-Pfade). Vorlage: Panel <X> aus Sage-Protokol.

   Tabus:
   - KEIN Eingriff in den Modul-Code (1:1 Kopie).
   - KEIN PROTOCOL_VERSION-Bump.
   ```

6. **„Modul-Code in Zwischenablage kopieren"-Knopf** — Clipboard-
   API: kopiert den vollen JS-Modul-Code als Text. Bei Erfolg:
   sichtbare Bestätigung „✓ Kopiert (NNN Zeilen)".
7. **„Vibe-Coding-Prompt kopieren"-Knopf** — Clipboard-API: kopiert
   das Prompt-Paket aus Schritt 5.
8. **Test-Modul-Code-Anker** (wenn vorhanden): Link zu
   `tests/smoke_<modul>.mjs` mit „Test-Code kopieren"-Knopf.
9. **Querverweise:** Link zur Modul-Karte + INTERFACES-Eintrag.

### 4. Tier-Liste (Bau-Sitzung muss sie final entscheiden)

**Vorschlag für die Bau-Sitzung — Klaus kann anpassen:**

#### Must-have (3 Tools) — ohne diese kein SBKIM-Knoten

| # | Modul | Aufgabe (eine Zeile) |
|---|---|---|
| 01 | Storage | IndexedDB-Wrapper für alle Knoten-Daten. |
| 02 | Spore | Eigene Identität + Sporen-Verifikation für Geschwister. |
| 15 | Membran | Außenhülle zur Browser-Umgebung — Fremdzugriff + postMessage. |

#### Basic (7 Tools) — Standard-Knoten-Funktion

| # | Modul | Aufgabe (eine Zeile) |
|---|---|---|
| 03 | Embedding | Text → Vektor (Modul-03 lazy, 384-dim). |
| 04 | Match | Semantischer Match zwischen Sporen + Cross-Knoten-Suche. |
| 05 | Anastomose | Handshake mit Geschwister-Knoten. |
| 07 | Apoptose | TTL-Sweep + Self-Apoptose (Knoten-Ende). |
| 16 | Siegel | Self-inscribing Vertrauens-Bezeugung (Bronze/Gold). |
| 17 | Floating-Widget | Live-Status-Pille (LEBT/VERKEHR/FREMD/SIEGEL). |
| 18 | Tool-PWA Sub (a) Vorab | Andock-Wizard für neue Geschwister. |

#### Pro (8+ Tools) — erweitert, optional

| # | Modul | Aufgabe (eine Zeile) |
|---|---|---|
| 00 | Doku-Fenster | 5-Klick-versteckte Lauf-Zustand-Anzeige. |
| 06 | Heterokaryose | Anker-Tausch zwischen Geschwistern. |
| 08 | UI-Demo | Sage-Page-Werkstatt-UI (Bau-Stand sichtbar). |
| 09 | Einbau-Anleitung | Karte 09 als Anker-Doku (KEIN Modul-Code, eigener Tile-Typ). |
| 10 | Reputation | Schutz-Backlog (Stub). |
| 11 | Rate-Limit | Schutz-Backlog (Stub). |
| 12 | Blocklist | Schutz-Backlog (Stub). |
| 14 | Diffusion | Diffusion-Backlog (Stub). |
| 19 | Andock-Wizard | Kopierbarer Andock-Wizard für Hub (Konzept, Phase B Schritt 7). |

**Tile-Status-Marker** (zusätzliches Mini-Label pro Tile):
- 🟩 Fertig (Modul ist gebaut + Sichttest grün)
- 🟦 Code-Stub (Modul ist gebaut, Sichttest ggf. ausstehend)
- 🟫 Schablone (nur Konzept-Karte, noch kein Code)

Damit sieht Klaus auf einen Blick: was kann ich heute kopieren, was
ist noch Konzept.

### 5. Bauer-Schritte (für die Bau-Sitzung)

1. Konzept-Karte `docs/components/_observatoriums_vorteilspack.md`
   voll füllen (Vokabular, Optik-Spec, Tile-Schema, Tier-Liste,
   Vibe-Coding-Prompt-Vorlage).
2. Neue Sage-Page-Karte in `index.html` mit Truhe-Stage +
   Schlüssel-Layer (Asset-Reuse aus `docs/einladung/vendor/img/`).
3. CSS-Block für Truhe-Optik + Schlüssel-Animation + Modal-System
   (analog Einladungs-Tür-Mechanik).
4. JS-Block (vermutlich Inline-`<script>` in `index.html` analog
   Schwarz-Loch-Karte oder eigenes Mini-Modul) mit:
   - Tool-Datenbank (Hardcoded-Objekt mit ~19 Einträgen, Tier +
     Modul-Nummer + Pfad + Beschreibungs-Texte + Vibe-Coding-Prompt-
     Template).
   - Truhe-Klick-Handler (Schlüssel rotiert → Deckel kippt auf →
     Grid fadet).
   - Tile-Click → Modal-Render mit allen 9 Sektionen pro Tool.
   - Clipboard-API für Code-Kopier-Knöpfe (Code wird zur Bau-Zeit
     aus den Modul-Dateien gelesen ODER zur Laufzeit per `fetch()`
     vom selben GitHub-Pages-Host; entscheidet Bau-Sitzung).
5. Sichttest-Vorlage in `tests/manual_check.html` (Panel
   „Vorteilspack-Truhe") mit Knöpfen 1–N (Truhe-Mount, Schlüssel-
   Klick, Tile-Klick, Modal-Render, Copy-Funktion).
6. CLAUDE.md Vision-Anker-Vorbereitung-Block: neue Zeile
   „Observatoriums-Vorteilspack-Truhe (Sage-Page)" mit Bauzustand
   nach erfolgreicher Sitzung.
7. PULS-Eintrag, Übergabeprotokoll.

### 6. Code-Inhalt-Strategie (offene Spec-Frage)

Wie kommt der Modul-Code in die Truhe?

**Option A — Build-Time-Inline:** Bau-Sitzung schreibt einen
Python/Node-Build-Schritt, der die ~19 JS-Module beim Bau in das
Tool-Datenbank-JSON-Objekt einbettet (z.B. als
`docs/sessions/_vorteilspack_data.json`). Vorteil: Tool-Code direkt
verfügbar, kein Netz-Aufruf. Nachteil: muss bei Modul-Updates
neu gebaut werden; vergrößert die Sage-Page.

**Option B — Runtime-Fetch:** Tile-Klick fetched die Modul-Datei
zur Laufzeit per `fetch("src/modules/NN_modul.js")` vom selben
Sage-Page-Host. Vorteil: immer aktuell, klein. Nachteil: Netz
nötig, KEIN Offline-Pfad.

**Option C — Hybrid:** Tool-Datenbank statisch (Beschreibungen +
Tier + Pfad), Code per Runtime-Fetch on demand.

**Empfehlung Brief:** Option C (Hybrid). Statische Metadaten +
Lazy-Fetch beim Kopier-Klick. So bleibt die Sage-Page klein, der
Code ist immer aktuell, und der Fetch ist nur bei expliziter
User-Geste.

### 7. Klärung: Beziehung zum Starter-Bundle (Phase B Schritt 8)

Die Truhe ist die **Sage-Page-Sichtbarkeit** des Starter-Bundles.
Beide enthalten dieselben Module. Die Truhe ist:

- **Klick-und-Kopier** — User klickt im Browser, kopiert Code in
  Zwischenablage, fügt in Repo ein.
- **Vibe-Coding-fähig** — User kopiert das Prompt-Paket, gibt es
  einer KI-Sitzung, lässt einbauen.
- **Pipeline-Vorzug:** kommt vor Phase B Schritt 8 (Starter-Bundle-
  Repo-Bau), macht den Bundle-Inhalt schon sichtbar.

Das Starter-Bundle (Phase B Schritt 8) bleibt eigene Sitzung:
- **Git-clone-Pfad** — externes Repo `<owner>/sbkim-starter` mit
  allen Modulen + Installer-Script + README.

Beide existieren parallel. Die Truhe ist die einsteigerfreundliche
Form, das Starter-Bundle die Forker-Form.

---

## Pflicht am Sitzungsende (Bau-Sitzung)

- `index.html` mit neuer Karte „Observatoriums-Vorteilspack" +
  Truhe-Stage + Schlüssel-Animation + Tool-Modal-System.
- `docs/components/_observatoriums_vorteilspack.md` voll gefüllt.
- `tests/manual_check.html` mit Panel „Vorteilspack-Truhe".
- CLAUDE.md Vision-Anker-Vorbereitung-Block aktualisiert.
- PULS-Eintrag oben.
- Übergabeprotokoll `docs/sessions/archiv/YYYY-MM-DD_bau-
  observatoriums-vorteilspack.md`.
- Sichttest-Aufruf an Klaus.
- Commit + Push auf `claude/bau-observatoriums-vorteilspack`.
- Draft-PR im Sage-Protokol-Repo.
- „Vorgeschlagene nächste Schritte"-Block in der Chat-Antwort.

---

## Status

| Phase | Datum | Sitzung |
|---|---|---|
| Brief liegt | 2026-05-28 | Plansitzung Observatoriums-Vorteilspack |
| Konzept-Karte angelegt | 2026-05-28 | Plansitzung Observatoriums-Vorteilspack |
| Pipeline-Eintrag in CLAUDE.md | 2026-05-28 | Plansitzung Observatoriums-Vorteilspack |
| Bau läuft | — | folgt — nach MR + MM Re-Migration |
| Sichttest grün | — | folgt |

---

## Querverweise

- Konzept-Karte: `docs/components/_observatoriums_vorteilspack.md`.
- Schwester-Konzept (Distribution): `docs/components/_starter_bundle.md`
  (Phase B Schritt 8).
- Visuelle Vorlage Schlüssel + Tür: `docs/einladung/index.html`
  Scenes 5 + 5b.
- Container-Größen-Vorlage: `index.html` § Schwarz-Loch-Karte
  (`.blackhole-stage` + `.sun-scene` 280 px).
- Vier-Schichten-Lesart: `CLAUDE.md` § Pflege 2026-05-27 Schicht 4.
- Pipeline-Position: CLAUDE.md § Vision-Anker-Vorbereitung
  (zwischen Phase A 5h.1-Folge und Phase B).
