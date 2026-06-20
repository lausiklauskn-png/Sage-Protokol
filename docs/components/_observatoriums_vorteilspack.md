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

## Klaus-Festlegungen 2026-05-29 (Vision-Erweiterung)

Zwei additive Punkte zur Plansitzung 2026-05-28:

6. **Truhe-Bild als gerendertes Asset** (statt reiner CSS-Holz-Optik).
   Die Truhe-Stage wird als `<img>` mit `<picture>`-Fallback gebaut.
   Klaus hat das Bild 2026-05-29 geliefert (1401×1123, Ratio 1.248 ≈
   5:4). **Tafel-Evolution beim Bau 2026-05-29:** das gelieferte Bild
   zeigt die Truhe **bereits halb geöffnet** mit glühendem Inneren —
   ein literaler Deckel-Klapp (`rotateX(-95deg)`) würde gegen das
   Motiv arbeiten. Stattdessen implementiert `.vp-lid-overlay` das
   Overlay-Konzept als **Dim-Veil, der sich beim Öffnen hebt** (Bild
   dunkel/ruhend → Klick → Veil weg + Goldlicht-Glow + Tool-Grid
   fadet auf). Schlüssel-Schweben via `.vp-key-pulse`. Reduced-motion:
   keine Transitions, Grid sofort. Bild-Spec siehe § Truhe-Bild-Asset
   unten. **Konvertierung:** im Bau-Container war kein webp-Werkzeug
   verfügbar → Asset liegt als `assets/observatorium-truhe.png`; das
   `<picture>` bevorzugt eine künftige `.webp` automatisch.
7. **Werkzeug-Symbol pro Modul** (statt generischem 📦-Platzhalter im
   Tile). Jedes Tool bekommt ein gegenständliches Symbol — kein
   abstraktes Icon, sondern etwas, das man in einer alten Werkzeug-
   kiste fände. Selbst-gezeichnete Inline-SVGs, monochrom in Tier-
   Farbe, siehe § Werkzeug-Symbol-Liste unten.

## Werkzeug-Symbol-Liste (Klaus' Vision 2026-05-29)

Jedes Tool-Tile trägt ein **gegenständliches** Werkzeug-Symbol.
Quellen: eine SVG-Datei pro Tool unter
`assets/tool-symbols/NN_modul.svg`. **Selbst-gezeichnet** (keine
externe Icon-Library). Stil: dünne Linien (`stroke-width: 1.5`),
gerundete Kanten (`stroke-linecap/linejoin: round`), keine
Füllflächen, monochrom (`stroke="currentColor"`) — das Tile setzt
per CSS `color` die Tier-Farbe (Gold / Türkis / Violet). Vorbild:
Phosphor-Icons „regular"-Weight, aber eigen gezeichnet.

| # | Modul | Symbol | Bedeutungs-Anker |
|---|---|---|---|
| 00 | Doku-Fenster | Messing-Lupe auf aufgeschlagenem Buch | „5-Klick versteckte Suche" — Suchglas im Mycel-Lexikon |
| 01 | Storage | Bronze-Kapsel mit Kristall-Innen | persistent, versiegelt, aber lesbar |
| 02 | Spore | Samenkapsel mit eingeprägtem Signatur-Stempel | eigene Identität, signiert |
| 03 | Embedding | Sextant + Vektorpfeil | semantische Verortung im Hochdimensions-Raum |
| 04 | Match | alte Apotheker-Waage mit zwei Schalen | wie gut passen zwei Seiten zusammen |
| 05 | Anastomose | verflochtene Hyphen-Wurzeln zu einem Knoten | Verbindung zweier Knoten, Handschlag |
| 06 | Heterokaryose | Doppelschlüssel mit zwei Bärten an einem Schaft | zwei Identitäten in einer Zelle |
| 07 | Apoptose | Sanduhr, aus dem Sand-Glas fallen Blätter | TTL, bewusstes Vergehen |
| 08 | UI-Demo | Marionetten-Holzkreuz mit Fäden | sichtbares Theater des Mycels |
| 09 | Einbau-PWA | Mycel-bewachsener Schraubenschlüssel | Andock-Werkzeug |
| 10 | Reputation | Verdienst-Orden mit Sternen-Krone | Vertrauens-Signal über Zeit |
| 11 | Rate-Limit | Wasserschleuse / Sand-Egge | Durchfluss begrenzt |
| 12 | Blocklist | geschmiedeter Eisen-Riegel mit Vorhängeschloss | manuelle Sperre |
| 14 | Diffusion | konzentrische Wellen-Ringe / Sonar | Empfehlung breitet sich aus |
| 15 | Membran | Wappenschild mit Hyphen-Geflecht | Außenhülle, Schutz |
| 16 | Siegel | Lack-Siegel mit Petschaft (Wappenring) | Selbst-Bezeugung |
| 17 | Floating Widget | schwebende Kristallkugel (Diener-Glas) | Live-Status sichtbar |
| 18 | Tool-PWA | Multitool / Schweizer Taschenmesser | Container-Werkzeug |
| 19 | Andock-Wizard | Zauberstab mit Kompass-Aufsatz | Andocken neuer Geschwister |

