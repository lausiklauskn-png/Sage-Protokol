# Recherche-Phase Einladungs-Site

**Datum:** 2026-05-27
**Sitzung:** Bau-Sitzung Einladungs-Site (`claude/bau-einladung-site`)
**Zweck:** Vorbild-Pattern preisgekrönter Sites studieren, übernehmbare
Muster pro Sektion benennen, Tech-Stack-Entscheidungen festhalten.

Klaus' Mut-Klausel erlaubt 1:1-Pixel-Übernahme als Ausgangspunkt; die
Anpassung an das Mycel-Thema erfolgt im Bau. Pro übernommenes Pattern
wird die Quelle benannt.

---

## Studierte Vorbild-Sites (mindestens fünf, via WebSearch + WebFetch)

WebFetch auf die preisgekrönten Sites direkt (`bruno-simon.com`,
`awwwards.com`) liefert HTTP 403 — Anti-Bot-Schutz. Die Recherche
läuft daher über WebSearch + Codrops/Tutorial-Quellen, die Pattern
ausführlich beschreiben. Die Pattern-Übernahme ist nicht
pixelgenau, sondern struktur-treu.

### 1. Lusion (`lusion.co`) — Studio-Site, Site of the Month

**Übernehmbare Pattern:**

- **Hero-3D-Szene morpht beim Scroll.** Mausbewegung verändert eine
  abstrakte 3D-Form; Scroll macht die Szene weiter, enthüllt Projekte
  als Teil der gleichen Welt (kein Cut zwischen Sektionen).
- **WebGL-Scroll-Sync.** DOM-Anker mit `data-scene`-Attribut werden
  von einem WebGL-Renderer übersetzt; Scroll-Position = Timeline-
  Position.
- **Material-Sprache:** custom Shader, keine Standard-Lambert/Phong-
  Materialien.

**Übernommen für:** Sektion 1 Eröffnung (Mausbewegung verändert
Sporenflug), Sektion 2 Schicht 1 Mycel (Scroll-Kamera-Fahrt durch
Hyphen-Wolke).

