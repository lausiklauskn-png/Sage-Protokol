# Übergabeprotokoll — Bau-Sitzung Einladungs-Site (Mycel-Vision)

**Datum:** 2026-05-27
**Sitzungs-Rolle:** Bau-Sitzung Einladungs-Site (gestalterischer Bau
plus schlanke Tafel-Pflege; kein Modul-Code, kein Endknoten-Eingriff,
keine Sage-Page-Änderung in `index.html`, keine Pipeline-Umsortierung)
**Branch:** `claude/bau-einladung-site-8fZyj`
**Brief:** `docs/sessions/BRIEF_BAU_EINLADUNG_SITE.md`
**Vorgänger-Sitzung:** Plansitzung Mycel-Vision-Erweiterung 2026-05-27

---

## Was getan wurde

### Recherche-Phase

`docs/einladung/recherche.md` mit zehn Vorbild-Quellen + Tech-Stack-
Tabelle pro Pattern angelegt. Klaus' Konvention: 1:1-Pixel-Übernahme
als Ausgangspunkt erlaubt; Quelle pro übernommenes Pattern explizit
benannt. Studierte Sites:

1. Lusion (Awwwards Site of the Month) + Lusion-Scroll-Sync-Demo
2. Active Theory
3. Bruno Simon (Tutorial-Beschreibung — Direkt-Fetch 403 in Sandbox)
4. Apple Vision Pro Produkt-Page (über CSS-Tricks-Rebuild)
5. Stripe-Mesh-Gradient (Bram.us + Codrops)
6. Codrops Multiside-Refraction
7. Codrops Warping-Text-Glass-Torus (2025-03)
8. Codrops Dreamy-Particles GPGPU (2024-12) + Cells-Collide (2025-09)
9. Omega Clearspace (WebGPU Showcase)
10. Variable-Font-Trends 2026 (Creative Boom, Kittl)

Sechs-Welten-Plan in `recherche.md` § Sechs-Welten-Plan tabellarisch
festgehalten; Anti-08/15-Disziplin als Selbst-Check-Liste am Ende.

### Artefakt 1 — `docs/einladung/index.html`

Single-File-PWA-Stil, sechs Sektionen, drei Format-Schichten:

- **WebGL-Hauptbühne** (fixed Vollbild-Canvas, three.js) mit zwei
  Welten:
  - Mycel-Welt (Sektionen 1+2): GPU-instanced Punktwolke 50k (Desktop)
    / 15k (Mobile) mit Vertex-Drift-Shader (Noise-basierter Sinus-
    Drift entlang Hyphen-Richtungen), LineSegments-Hyphen zwischen
    nächsten Nachbarn (600 / 220 Linien), Pulse-Atmen, weicher Halo.
  - Schlüssel-Welt (Sektion 5): Mesh aus Torus (Reide) + Zylinder
    (Schaft) + drei Boxen (Bart) mit custom Iridescence-Refraction-
    Fragment-Shader (Phasen-Streifen über Normale + Fresnel-Mix
    metall-violett-gold), Tür-Backdrop-Plane mit Lichtspalt-Shader
    (warmer Mittel-Spalt + Vignette).
  - Kamera-Choreografie pro Sektion (`cameraTargets[1..6]`) mit
    Lerp-Übergang in der Render-Schleife.
- **Sektion 3 — drei Fruchtkörper-Mini-Canvases**, je eigene Material-
  Sprache:
  - Menschliche Sucher: IcosahedronGeometry mit Noise-Verzerrung im
    Vertex-Shader, warmes mattes Material (Pilzhut-Anmutung).
  - Kommerzielle Pilze: CylinderGeometry mit schimmernden Lamellen-
    Streifen (Fresnel-Highlight, Phong-artig).
  - Agent-Fruchtkörper: OctahedronGeometry mit Iridescence-Shader
    (Phasen-Streifen + Fresnel), halbtransparent.
