# Observatoriums-Vorteilspack — Truhe in Schicht 4

> **Status:** 🟫 Schablone (2026-05-28, Plansitzung Observatoriums-
> Vorteilspack) · **Schicht:** Vision-Anker Schicht 4 (Observatorium —
> Werkstattraum, nicht Bibliothek allein) · **Priorität:** mittel —
> nach Phase A 5h.1-Folge (MR + MM Re-Migration), parallel zu Phase B
> Schritt 7 (Modul 19 Andock-Wizard).
> **Datei (Code):** noch keine. Bau-Sitzung legt
> Truhe-Stage + Tool-Modal-System in `index.html` an (eigene Karte,
> keine eigene src/modules/-Datei — Render-Schicht analog Schwarz-
> Loch-Karte).

---

## Im Mycel-Bild

Wer durch die Einladungs-Tür ins Observatorium gegangen ist (Scene 5
+ 5b der Einladungs-Site), findet dort einen **Werkstattraum**. Auf
einer der Bänke steht eine **alte Seemannskiste** — die
Vorteilspack-Truhe. Der gleiche Schlüssel, der die Tür öffnete,
öffnet auch sie. Drinnen liegen alle Tools, die ein neuer Mit-Bauer
braucht, um sein eigenes Mycel-Repo zu schreiben: jedes Tool in
eigener „Verpackung", außen mit klarem Etikett (Aufgabe + Stufe),
innen mit voll-Inhalt (Beschreibung, Einbau-Schritte, Code,
Vibe-Coding-Prompt). Klick aufs Etikett öffnet das Paket. Knopf
„kopieren" legt den Inhalt in die Zwischenablage. Wer kein Code
selbst tippen will, kopiert stattdessen das **Vibe-Coding-Prompt-
Paket** und gibt es einer KI-Sitzung — die baut dann das Tool im
eigenen Repo ein.

## Vokabular

- **Vorteilspack** — Klaus' Wort für die Truhen-Sammlung (statt
  „Vorzug" / „Vorab"). Ergänzt das Starter-Bundle: Truhe = klick
  + kopieren auf der Sage-Page; Starter-Bundle = git clone auf
  externem Repo (Phase B Schritt 8).
- **Truhe-Stage** — der visuelle Container auf der Sage-Page-Karte
  „Observatoriums-Vorteilspack". Holz-Optik + Messing-Beschläge +
  Schlüssel davor. Klick auf Schlüssel → Schlüssel rotiert + bewegt
  sich zum Schloss → Deckel kippt nach hinten auf → Tool-Grid
  sichtbar.
- **Tool-Tile** — eine einzelne „Verpackung" innerhalb der offenen
  Truhe. Außen: Tier-Badge (Must-have / Basic / Pro) + Icon + Tool-
  Name + Ein-Zeilen-Aufgabe + Status-Marker (🟩/🟦/🟫).
- **Tool-Modal** — Detail-Ansicht nach Klick auf ein Tile. Modal
  in `document.body` (analog Modul 16 Erklärungs-Modal) mit neun
  Sektionen pro Tool (siehe Brief § 3).
- **Tier-System** — drei Stufen: Must-have / Basic / Pro. Färbung
  Gold / Türkis / Violet. Bau-Sitzung entscheidet finale Zuordnung
  (Vorschlag im Brief).
- **Vibe-Coding-Prompt-Paket** — fertiger Text-Block, den der User
  in eine KI-Sitzung kopiert. Enthält Quellpfad, Zielpfad, Andocker-
  Pflege, Abhängigkeiten, Test-Modul-Hinweis, Tabus. Macht den
  Einbau ohne eigene Code-Arbeit möglich.
- **Status-Marker** — Mini-Label pro Tile (🟩 Fertig / 🟦 Code-Stub
  / 🟫 Schablone). Aus `status.json` live gespiegelt oder
  hardcoded pro Bau-Sitzung-Stand.

## Klaus-Festlegungen 2026-05-28

1. **Optik:** Truhe + Schlüssel-Schritt. Klick auf Schlüssel öffnet,
   analog Einladungs-Tür-Mechanik (Scene 5b). NICHT die größere
   Stage der Einladungs-Tür, eher 280–320 px Container-Größe wie
   `.blackhole-stage` oder `.sun-scene`.