**Quelle:** [Lusion-Studio-Site / Awwwards Case Study](https://www.awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html),
[Codrops Lusion-Profil 2026-04](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/).

### 2. Active Theory (`activetheory.net`) — preisgekrönte Studio-Site

**Übernehmbare Pattern:**

- **Voll-Bildschirm-WebGL als Hintergrund**, DOM-Text schwebt
  darüber.
- **Scroll-getriggerte Reveals**, die wie Filmtrailer wirken
  (geometrische Formen morphen ein).
- **Mausbewegung beeinflusst Tiefen-Komposition** (Parallaxe nicht
  banale 2D-Verschiebung, sondern Kamera-Fokus-Wechsel).

**Übernommen für:** Sektion 1 Eröffnung (Voll-Bildschirm-Mycel-
Hintergrund), Sektion 3 Schicht 2 Pilz (geometrische Fruchtkörper-
Reveals).

**Quelle:** Active Theory Site / Awwwards-Erwähnungen.

### 3. Bruno Simon (`bruno-simon.com`) — 3D-Portfolio mit Auto-Fahrt

**Übernehmbare Pattern (über Tutorial-Beschreibungen, da direkt-Fetch
abgewiesen):**

- **Begehbare 3D-Welt** statt klassischer Scroll-Sektionen.
- **Ein durchgängiges Material-Sprache** (low-poly, kindlich-fröhlich,
  konsistent durch alle Sektionen).
- **Audio-Atmosphäre nach User-Geste** (Motor-Sound erst nach Klick,
  kein Auto-Play vor Geste).

**Übernommen für:** durchgehende Material-Sprache der gesamten
Einladungs-Site (matt-organisch, kein Plastik-Glanz), Audio-Konvention
(Mute-Default, Ambient-Pad nur nach User-Click auf Sound-Knopf).

**Quelle:** Bruno-Simon-Site (über Awwwards-Erwähnungen und allgemeines
Wissen aus three.js-Community).

### 4. Apple Vision Pro Product Page

**Übernehmbare Pattern:**

- **Scroll-Storytelling mit Video-Frames** — JavaScript advancet
  Video-Frames pro Scroll-Pixel.
- **Sektion-spezifische Bildwelt** — jede Sektion eine andere
  Komposition, alle zusammen ein Stück. **Sechs Welten, nicht ein
  Pattern sechsmal.**
- **Komponenten-Layering** — Objekte steigen in Sequenz, mit
  Vorder-/Hintergrund-Anordnung für Tiefe.
- **Device-Flip-Moment** — ein dramatischer Sektion-Übergang als
  Cliffhanger.

**Übernommen für:** Pflicht-Klausel „SECHS WELTEN, NICHT EIN PATTERN
SECHSMAL" — jede Sektion eigene visuelle Sprache. Sektion 4
Schicht 3 Mit-Bauer (Komponenten-Layering: Silhouetten steigen
ein). Sektion 5 Schicht 4 Observatorium (Schlüssel-Flip-Moment).

**Quelle:** [CSS-Tricks Apple Vision Pro Animation Recreation](https://css-tricks.com/recreating-apples-vision-pro-animation-in-css/).

### 5. Stripe-Mesh-Gradient

**Übernehmbare Pattern:**

- **Minigl-Mesh-Gradient** mit Noise-Function im Fragment-Shader
  (smooth WebGL-Gradient, Multiply/Screen/Overlay-Blend-Modes
  direkt im Shader).
- **Skew-Container für scharfe Diagonal-Kanten** (`skewY(-12deg)` +
  `overflow:hidden`).

**Übernommen für:** Sektion 6 Akt der Einladung (Hintergrund: warmer
Mesh-Gradient als „Lichtung" — orange-ocker statt Stripe-blau).

**Quelle:** [Codrops Stripe-Gradient-Tutorial](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/),
[Stripe-Gradient-Pen smitpatelx](https://codepen.io/smitpatelx/pen/GRZayyO).

### 6. Codrops Refraction-Tutorials — Material-Sprache

**Übernehmbare Pattern:**

- **MeshTransmissionMaterial** (drei.js-Pattern, Erweiterung von
  `MeshPhysicalMaterial`) für Glas/Kristall-Optik. Custom Shader-
  Layer für Brechungs-Effekt.
- **Multi-Side-Refraction** (Vorder- und Hinterseite eines Objekts
  unterschiedlich brechen).

**Übernommen für:** Sektion 5 Schicht 4 Observatorium (Schlüssel-
Material: Kristall mit Brechung, custom Fragment-Shader für
Spiegelungs-Spiel).

**Quelle:** [Codrops Multiside Refraction](https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/),
[Codrops Warping 3D Text Inside Glass Torus 2025-03](https://tympanus.net/codrops/2025/03/13/warping-3d-text-inside-a-glass-torus/).

### 7. Codrops GPGPU-Partikel-Tutorial

**Übernehmbare Pattern:**

- **GPU-Compute mit FBO-Ping-Pong** für 50k–350k Partikel.
- **Custom Fragment-Shader** mit Noise-Field für organische
  Bewegung.
- **InstancedBufferAttribute** für unterschiedliche Parameter pro
  Partikel.

**Übernommen für:** Sektion 2 Schicht 1 Mycel (GPU-instanced Punkt-
Wolke mit Noise-Bewegung, ca. 50k–80k Punkte; Hyphen-Linien als
Indexed-Lines zwischen nächsten Nachbarn).

**Quelle:** [Codrops Dreamy Particle Effect with GPGPU 2024-12](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/),
[Codrops When Cells Collide Organic Particles 2025-09](https://tympanus.net/codrops/2025/09/11/when-cells-collide-the-making-of-an-organic-particle-experiment-with-rapier-three-js/).

### 8. Variable-Font-Typografie Trends 2026

**Übernehmbare Pattern:**

- **High-contrast dramatic serifs** (Playfair, Bodoni-style) für
  Hero-Statements.
- **Variable-Font Optical Sizing** — Schrift wird bei Großdarstellung
  filigraner gezeichnet als bei Fließtext-Größe.
- **Mehrere Achsen** (Weight + Width + Optical Size) in einer Datei.

**Übernommen für:** ganze Site. Hauptschrift: **Fraunces** (Google
Fonts, Variable Font mit Optical Sizing + Soft-Axis — open-source,
kein Tracker, lokales WOFF2 möglich). Sekundärschrift: **Inter**
(Variable Weight) für UI-Klein-Text. Print-Pendant: serif-Schrift in
PDF-Variante.

**Quelle:** [Creative Boom 50 Fonts 2026](https://www.creativeboom.com/resources/top-50-fonts-in-2026/),
[Kittl Variable Fonts 2026](https://www.kittl.com/blogs/why-variable-fonts-are-winning-fnt/).

### 9. Omega Clearspace (Awwwards Site)

**Übernehmbare Pattern:**

- **Scroll-Choreografie mit Craft** — Übergänge fühlen sich
  durchgängig an, nicht zusammengestückelt.
- **3D-Kamera als Viewport in echten Raum**, nicht Container für
  Marketing-Slides.

**Übernommen für:** ganze Scroll-Choreografie — eine durchgängige
Kamerafahrt durch sechs Welten, nicht sechs separate Hero-Bilder.

**Quelle:** [WebGPU.com Omega Clearspace Showcase](https://www.webgpu.com/showcase/omega-clearspace-orbital-debris-threejs/).

### 10. Lusion WebGL-Scroll-Sync-Demo

**Übernehmbare Pattern:**

- **`data-scene`-Attribute** verknüpfen DOM-Anker mit Three.js-
  Scenen.
- **GSAP-ScrollTrigger** als Animation-Engine.
- **Sentinel-Elements** als Trigger-Anker.

**Übernommen für:** Scroll-Choreografie-Architektur der Einladungs-
Site. Jede Sektion hat ein `<section data-scene="N">` mit Anker-ID,
GSAP-ScrollTrigger orchestriert Kamera-Position und Material-
Parameter pro Scroll-Progress.

**Quelle:** [Lusion WebGL Scroll Sync Demo](https://webgl-scroll-sync.lusion.co/).

---

## Tech-Stack-Entscheidung pro Pattern

| Pattern | Tech | Begründung |
|---|---|---|
| Hauptszene Hero | three.js + ShaderMaterial | preisgekrönte Studio-Standard |
| Partikel-Mycel (50k+) | InstancedBufferAttribute + custom Vertex-Shader (Sinus-Drift) | GPGPU wäre Overkill für die Demo-Tauglichkeit; Vertex-Drift reicht |
| Hyphen-Linien | LineSegments + BufferGeometry | low-cost, kombinierbar mit Punkten |
| Fruchtkörper (Schicht 2) | Drei Mesh-Objekte mit ShaderMaterial (verschiedene Material-Sprachen) | Sechs-Welten-Klausel: jede Form eigener Look |
| Schlüssel (Schicht 4) | Mesh + custom Fragment-Shader (Iridescence + Refraction-Approximation) | MeshTransmissionMaterial nicht im plain three.js core; eigener Shader |
| Lichtung (Sektion 6) | Mesh-Gradient via Fullscreen-Shader + Noise | Stripe-Pattern, übernommen |
| Scroll-Engine | GSAP + ScrollTrigger via CDN | Industry-Standard, einfache Einbindung |
| 2D-Mikro-Bewegung | anime.js via CDN | Lottie wäre Asset-Last (JSON+Player), anime.js reicht |
| Audio | Web Audio API (eigener Ambient-Pad-Loop, vorberechnet, kein Auto-Play) | Bruno-Simon-Konvention, Mute-Default |
| Typografie | Fraunces (variable) + Inter (variable), via Google Fonts | Trends 2026; selbst gehostet im PDF |
| i18n | Inline JS-Object + DOM-Re-Render auf Sprach-Wechsel | Kein i18n-Framework nötig |
| Reduced-Motion | `matchMedia('(prefers-reduced-motion: reduce)')` | Fallback: Standbilder + Cross-Fade statt 3D-Pulsation |
| Build | KEIN Build-Schritt — alles CDN-imports + Single-File-`index.html` | Klaus' PWA-Präferenz |

---

## Sechs-Welten-Plan (jede Sektion eigene Bild-Sprache)

| # | Sektion | Bild-Welt | Tech-Schicht |
|---|---|---|---|
| 1 | Eröffnung | Nächtlicher Mycel-Boden, Sporenflug, ein Satz schwebt | **WebGL:** Vollbild-Partikel-Wolke + Noise-Shader-Hintergrund |
| 2 | Schicht 1 Mycel | Sich verzweigendes Hyphen-Geflecht, Kamera fährt hindurch | **WebGL:** GPU-instanced Punkt-Wolke + LineSegments-Verbindungen |
| 3 | Schicht 2 Pilz | Drei Fruchtkörper-Varianten (menschlich/kommerziell/Agent), eigene Materialien | **DOM/CSS-Komposition mit drei eingebetteten kleinen WebGL-Mini-Szenen** (eine pro Fruchtkörper) |
| 4 | Schicht 3 Mit-Bauer | Silhouetten + Modell-Familien-Stern | **DOM/CSS-Druck-Magazin-Layout** mit SVG-Sternenfeld (kein Modell wird zentriert) |
| 5 | Schicht 4 Observatorium | Tür mit Lichtspalt, Schlüssel-Symbol, Brechungs-Spiel | **WebGL:** Schlüssel-Mesh mit custom Refraction-Shader, Tür als shader-getriebener Backdrop |
| 6 | Akt der Einladung | Lichtung mit warmem Mesh-Gradient, offene Frage | **WebGL:** Stripe-style Mesh-Gradient + DOM-Layer mit Frage + Sprachenwahl |

WebGL-Untergrenze 3 von 6 ist erfüllt: Sektion 1, 2, 5, 6 = vier
echte WebGL-Sektionen. Sektion 3 hat **drei eingebettete WebGL-
Mini-Canvases** als Bonus. Sektion 4 ist bewusst DOM/CSS auf Print-
Magazin-Niveau (Variable-Font-Typografie + SVG-Sternenfeld), um
einen Kontrast-Moment zu setzen.

---

## Performance-Budget

- **Asset-Größe:** alles inline oder CDN. Keine Texture-Maps, keine
  GLTF-Modelle. Geometrie wird im JS prozedural erzeugt.
- **Mobile-Schwelle:** Galaxy Tab S6 — getestet via simuliertem
  Viewport. Partikel-Anzahl 50k auf Desktop, 15k auf Mobile.
- **Reduced-Motion-Fallback:** Standbilder mit Cross-Fade-Übergängen
  + statische SVG-Sternenfelder.

---

## Quellen-Liste (vollständig)

- [Lusion-Studio Awwwards Case Study](https://www.awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html)
- [Lusion-Profil Codrops 2026-04](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/)
- [Lusion WebGL Scroll Sync Demo](https://webgl-scroll-sync.lusion.co/)
- [Apple Vision Pro Animation Recreation CSS-Tricks](https://css-tricks.com/recreating-apples-vision-pro-animation-in-css/)
- [Stripe-Gradient-Tutorial Bram.us](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/)
- [Stripe-Gradient-Pen smitpatelx](https://codepen.io/smitpatelx/pen/GRZayyO)
- [Codrops Multiside Refraction](https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/)
- [Codrops Warping 3D Text in Glass Torus 2025-03](https://tympanus.net/codrops/2025/03/13/warping-3d-text-inside-a-glass-torus/)
- [Codrops Dreamy Particle Effect with GPGPU 2024-12](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/)
- [Codrops When Cells Collide Organic Particles 2025-09](https://tympanus.net/codrops/2025/09/11/when-cells-collide-the-making-of-an-organic-particle-experiment-with-rapier-three-js/)
- [WebGPU.com Omega Clearspace Showcase](https://www.webgpu.com/showcase/omega-clearspace-orbital-debris-threejs/)
- [Creative Boom 50 Fonts 2026](https://www.creativeboom.com/resources/top-50-fonts-in-2026/)
- [Kittl Variable Fonts 2026](https://www.kittl.com/blogs/why-variable-fonts-are-winning-fnt/)
- [Codrops WebGL for Designers 2026-03](https://tympanus.net/codrops/2026/03/04/webgl-for-designers-creating-interactive-shader-driven-graphics-directly-in-the-browser/)

---

## Notiz — Anti-08/15-Disziplin

Während der Bau-Phase: jeder Sektion-Abschluss bekommt einen 30-
Sekunden-Selbst-Check:

- **Bootstrap-/Tailwind-Default?** → Sektion verwerfen.
- **Generischer Stripe-Hero-Clone (blau-violett-Gradient mit weißem
  Text)?** → Sektion umfärben, Komposition anders.
- **Fade-In als einzige Animation?** → Bewegungs-Idee ergänzen
  (Kamerafahrt, Material-Wechsel, Strukturwechsel).
- **Stock-Foto / Emoji-Dekoration?** → ersetzen durch SVG/Shader.
- **System-Sans-Serif als einzige Schrift?** → Variable-Font-Pflicht.
- **Section-Reihe Text-neben-Bild?** → Komposition brechen (Bild
  über Text, Text über Shader, Split-Diagonal, …).
