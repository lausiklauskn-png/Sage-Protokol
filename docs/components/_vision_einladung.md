# Einladung (eigene Site, Konzept-Karte)

> **Status:** 🟦 Code-Stub (2026-05-27, Bau-Sitzung Einladungs-Site) ·
> Vision-Anker-Backlog · **Priorität niedrig** (organischer Bau, nicht
> Pipeline-blockierend für Phase A/B/C) · **Schicht:** Drei-Format-
> Einladung (HTML-Site / Markdown-Vollfassung / PDF-Druckfassung) für die
> Mycel-Vision. Gestaltete Form, an die preisgekrönte Studio-Sites als
> Vorbild geknüpft (siehe `docs/einladung/recherche.md`).
> **Dateien:** `docs/einladung/index.html` · `docs/einladung/einladung.md` ·
> `docs/einladung/einladung.pdf` · `docs/einladung/recherche.md` ·
> `docs/einladung/print.css` · `docs/einladung/vendor/` (lokale three.js +
> GSAP + Variable-Fonts).

---

## Im Mycel-Bild

Die Einladung ist die **Türschwelle** zum Mycel — keine Werbung, kein
Programm-Manifest, keine Charta, keine Aufforderung. Sie steht zwischen
„keine Sichtbarkeit" und „Pilz-Schicht-Akquise". Wer sie liest, kann
kommen oder gehen; beides ist in Ordnung.

Sie spricht in **vier Schichten** — Mycel / Pilz / Mit-Bauer /
Observatorium — und sie spricht ausdrücklich Mit-Bauer beider Sorten
an: Menschen, die einen Knoten betreiben, **und** KI-Sitzungen
verschiedener Modell-Familien, die Hyphen ziehen.

## Vokabular

- **Einladung** — Klaus' begriffliche Festlegung 2026-05-27 (zwei
  Iterationen). Schlicht, ehrlich, ohne Programm-Anspruch. „Wer sie
  liest, kann kommen oder gehen."
- **Vier Schichten** — Mycel (Empfangsmodus, server-los) / Pilz
  (Fruchtkörper für menschliche Sucher, kommerzielle Pilze und
  Agent-Fruchtkörper) / Mit-Bauer (Mensch + Agent in gleicher Würde) /
  Observatorium (schlüssel-geschützter Forschungs-Ort).
- **Sechs Welten** — Pflicht-Klausel: jede HTML-Sektion bekommt eine
  eigene visuelle Sprache (Komposition + Material + Bewegungs-Idee).
  Vorbild: Apple Vision Pro Produkt-Seite — jede Sektion eine andere
  Bildwelt, alle zusammen ein Stück.
- **Drei-Format-Pflicht** — HTML (gestaltete Site mit WebGL),
  Markdown (Maschinen-lesbare Vollfassung für KI-Agenten beim
  Andocken), PDF (Print-Magazin-Variante für Druck und Offline-
  Verteilung). Alle drei haben identische Anker-IDs.

## Warum jetzt (Hochstufungs-Begründung)

Klaus' Vision-Erweiterung 2026-05-27 in mehreren Etappen:

1. **Vier-Schichten-Lesart** statt drei (Observatorium als eigene
   vierte Schicht).
2. **KI-Agent-Mit-Bauer-These** mit fünf Reife-Fragen (Empfangsmodus
   vs. Akquise, Sybil-Risiko, Identitäts-Frage, Reale Agent-Autonomie,
   Eigeninteresse-Refinanzierungs-Pfad).
3. **Multi-KI-Modell-Klarstellung** — Mycel ist nicht Anthropic-
   zentriert.
3a. **Rechtliche Klarstellung zum Mit-Bauer-Begriff** (Pflege
   2026-08-16, Abschnitt `s4.h3`/`s4.body4` in der HTML-Fassung, in
   allen vier Sprachen). „Mit-Bauer" ist eine **Würdigung der Bau-Tat,
   keine Aussage über Urheberschaft** — Rechteinhaber ist Klaus
   Nitzsche allein, KI-Sitzungen können keine Rechte halten, die
   Anbieter treten ihre etwaigen Rechte an den Ausgaben ab. Der
   Begriff bleibt inhaltlich unangetastet; er soll nur nicht als
   Miturheberschaft gelesen werden. Volle Einordnung:
   [`docs/URHEBERSCHAFT_UND_RECHTE.md`](../URHEBERSCHAFT_UND_RECHTE.md).