2. **Tools:** alle SBKIM-Tools (Module 00–19, soweit gebaut /
   geschablont). Außen-Verpackung muss die Aufgabe sofort
   erkennbar machen.
3. **Tier-Unterteilung:** drei Stufen — Must-have (= absolut
   notwendig), Basic, Pro. Bau-Sitzung entscheidet finale
   Tier-Zuordnung. Klaus-Wortwahl 2026-05-28: „Mast have" = Tippfehler
   für Must-have, synonym mit „absolut notwendig".
4. **Vibe-Coding-fähig:** pro Tool ein fertiges Prompt-Paket, das
   Klaus copy-paste in eine KI-Sitzung (Claude-Web, Vibe-Coding-
   Pfad) eingeben kann. Die KI baut dann das Tool in das jeweilige
   Repo ein.
5. **Pipeline-Position:** NACH MR + MM Re-Migration, in eigener
   Bau-Sitzung. NICHT als Pipeline-Schritt-Umordnung, sondern als
   Vision-Anker-Vorbereitung (Pipeline-Phase-frei).

## Sub-Bereiche (Spec-Skizze)

Diese Liste ist eine Schablone — die volle Bau-Sitzung füllt sie.

### Sub (a) — Truhe-Stage (visueller Container)

- Holz-Optik via CSS (radial-gradient Maserung + box-shadow für 3D-
  Wölbung + Messing-Beschläge via linear-gradient).
- Schlüssel davor (Asset-Reuse aus
  `docs/einladung/vendor/img/scene-5-key.webp` ODER eigene CSS-
  Variante).
- Klick-Mechanik in vier Phasen (siehe Brief § 2 Optik-Block).
- Reduced-motion: keine Animation, direkter Öffnungs-Pfad.

**Offene Spec-Punkte (Bau-Sitzung):**
- Asset-Reuse der Einladungs-Schlüssel-WebP oder eigene SVG-/CSS-
  Variante?