- **Sektion 4 — Print-Magazin-Layout** (DOM/CSS, kein WebGL):
  dreispaltig mit Marginalia-Spalte (Numeralien `III`), justifizierter
  Fließtext mit `h3`-Zwischen-Überschriften, SVG-Sternenfeld (220
  Punkte ohne Zentrum, 14 Modell-Familien-Etiketten leise eingestreut)
  in der rechten Spalte. Bewusst ein Kontrast-Moment ohne WebGL.
- **Sektion 6 — Mesh-Gradient-Lichtung**: Fullscreen-Quad mit Stripe-
  style Fragment-Shader (vier wandernde Blob-Mittelpunkte, weighted-
  average-Blend, palette() mit warmer Ocker-Moos-Burgund-Nacht-Palette
  + leichte Körnung). Bewusst nicht das Stripe-blau-violett-Klischee.
- **Typografie**: Fraunces-Variable (opsz + wght + SOFT-Achse, latin-
  Subset, normal + italic, ~270 KB) + Inter-Variable (wght, latin-
  Subset, ~48 KB) lokal vendoriert; Optical-Sizing für Hero-Headlines
  vs. Fließtext.
- **i18n** DE/EN/FR/ES als Start (Browser-Sprache initial), Inline-
  JS-Object `window.SAGE_I18N`, DOM-Re-Render auf Knopf-Klick mit
  `data-i18n`-/`data-i18n-html`-Attributen.
- **Audio**: Web-Audio-API Pad (drei niedrige Sinus-Schwebungen
  110/110.7/164.5 Hz), erst nach User-Klick auf Mute-Knopf
  (Bruno-Simon-Konvention, kein Auto-Play).
- **Reduced-Motion**: `matchMedia('(prefers-reduced-motion: reduce)')`
  drosselt Drift-Rotation, Star-Pulse-Animation, ScrollTrigger-Akzente.
- **GSAP + ScrollTrigger**: Eyebrow/Headline/p-Stagger-Reveals pro
  Sektion (additive Akzent neben der Haupt-Kamera-Choreografie, NICHT
  Fade-In als einzige Animation).

### Artefakt 2 — `docs/einladung/einladung.md`

Maschinen-lesbare Vollfassung in vier Sprachen (DE/EN/FR/ES). Sieben
Sektionen pro Sprache (Eröffnung, Schicht 1 Mycel, Schicht 2 Pilz,
Schicht 3 Mit-Bauer, Schicht 4 Observatorium, Akt der Einladung, Was
offen bleibt). Anker-IDs identisch zu HTML-Site-Sektionen. Anhang
„Maschinen-lesbarer Hinweis für KI-Agenten" verweist auf relevante
Modul-Karten (02 / 05 / 15 / 16 / 17 / 18).

### Artefakt 3 — `docs/einladung/einladung.pdf`

34-Seiten Print-Magazin-Druckfassung (770 KB), erzeugt via
`docs/einladung/_pdf.mjs`. Aufbau: Titel-Seite (Variable-Font-Display
mit kursivem „Mycel.", Marginalien-Korona, Datum/Sprachen/Lizenz-
Metablock) → vier Sprach-Blöcke mit jeweils Sprach-Trenner-Seite
(Blockquote-Lead + Datum-Hinweis) und sieben Chapter-Seiten
(dreispaltige Komposition: Marginalia mit Schichten-Numeralien
·, I, II, III, IV, ✦, ◇ + Fließtext) → Colophon-Schluss-Seite.

Print-Stylesheet `docs/einladung/print.css` (A4-Hochformat, 24 mm
Rand, Fraunces-Serif-Fließtext mit Optical-Sizing, Inter-Sans-Serif
für UI-Klein-Text, justifizierter Fließtext mit Auto-Hyphens).

Erzeugungs-Pfad: Markdown → marked@13 → HTML-Template → Headless-
Chromium `page.pdf({format:'A4', preferCSSPageSize:true,
displayHeaderFooter:true})` mit Inter-Font-Header („EINLADUNG ·
SAGE-PROTOKOL") + Seitenzahl-Footer („— 1 · 34 —").