**Hinweis Modul 13:** existiert nicht als Modul (die Eigenschutz-
Karte 13 auf der Sage-Page bündelt nur die Schutz-Module 10–12 +
14 visuell). Deshalb **19 Symbole**, nicht 20 — der Brief nennt
„20 Tiles" als Rundung; die maßgebliche Liste ist diese
19-Modul-Tabelle.

**Bauzustand Symbole:** 🟩 alle 19 SVGs gebaut (2026-05-29,
`assets/tool-symbols/`), Vorschau-Kontaktbogen
`assets/tool-symbols/_vorschau.html` (öffnet im Browser, zeigt alle
19 in Tier-Färbung). Klaus' Sicht­test der Symbol-Optik steht aus.

## Truhe-Bild-Asset (Klaus' Vision 2026-05-29)

Die Truhe-Stage rendert ein **gerendertes Bild** (Klaus liefert es
extern), nicht eine CSS-Holz-Optik. Ziel-Pfad
`assets/observatorium-truhe.webp` (+ optional `.png`-Fallback im
`<picture>`).

**Bild-Generator-Prompt (Hauptmotiv):** eine alte Seemanns-Werkzeug-
kiste aus verwittertem Teak/Eiche mit patina-grünen Messing-
beschlägen, Deckel leicht offen, ein schmiedeeiserner Schlüssel
schwebt vor dem Schlüsselloch; leicht schief/asymmetrisch (sturm-
gezeichnet), halb überwachsen von biolumineszentem Mycel in
teal-gold, kleine Konsolen-Pilze in den Holzrissen, ein Tropfen
glühender Bernstein; im Inneren (durch den Spalt) warmes Glühen wie
gebündeltes Sternenlicht + Tool-Silhouetten (Messing-Linse, kleiner
Kettenring, Wachs-Siegel-Stempel); Hintergrund tiefes Navy-Schwarz
mit Nebel-Schleier, schwebt im Raum, kein Boden; cinematic
volumetrisches Seitenlicht von oben-links, Ghibli × Lusion.com,
hyper-detaillierte Materialien, shallow depth-of-field, dezente
chromatische Aberration am Schlüssel, kein Text, isoliertes Motiv
fürs Compositing auf dunklem Seitenhintergrund. `--ar 5:4
--style raw --quality 2 --v 6`.

**Negativ-Hinweise (Klaus 2026-05-29):** kein modernes Plastik,
kein Cartoon-Shading, kein Schatztruhen-Klischee (keine über-
quellenden Goldmünzen), kein Piraten-Totenkopf, keine Disney-
Ästhetik, keine sichtbaren menschlichen Hände.

**Alternativ-Variationen (falls die erste Generierung nicht trifft):**
- statt „sea-captain's chest" → „alchemist's apothecary chest"
  (schmaler-hochkant, kleine sichtbare Schubladen).
- statt „bracket mushrooms" → „carved bone inlays of forest
  creatures" (skurriler, weniger biologisch).
- statt „bioluminescent mycelium" → „glowing copper-wire root
  system" (industriell-mystischer).

**Bauzustand Bild:** 🟫 Bild fehlt noch im Repo (Stand 2026-05-29).
Asset ist Klaus' externe Lieferung. Die Bau-Sitzung baut die Karte
erst, wenn `assets/observatorium-truhe.webp` vorliegt — bis dahin
STOP-Gate (siehe Brief § Pflicht-Verifikations-Schritt 4).

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
- ✅ **Entschieden 2026-05-29:** Truhe als **gerendertes Bild**
  (`assets/observatorium-truhe.webp`, `<picture>`/`<img>`), Deckel
  als CSS-Overlay — NICHT rein-CSS-Holz. Siehe § Truhe-Bild-Asset.
- Asset-Reuse der Einladungs-Schlüssel-WebP oder eigene SVG-/CSS-
  Variante (Schlüssel-Layer)?