- Truhe als rein-CSS-Build oder mit SVG-Illustration?
- Animation-Performance auf Galaxy Tab S6 (Klaus' Hauptgerät)
  testen.

### Sub (b) — Tool-Tile-Grid (offene Truhe)

- Grid-Layout im Inneren der geöffneten Truhe (3 Spalten Desktop,
  2 Spalten Tablet, 1 Spalte Mobile).
- Jedes Tile mit Tier-Badge + Icon + Name + Aufgabe + Status-
  Marker (Außen-Sicht).
- Hover-/Tap-State: Tile hebt sich leicht (box-shadow + transform).

**Offene Spec-Punkte:**
- Icons pro Tool — Emoji-Set oder eigene SVG-Icons?
- Tiles sortiert nach Tier (Must-have zuerst) oder nach Modul-
  Nummer?
- Filter-Knöpfe oben („Nur Must-have", „Nur fertige Tools")?

### Sub (c) — Tool-Modal (Detail-Ansicht)

Modal in `document.body` analog Modul 16 Erklärungs-Modal mit
neun Sektionen pro Tool (siehe Brief § 3):

1. Header (Tier + Name + Status).
2. Was das ist.
3. Wie es funktioniert.
4. Wie man es einbaut (Schritt-für-Schritt).
5. Vibe-Coding-Prompt-Paket.
6. Modul-Code-Kopier-Knopf.
7. Vibe-Coding-Prompt-Kopier-Knopf.
8. Test-Modul-Code-Anker (wenn vorhanden).
9. Querverweise.

**Offene Spec-Punkte:**
- Markdown-Render im Modal (für Modul-Beschreibungen)? Library oder
  reines `textContent`?
- Modal scrollbar (Modal-Höhe begrenzen auf 86vh, Inhalt scrollt)
  oder Akkordeon (Sektionen einklappbar)?

### Sub (d) — Tool-Datenbank (Inhalts-Quelle)

JSON-Objekt mit allen Tool-Metadaten. Hardcoded zur Bau-Zeit ODER
generiert aus `status.json` + Modul-Karten beim Page-Load.

**Offene Spec-Punkte:**
- Build-Time-JSON (statisch in `docs/observatorium/vorteilspack.json`
  generiert) oder Runtime-Aggregation aus `status.json`?
- Modul-Code-Lieferung: Inline im JSON ODER lazy-fetch beim Kopier-
  Klick?
- Empfehlung Brief: **Hybrid** — statische Metadaten + lazy-fetch
  von `src/modules/NN_modul.js` per `fetch()` beim Kopier-Klick
  (Option C im Brief).

### Sub (e) — Clipboard-API + UI-Bestätigung

- `navigator.clipboard.writeText(code)` für Modul-Code-Kopier.
- Bestätigung sichtbar: „✓ Kopiert (NNN Zeilen)" als Toast im
  Modal.
- Fallback bei fehlender Clipboard-API: Textarea-Selektion +
  `execCommand("copy")` ODER „Code unten markieren und kopieren"-
  Hinweis.

**Offene Spec-Punkte:**
- Toast-Dauer (3 s? 5 s?).
- Toast-Position (Modal-Footer? Modal-Header? Tile-Tile?).

### Sub (f) — Vibe-Coding-Prompt-Generator

Pro Tool ein Template-Prompt. Template-Variablen:

- `<NN>` — Modul-Nummer.
- `<NAME>` — Modul-Name.
- `<feldA>, <feldB>, …` — Pflicht-Init-Felder (aus INTERFACES § 1).
- `<X>, <Y>` — Andocker-Reihenfolge-Anker (aus Karte 09 + jeweiliger
  Modul-Karte).
- `<smoke_test_path>` — Pfad zum Smoke-Test.

Template (Skelett — Bau-Sitzung pflegt pro Tool):

```
Du baust SBKIM-Modul <NN> <NAME> in mein Repo ein.

Quelle: https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/
        src/modules/<NN>_<NAME>.js
Zielpfad: sbkim/<NN>_<NAME>.js (1:1 kopieren, nicht verändern).

Andocker-Pflege (sbkim/sbkim-init.js):
1. <script src="sbkim/<NN>_<NAME>.js"></script> ergänzen NACH <X>
   und VOR <Y> (Reihenfolge-Hinweis).
2. await Sbkim<MODUL>.init({...}) mit Pflicht-Feldern:
   <feldA>, <feldB>, <feldC>.

Abhängigkeiten: <Modul-Liste mit Pflicht/Optional-Marker>.

Test:
- Kopiere <smoke_test_path> nach tests/.
- Lauf: node <smoke_test_path> (erwartet N/N grün).

Sichttest in tests/manual_check.html: Panel <NN> mit ≥5 Knöpfen
(Setup + Test-Pfade). Vorlage: Panel <X> aus Sage-Protokol.

Tabus:
- KEIN Eingriff in den Modul-Code (1:1 Kopie).
- KEIN PROTOCOL_VERSION-Bump.
```

**Offene Spec-Punkte:**
- Sprache des Prompts: deutsch (analog CLAUDE.md) ODER englisch?
- Klaus' Konvention: deutsche Spec, englischer Code → Prompt
  vermutlich deutsch.
- Pflicht-Felder pro Modul: muss die Bau-Sitzung pro Tool aus
  INTERFACES § 1 extrahieren.

## Modal-Form (Spec-Vorbereitung)

Skizze: ein voll-Bildschirm-overlay (`min(720px × 86vh, viewport)`)
mit Tab-frei (alle Sektionen in einem Scroll-Container, da fast
keine Aktion außerhalb der Lese-Pflicht). Schluss-Knopf rechts oben
+ ESC + Backdrop-Klick schließen.

**Spec-Punkte:**
- Soll das Modal die SBKIM-Page-Variablen wiederverwenden (`var(--
  bg-2)` etc.) oder eigene Variablen haben?
- Animation beim Öffnen (Fade-In, Slide-Up, Zoom-Out)?

## Schnittstelle (Spec-Skizze)

Truhe lebt als Sage-Page-Karte (Inline-JS analog Schwarz-Loch-Karte).
Falls eigenständiges Mini-Modul nötig:

```js
window.SbkimVorteilspack = {
  init: function () { /* mountet Truhe + Modal-Container */ },
  open: function (toolId?) { /* öffnet Truhe + optional Tile-Modal */ },
  close: function () { /* schließt Modal */ },
  copyToolCode: function (toolId) { /* Clipboard-API */ },
  copyVibePrompt: function (toolId) { /* Clipboard-API */ },
  _meta: { /* Read-Anker */ },
};
```

Bau-Sitzung entscheidet, ob die Truhe ein eigenes Modul-Skript braucht
(`docs/observatorium/vorteilspack.js`) oder Inline in `index.html`.
Empfehlung Brief: **eigenes Mini-Modul** in
`docs/observatorium/vorteilspack.js` (Konvention analog
`docs/einladung/`), damit der Code übersichtlich bleibt.

## Strikte Tabus (Spec-Vorbereitung)

- **KEIN Eingriff in `src/modules/`.** Truhe rendert Tools, sie
  verändert keine Modul-Datei.
- **KEINE Code-Modifikation.** Vibe-Coding-Prompt sagt explizit
  „1:1 kopieren, nicht verändern".
- **KEIN Auto-Andock-Trigger.** Truhe zeigt Tools, sie installiert
  sie nicht selbst. User muss aktiv kopieren + einbauen.
- **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.**
- **KEIN ZERTIFIKAT_ASPEKTE-Eintrag** (Truhe ist Distributions-/
  Render-Schicht, kein Sicherheits-Modul).
- **KEIN Live-Modul-Aktivieren auf der Sage-Page.** Sage-Page bleibt
  ihrem eigenen Modul-Set treu (Modul 00–08, 15, 16, 18 schon
  geladen; Modul 17 hat eigene Sage-Page-Spezial-Doku, siehe CLAUDE.md
  § Pipeline-Reihenfolge). Truhe ist Doku-/Distributions-Schicht,
  keine Sage-Page-Modul-Erweiterung.

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Konzept-Karte angelegt | 2026-05-28 | Plansitzung Observatoriums-Vorteilspack | Brief: `docs/sessions/BRIEF_BAU_OBSERVATORIUMS_VORTEILSPACK.md`. Klaus' Vision 2026-05-28 nach grünem Sichttest Bau 18 Sub (a) Vorab. Konzept-Karte als Schablone für die Bau-Sitzung; Bau läuft NACH MR + MM Re-Migration. |
| Spec gefüllt | — | Bau-Sitzung Observatoriums-Vorteilspack | folgt — Tier-Liste final, Optik-Spec, Modal-Form, Tool-Datenbank-Quelle. |
| Code geschrieben | — | Bau-Sitzung Observatoriums-Vorteilspack | folgt — Truhe-Stage in `index.html` + Inline-JS oder `docs/observatorium/vorteilspack.js` + Tool-Modal-System + Clipboard-API. |
| In Sage-Page eingebaut | — | Bau-Sitzung Observatoriums-Vorteilspack | folgt — neue Karte zwischen 13 + 14 ODER nach 14, Anchor `#observatorium-vorteilspack`. |
| Sichttest grün | — | Sichttest-Nachzug | folgt — Klaus' Browser-Sichttest am Galaxy Tab S6. |

---

**Querverweise**

- **Brief:** `docs/sessions/BRIEF_BAU_OBSERVATORIUMS_VORTEILSPACK.md`.
- **Schwester-Konzept (Distribution):**
  `docs/components/_starter_bundle.md` (Phase B Schritt 8 — externes
  Repo `<owner>/sbkim-starter`).
- **Visuelle Vorlage Schlüssel + Tür:** `docs/einladung/index.html`
  Scenes 5 + 5b.
- **Container-Größen-Vorlage:** `index.html` § Schwarz-Loch-Karte
  (`.blackhole-stage` 220–320 px) + § Sonnen-Karte (`.sun-scene`
  max 280 px).
- **Vier-Schichten-Lesart:** `CLAUDE.md` § Pflege 2026-05-27
  Schicht 4 Observatorium.
- **Pipeline-Position:** Vision-Anker-Vorbereitung (Pipeline-Phase-
  frei), zwischen Phase A 5h.1-Folge und Phase B Schritt 7.
- **Modul-Karten** (als Tool-Inhalts-Quelle für die Tier-Liste):
  `docs/components/00_doku_fenster.md` … `docs/components/19_andock_wizard.md`.