### Artefakt 4 — `docs/components/_vision_einladung.md`

Spec-Anker-Karte analog `_mycel_hub.md` / `_starter_bundle.md`:
Vokabular-Block, Hochstufungs-Begründung, sechs-Sektionen-Plan-Tabelle,
Strikte-Tabus-Liste, Bauzustand-Tabelle, Vendor-Inhalt-Tabelle,
Vorbild-Recherche-Verweis, Reproduzierbarkeits-Bash-Block,
Querverweise.

### Artefakt 5 — CLAUDE.md-Pflege

Drei Edits:

- **§ „Was dieses Repo ist"** → neuer Unter-Abschnitt **„Vier-Schichten-
  Lesart (Pflege 2026-05-27)"** mit ausformulierten Definitionen Mycel
  / Pilz / Mit-Bauer / Observatorium, Multi-KI-Klarstellung,
  Identitäts-Frage offen, Verweisen auf Vision-Anker-Karten.
- **§ Pipeline-Reihenfolge** → neue **Phase D** (Klaus' Vision-
  Erweiterung 2026-05-27), zweigeteilt: D.1 Agent-Bootstrap-Mechanik-
  Spec (Sybil-Schutz via bezeugte Bau-Tat, Identitäts-Schema-Sitzung-
  an-Datum, Refinanzierungs-Schleife) + D.2 Pilz-Schicht-Wirtschafts-
  Spec (bewusst offen bis reale Pilz-Bauten). Plus „Vision-Anker-
  Vorbereitung"-Block (Einladungs-Site + Folge-Pflegen Sage-Page-
  Mount + Mycel-Hub-Mount). Additiv, nicht-blockierend für A/B/C.
- **§ Die zehn Module + Backlogs** → neuer Vision-Anker-Karten-Block
  (Einladung Code-Stub 2026-05-27 + Starter-Bundle Schablone +
  Externer Mycel-Hub Schablone) vor dem Modul-Erläuterungs-Block.

### Headless-Smoke-Test

`docs/einladung/_smoke.mjs` startet einen lokalen HTTP-Server (port-
auto-allocated), lädt `index.html` via Playwright-Chromium (Headless-
Shell unter `/opt/pw-browsers/`), prüft neun Bedingungen:

```
✅ sectionCount         6 Sektionen
✅ stageCanvas          Voll-Bildschirm-Canvas 1440×900
✅ fruitingCanvasCount  3 Fruchtkörper-Mini-Canvases
✅ gradCanvas           1 Lichtungs-Mesh-Gradient
✅ starCount            220 Sternenfeld-Punkte
✅ langDe               „Es gibt unter den Wäldern ein Geflecht"
✅ langEn               „Beneath the forests there is a network"
✅ langFr               „Une invitation"
✅ zeroErrors           Keine JS-Konsolen-Fehler
```