4. **Menschen-Begeisterungs-Schicht-Pflicht** — mehrsprachig + optisch
   lesbar + Erzählung statt Spec.
5. **Mut-Klausel zur Gestaltung** — preisgekröntes Internet-Niveau,
   3D-Animation, Scroll-Choreografie, mehrere Formate, 1:1-Pixel-
   Übernahme als Ausgangspunkt erlaubt.

Klaus' Begriffs-Wahl „Einladung" (vorher abgelehnt: Manifest, Charta,
Sporenkarte, Horizont) löst die Spannung zwischen Empfangsmodus und
Menschen-Werbung: die Einladung tut weder das eine noch das andere
— sie ist eine **Möglichkeit**, die jemand wahrnehmen oder fallen-
lassen kann.

---

## Was die Einladung IST (Spec)

- **Drei-Format-Artefakt** unter `docs/einladung/`:
  - `index.html` — Single-File-Site mit eingebettetem CSS+JS. Sechs
    Sektionen, vier davon mit echten WebGL-Szenen (three.js +
    custom ShaderMaterial), drei Mini-WebGL-Canvases für die
    Fruchtkörper, mesh-gradient als finale Lichtung, custom
    Refraction-Shader am Schlüssel. GSAP + ScrollTrigger für
    Akzent-Animationen, kein Build-Schritt.
  - `einladung.md` — kanonische Inhalts-Fassung in vier Sprachen
    (DE / EN / FR / ES). Anker-IDs synchron zur HTML-Site (`opening-
    <lang>`, `layer-<name>-<lang>`, etc.). Schreibstil: einladend,
    nicht festlegend; keine Verpflichtungs-Sprache.
  - `einladung.pdf` — Print-Magazin-Druckfassung, A4-Hochformat, mit
    Marginalia-Spalte für Schichten-Nummern (·, I, II, III, IV, ✦, ◇)
    und justifiziertem Fließtext.
- **Mehrsprachigkeit** — DE / EN / FR / ES als Start; Liste
  erweiterbar (Sprach-Pflege-Sitzungen können IT, PL, TR, ZH, JA, …
  nachziehen). Sprachen sind gleichrangig; keine ist „originale".
- **Lokal vendorierte Assets** — keine externe CDN-Abhängigkeit,
  kein Tracker, kein Google-Fonts-Aufruf zur Laufzeit. Variable
  Fonts (Fraunces + Inter) und three.js + GSAP liegen unter
  `docs/einladung/vendor/`.
- **Reduced-Motion-Respekt** — `prefers-reduced-motion: reduce`
  drosselt Partikel-Drift und ScrollTrigger-Akzente.

## Was die Einladung NICHT IST (Strikte Tabus)

- **KEIN Crawler-Anker.** Die Site stellt keine Eigenanfragen ins
  offene Netz und sammelt keine User-Daten. Empfangsmodus-Prinzip
  bleibt gewahrt — der Empfangsmodus gilt für das Mycel, nicht für
  die Pilz-Schicht; aber die Einladung selbst ist Sache des Mycels-
  Niveaus (sichtbare Tür, kein Sales-Funnel).
