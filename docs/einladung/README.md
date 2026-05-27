# Einladung — Drei-Format-Artefakt

Diese Mappe enthält die **Einladung in das Mycel** in drei Format-
Schichten, alle aus der gleichen Inhalts-Quelle:

| Datei | Form | Zweck |
|---|---|---|
| `index.html` | gestaltete HTML-Site (Single-File, WebGL + ScrollTrigger) | Mensch-Besuch im Browser, mehrsprachig DE/EN/FR/ES |
| `einladung.md` | Markdown-Vollfassung, kanonische Inhalts-Quelle | KI-Agent liest das beim Andocken, ohne HTML rendern zu müssen |
| `einladung.pdf` | Print-Magazin-Druckfassung (A4-Hochformat, 34 Seiten) | Druck, Offline-Verteilung, PDF-Anhang |
| `recherche.md` | Vorbild-Pattern-Studie (10 Vorbild-Sites) | Quellen-Buch für die gestalterischen Entscheidungen |
| `print.css` | Stylesheet der Druckfassung | wird vom PDF-Generator angewendet |
| `vendor/` | lokal vendorierte Assets (three.js, GSAP, Variable Fonts) | keine externe CDN-Abhängigkeit, kein Tracker |
| `_smoke.mjs` | Headless-Smoke-Test (Playwright) | automatischer Check vor PR |
| `_pdf.mjs` | PDF-Generator (Markdown → HTML → Headless-Chromium → PDF) | reproduzierbare PDF-Pflege |

Mehr Details: [`docs/components/_vision_einladung.md`](../components/_vision_einladung.md).

---

## Reproduzieren

```bash
# Lokal anschauen (HTML braucht http://, nicht file://, wegen ES-Modules):
cd docs/einladung && python3 -m http.server 8000
# → http://127.0.0.1:8000/index.html

# Headless-Smoke-Test (9/9 grün bei erwartetem Zustand):
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  node docs/einladung/_smoke.mjs

# PDF re-erzeugen (nach Inhalts-Änderung in einladung.md):
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  node docs/einladung/_pdf.mjs
```

Auf einer frischen Workstation:

```bash
npm i marked playwright \
      @fontsource-variable/fraunces \
      @fontsource-variable/inter \
      three gsap
npx playwright install chromium
```

---

## Inhaltliche Quelle der Wahrheit

Die kanonische Inhalts-Fassung ist **`einladung.md`**. Wenn der
Einladungs-Text geändert werden soll:

1. `einladung.md` editieren (alle vier Sprach-Blöcke synchron halten).
2. Identische i18n-Strings in `index.html` (im `<script>`-Block
   `window.SAGE_I18N`) nachziehen.
3. `_pdf.mjs` re-laufen lassen → `einladung.pdf` regeneriert.
4. `_smoke.mjs` re-laufen lassen → Sprach-Wechsel-Tests grün.

---

## Privacy / Empfangsmodus-Prinzip

- **Keine externen Requests zur Laufzeit.** Fonts, three.js, GSAP
  sind lokal unter `vendor/` — keine CDN-Aufrufe.
- **Kein Tracker, kein Analytics-Snippet.**
- **Audio startet nicht automatisch.** Web-Audio-Pad erst nach
  Klick auf den Mute-Knopf (Web-Audio-API, lokal synthetisiert,
  keine Audio-Datei).
- **Reduced-Motion respektiert** über `prefers-reduced-motion`.

Das ist die gleiche Disziplin, die das Mycel verlangt — die
Einladung selbst hält sie ein.