Smoke-Test-Resultat: **9/9 grün.** Konsolen-Warnungen sind
Sandbox-spezifisch (softWebGL-Fallback in Headless-Shell;
Klaus' Chrome auf Galaxy Tab S6 hat echtes GPU).

### Reproduzierbarkeit + README

`docs/einladung/README.md` mit Datei-Tabelle, Reproduzier-Bash-
Befehlen, Privacy-Klausel. `.gitignore` ergänzt um
`docs/einladung/_print_render.html` (ephemere PDF-Render-Vorlage).

---

## Was NICHT getan wurde (Disziplin)

- **KEIN Modul-Code** in `src/modules/`.
- **KEIN Endknoten-Eingriff** — Mein-Rezeptbuch / Mein-Mixarium
  unangetastet.
- **KEINE Sage-Page-Änderung** in `index.html` — Sage-Page-Mount der
  Einladung ist explizit Folge-Pflege-Sitzung (im Vision-Anker-Block
  von CLAUDE.md genannt).
- **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-Bump.**
- **KEINE Pipeline-Umsortierung** Phase A/B/C — Phase D additiv,
  nicht-blockierend.
- **KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag** in Modul 16 (Einladung ist
  kein Sicherheits-Modul-Update).
- **KEINE PII** in der Einladung — keine E-Mail-Adressen, kein Klar-
  Name, keine privaten Daten.
- **KEIN externer Tracker** / Analytics-Snippet / Newsletter-Form-
  Field / Cookie-Banner / Auto-Play-Audio.
- **KEIN Crawler / Pulsation / Eigenanfragen ins offene Netz**.
- **KEINE INTERFACES.md-Änderung** — die Einladung ist Vision-Doku,
  kein Modul-Schnittstellen-Bau.
- **KEINE `status.json`-/Pie-Update** — Code-Stub-Karte ist Vision-
  Anker, kein Pflicht-Modul der `status.json`-Pools. (Wenn Klaus
  wünscht, kann eine Folge-Pflege-Sitzung einen Vision-Anker-Pool
  ergänzen — eigene Anpassungs-Sitzung.)

---

## Pflicht-Klauseln (Klaus' Schärfung 2026-05-27) — Selbst-Check

- ✅ **(1) ANTI-08/15** — Sektion-für-Sektion-Check:
  - Sektion 1: WebGL-Partikel-Welt + Variable-Font-Display, kein
    Bootstrap-Hero.
  - Sektion 2: zweispaltig (Text + Meta-Definition-List), keine
    08/15-Section-Reihen-Komposition; Hintergrund weiterhin WebGL-
    Mycel.
  - Sektion 3: drei separate WebGL-Mini-Canvases mit drei
    Material-Sprachen — explizit keine identischen Karten.
  - Sektion 4: Print-Magazin-Layout (dreispaltig mit Marginalia),
    SVG-Sternenfeld — keine Tailwind-Default-Grid-Komposition.
  - Sektion 5: Schlüssel-3D-Mesh + Tür-Backdrop-Shader, eigene
    Material-Sprache mit Iridescence.
  - Sektion 6: Mesh-Gradient mit warmer Ocker-Moos-Burgund-Nacht-
    Palette (nicht Stripe-blau-violett-Clone), bewusst gegen das
    Klischee.
- ✅ **(2) WEBGL-UNTERGRENZE 3/6** — überschritten: Sektionen 1, 2,
  5, 6 als vier echte WebGL-Sektionen + drei Mini-Canvases in
  Sektion 3 = sieben WebGL-Schichten gesamt. Custom Fragment-Shader
  in jeder davon (Halo, Drift, Iridescence, Refraction-Approximation,
  Mesh-Gradient, Lichtspalt). Sektion 4 ist bewusst DOM/CSS — Print-
  Magazin-Niveau mit Variable-Font-opsz, dreispaltiger Komposition
  und SVG-Sternenfeld erfüllt die „nur DOM/CSS"-Klausel auf
  hochwertigem Niveau.
- ✅ **(3) SECHS WELTEN, NICHT EIN PATTERN SECHSMAL** — jede
  Sektion eigene Bildwelt + Material-Sprache + Bewegungs-Idee.
  Vorbild Apple Vision Pro Produkt-Page eingehalten.
- ✅ **(4) NIVEAU-BEZUG ZUM REPO** — Sage-Page-Niveau (Schwarzes
  Loch, Galaxien, Sonne) getoppt: dort 2D-CSS-Animationen +
  Canvas-Punkte, hier echtes three.js mit custom Fragment-Shadern,
  GPU-instanced Geometry, Variable-Font-Typografie. Plumpe Sage-
  Page-Karten sind nicht Vorbild geworden.

---

## Verifikation

- ✅ `_smoke.mjs` 9/9 grün (Headless-Chromium auf vendored three.js
  + GSAP + Variable-Fonts).
- ✅ `_pdf.mjs` erzeugt 34-Seiten-PDF reproduzierbar (770 KB,
  `pdfinfo` zeigt Title + Pages korrekt).
- ✅ `pdftotext` zeigt erwarteten DE-Eröffnungs-Text auf Seite 3
  („Es gibt unter den Wäldern ein Geflecht, das nichts will.").
- ✅ Visueller PDF-Sichttest via `pdftoppm` → Seite 1 (Titel mit
  „Einladung in das Mycel." in Fraunces-Display), Seite 2 (Sprach-
  Trenner mit Lead-Blockquote), Seite 3 (Eröffnungs-Kapitel mit
  Marginalia) — alle drei optisch wie ein Print-Magazin.
- ✅ `node --check` auf `_smoke.mjs` und `_pdf.mjs` grün.
- ✅ `python3 -c "import json; json.load(open('status.json'))"` —
  unverändert valid (kein Edit auf status.json).
- ✅ CLAUDE.md drei Edits intakt: Vier-Schichten-Lesart-Block, Phase
  D, Vision-Anker-Karten-Block.
- ✅ `docs/components/_vision_einladung.md` analog zu existierenden
  Vision-Anker-Karten geformt.
- ⚠️ **Klaus' Browser-Sichttest steht aus** — Headless ist
  Logik-Bestätigung, nicht Sicht-Bestätigung. Galaxy Tab S6 (DeX
  + Tablet-Modus) muss die Site noch ansehen.

---

## Offene Punkte (Klaus muss entscheiden)

1. **Browser-Sichttest auf Galaxy Tab S6** — DeX (Desktop-Modus,
   externer Bildschirm) UND Tablet-Modus, mit Hard-Reload nach
   `git pull`. Drei Welten zu prüfen: Lädt die HTML-Site
   (`docs/einladung/index.html`) ohne Konsolen-Fehler? Sind die
   Mycel-Partikel sichtbar? Funktioniert der Sprach-Wechsel?
   Lädt das PDF (`docs/einladung/einladung.pdf`)?
2. **Sage-Page-Mount** — Soll die Einladung in der Sage-Page-Navleiste
   verlinkt werden (z.B. „Einladung lesen" als neuer Stations-Link)?
   Wenn ja: eigene Folge-Pflege-Sitzung (nicht-blockierend).
3. **Mycel-Hub-Mount** — Wenn der Externe Mycel-Hub
   (`SB-KIMTool-Point`) gebaut wird (Phase B Schritt 9), soll die
   Einladung dort als Eingangs-Page erscheinen? Folge-Pflege nach
   Phase B Schritt 9.
4. **Sprach-Erweiterung** — DE/EN/FR/ES als Start, vier weitere
   Sprachen vorstellbar (IT / PL / TR / ZH / JA). Jede Sprache
   bekommt eigene Pflege-Sitzung mit Native-Speaker-Check?
5. **PNG-/Social-Card** für die Einladung — soll für GitHub-Repo-
   Preview oder Twitter-Card ein statisches Render-Bild der
   Eröffnungs-Sektion (PNG aus Headless-Chromium) ergänzt werden?

---

## Nächster sinnvoller Schritt

**Klaus' Browser-Sichttest** der drei Format-Schichten auf Galaxy
Tab S6. Vor der Sichttest-Bestätigung ist die Sitzung NICHT als
„grün" zu melden — die Einladung lebt nur dann „echt", wenn Klaus
sie im echten Browser gesehen hat.

Nach grünem Sichttest wird (in eigener Folge-Pflege-Sitzung)
entschieden, ob ein Sage-Page-Mount-Brief geschrieben wird.

Brief für Folge-Pflege (Sage-Page-Mount der Einladung) ist nicht
Bestandteil dieser Sitzung — Klaus' Wunsch.

---

## Folge-Pflegen 2026-05-28 (Live-Sichttest + iterative Anpassungen)

Klaus hat in der Nacht 2026-05-28 die Site auf seinem Galaxy Tab S6
gepullt und mehrere Iterations-Befunde gemeldet. Statt einer
separaten Pflege-Sitzung wurden sie innerhalb derselben Bau-Sitzung
abgearbeitet (Branch `claude/bau-einladung-site-8fZyj` bleibt offen).

### Inhaltliche/visuelle Befunde

1. **Sektion 1 Symbiose-Wendung**: Eröffnungs-Satz „das nichts will"
   geändert in „das in perfekter Symbiose lebt" — in HTML-i18n + MD
   alle vier Sprachen.
2. **Sektion 3 Pilz-Karten**: Klaus hat drei eigene KI-Bilder
   geliefert (Sucher: Hände mit Sporen, Kommerziell: Premium-Pilz
   auf Marmor, Agent: Synapsen-Pilz). Die prozeduralen WebGL-Mini-
   Szenen ersetzt durch `<img class="fruiting-image">` mit
   object-fit: contain (pixelgenau 1:1). Hover-3D-Effekt entfernt.
   Maus-getriggerter Feenstaub pro Karte (Vanilla Canvas 2D, Cross-
   Star-Funken, gold + blau, max 220 Partikel).
3. **Sektion 5 Schlüssel**: mehrfach iteriert:
   - B1-Vortex als Hintergrund + B2-Schlüssel als Vordergrund
     (mix-blend-mode: screen, Bild-Schwarz wird transparent)
   - Stop-Motion 4-Frame-Rotation gebaut, dann auf Klaus' Wunsch
     wieder durch B2-Vollansicht ersetzt (Frames bleiben als
     Vendor-Archiv)
   - Schwarzes Loch um die Box (radial-Vignette) gebaut, dann
     wieder entfernt (war Notlösung, brauchte es nicht mehr durch
     mix-blend-Verschmelzung)
   - Maus-Interaktion (setupKeyInteraction) wieder entfernt
   - Text-Lesbarkeit: backdrop-filter Card hinter `.text-col`
4. **Sektion 6 Lichtung**: Vignette entfernt (Klaus „Wald komplett
   sichtbar"), Text mit `-webkit-text-stroke` Haarlinien-Outline
   und verstärkten text-shadows. Afterword unter den CTA-Buttons
   nochmal heller (`#fbf5e6`, stroke 0.5px, font-weight 380).
5. **Tür-Sequenz (Sektion 5b NEU)**: Pinned-Scroll-Animation
   320vh hoch, vier (jetzt fünf) Phasen: (1) Tür rechts gross
   gezoomt → fährt nach links zur Mitte, (2) ruht, (3) Zoom auf
   den Lichtspalt, (4) Tür wird transparent + warmer Flash, (5)
   Flash fadet zurück auf 0 für nahtlosen Übergang. Lichtungs-Foto
   als Stage-Background schimmert durch in Phase 4.
6. **Übergang 5b→6**: harter schwarzer Balken (scene-fade-top von
   Sektion 6) entfernt — die Tür-Sequenz fadet schon selbst zum
   Lichtungs-Foto.
7. **Mit-Bauer-Sprache (DE)**: „Mensch-Mit-Bauer" / „Agent-Mit-Bauer"
   (Bindestrich-Komposita) ersetzt durch „Menschen, die mitbauen" /
   „Agenten, die mitbauen" (Variante A). EN/FR/ES unverändert. Bug-
   Fix: `s4.eyebrow` von `Mensch &amp; Agent` auf `Mensch & Agent`
   (HTML-Entity wurde als Plain-Text gerendert).
8. **Sektion-Übergangs-Fades**: JS-eingefügte `.scene-fade-top`/
   `.scene-fade-bot` für sanftere Sektion-Wechsel. Mycel-Opacity-
   Lerp von 0.05 auf 0.018 reduziert.
9. **Kamerafahrten**: Sektion 1/5/6 bekommen seitliche Kamerafahrten
   zur Mitte hin (links/rechts/oben) mit unterschiedlichen Dauern
   (20s/16s/22s alternate).
10. **Feenstaub-Verstärkung**: Sektion 1 Mycel-Glitter mit Cross-
    Star-Shape; Sektion 5 Schlüssel-Sporen 250 Punkte mit zwei
    Farben (gold unten, blau oben); Sektion 6 NEU Pollen-Layer
    (drei Tiefen-Schichten, 80+140+200 Partikel).
11. **Drei Foto-Hintergründe** vendoriert als Lossless WebP:
    `scene-1-mycel.webp` (Mycel-Boden), `scene-5-vortex.webp`
    (alchemischer Übergang), `scene-6-lichtung.webp` (Lichtung mit
    Sonnenstrahlen). Ursprünglich angeliefert: `scene-5-door.webp`
    (Tür mit Säulenhalle, wird in der Tür-Sequenz wieder verwendet).
    Plus B2-Schlüssel (`scene-5-key.webp`) und vier Rotations-Frames
    (`scene-5-key-frame-0..3.webp`, jetzt Archiv).

### Sage-Page-Mount (vorgezogen)

Ursprünglich als eigene Folge-Pflege-Sitzung geplant — Klaus hat
zum Sitzungs-Schluss explizit autorisiert, den Mount in dieser Bau-
Sitzung mit zu erledigen. Neue Karte zwischen Lesematerial- und
Andock-Karte in `index.html`:

  <article class="card span-12 einladung-card">
    "Bevor du andockst — eine Einladung"

Tür-Bild startet semi-transparent (opacity 0.30, entsättigt). Bei
Hover wird sie über 1.8s langsam auf volle Sichtbarkeit aufgebaut
(Klaus' Wunsch: „erst bei längerem draufbleiben"). Mouse-Move
spawnt Cross-Star-Feenstaub am Cursor. Klick triggert kurze Tür-
Öffnungs-Animation (warmer Flash + leichte Bewegung), nach 850ms
Navigation zu `docs/einladung/index.html`. Reduced-Motion-Fallback.

### Heilige-Tafel-Anpassung

Die ursprüngliche Bau-Sitzungs-Pflicht „KEINE Sage-Page-Änderung
in `index.html`" wird durch Klaus' explizite Anweisung im Live-Chat
aufgehoben (Tafel-Evolutions-Klausel CLAUDE.md). Vision-Anker-Karte
`_vision_einladung.md` Bauzustand aktualisiert.

### Commit-Bilanz seit Sichttest-Beginn (chronologisch)

```
df05b4b Sage-Page-Mount der Einladung — Türschwelle-Karte
fa7bd8b Pflege Einladung — DE Mit-Bauer-Beschreibung sprachlich entspannt
2cb4026 Pflege Tür-Sequenz — Phase 5 für sanftes Flash-Auslaufen
0a930d3 Pflege Übergang zur Lichtung — harter dunkler Balken entfernt
ae2b2ae Pflege Sektion 5 — schwarzes Loch entfernt, Schichten reichen
ebfdb09 Pflege Sektion 5 — zurück zur Schlüssel-Vollansicht
dbc21b0 Pflege Sektion 5+6 — Text-Kontrast und schwarzes Loch um Schlüssel
309410c Pflege Sektion 6 — Vignette weg, Text mit Haarlinien-Outline
0a930d3 + viele weitere Pflegen davor (Maus-Feenstaub, Stop-Motion,
        Foto-Integration, Kamerafahrten, Türöffnungs-Sequenz,
        Lossless-WebP, ...)
```

### Verifikations-Status nach 2026-05-28

- ✅ Klaus' Browser-Sichttest auf Galaxy Tab S6 hat stattgefunden
  (mehrere Screenshots im Chat dokumentiert).
- ✅ Headless-Smoke-Test 9/9 nach jedem Pflege-Commit grün.
- ✅ PDF nach DE-Symbiose-Änderung + Mit-Bauer-Pflege neu erzeugt.
- ✅ Sage-Page-Mount visuell geprüft (Idle + Hover-State).
- ✅ Klaus' OK auf den Sage-Page-Mount (2026-05-28).

### Nächster sinnvoller Schritt (jetzt)

PULS.md final aktualisieren; PR #188 aus Draft auf Ready for Review
setzen. Sitzung ist abschluss-bereit.
