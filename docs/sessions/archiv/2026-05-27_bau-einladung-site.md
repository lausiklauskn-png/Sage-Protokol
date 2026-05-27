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