- Animation-Performance auf Galaxy Tab S6 (Klaus' Hauptgerät)
  testen.

### Sub (b) — Tool-Tile-Grid (offene Truhe)

- Grid-Layout im Inneren der geöffneten Truhe (3 Spalten Desktop,
  2 Spalten Tablet, 1 Spalte Mobile).
- Jedes Tile mit Tier-Badge + Icon + Name + Aufgabe + Status-
  Marker (Außen-Sicht).
- Hover-/Tap-State: Tile hebt sich leicht (box-shadow + transform).

**Offene Spec-Punkte:**
- ✅ **Entschieden 2026-05-29:** eigene **selbst-gezeichnete SVG-
  Icons** (`assets/tool-symbols/NN_modul.svg`), monochrom in Tier-
  Farbe — kein Emoji-Set. Siehe § Werkzeug-Symbol-Liste.
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
| Werkzeug-Symbole gebaut | 2026-05-29 | Bau Observatoriums-Vorteilspack (Symbol-Teil) | 19 selbst-gezeichnete SVGs in `assets/tool-symbols/`, Vorschau-Kontaktbogen `_vorschau.html`. Klaus' Symbol-Vision 2026-05-29. Optik-Sichttest steht aus. |
| Truhe-Bild geliefert + eingebunden | 2026-05-29 | Bau Observatoriums-Vorteilspack | Klaus' Bild `assets/observatorium-truhe.png` (1401×1123), als `<picture>` (webp-bevorzugt) eingebunden. |
| Spec gefüllt | 2026-05-29 | Bau Observatoriums-Vorteilspack | Tier-Liste (3/7/9), Optik-Spec (Veil-Adaptation), Modal-Form (9 Sektionen), Tool-Datenbank-Quelle (statische Metadaten + Lazy-fetch Code, Hybrid). |
| Code geschrieben | 2026-05-29 | Bau Observatoriums-Vorteilspack | `docs/observatorium/vorteilspack.js` (Tool-DB 19 Einträge + Symbole + Grid-Render + 9-Sektionen-Modal + Clipboard mit Fallback). CSS inline in `index.html`. Smoke `tests/smoke_observatorium_truhe.mjs` 19/19. |
| In Sage-Page eingebaut | 2026-05-29 | Bau Observatoriums-Vorteilspack | Neue Karte nach der Browser-Observatorium-Karte (beide Schicht 4), Anchor `#observatorium-vorteilspack`. |
| Tür-FX + Karten-Reihenfolge | 2026-05-29 | Pflege Truhe-Tür-FX | Klaus-Wunsch 2026-05-29: Truhe wie die Einladungs-Tür — Feenstaub-Canvas folgt der Maus (teal-gold), Goldlicht-Glow wird heller je näher die Maus am geöffneten Deckel ist, Klick-Flash; Bild als Hintergrund-Layer (`.vp-truhe-img`, wie `.einladung-door`). Schwarz-Loch-Karte ans Karten-Ende verschoben, Truhe davor. |
| Zweite Seite (Werkzeug-Screen) | 2026-05-29 | Pflege Truhe-Eingang | Klaus-Wunsch 2026-05-29: Klick auf die Truhe ist der **Eingang in die Truhe** — öffnet einen eigenen Screen `#screen-vorteilspack` (analog Tür→Einladung, Loch→Observatorium) via `goScreen('vorteilspack')`, statt inline-Grid darunter. Tool-Grid + Tier-Pillen + Bild-Hero (`.vp-screen-hero`) leben jetzt im Screen; die Übersichts-Karte ist nur noch der Eingang (Bild + Caption + FX). |
| Sichttest grün | — | Sichttest-Nachzug | **offen** — Klaus' Browser-Sichttest am Galaxy Tab S6 (Truhe sichtbar → Maus drüber: Feenstaub + Licht heller am Deckel → klicken → Grid mit 19 Tiles darunter → Tile-Klick → Modal + Copy). |
| Komplett-Werkzeuge + Download + Filter | 2026-06-20 | Pflege Vorteilspack-Komplett-Werkzeuge | Klaus-Wunsch 2026-06-20: alle Werkzeuge sollen nutzbar + herunterladbar sein. Zwei fertige Ein-Datei-PWAs (`docs/observatorium/tools/andock.html` + `mycelknoten.html`, BLP-Branding entfernt → generisch, Siegel-Band leer) als neuer Tier **`komplett`** in die Truhe. Neuer **Download-Knopf** im Modal (alle Tools mit Code). Neue Filter-Pille **„Werkzeuge (alle)"** (Default) + **„Komplett-Werkzeug"** neben Must-have/Basic/Pro. Smoke `tests/smoke_observatorium_truhe.mjs` auf 22 Tools nachgezogen (NETZ-Eintrag war zuvor nicht im Test berücksichtigt). **Klaus' Browser-Sichttest steht aus.** |

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