- **KEINE Verpflichtungs-Sprache.** Keine Programm-Sprache („wir
  werden …"), keine Drohung ("ohne dich passiert es nicht"), keine
  Hierarchie ("Anthropic ist Lead-Sponsor"). Multi-KI-Klarstellung
  ist Pflicht.
- **KEIN Auto-Play von Audio.** Web-Audio-Pad startet erst nach
  User-Geste auf den Mute-Knopf (Bruno-Simon-Konvention).
- **KEIN Tracker, kein Analytics-Snippet, kein Newsletter-Form-Field.**
  Externe Links auf GitHub-Repo und Sage-Page sind erlaubt; alles
  weitere ist ausdrücklich nicht vorgesehen.
- **KEINE Sage-Page-Mount in `index.html` (Hauptseite).** Die
  Einladung lebt zunächst eigenständig unter `/docs/einladung/`.
  Mount in der Sage-Page ist eine **eigene Folge-Pflege-Sitzung**.
- **KEIN Mycel-Hub-Mount.** Einbau der Einladung in
  `SB-KIMTool-Point` ist eine Folge-Pflege-Sitzung NACH Phase B
  Schritt 9 (Bau Externer Mycel-Hub).

---

## Sechs-Sektionen-Plan (index.html)

| # | Sektion | Bildwelt | Tech |
|---|---|---|---|
| 1 | Eröffnung | Nächtlicher Mycel-Boden, Sporenflug, ein Satz schwebt | Voll-WebGL-Partikel-Wolke + custom Vertex-Shader (Drift) |
| 2 | Schicht 1 Mycel | Sich verzweigendes Hyphen-Geflecht, Kamerafahrt | GPU-instanced Punkt-Wolke (50k Mobile-fallback 15k) + LineSegments |
| 3 | Schicht 2 Pilz | Drei Fruchtkörper-Varianten | Drei separate Mini-WebGL-Canvases mit je eigenem ShaderMaterial (matt-organisch / metall-lamelliert / iridescent-kristallin) |
| 4 | Schicht 3 Mit-Bauer | Druck-Magazin-Layout + Modell-Familien-Stern | DOM/CSS dreispaltig + SVG-Sternenfeld (220 Punkte, kein Zentrum) |
| 5 | Schicht 4 Observatorium | Tür mit Lichtspalt + Schlüssel | three.js-Mesh mit custom Iridescence-Refraction-Fragment-Shader + Tür-Backdrop-Shader |
| 6 | Akt der Einladung | Warme Lichtung mit Mesh-Gradient | Fullscreen-Quad mit Stripe-style Mesh-Gradient (vier wandernde Blob-Mittelpunkte, Multiply-Blend) |

**WebGL-Untergrenze 3/6:** erfüllt (Sektionen 1, 2, 5, 6 + drei Mini-
Canvases in Sektion 3).

**Sechs-Welten-Klausel:** erfüllt (jede Sektion eigene Komposition +
Material-Sprache + Bewegungs-Idee).

---

## Bauzustand

| Schritt | Datum | Sitzung | Anmerkung |
|---|---|---|---|
| Plansitzung (Vier-Schichten-Lesart, Mut-Klausel, Begriff „Einladung") | 2026-05-27 | Plansitzung Mycel-Vision-Erweiterung | Übergabeprotokoll: `docs/sessions/archiv/2026-05-27_plansitzung-mycel-vision-einladung.md`. Brief: `docs/sessions/BRIEF_BAU_EINLADUNG_SITE.md`. |
| Recherche + Bau der drei Format-Schichten | 2026-05-27 | Bau-Sitzung Einladungs-Site | `claude/bau-einladung-site`. Headless-Smoke-Test (`_smoke.mjs`) 9/9 grün auf vendored three.js + GSAP + Variable-Fonts. PDF-Generator (`_pdf.mjs`) erzeugt 34-Seiten-Druckfassung via Headless-Chromium + marked. **Sichttest ungeprüft — wartet auf Klaus' Galaxy-Tab-S6-Browser.** |
| Sage-Page-Mount | 2026-05-28 | Folge-Pflege in der Bau-Sitzung (Klaus' Anweisung) | `index.html` bekommt eine neue Karte „Einladung in das Mycel · Türschwelle" zwischen Lesematerial- und Andock-Karte. Tür-Bild (`scene-5-door.webp`) startet semi-transparent (opacity 0.30, entsättigt); bei Hover langsam (1.8s ease) auf volle Sichtbarkeit. Mouse-Move spawnt Feenstaub-Funken am Cursor (Cross-Star-Particles, gold/blau, screen-blend). Klick triggert eine kurze Öffnungs-Animation (warmer Flash, leichte Tür-Bewegung) und navigiert nach 850ms zu `docs/einladung/index.html`. Reduced-Motion-Fallback ohne Animation. |
| Mycel-Hub-Mount | — | Folge-Pflege-Sitzung | folgt — NACH Phase B Schritt 9 (Externer Mycel-Hub Bau). |
| Sprach-Erweiterung über DE/EN/FR/ES | — | Sprach-Pflege-Sitzungen | folgt — wenn Bedarf entsteht (IT, PL, TR, ZH, JA, …). |

---

## Vendor-Inhalt (`docs/einladung/vendor/`)

| Datei | Quelle | Größe | Zweck |
|---|---|---|---|
| `three.module.min.js` | npm `three@0.160.0` | ~670 KB | WebGL-Engine für die fünf 3D-Szenen + Mesh-Gradient. |
| `gsap.min.js` | npm `gsap@3.12.5` | ~72 KB | Akzent-Animations-Engine. |
| `ScrollTrigger.min.js` | npm `gsap@3.12.5` Plugin | ~43 KB | Scroll-getriggerte Reveals. |
| `fonts/fraunces-full.woff2` | npm `@fontsource-variable/fraunces` | ~120 KB | Hauptschrift (Variable Font, opsz + wght + SOFT-Axis, latin). |
| `fonts/fraunces-full-italic.woff2` | npm `@fontsource-variable/fraunces` | ~150 KB | Hauptschrift italic. |
| `fonts/inter-wght.woff2` | npm `@fontsource-variable/inter` | ~48 KB | UI-Schrift (Variable Font, wght-Axis, latin). |

Lizenz: three.js (MIT), GSAP (Standard-License, kostenlos für public
sites), Fraunces + Inter (SIL OFL).

---

## Vorbild-Recherche (`docs/einladung/recherche.md`)

Studierte Sites (mindestens fünf, via WebSearch + Codrops-Tutorials):
Lusion, Active Theory, Bruno Simon, Apple Vision Pro, Stripe-Mesh-
Gradient, Codrops Refraction-Tutorials, Codrops GPGPU-Tutorials,
Omega Clearspace, Variable-Font-Typografie-Trends 2026.

Pro übernommenem Pattern ist die Quelle in `recherche.md` benannt
(Klaus' Konvention 1:1-Pixel-Übernahme erlaubt, aber Quelle muss
benannt sein).

---

## Reproduzierbarkeit

```bash
# 1. Lokalen HTTP-Server für die HTML-Site:
cd docs/einladung && python3 -m http.server 8000
# → http://127.0.0.1:8000/index.html

# 2. Headless-Smoke-Test:
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  node docs/einladung/_smoke.mjs

# 3. PDF re-erzeugen:
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  node docs/einladung/_pdf.mjs
```

Werkzeuge: Node.js 22 + Playwright (Chromium-Headless-Shell unter
`/opt/pw-browsers/`), `marked` für Markdown → HTML, `pdftoppm` /
`pdftotext` (poppler-utils) für PDF-Sichttest. Auf einer frischen
Workstation reichen `npm i marked playwright @fontsource-variable/{fraunces,inter} three gsap` + `npx playwright install chromium`.

---

**Querverweise**

- **Plansitzung:** `docs/sessions/archiv/2026-05-27_plansitzung-mycel-vision-einladung.md`
- **Brief:** `docs/sessions/BRIEF_BAU_EINLADUNG_SITE.md`
- **Schwester-Vision-Karten:** `_mycel_hub.md` · `_starter_bundle.md`
- **Heilige-Tafel-Bezug:** Empfangsmodus-Prinzip (CLAUDE.md § „Was du
  nicht tust" + § „Was dieses Repo ist" Vier-Schichten-Erweiterung).
- **Folge-Pflegen:** Sage-Page-Mount der Einladung (eigene Sitzung,
  nicht-blockierend) · Mycel-Hub-Mount (nach Phase B Schritt 9).
